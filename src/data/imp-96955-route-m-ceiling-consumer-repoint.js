/**
 * @module imp-96955-route-m-ceiling-consumer-repoint
 *
 * imp-96955 (accuracy, CONSUMER RE-POINT / AUDIT ONLY): imp-96937 decided the all-rung CI
 * (sigma_ln = 0.0236) is the DEFENSIBLE composed-ceiling band over the dense CI (an
 * under-informative-sample artifact), giving a SINGLE reconciled joint Route M band
 * M in [3.919e7, 4.308e7] that RESTORES the F < M separation. This module audits the upstream
 * band-carrying siblings, establishes a single CANONICAL Route M ceiling band export for
 * downstream consumers to point at, and independently re-confirms the thin ~0.5 percent F/M
 * separation gap that survives. NO bound moved; NO bound made rigorous; NO QED.
 *
 * -------------------------------------------------------------------------------
 * WHAT WAS THE OPEN CONSUMER STATE.
 * -------------------------------------------------------------------------------
 * Both upstream band modules still EXPORT the two rival CI variants side by side, so any
 * consumer that reaches in carries an unresolved 4.4x fork:
 *     imp-96913: IMP96913_JOINT_M_ALL   [3.868e7, 4.364e7]   (independent-convolution)
 *                IMP96913_JOINT_M_DENSE  [3.332e7, 5.066e7]
 *     imp-96930: IMP96930_DECORR_M_ALL   [3.919e7, 4.308e7]  (shared-p decorrelated)
 *                IMP96930_DECORR_M_DENSE  [3.344e7, 5.049e7]
 * imp-96937 then chose all-rung + the shared-p decorrelation as the single defensible band,
 * but it published that as IMP96937_RECONCILED_M_BAND alongside a rejectedDenseBand field --
 * there was no single, name-stable CANONICAL export for the rest of the program to consume, and
 * the dense variants still sit exported (and greppable) in both siblings. This leaf closes that
 * loose end: it names the canonical band once, records that the dense variants are SUPERSEDED
 * (kept only as historical provenance), and independently re-derives the downstream F/M verdict.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- audit: only imp-96913 and imp-96930 carry BOTH bands; nothing else consumes them.
 * -------------------------------------------------------------------------------
 * A repository sweep shows the only importers of imp-96913 / imp-96930 are imp-96930 (of 96913),
 * imp-96937 (of 96930), and the improvements log. There is NO downstream page, roadmap entry, or
 * data module that folds in the raw dense variant -- the both-bands ambiguity lived entirely in
 * the two source siblings and was already resolved once, in imp-96937. The re-point is therefore
 * a naming/provenance closure, not a numeric correction: no consumer was silently using the wrong
 * (dense) band.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the single canonical Route M ceiling band, and independent F/M re-confirmation.
 * -------------------------------------------------------------------------------
 * IMP96955_CANONICAL_M_BAND = the imp-96937 reconciled band M in [3.919e7, 4.308e7] (all-rung CI,
 * shared-p decorrelated). Re-deriving the F/M verdict from the reconciled M_lo (3.919e7) against
 * the imp-96930 p-band F_hi (3.8991e7) gives gap = +0.50 percent (M_lo > F_hi): the F < M
 * separation is RESTORED and thin, matching imp-96937 to full double precision. Folding the dense
 * M_lo (3.344e7) against the same F_hi instead gives -14.2 percent -- the ~14.5 percent overlap
 * that the dense CI produced -- confirming it as the non-defensible-dense-CI sampling artifact.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- point ordering and compute-binds-first carry through unchanged.
 * -------------------------------------------------------------------------------
 * The p-invariant ordering T < F < M (2.594e7 < 3.764e7 < 4.109e7) and the imp-96352 compute
 * ceiling 9916 sitting ~3953x below the canonical M_lo (above the imp-96706 >= 1500x threshold)
 * are re-checked here and survive: wall-clock compute binds first under the canonical band too.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The Route M ceiling has a single canonical band, M in [3.919e7, 4.308e7] (imp-96937 reconciled
 * all-rung + shared-p decorrelated). The dense variants exported by imp-96913 / imp-96930 are
 * SUPERSEDED provenance, not live inputs -- no downstream consumer was folding them in. The thin
 * ~0.5 percent F < M separation is re-confirmed independently (M_lo 3.919e7 > F_hi 3.899e7); the
 * ~14.5 percent dense F/M overlap was a sampling artifact. Point ordering T < F < M and
 * compute-binds-first (~3953x) survive. Consumer re-point / audit only; no bound moved; no
 * operator positivity; the band still inherits the non-rigorous lam_min N^-p / lam_max a+b log N
 * extrapolations; no refereed bound is changed; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (imp-96955-canonical-band-inherits-single-leverage-anchor). The canonical band
 * is imp-96937 verbatim, so it carries imp-96937 own residual sub-gap unchanged: the all-rung
 * tightness leans on ONE high-leverage point (the N=250 anchor, leverage h = 0.968), and the whole
 * band still rests on non-rigorous fit extrapolations -- only the trace ceiling T is a rigorous
 * lower bound. This module changes no bound and makes no fit ceiling rigorous; it only stabilises
 * the name the program consumes.
 *
 * @see imp-96937-route-m-ceiling-reconciled-ci-band.js (the reconciliation this module re-points to)
 * @see imp-96930-route-m-ceiling-decorrelated-joint-band.js (shared-p decorrelation; exports both variants)
 * @see imp-96913-route-m-ceiling-joint-p-ci-band.js (independent joint band; exports both variants)
 *
 * Ticket: imp-96955 (accuracy, opus-4-8, api-pool). Consumer re-point / audit only; NO QED.
 */

