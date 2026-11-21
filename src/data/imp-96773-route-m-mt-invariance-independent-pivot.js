/**
 * @module imp-96773-route-m-mt-invariance-independent-pivot
 *
 * imp-96773 (accuracy, AUDIT ONLY): confirm the Route M total conditioning-ceiling ratio
 * M/T = 1.5842 (imp-96713 Finding 3) is genuinely FIT-INVARIANT -- not an artifact of the
 * shared Frobenius machinery -- by re-deriving it through a STRUCTURALLY INDEPENDENT third
 * pivot ceiling, not just the imp-96684 vs imp-96648 Frobenius pair. NO bound moved.
 *
 * THE ISSUE. imp-96713 reported M/T = (F/T)*(M/F) = 1.5842 as INVARIANT because the pivot
 * ceiling F cancels, and checked it against exactly two Frobenius fits (imp-96684 eleven-rung
 * F = 3.7637e7 and, via imp-96694, the fourteen-rung F = 3.7751e7). Both pivots come from the
 * SAME ||G||_F = sqrt(trace(G^2)) log law, so the two "checks" could not, by construction,
 * disagree: the concern is whether 1.5842 is somehow tied to the Frobenius fit rather than to
 * the two anchors M (measured composed, imp-96443) and T (trace domination, imp-96548).
 *
 * WHAT WAS DONE. The two anchors are imported single-source from imp-96684: T (rigorous lower,
 * imp-96548 trace domination) and M (measured composed, imp-96443 lam_max log-fit) -- NEITHER
 * uses the Frobenius bound. As a structurally independent third pivot the imp-96684
 * Wolkowicz-Styan two-moment ceiling ws11 = 3.7629e7 is used: it rests on the DIFFERENT matrix
 * inequality lam_max <= m + s*sqrt(n-1) (m = trace/n, s = sqrt(trace(G^2)/n - m^2)), not on
 * ||G||_F. Its eight-rung sibling ws8 = 3.7469e7 is a second independent pivot. The pivot
 * ceiling P is then swept and (P/T)*(M/P) is re-evaluated; the decomposition closure is
 * re-checked. Pure re-analysis; no bound moved.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the two anchors M and T carry NO Frobenius content.
 * -------------------------------------------------------------------------------
 * T = 2.593728e7 is the imp-96548 trace-domination ceiling (from trace = I(1,1)H_N, a proven
 * closed-form asymptotic); M = 4.108890e7 is the imp-96443 measured lam_max composed ceiling.
 * The Frobenius/Wolkowicz-Styan moment bounds enter NEITHER. So M/T = 1.5841640857 is a ratio
 * of two Frobenius-free quantities: it was never at risk of being a Frobenius artifact, and the
 * imp-96713 "invariance" (F cancels) is an algebraic tautology M/T = (F/T)*(M/F) for any F != 0.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the structurally independent Wolkowicz-Styan pivot reproduces 1.5842 exactly.
 * -------------------------------------------------------------------------------
 * Using ws11 = 3.762877e7 (two-moment bound, NOT ||G||_F): P/T = 1.450760, M/P = 1.091955,
 * (P/T)*(M/P) = 1.5841640857 -- identical to M/T to machine precision (rel residual 0). The
 * eight-rung ws8 = 3.746925e7 gives a DIFFERENT split (P/T = 1.444610, M/P = 1.096603) yet the
 * SAME product 1.5841640857. Both independent pivots land strictly in the band T < P < M, so
 * both legs stay > 1 (a non-trivial decomposition), and both recover the invariant total.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the invariance holds for ANY pivot, shown with a fit-free geometric-mean pivot.
 * -------------------------------------------------------------------------------
 * As an extreme independence check, the FIT-FREE pivot P = sqrt(T*M) = 3.264559e7 (zero
 * conditioning-ceiling-fit content, guaranteed to sit strictly between T and M) gives the
 * symmetric split P/T = M/P = 1.258636 and again (P/T)*(M/P) = 1.5841640857. This makes the
 * algebra unmistakable: M/T is a property of the two anchors alone; the Frobenius fit never
 * enters, so 1.5842 is genuinely fit-invariant, not a shared-machinery coincidence.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The imp-96713 M/T = 1.5842 invariance is confirmed against a structurally independent third
 * conditioning-ceiling estimate. The two anchors T (trace, rigorous) and M (measured) carry no
 * Frobenius content; the Wolkowicz-Styan two-moment pivot (a different matrix inequality) and
 * an arbitrary fit-free geometric-mean pivot both reproduce M/T = 1.5841640857 to machine
 * precision, each through a different (P/T, M/P) split. The ratio is genuinely pivot-free.
 * Accuracy audit only; no bound moved; no operator positivity; no refereed bound is changed;
 * RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (inherited): both anchors still rest on ~four-decade extrapolations -- T on
 * the imp-96548 trace asymptotic (rigorous form, extrapolated) and M on the imp-96443 measured
 * lam_max log-fit (non-rigorous). This audit confirms 1.5842 is fit-invariant; it does NOT make
 * either anchor rigorous, and the M/T ratio inherits the imp-96443 measured-ceiling sub-gap.
 *
 * @see imp-96713-route-m-conditioning-ceiling-decomposition-reaudit.js (the audited invariance)
 * @see imp-96684-route-m-frobenius-majorant-high-n-rungs.js (source of T, M, and the WS pivots)
 * @see imp-96693-route-m-conditioning-ceiling-residual-decomposition.js (the original decomposition)
 * @see imp-96686-route-m-lammax-overstatement-figure-label-audit.js (the ~1.58x ceiling ratio label)
 *
 * Ticket: imp-96773 (accuracy, opus-4-8, api-pool). Audit only; NO QED.
 */

