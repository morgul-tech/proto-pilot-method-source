# PROTO PILOT TINY BOOT MASTER v0.2.0

STATE=FROZEN_SOURCE_PATH_BASELINE
SCOPE=GENERIC_PILOT_SHARED_SOURCE_BOOTSTRAP
RELEASE_ID=boot-source-v0.2.0
SOURCE_MODE=PUBLIC_ANONYMOUS_READ
RELATIONSHIP_IDENTITY=NONE
PRIVATE_STATE_ALLOWED=NO
GJENKLANG_EFFECT=NO
SAGA_SPECIFIC=NO
MANUEL_SPECIFIC=NO

## Purpose
Establish the smallest proven public Source path that later pilot bootstrap bodies may depend on.

This artifact proves source reachability and exact release binding only. It does not create a Human relationship, private state, consent state, diary, project state, or lifecycle effect.

## Invariants
- INTERNET_REQUIRED=TRUE
- PUBLIC_SOURCE_REQUIRED=TRUE
- AUTH_REQUIRED=FALSE
- REPO=morgul-tech/proto-pilot-method-source
- MUTABLE_CHANNEL_NE_IMMUTABLE_RELEASE
- PRIVATE_HUMAN_STATE_NE_PUBLIC_SOURCE
- SOURCE_READ_FAIL=>BOOT_FAIL
- NO_OFFLINE_FALLBACK_CURRENT_PILOT

## Binding sequence
1. Resolve the mutable `channels/pilot.json` pointer from public `main`.
2. Require `source_mode=public_anonymous_read` and `auth_required=false`.
3. Read the channel-declared `release_commit`, `manifest_path`, `boot_master_path`, `canary_path`, and `expected_marker`.
4. Fetch the manifest, this master, and the canary from the exact declared `release_commit`, never from moving `main`.
5. Confirm all observed paths and release identifiers agree with the manifest.
6. Compare the canary content exactly with `expected_marker`.
7. Emit a source-binding receipt.
8. Stop. GJENKLANG belongs to a later relationship bootstrap body, not this tiny master.

## Source-binding receipt
```text
BOOT_TINY_MASTER=PROTO_PILOT_TINY_BOOT_MASTER_v0.2.0
SOURCE_REPO=morgul-tech/proto-pilot-method-source
SOURCE_MODE=PUBLIC_ANONYMOUS_READ
CHANNEL_RESOLVED=YES|NO
RELEASE_ID=<value|UNKNOWN>
RELEASE_COMMIT=<sha|UNKNOWN>
MANIFEST_RESOLVED=YES|NO
MASTER_RESOLVED=YES|NO
CANARY_RESOLVED=YES|NO
EXPECTED_MARKER=<value|UNKNOWN>
OBSERVED_MARKER=<value|UNKNOWN>
MARKER_MATCH=YES|NO|UNKNOWN
SOURCE_BINDING_PASS=YES|NO
FAIL_REASON=<NONE|PUBLIC_SOURCE_UNREACHABLE|CHANNEL_READ_FAIL|RELEASE_READ_FAIL|MANIFEST_MISMATCH|MASTER_MISMATCH|CANARY_READ_FAIL|MARKER_MISMATCH|OTHER>
```

## PASS rule
`SOURCE_BINDING_PASS=YES` only when the public channel resolves, the declared immutable release commit is used for all release reads, manifest/master/canary identities are coherent, and the exact canary marker matches.

## Boundary
This frozen baseline is person-agnostic. It contains no Human-private state and grants no action authority. It may be reused by independent pilot relationships only as shared method/source substrate.
