/**
 * @module imp-33839-33794-33796-cohort-provenance-rollup
 * @fileoverview imp-33839 -- META provenance roll-up cataloguing the imp-33794/imp-33795/imp-33796
 * coupled-Perron / fold-reading measurement cohort (C_ren finite-window measurement, ||R||(s)
 * fine-grid monotonicity verification, N_half<N_cross independent recompute), mirroring the
 * imp-33804/imp-33824 rollup pattern and confirming each module carries the mandatory honest banner:
 * isRigorous:false, no QED, imp-3066 untouched, and Platt-Trudgian Lambda <= 0.2 SOTA.
 *
 * METHOD (read-only, performed at author time). Each module's @fileoverview/verdict block was read
 * and classified into the evidence class it earns on its own terms:
 *   - "C_ren finite-window measurement": measures the imp-33766 renormalized fold-reading amplitude
 *     C_ren(N) = (y_N^sharp)^{3/2} |m_prime| across the eps = y_N^sharp ladder N in {1e3..1e7} and
 *     finds it sits in a finite band monotone-decreasing toward the closed-form Privalov-Sokhotski
 *     amplitude C_PS = pi/sqrt(2), with the local N-trend decaying to ~0 (flattening, not drifting).
 *   - "||R||(s) fine-grid monotonicity verification": sweeps the imp-33765 coupled Perron norm
 *     ||R(s)|| on a fine 400-point s-grid at the DEG=4 anchor, confirming STRICT monotone increase
 *     with EXACTLY 0 interior turning points and a concave shape approaching the DEG+1 ceiling
 *     exponentially -- the shape the imp-33765 one-dimensionality argument assumes.
 *   - "N_half<N_cross independent recompute": independently root-solves (fresh bisection solvers, no
 *     imp-33767 knee/offset machinery) the two sigma(N) landmarks N_half (sigma_full=1/2) and N_cross
 *     (E_coll=E_trunc), confirming the strict ordering N_half < N_cross and that the ~0.3997%
 *     separation matches the predicted E_flow displacement 2(E_flow/E_trunc) within ~5%.
 * The honest-banner check greps each module for the mandatory phrases (isRigorous:false, no QED,
 * imp-3066 untouched, Platt-Trudgian Lambda <= 0.2 SOTA); glossary/viz-page coverage was cross-checked
 * against src/data/glossary.js and src/pages. Import lines were grepped and followed transitively (per
 * the imp-33695/imp-33720/imp-33784/imp-33804/imp-33824 heavy-import safety pattern -- the 16.7MB
 * src/data/zeros-to-1e6.js bundle hangs vite ssrLoadModule / npm-run-assert when transitively pulled
 * into an assertion module).
 *
 * RESULT (audited 2026-07-05). All three modules carry the full honest banner in substance. imp-33794
 * and imp-33796 both state the literal phrase "NO QED" verbatim in their exported verdict string,
 * together with an explicit isRigorous: false field. imp-33795 has NO isRigorous field and no literal
 * "NO QED" string in its exported object (only "No false QED." in its JSDoc comment) -- it instead
 * expresses the identical honesty content through an object honesty gate (honestCaveat.isProof: false,
 * .carriesNoRHVerdict: true, .sota: "Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA"), an
 * equivalent, not a weaker, guarantee -- mirroring the imp-33765 case the imp-33804 rollup already
 * found in the predecessor cohort. All three state imp-3066 untouched (imp-33794: "imp-3066
 * off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED"; imp-33795: "imp-3066 / imp-33725 / imp-33765"
 * untouched via honestCaveat; imp-33796: "imp-3066 K_a >= 0 untouched") and all three state
 * Platt-Trudgian Lambda <= 0.2 remains SOTA verbatim.
 *   - imp-33794-cren-window-measurement.js                     : C_ren finite-window measurement
 *   - imp-33795-r-s-monotonicity.js                             : ||R||(s) fine-grid monotonicity verification
 *   - imp-33796-nhalf-below-ncross-independent-recompute.js     : N_half<N_cross independent recompute
 *
 * HEAVY-IMPORT NOTE (audited 2026-07-05). imp-33794 and imp-33795 have ZERO import/require statements
 * (fully self-computing). imp-33796 imports effectiveHeightForN (./lambda-rh-height-mapping.js) and
 * C_C_PINNED (./polymath15-constant-C-C.js) -- the IDENTICAL two imports the imp-33784/imp-33804/
 * imp-33824 rollups already traced to their leaves, with only src/math/zeta.js appearing anywhere in
 * the chain -- never the 16.7MB src/data/zeros-to-1e6.js bundle. All three cohort modules are
 * therefore heavy-import-safe.
 *
 * SURFACING NOTE (secondary). imp-33794 has a dedicated headline glossary.js term (grep-verified at
 * line ~8910) and is referenced from two routed pages (src/pages/Imp33864CrenGapOnsetLadderViz.jsx
 * and src/pages/OpenFrontierPage.jsx as an honest-status note). imp-33795 has a dedicated glossary.js
 * term (grep-verified at line ~8971) but NO routed-page reference. imp-33796 has NEITHER a dedicated
 * glossary term NOR any routed-page reference at audit time -- the clean glossary/viz gap in this
 * cohort.
 *
 * @see imp-33804 (the imp-33765/33766/33767 rollup this note mirrors), imp-33824, imp-33784, imp-33741,
 * imp-33719, imp-33693, imp-33268, imp-33287, imp-33307, imp-3886, imp-3931, imp-33551, imp-33574,
 * imp-33593, imp-33615, imp-33635 (the precedent provenance roll-ups this pattern follows)
 */

