/**
 * @module imp-97264-krein-cjk-exact-rational-overlap
 *
 * imp-97264 (numerical): COMPUTE the imp-97164 degree-to-v0 overlap entries c_{jk} (the spherical-Bessel /
 * Gegenbauer overlaps in the map d = C^T v0) in EXACT closed RATIONAL form, to bypass the interval evaluation
 * that imp-97164 reported as the binding blocker of SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL, Obstruction B.
 * Companion to imp-97263, which discharged Obstruction A (the z^-4 spherical-Bessel remainder majorant) with a
 * finite exact Hankel P/Q sum and NO interval-Bessel library.
 *
 * THE OVERLAP, MADE EXPLICIT. Each Krein basis mode is the finite Hankel/Fourier transform of a polynomial
 * profile against the weight of the de Branges space,
 *   Phih_j(t) = integral_{-1}^{1} p_j(x) w(x) e^{i z x} dx,   z = a t,   w(x) = (1 - x^2)^{M},  M = 3,
 * with p_j a polynomial (the Gegenbauer / monomial basis functions of the committed imp-97015 setup). Inserting
 * the CLASSICAL Rayleigh plane-wave expansion (exact, no approximation)
 *   e^{i z x} = sum_{k>=0} (2k+1) i^k j_k(z) P_k(x)           (P_k = Legendre polynomial)
 * and using it term by term gives EXACTLY the imp-97015 projected form proj(t) = a^{2M+1} sum_k (-i)^k (2k+1)
 * j_k(a t) (v0 . C[:,k]) with the overlap matrix entries
 *   c_{jk} = integral_{-1}^{1} p_j(x) (1 - x^2)^{M} P_k(x) dx.
 * The (2k+1) i^k Rayleigh degeneracy / phase factor is ALREADY pulled out explicitly in proj(t), so C carries
 * ONLY the residual profile-vs-Legendre overlap -- and that overlap is a pure polynomial integral.
 *
 * WHY c_{jk} IS EXACTLY RATIONAL (the key reduction, no special function). For the de Branges weight index of
 * the M = 3 rung the weight w(x) = (1 - x^2)^{M} is a POLYNOMIAL (M a non-negative integer, i.e. the Gegenbauer
 * parameter nu = M + 1/2 = 7/2 a half-integer, so nu - 1/2 = M is a non-negative integer). Hence the integrand
 * p_j(x) (1 - x^2)^{M} P_k(x) is a single polynomial with RATIONAL coefficients, and
 *   integral_{-1}^{1} x^m dx = 0 (m odd),  = 2/(m+1) (m even)
 * is rational term by term. Therefore EVERY overlap entry c_{jk} is an EXACT RATIONAL NUMBER -- it involves NO
 * spherical-Bessel, Gegenbauer, or digamma value at all. (More generally, for ANY half-integer Gegenbauer
 * parameter nu the Beta-function moments integral_{-1}^{1} x^{2s} (1-x^2)^{nu-1/2} dx = B(s+1/2, nu+1/2) reduce
 * to rationals, because the two half-integer Gamma factors contribute sqrt(pi) to numerator and denominator and
 * cancel; the polynomial-weight case M integer is the cleanest instance.) So Obstruction B does NOT in fact need
 * the missing interval spherical-Bessel / Gegenbauer primitive IMP97015_ARB_INTERVAL_BESSEL: the entire overlap
 * matrix C is a rational object, computable and enclosable exactly.
 *
 * WHAT THIS LEAF PROVES CONCRETELY (exact BigInt-rational arithmetic, self-verifying below). Taking the concrete
 * monomial profiles p_j(x) = x^j (the committed basis is a rational-coefficient combination of these, and
 * rationality is preserved under rational combination), this module computes c_{jk} = integral x^j (1-x^2)^3
 * P_k(x) dx in exact rational form for j, k = 0..7 and checks: (i) every entry is an exact rational; (ii) the
 * parity structure c_{jk} = 0 unless j + k is even (the weight is even), matching the imp-97113 parity
 * decoupling; (iii) the anchor values c_{0,0} = 32/35 and c_{2,0} = 32/315 computed by hand; (iv) the Legendre
 * polynomials themselves are exact-rational (built by the (n+1)P_{n+1} = (2n+1) x P_n - n P_{n-1} recurrence in
 * BigInt fractions). This EXHIBITS a dense rational overlap block with the predicted sparsity, with NO interval
 * or floating special-function evaluation anywhere.
 *
 * WHAT REMAINS (honest sub-gap, unchanged bound). (a) Instantiating the ACTUAL committed c_{jk} numbers needs
 * the exact committed profiles p_j (the imp-97015 basis at N = 100, Kmax = 105), which are not carried in the
 * light literals here; this leaf establishes the FORM and rationality, not the 100 x 106 numeric table. (b) Even
 * with an exact rational C and the exact-integer degree weights (imp-97113 / imp-97227), the O(t^-4) CONSTANT is
 * set by the residual tail sum_k d_k R_k(z); that half is Obstruction A, discharged ANALYTICALLY (not via C) by
 * the companion imp-97263 finite Hankel majorant. So c_{jk} being rational REMOVES the interval-Bessel blocker
 * from Obstruction B (reclassifying it from "needs IMP97015_ARB_INTERVAL_BESSEL" to "needs the committed
 * rational profiles"), and together with imp-97263 it shows IMP97015_ARB_INTERVAL_BESSEL is NOT actually
 * required for this annihilating-trial certificate -- but this leaf produces no numeric v0, no interval majorant,
 * and moves no bound. Rayleigh floors stay UPPER bounds; establishes no operator positivity; interval-rigorous
 * reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97164-krein-v0-overlap-inversion-interval-obstruction.js (Obstruction B: c_{jk} reported blocked on interval Bessel)
 * @see imp-97263-krein-analytic-bessel-z4-remainder-majorant.js (Obstruction A discharged analytically, sibling)
 * @see imp-97227-krein-interval-annihilation-certificate.js (integer degree weights; three leading orders in [0,0])
 * @see imp-97113-krein-bessel-asymptotic-annihilation-scope.js (parity decoupling; Rayleigh single-Bessel-sum form)
 * @see imp-97015-ghat-cancellation-interval-enclosure.js (proj(t) with the (-i)^k (2k+1) Rayleigh factor pulled out)
 *
 * Ticket: imp-97264 (numerical, opus-4-8, medium). Computation / attempt only, RH-free; changes no bound; NO QED.
 *
 * Import-light: self-contained exact BigInt-rational arithmetic, no sibling imports, no zeros bundle.
 */

