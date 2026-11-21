/**
 * @module imp-33789-decoupled-rate-grid
 * @fileoverview imp-33789 -- MAP the imp-33765 DECOUPLED pass/shear-rate grid
 *   ||R||(s_a, s_b) and LOCATE, for each shear rate s_a, the ratio s_b/s_a at which the
 *   Perron norm ||R|| crosses 1. Direct follow-on to imp-33765, whose orthogonal-lever
 *   probe (2)(ii) reported only THREE isolated decoupled-rate points at s_a = 3
 *   (||R|| = 20.94 at s_b = 1, 4.617 at the coupled anchor s_b = 3, 0.338 at s_b = 6)
 *   and never mapped the full grid nor located the positivity-relevant ||R|| = 1 contour.
 *
 *   THE GAP THIS FILLS (the imp-33789 ticket)
 *   -----------------------------------------
 *   imp-33765 established that DECOUPLING the pass rate s_b (the even/cosh normaliser rate)
 *   from the shear rate s_a (the odd/sinh off-diagonal rate) IS a genuine softening lever:
 *   at fixed s_a the norm ||R|| strictly decreases as s_b rises. But it left the lever
 *   UNQUANTIFIED -- three points on one s_a slice, no contour. This module measures the
 *   two-parameter grid and bisects, for each s_a, the crossing pass rate s_b* at which
 *   ||R||(s_a, s_b*) = 1, reporting the ratio s_b* over s_a: how far above the shear rate the
 *   (inadmissible) decoupling lever must push the pass rate to drive the obstruction norm
 *   through unity.
 *
 *   THE DECOUPLED PROBE (inherited verbatim from imp-33765)
 *   ------------------------------------------------------
 *   On the representative degree-DEG monomial truncation phi_j(tau) = (tau/U)^j, with
 *   tau = U*x mapping both integrands onto [0,1] (the shared U prefactor cancels, so R
 *   depends only on the products s_a = a*U, s_b = b*U -- we set U = 1):
 *       D_jj = int_0^1 cosh(s_b * x) x^{2j} dx        (PASS form,  rate b, even part),
 *       H_jk = int_0^1 sinh(s_a * x) x^{j+k} dx       (SHEAR form, rate a, odd part),
 *       R_jk = H_jk / sqrt(D_jj D_kk),   ||R|| = Perron eigenvalue (max |eig|).
 *   The ADMISSIBLE imp-3066 kernel is the diagonal slice s_a = s_b = s (a single
 *   exponential e^{a*tau} split into its even/odd parts). Decoupling s_a != s_b BREAKS the
 *   shared-rate exponential and is therefore a DIAGNOSTIC device, not an admissible
 *   modification of imp-3066.
 *
 *   WHAT IS MEASURED (the imp-33789 deliverable -- MEASURE ONLY)
 *   -----------------------------------------------------------
 *   (1) THE GRID. ||R||(s_a, s_b) across s_a in {1,2,3,4,6,8} and s_b spanning
 *       0.25*s_a .. 3*s_a. At fixed s_a the norm falls MONOTONICALLY as s_b rises; at fixed
 *       s_b < s_a it grows without bound in s_a (steeper shear, softer normaliser). The
 *       s_a = 3 row reproduces the three imp-33765 anchor points to full precision.
 *   (2) THE ||R|| = 1 CONTOUR. For each s_a there is a UNIQUE crossing pass rate s_b* with
 *       ||R||(s_a, s_b*) = 1, located by bisection. The crossing ALWAYS satisfies
 *       s_b* > s_a: the pass rate must OVERSHOOT the shear rate to soften the norm below
 *       unity (at the coupled anchor s_b = s_a the norm is 3.02 .. 4.91, always > 1).
 *   (3) THE RATIO TREND. The overshoot ratio s_b* over s_a SHRINKS monotonically as the shear
 *       stiffens: 2.526 (s_a=1) -> 1.592 (s_a=3) -> 1.216 (s_a=8), approaching but never
 *       reaching parity (ratio -> 1+). So the softening lever costs less overshoot at large
 *       shear, yet the pass rate must ALWAYS exceed the shear rate -- decoupling with
 *       s_b <= s_a never drives ||R|| below 1.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   DIAGNOSTIC device on the SAME representative monomial truncation as imp-3066 /
 *   imp-33704 / imp-33725 / imp-33765 -- the decoupled probe DELIBERATELY breaks the
 *   exponential shear and is NOT an admissible modification of imp-3066. The measured
 *   contour carries NO RH verdict; it merely quantifies how far the inadmissible pass/shear
 *   decoupling lever must reach to push ||R|| through unity. K_a >= 0 was NOT attempted;
 *   imp-3066 / imp-33704 / imp-33725 / imp-33765 / G7 remain UNTOUCHED as proofs; positivity
 *   was not attempted; this is not a proof or a reduction; no refereed bound is changed
 *   . No false QED.
 *
 *   @see imp-33765-g7-obstruction-orthogonal-lever.js (imp-33765: the orthogonal-lever probe)
 *   @see imp-33725-g7-obstruction-a-scaling.js (imp-33725: the a-scaling one-dimensionality)
 *   @see imp-3107-dehomogenized-offdiag-aU-grid.js (imp-3107: the de-homogenized off-diag grid)
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (imp-3066: the single-cell obstruction)
 *
 *   Ticket: imp-33789 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const DEG = 4;      // same representative (DEG+1) x (DEG+1) truncation as imp-3066 / imp-33765
const NQ = 4000;    // midpoint quadrature panels (matches imp-3066 / imp-33725 / imp-33765)

const cosh = Math.cosh;
const sinh = Math.sinh;

/** x-domain moment: int_0^1 weightFn(s*x) * x^p dx (the de-homogenised imp-33765 integrand). */
function moment(weightFn, s, p) {
  const hq = 1 / NQ;
  let acc = 0;
  for (let k = 0; k < NQ; k++) {
    const x = (k + 0.5) * hq;
    acc += weightFn(s * x) * Math.pow(x, p) * hq;
  }
  return acc;
}

