/**
 * @module data/imp-2456-Ka-minor-extrapolation-2026-06
 * @fileoverview imp-2456 (Wave-4 follow-on to imp-2424) -- historical
 * extrapolation of a SURROGATE Wronskian matrix. A 2026-07-24 normalization
 * audit found that imp-2424/2456 use e^{4u}/e^{2u} coefficients and unscaled
 * transform arguments. The canonical kernel instead has e^{9u}/e^{5u}
 * coefficients and X(w)=8 integral Phi(u) cosh(2wu) du. Consequently every
 * negative pivot and power-law fit in this file belongs only to the surrogate.
 * The former exact-K_a cone-boundary inference is RETRACTED and INVALID FOR T3.
 * A correctly normalized 60-digit four-node numerical check is positive.
 * Historical values are retained solely for reproducibility.
 * @see imp-2424
 * @see imp-2363
 * @see data/three-attacks-section.js (Approach I)
 * @see scripts/compute-imp-2456-Ka-minor-extrapolation.mjs
 */
// imp-2456 -- historical surrogate minor fit; invalid for exact K_a / T3.
//
// CONTEXT
// -------
// The scripts intended to sample the de Branges Wronskian kernel
//     K_a(w, z) = ( A_a(z) B_a(w) - B_a(z) A_a(w) ) / ( pi (w - z) )
// being positive semidefinite on the real axis, where
//     A_a(z) = integral_0^inf Phi(u) cosh(au) cos(zu) du   (even),
//     B_a(z) = integral_0^inf Phi(u) sinh(au) sin(zu) du   (odd),
// but implemented the surrogate
//   Phi_sur(u) = sum_n (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u})
//                         exp(-pi n^2 e^{4u})
// with unscaled transform arguments. The canonical normalization is
//   Phi(u) = sum_n (2 pi^2 n^4 e^{9u} - 3 pi n^2 e^{5u})
//                     exp(-pi n^2 e^{4u}),
//   X(w) = 8 integral_0^infinity Phi(u) cosh(2wu) du.
//
// imp-2424 built the n x n Gram matrix G[j,k] = K_a(z_j, z_k) on a symmetric
// real grid, formed the diagonal-normalized correlation matrix C (unit
// |diagonal|) to separate sign from conditioning, and read the minor margin off
// the symmetric LDL^T pivots (Sylvester: sign changes of the leading principal
// minors are governed by the pivots; the product-of-pivots minor itself
// underflows for large n and measures conditioning, not sign). It reported the
// smallest signed normalized pivot is NEGATIVE and shrinks like n^{-1.7}.
//
// imp-2456 extends that sweep: n in {8,16,24,32,48,64,80,96} and a 12-point
// a-grid {0.05 .. 6.0}. For each a it fits log|margin| against log n by OLS and
// extrapolates the SIGNED margin to the continuum. Three outcomes were
// distinguished a priori: a strictly-positive floor (Approach I achievable), a
// signed limit of 0 reached from below (MARGINAL, on the cone boundary), or a
// bounded-away negative value (positivity structurally blocked).
//
// HISTORICAL SURROGATE FINDING
// ----------------------------
// Across all 12 a-values and all 8 surrogate truncations the smallest signed
// normalized pivot is negative (96 of 96 cells), with the fitted law:
//   - p approx 1.87 with R^2 = 0.999 for a in [0.05, 2] -- remarkably
//     a-independent, sharpening imp-2424's coarser n^{-1.7} estimate;
//   - p drifts down to approx 1.06 (R^2 = 0.75) only at a = 6, where the
//     cosh(au) growth dominates and the fixed grid under-resolves the kernel.
// These values say nothing about the sign or continuum location of exact K_a.
// The correctly normalized four-node numerical check is positive. No negative-minor,
// cone-boundary, T3, B_a^+, Lambda, or RH inference survives the audit.

// Representative full margin series at a = 0.5 (smallest signed normalized
// pivot of C; negativePivots = count of negative pivots out of n).
const IMP2456_SERIES_A_HALF = Object.freeze([
  Object.freeze({ n: 8,  minPivotSigned: -3.089129e-3, negativePivots: 4 }),
  Object.freeze({ n: 16, minPivotSigned: -9.249354e-4, negativePivots: 9 }),
  Object.freeze({ n: 24, minPivotSigned: -4.383043e-4, negativePivots: 14 }),
  Object.freeze({ n: 32, minPivotSigned: -2.547645e-4, negativePivots: 15 }),
  Object.freeze({ n: 48, minPivotSigned: -1.170598e-4, negativePivots: 26 }),
  Object.freeze({ n: 64, minPivotSigned: -6.696301e-5, negativePivots: 32 }),
  Object.freeze({ n: 80, minPivotSigned: -4.329355e-5, negativePivots: 38 }),
  Object.freeze({ n: 96, minPivotSigned: -3.026984e-5, negativePivots: 45 }),
]);

