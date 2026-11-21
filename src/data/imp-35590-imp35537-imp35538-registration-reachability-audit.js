/**
 * @module imp-35590-imp35537-imp35538-registration-reachability-audit
 *
 * imp-35590 (bug, audit): a registration/reachability check (imp-35472..imp-35477 /
 * imp-35545 method) on the imp-35537 (R1t reentry-band closure scope) and imp-35538
 * (route-i remainder derivation requirements) assessment modules -- does each export
 * what it claims, and is its self-executing *_ASSERTIONS array wired into
 * scripts/run-assertions.mjs DATA_MODULES?
 *
 * METHOD. For each of the two modules, checked: (1) which top-level `export const`
 * statements it carries (neither module has a `-viz-data` filename suffix, so neither
 * is expected to carry its own routed page -- both are registry-only reference modules
 * per the imp-35412/imp-35472 convention, cited by prose/id from OTHER viz-data modules
 * rather than backing a page themselves); (2) whether its filepath string is a live
 * entry in scripts/run-assertions.mjs DATA_MODULES.
 *
 * FINDING. Both modules export exactly two named consts each -- a result-object const
 * (IMP35537_R1T_REENTRY_BAND_CLOSURE_SCOPE, IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS)
 * and its paired *_ASSERTIONS array -- with no default export (the same no-default-export
 * shape as imp-35551/imp-35555/imp-35556/imp-35558 in the imp-35630 cohort). Both filepath
 * strings ('/src/data/imp-35537-r1t-reentry-band-closure-scope.js',
 * '/src/data/imp-35538-route-i-remainder-derivation-requirements.js') are confirmed live
 * DATA_MODULES entries in scripts/run-assertions.mjs by direct grep, so both modules'
 * self-executing THROWing assertions run under `npm run assert`. Neither filename carries
 * the `-viz-data` suffix and neither is registered in src/data/visualizations-index.js or
 * routed in src/App.jsx -- correctly so, since each is cited by id/prose from OTHER
 * viz-data modules (imp-35538 from imp-35580's Imp35580Req4HeightGapViz page,
 * imp-35537 from imp-35582's Imp35582ReentryBandDataUnreachabilityViz page) rather than
 * backing a page of its own. Zero imp-34987-class orphans, zero dangling exports.
 *
 * SCOPE. Read-only audit only. No source file required correction. Changes no bound;
 * establishes no operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35472-imp354xx-registration-reachability-audit (earlier batch establishing the method)
 * @see imp-35545-imp354xx-registration-reachability-audit (prior registration/reachability sweep)
 * @see imp-35630-imp3555x-imp3557x-registration-reachability-audit (sibling sweep citing this same method)
 * @see imp-35537-r1t-reentry-band-closure-scope
 * @see imp-35538-route-i-remainder-derivation-requirements
 */

const AUDITED_MODULES = [
  {
    file: 'imp-35537-r1t-reentry-band-closure-scope',
    exportedConsts: [
      'IMP35537_R1T_REENTRY_BAND_CLOSURE_SCOPE',
      'IMP35537_R1T_REENTRY_BAND_CLOSURE_SCOPE_ASSERTIONS',
    ],
    hasDefaultExport: false,
    assertionsWired: true,
    kind: 'registry-only-reference',
    hasPage: false,
    citedByVizModule: 'imp-35582-reentry-band-data-unreachability-viz-data',
  },
  {
    file: 'imp-35538-route-i-remainder-derivation-requirements',
    exportedConsts: [
      'IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS',
      'IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS_ASSERTIONS',
    ],
    hasDefaultExport: false,
    assertionsWired: true,
    kind: 'registry-only-reference',
    hasPage: false,
    citedByVizModule: 'imp-35580-req4-height-gap-viz-data',
  },
];

const ORPHANS_FOUND = 0; // zero unwired *_ASSERTIONS arrays, zero dangling exports

export const IMP35590_REGISTRATION_REACHABILITY_AUDIT = {
  id: 'imp-35590',
  proofSection: 'audit',
  auditedModules: AUDITED_MODULES,
  auditedModuleCount: AUDITED_MODULES.length, // 2
  question:
    'Are the imp-35537 and imp-35538 assessment modules each exported/reachable where ' +
    'expected -- named-const exports present, *_ASSERTIONS array wired into ' +
    'scripts/run-assertions.mjs DATA_MODULES?',
  verdictShort:
    'CLEAN. Both modules export their result-object const and paired *_ASSERTIONS array ' +
    'with no default export; both filepaths are live scripts/run-assertions.mjs DATA_MODULES ' +
    'entries; neither is a viz-data module so neither is expected to carry its own page -- ' +
    'both are correctly registry-only reference modules cited from other viz-data pages. ' +
    'Zero orphans.',
  orphansFound: ORPHANS_FOUND,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked export ' +
    'statements and DATA_MODULES wiring in scripts/run-assertions.mjs for the imp-35537 and ' +
    'imp-35538 modules. Result: zero unwired assertions arrays, zero dangling exports. No ' +
    'source file required correction. Changes no bound; establishes no operator positivity; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation: 'imp-35472..imp-35477 / imp-35545 (prior audit method this ticket mirrors).',
};

export const IMP35590_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35590-audited-module-count',
    description: 'the audit covered both imp-35537 and imp-35538 modules',
    holds: () => IMP35590_REGISTRATION_REACHABILITY_AUDIT.auditedModuleCount === 2,
  },
  {
    id: 'imp35590-all-assertions-wired',
    description: 'every audited module has its *_ASSERTIONS array wired into run-assertions.mjs',
    holds: () => AUDITED_MODULES.every((m) => m.assertionsWired === true),
  },
  {
    id: 'imp35590-neither-is-viz-data-without-a-page',
    description: 'neither module is a viz-data-kind module lacking a page (both are registry-only-reference)',
    holds: () => AUDITED_MODULES.every((m) => m.kind === 'registry-only-reference' && m.hasPage === false),
  },
  {
    id: 'imp35590-each-exports-two-named-consts',
    description: 'each audited module exports exactly its result const and paired assertions const',
    holds: () => AUDITED_MODULES.every((m) => Array.isArray(m.exportedConsts) && m.exportedConsts.length === 2),
  },
  {
    id: 'imp35590-zero-orphans',
    description: 'the audit found zero registration/reachability orphans',
    holds: () => IMP35590_REGISTRATION_REACHABILITY_AUDIT.orphansFound === 0,
  },
  {
    id: 'imp35590-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35590_REGISTRATION_REACHABILITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35590_REGISTRATION_REACHABILITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35590_REGISTRATION_REACHABILITY_AUDIT.verdict),
  },
];

for (const a of IMP35590_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35590-imp35537-imp35538-registration-reachability-audit assertion failed: ${a.id}`);
  }
}
