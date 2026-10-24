'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const core=require('../runtime/pilot-core.js')();
const template=JSON.parse(fs.readFileSync(require.resolve('../examples/synthetic-home.json'),'utf8'));
const home=()=>structuredClone(template);
const event=(type,payload,expectedVersion=0,id='event-1')=>({id,type,expectedVersion,payload});
const apply=(h,type,payload)=>core.applyEvent(h,event(type,payload,h.version,'event-'+(h.version+1)));
const err=(fn,code)=>assert.throws(fn,e=>e.code===code);

test('synthetic home valid; no private live locator',()=>{
  assert.deepEqual(core.validateHome(home()),[]);
  assert.ok(home().sources.every(s=>s.locator.startsWith('synthetic://')));
});
test('same import-free bytes run in VM without require or Node',()=>{
  const ctx=vm.createContext({}); vm.runInContext(fs.readFileSync(require.resolve('../runtime/pilot-core.js'),'utf8'),ctx);
  const result=vm.runInContext('ProtoPilotCore().validateHome('+JSON.stringify(home())+')',ctx);
  assert.equal(result.length,0);
});
test('forbidden and unknown source metadata absent from search',()=>{
  const h=home(); assert.deepEqual(core.findSources(h,'hidden token'),{status:'NONE',sources:[]});
  h.sources[2].access='UNKNOWN'; assert.equal(core.findSources(h,'Withheld').sources.length,0);
  assert.equal(core.findSources(h,'lantern').sources[0].id,'source-letter');
});
test('two identical aliases stay ambiguous, not first-source-wins',()=>{
  const h=home(); h.sources[1].aliases.push('lantern');
  assert.equal(core.findSources(h,'lantern').status,'AMBIGUOUS');
});
test('source is discoverable but stale decision cannot be CURRENT',()=>{
  const h=home();h.sources[0].status='STALE';
  assert.equal(core.findSources(h,'lantern').sources[0].status,'STALE');
  assert.equal(core.resolveDecision(h,'letter').status,'UNKNOWN');
});
test('source revision change cannot silently refresh old decision evidence',()=>{
  let h=home();h=apply(h,'source.upsert',{...h.sources[0],revision:'fixture-2'}).home;
  assert.equal(core.resolveDecision(h,'letter').status,'UNKNOWN');
});
test('two conflicting live decisions do not silently select newest',()=>{
  const h=home();h.decisions.push({...h.decisions[0],id:'decision-2',value:'Reveal the research'});
  assert.equal(core.resolveDecision(h,'letter').status,'CONFLICT');
});
test('explicit same-scope correction replaces only named decision',()=>{
  let h=home(); h=apply(h,'decision.add',{...h.decisions[0],id:'decision-2',value:'Share only the completed work',supersedes:['decision-1']}).home;
  assert.deepEqual(core.resolveDecision(h,'letter'),{status:'CURRENT',value:'Share only the completed work',liveIds:['decision-2'],supersededIds:['decision-1']});
  assert.equal(core.resolveDecision(h,'other').status,'NONE');
});
test('cross-scope supersession is invalid',()=>{
  const h=home();err(()=>apply(h,'decision.add',{...h.decisions[0],id:'decision-2',scope:'other',supersedes:['decision-1']}),'INVALID_TRANSITION');
});
test('withdraw successor does not resurrect predecessor',()=>{
  let h=home(); h=apply(h,'decision.add',{...h.decisions[0],id:'decision-2',value:'New',supersedes:['decision-1']}).home;
  h=apply(h,'decision.withdraw',{id:'decision-2'}).home;
  assert.equal(core.resolveDecision(h,'letter').status,'NONE');
});
test('fresh explicit correction resolves stale successor without reviving old decision',()=>{
  let h=home(); h=apply(h,'decision.add',{...h.decisions[0],id:'decision-2',value:'Second',supersedes:['decision-1']}).home;
  h=apply(h,'source.upsert',{...h.sources[0],revision:'fixture-2'}).home;
  h=apply(h,'decision.add',{...h.decisions[0],id:'decision-3',sourceRevision:'fixture-2',value:'Third',supersedes:['decision-1','decision-2']}).home;
  assert.equal(core.resolveDecision(h,'letter').status,'CURRENT');
  assert.equal(core.resolveDecision(h,'letter').value,'Third');
});
test('missing original source makes decision validation fail',()=>{
  const h=home();h.decisions[0].sourceId='missing';assert.ok(core.validateHome(h).some(x=>x.includes('source-missing')));
});
test('question retains work exactly; no ordinary-chat history',()=>{
  const h=home(),r=apply(h,'question',{}); assert.equal(r.status,'NO_CHANGE');assert.deepEqual(r.home,h);
});
test('source correction is immutable with exact replay and conflicting ID',()=>{
  const h=home(),before=structuredClone(h),e=event('source.upsert',{...h.sources[0],revision:'fixture-2'});
  const r=core.applyEvent(h,e);assert.deepEqual(h,before);assert.equal(r.home.version,1);
  assert.equal(core.applyEvent(r.home,e).status,'REPLAY');
  err(()=>core.applyEvent(r.home,{...e,payload:{...e.payload,revision:'fixture-3'}}),'EVENT_ID_CONFLICT');
});
test('new stale version cannot clobber home',()=>{
  const h=apply(home(),'learning.disposition',{id:'learning-1',disposition:'APPLIED',evidence:'synthetic://readback'}).home;
  err(()=>core.applyEvent(h,event('constraint.withdraw',{id:'constraint-1'},0,'other-event')),'VERSION_CONFLICT');
});
test('no-storage refuses before recording even an ordinary question',()=>{
  const h=home();h.storage='DENY';const before=JSON.stringify(h);
  err(()=>apply(h,'learning.disposition',{id:'learning-1',disposition:'APPLIED',evidence:'sensitive'}),'STORAGE_FORBIDDEN');
  err(()=>apply(h,'question',{}),'STORAGE_FORBIDDEN');assert.equal(JSON.stringify(h),before);
});
test('stop preserves unknown delivery and prevents work replay',()=>{
  let h=home();h=apply(h,'obligation.withdraw',{id:'work-2'}).home;
  assert.equal(h.obligations[1].effect,'UNKNOWN');
  err(()=>apply(h,'obligation.update',{...h.obligations[1],state:'OPEN'}),'TERMINAL_WORK_NO_REPLAY');
  assert.ok(core.contextBundle(h,{scope:'letter',maxItems:0}).obligations.some(o=>o.id==='work-2'));
});
test('completed work cannot reopen while send is unknown',()=>{
  const h=home();err(()=>apply(h,'obligation.update',{...h.obligations[1],state:'OPEN'}),'TERMINAL_WORK_NO_REPLAY');
});
test('unknown effect needs separate reconciliation; empty evidence invalid',()=>{
  const h=home();err(()=>apply(h,'obligation.update',{...h.obligations[1],effect:'NONE'}),'EFFECT_RECONCILIATION_REQUIRED');
  err(()=>apply(h,'effect.reconcile',{id:'work-2',outcome:'NONE',evidence:''}),'INVALID_PAYLOAD');
  const r=apply(h,'effect.reconcile',{id:'work-2',outcome:'CONFIRMED',evidence:'synthetic://positive-provider-receipt'});
  assert.equal(r.home.obligations[1].state,'COMPLETED');assert.equal(r.home.obligations[1].effect,'CONFIRMED');
});
test('book assessment cannot close with pending function',()=>{
  const h=home();err(()=>apply(h,'obligation.update',{...h.obligations[0],state:'COMPLETED',evidence:'synthetic://some-other-report'}),'INVALID_TRANSITION');
});
test('per-book explicit no-post reason can finish an existing assessment',()=>{
  const h=home(),o=h.obligations[0];const r=apply(h,'obligation.update',{...o,state:'COMPLETED',evidence:'synthetic://assessment',books:[{...o.books[0],disposition:'NO_POST',reason:'Already preserved with the same meaning'}]});
  assert.equal(r.home.obligations[0].state,'COMPLETED');
  assert.equal(r.home.obligations.length,2);
});
test('finishing another work item leaves book assessment open',()=>{
  const h=home();const r=apply(h,'effect.reconcile',{id:'work-2',outcome:'CONFIRMED',evidence:'synthetic://receipt'});
  assert.equal(r.home.obligations[0].state,'OPEN');
});
test('all critical reentry survives zero item budget with explicit overflow',()=>{
  const b=core.contextBundle(home(),{scope:'letter',query:'research',maxItems:0});
  assert.equal(b.obligations.length,2);assert.equal(b.constraints.length,1);assert.equal(b.decisions.length,1);
  assert.equal(b.criticalOverflow,true);assert.equal(b.effectInstruction,'RECONCILE_UNKNOWN_NO_REPLAY');
  assert.ok(b.omitted.some(x=>x.id==='learning-1'));assert.equal(b.authority,'NONE');
});
test('learning is encountered by trigger, disposition preserves evidence',()=>{
  const h=home();assert.equal(core.contextBundle(h,{scope:'letter',query:'an invitation',maxItems:20}).learning.length,1);
  assert.equal(core.contextBundle(h,{scope:'letter',query:'gardening',maxItems:20}).learning.length,0);
  const r=apply(h,'learning.disposition',{id:'learning-1',disposition:'APPLIED',evidence:'synthetic://actual-use'});
  assert.equal(r.home.learning[0].evidence,'synthetic://actual-use');
});
test('denied critical source retains debt but withholds content',()=>{
  const h=home();h.sources[0].access='DENY';const b=core.contextBundle(h,{scope:'letter',query:'lantern'});
  assert.equal(b.sources.length,0);assert.equal(b.learning.length,0);
  assert.equal(b.obligations[0].summary,undefined);assert.equal(b.constraints[0].text,undefined);
  assert.equal(b.obligations[1].effect,'UNKNOWN');assert.equal(b.decisions[0].status,'UNKNOWN');
});
test('book-specific forbidden metadata is redacted even with allowed work source',()=>{
  const h=home();h.sources[1].access='DENY';h.obligations[0].books[0].reason='private withheld phrase';
  const b=core.contextBundle(h,{scope:'letter'});
  assert.deepEqual(b.obligations[0].books[0],{disposition:'PENDING',content:'WITHHELD',reason:'BOOK_SOURCE_NOT_READABLE'});
  assert.ok(!JSON.stringify(b).includes('private withheld phrase'));
});
test('extra fields and malformed graph refused, not silently normalized',()=>{
  const h=home();h.admin=true;assert.ok(core.validateHome(h).length);
  const cyclic=home();cyclic.decisions[0].supersedes=['decision-2'];cyclic.decisions.push({...cyclic.decisions[0],id:'decision-2',supersedes:['decision-1']});
  assert.ok(core.validateHome(cyclic).some(x=>x.includes('cycle')));
  err(()=>apply(home(),'turn.log',{raw:'ordinary chat'}),'UNKNOWN_EVENT_TYPE');
});
