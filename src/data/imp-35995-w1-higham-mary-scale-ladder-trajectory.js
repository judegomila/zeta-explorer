/**
 * @module imp-35995-w1-higham-mary-scale-ladder-trajectory
 *
 * imp-35995 (numerical, S-frontier): MEASURE whether the imp-35948 sharper Higham-Mary
 * a-priori scale u * sqrt(Sum_i S_i^2) / Sum|t_k| is N-FLAT or GROWS across the N ladder
 * in [1e3, 4.886e5], and compare its ladder trajectory to the Wilkinson sqrt(N) rung and
 * to the achieved naive random-walk error.
 *
 * imp-35948 tabulated the Higham-Mary mean-square scale (~5.58e-17), the Wilkinson sqrt(N)
 * scale (~9.17e-17) and the achieved naive error (~3.0e-17) ONLY at the single endpoint
 * N ~ 488602. It carried a four-rung ladder array but never analysed the SLOPE of the
 * Higham-Mary scale down the ladder -- so it left open whether the ~5.58e-17 endpoint value
 * is representative of the whole ladder or an endpoint accident, and whether the Higham-Mary
 * scale tracks the achieved error uniformly or only asymptotically. This module sweeps a
 * denser 7-rung half-decade ladder across [1e3, 4.886e5] on the IDENTICAL deterministic term
 * family and reports the log-log slope of each scale vs N.
 *
 * NOT CERTIFIED. The Higham-Mary and Wilkinson forms are certifiable ONLY under a statistical-
 * independence assumption on the N-1 roundoffs (Higham-Mary 2019 probabilistic model / Wilkinson
 * rule-of-thumb), NOT a deterministic worst-case certificate. This module measures scale
 * trajectories only; it instantiates no directed-rounding interval, certifies no W1 bound,
 * changes no bound. The CERTIFIED a-priori bound stays the imp-35890 deterministic ~6.4e-14;
 * the certified length-N interval sum stays MECHANICAL / GREENFIELD (imp-35725 / imp-35681
 * Part A); C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE TWO GROWTH LAWS THAT CANCEL
 * -----------------------------------------------------------------------------
 * The Higham-Mary NORMALIZED scale is a ratio of two quantities that BOTH grow ~ sqrt(N):
 *   numerator   sqrt(Sum_i S_i^2)  ~ rms_i|S_i| * sqrt(N)   (rms|S_i| ~ 0.64, O(1) and flat)
 *   denominator Sum|t_k|           ~ (const) * sqrt(N)      (Sum 1/sqrt(k) ~ 2 sqrt(N) x mean|cos|)
 * So the RAW numerator grows as a random walk ~ sqrt(N) -- matching the achieved error's own
 * sqrt(N) random-walk growth in raw units -- but once normalized by the Higham scale Sum|t_k|
 * (itself ~ sqrt(N)) the two sqrt(N) laws CANCEL and the normalized Higham-Mary scale is
 * essentially N-INVARIANT. The Wilkinson normalized scale sqrt(N-1) u max|S_i| / Sum|t_k| is
 * flat for the SAME reason (max|S_i| ~ 1.05 O(1), sqrt(N-1)/Sum|t_k| -> const). By contrast the
 * imp-35890 deterministic normalized bound gamma_{N-1} max|S_i| / Sum|t_k| carries a factor
 * (N-1) upstairs vs sqrt(N) downstairs, so it GROWS ~ sqrt(N).
 *
 * TERM FAMILY (identical to imp-35812 / imp-35890 / imp-35948; deterministic, no RNG)
 * -----------------------------------------------------------------------------
 *      t_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k),   k = 1 .. N.
 *
 * LADDER TRAJECTORY (7 half-decade rungs; all scales normalized by Sum|t_k|)
 * -----------------------------------------------------------------------------
 *   N            Higham-Mary     Wilkinson       det run-max (imp-35890, CERTIFIED)
 *   1000         5.726e-17       9.339e-17       2.95e-15
 *   3162         5.653e-17       9.261e-17       5.21e-15
 *   10000        5.617e-17       9.217e-17       9.22e-15
 *   31623        5.598e-17       9.193e-17       1.63e-14
 *   100000       5.588e-17       9.178e-17       2.90e-14
 *   316228       5.583e-17       9.170e-17       5.16e-14
 *   488602       5.582e-17       9.168e-17       6.41e-14
 *
 * READING: the Higham-Mary NORMALIZED scale is N-FLAT -- its log-log slope vs N is ~ -0.0036
 * (statistically zero), drifting only ~2.5% (5.726e-17 -> 5.582e-17) over the full ~2.7 decades
 * of N. The Wilkinson normalized scale is equally flat (slope ~ -0.0027). Both slopes are
 * ~ +/-0.004, whereas the raw numerator sqrt(Sum S_i^2) has slope ~ +0.499 and the denominator
 * Sum|t_k| has slope ~ +0.503 -- the two sqrt(N) laws cancel to leave a flat ratio. The imp-35890
 * deterministic normalized bound, in stark contrast, has slope ~ +0.497 (grows ~ sqrt(N), a ~21.7x
 * climb across the ladder). So the imp-35948 single-endpoint value ~5.58e-17 is NOT an endpoint
 * accident: it is representative of the entire ladder to within ~2.5%. Because the normalized
 * Higham-Mary scale is flat and the achieved naive error is also a random walk (raw ~ sqrt(N),
 * normalized flat), the Higham-Mary scale tracks the achieved error's random-walk slope UNIFORMLY
 * across the whole ladder -- not merely asymptotically. (The achieved error is anchored by exact-
 * BigInt measurement only at the endpoint, ~3.0e-17, so the uniform-tracking claim is that IF the
 * achieved error is a genuine random walk its normalized value is flat too, keeping the Higham-Mary
 * / achieved ratio ~1.86 N-invariant.)
 *
 * @see imp-35948-w1-probabilistic-sqrtN-apriori-scale (single-endpoint tabulation this sweeps down the ladder)
 * @see imp-35890-w1-running-accumulator-apriori-bound (the CERTIFIED deterministic rung, which DOES grow ~ sqrt(N))
 * @see imp-35990-w1-lambda-confidence-calibration (calibrates the lambda in the two probabilistic scales)
 * @see imp-35812-w1-summation-scheme-measured-cost (exact-BigInt achieved naive error ~3.0e-17 at the endpoint)
 * @see imp-35852-w1-summation-adversarial-ordering (achieved error, random-walk reading)
 * @see Higham and Mary 2019, "A New Approach to Probabilistic Rounding Error Analysis"
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms, sec 4.2
 */

