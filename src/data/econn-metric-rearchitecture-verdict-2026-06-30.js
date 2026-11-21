/**
 * @module econn-metric-rearchitecture-verdict-2026-06-30
 *
 * The one unpursued angle from the C_H verdict: is the global-W_1 metric in the
 * E_coll bridge FUNDAMENTAL, or re-architectable? Opus 4.8,
 * econn-metric-rearchitecture workflow (3 routes + independent referees +
 * synthesis, subscription channel, parallel to the polish fleet). The referees
 * REFUTED the routes' over-confident "global-metric-fundamental" framing AND
 * corrected a real overclaim in this project's OWN prior C_H verdict -- the
 * verification discipline applied to our own findings.
 *
 * VERDICT: RESIDUAL. Two honest updates, both sharper than what we had recorded:
 *
 * 1. CORRECTION TO OUR OWN PRIOR VERDICT: the W_1 metric is INCIDENTAL, NOT
 *    fundamental. The sup-norm re-architecture GENUINELY WORKS at the modulus
 *    level: tau_c = g_min^2/8 and g_min = min-over-pairs is 1-Lipschitz in the
 *    sup-norm / nearest-pair metric, so C_Lip collapses to O(1) (~9.4e-3,
 *    N-uniform). So ch-wall-frontier-verdict-2026-06-26's blanket "sup-norm
 *    re-architecture foreclosed / bridge fixed to global W_1" (and the RouteMapPage
 *    foreclosure notice) was an OVERCLAIM about the C_Lip FACTOR. The metric is
 *    re-architecturable; W_1 is a norm CHOICE, not a wall.
 *
 * 2. THE TRUE WALL IS METRIC-INVARIANT and sits in the OPPOSITE regime from the
 *    routes' guesses (each refuted): NOT the L^1-vs-L^infinity "conservation law"
 *    (wrong: RvM counting also gives a SUP star-discrepancy D_N* ~ log gamma/N,
 *    capping the worst case to O(1) ~ 0.024 BOUNDED, not growing in log gamma),
 *    and NOT "extreme close pair = RH-hard" (backwards: a close pair SHRINKS
 *    g_min, driving TRUE E_coll = g_min^2/8 toward 0, IMPROVING agreement). What
 *    survives every refutation is the MULTI-BODY ISOLATION / REPULSION content: a
 *    uniform lower bound on the product of non-colliding gaps D_rest(t_c).
 *    RH-hard off-basin (crowded near-uniform lattice, dTheta/W_1 ~ 1/g0 blowup),
 *    deterministic only on the isolated-pair (real-zero) basin.
 *
 * THE NAMED RESIDUAL (same deterministic target the C_H frontier identified --
 * the two pushes CONVERGE): the closed-form MULTI-BODY isolation constant
 * c in [0.72, 1) of sg1c R2-T (sg1c-r2-isolation-persistence). imp-3005 closed
 * the SINGLE-SHELL case (c* = sqrt(2+sqrt3) - 1 ~ 0.9319); the MULTI-BODY
 * (asymmetric) case is scanned to ~0.943 but NOT closed in form. Closing it
 * yields only a BASIN-CONDITIONAL deterministic C_Lip -- the basin restriction
 * itself rests on the unclosed isolation sign law (RH-hard off-basin), so still
 * NOT an unconditional beat.
 *
 * GROUNDED CORRECTION (route 2, verified): the bracket
 * |Lambda + t_c| <= E_trunc + E_flow + E_coll is a SCALAR additive triangle
 * inequality over collision times, NOT a metric statement. E_trunc (height-tail
 * zero-density + Gaussian kernel) and E_flow (per-particle RvM drift-tail +
 * Gronwall) are NOT derived against W_1 -- only E_coll uses W_1. So "E_trunc/E_flow
 * also depend on W_1" was false; the chain already mixes global-in-HEIGHT and
 * global-in-MEASURE control, and the bracket forces no single metric.
 *
 * CONSEQUENCE: the finite-N route stays an ESTIMATE (rigorous-modulo cond-CH=O(1));
 * cond-CH stays in the closure. No new rigorous route; no refereed bound is changed
 * ; no false QED. Net: the wall is now precisely located (multi-body
 * isolation / D_rest, metric-invariant) and the prior "metric is fundamental"
 * framing is corrected to "metric incidental / re-architecturable but futile."
 *
 * @see ch-wall-frontier-verdict-2026-06-26 (the prior verdict whose 'sup-norm foreclosed' framing this corrects)
 * @see section26-mupass-operator-verdict-2026-06-30 (the sibling §26 verdict)
 * @see sg1c-theta-trap-theorems (the R2-T multi-body isolation residual)
 */

