# PROTO BOOTSTRAP SEED v0.4

STATE=LIVING_CANDIDATE
ROLE=MINIMAL_CLIENT_VERIFIABLE_BOOT_CONTRACT
HUMAN_PRIVATE_STATE=NONE

REPO=morgul-tech/proto-pilot-method-source
PUBLIC_CHANNEL_PATH=channels/pilot.json
SOURCE_RELEASE_ID=boot-source-v0.2.0
SOURCE_RELEASE_COMMIT=0060e04eecb144c651c03889f9b3f69d680c7d40

BUNDLE_ID=proto-bootstrap-bundle-v0.1-candidate
BUNDLE_PATH=candidate/bootstrap/PROTO_BOOTSTRAP_BUNDLE_v0.1.md
BUNDLE_COMMIT=2b2ed44607392790c5e21c224e0b42ddfb859299
BUNDLE_GITHUB_BLOB_SHA=9526c916cf9cb97462926e07cbbef923eccc001d
EXPECTED_BUNDLE_CANARY=PROTO_PILOT_BOOTSTRAP_BUNDLE_CANARY=v0.1

## Read-only verification
1. Read `channels/pilot.json` fresh through ordinary public web/HTTPS and confirm the current immutable shared Source release is the expected release above.
2. Query GitHub Contents metadata for exactly `BUNDLE_PATH` at exactly `BUNDLE_COMMIT`.
3. Compare provider-returned `sha` exactly to `BUNDLE_GITHUB_BLOB_SHA`.
4. Read the exact bundle content from `BUNDLE_COMMIT`.
5. Confirm its declared SOURCE_RELEASE_ID/SOURCE_RELEASE_COMMIT match the current Source binding and its CANARY matches EXPECTED_BUNDLE_CANARY.
6. If all checks pass: BOOTSTRAP_BUNDLE_PASS=YES.
7. STOP before relationship bootstrap, consent, private state or GJENKLANG unless separately instructed.

Do not compute SHA256. Do not follow moving-main for the bundle. Do not guess.

## Receipt
BOOTSTRAP_SEED=PROTO_BOOTSTRAP_SEED_v0.4
PUBLIC_SOURCE_PASS=YES|NO
SOURCE_RELEASE_ID=<value|UNKNOWN>
SOURCE_RELEASE_COMMIT=<value|UNKNOWN>
BUNDLE_METADATA_READ=YES|NO
BUNDLE_BLOB_SHA_MATCH=YES|NO|UNKNOWN
BUNDLE_CONTENT_READ=YES|NO
BUNDLE_SOURCE_DEPENDENCY_MATCH=YES|NO|UNKNOWN
BUNDLE_CANARY_MATCH=YES|NO|UNKNOWN
BOOTSTRAP_BUNDLE_PASS=YES|NO
HOLD_REASON=<NONE|value>

This seed grants no relationship-state or unrelated external-effect authority.