import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { readFile } from 'node:fs/promises';
import katex from 'katex';
import { build, createServer } from 'vite';

const REPRODUCIBILITY_TEXT = Object.freeze({
  'current-replay': 'current independent replay',
  'historical-unavailable': 'historical record · certificate unavailable',
  partial: 'partial reproducibility',
  'not-applicable': 'reproducibility not applicable',
});

const { RH_RESEARCH_CONTRACT_FIXTURE: fixture } = await import(
  './check-rh-research-module-contract.mjs'
);

const entries = [
  'src/components/rh-research/ResearchModulePage.jsx',
  'src/components/rh-research/ResearchModuleIndex.jsx',
];

function collectStrings(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(collectStrings);
  return [];
}

function normalizeTeX(value) {
  return value
    .replace(/\\(?:quad|qquad|,|;|!)/g, '')
    .replace(/&/g, '')
    .replace(/\s+/g, '');
}

function equationCount(module) {
  return (module.theorem?.equations?.length || 0) +
    (module.derivation || []).reduce((sum, step) => sum + (step.equations?.length || 0), 0);
}

function extractCanonicalMath(markdown) {
  const snippets = [];
  const matcher = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)|\$\$([\s\S]*?)\$\$|\$([^$\n]+?)\$/g;
  let match;
  while ((match = matcher.exec(markdown)) !== null) {
    snippets.push({
      tex: (match[1] || match[2] || match[3] || match[4]).trim(),
      display: match[1] !== undefined || match[3] !== undefined,
    });
  }
  return snippets;
}

function normalizeCanonicalSource(value) {
  return value.replace(/\s+/g, '');
}

function countOccurrences(value, needle) {
  return value.split(needle).length - 1;
}

function collectRuntimeStrings(value, path = 'module', strings = []) {
  if (typeof value === 'string') {
    strings.push({ path, value });
    return strings;
  }
  if (!value || typeof value !== 'object') return strings;
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectRuntimeStrings(item, `${path}[${index}]`, strings));
    return strings;
  }
  Object.entries(value).forEach(([key, item]) => collectRuntimeStrings(item, `${path}.${key}`, strings));
  return strings;
}

function extractInlineMath(text) {
  const snippets = [];
  const matcher = /\$\$([^$]+?)\$\$|\$([^$\n]+?)\$/g;
  let match;
  while ((match = matcher.exec(text)) !== null) snippets.push(match[1] || match[2]);
  return snippets;
}
for (const entry of entries) {
  await build({
    logLevel: 'silent',
    build: {
      ssr: entry,
      write: false,
    },
  });
}

const vite = await createServer({
  appType: 'custom',
  logLevel: 'silent',
  server: { middlewareMode: true },
});

