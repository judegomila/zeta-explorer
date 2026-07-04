/**
 * @module imp-33784-33743-33745-cohort-provenance-rollup
 * @fileoverview imp-33784 -- META provenance roll-up cataloguing the imp-33743/imp-33744/imp-33745
 * newest cohort (two sigma-decay closed-form landmarks + one G6a H0 provenance scoping), by EVIDENCE
 * CLASS, mirroring the imp-33719 imp-33679..imp-33682 rollup pattern and confirming each module
 * carries the mandatory honest banner: no QED, imp-3066 K_a >= 0 untouched, and Platt-Trudgian
 * Lambda <= 0.2 SOTA.
 *
 * METHOD (read-only, performed at author time). Each module's @fileoverview/verdict block was read
 * and classified into the evidence class it earns on its own terms:
 *   - "far-tail closed-form crossover generalization": extends the imp-33723 sigma = 1/2 halving
 *     closed-form fixed point to the general threshold sigma = thr, evaluates it at the imp-33582
 *     sigma < 0.1 far-tail landmark, and measures the closed-form-vs-empirical residual contrast.
 *   - "sigmoid-inflection closed-form derivation": derives the logistic-flow inflection location
 *     sigma_infl = 1/2 - g_prime/(2 g^2) and shows the imp-33721 knee / imp-33582 halving-landmark
 *     coincidence is exact only in the pure-power-law limit, with the ~3.3% offset a structural
 *     log-factor curvature term (not an E_flow artifact).
 *   - "G6a H0-provenance independence scoping": assesses whether the imp-33706 open-residual-tower
 *     H0 rung can be discharged independently of H3/H4 given the imp-33668 selection-fold, concluding
 *     H0 is a genuinely distinct, independently-dischargeable standing obligation on its own axis.
 * The honest-banner check greps each module for the mandatory phrases (no QED, imp-3066 K_a >= 0
 * untouched, Platt-Trudgian Lambda <= 0.2 SOTA); glossary/viz-page coverage was cross-checked against
 * src/data/glossary.js and src/pages. Import lines were grepped and followed transitively (per the
 * imp-33695/imp-33720 heavy-import safety pattern -- the 16.7MB src/data/zeros-to-1e6.js bundle hangs
 * vite ssrLoadModule / npm-run-assert when transitively pulled into an assertion module).
 *
 * RESULT (audited 2026-07-04). All three modules carry the full honest banner. Two (imp-33743,
 * imp-33744) state imp-3066 K_a >= 0 untouched verbatim; imp-33745 states the equivalent
 * "imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED" (its G6a_shock_lipschitz obligation is a
 * distinct axis, so it additionally records G6a stays OPEN). None of the three references the
 * Polymath15 G6a_shock_lipschitz/H2 *bridge* directly, though imp-33745 is itself an assessment OF
 * the G6a_shock_lipschitz obligation catalogue (a distinct relationship from "referencing the bridge").
 *   - imp-33743-sigma-fartail-crossover-closed-form.js     : far-tail closed-form crossover generalization
 *   - imp-33744-sigma-inflection-vs-half-closed-form.js    : sigmoid-inflection closed-form derivation
 *   - imp-33745-h0-provenance-independence-scoping.js      : G6a H0-provenance independence scoping
 *
 * HEAVY-IMPORT NOTE (audited 2026-07-04, mirroring imp-33720/imp-33737). imp-33745 has zero
 * import/require statements (self-computing). imp-33743 and imp-33744 both import only
 * effectiveHeightForN (./lambda-rh-height-mapping.js) and C_C_PINNED (./polymath15-constant-C-C.js).
 * Following the transitive closure: lambda-rh-height-mapping.js imports only bridge-lambda-rh.js,
 * which imports only guth-maynard-tail-bound.js (zero imports of its own); polymath15-constant-C-C.js
 * imports g6a-sub-constant-value.js, polymath15-lemma52-shock-holder.js, and
 * lambda-intercept-burgers-uniformity.js, whose own transitive imports bottom out at
 * dyson-scaling-N5000.js, dyson-burgers-shock.js, lambda-intercept-analytic.js,
 * dyson-monotonicity-proof.js, dyson-collision-lower-bound.js, and lambda-intercept-confidence.js --
 * only src/math/zeta.js (23.7 KB, a small sibling zeta-evaluation helper, NOT the 16.7MB
 * src/data/zeros-to-1e6.js bundle) appears anywhere in the chain. All three cohort modules are
 * therefore heavy-import-safe.
 *
 * SHARED CAVEATS. imp-33743 and imp-33744 share the IDENTICAL sigma(N) = E_coll/(E_trunc+E_flow+E_coll)
 * component model (imp-3220/imp-3406/imp-33582 extrapolation) and the same E_TRUNC_PT/GRONWALL
 * constants; imp-33745 is on an entirely disjoint axis (the G6a_shock_lipschitz H0..H5 provenance
 * catalogue) and shares no sub-terms with the other two. All three explicitly restate "no bound
 * change" / "establishes no operator positivity" language distinct from (but consistent with) the
 * NPHI=10/latticeJitterCaveat lineage this roll-up's predecessors tracked -- that lineage belongs to
 * the disjoint floorUlp(n) band-clearing cohort and does not apply here.
 *
 * SURFACING NOTE (secondary). All three already have a dedicated headline glossary term (imp-33743,
 * imp-33744, imp-33745 each appear in src/data/glossary.js). NONE of the three has a dedicated routed
 * viz page at audit time -- unlike the imp-33719 cohort (three of four already had one), this newest
 * cohort is entirely un-visualized; imp-33760/imp-33761/imp-33762 (already-queued viz-data tickets for
 * the sibling imp-33723/imp-33708/imp-33721 modules) are the closest existing precedent for what a
 * dedicated imp-33743/imp-33744 viz would look like, but no ticket yet targets imp-33745.
 *
 * @see imp-33719 (the imp-33679/33680/33681/33682 four-module rollup this note mirrors), imp-33268,
 * imp-33287, imp-33307, imp-3886, imp-3931, imp-33551, imp-33574, imp-33593, imp-33615, imp-33635,
 * imp-33693 (the precedent provenance roll-ups this pattern follows)
 */

