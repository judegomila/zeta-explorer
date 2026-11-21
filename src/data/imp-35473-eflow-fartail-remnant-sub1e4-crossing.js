/**
 * @module imp-35473-eflow-fartail-remnant-sub1e4-crossing
 *
 * imp-35473 (accuracy, frontier-direction): imp-35413 located only the sub-1e-3
 * crossing of the imp-35371 E_flow far-tail fd-vs-analytic remnant (N ~ 4.17e25,
 * log10 N ~ 25.6205, on the fixed closed surrogate T0 = 2 pi N / log N). It stopped
 * there with the remnant at 0.000979 just below 1e-3 and never continued the ladder
 * to the deeper 1e-4 threshold. This module CONTINUES the identical surrogate channel
 * (no height-map swap, no heavy import) past N = 1e26 and bisects the log10 N at which
 * the same fd-vs-analytic remnant first falls below 1e-4.
 *
 * THE MEASUREMENT (surrogate channel only -- no effectiveHeightForN, no heavy import)
 * ---------------------------------------------------------------------------------
 * The fd-vs-analytic remnant holds the height map FIXED at the closed surrogate
 * T0 = 2 pi N / log N (imp-35280): both the fd-surrogate exponent (central log-log
 * difference of the exact imp-35135 far-tail E_flow quantity) and the analytic
 * exponent -1 + 3/log N (imp-35198) live on that same closed inverse, so the remnant
 * isolates ONLY the closed-form Taylor truncation plus the prefactor-form difference.
 * That makes this module pure Math -- byte-identical eFlowWith/localExponent/remnant
 * definitions to imp-35413. It recomputes the imp-35413 rung N = 1e26 live (reproducing
 * 0.000979 to the digit) before continuing the ladder and bisecting the 1e-4 crossing.
 *
 *   N            fd-vs-analytic remnant     status
 *   1e26         0.000979                   below 1e-3 / above 1e-4 (imp-35413, reproduced)
 *   1e100        0.000116                   above 1e-4 (NEW -- this module)
 *   ~1.546e109   0.000100                   THE sub-1e-4 crossing (log10 N ~ 109.1892)
 *   1e120        0.0000852                  below 1e-4 (NEW -- this module)
 *   1e200        0.0000354                  below 1e-4 (NEW -- this module)
 *
 * THE FINDING
 * -----------
 * The remnant first falls below 1e-4 at N ~ 10^109.1892 ~ 1.546e109 -- fully ~83.57
 * decades past the imp-35413 sub-1e-3 crossing (N ~ 10^25.6205), bracketed cleanly by
 * N = 1e100 (0.000116, still above) and N = 1e120 (0.0000852, below). At the crossing
 * remnant*log N ~ 0.02514, DOWN from the ~0.05899 at the sub-1e-3 crossing -- so the
 * product itself keeps decaying (it is NOT pinned at a log-floor), and the ~83.6-decade
 * span to shed one further factor of ten in the remnant confirms the decay is genuinely
 * slow: the remnant decays slightly faster than 1/log N but far slower than any power.
 * Had the remnant been a nonzero floor the 1e-4 crossing would never occur; that it does,
 * and that the product drops by ~2.3x between the two crossings, corroborates the
 * imp-35371/imp-35413 slow-but-real-decay reading one decade of threshold deeper.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate extrapolation, NOT a
 * rigorous asymptotic; changes no bound. E_flow > 0 strictness (imp-33848) untouched;
 * C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463;
 * imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35413-eflow-fartail-remnant-sub1e3-crossing (the ladder this continues, crossing 4.17e25)
 * @see imp-35371-eflow-fartail-remnant-deep-extension (the slow-decay reading, endpoint 1e24)
 * @see imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap (the four-rung remnant origin)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the analytic -1 + 3/log N leading form)
 * @see imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation (far-tail E_flow quantity)
 */

const TWO_PI = 2 * Math.PI;

// imp-35135/imp-35236 exact sub-term constants (no re-derivation): the A1-trap Gronwall factor.
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// The closed RvM surrogate height map T0 = 2 pi N / log N (the inverse the derivation uses).
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}

// EXACT imp-35135 far-tail E_flow quantity on the closed surrogate height map (imp-35236 form).
function eFlowWith(N) {
  const T0 = surrogateHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}

// Local log-log decay exponent by the SAME central difference as imp-35135/imp-35371 (h = 1.0002).
function localExponent(N) {
  const h = 1.0002;
  const lo = Math.log(eFlowWith(N / h));
  const hi = Math.log(eFlowWith(N * h));
  return (hi - lo) / (Math.log(N * h) - Math.log(N / h));
}

