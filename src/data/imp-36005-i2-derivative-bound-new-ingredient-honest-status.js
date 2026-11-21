/**
 * @module imp-36005-i2-derivative-bound-new-ingredient-honest-status
 * @fileoverview imp-36005 -- standalone HONEST-STATUS note (imp-36003-style banner pattern)
 *   recording the imp-35832 finding that a certified sup|H_t prime| for the imp-35777 I2
 *   panel-count cap needs a GENUINELY NEW ingredient beyond the imp-35681 Part A / I1 1D
 *   value enclosure of H_t = A_t + B_t - C_t: the finite MAIN TERMS A_t + B_t differentiate
 *   termwise for FREE (each n^{-s} gains a bounded per-term log n <= log N_eff weight, the
 *   same interval-sum infrastructure I1 already bounds), but the SCALAR ERROR CAP C_t = E_A +
 *   E_B + E_{C_0} does NOT: an inequality |E| <= C_t on a modulus implies nothing about the
 *   derivative |E prime| (a uniformly tiny function can have an arbitrarily large derivative).
 *   Read-only note: imports the imp-35832 module verbatim (no re-derivation, no new numerics)
 *   and states the honesty boundary plainly for a reader who lands on this ticket without
 *   reading imp-35832 in full -- B = sup|H_t prime| is NOT a free byproduct of differentiating
 *   the 1D I1 enclosure; it requires EITHER a separate derivative-error cap C_t prime (route I)
 *   OR a Cauchy estimate on a 2D neighbourhood (route II), both mechanical but genuinely NEW.
 *
 *   Ticket: imp-36005 (content, low). Note only; re-reads nothing new; changes no bound;
 *   C_mb GUE-conditional (imp-486) untouched; no refereed bound is changed; NO QED.
 *
 *   @see imp-35832-i2-derivative-bound-from-i1-enclosure-scope.js (source module this note restates)
 *   @see imp-35777-i2-logderivative-panel-cap-scope (I2 cap sup|f prime/f| <= B/delta; B = sup|H_t prime|)
 *   @see imp-35681-w1-w2-w4-existing-infra-inventory (I1 A_t+B_t-C_t enclosure, greenfield, Part A)
 *   @see imp-35725-w1-effective-error-cap-budget (scalar error cap C_t = E_A + E_B + E_{C_0})
 *   @see imp-35988-i2-derivative-cap-route-comparison (downstream comparison of routes I and II)
 *   @see imp-36003-i2-i3-off-axis-proxy-honest-status.js (the banner pattern this note follows)
 */

import { IMP35832_I2_DERIVATIVE_BOUND_FROM_I1_ENCLOSURE_SCOPE } from './imp-35832-i2-derivative-bound-from-i1-enclosure-scope.js';

const SRC = IMP35832_I2_DERIVATIVE_BOUND_FROM_I1_ENCLOSURE_SCOPE;

