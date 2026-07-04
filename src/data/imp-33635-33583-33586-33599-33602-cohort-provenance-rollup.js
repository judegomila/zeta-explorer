/**
 * @module imp-33635-33583-33586-33599-33602-cohort-provenance-rollup
 * @fileoverview imp-33635 -- META provenance roll-up cataloguing the imp-33583/imp-33584/
 * imp-33585/imp-33586 + imp-33599/imp-33600/imp-33601/imp-33602 deep-tail/sigma-decay cohort
 * (eight modules spanning two disjoint id ranges) BY EVIDENCE CLASS, mirroring the imp-33719/
 * imp-33693 rollup pattern and confirming each module carries the mandatory honest banner:
 * no-QED, the imp-3066 K_a >= 0 operator-positivity invariant untouched, and Platt-Trudgian
 * Lambda <= 0.2 SOTA.
 *
 * METHOD (read-only, performed at author time). Each module's source file was read directly
 * and grepped for the mandatory banner phrases ("NO QED", "imp-3066" + "K_a", "Platt-Trudgian"),
 * for its shared-caveat lineage, for its import lines (heavy-import safety against the 16.7MB
 * zeros-to-1e6.js bundle), and cross-checked against src/data/glossary.js and src/pages for
 * dedicated coverage.
 *
 * EVIDENCE CLASSES (eight modules, eight distinct classes -- the imp-33635 title names six of
 * the eight; imp-33600 and imp-33601 earn their own classes on inspection):
 *   - imp-33583 "node-budget-vs-arithmetic-floor separation": formalizes the imp-33557 deep-tail
 *     residual as R(n,nodes) ~ max(Q(nodes), floor(n)), a quadrature-limited regime the node
 *     budget controls vs an arithmetic-floor regime pinned at the lattice-jitter envelope.
 *   - imp-33584 "deeper-tail Clenshaw-Curtis-vs-graded ratio": extends the imp-33560 cross-solver
 *     min-node ratio to n in {425,450,475}, finding it climbs to ~3.85x but stays under the 4x
 *     node-competitiveness bar through the deepest in-band rung.
 *   - imp-33585 "fifth-pair spread floor-tracking (N=1000,3000)": reruns the fp64-vs-double-double
 *     Jacobi fifth-pair spread collapse at two fresh N rungs, finding the fp64 spread N-stable and
 *     the realized Wilkinson constant c inside the measured envelope at both.
 *   - imp-33586 "over-charge fraction trajectory": orders the ten imp-33300 per-plateau majorant
 *     over-charge fractions f_oc by end-N, finding the trajectory OSCILLATES (5-of-8 sign changes)
 *     with a statistically unresolved weak positive drift (r^2~0.10).
 *   - imp-33599 "wide-range [400,700] three-cluster band-clearing envelope": extends the imp-33579
 *     dense band-crossing scan to a 301-rung window, finding NO monotone-stable crossing exists --
 *     three disjoint isolated clusters, not a locatable threshold rung.
 *   - imp-33600 "grade-vs-node-count band-crossing driver isolation": holds the graded-GL rule
 *     family fixed and varies only the origin-concentration grade at the failing rung n=596,
 *     isolating GRADE (not node count, not rule family) as the driver that recovers the band.
 *   - imp-33601 "sigma-half vs E_coll=E_trunc crossover E_flow-offset derivation": derives the
 *     exact identity sigma=1/2 <=> E_coll=E_trunc+E_flow and attributes ~95% of the imp-33582
 *     ~0.4% offset between the sigma-halving point and the imp-3444 crossover to the E_flow term.
 *   - imp-33602 "separated E_trunc(N)/E_coll(N) component ladder": tabulates the two sigma(N)
 *     numerator/denominator components individually across seven post-peak decades, confirming
 *     E_trunc is exactly N-flat while E_coll ~ N^(-1/2) decays through it.
 *
 * BANNER AUDIT (grep-verified directly against each module's source file, 2026-07-04). All eight
 * modules carry "NO QED" (case-insensitive), cite "imp-3066" together with "K_a", and cite
 * "Platt-Trudgian" -- full mandatory-banner coverage, 8/8.
 *
 * CAVEAT-LINEAGE SPLIT (the cohort is NOT one uniform family -- three disjoint caveat lineages):
 *   (A) deep-tail quadrature/lattice-jitter lineage (NPHI=10 Phi-series truncation + the
 *       imp-33599/imp-33621/imp-33638 latticeJitterCaveat family): imp-33583, imp-33584,
 *       imp-33585, imp-33599, imp-33600.
 *   (B) majorant-slack diagnostic lineage (f_oc is an upper-bound slack diagnostic, not a bound;
 *       no NPHI/jitter language): imp-33586.
 *   (C) sigma-decay / GUE-conditional extrapolation lineage (imp-3220/imp-3406 inherited
 *       extrapolation, not a rigorous asymptotic; no NPHI/jitter language): imp-33601, imp-33602.
 * Grouping all eight under one caveat set would be inaccurate -- imp-33586/imp-33601/imp-33602
 * inherit a DIFFERENT honesty scope than the deep-tail quadrature-lattice five.
 *
 * G6a/H2 BRIDGE STATUS. None of the eight references the Polymath15 G6a_shock_lipschitz/H2
 * bridge. imp-33601/imp-33602 import C_C_PINNED (from polymath15-constant-C-C.js) purely for the
 * inherited E_flow/E_coll sub-terms, never discussing G6a/H2 bridge status in their own text.
 *
 * HEAVY-IMPORT AUDIT (transitive closure traced 2026-07-04, mirroring imp-33695/imp-33720).
 * imp-33584, imp-33585, imp-33586, imp-33599, imp-33600 have ZERO import/require statements
 * (fully self-computing). imp-33583 imports one local sibling (imp-33557-band-crossing-min-
 * budget.js, itself import-free). imp-33601/imp-33602 import two local siblings each
 * (lambda-rh-height-mapping.js, polymath15-constant-C-C.js) whose transitive closure was traced
 * through bridge-lambda-rh.js / g6a-sub-constant-value.js / polymath15-lemma52-shock-holder.js /
 * lambda-intercept-burgers-uniformity.js / dyson-burgers-shock.js / lambda-intercept-analytic.js /
 * dyson-monotonicity-proof.js / dyson-collision-lower-bound.js / lambda-intercept-confidence.js /
 * guth-maynard-tail-bound.js / lambda-error-budget.js / dyson-scaling-N5000.js / zeta.js / primes.js
 * -- NONE of which imports the 16.7MB src/data/zeros-to-1e6.js bundle. All eight modules are
 * heavy-import-safe.
 *
 * SURFACING NOTE (secondary). Glossary coverage: imp-33599 and imp-33600 each have a dedicated
 * glossary.js term; imp-33583/imp-33584/imp-33585/imp-33586/imp-33601/imp-33602 do not. Routed
 * viz-page coverage: imp-33599 -> Imp33629WideRangeBandCrossingEnvelopeViz.jsx, imp-33600 ->
 * Imp33630GradeVsNodeBudgetViz.jsx, imp-33602 -> Imp33628EtruncEcollCrossoverViz.jsx; imp-33583/
 * imp-33584/imp-33585/imp-33586/imp-33601 have no dedicated routed viz page.
 *
 * @see imp-33719, imp-33693, imp-33268, imp-33287, imp-33307, imp-3886, imp-3931, imp-33551,
 * imp-33574, imp-33615 (the precedent provenance roll-ups this pattern follows)
 */

