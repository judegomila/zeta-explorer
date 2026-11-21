/**
 * @module imp-95284-seam-chain-surfacing-audit-95249-95250-95231-95232-95233
 *
 * imp-95284 (meta): surfacing audit of the seam-chain finding modules
 * imp-95249/95250/95231/95232/95233 for (a) import-lightness (no transitive
 * reach into any heavy multi-MB data bundle such as zeros-to-1e6.js) and
 * (b) reachability from a rendered page or the visualizations index.
 * Extends the imp-34740/34725/34618/34521/34561 caveat-surfacing-audit
 * lineage to the imp-95226+ signed-certificate seam chain.
 *
 * COHORT. Ticket imp-95231 carries TWO source modules (both files are
 * genuine legs of the chain, not a naming collision): the original LEMMA
 * RI / THEOREM COAL-DESC partial (imp-95231-coalescence-ratio-
 * monotonicity.js) and its later closure THEOREM RATE-MONO (imp-95231-
 * rate-monotonicity-closure.js). All six files were grepped for `import`
 * statements: NONE has any -- every module is a standalone literal/
 * self-executing-assertion file, so criterion (a) is satisfied trivially
 * for the whole cohort.
 *
 * METHOD for (b): grepped src/data/visualizations-index.js and every
 * src/pages/*.jsx for each module's filename, then traced any viz-data
 * module found back to its page and confirmed the page is registered in
 * App.jsx (lazy import + <Route element=...>).
 *
 * FINDING: 4 of 6 are SURFACED, 2 are ORPHAN.
 *   - imp-95231-coalescence-ratio-monotonicity.js -> Imp95282CoalLawVsLambda2Viz.jsx
 *   - imp-95232-bl-lat-off-lattice-degradation.js -> Imp95267OffLatticeRobustnessViz.jsx, Imp95268CollarOverpriceViz.jsx
 *   - imp-95233-modulus-phase-currency-feasibility.js -> Imp95266ThetaVsKPhaseCollapseViz.jsx, Imp95279PhaseCertVsNogoCeilingViz.jsx
 *   - imp-95250-leaveoneout-multiblock-split-certificate.js -> Imp95265EvOctFiringCurveViz.jsx
 *   All four are listed in visualizations-index.js, all their driving pages
 *   are registered in App.jsx, and all six driving pages carry an inline
 *   "Honest status" banner.
 *   - imp-95231-rate-monotonicity-closure.js (THEOREM RATE-MONO closure of
 *     the interior-bump sub-gap) is referenced ONLY from the improvements.js
 *     log entry -- no page, no visualizations-index row, no viz-data module.
 *   - imp-95249-inoctave-pair-split-certificate.js (THEOREM SPLIT-2 /
 *     ANG-PENCIL / ANG-DET, the first coalescence-uniform in-octave-pair
 *     certificate) is named in sessions.js, improvement-queue.js, and the
 *     imp-95264 concept-note prose, but no page or viz-data module imports
 *     it and it has no visualizations-index row.
 *
 * AUDIT-ONLY: this ticket records the gap, it does not build the two
 * missing viz pages (that is separate follow-on scope, matching how prior
 * caveat-surfacing audits in this lineage separate "found the gap" from
 * "closed the gap"). No bound changes; NO QED; no refereed bound is changed.
 */

const SURFACED = [
  {
    ticket: 'imp-95231',
    file: 'src/data/imp-95231-coalescence-ratio-monotonicity.js',
    pages: ['src/pages/Imp95282CoalLawVsLambda2Viz.jsx'],
  },
  {
    ticket: 'imp-95232',
    file: 'src/data/imp-95232-bl-lat-off-lattice-degradation.js',
    pages: ['src/pages/Imp95267OffLatticeRobustnessViz.jsx', 'src/pages/Imp95268CollarOverpriceViz.jsx'],
  },
  {
    ticket: 'imp-95233',
    file: 'src/data/imp-95233-modulus-phase-currency-feasibility.js',
    pages: ['src/pages/Imp95266ThetaVsKPhaseCollapseViz.jsx', 'src/pages/Imp95279PhaseCertVsNogoCeilingViz.jsx'],
  },
  {
    ticket: 'imp-95250',
    file: 'src/data/imp-95250-leaveoneout-multiblock-split-certificate.js',
    pages: ['src/pages/Imp95265EvOctFiringCurveViz.jsx'],
  },
];

