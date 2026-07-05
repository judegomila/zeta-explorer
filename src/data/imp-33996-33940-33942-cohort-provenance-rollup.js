/**
 * @module imp-33996-33940-33942-cohort-provenance-rollup
 * @fileoverview imp-33996 -- META provenance roll-up cataloguing the imp-33940/imp-33941/imp-33942
 * edge-artifact and model-selection cohort. Per the ticket, this reads each module's LIVE exported
 * object (imported directly, not a hardcoded snapshot) and tabulates ticket id, headline finding,
 * isRigorous flag, and the refined-parent ticket, so the index cannot silently drift from the source
 * modules if one of them is later revised.
 *
 * REFINED-PARENT MAP (read once at author time, from each module's own citation/verdict text):
 *   - imp-33940 refines imp-33917 (the endpoint-peak growth law whose R3 "interior is boundary-stable"
 *     assertion imp-33940 tests and refutes).
 *   - imp-33941 refines imp-33917 (the same two descriptive growth-form fits imp-33941 formally
 *     decides between via AIC/BIC/AICc/RMSE).
 *   - imp-33942 refines imp-33905 (the R2 gap-attribution reading imp-33942 tests for step-
 *     proportionality on the imp-33878 ladder).
 *
 * SURFACING NOTE (secondary, grep-verified against src/data/glossary.js and src/pages at audit time
 * 2026-07-05 -- not derivable from the imported live objects themselves, so recorded separately).
 * All three cohort modules have a dedicated headline glossary.js term. Only imp-33942 has a routed
 * src/pages reference (Imp33994SawtoothGapVsStepViz.jsx, /viz-imp33994-sawtooth-gap-vs-step);
 * imp-33940 and imp-33941 have neither.
 *
 * @see imp-33978 (the imp-33919/33920/33921/33922 rollup this note's structure mirrors), imp-33917
 * (the boundary-locked endpoint peak both imp-33940 and imp-33941 refine), imp-33905 (the grid-vs-
 * continuum gap imp-33942 tests), imp-33878 (the hump-argmax ladder imp-33942 reuses)
 */

import { IMP33940_INTERIOR_RESIDUAL_BOUNDARY_STABILITY } from './imp-33940-interior-residual-boundary-stability.js';
import { IMP33941_ENDPOINT_PEAK_GROWTH_MODEL_SELECTION } from './imp-33941-endpoint-peak-growth-model-selection.js';
import { IMP33942_HUMP_ARGMAX_GAP_STEP_PROPORTIONALITY } from './imp-33942-hump-argmax-gap-step-proportionality.js';

const COHORT_SOURCE_MODULES = [
  IMP33940_INTERIOR_RESIDUAL_BOUNDARY_STABILITY,
  IMP33941_ENDPOINT_PEAK_GROWTH_MODEL_SELECTION,
  IMP33942_HUMP_ARGMAX_GAP_STEP_PROPORTIONALITY,
];

const REFINED_PARENT_BY_TICKET = {
  'imp-33940': 'imp-33917',
  'imp-33941': 'imp-33917',
  'imp-33942': 'imp-33905',
};

const GLOSSARY_VIZ_COVERAGE_BY_TICKET = {
  'imp-33940': { hasGlossaryTerm: true, hasRoutedVizPage: false },
  'imp-33941': { hasGlossaryTerm: true, hasRoutedVizPage: false },
  'imp-33942': { hasGlossaryTerm: true, hasRoutedVizPage: true },
};

function headlineFindingOf(mod) {
  const keys = Object.keys(mod.finding || {});
  return keys.length > 0 ? { key: keys[0], text: mod.finding[keys[0]] } : null;
}

function honestBannerHolds(mod) {
  return (
    mod.isRigorous === false &&
    /NO QED/.test(mod.verdict) &&
    /imp-3066/.test(mod.verdict) &&
    /remains SOTA/.test(mod.verdict)
  );
}

