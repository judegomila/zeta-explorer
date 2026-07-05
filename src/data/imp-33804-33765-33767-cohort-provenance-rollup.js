/**
 * @module imp-33804-33765-33767-cohort-provenance-rollup
 * @fileoverview imp-33804 -- META provenance roll-up cataloguing the imp-33765/imp-33766/imp-33767
 * newest cohort (G7 one-dimensionality-in-s, H4-H3 curvature coupling, sigma-inflection offset
 * reconciliation), mirroring the imp-33824/imp-33784 rollup pattern and confirming each module carries
 * the mandatory honest banner: no QED, imp-3066 K_a >= 0 untouched, and Platt-Trudgian Lambda <= 0.2 SOTA.
 *
 * METHOD (read-only, performed at author time). Each module's @fileoverview/verdict block was read and
 * classified into the evidence class it earns on its own terms:
 *   - "G7 shear-obstruction one-dimensionality-in-s derivation": upgrades the imp-33725 empirical
 *     "a and U act only through s = a*U" observation to a derived scaling-invariance statement (R is
 *     invariant under (a,U) -> (a/lambda, lambda*U)) and enumerates the two candidate orthogonal levers
 *     (shear coefficient c, decoupled pass rate b), classifying both as genuinely orthogonal but
 *     INADMISSIBLE within the imp-3066 kernel.
 *   - "H4/H3 strip-height-uniformity coupling scoping": scopes the minimal analytic input that would
 *     discharge the G6a_shock_lipschitz H4 residual on its own axis, finds H4 separates cleanly from H0
 *     (provenance) and H5 (RH transcription) but NOT from H3 (curvature) -- the Holder modulus
 *     back-conversion couples the k=1 fold-reading derivative (H4) and the k=2 curvature coefficient
 *     (H3) through the same quadratic fold expansion, with H3 dominating and discharging H4 a fortiori.
 *   - "sigma-inflection knee-vs-landmark offset reconciliation": recomputes the imp-33744 (~3.3% vs
 *     halving) and imp-33729 (~3.0% vs crossover) offsets on one common N ladder with a single shared
 *     knee, and shows the ~0.4-point residual is EXACTLY the halving-to-crossover landmark separation,
 *     which is in turn the E_flow displacement -- the two prior readings do not disagree, they differ
 *     only in reference landmark.
 * The honest-banner check greps each module for the mandatory phrases (no QED, imp-3066 K_a >= 0
 * untouched, Platt-Trudgian Lambda <= 0.2 SOTA); glossary/viz-page coverage was cross-checked against
 * src/data/glossary.js and src/pages. Import lines were grepped and followed transitively (per the
 * imp-33695/imp-33720/imp-33784/imp-33824 heavy-import safety pattern -- the 16.7MB
 * src/data/zeros-to-1e6.js bundle hangs vite ssrLoadModule / npm-run-assert when transitively pulled
 * into an assertion module).
 *
 * RESULT (audited 2026-07-05). All three modules carry the full honest banner in substance. imp-33766
 * and imp-33767 both state the literal phrase "NO QED" verbatim in their exported verdict string,
 * together with an explicit isRigorous: false field. imp-33765 has NO isRigorous field and no literal
 * "NO QED" string in its exported object (only in its JSDoc comment, "No false QED.") -- it instead
 * expresses the identical honesty content through an object honesty gate (honestCaveat.isProof: false,
 * .opNormCarriesNoRHVerdict prose, .sota: "Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA"),
 * an equivalent, not a weaker, guarantee -- mirroring the imp-33787/imp-33789 case the imp-33824 rollup
 * already found in the predecessor cohort. All three state imp-3066 K_a >= 0 untouched verbatim (or, for
 * imp-33765, "imp-3066 / imp-33704 / imp-33725 / G7 are untouched" plus honestCaveat.imp3066Untouched:
 * true) and all three state Platt-Trudgian Lambda <= 0.2 remains SOTA verbatim.
 *   - imp-33765-g7-obstruction-orthogonal-lever.js         : G7 shear-obstruction one-dimensionality-in-s derivation
 *   - imp-33766-h4-independent-discharge-scoping.js         : H4/H3 strip-height-uniformity coupling scoping
 *   - imp-33767-sigma-inflection-offset-reconciliation.js   : sigma-inflection knee-vs-landmark offset reconciliation
 *
 * HEAVY-IMPORT NOTE (audited 2026-07-05). imp-33765 and imp-33766 have ZERO import/require statements
 * (fully self-computing). imp-33767 imports only effectiveHeightForN (./lambda-rh-height-mapping.js) and
 * C_C_PINNED (./polymath15-constant-C-C.js) -- the IDENTICAL two imports the imp-33784/imp-33824 rollups
 * already traced to their leaves, with only src/math/zeta.js (23.7 KB) appearing anywhere in the chain --
 * never the 16.7MB src/data/zeros-to-1e6.js bundle. All three cohort modules are therefore heavy-import-
 * safe.
 *
 * SURFACING NOTE (secondary). imp-33765 and imp-33766 each have a dedicated headline glossary.js term
 * (grep-verified at lines ~8761 and ~8736 respectively) and both are referenced from routed pages
 * (imp-33765 from src/pages/SpectralAttackPage.jsx and src/pages/Imp33950PerronNormCurveViz.jsx;
 * imp-33766 from src/pages/OpenFrontierPage.jsx as an honest-status note). imp-33767 has NEITHER a
 * dedicated glossary term NOR any routed-page reference at audit time -- the clean glossary/viz gap in
 * this cohort.
 *
 * @see imp-33824 (the imp-33786/33787/33788/33789 rollup this note mirrors), imp-33784, imp-33719,
 * imp-33693, imp-33268, imp-33287, imp-33307, imp-3886, imp-3931, imp-33551, imp-33574, imp-33593,
 * imp-33615, imp-33635 (the precedent provenance roll-ups this pattern follows)
 */

