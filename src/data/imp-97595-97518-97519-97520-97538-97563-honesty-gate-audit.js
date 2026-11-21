// src/data/imp-97595-97518-97519-97520-97538-97563-honesty-gate-audit.js
//
// imp-97595: Extend the honesty-gate assertion-coverage audit to the newer
// wave imp-97518/imp-97519/imp-97520/imp-97538/imp-97563, complementing the
// imp-97529 audit that covers imp-97495/97497/97498/97499/97502.
//
// QUESTION: does each of the five modules back its prose honest-status
// caveat with an EXECUTABLE build-time assertion that THROWS if the honest
// framing is weakened or removed, and does the assertion body independently
// RECOMPUTE a key literal from a formula/function (deeper coverage) or only
// cross-check stored literals against each other (read-only coverage)?
//
// GREP + READ RESULT (2026-09-26): all five modules pass -- each has a
// dedicated *_ASSERTIONS array (walked by a `for` loop that throws on any
// failed `.holds()`). Four of the five (imp-97518, imp-97519, imp-97520,
// imp-97563) independently RECOMPUTE a key quantity from scratch inside the
// assertion body rather than only cross-checking baked literals: imp-97518
// verifies its closed-form edge derivatives against a central finite
// difference of the taper AND against the exact one-sided cosine transform;
// imp-97519 recomputes the crossing ln(x), the residual, and every drift-
// ladder row from the closed-form law M0/(scaled-K0); imp-97520 goes
// furthest -- it computes the whole four-landmark ladder LIVE from the
// inherited sigma(N) model (ternary-search peak, bisection crossings) rather
// than importing baked numbers, so its assertions check live output against
// roadmap prose, not stored literal against stored literal; imp-97563 calls
// its own from-scratch Vasyunin cotangent sum V(a,q) to verify both the
// scale-invariance (FINDING 1) and the quantum-modular spike (FINDING 2).
// Only imp-97538 (an externally-run mpmath/Python sweep) checks
// stored-literal cross-consistency only (monotonicity of the bound and
// trace sequences, bracket ordering) without an independent from-scratch
// recompute -- expected, since its numbers come from an offline heavy build
// this module cannot re-run at import time.
//
// A genuine coverage-depth divergence (not seen in the imp-97529 cohort):
// imp-97520 carries almost NO structured honesty boolean fields (only
// `isRigorous`; no `operatorPositivityProved`, no `boundMoves`, no `qed`
// property) -- its tripwire gates the NO-QED claim entirely on a regex test
// of its prose `note` string for "NO QED" and "no refereed bound is changed". This still
// throws at import if the honest framing is removed (so it is a real
// tripwire, not a gap), but it is a lighter convention than every other
// module audited here and in imp-97529. imp-97563 sits between the two: it
// exposes twelve structured booleans (`anyBoundMoved`,
// `operatorPositivityEstablished`, `computeBindsFirst`, etc.) but, like
// imp-97520, has no boolean literally named `qed` -- its own assertions gate
// the NO-QED claim via a regex test of its `IMP97563_HONEST_BANNER` string,
// not a `qed: false` field. imp-97519 uses a legitimate topic-appropriate
// field-name variant (`mcmProved`/`anyBoundMoved`, no
// `operatorPositivityProved`, because the Route-M MCM topic has no
// operator-positivity claim) -- a naming divergence, not a gap, matching the
// imp-97529 imp-97499 precedent. Read-only audit; no module edited.

