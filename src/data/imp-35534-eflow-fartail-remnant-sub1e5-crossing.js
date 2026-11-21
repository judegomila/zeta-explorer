/**
 * @module imp-35534-eflow-fartail-remnant-sub1e5-crossing
 *
 * imp-35534 (numerical, frontier-direction): imp-35473 continued the imp-35413
 * E_flow far-tail fd-vs-analytic remnant ladder from the sub-1e-3 crossing
 * (N ~ 4.17e25) to the sub-1e-4 crossing (N ~ 10^109.1892 ~ 1.546e109) on the
 * fixed closed surrogate height map T0 = 2 pi N / log N, and stopped there. This
 * module CONTINUES the identical pure-Math channel one threshold-decade deeper and
 * bisects the log10 N at which the same fd-vs-analytic remnant first falls below 1e-5.
 *
 * THE DOUBLE-PRECISION OBSTRUCTION AND THE FAITHFUL LOG-SPACE REFORMULATION
 * ------------------------------------------------------------------------
 * The sub-1e-5 crossing lands at N ~ 10^410, FAR beyond the IEEE-754 double range
 * (N_max ~ 1.80e308): the imp-35473 direct channel evaluates N = Math.pow(10, e)
 * and surrogateHeightForN(N) = 2 pi N / log N, both of which OVERFLOW to Infinity
 * for e > ~308, so the remnant returns NaN there (measured: remnant(1e300) ~ 1.74e-5
 * is the last finite direct rung; remnant(1e400) = NaN). To reach the crossing this
 * module evaluates the SAME remnant in log-space on u = log N, which is exact algebra
 * of the identical eFlowWith/localExponent/remnant and never forms the overflowing N
 * or T0. Writing g = log T0 = log(2 pi) + u - log(u) and C_F = (u - log(u) + 1)/(2 pi),
 * the exact imp-35473 quantity satisfies
 *
 *   log eFlowWith = log(C_F) + log(g) - g + TC_A1_TRAP        (TC_A1_TRAP = log GRONWALL)
 *
 * so localExponent is the same central log-log difference (h = 1.0002) evaluated from
 * this closed log form, and the remnant is |(-1 + 3/u) - localExponent| exactly as in
 * imp-35473. This is a reformulation of the identical math to survive N > 1e308, NOT a
 * height-map swap: it reproduces the imp-35473 sub-1e-4 crossing (log10 N = 109.1892)
 * and the imp-35413 rung (remnant(1e26) = 0.000979) to the printed digits (verified in
 * the assertions below), confirming the log-space channel is byte-faithful where the
 * direct channel is valid.
 *
 *   N            fd-vs-analytic remnant     status
 *   1e26         0.000979                   below 1e-3 / above 1e-4 (imp-35413, reproduced)
 *   ~1.546e109   0.000100                   the sub-1e-4 crossing (imp-35473, reproduced)
 *   1e300        1.7394e-5                  above 1e-5 (last finite DIRECT rung)
 *   1e400        1.0451e-5                  above 1e-5 (NEW -- log-space only)
 *   ~10^410.05   0.0000100                  THE sub-1e-5 crossing (log10 N ~ 410.0475)
 *   1e500        7.0202e-6                  below 1e-5 (NEW -- log-space only)
 *
 * THE FINDING
 * -----------
 * The remnant first falls below 1e-5 at N ~ 10^410.0475 -- fully ~300.86 decades past
 * the imp-35473 sub-1e-4 crossing (N ~ 10^109.1892), bracketed cleanly by N = 1e400
 * (1.0451e-5, still above) and N = 1e500 (7.0202e-6, below). At the crossing
 * remnant*log N ~ 0.009442, DOWN from ~0.02514 at the sub-1e-4 crossing (~2.66x) and
 * ~0.05899 at the sub-1e-3 crossing -- so the product keeps decaying (it is NOT pinned
 * at a log-floor). Crucially the DECADE SPAN to shed each further factor of ten grows:
 * ~83.57 decades from the 1e-3 to the 1e-4 crossing, then ~300.86 decades from the 1e-4
 * to the 1e-5 crossing (~3.6x longer). Each threshold-decade costs progressively more
 * decades of N, exactly the signature of a remnant that decays slightly faster than
 * 1/log N yet far slower than any power; a nonzero floor would never reach 1e-5.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate extrapolation, NOT a
 * rigorous asymptotic; changes no bound. E_flow > 0 strictness (imp-33848) untouched;
 * C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463;
 * imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35473-eflow-fartail-remnant-sub1e4-crossing (the ladder this continues, crossing 1.546e109)
 * @see imp-35413-eflow-fartail-remnant-sub1e3-crossing (the sub-1e-3 crossing 4.17e25)
 * @see imp-35371-eflow-fartail-remnant-deep-extension (the slow-decay reading, endpoint 1e24)
 * @see imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap (the four-rung remnant origin)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the analytic -1 + 3/log N leading form)
 * @see imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation (far-tail E_flow quantity)
 */