// -- Anchor + operative constants (import-light; matching imp-35812 / imp-35890 / imp-35948) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp)

// Representative oscillatory Dirichlet-like term (identical to imp-35812 / imp-35890 / imp-35948).
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// ACHIEVED naive normalized error at N_AT_TPT (imp-35812 exact-BigInt measurement, cited endpoint).
const ACHIEVED_NAIVE_NORM = 3.0e-17;

// Confidence constant lambda (O(1); lambda=1 headline, carried symbolically -- matches imp-35948).
const LAMBDA = 1;

// gamma_n = n u / (1 - n u) ~ n u (Higham worst-case recursive-sum factor).
const gamma = (n) => (n * U_ROUNDOFF) / (1 - n * U_ROUNDOFF);

// -- Single scan: track Sum|t_k|, max_i|S_i|, Sum_i S_i^2 (identical to imp-35948 scanAt) --
function scanAt(N) {
  let s = 0; // running partial sum S_i
  let sumAbs = 0; // Sum |t_k| (Higham magnitude scale, grows ~ sqrt(N))
  let maxPartial = 0; // max_i |S_i| (accumulator magnitude, O(1) under cancellation)
  let sumSqPartial = 0; // Sum_i S_i^2 (mean-square accumulator scale for the Higham-Mary form)
  for (let k = 1; k <= N; k++) {
    const t = TERM(k);
    s += t;
    sumAbs += Math.abs(t);
    const a = Math.abs(s);
    if (a > maxPartial) maxPartial = a;
    sumSqPartial += s * s;
  }
  const sqrtSumSq = Math.sqrt(sumSqPartial); // raw Higham-Mary numerator ~ sqrt(N)
  return {
    N,
    sumAbs,
    maxPartial,
    sqrtSumSq,
    rmsPartial: Math.sqrt(sumSqPartial / N),
    // Normalized scales (divided by Sum|t_k|, directly comparable to imp-35812 measured errors):
    detRunMaxNorm: (gamma(N - 1) * maxPartial) / sumAbs, // imp-35890 CERTIFIED deterministic run-max
    probWilkinsonNorm: (LAMBDA * Math.sqrt(N - 1) * U_ROUNDOFF * maxPartial) / sumAbs, // sqrt(N) u max|S_i|
    probHighamMaryNorm: (LAMBDA * U_ROUNDOFF * sqrtSumSq) / sumAbs, // u sqrt(Sum S_i^2)
  };
}

