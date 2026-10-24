"""Maintainer-only portable package integrity check; Python standard library."""
from pathlib import Path, PurePosixPath
import hashlib
import json
import sys


def verify(root):
    root = Path(root).resolve()
    manifest = json.loads((root / 'manifest.json').read_text(encoding='utf-8'))
    rows = manifest['files']
    listed = set()
    errors = []
    for row in rows:
        name = row['path']
        rel = PurePosixPath(name)
        if rel.is_absolute() or '..' in rel.parts or '\\' in name or ':' in name:
            errors.append(f'Unsafe manifest path: {name}')
            continue
        if name in listed:
            errors.append(f'Duplicate manifest path: {name}')
            continue
        listed.add(name)
        target = root.joinpath(*rel.parts)
        if not target.resolve().is_relative_to(root) or target.is_symlink():
            errors.append(f'Escaping path: {name}')
            continue
        if not target.is_file():
            errors.append(f'Missing file: {name}')
            continue
        data = target.read_bytes()
        if len(data) != row['bytes'] or hashlib.sha256(data).hexdigest() != row['sha256']:
            errors.append(f'Content mismatch: {name}')
    actual = {p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file()}
    if actual != listed | {'manifest.json'}:
        errors.append(f'Unlisted or missing members: {sorted(actual ^ (listed | {"manifest.json"}))}')
    return errors


if __name__ == '__main__':
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1]
    errors = verify(root)
    print(json.dumps({'integrity': 'FAIL' if errors else 'PASS', 'errors': errors}, ensure_ascii=False))
    raise SystemExit(bool(errors))
