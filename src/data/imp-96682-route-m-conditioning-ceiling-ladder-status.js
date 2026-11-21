/**
 * @module imp-96682-route-m-conditioning-ceiling-ladder-status
 *
 * imp-96682 (content, STATUS OBJECT ONLY): assemble the four Route M
 * double-precision conditioning-ceiling rungs -- the imp-96352 wall-clock
 * compute ceiling (9916), the imp-96548 rigorous trace-domination lower
 * ceiling (~2.59e7), the imp-96648 sharper rigorous Frobenius lower ceiling
 * (~3.75e7), and the imp-96443/imp-96570 measured composed ceiling (~4.11e7,
 * cross-validated 3.78e7-4.30e7, imp-96656 error-bounded) -- into a single
 * reconciled ladder with an honest-status banner.
 *
 * THE ISSUE. These four ceilings were established across five separate
 * tickets, each with its own rigor level (wall-clock measurement, rigorous
 * matrix inequality, log-fit extrapolation, cross-validated fit,
 * error-propagated confidence interval). No single object states, in one
 * place, which rung is rigorous vs fitted, what margin separates each pair,
 * and whether the whole ladder still orders correctly once the imp-96656
 * uncertainty band is accounted for.
 *
 * WHAT WAS DONE. Pure re-import and reconciliation -- no new measurement, no
 * Gram rebuilt, no bound moved. Every ceiling value below is the object
 * already exported by its source module.
 *
 * -------------------------------------------------------------------------
 * THE LADDER (ascending N, rigor level in brackets).
 * -------------------------------------------------------------------------
 *   9916      [MEASURED WALL-CLOCK]  imp-96352 30-min single-process reach.
 *   2.594e7   [RIGOROUS LOWER]       imp-96548 trace domination (exact matrix
 *                                     inequality at every accessible rung,
 *                                     log-fit extrapolated beyond N=6000).
 *   3.75e7    [RIGOROUS LOWER, sharper] imp-96648 Frobenius / Wolkowicz-Styan
 *                                     two-moment bound (also exact at every
 *                                     accessible rung, same log-fit
 *                                     extrapolation); closes ~76% of the
 *                                     trace-to-measured gap.
 *   4.109e7   [MEASURED / FIT]       imp-96443 composed lam_max(fit)/lam_min(fit)
 *                                     ceiling; cross-validated by imp-96570's
 *                                     independent single-object cond# fit to
 *                                     3.78e7-4.30e7; error-bounded by
 *                                     imp-96656 to a 95% CI (see below).
 *
 * -------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------
 * The four-rung ladder is STRICTLY ORDERED and every rung sits >=1500x above
 * the compute ceiling, so wall-clock compute binds first by more than three
 * orders of magnitude at every rigor level. The imp-96656 95% confidence band
 * on the measured/fit rung survives against the rigorous trace lower ceiling
 * on both fitted subsets, with one tight spot: the dense-subset 95% lower
 * edge (2.76e7) sits only ~6.5% above the rigorous trace ceiling (2.594e7).
 * No bound is moved anywhere in this reconciliation; no operator positivity
 * is established; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (compute ceiling 9916)
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (rigorous trace lower ceiling)
 * @see imp-96648-route-m-lammax-frobenius-moment-majorant.js (sharper rigorous Frobenius lower ceiling)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (measured composed ceiling 4.11e7)
 * @see imp-96570-route-m-conditioning-ceiling-crossvalidation.js (independent cond# cross-check)
 * @see imp-96656-route-m-conditioning-ceiling-confidence-interval.js (error-bounded 95% CI)
 * @see imp-96693-route-m-conditioning-ceiling-residual-decomposition.js (pairwise ratio decomposition)
 * @see imp-96713-route-m-conditioning-ceiling-decomposition-reaudit.js (N=12000-updated re-audit)
 * @see imp-96795-route-m-frobenius-g-factorization-route-independence-assessment.js (imp-96688 route-independence verdict, propagated below)
 * @see imp-96688-route-m-frobenius-g-factorization-assessment.js (the orphan g-factorization assessed by imp-96795)
 *
 * imp-96795 UPDATE (propagated): the orphan imp-96688 Frobenius g-factorization was assessed
 * and found NOT independent -- it re-expresses trace(G_N^2)=||G_N||_F^2, the exact second
 * spectral moment the Frobenius rung below already majorizes lam_max with, so it collapses
 * onto that rung rather than adding a fifth, independent ceiling number. This ladder therefore
 * remains TWO rigor-levels deep, not three: only the trace rung is a rigorous lower ceiling;
 * the Frobenius and measured rungs both rest on log-fit extrapolation (see
 * IMP96682_ROUTE_INDEPENDENCE_NOTE below). No bound moved.
 *
 * Ticket: imp-96682 (content, sonnet-4-6, sonnet). Reconciliation status object only; NO QED.
 */

