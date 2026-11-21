/**
 * @module imp-124975-oct6-7-batch-role-cohort-index
 * @fileoverview imp-124975 -- META cross-reference cohort index grouping the Oct-6/7 presentation
 *   batch imp-124917/124918/124919/124921/124922 by ROLE: viz-data leaf (imp-124917, imp-124918),
 *   glossary headword (imp-124919, imp-124922), causal-chain note (imp-124921), mirroring the
 *   imp-124906/imp-124923 cohort-index pattern. Read individually, a scout may mistake any one leaf
 *   for an isolated artifact rather than part of a documentation pass over the already-committed
 *   imp-124769/124770/124772/124776/97823 frontier measurements. Index/meta only; establishes
 *   nothing new; changes no bound; NO QED.
 *
 *   THE BATCH, BY ROLE.
 *     VIZ-DATA LEAF (presentation only, reuses a source module's numbers verbatim for a chart):
 *       imp-124917 -- charts the imp-124772/imp-124823 F2 residual-curvature U-shape: the per-floor
 *         OLS fit residuals across the imp-33708 ten-floor ladder, with the ~0.72-decade exponent
 *         gap to the imp-33684 interior-peak alternative overlaid as a reference band.
 *       imp-124918 -- merges the imp-124776 gap-keyed and imp-97843 decade-index-keyed
 *         reconstruction-kernel |K| per-decade ratio rows onto a single shared axis, with a
 *         per-row bracket_width column exposing the two-arm bracketing of sqrt(10) = 3.162278.
 *     GLOSSARY HEADWORD (names an already-established measurement for the Concepts glossary):
 *       imp-124919 -- names the imp-124769 E_CF stencil-crossover finding: the direct
 *         central-difference measurement switches from an O(eps^2) truncation law to a
 *         round-off floor once |E_CF| falls below |E_CF|_crit ~ 1.4e-6 (sigma_crit ~ 0.013).
 *       imp-124922 -- names the imp-124776 gap-keyed re-presentation of the imp-97823
 *         reconstruction-kernel sqrt(10)-per-decade growth law: the same ratio table re-keyed by
 *         actual near-peak gap g instead of a bare decade index.
 *     CAUSAL-CHAIN NOTE (chains several already-committed findings into one readable narrative):
 *       imp-124921 -- chains imp-124769 (crossover pin) -> imp-124770 (reldiff growth ladder) ->
 *         imp-124821 (attribution) into a single three-step causal note, readable from one place
 *         without following the citation graph.
 *
 *   WHY GROUP THESE BY ROLE (not re-derive). All five leaves add zero new numerics -- each reuses a
 *   frozen export from an already-committed module verbatim. What differs is HOW each leaf
 *   repackages its source: a viz-data leaf relabels numbers onto a chart axis, a glossary headword
 *   names a measurement for lookup in the Concepts glossary, and a causal-chain note states the
 *   connective narrative between several otherwise-separate steps rather than restating any one
 *   module's own claim. Read individually, the five could be mistaken for five separate artifacts;
 *   read by role, they are two viz-data leaves, two glossary headwords, and one causal-chain note,
 *   all serving the same documentation-pass function over the already-closed imp-124769/124770/
 *   124772/124776/97823 measurements. This index bakes that role grouping verbatim so future work
 *   does not re-derive any of the five, and does not mistake a role-tagged leaf for an open
 *   question.
 *
 *   STATUS: a grouping/index note over five already-committed modules, not a new derivation. No
 *   bound changes; DIAG3 == 0, the C_C 1/8 ansatz, E_trunc, and the C_F prefactor all untouched;
 *   imp-3066 K_a >= 0 untouched; RH open; NO QED. No refereed bound is changed.
 *
 * @see imp-124917-f2-residual-curvature-u-viz-data.js (viz-data leaf: F2 residual-curvature U-shape)
 * @see imp-124918-kernel-ratio-bracket-viz-data.js (viz-data leaf: kernel ratio bracket, merged axis)
 * @see imp-124919-ecf-stencil-crossover-glossary-headword.js (glossary headword: E_CF stencil crossover)
 * @see imp-124921-ecf-crossover-reldiff-roundoff-causal-chain-note.js (causal-chain note: three-step chain)
 * @see imp-124922-kernel-decade-ratio-gap-keyed-glossary-headword.js (glossary headword: gap-keyed kernel ratio)
 * @see imp-124923-doc-leaf-batch-role-cohort-index.js (sibling cohort-index this mirrors)
 * @see imp-124906-sigma-diagnostic-leaf-cluster-index.js (earlier sigma-diagnostic cluster index)
 *
 * Ticket: imp-124975 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

const OCT67_BATCH_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-124917',
    role: 'viz-data leaf',
    result:
      'Charts the imp-124772/imp-124823 F2 residual-curvature U-shape: per-floor OLS residuals ' +
      '(decades of log10 N*) across the imp-33708 ten-floor ladder, with the ~0.72-decade gap to ' +
      'the imp-33684 interior-peak alternative overlaid as a reference band. Every residual and ' +
      'gap/ratio field is reused verbatim; no new computation.',
  }),
  Object.freeze({
    id: 'imp-124918',
    role: 'viz-data leaf',
    result:
      'Merges the imp-124776 gap-keyed and imp-97843 decade-index-keyed reconstruction-kernel |K| ' +
      'per-decade ratio rows onto a single shared axis, with a per-row bracket_width = ' +
      '|upslope_ratio - downslope_ratio| column exposing the two-arm bracketing of sqrt(10) = ' +
      '3.162278 directly. Both sibling leaves’ frozen rows are reused verbatim.',
  }),
  Object.freeze({
    id: 'imp-124919',
    role: 'glossary headword',
    result:
      'Names the imp-124769 E_CF stencil-crossover finding: the direct central-difference ' +
      'crossing-elasticity measurement at eps = 1e-3 switches from an O(eps^2) truncation power ' +
      'law to a landmark-bisection round-off floor once |E_CF| falls below |E_CF|_crit ~ 1.4e-6 ' +
      '(sigma_crit ~ 0.013), pinning the imp-97821 qualitative L6 observation to a magnitude.',
  }),
  Object.freeze({
    id: 'imp-124921',
    role: 'causal-chain note',
    result:
      'Chains three prior findings into one causal narrative: imp-124769 pins the |E_CF| round-off ' +
      'crossover; imp-124770 measures the pair-ratio |reldiff| growth down the L2..L7 ladder; ' +
      'imp-124821 attributes that growth to crossing the imp-124769 crossover, not a deviation from ' +
      'the imp-97665 EXACT identity. Readable from one place without following the citation graph.',
  }),
  Object.freeze({
    id: 'imp-124922',
    role: 'glossary headword',
    result:
      'Names the imp-124776 gap-keyed re-presentation of the imp-97823 reconstruction-kernel ' +
      'sqrt(10)-per-decade growth law: the shared |K| per-decade ratio table re-keyed by the actual ' +
      'near-peak gap g instead of a bare decade index, distinct from the imp-97842 headword naming ' +
      'the raw imp-97823 measurement itself.',
  }),
]);

const ROLE_COUNTS = Object.freeze({
  'viz-data leaf': OCT67_BATCH_COHORT.filter((m) => m.role === 'viz-data leaf').length,
  'glossary headword': OCT67_BATCH_COHORT.filter((m) => m.role === 'glossary headword').length,
  'causal-chain note': OCT67_BATCH_COHORT.filter((m) => m.role === 'causal-chain note').length,
});

export const IMP124975_OCT67_BATCH_ROLE_COHORT_INDEX = Object.freeze({
  id: 'imp-124975',
  proofSection: 'S-frontier',
  cohort: OCT67_BATCH_COHORT,
  roleCounts: ROLE_COUNTS,
  anyBoundMoved: false,
  question:
    'The Oct-6/7 presentation batch (imp-124917, imp-124918, imp-124919, imp-124921, imp-124922) ' +
    'reads as five separate artifacts over the already-committed imp-124769/124770/124772/124776/' +
    '97823 measurements. Grouped by role, do they form a coherent documentation pass, or could a ' +
    'future scout mistake a role-tagged leaf for a still-open question?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). The batch splits cleanly into three roles: two ' +
    'viz-data leaves (imp-124917, imp-124918) relabel already-committed numbers onto a chart axis; ' +
    'two glossary headwords (imp-124919, imp-124922) name an already-established measurement for ' +
    'the Concepts glossary; one causal-chain note (imp-124921) chains three already-committed ' +
    'findings into a single readable narrative rather than restating any one module’s own claim. ' +
    'None of the five adds new numerics. Future work on this thread should not re-derive any of the ' +
    'five viz/glossary/chain leaves, and should not treat a role-tagged leaf as an open question. ' +
    'DIAG3 == 0, the C_C 1/8 ansatz, E_trunc, and the C_F prefactor all untouched; imp-3066 K_a >= 0 ' +
    'untouched; establishes nothing new; moves no bound; RH open; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-124917 (viz-data leaf, F2 residual-curvature U-shape); imp-124918 (viz-data leaf, kernel ' +
    'ratio bracket merged axis); imp-124919 (glossary headword, E_CF stencil crossover); imp-124921 ' +
    '(causal-chain note, three-step crossover-to-attribution chain); imp-124922 (glossary headword, ' +
    'gap-keyed kernel ratio); imp-124769/124770/124772/124776/97823 (the source measurements this ' +
    'batch documents); imp-124923-doc-leaf-batch-role-cohort-index.js (sibling cohort-index this ' +
    'mirrors).',
});

export default IMP124975_OCT67_BATCH_ROLE_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124975_OCT67_BATCH_ROLE_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp124975-cohort-has-all-five-members',
    why: 'The whole point of the index is grouping exactly these five modules; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP124975_OCT67_BATCH_ROLE_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-124917', 'imp-124918', 'imp-124919', 'imp-124921', 'imp-124922'].every((id) =>
        ids.includes(id),
      );
    },
  },
  {
    id: 'imp124975-role-counts-match-two-two-one',
    why: 'The batch splits into exactly two viz-data leaves, two glossary headwords, and one ' +
      'causal-chain note; a drift in these counts means a member was mis-tagged.',
    holds: () => {
      const rc = IMP124975_OCT67_BATCH_ROLE_COHORT_INDEX.roleCounts;
      return rc['viz-data leaf'] === 2 && rc['glossary headword'] === 2 && rc['causal-chain note'] === 1;
    },
  },
  {
    id: 'imp124975-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP124975_OCT67_BATCH_ROLE_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP124975_OCT67_BATCH_ROLE_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP124975_OCT67_BATCH_ROLE_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP124975_OCT67_BATCH_ROLE_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124975-oct6-7-batch-role-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