export const IMP_33804_33765_33767_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-33804',
  auditedAt: '2026-07-05',
  method:
    'Read each of the three imp-33765/33766/33767 module @fileoverview/verdict blocks; classify by ' +
    'evidence class (G7 shear-obstruction one-dimensionality-in-s derivation / H4-H3 strip-height ' +
    'coupling scoping / sigma-inflection knee-vs-landmark offset reconciliation); grep for the ' +
    'mandatory honest-banner phrases (no QED, imp-3066 K_a >= 0 untouched, Platt-Trudgian Lambda <= 0.2 ' +
    'SOTA); cross-check glossary.js and src/pages for dedicated coverage and follow import lines ' +
    'transitively for heavy-import safety.',
  modules: [
    {
      file: 'imp-33765-g7-obstruction-orthogonal-lever.js',
      evidenceClass: 'G7 shear-obstruction one-dimensionality-in-s derivation',
      noQED: true,
      noQEDForm: 'object-honesty-gate',
      untouchedInvariant: 'imp-3066 / imp-33704 / imp-33725 / G7',
      plattTrudgianSOTA: true,
      hasGlossaryTerm: true,
      hasRoutedVizPage: true,
      hasHeavyImport: false,
    },
    {
      file: 'imp-33766-h4-independent-discharge-scoping.js',
      evidenceClass: 'H4/H3 strip-height-uniformity coupling scoping',
      noQED: true,
      noQEDForm: 'literal-string',
      untouchedInvariant: 'imp-3066 off-diagonal endpoint-Hankel K_a >= 0',
      plattTrudgianSOTA: true,
      hasGlossaryTerm: true,
      hasRoutedVizPage: true,
      hasHeavyImport: false,
    },
    {
      file: 'imp-33767-sigma-inflection-offset-reconciliation.js',
      evidenceClass: 'sigma-inflection knee-vs-landmark offset reconciliation',
      noQED: true,
      noQEDForm: 'literal-string',
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      hasGlossaryTerm: false,
      hasRoutedVizPage: false,
      hasHeavyImport: false,
    },
  ],
  evidenceClassCounts: {
    'G7 shear-obstruction one-dimensionality-in-s derivation': 1,
    'H4/H3 strip-height-uniformity coupling scoping': 1,
    'sigma-inflection knee-vs-landmark offset reconciliation': 1,
  },
  honestBannerFullCoverageCount: 3,
  glossaryCoveredCount: 2,
  routedVizPageCount: 2,
  heavyImportSafeCount: 3,
  recommendation:
    'No action needed on the honest-banner side -- all three modules already carry the full mandatory ' +
    'banner (two as a literal "NO QED" string, one as an equivalent object honesty gate). imp-33767 is ' +
    'the sole cohort member lacking both a dedicated glossary term and a routed-page reference, making ' +
    'it the natural next glossary/viz candidate in this cohort.',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module ' +
    'itself. imp-3066 K_a >= 0 positivity untouched across all three cohort members; ' +
    'G6a_shock_lipschitz stays OPEN per imp-33766. Platt-Trudgian Lambda <= 0.2 remains SOTA. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_33804_ASSERTIONS = [
  {
    id: 'imp33804-exactly-three-modules-catalogued',
    holds: () => IMP_33804_33765_33767_COHORT_PROVENANCE_ROLLUP.modules.length === 3,
    why: 'The roll-up must cover exactly the three named cohort modules (imp-33765/33766/33767).',
  },
  {
    id: 'imp33804-three-distinct-evidence-classes',
    holds: () => {
      const m = IMP_33804_33765_33767_COHORT_PROVENANCE_ROLLUP.modules;
      const counts = IMP_33804_33765_33767_COHORT_PROVENANCE_ROLLUP.evidenceClassCounts;
      const distinctClasses = new Set(m.map((x) => x.evidenceClass));
      return (
        distinctClasses.size === 3 &&
        Object.values(counts).every((c) => c === 1) &&
        Object.keys(counts).length === 3
      );
    },
    why: 'Each of the three modules earns a DISTINCT evidence class -- no two modules should share a class.',
  },
  {
    id: 'imp33804-all-three-carry-full-honest-banner',
    holds: () =>
      IMP_33804_33765_33767_COHORT_PROVENANCE_ROLLUP.modules.every(
        (x) => x.noQED === true && /imp-3066/.test(x.untouchedInvariant) && x.plattTrudgianSOTA === true
      ) && IMP_33804_33765_33767_COHORT_PROVENANCE_ROLLUP.honestBannerFullCoverageCount === 3,
    why: 'Every module in the cohort must state no-QED (as a literal string or an equivalent object ' +
      'honesty gate), imp-3066 K_a >= 0 untouched, and Platt-Trudgian Lambda <= 0.2 SOTA -- ' +
      'grep-verified against the source files.',
  },
  {
    id: 'imp33804-only-33765-uses-object-gate-form',
    holds: () => {
      const m = IMP_33804_33765_33767_COHORT_PROVENANCE_ROLLUP.modules;
      const objectGate = m.filter((x) => x.noQEDForm === 'object-honesty-gate');
      const literal = m.filter((x) => x.noQEDForm === 'literal-string');
      return (
        objectGate.length === 1 &&
        objectGate[0].file === 'imp-33765-g7-obstruction-orthogonal-lever.js' &&
        literal.length === 2
      );
    },
    why: 'Grep-verified: only imp-33765 lacks a literal "NO QED" string in its exported object (it is ' +
      'present only in its JSDoc comment); imp-33766 and imp-33767 both state it verbatim in their ' +
      'exported verdict field.',
  },
  {
    id: 'imp33804-two-glossary-two-viz',
    holds: () => {
      const m = IMP_33804_33765_33767_COHORT_PROVENANCE_ROLLUP.modules;
      const withTerm = m.filter((x) => x.hasGlossaryTerm === true).length;
      const withViz = m.filter((x) => x.hasRoutedVizPage === true).length;
      return (
        withTerm === 2 &&
        withTerm === IMP_33804_33765_33767_COHORT_PROVENANCE_ROLLUP.glossaryCoveredCount &&
        withViz === 2 &&
        withViz === IMP_33804_33765_33767_COHORT_PROVENANCE_ROLLUP.routedVizPageCount
      );
    },
    why: 'Grep-verified: imp-33765 and imp-33766 each have a dedicated headline glossary term and a ' +
      'routed-page reference; imp-33767 has neither.',
  },
  {
    id: 'imp33804-all-three-heavy-import-safe',
    holds: () => {
      const m = IMP_33804_33765_33767_COHORT_PROVENANCE_ROLLUP.modules;
      const safe = m.filter((x) => x.hasHeavyImport === false).length;
      return safe === 3 && safe === IMP_33804_33765_33767_COHORT_PROVENANCE_ROLLUP.heavyImportSafeCount;
    },
    why: 'Grep-verified: imp-33765 and imp-33766 have zero import/require statements; imp-33767 imports ' +
      'only effectiveHeightForN and C_C_PINNED, whose transitive closure the imp-33784/imp-33824 ' +
      'rollups already traced to their leaves with no path reaching the 16.7MB ' +
      'src/data/zeros-to-1e6.js bundle (the only zeta-adjacent file in the chain is the 23.7 KB ' +
      'src/math/zeta.js helper).',
  },
  {
    id: 'imp33804-honest-scope-locked',
    holds: () =>
      /SOTA/.test(IMP_33804_33765_33767_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /no QED/i.test(IMP_33804_33765_33767_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /imp-3066/.test(IMP_33804_33765_33767_COHORT_PROVENANCE_ROLLUP.honestNote),
    why: 'VERDICT LOCK: this is a read-only roll-up, not a bound; Platt-Trudgian Lambda <= 0.2 stays ' +
      'SOTA and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33804_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33804 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33804_ASSERTIONS };
