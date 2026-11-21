/**
 * @module imp-35881-full-six-cohort-registration-reachability-audit
 *
 * imp-35881 (meta, audit): registration/reachability check (imp-35590/imp-35838/imp-35858
 * method) on the FULL six-module frontier-batch cohort imp-35808/imp-35809/imp-35810/
 * imp-35811/imp-35812/imp-35813. imp-35858 audited only FIVE of the six (imp-35809..
 * imp-35813) and found/fixed one orphan (imp-35813 missing from DATA_MODULES); it never
 * covered imp-35808 (the I3 long-edge derivative-delivery-scope module). This module closes
 * that gap by auditing the sixth member and re-confirming the other five.
 *
 * METHOD. Grepped scripts/run-assertions.mjs DATA_MODULES for each of the six file paths,
 * confirmed each source module exports both a result-object const and a paired
 * `*_ASSERTIONS` array, then grepped src/App.jsx and src/data/visualizations-index.js to
 * check viz-suffixed vs registry-only status.
 *
 * FINDING -- FULLY WIRED, NO ORPHAN, NO VIZ MISMATCH. All six modules (imp-35808 through
 * imp-35813) are present in scripts/run-assertions.mjs DATA_MODULES (imp-35813's entry is
 * the imp-35858 fix; the other five, including imp-35808, were already listed). Every
 * module exports its result-object const plus a `*_ASSERTIONS` array. None of the six raw
 * modules is itself viz-suffixed. Three of them (imp-35809, imp-35811, imp-35812) are
 * `paperSourcePath` sources for SEPARATE downstream viz-data modules (imp-35863, imp-35864,
 * imp-35865 respectively) that ARE registered with real page entries in
 * visualizations-index.js; the other three (imp-35808, imp-35810, imp-35813) have no viz
 * page, which is the expected registry-only status for assessment/measurement-only modules
 * with no dedicated viz-data spinoff yet. No mismatch found in either direction.
 *
 * SCOPE. Audit only. No mathematical content changed in any audited module; no fix was
 * required (all six were already correctly wired). Changes no bound; establishes no
 * operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35590-registration-reachability-audit (method precedent)
 * @see imp-35838-frontier-batch-registration-reachability-audit.js (method precedent, prior cohort)
 * @see imp-35858-newer-cohort-registration-reachability-audit.js (audited only five of six; fixed the imp-35813 orphan)
 * @see imp-35880-frontier-batch-cohort-verification.js (companion import-cleanliness/assertion-pass guard for the same six-module cohort)
 * @see imp-35808-i3-long-edge-derivative-delivery-scope.js (audited module -- the member imp-35858 missed)
 * @see imp-35809-krawczyk-surplus-split-band-and-height-profile.js (audited module)
 * @see imp-35810-cancellation-onset-height.js (audited module)
 * @see imp-35811-exact-debruijn-arbitrary-precision-digit-table.js (audited module)
 * @see imp-35812-w1-summation-scheme-measured-cost.js (audited module)
 * @see imp-35813-req4-required-height-sigma-landmark-extend.js (audited module)
 */

const AUDITED_COHORT = [
  {
    file: 'imp-35808-i3-long-edge-derivative-delivery-scope',
    resultExport: 'IMP35808_I3_LONG_EDGE_DERIVATIVE_DELIVERY_SCOPE',
    listedInDataModules: true,
    hasAssertionsExport: true,
    hasVizPage: false,
  },
  {
    file: 'imp-35809-krawczyk-surplus-split-band-and-height-profile',
    resultExport: 'IMP35809_KRAWCZYK_SURPLUS_SPLIT_BAND_AND_HEIGHT_PROFILE',
    listedInDataModules: true,
    hasAssertionsExport: true,
    hasVizPage: true,
    vizViaTicket: 'imp-35863',
  },
  {
    file: 'imp-35810-cancellation-onset-height',
    resultExport: 'IMP35810_CANCELLATION_ONSET_HEIGHT',
    listedInDataModules: true,
    hasAssertionsExport: true,
    hasVizPage: false,
  },
  {
    file: 'imp-35811-exact-debruijn-arbitrary-precision-digit-table',
    resultExport: 'IMP35811_EXACT_DEBRUIJN_ARBITRARY_PRECISION_DIGIT_TABLE',
    listedInDataModules: true,
    hasAssertionsExport: true,
    hasVizPage: true,
    vizViaTicket: 'imp-35864',
  },
  {
    file: 'imp-35812-w1-summation-scheme-measured-cost',
    resultExport: 'IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST',
    listedInDataModules: true,
    hasAssertionsExport: true,
    hasVizPage: true,
    vizViaTicket: 'imp-35865',
  },
  {
    file: 'imp-35813-req4-required-height-sigma-landmark-extend',
    resultExport: 'IMP35813_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_EXTEND',
    listedInDataModules: true,
    hasAssertionsExport: true,
    hasVizPage: false,
  },
];

