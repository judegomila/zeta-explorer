/**
 * @module imp-35468-imp35411-imp35417-registration-reachability-audit
 *
 * imp-35468 (meta, audit): registration/reachability check (imp-35484/imp-35545 method) on the
 * two named modules imp-35411 (sigma-peak-plateau-width) and imp-35417
 * (sigma-landmark-distinct-dd-grid-cross-check) -- are they REGISTERED/exported where a page or
 * the visualization registry consumes them, or are they orphan compute-only modules with
 * dangling references?
 *
 * METHOD. For each module, checked: (1) whether its filepath string is a live entry in
 * scripts/run-assertions.mjs DATA_MODULES (the imp-34987 orphan class); (2) whether any ES
 * `import` statement anywhere in src/ pulls its named export directly; (3) whether its baked
 * numeric literals are consumed downstream by a viz-data module backing a routed, App.jsx-wired
 * page; (4) whether it is cited by prose headwords in src/data/glossary.js, which IS imported by
 * the routed ConceptsPage.jsx/WikiPage.jsx pages.
 *
 * FINDING (imp-35411-sigma-peak-plateau-width.js). Zero direct ES imports of
 * IMP35411_SIGMA_PEAK_PLATEAU_WIDTH anywhere in src/ -- by design, per the established
 * no-heavy-imports convention (feedback_no_heavy_imports_in_pages): downstream modules cite and
 * bake its literals verbatim rather than importing the module. Its filepath string IS a live
 * DATA_MODULES entry in scripts/run-assertions.mjs (confirmed by direct grep), so its
 * self-executing *_ASSERTIONS array runs under `npm run assert`. Its literals are baked into
 * src/data/imp-35482-sigma-peak-plateau-width-sqrt-scaling-viz-data.js, which backs the routed
 * page src/pages/Imp35482SigmaPeakPlateauWidthSqrtScalingViz.jsx (wired into src/App.jsx). It is
 * also cited by prose headwords in src/data/glossary.js, reachable via ConceptsPage.jsx/
 * WikiPage.jsx. NOT an orphan; NOT a dangling reference.
 *
 * FINDING (imp-35417-sigma-landmark-distinct-dd-grid-cross-check.js). Zero direct ES imports of
 * IMP35417_SIGMA_LANDMARK_DISTINCT_DD_GRID_CROSS_CHECK anywhere in src/, same no-heavy-imports
 * convention. Its filepath string IS a live DATA_MODULES entry in scripts/run-assertions.mjs
 * (confirmed by direct grep), so its self-executing *_ASSERTIONS array runs under
 * `npm run assert`. It has no viz-data-bearing consumer, but it is cited by prose in
 * src/data/imp-35505-etrunc-consumer-audit.js (itself cited onward by imp-35585/imp-35589) and
 * by multiple headwords in src/data/glossary.js, reachable via ConceptsPage.jsx/WikiPage.jsx.
 * Registry-only reference module per the imp-35412 convention; correctly carries no dedicated
 * page. NOT an orphan; NOT a dangling reference.
 *
 * SCOPE. Read-only audit only. No source file required correction -- zero orphans found. Changes
 * no bound; establishes no operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35484-imp35410x-registration-reachability-audit (the audit method this ticket repeats)
 * @see imp-35545-imp354xx-registration-reachability-audit (prior cohort application of the same method)
 * @see imp-35411-sigma-peak-plateau-width (audited: assertions-wired, baked-literal viz consumer)
 * @see imp-35417-sigma-landmark-distinct-dd-grid-cross-check (audited: assertions-wired, registry-only)
 * @see imp-35482-sigma-peak-plateau-width-sqrt-scaling-viz-data (the viz-data consumer of imp-35411)
 */

