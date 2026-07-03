/**
 * @module imp-3874-dpsi-sensitivity-verification
 * @fileoverview imp-3874 (numerical, VERIFICATION-ONLY): direct
 * finite-difference verification of the imp-3854 LEMMA-3854 sensitivity bound
 *     0 <= dPsi_N/dT <= (8/smin^2) Psi_N
 * along the frozen-horizon flow T = H^2/(8*thetaBar), on three representative
 * [1e4, 1e6] plateaus (0, 4, 9), swept across the feasible thetaBar window
 * [0.99, thetaBarStar]. imp-3854 DERIVED the bound in closed form but never
 * confronted it with a direct finite-difference of Psi along the flow; this
 * module CLOSES that gap and CONFIRMS the inequality on every sampled point.
 *
 * SETTING (imp-3725 gap-domination bootstrap, unchanged)
 * -----------------------------------------------------
 * With T = H^2/(8*thetaBar) and s_l(T) = sqrt(max(g_l(0)^2 - 8T, 0)):
 *   D_j(T)   = sum of s_l over the gap path from the record pair a to zero j,
 *   Psi_N(T) = 4 H^2 * sum_{j<=N, j not in {a,a+1}} 1/D_j(T)^2,
 *   smin(T)  = min over ACTIVE gaps l != a of s_l(T).
 * imp-3854 STEP-1 gives the EXACT derivative (H fixed, only D_j depends on T):
 *   d ln t_j/dT = (8/D_j) sum_{active l in path j} 1/s_l,  t_j = 4H^2/D_j^2,
 * hence dPsi_N/dT = 32 H^2 sum_j P_j/D_j^3 >= 0, with P_j = sum 1/s_l >= 0.
 * LEMMA-3854: s_l >= smin and D_j >= |path_j| smin give d ln t_j/dT <= 8/smin^2
 * uniformly, so 0 <= dPsi_N/dT <= (8/smin^2) Psi_N.
 *
 * WHAT WAS COMPUTED (scripts/imp-3874-dpsi-sensitivity-verify.mjs, node via
 * esbuild bundle over zeros-to-1e6.js, 2026-07-03)
 * ---------------------------------------------------------------------------
 * For plateaus 0 [1e4,18859], 4 [82553,87761], 9 [420892,1e6], at 5 thetaBar
 * points spanning [0.99, thetaBarStar], with one O(N) prefix-sum pass computing
 * Psi_N(T), smin(T), and the exact analytic dPsi_N/dT, plus a centered finite
 * difference (Psi(T+h)-Psi(T-h))/(2h), h = 1e-6 T:
 *
 *  (a) VALIDITY OF THE DIRECT SUM. The direct Psi_N(T) at thetaBar=0.99, N=endN
 *      reproduces the imp-3725 baked psiEnd to relative ~1e-6 on all three
 *      plateaus -- the finite-difference machinery sits on the certified Psi.
 *  (b) EXACT-DERIVATIVE CHECK (STEP-1). The centered finite difference matches
 *      the closed-form analytic dPsi_N/dT to relative <= 5.5e-5 at every point,
 *      confirming d ln t_j/dT = (8/D_j) sum 1/s_l.
 *  (c) MONOTONICITY. dPsi_N/dT >= 0 at every sampled (plateau, thetaBar):
 *      shrinking gaps (larger T) inflate Psi, the sign behind imp-3728.
 *  (d) THE LEMMA BOUND HOLDS. dPsi_N/dT <= (8/smin^2) Psi_N at every point.
 *  (e) THE CEILING IS LOOSE (consistent with imp-3870). The realised ratio
 *      dPsi/dT over the rigorous (8/smin^2) Psi ceiling is ~3e-5 to 4.5e-4
 *      (2000x-34000x slack). The actual log-sensitivity (dPsi/dT)/Psi is ~8-17,
 *      while the rigorous ceiling 8/smin^2 is ~1.8e4-5.9e5 -- exactly imp-3870s
 *      finding that the global-smin constant is a valid but vacuous over-bound
 *      (the sharp effective constant is the nearest-cumulative-distance one).
 *
 * HONEST SCOPE
 * ------------
 *  - VERIFICATION of an existing derived lemma by direct finite difference; the
 *    Psi/dPsi/smin scalars are baked from the offline scan (like imp-3725 rows),
 *    H/a and psiEnd cross-check LIVE against imp-3725. Three representative
 *    plateaus, not all ten -- see the named open sub-gap.
 *  - LEMMA-3854 CONFIRMED numerically on every sampled point; the (H/Dmin)^2
 *    sharp-constant story is imp-3854/imp-3870s and is NOT re-derived here.
 *  - No new Lambda bound; imp-3066 K_a >= 0 positivity UNTOUCHED; Platt-Trudgian
 *    Lambda <= 0.2 REMAINS SOTA; NO QED.
 *
 * OPEN SUB-GAP
 * ------------
 *  - imp-3874-sub-all-plateaus: the direct finite-difference verification was
 *    run on 3 of the 10 imp-3725 plateaus (0, 4, 9, spanning the [1e4,1e6]
 *    scale). The remaining 7 were NOT scanned here; the lemma is expected to
 *    hold identically (it is gap-value-independent) but is not machine-checked
 *    on them. Named open.
 *
 * @see imp-3854-thetabar-insensitivity-derivation.js (the lemma this verifies)
 * @see imp-3870-smin-dmin-slack-measurement.js (the ceiling-looseness picture)
 * @see imp-3725-fmb-plateau-domination-lemma.js (source of H, a, psiEnd)
 * @see scripts/imp-3874-dpsi-sensitivity-verify.mjs (generator)
 */

