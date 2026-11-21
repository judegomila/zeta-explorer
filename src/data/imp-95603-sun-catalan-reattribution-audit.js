/**
 * @fileoverview imp-95603 -- ACCURACY AUDIT of every in-repo site touched (or
 * potentially touched) by the WRONG 2026-09-21 reattribution flip (commit
 * 59a189f30), which moved Zhi-Wei Sun arXiv:2609.04176 Catalan machinery -- the
 * delta_0 = Lambda_mid + 83/2400 - c_odd - (4rho-2rho^2) ledger, the 235-cell
 * Lambda_mid, c_odd, and the rho = S/B optimization -- under Dale James Raymond
 * (Zenodo 22867547, Lambda < 0.149396). The re-correction lives in
 * imp-95516-sun-catalan-objective-verdict.js: a primary-source grep of both real
 * deposits shows Raymond contains NONE of that ledger (grep exit 1), so the
 * machinery is Sun the whole time and the original label was correct.
 *
 * This module RECORDS a per-site RE-POINT-or-KEEP verdict against that
 * re-correction. FINDING: every LIVE in-repo site already carries the corrected
 * (Sun) attribution -- the re-correction has fully propagated. ZERO sites need a
 * RE-POINT. The flipped page/module (sun-catalan-note.js / SunCatalanNotePage) was
 * DELETED by the bad commit and its successor raymond-lambda-note.js is a correct
 * RETRACTION record. The delta_0 / 0.149 tokens in glossary.js are unrelated
 * homonyms (Banach fixed-point iteration counts and the HAC eta_mu ~ 0.149
 * statistic), not the Catalan ledger.
 *
 * Accuracy audit only. Restates no proof status. Catalan G irrationality OPEN;
 * Sun arXiv:2609.04176 single-author unrefereed with a flagged Section 9
 * wrong-sign B-squared; Raymond Lambda < 0.149396 is a genuine, separate,
 * unrefereed Lambda-ladder preprint; no refereed bound is changed; RH OPEN; NO QED.
 *
 * NO heavy imports. Verdicts baked as literals.
 */

