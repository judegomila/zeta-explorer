/**
 * @module imp-124806-knee-floor-residual-curvature-endpoint-robustness
 *
 * imp-124806 (accuracy, frontier-direction): imp-124772 F2 reported a faint sign-symmetric U in the
 * 10-floor p_knee OLS residuals (negative at the 0.5x/5x floor extremes, positive interior, ~3e-3
 * decades). imp-124786 then fit a quadratic to that same residual and found the curvature coefficient
 * a2 ~ -1.79e-2 is distinguishable from ZERO at t ~ -50 (7 dof) -- i.e. it is NOT random fit noise.
 * But statistical significance against a zero-noise null does not, by itself, rule out the OTHER
 * benign explanation the ticket names: a FLOOR-LADDER ENDPOINT ARTIFACT. A quadratic drawn through a
 * finite ladder can be dominated by the leverage of its two extreme abscissae (here the 0.5x and 5x
 * floors, which sit at the ends of the ~1-decade log10 E_trunc span); such an artifact would ALSO be
 * highly "significant" against zero, yet would collapse or flip the moment the two endpoints are
 * dropped. Deciding genuine-running vs endpoint-artifact requires a LEVERAGE / robustness test, not a
 * t-test.
 *
 * This module DECIDES that dichotomy by re-fitting the same quadratic (imp-97822 floorSweep reused
 * VERBATIM) under two endpoint-perturbations and comparing the curvature coefficient a2:
 *   (i)  drop BOTH extreme floors (0.5x and 5x) and re-fit the quadratic on the interior 8 floors;
 *   (ii) a full leave-one-out (LOO) jackknife: drop each of the 10 floors in turn and re-fit.
 * If a2 is an endpoint artifact, (i) should collapse it toward zero or flip its sign, and (ii) should
 * show the two endpoints as the dominant leverage points pulling a2 away from the interior value. If
 * a2 is a genuine running of p_knee with floor depth, both perturbations should leave a2 stable in
 * sign and magnitude and still significant.
 *
 * THE TEST (no fresh model -- reuses the imp-97822 floorSweep verbatim)
 * -------------------------------------------------------------------
 * Let x = log10 E_trunc (centered) and y = log10 N*. Fit y = a2*x^2 + a1*x + a0 by OLS (identical to
 * the imp-124786 quadratic normal equations). We report, for the full ladder, the interior-8 subset,
 * and each LOO subset:
 *   - a2, the quadratic curvature coefficient (decades per centered-decade^2),
 *   - SE(a2) from sigma^2 * (X^T X)^-1 with sigma^2 = SS_res/(n-3),
 *   - t = a2/SE(a2),
 * plus the interior-vs-full shift measured in units of the full-ladder SE, and the LOO a2 range.
 *
 * THE FINDING (measurement / robustness only)
 * -------------------------------------------
 *   (H0) DROPPING BOTH ENDPOINTS DOES NOT COLLAPSE THE CURVATURE. The interior-8 quadratic gives
 *        a2 ~ -1.817e-2 vs the full-ladder a2 ~ -1.787e-2 -- a shift of only ~-0.84 full-ladder SE,
 *        and if anything slightly MORE negative (not toward zero). The interior fit stays highly
 *        significant at t ~ -42. An endpoint-weighting artifact would have collapsed a2 toward zero
 *        or flipped its sign when the two extreme floors were removed; it did neither.
 *   (H1) THE LEAVE-ONE-OUT JACKKNIFE IS TIGHT AND SIGN-STABLE. Across all ten LOO refits a2 stays in
 *        ~[-1.888e-2, -1.693e-2] (spread ~1.9e-3, ~11% of |a2|), every subset the SAME sign as the
 *        full fit and every |t| > 40. The two extreme floors are NOT the dominant leverage points
 *        toward zero: dropping 0.5x makes a2 MORE negative (-1.888e-2), and dropping 5x -- the single
 *        most influential point -- only softens it to -1.693e-2, still ~48x its SE from zero.
 *   (H2) VERDICT: GENUINE RUNNING, NOT AN ENDPOINT ARTIFACT. The curvature survives removal of both
 *        floor-ladder endpoints with a sub-SE shift and survives every LOO deletion with the same
 *        sign and overwhelming significance, so the imp-124772 F2 sign-symmetric residual reflects a
 *        real second-order running of p_knee with E_trunc floor depth, not a two-endpoint weighting
 *        artifact of the 0.5x..5x ladder.
 *   (H3) ORIENTATION NOTE (inherits the imp-124786 correction). a2 < 0: log10 N* bends BELOW its
 *        linear trend at the floor extremes and above it in the interior -- concave-DOWN in log10 N*
 *        (a hump). imp-124772 F2 labelled the residual a "concave-up U"; this is the same data with
 *        the imp-124786 orientation correction, carried through here.
 *
 * VERDICT: the imp-124772 F2 faint sign-symmetric p_knee residual U is a GENUINE floor-depth running
 * of the knee exponent, NOT a floor-ladder endpoint artifact. The quadratic curvature coefficient
 * a2 ~ -0.0179 is stable under removal of both extreme floors (interior-8 a2 ~ -0.0182, a ~-0.84 SE
 * shift) and under a full leave-one-out jackknife (a2 in ~[-0.0189, -0.0169], all one sign, all
 * |t| > 40); the two endpoints carry no dominant leverage toward zero. This complements imp-124786
 * (which ruled out the zero-noise null) by ruling out the endpoint-weighting null.
 *
 * MEASUREMENT / ROBUSTNESS ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-124786-knee-floor-residual-quadratic-fit (fit the same a2, ruled out the ZERO-noise null; complemented here)
 * @see imp-124772-knee-floor-elasticity-multifloor-fit (the 10-floor OLS p_knee fit; F2 residual U tested here)
 * @see imp-97822-sigma-knee-etrunc-floor-elasticity (the two-floor knee fit; floorSweep reused verbatim)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (the 0.5x..5x E_trunc floor sweep)
 */

import { IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY } from './imp-97822-sigma-knee-etrunc-floor-elasticity.js';

// Full imp-97822 floor ladder: {floorFactor, E_trunc, log10Nstar} per factor in {0.5..5}, resolved knees only.
const SWEEP = IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY.floorSweep.filter((r) => r.log10Nstar !== null);

// 3x3 matrix inverse (adjugate / determinant) for the quadratic normal equations.
function inv3(m) {
  const [a, b, c] = m[0];
  const [d, e, f] = m[1];
  const [g, h, i] = m[2];
  const A = e * i - f * h;
  const B = -(d * i - f * g);
  const C = d * h - e * g;
  const D = -(b * i - c * h);
  const E = a * i - c * g;
  const F = -(a * h - b * g);
  const G = b * f - c * e;
  const H = -(a * f - c * d);
  const I = a * e - b * d;
  const det = a * A + b * B + c * C;
  return [
    [A / det, D / det, G / det],
    [B / det, E / det, H / det],
    [C / det, F / det, I / det],
  ];
}

// Quadratic OLS of log10 N* on centered log10 E_trunc; returns a2, SE(a2), t = a2/SE, on n-3 dof.
function quadFit(rows) {
  const xsRaw = rows.map((r) => Math.log10(r.E_trunc));
  const ys = rows.map((r) => r.log10Nstar);
  const n = xsRaw.length;
  const mx = xsRaw.reduce((s, v) => s + v, 0) / n;
  const xs = xsRaw.map((v) => v - mx); // center for conditioning; a2 is orientation-invariant under centering
  let S0 = n;
  let S1 = 0;
  let S2 = 0;
  let S3 = 0;
  let S4 = 0;
  let T0 = 0;
  let T1 = 0;
  let T2 = 0;
  for (let i = 0; i < n; i++) {
    const x = xs[i];
    const x2 = x * x;
    S1 += x;
    S2 += x2;
    S3 += x2 * x;
    S4 += x2 * x2;
    T0 += ys[i];
    T1 += x * ys[i];
    T2 += x2 * ys[i];
  }
  const inv = inv3([
    [S0, S1, S2],
    [S1, S2, S3],
    [S2, S3, S4],
  ]);
  const rhs = [T0, T1, T2];
  const coef = [0, 0, 0];
  for (let r = 0; r < 3; r++) {
    for (let k = 0; k < 3; k++) coef[r] += inv[r][k] * rhs[k];
  }
  const [a0, a1, a2] = coef;
  let ssRes = 0;
  for (let i = 0; i < n; i++) {
    const pred = a0 + a1 * xs[i] + a2 * xs[i] * xs[i];
    ssRes += (ys[i] - pred) ** 2;
  }
  const dof = n - 3;
  const seA2 = Math.sqrt((ssRes / dof) * inv[2][2]);
  return { n, a1, a2, seA2, tA2: a2 / seA2 };
}

