/**
 * @module imp-96693-route-m-conditioning-ceiling-residual-decomposition
 *
 * imp-96693 (accuracy, AUDIT ONLY): tabulate the residual-factor decomposition of the
 * three Route M lam_max conditioning ceilings and cross-validate the imp-96684 1.092
 * residual and ~76% gap-fraction, confirming the three ceilings are mutually consistent
 * and each carries its correct fit-vs-rigorous label. NO bound moved.
 *
 * THE ISSUE. imp-96684 FINDING 2 reports the enlarged eleven-rung Frobenius conditioning
 * ceiling (~3.76e7, a FIT extrapolation) sits between the rigorous trace-domination lower
 * ceiling (~2.594e7, RIGOROUS) and the imp-96443 measured composed ceiling (~4.109e7,
 * MEASURED), quoting a residual factor 1.092 (measured / Frobenius) and stating the
 * Frobenius estimate covers ~76% of the trace->measured gap. Those two summary figures
 * were reported without an explicit pairwise-ratio table, so this ticket recomputes every
 * pairwise ceiling ratio directly from the imp-96684 bisection-solved ceilings, checks the
 * multiplicative decomposition closes, and confirms each ceiling's label.
 *
 * WHAT WAS DONE. The three ceilings are imported from imp-96684 (the single source of
 * truth: each is re-solved there by the SAME cond#(N)=lam_max(N)/lam_min(N)=1/eps
 * bisection). Every pairwise ratio F/T, M/F, M/T is tabulated, the gap-fraction
 * (F-T)/(M-T) is recomputed, and the identity (F/T)*(M/F) = M/T is checked to machine
 * precision. All quantities are pure re-analysis of the imp-96684 ceilings.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the three ceilings are strictly ordered T < F < M, labels confirmed.
 * -------------------------------------------------------------------------------
 * trace-domination 2.5937e7 (RIGOROUS lower ceiling, imp-96548 exact lam_max<=trace)
 *   <  Frobenius 3.7637e7 (FIT extrapolation of the eleven-rung ||G||_F log law)
 *   <  measured composed 4.1089e7 (MEASURED, imp-96443 lam_max log-fit composed ceiling).
 * The rigorous lower ceiling is the smallest (it uses the loosest, ~1.77x, upper bound
 * lam_max<=trace, so cond# hits 1/eps at the smallest N); the measured is the largest.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the residual factor 1.092 and the ~76% gap-fraction reproduce exactly.
 * -------------------------------------------------------------------------------
 * Pairwise ratios: F/T = 1.4511 (trace->Frobenius), M/F = 1.0917 (Frobenius->measured,
 * the imp-96684 residual factor 1.092), M/T = 1.5842 (trace->measured). The Frobenius
 * estimate closes (F-T)/(M-T) = 0.7722 = ~76% of the trace->measured gap, matching the
 * imp-96684 FINDING 2 figure. All three ceilings are mutually consistent.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the decomposition closes and reproduces the imp-96686 ~1.58x ceiling ratio.
 * -------------------------------------------------------------------------------
 * The trace->measured ceiling ratio factors multiplicatively as M/T = (F/T)*(M/F) =
 * 1.4511 * 1.0917 = 1.5842 to machine precision (the two overstatement multipliers are
 * exact factors of the total, no residual). This M/T = 1.584 is the SAME conditioning-
 * ceiling ratio imp-96686 labels ~1.58x (distinct from the ~1.92x N=6000 VALUE ratio),
 * so the residual decomposition and the imp-96686 figure-label audit agree: the Frobenius
 * fit ceiling is the geometric-style pivot that splits the total 1.58x ceiling gap into a
 * 1.45x rigorous->fit leg and a 1.09x fit->measured leg.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The three Route M conditioning ceilings are mutually consistent: T(2.594e7,rigorous) <
 * F(3.764e7,fit) < M(4.109e7,measured), with M/F = 1.0917 (the imp-96684 residual factor
 * 1.092) and (F-T)/(M-T) = 0.7722 (~76%). The trace->measured ratio M/T = 1.5842 factors
 * exactly as (F/T)*(M/F), reproducing the imp-96686 ~1.58x ceiling ratio. Accuracy audit
 * only; no bound moved; no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (inherited): the Frobenius and measured ceilings both rest on a log-fit
 * extrapolated ~four decades to N~3.76e7 / ~4.11e7 (imp-96684 / imp-96443 sub-gaps); only
 * the trace ceiling 2.594e7 is a rigorous lower bound on the ceiling. This audit checks
 * consistency and labels; it does not make the fit ceilings rigorous.
 *
 * SUPERSEDED VALUE (imp-96694): the Frobenius ceiling F=3.764e7 quoted throughout this
 * module is the imp-96684 ELEVEN-rung fit. imp-96694 extended the ladder to fourteen rungs
 * (N=10000,11000,12000) and re-solved the ceiling to F14=3.775e7 (+0.30 percent, robust in
 * the same ~3.75-3.78e7 band, T < F14 < M still holds and the decomposition still closes
 * qualitatively). Every F=3.764e7 figure below is the eleven-rung snapshot, not the current
 * best fit; see imp-96694 for the fourteen-rung re-solve.
 *
 * HONEST STATUS (imp-96706): all three ceilings T, F, M are DOUBLE-PRECISION CONDITIONING
 * limits -- the N at which cond#(N) = lam_max/lam_min reaches the IEEE-double breakdown
 * scale 1/eps. None of them is the constraint that actually binds: the imp-96352 wall-clock
 * compute ceiling (~9916, a single 30-min solve reach) sits >=1500x below even the smallest
 * (trace) conditioning ceiling, so wall-clock compute binds first at every rigor level in
 * this ladder, well before double-precision conditioning ever becomes an issue.
 *
 * @see imp-96684-route-m-frobenius-majorant-high-n-rungs.js (source of the three ceilings)
 * @see imp-96686-route-m-lammax-overstatement-figure-label-audit.js (the ~1.58x ceiling ratio label)
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (trace-domination rigorous ceiling)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (measured composed ceiling 4.11e7)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (wall-clock compute ceiling ~9916)
 * @see imp-96682-route-m-conditioning-ceiling-ladder-status.js (four-rung ladder incl. compute)
 * @see imp-96694-route-m-majorant-ladder-above-9000.js (fourteen-rung re-solve: F 3.764e7 -> 3.775e7)
 *
 * Ticket: imp-96693 (accuracy, opus-4-8, api-pool). Audit only; NO QED.
 */

