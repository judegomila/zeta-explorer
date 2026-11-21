/**
 * @module imp-36210-step4-obligations-storyline-crossref
 * @fileoverview imp-36210 -- read-only cross-reference NARRATIVE assembling the
 *   LAMBDA_CHAIN_STEPS Step-4 (Polymath15 bridge) rigorous-upgrade storyline for
 *   a reader who lands on any ONE of its three named OPEN obligations (imp-35098,
 *   lambda-roadmap.js): G6a-holder-modulus, G-Etrunc-Eflow-constants,
 *   G-EN-ladder-verify. Assembly / cross-reference ONLY: imports the roadmap
 *   obligations block plus the three deep-dive modules verbatim, derives
 *   nothing new, closes nothing, discharges no obligation, NO QED.
 *
 *   WHY A COLD READER NEEDS THIS (the thing landing on one obligation alone hides)
 *   --------------------------------------------------------------------------
 *   Each obligation has its own deep-dive. G6a-holder-modulus: imp-3671 (the
 *   imp-3642 mesoscopic V0 profile is STRUCTURALLY SILENT on the shock-front
 *   Lipschitz modulus -- two independent obstructions, wrong TYPE and
 *   Gronwall-vacuous at the nearest-pair front). G-Etrunc-Eflow-constants:
 *   imp-34791 (PARTIAL -- kappa_T locked exact at 2/5, prefactor corrected
 *   3 -> 5, but E_trunc stays 16.7x short of the requirement curve and E_flow
 *   leans on the unproven A1 input once imp-398's own C_G = 8.57 reading
 *   breaks the OLS fallback). G-EN-ladder-verify: imp-35100 (on the CURRENT
 *   surrogate the assembled E(N) does NOT tend to 0 -- it floors at the fixed
 *   constant E_trunc = 3.06e-5, so even a closed G6a would not itself deliver
 *   E(N) -> 0). Reading any one deep-dive alone risks missing that the three
 *   obligations are LINKED through the SAME E_trunc constant -- the honest
 *   discharge audit (imp-34791) and the ladder-floor measurement (imp-35100)
 *   both pivot on the identical fixed-strip E_trunc = 3.06e-5 value, so
 *   progress (or lack of it) on one obligation directly bounds what the other
 *   can achieve, and both are logically upstream of a closed G6a in the
 *   assembled-formula sense (G6a supplies C_H in E_coll; the other two supply
 *   the additive constants around it).
 *
 *   @see src/data/lambda-roadmap.js (LAMBDA_CHAIN_STEPS step 4 rigorousUpgradeGap by imp-35098 -- the source obligations block this module cross-references)
 *   @see src/data/imp-3671-mesoscopic-v0-vs-g6a-shock-lipschitz-assessment.js (G6a-holder-modulus deep dive: STRUCTURALLY SILENT verdict, S1 type mismatch + S2 Gronwall-vacuous)
 *   @see src/data/imp-34791-etrunc-eflow-pt-anchor-honest-discharge.js (G-Etrunc-Eflow-constants deep dive: PARTIAL discharge, kappa_T locked 2/5, E_trunc 16.7x short, E_flow leans on A1)
 *   @see src/data/imp-35100-surrogate-total-E-fartail-floor.js (G-EN-ladder-verify deep dive: total E(N) floors at E_trunc = 3.06e-5, does NOT tend to 0 on the current surrogate)
 *   @see src/data/imp-36205-step2-obligations-storyline-crossref.js (sibling assembly pattern for the Step-2 three-obligation chain)
 *   @see src/data/imp-36181-step5-obligation-chain-cross-reference.js (sibling assembly pattern for the Step-5 obligation chain)
 *
 *   Ticket: imp-36210 (content, low). Note only; imports the roadmap block and
 *   all three deep-dive modules verbatim; changes no bound; NO QED;
 *   no refereed bound is changed.
 */

import { LAMBDA_CHAIN_STEPS } from './lambda-roadmap.js';
import { IMP3671_MESOSCOPIC_V0_VS_G6A_SHOCK_LIPSCHITZ_ASSESSMENT } from './imp-3671-mesoscopic-v0-vs-g6a-shock-lipschitz-assessment.js';
import { ETRUNC_EFLOW_PT_ANCHOR_HONEST_DISCHARGE } from './imp-34791-etrunc-eflow-pt-anchor-honest-discharge.js';
import { IMP35100_SURROGATE_TOTAL_E_FARTAIL_FLOOR } from './imp-35100-surrogate-total-E-fartail-floor.js';

const STEP4 = LAMBDA_CHAIN_STEPS.find((s) => s.step === 4);
const OBLIGATIONS = STEP4.rigorousUpgradeGap.obligations;
const findOb = (key) => OBLIGATIONS.find((o) => o.key === key);

