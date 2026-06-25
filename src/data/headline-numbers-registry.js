/**
 * @module data/headline-numbers-registry
 * @fileoverview imp-2739 single-source registry for the project headline
 * numbers, each carrying an EXPLICIT honest status + scope label, plus a
 * build-time cross-file consistency tripwire.
 *
 * The four headline constants (0.121, 0.2014, 3.06e-5, 7.98e-4) are duplicated
 * across 20+ files with no source-of-truth. An inconsistent edit can silently
 * drift one copy from its honest scope label (e.g. dropping the C_H gating
 * caveat from the 0.121 finite-height beat). This module is the canonical
 * record: each entry names its canonical source file, the literal as written
 * there, and a qualifierKeyword -- the honest-caveat token that MUST co-occur
 * in that source file. If a source drops its caveat while keeping the number,
 * the build fails.
 *
 * Honest-scope summary (do NOT promote any of these to a bare rigorous claim):
 *   - 0.121   finite-height beat, ESTIMATE gated on the symbolic constant C_H
 *             (undischargeable per imp-2640); scope N in [100, 1e4].
 *   - 0.2014  worst-case K over [100, 1e4], interval-RK4 certified (imp-933).
 *   - 3.06e-5 asymptotic UNCONDITIONAL modulo Polymath15 G6a (imp-1261).
 *   - 7.98e-4 HISTORICAL imp-1147 intercept, CONDITIONAL on the linear-1/N model.
 *
 * This module is intentionally NOT imported by any page (it uses node:fs which
 * is unavailable in the browser bundle). The assertion runner
 * (run-assertions.mjs) auto-discovers it by scanning for the *_ASSERTIONS
 * export in src/data/.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Canonical headline registry. valueLiteral is the exact string as written in
// the canonical source; qualifierKeyword is the honest-caveat token that must
// co-occur with the literal in that source file (case-insensitive).
export const HEADLINE_NUMBERS = {
  finiteBeatEstimate: {
    value: 0.121,
    valueLiteral: '0.121',
    status: 'ESTIMATE-gated-on-C_H',
    scope: 'N in [100, 1e4]',
    canonicalSource: 'sota-lambda-claim.js',
    qualifierKeyword: 'C_H',
  },
  kBound: {
    value: 0.2014,
    valueLiteral: '0.2014',
    status: 'INTERVAL-RK4-CERTIFIED-worst-case-K',
    scope: 'N in [100, 1e4]',
    canonicalSource: 'finite-k-c-mb-unconditional.js',
    qualifierKeyword: 'interval',
  },
  asymptoticConditional: {
    value: 3.06e-5,
    valueLiteral: '3.06e-5',
    status: 'ASYMPTOTIC-unconditional-modulo-Polymath15-G6a',
    scope: 'asymptotic (N -> infinity)',
    canonicalSource: 'lambda-roadmap.js',
    qualifierKeyword: 'modulo',
  },
  intercept7e4: {
    value: 7.98e-4,
    valueLiteral: '7.98e-4',
    status: 'CONDITIONAL-historical-imp1147-linear-1overN-model',
    scope: 'intercept under the linear-1/N OLS model (superseded)',
    canonicalSource: 'asymptotic-lambda-bound-2026-05-20.js',
    qualifierKeyword: 'conditional',
  },
};

const DATA_DIR = __dirname;

function readSource(rel) {
  try {
    return fs.readFileSync(path.join(DATA_DIR, rel), 'utf-8');
  } catch {
    return null;
  }
}

export const HEADLINE_NUMBERS_ASSERTIONS = Object.entries(HEADLINE_NUMBERS).flatMap(
  ([key, h]) => [
    {
      // (a) pin the value: the registry literal parses to the registry value.
      id: 'headline-' + key + '-value-pinned',
      why: 'registry value for ' + key + ' must equal Number(valueLiteral) within 1e-12',
      holds: () => Math.abs(Number(h.valueLiteral) - h.value) <= 1e-12,
    },
    {
      // (b) explicit honest status + scope present and non-empty.
      id: 'headline-' + key + '-has-status-and-scope',
      why: key + ' must carry a non-empty status and scope label',
      holds: () =>
        typeof h.status === 'string' && h.status.length > 0 &&
        typeof h.scope === 'string' && h.scope.length > 0,
    },
    {
      // (c1) the literal still appears in its declared canonical source file.
      id: 'headline-' + key + '-literal-in-canonical-source',
      why: h.valueLiteral + ' must appear in canonical source ' + h.canonicalSource,
      holds: () => {
        const src = readSource(h.canonicalSource);
        return src !== null && src.includes(h.valueLiteral);
      },
    },
    {
      // (c2) cross-file consistency: the canonical source must still carry the
      // honest-caveat keyword, so the number cannot drift from its scope label.
      id: 'headline-' + key + '-honest-qualifier-in-canonical-source',
      why:
        h.canonicalSource + ' must still contain the honest qualifier "' +
        h.qualifierKeyword + '" near the ' + h.valueLiteral + ' headline (status: ' +
        h.status + ')',
      holds: () => {
        const src = readSource(h.canonicalSource);
        if (src === null) return false;
        return src.toLowerCase().includes(h.qualifierKeyword.toLowerCase());
      },
    },
  ]
);

// Fail the build immediately on any violation (mirrors sibling tripwire modules).
for (const a of HEADLINE_NUMBERS_ASSERTIONS) {
  let ok;
  try { ok = a.holds(); } catch { ok = false; }
  if (!ok) {
    throw new Error('[imp-2739] headline-numbers-registry: ' + a.id + ' -- ' + a.why);
  }
}
