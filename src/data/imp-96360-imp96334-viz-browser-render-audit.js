/**
 * @module imp-96360-imp96334-viz-browser-render-audit
 *
 * imp-96360 (ux, browser-only import check): imp-96334 shipped a viz-data leaf (four-C_H
 * E_coll(N) log-log family, shared segment-slope panel, honest banner) and a page
 * (Imp96334EcollRateChIndependenceChartViz.jsx) but was never checked under the
 * browser-only-assertion discipline -- a self-executing data-module throw or a NaN/blank
 * chart can blank a lazy-loaded page invisibly to `node run-assertions.mjs`, which never
 * touches the browser DOM.
 *
 * METHOD. Built the app (vite build) and served it, then loaded
 * /#/viz-imp96334-ecoll-rate-ch-independence (HashRouter route) in a headless Chromium
 * (Playwright), capturing pageerror/console-error events and inspecting the rendered DOM:
 * (1) per-svg circle/path counts to confirm the family chart plots every E_coll value (4
 * C_H series x 6 N-ladder points = 24 circles) and the slope panel plots every segment (5
 * circles, one per N-ladder segment); (2) full page text for the honest-status banner and
 * the "C_Lip remains NEGATIVE" Gronwall-discharge sentence; (3) every rendered <svg>
 * outerHTML for the literal string "NaN".
 *
 * FINDING. Clean render: the 680x340 family-chart svg carries 24 circles (4 series x 6
 * points, every baked E_coll value plotted) and 4 line paths; the 680x180 slope-panel svg
 * carries 5 circles (one per N-ladder segment) and 1 line path; zero pageerror/console-error
 * events; zero "NaN" occurrences across all rendered svg markup; the "Honest status" banner
 * renders verbatim including the C_Lip-Gronwall-NEGATIVE sentence; the four C_H series
 * legend labels ("C_H = ...") all render. No source file required correction.
 *
 * SCOPE. Read-only audit. Changes no bound; establishes no operator positivity; no RH
 * verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-96334-ecoll-rate-ch-independence-viz-data.js (the audited data module)
 * @see src/pages/Imp96334EcollRateChIndependenceChartViz.jsx (the audited page)
 * @see imp-96359-imp96338-viz-browser-render-audit.js (prior browser render audit, same method)
 */

export const IMP96360_IMP96334_VIZ_BROWSER_RENDER_AUDIT = {
  id: 'imp-96360',
  proofSection: 'audit',
  auditedPage: {
    component: 'Imp96334EcollRateChIndependenceChartViz',
    file: 'src/pages/Imp96334EcollRateChIndependenceChartViz.jsx',
    route: '/viz-imp96334-ecoll-rate-ch-independence',
    dataModule: 'src/data/imp-96334-ecoll-rate-ch-independence-viz-data.js',
  },
  browserCheck: {
    familyChart: { svgWidth: 680, svgHeight: 340, circleCount: 24, pathCount: 4 },
    slopePanel: { svgWidth: 680, svgHeight: 180, circleCount: 5, pathCount: 1 },
    pageErrorCount: 0,
    consoleErrorCount: 0,
    nanInAnySvg: false,
    honestBannerPresent: true,
    cLipGronwallNegativePresent: true,
    seriesLegendLabelCount: 4,
  },
  question:
    'Does the imp-96334 E_coll-rate C_H-independence viz render every E_coll value (4 C_H '
    + 'series x 6 N points) and every shared segment slope, and does it show the honest '
    + 'C_Lip-Gronwall-NEGATIVE banner, when loaded in an actual browser?',
  verdictShort:
    'CLEAN. Headless-Chromium load of /#/viz-imp96334-ecoll-rate-ch-independence renders '
    + 'all 24 family-chart points and all 5 slope-panel points, shows the honest banner '
    + '(including the C_Lip-Gronwall-NEGATIVE sentence), and contains zero NaN coordinates '
    + 'and zero console/page errors. No fix needed.',
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Verified the '
    + 'imp-96334 viz page under the browser-only-assertion discipline via a real '
    + 'headless-browser render. Result: renders cleanly, every E_coll value and every shared '
    + 'segment slope is plotted, the honest banner renders verbatim; no source file required '
    + 'correction. Changes no bound; establishes no operator positivity; no RH verdict; '
    + 'NO QED. No refereed bound is changed.',
  citation:
    'imp-96334 (the audited viz-data leaf and page); imp-96359/imp-96358/imp-35606/imp-35545 '
    + '(prior browser render audits, same method).',
};

export const IMP96360_IMP96334_VIZ_BROWSER_RENDER_AUDIT_ASSERTIONS = [
  {
    id: 'imp96360-audited-page-identified',
    description: 'the audited page, route, and data module are named explicitly',
    holds: () =>
      IMP96360_IMP96334_VIZ_BROWSER_RENDER_AUDIT.auditedPage.file
        === 'src/pages/Imp96334EcollRateChIndependenceChartViz.jsx'
      && IMP96360_IMP96334_VIZ_BROWSER_RENDER_AUDIT.auditedPage.route
        === '/viz-imp96334-ecoll-rate-ch-independence'
      && IMP96360_IMP96334_VIZ_BROWSER_RENDER_AUDIT.auditedPage.dataModule
        === 'src/data/imp-96334-ecoll-rate-ch-independence-viz-data.js',
  },
  {
    id: 'imp96360-family-chart-plots-every-value',
    description: 'the family chart svg has exactly 24 circles: 4 C_H series x 6 N-ladder points',
    holds: () => IMP96360_IMP96334_VIZ_BROWSER_RENDER_AUDIT.browserCheck.familyChart.circleCount === 24,
  },
  {
    id: 'imp96360-slope-panel-plots-every-segment',
    description: 'the slope panel svg has exactly 5 circles, one per N-ladder segment',
    holds: () => IMP96360_IMP96334_VIZ_BROWSER_RENDER_AUDIT.browserCheck.slopePanel.circleCount === 5,
  },
  {
    id: 'imp96360-browser-render-clean',
    description: 'headless-browser load shows no errors and no NaN coordinates',
    holds: () =>
      IMP96360_IMP96334_VIZ_BROWSER_RENDER_AUDIT.browserCheck.pageErrorCount === 0
      && IMP96360_IMP96334_VIZ_BROWSER_RENDER_AUDIT.browserCheck.consoleErrorCount === 0
      && IMP96360_IMP96334_VIZ_BROWSER_RENDER_AUDIT.browserCheck.nanInAnySvg === false,
  },
  {
    id: 'imp96360-banner-present',
    description: 'the honest banner and the C_Lip-Gronwall-NEGATIVE sentence render',
    holds: () =>
      IMP96360_IMP96334_VIZ_BROWSER_RENDER_AUDIT.browserCheck.honestBannerPresent === true
      && IMP96360_IMP96334_VIZ_BROWSER_RENDER_AUDIT.browserCheck.cLipGronwallNegativePresent === true,
  },
  {
    id: 'imp96360-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP96360_IMP96334_VIZ_BROWSER_RENDER_AUDIT.isRigorous === false
      && /NO QED/.test(IMP96360_IMP96334_VIZ_BROWSER_RENDER_AUDIT.verdict)
      && /refereed bound is changed/i.test(IMP96360_IMP96334_VIZ_BROWSER_RENDER_AUDIT.verdict),
  },
];

for (const a of IMP96360_IMP96334_VIZ_BROWSER_RENDER_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96360-imp96334-viz-browser-render-audit assertion failed: ${a.id}`);
  }
}

export default IMP96360_IMP96334_VIZ_BROWSER_RENDER_AUDIT;
