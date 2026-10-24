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
- `contextBundle(home,{query='',scope='',maxItems=20})` retains all active
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
