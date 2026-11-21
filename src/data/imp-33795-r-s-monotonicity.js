/**
 * @module imp-33795-r-s-monotonicity
 * @fileoverview imp-33795 -- MEASURE the imp-33765 s-monotonicity premise of the coupled Perron
 *   norm ||R(s)|| on a FINE s-grid at fixed truncation size DEG, confirm the curve is STRICTLY
 *   monotone increasing with NO interior turning point, and report the approach rate to the
 *   all-ones ceiling DEG+1 (the s at which ||R|| passes 1, and the tail slope of the ceiling gap).
 *
 *   THE GAP THIS FILLS (the imp-33795 ticket)
 *   -----------------------------------------
 *   imp-33765 repeatedly describes ||R|| as a "monotone-in-s curve" saturating the all-ones
 *   ceiling DEG+1 (citing imp-33704/imp-33725), and the whole one-dimensionality-in-s argument
 *   rests on that monotone single-parameter shape. Yet imp-33765 itself only sampled ||R|| at
 *   ISOLATED s values (the s = 3 anchor plus scaling-orbit checks), and imp-33791 measured only
 *   the DEG-dependence of the saturation SCALE s_90 -- neither swept a fine s-grid to VERIFY the
 *   monotone, turning-point-free shape the verdict assumes. This module does exactly that at the
 *   DEG = 4 anchor: it samples ||R||(s) on a fine grid s in [0.05, 20] (step 0.05, 400 points),
 *   checks strict monotonicity and the absence of any interior turning point, and characterises
 *   the approach to the ceiling.
 *
 *   THE COUPLED PROBE (admissible imp-3066 slice, identical to imp-33791)
 *   --------------------------------------------------------------------
 *   On the representative degree-DEG monomial truncation phi_j(tau) = (tau/U)^j, with tau = U*x
 *   mapping both integrands onto [0,1] (the shared U prefactor cancels, so R depends only on
 *   s = a*U -- we set U = 1):
 *       D_jj = int_0^1 cosh(s * x) x^{2j} dx        (PASS form,  even part),
 *       H_jk = int_0^1 sinh(s * x) x^{j+k} dx       (SHEAR form, odd part),
 *       R_jk = H_jk / sqrt(D_jj D_kk),   ||R|| = Perron eigenvalue (max |eig|).
 *   As s -> 0 the odd shear part vanishes so ||R|| -> 0; as s -> infinity both cosh and sinh
 *   concentrate at x = 1 where every monomial x^p -> 1, so R -> the all-ones matrix, whose Perron
 *   eigenvalue is EXACTLY DEG+1. The premise imp-33765 assumes is that the curve rises MONOTONE
 *   from 0 to that ceiling with no wobble.
 *
 *   WHAT IS MEASURED (the imp-33795 deliverable -- MEASURE ONLY)
 *   -----------------------------------------------------------
 *   (1) STRICT MONOTONICITY. On the fine grid every consecutive difference is strictly positive
 *       (smallest first-difference ~9.0e-5 > 0), and the number of interior turning points of the
 *       curve is EXACTLY 0. So ||R||(s) is a strictly increasing one-parameter curve -- the shape
 *       the imp-33765 one-dimensionality argument relies on, now verified on a fine grid.
 *   (2) THE SHAPE. The discrete derivative is largest near the origin and then decreases
 *       monotonically (0 sign-changes in its slope) -- the curve is CONCAVE on the measured range:
 *       it rises fastest at small s and bends over as it approaches the ceiling. No interior
 *       maximum, no inflection back-and-forth, no non-monotone region.
 *   (3) THE UNIT CROSSING. ||R|| passes 1 at s_cross ~ 0.279399 (by bisection on the monotone
 *       curve); at the imp-3066/imp-33765 anchor s = 3 the norm is already ~4.617014, i.e. ~92.3%
 *       of the DEG = 4 ceiling 5.
 *   (4) THE TAIL / APPROACH RATE. The ceiling gap g(s) = (DEG+1) - ||R||(s) shrinks like an
 *       exponential: log g(s) is nearly linear on s in [10, 20] with slope ~ -0.1165 per unit s
 *       (the gap falls from ~0.0646 at s = 10 to ~0.0202 at s = 20, a factor ~3.2). So the
 *       monotone curve approaches its all-ones ceiling from below at an exponential-like rate.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   DIAGNOSTIC measurement on the SAME representative monomial truncation as imp-3066 /
 *   imp-33704 / imp-33725 / imp-33765 / imp-33791 -- NOT the section-26 Gram. Confirming the
 *   monotone, turning-point-free shape VALIDATES the premise the imp-33765 verdict rests on but
 *   carries NO RH verdict and discharges nothing: K_a >= 0 was NOT attempted; imp-3066 /
 *   imp-33704 / imp-33725 / imp-33765 / G7 remain UNTOUCHED as proofs; positivity was not
 *   attempted; this is not a proof or a reduction; no refereed bound is changed
 *   . No false QED.
 *
 *   @see imp-33791-deg-ceiling-saturation.js (imp-33791: the DEG saturation-scale tabulation)
 *   @see imp-33765-g7-obstruction-orthogonal-lever.js (imp-33765: the orthogonal-lever verdict)
 *   @see imp-33725-g7-obstruction-a-scaling.js (imp-33725: the a-scaling one-dimensionality)
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (imp-3066: the single-cell obstruction)
 *
 *   Ticket: imp-33795 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const NQ = 4000;    // midpoint quadrature panels (matches imp-3066 / imp-33725 / imp-33765 / imp-33791)

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
 * Copied verbatim from imp-3066 / imp-33704 / imp-33725 / imp-33765 / imp-33791 so the modules
 * read the SAME spectrum.
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
 * The COUPLED (admissible) Perron norm at a single shared rate s: PASS form (cosh) and SHEAR
 * form (sinh) at the SAME rate s -- the imp-3066 single exponential e^{a*tau} split into its
 * even/odd parts. ||R|| rises monotonically in s toward the all-ones ceiling DEG+1.
 */
