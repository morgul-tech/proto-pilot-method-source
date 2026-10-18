# Proto Pilot — current public BOOT probe

Purpose: test one thing only — whether a fresh pilot client can read the shared
public Source anonymously over ordinary web/HTTPS and resolve the approved boot
marker before any relationship GJENKLANG.

Reading this document does not start BOOT or GJENKLANG.

## Public reading entry

The repository's [README](README.md) distinguishes source-binding, shared method,
ordinary continuity and candidate material. This probe needs only this public
repository. No private workspace, laboratory repository or credential is required.

## Current channel contract

1. `INTERNET_REQUIRED=TRUE`
2. `PUBLIC_SOURCE_REQUIRED=TRUE`
3. `AUTH_REQUIRED=FALSE`
4. Resolve [`channels/pilot.json`](channels/pilot.json) fresh from public `main`.
   Require `source_mode=public_anonymous_read` and `auth_required=false`.
5. Read the declared `release_id`, `release_commit`, `manifest_path`,
   `manifest_sha256`, `boot_master_path`, `canary_path` and `expected_marker`.
   The master field is `boot_master_path`; the channel does not declare
   `boot_contract_path`.
6. Fetch the manifest, master and canary from the exact declared
   `release_commit`, using the declared paths. Do not read release payloads
   from moving `main` or replace their commit with the repository HEAD.
7. Check the manifest hash and its release identity, paths and file hashes.
   Follow the frozen master for the source-binding receipt and PASS rule.
   Compare the canary's marker with the declared `expected_marker`; the
   manifest binds the complete file bytes, including the line ending.
8. If public repository access fails, the channel cannot be read, the immutable
   release does not match, or the marker cannot be read/matched exactly:
   `BOOT_PASS=NO`. Preserve the specific failure and its source pointer.
9. The standalone probe stops after source binding. It does not invoke
   GJENKLANG or establish a relationship, private state, consent or action
   authority.

The frozen [boot-source v0.2.0 master](https://github.com/morgul-tech/proto-pilot-method-source/blob/0060e04eecb144c651c03889f9b3f69d680c7d40/versions/boot-source/0.2.0/PROTO_PILOT_TINY_BOOT_MASTER.md)
describes the existing binding sequence. Current selection belongs to
`channels/pilot.json`; this navigation document does not select a channel,
modify an immutable release or adopt a method for a living pilot.

## Boundary and Way Home

This Source contains person-agnostic pilot method/probe material only.
Human-private state, diary, profile, consent values, local relationship language,
private corpus, live task state and secrets do not belong here.

For a failed source read, return to the current public channel and the exact
declared release manifest. Keep a source-read failure distinct from an unknown
pilot-local relationship or provider capability. A historical receipt or
authenticated repository read is not fresh proof of anonymous access.
