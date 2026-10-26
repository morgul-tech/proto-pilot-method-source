'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const core = require('../runtime/pilot-core.js')();
const factory = require('../runtime/docs-port.js');
const donor = require('../runtime/vendor/doc-journal-factory.js');
const example = JSON.parse(fs.readFileSync(path.join(root, 'examples/synthetic-home.json'), 'utf8'));
const copy = x => JSON.parse(JSON.stringify(x));
const sha256 = s => crypto.createHash('sha256').update(s, 'utf8').digest('hex');
const event = {id: 'event_1', type: 'learning.disposition', expectedVersion: 0, payload: {id: 'learning-1', disposition: 'APPLIED', evidence: 'synthetic://observed'}};
function fixture(options = {}) {
  const home = copy(example);
  if (options.homeStorage) home.storage = options.homeStorage;
  if (options.sourceAccess) home.sources.find(s => s.id === 'source-book').access = options.sourceAccess;
  const records = {
    homedoc: {tab: 't.home', text: JSON.stringify(home), rev: 1},
    bookdoc: {tab: 't.book', text: 'First line.\nWe meet at 17.\nKeep this paragraph.', rev: 1},
    journaldoc: {tab: 't.journal', text: JSON.stringify({schema: 'cerebro-drive-doc-journal/v1', version: 1, lock: null, operations: {}}), rev: 1}
  };
  const binding = {storage: options.storage || 'ALLOW', home: {documentId: 'homedoc', tabId: 't.home', homeId: home.homeId, read: true, write: true, plainText: true}, sources: [{id: 'source-book', documentId: 'bookdoc', tabId: 't.book', locator: 'synthetic://book', read: true, write: true, plainText: true}], journal: {documentId: 'journaldoc', tabId: 't.journal', read: true, write: true, plainText: true, qualification: {source_ref: 'synthetic://journal', revision: 'fixture1', durability_evidence_ref: 'synthetic://mock-only', exclusivity_evidence_ref: 'synthetic://mock-cas-only'}}};
  const calls = [];
  const faults = {};
  let lockNo = 0;
  async function getText(args) {
    calls.push({kind: 'read', id: args.document_id});
    if (faults.readError === args.document_id) return {isError: true, structuredContent: {documentId: args.document_id}};
    const r = records[args.document_id];
    assert.ok(r, 'No lookup outside independently admitted targets');
    assert.equal(args.tab_id, r.tab);
    let at = 1;
    const paragraphs = r.text.split('\n').map(text => { const startIndex = at; at += text.length + 1; return {text, startIndex, endIndex: at, tabId: r.tab}; });
    return {isError: false, structuredContent: {documentId: faults.wrongDoc === args.document_id ? 'otherdoc' : args.document_id, tabId: faults.wrongTab === args.document_id ? 'other.tab' : r.tab, revisionId: 'r' + r.rev, paragraphs}};
  }
  async function batchUpdate(args) {
    calls.push({kind: 'write-attempt', id: args.document_id, args: copy(args)});
    const r = records[args.document_id];
    if (faults.concurrent === args.document_id) { delete faults.concurrent; r.rev++; }
    if (args.write_control.requiredRevisionId !== 'r' + r.rev) return {isError: true, structuredContent: {error: 'REVISION_CONFLICT'}};
    if (faults.failBefore === args.document_id) { delete faults.failBefore; throw new Error('synthetic transport interruption'); }
    const q = args.requests[0].replaceAllText;
    assert.deepEqual(q.tabsCriteria.tabIds, [r.tab]);
    assert.equal(q.containsText.matchCase, true);
    const count = r.text.split(q.containsText.text).length - 1;
    r.text = r.text.split(q.containsText.text).join(q.replaceText);
    r.rev++;
    calls.push({kind: 'committed', id: args.document_id});
    if (faults.mismatch === args.document_id) { delete faults.mismatch; r.text += ' unexpected'; }
    if (faults.failAfter === args.document_id) { delete faults.failAfter; return {isError: true}; }
    return {isError: false, structuredContent: {documentId: args.document_id, replies: [{replaceAllText: {occurrencesChanged: count}}]}};
  }
  const opts = {core, getText, batchUpdate, binding, journalFactory: donor, newLockToken: () => 'synthetic_lock_token_' + String(++lockNo).padStart(8, '0'), sha256};
  const port = factory(opts);
  return {port, opts, binding, records, faults, calls, writes: id => calls.filter(c => c.kind === 'committed' && c.id === id).length};
}
const bookOp = {operationId: 'book_1', sourceId: 'source-book', expectedRevision: 'r1', before: 'at 17', after: 'at 18'};

