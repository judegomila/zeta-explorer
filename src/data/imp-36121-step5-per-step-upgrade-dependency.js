/**
 * @module imp-36121-step5-per-step-upgrade-dependency
 * @fileoverview imp-36121 -- read-only SCOPING map (assessment ONLY; changes no
 *   bound, establishes no operator positivity, closes nothing, discharges no
 *   gap, respects the imp-2519 no-overclaim guard, NO QED): enumerate what the
 *   UNVERIFIED Step-5 (final RH combination) of LAMBDA_CHAIN_STEPS concretely
 *   requires to advance from UNVERIFIED, re-keyed by the VERIFICATION GRADE of
 *   each UPSTREAM STEP rather than by research link.
 *
 *   WHY A BY-STEP VIEW (distinct from imp-35074 / imp-36181, which are by-LINK)
 *   --------------------------------------------------------------------------
 *   Step 5 is a pure bookkeeping COMBINATION: it inherits the UNVERIFIED grade
 *   entirely from its upstream inputs and cannot be discharged until every
 *   upstream step is rigorous. The imp-35074 rigorousUpgradeGap block and the
 *   imp-36181 cross-reference both enumerate the three OPEN research LINKS
 *   (G5-perN-translation, G5-step4-bridge, G5-cmb-gue) that Step 5 combines.
 *   This module instead walks the chain STEP BY STEP and asks, for each of
 *   Steps 1-4, "what verification-grade upgrade (if any) must this step undergo
 *   before Step 5 can combine it?" The by-step view surfaces one subtlety the
 *   by-link view hides: Step 3 is graded RIGOROUS (the lim-sup a <= 0 is
 *   unconditional, imp-341/imp-344) yet STILL carries an open obligation into
 *   Step 5 -- the per-N translation r(N) that the Step-4 bridge consumes. A
 *   reader scanning only the per-step verification badges (1 rigorous, 2
 *   numerical, 3 rigorous, 4 numerical) would wrongly conclude Step 3 needs no
 *   further work; it does.
 *
 *   THE PER-STEP DEPENDENCY LADDER (grades + obligations read verbatim from the
 *   lambda-roadmap.js source; this module derives no new obligation)
 *   --------------------------------------------------------------------------
 *   Step 1 (rigorous)  -- NO upgrade needed. Certified zero list to T_0; the
 *     only lever is MORE verified height, not a grade change.
 *   Step 2 (numerical) -- upgrade to rigorous needs the three imp-35058
 *     obligations (G-step-error, G-gronwall, G-interval-enclosure). Feeds the
 *     Step-4 E(N) bridge constants, NOT the headline inequality (imp-2564).
 *   Step 3 (rigorous)  -- the lim-sup is closed, but the PER-N translation r(N)
 *     is OPEN (routes A/B/C, none closed). This residual is the Step-5
 *     G5-perN-translation link; Step 3's badge alone understates it.
 *   Step 4 (numerical) -- upgrade to rigorous needs the three imp-35098
 *     obligations (G6a-holder-modulus, G-Etrunc-Eflow-constants,
 *     G-EN-ladder-verify). The gate is G6a_shock_lipschitz, RH-HARD-CONFIRMED.
 *   Step 5 (unverified) -- pure combination; discharges only after 1-4 are
 *     rigorous. Even then the C_mb many-body correction (G5-cmb-gue, imp-486)
 *     stays an irreducible GUE conditional, capping the reachable claim at
 *     RH-MODULO-GUE, not unconditional RH.
 *
 *   @see src/data/lambda-roadmap.js (LAMBDA_CHAIN_STEPS: Step-2 rigorousUpgradeGap by imp-35058, Step-4 by imp-35098, Step-5 by imp-35074 -- all source blocks this module re-keys)
 *   @see src/data/imp-36181-step5-obligation-chain-cross-reference.js (the complementary by-LINK view: three G5 research links + three B clerical items)
 *   @see src/data/imp-36164-perN-translation-storyline-cross-reference.js (deep-dive of the Step-3 residual / G5-perN-translation link this module flags)
 *
 *   Ticket: imp-36121 (proof, medium). Scoping note only; re-keys existing
 *   source blocks; changes no bound; NO QED; no refereed bound is changed.
 */

import { LAMBDA_CHAIN_STEPS } from './lambda-roadmap.js';

const byStep = (n) => LAMBDA_CHAIN_STEPS.find((s) => s.step === n);
const STEP1 = byStep(1);
const STEP2 = byStep(2);
const STEP3 = byStep(3);
const STEP4 = byStep(4);
const STEP5 = byStep(5);

