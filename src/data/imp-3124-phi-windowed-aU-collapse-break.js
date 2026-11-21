/**
 * @module imp-3124-phi-windowed-aU-collapse-break
 * @fileoverview imp-3124 -- TEST whether the imp-3085 exact s = a*U scale collapse
 *   BREAKS once the bare hyperbolic weight is replaced by a Phi-windowed proxy that
 *   carries its OWN intrinsic length scale, as imp-3110 survivesSwap DERIVES it must.
 *
 *   THE imp-3110 DERIVATION THIS MODULE PUTS TO THE TEST
 *   ---------------------------------------------------
 *   imp-3085 found that the imp-3066 de-homogenized operator/diagonal gap
 *   ||R|| - max_j R_jj depends on a and U ONLY through the single product s = a*U:
 *   substituting tau = U*x gives D_jj = U int_0^1 cosh(s*x) x^{2j} dx and
 *   H_jk = U int_0^1 sinh(s*x) x^{j+k} dx, so the shared U prefactor cancels in the
 *   de-homogenized R_jk = H_jk / sqrt(D_jj D_kk) and equal-product cells coincide to
 *   machine precision ((0.5,6) and (0.3,10) both give gap 3.6260954). imp-3110
 *   survivesSwap DERIVES this clean s = a*U collapse is a TOY ARTIFACT of the JOINT
 *   homogeneity of the monomial basis AND the bare hyperbolic weight under
 *   (a, U) -> (lambda*a, U/lambda); the genuine section-26 passive/shear densities are
 *   Phi-windowed (the completed Riemann kernel Phi has its own intrinsic scale and is
 *   NOT scale-homogeneous), so the collapse should NOT carry over. This module is the
 *   empirical companion that MEASURES the break.
 *
 *   THE PROBE (the imp-3124 deliverable -- MEASURE ONLY)
 *   ---------------------------------------------------
 *   Keep the SAME degree-DEG monomial truncation phi_j(tau) = (tau/U)^j as imp-3066,
 *   but multiply the passive and shear moment weights by a Phi-proxy WINDOW W(tau) with
 *   a FIXED intrinsic scale SIGMA (a Gaussian W(tau) = exp(-(tau/SIGMA)^2), a clean
 *   surrogate for the super-exponentially small completed kernel Phi). Now
 *       D_jj = int_0^U cosh(a*tau) W(tau) (tau/U)^{2j} d(tau)
 *            = U int_0^1 cosh(s*x) W(U*x) x^{2j} dx,
 *       H_jk = U int_0^1 sinh(s*x) W(U*x) x^{j+k} dx,   s = a*U.
 *   The GLOBAL U prefactor still cancels in R_jk = H_jk / sqrt(D_jj D_kk), but the
 *   window argument W(U*x) = exp(-(U*x/SIGMA)^2) depends on U DIRECTLY -- not on the
 *   product s alone. So two equal-product cells with DIFFERENT U (e.g. (0.5,6) and
 *   (0.3,10), both s = 3) now see DIFFERENT windows W(6*x) vs W(10*x): the s = a*U
 *   invariance is BROKEN. The fixed scale SIGMA is exactly the symmetry-breaking
 *   ingredient imp-3110 named.
 *
 *   WHAT IS MEASURED
 *   ----------------
 *   (1) THE BARE CONTROL (W == 1, SIGMA = infinity). Reproduces imp-3085 EXACTLY:
 *       equal-product cells coincide to ~1e-15, the collapse holds. This validates the
 *       harness so the measured break below is attributable to the window, not a bug.
 *   (2) THE Phi-WINDOWED BREAK (headline SIGMA = 6, an intrinsic scale comparable to
 *       the lag windows). The (0.5,6) vs (0.3,10) equal-product gap now SPLITS by
 *       ~0.246 (gap 3.5047 vs 3.2588) -- a residual a*U-collapse violation about 14
 *       ORDERS of magnitude larger than the bare ~1e-15. The collapse is destroyed.
 *   (3) THE RESTORATION CONTROL (SIGMA sweep). As SIGMA grows the window flattens to 1
 *       and the violation decays monotonically back toward 0 (|dgap| 0.498 at SIGMA=4,
 *       0.246 at SIGMA=6, 0.080 at SIGMA=10, 0.018 at SIGMA=20), confirming the break
 *       is caused SPECIFICALLY by the finite intrinsic scale, and the imp-3085 collapse
 *       is recovered in the scale-free limit.
 *   (4) THE OBSTRUCTION-EXISTENCE SURVIVES (consistency with imp-3110). On EVERY cell
 *       the windowed shear weight sinh(a*tau) W(tau) stays strictly positive, so R keeps
 *       strictly-positive off-diagonals and Perron-Frobenius keeps a strictly-positive
 *       gap with max_j R_jj < 1: only the SCALE COLLAPSE breaks, the strictly-positive
 *       gap EXISTENCE does not -- exactly the imp-3110 survivesSwap split.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   STRUCTURAL / DIAGNOSTIC on the SAME representative monomial truncation as imp-3066,
 *   with a GAUSSIAN Phi-proxy window -- NOT the genuine completed Riemann kernel and NOT
 *   the section-26 Gram. It confirms the imp-3110 DERIVATION that the s = a*U collapse is
 *   a toy artifact of the scale-homogeneous bare weight; it does NOT compute the real
 *   object, does NOT attempt positivity, carries NO RH verdict, and is NOT a reduction.
 *   The bare-V pilot is not re-run. No refereed bound is changed
 *   . No false QED.
 *
 *   @see imp-3085-hankel-gap-aU-grid.js               (the a*U collapse this probes)
 *   @see imp-3110-section26-gram-vs-monomial-gap.js   (survivesSwap: the collapse is a toy artifact)
 *   @see imp-3066-offdiagonal-hankel-obstruction.js   (the single-cell gap construction)
 *
 *   Ticket: imp-3124 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const A_GRID = Object.freeze([0.5, 0.3, 0.2, 0.1]);   // shear weights (imp-3066 headline a = 0.5)
const U_GRID = Object.freeze([4, 6, 8, 10]);          // lag cutoffs (imp-3066 headline U = 6)
const DEG = 4;                                         // same representative (DEG+1) x (DEG+1) truncation
const NQ = 4000;                                       // midpoint quadrature panels for the Gram moments
const HEADLINE_SIGMA = 6;                              // intrinsic Phi-proxy scale comparable to the lag windows

const cosh = Math.cosh;
const sinh = Math.sinh;

/** Gaussian Phi-proxy window with a FIXED intrinsic scale sigma (sigma = Infinity => bare weight W == 1). */
function gaussianWindow(sigma) {
  if (!Number.isFinite(sigma)) return () => 1;
  return (tau) => Math.exp(-(tau / sigma) * (tau / sigma));
}

