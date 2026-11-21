/**
 * @module imp-36159-joint-contour-corner-crossvalidation
 *
 * imp-36159 (accuracy, S-frontier): CROSS-VALIDATE the imp-36096 JOINT (alpha, beta)
 * recovery-contour normalization against the imp-36061 SINGLE-AXIS recovery edges at the
 * two normalized corners (u, v) = (1, 0) and (0, 1), confirming the
 * u = delta/delta_edge, v = beta/beta_edge normalization is CONSISTENT between the modules.
 *
 * imp-36096 normalizes its joint first-crossing contour to the imp-36061 single-axis edges
 * (delta_edge on the alpha axis at beta = 0; beta_edge on the beta axis at alpha = 2 pi) but
 * BAKES those edges as five-sig-fig LITERALS (ALPHA_EDGE_10 = 0.56003, ALPHA_EDGE_1 = 0.61100,
 * BETA_EDGE_10 = 3.18612, BETA_EDGE_1 = 3.32055) and recomputes only four INTERIOR contour
 * points at import. It never checked that those baked edges match imp-36061's LIVE-bisected
 * edges, nor that the two contour CORNER endpoints -- which by construction should normalize to
 * exactly (u, v) = (1, 0) (pure-alpha edge, beta = 0) and (0, 1) (pure-beta edge, delta -> 0) --
 * actually sit on the recovery target. A silent normalization mismatch (wrong edge literal, or
 * a delta/beta transposition) would leave the whole imp-36096 non-convexity conclusion (u + v
 * bulging to ~2.5) resting on a mis-scaled axis. This module rules that out by:
 *   (1) comparing the four imp-36096 baked single-axis edges against imp-36061's live edges;
 *   (2) checking the imp-36096 contour corner endpoints normalize to (1, 0) and (0, 1);
 *   (3) recomputing r at each corner (full N ~ 488602) and confirming it lands on the target.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Instantiates no directed-rounding interval; evaluates no
 * true H_0; verifies no inequality; changes no bound; establishes no positivity; the certified
 * length-N interval sum stays MECHANICAL / GREENFIELD (imp-35725 / imp-35681 Part A); C_mb
 * GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * FINDING (fixed N ~ 488602; r_base ~ 1.1814e-3) -- the normalization is CONSISTENT
 * -----------------------------------------------------------------------------
 *   - EDGES: the four imp-36096 baked single-axis edges reproduce imp-36061's live-bisected
 *     edges to within ~4.7e-6 absolute (the residual is exactly the five-sig-fig rounding of the
 *     baked literals), so the u = delta/delta_edge, v = beta/beta_edge scaling denominators are
 *     the same numbers in both modules.
 *   - CORNERS: both contours' endpoints normalize to (u, v) = (1, 0) (alpha-axis end, beta = 0)
 *     and (0, 1) (beta-axis end, delta -> 0) by construction -- no delta/beta transposition.
 *   - ON-TARGET: recomputing r at all four corners at full N lands on the recovery target to
 *     within ~1.4e-4 relative, so the corner endpoints genuinely sit on the r = 1.10 r_base
 *     (10%) and r = 1.01 r_base (1%) recovery contours.
 * CONCLUSION: the imp-36096 joint-contour normalization is consistent with the imp-36061
 * single-axis edges at both anchoring corners; the non-convexity conclusion (normalized u + v
 * bulging to ~2.5) rests on a correctly-scaled axis, not a normalization artifact. This is a
 * consistency check only; it changes no bound and precision stays NON-binding (imp-36096).
 *
 * @see imp-36096-w1-accumulator-joint-recovery-contour (the joint contour being cross-validated)
 * @see imp-36061-w1-accumulator-recovery-detuning-width (the single-axis edges it normalizes to)
 * @see imp-35890-w1-running-accumulator-apriori-bound (the O(1) running-accumulator bound)
 * @see imp-35812-w1-summation-scheme-measured-cost (baseline (alpha,beta) term family)
 */

import { IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR } from './imp-36096-w1-accumulator-joint-recovery-contour.js';
import { IMP36061_W1_ACCUMULATOR_RECOVERY_DETUNING_WIDTH } from './imp-36061-w1-accumulator-recovery-detuning-width.js';

