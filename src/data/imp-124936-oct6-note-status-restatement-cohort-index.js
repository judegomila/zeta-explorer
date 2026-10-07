/**
 * @module imp-124936-oct6-note-status-restatement-cohort-index
 * @fileoverview imp-124936 -- META cross-reference cohort index grouping the Oct-6 note/status-
 *   restatement leaves imp-124823 (F2 curvature honest-status), imp-124824 (E_CF crossover viz),
 *   imp-124825 (chord-to-certification upgrade note), imp-124837 (far-tail RvM per-nine note) by
 *   role, DISTINCT from imp-124822 (which indexes the underlying imp-124769/124770/124771/124772
 *   MEASUREMENTS themselves, not the documentation layer built on top of them). This cohort
 *   overlaps imp-124923's membership (imp-124823, imp-124824, imp-124837 appear in both) but is not
 *   a duplicate: imp-124923 groups those three with imp-124776/imp-124821, while this index groups
 *   the same three with imp-124825 -- a different leaf, grouped here because it shares the
 *   Oct-6 note/status-restatement role with the other three. Index/meta only; establishes nothing
 *   new; changes no bound; NO QED.
 *
 *   THE COHORT, BY ROLE.
 *     HONEST-STATUS NOTE (standalone restatement of a finding already stated inline elsewhere):
 *       imp-124823 -- restates the imp-124772 (F2) finding that the 10-floor OLS fit leaves a real
 *         but faint sign-symmetric residual curvature (~3e-3 decades), ~100x smaller than the gap
 *         to the -1.375 interior-peak alternative, so it cannot flip p_knee ~ -2.106.
 *     VIZ LEAF (presentation only, reuses a source module's numbers verbatim for a chart):
 *       imp-124824 -- charts the imp-124769 E_CF finite-difference error decomposition across
 *         landmarks L2..L6: the O(eps^2) truncation plateau, the round-off floor R ~ 4.5e-13, and
 *         the pinned crossover |E_CF|_crit ~ 1.4e-6 between L5 and L6.
 *     CROSS-REFERENCE NOTE (ties a committed result into a wider narrative thread):
 *       imp-124825 -- records that imp-124772's full 10-floor OLS refit (p_knee_lsq ~ -2.106,
 *         R^2 ~ 0.99999) UPGRADES the imp-97822 two-point chord (~-2.099) from a zero-residual
 *         two-point fit to a quantified-residual certification over the entire imp-33708 ladder.
 *       imp-124837 -- ties the imp-97723 closed-form RvM-slope identity and the imp-124793
 *         per-nine spacing ladder explicitly into the sigma conditional-share narrative: the
 *         per-nine ladder is the N-cost schedule of the conditional-share residual decaying.
 *
 *   WHY GROUP THESE (not re-derive). All four leaves add zero new numerics -- each reuses a frozen
 *   export from an already-committed module verbatim. What unifies them as "Oct-6 note/status-
 *   restatement" leaves is that none is a raw MEASUREMENT (that role belongs to imp-124822's
 *   imp-124769/124770/124771/124772 cohort): each either restates an inline finding standalone
 *   (imp-124823), relabels numbers onto a chart axis (imp-124824), or states an explicit connection
 *   between two otherwise-separate threads (imp-124825, imp-124837). This index bakes that
 *   distinction verbatim so future work does not mistake this documentation-layer cohort for the
 *   imp-124822 measurement cohort it documents, and does not re-derive any of the four leaves.
 *
 *   STATUS: a grouping/index note over four already-committed modules, not a new derivation. No
 *   bound changes; C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz untouched; imp-3066
 *   K_a >= 0 untouched; RH open; NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-124823-f2-curvature-honest-status.js (honest-status: F2 residual curvature real-but-harmless)
 * @see imp-124824-ecf-stencil-crossover-viz-data.js (viz leaf: E_CF stencil crossover ladder L2..L6)
 * @see imp-124825-etrunc-floor-exponent-chord-to-certification-upgrade-note.js (cross-reference: chord-to-certification upgrade)
 * @see imp-124837-fartail-rvm-per-nine-conditional-share-note.js (cross-reference: per-nine ladder = conditional-share cost schedule)
 * @see imp-124822-frontier-crosscheck-batch-cohort-index.js (sibling index over the underlying imp-124769/124770/124771/124772 MEASUREMENTS)
 * @see imp-124923-doc-leaf-batch-role-cohort-index.js (overlapping but distinct cohort-index: swaps imp-124776/imp-124821 for imp-124825)
 *
 * Ticket: imp-124936 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing;
 * NO QED; Platt-Trudgian Lambda <= 0.2 SOTA.
 */

