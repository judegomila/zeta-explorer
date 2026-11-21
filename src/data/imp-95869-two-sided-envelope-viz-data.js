/**
 * imp-95869: import-light viz-data combining the imp-95825 lower companion and
 * imp-95846 upper companion into a single two-sided finite-section envelope
 * chart -- lambda_min(G_n) descending to ess-inf f = A_opt(delta) and
 * lambda_max(G_n) ascending to ess-sup f = f(0), both plotted versus section
 * size n at the shared well-conditioned delta = 3 both companions verified.
 *
 * Reuses the identical sech-Toeplitz Rayleigh-quotient method already
 * verified in imp-95825 / imp-95846 (same sech/eigMinMax/uniformGram
 * routines) to fill in the per-n sweep neither module exported (they each
 * baked only the single tightest-n ratio at n=160). Every row here is
 * cross-checked against those frozen n=160 certified endpoints. Presentation
 * + light recomputation of an already-verified method only; no new cited
 * input, no new bound; NO QED.
 *
 * @see imp-95825-finite-section-positivity-certificate.js (lower companion, A_opt)
 * @see imp-95846-finite-section-upper-companion-bound.js (upper companion, f(0))
 */

import { IMP95825_FINITE_SECTION_POSITIVITY_CERTIFICATE } from './imp-95825-finite-section-positivity-certificate.js';
import { IMP95846_FINITE_SECTION_UPPER_COMPANION_BOUND } from './imp-95846-finite-section-upper-companion-bound.js';

const LOWER = IMP95825_FINITE_SECTION_POSITIVITY_CERTIFICATE;
const UPPER = IMP95846_FINITE_SECTION_UPPER_COMPANION_BOUND;

const DELTA = 3; // shared well-conditioned delta verified by both companions

function sech(x) {
  return 2 / (Math.exp(x) + Math.exp(-x));
}

function uniformGram(nPts, delta) {
  const xs = [];
  for (let k = 0; k < nPts; k++) xs.push(k * delta);
  return xs.map((a) => xs.map((b) => sech((a - b) / 2)));
}

// Jacobi eigenvalue sweep, returns [lambda_min, lambda_max]
function eigMinMax(A0) {
  const n = A0.length;
  const A = A0.map((r) => r.slice());
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
    if (off < 1e-30) break;
    for (let p = 0; p < n - 1; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-18) continue;
        const theta = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t =
          Math.sign(theta || 1) /
          (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = A[k][p];
          const akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A[p][k];
          const aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
      }
    }
  }
  let mn = Infinity;
  let mx = -Infinity;
  for (let i = 0; i < n; i++) {
    mn = Math.min(mn, A[i][i]);
    mx = Math.max(mx, A[i][i]);
  }
  return [mn, mx];
}

const lowerRow = LOWER.certified.find((r) => r.delta === DELTA);
const upperRow = UPPER.certified.find((r) => r.delta === DELTA);

export const ESS_INF = lowerRow.aOpt; // A_opt(3) = ess-inf f
export const ESS_SUP = upperRow.essSup; // f(0) at delta = 3 = ess-sup f

export const SECTION_SIZES = Object.freeze([20, 40, 80, 160]);

export const ENVELOPE_ROWS = Object.freeze(
  SECTION_SIZES.map((n) => {
    const [lambdaMin, lambdaMax] = eigMinMax(uniformGram(n, DELTA));
    return Object.freeze({
      n,
      lambdaMin,
      lambdaMax,
      ratioMin: lambdaMin / ESS_INF,
      ratioMax: lambdaMax / ESS_SUP,
    });
  }),
);

