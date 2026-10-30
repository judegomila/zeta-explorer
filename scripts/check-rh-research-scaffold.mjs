import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { readFile } from 'node:fs/promises';
import katex from 'katex';
import { build, createServer } from 'vite';

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
    snippets.push((match[1] || match[2] || match[3] || match[4]).trim());
  }
  return snippets;
}

function normalizeCanonicalSource(value) {
  return value.replace(/\s+/g, '');
}

function countOccurrences(value, needle) {
  return value.split(needle).length - 1;
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
    const reproducibilityText = module.verification.reproducibilityStatus === 'current-replay'
      ? 'current independent replay'
      : 'partial reproducibility';
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
    for (const tex of canonicalMath) {
      try {
        katex.renderToString(tex, { throwOnError: true, displayMode: false });
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
} finally {
  await vite.close();
}

console.log('RH research renderer compile and render: PASS');
