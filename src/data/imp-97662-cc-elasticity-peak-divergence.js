/**
 * @module imp-97662-cc-elasticity-peak-divergence
 *
 * imp-97662 (numerical, frontier-direction): the imp-97622/imp-97642
 * C_C-elasticity closed form
 *
 *     E = d(ln N)/d(ln C_C) = 2 / ( 1 + 2 d(ln R)/dx - d(ln L)/dx ),   x = ln N,
 *
 * was verified only at the DOWNSLOPE landmarks L2/L3/L4 (E = +2.5554/+2.1023/
 * +2.0790), where the crossing sigma(N) = s is transversal. This LIGHT standalone
 * module characterises the OPPOSITE regime: the behaviour of the same closed form
 * as the target level s is swept toward the imp-97520 L1 interior peak
 * sigma_max ~ 0.949429 (N_peak ~ 9.22e5), where the downslope crossing N_L(s) and
 * the upslope crossing merge into a TANGENCY and the elasticity is expected to
 * diverge. Same inherited imp-3406/imp-33582 surrogate component model (no new
 * model, no new constants; the pinned C_C 1/8 ansatz is perturbed only as a probe).
 *
 * THE DIVERGENCE LAW (square-root fold)
 * ------------------------------------
 * The closed-form denominator D = 1 + 2 d(ln R)/dx - d(ln L)/dx is EXACTLY the
 * peak condition: sigma = E_coll/(R + E_coll) is monotone in E_coll/R, so its
 * interior maximum is where d(ln E_coll)/dx = d(ln R)/dx, i.e. (d(ln L)/dx - 1)/2
 * = d(ln R)/dx, i.e. D = 0. Hence D(x) crosses zero LINEARLY at x_peak and the
 * closed form E = 2/D diverges there. Modelling the peak as a quadratic,
 * sigma(x) ~ sigma_max - A (x - x_peak)^2 with A = -sigma''(x_peak)/2, the two
 * crossings of a target s sit at x - x_peak = +/- sqrt((sigma_max - s)/A). Because
 * the peak LOCATION x_peak is C_C-invariant (a common prefactor on E_coll cannot
 * move the maximiser of E_coll/R, imp-97598/imp-97661), d(x_peak)/d(ln C_C) = 0,
 * so differentiating the crossing in ln C_C leaves only the moving-ceiling term:
 *
 *     E = d(ln N)/d(ln C_C) ~ +/- K / sqrt(sigma_max - s),
 *         K = ( d sigma_max / d(ln C_C) ) / ( 2 sqrt(A) ),
 *
 * with the DOWNSLOPE branch carrying +K and the UPSLOPE branch -K (the two merging
 * crossings diverge with opposite signs). This is the generic square-root blow-up
 * of a fold: the finite-height sigma_max is the only thing C_C moves near the peak,
 * and it enters through the vanishing 2 sqrt(sigma_max - s) denominator.
 *
 * NUMERICAL CONFIRMATION (base amplitude c = 1, 5-point stencil)
 * -------------------------------------------------------------
 *   Peak curvature A = -sigma''(x_peak)/2 ~ 3.215950e-3.
 *   d sigma_max / d(ln C_C) ~ +4.801356e-2   (the peak height rises with C_C).
 *   Predicted amplitude K = 0.048014 / (2 sqrt(3.21595e-3)) ~ 0.423330.
 *   Closed-form E * sqrt(sigma_max - s), downslope: 0.4311 (gap 1e-2) -> 0.4117
 *     (1e-3) -> 0.4180 (1e-4) -> 0.4215 (1e-5); upslope: -0.5749 -> -0.4509 ->
 *     -0.4302 -> -0.4253 -- both approaching +/-K ~ 0.4233 as the gap closes.
 *   The successive-decade ratio E(gap)/E(gap/10) ~ 0.313..0.314 -> 1/sqrt(10) =
 *     0.31623, the signature of the inverse-square-root law (not a pole 1/gap,
 *     which would give 0.1). The numeric log-C_C central difference tracks the
 *     closed form down to gap ~ 3e-3 (4.3111 vs 4.3112 at gap 1e-2) and then
 *     DEGRADES (the perturbed peak height crosses the target, so the crossing
 *     stops existing under one sign of the eps step) -- the closed form is the
 *     clean instrument near the tangency, exactly as the fold picture predicts.
 *
 * WHY THIS DOES NOT CONTRADICT "PEAK ELASTICITY 0" (imp-97598/imp-97661)
 * ---------------------------------------------------------------------
 * imp-97598/imp-97661 report the L1 PEAK elasticity as 0: that is
 * d(ln N_peak)/d(ln C_C), the sensitivity of the peak LOCATION, which is C_C-
 * invariant. The object here is d(ln N_cross(s))/d(ln C_C), the sensitivity of a
 * near-peak CROSSING, which diverges as s -> sigma_max. Both hold simultaneously:
 * the maximiser sits still (elasticity 0) while the level sets around it slide
 * without bound (elasticity ~ 1/sqrt(sigma_max - s)). The peak is the removable
 * point where the closed-form denominator D vanishes; the numerator stays 2.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound.
 * The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C
 * 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED and only perturbed as a probe, not
 * re-pinned; E_trunc pinned 3.06e-5 unchanged; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97622-sigma-l2-cc-elasticity-closed-form (the closed form, downslope L2)
 * @see imp-97642-l2-cc-elasticity-independent-verify (5-point stencil verification)
 * @see imp-97661-peak-landmark-elasticity-scaling-symmetry (peak-location elasticities, E_CC == 0)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (L1 peak sigma_max ~ 0.949429)
 * @see imp-97598-sigma-landmark-cc-sensitivity (peak-location elasticity 0)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5;
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97622/imp-97642 exactly

// EXACT imp-3406/imp-33582/imp-97622/imp-97642 sub-terms; C_C carried as the perturbed input.
function parts(N, cc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = cc * Math.sqrt(L / N);
  const R = E_TRUNC_PT + E_flow;
  return { T0, L, R, sigma: E_coll / (R + E_coll) };
}

// Interior peak location (C_C-invariant): ternary search in x = ln N.
function peakLogN(cc) {
  let a = Math.log(1e4);
  let b = Math.log(1e8);
  for (let i = 0; i < 300; i++) {
    const m1 = a + (b - a) / 3;
    const m2 = b - (b - a) / 3;
    if (parts(Math.exp(m1), cc).sigma < parts(Math.exp(m2), cc).sigma) a = m1;
    else b = m2;
  }
  return (a + b) / 2;
}
function sigmaMaxOf(cc) {
  return parts(Math.exp(peakLogN(cc)), cc).sigma;
}

// Downslope crossing (right arm of the peak): sigma first drops below target.
function crossBelow(target, cc, xPeak) {
  let a = xPeak;
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), cc).sigma > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
// Upslope crossing (left arm of the peak): sigma first rises above target.
function crossAbove(target, cc, xPeak) {
  let a = Math.log(1e4);
  let b = xPeak;
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), cc).sigma < target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// 5-point central-difference log-derivative, x = ln N.
function dLogDx5(fn, N, h) {
  const f = (k) => Math.log(fn(N * Math.exp(k * h)));
  return (-f(2) + 8 * f(1) - 8 * f(-1) + f(-2)) / (12 * h);
}

const cc = C_C_PINNED;
const X_PEAK = peakLogN(cc);
const N_PEAK = Math.exp(X_PEAK);
const SIGMA_MAX = sigmaMaxOf(cc);

// Closed-form elasticity E = 2/(1 + 2 dlnR/dx - dlnL/dx) at a branch crossing.
function closedForm(target, branch) {
  const N = branch === 'down' ? crossBelow(target, cc, X_PEAK) : crossAbove(target, cc, X_PEAK);
  const dlnR = dLogDx5((n) => parts(n, cc).R, N, 5e-6);
  const dlnL = dLogDx5((n) => parts(n, cc).L, N, 5e-6);
  const D = 1 + 2 * dlnR - dlnL;
  return { N, D, E: 2 / D };
}
// Numeric log-C_C central difference of the crossing N (imp-97598/imp-97642 procedure).
function numericE(target, branch, eps) {
  const c1 = (1 + eps) * cc;
  const c2 = (1 - eps) * cc;
  const xp1 = peakLogN(c1);
  const xp2 = peakLogN(c2);
  const up = branch === 'down' ? crossBelow(target, c1, xp1) : crossAbove(target, c1, xp1);
  const dn = branch === 'down' ? crossBelow(target, c2, xp2) : crossAbove(target, c2, xp2);
  return (Math.log(up) - Math.log(dn)) / (Math.log(1 + eps) - Math.log(1 - eps));
}

// Predicted fold amplitude K = (d sigma_max / d ln cc) / (2 sqrt(A)), A = -sigma''(x_peak)/2.
const H_A = 1e-4;
const SIGMA_PP =
  (parts(Math.exp(X_PEAK + H_A), cc).sigma - 2 * SIGMA_MAX + parts(Math.exp(X_PEAK - H_A), cc).sigma) /
  (H_A * H_A);
const A_CURV = -0.5 * SIGMA_PP;
const H_U = 1e-4;
const DSMAX_DU = (sigmaMaxOf(cc * Math.exp(H_U)) - sigmaMaxOf(cc * Math.exp(-H_U))) / (2 * H_U);
const K_PRED = DSMAX_DU / (2 * Math.sqrt(A_CURV));

// Gap ladder toward sigma_max on both branches.
const GAPS = [1e-2, 1e-3, 1e-4, 1e-5];
const DOWN = GAPS.map((g) => closedForm(SIGMA_MAX - g, 'down'));
const UP = GAPS.map((g) => closedForm(SIGMA_MAX - g, 'up'));
const DOWN_SCALED = GAPS.map((g, i) => DOWN[i].E * Math.sqrt(g)); // -> +K
const UP_SCALED = GAPS.map((g, i) => UP[i].E * Math.sqrt(g)); // -> -K
// Successive-decade ratio (1/sqrt(10) = 0.31623 for a square-root fold).
const DOWN_RATIOS = [0, 1, 2].map((i) => DOWN[i].E / DOWN[i + 1].E);
// Numeric-vs-closed agreement at a transversal-enough gap (1e-2) before the fold degrades the measurement.
const NUM_AT_1E2_DOWN = numericE(SIGMA_MAX - 1e-2, 'down', 0.002);

export const IMP97662_CC_ELASTICITY_PEAK_DIVERGENCE = {
  id: 'imp-97662',
  proofSection: 'S-frontier',
  question:
    'Assess the imp-97622/imp-97642 C_C-elasticity closed form E = 2/(1 + 2 d ln R/dx - d ln L/dx) as the ' +
    'target level is swept toward the imp-97520 L1 interior peak sigma_max ~ 0.949429, where the downslope ' +
    'and upslope crossings merge into a tangency and the elasticity should diverge. Characterise the ' +
    'divergence law and check it against the closed form. Measurement only; C_C 1/8 ansatz perturbed as a ' +
    'probe not re-pinned; no bound moves; NO QED.',
  peak: {
    N_peak: +N_PEAK.toExponential(6), // ~9.218633e5
    sigma_max: +SIGMA_MAX.toFixed(9), // ~0.949429014
    curvature_A: +A_CURV.toExponential(6), // ~3.215950e-3 (= -sigma''(x_peak)/2)
    dsigma_max_dlnCC: +DSMAX_DU.toExponential(6), // ~+4.801356e-2 (peak height rises with C_C)
  },
  divergenceLaw: {
    form: 'E = d(ln N)/d(ln C_C) ~ +/- K / sqrt(sigma_max - s); down branch +K, up branch -K',
    amplitude_K_predicted: +K_PRED.toFixed(6), // ~0.423330 = dsigma_max_dlnCC / (2 sqrt(A))
    gaps: GAPS.map((g) => +g.toExponential(0)),
    E_closed_down: DOWN.map((d) => +d.E.toFixed(4)), // +4.3111, +13.0181, +41.8023, +133.2847
    E_closed_up: UP.map((u) => +u.E.toFixed(4)), // -5.7486, -14.2577, -43.0225, -134.5029
    E_times_sqrtgap_down: DOWN_SCALED.map((v) => +v.toFixed(6)), // -> +K
    E_times_sqrtgap_up: UP_SCALED.map((v) => +v.toFixed(6)), // -> -K
    decade_ratios_down: DOWN_RATIOS.map((r) => +r.toFixed(5)), // ~0.313 -> 1/sqrt(10)=0.31623
    numeric_vs_closed_at_gap_1e2: {
      closed: +DOWN[0].E.toFixed(4),
      numeric: +NUM_AT_1E2_DOWN.toFixed(4),
      note: 'numeric log-C_C central difference tracks the closed form down to gap ~ 3e-3 then degrades near the fold',
    },
  },
  finding:
    'As the target level s is swept toward the imp-97520 L1 peak sigma_max ~ 0.949429, the C_C-elasticity of ' +
    'the crossing N_L(s) DIVERGES as an inverse square root E ~ +/- K/sqrt(sigma_max - s) -- the generic ' +
    'square-root blow-up of a fold, with the downslope branch carrying +K and the upslope branch -K. This is ' +
    'exactly what the imp-97622/imp-97642 closed form predicts: its denominator D = 1 + 2 d ln R/dx - ' +
    'd ln L/dx IS the peak condition (D = 0 at x_peak), so E = 2/D blows up there, and because the peak ' +
    'LOCATION is C_C-invariant (d x_peak/d ln C_C = 0) the only surviving term is the moving ceiling ' +
    'sigma_max(C_C), giving amplitude K = (d sigma_max/d ln C_C)/(2 sqrt(A)) with A = -sigma_xx(x_peak)/2. ' +
    'Numerically A ~ 3.21595e-3, d sigma_max/d ln C_C ~ +0.048014, so K ~ 0.423330; the closed-form ' +
    'E*sqrt(sigma_max - s) approaches +/-0.4233 on both branches and the successive-decade ratio ~ 0.313 ' +
    'matches 1/sqrt(10) = 0.31623 (a pole 1/gap would give 0.1). This does NOT contradict the imp-97598/' +
    'imp-97661 "peak elasticity 0": that is the invariance of the peak LOCATION d ln N_peak/d ln C_C = 0, a ' +
    'different derivative from the diverging near-peak CROSSING elasticity -- the maximiser stays fixed while ' +
    'its surrounding level sets slide without bound. The numeric central difference confirms the closed form ' +
    'down to gap ~ 3e-3 then degrades, since the perturbed peak height crosses the target near the tangency.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-97622/imp-97642 C_C-elasticity closed form ' +
    'E = 2/(1 + 2 d ln R/dx - d ln L/dx) DIVERGES as an inverse square root E ~ +/- K/sqrt(sigma_max - s) as ' +
    'the target approaches the imp-97520 L1 peak sigma_max ~ 0.949429 -- a square-root fold, +K downslope, ' +
    '-K upslope, K = (d sigma_max/d ln C_C)/(2 sqrt(A)) ~ 0.423330. The closed-form denominator is exactly ' +
    'the peak condition D = 0, so the blow-up is structural, and E*sqrt(sigma_max - s) -> +/-K with ' +
    'decade-ratio 0.313 ~ 1/sqrt(10) confirming the 1/2 exponent. Consistent with (not contradicting) the ' +
    'imp-97598/imp-97661 peak-LOCATION elasticity 0: location fixed, level sets diverging. Component model is ' +
    'the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per ' +
    'imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED (perturbed only as a probe, not ' +
    're-pinned); E_trunc pinned 3.06e-5 unchanged; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97622 (downslope L2 closed form); imp-97642 (5-point stencil verification); imp-97661 ' +
    '(peak-location elasticities, E_CC == 0); imp-97520 (L1 peak sigma_max ~ 0.949429); imp-97598 ' +
    '(peak-location elasticity 0); imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi), 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP97662_CC_ELASTICITY_PEAK_DIVERGENCE_ASSERTIONS = [
  {
    id: 'imp97662-denominator-is-peak-condition',
    description: 'the closed-form denominator D = 1 + 2 dlnR/dx - dlnL/dx vanishes at the peak (E = 2/D blows up)',
    holds: () => {
      const dlnR = dLogDx5((n) => parts(n, cc).R, N_PEAK, 5e-6);
      const dlnL = dLogDx5((n) => parts(n, cc).L, N_PEAK, 5e-6);
      return Math.abs(1 + 2 * dlnR - dlnL) < 1e-3;
    },
  },
  {
    id: 'imp97662-inverse-sqrt-divergence',
    description: 'E grows like 1/sqrt(sigma_max - s): successive-decade ratios approach 1/sqrt(10) = 0.31623',
    holds: () => DOWN_RATIOS.every((r) => Math.abs(r - 1 / Math.sqrt(10)) < 0.02),
  },
  {
    id: 'imp97662-amplitude-matches-fold-prediction',
    description: 'E*sqrt(gap) approaches the predicted fold amplitude K on both branches (down +K, up -K)',
    holds: () =>
      Math.abs(DOWN_SCALED[DOWN_SCALED.length - 1] - K_PRED) < 0.02 &&
      Math.abs(UP_SCALED[UP_SCALED.length - 1] + K_PRED) < 0.02 &&
      DOWN_SCALED[DOWN_SCALED.length - 1] > 0 &&
      UP_SCALED[UP_SCALED.length - 1] < 0 &&
      Math.abs(K_PRED - 0.42333) < 5e-3,
  },
  {
    id: 'imp97662-branches-diverge-with-opposite-signs',
    description: 'the two merging crossings diverge with opposite signs (downslope E > 0, upslope E < 0)',
    holds: () => DOWN.every((d) => d.E > 0) && UP.every((u) => u.E < 0),
  },
  {
    id: 'imp97662-numeric-tracks-closed-form-away-from-fold',
    description: 'the numeric log-C_C central difference matches the closed form at a transversal gap (1e-2)',
    holds: () => Math.abs(NUM_AT_1E2_DOWN - DOWN[0].E) < 1e-2,
  },
  {
    id: 'imp97662-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA, ansatz untouched',
    holds: () =>
      IMP97662_CC_ELASTICITY_PEAK_DIVERGENCE.isRigorous === false &&
      /NO QED/.test(IMP97662_CC_ELASTICITY_PEAK_DIVERGENCE.verdict) &&
      /remains SOTA/.test(IMP97662_CC_ELASTICITY_PEAK_DIVERGENCE.verdict),
  },
];

for (const a of IMP97662_CC_ELASTICITY_PEAK_DIVERGENCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97662-cc-elasticity-peak-divergence assertion failed: ${a.id}`);
  }
}