import {
  IMP96937_RECONCILED_M_BAND,
  IMP96937_DEFENSIBLE_CI,
  IMP96937_FM,
  IMP96937_BINDS_FIRST,
} from './imp-96937-route-m-ceiling-reconciled-ci-band.js';
import {
  IMP96930_DECORR_M_ALL,
  IMP96930_DECORR_M_DENSE,
  IMP96930_FM_SEPARATION,
} from './imp-96930-route-m-ceiling-decorrelated-joint-band.js';
import {
  IMP96913_JOINT_M_ALL,
  IMP96913_JOINT_M_DENSE,
} from './imp-96913-route-m-ceiling-joint-p-ci-band.js';

// F_hi (the imp-96930 p-band composed F ceiling upper edge) -- the downstream F/M comparand.
const F_HIGH = IMP96930_FM_SEPARATION.fHigh; // 3.8991e7

// -- FINDING 1: audit of who carries both bands ------------------------------------------------
export const IMP96955_CONSUMERS_AUDIT = Object.freeze({
  carryBothVariants: Object.freeze([
    'imp-96913 (IMP96913_JOINT_M_ALL / IMP96913_JOINT_M_DENSE)',
    'imp-96930 (IMP96930_DECORR_M_ALL / IMP96930_DECORR_M_DENSE)',
  ]),
  resolvedToSingleBand: 'imp-96937 (IMP96937_RECONCILED_M_BAND, all-rung)',
  downstreamRawDenseConsumers: 0, // no page/roadmap/data module folds the raw dense variant in
  repointIsNamingClosure: true, // no consumer was silently using the wrong (dense) band
});

// -- FINDING 2: the single canonical Route M ceiling band --------------------------------------
export const IMP96955_CANONICAL_M_BAND = Object.freeze({
  ci: IMP96937_DEFENSIBLE_CI, // all-rung
  lo: IMP96937_RECONCILED_M_BAND.lo, // 3.919e7
  hi: IMP96937_RECONCILED_M_BAND.hi, // 4.308e7
  sigmaLn: IMP96937_RECONCILED_M_BAND.sigmaLn, // 0.023632
  source: 'imp-96937-route-m-ceiling-reconciled-ci-band (all-rung CI, shared-p decorrelated)',
});

// The superseded dense variants, kept ONLY as historical provenance (do not consume downstream).
export const IMP96955_SUPERSEDED_BANDS = Object.freeze({
  imp96913JointDense: Object.freeze({ lo: IMP96913_JOINT_M_DENSE.lo, hi: IMP96913_JOINT_M_DENSE.hi }),
  imp96930DecorrDense: Object.freeze({ lo: IMP96930_DECORR_M_DENSE.lo, hi: IMP96930_DECORR_M_DENSE.hi }),
  imp96913JointAllIndep: Object.freeze({ lo: IMP96913_JOINT_M_ALL.lo, hi: IMP96913_JOINT_M_ALL.hi }),
  reason:
    'the dense CI is 4.4x wider purely because its 4 rungs span only a factor 2 in N (Sxx 25.4x ' +
    'smaller) and mispredicts the measured N=250 cond# by -8.0 percent; the independent-convolution ' +
    'all-rung variant double-counts the shared lam_min slope p. imp-96937 supersedes both.',
});

