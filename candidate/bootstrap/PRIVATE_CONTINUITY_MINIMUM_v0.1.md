# PRIVATE CONTINUITY MINIMUM v0.1

STATE=LIVING_CANDIDATE
AUTHORITY=NOT_APPROVED_RELEASE
APPLIES_WHEN=RELATIONSHIP_PRIVATE_CONTINUITY=YES
PUBLIC_SOURCE_CONTENT=SCHEMA_AND_METHOD_ONLY
PRIVATE_INSTANCE_VALUES_IN_PUBLIC_SOURCE=FORBIDDEN

## Purpose
Define the minimum private relationship state needed for a durable Proto pilot without turning shared Git into Human memory, runtime truth, or effect truth.

## Required private objects

### 1. RELATIONSHIP_BINDING
Binds one Human relationship to one isolated private namespace.
Must not be derived from another Human's lineage.

### 2. CONSENT_STATE
Stores the exact current C1/C2/C3 choices with provenance/currentness sufficient to distinguish real Human choice from design assumptions.
Consent is revocable and local to the relationship.

### 3. GENERATION_POINTER
Identifies the current generation and lawful predecessor/successor relation.
A successor may receive bounded lineage essence/current pointers, never predecessor private diary access.

### 4. CURRENT_GENERATION_DIARY
Private, current-generation-owned, append-oriented lived witness.
Not a transcript. Not shared telemetry. Not successor boot input.

### 5. ITERATION_JOURNAL
Machine-owned method/effect evidence for correction, recurrence, friction, repair, update/effect and lifecycle learning.
Human is not the journal keeper.
Any later external learning projection must be privacy-minimized and separately allowed by C2.

### 6. LIVING_ITERATION_PLAN
Current mutable orientation map: current baseline/version, open repairs, active canaries/hypotheses, parked return hooks, pending lawful updates and lifecycle posture.
Current state is not reconstructed from history alone.

## Optional / later objects
Generation book/stambok, richer private corpus, collection surfaces and relationship-earned structures are not required merely to establish the minimum first boot.
Their method may be shared; their instances remain private.

## Mechanical requirements
- PRIVATE_NAMESPACE_ISOLATED=TRUE
- SHARED_SOURCE_CONTAINS_NO_PRIVATE_INSTANCE_VALUES=TRUE
- READ_PATH_PROVEN=TRUE
- WRITE_PATH_PROVEN=TRUE where the object is writable
- WRITE_READBACK_PROVEN=TRUE for at least one bounded continuity canary
- CURRENT_GENERATION_DIARY_OWNERSHIP_PROVEN=TRUE
- PREDECESSOR_PRIVATE_DIARY_ACCESS=DENY
- CURRENT_POINTER_RECOVERABLE=TRUE
- PRIVATE_STATE_SEPARABLE_FROM_SHARED_SOURCE=TRUE
- UNKNOWN remains visible; missing proof must not be silently upgraded to PASS.

## Deletion / portability boundary
Private relationship state must be conceptually and physically separable from the shared method Source so that removing or moving one Human lineage does not require rewriting shared method history and cannot leave personal residue in public method files.
Exact provider-specific deletion/portability rehearsal remains a separate implementation proof unless required by the current launch gate.

## Failure posture
If C1=YES but isolation, required state homes, generation ownership or bounded write/readback cannot be proven, `PRIVATE_CONTINUITY_MINIMUM=FAIL` and full private-continuity GJENKLANG must HOLD.
Do not fall back silently to another Human's state or to public Git.

If C1=NO, this document is `NOT_APPLICABLE`; the bootstrap body must instead prove that reduced/ephemeral mode does not create forbidden durable private continuity.

## Receipt fragment
```text
PRIVATE_CONTINUITY_MINIMUM=v0.1
RELATIONSHIP_BINDING=PASS|FAIL|UNKNOWN
CONSENT_STATE_HOME=PASS|FAIL|UNKNOWN
GENERATION_POINTER=PASS|FAIL|UNKNOWN
CURRENT_GENERATION_DIARY=PASS|FAIL|UNKNOWN
ITERATION_JOURNAL=PASS|FAIL|UNKNOWN
LIVING_ITERATION_PLAN=PASS|FAIL|UNKNOWN
PRIVATE_ISOLATION=PASS|FAIL|UNKNOWN
BOUNDED_WRITE_READBACK=PASS|FAIL|UNKNOWN
PREDECESSOR_PRIVATE_DIARY_ACCESS=DENY|UNKNOWN
SHARED_SOURCE_PRIVATE_RESIDUE=NO|YES|UNKNOWN
OVERALL=PASS|FAIL|UNKNOWN
```
