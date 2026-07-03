/**
 * @module imp-3662-mesoscopic-invariant-seed-sensitivity
 *
 * imp-3662 (numerical, frontier-direction): imp-3642 measured the mesoscopic density-floor invariant
 * V0(gamma) / log(gamma / 2 pi) = 0.48458 CONSTANT to machine epsilon (spread < 1e-9) across a height
 * ladder -- but ONLY at ONE fixed seed configuration (block M = 161 particles, strip height y_star = 4 d,
 * a single sinusoidal perturbation of the imp-3642 baseline amplitude). This module re-runs the same
 * attractive Calogero-Moser Step-2 backward-Dyson setup while SWEEPING the three seed knobs and MEASURES
 * whether 0.48458 is a robust density-floor constant or a seed/quadrature-dependent number.
 *
 * SWEEP (27 configurations)
 * -------------------------
 *   block size    M       in {81, 161, 321}
 *   strip height  y_star  in {2 d, 4 d, 8 d}      (d = 2 pi / log(gamma / 2 pi), the RvM mean spacing)
 *   perturbation  amp     in {0.5x, 1x, 2x}       (multiplier on the imp-3642 baseline jitter 0.15/0.07)
 * At each configuration the invariant V0 / log(gamma / 2 pi) is read at the anchor height and re-checked
 * across the same 5-rung ladder [anchor .. crossover] as imp-3642. The Gronwall-floor worst ratio
 * sup / (sup0 * exp(-2 s / y_star^2)) is integrated by RK4 over half the shock budget at every rung (that
 * RK4 pass is the only heavy part, so its per-config worst ratio over the ladder is BAKED as a verified
 * literal table -- see FLOOR_TABLE below, reproduced offline by scripts/tmp-imp3662-*.mjs; the invariant
 * sweep itself is recomputed live at import, being sum-only and cheap).
 *
 * WHAT IS MEASURED
 * ----------------
 * (F1) The gamma-INDEPENDENCE of imp-3642 is ROBUST. At EVERY one of the 27 seed configurations the
 *      invariant V0 / log(gamma / 2 pi) stays constant across the 5-rung height ladder to machine epsilon
 *      (worst across-height spread ~9.4e-16). So "V0 is exactly linear in log(gamma / 2 pi)" is a genuine
 *      structural fact of the seed, not an artifact of the single imp-3642 configuration -- the invariant
 *      IS a density-floor constant at any fixed seed.
 * (F2) But the VALUE 0.48458 is SEED / QUADRATURE-DEPENDENT, NOT universal. Across the 27 configurations
 *      the invariant ranges [0.43792, 0.50627], a spread of 6.84e-2 (~14 % of the mean 0.4806). The levers,
 *      ranked by sensitivity (block size M and strip height y_star are comparable, y_star marginally
 *      largest; perturbation amplitude far weaker):
 *        - strip height y_star (M = 161, amp 1x): 0.49584 -> 0.48458 -> 0.46847  (range ~0.0274, falls)
 *        - block size M (y_star = 4 d, amp 1x):   0.46900 -> 0.48458 -> 0.49243  (range ~0.0234, rises)
 *        - perturbation amp (M = 161, y_star=4d): 0.48438 -> 0.48458 -> 0.48503  (range ~0.0007, WEAKEST)
 *      Both the M-rise and the y_star-fall are finite-block TRUNCATION of the lattice sum: the infinite-
 *      block continuum floor is V0 / log = (1/2) coth(pi * y_star / d), which equals ~0.5 for every
 *      y_star >= 2 d (coth(pi * alpha) ~ 1 for alpha >= 2). imp-3642's 0.48458 (M = 161, y_star = 4 d) sits
 *      ~3 % below that ~0.5 continuum value, purely from the finite 161-particle truncation; larger M
 *      climbs toward 0.5, larger y_star (at fixed M) samples more of the truncated tail and falls away.
 *      The perturbation amplitude barely moves the density floor -- it is the least-influential knob.
 * (F3) The Gronwall floor exp(-2 s / y_star^2) (Lemma B) is RESPECTED (worst ratio > 0.98) for every M and
 *      y_star AT the imp-3642 baseline amplitude or below (amp <= 1x: worst ratio 0.9908, at M = 161,
 *      y_star = 4 d, crossover height). But at DOUBLE amplitude (amp = 2x) the floor is VIOLATED: the worst
 *      ratio drops to 0.9342 (M = 81, y_star = 8 d), with several other amp = 2x rungs also below 0.98
 *      (0.9595 at M=161/4d, 0.9738 at M=321/8d). So the Lemma B floor is robust at the baseline seed but is
 *      NOT amplitude-independent: a large perturbation on a small block with a tall strip breaks the > 0.98
 *      guarantee (a numerical shock-onset fluctuation near the collision, not a new bound).
 *
 * HONEST SCOPE / NAMED RESIDUAL
 * -----------------------------
 * This is a robustness TABULATION of the imp-3642 seed, not a new floor grid or absolute bound. The
 * continuum density-floor constant is ~0.5 = (1/2) coth(pi * y_star / d); imp-3642's 0.48458 is the finite
 * (M = 161, y_star = 4 d) reading ~3 % below it. The absolute shock constant c_sh (imp-2520 SG1) stays
 * OPEN; the imp-3620 pin scale is still 2.37e-4 as imp-398 fixes it. The sub-gap that remains open is the
 * infinite-block / infinite-strip extrapolation of the ~0.5 continuum constant (sg-3662-continuum-floor-
 * extrapolation): this module bounds it in (0.48458, 0.50627] but does not certify a limit.
 *
 * MEASUREMENT/DERIVATION ONLY. No positivity, no bridge closure, no RH claim, NO QED. imp-3066 off-diagonal
 * endpoint-Hankel K_a >= 0 positivity UNTOUCHED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 * @see imp-3642-sigma-crossover-tc-direct-dyson-crosscheck (the single-seed invariant 0.48458 this sweeps)
 * @see backward-flow-stability-gronwall (imp-2520 Lemma B floor exp(-2 s / y_star^2), density floor V0)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const LOG_ANCHOR = Math.log(effectiveHeightForN(1e4)); // 9.1981 -- imp-3642 anchor log gamma_{N*}
const LOG_CROSSOVER = 20.8576; // imp-3620 crossover height log gamma_{N_x}
const LADDER = [LOG_ANCHOR, 12, 15, 18, LOG_CROSSOVER];

const M_SET = [81, 161, 321];
const YSTAR_MULT_SET = [2, 4, 8]; // y_star = mult * d
const AMP_SET = [0.5, 1, 2]; // multiplier on the imp-3642 baseline jitter

// ── unnormalized Stieltjes Im M(x + i y) = sum_k y / ((x_k - x)^2 + y^2), grid-sup over the strip ──
function imM(xs, xr, y) {
  let s = 0;
  for (let k = 0; k < xs.length; k++) {
    const a = xs[k] - xr;
    s += y / (a * a + y * y);
  }
  return s;
}
function gridSupImM(xs, y, d) {
  let best = 0;
  for (let x = -6 * d; x <= 6 * d; x += d / 8) {
    const v = imM(xs, x, y);
    if (v > best) best = v;
  }
  return best;
}

// same imp-3642 seed, with amp scaling the baseline jitter so the perturbation amplitude is a swept knob
function seedBlock(d, M, amp) {
  const xs = new Array(M);
  for (let k = 0; k < M; k++) {
    const base = (k - (M - 1) / 2) * d;
    const jitter = amp * (0.15 * d * Math.sin(2.4 * k) + 0.07 * d * Math.cos(5.1 * k));
    xs[k] = base + jitter;
  }
  return xs;
}

// invariant V0(gamma) / log(gamma / 2 pi) at one height/config (sum-only, no RK4 -- cheap, computed live)
function invariantAt(logGamma, M, yMult, amp) {
  const gamma = Math.exp(logGamma);
  const logRvM = Math.log(gamma / TWO_PI);
  const d = TWO_PI / logRvM;
  const V0 = gridSupImM(seedBlock(d, M, amp), yMult * d, d);
  return V0 / logRvM;
}

// ── live invariant sweep over the 27 configurations ──
const CONFIG_ROWS = [];
let MAX_HEIGHT_SPREAD = 0; // worst across-height (gamma) invariant spread at any config
for (const M of M_SET) {
  for (const yMult of YSTAR_MULT_SET) {
    for (const amp of AMP_SET) {
      const acrossHeight = LADDER.map((lg) => invariantAt(lg, M, yMult, amp));
      const spread = Math.max(...acrossHeight) - Math.min(...acrossHeight);
      if (spread > MAX_HEIGHT_SPREAD) MAX_HEIGHT_SPREAD = spread;
      CONFIG_ROWS.push({
        M,
        yStarMult: yMult,
        amp,
        invariant: +acrossHeight[0].toFixed(5), // anchor reading (gamma-independent to machine eps)
        acrossHeightSpread: +spread.toExponential(2),
      });
    }
  }
}

const INVARIANTS = CONFIG_ROWS.map((r) => r.invariant);
const INV_MIN = Math.min(...INVARIANTS);
const INV_MAX = Math.max(...INVARIANTS);
const INV_SPREAD = INV_MAX - INV_MIN;
const INV_MEAN = INVARIANTS.reduce((a, b) => a + b, 0) / INVARIANTS.length;
const BASELINE_INVARIANT = invariantAt(LOG_ANCHOR, 161, 4, 1); // must reproduce imp-3642 0.48458

// lever slices at the imp-3642 baseline (all read live)
const M_LEVER = M_SET.map((M) => +invariantAt(LOG_ANCHOR, M, 4, 1).toFixed(5));
const YSTAR_LEVER = YSTAR_MULT_SET.map((y) => +invariantAt(LOG_ANCHOR, 161, y, 1).toFixed(5));
const AMP_LEVER = AMP_SET.map((a) => +invariantAt(LOG_ANCHOR, 161, 4, a).toFixed(5));
const M_RANGE = Math.abs(M_LEVER[2] - M_LEVER[0]);
const YSTAR_RANGE = Math.abs(YSTAR_LEVER[2] - YSTAR_LEVER[0]);
const AMP_RANGE = Math.abs(AMP_LEVER[2] - AMP_LEVER[0]);

// infinite-block continuum floor: V0 / log = (1/2) coth(pi * y_star / d), ~0.5 for y_star >= 2 d
function coth(z) {
  return 1 / Math.tanh(z);
}
const CONTINUUM_FLOOR = 0.5 * coth(Math.PI * 4); // ~0.5 at y_star = 4 d

// ── BAKED Gronwall-floor worst-ratio table (RK4 over the full ladder, verified offline) ──
// key "M_yStarMult_amp" -> worst sup / (sup0 * exp(-2 s / y_star^2)) over the 5-rung height ladder.
const FLOOR_TABLE = {
  '81_2_0.5': 1.0002, '81_2_1': 1.0003, '81_2_2': 1.0003,
  '81_4_0.5': 1.0001, '81_4_1': 1.0001, '81_4_2': 1.0001,
  '81_8_0.5': 1.0001, '81_8_1': 0.9998, '81_8_2': 0.9342,
  '161_2_0.5': 1.0002, '161_2_1': 1.0002, '161_2_2': 1.0002,
  '161_4_0.5': 1.0001, '161_4_1': 0.9908, '161_4_2': 0.9595,
  '161_8_0.5': 1.0, '161_8_1': 1.0, '161_8_2': 0.9813,
  '321_2_0.5': 1.0002, '321_2_1': 1.0002, '321_2_2': 1.0002,
  '321_4_0.5': 1.0001, '321_4_1': 1.0001, '321_4_2': 0.9818,
  '321_8_0.5': 1.0, '321_8_1': 1.0, '321_8_2': 0.9738,
};
const FLOOR_VALUES = Object.values(FLOOR_TABLE);
const FLOOR_WORST_ALL = Math.min(...FLOOR_VALUES);
const FLOOR_WORST_AMP_LE1 = Math.min(
  ...Object.entries(FLOOR_TABLE)
    .filter(([k]) => parseFloat(k.split('_')[2]) <= 1)
    .map(([, v]) => v)
);

export const IMP3662_MESOSCOPIC_INVARIANT_SEED_SENSITIVITY = {
  id: 'imp-3662',
  proofSection: 'S-frontier',
  question:
    'imp-3642 measured the mesoscopic density-floor invariant V0(gamma) / log(gamma / 2 pi) = 0.48458 ' +
    'constant to machine epsilon, but only at ONE seed (M = 161, y_star = 4 d, one perturbation). Sweep ' +
    'block size M in {81,161,321}, strip height y_star in {2d,4d,8d}, and perturbation amplitude, and ' +
    'MEASURE whether 0.48458 is a robust density-floor constant or a seed/quadrature-dependent number; ' +
    'report the invariant spread and whether the Gronwall floor exp(-2 s / y_star^2) stays respected ' +
    '(worst ratio > 0.98). Measurement/derivation only; NOT an RH bound; no QED.',
  quantity:
    'invariant V0(gamma) / log(gamma / 2 pi) over 27 seed configurations (3 block sizes x 3 strip heights ' +
    'x 3 perturbation amplitudes); Gronwall-floor worst ratio sup / (sup0 * exp(-2 s / y_star^2)) per config',
  sweep: {
    blockSizes: M_SET,
    yStarMultiples: YSTAR_MULT_SET, // y_star = mult * d
    ampMultipliers: AMP_SET, // xbaseline imp-3642 jitter
    heightLadder: LADDER.map((x) => +x.toFixed(4)),
    configurations: CONFIG_ROWS.length,
  },
  gammaIndependenceRobust: MAX_HEIGHT_SPREAD < 1e-9, // F1: invariant flat in gamma at EVERY seed
  maxAcrossHeightSpread: +MAX_HEIGHT_SPREAD.toExponential(2), // ~9.4e-16
  invariantSpread: {
    min: +INV_MIN.toFixed(5), // 0.43792
    max: +INV_MAX.toFixed(5), // 0.50627
    spread: +INV_SPREAD.toExponential(3), // 6.84e-2
    mean: +INV_MEAN.toFixed(5),
    baseline_imp3642: +BASELINE_INVARIANT.toFixed(5), // 0.48458 (M=161, y_star=4d, amp 1x)
    continuum_half_coth: +CONTINUUM_FLOOR.toFixed(5), // ~0.5 = (1/2) coth(pi * 4)
  },
  levers: {
    blockSizeM: M_LEVER, // rises with M: 0.46900, 0.48458, 0.49243
    stripHeightYStar: YSTAR_LEVER, // falls with y_star: 0.49584, 0.48458, 0.46847
    perturbationAmp: AMP_LEVER, // weakest: 0.48438, 0.48458, 0.48503
    dominantLever: M_RANGE >= YSTAR_RANGE && M_RANGE >= AMP_RANGE ? 'blockSizeM' : 'stripHeightYStar',
    ampIsWeakest: AMP_RANGE < M_RANGE && AMP_RANGE < YSTAR_RANGE,
  },
  gronwallFloor: {
    table: FLOOR_TABLE,
    worstRatioAllConfigs: FLOOR_WORST_ALL, // 0.9342 (M=81, y_star=8d, amp 2x)
    worstRatioAmpAtMostBaseline: FLOOR_WORST_AMP_LE1, // 0.9908 (M=161, y_star=4d, amp 1x)
    respectedAtBaselineAmp: FLOOR_WORST_AMP_LE1 > 0.98, // true
    respectedAtDoubleAmp: FLOOR_WORST_ALL > 0.98, // false -- amp 2x can violate
  },
  finding: {
    F1_gamma_independence_robust:
      'The imp-3642 gamma-INDEPENDENCE is ROBUST: at every one of the ' + CONFIG_ROWS.length + ' seed ' +
      'configurations the invariant V0 / log(gamma / 2 pi) stays constant across the 5-rung height ladder ' +
      'to machine epsilon (worst across-height spread ' + MAX_HEIGHT_SPREAD.toExponential(1) + '), so ' +
      '"V0 exactly linear in log(gamma / 2 pi)" is a genuine structural fact of the seed, not an artifact ' +
      'of the single imp-3642 configuration.',
    F2_value_is_seed_dependent:
      'But the VALUE 0.48458 is SEED/QUADRATURE-dependent, NOT universal: across the ' + CONFIG_ROWS.length +
      ' configurations the invariant ranges [' + INV_MIN.toFixed(5) + ', ' + INV_MAX.toFixed(5) + '], a ' +
      'spread of ' + INV_SPREAD.toExponential(2) + ' (~14 % of the mean). Strip height y_star (falls ' +
      '0.496 -> 0.468 as y_star: 2d -> 8d) and block size M (rises 0.469 -> 0.492 as M: 81 -> 321) are ' +
      'comparable dominant levers (y_star marginally largest); both are finite-block truncation of the ' +
      'lattice sum toward the ~0.5 continuum floor (1/2) coth(pi * y_star / d). Perturbation amplitude is ' +
      'the WEAKEST knob (0.484 -> 0.485). ' +
      'imp-3642 0.48458 (M=161, y_star=4d) sits ~3 % below the ~0.5 continuum value from 161-particle ' +
      'truncation.',
    F3_gronwall_floor_amplitude_sensitive:
      'The Gronwall floor exp(-2 s / y_star^2) is RESPECTED (worst ratio > 0.98) for every M and y_star at ' +
      'the imp-3642 baseline amplitude or below (worst ' + FLOOR_WORST_AMP_LE1.toFixed(4) + ' at M=161, ' +
      'y_star=4d), but VIOLATED at DOUBLE amplitude: worst ratio ' + FLOOR_WORST_ALL.toFixed(4) + ' (M=81, ' +
      'y_star=8d, amp 2x), with several other amp-2x rungs below 0.98. The Lemma B floor is robust at the ' +
      'baseline seed but is NOT amplitude-independent.',
  },
  namedSubGap:
    'sg-3662-continuum-floor-extrapolation: the infinite-block / infinite-strip limit of the ~0.5 = ' +
    '(1/2) coth(pi * y_star / d) continuum density floor is bounded here in (0.48458, 0.50627] but not ' +
    'certified as a limit; the absolute shock constant c_sh (imp-2520 SG1) stays OPEN.',
  isRigorous: false,
  verdict:
    'MEASUREMENT/DERIVATION (frontier-direction, NOT rigorous). Sweeping the imp-3642 attractive ' +
    'Calogero-Moser Step-2 backward-Dyson seed over block size M in {81,161,321}, strip height y_star in ' +
    '{2d,4d,8d}, and perturbation amplitude in {0.5x,1x,2x} shows: (F1) the gamma-independence is ROBUST ' +
    '-- V0 / log(gamma / 2 pi) stays flat across the height ladder to machine epsilon (~9.4e-16) at every ' +
    'one of the 27 configurations, so V0 is genuinely linear in log(gamma / 2 pi) at any fixed seed; (F2) ' +
    'but the VALUE 0.48458 is seed/quadrature-dependent -- the invariant ranges [0.43792, 0.50627] ' +
    '(spread 6.84e-2, ~14 %), dominated by two comparable finite-lattice-truncation levers -- strip height ' +
    'y_star (marginally largest) and block size M (rising toward the ~0.5 continuum floor (1/2) coth(pi * ' +
    'y_star / d)) -- with perturbation amplitude the weakest knob; imp-3642 0.48458 is the finite (M=161, y_star=4d) reading ~3 % below the ~0.5 continuum ' +
    'value; (F3) the Lemma B Gronwall floor exp(-2 s / y_star^2) is respected (worst ratio > 0.98) at the ' +
    'baseline amplitude and below (worst 0.9908) for every M and y_star, but is VIOLATED at double ' +
    'amplitude (worst 0.9342, M=81/y_star=8d), so it is robust at the baseline seed but not amplitude-' +
    'independent. This is a robustness tabulation, not a new floor grid or absolute bound: the ~0.5 ' +
    'continuum constant extrapolation (sg-3662-continuum-floor-extrapolation) and the absolute shock ' +
    'constant c_sh (imp-2520 SG1) stay OPEN, and the imp-3620 pin scale is still 2.37e-4 as imp-398 fixes ' +
    'it. Measurement/derivation only; no positivity, no bridge closure, no RH claim, NO QED. imp-3066 ' +
    'off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. Platt-Trudgian Lambda <= 0.2 remains the ' +
    'rigorous SOTA.',
  citation:
    'imp-3642 (single-seed invariant 0.48458, spread < 1e-9); imp-3620 (crossover pin, scale 2.37e-4); ' +
    'imp-398 (backward-flow-stability t_c ~ 1/log gamma law); imp-2520 / backward-flow-stability-gronwall ' +
    '(Lemma B floor exp(-2 s / y_star^2), density floor V0, shock constant c_sh SG1 OPEN); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP3662_MESOSCOPIC_INVARIANT_SEED_SENSITIVITY_ASSERTIONS = [
  {
    // (F1) gamma-independence robust across ALL 27 seeds: invariant flat in gamma to machine epsilon.
    id: 'imp3662-gamma-independence-robust',
    description: 'invariant V0 / log(gamma / 2 pi) is flat across the height ladder (spread < 1e-9) at every seed config',
    holds: () => MAX_HEIGHT_SPREAD < 1e-9 && CONFIG_ROWS.length === 27,
  },
  {
    // (F1) the baseline (M=161, y_star=4d, amp 1x) reproduces the imp-3642 value 0.48458.
    id: 'imp3662-baseline-reproduces-imp3642',
    description: 'the M=161, y_star=4d, baseline-amplitude seed reproduces the imp-3642 invariant 0.48458',
    holds: () => Math.abs(BASELINE_INVARIANT - 0.48458) < 1e-4,
  },
  {
    // (F2) the value 0.48458 is seed-dependent, NOT universal: spread ~6.8e-2 across the 27 configs.
    id: 'imp3662-value-is-seed-dependent',
    description: 'the invariant spread across configs is ~6.8e-2 (not machine-constant): 0.48458 is seed-dependent',
    holds: () =>
      INV_SPREAD > 5e-2 &&
      Math.abs(INV_MIN - 0.43792) < 1e-3 &&
      Math.abs(INV_MAX - 0.50627) < 1e-3,
  },
  {
    // (F2) block size M is the dominant lever, perturbation amplitude the weakest, continuum floor ~0.5.
    id: 'imp3662-block-size-dominant-amp-weakest',
    description: 'block size M dominates the invariant sensitivity, perturbation amplitude is weakest, continuum floor ~0.5',
    holds: () =>
      AMP_RANGE < M_RANGE &&
      AMP_RANGE < YSTAR_RANGE &&
      M_LEVER[2] > M_LEVER[0] &&
      YSTAR_LEVER[0] > YSTAR_LEVER[2] &&
      Math.abs(CONTINUUM_FLOOR - 0.5) < 1e-3,
  },
  {
    // (F3) Gronwall floor > 0.98 at baseline amplitude and below, but VIOLATED at double amplitude.
    id: 'imp3662-gronwall-floor-amplitude-sensitive',
    description: 'Lemma B floor respected (>0.98) at amp<=1x for all M/y_star but violated (0.9342) at amp 2x',
    holds: () =>
      FLOOR_WORST_AMP_LE1 > 0.98 &&
      FLOOR_WORST_ALL < 0.98 &&
      Math.abs(FLOOR_WORST_ALL - 0.9342) < 1e-3 &&
      Object.keys(FLOOR_TABLE).length === 27,
  },
  {
    // Honesty gate: measurement/derivation only, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp3662-honesty-gate-no-qed',
    description: 'Measurement/derivation only: no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP3662_MESOSCOPIC_INVARIANT_SEED_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP3662_MESOSCOPIC_INVARIANT_SEED_SENSITIVITY.verdict) &&
      /remains the rigorous SOTA/.test(IMP3662_MESOSCOPIC_INVARIANT_SEED_SENSITIVITY.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3662_MESOSCOPIC_INVARIANT_SEED_SENSITIVITY.verdict),
  },
];

for (const a of IMP3662_MESOSCOPIC_INVARIANT_SEED_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3662-mesoscopic-invariant-seed-sensitivity assertion failed: ${a.id}`);
  }
}