const COHORT_HONESTY_GATES = Object.freeze([
  Object.freeze({
    ticket: 'imp-97518',
    path: '/src/data/imp-97518-krein-tail-endpoint-asymptotic-closed-form.js',
    hasExecutableTripwire: true,
    tripwireMechanism: '*_ASSERTIONS array (imp97518-program-state-unchanged-no-qed)',
    honestyFields: ['derivationOnly', 'measurementStaysMeasurement', 'operatorPositivityProved', 'coercivityConstantProved', 'boundMoves', 'qed'],
    independentLiteralRecompute: true,
  }),
  Object.freeze({
    ticket: 'imp-97519',
    path: '/src/data/imp-97519-route-m-mcm-baseterm-043-crossing-spotcheck.js',
    hasExecutableTripwire: true,
    tripwireMechanism: '*_ASSERTIONS array (imp97519-coefficients-and-honesty)',
    honestyFields: ['mcmProved', 'anyBoundMoved', 'qed'],
    independentLiteralRecompute: true,
  }),
  Object.freeze({
    ticket: 'imp-97520',
    path: '/src/data/imp-97520-sigma-conditional-share-landmark-ladder.js',
    hasExecutableTripwire: true,
    tripwireMechanism: '*_ASSERTIONS array (imp97520-honesty-gate-no-qed, prose-regex only)',
    honestyFields: ['isRigorous'],
    independentLiteralRecompute: true,
  }),
  Object.freeze({
    ticket: 'imp-97538',
    path: '/src/data/imp-97538-krein-route2-kbig560-720-deep-floor.js',
    hasExecutableTripwire: true,
    tripwireMechanism: '*_ASSERTIONS array (imp97538-measurement-only-no-qed)',
    honestyFields: ['rigorousLowerBoundProduced', 'operatorPositivityProved', 'boundMoves', 'qed'],
    independentLiteralRecompute: false,
  }),
  Object.freeze({
    ticket: 'imp-97563',
    path: '/src/data/imp-97563-route-m-bettin-conrey-reciprocity-split-assessment.js',
    hasExecutableTripwire: true,
    tripwireMechanism: '*_ASSERTIONS array (imp97563-honesty-gate-no-qed)',
    honestyFields: ['anyBoundMoved', 'operatorPositivityEstablished', 'computeBindsFirst'],
    independentLiteralRecompute: true,
  }),
]);

const COVERED_COUNT = COHORT_HONESTY_GATES.filter((m) => m.hasExecutableTripwire).length;
const RECOMPUTE_COUNT = COHORT_HONESTY_GATES.filter((m) => m.independentLiteralRecompute).length;
const UNCOVERED_TICKETS = COHORT_HONESTY_GATES.filter((m) => !m.hasExecutableTripwire).map((m) => m.ticket);
const NO_OPERATOR_POSITIVITY_FIELD_TICKETS = COHORT_HONESTY_GATES
  .filter((m) => !m.honestyFields.some((f) => f.toLowerCase().includes('operatorpositivity')))
  .map((m) => m.ticket);
const NO_STRUCTURED_QED_FIELD_TICKETS = COHORT_HONESTY_GATES
  .filter((m) => !m.honestyFields.includes('qed'))
  .map((m) => m.ticket);

export const IMP97595_COHORT_HONESTY_GATE_AUDIT = Object.freeze({
  id: 'imp-97595-97518-97519-97520-97538-97563-honesty-gate-audit',
  ticket: 'imp-97595',
  cohort: COHORT_HONESTY_GATES,
  coveredCount: COVERED_COUNT,
  recomputeCount: RECOMPUTE_COUNT,
  uncoveredTickets: UNCOVERED_TICKETS,
  noOperatorPositivityFieldTickets: NO_OPERATOR_POSITIVITY_FIELD_TICKETS,
  noStructuredQedFieldTickets: NO_STRUCTURED_QED_FIELD_TICKETS,

  summary:
    'All five imp-97518/imp-97519/imp-97520/imp-97538/imp-97563 leaves carry an executable ' +
    'honesty-gate tripwire -- a dedicated *_ASSERTIONS array, walked by a `for` loop that throws at ' +
    'import on any failed `.holds()`. Four of five (all but imp-97538) independently recompute a key ' +
    'quantity from scratch inside the assertion body rather than only cross-checking stored literals. ' +
    'imp-97520 is the module with the fewest structured honesty boolean fields -- its tripwire is ' +
    'largely a regex test of its prose `note` string, a lighter convention than every other module in ' +
    'this cohort and the imp-97529 cohort, though it still throws at import if the honest framing is ' +
    'removed. imp-97563 similarly gates its NO-QED claim via a regex on its honest-banner string rather ' +
    'than a boolean `qed` field, despite otherwise exposing twelve structured honesty booleans.',

  verdict:
    'COHORT-FULLY-COVERED, ONE CONVENTION DIVERGENCE WORTH FLAGGING: 5 of 5 modules have an executable ' +
    'NO-QED tripwire (0 prose-only gaps in the sense of "no tripwire at all"). imp-97519 and imp-97563 ' +
    'use legitimate topic-appropriate honesty-field-name variants (mcmProved/anyBoundMoved for the ' +
    'Route-M MCM leaf, lacking operatorPositivityProved because that topic has no operator-positivity ' +
    'claim; operatorPositivityEstablished for the Route-M reciprocity leaf) -- naming divergences, not ' +
    'gaps, matching the imp-97529 imp-97499 precedent. imp-97520 is a GENUINE coverage-depth ' +
    'divergence: unlike every other audited module (here and in imp-97529), it exposes almost no ' +
    'structured honesty boolean fields, gating the NO-QED claim largely on a regex match against its ' +
    '`note` prose for "NO QED" and "no refereed bound is changed"; imp-97563 shares the qed-specific half of this gap ' +
    '(no boolean `qed` field, regex-only on its honest banner) despite otherwise being well-structured. ' +
    '4 of 5 (all but imp-97538, an externally ' +
    'run mpmath/Python sweep) independently recompute a key literal from scratch -- imp-97518 via finite ' +
    'differences and the exact cosine transform, imp-97519 via the closed-form drift law, imp-97520 via ' +
    'a LIVE ternary-search/bisection re-derivation of the whole landmark ladder from the inherited model, ' +
    'imp-97563 via its own from-scratch Vasyunin cotangent sum. No bound changed; NO QED; ' +
    'no refereed bound is changed.',

  honest:
    'AUDIT-ONLY -- reports the honesty-gate tripwire coverage found by reading each of the five ' +
    'modules; does not modify any module and does not add structured honesty boolean fields to ' +
    'imp-97520 (left as a follow-up gap, not performed here). No refereed bound is changed' +
    '.',
});