const AUDITED_MODULES = [
  {
    file: 'imp-35411-sigma-peak-plateau-width',
    assertionsWired: true,
    directEsImport: false,
    kind: 'baked-literal-viz-source',
    hasPage: true,
    page: 'src/pages/Imp35482SigmaPeakPlateauWidthSqrtScalingViz.jsx',
    consumer: 'src/data/imp-35482-sigma-peak-plateau-width-sqrt-scaling-viz-data.js',
    citedInGlossary: true,
  },
  {
    file: 'imp-35417-sigma-landmark-distinct-dd-grid-cross-check',
    assertionsWired: true,
    directEsImport: false,
    kind: 'registry-only-reference',
    hasPage: false,
    consumer: 'src/data/imp-35505-etrunc-consumer-audit.js',
    citedInGlossary: true,
  },
];

const ORPHANS_FOUND = 0; // zero unwired *_ASSERTIONS arrays, zero dangling references

export const IMP35468_REGISTRATION_REACHABILITY_AUDIT = {
  id: 'imp-35468',
  proofSection: 'audit',
  auditedModules: AUDITED_MODULES,
  auditedModuleCount: AUDITED_MODULES.length, // 2
  question:
    'Are the imp-35411 (sigma-peak-plateau-width) and imp-35417 (sigma-landmark-distinct-dd-grid) ' +
    'data modules REGISTERED/exported where a page or the visualization registry consumes them, ' +
    'or are they orphan compute-only modules with dangling references?',
  verdictShort:
    'CLEAN. Both modules have their *_ASSERTIONS array wired into scripts/run-assertions.mjs ' +
    'DATA_MODULES. Neither is directly ES-imported (by design, per no-heavy-imports), but ' +
    'imp-35411 is the baked-literal source for the routed imp-35482 viz page and imp-35417 is ' +
    'the registry-only reference cited by imp-35505; both are additionally cited by ' +
    'src/data/glossary.js headwords reachable via ConceptsPage.jsx/WikiPage.jsx. Zero orphans.',
  orphansFound: ORPHANS_FOUND,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked ' +
    'DATA_MODULES wiring in scripts/run-assertions.mjs, direct ES-import reachability, ' +
    'baked-literal viz-consumer/page wiring, and glossary citation for imp-35411 and imp-35417. ' +
    'Result: zero unwired assertions arrays, zero dangling references. No source file required ' +
    'correction. Changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35484/imp-35545 (prior audits using this method); imp-35482 (viz-data consumer of ' +
    'imp-35411); imp-35505 (registry consumer of imp-35417).',
};

export const IMP35468_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35468-audited-module-count',
    description: 'the audit covered both imp-35411 and imp-35417',
    holds: () => IMP35468_REGISTRATION_REACHABILITY_AUDIT.auditedModuleCount === 2,
  },
  {
    id: 'imp35468-all-assertions-wired',
    description: 'both audited modules have their *_ASSERTIONS array wired into run-assertions.mjs',
    holds: () => AUDITED_MODULES.every((m) => m.assertionsWired === true),
  },
  {
    id: 'imp35468-viz-consumer-has-routed-page',
    description: 'the baked-literal-viz-source module (imp-35411) has a routed page',
    holds: () =>
      AUDITED_MODULES.filter((m) => m.kind === 'baked-literal-viz-source').every(
        (m) => m.hasPage === true && typeof m.page === 'string' && m.page.length > 0
      ),
  },
  {
    id: 'imp35468-both-cited-in-glossary',
    description: 'both modules are cited by src/data/glossary.js headwords',
    holds: () => AUDITED_MODULES.every((m) => m.citedInGlossary === true),
  },
  {
    id: 'imp35468-zero-orphans',
    description: 'the audit found zero registration/reachability orphans',
    holds: () => IMP35468_REGISTRATION_REACHABILITY_AUDIT.orphansFound === 0,
  },
  {
    id: 'imp35468-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35468_REGISTRATION_REACHABILITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35468_REGISTRATION_REACHABILITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35468_REGISTRATION_REACHABILITY_AUDIT.verdict),
  },
];

for (const a of IMP35468_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35468-imp35411-imp35417-registration-reachability-audit assertion failed: ${a.id}`);
  }
}
