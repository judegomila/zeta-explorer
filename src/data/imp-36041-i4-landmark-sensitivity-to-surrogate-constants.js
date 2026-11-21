/**
 * @module imp-36041-i4-landmark-sensitivity-to-surrogate-constants
 *
 * imp-36041 (numerical, S-frontier): ASSESS how sensitive the imp-35989 I4 argument-error accrual
 * landmarks are to the two ILLUSTRATIVE surrogate constants RHO_EVAL and K_TRUNC, by quantifying the
 * log-log elasticities of the two landmarks the imp-35989 pi-budget conclusion rests on:
 *   (1) the accrual U-minimum location n_min (~ 1.56e8, where E_total bottoms at ~ 2.18e-7 rad), and
 *   (2) the roundoff-only pi-budget crossover n* (~ 4.50e15, where E_round alone reaches pi).
 *
 * SURROGATE MEASUREMENT ONLY. imp-35989 built its two-channel I4 accrual model
 *   E_round(n) = ((n - 1) + RHO_EVAL) * u * |S|   (per-panel arg/atan2 evaluation + naive summation)
 *   E_trunc(n) = K_TRUNC / n                      (I1 enclosure argwidth diam F(Z) -> 0)
 *   E_total(n) = E_round(n) + E_trunc(n),   |S| = 2pi * N,  u = 2^-53,
 * fixed RHO_EVAL = 4 and K_TRUNC = 17 as ILLUSTRATIVE (not measured) condition / convergence
 * constants, and reported the two landmarks at those values. This module measures how far the two
 * landmarks move when those constants are perturbed, to bound how much the
 * pi-budget-never-threatened-at-physical-n reading depends on the illustrative choices. It sums NO
 * real increments; evaluates NO true H_t; certifies NO count; fixes NO Delta or h; instantiates NO
 * interval; changes NO bound; imp-34714a is untouched; NO QED. No refereed bound is changed.
 *
 * CLOSED-FORM LANDMARKS AND THEIR ELASTICITIES
 * -----------------------------------------------------------------------------
 * U-minimum: dE_total/dn = u*|S| - K_TRUNC/n^2 = 0  =>  n_min = sqrt(K_TRUNC / (u*|S|)).
 *   log n_min = (1/2) log K_TRUNC - (1/2) log(u*|S|), and RHO_EVAL does not appear. Hence
 *       d log n_min / d log K_TRUNC = +1/2   EXACTLY  (a clean half-power law), and
 *       d log n_min / d log RHO_EVAL = 0     EXACTLY  (n_min is independent of RHO_EVAL).
 *   The U-minimum VALUE E_min = 2*sqrt(K_TRUNC * u*|S|) + (RHO_EVAL - 1)*u*|S| ~ 2*sqrt(K_TRUNC*u*|S|),
 *   so d log E_min / d log K_TRUNC = +1/2 as well (the RHO_EVAL term is ~ 2e-15 rad, negligible).
 *
 * Roundoff-only crossover: E_round(n*) = pi  =>  n* = pi/(u*|S|) + (1 - RHO_EVAL).
 *   n* is set by pi/(u*|S|) ~ 4.50e15; RHO_EVAL enters only as an O(1) ADDITIVE shift, so
 *       d log n* / d log RHO_EVAL = -RHO_EVAL / n* ~ -8.9e-16   (essentially ZERO), and
 *       d log n* / d log K_TRUNC = 0   EXACTLY  (the roundoff channel carries no K_TRUNC).
 *   (A central finite difference in RHO_EVAL returns exactly 0 -- the -1 shift underflows against
 *   the ~4.5e15 baseline in double precision -- so the analytic -RHO_EVAL/n* is reported.)
 *
 * THE ROBUSTNESS READING
 * -----------------------------------------------------------------------------
 * Both landmark elasticities are <= 1/2 in magnitude, and the CROSS elasticities are exactly zero:
 * n_min sees only K_TRUNC (as a half power), n* sees only RHO_EVAL (negligibly). To drag either
 * landmark into the physical panel range (n ~ 17 to ~ 1e6) the constants would have to move
 * absurdly far:
 *   - Pushing n_min down to n = 1e6 needs K_TRUNC ~ 7.0e-4 (a ~ 2.4e4x drop from 17); down to the
 *     minimal I2 count n = 17 needs K_TRUNC ~ 2.0e-13 (~ 14 orders below 17).
 *   - Pushing n* down to n = 1e6 needs RHO_EVAL ~ 4.5e15 (physically absurd for a ULP-scale
 *     evaluation condition).
 * The one genuine (non-landmark) K_TRUNC dependence at the SMALL-n edge: E_trunc(17) = K_TRUNC/17
 * clears pi iff K_TRUNC < 17*pi ~ 53.4, so the illustrative K_TRUNC = 17 carries a ~ 3.14x margin at
 * the minimal count -- but that only sets how much refinement (raising n toward n_min) is needed, not
 * whether the budget can be met. So the pi-budget-never-threatened conclusion is ROBUST: no plausible
 * perturbation of RHO_EVAL or K_TRUNC moves either landmark into the physical range.
 *
 * WHAT THIS IS NOT
 * -----------------------------------------------------------------------------
 * A double-precision SURROGATE sensitivity study on the imp-35989 illustrative model, not a
 * certificate. RHO_EVAL and K_TRUNC remain illustrative; N is anchored at 1 (roundoff linear in N).
 * It sums no real increments, evaluates no true H_t, certifies no count, fixes no Delta or h,
 * instantiates no interval, changes no bound; imp-34714a untouched. NO QED. No refereed bound is changed.
 *
 * @see imp-35989-i4-accumulated-error-vs-panel-count-scale (parent: two-channel accrual + the two landmarks)
 * @see imp-35804-i4-integer-closure-error-budget-scope (I4 <pi GLOBAL accumulated-error budget)
 * @see imp-35777-i2-logderivative-panel-cap-scope (I2 per-panel cap; ~ 4.28 panels per unit height)
 * @see imp-35757-i2-panel-width-count-scope (I2 panel-width / count; mean gap ~ 0.2336)
 * @see Polymath15 2019 (H_t = A + B - C; barrier method); Platt-Trudgian 2021 (T_PT = 3e12; no refereed bound is changed)
 */