export const SUN_CATALAN_REATTRIBUTION_AUDIT = Object.freeze({
  id: 'imp-95603-sun-catalan-reattribution-audit',
  title: 'Per-site RE-POINT/KEEP audit of the wrong 2026-09-21 Sun->Raymond Catalan reattribution flip',
  badCommit: '59a189f30',
  reCorrectionSource: 'imp-95516-sun-catalan-objective-verdict.js',
  machinery: 'delta_0 = Lambda_mid + 83/2400 - c_odd - (4rho-2rho^2) ledger, 235-cell Lambda_mid, c_odd, rho=S/B optimization',
  correctOwner: 'Zhi-Wei Sun, arXiv:2609.04176 (Catalan irrationality)',
  notOwner: 'Dale James Raymond, Zenodo 22867547 (de Bruijn-Newman Lambda < 0.149396) -- shares NONE of the ledger (grep exit 1)',

  // Per-site verdicts. verdict: KEEP = already correct; RE-POINT = still flipped.
  sites: [
    {
      file: 'src/data/imp-95516-sun-catalan-objective-verdict.js',
      verdict: 'KEEP',
      note: 'Carries the re-correction banner; attributes the full ledger to Sun. This is the source of record.',
    },
    {
      file: 'src/data/raymond-lambda-note.js',
      verdict: 'KEEP',
      note: 'Correctly RETRACTED 2026-09-22: states the ledger is Sun arXiv:2609.04176, Raymond has none of it, route blanked.',
    },
    {
      file: 'src/data/irrationality-pipeline.js',
      verdict: 'KEEP',
      note: 'sunCase attributes the delta_0 ledger to Sun and explicitly distinguishes Raymond Lambda < 0.149396 as a different author/problem.',
    },
    {
      file: 'src/App.jsx',
      verdict: 'KEEP',
      note: 'Route comment (~L1896) documents the /raymond-lambda-note retraction and states the delta_0 rho-optimization is Sun Catalan (arXiv:2609.04176 sec 6-9), not Raymond Lambda.',
    },
    {
      file: 'src/data/lambda-roadmap.js',
      verdict: 'KEEP',
      note: 'The S/B-ratio hardening sub-thread is attributed to Sun (unverified) Catalan preprint; the Raymond Lambda < 0.149396 entry is his own genuine correlated-translated-probes construction, never the ledger.',
    },
    {
      file: 'src/data/frontier-dag.js',
      verdict: 'KEEP',
      note: 'Raymond Lambda <= 0.149396 named as a different route with no ledger machinery.',
    },
    {
      file: 'src/data/catalan-signed-ladder.js',
      verdict: 'KEEP',
      note: 'delta_0 ~ 0.0097 margin and the weighted-tails claim are attributed to Sun arXiv:2609.04176.',
    },
    {
      file: 'src/data/imp-95600-sun-s9-signfix-rho-margin-assessment.js',
      verdict: 'KEEP',
      note: 'New sibling assessment; attributes rho / delta_0 / Lambda_mid / c_odd machinery to Sun throughout.',
    },
    {
      file: 'src/data/glossary.js',
      verdict: 'KEEP',
      note: 'No Sun/Raymond Catalan attribution present. The delta_0 tokens are Banach fixed-point iteration counts (iters-to-floor) and 0.149 is the HAC-corrected eta_mu statistic -- unrelated homonyms, not the Catalan ledger.',
    },
    {
      file: 'src/data/sun-catalan-note.js (+ SunCatalanNotePage.jsx)',
      verdict: 'N/A -- DELETED',
      note: 'Removed by commit 59a189f30; no live site remains. Superseded by the correct raymond-lambda-note.js retraction record.',
    },
  ],

  summary:
    'ALL live in-repo sites KEEP (already correct); ZERO RE-POINTs required. The wrong '
    + '2026-09-21 flip has been fully reverted across the repo -- every appearance now '
    + 'attributes the delta_0 ledger to Sun arXiv:2609.04176 and correctly separates '
    + 'Raymond Lambda < 0.149396. The one deleted site (sun-catalan-note.js) has no live '
    + 'presence. Catalan G irrationality OPEN; Sun unrefereed (flagged Section 9); no refereed bound is changed'
    + '; NO QED.',
});

export const SUN_CATALAN_REATTRIBUTION_AUDIT_ASSERTIONS = Object.freeze([
  {
    name: 'every live site verdict is KEEP (the deleted site is the only non-KEEP)',
    holds: () => {
      const live = SUN_CATALAN_REATTRIBUTION_AUDIT.sites.filter((s) => !/DELETED/.test(s.verdict));
      return live.length >= 9 && live.every((s) => s.verdict === 'KEEP');
    },
  },
  {
    name: 'no live site still carries a RE-POINT verdict',
    holds: () => SUN_CATALAN_REATTRIBUTION_AUDIT.sites.every((s) => s.verdict !== 'RE-POINT'),
  },
  {
    name: 'correct owner is Sun arXiv:2609.04176, not Raymond',
    holds: () => /Sun/.test(SUN_CATALAN_REATTRIBUTION_AUDIT.correctOwner)
      && /2609\.04176/.test(SUN_CATALAN_REATTRIBUTION_AUDIT.correctOwner)
      && /Raymond/.test(SUN_CATALAN_REATTRIBUTION_AUDIT.notOwner),
  },
  {
    name: 'honest: G irrationality OPEN and PT Lambda<=0.2 SOTA in the summary',
    holds: () => /G irrationality OPEN/.test(SUN_CATALAN_REATTRIBUTION_AUDIT.summary)
      && /refereed bound is changed/i.test(SUN_CATALAN_REATTRIBUTION_AUDIT.summary),
  },
]);

export default SUN_CATALAN_REATTRIBUTION_AUDIT;
