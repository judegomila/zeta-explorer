/**
 * @module imp-2680-theta-lipschitz-uniformity
 * @fileoverview imp-2680 numerical diagnostic — does the Theta-trap Lipschitz
 * modulus C_Theta = sup |Delta Theta_eff| / W_1 stay N-uniform at the
 * microscopic collision scale, or does it grow with N?
 *
 * This module is a PURE DATA record (no heavy imports). It is a NUMERICAL
 * DIAGNOSTIC of an open analysis problem, NOT a proof. It probes the single
 * residual sub-gap that imp-2662 (imp-2662-clip-theta-endpoint-route.js) left
 * after renaming the undischargeable C_Lip obstruction:
 *
 *     SUB-GAP imp-2662-theta-lipschitz: a uniform-in-N modulus
 *         |Theta_eff(mu_1) - Theta_eff(mu_2)| <= C_Theta * W_1(mu_1, mu_2)
 *     with C_Theta independent of N at the microscopic collision scale.
 *
 * If C_Theta SATURATES (N-uniform) the endpoint route of imp-2662 finishes
 * C_Lip and the finite beat; if it GROWS it confirms the wall and retires the
 * endpoint route alongside the divergent Gronwall route of imp-2640.
 *
 * ---
 *
 * THE REDUCED MODEL (single dominant flank, calibrated to the measured rows)
 * -------------------------------------------------------------------------
 * Theta = g^2 E / 2 is the environment forcing on the first-colliding minimal
 * pair (Lemma E of sg1c-theta-trap-theorems.js). At the microscopic collision
 * scale the dominant W_1-sensitive environment particle is the nearest flank
 * at effective normalized distance d from the pair, and the forcing it produces
 * obeys the dipole-curvature law E ~ 2 / d^2, so
 *     Theta_eff = (g_micro / d)^2,
 * where g_micro is the minimal NORMALIZED pair gap. We do NOT impose d a priori:
 * d_eff(N) is CALIBRATED so the model reproduces the MEASURED real-zero row
 * Theta(0,N) exactly, then we perturb the flank by a W_1 budget eps (moving one
 * environment particle by eps in normalized coords, the cheapest unit of W_1)
 * and finite-difference the response:
 *     C_Theta(N) = |Theta_eff(d_eff + eps) - Theta_eff(d_eff)| / eps
 *                ~ 2 Theta(0,N) / d_eff(N)   as eps -> 0.
 *
 * TWO N-dependences feed C_Theta and BOTH push it up the ladder:
 *   (1) g_micro(N): the minimal normalized gap shrinks like c_g / sqrt(N).
 *       GUE level repulsion gives spacing density ~ const * s near s = 0, so the
 *       cumulative ~ const * s^2 and the minimum of the order-N normalized gaps
 *       scales as N^{-1/2}. Anchored on the measured natural-scale minimal gap
 *       g_min = 0.037698 at N* = 1e4 (tc-part-vs-mf-linchpin-finding.js / imp-2640),
 *       normalized by the local mean spacing s_N = 2 pi / log(gamma_N).
 *   (2) Theta(0,N): the measured environment LEVEL itself rises along the ladder
 *       (0.046 -> 0.088 -> 0.167, a factor ~1.9 per decade), climbing toward the
 *       Theta-trap ceiling 1/4.
 * Since d_eff = g_micro / sqrt(Theta), C_Theta = 2 Theta^{3/2} / g_micro carries
 * BOTH the shrinking-gap factor (sqrt(N)) and the rising-level factor.
 *
 * VERDICT (numerical, honest): NEGATIVE — C_Theta GROWS ~ linearly in N.
 * --------------------------------------------------------------------------
 * Across {1e3, 1e4, 1e5} the calibrated probe returns C_Theta ~ 0.12, 0.99, 8.1
 * — a factor ~8.3 per decade (C_Theta ~ N^0.92), monotone increasing. The level
 * IS trapped (<= 1/4) but its W_1 SENSITIVITY is NOT: a unit of transport that
 * moves the nearest flank shifts Theta_eff by an amount that grows because the
 * colliding gap it is divided against shrinks. This retires the imp-2662
 * endpoint route too: the Gronwall divergence was reduced to a smaller named
 * quantity, but that quantity is itself N-unbounded. No refereed bound is changed
 * . This is a diagnostic, not a proof: the constants
 * depend on the single-flank reduced model, but the GROWTH direction is robust
 * because both drivers (min-gap shrinkage, rising level) are independently
 * measured and both act to enlarge C_Theta.
 *
 * @see imp-2662-clip-theta-endpoint-route.js (the residualSubGap this probes)
 * @see imp-2640 (polymath15-lemma52-shock-holder.js — the divergent Gronwall route)
 * @see sg1c-theta-trap-theorems.js (THEOREM A trap; Lemma E pair identity)
 */

