/**
 * @module imp-96176-sigma-closed-form-ladder-viz-data
 *
 * imp-96176 (presentation, import-light): baked-literal viz data for the imp-96151
 * closed-form conditional-share model sigma_CF(N) vs the full three-term share
 * sigma_full(N), over the U-shape peak (imp-3220) and the right-arm decay past 1e12.
 *
 * All numbers are re-exported verbatim from imp-96151 (no re-derivation, no fresh
 * computation, no zeros bundle import). Presentation only; changes no bound; NO QED.
 *
 * @see imp-96151-sigma-closed-form-crossover-fartail-reproduction (source of every number below)
 */

import { IMP96151_SIGMA_CLOSED_FORM_CROSSOVER_FARTAIL_REPRODUCTION } from './imp-96151-sigma-closed-form-crossover-fartail-reproduction.js';

const f = IMP96151_SIGMA_CLOSED_FORM_CROSSOVER_FARTAIL_REPRODUCTION;

export const IMP96176_SIGMA_CLOSED_FORM_LADDER_VIZ = {
  id: 'imp-96176',
  axisLabel: 'log10 N',
  N_cross: f.landmarks.N_cross,
  sigmaCFAtNCross: f.landmarks.sigma_CF_at_N_cross,
  maxRelGap: f.landmarks.max_rel_gap_full_vs_CF_1e10_1e100,
  rampPast1e12: f.rampPast1e12,
  uShape: f.uShape,
  survivingShare: f.survivingShare,
  farTailExponent: f.farTailExponent,
  caption:
    'The imp-96151 closed-form share sigma_CF(N) = 1/(1 + sqrt(N/N_cross) sqrt(L_cross/L(N))) ' +
    '(N_cross ~ ' +
    f.landmarks.N_cross.toExponential(3) +
    ') reproduces the full-share decay-exponent ramp past 1e12 to within a max relative gap ' +
    'of ' +
    f.landmarks.max_rel_gap_full_vs_CF_1e10_1e100.toExponential(2) +
    ', but stays strictly monotone decreasing over [1e2,1e12] and so misses the imp-3220 ' +
    'U-shape peak entirely -- the peak is an E_flow effect the crossover model omits.',
};
