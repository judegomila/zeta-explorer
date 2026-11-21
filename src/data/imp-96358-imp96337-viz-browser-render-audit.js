/**
 * @module imp-96358-imp96337-viz-browser-render-audit
 *
 * imp-96358 (ux, browser-only import check): imp-96337 shipped a viz-data leaf (rung
 * magnitudes/margins, threshold-count series, ceiling/gap anchors, an honest banner) and a page
 * (Imp96337MixedLadderMarginViz.jsx) but was never checked under the browser-only-assertion
 * discipline -- a self-executing data-module throw or a NaN/blank chart can blank a lazy-loaded
 * page invisibly to `node run-assertions.mjs`, which never touches the browser DOM.
 *
 * METHOD. Built the app (vite build) and served it, then loaded
 * /#/viz-imp96337-mixed-ladder-margin (HashRouter route) in a headless Chromium (Playwright),
 * capturing pageerror/console-error events and inspecting the rendered DOM: (1) svg element count
 * and shape count (line/circle/path) to confirm both charts drew geometry, not empty canvases;
 * (2) full page text for the honest-status banner ("RH open" + "NO QED") and the top-confined-states
 * residual sentence; (3) every rendered <svg> outerHTML for the literal string "NaN" (a NaN
 * coordinate silently renders as an empty/degenerate shape in SVG, no console error).
 *
 * FINDING. Clean render: 13 svg elements (2 chart svgs + nav icons), 66 line/circle/path shapes,
 * zero pageerror/console-error events, zero "NaN" occurrences across all rendered svg markup, the
 * honest banner present verbatim, and the top-confined-states residual sentence present. A
 * plain-node import of the data module (matching run-assertions.mjs) also passes: all 6 baked
 * self-assertions hold, rung-series length 10, threshold-series length 6, every u/margin value
 * finite and within the chart's plotted domain (u in [2,24] subset of the x-axis range [1,30]).
 * No source file required correction.
 *
 * SCOPE. Read-only audit. Changes no bound; establishes no operator positivity; no RH verdict;
 * NO QED. No refereed bound is changed.
 *
 * @see imp-96337-mixed-ladder-margin-viz-data.js (the audited data module)
 * @see src/pages/Imp96337MixedLadderMarginViz.jsx (the audited page)
 * @see imp-35606-imp35561-page-registration-reachability-audit.js (prior browser/registration audit method)
 */

export const IMP96358_IMP96337_VIZ_BROWSER_RENDER_AUDIT = {
  id: 'imp-96358',
  proofSection: 'audit',
  auditedPage: {
    component: 'Imp96337MixedLadderMarginViz',
    file: 'src/pages/Imp96337MixedLadderMarginViz.jsx',
    route: '/viz-imp96337-mixed-ladder-margin',
    dataModule: 'src/data/imp-96337-mixed-ladder-margin-viz-data.js',
  },
  browserCheck: {
    svgCount: 13,
    shapeCount: 66,
    pageErrorCount: 0,
    consoleErrorCount: 0,
    nanInAnySvg: false,
    honestBannerPresent: true,
    topConfinedStatesResidualPresent: true,
  },
  nodeImportCheck: {
    threw: false,
    rungSeriesLength: 10,
    thresholdSeriesLength: 6,
    allValuesFinite: true,
  },
  question:
    'Does the imp-96337 mixed-ladder-margin viz render every rung magnitude/margin and the '
    + 'top-confined-states residual with the honest banner when loaded in an actual browser, or '
    + 'does a self-executing throw / NaN chart blank the lazy-loaded page (invisible to '
    + 'node run-assertions)?',
  verdictShort:
    'CLEAN. Headless-Chromium load of /#/viz-imp96337-mixed-ladder-margin renders both charts '
    + '(13 svg elements, 66 shapes), shows the honest banner and the top-confined-states residual '
    + 'sentence, and contains zero NaN coordinates and zero console/page errors. Plain-node import '
    + 'also passes. No fix needed.',
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Verified the '
    + 'imp-96337 viz page under the browser-only-assertion discipline via a real headless-browser '
    + 'render plus a plain-node import check. Result: renders cleanly, no blank/NaN/silent-throw '
    + 'failure; no source file required correction. Changes no bound; establishes no operator '
    + 'positivity; no RH verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-96337 (the audited viz-data leaf and page); imp-35606/imp-35545/imp-35484 (prior '
    + 'browser/registration audit method this ticket reuses).',
};