test('portable factories load in import-free V8 realm', () => {
  const ctx = vm.createContext({});
  for (const name of ['pilot-core.js', 'vendor/doc-journal-factory.js', 'docs-port.js']) vm.runInContext(fs.readFileSync(path.join(root, 'runtime', name), 'utf8'), ctx);
  assert.equal(vm.runInContext('typeof ProtoPilotCore + ":" + typeof CerebroDriveDocJournal + ":" + typeof ProtoPilotDocsPort + ":" + typeof require', ctx), 'function:function:function:undefined');
});
test('home event is CAS written and independently read back; exact replay has no new target write', async () => {
  const f = fixture();
  const result = await f.port.mutateHome({event});
  assert.equal(result.status, 'APPLIED');
  assert.equal(result.home.version, 1);
  assert.equal(f.writes('homedoc'), 1);
  assert.equal((await f.port.mutateHome({event})).status, 'REPLAY');
  assert.equal(f.writes('homedoc'), 1);
  assert.equal(JSON.parse(f.records.journaldoc.text).lock, null);
});
test('same operation ID cannot change its payload', async () => {
  const f = fixture();
  await f.port.mutateHome({event});
  await assert.rejects(f.port.mutateHome({event: {...event, payload: {...event.payload, evidence: 'synthetic://different'}}}), {code: 'EVENT_ID_CONFLICT'});
  assert.equal(f.writes('homedoc'), 1);
});
test('source unknown or trusted binding denial makes no provider call', async () => {
  const f = fixture();
  await assert.rejects(f.port.readSource('source-private'), {code: 'PERMISSION_DENIED'});
  assert.equal(f.calls.length, 0);
  f.binding.sources[0].read = false; // A change to the original object does not mutate admitted custody.
  assert.equal((await f.port.readSource('source-book')).sourceId, 'source-book');
});
test('later home source DENY and locator substitution narrow access before protected read', async () => {
  const f = fixture({sourceAccess: 'DENY'});
  await assert.rejects(f.port.readSource('source-book'), {code: 'PERMISSION_DENIED'});
  assert.equal(f.calls.filter(c => c.id === 'bookdoc').length, 0);
  const g = fixture();
  const h = JSON.parse(g.records.homedoc.text); h.sources.find(s => s.id === 'source-book').locator = 'synthetic://other'; g.records.homedoc.text = JSON.stringify(h);
  await assert.rejects(g.port.readSource('source-book'), {code: 'SOURCE_MAP_BINDING_MISMATCH'});
  assert.equal(g.calls.filter(c => c.id === 'bookdoc').length, 0);
});
test('external storage denial makes zero provider calls; home denial makes zero writes including journal', async () => {
  const f = fixture({storage: 'DENY'});
  await assert.rejects(f.port.mutateHome({event}), {code: 'STORAGE_DENIED'});
  assert.equal(f.calls.length, 0);
  const g = fixture({homeStorage: 'DENY'});
  await assert.rejects(g.port.mutateHome({event}), {code: 'STORAGE_DENIED'});
  assert.equal(g.calls.filter(c => c.kind !== 'read').length, 0);
  assert.equal(g.calls.filter(c => c.id === 'journaldoc').length, 0);
});
test('malformed connector isError and wrong identity/tab cannot masquerade as reads', async () => {
  for (const fault of ['readError', 'wrongDoc', 'wrongTab']) {
    const f = fixture(); f.faults[fault] = 'homedoc';
    await assert.rejects(f.port.readHome(), {code: fault === 'readError' ? 'CONNECTOR_ERROR' : 'READ_TARGET_MISMATCH'});
    assert.equal(f.calls.filter(c => c.kind !== 'read').length, 0);
  }
});
test('guarded book replacement preserves all other paragraphs and exact replay does not rewrite', async () => {
  const f = fixture();
  const before = f.records.bookdoc.text;
  assert.equal((await f.port.replaceBookText(bookOp)).status, 'APPLIED');
  assert.equal(f.records.bookdoc.text, before.replace('at 17', 'at 18'));
  assert.equal((await f.port.replaceBookText(bookOp)).status, 'REPLAY');
  assert.equal(f.writes('bookdoc'), 1);
});
test('stale book revision refuses before target write; journal housekeeping is separate', async () => {
  const f = fixture();
  await assert.rejects(f.port.replaceBookText({...bookOp, expectedRevision: 'old'}), {code: 'REVISION_CONFLICT'});
  assert.equal(f.writes('bookdoc'), 0);
});
test('provider CAS conflict cannot rebase or overwrite, and restart cannot blindly retry the same operation', async () => {
  const f = fixture(); f.faults.concurrent = 'bookdoc';
  await assert.rejects(f.port.replaceBookText(bookOp), {code: 'EFFECT_UNKNOWN'});
  assert.equal(f.writes('bookdoc'), 0);
  const restarted = factory(f.opts);
  await assert.rejects(restarted.replaceBookText(bookOp), {code: 'EFFECT_UNKNOWN'});
  assert.equal(f.calls.filter(c => c.kind === 'write-attempt' && c.id === 'bookdoc').length, 1);
});
test('uncertain response with exact observed success reconciles without second content write', async () => {
  const f = fixture(); f.faults.failAfter = 'bookdoc';
  assert.equal((await f.port.replaceBookText(bookOp)).status, 'RECONCILED');
  assert.equal(f.writes('bookdoc'), 1);
  assert.equal((await factory(f.opts).replaceBookText(bookOp)).status, 'REPLAY');
  assert.equal(f.writes('bookdoc'), 1);
});
test('readback mismatch leaves durable UNKNOWN; no repeated content write after restart', async () => {
  const f = fixture(); f.faults.mismatch = 'bookdoc';
  await assert.rejects(f.port.replaceBookText(bookOp), {code: 'READBACK_MISMATCH'});
  assert.equal(JSON.parse(f.records.journaldoc.text).operations.book_1.state, 'UNKNOWN');
  await assert.rejects(factory(f.opts).replaceBookText(bookOp), {code: 'EFFECT_UNKNOWN'});
  assert.equal(f.writes('bookdoc'), 1);
});
test('uncertain no-commit is not taken as authorization to repeat, even when text remains old', async () => {
  const f = fixture(); f.faults.failBefore = 'bookdoc';
  await assert.rejects(f.port.replaceBookText(bookOp), {code: 'EFFECT_UNKNOWN'});
  await assert.rejects(factory(f.opts).replaceBookText(bookOp), {code: 'EFFECT_UNKNOWN'});
  assert.equal(f.calls.filter(c => c.kind === 'write-attempt' && c.id === 'bookdoc').length, 1);
});
test('a preexisting journal lock is not stolen and no target mutation occurs', async () => {
  const f = fixture(); const j = JSON.parse(f.records.journaldoc.text); j.lock = {token: 'existing_token_0000000000', operation_id: 'earlier'}; f.records.journaldoc.text = JSON.stringify(j);
  await assert.rejects(f.port.replaceBookText(bookOp), /HOLD_DOC_JOURNAL_LOCKED_NO_STEAL/);
  assert.equal(f.writes('bookdoc'), 0); assert.equal(f.writes('journaldoc'), 0);
});
test('question produces no persistent journal metadata or home write', async () => {
  const f = fixture();
  const result = await f.port.mutateHome({event: {id: 'question_1', type: 'question', expectedVersion: 0, payload: {}}});
  assert.equal(result.status, 'NO_CHANGE');
  assert.equal(f.calls.filter(c => c.kind !== 'read').length, 0);
  assert.equal(f.calls.filter(c => c.id === 'journaldoc').length, 0);
});
test('uncertain journal lock response is reconciled by actual exact readback, never reacquired', async () => {
  const f = fixture(); f.faults.failAfter = 'journaldoc';
  assert.equal((await f.port.replaceBookText(bookOp)).status, 'APPLIED');
  assert.equal(f.writes('bookdoc'), 1);
  assert.equal(JSON.parse(f.records.journaldoc.text).lock, null);
});
