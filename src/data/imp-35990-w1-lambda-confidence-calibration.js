/**
 * @module imp-35990-w1-lambda-confidence-calibration
 *
 * imp-35990 (numerical, S-frontier): CALIBRATE the O(1) confidence constant lambda that
 * imp-35948 carried SYMBOLICALLY (lambda ~ 1, never tuned) in the two probabilistic a-priori
 * scales for the certified length-N W1 interval sum -- the Wilkinson sqrt(N-1)*u*max|S_i| scale
 * (~9.17e-17 normalized) and the sharper Higham-Mary u*sqrt(Sum S_i^2) scale (~5.58e-17
 * normalized) -- against the imp-35812 ACHIEVED single-realization naive error (~3.0e-17
 * normalized) at N ~ 488602. MEASURE (i) the empirical lambda each scale requires to COVER the
 * achieved error, and (ii) the failure-probability reading that lambda implies under the
 * Higham-Mary 2019 Azuma-Hoeffding two-sided tail model.
 *
 * WHY THIS RUNG. imp-35948 supplied the two probabilistic scales BETWEEN the imp-35890
 * CERTIFIED deterministic run-max bound (~6.41e-14) and the imp-35812 achieved error (~3.0e-17)
 * but left ~0.3..0.5 orders of residual as "the O(1) confidence-constant lambda and the
 * single-realization-vs-ensemble-std difference", never separating the two. This module tunes
 * lambda directly: lambda_required = achievedError / scale(lambda=1). If lambda_required < 1 the
 * achieved realization is covered WITHOUT any confidence margin (it sits inside one standard
 * deviation); the residual imp-35948 flagged is then NOT a missing lambda margin but the ordinary
 * typical-fluctuation gap.
 *
 * NOT CERTIFIED. The failure-probability reading is certifiable ONLY under the Higham-Mary 2019
 * probabilistic model (roundoffs independent, mean-zero, |delta_i| <= u), which is NOT a
 * deterministic worst-case certificate. It instantiates no directed-rounding interval, certifies
 * no W1 bound, changes no bound. The CERTIFIED a-priori bound stays the imp-35890 deterministic
 * ~6.41e-14; the certified length-N interval sum stays MECHANICAL / GREENFIELD (imp-35725 /
 * imp-35681 Part A); C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * THE HIGHAM-MARY FAILURE-PROBABILITY MODEL
 * -----------------------------------------------------------------------------
 * Higham (2002) recursive-sum forward error is E_N = Sum_{i=2}^{N} S_i * delta_i with each
 * |delta_i| <= u (S_i the i-th partial sum). Treating the delta_i as independent mean-zero with
 * |delta_i| <= u, the increments X_i = S_i*delta_i satisfy |X_i| <= |S_i|*u. Azuma-Hoeffding gives
 *   P(|E_N| >= t)  <=  2 * exp( -t^2 / (2 * Sum_i (|S_i| u)^2) )  =  2 * exp( -t^2 / (2 u^2 Sum S_i^2) ).
 * Setting the target t = lambda * u * sqrt(Sum S_i^2) (the Higham-Mary MEAN-SQUARE scale) collapses
 * the exponent to lambda^2 / 2, so the two-sided failure probability implied by lambda is
 *   p_HM(lambda) = 2 * exp( -lambda^2 / 2 )    [mean-square scale; variance-matched].
 * The bound is VACUOUS (p >= 1) until lambda > lambda_star = sqrt(2 ln 2) ~ 1.1774; conventional
 * confidence levels need lambda ~ 2.45 (p = 0.1), ~3.26 (p = 0.01), ~6.55 (p = 1e-9).
 *
 * For the Wilkinson scale (target t = lambda*sqrt(N-1)*u*max|S_i|, which uses the accumulator
 * PEAK not the mean square) the same Azuma-Hoeffding exponent is lambda^2 * V / 2 with the
 * variance-proxy inflation V = (N-1)*max^2 / Sum S_i^2 ~ (max/rms)^2 ~ 2.69, so
 *   p_Wilk(lambda) = 2 * exp( -lambda^2 * V / 2 ).
 *
 * CALIBRATION AT T_PT (N ~ 488602; scales normalized by Sum|t_k|)
 * -----------------------------------------------------------------------------
 *   ACHIEVED naive (imp-35812)                              : ~3.0e-17
 *   Wilkinson scale at lambda = 1                           : ~9.17e-17  -> lambda_req ~ 0.327
 *   Higham-Mary scale at lambda = 1                         : ~5.58e-17  -> lambda_req ~ 0.538
 *   p_HM(lambda_req_HM)                                     : ~1.73 (VACUOUS, clamped to 1)
 *   lambda_star (Hoeffding bound becomes non-vacuous)       : ~1.1774
 *
 * READING: BOTH probabilistic scales already cover the achieved single-realization error with a
 * confidence constant BELOW 1 (lambda_req ~ 0.327 Wilkinson, ~0.538 Higham-Mary) -- i.e. the
 * achieved error sits at ~0.54 of the Higham-Mary ensemble standard deviation, comfortably inside
 * one sigma. The Higham-Mary Azuma-Hoeffding tail p_HM(lambda) = 2 exp(-lambda^2 / 2) is VACUOUS
 * (p >= 1) for every lambda <= lambda_star ~ 1.1774, so at the covering lambda the failure-
 * probability statement carries NO information: covering a typical sub-1-sigma draw needs no
 * confidence margin. This resolves the imp-35948 ~0.3..0.5-order residual as EXACTLY the sub-unit
 * lambda_required -- the single-realization-vs-standard-deviation gap -- and NOT a missing
 * confidence margin; imp-35948's lambda ~ 1 headline was already conservative by ~2-3x.
 *
 * @see imp-35948-w1-probabilistic-sqrtN-apriori-scale (the two scales this calibrates lambda in)
 * @see imp-35890-w1-running-accumulator-apriori-bound (the CERTIFIED deterministic rung above)
 * @see imp-35812-w1-summation-scheme-measured-cost (exact-BigInt achieved naive error ~3.0e-17)
 * @see imp-35949-w1-accumulator-frequency-grid-robustness (where the O(1) accumulator peak holds)
 * @see Higham and Mary 2019, "A New Approach to Probabilistic Rounding Error Analysis"
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms, sec 4.2
 */