const TWO_PI = 2 * Math.PI;
const LN2PI = Math.log(TWO_PI);

// imp-35135/imp-35236 exact sub-term constant (no re-derivation): the A1-trap Gronwall exponent.
// GRONWALL = exp(TC_A1_TRAP), so log GRONWALL = TC_A1_TRAP enters log eFlowWith additively.
const TC_A1_TRAP = 2.37e-4;

// Same central-difference step as imp-35135/imp-35371/imp-35473 (multiplicative h = 1.0002 in N).
const H_LOG = Math.log(1.0002);

// EXACT log of the imp-35473 far-tail E_flow quantity, in log-space on u = log N (no overflow).
// Identical math to imp-35473 eFlowWith: T0 = 2 pi N / log N, C_F = (log(T0/2pi)+1)/2pi,
// eFlowWith = C_F * (log T0 / T0) * GRONWALL. Taking logs, with g = log T0 = log(2pi) + u - log(u)
// and log(T0/2pi) = u - log(u): log eFlowWith = log(C_F) + log(g) - g + TC_A1_TRAP.
function lnEFlowByLogN(u) {
  const g = LN2PI + u - Math.log(u);
  const lnCF = Math.log((u - Math.log(u) + 1) / TWO_PI);
  return lnCF + Math.log(g) - g + TC_A1_TRAP;
}

// Local log-log decay exponent by the SAME central difference as imp-35473 localExponent, but
// evaluated in log-space: N/h -> u - H_LOG, N*h -> u + H_LOG, denominator log(N*h)-log(N/h) = 2 H_LOG.
function localExponentByLogN(u) {
  return (lnEFlowByLogN(u + H_LOG) - lnEFlowByLogN(u - H_LOG)) / (2 * H_LOG);
}

// The imp-35198 analytic leading closed form -1 + 3/log N (the surrogate-channel analytic exponent).
function analyticSurrogateExponent(u) {
  return -1 + 3 / u;
}

// The fd-vs-analytic remnant at a given log10 N exponent e (identical to imp-35280/imp-35473 quantity).
function remnantAtLog10(e) {
  const u = e * Math.LN10; // u = log N
  return Math.abs(analyticSurrogateExponent(u) - localExponentByLogN(u));
}

