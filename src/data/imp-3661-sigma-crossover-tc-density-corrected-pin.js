/**
 * @module imp-3661-sigma-crossover-tc-density-corrected-pin
 *
 * imp-3661 (numerical, frontier-direction): imp-3642 ran a DIRECT RK4 integration of the Step-2
 * attractive Calogero-Moser backward-Dyson flow and found the imp-398/imp-3620 closed-form collision
 * time t_c(N) uses the BARE Riemann-von Mangoldt height log gamma_N, whereas the actual mesoscopic shock
 * time scales with the LOCAL DENSITY log(gamma / 2 pi). Since the crossover shrink is
 * (9.1981 - log 2 pi)/(20.8576 - log 2 pi) = 0.3870, NOT the bare-log 9.1981/20.8576 = 0.4410, the
 * closed form OVER-states the surviving crossover collision time by ~13.96%. imp-3642 measured the
 * corrected pin (t_c(N_x) = 9.1714e-5, flow factor 1.0000917 at C_G=1, ~19.3% bracket occupancy) but
 * NEVER propagated it back into the imp-3620 per-floor closed-form pin or the imp-3604 flat bracket
 * occupancy. THIS module does exactly that: it re-derives the imp-3620 t_c(N) closed form with the
 * density-corrected log(gamma / 2 pi) argument, re-root-solves BOTH crossings on the same imp-3443
 * half-to-double floor grid, and MEASURES whether the imp-3620 N_half/N_x ~0.996 band shifts at its
 * published 6-digit precision. Same sub-terms as imp-3580/imp-3604/imp-3620; no fresh floor grid.
 *
 * THE DENSITY-CORRECTED CLOSED FORM (log(gamma / 2 pi) vs bare log gamma_N)
 * ------------------------------------------------------------------------
 * imp-3620 pinned the worst case at the N* = 1e4 anchor and carried the 1/log gamma_N shape:
 *     t_c(N) = 2.37e-4 * log(gamma_{N*}) / log(gamma_N)          [imp-3620, BARE log]
 * imp-3642 showed the actual flow shrinks as the LOCAL density d(gamma) = 2 pi / log(gamma / 2 pi), so
 * the density-corrected form replaces both logs by their density arguments:
 *     t_c(N) = 2.37e-4 * log(gamma_{N*} / 2 pi) / log(gamma_N / 2 pi)   [imp-3661, DENSITY-corrected]
 * The Gronwall flow factor is exp(C_G * t_c(N)) with the admissible C_G in [1, 2] (imp-2644), exactly
 * as in imp-3620.
 *
 * (A) THE CROSSOVER-SCALE PIN MOVES TOWARD 1 (13.96% lower t_c, ~19.3% bracket occupancy)
 * -------------------------------------------------------------------------------------
 * At the baseline crossover N_x = 3.280294e9 the density log ratio is
 *     (9.1981 - log 2 pi)/(20.8576 - log 2 pi) = 7.3603 / 19.0197 = 0.3870,
 * so t_c(N_x) = 2.37e-4 * 0.3870 = 9.1714e-5 (vs imp-3620 1.0452e-4), and the C_G=1 flow factor is
 *     exp(9.1714e-5) = 1.0000917   (vs imp-3620 1.0001045),
 * landing at ~19.3% of the imp-3604 bracket [1, 1.000474] (vs imp-3620 22.05%). The density correction
 * moves the pin TOWARD 1, so imp-3604 is even MORE pessimistic at its upper endpoint than imp-3620 found.
 *
 * (B) THE N_half / N_x BAND IS UNCHANGED AT 6-DIGIT PRECISION (< 1e-7 shift)
 * ------------------------------------------------------------------------
 * N_x is flow-free by construction (E_coll = E_trunc), so it is identical to imp-3580/imp-3604/imp-3620.
 * N_half sees E_flow, but the density correction only shrinks the already-tiny flow factor by ~1.28e-5
 * relative, and E_flow(N_x) is ~0.1%..0.3% of E_trunc, so re-root-solving with the density-corrected
 * closed form shifts each N_half/N_x ratio by only ~3e-8 .. 9e-8 -- far below the 6-digit precision.
 * The per-floor pinned ratios (C_G=1) are UNCHANGED to every published digit:
 *   f=0.5  0.997717   f=0.75  0.996836   f=1.0  0.996019   f=1.5  0.994514   f=2.0  0.993128
 * The f=1 node still reproduces imp-3580/imp-3604/imp-3620 (0.996019, N_x = 3.280294e9), and the band
 * stays [0.99313, 0.99772] ~ 0.996.
 *
 * (C) NET FINDING
 * ---------------
 *   (F1) The density-corrected closed form t_c(N) = 2.37e-4 * L2pi(N*)/L2pi(N) pins the crossover-scale
 *        flow factor to 1.0000917 (C_G=1), at ~19.3% of the imp-3604 bracket -- BELOW the imp-3620
 *        bare-log pin 1.0001045 (22.05%), confirming the imp-3642 F2/F3 propagation.
 *   (F2) The imp-3620 N_half/N_x ~0.996 band is UNCHANGED at published 6-digit precision (max ratio
 *        shift ~9e-8 across the grid); the crossover pin is even more robustly interior than imp-3620.
 *   (F3) The bare-log imp-3620 pin OVER-states the crossover collision time by ~13.96% (the 2 pi inside
 *        the log); the density-corrected pin is the physically-measured value from the imp-3642 flow.
 *
 * DERIVATION / MEASUREMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. No refereed bound is changed.
 *
 * @see imp-3642-sigma-crossover-tc-direct-dyson-crosscheck (direct-flow density correction this propagates)
 * @see imp-3620-sigma-crossover-tc-closedform-pin (bare-log closed-form pin this density-corrects)
 * @see imp-3604-sigma-crossover-flow-factor-invariance (flat flow-factor bracket [1, 1.000474])
 * @see imp-3580-sigma-crossover-floor-invariance (frozen-Gronwall floor grid; ratio 0.996019)
 * @see imp-2644-eflow-gronwall-cg-discharge (A1 trap |t_c| <= g_min^2/6 = 2.37e-4, C_G in [1,2])
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3556)
const TC_A1_TRAP = 2.37e-4; // A1 Theta-trap worst case |t_c| <= g_min^2/6 (imp-2635/imp-2644)
const N_ANCHOR = 1e4; // scale where g_min (hence the 2.37e-4 worst case) is measured (imp-3604 comment)
const L_ANCHOR_BARE = Math.log(effectiveHeightForN(N_ANCHOR)); // bare log gamma_{N*} (imp-3620)
const L_ANCHOR_DENSITY = Math.log(effectiveHeightForN(N_ANCHOR) / TWO_PI); // log(gamma_{N*} / 2 pi)

// imp-3620 BARE-log closed form (for side-by-side comparison) and the imp-3661 DENSITY-corrected form.
// imp-3642 showed the actual mesoscopic shock time scales with the local density log(gamma/2pi).
function collisionTimeBare(N) {
  return TC_A1_TRAP * (L_ANCHOR_BARE / Math.log(effectiveHeightForN(N)));
}
function collisionTimeDensity(N) {
  return TC_A1_TRAP * (L_ANCHOR_DENSITY / Math.log(effectiveHeightForN(N) / TWO_PI));
}
function flowFactor(tc, cG) {
  return Math.exp(cG * tc);
}

// EXACT imp-3406/imp-3556/imp-3580/imp-3604/imp-3620 sub-terms; only the flow factor argument differs.
function parts(N, eTrunc, gronwall) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor (N-dependent)
  const E_flow = C_F * (L / T0) * gronwall;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = eTrunc + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Right-arm interior maximum (ternary in ln N; same bracket as imp-3406/imp-3580/imp-3604/imp-3620).
function argmaxSigmaLnN(loN, hiN, eTrunc, tcFn, cG) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    const g1 = flowFactor(tcFn(Math.exp(m1)), cG);
    const g2 = flowFactor(tcFn(Math.exp(m2)), cG);
    if (parts(Math.exp(m1), eTrunc, g1).sigma < parts(Math.exp(m2), eTrunc, g2).sigma) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

// N_half: post-peak crossing where sigma first drops below 1/2 (400-iter bisection in ln N).
function crossHalf(eTrunc, tcFn, cG) {
  const nMax = argmaxSigmaLnN(1e4, 1e9, eTrunc, tcFn, cG);
  let a = Math.log(nMax);
  let b = Math.log(1e60);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    const g = flowFactor(tcFn(Math.exp(m)), cG);
    if (parts(Math.exp(m), eTrunc, g).sigma > 0.5) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// N_x: the imp-3444 crossover where E_coll(N) = E_trunc -- flow-factor-free by construction.
function crossCollEqTrunc(eTrunc) {
  let a = Math.log(1e6);
  let b = Math.log(1e15);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), eTrunc, 1).E_coll > eTrunc) a = m; // E_coll independent of the flow factor
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

const FACTORS = [0.5, 0.75, 1.0, 1.5, 2.0];
const FLOW_BRACKET_TOP = Math.exp(2 * TC_A1_TRAP); // imp-3604 upper endpoint 1.000474

// Per floor: N_x once (flow-free), the density-corrected crossover-scale flow factor and pinned N_half
// ratio, and the imp-3620 bare-log values side by side. The ratio shift measures the propagation impact.
const GRID = FACTORS.map((f) => {
  const eTrunc = f * E_TRUNC_BASE;
  const N_x = crossCollEqTrunc(eTrunc);
  const tc_x_density = collisionTimeDensity(N_x);
  const tc_x_bare = collisionTimeBare(N_x);
  const ff_x_density_cg1 = flowFactor(tc_x_density, 1);
  const ff_x_density_cg2 = flowFactor(tc_x_density, 2);
  const ff_x_bare_cg1 = flowFactor(tc_x_bare, 1);
  const ratio_density = crossHalf(eTrunc, collisionTimeDensity, 1) / N_x;
  const ratio_bare = crossHalf(eTrunc, collisionTimeBare, 1) / N_x;
  return {
    factor: f,
    E_trunc: +eTrunc.toExponential(4),
    N_x: +N_x.toExponential(6), // identical to imp-3580/imp-3604/imp-3620 (flow-free)
    tc_x_density: +tc_x_density.toExponential(4), // density-corrected collision time at the crossover
    tc_x_bare: +tc_x_bare.toExponential(4), // imp-3620 bare-log collision time
    flowFactor_x_density_cg1: +ff_x_density_cg1.toFixed(7), // density-corrected pinned factor, C_G=1
    flowFactor_x_density_cg2: +ff_x_density_cg2.toFixed(7), // density-corrected pinned factor, C_G=2
    flowFactor_x_bare_cg1: +ff_x_bare_cg1.toFixed(7), // imp-3620 bare-log factor, C_G=1
    bracketFraction_density_cg1: +((ff_x_density_cg1 - 1) / (FLOW_BRACKET_TOP - 1)).toFixed(4), // ~0.1935
    bracketFraction_bare_cg1: +((ff_x_bare_cg1 - 1) / (FLOW_BRACKET_TOP - 1)).toFixed(4), // 0.2205 (imp-3620)
    ratio_density: +ratio_density.toFixed(6), // density-corrected pinned N_half/N_x
    ratio_bare: +ratio_bare.toFixed(6), // imp-3620 bare-log pinned N_half/N_x
    ratio_shift: +Math.abs(ratio_density - ratio_bare).toExponential(2), // < 1e-7: band unchanged at 6 digits
    overstate_pct: +((tc_x_bare / tc_x_density - 1) * 100).toFixed(2), // ~13.96%: bare over-states t_c
  };
});

const BASELINE = GRID.find((r) => r.factor === 1.0);
const DENSITY_RATIOS = GRID.map((r) => r.ratio_density);
const RATIO_MIN = Math.min(...DENSITY_RATIOS);
const RATIO_MAX = Math.max(...DENSITY_RATIOS);
const MAX_RATIO_SHIFT = Math.max(...GRID.map((r) => r.ratio_shift)); // largest bare->density ratio shift
const MAX_OVERSTATE = Math.max(...GRID.map((r) => r.overstate_pct)); // ~13.96% across the grid

export const IMP3661_SIGMA_CROSSOVER_TC_DENSITY_CORRECTED_PIN = {
  id: 'imp-3661',
  proofSection: 'S-frontier',
  question:
    'Propagate the imp-3642 density correction -- the actual mesoscopic shock time scales with the LOCAL ' +
    'density log(gamma / 2 pi), NOT the bare Riemann-von Mangoldt height log gamma_N used in the imp-3620 ' +
    'closed-form t_c(N) pin -- into the imp-3620 per-floor crossover-scale flow factor and the imp-3604 ' +
    'flat-bracket occupancy. Re-derive t_c(N) with the log(gamma / 2 pi) argument, re-root-solve both ' +
    'crossings on the imp-3443 floor grid, and measure whether the imp-3620 N_half/N_x ~0.996 band shifts ' +
    'at its published 6-digit precision. Measurement/derivation only; conditional-share diagnostic, NOT ' +
    'an RH bound; no QED.',
  quantity:
    'sigma(N)=E_coll/(E_trunc+E_flow+E_coll); flow factor exp(C_G*t_c(N)) with density-corrected ' +
    't_c(N)=2.37e-4*log(gamma_{N*}/2pi)/log(gamma_N/2pi), N*=1e4, C_G in [1,2]; N_x from E_coll=E_trunc, ' +
    'N_half from sigma=1/2 at f*3.06e-5 floors',
  densityCorrectedForm: {
    law_bare_imp3620: 't_c(N) = 2.37e-4 * log(gamma_{N*}) / log(gamma_N) (imp-3620, over-states by ~13.96%)',
    law_density_imp3661: 't_c(N) = 2.37e-4 * log(gamma_{N*} / 2 pi) / log(gamma_N / 2 pi) (imp-3642 flow-measured)',
    L_anchor_bare: +L_ANCHOR_BARE.toFixed(6), // 9.1981
    L_anchor_density: +L_ANCHOR_DENSITY.toFixed(6), // 7.3603
    bracket_top_imp3604: +FLOW_BRACKET_TOP.toFixed(7),
  },
  crossoverScaleFactor: {
    N_x: BASELINE.N_x,
    tc_x_density: BASELINE.tc_x_density, // 9.1714e-5 (vs imp-3620 1.0452e-4)
    tc_x_bare_imp3620: BASELINE.tc_x_bare, // 1.0452e-4
    flowFactor_density_cg1: BASELINE.flowFactor_x_density_cg1, // 1.0000917 (vs imp-3620 1.0001045)
    flowFactor_density_cg2: BASELINE.flowFactor_x_density_cg2, // 1.0001834
    flowFactor_bare_cg1_imp3620: BASELINE.flowFactor_x_bare_cg1, // 1.0001045
    bracketFraction_density_cg1: BASELINE.bracketFraction_density_cg1, // ~0.1935 (vs imp-3620 0.2205)
    bracketFraction_bare_cg1_imp3620: BASELINE.bracketFraction_bare_cg1, // 0.2205
    overstate_pct: BASELINE.overstate_pct, // ~13.96%
    pinMovesTowardOne: BASELINE.flowFactor_x_density_cg1 < BASELINE.flowFactor_x_bare_cg1, // true
  },
  floorGrid: GRID,
  baselineNode: BASELINE, // f=1: density ratio 0.996019, N_x 3.280294e9 (reproduces imp-3620)
  ratioBand: { min: +RATIO_MIN.toFixed(6), max: +RATIO_MAX.toFixed(6), around: 0.996 },
  maxRatioShift: +MAX_RATIO_SHIFT.toExponential(2), // < 1e-7: band unchanged at 6-digit precision
  maxOverstatePct: +MAX_OVERSTATE.toFixed(2), // ~13.96%
  bandUnchangedAt6Digits: MAX_RATIO_SHIFT < 5e-7, // true: propagation leaves the published band intact
  finding: {
    F1_crossover_factor_moves_toward_one:
      'The density-corrected closed form t_c(N)=2.37e-4*L2pi(N*)/L2pi(N) pins the crossover-scale flow ' +
      'factor to ' + BASELINE.flowFactor_x_density_cg1.toFixed(7) + ' (C_G=1), at ' +
      (BASELINE.bracketFraction_density_cg1 * 100).toFixed(1) + '% of the imp-3604 bracket [1,1.000474] ' +
      '-- BELOW the imp-3620 bare-log pin ' + BASELINE.flowFactor_x_bare_cg1.toFixed(7) + ' (' +
      (BASELINE.bracketFraction_bare_cg1 * 100).toFixed(1) + '%), confirming the imp-3642 F2/F3 propagation.',
    F2_band_unchanged_at_6_digits:
      'Re-root-solving both crossings with the density-corrected closed form leaves the imp-3620 ' +
      'N_half/N_x band [' + RATIO_MIN.toFixed(6) + ', ' + RATIO_MAX.toFixed(6) + '] ~ 0.996 UNCHANGED at ' +
      'published 6-digit precision (max ratio shift ~' + MAX_RATIO_SHIFT.toExponential(1) + ' across the ' +
      'grid); the f=1 node still reproduces imp-3580/imp-3604/imp-3620 (0.996019, N_x=3.280294e9).',
    F3_bare_log_overstates:
      'The imp-3620 bare-log pin OVER-states the crossover collision time by ~' + BASELINE.overstate_pct.toFixed(2) +
      '% at f=1 (' + Math.min(...GRID.map((r) => r.overstate_pct)).toFixed(2) + '%..' + MAX_OVERSTATE.toFixed(2) +
      '% across the floor grid, the 2 pi inside the log); the density-corrected value is the measured shrink from ' +
      'the imp-3642 direct RK4 attractive-Dyson flow, and it moves the pin TOWARD 1.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT/DERIVATION (frontier-direction, NOT rigorous). Propagating the imp-3642 density ' +
    'correction -- the mesoscopic shock time scales with the LOCAL density log(gamma / 2 pi), not the ' +
    'bare Riemann-von Mangoldt height log gamma_N -- into the imp-3620 closed-form pin by replacing ' +
    't_c(N) = 2.37e-4 * log(gamma_{N*}) / log(gamma_N) with the density-corrected ' +
    't_c(N) = 2.37e-4 * log(gamma_{N*} / 2 pi) / log(gamma_N / 2 pi), and re-root-solving BOTH the ' +
    'sigma=1/2 half-decay N_half and the E_coll=E_trunc crossover N_x on the imp-3443 half-to-double ' +
    'floor grid, shows: (F1) at the crossover N_x = 3.280294e9 the density log ratio is 7.3603/19.0197 = ' +
    '0.3870 (vs the bare 9.1981/20.8576 = 0.4410), so t_c(N_x) = 9.1714e-5 (vs imp-3620 1.0452e-4) and ' +
    'the C_G=1 flow factor is pinned to 1.0000917 (vs imp-3620 1.0001045), landing at ~19.3% of the ' +
    'imp-3604 bracket [1,1.000474] (vs imp-3620 22.05%) -- the pin moves TOWARD 1, so imp-3604 is even ' +
    'more pessimistic at its upper endpoint; (F2) the imp-3620 N_half/N_x band stays [0.99313, 0.99772] ' +
    '~ 0.996 UNCHANGED at published 6-digit precision (max ratio shift ~9e-8 across the grid, the f=1 ' +
    'node reproducing imp-3580/imp-3604/imp-3620 at 0.996019, N_x=3.280294e9), because N_x is flow-free ' +
    'and E_flow(N_x) is only ~0.1%..0.3% of E_trunc so the ~1.28e-5 relative shrink of the flow factor ' +
    'is invisible at 6 digits; (F3) the imp-3620 bare-log pin over-states the surviving crossover ' +
    'collision time by ~13.96% (entirely the 2 pi inside the log). The absolute scale is still pinned to ' +
    'the A1-trap 2.37e-4 exactly as imp-398/imp-3620/imp-3642 do; only the density-corrected SHRINK ' +
    'SHAPE is propagated. Measurement/derivation only; no positivity, no bridge closure, no RH claim, NO ' +
    'QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. No refereed bound is changed' +
    '.',
  citation:
    'imp-3642 (direct RK4 attractive-Dyson flow, density-corrected shrink 0.3870 vs 0.4410, t_c(N_x) = ' +
    '9.1714e-5, flow factor 1.0000917); imp-3620 (bare-log closed-form pin, t_c(N_x) = 1.0452e-4, flow ' +
    'factor 1.0001045, band 0.996); imp-3604 (flat flow-factor bracket [1,1.000474]); imp-3580 ' +
    '(frozen-Gronwall floor-invariance, ratio 0.996019, N_x 3.280294e9); imp-2644 (A1 trap ' +
    '|t_c| <= g_min^2/6 = 2.37e-4, C_G in [1,2]); imp-398 (t_c(N) ~ 1/log gamma_N flow law); imp-3443 ' +
    '(half-to-double floor grid); imp-2631 (E_trunc floor 3.06e-5); lambda-rh-height-mapping.',
};

export const IMP3661_SIGMA_CROSSOVER_TC_DENSITY_CORRECTED_PIN_ASSERTIONS = [
  {
    // (F1) The density-corrected crossover-scale factor is pinned below the imp-3620 bare-log pin.
    id: 'imp3661-density-factor-below-bare',
    description: 'density-corrected flow factor at N_x (C_G=1) is in (1, imp-3620 1.0001045): moves toward 1',
    holds: () =>
      BASELINE.flowFactor_x_density_cg1 > 1 &&
      BASELINE.flowFactor_x_density_cg1 < BASELINE.flowFactor_x_bare_cg1 &&
      Math.abs(BASELINE.tc_x_density - 9.1714e-5) < 1e-8 &&
      Math.abs(BASELINE.tc_x_bare - 1.0452e-4) < 1e-8,
  },
  {
    // (F1) The density-corrected factor lands at ~19.3% of the imp-3604 bracket, below imp-3620 22.05%.
    id: 'imp3661-bracket-fraction-193pct',
    description: 'density-corrected bracket occupancy ~19.3% at f=1 (< imp-3620 22.05%), in [0.17,0.22] across floors',
    holds: () =>
      Math.abs(BASELINE.bracketFraction_density_cg1 - 0.1935) < 5e-3 &&
      GRID.every(
        (r) =>
          r.bracketFraction_density_cg1 > 0.17 &&
          r.bracketFraction_density_cg1 < 0.22 &&
          r.bracketFraction_density_cg1 < r.bracketFraction_bare_cg1,
      ),
  },
  {
    // (F2) The N_half/N_x band is unchanged at 6-digit precision: max bare->density shift < 5e-7.
    id: 'imp3661-band-unchanged-6-digits',
    description: 'density-corrected N_half/N_x band matches imp-3620 to 6 digits (max shift < 5e-7)',
    holds: () =>
      MAX_RATIO_SHIFT < 5e-7 &&
      RATIO_MIN > 0.993 &&
      RATIO_MAX < 0.998 &&
      DENSITY_RATIOS.every((r) => Math.abs(r - 0.996) < 3e-3) &&
      Math.abs(BASELINE.ratio_density - 0.996019) < 1e-6 &&
      Math.abs(BASELINE.ratio_density - BASELINE.ratio_bare) < 1e-6 &&
      Math.abs(BASELINE.N_x / 3.280294e9 - 1) < 1e-5,
  },
  {
    // (F3) The bare-log imp-3620 pin over-states the crossover collision time by ~13.96%.
    id: 'imp3661-bare-overstates-by-14pct',
    description: 'imp-3620 bare-log t_c(N_x) over-states the density-corrected value by ~13.96% at f=1 (13%-15% across floors)',
    holds: () =>
      Math.abs(BASELINE.overstate_pct - 13.96) < 0.5 &&
      GRID.every((r) => r.overstate_pct > 13 && r.overstate_pct < 15),
  },
  {
    // Honesty gate: measurement/derivation only, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp3661-honesty-gate-no-qed',
    description: 'Measurement/derivation only: no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP3661_SIGMA_CROSSOVER_TC_DENSITY_CORRECTED_PIN.isRigorous === false &&
      /NO QED/.test(IMP3661_SIGMA_CROSSOVER_TC_DENSITY_CORRECTED_PIN.verdict) &&
      /refereed bound is changed/i.test(IMP3661_SIGMA_CROSSOVER_TC_DENSITY_CORRECTED_PIN.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3661_SIGMA_CROSSOVER_TC_DENSITY_CORRECTED_PIN.verdict),
  },
];

for (const a of IMP3661_SIGMA_CROSSOVER_TC_DENSITY_CORRECTED_PIN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3661-sigma-crossover-tc-density-corrected-pin assertion failed: ${a.id}`);
  }
}
