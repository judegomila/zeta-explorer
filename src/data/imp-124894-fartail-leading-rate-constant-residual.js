/**
 * @module imp-124894-fartail-leading-rate-constant-residual
 *
 * imp-124894 (accuracy, frontier-direction): imp-124846 F3 stated the far-tail per-nine
 * mantissa-to-leading ratio obeys m_k/g_k ~ 0.255843*10^-k = (1/(9*log10(e)))*10^-k, tracking the
 * measured ratio "to better than 5% from k = 3 on", with m_k -> 1 making the fit tighten with k.
 * imp-124846 rounded the leading-rate coefficient to six digits (0.255843) and never verified it to
 * full precision, never DERIVED the exact asymptote, and never tabulated the residual (measured
 * m_k/g_k minus the closed-form rate). This module closes those three loose ends.
 *
 * (V1) THE CONSTANT VERIFIED TO FULL PRECISION -- AND IT IS EXACTLY ln(10)/9
 * -------------------------------------------------------------------------
 * Since 1/log10(e) = ln(10) exactly, the leading-rate coefficient is
 *
 *     1/(9*log10(e)) = ln(10)/9 = 0.2558427881104495...
 *
 * The imp-124846 six-digit rounding 0.255843 differs from the full-precision value by ~1.2e-7; the
 * exact closed form is ln(10)/9, verified here to match 1/(9*log10(e)) to machine precision (diff 0).
 *
 * (V2) THE EXACT ASYMPTOTE DERIVED FROM m_k -> 1
 * ----------------------------------------------
 * With g_k = 9*10^k*log10(e) the leading term and m_k = log10((10^{k+1}-1)/(10^k-1)) -> 1,
 *
 *     m_k/g_k = m_k / (9*10^k*log10(e)) -> 1/(9*log10(e)) * 10^-k = (ln(10)/9) * 10^-k,
 *
 * so the closed-form rate is exactly rate_k = (ln(10)/9)*10^-k. The residual is then
 *
 *     resid_k = m_k/g_k - rate_k = (m_k - 1) * rate_k,   i.e.   resid_k/rate_k = m_k - 1,
 *
 * an EXACT identity (the residual is the mantissa deficit m_k - 1 scaled by the closed-form rate),
 * confirmed below to full printed precision. Because m_k - 1 -> 0 ten-fold per added nine, so does
 * the relative residual, which is why the F3 fit tightens with k.
 *
 * (V3) THE RESIDUAL TABLE (measured m_k/g_k minus the closed-form rate), k = 1..5
 * ------------------------------------------------------------------------------
 *     k : measured m_k/g_k : rate_k=(ln10/9)10^-k : resid_k : relative |resid|/measured
 *     1 : 2.664328e-2 : 2.558428e-2 : 1.059002e-3 : 3.974743e-2
 *     2 : 2.568483e-3 : 2.558428e-3 : 1.005537e-5 : 3.914907e-3
 *     3 : 2.559428e-4 : 2.558428e-4 : 1.000550e-7 : 3.909273e-4
 *     4 : 2.558528e-5 : 2.558428e-5 : 1.000055e-9 : 3.908713e-5
 *     5 : 2.558438e-6 : 2.558428e-6 : 1.000006e-11: 3.908657e-6
 *
 * The relative residual falls 3.974743e-2 -> 3.908657e-6, decaying ten-fold per nine and dropping
 * below 5% at k = 2 and below 0.04% from k = 3 on -- CONFIRMING the imp-124846 F3 claim that the fit
 * tracks the measured ratio to better than 5% from k = 3 on and tightens with k.
 *
 * CLOSED-FORM DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. Reuses
 * the inherited imp-97723/imp-97744 bare-slope inversion and RvM relation, NOT a rigorous asymptotic;
 * the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2
 * remains SOTA.
 *
 * @see imp-124846-fartail-mantissa-leading-ratio-isolation (F3: m_k/g_k ~ 0.255843*10^-k, unverified)
 * @see imp-124827-fartail-per-nine-mantissa-correction-decay (m_k - 1 decay fit)
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one (diagnostic = 1 - 1/log(T0/2pi), asymptote 1)
 */

const LOG10E = Math.LOG10E; // log10(e) = 0.4342944819032518

