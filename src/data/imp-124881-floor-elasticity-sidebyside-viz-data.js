/**
 * @module imp-124881-floor-elasticity-sidebyside-viz-data
 *
 * imp-124881 (ux, visualization leaf): a presentation-only side-by-side panel plotting the imp-124848
 * interior-peak (p_peak_lsq ~ -1.412) and imp-124772 far-tail (p_knee_lsq ~ -2.106) floor-elasticity
 * OLS fits over the SAME imp-33708 0.5x..5x E_trunc floor ladder. Every point and fit parameter is
 * REUSED VERBATIM from imp-124772 (the far-tail full-ladder OLS) and imp-124848 (the interior-peak
 * full-ladder OLS); this leaf only derives the two fit-line endpoints and per-floor residuals for
 * plotting, it does not re-run either regression.
 *
 * @see imp-124772-knee-floor-elasticity-multifloor-fit (far-tail full-ladder OLS, p_knee_lsq ~ -2.106)
 * @see imp-124848-sigma-interior-peak-floor-elasticity-multifloor-fit (interior-peak full-ladder OLS, p_peak_lsq ~ -1.412)
 */

import { IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY } from './imp-97822-sigma-knee-etrunc-floor-elasticity.js';
import { IMP33684_SIGMA_INTERIOR_PEAK_ETRUNC_MODEL_SENSITIVITY } from './imp-33684-sigma-interior-peak-etrunc-model-sensitivity.js';
import { IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT } from './imp-124772-knee-floor-elasticity-multifloor-fit.js';
import { IMP124848_SIGMA_INTERIOR_PEAK_FLOOR_ELASTICITY_MULTIFLOOR_FIT } from './imp-124848-sigma-interior-peak-floor-elasticity-multifloor-fit.js';

// Raw (log10 E_trunc, log10 N*) points, reused verbatim from the two source sweeps.
export const IMP124881_KNEE_POINTS = IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY.floorSweep
  .filter((r) => r.log10Nstar !== null)
  .map((r) => ({ floorFactor: r.floorFactor, E_trunc: r.E_trunc, logY: r.log10Nstar }));

export const IMP124881_PEAK_POINTS = IMP33684_SIGMA_INTERIOR_PEAK_ETRUNC_MODEL_SENSITIVITY.sensitivityTable
  .filter((r) => r.log10_N_max !== null && Number.isFinite(r.log10_N_max))
  .map((r) => ({ floorFactor: r.floorFactor, E_trunc: r.E_trunc, logY: r.log10_N_max }));

const KNEE_FIT = IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT.fit;
const PEAK_FIT = IMP124848_SIGMA_INTERIOR_PEAK_FLOOR_ELASTICITY_MULTIFLOOR_FIT.fit;

function fitLineEndpoints(points, slope, intercept) {
  const xs = points.map((p) => Math.log10(p.E_trunc));
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const line = (x) => slope * x + intercept;
  return [
    { logE_trunc: xMin, logY: line(xMin) },
    { logE_trunc: xMax, logY: line(xMax) },
  ];
}

// Fit-line endpoints (reused verbatim slope/intercept from each certified fit).
export const IMP124881_KNEE_FIT_LINE = fitLineEndpoints(IMP124881_KNEE_POINTS, KNEE_FIT.slope, KNEE_FIT.intercept);
export const IMP124881_PEAK_FIT_LINE = fitLineEndpoints(IMP124881_PEAK_POINTS, PEAK_FIT.slope, PEAK_FIT.intercept);

// Per-floor residuals (decades), reused verbatim from each certified fit.
export const IMP124881_KNEE_RESIDUALS = KNEE_FIT.residuals;
export const IMP124881_PEAK_RESIDUALS = PEAK_FIT.residuals;

export const IMP124881_SUMMARY = {
  knee: {
    slope: KNEE_FIT.slope,
    r2: KNEE_FIT.r2,
    rmsResidualDecades: KNEE_FIT.rmsResidualDecades,
    maxAbsResidualDecades: KNEE_FIT.maxAbsResidualDecades,
  },
  peak: {
    slope: PEAK_FIT.slope,
    r2: PEAK_FIT.r2,
    rmsResidualDecades: PEAK_FIT.rmsResidualDecades,
    maxAbsResidualDecades: PEAK_FIT.maxAbsResidualDecades,
  },
  exponentGap: IMP124848_SIGMA_INTERIOR_PEAK_FLOOR_ELASTICITY_MULTIFLOOR_FIT.exponentComparison.gap_to_fartail_knee, // ~0.69
  residualRatio: IMP124848_SIGMA_INTERIOR_PEAK_FLOOR_ELASTICITY_MULTIFLOOR_FIT.residualRatioToFartail, // ~5x
};

export const IMP124881_VERDICT = IMP124848_SIGMA_INTERIOR_PEAK_FLOOR_ELASTICITY_MULTIFLOOR_FIT.verdict;

export const IMP124881_ASSERTIONS = [
  {
    id: 'imp124881-both-ladders-full-length',
    description: 'both sweeps carry all ten imp-33708 floor factors',
    holds: () => IMP124881_KNEE_POINTS.length === 10 && IMP124881_PEAK_POINTS.length === 10,
  },
  {
    id: 'imp124881-fit-lines-span-data-range',
    description: 'each fit line spans the min/max log10(E_trunc) of its own sweep',
    holds: () =>
      IMP124881_KNEE_FIT_LINE[0].logE_trunc < IMP124881_KNEE_FIT_LINE[1].logE_trunc &&
      IMP124881_PEAK_FIT_LINE[0].logE_trunc < IMP124881_PEAK_FIT_LINE[1].logE_trunc,
  },
  {
    id: 'imp124881-peak-slope-shallower-than-knee-slope',
    description: 'the interior-peak slope (~ -1.412) is shallower (less negative) than the far-tail knee slope (~ -2.106)',
    holds: () => IMP124881_SUMMARY.peak.slope > IMP124881_SUMMARY.knee.slope,
  },
  {
    id: 'imp124881-exponent-gap-matches-summary',
    description: 'the knee-vs-peak slope gap matches the reused imp-124848 gap_to_fartail_knee to 2 decimals',
    holds: () =>
      Math.abs(
        Math.abs(IMP124881_SUMMARY.knee.slope - IMP124881_SUMMARY.peak.slope) - IMP124881_SUMMARY.exponentGap,
      ) < 0.01,
  },
];

for (const a of IMP124881_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124881-floor-elasticity-sidebyside-viz-data assertion failed: ${a.id}`);
  }
}