/**
 * Classic cyclic Jacobi eigenvalues for a small SYMMETRIC matrix (self-contained, no deps).
 * Copied verbatim from imp-3066 / imp-33704 / imp-33725 / imp-33765 so the modules read the
 * SAME spectrum.
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

/**
 * The DECOUPLED-rate Perron norm: PASS form at rate sPass = s_b, SHEAR form at rate
 * sShear = s_a. The ADMISSIBLE imp-3066 kernel is the diagonal slice sPass = sShear.
 */
function perronNorm(sShear, sPass) {
  const Ddiag = Array.from({ length: DEG + 1 }, (_u, j) => moment(cosh, sPass, 2 * j));
  const Hshear = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => moment(sinh, sShear, j + k)),
  );
  const R = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => Hshear[j][k] / Math.sqrt(Ddiag[j] * Ddiag[k])),
  );
  const eig = symmetricEigenvalues(R);
  return Math.max(...eig.map((e) => Math.abs(e)));
}

/**
 * For a fixed shear rate s_a, ||R|| is monotone DECREASING in the pass rate s_b (a stiffer
 * even normaliser damps the de-homogenised shear). Bisect for the s_b* where ||R|| = 1.
 */
function crossingPassRate(sShear) {
  let lo = 1e-6;              // ||R|| large here
  let hi = 60 * sShear;      // ||R|| small here
  const flo = perronNorm(sShear, lo) - 1;
  const fhi = perronNorm(sShear, hi) - 1;
  if (!(flo > 0 && fhi < 0)) return null; // no bracketed crossing
  for (let it = 0; it < 100; it++) {
    const mid = 0.5 * (lo + hi);
    const fm = perronNorm(sShear, mid) - 1;
    if (fm > 0) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

// -- The imp-33765 anchor slice: three decoupled points at s_a = 3 -----------------------------
const ANCHOR_S = 3;
const anchorNorm = perronNorm(ANCHOR_S, ANCHOR_S);            // ~ 4.617014 (the coupled anchor)
const DECOUPLED_ANCHOR_POINTS = Object.freeze([
  Object.freeze({ sShear: 3, sPass: 1, operatorNorm: perronNorm(3, 1) }),   // ~ 20.94
  Object.freeze({ sShear: 3, sPass: 3, operatorNorm: perronNorm(3, 3) }),   // ~ 4.617 (anchor)
  Object.freeze({ sShear: 3, sPass: 6, operatorNorm: perronNorm(3, 6) }),   // ~ 0.338
]);

// -- The two-parameter grid ||R||(s_a, s_b) ----------------------------------------------------
const S_A_GRID = Object.freeze([1, 2, 3, 4, 6, 8]);
const S_B_MULTIPLIERS = Object.freeze([0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3]);
const GRID = Object.freeze(
  S_A_GRID.map((sShear) =>
    Object.freeze({
      sShear,
      row: Object.freeze(
        S_B_MULTIPLIERS.map((mult) =>
          Object.freeze({ ratio: mult, sPass: mult * sShear, operatorNorm: perronNorm(sShear, mult * sShear) }),
        ),
      ),
    }),
  ),
);

// -- The ||R|| = 1 contour: crossing pass rate s_b* and overshoot ratio s_b*/s_a per shear ------
const CONTOUR = Object.freeze(
  S_A_GRID.map((sShear) => {
    const sPassStar = crossingPassRate(sShear);
    return Object.freeze({
      sShear,
      crossingPassRate: sPassStar,
      overshootRatio: sPassStar / sShear,
      coupledAnchorNorm: perronNorm(sShear, sShear),
    });
  }),
);

// Every crossing overshoots (s_b* > s_a) and the coupled anchor sits above 1.
const everyCrossingOvershoots = CONTOUR.every((c) => c.overshootRatio > 1);
const everyCoupledAnchorAboveOne = CONTOUR.every((c) => c.coupledAnchorNorm > 1);
// The overshoot ratio shrinks monotonically as the shear stiffens (s_a rises).
let overshootRatioShrinksMonotonically = true;
for (let i = 1; i < CONTOUR.length; i++) {
  if (CONTOUR[i].overshootRatio >= CONTOUR[i - 1].overshootRatio) overshootRatioShrinksMonotonically = false;
}
const ratios = CONTOUR.map((c) => c.overshootRatio);
const overshootRatioMin = Math.min(...ratios);
const overshootRatioMax = Math.max(...ratios);

export const IMP33789_DECOUPLED_RATE_GRID = Object.freeze({
  id: 'imp-33789-decoupled-rate-grid',
  ticket: 'imp-33789',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedOrthogonalLever: 'imp-33765-g7-obstruction-orthogonal-lever.js',
  relatedAScaling: 'imp-33725-g7-obstruction-a-scaling.js',
  relatedOffDiagGrid: 'imp-3107-dehomogenized-offdiag-aU-grid.js',
  relatedObstruction: 'imp-3066-offdiagonal-hankel-obstruction.js',
  roadmapNode: 'G7',

  summary:
    'Maps the imp-33765 decoupled pass/shear-rate grid ||R||(s_a, s_b) and locates, for each ' +
    'shear rate s_a, the crossing pass rate s_b* where the Perron norm ||R|| = 1. The overshoot ' +
    'ratio s_b*/s_a is ALWAYS > 1 (the inadmissible decoupling must push the pass rate above the ' +
    'shear rate to soften ||R|| below unity) and SHRINKS monotonically as the shear stiffens: ' +
    '2.526 (s_a=1) -> 1.592 (s_a=3) -> 1.216 (s_a=8), approaching but never reaching parity. ' +
    'Diagnostic device (breaks the exponential shear, per imp-33765); no RH verdict; no refereed bound is changed.',

  construction: Object.freeze({
    degree: DEG,
    quadraturePanels: NQ,
    passForm: 'D_jj = int_0^1 cosh(s_b*x) x^{2j} dx (even/pass, rate b, s_b = b*U)',
    shearForm: 'H_jk = int_0^1 sinh(s_a*x) x^{j+k} dx (odd/shear, rate a, s_a = a*U)',
    normalisedKernel: 'R_jk = H_jk / sqrt(D_jj D_kk); ||R|| = max |eig(R)|',
    admissibleSlice: 's_a = s_b = s (single exponential e^{a*tau}); decoupling s_a != s_b is inadmissible',
  }),

  measured: Object.freeze({
    anchorCoupledNorm: anchorNorm,
    decoupledAnchorPoints: DECOUPLED_ANCHOR_POINTS,
    grid: GRID,
    contour: CONTOUR,
    everyCrossingOvershoots,
    everyCoupledAnchorAboveOne,
    overshootRatioShrinksMonotonically,
    overshootRatioMin,
    overshootRatioMax,
  }),

  interpretation: Object.freeze({
    theLever:
      'Decoupling the pass rate s_b from the shear rate s_a IS the only continuous softening ' +
      'lever off the s = a*U axis (imp-33765). This module quantifies its reach.',
    theContour:
      'For every s_a there is a unique s_b* with ||R|| = 1, and s_b* > s_a: the pass rate must ' +
      'OVERSHOOT the shear rate. At the coupled anchor s_b = s_a the norm stays 3.02 .. 4.91, so ' +
      'no shared-rate cell ever reaches unity.',
    theTrend:
      'The overshoot cost s_b*/s_a shrinks monotonically toward 1+ as the shear stiffens -- ' +
      'cheaper decoupling at large shear -- but never reaches parity, so s_b <= s_a NEVER drives ' +
      '||R|| below 1.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    decoupledProbeIsDiagnosticNotAdmissibleModification: true,
    imp3066Untouched: true,
    imp33725Untouched: true,
    imp33765Untouched: true,
    didNotAttemptKaNonnegativity: true,
    didNotAttemptPositivity: true,
    carriesNoRHVerdict: true,
    sota: 'No refereed bound is changed.',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP33789_DECOUPLED_RATE_GRID_ASSERTIONS = [
  {
    id: 'imp33789-anchor-matches-roadmap',
    why: 'Cross-check the coupled anchor s_a = s_b = 3 against imp-3066 / imp-33725 / imp-33765 / ' +
         'roadmap G7: ||R|| ~ 4.617014. A mismatch means the inherited decoupled construction drifted.',
    holds: () => Math.abs(anchorNorm - 4.617014) < 1e-4,
  },
  {
    id: 'imp33789-reproduces-imp33765-anchor-slice',
    why: 'The three imp-33765 (2)(ii) decoupled points at s_a = 3 must reproduce: ||R|| ~ 20.94 ' +
         '(s_b=1), ~ 4.617 (s_b=3, the coupled anchor), ~ 0.338 (s_b=6). This anchors the whole grid.',
    holds: () =>
      Math.abs(DECOUPLED_ANCHOR_POINTS[0].operatorNorm - 20.9396) < 1e-2 &&
      Math.abs(DECOUPLED_ANCHOR_POINTS[1].operatorNorm - 4.617014) < 1e-4 &&
      Math.abs(DECOUPLED_ANCHOR_POINTS[2].operatorNorm - 0.338311) < 1e-4,
  },
  {
    id: 'imp33789-every-crossing-overshoots',
    why: 'THE MEASUREMENT (part 1): every ||R|| = 1 crossing satisfies s_b* > s_a -- the pass rate ' +
         'must OVERSHOOT the shear rate to push the norm below unity, and the coupled anchor ' +
         's_b = s_a stays above 1 for every s_a. Decoupling with s_b <= s_a never softens below 1.',
    holds: () => everyCrossingOvershoots && everyCoupledAnchorAboveOne,
  },
  {
    id: 'imp33789-overshoot-ratio-shrinks-monotonically',
    why: 'THE MEASUREMENT (part 2): the overshoot ratio s_b*/s_a shrinks monotonically as the shear ' +
         'stiffens (s_a rises), from ~ 2.526 at s_a = 1 to ~ 1.216 at s_a = 8 -- cheaper decoupling ' +
         'at large shear, approaching but not reaching parity.',
    holds: () =>
      overshootRatioShrinksMonotonically &&
      Math.abs(overshootRatioMax - 2.5257) < 1e-2 &&
      Math.abs(overshootRatioMin - 1.2160) < 1e-2,
  },
  {
    id: 'imp33789-grid-monotone-decreasing-in-pass-rate',
    why: 'THE MEASUREMENT (part 3): along every s_a row of the grid, ||R|| decreases monotonically ' +
         'as the pass rate s_b rises (a stiffer even normaliser damps the shear). A non-monotone ' +
         'row would break the unique-crossing bisection.',
    holds: () =>
      GRID.every((g) => {
        for (let i = 1; i < g.row.length; i++) {
          if (g.row[i].operatorNorm >= g.row[i - 1].operatorNorm) return false;
        }
        return true;
      }),
  },
  {
    id: 'imp33789-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: this is a REPRESENTATIVE measurement / diagnostic, the decoupled probe ' +
         'is a diagnostic device (not an admissible imp-3066 modification), ||R|| carries no RH ' +
         'verdict, imp-3066 / imp-33725 / imp-33765 / G7 are untouched, K_a >= 0 and positivity were ' +
         'not attempted, it is not a proof or a reduction, and no refereed bound is changed.',
    holds: () => {
      const c = IMP33789_DECOUPLED_RATE_GRID.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isRepresentativeTruncationNotTheSection26Gram === true &&
        c.decoupledProbeIsDiagnosticNotAdmissibleModification === true &&
        c.imp3066Untouched === true &&
        c.imp33725Untouched === true &&
        c.imp33765Untouched === true &&
        c.didNotAttemptKaNonnegativity === true &&
        c.didNotAttemptPositivity === true &&
        c.carriesNoRHVerdict === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33789_DECOUPLED_RATE_GRID_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33789-decoupled-rate-grid assertion failed: ${assertion.id}`);
  }
}

export default IMP33789_DECOUPLED_RATE_GRID;