// The imp-35198 analytic leading closed form -1 + 3/log N (the surrogate-channel analytic exponent).
function analyticSurrogateExponent(x) {
  return -1 + 3 / x;
}

// The fd-vs-analytic remnant at a given log10 N exponent e (the imp-35280/imp-35371 quantity).
function remnantAtLog10(e) {
  const N = Math.pow(10, e);
  const x = Math.log(N);
  const fd = localExponent(N);
  const analytic = analyticSurrogateExponent(x);
  return Math.abs(analytic - fd);
}

// Bisect the sub-1e-4 crossing in log10 N (the remnant is monotone decreasing past the 1e9 peak,
// so a plain bisection on the bracket [1e100, 1e120] converges to the unique crossing).
function locateSub1e4CrossingLog10() {
  let lo = 100; // remnant(1e100) ~ 0.000116 > 1e-4
  let hi = 120; // remnant(1e120) ~ 0.0000852 < 1e-4
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (remnantAtLog10(mid) > 1e-4) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const CROSSING_LOG10 = locateSub1e4CrossingLog10();
const CROSSING_N = Math.pow(10, CROSSING_LOG10);
const CROSSING_REMNANT = remnantAtLog10(CROSSING_LOG10);
const CROSSING_REMNANT_TIMES_LOGN = CROSSING_REMNANT * Math.log(CROSSING_N);

// The continuation ladder: the reproduced imp-35413 below-1e-3 rung plus the new bracketing rungs.
const LADDER = [26, 100, 120, 200].map((e) => ({
  N: +Math.pow(10, e).toExponential(0),
  log10N: e,
  remnant: +remnantAtLog10(e).toExponential(4),
  aboveThreshold: remnantAtLog10(e) > 1e-4,
  isReproduced35413: e === 26,
}));

export const IMP35473_EFLOW_FARTAIL_REMNANT_SUB1E4_CROSSING = {
  id: 'imp-35473',
  proofSection: 'S-frontier',
  question:
    'Locate the N at which the imp-35413 fd-vs-analytic E_flow far-tail remnant first ' +
    'drops below 1e-4, continuing its measured slow surrogate-channel decay past N = 1e26.',
  method:
    'On the closed surrogate height map T0 = 2 pi N / log N (surrogate channel only; no ' +
    'effectiveHeightForN, hence no heavy import), reproduce the imp-35413 rung N = 1e26 ' +
    'remnant to the digit, then bisect the sub-1e-4 crossing of the same fd-vs-analytic ' +
    'remnant |analytic - fd-surrogate| in log10 N over the bracket [1e100, 1e120].',
  crossing: {
    log10N: +CROSSING_LOG10.toFixed(4),
    N: +CROSSING_N.toExponential(4),
    remnantAtCrossing: +CROSSING_REMNANT.toExponential(4),
    remnantTimesLogN: +CROSSING_REMNANT_TIMES_LOGN.toFixed(5),
  },
  ladder: LADDER,
  finding: {
    F1_reproduces_imp35413_rung:
      'The remnant recomputed live at N = 1e26 reproduces the imp-35413 below-1e-3 rung value ' +
      '0.000979 to the digit, confirming the crossing search shares the imp-35280/imp-35371/' +
      'imp-35413 surrogate channel exactly (byte-identical eFlowWith/localExponent/remnant).',
    F2_crossing_located:
      'The remnant first falls below 1e-4 at N ~ 10^109.1892 ~ 1.546e109, fully ~83.57 decades ' +
      'past the imp-35413 sub-1e-3 crossing (N ~ 10^25.6205), bracketed cleanly by N = 1e100 ' +
      '(0.000116, still above) and N = 1e120 (0.0000852, below).',
    F3_crossing_consistent_with_slow_decay:
      'At the crossing remnant*log N ~ 0.02514, DOWN from ~0.05899 at the imp-35413 sub-1e-3 ' +
      'crossing -- the product itself keeps decaying (not pinned at a log-floor) and it takes ' +
      '~83.6 decades to shed one further factor of ten, so the remnant decays slightly faster ' +
      'than 1/log N yet far slower than any power; a nonzero floor would never reach 1e-4.',
  },
  isRigorous: false,
  honestStatus:
    'The imp-35413 fd-vs-analytic E_flow far-tail remnant first drops below 1e-4 at ' +
    'N ~ 10^109.1892 ~ 1.546e109 (bracketed by N = 1e100 at 0.000116 and N = 1e120 at ' +
    '0.0000852), fully ~83.57 decades past the imp-35413 sub-1e-3 crossing N ~ 4.17e25. At the ' +
    'crossing remnant*log N ~ 0.02514, down from ~0.05899 at the sub-1e-3 crossing -- the ' +
    'still-decaying remnant passes the 1e-4 mark, not a floor. Measurement only on the ' +
    'inherited imp-3220/imp-3406 surrogate; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Continuing the imp-35413 surrogate ' +
    'channel past N = 1e26, the fd-vs-analytic remnant first falls below 1e-4 at ' +
    'N ~ 10^109.1892 ~ 1.546e109, bracketed by N = 1e100 (0.000116) and N = 1e120 (0.0000852), ' +
    'with remnant*log N ~ 0.02514 at the crossing (down from ~0.05899 at the sub-1e-3 crossing) ' +
    '-- consistent with the imp-35371/imp-35413 slow-decay finding, not a nonzero floor. ' +
    'Measurement only on the inherited imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; ' +
    'E_flow > 0 strictness (imp-33848) untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; ' +
    'E_coll far-tail exponent 1/2 per imp-3463; imp-3066 K_a >= 0 untouched; changes no bound; ' +
    'no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35413 (sub-1e-3 crossing 4.17e25, continued here); imp-35371 (slow-decay reading, ' +
    'endpoint N = 1e24); imp-35280 (four-rung fd-vs-analytic remnant origin); imp-35198 ' +
    '(analytic -1 + 3/log N); imp-35135 (far-tail E_flow quantity); imp-486 (C_mb ' +
    'GUE-conditional, UNTOUCHED).',
};

export const IMP35473_EFLOW_FARTAIL_REMNANT_SUB1E4_CROSSING_ASSERTIONS = [
  {
    // Reproduce the imp-35413 below-1e-3 rung remnant at N = 1e26 (surrogate channel is faithful).
    id: 'imp35473-reproduces-imp35413-rung',
    description: 'the live remnant at N = 1e26 matches the imp-35413 rung value 0.000979',
    holds: () => Math.abs(remnantAtLog10(26) - 0.000979) < 5e-6,
  },
  {
    // The crossing sits between N = 1e100 and N = 1e120, near log10 N ~ 109.19.
    id: 'imp35473-crossing-bracketed',
    description: 'the sub-1e-4 crossing lies in log10 N in (100, 120), near 109.19',
    holds: () =>
      CROSSING_LOG10 > 100 &&
      CROSSING_LOG10 < 120 &&
      Math.abs(CROSSING_LOG10 - 109.1892) < 1e-2,
  },
  {
    // The bracket rungs straddle the threshold: 1e100 above, 1e120 below.
    id: 'imp35473-bracket-straddles-threshold',
    description: 'remnant(1e100) > 1e-4 > remnant(1e120)',
    holds: () => remnantAtLog10(100) > 1e-4 && remnantAtLog10(120) < 1e-4,
  },
  {
    // At the located crossing the remnant equals 1e-4 to bisection precision.
    id: 'imp35473-crossing-value-is-threshold',
    description: 'the remnant at the located crossing equals 1e-4 to bisection precision',
    holds: () => Math.abs(CROSSING_REMNANT - 1e-4) < 1e-7,
  },
  {
    // Slow-decay consistency: remnant*log N at the 1e-4 crossing has dropped below the sub-1e-3 value.
    id: 'imp35473-crossing-product-decays',
    description: 'remnant*log N at the 1e-4 crossing ~0.025, down from ~0.059 at the sub-1e-3 crossing',
    holds: () =>
      Math.abs(CROSSING_REMNANT_TIMES_LOGN - 0.02514) < 5e-3 &&
      CROSSING_REMNANT_TIMES_LOGN < 0.05899,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35473-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35473_EFLOW_FARTAIL_REMNANT_SUB1E4_CROSSING.isRigorous === false &&
      /NO QED/.test(IMP35473_EFLOW_FARTAIL_REMNANT_SUB1E4_CROSSING.verdict) &&
      /refereed bound is changed/i.test(IMP35473_EFLOW_FARTAIL_REMNANT_SUB1E4_CROSSING.verdict),
  },
];

for (const a of IMP35473_EFLOW_FARTAIL_REMNANT_SUB1E4_CROSSING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35473-eflow-fartail-remnant-sub1e4-crossing assertion failed: ${a.id}`,
    );
  }
}

export default IMP35473_EFLOW_FARTAIL_REMNANT_SUB1E4_CROSSING;
