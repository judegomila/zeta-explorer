// src/data/imp-97529-97495-97497-97498-97499-97502-honesty-gate-audit.js
//
// imp-97529: Extend the honesty-gate assertion-coverage audit to the newer
// Krein/Route-M leaves imp-97495/imp-97497/imp-97498/imp-97499/imp-97502,
// mirroring the imp-97454 cohort audit (imp-97414/97415/97416/97431) and the
// earlier imp-33808/33809/33810 / imp-33827 cohort audits.
//
// QUESTION: does each of the five modules back its prose honest-status
// caveat with an EXECUTABLE build-time assertion that THROWS if the honest
// framing is weakened or removed, and does the assertion body independently
// RECOMPUTE a key literal from a formula/function (deeper coverage) or only
// cross-check stored literals against each other (read-only coverage)?
//
// GREP + READ RESULT (2026-09-26): all five modules pass -- each has a
// dedicated *_ASSERTIONS array entry (walked by a `for` loop that throws on
// any failed `.holds()`) that checks a NO-QED tripwire clause. Four of the
// five (imp-97495, imp-97497, imp-97498, imp-97502) use the SAME
// `operatorPositivityProved: false` + `boundMoves: false` + `qed: false`
// triple as the imp-97454 cohort. The fifth, imp-97499 (a Route-M / MCM
// base-term leaf, not a Krein operator-positivity leaf), uses a DIFFERENT
// but equally honest convention -- `mcmProved: false` + `anyBoundMoved:
// false` + `qed: false` -- because its topic has no operator-positivity
// claim to gate; this is a legitimate naming divergence, not a gap.
// Three of the five (imp-97497, imp-97499, imp-97502) go further and
// independently RECOMPUTE a key literal inside the assertion body: imp-97497
// calls its own locally-defined `totExact`/`tailTot` quadrature functions to
// re-derive the tail-converged optimum from scratch; imp-97499 recomputes
// the threshold-crossing ln(x) from the closed-form drift law M0/(thr-K0)
// and checks the baked crossing against it; imp-97502 imports and calls the
// REAL `sigma2` analytic function (not a baked literal) to verify the
// well-geometry claims. The other two (imp-97495, imp-97498) only check
// stored-literal cross-consistency (monotonicity of a baked trace/bracket
// table, or verbatim-import equality against another module's table)
// without an independent from-scratch recompute -- a coverage-depth nuance,
// not a missing tripwire: all five still throw at import if the honest
// framing is weakened. Read-only audit; no module edited.

const COHORT_HONESTY_GATES = Object.freeze([
  Object.freeze({
    ticket: 'imp-97495',
    path: '/src/data/imp-97495-krein-route2-kbig300-380-direct-floor.js',
    hasExecutableTripwire: true,
    tripwireMechanism: '*_ASSERTIONS array entry (imp97495-measurement-only-no-qed)',
    honestyFields: ['rigorousLowerBoundProduced', 'operatorPositivityProved', 'boundMoves', 'qed'],
    independentLiteralRecompute: false,
  }),
  Object.freeze({
    ticket: 'imp-97497',
    path: '/src/data/imp-97497-krein-welloptimum-tail-converged.js',
    hasExecutableTripwire: true,
    tripwireMechanism: '*_ASSERTIONS array entry (imp97497-optimum-corrects-informal-and-stays-order-above-csharp)',
    honestyFields: ['measurementOnly', 'operatorPositivityProved', 'coercivityConstantProved', 'boundMoves', 'qed'],
    independentLiteralRecompute: true,
  }),
  Object.freeze({
    ticket: 'imp-97498',
    path: '/src/data/imp-97498-krein-csharp-fixedT-common-column.js',
    hasExecutableTripwire: true,
    tripwireMechanism: '*_ASSERTIONS array entry (imp97498-measurement-only-no-qed)',
    honestyFields: ['positiveLowerBoundProduced', 'isUpperBracketOnLambda1', 'intervalCertified', 'operatorPositivityProved', 'boundMoves', 'qed'],
    independentLiteralRecompute: false,
  }),
  Object.freeze({
    ticket: 'imp-97499',
    path: '/src/data/imp-97499-route-m-mcm-baseterm-scaled-approach-K0.js',
    hasExecutableTripwire: true,
    tripwireMechanism: '*_ASSERTIONS array entry (imp97499-coefficients-and-honesty)',
    honestyFields: ['mcmProved', 'anyBoundMoved', 'qed'],
    independentLiteralRecompute: true,
  }),
  Object.freeze({
    ticket: 'imp-97502',
    path: '/src/data/imp-97502-krein-named-concentration-inequality-assessment.js',
    hasExecutableTripwire: true,
    tripwireMechanism: '*_ASSERTIONS array entry (imp97502-no-named-tool-supplies-c-assessment-only-no-qed)',
    honestyFields: ['positiveLowerBoundProduced', 'operatorPositivityProved', 'boundMoves', 'qed'],
    independentLiteralRecompute: true,
  }),
]);

const COVERED_COUNT = COHORT_HONESTY_GATES.filter((m) => m.hasExecutableTripwire).length;
const RECOMPUTE_COUNT = COHORT_HONESTY_GATES.filter((m) => m.independentLiteralRecompute).length;
const UNCOVERED_TICKETS = COHORT_HONESTY_GATES.filter((m) => !m.hasExecutableTripwire).map((m) => m.ticket);
const NO_OPERATOR_POSITIVITY_FIELD_TICKETS = COHORT_HONESTY_GATES
  .filter((m) => !m.honestyFields.includes('operatorPositivityProved'))
  .map((m) => m.ticket);

