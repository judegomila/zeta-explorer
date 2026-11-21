/**
 * @module imp-96140-number-variance-max-anchor-sample-max-honest-status
 * @fileoverview imp-96140 -- standalone HONEST-STATUS banner (imp-36182/imp-36028-style pattern)
 *   surfacing the imp-96108 HONEST CAVEAT on the max offset anchor C0_max = 0.333721: it is a
 *   SAMPLE maximum over only 11 finite measured heights (the six imp-95562 fit heights plus the
 *   five imp-96090 held-out heights) spanning roughly 1.5 decades (T = 1.0e4 .. 5.0e5).
 *
 *   imp-96108 reads the -16 percent significant excursion at T = 1.5e5 as COMPATIBLE with the
 *   max anchor -- it exactly saturates C0_max rather than breaching it -- and concludes the
 *   r_cap < 1 dead-zone is far from binding at the T = 3.0e12 window bottom. That reading is
 *   correct on the 11 measured heights, but C0_max is an empirical sample max, not a proved
 *   height-uniform bound: a genuinely deeper unmeasured excursion (offset > C0_max) at any of the
 *   ~6.8 decades of unsampled interior heights between T = 5.0e5 and the T = 3.0e12 window bottom
 *   WOULD breach the max anchor, and the 11-height sample cannot exclude one. This banner exists
 *   so a reader landing on the dead-zone claim without reading imp-96108 in full does not over-read
 *   the max anchor as a proved uniform cap.
 *
 *   Read-only note: imports the imp-96108 source module verbatim (no re-derivation, no new
 *   numerics) and restates its own HONEST CAVEAT as a standalone banner.
 *
 *   Ticket: imp-96140 (content, low). Note only; re-derives nothing; changes no bound;
 *   no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96108-number-variance-excursion-depth-vs-max-anchor.js (source module this note restates)
 * @see imp-36182-nhalf-ncross-component-model-honest-status.js (earlier instance of the banner pattern)
 * @see imp-96134-number-variance-honesty-guard.js (the overclaim-registry guard covering the same cohort)
 */

import { IMP96108_NUMBER_VARIANCE_EXCURSION_DEPTH_VS_MAX_ANCHOR } from './imp-96108-number-variance-excursion-depth-vs-max-anchor.js';

const SRC = IMP96108_NUMBER_VARIANCE_EXCURSION_DEPTH_VS_MAX_ANCHOR;