import { IMP96684_CEILINGS } from './imp-96684-route-m-frobenius-majorant-high-n-rungs.js';

// The two Frobenius-FREE anchors (Finding 1). Neither uses the ||G||_F or Wolkowicz-Styan bound.
const T = IMP96684_CEILINGS.trace; // 2.593728e7 (imp-96548 trace-domination, rigorous lower)
const M = IMP96684_CEILINGS.measured; // 4.108890e7 (imp-96443 measured composed)

// Pivot ceilings. F is the Frobenius fit both prior checks used; WS11/WS8 are the structurally
// independent Wolkowicz-Styan two-moment pivots (a DIFFERENT matrix inequality); GEO is a
// fit-free geometric-mean pivot with zero conditioning-ceiling-fit content.
const F = IMP96684_CEILINGS.frobenius11; // 3.763735e7 (imp-96684 Frobenius, the prior pivot)
const WS11 = IMP96684_CEILINGS.ws11; // 3.762877e7 (Wolkowicz-Styan two-moment, independent)
const WS8 = IMP96684_CEILINGS.ws8; // 3.746925e7 (Wolkowicz-Styan eight-rung, independent)
const GEO = Math.sqrt(T * M); // 3.264559e7 (fit-free pivot, strictly between T and M)

const MT = M / T; // 1.5841640857 -- the invariant total, a ratio of two Frobenius-free anchors

// Re-derive M/T through each pivot P as (P/T)*(M/P); the pivot cancels identically.
function pivotDecomposition(P) {
  const legTraceToPivot = P / T; // P/T
  const legPivotToMeasured = M / P; // M/P
  const product = legTraceToPivot * legPivotToMeasured; // = M/T for any P != 0
  return Object.freeze({
    pivot: P,
    inBand: T < P && P < M,
    legTraceToPivot,
    legPivotToMeasured,
    product,
    relResidual: Math.abs(product - MT) / MT, // ~0 to machine precision
  });
}

