/**
 * @module data/imp-96042-a0-tx-pinned-citation-regression-guard
 *
 * imp-96042 (meta, regression guard): a build-time TRIPWIRE protecting the
 * imp-95987 / imp-96006 no-collapse discipline -- no src/ consumer may cite the
 * imp-95984 Montgomery-conjectural arithmetic intercept a_0 = -0.176248 (Chan
 * Thm 1.1 under I_F = 1) or the imp-96006 conditional crossing height
 * T_x = 8.54e19 (8.539689e19) as a PINNED / resolved value. Both are a single
 * flagged-conditional point-in-range, never a pin: a_0 depends on the
 * unresolved Var S(T) boundary constant K, and T_x sits inside the uncollapsed
 * range [~5.8e17, ~1.36e28] set by the rigorous I_F bracket (2/3-eps, 2).
 *
 * WHY. imp-95987 audited every then-existing consumer of the crossing-height
 * range and found none collapses it to a point; imp-96006 then instantiated
 * the I_F = 1 conditional anchor and recorded it strictly as a point-in-range.
 * Nothing PREVENTS a future module from re-citing a_0 = -0.176248 or
 * T_x = 8.54e19 as if it were an established/pinned value, since both literals
 * are retained unchanged for downstream numeric use across several consumers.
 *
 * METHOD (mirrors imp-95972-cf-band-hi-pin-regression-guard.js /
 * phantom-citation-guard.js). Scan every src/data/*.js file (excluding the two
 * append-only log books improvement-queue.js / improvements.js, and this guard
 * itself) for clauses citing either literal. A clause is a violation candidate
 * if it names a literal WITHOUT any allowed marker (conjectural / conditional /
 * Montgomery / pair correlation / PCC / point-in-range / flagged / published /
 * Chan / I_F = 1 / uncollapsed / "not a pin" / "never ... pinned" -- i.e.
 * documenting the conditional status rather than presenting the literal as
 * resolved). The currently-known candidate clauses (all pre-existing prose
 * where the qualifier sits in a neighboring clause of the same sentence) are
 * frozen into a per-file baseline of djb2 clause signatures; the guard fails
 * only when a NEW, un-baselined candidate clause appears, i.e. a freshly
 * (re-)introduced unqualified pin.
 *
 * This module is intentionally NOT imported by any page (it uses node:fs,
 * unavailable in the browser bundle). run-assertions.mjs auto-discovers it by
 * scanning for the *_ASSERTIONS export, and it is wired into DATA_MODULES.
 *
 * @see imp-95984-fujii-varS-constant-literature-locate (source: a_0 = -0.176248, Chan Thm 1.1)
 * @see imp-96006-if1-crossing-height-conditional-anchor (source: T_x = 8.539689e19, point-in-range)
 * @see imp-95987-crossing-height-range-collapse-audit (the no-collapse discipline this protects)
 * @see imp-95972-cf-band-hi-pin-regression-guard.js (sibling frozen-baseline live-scan tripwire)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = __dirname;
const SELF = path.basename(__filename);

// Append-only log books are excluded: they narrate history and are not "src/
// consumers" that compute anything off the value.
const EXCLUDED_FILES = new Set(['improvement-queue.js', 'improvements.js', SELF]);

// The two conditional literals this guard protects.
const LITERAL_RE = /(-?0\.176248)|(8\.54e\+?19|8\.539689e\+?19)/i;

// A clause is ALLOWED (documenting the conditional status, not presenting the
// literal as resolved) if it carries any of these markers.
const QUALIFIER_RE =
  /(conjectural|conditional|montgomery|pair.correlation|\bpcc\b|point-in-range|point in range|flagged|published|\bchan\b|i_f\s*=\s*1|not\s+a\s+pin|never.{0,10}pinned|uncollapsed)/i;

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

function listDataFiles() {
  try {
    return fs
      .readdirSync(DATA_DIR)
      .filter((f) => f.endsWith('.js') && !EXCLUDED_FILES.has(f))
      .sort();
  } catch {
    return [];
  }
}

// Scan one file: return the signatures of every clause that names a_0 =
// -0.176248 or T_x = 8.54e19 without a co-located conditional-status marker.
function scanOffenders(file) {
  let txt;
  try {
    txt = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
  } catch {
    return new Set();
  }
  const sigs = new Set();
  for (const clause of txt.split(CLAUSE_SPLIT)) {
    if (LITERAL_RE.test(clause) && !QUALIFIER_RE.test(clause)) {
      const n = normalize(clause);
      if (n.length > 3) sigs.add(djb2(n));
    }
  }
  return sigs;
}

// Frozen snapshot of the currently-known candidate clauses (pre-existing prose
// across the imp-95984/96005/96006/96026/96040/96104 modules, where the
// conditional-status qualifier sits in a neighboring clause of the same
// sentence rather than the clause holding the literal itself). Captured at
// imp-96042. A current offender NOT in this set is a freshly (re-)introduced
// unqualified pin -> red build.
const FROZEN_BASELINE = {
  'imp-95984-fujii-varS-constant-literature-locate.js': ['29ffcc63', '40b4cbe3'],
  'imp-96005-a0-published-vs-empirical-reconcile.js': ['3c3c88f0', '835c43d5', 'cf050a1e', 'd526db31'],
  'imp-96006-if1-crossing-height-conditional-anchor.js': ['1b0a3d49', '58e1ec40', 'a03fad11'],
  'imp-96026-a0-gap-statistics-verify.js': ['3352fe37', '90f64d4d', 'f01e8ee1'],
  'imp-96040-a0-reconcile-panel-viz-data.js': ['76a5385e'],
  'imp-96104-fujii-varS-literature-reading-path.js': ['aa13ea72'],
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

const NO_NOVEL_PINNED_CITATION = AUDIT.every((a) => a.novel.length === 0);
const BASELINE_COUNT = Object.values(FROZEN_BASELINE).reduce((n, a) => n + a.length, 0);

export const A0_TX_PINNED_CITATION_REGRESSION_GUARD = {
  id: 'imp-96042',
  question:
    'Has any NEW clause in src/data/*.js cited the imp-95984 conjectural a_0 = -0.176248 (or the ' +
    'imp-96006 conditional T_x = 8.54e19) as a PINNED crossing intercept, rather than a ' +
    'flagged-conditional point-in-range, beyond the already-audited (imp-95987/96006) baseline?',
  scannedFileCount: ALL_FILES.length,
  baselineCount: BASELINE_COUNT,
  protectedLiterals: ['a_0 = -0.176248 (imp-95984, Chan Thm 1.1, Montgomery I_F = 1)', 'T_x = 8.539689e19 (imp-96006)'],
  audit: AUDIT,
  noNovelPinnedCitation: NO_NOVEL_PINNED_CITATION,
  verdict:
    'No NEW clause cites a_0 = -0.176248 or T_x = 8.54e19 as a resolved/pinned value beyond the ' +
    'frozen baseline of pre-imp-96042 conditional-status prose. The imp-95987/imp-96006 ' +
    'no-collapse discipline stays enforced: it cannot silently regress without a red build. ' +
    'Regression guard only; changes no bound; NO QED; no refereed bound is changed.',
};

export const A0_TX_PINNED_CITATION_REGRESSION_GUARD_ASSERTIONS = [
  {
    id: 'imp96042-scan-ran-over-full-data-dir',
    description: 'The scan actually ran over the full src/data/*.js file set and found the known baseline',
    holds: () => ALL_FILES.length > 50 && BASELINE_COUNT === 14,
  },
  {
    id: 'imp96042-no-new-pinned-a0-or-tx-citation',
    description:
      'No NEW clause in src/data/*.js cites a_0 = -0.176248 or T_x = 8.54e19 as a pinned/resolved ' +
      'value beyond the frozen baseline',
    holds: () => NO_NOVEL_PINNED_CITATION,
  },
];

for (const a of A0_TX_PINNED_CITATION_REGRESSION_GUARD_ASSERTIONS) {
  if (!a.holds()) {
    const offenders = AUDIT.filter((r) => r.novel.length > 0)
      .map((r) => r.file + ' [' + r.novel.join(', ') + ']')
      .join('; ');
    throw new Error(
      '[imp-96042] a0-tx-pinned-citation-regression-guard assertion failed: ' + a.id +
        (offenders
          ? ' -- a NEW clause cites a_0 = -0.176248 or T_x = 8.54e19 as a pinned/resolved value. ' +
            'Both are flagged-conditional (Montgomery I_F = 1 conjectural) point-in-range values, ' +
            'never a pin (imp-95987/imp-96006) -- add a conjectural/conditional/point-in-range ' +
            'marker in the same clause, or update the FROZEN_BASELINE if this is intentional ' +
            'historical documentation. Offending files: ' + offenders
          : '')
    );
  }
}

export default A0_TX_PINNED_CITATION_REGRESSION_GUARD;
