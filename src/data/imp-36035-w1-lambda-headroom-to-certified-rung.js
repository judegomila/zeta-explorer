/**
 * @module imp-36035-w1-lambda-headroom-to-certified-rung
 *
 * imp-36035 (numerical, S-frontier): MEASURE the maximum confidence constant lambda the imp-35948
 * Higham-Mary probabilistic W1 a-priori scale (~5.58e-17 normalized at lambda = 1) can carry before
 * the scale times lambda reaches the imp-35890 CERTIFIED deterministic running-accumulator run-max
 * bound (~6.41e-14 normalized) at N ~ 488602, and the Higham-Mary 2019 failure probability
 * p_HM(lambda) = 2 exp(-lambda^2 / 2) implied at that crossover.
 *
 * WHY THIS RUNG. imp-35990 calibrated lambda only DOWNWARD -- against the imp-35812 ACHIEVED
 * single-realization error (lambda_required ~ 0.538 < 1, inside one sigma) -- and tabulated
 * p_HM at conventional levels (lambda ~ 6.55 for p = 1e-9). It never asked the UPWARD question:
 * how large can lambda grow before the probabilistic scale times lambda crosses ABOVE the
 * CERTIFIED deterministic rung. Between the covering lambda ~ 0.538 and that crossover lies the
 * entire confidence-margin headroom the probabilistic estimate affords while still sitting below
 * the certified bound. This module measures the crossover lambda_max = runMax / highamMary and the
 * astronomically small p_HM(lambda_max) it implies, quantifying that headroom in orders of failure
 * probability.
 *
 * NOT CERTIFIED. The failure-probability reading is certifiable ONLY under the Higham-Mary 2019
 * probabilistic model (roundoffs independent, mean-zero, |delta_i| <= u), which is NOT a
 * deterministic worst-case certificate. It instantiates no directed-rounding interval, certifies
 * no W1 bound, changes no bound. The CERTIFIED a-priori bound stays the imp-35890 deterministic
 * ~6.41e-14; the certified length-N interval sum stays MECHANICAL / GREENFIELD (imp-35725 /
 * imp-35681 Part A); C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * THE CROSSOVER (N ~ 488602; both scales normalized by Sum|t_k|)
 * -----------------------------------------------------------------------------
 *   Higham-Mary scale at lambda = 1   : ~5.58e-17   (imp-35948 / imp-35990)
 *   CERTIFIED deterministic run-max   : ~6.41e-14   (imp-35890; gamma_{N-1} * max|S_i| / Sum|t_k|)
 *   crossover lambda_max              : ~1148       (= runMax / highamMary; ticket estimate ~1149)
 *   p_HM(lambda_max) = 2 exp(-lambda_max^2 / 2)      : underflows to 0 in double; log10 ~ -286273
 *   lambda for p = 1e-9 (imp-35990)   : ~6.545
 *   headroom in lambda                : lambda_max / 6.545 ~ 175x
 *   headroom in failure probability   : log10 p_HM(lambda_max) - (-9) ~ 286264 orders below p=1e-9
 *
 * READING: the probabilistic Higham-Mary estimate could absorb a confidence constant as large as
 * lambda_max ~ 1148 -- roughly 175x the lambda ~ 6.55 that pins a conventional p = 1e-9 level, and
 * ~2134x the covering lambda ~ 0.538 of imp-35990 -- before it would even REACH the certified
 * deterministic rung. The Azuma-Hoeffding failure probability at that crossover is ~10^-286273, an
 * absurd margin: there are ~286264 orders of failure-probability headroom between the conventional
 * confidence level and the certified bound. The ~3-order gap between the probabilistic scale and the
 * certified rung (imp-35890 / imp-35995) translates, through the QUADRATIC lambda in the exponent,
 * into hundreds of thousands of orders of confidence margin -- the probabilistic estimate is nowhere
 * near stressing the certified ceiling. This is a headroom MEASUREMENT, not a tighter certificate:
 * the certified bound stays imp-35890 ~6.41e-14 regardless of how much confidence margin the
 * probabilistic model would nominally support.
 *
 * @see imp-35990-w1-lambda-confidence-calibration (calibrated lambda DOWNWARD to the achieved error)
 * @see imp-35948-w1-probabilistic-sqrtN-apriori-scale (the Higham-Mary scale this measures headroom in)
 * @see imp-35890-w1-running-accumulator-apriori-bound (the CERTIFIED deterministic rung ~6.41e-14)
 * @see imp-35995-w1-higham-mary-scale-ladder-trajectory (the ~3-order scale-vs-certified gap across N)
 * @see Higham and Mary 2019, "A New Approach to Probabilistic Rounding Error Analysis"
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms, sec 4.2
 */

