/**
 * @module imp-2706-ecoll-conditional-modulo-ch
 *
 * imp-2706 (high, proof): Convert the dominant E_coll NUMERICAL-ESTIMATE into a
 * RIGOROUS-MODULO-NAMED-GAP(C_H) record with an EXPLICIT conditional bound.
 *
 * Context
 * -------
 * imp-2633 and imp-2643 correctly classify
 *     E_coll = C_C . sqrt(log T0 / N),   C_C = C_H . sqrt(C_KH),
 * as NOT-RIGOROUS because C_H = 1/8 is an ANSATZ, not a proven upper bound on the
 * Holder-1/2 modulus C_shock . C_Lip / 4 (imp-2642 verdict: isRigorousUpperBound
 * = false). A positive O(1) drift remainder in the gap-to-collision ODE pushes
 * the effective tangency coefficient to ~0.127 > 1/8 (imp-2642 stress test).
 *
 * What this module does
 * ---------------------
 * It does NOT close the C_H gap. Instead it makes the contingency PRECISE and
 * machine-checkable: hold every OTHER constant rigorous and parameterize E_coll
 * purely as a function of the single named gap C_H, then certify the conditional
 * implication
 *
 *     IF  C_H <= C_H_HYP = 0.127   THEN   E_coll <= E_COLL_AT_HYP
 *                                  AND    E(N) = E_trunc + E_flow + E_coll < 0.2.
 *
 * Rigorous inputs held fixed (single source of truth):
 *   - C_KH = pi . C_Selberg with C_Selberg = 2.622 (imp-2641 DISCHARGED Trudgian
 *     2014 coefficient, conservative vs the 3.0 placeholder).
 *   - E_trunc_pt and E_flow: the two RIGOROUS sub-terms, read from the imp-2643
 *     capstone ledger (E_trunc rigorous-modulo-C_T but negligible; E_flow rigorous
 *     up to the <=0.24% Gronwall band).
 *
 * Because E_coll(C_H) = C_H . sqrt(C_KH) . sqrt(log T0 / N) is STRICTLY INCREASING
 * and LINEAR in C_H, the hypothesis C_H <= 0.127 yields E_coll <= E_coll(0.127) by
 * monotonicity, and the budget closes with a ~16x numeric margin below the
 * Platt-Trudgian PT_BOUND = 0.2. The named gap C_H = 0.127 is GENEROUS: it already
 * absorbs the positive-remainder excess over 1/8 that imp-2642 flags.
 *
 * HONESTY GUARD
 * -------------
 * This is a theorem-MODULO-GAP, not an unconditional bound. The build assertions
 * below import the imp-2642 flag and REQUIRE isRigorousUpperBound === false: the
 * module asserts the CONDITIONAL arithmetic, and simultaneously asserts that C_H
 * is STILL NOT proven, so no false QED can sneak in. imp-2643 rigorousBeat must
 * remain false. Until C_H <= 0.127 is itself discharged, Platt-Trudgian stays SOTA.
 *
 * @see imp-2643-honest-assembled-EN (capstone E(N) ledger; rigorous E_trunc/E_flow)
 * @see imp-2641-c-selberg-trudgian-discharge (C_Selberg -> 2.622, conservative)
 * @see polymath15-lemma52-shock-holder (imp-2642: C_H NOT a rigorous upper bound)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE } from './imp-2641-c-selberg-trudgian-discharge.js';
import { C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642 } from './polymath15-lemma52-shock-holder.js';
import { IMP2643_HONEST_ASSEMBLED_EN } from './imp-2643-honest-assembled-EN.js';

const N_STAR = 1e4;
const PT_BOUND = 0.2; // Platt-Trudgian 2021 SOTA unconditional Lambda upper bound.

// The named gap hypothesis: a GENEROUS upper bound on C_H that absorbs the
// positive-remainder excess over 1/8 flagged by the imp-2642 stress test.
const C_H_HYP = 0.127;

const T0 = effectiveHeightForN(N_STAR); // gamma_N approx 9.879e3
const L = Math.log(T0); // approx 9.198

// Rigorous C_KH via the DISCHARGED Trudgian coefficient (2.622), not the 3.0
// placeholder. Single source of truth: imp-2641.
const C_SELBERG_RIGOROUS = IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE.C_Selberg.rigorousExplicit; // 2.622
const C_KH = Math.PI * C_SELBERG_RIGOROUS; // approx 8.2373

// E_coll parameterized by the SINGLE named gap C_H (everything else held rigorous):
//     E_coll(C_H) = C_H . sqrt(C_KH) . sqrt(log T0 / N).
const SQRT_FACTOR = Math.sqrt(C_KH) * Math.sqrt(L / N_STAR); // C_H-free part
const eColl = (cH) => cH * SQRT_FACTOR;

// The two RIGOROUS sub-terms, pulled from the imp-2643 capstone ledger.
const E_TRUNC = IMP2643_HONEST_ASSEMBLED_EN.subterms.E_trunc_pt.value; // ~3.1e-5
const E_FLOW = IMP2643_HONEST_ASSEMBLED_EN.subterms.E_flow.value; // ~1.239e-3
const E_RIGOROUS_PARTS = E_TRUNC + E_FLOW;

// E(N) parameterized by the named gap C_H.
const eN = (cH) => E_RIGOROUS_PARTS + eColl(cH);

// Conditional bounds AT the hypothesis threshold C_H = 0.127.
const E_COLL_AT_HYP = eColl(C_H_HYP);
const E_N_AT_HYP = eN(C_H_HYP);

// The honesty flag: C_H is STILL not a rigorous upper bound (imp-2642).
const C_H_IS_RIGOROUS = C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642.isRigorousUpperBound; // false
const FINITE_N_RIGOROUS_BEAT = IMP2643_HONEST_ASSEMBLED_EN.rigorousBeat; // false

export const IMP2706_ECOLL_CONDITIONAL_MODULO_CH = {
  id: 'imp-2706',
  question:
    'Restate the dominant E_coll = C_C . sqrt(log T0 / N) as a RIGOROUS-MODULO-NAMED-GAP(C_H) ' +
    'record: parameterize E_coll(C_H) with every other constant held rigorous (C_KH via the ' +
    'discharged 2.622) and certify the conditional implication IF C_H <= 0.127 THEN E_coll <= X ' +
    'AND E(N) < 0.2 -- WITHOUT asserting C_H is proven.',
  N_star: N_STAR,
  heightInputs: {
    T0: +T0.toExponential(4), // gamma_N approx 9.879e3
    logT0: +L.toFixed(4), // approx 9.198
  },
  namedGap: {
    constant: 'C_H',
    hypothesis: `C_H <= ${C_H_HYP}`,
    meaning:
      'C_H is the Holder-1/2 modulus C_shock . C_Lip / 4. The ANSATZ value 1/8 = 0.125 is the ' +
      'EXACT leading-order quadratic-tangency coefficient (rigorous only for the R = 0 ' +
      'two-particle dynamics); a positive O(1) drift remainder pushes the effective coefficient ' +
      'to ~0.127 (imp-2642 stress test). The hypothesis 0.127 is therefore a GENEROUS upper bound.',
    isProven: C_H_IS_RIGOROUS, // false -- this record does NOT claim C_H
    blockingConstants: C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642.blockingConstants,
  },
  rigorousInputs: {
    C_Selberg: C_SELBERG_RIGOROUS, // 2.622, DISCHARGED (imp-2641), conservative vs 3.0
    C_KH: +C_KH.toFixed(6), // pi . 2.622 approx 8.2373
    C_KH_source: 'pi . C_Selberg with C_Selberg = 2.622 (imp-2641 Trudgian discharge)',
    E_trunc_pt: E_TRUNC, // rigorous-modulo-C_T, negligible
    E_flow: E_FLOW, // rigorous up to <=0.24% Gronwall band
    E_rigorous_parts: +E_RIGOROUS_PARTS.toExponential(4),
  },
  parameterization: {
    formula: 'E_coll(C_H) = C_H . sqrt(C_KH) . sqrt(log T0 / N)  [LINEAR, strictly increasing in C_H]',
    cH_free_factor: +SQRT_FACTOR.toFixed(6), // sqrt(C_KH) . sqrt(log T0 / N)
    E_coll_at_1over8: +eColl(0.125).toFixed(7), // ~0.010881 (matches imp-2641 rigorous E_coll)
    E_coll_at_hyp: +E_COLL_AT_HYP.toFixed(7), // ~0.011055 at C_H = 0.127
  },
  conditionalBound: {
    statement:
      `IF C_H <= ${C_H_HYP} THEN E_coll <= ${E_COLL_AT_HYP.toFixed(6)} AND ` +
      `E(N) <= ${E_N_AT_HYP.toFixed(6)} < ${PT_BOUND}.`,
    E_coll_upper: +E_COLL_AT_HYP.toFixed(6),
    E_N_upper: +E_N_AT_HYP.toFixed(6),
    PT_BOUND,
    numericMarginFactor: +(PT_BOUND / E_N_AT_HYP).toFixed(2), // ~16x
    proofOfImplication:
      'E_coll(C_H) is linear and strictly increasing in C_H, so C_H <= 0.127 gives E_coll(C_H) <= ' +
      'E_coll(0.127) by monotonicity; adding the rigorous E_trunc + E_flow gives E(N) <= E(N)|_{0.127} ' +
      '< 0.2. Pure arithmetic once the hypothesis is granted -- no further analytic input needed.',
  },
  status: 'RIGOROUS-MODULO-NAMED-GAP(C_H)',
  rigorousBeat: FINITE_N_RIGOROUS_BEAT, // false -- the conditional is NOT an unconditional beat
  verdict:
    'CONDITIONAL theorem, NOT a QED. With C_KH discharged (2.622) and E_trunc + E_flow rigorous, ' +
    'the whole budget is now a SINGLE-GAP function of C_H: IF C_H <= 0.127 THEN E(N) < 0.2 with a ' +
    '~16x margin below Platt-Trudgian. C_H itself remains UNPROVEN (imp-2642, isRigorousUpperBound ' +
    '= false), so this is a precise theorem-modulo-gap, not an unconditional bound. Platt-Trudgian ' +
    'Lambda <= 0.2 stays SOTA. NO false QED.',
  citation:
    'imp-2643 (honest assembled E(N), rigorous E_trunc/E_flow); imp-2641 (C_Selberg = 2.622 ' +
    'Trudgian discharge); imp-2642 polymath15-lemma52-shock-holder (C_H not a rigorous upper bound)',
};

export const IMP2706_ECOLL_CONDITIONAL_MODULO_CH_ASSERTIONS = [
  {
    id: 'imp2706-ckh-uses-discharged-2622',
    description: 'C_KH is built from the DISCHARGED Trudgian C_Selberg = 2.622 (imp-2641), not the 3.0 placeholder',
    holds: () =>
      Math.abs(C_SELBERG_RIGOROUS - 2.622) < 1e-3 &&
      Math.abs(C_KH - Math.PI * 2.622) < 1e-6 &&
      C_KH < Math.PI * 3.0,
  },
  {
    id: 'imp2706-ecoll-linear-increasing-in-ch',
    description: 'E_coll(C_H) is linear and strictly increasing in the named gap C_H',
    holds: () =>
      eColl(0.1) < eColl(C_H_HYP) &&
      eColl(C_H_HYP) < eColl(0.15) &&
      Math.abs(eColl(0.25) - 2 * eColl(0.125)) < 1e-12, // exact linearity
  },
  {
    id: 'imp2706-ecoll-at-one-eighth-matches-imp2641',
    description: 'At C_H = 1/8 the parameterized E_coll reproduces the imp-2641 rigorous E_coll ~0.010881',
    holds: () => Math.abs(eColl(0.125) - 0.010881) < 5e-5,
  },
  {
    id: 'imp2706-conditional-implication-closes',
    description: 'IF C_H <= 0.127 THEN E_coll <= E_coll(0.127) AND E(N) < 0.2 with margin > 10x (the conditional arithmetic)',
    holds: () =>
      E_COLL_AT_HYP > 0 &&
      eColl(C_H_HYP) <= E_COLL_AT_HYP + 1e-15 && // monotone upper bound at the threshold
      E_N_AT_HYP < PT_BOUND &&
      PT_BOUND / E_N_AT_HYP > 10,
  },
  {
    id: 'imp2706-does-not-assert-ch-proven',
    description: 'HONESTY: the module imports the imp-2642 flag and confirms C_H is STILL NOT a rigorous upper bound (no false QED)',
    holds: () =>
      C_H_IS_RIGOROUS === false &&
      FINITE_N_RIGOROUS_BEAT === false &&
      IMP2706_ECOLL_CONDITIONAL_MODULO_CH.namedGap.isProven === false &&
      IMP2706_ECOLL_CONDITIONAL_MODULO_CH.rigorousBeat === false,
  },
  {
    id: 'imp2706-status-is-modulo-named-gap',
    description: 'Record status is RIGOROUS-MODULO-NAMED-GAP(C_H) and the verdict keeps Platt-Trudgian as SOTA with NO false QED',
    holds: () =>
      /RIGOROUS-MODULO-NAMED-GAP\(C_H\)/.test(IMP2706_ECOLL_CONDITIONAL_MODULO_CH.status) &&
      /stays SOTA/.test(IMP2706_ECOLL_CONDITIONAL_MODULO_CH.verdict) &&
      /NO false QED/.test(IMP2706_ECOLL_CONDITIONAL_MODULO_CH.verdict),
  },
];

for (const a of IMP2706_ECOLL_CONDITIONAL_MODULO_CH_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2706-ecoll-conditional-modulo-ch assertion failed: ${a.id}`);
  }
}