// -- Anchor + operative constants (import-light; matching imp-35812 / imp-35890 / imp-35948) ----
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this assessment
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp); Higham gamma uses u

// Representative oscillatory Dirichlet-like term (identical to imp-35812 / imp-35890 / imp-35948).
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// ACHIEVED naive normalized error at N_AT_TPT (imp-35812 exact-BigInt measurement, cited).
const ACHIEVED_NAIVE_NORM = 3.0e-17;

// -- Single scan: Sum|t_k|, max_i|S_i|, Sum_i S_i^2 (identical to imp-35948) --------------------
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
  // The two probabilistic scales at lambda = 1 (normalized by Sum|t_k|), matching imp-35948.
  const wilkinsonAtUnitLambda = (Math.sqrt(N - 1) * U_ROUNDOFF * maxPartial) / sumAbs;
  const highamMaryAtUnitLambda = (U_ROUNDOFF * Math.sqrt(sumSqPartial)) / sumAbs;
  return { N, sumAbs, maxPartial, sumSqPartial, wilkinsonAtUnitLambda, highamMaryAtUnitLambda };
}

const AT_TPT = scanAt(N_AT_TPT);

// -- Failure-probability model (Higham-Mary 2019 / Azuma-Hoeffding two-sided tail) --------------
// Mean-square (Higham-Mary) scale: exponent collapses exactly to lambda^2 / 2.
const pFailHighamMary = (lambda) => Math.min(1, 2 * Math.exp(-(lambda * lambda) / 2));
// Wilkinson (peak) scale: variance-proxy inflation V = (N-1) max^2 / Sum S_i^2 ~ (max/rms)^2.
const VAR_INFLATION_WILK = ((N_AT_TPT - 1) * AT_TPT.maxPartial * AT_TPT.maxPartial) / AT_TPT.sumSqPartial;
const pFailWilkinson = (lambda) => Math.min(1, 2 * Math.exp(-(lambda * lambda * VAR_INFLATION_WILK) / 2));
// lambda at which the mean-square Hoeffding bound becomes non-vacuous (p = 1): sqrt(2 ln 2).
const LAMBDA_STAR = Math.sqrt(2 * Math.log(2));
// lambda needed for a target two-sided failure probability p under the mean-square model.
const lambdaForFailProb = (p) => Math.sqrt(2 * Math.log(2 / p));

// -- Calibration: lambda each scale needs to COVER the achieved single-realization error --------
const LAMBDA_REQ_WILKINSON = ACHIEVED_NAIVE_NORM / AT_TPT.wilkinsonAtUnitLambda; // ~0.327
const LAMBDA_REQ_HIGHAM_MARY = ACHIEVED_NAIVE_NORM / AT_TPT.highamMaryAtUnitLambda; // ~0.538

