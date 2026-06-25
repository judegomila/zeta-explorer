/**
 * @module data/anti-overclaim-finite-beat-guard
 *
 * imp-2740 (accuracy, proof-hygiene): a build-time TRIPWIRE that scans the prose
 * of the three claim/route files that talk about the finite-N*=1e4 beat and
 * FAILS THE BUILD if a NEW clause pairs that beat (or Lambda <= 0.121) with a
 * rigor word (rigorous / unconditional / proves) WITHOUT an accompanying honesty
 * qualifier (C_H / ESTIMATE / gated / the imp-2640 / imp-2632 citation) in the
 * same clause. This enforces the imp-2634 honest-restatement guardrail as a
 * tripwire so the finite beat cannot silently RE-ACQUIRE a rigor claim.
 *
 * WHY A FROZEN BASELINE (HONEST PARTIAL)
 * -------------------------------------
 * The finite-N*=1e4 beat is an ESTIMATE: its dominant E_coll sub-term rests on
 * the undischargeable C_H = 1/8 ansatz (imp-2640 NEGATIVE; Gronwall diverges at
 * the collision), and |t_c_proj| is OLS not a rigorous upper bound (imp-2632).
 * The newest view (full-route-map-2026-06-19.js) already grades the beat as
 * "ESTIMATE, gated on C_H". But the two older files still carry pre-imp-2640
 * historical/narrative prose that pairs the beat with "rigorous/unconditional"
 * language (38 such clauses today across the three files -- many are retraction
 * narrative such as "GUE-CONDITIONAL rather than unconditional", not live
 * overclaims). Mass-restating that historical record is a SEPARATE ticket, not
 * something this one atomic guard should rewrite.
 *
 * So this tripwire snapshots the 38 currently-known offending clauses into a
 * FROZEN_BASELINE (per-file djb2 signatures of the normalized clause text) and
 * FAILS only when a clause appears that is NOT in the baseline -- i.e. a freshly
 * introduced unqualified rigor-beat adjacency. Removing baseline clauses (prose
 * getting cleaned up) is always allowed and is surfaced as cleanup progress.
 *
 * NAMED SUB-GAP -- gap-imp2740-legacy-prose-restatement: the 38 baseline clauses
 * in sota-lambda-claim.js (10) and finite-height-beats-platt-trudgian.js (27)
 * still use pre-C_H rigorous-unconditional finite-beat wording; a full honest
 * restatement of those headers is deferred to a follow-up ticket. This guard
 * locks the state so the count cannot GROW.
 *
 * This module is intentionally NOT imported by any page (it uses node:fs, which
 * is unavailable in the browser bundle). run-assertions.mjs auto-discovers it by
 * scanning for the *_ASSERTIONS export, and it is wired into DATA_MODULES.
 *
 * @see imp-2711-pt-bound-sota-tripwire (sibling PT_BOUND=0.2 numeric tripwire)
 * @see imp-2634 honest restatement; imp-2640 C_H NEGATIVE; imp-2632 t_c OLS audit
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = __dirname;

// The three claim/route files whose prose is scanned for the finite-beat overclaim.
const SCANNED_FILES = [
  'sota-lambda-claim',
  'finite-height-beats-platt-trudgian',
  'full-route-map-2026-06-19',
];

// A clause names the finite beat if it mentions N*=1e4 / 10^4 / the 0.121 headline.
const BEAT_RE =
  /(finite[- ]?(?:height|n)\*?\s*=?\s*1e4|n\*?\s*=\s*1e4|10\^4|0\.121|finite[- ]?n\*?\s*beat)/i;
// A clause asserts rigor if it uses one of the load-bearing rigor words.
const RIGOR_RE = /\b(rigorous|rigorously|unconditional|unconditionally|proves|proven)\b/i;
// A clause is honestly qualified if it carries the C_H / ESTIMATE / gated hedge.
const QUALIFIER_RE =
  /(c_h|estimate|gated|cond-ch|imp-2640|imp-2632|not[- ]a[- ]rigorous|not[- ]rigorous)/i;

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

// Frozen snapshot of the 38 currently-known unqualified rigor-beat clauses
// (per-file djb2 signatures of the normalized clause text), captured at imp-2740.
// A current offender NOT in this set is a newly-introduced overclaim -> red build.
const FROZEN_BASELINE = {
  'sota-lambda-claim': [
    '051d447b', '0d78c695', '15988157', '23bd1cd8', '53f944a3',
    '5a89bbde', '6ba3e007', 'a5358b9d', 'e2635b80', 'ff6cf360',
  ],
  'finite-height-beats-platt-trudgian': [
    '0a8e2222', '0c1add7b', '115dc676', '1185eece', '1f688344',
    '266309ad', '31ad8199', '3b32aa49', '3d68c380', '4de7859c',
    '66791efb', '7792d469', '7b592c48', '7d0db615', '863c0ea9',
    '8ce36949', '9a332ba4', 'aef0a6a3', 'afeeda6d', 'b1d3f880',
    'b24361e6', 'c7875924', 'd270daef', 'd8ef38d6', 'e1434654',
    'eb46ab51', 'f724b01f',
  ],
  'full-route-map-2026-06-19': ['c79c1df1'],
};

// Scan one file: return the signatures of every clause that pairs the finite
// beat with a rigor word but carries no honesty qualifier.
function scanOffenders(name) {
  let txt;
  try {
    txt = fs.readFileSync(path.join(DATA_DIR, name + '.js'), 'utf-8');
  } catch {
    return null; // file missing -> reported separately
  }
  const sigs = new Set();
  for (const clause of txt.split(CLAUSE_SPLIT)) {
    if (BEAT_RE.test(clause) && RIGOR_RE.test(clause) && !QUALIFIER_RE.test(clause)) {
      const n = normalize(clause);
      if (n.length > 3) sigs.add(djb2(n));
    }
  }
  return sigs;
}

// Per-file audit: novel offenders (current minus baseline) must be empty.
const AUDIT = SCANNED_FILES.map((name) => {
  const current = scanOffenders(name);
  const baseline = new Set(FROZEN_BASELINE[name] || []);
  if (current === null) {
    return { name, fileFound: false, novel: [], remainingBaseline: 0 };
  }
  const novel = [...current].filter((s) => !baseline.has(s));
  const remainingBaseline = [...current].filter((s) => baseline.has(s)).length;
  return { name, fileFound: true, novel, remainingBaseline, currentCount: current.size };
});

const ALL_FILES_FOUND = AUDIT.every((a) => a.fileFound);
const NO_NOVEL_OVERCLAIM = AUDIT.every((a) => a.novel.length === 0);

export const ANTI_OVERCLAIM_FINITE_BEAT_GUARD = {
  id: 'imp-2740',
  question:
    'Has any NEW clause in the three claim/route files paired the finite-N*=1e4 beat ' +
    '(or Lambda <= 0.121) with rigorous/unconditional/proves without a C_H / ESTIMATE / gated qualifier?',
  scannedFiles: SCANNED_FILES,
  baselineCount: Object.values(FROZEN_BASELINE).reduce((n, a) => n + a.length, 0),
  audit: AUDIT,
  allFilesFound: ALL_FILES_FOUND,
  noNovelOverclaim: NO_NOVEL_OVERCLAIM,
  subGap: 'gap-imp2740-legacy-prose-restatement',
  verdict:
    'No NEW unqualified rigorous/unconditional finite-N*=1e4 beat clause has been ' +
    'introduced beyond the frozen baseline of 38 pre-imp-2640 historical clauses. The ' +
    'finite beat stays an ESTIMATE gated on C_H (imp-2640); the beat cannot silently ' +
    're-acquire a rigor claim without a red build. Restating the 38 legacy clauses is ' +
    'the named sub-gap gap-imp2740-legacy-prose-restatement (separate ticket). No false QED.',
};

export const ANTI_OVERCLAIM_FINITE_BEAT_GUARD_ASSERTIONS = [
  {
    id: 'imp2740-all-three-files-present',
    description: 'The three scanned claim/route files all exist and are readable',
    holds: () => ALL_FILES_FOUND,
  },
  {
    id: 'imp2740-baseline-nonempty',
    description: 'The frozen baseline is non-empty (the detection regexes still match known prose)',
    holds: () => Object.values(FROZEN_BASELINE).some((a) => a.length > 0),
  },
  {
    id: 'imp2740-no-new-unqualified-rigor-beat-clause',
    description:
      'No NEW clause pairs the finite-N*=1e4 beat / Lambda <= 0.121 with rigorous/unconditional/proves ' +
      'lacking a C_H / ESTIMATE / gated qualifier (beyond the frozen pre-imp-2640 baseline)',
    holds: () => NO_NOVEL_OVERCLAIM,
  },
];

for (const a of ANTI_OVERCLAIM_FINITE_BEAT_GUARD_ASSERTIONS) {
  if (!a.holds()) {
    const offenders = AUDIT.filter((r) => r.novel.length > 0)
      .map((r) => r.name + ' [' + r.novel.join(', ') + ']')
      .join('; ');
    throw new Error(
      '[imp-2740] anti-overclaim-finite-beat-guard assertion failed: ' + a.id +
        (offenders
          ? ' -- a NEW clause pairs the finite-N*=1e4 beat with rigorous/unconditional/proves ' +
            'without a C_H / ESTIMATE / gated qualifier. The finite beat is an ESTIMATE gated on ' +
            'C_H (imp-2640); add the honesty qualifier in the same clause. Offending files: ' + offenders
          : '')
    );
  }
}
