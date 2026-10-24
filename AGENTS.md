# Maintaining the shared pilot method

This is a PUBLIC, person-independent method repository. Private reports, books,
local profiles, account identifiers, credentials and test-document URLs do not
belong here. Work from the current task and the chosen package's full source;
do not infer a pilot's actual installed method from repository HEAD.

Preserve released files under `versions/` and the BOOT/source channel unless the
task explicitly authorizes a release change. New method work belongs in its own
candidate directory and reviewable branch. Do not silently merge other candidate
branches or change `channels/pilot.json` while editing the Chat spine.

For `candidate/spine-chat-r1`, read its README, complete METHOD, UPDATE and
validation README before substantive changes. After changes, update its manifest
from the actual bytes and run `validation/verify_package.py`. The manifest itself
is pinned by the delivered Git commit or outer package hash, not self-hashed.
Use independent review for semantic changes where needed; do not confuse hash
validation with behavioral proof. Preserve exact source lineage and report what
was actually tested.

The Chat spine must remain usable with the recipient's existing Chat and
available Drive/GitHub tools. Maintainer Python tools are not recipient software
requirements. A new server, RDC, account or application is not a prerequisite.
This AGENTS file guides tools that actually load it; it does NOT auto-install the
method in ordinary Chat. The pilot's chosen project/continuity entry is separate.

Distinguish authored package, local adoption, observed re-entry and later useful
effect. Never claim that text instructions are deterministic hooks or that tests
in a maintainer's client prove behavior in a recipient's chat. Method-only
rollback preserves local books, experience, permissions and unresolved effects.

For functional `candidate/spine-chat-r2`, read README.md, complete METHOD.txt,
ADOPT.md and the affected runtime contract. This directory has executable
import-free JS, synthetic tests and a pinned Source donor. Run relevant tests
and the package verifier after changes. Preserve donor bytes/provenance and
private bindings. Existing boot/source releases and channel remain separate.
