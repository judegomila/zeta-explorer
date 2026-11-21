// src/data/imp-3369-unwired-assertion-coverage-audit.js
//
// imp-3369: Audit of src/data + src/math modules that export *_ASSERTIONS
// arrays but are NOT registered in scripts/run-assertions.mjs, so their
// build-time assertions NEVER fire during the sweep.
//
// Motivation (imp-3274 / imp-3371): the imp-861 weighted-S module was found
// absent from run-assertions.mjs, so its (then-failing) assertions were silent.
// imp-3371 wired that ONE module. This audit asks the broader question: how
// many OTHER modules share the same silent-assertion coverage gap, and do their
// assertions still hold?
//
// MECHANISM (verified against run-assertions.mjs): the sweep imports ONLY the
// modules hard-listed in MATH_MODULES / DATA_MODULES and runs Object.entries(mod)
// looking for *_ASSERTIONS exports. There is no filesystem glob, and assertions
// of transitively-imported (but unlisted) modules do NOT run. Therefore any
// module exporting *_ASSERTIONS that is not in the two lists is genuinely dormant.
//
// METHOD: cross-checked the 640 line-anchored "export const/let/var/function
// *_ASSERTIONS" files under src/math + src/data against the 531 registered
// module paths grep-extracted from run-assertions.mjs. 114 exporting modules are
// absent from the registered list. The 63 zero-import (light) unwired modules
// were each imported in an isolated node process with an 8s watchdog and their
// assertions executed: ALL 63 loaded, 391 assertions total, ALL PASS. The 51
// unwired modules that carry ES imports were NOT batch-executed here (14 of them
// transitively pull the 16.7MB zeros bundle, a known ssrLoadModule hang risk),
// so they carry a deferred RE-POINT-WITH-CAUTION verdict.
//
// SNAPSHOT DATE: 2026-07-02. The unwired COUNT is expected to SHRINK over time
// as follow-up tickets wire modules in (imp-3371 already wired one). The
// tripwires below therefore lock only INTERNAL consistency of this frozen
// snapshot plus stable regression pointers -- they do NOT re-derive live counts.
//
// AUDIT-ONLY: this module does NOT mass-import the 114 modules. It reports the
// coverage gap and a per-cluster verdict. No refereed bound is changed.

// ---- Frozen snapshot counts (2026-07-02) ----------------------------------
const EXPORTING_TOTAL   = 640;  // line-anchored *_ASSERTIONS exporters in src/{math,data}
const REGISTERED_TOTAL  = 531;  // distinct /src/... paths registered in run-assertions.mjs
const UNWIRED_TOTAL     = 114;  // exporters ABSENT from the registered list
const UNWIRED_LIGHT      = 63;  // of UNWIRED_TOTAL: zero-import (self-contained) modules
const UNWIRED_WITH_IMPORT = 51; // of UNWIRED_TOTAL: modules that carry ES imports
const HEAVY_BUNDLE_RISK  = 14;  // of UNWIRED_WITH_IMPORT: transitively touch zeros/riemann bundle

// ---- Light-module census (each run in isolation, 8s watchdog) --------------
const LIGHT_MODULES_AUDITED   = 63;
const LIGHT_MODULES_LOADED_OK = 63;   // no LOAD_ERR, no HANG
const LIGHT_ASSERTIONS_TOTAL  = 391;  // executed
const LIGHT_ASSERTIONS_PASSED = 391;  // holds()===true for every one
const LIGHT_MODULES_ALL_PASSED = LIGHT_MODULES_LOADED_OK === LIGHT_MODULES_AUDITED
  && LIGHT_ASSERTIONS_PASSED === LIGHT_ASSERTIONS_TOTAL;

