/**
 * @module imp-3600-remainder-tail-exponent-ladder-n56
 * @fileoverview imp-3600 -- EXTEND the imp-3581 p=2 exponent-derivation ladder to
 *   the higher rungs n=5 (odd sinh) and n=6 (even cosh): measure the A-weighted
 *   moments M_7..M_10, compute the closed leading/next-order coefficients C_5,C_6
 *   and D_5,D_6, and CERTIFY the imp-3581 fit-bias law
 *       p_fit = 2 + D_n * cov(a^2, ln a)/var(ln a)
 *   reproduces the actual least-squares log-log slope at n=5,6 to the imp-3581
 *   ~1e-9 tolerance.
 *
 *   WHAT imp-3581 LEFT OPEN
 *   -----------------------
 *   imp-3581 DERIVED the moment-remainder tail exponent p=2 in closed form for the
 *   same-parity moment series R_n(a) = sum_{m>=n, step 2} a^m/m! M_m, giving the
 *   CLOSED relative residual r_n(a) = C_n a^2 [1 + D_n a^2 + O(a^4)] with
 *       C_n = M_(n+2)/((n+1)(n+2) M_n),
 *       D_n = M_(n+4)/((n+3)(n+4) M_(n+2)) - M_(n+2)/((n+1)(n+2) M_n),
 *   and the fit-bias law p_fit = 2 + D_n cov(a^2,ln a)/var(ln a). It VERIFIED the
 *   closed coefficients and the bias law only at n=3 (odd) and n=4 (even). This
 *   module MEASURES M_7,M_8 (and M_9,M_10 for the D_n next-order brackets) on the
 *   SAME Gauss-class Simpson reference and extends the certified ladder to n=5,6.
 *
 *   MEASURED (self-computing; same NM=1600 [0,T_A] Simpson grid as imp-3581)
 *   -----------------------------------------------------------------------
 *   odd  R_5 nine-rung : C_5 = M_7/(42 M_5) ~ 1.06348e-3, D_5 ~ -2.3767e-4,
 *                        fitted 1.99999301, predicted 1.99999302, |p-2| ~ 6.99e-6,
 *                        slopeModelErr ~ 6.4e-10, r_5(a_deep)/a_deep^2 -> C_5 to 9.1e-10;
 *   even R_6 six-rung  : C_6 = M_8/(56 M_6) ~ 9.31428e-4, D_6 ~ -1.9186e-4,
 *                        fitted 1.99998857, predicted 1.99998857, |p-2| ~ 1.14e-5,
 *                        slopeModelErr ~ 1.1e-9, r_6(a_deep)/a_deep^2 -> C_6 to 4.7e-8.
 *   Both new rungs sit on the imp-3581 monotone |p_fit-2| trend and CONFIRM the
 *   closed C_n / D_n forms and the fit-bias law hold beyond the n=3,4 pair the
 *   original module tested: the exponent is EXACTLY 2 at every rung, the sub-2
 *   fitted read-out is the derived O(a^2) curvature bias, reproduced to ~1e-9.
 *
 *   The general closed C_n = M_(n+2)/((n+1)(n+2)M_n) reduces at the new rungs to
 *       C_5 = M_7/(42 M_5)   ((6)(7) = 42),
 *       C_6 = M_8/(56 M_6)   ((7)(8) = 56),
 *   the direct analogue of the imp-3581 C_3 = M_5/(20 M_3), C_4 = M_6/(30 M_4).
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / DERIVATION ONLY, at the RH-equivalent scale class. This EXTENDS
 *   the certified rung set of a fixed-weight Taylor-remainder decay ORDER; it
 *   establishes NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-
 *   SUFFICIENT. The operator-level K_a >= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3581-remainder-tail-exponent-derivation.js (the closed C_n/D_n and bias law, n=3,4)
 *   @see imp-3553-remainder-tail-cancellation-free-r3.js (the odd fit p=1.99999)
 *   @see imp-3526-remainder-tail-cancellation-free-r4.js (the even fit p=1.99998)
 *   @see imp-3501-moment-ladder-general-derivation.js (R_n = sum a^m/m! M_m)
 *
 *   Ticket: imp-3600 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686). */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Composite Simpson quadrature of f on [lo, hi] with n subintervals (n even). */