const oblKeys = (step) =>
  (step.rigorousUpgradeGap ? step.rigorousUpgradeGap.obligations : []).map((o) => o.key);

export const IMP36121_STEP5_PER_STEP_UPGRADE_DEPENDENCY = Object.freeze({
  id: 'imp-36121',
  title:
    'Per-STEP upgrade-dependency map for the UNVERIFIED Step-5 RH combination: what verification-grade ' +
    'upgrade each of Steps 1-4 must undergo before Step 5 can combine it, re-keyed by upstream step ' +
    '(distinct from the by-LINK views of imp-35074 / imp-36181), WITHOUT claiming any is discharged',

  step5Summary: Object.freeze({
    step: STEP5.step,
    label: STEP5.label,
    what: STEP5.what,
    verification: STEP5.verification,
    inheritsGradeFrom: 'upstream Steps 1-4 (pure bookkeeping combination; no independent grade)',
  }),

  // One row per UPSTREAM step, keyed by its current verification grade, naming
  // the concrete upgrade (if any) Step 5 depends on. Obligation keys/labels are
  // read verbatim from the lambda-roadmap.js source blocks.
  perStepDependency: Object.freeze([
    Object.freeze({
      step: 1,
      label: STEP1.label,
      grade: STEP1.verification, // 'rigorous'
      upgradeNeededForStep5: false,
      requiredUpgrade: 'NONE — certified zero list to T_0 is already rigorous',
      residualNote:
        'The only lever here is MORE verified height (push T_0 upward via Platt/LMFDB/Turing); ' +
        'that is a height extension, not a grade change, and Step 5 needs no upgrade from Step 1.',
      obligationKeys: Object.freeze(oblKeys(STEP1)), // []
    }),
    Object.freeze({
      step: 2,
      label: STEP2.label,
      grade: STEP2.verification, // 'numerical'
      upgradeNeededForStep5: true,
      requiredUpgrade: 'numerical -> rigorous (imp-35058: three OPEN obligations)',
      residualNote:
        'Feeds the Step-4 E(N) bridge CONSTANTS, not the headline inequality (imp-2564). All three ' +
        'ingredients below are finite-N floating-point (or one-ULP-interval) measurements; none is a ' +
        'certified N-UNIFORM enclosure of |t_c(N)|.',
      obligationKeys: Object.freeze(oblKeys(STEP2)), // G-step-error, G-gronwall, G-interval-enclosure
    }),
    Object.freeze({
      step: 3,
      label: STEP3.label,
      grade: STEP3.verification, // 'rigorous'
      upgradeNeededForStep5: true,
      requiredUpgrade:
        'NO grade change (the lim sup a <= 0 is unconditional, imp-341/imp-344) BUT the per-N ' +
        'translation r(N) is OPEN',
      residualNote:
        'The BADGE UNDERSTATES the residual: Step 3 is rigorous as a lim-sup, yet Step 5 needs a per-N ' +
        'rate r(N) the lim-sup does not supply (routes A/B/C, none closed). This residual IS the Step-5 ' +
        'G5-perN-translation link -- the by-step badge alone would hide it.',
      obligationKeys: Object.freeze(['G5-perN-translation (carried in Step-5 rigorousUpgradeGap)']),
    }),
    Object.freeze({
      step: 4,
      label: STEP4.label,
      grade: STEP4.verification, // 'numerical'
      upgradeNeededForStep5: true,
      requiredUpgrade: 'numerical -> rigorous (imp-35098: three OPEN obligations)',
      residualNote:
        'THE critical lever (imp-2564). Gated by G6a_shock_lipschitz, the Hoelder-1/2 shock modulus, ' +
        'RH-HARD-CONFIRMED (imp-2640 Gronwall NEGATIVE); E_trunc/E_flow constants unpinned; the ' +
        'assembled E(N) floors at the fixed-strip E_trunc rather than tending to 0 (imp-35164).',
      obligationKeys: Object.freeze(oblKeys(STEP4)), // G6a-holder-modulus, G-Etrunc-Eflow-constants, G-EN-ladder-verify
    }),
  ]),

  // What is left AT Step 5 itself even after every upstream step is rigorous.
  step5ResidualAfterUpstreamClosed: Object.freeze({
    isPureCombination: true,
    combination:
      '(per-N translation) + (Step-4 E(N) bridge) => unconditional Lambda <= 0; ' +
      'Lambda <= 0 with Rodgers-Tao Lambda >= 0 => Lambda = 0; ' +
      'Lambda = 0 with de Bruijn 1950 (imp-327 height mapping) => RH.',
    irreducibleConditional:
      'Even with the other links closed, the Route-A many-body correction C_mb stays a GUE conditional ' +
      '(G5-cmb-gue, imp-486 exhaustive search: no unconditional bound), so the assembled statement is ' +
      'RH-MODULO-GUE-UNIVERSALITY, not unconditional RH.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    closesAnyGap: false,
    dischargesAnyObligation: false,
    derivesAnythingNew: false,
    changesAnyBound: false,
    carriesRHVerdict: false,
    scope:
      'Read-only scoping map that RE-KEYS the imp-35058 (Step 2), imp-35098 (Step 4) and imp-35074 ' +
      '(Step 5) obligation blocks from lambda-roadmap.js by upstream STEP and verification grade. ' +
      'Every enumerated obligation stays OPEN; derives no new obligation; respects the imp-2519 ' +
      'no-overclaim guard.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP36121_STEP5_PER_STEP_UPGRADE_DEPENDENCY_ASSERTIONS = [
  {
    id: 'imp36121-step5-unverified',
    why: 'The mapped Step 5 must reference the actual Step-5 entry, still graded unverified.',
    holds: () =>
      IMP36121_STEP5_PER_STEP_UPGRADE_DEPENDENCY.step5Summary.step === 5 &&
      IMP36121_STEP5_PER_STEP_UPGRADE_DEPENDENCY.step5Summary.verification === 'unverified',
  },
  {
    id: 'imp36121-four-upstream-steps',
    why: 'Exactly the four upstream steps 1-4 must be enumerated, in order.',
    holds: () => {
      const rows = IMP36121_STEP5_PER_STEP_UPGRADE_DEPENDENCY.perStepDependency;
      return rows.length === 4 && rows.map((r) => r.step).join(',') === '1,2,3,4';
    },
  },
  {
    id: 'imp36121-grades-match-source',
    why: 'Each per-step grade must reproduce the lambda-roadmap.js source verification grade verbatim.',
    holds: () => {
      const rows = IMP36121_STEP5_PER_STEP_UPGRADE_DEPENDENCY.perStepDependency;
      return rows.every((r) => r.grade === byStep(r.step).verification);
    },
  },
  {
    id: 'imp36121-step1-needs-no-upgrade',
    why: 'Step 1 is rigorous with no upgrade obligation; the only lever is more verified height.',
    holds: () => {
      const s1 = IMP36121_STEP5_PER_STEP_UPGRADE_DEPENDENCY.perStepDependency.find((r) => r.step === 1);
      return s1.grade === 'rigorous' && s1.upgradeNeededForStep5 === false && s1.obligationKeys.length === 0;
    },
  },
  {
    id: 'imp36121-step3-rigorous-but-residual',
    why: 'The by-step subtlety: Step 3 is rigorous yet STILL carries an open per-N obligation into Step 5.',
    holds: () => {
      const s3 = IMP36121_STEP5_PER_STEP_UPGRADE_DEPENDENCY.perStepDependency.find((r) => r.step === 3);
      return s3.grade === 'rigorous' && s3.upgradeNeededForStep5 === true;
    },
  },
  {
    id: 'imp36121-numerical-steps-carry-source-obligations',
    why: 'Steps 2 and 4 must carry exactly the obligation keys from their lambda-roadmap.js source blocks.',
    holds: () => {
      const s2 = IMP36121_STEP5_PER_STEP_UPGRADE_DEPENDENCY.perStepDependency.find((r) => r.step === 2);
      const s4 = IMP36121_STEP5_PER_STEP_UPGRADE_DEPENDENCY.perStepDependency.find((r) => r.step === 4);
      return (
        s2.obligationKeys.join(',') === oblKeys(STEP2).join(',') &&
        s4.obligationKeys.join(',') === oblKeys(STEP4).join(',') &&
        s2.obligationKeys.length === 3 &&
        s4.obligationKeys.length === 3
      );
    },
  },
  {
    id: 'imp36121-honesty-gate',
    why: 'Mandatory honesty: a re-keying note that closes NOTHING, discharges no obligation, carries NO RH verdict.',
    holds: () => {
      const h = IMP36121_STEP5_PER_STEP_UPGRADE_DEPENDENCY.honestCaveat;
      return (
        h.isProof === false &&
        h.closesAnyGap === false &&
        h.dischargesAnyObligation === false &&
        h.derivesAnythingNew === false &&
        h.changesAnyBound === false &&
        h.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
];

for (const assertion of IMP36121_STEP5_PER_STEP_UPGRADE_DEPENDENCY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36121-step5-per-step-upgrade-dependency assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36121_STEP5_PER_STEP_UPGRADE_DEPENDENCY;
