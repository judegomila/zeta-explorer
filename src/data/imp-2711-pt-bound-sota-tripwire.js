/**
 * @module imp-2711-pt-bound-sota-tripwire
 *
 * imp-2711 (accuracy, proof-hygiene): a build-time TRIPWIRE that scans every
 * exported honest-ledger record carrying BOTH a finite-N E(N) numeric below the
 * Platt-Trudgian SOTA AND a rigor verdict, and FAILS THE BUILD unless each one
 * pairs its numeric clearance with an explicit honesty qualifier (NO-GO / NOT
 * rigorous / numerical-only) and cites Platt-Trudgian (PT_BOUND = 0.2) as the
 * standing rigorous state of the art.
 *
 * WHY THIS GUARD EXISTS
 * ---------------------
 * Multiple modules (imp-2643 honest-assembled E(N), imp-2633 L_cond discharge,
 * the finite-height beat) compare the finite-N budget E(N) approx 0.0129..0.0200
 * against PT_BOUND = 0.2 and observe it clears by ~15x. That clearance is
 * NUMERICAL ONLY -- the dominant E_coll sub-term rests on the undischargeable
 * C_H = 1/8 ansatz (imp-2640 / imp-2642), so Lambda <= E(N) is NOT a rigorous
 * unconditional beat. The risk is that a consumer module or page silently
 * re-frames the ~15x numeric margin as a rigorous Lambda < 0.2 result, demoting
 * Platt-Trudgian from SOTA. This tripwire makes that demotion impossible without
 * a red build: any record that clears PT numerically MUST carry the honesty
 * qualifier and the PT citation, or the build throws.
 *
 * PT_BOUND = 0.2 is the cited SOTA wherever an E(N) < 0.2 numeric appears.
 *
 * @see imp-2643-honest-assembled-EN (IMP2643_HONEST_ASSEMBLED_EN: NO-GO, C_H blocks)
 * @see imp-2633-l-cond-constant-discharge (IMP2633_L_COND_CONSTANT_DISCHARGE: numerical, NOT rigorous)
 * @see imp-2701-ch-rigor-lock (sibling C_H rigor lock); imp-2713-en-named-gap-registry (gap taxonomy)
 */

import { IMP2643_HONEST_ASSEMBLED_EN } from './imp-2643-honest-assembled-EN.js';
import { IMP2633_L_COND_CONSTANT_DISCHARGE } from './imp-2633-l-cond-constant-discharge.js';

// The standing rigorous SOTA bound that every numeric E(N) clearance must cite.
const PT_BOUND_SOTA = 0.2;
const PT_CITATION = 'Platt-Trudgian (2021), Lambda <= 0.2';

// An honest record clears PT numerically iff its budget < 0.2. To NOT be a
// silent rigorous beat it must (a) NOT claim a rigorous beat, (b) carry an
// honesty qualifier in its verdict, and (c) cite Platt-Trudgian.
const HONESTY_QUALIFIER = /NO-GO|NOT[- ]a[- ]rigorous|NOT[- ]rigorous|numerical(?:ly|-only)?|numerical estimate/i;
const PT_CITATION_RE = /Platt[- ]?Trudgian|PT_BOUND|PT 2021|\bSOTA\b/i;

