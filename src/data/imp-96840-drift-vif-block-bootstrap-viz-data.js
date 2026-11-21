/**
 * @module imp-96840-drift-vif-block-bootstrap-viz-data
 *
 * imp-96840 (ux): import-light viz-data leaf for the imp-96709/imp-96786 drift-VIF
 * moving block bootstrap. imp-96709 measured the Route M drift variance-inflation
 * factor (VIF) DIRECTLY from the imp-96487 21-rung ladder (moving block bootstrap,
 * B=4e5 resamples) across block lengths b=2..5: VIF = 1.409 / 1.700 / 1.789 / 1.727,
 * stable and selecting b=3 (~ m^(1/3)) as primary. This module reshapes that ladder
 * plus the three imp-96692 model-based estimates (AR(1) 2.578 / integrated-ACF 2.136 /
 * oscillation-coherence 4.645) into a chart-ready series (block length vs VIF, with the
 * three model estimates as reference lines), so the "MBB is stable and sits below every
 * model-based estimate" reading can be seen at a glance.
 *
 * No re-derivation: every b/VIF point and every imp-96692 estimate is copied verbatim
 * from imp-96709 (which itself copies the imp-96692 estimates unchanged). The only new
 * arithmetic here is reshaping into a plot-ready points array and per-point deltas
 * against the lowest model-based estimate (integrated-ACF).
 *
 * @see imp-96709-route-m-drift-vif-block-bootstrap.js (the source measurement this reshapes)
 * @see imp-96692-route-m-reach-drift-covariance-inflation.js (the three model-based estimates)
 * @see imp-96786-drift-vif-block-bootstrap-glossary-headword.js (the sibling glossary headword)
 *
 * Ticket: imp-96840 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound;
 * NO QED. No self-executing assertion throw (per the imp-96294/imp-96819 convention) --
 * values are validated below via a plain exported check object instead of an import-time throw.
 */

import {
  IMP96709_BOOTSTRAP as BOOTSTRAP,
  IMP96709_IMP96692_ESTIMATES as MODEL_ESTIMATES,
  IMP96709_SELECTED_VIF as SELECTED,
} from './imp-96709-route-m-drift-vif-block-bootstrap.js';

// FINDING (B): the stable MBB ladder, reshaped for a line/point chart (x = block length).
export const IMP96840_MBB_POINTS = BOOTSTRAP.mbb.map((r) => ({
  b: r.b,
  VIF: r.VIF,
  belowLowestModelEstimate: r.VIF < MODEL_ESTIMATES.integratedAcf,
  isPrimary: r.b === SELECTED.bStar,
}));

// The three imp-96692 model-based estimates, as horizontal reference lines.
export const IMP96840_MODEL_REFERENCE_LINES = Object.freeze([
  { key: 'integratedAcf', label: 'integrated-ACF', value: MODEL_ESTIMATES.integratedAcf },
  { key: 'ar1', label: 'AR(1) primary', value: MODEL_ESTIMATES.ar1 },
  { key: 'oscillationCoherence', label: 'oscillation-coherence', value: MODEL_ESTIMATES.oscillationCoherence },
]);

// Per-point gap to the lowest model-based estimate (integrated-ACF), for a delta chart.
export const IMP96840_GAP_TO_LOWEST_ESTIMATE = IMP96840_MBB_POINTS.map((p) => ({
  b: p.b,
  VIF: p.VIF,
  gapToIntegratedAcf: MODEL_ESTIMATES.integratedAcf - p.VIF,
}));

export const IMP96840_LANDMARKS = Object.freeze({
  primaryB: SELECTED.bStar,
  primaryVIF: SELECTED.value,
  mbbBandLow: SELECTED.bandLow,
  mbbBandHigh: SELECTED.bandHigh,
  lowestModelEstimate: MODEL_ESTIMATES.integratedAcf,
});

export const IMP96840_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every block-length/VIF ' +
  'point and every model-based estimate plotted here is copied verbatim from imp-96709 ' +
  '(which itself copies the imp-96692 estimates unchanged); the only new arithmetic is the ' +
  'plot-ready reshaping and the per-point gap-to-lowest-estimate delta. Measurement/' +
  'reconciliation only: the block-bootstrap VIF sitting below every model-based estimate ' +
  'changes no bound and establishes no operator positivity.';

// -- plain validation object (no self-executing throw; the imp-96294/imp-96819 convention) --
export const IMP96840_VALIDATION = Object.freeze({
  fourPointsPresent: IMP96840_MBB_POINTS.length === 4,
  allBelowLowestModelEstimate: IMP96840_MBB_POINTS.every((p) => p.belowLowestModelEstimate),
  exactlyOnePrimary: IMP96840_MBB_POINTS.filter((p) => p.isPrimary).length === 1,
  gapsAllPositive: IMP96840_GAP_TO_LOWEST_ESTIMATE.every((p) => p.gapToIntegratedAcf > 0),
});