// Per-a power-law fit |margin| ~ C n^{-p} and continuum verdict.
const IMP2456_FIT_TABLE = Object.freeze([
  Object.freeze({ a: 0.05, p: 1.872, r2: 0.999, marginSign: -1, lastMargin: -3.041e-5, verdict: 'surrogate-marginal-fit' }),
  Object.freeze({ a: 0.1,  p: 1.872, r2: 0.999, marginSign: -1, lastMargin: -3.040e-5, verdict: 'surrogate-marginal-fit' }),
  Object.freeze({ a: 0.2,  p: 1.872, r2: 0.999, marginSign: -1, lastMargin: -3.039e-5, verdict: 'surrogate-marginal-fit' }),
  Object.freeze({ a: 0.35, p: 1.872, r2: 0.999, marginSign: -1, lastMargin: -3.034e-5, verdict: 'surrogate-marginal-fit' }),
  Object.freeze({ a: 0.5,  p: 1.871, r2: 0.999, marginSign: -1, lastMargin: -3.027e-5, verdict: 'surrogate-marginal-fit' }),
  Object.freeze({ a: 0.75, p: 1.871, r2: 0.999, marginSign: -1, lastMargin: -3.010e-5, verdict: 'surrogate-marginal-fit' }),
  Object.freeze({ a: 1.0,  p: 1.869, r2: 0.999, marginSign: -1, lastMargin: -2.985e-5, verdict: 'surrogate-marginal-fit' }),
  Object.freeze({ a: 1.5,  p: 1.865, r2: 0.999, marginSign: -1, lastMargin: -2.915e-5, verdict: 'surrogate-marginal-fit' }),
  Object.freeze({ a: 2.0,  p: 1.860, r2: 0.999, marginSign: -1, lastMargin: -2.816e-5, verdict: 'surrogate-marginal-fit' }),
  Object.freeze({ a: 3.0,  p: 1.840, r2: 0.999, marginSign: -1, lastMargin: -2.532e-5, verdict: 'surrogate-marginal-fit' }),
  Object.freeze({ a: 4.0,  p: 1.801, r2: 0.998, marginSign: -1, lastMargin: -2.127e-5, verdict: 'surrogate-marginal-fit' }),
  Object.freeze({ a: 6.0,  p: 1.059, r2: 0.751, marginSign: -1, lastMargin: -9.303e-6, verdict: 'surrogate-marginal-fit' }),
]);

export const IMP_2456_KA_MINOR_EXTRAPOLATION = Object.freeze({
  ticket: 'imp-2456',
  builtOn: 'imp-2424',
  status: 'SURROGATE / INVALID FOR T3',
  kernelModel: 'historical-surrogate-normalization',
  appliesToExactRiemannKernel: false,
  kernel: 'surrogate Wronskian matrix inherited from imp-2424',
  normalizationAudit: Object.freeze({
    implementedPhi:
      '(2 pi^2 n^4 e^(4u) - 3 pi n^2 e^(2u)) exp(-pi n^2 e^(4u))',
    canonicalPhi:
      '(2 pi^2 n^4 e^(9u) - 3 pi n^2 e^(5u)) exp(-pi n^2 e^(4u))',
    canonicalTransform: 'X(w) = 8 integral Phi(u) cosh(2 w u) du',
    omittedTransformArgumentFactor: 2,
    correctedCanonicalFourNodeNumericalCheck: Object.freeze({
      status: 'positive-numerical-only',
      rigorous: false,
      precisionDigits: 60,
      a: 0.5,
      realNodes: Object.freeze([-6, -2, 2, 6]),
      smallestNormalizedEigenvalue: 4.66922095265e-5,
      normalizedLeadingPrincipalMinors: Object.freeze([
        1,
        0.0387394724,
        0.000150634109,
        1.4487899474e-7,
      ]),
    }),
  }),
  quantity:
    'historical smallest signed pivot of the SURROGATE diagonal-normalized matrix',
  grid: Object.freeze({ halfSpan: 8.0, nValues: Object.freeze([8, 16, 24, 32, 48, 64, 80, 96]) }),
  aGrid: Object.freeze([0.05, 0.1, 0.2, 0.35, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 4.0, 6.0]),
  quadrature: Object.freeze({ uMax: 2.0, nodes: 4000, rule: 'composite Simpson' }),
  representativeSeriesAHalf: IMP2456_SERIES_A_HALF,
  fitTable: IMP2456_FIT_TABLE,
  decayLaw: Object.freeze({
    form: '|margin| ~ C n^{-p}',
    pSmallA: 1.87,
    pSmallA_r2: 0.999,
    aRangeOfUniversalExponent: '[0.05, 2.0]',
    pAtLargeA: 1.06,
    note:
      'p approx 1.87 is nearly a-independent for a <= 2 (sharpening imp-2424 ' +
      'n^{-1.7}); it falls to approx 1.06 only at a = 6 where cosh(au) growth ' +
      'dominates and the fixed grid under-resolves the kernel.',
  }),
  continuum: Object.freeze({
    historicalSurrogateEveryCellMarginNegative: true,
    cellsTested: 96,
    historicalFitDirection: 'surrogate fit approaches 0 from below',
    verdict: 'surrogate-fit-only-invalid-for-T3',
    exactKernelInference: 'RETRACTED',
    interpretation:
      'The fit describes only the mis-normalized surrogate. It does not place ' +
      'exact K_a on either side of the PSD cone or on its boundary. The ' +
      'correctly normalized 60-digit four-node numerical check is positive, ' +
      'so the historical negative-pivot inference is invalid for T3.',
  }),
  subGap: Object.freeze({
    id: 'RETRACTED-GAP-2456-SURROGATE-CONE-BOUNDARY',
    statement:
      'Withdrawn as an exact-kernel sub-gap. The n^{-1.87} margin belongs to ' +
      'the historical surrogate and imposes no cone-boundary obligation on ' +
      'the exact Riemann kernel or T3.',
    inheritsFrom: 'imp-2363',
  }),
  honestScope:
    'SURROGATE / INVALID FOR T3. The historical negative rows and n^{-1.87} ' +
    'fit are reproducibility data for a mis-normalized kernel only. They do ' +
    'not establish a negative exact-K_a minor, a PSD-cone boundary, or any ' +
    'restriction on an exact proof strategy. The correctly normalized ' +
    'four-node numerical check is positive but is not a proof. B_a^+, ' +
    'Lambda, RH, and T3 are untouched.',
  proofClaim: false,
  lambdaImpact: 'none',
  references: Object.freeze({
    imp2424: 'imp-2424 -- historical surrogate Wronskian-matrix sweep; invalid for exact K_a/T3.',
    imp2363: 'imp-2363 -- de Branges Wronskian form of K_a and the off-diagonal cosh/sinh remainder.',
    deBranges: 'L. de Branges, Hilbert Spaces of Entire Functions, Prentice-Hall (1968).',
    deBruijnNewman: 'Canonical Phi uses e^(9u)/e^(5u) coefficients and X(w)=8 integral Phi(u) cosh(2wu) du.',
  }),
});

