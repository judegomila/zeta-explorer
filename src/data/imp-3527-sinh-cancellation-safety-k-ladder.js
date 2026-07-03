/**
 * @module imp-3527-sinh-cancellation-safety-k-ladder
 * @fileoverview imp-3527 -- DERIVE and MEASURE the ODD-degree (degree-3) analogue
 *   of the imp-3509 cosh (degree-2) catastrophic-cancellation safety k-ladder:
 *   the near-cancelling sinh(a tau) - a tau term of the imp-3510 degree-3 bridge
 *   mass B_3, whose cancellation safety was never audited.
 *
 *   THE IMP-3510 DEGREE-3 MASS UNDER TEST
 *   -------------------------------------
 *   imp-3510 fixed the degree-3 bridge mass as the odd remainder
 *       B_3(a, U) = int_0^U (sinh(a tau) - a tau) A(tau) d(tau) = S(a) - a M_1,
 *   with leading form (a^3/6) M_3 (imp-3481 n = 3 rung) and O(a^2) tail from the
 *   next odd term (a^5/120) M_5. The integrand carries the near-cancelling
 *   difference sinh(a tau) - a tau ~ (a tau)^3/6, whose floating-point
 *   cancellation safety across the k-ladder was NEVER audited -- imp-3509 audited
 *   only the EVEN (cosh) degree-2 counterpart. This module supplies the missing
 *   ODD audit.
 *
 *   THE DERIVATION (closed form in k)
 *   ---------------------------------
 *   On rung k the worst small sinh argument is x_k = a*T_A = a0*T_A/k (T_A = 6 the
 *   A-support cap; larger k => smaller a => smaller x). Forming g = sinh(x) - x by
 *   fl(sinh(x)) - x with |fl(sinh(x)) - sinh(x)| <= eps*sinh(x) and x exact:
 *   because sinh(x) ~ x + x^3/6, the two operands are within a factor 2 for all
 *   x <= T_A*a0 <= 3 (Sterbenz => the subtraction itself is exact), so the whole
 *   absolute error is the sinh rounding eps*sinh(x). Hence the RELATIVE
 *   cancellation error obeys
 *       rhoRigorous(k) = eps*sinh(x_k)/(sinh(x_k) - x_k),
 *   and its small-x limit (sinh -> x in the numerator, sinh - x -> x^3/6) is the
 *   headline form rho(k) = eps*x_k/(sinh(x_k) - x_k). Since sinh(x) - x ~ x^3/6,
 *       rho(k)  ~  eps*x_k / (x_k^3/6)  =  6*eps/x_k^2  =  6*eps*k^2/(a0*T_A)^2
 *                                                              -- GROWS like k^2.
 *   (Three-fold the degree-2 leading coefficient 2*eps k^2/(a0 T_A)^2: the odd
 *   difference cancels one order deeper, x^3/6 vs x^2/2.) The competing O(a^2)
 *   tail is the relative gap of B_3 from its leading form (a^3/6)M_3
 *   (B_3 = (a^3/6)M_3 + (a^5/120)M_5 + O(a^7)):
 *       tail(k) = (a^5/120)M_5 / ((a^3/6)M_3) = (a^2/20)(M_5/M_3)
 *               = (a0^2/(20 k^2))(M_5/M_3)                     -- SHRINKS like 1/k^2.
 *   So the safety margin tail/rho ~ k^{-4} collapses. Setting rho(k) = tail(k)
 *   gives the closed-form crossover
 *       k* = [ a0^4 * T_A^2 * M_5 / (120 * eps * M_3) ]^{1/4}.
 *   Note k* scales like a0, but the crossover VALUE rho(k*) = tail(k*) is cell-
 *   independent (a0/k* is constant), ~2.32e-10.
 *
 *   MEASURED RESULT (ODD analogue of imp-3509; safe on EVERY tested rung)
 *   --------------------------------------------------------------------
 *   (M1) rho(k) grows MONOTONICALLY in k as the k^2 law predicts: from 5.29e-16
 *        (k = 2) to 8.54e-14 (k = 24) on cell S3, matching the closed form
 *        6*eps k^2/(a0*T_A)^2 to <1% at k = 24.
 *   (M2) tail(k) shrinks MONOTONICALLY in k like 1/k^2: from 9.11e-5 (k = 2) to
 *        6.33e-7 (k = 24) on S3, the imp-3510 leading-form error.
 *   (M3) rho STAYS ORDERS BELOW THE TAIL ON EVERY RUNG. The margin tail/rho runs
 *        from ~1.2e11 (k = 2) down to ~7.4e6 (k = 24) on S3 and ~5.4e10 -> ~3.0e6
 *        on S4 -- always at least SIX orders of magnitude. The empirically
 *        realized cancellation error (measured against the cancellation-free
 *        odd power series sum_{m>=1} x^{2m+1}/(2m+1)!) never exceeds the derived
 *        bound rhoRigorous on any rung.
 *   (M4) THE CROSSOVER IS ASTRONOMICALLY FAR OUT. k* = 1252.52 (S3) / 1002.02 (S4)
 *        -- roughly 40-50x beyond the largest tested rung k = 24 -- and at k* both
 *        rho and tail equal ~2.32e-10 (closed form verified). The cancellation
 *        error would only overtake the O(a^2) tail near k ~ 1000-1250, deep in a
 *        regime where a0/k ~ 4e-4 is itself unphysically tiny.
 *
 *   VERDICT: the ODD (degree-3) sinh(a tau) - a tau cancellation is provably safe
 *   across the whole imp-3510 ladder -- a closed k^{-4} margin law with the
 *   cancellation error orders below the O(a^2) tail through k = 24 and the
 *   crossover pushed out to k* ~ 1000-1250. The odd difference is 3x more
 *   cancellation-prone than the even cosh case (coefficient 6 vs 2) yet still
 *   thoroughly safe in range.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / CERTIFICATION ONLY, at the RH-equivalent scale class. This
 *   certifies the FLOATING-POINT cancellation-safety of the degree-3 integrand
 *   across k; it establishes NO operator positivity. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity
 *   (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict,
 *   no QED. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3509-cosh-cancellation-safety-k-ladder.js (the EVEN degree-2 audit this mirrors)
 *   @see imp-3510-degree3-miss-factor-closed-form.js (the degree-3 mass B_3 = int (sinh - a tau) A)
 *   @see imp-3481-... (the odd remainder R_3 leading form (a^3/6)M_3 and moments M_3, M_5)
 *
 *   Ticket: imp-3527 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation
const EPS = Number.EPSILON;                     // 2.220446049250313e-16, unit-of-least-precision

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

// Phi autocorrelation A(tau) = int_0^inf Phi(s) Phi(s + tau) ds (imp-3469).
function autocorr(tau) {
  return simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, 1200);
}

// Precompute A on a FIXED fine Simpson grid over [0, T_A] ONCE (imp-3469).
const T_A = 6;
const NM = 1600;                                // even -> composite Simpson on [0, T_A]
const H_A = T_A / NM;
const A_GRID = [];
for (let j = 0; j <= NM; j += 1) A_GRID.push(autocorr(j * H_A));

/** Autocorrelation moment M_n = int_0^{T_A} tau^n A(tau) d(tau) (imp-3481). */
function moment(n) {
  let sum = 0;
  for (let j = 0; j <= NM; j += 1) {
    const tau = j * H_A;
    const w = j === 0 || j === NM ? 1 : (j % 2 === 0 ? 2 : 4);
    sum += w * Math.pow(tau, n) * A_GRID[j];
  }
  return (sum * H_A) / 3;
}

