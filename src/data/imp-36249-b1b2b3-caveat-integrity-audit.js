/**
 * @module imp-36249-b1b2b3-caveat-integrity-audit
 * @fileoverview imp-36249 -- read-only INTEGRITY AUDIT confirming that the
 *   SOTA_LAMBDA_CLAIM headline (src/data/sota-lambda-claim.js, imp-375) and the
 *   LAMBDA_CHAIN_STEPS Step-5 conditionalBookkeeping B1/B2/B3 items (imp-35099,
 *   src/data/lambda-roadmap.js) still carry the finite-height / RH-modulo-GUE
 *   caveat and remain BLOCKED after the imp-36173 B2 T_star ladder module was
 *   added. Verifies no status string drifted toward closure (imp-2519
 *   no-overclaim guard). Audit only; derives nothing new; closes no gap; NO QED.
 *
 *   WHY THIS CHECK MATTERS
 *   -----------------------------------------------------------------------
 *   imp-36173 made B2-effective-height-Tstar CONCRETE by tabulating a finite-N
 *   ladder of T_star(N), but explicitly declared b2Executed:false and
 *   upgradesAnyStatusString:false. This audit cross-checks that declaration
 *   against the actual source records it claims not to have touched: the
 *   SOTA_LAMBDA_CLAIM live withdrawal/non-proof fields (must never promote the
 *   historical finite-height/asymptotic records to a Lambda theorem) and the
 *   three B-items in lambda-roadmap.js (must stay closed:false with their
 *   original blockedOn links intact).
 *
 *   @see src/data/sota-lambda-claim.js (SOTA_LAMBDA_CLAIM, the headline record audited here)
 *   @see src/data/lambda-roadmap.js (LAMBDA_CHAIN_STEPS step 5 conditionalBookkeeping, the B1/B2/B3 items audited here)
 *   @see src/data/imp-36173-b2-tstar-checklist-ladder.js (the module whose non-drift claim this audit verifies)
 *   @see src/data/imp-36181-step5-obligation-chain-cross-reference.js (prior six-item overview; this audit re-checks integrity after imp-36173, not a duplicate)
 *
 *   Ticket: imp-36249 (content, medium). Audit only; changes no bound; NO QED;
 *   no refereed bound is changed.
 */

import { SOTA_LAMBDA_CLAIM } from './sota-lambda-claim.js';
import { LAMBDA_CHAIN_STEPS } from './lambda-roadmap.js';
import { IMP36173_B2_TSTAR_CHECKLIST_LADDER } from './imp-36173-b2-tstar-checklist-ladder.js';

const STEP5 = LAMBDA_CHAIN_STEPS.find((s) => s.step === 5);
const B_ITEMS = STEP5.conditionalBookkeeping.items;
const findB = (key) => B_ITEMS.find((b) => b.key === key);

