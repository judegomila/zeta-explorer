/**
 * @module imp-35150-r2-ladder-assessment
 * @fileoverview imp-35150: execute the imp-35104 R2 sub-scale. Assess whether
 * the R2 "true-flow residual" obligation (the imp-2528 map-to-flow enclosure
 * gap) STAYS MET as the N ladder is extended from {50,100,200} toward 1e4,
 * or exposes a first violation. MEASUREMENT / CERTIFICATION ONLY: this module
 * consumes existing map-certified brackets and order-robust flow references,
 * reports the largest N at which the R2 one-sided true-flow bound is testable
 * AND holds, and names why the extension stalls. It establishes NO bound,
 * removes NO conditional (C_mb stays GUE-conditional per imp-486), and claims
 * NO QED.
 *
 * WHAT R2 IS (imp-35104 requirement R2-truncation-vs-roundoff)
 * -----------------------------------------------------------
 * R1/R3/R4 of the imp-35104 weaker-K interval-certification are MET on the
 * closable map-bracket set {50,100,200,500} (and bracket EXISTENCE extends to
 * {1000..100000} via imp-2550). R2 is the OPEN, load-bearing residual: the
 * one-ULP interval RK4 encloses ROUNDOFF of the fixed-dt discrete MAP, not the
 * map-to-flow TRUNCATION gap (the imp-2528 semantics downgrade). The
 * empirically-supported R2 predicate is the ONE-SIDED TRUE-FLOW BOUND
 *   R2(N) MET  <=>  t_c_flow(N) <= t_c_hi(N),
 * i.e. the certified upper bracket endpoint is a valid upper bound on the true
 * Dyson-flow collision time. This is what makes F_mb_upper an actual upper
 * bound on |F_mb| and hence K_paper_cert an actual C_mb upper bound.
 *
 * WHY R2 IS TESTABLE ONLY WHERE A FLOW REFERENCE EXISTS
 * -----------------------------------------------------
 * Testing t_c_flow <= t_c_hi needs an ORDER-ROBUST flow reference t_c_flow
 * (DP8, or RK4 that agrees with DP45). Those exist only where the O(N^2)-per-
 * step backward integrator has actually been run to collision at build-worthy
 * cost: N in {50,100,200} (DP8 at 50/100; imp-859 RK4==DP45 at 200). At
 * N >= 500 the map bracket EXISTS (imp-857 baseline: {1000,2000,5000,10000}
 * all close with maxIntervalWidth <= 1.28e-9) but NO order-robust flow
 * reference has been computed, so R2 cannot be tested there. Extending the MAP
 * bracket up the ladder (already done) does NOT extend R2 -- it extends R1.
 *
 * HEADLINE FINDING
 * ----------------
 * Across the tested rungs the R2 one-sided bound HOLDS at every N with a flow
 * reference: N=50, 100, 200 (largest MET = 200). NO violation is exposed up
 * the ladder. Crucially, the ladder is capped at N=200 by flow-reference
 * AVAILABILITY, not by any numerical violation: at N in {500,1000,2000,5000,
 * 10000} R2 is UNTESTED (map bracket only). So the honest answer to "does R2
 * stay MET toward 1e4?" is: it is neither confirmed nor violated past N=200 --
 * it is UNCERTIFIED, gated on an order-robust flow reference at N >= 500 (the
 * named residual imp-857-sub-scale-to-N10k / imp-2528-sub-certified-flow-
 * enclosure, wanting a DP8 / directed-rounding backend). The map-to-flow
 * truncation has a DEFINITE overshoot SIGN (backward RK4 collides LATER than
 * the flow -> t_c_flow <= t_c_map, imp-2528 mechanism), which is N-independent,
 * so the one-sided direction is EXPECTED to persist -- but expectation is not
 * certification.
 *
 * SYNTAX NOTE: avoid star-slash sequences in JSDoc; use "dt^4" etc.
 *
 * @see imp-35104  C_MB_WEAKER_K_INTERVAL_SCOPE (requirement R2)
 * @see imp-857    C_MB_INTERVAL_CERTIFIED (map-bracket certificate + sub-gap)
 * @see imp-2528   mapVsFlowSemantics one-sided-flow-bound reclassification
 * @see imp-2510   RK4 low-order overshoot direction dp8_tc <= rk4_tc
 */

import { IMP_857_BASELINE_SWEEP_RESULT } from './imp-857-baseline-sweep-result.js';

