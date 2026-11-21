/**
 * @module imp-96882-krein-treq-tvsn-viz-data
 *
 * imp-96882 (ux): import-light viz-data leaf for the imp-96847 T_req(N)
 * truncation-height scaling law -- reshapes the DECAY-route (tau ~ N^0.28,
 * sub-linear) and conservative GEOM-route (ratio r climbing with N) required
 * truncation heights into chart-ready series, plus the extrapolation to
 * N in {200,400,800} against the current T=4800 ladder top.
 *
 * PRESENTATION ONLY. Every literal is imported directly from imp-96847 (no
 * transcription); no new (N,T) solve was performed. The two routes bracket
 * T_req(100; 1e-3) in [2672.7, 4729] and diverge for N >> 100 (sub-gap
 * IMP96847_TVSN_LAW_THREE_POINT_ONLY: fit from only three N points). The
 * Rayleigh floor stays an upper bound; interval-rigorous certificate reach
 * stays 2a<=0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96847-krein-tconv-tvsn-scaling-law.js (source scaling law + verdict)
 * @see imp-96881-krein-kmax-degree-frontier-viz-data.js (sibling viz-data leaf convention)
 *
 * Ticket: imp-96882 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP96847_NS,
  IMP96847_TREQ_DECAY,
  IMP96847_TREQ_GEOM,
  IMP96847_TREQ_EXTRAP,
  IMP96847_VERDICT,
} from './imp-96847-krein-tconv-tvsn-scaling-law.js';

const T_LADDER_TOP = 4800;

// Chart-ready per-N ladder at eps=1e-3: decay-route vs conservative geom-route T_req.
export const IMP96882_N_LADDER = Object.freeze(
  IMP96847_NS.map((N) =>
    Object.freeze({
      N,
      decayTreq: IMP96847_TREQ_DECAY[1e-3][N],
      geomTreq: IMP96847_TREQ_GEOM[N].Treq,
      geomRatio: IMP96847_TREQ_GEOM[N].r,
    }),
  ),
);

// Extrapolation series (decay route, eps=1e-3) vs the current T=4800 ladder top.
export const IMP96882_EXTRAP_SERIES = Object.freeze(
  Object.keys(IMP96847_TREQ_EXTRAP[1e-3])
    .map(Number)
    .sort((a, b) => a - b)
    .map((N) =>
      Object.freeze({
        N,
        treq: IMP96847_TREQ_EXTRAP[1e-3][N],
        fractionOfLadderTop: IMP96847_TREQ_EXTRAP[1e-3][N] / T_LADDER_TOP,
      }),
    ),
);

export const IMP96882_HEADLINE = Object.freeze({
  tauPowerExponent: IMP96847_VERDICT.tauPowerExponent, // 0.2793, sub-linear
  bracketAtN100: IMP96847_VERDICT.twoRouteBracketN100, // [2672.7, 4729]
  currentT4800SufficesToNapprox: IMP96847_VERDICT.currentT4800SufficesToNapprox, // 800, decay route
  geomRouteReachesT4800By: IMP96847_VERDICT.geomRouteReachesT4800By, // 100, conservative route
  ladderTop: T_LADDER_TOP,
});

export const IMP96882_HONEST_BANNER =
  'Measurement / extrapolation only: the T-vs-N law is fit from just three N points (52,76,100). ' +
  'The DECAY route (tau ~ N^0.28) says the current T=4800 already suffices out to N~800 at ' +
  'eps=1e-3, but the conservative GEOM route (ratio r climbing with N) already reaches T_req~4729 ' +
  'by N=100 -- the two routes bracket T_req(100;1e-3) in [2672.7, 4729] and diverge for N >> 100. ' +
  'No new (N,T) solve was performed; the Rayleigh floor stays an upper bound; interval-rigorous ' +
  'certificate reach stays 2a<=0.96; RH open; no refereed bound is changed; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96882_ASSERTIONS = [
  {
    id: 'imp96882-n-ladder-three-rows',
    holds: () =>
      IMP96882_N_LADDER.length === 3 &&
      IMP96882_N_LADDER.every((r) => r.decayTreq > 0 && r.geomTreq > 0),
    why: 'the per-N ladder must carry all three measured N points (52,76,100) with positive decay/geom T_req.',
  },
  {
    id: 'imp96882-decay-below-geom-at-each-N',
    holds: () => IMP96882_N_LADDER.every((r) => r.decayTreq < r.geomTreq),
    why: 'the DECAY route must stay below the conservative GEOM route at every measured N (bracket ordering).',
  },
  {
    id: 'imp96882-extrap-series-monotone-increasing',
    holds: () =>
      IMP96882_EXTRAP_SERIES.length === 4 &&
      IMP96882_EXTRAP_SERIES.every((r, i) => i === 0 || r.treq > IMP96882_EXTRAP_SERIES[i - 1].treq),
    why: 'the decay-route extrapolation must be monotone increasing in N across the four extrapolated points (100,200,400,800).',
  },
  {
    id: 'imp96882-extrap-n800-under-ladder-top',
    holds: () => {
      const n800 = IMP96882_EXTRAP_SERIES.find((r) => r.N === 800);
      return n800 && n800.fractionOfLadderTop < 1;
    },
    why: 'the decay-route extrapolation at N=800 must sit below the current T=4800 ladder top (fraction < 1), matching the imp-96847 finding.',
  },
  {
    id: 'imp96882-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96882_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96882_HONEST_BANNER) &&
      /NO QED/.test(IMP96882_HONEST_BANNER),
    why: 'every Route I viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96882_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96882-krein-treq-tvsn-viz-data assertion failed: ${a.id}`);
  }
}
