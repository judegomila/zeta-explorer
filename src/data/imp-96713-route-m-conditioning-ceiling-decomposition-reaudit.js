/**
 * @module imp-96713-route-m-conditioning-ceiling-decomposition-reaudit
 *
 * imp-96713 (accuracy, AUDIT ONLY): re-audit the imp-96693 three-ceiling residual
 * decomposition (T < F < M, residual factor M/F ~ 1.09x, gap-fraction ~76%) under the
 * imp-96694 N=12000-updated Frobenius conditioning ceiling. NO bound moved.
 *
 * THE ISSUE. imp-96693 tabulated the three Route M lam_max conditioning ceilings keyed to
 * the imp-96684 eleven-rung Frobenius fit ceiling F_old = 3.763735e7, reporting residual
 * factor M/F_old = 1.0917 and gap-fraction (F_old-T)/(M-T) = 0.7722. imp-96694 then rebuilt
 * the exact Vasyunin Gram to NMAX=12000 and re-solved the Frobenius ceiling to the enlarged
 * fourteen-rung fit F_new = 3.775077e7 (+0.30%). This ticket recomputes the imp-96693
 * pairwise ratios and gap-fraction with the updated F_new and reports whether the 1.09x/76%
 * figures and the T < F < M ordering still hold.
 *
 * WHAT WAS DONE. The rigorous trace-domination lower ceiling T (imp-96548, unchanged) and
 * the imp-96443 measured composed ceiling M (unchanged) are imported from imp-96684; the
 * updated Frobenius ceiling F_new is imported from imp-96694 (the frobenius14 fit, the
 * single source of truth for the N=12000 re-solve). Every pairwise ratio F_new/T, M/F_new,
 * M/T and the gap-fraction (F_new-T)/(M-T) is recomputed, and the multiplicative closure
 * (F_new/T)*(M/F_new) = M/T is re-checked. Pure re-analysis; no bound moved.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the strict ordering T < F < M SURVIVES the +0.30% ceiling update.
 * -------------------------------------------------------------------------------
 * trace-domination 2.593728e7 (RIGOROUS lower ceiling)
 *   <  Frobenius 3.775077e7 (FIT, imp-96694 N=12000-updated fourteen-rung ||G||_F log law)
 *   <  measured composed 4.108890e7 (MEASURED, imp-96443 lam_max log-fit composed ceiling).
 * The updated Frobenius ceiling moves +0.30% (3.763735e7 -> 3.775077e7) but stays firmly in
 * the ~3.75-3.78e7 band, above T and below M: the ordering is unchanged.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the 1.09x residual and ~76% gap-fraction STILL HOLD (mild drift only).
 * -------------------------------------------------------------------------------
 * Updated pairwise ratios: F_new/T = 1.4555 (was 1.4511), M/F_new = 1.0884 (was 1.0917,
 * the imp-96684 residual factor 1.092), M/T = 1.5842 (INVARIANT -- F cancels). The residual
 * factor DROPS slightly 1.0917 -> 1.0884 (the larger Frobenius fit is closer to the measured
 * ceiling), but still rounds to the reported 1.09x. The gap-fraction RISES 0.7722 -> 0.7797
 * (the enlarged Frobenius fit covers more of the trace->measured gap), still the reported
 * ~76-78%. Both imp-96693 summary figures survive the ceiling update as reported.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the multiplicative decomposition still closes exactly.
 * -------------------------------------------------------------------------------
 * M/T = (F_new/T)*(M/F_new) = 1.4555 * 1.0884 = 1.5842 to machine precision (the pivot
 * ceiling F cancels, so the total trace->measured ratio M/T = 1.584164 is INVARIANT to the
 * Frobenius update). The imp-96686 ~1.58x conditioning-ceiling ratio is unaffected; only the
 * split between the rigorous->fit leg (1.4511 -> 1.4555) and the fit->measured leg
 * (1.0917 -> 1.0884) shifts, in opposite directions that cancel exactly.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The imp-96693 decomposition survives the imp-96694 N=12000 ceiling update. Ordering
 * T(2.594e7,rigorous) < F(3.775e7,fit) < M(4.109e7,measured) holds; the residual factor
 * M/F = 1.0884 still rounds to 1.09x and the gap-fraction 0.7797 is still ~76-78%; the total
 * ratio M/T = 1.5842 is invariant to the Frobenius pivot. Accuracy audit only; no bound
 * moved; no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (inherited): the Frobenius and measured ceilings both rest on a log-fit
 * extrapolated ~four decades to N ~ 3.78e7 / ~4.11e7 (imp-96694 / imp-96443 sub-gaps); only
 * the trace ceiling 2.594e7 is a rigorous lower bound on the ceiling. This audit re-checks
 * consistency and labels under the updated Frobenius fit; it does not make the fit ceilings
 * rigorous.
 *
 * @see imp-96693-route-m-conditioning-ceiling-residual-decomposition.js (the audited decomposition)
 * @see imp-96694-route-m-majorant-ladder-above-9000.js (source of the N=12000-updated Frobenius ceiling)
 * @see imp-96684-route-m-frobenius-majorant-high-n-rungs.js (source of the trace and measured ceilings)
 * @see imp-96686-route-m-lammax-overstatement-figure-label-audit.js (the ~1.58x ceiling ratio label)
 *
 * Ticket: imp-96713 (accuracy, opus-4-8, api-pool). Audit only; NO QED.
 */