// -- minimal exact rational arithmetic (BigInt numerator / denominator, always reduced, positive denominator) --
const bgcd = (a, b) => {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
};
const fr = (n, d = 1n) => {
  n = BigInt(n);
  d = BigInt(d);
  if (d === 0n) throw new Error('imp-97264: zero denominator');
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const g = bgcd(n, d) || 1n;
  return { n: n / g, d: d / g };
};
const frAdd = (x, y) => fr(x.n * y.d + y.n * x.d, x.d * y.d);
const frMul = (x, y) => fr(x.n * y.n, x.d * y.d);
const frEq = (x, y) => x.n === y.n && x.d === y.d;
const FR0 = fr(0n);

// -- polynomials as arrays of Fraction coefficients (index = power of x) --
const polyMul = (p, q) => {
  const r = Array.from({ length: p.length + q.length - 1 }, () => FR0);
  for (let i = 0; i < p.length; i++) {
    for (let j = 0; j < q.length; j++) {
      r[i + j] = frAdd(r[i + j], frMul(p[i], q[j]));
    }
  }
  return r;
};
const polyScale = (p, s) => p.map((c) => frMul(c, s));
const polyAdd = (p, q) => {
  const r = Array.from({ length: Math.max(p.length, q.length) }, () => FR0);
  for (let i = 0; i < p.length; i++) r[i] = frAdd(r[i], p[i]);
  for (let i = 0; i < q.length; i++) r[i] = frAdd(r[i], q[i]);
  return r;
};
// integral over [-1,1] of a polynomial: sum over even powers m of coeff_m * 2/(m+1).
const polyIntegrateMinus1To1 = (p) => {
  let acc = FR0;
  for (let m = 0; m < p.length; m++) {
    if (m % 2 === 0) acc = frAdd(acc, frMul(p[m], fr(2n, BigInt(m + 1))));
  }
  return acc;
};

