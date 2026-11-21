/**
 * imp-95647: import-light viz-data for the imp-95621 summation condition number
 * kappa(delta) ~ (1/2) exp(pi^2/delta) and the alternating-form relative error it
 * predicts, sampled over a delta grid that straddles the delta* ~ 0.307 float-trap
 * threshold (imp-95419/imp-95601 mandate boundary).
 *
 * Re-implements the imp-95621 numeric kernel standalone (no imports, no 16.7MB
 * zeros bundle) so a semilog chart can be baked at render-friendly resolution.
 *
 * MEASUREMENT ONLY. Changes no bound; NO QED; no refereed bound is changed.
 *
 * @see imp-95621-alt-form-precision-threshold (source derivation this re-plots)
 */

// ---------------------------------------------------------------------------
// Numeric kernel (import-light: standalone reimplementation, no imports)
// ---------------------------------------------------------------------------

const sech = (x) => 1 / Math.cosh(x);
const EPS = Number.EPSILON;

function aOptTheta(delta) {
  let s = 0;
  for (let n = 0; n < 5000; n++) {
    const term = sech((Math.PI * Math.PI * (2 * n + 1)) / delta);
    s += term;
    if (n > 4 && term < 1e-40 * (s || 1)) break;
  }
  return ((4 * Math.PI) / delta) * s;
}

function aOptAlt(delta) {
  let s = 1;
  for (let n = 1; n < 200000; n++) {
    const term = 2 * (n % 2 ? -1 : 1) * sech((n * delta) / 2);
    s += term;
    if (n > 10 && Math.abs(term) < 1e-25) break;
  }
  return s;
}

function aOptAbsSum(delta) {
  let s = 1;
  for (let n = 1; n < 200000; n++) {
    const term = 2 * sech((n * delta) / 2);
    s += term;
    if (n > 10 && term < 1e-25) break;
  }
  return s;
}

function measuredRelErr(delta) {
  const t = aOptTheta(delta);
  return Math.abs(aOptAlt(delta) - t) / Math.abs(t);
}

function condNumber(delta) {
  return aOptAbsSum(delta) / aOptTheta(delta);
}

const DELTA_STAR = (Math.PI * Math.PI) / Math.log(0.02 / EPS);

// ---------------------------------------------------------------------------
// Baked grid: delta in [0.15, 0.75], log-spaced measured relative error and the
// kappa(delta)*EPS predictor, straddling delta* ~ 0.307.
// ---------------------------------------------------------------------------

const N_GRID = 37;
const DELTA_LO = 0.15;
const DELTA_HI = 0.75;
const deltaAt = (i) => DELTA_LO + ((DELTA_HI - DELTA_LO) * i) / (N_GRID - 1);

export const IMP95647_ROWS = Array.from({ length: N_GRID }, (_, i) => {
  const delta = deltaAt(i);
  const kappa = condNumber(delta);
  const predicted = kappa * EPS;
  const measured = measuredRelErr(delta);
  return {
    delta: Number(delta.toFixed(5)),
    kappa: Number(kappa.toPrecision(8)),
    predictedRelErr: predicted,
    measuredRelErr: measured,
  };
});

export const IMP95647_DELTA_STAR = {
  analytic: DELTA_STAR,
  ratioAnalytic: Math.exp(DELTA_STAR),
  measuredRelErrAtStar: measuredRelErr(DELTA_STAR),
};

export const IMP95647_TWO_SAMPLED_POINTS = {
  ln13: { delta: Math.log(1.3), measuredRelErr: measuredRelErr(Math.log(1.3)), verdict: 'TRAP' },
  ln2: { delta: Math.log(2), measuredRelErr: measuredRelErr(Math.log(2)), verdict: 'CLEAN' },
};

export const IMP95647_SUMMARY = {
  gridScope: `delta in [${DELTA_LO}, ${DELTA_HI}] (${N_GRID} steps), re-plotting imp-95621`,
  deltaStar: IMP95647_DELTA_STAR.analytic,
  onePercentCrossing:
    'kappa(delta)*EPS crosses 1 percent relative error at delta* ~ 0.307 (ratio r ~ 1.36); ' +
    'below delta* the alternating form is trapped by cancellation, above it the form is clean.',
  verdict:
    'MEASUREMENT ONLY; changes no bound; NO QED; no refereed bound is changed. ' +
    'Re-plots the imp-95621 condition-number threshold derivation at render-friendly resolution.',
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP95647_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp95647-grid-length-matches',
    holds: () => IMP95647_ROWS.length === N_GRID,
  },
  {
    id: 'imp95647-delta-star-near-expected',
    holds: () => Math.abs(IMP95647_DELTA_STAR.analytic - 0.30716) < 5e-4,
  },
  {
    id: 'imp95647-low-delta-trapped-high-delta-clean',
    holds: () =>
      IMP95647_ROWS[0].measuredRelErr > 0.01 &&
      IMP95647_ROWS[IMP95647_ROWS.length - 1].measuredRelErr < 1e-6,
  },
  {
    id: 'imp95647-measured-error-decreasing-over-decades',
    // The alternating cancellation error falls across 20+ orders of magnitude as delta grows;
    // per-step blips from summation-order roundoff are expected once the error nears the double-
    // precision floor, so this checks the coarse trend at widely spaced anchors, not every step.
    holds: () => {
      const at = (d) => IMP95647_ROWS.find((r) => Math.abs(r.delta - d) < 1e-9).measuredRelErr;
      return at(0.15) > 1 && at(0.3) < 1e-2 && at(0.45) < 1e-7 && at(0.75) < 1e-9;
    },
  },
  {
    id: 'imp95647-two-sampled-points-match-mandate',
    holds: () =>
      IMP95647_TWO_SAMPLED_POINTS.ln13.measuredRelErr > 0.01 &&
      IMP95647_TWO_SAMPLED_POINTS.ln2.measuredRelErr < 1e-9,
  },
  {
    id: 'imp95647-honesty-gate-no-qed',
    holds: () => /NO QED/.test(IMP95647_SUMMARY.verdict) && /refereed bound is changed/i.test(IMP95647_SUMMARY.verdict),
  },
];

for (const a of IMP95647_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95647-condition-number-viz-data assertion failed: ${a.id}`);
  }
}