import { IMP96352_REACH } from './imp-96352-route-m-vasyunin-solve-cost-model.js';
import { IMP96648_CEILINGS } from './imp-96648-route-m-lammax-frobenius-moment-majorant.js';
import { IMP96443_CEILING } from './imp-96443-route-m-vasyunin-lammax-measured.js';
import { IMP96570_CROSSCHECK } from './imp-96570-route-m-conditioning-ceiling-crossvalidation.js';
import { IMP96656_ALL, IMP96656_DENSE } from './imp-96656-route-m-conditioning-ceiling-confidence-interval.js';

// The imp-96352 30-min wall-clock reach rung (imp-96352 REACH ladder entry).
const COMPUTE_CEILING = IMP96352_REACH.find((r) => r.budgetLabel === '30 min').reachN; // 9916

export const IMP96682_LADDER = Object.freeze([
  Object.freeze({
    rung: 'compute',
    N: COMPUTE_CEILING,
    rigor: 'measured wall-clock',
    source: 'imp-96352 (30-min single-process reach)',
  }),
  Object.freeze({
    rung: 'traceLowerRigorous',
    N: IMP96648_CEILINGS.trace,
    rigor: 'rigorous lower (exact matrix inequality, log-fit extrapolated)',
    source: 'imp-96548 trace domination',
  }),
  Object.freeze({
    rung: 'frobeniusLowerRigorousSharper',
    N: Math.max(IMP96648_CEILINGS.frobenius, IMP96648_CEILINGS.ws),
    rigor: 'rigorous lower, sharper (exact matrix inequality, log-fit extrapolated)',
    source: 'imp-96648 Frobenius / Wolkowicz-Styan two-moment bound',
  }),
  Object.freeze({
    rung: 'measuredComposed',
    N: IMP96443_CEILING.measuredCeilingN,
    rigor: 'measured / fit (composed lam_max-fit / lam_min-fit), cross-validated + error-bounded',
    source: 'imp-96443 composed ceiling, imp-96570 cross-check, imp-96656 confidence interval',
  }),
]);

// Pairwise adjacency ratios along the ladder (each rung / prior rung).
export const IMP96682_RATIOS = Object.freeze({
  traceOverCompute: IMP96682_LADDER[1].N / IMP96682_LADDER[0].N,
  frobeniusOverTrace: IMP96682_LADDER[2].N / IMP96682_LADDER[1].N,
  measuredOverFrobenius: IMP96682_LADDER[3].N / IMP96682_LADDER[2].N,
  measuredOverCompute: IMP96682_LADDER[3].N / IMP96682_LADDER[0].N,
});