// The (vacuous, clamped) failure probability implied by each covering lambda.
const P_FAIL_AT_REQ_WILKINSON = pFailWilkinson(LAMBDA_REQ_WILKINSON);
const P_FAIL_AT_REQ_HIGHAM_MARY = pFailHighamMary(LAMBDA_REQ_HIGHAM_MARY);

// Reference confidence-level lambdas (mean-square model) for context.
const LAMBDA_TABLE = [0.1, 0.01, 1e-3, 1e-9].map((p) => ({ failProb: p, lambda: lambdaForFailProb(p) }));

export const IMP35990_W1_LAMBDA_CONFIDENCE_CALIBRATION = {
  id: 'imp-35990',
  proofSection: 'S-frontier',
  question:
    'CALIBRATE the O(1) confidence constant lambda that imp-35948 carried symbolically in the ' +
    'Wilkinson sqrt(N)*u*max|S_i| and Higham-Mary u*sqrt(Sum S_i^2) probabilistic a-priori scales ' +
    'against the imp-35812 achieved single-realization W1 error (~3.0e-17 normalized) at N ~ 488602: ' +
    'how large must lambda be for each probabilistic interval to COVER the achieved error, and what ' +
    'failure probability (Higham-Mary 2019 model) does that lambda imply. Probabilistic ' +
    '(independence-conditional), NOT certified; instantiates no interval; changes no bound; NO QED.',
  termFamily: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (identical to imp-35812 / imp-35948, no RNG)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    maxPartialAtTPT: AT_TPT.maxPartial,
    sumAbsAtTPT: AT_TPT.sumAbs,
    rmsPartialAtTPT: Math.sqrt(AT_TPT.sumSqPartial / N_AT_TPT),
  },
  achievedError: {
    value: ACHIEVED_NAIVE_NORM,
    source: 'imp-35812 exact-BigInt achieved naive error (single realization), normalized by Sum|t_k|',
  },
  scalesAtUnitLambda: {
    note: 'the imp-35948 probabilistic scales evaluated at lambda = 1, normalized by Sum|t_k|',
    wilkinson: AT_TPT.wilkinsonAtUnitLambda, // ~9.17e-17
    highamMary: AT_TPT.highamMaryAtUnitLambda, // ~5.58e-17
  },
  lambdaCalibration: {
    note:
      'lambda_required = achievedError / scale(lambda = 1); lambda < 1 means the achieved single ' +
      'realization is covered with NO confidence margin (inside one standard deviation)',
    wilkinson: {
      lambdaRequired: LAMBDA_REQ_WILKINSON, // ~0.327
      failProbImplied: P_FAIL_AT_REQ_WILKINSON, // clamped to 1 (vacuous)
      varInflation: VAR_INFLATION_WILK,
    },
    highamMary: {
      lambdaRequired: LAMBDA_REQ_HIGHAM_MARY, // ~0.538
      failProbImplied: P_FAIL_AT_REQ_HIGHAM_MARY, // clamped to 1 (vacuous)
    },
    bothBelowUnity: LAMBDA_REQ_WILKINSON < 1 && LAMBDA_REQ_HIGHAM_MARY < 1,
  },
  failureProbabilityModel: {
    note:
      'Higham-Mary 2019 / Azuma-Hoeffding two-sided tail: p_HM(lambda) = 2 exp(-lambda^2 / 2) for the ' +
      'mean-square scale (variance-matched); the Wilkinson peak scale carries a variance-proxy ' +
      'inflation V = (N-1) max^2 / Sum S_i^2 ~ (max/rms)^2 in the exponent',
    lambdaStarNonVacuous: LAMBDA_STAR, // ~1.1774: p_HM = 1
    referenceConfidenceLambdas: LAMBDA_TABLE,
  },
  reading:
    'both probabilistic scales cover the achieved single-realization error with lambda BELOW 1 ' +
    '(~0.327 Wilkinson, ~0.538 Higham-Mary) -- the achieved error sits at ~0.54 of the Higham-Mary ' +
    'ensemble standard deviation, inside one sigma. The Azuma-Hoeffding tail p_HM(lambda) = ' +
    '2 exp(-lambda^2 / 2) is VACUOUS (p >= 1) for every lambda <= ~1.1774, so at the covering lambda ' +
    'the failure-probability statement carries NO information. This resolves the imp-35948 ~0.3..0.5- ' +
    'order residual as EXACTLY the sub-unit lambda_required (single-realization-vs-std gap), NOT a ' +
    'missing confidence margin; imp-35948 lambda ~ 1 headline was already conservative by ~2-3x',
  conclusion: {
    lambdaBelowUnity:
      'the empirical lambda required to cover the achieved error is ~0.327 (Wilkinson) and ~0.538 ' +
      '(Higham-Mary), both BELOW 1, so imp-35948 lambda ~ 1 already over-covers the achieved error',
    failProbVacuous:
      'at those covering lambdas the Higham-Mary Azuma-Hoeffding two-sided tail 2 exp(-lambda^2 / 2) ' +
      'is >= 1 (clamped, VACUOUS) -- the bound becomes non-vacuous only for lambda > sqrt(2 ln 2) ~ ' +
      '1.1774, so covering a typical sub-1-sigma draw needs no confidence margin',
    notCertified:
      'the failure-probability reading holds ONLY under the Higham-Mary 2019 independence model; it is ' +
      'NOT a deterministic worst-case certificate. The CERTIFIED a-priori bound stays imp-35890 ' +
      '~6.41e-14; this module changes no bound and instantiates no interval',
    staysGreenfield:
      'this module calibrates a symbolic confidence constant only; it instantiates no directed-rounding ' +
      'interval and verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL CALIBRATION (frontier-direction, probabilistic, NOT a certified bound). On the imp-35812 ' +
    'term family t_k = cos(alpha k + beta sqrt k)/sqrt k at N ~ 488602, the O(1) confidence constant that ' +
    'imp-35948 carried symbolically calibrates to lambda_required ~ 0.327 for the Wilkinson ' +
    'sqrt(N-1)*u*max|S_i| scale (~9.17e-17 at lambda = 1) and ~0.538 for the sharper Higham-Mary ' +
    'u*sqrt(Sum S_i^2) scale (~5.58e-17 at lambda = 1) to cover the achieved single-realization error ' +
    '~3.0e-17 -- BOTH below 1, so the achieved error sits inside one ensemble standard deviation ' +
    '(~0.54 sigma, Higham-Mary). Under the Higham-Mary 2019 Azuma-Hoeffding two-sided tail p(lambda) = ' +
    '2 exp(-lambda^2 / 2), those covering lambdas give a VACUOUS failure probability (>= 1, clamped); the ' +
    'bound turns non-vacuous only for lambda > sqrt(2 ln 2) ~ 1.1774 (p = 0.1 needs lambda ~ 2.45, ' +
    'p = 1e-9 needs lambda ~ 6.55). This resolves the imp-35948 ~0.3..0.5-order residual as exactly the ' +
    'sub-unit lambda_required -- the single-realization-vs-standard-deviation gap -- not a missing ' +
    'confidence margin. The reading is certifiable ONLY under the Higham-Mary independence model, NOT a ' +
    'deterministic worst-case certificate; the CERTIFIED a-priori bound stays imp-35890 ~6.41e-14. ' +
    'Instantiates no directed-rounding interval; evaluates no true H_0; verifies no inequality; changes ' +
    'no bound; the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL ' +
    '(imp-35725); C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35948 (the two probabilistic scales this calibrates lambda in); imp-35890 (CERTIFIED ' +
    'deterministic running-accumulator bound ~6.41e-14); imp-35812 (exact-BigInt achieved naive error ' +
    '~3.0e-17); imp-35949 (where the O(1) accumulator peak holds); imp-35725 (mechanical N-term ' +
    'certified cost); imp-35681 Part A (A+B-C interval bound greenfield); imp-35674 Part D ' +
    '(N(x)=floor(sqrt(x/4 pi)) retained terms); Higham and Mary 2019 (probabilistic rounding error ' +
    'analysis); Higham 2002 sec 4.2; Platt-Trudgian 2021 (barrier base).',
};