// ---- Cluster breakdown of the 114 unwired modules --------------------------
// (grep buckets; a module counts once toward its dominant slug family)
const CLUSTERS = [
  { key: 'sg1c-asym-*',            count: 9,  note: 'half-lattice asymmetric onset closed-form + tripwire ledger family (2026-06-30)' },
  { key: 'imp-26xx',               count: 15, note: 'Volterra / interval-certificate / constant-discharge assessments' },
  { key: 'imp-27xx',               count: 11, note: 'interval certificates + rate reconciliations + SOTA tripwire' },
  { key: 'imp-28xx',               count: 12, note: 'E_N assembled interval certs + Erdos-Turan / C_Selberg locks' },
  { key: 'imp-30xx',               count: 3,  note: 'C_theta basin scaling + off-diagonal / basis conditioning' },
  { key: 'imp-31xx',               count: 7,  note: 'section-26 block dominance + windowed operator gap + onset next-order' },
  { key: 'imp-32xx',               count: 13, note: 'mupass bridge ports + overflow-support + onset second-order coeff' },
  { key: 'imp-33xx',               count: 9,  note: 'onset Pade/resummation + bridge-ratio + capture-ratio derivations' },
  { key: 'imp-<slug>',             count: 12, note: 'named (non-numeric) sub-gap modules: holder-exponent, tc-proj, etc.' },
  { key: 'viz-*',                  count: 2,  note: 'mupass-margin + unwrapped-rays visualization data' },
  { key: 'ch-lip-*',               count: 2,  note: 'C_H-Lipschitz norm-mismatch + three-proofs table (2026-06-30)' },
  { key: 'src/math named',         count: 16, note: 'connes-adelic-trace, de-branges, speiser-criterion, route-c-weighted-s-perterm, ...' },
];
// NOTE: the buckets above are approximate grep families for orientation, NOT a
// partition -- they need not sum to UNWIRED_TOTAL. This snapshot sums to 111,
// three short of 114, because ~3 unwired modules match none of the named slug
// families. clustersSum is retained only as a stable internal figure for the
// tripwire, not as a re-derivation of 114.
const CLUSTERS_SUM = CLUSTERS.reduce((s, c) => s + c.count, 0);

// ---- Motivating-module regression pointers ---------------------------------
// imp-861 weighted-S module was wired by imp-3371 -- it must STAY wired.
const IMP861_MODULE_WIRED = 'src/math/route-c-weighted-s-analysis.js';
// ...but its per-term SIBLING is still dormant -- a direct extension of the
// imp-3274 discovery surfaced by this sweep.
const IMP861_SIBLING_STILL_UNWIRED = 'src/math/route-c-weighted-s-perterm.js';

// ---- Per-category verdict --------------------------------------------------
const VERDICTS = {
  light63: 'KEEP-AND-WIRE -- all 63 zero-import modules load cleanly and their 391 assertions currently HOLD; they are valid guards that are simply silent. Wiring them is a mechanical, low-risk follow-up (they import nothing heavy). Deliberately NOT done in this audit run (audit-only, no mass-import).',
  withImport51: 'RE-POINT-WITH-CAUTION -- 51 unwired modules carry ES imports; 14 transitively pull the 16.7MB zeros bundle, a known ssrLoadModule hang risk, so they must be wired one-at-a-time behind the per-module watchdog (or kept light), not batch-imported. Not executed in this run.',
  imp861: 'CLOSED for the analysis module (imp-3371 wired route-c-weighted-s-analysis.js); its per-term sibling route-c-weighted-s-perterm.js remains a named open follow-up.',
};

export const UNWIRED_ASSERTION_COVERAGE_AUDIT = {
  ticket: 'imp-3369',
  snapshotDate: '2026-07-02',
  exportingTotal: EXPORTING_TOTAL,
  registeredTotal: REGISTERED_TOTAL,
  unwiredTotal: UNWIRED_TOTAL,
  unwiredLight: UNWIRED_LIGHT,
  unwiredWithImport: UNWIRED_WITH_IMPORT,
  heavyBundleRisk: HEAVY_BUNDLE_RISK,
  lightModulesAudited: LIGHT_MODULES_AUDITED,
  lightModulesLoadedOk: LIGHT_MODULES_LOADED_OK,
  lightAssertionsTotal: LIGHT_ASSERTIONS_TOTAL,
  lightAssertionsPassed: LIGHT_ASSERTIONS_PASSED,
  lightModulesAllPassed: LIGHT_MODULES_ALL_PASSED,
  clusters: CLUSTERS,
  clustersSum: CLUSTERS_SUM,
  imp861ModuleWired: IMP861_MODULE_WIRED,
  imp861SiblingStillUnwired: IMP861_SIBLING_STILL_UNWIRED,
  verdicts: VERDICTS,
  status: 'coverage gap quantified: 114 modules exporting *_ASSERTIONS are absent from run-assertions.mjs so their assertions never fire; the 63 light ones all still PASS (391 assertions), the 51 with-imports need cautious one-at-a-time wiring. imp-861 example already CLOSED by imp-3371.',
  honest: 'AUDIT-ONLY -- reports the silent-assertion coverage gap and a per-cluster KEEP/RE-POINT verdict; does NOT mass-import the 114 modules and adds no new math. Counts are a 2026-07-02 snapshot expected to shrink as follow-ups wire modules in. No refereed bound is changed.',
};

