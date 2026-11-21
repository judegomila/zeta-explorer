/**
 * @module imp-35948-w1-probabilistic-sqrtN-apriori-scale
 *
 * imp-35948 (numerical, S-frontier): ESTIMATE the intermediate Wilkinson-style
 * PROBABILISTIC sqrt(N)*u a-priori error scale for the certified length-N W1 interval
 * sum -- the rung BETWEEN the imp-35890 CERTIFIED deterministic running-accumulator
 * bound (~6.4e-14 normalized at T_PT) and the imp-35852 / imp-35812 ACHIEVED naive
 * random-walk error (~3.0e-17) -- and quantify how much of the ~3-order residual gap it
 * recovers.
 *
 * imp-35890 supplied the tightest CERTIFIED deterministic a-priori bound (running-
 * accumulator Higham form, gamma_{N-1} * max_i|S_i| / Sum|t_k| ~ 6.4e-14 normalized at
 * T_PT) but noted it stays ~3.3 orders ABOVE the achieved error because it retains the
 * worst-case COHERENT accumulation of the N-1 roundoffs. The achieved error instead
 * accumulates as a random walk ~ sqrt(N)*u that no DETERMINISTIC bound recovers. This
 * module supplies the intermediate rung imp-35890 named but never estimated: the
 * Wilkinson-style PROBABILISTIC a-priori scale that replaces the coherent factor (N-1)
 * by the random-walk factor sqrt(N-1) on the SAME O(1) running-accumulator magnitude.
 *
 * NOT CERTIFIED. The sqrt(N) rule is certifiable ONLY under a statistical-independence
 * assumption on the N-1 roundoffs (Wilkinson rule-of-thumb; Higham-Mary 2019 probabilistic
 * model), which is NOT a deterministic worst-case certificate. It instantiates no directed-
 * rounding interval, certifies no W1 bound, changes no bound. The CERTIFIED a-priori bound
 * stays the imp-35890 deterministic ~6.4e-14; the certified length-N interval sum stays
 * MECHANICAL / GREENFIELD (imp-35725 / imp-35681 Part A); C_mb GUE-conditional (imp-486)
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THREE A-PRIORI RUNGS FOR THE SAME roundoff ENSEMBLE
 * -----------------------------------------------------------------------------
 * Higham (2002) recursive-sum forward error is E_N = Sum_{i=2}^{N} S_i * delta_i with each
 * |delta_i| <= u (S_i the i-th partial sum). Three ways to bound |E_N|:
 *   (DET-coherent)  |E_N| <= (N-1) u * max_i|S_i|                          [imp-35890 run-max]
 *   (PROB-Wilkinson) |E_N| ~  lambda * sqrt(N-1) u * max_i|S_i|            [this module]
 *   (PROB-HighamMary) |E_N| ~  lambda * u * sqrt(Sum_i S_i^2)              [this module, sharper]
 * The deterministic bound assumes the N-1 roundoffs add COHERENTLY (all same sign, all at
 * the accumulator peak). The probabilistic scales treat the delta_i as independent mean-zero
 * (variance <= u^2), so the standard deviation of E_N is u * sqrt(Sum_i S_i^2) and the simple
 * Wilkinson rule replaces N by sqrt(N) on the peak magnitude. lambda is an O(1) confidence
 * constant (lambda ~ 1 here; a larger lambda widens the interval for a stricter failure
 * probability) -- carried symbolically, not tuned.
 *
 * TERM FAMILY (identical to imp-35812 / imp-35890; deterministic, no RNG)
 * -----------------------------------------------------------------------------
 *      t_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k),   k = 1 .. N,
 * with Sum|t_k| ~ 889, max_i|S_i| ~ 1.05 (O(1), flat), rms_i|S_i| ~ 0.64 at
 * N = floor(sqrt(T_PT / 4 pi)) ~ 488602. sqrt(N-1) ~ 699.
 *
 * NUMBERS AT T_PT (N ~ 488602; all normalized by Sum|t_k|, the Higham scale)
 * -----------------------------------------------------------------------------
 *   DET running-accumulator run-max (imp-35890, CERTIFIED)        : ~6.41e-14
 *   PROB Wilkinson sqrt(N-1) u * max|S_i| / Sum|t_k| (THIS)       : ~9.17e-17
 *   PROB Higham-Mary u * sqrt(Sum S_i^2) / Sum|t_k| (THIS, sharper): ~5.58e-17
 *   ACHIEVED naive (imp-35812 / imp-35852)                        : ~3.0e-17
 *
 * READING: the Wilkinson sqrt(N) scale lands at ~9.2e-17 -- ~2.84 orders BELOW the
 * imp-35890 certified deterministic run-max bound and only ~0.49 orders ABOVE the achieved
 * error. It therefore recovers ~2.84 / ~3.33 ~ 85% of the ~3.3-order residual gap that
 * imp-35890 left as the "coherent-vs-random-walk" pessimism. The sharper Higham-Mary
 * mean-square form (which uses the ACTUAL Sum_i S_i^2 rather than the peak) recovers ~92%,
 * landing ~1.9x above the achieved error -- confirming the residual IS the random-walk
 * factor and that essentially all of it is recovered once independence is assumed. The
 * ~0.3..0.5 orders that remain are the O(1) confidence-constant lambda and the difference
 * between the achieved single realization and the ensemble standard deviation. This
 * quantifies the imp-35890 residual as almost entirely the (N-1) -> sqrt(N-1) statistical
 * factor, NOT any recoverable deterministic slack.
 *
 * @see imp-35890-w1-running-accumulator-apriori-bound (the CERTIFIED deterministic rung above)
 * @see imp-35812-w1-summation-scheme-measured-cost (exact-BigInt achieved naive error ~3.0e-17)
 * @see imp-35852-w1-summation-adversarial-ordering (achieved error, random-walk reading)
 * @see imp-35854-w1-summation-kappa-sweep (achieved error vs condition number)
 * @see imp-35761-w1-certified-rounding-cost-scope (the pessimistic N*eps ceiling)
 * @see Higham and Mary 2019, "A New Approach to Probabilistic Rounding Error Analysis"
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms, sec 4.2
 */