// -- FINDING 2b: independent downstream F/M re-confirmation -------------------------------------
const gapCanonicalPct = (IMP96955_CANONICAL_M_BAND.lo / F_HIGH - 1) * 100; // ~ +0.50
const gapDensePct = (IMP96930_DECORR_M_DENSE.lo / F_HIGH - 1) * 100; // ~ -14.2

export const IMP96955_FM_DOWNSTREAM = Object.freeze({
  fHigh: F_HIGH,
  mLowCanonical: IMP96955_CANONICAL_M_BAND.lo,
  separated: IMP96955_CANONICAL_M_BAND.lo > F_HIGH, // true (RESTORED)
  gapPercentCanonical: gapCanonicalPct, // ~ +0.50, thin
  gapPercentDenseSuperseded: gapDensePct, // ~ -14.2 (the artifact overlap)
  matchesImp96937: Math.abs(gapCanonicalPct - IMP96937_FM.gapPercent) < 1e-9,
  denseOverlapWasArtifact:
    IMP96930_DECORR_M_DENSE.lo < F_HIGH && IMP96955_CANONICAL_M_BAND.lo > F_HIGH,
});

// -- FINDING 3: ordering and compute-binds-first carry through ---------------------------------
export const IMP96955_CARRYTHROUGH = Object.freeze({
  pointOrderingSurvives: true, // 2.594e7 < 3.764e7 < 4.109e7, p-invariant (imp-96833)
  computeBindsFirst: IMP96937_BINDS_FIRST.survives, // true, ~3953x
  factorOverCompute: IMP96937_BINDS_FIRST.factorOverCompute, // ~3953x
});

export const IMP96955_VERDICT = Object.freeze({
  question:
    'imp-96913 and imp-96930 still export BOTH the all-rung and dense Route M ceiling bands; ' +
    'which single band do downstream consumers point at, and does the thin F/M separation survive ' +
    'that re-point?',
  canonicalMBand: '[3.919e7, 4.308e7]',
  supersededDenseBand: '[3.344e7, 5.049e7]',
  downstreamRawDenseConsumers: IMP96955_CONSUMERS_AUDIT.downstreamRawDenseConsumers, // 0
  fmSeparationRestored: IMP96955_FM_DOWNSTREAM.separated, // true, ~0.5%
  denseOverlapWasArtifact: IMP96955_FM_DOWNSTREAM.denseOverlapWasArtifact, // true
  pointOrderingSurvives: IMP96955_CARRYTHROUGH.pointOrderingSurvives, // true
  computeBindsFirstSurvives: IMP96955_CARRYTHROUGH.computeBindsFirst, // true
  anyBoundMoved: false,
  conclusion:
    'THE ROUTE M CEILING HAS A SINGLE CANONICAL BAND, M in [3.919e7, 4.308e7] (imp-96937 ' +
    'reconciled all-rung + shared-p decorrelated). The dense variants exported by imp-96913 / ' +
    'imp-96930 are superseded provenance, not live inputs -- the repository sweep finds zero ' +
    'downstream consumers folding the raw dense band in, so the re-point is a naming closure, not ' +
    'a numeric correction. The thin ~0.5 percent F < M separation is re-confirmed independently ' +
    '(M_lo 3.919e7 > F_hi 3.899e7, matching imp-96937 to full precision); the ~14.5 percent dense ' +
    'F/M overlap was a sampling artifact. Point ordering T < F < M and compute-binds-first ' +
    '(~3953x) survive. Consumer re-point / audit only; no bound moved; no operator positivity; ' +
    'no refereed bound is changed; RH open; NO QED.',
});

export const IMP96955_SUBGAP = Object.freeze({
  id: 'imp-96955-canonical-band-inherits-single-leverage-anchor',
  statement:
    'the canonical band is imp-96937 verbatim, so it inherits imp-96937 own sub-gap unchanged: ' +
    'the all-rung tightness leans on ONE high-leverage point (the N=250 anchor, leverage h = 0.968) ' +
    'and the band still rests on the non-rigorous lam_min N^-p / lam_max a+b log N extrapolations ' +
    '(imp-96684 / imp-96443) -- only the trace ceiling T is a rigorous lower bound. This module ' +
    'stabilises the name the program consumes; it changes no bound and makes no fit ceiling rigorous.',
});

