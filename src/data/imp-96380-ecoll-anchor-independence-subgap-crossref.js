/**
 * @module data/imp-96380-ecoll-anchor-independence-subgap-crossref
 * @fileoverview imp-96380 -- explicit honest cross-reference: the imp-96311
 *   cross-column E_coll ratio law has exactly ONE genuinely independent baked
 *   anchor cross-check in the corpus, not several.
 *
 *   THE GAP THIS CLOSES (a documentation gap, not a math gap)
 *   -----------------------------------------------------------
 *   Four modules now touch the imp-96311 ratio law
 *   E_coll(C_H_a, N) / E_coll(C_H_b, N) = C_H_a / C_H_b:
 *     - imp-96327: cross-checks it against the ONE pair of E_coll values
 *       imp-96290 stored independently (0.0108806 / 0.0110547 at N = 1e4).
 *     - imp-96349: adds two more "second anchors" (N = 1e6 same C_H pair;
 *       N = 1e4 a different C_H pair {1.0, 0.127}) -- but its own SUB-GAP
 *       note already flags that both are RECONSTRUCTED from the imp-96311
 *       formula E_coll = C_H * R(N) and then re-rounded, so their UNROUNDED
 *       ratios equal C_H_b / C_H_a exactly by construction (residual 0); the
 *       tiny measured residuals are pure re-rounding-floor artifacts of the
 *       6-sig-fig storage convention, not independent evidence.
 *     - imp-96363: supplies a genuinely independent anchor at N = 1e6 via two
 *       out-of-formula gamma_N paths (closed-form Lambert-W; a +7/8-corrected
 *       count, bisection-inverted) -- but finds structurally that the ratio
 *       LAW is DEFINITIONALLY exact whenever E_coll factorizes as C_H * rate:
 *       the common rate cancels on every path, so no anchor -- independent or
 *       not -- can ever disconfirm the ratio law. What imp-96363 genuinely
 *       corroborates independently is the RATE factor R(N), not the ratio law.
 *   A reader citing "imp-96327, imp-96349, imp-96363 all independently confirm
 *   the ratio law" would overstate the evidence: only imp-96327's single
 *   anchor at N = 1e4 is an independently baked cross-check of the ratio
 *   itself; imp-96349's extra anchors are re-rounding-floor by construction;
 *   imp-96363 is independent evidence for the RATE, not the ratio.
 *
 *   THE HONEST STATEMENT
 *   -----------------------------------------------------------
 *   "Only ONE independently baked E_coll anchor pair exists in the corpus
 *   (imp-96290 at N = 1e4), and imp-96327 is the sole genuinely independent
 *   cross-check of the imp-96311 ratio law against it. imp-96349's second
 *   anchors are formula-reconstructed re-rounding-floor artifacts (not
 *   independent). imp-96363 supplies a genuinely independent second anchor,
 *   but for the RATE R(N), not the ratio law -- which is definitionally exact
 *   under C_H * R(N) factorization and so cannot be independently corroborated
 *   by any anchor at all."
 *
 *   DOCUMENTATION / CROSS-REFERENCE ONLY. Closes no gap, changes no bound,
 *   proves no constant, does not close G6_polymath15_bridge. The conditional
 *   bound C_H <= 0.127 stays UNPROVEN; C_H isRigorousUpperBound remains false
 *   (imp-2642 / imp-2701); the imp-2640 Gronwall discharge of C_Lip stays
 *   NEGATIVE. No refereed bound is changed. RH remains open.
 *   NO QED.
 *
 * @see imp-96290-step4-bridge-subconstant-inventory (the one independently baked anchor pair)
 * @see imp-96311-ecoll-rate-ch-independence-tabulation (the ratio law being cross-referenced)
 * @see imp-96327-ecoll-ratio-law-vs-anchor-crossvalidation (the sole independent cross-check)
 * @see imp-96349-ecoll-ratio-law-second-anchor-crossvalidation (re-rounding-floor second anchors, own SUB-GAP)
 * @see imp-96363-ecoll-independent-second-anchor (independent RATE corroboration, ratio law definitionally exact)
 *
 * Ticket: imp-96380 (content, medium). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

const ECOLL_ANCHOR_INDEPENDENCE_HEADWORD = Object.freeze({
  key: 'ecoll-ratio-law-anchor-independence-ledger',
  term:
    'Only imp-96327 is an independently baked cross-check of the imp-96311 ' +
    'E_coll ratio law; imp-96349 second anchors are re-rounding-floor, ' +
    'imp-96363 corroborates the RATE not the ratio',
  definition:
    'The corpus bakes exactly ONE independently stored E_coll anchor pair: ' +
    'imp-96290 at N = 1e4 (E_coll(0.125, 1e4) = 0.0108806, E_coll(0.127, 1e4) ' +
    '= 0.0110547). imp-96327 cross-checks the imp-96311 ratio law ' +
    'E_coll(C_H_a, N)/E_coll(C_H_b, N) = C_H_a/C_H_b against exactly that pair ' +
    '-- the sole genuinely independent baked cross-check the ratio law has.',
  secondAnchorsAreReroundingFloor:
    'imp-96349 adds two more "second anchors" (N = 1e6 with the same C_H pair; ' +
    'N = 1e4 with a different C_H pair {1.0, 0.127}), but both are ' +
    'RECONSTRUCTED from the imp-96311 formula E_coll = C_H * R(N) and then ' +
    're-rounded to 6 sig figs. Their unrounded ratios equal C_H_b/C_H_a exactly ' +
    'by construction (residual 0), so the tiny measured residuals imp-96349 ' +
    'reports are re-rounding-floor artifacts of the storage convention, not ' +
    'independent evidence -- imp-96349 states this itself as its own SUB-GAP.',
  independentSecondAnchorIsForTheRateNotTheRatio:
    'imp-96363 supplies a genuinely independent second anchor at N = 1e6 via ' +
    'two out-of-formula gamma_N paths (closed-form Lambert-W; a +7/8-corrected ' +
    'count). Its structural finding: because E_coll = C_H * R(N) factorizes, ' +
    'the common rate cancels in the ratio on EVERY evaluation path, so the ' +
    'ratio law is DEFINITIONALLY exact and cannot be disconfirmed -- or ' +
    'independently corroborated -- by any anchor. What imp-96363 genuinely ' +
    'corroborates independently is the RATE factor R(N), not the ratio law.',
  consequence:
    'A citation of "imp-96327, imp-96349, and imp-96363 all independently ' +
    'confirm the imp-96311 ratio law" overstates the evidence. Correct framing: ' +
    'imp-96327 (single independent anchor, N = 1e4) is the ratio law’s only ' +
    'independent baked cross-check; imp-96349’s extra anchors are ' +
    're-rounding-floor by construction; imp-96363 is independent evidence for ' +
    'the RATE R(N), not for the ratio law, which needs no independent check at ' +
    'all once E_coll = C_H * R(N) is granted.',
});

export const IMP96380_ECOLL_ANCHOR_INDEPENDENCE_SUBGAP_CROSSREF = Object.freeze({
  id: 'imp-96380',
  proofSection: 'S-frontier',
  glosses: 'imp-96311,imp-96327,imp-96349,imp-96363',
  scopes: 'imp-96290,imp-2642,imp-2701,imp-2640',
  question:
    'imp-96349 flagged that its own extra second anchors are re-rounding-floor ' +
    'artifacts, not independent corroboration of the imp-96311 ratio law. Is ' +
    'that honest sub-gap surfaced anywhere a reader of the ratio-law modules ' +
    'would see it stated explicitly and in one place?',
  headword: ECOLL_ANCHOR_INDEPENDENCE_HEADWORD,
  independentAnchorCount: 1,
  soleIndependentCrossCheck: 'imp-96327 (N = 1e4, imp-96290 baked pair)',
  reroundingFloorOnly: ['imp-96349 second anchor A (N = 1e6)', 'imp-96349 second anchor B (N = 1e4, {1.0, 0.127})'],
  independentForRateNotRatio: 'imp-96363 (N = 1e6, Lambert-W and +7/8-corrected count paths)',
  anyBoundMoved: false,
  verdict:
    'CROSS-REFERENCE LEDGER ONLY (documentation, not a proof). Exactly ONE ' +
    'genuinely independent baked E_coll anchor pair exists in the corpus ' +
    '(imp-96290 at N = 1e4), and imp-96327 is the sole independent cross-check ' +
    'of the imp-96311 ratio law against it. imp-96349’s additional second ' +
    'anchors are re-rounding-floor artifacts by construction and must not be ' +
    'cited as independent corroboration of the ratio law. imp-96363 supplies a ' +
    'genuinely independent second anchor, but for the RATE R(N); the ratio law ' +
    'itself is definitionally exact under C_H * R(N) factorization and so is ' +
    'not the kind of claim an independent anchor can corroborate. Establishes ' +
    'nothing new; moves no bound; NO QED. No refereed bound is changed' +
    '. RH remains open.',
  citation:
    'imp-96290 (the one independently baked E_coll anchor pair, N = 1e4); ' +
    'imp-96311 (the ratio law being cross-referenced); imp-96327 (sole ' +
    'independent anchor cross-check); imp-96349 (re-rounding-floor second ' +
    'anchors, own SUB-GAP note); imp-96363 (independent RATE corroboration, ' +
    'ratio law shown definitionally exact); imp-2642/imp-2701 (C_H ' +
    'isRigorousUpperBound = false); imp-2640 (negative Gronwall discharge of ' +
    'C_Lip).',
});

export default IMP96380_ECOLL_ANCHOR_INDEPENDENCE_SUBGAP_CROSSREF;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96380_ECOLL_ANCHOR_INDEPENDENCE_SUBGAP_CROSSREF_ASSERTIONS = [
  {
    id: 'imp96380-headword-names-all-four-modules',
    why:
      'The cross-reference must explicitly name every module in the anchor ' +
      'chain (imp-96311, imp-96327, imp-96349, imp-96363) so the ledger is ' +
      'discoverable from any one of them.',
    holds: () =>
      IMP96380_ECOLL_ANCHOR_INDEPENDENCE_SUBGAP_CROSSREF.glosses ===
      'imp-96311,imp-96327,imp-96349,imp-96363',
  },
  {
    id: 'imp96380-exactly-one-independent-anchor',
    why:
      'The ledger must record the count of genuinely independent baked anchor ' +
      'pairs as exactly one (imp-96290 at N = 1e4), matching imp-96349’s own ' +
      'SUB-GAP admission.',
    holds: () =>
      IMP96380_ECOLL_ANCHOR_INDEPENDENCE_SUBGAP_CROSSREF.independentAnchorCount ===
        1 &&
      /imp-96327/.test(
        IMP96380_ECOLL_ANCHOR_INDEPENDENCE_SUBGAP_CROSSREF.soleIndependentCrossCheck,
      ),
  },
  {
    id: 'imp96380-rerounding-floor-list-has-both-imp96349-anchors',
    why:
      'Both imp-96349 second anchors (the N = 1e6 same-pair one and the N = 1e4 ' +
      'different-pair one) must be listed as re-rounding-floor, not just one of ' +
      'them, since both are formula-reconstructed by the same mechanism.',
    holds: () =>
      IMP96380_ECOLL_ANCHOR_INDEPENDENCE_SUBGAP_CROSSREF.reroundingFloorOnly
        .length === 2,
  },
  {
    id: 'imp96380-imp96363-attributed-to-rate-not-ratio',
    why:
      'imp-96363 must be credited as independent evidence for the RATE R(N), ' +
      'not mis-cited as a second independent confirmation of the ratio law ' +
      'itself, which is definitionally exact and needs no such confirmation.',
    holds: () =>
      /R\(N\)/.test(
        IMP96380_ECOLL_ANCHOR_INDEPENDENCE_SUBGAP_CROSSREF.headword
          .independentSecondAnchorIsForTheRateNotTheRatio,
      ) &&
      /definitionally exact/i.test(
        IMP96380_ECOLL_ANCHOR_INDEPENDENCE_SUBGAP_CROSSREF.headword
          .independentSecondAnchorIsForTheRateNotTheRatio,
      ),
  },
  {
    id: 'imp96380-honesty-gate-no-qed',
    why:
      'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line ' +
      'present, G6_polymath15_bridge not asserted closed.',
    holds: () =>
      IMP96380_ECOLL_ANCHOR_INDEPENDENCE_SUBGAP_CROSSREF.anyBoundMoved ===
        false &&
      /NO QED/.test(IMP96380_ECOLL_ANCHOR_INDEPENDENCE_SUBGAP_CROSSREF.verdict) &&
      /refereed bound is changed/i.test(
        IMP96380_ECOLL_ANCHOR_INDEPENDENCE_SUBGAP_CROSSREF.verdict,
      ),
  },
];

for (const assertion of IMP96380_ECOLL_ANCHOR_INDEPENDENCE_SUBGAP_CROSSREF_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96380-ecoll-anchor-independence-subgap-crossref assertion failed: ${assertion.id}`,
    );
  }
}