const OCT6_NOTE_STATUS_COHORT = Object.freeze([
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
    id: 'imp-124825',
    role: 'cross-reference note',
    result:
      'Records that imp-124772’s full 10-floor OLS refit (p_knee_lsq ~ -2.106, R^2 ~ 0.99999) ' +
      'upgrades the imp-97822 two-point chord (~-2.099) from a zero-residual two-point fit to a ' +
      'quantified-residual certification over the entire imp-33708 0.5x..5x floor ladder.',
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
  'honest-status note': OCT6_NOTE_STATUS_COHORT.filter((m) => m.role === 'honest-status note').length,
  'viz leaf': OCT6_NOTE_STATUS_COHORT.filter((m) => m.role === 'viz leaf').length,
  'cross-reference note': OCT6_NOTE_STATUS_COHORT.filter((m) => m.role === 'cross-reference note').length,
});

export const IMP124936_OCT6_NOTE_STATUS_RESTATEMENT_COHORT_INDEX = Object.freeze({
  id: 'imp-124936',
  proofSection: 'S-frontier',
  cohort: OCT6_NOTE_STATUS_COHORT,
  roleCounts: ROLE_COUNTS,
  anyBoundMoved: false,
  distinctFrom: 'imp-124822',
  question:
    'The Oct-6 documentation-layer leaves (imp-124823, imp-124824, imp-124825, imp-124837) sit on ' +
    'top of the imp-124822 measurement cohort (imp-124769/124770/124771/124772). Grouped by role, ' +
    'do they form a coherent documentation pass distinct from the measurement cohort they document, ' +
    'or could a future scout conflate this index with imp-124822 or with the overlapping imp-124923 ' +
    'cohort?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). The cohort splits into one honest-status note ' +
    '(imp-124823), one viz leaf (imp-124824), and two cross-reference notes (imp-124825, ' +
    'imp-124837). None adds new numerics; none is a raw measurement, so this index is distinct ' +
    'from imp-124822 (which groups the underlying imp-124769/124770/124771/124772 measurements). ' +
    'This cohort also overlaps but is distinct from imp-124923 (which groups imp-124823/imp-124824/' +
    'imp-124837 with imp-124776/imp-124821 instead of imp-124825): a module may legitimately belong ' +
    'to more than one role-grouped cohort index, since cohort indices classify by shared role, not ' +
    'by exclusive partition membership. Future work should not re-derive any of these four leaves, ' +
    'and should not mistake either cohort-index for the other or for the imp-124822 measurement ' +
    'index. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation; C_mb ' +
    'GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; imp-3066 ' +
    'K_a >= 0 untouched; establishes nothing new; moves no bound; RH open; NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-124823 (honest-status, F2 residual curvature real-but-harmless); imp-124824 (viz leaf, ' +
    'E_CF stencil crossover ladder L2..L6); imp-124825 (cross-reference, chord-to-certification ' +
    'upgrade); imp-124837 (cross-reference, per-nine ladder = conditional-share cost schedule); ' +
    'imp-124822-frontier-crosscheck-batch-cohort-index.js (sibling index over the underlying ' +
    'measurements); imp-124923-doc-leaf-batch-role-cohort-index.js (overlapping sibling index with ' +
    'a different fourth member).',
});

export default IMP124936_OCT6_NOTE_STATUS_RESTATEMENT_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124936_OCT6_NOTE_STATUS_RESTATEMENT_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp124936-cohort-has-all-four-members',
    why: 'The whole point of the index is grouping exactly these four modules; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP124936_OCT6_NOTE_STATUS_RESTATEMENT_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-124823', 'imp-124824', 'imp-124825', 'imp-124837'].every((id) => ids.includes(id));
    },
  },
  {
    id: 'imp124936-role-counts-match-one-one-two',
    why: 'The cohort splits into exactly one honest-status note, one viz leaf, and two ' +
      'cross-reference notes; a drift in these counts means a member was mis-tagged.',
    holds: () => {
      const rc = IMP124936_OCT6_NOTE_STATUS_RESTATEMENT_COHORT_INDEX.roleCounts;
      return rc['honest-status note'] === 1 && rc['viz leaf'] === 1 && rc['cross-reference note'] === 2;
    },
  },
  {
    id: 'imp124936-distinct-from-imp124822',
    why: 'This index documents the Oct-6 documentation LAYER, not the underlying measurements; it ' +
      'must explicitly record that distinction so it is never conflated with the imp-124822 ' +
      'measurement cohort index.',
    holds: () => IMP124936_OCT6_NOTE_STATUS_RESTATEMENT_COHORT_INDEX.distinctFrom === 'imp-124822',
  },
  {
    id: 'imp124936-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, PT SOTA line present.',
    holds: () =>
      IMP124936_OCT6_NOTE_STATUS_RESTATEMENT_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP124936_OCT6_NOTE_STATUS_RESTATEMENT_COHORT_INDEX.verdict) &&
      /remains SOTA/.test(IMP124936_OCT6_NOTE_STATUS_RESTATEMENT_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP124936_OCT6_NOTE_STATUS_RESTATEMENT_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124936-oct6-note-status-restatement-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
