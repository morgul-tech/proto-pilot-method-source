# PROTO BOOTSTRAP SEED v0.3

STATE=LIVING_CANDIDATE
ROLE=CLIENT_VERIFIABLE_PACKAGE_BOOT_CONTRACT
HUMAN_PRIVATE_STATE=NONE

Purpose: verify the current bootstrap candidate through ordinary public web/HTTPS with as few provider reads as possible.

REPO=morgul-tech/proto-pilot-method-source
PACKAGE_ID=proto-bootstrap-v0.1-candidate
PACKAGE_COMMIT=acb675dacfc4a7b0d8bb965c01c65150173c9def
PACKAGE_DIRECTORY=candidate/bootstrap
EXPECTED_CANARY=PROTO_PILOT_BOOTSTRAP_PACKAGE_CANARY=v0.1

Expected package file identities at exact PACKAGE_COMMIT:
- candidate/bootstrap/PROTO_PILOT_BOOTSTRAP_BODY_v0.1.md -> ea599890f225ee88e03e5d5ce61a350902386c98
- candidate/bootstrap/PRIVATE_CONTINUITY_MINIMUM_v0.1.md -> 212503bcb06e1e883d6c1a82204333e1425d401a
- candidate/bootstrap/PROTO_PROJECT_INSTRUCTIONS_v0.1.txt -> bbecada8e4223eac38009f751dcb384b7e88cb97
- candidate/bootstrap/ACTIVATE_GJENKLANG_v0.1.txt -> 9c96d105299ad2cf870f0786b87ace4c38297a8e
- candidate/bootstrap/BOOTSTRAP_PACKAGE_CANARY_v0.1.txt -> 039985882a831111e757e2fe3edfe30dbb860257

## Read-only verification
1. Read `channels/pilot.json` fresh through ordinary public web/HTTPS and verify the current immutable shared Source release.
2. Fetch ONE GitHub Contents directory listing at exact PACKAGE_COMMIT:
   https://api.github.com/repos/morgul-tech/proto-pilot-method-source/contents/candidate/bootstrap?ref=acb675dacfc4a7b0d8bb965c01c65150173c9def
3. From that single provider response, compare path + provider-returned `sha` for all five expected package files above.
4. Read the canary file at exact PACKAGE_COMMIT and compare its text exactly to EXPECTED_CANARY.
5. PASS only when Source binding passes, all five identities match, and canary text matches.
6. STOP before relationship bootstrap, consent, private state, or GJENKLANG unless separately instructed.

Do not compute SHA256. Do not substitute moving-main content. Do not guess.

## Receipt
```text
BOOTSTRAP_SEED=PROTO_BOOTSTRAP_SEED_v0.3
PUBLIC_SOURCE_PASS=YES|NO
SOURCE_RELEASE_ID=<value|UNKNOWN>
SOURCE_RELEASE_COMMIT=<value|UNKNOWN>
PACKAGE_ID=proto-bootstrap-v0.1-candidate
PACKAGE_COMMIT=acb675dacfc4a7b0d8bb965c01c65150173c9def
DIRECTORY_METADATA_READ=YES|NO
FILE_A_IDENTITY=PASS|FAIL|UNKNOWN
FILE_B_IDENTITY=PASS|FAIL|UNKNOWN
FILE_C_IDENTITY=PASS|FAIL|UNKNOWN
FILE_D_IDENTITY=PASS|FAIL|UNKNOWN
FILE_E_IDENTITY=PASS|FAIL|UNKNOWN
PACKAGE_FILE_IDENTITIES=PASS|FAIL|UNKNOWN
PACKAGE_CANARY_MATCH=YES|NO|UNKNOWN
BOOTSTRAP_PACKAGE_PASS=YES|NO
HOLD_REASON=<NONE|value>
```

This seed grants no relationship-state or external-effect authority.