/**
 * @module imp-36205-step2-obligations-storyline-crossref
 * @fileoverview imp-36205 -- read-only cross-reference NARRATIVE assembling the
 *   LAMBDA_CHAIN_STEPS Step-2 (backward-Dyson-ODE) rigorous-upgrade storyline
 *   for a reader who lands on any ONE of its three named OPEN obligations
 *   (imp-35058, lambda-roadmap.js): G-step-error, G-gronwall, G-interval-
 *   enclosure. Assembly / cross-reference ONLY: imports the roadmap
 *   obligations block plus the three deep-dive modules verbatim, derives
 *   nothing new, closes nothing, discharges no obligation, NO QED.
 *
 *   WHY A COLD READER NEEDS THIS (the thing landing on one obligation alone hides)
 *   --------------------------------------------------------------------------
 *   Each obligation has its own deep-dive module -- G-step-error: imp-35127
 *   (pure SCOPING, enumerates ingredients I1..I5, discharges none). G-gronwall:
 *   imp-2520 / backward-flow-stability-gronwall.js (NOT pure scoping -- an
 *   actual theorem module, Lemma B PROVED with an explicit Gronwall constant,
 *   status "HONEST PARTIAL CLOSURE", conditional on one named sub-gap SG1,
 *   and separately flagged Gronwall-vacuous near the true collision front).
 *   G-interval-enclosure: imp-35129 (pure SCOPING, characterizes the imp-362
 *   single-scale witness, discharges nothing). Reading any one deep-dive alone
 *   risks two mistakes: (a) missing that the three are COUPLED, not
 *   independent -- imp-35127 names I3 as sharing the G-gronwall N-uniform
 *   constant and I5 as sharing the G-interval-enclosure pole-reduction
 *   machinery, so progress on G-step-error's ingredients cannot outpace the
 *   other two; (b) missing that the obligations are NOT at the same maturity
 *   stage -- G-gronwall already has a proved lemma (conditional on SG1) while
 *   G-step-error and G-interval-enclosure remain at pure enumeration/
 *   characterization, so a reader who only saw G-gronwall's proved lemma could
 *   wrongly assume the other two are similarly advanced.
 *
 *   @see src/data/lambda-roadmap.js (LAMBDA_CHAIN_STEPS step 2 rigorousUpgradeGap by imp-35058 -- the source obligations block this module cross-references)
 *   @see src/data/imp-35127-g-step-error-certified-bound-scope.js (G-step-error deep dive: ingredients I1..I5, SCOPING only, couples I3 to G-gronwall and I5 to G-interval-enclosure)
 *   @see src/data/backward-flow-stability-gronwall.js (G-gronwall deep dive, imp-2520: Lemma B PROVED, HONEST PARTIAL CLOSURE, conditional on SG1, Gronwall-vacuous near the front)
 *   @see src/data/imp-35129-interval-enclosure-n-dependence-scoping.js (G-interval-enclosure deep dive: imp-362 witness width equals dt exactly, single decade of coverage, SCOPING only)
 *   @see src/data/imp-36181-step5-obligation-chain-cross-reference.js (sibling assembly pattern for the Step-5 six-item obligation chain)
 *
 *   Ticket: imp-36205 (content, low). Note only; imports the roadmap block and
 *   all three deep-dive modules verbatim; changes no bound; NO QED;
 *   no refereed bound is changed.
 */

import { LAMBDA_CHAIN_STEPS } from './lambda-roadmap.js';
import { IMP35127_G_STEP_ERROR_CERTIFIED_BOUND_SCOPE } from './imp-35127-g-step-error-certified-bound-scope.js';
import { BACKWARD_FLOW_STABILITY_GRONWALL } from './backward-flow-stability-gronwall.js';
import { IMP35129_INTERVAL_ENCLOSURE_N_DEPENDENCE_SCOPING } from './imp-35129-interval-enclosure-n-dependence-scoping.js';