// ── R2 rungs WITH an order-robust flow reference (R2 testable). ───────────────
// Flow references and map t_c_hi are baked literals from the imp-2528 / imp-859
// reconciliation (src/data/c-mb-empirical-dyson-sweep.js RECONCILIATION_ROWS and
// MVF_QUANT). t_c_flow is the best-order Float64 collision time (DP8 at 50/100;
// RK4==DP45 at 200). t_c_hi is the one-ULP interval-map upper bracket endpoint.
const R2_FLOW_REFERENCE_RUNGS = [
  {
    N: 50,
    t_c_flow: 0.096,
    integrator: 'dp8-order-8',
    t_c_hi: 0.096, // like-for-like: Float64 gate sits AT the bracket upper end
    note: 'reconciled-contained (imp-2528); slack ~1 is structural (gate == t_c_hi)',
  },
  {
    N: 100,
    t_c_flow: 0.0705,
    integrator: 'dp8-order-8',
    t_c_lo: 0.075,
    t_c_hi: 0.076, // interval RK4 dt=1e-3 bracket [0.075, 0.076]
    note: 'flowBelowMapBracket (0.0705 < t_c_lo 0.075) yet oneSidedFlowBoundHolds (0.0705 <= 0.076)',
  },
  {
    N: 200,
    t_c_flow: 0.033,
    integrator: 'rk4-order-4-dp45-agreed',
    t_c_hi: 0.033, // like-for-like: gate at bracket upper end
    note: 'reconciled-contained (imp-2528); slack ~1 is structural (gate == t_c_hi)',
  },
].map((r) => ({
  ...r,
  r2Predicate: 't_c_flow <= t_c_hi',
  r2Met: r.t_c_flow <= r.t_c_hi,
  status: 'flow-reference-present',
}));

// ── R2 rungs with MAP bracket only (R2 UNTESTED -- the residual). ─────────────
// The imp-857 baseline closes these brackets, but no order-robust flow
// reference has been computed, so t_c_flow <= t_c_hi cannot be evaluated.
const R2_MAP_ONLY_RUNGS = [
  // N=500 lives in the imp-857 closable map-bracket set {50,100,200,500} but has
  // no flow reference either; recorded explicitly for ladder continuity.
  { N: 500, t_c_hi: null, source: 'imp-857 closable set (C_MB_INTERVAL_CERTIFIED)' },
  ...IMP_857_BASELINE_SWEEP_RESULT.rows.map((row) => ({
    N: row.N,
    t_c_hi: row.t_c_hi,
    source: 'imp-857 baseline sweep (map bracket, maxIntervalWidth <= 1.28e-9)',
  })),
].map((r) => ({
  ...r,
  t_c_flow: null,
  r2Predicate: 't_c_flow <= t_c_hi',
  r2Met: null, // UNTESTABLE: no order-robust flow reference at this N
  status: 'map-bracket-only-no-flow-reference',
}));

// ── Ladder verdict. ──────────────────────────────────────────────────────────
const TESTED_RUNGS = R2_FLOW_REFERENCE_RUNGS;
const ALL_MET = TESTED_RUNGS.every((r) => r.r2Met === true);
const FIRST_VIOLATION = TESTED_RUNGS.find((r) => r.r2Met === false) ?? null;
const LARGEST_N_R2_MET = ALL_MET
  ? Math.max(...TESTED_RUNGS.map((r) => r.N))
  : (TESTED_RUNGS.filter((r) => r.r2Met === true).reduce((m, r) => Math.max(m, r.N), -Infinity));
const LADDER_TOP_MAP_ONLY = Math.max(...R2_MAP_ONLY_RUNGS.map((r) => r.N));

