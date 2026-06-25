/**
 * imp-2784: v52 dashboard finite-beat wording-consistency tripwire.
 *
 * full-route-map-2026-06-19.js labels Route A (the finite-N* = 1e4 beat) as an
 * "ESTIMATE, gated on C_H"; RHProofStateDashboardPage and RigorDashboardPage
 * both render the finite beat under amber "NUMERICAL ESTIMATE (not rigorous)"
 * cards (the finiteNbeat status string itself ends "NOT rigorous"). This module
 * is the grep-checkable CHECK that the two v52 dashboard pages can never again
 * silently call the finite beat rigorous/unconditional: it scans the page source
 * line-by-line and FAILS the build if any line that names the finite-N* beat
 * also makes a positive rigorous/unconditional claim without a downgrade
 * qualifier on the same line.
 *
 * The page sources are read as plain text via node:fs (no JSX evaluation, no
 * heavy zeros bundle), so this sibling is safe under the run-assertions Vite SSR
 * loader.
 */

import fs from 'node:fs';
import path from 'node:path';

const V52_DASHBOARD_PAGES = [
  'src/pages/RHProofStateDashboardPage.jsx',
  'src/pages/RigorDashboardPage.jsx',
];

// Names the finite-N* beat: "finite-N*", "finite N*", "finiteNbeat".
const FINITE_BEAT_ANCHOR = /finite[-\s]?n\*?/i;
// A positive rigour claim on the same line.
const POSITIVE_RIGOR_CLAIM = /\b(rigorous|unconditional)\b/i;
// Downgrade / negation qualifiers that make a rigour word safe on the line.
const DOWNGRADE_QUALIFIER = /not rigorous|no rigorous|negative on rigorous|estimate|not a proof|gated|contingent|conditional|downgrad/i;

function readPage(relPath) {
  const abs = path.join(process.cwd(), relPath);
  return fs.readFileSync(abs, 'utf8');
}

// Returns the list of offending "finite beat called rigorous" lines for one
// page (empty when the page is clean).
function finiteBeatRigorViolations(relPath) {
  let src;
  try {
    src = readPage(relPath);
  } catch (_e) {
    // Treat an unreadable page as a violation so a moved/renamed page surfaces
    // rather than silently passing the wording check.
    return [{ line: 0, text: 'UNREADABLE: ' + relPath }];
  }
  const out = [];
  src.split('\n').forEach((text, i) => {
    if (!FINITE_BEAT_ANCHOR.test(text)) return;
    if (!POSITIVE_RIGOR_CLAIM.test(text)) return;
    if (DOWNGRADE_QUALIFIER.test(text)) return;
    out.push({ line: i + 1, text: text.trim() });
  });
  return out;
}

function pageNamesFiniteBeat(relPath) {
  try {
    return FINITE_BEAT_ANCHOR.test(readPage(relPath));
  } catch (_e) {
    return false;
  }
}

export const DASHBOARD_FINITE_BEAT_WORDING_ASSERTIONS = [
  {
    id: 'imp-2784-v52-pages-name-finite-beat',
    description: 'Both v52 dashboard pages still render a finite-N* beat row (premise of the wording tripwire).',
    why: 'A v52 dashboard page dropped the finite-N* beat row, so the wording tripwire has nothing to anchor on.',
    holds: () => V52_DASHBOARD_PAGES.every(pageNamesFiniteBeat),
  },
  {
    id: 'imp-2784-finite-beat-never-called-rigorous',
    description: 'No v52 dashboard page calls the finite-N* beat rigorous/unconditional without a downgrade qualifier — aligning word-for-word with the route-map ESTIMATE / gated-on-C_H label.',
    why: 'A v52 dashboard page reverted to calling the finite-N* = 1e4 beat rigorous/unconditional, contradicting the full-route-map ESTIMATE (gated on C_H) verdict and the amber NUMERICAL-ESTIMATE cards.',
    holds: () => V52_DASHBOARD_PAGES.every((p) => finiteBeatRigorViolations(p).length === 0),
  },
];