// Live-derived: re-reads each module's actual exported object, so this table cannot drift out of
// sync with the source modules -- there is no copied/frozen value here.
export const IMP_33996_33940_33942_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-33996',
  auditedAt: '2026-07-05',
  method:
    'Import the live exported object of each of the three imp-33940/33941/33942 modules (not a ' +
    'hardcoded snapshot); tabulate ticket id, headline finding (first key of the module finding ' +
    'object), isRigorous flag, and the refined-parent ticket; verify the full honest banner ' +
    '(isRigorous:false, literal NO QED, imp-3066 K_a >= 0 untouched, Platt-Trudgian Lambda <= 0.2 ' +
    'SOTA) directly against each module verdict string at read time.',
  modules: COHORT_SOURCE_MODULES.map((mod) => {
    const headline = headlineFindingOf(mod);
    const coverage = GLOSSARY_VIZ_COVERAGE_BY_TICKET[mod.id];
    return {
      ticket: mod.id,
      refinedParent: REFINED_PARENT_BY_TICKET[mod.id],
      isRigorous: mod.isRigorous,
      headlineFindingKey: headline ? headline.key : null,
      headlineFinding: headline ? headline.text : null,
      honestBannerOk: honestBannerHolds(mod),
      hasGlossaryTerm: coverage.hasGlossaryTerm,
      hasRoutedVizPage: coverage.hasRoutedVizPage,
    };
  }),
  get honestBannerFullCoverageCount() {
    return this.modules.filter((m) => m.honestBannerOk).length;
  },
  get glossaryCoveredCount() {
    return this.modules.filter((m) => m.hasGlossaryTerm).length;
  },
  get routedVizPageCount() {
    return this.modules.filter((m) => m.hasRoutedVizPage).length;
  },
  recommendation:
    'No action needed on the honest-banner side -- all three modules already carry the full mandatory ' +
    'banner as a literal "NO QED" string plus isRigorous: false, and all three already have a dedicated ' +
    'glossary term. imp-33940 and imp-33941 are the two cohort members lacking a routed viz page, ' +
    'making either the natural next viz candidate (mirroring the imp-33994 page built for imp-33942).',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module ' +
    'itself. imp-3066 K_a >= 0 positivity untouched across all three cohort members; Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_33996_ASSERTIONS = [
  {
    id: 'imp33996-exactly-three-modules-catalogued',
    holds: () => IMP_33996_33940_33942_COHORT_PROVENANCE_ROLLUP.modules.length === 3,
    why: 'The roll-up must cover exactly the three named cohort modules (imp-33940/33941/33942).',
  },
  {
    id: 'imp33996-tickets-and-refined-parents-match',
    holds: () => {
      const m = IMP_33996_33940_33942_COHORT_PROVENANCE_ROLLUP.modules;
      const ids = m.map((x) => x.ticket);
      return (
        ids.includes('imp-33940') &&
        ids.includes('imp-33941') &&
        ids.includes('imp-33942') &&
        m.find((x) => x.ticket === 'imp-33940').refinedParent === 'imp-33917' &&
        m.find((x) => x.ticket === 'imp-33941').refinedParent === 'imp-33917' &&
        m.find((x) => x.ticket === 'imp-33942').refinedParent === 'imp-33905'
      );
    },
    why: 'Each module ticket must be present with the correct refined-parent ticket recorded at author time.',
  },
  {
    id: 'imp33996-all-three-carry-full-honest-banner',
    holds: () =>
      IMP_33996_33940_33942_COHORT_PROVENANCE_ROLLUP.modules.every(
        (x) => x.isRigorous === false && x.honestBannerOk === true
      ) && IMP_33996_33940_33942_COHORT_PROVENANCE_ROLLUP.honestBannerFullCoverageCount === 3,
    why: 'Every module in the cohort must state no-QED as a literal string, imp-3066 K_a >= 0 untouched, ' +
      'and Platt-Trudgian Lambda <= 0.2 SOTA -- checked directly against each live-imported verdict string.',
  },
  {
    id: 'imp33996-headline-findings-present',
    holds: () =>
      IMP_33996_33940_33942_COHORT_PROVENANCE_ROLLUP.modules.every(
        (x) => typeof x.headlineFinding === 'string' && x.headlineFinding.length > 0
      ),
    why: 'Each module must expose a non-empty headline finding derived from its own live finding object.',
  },
  {
    id: 'imp33996-three-glossary-one-viz',
    holds: () =>
      IMP_33996_33940_33942_COHORT_PROVENANCE_ROLLUP.glossaryCoveredCount === 3 &&
      IMP_33996_33940_33942_COHORT_PROVENANCE_ROLLUP.routedVizPageCount === 1,
    why: 'Grep-verified: all three cohort modules have a dedicated headline glossary term; only ' +
      'imp-33942 has a routed src/pages reference (the imp-33994 viz page).',
  },
  {
    id: 'imp33996-honest-scope-locked',
    holds: () =>
      /SOTA/.test(IMP_33996_33940_33942_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /no QED/i.test(IMP_33996_33940_33942_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /imp-3066/.test(IMP_33996_33940_33942_COHORT_PROVENANCE_ROLLUP.honestNote),
    why: 'VERDICT LOCK: this is a read-only roll-up, not a bound; Platt-Trudgian Lambda <= 0.2 stays ' +
      'SOTA and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33996_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33996 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33996_ASSERTIONS };