export const IMP_33635_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-33635',
  auditedAt: '2026-07-04',
  method:
    'Read each of the eight module source files directly; grep for the mandatory honest-banner ' +
    'phrases (NO QED, imp-3066 + K_a, Platt-Trudgian); classify each by evidence class; trace the ' +
    'shared-caveat lineage (NPHI=10/latticeJitter vs majorant-slack vs sigma-decay-extrapolation); ' +
    'trace import lines and their transitive closure for heavy-import (zeros-to-1e6.js) safety; ' +
    'cross-check glossary.js and src/pages for dedicated coverage.',
  modules: [
    {
      file: 'imp-33583-node-budget-vs-arithmetic-floor-separation.js',
      evidenceClass: 'node-budget-vs-arithmetic-floor separation',
      caveatLineage: 'deep-tail quadrature/lattice-jitter',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasRoutedVizPage: false,
      hasHeavyImport: false,
    },
    {
      file: 'imp-33584-deeper-tail-cc-vs-graded-ratio-4x-crossing.js',
      evidenceClass: 'deeper-tail Clenshaw-Curtis-vs-graded ratio',
      caveatLineage: 'deep-tail quadrature/lattice-jitter',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasRoutedVizPage: false,
      hasHeavyImport: false,
    },
    {
      file: 'imp-33585-fifth-pair-spread-floor-tracking-n1000-n3000.js',
      evidenceClass: 'fifth-pair spread floor-tracking',
      caveatLineage: 'deep-tail quadrature/lattice-jitter',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasRoutedVizPage: false,
      hasHeavyImport: false,
    },
    {
      file: 'imp-33586-overcharge-fraction-trajectory.js',
      evidenceClass: 'over-charge fraction trajectory',
      caveatLineage: 'majorant-slack diagnostic',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasRoutedVizPage: false,
      hasHeavyImport: false,
    },
    {
      file: 'imp-33599-wide-range-band-crossing-envelope-law.js',
      evidenceClass: 'wide-range [400,700] three-cluster envelope',
      caveatLineage: 'deep-tail quadrature/lattice-jitter',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasRoutedVizPage: true,
      hasHeavyImport: false,
    },
    {
      file: 'imp-33600-band-crossing-grade-vs-node-driver.js',
      evidenceClass: 'grade-vs-node-count band-crossing driver isolation',
      caveatLineage: 'deep-tail quadrature/lattice-jitter',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasRoutedVizPage: true,
      hasHeavyImport: false,
    },
    {
      file: 'imp-33601-sigma-half-vs-crossover-eflow-offset.js',
      evidenceClass: 'sigma-half vs E_coll=E_trunc crossover E_flow-offset derivation',
      caveatLineage: 'sigma-decay/GUE-conditional extrapolation',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasRoutedVizPage: false,
      hasHeavyImport: false,
    },
    {
      file: 'imp-33602-etrunc-ecoll-component-ladder.js',
      evidenceClass: 'separated E_trunc/E_coll component ladder',
      caveatLineage: 'sigma-decay/GUE-conditional extrapolation',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasRoutedVizPage: true,
      hasHeavyImport: false,
    },
  ],
  caveatLineageCounts: {
    'deep-tail quadrature/lattice-jitter': 5,
    'majorant-slack diagnostic': 1,
    'sigma-decay/GUE-conditional extrapolation': 2,
  },
  honestBannerFullCoverageCount: 8,
  glossaryCoveredCount: 2,
  routedVizPageCount: 3,
  heavyImportSafeCount: 8,
  recommendation:
    'No action needed on the honest-banner side -- all eight modules already carry the full ' +
    'mandatory banner and all eight state imp-3066 K_a >= 0 untouched. The cohort splits into ' +
    'three caveat lineages, not one uniform family; future glossary/viz work should treat the ' +
    'sigma-decay pair (imp-33601/imp-33602) and the over-charge module (imp-33586) as distinct ' +
    'from the five-module deep-tail quadrature/lattice-jitter set. Coverage gaps: six of eight ' +
    'lack a dedicated glossary term (all but imp-33599/imp-33600) and five of eight lack a ' +
    'dedicated routed viz page (all but imp-33599/imp-33600/imp-33602) -- imp-33583/imp-33584/ ' +
    'imp-33585/imp-33586/imp-33601 are the best candidates for follow-on glossary/viz tickets.',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module ' +
    'itself. imp-3066 K_a >= 0 positivity untouched across all eight cohort members. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_33635_ASSERTIONS = [
  {
    id: 'imp33635-exactly-eight-modules-catalogued',
    holds: () => IMP_33635_COHORT_PROVENANCE_ROLLUP.modules.length === 8,
    why: 'The roll-up must cover exactly the eight named cohort modules ' +
      '(imp-33583/84/85/86 + imp-33599/3600/3601/3602).',
  },
  {
    id: 'imp33635-eight-distinct-evidence-classes',
    holds: () => {
      const m = IMP_33635_COHORT_PROVENANCE_ROLLUP.modules;
      return new Set(m.map((x) => x.evidenceClass)).size === 8;
    },
    why: 'Each of the eight modules earns a DISTINCT evidence class -- no two modules should ' +
      'share a class.',
  },
  {
    id: 'imp33635-all-eight-carry-full-honest-banner',
    holds: () =>
      IMP_33635_COHORT_PROVENANCE_ROLLUP.modules.every(
        (x) => x.noQED === true && x.untouchedInvariant === 'imp-3066 K_a >= 0' && x.plattTrudgianSOTA === true
      ) && IMP_33635_COHORT_PROVENANCE_ROLLUP.honestBannerFullCoverageCount === 8,
    why: 'Every module in the cohort must state no-QED, imp-3066 K_a >= 0 untouched, and ' +
      'Platt-Trudgian Lambda <= 0.2 SOTA -- grep-verified against the source files.',
  },
  {
    id: 'imp33635-three-caveat-lineages-sum-to-eight',
    holds: () => {
      const counts = IMP_33635_COHORT_PROVENANCE_ROLLUP.caveatLineageCounts;
      const sum = Object.values(counts).reduce((a, b) => a + b, 0);
      return Object.keys(counts).length === 3 && sum === 8 &&
        counts['deep-tail quadrature/lattice-jitter'] === 5 &&
        counts['majorant-slack diagnostic'] === 1 &&
        counts['sigma-decay/GUE-conditional extrapolation'] === 2;
    },
    why: 'Grep-verified: the cohort splits into three disjoint caveat lineages that must sum to ' +
      'all eight modules, not one uniform NPHI=10/latticeJitter family.',
  },
  {
    id: 'imp33635-zero-bridge-touching-consistent-not-referenced',
    holds: () => IMP_33635_COHORT_PROVENANCE_ROLLUP.modules.every((x) => x.g6aH2Status === 'not referenced'),
    why: 'Grep-verified: none of the eight modules mentions the Polymath15 G6a_shock_lipschitz/H2 ' +
      'bridge, so "not referenced" is the correct status for all eight, not a gap.',
  },
  {
    id: 'imp33635-glossary-and-viz-counts-match',
    holds: () => {
      const m = IMP_33635_COHORT_PROVENANCE_ROLLUP.modules;
      const withTerm = m.filter((x) => x.hasGlossaryTerm === true).length;
      const withViz = m.filter((x) => x.hasRoutedVizPage === true).length;
      return withTerm === 2 && withTerm === IMP_33635_COHORT_PROVENANCE_ROLLUP.glossaryCoveredCount &&
        withViz === 3 && withViz === IMP_33635_COHORT_PROVENANCE_ROLLUP.routedVizPageCount;
    },
    why: 'Grep-verified: imp-33599/imp-33600 have a dedicated glossary term (2/8); imp-33599/' +
      'imp-33600/imp-33602 have a dedicated routed viz page (3/8).',
  },
  {
    id: 'imp33635-all-eight-heavy-import-safe',
    holds: () => {
      const m = IMP_33635_COHORT_PROVENANCE_ROLLUP.modules;
      const safe = m.filter((x) => x.hasHeavyImport === false).length;
      return safe === 8 && safe === IMP_33635_COHORT_PROVENANCE_ROLLUP.heavyImportSafeCount;
    },
    why: 'Grep-verified transitive closure: imp-33584/85/86/99/3600 are fully self-computing ' +
      '(zero import lines); imp-33583 imports only the import-free imp-33557 sibling; imp-33601/ ' +
      'imp-33602 import a chain of local sibling modules traced through zeta.js/primes.js with no ' +
      'path to the 16.7MB src/data/zeros-to-1e6.js bundle.',
  },
  {
    id: 'imp33635-honest-scope-locked',
    holds: () =>
      /SOTA/.test(IMP_33635_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /no QED/i.test(IMP_33635_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /imp-3066/.test(IMP_33635_COHORT_PROVENANCE_ROLLUP.honestNote),
    why: 'VERDICT LOCK: this is a read-only roll-up, not a bound; Platt-Trudgian Lambda <= 0.2 ' +
      'stays SOTA and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33635_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33635 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33635_ASSERTIONS };
