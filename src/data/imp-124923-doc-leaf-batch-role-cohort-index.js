/**
 * @module imp-124923-doc-leaf-batch-role-cohort-index
 * @fileoverview imp-124923 -- META cross-reference cohort index grouping the imp-124776/124821/
 *   124823/124824/124837 documentation-leaf batch by ROLE: viz leaf (imp-124776, imp-124824),
 *   honest-status note (imp-124821, imp-124823), cross-reference note (imp-124837), mirroring the
 *   imp-124822 cohort-index pattern. Read individually, a scout may mistake any one leaf for an
 *   isolated artifact rather than part of a documentation pass over the already-committed
 *   imp-124769/124770/124772/124793 frontier measurements. Index/meta only; establishes nothing
 *   new; changes no bound; NO QED.
 *
 *   THE BATCH, BY ROLE.
 *     VIZ LEAF (presentation only, reuses a source module's numbers verbatim for a chart):
 *       imp-124776 -- charts the imp-97823 reconstruction-kernel |K| per-decade growth ratio
 *         keyed by the actual near-peak gap g (not a bare decade index), both arms bracketing
 *         sqrt(10) = 3.162278.
 *       imp-124824 -- charts the imp-124769 E_CF finite-difference error decomposition across
 *         landmarks L2..L6: the O(eps^2) truncation plateau, the round-off floor R ~ 4.5e-13, and
 *         the pinned crossover |E_CF|_crit ~ 1.4e-6 between L5 and L6.
 *     HONEST-STATUS NOTE (standalone restatement of a finding already stated inline elsewhere, so
 *       it is independently checkable without re-reading the source module):
 *       imp-124821 -- restates that the imp-124770 pair-ratio deep-tail |reldiff| growth
 *         (5.8e-12 .. 6.8e-4, L2..L7) is the imp-124769 round-off crossover showing through the
 *         numerical cross-check, not a deviation from the imp-97665 EXACT identity.
 *       imp-124823 -- restates the imp-124772 (F2) finding that the 10-floor OLS fit leaves a
 *         faint sign-symmetric residual curvature (~3e-3 decades), real but ~100x smaller than the
 *         gap to the -1.375 interior-peak alternative, so it does not threaten p_knee ~ -2.106.
 *     CROSS-REFERENCE NOTE (ties a committed result into a wider narrative thread, stating a
 *       connection rather than restating one module's own inline claim):
 *       imp-124837 -- ties the imp-97723 closed-form RvM-slope identity and the imp-124793
 *         per-nine spacing ladder explicitly into the sigma conditional-share narrative: the
 *         per-nine ladder is the N-cost schedule of the conditional-share residual decaying, not
 *         an isolated numerology exercise.
 *
 *   WHY GROUP THESE BY ROLE (not re-derive). All five leaves add zero new numerics -- each reuses a
 *   frozen export from an already-committed module verbatim. What differs is HOW each leaf repackages
 *   its source: a viz leaf relabels numbers onto a chart axis, an honest-status note restates an
 *   inline finding standalone so a future scout need not re-read the full source module, and a
 *   cross-reference note states an explicit connection between two otherwise-separate threads. Read
 *   individually, the five could be mistaken for five separate artifacts; read by role, they are two
 *   viz leaves, two honest-status notes, and one cross-reference note, all serving the same
 *   documentation-pass function over the already-closed imp-124769/124770/124772/97823/124793
 *   measurements. This index bakes that role grouping verbatim so future work does not re-derive any
 *   of the five, and does not mistake a role-tagged leaf for an open question.
 *
 *   STATUS: a grouping/index note over five already-committed modules, not a new derivation. No
 *   bound changes; C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz untouched; imp-3066
 *   K_a >= 0 untouched; RH open; NO QED. No refereed bound is changed.
 *
 * @see imp-124776-kernel-decade-ratio-vs-gap-viz-data.js (viz leaf: kernel decade-ratio vs gap g)
 * @see imp-124821-pairratio-deeptail-reldiff-roundoff-honest-status.js (honest-status: pair-ratio reldiff root cause)
 * @see imp-124823-f2-curvature-honest-status.js (honest-status: F2 residual curvature real-but-harmless)
 * @see imp-124824-ecf-stencil-crossover-viz-data.js (viz leaf: E_CF stencil crossover ladder L2..L6)
 * @see imp-124837-fartail-rvm-per-nine-conditional-share-note.js (cross-reference: per-nine ladder = conditional-share cost schedule)
 * @see imp-124822-frontier-crosscheck-batch-cohort-index.js (sibling cohort-index this mirrors)
 *
 * Ticket: imp-124923 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

const DOC_LEAF_BATCH_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-124776',
    role: 'viz leaf',
    result:
      'Charts the imp-97823 reconstruction-kernel |K| per-decade growth ratio keyed by the actual ' +
      'near-peak gap g, on both arms of the L1 sigma peak, overlaid with the sqrt(10) = 3.162278 ' +
      'asymptote. Every ratio is reused verbatim; no new computation.',
  }),
  Object.freeze({
    id: 'imp-124821',
    role: 'honest-status note',
    result:
      'Restates, standalone, that the imp-124770 pair-ratio deep-tail |reldiff| growth (5.8e-12 at ' +
      'L2 to 6.8e-4 at L7) is driven by the imp-124769 round-off crossover (|E_CF|_crit ~ 1.4e-6, ' +
      'sigma_crit ~ 0.013, between L5 and L6), not a deviation from the imp-97665 EXACT identity.',
  }),
  Object.freeze({
    id: 'imp-124823',
    role: 'honest-status note',
    result:
      'Restates, standalone, the imp-124772 (F2) finding that the full 10-floor OLS fit leaves a ' +
      'real but faint sign-symmetric residual curvature (~3e-3 decades), ~100x smaller than the gap ' +
      'to the -1.375 interior-peak alternative, so it cannot flip the p_knee ~ -2.106 identification.',
  }),
  Object.freeze({
    id: 'imp-124824',
    role: 'viz leaf',
    result:
      'Charts the imp-124769 E_CF finite-difference error decomposition across landmarks L2..L6: ' +
      'the O(eps^2) truncation power law, the round-off floor R ~ 4.5e-13, and the pinned crossover ' +
      '|E_CF|_crit ~ 1.4e-6 between L5 and L6. Every ladder value is reused verbatim.',
  }),
  Object.freeze({
    id: 'imp-124837',
    role: 'cross-reference note',
    result:
      'Ties the imp-97723 closed-form RvM-slope identity and the imp-124793 per-nine spacing ladder ' +
      'explicitly into the sigma conditional-share narrative: each added nine of certainty costs a ' +
      'ten-fold jump in the required log10 N, read as the cost schedule of the conditional-share ' +
      'residual decaying, not an isolated numerology exercise.',
  }),
]);

const ROLE_COUNTS = Object.freeze({
  'viz leaf': DOC_LEAF_BATCH_COHORT.filter((m) => m.role === 'viz leaf').length,
  'honest-status note': DOC_LEAF_BATCH_COHORT.filter((m) => m.role === 'honest-status note').length,
  'cross-reference note': DOC_LEAF_BATCH_COHORT.filter((m) => m.role === 'cross-reference note').length,
});

export const IMP124923_DOC_LEAF_BATCH_ROLE_COHORT_INDEX = Object.freeze({
  id: 'imp-124923',
  proofSection: 'S-frontier',
  cohort: DOC_LEAF_BATCH_COHORT,
  roleCounts: ROLE_COUNTS,
  anyBoundMoved: false,
  question:
    'The documentation-leaf batch (imp-124776, imp-124821, imp-124823, imp-124824, imp-124837) ' +
    'reads as five separate artifacts over the already-committed imp-124769/124770/124772/97823/' +
    '124793 measurements. Grouped by role, do they form a coherent documentation pass, or could a ' +
    'future scout mistake a role-tagged leaf for a still-open question?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). The batch splits cleanly into three roles: two viz ' +
    'leaves (imp-124776, imp-124824) relabel already-committed numbers onto a chart axis; two ' +
    'honest-status notes (imp-124821, imp-124823) restate a finding already stated inline in a ' +
    'source module, standalone, so it is independently checkable; one cross-reference note ' +
    '(imp-124837) states an explicit connection between two otherwise-separate threads (the RvM-' +
    'slope identity and the per-nine spacing ladder) rather than restating a single module’s own ' +
    'claim. None of the five adds new numerics. Future work on this thread should not re-derive any ' +
    'of the five viz/status/reference leaves, and should not treat a role-tagged leaf as an open ' +
    'question. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation; C_mb ' +
    'GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; imp-3066 ' +
    'K_a >= 0 untouched; establishes nothing new; moves no bound; RH open; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-124776 (viz leaf, kernel decade-ratio vs gap g); imp-124821 (honest-status, pair-ratio ' +
    'reldiff root cause); imp-124823 (honest-status, F2 residual curvature real-but-harmless); ' +
    'imp-124824 (viz leaf, E_CF stencil crossover ladder L2..L6); imp-124837 (cross-reference, per-' +
    'nine ladder = conditional-share cost schedule); imp-124769/124770/124772/97823/124793 (the ' +
    'source measurements this batch documents); imp-124822-frontier-crosscheck-batch-cohort-index.js ' +
    '(sibling cohort-index this mirrors).',
});

export default IMP124923_DOC_LEAF_BATCH_ROLE_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124923_DOC_LEAF_BATCH_ROLE_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp124923-cohort-has-all-five-members',
    why: 'The whole point of the index is grouping exactly these five modules; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP124923_DOC_LEAF_BATCH_ROLE_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-124776', 'imp-124821', 'imp-124823', 'imp-124824', 'imp-124837'].every((id) =>
        ids.includes(id),
      );
    },
  },
  {
    id: 'imp124923-role-counts-match-two-two-one',
    why: 'The batch splits into exactly two viz leaves, two honest-status notes, and one ' +
      'cross-reference note; a drift in these counts means a member was mis-tagged.',
    holds: () => {
      const rc = IMP124923_DOC_LEAF_BATCH_ROLE_COHORT_INDEX.roleCounts;
      return rc['viz leaf'] === 2 && rc['honest-status note'] === 2 && rc['cross-reference note'] === 1;
    },
  },
  {
    id: 'imp124923-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP124923_DOC_LEAF_BATCH_ROLE_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP124923_DOC_LEAF_BATCH_ROLE_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP124923_DOC_LEAF_BATCH_ROLE_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP124923_DOC_LEAF_BATCH_ROLE_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124923-doc-leaf-batch-role-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