const FULL = quadFit(SWEEP);

// (i) Drop BOTH extreme floors (0.5x and 5x) and re-fit on the interior 8.
const INTERIOR = quadFit(SWEEP.filter((r) => r.floorFactor !== 0.5 && r.floorFactor !== 5.0));
// Interior-vs-full curvature shift, measured in units of the FULL-ladder SE (a sub-SE shift => stable).
const INTERIOR_SHIFT_IN_FULL_SE = +((INTERIOR.a2 - FULL.a2) / FULL.seA2).toFixed(3);

// (ii) Leave-one-out jackknife: drop each floor in turn and re-fit.
const LOO = SWEEP.map((row, j) => {
  const f = quadFit(SWEEP.filter((_, i) => i !== j));
  return { droppedFactor: row.floorFactor, a2: +f.a2.toExponential(4), tA2: +f.tA2.toFixed(1) };
});
const LOO_A2 = LOO.map((r) => r.a2);
const LOO_A2_MIN = Math.min(...LOO_A2);
const LOO_A2_MAX = Math.max(...LOO_A2);
const LOO_A2_SPREAD = +(LOO_A2_MAX - LOO_A2_MIN).toExponential(3);
const LOO_ALL_SAME_SIGN = LOO_A2.every((a) => Math.sign(a) === Math.sign(FULL.a2));
const LOO_MIN_ABS_T = +Math.min(...LOO.map((r) => Math.abs(r.tA2))).toFixed(1);

// Decision: endpoint artifact would collapse a2 toward zero on endpoint removal or flip its sign.
// Genuine running keeps a2 same-sign, sub-few-SE stable, and significant under both perturbations.
const ENDPOINT_ARTIFACT_REJECTED =
  Math.sign(INTERIOR.a2) === Math.sign(FULL.a2) &&
  Math.abs(INTERIOR_SHIFT_IN_FULL_SE) < 2 &&
  Math.abs(INTERIOR.tA2) > 10 &&
  LOO_ALL_SAME_SIGN &&
  LOO_MIN_ABS_T > 10 &&
  LOO_A2_SPREAD < 0.5 * Math.abs(FULL.a2);

