/**
 * @module imp-36180-esy-cmb-local-law-input-scope
 * @fileoverview imp-36180 -- read-only SCOPING enumeration of the concrete
 *   Erdos-Schlein-Yau (ESY) local-law inputs the G5-cmb-gue conditional (the
 *   irreducible C_mb many-body Calogero-Moser correction, imp-486) would have to
 *   receive in order to be discharged. The Route-A closesIfResolution (imp-2614)
 *   and the Step-5 obligation G5-cmb-gue both name "GUE universality (ESY local
 *   law) for the Calogero-Moser empirical spectral measure" as the SOLE
 *   irreducible conditional, but they never enumerate the concrete inputs such a
 *   local law would have to supply. This module fills that gap by breaking the
 *   idealized "ESY local law" black box into THREE concrete input categories and,
 *   for each, distinguishing what the existing Calogero-Moser / Dyson-Brownian-
 *   motion (DBM) literature partially provides from what remains genuinely open.
 *
 *   SCOPING / ASSESSMENT ONLY. Establishes nothing, discharges no conditional,
 *   claims NO input is available, changes no bound, respects the imp-2519
 *   no-overclaim guard, NO QED. No refereed bound is changed.
 *
 *   WHY THIS ENUMERATION (the thing the roadmap leaves implicit)
 *   ------------------------------------------------------------
 *   G5-cmb-gue.need says the C_mb correction "requires GUE universality
 *   (Erdos-Schlein-Yau local law) for the Calogero-Moser empirical spectral
 *   measure" and that imp-486 found no unconditional bound. Read alone, "ESY
 *   local law" reads like a single citable theorem one could look up. It is not:
 *   for the CM / DBM setting an ESY-style local law is a TOWER of statements
 *   (a local semicircle / spectral-measure statement, a microscopic rigidity
 *   scale, and a coupling of the resulting local statistics to the C_mb drift
 *   average). Naming the three layers separately shows WHERE the irreducibility
 *   sits: the CM particle system here is seeded by the DETERMINISTIC arithmetic
 *   zeros, not a random matrix ensemble, so the standard ESY inputs (proven for
 *   Wigner matrices and for DBM with random/regular initial data) do NOT transfer
 *   -- the local law for THIS deterministic empirical measure is the open object.
 *
 *   THE THREE ESY-INPUT LAYERS (each: what ESY supplies vs what stays open)
 *   ----------------------------------------------------------------------
 *   I  spectral-measure statement -- a local semicircle law for the CM empirical
 *      spectral measure down to the microscopic (mean-spacing) scale. ESY / DBM
 *      supplies this for random/regular initial data; OPEN for the deterministic
 *      arithmetic seed {gamma_k} (the imp-486 object).
 *   II rigidity scale -- microscopic-scale rigidity of particle locations
 *      (|gamma_k - classical| controlled at the optimal fluctuation scale). ESY
 *      supplies this for Wigner / post-relaxation DBM; the imp-3725 true-flow
 *      enclosure gives WINDOW-LOCAL control on [1e4, 1e6] only; N-uniform
 *      unconditional rigidity as N -> infinity stays OPEN.
 *   III C_mb coupling -- the map from local spacing statistics to the collision-
 *      drift average that IS C_mb. The functional is computable (imp-462, imp-486
 *      machinery); its GUE value is only as good as the (open) universality
 *      input above, so the coupling leaves C_mb GUE-conditional.
 *
 *   @see src/data/lambda-roadmap.js (LAMBDA_CHAIN_STEPS step 5, rigorousUpgradeGap obligation G5-cmb-gue -- the source conditional this module scopes; its surrogateAssessment by imp-36079 is imported verbatim below)
 *   @see src/data/imp-2497-esy-highest-leverage-input-availability-audit.js (imp-2497: the ARITHMETIC-axis sibling -- restricted/conditional Montgomery / Rudnick-Sarnak equidistribution for the ZEROS {gamma_k}; this module is the PARTICLE-side CM-spectral-measure analog)
 *   @see src/data/imp-36181-step5-obligation-chain-cross-reference.js (imp-36181: the Step-5 six-item overview that names G5-cmb-gue as the one irreducible research link; this module deep-dives that single link)
 *   @see src/math/route-a-cm-extension.js (Route-A Calogero-Moser extension machinery)
 *   @see src/math/many-body-correction-closure.js (the C_mb correction the coupling layer targets)
 *
 *   Ticket: imp-36180 (proof, medium). Scoping only; imports the source verdict
 *   verbatim; enumerates required inputs WITHOUT claiming any is established;
 *   discharges no conditional; changes no bound; imp-2519 no-overclaim preserved;
 *   NO QED; no refereed bound is changed.
 */

import { LAMBDA_CHAIN_STEPS } from './lambda-roadmap.js';

const STEP5 = LAMBDA_CHAIN_STEPS.find((s) => s.step === 5);
const G5_CMB_GUE = STEP5.rigorousUpgradeGap.obligations.find((o) => o.key === 'G5-cmb-gue');