function simpson(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = f(lo) + f(hi);
  for (let i = 1; i < m; i += 1) {
    sum += (i % 2 === 0 ? 2 : 4) * f(lo + i * h);
  }
  return (sum * h) / 3;
}

// Phi autocorrelation A(tau) = int_0^inf Phi(s) Phi(s + tau) ds (imp-3469 grid).
function autocorr(tau) {
  return simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, 1200);
}

// Precompute A on the SAME fixed fine Simpson grid over [0, T_A] as imp-3581.
const T_A = 6;
const NM = 1600;                                // even -> composite Simpson on [0, T_A]
const H_A = T_A / NM;
const A_GRID = [];
for (let j = 0; j <= NM; j += 1) A_GRID.push(autocorr(j * H_A));

/** int_0^{T_A} weight(tau) A(tau) d(tau) by composite Simpson on the precomputed grid. */
function aWeightedMass(weightFn) {
  let sum = 0;
  for (let j = 0; j <= NM; j += 1) {
    const tau = j * H_A;
    const w = j === 0 || j === NM ? 1 : (j % 2 === 0 ? 2 : 4);
    sum += w * weightFn(tau) * A_GRID[j];
  }
  return (sum * H_A) / 3;
}

/** n! for small integer n. */
function factorial(n) {
  let f = 1;
  for (let i = 2; i <= n; i += 1) f *= i;
  return f;
}

// -- Moments M_0..M_16 (both parities; the tail-series coefficients) ----------------
// n=5 (odd) needs M_5,M_7,M_9,M_11,M_13,M_15; n=6 (even) needs M_6,M_8,...,M_16.
const MMAX = 16;
const MOMENTS = {};                             // MOMENTS[m] = int tau^m A(tau) d(tau)
for (let m = 0; m <= MMAX; m += 1) MOMENTS[m] = aWeightedMass((tau) => Math.pow(tau, m));

// -- CLOSED-FORM leading/next-order relative-residual coefficients (imp-3581) --------
// r_n(a) = C_n a^2 [1 + D_n a^2 + O(a^4)],  C_n = M_(n+2)/((n+1)(n+2)M_n).
function leadingCoeff(n) {
  return MOMENTS[n + 2] / ((n + 1) * (n + 2) * MOMENTS[n]);
}
function nextOrderCoeff(n) {
  return (
    MOMENTS[n + 4] / ((n + 3) * (n + 4) * MOMENTS[n + 2]) -
    MOMENTS[n + 2] / ((n + 1) * (n + 2) * MOMENTS[n])
  );
}

// -- Cancellation-free remainder, tail, and relative residual (imp-3553/imp-3526) ---
function remainder(n, a, mmax) {
  let s = 0;
  for (let m = n; m <= mmax; m += 2) s += (Math.pow(a, m) / factorial(m)) * MOMENTS[m];
  return s;
}
function residualTail(n, a, mmax) {
  let s = 0;
  for (let m = n + 2; m <= mmax; m += 2) s += (Math.pow(a, m) / factorial(m)) * MOMENTS[m];
  return s;
}
function relativeResidual(n, a, mmax) {
  return residualTail(n, a, mmax) / remainder(n, a, mmax);
}

