# Proto Pilot — current public BOOT probe

Purpose: test one thing only — whether a fresh pilot client can read the shared public Source anonymously over ordinary web/HTTPS and resolve the approved boot marker before any relationship GJENKLANG.

## Current contract

1. INTERNET_REQUIRED=TRUE
2. PUBLIC_SOURCE_REQUIRED=TRUE
3. AUTH_REQUIRED=FALSE
4. Resolve `channels/pilot.json` fresh from this repository.
5. Follow the exact `boot_contract_path` declared there.
6. Read the exact canary path declared there.
7. The canary content must match the declared expected marker exactly.
8. If public repository access fails, the channel cannot be read, or the marker cannot be read/matched exactly: `BOOT_PASS=NO`.
9. The standalone probe does not invoke GJENKLANG; it only proves the Source path required by the later relationship bootstrap.

This Source contains person-agnostic pilot method/probe material only. Human-private state, diary, profile, consent values, local relationship language, private corpus, live task state, and secrets do not belong here.