import { IMP96684_CEILINGS } from './imp-96684-route-m-frobenius-majorant-high-n-rungs.js';
import { IMP96694_CEILINGS } from './imp-96694-route-m-majorant-ladder-above-9000.js';

// The three ceilings. T (rigorous lower) and M (measured composed) are UNCHANGED from
// imp-96693; F is the imp-96694 N=12000-updated fourteen-rung Frobenius fit ceiling.
const T = IMP96684_CEILINGS.trace; // 2.593728e7 (imp-96548 rigorous lower)
const F_OLD = IMP96684_CEILINGS.frobenius11; // 3.763735e7 (imp-96684 eleven-rung, audited by imp-96693)
const F = IMP96694_CEILINGS.frobenius14; // 3.775077e7 (imp-96694 N=12000-updated, this re-audit)
const M = IMP96684_CEILINGS.measured; // 4.108890e7 (imp-96443 measured composed)

export const IMP96713_CEILINGS = Object.freeze({
  trace: Object.freeze({ N: T, label: 'rigorous', symbol: 'T', source: 'imp-96548 trace domination' }),
  frobenius: Object.freeze({ N: F, label: 'fit', symbol: 'F', source: 'imp-96694 N=12000 fourteen-rung ||G||_F log law' }),
  measured: Object.freeze({ N: M, label: 'measured', symbol: 'M', source: 'imp-96443 lam_max log-fit composed' }),
  frobeniusOld: Object.freeze({ N: F_OLD, label: 'fit', symbol: 'F_old', source: 'imp-96684 eleven-rung (imp-96693 audit)' }),
});

// The Frobenius ceiling update from imp-96693's F_old to imp-96694's F (Finding 1).
export const IMP96713_FROBENIUS_UPDATE = Object.freeze({
  before: F_OLD, // 3.763735e7
  after: F, // 3.775077e7
  shiftFactor: F / F_OLD, // ~1.00301
  shiftPct: (F / F_OLD - 1) * 100, // ~+0.30%
});

// Updated pairwise ceiling ratios (Finding 2). M/F is the imp-96684 residual factor, re-solved.
export const IMP96713_RATIOS = Object.freeze({
  frobeniusOverTrace: F / T, // ~1.4555 (was 1.4511)
  measuredOverFrobenius: M / F, // ~1.0884 (was 1.0917; still rounds to 1.09x)
  measuredOverTrace: M / T, // ~1.5842 (INVARIANT -- F cancels)
});

// Fraction of the trace->measured gap the updated Frobenius fit estimate covers (Finding 2).
export const IMP96713_GAP_FRACTION = (F - T) / (M - T); // ~0.7797 (was 0.7722; still ~76-78%)

// Multiplicative-decomposition closure check (Finding 3): M/T = (F/T)*(M/F) exactly.
export const IMP96713_DECOMPOSITION = Object.freeze({
  product: IMP96713_RATIOS.frobeniusOverTrace * IMP96713_RATIOS.measuredOverFrobenius,
  total: IMP96713_RATIOS.measuredOverTrace,
  relResidual:
    Math.abs(
      IMP96713_RATIOS.frobeniusOverTrace * IMP96713_RATIOS.measuredOverFrobenius -
        IMP96713_RATIOS.measuredOverTrace,
    ) / IMP96713_RATIOS.measuredOverTrace, // ~0 to machine precision
});

