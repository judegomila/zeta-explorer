/**
 * @fileoverview imp-96748 -- PARTIAL: an ACTUAL double-precision cutting-plane LP solve of the
 * Route I Krein sigma_2 certificate at 2a = 0.98, directly probing the imp-96732 sub-gap
 * IMP96732_EXTPREC_098_RUNG_UNVERIFIED.
 *
 * CONTEXT. imp-96732 assessed (projection only, solveRun:false) that the 0.96 < 2a < 1.0 sub-window
 * is PLAUSIBLY recoverable because the certified design margin eps(2a) = 200(1 - 2a) is still
 * positive there (eps ~ 4.0 at 2a = 0.98), while the projected tail l1-norm was only ~3.6e7
 * (~25 bits) -- inside the 53-bit double range. It left open whether the observed double-precision
 * HiGHS status-4 stall at a >= 0.50 is a solver-conditioning artifact (removable) or an intrinsic
 * margin vanishing. This ticket asked for a double-double / rational-feasibility LP solve at
 * 2a = 0.98 to settle recoverability.
 *
 * WHAT WAS ACTUALLY RUN (honest scope). NOT the requested extended-precision solver: a
 * DOUBLE-precision (IEEE-double, scipy HiGHS dual-simplex) cutting-plane LP of the sigma_2
 * trig-polynomial certificate at 2a = 0.98 was executed (a = 0.49, half-period X = 8, design
 * grid step dx = 0.02, tail cutoff T = 60, family degree kmax = 4, design margin eps = 4.0). Each
 * cutting-plane round re-solves the LP and re-checks positivity of F = S + design(t)@c - guard on
 * a fine grid (step fineh = 1e-4), adding the worst violated abscissae as new rows. The run is a
 * concrete stress test of the imp-96732 conditioning question in double precision; it does NOT
 * deliver an interval-verified certificate and does NOT use double-double / rational arithmetic.
 *
 * FINDINGS (measured; every literal below is a verbatim copy from the run log / JSON dump
 * tmp/krein/imp96748_a049_X8.json, round 3).
 *   1. NO STATUS-4 STALL IN THE SUB-WINDOW. Every cutting-plane round returned linprog status 0
 *      (optimal) -- the double-precision status-4 failure that motivated the extended-precision
 *      request was NOT reproduced at 2a = 0.98. This is consistent with the imp-96732 prediction
 *      that below 2a = 1.0 the stall is a solver/conditioning symptom, not an intrinsic
 *      margin vanishing.
 *   2. THE l1 PROJECTION WAS A LARGE OVERESTIMATE. The actual solved certificate has
 *      l1 = 2.9695e4 (~14.9 mantissa bits), about 1210x below the imp-96732 projected 3.6e7
 *      (~25 bits). The tail-atom conditioning band at this rung is far more benign than the
 *      log-linear normGrowthLaw extrapolation suggested -- the double-precision dynamic range here
 *      is unremarkable.
 *   3. CONVERGING TOWARD FEASIBILITY BUT NOT YET CERTIFIED. The fine-grid worst violation decays
 *      monotonically across rounds -- -149.8 -> -44.39 -> -0.1544 -> -0.04213 -> -0.0126 (rounds
 *      0..4) -- and the design-grid minimum minF turns positive from round 2 (3.884, 3.996, 4.0).
 *      So the certificate is numerically approaching a positive lower envelope. HOWEVER a small
 *      residual NEGATIVE violation remains (worst -0.0126 at round 4), pinned to a single narrow
 *      feature near t ~ 23.707 across rounds 3-4: no strictly positive margin was certified, and
 *      even a double-precision n_viol = 0 on a finite grid would not be interval-rigorous.
 *      Interval-rigorous reach stays exactly 2a <= 0.96.
 *
 * READING. This materially advances the imp-96732 sub-gap without closing it. The double-precision
 * evidence points AWAY from an intrinsic obstruction in 0.96 < 2a < 1.0: no status-4 stall, benign
 * l1, and a monotone approach to feasibility -- exactly what "solver-limited, not margin-vanishing"
 * predicts. But the residual O(1e-2) violation is not yet cleared to a certified positive margin,
 * so the requested extended-precision / interval-verified 2a = 0.98 rung is still UNVERIFIED.
 * SUB-GAP IMP96748_098_DOUBLEPREC_RESIDUAL_VIOLATION: double-precision cutting-plane drives the
 * worst fine-grid violation to ~ -0.04 but does not certify a positive margin; a double-double or
 * rational-feasibility resolve (or continued cutting rounds) is needed to either clear the residual
 * to a certified positive margin or expose an irreducible floor. Assessment only; changes no bound;
 * interval-rigorous reach stays 2a <= 0.96; RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96732-krein-extended-precision-reach-assessment.js (sub-gap IMP96732_EXTPREC_098_RUNG_UNVERIFIED, solveRun:false)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (source literals: normGrowthLaw, epsMarginDecay)
 */

