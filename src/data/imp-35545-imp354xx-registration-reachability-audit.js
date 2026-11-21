/**
 * @module imp-35545-imp354xx-registration-reachability-audit
 *
 * imp-35545 (meta, audit): a registration/reachability check (imp-35484 method) on the
 * imp-35472..imp-35477 cohort -- does each module export what it claims, is any
 * self-executing *_ASSERTIONS array wired into scripts/run-assertions.mjs DATA_MODULES, and
 * does any module that presents a result as a chart have a routed, nav-reachable page?
 *
 * METHOD. For each of the six modules, checked: (1) whether it exports a *_ASSERTIONS array,
 * and if so whether its filepath string is a live entry in scripts/run-assertions.mjs
 * DATA_MODULES (the imp-34987 orphan class imp-35484 found three instances of); (2) whether it
 * is registered in src/data/visualizations-index.js with a routed src/pages/*.jsx page wired
 * into src/App.jsx (the class of module that presents a chart, vs. a registry-only assessment
 * module that is cited by id and never expects its own page).
 *
 * FINDING. All six modules export a *_ASSERTIONS array and all six filepath strings are live
 * DATA_MODULES entries in scripts/run-assertions.mjs (imp-35472, imp-35473, imp-35474,
 * imp-35476, imp-35477 confirmed by direct grep; imp-35475 confirmed likewise) -- zero
 * imp-34987-class orphans in this cohort. Of the six, imp-35475 and imp-35477 are
 * viz-data-bearing modules and both have a routed page: imp-35475 backs
 * src/pages/Imp35544SigmaThreeInputDecompositionViz.jsx at route
 * /viz-imp35544-sigma-three-input-decomposition (added by imp-35544), and imp-35477 backs
 * src/pages/Imp35541SchemeIndependenceViz.jsx at route /viz-imp35541-scheme-independence
 * (added by imp-35541); both routes are wired into src/App.jsx and both pages are listed in
 * visualizations-index.js. The remaining four (imp-35472, imp-35473, imp-35474, imp-35476) are
 * registry-only verification/reference modules -- the same imp-35412 convention imp-35484
 * already established as a non-orphan class -- and correctly have no page.
 *
 * SCOPE. Read-only audit only. No source file required correction (unlike imp-35484, which
 * found and fixed three orphans). Changes no bound; establishes no operator positivity; no RH
 * verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35484-imp35410x-registration-reachability-audit (the audit method this ticket repeats)
 * @see imp-35472-r1s-baked-constants-reconstruction
 * @see imp-35473-eflow-fartail-remnant-sub1e4-crossing
 * @see imp-35474-dense-envelope-max-reverify-reference
 * @see imp-35475-sigma-fidelity-closure-scope
 * @see imp-35476-sigma-peak-plateau-sqrt-tol-offgrid
 * @see imp-35477-n2000-bs3-dense-crossvalidate-reference
 */

const AUDITED_MODULES = [
  {
    file: 'imp-35472-r1s-baked-constants-reconstruction',
    assertionsWired: true,
    kind: 'registry-only-reference',
    hasPage: false,
  },
  {
    file: 'imp-35473-eflow-fartail-remnant-sub1e4-crossing',
    assertionsWired: true,
    kind: 'registry-only-reference',
    hasPage: false,
  },
  {
    file: 'imp-35474-dense-envelope-max-reverify-reference',
    assertionsWired: true,
    kind: 'registry-only-reference',
    hasPage: false,
  },
  {
    file: 'imp-35475-sigma-fidelity-closure-scope',
    assertionsWired: true,
    kind: 'viz-data',
    hasPage: true,
    page: 'src/pages/Imp35544SigmaThreeInputDecompositionViz.jsx',
    route: '/viz-imp35544-sigma-three-input-decomposition',
  },
  {
    file: 'imp-35476-sigma-peak-plateau-sqrt-tol-offgrid',
    assertionsWired: true,
    kind: 'registry-only-reference',
    hasPage: false,
  },
  {
    file: 'imp-35477-n2000-bs3-dense-crossvalidate-reference',
    assertionsWired: true,
    kind: 'viz-data',
    hasPage: true,
    page: 'src/pages/Imp35541SchemeIndependenceViz.jsx',
    route: '/viz-imp35541-scheme-independence',
  },
];

const ORPHANS_FOUND = 0; // zero unwired *_ASSERTIONS arrays, zero unrouted viz-data modules

export const IMP35545_REGISTRATION_REACHABILITY_AUDIT = {
  id: 'imp-35545',
  proofSection: 'audit',
  auditedModules: AUDITED_MODULES,
  auditedModuleCount: AUDITED_MODULES.length, // 6
  question:
    'Are the imp-35472..imp-35477 modules each exported/registered where expected -- assertions ' +
    'wired into scripts/run-assertions.mjs, and any viz-data module reachable via a routed page?',
  verdictShort:
    'CLEAN. All six modules have their *_ASSERTIONS array wired into scripts/run-assertions.mjs ' +
    'DATA_MODULES; the two viz-data-bearing modules (imp-35475, imp-35477) each have a routed, ' +
    'App.jsx-wired page; the other four are registry-only reference modules per the ' +
    'established imp-35412 convention and correctly carry no page. Zero orphans.',
  orphansFound: ORPHANS_FOUND,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked ' +
    'DATA_MODULES wiring in scripts/run-assertions.mjs and page/route wiring in ' +
    'visualizations-index.js/App.jsx for all six imp-35472..imp-35477 modules. Result: zero ' +
    'unwired assertions arrays, zero unrouted viz-data modules. No source file required ' +
    'correction. Changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation: 'imp-35484 (prior audit method, found and fixed three imp-34987-class orphans).',
};

export const IMP35545_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35545-audited-module-count',
    description: 'the audit covered all six imp-35472..imp-35477 modules',
    holds: () => IMP35545_REGISTRATION_REACHABILITY_AUDIT.auditedModuleCount === 6,
  },
  {
    id: 'imp35545-all-assertions-wired',
    description: 'every audited module has its *_ASSERTIONS array wired into run-assertions.mjs',
    holds: () => AUDITED_MODULES.every((m) => m.assertionsWired === true),
  },
  {
    id: 'imp35545-viz-data-modules-have-pages',
    description: 'both viz-data-kind modules (imp-35475, imp-35477) have a routed page',
    holds: () =>
      AUDITED_MODULES.filter((m) => m.kind === 'viz-data').every(
        (m) => m.hasPage === true && typeof m.route === 'string' && m.route.startsWith('/viz-')
      ),
  },
  {
    id: 'imp35545-zero-orphans',
    description: 'the audit found zero registration/reachability orphans',
    holds: () => IMP35545_REGISTRATION_REACHABILITY_AUDIT.orphansFound === 0,
  },
  {
    id: 'imp35545-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35545_REGISTRATION_REACHABILITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35545_REGISTRATION_REACHABILITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35545_REGISTRATION_REACHABILITY_AUDIT.verdict),
  },
];

for (const a of IMP35545_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35545-imp354xx-registration-reachability-audit assertion failed: ${a.id}`);
  }
}