// Bisect the sub-1e-5 crossing in log10 N. The remnant is monotone decreasing across this far tail,
// so a plain bisection on the bracket [1e400, 1e500] converges to the unique crossing.
function locateSub1e5CrossingLog10() {
  let lo = 400; // remnant(1e400) ~ 1.0451e-5 > 1e-5
  let hi = 500; // remnant(1e500) ~ 7.0202e-6 < 1e-5
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (remnantAtLog10(mid) > 1e-5) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// Reproduce the imp-35473 sub-1e-4 crossing in the SAME log-space channel (faithfulness witness).
function locateSub1e4CrossingLog10() {
  let lo = 100;
  let hi = 120;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (remnantAtLog10(mid) > 1e-4) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const CROSSING_LOG10 = locateSub1e5CrossingLog10();
const CROSSING_REMNANT = remnantAtLog10(CROSSING_LOG10);
const CROSSING_REMNANT_TIMES_LOGN = CROSSING_REMNANT * (CROSSING_LOG10 * Math.LN10);

const REPRO_SUB1E4_LOG10 = locateSub1e4CrossingLog10();
const DECADE_SPAN_FROM_SUB1E4 = CROSSING_LOG10 - REPRO_SUB1E4_LOG10;

// The continuation ladder: reproduced imp-35413/imp-35473 rungs plus the new far-tail bracketing rungs.
const LADDER = [26, 109.1892, 300, 400, 500].map((e) => ({
  log10N: e,
  remnant: +remnantAtLog10(e).toExponential(4),
  aboveThreshold: remnantAtLog10(e) > 1e-5,
}));

export const IMP35534_EFLOW_FARTAIL_REMNANT_SUB1E5_CROSSING = {
  id: 'imp-35534',
  proofSection: 'S-frontier',
  question:
    'Locate the N at which the imp-35473 fd-vs-analytic E_flow far-tail remnant first ' +
    'drops below 1e-5, continuing its measured slow surrogate-channel decay past N = 1e200.',
  method:
    'On the closed surrogate height map T0 = 2 pi N / log N (surrogate channel only; no ' +
    'effectiveHeightForN, hence no heavy import), evaluate the identical imp-35473 ' +
    'fd-vs-analytic remnant |analytic - fd-surrogate| in log-space on u = log N (the ' +
    'sub-1e-5 crossing lands at N ~ 10^410, beyond the double-precision N range where the ' +
    'imp-35473 direct Math.pow(10,e) channel overflows to NaN), then bisect the sub-1e-5 ' +
    'crossing in log10 N over the bracket [1e400, 1e500]. The log-space channel reproduces ' +
    'the imp-35473 sub-1e-4 crossing (109.1892) and the imp-35413 rung (0.000979) to the digit.',
  crossing: {
    log10N: +CROSSING_LOG10.toFixed(4),
    N: '10^' + CROSSING_LOG10.toFixed(4),
    remnantAtCrossing: +CROSSING_REMNANT.toExponential(4),
    remnantTimesLogN: +CROSSING_REMNANT_TIMES_LOGN.toFixed(6),
    decadeSpanFromSub1e4Crossing: +DECADE_SPAN_FROM_SUB1E4.toFixed(4),
  },
  ladder: LADDER,
  finding: {
    F1_reproduces_prior_crossings:
      'The log-space channel reproduces the imp-35473 sub-1e-4 crossing at log10 N = 109.1892 ' +
      'and the imp-35413 rung remnant(1e26) = 0.000979 to the printed digits, confirming it is ' +
      'the identical eFlowWith/localExponent/remnant math (byte-faithful where the direct channel ' +
      'is valid) reformulated only to survive N > 1e308.',
    F2_crossing_located:
      'The remnant first falls below 1e-5 at N ~ 10^410.0475, fully ~300.86 decades past the ' +
      'imp-35473 sub-1e-4 crossing (N ~ 10^109.1892), bracketed cleanly by N = 1e400 (1.0451e-5, ' +
      'still above) and N = 1e500 (7.0202e-6, below).',
    F3_crossing_consistent_with_slow_decay:
      'At the crossing remnant*log N ~ 0.009442, DOWN from ~0.02514 at the imp-35473 sub-1e-4 ' +
      'crossing (~2.66x) and ~0.05899 at the sub-1e-3 crossing -- the product keeps decaying, not ' +
      'pinned at a log-floor. The decade span to shed each further factor of ten GROWS (~83.57 ' +
      'decades for 1e-3 -> 1e-4, ~300.86 for 1e-4 -> 1e-5, ~3.6x longer), the signature of a ' +
      'remnant decaying slightly faster than 1/log N yet far slower than any power; a nonzero ' +
      'floor would never reach 1e-5.',
  },
  isRigorous: false,
  honestStatus:
    'The imp-35473 fd-vs-analytic E_flow far-tail remnant first drops below 1e-5 at ' +
    'N ~ 10^410.0475 (bracketed by N = 1e400 at 1.0451e-5 and N = 1e500 at 7.0202e-6), fully ' +
    '~300.86 decades past the imp-35473 sub-1e-4 crossing N ~ 10^109.1892. At the crossing ' +
    'remnant*log N ~ 0.009442, down from ~0.02514 at the sub-1e-4 crossing -- the still-decaying ' +
    'remnant passes the 1e-5 mark, not a floor. The crossing lies beyond the double-precision N ' +
    'range, so this uses a log-space reformulation of the identical channel (verified to reproduce ' +
    'the imp-35473/imp-35413 landmarks to the digit), NOT a height-map swap. Measurement only on ' +
    'the inherited imp-3220/imp-3406 surrogate; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Continuing the imp-35473 surrogate ' +
    'channel past N = 1e200, the fd-vs-analytic remnant first falls below 1e-5 at N ~ 10^410.0475, ' +
    'bracketed by N = 1e400 (1.0451e-5) and N = 1e500 (7.0202e-6), with remnant*log N ~ 0.009442 at ' +
    'the crossing (down from ~0.02514 at the sub-1e-4 crossing) and a ~300.86-decade span from the ' +
    'sub-1e-4 crossing (vs ~83.57 for the prior threshold-decade) -- consistent with the ' +
    'imp-35371/imp-35413/imp-35473 slow-decay finding, not a nonzero floor. The crossing lands ' +
    'beyond the double-precision N range (N ~ 10^410 > 1.8e308), so it is evaluated via a log-space ' +
    'reformulation of the identical eFlowWith/localExponent/remnant math, verified to reproduce the ' +
    'imp-35473 sub-1e-4 crossing (109.1892) and imp-35413 rung (0.000979) to the digit. Measurement ' +
    'only on the inherited imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; E_flow > 0 ' +
    'strictness (imp-33848) untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail ' +
    'exponent 1/2 per imp-3463; imp-3066 K_a >= 0 untouched; changes no bound; no operator ' +
    'positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35473 (sub-1e-4 crossing 1.546e109, continued here); imp-35413 (sub-1e-3 crossing ' +
    '4.17e25); imp-35371 (slow-decay reading, endpoint N = 1e24); imp-35280 (four-rung ' +
    'fd-vs-analytic remnant origin); imp-35198 (analytic -1 + 3/log N); imp-35135 (far-tail ' +
    'E_flow quantity); imp-486 (C_mb GUE-conditional, UNTOUCHED).',
};

export const IMP35534_EFLOW_FARTAIL_REMNANT_SUB1E5_CROSSING_ASSERTIONS = [
  {
    // Faithfulness: the log-space channel reproduces the imp-35473 sub-1e-4 crossing (109.1892).
    id: 'imp35534-reproduces-imp35473-sub1e4-crossing',
    description: 'the log-space channel reproduces the imp-35473 sub-1e-4 crossing at log10 N ~ 109.1892',
    holds: () => Math.abs(REPRO_SUB1E4_LOG10 - 109.1892) < 1e-3,
  },
  {
    // Faithfulness: the log-space channel reproduces the imp-35413 rung remnant(1e26) = 0.000979.
    id: 'imp35534-reproduces-imp35413-rung',
    description: 'the log-space remnant at N = 1e26 matches the imp-35413 rung value 0.000979',
    holds: () => Math.abs(remnantAtLog10(26) - 0.000979) < 5e-6,
  },
  {
    // The sub-1e-5 crossing sits between N = 1e400 and N = 1e500, near log10 N ~ 410.05.
    id: 'imp35534-crossing-bracketed',
    description: 'the sub-1e-5 crossing lies in log10 N in (400, 500), near 410.05',
    holds: () =>
      CROSSING_LOG10 > 400 &&
      CROSSING_LOG10 < 500 &&
      Math.abs(CROSSING_LOG10 - 410.0475) < 1e-2,
  },
  {
    // The bracket rungs straddle the threshold: 1e400 above, 1e500 below.
    id: 'imp35534-bracket-straddles-threshold',
    description: 'remnant(1e400) > 1e-5 > remnant(1e500)',
    holds: () => remnantAtLog10(400) > 1e-5 && remnantAtLog10(500) < 1e-5,
  },
  {
    // At the located crossing the remnant equals 1e-5 to bisection precision.
    id: 'imp35534-crossing-value-is-threshold',
    description: 'the remnant at the located crossing equals 1e-5 to bisection precision',
    holds: () => Math.abs(CROSSING_REMNANT - 1e-5) < 1e-8,
  },
  {
    // Slow-decay consistency: remnant*log N at the 1e-5 crossing has dropped below the sub-1e-4 value.
    id: 'imp35534-crossing-product-decays',
    description: 'remnant*log N at the 1e-5 crossing ~0.0094, down from ~0.02514 at the sub-1e-4 crossing',
    holds: () =>
      Math.abs(CROSSING_REMNANT_TIMES_LOGN - 0.009442) < 5e-4 &&
      CROSSING_REMNANT_TIMES_LOGN < 0.02514,
  },
  {
    // The threshold-decade span GROWS: ~300.86 decades from the sub-1e-4 crossing, far above the ~83.57
    // decades that separated the sub-1e-3 and sub-1e-4 crossings.
    id: 'imp35534-decade-span-grows',
    description: 'the sub-1e-4 -> sub-1e-5 decade span ~300.86 exceeds the ~83.57 of the prior rung',
    holds: () =>
      Math.abs(DECADE_SPAN_FROM_SUB1E4 - 300.86) < 0.5 &&
      DECADE_SPAN_FROM_SUB1E4 > 83.57,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35534-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35534_EFLOW_FARTAIL_REMNANT_SUB1E5_CROSSING.isRigorous === false &&
      /NO QED/.test(IMP35534_EFLOW_FARTAIL_REMNANT_SUB1E5_CROSSING.verdict) &&
      /refereed bound is changed/i.test(IMP35534_EFLOW_FARTAIL_REMNANT_SUB1E5_CROSSING.verdict),
  },
];

for (const a of IMP35534_EFLOW_FARTAIL_REMNANT_SUB1E5_CROSSING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35534-eflow-fartail-remnant-sub1e5-crossing assertion failed: ${a.id}`,
    );
  }
}

export default IMP35534_EFLOW_FARTAIL_REMNANT_SUB1E5_CROSSING;
