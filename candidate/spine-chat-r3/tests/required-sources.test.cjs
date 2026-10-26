'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const core = require('../runtime/pilot-core.js')();
const template = JSON.parse(fs.readFileSync(require.resolve('../examples/synthetic-home.json'), 'utf8'));
const home = () => structuredClone(template);
function sourceOnlyHome() {
  return {...home(), decisions:[], obligations:[], learning:[], constraints:[]};
}

test('required source survives empty query and zero or exhausted item budget', () => {
  for (const query of ['', '---', 'unrelated']) {
    for (const maxItems of [0, 1, 4]) {
      const result = core.contextBundle(home(), {query, scope:'letter', maxItems, requiredSourceIds:['source-book']});
      assert.deepEqual(result.requiredSources, [{id:'source-book', status:'READY_TO_READ', source:template.sources[1]}]);
      assert.equal(result.criticalOverflow, true);
      assert.equal(result.sources.length, 0);
      assert.equal(result.sourceFreshness, 'RECORDED_NOT_LIVE');
      assert.equal(result.authority, 'NONE');
      assert.equal(result.effectInstruction, 'RECONCILE_UNKNOWN_NO_REPLAY');
    }
  }
});

test('required outcomes consume critical budget once and precede optional sources', () => {
  const h = sourceOnlyHome();
  const result = core.contextBundle(h, {query:'book', maxItems:1, requiredSourceIds:['source-letter']});
  assert.equal(result.criticalOverflow, false);
  assert.deepEqual(result.sources, []);
  assert.deepEqual(result.omitted, [{kind:'source', id:'source-book', reason:'ITEM_BUDGET'}]);
  assert.equal(result.completeness, 'CRITICAL_COMPLETE_OPTIONAL_OMITTED');
  const withRoom = core.contextBundle(h, {query:'book', maxItems:2, requiredSourceIds:['source-letter']});
  assert.deepEqual(withRoom.sources.map(s=>s.id), ['source-book']);
  assert.deepEqual(withRoom.omitted, []);
  const duplicateMatch = core.contextBundle(h, {query:'lantern', maxItems:1, requiredSourceIds:['source-letter']});
  assert.deepEqual(duplicateMatch.sources, []);
  assert.deepEqual(duplicateMatch.omitted, []);
  assert.equal(duplicateMatch.completeness, 'SELECTED_SCOPE_COMPLETE');
});

test('missing source is explicit, budgeted, and never complete', () => {
  const result = core.contextBundle(sourceOnlyHome(), {maxItems:0, requiredSourceIds:['missing-source']});
  assert.deepEqual(result.requiredSources, [{id:'missing-source', status:'MISSING'}]);
  assert.equal(result.criticalOverflow, true);
  assert.equal(result.completeness, 'REQUIRED_SOURCES_UNRESOLVED');
});

test('access denial and uncertainty disclose no stored metadata, even outside scope', () => {
  for (const [access, status] of [['DENY','ACCESS_DENIED'], ['UNKNOWN','ACCESS_UNKNOWN']]) {
    const h = sourceOnlyHome();
    h.sources = [{...h.sources[0], id:'selected-source', access, status:'STALE',
      name:'secret-name', aliases:['secret-alias'], function:'secret-function',
      scope:'secret-scope', locator:'synthetic://secret-locator', revision:'secret-revision'}];
    const result = core.contextBundle(h, {query:'secret-alias', scope:'elsewhere', requiredSourceIds:['selected-source']});
    assert.deepEqual(result.requiredSources, [{id:'selected-source', status}]);
    assert.equal(JSON.stringify(result).includes('secret-'), false);
    assert.deepEqual(result.sources, []);
    assert.deepEqual(result.omitted, []);
    assert.equal(result.completeness, 'REQUIRED_SOURCES_UNRESOLVED');
  }
});

test('required selection does not widen scope or disclose an out-of-scope pointer', () => {
  const result = core.contextBundle(sourceOnlyHome(), {query:'book', scope:'elsewhere', requiredSourceIds:['source-book']});
  assert.deepEqual(result.requiredSources, [{id:'source-book', status:'OUT_OF_SCOPE'}]);
  assert.equal(JSON.stringify(result).includes('synthetic://book'), false);
  assert.equal(JSON.stringify(result).includes('The living book'), false);
  assert.deepEqual(result.sources, []);
  assert.equal(result.completeness, 'REQUIRED_SOURCES_UNRESOLVED');
});

test('empty scope and global sources retain existing scope semantics', () => {
  const h = sourceOnlyHome();
  assert.equal(core.contextBundle(h, {requiredSourceIds:['source-book']}).requiredSources[0].status, 'READY_TO_READ');
  h.sources[1].scope = '*';
  const result = core.contextBundle(h, {scope:'elsewhere', requiredSourceIds:['source-book']});
  assert.equal(result.requiredSources[0].status, 'READY_TO_READ');
  assert.equal(result.requiredSources[0].source.scope, '*');
});

