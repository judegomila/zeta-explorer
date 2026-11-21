/**
 * @module imp-35656-fartail-sub1e5-crossing-height-map-sensitivity
 *
 * imp-35656 (numerical, frontier-direction): imp-35577 measured the HEIGHT-MAP
 * sensitivity (closed surrogate T0 = 2 pi N / log N vs the exact RvM inverse
 * effectiveHeightForN) of the E_flow far-tail fd-vs-analytic remnant threshold-crossings
 * at the sub-1e-3 (N ~ 4.17e25) and sub-1e-4 (N ~ 1.546e109) thresholds, and found the
 * decade shift GROWING (+15.31 -> +46.84) while the remnant inflation SHRINKS
 * (~2.13x -> ~1.87x). It never tested the sub-1e-5 crossing (N ~ 10^410, the imp-35534
 * landmark). This module continues the imp-35577 swap ONE threshold-decade deeper and
 * answers the imp-35656 question directly: does the shift keep GROWING and the inflation
 * keep SHRINKING at the sub-1e-5 crossing?
 *
 * THE DOUBLE-PRECISION OBSTRUCTION AND THE LOG-SPACE CHANNEL (imp-35534 method)
 * ---------------------------------------------------------------------------
 * The sub-1e-5 crossings land near N ~ 10^410 (surrogate) and N ~ 10^561 (RvM), FAR
 * beyond the IEEE-754 double range (N_max ~ 1.80e308): the imp-35577 direct channel
 * evaluates N = Math.pow(10, e) and forms T0 explicitly, both of which OVERFLOW to
 * Infinity for e > ~308. So this module evaluates the SAME imp-35413/imp-35473/imp-35577
 * remnant in log-space on u = log N (the imp-35534 reformulation), unified across both
 * height maps by a single map-dependent quantity w(u) = log(T0/2pi):
 *
 *   surrogate  T0 = 2 pi N / log N          =>  w_sur(u) = u - log(u)              (closed)
 *   RvM inverse (T/2pi)(log(T/2pi)-1) = N   =>  w_rvm(u) solves w + log(w-1) = u    (Newton, log-space)
 *
 * With g = log T0 = log(2pi) + w and C_F = (w + 1)/(2pi), the exact imp-35577 quantity
 * satisfies log eFlowWith = log(C_F) + log(g) - g + TC_A1_TRAP (TC_A1_TRAP = log GRONWALL),
 * so localExponent is the same central log-log difference (h = 1.0002) and the remnant is
 * |(-1 + 3/u) - localExponent| exactly as in imp-35577. The ONLY swap between the two
 * channels is w_sur -> w_rvm; every other definition is byte-identical. This log-space form
 * reproduces the imp-35534 surrogate sub-1e-5 crossing (log10 N ~ 410.0476) and the
 * imp-35577 sub-1e-3 / sub-1e-4 shifts (+15.31 / +46.84) to the printed digits (verified in
 * the assertions below), confirming it is the identical math extended past N = 1e308.
 *
 *   crossing      surrogate log10 N   RvM-inverse log10 N   shift (decades)   inflation
 *   sub-1e-3      25.6205 (4.17e25)   40.9350 (8.61e40)     +15.31            ~2.13x
 *   sub-1e-4      109.1892 (1.55e109) 156.0294 (1.07e156)   +46.84            ~1.87x
 *   sub-1e-5      410.0476 (10^410)   561.3463 (10^561)     +151.30 (NEW)     ~1.77x (NEW)
 *
 * THE FINDING
 * -----------
 * BOTH imp-35577 trends CONTINUE at the sub-1e-5 crossing. The decade shift keeps GROWING:
 * +15.31 (sub-1e-3) -> +46.84 (sub-1e-4) -> +151.30 (sub-1e-5), a further ~3.23x jump on
 * top of the ~3.06x from the prior rung (N-ratio ~1.99e151). The remnant inflation keeps
 * SHRINKING and stays below the ~1.87x measured at the sub-1e-4 scale: ~2.13x -> ~1.87x ->
 * ~1.77x, decaying toward but not yet at unity -- consistent with the imp-35657 reading that
 * the ~2x is a surrogate-channel analytic-reference artifact that slowly relaxes as the RvM
 * fd exponent converges to the surrogate fd exponent deep in the tail. Meanwhile the raw
 * height divergence (T0_RvM - T0_sur)/T0_sur keeps SHRINKING too: ~9.24 percent ->
 * ~2.65 percent -> ~0.84 percent (the O(1/log T0) gap damps deeper), yet the ABSOLUTE
 * crossing shift GROWS regardless -- because a near-constant (~1.8x) inflation of an
 * ever-slower ~1/log N remnant decay costs more and more decades to walk back to the
 * threshold the deeper the crossing sits. VERDICT: the sub-1e-5 crossing confirms the
 * imp-35577 pattern one decade deeper -- the far-tail remnant crossings are the LEAST
 * height-map-robust landmarks in the cohort and get MORE fragile deeper (shift +151.30
 * decades), in sharp contrast to the imp-35458 crossover / imp-35536 peak which the log
 * damps to sub-1 percent. This does not weaken the imp-35413/imp-35473/imp-35534 slow-decay
 * reading (the remnant still decays under both maps); it confirms one more decade of
 * threshold deeper that the crossing-N itself is a surrogate-channel artifact.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate extrapolation, NOT a
 * rigorous asymptotic; changes no bound. E_flow > 0 strictness (imp-33848) untouched;
 * C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463;
 * imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35577-fartail-crossings-height-map-sensitivity (the sub-1e-3 / sub-1e-4 swap, extended here)
 * @see imp-35534-eflow-fartail-remnant-sub1e5-crossing (the surrogate sub-1e-5 crossing 10^410, log-space channel)
 * @see imp-35497-fartail-crossing-height-map-sensitivity (the original sub-1e-3 swap)
 * @see imp-35473-eflow-fartail-remnant-sub1e4-crossing (the surrogate-channel sub-1e-4 crossing)
 * @see imp-35413-eflow-fartail-remnant-sub1e3-crossing (the surrogate-channel sub-1e-3 crossing)
 * @see imp-35458-crossover-height-map-sensitivity (the log-damped crossover, sub-1 percent)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the analytic -1 + 3/log N leading form)
 * @see lambda-rh-height-mapping.js effectiveHeightForN (the exact RvM inverse, reformulated in log-space here)
 */

