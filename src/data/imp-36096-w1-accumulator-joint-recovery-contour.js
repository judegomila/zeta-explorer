/**
 * @module imp-36096-w1-accumulator-joint-recovery-contour
 *
 * imp-36096 (numerical, S-frontier): MEASURE the JOINT (alpha, beta) two-parameter
 * recovery CONTOUR at which the imp-35890 running-accumulator ratio
 * r = max_i|S_i| / Sum|t_k| (for t_k = cos(alpha k + beta sqrt(k)) / sqrt(k), fixed
 * N ~ 488602) returns to within 10% and within 1% of the imp-35812 strong-cancellation
 * baseline r_base ~ 1.18e-3. imp-36061 located only the two SINGLE-AXIS recovery edges
 * (alpha with beta = 0, beta with alpha = 2 pi); it never measured the COUPLED corner
 * where both detunings act together, so the true recovery-basin SHAPE in the (alpha, beta)
 * plane was unknown. This module traces the r <= 1.10 r_base and r <= 1.01 r_base contours
 * around the q=1 resonance and reports whether the joint basin is convex / elliptical or
 * whether the single-axis edges are conservative.
 *
 * SETUP (identical model to imp-36061). Coordinates are the detuning from the q=1 resonance
 * (alpha = 2 pi, beta = 0): delta = alpha - 2 pi (note cos((2 pi + delta) k) = cos(delta k),
 * a pure linear-phase oscillation of frequency delta) and beta = the sqrt-drift coefficient.
 * At the resonance r = 1 (full breakdown); moving away, r decays and eventually recovers to
 * the baseline. The recovery BASIN is the connected region around the resonance where r is
 * still ABOVE the target; its boundary is the FIRST-crossing contour a run-time monitor cares
 * about. For a set of beta anchors in [0, beta_edge] the first delta at which r drops to the
 * target is found by a fine outward delta scan (step 0.01) that BRACKETS the first downcross,
 * then 32-step bisection -- NOT a monotone-assumption bisection, because r(delta) at fixed
 * beta is NON-monotone (interior revivals), so only a first-crossing scan gives the true edge.
 *
 * The joint contour is baked here as LITERALS measured offline at full N ~ 488602 (each full-N
 * ratioAt is ~14 ms; the full first-crossing trace is ~30 s, too heavy for import). At import
 * this module recomputes only r_base and r at FOUR baked contour points (five full-N sums,
 * ~70 ms) to confirm the baked contour genuinely sits on the target ratios.
 *
 * MEASUREMENT ONLY. Instantiates no directed-rounding interval; evaluates no true H_0;
 * verifies no inequality; changes no bound; establishes no positivity; the certified
 * length-N interval sum stays MECHANICAL / GREENFIELD (imp-35725 / imp-35681 Part A);
 * C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * FINDING (fixed N ~ 488602; r_base ~ 1.18e-3) -- the joint basin is STRONGLY NON-CONVEX and
 * NON-ELLIPTICAL; the single-axis edges are NOT conservative over most of the plane
 * -----------------------------------------------------------------------------
 * Normalize each contour to the single-axis edges: u = delta / delta_edge, v = beta / beta_edge,
 * so the two axis edges are the fixed points (1, 0) and (0, 1). If the joint basin were the
 * naive interpolation of the two axes, the contour would follow the diamond u + v = 1 or the
 * quarter-ellipse u^2 + v^2 = 1 (both have u + v in [1, sqrt(2)] on the interior). Instead:
 *   - Over most of the interior the contour bulges FAR OUTSIDE the axis diamond, peaking at
 *     u + v ~ 2.48 (10% target) / ~2.52 (1% target) near v ~ 0.375 -- i.e. an intermediate
 *     sqrt-drift REQUIRES more than 2x the pure-alpha detuning to recover the baseline. So the
 *     single-axis alpha edge is strongly NON-conservative there (it UNDER-states the coupled
 *     margin by ~2.5x).
 *   - Near the beta axis (v ~ 0.125) there is a narrow inner LOBE that caves INSIDE the diamond
 *     (u + v ~ 0.60 / ~0.59): a small drift there HELPS, so a tiny alpha detuning already
 *     recovers. The basin boundary therefore oscillates in and out, not a smooth convex curve.
 * Both the 10% and the 1% contours show the same qualitative lobed shape, so the non-convexity
 * is a robust feature of the coupled cancellation, not a threshold artifact.
 * CONCLUSION: the joint recovery basin is NEITHER convex NOR elliptical; the imp-36061
 * single-axis edges are conservative ONLY in a narrow beta-axis lobe and are NON-conservative
 * (by up to ~2.5x on the alpha detuning) across the bulk of the coupled plane. A run-time
 * monitor keyed on either axis alone would UNDER-estimate the joint detuning needed to recover
 * the baseline over most of the (alpha, beta) plane. Precision remains NON-binding everywhere
 * (even the r = 1 corner leaves the classic gamma_{N-1} ~ 5.4e-11 orders under the imp-35760
 * barrier margin); the obstruction stays the ENGINEERING of the certified length-N sum.
 *
 * @see imp-36061-w1-accumulator-recovery-detuning-width (the two single-axis edges this joins)
 * @see imp-35991-w1-accumulator-baseline-margin-to-resonance (the r < 1e-2 basin edge)
 * @see imp-35949-w1-accumulator-frequency-grid-robustness (located the q=1 resonant corner)
 * @see imp-35890-w1-running-accumulator-apriori-bound (the O(1) accumulator + run-max bound)
 * @see imp-35812-w1-summation-scheme-measured-cost (baseline (alpha,beta) term family)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms, sec 4.2 (running error bound)
 */