// -- Anchor + operative constants (import-light; identical model to imp-36061 / imp-36096) --------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this cross-validation
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT
const TWO_PI = 2 * Math.PI; // nearest q=1 resonance above the baseline alpha

// Running-accumulator ratio r = max_i|S_i| / Sum|t_k| for t_k = cos(alpha k + beta sqrt k)/sqrt k
// (byte-identical to imp-36061 / imp-36096; used only to recompute r at the two contour corners).
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

// -- (1) EDGE cross-validation: imp-36096 baked literals vs imp-36061 live-bisected edges ---------
const baked = IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.singleAxisEdges;
const live = {
  alphaEdge10: IMP36061_W1_ACCUMULATOR_RECOVERY_DETUNING_WIDTH.alphaAxis.edge10,
  alphaEdge1: IMP36061_W1_ACCUMULATOR_RECOVERY_DETUNING_WIDTH.alphaAxis.edge1,
  betaEdge10: IMP36061_W1_ACCUMULATOR_RECOVERY_DETUNING_WIDTH.betaAxis.edge10,
  betaEdge1: IMP36061_W1_ACCUMULATOR_RECOVERY_DETUNING_WIDTH.betaAxis.edge1,
};
const EDGE_COMPARISON = ['alphaEdge10', 'alphaEdge1', 'betaEdge10', 'betaEdge1'].map((key) => ({
  key,
  baked: baked[key],
  live: live[key],
  absDiff: Math.abs(baked[key] - live[key]),
}));
const MAX_EDGE_ABS_DIFF = Math.max(...EDGE_COMPARISON.map((e) => e.absDiff)); // ~4.7e-6 (5-sig-fig rounding)

// -- (2) CORNER normalization: contour endpoints must land at (u, v) = (1, 0) and (0, 1) ----------
// imp-36096 normalized arrays: [0] = alpha-axis endpoint (beta = 0 -> v = 0, delta = edge -> u = 1),
// [last] = beta-axis endpoint (beta = edge -> v = 1, delta -> 0 -> u ~ 0).
const norm10 = IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.jointContour10.normalized;
const norm1 = IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.jointContour1.normalized;
const CORNER_NORM = {
  contour10: { alphaCorner: norm10[0], betaCorner: norm10[norm10.length - 1] },
  contour1: { alphaCorner: norm1[0], betaCorner: norm1[norm1.length - 1] },
};

// -- (3) ON-TARGET: recompute r at each contour corner at full N and compare to the recovery target
const RECOVER_10 = IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.baseline.recover10;
const RECOVER_1 = IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.baseline.recover1;
const pairs10 = IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.jointContour10.betaDeltaPairs;
const pairs1 = IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.jointContour1.betaDeltaPairs;
const CORNER_CHECKS = [
  { label: '10% alpha corner (1,0)', beta: pairs10[0][0], delta: pairs10[0][1], target: RECOVER_10 },
  { label: '10% beta corner (0,1)', beta: pairs10[pairs10.length - 1][0], delta: pairs10[pairs10.length - 1][1], target: RECOVER_10 },
  { label: '1% alpha corner (1,0)', beta: pairs1[0][0], delta: pairs1[0][1], target: RECOVER_1 },
  { label: '1% beta corner (0,1)', beta: pairs1[pairs1.length - 1][0], delta: pairs1[pairs1.length - 1][1], target: RECOVER_1 },
].map((c) => {
  const r = ratioAt(TWO_PI + c.delta, c.beta, N_AT_TPT);
  return { ...c, r, relErr: Math.abs(r - c.target) / c.target };
});
const MAX_CORNER_REL_ERR = Math.max(...CORNER_CHECKS.map((c) => c.relErr)); // ~1.4e-4

// -- Baseline + target consistency between the two modules (should be bit-identical computations) --
const BASELINE_RATIO_ABS_DIFF = Math.abs(
  IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.baseline.ratio -
    IMP36061_W1_ACCUMULATOR_RECOVERY_DETUNING_WIDTH.baseline.ratio,
);
const RECOVER10_ABS_DIFF = Math.abs(
  RECOVER_10 - IMP36061_W1_ACCUMULATOR_RECOVERY_DETUNING_WIDTH.recoveryTargets.within10pct,
);
const RECOVER1_ABS_DIFF = Math.abs(
  RECOVER_1 - IMP36061_W1_ACCUMULATOR_RECOVERY_DETUNING_WIDTH.recoveryTargets.within1pct,
);