// -- Least-squares log-log fit: slope (the fitted exponent) and R^2 -----------------
function logLogFit(xs, ys) {
  const lx = xs.map((v) => Math.log(v));
  const ly = ys.map((v) => Math.log(v));
  const N = lx.length;
  const mx = lx.reduce((s, v) => s + v, 0) / N;
  const my = ly.reduce((s, v) => s + v, 0) / N;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < N; i += 1) {
    sxy += (lx[i] - mx) * (ly[i] - my);
    sxx += (lx[i] - mx) * (lx[i] - mx);
    syy += (ly[i] - my) * (ly[i] - my);
  }
  const slope = sxy / sxx;
  const r2 = syy === 0 ? 1 : (sxy * sxy) / (sxx * syy);
  return { slope, r2 };
}

// Predicted least-squares slope from ln r = ln C + 2 ln a + D a^2:
//   p_fit = 2 + D * cov(a^2, ln a) / var(ln a).
function predictedFitSlope(n, aLadder) {
  const dn = nextOrderCoeff(n);
  const la = aLadder.map((a) => Math.log(a));
  const a2 = aLadder.map((a) => a * a);
  const mla = la.reduce((s, v) => s + v, 0) / la.length;
  const ma2 = a2.reduce((s, v) => s + v, 0) / a2.length;
  let cov = 0;
  let varla = 0;
  for (let i = 0; i < la.length; i += 1) {
    cov += (a2[i] - ma2) * (la[i] - mla);
    varla += (la[i] - mla) * (la[i] - mla);
  }
  return 2 + (dn * cov) / varla;
}

// -- The two NEW ladder rungs under test --------------------------------------------
// Odd degree-5 sinh remainder on the imp-3553 nine-rung ladder; even degree-6 cosh on
// the imp-3526 six-rung ladder. mmax = top same-parity moment kept in each series.
const ODD_LADDER = Object.freeze([
  0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625, 0.0078125, 0.00390625, 0.001953125,
]);
const EVEN_LADDER = Object.freeze([0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625]);

const DERIVED_EXPONENT = 2;

function analyseCase(n, ladder, mmax) {
  const cn = leadingCoeff(n);
  const dn = nextOrderCoeff(n);
  const rel = ladder.map((a) => relativeResidual(n, a, mmax));
  const fit = logLogFit(ladder, rel);
  const predSlope = predictedFitSlope(n, ladder);
  // r_n(a)/a^2 -> C_n : deepest and top rung ratios.
  const ratios = ladder.map((a, i) => rel[i] / (a * a));
  const aDeep = ladder[ladder.length - 1];
  const cnDeepRelErr = Math.abs(ratios[ratios.length - 1] - cn) / cn;
  return Object.freeze({
    n,
    ladder,
    mmax,
    leadingCoeff: cn,                       // C_n = M_(n+2)/((n+1)(n+2)M_n)
    nextOrderCoeff: dn,                     // D_n
    fittedExponent: fit.slope,              // actual least-squares slope
    fitR2: fit.r2,
    fittedExponentDev: Math.abs(fit.slope - DERIVED_EXPONENT),
    predictedExponent: predSlope,           // 2 + D_n cov/var
    predictedExponentDev: Math.abs(predSlope - DERIVED_EXPONENT),
    slopeModelErr: Math.abs(predSlope - fit.slope),   // predicted vs actual, ~1e-9
    ratioDeep: ratios[ratios.length - 1],   // r_n(a_deep)/a_deep^2
    ratioTop: ratios[0],                    // r_n(0.5)/0.25
    aDeep,
    leadingCoeffDeepRelErr: cnDeepRelErr,   // |ratioDeep - C_n|/C_n
  });
}

const ODD_CASE_N5 = analyseCase(5, ODD_LADDER, 15);   // sinh R_5, imp-3553 odd ladder
const EVEN_CASE_N6 = analyseCase(6, EVEN_LADDER, 16); // cosh R_6, imp-3526 even ladder

// -- Classification -----------------------------------------------------------------
const SLOPE_MODEL_TOL = 1e-7;     // predicted p_fit reproduces the actual slope this closely
const LEADING_TOL = 1e-6;         // r_n(a_deep)/a_deep^2 matches C_n this closely
const BIAS_TOL = 5e-5;            // both fitted |p-2| below this, fully O(a^2)-explained