// The two ODD moments governing the leading O(a^2) tail of B_3 (imp-3510/imp-3481).
const M3 = moment(3);                            // ~6.0287e-7
const M5 = moment(5);                            // ~1.7571e-8
const M5_OVER_M3 = M5 / M3;                      // ~0.029146

/** Cancellation-free reference for sinh(x) - x via the all-positive odd power
 * series sum_{m>=1} x^{2m+1}/(2m+1)! (no catastrophic subtraction). */
function sinhMinusRef(x) {
  let term = (x * x * x) / 6;                    // m = 1 term x^3/3!
  let sum = term;
  let denom = 3;
  for (let i = 0; i < 60; i += 1) {
    denom += 2;                                  // next odd factorial index
    term *= (x * x) / ((denom - 1) * denom);
    sum += term;
    if (term <= sum * 1e-18) break;
  }
  return sum;
}

/**
 * Cancellation-error bound and O(a^2) tail as closed functions of the ladder
 * index k for a base cell (a0, u0). x_k = a0*T_A/k is the worst small sinh
 * argument; rho(k) = eps*x_k/(sinh(x_k) - x_k) is the headline relative
 * cancellation error; rhoRigorous multiplies the numerator by sinh(x_k)/x_k (the
 * strict Sterbenz bound); tail(k) = (a^2/20)(M_5/M_3) is the leading-form gap.
 */