// -- Anchor + operative constants (import-light; matching imp-35812 / imp-35890) --------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this assessment
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp); Higham gamma uses u

// Representative oscillatory Dirichlet-like term (identical to imp-35812 / imp-35890).
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// ACHIEVED naive normalized error at N_AT_TPT (imp-35812 exact-BigInt measurement, cited).
const ACHIEVED_NAIVE_NORM = 3.0e-17;

// Confidence constant lambda for the probabilistic scales (O(1); lambda=1 headline, carried
// symbolically -- a larger lambda widens the interval for a stricter failure probability).
const LAMBDA = 1;

// gamma_n = n u / (1 - n u) ~ n u (Higham worst-case recursive-sum factor).
const gamma = (n) => (n * U_ROUNDOFF) / (1 - n * U_ROUNDOFF);

// -- Single scan: track Sum|t_k|, max_i|S_i|, Sum_i S_i^2 (mean-square accumulator scale) --
function scanAt(N) {
  let s = 0; // running partial sum S_i
  let sumAbs = 0; // Sum |t_k| (the classic Higham magnitude scale, grows ~ sqrt(N))
  let maxPartial = 0; // max_i |S_i| (running accumulator magnitude, O(1) under cancellation)
  let sumSqPartial = 0; // Sum_i S_i^2 (mean-square accumulator scale for the Higham-Mary form)
  for (let k = 1; k <= N; k++) {
    const t = TERM(k);
    s += t;
    sumAbs += Math.abs(t);
    const a = Math.abs(s);
    if (a > maxPartial) maxPartial = a;
    sumSqPartial += s * s;
  }
  const gDet = gamma(N - 1); // coherent deterministic factor (N-1) u
  const sqrtFactor = Math.sqrt(N - 1); // random-walk factor sqrt(N-1)
  return {
    N,
    finalSum: s,
    sumAbs,
    maxPartial,
    rmsPartial: Math.sqrt(sumSqPartial / N),
    conditionNumber: sumAbs / Math.abs(s),
    // Normalized scales (divided by Sum|t_k|, directly comparable to imp-35812 measured errors):
    detRunMaxNorm: (gDet * maxPartial) / sumAbs, // imp-35890 CERTIFIED deterministic run-max
    probWilkinsonNorm: (LAMBDA * sqrtFactor * U_ROUNDOFF * maxPartial) / sumAbs, // sqrt(N) u * max|S_i|
    probHighamMaryNorm: (LAMBDA * U_ROUNDOFF * Math.sqrt(sumSqPartial)) / sumAbs, // u * sqrt(Sum S_i^2)
  };
}

// Growth ladder (identical sizes to imp-35812 / imp-35890) + the operative N_AT_TPT run.
const LADDER_SIZES = [1000, 10000, 100000, N_AT_TPT];
const LADDER = LADDER_SIZES.map(scanAt);
const AT_TPT = LADDER[LADDER.length - 1];

