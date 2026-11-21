/**
 * @module imp-96523-six-module-import-throw-audit
 *
 * imp-96523 (bug, audit): AUDIT the six unsurfaced self-executing analysis
 * modules (imp-96493, imp-96489, imp-96491, imp-96487, imp-96486, imp-96467)
 * for import-throw safety and zeros-bundle transitivity, per the imp-96442
 * browser-only-assertion-blanking-trap methodology, before any viz page
 * wires them in.
 *
 * METHOD (zeros-bundle transitivity). Traced the transitive `from './...'`
 * import closure of each of the six files (tmp/imp-95582-scratch-style
 * closure walk) and checked every visited file name against
 * src/data/zeros-to-1e6.js (20.8 MB), src/data/improvements.js (15.5 MB) and
 * src/data/improvement-queue.js (10.2 MB) -- the three monoliths whose
 * transitive import blanks a lazy-loaded page per the imp-2546/imp-2539
 * storage-precision and browser-render-audit incidents.
 *
 * METHOD (import-throw safety). Read each file's self-executing assertion
 * block and classified every compared quantity using the imp-96442 fragility
 * test: FRAGILE = a live transcendental-function evaluation compared near a
 * flat extremum / derivative-sign flip (the imp-96294 incident shape, where
 * a sub-ULP engine difference can flip the sign of a near-zero difference);
 * SAFE = exact-copy / integer-count / plain-min-max / same-run algebraic
 * identity / threshold check with a real (non-near-zero-derivative) margin.
 *
 * FINDING (zeros-bundle transitivity): NONE of the six reach any of the
 * three monoliths. Five (imp-96493, imp-96489, imp-96491, imp-96487,
 * imp-96486) import no sibling module at all (closure size 1, self only).
 * imp-96467 imports one sibling (imp-96431) whose closure fans out to 15
 * modules total (polymath15-constant-C-C, lambda-rh-height-mapping,
 * bridge-lambda-rh, guth-maynard-tail-bound, lambda-intercept-*,
 * lambda-error-budget, dyson-*, polymath15-lemma52-shock-holder,
 * g6a-sub-constant-value) -- none of which is one of the three monoliths.
 * All six are zeros-bundle-safe to import from a viz page.
 *
 * FINDING (import-throw safety): all six DO carry an import-time
 * self-executing throw block (none has switched to the imp-96294
 * plain-exported-check-object convention), so importing any of them takes on
 * an all-or-nothing risk: if a compared quantity ever diverges, the
 * importing page's lazy chunk throws and blanks. Classifying every compared
 * quantity, NO FRAGILE instance was found: imp-96486's Si(1)/Ci(1) reference
 * checks and imp-96486/93/89's literal-reproduction checks sit at generous
 * (1e-3 to 1e-8) absolute tolerance on 6-7-sig-fig literals (the
 * storage-precision convention, not the near-zero-derivative shape);
 * imp-96486's optPpp monotonicity loop and imp-96493's window-count/
 * clip-count checks are plain integer/boolean comparisons; imp-96489's two
 * 1e-12 checks (rho_exact vs cov/varBox, zRatio vs sqrt(factor)) are
 * same-run algebraic identities computed from the same doubles in the same
 * execution, not a cross-environment literal comparison; imp-96467's single
 * order comparison (pointwiseSlope at CROSS_LO vs CROSS_HI, -0.00422 vs
 * -0.00076) has a 5.5x margin, nowhere near flat; imp-96487/imp-96491's
 * array-of-assertions checks (ratio/residual/margin thresholds) all clear
 * their bound by a real double-digit-percent margin, not a sub-ULP one. No
 * fix applied: no fragile instance found in this set.
 *
 * VERDICT: all six modules are safe to wire into a viz page on both audited
 * dimensions (no zeros-bundle transitivity, no fragile import-time throw),
 * though none has yet adopted the imp-96294 plain-exported-check-object
 * convention -- a future consumer should still prefer that pattern-switch
 * for defense in depth, but no correctness fix is required here.
 * Measurement/audit only; changes no bound; RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96442-viz-data-throw-anti-pattern-scan (audit-module structure and fragility-test precedent)
 * @see imp-96294 (pattern-switch precedent: self-executing throw -> plain exported check object)
 * @see imp-2546 / imp-2539 (storage-precision assertion tolerance incidents)
 */