import { IMP_3725_FMB_PLATEAU_DOMINATION } from './imp-3725-fmb-plateau-domination-lemma.js';
import { IMP_3854_THETABAR_INSENSITIVITY_DERIVATION } from './imp-3854-thetabar-insensitivity-derivation.js';

const SRC25 = IMP_3725_FMB_PLATEAU_DOMINATION.rows;   // H, a, psiEnd

// Baked scalars from scripts/imp-3874-dpsi-sensitivity-verify.mjs (2026-07-03).
// DO NOT hand-edit; regenerate via the script. H, a, psiEnd cross-check live
// against imp-3725 so the verification stays single-source.
const MEASURED = Object.freeze([
  {
    plateauIndex: 0, startN: 10000, endN: 18859, thetaBarStar: 0.99822707,
    psiBase: 0.0141836315, psiBaseRelToBaked: 9.9824e-7, sminBase: 0.0208658,
    dpsiAnalyticBase: 0.114362388, dpsiFDBase: 0.114362195, boundBase: 260.619795,
    logSensBase: 8.06298359, rigorousCeilBase: 18374.6873, dpsiOverBoundBase: 4.38809295e-4,
    dpsiOverBoundTop: 4.5072284e-4, maxFdVsAnalyticRel: 4.6136e-6, maxDpsiOverBound: 4.5072284e-4,
    allNonneg: true, allUnderBound: true,
  },
  {
    plateauIndex: 4, startN: 82553, endN: 87761, thetaBarStar: 0.99883762,
    psiBase: 0.00929911377, psiBaseRelToBaked: 9.9981e-7, sminBase: 0.01511872,
    dpsiAnalyticBase: 0.135396438, dpsiFDBase: 0.135395836, boundBase: 325.462796,
    logSensBase: 14.5601443, rigorousCeilBase: 34999.3348, dpsiOverBoundBase: 4.16012029e-4,
    dpsiOverBoundTop: 4.23079164e-4, maxFdVsAnalyticRel: 5.0811e-6, maxDpsiOverBound: 4.23079164e-4,
    allNonneg: true, allUnderBound: true,
  },
  {
    plateauIndex: 9, startN: 420892, endN: 1000000, thetaBarStar: 0.9998958,
    psiBase: 0.000833561443, psiBaseRelToBaked: 1.0003e-6, sminBase: 0.00367196,
    dpsiAnalyticBase: 0.0145445532, dpsiFDBase: 0.0145450595, boundBase: 494.575375,
    logSensBase: 17.4486876, rigorousCeilBase: 593328.037, dpsiOverBoundBase: 2.9408163e-5,
    dpsiOverBoundTop: 3.01174404e-5, maxFdVsAnalyticRel: 5.4981e-5, maxDpsiOverBound: 3.01174404e-5,
    allNonneg: true, allUnderBound: true,
  },
]);

// Map plateauIndex -> imp-3725 baked psiEnd (live cross-check target).
const PSI_END_25 = Object.freeze(
  Object.fromEntries(SRC25.map((r) => [r.plateauIndex, r.psiEnd])),
);
const H_25 = Object.freeze(Object.fromEntries(SRC25.map((r) => [r.plateauIndex, r.H])));

const ROWS = MEASURED.map((m) => Object.freeze({ ...m }));

const MAX_FD_REL = Math.max(...ROWS.map((r) => r.maxFdVsAnalyticRel));
const MAX_DPSI_OVER_BOUND = Math.max(...ROWS.map((r) => r.maxDpsiOverBound));
const ALL_NONNEG = ROWS.every((r) => r.allNonneg);
const ALL_UNDER_BOUND = ROWS.every((r) => r.allUnderBound);

