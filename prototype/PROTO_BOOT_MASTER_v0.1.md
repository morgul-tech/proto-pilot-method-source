# PROTO BOOT MASTER v0.1

STATE=TEST_PROTOTYPE
SCOPE=GENERIC_PILOT_BOOT_ONLY
RELATIONSHIP_IDENTITY=NONE
SAGA_SPECIFIC=NO
MANUEL_SPECIFIC=NO

## Purpose
Prove that a fresh ChatGPT client can authenticate read-only to the shared authoritative pilot-method Source and resolve the current approved boot marker.

## Preconditions
- INTERNET_REQUIRED=TRUE
- AUTHORIZED_SOURCE_REQUIRED=TRUE
- REPO=morgul-tech/proto-pilot-method-source
- SOURCE_AUTH_FAIL=>BOOT_FAIL
- SOURCE_UNREACHABLE=>BOOT_FAIL

## Boot sequence
1. Read `channels/pilot.json` from the authoritative repo.
2. Extract `probe_version`, `canary_path`, and `expected_marker`.
3. Read the exact file at `canary_path` from the same repo.
4. Compare the observed marker to `expected_marker` exactly.
5. Return the receipt below.
6. Do not infer PASS from repo visibility alone.

## Receipt
```text
BOOT_CLIENT=PROTO_BOOT_MASTER_v0.1
SOURCE_REPO=morgul-tech/proto-pilot-method-source
SOURCE_REACHED=YES|NO
AUTHORIZED_READ=YES|NO
CHANNEL_RESOLVED=YES|NO
PROBE_VERSION=<value|UNKNOWN>
EXPECTED_MARKER=<value|UNKNOWN>
OBSERVED_MARKER=<value|UNKNOWN>
MARKER_MATCH=YES|NO|UNKNOWN
BOOT_PASS=YES|NO
FAIL_REASON=<NONE|SOURCE_UNREACHABLE|AUTH_FAIL|CHANNEL_READ_FAIL|MARKER_READ_FAIL|MARKER_MISMATCH|OTHER>
```

## PASS rule
BOOT_PASS=YES only when the authoritative repo is reached, authorized read succeeds, `channels/pilot.json` is read fresh, the referenced marker file is read fresh, and the exact marker matches.

## Boundary
This prototype is not Saga, not Manuel, not a relationship instance, and does not invoke GJENKLANG or ETTERKLANG. It is only a standalone boot client for proving the shared Source path.
