/**
 * @module imp-96557-eflow-domination-kappa-viz-data
 *
 * imp-96557 (ux): import-light viz-data leaf charting the imp-96409 E_flow-domination
 * required-factor kappa(N) = E_coll/E_flow. imp-96409 measured that the unconditionally
 * rigorous Gronwall flow term E_flow would need to be enlarged by kappa(N) to reach parity
 * with the GUE-conditional collapse term E_coll, and found kappa(N) bounded below by ~6.26
 * over the N in [1e3,1e12] diagnostic regime (rising to ~4.94e3 at N=1e12), with a shallow
 * global infimum ~5.30 at N~95.5 (below the diagnostic floor). That verdict was shipped as a
 * baked ladder + landmarks object with no chart. This module reshapes it into a plottable
 * log-log series plus the two landmark points, so the monotone divergence and the never-below-
 * ~5.3 floor are visible directly.
 *
 * No re-derivation of the E_flow/E_coll physics: every ladder row and landmark value is copied
 * verbatim from IMP96409_EFLOW_DOMINATION_REQUIRED_FACTOR (imp-96409). The only new computation
 * here is parsing the ladder's "1eK" N-labels to numeric N and taking log10 of N and kappa for
 * plotting. Changes no bound; establishes no operator positivity; RH open; NO QED;
 * no refereed bound is changed.
 *
 * @see imp-96409-eflow-domination-required-factor.js (requiredFactorLadder, landmarks, verdict)
 * @see imp-398 (C_F pinned from the RvM density integral, UNTOUCHED)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 *
 * Ticket: imp-96557 (ux, sonnet-4-6, low). Visualization only, RH-free; changes no bound;
 * NO QED. No self-executing assertion throw (per the imp-96294 convention) -- values are
 * validated below via a plain exported check object instead.
 */

import { IMP96409_EFLOW_DOMINATION_REQUIRED_FACTOR as SOURCE } from './imp-96409-eflow-domination-required-factor.js';

const LADDER = SOURCE.requiredFactorLadder;

export const IMP96557_KAPPA_SERIES = LADDER.map((row) => {
  const N = Number(row.N); // "1e3" -> 1000, etc.
  return {
    N,
    log10N: Math.log10(N),
    kappaRequired: row.kappaRequired,
    log10Kappa: Math.log10(row.kappaRequired),
    C_F: row.C_F,
  };
});

export const IMP96557_LANDMARKS = Object.freeze({
  globalMin: {
    N: SOURCE.landmarks.global_min_N,
    log10N: Math.log10(SOURCE.landmarks.global_min_N),
    kappaRequired: SOURCE.landmarks.global_min_factor,
    log10Kappa: Math.log10(SOURCE.landmarks.global_min_factor),
    C_F: SOURCE.landmarks.global_C_F,
    C_FNeededForParity: SOURCE.landmarks.global_C_F_needed_for_parity,
  },
  inRegimeMin: {
    N: SOURCE.landmarks.in_regime_min_N,
    log10N: Math.log10(SOURCE.landmarks.in_regime_min_N),
    kappaRequired: SOURCE.landmarks.in_regime_min_factor,
    log10Kappa: Math.log10(SOURCE.landmarks.in_regime_min_factor),
    C_F: SOURCE.landmarks.in_regime_C_F,
    C_FNeededForParity: SOURCE.landmarks.in_regime_C_F_needed_for_parity,
  },
  factorStrictlyRisesOverLadder: SOURCE.landmarks.factor_strictly_rises_over_ladder,
});

export const IMP96557_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every ladder row and ' +
  'landmark value plotted here is copied verbatim from the imp-96409 required-factor ' +
  'measurement; the only new step is parsing "1eK" N-labels to numeric N and taking log10 for ' +
  'the plotting grid. E_coll stays GUE-conditional (imp-486, UNTOUCHED); the imp-398 pinned ' +
  'C_F is UNTOUCHED; no admissible mollifier reshaping can inflate C_F by the required x5-6x+ ' +
  '(thousands past N~1e12). Changes no bound, establishes no operator positivity.';

// -- plain validation object (no self-executing throw; the imp-96294 convention) --
export const IMP96557_VALIDATION = Object.freeze({
  seriesCoversLadder: IMP96557_KAPPA_SERIES.length === LADDER.length,
  seriesMonotoneInN: IMP96557_KAPPA_SERIES.every(
    (p, i) => i === 0 || p.N > IMP96557_KAPPA_SERIES[i - 1].N,
  ),
  seriesStrictlyRisesInKappa: IMP96557_LANDMARKS.factorStrictlyRisesOverLadder === true,
  globalMinBelowInRegimeMin:
    IMP96557_LANDMARKS.globalMin.kappaRequired < IMP96557_LANDMARKS.inRegimeMin.kappaRequired,
  globalMinNOutsideDiagnosticRegime: IMP96557_LANDMARKS.globalMin.N < IMP96557_KAPPA_SERIES[0].N,
  inRegimeMinMatchesFirstLadderPoint:
    Math.abs(
      IMP96557_LANDMARKS.inRegimeMin.kappaRequired - IMP96557_KAPPA_SERIES[0].kappaRequired,
    ) < 1e-2,
  allKappaAboveFive: IMP96557_KAPPA_SERIES.every((p) => p.kappaRequired > 5),
});

export default IMP96557_KAPPA_SERIES;
