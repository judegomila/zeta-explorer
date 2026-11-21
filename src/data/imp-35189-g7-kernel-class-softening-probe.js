/**
 * @module imp-35189-g7-kernel-class-softening-probe
 * @fileoverview imp-35189 -- MEASURE whether an entirely different kernel CLASS (a non-monomial
 *   orthogonal basis, or a non-exponential admissible multiplier) opens an off-orbit SOFTENING
 *   direction in ||R|| that the imp-35148 exponential-shear MONOMIAL class lacks.
 *
 *   THE GAP THIS FILLS (the imp-35189 ticket)
 *   -----------------------------------------
 *   imp-35148 measured the DISCRETE truncation-size DEG axis of the imp-3066 exponential-shear
 *   monomial kernel and found it monotone-INFLATING (no softening). Its HONEST CAVEAT states that
 *   this says nothing about entirely different kernel CLASSES: a non-exponential multiplier or a
 *   non-monomial basis. This module probes exactly those two axes. It swaps the monomial truncation
 *   phi_j = x^j for an orthogonal basis (shifted Legendre / shifted Chebyshev on [0,1]) and swaps
 *   the cosh/sinh multiplier for a non-exponential admissible even/odd pair, then measures the SIGN
 *   of the transverse ||R|| variation at the roadmap anchor for each class -- and asks whether ANY
 *   admissible class exhibits a softening (negative transverse) direction the baseline lacks.
 *
 *   THE CONSTRUCTION (generalising imp-3066 / imp-33765 / imp-35075 / imp-35148)
 *   --------------------------------------------------------------------------
 *   For a basis {phi_j} on [0,1], an even PASS multiplier w_pass and an odd SHEAR multiplier
 *   w_shear (both taking argument s*x):
 *       D_jk = int_0^1 w_pass(s_pass x) phi_j(x) phi_k(x) dx,
 *       H_jk = c * int_0^1 w_shear(s_shear x) phi_j(x) phi_k(x) dx,
 *       R_jk = H_jk / sqrt(D_jj D_kk),   ||R||(class) = Perron eigenvalue of R.
 *   The imp-3066 kernel is the anchor slice basis = monomial, w_pass = cosh, w_shear = sinh,
 *   s_pass = s_shear = 3, c = 1, DEG = 4 (reproducing the roadmap anchor ||R|| = 4.617013710).
 *   The imp-3066 obstruction magnitude uses the DIAGONAL of D for normalisation (only D_jj), so
 *   the RAW ||R|| is basis-DEPENDENT by construction. This module therefore also reports the
 *   BASIS-INVARIANT generalised spectral radius rho(D^{-1}H) (full D, Cholesky-whitened) to separate
 *   a genuine class change from a mere re-normalisation of the same operator.
 *
 *   THE MEASUREMENT (the imp-35189 deliverable -- MEASURE)
 *   -----------------------------------------------------
 *   Five classes at the anchor (DEG = 4, s = 3, c = 1); raw ||R|| and the transverse finite-diff
 *   gradient (central, h = 1e-3) plus the discrete DEG forward difference:
 *       A exp+monomial   raw||R|| = 4.617014   d/ds_pass = -3.877  d/ds_shear = +4.086  dDEG = +0.911
 *       B exp+Legendre   raw||R|| = 2.253630   d/ds_pass = -1.697  d/ds_shear = +2.181  dDEG = +0.078
 *       C exp+Chebyshev  raw||R|| = 2.071416   d/ds_pass = -1.449  d/ds_shear = +1.727  dDEG = +0.067
 *       D poly+monomial  raw||R|| = 2.759051   d/ds_pass = -1.351  d/ds_shear = +0.920  dDEG = +0.507
 *       E poly+Legendre  raw||R|| = 1.057011   d/ds_pass = -0.444  d/ds_shear = +0.352  dDEG = +0.015
 *   The BASIS-INVARIANT generalised spectral radius rho(D^{-1}H) collapses the three exponential
 *   bases onto ONE value 0.993354 (mono = Leg = Cheb to ~3e-13) and the two polynomial bases onto
 *   0.685331 -- so the orthogonal-basis drop in RAW ||R|| (4.62 -> 2.25 -> 2.07) is a NORMALISATION
 *   artifact of the diagonal-only imp-3066 rule, NOT a softening of the underlying operator.
 *
 *   THE VERDICT (measurement)
 *   -------------------------
 *   The transverse SIGN pattern is IDENTICAL across all five classes: d||R||/ds_pass NEGATIVE,
 *   d||R||/ds_shear POSITIVE, d||R||/dDEG POSITIVE. The pass-rate direction already carries the
 *   negative (softening-shaped) sign in the BASELINE exp+monomial class -- it is not a new direction
 *   unlocked by any alternate class -- and NO probed basis swap or multiplier-class swap flips a
 *   coordinate that the exponential-shear monomial class does not already carry. Within the two
 *   invariant families the generalised spectral radius is exactly constant across bases, so the
 *   orthogonal bases relabel the same operator rather than opening a softening class. VERDICT: no
 *   admissible non-monomial-basis or non-exponential-multiplier class probed here opens an off-orbit
 *   softening direction that the imp-35148 exponential-shear monomial class lacks. MEASUREMENT ONLY.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   MEASUREMENT on the inherited imp-3066 surrogate, NOT the section-26 Gram. The RAW ||R|| is
 *   basis-dependent by the diagonal-only imp-3066 rule; a smaller raw ||R|| in an orthogonal basis
 *   is NOT a smaller obstruction (the basis-invariant rho is unchanged across bases). The probed
 *   set (two orthogonal bases, one non-exponential even/odd multiplier pair) is REPRESENTATIVE, not
 *   exhaustive over all admissible kernel classes; "no softening direction" is scoped to the classes
 *   probed here. A sign pattern carries NO RH verdict: it neither shows the imp-3066 cover fails nor
 *   that it holds. imp-3066 K_a &gt;= 0 and G7 remain OPEN and UNTOUCHED; this establishes no operator
 *   positivity; changes no bound; ||R|| carries NO RH verdict; NO QED. No refereed bound is changed.
 *
 *   @see imp-35148-g7-truncation-deg-lever-probe.js (imp-35148: the discrete DEG axis whose caveat this fills)
 *   @see imp-35075-g7-orthogonal-lever-tangent-completeness.js (imp-35075: the two continuous transverse levers)
 *   @see imp-33765-g7-obstruction-orthogonal-lever.js (imp-33765: the one-dimensionality + coupled s-flow)
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (imp-3066: the single-cell G7 magnitude, K_a >= 0 OPEN)
 *   @see lambda-roadmap.js G7 (the K_a >= 0 lone obstruction node)
 *
 *   Ticket: imp-35189 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const NQ = 4000;                 // midpoint quadrature panels (matches imp-3066 / imp-33765 / imp-35148)
const ANCHOR_DEG = 4;            // roadmap anchor truncation (DEG+1 = 5)
const ANCHOR_S = 3;              // roadmap G7 anchor product s = a*U
const FD_H = 1e-3;               // central finite-difference step for the transverse gradient

const cosh = Math.cosh;
const sinh = Math.sinh;

/** x-domain moment int_0^1 weightFn(s*x) * integrand(x) dx (midpoint rule). */
function moment(weightFn, s, integrand) {
  const hq = 1 / NQ;
  let acc = 0;
  for (let k = 0; k < NQ; k++) {
    const x = (k + 0.5) * hq;
    acc += weightFn(s * x) * integrand(x) * hq;
  }
  return acc;
}

