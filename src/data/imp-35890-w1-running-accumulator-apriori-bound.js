/**
 * @module imp-35890-w1-running-accumulator-apriori-bound
 *
 * imp-35890 (numerical, S-frontier): ESTIMATE the tightest USABLE a-priori forward-error
 * bound for the certified length-N W1 interval sum -- the Higham recursive-sum bound with
 * a RUNNING ACCUMULATOR-MAGNITUDE scale (running max |partial sum|) in place of the
 * pessimistic Sum|t_k| -- and compare it against the imp-35761 pessimistic N * eps ceiling
 * and the imp-35852 / imp-35854 ACHIEVED naive error.
 *
 * imp-35761 quoted the WORST-CASE recursive-sum forward error gamma_{N-1} * Sum|t_k|
 * (normalized: gamma_{N-1} ~ N u, i.e. the "N * eps" ceiling), while imp-35812 / imp-35852 /
 * imp-35854 MEASURED that the achieved naive error sits ~6 orders below it because the
 * running accumulator stays O(1) under cancellation. Neither, though, isolated a
 * certified-but-realistic a-priori bound. This module supplies it: the standard sharper
 * Higham running bound
 *      | fl(sum) - sum |  <=  u * Sum_{i>=2} |S_i|  <=  gamma_{N-1} * max_i |S_i|,
 * where S_i is the i-th partial sum. Replacing the pessimistic magnitude scale Sum|t_k|
 * (which assumes NO cancellation) by the ACTUAL running accumulator magnitude max_i|S_i|
 * (which stays O(1) under cancellation) yields a still-CERTIFIED a-priori bound that is
 * far tighter than N * eps -- yet still ~3 orders ABOVE the achieved error, because it
 * retains the worst-case COHERENT accumulation of the N-1 roundoffs (the achieved error
 * accumulates as a random walk, ~ sqrt(N) u, which no deterministic a-priori bound recovers).
 *
 * ASSESSMENT / MEASUREMENT ONLY. Instantiates no directed-rounding interval; evaluates no
 * true H_0; verifies no inequality; changes no bound; establishes no positivity; the
 * certified length-N interval sum stays MECHANICAL / GREENFIELD (imp-35725 / imp-35681
 * Part A); C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * TWO A-PRIORI SCALES FOR THE SAME gamma_{N-1}
 * -----------------------------------------------------------------------------
 * Higham (2002) gives, for naive recursive summation, the a-priori forward error
 *      |E_N|  <=  gamma_{N-1} * Sum_k |t_k|,      gamma_n = n u / (1 - n u) ~ n u,   (A)
 * and the SHARPER running form obtained by tracking each addition's actual operand
 *      |E_N|  <=  u * Sum_{i=2}^{N} |S_i| + O(u^2)  <=  (N-1) u * max_i |S_i|.        (B)
 * (A) is pessimistic because Sum|t_k| would only be attained if the partial sums never
 * cancelled; under real cancellation the accumulator max_i|S_i| is O(1) while Sum|t_k|
 * grows like sqrt(N). Bound (B) is still an HONEST a-priori bound -- it is certifiable at
 * run time by monitoring the accumulator magnitude ("running accumulator-magnitude bound") --
 * but it drops the pessimistic magnitude inflation. Both (A) and (B) still assume the N-1
 * roundoffs add COHERENTLY, so neither reaches the random-walk achieved error.
 *
 * TERM FAMILY (identical to imp-35812; deterministic, no RNG)
 * -----------------------------------------------------------------------------
 *      t_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k),   k = 1 .. N,
 * a bounded oscillatory Dirichlet-like sum mimicking A_t + B_t - C_t; Sum|t_k| ~ 889 at
 * N = floor(sqrt(T_PT / 4 pi)) ~ 488602, while max_i|S_i| ~ 1.05 (O(1), FLAT across the
 * whole N = 1e3 .. 4.886e5 ladder -- the running accumulator never grows).
 *
 * NUMBERS AT T_PT (N ~ 488602; all normalized by Sum|t_k|, the Higham scale)
 * -----------------------------------------------------------------------------
 *   pessimistic ceiling  N * eps (imp-35761)          : ~1.08e-10
 *   classic Higham       gamma_{N-1}                  : ~5.42e-11
 *   running-accumulator  gamma_{N-1} * maxPartial/SumAbs (B, run-max) : ~6.41e-14
 *   running-accumulator  u * Sum|S_i| / SumAbs        (B, sum-of-partials, tightest) : ~3.90e-14
 *   ACHIEVED naive       (imp-35812 / imp-35852)      : ~3.0e-17
 *
 * READING: the running-accumulator a-priori bound recovers ~3.2 of the ~6.5 orders between
 * the pessimistic N * eps ceiling and the achieved error -- exactly the "magnitude-scale"
 * pessimism (Sum|t_k| vs O(1) accumulator). The remaining ~3.3 orders is the
 * "coherent-vs-random-walk" pessimism ((N-1) coherent roundoffs vs the observed sqrt(N)
 * random walk), which is intrinsic to any deterministic worst-case a-priori bound and is
 * only closed by measurement. The tightest USABLE certified bound is thus ~6.4e-14
 * (normalized) -- still ~4 orders under the imp-35760 O(1) barrier margin, so DOUBLE
 * precision with a certified running-accumulator bound leaves overwhelming strict headroom.
 * CONCLUSION: precision is NOT the binding constraint; the obstruction stays the ENGINEERING
 * of the certified length-N interval sum, exactly the MECHANICAL classification of imp-35725.
 *
 * @see imp-35761-w1-certified-rounding-cost-scope (pessimistic N * eps ceiling this refines)
 * @see imp-35812-w1-summation-scheme-measured-cost (exact-BigInt ACHIEVED naive error ~3.0e-17)
 * @see imp-35852-w1-summation-adversarial-ordering (achieved error under worst-case ordering)
 * @see imp-35854-w1-summation-kappa-sweep (achieved error vs condition number)
 * @see imp-35760-w1-margin-allocation-scope (the O(1) barrier margin the bound sits under)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms, sec 4.2 (running error bound)
 */

