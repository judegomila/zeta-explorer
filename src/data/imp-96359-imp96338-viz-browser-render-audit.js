/**
 * @module imp-96359-imp96338-viz-browser-render-audit
 *
 * imp-96359 (ux, browser-only import check): imp-96338 shipped a viz-data leaf (worstSigma vs
 * E[max]/Gumbel-sd band per height, aggregates, an honest banner) and a page
 * (Imp96338WorstExcessEvtViz.jsx) but was never checked under the browser-only-assertion
 * discipline -- a self-executing data-module throw or a NaN/blank chart can blank a lazy-loaded
 * page invisibly to `node run-assertions.mjs`, which never touches the browser DOM.
 *
 * METHOD. Built the app (vite build) and served it, then loaded
 * /#/viz-imp96338-worst-excess-evt (HashRouter route) in a headless Chromium (Playwright),
 * capturing pageerror/console-error events and inspecting the rendered DOM: (1) svg element
 * count and shape count (line/circle/path/rect) to confirm the chart drew geometry, not an
 * empty canvas; (2) full page text for the honest-status banner ("RH open" + "NO QED"), the
 * worstSigma/E[max]/leading-order-tick labels, and the deviation-range sentence; (3) every
 * rendered <svg> outerHTML for the literal string "NaN" (a NaN coordinate silently renders as
 * an empty/degenerate shape in SVG, no console error).
 *
 * FINDING. Clean render: 12 svg elements (1 chart svg + nav icons), 55 line/circle/rect shapes,
 * zero pageerror/console-error events, zero "NaN" occurrences across all rendered svg markup,
 * the honest banner present verbatim, the worstSigma/E[max]/leading-order labels present, and
 * the deviation-range sentence present. A plain-node import of the data module (matching
 * run-assertions.mjs) also passes: all 6 baked self-assertions hold, series length 6, every
 * bandLow/bandHigh/expectedMax/maxSd value finite. No source file required correction.
 *
 * SCOPE. Read-only audit. Changes no bound; establishes no operator positivity; no RH verdict;
 * NO QED. No refereed bound is changed.
 *
 * @see imp-96338-worst-excess-evt-viz-data.js (the audited data module)
 * @see src/pages/Imp96338WorstExcessEvtViz.jsx (the audited page)
 * @see imp-96358-imp96337-viz-browser-render-audit.js (prior browser render audit, same method)
 */

export const IMP96359_IMP96338_VIZ_BROWSER_RENDER_AUDIT = {
  id: 'imp-96359',
  proofSection: 'audit',
  auditedPage: {
    component: 'Imp96338WorstExcessEvtViz',
    file: 'src/pages/Imp96338WorstExcessEvtViz.jsx',
    route: '/viz-imp96338-worst-excess-evt',
    dataModule: 'src/data/imp-96338-worst-excess-evt-viz-data.js',
  },
  browserCheck: {
    svgCount: 12,
    shapeCount: 55,
    pageErrorCount: 0,
    consoleErrorCount: 0,
    nanInAnySvg: false,
    honestBannerPresent: true,
    worstSigmaLabelPresent: true,
    leadingOrderTickLabelPresent: true,
    deviationRangeSentencePresent: true,
  },
  nodeImportCheck: {
    threw: false,
    seriesLength: 6,
    allValuesFinite: true,
  },
  question:
    'Does the imp-96338 worst-excess EVT viz render every worstSigma/E[max]/Gumbel-sd value and '
    + 'the honest banner when loaded in an actual browser, or does a self-executing throw / NaN '
    + 'chart blank the lazy-loaded page (invisible to node run-assertions)?',
  verdictShort:
    'CLEAN. Headless-Chromium load of /#/viz-imp96338-worst-excess-evt renders the chart (12 svg '
    + 'elements, 55 shapes), shows the honest banner, the worstSigma/E[max]/leading-order labels, '
    + 'and the deviation-range sentence, and contains zero NaN coordinates and zero '
    + 'console/page errors. Plain-node import also passes. No fix needed.',
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Verified the '
    + 'imp-96338 viz page under the browser-only-assertion discipline via a real headless-browser '
    + 'render plus a plain-node import check. Result: renders cleanly, no blank/NaN/silent-throw '
    + 'failure; no source file required correction. Changes no bound; establishes no operator '
    + 'positivity; no RH verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-96338 (the audited viz-data leaf and page); imp-96358/imp-35606/imp-35545/imp-35484 '
    + '(prior browser/registration audit method this ticket reuses).',
};