export const IMP97595_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp-97595-cohort-has-five-modules',
    description: 'the audited cohort names exactly the five imp-97518/97519/97520/97538/97563 modules',
    holds: () => COHORT_HONESTY_GATES.length === 5
      && ['imp-97518', 'imp-97519', 'imp-97520', 'imp-97538', 'imp-97563'].every(
        (t) => COHORT_HONESTY_GATES.some((m) => m.ticket === t),
      ),
  },
  {
    id: 'imp-97595-all-five-covered',
    description: 'all five modules have an executable honesty-gate tripwire; no uncovered tickets',
    holds: () => COVERED_COUNT === 5 && UNCOVERED_TICKETS.length === 0,
  },
  {
    id: 'imp-97595-exactly-four-recompute-independently',
    description: 'every module but imp-97538 independently recomputes a source quantity in its assertion body',
    holds: () => RECOMPUTE_COUNT === 4
      && ['imp-97518', 'imp-97519', 'imp-97520', 'imp-97563'].every(
        (t) => COHORT_HONESTY_GATES.find((m) => m.ticket === t).independentLiteralRecompute === true,
      )
      && COHORT_HONESTY_GATES.find((m) => m.ticket === 'imp-97538').independentLiteralRecompute === false,
  },
  {
    id: 'imp-97595-two-tickets-lack-operator-positivity-field',
    description: 'imp-97519 (legitimately -- Route-M MCM topic, no operator-positivity claim) and imp-97520 lack an operatorPositivityProved/Established honesty field',
    holds: () => NO_OPERATOR_POSITIVITY_FIELD_TICKETS.length === 2
      && ['imp-97519', 'imp-97520'].every((t) => NO_OPERATOR_POSITIVITY_FIELD_TICKETS.includes(t)),
  },
  {
    id: 'imp-97595-two-tickets-lack-structured-qed-field',
    description: 'imp-97520 and imp-97563 gate qed via a regex match on prose (note/banner) rather than a structured boolean field',
    holds: () => NO_STRUCTURED_QED_FIELD_TICKETS.length === 2
      && ['imp-97520', 'imp-97563'].every((t) => NO_STRUCTURED_QED_FIELD_TICKETS.includes(t)),
  },
  {
    id: 'imp-97595-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(IMP97595_COHORT_HONESTY_GATE_AUDIT.honest)
      && /refereed bound is changed/i.test(IMP97595_COHORT_HONESTY_GATE_AUDIT.honest)
      && /NO QED/.test(IMP97595_COHORT_HONESTY_GATE_AUDIT.verdict)
      && /refereed bound is changed/i.test(IMP97595_COHORT_HONESTY_GATE_AUDIT.verdict),
  },
];

for (const a of IMP97595_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97595-97518-97519-97520-97538-97563-honesty-gate-audit assertion failed: ${a.id}`);
  }
}

export default IMP97595_COHORT_HONESTY_GATE_AUDIT;
