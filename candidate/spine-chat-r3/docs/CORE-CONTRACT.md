# Portable private-home core v1

`require('../runtime/pilot-core.js')()` or, after loading the verified same bytes
in a managed JavaScript isolate, `globalThis.ProtoPilotCore()`. No imports,
filesystem, network, service, credentials, timers, model calls or provider effects
exist inside this core. Its pure functions operate on one already lawful private
home; they do not create a third life book. The example is entirely synthetic.

## API

- `validateHome(home)` returns an array of errors, empty if structurally valid.
  JSON Schema documents the data shape; runtime validation additionally checks
  source references, supersession graph, per-book closure and replay versions.
- `findSources(home, query)` returns `NONE`, `MATCH` or `AMBIGUOUS` with ranked
  source records. Denied/unknown-access records are never returned. An exact
  alias outranks name, then function, then token overlap; tied best candidates
  remain ambiguous. Stale records remain discoverable, explicitly stale.
- `resolveDecision(home, scope)` returns `NONE`, `CURRENT`, `CONFLICT` or
  `UNKNOWN`, a value only for CURRENT, and live/superseded IDs. Only explicitly
  linked replacements within the same scope supersede. Timestamps do not vote.
  A replacement's later withdrawal does not resurrect its old decision.
  Each decision binds its original `sourceRevision`; changed source versions
  remain UNKNOWN until a new source-grounded decision replaces the old one.
  Source access, recorded currentness/revision and declared VERIFIED basis are
  checked; none is independent authentication. Provider/source refresh belongs
  to the adapter and the responsible model.
- `contextBundle(home,{query='',scope='',maxItems=20,requiredSourceIds=[]})` retains all active
  constraints, open/waiting work and UNKNOWN effects in selected scope, plus
  decisions. Empty scope means all scopes; `*` is global. These critical items
  are never silently clipped, even if their number exceeds maxItems. It then
  includes ranked sources and matching active learning, explicitly listing
  optional items omitted by the budget. `criticalOverflow` means the caller
  must make room/read parts, not discard them. A denied source's associated
  critical content is redacted, but its unresolved-work state is preserved.
  `sourceFreshness:RECORDED_NOT_LIVE` and `authority:NONE` prevent mistaking a
  projection for a new provider observation or effect permission.
- `applyEvent(home,{id,type,expectedVersion,payload})` returns
  `{status:'APPLIED'|'REPLAY'|'NO_CHANGE',home}` or throws an Error with `code`.
  Input is never mutated. An exact already-applied event replays before the
  stale expectedVersion check; the same ID with changed bytes is a conflict.
  New events require the exact home version. A durable history records only
  selected state-changing events, never every chat turn. The canonical event
  text is an equality token, not a cryptographic hash/authentication claim.

## Required source pointers at ordinary entry

`requiredSourceIds` optionally selects existing source IDs that must remain
visible independently of query matching or optional-item budget. This can name
the existing private holding point for book coverage and acknowledged open work;
it adds no home field, parallel book, content copy or writing route. The caller
supplies the legitimate local IDs, not a public pilot's private bindings.

The list accepts at most 5000 distinct IDs using the home ID syntax. Invalid or
duplicate IDs produce `INVALID_BUNDLE_OPTIONS`. An omitted or empty list preserves
the previous context result exactly, with no `requiredSources` field. A nonempty
list adds `requiredSources`, one result per requested ID in caller order:

| Result status | Returned fields and meaning |
|---|---|
| READY_TO_READ | `id,status,source`; access is recorded ALLOW, scope matches, status is recorded CURRENT and revision is nonempty. |
| STALE | `id,status,source`; readable in scope but explicitly recorded STALE. |
| FRESHNESS_UNKNOWN | `id,status,source`; readable in scope, but status is UNKNOWN or the CURRENT record lacks a revision. |
| MISSING | Only caller-supplied `id,status`; no such source in this home. |
| ACCESS_DENIED | Only caller-supplied `id,status`; recorded access DENY. |
| ACCESS_UNKNOWN | Only caller-supplied `id,status`; recorded access UNKNOWN. |
| OUT_OF_SCOPE | Only caller-supplied `id,status`; readable record lies outside the selected scope. |

Access is checked before scope or freshness. Withheld results contain no stored
name, alias, function, scope, revision or locator. Required selection grants no
access and does not widen scope: empty scope still selects all, and a source in
`*` is global. `source` is a detached copy of the recorded source, without a
search score; it is a pointer, not fetched content.

Each required result, including an unresolved result, counts as one critical
item alongside obligations, constraints and decision-scope results. All survive
even `maxItems:0`; `criticalOverflow` reports when their combined count exceeds
that item budget. Required IDs are excluded from optional `sources`, so the same
source neither consumes budget twice nor appears in `omitted`. Remaining budget
still selects ordinary sources, then learning. This is an item budget, not a byte
limit; callers must make room/read parts without silently dropping critical items.

