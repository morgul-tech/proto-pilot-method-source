# Proto Pilot — minimal BOOT probe

Purpose: test one thing only — whether a pilot client can authenticate to the shared private Source and read the approved boot marker before GJENKLANG.

## Contract

1. INTERNET_REQUIRED=TRUE
2. AUTHORIZED_SOURCE_REQUIRED=TRUE
3. Resolve `channels/pilot.json` from this repository.
4. Read the exact canary path declared there.
5. The canary content must match the declared expected marker exactly.
6. If repository access/authentication fails, or the marker cannot be read exactly: `BOOT_PASS=NO`.
7. Only after exact readback: `BOOT_PASS=YES` and GJENKLANG may begin.

This probe contains no Human-private state, diary, profile, local relationship language, or local project topology.