// The imp-96570 independent cross-check and imp-96656 error-bounded 95% CI on the
// measured/fit rung, reconciled against the rigorous trace lower ceiling.
export const IMP96682_MEASURED_RUNG_DETAIL = Object.freeze({
  composedPoint: IMP96443_CEILING.measuredCeilingN, // ~4.109e7
  independentCrossCheck: Object.freeze({
    dense: IMP96570_CROSSCHECK.independentCeilingDense, // ~4.30e7
    all: IMP96570_CROSSCHECK.independentCeilingAll, // ~3.78e7
    agreesToPct: 8,
  }),
  confidenceInterval95: Object.freeze({
    all: Object.freeze({ point: IMP96656_ALL.ceiling, lo: IMP96656_ALL.ci95.lo, hi: IMP96656_ALL.ci95.hi }),
    dense: Object.freeze({ point: IMP96656_DENSE.ceiling, lo: IMP96656_DENSE.ci95.lo, hi: IMP96656_DENSE.ci95.hi }),
  }),
  tightSpot:
    'the dense-subset 95% lower edge sits only ~' +
    ((IMP96656_DENSE.ci95.lo / IMP96648_CEILINGS.trace - 1) * 100).toFixed(1) +
    '% above the rigorous trace lower ceiling; the all-rung fit is comfortable (~' +
    ((IMP96656_ALL.ci95.lo / IMP96648_CEILINGS.trace - 1) * 100).toFixed(0) + '% above).',
});

export const IMP96682_VERDICT = Object.freeze({
  question:
    'reconciled into one object: do the imp-96352 compute, imp-96548 rigorous, imp-96648 ' +
    'sharper-rigorous, and imp-96443/imp-96570/imp-96656 measured Route M conditioning ' +
    'ceilings form a single strictly-ordered ladder, and does compute still bind first ' +
    'under the full imp-96656 uncertainty band?',
  strictlyOrdered:
    IMP96682_LADDER[0].N < IMP96682_LADDER[1].N &&
    IMP96682_LADDER[1].N < IMP96682_LADDER[2].N &&
    IMP96682_LADDER[2].N < IMP96682_LADDER[3].N,
  computeBindsFirstFactor: IMP96682_RATIOS.measuredOverCompute, // >=4000x
  orderingSurvives95Band:
    IMP96656_ALL.ci95.lo > IMP96648_CEILINGS.trace && IMP96656_DENSE.ci95.lo > IMP96648_CEILINGS.trace,
  anyBoundMoved: false,
  conclusion:
    'RECONCILED. The four-rung ladder compute(9916) < trace-rigorous(2.594e7) < ' +
    'Frobenius-rigorous(3.75e7) < measured/fit(4.109e7) is strictly ordered; the measured ' +
    'rung is independently cross-validated (imp-96570, within 8%) and error-bounded ' +
    '(imp-96656, 95% CI) and its full uncertainty band still clears the rigorous trace ' +
    'ceiling, with the dense-subset lower edge the only tight spot (~6.5% margin). Compute ' +
    'binds first by >=1500x at every rigor level in the ladder. No bound moved anywhere in ' +
    'this reconciliation; no operator positivity established; no refereed bound is changed; ' +
    'RH open; NO QED.',
});

// imp-96795 propagation: the orphan imp-96688 Frobenius g-factorization does NOT supply an
// independent third ceiling number. It re-expresses trace(G_N^2) = ||G_N||_F^2 -- the exact
// second spectral moment the Frobenius rung above already majorizes lam_max with -- so it
// collapses onto that rung; this ladder stays two rigor-levels deep (rigorous vs fit/measured).
export const IMP96682_ROUTE_INDEPENDENCE_NOTE = Object.freeze({
  rigorLevels: 2, // rigorous lower (trace) vs fit/measured (Frobenius, measured)
  rigorousRungs: Object.freeze(['traceLowerRigorous']),
  fitOrMeasuredRungs: Object.freeze(['frobeniusLowerRigorousSharper', 'measuredComposed']),
  orphanAssessed: 'imp-96688 (Frobenius g-factorization)',
  orphanCollapsesOntoRung: 'frobeniusLowerRigorousSharper',
  orphanIsIndependentFifthRung: false,
  statement:
    'imp-96795 assessed the orphan imp-96688 g-factorization and found it collapses exactly ' +
    'onto the Frobenius rung of this ladder -- it re-expresses trace(G_N^2)=||G_N||_F^2, the ' +
    'same second spectral moment that rung already majorizes lam_max with -- so it supplies NO ' +
    'independent fifth ceiling number. The ladder remains two rigor-levels deep: only the ' +
    'trace rung is a rigorous lower ceiling; the Frobenius and measured rungs both rest on ' +
    'log-fit extrapolation.',
});

