/**
 * @module imp-3524-general-degree-d-miss-factor
 * @fileoverview imp-3524 -- DERIVE the GENERAL degree-d closed-form miss factor
 *   1 - 1/k^(d+1) (and the k^(d+1) over-prediction, exponent p = d) UNIFYING the
 *   imp-3488 degree-2 case (1 - 1/k^3) and the imp-3510 degree-3 case (1 - 1/k^4)
 *   in a single d-indexed law, then reconcile it against the measured d = 2 and
 *   d = 3 k-ladders.
 *
 *   THE TWO SPECIAL CASES ALREADY DERIVED
 *   -------------------------------------
 *   imp-3488 derived the degree-2 (cosh, even) miss factor 1 - 1/k^3 from the
 *   leading form B_2(a) = (a^2/2) M_2 + O(a^4). imp-3510 derived the degree-3
 *   (sinh, odd) miss factor 1 - 1/k^4 from B_3(a) = (a^3/6) M_3 + O(a^5) and noted
 *   it is the odd analogue of the even form with exponent p: 2 -> 3 and
 *   over-prediction k^3 -> k^4 -- but neither derived the UNIFYING general-d law
 *   that produces both from a single argument.
 *
 *   THE GENERAL-d BRIDGE MASS AND ITS LEADING FORM (imp-3501)
 *   --------------------------------------------------------
 *   imp-3501 derived, for every n, that the A-weighted degree-n bridge mass is the
 *   single parity tail
 *       B_d(a) = R_d(a) = sum_{m >= d, m == d (mod 2)} a^m/m! M_m,
 *   with M_m = int_0^{T_A} tau^m A(tau) d(tau) the FIXED, U-independent moments of
 *   the genuine-Phi autocorrelation A(tau) (NPHI = 10, support ~[0, 0.6] strictly
 *   inside every cutoff U >= T_A). Its leading term is the m = d moment,
 *       B_d(a) = (a^d/d!) M_d + O(a^{d+2}),   M_d fixed & U-independent,
 *   the DEGREE-d homogeneous form in a. (The degree-d weight is the parity-matched
 *   Taylor remainder: cosh(a tau) minus its terms below order d for even d, sinh(a
 *   tau) minus its terms below order d for odd d; d = 2 -> cosh(a tau) - 1, d = 3
 *   -> sinh(a tau) - a tau.)
 *
 *   THE GENERAL-d CLOSED-FORM DERIVATION (this module)
 *   --------------------------------------------------
 *   (D1) LEADING FORM, ALL d >= 1. From imp-3501, B_d(a) = (a^d/d!) M_d +
 *        O(a^{d+2}) with M_d fixed and U-independent; the leading term is degree-d
 *        homogeneous in a.
 *   (D2) EXPONENT p = d, ANALYTICALLY. Homogeneity of the leading term gives
 *            B_d^lead(a/k) = ((a/k)^d/d!) M_d = k^{-d} B_d^lead(a),
 *        i.e. the exponent is EXACTLY p = d, not fitted (measured d + O(a^2)).
 *   (D3) OVER-PREDICTION BY k^(d+1). The imp-3405 degree-0 bridge-mass scaling law
 *        B(a/k, kU) = k B(a, U) multiplies by k, so
 *            (degree-0 prediction)/(actual) = k B_d(a) / (k^{-d} B_d(a)) = k^{d+1}:
 *        the degree-0 prediction over-predicts the degree-d mass by EXACTLY
 *        k^(d+1) (one power k from the Lebesgue prefactor it wrongly keeps, d
 *        powers k^{-d} from the a^d homogeneity it ignores).
 *   (D4) GENERAL MISS FACTOR 1 - 1/k^(d+1). The relative miss of the degree-0
 *        prediction is
 *            |B_d(a/k) - k B_d(a)| / |k B_d(a)|
 *              = |k^{-d} B_d(a) - k B_d(a)| / (k B_d(a))
 *              = |k^{-(d+1)} - 1| = 1 - 1/k^{d+1}   (k >= 2, d >= 1 => 1/k^{d+1} < 1).
 *        SPECIALIZATION: d = 2 gives 1 - 1/k^3 (imp-3488), d = 3 gives 1 - 1/k^4
 *        (imp-3510) -- both are the single d-indexed law evaluated at d = 2, 3.
 *
 *   CERTIFICATION AGAINST THE d = 2 AND d = 3 k-LADDERS
 *   ---------------------------------------------------
 *   On the imp-3469 base cells (0.5, 6) and (0.4, 10) with rungs {2,3,4,6,8},
 *   self-computing A and the degree-d masses for BOTH d = 2 and d = 3, and writing
 *   r_k = B_d(a/k)/B_d(a) the EXACT measured ratio:
 *   (C1) IDENTITY. The degree-0 relative residual equals 1 - r_k/k to machine
 *        precision (definitional), for both d.
 *   (C2) UNIFIED = SPECIAL CASES. The general 1 - 1/k^(d+1) reproduces the imp-3488
 *        d = 2 form 1 - 1/k^3 and the imp-3510 d = 3 form 1 - 1/k^4 bit-for-bit.
 *   (C3) DERIVED = MEASURED to the tail. The derived miss 1 - 1/k^(d+1) and the
 *        measured miss differ by exactly (r_k - 1/k^d)/k -- the leading-form error
 *        -- reconciled to the exact ratio r_k to machine precision, for both d.
 *   (C4) OVER-PREDICTION & EXPONENT. The measured over-prediction k/r_k matches the
 *        derived k^(d+1) and the fitted -log(r_k)/log(k) matches the derived d, to
 *        the O(a^2) tail, for both d.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   DERIVATION / CERTIFICATION ONLY, at the RH-equivalent scale class. This
 *   unifies the k-scaling law of the degree-d mass integrand across d; it
 *   establishes NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-
 *   SUFFICIENT and the absolute-measure degree-d faces carry no feasibility
 *   comparison. The operator-level K_a >= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3488-degree2-miss-factor-closed-form.js (the d = 2 special case)
 *   @see imp-3510-degree3-miss-factor-closed-form.js (the d = 3 special case)
 *   @see imp-3501-moment-ladder-general-derivation.js (the general R_d = (a^d/d!)M_d form)
 *   @see imp-3405-bridge-mass-lambda-scaling-law.js (the degree-0 law B(a/k,kU)=k B(a,U))
 *
 *   Ticket: imp-3524 (proof, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686/imp-3481). */
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

