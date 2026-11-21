/**
 * @module imp-36241-layer-i-local-semicircle-input-scope
 * @fileoverview imp-36241 -- read-only SCOPING enumeration deep-diving LAYER I of
 *   the imp-36180 ESY-input taxonomy: the "spectral-measure statement" -- a local
 *   semicircle law for the Calogero-Moser (CM) empirical spectral measure, resolved
 *   down to the microscopic (mean-spacing) scale. imp-36180 named this layer OPEN
 *   for the DETERMINISTIC arithmetic seed {gamma_k} but recorded it as a single
 *   black box ("a local semicircle law"). Read alone, that phrase reads like one
 *   citable theorem. It is not: an ESY-style local law at the microscopic scale is
 *   itself assembled from several concrete analytic inputs. This module breaks
 *   layer I into FOUR concrete sub-inputs and, for each, distinguishes what the
 *   Dyson-Brownian-motion (DBM) / ESY literature supplies for random or regular
 *   initial data -- which does NOT transfer to the deterministic seed -- from the
 *   genuinely OPEN residue.
 *
 *   SCOPING / ASSESSMENT ONLY. Establishes no local law, discharges no conditional,
 *   claims NO sub-input is available, changes no bound, respects the imp-2519
 *   no-overclaim guard, NO QED. No refereed bound is changed; the
 *   assembled Route-A claim stays RH-modulo-GUE-universality (C_mb GUE-conditional,
 *   imp-486).
 *
 *   WHY DEEP-DIVE LAYER I (the thing imp-36180 leaves as one box)
 *   ------------------------------------------------------------
 *   imp-36180 layer I says a local semicircle law "concentrates the empirical
 *   spectral measure on the equilibrium (semicircle) density down to the
 *   microscopic mean-spacing scale, with high-probability control of the Stieltjes
 *   transform" -- and that this is proven for random/regular DBM initial data but
 *   OPEN for the arithmetic seed. That single sentence bundles four distinct
 *   obligations. Naming them separately shows WHERE the deterministic-seed
 *   obstruction actually bites: it is not one missing theorem but a chain in which
 *   every probabilistic ESY input (concentration, high-probability rigidity of the
 *   initial data, a mesoscopic a-priori law) must be replaced by an UNCONDITIONAL
 *   deterministic estimate for {gamma_k} -- and there is no probability space to
 *   supply "high probability" at all.
 *
 *   THE FOUR CONCRETE LAYER-I SUB-INPUTS (each: what DBM/ESY supplies vs open)
 *   -------------------------------------------------------------------------
 *   Ia equilibrium/reference density -- identify and certify the limiting
 *      (equilibrium) density the empirical measure must concentrate on. For the CM
 *      beta=2 flow this is set by the initial data plus the confining structure;
 *      for the arithmetic seed the target is the zero-counting (RvM) density, whose
 *      identification as the CM equilibrium is itself non-standard.
 *   Ib self-consistent Stieltjes-transform stability -- a self-consistent equation
 *      for the limiting Stieltjes transform m(z) plus a stability estimate letting
 *      one control m_N(z) - m(z) for Im z down to eta ~ N^{-1+eps}.
 *   Ic mesoscopic a-priori density input -- a weak (mesoscopic-scale) law on the
 *      INITIAL empirical measure that short-time DBM relaxation can then sharpen to
 *      the microscopic scale. For random/regular data this holds by construction;
 *      for {gamma_k} it is essentially an unconditional equidistribution input
 *      (the arithmetic-axis object imp-2497 audits).
 *   Id deterministic replacement of the probabilistic engine -- every ESY local-law
 *      statement is "with high probability"; a deterministic seed has NO probability
 *      space, so each concentration/high-probability step must be replaced by an
 *      unconditional deterministic bound. This is the structural obstruction, not a
 *      quantitative gap.
 *
 *   @see src/data/imp-36180-esy-cmb-local-law-input-scope.js (imp-36180: the THREE-layer parent taxonomy; layer I is the object this module deep-dives, imported verbatim below)
 *   @see src/data/lambda-roadmap.js (LAMBDA_CHAIN_STEPS step 5, obligation G5-cmb-gue -- the root C_mb conditional the parent taxonomy scopes)
 *   @see src/data/imp-2497-esy-highest-leverage-input-availability-audit.js (imp-2497: the ARITHMETIC-axis sibling -- equidistribution for the zeros {gamma_k}; sub-input Ic is the particle-side analog of that audit's mesoscopic input)
 *   @see src/data/imp-36229-esy-input-layers-glossary-companion.js (imp-36229: the glossary companion restating the imp-36180 three layers; this module refines layer I of that taxonomy)
 *   @see src/math/route-a-cm-extension.js (Route-A Calogero-Moser extension machinery the layer-I law would feed)
 *
 *   Ticket: imp-36241 (proof, medium). Scoping only; imports the parent layer-I
 *   entry verbatim; enumerates required sub-inputs WITHOUT claiming any is
 *   established; discharges no conditional; changes no bound; imp-2519 no-overclaim
 *   preserved; NO QED; no refereed bound is changed.
 */

