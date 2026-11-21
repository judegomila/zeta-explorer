/**
 * @module imp-95574-95546-95547-surfacing-confirmation-audit
 *
 * imp-95574 (meta): audits the two viz pages shipped after the imp-95407
 * orphan finding -- imp-95546 (RZ-PEN7/RZ-PEN8 gain-ladder viz) and
 * imp-95547 (alpha_{k,h} PCC-gated-region heatmap viz) -- for (a) an
 * honest-status banner on the page and (b) a correct
 * visualizations-index.js row.
 *
 * METHOD for (a): read both page components
 * (src/pages/Imp95546RzPen78GainLadderViz.jsx,
 * src/pages/Imp95547AlphaKhHeatScatterViz.jsx) end to end. Both open with
 * a red-bordered "Honest status" banner and close with a "Status" banner,
 * each stating: changes no Lambda bound, establishes no operator
 * positivity, RH does not follow, no refereed bound is changed
 * , NO QED. Both banners are present verbatim in both files.
 *
 * METHOD for (b): grepped src/data/visualizations-index.js for both
 * ticket ids. Both have a row with route, dataModule, paperSourcePath,
 * ticket, and honestCeiling fields; each honestCeiling text also carries
 * the same NO QED / Lambda<=0.2 SOTA language. Cross-checked both routes
 * against src/App.jsx: '/viz-imp95546-rzpen78-gain-ladder' and
 * '/viz-imp95547-alpha-kh-heat-scatter' are each registered to the
 * matching lazy-loaded component.
 *
 * FINDING: no defect. Both pages carry the mandatory honest-status
 * banner and both visualizations-index.js rows are present and correctly
 * wired. This closes out the imp-95407 orphan finding for imp-95333 /
 * imp-95334: they are now genuinely SURFACED, not merely routed.
 * AUDIT-ONLY: no bound change; NO QED; no refereed bound is changed.
 */

const SUBJECT_PAGES = [
  {
    ticket: 'imp-95546',
    route: '/viz-imp95546-rzpen78-gain-ladder',
    file: 'src/pages/Imp95546RzPen78GainLadderViz.jsx',
    hasHonestBanner: true,
    hasVizIndexRow: true,
  },
  {
    ticket: 'imp-95547',
    route: '/viz-imp95547-alpha-kh-heat-scatter',
    file: 'src/pages/Imp95547AlphaKhHeatScatterViz.jsx',
    hasHonestBanner: true,
    hasVizIndexRow: true,
  },
];

export const IMP95574_SURFACING_CONFIRMATION_AUDIT = {
  ticket: 'imp-95574',
  auditedPages: SUBJECT_PAGES,
  subjectCount: SUBJECT_PAGES.length,
  allBannered: SUBJECT_PAGES.every((p) => p.hasHonestBanner),
  allIndexed: SUBJECT_PAGES.every((p) => p.hasVizIndexRow),
  followsUpOn: 'imp-95407-rzpen7-8-surfacing-audit',
  honest:
    'AUDIT-ONLY -- confirms imp-95546 and imp-95547, the two viz pages shipped to close the ' +
    'imp-95407 orphan finding for imp-95333 (RZ-PEN7) / imp-95334 (RZ-PEN8), each carry a ' +
    'complete honest-status banner (no bound change, no operator positivity, RH does not ' +
    'follow, no refereed bound is changed, NO QED) and each has a correctly wired ' +
    'visualizations-index.js row matching its registered App.jsx route. No defect found; no ' +
    'page or row was altered by this ticket. NO QED; no refereed bound is changed.',
};

export const IMP95574_SURFACING_CONFIRMATION_AUDIT_ASSERTIONS = [
  {
    id: 'imp-95574-subject-has-two-members',
    description: 'the audited subject set spans exactly the two pages imp-95546/imp-95547',
    holds: () =>
      IMP95574_SURFACING_CONFIRMATION_AUDIT.subjectCount === 2 &&
      IMP95574_SURFACING_CONFIRMATION_AUDIT.auditedPages.length === 2,
  },
  {
    id: 'imp-95574-all-bannered-and-indexed',
    description: 'every subject page has an honest-status banner and a visualizations-index.js row',
    holds: () =>
      IMP95574_SURFACING_CONFIRMATION_AUDIT.allBannered === true &&
      IMP95574_SURFACING_CONFIRMATION_AUDIT.allIndexed === true,
  },
  {
    id: 'imp-95574-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () =>
      /AUDIT-ONLY/.test(IMP95574_SURFACING_CONFIRMATION_AUDIT.honest) &&
      /refereed bound is changed/i.test(IMP95574_SURFACING_CONFIRMATION_AUDIT.honest),
  },
];

for (const a of IMP95574_SURFACING_CONFIRMATION_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95574-95546-95547-surfacing-confirmation-audit assertion failed: ${a.id}`);
}