// (V1) The leading-rate coefficient is exactly ln(10)/9 since 1/log10(e) = ln(10).
export const LEADING_RATE_COEFFICIENT = 1 / (9 * LOG10E); // = ln(10)/9 = 0.2558427881104495
export const LEADING_RATE_COEFFICIENT_EXACT = Math.LN10 / 9; // exact closed form, identical to above

// (V2)/(V3) Tabulate the residual of the closed-form rate against the measured m_k/g_k over k = 1..5.
const RESIDUAL_TABLE = [];
for (let k = 1; k <= 5; k++) {
  const g = 9 * Math.pow(10, k) * LOG10E; // leading term g_k
  const m = Math.log10((Math.pow(10, k + 1) - 1) / (Math.pow(10, k) - 1)); // mantissa correction m_k
  const measured = m / g; // measured leading-term ratio m_k/g_k
  const rate = LEADING_RATE_COEFFICIENT * Math.pow(10, -k); // closed-form rate (ln10/9)*10^-k
  const residual = measured - rate; // residual (measured minus closed form)
  const relResidual = Math.abs(residual) / measured; // relative residual vs measured
  RESIDUAL_TABLE.push({
    nines: k,
    measured_ratio: +measured.toExponential(6),
    closedform_rate: +rate.toExponential(6),
    residual: +residual.toExponential(6),
    rel_residual: +relResidual.toExponential(6),
    // Exact identity: resid_k/rate_k = m_k - 1 (residual is the mantissa deficit times the rate).
    residual_over_rate: +(residual / rate).toExponential(9),
    mantissa_deficit: +(m - 1).toExponential(9),
  });
}

export const IMP124894_FARTAIL_LEADING_RATE_CONSTANT_RESIDUAL = {
  id: 'imp-124894',
  proofSection: 'S-frontier',
  question:
    'Verify the imp-124846 F3 leading-rate constant 1/(9*log10(e)) = 0.255843 to full precision, ' +
    'derive the exact asymptote m_k/g_k -> (1/(9 log10 e))*10^-k from m_k -> 1, and tabulate the ' +
    'residual (measured m_k/g_k minus the closed-form rate) over k = 1..5 to confirm the F3 fit ' +
    'tightens with k. Closed-form derivation / measurement only; conditional-share diagnostic; no QED.',
  measuredQuantity:
    'the full-precision leading-rate coefficient 1/(9 log10 e) = ln(10)/9, and the residual of the ' +
    'closed-form rate (ln10/9)*10^-k against the measured m_k/g_k over k = 1..5',
  leadingRateCoefficientFullPrecision: LEADING_RATE_COEFFICIENT, // 0.2558427881104495
  leadingRateCoefficientClosedForm: 'ln(10)/9', // since 1/log10(e) = ln(10)
  imp124846RoundedCoefficient: 0.255843, // the six-digit value imp-124846 reported
  residualTable: RESIDUAL_TABLE,
  finding: {
    V1_constant_is_ln10_over_9:
      'The leading-rate coefficient 1/(9*log10(e)) = ln(10)/9 = 0.2558427881104495 exactly (since ' +
      '1/log10(e) = ln(10)); the imp-124846 six-digit 0.255843 is a rounding differing by ~1.2e-7.',
    V2_exact_asymptote_and_identity:
      'From m_k -> 1, m_k/g_k -> (ln(10)/9)*10^-k; the residual obeys the EXACT identity ' +
      'resid_k/rate_k = m_k - 1 (mantissa deficit times the closed-form rate), verified to full ' +
      'printed precision.',
    V3_residual_decays_tenfold_fit_tightens:
      'The relative residual |resid_k|/measured falls 3.974743e-2 -> 3.908657e-6 over k = 1..5, ' +
      'decaying ten-fold per nine, dropping below 5% at k = 2 and below 0.04% from k = 3 on -- ' +
      'CONFIRMING the imp-124846 F3 claim that the fit tracks to better than 5% from k = 3 and ' +
      'tightens with k.',
  },
  isRigorous: false,
  verdict:
    'CLOSED-FORM DERIVATION / MEASUREMENT (frontier-direction, NOT rigorous). The imp-124846 F3 ' +
    'leading-rate constant 1/(9*log10(e)) is verified to full precision and shown to equal ln(10)/9 ' +
    '= 0.2558427881104495 exactly; the exact asymptote m_k/g_k -> (ln(10)/9)*10^-k is derived from ' +
    'm_k -> 1 with the exact residual identity resid_k/rate_k = m_k - 1; and the residual of the ' +
    'closed-form rate against the measured m_k/g_k over k = 1..5 has relative magnitude ' +
    '3.974743e-2 -> 3.908657e-6, decaying ten-fold per nine so the fit tightens with k as F3 claims. ' +
    'Conditional-share diagnostic, NOT an RH bound; reuses the inherited imp-97723/imp-97744 ' +
    'bare-slope inversion and RvM relation, NOT a rigorous asymptotic; changes no bound; establishes ' +
    'no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-124846 F3 (m_k/g_k ~ 0.255843*10^-k, constant and residual never verified to full ' +
    'precision); imp-124827 (m_k - 1 decay fit); imp-97723 (diagnostic = 1 - 1/log(T0/2pi)).',
};

