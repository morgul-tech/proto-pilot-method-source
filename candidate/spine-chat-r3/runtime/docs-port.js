'use strict';
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else root.ProtoPilotDocsPort = factory;
})(globalThis, function createDocsPort({core, getText, batchUpdate, binding, journalFactory, newLockToken, sha256}) {
  // Only an independently selected caller binding owns targets/permissions.
  // A private map or model request cannot enlarge this whitelist.
  const fail = (code, extra) => { const e = new Error(code); e.code = code; if (extra) e.detail = extra; throw e; };
  const plain = x => x !== null && typeof x === 'object' && !Array.isArray(x);
  const clone = x => JSON.parse(JSON.stringify(x));
  const canonical = x => Array.isArray(x) ? '[' + x.map(canonical).join(',') + ']' : plain(x) ? '{' + Object.keys(x).sort().map(k => JSON.stringify(k) + ':' + canonical(x[k])).join(',') + '}' : JSON.stringify(x);
  const id = x => typeof x === 'string' && /^[A-Za-z0-9_-]{1,120}$/.test(x);
  if (!core || typeof core.applyEvent !== 'function' || typeof core.validateHome !== 'function' || typeof getText !== 'function' || !plain(binding)) fail('PORT_UNQUALIFIED');
  const custody = clone(binding); // Later caller mutation cannot widen scope.
  const targets = [custody.home, ...(custody.sources || []), ...(custody.journal ? [custody.journal] : [])];
  for (const t of targets) {
    if (!plain(t) || !id(t.documentId) || typeof t.tabId !== 'string' || !/^[A-Za-z0-9_.-]{1,120}$/.test(t.tabId) || t.plainText !== true) fail('TARGET_UNQUALIFIED');
  }
  const sourceIds = (custody.sources || []).map(t => t.id);
  if (sourceIds.some(x => !id(x)) || new Set(sourceIds).size !== sourceIds.length) fail('SOURCE_BINDING_CONFLICT');
  if (new Set(targets.map(t => t.documentId + '/' + t.tabId)).size !== targets.length) fail('TARGET_BINDING_CONFLICT');
  if ((custody.sources || []).some(t => typeof t.locator !== 'string' || !t.locator)) fail('SOURCE_LOCATOR_UNQUALIFIED');
  if (custody.journal && targets.slice(0, -1).some(t => t.documentId === custody.journal.documentId)) fail('JOURNAL_REQUIRES_SEPARATE_DOCUMENT');
  function allow(t, write = false) {
    if (!t || t.read !== true || (write && t.write !== true)) fail('PERMISSION_DENIED');
    if (write && custody.storage !== 'ALLOW') fail('STORAGE_DENIED');
  }
  function unwrap(raw) {
    if (!plain(raw) || raw.isError === true || raw.error) fail('CONNECTOR_ERROR');
    const value = plain(raw.structuredContent) ? raw.structuredContent : raw;
    if (value.isError === true || value.error || value.success === false) fail('CONNECTOR_ERROR');
    return value;
  }
  function normalize(raw, target) {
    const d = unwrap(raw);
    if (d.documentId !== target.documentId || d.tabId !== target.tabId) fail('READ_TARGET_MISMATCH');
    if (typeof d.revisionId !== 'string' || !d.revisionId || !Array.isArray(d.paragraphs)) fail('READ_SHAPE_UNQUALIFIED');
    for (const p of d.paragraphs) {
      if (!plain(p) || typeof p.text !== 'string' || p.tabId !== target.tabId || !Number.isSafeInteger(p.startIndex) || !Number.isSafeInteger(p.endIndex) || p.startIndex < 0 || p.endIndex < p.startIndex) fail('PARAGRAPH_SHAPE_UNQUALIFIED');
    }
    for (let i = 1; i < d.paragraphs.length; i++) if (d.paragraphs[i].startIndex < d.paragraphs[i - 1].endIndex) fail('PARAGRAPH_OVERLAP');
    return {text: d.paragraphs.map(p => p.text).join('\n'), revisionId: d.revisionId};
  }
  async function read(t) {
    allow(t);
    return normalize(await getText({document_id: t.documentId, tab_id: t.tabId}), t);
  }
  async function replace(t, snapshot, before, after) {
    allow(t, true);
    if (typeof batchUpdate !== 'function') fail('WRITE_PORT_UNAVAILABLE');
    const raw = await batchUpdate({document_id: t.documentId, write_control: {requiredRevisionId: snapshot.revisionId}, requests: [{replaceAllText: {containsText: {text: before, matchCase: true}, replaceText: after, tabsCriteria: {tabIds: [t.tabId]}}}]});
    const d = unwrap(raw);
    if (d.documentId && d.documentId !== t.documentId) fail('WRITE_TARGET_MISMATCH');
    if (!Array.isArray(d.replies) || d.replies.length !== 1 || d.replies[0]?.replaceAllText?.occurrencesChanged !== 1) fail('WRITE_RESPONSE_UNQUALIFIED');
  }
  function parseHome(s) {
    let h;
    try { h = JSON.parse(s.text); } catch (_) { fail('HOME_NOT_JSON'); }
    const errors = core.validateHome(h);
    if (!Array.isArray(errors) || errors.length) fail('HOME_INVALID');
    if (custody.home.homeId && h.homeId !== custody.home.homeId) fail('HOME_ID_MISMATCH');
    return h;
  }
  async function readHome() {
    const s = await read(custody.home);
    return {home: parseHome(s), revision: s.revisionId};
  }
  async function readSource(sourceId) {
    const t = (custody.sources || []).find(t => t.id === sourceId);
    allow(t);
    await checkSource(t);
    return {sourceId, ...(await read(t))};
  }
  async function checkSource(t, write = false) {
    const {home} = await readHome();
    if (write && home.storage !== 'ALLOW') fail('STORAGE_DENIED');
    const source = home.sources.find(s => s.id === t.id);
    if (!source || source.locator !== t.locator) fail('SOURCE_MAP_BINDING_MISMATCH');
    if (source.access !== 'ALLOW') fail('PERMISSION_DENIED');
  }
  async function digest(value) {
    if (typeof sha256 !== 'function') fail('HASH_PORT_UNQUALIFIED');
    const hash = await sha256(value);
    if (typeof hash !== 'string' || !/^[a-f0-9]{64}$/.test(hash)) fail('HASH_PORT_UNQUALIFIED');
    return hash;
  }
  let busy = false;
  function mutationPorts(target) {
    allow(target, true);
    allow(custody.journal, true);
    if (typeof journalFactory !== 'function' || typeof newLockToken !== 'function' || typeof sha256 !== 'function' || typeof batchUpdate !== 'function') fail('DURABLE_JOURNAL_REQUIRED');
  }
  async function journalWork(operationId, fn) {
    if (!id(operationId)) fail('OPERATION_ID_INVALID');
    if (busy) fail('PORT_BUSY');
    busy = true;
    const snapshots = new Map();
    try {
    const journal = journalFactory({
      qualification: custody.journal.qualification,
      newLockToken,
      read: async () => { const s = await read(custody.journal); snapshots.clear(); snapshots.set(s.revisionId, s); return s; },
      write: async ({requiredRevisionId, text}) => {
        const s = snapshots.get(requiredRevisionId);
        if (!s) fail('JOURNAL_SNAPSHOT_MISSING');
        try { await replace(custody.journal, s, s.text, text); }
        catch (_) {
          // A lost response is reconciled by an exact independent observation.
          // Never repeat the provider write or steal a possibly acquired lock.
          const after = await read(custody.journal);
          if (after.revisionId === requiredRevisionId || after.text !== text) fail('JOURNAL_WRITE_UNKNOWN');
        }
      }
    });
    return await journal.runExclusive(operationId, fn);
    }
    finally { busy = false; }
  }
  async function runMutation({operationId, target, intent, prepare, verifyReplay}) {
    mutationPorts(target); // No reads, locks or metadata writes before this check.
    const intentHash = await digest(canonical(intent));
    return journalWork(operationId, async storage => {
      let record = await storage.load();
      const save = async patch => {
        const version = record?.version || 0;
        record = {...record, ...patch, version: version + 1, operation_id: operationId, intent_hash: intentHash};
        await storage.commit(version, record);
        const observed = await storage.load();
        if (canonical(observed) !== canonical(record)) fail('JOURNAL_RECORD_READBACK_MISMATCH');
      };
      if (record) {
        if (record.intent_hash !== intentHash || record.target_document !== target.documentId || record.target_tab !== target.tabId) fail('OPERATION_INTENT_CONFLICT');
        // A resumed intent never triggers a second content write, even when
        // a read appears unchanged. An absent effect is not proof of no commit.
        let s;
        try { s = await read(target); } catch (_) { fail('EFFECT_UNKNOWN'); }
        const outcome = verifyReplay ? await verifyReplay(s, record) : await digest(s.text) === record.expected_sha256;
        if (!outcome) fail(record.state === 'VERIFIED' ? 'VERIFIED_TARGET_DRIFT' : 'EFFECT_UNKNOWN');
        if (record.state !== 'VERIFIED') await save({state: 'VERIFIED', result_revision: s.revisionId});
        return {status: 'REPLAY', revision: s.revisionId, ...(plain(outcome) ? outcome : {})};
      }
      const s = await read(target);
      const plan = prepare(s);
      if (plan.status === 'REPLAY' || plan.status === 'NO_CHANGE') return {status: plan.status, revision: s.revisionId, ...plan.result};
      if (typeof plan.before !== 'string' || !plan.before || typeof plan.after !== 'string' || typeof plan.expectedText !== 'string' || s.text.split(plan.before).length !== 2) fail('REPLACEMENT_NOT_UNIQUE');
      const expectedHash = await digest(plan.expectedText);
      await save({state: 'PREPARED', kind: intent.kind, target_document: target.documentId, target_tab: target.tabId, before_revision: s.revisionId, expected_sha256: expectedHash});
      await save({state: 'ATTEMPTED'});
      let writeFailed = false;
      try { await replace(target, s, plan.before, plan.after); } catch (_) { writeFailed = true; }
      let after;
      try { after = await read(target); } catch (_) { await save({state: 'UNKNOWN'}); fail('EFFECT_UNKNOWN'); }
      if (after.revisionId === s.revisionId || await digest(after.text) !== expectedHash) {
        await save({state: 'UNKNOWN', result_revision: after.revisionId});
        fail(writeFailed ? 'EFFECT_UNKNOWN' : 'READBACK_MISMATCH');
      }
      await save({state: 'VERIFIED', result_revision: after.revisionId});
      return {status: writeFailed ? 'RECONCILED' : 'APPLIED', revision: after.revisionId, ...plan.result};
    });
  }
  async function mutateHome({event}) {
    mutationPorts(custody.home);
    const initial = await readHome();
    if (initial.home.storage !== 'ALLOW') fail('STORAGE_DENIED');
    if (!plain(event) || !id(event.id)) fail('EVENT_INVALID');
    const chosen = clone(event);
    // A question or invalid event must not acquire/persist journal metadata.
    const preliminary = core.applyEvent(initial.home, chosen);
    if (preliminary.status === 'NO_CHANGE') return {status: 'NO_CHANGE', home: initial.home, revision: initial.revision};
    return runMutation({operationId: chosen.id, target: custody.home, intent: {kind: 'home-event', event: chosen},
      prepare(s) {
        const home = parseHome(s);
        if (home.storage !== 'ALLOW') fail('STORAGE_DENIED');
        const result = core.applyEvent(home, chosen);
        const next = JSON.stringify(result.home);
        return {status: result.status, before: s.text, after: next, expectedText: next, result: {home: result.home}};
      },
      verifyReplay(s) {
        const home = parseHome(s);
        if (home.storage !== 'ALLOW') fail('STORAGE_DENIED');
        try { const r = core.applyEvent(home, chosen); return r.status === 'REPLAY' ? {home} : false; }
        catch (e) { if (e.code && /CONFLICT/.test(e.code)) throw e; return false; }
      }
    });
  }
  async function replaceBookText({operationId, sourceId, expectedRevision, before, after}) {
    const target = (custody.sources || []).find(t => t.id === sourceId);
    allow(target, true);
    mutationPorts(target);
    await checkSource(target, true);
    if (typeof expectedRevision !== 'string' || !expectedRevision || typeof before !== 'string' || !before || typeof after !== 'string' || before === after) fail('REPLACEMENT_INVALID');
    return runMutation({operationId, target, intent: {kind: 'book-replacement', sourceId, expectedRevision, before, after},
      prepare(s) {
        if (s.revisionId !== expectedRevision) fail('REVISION_CONFLICT');
        return {status: 'APPLIED', before, after, expectedText: s.text.replace(before, after), result: {sourceId}};
      }
    });
  }
  return {readHome, readSource, mutateHome, replaceBookText};
});
