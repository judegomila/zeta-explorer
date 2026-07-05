/**
 * @module imp-33759-sigma-decay-cohort-provenance-rollup
 * @fileoverview imp-33759 -- provenance roll-up cataloguing the six named ids (imp-33706, imp-33707,
 * imp-33708, imp-33721, imp-33722, imp-33723) requested as "the recent sigma-decay closed-form/knee
 * cohort", one row per module with its verdict, whether it shares the sigma(N) = E_coll/(E_trunc +
 * E_flow + E_coll) component model, and its no-bound-change caveat.
 *
 * HONESTY CORRECTION (grep-verified). Only FOUR of the six named ids actually share the sigma(N)
 * component model: imp-33708 (far-tail landmark E_trunc-sensitivity), imp-33721 (sub-decade ramp
 * inflection localization -- the "knee"), imp-33722 (far-tail exponent-ladder 1%-of-1/2 extension),
 * and imp-33723 (E_coll = E_trunc crossover closed form -- the "closed-form"). The other two named ids
 * are OFF-TOPIC for this cohort: imp-33706 is a G6a_shock_lipschitz H0..H5 obligation-catalogue
 * bookkeeping scope (zero sigma(N)/E_coll/E_trunc references, zero imports) and imp-33707 is a
 * peak-minus-trough ULP-amplitude leave-two-out refit of an unrelated cluster-peak lattice measurement
 * (also zero sigma(N)/E_coll/E_trunc references, zero effectiveHeightForN/C_C_PINNED imports). Grepping
 * each of the six files directly for the model-defining phrase confirms the split: imp-33708/33721/
 * 33722 restate "E_coll / (E_trunc" or "E_trunc + E_flow + E_coll" verbatim; imp-33723 defines
 * `sigma: E_coll / E_N` with `E_N = E_TRUNC_PT + E_flow + E_coll` in its executable body (same model,
 * different literal spacing); imp-33706 and imp-33707 have zero hits for either phrase and zero
 * imports of the shared effectiveHeightForN/C_C_PINNED sub-terms every sigma(N)-decay module carries.
 * This roll-up records both facts: the ticket's literal six-id list (tabulated below for completeness)
 * and the correct four-id sigma-decay cohort membership (the honest scope actually claimed).
 *
 * METHOD (read-only, performed at author time). Each of the six modules' @fileoverview/detail block
 * and verdict field was read; each was grepped for the sigma(N) model-defining phrase and for its
 * effectiveHeightForN/C_C_PINNED import lines to test cohort membership; each was grepped for
 * isRigorous:false and the mandatory honest-banner phrases; glossary.js and src/pages were grepped for
 * existing coverage.
 *
 * RESULT (audited 2026-07-05). All six modules carry isRigorous:false and the full honest banner (no
 * QED, imp-3066 K_a >= 0 untouched, Platt-Trudgian Lambda <= 0.2 SOTA). Four (imp-33708, imp-33721,
 * imp-33722, imp-33723) share the sigma(N) = E_coll/(E_trunc+E_flow+E_coll) component model and inherit
 * its C_mb GUE-conditional caveat (imp-486); two (imp-33706, imp-33707) do not and carry their own
 * independent caveats (the G6a_shock_lipschitz-stays-OPEN caveat and the imp-3066-untouched caveat
 * respectively). Glossary coverage: imp-33706 (8 hits), imp-33707 (3 hits), imp-33708 (4 hits),
 * imp-33721 (15 hits), imp-33723 (11 hits) all have existing glossary.js coverage; imp-33722 has ZERO
 * glossary hits, the one coverage gap in the six-id list. None of the six has a dedicated routed viz
 * page.
 *
 * @see imp-33741-33698-33701-cohort-provenance-rollup (the roll-up pattern this module mirrors)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (the sigma(N) component model origin)
 */