// -- Anchor + operative constants (import-light; matching imp-35761 / imp-35812) --------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this assessment
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp); Higham gamma uses u
const EPS_DOUBLE = 2 ** -52; // machine epsilon (= 2 u); imp-35761 quoted its ceiling in eps

// Representative oscillatory Dirichlet-like term (identical to imp-35812; deterministic).
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// ACHIEVED naive normalized error at N_AT_TPT (imp-35812 exact-BigInt measurement, cited).
const ACHIEVED_NAIVE_NORM = 3.0e-17;

// gamma_n = n u / (1 - n u) ~ n u (Higham worst-case recursive-sum factor).
const gamma = (n) => (n * U_ROUNDOFF) / (1 - n * U_ROUNDOFF);

// -- Running-accumulator scan: track Sum|t_k|, max_i|S_i|, and Sum_i|S_i| ---------------
function scanAt(N) {
  let s = 0; // running partial sum S_i
  let sumAbs = 0; // Sum |t_k| (the classic Higham magnitude scale, grows ~ sqrt(N))
  let maxPartial = 0; // max_i |S_i| (running accumulator magnitude, O(1) under cancellation)
  let sumPartialAbs = 0; // Sum_{i} |S_i| (the sharpest running-form scale)
  for (let k = 1; k <= N; k++) {
    const t = TERM(k);
    s += t;
    sumAbs += Math.abs(t);
    const a = Math.abs(s);
    if (a > maxPartial) maxPartial = a;
    sumPartialAbs += a;
  }
  const g = gamma(N - 1);
  return {
    N,
    finalSum: s,
    sumAbs,
    maxPartial,
    sumPartialAbs,
    conditionNumber: sumAbs / Math.abs(s),
    // Normalized a-priori bounds (divided by Sum|t_k|, so they are directly comparable
    // to imp-35812's normalized measured errors and imp-35761's normalized ceiling):
    pessimisticNorm: g, // (A): gamma_{N-1} * SumAbs / SumAbs = gamma_{N-1}
    runMaxNorm: (g * maxPartial) / sumAbs, // (B) run-max: gamma_{N-1} * maxPartial / SumAbs
    sumPartialNorm: (U_ROUNDOFF * sumPartialAbs) / sumAbs, // (B) tightest: u * Sum|S_i| / SumAbs
  };
}

