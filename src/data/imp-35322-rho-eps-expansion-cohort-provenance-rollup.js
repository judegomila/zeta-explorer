/**
 * @module imp-35322-rho-eps-expansion-cohort-provenance-rollup
 * @fileoverview imp-35322 -- provenance roll-up cataloguing the five named ids requested as "the
 * model-cusp rho eps-EXPANSION cohort" (imp-35216, imp-35240, imp-35244, imp-35256, imp-35261), one row
 * per module recording its verdict/coefficient and the shared imp-3220/imp-3406/imp-33646 model-cusp
 * SURROGATE provenance.
 *
 * HONESTY CORRECTION (queue-verified). Only THREE of the five named ids are actually resolved with a
 * verdict: imp-35216 (closed-form eps^{3/2} margin-ratio prefactor K = 8 sqrt(2)/(9 pi) = 0.40014),
 * imp-35240 (finer-grid measurement independently confirming that K to ~3.3e-7 and refuting the 2/5
 * near-miss), and imp-35244 (measurement finding the eps^{5/2} slot is EMPTY and correcting the next term
 * to eps^{7/2} with K_{7/2} = -8 sqrt(2)/(3 pi) = -1.20042). The other two named ids -- imp-35256 (the
 * K(eps) decay-exponent reconciliation) and imp-35261 (the independent K_{7/2} deeper-rung verification)
 * -- are STILL PENDING in src/data/improvement-queue.js (status: 'pending', no completedByModel), so no
 * module or verdict exists for either yet. This roll-up records both facts: the ticket's literal five-id
 * list (tabulated below for completeness) and the correct three-id resolved-cohort membership (the honest
 * scope actually claimable today).
 *
 * METHOD (read-only, performed at author time). Each of the five ids was checked against
 * src/data/improvement-queue.js for status; the three completed ids' dedicated modules
 * (imp-35216-rho-prefactor-closed-form-assessment.js, imp-35240-rho-prefactor-finer-grid-remeasurement.js,
 * imp-35244-rho-eps52-coefficient-measurement.js) were read for their verdict/coefficient fields; each was
 * grepped against glossary.js and visualizations-index.js for existing coverage.
 *
 * RESULT (audited 2026-07-09). All three resolved modules carry isRigorous:false and the full honest
 * banner (no QED, imp-3066 K_a >= 0 untouched, no refereed bound is changed) and share the identical
 * model-cusp rho(eps) = C_ren/C_curv expansion surrogate inherited from imp-3220/imp-3406/imp-33646. All
 * three have existing glossary.js coverage (25, 14, 19 hits respectively) and existing routed viz pages
 * (imp-35240 via imp-35272, imp-35244 via imp-35273, imp-35216 via 2 page references). The two pending ids
 * carry no coefficient and no verdict; they remain open reconciliation/verification tickets in the queue.
 *
 * @see imp-33759-sigma-decay-cohort-provenance-rollup (the roll-up pattern this module mirrors)
 * @see imp-35216-rho-prefactor-closed-form-assessment (eps^{3/2} closed-form prefactor)
 * @see imp-35240-rho-prefactor-finer-grid-remeasurement (independent finer-grid confirmation)
 * @see imp-35244-rho-eps52-coefficient-measurement (eps^{5/2} slot empty, eps^{7/2} correction)
 */