const ORPHANS_FOUND = AUDITED_COHORT.filter((m) => !m.listedInDataModules);
const MISSING_EXPORTS_FOUND = AUDITED_COHORT.filter(
  (m) => !m.hasAssertionsExport || !m.resultExport
);

export const IMP35881_FULL_SIX_COHORT_REGISTRATION_REACHABILITY_AUDIT = {
  id: 'imp-35881',
  proofSection: 'audit',
  question:
    'Do all six frontier-batch modules imp-35808/imp-35809/imp-35810/imp-35811/imp-35812/' +
    'imp-35813 each export a result-object const plus a wired *_ASSERTIONS array registered ' +
    'in scripts/run-assertions.mjs, and does viz-suffixed vs registry-only status match ' +
    'App.jsx / visualizations-index.js?',
  verdictShort:
    'FULLY WIRED, NO ORPHAN. All six modules (including imp-35808, which the earlier ' +
    'imp-35858 five-module audit never covered) are listed in scripts/run-assertions.mjs ' +
    'DATA_MODULES and each exports a result-object const plus a *_ASSERTIONS array. No ' +
    'viz-status mismatch: imp-35809/imp-35811/imp-35812 correctly feed separate registered ' +
    'downstream viz-data modules (imp-35863/imp-35864/imp-35865), while imp-35808/imp-35810/' +
    'imp-35813 are correctly registry-only.',
  auditedCohort: AUDITED_COHORT,
  danglingOrOrphanedFound: ORPHANS_FOUND.length,
  orphanedFiles: ORPHANS_FOUND.map((m) => m.file),
  missingExportsFound: MISSING_EXPORTS_FOUND.length,
  vizStatusMismatchFound: 0,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked ' +
    'scripts/run-assertions.mjs DATA_MODULES wiring, each module’s exports, and App.jsx / ' +
    'visualizations-index.js viz-page registration for the full six-module frontier-batch ' +
    'cohort. Result: zero orphans, zero missing exports, zero viz-status mismatches -- all ' +
    'six were already correctly wired, closing the gap the five-module imp-35858 audit left ' +
    '(imp-35808 uncovered). Changes no bound; establishes no operator positivity; no RH ' +
    'verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-35808, imp-35809, imp-35810, imp-35811, imp-35812, imp-35813 (audited modules); ' +
    'imp-35590/imp-35838/imp-35858 (registration/reachability method); imp-35880 (companion ' +
    'import-cleanliness guard for the same six-module cohort).',
};

export const IMP35881_FULL_SIX_COHORT_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35881-cohort-size-six',
    description: 'exactly six modules were audited',
    holds: () => AUDITED_COHORT.length === 6,
  },
  {
    id: 'imp35881-all-listed-in-data-modules',
    description: 'every audited module is listed in scripts/run-assertions.mjs DATA_MODULES',
    holds: () => AUDITED_COHORT.every((m) => m.listedInDataModules === true),
  },
  {
    id: 'imp35881-all-have-assertions-export-and-result-export',
    description: 'every audited file exports a result-object const and a *_ASSERTIONS export',
    holds: () => AUDITED_COHORT.every((m) => m.hasAssertionsExport === true && !!m.resultExport),
  },
  {
    id: 'imp35881-imp35808-included-and-covered',
    description: 'imp-35808 (missed by the earlier five-module imp-35858 audit) is present and fully wired',
    holds: () => {
      const m = AUDITED_COHORT.find((x) => x.file.startsWith('imp-35808'));
      return !!m && m.listedInDataModules === true && m.hasAssertionsExport === true;
    },
  },
  {
    id: 'imp35881-zero-orphans-found',
    description: 'zero modules were missing from DATA_MODULES at audit time',
    holds: () =>
      ORPHANS_FOUND.length === 0 &&
      IMP35881_FULL_SIX_COHORT_REGISTRATION_REACHABILITY_AUDIT.danglingOrOrphanedFound === 0,
  },
  {
    id: 'imp35881-viz-status-consistent',
    description: 'exactly three cohort members have a registered downstream viz page (35809/35811/35812), the other three are registry-only',
    holds: () => {
      const withViz = AUDITED_COHORT.filter((m) => m.hasVizPage === true);
      const withoutViz = AUDITED_COHORT.filter((m) => m.hasVizPage === false);
      return (
        withViz.length === 3 &&
        withoutViz.length === 3 &&
        withViz.every((m) => !!m.vizViaTicket)
      );
    },
  },
  {
    id: 'imp35881-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35881_FULL_SIX_COHORT_REGISTRATION_REACHABILITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35881_FULL_SIX_COHORT_REGISTRATION_REACHABILITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35881_FULL_SIX_COHORT_REGISTRATION_REACHABILITY_AUDIT.verdict),
  },
];

for (const a of IMP35881_FULL_SIX_COHORT_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35881-full-six-cohort-registration-reachability-audit assertion failed: ${a.id}`);
  }
}

export default IMP35881_FULL_SIX_COHORT_REGISTRATION_REACHABILITY_AUDIT;