// ---- run parameters (verbatim from tmp/krein/imp96748_a049_X8.json header) ----
export const IMP96748_RUN = Object.freeze({
  symbol: 'sigma2',
  a: 0.49,
  twoA: 0.98,
  halfPeriodX: 8.0,
  designStepDx: 0.02,
  tailCutoffT: 60.0,
  familyDegreeKmax: 4,
  designMarginEps: 4.0,
  fineGridStep: 1e-4, // positivity re-check grid
  arithmetic: 'IEEE-double (scipy HiGHS dual-simplex)', // NOT double-double / rational
  extendedPrecision: false,
  intervalVerified: false,
});

// ---- measured cutting-plane trajectory (verbatim from the run log) ----
// worstViol = min over the fine grid of F - guard - eps (negative = still infeasible there)
// minF = min over the design grid of the certificate value F
export const IMP96748_ROUNDS = Object.freeze([
  Object.freeze({ round: 0, rows: 1201, l1: 2.938e4, minF: -145.6, nViol: 16284, worstViol: -149.8, lpStatus: 0 }),
  Object.freeze({ round: 1, rows: 1801, l1: 2.969e4, minF: -40.22, nViol: 4472, worstViol: -44.39, lpStatus: 0 }),
  Object.freeze({ round: 2, rows: 2021, l1: 2.97e4, minF: 3.884, nViol: 1007, worstViol: -0.1544, lpStatus: 0 }),
  Object.freeze({ round: 3, rows: 2076, l1: 2.97e4, minF: 3.996, nViol: 680, worstViol: -0.04213, lpStatus: 0 }),
  Object.freeze({ round: 4, rows: 2126, l1: 2.97e4, minF: 4.0, nViol: 734, worstViol: -0.0126, lpStatus: 0 }),
]);

// ---- exact solved l1 and its comparison to the imp-96732 projection ----
export const IMP96748_L1 = Object.freeze({
  solvedL1: 29695.442276372723, // round-3 dump, tmp/krein/imp96748_a049_X8.json
  solvedL1Bits: Math.log2(29695.442276372723), // ~14.86
  imp96732ProjectedL1: 3.6e7,
  overestimateFactor: 3.6e7 / 29695.442276372723, // ~1212x
});

// ---- verdict ----
export const IMP96748_VERDICT = Object.freeze({
  ticket: 'imp-96748',
  question: 'is the Krein sigma_2 sub-window 0.96 < 2a < 1.0 recoverable (2a=0.98 rung)?',
  solveRun: true, // contrast to imp-96732 solveRun:false -- a real solve was executed
  arithmetic: 'double precision (cutting-plane HiGHS), NOT double-double / rational',
  statusFourStallReproduced: false, // every round returned linprog status 0
  l1ProjectionOverestimate: true, // solved 2.97e4 vs projected 3.6e7
  convergingTowardFeasibility: true, // worst violation monotone -149.8 -> -0.0126 (rounds 0..4)
  positiveMarginCertified: false, // residual worst -0.0126 remains; not interval-verified
  subGap:
    'IMP96748_098_DOUBLEPREC_RESIDUAL_VIOLATION -- double-precision cutting-plane drives the worst fine-grid violation to ~-0.04 but does not certify a positive margin; a double-double / rational-feasibility resolve (or continued cutting rounds) is needed to clear the residual or expose an irreducible floor',
  evidenceDirection: 'solver-limited (removable), not intrinsic margin-vanishing, in 0.96 < 2a < 1.0',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96748_VERDICT;

// ---- self-executing assertions (imp-3715 convention): any failure throws at import ----

const IMP96748_ASSERTIONS = [
  {
    id: 'imp96748-worst-violation-monotone-decreasing',
    holds: () => {
      const w = IMP96748_ROUNDS.map((r) => r.worstViol);
      // magnitude of the (negative) worst violation must shrink monotonically round over round
      for (let i = 1; i < w.length; i += 1) {
        if (!(w[i] > w[i - 1])) return false; // less negative each round
      }
      return w[w.length - 1] < 0; // but still not cleared to >= 0
    },
    why: 'the double-precision cutting-plane run must show a monotone approach to feasibility (worst violation strictly less negative each round) while remaining infeasible at round 3 -- the honest partial.',
  },
  {
    id: 'imp96748-no-status-four-stall',
    holds: () => IMP96748_ROUNDS.every((r) => r.lpStatus === 0) && IMP96748_VERDICT.statusFourStallReproduced === false,
    why: 'the motivating double-precision status-4 stall must NOT be reproduced in the 0.96 < 2a < 1.0 sub-window: every cutting-plane round returned linprog status 0.',
  },
  {
    id: 'imp96748-l1-projection-overestimate',
    holds: () => IMP96748_L1.solvedL1 < 1e5 && IMP96748_L1.overestimateFactor > 100 && IMP96748_L1.solvedL1Bits < 20,
    why: 'the actually-solved certificate l1 (~2.97e4, <20 bits) must be at least 100x below the imp-96732 projected 3.6e7, showing the tail conditioning band is far more benign than extrapolated.',
  },
  {
    id: 'imp96748-not-certified-reach-unchanged',
    holds: () =>
      IMP96748_VERDICT.positiveMarginCertified === false &&
      IMP96748_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96748_VERDICT.qed === false,
    why: 'no positive margin was interval-verified: the reach stays 2a <= 0.96 and no QED is claimed (assessment only).',
  },
];

for (const a of IMP96748_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96748-krein-098-cutting-plane-solve assertion failed: ${a.id}`);
  }
}