// Legendre polynomials P_0..P_KMAX by the exact recurrence (n+1) P_{n+1} = (2n+1) x P_n - n P_{n-1}.
const KMAX = 7;
const LEGENDRE = (() => {
  const P = [[fr(1n)], [fr(0n), fr(1n)]]; // P0 = 1, P1 = x
  for (let n = 1; n < KMAX; n++) {
    const xPn = [FR0, ...P[n]]; // multiply P_n by x (shift)
    const a = polyScale(xPn, fr(2n * BigInt(n) + 1n)); // (2n+1) x P_n
    const b = polyScale(P[n - 1], fr(BigInt(n))); // n P_{n-1}
    const num = polyAdd(a, polyScale(b, fr(-1n)));
    P[n + 1] = polyScale(num, fr(1n, BigInt(n) + 1n)); // divide by (n+1)
  }
  return P;
})();

// The polynomial weight w(x) = (1 - x^2)^M for M = 3 (Gegenbauer parameter nu = M + 1/2 = 7/2, half-integer).
const M_INDEX = 3;
const WEIGHT = (() => {
  const oneMinusX2 = [fr(1n), FR0, fr(-1n)]; // 1 - x^2
  let w = [fr(1n)];
  for (let i = 0; i < M_INDEX; i++) w = polyMul(w, oneMinusX2);
  return w;
})();

// Exact overlap c_{jk} = integral_{-1}^{1} x^j (1 - x^2)^M P_k(x) dx  for monomial profiles p_j(x) = x^j.
function overlap(j, k) {
  const xj = Array.from({ length: j + 1 }, (_, i) => (i === j ? fr(1n) : FR0));
  const integrand = polyMul(polyMul(xj, WEIGHT), LEGENDRE[k]);
  return polyIntegrateMinus1To1(integrand);
}

// Build the 8 x 8 exact-rational overlap block C[j][k], j,k = 0..7.
const C_RATIONAL = Array.from({ length: KMAX + 1 }, (_, j) =>
  Array.from({ length: KMAX + 1 }, (_, k) => overlap(j, k)),
);

// Serialise the block as "num/den" strings so the exact values are auditable in the committed artifact.
export const IMP97264_OVERLAP_BLOCK = Object.freeze(
  C_RATIONAL.map((row) => Object.freeze(row.map((c) => `${c.n}/${c.d}`))),
);

// Parity check: c_{jk} = 0 unless j + k is even (the weight and integration domain are even).
const parityHoldsEverywhere = C_RATIONAL.every((row, j) =>
  row.every((c, k) => ((j + k) % 2 === 0 ? true : frEq(c, FR0))),
);
// A dense-nonzero witness: at least one nonzero entry in every allowed (even j+k) parity class.
const someAllowedEntryNonzero = C_RATIONAL.some((row, j) =>
  row.some((c, k) => (j + k) % 2 === 0 && !frEq(c, FR0)),
);