// The three concrete ESY-local-law input layers. For each: established stays
// FALSE (nothing is claimed proven for the deterministic CM measure); esySupplies
// records what an ESY / DBM local law delivers in its PROVEN settings; and
// openRemains records the genuinely-open residue for the arithmetic CM seed.
const ESY_INPUT_LAYERS = Object.freeze([
  Object.freeze({
    key: 'esy-input-spectral-measure-statement',
    layer: 'I -- spectral-measure statement',
    label: 'Local semicircle law for the Calogero-Moser empirical spectral measure',
    established: false,
    esySupplies:
      'For Dyson-Brownian-motion / beta-ensemble models with a random or ' +
      'sufficiently regular initial condition, an ESY-style local law delivers a ' +
      'local semicircle law: the empirical spectral measure of the flowing ' +
      'particles concentrates on the equilibrium (semicircle) density down to the ' +
      'microscopic mean-spacing scale, with high-probability control of the ' +
      'Stieltjes transform.',
    cmLiteraturePartiallyProvides:
      'The local semicircle law and DBM local relaxation are proven for ' +
      'Wigner-type ensembles and for beta-ensembles with an analytic external ' +
      'potential; the CM flow d gamma_k/dt = -2 sum_{j != k} 1/(gamma_k - gamma_j) ' +
      'is the beta = 2 Dyson dynamics those results are built on.',
    openRemains:
      'The CM particle system in Route-A is seeded by the DETERMINISTIC arithmetic ' +
      'zeros {gamma_k}, not a random matrix ensemble, so the standard ESY / DBM ' +
      'local-law inputs (which need randomness or regularity in the initial data) ' +
      'do NOT transfer. No local law is established for this specific deterministic ' +
      'empirical measure -- it is exactly the object imp-486 confirmed admits no ' +
      'unconditional bound.',
  }),
  Object.freeze({
    key: 'esy-input-rigidity-scale',
    layer: 'II -- rigidity scale',
    label: 'Microscopic-scale rigidity the local law must reach, N-uniformly',
    established: false,
    esySupplies:
      'ESY rigidity controls particle locations down to essentially the mean ' +
      'spacing (scale N^{-1+epsilon}), bounding |gamma_k - classical location| at ' +
      'the optimal fluctuation scale with high probability -- the resolution ' +
      'needed to resolve local spacing statistics.',
    cmLiteraturePartiallyProvides:
      'Rigidity at this scale is a theorem for Wigner matrices and for DBM after ' +
      'the local relaxation time; on the FINITE window [1e4, 1e6] the imp-3725 ' +
      'true-flow two-sided enclosure certifies K_paper <= 2.4238e-6 with zero GUE ' +
      'input (a window-local real-analysis surrogate, imp-36079).',
    openRemains:
      'N-uniform microscopic rigidity for the CM measure as N -> infinity, ' +
      'unconditionally, is OPEN. The surrogate is window-LOCAL: its ceiling N_hi ' +
      'is bounded compute (O(N^2) per rung, heavy-offline-compute-pool-starvation), ' +
      'never a limit, so it supplies no N-uniform scale past N_hi.',
  }),
  Object.freeze({
    key: 'esy-input-cmb-coupling',
    layer: 'III -- coupling to C_mb',
    label: 'Coupling of the local law to the many-body correction constant C_mb',
    established: false,
    esySupplies:
      'Granted the local law and rigidity, the many-body correction C_mb -- the ' +
      'average over collisions of the 1/(gamma_k - gamma_j) drift -- would be ' +
      'controlled by the local spacing statistics universality supplies, yielding ' +
      'the GUE value of C_mb.',
    cmLiteraturePartiallyProvides:
      'The map from local spacing statistics to the collision-drift average is a ' +
      'computable functional (imp-462 / imp-486 machinery); given a GUE value for ' +
      'the local statistics, the C_mb value follows by that functional.',
    openRemains:
      'The coupling is only as strong as its (open) universality input: imp-486 ' +
      'exhaustive search found NO unconditional C_mb bound and confirmed GGM + ' +
      'Huxley fail identically. So even a granted local law leaves C_mb ' +
      'GUE-conditional unless the universality feeding it is itself unconditional.',
  }),
]);

const VERDICT = 'esy-cmb-local-law-inputs-enumerated-none-established-conditional-irreducible';

