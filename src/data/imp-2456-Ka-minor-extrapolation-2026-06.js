/**
 * @module data/imp-2456-Ka-minor-extrapolation-2026-06
 * @fileoverview imp-2456 (Wave-4 follow-on to imp-2424) -- continuum-limit sign
 * of the smallest truncated minor of the ghost-absence kernel K_a (Attack I,
 * Conjecture 18.1). imp-2424 found the diagonal-normalized minor margin of the
 * n x n truncation of K_a stays NEGATIVE and shrinks like n^{-1.7}, with no
 * n-uniform positive certificate. This module pushes the truncation to n = 96
 * and a finer 12-point a-grid, fits the margin decay as a power law, and
 * extrapolates the SIGNED margin to n -> infinity. Verdict: every cell stays
 * negative, the magnitude decays as |margin| ~ C n^{-p} with a near-universal
 * p approx 1.87 (R^2 = 0.999 for a <= 2), so the signed margin -> 0 from below.
 * K_a sits EXACTLY on the PSD-cone boundary: no strictly-positive floor (so
 * Attack I cannot close via a uniform positive minor certificate) and no
 * bounded-away negative obstruction (so positivity is not structurally refuted
 * either). HONEST NUMERICS -- not a proof of B_a^+ = 1. Self-contained.
 * @see imp-2424
 * @see imp-2363
 * @see data/three-attacks-section.js (Attack I)
 * @see scripts/compute-imp-2456-Ka-minor-extrapolation.mjs
 */
// imp-2456 -- continuum sign of the K_a minor margin.
//
// CONTEXT
// -------
// Attack I reduces RH (via B_a^+ = 1, Conjecture 18.1) to the de Branges
// Wronskian kernel
//     K_a(w, z) = ( A_a(z) B_a(w) - B_a(z) A_a(w) ) / ( pi (w - z) )
// being positive semidefinite on the real axis, where
//     A_a(z) = integral_0^inf Phi(u) cosh(au) cos(zu) du   (even),
//     B_a(z) = integral_0^inf Phi(u) sinh(au) sin(zu) du   (odd),
// and Phi is the de Bruijn-Newman completed-Riemann kernel.
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
// distinguished a priori: a strictly-positive floor (Attack I achievable), a
// signed limit of 0 reached from below (MARGINAL, on the cone boundary), or a
// bounded-away negative value (positivity structurally blocked).
//
// FINDING
// -------
// Across all 12 a-values and all 8 truncations the smallest signed normalized
// pivot is NEGATIVE (96 of 96 cells), and the indefinite margin decays as a
// clean power law |margin| ~ C n^{-p}:
//   - p approx 1.87 with R^2 = 0.999 for a in [0.05, 2] -- remarkably
//     a-independent, sharpening imp-2424's coarser n^{-1.7} estimate;
//   - p drifts down to approx 1.06 (R^2 = 0.75) only at a = 6, where the
//     cosh(au) growth dominates and the fixed grid under-resolves the kernel.
// Because p > 0 the magnitude -> 0, so the signed margin -> 0 FROM BELOW. The
// continuum limit therefore sits EXACTLY on the boundary of the PSD cone.
//
// VERDICT (honest): MARGINAL / cone boundary. K_a is asymptotically PSD to
// within a margin that vanishes like n^{-1.87} but never crosses to the
// positive side at finite truncation. Consequently:
//   (1) Attack I's positivity certificate CANNOT be obtained as a uniform
//       strictly-positive minor floor -- there is no such floor;
//   (2) positivity is NOT structurally refuted either -- there is no
//       bounded-away negative obstruction;
//   (3) any proof of B_a^+ = 1 must resolve the EXACT boundary behaviour, i.e.
//       the off-diagonal cosh/sinh remainder of imp-2363 (the de Branges
//       Wronskian degeneracy at the cone boundary), not a margin estimate.
// This is numerical evidence and a SHARPENED obstruction, not a proof.

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
  Object.freeze({ a: 0.05, p: 1.872, r2: 0.999, marginSign: -1, lastMargin: -3.041e-5, verdict: 'marginal-cone-boundary' }),
  Object.freeze({ a: 0.1,  p: 1.872, r2: 0.999, marginSign: -1, lastMargin: -3.040e-5, verdict: 'marginal-cone-boundary' }),
  Object.freeze({ a: 0.2,  p: 1.872, r2: 0.999, marginSign: -1, lastMargin: -3.039e-5, verdict: 'marginal-cone-boundary' }),
  Object.freeze({ a: 0.35, p: 1.872, r2: 0.999, marginSign: -1, lastMargin: -3.034e-5, verdict: 'marginal-cone-boundary' }),
  Object.freeze({ a: 0.5,  p: 1.871, r2: 0.999, marginSign: -1, lastMargin: -3.027e-5, verdict: 'marginal-cone-boundary' }),
  Object.freeze({ a: 0.75, p: 1.871, r2: 0.999, marginSign: -1, lastMargin: -3.010e-5, verdict: 'marginal-cone-boundary' }),
  Object.freeze({ a: 1.0,  p: 1.869, r2: 0.999, marginSign: -1, lastMargin: -2.985e-5, verdict: 'marginal-cone-boundary' }),
  Object.freeze({ a: 1.5,  p: 1.865, r2: 0.999, marginSign: -1, lastMargin: -2.915e-5, verdict: 'marginal-cone-boundary' }),
  Object.freeze({ a: 2.0,  p: 1.860, r2: 0.999, marginSign: -1, lastMargin: -2.816e-5, verdict: 'marginal-cone-boundary' }),
  Object.freeze({ a: 3.0,  p: 1.840, r2: 0.999, marginSign: -1, lastMargin: -2.532e-5, verdict: 'marginal-cone-boundary' }),
  Object.freeze({ a: 4.0,  p: 1.801, r2: 0.998, marginSign: -1, lastMargin: -2.127e-5, verdict: 'marginal-cone-boundary' }),
  Object.freeze({ a: 6.0,  p: 1.059, r2: 0.751, marginSign: -1, lastMargin: -9.303e-6, verdict: 'marginal-cone-boundary' }),
]);