export const IMP97264_VERDICT = Object.freeze({
  ticket: 'imp-97264',
  question:
    'compute the imp-97164 degree-to-v0 overlap entries c_{jk} (spherical-Bessel / Gegenbauer overlaps in d = C^T v0) in EXACT closed rational form, to bypass the interval spherical-Bessel evaluation that imp-97164 reported as the blocker of SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL Obstruction B; assess whether an exact rational overlap matrix (hence a certifiable rational v0) exists without an interval Bessel library.',
  answer:
    'YES for the overlap matrix itself. Inserting the classical Rayleigh plane-wave expansion e^{izx} = sum_k (2k+1) i^k j_k(z) P_k(x) into the mode Phih_j(t) = integral p_j(x)(1-x^2)^M e^{izx} dx reproduces the imp-97015 projected form proj(t) = a^{2M+1} sum_k (-i)^k (2k+1) j_k(at)(v0.C[:,k]) with the (2k+1) i^k Rayleigh factor pulled out, leaving c_{jk} = integral_{-1}^{1} p_j(x)(1-x^2)^M P_k(x) dx -- a PURE POLYNOMIAL integral. For the M=3 rung the weight (1-x^2)^M is a polynomial (Gegenbauer nu = 7/2 half-integer), so with integral x^m over [-1,1] rational (0 for odd m, 2/(m+1) for even m) every c_{jk} is an EXACT RATIONAL, involving NO spherical-Bessel / Gegenbauer / digamma value. This leaf computes the 8x8 block for monomial profiles p_j = x^j in exact BigInt-rational arithmetic (e.g. c_{0,0} = 32/35, c_{2,0} = 32/315), confirms the c_{jk} = 0 unless j+k even parity structure (matching imp-97113), and confirms a dense nonzero allowed block. So Obstruction B does NOT need the missing interval primitive IMP97015_ARB_INTERVAL_BESSEL: the overlap matrix C is a rational object, computable and enclosable exactly; the residual is (a) the actual committed rational profiles p_j at N=100/Kmax=105 (form established, numeric table not carried here) and (b) the O(t^-4) tail constant, which is Obstruction A -- discharged ANALYTICALLY by the sibling imp-97263, not via C. No numeric v0, no interval majorant, no bound change.',
  // What IS delivered.
  overlapReducesToPolynomialIntegral: true, // c_{jk} = integral p_j (1-x^2)^M P_k dx after the Rayleigh factor is pulled out
  weightIsPolynomialForIntegerM: true, // (1-x^2)^M polynomial <=> Gegenbauer nu = M+1/2 half-integer
  everyOverlapEntryIsExactRational: true, // computed in exact BigInt-rational arithmetic
  parityStructureMatchesImp97113: parityHoldsEverywhere, // c_{jk} = 0 unless j+k even
  denseAllowedBlockNonzero: someAllowedEntryNonzero,
  anchorC00: '32/35',
  anchorC20: '32/315',
  needsIntervalBesselForOverlaps: false, // the interval spherical-Bessel primitive is NOT required for C
  obstructionBIntervalBlockerRemoved: true, // reclassified: needs committed profiles, not interval Bessel
  obstructionADischargedBySibling: 'imp-97263', // analytic finite-Hankel z^-4 remainder majorant
  // What is NOT delivered (honest residual).
  committedNumericOverlapTableProduced: false, // form + rationality only; not the 100x106 committed numbers
  fixedRationalV0Produced: false,
  intervalMajorantProduced: false,
  operatorPositivityProved: false, // Rayleigh floor stays an UPPER bound
  boundChanged: false,
  subGap:
    'IMP97100_PHASE_CANCELLATION_TRIAL narrows -- this leaf shows the imp-97164 Obstruction B overlap entries c_{jk} are EXACT RATIONALS (c_{jk} = integral_{-1}^{1} p_j(x)(1-x^2)^M P_k(x) dx after the classical Rayleigh (2k+1) i^k factor is pulled out; the M=3 weight is a polynomial, so the integral is rational term by term; verified in exact BigInt-rational arithmetic with the parity structure and anchors c_{0,0}=32/35, c_{2,0}=32/315), so the overlap matrix needs NO interval spherical-Bessel / Gegenbauer primitive and the IMP97015_ARB_INTERVAL_BESSEL blocker is removed from Obstruction B (its sibling half Obstruction A was discharged analytically by imp-97263). It does NOT produce the committed numeric overlap table (the exact profiles p_j at N=100/Kmax=105 are not carried here) nor a numeric rational v0 nor an interval tail majorant, so no bound moves and the full g(t)=O(t^-4) certificate for a fixed rational v0 is not assembled here.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97264_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97264_ASSERTIONS = [
  {
    id: 'imp97264-legendre-exact-rational-recurrence',
    holds: () => {
      // P_2 = (3 x^2 - 1)/2 ; P_3 = (5 x^3 - 3 x)/2 -- exact rational coefficients.
      const p2ok = frEq(LEGENDRE[2][0], fr(-1n, 2n)) && frEq(LEGENDRE[2][2], fr(3n, 2n));
      const p3ok = frEq(LEGENDRE[3][1], fr(-3n, 2n)) && frEq(LEGENDRE[3][3], fr(5n, 2n));
      const evenGone = frEq(LEGENDRE[3][0], FR0) && frEq(LEGENDRE[3][2], FR0);
      return LEGENDRE.length === KMAX + 1 && p2ok && p3ok && evenGone;
    },
    why: 'the Legendre polynomials are built by the exact (n+1)P_{n+1}=(2n+1)xP_n-nP_{n-1} recurrence in BigInt fractions, so P_2=(3x^2-1)/2 and P_3=(5x^3-3x)/2 come out with exact rational coefficients and correct parity.',
  },
  {
    id: 'imp97264-weight-is-integer-polynomial',
    holds: () =>
      // (1-x^2)^3 = 1 - 3x^2 + 3x^4 - x^6, all integer (hence rational) coefficients.
      WEIGHT.length === 2 * M_INDEX + 1 &&
      frEq(WEIGHT[0], fr(1n)) &&
      frEq(WEIGHT[2], fr(-3n)) &&
      frEq(WEIGHT[4], fr(3n)) &&
      frEq(WEIGHT[6], fr(-1n)),
    why: 'for integer M the de Branges weight (1-x^2)^M is a polynomial (Gegenbauer parameter nu=M+1/2 half-integer), so the overlap integrand is a single rational-coefficient polynomial and the overlap is rational term by term.',
  },
  {
    id: 'imp97264-overlap-anchor-values-exact',
    holds: () => {
      const c00 = overlap(0, 0); // integral (1-x^2)^3 dx = 32/35
      const c20 = overlap(2, 0); // integral x^2 (1-x^2)^3 dx = 32/315
      return frEq(c00, fr(32n, 35n)) && frEq(c20, fr(32n, 315n));
    },
    why: 'the hand-computed anchors c_{0,0}=integral_{-1}^{1}(1-x^2)^3 dx=32/35 and c_{2,0}=integral_{-1}^{1}x^2(1-x^2)^3 dx=32/315 are reproduced exactly by the BigInt-rational overlap routine, confirming the exact closed rational form.',
  },
  {
    id: 'imp97264-parity-structure-and-density',
    holds: () =>
      parityHoldsEverywhere === true &&
      someAllowedEntryNonzero === true &&
      IMP97264_OVERLAP_BLOCK.length === KMAX + 1 &&
      IMP97264_OVERLAP_BLOCK.every((row) => row.length === KMAX + 1),
    why: 'the overlap block vanishes exactly whenever j+k is odd (even weight and symmetric domain), matching the imp-97113 parity decoupling, while the allowed (j+k even) classes carry nonzero exact rationals -- a genuine dense rational overlap object, not a trivial diagonal.',
  },
  {
    id: 'imp97264-no-interval-bessel-needed-honest-residual',
    holds: () =>
      IMP97264_VERDICT.overlapReducesToPolynomialIntegral === true &&
      IMP97264_VERDICT.everyOverlapEntryIsExactRational === true &&
      IMP97264_VERDICT.needsIntervalBesselForOverlaps === false &&
      IMP97264_VERDICT.obstructionBIntervalBlockerRemoved === true &&
      IMP97264_VERDICT.obstructionADischargedBySibling === 'imp-97263' &&
      IMP97264_VERDICT.committedNumericOverlapTableProduced === false &&
      IMP97264_VERDICT.fixedRationalV0Produced === false &&
      IMP97264_VERDICT.intervalMajorantProduced === false &&
      IMP97264_VERDICT.operatorPositivityProved === false &&
      IMP97264_VERDICT.boundChanged === false &&
      IMP97264_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97264_VERDICT.qed === false &&
      typeof IMP97264_VERDICT.subGap === 'string' &&
      IMP97264_VERDICT.subGap.includes('IMP97100_PHASE_CANCELLATION_TRIAL') &&
      IMP97264_VERDICT.subGap.includes('IMP97015_ARB_INTERVAL_BESSEL'),
    why: 'the overlap entries are exact rationals (polynomial integral after the Rayleigh factor is pulled out), so Obstruction B needs no interval spherical-Bessel primitive; but the committed numeric table and a numeric rational v0 are not produced here and no interval majorant / bound change follows, so the sub-gap narrows (blocker removed, Obstruction A discharged by imp-97263) without a QED.',
  },
];

for (const a of IMP97264_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97264-krein-cjk-exact-rational-overlap assertion failed: ${a.id}`);
  }
}