/** Midpoint quadrature of int_0^U weightFn(a*tau) * window(tau) * (tau/U)^p d(tau) on the lag tau. */
function weightedMoment(weightFn, window, a, U, p) {
  const hq = U / NQ;
  let acc = 0;
  for (let k = 0; k < NQ; k++) {
    const tau = (k + 0.5) * hq;
    acc += weightFn(a * tau) * window(tau) * Math.pow(tau / U, p) * hq;
  }
  return acc;
}

/**
 * Classic cyclic Jacobi eigenvalues for a small SYMMETRIC matrix (self-contained).
 * Identical routine to imp-3066/imp-3085 so the per-cell gap is computed the same way.
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

/** One (a, U) cell with a given Phi-proxy window: build R exactly as imp-3085 and measure its gap. */
function cellMetrics(a, U, sigma) {
  const window = gaussianWindow(sigma);
  const Ddiag = Array.from({ length: DEG + 1 }, (_u, j) => weightedMoment(cosh, window, a, U, 2 * j));
  const Hshear = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => weightedMoment(sinh, window, a, U, j + k)),
  );
  const R = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => Hshear[j][k] / Math.sqrt(Ddiag[j] * Ddiag[k])),
  );
  const eigenvalues = symmetricEigenvalues(R);
  const opNorm = Math.max(...eigenvalues.map((e) => Math.abs(e)));
  const diagR = R.map((row, i) => row[i]);
  const rDiagMax = Math.max(...diagR);
  let minOffDiagR = Infinity;
  for (let j = 0; j <= DEG; j++) {
    for (let k = 0; k <= DEG; k++) {
      if (j === k) continue;
      if (R[j][k] < minOffDiagR) minOffDiagR = R[j][k];
    }
  }
  return Object.freeze({
    a,
    U,
    s: a * U,
    sigma,
    operatorNorm: opNorm,
    rDiagMax,
    operatorDiagonalGap: opNorm - rDiagMax,
    minOffDiagonalR: minOffDiagR,
    rDiagMaxBelowOne: rDiagMax < 1,
  });
}