// -- Anchor + operative constants (import-light; matching imp-35812 / imp-35890 / imp-35948 / imp-35990) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this assessment
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp); Higham gamma uses u
const gamma = (n) => (n * U_ROUNDOFF) / (1 - n * U_ROUNDOFF); // Higham gamma_n = n u / (1 - n u)

// Representative oscillatory Dirichlet-like term (identical to imp-35812 / imp-35890 / imp-35948 / imp-35990).
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// -- Single scan: Sum|t_k|, max_i|S_i|, Sum_i S_i^2 (identical to imp-35890 / imp-35948 / imp-35990) --------
function scanAt(N) {
  let s = 0; // running partial sum S_i
  let sumAbs = 0; // Sum |t_k| (the Higham magnitude scale)
  let maxPartial = 0; // max_i |S_i| (accumulator peak, O(1) under cancellation)
  let sumSqPartial = 0; // Sum_i S_i^2 (mean-square accumulator scale)
  for (let k = 1; k <= N; k++) {
    const t = TERM(k);
    s += t;
    sumAbs += Math.abs(t);
    const a = Math.abs(s);
    if (a > maxPartial) maxPartial = a;
    sumSqPartial += s * s;
  }
  const g = gamma(N - 1);
  return {
    N,
    sumAbs,
    maxPartial,
    sumSqPartial,
    // The sharper Higham-Mary probabilistic scale at lambda = 1 (normalized), matching imp-35948 / imp-35990.
    highamMaryAtUnitLambda: (U_ROUNDOFF * Math.sqrt(sumSqPartial)) / sumAbs, // ~5.58e-17
    // The CERTIFIED deterministic running-accumulator run-max bound (normalized), matching imp-35890.
    certifiedRunMaxNorm: (g * maxPartial) / sumAbs, // ~6.41e-14
  };
}

const AT_TPT = scanAt(N_AT_TPT);

// -- The UPWARD crossover: largest lambda the Higham-Mary scale can carry below the certified rung -----------
// lambda_max solves lambda * highamMary(lambda=1) = certifiedRunMax, i.e. lambda_max = certified / scale.
const LAMBDA_MAX = AT_TPT.certifiedRunMaxNorm / AT_TPT.highamMaryAtUnitLambda; // ~1148

// -- Failure-probability model (Higham-Mary 2019 / Azuma-Hoeffding two-sided tail) ---------------------------
// Mean-square (Higham-Mary) scale: exponent collapses exactly to lambda^2 / 2 (see imp-35990).
const pFailHighamMary = (lambda) => Math.min(1, 2 * Math.exp(-(lambda * lambda) / 2));
// p_HM(lambda_max) underflows to 0.0 in double (lambda_max^2/2 ~ 6.6e5); carry the log10 form instead.
const LOG10_PFAIL_AT_LAMBDA_MAX = Math.log10(2) - (LAMBDA_MAX * LAMBDA_MAX) / 2 / Math.LN10; // ~ -286273
const PFAIL_AT_LAMBDA_MAX_DOUBLE = pFailHighamMary(LAMBDA_MAX); // 0.0 (underflow) -- kept for honesty

// lambda needed for a target two-sided failure probability p under the mean-square model (imp-35990).
const lambdaForFailProb = (p) => Math.sqrt(2 * Math.log(2 / p));
const LAMBDA_AT_P_1E9 = lambdaForFailProb(1e-9); // ~6.545 (imp-35990 conventional confidence level)