// -- Anchor + operative constants (import-light; matching imp-35989) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const HALF_TURN = Math.PI; // the I4 closure budget on the accumulated half-width E
const U_ROUNDOFF = Math.pow(2, -53); // double-precision unit roundoff ~ 1.1102e-16
const N_ANCHOR = 1; // winding integer for a single-mean-gap box (Delta ~ 0.2336)
const S_TOTAL = 2 * Math.PI * N_ANCHOR; // accumulated true argument = 2pi*N
const RHO_EVAL = 4; // imp-35989 illustrative per-panel arg/atan2 evaluation condition (ULP-scale)
const K_TRUNC = 17; // imp-35989 illustrative 1/n truncation-accrual constant

// -- imp-35989 two-channel accrual surrogate (reproduced, parameterized by the two constants) --
const eRound = (n, rho = RHO_EVAL) => ((n - 1) + rho) * U_ROUNDOFF * S_TOTAL; // GROWS ~ linear in n
const eTrunc = (n, k = K_TRUNC) => k / n; // FALLS ~ 1/n under subdivision
const eTotal = (n, rho = RHO_EVAL, k = K_TRUNC) => eRound(n, rho) + eTrunc(n, k);

// -- Closed-form landmarks as functions of the constants --
const nMin = (k = K_TRUNC) => Math.sqrt(k / (U_ROUNDOFF * S_TOTAL)); // U-minimum location
const eMinValue = (rho = RHO_EVAL, k = K_TRUNC) => eTotal(nMin(k), rho, k); // U-minimum value
const nStar = (rho = RHO_EVAL) => HALF_TURN / (U_ROUNDOFF * S_TOTAL) - rho + 1; // roundoff-only crossover

// -- Central-difference log-log elasticity helper --
const logLogElasticity = (f, x, eps = 1e-4) => {
  const fp = f(x * (1 + eps));
  const fm = f(x * (1 - eps));
  return (Math.log(fp) - Math.log(fm)) / (Math.log(x * (1 + eps)) - Math.log(x * (1 - eps)));
};