import IMP36180_ESY_CMB_LOCAL_LAW_INPUT_SCOPE from './imp-36180-esy-cmb-local-law-input-scope.js';

// Pull the parent layer-I entry (the "spectral-measure statement") verbatim so
// this deep-dive stays pinned to the object imp-36180 named, not a paraphrase.
const LAYER_I = IMP36180_ESY_CMB_LOCAL_LAW_INPUT_SCOPE.esyInputLayers.find(
  (l) => l.key === 'esy-input-spectral-measure-statement',
);

// The four concrete sub-inputs a layer-I local semicircle law would demand. For
// each: established stays FALSE (nothing is claimed proven for the deterministic
// CM measure); dbmSupplies records what a DBM/ESY local law delivers in its PROVEN
// (random/regular initial-data) settings; and openRemains records the genuinely
// open residue for the arithmetic seed {gamma_k}.
const LAYER_I_SUBINPUTS = Object.freeze([
  Object.freeze({
    key: 'layer-i-equilibrium-reference-density',
    subInput: 'Ia -- equilibrium / reference density',
    label: 'Identify and certify the limiting density the empirical measure concentrates on',
    established: false,
    dbmSupplies:
      'For beta-ensembles / DBM with a random or regular initial condition, the ' +
      'equilibrium (limiting) density is fixed by the initial data together with ' +
      'the confining potential, and the local law is stated as concentration onto ' +
      'that explicit density (the semicircle in the canonical Wigner case).',
    openRemains:
      'For the arithmetic seed {gamma_k} the target reference density is the ' +
      'zero-counting (Riemann-von-Mangoldt) density, and identifying it as the CM ' +
      'equilibrium measure -- rather than assuming a random-matrix semicircle -- is ' +
      'itself non-standard and unestablished for this deterministic empirical measure.',
  }),
  Object.freeze({
    key: 'layer-i-self-consistent-stieltjes-stability',
    subInput: 'Ib -- self-consistent Stieltjes-transform stability',
    label: 'Self-consistent equation for m(z) plus stability down to eta ~ N^{-1+eps}',
    established: false,
    dbmSupplies:
      'The ESY method controls the empirical Stieltjes transform m_N(z) against the ' +
      'self-consistent m(z) by a stability analysis of the self-consistent equation, ' +
      'pushing control of m_N(z) - m(z) down to spectral windows of width ' +
      'eta ~ N^{-1+eps} (the microscopic / mean-spacing scale).',
    openRemains:
      'No self-consistent equation with a certified stability estimate is ' +
      'established for the deterministic CM empirical measure; the ESY stability ' +
      'argument leans on concentration of the resolvent, which the arithmetic seed ' +
      'supplies no mechanism for.',
  }),
  Object.freeze({
    key: 'layer-i-mesoscopic-apriori-density',
    subInput: 'Ic -- mesoscopic a-priori density input',
    label: 'Weak mesoscopic-scale law on the INITIAL measure that relaxation sharpens',
    established: false,
    dbmSupplies:
      'DBM local-relaxation results assume (or obtain by construction from ' +
      'randomness/regularity) a weak mesoscopic-scale law on the initial empirical ' +
      'measure, which short-time Dyson dynamics then sharpens to the microscopic ' +
      'scale.',
    openRemains:
      'For {gamma_k} the required mesoscopic input is essentially an UNCONDITIONAL ' +
      'equidistribution statement for the zeros -- the arithmetic-axis object the ' +
      'imp-2497 audit grades as available only conditionally (restricted / ' +
      'conditional Montgomery / Rudnick-Sarnak), so it does NOT transfer.',
  }),
  Object.freeze({
    key: 'layer-i-deterministic-replacement-of-probabilistic-engine',
    subInput: 'Id -- deterministic replacement of the probabilistic engine',
    label: 'Replace every high-probability ESY step by an unconditional deterministic bound',
    established: false,
    dbmSupplies:
      'Every ESY local-law statement is "with high probability": concentration of ' +
      'linear statistics, high-probability initial rigidity, and probabilistic a ' +
      'priori bounds are the engine that drives the whole argument.',
    openRemains:
      'The arithmetic seed is a single DETERMINISTIC configuration -- there is no ' +
      'probability space, so "high probability" is not even a statement one can make. ' +
      'Each probabilistic step must be replaced by an unconditional deterministic ' +
      'estimate for {gamma_k}; this is the STRUCTURAL obstruction to porting ESY, ' +
      'not a quantitative gap to be tightened.',
  }),
]);