// Headroom readings: in lambda (multiplicative) and in orders of failure probability below p = 1e-9.
const HEADROOM_LAMBDA_OVER_P1E9 = LAMBDA_MAX / LAMBDA_AT_P_1E9; // ~175x
const HEADROOM_ORDERS_BELOW_P1E9 = -9 - LOG10_PFAIL_AT_LAMBDA_MAX; // ~286264 orders (log10 p = -9 minus log10 p_HM)

export const IMP36035_W1_LAMBDA_HEADROOM_TO_CERTIFIED_RUNG = {
  id: 'imp-36035',
  proofSection: 'S-frontier',
  question:
    'MEASURE the maximum confidence constant lambda the imp-35948 Higham-Mary probabilistic W1 scale ' +
    '(~5.58e-17 normalized at lambda = 1) can carry before scale times lambda reaches the imp-35890 ' +
    'CERTIFIED deterministic running-accumulator run-max bound (~6.41e-14 normalized) at N ~ 488602, ' +
    'and the Higham-Mary 2019 failure probability p_HM(lambda) = 2 exp(-lambda^2/2) implied at that ' +
    'crossover -- quantifying the confidence-margin headroom while the probabilistic estimate stays ' +
    'below the certified rung. Probabilistic (independence-conditional), NOT certified; instantiates ' +
    'no interval; changes no bound; NO QED.',
  termFamily: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (identical to imp-35812 / imp-35948 / imp-35990, no RNG)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    maxPartialAtTPT: AT_TPT.maxPartial,
    sumAbsAtTPT: AT_TPT.sumAbs,
  },
  scales: {
    note: 'both normalized by Sum|t_k|; the Higham-Mary scale is at lambda = 1 (imp-35948 / imp-35990), the certified rung is imp-35890',
    highamMaryAtUnitLambda: AT_TPT.highamMaryAtUnitLambda, // ~5.58e-17
    certifiedRunMaxNorm: AT_TPT.certifiedRunMaxNorm, // ~6.41e-14 (deterministic, certified)
  },
  crossover: {
    note:
      'lambda_max = certifiedRunMax / highamMary(lambda = 1): the largest confidence constant the ' +
      'probabilistic Higham-Mary scale can carry before scale times lambda reaches the certified rung',
    lambdaMax: LAMBDA_MAX, // ~1148
    failProbAtLambdaMaxDouble: PFAIL_AT_LAMBDA_MAX_DOUBLE, // 0.0 (underflow in double)
    log10FailProbAtLambdaMax: LOG10_PFAIL_AT_LAMBDA_MAX, // ~ -286273
  },
  headroom: {
    note:
      'confidence-margin headroom the probabilistic estimate affords while staying below the certified ' +
      'deterministic bound, measured against the imp-35990 conventional p = 1e-9 level',
    lambdaAtP1e9: LAMBDA_AT_P_1E9, // ~6.545
    lambdaHeadroomOverP1e9: HEADROOM_LAMBDA_OVER_P1E9, // ~175x
    ordersOfFailProbBelowP1e9: HEADROOM_ORDERS_BELOW_P1E9, // ~286264 orders
  },
  reading:
    'the probabilistic Higham-Mary estimate could absorb a confidence constant as large as lambda_max ' +
    '~ 1148 -- ~175x the lambda ~ 6.55 that pins a conventional p = 1e-9 level -- before it would even ' +
    'REACH the certified deterministic rung ~6.41e-14. The Azuma-Hoeffding failure probability at that ' +
    'crossover is ~10^-286273, so there are ~286264 orders of failure-probability headroom below the ' +
    'conventional confidence level. The ~3-order scale-vs-certified gap (imp-35890 / imp-35995) becomes, ' +
    'through the QUADRATIC lambda in the exponent, hundreds of thousands of orders of confidence margin: ' +
    'the probabilistic estimate is nowhere near stressing the certified ceiling',
  conclusion: {
    hugeLambdaHeadroom:
      'lambda_max ~ 1148 is ~175x the p = 1e-9 confidence lambda (~6.55) and ~2134x the imp-35990 ' +
      'covering lambda (~0.538): the probabilistic scale has orders of confidence margin before the certified rung',
    astronomicalFailProbMargin:
      'p_HM(lambda_max) = 2 exp(-lambda_max^2/2) underflows to 0.0 in double (log10 ~ -286273), ~286264 ' +
      'orders below the conventional p = 1e-9 level -- the quadratic lambda turns the ~3-order scale gap into hundreds of thousands of orders',
    notCertified:
      'the failure-probability reading holds ONLY under the Higham-Mary 2019 independence model; it is ' +
      'NOT a deterministic worst-case certificate. The CERTIFIED a-priori bound stays imp-35890 ' +
      '~6.41e-14; this module changes no bound and instantiates no interval',
    staysGreenfield:
      'this module measures a symbolic confidence-constant crossover only; it instantiates no ' +
      'directed-rounding interval and verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL HEADROOM MEASUREMENT (frontier-direction, probabilistic, NOT a certified bound). On the ' +
    'imp-35812 term family t_k = cos(alpha k + beta sqrt k)/sqrt k at N ~ 488602, the largest confidence ' +
    'constant the imp-35948 Higham-Mary probabilistic scale (~5.58e-17 normalized at lambda = 1) can carry ' +
    'before scale times lambda reaches the imp-35890 CERTIFIED deterministic run-max rung (~6.41e-14 ' +
    'normalized) is lambda_max = runMax / highamMary ~ 1148 (ticket estimate ~1149) -- ~175x the lambda ' +
    '~ 6.55 that pins a conventional p = 1e-9 level (imp-35990) and ~2134x its covering lambda ~ 0.538. The ' +
    'Higham-Mary 2019 Azuma-Hoeffding two-sided tail p(lambda) = 2 exp(-lambda^2/2) at that crossover is ' +
    '~10^-286273 (underflows to 0.0 in double; carried in log10), so there are ~286264 orders of ' +
    'failure-probability headroom below the conventional confidence level. Because lambda enters the ' +
    'exponent QUADRATICALLY, the ~3-order scale-vs-certified gap (imp-35890 / imp-35995) becomes hundreds ' +
    'of thousands of orders of confidence margin: the probabilistic estimate is nowhere near stressing the ' +
    'certified ceiling. The reading is certifiable ONLY under the Higham-Mary independence model, NOT a ' +
    'deterministic worst-case certificate; the CERTIFIED a-priori bound stays imp-35890 ~6.41e-14. ' +
    'Instantiates no directed-rounding interval; evaluates no true H_0; verifies no inequality; changes ' +
    'no bound; the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL ' +
    '(imp-35725); C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35990 (calibrated lambda DOWNWARD to the achieved error, tabulated p_HM at fixed levels); ' +
    'imp-35948 (the Higham-Mary probabilistic scale this measures headroom in); imp-35890 (CERTIFIED ' +
    'deterministic running-accumulator run-max bound ~6.41e-14); imp-35995 (the ~3-order scale-vs-certified ' +
    'gap across the N ladder); imp-35812 (exact-BigInt achieved naive error); imp-35725 (mechanical N-term ' +
    'certified cost); imp-35681 Part A (A+B-C interval bound greenfield); imp-35674 Part D ' +
    '(N(x)=floor(sqrt(x/4 pi)) retained terms); Higham and Mary 2019 (probabilistic rounding error ' +
    'analysis); Higham 2002 sec 4.2; Platt-Trudgian 2021 (barrier base).',
};

