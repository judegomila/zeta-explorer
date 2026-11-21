/**
 * @module imp-33802-perron-norm-curve-viz-data
 * @fileoverview imp-33802 -- lightweight viz-data module for the imp-33765 G7
 *   obstruction: packages (i) the ||R||(s) monotone curve toward the DEG+1
 *   all-ones Perron ceiling and (ii) the decoupled-rate softening probe
 *   ||R||(s_b) at fixed s_a = 3, ready for a log/linear chart.
 *
 *   Self-computing the Perron norm from the SAME representative imp-3066
 *   monomial-truncation integrals imp-33765 / imp-33789 use --
 *   d_j(s) = int_0^1 cosh(s*x) x^{2j} dx, h_jk(s) = int_0^1 sinh(s*x) x^{j+k} dx --
 *   no heavy zeros-bundle import, no fresh derivation, mirroring the
 *   imp-33781 / imp-33782 self-computing viz-data pattern.
 *
 *   @see imp-33765-g7-obstruction-orthogonal-lever.js (the ||R||(s) one-dimensionality derivation + the three-point decoupled probe)
 *   @see imp-33789-decoupled-rate-grid.js (the full two-parameter decoupled grid + ||R||=1 contour)
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (imp-3066: the single-cell G7 magnitude)
 */

const DEG = 4;      // same representative (DEG+1) x (DEG+1) truncation as imp-3066 / imp-33765 / imp-33789
const NQ = 4000;    // midpoint quadrature panels (matches imp-3066 / imp-33765 / imp-33789)

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
 * Copied verbatim from imp-3066 / imp-33765 / imp-33789 so this module reads the SAME spectrum.
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

/** The DECOUPLED-rate Perron norm: PASS form at sPass, SHEAR form at sShear (imp-33765 / imp-33789). */
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

/** The ADMISSIBLE coupled cell: the imp-3066 R as a function of s = a*U alone. */
function coupledNorm(s) {
  return perronNorm(s, s);
}

// -- (i) The ||R||(s) monotone curve, toward the DEG+1 all-ones Perron ceiling ------------------
const PERRON_CEILING = DEG + 1;
const S_LADDER = Object.freeze([0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32]);
const PERRON_NORM_CURVE = Object.freeze(
  S_LADDER.map((s) => Object.freeze({ s, operatorNorm: coupledNorm(s) })),
);
let curveMonotoneTowardCeiling = true;
for (let i = 1; i < PERRON_NORM_CURVE.length; i++) {
  if (PERRON_NORM_CURVE[i].operatorNorm <= PERRON_NORM_CURVE[i - 1].operatorNorm) curveMonotoneTowardCeiling = false;
}
const curveApproachesCeilingFromBelow = PERRON_NORM_CURVE.every((p) => p.operatorNorm < PERRON_CEILING);

// -- (ii) The decoupled-rate softening series ||R||(s_b) at fixed s_a = 3 ----------------------
const ANCHOR_SHEAR = 3;
const PASS_RATE_LADDER = Object.freeze([1, 2, 3, 4, 6]);
const DECOUPLED_SOFTENING_SERIES = Object.freeze(
  PASS_RATE_LADDER.map((sPass) => Object.freeze({ sPass, sShear: ANCHOR_SHEAR, operatorNorm: perronNorm(ANCHOR_SHEAR, sPass) })),
);
let softeningSeriesMonotoneDecreasing = true;
for (let i = 1; i < DECOUPLED_SOFTENING_SERIES.length; i++) {
  if (DECOUPLED_SOFTENING_SERIES[i].operatorNorm >= DECOUPLED_SOFTENING_SERIES[i - 1].operatorNorm) softeningSeriesMonotoneDecreasing = false;
}
const UNITY_LINE = 1; // the ||R|| = 1 reference line marked on the softening chart