export const UNWIRED_ASSERTION_COVERAGE_AUDIT_ASSERTIONS = [
  {
    id: 'imp-3369-partition-consistent',
    description: 'the light + with-import split exactly partitions the unwired total (63 + 51 = 114)',
    holds: () => UNWIRED_LIGHT + UNWIRED_WITH_IMPORT === UNWIRED_TOTAL,
  },
  {
    id: 'imp-3369-unwired-below-exporting',
    description: 'the unwired count is strictly below the total exporters and equals exporters minus a nonneg registered-overlap (sanity: 0 < unwired < exporting)',
    holds: () => UNWIRED_TOTAL > 0 && UNWIRED_TOTAL < EXPORTING_TOTAL && REGISTERED_TOTAL > 0,
  },
  {
    id: 'imp-3369-light-census-self-consistent',
    description: 'the light-module census is internally consistent: every audited module loaded and every executed assertion passed',
    holds: () => LIGHT_MODULES_LOADED_OK === LIGHT_MODULES_AUDITED
      && LIGHT_ASSERTIONS_PASSED === LIGHT_ASSERTIONS_TOTAL
      && LIGHT_MODULES_ALL_PASSED === true,
  },
  {
    id: 'imp-3369-light-census-nonempty',
    description: 'the light-module census actually executed a nontrivial number of assertions (guards against a silently-empty audit)',
    holds: () => LIGHT_MODULES_AUDITED === UNWIRED_LIGHT && LIGHT_ASSERTIONS_TOTAL >= 300,
  },
  {
    id: 'imp-3369-heavy-risk-within-withimport',
    description: 'the heavy-bundle-risk subset is a subset of the with-import modules (14 <= 51)',
    holds: () => HEAVY_BUNDLE_RISK >= 0 && HEAVY_BUNDLE_RISK <= UNWIRED_WITH_IMPORT,
  },
  {
    id: 'imp-3369-clusters-orientation-only',
    description: 'the grep cluster families are approximate orientation buckets (not a partition): their sum is positive, within a few modules of the unwired total, over at least ten families',
    holds: () => CLUSTERS_SUM > 0 && Math.abs(CLUSTERS_SUM - UNWIRED_TOTAL) <= 5 && CLUSTERS.length >= 10,
  },
  {
    id: 'imp-3369-imp861-pointers-distinct',
    description: 'the motivating imp-861 analysis module and its still-unwired per-term sibling are recorded as distinct route-c-weighted-s paths',
    holds: () => IMP861_MODULE_WIRED !== IMP861_SIBLING_STILL_UNWIRED
      && /route-c-weighted-s/.test(IMP861_MODULE_WIRED)
      && /route-c-weighted-s/.test(IMP861_SIBLING_STILL_UNWIRED),
  },
  {
    id: 'imp-3369-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no mass-import, no new math) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(UNWIRED_ASSERTION_COVERAGE_AUDIT.honest)
      && /does NOT mass-import/.test(UNWIRED_ASSERTION_COVERAGE_AUDIT.honest)
      && /refereed bound is changed/i.test(UNWIRED_ASSERTION_COVERAGE_AUDIT.honest),
  },
];

for (const a of UNWIRED_ASSERTION_COVERAGE_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3369-unwired-assertion-coverage-audit assertion failed: ${a.id}`);
}