// The headline equal-product pair, both s = a*U = 3, at distinct U (6 vs 10).
const PAIR_A = Object.freeze([0.5, 6]);
const PAIR_B = Object.freeze([0.3, 10]);

// (1) BARE CONTROL (W == 1): reproduces the imp-3085 collapse to machine precision.
const bareA = cellMetrics(PAIR_A[0], PAIR_A[1], Infinity);
const bareB = cellMetrics(PAIR_B[0], PAIR_B[1], Infinity);
const bareGapMismatch = Math.abs(bareA.operatorDiagonalGap - bareB.operatorDiagonalGap);

// (2) Phi-WINDOWED BREAK (headline SIGMA): the equal-product cells SPLIT.
const windowedA = cellMetrics(PAIR_A[0], PAIR_A[1], HEADLINE_SIGMA);
const windowedB = cellMetrics(PAIR_B[0], PAIR_B[1], HEADLINE_SIGMA);
const windowedGapMismatch = Math.abs(windowedA.operatorDiagonalGap - windowedB.operatorDiagonalGap);

// (3) RESTORATION CONTROL: violation vs SIGMA -- decays monotonically to 0 as SIGMA -> infinity.
const SIGMA_SWEEP = Object.freeze(
  [4, 6, 10, 20].map((sigma) => {
    const cA = cellMetrics(PAIR_A[0], PAIR_A[1], sigma);
    const cB = cellMetrics(PAIR_B[0], PAIR_B[1], sigma);
    return Object.freeze({
      sigma,
      gapA: cA.operatorDiagonalGap,
      gapB: cB.operatorDiagonalGap,
      collapseViolation: Math.abs(cA.operatorDiagonalGap - cB.operatorDiagonalGap),
    });
  }),
);

// The violation must shrink as the intrinsic scale grows (window -> 1, collapse restored).
let violationDecaysWithSigma = true;
for (let i = 1; i < SIGMA_SWEEP.length; i++) {
  if (SIGMA_SWEEP[i].collapseViolation >= SIGMA_SWEEP[i - 1].collapseViolation) {
    violationDecaysWithSigma = false;
  }
}

// (4) OBSTRUCTION-EXISTENCE SURVIVES the window on the full a x U grid (headline SIGMA).
const WINDOWED_GRID = Object.freeze(
  A_GRID.flatMap((a) => U_GRID.map((U) => cellMetrics(a, U, HEADLINE_SIGMA))),
);