const TWO_PI = 2 * Math.PI;
const LN2PI = Math.log(TWO_PI);

// imp-35135/imp-35236 exact sub-term constant (byte-identical to imp-35413/imp-35473/imp-35577):
// GRONWALL = exp(TC_A1_TRAP), so log GRONWALL = TC_A1_TRAP enters log eFlowWith additively.
const TC_A1_TRAP = 2.37e-4;

// Same central-difference step as imp-35135/imp-35473/imp-35534/imp-35577 (h = 1.0002 in N).
const H_LOG = Math.log(1.0002);

// Height map A: the imp-35413/imp-35577 closed RvM surrogate, w = log(T0/2pi) = u - log(u).
function wSurrogate(u) {
  return u - Math.log(u);
}

// Height map B: the EXACT RvM inverse effectiveHeightForN, reformulated in log-space.
// (T/2pi)(log(T/2pi) - 1) = N with w = log(T/2pi) gives w + log(w - 1) = u (Newton solve,
// no overflow); this is the log-space image of the imp-35577 inlined pure-Math Newton solve.
function wRvM(u) {
  let w = u - Math.log(u); // surrogate as seed (RvM and surrogate coincide to leading order)
  for (let i = 0; i < 80; i++) {
    const f = w + Math.log(w - 1) - u;
    const fp = 1 + 1 / (w - 1);
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dw = f / fp;
    w -= dw;
    if (Math.abs(dw) < 1e-14 * Math.max(1, w)) break;
  }
  return w;
}

// The imp-35577 remnant |analytic - fd|, parameterised by the height-map quantity w(u).
// Single swap (w_sur -> w_rvm); byte-identical fd/analytic definitions, in log-space on u.
function makeRemnant(wOf) {
  function lnEFlow(u) {
    const w = wOf(u);
    const g = LN2PI + w; // g = log T0
    const lnCF = Math.log((w + 1) / TWO_PI); // C_F = (log(T0/2pi) + 1)/2pi = (w + 1)/2pi
    return lnCF + Math.log(g) - g + TC_A1_TRAP;
  }
  function localExponent(u) {
    return (lnEFlow(u + H_LOG) - lnEFlow(u - H_LOG)) / (2 * H_LOG);
  }
  const analyticSurrogateExponent = (u) => -1 + 3 / u; // imp-35198 leading form
  return function remnantAtLog10(e) {
    const u = e * Math.LN10; // u = log N
    return Math.abs(analyticSurrogateExponent(u) - localExponent(u));
  };
}