const ORPHAN = [
  {
    ticket: 'imp-95231',
    file: 'src/data/imp-95231-rate-monotonicity-closure.js',
    reason: 'referenced only from the improvements.js log entry; no page, no visualizations-index row, no viz-data module',
  },
  {
    ticket: 'imp-95249',
    file: 'src/data/imp-95249-inoctave-pair-split-certificate.js',
    reason: 'named in sessions.js / improvement-queue.js / the imp-95264 concept-note prose, but no page or viz-data module imports it, no visualizations-index row',
  },
];

const IMPORT_STATEMENT_COUNTS = {
  'src/data/imp-95231-coalescence-ratio-monotonicity.js': 0,
  'src/data/imp-95231-rate-monotonicity-closure.js': 0,
  'src/data/imp-95232-bl-lat-off-lattice-degradation.js': 0,
  'src/data/imp-95233-modulus-phase-currency-feasibility.js': 0,
  'src/data/imp-95249-inoctave-pair-split-certificate.js': 0,
  'src/data/imp-95250-leaveoneout-multiblock-split-certificate.js': 0,
};

export const IMP95284_SEAM_CHAIN_SURFACING_AUDIT = {
  ticket: 'imp-95284',
  cohortIds: ['imp-95249', 'imp-95250', 'imp-95231', 'imp-95232', 'imp-95233'],
  cohortSize: SURFACED.length + ORPHAN.length,
  surfaced: SURFACED,
  orphan: ORPHAN,
  importStatementCounts: IMPORT_STATEMENT_COUNTS,
  allImportLight: Object.values(IMPORT_STATEMENT_COUNTS).every((n) => n === 0),
  honest: 'AUDIT-ONLY -- confirms all six cohort modules are import-light (zero import statements, ' +
    'no heavy-bundle reach). 4 of 6 are SURFACED via a registered App.jsx route whose page carries an ' +
    'inline honest-status banner (imp-95231-coalescence-ratio-monotonicity, imp-95232, imp-95233, ' +
    'imp-95250); 2 are ORPHAN with no driving page or visualizations-index row (imp-95231-rate-' +
    'monotonicity-closure, imp-95249). No viz page was fabricated by this ticket; closing the two ' +
    'orphan gaps is separate follow-on scope. No bound change; NO QED; no refereed bound is changed' +
    '.',
};

export const IMP95284_SEAM_CHAIN_SURFACING_AUDIT_ASSERTIONS = [
  {
    id: 'imp-95284-cohort-has-six-members',
    description: 'the audited cohort spans exactly six modules across five ticket ids (imp-95231 has two)',
    holds: () => IMP95284_SEAM_CHAIN_SURFACING_AUDIT.cohortSize === 6
      && IMP95284_SEAM_CHAIN_SURFACING_AUDIT.cohortIds.length === 5,
  },
  {
    id: 'imp-95284-all-import-light',
    description: 'every cohort module has zero import statements (no transitive heavy-bundle reach)',
    holds: () => IMP95284_SEAM_CHAIN_SURFACING_AUDIT.allImportLight === true,
  },
  {
    id: 'imp-95284-four-surfaced-two-orphan',
    description: 'exactly four modules are surfaced via a page and exactly two are orphan',
    holds: () => SURFACED.length === 4 && ORPHAN.length === 2,
  },
  {
    id: 'imp-95284-surfaced-have-pages',
    description: 'every surfaced entry lists at least one driving page',
    holds: () => SURFACED.every((m) => Array.isArray(m.pages) && m.pages.length > 0),
  },
  {
    id: 'imp-95284-orphan-flags-95231-and-95249',
    description: 'the two orphan entries are exactly the imp-95231 rate-monotonicity-closure file and imp-95249',
    holds: () => ORPHAN.some((m) => m.file === 'src/data/imp-95231-rate-monotonicity-closure.js')
      && ORPHAN.some((m) => m.ticket === 'imp-95249'),
  },
  {
    id: 'imp-95284-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(IMP95284_SEAM_CHAIN_SURFACING_AUDIT.honest)
      && /refereed bound is changed/i.test(IMP95284_SEAM_CHAIN_SURFACING_AUDIT.honest),
  },
];

for (const a of IMP95284_SEAM_CHAIN_SURFACING_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95284-seam-chain-surfacing-audit assertion failed: ${a.id}`);
}
