# Existing managed Docs port

This is executable connector composition, not another prose-only instruction.
It uses the existing managed Google Docs tools, one selected home JSON tab,
selected plain-text source tabs, and one separate private JSON journal Doc.
No server, RDC, installation, new account, network library or background process
is part of this code. The calling Chat surface must actually support verified
JavaScript composition and its existing managed tools. This package does not
install a hook or make a model invoke itself.

The private journal belongs under the already selected private home. It is
operational metadata, not a third life book. It holds target IDs, operation hashes,
outcomes and provider revisions; no book text or correction payload is copied
there. Explicit no-storage still forbids these hashes/metadata. No actual pilot
home, binding, journal or content belongs in this public repository.

## Load and bind

Verify the exact delivered bytes before loading. CommonJS:

```javascript
const core = require('../runtime/pilot-core.js')();
const createPort = require('../runtime/docs-port.js');
const journalFactory = require('../runtime/vendor/doc-journal-factory.js');
const sha256 = require('../runtime/sha256.js');
```

In a supported import-free JavaScript isolate, load the same four verified
files. They expose `ProtoPilotCore`, `ProtoPilotDocsPort`, `ProtoPilotSHA256` and
`CerebroDriveDocJournal` on `globalThis`. Keep native responses and private state
inside that same lawful tool isolate; do not export them to shell logs, public
fixtures, a cache or another agent merely to perform composition.

```javascript
const core = globalThis.ProtoPilotCore();
const port = globalThis.ProtoPilotDocsPort({
  core,
  getText: args => ACTUAL_GET_DOCUMENT_TEXT(args),
  batchUpdate: args => ACTUAL_BATCH_UPDATE_DOCUMENT(args),
  journalFactory: globalThis.CerebroDriveDocJournal,
  sha256: globalThis.ProtoPilotSHA256,
  newLockToken: ACTUAL_UNIQUE_LOCK_TOKEN,
  binding: PRIVATE_OWNER_SELECTED_BINDING
});
const {home, revision} = await port.readHome();
const context = core.contextBundle(home, {query: 'old letter', scope: 'letter'});
const original = await port.readSource('source-letter');
```

Upper-case callbacks are actual caller dependencies, not shipped provider
bindings or proof of permission. The included SHA callback computes SHA256 of
UTF-8 text and has independent standard-vector tests. A lock token must be unique for each acquisition, 20–200 ASCII
letters/digits/underscore/hyphen; a fixed or recycled token is not qualified.
Qualification references below must point to actual caller evidence, not merely
contain those field names. Only synthetic tests use synthetic evidence markers.

`binding` is privately selected by the lawful caller, independently of model
event payloads and source content:

```text
{
  storage: 'ALLOW' | 'DENY',
  home: {documentId, tabId, homeId, read: true, write: true, plainText: true},
  sources: [{id, locator, documentId, tabId, read: true, write: true,
             plainText: true}],
  journal: {documentId, tabId, read: true, write: true, plainText: true,
    qualification: {source_ref, revision, durability_evidence_ref,
                    exclusivity_evidence_ref}}
}
```

The port copies this binding once, so a later model mutation cannot broaden it.
`locator` must exactly match the currently read home source record. Use the
existing real verified source URL, including its tab reference if locally
selected, without inventing a URL. The source map can narrow access with DENY
or UNKNOWN; it cannot authorize a target missing from the independent binding.
A changed permission must be reflected through the lawful current caller
binding and/or narrower home record, not only through an old narrative note.
The provider remains responsible for actual account permissions.

Home and sources can use different tabs of one document. The journal must be
a separate document: journal lock writes change the whole provider revision,
which must not invalidate the book/home revision being guarded. Duplicate
document/tab targets are rejected. This is a bounded adapter for explicitly
qualified plain text; images, tables, rich structures and ambiguous formats
need their appropriate existing route and are not silently flattened.

The chosen home tab contains the complete `proto-pilot-home/v1` JSON body.
The chosen journal tab starts with exactly this one JSON object:

```json
{"schema":"cerebro-drive-doc-journal/v1","version":1,"lock":null,"operations":{}}
```