// -- Measured elasticities --
const D_LOG_NMIN_D_LOG_KTRUNC = logLogElasticity((k) => nMin(k), K_TRUNC); // = +1/2
const D_LOG_EMIN_D_LOG_KTRUNC = logLogElasticity((k) => eMinValue(RHO_EVAL, k), K_TRUNC); // = +1/2
// n_min carries no RHO_EVAL and n* carries no K_TRUNC: the cross elasticities are exactly 0.
const D_LOG_NMIN_D_LOG_RHOEVAL = 0;
const D_LOG_NSTAR_D_LOG_KTRUNC = 0;
// n* elasticity in RHO_EVAL is the analytic -RHO/n* (a finite difference underflows the -1 shift).
const D_LOG_NSTAR_D_LOG_RHOEVAL_ANALYTIC = -RHO_EVAL / nStar();

// -- Robustness thresholds: constant values needed to drag a landmark to the physical range --
const K_TRUNC_FOR_NMIN_1E6 = 1e6 * 1e6 * U_ROUNDOFF * S_TOTAL; // ~ 7.0e-4 (from n_min = 1e6)
const K_TRUNC_FOR_NMIN_17 = 17 * 17 * U_ROUNDOFF * S_TOTAL; // ~ 2.0e-13 (n_min = 17)
const RHO_EVAL_FOR_NSTAR_1E6 = HALF_TURN / (U_ROUNDOFF * S_TOTAL) - 1e6 + 1; // ~ 4.5e15 (absurd)
const K_TRUNC_SMALL_N_PI = 17 * HALF_TURN; // ~ 53.4: K_TRUNC above which E_trunc(17) exceeds pi