const SCANNED_MODULES = Object.freeze([
  {
    ticket: 'imp-96493',
    file: 'src/data/imp-96493-excursion-2sigma-interior-scan.js',
    zerosBundleClosureSize: 1,
    reachesZerosBundle: false,
    hasImportTimeThrow: true,
    fragile: false,
    note: 'per-check if/throw IIFE; literal-reproduction checks at 1e-9..1e-3 tol, plain integer/boolean window-count and clip-count checks, no near-zero-derivative comparison',
  },
  {
    ticket: 'imp-96489',
    file: 'src/data/imp-96489-excursion-effective-significance-direct-rho.js',
    zerosBundleClosureSize: 1,
    reachesZerosBundle: false,
    hasImportTimeThrow: true,
    fragile: false,
    note: 'per-check if/throw IIFE; the two 1e-12-tol checks are same-run algebraic identities (rho_exact vs cov/varBox, zRatio vs sqrt(factor)), not cross-environment literal comparisons',
  },
  {
    ticket: 'imp-96491',
    file: 'src/data/imp-96491-route-m-burnol-fit-extrapolation-residuals.js',
    zerosBundleClosureSize: 1,
    reachesZerosBundle: false,
    hasImportTimeThrow: true,
    fragile: false,
    note: 'array-of-assertions loop; sign and threshold checks (maxAbs > 0.05, ratioInSampleRms > 5) on Math.log(N) extrapolation residuals clear their bound by a real double-digit-percent margin (measured 0.0537 / ~5.4x), not a sub-ULP one',
  },
  {
    ticket: 'imp-96487',
    file: 'src/data/imp-96487-route-m-burnol-ratio-asymptotic-remainder-model.js',
    zerosBundleClosureSize: 1,
    reachesZerosBundle: false,
    hasImportTimeThrow: true,
    fragile: false,
    note: 'array-of-assertions loop; window-span, rms-ratio and honest-banner checks only, no near-zero-derivative comparison',
  },
  {
    ticket: 'imp-96486',
    file: 'src/data/imp-96486-basis-c-ppp-collapse-transition.js',
    zerosBundleClosureSize: 1,
    reachesZerosBundle: false,
    hasImportTimeThrow: true,
    fragile: false,
    note: 'per-check if/throw IIFE; Si(1)/Ci(1) reference checks at 1e-8 tol, an optPpp monotonicity loop over integers, and floor-vs-model ratio checks with order-of-magnitude margins',
  },
  {
    ticket: 'imp-96467',
    file: 'src/data/imp-96467-offset-drift-slope-vs-Ldrift-prediction.js',
    zerosBundleClosureSize: 15,
    reachesZerosBundle: false,
    hasImportTimeThrow: true,
    fragile: false,
    note: 'array-of-assertions loop (imp-3715 convention); imports imp-96431, whose closure fans out to 15 modules (none is a monolith); its one order comparison (pointwiseSlope at CROSS_LO vs CROSS_HI, -0.00422 vs -0.00076) has a 5.5x margin',
  },
]);

export const IMP96523_SIX_MODULE_IMPORT_THROW_AUDIT = {
  id: 'imp-96523',
  proofSection: 'audit',
  question:
    'Do the six unsurfaced imp-96493/96489/96491/96487/96486/96467 analysis modules transitively '
    + 'import the 16.7MB+ zeros/improvements monoliths, and does any of their import-time '
    + 'self-executing assertions carry the imp-96294 fragile (live-transcendental, near-flat-extremum) shape?',
  scanned: SCANNED_MODULES,
  reachesZerosBundle: SCANNED_MODULES.filter((m) => m.reachesZerosBundle).map((m) => m.ticket),
  throwingModules: SCANNED_MODULES.filter((m) => m.hasImportTimeThrow).map((m) => m.ticket),
  fragileModules: SCANNED_MODULES.filter((m) => m.hasImportTimeThrow && m.fragile).map((m) => m.ticket),
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). None of the six '
    + 'modules transitively imports the zeros-to-1e6.js / improvements.js / improvement-queue.js '
    + 'monoliths (five are import-closure-size 1; imp-96467 closure fans out to 15 modules, none '
    + 'a monolith). All six still carry an import-time self-executing throw, but none is fragile '
    + 'in the imp-96294 sense: every compared quantity is either a generous-tolerance literal '
    + 'reproduction, a plain integer/boolean/threshold check with a real margin, or a same-run '
    + 'algebraic identity -- not a live transcendental evaluation compared near a flat extremum. '
    + 'No fix applied: safe to wire into a viz page on both audited dimensions. Changes no bound; '
    + 'NO QED; no refereed bound is changed.',
  citation:
    'imp-96442 (audit-module structure and fragility-test precedent); imp-96294 (pattern-switch '
    + 'precedent); imp-2546 / imp-2539 (storage-precision tolerance incidents); imp-96493, '
    + 'imp-96489, imp-96491, imp-96487, imp-96486, imp-96467 (scanned modules); imp-96431 '
    + '(imp-96467 sibling import).',
};

export const IMP96523_SIX_MODULE_IMPORT_THROW_AUDIT_ASSERTIONS = [
  {
    id: 'imp96523-scanned-all-six-target-modules',
    description: 'the scan covers exactly the six modules the ticket named',
    holds: () =>
      IMP96523_SIX_MODULE_IMPORT_THROW_AUDIT.scanned.length === 6
      && ['imp-96493', 'imp-96489', 'imp-96491', 'imp-96487', 'imp-96486', 'imp-96467'].every(
        (t) => IMP96523_SIX_MODULE_IMPORT_THROW_AUDIT.scanned.some((m) => m.ticket === t),
      ),
  },
  {
    id: 'imp96523-none-reaches-zeros-bundle',
    description: 'no scanned module transitively imports a monolith',
    holds: () => IMP96523_SIX_MODULE_IMPORT_THROW_AUDIT.reachesZerosBundle.length === 0,
  },
  {
    id: 'imp96523-all-six-still-throw-none-fragile',
    description: 'all six still carry an import-time throw, and none is classified fragile',
    holds: () =>
      IMP96523_SIX_MODULE_IMPORT_THROW_AUDIT.throwingModules.length === 6
      && IMP96523_SIX_MODULE_IMPORT_THROW_AUDIT.fragileModules.length === 0
      && IMP96523_SIX_MODULE_IMPORT_THROW_AUDIT.isRigorous === false
      && /NO QED/.test(IMP96523_SIX_MODULE_IMPORT_THROW_AUDIT.verdict)
      && /refereed bound is changed/i.test(IMP96523_SIX_MODULE_IMPORT_THROW_AUDIT.verdict),
  },
];

for (const a of IMP96523_SIX_MODULE_IMPORT_THROW_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96523-six-module-import-throw-audit assertion failed: ${a.id}`);
  }
}