/**
 * Classic cyclic Jacobi eigenvalues for a small SYMMETRIC matrix (self-contained, no deps).
 * Copied verbatim from imp-3066 / imp-33765 / imp-35075 / imp-35148 so the modules read the SAME
 * spectrum.
 */
function symmetricEigenvalues(matrix) {
  const n = matrix.length;
  const m = matrix.map((row) => row.slice());
  for (let iter = 0; iter < 500; iter++) {
    let p = 0;
    let q = 1;
    let off = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(m[i][j]) > off) {
          off = Math.abs(m[i][j]);
          p = i;
          q = j;
        }
      }
    }
    if (off < 1e-15) break;
    const app = m[p][p];
    const aqq = m[q][q];
    const apq = m[p][q];
    const theta = (aqq - app) / (2 * apq);
    const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
    const c = 1 / Math.sqrt(t * t + 1);
    const s = t * c;
    for (let i = 0; i < n; i++) {
      const mip = m[i][p];
      const miq = m[i][q];
      m[i][p] = c * mip - s * miq;
      m[i][q] = s * mip + c * miq;
    }
    for (let j = 0; j < n; j++) {
      const mpj = m[p][j];
      const mqj = m[q][j];
      m[p][j] = c * mpj - s * mqj;
      m[q][j] = s * mpj + c * mqj;
    }
  }
  return m.map((row, i) => row[i]);
}