function cancellationLadder(a0, u0, kValues) {
  const rungs = kValues.map((k) => {
    const a = a0 / k;
    const xk = a * T_A;                           // worst sinh argument on this rung
    const sinhMinusX = Math.sinh(xk) - xk;        // formed by direct subtraction
    const rho = (EPS * xk) / sinhMinusX;          // headline form (numerator ~ x_k)
    const rhoRigorous = (EPS * Math.sinh(xk)) / sinhMinusX; // strict Sterbenz bound (>= rho)
    const rhoSmallX = (6 * EPS * k * k) / (a0 * T_A) / (a0 * T_A); // 6 eps k^2/(a0 T_A)^2
    const tail = ((a * a) / 20) * M5_OVER_M3;     // leading O(a^2) tail, ~1/k^2
    // Empirically realized cancellation error vs the cancellation-free reference
    // (the all-positive odd power series is accurate for small argument).
    const ref = sinhMinusRef(xk);
    const empiricalRelErr = ref > 0 ? Math.abs(sinhMinusX - ref) / ref : 0;
    return Object.freeze({
      k, a, xk, sinhMinusX,
      rho,                                        // grows like k^2
      rhoRigorous,                                // strict Sterbenz bound (>= rho)
      rhoSmallX,                                  // 6 eps k^2/(a0 T_A)^2 approximation
      tail,                                       // shrinks like 1/k^2
      marginTailOverRho: tail / rho,              // safety margin, shrinks like k^{-4}
      empiricalRelErr,                            // realized, must not exceed rhoRigorous
    });
  });
  // Closed-form crossover k* solving rho(k) = tail(k):
  //   6 eps k^2/(a0 T_A)^2 = (a0^2/20)(M_5/M_3)/k^2
  //   => k^4 = a0^4 T_A^2 M_5 / (120 eps M_3).
  const kStar = Math.pow((a0 ** 4 * T_A * T_A * M5) / (120 * EPS * M3), 0.25);
  const xStar = (a0 / kStar) * T_A;
  const rhoAtStar = (EPS * xStar) / (Math.sinh(xStar) - xStar);
  const tailAtStar = (((a0 / kStar) ** 2) / 20) * M5_OVER_M3;
  const rhoMonotoneUp = rungs.every((r, i) => i === 0 || r.rho > rungs[i - 1].rho);
  const tailMonotoneDown = rungs.every((r, i) => i === 0 || r.tail < rungs[i - 1].tail);
  const minMargin = Math.min(...rungs.map((r) => r.marginTailOverRho));
  const maxSmallXRelGap = Math.max(...rungs.map((r) => Math.abs(r.rho / r.rhoSmallX - 1)));
  const empiricalWithinBound = rungs.every((r) => r.empiricalRelErr <= r.rhoRigorous);
  return Object.freeze({
    a0, u0, rungs, kStar, rhoAtStar, tailAtStar,
    rhoMonotoneUp, tailMonotoneDown, minMargin, maxSmallXRelGap, empiricalWithinBound,
    crossoverVerified: Math.abs(rhoAtStar - tailAtStar) / tailAtStar < 1e-5,
  });
}

// -- The imp-3510 ladder: original {2,3,4,6,8} plus the wide {12,16,24} --------
const K_LADDER = Object.freeze([2, 3, 4, 6, 8, 12, 16, 24]);
const LADDER_S3 = cancellationLadder(0.5, 6, K_LADDER);   // base (0.5,6), s = 3
const LADDER_S4 = cancellationLadder(0.4, 10, K_LADDER);  // base (0.4,10), s = 4

// -- Classification -----------------------------------------------------------
const MARGIN_FLOOR = 1e6;       // cancellation error is >= 1e6x below the tail on every rung
const SMALLX_TOL = 1e-2;        // rho matches 6 eps k^2/(a0 T_A)^2 to <1% by k = 24
const KSTAR_FLOOR = 900;        // the crossover is pushed out beyond k = 900 (>> 24)