export const IMP_35150_R2_LADDER_ASSESSMENT = {
  id: 'imp-35150',
  title:
    'R2 sub-scale execution: assess whether the imp-35104 R2 true-flow residual ' +
    'stays MET as the N ladder extends toward 1e4, or exposes a first violation',
  kind: 'measurement-certification-only',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,

  r2Predicate: 't_c_flow(N) <= t_c_hi(N)  (imp-2528 one-sided true-flow bound)',

  flowReferenceRungs: R2_FLOW_REFERENCE_RUNGS,
  mapOnlyRungs: R2_MAP_ONLY_RUNGS,

  verdict: {
    largestN_R2_tested_and_met: Number.isFinite(LARGEST_N_R2_MET) ? LARGEST_N_R2_MET : null,
    allTestedRungsMet: ALL_MET,
    firstViolationN: FIRST_VIOLATION ? FIRST_VIOLATION.N : null,
    ladderTopWithMapBracketOnly: LADDER_TOP_MAP_ONLY,
    extensionStalledBy: 'flow-reference-availability',
    residualId: 'imp-857-sub-scale-to-N10k / imp-2528-sub-certified-flow-enclosure',
    interpretation:
      'The R2 one-sided true-flow bound t_c_flow <= t_c_hi HOLDS at every rung ' +
      'that has an order-robust flow reference (N in {50,100,200}; largest MET ' +
      '= 200). NO violation is exposed. The ladder is capped at N=200 by ' +
      'flow-reference AVAILABILITY, not by a numerical violation: at N in ' +
      '{500,1000,2000,5000,10000} the MAP bracket exists (imp-857 baseline) but ' +
      'no order-robust flow reference has been computed, so R2 is UNTESTED ' +
      '(neither confirmed nor violated). Extending the MAP bracket up the ' +
      'ladder extends R1, NOT R2. R2 therefore stays OPEN toward 1e4, gated on ' +
      'a DP8 / directed-rounding flow reference at N >= 500.',
    mechanisticExpectation:
      'The map-to-flow truncation has a DEFINITE overshoot SIGN -- backward RK4 ' +
      'underestimates the sharpening attraction and collides LATER than the ' +
      'flow, so t_c_flow <= t_c_map (imp-2528 mechanism). That sign is ' +
      'N-independent, so the one-sided direction is EXPECTED to persist up the ' +
      'ladder; but a sign expectation is NOT an interval certificate, which is ' +
      'exactly why R2 remains OPEN rather than MET at N >= 500.',
    doesNotAchieve:
      'Does NOT certify R2 at N >= 500; does NOT extend the C_mb certificate ' +
      'past the flow-reference set; does NOT remove the imp-486 GUE conditional; ' +
      'changes NO Lambda bound. No refereed bound is changed.',
  },
};

// ── Build-time assertions. ───────────────────────────────────────────────────
export const IMP_35150_R2_LADDER_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp35150-tested-rungs-all-met',
    holds: () =>
      IMP_35150_R2_LADDER_ASSESSMENT.flowReferenceRungs.length === 3 &&
      IMP_35150_R2_LADDER_ASSESSMENT.flowReferenceRungs.every((r) => r.r2Met === true),
    why:
      'Every rung with an order-robust flow reference (N in {50,100,200}) must ' +
      'satisfy the R2 one-sided bound t_c_flow <= t_c_hi. A false here would ' +
      'mean the reconciled imp-2528 overshoot direction regressed.',
  },
  {
    id: 'imp35150-largest-met-is-200',
    holds: () => IMP_35150_R2_LADDER_ASSESSMENT.verdict.largestN_R2_tested_and_met === 200,
    why:
      'The largest N at which R2 is testable AND met is 200 (the largest N with ' +
      'an order-robust flow reference). This is the honest ceiling of the R2 ' +
      'ladder; it is set by flow-reference availability, not by a violation.',
  },
  {
    id: 'imp35150-no-violation-exposed',
    holds: () => IMP_35150_R2_LADDER_ASSESSMENT.verdict.firstViolationN === null,
    why:
      'No R2 violation is exposed on any tested rung. If this trips, a flow ' +
      'reference now contradicts its map bracket and the certificate needs review.',
  },
  {
    id: 'imp35150-map-only-rungs-untested',
    holds: () =>
      IMP_35150_R2_LADDER_ASSESSMENT.mapOnlyRungs.length >= 4 &&
      IMP_35150_R2_LADDER_ASSESSMENT.mapOnlyRungs.every((r) => r.r2Met === null) &&
      IMP_35150_R2_LADDER_ASSESSMENT.verdict.ladderTopWithMapBracketOnly === 10000,
    why:
      'HONEST-SCOPE TRIPWIRE: the N >= 500 rungs must be recorded as UNTESTED ' +
      '(r2Met === null), never as MET. Flipping any to met without an order-' +
      'robust flow reference would falsely close the R2 residual ' +
      '(imp-857-sub-scale-to-N10k).',
  },
  {
    id: 'imp35150-no-qed-no-bound-change',
    holds: () =>
      IMP_35150_R2_LADDER_ASSESSMENT.noQED === true &&
      IMP_35150_R2_LADDER_ASSESSMENT.changesNoBound === true,
    why:
      'This ticket is measurement/certification only: it must never assert a ' +
      'QED or a bound change. C_mb stays GUE-conditional (imp-486); ' +
      'no refereed bound is changed.',
  },
];
