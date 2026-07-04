// src/data/imp-33827-cohort-honesty-gate-audit.js
//
// imp-33827: Audit the honesty-gate assertion coverage across the
// imp-33786/imp-33787/imp-33788/imp-33789 cohort: confirm each module carries
// an executable isRigorous:false / NO-QED tripwire, mirroring the imp-33733
// and imp-33807 honesty audits (both of which named the pattern but were
// never themselves completed as standalone modules -- so this audit follows
// their ticket description directly rather than an existing precedent file).
//
// QUESTION: does each of the four modules back its prose honest-status
// caveat with an EXECUTABLE build-time assertion that THROWS if the honest
// framing is weakened or removed, or does it rely on prose/comments alone?
//
// GREP + READ RESULT (2026-07-04): all four modules pass -- each has at
// least one self-executing tripwire (an *_ASSERTIONS array walked by a
// `for` loop, or an inline `if (...) throw`) that checks the honesty gate.
// None relies on prose/comments alone. But the CONVENTION differs:
//   - imp-33786: literal `isRigorous: false` boolean field + an
//     `*_ASSERTIONS` array entry checking it plus regexes on `verdict`.
//   - imp-33787: NO `isRigorous` field; a string `honestCaveat` field
//     instead, checked by an inline tripwire (#7) via substring tests.
//   - imp-33788: literal `isRigorous: false` boolean field + an
//     `*_ASSERTIONS` array entry checking it plus regexes on `verdict`.
//   - imp-33789: NO `isRigorous` field; a structured `honestCaveat` OBJECT
//     (11 boolean sub-fields) checked by a dedicated `*_ASSERTIONS` entry.
//
// So the cohort is FULLY COVERED (4/4 executable honesty tripwires, 0/4
// prose-only), but only 2/4 use the literal `isRigorous:false` field named
// in the ticket title -- the other 2 use an equally load-bearing but
// differently-shaped `honestCaveat` convention. Read-only audit; no module
// edited, no run-assertions.mjs wiring changed (imp-33826 already found the
// three unwired modules and left wiring as a follow-up, not performed here
// either).

const COHORT_HONESTY_GATES = Object.freeze([
  Object.freeze({
    ticket: 'imp-33786',
    path: '/src/data/imp-33786-h3-joint-curvature-input-scoping.js',
    usesIsRigorousField: true,
    honestyFieldShape: 'boolean-field(isRigorous)',
    hasExecutableTripwire: true,
    tripwireMechanism: 'exported *_ASSERTIONS array entry (imp33786-honesty-gate-no-qed)',
  }),
  Object.freeze({
    ticket: 'imp-33787',
    path: '/src/data/imp-33787-g7-perron-lower-bound.js',
    usesIsRigorousField: false,
    honestyFieldShape: 'string-field(honestCaveat)',
    hasExecutableTripwire: true,
    tripwireMechanism: 'inline if/throw statement (tripwire #7 of 7)',
  }),
  Object.freeze({
    ticket: 'imp-33788',
    path: '/src/data/imp-33788-eflow-displacement-sqrtlog-running-correction.js',
    usesIsRigorousField: true,
    honestyFieldShape: 'boolean-field(isRigorous)',
    hasExecutableTripwire: true,
    tripwireMechanism: 'exported *_ASSERTIONS array entry (imp33788-honesty-gate-no-qed)',
  }),
  Object.freeze({
    ticket: 'imp-33789',
    path: '/src/data/imp-33789-decoupled-rate-grid.js',
    usesIsRigorousField: false,
    honestyFieldShape: 'object-field(honestCaveat, 11 booleans)',
    hasExecutableTripwire: true,
    tripwireMechanism: 'exported *_ASSERTIONS array entry (imp33789-honest-diagnostic-not-a-verdict)',
  }),
]);

const COVERED_COUNT = COHORT_HONESTY_GATES.filter((m) => m.hasExecutableTripwire).length;
const ISRIGOROUS_FIELD_COUNT = COHORT_HONESTY_GATES.filter((m) => m.usesIsRigorousField).length;
const UNCOVERED_TICKETS = COHORT_HONESTY_GATES.filter((m) => !m.hasExecutableTripwire).map((m) => m.ticket);

