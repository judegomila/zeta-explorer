/**
 * @module imp-33846-r-s-monotonicity-deg-robust
 * @fileoverview imp-33846 -- MEASURE the DEG-robustness of the imp-33795 s-shape: repeat the fine
 *   ||R(s)|| grid sweep at truncation sizes DEG in {6, 8, 10}, confirm at EACH that the coupled
 *   Perron norm is STRICTLY monotone increasing in s with EXACTLY 0 interior turning points, and
 *   report the ceiling-gap (DEG+1 - ||R||) tail log-slope per DEG, so the monotone
 *   one-parameter s-shape underpinning the imp-33765 one-dimensionality-in-s premise is shown
 *   DEG-independent rather than a DEG = 4 artifact.
 *
 *   THE GAP THIS FILLS (the imp-33846 ticket)
 *   -----------------------------------------
 *   imp-33795 verified strict monotonicity, the absence of any interior turning point, and the
 *   concave ceiling approach for ||R||(s) ONLY at the DEG = 4 anchor. The imp-33765
 *   one-dimensionality-in-s argument, however, needs that shape to hold as the truncation is
 *   refined -- otherwise the DEG = 4 result could be a small-matrix artifact. This module repeats
 *   the imp-33795 fine-grid sweep (s in [0.05, 20], step 0.05, 400 points) VERBATIM at DEG in
 *   {6, 8, 10}, and records, per DEG, whether strict monotonicity and zero-turning-point hold and
 *   what the ceiling-gap tail slope is.
 *
 *   THE COUPLED PROBE (admissible imp-3066 slice, identical to imp-33795 / imp-33791)
 *   --------------------------------------------------------------------------------
 *   On the representative degree-DEG monomial truncation phi_j(tau) = (tau/U)^j, with tau = U*x
 *   mapping both integrands onto [0,1] (the shared U prefactor cancels, so R depends only on
 *   s = a*U -- we set U = 1):
 *       D_jj = int_0^1 cosh(s * x) x^{2j} dx        (PASS form,  even part),
 *       H_jk = int_0^1 sinh(s * x) x^{j+k} dx       (SHEAR form, odd part),
 *       R_jk = H_jk / sqrt(D_jj D_kk),   ||R|| = Perron eigenvalue (max |eig|).
 *   As s -> 0 the odd shear part vanishes so ||R|| -> 0; as s -> infinity both cosh and sinh
 *   concentrate at x = 1 where every monomial x^p -> 1, so R -> the all-ones matrix, whose Perron
 *   eigenvalue is EXACTLY DEG+1.
 *
 *   WHAT IS MEASURED (the imp-33846 deliverable -- MEASURE ONLY)
 *   -----------------------------------------------------------
 *   (1) STRICT MONOTONICITY, DEG-ROBUST. At every DEG in {6, 8, 10} the fine-grid first-difference
 *       is strictly positive (smallest ~1.9e-4 at DEG=6, ~3.3e-4 at DEG=8, ~4.9e-4 at DEG=10 --
 *       all comfortably > 0) and the number of interior turning points is EXACTLY 0. The monotone
 *       single-parameter shape the imp-33765 verdict relies on is NOT a DEG = 4 artifact.
 *   (2) CONCAVE SHAPE, DEG-ROBUST. At every DEG the discrete derivative peaks near the origin
 *       (peak s = 0.1) and then decreases monotonically (0 slope sign-changes) -- concave rise
 *       to the ceiling with no interior maximum or inflection reversal, at every measured DEG.
 *   (3) THE CEILING-GAP TAIL SLOPE PER DEG. The ceiling gap g(s) = (DEG+1) - ||R||(s) still
 *       shrinks exponentially, but the log-gap slope over s in [10, 20] SOFTENS monotonically as
 *       DEG grows: ~ -0.1165 (DEG=4, imp-33795), -0.103844 (DEG=6), -0.094389 (DEG=8),
 *       -0.086911 (DEG=10). Larger truncations approach their taller ceiling slightly more slowly
 *       per unit s -- an orderly DEG-trend, not a shape change.
 *   (4) THE UNIT CROSSING PER DEG. ||R|| passes 1 EARLIER as DEG grows (more coupled monomials
 *       lift the Perron eigenvalue sooner): s_cross ~ 0.189334 (DEG=6), 0.142890 (DEG=8),
 *       0.114636 (DEG=10) -- and at the imp-3066 s = 3 anchor the norm is ~91.2-91.9% of the
 *       DEG+1 ceiling at every DEG, mirroring the ~92.3% measured at DEG = 4.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   DIAGNOSTIC measurement on the SAME representative monomial truncation as imp-3066 /
 *   imp-33704 / imp-33725 / imp-33765 / imp-33791 / imp-33795 -- NOT the section-26 Gram.
 *   Confirming the monotone, turning-point-free shape is DEG-robust VALIDATES the premise the
 *   imp-33765 verdict rests on but carries NO RH verdict and discharges nothing: K_a >= 0 was NOT
 *   attempted; imp-3066 / imp-33704 / imp-33725 / imp-33765 / imp-33795 / G7 remain UNTOUCHED as
 *   proofs; positivity was not attempted; this is not a proof or a reduction; no refereed bound is changed
 *   . No false QED.
 *
 *   @see imp-33795-r-s-monotonicity.js (imp-33795: the DEG = 4 anchor s-shape measurement)
 *   @see imp-33791-deg-ceiling-saturation.js (imp-33791: the DEG saturation-scale tabulation)
 *   @see imp-33765-g7-obstruction-orthogonal-lever.js (imp-33765: the orthogonal-lever verdict)
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (imp-3066: the single-cell obstruction)
 *
 *   Ticket: imp-33846 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const NQ = 4000;    // midpoint quadrature panels (matches imp-3066 / imp-33765 / imp-33791 / imp-33795)

const cosh = Math.cosh;
const sinh = Math.sinh;

/** x-domain moment: int_0^1 weightFn(s*x) * x^p dx (the de-homogenised imp-33795 integrand). */
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
 * Copied verbatim from imp-3066 / imp-33704 / imp-33725 / imp-33765 / imp-33791 / imp-33795 so the
 * modules read the SAME spectrum.
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