export const IMP36249_B1B2B3_CAVEAT_INTEGRITY_AUDIT = Object.freeze({
  id: 'imp-36249',
  title:
    'Integrity audit: SOTA_LAMBDA_CLAIM headline + LAMBDA_CHAIN_STEPS Step-5 conditionalBookkeeping ' +
    'B1/B2/B3 items still carry the finite-height / RH-modulo-GUE caveat and remain BLOCKED after the ' +
    'imp-36173 B2 T_star ladder module',

  headlineSnapshot: Object.freeze({
    liveStatus: SOTA_LAMBDA_CLAIM.liveStatus,
    status: SOTA_LAMBDA_CLAIM.status,
    rigorLevel: SOTA_LAMBDA_CLAIM.rigorLevel,
    statement: SOTA_LAMBDA_CLAIM.headline.statement,
    lambdaUpperBound: SOTA_LAMBDA_CLAIM.headline.lambdaUpperBound,
    countsAsProof: SOTA_LAMBDA_CLAIM.auditCorrection.countsAsProof,
    countsAsEstablishedLambdaUpperBound:
      SOTA_LAMBDA_CLAIM.auditCorrection.countsAsEstablishedLambdaUpperBound,
    historicalStatus: SOTA_LAMBDA_CLAIM.historicalStatus,
    historicalRigorLevel: SOTA_LAMBDA_CLAIM.historicalRigorLevel,
  }),

  bItemsSnapshot: Object.freeze([
    Object.freeze({
      key: 'B1-final-assembly-write',
      closed: findB('B1-final-assembly-write').closed,
      blockedOn: findB('B1-final-assembly-write').blockedOn,
    }),
    Object.freeze({
      key: 'B2-effective-height-Tstar',
      closed: findB('B2-effective-height-Tstar').closed,
      blockedOn: findB('B2-effective-height-Tstar').blockedOn,
    }),
    Object.freeze({
      key: 'B3-conditional-caveat-propagation',
      closed: findB('B3-conditional-caveat-propagation').closed,
      blockedOn: findB('B3-conditional-caveat-propagation').blockedOn,
    }),
  ]),

  imp36173NonDriftClaim: Object.freeze({
    b2Executed: IMP36173_B2_TSTAR_CHECKLIST_LADDER.honestCaveat.b2Executed,
    upgradesAnyStatusString: IMP36173_B2_TSTAR_CHECKLIST_LADDER.honestCaveat.upgradesAnyStatusString,
  }),

  verdict:
    'CONFIRMED: SOTA_LAMBDA_CLAIM is withdrawn, counts as neither proof nor an ' +
    'established Lambda upper bound, and exposes no active lambdaUpperBound. Its ' +
    'former rigorous-asymptotic labels remain historical provenance only. All ' +
    'three conditionalBookkeeping items (B1, B2, B3) remain closed:false with ' +
    'their original blockedOn links intact. The imp-36173 non-drift declaration ' +
    '(b2Executed:false, upgradesAnyStatusString:false) is consistent with those ' +
    'blocked items. No refereed bound is changed; NO QED.',

  honestCaveat: Object.freeze({
    isProof: false,
    closesAnyGap: false,
    dischargesAnyBItem: false,
    derivesAnythingNew: false,
    carriesRHVerdict: false,
    scope:
      'Read-only integrity audit cross-checking the imp-36173 non-drift declaration against the actual ' +
      'SOTA_LAMBDA_CLAIM and lambda-roadmap.js Step-5 conditionalBookkeeping source records. Imports both ' +
      'verbatim; derives nothing new; every B item stays BLOCKED; respects the imp-2519 no-overclaim guard.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP36249_B1B2B3_CAVEAT_INTEGRITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp36249-headline-not-unconditional-rh',
    why: 'The live headline must remain withdrawn and expose neither an RH proof nor a Lambda bound.',
    holds: () => {
      const h = IMP36249_B1B2B3_CAVEAT_INTEGRITY_AUDIT.headlineSnapshot;
      return (
        h.liveStatus === 'withdrawn-overclaim-historical-record-only' &&
        h.status === 'withdrawn-overclaim-historical-record-only' &&
        h.rigorLevel === 'not-established-historical-record-only' &&
        h.lambdaUpperBound === null &&
        h.countsAsProof === false &&
        h.countsAsEstablishedLambdaUpperBound === false &&
        /^WITHDRAWN/.test(h.statement) &&
        h.historicalStatus === 'rigorous-asymptotic (independently reviewed)' &&
        h.historicalRigorLevel === 'rigorous-asymptotic (independently reviewed)'
      );
    },
  },
  {
    id: 'imp36249-all-three-b-items-still-blocked',
    why: 'B1/B2/B3 must all still be present with closed:false and a non-empty blockedOn link.',
    holds: () => {
      const b = IMP36249_B1B2B3_CAVEAT_INTEGRITY_AUDIT.bItemsSnapshot;
      return (
        b.length === 3 &&
        b.every((x) => x.closed === false && typeof x.blockedOn === 'string' && x.blockedOn.length > 0) &&
        b.map((x) => x.key).join(',') ===
          'B1-final-assembly-write,B2-effective-height-Tstar,B3-conditional-caveat-propagation'
      );
    },
  },
  {
    id: 'imp36249-imp36173-nondrift-claim-consistent',
    why: 'imp-36173 declared it did not execute B2 or touch any status string; that declaration must hold.',
    holds: () => {
      const c = IMP36249_B1B2B3_CAVEAT_INTEGRITY_AUDIT.imp36173NonDriftClaim;
      return c.b2Executed === false && c.upgradesAnyStatusString === false;
    },
  },
  {
    id: 'imp36249-honesty-gate',
    why: 'Mandatory honesty: an AUDIT that closes no gap, discharges no B item, carries no RH verdict.',
    holds: () => {
      const h = IMP36249_B1B2B3_CAVEAT_INTEGRITY_AUDIT.honestCaveat;
      return (
        h.isProof === false &&
        h.closesAnyGap === false &&
        h.dischargesAnyBItem === false &&
        h.derivesAnythingNew === false &&
        h.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
  {
    id: 'imp36249-verdict-confirmed-no-qed',
    why: 'The verdict must record CONFIRMED integrity and NO QED.',
    holds: () =>
      /CONFIRMED/.test(IMP36249_B1B2B3_CAVEAT_INTEGRITY_AUDIT.verdict) &&
      /NO QED/.test(IMP36249_B1B2B3_CAVEAT_INTEGRITY_AUDIT.verdict),
  },
];

for (const assertion of IMP36249_B1B2B3_CAVEAT_INTEGRITY_AUDIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36249-b1b2b3-caveat-integrity-audit assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36249_B1B2B3_CAVEAT_INTEGRITY_AUDIT;