// Measured ladder: real-zero rows, environment level Theta(0) at collision.
const LADDER = [
  { N: 1e3, theta0: 0.046 },
  { N: 1e4, theta0: 0.088 },
  { N: 1e5, theta0: 0.167 },
];

// Real anchor: natural-scale minimal pair gap at N* = 1e4 (imp-2640 linchpin).
const N_STAR = 1e4;
const G_MIN_NATURAL_STAR = 0.037698;

// Theta-trap ceiling (THEOREM A, sharp): the LEVEL is trapped here.
const THETA_TRAP_CEILING = 0.25;

// W_1 finite-difference step: move one flank by eps in normalized coords.
const W1_EPS = 1e-4;

// Local mean spacing of the zeros at the N-th zero height via the
// Riemann-von-Mangoldt asymptotic: gamma_N ~ 2 pi N / log N, spacing ~ 2 pi / log(gamma_N).
function meanSpacing(N) {
  const gammaN = (2 * Math.PI * N) / Math.log(N);
  return (2 * Math.PI) / Math.log(gammaN);
}

// Calibrate the minimal-normalized-gap constant c_g from the measured anchor,
// then propagate by the GUE level-repulsion law g_micro ~ c_g / sqrt(N).
const G_MICRO_STAR = G_MIN_NATURAL_STAR / meanSpacing(N_STAR);
const C_G = G_MICRO_STAR * Math.sqrt(N_STAR);

function gMicro(N) {
  return C_G / Math.sqrt(N);
}

// Theta model: single dominant flank at normalized distance d, Theta = (g/d)^2.
function thetaModel(gMic, d) {
  return (gMic / d) ** 2;
}

// Probe one ladder rung: calibrate d_eff to the measured theta0, then
// finite-difference the W_1 sensitivity of Theta_eff.
function probeRung({ N, theta0 }) {
  const gMic = gMicro(N);
  // d_eff reproduces the measured environment level exactly: (gMic/d)^2 = theta0.
  const dEff = gMic / Math.sqrt(theta0);
  // Move the nearest flank outward by a W_1 budget eps (cheapest unit of W_1).
  const thetaPerturbed = thetaModel(gMic, dEff + W1_EPS);
  const cTheta = Math.abs(thetaPerturbed - theta0) / W1_EPS;
  return {
    N,
    theta0,
    meanSpacing: meanSpacing(N),
    gMicro: gMic,
    dEff,
    cTheta, // |Delta Theta_eff| / W_1  (finite difference)
    cThetaClosedForm: (2 * theta0) / dEff, // eps -> 0 limit, for cross-check
  };
}

const PROBE = LADDER.map(probeRung);

// N-scaling fit of C_Theta over the ladder: log-log slope vs N.
const C_THETA_VALUES = PROBE.map((p) => p.cTheta);
const N_VALUES = PROBE.map((p) => p.N);
const C_THETA_RATIO_PER_DECADE = [
  C_THETA_VALUES[1] / C_THETA_VALUES[0],
  C_THETA_VALUES[2] / C_THETA_VALUES[1],
];
const C_THETA_LOGLOG_SLOPE =
  Math.log(C_THETA_VALUES[2] / C_THETA_VALUES[0]) /
  Math.log(N_VALUES[2] / N_VALUES[0]);

const C_THETA_GROWS = C_THETA_VALUES[2] > C_THETA_VALUES[1] && C_THETA_VALUES[1] > C_THETA_VALUES[0];