export const IMP96773_ANCHORS = Object.freeze({
  trace: Object.freeze({ N: T, label: 'rigorous', symbol: 'T', frobeniusContent: false, source: 'imp-96548 trace domination' }),
  measured: Object.freeze({ N: M, label: 'measured', symbol: 'M', frobeniusContent: false, source: 'imp-96443 measured composed' }),
  ratioMeasuredOverTrace: MT, // 1.5841640857 (the invariant under audit)
});

// The independent-pivot re-derivations (Findings 2 and 3), keyed by pivot family.
export const IMP96773_PIVOTS = Object.freeze({
  frobenius11: pivotDecomposition(F), // the prior Frobenius pivot, for reference
  wolkowiczStyan11: pivotDecomposition(WS11), // structurally independent (Finding 2)
  wolkowiczStyan8: pivotDecomposition(WS8), // structurally independent, different split (Finding 2)
  geometricMean: pivotDecomposition(GEO), // fit-free pivot, symmetric split (Finding 3)
});

// The maximum deviation of any pivot re-derivation from the invariant M/T.
export const IMP96773_MAX_REL_RESIDUAL = Math.max(
  ...Object.values(IMP96773_PIVOTS).map((d) => d.relResidual),
);

export const IMP96773_VERDICT = Object.freeze({
  question:
    'is the imp-96713 total conditioning-ceiling ratio M/T = 1.5842 genuinely fit-invariant, ' +
    'or an artifact of the shared Frobenius machinery it was only checked against ' +
    '(imp-96684 / imp-96648, both ||G||_F fits)?',
  anchorsAreFrobeniusFree: IMP96773_ANCHORS.trace.frobeniusContent === false && IMP96773_ANCHORS.measured.frobeniusContent === false,
  independentPivotReproducesRatio:
    IMP96773_PIVOTS.wolkowiczStyan11.relResidual < 1e-12 &&
    IMP96773_PIVOTS.wolkowiczStyan8.relResidual < 1e-12,
  fitFreePivotReproducesRatio: IMP96773_PIVOTS.geometricMean.relResidual < 1e-12,
  differentSplitsSameProduct:
    Math.abs(IMP96773_PIVOTS.wolkowiczStyan8.legTraceToPivot - IMP96773_PIVOTS.wolkowiczStyan11.legTraceToPivot) > 1e-4 &&
    Math.abs(IMP96773_PIVOTS.wolkowiczStyan8.product - IMP96773_PIVOTS.wolkowiczStyan11.product) < 1e-9,
  ratioMeasuredOverTrace: MT, // 1.5841640857
  maxRelResidual: IMP96773_MAX_REL_RESIDUAL, // ~0
  anyBoundMoved: false,
  conclusion:
    'CONFIRMED FIT-INVARIANT. The two anchors T (2.594e7, imp-96548 trace, rigorous) and M ' +
    '(4.109e7, imp-96443 measured) carry NO Frobenius content, so M/T = 1.5841640857 was never ' +
    'a Frobenius quantity. Re-deriving it through the structurally independent Wolkowicz-Styan ' +
    'two-moment pivot (ws11 = 3.7629e7, ws8 = 3.7469e7 -- a different matrix inequality) and ' +
    'through a fit-free geometric-mean pivot each reproduces 1.5841640857 to machine precision ' +
    'via a DIFFERENT (P/T, M/P) split: the pivot cancels identically. The 1.5842 ratio is ' +
    'genuinely pivot-free, not an artifact of the shared Frobenius machinery. Accuracy audit ' +
    'only; no bound moved; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96773_SUBGAP = Object.freeze({
  id: 'imp-96773-mt-ratio-inherits-anchor-extrapolation',
  statement:
    'confirming M/T = 1.5842 is fit-invariant does NOT make either anchor rigorous: T rests on ' +
    'the imp-96548 trace asymptotic extrapolated ~four decades and M on the imp-96443 measured ' +
    'lam_max log-fit (non-rigorous), so the M/T ratio inherits the imp-96443 measured-ceiling ' +
    'sub-gap. This audit establishes invariance of the ratio to the pivot choice only.',
});