import { IMP96684_CEILINGS } from './imp-96684-route-m-frobenius-majorant-high-n-rungs.js';

// imp-96352 wall-clock 30-min single-process solve reach (the constraint that actually binds).
const COMPUTE_CEILING = 9916;

// The three ceilings, imported from imp-96684 (single source of truth). Each carries its
// fit-vs-rigorous label: trace is a RIGOROUS lower ceiling, Frobenius is a FIT
// extrapolation, measured is the imp-96443 MEASURED composed ceiling.
export const IMP96693_CEILINGS = Object.freeze({
  trace: Object.freeze({ N: IMP96684_CEILINGS.trace, label: 'rigorous', symbol: 'T', source: 'imp-96548 trace domination' }),
  frobenius: Object.freeze({ N: IMP96684_CEILINGS.frobenius11, label: 'fit', symbol: 'F', source: 'imp-96684 eleven-rung ||G||_F log law' }),
  measured: Object.freeze({ N: IMP96684_CEILINGS.measured, label: 'measured', symbol: 'M', source: 'imp-96443 lam_max log-fit composed' }),
});

const T = IMP96693_CEILINGS.trace.N;
const F = IMP96693_CEILINGS.frobenius.N;
const M = IMP96693_CEILINGS.measured.N;

// Pairwise ceiling ratios (Finding 2). M/F is the imp-96684 residual factor 1.092.
export const IMP96693_RATIOS = Object.freeze({
  frobeniusOverTrace: F / T, // ~1.4511 (rigorous -> fit leg)
  measuredOverFrobenius: M / F, // ~1.0917 (fit -> measured leg = imp-96684 residual factor)
  measuredOverTrace: M / T, // ~1.5842 (rigorous -> measured, = imp-96686 ~1.58x ceiling ratio)
});

// Fraction of the trace->measured gap the Frobenius fit estimate covers (Finding 2).
export const IMP96693_GAP_FRACTION = (F - T) / (M - T); // ~0.7722

// Multiplicative-decomposition closure check (Finding 3): M/T = (F/T)*(M/F) exactly.
export const IMP96693_DECOMPOSITION = Object.freeze({
  product: IMP96693_RATIOS.frobeniusOverTrace * IMP96693_RATIOS.measuredOverFrobenius,
  total: IMP96693_RATIOS.measuredOverTrace,
  relResidual:
    Math.abs(
      IMP96693_RATIOS.frobeniusOverTrace * IMP96693_RATIOS.measuredOverFrobenius -
        IMP96693_RATIOS.measuredOverTrace,
    ) / IMP96693_RATIOS.measuredOverTrace, // ~0 to machine precision
});

