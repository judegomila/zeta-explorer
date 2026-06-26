/**
 * @module data/phantom-citation-guard
 *
 * imp-2751 (accuracy, proof-hygiene): a build-time TRIPWIRE that maintains a
 * DENYLIST of REFUTED phantom citations and FAILS THE BUILD if a denylisted
 * citation reappears as LOAD-BEARING live support (cited as a real result one
 * leans on) rather than as a documented refutation/retraction.
 *
 * SEED ENTRY -- "Soundararajan-Tao 2024" (imp-1331)
 * -------------------------------------------------
 * imp-1331 walked the candidate named "Soundararajan-Tao 2024" (introduced in
 * imp-1321 as a sharper-mollifier refinement source) to a REFUTED verdict:
 * there is NO joint Soundararajan-Tao 2024 paper giving an explicit moment /
 * mollifier refinement -- it is a PHANTOM citation to a wrong / non-existent
 * object (full-route-map-2026-06-19.js: status REFUTED, "PHANTOM citation;
 * wrong object"). Nothing currently stops the same fabricated citation from
 * being re-introduced elsewhere as if it were a real, load-bearing result.
 *
 * WHAT COUNTS AS A VIOLATION
 * --------------------------
 * The scanner splits every src/data/*.js file into clauses and, for each clause
 * that names a denylisted citation, classifies the clause as:
 *   - REFUTATIONAL (allowed): the clause itself carries a refutation/retraction
 *     marker (REFUTED / PHANTOM / wrong object / non-existent / no joint / does
 *     not exist / fabricated / candidate / audit / HONEST / imp-1331 / denylist),
 *     i.e. it is documenting the phantom, not relying on it.
 *   - LOAD-BEARING (forbidden if NEW): the clause cites the denylisted name with
 *     no refutation marker in the same clause -- i.e. as live support.
 *
 * WHY A FROZEN BASELINE (HONEST PARTIAL)
 * --------------------------------------
 * Several files predating imp-1331's verdict still mention "Soundararajan-Tao
 * 2024" in candidate / refinement-source framing without a co-located refutation
 * marker (imp-1321, imp-1322, literature.js, the imp-1331 audit file itself
 * where clauses split away from their REFUTED verdict, and the queue /
 * improvements logs). Mass-rewriting that historical record is a SEPARATE ticket,
 * not something this one atomic guard should do. So the tripwire snapshots the
 * currently-known load-bearing clauses into a FROZEN_BASELINE (per-file djb2
 * signatures of the normalized clause text) and FAILS only when a clause appears
 * that is NOT in the baseline -- i.e. a freshly re-introduced phantom citation.
 * Removing baseline clauses (prose getting cleaned up) is always allowed and is
 * surfaced as cleanup progress.
 *
 * NAMED SUB-GAP -- gap-imp2751-legacy-phantom-cite-restatement: the baseline
 * clauses still use pre-imp-1331 candidate framing for the phantom citation; a
 * full honest restatement (adding a co-located refutation marker to each) is
 * deferred to a follow-up ticket. This guard locks the state so the count of
 * unmarked load-bearing phantom citations cannot GROW.
 *
 * EXTENSIBILITY: add a new {id, name, pattern, note} to DENYLIST when a future
 * phantom citation is caught; capture its baseline signatures the same way.
 *
 * This module is intentionally NOT imported by any page (it uses node:fs, which
 * is unavailable in the browser bundle). run-assertions.mjs auto-discovers it by
 * scanning for the *_ASSERTIONS export, and it is wired into DATA_MODULES.
 *
 * @see imp-1331 REFUTED phantom citation; full-route-map-2026-06-19.js
 * @see anti-overclaim-finite-beat-guard.js (sibling frozen-baseline prose tripwire)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = __dirname;

// The denylist of REFUTED phantom citations. Each entry pairs a display name
// with a case-insensitive matcher. Extend this when a new phantom is caught.
const DENYLIST = [
  {
    id: 'soundararajan-tao-2024',
    name: 'Soundararajan-Tao 2024',
    pattern: /soundararajan[- ]tao\s*2024/i,
    note: 'PHANTOM citation; wrong object (imp-1331 REFUTED -- no such joint paper).',
  },
];

// A clause is refutational (allowed) if it carries any of these markers in the
// SAME clause -- it is documenting the phantom rather than leaning on it.
const REFUTATION_RE =
  /(refuted|phantom|wrong[- ]object|wrong object|non[- ]?existent|no joint|does not exist|doesn't exist|fabricat|candidate|audit|honest|honesty|not invent|no such|imp-1331|denylist)/i;

// Split file text into clauses on newlines, sentence-enders, and dash separators.
const CLAUSE_SPLIT = /(?:\r?\n|(?<=[.;:])\s+|\s+[—–-]{1,2}\s+)/;

const normalize = (s) => s.replace(/\s+/g, ' ').trim().toLowerCase();

// Deterministic djb2 hash -> 8-hex signature (no node:crypto dependency).
function djb2(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

// Discover every src/data/*.js file (excluding this guard itself) to scan.
function listDataFiles() {
  try {
    return fs
      .readdirSync(DATA_DIR)
      .filter((f) => f.endsWith('.js') && f !== 'phantom-citation-guard.js')
      .sort();
  } catch {
    return [];
  }
}

// Scan one file: return the per-denylist-entry signatures of every clause that
// names a denylisted citation WITHOUT a co-located refutation marker.
function scanOffenders(file) {
  let txt;
  try {
    txt = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
  } catch {
    return new Set();
  }
  const sigs = new Set();
  for (const clause of txt.split(CLAUSE_SPLIT)) {
    for (const entry of DENYLIST) {
      if (entry.pattern.test(clause) && !REFUTATION_RE.test(clause)) {
        const n = normalize(clause);
        if (n.length > 3) sigs.add(entry.id + ':' + djb2(n));
      }
    }
  }
  return sigs;
}

// Frozen snapshot of the currently-known load-bearing (non-refutational)
// phantom-citation clauses, keyed by file -> [entryId:sig]. Captured at
// imp-2751. A current offender NOT in this set is a freshly re-introduced
// phantom citation -> red build.
const FROZEN_BASELINE = {
  'imp-1321-bui-soundararajan-rigor-port.js': [
    'soundararajan-tao-2024:0d4a1c9c',
    'soundararajan-tao-2024:750fef77',
    'soundararajan-tao-2024:7a613720',
    'soundararajan-tao-2024:e935f749',
  ],
  'imp-1322-ingham-sigma-reopt.js': [
    'soundararajan-tao-2024:244998c7',
    'soundararajan-tao-2024:46baf742',
  ],
  'imp-1331-soundararajan-tao-2024-application.js': [
    'soundararajan-tao-2024:06d5fd4f',
    'soundararajan-tao-2024:4a18bd21',
    'soundararajan-tao-2024:7195c75c',
    'soundararajan-tao-2024:9557f91c',
    'soundararajan-tao-2024:ccc1d216',
    'soundararajan-tao-2024:eca4dc67',
  ],
  'improvement-queue.js': [
    'soundararajan-tao-2024:4f0de46e',
    'soundararajan-tao-2024:7260913d',
    'soundararajan-tao-2024:9557f91c',
    'soundararajan-tao-2024:d3a90cd9',
    'soundararajan-tao-2024:e92feadb',
  ],
  'improvements.js': ['soundararajan-tao-2024:07868e7e'],
  'literature.js': ['soundararajan-tao-2024:4a18bd21'],
};

// Per-file audit: novel offenders (current minus baseline) must be empty.
const ALL_FILES = listDataFiles();
const AUDIT = [];
for (const file of ALL_FILES) {
  const current = scanOffenders(file);
  if (current.size === 0) continue;
  const baseline = new Set(FROZEN_BASELINE[file] || []);
  const novel = [...current].filter((s) => !baseline.has(s));
  const remainingBaseline = [...current].filter((s) => baseline.has(s)).length;
  AUDIT.push({ file, novel, remainingBaseline, currentCount: current.size });
}

const NO_NOVEL_PHANTOM = AUDIT.every((a) => a.novel.length === 0);
const DENYLIST_NONEMPTY = DENYLIST.length > 0;

export const PHANTOM_CITATION_GUARD = {
  id: 'imp-2751',
  question:
    'Has any NEW clause in src/data/*.js cited a denylisted REFUTED phantom citation ' +
    '(seed: Soundararajan-Tao 2024, imp-1331) as load-bearing live support, i.e. without ' +
    'a co-located refutation marker?',
  denylist: DENYLIST.map((e) => ({ id: e.id, name: e.name, note: e.note })),
  scannedFileCount: ALL_FILES.length,
  baselineCount: Object.values(FROZEN_BASELINE).reduce((n, a) => n + a.length, 0),
  audit: AUDIT,
  noNovelPhantom: NO_NOVEL_PHANTOM,
  subGap: 'gap-imp2751-legacy-phantom-cite-restatement',
  verdict:
    'No NEW load-bearing use of a denylisted phantom citation has been introduced beyond ' +
    'the frozen baseline of pre-imp-1331 candidate-framing clauses. The phantom citation ' +
    '"Soundararajan-Tao 2024" stays REFUTED (imp-1331); it cannot silently re-appear as ' +
    'live support without a red build. Restating the legacy candidate-framing clauses with ' +
    'a co-located refutation marker is the named sub-gap ' +
    'gap-imp2751-legacy-phantom-cite-restatement (separate ticket). No false QED.',
};

export const PHANTOM_CITATION_GUARD_ASSERTIONS = [
  {
    id: 'imp2751-denylist-nonempty',
    description: 'The phantom-citation denylist is non-empty (seeded with Soundararajan-Tao 2024)',
    holds: () => DENYLIST_NONEMPTY,
  },
  {
    id: 'imp2751-no-new-load-bearing-phantom-citation',
    description:
      'No NEW clause in src/data/*.js cites a denylisted REFUTED phantom citation as ' +
      'load-bearing support (lacking a co-located refutation marker) beyond the frozen baseline',
    holds: () => NO_NOVEL_PHANTOM,
  },
];

for (const a of PHANTOM_CITATION_GUARD_ASSERTIONS) {
  if (!a.holds()) {
    const offenders = AUDIT.filter((r) => r.novel.length > 0)
      .map((r) => r.file + ' [' + r.novel.join(', ') + ']')
      .join('; ');
    throw new Error(
      '[imp-2751] phantom-citation-guard assertion failed: ' + a.id +
        (offenders
          ? ' -- a NEW clause cites a denylisted REFUTED phantom citation as load-bearing ' +
            'support. Seed denylist entry "Soundararajan-Tao 2024" is a PHANTOM citation ' +
            '(imp-1331 REFUTED, wrong object). Either remove the citation or document it as a ' +
            'refutation (add REFUTED / PHANTOM / imp-1331 in the same clause). Offending files: ' +
            offenders
          : '')
    );
  }
}