export const IMP_35322_RHO_EPS_EXPANSION_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-35322',
  auditedAt: '2026-07-09',
  requestedIds: ['imp-35216', 'imp-35240', 'imp-35244', 'imp-35256', 'imp-35261'],
  resolvedCohortIds: ['imp-35216', 'imp-35240', 'imp-35244'],
  pendingIds: ['imp-35256', 'imp-35261'],
  sharedComponentModel:
    'rho(eps) = C_ren / C_curv model-cusp margin-ratio expansion, inherited imp-3220/imp-3406/imp-33646 surrogate',
  method:
    'Check each of the five named ids against src/data/improvement-queue.js status; read the verdict/' +
    'coefficient fields of the three completed dedicated modules; cross-check glossary.js and ' +
    'visualizations-index.js for existing coverage.',
  modules: [
    {
      file: 'imp-35216-rho-prefactor-closed-form-assessment.js',
      status: 'resolved',
      coefficient: 'K = 4/(3 A_2) = 8 sqrt(2)/(9 pi) = 0.40014, the eps^{3/2} coefficient',
      verdict:
        'ASSESSMENT: expanding rho(eps) to next order on the model cusp gives eps^{3/2} coefficient ' +
        'K = 8 sqrt(2)/(9 pi), NOT 2/5 (a ~1.4e-4 near-miss); the closed form matches the imp-35193 ' +
        'measured tail better than 2/5 does.',
      noBoundChangeCaveat: 'does NOT discharge O3; G6a_shock_lipschitz stays OPEN; C_mb GUE-conditional per imp-486',
      isRigorous: false,
      hasGlossaryTerm: true,
      hasRoutedVizPage: true,
    },
    {
      file: 'imp-35240-rho-prefactor-finer-grid-remeasurement.js',
      status: 'resolved',
      coefficient: 'K = 0.40014025 at eps = 1e-6, matching 8 sqrt(2)/(9 pi) to ~3.3e-7',
      verdict:
        'MEASUREMENT: an independent finer-grid, smaller-eps ladder confirms the imp-35216 closed form ' +
        'K = 8 sqrt(2)/(9 pi), discriminating it from 2/5 by ~424x at the smallest rung.',
      noBoundChangeCaveat: 'does NOT discharge O3; G6a_shock_lipschitz stays OPEN; C_mb GUE-conditional per imp-486',
      isRigorous: false,
      hasGlossaryTerm: true,
      hasRoutedVizPage: true,
    },
    {
      file: 'imp-35244-rho-eps52-coefficient-measurement.js',
      status: 'resolved',
      coefficient: 'eps^{5/2} slot EMPTY; true next term K_{7/2} = -8 sqrt(2)/(3 pi) = -1.20042',
      verdict:
        'MEASUREMENT: the eps^{5/2} coefficient imp-35216 implied (-0.32011) is falsified by the data -- ' +
        'the slot is empty and the true next-order term is eps^{7/2} with a confirmed closed-form coefficient.',
      noBoundChangeCaveat: 'does NOT discharge O3; G6a_shock_lipschitz stays OPEN; C_mb GUE-conditional per imp-486',
      isRigorous: false,
      hasGlossaryTerm: true,
      hasRoutedVizPage: true,
    },
  ],
  requestedIdCount: 5,
  resolvedCohortCount: 3,
  pendingCount: 2,
  glossaryCoveredCount: 3,
  routedVizPageCount: 3,
  recommendation:
    'Correct the "model-cusp rho eps-expansion cohort" label going forward to the three ids with an ' +
    'actual verdict (imp-35216, imp-35240, imp-35244); imp-35256 and imp-35261 remain pending queue ' +
    'entries and should not be catalogued as resolved until their assigned engine completes them.',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module itself. ' +
    'imp-3066 K_a >= 0 positivity untouched across all catalogued modules. No refereed bound is changed' +
    '. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_35322_ASSERTIONS = [
  {
    id: 'imp35322-five-requested-ids-catalogued',
    holds: () => IMP_35322_RHO_EPS_EXPANSION_COHORT_PROVENANCE_ROLLUP.requestedIds.length === 5,
    why: 'The roll-up must cover exactly the five ids named in the imp-35322 ticket title.',
  },
  {
    id: 'imp35322-exactly-three-resolved',
    holds: () => {
      const r = IMP_35322_RHO_EPS_EXPANSION_COHORT_PROVENANCE_ROLLUP;
      return (
        r.modules.length === 3 &&
        r.modules.length === r.resolvedCohortCount &&
        r.resolvedCohortIds.length === 3
      );
    },
    why: 'Queue-verified: only imp-35216/imp-35240/imp-35244 are status:completed with a dedicated module.',
  },
  {
    id: 'imp35322-exactly-two-pending',
    holds: () => {
      const r = IMP_35322_RHO_EPS_EXPANSION_COHORT_PROVENANCE_ROLLUP;
      return (
        r.pendingIds.length === 2 &&
        r.pendingIds.length === r.pendingCount &&
        r.pendingIds.includes('imp-35256') &&
        r.pendingIds.includes('imp-35261')
      );
    },
    why: 'The ticket bundled two ids (imp-35256, imp-35261) still status:pending in improvement-queue.js; ' +
      'this roll-up records that mismatch honestly rather than fabricating verdicts for them.',
  },
  {
    id: 'imp35322-all-resolved-carry-honest-banner',
    holds: () => {
      const r = IMP_35322_RHO_EPS_EXPANSION_COHORT_PROVENANCE_ROLLUP;
      return (
        r.modules.every((m) => m.isRigorous === false) &&
        /no QED/i.test(r.honestNote) &&
        /imp-3066/.test(r.honestNote) &&
        /refereed bound is changed/i.test(r.honestNote)
      );
    },
    why: 'Every catalogued resolved module must be isRigorous:false, and the roll-up itself must state ' +
      'no-QED, imp-3066 untouched, and no refereed bound is changed.',
  },
  {
    id: 'imp35322-glossary-and-viz-coverage-counts-match',
    holds: () => {
      const r = IMP_35322_RHO_EPS_EXPANSION_COHORT_PROVENANCE_ROLLUP;
      const glossaryCovered = r.modules.filter((m) => m.hasGlossaryTerm === true).length;
      const vizCovered = r.modules.filter((m) => m.hasRoutedVizPage === true).length;
      return (
        glossaryCovered === 3 &&
        glossaryCovered === r.glossaryCoveredCount &&
        vizCovered === 3 &&
        vizCovered === r.routedVizPageCount
      );
    },
    why: 'Grep-verified: all three resolved modules have glossary.js hits and routed viz-page coverage.',
  },
];

for (const a of IMP_35322_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-35322 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_35322_ASSERTIONS };