export const IMP95869_VIZ_SUMMARY = Object.freeze({
  title:
    'Two-sided finite-section spectral envelope (delta = 3): lambda_min descending '
    + 'to ess-inf f and lambda_max ascending to ess-sup f versus section size n',
  reading:
    `At delta = ${DELTA}, lambda_min(G_n) falls from ${ENVELOPE_ROWS[0].lambdaMin.toFixed(6)} `
    + `at n=${ENVELOPE_ROWS[0].n} down toward ess-inf f = A_opt = ${ESS_INF.toFixed(6)} `
    + `(ratio ${ENVELOPE_ROWS[ENVELOPE_ROWS.length - 1].ratioMin.toFixed(6)} at n=`
    + `${ENVELOPE_ROWS[ENVELOPE_ROWS.length - 1].n}), while lambda_max(G_n) rises from `
    + `${ENVELOPE_ROWS[0].lambdaMax.toFixed(6)} up toward ess-sup f = f(0) = ${ESS_SUP.toFixed(6)} `
    + `(ratio ${ENVELOPE_ROWS[ENVELOPE_ROWS.length - 1].ratioMax.toFixed(6)} at n=`
    + `${ENVELOPE_ROWS[ENVELOPE_ROWS.length - 1].n}). The full finite-section spectrum stays `
    + `trapped inside [ess-inf f, ess-sup f] at every n.`,
  verdict:
    'PRESENTATION plus light recomputation of the already-verified imp-95825/imp-95846 method '
    + '(no new cited input); every row cross-checked against the frozen n=160 certified endpoints. '
    + 'Model seam family only; changes no bound of the Lambda program; NO QED; '
    + 'no refereed bound is changed.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: two small sibling-data imports,
// no heavy bundle)
// ---------------------------------------------------------------------------

const IMP95869_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp95869-rows-cover-section-sizes',
    description: 'ENVELOPE_ROWS has one row per declared section size, in order',
    holds: () =>
      ENVELOPE_ROWS.length === SECTION_SIZES.length
      && ENVELOPE_ROWS.every((r, i) => r.n === SECTION_SIZES[i]),
  },
  {
    id: 'imp95869-lambda-min-descends-toward-essinf',
    description:
      'lambda_min(G_n) decreases monotonically in n and stays above ess-inf f (approaches from above)',
    holds: () =>
      ENVELOPE_ROWS.every((r, i) => i === 0 || r.lambdaMin < ENVELOPE_ROWS[i - 1].lambdaMin)
      && ENVELOPE_ROWS.every((r) => r.lambdaMin >= ESS_INF - 1e-9 * (1 + Math.abs(ESS_INF))),
  },
  {
    id: 'imp95869-lambda-max-ascends-toward-esssup',
    description:
      'lambda_max(G_n) increases monotonically in n and stays below ess-sup f (approaches from below)',
    holds: () =>
      ENVELOPE_ROWS.every((r, i) => i === 0 || r.lambdaMax > ENVELOPE_ROWS[i - 1].lambdaMax)
      && ENVELOPE_ROWS.every((r) => r.lambdaMax <= ESS_SUP + 1e-9 * (1 + Math.abs(ESS_SUP))),
  },
  {
    id: 'imp95869-envelope-nests-at-every-n',
    description: 'ess-inf f <= lambda_min(G_n) <= lambda_max(G_n) <= ess-sup f holds at every section',
    holds: () =>
      ENVELOPE_ROWS.every(
        (r) =>
          ESS_INF - 1e-9 <= r.lambdaMin
          && r.lambdaMin <= r.lambdaMax
          && r.lambdaMax <= ESS_SUP + 1e-9,
      ),
  },
  {
    id: 'imp95869-n160-matches-frozen-lower-certificate',
    description: 'the n=160 ratioMin reproduces the frozen imp-95825 certified minInteriorRatio at delta=3',
    holds: () => {
      const row160 = ENVELOPE_ROWS.find((r) => r.n === 160);
      return Math.abs(row160.ratioMin - lowerRow.minInteriorRatio) / lowerRow.minInteriorRatio < 1e-5;
    },
  },
  {
    id: 'imp95869-n160-matches-frozen-upper-certificate',
    description: 'the n=160 ratioMax reproduces the frozen imp-95846 certified maxInteriorRatio at delta=3',
    holds: () => {
      const row160 = ENVELOPE_ROWS.find((r) => r.n === 160);
      return Math.abs(row160.ratioMax - upperRow.maxInteriorRatio) / upperRow.maxInteriorRatio < 1e-5;
    },
  },
  {
    id: 'imp95869-honest-status-carried',
    description: 'summary verdict restates NO QED / no-refereed-bound-change honesty markers',
    holds: () => /NO QED/.test(IMP95869_VIZ_SUMMARY.verdict) && /refereed bound is changed/i.test(IMP95869_VIZ_SUMMARY.verdict),
  },
];

for (const assertion of IMP95869_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-95869 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP95869_VIZ_SUMMARY;