export const IMP36035_W1_LAMBDA_HEADROOM_TO_CERTIFIED_RUNG_ASSERTIONS = [
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602, matching imp-35812 / imp-35890 / imp-35948 / imp-35990.
    id: 'imp36035-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 retained terms anchored at T_PT = 3e12',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 &&
      N_AT_TPT < 4.9e5 &&
      AT_TPT.N === N_AT_TPT,
  },
  {
    // The two scales reproduce imp-35948 / imp-35890 / imp-35990: Higham-Mary ~5.58e-17, certified ~6.41e-14.
    id: 'imp36035-scales-match-prior',
    description: 'Higham-Mary ~5.58e-17 (imp-35948/35990) and certified run-max ~6.41e-14 (imp-35890)',
    holds: () =>
      AT_TPT.highamMaryAtUnitLambda > 5.0e-17 &&
      AT_TPT.highamMaryAtUnitLambda < 6.2e-17 &&
      AT_TPT.certifiedRunMaxNorm > 6.0e-14 &&
      AT_TPT.certifiedRunMaxNorm < 6.9e-14 &&
      AT_TPT.certifiedRunMaxNorm > AT_TPT.highamMaryAtUnitLambda,
  },
  {
    // The crossover lambda_max ~ 1148 matches the ticket estimate ~1149 and is runMax / highamMary.
    id: 'imp36035-lambda-max-crossover',
    description: 'lambda_max = certifiedRunMax / highamMary ~ 1148 (ticket estimate ~1149)',
    holds: () =>
      LAMBDA_MAX > 1100 &&
      LAMBDA_MAX < 1200 &&
      Math.abs(LAMBDA_MAX * AT_TPT.highamMaryAtUnitLambda - AT_TPT.certifiedRunMaxNorm) <
        1e-12 * AT_TPT.certifiedRunMaxNorm + 1e-30,
  },
  {
    // p_HM(lambda_max) underflows to 0.0 in double; the log10 form is ~ -286273 (astronomically small).
    id: 'imp36035-failprob-underflow',
    description: 'p_HM(lambda_max) underflows to 0.0 in double; log10 p_HM ~ -286273',
    holds: () =>
      PFAIL_AT_LAMBDA_MAX_DOUBLE === 0 &&
      LOG10_PFAIL_AT_LAMBDA_MAX < -2.8e5 &&
      LOG10_PFAIL_AT_LAMBDA_MAX > -2.9e5,
  },
  {
    // lambda_max hugely exceeds the conventional p = 1e-9 confidence lambda (~6.545); headroom ~175x.
    id: 'imp36035-lambda-headroom-over-p1e9',
    description: 'lambda_max / lambda(p=1e-9) ~ 175x, so the probabilistic scale has vast confidence margin below the certified rung',
    holds: () =>
      LAMBDA_AT_P_1E9 > 6.4 &&
      LAMBDA_AT_P_1E9 < 6.7 &&
      HEADROOM_LAMBDA_OVER_P1E9 > 150 &&
      HEADROOM_LAMBDA_OVER_P1E9 < 200,
  },
  {
    // The failure-probability headroom is ~286264 orders below the conventional p = 1e-9 level.
    id: 'imp36035-orders-below-p1e9',
    description: 'p_HM(lambda_max) sits ~286264 orders below the conventional p = 1e-9 level',
    holds: () =>
      HEADROOM_ORDERS_BELOW_P1E9 > 2.8e5 &&
      HEADROOM_ORDERS_BELOW_P1E9 < 2.9e5 &&
      Math.abs(HEADROOM_ORDERS_BELOW_P1E9 - (-9 - LOG10_PFAIL_AT_LAMBDA_MAX)) < 1e-6,
  },
  {
    // Honesty gate: probabilistic (independence-conditional), NOT certified; greenfield; no QED; no refereed bound is changed.
    id: 'imp36035-honesty-gate',
    description: 'Probabilistic/not-certified; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP36035_W1_LAMBDA_HEADROOM_TO_CERTIFIED_RUNG.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /GREENFIELD/.test(IMP36035_W1_LAMBDA_HEADROOM_TO_CERTIFIED_RUNG.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36035_W1_LAMBDA_HEADROOM_TO_CERTIFIED_RUNG.verdict) &&
      /refereed bound is changed/i.test(IMP36035_W1_LAMBDA_HEADROOM_TO_CERTIFIED_RUNG.verdict),
  },
];

for (const a of IMP36035_W1_LAMBDA_HEADROOM_TO_CERTIFIED_RUNG_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36035-w1-lambda-headroom-to-certified-rung assertion failed: ${a.id}`);
  }
}