export const IMP124806_KNEE_FLOOR_RESIDUAL_CURVATURE_ENDPOINT_ROBUSTNESS = {
  id: 'imp-124806',
  proofSection: 'S-frontier',
  question:
    'imp-124786 fit the imp-124772 F2 sign-symmetric p_knee residual U to a quadratic and found the ' +
    'curvature coefficient a2 ~ -1.79e-2 distinguishable from ZERO at t ~ -50 (not fit noise). But ' +
    'statistical significance against zero does not rule out a FLOOR-LADDER ENDPOINT ARTIFACT: a ' +
    'quadratic through a finite ladder can be dominated by its two extreme abscissae and would still ' +
    'test significant. Reusing the imp-97822 floorSweep verbatim, re-fit the quadratic after dropping ' +
    'both extreme floors (0.5x, 5x) and under a full leave-one-out jackknife, and decide whether the ' +
    'curvature is a genuine running of p_knee with floor depth or a two-endpoint weighting artifact. ' +
    'Measurement/robustness only; conditional-share curvature diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the quadratic curvature coefficient a2 of log10 N* on centered log10 E_trunc under (i) removal of ' +
    'both extreme floors (interior-8 subset) and (ii) a full leave-one-out jackknife over the ten ' +
    'imp-97822 floor factors, with the interior-vs-full shift in full-ladder SE units and the LOO a2 range',
  full: { a2: +FULL.a2.toExponential(4), seA2: +FULL.seA2.toExponential(4), tA2: +FULL.tA2.toFixed(2), a1: +FULL.a1.toFixed(5) },
  interior: {
    droppedFloors: [0.5, 5.0],
    n: INTERIOR.n,
    a2: +INTERIOR.a2.toExponential(4),
    seA2: +INTERIOR.seA2.toExponential(4),
    tA2: +INTERIOR.tA2.toFixed(2),
    shiftInFullSE: INTERIOR_SHIFT_IN_FULL_SE,
  },
  loo: {
    perFloor: LOO,
    a2Min: LOO_A2_MIN,
    a2Max: LOO_A2_MAX,
    a2Spread: LOO_A2_SPREAD,
    allSameSign: LOO_ALL_SAME_SIGN,
    minAbsT: LOO_MIN_ABS_T,
  },
  endpointArtifactRejected: ENDPOINT_ARTIFACT_REJECTED,
  finding: {
    H0_dropping_both_endpoints_does_not_collapse:
      'the interior-8 quadratic (drop 0.5x, 5x) gives a2 ~ -1.817e-2 vs full-ladder ~ -1.787e-2 -- a ' +
      'shift of only ~-0.84 full-ladder SE and, if anything, slightly MORE negative (not toward zero), ' +
      'staying highly significant at t ~ -42. An endpoint-weighting artifact would have collapsed a2 ' +
      'toward zero or flipped its sign when the two extreme floors were removed; it did neither.',
    H1_loo_is_tight_and_sign_stable:
      'across all ten leave-one-out refits a2 stays in ~[-1.888e-2, -1.693e-2] (spread ~1.9e-3, ~11% ' +
      'of |a2|), every subset the same sign as the full fit and every |t| > 40. Dropping 0.5x makes a2 ' +
      'MORE negative (-1.888e-2); dropping 5x -- the single most influential point -- only softens it ' +
      'to -1.693e-2, still ~48x its SE from zero. The endpoints carry no dominant leverage toward zero.',
    H2_verdict_genuine_running_not_artifact:
      'the curvature survives removal of both floor-ladder endpoints with a sub-SE shift and survives ' +
      'every LOO deletion with the same sign and overwhelming significance, so the imp-124772 F2 ' +
      'residual reflects a real second-order running of p_knee with E_trunc floor depth, not a ' +
      'two-endpoint weighting artifact of the 0.5x..5x ladder.',
    H3_orientation_note:
      'a2 < 0: log10 N* bends below its linear trend at the floor extremes and above it in the ' +
      'interior -- concave-DOWN in log10 N* (a hump). imp-124772 F2 labelled the residual a concave-up ' +
      'U; this is the same data with the imp-124786 orientation correction carried through.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-124772 F2 faint sign-symmetric p_knee ' +
    'residual U is a GENUINE floor-depth running of the knee exponent, NOT a floor-ladder endpoint ' +
    'artifact. The quadratic curvature coefficient a2 ~ -0.0179 is stable under removal of both ' +
    'extreme floors (interior-8 a2 ~ -0.0182, a ~-0.84 full-ladder SE shift, t ~ -42) and under a full ' +
    'leave-one-out jackknife (a2 in ~[-0.0189, -0.0169], all one sign, all |t| > 40); the two ' +
    'endpoints carry no dominant leverage toward zero. This complements imp-124786 (which ruled out ' +
    'the zero-noise null) by ruling out the endpoint-weighting null. Orientation is concave-DOWN in ' +
    'log10 N* (the imp-124786 correction to the imp-124772 concave-up U label). The component model is ' +
    'the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-124786 (fit the same a2; ruled out the zero-noise null; complemented here); imp-124772 ' +
    '(10-floor OLS p_knee fit; F2 residual U tested here); imp-97822 (two-floor knee fit; floorSweep ' +
    'reused verbatim); imp-33708 (0.5x..5x E_trunc floor sweep); imp-486 (C_mb GUE-conditional); ' +
    'imp-2631 (E_trunc = 3.06e-5 fixed-strip floor).',
};

export const IMP124806_KNEE_FLOOR_RESIDUAL_CURVATURE_ENDPOINT_ROBUSTNESS_ASSERTIONS = [
  {
    // Reuse gate: both the full and interior fits run over the imp-97822 ladder (10 and 8 floors).
    id: 'imp124806-uses-full-and-interior-ladders',
    description: 'the full fit runs over all ten imp-97822 floor factors and the interior fit over eight',
    holds: () => FULL.n === 10 && INTERIOR.n === 8,
  },
  {
    // H0: dropping both endpoints keeps a2 same-sign and shifts it less than 2 full-ladder SE.
    id: 'imp124806-interior-a2-stable-under-endpoint-drop',
    description: 'the interior-8 a2 keeps the full-ladder sign and shifts by under 2 full-ladder SE',
    holds: () =>
      Math.sign(INTERIOR.a2) === Math.sign(FULL.a2) &&
      Math.abs(INTERIOR_SHIFT_IN_FULL_SE) < 2 &&
      Math.abs(INTERIOR.tA2) > 10,
  },
  {
    // H1: the LOO jackknife is sign-stable, tight, and everywhere significant.
    id: 'imp124806-loo-sign-stable-and-tight',
    description: 'all ten LOO a2 share the full sign, min |t| > 10, and the a2 spread is under half |a2|',
    holds: () =>
      LOO_ALL_SAME_SIGN && LOO_MIN_ABS_T > 10 && LOO_A2_SPREAD < 0.5 * Math.abs(FULL.a2),
  },
  {
    // H2: the decision resolves to genuine-running (endpoint artifact rejected).
    id: 'imp124806-endpoint-artifact-rejected',
    description: 'the combined endpoint-drop and LOO evidence rejects the endpoint-artifact null',
    holds: () => ENDPOINT_ARTIFACT_REJECTED === true,
  },
  {
    // H3: orientation is concave-down (a2 < 0), inheriting the imp-124786 correction.
    id: 'imp124806-curvature-concave-down',
    description: 'the fitted quadratic coefficient is negative (concave-down hump in log10 N*)',
    holds: () => FULL.a2 < 0,
  },
  {
    // Honesty gate: measurement/robustness only, no QED, no refereed bound is changed.
    id: 'imp124806-honesty-gate-no-qed',
    description: 'Measurement only: robustness decision on the imp-124772 residual curvature, no QED, no refereed bound is changed',
    holds: () =>
      IMP124806_KNEE_FLOOR_RESIDUAL_CURVATURE_ENDPOINT_ROBUSTNESS.isRigorous === false &&
      /NO QED/.test(IMP124806_KNEE_FLOOR_RESIDUAL_CURVATURE_ENDPOINT_ROBUSTNESS.verdict) &&
      /refereed bound is changed/i.test(IMP124806_KNEE_FLOOR_RESIDUAL_CURVATURE_ENDPOINT_ROBUSTNESS.verdict),
  },
];

for (const a of IMP124806_KNEE_FLOOR_RESIDUAL_CURVATURE_ENDPOINT_ROBUSTNESS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124806-knee-floor-residual-curvature-endpoint-robustness assertion failed: ${a.id}`);
  }
}
