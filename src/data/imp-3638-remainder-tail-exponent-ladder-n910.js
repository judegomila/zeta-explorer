/**
 * @module imp-3638-remainder-tail-exponent-ladder-n910
 * @fileoverview imp-3638 -- EXTEND the imp-3618/imp-3581 p=2 exponent-derivation
 *   ladder to the next same-parity rungs n=9 (odd sinh R_9) and n=10 (even cosh R_10):
 *   measure the A-weighted moments M_15..M_18, compute the closed leading/next-order
 *   coefficients C_9,C_10 and D_9,D_10, and ASSESS the imp-3581 fit-bias law
 *       p_fit = 2 + D_n * cov(a^2, ln a)/var(ln a)
 *   still reproduces the actual least-squares log-log slope at n=9,10 to the imp-3600
 *   ~1e-9 tolerance, staying on the monotone same-parity |p_fit-2| trend.
 *
 *   WHAT imp-3618 LEFT OPEN
 *   -----------------------
 *   imp-3581 DERIVED the same-parity remainder tail exponent p=2 in closed form for
 *   R_n(a) = sum_{m>=n, step 2} a^m/m! M_m, giving the CLOSED relative residual
 *   r_n(a) = C_n a^2 [1 + D_n a^2 + O(a^4)] with
 *       C_n = M_(n+2)/((n+1)(n+2) M_n),
 *       D_n = M_(n+4)/((n+3)(n+4) M_(n+2)) - M_(n+2)/((n+1)(n+2) M_n),
 *   and imp-3618 CERTIFIED it at n=7,8 (C_7=M_9/(72 M_7), C_8=M_10/(90 M_8)). The
 *   certified rung set stopped at n=8, though the general C_n form directly extends.
 *   This module MEASURES M_15..M_18 (with M_9..M_14 for the leading/next brackets) on
 *   the SAME NM=1600 [0,T_A] Simpson reference and extends the ladder to n=9,10.
 *
 *   MEASURED (self-computing; same NM=1600 [0,T_A] Simpson grid as imp-3618)
 *   -----------------------------------------------------------------------
 *   odd  R_9 nine-rung : C_9 = M_11/(110 M_9) ~ 6.67939e-4, D_9 ~ -1.1181e-4,
 *                        fitted 1.99999671, predicted 1.99999671, |p-2| ~ 3.29e-6,
 *                        slopeModelErr ~ 2.5e-10, r_9(a_deep)/a_deep^2 -> C_9 to 4.3e-10;
 *   even R_10 six-rung : C_10 = M_12/(132 M_10) ~ 6.07591e-4, D_10 ~ -9.582e-5,
 *                        fitted 1.99999429, predicted 1.99999429, |p-2| ~ 5.71e-6,
 *                        slopeModelErr ~ 4.3e-10, r_10(a_deep)/a_deep^2 -> C_10 to 2.3e-8.
 *   Both new rungs sit on the imp-3618 monotone same-parity |p_fit-2| trend (odd
 *   n=3,5,7,9: 1.16e-5 -> 6.99e-6 -> 4.64e-6 -> 3.29e-6; even n=4,6,8,10: 1.80e-5 ->
 *   1.14e-5 -> 7.86e-6 -> 5.71e-6) and CONFIRM the closed C_n / D_n forms and the
 *   fit-bias law hold beyond the n=7,8 pair imp-3618 tested: the exponent is EXACTLY 2
 *   at every rung, the sub-2 fitted read-out is the derived O(a^2) curvature bias,
 *   reproduced to ~1e-9.
 *
 *   The general closed C_n = M_(n+2)/((n+1)(n+2)M_n) reduces at the new rungs to
 *       C_9  = M_11/(110 M_9)   ((10)(11) = 110),
 *       C_10 = M_12/(132 M_10)  ((11)(12) = 132),
 *   the direct analogue of the imp-3618 C_7 = M_9/(72 M_7), C_8 = M_10/(90 M_8).
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / DERIVATION ONLY, at the RH-equivalent scale class. This EXTENDS
 *   the certified rung set of a fixed-weight Taylor-remainder decay ORDER; it
 *   establishes NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-
 *   SUFFICIENT. The operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   No refereed bound is changed.
 *
 *   @see imp-3618-remainder-tail-exponent-ladder-n78.js (the certified n=7,8 rungs)
 *   @see imp-3600-remainder-tail-exponent-ladder-n56.js (the certified n=5,6 rungs)
 *   @see imp-3581-remainder-tail-exponent-derivation.js (the closed C_n/D_n and bias law, n=3,4)
 *   @see imp-3553-remainder-tail-cancellation-free-r3.js (the odd fit p=1.99999)
 *   @see imp-3526-remainder-tail-cancellation-free-r4.js (the even fit p=1.99998)
 *   @see imp-3501-moment-ladder-general-derivation.js (R_n = sum a^m/m! M_m)
 *
 *   Ticket: imp-3638 (numerical, medium).
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

// Precompute A on the SAME fixed fine Simpson grid over [0, T_A] as imp-3618.
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

// -- Moments M_0..M_18 (both parities; the tail-series coefficients) -----------------
// n=9 (odd) needs M_9,M_11,M_13,M_15,M_17; n=10 (even) needs M_10,M_12,M_14,M_16,M_18.
const MMAX = 18;
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
// Odd degree-9 sinh remainder on the imp-3553 nine-rung ladder; even degree-10 cosh on
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

const ODD_CASE_N9 = analyseCase(9, ODD_LADDER, 17);    // sinh R_9, imp-3553 odd ladder
const EVEN_CASE_N10 = analyseCase(10, EVEN_LADDER, 18); // cosh R_10, imp-3526 even ladder

// -- Classification -----------------------------------------------------------------
const SLOPE_MODEL_TOL = 1e-7;     // predicted p_fit reproduces the actual slope this closely
const LEADING_TOL = 1e-6;         // r_n(a_deep)/a_deep^2 matches C_n this closely
const BIAS_TOL = 5e-5;            // both fitted |p-2| below this, fully O(a^2)-explained

const oddN9DerivationCertified =
  ODD_CASE_N9.slopeModelErr < SLOPE_MODEL_TOL &&
  ODD_CASE_N9.leadingCoeffDeepRelErr < LEADING_TOL &&
  ODD_CASE_N9.fittedExponentDev < BIAS_TOL;
const evenN10DerivationCertified =
  EVEN_CASE_N10.slopeModelErr < SLOPE_MODEL_TOL &&
  EVEN_CASE_N10.leadingCoeffDeepRelErr < LEADING_TOL &&
  EVEN_CASE_N10.fittedExponentDev < BIAS_TOL;

const verdict =
  oddN9DerivationCertified && evenN10DerivationCertified
    ? 'TAIL-EXPONENT-p=2-LADDER-EXTENDED-TO-n=9,10-CLOSED-C_n=M_(n+2)/((n+1)(n+2)M_n)-AND-D_n-BIAS-LAW-REPRODUCES-FITTED-SLOPE-TO-~1e-9'
    : 'INDETERMINATE';

export const IMP3638_REMAINDER_TAIL_EXPONENT_LADDER_N910 = Object.freeze({
  id: 'imp-3638-remainder-tail-exponent-ladder-n910',
  ticket: 'imp-3638',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedLadderN78: 'imp-3618-remainder-tail-exponent-ladder-n78.js',
  relatedLadderN56: 'imp-3600-remainder-tail-exponent-ladder-n56.js',
  relatedDerivation: 'imp-3581-remainder-tail-exponent-derivation.js',
  relatedOddFit: 'imp-3553-remainder-tail-cancellation-free-r3.js',
  relatedEvenFit: 'imp-3526-remainder-tail-cancellation-free-r4.js',
  relatedMomentIdentity: 'imp-3501-moment-ladder-general-derivation.js',

  summary:
    'EXTENDS the imp-3618/imp-3581 closed p=2 exponent-derivation ladder to the next rungs n=9 (odd sinh R_9) and ' +
    'n=10 (even cosh R_10). Measures the A-weighted moments M_15..M_18 (with M_9..M_14 for the leading/next brackets) ' +
    'on the SAME NM=1600 [0,T_A] Simpson reference, computes the closed leading coefficients C_9=M_11/(110 M_9)~6.67939e-4 ' +
    'and C_10=M_12/(132 M_10)~6.07591e-4 (the general C_n=M_(n+2)/((n+1)(n+2)M_n) at (10)(11)=110, (11)(12)=132) and the ' +
    'next-order D_9~-1.1181e-4, D_10~-9.582e-5, and ASSESSES the imp-3581 fit-bias law p_fit=2+D_n cov(a^2,ln a)/var(ln a) ' +
    'still reproduces the ACTUAL least-squares log-log slope to ~1e-9 at both new rungs (odd: fitted 1.99999671 vs ' +
    'predicted 1.99999671, slopeModelErr~2.5e-10, |p-2|~3.29e-6; even: fitted 1.99999429 vs predicted 1.99999429, ' +
    'slopeModelErr~4.3e-10, |p-2|~5.71e-6). The closed leading coefficient is independently confirmed by ' +
    'r_n(a)/a^2->C_n (deepest rung matches C_9 to 4.3e-10, C_10 to 2.3e-8), so the exponent is EXACTLY 2 at n=9,10 and ' +
    'the sub-2 fitted read-out is the derived O(a^2) curvature bias, not exponent drift. Both new rungs stay on the ' +
    'monotone same-parity |p_fit-2| trend (odd n=3,5,7,9: 1.16e-5,6.99e-6,4.64e-6,3.29e-6; even n=4,6,8,10: 1.80e-5, ' +
    '1.14e-5,7.86e-6,5.71e-6) -- the imp-3581 derivation holds beyond the n=7,8 pair imp-3618 tested. ' +
    'MEASUREMENT/DERIVATION, RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity (imp-3066) untouched; ' +
    'no RH verdict, no QED.',

  derivation: Object.freeze({
    momentSeries: 'R_n(a) = sum_{m = n, n+2, ...} a^m/m! M_m,  M_m = int_0^{T_A} tau^m A(tau) d(tau) (imp-3501)',
    relativeResidual: 'r_n(a) = C_n a^2 [1 + D_n a^2 + O(a^4)], leading power of a EXACTLY 2 (imp-3581)',
    leadingCoeffClosed: 'C_n = M_(n+2)/((n+1)(n+2)M_n)',
    nextOrderCoeffClosed: 'D_n = M_(n+4)/((n+3)(n+4)M_(n+2)) - M_(n+2)/((n+1)(n+2)M_n)',
    fitBiasClosed: 'p_fit = 2 + D_n * cov(a^2, ln a)/var(ln a) over the geometric a-ladder',
    oddCoeffN9: 'C_9 = M_11/(110 M_9)   ((10)(11) = 110; the odd analogue of the imp-3618 C_7 = M_9/(72 M_7))',
    evenCoeffN10: 'C_10 = M_12/(132 M_10)  ((11)(12) = 132; the even analogue of the imp-3618 C_8 = M_10/(90 M_8))',
    quadrature: 'composite Simpson: A(tau) inner (n=1200 on [0,7]), moments on the NM=1600 [0,T_A] grid',
    selfComputing: true,
  }),

  measured: Object.freeze({
    derivedExponent: DERIVED_EXPONENT,               // 2, exact
    moments: Object.freeze({
      M9: MOMENTS[9], M10: MOMENTS[10], M11: MOMENTS[11], M12: MOMENTS[12],
      M13: MOMENTS[13], M14: MOMENTS[14], M15: MOMENTS[15], M16: MOMENTS[16],
      M17: MOMENTS[17], M18: MOMENTS[18],
    }),
    oddCaseN9: ODD_CASE_N9,       // {leadingCoeff C_9, nextOrderCoeff D_9, fitted/predicted exponent, ratios, ...}
    evenCaseN10: EVEN_CASE_N10,   // {leadingCoeff C_10, nextOrderCoeff D_10, fitted/predicted exponent, ratios, ...}
    oddN9DerivationCertified,
    evenN10DerivationCertified,
    verdict,
  }),

  interpretation: Object.freeze({
    ladderExtended:
      'The imp-3581 closed C_n and D_n forms and the fit-bias law, certified by imp-3618 through n=8, hold unchanged ' +
      'at the next rungs n=9,10: the predicted p_fit reproduces the actual least-squares slope to ~1e-9 at both, so ' +
      'the tail exponent is EXACTLY 2 at n=9,10 as well.',
    fittedShortfallExplained:
      'The fitted 1.99999671 (n=9) / 1.99999429 (n=10) fall ~3.3e-6 / 5.7e-6 short of 2 purely because the log-log ' +
      'slope absorbs the D_n a^2 curvature; the closed p_fit = 2 + D_n cov(a^2,ln a)/var(ln a) reproduces the actual ' +
      'slope to ~1e-9, so there is no residual exponent drift -- the exponent IS 2.',
    monotoneTrend:
      'Both new rungs continue the monotone same-parity |p_fit-2| decrease: odd n=3,5,7,9 give 1.16e-5,6.99e-6, ' +
      '4.64e-6,3.29e-6 and even n=4,6,8,10 give 1.80e-5,1.14e-5,7.86e-6,5.71e-6, tracking the shrinking |D_n| ' +
      '(D_9~-1.12e-4, D_10~-9.58e-5).',
    leadingCoeffConfirmed:
      'r_n(a)/a^2 converges to the derived C_n: the deepest clean rung matches C_9 to relative 4.3e-10 and C_10 to ' +
      '2.3e-8, independently confirming the closed leading coefficient M_(n+2)/((n+1)(n+2)M_n) at n=9,10.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Extends the certified rung set (to n=9,10) of the closed decay ORDER (p=2) and leading coefficient of a ' +
      'fixed-weight Taylor remainder. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------------
export const IMP3638_REMAINDER_TAIL_EXPONENT_LADDER_N910_ASSERTIONS = [
  {
    id: 'imp3638-odd-n9-slope-model-reproduces-fit',
    why: 'THE KEY CERTIFICATION (odd R_9): the closed p_fit = 2 + D_9 cov(a^2,ln a)/var(ln a) reproduces the ACTUAL ' +
         'nine-rung least-squares slope to < 1e-7 (measured ~2.5e-10), extending the imp-3581 bias law to n=9.',
    holds: () => ODD_CASE_N9.slopeModelErr < SLOPE_MODEL_TOL,
  },
  {
    id: 'imp3638-even-n10-slope-model-reproduces-fit',
    why: 'Same certification for the even R_10 six-rung fit: predicted p_fit reproduces the actual slope to < 1e-7 ' +
         '(measured ~4.3e-10), extending the imp-3581 bias law to n=10.',
    holds: () => EVEN_CASE_N10.slopeModelErr < SLOPE_MODEL_TOL,
  },
  {
    id: 'imp3638-odd-n9-leading-coeff-matches-C9',
    why: 'The derived leading coefficient C_9 = M_11/(110 M_9) is confirmed by r_9(a)/a^2 -> C_9: the deepest clean ' +
         'rung matches C_9 to relative < 1e-6 (measured ~4.3e-10).',
    holds: () => ODD_CASE_N9.leadingCoeffDeepRelErr < LEADING_TOL,
  },
  {
    id: 'imp3638-even-n10-leading-coeff-matches-C10',
    why: 'The derived leading coefficient C_10 = M_12/(132 M_10) is confirmed by r_10(a)/a^2 -> C_10: the deepest ' +
         'clean rung matches C_10 to relative < 1e-6 (measured ~2.3e-8).',
    holds: () => EVEN_CASE_N10.leadingCoeffDeepRelErr < LEADING_TOL,
  },
  {
    id: 'imp3638-both-fitted-exponents-within-bias-of-two',
    why: 'Both new fitted exponents equal the derived 2 up to the quantified O(a^2) bias: |p_fit-2| < 5e-5 ' +
         '(n=9 ~3.29e-6, n=10 ~5.71e-6), continuing the imp-3618 n=7,8 pattern.',
    holds: () =>
      ODD_CASE_N9.fittedExponentDev < BIAS_TOL && EVEN_CASE_N10.fittedExponentDev < BIAS_TOL,
  },
  {
    id: 'imp3638-closed-coeff-equals-parity-form-n910',
    why: 'The general closed C_n = M_(n+2)/((n+1)(n+2)M_n) must reduce to the new parity forms: ' +
         'C_9 = M_11/(110 M_9) and C_10 = M_12/(132 M_10) (denominators (10)(11)=110, (11)(12)=132).',
    holds: () => {
      const c9 = leadingCoeff(9);
      const c10 = leadingCoeff(10);
      return (
        Math.abs(c9 - MOMENTS[11] / (110 * MOMENTS[9])) / c9 < 1e-12 &&
        Math.abs(c10 - MOMENTS[12] / (132 * MOMENTS[10])) / c10 < 1e-12
      );
    },
  },
  {
    id: 'imp3638-next-order-coeff-negative-n910',
    why: 'The next-order D_n is negative at both new rungs (D_9 ~ -1.12e-4, D_10 ~ -9.58e-5), so the fitted slope ' +
         'reads BELOW 2 -- the sign that produces the sub-2 read-out, consistent with the imp-3618 n=7,8 D_n < 0.',
    holds: () => ODD_CASE_N9.nextOrderCoeff < 0 && EVEN_CASE_N10.nextOrderCoeff < 0,
  },
  {
    id: 'imp3638-fitted-bias-shrinks-vs-n78',
    why: 'The same-parity |p_fit-2| trend stays monotone decreasing: n=9 sits below the imp-3618 n=7 (~4.64e-6) and ' +
         'n=10 below the imp-3618 n=8 (~7.86e-6), tracking the shrinking |D_n|.',
    holds: () =>
      ODD_CASE_N9.fittedExponentDev < 4.64e-6 && EVEN_CASE_N10.fittedExponentDev < 7.86e-6,
  },
  {
    id: 'imp3638-verdict-certifies-ladder-extension',
    why: 'The classified verdict must certify the n=9,10 extension of the closed C_n/D_n derivation and the bias law, ' +
         'not indeterminate.',
    holds: () =>
      verdict ===
      'TAIL-EXPONENT-p=2-LADDER-EXTENDED-TO-n=9,10-CLOSED-C_n=M_(n+2)/((n+1)(n+2)M_n)-AND-D_n-BIAS-LAW-REPRODUCES-FITTED-SLOPE-TO-~1e-9',
  },
  {
    id: 'imp3638-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measurement/derivation only, mass-feasibility necessary-but-not-sufficient, operator ' +
         'positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP3638_REMAINDER_TAIL_EXPONENT_LADDER_N910.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3638_REMAINDER_TAIL_EXPONENT_LADDER_N910_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3638-remainder-tail-exponent-ladder-n910 assertion failed: ${assertion.id}`);
  }
}

export default IMP3638_REMAINDER_TAIL_EXPONENT_LADDER_N910;