export const IMP3124_PHI_WINDOWED_AU_COLLAPSE_BREAK = Object.freeze({
  id: 'imp-3124-phi-windowed-aU-collapse-break',
  ticket: 'imp-3124',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  probesScaleInvariant: 'imp-3085-hankel-gap-aU-grid.js',
  testsDerivation: 'imp-3110-section26-gram-vs-monomial-gap.js (survivesSwap)',

  summary:
    'Empirically TESTS the imp-3110 survivesSwap DERIVATION that the imp-3085 exact s = a*U scale ' +
    'collapse is a TOY ARTIFACT of the scale-homogeneous bare hyperbolic weight. Keeps the SAME ' +
    'degree-4 monomial truncation but multiplies the cosh/sinh moment weights by a Gaussian Phi-proxy ' +
    'window W(tau) = exp(-(tau/SIGMA)^2) carrying a FIXED intrinsic scale SIGMA. The global U prefactor ' +
    'still cancels in R_jk = H_jk/sqrt(D_jj D_kk), but W(U*x) depends on U directly, so equal-product ' +
    'cells (0.5,6) and (0.3,10) (both s = a*U = 3) now see different windows and the collapse BREAKS. ' +
    'Bare control (W == 1): gap mismatch ~1e-15 (imp-3085 reproduced). Phi-windowed (SIGMA = 6): the ' +
    'equal-product gap SPLITS by ~0.246 (3.5047 vs 3.2588), ~14 orders larger. A SIGMA sweep shows the ' +
    'violation decays monotonically to 0 as SIGMA -> infinity (0.498 -> 0.246 -> 0.080 -> 0.018 at ' +
    'SIGMA 4,6,10,20), so the break is caused SPECIFICALLY by the finite intrinsic scale. The strictly-' +
    'positive operator/diagonal gap EXISTENCE survives on every windowed cell -- only the scale collapse ' +
    'breaks, exactly the imp-3110 survivesSwap split. REPRESENTATIVE/DIAGNOSTIC; Gaussian proxy, not the ' +
    'genuine kernel; NO RH verdict; not a proof.',

  construction: Object.freeze({
    inheritedFrom: 'imp-3085-hankel-gap-aU-grid.js (same phi_j = (tau/U)^j truncation, same Jacobi solver)',
    phiProxyWindow: 'W(tau) = exp(-(tau/SIGMA)^2), a Gaussian surrogate for the super-exponentially small completed kernel Phi',
    windowedR: 'R_jk = H_jk/sqrt(D_jj D_kk), D_jj = int cosh(a*tau) W(tau)(tau/U)^{2j}, H_jk = int sinh(a*tau) W(tau)(tau/U)^{j+k}',
    scaleBreak: 'tau = U*x => R depends on W(U*x) = exp(-(U*x/SIGMA)^2) which carries U directly, NOT s = a*U alone (the global U still cancels)',
    headlineSigma: HEADLINE_SIGMA,
    equalProductPair: 'cellA = (a,U) = (0.5,6), cellB = (0.3,10), both s = a*U = 3',
    aGrid: A_GRID,
    uGrid: U_GRID,
    degree: DEG,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    bareControl: Object.freeze({
      note: 'W == 1 (SIGMA = infinity): the imp-3085 bare weight; collapse must hold to machine precision.',
      gapA: bareA.operatorDiagonalGap,
      gapB: bareB.operatorDiagonalGap,
      collapseViolation: bareGapMismatch,
    }),
    phiWindowedBreak: Object.freeze({
      note: 'Gaussian Phi-proxy window at the headline intrinsic scale; the equal-product gap SPLITS.',
      sigma: HEADLINE_SIGMA,
      gapA: windowedA.operatorDiagonalGap,
      gapB: windowedB.operatorDiagonalGap,
      collapseViolation: windowedGapMismatch,
      violationAmplificationVsBare: windowedGapMismatch / Math.max(bareGapMismatch, Number.MIN_VALUE),
    }),
    sigmaSweep: SIGMA_SWEEP,                       // violation vs SIGMA: shrinks toward 0 as SIGMA -> infinity
    violationDecaysWithSigma,                      // monotone restoration of the collapse in the scale-free limit
    windowedGrid: WINDOWED_GRID,                   // every windowed (a,U) cell still carries a strictly-positive gap
  }),

  interpretation: Object.freeze({
    collapseBreaks:
      'Replacing the scale-homogeneous bare weight with a Phi-proxy window that has a FIXED intrinsic ' +
      'scale SIGMA breaks the imp-3085 exact s = a*U collapse: equal-product cells (0.5,6) and (0.3,10), ' +
      'identical under the bare weight to ~1e-15, split by ~0.246 once windowed. The window argument ' +
      'W(U*x) carries U directly, so the de-homogenized R is no longer a function of s = a*U alone.',
    breakIsCausedByTheIntrinsicScale:
      'The SIGMA sweep isolates the cause: the collapse violation decays monotonically to 0 as SIGMA -> ' +
      'infinity (the window flattens to 1 and the imp-3085 invariance is recovered). The break is therefore ' +
      'attributable SPECIFICALLY to the finite intrinsic scale, confirming the imp-3110 derivation.',
    existenceSurvives:
      'Only the SCALE COLLAPSE is fragile. The windowed shear weight sinh(a*tau) W(tau) stays strictly ' +
      'positive, so R keeps strictly-positive off-diagonals and a strictly-positive operator/diagonal gap ' +
      'with max_j R_jj < 1 on every cell -- the strictly-positive gap EXISTENCE survives the swap, exactly ' +
      'the imp-3110 survivesSwap split (existence structural, the clean a*U invariance a toy artifact).',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    usesGaussianProxyNotGenuineKernel: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    confirmsImp3110Derivation:
      'Empirically confirms the imp-3110 survivesSwap claim that the imp-3085 s = a*U collapse is a toy ' +
      'artifact of the joint homogeneity of the monomial basis and the bare hyperbolic weight; a Phi-proxy ' +
      'window with an intrinsic scale breaks it while the strictly-positive gap existence survives.',
    didNotComputeGenuineSection26Gram: true,
    didNotAttemptPositivity: true,
    didNotRerunBarePilot: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3124_PHI_WINDOWED_AU_COLLAPSE_BREAK_ASSERTIONS = [
  {
    id: 'imp3124-bare-control-reproduces-imp3085-collapse',
    why: 'Harness validation: with W == 1 (SIGMA = infinity) the construction is exactly imp-3085, so the ' +
         'equal-product cells (0.5,6) and (0.3,10) must coincide to machine precision. If the bare control ' +
         'already split, the measured windowed break would be a bug, not a finding.',
    holds: () => bareGapMismatch < 1e-9,
  },
  {
    id: 'imp3124-phi-window-breaks-the-aU-collapse',
    why: 'THE FINDING: a Phi-proxy window with a fixed intrinsic scale destroys the s = a*U collapse. The ' +
         'equal-product gap mismatch must jump from the bare ~1e-15 to an O(0.1) split -- the residual ' +
         'a*U-collapse violation imp-3110 survivesSwap predicted.',
    holds: () => windowedGapMismatch > 0.05 && windowedGapMismatch > 1e6 * bareGapMismatch,
  },
  {
    id: 'imp3124-violation-decays-as-intrinsic-scale-grows',
    why: 'The RESTORATION control: the collapse violation must shrink monotonically as SIGMA grows (the ' +
         'window flattens to 1 and the imp-3085 invariance is recovered), pinning the break to the finite ' +
         'intrinsic scale rather than to an unrelated numerical artifact.',
    holds: () => violationDecaysWithSigma && SIGMA_SWEEP[SIGMA_SWEEP.length - 1].collapseViolation < 0.05,
  },
  {
    id: 'imp3124-strictly-positive-gap-existence-survives-the-window',
    why: 'imp-3110 survivesSwap split: only the SCALE COLLAPSE breaks, the strictly-positive operator/' +
         'diagonal gap EXISTENCE does not. Every windowed cell must keep a strictly-positive gap with ' +
         'strictly-positive off-diagonal R and max_j R_jj < 1.',
    holds: () =>
      WINDOWED_GRID.length === A_GRID.length * U_GRID.length &&
      WINDOWED_GRID.every(
        (c) => c.operatorDiagonalGap > 1e-9 && c.minOffDiagonalR > 0 && c.rDiagMaxBelowOne,
      ),
  },
  {
    id: 'imp3124-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: a representative diagnostic with a GAUSSIAN proxy (not the genuine kernel, ' +
         'not the section-26 Gram), no positivity attempt, no RH verdict, not a proof or reduction, no refereed bound is changed' +
         '. If any of these flip the module is over-claiming.',
    holds: () => {
      const c = IMP3124_PHI_WINDOWED_AU_COLLAPSE_BREAK.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.usesGaussianProxyNotGenuineKernel === true &&
        c.isRepresentativeTruncationNotTheSection26Gram === true &&
        c.didNotComputeGenuineSection26Gram === true &&
        c.didNotAttemptPositivity === true &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3124_PHI_WINDOWED_AU_COLLAPSE_BREAK_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3124-phi-windowed-aU-collapse-break assertion failed: ${assertion.id}`);
  }
}

export default IMP3124_PHI_WINDOWED_AU_COLLAPSE_BREAK;