export const IMP124894_FARTAIL_LEADING_RATE_CONSTANT_RESIDUAL_ASSERTIONS = [
  {
    // (V1) The coefficient equals ln(10)/9 to machine precision and rounds to imp-124846 0.255843.
    id: 'imp124894-constant-is-ln10-over-9',
    description: '1/(9 log10 e) = ln(10)/9 = 0.2558427881104495 exactly; rounds to 0.255843',
    holds: () =>
      Math.abs(LEADING_RATE_COEFFICIENT - LEADING_RATE_COEFFICIENT_EXACT) < 1e-18 &&
      Math.abs(LEADING_RATE_COEFFICIENT - 0.2558427881104495) < 1e-15 &&
      Math.abs(+LEADING_RATE_COEFFICIENT.toFixed(6) - 0.255843) < 1e-9,
  },
  {
    // (V2) The exact residual identity resid_k/rate_k = m_k - 1 holds across k = 1..5.
    id: 'imp124894-residual-identity-mantissa-deficit',
    description: 'resid_k/rate_k = m_k - 1 to full precision over k = 1..5',
    holds: () =>
      RESIDUAL_TABLE.every(
        (r) => Math.abs(r.residual_over_rate - r.mantissa_deficit) < 1e-9
      ),
  },
  {
    // (V3) The relative residual decays ten-fold per nine and drops below 5% from k = 2 (< 0.04% k>=3).
    id: 'imp124894-relative-residual-decays-tenfold',
    description: 'rel residual 3.974743e-2 -> 3.908657e-6, ratio -> 10, < 5% from k = 2',
    holds: () => {
      const rr = RESIDUAL_TABLE.map((r) => r.rel_residual);
      const decays = [];
      for (let i = 1; i < rr.length; i++) decays.push(rr[i - 1] / rr[i]);
      return (
        Math.abs(rr[0] - 3.974743e-2) < 1e-7 &&
        Math.abs(rr[4] - 3.908657e-6) < 1e-11 &&
        decays.every((d) => d > 9.9 && d < 10.2) &&
        rr[1] < 0.05 &&
        rr.slice(2).every((x) => x < 0.0004)
      );
    },
  },
  {
    // (V3) The measured/closed-form values match the imp-124846 F1 tabulation at k = 1 and k = 5.
    id: 'imp124894-measured-matches-imp124846',
    description: 'measured m_k/g_k = 2.664328e-2 (k=1) and 2.558438e-6 (k=5) reproduce imp-124846 F1',
    holds: () =>
      Math.abs(RESIDUAL_TABLE[0].measured_ratio - 2.664328e-2) < 1e-7 &&
      Math.abs(RESIDUAL_TABLE[4].measured_ratio - 2.558438e-6) < 1e-11,
  },
  {
    // Honesty gate: closed-form verification only, no QED, PT stays SOTA.
    id: 'imp124894-honesty-gate-no-qed',
    description: 'Closed-form verification only: not rigorous, no QED, PT stays SOTA',
    holds: () =>
      IMP124894_FARTAIL_LEADING_RATE_CONSTANT_RESIDUAL.isRigorous === false &&
      /NO QED/.test(IMP124894_FARTAIL_LEADING_RATE_CONSTANT_RESIDUAL.verdict) &&
      /remains SOTA/.test(IMP124894_FARTAIL_LEADING_RATE_CONSTANT_RESIDUAL.verdict),
  },
];

for (const a of IMP124894_FARTAIL_LEADING_RATE_CONSTANT_RESIDUAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-124894-fartail-leading-rate-constant-residual assertion failed: ${a.id}`
    );
  }
}