// Registry of the exported honest-ledger records to scan. Each entry maps a
// record to its numeric budget, its clearance flag, its (optional) rigorous-beat
// claim, and the verdict + citation text the tripwire reads.
const SCANNED_RECORDS = [
  {
    id: 'imp-2643',
    record: IMP2643_HONEST_ASSEMBLED_EN,
    numeric: IMP2643_HONEST_ASSEMBLED_EN.E_N,
    clearsNumerically: IMP2643_HONEST_ASSEMBLED_EN.clearsPTNumerically === true,
    // rigorousBeat is the explicit go/no-go flag; it MUST be false (no rigorous beat).
    claimsRigorousBeat: IMP2643_HONEST_ASSEMBLED_EN.rigorousBeat === true,
    text: `${IMP2643_HONEST_ASSEMBLED_EN.verdict} ${IMP2643_HONEST_ASSEMBLED_EN.citation}`,
  },
  {
    id: 'imp-2633',
    record: IMP2633_L_COND_CONSTANT_DISCHARGE,
    numeric: IMP2633_L_COND_CONSTANT_DISCHARGE.L_cond,
    clearsNumerically: IMP2633_L_COND_CONSTANT_DISCHARGE.beatsPT === true,
    claimsRigorousBeat: false, // no rigorous-beat field; honestVerdict states NOT rigorous
    text: `${IMP2633_L_COND_CONSTANT_DISCHARGE.honestVerdict} ${IMP2633_L_COND_CONSTANT_DISCHARGE.citation}`,
  },
];

function auditRecord(entry) {
  const clearsNumerically = entry.numeric < PT_BOUND_SOTA && entry.clearsNumerically;
  const hasHonestyQualifier = HONESTY_QUALIFIER.test(entry.text);
  const citesPT = PT_CITATION_RE.test(entry.text);
  // Honest iff: when it clears PT numerically, it does NOT claim a rigorous beat,
  // it carries the honesty qualifier, and it cites PT. Records that do not clear
  // numerically are vacuously fine (nothing to re-frame).
  const honest = !clearsNumerically
    || (!entry.claimsRigorousBeat && hasHonestyQualifier && citesPT);
  return {
    id: entry.id,
    numeric: +entry.numeric.toFixed(7),
    clearsNumerically,
    claimsRigorousBeat: entry.claimsRigorousBeat,
    hasHonestyQualifier,
    citesPT,
    honest,
  };
}

const AUDIT = SCANNED_RECORDS.map(auditRecord);

export const IMP2711_PT_BOUND_SOTA_TRIPWIRE = {
  id: 'imp-2711',
  question:
    'Does every exported record that clears the finite-N E(N) below PT_BOUND = 0.2 ' +
    'pair the numeric clearance with an honesty qualifier and cite Platt-Trudgian as SOTA?',
  PT_BOUND_SOTA,
  PT_CITATION,
  recordsScanned: AUDIT.length,
  audit: AUDIT,
  allHonest: AUDIT.every((a) => a.honest),
  verdict:
    'All scanned E(N) < 0.2 records pair the numeric clearance with an explicit ' +
    'honesty qualifier (NO-GO / NOT rigorous / numerical-only) and cite Platt-Trudgian ' +
    'PT_BOUND = 0.2 as the standing rigorous SOTA. The ~15x numeric margin is NOT a ' +
    'rigorous beat anywhere (C_H ansatz blocks, imp-2642). No false QED.',
};

export const IMP2711_PT_BOUND_SOTA_TRIPWIRE_ASSERTIONS = [
  {
    id: 'imp2711-PT-bound-is-0.2',
    description: 'The cited rigorous SOTA stays PT_BOUND = 0.2 (Platt-Trudgian 2021)',
    holds: () => PT_BOUND_SOTA === 0.2,
  },
  {
    id: 'imp2711-records-scanned',
    description: 'At least the two honest-ledger E(N) records (imp-2643, imp-2633) are scanned',
    holds: () => AUDIT.length >= 2,
  },
  {
    id: 'imp2711-no-silent-rigorous-beat',
    description:
      'Every record clearing PT numerically pairs the clearance with an honesty ' +
      'qualifier and a PT citation, and none claims a rigorous beat',
    holds: () => AUDIT.every((a) => a.honest),
  },
];

for (const a of IMP2711_PT_BOUND_SOTA_TRIPWIRE_ASSERTIONS) {
  if (!a.holds()) {
    const offenders = AUDIT.filter((r) => !r.honest).map((r) => r.id).join(', ');
    throw new Error(
      `imp-2711-pt-bound-sota-tripwire assertion failed: ${a.id}` +
        (offenders ? ` (records reframing the numeric clearance as a rigorous beat: ${offenders})` : '')
    );
  }
}
