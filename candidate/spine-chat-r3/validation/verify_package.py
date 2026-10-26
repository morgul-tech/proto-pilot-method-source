"""Maintainer-only package verification; no recipient Python requirement."""
import hashlib, json, pathlib, sys
root = pathlib.Path(sys.argv[1] if len(sys.argv)>1 else pathlib.Path(__file__).resolve().parents[1]).resolve()
manifest = json.loads((root/'manifest.json').read_text(encoding='utf-8'))
seen=set()
for entry in manifest['files']:
    rel=entry['path']; path=(root/rel).resolve()
    if rel in seen or not path.is_relative_to(root) or path==root or '\\' in rel:
        raise SystemExit('Unsafe or duplicate member: '+rel)
    seen.add(rel); raw=path.read_bytes()
    if len(raw)!=entry['bytes'] or hashlib.sha256(raw).hexdigest()!=entry['sha256']:
        raise SystemExit('Changed member: '+rel)
actual={p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file() and p.name!='manifest.json' and '__pycache__' not in p.parts}
if actual!=seen: raise SystemExit('Unexpected or missing members: '+repr(actual^seen))
print('PASS: '+str(len(seen))+' exact package members; integrity only, not behavior')