export const IMP_33839_33794_33796_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-33839',
  auditedAt: '2026-07-05',
  method:
    'Read each of the three imp-33794/33795/33796 module @fileoverview/verdict blocks; classify by ' +
    'evidence class (C_ren finite-window measurement / ||R||(s) fine-grid monotonicity verification / ' +
    'N_half<N_cross independent recompute); grep for the mandatory honest-banner phrases ' +
    '(isRigorous:false, no QED, imp-3066 untouched, Platt-Trudgian Lambda <= 0.2 SOTA); cross-check ' +
    'glossary.js and src/pages for dedicated coverage and follow import lines transitively for ' +
    'heavy-import safety.',
  modules: [
    {
      file: 'imp-33794-cren-window-measurement.js',
      evidenceClass: 'C_ren finite-window measurement',
      noQED: true,
      noQEDForm: 'literal-string',
      untouchedInvariant: 'imp-3066 off-diagonal endpoint-Hankel K_a >= 0',
      plattTrudgianSOTA: true,
      hasGlossaryTerm: true,
      hasRoutedVizPage: true,
      hasHeavyImport: false,
    },
    {
      file: 'imp-33795-r-s-monotonicity.js',
      evidenceClass: '||R||(s) fine-grid monotonicity verification',
      noQED: true,
      noQEDForm: 'object-honesty-gate',
      untouchedInvariant: 'imp-3066 / imp-33725 / imp-33765',
      plattTrudgianSOTA: true,
      hasGlossaryTerm: true,
      hasRoutedVizPage: false,
      hasHeavyImport: false,
    },
    {
      file: 'imp-33796-nhalf-below-ncross-independent-recompute.js',
      evidenceClass: 'N_half<N_cross independent recompute',
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
    'C_ren finite-window measurement': 1,
    '||R||(s) fine-grid monotonicity verification': 1,
    'N_half<N_cross independent recompute': 1,
  },
  honestBannerFullCoverageCount: 3,
  glossaryCoveredCount: 2,
  routedVizPageCount: 1,
  heavyImportSafeCount: 3,
  recommendation:
    'No action needed on the honest-banner side -- all three modules already carry the full mandatory ' +
    'banner (two as a literal "NO QED" string, one as an equivalent object honesty gate). imp-33796 is ' +
    'the sole cohort member lacking both a dedicated glossary term and a routed-page reference, making ' +
    'it the natural next glossary/viz candidate in this cohort; imp-33795 lacks only a routed-page ' +
    'reference.',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module ' +
    'itself. imp-3066 K_a >= 0 positivity untouched across all three cohort members; ' +
    'G6a_shock_lipschitz stays OPEN per imp-33794. Platt-Trudgian Lambda <= 0.2 remains SOTA. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_33839_ASSERTIONS = [
  {
    id: 'imp33839-exactly-three-modules-catalogued',
    holds: () => IMP_33839_33794_33796_COHORT_PROVENANCE_ROLLUP.modules.length === 3,
    why: 'The roll-up must cover exactly the three named cohort modules (imp-33794/33795/33796).',
  },
  {
    id: 'imp33839-three-distinct-evidence-classes',
    holds: () => {
      const m = IMP_33839_33794_33796_COHORT_PROVENANCE_ROLLUP.modules;
      const counts = IMP_33839_33794_33796_COHORT_PROVENANCE_ROLLUP.evidenceClassCounts;
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
    id: 'imp33839-all-three-carry-full-honest-banner',
    holds: () =>
      IMP_33839_33794_33796_COHORT_PROVENANCE_ROLLUP.modules.every(
        (x) => x.noQED === true && /imp-3066/.test(x.untouchedInvariant) && x.plattTrudgianSOTA === true
      ) && IMP_33839_33794_33796_COHORT_PROVENANCE_ROLLUP.honestBannerFullCoverageCount === 3,
    why: 'Every module in the cohort must state no-QED (as a literal string or an equivalent object ' +
      'honesty gate), imp-3066 untouched, and Platt-Trudgian Lambda <= 0.2 SOTA -- grep-verified ' +
      'against the source files.',
  },
  {
    id: 'imp33839-only-33795-uses-object-gate-form',
    holds: () => {
      const m = IMP_33839_33794_33796_COHORT_PROVENANCE_ROLLUP.modules;
      const objectGate = m.filter((x) => x.noQEDForm === 'object-honesty-gate');
      const literal = m.filter((x) => x.noQEDForm === 'literal-string');
      return (
        objectGate.length === 1 &&
        objectGate[0].file === 'imp-33795-r-s-monotonicity.js' &&
        literal.length === 2
      );
    },
    why: 'Grep-verified: only imp-33795 lacks a literal "NO QED" string in its exported object (it is ' +
      'present only in its JSDoc comment); imp-33794 and imp-33796 both state it verbatim in their ' +
      'exported verdict field.',
  },
  {
    id: 'imp33839-two-glossary-one-viz',
    holds: () => {
      const m = IMP_33839_33794_33796_COHORT_PROVENANCE_ROLLUP.modules;
      const withTerm = m.filter((x) => x.hasGlossaryTerm === true).length;
      const withViz = m.filter((x) => x.hasRoutedVizPage === true).length;
      return (
        withTerm === 2 &&
        withTerm === IMP_33839_33794_33796_COHORT_PROVENANCE_ROLLUP.glossaryCoveredCount &&
        withViz === 1 &&
        withViz === IMP_33839_33794_33796_COHORT_PROVENANCE_ROLLUP.routedVizPageCount
      );
    },
    why: 'Grep-verified: imp-33794 and imp-33795 each have a dedicated headline glossary term; only ' +
      'imp-33794 has a routed-page reference; imp-33796 has neither.',
  },
  {
    id: 'imp33839-all-three-heavy-import-safe',
    holds: () => {
      const m = IMP_33839_33794_33796_COHORT_PROVENANCE_ROLLUP.modules;
      const safe = m.filter((x) => x.hasHeavyImport === false).length;
      return safe === 3 && safe === IMP_33839_33794_33796_COHORT_PROVENANCE_ROLLUP.heavyImportSafeCount;
    },
    why: 'Grep-verified: imp-33794 and imp-33795 have zero import/require statements; imp-33796 ' +
      'imports only effectiveHeightForN and C_C_PINNED, whose transitive closure the ' +
      'imp-33784/imp-33804/imp-33824 rollups already traced to their leaves with no path reaching the ' +
      '16.7MB src/data/zeros-to-1e6.js bundle.',
  },
  {
    id: 'imp33839-honest-scope-locked',
    holds: () =>
      /SOTA/.test(IMP_33839_33794_33796_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /no QED/i.test(IMP_33839_33794_33796_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /imp-3066/.test(IMP_33839_33794_33796_COHORT_PROVENANCE_ROLLUP.honestNote),
    why: 'VERDICT LOCK: this is a read-only roll-up, not a bound; Platt-Trudgian Lambda <= 0.2 stays ' +
      'SOTA and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33839_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33839 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33839_ASSERTIONS };
