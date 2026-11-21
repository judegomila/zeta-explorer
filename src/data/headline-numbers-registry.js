/**
 * @module data/headline-numbers-registry
 * @fileoverview imp-2739 registry for legacy internal numerical quantities,
 * each carrying an explicit honest status + scope label, plus a build-time
 * cross-file consistency tripwire. Audit correction 2026-07: none of the four
 * legacy values below is an established Lambda upper bound.
 *
 * The four legacy constants (0.121, 0.2014, 3.06e-5, 7.98e-4) are duplicated
 * across 20+ files with no source-of-truth. An inconsistent edit can silently
 * drift one copy from its honest scope label (e.g. dropping the C_H gating
 * caveat from the 0.121 finite-height beat). This module is the canonical
 * record: each entry names its canonical source file, the literal as written
 * there, and a qualifierKeyword -- the honest-caveat token that MUST co-occur
 * in that source file. If a source drops its caveat while keeping the number,
 * the build fails.
 *
 * Honest-scope summary (do NOT promote any of these to a Lambda theorem):
 *   - 0.121   withdrawn finite-height assembly estimate; RH-equivalent/open
 *             bridge obligations remain.
 *   - 0.2014  an internal finite-K coefficient bound over [100, 1e4], not
 *             itself a Lambda bound.
 *   - 3.06e-5 retracted asymptotic composition; the July audit found multiple
 *             open gates and an uncertified truncation constant.
 *   - 7.98e-4 historical imp-1147 intercept, conditional on a superseded
 *             linear-1/N model.
 *
 * Current context: the peer-reviewed unconditional benchmark remains 0.2.
 * The public 0.1875 package is an unrefereed claim.  The stronger 0.1787854
 * value is an unreviewed proof candidate in a private audit repository, not
 * an established result. Neither is an entry in this legacy arithmetic registry.
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
    status: 'WITHDRAWN-conditional-assembly-estimate',
    scope: 'historical finite-height assembly; not an established Lambda bound',
    canonicalSource: 'lambda-roadmap.js',
    qualifierKeyword: 'historical',
    countsAsEstablishedUpperBound: false,
  },
  kBound: {
    value: 0.2014,
    valueLiteral: '0.2014',
    status: 'INTERNAL-finite-K-coefficient-bound',
    scope: 'internal coefficient K on N in [100, 1e4]; not Lambda',
    canonicalSource: 'finite-k-c-mb-unconditional.js',
    qualifierKeyword: 'interval',
    countsAsEstablishedUpperBound: false,
  },
  asymptoticConditional: {
    value: 3.06e-5,
    valueLiteral: '3.06e-5',
    status: 'RETRACTED-overclaim-conditional-on-open-gates',
    scope: 'superseded asymptotic composition; not a rigorous Lambda bound',
    canonicalSource: 'lambda-roadmap.js',
    qualifierKeyword: 'retracted',
    countsAsEstablishedUpperBound: false,
  },
  intercept7e4: {
    value: 7.98e-4,
    valueLiteral: '7.98e-4',
    status: 'CONDITIONAL-historical-imp1147-linear-1overN-model',
    scope: 'intercept under the linear-1/N OLS model (superseded)',
    canonicalSource: 'asymptotic-lambda-bound-2026-05-20.js',
    qualifierKeyword: 'historical',
    countsAsEstablishedUpperBound: false,
  },
};

export const CURRENT_LAMBDA_STATUS = Object.freeze({
  peerReviewedUpperBound: 0.2,
  peerReviewedUpperBoundStatus: 'established-unconditional-benchmark',
  peerReviewedUpperBoundAccepted: true,
  publicUnrefereedClaim: 0.1875,
  publicUnrefereedClaimStatus: 'review-open-not-accepted',
  privateProofCandidate: 0.1787854,
  privateProofCandidateStatus: 'unreviewed-proof-candidate-not-established',
  privateProofCandidateCountsAsEstablishedUpperBound: false,
  privateProofCandidateRepository: 'judegomila/dbn-lambda-01787854-candidate-audit',
  privateProofCandidateRepositoryVisibility: 'private',
  privateProofCandidateTag: 'review-01787854-v3',
  privateProofCandidateCommit: '2e9976c4becbf97e31c56fe75fce07cdff5dd4ea',
  privateProofCandidateTree: '7f15ecf8c3dbc73d547a2d4a3f2287bd87802f44',
  privateProofCandidateManifestSha256:
    '89a201565d5b4a0f02ab49092e3189c7a6d3b0bfaa4e93630c68cf8c4155ae1c',
});

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
      id: 'headline-' + key + '-not-an-established-upper-bound',
      why: key + ' is a legacy/internal quantity and must not be graded as an established Lambda bound',
      holds: () => h.countsAsEstablishedUpperBound === false,
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
      // (c2) cross-file consistency: at least one occurrence of the canonical
      // literal must carry the honest-caveat keyword in its local context.
      id: 'headline-' + key + '-honest-qualifier-in-canonical-source',
      why:
        h.canonicalSource + ' must still contain the honest qualifier "' +
        h.qualifierKeyword + '" within 600 characters of a ' + h.valueLiteral +
        ' occurrence (status: ' + h.status + ')',
      holds: () => {
        const src = readSource(h.canonicalSource);
        if (src === null) return false;
        const lower = src.toLowerCase();
        const literal = h.valueLiteral.toLowerCase();
        const qualifier = h.qualifierKeyword.toLowerCase();
        let at = lower.indexOf(literal);
        while (at >= 0) {
          const lo = Math.max(0, at - 600);
          const hi = Math.min(lower.length, at + literal.length + 600);
          if (lower.slice(lo, hi).includes(qualifier)) return true;
          at = lower.indexOf(literal, at + literal.length);
        }
        return false;
      },
    },
  ]
);

HEADLINE_NUMBERS_ASSERTIONS.push(
  {
    id: 'headline-current-peer-reviewed-upper-bound-is-pt-0p2',
    why: 'The current peer-reviewed unconditional Lambda upper-bound benchmark must remain 0.2',
    holds: () =>
      CURRENT_LAMBDA_STATUS.peerReviewedUpperBound === 0.2 &&
      CURRENT_LAMBDA_STATUS.peerReviewedUpperBoundStatus ===
        'established-unconditional-benchmark' &&
      CURRENT_LAMBDA_STATUS.peerReviewedUpperBoundAccepted === true,
  },
  {
    id: 'headline-external-evidence-grades-remain-distinct',
    why:
      'The 0.1875 public claim must remain review-open, while 0.1787854 must remain an unestablished, publicly posted, unrefereed proof candidate pinned to the v3 package',
    holds: () =>
      CURRENT_LAMBDA_STATUS.publicUnrefereedClaimStatus === 'review-open-not-accepted' &&
      CURRENT_LAMBDA_STATUS.privateProofCandidate === 0.1787854 &&
      CURRENT_LAMBDA_STATUS.privateProofCandidateStatus ===
        'unreviewed-proof-candidate-not-established' &&
      CURRENT_LAMBDA_STATUS.privateProofCandidateCountsAsEstablishedUpperBound === false &&
      CURRENT_LAMBDA_STATUS.privateProofCandidateRepository ===
        'judegomila/dbn-lambda-01787854-candidate-audit' &&
      CURRENT_LAMBDA_STATUS.privateProofCandidateRepositoryVisibility === 'private' &&
      CURRENT_LAMBDA_STATUS.privateProofCandidateTag === 'review-01787854-v3' &&
      CURRENT_LAMBDA_STATUS.privateProofCandidateCommit ===
        '2e9976c4becbf97e31c56fe75fce07cdff5dd4ea' &&
      CURRENT_LAMBDA_STATUS.privateProofCandidateTree ===
        '7f15ecf8c3dbc73d547a2d4a3f2287bd87802f44' &&
      CURRENT_LAMBDA_STATUS.privateProofCandidateManifestSha256 ===
        '89a201565d5b4a0f02ab49092e3189c7a6d3b0bfaa4e93630c68cf8c4155ae1c',
  },
  {
    id: 'headline-heavy-cross-validation-row-remains-withdrawn',
    why:
      'The heavyweight legacy cross-validation row must stay source-graded as ' +
      'withdrawn even when its full zero-corpus assertion module is skipped in bounded PR CI',
    holds: () => {
      const src = readSource('lambda-cross-validation.js');
      return (
        src !== null &&
        src.includes("label: 'WITHDRAWN historical Lambda = 0 composition") &&
        src.includes("boundKind: 'withdrawn-historical-claim'") &&
        src.includes("verificationLevel: 'withdrawn'") &&
        src.includes('countsAsProof: false') &&
        src.includes('countsAsLambdaResult: false')
      );
    },
  },
);

// Fail the build immediately on any violation (mirrors sibling tripwire modules).
for (const a of HEADLINE_NUMBERS_ASSERTIONS) {
  let ok;
  try { ok = a.holds(); } catch { ok = false; }
  if (!ok) {
    throw new Error('[imp-2739] headline-numbers-registry: ' + a.id + ' -- ' + a.why);
  }
}
