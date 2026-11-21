/**
 * @module imp-96534-ar-effective-count-ladder-viz-data
 *
 * imp-96534 (ux): import-light viz-data leaf for the imp-96489/imp-96509 AR effective-count
 * ladder. Reshapes the imp-96509 AR-0/AR-1/AR-2/AR-3 stages (n_eff and z_eff climbing as
 * successive negative higher-lag corrections are folded in) plus the imp-96489 conservative
 * naive floor into chart-ready rows, so the page can render the ladder without re-deriving
 * anything.
 *
 * No re-derivation: every n_eff/z_eff/correlation value is copied verbatim from
 * IMP96509_EXCURSION_EFFECTIVE_SIGNIFICANCE_AR2 (which itself reproduces the imp-96489 AR-1
 * baseline exactly). Presentation only; changes no bound; establishes no operator positivity;
 * RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96509-excursion-effective-significance-ar2.js (the source object this reshapes)
 * @see imp-96489-excursion-effective-significance-direct-rho.js (the AR-1 base model)
 *
 * Ticket: imp-96534 (ux, sonnet-4-6, low). Plain exported validation object (imp-96294
 * convention), no self-executing assertion throw.
 */

import { IMP96509_EXCURSION_EFFECTIVE_SIGNIFICANCE_AR2 as SRC } from './imp-96509-excursion-effective-significance-ar2.js';

// AR-0 = the imp-96489 conservative naive floor (no correlation credit, n_w = 291 directly).
export const IMP96534_LADDER_ROWS = Object.freeze([
  Object.freeze({ stage: 'AR-0 (naive)', nEff: SRC.inputs.nW, zEff: SRC.reconciliation.zConservativeFloor }),
  Object.freeze({ stage: 'AR-1', nEff: SRC.models.ar1.nEff, zEff: SRC.models.ar1.zEff }),
  Object.freeze({ stage: 'AR-2', nEff: SRC.models.ar2.nEff, zEff: SRC.models.ar2.zEff }),
  Object.freeze({ stage: 'AR-3', nEff: SRC.models.ar3.nEff, zEff: SRC.models.ar3.zEff }),
]);

export const IMP96534_LANDMARKS = Object.freeze({
  zConservativeFloor: SRC.reconciliation.zConservativeFloor, // 1.923422
  zTarget: SRC.reconciliation.zTarget, // 2.0
  rhoCrit: SRC.inputs.rho1 < 0 ? 0.57443 : SRC.inputs.rho1, // +0.57443 positive-flip threshold
});

export const IMP96534_CORRELATIONS = Object.freeze([
  Object.freeze({ lag: 1, rho: SRC.inputs.rho1 }),
  Object.freeze({ lag: 2, rho: SRC.inputs.rho2 }),
  Object.freeze({ lag: 3, rho: SRC.inputs.rho3 }),
]);

export const IMP96534_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every n_eff/z_eff/correlation '
  + 'value plotted here is copied verbatim from the imp-96509 AR(p) resummation (which reproduces the '
  + 'imp-96489 AR-1 baseline exactly); the lag-2/lag-3 inputs are theoretical GUE sine-process box '
  + 'correlations, not empirical zero covariances, so the AR-2/AR-3 figures are indicative, not '
  + 'precise. The headline conservative z_cons = 1.9234 floor is unchanged and remains the strict '
  + 'lower bound. Derivation/measurement diagnostic only, not rigorous; changes no bound, establishes '
  + 'no operator positivity.';

// -- plain validation object (no self-executing throw; the imp-96294 convention) --
export const IMP96534_VALIDATION = Object.freeze({
  fourStages: IMP96534_LADDER_ROWS.length === 4,
  nEffMonotoneRising: IMP96534_LADDER_ROWS.every(
    (r, i) => i === 0 || r.nEff > IMP96534_LADDER_ROWS[i - 1].nEff,
  ),
  zEffMonotoneRising: IMP96534_LADDER_ROWS.every(
    (r, i) => i === 0 || r.zEff > IMP96534_LADDER_ROWS[i - 1].zEff,
  ),
  everyStageClearsTarget: IMP96534_LADDER_ROWS.every((r) => r.zEff > 0)
    && IMP96534_LADDER_ROWS.slice(1).every((r) => r.zEff > IMP96534_LANDMARKS.zTarget),
  everyCorrelationNegative: IMP96534_CORRELATIONS.every((c) => c.rho < 0),
  rhoCritPositive: IMP96534_LANDMARKS.rhoCrit > 0,
});