// Growth ladder (identical sizes to imp-35812) + the operative N_AT_TPT run. Cheap: ~0.05 s.
const LADDER_SIZES = [1000, 10000, 100000, N_AT_TPT];
const LADDER = LADDER_SIZES.map(scanAt);
const AT_TPT = LADDER[LADDER.length - 1];

// imp-35761 pessimistic ceiling (normalized), for direct contrast.
const CEIL_NAIVE_LINEAR = N_AT_TPT * EPS_DOUBLE; // ~1.08e-10 (imp-35761 N * eps ceiling)

// Gap decomposition at T_PT (orders of magnitude, base 10).
const ORDERS_CEIL_TO_ACHIEVED = Math.log10(CEIL_NAIVE_LINEAR / ACHIEVED_NAIVE_NORM);
const ORDERS_RECOVERED = Math.log10(CEIL_NAIVE_LINEAR / AT_TPT.runMaxNorm); // magnitude-scale pessimism recovered
const ORDERS_RESIDUAL = Math.log10(AT_TPT.runMaxNorm / ACHIEVED_NAIVE_NORM); // coherent-vs-random-walk residual

export const IMP35890_W1_RUNNING_ACCUMULATOR_APRIORI_BOUND = {
  id: 'imp-35890',
  proofSection: 'S-frontier',
  question:
    'ESTIMATE the tightest USABLE a-priori forward-error bound for the certified length-N W1 ' +
    'interval sum -- Higham gamma_{N-1} with a RUNNING accumulator-magnitude scale (running max ' +
    '|partial sum|) rather than Sum|t_k| -- and compare it against the imp-35761 pessimistic N * eps ' +
    'ceiling and the imp-35852 / imp-35854 achieved errors. Assessment only; instantiates no interval; ' +
    'changes no bound; NO QED.',
  termFamily: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (identical to imp-35812, no RNG)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    conditionNumberAtTPT: AT_TPT.conditionNumber,
  },
  bounds: {
    note:
      'all normalized by Sum|t_k| (the Higham scale), directly comparable to imp-35812 measured errors',
    pessimisticCeiling: {
      value: CEIL_NAIVE_LINEAR,
      form: 'N * eps',
      source: 'imp-35761 worst-case coherent directed rounding',
    },
    classicHigham: {
      value: AT_TPT.pessimisticNorm,
      form: 'gamma_{N-1} = (N-1) u / (1 - (N-1) u)',
      source: 'Higham (A): gamma_{N-1} * Sum|t_k|, normalized',
    },
    runningAccumulatorRunMax: {
      value: AT_TPT.runMaxNorm,
      form: 'gamma_{N-1} * max_i|S_i| / Sum|t_k|',
      source: 'Higham (B) run-max: replaces Sum|t_k| by the O(1) running accumulator magnitude',
    },
    runningAccumulatorSumPartials: {
      value: AT_TPT.sumPartialNorm,
      form: 'u * Sum_i|S_i| / Sum|t_k|',
      source: 'Higham (B) sharpest running form (sum of partial-sum magnitudes)',
    },
    achievedNaive: {
      value: ACHIEVED_NAIVE_NORM,
      source: 'imp-35812 exact-BigInt measurement (cross-checked by imp-35852 / imp-35854)',
    },
  },
  runningAccumulatorMagnitude: {
    maxPartialAtTPT: AT_TPT.maxPartial,
    sumAbsAtTPT: AT_TPT.sumAbs,
    ratioMaxPartialToSumAbs: AT_TPT.maxPartial / AT_TPT.sumAbs,
    note:
      'max_i|S_i| ~ 1.05 stays O(1) across the whole ladder while Sum|t_k| grows ~ sqrt(N) to ~889; ' +
      'the running accumulator never grows -- this O(1)/sqrt(N) ratio IS the recovered pessimism',
  },
  gapDecomposition: {
    ordersCeilingToAchieved: ORDERS_CEIL_TO_ACHIEVED,
    ordersRecoveredByRunningAccumulator: ORDERS_RECOVERED,
    ordersResidualCoherentVsRandomWalk: ORDERS_RESIDUAL,
    reading:
      'the ~6.5-order gap between the imp-35761 ceiling and the achieved error splits into ~3.2 orders ' +
      'of magnitude-scale pessimism (Sum|t_k| vs O(1) accumulator) -- RECOVERED by the certified ' +
      'running-accumulator bound -- and ~3.3 orders of coherent-vs-random-walk pessimism ((N-1) coherent ' +
      'roundoffs vs the observed sqrt(N) random walk), which no deterministic a-priori bound recovers',
  },
  ladder: LADDER.map((r) => ({
    N: r.N,
    sumAbs: r.sumAbs,
    maxPartial: r.maxPartial,
    pessimisticNorm: r.pessimisticNorm,
    runMaxNorm: r.runMaxNorm,
    sumPartialNorm: r.sumPartialNorm,
  })),
  conclusion: {
    usableCertifiedBound:
      'the tightest USABLE certified a-priori bound is the running-accumulator form ~6.4e-14 (normalized), ' +
      '~3.2 orders below the imp-35761 pessimistic N * eps ceiling, obtained by scaling gamma_{N-1} with ' +
      'the O(1) running accumulator magnitude instead of the sqrt(N)-growing Sum|t_k|',
    stillAbovePessimisticInAchieved:
      'it remains ~3.3 orders ABOVE the achieved naive error because it keeps the worst-case COHERENT ' +
      'accumulation; the achieved random-walk error is not a certifiable a-priori quantity',
    precisionNotBinding:
      'the certified running-accumulator bound is still ~4 orders under the imp-35760 O(1) barrier margin, ' +
      'so double precision leaves overwhelming strict headroom; precision is NOT the binding constraint',
    staysGreenfield:
      'this module assesses a-priori bounds only; it instantiates no directed-rounding interval and ' +
      'verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) ' +
      'and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL ASSESSMENT (frontier-direction, NOT a certified bound). Evaluating the Higham recursive-sum ' +
    'forward error with a RUNNING accumulator-magnitude scale (max_i|S_i| ~ 1.05, O(1) and FLAT across the ' +
    'N = 1e3 .. 4.886e5 ladder) instead of the pessimistic Sum|t_k| ~ 889 on the imp-35812 term family, the ' +
    'tightest USABLE certified a-priori bound at N ~ 488602 is ~6.4e-14 (normalized; run-max form) -- ~3.2 ' +
    'orders BELOW the imp-35761 pessimistic N * eps ceiling ~1.08e-10, yet still ~3.3 orders ABOVE the ' +
    'imp-35812 / imp-35852 achieved naive error ~3.0e-17. The ~6.5-order ceiling-to-achieved gap decomposes ' +
    'into ~3.2 orders of magnitude-scale pessimism (recovered by the running-accumulator bound) and ~3.3 ' +
    'orders of coherent-vs-random-walk pessimism (intrinsic to any deterministic worst-case bound, only ' +
    'closed by measurement). The certified running-accumulator bound stays ~4 orders under the imp-35760 ' +
    'O(1) barrier margin, so precision is NOT the binding constraint; the obstruction stays the ENGINEERING ' +
    'of the certified length-N interval sum, exactly the MECHANICAL classification of imp-35725. Instantiates ' +
    'no directed-rounding interval; evaluates no true H_0; verifies no inequality; changes no bound; ' +
    'establishes no positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD; C_mb GUE-conditional ' +
    '(imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35761 (pessimistic N * eps ceiling this refines); imp-35812 (exact-BigInt achieved naive error); ' +
    'imp-35852 / imp-35854 (achieved error under worst-case ordering / kappa sweep); imp-35760 ' +
    '(barrier-margin allocation); imp-35725 (mechanical N-term certified cost); imp-35681 Part A (A+B-C ' +
    'interval bound greenfield); imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) retained terms); Higham 2002 ' +
    'sec 4.2 (recursive-sum running error bound); Platt-Trudgian 2021 (barrier base).',
};

