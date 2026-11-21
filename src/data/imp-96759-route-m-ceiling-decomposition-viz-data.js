/**
 * @module imp-96759-route-m-ceiling-decomposition-viz-data
 *
 * imp-96759 (ux): import-light viz-data leaf for the imp-96731 Route M conditioning-ceiling
 * decomposition. Reshapes the three named ceilings -- rigorous trace T = 2.594e7, Frobenius-fit
 * F = 3.775e7, measured composed M = 4.109e7 (imp-96731 Finding 4 / imp-96713) -- into a
 * chart-ready segmented decomposition of the two legs T->F and F->M, with both the log-ceiling
 * fraction (0.8158) and the linear fraction (0.7797) the rigorous->fit leg covers of the total
 * trace->measured gap.
 *
 * PRESENTATION ONLY. Every value here is reused verbatim from the imp-96731 IMP96731_CEILING_LEG
 * record; only the segmented-decomposition chart reshape is new. Changes no bound, establishes
 * no operator positivity, no RH claim; no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96731-route-m-trace-ceiling-tightening-assessment.js (source decomposition, Finding 4)
 * @see imp-96713-route-m-conditioning-ceiling-decomposition-reaudit.js (T/F/M re-audit)
 *
 * Ticket: imp-96759 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 *
 * Import-light: only re-exports/reshapes imp-96731 (itself import-light, no zeros bundle).
 */

import {
  IMP96731_CEILING_LEG,
  IMP96731_VERDICT,
} from './imp-96731-route-m-trace-ceiling-tightening-assessment.js';

// The three ceilings as a chart-ready ordered ladder, keyed by symbol.
export const IMP96759_CEILING_LADDER = Object.freeze([
  { symbol: 'T', label: 'rigorous (trace)', N: IMP96731_CEILING_LEG.traceRigorousN },
  { symbol: 'F', label: 'fit (Frobenius)', N: IMP96731_CEILING_LEG.frobeniusFitN },
  { symbol: 'M', label: 'measured (composed)', N: IMP96731_CEILING_LEG.measuredN },
]);

// Segmented decomposition of the two legs, T->F and F->M, on both a linear and a log axis.
export const IMP96759_SEGMENTS = Object.freeze([
  {
    leg: 'T->F',
    description: 'rigorous->fit leg (extrapolation-rigor gap)',
    ratio: IMP96731_CEILING_LEG.frobeniusOverTrace, // ~1.4555
    linearFraction: IMP96731_CEILING_LEG.linearGapFractionCovered, // ~0.7797
    logFraction: IMP96731_CEILING_LEG.logGapFractionCovered, // ~0.8158
  },
  {
    leg: 'F->M',
    description: 'fit->measured leg (intrinsic Frobenius-vs-spectral slack)',
    ratio: IMP96731_CEILING_LEG.measuredOverFrobenius, // ~1.0884
    linearFraction: 1 - IMP96731_CEILING_LEG.linearGapFractionCovered, // ~0.2203
    logFraction: 1 - IMP96731_CEILING_LEG.logGapFractionCovered, // ~0.1842
  },
]);

export const IMP96759_TOTAL = Object.freeze({
  ratio: IMP96731_CEILING_LEG.measuredOverTrace, // ~1.5842
  achievableRigorousCeilingIfProven: IMP96731_VERDICT.achievableRigorousCeilingIfProven, // '~3.78-3.98e7'
});

export const IMP96759_VERDICT_SUMMARY = Object.freeze({
  gapIsExtrapolationRigorNotMechanism: IMP96731_VERDICT.gapIsExtrapolationRigorNotMechanism,
  improvedRigorousCeilingPosted: IMP96731_VERDICT.improvedRigorousCeilingPosted,
  anyBoundMoved: IMP96731_VERDICT.anyBoundMoved,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96759_ASSERTIONS = [
  {
    id: 'imp96759-three-rungs-ordered',
    holds: () =>
      IMP96759_CEILING_LADDER.length === 3 &&
      IMP96759_CEILING_LADDER[0].N < IMP96759_CEILING_LADDER[1].N &&
      IMP96759_CEILING_LADDER[1].N < IMP96759_CEILING_LADDER[2].N,
    why: 'the T<F<M ordering (imp-96713 Finding 1) must be reflected in the ladder used for the chart.',
  },
  {
    id: 'imp96759-two-segments-present',
    holds: () => IMP96759_SEGMENTS.length === 2 && IMP96759_SEGMENTS[0].leg === 'T->F' && IMP96759_SEGMENTS[1].leg === 'F->M',
    why: 'the segmented decomposition splits the total gap into exactly the two named legs.',
  },
  {
    id: 'imp96759-fractions-sum-to-one',
    holds: () =>
      Math.abs(IMP96759_SEGMENTS[0].linearFraction + IMP96759_SEGMENTS[1].linearFraction - 1) < 1e-12 &&
      Math.abs(IMP96759_SEGMENTS[0].logFraction + IMP96759_SEGMENTS[1].logFraction - 1) < 1e-12,
    why: 'the two legs must partition the whole trace->measured gap on both the linear and log axes.',
  },
  {
    id: 'imp96759-log-fraction-matches-08158',
    holds: () =>
      IMP96759_SEGMENTS[0].logFraction > 0.80 &&
      IMP96759_SEGMENTS[0].logFraction < 0.83 &&
      IMP96759_SEGMENTS[0].linearFraction > 0.77 &&
      IMP96759_SEGMENTS[0].linearFraction < 0.79,
    why: 'imp-96731 Finding 4 reports the T->F leg covers log-fraction ~0.8158 (linear ~0.7797) of the total gap.',
  },
  {
    id: 'imp96759-verdict-unchanged-no-qed',
    holds: () =>
      IMP96759_VERDICT_SUMMARY.anyBoundMoved === false &&
      IMP96759_VERDICT_SUMMARY.improvedRigorousCeilingPosted === false,
    why: 'this is a presentation-only reshape: no bound moved and no improved rigorous ceiling is posted.',
  },
];

for (const a of IMP96759_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96759-route-m-ceiling-decomposition-viz-data assertion failed: ${a.id}`);
  }
}

export default {
  ladder: IMP96759_CEILING_LADDER,
  segments: IMP96759_SEGMENTS,
  total: IMP96759_TOTAL,
  verdictSummary: IMP96759_VERDICT_SUMMARY,
};