export const IMP96140_NUMBER_VARIANCE_MAX_ANCHOR_SAMPLE_MAX_HONEST_STATUS = Object.freeze({
  id: 'imp-96140',
  proofSection: 'S-frontier',
  title:
    'Honest-status banner: the imp-96108 max offset anchor C0_max = 0.333721 is a SAMPLE maximum ' +
    'over only 11 finite heights spanning ~1.5 decades, not a proved height-uniform cap',
  sourceModule: 'imp-96108-number-variance-excursion-depth-vs-max-anchor.js',

  anchor: Object.freeze({
    C0_max: SRC.anchors.C0_max,
    C0_mean: SRC.anchors.C0_mean,
    maxAnchorHeight: SRC.anchors.maxAnchorHeight,
    sampleSize: 11, // 6 imp-95562 fit heights + 5 imp-96090 held-out heights
    sampleSpanDecades: 1.5, // T = 1.0e4 .. 5.0e5
  }),

  conclusion:
    'imp-96108 shows the -16 percent significant excursion at T = 1.5e5 SATURATES rather than ' +
    'breaches the max offset anchor C0_max = 0.333721, and that the r_cap < 1 dead-zone at the ' +
    'T = 3.0e12 window bottom is far from binding (margin 0.740). Both readings hold on the 11 ' +
    'measured heights. But C0_max is an EMPIRICAL SAMPLE MAXIMUM over those 11 heights spanning ' +
    'only ~1.5 decades (T = 1.0e4 .. 5.0e5) -- it is not a proved bound uniform in T. A genuinely ' +
    'deeper unmeasured excursion (offset > C0_max) at any unsampled interior height across the ' +
    '~6.8 decades between T = 5.0e5 and the T = 3.0e12 window bottom (the imp-95710 window-reach ' +
    'sub-gap) WOULD breach the max anchor, and no finite sample can exclude that. The imp-96089 ' +
    'z = 1.92 sigma significance verdict makes C0_max trustworthy as a genuine maximal excursion ' +
    'rather than a noise spike, and imp-96129 tripled the interior sample density (25 new heights, ' +
    'reach to T = 6.37e5) without finding a breach -- but neither closes the sub-gap, since every ' +
    'measured height still sits within ~1.7 decades of the T = 5.0e5 fit range.',

  honestCaveat: Object.freeze({
    isProof: false,
    isRigorous: false,
    isUnconditional: false,
    c0MaxIsSampleMaximum: true,
    c0MaxProvedHeightUniform: false,
    unsampledDeeperExcursionCouldBreach: true,
    changesAnyBound: false,
    windowReachSubGapUntouched: true, // the imp-95710 window-reach sub-gap this banner does not close
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'SAMPLE MAXIMUM, NOT A PROVED UNIFORM CAP: the imp-96108 reading that the T = 1.5e5 excursion ' +
    'is compatible with the max offset anchor, and that the r_cap < 1 dead-zone is far from ' +
    'binding, is correct on the 11 measured heights (6 fit + 5 held-out, ~1.5 decades). C0_max = ' +
    '0.333721 is nonetheless an empirical sample maximum, not a bound proved uniform in T: an ' +
    'unsampled interior excursion strictly deeper than C0_max, anywhere in the ~6.8 decades up to ' +
    'the T = 3.0e12 window bottom, would breach the max anchor and is not excluded by this or the ' +
    'imp-96129 denser-grid follow-up. Note only; changes no bound; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
});

export const IMP96140_NUMBER_VARIANCE_MAX_ANCHOR_SAMPLE_MAX_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp96140-anchor-matches-source',
    why: 'The restated C0_max/C0_mean/maxAnchorHeight must match the imp-96108 source verbatim.',
    holds: () =>
      IMP96140_NUMBER_VARIANCE_MAX_ANCHOR_SAMPLE_MAX_HONEST_STATUS.anchor.C0_max === SRC.anchors.C0_max &&
      IMP96140_NUMBER_VARIANCE_MAX_ANCHOR_SAMPLE_MAX_HONEST_STATUS.anchor.C0_mean === SRC.anchors.C0_mean &&
      IMP96140_NUMBER_VARIANCE_MAX_ANCHOR_SAMPLE_MAX_HONEST_STATUS.anchor.maxAnchorHeight === SRC.anchors.maxAnchorHeight,
  },
  {
    id: 'imp96140-conclusion-states-sample-max',
    why: 'The conclusion must plainly flag C0_max as an empirical sample maximum, not a proved height-uniform bound.',
    holds: () =>
      /SAMPLE MAXIMUM/.test(IMP96140_NUMBER_VARIANCE_MAX_ANCHOR_SAMPLE_MAX_HONEST_STATUS.conclusion) &&
      /WOULD breach the max anchor/.test(IMP96140_NUMBER_VARIANCE_MAX_ANCHOR_SAMPLE_MAX_HONEST_STATUS.conclusion),
  },
  {
    id: 'imp96140-honesty-gate',
    why: 'This is a read-only banner note: it must not claim a proof, rigor, or unconditionality, and must flag the sample-max limitation plainly.',
    holds: () =>
      IMP96140_NUMBER_VARIANCE_MAX_ANCHOR_SAMPLE_MAX_HONEST_STATUS.honestCaveat.isProof === false &&
      IMP96140_NUMBER_VARIANCE_MAX_ANCHOR_SAMPLE_MAX_HONEST_STATUS.honestCaveat.isRigorous === false &&
      IMP96140_NUMBER_VARIANCE_MAX_ANCHOR_SAMPLE_MAX_HONEST_STATUS.honestCaveat.isUnconditional === false &&
      IMP96140_NUMBER_VARIANCE_MAX_ANCHOR_SAMPLE_MAX_HONEST_STATUS.honestCaveat.c0MaxIsSampleMaximum === true &&
      IMP96140_NUMBER_VARIANCE_MAX_ANCHOR_SAMPLE_MAX_HONEST_STATUS.honestCaveat.c0MaxProvedHeightUniform === false &&
      IMP96140_NUMBER_VARIANCE_MAX_ANCHOR_SAMPLE_MAX_HONEST_STATUS.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP96140_NUMBER_VARIANCE_MAX_ANCHOR_SAMPLE_MAX_HONEST_STATUS.honestCaveat.sota),
  },
  {
    id: 'imp96140-verdict-no-qed',
    why: 'The verdict must record NO QED, matching the standing no-refereed-bound-change caveat.',
    holds: () => /NO QED/.test(IMP96140_NUMBER_VARIANCE_MAX_ANCHOR_SAMPLE_MAX_HONEST_STATUS.verdict),
  },
];

for (const assertion of IMP96140_NUMBER_VARIANCE_MAX_ANCHOR_SAMPLE_MAX_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96140-number-variance-max-anchor-sample-max-honest-status assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP96140_NUMBER_VARIANCE_MAX_ANCHOR_SAMPLE_MAX_HONEST_STATUS;