const STEP2 = LAMBDA_CHAIN_STEPS.find((s) => s.step === 2);
const OBLIGATIONS = STEP2.rigorousUpgradeGap.obligations;
const findOb = (key) => OBLIGATIONS.find((o) => o.key === key);

export const IMP36205_STEP2_OBLIGATIONS_STORYLINE_CROSSREF = Object.freeze({
  id: 'imp-36205',
  title:
    'Cross-reference narrative: the LAMBDA_CHAIN_STEPS Step-2 backward-Dyson-ODE rigorous-upgrade ' +
    'storyline (imp-35058) -- the three OPEN obligations G-step-error, G-gronwall, G-interval-enclosure, ' +
    'their couplings, and their DIFFERING maturity stages -- for a reader landing on any one obligation cold',

  step2Summary: Object.freeze({
    step: STEP2.step,
    label: STEP2.label,
    verification: STEP2.verification,
    rigorousUpgradeGapStatus: STEP2.rigorousUpgradeGap.status,
  }),

  obligations: Object.freeze([
    Object.freeze({
      key: 'G-step-error',
      label: findOb('G-step-error').label,
      closed: findOb('G-step-error').closed,
      maturity: 'SCOPING ONLY -- enumerates ingredients I1..I5, discharges none (imp-35127)',
      deepDive: 'imp-35127',
      coupledTo: IMP35127_G_STEP_ERROR_CERTIFIED_BOUND_SCOPE.couplings,
    }),
    Object.freeze({
      key: 'G-gronwall',
      label: findOb('G-gronwall').label,
      closed: findOb('G-gronwall').closed,
      maturity:
        'HONEST PARTIAL CLOSURE -- Lemma B PROVED with an explicit constant, conditional on sub-gap ' +
        'SG1, separately flagged Gronwall-vacuous near the true collision front (imp-2520)',
      deepDive: 'imp-2520',
      sourceVerdict: BACKWARD_FLOW_STABILITY_GRONWALL.verdict,
    }),
    Object.freeze({
      key: 'G-interval-enclosure',
      label: findOb('G-interval-enclosure').label,
      closed: findOb('G-interval-enclosure').closed,
      maturity:
        'SCOPING ONLY -- characterizes the imp-362 single-scale witness (width equals dt exactly, one ' +
        'decade of coverage), discharges nothing (imp-35129)',
      deepDive: 'imp-35129',
    }),
  ]),

  whyNotIndependent:
    'The three obligations are COUPLED, not independent. imp-35127 (G-step-error) names its I3 ' +
    'ingredient (N-uniform Lipschitz/accumulation constant) as sharing the SAME open gap as G-gronwall ' +
    '(imp-2520 Gronwall-vacuity near the front), and its I5 ingredient (step-budget law + pole reduction) ' +
    'as sharing the SAME machinery as G-interval-enclosure (imp-362 pole reduction). So discharging ' +
    'G-step-error in isolation is impossible: two of its five ingredients inherit the openness of the ' +
    'other two obligations.',

  whyNotSameMaturity:
    'The three obligations are NOT at the same stage. G-step-error and G-interval-enclosure are pure ' +
    'SCOPING modules (imp-35127, imp-35129): each enumerates or characterizes what is needed and ' +
    'discharges nothing. G-gronwall (imp-2520) is materially further along -- an actual theorem module ' +
    'with Lemma B PROVED and an explicit Gronwall constant, delivered as an HONEST PARTIAL CLOSURE ' +
    'conditional on one named sub-gap (SG1). A reader who lands on G-gronwall alone could wrongly assume ' +
    'the sibling obligations are similarly advanced; they are not.',

  honestCaveat: Object.freeze({
    isProof: false,
    closesAnyObligation: false,
    dischargesAnyIngredient: false,
    derivesAnythingNew: false,
    isReductionBelowRH: false,
    carriesRHVerdict: false,
    scope:
      'Read-only cross-reference narrative assembling the imp-35058 rigorousUpgradeGap block ' +
      '(lambda-roadmap.js Step 2) with the three deep-dive modules imp-35127, imp-2520, imp-35129. ' +
      'Imports every field verbatim; derives nothing new; all three obligations stay OPEN.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP36205_STEP2_OBLIGATIONS_STORYLINE_CROSSREF_ASSERTIONS = [
  {
    id: 'imp36205-step2-is-step-two-numerical',
    why: 'The assembled step summary must reference the actual Step 2 entry, still graded numerical.',
    holds: () =>
      IMP36205_STEP2_OBLIGATIONS_STORYLINE_CROSSREF.step2Summary.step === 2 &&
      IMP36205_STEP2_OBLIGATIONS_STORYLINE_CROSSREF.step2Summary.verification === 'numerical',
  },
  {
    id: 'imp36205-three-obligations-all-open',
    why: 'Exactly the three named obligations must be present and every one must record closed: false.',
    holds: () => {
      const o = IMP36205_STEP2_OBLIGATIONS_STORYLINE_CROSSREF.obligations;
      return (
        o.length === 3 &&
        o.every((x) => x.closed === false) &&
        o.map((x) => x.key).join(',') === 'G-step-error,G-gronwall,G-interval-enclosure'
      );
    },
  },
  {
    id: 'imp36205-matches-roadmap-labels-verbatim',
    why: 'Every assembled label must reproduce the lambda-roadmap.js source label verbatim, not a paraphrase.',
    holds: () => {
      const o = IMP36205_STEP2_OBLIGATIONS_STORYLINE_CROSSREF.obligations;
      return o.every((x) => x.label === findOb(x.key).label);
    },
  },
  {
    id: 'imp36205-gronwall-maturity-differs-from-siblings',
    why: 'The G-gronwall sourceVerdict must record HONEST PARTIAL CLOSURE, distinct from the pure-scoping siblings.',
    holds: () =>
      /HONEST PARTIAL CLOSURE/.test(BACKWARD_FLOW_STABILITY_GRONWALL.verdict) &&
      IMP36205_STEP2_OBLIGATIONS_STORYLINE_CROSSREF.obligations.find((x) => x.key === 'G-gronwall')
        .sourceVerdict === BACKWARD_FLOW_STABILITY_GRONWALL.verdict,
  },
  {
    id: 'imp36205-couplings-imported-verbatim',
    why: 'The G-step-error coupledTo field must reproduce the imp-35127 couplings object verbatim, naming both siblings.',
    holds: () => {
      const c = IMP36205_STEP2_OBLIGATIONS_STORYLINE_CROSSREF.obligations.find(
        (x) => x.key === 'G-step-error',
      ).coupledTo;
      return (
        c === IMP35127_G_STEP_ERROR_CERTIFIED_BOUND_SCOPE.couplings &&
        /G-gronwall/.test(c.I3_to_G_gronwall) &&
        /G-interval-enclosure/.test(c.I5_to_G_interval_enclosure)
      );
    },
  },
  {
    id: 'imp36205-interval-enclosure-source-imported',
    why: 'The G-interval-enclosure deep dive must actually be imported and stay a scoping (non-rigorous) module.',
    holds: () => IMP35129_INTERVAL_ENCLOSURE_N_DEPENDENCE_SCOPING.isRigorous === false,
  },
  {
    id: 'imp36205-honesty-gate',
    why: 'Mandatory honesty: an ASSEMBLY note that closes NOTHING, discharges no obligation, carries NO RH verdict.',
    holds: () => {
      const h = IMP36205_STEP2_OBLIGATIONS_STORYLINE_CROSSREF.honestCaveat;
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

for (const assertion of IMP36205_STEP2_OBLIGATIONS_STORYLINE_CROSSREF_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36205-step2-obligations-storyline-crossref assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36205_STEP2_OBLIGATIONS_STORYLINE_CROSSREF;