export const IMP33827_COHORT_HONESTY_GATE_AUDIT = Object.freeze({
  id: 'imp-33827-cohort-honesty-gate-audit',
  ticket: 'imp-33827',
  cohort: COHORT_HONESTY_GATES,
  coveredCount: COVERED_COUNT,
  isRigorousFieldCount: ISRIGOROUS_FIELD_COUNT,
  uncoveredTickets: UNCOVERED_TICKETS,

  summary:
    'All four imp-33786/imp-33787/imp-33788/imp-33789 modules carry an executable honesty-gate ' +
    'tripwire that throws at import if the honest framing is weakened: imp-33786 and imp-33788 ' +
    'use a literal `isRigorous: false` boolean field checked by an *_ASSERTIONS array entry; ' +
    'imp-33787 checks a string `honestCaveat` field via an inline if/throw tripwire; imp-33789 ' +
    'checks a structured `honestCaveat` object (11 boolean sub-fields) via a dedicated ' +
    '*_ASSERTIONS entry. None relies on prose/comments alone.',

  verdict:
    'COHORT-FULLY-COVERED, CONVENTION-INCONSISTENT: 4 of 4 modules have an executable honesty ' +
    'tripwire (0 prose-only gaps), but only 2 of 4 (imp-33786, imp-33788) use the literal ' +
    '`isRigorous:false` field named in the ticket title; the other 2 (imp-33787, imp-33789) use ' +
    'an equally load-bearing but differently-shaped `honestCaveat` field. No bound changed; ' +
    'imp-3066 K_a>=0 untouched; NO QED; Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',

  honest:
    'AUDIT-ONLY -- reports the honesty-gate tripwire coverage found by reading each of the four ' +
    'modules; does not modify any module, does not standardize the field convention, and does ' +
    'not change scripts/run-assertions.mjs wiring (imp-33826 already found 3 of 4 unwired from ' +
    'the build sweep; that gap is orthogonal to this one and left as-is). Platt-Trudgian Lambda ' +
    '<= 0.2 stays the rigorous SOTA.',
});

export const IMP33827_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp-33827-cohort-has-four-modules',
    description: 'the audited cohort names exactly the four imp-33786..imp-33789 modules',
    holds: () => COHORT_HONESTY_GATES.length === 4
      && COHORT_HONESTY_GATES.every((m) => /^imp-3378[6-9]$/.test(m.ticket)),
  },
  {
    id: 'imp-33827-all-four-covered',
    description: 'all four modules have an executable honesty-gate tripwire; no uncovered tickets',
    holds: () => COVERED_COUNT === 4 && UNCOVERED_TICKETS.length === 0,
  },
  {
    id: 'imp-33827-exactly-two-use-isrigorous-field',
    description: 'exactly imp-33786 and imp-33788 use the literal isRigorous:false field convention',
    holds: () => ISRIGOROUS_FIELD_COUNT === 2
      && COHORT_HONESTY_GATES.find((m) => m.ticket === 'imp-33786').usesIsRigorousField === true
      && COHORT_HONESTY_GATES.find((m) => m.ticket === 'imp-33788').usesIsRigorousField === true
      && COHORT_HONESTY_GATES.find((m) => m.ticket === 'imp-33787').usesIsRigorousField === false
      && COHORT_HONESTY_GATES.find((m) => m.ticket === 'imp-33789').usesIsRigorousField === false,
  },
  {
    id: 'imp-33827-imp33787-uses-inline-string-tripwire',
    description: 'imp-33787 is correctly recorded as an inline if/throw tripwire on a string honestCaveat field',
    holds: () => COHORT_HONESTY_GATES.find((m) => m.ticket === 'imp-33787').honestyFieldShape === 'string-field(honestCaveat)'
      && COHORT_HONESTY_GATES.find((m) => m.ticket === 'imp-33787').tripwireMechanism.includes('inline if/throw'),
  },
  {
    id: 'imp-33827-imp33789-uses-object-tripwire',
    description: 'imp-33789 is correctly recorded as an *_ASSERTIONS array entry on an object honestCaveat field',
    holds: () => COHORT_HONESTY_GATES.find((m) => m.ticket === 'imp-33789').honestyFieldShape === 'object-field(honestCaveat, 11 booleans)'
      && COHORT_HONESTY_GATES.find((m) => m.ticket === 'imp-33789').tripwireMechanism.includes('*_ASSERTIONS array entry'),
  },
  {
    id: 'imp-33827-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and PT Lambda <= 0.2 stays SOTA',
    holds: () => /AUDIT-ONLY/.test(IMP33827_COHORT_HONESTY_GATE_AUDIT.honest)
      && /Lambda <= 0.2 stays the rigorous SOTA/.test(IMP33827_COHORT_HONESTY_GATE_AUDIT.honest)
      && /NO QED/.test(IMP33827_COHORT_HONESTY_GATE_AUDIT.verdict)
      && /Lambda <= 0.2 remains the rigorous SOTA/.test(IMP33827_COHORT_HONESTY_GATE_AUDIT.verdict),
  },
];

for (const a of IMP33827_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33827-cohort-honesty-gate-audit assertion failed: ${a.id}`);
  }
}

export default IMP33827_COHORT_HONESTY_GATE_AUDIT;
