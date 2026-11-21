/**
 * @module imp-96918-route-m-ceiling-ladder-concave-reconciliation
 *
 * imp-96918 (content, RECONCILIATION ONLY): the imp-96682 four-rung Route M
 * conditioning-ceiling ladder status object lists a single straight-line
 * Frobenius rung (~3.748e7, imp-96648's 8-rung log-fit) as the "sharper
 * rigorous" ceiling between the trace-lower ceiling and the measured/fit
 * ceiling. imp-96890 later refit the FULL 18-rung exact Frobenius-norm
 * ladder with two concavity-corrected models and found the fitted F ceiling
 * moves UP, not down, once the norm's concavity in log N is modeled. That
 * finding was never folded back into the imp-96682 ladder narrative. This
 * module performs the fold-back: no new measurement, no Gram rebuilt, no
 * bound moved.
 *
 * -------------------------------------------------------------------------
 * THE RECONCILIATION.
 * -------------------------------------------------------------------------
 * imp-96682's Frobenius rung (37,479,075, imp-96648's 8-rung straight-line
 * log-fit over N=250..6000) and imp-96890's straight-line refit over the
 * full 18-rung ladder N=250..16000 (37,865,089) already differ by ~1% purely
 * from adding ten more exact rungs to the same linear model. Layering the
 * imp-96890 concavity correction on top moves the fitted ceiling further up
 * still, into a band:
 *   monotone +d/N (safer extrapolant): 38,383,636  (+1.37% vs the 18-rung line)
 *   quadratic (turns over at N~2.31e9, unphysical far out): 41,029,191 (+8.36%)
 * So the single number imp-96682 reports (3.748e7) is not a fixed target the
 * fit converges to -- it is the LOW end of a widening band whose current
 * best estimate runs 3.84e7-4.10e7 once (a) the ladder is extended to 18
 * rungs and (b) concavity is modeled. imp-96890's own finding governs the
 * direction: the incumbent straight-line number was a slight UNDER-estimate
 * of the fit-based ceiling, not an over-estimate, because the concave norm
 * is flatter at the extrapolation scale and so reaches cond#=1/eps later.
 *
 * -------------------------------------------------------------------------
 * DOES THE LADDER STILL ORDER STRICTLY?
 * -------------------------------------------------------------------------
 * Yes, with one tight spot. Re-inserting the imp-96890 band between the
 * imp-96682 Frobenius and measured rungs gives:
 *   trace (2.594e7) < Frobenius-rigorous (3.748e7) < concave-tail (3.838e7)
 *     < concave-quad (4.103e7) < measured/fit (4.109e7)
 * The strict ordering survives, but the top of the band (the quadratic
 * extrapolant, already flagged by imp-96890 as the less credible of the two
 * corrections) sits only ~0.145% below the measured/fit rung -- a margin an
 * order of magnitude tighter than any other adjacent pair in the ladder.
 * The safer monotone +d/N correction (3.838e7) keeps a comfortable ~7.0% gap
 * to the measured rung, consistent with imp-96890's own preference for that
 * model as the credible far extrapolant.
 *
 * -------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------
 * RECONCILED. imp-96682's straight-line Frobenius rung (3.748e7) is the low
 * end, not the settled value, of a fitted-ceiling band that widens to
 * 3.838e7-4.103e7 once the imp-96890 18-rung ladder and concavity correction
 * are applied; the straight-line rung under-estimates rather than
 * over-estimates the fit ceiling. The four-rung ladder's strict ordering
 * survives with the band inserted, though the quadratic upper edge leaves
 * only a ~0.145% margin to the measured/fit rung -- the tightest gap in the
 * ladder, tighter even than the imp-96682 dense-subset 95% CI tight spot
 * (~6.5%). No bound moved anywhere in this reconciliation; no operator
 * positivity established; wall-clock compute still binds first by
 * >=1500x; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96682-route-m-conditioning-ceiling-ladder-status.js (the four-rung ladder being reconciled)
 * @see imp-96890-route-m-frobenius-concave-norm-ceiling-refit.js (the concave-refit F band folded in)
 * @see imp-96648-route-m-lammax-frobenius-moment-majorant.js (the incumbent 8-rung straight-line Frobenius rung)
 * @see imp-96693-route-m-conditioning-ceiling-residual-decomposition.js (T/F/M ceiling ladder, pairwise ratios)
 * @see imp-97081-route-m-farfield-ceiling-interior-anchor-discriminator.js (LATER: rejects the
 *   quadratic top end 4.103e7/+8.36% baked below as an unphysical curvature over-run, and narrows
 *   the credible band to [F, +d/N] = [3.775e7, 3.838e7]; see IMP96918_LATER_CORRECTION)
 *
 * Ticket: imp-96918 (content, sonnet-4-6, sonnet). Reconciliation status object only; NO QED.
 */

