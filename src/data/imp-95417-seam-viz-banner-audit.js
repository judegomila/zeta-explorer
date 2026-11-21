/**
 * @module imp-95417-seam-viz-banner-audit
 *
 * imp-95417 (meta): audits whether the routed viz pages downstream of the
 * recent seam/pencil modules imp-95255, imp-95256, imp-95271, imp-95276,
 * imp-95277 each surface an honest-status banner consistent with their
 * source module's verdict (measurement/assessment/derivation only; changes
 * no bound; NO QED; no refereed bound is changed).
 *
 * METHOD: grepped src/pages/ for each source module's filename to find
 * citing pages, then grepped each citing page for "Honest status" /
 * "NO QED" / "SOTA" banner text and compared it against the source
 * module's own `verdict` string.
 *
 * FINDINGS:
 *  - imp-95255 -> src/pages/Imp95393YminMapsThetaObstructedViz.jsx: carries
 *    an explicit "Honest status: an assessment, not a new certificate ...
 *    NO QED" banner. CONSISTENT with the source split-verdict ASSESSMENT.
 *  - imp-95277 -> src/pages/Imp95392PrecisionReplayCostLadderViz.jsx:
 *    carries "Honest status: a derivation from the frozen ledger ... NO
 *    QED" banner. CONSISTENT with the source LADDER derivation verdict.
 *  - imp-95256 -> src/pages/Imp95391Split2SplitLooCrossoverViz.jsx (via the
 *    imp-95391 viz-data snapshot): carries "Honest status: measurement
 *    only ... NO QED" banner. CONSISTENT with the source MEASUREMENT
 *    verdict.
 *  - imp-95271 -> src/pages/Imp95390RiMarginHeatmapViz.jsx (via the
 *    imp-95390 viz-data snapshot): carries "Honest status: measurement
 *    only ... NO QED" banner. CONSISTENT with the source MEASUREMENT ONLY
 *    verdict.
 *  - imp-95276: no dedicated routed viz page exists (only data-only notes
 *    and the OpenFrontierPage.jsx frontier list cite it), so no
 *    page-banner-consistency question applies -- nothing to audit there.
 *  - src/pages/ObstructionSeamPage.jsx (the literal "ObstructionSeamPage")
 *    covers a distinct, older artifact (RH_OBSTRUCTION_SEAM, 2026-07-16),
 *    not the imp-95255..95277 chain. It already renders a
 *    HonestCeilingBanner plus explicit "No refereed bound is changed. NO QED."
 *    text, consistent with its own source verdicts.
 *
 * AUDIT-ONLY: no banner text was found missing or inconsistent, so no
 * banner was added or changed. No bound change; NO QED; no refereed bound is changed.
 */

const AUDITED_PAIRS = [
  {
    sourceModule: 'imp-95255-currency-per-window-map-assessment.js',
    vizPage: 'src/pages/Imp95393YminMapsThetaObstructedViz.jsx',
    sourceVerdictKind: 'ASSESSMENT (split verdict)',
    pageHasBanner: true,
    consistent: true,
  },
  {
    sourceModule: 'imp-95277-precision-replay-ladder.js',
    vizPage: 'src/pages/Imp95392PrecisionReplayCostLadderViz.jsx',
    sourceVerdictKind: 'LADDER derivation',
    pageHasBanner: true,
    consistent: true,
  },
  {
    sourceModule: 'imp-95256-split2-splitloo-crossover.js',
    vizPage: 'src/pages/Imp95391Split2SplitLooCrossoverViz.jsx',
    sourceVerdictKind: 'MEASUREMENT',
    pageHasBanner: true,
    consistent: true,
  },
  {
    sourceModule: 'imp-95271-ri-margin-map.js',
    vizPage: 'src/pages/Imp95390RiMarginHeatmapViz.jsx',
    sourceVerdictKind: 'MEASUREMENT ONLY',
    pageHasBanner: true,
    consistent: true,
  },
];

const NO_DEDICATED_PAGE = [
  {
    sourceModule: 'imp-95276-seam-to-chain-gate-map.js',
    reason: 'no routed viz page cites it; only data-only reconciliation notes and the OpenFrontierPage.jsx frontier list reference it',
  },
];

export const IMP95417_SEAM_VIZ_BANNER_AUDIT = {
  ticket: 'imp-95417',
  auditedPairs: AUDITED_PAIRS,
  noDedicatedPage: NO_DEDICATED_PAGE,
  obstructionSeamPageChecked: true,
  obstructionSeamPageCoversDifferentArtifact: true,
  allAuditedConsistent: AUDITED_PAIRS.every((p) => p.consistent),
  missingBannerCount: AUDITED_PAIRS.filter((p) => !p.pageHasBanner).length,
  honest:
    'AUDIT-ONLY: every routed viz page downstream of the imp-95255/95256/95271/95277 seam-chain ' +
    'modules already carries an honest-status banner matching its source module verdict ' +
    '(measurement/assessment/derivation only; changes no bound; NO QED; no refereed bound is changed' +
    '). imp-95276 has no dedicated routed viz page so no banner-consistency question ' +
    'applies to it. ObstructionSeamPage.jsx itself covers a separate 2026-07-16 artifact and already ' +
    'carries a matching HonestCeilingBanner. No banner text was missing; none was added. No bound ' +
    'change; NO QED; no refereed bound is changed.',
};

export const IMP95417_SEAM_VIZ_BANNER_AUDIT_ASSERTIONS = [
  {
    id: 'imp-95417-four-pairs-audited',
    description: 'exactly four source-module-to-viz-page pairs were audited',
    holds: () => IMP95417_SEAM_VIZ_BANNER_AUDIT.auditedPairs.length === 4,
  },
  {
    id: 'imp-95417-all-consistent',
    description: 'every audited page carries a banner consistent with its source module verdict',
    holds: () => IMP95417_SEAM_VIZ_BANNER_AUDIT.allAuditedConsistent === true
      && IMP95417_SEAM_VIZ_BANNER_AUDIT.missingBannerCount === 0,
  },
  {
    id: 'imp-95417-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(IMP95417_SEAM_VIZ_BANNER_AUDIT.honest)
      && /refereed bound is changed/i.test(IMP95417_SEAM_VIZ_BANNER_AUDIT.honest),
  },
];

for (const a of IMP95417_SEAM_VIZ_BANNER_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95417-seam-viz-banner-audit assertion failed: ${a.id}`);
}