Provisioning and qualifying these private tabs is a separate legitimate setup
action. The port neither creates them nor adds sharing/access rights. A read-only
port can omit journal, lock callback and hash callback. Mutation requires all.

## Actual response/operation shapes

`getText({document_id,tab_id})` must return the observed managed connector
shape directly or inside `structuredContent`:

```text
{documentId, tabId, revisionId,
 paragraphs:[{text,startIndex,endIndex,tabId}, ...]}
```

Text is reconstructed with one newline between returned paragraphs. Every
paragraph must carry the same actual tab ID and valid ordered native indices.
Missing/wrong document, tab or revision, `isError`, error responses, overlapping
paragraphs or unsupported shapes are rejected. The requested ID is never filled
in as though the provider observed it.

Writes use only exact `replaceAllText`, `matchCase:true`, selected
`tabsCriteria.tabIds`, and actual `write_control.requiredRevisionId`. There must
be exactly one occurrence. Readback checks the whole admitted plain-text tab,
not merely the changed snippet or an echoed write receipt. No automatic rebase
or provider write retry occurs.

## API and observed-result boundaries

- `readHome()` → `{home,revision}` after full schema and optional home-ID check.
- `readSource(sourceId)` → `{sourceId,text,revisionId}`. Independent whitelist,
  current home's exact locator and narrower access disposition are checked
  before protected source fetch.
- `mutateHome({event})` → `{status,home,revision}` using core `applyEvent`.
  Stable event ID becomes operation ID. Same ID/different intent fails.
- `replaceBookText({operationId,sourceId,expectedRevision,before,after})`
  performs a unique exact replacement at that source's qualified target and
  expected provider revision. `status` is APPLIED, REPLAY or RECONCILED.

For example, after actually reading the book:

```javascript
const original = await port.readSource('source-letter');
const result = await port.replaceBookText({
  operationId: 'one-real-logical-operation', sourceId: 'source-letter',
  expectedRevision: original.revisionId, before: 'at 17', after: 'at 18'
});
```

The port serializes its own calls. The Source donor additionally acquires an
exclusive journal token through provider revision CAS. It persists PREPARED
and ATTEMPTED before content mutation. Verified target effect then becomes
VERIFIED; mismatch/missing readback becomes UNKNOWN. A subsequent same-ID call
only observes/reconciles, never blindly repeats content mutation, even when
the text seems unchanged. Changing ID to bypass an unresolved attempt is not
authorized. A failed/unknown journal acquisition or release remains a concrete
owner-reconciliation rest; no stale lock is stolen.

A response error with exact independent observed success can return RECONCILED.
An unknown home mutation can be recognized later through the core's matching
applied-event ledger. A later independent home event need not erase that proof.
Book replay instead requires the exact recorded final whole-tab text digest;
later legitimate drift is surfaced for owner reconciliation, not overwritten.

Journal lock/release writes may occur on an exact replay: they are housekeeping,
not repeat book/home writes. There is no claim of zero provider writes on replay.
This preserves the Source donor's contract and existing qualification boundary.

The independent binding's DENY rejects mutations before provider calls. A
currently read home's storage DENY rejects before any journal/hash persistence.
An observed source denial or changed locator rejects before source access.
This is not universal enforcement: a later external permission/policy change,
direct tools bypassing the adapter, caller compromise or unobserved concurrency
is not made safe by a JSON field. Actual caller custody, provider permissions
and current local mandate remain necessary. Effects outside this selected route
are not covered.

## Validation

`node --test candidate/spine-chat-r2/tests/docs-port.test.cjs` runs synthetic
provider doubles that discriminate identity/tab mismatch, scope denial, no-storage,
same-ID intent conflict, stale/concurrent revision, retained uncertainty across
reconstruction, response loss after success, readback mismatch, exact replay,
source-map narrowing and no-steal journal lock. Import-free loading is also
tested. These tests do not prove real provider behavior or ordinary pilot use.
The parent delivery records any real managed-tool trial separately.

The byte-identical donor and its exact origin are recorded in docs/SOURCE-LINEAGE.json.
The placement factory is intentionally not imported as a generic bookwriter;
this new adapter owns the narrower native text correction behavior.