// -- basis families on [0, 1] --------------------------------------------------
/** Monomial basis phi_j(x) = x^j (the imp-3066 / imp-35148 truncation). */
function monomialPhi(j) {
  return (x) => Math.pow(x, j);
}
/** Shifted Legendre basis P_j(2x - 1) via the three-term recurrence in t = 2x - 1. */
function legendrePhi(j) {
  return (x) => {
    const t = 2 * x - 1;
    if (j === 0) return 1;
    if (j === 1) return t;
    let p0 = 1;
    let p1 = t;
    for (let n = 1; n < j; n++) {
      const pn = ((2 * n + 1) * t * p1 - n * p0) / (n + 1);
      p0 = p1;
      p1 = pn;
    }
    return p1;
  };
}
/** Shifted Chebyshev basis T_j(2x - 1) = cos(j arccos(2x - 1)). */
function chebyshevPhi(j) {
  return (x) => {
    const t = Math.max(-1, Math.min(1, 2 * x - 1));
    return Math.cos(j * Math.acos(t));
  };
}

// -- multiplier classes (even PASS, odd SHEAR; argument u = s*x) ----------------
const expPass = (u) => cosh(u);                 // exponential even part
const expShear = (u) => sinh(u);                // exponential odd part
const polyPass = (u) => 1 + (u * u) / 2;        // non-exponential admissible even multiplier
const polyShear = (u) => u;                     // non-exponential admissible odd multiplier

/**
 * RAW imp-3066 Perron norm ||R||: R_jk = H_jk / sqrt(D_jj D_kk) with DIAGONAL-only normalisation
 * (the basis-DEPENDENT roadmap magnitude).
 */
function rawOpNorm(DEG, phiFactory, passFn, shearFn, sPass, sShear, c) {
  const phis = Array.from({ length: DEG + 1 }, (_u, j) => phiFactory(j));
  const Ddiag = Array.from({ length: DEG + 1 }, (_u, j) => moment(passFn, sPass, (x) => phis[j](x) * phis[j](x)));
  const H = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => c * moment(shearFn, sShear, (x) => phis[j](x) * phis[k](x))),
  );
  const R = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => H[j][k] / Math.sqrt(Ddiag[j] * Ddiag[k])),
  );
  return Math.max(...symmetricEigenvalues(R).map((e) => Math.abs(e)));
}

// -- basis-INVARIANT generalised spectral radius rho(D^{-1}H) via Cholesky whitening -----------
function cholesky(A) {
  const n = A.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = A[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      L[i][j] = i === j ? Math.sqrt(s) : s / L[j][j];
    }
  }
  return L;
}
function forwardSolve(L, b) {
  const n = L.length;
  const y = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let s = b[i];
    for (let k = 0; k < i; k++) s -= L[i][k] * y[k];
    y[i] = s / L[i][i];
  }
  return y;
}
/** rho(D^{-1}H) = spectral radius of the whitened symmetric M = L^{-1} H L^{-T}, L L^T = full D. */
function generalizedSpectralRadius(DEG, phiFactory, passFn, shearFn, s) {
  const phis = Array.from({ length: DEG + 1 }, (_u, j) => phiFactory(j));
  const n = DEG + 1;
  const D = Array.from({ length: n }, (_u, j) =>
    Array.from({ length: n }, (_v, k) => moment(passFn, s, (x) => phis[j](x) * phis[k](x))),
  );
  const H = Array.from({ length: n }, (_u, j) =>
    Array.from({ length: n }, (_v, k) => moment(shearFn, s, (x) => phis[j](x) * phis[k](x))),
  );
  const L = cholesky(D);
  const Y = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let col = 0; col < n; col++) {
    const y = forwardSolve(L, H.map((row) => row[col]));
    for (let i = 0; i < n; i++) Y[i][col] = y[i];
  }
  const M = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let row = 0; row < n; row++) {
    const y = forwardSolve(L, Y[row].slice());
    for (let j = 0; j < n; j++) M[row][j] = y[j];
  }
  const Ms = Array.from({ length: n }, (_u, i) => Array.from({ length: n }, (_v, j) => (M[i][j] + M[j][i]) / 2));
  return Math.max(...symmetricEigenvalues(Ms).map((e) => Math.abs(e)));
}

