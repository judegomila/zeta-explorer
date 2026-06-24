/**
 * @module data/section26-page-wiring-tripwire
 * @fileoverview imp-2790 build-time tripwire: asserts that at least one file
 * under src/pages/ imports section26-verdict-volterra-not-a-reduction-2026-06-18.js,
 * preventing the definitive Volterra-refutation verdict from becoming page-orphaned.
 *
 * This module is intentionally NOT imported by any page (it uses node:fs which
 * is not available in the browser bundle). The assertion runner (run-assertions.mjs)
 * auto-discovers it by scanning for *_ASSERTIONS exports in src/data/.
 *
 * Assertion:
 *   sec26-wired-into-at-least-one-page — scans src/pages/*.{js,jsx} and checks
 *   that at least one file contains the module name string, confirming the verdict
 *   is reachable from the page layer.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODULE_NAME = 'section26-verdict-volterra-not-a-reduction-2026-06-18';
const PAGES_DIR = path.resolve(__dirname, '../pages');

export const SECTION26_PAGE_WIRING_ASSERTIONS = [
  {
    id: 'sec26-wired-into-at-least-one-page',
    description: 'At least one file under src/pages/ imports the section26 Volterra-refutation verdict module (imp-2790)',
    holds: () => {
      try {
        const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.jsx') || f.endsWith('.js'));
        return files.some(f => {
          try {
            const src = fs.readFileSync(path.join(PAGES_DIR, f), 'utf-8');
            return src.includes(MODULE_NAME);
          } catch { return false; }
        });
      } catch { return false; }
    },
  },
];

for (const a of SECTION26_PAGE_WIRING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      "[imp-2790] section26-page-wiring-tripwire: no file under src/pages/ imports " +
      MODULE_NAME + " — the Volterra-refutation verdict is page-orphaned. " +
      "Wire it into at least one page (e.g. CollapseChainPage.jsx)."
    );
  }
}