try {
  const [
    { default: ResearchModulePage },
    { default: ResearchModuleIndex },
    { RH_RESEARCH_MODULES },
    { CanonicalMarkdownDocument, getCanonicalResearchBody },
  ] = await Promise.all([
    vite.ssrLoadModule('/src/components/rh-research/ResearchModulePage.jsx'),
    vite.ssrLoadModule('/src/components/rh-research/ResearchModuleIndex.jsx'),
    vite.ssrLoadModule('/src/data/rh-research/registry.js'),
    vite.ssrLoadModule('/src/components/rh-research/CanonicalResearchBody.jsx'),
  ]);
  const wrap = (child) => React.createElement(
    MemoryRouter,
    { initialEntries: [fixture.route] },
    child,
  );
  const pageHtml = renderToStaticMarkup(wrap(
    React.createElement(ResearchModulePage, { module: fixture }),
  ));
  const indexHtml = renderToStaticMarkup(wrap(
    React.createElement(ResearchModuleIndex, { modules: [fixture] }),
  ));

  for (const [name, html] of [['page', pageHtml], ['index', indexHtml]]) {
    if (!html.includes('RH remains open')) {
      throw new Error(`${name} renderer omitted the permanent RH-open boundary`);
    }
    if (!html.includes('current independent replay')) {
      throw new Error(`${name} renderer omitted the reproducibility state`);
    }
  }
  if (!pageHtml.includes('It does not claim a theorem')) {
    throw new Error('detail renderer omitted the claim non-implication');
  }

  const publishedIndexHtml = renderToStaticMarkup(wrap(
    React.createElement(ResearchModuleIndex, { modules: RH_RESEARCH_MODULES }),
  ));
  const publishedPageHtmlById = new Map();
  for (const module of RH_RESEARCH_MODULES) {
    if (!publishedIndexHtml.includes(module.title)) {
      throw new Error(`published index omitted ${module.id}`);
    }
    const publishedPageHtml = renderToStaticMarkup(wrap(
      React.createElement(ResearchModulePage, {
        module,
        indexRoute: '/rh-research-modules',
      }),
    ));
    publishedPageHtmlById.set(module.id, publishedPageHtml);
    for (const requiredText of [
      module.title,
      module.theorem.label,
      module.bodyPath,
      'RH remains open',
      'Physics picture.',
    ]) {
      if (!publishedPageHtml.includes(requiredText)) {
        throw new Error(`${module.id} renderer omitted ${requiredText}`);
      }
    }
    const reproducibilityText = REPRODUCIBILITY_TEXT[module.verification.reproducibilityStatus];
    if (!reproducibilityText) {
      throw new Error(`${module.id} uses an untested reproducibility state`);
    }
    if (!publishedPageHtml.includes(reproducibilityText)) {
      throw new Error(`${module.id} renderer omitted ${reproducibilityText}`);
    }
  }

  const canonicalControlCharacter = /[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f]/;
  const representativeCanonicalContent = Object.freeze({
    'suzuki-recurrence': [
      String.raw`C(r)=4e^{r/2}+br-4+T(r)`,
      String.raw`C^*(s)=\sup_{r\ge r_0}\{sr-C(r)\}`,
      String.raw`u=(C^*)'`,
      String.raw`b=a-2`,
      String.raw`T_\infty=\frac{\psi_0'(5/4)}4`,
      String.raw`\delta_0=\frac8{15}2^{-5/2}`,
      String.raw`H_1-\delta_0>2\sqrt2`,
    ],
    'prime-memory': [
      String.raw`B(r)=\sum_{p^k\le e^r,\ k\ge2}\frac{\log p}{p^{k/2}}`,
      String.raw`\kappa=-\gamma+\sum_p\frac{\log p}{\sqrt p(p-1)}`,
      String.raw`\widetilde H_p=`,
      String.raw`\widetilde c_p=`,
      String.raw`|f'(r)|\le\tfrac52re^{-r/2}`,
      'fresh block head',
    ],
    'finite-suzuki-certificate': [
      String.raw`a_0=\log(5/4)`,
      String.raw`F(H)=2H[\log(H/2)-1]`,
      String.raw`t_*=(uD-Q)/(u-\ell)\in(0,D)`,
      String.raw`R_i\ge\min`,
      String.raw`q=p^k\le10^7`,
      '4c24e9f9cdf8411292143f0e81281da86dabcf08ad0c20c6064bcdffd3da06c1',
    ],
    'spectral-head-theory': [
      String.raw`X_\lambda=L^2_{\mathrm{even}}[-\ell,\ell]`,
      String.raw`a_\lambda=\lambda^{-4}w^{-(3+2r)}`,
      String.raw`\|H_\lambda F\|\le C_r w^{-r}\|F\|`,
      'no source-origin or source-endpoint trace constraints',
      String.raw`\lambda^{-5}\le a\le\lambda^{-3}`,
      String.raw`v=g-b_gp-d_g\eta_\lambda`,
      String.raw`\|e^sa_v\|\le C\sqrt a\,w^{3/2}\|g\|`,
      String.raw`\|H_\lambda F_v\|\le C\lambda\|e^sa_v\|`,
      String.raw`P_{\rm phys}(H_\lambda+M)P_{\rm phys}`,
      'Nothing above supplies a lower bound on the correctly projected complementary diagonal block',
    ],
    'arithmetic-foundation': [
      String.raw`D(W)=\sum_{n<e^W}`,
      String.raw`S_h(W)=D(W+h)-2D(W)+D(W-h)`,
      String.raw`\Lambda=\mu_{\le U}*\log-\mu_{\le U}*1*\Lambda_{\le V}`,
      'for every real',
    ],
    'historical-routes': [
      String.raw`\partial_\tau H=-H_{zz}`,
      String.raw`\operatorname{ind}(h,h_x)=-\lfloor m/2\rfloor`,
      String.raw`q_0=\frac{2\Psi(h)}h`,
      String.raw`M_2(1/2)/M_0(1/2)<2/169`,
      'Nonvanishing alone is not zero winding',
    ],
    'spectral-denominator-repair': [
      String.raw`q_\lambda[f]\ge c_*\|f\|_2^2`,
      String.raw`P_{\rm new}=\frac{3790593}{10^6}`,
      String.raw`\Delta=P_{\rm old}-P_{\rm new}`,
      String.raw`\frac1{d_{\rm new,j}}\le\frac1{d_{\rm old,j}}\le\omega_{\rm old,j}`,
      String.raw`I-QC^{-1}Q^*>0`,
      'failed seventh-power',
    ],
  });

  for (const module of RH_RESEARCH_MODULES) {
    const canonicalBody = getCanonicalResearchBody(module.bodyPath);
    if (typeof canonicalBody !== 'string' || canonicalBody.length === 0) {
      throw new Error(`${module.id} did not load its canonical body ${module.bodyPath}`);
    }
    const diskBody = await readFile(module.bodyPath, 'utf8');
    if (canonicalBody !== diskBody) {
      throw new Error(`${module.id} canonical body differs from the checksum-pinned source bytes`);
    }
    if (canonicalControlCharacter.test(canonicalBody)) {
      throw new Error(`${module.id} canonical body contains a tab or non-newline control character`);
    }

    const canonicalMath = extractCanonicalMath(canonicalBody);
    if (canonicalMath.length === 0) {
      throw new Error(`${module.id} canonical body unexpectedly contains no mathematical expressions`);
    }
    for (const { tex, display } of canonicalMath) {
      try {
        katex.renderToString(tex, { throwOnError: true, displayMode: display });
      } catch (error) {
        throw new Error(`${module.id} canonical TeX failed to parse (${tex}): ${error.message}`);
      }
    }

    const publishedPageHtml = publishedPageHtmlById.get(module.id);
    if (!publishedPageHtml?.includes('class="canonical-research-body"')) {
      throw new Error(`${module.id} rendered page omitted the canonical proof-note section`);
    }
    if (!publishedPageHtml.includes(`data-canonical-body-path="${module.bodyPath}"`)) {
      throw new Error(`${module.id} rendered page did not bind its declared canonical body path`);
    }
    const canonicalByteLength = Buffer.byteLength(canonicalBody, 'utf8');
    if (!publishedPageHtml.includes(`data-canonical-source-bytes="${canonicalByteLength}"`)) {
      throw new Error(`${module.id} rendered page did not expose the exact canonical source byte length`);
    }
    const renderedMathCount = countOccurrences(publishedPageHtml, 'canonical-math-source');
    if (renderedMathCount !== canonicalMath.length) {
      throw new Error(
        `${module.id} rendered ${renderedMathCount} of ${canonicalMath.length} canonical math expressions`,
      );
    }
    const headingCount = (canonicalBody.match(/^#{1,6}\s+/gm) || []).length;
    if (countOccurrences(publishedPageHtml, 'id="canonical-') < headingCount) {
      throw new Error(`${module.id} canonical renderer omitted one or more Markdown headings`);
    }
    if (/^\|.+\|\n\|\s*:?-+/m.test(canonicalBody) &&
        !publishedPageHtml.includes('class="canonical-research-table"')) {
      throw new Error(`${module.id} canonical renderer omitted its Markdown table`);
    }
    if (/\[[^\]]+\]\(https?:\/\//.test(canonicalBody)) {
      const firstHref = canonicalBody.match(/\[[^\]]+\]\((https?:\/\/[^\s)]+)\)/)?.[1];
      if (!firstHref || !publishedPageHtml.includes(`href="${firstHref}"`)) {
        throw new Error(`${module.id} canonical renderer omitted its source link`);
      }
    }

    const normalizedBody = normalizeCanonicalSource(canonicalBody);
    for (const expected of representativeCanonicalContent[module.id] || []) {
      if (!normalizedBody.includes(normalizeCanonicalSource(expected))) {
        throw new Error(`${module.id} canonical source omitted representative content: ${expected}`);
      }
    }
  }

  const markdownFeatureFixture = String.raw`# Canonical fixture

Paragraph with **strong text**, inline \(x^2+1\), and a [source](https://example.com/proof).

- unordered item
- second item

1. ordered item
2. second ordered item

| symbol | meaning |
|---|---|
| \(x\) | coordinate |

~~~text
verbatim proof receipt
~~~

\[
\int_0^1 x\,dx=\frac12
\]`;
  const markdownFeatureHtml = renderToStaticMarkup(
    React.createElement(CanonicalMarkdownDocument, { source: markdownFeatureFixture }),
  );
  for (const [label, token] of [
    ['heading', 'id="canonical-canonical-fixture"'],
    ['strong text', '<strong>strong text</strong>'],
    ['unordered list', '<ul'],
    ['ordered list', '<ol'],
    ['table', 'class="canonical-research-table"'],
    ['fenced code', '<pre'],
    ['source link', 'href="https://example.com/proof"'],
  ]) {
    if (!markdownFeatureHtml.includes(token)) {
      throw new Error(`canonical Markdown renderer omitted ${label}`);
    }
  }
  if (countOccurrences(markdownFeatureHtml, 'canonical-math-source') !== 3) {
    throw new Error('canonical Markdown renderer omitted inline, table-cell, or display mathematics');
  }
  const historicalRoutes = RH_RESEARCH_MODULES.find((module) => module.id === 'historical-routes');
  if (!historicalRoutes) throw new Error('published registry omitted the historical route atlas');

  const historicalStrings = collectRuntimeStrings(historicalRoutes);
  const controlCharacter = /[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f]/;
  const corruptedString = historicalStrings.find(({ value }) => controlCharacter.test(value));
  if (corruptedString) {
    throw new Error(`historical route runtime text contains a control character at ${corruptedString.path}`);
  }

  const historicalMath = historicalStrings.flatMap(({ path, value }) => (
    extractInlineMath(value).map((tex) => ({ path, tex }))
  ));
  if (historicalMath.length < 20) {
    throw new Error(`historical route runtime math inventory unexpectedly small: ${historicalMath.length}`);
  }
  for (const { path, tex } of historicalMath) {
    try {
      katex.renderToString(tex, { throwOnError: true, displayMode: false });
    } catch (error) {
      throw new Error(`historical route runtime TeX failed to render at ${path}: ${error.message}`);
    }
  }

  const thetaBoundary = historicalRoutes.claimBoundary.doesNotClaim.find((claim) => claim.includes('PR 17'));
  const overloadedCoordinates = historicalRoutes.claimBoundary.doesNotClaim.find(
    (claim) => claim.includes('spectral-support'),
  );
  const historicalRenderCases = [
    {
      label: 'theta finite-box inequalities',
      source: thetaBoundary,
      tex: String.raw`|x|\le13,\quad 0\le\tau\le1/2`,
      sourceTokens: [String.raw`\le`, String.raw`\tau`],
      renderedSymbols: ['≤', 'τ'],
    },
    {
      label: 'theta Cartesian product',
      source: thetaBoundary,
      tex: String.raw`[0,1/2]\times[200,220]`,
      sourceTokens: [String.raw`\times`],
      renderedSymbols: ['×'],
    },
    {
      label: 'overloaded Lambda coordinates',
      source: overloadedCoordinates,
      tex: String.raw`\lambda,\quad\Lambda,\quad\Lambda(n)`,
      sourceTokens: [String.raw`\lambda`, String.raw`\Lambda`, String.raw`\Lambda(n)`],
      renderedSymbols: ['λ', 'Λ'],
    },
  ];
  for (const renderCase of historicalRenderCases) {
    if (!renderCase.source) throw new Error(`historical route omitted ${renderCase.label}`);
    for (const token of renderCase.sourceTokens) {
      if (!renderCase.source.includes(token)) {
        throw new Error(`historical route runtime text lost ${token} in ${renderCase.label}`);
      }
    }
    const rendered = katex.renderToString(renderCase.tex, {
      throwOnError: true,
      displayMode: false,
    });
    for (const symbol of renderCase.renderedSymbols) {
      if (!rendered.includes(symbol)) {
        throw new Error(`historical route KaTeX regression omitted ${symbol} in ${renderCase.label}`);
      }
    }
  }

  const structuredRenderCases = Object.freeze({
    'arithmetic-foundation': [
      'vaughan-explicit-constants',
      'second-order-quadrature',
      'finite-i4-definition',
    ],
    'historical-routes': [
      'local-collision-index',
      'theta-central-lower-bound',
      'theta-certified-moment-ratio',
      'toeplitz-compression',
    ],
    'spectral-denominator-repair': [
      'repair-actual-form',
      'exact-denominator-lift',
      'old-far-majorant-remains-valid',
      'repaired-gate-counts',
      'repaired-existential-floor',
    ],
    'spectral-head-theory': [
      'critical-head-definition',
      'actual-head-action',
      'spectral-head-rank',
      'actual-coordinate-gram',
      'exact-origin-defect-bound',
      'repaired-source',
      'weighted-two-tail-bound',
      'tail-to-window-action',
      'normalized-uniform-action',
      'physical-off-head-bridge',
    ],
  });
  for (const [moduleId, equationIds] of Object.entries(structuredRenderCases)) {
    const html = publishedPageHtmlById.get(moduleId);
    if (!html) throw new Error(`published page HTML missing for ${moduleId}`);
    for (const equationId of equationIds) {
      if (!html.includes(`data-research-equation-id="${equationId}"`)) {
        throw new Error(`${moduleId} rendered page omitted structured equation ${equationId}`);
      }
    }
  }

  const failedRouteModule = RH_RESEARCH_MODULES.find((module) => module.failures.length > 0);
  if (!failedRouteModule) throw new Error('published registry omitted failed-route evidence');
  const failedRouteHtml = renderToStaticMarkup(wrap(
    React.createElement(ResearchModulePage, { module: failedRouteModule }),
  ));
  if (!failedRouteHtml.includes('Failed surrogate records')) {
    throw new Error('published detail renderer omitted failed-route evidence');
  }

  const suzukiRecurrence = RH_RESEARCH_MODULES.find((module) => module.id === 'suzuki-recurrence');
  if (!suzukiRecurrence) throw new Error('published registry omitted the Suzuki recurrence module');
  const recurrenceEquationIds = new Set([
    ...(suzukiRecurrence.theorem.equations || []),
    ...suzukiRecurrence.derivation.flatMap((step) => step.equations || []),
  ].map((equation) => equation.id));
  for (const requiredId of [
    'psi-definition',
    'convex-conjugate-definitions',
    'event-state',
    'next-event-abbreviations',
    'interior-maximizer-gate',
  ]) {
    if (!recurrenceEquationIds.has(requiredId)) {
      throw new Error(`Suzuki recurrence display data omitted load-bearing equation ${requiredId}`);
    }
  }
  const suzukiDisplayedData = normalizeTeX(collectStrings({
    summary: suzukiRecurrence.summary,
    claimBoundary: suzukiRecurrence.claimBoundary,
    theorem: suzukiRecurrence.theorem,
    derivation: suzukiRecurrence.derivation,
  }).join('\n'));
  const loadBearingDefinitions = [
    ['C(r)', 'C(r)='],
    ['C*(s)', 'C^*(s)='],
    ['u=(C*)\'', "u(s)=(C^*)'(s)="],
    ['b', 'b=a-2'],
    ['T_infinity', 'T_\\infty='],
    ['delta_0', '\\delta_0='],
    ['first-event interior gate', 'H_1-\\delta_0>2\\sqrt2'],
  ];
  for (const [label, requiredTeX] of loadBearingDefinitions) {
    if (!suzukiDisplayedData.includes(requiredTeX)) {
      throw new Error(`Suzuki recurrence display data omitted the load-bearing ${label} definition or gate`);
    }
  }
  if (suzukiRecurrence.rhStatus !== 'open' || !suzukiRecurrence.claimBoundary.doesNotClaim.some(
    (claim) => /prove RH/i.test(claim),
  )) {
    throw new Error('Suzuki recurrence completeness repair weakened the RH-open scope boundary');
  }
  const suzukiPageHtml = renderToStaticMarkup(wrap(
    React.createElement(ResearchModulePage, {
      module: suzukiRecurrence,
      indexRoute: '/rh-research-modules',
    }),
  ));
  const renderedEquationCount = (suzukiPageHtml.match(/class="math-block math-clickable"/g) || []).length;
  if (renderedEquationCount < equationCount(suzukiRecurrence)) {
    throw new Error(
      `Suzuki recurrence renderer emitted fewer than its ${equationCount(suzukiRecurrence)} structured equations`,
    );
  }
  if (!suzukiPageHtml.includes('RH remains open')) {
    throw new Error('Suzuki recurrence rendered page omitted the permanent RH-open boundary');
  }

  const spectralHead = RH_RESEARCH_MODULES.find((module) => module.id === 'spectral-head-theory');
  if (!spectralHead) throw new Error('published registry omitted the spectral-head theory module');
  if (spectralHead.status !== 'proved-estimate') {
    throw new Error('spectral-head result must remain classified as an actual proved estimate');
  }
  if (spectralHead.verification.reproducibilityStatus !== 'partial' ||
      spectralHead.verification.replays.length !== 0) {
    throw new Error('spectral-head module misrepresented partial analytic availability as a replay');
  }
  if (spectralHead.rhStatus !== 'open' || !spectralHead.claimBoundary.doesNotClaim.some(
    (claim) => /prove RH/i.test(claim),
  )) {
    throw new Error('spectral-head module weakened the permanent RH-open boundary');
  }
  if (!spectralHead.claimBoundary.doesNotClaim.some(
    (claim) => /whole-even positivity|complement coercivity/i.test(claim),
  )) {
    throw new Error('spectral-head module omitted its whole-even/complement nonclaim');
  }

  const spectralRuntimeStrings = collectRuntimeStrings(spectralHead);
  const spectralCorruption = spectralRuntimeStrings.find(({ value }) => controlCharacter.test(value));
  if (spectralCorruption) {
    throw new Error(`spectral-head runtime text contains a control character at ${spectralCorruption.path}`);
  }
  const spectralEquations = [
    ...spectralHead.theorem.equations,
    ...spectralHead.derivation.flatMap((step) => step.equations),
  ];
  for (const equation of spectralEquations) {
    try {
      katex.renderToString(equation.tex, { throwOnError: true, displayMode: true });
    } catch (error) {
      throw new Error(`spectral-head structured TeX failed to render at ${equation.id}: ${error.message}`);
    }
  }
  const spectralAction = spectralHead.theorem.equations.find(
    (equation) => equation.id === 'actual-head-action',
  )?.tex || '';
  for (const token of [String.raw`\lambda`, String.raw`\operatorname`, String.raw`\|H_\lambda F\|`]) {
    if (!spectralAction.includes(token)) {
      throw new Error(`spectral-head runtime theorem text lost ${token}`);
    }
  }
  const spectralPageHtml = publishedPageHtmlById.get('spectral-head-theory');
  if (!spectralPageHtml?.includes('class="ed-grade g-thm">THEOREM</span>')) {
    throw new Error('spectral-head proved estimate did not render with theorem grade');
  }
  for (const requiredText of [
    'Actual proved estimate / partial availability',
    'proved estimate',
    'partial reproducibility',
    'The complementary sector has no proved floor',
    'RH remains open',
  ]) {
    if (!spectralPageHtml?.includes(requiredText)) {
      throw new Error(`spectral-head rendered page omitted ${requiredText}`);
    }
  }
} finally {
  await vite.close();
}

console.log('RH research renderer compile and render: PASS');