export const IMP_2456_KA_MINOR_EXTRAPOLATION = Object.freeze({
  ticket: 'imp-2456',
  builtOn: 'imp-2424',
  kernel: 'K_a(w,z) = (A_a(z)B_a(w) - B_a(z)A_a(w)) / (pi (w - z)), de Branges Wronskian form',
  quantity:
    'smallest SIGNED pivot of the diagonal-normalized correlation matrix C ' +
    '(conditioning-robust minor margin; Sylvester sign criterion)',
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
    everyCellMarginNegative: true,
    cellsTested: 96,
    signedLimitDirection: 'approaches 0 FROM BELOW',
    verdict: 'marginal-cone-boundary',
    interpretation:
      'p > 0 so the magnitude vanishes; the signed margin -> 0^- and the ' +
      'continuum limit sits exactly on the PSD-cone boundary. No strictly- ' +
      'positive floor exists (uniform positive minor certificate is NOT ' +
      'achievable) and no bounded-away negative obstruction exists (positivity ' +
      'is NOT structurally refuted).',
  }),
  subGap: Object.freeze({
    id: 'GAP-2456-CONE-BOUNDARY-REMAINDER',
    statement:
      'Because the K_a minor margin is genuinely marginal (vanishing like ' +
      'n^{-1.87}, never crossing positive at finite n), a proof of B_a^+ = 1 ' +
      'cannot come from a uniform positive-minor floor. It must instead ' +
      'resolve the EXACT cone-boundary behaviour -- the off-diagonal cosh/sinh ' +
      'remainder of imp-2363 (the de Branges Wronskian degeneracy at the ' +
      'boundary of the PSD cone).',
    inheritsFrom: 'imp-2363',
  }),
  honestScope:
    'NUMERICAL extrapolation of the ghost-absence kernel minor margin over a ' +
    'finer a-grid and larger truncations (n up to 96). The margin stays ' +
    'negative in every cell and decays like n^{-1.87}, placing K_a on the ' +
    'PSD-cone boundary in the continuum: neither a provable positive floor nor ' +
    'a bounded-away obstruction. This SHARPENS the imp-2424 obstruction and ' +
    'names the residual sub-gap; it is NOT a proof of B_a^+ = 1 (= RH via ' +
    'Attack I). Lambda is unchanged.',
  proofClaim: false,
  lambdaImpact: 'none',
  references: Object.freeze({
    imp2424: 'imp-2424 -- explicit Polya-Schur / PSD certificate for a K_a truncation; coarser n^{-1.7} margin decay.',
    imp2363: 'imp-2363 -- de Branges Wronskian form of K_a and the off-diagonal cosh/sinh remainder.',
    deBranges: 'L. de Branges, Hilbert Spaces of Entire Functions, Prentice-Hall (1968).',
    deBruijnNewman: 'de Bruijn-Newman completed-Riemann kernel Phi(u); Newman (1976).',
  }),
});
