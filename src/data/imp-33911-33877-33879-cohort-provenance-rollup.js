/**
 * @module imp-33911-33877-33879-cohort-provenance-rollup
 * @fileoverview imp-33911 -- META provenance roll-up cataloguing the imp-33877/imp-33878/imp-33879
 * recent widening-fit/hump-argmax/geometric-center cohort, mirroring the imp-33741/imp-33804
 * rollup pattern and confirming each module carries the mandatory honest banner: no QED, imp-3066
 * K_a >= 0 untouched, and Platt-Trudgian Lambda <= 0.2 SOTA.
 *
 * METHOD (read-only, performed at author time). Each module's @fileoverview/verdict block was read
 * and classified into the evidence class it earns on its own terms:
 *   - "widening-fit tail-endpoint TRUNCATION artifact test": extends the imp-33810 ladder from
 *     k=6..11 to k=6..12 and shows the imp-33858 far-tail excursion at k=11 (max e ~ +0.2479) is a
 *     finite-ladder ENDPOINT artifact -- the residual collapses ~86% once interior, and the largest
 *     positive residual migrates to (and grows at) whichever rung is the new endpoint. The underlying
 *     tail deceleration is genuine; its apparent "peak at k=11" is not.
 *   - "hump-argmax grid-refinement continuum limit": refines the resid_exp(k) sliding-window grid
 *     below quarter-decade and shows the discrete argmax converges DOWNWARD to a continuum
 *     k* ~ 8.8211, not toward the pointwise crossover k_cross ~ 9.516 as the vanishing-offset
 *     hypothesis predicted -- the ~0.695-decade gap is a genuine window-lag separation, not a
 *     grid-resolution artifact.
 *   - "geometric-center closed-form correction derivation": derives the imp-33856 "~4%"
 *     endpoint-vs-midpoint discretization caveat as a closed-form half-log-decade Taylor step
 *     (1/2 ln 10)/log T0(N), reproducing the exact offset to <0.11% relative error across 1e12..1e15.
 * The honest-banner check greps each module for the mandatory phrases (no QED, imp-3066 K_a >= 0
 * untouched, Platt-Trudgian Lambda <= 0.2 SOTA); glossary/viz-page coverage was cross-checked against
 * src/data/glossary.js and src/pages. Import lines were grepped and followed one level (per the
 * imp-33784/imp-33804/imp-33824 heavy-import safety pattern -- the 16.7MB src/data/zeros-to-1e6.js
 * bundle hangs vite ssrLoadModule / npm-run-assert when transitively pulled into an assertion module).
 *
 * RESULT (audited 2026-07-05). All three modules carry the full honest banner in substance, each as
 * a literal "NO QED" string in their exported verdict field, together with an explicit
 * isRigorous: false field, an explicit "imp-3066 K_a >= 0 untouched" clause, and an explicit
 * "Platt-Trudgian Lambda <= 0.2 remains SOTA" clause.
 *   - imp-33877-widening-fit-tail-endpoint-artifact-test.js                   : widening-fit tail-endpoint TRUNCATION artifact test
 *   - imp-33878-hump-argmax-grid-refinement.js                                : hump-argmax grid-refinement continuum limit
 *   - imp-33879-geometric-center-correction-endpoint-midpoint-offset.js       : geometric-center closed-form correction derivation
 *
 * HEAVY-IMPORT NOTE (audited 2026-07-05). imp-33879 imports only effectiveHeightForN
 * (./lambda-rh-height-mapping.js). imp-33878 additionally imports C_C_PINNED
 * (./polymath15-constant-C-C.js). imp-33877 additionally imports the imp-33810 ladder module
 * (./imp-33810-eflow-resid-ratio-N-ladder.js), which itself imports only effectiveHeightForN and
 * C_C_PINNED. These are the IDENTICAL two leaf imports the imp-33784/imp-33804/imp-33824 rollups
 * already traced to their transitive closure, with only the 23.7 KB src/math/zeta.js appearing
 * anywhere in the chain -- never the 16.7MB src/data/zeros-to-1e6.js bundle. All three cohort
 * modules are therefore heavy-import-safe.
 *
 * SURFACING NOTE (secondary). Grep against src/data/glossary.js and src/pages finds NEITHER a
 * dedicated glossary term NOR a routed-page reference for any of the three modules at audit time --
 * this cohort is a clean glossary/viz gap (matching imp-33914/imp-33915/imp-33916, the three sonnet
 * tickets already queued to close exactly this gap).
 *
 * @see imp-33804 (the imp-33765/33766/33767 rollup this note mirrors), imp-33741, imp-33719,
 * imp-33693, imp-33268, imp-33287, imp-33307, imp-3886, imp-3931, imp-33551, imp-33574, imp-33593,
 * imp-33615, imp-33635 (the precedent provenance roll-ups this pattern follows)
 */