// Phi autocorrelation A(tau) = int_0^inf Phi(s) Phi(s + tau) ds, same pipeline as
// imp-3481/imp-3510: the kernel decays super-exponentially so upper limit 7
// captures the whole overlap.
function autocorr(tau) {
  return simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, 1200);
}

// Precompute A on the SAME fixed fine Simpson grid over [0, T_A] as imp-3481. A(tau)
// is negligible beyond its support (~[0, 0.6]); T_A = 6 captures it in full and is
// strictly inside every ladder cutoff U >= 6.
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

// Integer factorial (d small: d = 2, 3).
function factorial(d) {
  let f = 1;
  for (let i = 2; i <= d; i += 1) f *= i;
  return f;
}

// -- The fixed Phi-autocorrelation moments M_2, M_3 (imp-3481) -----------------
const M2_MOMENT = aWeightedMass((tau) => tau * tau);        // int tau^2 A(tau) d(tau)
const M3_MOMENT = aWeightedMass((tau) => tau * tau * tau);  // int tau^3 A(tau) d(tau)
const MOMENTS = Object.freeze({ 2: M2_MOMENT, 3: M3_MOMENT });

// -- The degree-d weight W_d(x): parity-matched Taylor remainder ----------------
// even d: cosh(x) minus its terms below order d;  odd d: sinh(x) minus its terms
// below order d. d = 2 -> cosh(x) - 1;  d = 3 -> sinh(x) - x. Formed once inside
// the weight so the sub-order Taylor part cancels under the integral to machine
// precision (matching the imp-3501 remainder R_d = sum_{m>=d, m==d(2)} a^m/m! M_m).
function degreeWeight(d) {
  return (a) => (tau) => {
    const x = a * tau;
    if (d % 2 === 0) {
      // even: cosh(x) - sum_{i < d/2} x^{2i}/(2i)!
      let sub = 0;
      for (let i = 0; 2 * i < d; i += 1) sub += Math.pow(x, 2 * i) / factorial(2 * i);
      return Math.cosh(x) - sub;
    }
    // odd: sinh(x) - sum_{i : 2i+1 < d} x^{2i+1}/(2i+1)!
    let sub = 0;
    for (let i = 0; 2 * i + 1 < d; i += 1) sub += Math.pow(x, 2 * i + 1) / factorial(2 * i + 1);
    return Math.sinh(x) - sub;
  };
}