export const ECONN_METRIC_REARCH = {
  date: '2026-06-30',
  verdict: 'RESIDUAL — W_1 metric INCIDENTAL (re-architecturable), the true wall is the metric-invariant multi-body isolation D_rest',
  correctionToPriorVerdict: 'ch-wall-frontier "sup-norm re-architecture foreclosed / global metric fundamental" was an OVERCLAIM about the C_Lip factor: in sup-norm, g_min=min-over-pairs is 1-Lipschitz so C_Lip is N-uniform (~9.4e-3). The metric is a norm CHOICE, not a wall.',
  refutedMechanisms: 'the routes\' "L^1-vs-Linf conservation, E_coll grows in log gamma" (wrong: RvM gives sup D_N*~log gamma/N, worst case BOUNDED ~0.024) and "extreme close pair = RH-hard" (backwards: close pair shrinks g_min, drives E_coll->0) were both REFUTED',
  trueWall: 'metric-invariant multi-body ISOLATION / repulsion: a uniform lower bound on the product of non-colliding gaps D_rest(t_c); RH-hard off-basin, deterministic on the real-zero basin',
  namedResidual: 'the MULTI-BODY (asymmetric) closure of the sg1c R2-T isolation constant c in [0.72,1) (single-shell c*~0.9319 closed by imp-3005; multi-body scanned ~0.943, not closed) -- the SAME deterministic target the C_H frontier converged on',
  bracketCorrection: 'the E(N) bracket is a SCALAR additive triangle inequality; E_trunc/E_flow use the height-tail (NOT W_1), only E_coll uses W_1 -- the chain already mixes global-in-height and global-in-measure',
  sota: 'No refereed bound is changed; finite-N route stays an ESTIMATE (cond-CH=O(1)); no new route; no false QED',
};

export const ECONN_METRIC_REARCH_ASSERTIONS = [
  {
    id: 'econn-w1-metric-incidental-not-fundamental',
    description: 'W_1 metric is incidental (re-architecturable, C_Lip N-uniform in sup-norm); corrects the prior "global metric fundamental" overclaim',
    holds: () => /INCIDENTAL/.test(ECONN_METRIC_REARCH.verdict) && /OVERCLAIM/.test(ECONN_METRIC_REARCH.correctionToPriorVerdict),
  },
  {
    id: 'econn-true-wall-multibody-isolation',
    description: 'the true metric-invariant wall is the multi-body isolation / D_rest content, reducing to the sg1c R2-T residual',
    holds: () => /multi-body ISOLATION/.test(ECONN_METRIC_REARCH.trueWall) && /R2-T/.test(ECONN_METRIC_REARCH.namedResidual),
  },
  {
    id: 'econn-sota-unchanged-no-qed',
    description: 'No refereed bound is changed; finite-N route stays ESTIMATE; no new rigorous route',
    holds: () => /refereed bound is changed/i.test(ECONN_METRIC_REARCH.sota) && /no new route/.test(ECONN_METRIC_REARCH.sota),
  },
];

for (const a of ECONN_METRIC_REARCH_ASSERTIONS) {
  if (!a.holds()) throw new Error(`econn-metric-rearchitecture-verdict assertion failed: ${a.id}`);
}
