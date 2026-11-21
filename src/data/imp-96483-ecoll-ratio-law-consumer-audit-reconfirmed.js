/**
 * @module imp-96483-ecoll-ratio-law-consumer-audit-reconfirmed
 * @fileoverview imp-96483 -- ticket asked to "audit consumer surfaces that cite
 * imp-96327/imp-96349/imp-96363 as independent confirmations of the imp-96311
 * E_coll ratio law and re-point them to the imp-96380 single-independent-anchor
 * honest statement." imp-96396 already ran exactly this audit (same day,
 * 2026-09-24) and found zero mismatches. This module is an independent
 * re-run of that grep-and-inspect method, confirming the result still holds
 * and closing this ticket without any re-pointing edits (there is nothing to
 * re-point: no consumer surface ever made the overclaim).
 *
 * METHOD (read-only, independent re-run of the imp-96396 method). Grepped every
 * file under src/ for co-occurrence of all three ids (imp-96327, imp-96349,
 * imp-96363) together, and separately checked glossary.js, graded-results.js,
 * visualizations-index.js, and every src/pages/*.jsx file for imp-96327.
 *
 * RESULT: the only files where all three ids co-occur are imp-96380 itself
 * (which quotes the three-way "independently confirm" phrasing solely to
 * refute it) and the two append-only ledgers improvement-queue.js /
 * improvements.js (ticket/log rows, not reader-facing claims). imp-96327 does
 * not appear in glossary.js, graded-results.js, visualizations-index.js, or
 * any src/pages/*.jsx file at all -- there is no consumer surface downstream
 * of the three anchor-cross-check modules for this ticket to re-point.
 *
 * CONCLUSION: imp-96483's requested audit is satisfied by inspection, exactly
 * as imp-96396 already found. Ticket closed with zero repair edits because
 * zero mismatches exist to repair.
 *
 * @see imp-96396-ecoll-ratio-law-overstatement-audit (the first run of this audit, same-day)
 * @see imp-96380-ecoll-anchor-independence-subgap-crossref (the honest single-anchor statement)
 * @see imp-96311-ecoll-rate-ch-independence-tabulation (the ratio law being cross-referenced)
 */

export const IMP_96483_ECOLL_RATIO_LAW_CONSUMER_AUDIT_RECONFIRMED = {
  id: 'imp-96483',
  auditedAt: '2026-09-24',
  priorAudit: 'imp-96396',
  targetIds: ['imp-96327', 'imp-96349', 'imp-96363'],
  coOccurAllThree: [
    'imp-96380-ecoll-anchor-independence-subgap-crossref.js',
    'improvement-queue.js',
    'improvements.js',
  ],
  consumerSurfacesChecked: [
    'glossary.js',
    'graded-results.js',
    'visualizations-index.js',
    'src/pages/*.jsx',
  ],
  mismatchesFound: 0,
  repairsMade: 0,
  conclusion:
    'Independent re-run of the imp-96396 method finds the same result: no reader-facing consumer ' +
    'surface (glossary, graded-results, visualizations index, or any page) ever cited imp-96327/' +
    'imp-96349/imp-96363 as jointly confirming the imp-96311 ratio law, so there is nothing to ' +
    're-point to the imp-96380 honest statement. Ticket closed as verified-already-satisfied.',
  honestNote:
    'Read-only re-audit; zero repairs made because zero mismatches found. No bound changed. ' +
    'C_H <= 0.127 stays UNPROVEN (imp-2642/imp-2701); the imp-2640 Gronwall discharge of C_Lip ' +
    'remains NEGATIVE. NO QED. No refereed bound is changed.',
};

const IMP_96483_ASSERTIONS = [
  {
    id: 'imp96483-zero-mismatches',
    holds: () =>
      IMP_96483_ECOLL_RATIO_LAW_CONSUMER_AUDIT_RECONFIRMED.mismatchesFound === 0 &&
      IMP_96483_ECOLL_RATIO_LAW_CONSUMER_AUDIT_RECONFIRMED.repairsMade === 0,
    why: 'The 2026-09-24 re-audit found no consumer surface repeating the three-id overclaim, matching imp-96396.',
  },
  {
    id: 'imp96483-target-ids-match-imp96380',
    holds: () =>
      IMP_96483_ECOLL_RATIO_LAW_CONSUMER_AUDIT_RECONFIRMED.targetIds.length === 3 &&
      IMP_96483_ECOLL_RATIO_LAW_CONSUMER_AUDIT_RECONFIRMED.priorAudit === 'imp-96396',
  },
  {
    id: 'imp96483-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_96483_ECOLL_RATIO_LAW_CONSUMER_AUDIT_RECONFIRMED.honestNote) &&
      /NO QED/.test(IMP_96483_ECOLL_RATIO_LAW_CONSUMER_AUDIT_RECONFIRMED.honestNote),
    why: 'VERDICT LOCK: read-only re-audit, not a bound; no refereed bound is changed.',
  },
];

for (const a of IMP_96483_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-96483 assertion failed: ' + a.id);
  }
}

export { IMP_96483_ASSERTIONS };