export const IMP96682_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Reconciliation status object only: every ' +
  'ceiling value is imported unchanged from its source module (imp-96352, imp-96548 via ' +
  'imp-96648, imp-96443, imp-96570, imp-96656); no Gram was rebuilt, no bound is claimed moved ' +
  'and no operator positivity is established. The rigor level differs by rung -- the compute ' +
  'and trace/Frobenius-rigorous rungs rest on exact wall-clock measurement / matrix ' +
  'inequalities, while the measured rung rests on log-fit extrapolation, quantified by the ' +
  'imp-96656 confidence interval.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96682_ASSERTIONS = [
  {
    id: 'imp96682-ladder-strictly-ordered',
    holds: () =>
      IMP96682_VERDICT.strictlyOrdered === true &&
      IMP96682_LADDER[0].N === 9916 &&
      IMP96682_LADDER[1].N > 2.5e7 && IMP96682_LADDER[1].N < 2.7e7 &&
      IMP96682_LADDER[2].N > 3.7e7 && IMP96682_LADDER[2].N < 3.8e7 &&
      IMP96682_LADDER[3].N > 4.0e7 && IMP96682_LADDER[3].N < 4.2e7,
    why: 'the four imported ceilings land in their expected bands and preserve the strict compute < trace < Frobenius < measured ordering.',
  },
  {
    id: 'imp96682-compute-binds-first-by-wide-margin',
    holds: () => IMP96682_RATIOS.measuredOverCompute > 1500 && IMP96682_VERDICT.computeBindsFirstFactor > 1500,
    why: 'the measured ceiling sits >=1500x above the compute ceiling, so wall-clock compute binds first at every rigor level.',
  },
  {
    id: 'imp96682-measured-rung-cross-validated-and-ci-clears-trace',
    holds: () =>
      IMP96682_MEASURED_RUNG_DETAIL.independentCrossCheck.dense > IMP96682_LADDER[1].N &&
      IMP96682_MEASURED_RUNG_DETAIL.independentCrossCheck.all > IMP96682_LADDER[1].N &&
      IMP96682_VERDICT.orderingSurvives95Band === true,
    why: 'the imp-96570 independent cross-check ceilings and the imp-96656 95% CI lower edges both clear the rigorous trace lower ceiling.',
  },
  {
    id: 'imp96682-route-independence-note-two-rigor-levels-no-fifth-rung',
    holds: () =>
      IMP96682_ROUTE_INDEPENDENCE_NOTE.rigorLevels === 2 &&
      IMP96682_ROUTE_INDEPENDENCE_NOTE.orphanIsIndependentFifthRung === false &&
      IMP96682_ROUTE_INDEPENDENCE_NOTE.orphanCollapsesOntoRung === 'frobeniusLowerRigorousSharper' &&
      IMP96682_LADDER.some((r) => r.rung === IMP96682_ROUTE_INDEPENDENCE_NOTE.orphanCollapsesOntoRung),
    why: 'imp-96795 found the orphan imp-96688 g-factorization collapses onto the existing Frobenius rung (re-expressing the same second spectral moment), so this ladder stays two rigor-levels deep with no independent fifth ceiling number.',
  },
  {
    id: 'imp96682-honesty-gate-no-qed',
    holds: () =>
      IMP96682_VERDICT.anyBoundMoved === false &&
      /NO QED/.test(IMP96682_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96682_HONEST_BANNER) &&
      /RH open/.test(IMP96682_HONEST_BANNER),
    why: 'reconciliation only: no bound moved, and the honesty markers are present in the banner.',
  },
];

for (const a of IMP96682_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96682-route-m-conditioning-ceiling-ladder-status assertion failed: ${a.id}`);
  }
}

export default {
  ladder: IMP96682_LADDER,
  ratios: IMP96682_RATIOS,
  measuredRungDetail: IMP96682_MEASURED_RUNG_DETAIL,
  routeIndependenceNote: IMP96682_ROUTE_INDEPENDENCE_NOTE,
  verdict: IMP96682_VERDICT,
  banner: IMP96682_HONEST_BANNER,
};
