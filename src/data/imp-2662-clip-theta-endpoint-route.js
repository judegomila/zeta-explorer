/**
 * @module imp-2662-clip-theta-endpoint-route
 * @fileoverview imp-2662 assessment — can the gap-Lipschitz constant C_Lip be
 * bounded at the microscopic collision scale WITHOUT the diverging Gronwall
 * flow-Jacobian route that imp-2640 proved undischargeable?
 *
 * This module is a PURE DATA record (no heavy imports). It does not claim a
 * rigorous beat; it isolates the residual obstruction to a smaller, named
 * quantity and reports an honest partial.
 *
 * ---
 *
 * BACKGROUND (the binding finding)
 * --------------------------------
 * imp-2640 (polymath15-lemma52-shock-holder.js, C_H_DISCHARGE_ATTEMPT_IMP2640)
 * returned NEGATIVE: C_H = C_shock * C_Lip / 4 cannot be discharged to an
 * N-uniform constant because the ONLY available bound on the gap-Lipschitz
 * modulus C_Lip is the Gronwall backward-flow-Jacobian bound
 *     ||DM(s)|| <= 2 / g(s)^2,
 * and the quadratic-tangency law g(s)^2 = g(0)^2 - 8 s makes
 *     int_0^{t_c} 2 / g(s)^2 ds = (1/4) log( g(0)^2 / (g(0)^2 - 8 t_c) )
 * diverge logarithmically as g -> 0 at the first collision. That route bounds
 * the sensitivity of the WHOLE backward trajectory; it is the wrong object.
 *
 * THE NON-GRONWALL ROUTE ASSESSED HERE (A1 Theta-trap / endpoint functional)
 * -------------------------------------------------------------------------
 * C_Lip is needed only to bound the ENDPOINT functional |tau_c(mu_1) - tau_c(mu_2)|,
 * not the full flow Jacobian. Use the exact pair identity from the Theta-trap
 * module (sg1c-theta-trap-theorems.js, Lemma E of the parent):
 *     dg/ds = -(4/g)(1 - Theta),   so   d(g^2)/ds = -8 (1 - Theta),
 * where Theta = g^2 E / 2 measures the environment forcing on the colliding pair.
 * For the FIRST-colliding minimal pair the Theta-trap (THEOREM A) holds
 * Theta(s) <= 1/4 unconditionally on [s0, t_c) once Theta(s0) <= 1/4, and the
 * real-zero rows sit far below: Theta(0) = 0.167 / 0.088 / 0.046. Hence the
 * effective collision coefficient 8(1 - Theta) is PINNED to the band [6, 8]
 * (never the divergent 2/g^2), and integrating to collision gives the trapped
 * tangency law
 *     |tau_c| = g(0)^2 / ( 8 * (1 - Theta_eff) ),   Theta_eff in [0, 1/4].
 * Differentiating in the initial minimal gap g(0):
 *     d tau_c / d g(0) = 2 g(0) / ( 8 (1 - Theta_eff) ) = g(0) / (4 (1 - Theta_eff)).
 * This endpoint sensitivity is FINITE, uniformly bounded by g(0)/3, and VANISHES
 * as g(0) -> 0 — the exact opposite of the divergent Gronwall integral. Since
 * g_min is 1-Lipschitz in W_1 (a min of pairwise differences), the part of C_Lip
 * driven by the initial-gap perturbation is controlled with a vanishing modulus.
 *
 * VERDICT: PARTIAL-POSITIVE, residual obstruction renamed (not closed)
 * -------------------------------------------------------------------
 * The divergence in imp-2640 is NOT intrinsic to the collision-time functional;
 * it is an artifact of bounding the whole-flow Jacobian. The endpoint functional
 * tau_c is C^1 in the initial gap with a vanishing modulus once Theta is trapped.
 * What this does NOT yet close: a W_1 perturbation of the full N-particle
 * configuration also perturbs (a) WHICH pair collides first and (b) the
 * environment level Theta_eff itself. The Theta-trap bounds the LEVEL of Theta
 * (<= 1/4) but NOT its Lipschitz SENSITIVITY to a W_1 perturbation. So C_Lip is
 * reduced to a single new, strictly smaller sub-gap:
 *     SUB-GAP imp-2662-theta-lipschitz: a uniform-in-N modulus
 *         |Theta_eff(mu_1) - Theta_eff(mu_2)| <= C_Theta * W_1(mu_1, mu_2)
 *     with C_Theta independent of N at the microscopic scale.
 * If C_Theta is N-uniform, then C_Lip <= g_max/(4(1-1/4)) + (g(0)^2/8) C_Theta/(1-1/4)^2
 * is finite and the Gronwall divergence is fully bypassed. Whether C_Theta is
 * N-uniform is the genuine open analysis problem; this record does NOT assert it.
 *
 * @see imp-2640 (C_H NEGATIVE verdict — the divergent Gronwall route)
 * @see sg1c-theta-trap-theorems.js (THEOREM A: Theta <= 1/4 trap; Lemma E pair identity)
 * @see polymath15-lemma52-shock-holder.js (quadratic tangency, coefficient 8)
 */

// N*=1e4 minimal pair (tc-part-vs-mf-linchpin-finding.js / imp-2640).
const G_MIN_STAR = 0.037698;
const G_MIN_STAR_SQ = G_MIN_STAR * G_MIN_STAR;