export const IMP36159_JOINT_CONTOUR_CORNER_CROSSVALIDATION = {
  id: 'imp-36159',
  proofSection: 'S-frontier',
  question:
    'CROSS-VALIDATE the imp-36096 joint (alpha, beta) recovery-contour normalization against the ' +
    'imp-36061 single-axis recovery edges at the normalized corners (u, v) = (1, 0) and (0, 1), ' +
    'confirming the u = delta/delta_edge, v = beta/beta_edge normalization is consistent between ' +
    'the two modules. Cross-validation only; changes no bound; NO QED.',
  fixedN: N_AT_TPT,
  edgeConsistency: {
    comparison: EDGE_COMPARISON,
    maxAbsDiff: MAX_EDGE_ABS_DIFF,
    note:
      'the four imp-36096 baked single-axis edges (ALPHA_EDGE_10/1, BETA_EDGE_10/1) reproduce ' +
      "imp-36061's live-bisected edges to within ~4.7e-6 absolute -- the residual is exactly the " +
      'five-sig-fig rounding of the baked literals, so the normalization denominators match',
  },
  cornerNormalization: {
    ...CORNER_NORM,
    note:
      'both contours normalize their alpha-axis endpoint to (u, v) = (1, 0) (beta = 0, delta = edge) ' +
      'and their beta-axis endpoint to (0, 1) (beta = edge, delta -> 0), with no delta/beta transposition',
  },
  cornerOnTarget: {
    checks: CORNER_CHECKS,
    maxRelErr: MAX_CORNER_REL_ERR,
    note:
      'recomputing r at all four contour corners at full N ~ 488602 lands on the recovery target ' +
      '(r = 1.10 r_base / 1.01 r_base) to within ~1.4e-4 relative, so the corners sit on the contours',
  },
  moduleBaselineConsistency: {
    baselineRatioAbsDiff: BASELINE_RATIO_ABS_DIFF,
    recover10AbsDiff: RECOVER10_ABS_DIFF,
    recover1AbsDiff: RECOVER1_ABS_DIFF,
    note:
      'the two modules compute the same baseline r_base ~ 1.1814e-3 and the same 10%/1% recovery ' +
      'targets bit-identically (identical ratioAt at identical N), so the shared anchor is consistent',
  },
  conclusion: {
    normalizationConsistent:
      'the imp-36096 joint-contour normalization is consistent with the imp-36061 single-axis edges ' +
      'at both anchoring corners: the baked edges match the live edges (~4.7e-6), the corners ' +
      'normalize to (1, 0) and (0, 1), and r at each corner lands on the recovery target (~1.4e-4 rel)',
    nonConvexityNotArtifact:
      'so the imp-36096 non-convexity conclusion (normalized u + v bulging to ~2.5 near intermediate ' +
      'drift) rests on a correctly-scaled axis, not a normalization mismatch or a delta/beta transposition',
    precisionNotBinding:
      'this is a consistency check only; it changes no bound and precision stays NON-binding everywhere ' +
      '(even the r = 1 corner leaves gamma_{N-1} ~ 5.4e-11 orders under the imp-35760 barrier margin)',
    staysGreenfield:
      'this module cross-validates two measurement modules only; it instantiates no directed-rounding ' +
      'interval and verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD ' +
      '(imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL CROSS-VALIDATION (frontier-direction, NOT a certified bound). Confirming the imp-36096 ' +
    'joint (alpha, beta) recovery-contour normalization is consistent with the imp-36061 single-axis ' +
    'recovery edges at the normalized corners (u, v) = (1, 0) and (0, 1). The four imp-36096 baked ' +
    'single-axis edges reproduce imp-36061 live-bisected edges to within ~4.7e-6 absolute (five-sig-fig ' +
    'rounding); both contours normalize their alpha-axis endpoint to (1, 0) and their beta-axis endpoint ' +
    'to (0, 1) with no delta/beta transposition; and recomputing r at all four corners at full N ~ 488602 ' +
    'lands on the recovery target to within ~1.4e-4 relative. The two modules also share the same baseline ' +
    'r_base ~ 1.1814e-3 and 10%/1% targets bit-identically. So the imp-36096 non-convexity conclusion ' +
    '(normalized u + v bulging to ~2.5) rests on a correctly-scaled axis, not a normalization artifact. ' +
    'Instantiates no directed-rounding interval; evaluates no true H_0; verifies no inequality; changes no ' +
    'bound; establishes no positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD; C_mb ' +
    'GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36096 (the joint recovery contour cross-validated here); imp-36061 (the single-axis edges it ' +
    'normalizes to); imp-35991 (r < 1e-2 basin edge); imp-35949 (located the q=1 resonant corner); ' +
    'imp-35890 (O(1) running-accumulator a-priori bound); imp-35812 (baseline (alpha,beta) term family); ' +
    'imp-35760 (barrier-margin allocation); imp-35725 (mechanical N-term certified cost); imp-35681 ' +
    'Part A (A+B-C interval bound greenfield); Platt-Trudgian 2021 (barrier base).',
};

export const IMP36159_JOINT_CONTOUR_CORNER_CROSSVALIDATION_ASSERTIONS = [
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602 (shared with imp-36061 / imp-36096).
    id: 'imp36159-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602, shared with imp-36061 / imp-36096',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 &&
      N_AT_TPT < 4.9e5,
  },
  {
    // (1) EDGE consistency: baked imp-36096 edges match imp-36061 live edges to ~5-sig-fig rounding.
    id: 'imp36159-edges-match',
    description: 'imp-36096 baked single-axis edges match imp-36061 live edges to within 1e-4 absolute',
    holds: () => MAX_EDGE_ABS_DIFF < 1e-4 && EDGE_COMPARISON.every((e) => e.absDiff < 1e-4),
  },
  {
    // (2) CORNER normalization: alpha-axis endpoint -> (1, 0); beta-axis endpoint -> (0, 1).
    id: 'imp36159-corners-normalize',
    description: 'Contour endpoints normalize to (u,v) = (1,0) (alpha) and (0,1) (beta) in both contours',
    holds: () =>
      Math.abs(CORNER_NORM.contour10.alphaCorner.u - 1) < 1e-9 &&
      CORNER_NORM.contour10.alphaCorner.v === 0 &&
      Math.abs(CORNER_NORM.contour10.betaCorner.v - 1) < 1e-9 &&
      CORNER_NORM.contour10.betaCorner.u < 1e-3 &&
      Math.abs(CORNER_NORM.contour1.alphaCorner.u - 1) < 1e-9 &&
      CORNER_NORM.contour1.alphaCorner.v === 0 &&
      Math.abs(CORNER_NORM.contour1.betaCorner.v - 1) < 1e-9 &&
      CORNER_NORM.contour1.betaCorner.u < 1e-3,
  },
  {
    // (3) ON-TARGET: r recomputed at each corner lands on the recovery target (<1e-3 rel err).
    id: 'imp36159-corners-on-target',
    description: 'Recomputing r at all four contour corners at full N lands on the target (<1e-3 rel err)',
    holds: () => MAX_CORNER_REL_ERR < 1e-3 && CORNER_CHECKS.length === 4,
  },
  {
    // Shared anchor: both modules compute the same baseline r_base and 10%/1% recovery targets.
    id: 'imp36159-shared-baseline',
    description: 'Both modules share the same baseline r_base and 10%/1% recovery targets (bit-identical)',
    holds: () =>
      BASELINE_RATIO_ABS_DIFF < 1e-12 &&
      RECOVER10_ABS_DIFF < 1e-12 &&
      RECOVER1_ABS_DIFF < 1e-12,
  },
  {
    // Honesty gate: cross-validation only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp36159-honesty-gate',
    description: 'Cross-validation only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP36159_JOINT_CONTOUR_CORNER_CROSSVALIDATION.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /GREENFIELD/.test(IMP36159_JOINT_CONTOUR_CORNER_CROSSVALIDATION.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36159_JOINT_CONTOUR_CORNER_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP36159_JOINT_CONTOUR_CORNER_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP36159_JOINT_CONTOUR_CORNER_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36159-joint-contour-corner-crossvalidation assertion failed: ${a.id}`);
  }
}