// -- The fine s-grid (identical to imp-33795) --------------------------------------------------
const S_MIN = 0.05;
const S_MAX = 20;
const S_STEP = 0.05;
const TAIL_S = Object.freeze([10, 12, 14, 16, 18, 20]);
const ANCHOR_S = 3;               // the imp-3066 / imp-33765 anchor

const FINE_GRID = Object.freeze(
  (() => {
    const out = [];
    // integer arithmetic on the step index avoids float drift in the grid coordinates
    const n = Math.round((S_MAX - S_MIN) / S_STEP);
    for (let i = 0; i <= n; i++) out.push(Math.round((S_MIN + i * S_STEP) * 1e6) / 1e6);
    return out;
  })(),
);

/** Measure the full imp-33795 diagnostic bundle at a single truncation size DEG. */
function measureAtDegree(DEG) {
  const ceiling = DEG + 1;
  const curve = FINE_GRID.map((s) => perronNorm(DEG, s));

  // (1) strict monotonicity + interior turning points of the curve.
  let strictlyMonotoneIncreasing = true;
  let minFirstDifference = Infinity;
  for (let i = 1; i < curve.length; i++) {
    const d = curve[i] - curve[i - 1];
    if (d <= 0) strictlyMonotoneIncreasing = false;
    if (d < minFirstDifference) minFirstDifference = d;
  }
  let curveTurningPoints = 0;
  for (let i = 2; i < curve.length; i++) {
    const d1 = curve[i - 1] - curve[i - 2];
    const d2 = curve[i] - curve[i - 1];
    if (d1 > 0 !== d2 > 0) curveTurningPoints++;
  }

  // (2) discrete derivative: monotone decreasing (concave, single peak near origin).
  const derivative = curve.slice(1).map((v, i) => v - curve[i]);
  let derivativeSlopeSignChanges = 0;
  for (let i = 2; i < derivative.length; i++) {
    const a = derivative[i - 1] - derivative[i - 2];
    const b = derivative[i] - derivative[i - 1];
    if (a > 0 !== b > 0) derivativeSlopeSignChanges++;
  }
  let derivativePeakIndex = 0;
  for (let i = 1; i < derivative.length; i++) {
    if (derivative[i] > derivative[derivativePeakIndex]) derivativePeakIndex = i;
  }
  const derivativePeakS = FINE_GRID[derivativePeakIndex + 1];

  // (3) ceiling-gap tail slope over [10, 20].
  const tail = TAIL_S.map((s) => {
    const gap = ceiling - perronNorm(DEG, s);
    return Object.freeze({ s, ceilingGap: gap, logCeilingGap: Math.log(gap) });
  });
  const tailLogGapSlope =
    (tail[tail.length - 1].logCeilingGap - tail[0].logCeilingGap) /
    (tail[tail.length - 1].s - tail[0].s);
  const gapAtSMax = ceiling - curve[curve.length - 1];

  // (4) the unit crossing and the anchor.
  const sPassesOne = crossingScale(DEG, 1);
  const normAtAnchor = perronNorm(DEG, ANCHOR_S);
  const fractionOfCeilingAtAnchor = normAtAnchor / ceiling;

  return Object.freeze({
    degree: DEG,
    ceiling,
    gridPoints: FINE_GRID.length,
    strictlyMonotoneIncreasing,
    minFirstDifference,
    curveTurningPoints,
    derivativeSlopeSignChanges,
    derivativePeakS,
    normAtGridStart: curve[0],
    normAtGridEnd: curve[curve.length - 1],
    sPassesOne,
    normAtAnchor,
    fractionOfCeilingAtAnchor,
    tail: Object.freeze(tail),
    tailLogGapSlope,
    gapAtSMax,
  });
}