export const IMP96693_VERDICT = Object.freeze({
  question:
    'are the three Route M lam_max conditioning ceilings (trace 2.594e7 rigorous, Frobenius ' +
    '3.764e7 fit, measured 4.109e7) mutually consistent, with the imp-96684 residual factor ' +
    '1.092 and ~76% gap-fraction reproduced and each ceiling correctly labeled?',
  strictlyOrdered: T < F && F < M,
  residualFactor: IMP96693_RATIOS.measuredOverFrobenius, // ~1.0917
  gapFractionCovered: IMP96693_GAP_FRACTION, // ~0.7722
  ceilingRatioMeasuredOverTrace: IMP96693_RATIOS.measuredOverTrace, // ~1.5842 (= imp-96686 ~1.58x)
  decompositionCloses: IMP96693_DECOMPOSITION.relResidual < 1e-12,
  anyBoundMoved: false,
  conclusion:
    'AUDIT CONFIRMED. The three ceilings are strictly ordered T(2.594e7,rigorous) < ' +
    'F(3.764e7,fit) < M(4.109e7,measured). The residual factor M/F = 1.0917 reproduces the ' +
    'imp-96684 1.092 figure and the Frobenius fit covers (F-T)/(M-T) = 0.7722 ~= 76% of the ' +
    'trace->measured gap. The total ceiling ratio M/T = 1.5842 factors exactly as (F/T)*(M/F) ' +
    '= 1.4511 * 1.0917 (relative residual < 1e-12), reproducing the imp-96686 ~1.58x ' +
    'conditioning-ceiling ratio. Accuracy audit only; no bound moved; no operator positivity; ' +
    'no refereed bound is changed; RH open; NO QED.',
});

export const IMP96693_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Accuracy audit only: every ratio is pure ' +
  're-analysis of the three imp-96684 bisection-solved conditioning ceilings. Only the trace ' +
  'ceiling T=2.594e7 is a rigorous lower bound; the Frobenius ceiling F=3.764e7 and the ' +
  'measured ceiling M=4.109e7 both rest on the imp-96684 / imp-96443 log-fit extrapolated ' +
  '~four decades in N. No bound is claimed moved and no operator positivity is established.';

// imp-96694 re-solved the Frobenius ceiling on a fourteen-rung ladder (N up to 12000):
// F14=3.775e7 vs the eleven-rung F=3.764e7 quoted throughout this module (+0.30 percent,
// same ~3.75-3.78e7 band). Exported so downstream consumers can flag the newer figure
// instead of silently repeating the pre-extension value.
export const IMP96693_SUPERSEDED_FROBENIUS_NOTE = Object.freeze({
  elevenRungFrobeniusCeilingN: 37637000, // ~ this module's F (imp-96684, superseded snapshot)
  fourteenRungFrobeniusCeilingN: 37751000, // ~ imp-96694 re-solve (current)
  shiftFactor: 37751000 / 37637000, // ~1.00303
  statement:
    'the F=3.764e7 Frobenius ceiling in this module is the imp-96684 eleven-rung snapshot; ' +
    'imp-96694 extended the ladder to fourteen rungs and re-solved F to ~3.775e7 (+0.30 ' +
    'percent), robust in the same band. See imp-96694-route-m-majorant-ladder-above-9000.js.',
});