export const IMP33802_PERRON_NORM_CURVE_VIZ_DATA = Object.freeze({
  id: 'imp-33802-perron-norm-curve-viz-data',
  ticket: 'imp-33802',
  relatedOrthogonalLever: 'imp-33765-g7-obstruction-orthogonal-lever.js',
  relatedDecoupledGrid: 'imp-33789-decoupled-rate-grid.js',
  relatedObstruction: 'imp-3066-offdiagonal-hankel-obstruction.js',
  roadmapNode: 'G7',

  summary:
    'Viz-data packaging of the imp-33765 ||R||(s) monotone curve (toward the DEG+1 = 5 all-ones ' +
    'Perron ceiling) and the fixed-s_a=3 decoupled-rate softening series ||R||(s_b), each ' +
    'self-computed from the SAME representative imp-3066 monomial-truncation integrals -- no ' +
    'heavy import, no fresh derivation.',

  construction: Object.freeze({
    degree: DEG,
    quadraturePanels: NQ,
    coupledKernel: 'R_jk = h_jk(s) / sqrt(d_j(s) d_k(s)), d_j(s) = int_0^1 cosh(s*x) x^{2j} dx, h_jk(s) = int_0^1 sinh(s*x) x^{j+k} dx',
    decoupledProbe: 'PASS form at sPass, SHEAR form at sShear (imp-33765 diagnostic generalisation); admissible slice is sPass = sShear',
  }),

  perronCeiling: PERRON_CEILING,
  perronNormCurve: PERRON_NORM_CURVE,
  curveMonotoneTowardCeiling,
  curveApproachesCeilingFromBelow,

  decoupledSofteningAnchorShear: ANCHOR_SHEAR,
  decoupledSofteningSeries: DECOUPLED_SOFTENING_SERIES,
  softeningSeriesMonotoneDecreasing,
  unityLine: UNITY_LINE,

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    decoupledProbeIsDiagnosticNotAdmissibleModification: true,
    imp3066Untouched: true,
    imp33765Untouched: true,
    imp33789Untouched: true,
    didNotAttemptPositivity: true,
    carriesNoRHVerdict: true,
    isRigorous: false,
    sota: 'No refereed bound is changed.',
    honestyLock:
      'Viz-data / structural diagnostic only, NO QED; C_mb GUE-conditional (imp-486) untouched; ' +
      'no refereed bound is changed.',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP33802_PERRON_NORM_CURVE_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp33802-anchor-matches-imp33765',
    why: 'The s = 3 point on the coupled curve must reproduce the imp-33765 / imp-33789 anchor ' +
         '||R|| ~ 4.617014. A mismatch means the inherited construction drifted.',
    holds: () => Math.abs(coupledNorm(3) - 4.617014) < 1e-5,
  },
  {
    id: 'imp33802-curve-monotone-toward-ceiling',
    why: 'THE (i) CURVE: ||R||(s) must rise monotonically with s and stay strictly below the ' +
         'DEG+1 = 5 all-ones Perron ceiling across the whole ladder (saturation, never crossing).',
    holds: () => curveMonotoneTowardCeiling && curveApproachesCeilingFromBelow,
  },
  {
    id: 'imp33802-softening-series-matches-imp33765',
    why: 'THE (ii) SOFTENING SERIES: the three imp-33765 decoupled points at s_a = 3 must ' +
         'reproduce -- ||R|| ~ 20.94 (s_b=1), ~4.617 (s_b=3, coupled anchor), ~0.338 (s_b=6).',
    holds: () =>
      Math.abs(DECOUPLED_SOFTENING_SERIES[0].operatorNorm - 20.9396) < 1e-2 &&
      Math.abs(DECOUPLED_SOFTENING_SERIES[2].operatorNorm - 4.617014) < 1e-3 &&
      Math.abs(DECOUPLED_SOFTENING_SERIES[4].operatorNorm - 0.338311) < 1e-3,
  },
  {
    id: 'imp33802-softening-series-monotone-decreasing',
    why: 'The decoupled softening series must fall monotonically as the pass rate s_b rises, ' +
         'and must bracket the unity line (some point above 1, some below).',
    holds: () =>
      softeningSeriesMonotoneDecreasing &&
      DECOUPLED_SOFTENING_SERIES[0].operatorNorm > UNITY_LINE &&
      DECOUPLED_SOFTENING_SERIES[DECOUPLED_SOFTENING_SERIES.length - 1].operatorNorm < UNITY_LINE,
  },
  {
    id: 'imp33802-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: viz-data only, decoupled probe is diagnostic (not an admissible ' +
         'imp-3066 modification), no RH verdict, imp-3066 / imp-33765 / imp-33789 untouched, ' +
         'positivity not attempted, no refereed bound is changed.',
    holds: () => {
      const c = IMP33802_PERRON_NORM_CURVE_VIZ_DATA.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isRepresentativeTruncationNotTheSection26Gram === true &&
        c.decoupledProbeIsDiagnosticNotAdmissibleModification === true &&
        c.imp3066Untouched === true &&
        c.imp33765Untouched === true &&
        c.imp33789Untouched === true &&
        c.didNotAttemptPositivity === true &&
        c.carriesNoRHVerdict === true &&
        c.isRigorous === false &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota) &&
        /NO QED/.test(c.honestyLock)
      );
    },
  },
];

for (const assertion of IMP33802_PERRON_NORM_CURVE_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33802-perron-norm-curve-viz-data assertion failed: ${assertion.id}`);
  }
}

export default IMP33802_PERRON_NORM_CURVE_VIZ_DATA;