const safeOnEveryRung =
  LADDER_S3.minMargin > MARGIN_FLOOR && LADDER_S4.minMargin > MARGIN_FLOOR;
const rhoGrowsTailShrinks =
  LADDER_S3.rhoMonotoneUp && LADDER_S3.tailMonotoneDown &&
  LADDER_S4.rhoMonotoneUp && LADDER_S4.tailMonotoneDown;
const smallXLawHolds =
  LADDER_S3.rungs[LADDER_S3.rungs.length - 1].rho /
    LADDER_S3.rungs[LADDER_S3.rungs.length - 1].rhoSmallX - 1 < SMALLX_TOL;
const empiricalBounded =
  LADDER_S3.empiricalWithinBound && LADDER_S4.empiricalWithinBound;
const crossoverFarOut =
  LADDER_S3.kStar > KSTAR_FLOOR && LADDER_S4.kStar > KSTAR_FLOOR &&
  LADDER_S3.crossoverVerified && LADDER_S4.crossoverVerified;

const verdict =
  safeOnEveryRung && rhoGrowsTailShrinks && smallXLawHolds && empiricalBounded && crossoverFarOut
    ? 'SINH-CANCELLATION-SAFE-ACROSS-k-LADDER-rho~6eps-k^2-BELOW-O(a^2)-TAIL~1/k^2-CROSSOVER-k*~1000-1250-FAR-BEYOND-k=24'
    : 'INDETERMINATE';