function perronNorm(DEG, s) {
  const Ddiag = Array.from({ length: DEG + 1 }, (_u, j) => moment(cosh, s, 2 * j));
  const Hshear = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => moment(sinh, s, j + k)),
  );
  const R = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => Hshear[j][k] / Math.sqrt(Ddiag[j] * Ddiag[k])),
  );
  const eig = symmetricEigenvalues(R);
  return Math.max(...eig.map((e) => Math.abs(e)));
}

/** Bisection for the s at which ||R||(DEG, s) first reaches target (monotone curve). */
function crossingScale(DEG, target) {
  let lo = 1e-4;
  let hi = 4;
  while (perronNorm(DEG, hi) < target && hi < 1e6) hi *= 2;
  if (perronNorm(DEG, hi) < target) return null;
  for (let it = 0; it < 100; it++) {
    const mid = 0.5 * (lo + hi);
    if (perronNorm(DEG, mid) < target) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

// -- The fixed truncation and its fine s-grid --------------------------------------------------
const DEG = 4;                 // the imp-3066 / imp-33765 anchor truncation size
const CEILING = DEG + 1;       // all-ones Perron eigenvalue = 5
const S_MIN = 0.05;
const S_MAX = 20;
const S_STEP = 0.05;

const FINE_GRID = Object.freeze(
  (() => {
    const out = [];
    // integer arithmetic on the step index avoids float drift in the grid coordinates
    const n = Math.round((S_MAX - S_MIN) / S_STEP);
    for (let i = 0; i <= n; i++) out.push(Math.round((S_MIN + i * S_STEP) * 1e6) / 1e6);
    return out;
  })(),
);

const CURVE = Object.freeze(
  FINE_GRID.map((s) => Object.freeze({ s, operatorNorm: perronNorm(DEG, s) })),
);

// -- (1) strict monotonicity + (2) turning-point-free concave shape ----------------------------
let strictlyMonotoneIncreasing = true;
let minFirstDifference = Infinity;
for (let i = 1; i < CURVE.length; i++) {
  const d = CURVE[i].operatorNorm - CURVE[i - 1].operatorNorm;
  if (d <= 0) strictlyMonotoneIncreasing = false;
  if (d < minFirstDifference) minFirstDifference = d;
}
// interior turning points of the CURVE (sign change of the first difference).
let curveTurningPoints = 0;
for (let i = 2; i < CURVE.length; i++) {
  const d1 = CURVE[i - 1].operatorNorm - CURVE[i - 2].operatorNorm;
  const d2 = CURVE[i].operatorNorm - CURVE[i - 1].operatorNorm;
  if (d1 > 0 !== d2 > 0) curveTurningPoints++;
}
// the discrete derivative and whether it is monotone decreasing (concave curve, single peak).
const DERIVATIVE = Object.freeze(
  CURVE.slice(1).map((pt, i) => Object.freeze({ s: pt.s, slope: pt.operatorNorm - CURVE[i].operatorNorm })),
);
let derivativeSlopeSignChanges = 0;
for (let i = 2; i < DERIVATIVE.length; i++) {
  const a = DERIVATIVE[i - 1].slope - DERIVATIVE[i - 2].slope;
  const b = DERIVATIVE[i].slope - DERIVATIVE[i - 1].slope;
  if (a > 0 !== b > 0) derivativeSlopeSignChanges++;
}
let derivativePeakIndex = 0;
for (let i = 1; i < DERIVATIVE.length; i++) {
  if (DERIVATIVE[i].slope > DERIVATIVE[derivativePeakIndex].slope) derivativePeakIndex = i;
}
const derivativePeakS = DERIVATIVE[derivativePeakIndex].s;

// -- (3) the unit crossing and the anchor ------------------------------------------------------
const sPassesOne = crossingScale(DEG, 1);
const normAtAnchor = perronNorm(DEG, 3);          // the imp-33765 s = 3 anchor
const fractionOfCeilingAtAnchor = normAtAnchor / CEILING;

// -- (4) the tail / approach rate to the DEG+1 ceiling -----------------------------------------
const TAIL_S = Object.freeze([10, 12, 14, 16, 18, 20]);
const TAIL = Object.freeze(
  TAIL_S.map((s) => {
    const gap = CEILING - perronNorm(DEG, s);
    return Object.freeze({ s, ceilingGap: gap, logCeilingGap: Math.log(gap) });
  }),
);
// slope of log(gap) across [10, 20] -- the exponential approach rate.
const tailLogGapSlope = (TAIL[TAIL.length - 1].logCeilingGap - TAIL[0].logCeilingGap) /
  (TAIL[TAIL.length - 1].s - TAIL[0].s);
const gapAtSMax = CEILING - CURVE[CURVE.length - 1].operatorNorm;

export const IMP33795_R_S_MONOTONICITY = Object.freeze({
  id: 'imp-33795-r-s-monotonicity',
  ticket: 'imp-33795',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedCeilingSaturation: 'imp-33791-deg-ceiling-saturation.js',
  relatedOrthogonalLever: 'imp-33765-g7-obstruction-orthogonal-lever.js',
  relatedAScaling: 'imp-33725-g7-obstruction-a-scaling.js',
  relatedObstruction: 'imp-3066-offdiagonal-hankel-obstruction.js',
  roadmapNode: 'G7',

  summary:
    'Measures the imp-33765 s-monotonicity premise of the coupled Perron norm ||R(s)|| on a fine ' +
    'grid s in [0.05, 20] (step 0.05) at the DEG = 4 anchor. The curve is STRICTLY monotone ' +
    'increasing (smallest first-difference ~9.0e-5 > 0) with EXACTLY 0 interior turning points, ' +
    'and CONCAVE (its derivative peaks near the origin and decreases monotonically). It passes 1 ' +
    'at s ~ 0.2794, is already ~92.3% of the ceiling 5 at the s = 3 anchor (||R|| ~ 4.617014), ' +
    'and approaches DEG+1 with an exponential-like tail (log-gap slope ~ -0.1165 per unit s over ' +
    '[10,20]). This VALIDATES the monotone single-parameter shape the imp-33765 one-dimensionality ' +
    'argument rests on. Diagnostic; no RH verdict; no refereed bound is changed.',

  construction: Object.freeze({
    quadraturePanels: NQ,
    fixedDegree: DEG,
    ceiling: CEILING,
    grid: `s in [${S_MIN}, ${S_MAX}] step ${S_STEP} (${FINE_GRID.length} points)`,
    passForm: 'D_jj = int_0^1 cosh(s*x) x^{2j} dx (even/pass part)',
    shearForm: 'H_jk = int_0^1 sinh(s*x) x^{j+k} dx (odd/shear part)',
    normalisedKernel: 'R_jk = H_jk / sqrt(D_jj D_kk); ||R|| = max |eig(R)|',
    coupledSlice: 's_a = s_b = s (the admissible imp-3066 single exponential e^{a*tau})',
  }),

  measured: Object.freeze({
    degree: DEG,
    ceiling: CEILING,
    gridPoints: FINE_GRID.length,
    curve: CURVE,
    strictlyMonotoneIncreasing,
    minFirstDifference,
    curveTurningPoints,
    derivativeSlopeSignChanges,
    derivativePeakS,
    normAtGridStart: CURVE[0].operatorNorm,
    normAtGridEnd: CURVE[CURVE.length - 1].operatorNorm,
    sPassesOne,
    normAtAnchor,
    fractionOfCeilingAtAnchor,
    tail: TAIL,
    tailLogGapSlope,
    gapAtSMax,
  }),

  interpretation: Object.freeze({
    strictMonotonicity:
      'On the fine grid every consecutive difference of ||R||(s) is strictly positive and the ' +
      'number of interior turning points is EXACTLY 0. The monotone-in-s single-parameter shape ' +
      'the imp-33765 verdict assumes is confirmed at fine resolution, not just at isolated s.',
    shape:
      'The discrete derivative is largest near the origin and decreases monotonically (0 slope ' +
      'sign-changes): the curve is CONCAVE -- it rises fastest at small s and bends over toward ' +
      'the ceiling with no interior maximum, inflection reversal, or non-monotone region.',
    crossingAndAnchor:
      '||R|| passes 1 at s ~ 0.2794; at the imp-3066 / imp-33765 anchor s = 3 it is already ' +
      '~4.617014, i.e. ~92.3% of the DEG = 4 ceiling 5.',
    approachRate:
      'The ceiling gap (DEG+1) - ||R|| shrinks like an exponential: log(gap) is nearly linear ' +
      'on [10, 20] with slope ~ -0.1165 per unit s (gap ~0.0646 at s=10 to ~0.0202 at s=20, a ' +
      'factor ~3.2). The monotone curve approaches its all-ones ceiling from below exponentially.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    coupledSliceIsTheAdmissibleImp3066Kernel: true,
    validatesTheMonotonePremiseButDischargesNothing: true,
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
export const IMP33795_R_S_MONOTONICITY_ASSERTIONS = [
  {
    id: 'imp33795-anchor-matches-roadmap',
    why: 'Cross-check the coupled DEG=4 anchor at s = 3 against imp-3066 / imp-33725 / imp-33765 / ' +
         'imp-33791 / roadmap G7: ||R|| ~ 4.617014. A mismatch means the inherited coupled ' +
         'construction drifted.',
    holds: () => Math.abs(normAtAnchor - 4.617014) < 1e-4,
  },
  {
    id: 'imp33795-strictly-monotone-no-turning-point',
    why: 'THE PREMISE: on the fine grid ||R||(s) is STRICTLY monotone increasing (smallest ' +
         'first-difference > 0) with EXACTLY 0 interior turning points -- the monotone ' +
         'single-parameter shape the imp-33765 one-dimensionality argument relies on.',
    holds: () =>
      strictlyMonotoneIncreasing === true &&
      minFirstDifference > 0 &&
      curveTurningPoints === 0,
  },
  {
    id: 'imp33795-concave-single-derivative-peak',
    why: 'THE SHAPE: the discrete derivative decreases monotonically after peaking near the ' +
         'origin (0 slope sign-changes) -- the curve is concave, rising fastest at small s and ' +
         'bending over toward the ceiling with no interior maximum or inflection reversal.',
    holds: () => derivativeSlopeSignChanges === 0 && derivativePeakS < 0.5,
  },
  {
    id: 'imp33795-unit-crossing-and-ceiling-fraction',
    why: 'THE UNIT CROSSING: ||R|| passes 1 at s ~ 0.2794 and reaches ~92.3% of the DEG=4 ' +
         'ceiling 5 by the s = 3 anchor -- the norm is already deep into saturation at the anchor.',
    holds: () =>
      sPassesOne !== null &&
      Math.abs(sPassesOne - 0.279399) < 1e-3 &&
      Math.abs(fractionOfCeilingAtAnchor - 0.923403) < 1e-3,
  },
  {
    id: 'imp33795-exponential-ceiling-approach',
    why: 'THE APPROACH RATE: the ceiling gap shrinks exponentially -- log(gap) has slope ' +
         '~ -0.1165 per unit s on [10, 20], and the gap at s = 20 is ~0.0202, so the monotone ' +
         'curve approaches DEG+1 from below.',
    holds: () =>
      tailLogGapSlope < 0 &&
      Math.abs(tailLogGapSlope - -0.116468) < 5e-3 &&
      gapAtSMax > 0 &&
      Math.abs(gapAtSMax - 0.020170) < 1e-3,
  },
  {
    id: 'imp33795-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: this is a REPRESENTATIVE measurement / diagnostic on the coupled ' +
         '(admissible) slice that VALIDATES the imp-33765 monotone premise but discharges ' +
         'nothing, ||R|| carries no RH verdict, imp-3066 / imp-33725 / imp-33765 / G7 are ' +
         'untouched, K_a >= 0 and positivity were not attempted, it is not a proof or a ' +
         'reduction, and no refereed bound is changed.',
    holds: () => {
      const c = IMP33795_R_S_MONOTONICITY.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isRepresentativeTruncationNotTheSection26Gram === true &&
        c.coupledSliceIsTheAdmissibleImp3066Kernel === true &&
        c.validatesTheMonotonePremiseButDischargesNothing === true &&
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

for (const assertion of IMP33795_R_S_MONOTONICITY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33795-r-s-monotonicity assertion failed: ${assertion.id}`);
  }
}

export default IMP33795_R_S_MONOTONICITY;
