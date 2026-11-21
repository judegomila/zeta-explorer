/**
 * @module imp-36181-step5-obligation-chain-cross-reference
 * @fileoverview imp-36181 -- read-only cross-reference NARRATIVE assembling the
 *   full LAMBDA_CHAIN_STEPS Step-5 picture for a reader who lands on Step 5
 *   without the upstream context: the three OPEN research links
 *   (rigorousUpgradeGap.obligations, imp-35074) that Step 5 must combine, PLUS
 *   the three clerical bookkeeping items (conditionalBookkeeping.items,
 *   imp-35099) that would STILL remain even after those links close. Assembly /
 *   cross-reference ONLY: imports both source blocks verbatim, derives nothing
 *   new, closes nothing, discharges no gap, respects the imp-2519 no-overclaim
 *   guard, NO QED.
 *
 *   WHY TWO SEPARATE BLOCKS EXIST (the thing a cold reader most often misses)
 *   --------------------------------------------------------------------------
 *   imp-35074 enumerates the RESEARCH links Step 5 combines -- G5-perN-
 *   translation, G5-step4-bridge, G5-cmb-gue -- each an open problem, not a
 *   bookkeeping task. imp-35099 is a COMPLEMENT: it enumerates the mechanical
 *   WRITE-UP items (B1 final assembly, B2 effective height, B3 caveat
 *   propagation) that close NOTHING on their own and stay inert until the
 *   research links above are rigorous. Reading either block alone risks two
 *   opposite mistakes: reading only the G5 block hides that even full closure
 *   still leaves a clerical checklist to execute; reading only the B block
 *   (which look like simple TODOs) hides that they are entirely gated on three
 *   unsolved research problems, one of which (G5-cmb-gue) is irreducible.
 *
 *   THE SIX-ITEM CHAIN (imports each item verbatim from lambda-roadmap.js)
 *   --------------------------------------------------------------------------
 *   Research links (rigorousUpgradeGap, all OPEN):
 *     G5-perN-translation -- per-N rate r(N) translating the Step-3 lim-sup;
 *       three candidate routes (A/B/C), none closed (imp-36045 ranks C > B > A).
 *     G5-step4-bridge -- Step-4 Polymath15 E(N) bridge; sole open sub-gap is
 *       G6a_shock_lipschitz, itself RH-HARD-CONFIRMED (ch-wall-frontier-verdict).
 *     G5-cmb-gue -- the Route-A many-body correction C_mb; irreducible named
 *       GUE conditional (imp-486 exhaustive search), NOT closable by bookkeeping.
 *   Clerical bookkeeping items (conditionalBookkeeping, all blocked):
 *     B1-final-assembly-write -- write the closed-form chain into
 *       sota-lambda-claim.js; blocked on all three G5 links.
 *     B2-effective-height-Tstar -- report T_star(N) at the achieved N; blocked
 *       on the achieved-N of closed Steps 3-4 (undefined while OPEN).
 *     B3-conditional-caveat-propagation -- propagate the RH-modulo-GUE caveat;
 *       blocked on G5-cmb-gue specifically (irreducible).
 *
 *   @see src/data/lambda-roadmap.js (LAMBDA_CHAIN_STEPS step 5: rigorousUpgradeGap by imp-35074, conditionalBookkeeping by imp-35099 -- both source blocks this module cross-references)
 *   @see src/data/imp-36080-tstar-at-achieved-rung.js (imp-36080 partial B2 measurement: T_star(N) at the achieved rung, still BLOCKED on the same three links)
 *   @see src/data/lambda-roadmap.js (G5-cmb-gue.surrogateAssessment, by imp-36079 inline: a bounded-window non-GUE surrogate exists but does not discharge the asymptotic tail)
 *   @see src/data/imp-36164-perN-translation-storyline-cross-reference.js (deep-dives the G5-perN-translation link alone across four sub-stages; this module stays at the Step-5-level six-item overview)
 *   @see src/data/lambda-rh-height-mapping.js (imp-327 effectiveHeightForN / N_TO_T_STAR_TABLE, the B2 machinery)
 *   @see src/data/sota-lambda-claim.js (the B1 target record; today's headline stays the finite-height/asymptotic-modulo-constants SOTA, not an unconditional RH claim)
 *
 *   Ticket: imp-36181 (content, low). Note only; imports both source blocks
 *   verbatim; changes no bound; NO QED; no refereed bound is changed.
 */