export const IMP3527_SINH_CANCELLATION_SAFETY_K_LADDER = Object.freeze({
  id: 'imp-3527-sinh-cancellation-safety-k-ladder',
  ticket: 'imp-3527',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedEvenAudit: 'imp-3509-cosh-cancellation-safety-k-ladder.js',
  relatedDegree3Mass: 'imp-3510-degree3-miss-factor-closed-form.js',
  relatedMoments: 'imp-3481 odd remainder R_3 leading form (a^3/6)M_3',

  summary:
    'Derives and measures the ODD (degree-3) analogue of the imp-3509 cosh (degree-2) catastrophic-cancellation ' +
    'safety k-ladder: the near-cancelling sinh(a tau)-a tau term of the imp-3510 degree-3 bridge mass B_3, whose ' +
    'cancellation safety was never audited. On rung k the worst small argument is x_k=a0*T_A/k, so the relative ' +
    'cancellation error rho(k)=eps*x_k/(sinh(x_k)-x_k)~6 eps k^2/(a0 T_A)^2 GROWS like k^2 (3x the degree-2 ' +
    'coefficient, since sinh-x cancels one order deeper: x^3/6 vs x^2/2), while the competing leading O(a^2) tail ' +
    '(a^2/20)(M_5/M_3)~1/k^2 SHRINKS -- so the safety margin tail/rho collapses like k^{-4}. Setting rho(k)=tail(k) ' +
    'gives the closed-form crossover k*=[a0^4 T_A^2 M_5/(120 eps M_3)]^{1/4}. MEASURED on the imp-3510 ladder ' +
    '{2,3,4,6,8,12,16,24} from both cells (0.5,6),s=3 and (0.4,10),s=4: rho grows monotonically (5.29e-16 at k=2 to ' +
    '8.54e-14 at k=24 on S3, matching 6 eps k^2/(a0 T_A)^2 to <1%), the tail shrinks monotonically (9.11e-5 to ' +
    '6.33e-7), the margin stays at least SIX orders (1.2e11 to 7.4e6 on S3; 5.4e10 to 3.0e6 on S4), the ' +
    'empirically realized cancellation error (vs the cancellation-free odd power series) never exceeds the derived ' +
    'bound, and the crossover k*=1252.52 (S3)/1002.02 (S4) sits ~40-50x beyond k=24 with rho(k*)=tail(k*)~2.32e-10. ' +
    'Cancellation is provably safe through k=24 and orders below the tail. MEASUREMENT/CERTIFICATION, ' +
    'RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity (imp-3066) untouched; no RH verdict, no QED.',

  method: Object.freeze({
    integrand: 'B_3(a,U)=int_0^{T_A} (sinh(a tau)-a tau)A(tau)d(tau); the near-cancelling term is sinh(a tau)-a tau',
    worstArgument: 'x_k = a0*T_A/k (largest sinh argument on rung k; shrinks with k)',
    cancellationBound: 'rho(k)=eps*x_k/(sinh(x_k)-x_k) ~ 6 eps k^2/(a0 T_A)^2, grows like k^2',
    rigorousBound: 'rhoRigorous(k)=eps*sinh(x_k)/(sinh(x_k)-x_k) (strict Sterbenz subtraction bound, >= rho)',
    oa2Tail: 'tail(k)=(a^2/20)(M_5/M_3)=(a0^2/(20 k^2))(M_5/M_3), the imp-3510 leading-form gap, ~1/k^2',
    crossover: 'k* = [a0^4 T_A^2 M_5/(120 eps M_3)]^{1/4}, solving rho(k)=tail(k)',
    empiricalCheck: 'realized error vs the cancellation-free odd power series sum_{m>=1} x^{2m+1}/(2m+1)!',
    quadrature: 'A(tau) inner Simpson (n=1200 on [0,7]); moments on precomputed A grid (NM=1600 on [0,T_A])',
    kLadder: K_LADDER,
    tauCap: T_A,
    eps: EPS,
    m3: M3,
    m5: M5,
    m5OverM3: M5_OVER_M3,
    marginFloor: MARGIN_FLOOR,
    kStarFloor: KSTAR_FLOOR,
    selfComputing: true,
  }),

  measured: Object.freeze({
    ladderS3: LADDER_S3,                    // base (0.5,6), s=3
    ladderS4: LADDER_S4,                    // base (0.4,10), s=4
    m3: M3,                                 // ~6.0287e-7
    m5: M5,                                 // ~1.7571e-8
    m5OverM3: M5_OVER_M3,                   // ~0.029146
    minMargin: Math.min(LADDER_S3.minMargin, LADDER_S4.minMargin),   // ~3.0e6 (S4, k=24)
    kStarS3: LADDER_S3.kStar,               // ~1252.52
    kStarS4: LADDER_S4.kStar,               // ~1002.02
    rhoAtStarS3: LADDER_S3.rhoAtStar,       // ~2.32e-10 (== tailAtStar)
    safeOnEveryRung,
    rhoGrowsTailShrinks,
    smallXLawHolds,
    empiricalBounded,
    crossoverFarOut,
    verdict,
  }),

  interpretation: Object.freeze({
    closedFormMargin:
      'The ODD (degree-3) sinh(a tau)-a tau cancellation obeys a closed k^{-4} margin law: rho(k)=eps*(a0 T_A/k)' +
      '/(sinh(a0 T_A/k)-a0 T_A/k) grows like k^2 (6 eps k^2/(a0 T_A)^2 to leading order, 3x the even coefficient) ' +
      'while the O(a^2) tail (a0^2/(20 k^2))(M_5/M_3) shrinks like 1/k^2, so the safety margin tail/rho collapses ' +
      'like k^{-4} but stays at least six orders of magnitude across the whole tested ladder.',
    crossoverFarBeyond:
      'The two would cross only at k* = [a0^4 T_A^2 M_5/(120 eps M_3)]^{1/4} = 1252.52 (S3)/1002.02 (S4), roughly ' +
      '40-50x beyond the largest tested rung k=24. At k* both errors equal ~2.32e-10 (cell-independent since ' +
      'a0/k* is constant); there, a0/k ~ 4e-4 is itself unphysically tiny.',
    oddVsEven:
      'The odd difference is 3x more cancellation-prone than the even cosh case (leading coefficient 6 vs 2, since ' +
      'sinh-x ~ x^3/6 cancels one order deeper than cosh-1 ~ x^2/2), which pulls k* in from ~1400-1730 (imp-3509) ' +
      'to ~1000-1250, but the degree-3 integrand is still thoroughly cancellation-safe through the tested k=24, ' +
      'and the empirically realized error against the cancellation-free odd series never exceeds the derived bound.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    numericalCharacterizationOnly:
      'This module derives and measures the floating-point cancellation-safety of the degree-3 integrand ' +
      'sinh(a tau)-a tau as a closed function of the ladder index k. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3527_SINH_CANCELLATION_SAFETY_K_LADDER_ASSERTIONS = [
  {
    id: 'imp3527-cancellation-safe-on-every-rung',
    why: 'THE KEY FINDING: on every rung of the imp-3510 ladder (through k=24) the cancellation error rho must ' +
         'sit at least 1e6x below the O(a^2) tail on BOTH base cells -- the degree-3 sinh term is cancellation-safe.',
    holds: () => LADDER_S3.minMargin > MARGIN_FLOOR && LADDER_S4.minMargin > MARGIN_FLOOR,
  },
  {
    id: 'imp3527-rho-grows-tail-shrinks-in-k',
    why: 'The cancellation error rho(k) must be MONOTONE INCREASING in k (~k^2) and the O(a^2) tail MONOTONE ' +
         'DECREASING (~1/k^2) on both cells -- the safety margin narrows with k as derived (like k^{-4}).',
    holds: () =>
      LADDER_S3.rhoMonotoneUp && LADDER_S3.tailMonotoneDown &&
      LADDER_S4.rhoMonotoneUp && LADDER_S4.tailMonotoneDown,
  },
  {
    id: 'imp3527-rho-matches-small-x-k-squared-law',
    why: 'The closed form rho(k)~6 eps k^2/(a0 T_A)^2 must reproduce the exact eps*x_k/(sinh(x_k)-x_k) to <1% at ' +
         'the largest rung k=24 (where x_k is smallest) -- confirming the k^2 growth law, not a fitted trend.',
    holds: () => {
      const rS3 = LADDER_S3.rungs[LADDER_S3.rungs.length - 1];
      const rS4 = LADDER_S4.rungs[LADDER_S4.rungs.length - 1];
      return Math.abs(rS3.rho / rS3.rhoSmallX - 1) < SMALLX_TOL &&
        Math.abs(rS4.rho / rS4.rhoSmallX - 1) < SMALLX_TOL;
    },
  },
  {
    id: 'imp3527-empirical-error-within-derived-bound',
    why: 'The empirically realized cancellation error (Math.sinh(x)-x vs the cancellation-free odd power series) ' +
         'must NEVER exceed the strict derived bound rhoRigorous on any rung -- the bound is honest, not optimistic.',
    holds: () => LADDER_S3.empiricalWithinBound && LADDER_S4.empiricalWithinBound,
  },
  {
    id: 'imp3527-crossover-far-beyond-tested-ladder',
    why: 'The closed-form crossover k*=[a0^4 T_A^2 M_5/(120 eps M_3)]^{1/4} must exceed 900 (>> tested k=24) on ' +
         'both cells and be verified (rho(k*)=tail(k*) to <1e-5) -- the cancellation never overtakes the tail in range.',
    holds: () =>
      LADDER_S3.kStar > KSTAR_FLOOR && LADDER_S4.kStar > KSTAR_FLOOR &&
      LADDER_S3.crossoverVerified && LADDER_S4.crossoverVerified,
  },
  {
    id: 'imp3527-odd-coefficient-triples-even-case',
    why: 'The degree-3 headline coefficient (6) must be 3x the imp-3509 degree-2 coefficient (2): rho/rhoSmallX ~ 1 ' +
         'confirms rhoSmallX = 6 eps k^2/(a0 T_A)^2 is the right leading form, deeper cancellation than cosh-1.',
    holds: () => {
      const r24 = LADDER_S3.rungs.find((r) => r.k === 24);
      const expected = (6 * EPS * 24 * 24) / (0.5 * T_A) / (0.5 * T_A);
      return Math.abs(r24.rhoSmallX - expected) / expected < 1e-12 && Math.abs(r24.rho / r24.rhoSmallX - 1) < 1e-2;
    },
  },
  {
    id: 'imp3527-verdict-classifies-the-safety',
    why: 'The classified verdict must be the closed-form k-ladder cancellation-safety (rho~6eps k^2 below the ' +
         'O(a^2) tail~1/k^2, crossover far beyond k=24), not indeterminate.',
    holds: () => verdict.startsWith('SINH-CANCELLATION-SAFE-ACROSS-k-LADDER'),
  },
  {
    id: 'imp3527-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: floating-point cancellation-safety measurement only, mass-feasibility necessary-' +
         'but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3527_SINH_CANCELLATION_SAFETY_K_LADDER.honestCaveat;
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

for (const assertion of IMP3527_SINH_CANCELLATION_SAFETY_K_LADDER_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3527-sinh-cancellation-safety-k-ladder assertion failed: ${assertion.id}`);
  }
}

export default IMP3527_SINH_CANCELLATION_SAFETY_K_LADDER;
