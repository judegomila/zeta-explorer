import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { build, createServer } from 'vite';

const { RH_RESEARCH_CONTRACT_FIXTURE: fixture } = await import(
  './check-rh-research-module-contract.mjs'
);

const entries = [
  'src/components/rh-research/ResearchModulePage.jsx',
  'src/components/rh-research/ResearchModuleIndex.jsx',
];

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
  ] = await Promise.all([
    vite.ssrLoadModule('/src/components/rh-research/ResearchModulePage.jsx'),
    vite.ssrLoadModule('/src/components/rh-research/ResearchModuleIndex.jsx'),
    vite.ssrLoadModule('/src/data/rh-research/registry.js'),
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
  const failedRouteModule = RH_RESEARCH_MODULES.find((module) => module.failures.length > 0);
  if (!failedRouteModule) throw new Error('published registry omitted failed-route evidence');
  const failedRouteHtml = renderToStaticMarkup(wrap(
    React.createElement(ResearchModulePage, { module: failedRouteModule }),
  ));
  if (!failedRouteHtml.includes('Failed surrogate records')) {
    throw new Error('published detail renderer omitted failed-route evidence');
  }
} finally {
  await vite.close();
}

console.log('RH research renderer compile and render: PASS');
