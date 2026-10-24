# proto-pilot-method-source

Shared read-only method Source for the Proto pilot cohort. No Human-private state.

This public repository supplies person-agnostic source-binding and shared-method
material. Its minimum reading paths use public HTTPS and require neither a private
workspace nor credentials. Repository access does not establish a relationship,
select a method for a pilot, install a release, or grant action authority.

## Choose the minimum reading path

| Need | Start here | Continue with |
|---|---|---|
| Understand the public source-binding probe | [BOOT.md](BOOT.md) | [The pilot channel](channels/pilot.json), then the manifest, master and canary at the exact `release_commit` declared by that channel |
| Read the immutable Spine method package | [Spine v0.1.0 manifest](versions/spine/0.1.0/manifest.json) | [Ordinary Start Card](versions/spine/0.1.0/PILOT_SPINE_START_CARD.md) and [full shared method](versions/spine/0.1.0/PILOT_SPINE_METHOD.md) |
| Understand an already authorized method update | [Existing Pilot Method Update](versions/spine/0.1.0/EXISTING_PILOT_METHOD_UPDATE.md) | The actual selected method and current relationship on that pilot's authorized local surface |
| Inspect proposed material | [candidate/](candidate/) | The candidate's own identity, manifest and scope; its presence does not select or adopt it |
| Review the installation-free Chat spine candidate | [Chat spine rev1](candidate/spine-chat-r1/README.txt) | Complete method, short entry, local update/rollback and explicit evidence limits; no new server, RDC or account required |
| Use the functional Chat spine upgrade | [Chat spine rev2](candidate/spine-chat-r2/README.md) | Source map, decision/work/learning core, managed Docs adapter, actual connector evidence and concrete local adoption; no recipient server/RDC installation |

The current channel and an immutable release have different jobs. Resolve
`channels/pilot.json` from current public `main` when a task requires current
source selection. Resolve its release files from its declared exact commit.
Do not substitute the repository's current HEAD for that release commit.

The immutable Spine package is separate from the BOOT source identity. Its
[manifest](versions/spine/0.1.0/manifest.json) keeps selection and uptake external
to the package. A package in this repository is not proof that a living pilot
uses it or that it has produced a useful field result.

## Scope and Way Home

Source-binding proves the declared public source path and exact release binding.
It has no Gjenklang or private-state effect. The ordinary Start Card is a lookup
entry, not a lifecycle trigger or private memory store.

Shared method semantics stay here. Actual relationship state, consent, generation,
Diary/Stambok, original artifacts and access remain on the separately authorized
local continuity surface. An unresolved local binding remains `UNKNOWN`; do not
substitute another person's state, a remembered installation or an old receipt.

For a source-path problem, return to [BOOT.md](BOOT.md) and the current
[channel](channels/pilot.json), then the exact release manifest. For a local
continuity or adoption problem, use that pilot's existing authorized Way Home.
Private workspaces, synthetic laboratory access and credentials are not
prerequisites for reading the public method.