test('stale, unknown and revisionless records remain visible but unresolved', () => {
  for (const [recordedStatus, revision, expected] of [
    ['STALE', 'fixture-1', 'STALE'], ['STALE', '', 'STALE'],
    ['UNKNOWN', 'fixture-1', 'FRESHNESS_UNKNOWN'], ['CURRENT', '', 'FRESHNESS_UNKNOWN']
  ]) {
    const h = sourceOnlyHome();
    Object.assign(h.sources[1], {status:recordedStatus, revision});
    const result = core.contextBundle(h, {maxItems:0, requiredSourceIds:['source-book']});
    assert.deepEqual(result.requiredSources, [{id:'source-book', status:expected, source:h.sources[1]}]);
    assert.equal(result.completeness, 'REQUIRED_SOURCES_UNRESOLVED');
    assert.equal(result.sourceFreshness, 'RECORDED_NOT_LIVE');
  }
});

test('mixed results preserve caller order and unresolved status despite optional omissions', () => {
  const result = core.contextBundle(sourceOnlyHome(), {query:'book', maxItems:0,
    requiredSourceIds:['missing-source','source-letter','source-private']});
  assert.deepEqual(result.requiredSources.map(({id,status})=>({id,status})), [
    {id:'missing-source',status:'MISSING'}, {id:'source-letter',status:'READY_TO_READ'},
    {id:'source-private',status:'ACCESS_DENIED'}
  ]);
  assert.deepEqual(result.omitted, [{kind:'source',id:'source-book',reason:'ITEM_BUDGET'}]);
  assert.equal(result.completeness, 'REQUIRED_SOURCES_UNRESOLVED');
});

test('invalid, duplicate and oversized required selections are rejected', () => {
  for (const requiredSourceIds of [null, 'source-book', [null], Array(1), [''], ['bad id'],
    ['source-book','source-book'], Array.from({length:5001}, (_,i)=>'source-'+i)]) {
    assert.throws(()=>core.contextBundle(home(), {requiredSourceIds}), {code:'INVALID_BUNDLE_OPTIONS'});
  }
});

test('required pointers are detached and neither selection nor mutation changes the home', () => {
  const h = home(), before = structuredClone(h);
  const result = core.contextBundle(h, {requiredSourceIds:['source-book']});
  result.requiredSources[0].source.aliases.push('changed');
  result.requiredSources[0].source.locator = 'synthetic://changed';
  assert.deepEqual(h, before);
});

test('omitted or empty option preserves the rev2 result byte for byte', () => {
  // Frozen outputs from rev2 at 4425c4ed9a44b0e6ba95e2b3bee592255057b66c.
  // Hash the exact JSON bytes so this package's tests do not depend on a sibling checkout.
  const cases = [
    ['full', {}, '17fb6a827ce93045d7d82124710a6aa495fa4751b981b233a9e7b4d6c7ba6c1c'],
    ['sources', {}, '17bbc3c64c6f1445aac3649f232d394dda3cce2d99b8b08d95823623d3bb0bc6'],
    ['full', {query:'lantern'}, '306cfaf2af642618242304e5a0f61bba54d27811b6dbf0ffd05b842194d14db8'],
    ['full', {scope:'letter',maxItems:0}, '980de1cb58c619f07b3e9f7327dba7906587bf78cc7fb17ed72d9e87294b793a'],
    ['full', {query:'research',scope:'letter',maxItems:4}, 'ba712092bde5a3993bb2cb1aaafc24aec674ebab9030a96af82ae0894b019dce'],
    ['full', {query:'book',maxItems:20}, '31bdebb92bb028a726f4417aea055daeb53606789e545d03db37e6756a99fc63'],
    ['full', {scope:'elsewhere'}, '62c738ff4c568f4988d541aa9d9f198d2f435044649531b201a1f52076fa574b'],
    ['DENY', {}, '0ef4526ab18606f6f8df849570a4bc4f343ed0beaeaf0e906bedd06a7201a4d7'],
    ['UNKNOWN', {}, '0ef4526ab18606f6f8df849570a4bc4f343ed0beaeaf0e906bedd06a7201a4d7'],
    ['UNKNOWN', {scope:'letter',maxItems:0}, '26ee07748ec5dc81a0c9283d493cee9eb7dc1c5dbaf97cd05b7803e07f18e441']
  ];
  const digest = result => crypto.createHash('sha256').update(JSON.stringify(result)).digest('hex');
  for (const [kind, options, expected] of cases) {
    const h = kind==='sources' ? sourceOnlyHome() : home();
    if (['DENY','UNKNOWN'].includes(kind)) h.sources[0].access = kind;
    assert.equal(digest(core.contextBundle(h, options)), expected);
    assert.equal(digest(core.contextBundle(h, {...options,requiredSourceIds:[]})), expected);
    if (!Object.keys(options).length) assert.equal(digest(core.contextBundle(h)), expected);
  }
});
