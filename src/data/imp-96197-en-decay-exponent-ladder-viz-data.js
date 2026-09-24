/**
 * @module imp-96197-en-decay-exponent-ladder-viz-data
 *
 * imp-96197 (presentation, import-light): baked-literal viz data for the
 * imp-96166 E(N) decay-exponent ladder -- the E_coll-dominated regime
 * (p ~ 0.42..0.47, the sqrt(log T0 / N) leading order) collapsing to the
 * frozen E_trunc floor past the crossover N_x ~ 3.28e9.
 *
 * All numbers are re-exported verbatim from imp-96166 (no re-derivation, no
 * fresh computation, no zeros bundle import). Presentation only; changes no
 * bound; NO QED.
 *
 * @see imp-96166-en-decay-exponent-vs-step4-bridge-threshold (source of every number below)
 */

import { IMP96166_EN_DECAY_EXPONENT_VS_STEP4_BRIDGE } from './imp-96166-en-decay-exponent-vs-step4-bridge-threshold.js';

const f = IMP96166_EN_DECAY_EXPONENT_VS_STEP4_BRIDGE;

export const IMP96197_EN_DECAY_EXPONENT_LADDER_VIZ = {
  id: 'imp-96197',
  axisLabel: 'log10 N',
  ladder: f.table.map((r) => ({
    N: r.N,
    log10N: Math.log10(r.N),
    E_N: r.E_N,
    localDecayExp: r.localDecayExp,
    E_coll_share: r.E_coll_share,
  })),
  crossover: f.crossover,
  regimeExponents: f.regimeExponents,
  residualShortfall: f.residualShortfall,
  verdict: f.verdict,
  caption:
    'The measured local decay exponent p(N) = -dlogE(N)/dlogN sits near the ' +
    'sqrt-law ' +
    f.regimeExponents.peakDecayExp.toFixed(2) +
    ' while E_coll dominates (N below the crossover N_x ~ ' +
    f.crossover.N.toExponential(3) +
    '), then collapses toward ' +
    f.regimeExponents.finalDecayExp.toFixed(2) +
    ' as E(N) plateaus at the frozen E_trunc floor ' +
    f.residualShortfall.E_floor.toExponential(3) +
    ' -- the residual shortfall against the Step-4 bridge threshold requiring ' +
    'a sustained strictly-positive exponent.',
};