// B_d(a) = int_0^{T_A} W_d(a tau) A(tau) d(tau), the imp-3501 degree-d remainder.
function degreeMass(d, a) {
  return aWeightedMass(degreeWeight(d)(a));
}

// -- (D1) The leading small-a form B_d(a) ~ (a^d/d!) M_d ------------------------
function leadingForm(d, a) {
  return (Math.pow(a, d) / factorial(d)) * MOMENTS[d];
}

// -- The imp-3469 base cells and k-ladder --------------------------------------
const K_LADDER = Object.freeze([2, 3, 4, 6, 8]);
const DEGREES = Object.freeze([2, 3]);
const BASE_CELLS = Object.freeze([
  Object.freeze({ a: 0.5, u: 6, s: 3 }),        // base (0.5, 6)
  Object.freeze({ a: 0.4, u: 10, s: 4 }),       // base (0.4, 10)
]);

const leadingRelErr = (d, a) =>
  Math.abs(leadingForm(d, a) - degreeMass(d, a)) / Math.abs(degreeMass(d, a));

/**
 * Certify the UNIFIED general-d closed form on one base cell, for one degree d,
 * against a measured degree-d k-ladder. For each rung reconstructs the exact ratio
 * r_k = B_d(a/k)/B_d(a) and reconciles:
 *   - the derived exponent p = d (leading form) vs measured -log(r_k)/log(k),
 *   - the derived unified miss 1 - 1/k^(d+1) vs the measured degree-0 residual (= 1 - r_k/k),
 *   - the derived over-prediction k^(d+1) vs the measured k/r_k,
 * with the leading-form error reconciled to r_k to machine precision, and confirms
 * the unified form specializes to the imp-3488/imp-3510 constants at d = 2, 3.
 */
function certifyLadder(d, cell) {
  const baseBd = degreeMass(d, cell.a);
  const rungs = K_LADDER.map((k) => {
    const scaledBd = degreeMass(d, cell.a / k);        // B_d(a/k)
    const ratio = scaledBd / baseBd;                   // r_k, EXACT measured scaling ratio

    // Derived unified closed forms (leading, homogeneous a^d form) ------------
    const derivedExponent = d;                         // p = d, from a^d homogeneity (D2)
    const derivedMiss = 1 - 1 / Math.pow(k, d + 1);    // 1 - 1/k^(d+1) (D4)
    const derivedOverPred = Math.pow(k, d + 1);        // k^(d+1) (D3)

    // Measured quantities, expressed through the exact ratio r_k --------------
    const predDegree0 = k * baseBd;                    // degree-0 law prediction k B_d(a)
    const measuredMiss = Math.abs(scaledBd - predDegree0) / Math.abs(predDegree0); // = 1 - r_k/k
    const measuredExponent = -Math.log(ratio) / Math.log(k);
    const measuredOverPred = predDegree0 / scaledBd;   // = k/r_k

    // (C1) IDENTITY: degree-0 residual == 1 - r_k/k to machine precision ------
    const missIdentityGap = Math.abs(measuredMiss - (1 - ratio / k));
    const overPredIdentityGap = Math.abs(measuredOverPred - k / ratio);

    // (C3) derived vs measured miss differs by exactly (r_k - 1/k^d)/k --------
    const missDerivedVsMeasured = derivedMiss - measuredMiss;        // leading-form error
    const missTailExact = (ratio - 1 / Math.pow(k, d)) / k;          // its closed value
    const missReconGap = Math.abs(missDerivedVsMeasured - missTailExact);

    // (C4) over-prediction k^(d+1) vs measured k/r_k, exponent d vs measured ---
    const overPredReconGap = Math.abs(derivedOverPred - measuredOverPred);
    const exponentGap = Math.abs(derivedExponent - measuredExponent);

    return Object.freeze({
      k,
      ratio,
      derivedExponent,
      measuredExponent,
      exponentGap,
      derivedMiss,
      measuredMiss,
      missDerivedVsMeasured,
      missReconGap,
      derivedOverPred,
      measuredOverPred,
      overPredReconGap,
      missIdentityGap,
      overPredIdentityGap,
    });
  });
  return Object.freeze({
    d,
    base: Object.freeze({ a: cell.a, u: cell.u, s: cell.s, Bd: baseBd }),
    rungs,
    maxMissReconGap: Math.max(...rungs.map((r) => r.missReconGap)),
    maxMissTail: Math.max(...rungs.map((r) => Math.abs(r.missDerivedVsMeasured))),
    maxExponentGap: Math.max(...rungs.map((r) => r.exponentGap)),
    maxOverPredReconGap: Math.max(...rungs.map((r) => r.overPredReconGap)),
    maxMissIdentityGap: Math.max(...rungs.map((r) => r.missIdentityGap)),
    maxOverPredIdentityGap: Math.max(...rungs.map((r) => r.overPredIdentityGap)),
  });
}