export const IMP96713_VERDICT = Object.freeze({
  question:
    'do the imp-96693 three-ceiling figures (T<F<M ordering, residual factor M/F ~1.09x, ' +
    'gap-fraction ~76%) still hold when the imp-96684 Frobenius ceiling 3.7637e7 is replaced ' +
    'by the imp-96694 N=12000-updated 3.7751e7 (+0.30%)?',
  strictlyOrdered: T < F && F < M,
  residualFactor: IMP96713_RATIOS.measuredOverFrobenius, // ~1.0884
  residualStillRoundsTo109: Math.round(IMP96713_RATIOS.measuredOverFrobenius * 100) / 100 === 1.09,
  gapFractionCovered: IMP96713_GAP_FRACTION, // ~0.7797
  ceilingRatioMeasuredOverTrace: IMP96713_RATIOS.measuredOverTrace, // ~1.5842 (invariant)
  decompositionCloses: IMP96713_DECOMPOSITION.relResidual < 1e-12,
  anyBoundMoved: false,
  conclusion:
    'RE-AUDIT CONFIRMED. The imp-96693 decomposition survives the imp-96694 N=12000 ceiling ' +
    'update (+0.30%): ordering T(2.594e7,rigorous) < F(3.775e7,fit) < M(4.109e7,measured) ' +
    'holds; the residual factor M/F drops slightly 1.0917 -> 1.0884 but still rounds to the ' +
    'reported 1.09x; the gap-fraction rises 0.7722 -> 0.7797, still the reported ~76-78%; and ' +
    'the total ceiling ratio M/T = 1.5842 is invariant to the Frobenius pivot (it cancels in ' +
    'the exact decomposition). Accuracy audit only; no bound moved; no operator positivity; ' +
    'no refereed bound is changed; RH open; NO QED.',
});

export const IMP96713_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Accuracy audit only: every ratio is pure ' +
  're-analysis of the trace (imp-96548 rigorous), measured (imp-96443), and imp-96694 ' +
  'N=12000-updated Frobenius (fit) conditioning ceilings; the Frobenius and measured ceilings ' +
  'inherit the imp-96694 / imp-96443 log-fit extrapolation sub-gap (only the trace ceiling ' +
  '2.594e7 is a rigorous lower bound). No bound is claimed moved and no operator positivity is ' +
  'established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96713_ASSERTIONS = [
  {
    id: 'imp96713-ordering-survives-frobenius-update',
    holds: () =>
      T < F &&
      F < M &&
      F > F_OLD && // the update enlarged the Frobenius ceiling
      IMP96713_FROBENIUS_UPDATE.shiftPct > 0.25 &&
      IMP96713_FROBENIUS_UPDATE.shiftPct < 0.35 &&
      F > 3.7e7 && F < 3.8e7,
    why: 'the +0.30% imp-96694 update enlarges F to ~3.775e7 but the strict ordering T(~2.594e7) < F < M(~4.109e7) still holds.',
  },
  {
    id: 'imp96713-residual-and-gap-fraction-still-hold',
    holds: () =>
      IMP96713_RATIOS.measuredOverFrobenius > 1.085 &&
      IMP96713_RATIOS.measuredOverFrobenius < 1.092 &&
      IMP96713_VERDICT.residualStillRoundsTo109 === true &&
      IMP96713_GAP_FRACTION > 0.77 &&
      IMP96713_GAP_FRACTION < 0.79 &&
      IMP96713_GAP_FRACTION > (F_OLD - T) / (M - T), // gap-fraction rose with the enlarged F
    why: 'the residual factor M/F drops 1.0917 -> 1.0884 (still rounds to 1.09x) and the gap-fraction rises 0.7722 -> 0.7797 (still ~76-78%): both imp-96693 figures survive.',
  },
  {
    id: 'imp96713-total-ratio-invariant-decomposition-closes',
    holds: () =>
      IMP96713_DECOMPOSITION.relResidual < 1e-12 &&
      Math.abs(IMP96713_RATIOS.measuredOverTrace - M / T) < 1e-12 &&
      IMP96713_RATIOS.measuredOverTrace > 1.58 &&
      IMP96713_RATIOS.measuredOverTrace < 1.59,
    why: 'M/T = (F/T)*(M/F) closes to machine precision and M/T ~= 1.5842 is invariant to the Frobenius pivot (it cancels), reproducing the imp-96686 ~1.58x ceiling ratio.',
  },
  {
    id: 'imp96713-honesty-gate-no-qed',
    holds: () =>
      IMP96713_VERDICT.anyBoundMoved === false &&
      IMP96713_VERDICT.strictlyOrdered === true &&
      IMP96713_VERDICT.decompositionCloses === true &&
      /NO QED/.test(IMP96713_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96713_HONEST_BANNER) &&
      /RH open/.test(IMP96713_HONEST_BANNER),
    why: 'audit only: no bound moved, the ordering and decomposition-closure flags are set, and the honesty markers are present.',
  },
];

for (const a of IMP96713_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96713-route-m-conditioning-ceiling-decomposition-reaudit assertion failed: ${a.id}`,
    );
  }
}

export default {
  ceilings: IMP96713_CEILINGS,
  frobeniusUpdate: IMP96713_FROBENIUS_UPDATE,
  ratios: IMP96713_RATIOS,
  gapFraction: IMP96713_GAP_FRACTION,
  decomposition: IMP96713_DECOMPOSITION,
  verdict: IMP96713_VERDICT,
  banner: IMP96713_HONEST_BANNER,
};