// -- the five probed classes ---------------------------------------------------
const CLASSES = [
  { key: 'A', name: 'exp+monomial (baseline)', phi: monomialPhi, pass: expPass, shear: expShear, family: 'exp' },
  { key: 'B', name: 'exp+Legendre', phi: legendrePhi, pass: expPass, shear: expShear, family: 'exp' },
  { key: 'C', name: 'exp+Chebyshev', phi: chebyshevPhi, pass: expPass, shear: expShear, family: 'exp' },
  { key: 'D', name: 'poly+monomial', phi: monomialPhi, pass: polyPass, shear: polyShear, family: 'poly' },
  { key: 'E', name: 'poly+Legendre', phi: legendrePhi, pass: polyPass, shear: polyShear, family: 'poly' },
];

const measurements = CLASSES.map((cl) => {
  const raw = rawOpNorm(ANCHOR_DEG, cl.phi, cl.pass, cl.shear, ANCHOR_S, ANCHOR_S, 1);
  const dPass =
    (rawOpNorm(ANCHOR_DEG, cl.phi, cl.pass, cl.shear, ANCHOR_S + FD_H, ANCHOR_S, 1) -
      rawOpNorm(ANCHOR_DEG, cl.phi, cl.pass, cl.shear, ANCHOR_S - FD_H, ANCHOR_S, 1)) /
    (2 * FD_H);
  const dShear =
    (rawOpNorm(ANCHOR_DEG, cl.phi, cl.pass, cl.shear, ANCHOR_S, ANCHOR_S + FD_H, 1) -
      rawOpNorm(ANCHOR_DEG, cl.phi, cl.pass, cl.shear, ANCHOR_S, ANCHOR_S - FD_H, 1)) /
    (2 * FD_H);
  const dDeg =
    rawOpNorm(ANCHOR_DEG + 1, cl.phi, cl.pass, cl.shear, ANCHOR_S, ANCHOR_S, 1) -
    rawOpNorm(ANCHOR_DEG, cl.phi, cl.pass, cl.shear, ANCHOR_S, ANCHOR_S, 1);
  const rhoInvariant = generalizedSpectralRadius(ANCHOR_DEG, cl.phi, cl.pass, cl.shear, ANCHOR_S);
  return Object.freeze({
    key: cl.key,
    name: cl.name,
    family: cl.family,
    rawOpNorm: raw,
    dOpNorm_dPass: dPass,
    dOpNorm_dShear: dShear,
    dOpNorm_dDeg: dDeg,
    // the transverse SIGN triple; each entry is -1, 0, or +1
    signPass: Math.sign(dPass),
    signShear: Math.sign(dShear),
    signDeg: Math.sign(dDeg),
    rhoInvariant,
  });
});

// -- the SIGN-PATTERN verdict --------------------------------------------------
const baseline = measurements.find((m) => m.key === 'A');
const baselineSignTriple = [baseline.signPass, baseline.signShear, baseline.signDeg];

// Does any class carry a transverse sign the baseline does NOT already carry? (a genuinely new
// off-orbit softening direction)
const anyClassOpensNewSoftening = measurements.some(
  (m) =>
    m.signPass !== baseline.signPass ||
    m.signShear !== baseline.signShear ||
    m.signDeg !== baseline.signDeg,
);
const allSharePassNegative = measurements.every((m) => m.signPass < 0);
const allShareShearPositive = measurements.every((m) => m.signShear > 0);
const allShareDegPositive = measurements.every((m) => m.signDeg > 0);