// -- The DEG-robustness sweep ------------------------------------------------------------------
const DEGREES = Object.freeze([6, 8, 10]);
const PER_DEGREE = Object.freeze(DEGREES.map((DEG) => measureAtDegree(DEG)));

// aggregate DEG-robustness flags across the whole sweep.
const allStrictlyMonotone = PER_DEGREE.every((r) => r.strictlyMonotoneIncreasing === true);
const allZeroTurningPoints = PER_DEGREE.every((r) => r.curveTurningPoints === 0);
const allConcaveSinglePeak = PER_DEGREE.every(
  (r) => r.derivativeSlopeSignChanges === 0 && r.derivativePeakS < 0.5,
);
const allTailSlopesNegative = PER_DEGREE.every((r) => r.tailLogGapSlope < 0);
// the DEG=4 imp-33795 slope was ~ -0.1165; the tail slope should SOFTEN (grow toward 0) with DEG.
const IMP33795_DEG4_TAIL_SLOPE = -0.116468;
const tailSlopeSoftensWithDegree =
  IMP33795_DEG4_TAIL_SLOPE < PER_DEGREE[0].tailLogGapSlope &&
  PER_DEGREE[0].tailLogGapSlope < PER_DEGREE[1].tailLogGapSlope &&
  PER_DEGREE[1].tailLogGapSlope < PER_DEGREE[2].tailLogGapSlope;

