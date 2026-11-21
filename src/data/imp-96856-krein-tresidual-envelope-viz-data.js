/**
 * @module imp-96856-krein-tresidual-envelope-viz-data
 *
 * imp-96856 (ux): import-light viz-data leaf for the imp-96827 Route I Krein
 * t-truncation residual envelope -- floor lambda_min(T_a[sigma_2]) at 2a=ln3
 * (Rayleigh-Ritz upper bound, condB=1 Gegenbauer basis) climbing over T in
 * {800,1600,3200,4800}, one series per N in {52,76,100}, plus the per-N
 * geometric-per-doubling vs exponential-fit plateau enclosure that bounds the
 * residual beyond T=4800.
 *
 * imp-96827 exported IMP96827_FLOOR + IMP96827_MODEL + IMP96827_N100_ENCLOSURE
 * but shipped no visualization: this module reshapes those literals (imported
 * directly, no transcription) into a chart-ready per-N series list plus a
 * geometric/exponential enclosure annotation per N.
 *
 * PRESENTATION ONLY. Changes no bound, establishes no operator positivity; the
 * Rayleigh floor is an UPPER bound; the uniform-in-N spectral gap remains the
 * open analyticObstruction (IMP96749_UNIFORM_N_GAP_UNSETTLED); interval-rigorous
 * certificate reach stays 2a<=0.96; no refereed bound is changed;
 * RH open; NO QED.
 *
 * @see imp-96827-krein-tresidual-envelope-extrapolation.js (source floor ladder + model + verdict)
 * @see imp-96836-krein-tsweep-viz-data.js (sibling viz-data leaf convention)
 *
 * Ticket: imp-96856 (ux, sonnet-4-6, small). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP96827_TS,
  IMP96827_NS,
  IMP96827_FLOOR,
  IMP96827_MODEL,
  IMP96827_N100_ENCLOSURE,
} from './imp-96827-krein-tresidual-envelope-extrapolation.js';

export const IMP96856_TS = IMP96827_TS;
export const IMP96856_NS = IMP96827_NS;

const COLOR_BY_N = Object.freeze({
  52: '#38bdf8',
  76: '#facc15',
  100: '#4ade80',
});

// Chart-ready per-N series over the T ladder, plus log2(T) x-coordinates for
// an even-spaced axis (800,1600,3200,4800 -> log2 9.64, 10.64, 11.64, 12.23).
export const IMP96856_SERIES = Object.freeze(
  IMP96856_NS.map((N) =>
    Object.freeze({
      N,
      label: `lambda_min(T_a[sigma_2]), N=${N}`,
      color: COLOR_BY_N[N],
      values: IMP96827_FLOOR[N],
      log2T: Object.freeze(IMP96856_TS.map((t) => Math.log2(t))),
    }),
  ),
);

// Per-N geometric-per-doubling vs exponential-fit plateau enclosure, bounding
// the residual beyond the last measured rung T=4800.
export const IMP96856_ENVELOPE_BY_N = Object.freeze(
  IMP96856_NS.map((N) => {
    const m = IMP96827_MODEL[N];
    return Object.freeze({
      N,
      floorT4800: IMP96827_FLOOR[N][IMP96827_FLOOR[N].length - 1],
      LGeom: m.LGeom,
      LExp: m.LExp,
      residualBeyondT4800Geom: m.residualBeyondT4800Geom,
      residualBeyondT4800Exp: m.residualBeyondT4800Exp,
    });
  }),
);

// The binding N=100 rung: explicit +/- tolerance replacing the imp-96806
// unquantified ~1e-3, reused verbatim from imp-96827.
export const IMP96856_N100_ENCLOSURE = IMP96827_N100_ENCLOSURE;

export const IMP96856_HONEST_BANNER =
  'Measurement only: this is a Rayleigh-Ritz UPPER floor, not an operator positivity proof. ' +
  'The geometric-per-doubling envelope is a rigorous-STYLE modeling bound (increments decay at ' +
  'least geometrically), NOT a proof; the uniform-in-N spectral gap lambda_min(T_a[sigma_2]) >= c > 0 ' +
  'stays OPEN; interval-rigorous certificate reach stays 2a<=0.96; RH open; no refereed bound is changed; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96856_ASSERTIONS = [
  {
    id: 'imp96856-three-series-four-rungs',
    holds: () =>
      IMP96856_SERIES.length === 3 &&
      IMP96856_SERIES.every(
        (s) => s.values.length === IMP96856_TS.length && s.log2T.length === IMP96856_TS.length,
      ),
    why: 'the viz must carry all three N rungs (52,76,100) over the full four-point T=800..4800 ladder, with no dropped points.',
  },
  {
    id: 'imp96856-series-monotone-climbing-in-t',
    holds: () =>
      IMP96856_SERIES.every((s) => s.values.every((v, i) => i === 0 || v > s.values[i - 1])),
    why: 'each N series must climb monotonically as T increases 800->1600->3200->4800, matching the imp-96827 t-truncation-residual reading.',
  },
  {
    id: 'imp96856-envelope-brackets-floor-at-every-N',
    holds: () =>
      IMP96856_ENVELOPE_BY_N.every(
        (e) => e.LExp <= e.floorT4800 + 1e-9 && e.floorT4800 <= e.LGeom + 1e-9,
      ),
    why: 'at every N the measured T=4800 floor must sit at or inside the [LExp, LGeom] enclosure (the exponential limit may sit at/just below floorT4800, the geometric envelope strictly above).',
  },
  {
    id: 'imp96856-envelope-grows-with-N',
    holds: () =>
      IMP96856_ENVELOPE_BY_N.every(
        (e, i) => i === 0 || e.residualBeyondT4800Geom > IMP96856_ENVELOPE_BY_N[i - 1].residualBeyondT4800Geom,
      ),
    why: 'the conservative residual-beyond-T4800 envelope must grow monotonically with N, mirroring the imp-96827 (N,T) joint-resolution coupling.',
  },
  {
    id: 'imp96856-n100-enclosure-matches-source',
    holds: () =>
      IMP96856_N100_ENCLOSURE.LExp === IMP96827_N100_ENCLOSURE.LExp &&
      IMP96856_N100_ENCLOSURE.LGeom === IMP96827_N100_ENCLOSURE.LGeom &&
      IMP96856_N100_ENCLOSURE.firmlyPositive === true,
    why: 'the binding N=100 enclosure must reproduce the imp-96827 literal exactly (no transcription) and stay firmly positive.',
  },
  {
    id: 'imp96856-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96856_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96856_HONEST_BANNER) &&
      /NO QED/.test(IMP96856_HONEST_BANNER),
    why: 'every Route I viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96856_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96856-krein-tresidual-envelope-viz-data assertion failed: ${a.id}`);
  }
}