// basis-invariance: the three exponential bases collapse to ONE generalised spectral radius; the
// two polynomial bases collapse to another. The RAW ||R|| spread is thus a normalisation artifact.
const expRhos = measurements.filter((m) => m.family === 'exp').map((m) => m.rhoInvariant);
const polyRhos = measurements.filter((m) => m.family === 'poly').map((m) => m.rhoInvariant);
const expRhoSpread = Math.max(...expRhos) - Math.min(...expRhos);
const polyRhoSpread = Math.max(...polyRhos) - Math.min(...polyRhos);
const expRawSpread =
  Math.max(...measurements.filter((m) => m.family === 'exp').map((m) => m.rawOpNorm)) -
  Math.min(...measurements.filter((m) => m.family === 'exp').map((m) => m.rawOpNorm));
const basisInvarianceHoldsWithinFamily = expRhoSpread < 1e-9 && polyRhoSpread < 1e-9;

const anchorBaselineRaw = baseline.rawOpNorm;

export const IMP35189_G7_KERNEL_CLASS_SOFTENING_PROBE = Object.freeze({
  id: 'imp-35189-g7-kernel-class-softening-probe',
  ticket: 'imp-35189',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedDegProbe: 'imp-35148-g7-truncation-deg-lever-probe.js',
  relatedTangentCompleteness: 'imp-35075-g7-orthogonal-lever-tangent-completeness.js',
  relatedOneDimensionality: 'imp-33765-g7-obstruction-orthogonal-lever.js',
  relatedObstruction: 'imp-3066-offdiagonal-hankel-obstruction.js',
  roadmapNode: 'G7',

  summary:
    'Fills the imp-35148 HONEST CAVEAT -- that its no-softening DEG result says nothing about ' +
    'entirely different kernel CLASSES -- by swapping the monomial truncation for an orthogonal ' +
    'basis (shifted Legendre / Chebyshev on [0,1]) and the cosh/sinh multiplier for a ' +
    'non-exponential admissible even/odd pair, then measuring the SIGN of the transverse ||R|| ' +
    'variation at the imp-3066 anchor (DEG=4, s=3, c=1) for each of five classes. RESULT: the ' +
    'transverse sign pattern (d||R||/ds_pass NEGATIVE, d||R||/ds_shear POSITIVE, d||R||/dDEG ' +
    'POSITIVE) is IDENTICAL across all five classes -- the pass-rate softening sign already lives ' +
    'in the baseline exp+monomial class and is NOT unlocked by any alternate class. The ' +
    'basis-invariant generalised spectral radius rho(D^{-1}H) collapses the three exponential ' +
    'bases onto 0.993354 (to ~3e-13) and the two polynomial bases onto 0.685331, so the raw ||R|| ' +
    'drop under an orthogonal basis (4.62 -> 2.25 -> 2.07) is a diagonal-normalisation artifact, ' +
    'NOT a softening. VERDICT: no probed non-monomial-basis or non-exponential-multiplier class ' +
    'opens an off-orbit softening direction the exp+monomial class lacks. MEASUREMENT ONLY; ' +
    'imp-3066 K_a >= 0 / G7 OPEN and untouched; ||R|| carries NO RH verdict; changes no bound; ' +
    'not a proof.',

  construction: Object.freeze({
    inheritedFrom:
      'imp-3066 / imp-33765 / imp-35075 / imp-35148 (same de-homogenised x-moments, midpoint ' +
      'quadrature, Jacobi eigensolver); generalised to arbitrary basis phi_j and even/odd multiplier',
    kernel:
      'D_jk = int_0^1 w_pass(s_pass x) phi_j phi_k dx, H_jk = c int_0^1 w_shear(s_shear x) phi_j ' +
      'phi_k dx; RAW ||R|| = Perron eig of R_jk = H_jk / sqrt(D_jj D_kk) (diagonal-only, ' +
      'basis-dependent); rho(D^{-1}H) = generalised spectral radius (full D, basis-invariant)',
    anchorSlice: 'DEG = ' + ANCHOR_DEG + ', s_pass = s_shear = ' + ANCHOR_S + ', c = 1',
    bases: 'monomial x^j, shifted Legendre P_j(2x-1), shifted Chebyshev T_j(2x-1)',
    multipliers:
      'exponential (w_pass=cosh, w_shear=sinh); non-exponential admissible (w_pass=1+u^2/2 even, ' +
      'w_shear=u odd)',
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, 1]',
    transverseProbe: 'central finite difference, h = ' + FD_H + ', in s_pass / s_shear; plus DEG forward diff',
    selfComputing: true,
  }),

  measured: Object.freeze({
    anchorProduct: ANCHOR_S,
    anchorBaselineRawOpNorm: anchorBaselineRaw,           // ~4.617013710 (matches imp-3066 / imp-35148)
    perClass: Object.freeze(measurements),                // raw ||R||, transverse gradient, signs, invariant rho
    baselineSignTriple: Object.freeze(baselineSignTriple), // [-1, +1, +1] = [pass, shear, DEG]
    anyClassOpensNewSoftening,                            // false -- THE VERDICT
    allSharePassNegative,                                 // true (pass-rate sign is softening-shaped everywhere)
    allShareShearPositive,                                // true
    allShareDegPositive,                                  // true (consistent with imp-35148)
    expRhoInvariant: expRhos[0],                          // 0.993354 (exp family, basis-invariant)
    polyRhoInvariant: polyRhos[0],                        // 0.685331 (poly family, basis-invariant)
    expRhoSpread,                                         // ~3e-13 (basis-invariance across mono/Leg/Cheb)
    polyRhoSpread,                                        // ~1e-13
    expRawSpread,                                         // ~2.5 (raw ||R|| spread = normalisation artifact)
    basisInvarianceHoldsWithinFamily,                    // true
  }),

  interpretation: Object.freeze({
    transverseSignPatternIsClassInvariant:
      'Every one of the five classes carries d||R||/ds_pass < 0, d||R||/ds_shear > 0, ' +
      'd||R||/dDEG > 0. The negative pass-rate direction is the only softening-shaped transverse ' +
      'sign, and it is ALREADY present in the baseline exp+monomial class -- swapping to an ' +
      'orthogonal basis or a non-exponential multiplier does not unlock any new off-orbit ' +
      'softening coordinate.',
    orthogonalBasisDropIsNormalisationArtifact:
      'The raw diagonal-normalised ||R|| falls sharply under an orthogonal basis (4.62 monomial ' +
      '-> 2.25 Legendre -> 2.07 Chebyshev), but the basis-INVARIANT generalised spectral radius ' +
      'rho(D^{-1}H) is exactly constant (0.993354 to ~3e-13) across those three bases. So the ' +
      'orthogonal-basis drop is an artifact of the imp-3066 diagonal-only normalisation rule, NOT ' +
      'a real softening of the underlying operator.',
    multiplierClassChangesInvariantNotSign:
      'Swapping the exponential multiplier for the non-exponential polynomial pair genuinely ' +
      'changes the basis-invariant rho (0.993354 -> 0.685331) -- it is a real class change, not a ' +
      'relabelling -- yet the transverse sign triple is UNCHANGED. A different admissible ' +
      'multiplier class rescales the obstruction magnitude without opening a softening direction.',
    verdict:
      'No probed non-monomial-basis or non-exponential-multiplier class opens an off-orbit ' +
      'softening direction that the imp-35148 exponential-shear monomial class lacks; the ' +
      'transverse sign structure is robust across all five classes. Measurement only; imp-3066 ' +
      'K_a >= 0 and G7 stay OPEN and untouched; establishes no operator positivity; changes no bound.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isMeasurementOnly: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    rawOpNormIsBasisDependentNotTheInvariant:
      'The RAW ||R|| is basis-dependent by the imp-3066 diagonal-only normalisation rule; a smaller ' +
      'raw ||R|| in an orthogonal basis is NOT a smaller obstruction -- the basis-invariant ' +
      'generalised spectral radius rho(D^{-1}H) is unchanged across bases within a multiplier family.',
    probedClassSetIsRepresentativeNotExhaustive:
      'Two orthogonal bases and one non-exponential even/odd multiplier pair were probed. ' +
      '"No softening direction" is scoped to these classes at this anchor; it does NOT claim to ' +
      'have swept all admissible kernel classes.',
    signPatternIsNotAnRHVerdict:
      'A class-invariant transverse sign pattern neither shows the imp-3066 cover fails nor that ' +
      'it holds; it only characterises the local off-orbit geometry of ||R||, not RH.',
    imp3066Untouched: true,
    imp33765Untouched: true,
    imp35075Untouched: true,
    imp35148Untouched: true,
    didNotAttemptPositivity: true,
    changesNoBound: true,
    sota: 'No refereed bound is changed',
    noQED: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP35189_G7_KERNEL_CLASS_SOFTENING_PROBE_ASSERTIONS = [
  {
    id: 'imp35189-baseline-matches-imp3066-anchor',
    why: 'The exp+monomial baseline raw ||R|| at the anchor must reproduce the roadmap ' +
         'imp-3066 / imp-35148 value ~4.617014; a mismatch means the generalised construction drifted.',
    holds: () => Math.abs(anchorBaselineRaw - 4.617014) < 1e-5,
  },
  {
    id: 'imp35189-all-five-classes-share-pass-negative-shear-positive-deg-positive',
    why: 'THE MEASUREMENT: every probed class carries d||R||/ds_pass < 0, d||R||/ds_shear > 0, ' +
         'd||R||/dDEG > 0 -- the transverse sign triple is class-invariant.',
    holds: () => allSharePassNegative && allShareShearPositive && allShareDegPositive,
  },
  {
    id: 'imp35189-no-alternate-class-opens-a-new-softening-direction',
    why: 'THE VERDICT: no basis swap or multiplier-class swap flips a transverse coordinate that ' +
         'the baseline exp+monomial class does not already carry, so no alternate class opens a new ' +
         'off-orbit softening direction.',
    holds: () => anyClassOpensNewSoftening === false,
  },
  {
    id: 'imp35189-orthogonal-basis-drop-is-a-normalisation-artifact',
    why: 'The raw ||R|| spread across the three exponential bases is large (~2.5) while the ' +
         'basis-invariant generalised spectral radius is constant to ~1e-9 -- so the orthogonal ' +
         'basis drop is a diagonal-normalisation artifact, not a softening of the operator.',
    holds: () => basisInvarianceHoldsWithinFamily && expRawSpread > 1 &&
                 Math.abs(expRhos[0] - 0.993354) < 1e-5,
  },
  {
    id: 'imp35189-multiplier-class-change-moves-the-invariant',
    why: 'Swapping the exponential multiplier for the non-exponential polynomial pair is a genuine ' +
         'class change: the basis-invariant rho moves 0.993354 -> 0.685331, confirming the probe ' +
         'exercises a real non-exponential class rather than a relabelling.',
    holds: () => Math.abs(polyRhos[0] - 0.685331) < 1e-5 &&
                 Math.abs(expRhos[0] - polyRhos[0]) > 0.1,
  },
  {
    id: 'imp35189-honest-measurement-not-a-verdict',
    why: 'Mandatory honesty: representative (not exhaustive) class set on the inherited surrogate, ' +
         'raw ||R|| basis-dependent (invariant rho is the comparable object), sign pattern carries ' +
         'no RH verdict, imp-3066 / imp-33765 / imp-35075 / imp-35148 / G7 untouched, positivity ' +
         'not attempted, changes no bound, not a proof, no refereed bound is changed.',
    holds: () => {
      const c = IMP35189_G7_KERNEL_CLASS_SOFTENING_PROBE.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isMeasurementOnly === true &&
        c.isRepresentativeTruncationNotTheSection26Gram === true &&
        c.imp3066Untouched === true &&
        c.imp35148Untouched === true &&
        c.didNotAttemptPositivity === true &&
        c.changesNoBound === true &&
        c.noQED === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP35189_G7_KERNEL_CLASS_SOFTENING_PROBE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35189-g7-kernel-class-softening-probe assertion failed: ${assertion.id}`);
  }
}

export default IMP35189_G7_KERNEL_CLASS_SOFTENING_PROBE;