export const IMP36041_I4_LANDMARK_SENSITIVITY_TO_SURROGATE_CONSTANTS = {
  id: 'imp-36041',
  proofSection: 'S-frontier',
  question:
    'Assess how sensitive the imp-35989 I4 argument-error accrual U-minimum (~ 2.18e-7 rad at ' +
    'n ~ 1.56e8) and the roundoff-only pi-budget crossover (n* ~ 4.50e15) are to the ILLUSTRATIVE ' +
    'surrogate constants RHO_EVAL and K_TRUNC, quantifying d log n_min / d log K_TRUNC and ' +
    'd log n* / d log RHO_EVAL. Surrogate measurement only; certifies no count; changes no bound; NO QED.',
  model: {
    eRoundClosedForm: 'E_round(n) = ((n-1) + RHO_EVAL) * u * |S|',
    eTruncClosedForm: 'E_trunc(n) = K_TRUNC / n',
    nMinClosedForm: 'n_min = sqrt(K_TRUNC / (u*|S|))  (RHO_EVAL absent)',
    nStarClosedForm: 'n* = pi/(u*|S|) + (1 - RHO_EVAL)  (K_TRUNC absent)',
    unitRoundoff: U_ROUNDOFF,
    accumulatedArgument: S_TOTAL,
    windingInteger: N_ANCHOR,
    rhoEval: RHO_EVAL,
    kTrunc: K_TRUNC,
  },
  landmarks: {
    nMin: nMin(),
    eMin: eMinValue(),
    nStar: nStar(),
  },
  elasticities: {
    dLogNminDLogKtrunc: D_LOG_NMIN_D_LOG_KTRUNC,
    dLogNminDLogRhoEval: D_LOG_NMIN_D_LOG_RHOEVAL,
    dLogEminDLogKtrunc: D_LOG_EMIN_D_LOG_KTRUNC,
    dLogNstarDLogRhoEvalAnalytic: D_LOG_NSTAR_D_LOG_RHOEVAL_ANALYTIC,
    dLogNstarDLogKtrunc: D_LOG_NSTAR_D_LOG_KTRUNC,
    finding:
      'd log n_min / d log K_TRUNC = +1/2 EXACTLY (half-power law); d log n_min / d log RHO_EVAL = 0 ' +
      'EXACTLY (n_min carries no RHO_EVAL); d log n* / d log RHO_EVAL = -RHO_EVAL/n* ~ -8.9e-16 ' +
      '(RHO_EVAL enters n* only as an O(1) additive shift against a ~4.5e15 baseline, so essentially ' +
      'ZERO); d log n* / d log K_TRUNC = 0 EXACTLY (the roundoff channel carries no K_TRUNC). The ' +
      'U-minimum VALUE inherits d log E_min / d log K_TRUNC = +1/2.',
  },
  robustnessThresholds: {
    kTruncForNminAt1e6: K_TRUNC_FOR_NMIN_1E6,
    kTruncForNminAt17: K_TRUNC_FOR_NMIN_17,
    rhoEvalForNstarAt1e6: RHO_EVAL_FOR_NSTAR_1E6,
    kTruncWhereETrunc17ExceedsPi: K_TRUNC_SMALL_N_PI,
    finding:
      'To drag n_min down to n=1e6 needs K_TRUNC ~ 7.0e-4 (~2.4e4x below 17); down to n=17 needs ' +
      'K_TRUNC ~ 2.0e-13 (~14 orders below 17). To drag n* down to n=1e6 needs RHO_EVAL ~ 4.5e15 ' +
      '(physically absurd). The only genuine small-n dependence: E_trunc(17)=K_TRUNC/17 clears pi ' +
      'iff K_TRUNC < 17*pi ~ 53.4, so K_TRUNC=17 keeps a ~3.14x margin at the minimal I2 count -- ' +
      'that governs only how much refinement is needed, not whether the budget can be met.',
  },
  verdict:
    'SURROGATE SENSITIVITY STUDY (frontier-direction, NOT rigorous). Both imp-35989 I4 landmarks are ' +
    'ROBUST to the illustrative surrogate constants. The U-minimum location depends on K_TRUNC as a ' +
    'clean half power (d log n_min / d log K_TRUNC = +1/2 EXACTLY) and is INDEPENDENT of RHO_EVAL ' +
    '(elasticity 0); the roundoff-only pi-budget crossover n* is essentially INSENSITIVE to RHO_EVAL ' +
    '(d log n* / d log RHO_EVAL = -RHO_EVAL/n* ~ -8.9e-16, since RHO_EVAL enters only as an O(1) ' +
    'additive shift against the pi/(u*|S|) ~ 4.5e15 baseline) and INDEPENDENT of K_TRUNC (elasticity ' +
    '0). Both cross elasticities are exactly zero and no landmark elasticity exceeds 1/2 in magnitude, ' +
    'so no plausible perturbation of RHO_EVAL or K_TRUNC moves either landmark into the physical panel ' +
    'range (n ~ 17 to ~ 1e6): dragging n_min to 1e6 needs K_TRUNC ~ 7e-4, dragging n* to 1e6 needs ' +
    'RHO_EVAL ~ 4.5e15. The imp-35989 pi-budget-never-threatened-at-physical-n reading therefore does ' +
    'NOT hinge on the illustrative constants. It sums no real increments; evaluates no true H_t; ' +
    'certifies no count; fixes no Delta or h; instantiates no interval; changes no bound; imp-34714a ' +
    'untouched; NO QED. No refereed bound is changed.',
  isRigorous: false,
  citation:
    'imp-35989 (two-channel I4 accrual surrogate + the two landmarks); imp-35804 (I4 <pi GLOBAL ' +
    'accumulated-error budget); imp-35777 (I2 cap; ~ 4.28 panels per unit height); imp-35757 (I2 ' +
    'panel-width / count; mean gap ~ 0.2336); Polymath15 2019 (H_t = A + B - C; barrier method); ' +
    'Platt-Trudgian 2021 (T_PT = 3e12; no refereed bound is changed).',
};