import { IMP96682_LADDER } from './imp-96682-route-m-conditioning-ceiling-ladder-status.js';
import { IMP96890_CEILING } from './imp-96890-route-m-frobenius-concave-norm-ceiling-refit.js';

const TRACE_RUNG = IMP96682_LADDER.find((r) => r.rung === 'traceLowerRigorous');
const FROBENIUS_RUNG = IMP96682_LADDER.find((r) => r.rung === 'frobeniusLowerRigorousSharper');
const MEASURED_RUNG = IMP96682_LADDER.find((r) => r.rung === 'measuredComposed');

// The imp-96890 concave-refit band, reconciled against the incumbent imp-96682 Frobenius rung.
export const IMP96918_FROBENIUS_BAND = Object.freeze({
  incumbentStraightLine: FROBENIUS_RUNG.N, // 3.748e7 (imp-96648, 8-rung fit)
  refitStraightLine18Rung: IMP96890_CEILING.NstarLine, // 3.787e7 (imp-96890, same linear model, 18 rungs)
  concaveTailSafer: IMP96890_CEILING.NstarTail, // 3.838e7 (monotone +d/N)
  concaveQuadUpper: IMP96890_CEILING.NstarQuad, // 4.103e7 (quadratic, unphysical far out)
  bandLo: IMP96890_CEILING.NstarTail,
  bandHi: IMP96890_CEILING.NstarQuad,
  incumbentIsUnderestimate: FROBENIUS_RUNG.N < IMP96890_CEILING.NstarTail,
});

// Re-insert the concave band into the four-rung ladder and check strict ordering.
export const IMP96918_ORDER_CHECK = Object.freeze({
  trace: TRACE_RUNG.N,
  frobeniusRigorous: FROBENIUS_RUNG.N,
  concaveTail: IMP96890_CEILING.NstarTail,
  concaveQuad: IMP96890_CEILING.NstarQuad,
  measured: MEASURED_RUNG.N,
  strictlyOrdered:
    TRACE_RUNG.N < FROBENIUS_RUNG.N &&
    FROBENIUS_RUNG.N < IMP96890_CEILING.NstarTail &&
    IMP96890_CEILING.NstarTail < IMP96890_CEILING.NstarQuad &&
    IMP96890_CEILING.NstarQuad < MEASURED_RUNG.N,
  quadToMeasuredMarginPct: (MEASURED_RUNG.N / IMP96890_CEILING.NstarQuad - 1) * 100, // ~0.145
  tailToMeasuredMarginPct: (MEASURED_RUNG.N / IMP96890_CEILING.NstarTail - 1) * 100, // ~7.05
  tightestGapInLadder: true, // tighter than the imp-96682 dense-subset 95% CI tight spot (~6.5%)
});

export const IMP96918_VERDICT = Object.freeze({
  question:
    'does the imp-96890 concave-refit Frobenius ceiling band (3.838e7-4.103e7) fold back into ' +
    'the imp-96682 four-rung Route M conditioning-ceiling ladder without breaking its strict ' +
    'ordering, and which direction does it move the incumbent straight-line rung?',
  incumbentWasUnderestimate: IMP96918_FROBENIUS_BAND.incumbentIsUnderestimate,
  ladderStillStrictlyOrdered: IMP96918_ORDER_CHECK.strictlyOrdered,
  anyBoundMoved: false,
  conclusion:
    'RECONCILED. The imp-96682 straight-line Frobenius rung (3.748e7) is the low end of a fitted ' +
    'band that widens to 3.838e7 (safer monotone +d/N) - 4.103e7 (quadratic) once the imp-96890 ' +
    '18-rung ladder and concavity correction are applied; it under-estimates rather than ' +
    'over-estimates the fit-based ceiling. The ladder ordering trace < Frobenius-rigorous < ' +
    'concave-band < measured/fit survives with the band inserted, but the quadratic upper edge ' +
    'leaves only a ~0.145% margin to the measured/fit rung, the tightest gap anywhere in the ' +
    'ladder. No bound moved; no operator positivity established; wall-clock compute still binds ' +
    'first by >=1500x; no refereed bound is changed; RH open; NO QED.',
});

