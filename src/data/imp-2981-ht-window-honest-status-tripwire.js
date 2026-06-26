/**
 * @module data/imp-2981-ht-window-honest-status-tripwire
 *
 * imp-2981 (accuracy, proof-hygiene): a build-time TRIPWIRE guarding the two
 * H_t finite-window data files
 *   - ht-finite-window-census-2026-06.js   (feeds /ht-window-census)
 *   - ht-corridor-certificates-2026-06.js  (feeds /ht-corridor-certificates)
 * against the "finite-beat-is-rigorous" regression. These pages are finite-window
 * NUMERICAL certificates (an exact zero count in a bounded window / per-cell
 * interval theorems), NOT a rigorous unconditional global Lambda bound. The risk
 * is a future edit adding a row label or sentence that asserts a rigorous /
 * unconditional Λ < 0.2 (or Λ-record) without an honesty hedge, silently
 * upgrading a numerical certificate to a global proof.
 *
 * The tripwire reads each file's raw text (import-light: node:fs only, so it
 * never pulls the data module or any heavy bundle into the assertion run),
 * splits it into clauses, and FAILS THE BUILD if any clause pairs a rigor word
 * (rigorous / unconditional) with a Lambda-upper-bound token (Λ &lt; 0.2,
 * Λ ≤ 0.19, Λ bound, Λ record) WITHOUT an honesty qualifier (not / finite-window
 * / numerical / conditional / estimate / modulo / bounded) in the SAME clause.
 *
 * Both files also export an explicit honestStatus stamp (added in this ticket);
 * those clauses carry the "not a rigorous unconditional Λ bound" hedge and so are
 * NOT offenders. The current offender count is 0 and the tripwire pins it there.
 *
 * This module is intentionally NOT imported by any page (node:fs is unavailable
 * in the browser bundle). run-assertions.mjs auto-discovers it by scanning for
 * the *_ASSERTIONS export, and it is wired into DATA_MODULES.
 *
 * @see anti-overclaim-finite-beat-guard (sibling finite-N beat tripwire)
 * @see imp-2606 module docs on the two H_t data files
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = __dirname;

// The two H_t finite-window data files whose prose / row labels are scanned.
const SCANNED_FILES = [
  'ht-finite-window-census-2026-06',
  'ht-corridor-certificates-2026-06',
];

// A clause asserts rigor if it uses a load-bearing rigor word.
const RIGOR_RE = /\b(rigorous|rigorously|unconditional|unconditionally)\b/i;
// A clause asserts a global Lambda upper bound / record (the thing a finite
// window must NOT claim): Lambda or Λ followed by <, ≤, <=, "record", or "bound".
const LAMBDA_BOUND_RE = /(?:Λ|Lambda)\s*(?:[<≤]|<=|record|bound)/i;
// A clause is honestly hedged if it disclaims the global reading.
// Note: \bconditional\b deliberately does NOT match "unconditional" (no word
// boundary before the embedded "conditional"), so a rigor word never self-hedges.
const HEDGE_RE =
  /(\bnot\b|finite[- ]?window|numerical|\bconditional\b|estimate|modulo|bounded)/i;

// Split file text into clauses on newlines, sentence-enders, and dash separators
// (same scheme as anti-overclaim-finite-beat-guard).
const CLAUSE_SPLIT = /(?:\r?\n|(?<=[.;:])\s+|\s+[—–-]{1,2}\s+)/;

const normalize = (s) => s.replace(/\s+/g, ' ').trim();

// Scan one file: return the normalized clauses that pair a rigor word with a
// Lambda-bound token but carry no honesty hedge. null => file unreadable.
function scanOffenders(name) {
  let txt;
  try {
    txt = fs.readFileSync(path.join(DATA_DIR, name + '.js'), 'utf-8');
  } catch {
    return null;
  }
  const offenders = [];
  for (const clause of txt.split(CLAUSE_SPLIT)) {
    if (
      RIGOR_RE.test(clause) &&
      LAMBDA_BOUND_RE.test(clause) &&
      !HEDGE_RE.test(clause)
    ) {
      offenders.push(normalize(clause).slice(0, 160));
    }
  }
  return offenders;
}

const AUDIT = SCANNED_FILES.map((name) => {
  const offenders = scanOffenders(name);
  return {
    name,
    fileFound: offenders !== null,
    offenders: offenders || [],
  };
});

const ALL_FILES_FOUND = AUDIT.every((a) => a.fileFound);
const NO_RIGOROUS_LAMBDA_CLAIM = AUDIT.every((a) => a.offenders.length === 0);

export const HT_WINDOW_HONEST_STATUS_TRIPWIRE = {
  id: 'imp-2981',
  question:
    'Does any row label or sentence in the two H_t finite-window data files assert a ' +
    'rigorous / unconditional global Lambda < 0.2 (or Λ-record) without an honesty hedge?',
  scannedFiles: SCANNED_FILES,
  audit: AUDIT,
  allFilesFound: ALL_FILES_FOUND,
  noRigorousLambdaClaim: NO_RIGOROUS_LAMBDA_CLAIM,
  verdict:
    'No clause in the H_t census / corridor data files pairs rigorous/unconditional with a ' +
    'global Lambda upper bound or Lambda record unhedged. Both pages carry an explicit ' +
    'honestStatus stamp marking them finite-window NUMERICAL certificates, not a rigorous ' +
    'unconditional Lambda bound. The finite-window result cannot silently be read as a global ' +
    'proof without a red build.',
};

export const HT_WINDOW_HONEST_STATUS_TRIPWIRE_ASSERTIONS = [
  {
    id: 'imp2981-both-ht-files-present',
    description: 'Both H_t finite-window data files exist and are readable',
    holds: () => ALL_FILES_FOUND,
  },
  {
    id: 'imp2981-honest-status-stamp-present',
    description:
      'Both H_t finite-window data files export an honestStatus stamp string ' +
      'containing the finite-window NUMERICAL-certificate disclaimer',
    holds: () =>
      AUDIT.every((a) => {
        if (!a.fileFound) return false;
        const txt = fs.readFileSync(path.join(DATA_DIR, a.name + '.js'), 'utf-8');
        return /export const honestStatus/.test(txt) && /finite-window NUMERICAL/i.test(txt);
      }),
  },
  {
    id: 'imp2981-no-rigorous-unconditional-lambda-claim',
    description:
      'No clause pairs rigorous/unconditional with a global Lambda < 0.2 / Lambda record ' +
      'token without an honesty hedge (not / finite-window / numerical / conditional / estimate)',
    holds: () => NO_RIGOROUS_LAMBDA_CLAIM,
  },
];

for (const a of HT_WINDOW_HONEST_STATUS_TRIPWIRE_ASSERTIONS) {
  if (!a.holds()) {
    const offenders = AUDIT.filter((r) => r.offenders.length > 0)
      .map((r) => r.name + ' [' + r.offenders.join(' | ') + ']')
      .join('; ');
    throw new Error(
      '[imp-2981] ht-window-honest-status-tripwire assertion failed: ' + a.id +
        (offenders
          ? ' -- a clause asserts a rigorous/unconditional global Lambda < 0.2 (or Lambda record) ' +
            'without an honesty hedge. The H_t census / corridor pages are finite-window NUMERICAL ' +
            'certificates, NOT a global Lambda bound; add the finite-window / not-a-bound qualifier ' +
            'in the same clause. Offending files: ' + offenders
          : '')
    );
  }
}