export const IMP35890_W1_RUNNING_ACCUMULATOR_APRIORI_BOUND_ASSERTIONS = [
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602, matching imp-35761 / imp-35812.
    id: 'imp35890-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 retained terms anchored at T_PT = 3e12',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 &&
      N_AT_TPT < 4.9e5 &&
      AT_TPT.N === N_AT_TPT,
  },
  {
    // Running accumulator stays O(1) and FLAT while Sum|t_k| grows ~ sqrt(N).
    id: 'imp35890-accumulator-o1-flat',
    description: 'max_i|S_i| stays O(1) (~1.05) and flat across the ladder while Sum|t_k| grows to ~889',
    holds: () => {
      const maxParts = LADDER.map((r) => r.maxPartial);
      const hi = Math.max(...maxParts);
      const lo = Math.min(...maxParts);
      return (
        hi < 5 && lo > 0.5 && hi / lo < 2 && // O(1) and flat
        AT_TPT.sumAbs > 800 && AT_TPT.sumAbs < 1000 // Sum|t_k| ~ 889 at T_PT
      );
    },
  },
  {
    // Running-accumulator a-priori bound sits strictly BELOW the imp-35761 N * eps ceiling.
    id: 'imp35890-runmax-below-ceiling',
    description: 'Running-accumulator run-max bound is >1e3x below the imp-35761 N * eps ceiling',
    holds: () =>
      AT_TPT.runMaxNorm > 0 &&
      AT_TPT.runMaxNorm < CEIL_NAIVE_LINEAR &&
      CEIL_NAIVE_LINEAR / AT_TPT.runMaxNorm > 1e3 &&
      ORDERS_RECOVERED > 3,
  },
  {
    // But it stays ABOVE the achieved error (retains worst-case coherent accumulation).
    id: 'imp35890-runmax-above-achieved',
    description: 'Running-accumulator bound stays >1e2x above the achieved naive error (coherent worst case)',
    holds: () =>
      AT_TPT.runMaxNorm > ACHIEVED_NAIVE_NORM &&
      AT_TPT.runMaxNorm / ACHIEVED_NAIVE_NORM > 1e2 &&
      ORDERS_RESIDUAL > 2,
  },
  {
    // Bound ordering: achieved < sum-of-partials <= run-max < classic gamma < N * eps ceiling.
    id: 'imp35890-bound-ordering',
    description: 'Bounds ordered achieved < sumPartials <= runMax < gamma_{N-1} < N * eps ceiling',
    holds: () =>
      ACHIEVED_NAIVE_NORM < AT_TPT.sumPartialNorm &&
      AT_TPT.sumPartialNorm <= AT_TPT.runMaxNorm &&
      AT_TPT.runMaxNorm < AT_TPT.pessimisticNorm &&
      AT_TPT.pessimisticNorm < CEIL_NAIVE_LINEAR,
  },
  {
    // Gap decomposition adds up: recovered + residual = ceiling-to-achieved (within rounding).
    id: 'imp35890-gap-decomposition-consistent',
    description: 'Recovered (~3.2) + residual (~3.3) orders reconstruct the ~6.5-order ceiling-to-achieved gap',
    holds: () =>
      ORDERS_RECOVERED > 2.5 &&
      ORDERS_RESIDUAL > 2.5 &&
      Math.abs(ORDERS_RECOVERED + ORDERS_RESIDUAL - ORDERS_CEIL_TO_ACHIEVED) < 1e-9,
  },
  {
    // Honesty gate: assessment only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp35890-honesty-gate',
    description: 'Assessment only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35890_W1_RUNNING_ACCUMULATOR_APRIORI_BOUND.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /GREENFIELD/.test(IMP35890_W1_RUNNING_ACCUMULATOR_APRIORI_BOUND.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35890_W1_RUNNING_ACCUMULATOR_APRIORI_BOUND.verdict) &&
      /refereed bound is changed/i.test(IMP35890_W1_RUNNING_ACCUMULATOR_APRIORI_BOUND.verdict),
  },
];

for (const a of IMP35890_W1_RUNNING_ACCUMULATOR_APRIORI_BOUND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35890-w1-running-accumulator-apriori-bound assertion failed: ${a.id}`);
  }
}