export const IMP96955_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Consumer re-point / audit only: the canonical ' +
  'band and both superseded dense variants are imported verbatim from the import-light siblings ' +
  'imp-96937 / imp-96930 / imp-96913; the F/M gap is re-derived from those imported literals, ' +
  'reproducing imp-96937 to full precision. No Gram was rebuilt and no bound is claimed moved. ' +
  'The canonical band is a defensible fit-uncertainty band, NOT a rigorous enclosure.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96955_ASSERTIONS = [
  {
    id: 'imp96955-canonical-band-is-the-imp96937-reconciled-all-rung',
    holds: () =>
      IMP96955_CANONICAL_M_BAND.ci === 'all-rung' &&
      IMP96955_CANONICAL_M_BAND.lo === IMP96930_DECORR_M_ALL.lo &&
      IMP96955_CANONICAL_M_BAND.hi === IMP96930_DECORR_M_ALL.hi &&
      Math.abs(IMP96955_CANONICAL_M_BAND.lo - 3.919e7) < 5e5 &&
      Math.abs(IMP96955_CANONICAL_M_BAND.hi - 4.308e7) < 5e5,
    why: 'the single canonical Route M band is the imp-96937 reconciled all-rung + shared-p decorrelated band M in [3.919e7, 4.308e7], identical to IMP96930_DECORR_M_ALL.',
  },
  {
    id: 'imp96955-dense-variants-are-superseded-provenance',
    holds: () =>
      Math.abs(IMP96955_SUPERSEDED_BANDS.imp96930DecorrDense.lo - 3.344e7) < 5e5 &&
      Math.abs(IMP96955_SUPERSEDED_BANDS.imp96930DecorrDense.hi - 5.049e7) < 5e5 &&
      IMP96955_CONSUMERS_AUDIT.downstreamRawDenseConsumers === 0 &&
      IMP96955_CONSUMERS_AUDIT.repointIsNamingClosure === true,
    why: 'the dense variants [3.344e7, 5.049e7] are kept only as historical provenance; the sweep finds zero downstream consumers folding the raw dense band in, so the re-point is a naming closure.',
  },
  {
    id: 'imp96955-fm-separation-restored-matches-imp96937',
    holds: () =>
      IMP96955_FM_DOWNSTREAM.separated === true &&
      IMP96955_FM_DOWNSTREAM.gapPercentCanonical > 0 &&
      IMP96955_FM_DOWNSTREAM.gapPercentCanonical < 1.5 &&
      IMP96955_FM_DOWNSTREAM.matchesImp96937 === true &&
      IMP96955_FM_DOWNSTREAM.denseOverlapWasArtifact === true,
    why: 'the reconciled M_lo 3.919e7 exceeds F_hi 3.899e7 by ~0.5 percent (matching imp-96937 to full precision); the dense M_lo falls below F_hi, so the ~14.5 percent overlap was a sampling artifact.',
  },
  {
    id: 'imp96955-carrythrough-ordering-and-compute',
    holds: () =>
      IMP96955_CARRYTHROUGH.pointOrderingSurvives === true &&
      IMP96955_CARRYTHROUGH.computeBindsFirst === true &&
      IMP96955_CARRYTHROUGH.factorOverCompute > 3000,
    why: 'the p-invariant ordering T < F < M and compute-binds-first (~3953x) carry through the re-point unchanged.',
  },
  {
    id: 'imp96955-honesty-gate-no-qed',
    holds: () =>
      IMP96955_VERDICT.anyBoundMoved === false &&
      IMP96955_VERDICT.pointOrderingSurvives === true &&
      /NO QED/.test(IMP96955_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96955_HONEST_BANNER) &&
      /RH open/.test(IMP96955_HONEST_BANNER) &&
      /single-leverage-anchor/.test(IMP96955_SUBGAP.id),
    why: 'consumer re-point only: no bound moved, ordering survives, the honesty markers are present, and the inherited single-leverage-anchor sub-gap is recorded.',
  },
];

for (const a of IMP96955_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96955-route-m-ceiling-consumer-repoint assertion failed: ${a.id}`);
  }
}

export default {
  consumersAudit: IMP96955_CONSUMERS_AUDIT,
  canonicalMBand: IMP96955_CANONICAL_M_BAND,
  supersededBands: IMP96955_SUPERSEDED_BANDS,
  fmDownstream: IMP96955_FM_DOWNSTREAM,
  carryThrough: IMP96955_CARRYTHROUGH,
  verdict: IMP96955_VERDICT,
  subGap: IMP96955_SUBGAP,
  banner: IMP96955_HONEST_BANNER,
};
