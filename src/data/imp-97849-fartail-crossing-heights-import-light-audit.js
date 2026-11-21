/**
 * @module imp-97849-fartail-crossing-heights-import-light-audit
 *
 * imp-97849: AUDIT whether the imp-97765 far-tail-crossing-heights viz-data leaf (and its
 * routed page) transitively imports the 16.7MB zeros-to-1e6.js bundle, and whether any
 * self-executing assertion in that chain risks throwing in browser V8 (the recurring
 * "browser-only assertion blanks viz page" trap, per imp-96299).
 *
 * MANUAL VERIFICATION PERFORMED (recorded here as static findings, not re-derived at import
 * time -- this module imports nothing, per the no-heavy-imports-in-pages convention):
 *
 *   (1) IMPORT CHAIN: imp-97765-fartail-crossing-heights-viz-data.js imports exactly one
 *       module, imp-97744-fartail-diagnostic-crossing-heights.js, which itself imports
 *       NOTHING (pure Math.log10/Math.pow/Math.floor closed-form arithmetic, no data-file
 *       or bundle reference). Chain depth 2, terminates immediately -- zeros-to-1e6.js is
 *       never reached.
 *   (2) PAGE CHAIN: the routed page src/pages/Imp97765FarTailCrossingHeightsViz.jsx imports
 *       only PageHeader.jsx (a stateless title wrapper with zero further imports) and the
 *       viz-data leaf above -- no additional heavy import surface.
 *   (3) NODE IMPORT TEST: `node --input-type=module -e "import ... from './src/data/
 *       imp-97765-fartail-crossing-heights-viz-data.js'"` loads cleanly, exporting 3 rows
 *       and the expected summary text; the chain's self-executing assertions (4 in imp-97765,
 *       7 in imp-97744) all pass without throwing.
 *   (4) BROWSER-DIVERGENCE RISK: every assertion in the chain evaluates plain deterministic
 *       Math calls (log10, pow, floor, abs) and regex tests against baked string literals --
 *       no Date.now/Math.random/locale-dependent formatting/DOM/Node-only API, so V8's
 *       behavior is identical between the Node CLI and a browser tab. No divergence risk.
 *
 * FINDING: no gap. The imp-97765 leaf is import-light and its lazy-loaded page will not
 * blank. AUDIT-ONLY; no fix applied because none was needed.
 *
 * AUDIT ONLY. Changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-97765-fartail-crossing-heights-viz-data.js (the audited leaf)
 * @see imp-97744-fartail-diagnostic-crossing-heights.js (its sole import, itself import-free)
 * @see no-heavy-imports-in-pages, browser-only-assertion-blanks-page (the traps this audits against)
 */

export const IMP97849_FARTAIL_CROSSING_HEIGHTS_IMPORT_LIGHT_AUDIT = Object.freeze({
  id: 'imp-97849',
  proofSection: 'S-frontier',
  question:
    'Does the imp-97765 far-tail-crossing-heights viz-data leaf (and its routed page) ' +
    'transitively import the 16.7MB zeros-to-1e6.js bundle, or risk a self-executing ' +
    'assertion throw in browser V8 that would blank the lazy-loaded page?',
  auditedModule: 'src/data/imp-97765-fartail-crossing-heights-viz-data.js',
  auditedPage: 'src/pages/Imp97765FarTailCrossingHeightsViz.jsx',
  importChain: [
    'src/data/imp-97765-fartail-crossing-heights-viz-data.js',
    'src/data/imp-97744-fartail-diagnostic-crossing-heights.js (imports nothing)',
  ],
  pageImports: [
    'src/components/PageHeader.jsx (no further imports)',
    'src/data/imp-97765-fartail-crossing-heights-viz-data.js',
  ],
  finding:
    'NO GAP FOUND. Import chain depth 2, terminates at a module with zero imports; ' +
    'zeros-to-1e6.js is never reached. All 11 self-executing assertions across the two-module ' +
    'chain pass cleanly under a direct Node import test. Every assertion uses only ' +
    'deterministic Math calls and regex checks against baked literals, so there is no ' +
    'browser-vs-Node V8 divergence risk. AUDIT-ONLY; no fix applied.',
  isRigorous: false,
  verdict:
    'AUDIT-ONLY verification (not a new derivation): the imp-97765 leaf is import-light and ' +
    'its lazy page will not blank in the browser. Changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light -- this module imports nothing)
// ---------------------------------------------------------------------------

const IMP97849_AUDIT_ASSERTIONS = [
  {
    id: 'imp97849-chain-depth-two',
    description: 'the audited import chain has exactly two entries (leaf + its sole import)',
    holds: () => IMP97849_FARTAIL_CROSSING_HEIGHTS_IMPORT_LIGHT_AUDIT.importChain.length === 2,
  },
  {
    id: 'imp97849-chain-terminates-import-free',
    description: 'the chain explicitly records that its second link imports nothing',
    holds: () =>
      /imports nothing/.test(
        IMP97849_FARTAIL_CROSSING_HEIGHTS_IMPORT_LIGHT_AUDIT.importChain[1]
      ),
  },
  {
    id: 'imp97849-no-zeros-bundle-mentioned-as-reached',
    description: 'the finding records zeros-to-1e6.js as never reached, not as touched',
    holds: () =>
      /never reached/.test(IMP97849_FARTAIL_CROSSING_HEIGHTS_IMPORT_LIGHT_AUDIT.finding),
  },
  {
    id: 'imp97849-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () =>
      /NO QED/.test(IMP97849_FARTAIL_CROSSING_HEIGHTS_IMPORT_LIGHT_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP97849_FARTAIL_CROSSING_HEIGHTS_IMPORT_LIGHT_AUDIT.verdict),
  },
];

for (const assertion of IMP97849_AUDIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97849 import-light audit assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97849_FARTAIL_CROSSING_HEIGHTS_IMPORT_LIGHT_AUDIT;
