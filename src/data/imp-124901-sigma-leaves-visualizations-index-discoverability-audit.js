/**
 * @module imp-124901-sigma-leaves-visualizations-index-discoverability-audit
 * @fileoverview imp-124901 -- discoverability audit of the recent sigma-diagnostic leaves
 * imp-124846 / imp-124848 / imp-124849 / imp-124850 / imp-124852 against
 * src/data/visualizations-index.js, following the imp-124804 far-frontier-import-light-audit
 * pattern but checking routed-page discoverability instead of bundle hygiene.
 *
 * METHOD. Grep src/data/visualizations-index.js for each of the five ticket ids and record,
 * for each hit, the route and the ticket whose page cites it as `paperSourcePath`.
 *
 * FINDINGS.
 *   1. imp-124848 (interior-peak floor-elasticity fit) IS indexed: route
 *      /viz-imp124881-floor-elasticity-sidebyside (imp-124881 page), overlaying it against
 *      the imp-124772 far-tail knee fit.
 *   2. imp-124849 (extprec ECF floor sigma_crit) IS indexed: route
 *      /viz-imp124882-dps-invariance-ladder (imp-124882 page).
 *   3. imp-124850 (pair-ratio drift-slope fit) IS indexed: route
 *      /viz-imp124880-pairratio-drift-slope-scatter (imp-124880 page).
 *   4. imp-124852 (kernel arm-offset asymmetry) IS indexed: route
 *      /viz-imp124899-kernel-arm-offset-asymmetry (imp-124899 page).
 *   5. imp-124846 (mantissa leading-ratio isolation) has NO visualizations-index entry --
 *      it is a pure literal-data finding module (per imp-124878: zero imports, no page).
 *      It is NOT an orphan leaf: it is reachable via the imp-124900 Concepts/glossary
 *      headword (which @see-cites it by name), via the imp-124877/imp-124878 batch audits,
 *      and via the imp-124894 leading-rate-coefficient residual check. Its sibling
 *      imp-124827 (also a pure per-nine-ladder finding, no viz page) establishes the same
 *      precedent: not every finding module in this diagnostic chain gets a standalone
 *      chart, only the ones a later ticket chooses to visualize.
 *
 * VERDICT. 4 of 5 modules (imp-124848/124849/124850/124852) are indexed with routed pages;
 * the fifth (imp-124846) is intentionally index-free but not an orphan -- it is cross-cited
 * from a glossary headword and two audit modules. No silent orphan found. Read-only
 * discoverability audit; changes no bound; establishes no operator positivity; NO QED;
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-124804-far-frontier-import-light-audit (discoverability-audit method precedent)
 * @see imp-124878-newer-fartail-import-light-audit (companion bundle-hygiene audit of the
 *   same five-module-adjacent batch)
 * @see imp-124900-fartail-per-nine-spacing-law-glossary-headword (cross-cites imp-124846)
 */

const AUDITED_MODULES = Object.freeze([
  'imp-124846-fartail-mantissa-leading-ratio-isolation.js',
  'imp-124848-sigma-interior-peak-floor-elasticity-multifloor-fit.js',
  'imp-124849-extprec-ecf-floor-sigmacrit.js',
  'imp-124850-pairratio-drift-slope-fit.js',
  'imp-124852-kernel-arm-offset-asymmetry-viz-data.js',
]);

const INDEXED_MODULES = Object.freeze({
  'imp-124848-sigma-interior-peak-floor-elasticity-multifloor-fit.js': {
    route: '/viz-imp124881-floor-elasticity-sidebyside',
    pageTicket: 'imp-124881',
  },
  'imp-124849-extprec-ecf-floor-sigmacrit.js': {
    route: '/viz-imp124882-dps-invariance-ladder',
    pageTicket: 'imp-124882',
  },
  'imp-124850-pairratio-drift-slope-fit.js': {
    route: '/viz-imp124880-pairratio-drift-slope-scatter',
    pageTicket: 'imp-124880',
  },
  'imp-124852-kernel-arm-offset-asymmetry-viz-data.js': {
    route: '/viz-imp124899-kernel-arm-offset-asymmetry',
    pageTicket: 'imp-124899',
  },
});

const UNINDEXED_BUT_CROSS_CITED_MODULES = Object.freeze({
  'imp-124846-fartail-mantissa-leading-ratio-isolation.js': {
    citedBy: Object.freeze([
      'imp-124900-fartail-per-nine-spacing-law-glossary-headword.js',
      'imp-124877-124846-124850-honesty-banner-audit.js',
      'imp-124878-newer-fartail-import-light-audit.js',
      'imp-124894-fartail-leading-rate-constant-residual.js',
    ]),
    precedentSibling: 'imp-124827-fartail-per-nine-mantissa-correction-decay.js',
  },
});

export const IMP124901_SIGMA_LEAVES_VIZ_INDEX_DISCOVERABILITY_AUDIT = Object.freeze({
  id: 'imp-124901-sigma-leaves-visualizations-index-discoverability-audit',
  title:
    'Discoverability audit of the sigma-diagnostic leaves imp-124846/848/849/850/852 '
    + 'against visualizations-index.js',
  status:
    'VERIFIED: imp-124848/124849/124850/124852 each have a routed visualizations-index '
    + 'entry; imp-124846 has none but is cross-cited from a glossary headword and two '
    + 'audit modules, matching the no-viz-page precedent already set by imp-124827. No '
    + 'silent orphan leaf found. Read-only discoverability audit; no bound moved; NO QED.',
  source: 'imp-124901',
  precedent: 'imp-124804',

  auditedModules: AUDITED_MODULES,
  indexedModules: INDEXED_MODULES,
  unindexedButCrossCitedModules: UNINDEXED_BUT_CROSS_CITED_MODULES,
});

export const IMP124901_SIGMA_LEAVES_VIZ_INDEX_DISCOVERABILITY_AUDIT_ASSERTIONS = Object.freeze([
  {
    name: 'exactly five modules audited',
    holds: () => IMP124901_SIGMA_LEAVES_VIZ_INDEX_DISCOVERABILITY_AUDIT.auditedModules.length === 5,
  },
  {
    name: 'exactly four modules carry a routed visualizations-index entry',
    holds: () => Object.keys(
      IMP124901_SIGMA_LEAVES_VIZ_INDEX_DISCOVERABILITY_AUDIT.indexedModules,
    ).length === 4,
  },
  {
    name: 'the one unindexed module is cross-cited at least twice (not a silent orphan)',
    holds: () => {
      const entry = IMP124901_SIGMA_LEAVES_VIZ_INDEX_DISCOVERABILITY_AUDIT
        .unindexedButCrossCitedModules['imp-124846-fartail-mantissa-leading-ratio-isolation.js'];
      return !!entry && entry.citedBy.length >= 2;
    },
  },
  {
    name: 'honest: read-only audit, no bound moved, NO QED',
    holds: () => /no bound moved/.test(
      IMP124901_SIGMA_LEAVES_VIZ_INDEX_DISCOVERABILITY_AUDIT.status,
    ) && /NO QED/.test(IMP124901_SIGMA_LEAVES_VIZ_INDEX_DISCOVERABILITY_AUDIT.status),
  },
]);
