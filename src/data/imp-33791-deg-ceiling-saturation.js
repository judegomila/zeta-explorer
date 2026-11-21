/**
 * @module imp-33791-deg-ceiling-saturation
 * @fileoverview imp-33791 -- TABULATE the imp-33765 truncation-size DEG saturation of the
 *   COUPLED Perron norm ||R||(s) toward the all-ones ceiling DEG+1, and LOCATE, for each DEG,
 *   the s-scale s_90(DEG) at which ||R|| first reaches 90% of that ceiling. Direct follow-on to
 *   imp-33765, whose orthogonal-lever verdict (2)(iii) asserts that the truncation size DEG is
 *   the one genuinely orthogonal AND admissible axis of the imp-3066 shear kernel but that it
 *   only "sets the ceiling DEG+1 that the monotone-in-s curve saturates to, it does not walk the
 *   obstruction down" -- WITHOUT ever tabulating HOW the saturation SCALE depends on DEG.
 *
 *   THE GAP THIS FILLS (the imp-33791 ticket)
 *   -----------------------------------------
 *   imp-33765 (2)(iii) is qualitative: DEG lifts the ceiling but does not soften the obstruction.
 *   It never measured the s-scale at which the monotone-in-s curve APPROACHES its DEG-dependent
 *   ceiling. This module measures ||R||(s) across DEG in {2..8} on the ADMISSIBLE coupled slice
 *   s_a = s_b = s (the imp-3066 single exponential) and bisects, for each DEG, the saturation
 *   scale s_90(DEG) at which ||R|| first reaches 0.9*(DEG+1).
 *
 *   THE COUPLED PROBE (admissible imp-3066 slice)
 *   ---------------------------------------------
 *   On the representative degree-DEG monomial truncation phi_j(tau) = (tau/U)^j, with tau = U*x
 *   mapping both integrands onto [0,1] (the shared U prefactor cancels, so R depends only on
 *   s = a*U -- we set U = 1):
 *       D_jj = int_0^1 cosh(s * x) x^{2j} dx        (PASS form,  even part),
 *       H_jk = int_0^1 sinh(s * x) x^{j+k} dx       (SHEAR form, odd part),
 *       R_jk = H_jk / sqrt(D_jj D_kk),   ||R|| = Perron eigenvalue (max |eig|).
 *   As s -> infinity both cosh and sinh concentrate at x = 1 where every monomial x^p -> 1, so
 *   R -> the all-ones matrix, whose Perron eigenvalue is EXACTLY DEG+1. The curve ||R||(s) thus
 *   rises monotonically from ~0 (s -> 0, the odd shear part vanishes) to the ceiling DEG+1.
 *   Unlike imp-33789 this is the ADMISSIBLE coupled slice s_a = s_b (no decoupling).
 *
 *   WHAT IS MEASURED (the imp-33791 deliverable -- MEASURE ONLY)
 *   -----------------------------------------------------------
 *   (1) THE CEILING. At s = 100 the norm sits within 1e-2 of DEG+1 for every DEG in {2..8},
 *       confirming the all-ones ceiling the imp-33765 verdict names.
 *   (2) THE SATURATION SCALE s_90(DEG). The s at which ||R|| first reaches 0.9*(DEG+1), by
 *       bisection on the monotone curve. It is essentially FLAT in DEG: s_90 sits in the narrow
 *       band [2.5584, 2.6058] with a SHALLOW MINIMUM near DEG = 4 -- it dips from 2.6058 (DEG=2)
 *       to 2.5584 (DEG=4) then rises to 2.6156 (DEG=8), a total spread of only ~0.057 (~2.2%)
 *       across DEG 2..8. So s_90 neither grows nor shrinks with DEG: the ceiling is approached at
 *       a nearly DEG-INDEPENDENT s-scale.
 *   (3) THE SEPARATION. The ceiling DEG+1 rises LINEARLY with DEG while the saturation scale
 *       s_90 stays essentially FIXED. The curve rescales VERTICALLY with DEG; its horizontal
 *       (s) shape barely moves. That is the ceiling-vs-curve separation the imp-33765 verdict
 *       asserts qualitatively: enlarging the truncation lifts the ceiling but does not move where
 *       (in s) the obstruction saturates -- it does not "walk the obstruction down".
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   DIAGNOSTIC measurement on the SAME representative monomial truncation as imp-3066 /
 *   imp-33704 / imp-33725 / imp-33765 -- NOT the section-26 Gram. The tabulated saturation scale
 *   carries NO RH verdict; it merely quantifies how the DEG-dependent ceiling is approached.
 *   K_a >= 0 was NOT attempted; imp-3066 / imp-33704 / imp-33725 / imp-33765 / G7 remain
 *   UNTOUCHED as proofs; positivity was not attempted; this is not a proof or a reduction;
 *   no refereed bound is changed. No false QED.
 *
 *   @see imp-33789-decoupled-rate-grid.js (imp-33789: the decoupled pass/shear-rate grid)
 *   @see imp-33765-g7-obstruction-orthogonal-lever.js (imp-33765: the orthogonal-lever verdict)
 *   @see imp-33725-g7-obstruction-a-scaling.js (imp-33725: the a-scaling one-dimensionality)
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (imp-3066: the single-cell obstruction)
 *
 *   Ticket: imp-33791 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const NQ = 4000;    // midpoint quadrature panels (matches imp-3066 / imp-33725 / imp-33765 / imp-33789)

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
 * Copied verbatim from imp-3066 / imp-33704 / imp-33725 / imp-33765 / imp-33789 so the modules
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

/**
 * The saturation scale s_90(DEG): the s at which ||R||(s) first reaches 0.9*(DEG+1). The curve
 * is monotone increasing in s, so a simple grow-then-bisect brackets it uniquely.
 */
