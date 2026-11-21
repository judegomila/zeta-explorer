/**
 * @module imp-3620-sigma-crossover-tc-closedform-pin
 *
 * imp-3620 (numerical, frontier-direction): imp-3604 bounded the sigma=1/2 half-decay scale N_half and
 * the E_coll=E_trunc crossover scale N_x under the WHOLE Gronwall flow-factor bracket
 * [1, exp(2*2.37e-4)=1.000474] -- from |t_c| <= g_min^2/6 = 2.37e-4 (imp-2644 A1 trap) and C_G in [1,2]
 * -- WITHOUT inventing a specific t_c(N) closed form, showing the N_half/N_x band stays
 * [0.99313, 0.99772] ~ 0.996 with < 1e-5 flow-factor spread. That left the flow factor a whole
 * interval. THIS module DERIVES the flow factor at the crossover scale from the NAMED imp-398 /
 * backward-flow-stability law t_c(N) ~ 1/log gamma_N and MEASURES where inside [1, 1.000474] the true
 * crossover-scale factor actually lands, then re-root-solves both crossings with that N-varying flow
 * factor to PIN N_half/N_x to a single per-floor value rather than a bracket. Same sub-terms as
 * imp-3580/imp-3604; no fresh floor grid.
 *
 * THE imp-398 CLOSED FORM (t_c(N) ~ 1/log gamma_N)
 * ------------------------------------------------
 * The A1 Theta-trap (imp-2635/imp-2644) bounds the backward-collision time by the WORST-CASE
 * |t_c| <= g_min^2/6 = 2.37e-4, realized at the N* = 1e4 anchor where g_min is measured. The imp-398
 * backward-flow-stability law says the collision time then SHRINKS as t_c(N) ~ 1/log gamma_N with the
 * height gamma_N = T0 = effectiveHeightForN(N) (the Riemann-von Mangoldt N -> T0 map, imp-321). Pinning
 * the worst case at the anchor and carrying the 1/log gamma_N shape gives the specific closed form
 *     t_c(N) = 2.37e-4 * log(gamma_{N*}) / log(gamma_N),   N* = 1e4,
 * and the flow factor is the Gronwall multiplier exp(C_G * t_c(N)) with the admissible C_G in [1, 2].
 * imp-3604 replaced this whole N-varying factor by the flat bracket [1, exp(4.74e-4)]; here we evaluate
 * it exactly at the crossover scale.
 *
 * (A) WHERE INSIDE [1, 1.000474] THE TRUE CROSSOVER-SCALE FACTOR LANDS
 * -------------------------------------------------------------------
 * At the baseline crossover N_x = 3.280294e9 the height log gamma_{N_x} = 20.8576 is 2.268x the anchor
 * log gamma_{N*} = 9.1981, so the closed form shrinks the collision time by 0.4410:
 *     t_c(N_x) = 2.37e-4 * 0.4410 = 1.0452e-4   (< the anchor 2.37e-4).
 * The flow factor at the crossover therefore lands at
 *     exp(1 * t_c(N_x)) = 1.0001045  (C_G = 1),   exp(2 * t_c(N_x)) = 1.0002091  (C_G = 2),
 * i.e. at 22.05 % (C_G = 1) .. 44.09 % (C_G = 2) of the way across the imp-3604 bracket [1, 1.000474].
 * The C_G = 1 value 1.0001045 is only 0.441x the imp-3580 FROZEN exponent (which sat at exp(2.37e-4) =
 * 1.000237, the anchor worst case held flat for all N) -- the frozen node OVER-states the true
 * crossover-scale amplification by ~2.27x because it never applies the 1/log gamma_N shrink.
 *
 * (B) THE PINNED N_half / N_x RATIO (single value per floor, ~4e-7 residual)
 * -------------------------------------------------------------------------
 * Re-root-solving BOTH crossings with the closed-form N-varying flow factor (N_x is flow-free by
 * construction, so it is unchanged) collapses the imp-3604 per-floor flow-factor sub-bracket to a
 * single value. The remaining C_G in [1, 2] freedom moves each ratio by only ~2e-7 .. 8e-7 (vs the
 * imp-3604 ~3e-6 endpoint spread), because at the crossover scale the closed-form factor is already so
 * near 1. The per-floor pinned ratios (C_G = 1) are:
 *   f=0.5   0.997717   f=0.75  0.996836   f=1.0  0.996019   f=1.5  0.994514   f=2.0  0.993128
 * The f=1 node reproduces imp-3580/imp-3604 (0.996019, N_x = 3.280294e9) to the last published digit,
 * and the band stays [0.99313, 0.99772] ~ 0.996 -- now PINNED, not bracketed, in the flow factor.
 *
 * (C) NET FINDING
 * ---------------
 *   (F1) The imp-398 closed form t_c(N) = 2.37e-4 * L(N*)/L(N) pins the crossover-scale flow factor to
 *        1.0001045 (C_G = 1), landing at 22.05 % of the imp-3604 bracket -- BELOW the frozen imp-3580
 *        value 1.000237 (the frozen node over-states the amplification by ~2.27x).
 *   (F2) Re-root-solving with the closed form pins N_half/N_x to a single per-floor value; the band
 *        stays [0.99313, 0.99772] ~ 0.996 with only ~4e-7 residual C_G spread (< the imp-3604 ~3e-6).
 *   (F3) The full admissible pinned factor band [1.0001045, 1.0002091] (C_G in [1,2]) is a narrow
 *        22 %..44 % subset of the imp-3604 bracket, confirming imp-3604 was pessimistic at the endpoints.
 *
 * DERIVATION / MEASUREMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. No refereed bound is changed.
 *
 * @see imp-3604-sigma-crossover-flow-factor-invariance (flat flow-factor bracket this module pins)
 * @see imp-3580-sigma-crossover-floor-invariance (frozen-Gronwall floor grid; ratio 0.996019)
 * @see imp-2644-eflow-gronwall-cg-discharge (A1 trap |t_c| <= g_min^2/6 = 2.37e-4, C_G in [1,2])
 * @see imp-398 / backward-flow-stability-gronwall (C_F prefactor, t_c(N) ~ 1/log gamma_N flow law)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3556)
const TC_A1_TRAP = 2.37e-4; // A1 Theta-trap worst case |t_c| <= g_min^2/6 (imp-2635/imp-2644)
const N_ANCHOR = 1e4; // scale where g_min (hence the 2.37e-4 worst case) is measured (imp-3604 comment)
const L_ANCHOR = Math.log(effectiveHeightForN(N_ANCHOR)); // log gamma_{N*}

// imp-398 backward-flow-stability closed form: the collision time shrinks as 1/log gamma_N from its
// anchor worst case. The flow factor is the Gronwall multiplier exp(C_G * t_c(N)) with C_G in [1, 2].
function collisionTime(N) {
  return TC_A1_TRAP * (L_ANCHOR / Math.log(effectiveHeightForN(N)));
}
function flowFactor(N, cG) {
  return Math.exp(cG * collisionTime(N));
}

// EXACT imp-3406/imp-3556/imp-3580/imp-3604 sub-terms; only E_trunc and the N-varying flow factor differ.
function parts(N, eTrunc, cG) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor (N-dependent)
  const E_flow = C_F * (L / T0) * flowFactor(N, cG);
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = eTrunc + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Right-arm interior maximum (ternary in ln N; same bracket as imp-3406/imp-3580/imp-3604).
function argmaxSigmaLnN(loN, hiN, eTrunc, cG) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (parts(Math.exp(m1), eTrunc, cG).sigma < parts(Math.exp(m2), eTrunc, cG).sigma) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

// N_half: post-peak crossing where sigma first drops below 1/2 (400-iter bisection in ln N).
function crossHalf(eTrunc, cG) {
  const nMax = argmaxSigmaLnN(1e4, 1e9, eTrunc, cG);
  let a = Math.log(nMax);
  let b = Math.log(1e60);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), eTrunc, cG).sigma > 0.5) a = m;
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
const FROZEN_IMP3580 = Math.exp(TC_A1_TRAP); // imp-3580 frozen value 1.000237

// Per floor: N_x once (flow-free), the closed-form crossover-scale flow factor, and the pinned N_half
// ratio under C_G = 1 and C_G = 2; residual C_G spread replaces the imp-3604 flat-bracket spread.
const GRID = FACTORS.map((f) => {
  const eTrunc = f * E_TRUNC_BASE;
  const N_x = crossCollEqTrunc(eTrunc);
  const tc_x = collisionTime(N_x);
  const ff_x_cg1 = flowFactor(N_x, 1);
  const ff_x_cg2 = flowFactor(N_x, 2);
  const N_half_cg1 = crossHalf(eTrunc, 1);
  const N_half_cg2 = crossHalf(eTrunc, 2);
  const ratio_cg1 = N_half_cg1 / N_x;
  const ratio_cg2 = N_half_cg2 / N_x;
  return {
    factor: f,
    E_trunc: +eTrunc.toExponential(4),
    N_x: +N_x.toExponential(6), // identical to imp-3580/imp-3604 (flow-free)
    x_at_x: +(parts(N_x, eTrunc, 1).E_coll / eTrunc).toFixed(6), // 1.000000 (flow-free coincidence)
    tc_at_x: +tc_x.toExponential(4), // closed-form collision time at the crossover (< 2.37e-4)
    flowFactor_x_cg1: +ff_x_cg1.toFixed(7), // pinned crossover-scale factor, C_G=1
    flowFactor_x_cg2: +ff_x_cg2.toFixed(7), // pinned crossover-scale factor, C_G=2
    bracketFraction_cg1: +((ff_x_cg1 - 1) / (FLOW_BRACKET_TOP - 1)).toFixed(4), // where in [1,top]
    bracketFraction_cg2: +((ff_x_cg2 - 1) / (FLOW_BRACKET_TOP - 1)).toFixed(4),
    N_half: +N_half_cg1.toExponential(6),
    ratio_half_over_x: +ratio_cg1.toFixed(6), // PINNED single value (C_G=1)
    ratio_cg2: +ratio_cg2.toFixed(6),
    cg_residual_swing: +Math.abs(ratio_cg1 - ratio_cg2).toExponential(2), // replaces imp-3604 bracket
    residual_half: +Math.abs(parts(N_half_cg1, eTrunc, 1).sigma - 0.5).toExponential(2),
  };
});

const BASELINE = GRID.find((r) => r.factor === 1.0);
const ALL_RATIOS = GRID.flatMap((r) => [r.ratio_half_over_x, r.ratio_cg2]);
const RATIO_MIN = Math.min(...ALL_RATIOS);
const RATIO_MAX = Math.max(...ALL_RATIOS);
const MAX_CG_SWING = Math.max(...GRID.map((r) => r.cg_residual_swing)); // largest per-floor C_G residual
const MAX_BRACKET_FRACTION = Math.max(...GRID.map((r) => r.bracketFraction_cg2)); // deepest into [1,top]

export const IMP3620_SIGMA_CROSSOVER_TC_CLOSEDFORM_PIN = {
  id: 'imp-3620',
  proofSection: 'S-frontier',
  question:
    'Pin the imp-3604 N_half/N_x crossover ratio using the specific imp-398 backward-flow-stability law ' +
    't_c(N) ~ 1/log gamma_N instead of the flat flow-factor bracket [1, 1.000474] endpoints. Derive the ' +
    'flow factor at the crossover scale N_x ~ 3.28e9 from that closed form (effectiveHeightForN mapping ' +
    'N -> T0 = gamma_N), measure where inside [1, 1.000474] it lands, and re-root-solve both crossings ' +
    'to pin N_half/N_x to a single value. Measurement/derivation only; conditional-share diagnostic, ' +
    'NOT an RH bound; no QED.',
  quantity:
    'sigma(N)=E_coll/(E_trunc+E_flow+E_coll); flow factor exp(C_G*t_c(N)) with t_c(N)=2.37e-4*L(N*)/L(N), ' +
    'N*=1e4, C_G in [1,2]; N_x from E_coll=E_trunc (flow-free), N_half from sigma=1/2 at f*3.06e-5 floors',
  closedForm: {
    law: 't_c(N) = 2.37e-4 * log(gamma_{N*}) / log(gamma_N), N* = 1e4 (imp-398, 1/log gamma_N shrink)',
    L_anchor: +L_ANCHOR.toFixed(6),
    frozen_imp3580: +FROZEN_IMP3580.toFixed(7),
    bracket_top_imp3604: +FLOW_BRACKET_TOP.toFixed(7),
  },
  crossoverScaleFactor: {
    N_x: BASELINE.N_x,
    tc_at_x: BASELINE.tc_at_x, // 1.0452e-4, i.e. 0.441x the anchor 2.37e-4
    flowFactor_cg1: BASELINE.flowFactor_x_cg1, // 1.0001045
    flowFactor_cg2: BASELINE.flowFactor_x_cg2, // 1.0002091
    bracketFraction_cg1: BASELINE.bracketFraction_cg1, // 0.2205
    bracketFraction_cg2: BASELINE.bracketFraction_cg2, // 0.4409
    belowFrozen: BASELINE.flowFactor_x_cg1 < FROZEN_IMP3580, // true -- frozen over-states by ~2.27x
  },
  floorGrid: GRID,
  baselineNode: BASELINE, // f=1: pinned ratio 0.996019, N_x 3.280294e9 (reproduces imp-3580/imp-3604)
  ratioBand: { min: +RATIO_MIN.toFixed(6), max: +RATIO_MAX.toFixed(6), around: 0.996 },
  maxCgResidualSwing: +MAX_CG_SWING.toExponential(2), // < the imp-3604 ~3e-6 flat-bracket spread
  maxBracketFraction: +MAX_BRACKET_FRACTION.toFixed(4), // deepest the true factor reaches into [1,top]
  finding: {
    F1_crossover_factor_pinned:
      'The imp-398 closed form t_c(N)=2.37e-4*L(N*)/L(N) pins the crossover-scale flow factor to ' +
      BASELINE.flowFactor_x_cg1.toFixed(7) + ' (C_G=1), at ' + (BASELINE.bracketFraction_cg1 * 100).toFixed(1) +
      '% of the imp-3604 bracket [1,1.000474] -- BELOW the frozen imp-3580 value 1.000237, which ' +
      'over-states the crossover-scale amplification by ~2.27x by never applying the 1/log gamma_N shrink.',
    F2_ratio_pinned_single_value:
      'Re-root-solving both crossings with the closed form pins N_half/N_x to a single per-floor value; ' +
      'the band stays [' + RATIO_MIN.toFixed(6) + ', ' + RATIO_MAX.toFixed(6) + '] ~ 0.996 with only ~' +
      MAX_CG_SWING.toExponential(1) + ' residual C_G spread (< the imp-3604 ~3e-6 flat-bracket spread); ' +
      'the f=1 node reproduces imp-3580/imp-3604 (0.996019, N_x=3.280294e9).',
    F3_bracket_was_pessimistic:
      'The full admissible pinned factor band [' + BASELINE.flowFactor_x_cg1.toFixed(7) + ', ' +
      BASELINE.flowFactor_x_cg2.toFixed(7) + '] (C_G in [1,2]) is a narrow ' +
      (BASELINE.bracketFraction_cg1 * 100).toFixed(0) + '%..' + (BASELINE.bracketFraction_cg2 * 100).toFixed(0) +
      '% subset of the imp-3604 bracket -- imp-3604 was pessimistic at the endpoints.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT/DERIVATION (frontier-direction, NOT rigorous). Deriving the specific imp-398 ' +
    'backward-flow-stability collision time t_c(N) = 2.37e-4 * log(gamma_{N*}) / log(gamma_N) ' +
    '(N* = 1e4 anchor, gamma_N = effectiveHeightForN(N)) from the named t_c(N) ~ 1/log gamma_N law, ' +
    'and re-root-solving BOTH the sigma=1/2 half-decay N_half and the E_coll=E_trunc crossover N_x on ' +
    'the imp-3443 half-to-double floor grid, shows: (F1) at the crossover scale N_x = 3.280294e9 the ' +
    'height log gamma_{N_x} = 20.8576 is 2.27x the anchor log gamma_{N*} = 9.1981, so t_c(N_x) = ' +
    '1.0452e-4 (0.441x the anchor worst case 2.37e-4) and the flow factor is pinned to 1.0001045 ' +
    '(C_G=1) .. 1.0002091 (C_G=2), landing at 22.05%..44.09% of the imp-3604 bracket [1,1.000474] and ' +
    'BELOW the imp-3580 frozen value 1.000237 -- the frozen node over-states the crossover-scale ' +
    'amplification by ~2.27x because it never applies the 1/log gamma_N shrink; (F2) with the ' +
    'N-varying closed form the N_half/N_x ratio is PINNED to a single per-floor value (band still ' +
    '[0.99313, 0.99772] ~ 0.996, f=1 reproducing imp-3580/imp-3604 to the last digit at 0.996019) with ' +
    'only ~4e-7 residual C_G spread, tighter than the imp-3604 ~3e-6 flat-bracket spread; (F3) the ' +
    'full admissible pinned factor band [1.0001045, 1.0002091] is a narrow 22%..44% subset of the ' +
    'imp-3604 bracket, so imp-3604 was pessimistic at its endpoints. N_x and x(N_x)=1 are unchanged ' +
    '(flow-free by construction). Measurement/derivation only; no positivity, no bridge closure, no RH ' +
    'claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a>=0 positivity UNTOUCHED. No refereed bound is changed' +
    '.',
  citation:
    'imp-3604 (flat flow-factor bracket [1,1.000474], band 0.996); imp-3580 (frozen-Gronwall ' +
    'floor-invariance, ratio 0.996019, N_x 3.280294e9); imp-2644 (A1 trap |t_c| <= g_min^2/6 = ' +
    '2.37e-4, C_G in [1,2]); imp-2635 (A1 Theta-trap); imp-398 (E_flow C_F prefactor and t_c(N) ~ ' +
    '1/log gamma_N flow law); imp-3556 (baseline half-decay <=> crossover); imp-3444 (E_coll=E_trunc ' +
    'crossover); imp-3443 (half-to-double floor grid); imp-2631 (E_trunc floor 3.06e-5); ' +
    'lambda-rh-height-mapping.',
};

export const IMP3620_SIGMA_CROSSOVER_TC_CLOSEDFORM_PIN_ASSERTIONS = [
  {
    // (F1) The closed-form crossover-scale factor lands strictly inside [1, frozen], below imp-3580.
    id: 'imp3620-crossover-factor-below-frozen',
    description: 'closed-form flow factor at N_x (C_G=1) is in (1, 1.000237): pinned below the imp-3580 frozen value',
    holds: () =>
      BASELINE.flowFactor_x_cg1 > 1 &&
      BASELINE.flowFactor_x_cg1 < FROZEN_IMP3580 &&
      Math.abs(BASELINE.tc_at_x - 1.0452e-4) < 1e-8,
  },
  {
    // (F1) The true crossover-scale factor lands strictly inside the imp-3604 bracket, not at endpoints.
    id: 'imp3620-lands-inside-bracket',
    description: 'crossover-scale factor sits at 22%..44% of [1,1.000474]; deepest reach < 50% of the bracket',
    holds: () =>
      GRID.every((r) => r.bracketFraction_cg1 > 0.1 && r.bracketFraction_cg1 < 0.3) &&
      MAX_BRACKET_FRACTION < 0.5,
  },
  {
    // (F2) The pinned ratio band stays ~0.996 and the f=1 node reproduces imp-3580/imp-3604.
    id: 'imp3620-band-stays-around-996',
    description: 'pinned N_half/N_x band [0.993,0.998] ~ 0.996; f=1 node reproduces imp-3580 0.996019, N_x 3.280294e9',
    holds: () =>
      RATIO_MIN > 0.993 &&
      RATIO_MAX < 0.998 &&
      ALL_RATIOS.every((r) => Math.abs(r - 0.996) < 3e-3) &&
      Math.abs(BASELINE.ratio_half_over_x - 0.996019) < 1e-6 &&
      Math.abs(BASELINE.N_x / 3.280294e9 - 1) < 1e-5,
  },
  {
    // (F2) The closed form PINS the ratio: residual C_G spread is below the imp-3604 flat-bracket spread.
    id: 'imp3620-cg-residual-below-imp3604',
    description: 'residual C_G ratio spread < 1e-6, tighter than the imp-3604 flat-bracket ~3e-6',
    holds: () => MAX_CG_SWING < 1e-6,
  },
  {
    // (F1) All half-decay crossings remain certified roots under the N-varying closed-form flow factor.
    id: 'imp3620-half-decay-roots-certified',
    description: 'sigma(N_half) residual < 1e-9 at every floor under the closed-form flow factor',
    holds: () => GRID.every((r) => r.residual_half < 1e-9),
  },
  {
    // Honesty gate: measurement/derivation only, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp3620-honesty-gate-no-qed',
    description: 'Measurement/derivation only: no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP3620_SIGMA_CROSSOVER_TC_CLOSEDFORM_PIN.isRigorous === false &&
      /NO QED/.test(IMP3620_SIGMA_CROSSOVER_TC_CLOSEDFORM_PIN.verdict) &&
      /refereed bound is changed/i.test(IMP3620_SIGMA_CROSSOVER_TC_CLOSEDFORM_PIN.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3620_SIGMA_CROSSOVER_TC_CLOSEDFORM_PIN.verdict),
  },
];

for (const a of IMP3620_SIGMA_CROSSOVER_TC_CLOSEDFORM_PIN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3620-sigma-crossover-tc-closedform-pin assertion failed: ${a.id}`);
  }
}
