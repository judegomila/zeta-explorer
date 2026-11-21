/**
 * @module data/imp-95972-cf-band-hi-pin-regression-guard
 *
 * imp-95972 (meta, regression guard): a build-time TRIPWIRE protecting the
 * imp-95894 citation-audit verdict -- no consumer in src/ may cite the
 * SUPERSEDED imp-95691 CF_BAND_HI_PINNED = 1.29615 geometric-mean pin, or the
 * intermediate imp-95705 1.914x / imp-95721 6.1-8.6x measurements, as the
 * CURRENT honest CF_BAND_HI representative. The converged, cutoff-independent
 * honest value is the imp-95747 GUE-saturated r_eff = 9.583x.
 *
 * WHY. imp-95769 and imp-95894 both re-audited every known consumer of
 * CF_BAND_HI_PINNED and found none surfaces a superseded multiplier as final --
 * but nothing PREVENTS a future module from re-introducing 1.29615 (or 1.914x,
 * or 6.1-8.6x) as if it were still the honest representative, since the
 * CF_BAND_HI_PINNED literal itself is retained unchanged in imp-95691 for
 * downstream numeric stability.
 *
 * METHOD (mirrors phantom-citation-guard.js). Scan every src/data/*.js file
 * (excluding the two append-only log books improvement-queue.js /
 * improvements.js, and this guard itself) for clauses citing one of the three
 * superseded numeric literals. A clause is a violation candidate if it names a
 * superseded literal WITHOUT any allowed marker (superseded / honestStatus /
 * numeric stability / geometric-mean / converged / PASS / landmark / etc. --
 * i.e. documenting the chain rather than presenting the literal as final). The
 * currently-known candidate clauses (all pre-existing documentation of the
 * supersession chain itself) are frozen into a per-file baseline of djb2
 * clause signatures; the guard fails only when a NEW, un-baselined candidate
 * clause appears, i.e. a freshly (re-)introduced stale citation.
 *
 * This module is intentionally NOT imported by any page (it uses node:fs,
 * unavailable in the browser bundle). run-assertions.mjs auto-discovers it by
 * scanning for the *_ASSERTIONS export, and it is wired into DATA_MODULES.
 *
 * @see imp-95691 CF_BAND_HI_PINNED = 1.29615 (source, retained for numeric stability)
 * @see imp-95705 measured integrated reach 1.914x (superseded intermediate)
 * @see imp-95721 density-weighted band 6.1x-8.6x (superseded intermediate)
 * @see imp-95747 converged honest representative r_eff = 9.583x
 * @see imp-95769, imp-95894 prior citation audits this guard protects
 * @see phantom-citation-guard.js (sibling frozen-baseline live-scan tripwire)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = __dirname;
const SELF = path.basename(__filename);

// Append-only log books are excluded: they narrate the supersession chain's
// history and are not "src/ consumers" that compute anything off the value.
const EXCLUDED_FILES = new Set(['improvement-queue.js', 'improvements.js', SELF]);

const DENYLIST = [
  {
    id: 'cf-band-hi-1.29615-pin',
    test: (clause) => /1\.29615/.test(clause),
  },
  {
    id: 'cf-band-hi-1.914x-intermediate',
    test: (clause) =>
      /\b1\.914x?\b/.test(clause) && /(cf_?band_?hi|reach multiplier|integrated reach)/i.test(clause),
  },
  {
    id: 'cf-band-hi-6.1-8.6-band',
    test: (clause) => /\b6\.1x?\b/.test(clause) && /\b8\.6x?\b/.test(clause),
  },
];

// A clause is ALLOWED (documenting the chain, not leaning on it as final) if it
// carries any of these markers.
const ALLOWED_RE =
  /(superseded|honest.?status|numeric stability|geometric.mean|converged|GUE|frozen baseline|retained for|estimate, not a measur|supersession|superseding|supersedes|PASS|pinned geom.?mean|not\s+(the\s+)?final|not\s+final|never claims|no reference|no\s+claim|not.{0,15}honest|as\s+one\s+labeled\s+landmark|monotonically increasing|landmark|chain|denylist|regression guard)/i;

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

// Scan one file: return the signatures of every clause that names a
// superseded CF_BAND_HI literal without a co-located allowed marker.
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
      if (entry.test(clause) && !ALLOWED_RE.test(clause)) {
        const n = normalize(clause);
        if (n.length > 3) sigs.add(entry.id + ':' + djb2(n));
      }
    }
  }
  return sigs;
}

// Frozen snapshot of the currently-known candidate clauses (all pre-existing
// documentation of the 1.29615 -> 1.914x -> 6.1-8.6x -> 9.583x supersession
// chain across the imp-95691/95705/95713/95721/95754/95755/95769/95797/95894
// modules). Captured at imp-95972. A current offender NOT in this set is a
// freshly (re-)introduced stale citation -> red build.
const FROZEN_BASELINE = {
  'imp-95691-cf-band-hi-pinned-wedge-opening.js': [
    'cf-band-hi-1.29615-pin:12702c64',
    'cf-band-hi-1.29615-pin:1279c25a',
    'cf-band-hi-1.29615-pin:28307fa7',
    'cf-band-hi-1.29615-pin:39fff33d',
    'cf-band-hi-1.29615-pin:49280770',
    'cf-band-hi-1.29615-pin:af7105e2',
    'cf-band-hi-1.29615-pin:ea858ec7',
    'cf-band-hi-1.914x-intermediate:49280770',
    'cf-band-hi-6.1-8.6-band:49280770',
    'cf-band-hi-6.1-8.6-band:515c93b3',
    'cf-band-hi-6.1-8.6-band:6929fac9',
    'cf-band-hi-6.1-8.6-band:c00e38d5',
  ],
  'imp-95705-cf-integrated-reach-measured.js': [
    'cf-band-hi-1.29615-pin:67ce15b5',
    'cf-band-hi-1.29615-pin:c8753565',
    'cf-band-hi-1.29615-pin:d27a838e',
  ],
  'imp-95713-cf-band-hi-wedge-opening-glossary-headword.js': [
    'cf-band-hi-1.29615-pin:7bf92f9d',
    'cf-band-hi-1.29615-pin:a91b8829',
  ],
  'imp-95721-cf-alpha-weight-density-pinned.js': [
    'cf-band-hi-6.1-8.6-band:122ee4c2',
    'cf-band-hi-6.1-8.6-band:26acaaae',
    'cf-band-hi-6.1-8.6-band:74f2c424',
    'cf-band-hi-6.1-8.6-band:dd6283e0',
    'cf-band-hi-6.1-8.6-band:ec5abc48',
  ],
  'imp-95754-cf-wedge-depth-vs-multiplier-viz-data.js': ['cf-band-hi-1.29615-pin:aade84ed'],
  'imp-95755-cf-alpha-flip-reach-edge-dominance-glossary-headword.js': [
    'cf-band-hi-6.1-8.6-band:65247a98',
    'cf-band-hi-6.1-8.6-band:8ce72dd3',
    'cf-band-hi-6.1-8.6-band:8f3399e6',
    'cf-band-hi-6.1-8.6-band:a6d5e454',
  ],
  'imp-95769-cf-band-hi-pinned-consumer-audit.js': [
    'cf-band-hi-1.29615-pin:320d1caf',
    'cf-band-hi-1.29615-pin:46d831a1',
    'cf-band-hi-1.29615-pin:5482bd63',
    'cf-band-hi-1.29615-pin:57f3d483',
    'cf-band-hi-1.29615-pin:81724448',
    'cf-band-hi-1.29615-pin:88448bfe',
    'cf-band-hi-1.29615-pin:9a014a71',
    'cf-band-hi-1.29615-pin:9a7f95bd',
    'cf-band-hi-1.29615-pin:b7e61b21',
    'cf-band-hi-1.29615-pin:b8542adb',
    'cf-band-hi-1.29615-pin:c49144d4',
    'cf-band-hi-1.29615-pin:e13c1cf1',
    'cf-band-hi-1.29615-pin:eaad355d',
    'cf-band-hi-1.29615-pin:eddc1961',
    'cf-band-hi-1.29615-pin:f152de8f',
    'cf-band-hi-1.29615-pin:fe404552',
    'cf-band-hi-6.1-8.6-band:1894d2b8',
    'cf-band-hi-6.1-8.6-band:2c38d181',
    'cf-band-hi-6.1-8.6-band:527c47ee',
    'cf-band-hi-6.1-8.6-band:57f3d483',
    'cf-band-hi-6.1-8.6-band:70bb7a6e',
    'cf-band-hi-6.1-8.6-band:9a7f95bd',
    'cf-band-hi-6.1-8.6-band:ec939c45',
  ],
  'imp-95797-cf-multiplier-supersession-glossary-headword.js': [
    'cf-band-hi-1.29615-pin:5ad39918',
    'cf-band-hi-1.29615-pin:b8daa982',
    'cf-band-hi-1.29615-pin:bddba29b',
    'cf-band-hi-1.29615-pin:c329c7c9',
    'cf-band-hi-1.29615-pin:fb8040c3',
    'cf-band-hi-1.914x-intermediate:0d21c363',
    'cf-band-hi-1.914x-intermediate:e7c4bc1b',
    'cf-band-hi-6.1-8.6-band:06341c52',
    'cf-band-hi-6.1-8.6-band:5ad39918',
    'cf-band-hi-6.1-8.6-band:835d3469',
    'cf-band-hi-6.1-8.6-band:ef0ef17e',
    'cf-band-hi-6.1-8.6-band:fad99148',
  ],
  'imp-95894-cf-band-hi-pin-citation-audit.js': [
    'cf-band-hi-1.29615-pin:889f9f92',
    'cf-band-hi-1.29615-pin:a0201f76',
    'cf-band-hi-1.29615-pin:c49144d4',
    'cf-band-hi-6.1-8.6-band:a0201f76',
    'cf-band-hi-6.1-8.6-band:e2776ab3',
  ],
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

const NO_NOVEL_STALE_CITATION = AUDIT.every((a) => a.novel.length === 0);
const DENYLIST_NONEMPTY = DENYLIST.length > 0;
const BASELINE_COUNT = Object.values(FROZEN_BASELINE).reduce((n, a) => n + a.length, 0);

export const CF_BAND_HI_PIN_REGRESSION_GUARD = {
  id: 'imp-95972',
  question:
    'Has any NEW clause in src/data/*.js cited the superseded imp-95691 CF_BAND_HI_PINNED = ' +
    '1.29615 pin (or the imp-95705 1.914x / imp-95721 6.1-8.6x intermediates) as the current ' +
    'honest CF_BAND_HI representative, beyond the already-audited (imp-95769, imp-95894) baseline?',
  denylist: DENYLIST.map((e) => e.id),
  scannedFileCount: ALL_FILES.length,
  baselineCount: BASELINE_COUNT,
  convergedHonestValue: 'imp-95747 r_eff = 9.583x (GUE-saturated, cutoff-independent)',
  audit: AUDIT,
  noNovelStaleCitation: NO_NOVEL_STALE_CITATION,
  verdict:
    'No NEW use of the superseded CF_BAND_HI multiplier (1.29615 / 1.914x / 6.1-8.6x) as the ' +
    'current honest representative has been introduced beyond the frozen baseline of ' +
    'pre-imp-95972 supersession-chain documentation. The imp-95769/imp-95894 audit verdict ' +
    'stays enforced: it cannot silently regress without a red build. Documentation/regression ' +
    'guard only; changes no bound; NO QED; no refereed bound is changed.',
};

export const CF_BAND_HI_PIN_REGRESSION_GUARD_ASSERTIONS = [
  {
    id: 'imp95972-denylist-nonempty',
    description: 'The CF_BAND_HI stale-citation denylist covers all three superseded literals',
    holds: () => DENYLIST_NONEMPTY && DENYLIST.length === 3,
  },
  {
    id: 'imp95972-no-new-stale-cf-band-hi-citation',
    description:
      'No NEW clause in src/data/*.js cites the superseded imp-95691 CF_BAND_HI_PINNED = 1.29615 ' +
      '(or the 1.914x / 6.1-8.6x intermediates) as the current honest representative beyond the ' +
      'frozen baseline',
    holds: () => NO_NOVEL_STALE_CITATION,
  },
  {
    id: 'imp95972-baseline-nonempty-and-scan-ran',
    description: 'The scan actually ran over a nonempty src/data/*.js file set and found the known baseline',
    holds: () => ALL_FILES.length > 50 && BASELINE_COUNT === 67,
  },
];

for (const a of CF_BAND_HI_PIN_REGRESSION_GUARD_ASSERTIONS) {
  if (!a.holds()) {
    const offenders = AUDIT.filter((r) => r.novel.length > 0)
      .map((r) => r.file + ' [' + r.novel.join(', ') + ']')
      .join('; ');
    throw new Error(
      '[imp-95972] cf-band-hi-pin-regression-guard assertion failed: ' + a.id +
        (offenders
          ? ' -- a NEW clause cites the superseded CF_BAND_HI_PINNED = 1.29615 pin (or the ' +
            '1.914x / 6.1-8.6x intermediates) as the current honest representative. The ' +
            'converged honest value is imp-95747 r_eff = 9.583x -- add a supersession/honest-status ' +
            'marker in the same clause, or update the FROZEN_BASELINE if this is intentional ' +
            'historical documentation. Offending files: ' + offenders
          : '')
    );
  }
}

export default CF_BAND_HI_PIN_REGRESSION_GUARD;