const VERDICT = 'layer-i-local-semicircle-subinputs-enumerated-none-established-open-for-deterministic-seed';

export const IMP36241_LAYER_I_LOCAL_SEMICIRCLE_INPUT_SCOPE = Object.freeze({
  id: 'imp-36241',
  ticket: 'imp-36241',
  refines: 'imp-36180', // deep-dives layer I of the parent three-layer taxonomy.
  scopes: 'imp-486', // the exhaustive search that graded C_mb (and its ESY input) irreducible.
  axis:
    'particle-side layer-I local semicircle law for the Calogero-Moser empirical ' +
    'spectral measure, resolved to the microscopic (mean-spacing) scale, for the ' +
    'deterministic arithmetic seed {gamma_k}',
  question:
    'imp-36180 layer I names a local semicircle law for the CM empirical spectral ' +
    'measure down to the mean-spacing scale as OPEN for the deterministic seed but ' +
    'records it as one black box. What concrete analytic sub-inputs would such a ' +
    'law demand, and which does the DBM / ESY literature supply for random/regular ' +
    'initial data (not transferring) vs which stay genuinely open?',

  // Verbatim import of the parent layer-I entry this module deep-dives.
  parentLayer: Object.freeze({
    key: LAYER_I.key,
    layer: LAYER_I.layer,
    label: LAYER_I.label,
    established: LAYER_I.established,
    openRemains: LAYER_I.openRemains,
  }),

  layerISubInputs: LAYER_I_SUBINPUTS,

  verdict: VERDICT,
  anySubInputEstablished: false,

  honestCaveat: Object.freeze({
    isProof: false,
    closesAnyGap: false,
    establishesLocalSemicircleLaw: false,
    dischargesCmbConditional: false,
    claimsAnySubInputEstablished: false,
    establishesOperatorPositivity: false,
    derivesAnythingNew: false,
    isReductionBelowRH: false,
    carriesRHVerdict: false,
    scope:
      'Read-only SCOPING enumeration breaking the imp-36180 layer-I black box (a ' +
      'local semicircle law for the CM empirical spectral measure down to the ' +
      'mean-spacing scale) into four concrete sub-inputs and, per sub-input, ' +
      'distinguishing what the DBM / ESY literature supplies for random/regular ' +
      'initial data from what stays open for the deterministic arithmetic seed. ' +
      'Imports the parent layer verbatim; claims NO sub-input is established; ' +
      'discharges nothing; the C_mb conditional stays irreducible and ' +
      'GUE-conditional (imp-486); respects the imp-2519 no-overclaim guard.',
    sota: 'No refereed bound is changed; the assembled Route-A claim stays RH-modulo-GUE-universality',
  }),
});

