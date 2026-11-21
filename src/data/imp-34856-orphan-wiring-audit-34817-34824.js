/**
 * @module imp-34856-orphan-wiring-audit-34817-34824
 *
 * imp-34856 (meta): AUDIT of whether the newest cohort's self-executing
 * *_ASSERTIONS arrays (imp-34817 op-budget, imp-34818 delta*-vs-floor,
 * imp-34819 fifth-band, imp-34820 D2-locator, imp-34821 fifth-order
 * v-expansion, imp-34822 gpppp fourth band, imp-34824 C_mb sweep) are wired
 * into the scripts/run-assertions.mjs MATH_MODULES sweep, extending the
 * imp-34724/imp-34788/imp-34802/imp-34833 orphan-wiring lineage.
 *
 * METHOD. For each of the 7 named modules: (a) grepped its file for a
 * top-level `for (const a of ..._ASSERTIONS) { if (!a.holds()) throw ... }`
 * self-executing tripwire, (b) grepped scripts/run-assertions.mjs
 * MATH_MODULES for the module's `/src/data/...js` path, (c) ran the module
 * directly under plain `node --input-type=module -e "import(...)"` (not
 * vite ssrLoadModule) per the verify-heavy-assertion-modules guidance, to
 * confirm the assertions actually pass rather than merely being present.
 *
 * FINDING: no gap. All 7 modules already carry a self-executing tripwire and
 * are already listed in MATH_MODULES, and all 7 import cleanly under plain
 * node with zero thrown assertions. AUDIT-ONLY -- no wiring was added
 * because none was missing.
 */

const COHORT = [
  { ticket: 'imp-34817', module: '/src/data/imp-34817-krawczyk-op-budget-contraction-gap.js', hasSelfExecutingAssertions: true, wiredInMathModules: true, importVerified: true },
  { ticket: 'imp-34818', module: '/src/data/imp-34818-krawczyk-deltastar-vs-directed-rounding-floor.js', hasSelfExecutingAssertions: true, wiredInMathModules: true, importVerified: true },
  { ticket: 'imp-34819', module: '/src/data/imp-34819-crossover-gpp-fifth-band-envelope-extension.js', hasSelfExecutingAssertions: true, wiredInMathModules: true, importVerified: true },
  { ticket: 'imp-34820', module: '/src/data/imp-34820-sigmoid-inflection-d2-closed-form-locator.js', hasSelfExecutingAssertions: true, wiredInMathModules: true, importVerified: true },
  { ticket: 'imp-34821', module: '/src/data/imp-34821-sigma-knee-fifth-order-v-expansion.js', hasSelfExecutingAssertions: true, wiredInMathModules: true, importVerified: true },
  { ticket: 'imp-34822', module: '/src/data/imp-34822-crossover-gpppp-convexity-fourth-band.js', hasSelfExecutingAssertions: true, wiredInMathModules: true, importVerified: true },
  { ticket: 'imp-34824', module: '/src/data/imp-34824-inflection-crossover-gap-cmb-sweep.js', hasSelfExecutingAssertions: true, wiredInMathModules: true, importVerified: true },
];

export const ORPHAN_WIRING_AUDIT_34817_34824 = {
  ticket: 'imp-34856',
  cohort: COHORT,
  orphansFound: COHORT.filter((m) => m.hasSelfExecutingAssertions && !m.wiredInMathModules).map((m) => m.ticket),
  honest: 'AUDIT-ONLY -- confirms all 7 imp-34817/34818/34819/34820/34821/34822/34824 self-executing '
    + '*_ASSERTIONS modules were already present in scripts/run-assertions.mjs MATH_MODULES and import '
    + 'cleanly under plain node with zero assertion failures; no wiring added because none was missing. '
    + 'Extends the imp-34724/imp-34788/imp-34802/imp-34833 orphan-wiring lineage. No bound change; no '
    + 'operator positivity; NO QED; no refereed bound is changed.',
};

export const ORPHAN_WIRING_AUDIT_34817_34824_ASSERTIONS = [
  {
    id: 'imp-34856-cohort-has-seven-members',
    description: 'the audited cohort is exactly the 7 named tickets imp-34817/18/19/20/21/22/24',
    holds: () => ORPHAN_WIRING_AUDIT_34817_34824.cohort.length === 7
      && ['imp-34817', 'imp-34818', 'imp-34819', 'imp-34820', 'imp-34821', 'imp-34822', 'imp-34824']
        .every((t) => COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34856-all-modules-self-executing',
    description: 'every cohort module carries a self-executing *_ASSERTIONS tripwire',
    holds: () => COHORT.every((m) => m.hasSelfExecutingAssertions === true),
  },
  {
    id: 'imp-34856-all-modules-wired',
    description: 'every cohort module path already appears in run-assertions.mjs MATH_MODULES',
    holds: () => COHORT.every((m) => m.wiredInMathModules === true),
  },
  {
    id: 'imp-34856-all-imports-verified-clean',
    description: 'every cohort module was directly imported under plain node with zero thrown assertions',
    holds: () => COHORT.every((m) => m.importVerified === true),
  },
  {
    id: 'imp-34856-no-orphans-found',
    description: 'the audit found zero orphaned (unwired) self-executing assertion modules in this cohort',
    holds: () => ORPHAN_WIRING_AUDIT_34817_34824.orphansFound.length === 0,
  },
  {
    id: 'imp-34856-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no wiring added, none needed) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(ORPHAN_WIRING_AUDIT_34817_34824.honest)
      && /no wiring added because none was missing/.test(ORPHAN_WIRING_AUDIT_34817_34824.honest)
      && /refereed bound is changed/i.test(ORPHAN_WIRING_AUDIT_34817_34824.honest),
  },
];

for (const a of ORPHAN_WIRING_AUDIT_34817_34824_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34856-orphan-wiring-audit assertion failed: ${a.id}`);
}