export const IMP36210_STEP4_OBLIGATIONS_STORYLINE_CROSSREF = Object.freeze({
  id: 'imp-36210',
  title:
    'Cross-reference narrative: the LAMBDA_CHAIN_STEPS Step-4 Polymath15-bridge rigorous-upgrade ' +
    'storyline (imp-35098) -- the three OPEN obligations G6a-holder-modulus, G-Etrunc-Eflow-constants, ' +
    'G-EN-ladder-verify, and their shared E_trunc pivot -- for a reader landing on any one obligation cold',

  step4Summary: Object.freeze({
    step: STEP4.step,
    label: STEP4.label,
    verification: STEP4.verification,
    rigorousUpgradeGapStatus: STEP4.rigorousUpgradeGap.status,
  }),

  obligations: Object.freeze([
    Object.freeze({
      key: 'G6a-holder-modulus',
      label: findOb('G6a-holder-modulus').label,
      closed: findOb('G6a-holder-modulus').closed,
      maturity:
        'STRUCTURALLY SILENT -- the imp-3642 mesoscopic V0 direct-flow measurement does NOT supply ' +
        'the shock-front Hoelder-1/2 modulus (two independent obstructions: wrong TYPE, Gronwall-vacuous ' +
        'at the nearest-pair front); no candidate closure route found (imp-3671)',
      deepDive: 'imp-3671',
      structurallySilent: IMP3671_MESOSCOPIC_V0_VS_G6A_SHOCK_LIPSCHITZ_ASSESSMENT.structurallySilent,
    }),
    Object.freeze({
      key: 'G-Etrunc-Eflow-constants',
      label: findOb('G-Etrunc-Eflow-constants').label,
      closed: findOb('G-Etrunc-Eflow-constants').closed,
      maturity:
        'PARTIAL -- kappa_T locked exact at 2/5 and the tail prefactor corrected 3 -> 5, but E_trunc ' +
        'stays 16.7x short of the sigma = 3/4 requirement curve and E_flow leans on the unproven A1 ' +
        'input once the imp-398 C_G = 8.57 reading breaks the OLS fallback (imp-34791)',
      deepDive: 'imp-34791',
      dethronesPT: ETRUNC_EFLOW_PT_ANCHOR_HONEST_DISCHARGE.honestCeiling.dethronesPT,
    }),
    Object.freeze({
      key: 'G-EN-ladder-verify',
      label: findOb('G-EN-ladder-verify').label,
      closed: findOb('G-EN-ladder-verify').closed,
      maturity:
        'ON THE CURRENT SURROGATE E(N) DOES NOT TEND TO 0 -- it floors at the constant E_trunc = ' +
        '3.06e-5 as the GUE-conditional E_coll vanishes; only E(N) - E_trunc -> 0 (imp-35100)',
      deepDive: 'imp-35100',
      stepFourVerdict: IMP35100_SURROGATE_TOTAL_E_FARTAIL_FLOOR.stepFourVerdict,
    }),
  ]),

  whySharedPivot:
    'The G-Etrunc-Eflow-constants and G-EN-ladder-verify obligations are LINKED through the SAME ' +
    'E_trunc constant, not independent research problems. imp-34791 pins the PT-anchored E_trunc at ' +
    'the fixed strip sigma = 3/4 and finds it 16.7x short of the requirement curve; imp-35100 measures ' +
    'that the SAME fixed constant is exactly what the assembled total E(N) asymptotes to as N -> infinity, ' +
    'so the ladder-verify obligation cannot close while the constant-discharge obligation leaves E_trunc ' +
    'as a fixed (not N-vanishing) strip value. G6a-holder-modulus is logically upstream of the assembled ' +
    'formula in a different way: it supplies C_H inside E_coll, the one term in E(N) that DOES vanish, so ' +
    'closing G6a alone (even if it were tractable) would not by itself defeat the E_trunc floor imp-35100 ' +
    'identifies.',

  whyNotSameMaturity:
    'The three obligations are NOT at the same stage. G6a-holder-modulus (imp-3671) is a NEGATIVE ' +
    'finding -- the sole candidate route examined is structurally silent, with no alternative route known. ' +
    'G-Etrunc-Eflow-constants (imp-34791) is the most ADVANCED -- two genuine rigorous sub-steps (the ' +
    'kappa_T lock and the prefactor correction) plus an honest literature-frontier quantification, though ' +
    'still short of a full discharge. G-EN-ladder-verify (imp-35100) is a MEASUREMENT of the current ' +
    'surrogate rather than a proof attempt, and its honest verdict is that even a hypothetically-closed ' +
    'G6a would not make this surrogate satisfy E(N) -> 0 as written, since the constant E_trunc floor is ' +
    'independent of G6a.',

  honestCaveat: Object.freeze({
    isProof: false,
    closesAnyObligation: false,
    dischargesAnyIngredient: false,
    derivesAnythingNew: false,
    isReductionBelowRH: false,
    carriesRHVerdict: false,
    scope:
      'Read-only cross-reference narrative assembling the imp-35098 rigorousUpgradeGap block ' +
      '(lambda-roadmap.js Step 4) with the three deep-dive modules imp-3671, imp-34791, imp-35100. ' +
      'Imports every field verbatim; derives nothing new; all three obligations stay OPEN.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP36210_STEP4_OBLIGATIONS_STORYLINE_CROSSREF_ASSERTIONS = [
  {
    id: 'imp36210-step4-is-step-four-numerical',
    why: 'The assembled step summary must reference the actual Step 4 entry, still graded numerical.',
    holds: () =>
      IMP36210_STEP4_OBLIGATIONS_STORYLINE_CROSSREF.step4Summary.step === 4 &&
      IMP36210_STEP4_OBLIGATIONS_STORYLINE_CROSSREF.step4Summary.verification === 'numerical',
  },
  {
    id: 'imp36210-three-obligations-all-open',
    why: 'Exactly the three named obligations must be present and every one must record closed: false.',
    holds: () => {
      const o = IMP36210_STEP4_OBLIGATIONS_STORYLINE_CROSSREF.obligations;
      return (
        o.length === 3 &&
        o.every((x) => x.closed === false) &&
        o.map((x) => x.key).join(',') ===
          'G6a-holder-modulus,G-Etrunc-Eflow-constants,G-EN-ladder-verify'
      );
    },
  },
  {
    id: 'imp36210-matches-roadmap-labels-verbatim',
    why: 'Every assembled label must reproduce the lambda-roadmap.js source label verbatim, not a paraphrase.',
    holds: () => {
      const o = IMP36210_STEP4_OBLIGATIONS_STORYLINE_CROSSREF.obligations;
      return o.every((x) => x.label === findOb(x.key).label);
    },
  },
  {
    id: 'imp36210-g6a-structurally-silent-imported',
    why: 'The G6a deep-dive structurallySilent flag must be imported verbatim and read true.',
    holds: () =>
      IMP3671_MESOSCOPIC_V0_VS_G6A_SHOCK_LIPSCHITZ_ASSESSMENT.structurallySilent === true &&
      IMP36210_STEP4_OBLIGATIONS_STORYLINE_CROSSREF.obligations.find(
        (x) => x.key === 'G6a-holder-modulus',
      ).structurallySilent === true,
  },
  {
    id: 'imp36210-etrunc-eflow-does-not-dethrone-pt',
    why: 'The G-Etrunc-Eflow-constants deep dive must confirm no dethroning of Platt-Trudgian, imported verbatim.',
    holds: () =>
      ETRUNC_EFLOW_PT_ANCHOR_HONEST_DISCHARGE.honestCeiling.dethronesPT === false &&
      IMP36210_STEP4_OBLIGATIONS_STORYLINE_CROSSREF.obligations.find(
        (x) => x.key === 'G-Etrunc-Eflow-constants',
      ).dethronesPT === false,
  },
  {
    id: 'imp36210-en-ladder-floors-not-vanishes',
    why: 'The G-EN-ladder-verify deep dive must record E(N) floors at E_trunc, not E(N) -> 0.',
    holds: () => {
      const v = IMP35100_SURROGATE_TOTAL_E_FARTAIL_FLOOR.stepFourVerdict;
      const assembled = IMP36210_STEP4_OBLIGATIONS_STORYLINE_CROSSREF.obligations.find(
        (x) => x.key === 'G-EN-ladder-verify',
      ).stepFourVerdict;
      return /NOT E\(N\) -> 0/.test(v) && assembled === v;
    },
  },
  {
    id: 'imp36210-honesty-gate',
    why: 'Mandatory honesty: an ASSEMBLY note that closes NOTHING, discharges no obligation, carries NO RH verdict.',
    holds: () => {
      const h = IMP36210_STEP4_OBLIGATIONS_STORYLINE_CROSSREF.honestCaveat;
      return (
        h.isProof === false &&
        h.closesAnyObligation === false &&
        h.dischargesAnyIngredient === false &&
        h.derivesAnythingNew === false &&
        h.isReductionBelowRH === false &&
        h.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
];

for (const assertion of IMP36210_STEP4_OBLIGATIONS_STORYLINE_CROSSREF_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36210-step4-obligations-storyline-crossref assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36210_STEP4_OBLIGATIONS_STORYLINE_CROSSREF;