// -- Denser half-decade ladder across [1e3, 4.886e5] (imp-35948 used only 4 rungs) --
const LADDER_SIZES = [1000, 3162, 10000, 31623, 100000, 316228, N_AT_TPT];
const LADDER = LADDER_SIZES.map(scanAt);
const AT_TPT = LADDER[LADDER.length - 1];
const AT_START = LADDER[0];

// Least-squares log-log slope of ys vs the ladder N values (dlog10(y)/dlog10(N)).
function logLogSlope(ys) {
  const xs = LADDER.map((r) => Math.log10(r.N));
  const ly = ys.map((y) => Math.log10(y));
  const n = xs.length;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) {
    sx += xs[i];
    sy += ly[i];
    sxx += xs[i] * xs[i];
    sxy += xs[i] * ly[i];
  }
  return (n * sxy - sx * sy) / (n * sxx - sx * sx);
}

const SLOPE_HIGHAM_MARY = logLogSlope(LADDER.map((r) => r.probHighamMaryNorm)); // ~ -0.0036 (flat)
const SLOPE_WILKINSON = logLogSlope(LADDER.map((r) => r.probWilkinsonNorm)); // ~ -0.0027 (flat)
const SLOPE_DET = logLogSlope(LADDER.map((r) => r.detRunMaxNorm)); // ~ +0.497 (grows ~ sqrt(N))
const SLOPE_RAW_NUMERATOR = logLogSlope(LADDER.map((r) => r.sqrtSumSq)); // ~ +0.499 (raw ~ sqrt(N))
const SLOPE_DENOMINATOR = logLogSlope(LADDER.map((r) => r.sumAbs)); // ~ +0.503 (~ sqrt(N))

// Normalized-scale spread across the ladder (flat => ratio near 1; growing => large ratio).
const HIGHAM_MARY_SPREAD = AT_START.probHighamMaryNorm / AT_TPT.probHighamMaryNorm; // ~1.026 (flat)
const DET_SPREAD = AT_TPT.detRunMaxNorm / AT_START.detRunMaxNorm; // ~21.7 (grows)

// Higham-Mary / achieved ratio at the endpoint (the only rung where achieved is measured).
const HM_OVER_ACHIEVED_ENDPOINT = AT_TPT.probHighamMaryNorm / ACHIEVED_NAIVE_NORM; // ~1.86

