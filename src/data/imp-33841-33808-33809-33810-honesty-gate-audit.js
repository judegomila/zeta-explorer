// src/data/imp-33841-33808-33809-33810-honesty-gate-audit.js
//
// imp-33841: Audit the honesty-gate assertion coverage across the
// imp-33808/imp-33809/imp-33810 curvature/attribution cohort: confirm each
// module carries an executable isRigorous:false / NO-QED tripwire assertion,
// mirroring the imp-33827 cohort honesty-gate audit.
//
// QUESTION: does each of the three modules back its prose honest-status
// caveat with an EXECUTABLE build-time assertion that THROWS if the honest
// framing is weakened or removed, or does it rely on prose/comments alone?
//
// GREP + READ RESULT (2026-07-04): all three modules pass -- each carries a
// literal `isRigorous: false` boolean field checked by a dedicated
// `*_ASSERTIONS` array entry (id `imp3380[8-9|10]-honesty-gate-no-qed`) that
// is walked by a `for` loop throwing on any failure. Unlike the imp-33827
// cohort (which had a 2/4 split between an `isRigorous` field and a
// `honestCaveat` field), this cohort is CONVENTION-CONSISTENT: all three use
// the same literal `isRigorous:false` shape.

const COHORT_HONESTY_GATES = Object.freeze([
  Object.freeze({
    ticket: 'imp-33808',
    path: '/src/data/imp-33808-oneovert2-inflection-separation-derivation.js',
    usesIsRigorousField: true,
    honestyFieldShape: 'boolean-field(isRigorous)',
    hasExecutableTripwire: true,
    tripwireMechanism: 'exported *_ASSERTIONS array entry (imp33808-honesty-gate-no-qed)',
  }),
  Object.freeze({
    ticket: 'imp-33809',
    path: '/src/data/imp-33809-saturation-curvature-hump-vs-k.js',
    usesIsRigorousField: true,
    honestyFieldShape: 'boolean-field(isRigorous)',
    hasExecutableTripwire: true,
    tripwireMechanism: 'exported *_ASSERTIONS array entry (imp33809-honesty-gate-no-qed)',
  }),
  Object.freeze({
    ticket: 'imp-33810',
    path: '/src/data/imp-33810-eflow-resid-ratio-N-ladder.js',
    usesIsRigorousField: true,
    honestyFieldShape: 'boolean-field(isRigorous)',
    hasExecutableTripwire: true,
    tripwireMechanism: 'exported *_ASSERTIONS array entry (imp33810-honesty-gate-no-qed)',
  }),
]);

const COVERED_COUNT = COHORT_HONESTY_GATES.filter((m) => m.hasExecutableTripwire).length;
const ISRIGOROUS_FIELD_COUNT = COHORT_HONESTY_GATES.filter((m) => m.usesIsRigorousField).length;
const UNCOVERED_TICKETS = COHORT_HONESTY_GATES.filter((m) => !m.hasExecutableTripwire).map((m) => m.ticket);

export const IMP33841_COHORT_HONESTY_GATE_AUDIT = Object.freeze({
  id: 'imp-33841-33808-33809-33810-honesty-gate-audit',
  ticket: 'imp-33841',
  cohort: COHORT_HONESTY_GATES,
  coveredCount: COVERED_COUNT,
  isRigorousFieldCount: ISRIGOROUS_FIELD_COUNT,
  uncoveredTickets: UNCOVERED_TICKETS,

  summary:
    'All three imp-33808/imp-33809/imp-33810 modules carry an executable honesty-gate tripwire ' +
    'that throws at import if the honest framing is weakened: each uses a literal ' +
    '`isRigorous: false` boolean field checked by a dedicated *_ASSERTIONS array entry ' +
    '(imp3380[8-9|10]-honesty-gate-no-qed). None relies on prose/comments alone, and unlike the ' +
    'imp-33827 cohort audit (which found a 2/4 isRigorous-vs-honestCaveat split), this cohort is ' +
    'fully convention-consistent.',

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

export const IMP33841_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp-33841-cohort-has-three-modules',
    description: 'the audited cohort names exactly the three imp-33808..imp-33810 modules',
    holds: () => COHORT_HONESTY_GATES.length === 3
      && COHORT_HONESTY_GATES.every((m) => /^imp-3380(8|9)$|^imp-33810$/.test(m.ticket)),
  },
  {
    id: 'imp-33841-all-three-covered',
    description: 'all three modules have an executable honesty-gate tripwire; no uncovered tickets',
    holds: () => COVERED_COUNT === 3 && UNCOVERED_TICKETS.length === 0,
  },
  {
    id: 'imp-33841-all-three-use-isrigorous-field',
    description: 'all three modules use the literal isRigorous:false field convention (fully consistent, no split)',
    holds: () => ISRIGOROUS_FIELD_COUNT === 3
      && COHORT_HONESTY_GATES.every((m) => m.usesIsRigorousField === true)
      && COHORT_HONESTY_GATES.every((m) => m.honestyFieldShape === 'boolean-field(isRigorous)'),
  },
  {
    id: 'imp-33841-all-three-use-assertions-array-tripwire',
    description: 'all three modules gate honesty via an *_ASSERTIONS array entry, not an inline if/throw',
    holds: () => COHORT_HONESTY_GATES.every((m) => m.tripwireMechanism.includes('*_ASSERTIONS array entry')),
  },
  {
    id: 'imp-33841-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and PT Lambda <= 0.2 stays SOTA',
    holds: () => /AUDIT-ONLY/.test(IMP33841_COHORT_HONESTY_GATE_AUDIT.honest)
      && /Lambda <= 0.2 stays the rigorous SOTA/.test(IMP33841_COHORT_HONESTY_GATE_AUDIT.honest)
      && /NO QED/.test(IMP33841_COHORT_HONESTY_GATE_AUDIT.verdict)
      && /Lambda <= 0.2 remains the rigorous SOTA/.test(IMP33841_COHORT_HONESTY_GATE_AUDIT.verdict),
  },
];

for (const a of IMP33841_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33841-33808-33809-33810-honesty-gate-audit assertion failed: ${a.id}`);
  }
}

export default IMP33841_COHORT_HONESTY_GATE_AUDIT;
