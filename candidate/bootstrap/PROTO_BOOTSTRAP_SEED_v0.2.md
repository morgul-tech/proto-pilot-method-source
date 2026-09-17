# PROTO BOOTSTRAP SEED v0.2

STATE=LIVING_CANDIDATE
ROLE=LOCAL_PROJECT_SOURCE_LOCATOR_AND_CLIENT_VERIFIABLE_BOOT_CONTRACT
HUMAN_PRIVATE_STATE=NONE

This seed keeps v0.1 package contents unchanged and changes only the client-verification method after a fresh public-web ChatGPT proved that raw-byte SHA256 computation is unavailable.

## Canonical public source
REPO=morgul-tech/proto-pilot-method-source
PUBLIC_CHANNEL_PATH=channels/pilot.json
INTERNET_REQUIRED=TRUE
OFFLINE_FALLBACK=NO

## Package under test
PACKAGE_ID=proto-bootstrap-v0.1-candidate
PACKAGE_COMMIT=acb675dacfc4a7b0d8bb965c01c65150173c9def
PROOF_COMMIT=014ae1eeabf3d1124a7e90235fa3fccab9da1cb1
PROOF_PATH=candidate/bootstrap/BOOTSTRAP_PACKAGE_PROOF_v0.2.json
EXPECTED_PACKAGE_CANARY=PROTO_PILOT_BOOTSTRAP_PACKAGE_CANARY=v0.1

## On read-only verification
1. Read `channels/pilot.json` fresh from the public repository using ordinary public web/HTTPS.
2. Resolve and validate the exact immutable shared Source release declared there.
3. Fetch `PROOF_PATH` from exact `PROOF_COMMIT`.
4. Confirm the proof record names exact `PACKAGE_COMMIT` above.
5. For every declared package path, query public GitHub contents metadata at exact `PACKAGE_COMMIT` and compare the provider-returned `sha` string to the declared `github_blob_sha` exactly.
6. Read the package canary content at exact `PACKAGE_COMMIT` and compare its text exactly to `EXPECTED_PACKAGE_CANARY`.
7. PASS requires all file identities and the canary to match.
8. STOP before relationship bootstrap, consent, private state, or GJENKLANG unless separately instructed.

## Important
Do not compute SHA256 if the client cannot do so. Do not downgrade inability to compute SHA256 into package failure when the exact immutable commit, provider blob identities, and canary can be proven instead.
Do not use moving-main file content as a substitute for exact-commit identity.

## Receipt
```text
BOOTSTRAP_SEED=PROTO_BOOTSTRAP_SEED_v0.2
PUBLIC_SOURCE_PASS=YES|NO
SOURCE_RELEASE_ID=<value|UNKNOWN>
SOURCE_RELEASE_COMMIT=<value|UNKNOWN>
PACKAGE_ID=proto-bootstrap-v0.1-candidate
PACKAGE_COMMIT=acb675dacfc4a7b0d8bb965c01c65150173c9def
PROOF_RECORD_READ=YES|NO
PROOF_PACKAGE_COMMIT_MATCH=YES|NO|UNKNOWN
PACKAGE_FILE_IDENTITIES=PASS|FAIL|UNKNOWN
PACKAGE_CANARY_MATCH=YES|NO|UNKNOWN
BOOTSTRAP_PACKAGE_PASS=YES|NO
HOLD_REASON=<NONE|value>
```

This seed grants no relationship-state or external-effect authority.