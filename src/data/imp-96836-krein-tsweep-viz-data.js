/**
 * @module imp-96836-krein-tsweep-viz-data
 *
 * imp-96836 (ux): import-light viz-data leaf for the imp-96806 Krein t-sweep
 * at the binding 2a=ln3 rung -- floor lambda_min(T_a[sigma_2]) (Rayleigh-Ritz
 * upper bound, condB=1 Gegenbauer basis) vs t-truncation T in {800,1600,3200,
 * 4800}, one series per N in {52,76,100}, annotating the T=800 dip as a pure
 * t-truncation artifact climbing to the ~0.579988 (N=100) t-converged plateau.
 *
 * imp-96806 exported IMP96806_TSWEEP_LN3 + IMP96806_ENTRY_CHECK but shipped no
 * visualization: this module reshapes those literals (imported directly, no
 * transcription) into a chart-ready per-N series list plus a dip/plateau
 * annotation.
 *
 * PRESENTATION ONLY. Changes no bound, establishes no operator positivity; the
 * Rayleigh floor is an UPPER bound; the uniform-in-N spectral gap remains the
 * open analyticObstruction (IMP96749_UNIFORM_N_GAP_UNSETTLED); interval-rigorous
 * certificate reach stays 2a<=0.96; no refereed bound is changed;
 * RH open; NO QED.
 *
 * @see imp-96806-krein-tconv-plateau-2a-ln3.js (source t-sweep table + verdict)
 * @see imp-96777-krein-lammin-n-trend-viz-data.js (sibling viz-data leaf convention)
 *
 * Ticket: imp-96836 (ux, sonnet-4-6, medium). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP96806_TS,
  IMP96806_NS,
  IMP96806_TSWEEP_LN3,
  IMP96806_FIXED_T800_FLOOR,
  IMP96806_TCONV_PLATEAU,
  IMP96806_T4800_FLOOR,
  IMP96806_T3200_T4800_INCREMENT,
} from './imp-96806-krein-tconv-plateau-2a-ln3.js';

export const IMP96836_TS = IMP96806_TS;
export const IMP96836_NS = IMP96806_NS;

const COLOR_BY_N = Object.freeze({
  52: '#38bdf8',
  76: '#facc15',
  100: '#4ade80',
});

// Chart-ready per-N series over the T ladder, plus log2(T) x-coordinates for
// an even-spaced axis (800,1600,3200,4800 -> log2 9.64, 10.64, 11.64, 12.23).
export const IMP96836_SERIES = Object.freeze(
  IMP96836_NS.map((N) =>
    Object.freeze({
      N,
      label: `lambda_min(T_a[sigma_2]), N=${N}`,
      color: COLOR_BY_N[N],
      values: IMP96806_TSWEEP_LN3[N],
      log2T: Object.freeze(IMP96836_TS.map((t) => Math.log2(t))),
    }),
  ),
);

// The T=800 dip vs the t-converged plateau (N=100 anchor, matching imp-96806).
export const IMP96836_DIP_ANNOTATION = Object.freeze({
  fixedT800Floor: IMP96806_FIXED_T800_FLOOR, // 0.533846, the imp-96772 fixed-T artifact
  tConvPlateauT3200: IMP96806_TCONV_PLATEAU, // 0.578956
  floorT4800: IMP96806_T4800_FLOOR, // 0.579988
  t3200t4800Increment: IMP96806_T3200_T4800_INCREMENT, // 0.001032, residual t-truncation
  plateauApprox: 0.579,
  descentBelowPlateau: IMP96806_TCONV_PLATEAU - IMP96806_FIXED_T800_FLOOR, // ~0.045
});

export const IMP96836_HONEST_BANNER =
  'Measurement only: this is a Rayleigh-Ritz UPPER floor, not an operator positivity proof. ' +
  'The T=800 dip is a pure t-truncation artifact, not a spectral effect; the ' +
  'uniform-in-N spectral gap lambda_min(T_a[sigma_2]) >= c > 0 stays OPEN; interval-rigorous ' +
  'certificate reach stays 2a<=0.96; RH open; no refereed bound is changed; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96836_ASSERTIONS = [
  {
    id: 'imp96836-three-series-four-rungs',
    holds: () =>
      IMP96836_SERIES.length === 3 &&
      IMP96836_SERIES.every((s) => s.values.length === IMP96836_TS.length && s.log2T.length === IMP96836_TS.length),
    why: 'the viz must carry all three N rungs (52,76,100) over the full four-point T=800..4800 ladder, with no dropped points.',
  },
  {
    id: 'imp96836-series-monotone-climbing-in-t',
    holds: () =>
      IMP96836_SERIES.every((s) => s.values.every((v, i) => i === 0 || v > s.values[i - 1])),
    why: 'each N series must climb monotonically as T increases 800->1600->3200->4800, matching the imp-96806 t-truncation-artifact reading.',
  },
  {
    id: 'imp96836-dip-annotation-matches-n100-column',
    holds: () => {
      const row = IMP96806_TSWEEP_LN3[100];
      return Math.abs(row[0] - IMP96836_DIP_ANNOTATION.fixedT800Floor) < 1e-9 &&
        Math.abs(row[row.length - 1] - IMP96836_DIP_ANNOTATION.floorT4800) < 1e-9 &&
        IMP96836_DIP_ANNOTATION.descentBelowPlateau > 0.04 &&
        IMP96836_DIP_ANNOTATION.descentBelowPlateau < 0.05;
    },
    why: 'the dip/plateau annotation must reproduce the N=100 column of the imp-96806 table verbatim, with the T=800 descent below the plateau in the ~0.04-0.05 band imp-96806 measured.',
  },
  {
    id: 'imp96836-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96836_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96836_HONEST_BANNER) &&
      /NO QED/.test(IMP96836_HONEST_BANNER),
    why: 'every Route I viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96836_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96836-krein-tsweep-viz-data assertion failed: ${a.id}`);
  }
}