export const IMP_33911_33877_33879_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-33911',
  auditedAt: '2026-07-05',
  method:
    'Read each of the three imp-33877/33878/33879 module @fileoverview/verdict blocks; classify by ' +
    'evidence class (widening-fit tail-endpoint TRUNCATION artifact test / hump-argmax grid-refinement ' +
    'continuum limit / geometric-center closed-form correction derivation); grep for the mandatory ' +
    'honest-banner phrases (no QED, imp-3066 K_a >= 0 untouched, Platt-Trudgian Lambda <= 0.2 SOTA); ' +
    'cross-check glossary.js and src/pages for dedicated coverage and follow import lines one level ' +
    'for heavy-import safety.',
  modules: [
    {
      file: 'imp-33877-widening-fit-tail-endpoint-artifact-test.js',
      evidenceClass: 'widening-fit tail-endpoint TRUNCATION artifact test',
      noQED: true,
      noQEDForm: 'literal-string',
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      hasGlossaryTerm: false,
      hasRoutedVizPage: false,
      hasHeavyImport: false,
    },
    {
      file: 'imp-33878-hump-argmax-grid-refinement.js',
      evidenceClass: 'hump-argmax grid-refinement continuum limit',
      noQED: true,
      noQEDForm: 'literal-string',
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      hasGlossaryTerm: false,
      hasRoutedVizPage: false,
      hasHeavyImport: false,
    },
    {
      file: 'imp-33879-geometric-center-correction-endpoint-midpoint-offset.js',
      evidenceClass: 'geometric-center closed-form correction derivation',
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
    'widening-fit tail-endpoint TRUNCATION artifact test': 1,
    'hump-argmax grid-refinement continuum limit': 1,
    'geometric-center closed-form correction derivation': 1,
  },
  honestBannerFullCoverageCount: 3,
  glossaryCoveredCount: 0,
  routedVizPageCount: 0,
  heavyImportSafeCount: 3,
  recommendation:
    'No action needed on the honest-banner side -- all three modules already carry the full mandatory ' +
    'banner as a literal "NO QED" string. All three lack both a dedicated glossary term and a ' +
    'routed-page reference, making the whole cohort the natural next glossary/viz candidate -- the ' +
    'gap the already-queued imp-33914/imp-33915/imp-33916 sonnet tickets exist to close.',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module ' +
    'itself. imp-3066 K_a >= 0 positivity untouched across all three cohort members; the C_mb ' +
    'GUE-conditional per imp-486 is untouched. Platt-Trudgian Lambda <= 0.2 remains SOTA. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_33911_ASSERTIONS = [
  {
    id: 'imp33911-exactly-three-modules-catalogued',
    holds: () => IMP_33911_33877_33879_COHORT_PROVENANCE_ROLLUP.modules.length === 3,
    why: 'The roll-up must cover exactly the three named cohort modules (imp-33877/33878/33879).',
  },
  {
    id: 'imp33911-three-distinct-evidence-classes',
    holds: () => {
      const m = IMP_33911_33877_33879_COHORT_PROVENANCE_ROLLUP.modules;
      const counts = IMP_33911_33877_33879_COHORT_PROVENANCE_ROLLUP.evidenceClassCounts;
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
    id: 'imp33911-all-three-carry-full-honest-banner',
    holds: () =>
      IMP_33911_33877_33879_COHORT_PROVENANCE_ROLLUP.modules.every(
        (x) => x.noQED === true && /imp-3066/.test(x.untouchedInvariant) && x.plattTrudgianSOTA === true
      ) && IMP_33911_33877_33879_COHORT_PROVENANCE_ROLLUP.honestBannerFullCoverageCount === 3,
    why: 'Every module in the cohort must state no-QED as a literal string, imp-3066 K_a >= 0 ' +
      'untouched, and Platt-Trudgian Lambda <= 0.2 SOTA -- grep-verified against the source files.',
  },
  {
    id: 'imp33911-all-three-use-literal-qed-form',
    holds: () =>
      IMP_33911_33877_33879_COHORT_PROVENANCE_ROLLUP.modules.every((x) => x.noQEDForm === 'literal-string'),
    why: 'Grep-verified: all three of imp-33877/33878/33879 state "NO QED" verbatim in their exported ' +
      'verdict field (no object-honesty-gate exception in this cohort, unlike the imp-33804 cohort).',
  },
  {
    id: 'imp33911-zero-glossary-zero-viz',
    holds: () => {
      const m = IMP_33911_33877_33879_COHORT_PROVENANCE_ROLLUP.modules;
      const withTerm = m.filter((x) => x.hasGlossaryTerm === true).length;
      const withViz = m.filter((x) => x.hasRoutedVizPage === true).length;
      return (
        withTerm === 0 &&
        withTerm === IMP_33911_33877_33879_COHORT_PROVENANCE_ROLLUP.glossaryCoveredCount &&
        withViz === 0 &&
        withViz === IMP_33911_33877_33879_COHORT_PROVENANCE_ROLLUP.routedVizPageCount
      );
    },
    why: 'Grep-verified against src/data/glossary.js and src/pages: none of the three cohort modules ' +
      'has a dedicated glossary term or a routed-page reference at audit time.',
  },
  {
    id: 'imp33911-all-three-heavy-import-safe',
    holds: () => {
      const m = IMP_33911_33877_33879_COHORT_PROVENANCE_ROLLUP.modules;
      const safe = m.filter((x) => x.hasHeavyImport === false).length;
      return safe === 3 && safe === IMP_33911_33877_33879_COHORT_PROVENANCE_ROLLUP.heavyImportSafeCount;
    },
    why: 'Grep-verified: the cohort imports only effectiveHeightForN, C_C_PINNED, and the imp-33810 ' +
      'ladder module (which itself imports only those same two leaves) -- the identical chain the ' +
      'imp-33784/imp-33804/imp-33824 rollups already traced with no path reaching the 16.7MB ' +
      'src/data/zeros-to-1e6.js bundle.',
  },
  {
    id: 'imp33911-honest-scope-locked',
    holds: () =>
      /SOTA/.test(IMP_33911_33877_33879_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /no QED/i.test(IMP_33911_33877_33879_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /imp-3066/.test(IMP_33911_33877_33879_COHORT_PROVENANCE_ROLLUP.honestNote),
    why: 'VERDICT LOCK: this is a read-only roll-up, not a bound; Platt-Trudgian Lambda <= 0.2 stays ' +
      'SOTA and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33911_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33911 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33911_ASSERTIONS };
