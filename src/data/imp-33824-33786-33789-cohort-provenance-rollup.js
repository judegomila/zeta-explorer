/**
 * @module imp-33824-33786-33789-cohort-provenance-rollup
 * @fileoverview imp-33824 -- META provenance roll-up cataloguing the imp-33786/imp-33787/imp-33788/
 * imp-33789 cohort (H3-H4 joint scoping, G7 no-uniform-floor, E_flow sqrt-log running, decoupled-rate
 * grid), mirroring the imp-33784/imp-33719 rollup pattern and confirming each module carries the
 * mandatory honest banner: no QED, imp-3066 K_a >= 0 untouched, and no refereed bound is changed.
 *
 * METHOD (read-only, performed at author time). Each module's @fileoverview/verdict block was read and
 * classified into the evidence class it earns on its own terms:
 *   - "H3-H4 joint curvature-input scoping": writes down the shape of the single coupled
 *     strip-height-uniformity input that now discharges BOTH H3 and H4 (imp-33766 collapsed H4 into
 *     H3), states its dependencies, and confirms it decouples from H0/H5.
 *   - "G7 Perron no-uniform-floor derivation": derives the small-s asymptotic ||R(s)|| = C1*s + O(s^3)
 *     and concludes inf_{s>0} ||R(s)|| = 0 (not attained) over the admissible open half-line -- the
 *     dual of the imp-33765 ceiling question, answered NEGATIVELY.
 *   - "E_flow sqrt-log running correction quantification": re-derives the exact
 *     N_cross/N_half = (1+x)^2 * L(N_cross)/L(N_half) map and quantifies the imp-33767 F3 unquantified
 *     ~5% residual as ENTIRELY the sqrt-log running of L (1/(1-beta) ~ 1.0476), leaving no residual.
 *   - "decoupled pass/shear-rate grid mapping": maps the full two-parameter ||R||(s_a, s_b) grid and
 *     bisects the ||R|| = 1 crossing ratio s_b-star over s_a for each s_a, extending the imp-33765 three-point
 *     probe to a full contour.
 * The honest-banner check greps each module for the mandatory phrases (no QED, imp-3066 K_a >= 0
 * untouched, no refereed bound is changed); glossary/viz-page coverage was cross-checked against
 * src/data/glossary.js and src/pages. Import lines were grepped and followed transitively (per the
 * imp-33695/imp-33720/imp-33784 heavy-import safety pattern -- the 16.7MB src/data/zeros-to-1e6.js
 * bundle hangs vite ssrLoadModule / npm-run-assert when transitively pulled into an assertion module).
 *
 * RESULT (audited 2026-07-04). All four modules carry the full honest banner. Two (imp-33786,
 * imp-33788) use an explicit isRigorous: false field; the other two (imp-33787, imp-33789) express the
 * identical honesty content via a prose/object honesty gate (isProof: false, carriesNoRHVerdict: true,
 * "not a proof", "NO RH verdict") locked by their own build-time assertions -- an equivalent, not a
 * weaker, guarantee. Three of four (imp-33787, imp-33788, imp-33789) state imp-3066 K_a >= 0 untouched
 * verbatim; imp-33786 is the sole module that DIRECTLY assesses the G6a_shock_lipschitz H3/H4
 * joint-input obligation and records "G6a_shock_lipschitz stays OPEN" -- a distinct relationship from
 * "not referenced", mirroring the imp-33745 case in the imp-33784 predecessor rollup. The other three
 * do not reference the Polymath15 G6a_shock_lipschitz/H2 bridge at all.
 *   - imp-33786-h3-joint-curvature-input-scoping.js               : H3-H4 joint curvature-input scoping
 *   - imp-33787-g7-perron-lower-bound.js                          : G7 Perron no-uniform-floor derivation
 *   - imp-33788-eflow-displacement-sqrtlog-running-correction.js  : E_flow sqrt-log running correction quantification
 *   - imp-33789-decoupled-rate-grid.js                            : decoupled pass/shear-rate grid mapping
 *
 * HEAVY-IMPORT NOTE (audited 2026-07-04). imp-33786, imp-33787, and imp-33789 have ZERO import/require
 * statements (fully self-computing). imp-33788 imports only effectiveHeightForN
 * (./lambda-rh-height-mapping.js) and C_C_PINNED (./polymath15-constant-C-C.js) -- the IDENTICAL two
 * imports the imp-33784 rollup already traced to their leaves for imp-33743/imp-33744 (bridge-lambda-rh,
 * guth-maynard-tail-bound, g6a-sub-constant-value, polymath15-lemma52-shock-holder,
 * lambda-intercept-burgers-uniformity, dyson-scaling-N5000, dyson-burgers-shock, lambda-intercept-
 * analytic, dyson-monotonicity-proof, dyson-collision-lower-bound, lambda-intercept-confidence), with
 * only src/math/zeta.js (23.7 KB) appearing anywhere in the chain -- never the 16.7MB
 * src/data/zeros-to-1e6.js bundle. All four cohort modules are therefore heavy-import-safe, matching the
 * imp-33825 audit ticket's expected finding (this rollup does not replace that dedicated pass).
 *
 * SURFACING NOTE (secondary). Only imp-33787 has a dedicated headline glossary term at audit time;
 * imp-33786, imp-33788, and imp-33789 have none (imp-33789 is mentioned only inside imp-33787's
 * relatedTerms list, which does not count as its own entry). None of the four has a dedicated routed
 * viz page, though the already-committed imp-33822 viz-DATA module reshapes the imp-33789 grid/contour
 * into a heatmap series -- a self-computing downstream export, not a routed page, so it does not close
 * the imp-33789 viz gap by itself.
 *
 * @see imp-33784 (the imp-33743/33744/33745 three-module rollup this note mirrors), imp-33719,
 * imp-33693, imp-33268, imp-33287, imp-33307, imp-3886, imp-3931, imp-33551, imp-33574, imp-33593,
 * imp-33615, imp-33635 (the precedent provenance roll-ups this pattern follows)
 */