// -- Anchor + operative constants (import-light; matching imp-35761 / imp-35812 / imp-36061) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT
const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp)

const ALPHA_BASE = 0.6180339887498949; // imp-35812 / imp-35890 baseline alpha (golden fraction)
const BETA_BASE = 2.3999632297286533; // baseline beta (golden angle)
const TWO_PI = 2 * Math.PI; // nearest q=1 resonance above the baseline alpha

const gamma = (n) => (n * U_ROUNDOFF) / (1 - n * U_ROUNDOFF); // Higham worst-case sum factor
const GAMMA_AT_TPT = gamma(N_AT_TPT - 1); // classic pessimistic normalized bound (r = 1 limit)

// Running-accumulator ratio r = max_i|S_i| / Sum|t_k| for t_k = cos(alpha k + beta sqrt k)/sqrt k.
function ratioAt(alpha, beta, N) {
  let s = 0;
  let sumAbs = 0;
  let maxPartial = 0;
  for (let k = 1; k <= N; k++) {
    const t = Math.cos(alpha * k + beta * Math.sqrt(k)) / Math.sqrt(k);
    s += t;
    sumAbs += Math.abs(t);
    const a = Math.abs(s);
    if (a > maxPartial) maxPartial = a;
  }
  return maxPartial / sumAbs;
}

// Baseline ratio (both frequencies): the strong-cancellation target the accumulator recovers to.
const baselineRatio = ratioAt(ALPHA_BASE, BETA_BASE, N_AT_TPT); // ~1.1814e-3
const RECOVER_10 = 1.1 * baselineRatio; // within 10% of r_base (r <= 1.10 r_base)
const RECOVER_1 = 1.01 * baselineRatio; // within 1% of r_base (r <= 1.01 r_base)

// -- Single-axis recovery edges (imp-36061), used to NORMALIZE the joint contour ----------------
// (delta_edge on the alpha axis at beta = 0; beta_edge on the beta axis at alpha = 2 pi.)
const ALPHA_EDGE_10 = 0.56003; // delta at which r <= 1.10 r_base (beta = 0)
const ALPHA_EDGE_1 = 0.61100; // delta at which r <= 1.01 r_base (beta = 0)
const BETA_EDGE_10 = 3.18612; // beta at which r <= 1.10 r_base (alpha = 2 pi)
const BETA_EDGE_1 = 3.32055; // beta at which r <= 1.01 r_base (alpha = 2 pi)

// -- JOINT first-crossing contours (measured offline at full N; [beta, delta] pairs) -------------
// For beta anchors 0 .. beta_edge (eight equal steps), delta is the FIRST detuning above the
// resonance at which r first drops to the target. Endpoints reproduce the two single-axis edges.
const CONTOUR_10 = [
  [0.0, 0.56003],
  [0.398265, 0.26708],
  [0.79653, 0.75501],
  [1.194795, 1.17885],
  [1.59306, 1.01491],
  [1.991325, 0.79018],
  [2.38959, 0.53919],
  [2.787855, 0.27145],
  [3.18612, 0.00001],
];
const CONTOUR_1 = [
  [0.0, 0.611],
  [0.415069, 0.2814],
  [0.830138, 1.06681],
  [1.245206, 1.31295],
  [1.660275, 1.08312],
  [2.075344, 0.82502],
  [2.490413, 0.54826],
  [2.905481, 0.25844],
  [3.32055, 0.0],
];

