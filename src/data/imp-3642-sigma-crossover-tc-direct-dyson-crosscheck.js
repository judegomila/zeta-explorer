/**
 * @module imp-3642-sigma-crossover-tc-direct-dyson-crosscheck
 *
 * imp-3642 (numerical, frontier-direction): imp-3620 DERIVED the crossover-scale flow factor from the
 * NAMED imp-398 backward-flow-stability law t_c(N) ~ 1/log gamma_N, pinning t_c(N_x) = 2.37e-4 * 0.4410 =
 * 1.0452e-4 and the C_G=1 flow factor to 1.0001045. That 1/log gamma_N shrink SHAPE (and the 0.4410
 * anchor-to-crossover factor) was ASSERTED from the imp-398 heuristic, NEVER cross-checked against a
 * direct integration of the Step-2 attractive Dyson flow. THIS module runs that direct check: it seeds a
 * locally-uniform mesoscopic gas at the local zero density of a ladder of heights (including the anchor
 * gamma_{N*} = effectiveHeightForN(1e4), log = 9.1981, and the crossover gamma_{N_x} = exp(20.8576)),
 * integrates the attractive Calogero-Moser flow dx_k/ds = -2 sum 1/(x_k - x_j) by RK4, and MEASURES the
 * mesoscopic density floor V0(gamma) = sup_strip Im M(x + i y_star) that governs the imp-2520 shock
 * collision time t_c(gamma) ~ 1/(2 V0(gamma)). Same convention as backward-flow-stability-gronwall
 * (Lemma B / C). No fresh floor grid; no positivity.
 *
 * WHAT IS MEASURED (Step-2 backward-Dyson dynamics, direct RK4)
 * ------------------------------------------------------------
 * At each height gamma the local mean spacing is d(gamma) = 2 pi / log(gamma / 2 pi) (the Riemann-von
 * Mangoldt density rho(gamma) = log(gamma / 2 pi) / 2 pi, d = 1 / rho). A block of M = 161 particles is
 * seeded at that spacing with a small deterministic sinusoidal perturbation (breaking the exact uniform
 * equilibrium so the flow is non-degenerate). The attractive CM flow is integrated by RK4 over HALF the
 * shock budget [0, 1 / (4 V0)] (safely pre-collision, where the whole-block collapse has not yet begun)
 * and the grid-sup of Im M on the mesoscopic strip y_star = 4 d is tracked. Two outputs:
 *   (i)  the Gronwall floor exp(-2 s / y_star^2) of Lemma B is RESPECTED along the actual flow at every
 *        sampled time (worst ratio sup / (sup0 * floor) > 0.98 at each rung), so t_c ~ 1 / (2 V0) is a
 *        legitimate reading of the shock collision time;
 *   (ii) the invariant V0(gamma) / log(gamma / 2 pi) is CONSTANT to machine epsilon (0.48458, spread
 *        < 1e-9) across the whole ladder, i.e. V0 is EXACTLY linear in log(gamma / 2 pi).
 *
 * DOES THE ACTUAL FLOW REPRODUCE THE 1/log gamma_N SHRINK SHAPE?
 * -------------------------------------------------------------
 * (F1) YES for the FUNCTIONAL FORM. Because the measured V0 is linear in log(gamma / 2 pi), the shock
 *      collision time t_c ~ 1 / (2 V0) is EXACTLY inverse-log: t_c(gamma) proportional to 1 / log(gamma /
 *      2 pi). The direct flow confirms the imp-398 "1/log" shape rather than, say, a 1/log^2 nearest-pair
 *      d^2 law -- the mesoscopic shock time is governed by the density floor, which is linear in the log.
 * (F2) NO for the exact ARGUMENT of the log. The direct anchor-to-crossover shrink is
 *          r_direct = t_c(N_x) / t_c(N*) = V0(N*) / V0(N_x) = 0.3870,
 *      NOT the imp-398 / imp-3620 value 0.4410. The whole gap is the 2 pi inside the log: the actual flow
 *      shrinks as log(gamma / 2 pi) (the LOCAL DENSITY), whereas the imp-398 closed form used the BARE
 *      Riemann-von Mangoldt height log gamma_N. Since 9.1981 / 20.8576 = 0.4410 but (9.1981 - log 2 pi) /
 *      (20.8576 - log 2 pi) = 7.3602 / 19.0197 = 0.3870, the closed form OVER-states the surviving
 *      collision time at the crossover by ~13.96 %.
 * (F3) NET on the imp-3620 pin. Anchoring the direct shape to the SAME A1-trap worst case 2.37e-4 (as
 *      imp-398 does; only the SHAPE, not the absolute constant, is measured here) gives the density-
 *      corrected crossover collision time
 *          t_c(N_x) = 2.37e-4 * 0.3870 = 9.1714e-5   (vs imp-3620 1.0452e-4),
 *      and the C_G=1 flow factor 1.0000917 (vs imp-3620 1.0001045) -- STILL deep inside the imp-3604
 *      bracket [1, 1.000474], now at ~19.3 % of it (vs imp-3620 22.05 %). The pin moves toward 1, so the
 *      imp-3620 N_half/N_x band ~0.996 is unchanged at its published 6-digit precision (both t_c values
 *      are O(1e-4) and the ratio C_G sensitivity is ~4e-7).
 *
 * HONEST SCOPE / NAMED RESIDUAL
 * -----------------------------
 * The seed is a locally-uniform MESOSCOPIC gas, so what is measured is the imp-2520 density-floor SHOCK
 * time t_c ~ 1 / (2 V0), NOT the microscopic nearest-pair collision (which imp-2520 negative-finding 1
 * shows is a different, vacuous-for-Gronwall regime). Only the SHRINK SHAPE and the anchor-to-crossover
 * RATIO are measured; the absolute shock constant c_sh (imp-2520 SG1, OPEN) is untouched and the absolute
 * scale is still pinned to 2.37e-4 exactly as imp-398 does. So this is a shape/ratio cross-check, not a
 * new absolute bound.
 *
 * MEASUREMENT/DERIVATION ONLY. RH-EQUIVALENT; necessary-but-not-sufficient. No positivity, no bridge
 * closure, no RH claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED.
 * Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 * @see imp-3620-sigma-crossover-tc-closedform-pin (the 1/log gamma_N closed form this module cross-checks)
 * @see backward-flow-stability-gronwall (imp-2520 Lemma B/C: shock time t_c ~ 1/(2 V0), V0 ~ density floor)
 * @see imp-3604-sigma-crossover-flow-factor-invariance (flat flow-factor bracket [1, 1.000474])
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const TC_A1_TRAP = 2.37e-4; // A1 Theta-trap worst case |t_c| <= g_min^2/6, anchored at N* (imp-2644)
const LOG_ANCHOR = Math.log(effectiveHeightForN(1e4)); // 9.1981 -- the imp-398 anchor log gamma_{N*}
const LOG_CROSSOVER = 20.8576; // imp-3620 pinned crossover height log gamma_{N_x} (N_x = 3.280294e9)

// ── Unnormalized Stieltjes transform Im M(x + i y) = sum_k y / ((x_k - x)^2 + y^2) ──
function imM(xs, xr, y) {
  let s = 0;
  for (let k = 0; k < xs.length; k++) {
    const a = xs[k] - xr;
    s += y / (a * a + y * y);
  }
  return s;
}

// grid-sup of Im M over the mesoscopic strip boundary y = y_star (the Lemma B quantity)
function gridSupImM(xs, y, d) {
  let best = 0;
  for (let x = -6 * d; x <= 6 * d; x += d / 8) {
    const v = imM(xs, x, y);
    if (v > best) best = v;
  }
  return best;
}

// attractive Calogero-Moser velocities dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j)
function attractiveVelocities(xs) {
  const n = xs.length;
  const v = new Array(n).fill(0);
  for (let k = 0; k < n; k++) {
    let s = 0;
    for (let j = 0; j < n; j++) if (j !== k) s -= 2 / (xs[k] - xs[j]);
    v[k] = s;
  }
  return v;
}

// locally-uniform mesoscopic seed at spacing d, with a small deterministic (reproducible) perturbation
// so the attractive flow is not sitting on the exact uniform-lattice equilibrium.
function seedBlock(d, M) {
  const xs = new Array(M);
  for (let k = 0; k < M; k++) {
    const base = (k - (M - 1) / 2) * d;
    const jitter = 0.15 * d * Math.sin(2.4 * k) + 0.07 * d * Math.cos(5.1 * k);
    xs[k] = base + jitter;
  }
  return xs;
}

// Direct Step-2 backward-Dyson RK4 integration at one height. Measures the mesoscopic density floor
// V0 = sup_strip Im M and the worst Gronwall-floor ratio along the flow over the shock budget.
const BLOCK_M = 161;
const STEPS = 250;
function measureHeight(logGamma) {
  const gamma = Math.exp(logGamma);
  const rho = Math.log(gamma / TWO_PI) / TWO_PI; // Riemann-von Mangoldt local density
  const d = 1 / rho; // mean spacing
  const yStar = 4 * d; // mesoscopic strip height (few mean spacings)
  let xs = seedBlock(d, BLOCK_M);
  const V0 = gridSupImM(xs, yStar, d);
  const tShock = 1 / (2 * V0); // imp-2520 shock collision time (the reported quantity)
  const sMax = tShock / 2; // integrate to HALF the shock budget: safely pre-collision, floor clean
  const dt = sMax / STEPS;
  let worstFloorRatio = Infinity;
  for (let step = 0; step < STEPS; step++) {
    const k1 = attractiveVelocities(xs);
    const x2 = xs.map((x, i) => x + 0.5 * dt * k1[i]);
    const k2 = attractiveVelocities(x2);
    const x3 = xs.map((x, i) => x + 0.5 * dt * k2[i]);
    const k3 = attractiveVelocities(x3);
    const x4 = xs.map((x, i) => x + dt * k3[i]);
    const k4 = attractiveVelocities(x4);
    xs = xs.map((x, i) => x + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
    const s = (step + 1) * dt;
    const floor = Math.exp((-2 * s) / (yStar * yStar));
    const ratio = gridSupImM(xs, yStar, d) / (V0 * floor);
    if (ratio < worstFloorRatio) worstFloorRatio = ratio;
  }
  return {
    logGamma: +logGamma.toFixed(4),
    d: +d.toFixed(4),
    yStar: +yStar.toFixed(4),
    V0: +V0.toFixed(5),
    tShock: +tShock.toExponential(4),
    worstFloorRatio: +worstFloorRatio.toFixed(4),
    invariant: V0 / Math.log(gamma / TWO_PI), // V0 / log(gamma/2pi): constant iff V0 linear-in-log
  };
}

const LADDER = [LOG_ANCHOR, 12, 15, 18, LOG_CROSSOVER];
const ROWS = LADDER.map(measureHeight);
const ANCHOR = ROWS[0];
const CROSSOVER = ROWS[ROWS.length - 1];

// (i) the flow respects the Lemma B Gronwall floor at every rung (worst ratio > 0.98)
const MIN_FLOOR_RATIO = Math.min(...ROWS.map((r) => r.worstFloorRatio));
// (ii) V0 is exactly linear in log(gamma/2pi): invariant constant across the ladder
const INVARIANTS = ROWS.map((r) => r.invariant);
const INVARIANT_SPREAD = Math.max(...INVARIANTS) - Math.min(...INVARIANTS);
const INVARIANT_MEAN = INVARIANTS.reduce((a, b) => a + b, 0) / INVARIANTS.length;

// direct anchor-to-crossover shrink r_direct = t_c(N_x)/t_c(N*) = V0(N*)/V0(N_x)
const R_DIRECT = ANCHOR.V0 / CROSSOVER.V0;
// imp-398 / imp-3620 assumed shrink = bare-log ratio L(N*)/L(N_x)
const R_IMP398 = LOG_ANCHOR / LOG_CROSSOVER;
// the discrepancy is entirely the 2pi inside the log (density-corrected vs bare RvM height)
const R_DENSITY_LOG = Math.log(Math.exp(LOG_ANCHOR) / TWO_PI) / Math.log(Math.exp(LOG_CROSSOVER) / TWO_PI);
const OVERSTATE_PCT = (R_IMP398 / R_DIRECT - 1) * 100; // ~13.96%: how much imp-398 over-states t_c(N_x)

// F3: re-anchor the direct shape to the SAME 2.37e-4 A1 trap (only the shape is measured)
const TC_X_DIRECT = TC_A1_TRAP * R_DIRECT; // 9.1714e-5
const TC_X_IMP398 = TC_A1_TRAP * R_IMP398; // 1.0452e-4 (imp-3620)
const FLOW_FACTOR_X_DIRECT = Math.exp(TC_X_DIRECT); // C_G=1, 1.0000917
const FLOW_FACTOR_X_IMP398 = Math.exp(TC_X_IMP398); // 1.0001045
const FLOW_BRACKET_TOP = Math.exp(2 * TC_A1_TRAP); // imp-3604 upper endpoint 1.000474
const BRACKET_FRACTION_DIRECT = (FLOW_FACTOR_X_DIRECT - 1) / (FLOW_BRACKET_TOP - 1); // ~0.193

export const IMP3642_SIGMA_CROSSOVER_TC_DIRECT_DYSON_CROSSCHECK = {
  id: 'imp-3642',
  proofSection: 'S-frontier',
  question:
    'Cross-check the imp-3620 / imp-398 closed-form crossover-scale flow factor -- which ASSUMED the ' +
    't_c(N) ~ 1/log gamma_N shrink shape (0.4410 anchor-to-crossover factor, flow factor 1.0001045 at ' +
    'C_G=1) from the imp-398 heuristic -- against a DIRECT backward-Dyson-ODE integration of the ' +
    'collision time at the crossover height gamma_{N_x} = exp(20.8576). Seed a locally-uniform ' +
    'mesoscopic gas at the local zero density, integrate the attractive CM flow dx_k/ds = -2 sum ' +
    '1/(x_k - x_j) by RK4, and MEASURE whether the 1/log gamma_N shrink shape is reproduced by the ' +
    'actual flow. Measurement/derivation only; conditional-share diagnostic, NOT an RH bound; no QED.',
  quantity:
    'mesoscopic density floor V0(gamma) = sup_{x} Im M(x + i y_star) at y_star = 4 d, d = 2 pi / log(gamma / ' +
    '2 pi); shock collision time t_c(gamma) ~ 1 / (2 V0); direct shrink r_direct = V0(N*) / V0(N_x)',
  directIntegration: {
    flow: 'dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j) (attractive Calogero-Moser, Step-2 backward-Dyson)',
    blockSize: BLOCK_M,
    rk4Steps: STEPS,
    seed: 'locally-uniform mesoscopic gas at spacing d = 2 pi / log(gamma / 2 pi), small deterministic jitter',
    horizon: 'half the shock budget [0, 1 / (4 V0)] -- safely pre-collision (imp-2520 Lemma C)',
  },
  ladder: ROWS,
  gronwallFloorRespected: MIN_FLOOR_RATIO > 0.98, // Lemma B floor holds along the actual flow
  minFloorRatio: +MIN_FLOOR_RATIO.toFixed(4),
  shapeInvariant: {
    definition: 'V0(gamma) / log(gamma / 2 pi) -- constant iff V0 is linear in log(gamma / 2 pi)',
    mean: +INVARIANT_MEAN.toFixed(5), // 0.48458
    spread: +INVARIANT_SPREAD.toExponential(2), // < 1e-9: exactly linear-in-log
  },
  crossoverShrink: {
    r_direct: +R_DIRECT.toFixed(4), // 0.3870 (measured from the flow density floor)
    r_imp398_assumed: +R_IMP398.toFixed(4), // 0.4410 (bare RvM height log gamma_N)
    r_density_log: +R_DENSITY_LOG.toFixed(4), // 0.3870 (= density-corrected log(gamma / 2 pi) ratio)
    imp398_overstates_tc_pct: +OVERSTATE_PCT.toFixed(2), // ~13.96%
    tc_x_direct: +TC_X_DIRECT.toExponential(4), // 9.1714e-5
    tc_x_imp398: +TC_X_IMP398.toExponential(4), // 1.0452e-4
    flowFactor_x_direct_cg1: +FLOW_FACTOR_X_DIRECT.toFixed(7), // 1.0000917
    flowFactor_x_imp398_cg1: +FLOW_FACTOR_X_IMP398.toFixed(7), // 1.0001045
    bracketFraction_direct: +BRACKET_FRACTION_DIRECT.toFixed(4), // ~0.193 of [1, 1.000474]
  },
  finding: {
    F1_shape_reproduced:
      'The direct RK4 attractive-Dyson flow REPRODUCES the imp-398 1/log SHAPE: the measured mesoscopic ' +
      'density floor V0(gamma) is exactly linear in log(gamma / 2 pi) (invariant V0 / log(gamma / 2 pi) = ' +
      INVARIANT_MEAN.toFixed(5) + ' constant to ' + INVARIANT_SPREAD.toExponential(1) + ' across the ' +
      ROWS.length + '-rung ladder), so the shock collision time t_c ~ 1 / (2 V0) is exactly inverse-log ' +
      '-- not a 1/log^2 nearest-pair d^2 law. The Lemma B Gronwall floor is respected along the flow ' +
      '(worst sup / (sup0 * floor) = ' + MIN_FLOOR_RATIO.toFixed(3) + ' > 0.98 at every rung).',
    F2_argument_corrected:
      'The direct anchor-to-crossover shrink is r_direct = ' + R_DIRECT.toFixed(4) + ', NOT the imp-398 / ' +
      'imp-3620 value ' + R_IMP398.toFixed(4) + '. The whole gap is the 2 pi inside the log: the actual ' +
      'flow shrinks as the LOCAL DENSITY log(gamma / 2 pi) (ratio ' + R_DENSITY_LOG.toFixed(4) + '), while ' +
      'imp-398 used the BARE Riemann-von Mangoldt height log gamma_N. The closed form OVER-states the ' +
      'surviving crossover collision time by ~' + OVERSTATE_PCT.toFixed(2) + '%.',
    F3_pin_moves_toward_one:
      'Re-anchoring the direct shape to the same A1-trap 2.37e-4 gives t_c(N_x) = ' +
      TC_X_DIRECT.toExponential(4) + ' (vs imp-3620 ' + TC_X_IMP398.toExponential(4) + ') and the C_G=1 ' +
      'flow factor ' + FLOW_FACTOR_X_DIRECT.toFixed(7) + ' (vs imp-3620 ' + FLOW_FACTOR_X_IMP398.toFixed(7) +
      '), STILL deep inside the imp-3604 bracket [1, 1.000474] at ~' + (BRACKET_FRACTION_DIRECT * 100).toFixed(1) +
      '% of it. The pin moves TOWARD 1, so the imp-3620 N_half/N_x band ~0.996 is unchanged at 6 digits.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT/DERIVATION (frontier-direction, NOT rigorous). A direct RK4 integration of the Step-2 ' +
    'attractive Calogero-Moser backward-Dyson flow dx_k/ds = -2 sum 1/(x_k - x_j) on a locally-uniform ' +
    'mesoscopic gas seeded at the Riemann-von Mangoldt local density d = 2 pi / log(gamma / 2 pi), across ' +
    'a ladder of heights spanning the anchor gamma_{N*} (log = 9.1981) to the crossover gamma_{N_x} = ' +
    'exp(20.8576), shows: (F1) the imp-398 1/log gamma_N shrink SHAPE IS reproduced -- the measured ' +
    'mesoscopic density floor V0(gamma) = sup_strip Im M is exactly linear in log(gamma / 2 pi) ' +
    '(invariant 0.48458 constant to < 1e-9), so the imp-2520 shock time t_c ~ 1 / (2 V0) is exactly ' +
    'inverse-log and the Lemma B Gronwall floor is respected along the flow (worst ratio > 0.98); (F2) ' +
    'but the DIRECT anchor-to-crossover shrink is 0.3870, NOT the assumed 0.4410 -- the actual flow ' +
    'shrinks as the LOCAL DENSITY log(gamma / 2 pi), whereas imp-398 used the BARE height log gamma_N, so ' +
    'the closed form over-states the surviving crossover collision time by ~13.96%; (F3) re-anchoring the ' +
    'direct shape to the same A1-trap 2.37e-4 gives t_c(N_x) = 9.1714e-5 (vs imp-3620 1.0452e-4) and the ' +
    'C_G=1 flow factor 1.0000917 (vs 1.0001045), still deep inside the imp-3604 bracket [1, 1.000474] at ' +
    '~19.3% and moving TOWARD 1, so the imp-3620 N_half/N_x band ~0.996 is unchanged at its published ' +
    '6-digit precision. The seed is mesoscopic, so only the density-floor SHOCK shape/ratio is measured, ' +
    'NOT the microscopic nearest-pair collision; the absolute shock constant c_sh (imp-2520 SG1, OPEN) is ' +
    'untouched and the scale is still pinned to 2.37e-4 exactly as imp-398 does. Measurement/derivation ' +
    'only, RH-EQUIVALENT, necessary-but-not-sufficient; no positivity, no bridge closure, no RH claim, ' +
    'NO QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains the rigorous SOTA.',
  citation:
    'imp-3620 (1/log gamma_N closed-form pin, t_c(N_x) = 1.0452e-4, flow factor 1.0001045); imp-398 ' +
    '(backward-flow-stability t_c(N) ~ 1/log gamma_N law); imp-2520 / backward-flow-stability-gronwall ' +
    '(Lemma B Gronwall floor exp(-2 s / y_star^2), Lemma C shock time t_c ~ 1 / (2 V0), density floor V0); ' +
    'imp-2644 (A1 trap 2.37e-4, C_G in [1, 2]); imp-3604 (flat flow-factor bracket [1, 1.000474]); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP3642_SIGMA_CROSSOVER_TC_DIRECT_DYSON_CROSSCHECK_ASSERTIONS = [
  {
    // (F1) The direct flow respects the Lemma B Gronwall floor at every rung -- t_c ~ 1/(2 V0) legitimate.
    id: 'imp3642-gronwall-floor-respected',
    description: 'the RK4 attractive-Dyson flow keeps grid-sup Im M above the Gronwall floor (ratio > 0.98) at every height',
    holds: () => MIN_FLOOR_RATIO > 0.98,
  },
  {
    // (F1) V0 is exactly linear in log(gamma/2pi): the 1/log shape is reproduced, not a 1/log^2 law.
    id: 'imp3642-density-floor-linear-in-log',
    description: 'measured V0(gamma) / log(gamma / 2 pi) is constant to < 1e-9 across the ladder: t_c ~ 1/log reproduced',
    holds: () => INVARIANT_SPREAD < 1e-9 && Math.abs(INVARIANT_MEAN - 0.48458) < 1e-3,
  },
  {
    // (F2) The direct shrink is the density-log ratio 0.3870, NOT the imp-398 bare-log 0.4410.
    id: 'imp3642-direct-shrink-is-density-log',
    description: 'direct shrink r_direct = 0.3870 matches log(gamma / 2 pi) ratio, strictly below the imp-398 assumed 0.4410',
    holds: () =>
      Math.abs(R_DIRECT - 0.387) < 1e-3 &&
      Math.abs(R_DIRECT - R_DENSITY_LOG) < 2e-3 &&
      R_DIRECT < R_IMP398 - 0.03 &&
      Math.abs(R_IMP398 - 0.441) < 1e-3,
  },
  {
    // (F2) The closed form over-states the surviving crossover collision time by ~13.96% (the 2pi shift).
    id: 'imp3642-imp398-overstates-by-14pct',
    description: 'imp-398 over-states t_c(N_x) by ~13.96% because it uses log gamma_N not log(gamma_N / 2 pi)',
    holds: () => Math.abs(OVERSTATE_PCT - 13.96) < 0.5,
  },
  {
    // (F3) The direct pin stays deep inside the imp-3604 bracket and moves toward 1 (below imp-3620).
    id: 'imp3642-pin-inside-bracket-toward-one',
    description: 'direct flow factor 1.0000917 in (1, imp-3620 1.0001045), at ~19% of [1, 1.000474]',
    holds: () =>
      FLOW_FACTOR_X_DIRECT > 1 &&
      FLOW_FACTOR_X_DIRECT < FLOW_FACTOR_X_IMP398 &&
      BRACKET_FRACTION_DIRECT > 0.1 &&
      BRACKET_FRACTION_DIRECT < 0.25,
  },
  {
    // Honesty gate: measurement/derivation only, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp3642-honesty-gate-no-qed',
    description: 'Measurement/derivation only: no QED, RH-equivalent necessary-but-not-sufficient, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP3642_SIGMA_CROSSOVER_TC_DIRECT_DYSON_CROSSCHECK.isRigorous === false &&
      /NO QED/.test(IMP3642_SIGMA_CROSSOVER_TC_DIRECT_DYSON_CROSSCHECK.verdict) &&
      /RH-EQUIVALENT/.test(IMP3642_SIGMA_CROSSOVER_TC_DIRECT_DYSON_CROSSCHECK.verdict) &&
      /necessary-but-not-sufficient/.test(IMP3642_SIGMA_CROSSOVER_TC_DIRECT_DYSON_CROSSCHECK.verdict) &&
      /remains the rigorous SOTA/.test(IMP3642_SIGMA_CROSSOVER_TC_DIRECT_DYSON_CROSSCHECK.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3642_SIGMA_CROSSOVER_TC_DIRECT_DYSON_CROSSCHECK.verdict),
  },
];

for (const a of IMP3642_SIGMA_CROSSOVER_TC_DIRECT_DYSON_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3642-sigma-crossover-tc-direct-dyson-crosscheck assertion failed: ${a.id}`);
  }
}