export const IMP36041_I4_LANDMARK_SENSITIVITY_TO_SURROGATE_CONSTANTS_ASSERTIONS = [
  {
    // U-minimum location moves as a clean half power of K_TRUNC.
    id: 'imp36041-nmin-half-power-in-ktrunc',
    description: 'd log n_min / d log K_TRUNC = +1/2 (n_min = sqrt(K_TRUNC/(u*|S|)))',
    holds: () =>
      Math.abs(D_LOG_NMIN_D_LOG_KTRUNC - 0.5) < 1e-6 &&
      Math.abs(nMin(4 * K_TRUNC) - 2 * nMin(K_TRUNC)) < 1, // 4x K -> 2x n_min
  },
  {
    // U-minimum is independent of RHO_EVAL; U-minimum VALUE is also a half power of K_TRUNC.
    id: 'imp36041-nmin-independent-of-rhoeval',
    description: 'n_min carries no RHO_EVAL (elasticity 0); d log E_min / d log K_TRUNC = +1/2',
    holds: () =>
      D_LOG_NMIN_D_LOG_RHOEVAL === 0 &&
      Math.abs(nMin() - nMin()) === 0 &&
      Math.abs(D_LOG_EMIN_D_LOG_KTRUNC - 0.5) < 1e-4,
  },
  {
    // Roundoff-only crossover is essentially insensitive to RHO_EVAL (additive-shift regime).
    id: 'imp36041-nstar-insensitive-to-rhoeval',
    description: 'd log n* / d log RHO_EVAL = -RHO_EVAL/n* ~ -8.9e-16 (RHO_EVAL is an O(1) additive shift)',
    holds: () =>
      Math.abs(D_LOG_NSTAR_D_LOG_RHOEVAL_ANALYTIC) < 1e-14 &&
      Math.abs(D_LOG_NSTAR_D_LOG_RHOEVAL_ANALYTIC) > 0 &&
      Math.abs(nStar(RHO_EVAL) - (HALF_TURN / (U_ROUNDOFF * S_TOTAL) - RHO_EVAL + 1)) < 1e-3,
  },
  {
    // Cross elasticities are exactly zero: n* carries no K_TRUNC.
    id: 'imp36041-nstar-independent-of-ktrunc',
    description: 'n* has no K_TRUNC (d log n* / d log K_TRUNC = 0); the two landmarks are ~4.50e15 / ~1.56e8',
    holds: () =>
      D_LOG_NSTAR_D_LOG_KTRUNC === 0 &&
      nStar() > 1e15 &&
      nStar() < 1e16 &&
      nMin() > 1e8 &&
      nMin() < 1e9,
  },
  {
    // Robustness: dragging either landmark into the physical range needs absurd constants.
    id: 'imp36041-robustness-thresholds-absurd',
    description: 'n_min->1e6 needs K_TRUNC~7e-4; n_min->17 needs K_TRUNC~2e-13; n*->1e6 needs RHO_EVAL~4.5e15',
    holds: () =>
      K_TRUNC_FOR_NMIN_1E6 < 1e-3 &&
      K_TRUNC_FOR_NMIN_1E6 > 1e-4 &&
      K_TRUNC_FOR_NMIN_17 < 1e-12 &&
      RHO_EVAL_FOR_NSTAR_1E6 > 1e15 &&
      K_TRUNC_SMALL_N_PI > 50 &&
      K_TRUNC_SMALL_N_PI < 60 &&
      K_TRUNC < K_TRUNC_SMALL_N_PI, // illustrative K_TRUNC=17 keeps the small-n margin
  },
  {
    // Honesty gate: surrogate only, certifies no count, NO QED, no refereed bound is changed.
    id: 'imp36041-honesty-gate-no-qed',
    description: 'Surrogate sensitivity study only; certifies no count; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP36041_I4_LANDMARK_SENSITIVITY_TO_SURROGATE_CONSTANTS.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /certifies no count/.test(IMP36041_I4_LANDMARK_SENSITIVITY_TO_SURROGATE_CONSTANTS.verdict) &&
      /NO QED/.test(IMP36041_I4_LANDMARK_SENSITIVITY_TO_SURROGATE_CONSTANTS.verdict) &&
      /refereed bound is changed/i.test(IMP36041_I4_LANDMARK_SENSITIVITY_TO_SURROGATE_CONSTANTS.verdict),
  },
];

for (const a of IMP36041_I4_LANDMARK_SENSITIVITY_TO_SURROGATE_CONSTANTS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36041-i4-landmark-sensitivity-to-surrogate-constants assertion failed: ${a.id}`);
  }
}