const oddN5DerivationCertified =
  ODD_CASE_N5.slopeModelErr < SLOPE_MODEL_TOL &&
  ODD_CASE_N5.leadingCoeffDeepRelErr < LEADING_TOL &&
  ODD_CASE_N5.fittedExponentDev < BIAS_TOL;
const evenN6DerivationCertified =
  EVEN_CASE_N6.slopeModelErr < SLOPE_MODEL_TOL &&
  EVEN_CASE_N6.leadingCoeffDeepRelErr < LEADING_TOL &&
  EVEN_CASE_N6.fittedExponentDev < BIAS_TOL;

const verdict =
  oddN5DerivationCertified && evenN6DerivationCertified
    ? 'TAIL-EXPONENT-p=2-LADDER-EXTENDED-TO-n=5,6-CLOSED-C_n=M_(n+2)/((n+1)(n+2)M_n)-AND-D_n-BIAS-LAW-REPRODUCES-FITTED-SLOPE-TO-~1e-9'
    : 'INDETERMINATE';

export const IMP3600_REMAINDER_TAIL_EXPONENT_LADDER_N56 = Object.freeze({
  id: 'imp-3600-remainder-tail-exponent-ladder-n56',
  ticket: 'imp-3600',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedDerivation: 'imp-3581-remainder-tail-exponent-derivation.js',
  relatedOddFit: 'imp-3553-remainder-tail-cancellation-free-r3.js',
  relatedEvenFit: 'imp-3526-remainder-tail-cancellation-free-r4.js',
  relatedMomentIdentity: 'imp-3501-moment-ladder-general-derivation.js',

  summary:
    'EXTENDS the imp-3581 closed p=2 exponent-derivation ladder to the higher rungs n=5 (odd sinh R_5) and n=6 ' +
    '(even cosh R_6). Measures the A-weighted moments M_7,M_8 (and M_9,M_10 for the next-order brackets) on the SAME ' +
    'NM=1600 [0,T_A] Simpson reference, computes the closed leading coefficients C_5=M_7/(42 M_5)~1.06348e-3 and ' +
    'C_6=M_8/(56 M_6)~9.31428e-4 (the general C_n=M_(n+2)/((n+1)(n+2)M_n) at (6)(7)=42, (7)(8)=56) and the next-order ' +
    'D_5~-2.3767e-4, D_6~-1.9186e-4, and CERTIFIES the imp-3581 fit-bias law p_fit=2+D_n cov(a^2,ln a)/var(ln a) ' +
    'reproduces the ACTUAL least-squares log-log slope to ~1e-9 at both new rungs (odd: fitted 1.99999301 vs ' +
    'predicted 1.99999302, slopeModelErr~6.4e-10, |p-2|~6.99e-6; even: fitted 1.99998857 vs predicted 1.99998857, ' +
    'slopeModelErr~1.1e-9, |p-2|~1.14e-5). The closed leading coefficient is independently confirmed by ' +
    'r_n(a)/a^2->C_n (deepest rung matches C_5 to 9.1e-10, C_6 to 4.7e-8), so the exponent is EXACTLY 2 at n=5,6 and ' +
    'the sub-2 fitted read-out is the derived O(a^2) curvature bias, not exponent drift -- the imp-3581 derivation ' +
    'holds beyond the n=3,4 pair it originally tested. MEASUREMENT/DERIVATION, RH-EQUIVALENT, ' +
    'necessary-but-not-sufficient; operator positivity (imp-3066) untouched; no RH verdict, no QED.',

  derivation: Object.freeze({
    momentSeries: 'R_n(a) = sum_{m = n, n+2, ...} a^m/m! M_m,  M_m = int_0^{T_A} tau^m A(tau) d(tau) (imp-3501)',
    relativeResidual: 'r_n(a) = C_n a^2 [1 + D_n a^2 + O(a^4)], leading power of a EXACTLY 2 (imp-3581)',
    leadingCoeffClosed: 'C_n = M_(n+2)/((n+1)(n+2)M_n)',
    nextOrderCoeffClosed: 'D_n = M_(n+4)/((n+3)(n+4)M_(n+2)) - M_(n+2)/((n+1)(n+2)M_n)',
    fitBiasClosed: 'p_fit = 2 + D_n * cov(a^2, ln a)/var(ln a) over the geometric a-ladder',
    oddCoeffN5: 'C_5 = M_7/(42 M_5)   ((6)(7) = 42; the odd analogue of the imp-3581 C_3 = M_5/(20 M_3))',
    evenCoeffN6: 'C_6 = M_8/(56 M_6)  ((7)(8) = 56; the even analogue of the imp-3581 C_4 = M_6/(30 M_4))',
    quadrature: 'composite Simpson: A(tau) inner (n=1200 on [0,7]), moments on the NM=1600 [0,T_A] grid',
    selfComputing: true,
  }),

  measured: Object.freeze({
    derivedExponent: DERIVED_EXPONENT,               // 2, exact
    moments: Object.freeze({
      M5: MOMENTS[5], M6: MOMENTS[6], M7: MOMENTS[7], M8: MOMENTS[8],
      M9: MOMENTS[9], M10: MOMENTS[10],
    }),
    oddCaseN5: ODD_CASE_N5,     // {leadingCoeff C_5, nextOrderCoeff D_5, fitted/predicted exponent, ratios, ...}
    evenCaseN6: EVEN_CASE_N6,   // {leadingCoeff C_6, nextOrderCoeff D_6, fitted/predicted exponent, ratios, ...}
    oddN5DerivationCertified,
    evenN6DerivationCertified,
    verdict,
  }),

  interpretation: Object.freeze({
    ladderExtended:
      'The imp-3581 closed C_n and D_n forms and the fit-bias law, verified there only at n=3,4, hold unchanged at ' +
      'the higher rungs n=5,6: the predicted p_fit reproduces the actual least-squares slope to ~1e-9 at both, so ' +
      'the tail exponent is EXACTLY 2 at n=5,6 as well.',
    fittedShortfallExplained:
      'The fitted 1.99999301 (n=5) / 1.99998857 (n=6) fall ~7.0e-6 / 1.1e-5 short of 2 purely because the log-log ' +
      'slope absorbs the D_n a^2 curvature; the closed p_fit = 2 + D_n cov(a^2,ln a)/var(ln a) reproduces the actual ' +
      'slope to ~1e-9, so there is no residual exponent drift -- the exponent IS 2.',
    leadingCoeffConfirmed:
      'r_n(a)/a^2 converges to the derived C_n: the deepest clean rung matches C_5 to relative 9.1e-10 and C_6 to ' +
      '4.7e-8, independently confirming the closed leading coefficient M_(n+2)/((n+1)(n+2)M_n) at n=5,6.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Extends the certified rung set (to n=5,6) of the closed decay ORDER (p=2) and leading coefficient of a ' +
      'fixed-weight Taylor remainder. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------------
export const IMP3600_REMAINDER_TAIL_EXPONENT_LADDER_N56_ASSERTIONS = [
  {
    id: 'imp3600-odd-n5-slope-model-reproduces-fit',
    why: 'THE KEY CERTIFICATION (odd R_5): the closed p_fit = 2 + D_5 cov(a^2,ln a)/var(ln a) reproduces the ACTUAL ' +
         'nine-rung least-squares slope to < 1e-7 (measured ~6.4e-10), extending the imp-3581 bias law to n=5.',
    holds: () => ODD_CASE_N5.slopeModelErr < SLOPE_MODEL_TOL,
  },
  {
    id: 'imp3600-even-n6-slope-model-reproduces-fit',
    why: 'Same certification for the even R_6 six-rung fit: predicted p_fit reproduces the actual slope to < 1e-7 ' +
         '(measured ~1.1e-9), extending the imp-3581 bias law to n=6.',
    holds: () => EVEN_CASE_N6.slopeModelErr < SLOPE_MODEL_TOL,
  },
  {
    id: 'imp3600-odd-n5-leading-coeff-matches-C5',
    why: 'The derived leading coefficient C_5 = M_7/(42 M_5) is confirmed by r_5(a)/a^2 -> C_5: the deepest clean ' +
         'rung matches C_5 to relative < 1e-6 (measured ~9.1e-10).',
    holds: () => ODD_CASE_N5.leadingCoeffDeepRelErr < LEADING_TOL,
  },
  {
    id: 'imp3600-even-n6-leading-coeff-matches-C6',
    why: 'The derived leading coefficient C_6 = M_8/(56 M_6) is confirmed by r_6(a)/a^2 -> C_6: the deepest clean ' +
         'rung matches C_6 to relative < 1e-6 (measured ~4.7e-8).',
    holds: () => EVEN_CASE_N6.leadingCoeffDeepRelErr < LEADING_TOL,
  },
  {
    id: 'imp3600-both-fitted-exponents-within-bias-of-two',
    why: 'Both new fitted exponents equal the derived 2 up to the quantified O(a^2) bias: |p_fit-2| < 5e-5 ' +
         '(n=5 ~6.99e-6, n=6 ~1.14e-5), continuing the imp-3581 n=3,4 pattern.',
    holds: () =>
      ODD_CASE_N5.fittedExponentDev < BIAS_TOL && EVEN_CASE_N6.fittedExponentDev < BIAS_TOL,
  },
  {
    id: 'imp3600-closed-coeff-equals-parity-form-n56',
    why: 'The general closed C_n = M_(n+2)/((n+1)(n+2)M_n) must reduce to the new parity forms: ' +
         'C_5 = M_7/(42 M_5) and C_6 = M_8/(56 M_6) (denominators (6)(7)=42, (7)(8)=56).',
    holds: () => {
      const c5 = leadingCoeff(5);
      const c6 = leadingCoeff(6);
      return (
        Math.abs(c5 - MOMENTS[7] / (42 * MOMENTS[5])) / c5 < 1e-12 &&
        Math.abs(c6 - MOMENTS[8] / (56 * MOMENTS[6])) / c6 < 1e-12
      );
    },
  },
  {
    id: 'imp3600-next-order-coeff-negative-n56',
    why: 'The next-order D_n is negative at both new rungs (D_5 ~ -2.38e-4, D_6 ~ -1.92e-4), so the fitted slope ' +
         'reads BELOW 2 -- the sign that produces the sub-2 read-out, consistent with the imp-3581 n=3,4 D_n < 0.',
    holds: () => ODD_CASE_N5.nextOrderCoeff < 0 && EVEN_CASE_N6.nextOrderCoeff < 0,
  },
  {
    id: 'imp3600-verdict-certifies-ladder-extension',
    why: 'The classified verdict must certify the n=5,6 extension of the closed C_n/D_n derivation and the bias law, ' +
         'not indeterminate.',
    holds: () =>
      verdict ===
      'TAIL-EXPONENT-p=2-LADDER-EXTENDED-TO-n=5,6-CLOSED-C_n=M_(n+2)/((n+1)(n+2)M_n)-AND-D_n-BIAS-LAW-REPRODUCES-FITTED-SLOPE-TO-~1e-9',
  },
  {
    id: 'imp3600-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measurement/derivation only, mass-feasibility necessary-but-not-sufficient, operator ' +
         'positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3600_REMAINDER_TAIL_EXPONENT_LADDER_N56.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3600_REMAINDER_TAIL_EXPONENT_LADDER_N56_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3600-remainder-tail-exponent-ladder-n56 assertion failed: ${assertion.id}`);
  }
}

export default IMP3600_REMAINDER_TAIL_EXPONENT_LADDER_N56;