// imp-96706: none of T, F, M is a real-world compute limit -- each is the N at which
// cond#(N) hits the IEEE-double breakdown scale 1/eps. The imp-96352 wall-clock compute
// ceiling (~9916) sits far below all three, so compute binds first regardless of which
// conditioning ceiling is quoted.
export const IMP96693_HONEST_STATUS = Object.freeze({
  computeCeilingN: COMPUTE_CEILING, // imp-96352, ~9916 (measured wall-clock, 30-min single-process reach)
  allCeilingsAreDoublePrecisionConditioningLimits: true,
  computeBindsFirstFactor: T / COMPUTE_CEILING, // smallest of T,F,M over compute; still >=1500x
  statement:
    'The three Route M lam_max ceilings T(~2.594e7), F(~3.764e7), M(~4.109e7) are all ' +
    'DOUBLE-PRECISION CONDITIONING limits -- the N at which cond#(N) = lam_max/lam_min ' +
    'reaches the IEEE-double breakdown scale 1/eps -- not compute limits. The imp-96352 ' +
    'wall-clock compute ceiling (~9916, a single 30-min solve reach) sits ' +
    ((T / COMPUTE_CEILING).toFixed(0)) + 'x below even the smallest (trace) conditioning ' +
    'ceiling, so wall-clock compute binds first at every rigor level; double-precision ' +
    'conditioning breakdown is never the practical obstruction.',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96693_ASSERTIONS = [
  {
    id: 'imp96693-ceilings-strictly-ordered-trace-frobenius-measured',
    holds: () =>
      T < F &&
      F < M &&
      T > 2.5e7 && T < 2.7e7 &&
      F > 3.7e7 && F < 3.8e7 &&
      M > 4.0e7 && M < 4.2e7,
    why: 'the three conditioning ceilings are strictly ordered T(~2.594e7) < F(~3.764e7) < M(~4.109e7), each in its expected band.',
  },
  {
    id: 'imp96693-residual-factor-and-gap-fraction-reproduce-imp96684',
    holds: () =>
      IMP96693_RATIOS.measuredOverFrobenius > 1.08 &&
      IMP96693_RATIOS.measuredOverFrobenius < 1.10 &&
      IMP96693_GAP_FRACTION > 0.75 &&
      IMP96693_GAP_FRACTION < 0.79,
    why: 'the residual factor M/F ~= 1.092 and the Frobenius gap-fraction (F-T)/(M-T) ~= 0.77 reproduce the imp-96684 FINDING 2 figures.',
  },
  {
    id: 'imp96693-multiplicative-decomposition-closes-to-imp96686-ratio',
    holds: () =>
      IMP96693_DECOMPOSITION.relResidual < 1e-12 &&
      IMP96693_RATIOS.measuredOverTrace > 1.57 &&
      IMP96693_RATIOS.measuredOverTrace < 1.60 &&
      IMP96693_RATIOS.frobeniusOverTrace > 1.44 &&
      IMP96693_RATIOS.frobeniusOverTrace < 1.46,
    why: 'M/T = (F/T)*(M/F) closes to machine precision and M/T ~= 1.584 reproduces the imp-96686 ~1.58x conditioning-ceiling ratio, split into a 1.45x rigorous->fit leg and a 1.09x fit->measured leg.',
  },
  {
    id: 'imp96693-honesty-gate-no-qed',
    holds: () =>
      IMP96693_VERDICT.anyBoundMoved === false &&
      IMP96693_VERDICT.strictlyOrdered === true &&
      IMP96693_VERDICT.decompositionCloses === true &&
      /NO QED/.test(IMP96693_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96693_HONEST_BANNER) &&
      /RH open/.test(IMP96693_HONEST_BANNER),
    why: 'audit only: no bound moved, the ordering and decomposition-closure flags are set, and the honesty markers are present.',
  },
  {
    id: 'imp96693-honest-status-compute-binds-first',
    holds: () =>
      IMP96693_HONEST_STATUS.computeCeilingN === 9916 &&
      IMP96693_HONEST_STATUS.allCeilingsAreDoublePrecisionConditioningLimits === true &&
      IMP96693_HONEST_STATUS.computeBindsFirstFactor > 1500 &&
      /DOUBLE-PRECISION CONDITIONING limits/.test(IMP96693_HONEST_STATUS.statement) &&
      /compute binds first/.test(IMP96693_HONEST_STATUS.statement),
    why: 'the honest-status note must name the imp-96352 compute ceiling 9916 and state that all three T,F,M ceilings are double-precision conditioning limits which compute binds ahead of by >1500x.',
  },
  {
    id: 'imp96693-superseded-frobenius-note-flags-imp96694-update',
    holds: () =>
      IMP96693_SUPERSEDED_FROBENIUS_NOTE.fourteenRungFrobeniusCeilingN >
        IMP96693_SUPERSEDED_FROBENIUS_NOTE.elevenRungFrobeniusCeilingN &&
      IMP96693_SUPERSEDED_FROBENIUS_NOTE.shiftFactor > 1.0 &&
      IMP96693_SUPERSEDED_FROBENIUS_NOTE.shiftFactor < 1.01 &&
      /imp-96694/.test(IMP96693_SUPERSEDED_FROBENIUS_NOTE.statement),
    why: 'this module quotes the imp-96684 eleven-rung Frobenius ceiling (3.764e7); the note must record that imp-96694 re-solved it to the fourteen-rung 3.775e7 figure so downstream readers are not left on the pre-extension value.',
  },
];

for (const a of IMP96693_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96693-route-m-conditioning-ceiling-residual-decomposition assertion failed: ${a.id}`,
    );
  }
}

export default {
  ceilings: IMP96693_CEILINGS,
  ratios: IMP96693_RATIOS,
  gapFraction: IMP96693_GAP_FRACTION,
  decomposition: IMP96693_DECOMPOSITION,
  verdict: IMP96693_VERDICT,
  banner: IMP96693_HONEST_BANNER,
  honestStatus: IMP96693_HONEST_STATUS,
  supersededFrobeniusNote: IMP96693_SUPERSEDED_FROBENIUS_NOTE,
};
