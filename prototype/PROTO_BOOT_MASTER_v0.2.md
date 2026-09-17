# PROTO BOOT MASTER v0.2

STATE=TEST_PROTOTYPE
SCOPE=GENERIC_PILOT_PUBLIC_SOURCE_BOOT_ONLY
SOURCE_MODE=PUBLIC_ANONYMOUS_READ
RELATIONSHIP_IDENTITY=NONE
SAGA_SPECIFIC=NO
MANUEL_SPECIFIC=NO

## Purpose
Prove that a fresh ordinary ChatGPT client can read the shared authoritative pilot-method Source through public web/HTTPS access, resolve the current approved boot marker, and do so without a GitHub account, GitHub connector, or private-repository authentication.

## Preconditions
- INTERNET_REQUIRED=TRUE
- PUBLIC_SOURCE_REQUIRED=TRUE
- AUTH_REQUIRED=FALSE
- REPO=morgul-tech/proto-pilot-method-source
- SOURCE_UNREACHABLE_OR_UNREADABLE=>BOOT_FAIL
- CONNECTED_GITHUB_ACCESS_IS_NOT_REQUIRED_AND_MUST_NOT_BE_USED_FOR_THIS_CANARY

## Boot sequence
1. Read `channels/pilot.json` fresh from the public repository using ordinary public web/HTTPS access.
2. Confirm the channel declares `source_mode=public_anonymous_read` and `auth_required=false`.
3. Extract `probe_version`, `canary_path`, and `expected_marker`.
4. Read the exact file at `canary_path` from the same public repository using ordinary public web/HTTPS access.
5. Compare the observed marker to `expected_marker` exactly.
6. Return the receipt below.
7. Do not infer PASS from repository visibility alone.
8. Do not invoke GJENKLANG or create/modify relationship state; this is only a standalone source-path proof.

## Receipt
```text
BOOT_CLIENT=PROTO_BOOT_MASTER_v0.2
SOURCE_REPO=morgul-tech/proto-pilot-method-source
SOURCE_MODE=PUBLIC_ANONYMOUS_READ
PUBLIC_SOURCE_REACHED=YES|NO
ACCESS_PATH=PUBLIC_WEB|CONNECTED_GITHUB|UNKNOWN
AUTH_REQUIRED=NO|YES|UNKNOWN
CHANNEL_RESOLVED=YES|NO
PROBE_VERSION=<value|UNKNOWN>
EXPECTED_MARKER=<value|UNKNOWN>
OBSERVED_MARKER=<value|UNKNOWN>
MARKER_MATCH=YES|NO|UNKNOWN
BOOT_PASS=YES|NO
FAIL_REASON=<NONE|PUBLIC_SOURCE_UNREACHABLE|NONPUBLIC_OR_AUTH_REQUIRED|CHANNEL_READ_FAIL|MARKER_READ_FAIL|MARKER_MISMATCH|ACCESS_PATH_NOT_PUBLIC|OTHER>
```

## PASS rule
`BOOT_PASS=YES` only when the authoritative public repository is reached through `PUBLIC_WEB`, `channels/pilot.json` is read fresh, it declares anonymous public read with no auth requirement, the referenced canary is read fresh through the same public path, and the marker matches exactly.

## Boundary
This prototype is not Saga, not Manuel, not a relationship instance, and does not invoke GJENKLANG or ETTERKLANG. It contains no Human-private state. It proves only the public shared Source read path needed before the Manuel bootstrap body is matured.