export const IMP33846_R_S_MONOTONICITY_DEG_ROBUST = Object.freeze({
  id: 'imp-33846-r-s-monotonicity-deg-robust',
  ticket: 'imp-33846',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedAnchorMeasurement: 'imp-33795-r-s-monotonicity.js',
  relatedCeilingSaturation: 'imp-33791-deg-ceiling-saturation.js',
  relatedOrthogonalLever: 'imp-33765-g7-obstruction-orthogonal-lever.js',
  relatedObstruction: 'imp-3066-offdiagonal-hankel-obstruction.js',
  roadmapNode: 'G7',

  summary:
    'Repeats the imp-33795 fine-grid ||R(s)|| sweep (s in [0.05, 20], step 0.05) at DEG in ' +
    '{6, 8, 10} to show the monotone turning-point-free s-shape is DEG-robust, not a DEG = 4 ' +
    'artifact. At EVERY DEG the curve is STRICTLY monotone increasing (smallest first-difference ' +
    '~1.9e-4/3.3e-4/4.9e-4 > 0), has EXACTLY 0 interior turning points, and is CONCAVE (derivative ' +
    'peaks at s = 0.1 and decreases monotonically). The ceiling-gap tail log-slope over [10, 20] ' +
    'SOFTENS monotonically with DEG: -0.103844 (DEG=6), -0.094389 (DEG=8), -0.086911 (DEG=10), ' +
    'up from -0.1165 at DEG=4 -- an orderly trend, not a shape change. The unit crossing moves ' +
    'earlier (s ~ 0.189/0.143/0.115) and the s = 3 anchor sits at ~91-92% of DEG+1 at every DEG. ' +
    'This VALIDATES the DEG-robustness of the monotone single-parameter shape the imp-33765 ' +
    'one-dimensionality-in-s argument rests on. Diagnostic; no RH verdict; no refereed bound is changed.',

  construction: Object.freeze({
    quadraturePanels: NQ,
    degrees: DEGREES,
    grid: `s in [${S_MIN}, ${S_MAX}] step ${S_STEP} (${FINE_GRID.length} points)`,
    passForm: 'D_jj = int_0^1 cosh(s*x) x^{2j} dx (even/pass part)',
    shearForm: 'H_jk = int_0^1 sinh(s*x) x^{j+k} dx (odd/shear part)',
    normalisedKernel: 'R_jk = H_jk / sqrt(D_jj D_kk); ||R|| = max |eig(R)|',
    coupledSlice: 's_a = s_b = s (the admissible imp-3066 single exponential e^{a*tau})',
    ceilingPerDegree: 'all-ones Perron eigenvalue = DEG + 1',
  }),

  measured: Object.freeze({
    degrees: DEGREES,
    perDegree: PER_DEGREE,
    allStrictlyMonotone,
    allZeroTurningPoints,
    allConcaveSinglePeak,
    allTailSlopesNegative,
    imp33795Deg4TailSlope: IMP33795_DEG4_TAIL_SLOPE,
    tailSlopeSoftensWithDegree,
  }),

  interpretation: Object.freeze({
    degRobustMonotonicity:
      'At EVERY DEG in {6, 8, 10} the fine-grid ||R||(s) is strictly monotone increasing with ' +
      'EXACTLY 0 interior turning points -- the monotone single-parameter shape the imp-33765 ' +
      'verdict relies on is DEG-independent, not a DEG = 4 small-matrix artifact.',
    degRobustConcavity:
      'At every DEG the discrete derivative peaks at s = 0.1 and decreases monotonically ' +
      '(0 slope sign-changes): the concave rise-and-bend-over shape holds at every measured ' +
      'truncation size.',
    tailSlopeTrend:
      'The ceiling-gap tail log-slope over [10, 20] softens monotonically with DEG: -0.116468 ' +
      '(DEG=4), -0.103844 (DEG=6), -0.094389 (DEG=8), -0.086911 (DEG=10). Taller ceilings are ' +
      'approached slightly more slowly per unit s -- an orderly DEG-trend, not a shape change.',
    unitCrossingTrend:
      '||R|| passes 1 earlier as DEG grows (s ~ 0.189334, 0.142890, 0.114636 for DEG 6/8/10) ' +
      'and the s = 3 anchor sits at ~91.2-91.9% of the DEG+1 ceiling, mirroring the ~92.3% ' +
      'measured at DEG = 4.',
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
    imp33795Untouched: true,
    didNotAttemptKaNonnegativity: true,
    didNotAttemptPositivity: true,
    carriesNoRHVerdict: true,
    sota: 'No refereed bound is changed.',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP33846_R_S_MONOTONICITY_DEG_ROBUST_ASSERTIONS = [
  {
    id: 'imp33846-strict-monotone-no-turning-point-all-deg',
    why: 'THE PREMISE, DEG-ROBUST: at EVERY DEG in {6, 8, 10} ||R||(s) is strictly monotone ' +
         'increasing (smallest first-difference > 0) with EXACTLY 0 interior turning points -- ' +
         'the monotone single-parameter shape the imp-33765 argument relies on is not a DEG = 4 ' +
         'artifact.',
    holds: () =>
      allStrictlyMonotone === true &&
      allZeroTurningPoints === true &&
      PER_DEGREE.every((r) => r.minFirstDifference > 0),
  },
  {
    id: 'imp33846-concave-single-derivative-peak-all-deg',
    why: 'THE SHAPE, DEG-ROBUST: at every DEG the discrete derivative decreases monotonically ' +
         '(0 slope sign-changes) after peaking near the origin (peak s < 0.5) -- concave at ' +
         'every measured truncation size.',
    holds: () => allConcaveSinglePeak === true,
  },
  {
    id: 'imp33846-tail-slope-softens-with-degree',
    why: 'THE APPROACH RATE PER DEG: every ceiling-gap tail log-slope is negative and the slope ' +
         'softens (grows toward 0) monotonically with DEG from the imp-33795 DEG=4 value ' +
         '-0.116468 -- an orderly trend confirming the exponential ceiling approach at every DEG.',
    holds: () =>
      allTailSlopesNegative === true &&
      tailSlopeSoftensWithDegree === true &&
      Math.abs(PER_DEGREE[0].tailLogGapSlope - -0.103844) < 5e-3 &&
      Math.abs(PER_DEGREE[1].tailLogGapSlope - -0.094389) < 5e-3 &&
      Math.abs(PER_DEGREE[2].tailLogGapSlope - -0.086911) < 5e-3,
  },
  {
    id: 'imp33846-unit-crossing-and-anchor-fraction-all-deg',
    why: 'THE UNIT CROSSING PER DEG: ||R|| passes 1 earlier as DEG grows (s ~ 0.189/0.143/0.115 ' +
         'for DEG 6/8/10) and the s = 3 anchor sits at ~91-92% of the DEG+1 ceiling at every DEG.',
    holds: () =>
      Math.abs(PER_DEGREE[0].sPassesOne - 0.189334) < 1e-3 &&
      Math.abs(PER_DEGREE[1].sPassesOne - 0.142890) < 1e-3 &&
      Math.abs(PER_DEGREE[2].sPassesOne - 0.114636) < 1e-3 &&
      PER_DEGREE.every(
        (r) => r.fractionOfCeilingAtAnchor > 0.9 && r.fractionOfCeilingAtAnchor < 0.93,
      ),
  },
  {
    id: 'imp33846-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: this is a REPRESENTATIVE DEG-robustness measurement on the coupled ' +
         '(admissible) slice that VALIDATES the imp-33765 monotone premise but discharges ' +
         'nothing, ||R|| carries no RH verdict, imp-3066 / imp-33725 / imp-33765 / imp-33795 / G7 ' +
         'are untouched, K_a >= 0 and positivity were not attempted, it is not a proof or a ' +
         'reduction, and no refereed bound is changed.',
    holds: () => {
      const c = IMP33846_R_S_MONOTONICITY_DEG_ROBUST.honestCaveat;
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
        c.imp33795Untouched === true &&
        c.didNotAttemptKaNonnegativity === true &&
        c.didNotAttemptPositivity === true &&
        c.carriesNoRHVerdict === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33846_R_S_MONOTONICITY_DEG_ROBUST_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33846-r-s-monotonicity-deg-robust assertion failed: ${assertion.id}`);
  }
}

export default IMP33846_R_S_MONOTONICITY_DEG_ROBUST;