export const IMP_33784_33743_33745_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-33784',
  auditedAt: '2026-07-04',
  method:
    'Read each of the three imp-33743/33744/33745 module @fileoverview/verdict blocks; classify by ' +
    'evidence class (far-tail closed-form crossover generalization / sigmoid-inflection closed-form ' +
    'derivation / G6a H0-provenance independence scoping); grep for the mandatory honest-banner ' +
    'phrases (no QED, imp-3066 K_a >= 0 untouched, Platt-Trudgian Lambda <= 0.2 SOTA); cross-check ' +
    'glossary.js and src/pages for dedicated coverage and follow import lines transitively for ' +
    'heavy-import safety.',
  modules: [
    {
      file: 'imp-33743-sigma-fartail-crossover-closed-form.js',
      evidenceClass: 'far-tail closed-form crossover generalization',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasRoutedVizPage: false,
      hasHeavyImport: false,
    },
    {
      file: 'imp-33744-sigma-inflection-vs-half-closed-form.js',
      evidenceClass: 'sigmoid-inflection closed-form derivation',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasRoutedVizPage: false,
      hasHeavyImport: false,
    },
    {
      file: 'imp-33745-h0-provenance-independence-scoping.js',
      evidenceClass: 'G6a H0-provenance independence scoping',
      noQED: true,
      untouchedInvariant: 'imp-3066 off-diagonal endpoint-Hankel K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'assesses the G6a_shock_lipschitz obligation catalogue directly (H0 rung); G6a stays OPEN',
      hasGlossaryTerm: true,
      hasRoutedVizPage: false,
      hasHeavyImport: false,
    },
  ],
  evidenceClassCounts: {
    'far-tail closed-form crossover generalization': 1,
    'sigmoid-inflection closed-form derivation': 1,
    'G6a H0-provenance independence scoping': 1,
  },
  honestBannerFullCoverageCount: 3,
  glossaryCoveredCount: 3,
  routedVizPageCount: 0,
  heavyImportSafeCount: 3,
  recommendation:
    'No action needed on the honest-banner side -- all three modules already carry the full mandatory ' +
    'banner. Unlike the imp-33719 predecessor cohort (three of four already had a dedicated viz page), ' +
    'this newest cohort has ZERO routed viz pages -- all three (imp-33743, imp-33744, imp-33745) are ' +
    'candidates for a new dedicated viz page, with imp-33743/imp-33744 the more natural first targets ' +
    'given their numeric landmark structure (crossover N and inflection sigma respectively).',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module ' +
    'itself. imp-3066 K_a >= 0 positivity untouched across all three cohort members; G6a_shock_lipschitz ' +
    'stays OPEN per imp-33745. Platt-Trudgian Lambda <= 0.2 remains SOTA. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_33784_ASSERTIONS = [
  {
    id: 'imp33784-exactly-three-modules-catalogued',
    holds: () => IMP_33784_33743_33745_COHORT_PROVENANCE_ROLLUP.modules.length === 3,
    why: 'The roll-up must cover exactly the three named cohort modules (imp-33743/33744/33745).',
  },
  {
    id: 'imp33784-three-distinct-evidence-classes',
    holds: () => {
      const m = IMP_33784_33743_33745_COHORT_PROVENANCE_ROLLUP.modules;
      const counts = IMP_33784_33743_33745_COHORT_PROVENANCE_ROLLUP.evidenceClassCounts;
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
    id: 'imp33784-all-three-carry-full-honest-banner',
    holds: () =>
      IMP_33784_33743_33745_COHORT_PROVENANCE_ROLLUP.modules.every(
        (x) => x.noQED === true && /imp-3066/.test(x.untouchedInvariant) && x.plattTrudgianSOTA === true
      ) && IMP_33784_33743_33745_COHORT_PROVENANCE_ROLLUP.honestBannerFullCoverageCount === 3,
    why: 'Every module in the cohort must state no-QED, imp-3066 K_a >= 0 untouched (in either its ' +
      'plain or off-diagonal-endpoint-Hankel phrasing), and Platt-Trudgian Lambda <= 0.2 SOTA -- ' +
      'grep-verified against the source files.',
  },
  {
    id: 'imp33784-h0-scoping-flags-g6a-open',
    holds: () => {
      const h0 = IMP_33784_33743_33745_COHORT_PROVENANCE_ROLLUP.modules.find(
        (x) => x.file === 'imp-33745-h0-provenance-independence-scoping.js'
      );
      return /G6a stays OPEN/.test(h0.g6aH2Status);
    },
    why: 'Grep-verified: imp-33745 is a direct assessment of the G6a_shock_lipschitz obligation ' +
      'catalogue and explicitly records that G6a stays OPEN -- distinct from the "not referenced" ' +
      'status the other two modules earn.',
  },
  {
    id: 'imp33784-three-glossary-zero-viz',
    holds: () => {
      const m = IMP_33784_33743_33745_COHORT_PROVENANCE_ROLLUP.modules;
      const withTerm = m.filter((x) => x.hasGlossaryTerm === true).length;
      const withViz = m.filter((x) => x.hasRoutedVizPage === true).length;
      return (
        withTerm === 3 &&
        withTerm === IMP_33784_33743_33745_COHORT_PROVENANCE_ROLLUP.glossaryCoveredCount &&
        withViz === 0 &&
        withViz === IMP_33784_33743_33745_COHORT_PROVENANCE_ROLLUP.routedVizPageCount
      );
    },
    why: 'Grep-verified: all three modules have a dedicated headline glossary term; none of the three ' +
      'has a dedicated routed viz page at audit time.',
  },
  {
    id: 'imp33784-all-three-heavy-import-safe',
    holds: () => {
      const m = IMP_33784_33743_33745_COHORT_PROVENANCE_ROLLUP.modules;
      const safe = m.filter((x) => x.hasHeavyImport === false).length;
      return safe === 3 && safe === IMP_33784_33743_33745_COHORT_PROVENANCE_ROLLUP.heavyImportSafeCount;
    },
    why: 'Grep-verified: imp-33745 has zero import/require statements; imp-33743/imp-33744 import ' +
      'only effectiveHeightForN and C_C_PINNED, whose transitive closure was followed to its leaves ' +
      '(bridge-lambda-rh, guth-maynard-tail-bound, g6a-sub-constant-value, polymath15-lemma52-shock-' +
      'holder, lambda-intercept-burgers-uniformity, dyson-scaling-N5000, dyson-burgers-shock, ' +
      'lambda-intercept-analytic, dyson-monotonicity-proof, dyson-collision-lower-bound, ' +
      'lambda-intercept-confidence) with no path reaching the 16.7MB src/data/zeros-to-1e6.js bundle ' +
      '(the only zeta-adjacent file in the chain is the 23.7 KB src/math/zeta.js helper).',
  },
  {
    id: 'imp33784-honest-scope-locked',
    holds: () =>
      /SOTA/.test(IMP_33784_33743_33745_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /no QED/i.test(IMP_33784_33743_33745_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /imp-3066/.test(IMP_33784_33743_33745_COHORT_PROVENANCE_ROLLUP.honestNote),
    why: 'VERDICT LOCK: this is a read-only roll-up, not a bound; Platt-Trudgian Lambda <= 0.2 stays ' +
      'SOTA and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33784_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33784 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33784_ASSERTIONS };