// Residual gap imp-35890 left (deterministic run-max down to the achieved error), in base-10 orders.
const ORDERS_RESIDUAL = Math.log10(AT_TPT.detRunMaxNorm / ACHIEVED_NAIVE_NORM); // ~3.33
// How much of that residual the Wilkinson sqrt(N) scale recovers.
const ORDERS_WILKINSON_RECOVERS = Math.log10(AT_TPT.detRunMaxNorm / AT_TPT.probWilkinsonNorm); // ~2.84
const ORDERS_WILKINSON_ABOVE_ACHIEVED = Math.log10(AT_TPT.probWilkinsonNorm / ACHIEVED_NAIVE_NORM); // ~0.49
const FRACTION_WILKINSON = ORDERS_WILKINSON_RECOVERS / ORDERS_RESIDUAL; // ~0.85
// The sharper Higham-Mary mean-square form, for contrast.
const ORDERS_HM_RECOVERS = Math.log10(AT_TPT.detRunMaxNorm / AT_TPT.probHighamMaryNorm); // ~3.06
const FRACTION_HM = ORDERS_HM_RECOVERS / ORDERS_RESIDUAL; // ~0.92

export const IMP35948_W1_PROBABILISTIC_SQRTN_APRIORI_SCALE = {
  id: 'imp-35948',
  proofSection: 'S-frontier',
  question:
    'ESTIMATE the intermediate Wilkinson-style PROBABILISTIC sqrt(N)*u a-priori error scale for ' +
    'the certified length-N W1 sum -- the rung between the imp-35890 CERTIFIED deterministic ' +
    'running-accumulator bound (~6.4e-14) and the imp-35852 / imp-35812 achieved random-walk error ' +
    '(~3.0e-17) -- and quantify how much of the ~3-order residual gap it recovers. Probabilistic ' +
    '(independence-conditional), NOT deterministically certified; instantiates no interval; changes ' +
    'no bound; NO QED.',
  termFamily: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (identical to imp-35812 / imp-35890, no RNG)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    conditionNumberAtTPT: AT_TPT.conditionNumber,
    sqrtFactorAtTPT: Math.sqrt(N_AT_TPT - 1),
  },
  lambda: {
    value: LAMBDA,
    note:
      'O(1) confidence constant multiplying the probabilistic scales; lambda = 1 headline, carried ' +
      'symbolically -- a larger lambda widens the interval for a stricter failure probability (Higham-Mary)',
  },
  scales: {
    note:
      'all normalized by Sum|t_k| (the Higham scale), directly comparable to imp-35812 measured errors; ' +
      'ordered from the certified deterministic rung down to the achieved error',
    detRunMaxCertified: {
      value: AT_TPT.detRunMaxNorm,
      form: 'gamma_{N-1} * max_i|S_i| / Sum|t_k|',
      source: 'imp-35890 CERTIFIED deterministic running-accumulator bound (coherent worst case)',
      certified: true,
    },
    probWilkinson: {
      value: AT_TPT.probWilkinsonNorm,
      form: 'lambda * sqrt(N-1) * u * max_i|S_i| / Sum|t_k|',
      source: 'Wilkinson sqrt(N) rule on the O(1) accumulator peak (THIS module)',
      certified: false,
      assumption: 'roundoffs independent mean-zero (statistical, NOT a deterministic certificate)',
    },
    probHighamMary: {
      value: AT_TPT.probHighamMaryNorm,
      form: 'lambda * u * sqrt(Sum_i S_i^2) / Sum|t_k|',
      source: 'Higham-Mary 2019 mean-square variance form (sharper; uses actual Sum S_i^2)',
      certified: false,
      assumption: 'roundoffs independent mean-zero (statistical, NOT a deterministic certificate)',
    },
    achievedNaive: {
      value: ACHIEVED_NAIVE_NORM,
      source: 'imp-35812 exact-BigInt measurement (cross-checked by imp-35852 / imp-35854)',
    },
  },
  accumulatorMagnitude: {
    maxPartialAtTPT: AT_TPT.maxPartial,
    rmsPartialAtTPT: AT_TPT.rmsPartial,
    sumAbsAtTPT: AT_TPT.sumAbs,
    note:
      'max_i|S_i| ~ 1.05 and rms_i|S_i| ~ 0.64 both O(1); the probabilistic scales differ from the ' +
      'imp-35890 deterministic bound only by the (N-1) -> sqrt(N-1) factor (Wilkinson) or by the ' +
      'peak -> rms swap folded into sqrt(Sum S_i^2) (Higham-Mary)',
  },
  gapRecovery: {
    ordersResidualDetToAchieved: ORDERS_RESIDUAL,
    wilkinson: {
      ordersRecovered: ORDERS_WILKINSON_RECOVERS,
      ordersAboveAchieved: ORDERS_WILKINSON_ABOVE_ACHIEVED,
      fractionOfResidualRecovered: FRACTION_WILKINSON,
    },
    highamMary: {
      ordersRecovered: ORDERS_HM_RECOVERS,
      fractionOfResidualRecovered: FRACTION_HM,
    },
    reading:
      'the Wilkinson sqrt(N) scale recovers ~85% (~2.84 of ~3.33 orders) of the imp-35890 residual and ' +
      'lands only ~0.49 orders above the achieved error; the sharper Higham-Mary mean-square form recovers ' +
      '~92%. The imp-35890 residual is therefore quantified as almost entirely the (N-1) -> sqrt(N-1) ' +
      'statistical factor -- NOT any recoverable deterministic slack -- with the residual ~0.3..0.5 orders ' +
      'being the O(1) confidence constant lambda and the single-realization-vs-ensemble-std difference',
  },
  ladder: LADDER.map((r) => ({
    N: r.N,
    maxPartial: r.maxPartial,
    detRunMaxNorm: r.detRunMaxNorm,
    probWilkinsonNorm: r.probWilkinsonNorm,
    probHighamMaryNorm: r.probHighamMaryNorm,
  })),
  conclusion: {
    intermediateRung:
      'the Wilkinson probabilistic scale ~9.2e-17 (normalized) is the intermediate rung between the ' +
      'imp-35890 CERTIFIED deterministic run-max bound ~6.4e-14 and the imp-35812 achieved error ~3.0e-17, ' +
      'obtained by replacing the coherent factor (N-1) with the random-walk factor sqrt(N-1) on the same ' +
      'O(1) accumulator peak',
    notCertified:
      'this scale is certifiable ONLY under a statistical-independence assumption on the roundoffs; it is ' +
      'NOT a deterministic worst-case certificate. The CERTIFIED a-priori bound stays the imp-35890 ' +
      'deterministic ~6.4e-14; this module changes no bound and instantiates no interval',
    residualIsStatistical:
      'recovering ~85% (Wilkinson) to ~92% (Higham-Mary) of the imp-35890 residual identifies that residual ' +
      'as the (N-1) -> sqrt(N-1) statistical factor rather than recoverable deterministic slack; precision ' +
      'stays NON-binding and the obstruction stays the ENGINEERING of the certified sum (imp-35725 MECHANICAL)',
    staysGreenfield:
      'this module assesses probabilistic a-priori scales only; it instantiates no directed-rounding interval ' +
      'and verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL ASSESSMENT (frontier-direction, probabilistic, NOT a certified bound). The Wilkinson-style ' +
    'probabilistic a-priori scale lambda * sqrt(N-1) * u * max_i|S_i| / Sum|t_k| on the imp-35812 term family ' +
    'at N ~ 488602 lands at ~9.2e-17 (normalized) -- ~2.84 orders BELOW the imp-35890 CERTIFIED deterministic ' +
    'running-accumulator bound ~6.4e-14 and only ~0.49 orders ABOVE the imp-35812 / imp-35852 achieved naive ' +
    'error ~3.0e-17 -- recovering ~85% of the ~3.3-order residual gap imp-35890 attributed to coherent-vs-' +
    'random-walk pessimism. The sharper Higham-Mary mean-square form u * sqrt(Sum_i S_i^2) / Sum|t_k| ~ 5.6e-17 ' +
    'recovers ~92%, landing ~1.9x above the achieved error, confirming the residual IS the (N-1) -> sqrt(N-1) ' +
    'statistical factor. Both scales are certifiable ONLY under a roundoff-independence assumption (Wilkinson ' +
    'rule / Higham-Mary 2019) -- NOT a deterministic worst-case certificate; the CERTIFIED a-priori bound stays ' +
    'the imp-35890 deterministic ~6.4e-14. Instantiates no directed-rounding interval; evaluates no true H_0; ' +
    'verifies no inequality; changes no bound; the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 ' +
    'Part A) and MECHANICAL (imp-35725); C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35890 (CERTIFIED deterministic running-accumulator bound this sits below); imp-35812 (exact-BigInt ' +
    'achieved naive error); imp-35852 / imp-35854 (achieved error under worst-case ordering / kappa sweep); ' +
    'imp-35761 (pessimistic N*eps ceiling); imp-35725 (mechanical N-term certified cost); imp-35681 Part A ' +
    '(A+B-C interval bound greenfield); imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) retained terms); Higham and ' +
    'Mary 2019 (probabilistic rounding error analysis); Higham 2002 sec 4.2; Platt-Trudgian 2021 (barrier base).',
};

