'use strict';
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else root.ProtoPilotCore = factory;
})(globalThis, function ProtoPilotCore() {
  const SCHEMA = 'proto-pilot-home/v1';
  const plain = x => x !== null && typeof x === 'object' && !Array.isArray(x) &&
    (Object.getPrototypeOf(x) === Object.prototype || Object.getPrototypeOf(x) === null);
  const text = x => typeof x === 'string' && x.length > 0 && x.length <= 16000;
  const id = x => typeof x === 'string' && /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,119}$/.test(x);
  const str = x => typeof x === 'string' && x.length <= 16000;
  const num = x => Number.isSafeInteger(x) && x >= 0;
  const list = f => x => Array.isArray(x) && x.length <= 5000 && x.every(f);
  const en = values => x => values.includes(x);
  const fields = {
    source: {id, name:text, aliases:list(text), function:text, scope:text, locator:text,
      revision:str, access:en(['ALLOW','DENY','UNKNOWN']), status:en(['CURRENT','STALE','UNKNOWN'])},
    decision: {id, scope:text, value:text, sourceId:id, sourceRevision:text, status:en(['ACTIVE','WITHDRAWN']),
      supersedes:list(id), basis:en(['VERIFIED','UNKNOWN'])},
    book: {sourceId:id, disposition:en(['PENDING','WRITE','NO_POST','WAIT','WRITTEN']), reason:str, evidence:str},
    obligation: {id, scope:text, summary:text, sourceId:id,
      state:en(['OPEN','WAITING','COMPLETED','WITHDRAWN']), effect:en(['NONE','UNKNOWN','CONFIRMED']),
      nextTrigger:str, evidence:str, books:list(plain)},
    learning: {id, scope:text, summary:text, sourceId:id, triggers:list(text),
      status:en(['ACTIVE','WITHDRAWN']), disposition:en(['PENDING','APPLIED','NOT_APPLICABLE','DEFERRED']), evidence:str},
    constraint: {id, scope:text, text:text, sourceId:id, status:en(['ACTIVE','WITHDRAWN'])},
    applied: {id, canonical:text, version:num}
  };
  function fail(code) { const e = new Error(code); e.code = code; throw e; }
  function shape(value, spec, path, errors) {
    if (!plain(value)) { errors.push(path + ':object-required'); return; }
    for (const key of Object.keys(value)) if (!Object.hasOwn(spec,key)) errors.push(path + '.' + key + ':unexpected');
    for (const [key, check] of Object.entries(spec))
      if (!Object.hasOwn(value,key) || !check(value[key])) errors.push(path + '.' + key + ':invalid');
  }
  function canonical(value) {
    if (value === null || typeof value === 'string' || typeof value === 'boolean') return JSON.stringify(value);
    if (typeof value === 'number' && Number.isFinite(value)) return JSON.stringify(value);
    if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
    if (!plain(value)) fail('INVALID_JSON');
    return '{' + Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',') + '}';
  }
  const clone = value => JSON.parse(canonical(value));
  function validateHome(home) {
    const errors = [];
    shape(home,{schema:x=>x===SCHEMA, homeId:id, version:num, storage:en(['ALLOW','DENY']),
      sources:list(plain), decisions:list(plain), obligations:list(plain), learning:list(plain),
      constraints:list(plain), applied:list(plain)},'home',errors);
    if (errors.length) return errors;
    const groups = {sources:'source',decisions:'decision',obligations:'obligation',learning:'learning',constraints:'constraint',applied:'applied'};
    for (const [group,kind] of Object.entries(groups)) {
      const seen = new Set();
      home[group].forEach((record,index)=>{
        const path = group+'['+index+']'; shape(record,fields[kind],path,errors);
        if (seen.has(record.id)) errors.push(path+':duplicate-id'); seen.add(record.id);
        if (kind === 'obligation' && Array.isArray(record.books)) {
          const books = new Set();
          record.books.forEach((book,i)=>{
            shape(book,fields.book,path+'.books['+i+']',errors);
            if (books.has(book.sourceId)) errors.push(path+':duplicate-book'); books.add(book.sourceId);
          });
        }
      });
    }
    if (errors.length) return errors;
    const sourceIds = new Set(home.sources.map(x=>x.id));
    for (const group of ['decisions','obligations','learning','constraints'])
      for (const record of home[group]) if (!sourceIds.has(record.sourceId)) errors.push(group+'.'+record.id+':source-missing');
    for (const o of home.obligations) {
      for (const b of o.books) {
        if (!sourceIds.has(b.sourceId)) errors.push(o.id+':book-source-missing');
        if (['NO_POST','WAIT'].includes(b.disposition) && !text(b.reason)) errors.push(o.id+':book-reason-required');
        if (b.disposition==='WRITTEN' && !text(b.evidence)) errors.push(o.id+':book-evidence-required');
      }
      if (o.state==='WAITING' && !text(o.nextTrigger)) errors.push(o.id+':waiting-trigger-required');
      if (o.state==='COMPLETED' && (!text(o.evidence) || o.books.some(b=>!['WRITTEN','NO_POST'].includes(b.disposition))))
        errors.push(o.id+':incomplete-disposition');
      if (o.effect==='CONFIRMED' && !text(o.evidence)) errors.push(o.id+':effect-evidence-required');
    }
    const decisions = new Map(home.decisions.map(x=>[x.id,x]));
    for (const d of home.decisions) {
      if (new Set(d.supersedes).size!==d.supersedes.length) errors.push(d.id+':duplicate-supersession');
      for (const old of d.supersedes) if (!decisions.has(old) || decisions.get(old).scope!==d.scope || old===d.id)
        errors.push(d.id+':invalid-supersession');
    }
    function walk(key,stack) {
      if (stack.has(key)) return true;
      const next = new Set(stack); next.add(key);
      return (decisions.get(key)?.supersedes||[]).some(k=>walk(k,next));
    }
    if (home.decisions.some(d=>walk(d.id,new Set()))) errors.push('decisions:supersession-cycle');
    for (const l of home.learning) if (l.status==='ACTIVE' && !l.triggers.length) errors.push(l.id+':trigger-required');
    let prior=0;
    for (const a of home.applied) {
      if (a.version!==prior+1 || a.version>home.version) errors.push(a.id+':invalid-event-version');
      prior=a.version;
    }
    if (home.version!==home.applied.length) errors.push('home:incomplete-replay-ledger');
    return errors;
  }
  function valid(home) { if (validateHome(home).length) fail('INVALID_HOME'); }
  const normal = s=>s.normalize('NFKC').toLocaleLowerCase('en').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
  const readable = s=>s && s.access==='ALLOW';
  const fresh = s=>readable(s) && s.status==='CURRENT' && text(s.revision);
  function findSources(home,query) {
    valid(home); if (!str(query)) fail('INVALID_QUERY');
    const q=normal(query), tokens=q.split(' ').filter(Boolean);
    if (!q) return {status:'NONE',sources:[]};
    const hits=home.sources.filter(readable).map(s=>{
      const alias=s.aliases.some(a=>normal(a)===q);
      const name=normal(s.name), fn=normal(s.function);
      const words=new Set(normal([s.name,s.function,...s.aliases].join(' ')).split(' '));
      return {source:s,score:alias?100:name===q?90:fn===q?80:tokens.filter(t=>words.has(t)).length};
    }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score || a.source.id.localeCompare(b.source.id));
    return {status:!hits.length?'NONE':hits.length>1&&hits[0].score===hits[1].score?'AMBIGUOUS':'MATCH',
      sources:hits.map(x=>({...clone(x.source),matchScore:x.score}))};
  }
  function resolveDecision(home,scope) {
    valid(home); if (!text(scope)) fail('INVALID_SCOPE');
    const records=home.decisions.filter(d=>d.scope===scope);
    const source=id=>home.sources.find(s=>s.id===id);
    const verified=d=>d.basis==='VERIFIED' && fresh(source(d.sourceId)) && source(d.sourceId).revision===d.sourceRevision;
    // A withdrawn successor still records its historical explicit replacement.
    // Withdrawal never resurrects the decision it replaced.
    const superseded=new Set(records.filter(verified).flatMap(d=>d.supersedes));
    const live=records.filter(d=>d.status==='ACTIVE'&&!superseded.has(d.id));
    const uncertain=live.some(d=>!verified(d)) || records.some(d=>d.supersedes.length&&!verified(d)&&!superseded.has(d.id));
    const values=new Set(live.filter(verified).map(d=>d.value));
    const status=uncertain?'UNKNOWN':!live.length?'NONE':values.size===1?'CURRENT':'CONFLICT';
    return {status,value:status==='CURRENT'?[...values][0]:null,liveIds:live.map(d=>d.id),supersededIds:[...superseded]};
  }
  function contextBundle(home,options={}) {
    valid(home);
    const {query='',scope='',maxItems=20}=options;
    if (!plain(options)||Object.keys(options).some(k=>!['query','scope','maxItems'].includes(k)) || !str(query)||!str(scope)||!num(maxItems)||maxItems>10000) fail('INVALID_BUNDLE_OPTIONS');
    const inScope=x=>!scope||x.scope===scope||x.scope==='*';
    const source=id=>home.sources.find(s=>s.id===id);
    const redact=x=>{
      if (!readable(source(x.sourceId))) return {id:x.id,scope:x.scope,content:'WITHHELD',reason:'SOURCE_NOT_READABLE',...(x.state?{state:x.state,effect:x.effect}:{})};
      const result=clone(x);
      if (result.books) result.books=result.books.map(b=>readable(source(b.sourceId))?b:
        {disposition:b.disposition,content:'WITHHELD',reason:'BOOK_SOURCE_NOT_READABLE'});
      return result;
    };
    const obligations=home.obligations.filter(x=>inScope(x)&&(['OPEN','WAITING'].includes(x.state)||x.effect==='UNKNOWN')).map(redact);
    const constraints=home.constraints.filter(x=>inScope(x)&&x.status==='ACTIVE').map(redact);
    const decisionScopes=[...new Set(home.decisions.filter(inScope).map(d=>d.scope))];
    const decisions=decisionScopes.map(s=>({scope:s,...resolveDecision(home,s)}));
    const criticalCount=obligations.length+constraints.length+decisions.length;
    const candidates=findSources(home,query).sources.filter(inScope);
    const q=normal(query);
    const learning=home.learning.filter(l=>inScope(l)&&l.status==='ACTIVE'&&readable(source(l.sourceId))&&
      (!q||l.triggers.some(t=>q.includes(normal(t)))));
    let room=Math.max(0,maxItems-criticalCount);
    const selectedSources=candidates.slice(0,room); room-=selectedSources.length;
    const selectedLearning=learning.slice(0,room);
    const omitted=[...candidates.slice(selectedSources.length).map(s=>({kind:'source',id:s.id,reason:'ITEM_BUDGET'})),
      ...learning.slice(selectedLearning.length).map(l=>({kind:'learning',id:l.id,reason:'ITEM_BUDGET'}))];
    return {schema:'proto-pilot-context/v1',homeId:home.homeId,version:home.version,scope,obligations,constraints,decisions,
      sources:selectedSources,learning:clone(selectedLearning),omitted,criticalOverflow:criticalCount>maxItems,
      completeness:omitted.length?'CRITICAL_COMPLETE_OPTIONAL_OMITTED':'SELECTED_SCOPE_COMPLETE',
      sourceFreshness:'RECORDED_NOT_LIVE',authority:'NONE',effectInstruction:obligations.some(x=>x.effect==='UNKNOWN')?'RECONCILE_UNKNOWN_NO_REPLAY':'NO_EFFECT_AUTHORIZATION'};
  }
  function applyEvent(home,event) {
    valid(home);
    const errors=[]; shape(event,{id,type:text,expectedVersion:num,payload:plain},'event',errors);
    if (errors.length) fail('INVALID_EVENT');
    if (home.storage!=='ALLOW') fail('STORAGE_FORBIDDEN');
    const encoded=canonical(event); if (encoded.length>16000) fail('EVENT_TOO_LARGE');
    const prior=home.applied.find(x=>x.id===event.id);
    if (prior) { if (prior.canonical!==encoded) fail('EVENT_ID_CONFLICT'); return {status:'REPLAY',home:clone(home)}; }
    if (event.expectedVersion!==home.version) fail('VERSION_CONFLICT');
    if (event.type==='question') {
      if (Object.keys(event.payload).length) fail('QUESTION_HAS_PAYLOAD');
      return {status:'NO_CHANGE',home:clone(home)};
    }
    const next=clone(home), p=event.payload;
    function check(spec) { const e=[]; shape(p,spec,'payload',e); if(e.length) fail('INVALID_PAYLOAD'); }
    function add(group,kind) { check(fields[kind]); if(next[group].some(x=>x.id===p.id)) fail('RECORD_ID_EXISTS'); next[group].push(clone(p)); }
    function existing(group,key) { const r=next[group].find(x=>x.id===key); if(!r) fail('RECORD_MISSING'); return r; }
    switch(event.type) {
      case 'source.upsert': {
        check(fields.source); const i=next.sources.findIndex(x=>x.id===p.id);
        if(i<0) next.sources.push(clone(p)); else next.sources[i]=clone(p); break;
      }
      case 'decision.add': add('decisions','decision'); break;
      case 'decision.withdraw': check({id}); existing('decisions',p.id).status='WITHDRAWN'; break;
      case 'obligation.add': add('obligations','obligation'); break;
      case 'obligation.update': {
        check(fields.obligation); const o=existing('obligations',p.id);
        if (o.scope!==p.scope||o.sourceId!==p.sourceId||o.summary!==p.summary) fail('OBLIGATION_IDENTITY_CHANGE');
        if (['COMPLETED','WITHDRAWN'].includes(o.state)&&p.state!==o.state) fail('TERMINAL_WORK_NO_REPLAY');
        if(o.effect==='UNKNOWN'&&p.effect!=='UNKNOWN') fail('EFFECT_RECONCILIATION_REQUIRED');
        if(o.effect==='CONFIRMED'&&p.effect!=='CONFIRMED') fail('CONFIRMED_EFFECT_IMMUTABLE');
        if (canonical(o.books.map(b=>b.sourceId))!==canonical(p.books.map(b=>b.sourceId))) fail('BOOK_SET_CHANGE');
        for (const b of o.books) if(['WRITTEN','NO_POST'].includes(b.disposition)&&canonical(b)!==canonical(p.books.find(x=>x.sourceId===b.sourceId))) fail('BOOK_DISPOSITION_IMMUTABLE');
        Object.assign(o,clone(p)); break;
      }
      case 'obligation.withdraw': check({id}); existing('obligations',p.id).state='WITHDRAWN'; break;
      case 'effect.reconcile': {
        check({id,outcome:en(['NONE','CONFIRMED']),evidence:text}); const o=existing('obligations',p.id);
        if(o.effect!=='UNKNOWN') fail('EFFECT_NOT_UNKNOWN'); o.effect=p.outcome; o.evidence=p.evidence; break;
      }
      case 'learning.add': add('learning','learning'); break;
      case 'learning.disposition': {
        check({id,disposition:fields.learning.disposition,evidence:text}); const l=existing('learning',p.id);
        if(l.status!=='ACTIVE') fail('LEARNING_WITHDRAWN'); l.disposition=p.disposition; l.evidence=p.evidence; break;
      }
      case 'learning.withdraw': check({id}); existing('learning',p.id).status='WITHDRAWN'; break;
      case 'constraint.add': add('constraints','constraint'); break;
      case 'constraint.withdraw': check({id}); existing('constraints',p.id).status='WITHDRAWN'; break;
      default: fail('UNKNOWN_EVENT_TYPE');
    }
    next.version++; next.applied.push({id:event.id,canonical:encoded,version:next.version});
    if(validateHome(next).length) fail('INVALID_TRANSITION');
    return {status:'APPLIED',home:next};
  }
  return Object.freeze({validateHome,findSources,resolveDecision,contextBundle,applyEvent});
});