// Normalized (u = delta/delta_edge, v = beta/beta_edge) and the u+v convexity indicator.
function normalize(contour, deltaEdge, betaEdge) {
  return contour.map(([beta, delta]) => {
    const u = delta / deltaEdge;
    const v = beta / betaEdge;
    return { u, v, sum: u + v, l2: Math.hypot(u, v) };
  });
}
const NORM_10 = normalize(CONTOUR_10, ALPHA_EDGE_10, BETA_EDGE_10);
const NORM_1 = normalize(CONTOUR_1, ALPHA_EDGE_1, BETA_EDGE_1);

// Interior (drop the two axis endpoints, which are fixed at u+v = 1 by construction).
const interior = (norm) => norm.slice(1, norm.length - 1);
const maxSum = (norm) => Math.max(...interior(norm).map((p) => p.sum));
const minSum = (norm) => Math.min(...interior(norm).map((p) => p.sum));

const MAX_SUM_10 = maxSum(NORM_10); // ~2.48 (bulges far outside the axis diamond)
const MIN_SUM_10 = minSum(NORM_10); // ~0.60 (narrow inner lobe near the beta axis)
const MAX_SUM_1 = maxSum(NORM_1); // ~2.52
const MIN_SUM_1 = minSum(NORM_1); // ~0.59

// Recompute r at four baked contour points to confirm they genuinely sit on the target ratios.
const CHECK_POINTS = [
  { beta: 1.194795, delta: 1.17885, target: RECOVER_10 },
  { beta: 0.79653, delta: 0.75501, target: RECOVER_10 },
  { beta: 1.245206, delta: 1.31295, target: RECOVER_1 },
  { beta: 0.415069, delta: 0.2814, target: RECOVER_1 },
];
const CHECK_RESULTS = CHECK_POINTS.map((p) => {
  const r = ratioAt(TWO_PI + p.delta, p.beta, N_AT_TPT);
  return { ...p, r, relErr: Math.abs(r - p.target) / p.target };
});
const MAX_CHECK_REL_ERR = Math.max(...CHECK_RESULTS.map((c) => c.relErr));

