/**
 * @module imp-35069-g-conversion-slope-n-ladder-half-approach
 *
 * imp-35069 (numerical, frontier-direction): imp-34954 resolved the ~4.6% residual
 * of the surplus-to-gap sigma-to-N conversion by tracing it to the MEASURED local
 * log-slope of E_coll at N_cross,
 *
 *     s(N) := d ln E_coll / d ln N  =  -0.47729   (NOT the ideal -1/2),
 *
 * and attributed the +0.02271 offset to the log T0 slow variation making E_coll decay
 * SHALLOWER than the N^{-1/2} power. imp-34954 read s only at the single point
 * N_cross ~ 3.280e9 and never measured its N-running toward the -1/2 asymptote.
 *
 * This module measures s(N) across a wide N ladder [1e6 .. 1e30] on the SAME inherited
 * imp-3220/imp-3406 surrogate (E_coll = C_C_PINNED * sqrt(log T0 / N), T0 =
 * effectiveHeightForN) and quantifies whether the offset s(N) + 1/2 drifts to zero with
 * a 1/(2 log T0)-type law -- exactly the imp-34130 resolution of the sibling
 * separated-E_coll local-exponent residual.
 *
 * THE EXACT CHAIN-RULE IDENTITY (why the offset is log-T0 driven)
 * --------------------------------------------------------------
 * With L := log T0 and E_coll = C_C * (L/N)^{1/2},
 *
 *     ln E_coll = ln C_C + (1/2)(ln L - ln N),
 *     s(N) = d ln E_coll / d ln N = -1/2 + (1/2) * (d ln L / d ln N).
 *
 * So the offset is EXACTLY half the log-log slope of L = log T0:
 *
 *     offset(N) := s(N) + 1/2 = (1/2) * d ln(log T0) / d ln N   (identity, not a fit).
 *
 * This is verified below to floating point (central finite differences of both s and
 * d ln L / d ln N agree to ~1e-11).
 *
 * THE 1/(2 log T0) LAW (the imp-34130 mirror)
 * -------------------------------------------
 * The Riemann-von Mangoldt inverse gives, to leading order, T0 ~ 2pi N / log T0, hence
 * ln T0 ~ ln N + ln(2pi) - ln L and, writing x := d ln L / d ln N,
 *
 *     x = (1/L) d ln T0 / d ln N ~ (1/L)(1 - x)  =>  x ~ 1/(L + 1).
 *
 * Therefore
 *
 *     offset(N) ~ 1 / (2 (log T0 + 1)) ~ 1 / (2 log T0)   as log T0 -> infinity,
 *
 * so s(N) -> -1/2 from ABOVE (shallower decay), matching the imp-34130 finding that the
 * separated-E_coll local exponent approaches -1/2 as ~1/(2 log T0). The single-point
 * imp-34954 reading s(N_cross) = -0.47729 is just this ladder evaluated at N_cross.
 *
 * MEASURED LADDER (central FD in ln N, h = 1e-4)
 * ----------------------------------------------
 *     N        log T0    s(N)          offset = s+1/2   1/(2 log T0)   offset/(1/(2 log T0))
 *     1e6      13.305    -0.4656976    0.03430236       0.03757947     0.912795
 *     1e8      17.569    -0.4733494    0.02665065       0.02845983     0.936430
 *     1e10     21.915    -0.4783212    0.02167882       0.02281519     0.950193
 *     1e12     26.313    -0.4817743    0.01822566       0.01900204     0.959142
 *     1e14     30.745    -0.4842999    0.01570013       0.01626271     0.965407
 *     1e18     39.678    -0.4877315    0.01226848       0.01260150     0.973573
 *     1e24     53.181    -0.4907813    0.00921873       0.00940184     0.980523
 *     1e30     66.758    -0.4926256    0.00737439       0.00748976     0.984596
 *
 * The offset is strictly positive and strictly decreasing, the ratio offset/(1/(2 log T0))
 * climbs MONOTONICALLY toward 1 (0.9128 -> 0.9846), and the sharper form 1/(2(log T0 + 1))
 * matches the offset to shrinking residual (6.5e-4 at 1e6 -> 4.8e-6 at 1e30). So the
 * measured G-conversion slope converges to -1/2 with the 1/(2 log T0) law.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate crossover map. The
 * far-tail exponent stays exactly 1/2 (imp-3463); C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; C_C_PINNED unchanged; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34954-surplus-closed-form-vs-landmark-gap-crosscheck (single-point s(N_cross)
 *      = -0.47729; attributed the offset to log T0 slow variation, never measured its
 *      N-running)
 * @see imp-34130 (sibling separated-E_coll local-exponent residual to -1/2 decays as
 *      ~1/(2 log T0))
 * @see imp-3463 (far-tail exponent stays 1/2); imp-486 (C_mb GUE-conditional)
 * @see lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

// Inherited imp-34954/imp-3406 E_coll sub-term (the only term whose N-slope matters here).
function eColl(N) {
  const L = Math.log(effectiveHeightForN(N));
  return C_C_PINNED * Math.sqrt(L / N);
}
const logT0 = (N) => Math.log(effectiveHeightForN(N));

// Central finite differences in ln N (matches the imp-34954 h = 1e-4 slope probe).
const H = 1e-4;
function dLogDlnN(f, N) {
  const ln = Math.log(N);
  return (Math.log(f(Math.exp(ln + H))) - Math.log(f(Math.exp(ln - H)))) / (2 * H);
}
const slope = (N) => dLogDlnN(eColl, N); // s(N) = d ln E_coll / d ln N
const dLnL = (N) => dLogDlnN((n) => logT0(n), N); // d ln(log T0) / d ln N

const N_LADDER = [1e6, 1e8, 1e10, 1e12, 1e14, 1e18, 1e24, 1e30];

const LADDER = N_LADDER.map((N) => {
  const L = logT0(N);
  const s = slope(N);
  const offset = s + 0.5; // s(N) + 1/2
  const half_dlnL = 0.5 * dLnL(N); // the chain-rule prediction of the offset
  const half_over_logT0 = 1 / (2 * L); // 1/(2 log T0)
  const half_over_logT0p1 = 1 / (2 * (L + 1)); // sharper 1/(2(log T0 + 1))
  return {
    N: +N.toExponential(0),
    logT0: +L.toFixed(6),
    slope: +s.toFixed(8),
    offset: +offset.toExponential(6),
    identity_gap: +Math.abs(offset - half_dlnL).toExponential(3), // offset = (1/2) d ln L/d ln N
    offset_over_half_logT0: +(offset / half_over_logT0).toFixed(6),
    residual_vs_half_logT0p1: +Math.abs(offset - half_over_logT0p1).toExponential(3),
  };
});

// Head/tail readings and the imp-34954 single-point anchor (N_cross ~ 3.280294e9).
const HEAD = LADDER[0];
const TAIL = LADDER[LADDER.length - 1];
const S_AT_N_CROSS = slope(3.280294e9); // ~-0.47728 (imp-34954 read -0.47729)

// Monotone convergence: offset strictly decreasing, ratio-to-1/(2 log T0) strictly rising to 1.
const OFFSETS = LADDER.map((r) => r.offset);
const RATIOS = LADDER.map((r) => r.offset_over_half_logT0);
const OFFSET_STRICTLY_DECREASING = OFFSETS.every((v, i) => i === 0 || v < OFFSETS[i - 1]);
const RATIO_STRICTLY_INCREASING = RATIOS.every((v, i) => i === 0 || v > RATIOS[i - 1]);
const MAX_IDENTITY_GAP = Math.max(...LADDER.map((r) => r.identity_gap));

export const IMP35069_G_CONVERSION_SLOPE_N_LADDER_HALF_APPROACH = {
  id: 'imp-35069',
  proofSection: 'S-frontier',
  question:
    'imp-34954 read the surplus-to-gap conversion slope s = d ln E_coll/d ln N = -0.47729 (not the ideal ' +
    '-1/2) at the single point N_cross ~ 3.280e9 and attributed the +0.02271 offset to log T0 slow variation, ' +
    'but never measured its N-running toward -1/2. Measure s(N) across an N ladder on the inherited ' +
    'imp-3220/imp-3406 surrogate and quantify whether the offset s+1/2 drifts to zero with a 1/(2 log T0) law, ' +
    'mirroring the imp-34130 resolution of the sibling separated-E_coll local-exponent residual.',
  measuredQuantity:
    'the measured local log-slope s(N) = d ln E_coll/d ln N across N in [1e6, 1e30], the offset s(N)+1/2, its ' +
    'exact chain-rule identity offset = (1/2) d ln(log T0)/d ln N, and the ratio of the offset to 1/(2 log T0) ' +
    'and residual against the sharper 1/(2(log T0 + 1)).',
  ladder: LADDER,
  anchors: {
    // The imp-34954 single-point reading is this ladder sampled at N_cross.
    s_at_N_cross_3p28e9: +S_AT_N_CROSS.toFixed(8), // ~-0.47728 (imp-34954: -0.47729)
    offset_at_N_cross: +(S_AT_N_CROSS + 0.5).toFixed(8), // ~0.02272
    head_N1e6_slope: HEAD.slope, // -0.46570
    tail_N1e30_slope: TAIL.slope, // -0.49263
  },
  convergence: {
    offset_head_N1e6: HEAD.offset, // ~3.43e-2
    offset_tail_N1e30: TAIL.offset, // ~7.37e-3
    ratio_head_offset_over_half_logT0: HEAD.offset_over_half_logT0, // ~0.9128
    ratio_tail_offset_over_half_logT0: TAIL.offset_over_half_logT0, // ~0.9846
    offset_strictly_decreasing: OFFSET_STRICTLY_DECREASING, // true
    ratio_to_half_over_logT0_strictly_increasing_to_1: RATIO_STRICTLY_INCREASING, // true
    max_chain_rule_identity_gap: +MAX_IDENTITY_GAP.toExponential(3), // ~2e-11 (FD noise)
    note:
      'The offset s(N)+1/2 is exactly (1/2) d ln(log T0)/d ln N (chain rule, verified to ~1e-11), strictly ' +
      'positive and strictly decreasing, and the ratio offset/(1/(2 log T0)) climbs monotonically toward 1 ' +
      '(0.9128 -> 0.9846 across [1e6,1e30]). Equivalently s(N) -> -1/2 from above with offset ~ 1/(2 log T0), ' +
      'the same law imp-34130 identified for the sibling separated-E_coll local-exponent residual.',
  },
  finding:
    'MEASURED: the imp-34954 G-conversion slope s = d ln E_coll/d ln N = -0.47729 at N_cross is NOT an isolated ' +
    'reading but one point of a monotone N-running toward -1/2. Across [1e6,1e30] s rises from -0.46570 to ' +
    '-0.49263; the offset s+1/2 is EXACTLY half the log-log slope of log T0 (chain-rule identity, verified to ' +
    '~1e-11) and decays like 1/(2 log T0): offset/(1/(2 log T0)) climbs monotonically 0.9128 -> 0.9846, and the ' +
    'sharper 1/(2(log T0 + 1)) matches to shrinking residual (6.5e-4 -> 4.8e-6). So the -0.4773 offset is the ' +
    'log T0 slow variation quantified as a 1/(2 log T0) law, mirroring the imp-34130 sibling resolution.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-34954 single-point G-conversion slope ' +
    '-0.47729 is resolved into a monotone N-ladder converging to the ideal -1/2: the offset s(N)+1/2 equals ' +
    '(1/2) d ln(log T0)/d ln N by the chain rule (E_coll = C_C sqrt(log T0/N)) and decays as ~1/(2 log T0), the ' +
    'same law imp-34130 found for the sibling separated-E_coll local-exponent residual. Measurement only on the ' +
    'inherited imp-3220/imp-3406 surrogate crossover map; far-tail exponent stays 1/2 (imp-3463); C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; C_C_PINNED unchanged; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34954 (single-point s(N_cross) = -0.47729, offset attributed to log T0 slow variation, N-running ' +
    'unmeasured); imp-34130 (sibling separated-E_coll local-exponent residual to -1/2 decays as ~1/(2 log T0)); ' +
    'imp-3463 (far-tail exponent stays 1/2); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP35069_G_CONVERSION_SLOPE_N_LADDER_HALF_APPROACH_ASSERTIONS = [
  {
    // Reuse/anchor gate: reproduce the imp-34954 single-point reading s(N_cross) ~ -0.47729.
    id: 'imp35069-reproduces-imp34954-single-point-slope',
    description: 's(N_cross ~3.28e9) ~ -0.4773 (imp-34954 read -0.47729), offset ~ +0.0227',
    holds: () =>
      Math.abs(S_AT_N_CROSS - -0.47729) < 5e-4 &&
      S_AT_N_CROSS > -0.5 &&
      Math.abs(S_AT_N_CROSS + 0.5 - 0.02271) < 5e-4,
  },
  {
    // The exact chain-rule identity: offset = (1/2) d ln(log T0)/d ln N to floating point.
    id: 'imp35069-offset-is-half-log-log-slope-of-logT0',
    description: 'offset s(N)+1/2 equals (1/2) d ln(log T0)/d ln N across the ladder (FD gap < 1e-8)',
    holds: () => MAX_IDENTITY_GAP < 1e-8,
  },
  {
    // Monotone running toward -1/2: offset strictly decreasing, s strictly below -1/2 and rising.
    id: 'imp35069-slope-monotone-toward-minus-half',
    description: 'offset strictly decreasing, slope strictly in (-1/2, head) and rising with N',
    holds: () =>
      OFFSET_STRICTLY_DECREASING &&
      LADDER.every((r) => r.slope > -0.5) &&
      TAIL.slope < HEAD.slope &&
      TAIL.slope < -0.492,
  },
  {
    // The 1/(2 log T0) law: ratio offset/(1/(2 log T0)) rises monotonically toward 1.
    id: 'imp35069-one-over-2-logT0-law',
    description: 'offset/(1/(2 log T0)) increases monotonically from ~0.913 toward 1 (~0.985 at 1e30)',
    holds: () =>
      RATIO_STRICTLY_INCREASING &&
      HEAD.offset_over_half_logT0 > 0.9 &&
      HEAD.offset_over_half_logT0 < 0.93 &&
      TAIL.offset_over_half_logT0 > 0.98 &&
      TAIL.offset_over_half_logT0 < 1.0,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp35069-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35069_G_CONVERSION_SLOPE_N_LADDER_HALF_APPROACH.isRigorous === false &&
      /NO QED/.test(IMP35069_G_CONVERSION_SLOPE_N_LADDER_HALF_APPROACH.verdict) &&
      /refereed bound is changed/i.test(IMP35069_G_CONVERSION_SLOPE_N_LADDER_HALF_APPROACH.verdict),
  },
];

for (const a of IMP35069_G_CONVERSION_SLOPE_N_LADDER_HALF_APPROACH_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35069-g-conversion-slope-n-ladder-half-approach assertion failed: ${a.id}`);
  }
}