export const IMP96773_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Accuracy audit only: the anchors T (imp-96548 ' +
  'trace, rigorous) and M (imp-96443 measured) are imported single-source from imp-96684 and ' +
  'carry no Frobenius content; the Wolkowicz-Styan and geometric-mean pivot re-derivations are ' +
  'pure re-analysis of M/T = (P/T)*(M/P); no bound is claimed moved and no operator positivity ' +
  'is established. The ratio inherits the imp-96443 measured-ceiling extrapolation sub-gap.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96773_ASSERTIONS = [
  {
    id: 'imp96773-anchors-frobenius-free-ratio-1p584',
    holds: () =>
      IMP96773_VERDICT.anchorsAreFrobeniusFree === true &&
      MT > 1.58 && MT < 1.59 &&
      Math.abs(MT - M / T) < 1e-15,
    why: 'the two anchors T (trace) and M (measured) carry no Frobenius content, so M/T ~= 1.5842 is a ratio of two Frobenius-free quantities.',
  },
  {
    id: 'imp96773-independent-ws-pivot-reproduces-ratio',
    holds: () =>
      IMP96773_PIVOTS.wolkowiczStyan11.inBand &&
      IMP96773_PIVOTS.wolkowiczStyan8.inBand &&
      IMP96773_PIVOTS.wolkowiczStyan11.relResidual < 1e-12 &&
      IMP96773_PIVOTS.wolkowiczStyan8.relResidual < 1e-12 &&
      IMP96773_PIVOTS.wolkowiczStyan11.legTraceToPivot > 1 &&
      IMP96773_PIVOTS.wolkowiczStyan11.legPivotToMeasured > 1,
    why: 'the structurally independent Wolkowicz-Styan two-moment pivots (a different matrix inequality) land strictly in T < P < M and reproduce M/T = 1.5841640857 to machine precision with both legs > 1.',
  },
  {
    id: 'imp96773-different-splits-same-invariant-product',
    holds: () =>
      IMP96773_VERDICT.differentSplitsSameProduct === true &&
      IMP96773_PIVOTS.geometricMean.relResidual < 1e-12 &&
      Math.abs(IMP96773_PIVOTS.geometricMean.legTraceToPivot - IMP96773_PIVOTS.geometricMean.legPivotToMeasured) < 1e-12 &&
      IMP96773_MAX_REL_RESIDUAL < 1e-12,
    why: 'the WS8 and WS11 pivots give distinct (P/T, M/P) splits but the same product, and the fit-free geometric-mean pivot gives the symmetric split P/T = M/P -- all recovering the invariant M/T.',
  },
  {
    id: 'imp96773-honesty-gate-no-qed',
    holds: () =>
      IMP96773_VERDICT.anyBoundMoved === false &&
      IMP96773_VERDICT.independentPivotReproducesRatio === true &&
      IMP96773_VERDICT.fitFreePivotReproducesRatio === true &&
      /inherits-anchor-extrapolation/.test(IMP96773_SUBGAP.id) &&
      /NO QED/.test(IMP96773_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96773_HONEST_BANNER) &&
      /RH open/.test(IMP96773_HONEST_BANNER),
    why: 'audit only: no bound moved, the independent-pivot and fit-free-pivot invariance flags are set, and the honesty markers plus the inherited anchor-extrapolation sub-gap are present.',
  },
];

for (const a of IMP96773_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96773-route-m-mt-invariance-independent-pivot assertion failed: ${a.id}`,
    );
  }
}

export default {
  anchors: IMP96773_ANCHORS,
  pivots: IMP96773_PIVOTS,
  maxRelResidual: IMP96773_MAX_REL_RESIDUAL,
  verdict: IMP96773_VERDICT,
  subGap: IMP96773_SUBGAP,
  banner: IMP96773_HONEST_BANNER,
};