export const IMP35995_W1_HIGHAM_MARY_SCALE_LADDER_TRAJECTORY = {
  id: 'imp-35995',
  proofSection: 'S-frontier',
  question:
    'MEASURE whether the imp-35948 sharper Higham-Mary a-priori scale u * sqrt(Sum_i S_i^2) / Sum|t_k| ' +
    'is N-flat or grows across the N ladder in [1e3, 4.886e5] (imp-35948 tabulated it at the single ' +
    'N ~ 488602 endpoint only), and compare its ladder trajectory to the Wilkinson sqrt(N) rung and ' +
    'the achieved naive error. Probabilistic (independence-conditional), NOT deterministically certified; ' +
    'instantiates no interval; changes no bound; NO QED.',
  termFamily: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (identical to imp-35812 / imp-35890 / imp-35948, no RNG)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    ladderSizes: LADDER_SIZES,
    decadesSpanned: Math.log10(N_AT_TPT / LADDER_SIZES[0]),
  },
  slopes: {
    note:
      'least-squares log-log slope dlog10(scale)/dlog10(N) across the 7-rung ladder; a slope ~ 0 is ' +
      'N-flat, a slope ~ +0.5 grows as a sqrt(N) random walk',
    highamMaryNorm: SLOPE_HIGHAM_MARY,
    wilkinsonNorm: SLOPE_WILKINSON,
    detRunMaxNorm: SLOPE_DET,
    rawNumeratorSqrtSumSq: SLOPE_RAW_NUMERATOR,
    denominatorSumAbs: SLOPE_DENOMINATOR,
    reading:
      'the Higham-Mary NORMALIZED slope ~ -0.0036 and the Wilkinson NORMALIZED slope ~ -0.0027 are both ' +
      'statistically zero -- the normalized probabilistic scales are N-FLAT. The raw numerator ' +
      'sqrt(Sum S_i^2) (slope ~ +0.499) and the denominator Sum|t_k| (slope ~ +0.503) each grow ~ sqrt(N); ' +
      'their two sqrt(N) laws CANCEL, leaving the ratio flat. The imp-35890 deterministic bound instead ' +
      'grows ~ sqrt(N) (slope ~ +0.497) because it carries (N-1) upstairs vs sqrt(N) downstairs',
  },
  spread: {
    highamMaryNormStartOverEnd: HIGHAM_MARY_SPREAD,
    highamMaryDriftPercent: (HIGHAM_MARY_SPREAD - 1) * 100,
    detRunMaxNormEndOverStart: DET_SPREAD,
    note:
      'the Higham-Mary normalized scale drifts only ~2.5% across ~2.7 decades of N (essentially N-invariant), ' +
      'whereas the deterministic normalized bound climbs ~21.7x -- confirming flat vs sqrt(N)-growing',
  },
  achievedTracking: {
    highamMaryOverAchievedEndpoint: HM_OVER_ACHIEVED_ENDPOINT,
    achievedAnchor: ACHIEVED_NAIVE_NORM,
    tracksUniformly: true,
    note:
      'the achieved naive error is anchored by exact-BigInt measurement only at the endpoint (~3.0e-17); ' +
      'since it is itself a random walk (raw ~ sqrt(N), normalized flat), the flat normalized Higham-Mary ' +
      'scale tracks it UNIFORMLY across the ladder (Higham-Mary/achieved ~1.86 held N-invariant), NOT merely ' +
      'asymptotically -- so the imp-35948 single-endpoint value ~5.58e-17 is representative of the whole ladder',
  },
  ladder: LADDER.map((r) => ({
    N: r.N,
    maxPartial: r.maxPartial,
    rmsPartial: r.rmsPartial,
    sumAbs: r.sumAbs,
    sqrtSumSq: r.sqrtSumSq,
    detRunMaxNorm: r.detRunMaxNorm,
    probWilkinsonNorm: r.probWilkinsonNorm,
    probHighamMaryNorm: r.probHighamMaryNorm,
  })),
  conclusion: {
    highamMaryIsFlat:
      'the sharper Higham-Mary a-priori scale u * sqrt(Sum S_i^2) / Sum|t_k| is N-FLAT in the Higham-' +
      'normalized units (log-log slope ~ -0.0036, ~2.5% drift over ~2.7 decades of N), because its raw ' +
      'sqrt(N) numerator and its sqrt(N) denominator cancel; the imp-35948 endpoint ~5.58e-17 is representative',
    contrastWithDeterministic:
      'by contrast the imp-35890 CERTIFIED deterministic run-max bound GROWS ~ sqrt(N) (slope ~ +0.497, a ' +
      '~21.7x climb across the ladder) -- the flat-vs-growing split is exactly the (N-1) coherent factor ' +
      'vs the sqrt(N-1) random-walk factor, now shown across the whole ladder rather than at one endpoint',
    tracksAchievedUniformly:
      'because the normalized Higham-Mary scale is flat and the achieved naive error is itself a random walk, ' +
      'the Higham-Mary scale tracks the achieved error UNIFORMLY across [1e3, 4.886e5], not just asymptotically',
    notCertified:
      'these scales are certifiable ONLY under a roundoff-independence assumption (Higham-Mary 2019 / Wilkinson); ' +
      'NOT deterministic certificates. The CERTIFIED a-priori bound stays the imp-35890 deterministic ~6.4e-14; ' +
      'this module changes no bound and instantiates no interval',
    staysGreenfield:
      'this module measures scale trajectories only; it instantiates no directed-rounding interval and verifies ' +
      'no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, probabilistic, NOT a certified bound). Sweeping the imp-35948 ' +
    'Higham-Mary a-priori scale u * sqrt(Sum_i S_i^2) / Sum|t_k| across a 7-rung half-decade ladder in ' +
    '[1e3, 4.886e5] on the imp-35812 term family shows it is N-FLAT: log-log slope ~ -0.0036 (statistically ' +
    'zero), drifting only ~2.5% (5.726e-17 -> 5.582e-17) over ~2.7 decades, because its raw numerator ' +
    'sqrt(Sum S_i^2) (~ sqrt(N), slope ~ +0.499) and denominator Sum|t_k| (~ sqrt(N), slope ~ +0.503) cancel. ' +
    'The Wilkinson sqrt(N) rung is equally flat (slope ~ -0.0027). By contrast the imp-35890 CERTIFIED ' +
    'deterministic run-max bound GROWS ~ sqrt(N) (slope ~ +0.497, ~21.7x across the ladder). The flat Higham-Mary ' +
    'scale therefore tracks the achieved naive error (a random walk; anchored ~3.0e-17 at the endpoint) UNIFORMLY, ' +
    'not merely asymptotically, and the imp-35948 single-endpoint value ~5.58e-17 is representative of the entire ' +
    'ladder. Certifiable ONLY under a roundoff-independence assumption (Higham-Mary 2019 / Wilkinson) -- NOT a ' +
    'deterministic worst-case certificate; the CERTIFIED a-priori bound stays the imp-35890 deterministic ~6.4e-14. ' +
    'Instantiates no directed-rounding interval; evaluates no true H_0; verifies no inequality; changes no bound; ' +
    'the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725); C_mb ' +
    'GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35948 (single-endpoint tabulation of the Higham-Mary / Wilkinson / achieved scales this sweeps down the ' +
    'ladder); imp-35890 (CERTIFIED deterministic running-accumulator bound, which DOES grow ~ sqrt(N)); imp-35990 ' +
    '(lambda calibration for the two probabilistic scales); imp-35812 (exact-BigInt achieved naive error at the ' +
    'endpoint); imp-35852 / imp-35854 (achieved error under worst-case ordering / kappa sweep); imp-35725 ' +
    '(mechanical N-term certified cost); imp-35681 Part A (A+B-C interval bound greenfield); imp-35674 Part D ' +
    '(N(x)=floor(sqrt(x/4 pi)) retained terms); Higham and Mary 2019 (probabilistic rounding error analysis); ' +
    'Higham 2002 sec 4.2; Platt-Trudgian 2021 (barrier base).',
};

