/**
 * @module imp-96942-route-m-eps-sensitivity-viz-data
 *
 * imp-96942 (ux): import-light viz-data leaf for the imp-96914 eps-sensitivity band of the
 * three Route M conditioning ceilings (T rigorous, F fit, M measured). Reshapes the per-ceiling
 * band rows into a chart-ready series (N at bare eps vs N at the conservative accumulated-roundoff
 * edge, decades dropped) plus compact summaries of the ordering-swap and binds-first-headroom
 * findings.
 *
 * PRESENTATION ONLY. Every value here is reused verbatim from the imp-96914
 * IMP96914_BANDS / IMP96914_ORDERING / IMP96914_BINDS_FIRST / IMP96914_VERDICT records; only the
 * chart reshape is new. Changes no bound, establishes no operator positivity, no RH claim;
 * no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96914-route-m-ceiling-eps-sensitivity-band.js (source measurement)
 *
 * Ticket: imp-96942 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 *
 * Import-light: only re-exports/reshapes imp-96914 (itself import-light, no zeros bundle, no
 * sibling imports).
 */

import {
  IMP96914_BANDS,
  IMP96914_EPS_RANGE,
  IMP96914_ORDERING,
  IMP96914_BINDS_FIRST,
  IMP96914_VERDICT,
} from './imp-96914-route-m-ceiling-eps-sensitivity-band.js';

// Per-ceiling band series: N at bare eps vs N at the conservative accumulated-roundoff edge.
export const IMP96942_CEILING_BAND_SERIES = Object.freeze(
  IMP96914_BANDS.map((r) => ({
    symbol: r.symbol,
    label: r.label,
    nBare: r.N,
    nAcc: r.nAcc,
    dropDecades: r.dropDecades,
    elasticity: r.dlogN_dlogEps,
  })),
);

export const IMP96942_ORDERING_SUMMARY = Object.freeze({
  epsInvariant: IMP96914_ORDERING.epsInvariant, // false
  orderAtBareEps: 'T < F < M',
  orderAtAccEdge: IMP96914_ORDERING.orderAtAccEdge, // 'T < M < F'
  fmSwapTimesMachineEps: IMP96914_ORDERING.fmSwapTimesMachineEps, // ~45
});

export const IMP96942_BINDS_FIRST_SUMMARY = Object.freeze({
  qualitativeSurvivesAccEdge: IMP96914_BINDS_FIRST.qualitativeSurvivesAccEdge, // true
  headroom1500SurvivesAccEdge: IMP96914_BINDS_FIRST.headroom1500SurvivesAccEdge, // false
  epsBelow1500TimesMachine: IMP96914_BINDS_FIRST.epsBelow1500TimesMachine, // ~2.9
  epsHitsComputeTimesMachine: IMP96914_BINDS_FIRST.epsHitsComputeTimesMachine, // ~3.6e6
});

export const IMP96942_SUMMARY = Object.freeze({
  epsRangeDecades: IMP96914_EPS_RANGE.decades, // ~3.7
  maxCeilingDropDecades: IMP96914_VERDICT.maxCeilingDropDecades, // ~1.9
  orderingSurvives: IMP96914_VERDICT.orderingSurvives, // false
  bindsFirstQualitativeSurvives: IMP96914_VERDICT.bindsFirstQualitativeSurvives, // true
  bindsFirst1500HeadroomSurvives: IMP96914_VERDICT.bindsFirst1500HeadroomSurvives, // false
  conclusion: IMP96914_VERDICT.conclusion,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96942_ASSERTIONS = [
  {
    id: 'imp96942-ceiling-band-series-has-three-rows-in-tfm-order',
    holds: () =>
      IMP96942_CEILING_BAND_SERIES.length === 3 &&
      IMP96942_CEILING_BAND_SERIES.map((r) => r.symbol).join(',') === 'T,F,M',
    why: 'imp-96914 reports exactly three ceilings (T, F, M) in that fixed order.',
  },
  {
    id: 'imp96942-every-band-drops-between-bare-and-acc',
    holds: () =>
      IMP96942_CEILING_BAND_SERIES.every(
        (r) => r.nAcc < r.nBare && r.dropDecades > 1.5 && r.dropDecades < 2.1,
      ),
    why: 'the conservative accumulated-roundoff edge must lower every ceiling by ~1.5 to 2 decades relative to bare machine eps.',
  },
  {
    id: 'imp96942-ordering-not-eps-invariant',
    holds: () =>
      IMP96942_ORDERING_SUMMARY.epsInvariant === false &&
      IMP96942_ORDERING_SUMMARY.orderAtBareEps === 'T < F < M' &&
      IMP96942_ORDERING_SUMMARY.orderAtAccEdge === 'T < M < F',
    why: 'the T<F<M ordering at bare eps must flip to T<M<F at the conservative accumulated edge (Finding 2).',
  },
  {
    id: 'imp96942-binds-first-qualitative-survives-headroom-fragile',
    holds: () =>
      IMP96942_BINDS_FIRST_SUMMARY.qualitativeSurvivesAccEdge === true &&
      IMP96942_BINDS_FIRST_SUMMARY.headroom1500SurvivesAccEdge === false,
    why: 'the qualitative wall-clock-binds-first conclusion survives, but the specific >=1500x headroom does not (Finding 3).',
  },
  {
    id: 'imp96942-summary-carries-no-qed-honesty-marker',
    holds: () =>
      IMP96942_SUMMARY.orderingSurvives === false &&
      /NO QED/.test(IMP96942_SUMMARY.conclusion),
    why: 'this is a presentation-only reshape: the honesty marker (NO QED) must be carried over unchanged from imp-96914.',
  },
];

for (const a of IMP96942_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96942-route-m-eps-sensitivity-viz-data assertion failed: ${a.id}`);
  }
}