export const IMP_3874_DPSI_SENSITIVITY_VERIFICATION = Object.freeze({
  id: 'imp-3874',
  title:
    'Direct finite-difference verification of the imp-3854 LEMMA-3854 bound ' +
    '0 <= dPsi_N/dT <= (8/smin^2) Psi_N along the frozen horizon on plateaus ' +
    '0/4/9 across the feasible thetaBar window: CONFIRMED at every sampled point',
  status: 'verification-only',
  rhFree: true,
  semantics: 'numerical confirmation of an existing derived lemma; NO new bound, NO QED',

  lemmaVerified:
    '0 <= dPsi_N/dT <= (8/smin^2) Psi_N (imp-3854 LEMMA-3854). Verified by ' +
    'centered finite difference of the DIRECT Psi_N(T) against the exact ' +
    'analytic dPsi_N/dT = 32 H^2 sum_j P_j/D_j^3, on 3 representative [1e4,1e6] ' +
    'plateaus, at 5 thetaBar points each across [0.99, thetaBarStar].',

  sweepPoints: 5,
  feasibleWindow: '[0.99, thetaBarStar]',
  rows: ROWS,

  headline: {
    plateausVerified: [0, 4, 9],
    maxFdVsAnalyticRel: MAX_FD_REL,           // ~5.5e-5
    maxDpsiOverBound: MAX_DPSI_OVER_BOUND,     // ~4.5e-4 (ceiling loose by >2000x)
    allNonneg: ALL_NONNEG,
    allUnderBound: ALL_UNDER_BOUND,
    finding:
      'The imp-3854 LEMMA-3854 bound 0 <= dPsi_N/dT <= (8/smin^2) Psi_N is ' +
      'CONFIRMED at every one of the 15 sampled (plateau, thetaBar) points on ' +
      'plateaus 0/4/9. The direct Psi_N reproduces the imp-3725 baked psiEnd to ' +
      'relative ~1e-6, the centered finite difference matches the exact analytic ' +
      'dPsi_N/dT to relative <= 5.5e-5 (validating STEP-1), dPsi_N/dT >= 0 ' +
      'everywhere (monotone), and the realised dPsi/dT sits at 3e-5 to 4.5e-4 of ' +
      'the rigorous (8/smin^2) Psi ceiling -- a 2000x-34000x slack that matches ' +
      'imp-3870s finding that the global-smin constant is a valid-but-vacuous ' +
      'over-bound. Verification only; 7 of 10 plateaus left as a named open ' +
      'sub-gap; Platt-Trudgian Lambda <= 0.2 stays SOTA; imp-3066 untouched; NO QED.',
  },

  openSubGap: {
    id: 'imp-3874-sub-all-plateaus',
    status: 'open',
    blocker: false,
    statement:
      'The direct finite-difference verification covers 3 of the 10 imp-3725 ' +
      'plateaus (0, 4, 9, spanning the [1e4,1e6] scale). The lemma is ' +
      'gap-value-independent so it is expected to hold on the other 7, but they ' +
      'were not machine-checked here.',
  },

  provenance: {
    zeros: 'src/data/zeros-to-1e6.js (Odlyzko; zeros1 3e-9, imp-359/imp-514)',
    generator: 'scripts/imp-3874-dpsi-sensitivity-verify.mjs',
    generatedAt: '2026-07-03',
    note: 'Psi/dPsi/smin baked from the offline scan; H/a/psiEnd cross-check live against imp-3725.',
  },

  scope: {
    verificationOnly: true,
    noNewLambdaBound: true,
    imp3066Untouched: true,
    plattTrudgianStillSOTA: 'Lambda <= 0.2 (PT 2021) remains SOTA',
    noQED: true,
  },
});

// -- Build-time assertions (throw on failure via run-assertions harness) -----

const rel = (x, y) => Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y), 1e-300);