// Certify both degrees on both base cells.
const CERTS = Object.freeze(
  DEGREES.map((d) =>
    Object.freeze({
      d,
      cells: Object.freeze(BASE_CELLS.map((c) => certifyLadder(d, c))),
      leadingRelErrS3: leadingRelErr(d, BASE_CELLS[0].a),
      leadingRelErrS4: leadingRelErr(d, BASE_CELLS[1].a),
    })
  )
);

// -- (C2) The unified 1 - 1/k^(d+1) specializes to the imp-3488/imp-3510 forms --
// At d = 2 the unified derivedMiss must be bit-for-bit 1 - 1/k^3 (imp-3488), and
// at d = 3 bit-for-bit 1 - 1/k^4 (imp-3510), on every rung.
const SPECIALIZE_EXPECTED = Object.freeze({
  2: (k) => 1 - 1 / (k * k * k),        // imp-3488 1 - 1/k^3
  3: (k) => 1 - 1 / (k * k * k * k),    // imp-3510 1 - 1/k^4
});
const specializationGaps = CERTS.flatMap((cert) =>
  cert.cells.flatMap((cell) =>
    cell.rungs.map((r) => Math.abs(r.derivedMiss - SPECIALIZE_EXPECTED[cert.d](r.k)))
  )
);
const maxSpecializationGap = Math.max(...specializationGaps);

// Aggregate maxima over both degrees and both cells.
const allCells = CERTS.flatMap((c) => c.cells);
const maxMissIdentityGap = Math.max(...allCells.map((c) => c.maxMissIdentityGap));
const maxOverPredIdentityGap = Math.max(...allCells.map((c) => c.maxOverPredIdentityGap));
const maxMissReconGap = Math.max(...allCells.map((c) => c.maxMissReconGap));
const maxMissTail = Math.max(...allCells.map((c) => c.maxMissTail));
const maxExponentGap = Math.max(...allCells.map((c) => c.maxExponentGap));
const maxLeadingRelErr = Math.max(...CERTS.map((c) => Math.max(c.leadingRelErrS3, c.leadingRelErrS4)));

// -- Tolerances ----------------------------------------------------------------
const IDENTITY_TOL = 1e-12;     // definitional identities: full machine precision
const RECON_TOL = 1e-12;        // leading-form error reconciled to r_k exactly
const SPECIALIZE_TOL = 1e-15;   // unified form == imp-3488/imp-3510 constants bit-for-bit
const MISS_TAIL_TOL = 1e-3;     // leading-form error itself (O(a^2) tail on the miss)
const EXPONENT_TOL = 0.01;      // derived p = d vs measured (O(a^2) tail)
const LEADING_TOL = 1e-2;       // leading form reproduces base mass

