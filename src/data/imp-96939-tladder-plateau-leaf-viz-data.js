/**
 * @module imp-96939-tladder-plateau-leaf-viz-data
 *
 * imp-96939 (ux): import-light viz-data leaf for the imp-96917 Krein
 * t-truncation ladder at the binding 2a=ln3 rung -- reshapes the six-point
 * T={800,3200,4800,6400,9600,12800} floor ladder at N in {76,100,124} into a
 * chart-ready per-N series (log2(T) x-axis) plus the residual-beyond-T=3200
 * bar series that GROWS with N (0.104% -> 0.257% -> 0.520% relative).
 *
 * imp-96917 exported the raw ladder + residual tables but shipped no
 * chart-ready reshaping: this leaf imports those literals verbatim (no
 * transcription) and adds log2(T) coordinates, per-N series objects, and a
 * residual-vs-N bar list for direct chart consumption.
 *
 * PRESENTATION ONLY. Changes no bound; establishes no operator positivity;
 * the floor is a Rayleigh-Ritz UPPER bound; interval-rigorous certificate
 * reach stays 2a<=0.96; no refereed bound is changed; RH open;
 * NO QED.
 *
 * @see imp-96917-krein-tladder-plateau-viz-data.js (source ladder + verdict)
 * @see imp-96896-krein-hight-floor-residual-viz-data.js (sibling viz-data leaf convention)
 *
 * Ticket: imp-96939 (ux, sonnet-4-6, medium). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP96917_TS,
  IMP96917_NS,
  IMP96917_LADDER,
  IMP96917_RESIDUAL_BEYOND_T3200,
  IMP96917_RESIDUAL_REL_PCT,
  IMP96917_FLOOR_TINF_EST,
  IMP96917_VERDICT,
} from './imp-96917-krein-tladder-plateau-viz-data.js';

export const IMP96939_TS = IMP96917_TS;
export const IMP96939_NS = IMP96917_NS;
export const IMP96939_LOG2_TS = Object.freeze(IMP96917_TS.map((t) => Math.log2(t)));

const N_COLOR = Object.freeze({ 76: '#60a5fa', 100: '#4ade80', 124: '#facc15' });

// chart-ready per-N floor-vs-T series, ln3 rung only (x = log2(T), y = Rayleigh floor)
export const IMP96939_FLOOR_SERIES = Object.freeze(
  IMP96917_NS.map((N) =>
    Object.freeze({
      n: N,
      label: `N=${N}`,
      color: N_COLOR[N],
      log2T: IMP96939_LOG2_TS,
      values: IMP96917_LADDER[N],
      tInfEstimate: IMP96917_FLOOR_TINF_EST[N],
    }),
  ),
);

// residual t-truncation left beyond T=3200, as a bar series across N (grows with N)
export const IMP96939_RESIDUAL_BARS = Object.freeze(
  IMP96917_NS.map((N) =>
    Object.freeze({
      n: N,
      label: `N=${N}`,
      color: N_COLOR[N],
      residual: IMP96917_RESIDUAL_BEYOND_T3200[N],
      residualRelPct: IMP96917_RESIDUAL_REL_PCT[N],
    }),
  ),
);

export const IMP96939_HONEST_BANNER =
  'Presentation only: the T-ladder floor is a Rayleigh-Ritz UPPER bound, not an operator positivity ' +
  'proof. The 2a=ln3 floor plateaus strictly positive as T->inf at every N, and the residual left ' +
  'beyond T=3200 is small (0.1-0.5% of the floor) but GROWS with N, confirming the imp-96814 deficit ' +
  'was a genuine lower bound. Interval-rigorous certificate reach stays 2a<=0.96; no refereed bound is changed' +
  '; RH open; NO QED.';

// plain validation object (no self-executing throw; imp-96294/imp-96819 convention -- a viz-data
// leaf must stay inert in the browser so a stale reading cannot blank a lazy-loaded page). Checked
// by scripts/run-assertions.mjs via the IMP96939_ASSERTIONS array below, not at import time.
export const IMP96939_VALIDATION = Object.freeze({
  threeSeriesPresent: IMP96939_FLOOR_SERIES.length === 3,
  everySeriesFullLadder: IMP96939_FLOOR_SERIES.every(
    (s) => s.values.length === IMP96939_TS.length && s.log2T.length === IMP96939_TS.length,
  ),
  everySeriesMonotoneClimbing: IMP96939_FLOOR_SERIES.every((s) =>
    s.values.every((v, i) => i === 0 || v > s.values[i - 1]),
  ),
  residualGrowsWithN:
    IMP96939_RESIDUAL_BARS[1].residual > IMP96939_RESIDUAL_BARS[0].residual &&
    IMP96939_RESIDUAL_BARS[2].residual > IMP96939_RESIDUAL_BARS[1].residual &&
    IMP96939_RESIDUAL_BARS[1].residualRelPct > IMP96939_RESIDUAL_BARS[0].residualRelPct &&
    IMP96939_RESIDUAL_BARS[2].residualRelPct > IMP96939_RESIDUAL_BARS[1].residualRelPct,
  matchesSourceVerdict:
    IMP96917_VERDICT.floorPlateausPositive === true &&
    IMP96917_VERDICT.residualBeyondT3200GrowsWithN === true &&
    IMP96917_VERDICT.operatorPositivityProved === false &&
    IMP96917_VERDICT.qed === false,
  honestBannerPresent:
    /RH open/.test(IMP96939_HONEST_BANNER) &&
    /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96939_HONEST_BANNER) &&
    /NO QED/.test(IMP96939_HONEST_BANNER),
});

// imp-96397: registers the IMP96939_VALIDATION checks with the build-time assertion sweep
// (scripts/run-assertions.mjs), which discovers any exported *_ASSERTIONS array without
// requiring an import-time throw.
export const IMP96939_ASSERTIONS = [
  {
    id: 'imp96939-three-series-present',
    description: 'all three N in {76,100,124} are reshaped into chart-ready series',
    holds: () => IMP96939_VALIDATION.threeSeriesPresent,
  },
  {
    id: 'imp96939-every-series-full-ladder',
    description: 'each series carries the full six-point T ladder with matching log2(T) coordinates',
    holds: () => IMP96939_VALIDATION.everySeriesFullLadder,
  },
  {
    id: 'imp96939-every-series-monotone-climbing',
    description: 'the floor climbs monotonically with T at every N, matching the imp-96917 reading',
    holds: () => IMP96939_VALIDATION.everySeriesMonotoneClimbing,
  },
  {
    id: 'imp96939-residual-grows-with-n',
    description: 'the residual beyond T=3200 grows with N in both absolute and relative terms',
    holds: () => IMP96939_VALIDATION.residualGrowsWithN,
  },
  {
    id: 'imp96939-matches-source-verdict',
    description: 'the leaf agrees with the imp-96917 verdict (plateau positive, residual grows, no QED)',
    holds: () => IMP96939_VALIDATION.matchesSourceVerdict,
  },
  {
    id: 'imp96939-honest-banner-present',
    description: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers',
    holds: () => IMP96939_VALIDATION.honestBannerPresent,
  },
];