export const IMP35948_W1_PROBABILISTIC_SQRTN_APRIORI_SCALE_ASSERTIONS = [
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602, matching imp-35812 / imp-35890.
    id: 'imp35948-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 retained terms anchored at T_PT = 3e12',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 &&
      N_AT_TPT < 4.9e5 &&
      AT_TPT.N === N_AT_TPT,
  },
  {
    // The deterministic run-max scale reproduces the imp-35890 CERTIFIED bound (~6.4e-14).
    id: 'imp35948-det-runmax-matches-imp35890',
    description: 'Deterministic run-max scale reproduces the imp-35890 certified ~6.4e-14 normalized bound',
    holds: () =>
      AT_TPT.detRunMaxNorm > 6.0e-14 &&
      AT_TPT.detRunMaxNorm < 6.8e-14 &&
      AT_TPT.maxPartial > 1.0 &&
      AT_TPT.maxPartial < 1.1,
  },
  {
    // Wilkinson probabilistic scale sits strictly BETWEEN the certified bound and the achieved error.
    id: 'imp35948-wilkinson-intermediate',
    description: 'Wilkinson sqrt(N) scale ~9.2e-17 lies strictly between imp-35890 ~6.4e-14 and achieved ~3.0e-17',
    holds: () =>
      AT_TPT.probWilkinsonNorm < AT_TPT.detRunMaxNorm &&
      AT_TPT.probWilkinsonNorm > ACHIEVED_NAIVE_NORM &&
      AT_TPT.probWilkinsonNorm > 8e-17 &&
      AT_TPT.probWilkinsonNorm < 1.1e-16,
  },
  {
    // The Wilkinson-to-deterministic ratio IS the sqrt(N-1) random-walk factor (~699).
    id: 'imp35948-ratio-is-sqrtN',
    description: 'detRunMax / probWilkinson equals the sqrt(N-1) ~699 random-walk factor (within 1%)',
    holds: () => {
      const ratio = AT_TPT.detRunMaxNorm / AT_TPT.probWilkinsonNorm;
      const sqrtFactorEff = ((N_AT_TPT - 1) * U_ROUNDOFF) / (1 - (N_AT_TPT - 1) * U_ROUNDOFF) / (Math.sqrt(N_AT_TPT - 1) * U_ROUNDOFF);
      return Math.abs(ratio - sqrtFactorEff) / sqrtFactorEff < 0.01 && ratio > 690 && ratio < 705;
    },
  },
  {
    // Wilkinson recovers ~85% of the ~3.3-order residual; Higham-Mary recovers more (~92%).
    id: 'imp35948-fraction-recovered',
    description: 'Wilkinson recovers ~85% (~2.84 of ~3.33 orders); Higham-Mary recovers ~92%, both under 1',
    holds: () =>
      ORDERS_RESIDUAL > 3.2 &&
      ORDERS_RESIDUAL < 3.5 &&
      FRACTION_WILKINSON > 0.80 &&
      FRACTION_WILKINSON < 0.90 &&
      FRACTION_HM > FRACTION_WILKINSON &&
      FRACTION_HM < 1.0,
  },
  {
    // Scale ordering: achieved < HighamMary < Wilkinson < detRunMax (certified).
    id: 'imp35948-scale-ordering',
    description: 'Scales ordered achieved < HighamMary <= Wilkinson < detRunMax (certified)',
    holds: () =>
      ACHIEVED_NAIVE_NORM < AT_TPT.probHighamMaryNorm &&
      AT_TPT.probHighamMaryNorm <= AT_TPT.probWilkinsonNorm &&
      AT_TPT.probWilkinsonNorm < AT_TPT.detRunMaxNorm,
  },
  {
    // Honesty gate: probabilistic (independence-conditional), NOT certified; greenfield; no QED; no refereed bound is changed.
    id: 'imp35948-honesty-gate',
    description: 'Probabilistic/not-certified; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35948_W1_PROBABILISTIC_SQRTN_APRIORI_SCALE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      IMP35948_W1_PROBABILISTIC_SQRTN_APRIORI_SCALE.scales.probWilkinson.certified === false &&
      /GREENFIELD/.test(IMP35948_W1_PROBABILISTIC_SQRTN_APRIORI_SCALE.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35948_W1_PROBABILISTIC_SQRTN_APRIORI_SCALE.verdict) &&
      /refereed bound is changed/i.test(IMP35948_W1_PROBABILISTIC_SQRTN_APRIORI_SCALE.verdict),
  },
];

for (const a of IMP35948_W1_PROBABILISTIC_SQRTN_APRIORI_SCALE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35948-w1-probabilistic-sqrtN-apriori-scale assertion failed: ${a.id}`);
  }
}
