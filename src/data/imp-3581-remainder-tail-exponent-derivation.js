/**
 * @module imp-3581-remainder-tail-exponent-derivation
 * @fileoverview imp-3581 -- DERIVE the moment-remainder tail exponent p = 2
 *   analytically (both the odd sinh R_3 and the even cosh R_4) and CERTIFY that
 *   the imp-3553 cancellation-free fitted p = 1.99999 and the imp-3502 fits equal
 *   the derived 2 up to a fully-explained O(a^2) log-log fit bias.
 *
 *   WHAT imp-3502 AND imp-3553 LEFT OPEN
 *   ------------------------------------
 *   imp-3502 FIT the tail exponent to p ~ 2 (within 0.03, R^2 > 0.9999) and
 *   imp-3553 SHARPENED the odd degree-3 fit to p = 1.99999 on a nine-rung
 *   cancellation-free ladder (|p-2| ~ 1.2e-5). Neither DERIVED p = 2 from the
 *   moment structure, nor explained WHY the fitted value falls ~1.2e-5 SHORT of 2.
 *   This module supplies the closed derivation and the fit-bias accounting.
 *
 *   THE DERIVATION (general n; imp-3501 moment identity)
 *   ----------------------------------------------------
 *   With the A-weighted moments M_m = int_0^{T_A} tau^m A(tau) d(tau), the
 *   cancellation-free degree-n remainder is the same-parity moment series
 *       R_n(a) = sum_{m = n, n+2, ...} a^m/m! M_m
 *              = (a^n/n!) M_n + (a^(n+2)/(n+2)!) M_(n+2) + ... .
 *   Peeling the leading term leaves the strictly-positive residual tail
 *       R_n(a) - (a^n/n!) M_n = (a^(n+2)/(n+2)!) M_(n+2) [1 + O(a^2)],
 *   so the RELATIVE residual is
 *       r_n(a) = [R_n(a) - (a^n/n!) M_n] / [(a^n/n!) M_n]
 *              = a^2 * (n! / (n+2)!) * (M_(n+2) / M_n) * [1 + O(a^2)]
 *              = C_n a^2 [1 + D_n a^2 + O(a^4)],
 *   with the CLOSED leading coefficient
 *       C_n = M_(n+2) / [ (n+1)(n+2) M_n ]      (since (n+2)!/n! = (n+1)(n+2))
 *   and the next-order coefficient (from dividing the two O(a^2) brackets)
 *       D_n = M_(n+4)/[(n+3)(n+4) M_(n+2)] - M_(n+2)/[(n+1)(n+2) M_n].
 *   The leading power of a in r_n(a) is therefore EXACTLY 2 -- the tail exponent
 *   p = 2 is derived, not fitted. For the two ladder rungs under test:
 *       C_3 = M_5 / (20 M_3)   (odd sinh, (4)(5) = 20; matches imp-3553 a^2/20)
 *       C_4 = M_6 / (30 M_4)   (even cosh, (5)(6) = 30; matches imp-3526 a^2/30).
 *
 *   WHY THE FIT READS 1.99999, NOT 2 (the O(a^2) bias, closed)
 *   ---------------------------------------------------------
 *   Taking logs, ln r_n(a) = ln C_n + 2 ln a + ln(1 + D_n a^2 + ...) with
 *   ln(1 + D_n a^2) ~ D_n a^2. A least-squares slope of ln r_n vs ln a over a
 *   geometric ladder {a_i} therefore reads not 2 but
 *       p_fit = 2 + D_n * cov(a^2, ln a) / var(ln a),
 *   the covariance/variance taken over the ladder. The |p_fit - 2| deviation is a
 *   pure artifact of the D_n a^2 curvature (largest at the top rung), NOT exponent
 *   drift. MEASURED here (self-computing): the predicted p_fit reproduces the ACTUAL
 *   least-squares slope to ~1e-9 on both ladders --
 *     odd  R_3 nine-rung  : fitted 1.99998842, predicted 1.99998843, |p-2| ~ 1.16e-5
 *     even R_4 six-rung   : fitted 1.99998204, predicted 1.99998205, |p-2| ~ 1.80e-5
 *   confirming the imp-3553 1.99999 and the imp-3502 exponents ARE the derived 2 up
 *   to a coefficient-quantified bias. The leading coefficient itself is confirmed by
 *   r_n(a)/a^2 -> C_n: the deepest clean rung matches C_n to relative 1.5e-9 (n=3)
 *   and 7.4e-8 (n=4).
 *
 *   |p_fit - 2| AS A FUNCTION OF THE DEEPEST CLEAN RUNG
 *   --------------------------------------------------
 *   Because the bias scales with the top-rung a^2 curvature relative to the ladder
 *   lever arm, extending the ladder DEEPER (smaller deepest a) shrinks |p_fit - 2|
 *   monotonically toward 0. MEASURED for the odd R_3 (cancellation-free, no floor):
 *     depth (rungs) : 3        6        9        12       15       18
 *     deepest a     : 1.25e-1  1.56e-2  1.95e-3  2.44e-4  3.05e-5  3.82e-6
 *     |p_fit - 2|   : 6.66e-5  2.35e-5  1.16e-5  6.84e-6  4.51e-6  3.19e-6
 *   The imp-3553 nine-rung value 1.16e-5 sits exactly on this curve; its deepest
 *   rung a = 2^-9 is set by the odd cancellation floor a0*M_1*eps ~ 5e-21 (imp-3553),
 *   so 1.16e-5 is the best |p_fit - 2| attainable within that floor's clean budget.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / DERIVATION ONLY, at the RH-equivalent scale class. This derives
 *   and certifies the decay ORDER of a fixed-weight Taylor remainder; it establishes
 *   NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT and the
 *   degree-2 face carries no feasibility comparison (imp-3469: D_2 = 0). The
 *   operator-level K_a >= 0 sign-positivity (off-diagonal endpoint-Hankel step,
 *   imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2
 *   remains the rigorous SOTA.
 *
 *   @see imp-3553-remainder-tail-cancellation-free-r3.js (the odd fit p=1.99999)
 *   @see imp-3526-remainder-tail-cancellation-free-r4.js (the even fit p=1.99998)
 *   @see imp-3502-remainder-tail-exponent-fit.js (the original ~2 fits)
 *   @see imp-3501-moment-ladder-general-derivation.js (R_n = sum a^m/m! M_m)
 *
 *   Ticket: imp-3581 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation
const EPS = Number.EPSILON;                     // 2.220446049250313e-16

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

// Precompute A on the SAME fixed fine Simpson grid over [0, T_A] as imp-3553/imp-3526.
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
const MMAX = 16;                                // top moment order used (even R_4 needs M_16)
const MOMENTS = {};                             // MOMENTS[m] = int tau^m A(tau) d(tau)
for (let m = 0; m <= MMAX; m += 1) MOMENTS[m] = aWeightedMass((tau) => Math.pow(tau, m));

// -- CLOSED-FORM leading/next-order relative-residual coefficients (the derivation) -
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

// -- The two ladder cases under test ------------------------------------------------
// Odd degree-3 sinh remainder on the imp-3553 nine-rung ladder; even degree-4 cosh on
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

const ODD_CASE = analyseCase(3, ODD_LADDER, 15);    // sinh R_3, matches imp-3553
const EVEN_CASE = analyseCase(4, EVEN_LADDER, 16);  // cosh R_4, matches imp-3526

// -- |p_fit - 2| shrinks toward 0 as the ladder deepens (odd R_3, no floor) ---------
function depthLadder(depth) {
  const lad = [];
  for (let k = 0; k < depth; k += 1) lad.push(0.5 / Math.pow(2, k));
  return lad;
}
const DEPTH_SWEEP = Object.freeze([3, 6, 9, 12, 15, 18].map((depth) => {
  const lad = depthLadder(depth);
  const rel = lad.map((a) => relativeResidual(3, a, 15));
  return Object.freeze({
    depth,
    aDeep: lad[lad.length - 1],
    exponentDev: Math.abs(logLogFit(lad, rel).slope - DERIVED_EXPONENT),
  });
}));
// Monotone shrink: each deeper ladder has a strictly smaller |p_fit - 2|.
const depthDevMonotoneDecreasing = DEPTH_SWEEP.every(
  (d, i) => i === 0 || d.exponentDev < DEPTH_SWEEP[i - 1].exponentDev,
);
// The imp-3553 nine-rung value sits on this curve (depth 9 -> the imp-3553 |p-2|).
const NINE_RUNG_DEV = DEPTH_SWEEP.find((d) => d.depth === 9).exponentDev;   // ~1.16e-5

// -- Classification -----------------------------------------------------------------
const SLOPE_MODEL_TOL = 1e-7;     // predicted p_fit reproduces the actual slope this closely
const LEADING_TOL = 1e-6;         // r_n(a_deep)/a_deep^2 matches C_n this closely
const BIAS_TOL = 5e-5;            // both fitted |p-2| below this, fully O(a^2)-explained

const oddDerivationCertified =
  ODD_CASE.slopeModelErr < SLOPE_MODEL_TOL &&
  ODD_CASE.leadingCoeffDeepRelErr < LEADING_TOL &&
  ODD_CASE.fittedExponentDev < BIAS_TOL;
const evenDerivationCertified =
  EVEN_CASE.slopeModelErr < SLOPE_MODEL_TOL &&
  EVEN_CASE.leadingCoeffDeepRelErr < LEADING_TOL &&
  EVEN_CASE.fittedExponentDev < BIAS_TOL;

const verdict =
  oddDerivationCertified && evenDerivationCertified && depthDevMonotoneDecreasing
    ? 'TAIL-EXPONENT-p=2-DERIVED-CLOSED-FORM-C_n=M_(n+2)/((n+1)(n+2)M_n)-AND-imp-3553-FITTED-1.99999-CERTIFIED-EQUAL-2-UP-TO-QUANTIFIED-O(a^2)-BIAS'
    : 'INDETERMINATE';

export const IMP3581_REMAINDER_TAIL_EXPONENT_DERIVATION = Object.freeze({
  id: 'imp-3581-remainder-tail-exponent-derivation',
  ticket: 'imp-3581',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedOddFit: 'imp-3553-remainder-tail-cancellation-free-r3.js',
  relatedEvenFit: 'imp-3526-remainder-tail-cancellation-free-r4.js',
  relatedOriginalFit: 'imp-3502-remainder-tail-exponent-fit.js',
  relatedMomentIdentity: 'imp-3501-moment-ladder-general-derivation.js',

  summary:
    'DERIVES the moment-remainder tail exponent p=2 in closed form for both the odd sinh R_3 and the even cosh R_4, ' +
    'and certifies the imp-3553 fitted p=1.99999 (and the imp-3502 fits) equal the derived 2 up to a fully-quantified ' +
    'O(a^2) log-log fit bias. From R_n(a)=sum_{m>=n,step2} a^m/m! M_m the relative residual is ' +
    'r_n(a)=[R_n-(a^n/n!)M_n]/[(a^n/n!)M_n]=C_n a^2[1+D_n a^2+O(a^4)] with the CLOSED leading coefficient ' +
    'C_n=M_(n+2)/((n+1)(n+2)M_n) (C_3=M_5/(20 M_3)~1.4573e-3, C_4=M_6/(30 M_4)~1.2329e-3), so the leading power of a ' +
    'is EXACTLY 2 -- the exponent is derived, not fitted. The next-order coefficient ' +
    'D_n=M_(n+4)/((n+3)(n+4)M_(n+2))-M_(n+2)/((n+1)(n+2)M_n) (D_3~-3.94e-4, D_4~-3.01e-4) gives the least-squares ' +
    'bias p_fit=2+D_n cov(a^2,ln a)/var(ln a); MEASURED, this predicted slope reproduces the ACTUAL fit to ~1e-9 ' +
    '(odd: fitted 1.99998842 vs predicted 1.99998843, |p-2|~1.16e-5; even: 1.99998204 vs 1.99998205, |p-2|~1.80e-5), ' +
    'so the imp-3553 1.99999 IS the derived 2 up to a coefficient-quantified curvature bias, not exponent drift. The ' +
    'leading coefficient is confirmed by r_n(a)/a^2->C_n (deepest rung matches to 1.5e-9 for n=3, 7.4e-8 for n=4), ' +
    'and |p_fit-2| shrinks monotonically as the ladder deepens (6.66e-5 at 3 rungs -> 1.16e-5 at the imp-3553 nine ' +
    'rungs -> 3.19e-6 at 18 rungs), the nine-rung floor set by the odd cancellation limit a0*M_1*eps~5e-21. ' +
    'MEASUREMENT/DERIVATION, RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity (imp-3066) untouched; ' +
    'no RH verdict, no QED.',

  derivation: Object.freeze({
    momentSeries: 'R_n(a) = sum_{m = n, n+2, ...} a^m/m! M_m,  M_m = int_0^{T_A} tau^m A(tau) d(tau) (imp-3501)',
    residualTail: 'R_n(a) - (a^n/n!)M_n = (a^(n+2)/(n+2)!)M_(n+2)[1 + O(a^2)], a strictly-positive sum',
    relativeResidual: 'r_n(a) = C_n a^2 [1 + D_n a^2 + O(a^4)], leading power of a EXACTLY 2',
    leadingCoeffClosed: 'C_n = M_(n+2)/((n+1)(n+2)M_n)  [since (n+2)!/n! = (n+1)(n+2)]',
    nextOrderCoeffClosed: 'D_n = M_(n+4)/((n+3)(n+4)M_(n+2)) - M_(n+2)/((n+1)(n+2)M_n)',
    fitBiasClosed: 'p_fit = 2 + D_n * cov(a^2, ln a)/var(ln a) over the geometric a-ladder',
    oddCoeff: 'C_3 = M_5/(20 M_3) (matches the imp-3553 a^2/20 M_5/M_3)',
    evenCoeff: 'C_4 = M_6/(30 M_4) (matches the imp-3526 a^2/30 M_6/M_4)',
    quadrature: 'composite Simpson: A(tau) inner (n=1200 on [0,7]), moments on the NM=1600 [0,T_A] grid',
    selfComputing: true,
  }),

  measured: Object.freeze({
    derivedExponent: DERIVED_EXPONENT,               // 2, exact
    oddCase: ODD_CASE,       // {leadingCoeff C_3, nextOrderCoeff D_3, fitted/predicted exponent, ratios, ...}
    evenCase: EVEN_CASE,     // {leadingCoeff C_4, nextOrderCoeff D_4, fitted/predicted exponent, ratios, ...}
    depthSweep: DEPTH_SWEEP, // [{depth, aDeep, exponentDev}] -> |p_fit-2| shrinks toward 0 as ladder deepens
    nineRungExponentDev: NINE_RUNG_DEV,              // ~1.16e-5, the imp-3553 value on the depth curve
    depthDevMonotoneDecreasing,
    oddDerivationCertified,
    evenDerivationCertified,
    verdict,
  }),

  interpretation: Object.freeze({
    exponentIsExactlyTwo:
      'The relative residual r_n(a) = C_n a^2[1 + O(a^2)] has leading power of a EXACTLY 2; the tail exponent p=2 ' +
      'is a closed consequence of the same-parity moment series, not an empirical fit.',
    fittedShortfallExplained:
      'The fitted 1.99999 (odd) / 1.99998 (even) fall ~1.2e-5 / 1.8e-5 short of 2 purely because the log-log slope ' +
      'absorbs the D_n a^2 curvature: the closed p_fit = 2 + D_n cov(a^2,ln a)/var(ln a) reproduces the actual ' +
      'least-squares slope to ~1e-9, so there is no residual exponent drift -- the exponent IS 2.',
    leadingCoeffConfirmed:
      'r_n(a)/a^2 converges to the derived C_n: the deepest clean rung matches C_n to relative 1.5e-9 (n=3) and ' +
      '7.4e-8 (n=4), independently confirming the closed leading coefficient M_(n+2)/((n+1)(n+2)M_n).',
    depthFloor:
      'Deepening the ladder shrinks |p_fit-2| monotonically (6.66e-5 -> 1.16e-5 at nine rungs -> 3.19e-6 at 18 ' +
      'rungs); the imp-3553 nine-rung value 1.16e-5 is the best attainable within the odd cancellation floor ' +
      'a0*M_1*eps~5e-21 (below which subtractive rungs sink into noise, imp-3553).',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Derives the closed decay ORDER (p=2) and leading coefficient of a fixed-weight Taylor remainder and certifies ' +
      'the fitted values equal it. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT, and the degree-2 face carries no feasibility comparison at ' +
      'all (imp-3469: D_2 = 0). The operator-level K_a >= 0 sign-positivity (off-diagonal endpoint-Hankel step, ' +
      'imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------------
export const IMP3581_REMAINDER_TAIL_EXPONENT_DERIVATION_ASSERTIONS = [
  {
    id: 'imp3581-odd-slope-model-reproduces-fit',
    why: 'THE KEY CERTIFICATION (odd R_3): the closed p_fit = 2 + D_3 cov(a^2,ln a)/var(ln a) reproduces the ACTUAL ' +
         'nine-rung least-squares slope to < 1e-7 (measured ~1e-9), so the |p-2|~1.2e-5 shortfall is the derived ' +
         'O(a^2) bias, not exponent drift.',
    holds: () => ODD_CASE.slopeModelErr < SLOPE_MODEL_TOL,
  },
  {
    id: 'imp3581-even-slope-model-reproduces-fit',
    why: 'Same certification for the even R_4 six-rung fit: predicted p_fit reproduces the actual slope to < 1e-7.',
    holds: () => EVEN_CASE.slopeModelErr < SLOPE_MODEL_TOL,
  },
  {
    id: 'imp3581-odd-leading-coeff-matches-C3',
    why: 'The derived leading coefficient C_3 = M_5/(20 M_3) is confirmed by r_3(a)/a^2 -> C_3: the deepest clean ' +
         'rung matches C_3 to relative < 1e-6 (measured ~1.5e-9).',
    holds: () => ODD_CASE.leadingCoeffDeepRelErr < LEADING_TOL,
  },
  {
    id: 'imp3581-even-leading-coeff-matches-C4',
    why: 'The derived leading coefficient C_4 = M_6/(30 M_4) is confirmed by r_4(a)/a^2 -> C_4: the deepest clean ' +
         'rung matches C_4 to relative < 1e-6 (measured ~7.4e-8).',
    holds: () => EVEN_CASE.leadingCoeffDeepRelErr < LEADING_TOL,
  },
  {
    id: 'imp3581-both-fitted-exponents-within-bias-of-two',
    why: 'Both fitted exponents equal the derived 2 up to the quantified O(a^2) bias: |p_fit-2| < 5e-5 (odd ~1.16e-5, ' +
         'even ~1.80e-5), matching the imp-3553 1.99999 and imp-3502 fits.',
    holds: () => ODD_CASE.fittedExponentDev < BIAS_TOL && EVEN_CASE.fittedExponentDev < BIAS_TOL,
  },
  {
    id: 'imp3581-closed-coeff-equals-parity-form',
    why: 'The general closed C_n = M_(n+2)/((n+1)(n+2)M_n) must reduce to the imp-3553/imp-3526 parity forms: ' +
         'C_3 = M_5/(20 M_3) and C_4 = M_6/(30 M_4) (denominators (4)(5)=20, (5)(6)=30).',
    holds: () => {
      const c3 = leadingCoeff(3);
      const c4 = leadingCoeff(4);
      return (
        Math.abs(c3 - MOMENTS[5] / (20 * MOMENTS[3])) / c3 < 1e-12 &&
        Math.abs(c4 - MOMENTS[6] / (30 * MOMENTS[4])) / c4 < 1e-12
      );
    },
  },
  {
    id: 'imp3581-fit-bias-shrinks-with-deeper-ladder',
    why: '|p_fit-2| must shrink monotonically as the ladder deepens (6.66e-5 at 3 rungs -> 1.16e-5 at nine -> ' +
         '3.19e-6 at 18), confirming p -> 2 as the deepest clean rung -> 0.',
    holds: () => depthDevMonotoneDecreasing,
  },
  {
    id: 'imp3581-nine-rung-dev-matches-imp3553',
    why: 'The depth-9 point of the sweep must reproduce the imp-3553 nine-rung |p-2| (~1.2e-5), tying the derivation ' +
         'to the fitted value it explains.',
    holds: () => Math.abs(NINE_RUNG_DEV - 1.16e-5) < 2e-6,
  },
  {
    id: 'imp3581-verdict-certifies-derivation',
    why: 'The classified verdict must certify the closed p=2 derivation and the fitted-equals-derived result, not ' +
         'indeterminate.',
    holds: () =>
      verdict ===
      'TAIL-EXPONENT-p=2-DERIVED-CLOSED-FORM-C_n=M_(n+2)/((n+1)(n+2)M_n)-AND-imp-3553-FITTED-1.99999-CERTIFIED-EQUAL-2-UP-TO-QUANTIFIED-O(a^2)-BIAS',
  },
  {
    id: 'imp3581-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: derivation/measurement only, mass-feasibility necessary-but-not-sufficient, operator ' +
         'positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3581_REMAINDER_TAIL_EXPONENT_DERIVATION.honestCaveat;
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

for (const assertion of IMP3581_REMAINDER_TAIL_EXPONENT_DERIVATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3581-remainder-tail-exponent-derivation assertion failed: ${assertion.id}`);
  }
}

export default IMP3581_REMAINDER_TAIL_EXPONENT_DERIVATION;