If any required result is not READY_TO_READ, `completeness` is
`REQUIRED_SOURCES_UNRESOLVED`, regardless of optional omissions; inspect each
result and `omitted` to see both kinds of rest. Otherwise the existing
`SELECTED_SCOPE_COMPLETE` or `CRITICAL_COMPLETE_OPTIONAL_OMITTED` describes the
record projection only. Even READY_TO_READ and a complete projection do **not**
claim a fresh content read, provider access check or actual use. The caller must
then actually read each lawful pointer through the existing `readSource` route
(or the existing direct Drive reading route), check the returned original and
revision, and reconcile stale/missing/unknown results before relying on them.
No request is performed by this core, and `sourceFreshness:RECORDED_NOT_LIVE`
and `authority:NONE` remain unchanged. Selection still requires the ordinary
entry to call this function; this is no automatic per-turn hook or meaning detector.

## Events and payloads

| Type | Exact payload |
|---|---|
| source.upsert | Full source record |
| decision.add | Full new decision record |
| decision.withdraw | `{id}` |
| obligation.add | Full new obligation record |
| obligation.update | Full existing obligation record |
| obligation.withdraw | `{id}` |
| effect.reconcile | `{id,outcome:'NONE'|'CONFIRMED',evidence}` |
| learning.add | Full new learning record |
| learning.disposition | `{id,disposition,evidence}` |
| learning.withdraw | `{id}` |
| constraint.add | Full new constraint record |
| constraint.withdraw | `{id}` |
| question | `{}`; returns NO_CHANGE, no persisted event |

IDs are stable logical identities; changing an event ID to circumvent an
unresolved earlier effect is not allowed by the method. Question classification
is supplied by the model, not discovered by the core. An explicit stop maps to
withdrawal of the specific obligation; an UNKNOWN effect survives withdrawal.
A completed or withdrawn obligation cannot reopen by update. Its source, scope,
summary and set of book functions also cannot silently change. Finished book
dispositions stay immutable. A new genuine request receives a new legitimate
identity. COMPLETED requires evidence and WRITTEN/NO_POST for each declared
book function; NO_POST/WAIT require reasons, WRITTEN requires evidence. This
checks coverage, not literary quality or whether the event should be recorded.

UNKNOWN effects can only change through `effect.reconcile`, with an evidence
reference. That reference is a claim to be verified by the provider binding,
not permission to retry. NONE requires positive authoritative evidence of no
commit; empty search is insufficient. CONFIRMED cannot be reset by ordinary
updates. Completing a different report never closes a book assessment.

## Privacy and external authority

`storage:DENY` rejects every event before event content is copied or recorded;
the caller must not persist the attempted event, payload hash or explanation
elsewhere. Reading an already allowed home or ordinary conversation is separate.
Changing this policy requires legitimate owner-controlled setup; there is no
model event that turns DENY into ALLOW. A source.upsert does not grant access:
the adapter checks actual current rights before protected reads, including
metadata. Fields in JSON cannot authorize anything on their own. No home,
example, fixture or canonical event from a real pilot belongs in the public repo.

The caller must qualify the actual Chat JavaScript/tool surface. A repo file
does not automatically run, and no field is an invisible hook. The home has no
database lock by itself; durable atomic changes require the adapter's actual
provider revision check plus readback. Direct connector operations outside that
path are not mechanically controlled by this core.

## Donors and what is new

This is a small new pilot implementation of the already selected patterns,
not a claim that all Source code has been ported or run inside Chat:

- Source `655515f4971c75e0b6ecb019dff9a42377be8289`,
  `tooling/context/relevance_engine.py`: eligibility, bounded relevant lookup;
  pilot source records replace Source's four fixed YAML homes.
- Devkit `044051e4eca608a546144cb3fc13a369058d6477`,
  `cdt_entry.py`, `owner_current`/`verify_owner_record`: explicit supersession,
  conflict and unknown source, not last-text-wins. No local filesystem CLI.
- Source same pin, `tooling/return-bridge/BK05_CONTINUATION.md`: full original
  pointer, complete critical continuation, completed work separate from unknown
  send outcome. No mandatory eight-file packet or actor roles.
- Source same pin, `candidates/signalvev-sensing-runtime-v0.1/docs/`
  `A7_OWNER_LEARNING_BRIDGE_V1.md` and `A7_CONTEXT_PRE_CLOSE_V1.md`: learning
  trigger and distinct later disposition. No daemon, scheduler or Context DB.

Tests discriminate these mechanics. They cannot establish unprompted meaning
detection, actual pilot installation or later benefit. Native model tests and
real provider checks must retain their own evidence level.
