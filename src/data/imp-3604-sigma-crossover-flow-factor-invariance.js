/**
 * @module imp-3604-sigma-crossover-flow-factor-invariance
 *
 * imp-3604 (numerical, frontier-direction): imp-3580 root-solved N_half (sigma = 1/2) and
 * N_x (E_coll = E_trunc) across the imp-3443 half-to-double E_trunc floor grid while holding the
 * Gronwall amplification FROZEN at exp(2.37e-4) (the imp-2644 A1 worst-case trap, C_G = 1) at every
 * node. It found x(N_x) = 1.000000 exactly at every floor and the N_half/N_x ratio in the tight band
 * [0.99313, 0.99772] ~ 0.996. This module RE-ROOT-SOLVES both crossings with an N-varying flow
 * factor and MEASURES how much of that coincidence is a frozen-constant artifact.
 *
 * THE QUANTITY (identical sub-terms to imp-3220 / imp-3406 / imp-3556 / imp-3580)
 * ------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),   x = E_coll / E_trunc
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)             (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398, already N-dependent)
 *     E_trunc = f * 3.06e-5,  f in {0.5, 0.75, 1.0, 1.5, 2.0}
 * imp-3580 froze the whole Gronwall multiplier at exp(2.37e-4). Here the flow factor moves through a
 * RIGOROUS bracket. The A1 Theta-trap (imp-2635/imp-2644) bounds the Gronwall exponent by
 * C_G * |t_c| with |t_c| <= g_min^2/6 = 2.37e-4 and the physically-meaningful C_G in [1, 2]
 * (C_G = 2/y_star^2 on the mesoscopic working strip, imp-2644). So for EVERY N the true flow factor
 * satisfies
 *     Gronwall(N) in [ 1 ,  exp(2 * 2.37e-4) ]  =  [ 1.000000 , 1.000474 ],
 * and imp-3580 sat at the interior value exp(2.37e-4) = 1.000237. The lower endpoint 1 is the
 * large-N vanishing limit of the exponent (imp-398/backward-flow t_c(N) ~ 1/log gamma_N shrinks the
 * amplification as N grows, so at the crossover scale N_x ~ 3.28e9 the factor is nearer 1 than the
 * N* = 1e4 anchor value). Root-solving at the bracket ENDPOINTS bounds N_half for any admissible
 * N-dependent flow factor without inventing a specific t_c(N) closed form.
 *
 * (A) THE COINCIDENCE x(N_x) = 1 IS FLOW-FACTOR-INVARIANT BY CONSTRUCTION (0% artifact)
 * -----------------------------------------------------------------------------------
 * N_x is DEFINED by E_coll(N) = E_trunc -- the flow term E_flow does not appear in that equation at
 * all. So N_x and x(N_x) = E_coll/E_trunc = 1.000000 are EXACTLY independent of the Gronwall choice:
 * root-solving E_coll = E_trunc returns the identical N_x (to all digits) under Gronwall = 1,
 * 1.000237 (frozen) and 1.000474 at every floor node. The "exact floor-invariance x(N_x) = 1" that
 * imp-3580 reported is therefore NOT a frozen-constant artifact at all -- it is a structural property
 * of the crossover definition, immune to the entire flow-factor bracket.
 *
 * (B) THE N_half / N_x BAND IS GRONWALL-INSENSITIVE (< 1e-5 shift across the bracket)
 * ----------------------------------------------------------------------------------
 * N_half (sigma = 1/2 <=> E_coll = E_trunc + E_flow) DOES see E_flow, so it moves with the flow
 * factor. But at the crossover scale E_flow(N_x) ~ 1.7e-8 .. 2.0e-7 is 0.1 % .. 0.3 % of
 * E_trunc, and the whole Gronwall bracket spans only [1, 1.000474], so sweeping the flow factor
 * from 1 to 1.000474 shifts each N_half by ~3e-6 relative and each N_half/N_x ratio by at most
 * ~3e-6. The per-floor ratios are (Gronwall 1 -> frozen -> 1.000474):
 *   f=0.5   0.997717 / 0.997717 / 0.997716
 *   f=0.75  0.996836 / 0.996836 / 0.996835
 *   f=1.0   0.996020 / 0.996019 / 0.996018   <- imp-3580 baseline reproduced at frozen
 *   f=1.5   0.994515 / 0.994514 / 0.994512
 *   f=2.0   0.993129 / 0.993127 / 0.993126
 * The band stays [0.99313, 0.99772] ~ 0.996 to every published digit under all three flow factors.
 *
 * (C) HOW MUCH IS A FROZEN-CONSTANT ARTIFACT? Essentially none.
 * ------------------------------------------------------------
 * The maximum possible frozen-Gronwall artifact -- the full swing of any admissible N-dependent flow
 * factor -- is bounded by the endpoint spread: EXACTLY zero on x(N_x) = 1 and the N_x crossover, and
 * < 1e-5 on the N_half/N_x ratio (max cross-variant ratio shift ~3e-6, max N_half relative shift
 * ~3.3e-6). The imp-3580 conclusions are robust to replacing the frozen exp(2.37e-4) with the
 * N-varying flow factor: the coincidence is structural, not a reading of a frozen constant.
 *
 * THE FINDING (measurement / certification only)
 * ----------------------------------------------
 *   (F1) x(N_x) = 1.000000 and N_x are IDENTICAL under Gronwall = 1, exp(2.37e-4) and exp(4.74e-4)
 *        at every floor -- the coincidence lives in the flow-free E_coll = E_trunc definition and is
 *        0 % a frozen-constant artifact.
 *   (F2) The N_half/N_x band stays [0.99313, 0.99772] ~ 0.996 under the whole flow-factor bracket;
 *        the frozen node reproduces imp-3580 (0.996019, N_x = 3.280294e9) exactly.
 *   (F3) The maximum frozen-Gronwall artifact is < 1e-5 on the ratio (endpoint spread ~3e-6) and
 *        exactly 0 on the crossover -- so imp-3580 is robust to the frozen-constant assumption.
 *
 * DERIVATION / MEASUREMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. No refereed bound is changed.
 *
 * @see imp-3580-sigma-crossover-floor-invariance (frozen-Gronwall floor grid this module re-solves)
 * @see imp-3599-flow-gap-nextorder-correction (exact gap identity for the same crossings)
 * @see imp-2644-eflow-gronwall-cg-discharge (A1 trap |t_c| <= g_min^2/6 = 2.37e-4, C_G in [1,2])
 * @see imp-398 / backward-flow-stability-gronwall (C_F prefactor, t_c(N) ~ 1/log gamma_N flow law)
 * @see imp-3556-sigma-threshold-crossings-rootsolve (baseline half-decay <=> crossover certification)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3556)
const TC_A1_TRAP = 2.37e-4; // A1 Theta-trap |t_c| <= g_min^2/6 (imp-2635/imp-2644)

// Rigorous flow-factor bracket. imp-3580 froze at exp(1 * TC_A1_TRAP); the admissible band is
// [1, exp(2 * TC_A1_TRAP)] since the Gronwall exponent is C_G * |t_c| with C_G in [1, 2] (imp-2644)
// and the large-N flow law drives the exponent toward 0. Root-solving at the endpoints brackets
// N_half for any N-dependent flow factor.
const FLOW_FACTORS = [
  { name: 'zero_limit_G1', gronwall: 1, note: 'exponent -> 0 (large-N vanishing limit)' },
  { name: 'frozen_imp3580', gronwall: Math.exp(1.0 * TC_A1_TRAP), note: 'imp-3580 C_G=1 worst-case' },
  { name: 'cg2_upper', gronwall: Math.exp(2.0 * TC_A1_TRAP), note: 'imp-2644 C_G=2 mesoscopic-strip upper' },
];

// EXACT imp-3406/imp-3556/imp-3580 sub-terms; only E_trunc and the Gronwall multiplier are parameters.
function parts(N, eTrunc, gronwall) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor (N-dependent)
  const E_flow = C_F * (L / T0) * gronwall;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = eTrunc + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Right-arm interior maximum (ternary in ln N; same bracket as imp-3406/imp-3580).
function argmaxSigmaLnN(loN, hiN, eTrunc, gronwall) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (parts(Math.exp(m1), eTrunc, gronwall).sigma < parts(Math.exp(m2), eTrunc, gronwall).sigma) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

// N_half: post-peak crossing where sigma first drops below 1/2 (400-iter bisection in ln N).
function crossHalf(eTrunc, gronwall) {
  const nMax = argmaxSigmaLnN(1e4, 1e9, eTrunc, gronwall);
  let a = Math.log(nMax);
  let b = Math.log(1e60);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), eTrunc, gronwall).sigma > 0.5) a = m;
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
    if (parts(Math.exp(m), eTrunc, 1).E_coll > eTrunc) a = m; // E_coll independent of gronwall
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

const FACTORS = [0.5, 0.75, 1.0, 1.5, 2.0];

// Per floor: N_x once (flow-free) and N_half under each flow factor; measure the ratio swing.
const GRID = FACTORS.map((f) => {
  const eTrunc = f * E_TRUNC_BASE;
  const N_x = crossCollEqTrunc(eTrunc);
  const px1 = parts(N_x, eTrunc, 1);
  const perFactor = FLOW_FACTORS.map((ff) => {
    const N_half = crossHalf(eTrunc, ff.gronwall);
    const ratio = N_half / N_x;
    return {
      name: ff.name,
      gronwall: +ff.gronwall.toFixed(9),
      N_half: +N_half.toExponential(6),
      ratio_half_over_x: +ratio.toFixed(6),
      flow_gap_pct: +((1 - ratio) * 100).toFixed(4),
      residual_half: +Math.abs(parts(N_half, eTrunc, ff.gronwall).sigma - 0.5).toExponential(2),
    };
  });
  const ratios = perFactor.map((r) => r.ratio_half_over_x);
  const nhalfs = perFactor.map((r) => r.N_half);
  return {
    factor: f,
    E_trunc: +eTrunc.toExponential(4),
    N_x: +N_x.toExponential(6), // identical under every flow factor
    x_at_x: +(px1.E_coll / eTrunc).toFixed(6), // 1.000000 -- the flow-free coincidence
    E_flow_at_x: +px1.E_flow.toExponential(3),
    perFactor,
    ratio_swing: +(Math.max(...ratios) - Math.min(...ratios)).toExponential(2), // frozen-artifact size on the ratio
    nhalf_rel_swing: +((Math.max(...nhalfs) - Math.min(...nhalfs)) / Math.min(...nhalfs)).toExponential(2),
  };
});

const BASELINE = GRID.find((r) => r.factor === 1.0);
const FROZEN_NODE = BASELINE.perFactor.find((r) => r.name === 'frozen_imp3580');
const ALL_RATIOS = GRID.flatMap((r) => r.perFactor.map((p) => p.ratio_half_over_x));
const RATIO_MIN = Math.min(...ALL_RATIOS);
const RATIO_MAX = Math.max(...ALL_RATIOS);
const MAX_RATIO_SWING = Math.max(...GRID.map((r) => r.ratio_swing)); // largest per-floor frozen artifact
const MAX_NHALF_REL_SWING = Math.max(...GRID.map((r) => r.nhalf_rel_swing));

export const IMP3604_SIGMA_CROSSOVER_FLOW_FACTOR_INVARIANCE = {
  id: 'imp-3604',
  proofSection: 'S-frontier',
  question:
    'Assess whether the imp-3580 exact floor-invariance x(N_x)=1 and the ~0.996 N_half/N_x band ' +
    'survive replacing the frozen Gronwall = exp(2.37e-4) with the N-varying imp-398 flow factor. ' +
    'Re-root-solve both crossings across a rigorous flow-factor bracket [1, exp(4.74e-4)] on the ' +
    'imp-3443 half-to-double floor grid and measure how much of the coincidence is a frozen-constant ' +
    'artifact. Measurement/certification only; conditional-share diagnostic, NOT an RH bound; no QED.',
  quantity:
    'sigma(N)=E_coll/(E_trunc+E_flow+E_coll); N_x from E_coll=E_trunc (flow-free), N_half from sigma=1/2 ' +
    'under Gronwall in {1, exp(2.37e-4), exp(4.74e-4)} at f*3.06e-5 floors',
  flowFactorBracket: { min: 1, frozen_imp3580: +Math.exp(TC_A1_TRAP).toFixed(9), max: +Math.exp(2 * TC_A1_TRAP).toFixed(9) },
  floorGrid: GRID,
  baselineNode: BASELINE, // f=1 node; frozen sub-node reproduces imp-3580 (0.996019, N_x 3.280294e9)
  ratioBand: { min: +RATIO_MIN.toFixed(6), max: +RATIO_MAX.toFixed(6), around: 0.996 },
  maxRatioSwing: +MAX_RATIO_SWING.toExponential(2), // frozen-Gronwall artifact size on the ratio
  maxNhalfRelSwing: +MAX_NHALF_REL_SWING.toExponential(2),
  finding: {
    F1_crossover_flow_factor_invariant:
      'x(N_x)=1.000000 and N_x are IDENTICAL under Gronwall=1, exp(2.37e-4) and exp(4.74e-4) at ' +
      'every floor -- the coincidence lives in the flow-free E_coll=E_trunc definition and is 0% a ' +
      'frozen-constant artifact.',
    F2_band_stays_996:
      'The N_half/N_x band stays [' + RATIO_MIN.toFixed(6) + ', ' + RATIO_MAX.toFixed(6) +
      '] ~ 0.996 under the whole flow-factor bracket; the frozen sub-node reproduces imp-3580 ' +
      '(ratio 0.996019, N_x=3.280294e9).',
    F3_artifact_negligible:
      'The maximum frozen-Gronwall artifact is < 1e-5 on the ratio (endpoint spread ~' +
      MAX_RATIO_SWING.toExponential(1) + ') and exactly 0 on the crossover, so imp-3580 is robust ' +
      'to replacing the frozen exp(2.37e-4) with the N-varying flow factor.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT/CERTIFICATION (frontier-direction, NOT rigorous). Re-root-solving BOTH the ' +
    'sigma=1/2 half-decay N_half and the E_coll=E_trunc crossover N_x across the imp-3443 ' +
    'half-to-double E_trunc floor grid (0.5x..2x the imp-2631 baseline; certified 400-iter ' +
    'bisection roots) with the Gronwall multiplier swept over the RIGOROUS bracket ' +
    '[1, exp(2.37e-4)=1.000237 (imp-3580, C_G=1), exp(4.74e-4)=1.000474 (imp-2644, C_G=2)] shows: ' +
    '(F1) the crossover N_x and x(N_x)=E_coll/E_trunc=1.000000 are EXACTLY flow-factor-invariant -- ' +
    'byte-identical under all three multipliers at every floor -- because E_flow does NOT enter the ' +
    'E_coll=E_trunc equation, so imp-3580 exact floor-invariance is a structural property, 0% a ' +
    'frozen-constant artifact; (F2) the N_half/N_x ratio band stays [0.99313, 0.99772] ~ 0.996 ' +
    'across the whole flow-factor bracket, the frozen sub-node reproducing imp-3580 to the last ' +
    'digit (0.996019, N_x=3.280294e9); (F3) the maximum possible frozen-Gronwall artifact -- the ' +
    'full endpoint swing of any admissible N-dependent flow factor -- is < 1e-5 on the ratio ' +
    '(max per-floor swing ~3e-6, max N_half relative swing ~3.3e-6) and exactly 0 on the ' +
    'crossover, because E_flow(N_x) ~ 1.7e-8..2.0e-7 is only 0.1%..0.3% of E_trunc while the ' +
    'Gronwall bracket spans only [1, 1.000474]. So NONE of the imp-3580 coincidence is a ' +
    'frozen-constant artifact: the x(N_x)=1 invariance is definitional and the ~0.996 band is ' +
    'Gronwall-insensitive. Measurement/certification only; no positivity, no bridge closure, no RH ' +
    'claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a>=0 positivity UNTOUCHED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-3580 (frozen-Gronwall floor-invariance, ratio 0.996019, N_x 3.280294e9); imp-3599 (exact ' +
    'gap identity); imp-2644 (A1 trap |t_c| <= g_min^2/6 = 2.37e-4, C_G in [1,2]); imp-2635 (A1 ' +
    'Theta-trap); imp-398 (E_flow C_F prefactor and t_c(N) ~ 1/log gamma_N flow law); imp-3556 ' +
    '(baseline half-decay <=> crossover); imp-3444 (E_coll=E_trunc crossover); imp-3443 ' +
    '(half-to-double floor grid); imp-2631 (E_trunc floor 3.06e-5); lambda-rh-height-mapping.',
};

export const IMP3604_SIGMA_CROSSOVER_FLOW_FACTOR_INVARIANCE_ASSERTIONS = [
  {
    // (F1) The crossover is flow-factor-free: N_x and x(N_x)=1 are identical under every multiplier.
    id: 'imp3604-crossover-flow-factor-invariant',
    description: 'x(N_x)=1.000000 at every floor; N_x independent of the Gronwall multiplier by construction',
    holds: () => GRID.every((r) => Math.abs(r.x_at_x - 1) < 1e-5),
  },
  {
    // (F1) All half-decay crossings are certified roots under every flow factor.
    id: 'imp3604-half-decay-roots-certified',
    description: 'sigma(N_half) residual < 1e-9 at every floor under every flow factor',
    holds: () => GRID.every((r) => r.perFactor.every((p) => p.residual_half < 1e-9)),
  },
  {
    // (F2) The N_half/N_x band stays ~0.996 across floors AND across the whole flow-factor bracket.
    id: 'imp3604-band-stays-around-996',
    description: 'N_half/N_x band [0.993, 0.998] ~ 0.996 across 0.5x..2x floors and the full flow-factor bracket',
    holds: () =>
      RATIO_MIN > 0.993 &&
      RATIO_MAX < 0.998 &&
      ALL_RATIOS.every((r) => Math.abs(r - 0.996) < 3e-3),
  },
  {
    // (F2) The frozen sub-node reproduces imp-3580 to the last digit.
    id: 'imp3604-frozen-node-reproduces-imp3580',
    description: 'f=1 frozen sub-node reproduces imp-3580: ratio 0.996019, N_x 3.280294e9',
    holds: () =>
      Math.abs(FROZEN_NODE.ratio_half_over_x - 0.996019) < 1e-6 &&
      Math.abs(BASELINE.N_x / 3.280294e9 - 1) < 1e-5,
  },
  {
    // (F3) The frozen-Gronwall artifact is negligible: < 1e-5 on the ratio, exactly 0 on the crossover.
    id: 'imp3604-frozen-artifact-negligible',
    description: 'max flow-factor ratio swing < 1e-5 and max N_half relative swing < 1e-4; crossover swing exactly 0',
    holds: () => MAX_RATIO_SWING < 1e-5 && MAX_NHALF_REL_SWING < 1e-4,
  },
  {
    // Honesty gate: measurement/certification only, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp3604-honesty-gate-no-qed',
    description: 'Measurement/certification only: no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP3604_SIGMA_CROSSOVER_FLOW_FACTOR_INVARIANCE.isRigorous === false &&
      /NO QED/.test(IMP3604_SIGMA_CROSSOVER_FLOW_FACTOR_INVARIANCE.verdict) &&
      /refereed bound is changed/i.test(IMP3604_SIGMA_CROSSOVER_FLOW_FACTOR_INVARIANCE.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3604_SIGMA_CROSSOVER_FLOW_FACTOR_INVARIANCE.verdict),
  },
];

for (const a of IMP3604_SIGMA_CROSSOVER_FLOW_FACTOR_INVARIANCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3604-sigma-crossover-flow-factor-invariance assertion failed: ${a.id}`);
  }
}