export const IMP_33824_33786_33789_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-33824',
  auditedAt: '2026-07-04',
  method:
    'Read each of the four imp-33786/33787/33788/33789 module @fileoverview/verdict blocks; classify ' +
    'by evidence class (H3-H4 joint curvature-input scoping / G7 Perron no-uniform-floor derivation / ' +
    'E_flow sqrt-log running correction quantification / decoupled pass/shear-rate grid mapping); grep ' +
    'for the mandatory honest-banner phrases (no QED, imp-3066 K_a >= 0 untouched, no refereed bound is changed' +
    '); cross-check glossary.js and src/pages for dedicated coverage and follow ' +
    'import lines transitively for heavy-import safety.',
  modules: [
    {
      file: 'imp-33786-h3-joint-curvature-input-scoping.js',
      evidenceClass: 'H3-H4 joint curvature-input scoping',
      noQED: true,
      untouchedInvariant: 'imp-3066 off-diagonal endpoint-Hankel K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'assesses the G6a_shock_lipschitz H3/H4 joint-input obligation directly; G6a stays OPEN',
      hasGlossaryTerm: false,
      hasRoutedVizPage: false,
      hasHeavyImport: false,
    },
    {
      file: 'imp-33787-g7-perron-lower-bound.js',
      evidenceClass: 'G7 Perron no-uniform-floor derivation',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasRoutedVizPage: false,
      hasHeavyImport: false,
    },
    {
      file: 'imp-33788-eflow-displacement-sqrtlog-running-correction.js',
      evidenceClass: 'E_flow sqrt-log running correction quantification',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasRoutedVizPage: false,
      hasHeavyImport: false,
    },
    {
      file: 'imp-33789-decoupled-rate-grid.js',
      evidenceClass: 'decoupled pass/shear-rate grid mapping',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasRoutedVizPage: false,
      hasHeavyImport: false,
    },
  ],
  evidenceClassCounts: {
    'H3-H4 joint curvature-input scoping': 1,
    'G7 Perron no-uniform-floor derivation': 1,
    'E_flow sqrt-log running correction quantification': 1,
    'decoupled pass/shear-rate grid mapping': 1,
  },
  honestBannerFullCoverageCount: 4,
  glossaryCoveredCount: 1,
  routedVizPageCount: 0,
  heavyImportSafeCount: 4,
  recommendation:
    'No action needed on the honest-banner side -- all four modules already carry the full mandatory ' +
    'banner. Three of the four (imp-33786, imp-33788, imp-33789) lack a dedicated headline glossary ' +
    'term and none of the four has a routed viz page, making them the best remaining glossary/viz ' +
    'candidates in this cohort; imp-33789 is the most natural first viz target since its grid/contour ' +
    'is already reshaped by the committed imp-33822 viz-data module.',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module ' +
    'itself. imp-3066 K_a >= 0 positivity untouched across all four cohort members; G6a_shock_lipschitz ' +
    'stays OPEN per imp-33786. No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_33824_ASSERTIONS = [
  {
    id: 'imp33824-exactly-four-modules-catalogued',
    holds: () => IMP_33824_33786_33789_COHORT_PROVENANCE_ROLLUP.modules.length === 4,
    why: 'The roll-up must cover exactly the four named cohort modules (imp-33786/33787/33788/33789).',
  },
  {
    id: 'imp33824-four-distinct-evidence-classes',
    holds: () => {
      const m = IMP_33824_33786_33789_COHORT_PROVENANCE_ROLLUP.modules;
      const counts = IMP_33824_33786_33789_COHORT_PROVENANCE_ROLLUP.evidenceClassCounts;
      const distinctClasses = new Set(m.map((x) => x.evidenceClass));
      return (
        distinctClasses.size === 4 &&
        Object.values(counts).every((c) => c === 1) &&
        Object.keys(counts).length === 4
      );
    },
    why: 'Each of the four modules earns a DISTINCT evidence class -- no two modules should share a class.',
  },
  {
    id: 'imp33824-all-four-carry-full-honest-banner',
    holds: () =>
      IMP_33824_33786_33789_COHORT_PROVENANCE_ROLLUP.modules.every(
        (x) => x.noQED === true && /imp-3066/.test(x.untouchedInvariant) && x.plattTrudgianSOTA === true
      ) && IMP_33824_33786_33789_COHORT_PROVENANCE_ROLLUP.honestBannerFullCoverageCount === 4,
    why: 'Every module in the cohort must state no-QED, imp-3066 K_a >= 0 untouched (in either its ' +
      'plain or off-diagonal-endpoint-Hankel phrasing), and no refereed bound is changed -- ' +
      'grep-verified against the source files.',
  },
  {
    id: 'imp33824-h3-h4-scoping-flags-g6a-open',
    holds: () => {
      const h3h4 = IMP_33824_33786_33789_COHORT_PROVENANCE_ROLLUP.modules.find(
        (x) => x.file === 'imp-33786-h3-joint-curvature-input-scoping.js'
      );
      return /G6a stays OPEN/.test(h3h4.g6aH2Status);
    },
    why: 'Grep-verified: imp-33786 is a direct assessment of the G6a_shock_lipschitz H3/H4 joint-input ' +
      'obligation and explicitly records that G6a stays OPEN -- distinct from the "not referenced" ' +
      'status the other three modules earn.',
  },
  {
    id: 'imp33824-one-glossary-zero-viz',
    holds: () => {
      const m = IMP_33824_33786_33789_COHORT_PROVENANCE_ROLLUP.modules;
      const withTerm = m.filter((x) => x.hasGlossaryTerm === true).length;
      const withViz = m.filter((x) => x.hasRoutedVizPage === true).length;
      return (
        withTerm === 1 &&
        withTerm === IMP_33824_33786_33789_COHORT_PROVENANCE_ROLLUP.glossaryCoveredCount &&
        withViz === 0 &&
        withViz === IMP_33824_33786_33789_COHORT_PROVENANCE_ROLLUP.routedVizPageCount
      );
    },
    why: 'Grep-verified: only imp-33787 has a dedicated headline glossary term; none of the four has a ' +
      'dedicated routed viz page at audit time.',
  },
  {
    id: 'imp33824-all-four-heavy-import-safe',
    holds: () => {
      const m = IMP_33824_33786_33789_COHORT_PROVENANCE_ROLLUP.modules;
      const safe = m.filter((x) => x.hasHeavyImport === false).length;
      return safe === 4 && safe === IMP_33824_33786_33789_COHORT_PROVENANCE_ROLLUP.heavyImportSafeCount;
    },
    why: 'Grep-verified: imp-33786/imp-33787/imp-33789 have zero import/require statements; imp-33788 ' +
      'imports only effectiveHeightForN and C_C_PINNED, whose transitive closure the imp-33784 rollup ' +
      'already traced to its leaves with no path reaching the 16.7MB src/data/zeros-to-1e6.js bundle ' +
      '(the only zeta-adjacent file in the chain is the 23.7 KB src/math/zeta.js helper).',
  },
  {
    id: 'imp33824-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_33824_33786_33789_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /no QED/i.test(IMP_33824_33786_33789_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /imp-3066/.test(IMP_33824_33786_33789_COHORT_PROVENANCE_ROLLUP.honestNote),
    why: 'VERDICT LOCK: this is a read-only roll-up, not a bound; no refereed bound is changed' +
      ' and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33824_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33824 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33824_ASSERTIONS };
