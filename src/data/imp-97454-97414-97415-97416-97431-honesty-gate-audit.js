// src/data/imp-97454-97414-97415-97416-97431-honesty-gate-audit.js
//
// imp-97454: Audit the honesty-gate assertion coverage across the
// imp-97414/imp-97415/imp-97416/imp-97431 Krein c_sharp cohort: confirm each
// module carries an executable isRigorous:false / NO-QED tripwire, mirroring
// the imp-33808/33809/33810 (imp-33841) and imp-33827 cohort audits.
//
// QUESTION: does each of the four modules back its prose honest-status
// caveat with an EXECUTABLE build-time assertion that THROWS if the honest
// framing is weakened or removed, and do the committed floor/bracket
// literals match their source measurements, or does it rely on
// prose/comments alone?
//
// GREP + READ RESULT (2026-09-26): all four modules pass -- each has a
// dedicated *_ASSERTIONS array entry (walked by a `for` loop that throws on
// any failed `.holds()`) that checks a NO-QED tripwire clause. None of the
// four uses the literal `isRigorous:false` field name from the ticket
// title; instead all four use the SAME convention -- a
// `operatorPositivityProved: false` + `boundMoves: false` + `qed: false`
// triple (plus an `intervalRigorousReachUnchanged: 0.96` / binding_2a===LN3
// pin) -- so, unlike the imp-33827 cohort (2/4 vs 2/4 split), this cohort is
// internally CONSISTENT. Two of the four (imp-97416, imp-97431) go further
// and independently recompute their key literal from a cheap closed-form
// grid pass inside the assertion body (bathtub top-area, negative-area
// integral) rather than only checking stored-literal cross-consistency;
// the other two (imp-97414, imp-97415) check stored literals against each
// other (e.g. ritz brackets vs imp-97400, reachable rho vs the imp-97335
// symbol infimum) but do not independently recompute a source integral.
// That is a coverage-depth nuance, not a missing tripwire: all four still
// throw at import if the honest framing is weakened. Read-only audit; no
// module edited.

const COHORT_HONESTY_GATES = Object.freeze([
  Object.freeze({
    ticket: 'imp-97414',
    path: '/src/data/imp-97414-krein-full-projector-second-moment-execution.js',
    hasExecutableTripwire: true,
    tripwireMechanism: '*_ASSERTIONS array entry (imp97414-execution-only-no-qed)',
    honestyFields: ['rigorousLowerBoundProduced', 'operatorPositivityProved', 'boundMoves', 'qed'],
    independentLiteralRecompute: false,
  }),
  Object.freeze({
    ticket: 'imp-97415',
    path: '/src/data/imp-97415-krein-lambda2-certified-lower-bound-assessment.js',
    hasExecutableTripwire: true,
    tripwireMechanism: '*_ASSERTIONS array entry (imp97415-assessment-only-no-qed)',
    honestyFields: ['rigorousLowerBoundProduced', 'operatorPositivityProved', 'boundMoves', 'qed'],
    independentLiteralRecompute: false,
  }),
  Object.freeze({
    ticket: 'imp-97416',
    path: '/src/data/imp-97416-krein-csharp-bathtub-joint-floor.js',
    hasExecutableTripwire: true,
    tripwireMechanism: '*_ASSERTIONS array entry (imp97416-attempt-only-no-qed)',
    honestyFields: ['concentrationLowerBoundPositiveProved', 'operatorPositivityProved', 'boundMoves', 'qed'],
    independentLiteralRecompute: true,
  }),
  Object.freeze({
    ticket: 'imp-97431',
    path: '/src/data/imp-97431-krein-rk-floor-band-dependence.js',
    hasExecutableTripwire: true,
    tripwireMechanism: '*_ASSERTIONS array entry (imp97431-measurement-only-no-qed)',
    honestyFields: ['rkhsBudgetCertifiesPositivityForSomeBand', 'operatorPositivityProved', 'boundMoves', 'qed'],
    independentLiteralRecompute: true,
  }),
]);

const COVERED_COUNT = COHORT_HONESTY_GATES.filter((m) => m.hasExecutableTripwire).length;
const RECOMPUTE_COUNT = COHORT_HONESTY_GATES.filter((m) => m.independentLiteralRecompute).length;
const UNCOVERED_TICKETS = COHORT_HONESTY_GATES.filter((m) => !m.hasExecutableTripwire).map((m) => m.ticket);