export const IMP97529_COHORT_HONESTY_GATE_AUDIT = Object.freeze({
  id: 'imp-97529-97495-97497-97498-97499-97502-honesty-gate-audit',
  ticket: 'imp-97529',
  cohort: COHORT_HONESTY_GATES,
  coveredCount: COVERED_COUNT,
  recomputeCount: RECOMPUTE_COUNT,
  uncoveredTickets: UNCOVERED_TICKETS,
  noOperatorPositivityFieldTickets: NO_OPERATOR_POSITIVITY_FIELD_TICKETS,

  summary:
    'All five imp-97495/imp-97497/imp-97498/imp-97499/imp-97502 leaves carry an executable ' +
    'honesty-gate tripwire -- a dedicated *_ASSERTIONS array entry, walked by a `for` loop that ' +
    'throws at import on any failed `.holds()`. Four gate on the imp-97454-cohort convention ' +
    '`operatorPositivityProved: false` + `boundMoves: false` + `qed: false`; imp-97499 (a Route-M ' +
    'topic with no operator-positivity claim) gates instead on `mcmProved: false` + ' +
    '`anyBoundMoved: false` + `qed: false`. None relies on prose/comments alone.',

  verdict:
    'COHORT-FULLY-COVERED, ONE LEGITIMATE NAMING DIVERGENCE: 5 of 5 modules have an executable ' +
    'NO-QED tripwire (0 prose-only gaps). imp-97499 uses a different honesty-field convention than ' +
    'the other four because its topic (Route-M MCM base term) has no operator-positivity claim to ' +
    'gate -- a legitimate divergence, not a gap (unlike the imp-33827 cohort, which split 2/4 vs ' +
    '2/4 on the SAME topic). 3 of 5 (imp-97497, imp-97499, imp-97502) additionally recompute a key ' +
    'literal independently inside the assertion body -- imp-97497 via its own quadrature functions, ' +
    'imp-97499 via the closed-form drift law, imp-97502 via the real sigma2 function -- while the ' +
    'other 2 (imp-97495, imp-97498) check stored-literal cross-consistency only, without an ' +
    'independent from-scratch recompute. That is a coverage-depth nuance, not a missing tripwire. ' +
    'No bound changed; NO QED; no refereed bound is changed.',

  honest:
    'AUDIT-ONLY -- reports the honesty-gate tripwire coverage found by reading each of the five ' +
    'modules; does not modify any module and does not add the missing independent recompute to ' +
    'imp-97495/imp-97498 (left as a follow-up gap, not performed here). No refereed bound is changed' +
    '.',
});

export const IMP97529_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp-97529-cohort-has-five-modules',
    description: 'the audited cohort names exactly the five imp-97495/97497/97498/97499/97502 modules',
    holds: () => COHORT_HONESTY_GATES.length === 5
      && ['imp-97495', 'imp-97497', 'imp-97498', 'imp-97499', 'imp-97502'].every(
        (t) => COHORT_HONESTY_GATES.some((m) => m.ticket === t),
      ),
  },
  {
    id: 'imp-97529-all-five-covered',
    description: 'all five modules have an executable honesty-gate tripwire; no uncovered tickets',
    holds: () => COVERED_COUNT === 5 && UNCOVERED_TICKETS.length === 0,
  },
  {
    id: 'imp-97529-exactly-three-recompute-independently',
    description: 'exactly imp-97497, imp-97499, imp-97502 independently recompute a source literal in their assertion body',
    holds: () => RECOMPUTE_COUNT === 3
      && ['imp-97497', 'imp-97499', 'imp-97502'].every(
        (t) => COHORT_HONESTY_GATES.find((m) => m.ticket === t).independentLiteralRecompute === true,
      )
      && ['imp-97495', 'imp-97498'].every(
        (t) => COHORT_HONESTY_GATES.find((m) => m.ticket === t).independentLiteralRecompute === false,
      ),
  },
  {
    id: 'imp-97529-only-imp97499-lacks-operator-positivity-field',
    description: 'imp-97499 is the sole module without an operatorPositivityProved honesty field (Route-M topic, not Krein operator positivity)',
    holds: () => NO_OPERATOR_POSITIVITY_FIELD_TICKETS.length === 1
      && NO_OPERATOR_POSITIVITY_FIELD_TICKETS[0] === 'imp-97499',
  },
  {
    id: 'imp-97529-all-share-qed-field',
    description: 'every module gates on a qed field regardless of naming convention',
    holds: () => COHORT_HONESTY_GATES.every((m) => m.honestyFields.includes('qed')),
  },
  {
    id: 'imp-97529-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(IMP97529_COHORT_HONESTY_GATE_AUDIT.honest)
      && /refereed bound is changed/i.test(IMP97529_COHORT_HONESTY_GATE_AUDIT.honest)
      && /NO QED/.test(IMP97529_COHORT_HONESTY_GATE_AUDIT.verdict)
      && /refereed bound is changed/i.test(IMP97529_COHORT_HONESTY_GATE_AUDIT.verdict),
  },
];

for (const a of IMP97529_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97529-97495-97497-97498-97499-97502-honesty-gate-audit assertion failed: ${a.id}`);
  }
}

export default IMP97529_COHORT_HONESTY_GATE_AUDIT;