export const IMP_33759_SIGMA_DECAY_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-33759',
  auditedAt: '2026-07-05',
  requestedIds: ['imp-33706', 'imp-33707', 'imp-33708', 'imp-33721', 'imp-33722', 'imp-33723'],
  correctSigmaDecayCohortIds: ['imp-33708', 'imp-33721', 'imp-33722', 'imp-33723'],
  offTopicIds: ['imp-33706', 'imp-33707'],
  sharedComponentModel: 'sigma(N) = E_coll / (E_trunc + E_flow + E_coll)',
  method:
    'Read each of the six named module @fileoverview/detail blocks and verdict fields; grep each for ' +
    'the sigma(N) model-defining phrase ("E_coll / (E_trunc" or "E_trunc + E_flow + E_coll") and for ' +
    'effectiveHeightForN/C_C_PINNED import lines to test cohort membership; grep for isRigorous:false ' +
    'and the mandatory honest-banner phrases; cross-check glossary.js and src/pages for coverage.',
  modules: [
    {
      file: 'imp-33706-selection-catalogue-count-scoping.js',
      sharesComponentModel: false,
      cohortMembership: 'off-topic (G6a_shock_lipschitz H0..H5 catalogue-count bookkeeping)',
      verdict:
        'NO-COUNT-CHANGE / MILDEST-MEMBER-DROPPABLE: formalizing the imp-33668 SUBSUMED-BY-H3/H4 ' +
        'verdict leaves the imp-33603 catalogue at six rows (H0..H5, four open) unchanged, delta zero.',
      noBoundChangeCaveat: 'G6a_shock_lipschitz stays OPEN; imp-3066 K_a >= 0 untouched',
      isRigorous: false,
      hasGlossaryTerm: true,
      hasRoutedVizPage: false,
    },
    {
      file: 'imp-33707-peak-minus-trough-amplitude-leave-two-out-refit.js',
      sharesComponentModel: false,
      cohortMembership: 'off-topic (peak-minus-trough ULP-amplitude leave-two-out refit)',
      verdict:
        'AMPLITUDE-SLOPE-COLLAPSES-EVEN-HARDER-TREND-IS-LIKEWISE-A-TWO-POINT-ARTIFACT: excluding the ' +
        'two tallest imp-33638 tail clusters collapses the linear amplitude slope survival to ~0.036, ' +
        'harder than the imp-33680 height-slope survival ~0.115.',
      noBoundChangeCaveat: 'imp-3066 K_a >= 0 untouched; no RH verdict',
      isRigorous: false,
      hasGlossaryTerm: true,
      hasRoutedVizPage: false,
    },
    {
      file: 'imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity.js',
      sharesComponentModel: true,
      cohortMembership: 'sigma-decay cohort (far-tail landmark E_trunc-floor-form sensitivity)',
      verdict:
        'ROBUST QUALITATIVELY, FRAGILE QUANTITATIVELY: both far-tail landmarks obey N ~ E_trunc^(-2.0) ' +
        '(measured ~-2.099, ~-2.079), steeper than the imp-33684 interior-peak ~-1.375 exponent.',
      noBoundChangeCaveat: 'C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched',
      isRigorous: false,
      hasGlossaryTerm: true,
      hasRoutedVizPage: false,
    },
    {
      file: 'imp-33721-sigma-ramp-inflection-subdecade.js',
      sharesComponentModel: true,
      cohortMembership: 'sigma-decay cohort (sub-decade exponent-ramp knee localization)',
      verdict:
        'MEASUREMENT: sub-decade refinement pins the imp-33701 whole-decade knee to log10 N* ~ 9.529 ' +
        '(N* ~ 3.38e9), a full decade below the coarse [1e10,1e11] bracket the whole-decade ladder reported.',
      noBoundChangeCaveat: 'C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched',
      isRigorous: false,
      hasGlossaryTerm: true,
      hasRoutedVizPage: false,
    },
    {
      file: 'imp-33722-sigma-exponent-ladder-fartail-1pct-of-half.js',
      sharesComponentModel: true,
      cohortMembership: 'sigma-decay cohort (far-tail exponent-ladder extension to 1% of the 1/2 asymptote)',
      verdict:
        'MEASUREMENT: extending the exponent ladder past its imp-33582 1e12 endpoint, the OLS exponent ' +
        'first sits within 1% of the imp-3463 far-tail 1/2 asymptote (p_dec >= 0.495) at decade k* = 44.',
      noBoundChangeCaveat: 'C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched',
      isRigorous: false,
      hasGlossaryTerm: false,
      hasRoutedVizPage: false,
    },
    {
      file: 'imp-33723-sigma-half-vs-crossover-closed-form.js',
      sharesComponentModel: true,
      cohortMembership: 'sigma-decay cohort (E_coll = E_trunc crossover, closed form)',
      verdict:
        'DERIVATION: the imp-3444 E_coll = E_trunc crossover, previously only bisected, is pinned as the ' +
        'closed-form contracting fixed point N_cross = (C_C_PINNED/E_trunc)^2 * log T0(N_cross), ' +
        'converging in ~5 Banach steps to N_cross ~ 3.280294e9.',
      noBoundChangeCaveat: 'C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched',
      isRigorous: false,
      hasGlossaryTerm: true,
      hasRoutedVizPage: false,
    },
  ],
  requestedIdCount: 6,
  correctCohortCount: 4,
  offTopicCount: 2,
  glossaryCoveredCount: 5,
  routedVizPageCount: 0,
  recommendation:
    'Correct the "sigma-decay closed-form/knee cohort" label going forward to the four ids that ' +
    'actually share the sigma(N) component model (imp-33708, imp-33721, imp-33722, imp-33723); ' +
    'imp-33706 and imp-33707 belong to unrelated cohorts (the G6a catalogue-count bookkeeping line and ' +
    'the peak-minus-trough amplitude lattice-measurement line respectively) and should not be re-bundled ' +
    'with sigma-decay tickets by future seeders. imp-33722 is the one glossary-coverage gap among the ' +
    'four correct cohort members -- a candidate for a future glossary-entry ticket.',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module itself. ' +
    'imp-3066 K_a >= 0 positivity untouched across all six catalogued modules. Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_33759_ASSERTIONS = [
  {
    id: 'imp33759-six-requested-modules-catalogued',
    holds: () =>
      IMP_33759_SIGMA_DECAY_COHORT_PROVENANCE_ROLLUP.modules.length === 6 &&
      IMP_33759_SIGMA_DECAY_COHORT_PROVENANCE_ROLLUP.requestedIds.length === 6,
    why: 'The roll-up must cover exactly the six ids named in the imp-33759 ticket title.',
  },
  {
    id: 'imp33759-exactly-four-share-component-model',
    holds: () => {
      const m = IMP_33759_SIGMA_DECAY_COHORT_PROVENANCE_ROLLUP.modules;
      const sharing = m.filter((x) => x.sharesComponentModel === true).length;
      return sharing === 4 && sharing === IMP_33759_SIGMA_DECAY_COHORT_PROVENANCE_ROLLUP.correctCohortCount;
    },
    why: 'Grep-verified: only imp-33708/imp-33721/imp-33722/imp-33723 restate the sigma(N) = ' +
      'E_coll/(E_trunc+E_flow+E_coll) component model; imp-33706 and imp-33707 do not.',
  },
  {
    id: 'imp33759-exactly-two-off-topic',
    holds: () => {
      const m = IMP_33759_SIGMA_DECAY_COHORT_PROVENANCE_ROLLUP.modules;
      const offTopic = m.filter((x) => x.sharesComponentModel === false).length;
      return (
        offTopic === 2 &&
        offTopic === IMP_33759_SIGMA_DECAY_COHORT_PROVENANCE_ROLLUP.offTopicCount &&
        m.find((x) => x.file.startsWith('imp-33706')).sharesComponentModel === false &&
        m.find((x) => x.file.startsWith('imp-33707')).sharesComponentModel === false
      );
    },
    why: 'The ticket bundled two ids (imp-33706, imp-33707) that are not part of the sigma-decay ' +
      'cohort; this roll-up records that mismatch honestly rather than silently absorbing it.',
  },
  {
    id: 'imp33759-all-six-carry-honest-banner',
    holds: () =>
      IMP_33759_SIGMA_DECAY_COHORT_PROVENANCE_ROLLUP.modules.every((x) => x.isRigorous === false) &&
      /no QED/i.test(IMP_33759_SIGMA_DECAY_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /imp-3066/.test(IMP_33759_SIGMA_DECAY_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /SOTA/.test(IMP_33759_SIGMA_DECAY_COHORT_PROVENANCE_ROLLUP.honestNote),
    why: 'Every catalogued module must be isRigorous:false, and the roll-up itself must state no-QED, ' +
      'imp-3066 untouched, and Platt-Trudgian Lambda <= 0.2 SOTA.',
  },
  {
    id: 'imp33759-glossary-coverage-count-matches',
    holds: () => {
      const m = IMP_33759_SIGMA_DECAY_COHORT_PROVENANCE_ROLLUP.modules;
      const covered = m.filter((x) => x.hasGlossaryTerm === true).length;
      return covered === 5 && covered === IMP_33759_SIGMA_DECAY_COHORT_PROVENANCE_ROLLUP.glossaryCoveredCount;
    },
    why: 'Grep-verified: five of the six modules have at least one glossary.js hit; imp-33722 has zero.',
  },
];

for (const a of IMP_33759_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33759 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33759_ASSERTIONS };
