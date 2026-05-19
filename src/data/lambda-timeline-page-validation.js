// imp-1093 build-time validation for src/pages/LambdaTimelinePage.jsx.
//
// Three tripwires:
//   imp1093-page-renders            -- file exists and is non-empty
//   imp1093-cites-imp-440-and-imp-1088 -- the page source contains both ids
//   imp1093-uses-d3-scale           -- the page imports from d3-scale
//
// We read the page source via node:fs so this validates the actual on-disk
// artifact rather than a re-imported module (the page is a React component
// and importing it under SSR drags in JSX runtime which is overkill for
// these structural checks).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGE_PATH = path.resolve(__dirname, '../pages/LambdaTimelinePage.jsx');

function readPage() {
  try {
    return fs.readFileSync(PAGE_PATH, 'utf-8');
  } catch (e) {
    return null;
  }
}

export const LAMBDA_TIMELINE_PAGE_VALIDATION = Object.freeze({
  id: 'imp-1093-lambda-timeline-page-validation',
  ticket: 'imp-1093',
  pagePath: 'src/pages/LambdaTimelinePage.jsx',
  routePath: '/lambda-timeline',
  consumes: [
    'src/data/lambda-roadmap.js (LAMBDA_BOUNDS)',
    'src/data/finite-k-c-mb-unconditional.js (K_PLATEAU_LADDER)',
    'src/data/finite-height-beats-platt-trudgian.js (FINITE_HEIGHT_BEATS_PLATT_TRUDGIAN)',
  ],
  closesTickets: ['imp-1093'],
  description:
    'Lambda timeline visualization page with horizontal log-N axis, three ' +
    'regime bands (measured / carryforward / GUE-conditional), PT 2021 ' +
    'reference line, rescue-margin secondary axis, and per-bound annotations.',
});

export const LAMBDA_TIMELINE_PAGE_VALIDATION_ASSERTIONS = [
  {
    id: 'imp1093-page-renders',
    holds: () => {
      const src = readPage();
      return src != null && src.length > 1000 && src.includes('export default function LambdaTimelinePage');
    },
    why:
      'The page must exist on disk, exceed a minimum size (1000 bytes) and ' +
      'export the default React component named LambdaTimelinePage. ' +
      'A removal or rename would silently break the /lambda-timeline route.',
  },
  {
    id: 'imp1093-cites-imp-440-and-imp-1088',
    holds: () => {
      const src = readPage();
      if (src == null) return false;
      return src.includes('imp-440') && src.includes('imp-1088');
    },
    why:
      'The Lambda timeline page must explicitly cite both imp-440 (the ' +
      'measured rigorous unconditional beat at N = 1e4) and imp-1088 (the ' +
      'carryforward CAPSTONE extension at N = 1e6) so the page legend is ' +
      'auditable against the consumer record in ' +
      'finite-height-beats-platt-trudgian.js. Dropping either reference ' +
      'breaks the provenance chain.',
  },
  {
    id: 'imp1093-uses-d3-scale',
    holds: () => {
      const src = readPage();
      if (src == null) return false;
      return src.includes("from 'd3-scale'");
    },
    why:
      'The ticket specifies d3-scale for the log-N axis. d3 is in ' +
      'package.json dependencies; importing from d3-scale is the load-' +
      'bearing requirement that allows scaleLog to be tree-shaken cleanly.',
  },
];