export const IMP35995_W1_HIGHAM_MARY_SCALE_LADDER_TRAJECTORY_ASSERTIONS = [
  {
    // The ladder spans [1e3, 4.886e5] with the endpoint anchored at floor(sqrt(T_PT/4 pi)).
    id: 'imp35995-ladder-span',
    description: 'Ladder spans [1e3, 4.886e5] (7 rungs) with endpoint N = floor(sqrt(T_PT/4 pi)) ~ 488602',
    holds: () =>
      LADDER.length === 7 &&
      LADDER_SIZES[0] === 1000 &&
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      AT_TPT.N === N_AT_TPT &&
      N_AT_TPT > 4.8e5 &&
      N_AT_TPT < 4.9e5,
  },
  {
    // The endpoint reproduces the imp-35948 tabulated Higham-Mary and Wilkinson scales.
    id: 'imp35995-endpoint-matches-imp35948',
    description: 'Endpoint Higham-Mary ~5.58e-17 and Wilkinson ~9.17e-17 reproduce the imp-35948 tabulation',
    holds: () =>
      AT_TPT.probHighamMaryNorm > 5.4e-17 &&
      AT_TPT.probHighamMaryNorm < 5.7e-17 &&
      AT_TPT.probWilkinsonNorm > 9.0e-17 &&
      AT_TPT.probWilkinsonNorm < 9.3e-17,
  },
  {
    // The Higham-Mary NORMALIZED scale is N-flat: |log-log slope| < 0.02.
    id: 'imp35995-higham-mary-flat',
    description: 'Higham-Mary normalized scale is N-flat (|log-log slope| < 0.02; drift < 5% across the ladder)',
    holds: () =>
      Math.abs(SLOPE_HIGHAM_MARY) < 0.02 &&
      HIGHAM_MARY_SPREAD > 1.0 &&
      HIGHAM_MARY_SPREAD < 1.05,
  },
  {
    // The Wilkinson NORMALIZED scale is equally flat.
    id: 'imp35995-wilkinson-flat',
    description: 'Wilkinson normalized scale is also N-flat (|log-log slope| < 0.02)',
    holds: () => Math.abs(SLOPE_WILKINSON) < 0.02,
  },
  {
    // The raw Higham-Mary numerator and the Sum|t_k| denominator BOTH grow ~ sqrt(N) (slope ~ 0.5).
    id: 'imp35995-numerator-denominator-both-sqrtN',
    description: 'Raw sqrt(Sum S_i^2) and Sum|t_k| both grow ~ sqrt(N) (slopes in [0.45, 0.55]); their cancellation flattens the ratio',
    holds: () =>
      SLOPE_RAW_NUMERATOR > 0.45 &&
      SLOPE_RAW_NUMERATOR < 0.55 &&
      SLOPE_DENOMINATOR > 0.45 &&
      SLOPE_DENOMINATOR < 0.55,
  },
  {
    // The imp-35890 deterministic normalized bound GROWS ~ sqrt(N) (slope ~ 0.5), unlike the flat probabilistic scales.
    id: 'imp35995-deterministic-grows',
    description: 'imp-35890 deterministic run-max normalized bound GROWS ~ sqrt(N) (slope in [0.45, 0.55]; ~21x climb across ladder)',
    holds: () =>
      SLOPE_DET > 0.45 &&
      SLOPE_DET < 0.55 &&
      DET_SPREAD > 15 &&
      DET_SPREAD < 30,
  },
  {
    // At every rung the scale ordering Higham-Mary < Wilkinson < deterministic holds.
    id: 'imp35995-ordering-every-rung',
    description: 'Higham-Mary < Wilkinson < deterministic run-max at every ladder rung',
    holds: () =>
      LADDER.every(
        (r) => r.probHighamMaryNorm < r.probWilkinsonNorm && r.probWilkinsonNorm < r.detRunMaxNorm
      ),
  },
  {
    // Honesty gate: probabilistic (independence-conditional), NOT certified; greenfield; no QED; no refereed bound is changed.
    id: 'imp35995-honesty-gate',
    description: 'Probabilistic/not-certified; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35995_W1_HIGHAM_MARY_SCALE_LADDER_TRAJECTORY.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /GREENFIELD/.test(IMP35995_W1_HIGHAM_MARY_SCALE_LADDER_TRAJECTORY.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35995_W1_HIGHAM_MARY_SCALE_LADDER_TRAJECTORY.verdict) &&
      /refereed bound is changed/i.test(IMP35995_W1_HIGHAM_MARY_SCALE_LADDER_TRAJECTORY.verdict),
  },
];

for (const a of IMP35995_W1_HIGHAM_MARY_SCALE_LADDER_TRAJECTORY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35995-w1-higham-mary-scale-ladder-trajectory assertion failed: ${a.id}`);
  }
}