export default IMP36241_LAYER_I_LOCAL_SEMICIRCLE_INPUT_SCOPE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP36241_LAYER_I_LOCAL_SEMICIRCLE_INPUT_SCOPE_ASSERTIONS = [
  {
    id: 'imp36241-four-layer-i-subinputs-enumerated',
    why: 'Exactly the four concrete layer-I sub-inputs (equilibrium density, self-consistent Stieltjes stability, mesoscopic a-priori density, deterministic replacement) must be present in order.',
    holds: () => {
      const S = IMP36241_LAYER_I_LOCAL_SEMICIRCLE_INPUT_SCOPE.layerISubInputs;
      return (
        S.length === 4 &&
        S.map((x) => x.key).join(',') ===
          'layer-i-equilibrium-reference-density,layer-i-self-consistent-stieltjes-stability,layer-i-mesoscopic-apriori-density,layer-i-deterministic-replacement-of-probabilistic-engine'
      );
    },
  },
  {
    id: 'imp36241-no-subinput-established',
    why: 'MANDATORY honesty: no enumerated layer-I sub-input may be marked established, and every one must record a non-empty open residue.',
    holds: () => {
      const S = IMP36241_LAYER_I_LOCAL_SEMICIRCLE_INPUT_SCOPE.layerISubInputs;
      return (
        IMP36241_LAYER_I_LOCAL_SEMICIRCLE_INPUT_SCOPE.anySubInputEstablished === false &&
        S.every((x) => x.established === false && typeof x.openRemains === 'string' && x.openRemains.length > 0)
      );
    },
  },
  {
    id: 'imp36241-parent-layer-verbatim',
    why: 'The deep-dived layer must reproduce the imp-36180 layer-I key/label/openRemains verbatim, not a paraphrase, so the refinement stays pinned to the parent taxonomy.',
    holds: () => {
      const p = IMP36241_LAYER_I_LOCAL_SEMICIRCLE_INPUT_SCOPE.parentLayer;
      return (
        p.key === 'esy-input-spectral-measure-statement' &&
        p.label === LAYER_I.label &&
        p.openRemains === LAYER_I.openRemains &&
        p.established === false
      );
    },
  },
  {
    id: 'imp36241-honesty-gate',
    why: 'A SCOPING enumeration that discharges NOTHING, establishes no local law, claims no sub-input established, establishes no positivity, carries NO RH verdict.',
    holds: () => {
      const h = IMP36241_LAYER_I_LOCAL_SEMICIRCLE_INPUT_SCOPE.honestCaveat;
      return (
        h.isProof === false &&
        h.closesAnyGap === false &&
        h.establishesLocalSemicircleLaw === false &&
        h.dischargesCmbConditional === false &&
        h.claimsAnySubInputEstablished === false &&
        h.establishesOperatorPositivity === false &&
        h.derivesAnythingNew === false &&
        h.isReductionBelowRH === false &&
        h.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
  {
    id: 'imp36241-verdict-none-established-open',
    why: 'The verdict must record that the sub-inputs are enumerated but none established and the layer stays open for the deterministic seed; flipping it would overclaim the local law is in hand.',
    holds: () =>
      IMP36241_LAYER_I_LOCAL_SEMICIRCLE_INPUT_SCOPE.verdict ===
        'layer-i-local-semicircle-subinputs-enumerated-none-established-open-for-deterministic-seed' &&
      IMP36241_LAYER_I_LOCAL_SEMICIRCLE_INPUT_SCOPE.refines === 'imp-36180' &&
      IMP36241_LAYER_I_LOCAL_SEMICIRCLE_INPUT_SCOPE.scopes === 'imp-486',
  },
];

for (const assertion of IMP36241_LAYER_I_LOCAL_SEMICIRCLE_INPUT_SCOPE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36241-layer-i-local-semicircle-input-scope assertion failed: ${assertion.id}`);
  }
}