export const IMP_3874_DPSI_SENSITIVITY_VERIFICATION_ASSERTIONS = [
  {
    id: 'imp3874-direct-psi-reproduces-imp3725-psiend',
    holds: () =>
      ROWS.length === 3 &&
      ROWS.every((r) => {
        const baked = PSI_END_25[r.plateauIndex];
        return (
          baked !== undefined &&
          rel(r.psiBase, baked) < 2e-6 &&
          rel(r.psiBaseRelToBaked, rel(r.psiBase, baked)) < 5e-2
        );
      }),
    why:
      'The DIRECT Psi_N(T) computed offline at thetaBar=0.99, N=endN reproduces ' +
      'the imp-3725 baked psiEnd to relative ~1e-6 on all three plateaus, so the ' +
      'finite-difference machinery sits on the certified retardation, not a ' +
      'freshly invented sum.',
  },
  {
    id: 'imp3874-finite-difference-matches-analytic-derivative',
    holds: () =>
      ROWS.every((r) => {
        const baseRel = rel(r.dpsiFDBase, r.dpsiAnalyticBase);
        return baseRel < 1e-4 && r.maxFdVsAnalyticRel < 1e-4;
      }) &&
      MAX_FD_REL < 1e-4,
    why:
      'STEP-1 check: the centered finite difference (Psi(T+h)-Psi(T-h))/(2h) ' +
      'matches the exact analytic dPsi_N/dT = 32 H^2 sum P_j/D_j^3 to relative ' +
      '< 1e-4 at every sampled point, confirming d ln t_j/dT = (8/D_j) sum 1/s_l.',
  },
  {
    id: 'imp3874-lemma-bound-holds-two-sided',
    holds: () =>
      ALL_NONNEG === true &&
      ALL_UNDER_BOUND === true &&
      ROWS.every(
        (r) =>
          r.dpsiAnalyticBase >= 0 &&
          r.dpsiAnalyticBase <= r.boundBase &&
          r.dpsiOverBoundBase > 0 &&
          r.dpsiOverBoundBase < 1 &&
          r.dpsiOverBoundTop < 1,
      ),
    why:
      'Central check: 0 <= dPsi_N/dT <= (8/smin^2) Psi_N (LEMMA-3854) holds at ' +
      'every sampled (plateau, thetaBar) -- dPsi/dT is nonnegative and stays ' +
      'strictly under the rigorous ceiling across the whole feasible window.',
  },
  {
    id: 'imp3874-ceiling-loose-consistent-with-imp3870',
    holds: () =>
      MAX_DPSI_OVER_BOUND < 1e-2 &&
      ROWS.every(
        (r) =>
          // realised sensitivity far below the rigorous 8/smin^2 ceiling
          r.logSensBase > 0 &&
          r.logSensBase < r.rigorousCeilBase &&
          r.rigorousCeilBase / r.logSensBase > 1000,
      ),
    why:
      'The realised dPsi/dT is 3e-5 to 4.5e-4 of the rigorous (8/smin^2) Psi ' +
      'ceiling and the log-sensitivity (dPsi/dT)/Psi ~ 8-17 sits >1000x below ' +
      '8/smin^2 ~ 1.8e4-5.9e5 -- the valid-but-vacuous over-bound imp-3870 ' +
      'characterised, now confirmed directly against the flow.',
  },
  {
    id: 'imp3874-cross-checks-imp3725-geometry',
    holds: () =>
      ROWS.every((r) => {
        const h = H_25[r.plateauIndex];
        const src = SRC25.find((s) => s.plateauIndex === r.plateauIndex);
        return (
          h !== undefined &&
          rel(r.startN, src.startN) < 1e-12 &&
          rel(r.endN, src.endN) < 1e-12 &&
          // baked smin sits strictly between 0 and H (an active non-pair gap)
          r.sminBase > 0 &&
          r.sminBase < h
        );
      }),
    why:
      'The plateau window (startN,endN) matches imp-3725 and the baked smin is a ' +
      'genuine active non-pair gap (0 < smin < H), so the verification is anchored ' +
      'to the same plateau geometry as the derivation.',
  },
  {
    id: 'imp3874-verification-only-no-lambda-claim',
    holds: () =>
      IMP_3874_DPSI_SENSITIVITY_VERIFICATION.scope.noNewLambdaBound === true &&
      IMP_3874_DPSI_SENSITIVITY_VERIFICATION.scope.noQED === true &&
      IMP_3874_DPSI_SENSITIVITY_VERIFICATION.scope.imp3066Untouched === true &&
      IMP_3874_DPSI_SENSITIVITY_VERIFICATION.openSubGap.status === 'open' &&
      // this module only verifies an existing lemma; it must not restate a new bound
      IMP_3854_THETABAR_INSENSITIVITY_DERIVATION.scope.noQED === true,
    why:
      'Honesty guard: this numerically verifies an existing derived lemma. It ' +
      'must not assert a new Lambda bound or a QED, imp-3066 stays untouched, and ' +
      'the 7-remaining-plateaus sub-gap stays named open; Platt-Trudgian ' +
      'Lambda <= 0.2 remains SOTA.',
  },
];

// Self-executing (imp-3715 convention): any failed assertion throws at import.
for (const assertion of IMP_3874_DPSI_SENSITIVITY_VERIFICATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-3874-dpsi-sensitivity-verification assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP_3874_DPSI_SENSITIVITY_VERIFICATION;