export const IMP35990_W1_LAMBDA_CONFIDENCE_CALIBRATION_ASSERTIONS = [
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602, matching imp-35812 / imp-35890 / imp-35948.
    id: 'imp35990-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 retained terms anchored at T_PT = 3e12',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 &&
      N_AT_TPT < 4.9e5 &&
      AT_TPT.N === N_AT_TPT,
  },
  {
    // The two scales at lambda = 1 reproduce the imp-35948 values (~9.17e-17, ~5.58e-17).
    id: 'imp35990-scales-match-imp35948',
    description: 'Wilkinson ~9.17e-17 and Higham-Mary ~5.58e-17 at lambda = 1 reproduce imp-35948',
    holds: () =>
      AT_TPT.wilkinsonAtUnitLambda > 8e-17 &&
      AT_TPT.wilkinsonAtUnitLambda < 1.1e-16 &&
      AT_TPT.highamMaryAtUnitLambda > 5.0e-17 &&
      AT_TPT.highamMaryAtUnitLambda < 6.2e-17,
  },
  {
    // The calibrated lambda_required is BELOW 1 for BOTH scales (~0.327 Wilkinson, ~0.538 Higham-Mary).
    id: 'imp35990-lambda-below-unity',
    description: 'lambda_required ~ 0.327 (Wilkinson) and ~0.538 (Higham-Mary), both strictly below 1',
    holds: () =>
      LAMBDA_REQ_WILKINSON > 0.30 &&
      LAMBDA_REQ_WILKINSON < 0.36 &&
      LAMBDA_REQ_HIGHAM_MARY > 0.50 &&
      LAMBDA_REQ_HIGHAM_MARY < 0.57 &&
      LAMBDA_REQ_WILKINSON < 1 &&
      LAMBDA_REQ_HIGHAM_MARY < 1,
  },
  {
    // lambda_required = achieved / scale(lambda = 1): the covering lambda scales the interval to the error.
    id: 'imp35990-lambda-req-definition',
    description: 'lambda_required * scale(lambda = 1) reproduces the achieved error (within 1e-12)',
    holds: () =>
      Math.abs(LAMBDA_REQ_WILKINSON * AT_TPT.wilkinsonAtUnitLambda - ACHIEVED_NAIVE_NORM) < 1e-12 * ACHIEVED_NAIVE_NORM +
        1e-30 &&
      Math.abs(LAMBDA_REQ_HIGHAM_MARY * AT_TPT.highamMaryAtUnitLambda - ACHIEVED_NAIVE_NORM) <
        1e-12 * ACHIEVED_NAIVE_NORM + 1e-30,
  },
  {
    // The Higham-Mary tail is VACUOUS (clamped to 1) at the covering lambda; non-vacuous only past lambda_star.
    id: 'imp35990-failprob-vacuous',
    description: 'p_HM at lambda_required clamps to 1 (vacuous); becomes non-vacuous only past lambda_star ~ 1.1774',
    holds: () =>
      P_FAIL_AT_REQ_HIGHAM_MARY === 1 &&
      P_FAIL_AT_REQ_WILKINSON === 1 &&
      LAMBDA_STAR > 1.17 &&
      LAMBDA_STAR < 1.19 &&
      pFailHighamMary(LAMBDA_STAR) > 0.999 &&
      pFailHighamMary(LAMBDA_STAR + 0.5) < 1,
  },
  {
    // The failure-probability model is monotone-decreasing and the reference confidence lambdas grow.
    id: 'imp35990-failprob-model-monotone',
    description: 'p_HM(lambda) strictly decreasing; reference confidence lambdas grow (0.1 -> 1e-9 => ~2.45 -> ~6.55)',
    holds: () => {
      const ordered =
        LAMBDA_TABLE[0].lambda < LAMBDA_TABLE[1].lambda &&
        LAMBDA_TABLE[1].lambda < LAMBDA_TABLE[2].lambda &&
        LAMBDA_TABLE[2].lambda < LAMBDA_TABLE[3].lambda;
      const endpoints =
        LAMBDA_TABLE[0].lambda > 2.4 &&
        LAMBDA_TABLE[0].lambda < 2.5 &&
        LAMBDA_TABLE[3].lambda > 6.4 &&
        LAMBDA_TABLE[3].lambda < 6.7;
      return ordered && endpoints && pFailHighamMary(2) > pFailHighamMary(3);
    },
  },
  {
    // Honesty gate: probabilistic (independence-conditional), NOT certified; greenfield; no QED; no refereed bound is changed.
    id: 'imp35990-honesty-gate',
    description: 'Probabilistic/not-certified; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35990_W1_LAMBDA_CONFIDENCE_CALIBRATION.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      IMP35990_W1_LAMBDA_CONFIDENCE_CALIBRATION.lambdaCalibration.bothBelowUnity === true &&
      /GREENFIELD/.test(IMP35990_W1_LAMBDA_CONFIDENCE_CALIBRATION.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35990_W1_LAMBDA_CONFIDENCE_CALIBRATION.verdict) &&
      /refereed bound is changed/i.test(IMP35990_W1_LAMBDA_CONFIDENCE_CALIBRATION.verdict),
  },
];

for (const a of IMP35990_W1_LAMBDA_CONFIDENCE_CALIBRATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35990-w1-lambda-confidence-calibration assertion failed: ${a.id}`);
  }
}
