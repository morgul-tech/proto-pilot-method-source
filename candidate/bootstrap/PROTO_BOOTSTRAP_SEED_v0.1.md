# PROTO BOOTSTRAP SEED v0.1

STATE=LIVING_CANDIDATE
ROLE=LOCAL_PROJECT_SOURCE_LOCATOR_AND_FAIL_CLOSED_BOOT_CONTRACT
HUMAN_PRIVATE_STATE=NONE

This seed is intentionally small. It is not the Proto method, not relationship memory, and not a cached fallback copy.

## Canonical public source
REPO=morgul-tech/proto-pilot-method-source
PUBLIC_CHANNEL_PATH=channels/pilot.json
INTERNET_REQUIRED=TRUE
OFFLINE_FALLBACK=NO

## Candidate package under test
PACKAGE_ID=proto-bootstrap-v0.1-candidate
PACKAGE_COMMIT=acb675dacfc4a7b0d8bb965c01c65150173c9def
PACKAGE_MANIFEST=candidate/bootstrap/BOOTSTRAP_PACKAGE_MANIFEST_v0.1.json
EXPECTED_PACKAGE_CANARY=PROTO_PILOT_BOOTSTRAP_PACKAGE_CANARY=v0.1

## On first activation
1. Read `channels/pilot.json` fresh from the public repository using ordinary public web/HTTPS.
2. Resolve and validate the exact immutable shared Source release declared there.
3. Fetch `PACKAGE_MANIFEST` from exact `PACKAGE_COMMIT`, not from moving main.
4. Confirm the manifest depends on the same validated Source release.
5. Fetch every manifest file from exact `PACKAGE_COMMIT` and verify its SHA256.
6. Verify the package canary exactly.
7. Load the bootstrap body + private continuity method + exact Project Instructions semantics.
8. Only then continue the first-relationship bootstrap defined by the body.

## Fail closed
If Source, release, package commit, manifest, digest, or canary cannot be proven exactly: `BOOTSTRAP_PACKAGE_PASS=NO` and HOLD before GJENKLANG relationship effects.
Do not substitute remembered content, moving-main content, another Human's state, or a guessed equivalent.

## Receipt
```text
BOOTSTRAP_SEED=PROTO_BOOTSTRAP_SEED_v0.1
PUBLIC_SOURCE_PASS=YES|NO
SOURCE_RELEASE_ID=<value|UNKNOWN>
SOURCE_RELEASE_COMMIT=<value|UNKNOWN>
PACKAGE_ID=proto-bootstrap-v0.1-candidate
PACKAGE_COMMIT=acb675dacfc4a7b0d8bb965c01c65150173c9def
PACKAGE_MANIFEST_READ=YES|NO
PACKAGE_SOURCE_DEPENDENCY_MATCH=YES|NO|UNKNOWN
PACKAGE_FILE_HASHES=PASS|FAIL|UNKNOWN
PACKAGE_CANARY_MATCH=YES|NO|UNKNOWN
BOOTSTRAP_PACKAGE_PASS=YES|NO
HOLD_REASON=<NONE|value>
```

This seed grants no external-effect authority and contains no consent answer or Human-specific preload.