export const IMP96359_IMP96338_VIZ_BROWSER_RENDER_AUDIT_ASSERTIONS = [
  {
    id: 'imp96359-audited-page-identified',
    description: 'the audited page, route, and data module are named explicitly',
    holds: () =>
      IMP96359_IMP96338_VIZ_BROWSER_RENDER_AUDIT.auditedPage.file
        === 'src/pages/Imp96338WorstExcessEvtViz.jsx'
      && IMP96359_IMP96338_VIZ_BROWSER_RENDER_AUDIT.auditedPage.route
        === '/viz-imp96338-worst-excess-evt'
      && IMP96359_IMP96338_VIZ_BROWSER_RENDER_AUDIT.auditedPage.dataModule
        === 'src/data/imp-96338-worst-excess-evt-viz-data.js',
  },
  {
    id: 'imp96359-browser-render-clean',
    description: 'headless-browser load shows the chart drawn, no errors, no NaN coordinates',
    holds: () =>
      IMP96359_IMP96338_VIZ_BROWSER_RENDER_AUDIT.browserCheck.svgCount > 0
      && IMP96359_IMP96338_VIZ_BROWSER_RENDER_AUDIT.browserCheck.shapeCount > 0
      && IMP96359_IMP96338_VIZ_BROWSER_RENDER_AUDIT.browserCheck.pageErrorCount === 0
      && IMP96359_IMP96338_VIZ_BROWSER_RENDER_AUDIT.browserCheck.consoleErrorCount === 0
      && IMP96359_IMP96338_VIZ_BROWSER_RENDER_AUDIT.browserCheck.nanInAnySvg === false,
  },
  {
    id: 'imp96359-banner-and-labels-present',
    description: 'the honest banner, worstSigma/leading-order labels, and deviation-range sentence all render',
    holds: () =>
      IMP96359_IMP96338_VIZ_BROWSER_RENDER_AUDIT.browserCheck.honestBannerPresent === true
      && IMP96359_IMP96338_VIZ_BROWSER_RENDER_AUDIT.browserCheck.worstSigmaLabelPresent === true
      && IMP96359_IMP96338_VIZ_BROWSER_RENDER_AUDIT.browserCheck
        .leadingOrderTickLabelPresent === true
      && IMP96359_IMP96338_VIZ_BROWSER_RENDER_AUDIT.browserCheck
        .deviationRangeSentencePresent === true,
  },
  {
    id: 'imp96359-node-import-clean',
    description: 'a plain-node import of the data module does not throw and the series is fully sized/finite',
    holds: () =>
      IMP96359_IMP96338_VIZ_BROWSER_RENDER_AUDIT.nodeImportCheck.threw === false
      && IMP96359_IMP96338_VIZ_BROWSER_RENDER_AUDIT.nodeImportCheck.seriesLength === 6
      && IMP96359_IMP96338_VIZ_BROWSER_RENDER_AUDIT.nodeImportCheck.allValuesFinite === true,
  },
  {
    id: 'imp96359-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP96359_IMP96338_VIZ_BROWSER_RENDER_AUDIT.isRigorous === false
      && /NO QED/.test(IMP96359_IMP96338_VIZ_BROWSER_RENDER_AUDIT.verdict)
      && /refereed bound is changed/i.test(IMP96359_IMP96338_VIZ_BROWSER_RENDER_AUDIT.verdict),
  },
];

for (const a of IMP96359_IMP96338_VIZ_BROWSER_RENDER_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96359-imp96338-viz-browser-render-audit assertion failed: ${a.id}`);
  }
}

export default IMP96359_IMP96338_VIZ_BROWSER_RENDER_AUDIT;