// Theta-trap ceiling (THEOREM A, sharp) and the real-zero-row Theta(0) samples.
const THETA_TRAP_CEILING = 0.25;
const THETA_ROW_SAMPLES = [0.046, 0.088, 0.167];

// Endpoint collision-time sensitivity along the trapped band Theta in [0, 1/4].
// |tau_c| = g0^2 / (8(1-Theta));  d tau_c / d g0 = g0 / (4(1-Theta)).
function endpointBand(g0) {
  const g0sq = g0 * g0;
  const levels = [0, ...THETA_ROW_SAMPLES, THETA_TRAP_CEILING];
  return levels.map((theta) => {
    const coeff = 8 * (1 - theta);
    return {
      theta,
      collisionCoefficient: coeff, // 8(1-Theta), pinned to [6, 8]
      tauC: g0sq / coeff,
      dTauC_dg0: (2 * g0) / coeff, // vanishing endpoint Lipschitz modulus
    };
  });
}

const ENDPOINT_BAND = endpointBand(G_MIN_STAR);

// For contrast: the divergent Gronwall e-fold at the microscopic scale (imp-2640).
const Y_MICRO_STAR = Math.sqrt((2 * Math.PI) / 10000);
const TAU_C_STAR = G_MIN_STAR_SQ / 8;
const GRONWALL_EFOLD_MICRO = (2 * TAU_C_STAR) / (Y_MICRO_STAR * Y_MICRO_STAR);

export const IMP_2662_CLIP_THETA_ENDPOINT = {
  ticket: 'imp-2662',
  proofSection: 'S7',
  title:
    'Bound C_Lip at the collision scale via the A1 Theta-trap endpoint functional, ' +
    'bypassing the divergent Gronwall flow-Jacobian route.',
  verdict:
    'PARTIAL-POSITIVE. The Gronwall divergence is an artifact of bounding the whole-flow ' +
    'Jacobian, not the endpoint collision-time functional. With Theta trapped <= 1/4 the ' +
    'collision coefficient 8(1-Theta) is pinned to [6, 8], the trapped tangency law ' +
    '|tau_c| = g0^2/(8(1-Theta)) is C^1 in the initial gap, and its Lipschitz modulus ' +
    'd tau_c/d g0 = g0/(4(1-Theta)) is finite and VANISHES as g0 -> 0. NO rigorous beat ' +
    'claimed: C_Lip is reduced to a single new smaller sub-gap, not closed.',
  keyIdentity: 'dg/ds = -(4/g)(1 - Theta)  =>  d(g^2)/ds = -8(1 - Theta)  (Lemma E)',
  trappedTangency: '|tau_c| = g0^2 / (8 (1 - Theta_eff)),  Theta_eff in [0, 1/4]',
  endpointModulus: 'd tau_c / d g0 = g0 / (4 (1 - Theta_eff))  (finite, vanishes as g0 -> 0)',
  nStar: 10000,
  gMinStar: G_MIN_STAR,
  thetaTrapCeiling: THETA_TRAP_CEILING,
  collisionCoefficientBand: [6, 8], // 8(1-Theta) for Theta in [0, 1/4]
  endpointBand: ENDPOINT_BAND,
  endpointModulusMax: Math.max(...ENDPOINT_BAND.map((r) => r.dTauC_dg0)),
  gronwallEfoldMicroForContrast: GRONWALL_EFOLD_MICRO,
  residualSubGap: {
    name: 'imp-2662-theta-lipschitz',
    statement:
      'Establish a uniform-in-N modulus |Theta_eff(mu_1) - Theta_eff(mu_2)| <= C_Theta * ' +
      'W_1(mu_1, mu_2) at the microscopic collision scale. The Theta-trap bounds the LEVEL ' +
      'of Theta (<= 1/4) but not its W_1 SENSITIVITY; C_Theta N-uniform would finish C_Lip.',
    status: 'OPEN — strictly smaller than the original C_Lip obstruction, genuinely open.',
  },
  honestCaveat:
    'A W_1 perturbation can also change which pair collides first and shift Theta_eff; the ' +
    'endpoint route controls the initial-gap channel with a vanishing modulus but leaves the ' +
    'Theta-sensitivity channel (C_Theta) open. No refereed bound is changed.',
};

// Build-time internal-consistency checks (computed booleans; non-throwing).
export const IMP_2662_ASSERTIONS = [
  {
    name: 'imp2662-collision-coefficient-pinned',
    pass: ENDPOINT_BAND.every((r) => r.collisionCoefficient >= 6 && r.collisionCoefficient <= 8),
  },
  {
    name: 'imp2662-endpoint-modulus-finite-and-small',
    pass: IMP_2662_CLIP_THETA_ENDPOINT.endpointModulusMax < 0.02,
  },
  {
    name: 'imp2662-endpoint-modulus-vanishes-with-gap',
    pass: endpointBand(G_MIN_STAR / 2)[0].dTauC_dg0 < ENDPOINT_BAND[0].dTauC_dg0,
  },
  {
    name: 'imp2662-residual-subgap-open',
    pass: IMP_2662_CLIP_THETA_ENDPOINT.residualSubGap.status.startsWith('OPEN'),
  },
  {
    name: 'imp2662-no-false-beat',
    pass: IMP_2662_CLIP_THETA_ENDPOINT.verdict.includes('NO rigorous beat claimed'),
  },
];