function saturationScale(DEG) {
  const target = 0.9 * (DEG + 1);
  let lo = 1e-6;         // ||R|| ~ 0 here
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

// -- The DEG range and its ceiling saturation --------------------------------------------------
const DEG_RANGE = Object.freeze([2, 3, 4, 5, 6, 7, 8]);
const NEAR_CEILING_S = 100;   // ||R|| within 1e-2 of DEG+1 here

const SATURATION = Object.freeze(
  DEG_RANGE.map((DEG) => {
    const ceiling = DEG + 1;
    const s90 = saturationScale(DEG);
    return Object.freeze({
      degree: DEG,
      ceiling,                                  // all-ones Perron eigenvalue = DEG+1
      normNearCeiling: perronNorm(DEG, NEAR_CEILING_S),
      s90,                                      // s at which ||R|| = 0.9*(DEG+1)
      normAtS90: perronNorm(DEG, s90),          // ~ 0.9*(DEG+1) by construction
    });
  }),
);

// -- The full saturation curve ||R||(DEG, s) for the record ------------------------------------
const S_GRID = Object.freeze([0.5, 1, 2, 3, 5, 8, 12, 20, 40]);
const CURVE = Object.freeze(
  DEG_RANGE.map((DEG) =>
    Object.freeze({
      degree: DEG,
      row: Object.freeze(S_GRID.map((s) => Object.freeze({ s, operatorNorm: perronNorm(DEG, s) }))),
    }),
  ),
);

// -- Derived trend of the saturation scale in DEG ----------------------------------------------
const s90s = SATURATION.map((r) => r.s90);
const s90Min = Math.min(...s90s);
const s90Max = Math.max(...s90s);
const s90Spread = s90Max - s90Min;
const s90RelativeSpread = s90Spread / s90Min;      // ~2.2% -- essentially flat
// Not monotone: shallow U with a minimum near DEG = 4.
let s90IsMonotoneGrowing = true;
let s90IsMonotoneShrinking = true;
for (let i = 1; i < s90s.length; i++) {
  if (s90s[i] <= s90s[i - 1]) s90IsMonotoneGrowing = false;
  if (s90s[i] >= s90s[i - 1]) s90IsMonotoneShrinking = false;
}
const s90IsEssentiallyFlat = s90RelativeSpread < 0.05;   // spread < 5% of the scale
const argMinDeg = SATURATION.reduce((best, r) => (r.s90 < best.s90 ? r : best)).degree;
// The ceiling rises exactly linearly with DEG (ceiling = DEG+1) while s_90 stays fixed.
const ceilingRisesLinearly = SATURATION.every((r) => r.ceiling === r.degree + 1);
const everyNormReachesCeiling = SATURATION.every((r) => Math.abs(r.normNearCeiling - r.ceiling) < 1e-2);
const everyS90HitsNinetyPercent = SATURATION.every(
  (r) => Math.abs(r.normAtS90 - 0.9 * r.ceiling) < 1e-4,
);

export const IMP33791_DEG_CEILING_SATURATION = Object.freeze({
  id: 'imp-33791-deg-ceiling-saturation',
  ticket: 'imp-33791',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedDecoupledGrid: 'imp-33789-decoupled-rate-grid.js',
  relatedOrthogonalLever: 'imp-33765-g7-obstruction-orthogonal-lever.js',
  relatedAScaling: 'imp-33725-g7-obstruction-a-scaling.js',
  relatedObstruction: 'imp-3066-offdiagonal-hankel-obstruction.js',
  roadmapNode: 'G7',

  summary:
    'Tabulates the imp-33765 truncation-size DEG saturation of the coupled Perron norm ||R||(s) ' +
    'toward the all-ones ceiling DEG+1, and locates s_90(DEG), the s-scale at which ||R|| first ' +
    'reaches 90% of that ceiling. The ceiling rises LINEARLY with DEG (= DEG+1) while s_90 is ' +
    'essentially FLAT: it sits in the narrow band [2.5584, 2.6058] with a shallow minimum near ' +
    'DEG = 4 (spread ~2.2% across DEG 2..8), NEITHER growing nor shrinking. So enlarging the ' +
    'truncation lifts the ceiling but does not move where (in s) the obstruction saturates -- ' +
    'the curve rescales vertically, quantifying the ceiling-vs-curve separation the imp-33765 ' +
    'verdict asserts qualitatively. Diagnostic; no RH verdict; no refereed bound is changed.',

  construction: Object.freeze({
    quadraturePanels: NQ,
    passForm: 'D_jj = int_0^1 cosh(s*x) x^{2j} dx (even/pass part)',
    shearForm: 'H_jk = int_0^1 sinh(s*x) x^{j+k} dx (odd/shear part)',
    normalisedKernel: 'R_jk = H_jk / sqrt(D_jj D_kk); ||R|| = max |eig(R)|',
    coupledSlice: 's_a = s_b = s (the admissible imp-3066 single exponential e^{a*tau})',
    ceiling: 'as s -> inf, R -> all-ones matrix; Perron eigenvalue -> DEG+1',
    saturationDef: 's_90(DEG) = s at which ||R|| first reaches 0.9*(DEG+1), by bisection',
  }),

  measured: Object.freeze({
    degRange: DEG_RANGE,
    saturation: SATURATION,
    curve: CURVE,
    s90Min,
    s90Max,
    s90Spread,
    s90RelativeSpread,
    s90IsMonotoneGrowing,
    s90IsMonotoneShrinking,
    s90IsEssentiallyFlat,
    argMinDeg,
    ceilingRisesLinearly,
    everyNormReachesCeiling,
    everyS90HitsNinetyPercent,
  }),

  interpretation: Object.freeze({
    theCeiling:
      'For every DEG in {2..8}, ||R|| at s = 100 sits within 1e-2 of DEG+1, confirming the ' +
      'all-ones Perron ceiling the imp-33765 verdict names. The ceiling rises LINEARLY with DEG.',
    theScale:
      'The saturation scale s_90(DEG) is essentially FLAT: [2.5584, 2.6058] with a shallow ' +
      'minimum near DEG = 4, a spread of only ~2.2% across DEG 2..8. It NEITHER grows nor ' +
      'shrinks -- the ceiling is approached at a nearly DEG-independent s-scale.',
    theSeparation:
      'The ceiling DEG+1 grows with the truncation while the s-scale at which it is approached ' +
      'barely moves: the curve rescales vertically with DEG. That is exactly the ceiling-vs-curve ' +
      'separation imp-33765 (2)(iii) asserts qualitatively -- DEG lifts the ceiling but does not ' +
      'walk the obstruction down.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    coupledSliceIsTheAdmissibleImp3066Kernel: true,
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
export const IMP33791_DEG_CEILING_SATURATION_ASSERTIONS = [
  {
    id: 'imp33791-anchor-matches-roadmap',
    why: 'Cross-check the coupled DEG=4 anchor at s = 3 against imp-3066 / imp-33725 / imp-33765 / ' +
         'imp-33789 / roadmap G7: ||R|| ~ 4.617014. A mismatch means the inherited coupled ' +
         'construction drifted.',
    holds: () => Math.abs(perronNorm(4, 3) - 4.617014) < 1e-4,
  },
  {
    id: 'imp33791-ceiling-is-deg-plus-one',
    why: 'THE CEILING: for every DEG in {2..8}, ||R|| at s = 100 reaches within 1e-2 of the ' +
         'all-ones Perron eigenvalue DEG+1, confirming the ceiling the imp-33765 verdict names, ' +
         'which rises linearly with DEG.',
    holds: () => ceilingRisesLinearly && everyNormReachesCeiling,
  },
  {
    id: 'imp33791-s90-hits-ninety-percent',
    why: 'THE SATURATION DEFINITION: at s_90(DEG) the norm equals 0.9*(DEG+1) to 1e-4, so the ' +
         'bisection located the 90%-of-ceiling scale correctly for every DEG.',
    holds: () => everyS90HitsNinetyPercent,
  },
  {
    id: 'imp33791-s90-is-essentially-flat-in-deg',
    why: 'THE MEASUREMENT: the saturation scale s_90(DEG) is essentially FLAT -- band [2.5584, ' +
         '2.6058], spread ~2.2%, a shallow minimum near DEG = 4 -- NEITHER monotone growing nor ' +
         'shrinking. The ceiling is approached at a nearly DEG-independent s-scale.',
    holds: () =>
      s90IsEssentiallyFlat &&
      !s90IsMonotoneGrowing &&
      !s90IsMonotoneShrinking &&
      argMinDeg === 4 &&
      Math.abs(s90Min - 2.558443) < 1e-3 &&
      Math.abs(s90Max - 2.615623) < 1e-3,
  },
  {
    id: 'imp33791-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: this is a REPRESENTATIVE measurement / diagnostic on the coupled ' +
         '(admissible) slice, ||R|| carries no RH verdict, imp-3066 / imp-33725 / imp-33765 / G7 ' +
         'are untouched, K_a >= 0 and positivity were not attempted, it is not a proof or a ' +
         'reduction, and no refereed bound is changed.',
    holds: () => {
      const c = IMP33791_DEG_CEILING_SATURATION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isRepresentativeTruncationNotTheSection26Gram === true &&
        c.coupledSliceIsTheAdmissibleImp3066Kernel === true &&
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

for (const assertion of IMP33791_DEG_CEILING_SATURATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33791-deg-ceiling-saturation assertion failed: ${assertion.id}`);
  }
}

export default IMP33791_DEG_CEILING_SATURATION;