import { LAMBDA_CHAIN_STEPS } from './lambda-roadmap.js';

const STEP5 = LAMBDA_CHAIN_STEPS.find((s) => s.step === 5);
const G5_OBLIGATIONS = STEP5.rigorousUpgradeGap.obligations;
const B_ITEMS = STEP5.conditionalBookkeeping.items;

const findG5 = (key) => G5_OBLIGATIONS.find((o) => o.key === key);
const findB = (key) => B_ITEMS.find((b) => b.key === key);

export const IMP36181_STEP5_OBLIGATION_CHAIN_CROSS_REFERENCE = Object.freeze({
  id: 'imp-36181',
  title:
    'Cross-reference narrative: the LAMBDA_CHAIN_STEPS Step-5 six-item obligation chain -- the three OPEN ' +
    'research links (G5-perN-translation, G5-step4-bridge, G5-cmb-gue) that Step 5 combines, plus the three ' +
    'clerical bookkeeping items (B1-B3) that stay blocked on them -- for a reader landing on Step 5 cold',

  step5Summary: Object.freeze({
    step: STEP5.step,
    label: STEP5.label,
    what: STEP5.what,
    verification: STEP5.verification,
  }),

  researchLinks: Object.freeze([
    Object.freeze({
      key: 'G5-perN-translation',
      label: findG5('G5-perN-translation').label,
      status: 'OPEN',
      need: findG5('G5-perN-translation').need,
      feedsInto: findG5('G5-perN-translation').feedsInto,
    }),
    Object.freeze({
      key: 'G5-step4-bridge',
      label: findG5('G5-step4-bridge').label,
      status: 'OPEN',
      need: findG5('G5-step4-bridge').need,
      feedsInto: findG5('G5-step4-bridge').feedsInto,
    }),
    Object.freeze({
      key: 'G5-cmb-gue',
      label: findG5('G5-cmb-gue').label,
      status: 'OPEN (irreducible)',
      need: findG5('G5-cmb-gue').need,
      feedsInto: findG5('G5-cmb-gue').feedsInto,
    }),
  ]),

  clericalItems: Object.freeze([
    Object.freeze({
      key: 'B1-final-assembly-write',
      label: findB('B1-final-assembly-write').label,
      status: 'BLOCKED',
      blockedOn: findB('B1-final-assembly-write').blockedOn,
    }),
    Object.freeze({
      key: 'B2-effective-height-Tstar',
      label: findB('B2-effective-height-Tstar').label,
      status: 'BLOCKED (partial measurement exists: imp-36080)',
      blockedOn: findB('B2-effective-height-Tstar').blockedOn,
    }),
    Object.freeze({
      key: 'B3-conditional-caveat-propagation',
      label: findB('B3-conditional-caveat-propagation').label,
      status: 'BLOCKED',
      blockedOn: findB('B3-conditional-caveat-propagation').blockedOn,
    }),
  ]),

  whyTwoBlocks:
    'imp-35074 (research links, G5-*) and imp-35099 (clerical checklist, B1-B3) are COMPLEMENTS, not ' +
    'duplicates. The G5 block names what must be PROVEN before Step 5 can combine anything; the B block ' +
    'names what must be WRITTEN once the G5 block is proven. Reading only one block hides half the picture: ' +
    'the G5 block alone hides that a clerical checklist still remains after closure; the B block alone ' +
    '(each item reads like a simple TODO) hides that every item is gated on unsolved, in one case ' +
    'irreducible, research.',

  honestCaveat: Object.freeze({
    isProof: false,
    closesAnyGap: false,
    dischargesAnyG5Obligation: false,
    dischargesAnyBItem: false,
    derivesAnythingNew: false,
    isReductionBelowRH: false,
    carriesRHVerdict: false,
    scope:
      'Read-only cross-reference narrative assembling the imp-35074 rigorousUpgradeGap block and the ' +
      'imp-35099 conditionalBookkeeping block from lambda-roadmap.js Step 5 into one six-item overview. ' +
      'Imports both blocks verbatim; derives nothing new; every G5 link stays OPEN and every B item stays ' +
      'BLOCKED; respects the imp-2519 no-overclaim guard.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP36181_STEP5_OBLIGATION_CHAIN_CROSS_REFERENCE_ASSERTIONS = [
  {
    id: 'imp36181-step5-is-step-five-unverified',
    why: 'The assembled step summary must reference the actual Step 5 entry, still graded unverified.',
    holds: () =>
      IMP36181_STEP5_OBLIGATION_CHAIN_CROSS_REFERENCE.step5Summary.step === 5 &&
      IMP36181_STEP5_OBLIGATION_CHAIN_CROSS_REFERENCE.step5Summary.verification === 'unverified',
  },
  {
    id: 'imp36181-three-research-links-all-open',
    why: 'Exactly the three named G5 links must be present and every one must record an OPEN status.',
    holds: () => {
      const r = IMP36181_STEP5_OBLIGATION_CHAIN_CROSS_REFERENCE.researchLinks;
      return (
        r.length === 3 &&
        r.every((x) => /^OPEN/.test(x.status)) &&
        r.map((x) => x.key).join(',') === 'G5-perN-translation,G5-step4-bridge,G5-cmb-gue'
      );
    },
  },
  {
    id: 'imp36181-three-clerical-items-all-blocked',
    why: 'Exactly the three named B items must be present and every one must record a BLOCKED status.',
    holds: () => {
      const b = IMP36181_STEP5_OBLIGATION_CHAIN_CROSS_REFERENCE.clericalItems;
      return (
        b.length === 3 &&
        b.every((x) => /^BLOCKED/.test(x.status)) &&
        b.map((x) => x.key).join(',') ===
          'B1-final-assembly-write,B2-effective-height-Tstar,B3-conditional-caveat-propagation'
      );
    },
  },
  {
    id: 'imp36181-matches-source-verbatim',
    why: 'Every assembled label must reproduce the lambda-roadmap.js source label verbatim, not a paraphrase.',
    holds: () => {
      const r = IMP36181_STEP5_OBLIGATION_CHAIN_CROSS_REFERENCE.researchLinks;
      const b = IMP36181_STEP5_OBLIGATION_CHAIN_CROSS_REFERENCE.clericalItems;
      return (
        r.every((x) => x.label === findG5(x.key).label) &&
        b.every((x) => x.label === findB(x.key).label)
      );
    },
  },
  {
    id: 'imp36181-honesty-gate',
    why: 'Mandatory honesty: an ASSEMBLY note that closes NOTHING, discharges no G5 or B item, carries NO RH verdict.',
    holds: () => {
      const h = IMP36181_STEP5_OBLIGATION_CHAIN_CROSS_REFERENCE.honestCaveat;
      return (
        h.isProof === false &&
        h.closesAnyGap === false &&
        h.dischargesAnyG5Obligation === false &&
        h.dischargesAnyBItem === false &&
        h.derivesAnythingNew === false &&
        h.isReductionBelowRH === false &&
        h.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
];

for (const assertion of IMP36181_STEP5_OBLIGATION_CHAIN_CROSS_REFERENCE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36181-step5-obligation-chain-cross-reference assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36181_STEP5_OBLIGATION_CHAIN_CROSS_REFERENCE;