export const IMP_2456_KA_MINOR_EXTRAPOLATION_ASSERTIONS = [
  {
    id: 'imp2456-surrogate-status-locked',
    why: 'The historical sweep must never be presented as an exact-Riemann/T3 computation.',
    holds: () =>
      IMP_2456_KA_MINOR_EXTRAPOLATION.status === 'SURROGATE / INVALID FOR T3' &&
      IMP_2456_KA_MINOR_EXTRAPOLATION.appliesToExactRiemannKernel === false,
  },
  {
    id: 'imp2456-canonical-normalization-recorded',
    why: 'The audit must retain the e9/e5 canonical Phi and factor-2 transform correction.',
    holds: () => {
      const n = IMP_2456_KA_MINOR_EXTRAPOLATION.normalizationAudit;
      return n.canonicalPhi.includes('e^(9u)') &&
             n.canonicalPhi.includes('e^(5u)') &&
             n.canonicalTransform.includes('cosh(2 w u)') &&
             n.omittedTransformArgumentFactor === 2;
    },
  },
  {
    id: 'imp2456-negative-minor-inference-retracted',
    why: 'Surrogate negative pivots cannot imply a cone-boundary or negative-minor verdict for exact K_a.',
    holds: () =>
      IMP_2456_KA_MINOR_EXTRAPOLATION.continuum.exactKernelInference === 'RETRACTED' &&
      IMP_2456_KA_MINOR_EXTRAPOLATION.normalizationAudit
        .correctedCanonicalFourNodeNumericalCheck.status === 'positive-numerical-only' &&
      IMP_2456_KA_MINOR_EXTRAPOLATION.normalizationAudit
        .correctedCanonicalFourNodeNumericalCheck.rigorous === false &&
      IMP_2456_KA_MINOR_EXTRAPOLATION.normalizationAudit
        .correctedCanonicalFourNodeNumericalCheck.smallestNormalizedEigenvalue > 0 &&
      IMP_2456_KA_MINOR_EXTRAPOLATION.normalizationAudit
        .correctedCanonicalFourNodeNumericalCheck.normalizedLeadingPrincipalMinors
        .every((value) => value > 0) &&
      /do not establish a negative exact-K_a minor/.test(
        IMP_2456_KA_MINOR_EXTRAPOLATION.honestScope
      ),
  },
  {
    id: 'imp2456-historical-fit-labels-are-surrogate-only',
    why: 'Every retained fit-row verdict must carry the surrogate label.',
    holds: () =>
      IMP_2456_KA_MINOR_EXTRAPOLATION.fitTable.every(
        (row) => row.verdict === 'surrogate-marginal-fit'
      ),
  },
];

for (const assertion of IMP_2456_KA_MINOR_EXTRAPOLATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-2456 normalization-audit assertion failed: ${assertion.id}`);
  }
}