// LATER CORRECTION (imp-97081, not folded into the reconciliation math above -- it postdates
// this ticket). The quadratic upper edge baked into IMP96918_FROBENIUS_BAND.concaveQuadUpper
// (4.103e7, +8.36%) is REJECTED by imp-97081 as an unphysical curvature over-run, using an
// independent far-field anchor F derived from the interior second-moment slope rather than from
// refitting the near-field ladder. Per imp-97081 the currently-credible band is the narrower
// [F, +d/N] = [3.775e7, 3.838e7] (-0.30%..+1.37% vs the line baseline), not the wider
// [3.838e7, 4.103e7] this reconciliation reports as "the band."
export const IMP96918_LATER_CORRECTION = Object.freeze({
  supersededBy: 'imp-97081',
  quadTopEndRejected: true,
  rejectedValue: IMP96890_CEILING.NstarQuad, // 4.103e7 -- no longer credible
  narrowedBandLo: 3.775e7, // F, the imp-97081 interior-slope anchor
  narrowedBandHi: IMP96890_CEILING.NstarTail, // 3.838e7, +d/N (unchanged)
  note:
    'imp-97081 supplies an independent far-field anchor F = 3.775e7 (from the imp-96750 interior ' +
    'second-moment log-asymptotic slope) that lands BELOW this reconciliation\'s quadratic upper ' +
    'edge (4.103e7) and rejects it as an unphysical curvature over-run. The currently-credible ' +
    'band is [F, +d/N] = [3.775e7, 3.838e7], not the wider band reported above. Trace ceiling ' +
    'T = 2.594e7 remains the only rigorous anchor; no bound moved; RH open; NO QED.',
});

export const IMP96918_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Reconciliation status object only: every value ' +
  'below is imported unchanged from imp-96682 and imp-96890; no Gram was rebuilt, no new fit was ' +
  'run, and no bound is claimed moved. The imp-96682 Frobenius rung is re-framed as the low end of ' +
  'a widening fitted-ceiling band, not a settled value.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96918_ASSERTIONS = [
  {
    id: 'imp96918-band-imports-match-source-modules',
    holds: () =>
      IMP96918_FROBENIUS_BAND.incumbentStraightLine > 3.7e7 && IMP96918_FROBENIUS_BAND.incumbentStraightLine < 3.8e7 &&
      IMP96918_FROBENIUS_BAND.concaveTailSafer > 3.8e7 && IMP96918_FROBENIUS_BAND.concaveTailSafer < 3.9e7 &&
      IMP96918_FROBENIUS_BAND.concaveQuadUpper > 4.0e7 && IMP96918_FROBENIUS_BAND.concaveQuadUpper < 4.2e7,
    why: 'the incumbent imp-96682 Frobenius rung and the imp-96890 concave-refit band both land in their expected bands, confirming the values are imported unchanged.',
  },
  {
    id: 'imp96918-incumbent-is-underestimate-not-overestimate',
    holds: () => IMP96918_FROBENIUS_BAND.incumbentIsUnderestimate === true,
    why: 'the imp-96682 straight-line Frobenius rung sits below both imp-96890 concave-refit ceilings, so it under-estimates the fit-based ceiling once concavity is modeled.',
  },
  {
    id: 'imp96918-ladder-strictly-ordered-with-band-inserted',
    holds: () =>
      IMP96918_ORDER_CHECK.strictlyOrdered === true &&
      IMP96918_ORDER_CHECK.quadToMeasuredMarginPct > 0 && IMP96918_ORDER_CHECK.quadToMeasuredMarginPct < 1 &&
      IMP96918_ORDER_CHECK.tailToMeasuredMarginPct > IMP96918_ORDER_CHECK.quadToMeasuredMarginPct,
    why: 'inserting the imp-96890 concave band between the Frobenius-rigorous and measured rungs preserves strict ordering, with the quadratic upper edge leaving under a 1% margin to the measured rung -- the tightest gap in the ladder.',
  },
  {
    id: 'imp96918-honesty-gate-no-qed',
    holds: () =>
      IMP96918_VERDICT.anyBoundMoved === false &&
      /NO QED/.test(IMP96918_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96918_HONEST_BANNER) &&
      /RH open/.test(IMP96918_HONEST_BANNER),
    why: 'reconciliation only: no bound moved, and the honesty markers are present in the banner.',
  },
  {
    id: 'imp96918-later-correction-flags-quad-top-rejected',
    holds: () =>
      IMP96918_LATER_CORRECTION.supersededBy === 'imp-97081' &&
      IMP96918_LATER_CORRECTION.quadTopEndRejected === true &&
      IMP96918_LATER_CORRECTION.rejectedValue === IMP96890_CEILING.NstarQuad &&
      IMP96918_LATER_CORRECTION.narrowedBandLo < IMP96918_LATER_CORRECTION.narrowedBandHi &&
      /imp-97081/.test(IMP96918_LATER_CORRECTION.note),
    why: 'a reader landing on this module must see that the quadratic top end it reports as part ' +
      'of "the band" was later rejected by imp-97081, and be pointed at the narrower [F, +d/N] band.',
  },
];

for (const a of IMP96918_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96918-route-m-ceiling-ladder-concave-reconciliation assertion failed: ${a.id}`);
  }
}

export default {
  frobeniusBand: IMP96918_FROBENIUS_BAND,
  orderCheck: IMP96918_ORDER_CHECK,
  verdict: IMP96918_VERDICT,
  banner: IMP96918_HONEST_BANNER,
};