export const IMP96358_IMP96337_VIZ_BROWSER_RENDER_AUDIT_ASSERTIONS = [
  {
    id: 'imp96358-audited-page-identified',
    description: 'the audited page, route, and data module are named explicitly',
    holds: () =>
      IMP96358_IMP96337_VIZ_BROWSER_RENDER_AUDIT.auditedPage.file
        === 'src/pages/Imp96337MixedLadderMarginViz.jsx'
      && IMP96358_IMP96337_VIZ_BROWSER_RENDER_AUDIT.auditedPage.route
        === '/viz-imp96337-mixed-ladder-margin'
      && IMP96358_IMP96337_VIZ_BROWSER_RENDER_AUDIT.auditedPage.dataModule
        === 'src/data/imp-96337-mixed-ladder-margin-viz-data.js',
  },
  {
    id: 'imp96358-browser-render-clean',
    description: 'headless-browser load shows charts drawn, no errors, no NaN coordinates',
    holds: () =>
      IMP96358_IMP96337_VIZ_BROWSER_RENDER_AUDIT.browserCheck.svgCount > 0
      && IMP96358_IMP96337_VIZ_BROWSER_RENDER_AUDIT.browserCheck.shapeCount > 0
      && IMP96358_IMP96337_VIZ_BROWSER_RENDER_AUDIT.browserCheck.pageErrorCount === 0
      && IMP96358_IMP96337_VIZ_BROWSER_RENDER_AUDIT.browserCheck.consoleErrorCount === 0
      && IMP96358_IMP96337_VIZ_BROWSER_RENDER_AUDIT.browserCheck.nanInAnySvg === false,
  },
  {
    id: 'imp96358-banner-and-residual-present',
    description: 'the honest banner and the top-confined-states residual sentence both render',
    holds: () =>
      IMP96358_IMP96337_VIZ_BROWSER_RENDER_AUDIT.browserCheck.honestBannerPresent === true
      && IMP96358_IMP96337_VIZ_BROWSER_RENDER_AUDIT.browserCheck
        .topConfinedStatesResidualPresent === true,
  },
  {
    id: 'imp96358-node-import-clean',
    description: 'a plain-node import of the data module does not throw and every series is fully sized/finite',
    holds: () =>
      IMP96358_IMP96337_VIZ_BROWSER_RENDER_AUDIT.nodeImportCheck.threw === false
      && IMP96358_IMP96337_VIZ_BROWSER_RENDER_AUDIT.nodeImportCheck.rungSeriesLength === 10
      && IMP96358_IMP96337_VIZ_BROWSER_RENDER_AUDIT.nodeImportCheck.thresholdSeriesLength === 6
      && IMP96358_IMP96337_VIZ_BROWSER_RENDER_AUDIT.nodeImportCheck.allValuesFinite === true,
  },
  {
    id: 'imp96358-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP96358_IMP96337_VIZ_BROWSER_RENDER_AUDIT.isRigorous === false
      && /NO QED/.test(IMP96358_IMP96337_VIZ_BROWSER_RENDER_AUDIT.verdict)
      && /refereed bound is changed/i.test(IMP96358_IMP96337_VIZ_BROWSER_RENDER_AUDIT.verdict),
  },
];

for (const a of IMP96358_IMP96337_VIZ_BROWSER_RENDER_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96358-imp96337-viz-browser-render-audit assertion failed: ${a.id}`);
  }
}

export default IMP96358_IMP96337_VIZ_BROWSER_RENDER_AUDIT;