export const IMP36180_ESY_CMB_LOCAL_LAW_INPUT_SCOPE = Object.freeze({
  id: 'imp-36180',
  ticket: 'imp-36180',
  scopes: 'imp-486', // the exhaustive search that graded C_mb irreducible.
  refines: 'imp-2614', // Route-A closesIfResolution naming C_mb the sole conditional.
  axis:
    'particle-side ESY local law for the Calogero-Moser empirical spectral ' +
    'measure (distinct from the imp-2497 arithmetic-axis equidistribution for the zeros)',
  question:
    'G5-cmb-gue names "GUE universality (ESY local law) for the Calogero-Moser ' +
    'empirical spectral measure" as the sole irreducible C_mb conditional but ' +
    'never enumerates the concrete inputs such a local law must supply. What are ' +
    'they, and which does the existing CM / DBM literature partially provide vs ' +
    'which stay genuinely open?',

  // Verbatim import of the source conditional this module scopes.
  sourceConditional: Object.freeze({
    key: G5_CMB_GUE.key,
    label: G5_CMB_GUE.label,
    need: G5_CMB_GUE.need,
    machinery: G5_CMB_GUE.machinery,
    feedsInto: G5_CMB_GUE.feedsInto,
    surrogateVerdict: G5_CMB_GUE.surrogateAssessment.verdict,
  }),

  esyInputLayers: ESY_INPUT_LAYERS,

  verdict: VERDICT,
  anyInputEstablished: false,

  honestCaveat: Object.freeze({
    isProof: false,
    closesAnyGap: false,
    dischargesCmbConditional: false,
    claimsAnyInputEstablished: false,
    establishesOperatorPositivity: false,
    derivesAnythingNew: false,
    isReductionBelowRH: false,
    carriesRHVerdict: false,
    scope:
      'Read-only SCOPING enumeration breaking the idealized "ESY local law for ' +
      'the CM empirical spectral measure" (G5-cmb-gue) into three concrete input ' +
      'layers and, per layer, distinguishing what the CM / DBM literature ' +
      'partially provides from what stays genuinely open for the deterministic ' +
      'arithmetic seed. Imports the source conditional verbatim; claims NO input ' +
      'is established; discharges nothing; the C_mb conditional stays irreducible ' +
      'and GUE-conditional (imp-486); respects the imp-2519 no-overclaim guard.',
    sota: 'No refereed bound is changed; the assembled Route-A claim stays RH-modulo-GUE-universality',
  }),
});

export default IMP36180_ESY_CMB_LOCAL_LAW_INPUT_SCOPE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP36180_ESY_CMB_LOCAL_LAW_INPUT_SCOPE_ASSERTIONS = [
  {
    id: 'imp36180-three-esy-input-layers-enumerated',
    why: 'Exactly the three concrete ESY-input layers (spectral-measure statement, rigidity scale, C_mb coupling) must be present in order.',
    holds: () => {
      const L = IMP36180_ESY_CMB_LOCAL_LAW_INPUT_SCOPE.esyInputLayers;
      return (
        L.length === 3 &&
        L.map((x) => x.key).join(',') ===
          'esy-input-spectral-measure-statement,esy-input-rigidity-scale,esy-input-cmb-coupling'
      );
    },
  },
  {
    id: 'imp36180-no-input-established',
    why: 'MANDATORY honesty: no enumerated ESY input may be marked established, and every layer must record a non-empty open residue.',
    holds: () => {
      const L = IMP36180_ESY_CMB_LOCAL_LAW_INPUT_SCOPE.esyInputLayers;
      return (
        IMP36180_ESY_CMB_LOCAL_LAW_INPUT_SCOPE.anyInputEstablished === false &&
        L.every((x) => x.established === false && typeof x.openRemains === 'string' && x.openRemains.length > 0)
      );
    },
  },
  {
    id: 'imp36180-source-conditional-verbatim',
    why: 'The scoped conditional must reproduce the lambda-roadmap.js G5-cmb-gue label and need verbatim, not a paraphrase.',
    holds: () =>
      IMP36180_ESY_CMB_LOCAL_LAW_INPUT_SCOPE.sourceConditional.key === 'G5-cmb-gue' &&
      IMP36180_ESY_CMB_LOCAL_LAW_INPUT_SCOPE.sourceConditional.label === G5_CMB_GUE.label &&
      IMP36180_ESY_CMB_LOCAL_LAW_INPUT_SCOPE.sourceConditional.need === G5_CMB_GUE.need,
  },
  {
    id: 'imp36180-honesty-gate',
    why: 'A SCOPING enumeration that discharges NOTHING, claims no input established, establishes no positivity, carries NO RH verdict.',
    holds: () => {
      const h = IMP36180_ESY_CMB_LOCAL_LAW_INPUT_SCOPE.honestCaveat;
      return (
        h.isProof === false &&
        h.closesAnyGap === false &&
        h.dischargesCmbConditional === false &&
        h.claimsAnyInputEstablished === false &&
        h.establishesOperatorPositivity === false &&
        h.derivesAnythingNew === false &&
        h.isReductionBelowRH === false &&
        h.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
  {
    id: 'imp36180-verdict-none-established-irreducible',
    why: 'The verdict must record that the inputs are enumerated but none established and the conditional stays irreducible; flipping it would overclaim C_mb is in hand.',
    holds: () =>
      IMP36180_ESY_CMB_LOCAL_LAW_INPUT_SCOPE.verdict ===
        'esy-cmb-local-law-inputs-enumerated-none-established-conditional-irreducible' &&
      IMP36180_ESY_CMB_LOCAL_LAW_INPUT_SCOPE.scopes === 'imp-486',
  },
];

for (const assertion of IMP36180_ESY_CMB_LOCAL_LAW_INPUT_SCOPE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36180-esy-cmb-local-law-input-scope assertion failed: ${assertion.id}`);
  }
}