export const IMP36005_I2_DERIVATIVE_BOUND_NEW_INGREDIENT_HONEST_STATUS = Object.freeze({
  id: 'imp-36005',
  proofSection: 'S-frontier',
  title:
    'Honest-status note: a certified sup|H_t prime| for the imp-35777 I2 panel cap is NOT a ' +
    'free byproduct of the imp-35681 Part A / I1 1D value enclosure -- the main terms ' +
    'differentiate termwise for free, but the scalar error cap C_t cannot be differentiated, ' +
    'so B needs a genuinely NEW ingredient',
  sourceModule: 'imp-35832-i2-derivative-bound-from-i1-enclosure-scope.js',

  splitByComponent: Object.freeze({
    mainTerms: Object.freeze({
      status: SRC.splitByComponent.mainTerms.status,
      amplification: SRC.splitByComponent.mainTerms.amplification,
    }),
    errorCap: Object.freeze({
      status: SRC.splitByComponent.errorCap.status,
    }),
  }),
  newIngredientRouteCount: SRC.newIngredientRoutes.length,
  windingRate: SRC.oomAgreement.windingRate,
  isRigorous: SRC.isRigorous,

  honestyBoundary:
    'The I1 enclosure has two halves: the finite main-term sum A_t + B_t, and the scalar error ' +
    'cap C_t = E_A + E_B + E_{C_0} bounding |H_t - (A_t+B_t)| <= C_t. The main-term half ' +
    'differentiates EXACTLY termwise (each n^{-s} maps to (-log n) n^{-s} times the elementary ' +
    'ds/dz factor), gaining only a bounded log n <= log N_eff = w(T_PT) ~ 13.446 amplification -- ' +
    'the SAME interval-sum infrastructure I1 already bounds, so this half is FREE. The error-cap ' +
    'half is NOT free: |E(z)| <= C_t is an inequality on a MODULUS and CANNOT be differentiated -- ' +
    'it carries no information about |E prime(z)| -- a uniformly tiny function can have an ' +
    'arbitrarily large derivative. So ' +
    'a certified sup|H_t prime| = B needs a genuinely NEW ingredient for the error half: EITHER a ' +
    'separate derivative-error cap C_t prime = E_A prime + E_B prime + E_{C_0} prime (route I), OR ' +
    'a Cauchy estimate sup|H_t|/r on a 2D complex neighbourhood disk of radius r (route II). Both ' +
    'are mechanical extensions of existing infra, not new mathematics, and both agree at B ~ ' +
    '|H_t| . w(T_PT), but NEITHER is already contained in the 1D I1 value enclosure.',

  conclusion:
    'imp-35832 shows the imp-35777 I2 derivative bound B = sup|H_t prime| is only PARTIALLY free ' +
    'from the I1 enclosure: the main-term half comes free by exact termwise differentiation, but ' +
    'the error-cap half does not, because a scalar modulus cap cannot be differentiated. B is a ' +
    'modest-but-genuinely-new certificate ingredient, not a free 1D-enclosure byproduct. It ' +
    'instantiates no interval enclosure, certifies no B, lower-bounds no delta, and changes no ' +
    'bound. I2 stays GREENFIELD, downstream of the imp-35681 Part A / imp-35725 interval evaluator.',

  honestCaveat: Object.freeze({
    isProof: false,
    isRigorous: false,
    isUnconditional: false,
    certifiesDerivativeBoundB: false,
    certifiesI2Cap: false,
    changesAnyBound: false,
    reDerivesAnything: false,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'MEASUREMENT-ONLY restatement of imp-35832: a certified sup|H_t prime| for the imp-35777 I2 ' +
    'panel cap is NOT a free byproduct of termwise-differentiating the imp-35681 Part A / I1 1D ' +
    'value enclosure of H_t = A_t + B_t - C_t. The main-term half A_t + B_t differentiates EXACTLY ' +
    'termwise for free (bounded log n <= log N_eff = w ~ 13.446 amplification, same interval-sum ' +
    'infra), but the scalar error cap C_t = E_A + E_B + E_{C_0} cannot be differentiated (|E| <= ' +
    'C_t implies nothing about |E prime|), so B needs a genuinely NEW ingredient: either a ' +
    'separate derivative-error cap C_t prime (route I) or a Cauchy estimate on a 2D neighbourhood ' +
    '(route II). Restatement only; changes no bound; C_mb GUE-conditional (imp-486) untouched; no ' +
    'RH verdict, NO QED. No refereed bound is changed.',
});

export const IMP36005_I2_DERIVATIVE_BOUND_NEW_INGREDIENT_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36005-source-is-not-rigorous',
    why: 'The core claim is that B is a new ingredient, not a certified free result -- the source module must itself be marked isRigorous:false.',
    holds: () =>
      IMP36005_I2_DERIVATIVE_BOUND_NEW_INGREDIENT_HONEST_STATUS.isRigorous === false &&
      SRC.isRigorous === false,
  },
  {
    id: 'imp36005-main-terms-free-error-cap-not-free',
    why: 'The recorded per-component status must match the imp-35832 source verdict exactly: main terms FREE, error cap NOT FREE.',
    holds: () => {
      const s = IMP36005_I2_DERIVATIVE_BOUND_NEW_INGREDIENT_HONEST_STATUS.splitByComponent;
      return s.mainTerms.status === 'FREE' && s.errorCap.status === 'NOT FREE';
    },
  },
  {
    id: 'imp36005-two-new-ingredient-routes',
    why: 'The note must record exactly the two admissible new-ingredient routes the source module identifies.',
    holds: () => IMP36005_I2_DERIVATIVE_BOUND_NEW_INGREDIENT_HONEST_STATUS.newIngredientRouteCount === 2,
  },
  {
    id: 'imp36005-winding-rate-matches-source',
    why: 'The recorded winding rate w(T_PT) must match the imp-35832 source literal ~13.446.',
    holds: () =>
      Math.abs(IMP36005_I2_DERIVATIVE_BOUND_NEW_INGREDIENT_HONEST_STATUS.windingRate - 13.4458782) < 1e-4,
  },
  {
    id: 'imp36005-honesty-boundary-mentions-cannot-be-differentiated',
    why: 'The honesty-boundary text must plainly name the scalar-modulus-cannot-be-differentiated obstruction.',
    holds: () =>
      /CANNOT be differentiated/.test(IMP36005_I2_DERIVATIVE_BOUND_NEW_INGREDIENT_HONEST_STATUS.honestyBoundary) &&
      /genuinely NEW ingredient/.test(IMP36005_I2_DERIVATIVE_BOUND_NEW_INGREDIENT_HONEST_STATUS.honestyBoundary),
  },
  {
    id: 'imp36005-honesty-gate',
    why: 'This is a read-only restatement note: it must not claim it certifies B or the I2 cap, nor claim a bound change.',
    holds: () =>
      IMP36005_I2_DERIVATIVE_BOUND_NEW_INGREDIENT_HONEST_STATUS.honestCaveat.certifiesDerivativeBoundB === false &&
      IMP36005_I2_DERIVATIVE_BOUND_NEW_INGREDIENT_HONEST_STATUS.honestCaveat.certifiesI2Cap === false &&
      IMP36005_I2_DERIVATIVE_BOUND_NEW_INGREDIENT_HONEST_STATUS.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36005_I2_DERIVATIVE_BOUND_NEW_INGREDIENT_HONEST_STATUS.honestCaveat.sota),
  },
  {
    id: 'imp36005-verdict-no-qed',
    why: 'The verdict must record NO QED, matching the standing no-refereed-bound-change caveat.',
    holds: () => /NO QED/.test(IMP36005_I2_DERIVATIVE_BOUND_NEW_INGREDIENT_HONEST_STATUS.verdict),
  },
];

for (const assertion of IMP36005_I2_DERIVATIVE_BOUND_NEW_INGREDIENT_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36005-i2-derivative-bound-new-ingredient-honest-status assertion failed: ${assertion.id}`);
  }
}

export default IMP36005_I2_DERIVATIVE_BOUND_NEW_INGREDIENT_HONEST_STATUS;