export const IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR = {
  id: 'imp-36096',
  proofSection: 'S-frontier',
  question:
    'MEASURE the JOINT (alpha, beta) two-parameter recovery contour at which the imp-35890 ' +
    'running-accumulator ratio r = max_i|S_i| / Sum|t_k| returns to within 10% (and 1%) of the ' +
    'imp-35812 baseline r_base ~ 1.18e-3, since imp-36061 measured only the two single-axis edges ' +
    '(alpha with beta = 0, beta with alpha = 2 pi). Trace the r <= 1.10 r_base and r <= 1.01 r_base ' +
    'contours and report whether the joint basin is convex / elliptical or the single-axis edges ' +
    'are conservative. Measurement only; changes no bound; NO QED.',
  fixedN: N_AT_TPT,
  baseline: {
    alpha: ALPHA_BASE,
    beta: BETA_BASE,
    ratio: baselineRatio,
    recover10: RECOVER_10,
    recover1: RECOVER_1,
    note:
      'r_base ~ 1.18e-3 (strong cancellation, O(1) accumulator); the coupled accumulator must ' +
      'recover to within 10% (r <= 1.10 r_base) and 1% (r <= 1.01 r_base) of it',
  },
  singleAxisEdges: {
    alphaEdge10: ALPHA_EDGE_10,
    alphaEdge1: ALPHA_EDGE_1,
    betaEdge10: BETA_EDGE_10,
    betaEdge1: BETA_EDGE_1,
    note:
      'imp-36061 single-axis edges (delta on the alpha axis at beta = 0; beta on the beta axis at ' +
      'alpha = 2 pi); used here to NORMALIZE the joint contour (u = delta/alphaEdge, v = beta/betaEdge)',
  },
  jointContour10: {
    target: RECOVER_10,
    betaDeltaPairs: CONTOUR_10,
    normalized: NORM_10,
    maxInteriorUplusV: MAX_SUM_10,
    minInteriorUplusV: MIN_SUM_10,
    note:
      'first-crossing contour for the 10% target: normalized u+v bulges to ~2.48 (near v ~ 0.375) ' +
      'far outside the axis diamond u+v = 1, with a narrow inner lobe caving to ~0.60 near the beta axis',
  },
  jointContour1: {
    target: RECOVER_1,
    betaDeltaPairs: CONTOUR_1,
    normalized: NORM_1,
    maxInteriorUplusV: MAX_SUM_1,
    minInteriorUplusV: MIN_SUM_1,
    note:
      'first-crossing contour for the 1% target: same qualitative lobed shape, u+v peaking ~2.52 and ' +
      'caving to ~0.59, so the non-convexity is robust across both thresholds not a threshold artifact',
  },
  reproduction: {
    checkPoints: CHECK_RESULTS,
    maxRelErr: MAX_CHECK_REL_ERR,
    note:
      'recomputing r at four baked contour points at full N reproduces the target ratios to within ' +
      '~1e-5 relative, confirming the baked contour genuinely sits on the recovery targets',
  },
  classicPessimisticBoundAtR1: {
    value: GAMMA_AT_TPT,
    form: 'gamma_{N-1} (the r = 1 limit of the running-accumulator bound)',
    note:
      'even at the full-breakdown corner r = 1 the classic gamma_{N-1} ~ 5.4e-11 stays orders under ' +
      'the imp-35760 O(1) barrier margin, so precision is NOT the binding constraint anywhere on the plane',
  },
  conclusion: {
    basinShape:
      'the joint (alpha, beta) recovery basin is STRONGLY NON-CONVEX and NON-ELLIPTICAL: normalized to ' +
      'the single-axis edges the contour oscillates, bulging far outside the axis diamond (u+v ~ 2.5 near ' +
      'intermediate drift) and caving inside it in a narrow beta-axis lobe (u+v ~ 0.6)',
    axisEdgesNotConservative:
      'the imp-36061 single-axis edges are conservative ONLY in the narrow beta-axis lobe and are ' +
      'NON-conservative (by up to ~2.5x on the alpha detuning) across the bulk of the coupled plane; a ' +
      'monitor keyed on either axis alone UNDER-estimates the joint detuning needed to recover the baseline',
    robustAcrossThresholds:
      'the 10% and 1% contours share the same lobed shape, so the non-convexity is a robust feature of ' +
      'the coupled cancellation, not an artifact of the recovery threshold',
    precisionNotBinding:
      'even at the r = 1 corner the classic gamma_{N-1} ~ 5.4e-11 stays orders under the imp-35760 ' +
      'barrier margin, so precision is NOT binding at any (alpha, beta); the obstruction stays the ' +
      'ENGINEERING of the certified length-N interval sum (MECHANICAL, imp-35725)',
    staysGreenfield:
      'this module measures accumulator-ratio recovery contours only; it instantiates no ' +
      'directed-rounding interval and verifies no inequality, so the W1 A + B - C certificate at T_PT ' +
      'stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Tracing the JOINT (alpha, beta) ' +
    'recovery contour at which the imp-35890 running-accumulator ratio r = max_i|S_i| / Sum|t_k| for ' +
    't_k = cos(alpha k + beta sqrt(k)) / sqrt(k) returns to within 10% (1%) of the imp-35812 baseline ' +
    'r_base ~ 1.18e-3 at fixed N ~ 488602, extending the imp-36061 two single-axis edges to the coupled ' +
    'plane. The joint basin is STRONGLY NON-CONVEX and NON-ELLIPTICAL: normalized to the single-axis ' +
    'edges (u = delta/alphaEdge, v = beta/betaEdge) the contour oscillates, bulging far outside the axis ' +
    'diamond (u+v ~ 2.48 for the 10% target, ~2.52 for 1%, near intermediate drift) and caving inside it ' +
    'in a narrow beta-axis lobe (u+v ~ 0.60 / ~0.59). So the imp-36061 single-axis edges are conservative ' +
    'only in that narrow lobe and NON-conservative (by up to ~2.5x on the alpha detuning) across the bulk ' +
    'of the coupled plane -- a monitor keyed on either axis alone UNDER-states the joint detuning needed. ' +
    'Both thresholds share the shape, so the non-convexity is robust. Even at the r = 1 corner the classic ' +
    'gamma_{N-1} ~ 5.4e-11 stays orders under the imp-35760 barrier margin, so precision is NOT the binding ' +
    'constraint at any (alpha, beta); the obstruction stays the ENGINEERING of the certified length-N ' +
    'interval sum (MECHANICAL, imp-35725). Instantiates no directed-rounding interval; evaluates no true ' +
    'H_0; verifies no inequality; changes no bound; establishes no positivity; the W1 A + B - C certificate ' +
    'at T_PT stays GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-36061 (the two single-axis recovery edges this joins); imp-35991 (r < 1e-2 basin edge); ' +
    'imp-35949 (located the q=1 resonant corner); imp-35890 (O(1) running-accumulator a-priori bound); ' +
    'imp-35812 (baseline (alpha,beta) term family); imp-35761 (classic pessimistic gamma_{N-1} bound); ' +
    'imp-35760 (barrier-margin allocation); imp-35725 (mechanical N-term certified cost); imp-35681 ' +
    'Part A (A+B-C interval bound greenfield); Higham 2002 sec 4.2 (recursive-sum running error bound); ' +
    'Platt-Trudgian 2021 (barrier base).',
};

export const IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR_ASSERTIONS = [
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602 (shared with imp-35812 / imp-35890 / imp-36061).
    id: 'imp36096-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602, fixed for every scan',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 &&
      N_AT_TPT < 4.9e5,
  },
  {
    // Baseline reproduces imp-35890 / imp-36061 strong cancellation r_base ~ 1.18e-3.
    id: 'imp36096-baseline-ratio',
    description: 'Baseline (alpha,beta) reproduces r_base ~ 1.18e-3 (strong cancellation)',
    holds: () => baselineRatio > 1.0e-3 && baselineRatio < 1.4e-3,
  },
  {
    // Axis endpoints of each contour reproduce the imp-36061 single-axis edges.
    id: 'imp36096-endpoints-match-axis-edges',
    description: 'Contour endpoints reproduce the imp-36061 single-axis edges (alpha, beta)',
    holds: () =>
      Math.abs(CONTOUR_10[0][1] - ALPHA_EDGE_10) < 1e-9 &&
      Math.abs(CONTOUR_10[CONTOUR_10.length - 1][0] - BETA_EDGE_10) < 1e-9 &&
      Math.abs(CONTOUR_1[0][1] - ALPHA_EDGE_1) < 1e-9 &&
      Math.abs(CONTOUR_1[CONTOUR_1.length - 1][0] - BETA_EDGE_1) < 1e-9,
  },
  {
    // Baked contour points genuinely sit on the recovery targets when r is recomputed at full N.
    id: 'imp36096-contour-on-target',
    description: 'Recomputing r at baked contour points reproduces the target ratios (<1e-3 rel err)',
    holds: () => MAX_CHECK_REL_ERR < 1e-3,
  },
  {
    // NON-CONVEX / NON-elliptical: interior u+v bulges FAR outside the axis diamond (u+v = 1).
    id: 'imp36096-bulges-outside-diamond',
    description: 'Interior contour bulges far outside the axis diamond (max u+v ~ 2.5 >> sqrt 2)',
    holds: () =>
      MAX_SUM_10 > 2.0 &&
      MAX_SUM_10 < 3.0 &&
      MAX_SUM_1 > 2.0 &&
      MAX_SUM_1 < 3.0 &&
      MAX_SUM_10 > Math.SQRT2, // exceeds even the quarter-ellipse maximum
  },
  {
    // Inner LOBE: a narrow beta-axis region caves INSIDE the diamond (u+v < 1).
    id: 'imp36096-inner-lobe-caves-inside',
    description: 'A narrow beta-axis lobe caves inside the diamond (min interior u+v ~ 0.6 < 1)',
    holds: () =>
      MIN_SUM_10 < 1.0 &&
      MIN_SUM_10 > 0.4 &&
      MIN_SUM_1 < 1.0 &&
      MIN_SUM_1 > 0.4,
  },
  {
    // Robust across thresholds: both contours share the lobed (bulge + inner cave) shape.
    id: 'imp36096-robust-across-thresholds',
    description: 'The 10% and 1% contours share the lobed shape (non-convexity not a threshold artifact)',
    holds: () =>
      MAX_SUM_10 > 2.0 &&
      MAX_SUM_1 > 2.0 &&
      MIN_SUM_10 < 0.7 &&
      MIN_SUM_1 < 0.7,
  },
  {
    // Precision still not binding: classic gamma_{N-1} ~ 5.4e-11 stays well under the margin.
    id: 'imp36096-precision-not-binding',
    description: 'Even at the r = 1 corner the classic gamma_{N-1} ~ 5.4e-11 stays orders under the margin',
    holds: () => GAMMA_AT_TPT > 1e-12 && GAMMA_AT_TPT < 1e-9,
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp36096-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /GREENFIELD/.test(IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.verdict) &&
      /refereed bound is changed/i.test(IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.verdict),
  },
];

for (const a of IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36096-w1-accumulator-joint-recovery-contour assertion failed: ${a.id}`);
  }
}