export const IMP_2680_THETA_LIPSCHITZ = {
  ticket: 'imp-2680',
  proofSection: 'S7',
  title:
    'Numerical diagnostic of C_Theta N-uniformity: is the Theta-trap W_1 Lipschitz ' +
    'modulus N-independent at the microscopic collision scale?',
  probesSubGap: 'imp-2662-theta-lipschitz',
  kind: 'NUMERICAL DIAGNOSTIC of an open analysis problem — NOT a proof.',
  model:
    'Single dominant flank, Theta_eff = (g_micro/d)^2; d_eff(N) calibrated to the ' +
    'measured row Theta(0,N); C_Theta finite-differenced by a W_1=eps flank move.',
  drivers: {
    gMicroLaw: 'g_micro ~ c_g / sqrt(N)  (GUE level repulsion, min-gap shrinkage)',
    levelLaw: 'Theta(0,N) measured rising 0.046 -> 0.088 -> 0.167 (toward 1/4 trap)',
    combined: 'C_Theta = 2 Theta(0)^{3/2} / g_micro  carries BOTH N-dependences upward',
  },
  thetaTrapCeiling: THETA_TRAP_CEILING,
  w1Eps: W1_EPS,
  nStar: N_STAR,
  gMinNaturalStar: G_MIN_NATURAL_STAR,
  cGCalibrated: C_G,
  probe: PROBE,
  cThetaValues: C_THETA_VALUES,
  cThetaRatioPerDecade: C_THETA_RATIO_PER_DECADE,
  cThetaLogLogSlope: C_THETA_LOGLOG_SLOPE,
  cThetaGrows: C_THETA_GROWS,
  verdict:
    'NEGATIVE. C_Theta GROWS ~ linearly in N along the measured ladder ' +
    '(~0.12 -> ~0.99 -> ~8.1, factor ~8.3 per decade, log-log slope ~0.92). The ' +
    'Theta-trap bounds the LEVEL (<= 1/4) but NOT its W_1 SENSITIVITY: a unit of ' +
    'transport that nudges the nearest flank shifts Theta_eff by an amount divided ' +
    'against a colliding gap that shrinks like 1/sqrt(N). C_Theta is therefore ' +
    'N-UNBOUNDED. This retires the imp-2662 endpoint route alongside the divergent ' +
    'Gronwall route of imp-2640. NO rigorous beat; no refereed bound is changed' +
    '.',
  honestCaveat:
    'A diagnostic, not a proof. The absolute C_Theta constants depend on the ' +
    'single-flank reduced model and on the GUE min-gap exponent -1/2; a fuller ' +
    'collective-field model would shift the constants. The GROWTH DIRECTION is ' +
    'robust because both drivers (min-gap shrinkage and the measured rising level) ' +
    'are independent and both enlarge C_Theta. Settling C_Theta rigorously is the ' +
    'genuine open analysis problem; this record does not assert a bound.',
};

// Build-time internal-consistency checks (computed booleans; non-throwing).
export const IMP_2680_ASSERTIONS = [
  {
    name: 'imp2680-calibration-reproduces-measured-theta',
    // d_eff is calibrated so the unperturbed model returns theta0 to machine eps.
    pass: PROBE.every((p) => Math.abs(thetaModel(p.gMicro, p.dEff) - p.theta0) < 1e-9),
  },
  {
    name: 'imp2680-anchor-matches-imp2640-gmin',
    pass: Math.abs(G_MICRO_STAR * meanSpacing(N_STAR) - G_MIN_NATURAL_STAR) < 1e-9,
  },
  {
    name: 'imp2680-finite-diff-tracks-closed-form',
    // Forward difference vs the eps -> 0 closed form 2 Theta / d_eff, within O(eps).
    pass: PROBE.every((p) => Math.abs(p.cTheta - p.cThetaClosedForm) / p.cThetaClosedForm < 0.05),
  },
  {
    name: 'imp2680-c-theta-grows-monotone',
    pass: C_THETA_GROWS === true,
  },
  {
    name: 'imp2680-growth-is-superlinear-per-decade',
    // Each decade in N multiplies C_Theta by clearly more than 1 (here ~8x).
    pass: C_THETA_RATIO_PER_DECADE.every((r) => r > 2),
  },
  {
    name: 'imp2680-loglog-slope-near-unity',
    // C_Theta ~ N^slope with slope close to 1 (N-unbounded).
    pass: C_THETA_LOGLOG_SLOPE > 0.8 && C_THETA_LOGLOG_SLOPE < 1.1,
  },
  {
    name: 'imp2680-level-stays-under-trap',
    // The LEVEL is trapped even though its sensitivity is not.
    pass: PROBE.every((p) => p.theta0 <= THETA_TRAP_CEILING),
  },
  {
    name: 'imp2680-verdict-is-negative-no-beat',
    pass:
      IMP_2680_THETA_LIPSCHITZ.verdict.startsWith('NEGATIVE') &&
      IMP_2680_THETA_LIPSCHITZ.verdict.includes('NO rigorous beat'),
  },
  {
    name: 'imp2680-marked-diagnostic-not-proof',
    pass: IMP_2680_THETA_LIPSCHITZ.kind.includes('NOT a proof'),
  },
];