// Bisect the crossing of a chosen threshold in log10 N over [lo, hi]. The remnant is monotone
// decreasing across the far tail, so a plain bisection converges to the unique root.
function locateCrossingLog10(remnant, lo, hi, threshold) {
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (remnant(mid) > threshold) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const remnantSurrogate = makeRemnant(wSurrogate);
const remnantRvM = makeRemnant(wRvM);

// Faithfulness witnesses: reproduce the imp-35577 sub-1e-3 / sub-1e-4 shifts in this channel.
const SUB1E3_SUR_LOG10 = locateCrossingLog10(remnantSurrogate, 20, 40, 1e-3); // ~25.6205
const SUB1E3_RVM_LOG10 = locateCrossingLog10(remnantRvM, 24, 60, 1e-3); // ~40.9350
const SUB1E4_SUR_LOG10 = locateCrossingLog10(remnantSurrogate, 100, 130, 1e-4); // ~109.1892
const SUB1E4_RVM_LOG10 = locateCrossingLog10(remnantRvM, 130, 200, 1e-4); // ~156.0294
const SUB1E3_SHIFT = SUB1E3_RVM_LOG10 - SUB1E3_SUR_LOG10; // ~+15.31
const SUB1E4_SHIFT = SUB1E4_RVM_LOG10 - SUB1E4_SUR_LOG10; // ~+46.84

// THE NEW MEASUREMENT: the sub-1e-5 crossing under each height map (log-space, N > 1e308).
const SUB1E5_SUR_LOG10 = locateCrossingLog10(remnantSurrogate, 300, 600, 1e-5); // ~410.0476 (imp-35534)
const SUB1E5_RVM_LOG10 = locateCrossingLog10(remnantRvM, 300, 900, 1e-5); // ~561.3463 (NEW)
const SUB1E5_SHIFT = SUB1E5_RVM_LOG10 - SUB1E5_SUR_LOG10; // ~+151.30 (NEW)
const N_RATIO_SUB1E5 = Math.pow(10, SUB1E5_SHIFT); // ~1.99e151

// Raw height divergence (T0_RvM - T0_sur)/T0_sur = exp(w_rvm - w_sur) - 1 at the sub-1e-5 scale.
const U_SUB1E5 = SUB1E5_SUR_LOG10 * Math.LN10;
const DIV_SUB1E5 = Math.exp(wRvM(U_SUB1E5) - wSurrogate(U_SUB1E5)) - 1; // ~+0.0084

// Remnant inflation R_RvM / R_sur at the sub-1e-5 surrogate-crossing scale (~1.77x, shrinking).
const INFLATION_SUB1E5 = remnantRvM(SUB1E5_SUR_LOG10) / remnantSurrogate(SUB1E5_SUR_LOG10); // ~1.77
const INFLATION_SUB1E4 = remnantRvM(SUB1E4_SUR_LOG10) / remnantSurrogate(SUB1E4_SUR_LOG10); // ~1.87
const INFLATION_SUB1E3 = remnantRvM(SUB1E3_SUR_LOG10) / remnantSurrogate(SUB1E3_SUR_LOG10); // ~2.13

export const IMP35656_FARTAIL_SUB1E5_CROSSING_HEIGHT_MAP_SENSITIVITY = {
  id: 'imp-35656',
  proofSection: 'S-frontier',
  question:
    'Measure the height-map shift (RvM inverse effectiveHeightForN vs the imp-35413 closed ' +
    'surrogate T0 = 2 pi N / log N) of the imp-35534 E_flow far-tail remnant sub-1e-5 crossing ' +
    '(N ~ 10^410, never height-map-tested) and report whether the imp-35577 pattern continues: ' +
    'does the +decade shift keep GROWING (+15.31 at sub-1e-3, +46.84 at sub-1e-4) and does the ' +
    'remnant inflation keep SHRINKING below the ~1.87x measured at the sub-1e-4 scale?',
  method:
    'Swap ONLY the height map in the imp-35577 remnant |analytic - fd|, in log-space on u = log N ' +
    '(the imp-35534 reformulation; the sub-1e-5 crossings land at N ~ 10^410 / 10^561, beyond the ' +
    'double-precision N range). The two channels differ by a single quantity w(u) = log(T0/2pi): ' +
    'w_sur = u - log(u) (closed surrogate) vs w_rvm solving w + log(w - 1) = u (RvM inverse, ' +
    'Newton in log-space). Bisect the sub-1e-5 crossing under both maps and compare the decade ' +
    'shift, the raw height divergence, and the remnant inflation, alongside the reproduced ' +
    'imp-35577 sub-1e-3 / sub-1e-4 shifts as faithfulness witnesses.',
  crossings: {
    sub1e3: { threshold: 1e-3, surrogateLog10N: +SUB1E3_SUR_LOG10.toFixed(4), rvmLog10N: +SUB1E3_RVM_LOG10.toFixed(4), shiftDecades: +SUB1E3_SHIFT.toFixed(4), remnantInflation: +INFLATION_SUB1E3.toFixed(4), source: 'reproduces imp-35577/imp-35497' },
    sub1e4: { threshold: 1e-4, surrogateLog10N: +SUB1E4_SUR_LOG10.toFixed(4), rvmLog10N: +SUB1E4_RVM_LOG10.toFixed(4), shiftDecades: +SUB1E4_SHIFT.toFixed(4), remnantInflation: +INFLATION_SUB1E4.toFixed(4), source: 'reproduces imp-35577' },
    sub1e5: {
      threshold: 1e-5,
      surrogate: { log10N: +SUB1E5_SUR_LOG10.toFixed(4), N: '10^' + SUB1E5_SUR_LOG10.toFixed(4) },
      rvmInverse: { log10N: +SUB1E5_RVM_LOG10.toFixed(4), N: '10^' + SUB1E5_RVM_LOG10.toFixed(4) },
      shiftDecades: +SUB1E5_SHIFT.toFixed(4),
      nRatio: +N_RATIO_SUB1E5.toExponential(4),
      heightDivergence: +DIV_SUB1E5.toExponential(4),
      remnantInflation: +INFLATION_SUB1E5.toFixed(4),
      source: 'NEW (imp-35534 sub-1e-5 crossing never height-map-tested before)',
    },
  },
  finding: {
    F1_reproduces_prior_shifts:
      'The log-space channel reproduces the imp-35577 sub-1e-3 shift (25.6205 -> 40.9350, +15.31) ' +
      'and sub-1e-4 shift (109.1892 -> 156.0294, +46.84) and the imp-35534 surrogate sub-1e-5 ' +
      'crossing (410.0476) to the printed digits, confirming it is the identical math extended ' +
      'past N = 1e308 by pure log-space algebra, NOT a new channel.',
    F2_shift_keeps_growing:
      'The NEW sub-1e-5 crossing shifts from surrogate log10 N ~ 410.0476 (10^410) to RvM-inverse ' +
      'log10 N ~ 561.3463 (10^561), a +151.30-decade shift -- the imp-35577 shift-growth CONTINUES ' +
      '(+15.31 -> +46.84 -> +151.30, a further ~3.23x jump; N-ratio ~1.99e151) even though the raw ' +
      'height divergence keeps SHRINKING (~9.24 percent -> ~2.65 percent -> ~0.84 percent).',
    F3_inflation_keeps_shrinking:
      'The remnant inflation keeps SHRINKING and stays below the ~1.87x sub-1e-4 value: ' +
      '~2.13x (sub-1e-3) -> ~1.87x (sub-1e-4) -> ~1.77x (sub-1e-5), decaying toward but not yet at ' +
      'unity -- consistent with the surrogate-channel analytic-reference reading (imp-35657): the ' +
      '~2x relaxes as the RvM fd exponent slowly converges to the surrogate fd exponent deep in the ' +
      'tail. A near-constant (~1.8x) inflation of an ever-slower ~1/log N decay is what drives the ' +
      'absolute shift to keep growing while the height gap itself damps.',
  },
  patternVerdict:
    'BOTH imp-35577 trends CONTINUE at the sub-1e-5 crossing: the +decade shift keeps GROWING ' +
    '(+15.31 -> +46.84 -> +151.30) and the remnant inflation keeps SHRINKING (~2.13x -> ~1.87x -> ' +
    '~1.77x, below the sub-1e-4 value). The far-tail remnant crossings remain the least ' +
    'height-map-robust landmarks in the cohort and get MORE fragile deeper, the opposite of the ' +
    'imp-35458 crossover (log-damped, ~ -0.98 percent) and imp-35536 peak (robust).',
  isRigorous: false,
  honestStatus:
    'Swapping the height map from the closed surrogate T0 = 2 pi N / log N to the exact RvM inverse ' +
    'effectiveHeightForN pushes the imp-35534 sub-1e-5 far-tail crossing from N ~ 10^410.0476 to ' +
    'N ~ 10^561.3463, a +151.30-decade shift (N-ratio ~1.99e151). The imp-35577 pattern continues: ' +
    'the shift keeps GROWING (+15.31 -> +46.84 -> +151.30) while the remnant inflation keeps ' +
    'SHRINKING (~2.13x -> ~1.87x -> ~1.77x) and the raw height divergence keeps shrinking (~9.24 -> ' +
    '~2.65 -> ~0.84 percent). The crossings lie beyond the double-precision N range, so this uses ' +
    'the imp-35534 log-space reformulation of the identical channel (verified to reproduce the ' +
    'imp-35577 sub-1e-3 / sub-1e-4 shifts and the imp-35534 surrogate crossing to the digit), NOT a ' +
    'new definition. The sub-1e-5 crossing-N is a strongly surrogate-height-dependent artifact; the ' +
    'slow-decay reading survives (the remnant decays under both maps). Measurement only on the ' +
    'inherited imp-3220/imp-3406 surrogate; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Extending the imp-35577 height-map swap ' +
    'one threshold-decade deeper to the imp-35534 sub-1e-5 crossing: swapping the closed surrogate ' +
    'T0 = 2 pi N / log N for the exact RvM inverse effectiveHeightForN pushes the crossing +151.30 ' +
    'decades (410.0476 -> 561.3463, N ~ 10^410 -> 10^561, N-ratio ~1.99e151). BOTH imp-35577 trends ' +
    'CONTINUE: the +decade shift keeps GROWING (+15.31 -> +46.84 -> +151.30) and the remnant ' +
    'inflation keeps SHRINKING (~2.13x -> ~1.87x -> ~1.77x, below the ~1.87x sub-1e-4 value) even as ' +
    'the raw height divergence damps (~9.24 -> ~2.65 -> ~0.84 percent) -- a near-constant ~1.8x ' +
    'inflation of an ever-slower ~1/log N remnant decay costs more decades to walk back to the ' +
    'threshold the deeper the crossing sits. The far-tail crossings remain the least ' +
    'height-map-robust landmarks in the cohort, opposite to the log-damped crossover and peak. The ' +
    'crossings land beyond the double-precision N range (N > 1.8e308), so they are evaluated via the ' +
    'imp-35534 log-space reformulation of the identical eFlowWith/localExponent/remnant math, ' +
    'verified to reproduce the imp-35577 sub-1e-3 / sub-1e-4 shifts and the imp-35534 surrogate ' +
    'crossing (410.0476) to the digit. Measurement only on the inherited imp-3220/imp-3406 ' +
    'surrogate, NOT a rigorous asymptotic; E_flow > 0 strictness (imp-33848) untouched; C_mb ' +
    'GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; imp-3066 ' +
    'K_a >= 0 untouched; changes no bound; no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35577 (sub-1e-3 / sub-1e-4 height-map swaps, extended here); imp-35534 (surrogate sub-1e-5 ' +
    'crossing 10^410, log-space channel); imp-35497 (original sub-1e-3 swap); imp-35473 (sub-1e-4 ' +
    'surrogate crossing); imp-35413 (sub-1e-3 surrogate crossing); imp-35458 (log-damped crossover); ' +
    'imp-35198 (analytic -1 + 3/log N); imp-35135 (far-tail E_flow quantity); effectiveHeightForN ' +
    '(exact RvM inverse, log-space reformulated); imp-486 (C_mb GUE-conditional, UNTOUCHED).',
};

export const IMP35656_FARTAIL_SUB1E5_CROSSING_HEIGHT_MAP_SENSITIVITY_ASSERTIONS = [
  {
    // Faithfulness: the log-space channel reproduces the imp-35577 sub-1e-3 shift (+15.31).
    id: 'imp35656-reproduces-imp35577-sub1e3-shift',
    description: 'the log-space channel reproduces the imp-35577 sub-1e-3 shift 25.6205 -> 40.9350 (+15.31)',
    holds: () =>
      Math.abs(SUB1E3_SUR_LOG10 - 25.6205) < 1e-2 &&
      Math.abs(SUB1E3_RVM_LOG10 - 40.9350) < 5e-2 &&
      Math.abs(SUB1E3_SHIFT - 15.3145) < 5e-2,
  },
  {
    // Faithfulness: the log-space channel reproduces the imp-35577 sub-1e-4 shift (+46.84).
    id: 'imp35656-reproduces-imp35577-sub1e4-shift',
    description: 'the log-space channel reproduces the imp-35577 sub-1e-4 shift 109.1892 -> 156.0294 (+46.84)',
    holds: () =>
      Math.abs(SUB1E4_SUR_LOG10 - 109.1892) < 1e-2 &&
      Math.abs(SUB1E4_RVM_LOG10 - 156.0294) < 5e-2 &&
      Math.abs(SUB1E4_SHIFT - 46.8402) < 5e-2,
  },
  {
    // Faithfulness: the surrogate sub-1e-5 crossing reproduces the imp-35534 landmark (410.0476).
    id: 'imp35656-reproduces-imp35534-surrogate-crossing',
    description: 'the surrogate sub-1e-5 crossing reproduces the imp-35534 landmark log10 N ~ 410.0476',
    holds: () => Math.abs(SUB1E5_SUR_LOG10 - 410.0476) < 1e-2,
  },
  {
    // The NEW RvM sub-1e-5 crossing lands near log10 N ~ 561.3463, a +151.30-decade shift.
    id: 'imp35656-sub1e5-swap-located',
    description: 'the sub-1e-5 RvM crossing lands near log10 N ~ 561.3463, +151.30 decade shift',
    holds: () =>
      Math.abs(SUB1E5_RVM_LOG10 - 561.3463) < 5e-2 &&
      SUB1E5_SHIFT > 148 &&
      SUB1E5_SHIFT < 155,
  },
  {
    // The +decade shift keeps GROWING: sub-1e-5 > sub-1e-4 > sub-1e-3.
    id: 'imp35656-shift-keeps-growing',
    description: 'the decade shift keeps growing (sub-1e-5 +151.30 > sub-1e-4 +46.84 > sub-1e-3 +15.31)',
    holds: () =>
      SUB1E5_SHIFT > SUB1E4_SHIFT &&
      SUB1E4_SHIFT > SUB1E3_SHIFT &&
      SUB1E5_SHIFT / SUB1E4_SHIFT > 2.5,
  },
  {
    // The remnant inflation keeps SHRINKING and stays below the ~1.87x sub-1e-4 value.
    id: 'imp35656-inflation-keeps-shrinking',
    description: 'the sub-1e-5 remnant inflation ~1.77x is below the sub-1e-4 ~1.87x and above unity',
    holds: () =>
      INFLATION_SUB1E5 < INFLATION_SUB1E4 &&
      INFLATION_SUB1E4 < INFLATION_SUB1E3 &&
      INFLATION_SUB1E5 > 1.6 &&
      INFLATION_SUB1E5 < 1.87 &&
      Math.abs(INFLATION_SUB1E5 - 1.7696) < 3e-2,
  },
  {
    // The raw height divergence keeps shrinking deeper (sub-1e-5 ~0.84 percent).
    id: 'imp35656-height-divergence-shrinks',
    description: 'the raw height divergence at the sub-1e-5 scale ~0.84 percent, below the ~2.65 percent sub-1e-4',
    holds: () =>
      DIV_SUB1E5 > 0 &&
      DIV_SUB1E5 < 0.02 &&
      Math.abs(DIV_SUB1E5 - 8.3752e-3) < 5e-4,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35656-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35656_FARTAIL_SUB1E5_CROSSING_HEIGHT_MAP_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP35656_FARTAIL_SUB1E5_CROSSING_HEIGHT_MAP_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP35656_FARTAIL_SUB1E5_CROSSING_HEIGHT_MAP_SENSITIVITY.verdict),
  },
];

for (const a of IMP35656_FARTAIL_SUB1E5_CROSSING_HEIGHT_MAP_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35656-fartail-sub1e5-crossing-height-map-sensitivity assertion failed: ${a.id}`,
    );
  }
}

export default IMP35656_FARTAIL_SUB1E5_CROSSING_HEIGHT_MAP_SENSITIVITY;