export const IMP97454_COHORT_HONESTY_GATE_AUDIT = Object.freeze({
  id: 'imp-97454-97414-97415-97416-97431-honesty-gate-audit',
  ticket: 'imp-97454',
  cohort: COHORT_HONESTY_GATES,
  coveredCount: COVERED_COUNT,
  recomputeCount: RECOMPUTE_COUNT,
  uncoveredTickets: UNCOVERED_TICKETS,

  summary:
    'All four imp-97414/imp-97415/imp-97416/imp-97431 Krein c_sharp cohort modules carry an ' +
    'executable honesty-gate tripwire -- a dedicated *_ASSERTIONS array entry, walked by a `for` ' +
    'loop that throws at import on any failed `.holds()` -- gating a `operatorPositivityProved: ' +
    'false` + `boundMoves: false` + `qed: false` triple plus a pinned interval-rigorous reach ' +
    '(2a<=0.96) and binding_2a===ln3 check. None relies on prose/comments alone.',

  verdict:
    'COHORT-FULLY-COVERED, CONVENTION-CONSISTENT: 4 of 4 modules have an executable NO-QED ' +
    'tripwire (0 prose-only gaps); all four use the same operatorPositivityProved/boundMoves/qed ' +
    'triple rather than the literal isRigorous:false field named in the ticket title, so the ' +
    'cohort is internally consistent (unlike the imp-33827 cohort, which split 2/4 vs 2/4 on ' +
    'field naming). 2 of 4 (imp-97416, imp-97431) additionally recompute their key literal from a ' +
    'cheap closed-form grid pass inside the assertion body; the other 2 (imp-97414, imp-97415) ' +
    'check stored-literal cross-consistency only, without an independent source recompute -- a ' +
    'coverage-depth nuance, not a missing tripwire. No bound changed; NO QED; no refereed bound is changed' +
    '.',

  honest:
    'AUDIT-ONLY -- reports the honesty-gate tripwire coverage found by reading each of the four ' +
    'modules; does not modify any module and does not add the missing independent recompute to ' +
    'imp-97414/imp-97415 (left as a follow-up gap, not performed here). No refereed bound is changed' +
    '.',
});

export const IMP97454_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp-97454-cohort-has-four-modules',
    description: 'the audited cohort names exactly the four imp-97414/97415/97416/97431 modules',
    holds: () => COHORT_HONESTY_GATES.length === 4
      && ['imp-97414', 'imp-97415', 'imp-97416', 'imp-97431'].every(
        (t) => COHORT_HONESTY_GATES.some((m) => m.ticket === t),
      ),
  },
  {
    id: 'imp-97454-all-four-covered',
    description: 'all four modules have an executable honesty-gate tripwire; no uncovered tickets',
    holds: () => COVERED_COUNT === 4 && UNCOVERED_TICKETS.length === 0,
  },
  {
    id: 'imp-97454-exactly-two-recompute-independently',
    description: 'exactly imp-97416 and imp-97431 independently recompute a source literal in their assertion body',
    holds: () => RECOMPUTE_COUNT === 2
      && COHORT_HONESTY_GATES.find((m) => m.ticket === 'imp-97416').independentLiteralRecompute === true
      && COHORT_HONESTY_GATES.find((m) => m.ticket === 'imp-97431').independentLiteralRecompute === true
      && COHORT_HONESTY_GATES.find((m) => m.ticket === 'imp-97414').independentLiteralRecompute === false
      && COHORT_HONESTY_GATES.find((m) => m.ticket === 'imp-97415').independentLiteralRecompute === false,
  },
  {
    id: 'imp-97454-all-share-qed-boundmoves-fields',
    description: 'every module gates on both a qed field and a boundMoves field (the consistent convention)',
    holds: () => COHORT_HONESTY_GATES.every(
      (m) => m.honestyFields.includes('qed') && m.honestyFields.includes('boundMoves'),
    ),
  },
  {
    id: 'imp-97454-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(IMP97454_COHORT_HONESTY_GATE_AUDIT.honest)
      && /refereed bound is changed/i.test(IMP97454_COHORT_HONESTY_GATE_AUDIT.honest)
      && /NO QED/.test(IMP97454_COHORT_HONESTY_GATE_AUDIT.verdict)
      && /refereed bound is changed/i.test(IMP97454_COHORT_HONESTY_GATE_AUDIT.verdict),
  },
];

for (const a of IMP97454_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97454-97414-97415-97416-97431-honesty-gate-audit assertion failed: ${a.id}`);
  }
}

export default IMP97454_COHORT_HONESTY_GATE_AUDIT;
