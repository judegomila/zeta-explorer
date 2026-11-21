/**
 * Build-time tripwires for the evidence-graded de Bruijn-Newman timeline.
 *
 * The page now presents the literature/public-package chronology. Internal
 * finite-N model estimates belong on their own audit pages and must not be
 * promoted into this historical ledger.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PAGE_PATH = path.resolve(__dirname, '../pages/LambdaTimelinePage.jsx');

function readPage() {
  try {
    return fs.readFileSync(PAGE_PATH, 'utf-8');
  } catch {
    return null;
  }
}

export const LAMBDA_TIMELINE_PAGE_VALIDATION = Object.freeze({
  id: 'lambda-timeline-evidence-ledger-validation',
  pagePath: 'src/pages/LambdaTimelinePage.jsx',
  routePath: '/lambda-timeline',
  consumes: ['src/data/lambda-historical-timeline.js (LAMBDA_TIMELINE)'],
  description:
    'Evidence-graded chronology separating the accepted peer-reviewed 0.2 benchmark, public unrefereed packages, and the publicly posted, unrefereed 0.1787854 proof candidate.',
});

export const LAMBDA_TIMELINE_PAGE_VALIDATION_ASSERTIONS = [
  {
    id: 'lambda-timeline-page-renders',
    holds: () => {
      const src = readPage();
      return src != null && src.length > 1000 && src.includes('export default function LambdaTimelinePage');
    },
    why: 'The /lambda-timeline page must continue to export a substantive React component.',
  },
  {
    id: 'lambda-timeline-uses-canonical-history',
    holds: () => {
      const src = readPage();
      return src != null
        && src.includes('LAMBDA_TIMELINE')
        && src.includes('lambda-historical-timeline.js');
    },
    why: 'The page must render the canonical, assertion-checked chronology rather than duplicate bound data.',
  },
  {
    id: 'lambda-timeline-separates-evidence-grades',
    holds: () => {
      const src = readPage();
      return src != null
        && src.includes('peer-reviewed')
        && src.includes('public package claim')
        && src.includes('publicly posted')
        && src.includes('not established')
        && src.includes('review-01787854-v3')
        && src.includes('2e9976c4becbf97e31c56fe75fce07cdff5dd4ea')
        && src.includes('/newman-lambda-01787854-candidate');
    },
    why:
      'Readers must be able to distinguish the accepted peer-reviewed 0.2 benchmark, public unrefereed package claims, and the publicly posted, unrefereed 0.1787854 proof candidate.',
  },
  {
    id: 'lambda-timeline-excludes-internal-finite-n-bounds',
    holds: () => {
      const src = readPage();
      return src != null
        && !src.includes('finite-height-beats-platt-trudgian')
        && !src.includes('K_PLATEAU_LADDER')
        && !src.includes('imp-440');
    },
    why: 'Internal finite-N model figures must not be presented as entries in the historical bound ledger.',
  },
];