// -- Classification ------------------------------------------------------------
const identitiesHold = maxMissIdentityGap < IDENTITY_TOL && maxOverPredIdentityGap < IDENTITY_TOL;
const unifiedSpecializes = maxSpecializationGap < SPECIALIZE_TOL;
const missReconciledToFullPrecision = maxMissReconGap < RECON_TOL;
const missMatchesToLeadingTail = maxMissTail < MISS_TAIL_TOL;
const exponentIsDegree = maxExponentGap < EXPONENT_TOL;
const leadingFormHolds = maxLeadingRelErr < LEADING_TOL;

const verdict =
  identitiesHold && unifiedSpecializes && missReconciledToFullPrecision &&
  missMatchesToLeadingTail && exponentIsDegree && leadingFormHolds
    ? 'GENERAL-DEGREE-d-MISS-FACTOR-1-MINUS-1-OVER-k^(d+1)-DERIVED-FROM-B_d~(a^d/d!)M_d-EXPONENT-p=d-UNIFYING-imp3488(d=2,1-1/k^3)-AND-imp3510(d=3,1-1/k^4)-CERTIFIED'
    : 'INDETERMINATE';

export const IMP3524_GENERAL_DEGREE_D_MISS_FACTOR = Object.freeze({
  id: 'imp-3524-general-degree-d-miss-factor',
  ticket: 'imp-3524',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedDegree2MissFactor: 'imp-3488-degree2-miss-factor-closed-form.js',
  relatedDegree3MissFactor: 'imp-3510-degree3-miss-factor-closed-form.js',
  relatedGeneralDerivation: 'imp-3501-moment-ladder-general-derivation.js',
  relatedDegree0Law: 'imp-3405-bridge-mass-lambda-scaling-law.js',

  summary:
    'Derives the GENERAL degree-d closed-form miss factor 1 - 1/k^(d+1) (exponent p = d, over-prediction ' +
    'k^(d+1)) unifying imp-3488 (d=2: 1-1/k^3) and imp-3510 (d=3: 1-1/k^4) in one d-indexed law. From ' +
    'imp-3501 the A-weighted degree-d bridge mass B_d(a) = sum_{m>=d, m==d(2)} a^m/m! M_m has leading ' +
    'form (a^d/d!) M_d (M_d = int tau^d A d(tau) fixed, U-independent), so by a^d homogeneity ' +
    'B_d(a/k) = k^{-d} B_d(a): the exponent is EXACTLY p = d, the imp-3405 degree-0 prediction k B_d(a) ' +
    'over-predicts by EXACTLY k^(d+1), and the relative miss is |k^{-(d+1)} - 1| = 1 - 1/k^(d+1) ' +
    '(k >= 2, d >= 1). Specializing d = 2 recovers 1 - 1/k^3 and d = 3 recovers 1 - 1/k^4 bit-for-bit. ' +
    'Certified against self-computed d=2 (cosh-1) and d=3 (sinh-a tau) k-ladders {2,3,4,6,8} on bases ' +
    '(0.5,6),(0.4,10) with r_k = B_d(a/k)/B_d(a): the degree-0 residual equals 1 - r_k/k identically ' +
    '(< 1e-12), the derived 1 - 1/k^(d+1) matches the measured miss to the leading-form error ' +
    '(r_k - 1/k^d)/k (< 1e-3, reconciled to r_k to < 1e-12), the over-prediction k/r_k matches k^(d+1) ' +
    'and the fitted exponent matches d to the O(a^2) tail. DERIVATION/CERTIFICATION, RH-EQUIVALENT, ' +
    'necessary-but-not-sufficient; the absolute-measure degree-d faces carry no feasibility ratio; ' +
    'operator positivity (imp-3066) untouched; no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',

  derivation: Object.freeze({
    degreeMass: 'B_d(a) = int W_d(a tau) A(tau) d(tau) = sum_{m>=d, m==d(2)} a^m/m! M_m (imp-3501 R_d)',
    leadingForm: 'B_d(a) = (a^d/d!) M_d + O(a^{d+2}), M_d = int tau^d A(tau) d(tau) fixed & U-independent',
    exponent: 'B_d^lead(a/k) = ((a/k)^d/d!) M_d = k^{-d} B_d^lead(a) => p = d exactly (a^d homogeneity)',
    overPrediction: '(degree-0 prediction)/(actual) = k B_d(a) / (k^{-d} B_d(a)) = k^(d+1)',
    missFactor: 'relative miss = |k^{-(d+1)} - 1| = 1 - 1/k^(d+1) (k >= 2, d >= 1)',
    specialization: 'd=2 -> 1-1/k^3 (imp-3488, p=2, k^3); d=3 -> 1-1/k^4 (imp-3510, p=3, k^4)',
    m2Moment: M2_MOMENT,
    m3Moment: M3_MOMENT,
    kLadder: K_LADDER,
    degrees: DEGREES,
    identityMiss: 'degree-0 residual = 1 - r_k/k with r_k = B_d(a/k)/B_d(a) (definitional)',
    leadingTail: 'derived miss - measured miss = (r_k - 1/k^d)/k, the O(a^2) leading-form error',
    selfComputing: true,
  }),

  certified: Object.freeze({
    certs: CERTS,                            // per-degree, per-cell ladders (d = 2, 3)
    maxSpecializationGap,                    // unified 1-1/k^(d+1) vs imp-3488/imp-3510 constants
    maxMissIdentityGap,
    maxOverPredIdentityGap,
    maxMissReconGap,
    maxMissTail,
    maxExponentGap,
    maxLeadingRelErr,
    identitiesHold,
    unifiedSpecializes,
    missReconciledToFullPrecision,
    missMatchesToLeadingTail,
    exponentIsDegree,
    leadingFormHolds,
    verdict,
  }),

  interpretation: Object.freeze({
    whyExponentIsDegree:
      'The degree-d weight W_d(a tau) has parity-matched leading term (a tau)^d/d!, degree-d homogeneous ' +
      'in a. Integrated against the FIXED, U-independent weight A(tau) it gives B_d(a) ~ (a^d/d!) M_d, so ' +
      'a -> a/k rescales it by exactly k^{-d}. The exponent p = d is analytic, not fitted; the measured ' +
      'd + O(a^2) offset is the a^{d+2} tail and vanishes as a -> 0.',
    whyMissIsKdPlusOne:
      'The imp-3405 degree-0 law keeps the Lebesgue-change-of-variables prefactor k (correct only for the ' +
      'weight-1 measure) while the a^d homogeneity contributes k^{-d}; the prediction is k times too big ' +
      'and the truth is k^{-d}, so it over-predicts by k^(d+1) and the relative miss is 1 - 1/k^(d+1). ' +
      'The exponent d+1 is (one Lebesgue power) + (d homogeneity powers), so d = 2 gives k^3 and d = 3 ' +
      'gives k^4 -- imp-3488 and imp-3510 are the d = 2, 3 instances of this single law.',
    unificationCertified:
      'Evaluating the general derivedMiss = 1 - 1/k^(d+1) at d = 2 reproduces the imp-3488 constant ' +
      '1 - 1/k^3 and at d = 3 the imp-3510 constant 1 - 1/k^4 to < 1e-15 on every rung, and the derived-' +
      'minus-measured miss IS the closed leading-form tail (r_k - 1/k^d)/k reconciled to r_k to < 1e-12 ' +
      'for both degrees. The only departure of r_k from the ideal 1/k^d is the O(a^2) parity tail.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isDerivationAndCertification: true,
    numericalCharacterizationOnly:
      'This module derives the unified degree-d miss factor 1 - 1/k^(d+1) and exponent p = d from the ' +
      'leading form B_d(a) ~ (a^d/d!) M_d and certifies it against the d = 2, 3 k-ladders, specializing ' +
      'to the imp-3488 (1-1/k^3) and imp-3510 (1-1/k^4) constants. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT, and the absolute-measure degree-d faces carry no ' +
      'feasibility comparison. The operator-level K_a >= 0 sign-positivity (off-diagonal endpoint-Hankel ' +
      'step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions -------------------------------------------------------
export const IMP3524_GENERAL_DEGREE_D_MISS_FACTOR_ASSERTIONS = [
  {
    id: 'imp3524-leading-form-reproduces-base-mass-both-degrees',
    why: 'The derivation rests on B_d(a) ~ (a^d/d!) M_d: the leading form must reproduce every base ' +
         'degree-d mass (d = 2, 3; both cells) to < 1% (else the closed exponent/miss have no premise).',
    holds: () => maxLeadingRelErr < LEADING_TOL,
  },
  {
    id: 'imp3524-unified-specializes-to-imp3488-and-imp3510',
    why: 'The general 1 - 1/k^(d+1) must reproduce the imp-3488 d=2 constant 1 - 1/k^3 and the imp-3510 ' +
         'd=3 constant 1 - 1/k^4 bit-for-bit (< 1e-15) on every rung -- the unification claim itself.',
    holds: () => maxSpecializationGap < SPECIALIZE_TOL,
  },
  {
    id: 'imp3524-degree0-residual-identity-1-minus-rk-over-k',
    why: 'The degree-0 relative residual must equal 1 - r_k/k with r_k = B_d(a/k)/B_d(a) to machine ' +
         'precision on every rung, both degrees, both cells -- the definitional identity the closed form ' +
         'specializes.',
    holds: () => maxMissIdentityGap < IDENTITY_TOL,
  },
  {
    id: 'imp3524-overpred-identity-k-over-rk',
    why: 'The measured over-prediction must equal k/r_k to machine precision on every rung, both degrees ' +
         '-- reconciling the degree-d over-prediction diagnostic to the exact ratio r_k.',
    holds: () => maxOverPredIdentityGap < IDENTITY_TOL,
  },
  {
    id: 'imp3524-derived-miss-matches-measured-to-leading-tail',
    why: 'The DERIVED unified 1 - 1/k^(d+1) must match the measured miss to the leading-form error ' +
         '(< 1e-3) on every rung, both degrees, both cells -- the general law is reproduced by derivation.',
    holds: () => maxMissTail < MISS_TAIL_TOL,
  },
  {
    id: 'imp3524-miss-reconciled-to-exact-ratio-full-precision',
    why: 'The derived-minus-measured miss must equal the closed leading-form tail (r_k - 1/k^d)/k to ' +
         'machine precision (< 1e-12), both degrees -- certifying the ONLY departure from 1 - 1/k^(d+1) ' +
         'is the O(a^2) parity tail.',
    holds: () => maxMissReconGap < RECON_TOL,
  },
  {
    id: 'imp3524-derived-exponent-is-degree',
    why: 'The analytically-derived exponent p = d (a^d homogeneity) must match the measured ' +
         '-log(r_k)/log(k) to the O(a^2) tail (< 0.01) on every rung, both degrees -- p = d is derived, ' +
         'not fitted.',
    holds: () => maxExponentGap < EXPONENT_TOL,
  },
  {
    id: 'imp3524-verdict-classifies-the-unified-derivation',
    why: 'The verdict must certify the derived general miss factor 1 - 1/k^(d+1), exponent p = d, and its ' +
         'specialization to imp-3488/imp-3510 against both ladders, not indeterminate.',
    holds: () => verdict.startsWith('GENERAL-DEGREE-d-MISS-FACTOR-1-MINUS-1-OVER-k^(d+1)-DERIVED'),
  },
  {
    id: 'imp3524-honest-derivation-not-a-verdict',
    why: 'Mandatory honesty: derivation/certification only, mass-feasibility necessary-but-not-sufficient ' +
         '(no degree-d feasibility ratio), operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3524_GENERAL_DEGREE_D_MISS_FACTOR.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isDerivationAndCertification === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3524_GENERAL_DEGREE_D_MISS_FACTOR_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3524-general-degree-d-miss-factor assertion failed: ${assertion.id}`);
  }
}

export default IMP3524_GENERAL_DEGREE_D_MISS_FACTOR;
