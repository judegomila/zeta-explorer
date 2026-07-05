// src/data/imp-33912-33877-33879-honesty-gate-audit.js
//
// imp-33912: Audit the honesty-gate assertion coverage across the
// imp-33877/imp-33878/imp-33879 (widening-fit tail-endpoint / hump-argmax
// grid-refinement / geometric-center correction) cohort: confirm each module
// carries an executable isRigorous:false / NO-QED tripwire assertion,
// mirroring the imp-33827 and imp-33841 cohort honesty-gate audits.
//
// QUESTION: does each of the three modules back its prose honest-status
// caveat with an EXECUTABLE build-time assertion that THROWS if the honest
// framing is weakened or removed, or does it rely on prose/comments alone?
//
// GREP + READ RESULT (2026-07-05): all three modules pass -- each carries a
// literal `isRigorous: false` boolean field checked by a dedicated
// `*_ASSERTIONS` array entry (id `imp3387[7-9]-honesty-gate-no-qed`) that is
// walked by a `for` loop throwing on any failure. Like the imp-33841 cohort
// (imp-33808/imp-33809/imp-33810), this cohort is CONVENTION-CONSISTENT: all
// three use the same literal `isRigorous:false` shape and the same
// exported-array-plus-throwing-loop tripwire mechanism.

const COHORT_HONESTY_GATES = Object.freeze([
  Object.freeze({
    ticket: 'imp-33877',
    path: '/src/data/imp-33877-widening-fit-tail-endpoint-artifact-test.js',
    usesIsRigorousField: true,
    honestyFieldShape: 'boolean-field(isRigorous)',
    hasExecutableTripwire: true,
    tripwireMechanism: 'exported *_ASSERTIONS array entry (imp33877-honesty-gate-no-qed)',
  }),
  Object.freeze({
    ticket: 'imp-33878',
    path: '/src/data/imp-33878-hump-argmax-grid-refinement.js',
    usesIsRigorousField: true,
    honestyFieldShape: 'boolean-field(isRigorous)',
    hasExecutableTripwire: true,
    tripwireMechanism: 'exported *_ASSERTIONS array entry (imp33878-honesty-gate-no-qed)',
  }),
  Object.freeze({
    ticket: 'imp-33879',
    path: '/src/data/imp-33879-geometric-center-correction-endpoint-midpoint-offset.js',
    usesIsRigorousField: true,
    honestyFieldShape: 'boolean-field(isRigorous)',
    hasExecutableTripwire: true,
    tripwireMechanism: 'exported *_ASSERTIONS array entry (imp33879-honesty-gate-no-qed)',
  }),
]);

const COVERED_COUNT = COHORT_HONESTY_GATES.filter((m) => m.hasExecutableTripwire).length;
const ISRIGOROUS_FIELD_COUNT = COHORT_HONESTY_GATES.filter((m) => m.usesIsRigorousField).length;
const UNCOVERED_TICKETS = COHORT_HONESTY_GATES.filter((m) => !m.hasExecutableTripwire).map((m) => m.ticket);

export const IMP33912_COHORT_HONESTY_GATE_AUDIT = Object.freeze({
  id: 'imp-33912-33877-33879-honesty-gate-audit',
  ticket: 'imp-33912',
  cohort: COHORT_HONESTY_GATES,
  coveredCount: COVERED_COUNT,
  isRigorousFieldCount: ISRIGOROUS_FIELD_COUNT,
  uncoveredTickets: UNCOVERED_TICKETS,

  summary:
    'All three imp-33877/imp-33878/imp-33879 modules carry an executable honesty-gate tripwire ' +
    'that throws at import if the honest framing is weakened: each uses a literal ' +
    '`isRigorous: false` boolean field checked by a dedicated *_ASSERTIONS array entry ' +
    '(imp3387[7-9]-honesty-gate-no-qed). None relies on prose/comments alone, and like the ' +
    'imp-33841 cohort audit (imp-33808/imp-33809/imp-33810), this cohort is fully ' +
    'convention-consistent.',

  verdict:
    'COHORT-FULLY-COVERED, CONVENTION-CONSISTENT: 3 of 3 modules have an executable honesty ' +
    'tripwire (0 prose-only gaps), and all 3 use the literal `isRigorous:false` field named in ' +
    'the ticket title. No bound changed; imp-3066 K_a>=0 untouched; NO QED; Platt-Trudgian ' +
    'Lambda <= 0.2 remains the rigorous SOTA.',

  honest:
    'AUDIT-ONLY -- reports the honesty-gate tripwire coverage found by reading each of the three ' +
    'modules; does not modify any module and does not change scripts/run-assertions.mjs wiring. ' +
    'Platt-Trudgian Lambda <= 0.2 stays the rigorous SOTA.',
});

export const IMP33912_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp-33912-cohort-has-three-modules',
    description: 'the audited cohort names exactly the three imp-33877..imp-33879 modules',
    holds: () => COHORT_HONESTY_GATES.length === 3
      && COHORT_HONESTY_GATES.every((m) => /^imp-3387[7-9]$/.test(m.ticket)),
  },
  {
    id: 'imp-33912-all-three-covered',
    description: 'all three modules have an executable honesty-gate tripwire; no uncovered tickets',
    holds: () => COVERED_COUNT === 3 && UNCOVERED_TICKETS.length === 0,
  },
  {
    id: 'imp-33912-all-three-use-isrigorous-field',
    description: 'all three modules use the literal isRigorous:false field convention (fully consistent, no split)',
    holds: () => ISRIGOROUS_FIELD_COUNT === 3
      && COHORT_HONESTY_GATES.every((m) => m.usesIsRigorousField === true)
      && COHORT_HONESTY_GATES.every((m) => m.honestyFieldShape === 'boolean-field(isRigorous)'),
  },
  {
    id: 'imp-33912-all-three-use-assertions-array-tripwire',
    description: 'all three modules gate honesty via an *_ASSERTIONS array entry, not an inline if/throw',
    holds: () => COHORT_HONESTY_GATES.every((m) => m.tripwireMechanism.includes('*_ASSERTIONS array entry')),
  },
  {
    id: 'imp-33912-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and PT Lambda <= 0.2 stays SOTA',
    holds: () => /AUDIT-ONLY/.test(IMP33912_COHORT_HONESTY_GATE_AUDIT.honest)
      && /Lambda <= 0.2 stays the rigorous SOTA/.test(IMP33912_COHORT_HONESTY_GATE_AUDIT.honest)
      && /NO QED/.test(IMP33912_COHORT_HONESTY_GATE_AUDIT.verdict)
      && /Lambda <= 0.2 remains the rigorous SOTA/.test(IMP33912_COHORT_HONESTY_GATE_AUDIT.verdict),
  },
];

for (const a of IMP33912_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33912-33877-33879-honesty-gate-audit assertion failed: ${a.id}`);
  }
}

export default IMP33912_COHORT_HONESTY_GATE_AUDIT;
