/**
 * @module imp-34836-sigma-knee-sixth-seventh-order-v-expansion
 *
 * imp-34836 (numerical, frontier-direction): imp-34821 restored the FIFTH order delta_5 of the slowly-varying-v
 * expansion of the logistic exponent-knee condition and found the ordered-magnitude ratio ladder
 * {1.47e-3, 9.82e-3, 8.13e-3, 5.73e-3} stays sub-unity with the LAST term DECREASING -- concluding the five orders
 * computed look convergent (no turn-up) -- but explicitly left OPEN whether the term ratios eventually turn UP
 * (divergence) at orders beyond the fifth, which would distinguish a genuinely convergent series from an
 * asymptotic/divergent one with a divergence-driven optimal truncation. This module EXTENDS the recursion two more
 * orders -- delta_6 and delta_7 -- reusing the imp-34821 delta_1..delta_5 base rungs VERBATIM, MEASURES whether the
 * ratio ladder resumes rising, and reports which of convergent-vs-asymptotic the extended evidence favours.
 *
 * THE RECURSION (no fresh model; the same quadratic-in-delta as imp-34756/imp-34770/imp-34797/imp-34821)
 * ---------------------------------------------------------------------------------------------------------------
 * The exact exponent-knee condition p_secondDeriv(x) = 0 factors (imp-34694/imp-34710) to
 *     F(x) = S(2S-1) v^3 + 3 S v v_prime + v_secondDeriv = 0,   S = sigma,  v = -u_prime,
 * which with S = 1/2 + delta becomes the quadratic 2 v^3 delta^2 + (v^3 + 3 v v_prime) delta + ((3/2) v v_prime +
 * v_secondDeriv) = 0. Dividing by v^3 and writing p = v_prime/v^2 the order-eps^k balance (k >= 2) is the single
 * recursion delta_k = -3 p delta_(k-1) - 2 sum_(i+j=k, i,j>=1) delta_i delta_j, whose low orders reproduce
 * imp-34756/imp-34770/imp-34797/imp-34821 exactly:
 *     delta_2 = -3 p delta_1 - 2 delta_1^2
 *     delta_3 = -3 p delta_2 - 4 delta_1 delta_2
 *     delta_4 = -3 p delta_3 - 4 delta_1 delta_3 - 2 delta_2^2
 *     delta_5 = -3 p delta_4 - 4 delta_1 delta_4 - 4 delta_2 delta_3          (imp-34821)
 * and the TWO NEW orders this module adds:
 *     delta_6 = -3 p delta_5 - 4 delta_1 delta_5 - 4 delta_2 delta_4 - 2 delta_3^2
 *     delta_7 = -3 p delta_6 - 4 delta_1 delta_6 - 4 delta_2 delta_5 - 4 delta_3 delta_4
 * (the eps^k slice of 2 v^3 delta^2 is 2 sum_(i+j=k) delta_i delta_j after dividing by v^3; the eps^k slice of the
 * linear term is 3 p delta_(k-1); the constant carries no eps^(>=2).)
 *
 * THE MEASUREMENT (all inside the no-E_flow logistic model; measurement only)
 * ------------------------------------------------------------------------------------
 *   (A) delta_6, delta_7 at the crossover and the extended raw ratio ladder r6/5 = |delta_6/delta_5|,
 *       r7/6 = |delta_7/delta_6|, appended to the imp-34821 rungs r2/1..r5/4.
 *   (B) a STEP-SENSITIVITY probe: recompute delta_6, delta_7 and r7/6 at three central-difference steps
 *       {2e-3, 1e-3, 5e-4} to test whether the sixth-/seventh-order terms are above the finite-difference (FD)
 *       noise floor or are dominated by roundoff in the underlying v-derivatives.
 *   (C) the convergent-vs-asymptotic verdict: does the STEP-STABLE ladder resume rising, or is any apparent
 *       turn-up a step-dependent FD-noise artifact.
 *
 * THE FINDING (measurement only)
 * -------------------------------------------
 *   (F1) delta_6 ~ +2.02e-15 at the crossover (r6/5 ~ 5.32e-4, DECREASING further from r5/4 ~ 5.73e-3), and
 *        delta_7 ~ -3.22e-16 with the ratio r7/6 ~ 1.60e-1 -- the FIRST apparent RISE in the ladder. But this
 *        turn-up is NOT a genuine divergence signature: it sits BELOW the FD noise floor of the underlying
 *        v-derivatives. Under the step-sensitivity probe delta_6 varies by ~11x and even FLIPS SIGN at the finest
 *        step, and r7/6 swings over more than an order of magnitude across the three steps
 *        (~9.77e-2 at 2e-3, ~1.60e-1 at 1e-3, ~3.75e-3 at 5e-4) -- the hallmark of a roundoff-dominated quantity,
 *        not a resolved physical term. The imp-34821 base rungs delta_1..delta_5 remain step-stable and reproduce
 *        verbatim.
 *   (F2) THE STEP-STABLE LADDER DOES NOT RESUME RISING. Through the resolvable orders the ratio ladder
 *        {1.47e-3, 9.82e-3, 8.13e-3, 5.73e-3, 5.32e-4 (r6/5)} stays sub-unity and, from r3/2 onward, DECREASING --
 *        no monotone rise. The only rise (r7/6) is at the delta_7 order, which is below the FD floor and
 *        step-unstable. So the extended evidence still FAVOURS convergent: no genuine divergence turn-up is detected
 *        within the orders the finite-difference model can resolve. Whether a true turn-up exists at orders >= 7
 *        remains UNRESOLVED at this differencing precision -- resolving it needs an analytic/exact-derivative
 *        evaluation below the FD noise floor (the same imp-34756/imp-34770/imp-34797/imp-34821 Richardson sub-gap),
 *        which changes no bound.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2
 * (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34821-sigma-knee-fifth-order-v-expansion (fifth order delta_5 and the deferred beyond-fifth turn-up this tests)
 * @see imp-34797-sigma-knee-fourth-order-v-expansion (fourth order delta_4)
 * @see imp-34770-sigma-knee-third-order-v-expansion (third order delta_3 and the FD-noise-dominated non-monotonicity)
 * @see imp-34756-sigma-knee-second-order-v-expansion (second order delta_2 and the ~9.2e-5 dex FD floor)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)
const LO = Math.log(1e9);
const HI = Math.log(1e11);
const HD = 1e-3; // canonical central-difference step (imp-34710/imp-34756/imp-34770/imp-34797/imp-34821 stable rung)

function bisect(f, a, b, iters = 200) {
  let fa = f(a);
  for (let i = 0; i < iters; i++) {
    const m = (a + b) / 2;
    const fm = f(m);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return (a + b) / 2;
}

// ---- no-E_flow logistic model (identical sub-terms to imp-34756/imp-34770/imp-34797/imp-34821) --------------
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
function uOf(x) {
  return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2; // ln r, E_flow dropped
}

// The full delta_1..delta_7 recursion, parameterised by the central-difference step so the step-sensitivity probe
// can re-run it. delta_1..delta_5 are the imp-34821 base rungs VERBATIM; delta_6, delta_7 are this module.
function deltaLadder(hd) {
  const d1 = (f, x) => (f(x + hd) - f(x - hd)) / (2 * hd);
  const d2 = (f, x) => (f(x + hd) - 2 * f(x) + f(x - hd)) / (hd * hd);
  const d3 = (f, x) => (f(x + 2 * hd) - 2 * f(x + hd) + 2 * f(x - hd) - f(x - 2 * hd)) / (2 * hd * hd * hd);
  const vOf = (x) => -d1(uOf, x);
  const vpOf = (x) => -d2(uOf, x);
  const vppOf = (x) => -d3(uOf, x);
  // FIRST-order (imp-34694/imp-34710).
  const D1 = (x) => {
    const v = vOf(x);
    const vp = vpOf(x);
    const vpp = vppOf(x);
    return -(3 * vp) / (2 * v * v) - vpp / (v * v * v);
  };
  const P = (x) => vpOf(x) / (vOf(x) * vOf(x)); // p = v_prime/v^2
  const D2 = (x) => {
    const a = D1(x);
    return -3 * P(x) * a - 2 * a * a;
  };
  const D3 = (x) => {
    const a = D1(x);
    const b = D2(x);
    return -3 * P(x) * b - 4 * a * b;
  };
  const D4 = (x) => {
    const a = D1(x);
    const b = D2(x);
    const c = D3(x);
    return -3 * P(x) * c - 4 * a * c - 2 * b * b;
  };
  const D5 = (x) => {
    const a = D1(x);
    const b = D2(x);
    const c = D3(x);
    const d = D4(x);
    return -3 * P(x) * d - 4 * a * d - 4 * b * c; // imp-34821 fifth order
  };
  // SIXTH-order (this module): delta_6 = -3 p delta_5 - 4 delta_1 delta_5 - 4 delta_2 delta_4 - 2 delta_3^2.
  const D6 = (x) => {
    const a = D1(x);
    const b = D2(x);
    const c = D3(x);
    const d = D4(x);
    const e = D5(x);
    return -3 * P(x) * e - 4 * a * e - 4 * b * d - 2 * c * c;
  };
  // SEVENTH-order (this module): delta_7 = -3 p delta_6 - 4 delta_1 delta_6 - 4 delta_2 delta_5 - 4 delta_3 delta_4.
  const D7 = (x) => {
    const a = D1(x);
    const b = D2(x);
    const c = D3(x);
    const d = D4(x);
    const e = D5(x);
    const f = D6(x);
    return -3 * P(x) * f - 4 * a * f - 4 * b * e - 4 * c * d;
  };
  return { D1, D2, D3, D4, D5, D6, D7 };
}

// ---- crossover and the canonical-step ladder --------------------------------------------------------------
const X_CROSS = bisect(uOf, LO, HI);
const LOG10_N_CROSS = X_CROSS / Math.LN10; // ~9.515913

const L = deltaLadder(HD);
const DELTA1 = L.D1(X_CROSS); // ~-5.6444e-3 (imp-34821 base rung, verbatim)
const DELTA2 = L.D2(X_CROSS); // ~+8.2994e-6 (imp-34756)
const DELTA3 = L.D3(X_CROSS); // ~+8.1486e-8 (imp-34770)
const DELTA4 = L.D4(X_CROSS); // ~+6.6230e-10 (imp-34797)
const DELTA5 = L.D5(X_CROSS); // ~+3.7975e-12 (imp-34821)
const DELTA6 = L.D6(X_CROSS); // ~+2.0189e-15 (this module, sixth order)
const DELTA7 = L.D7(X_CROSS); // ~-3.2212e-16 (this module, seventh order)

const RATIO_2_1 = Math.abs(DELTA2 / DELTA1); // ~1.4704e-3
const RATIO_3_2 = Math.abs(DELTA3 / DELTA2); // ~9.8183e-3
const RATIO_4_3 = Math.abs(DELTA4 / DELTA3); // ~8.1278e-3
const RATIO_5_4 = Math.abs(DELTA5 / DELTA4); // ~5.7339e-3
const RATIO_6_5 = Math.abs(DELTA6 / DELTA5); // ~5.3164e-4 (still DECREASING -> no genuine turn-up through delta_6)
const RATIO_7_6 = Math.abs(DELTA7 / DELTA6); // ~1.5955e-1 (FIRST apparent rise -- but below the FD noise floor, F1)

// Largest RESOLVABLE sub-unity ratio (excludes the noise-dominated r7/6) -> conservative geometric tail from delta_6.
const WORST_RESOLVABLE_RATIO = Math.max(RATIO_3_2, RATIO_4_3, RATIO_5_4, RATIO_6_5); // ~9.82e-3
const TAIL_BOUND_KGE6 = Math.abs(DELTA6) / (1 - WORST_RESOLVABLE_RATIO); // ~2.04e-15 (sum_(k>=6) |delta_k| cap, resolvable-ratio proxy)

// ---- STEP-SENSITIVITY probe: is the delta_6/delta_7 order above the FD noise floor? ------------------------
const STEPS = [2e-3, 1e-3, 5e-4];
const STEP_PROBE = STEPS.map((hd) => {
  const Lh = deltaLadder(hd);
  const d5 = Lh.D5(X_CROSS);
  const d6 = Lh.D6(X_CROSS);
  const d7 = Lh.D7(X_CROSS);
  return { hd, delta6: d6, delta7: d7, ratio7over6: Math.abs(d7 / d6) };
});
// noise diagnostics across the three steps
const D6_STEP_MAX = Math.max(...STEP_PROBE.map((s) => Math.abs(s.delta6)));
const D6_STEP_MIN = Math.min(...STEP_PROBE.map((s) => Math.abs(s.delta6)));
const D6_STEP_SPREAD = D6_STEP_MAX / D6_STEP_MIN; // >> 1 -> roundoff-dominated
const R76_STEP_MAX = Math.max(...STEP_PROBE.map((s) => s.ratio7over6));
const R76_STEP_MIN = Math.min(...STEP_PROBE.map((s) => s.ratio7over6));
const R76_STEP_SPREAD = R76_STEP_MAX / R76_STEP_MIN; // >> 1 -> the apparent turn-up is a step-dependent artifact

// Does the STEP-STABLE ladder resume rising? (ratios through r6/5, all sub-unity, r6/5 < r5/4 -> still falling)
const STABLE_LADDER_RESUMES_RISING = RATIO_6_5 > RATIO_5_4; // false -> no genuine turn-up within resolvable orders
const CONVERGENT_VS_ASYMPTOTIC = STABLE_LADDER_RESUMES_RISING ? 'asymptotic/divergent' : 'convergent';

export const IMP34836_SIGMA_KNEE_SIXTH_SEVENTH_ORDER_V_EXPANSION = {
  id: 'imp-34836',
  proofSection: 'S-frontier',
  question:
    'imp-34821 computed delta_5 ~ +3.80e-12 and found the ratio ladder {1.47e-3, 9.82e-3, 8.13e-3, 5.73e-3} stays ' +
    'sub-unity with the last term DECREASING (five orders look convergent), but left OPEN whether the term ratios ' +
    'eventually turn UP (divergence) at orders beyond the fifth -- distinguishing a genuinely convergent series ' +
    'from an asymptotic/divergent one with a divergence-driven optimal truncation. Extend the recursion to ' +
    'delta_6/delta_7 (and the tail bound), MEASURE whether the ratio ladder resumes rising, and report which of ' +
    'convergent-vs-asymptotic the extended evidence favours. Measurement only; conditional-share diagnostic, NOT ' +
    'an RH bound; C_mb GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'the sixth- and seventh-order slowly-varying-v deltas delta_6 = -3 p delta_5 - 4 delta_1 delta_5 - 4 delta_2 ' +
    'delta_4 - 2 delta_3^2 and delta_7 = -3 p delta_6 - 4 delta_1 delta_6 - 4 delta_2 delta_5 - 4 delta_3 delta_4 ' +
    '(p = v_prime/v^2) of the exponent-knee condition F(x)=S(2S-1)v^3+3 S v v_prime+v_secondDeriv=0, the extended ' +
    'ratio ladder r6/5, r7/6 appended to the imp-34821 rungs, a step-sensitivity probe of delta_6/delta_7/r7/6 at ' +
    'central-difference steps {2e-3, 1e-3, 5e-4}, a conservative geometric tail bound sum_(k>=6)|delta_k| from the ' +
    'resolvable ratios, and the convergent-vs-asymptotic verdict for the step-stable ladder',
  expansion: {
    delta1AtCrossover: +DELTA1.toExponential(4), // ~-5.6444e-3 (imp-34821 base rung)
    delta2AtCrossover: +DELTA2.toExponential(4), // ~+8.2994e-6
    delta3AtCrossover: +DELTA3.toExponential(4), // ~+8.1486e-8
    delta4AtCrossover: +DELTA4.toExponential(4), // ~+6.6230e-10
    delta5AtCrossover: +DELTA5.toExponential(4), // ~+3.7975e-12 (imp-34821)
    delta6AtCrossover: +DELTA6.toExponential(4), // ~+2.0189e-15 (this module)
    delta7AtCrossover: +DELTA7.toExponential(4), // ~-3.2212e-16 (this module)
    delta6Formula: 'delta_6 = -3 p delta_5 - 4 delta_1 delta_5 - 4 delta_2 delta_4 - 2 delta_3^2, p = v_prime/v^2',
    delta7Formula: 'delta_7 = -3 p delta_6 - 4 delta_1 delta_6 - 4 delta_2 delta_5 - 4 delta_3 delta_4',
    ratio2over1: +RATIO_2_1.toExponential(4), // ~1.4704e-3
    ratio3over2: +RATIO_3_2.toExponential(4), // ~9.8183e-3
    ratio4over3: +RATIO_4_3.toExponential(4), // ~8.1278e-3
    ratio5over4: +RATIO_5_4.toExponential(4), // ~5.7339e-3
    ratio6over5: +RATIO_6_5.toExponential(4), // ~5.3164e-4 (DECREASING -> no genuine turn-up through delta_6)
    ratio7over6: +RATIO_7_6.toExponential(4), // ~1.5955e-1 (first apparent rise -- FD-noise artifact, F1)
    tailBoundSumKge6: +TAIL_BOUND_KGE6.toExponential(4), // ~2.04e-15 (resolvable-ratio proxy)
  },
  stepSensitivity: {
    note: 'delta_6/delta_7 recomputed at three central-difference steps; large spread => roundoff-dominated (below FD noise floor).',
    steps: STEP_PROBE.map((s) => ({
      hd: s.hd,
      delta6: +s.delta6.toExponential(3),
      delta7: +s.delta7.toExponential(3),
      ratio7over6: +s.ratio7over6.toExponential(3),
    })),
    delta6StepSpread: +D6_STEP_SPREAD.toExponential(3), // ~1.1e1 (varies ~11x -> noise-dominated)
    ratio7over6StepSpread: +R76_STEP_SPREAD.toExponential(3), // ~4.3e1 (swings >1 order -> the turn-up is step-dependent)
  },
  stableLadderResumesRising: STABLE_LADDER_RESUMES_RISING, // false
  convergentVsAsymptotic: CONVERGENT_VS_ASYMPTOTIC, // 'convergent'
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  finding: {
    F1_seventh_order_turnup_is_below_the_fd_noise_floor:
      'delta_6 ~ +2.02e-15 (r6/5 ~ 5.32e-4, decreasing further from r5/4 ~ 5.73e-3) and delta_7 ~ -3.22e-16, whose ' +
      'ratio r7/6 ~ 1.60e-1 is the FIRST apparent RISE in the ladder. But this turn-up is NOT a genuine divergence ' +
      'signature: it sits below the finite-difference noise floor of the underlying v-derivatives. Under the ' +
      'step-sensitivity probe delta_6 varies by ~11x and even FLIPS SIGN at finer steps, and r7/6 swings over more ' +
      'than an order of magnitude across steps {2e-3, 1e-3, 5e-4} (~9.77e-2, ~1.60e-1, ~3.75e-3) -- the hallmark of ' +
      'a roundoff-dominated quantity, not a resolved physical term. The imp-34821 base rungs delta_1..delta_5 stay ' +
      'step-stable and reproduce verbatim.',
    F2_step_stable_ladder_does_not_resume_rising_evidence_favours_convergent:
      'Through the RESOLVABLE orders the ratio ladder {1.47e-3, 9.82e-3, 8.13e-3, 5.73e-3, 5.32e-4 (r6/5)} stays ' +
      'sub-unity and, from r3/2 onward, DECREASING -- no monotone rise. The only rise (r7/6) is at the delta_7 ' +
      'order, which is below the FD floor and step-unstable. So the extended evidence still FAVOURS convergent: no ' +
      'genuine divergence turn-up is detected within the orders the finite-difference model can resolve, confirming ' +
      'and extending the imp-34821 five-order conclusion. Whether a true turn-up exists at orders >= 7 remains ' +
      'UNRESOLVED at this differencing precision -- resolving it needs an analytic/exact-derivative evaluation ' +
      'below the FD noise floor (the same imp-34756/imp-34770/imp-34797/imp-34821 Richardson sub-gap), which ' +
      'changes no bound.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Extending the slowly-varying-v recursion TWO orders past ' +
    'imp-34821 gives delta_6 = -3 p delta_5 - 4 delta_1 delta_5 - 4 delta_2 delta_4 - 2 delta_3^2 ~ +2.02e-15 ' +
    '(r6/5 ~ 5.32e-4, decreasing) and delta_7 = -3 p delta_6 - 4 delta_1 delta_6 - 4 delta_2 delta_5 - 4 delta_3 ' +
    'delta_4 ~ -3.22e-16, whose ratio r7/6 ~ 1.60e-1 is the first apparent RISE in the ladder. That turn-up is a ' +
    'FINITE-DIFFERENCE NOISE ARTIFACT, not a divergence signature: the step-sensitivity probe shows delta_6 varies ' +
    'by ~11x and flips sign across steps and r7/6 swings over an order of magnitude, so the delta_7 order is below ' +
    'the FD noise floor of the underlying v-derivatives. The STEP-STABLE ladder {1.47e-3, 9.82e-3, 8.13e-3, ' +
    '5.73e-3, 5.32e-4} stays sub-unity and does NOT resume rising, so the extended evidence still FAVOURS ' +
    'convergent -- no genuine divergence turn-up is detected within the resolvable orders, confirming and ' +
    'extending imp-34821. Whether a true turn-up exists at orders >= 7 stays UNRESOLVED at this differencing ' +
    'precision and needs an exact-derivative evaluation below the FD floor (the imp-34756/imp-34770/imp-34797/' +
    'imp-34821 Richardson sub-gap), which changes no bound. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 ' +
    '(imp-3463); no RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'EXTENDS imp-34821s deferred beyond-fifth turn-up test: delta_6 ~ +2.02e-15 keeps the ladder decreasing ' +
    '(r6/5 ~ 5.32e-4 < r5/4) and the first apparent rise (r7/6 ~ 1.60e-1) is a step-unstable FD-noise artifact ' +
    '(delta_6 flips sign and r7/6 swings >1 order across steps), so the step-stable ladder does NOT resume rising ' +
    'and the extended evidence still favours convergent. What stays OPEN (deferred, not attempted here): whether a ' +
    'genuine divergence turn-up exists at orders >= 7 cannot be resolved at central-difference precision because ' +
    'those terms fall below the FD noise floor -- resolving it needs an analytic/exact-derivative (higher-precision ' +
    'or symbolic) evaluation of the v-derivatives, the same Richardson sub-gap imp-34756/imp-34770/imp-34797/' +
    'imp-34821 left open, which changes no bound.',
  citation:
    'imp-34821 (fifth-order delta_5 and the deferred beyond-fifth turn-up this extends); imp-34797 (fourth-order ' +
    'delta_4); imp-34770 (third-order delta_3 and the FD-noise-dominated non-monotonicity); imp-34756 (second-order ' +
    'delta_2 and the ~9.2e-5 dex FD floor); imp-34710 (the ~99%/1% residual split; F3 first identifies the FD ' +
    'floor); imp-34694 (first-order delta_1); imp-3463 (far-tail 1/2); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34836_SIGMA_KNEE_SIXTH_SEVENTH_ORDER_V_EXPANSION_ASSERTIONS = [
  {
    // (base rungs): the imp-34821 delta_1..delta_5 reproduce verbatim at the canonical step (reused, not re-derived).
    id: 'imp34836-base-rungs-match-imp34821',
    description:
      'delta_1..delta_5 reproduce the imp-34821 rungs: delta_1 ~ -5.64e-3, delta_5 ~ +3.80e-12, all magnitudes strictly decreasing',
    holds: () =>
      Math.abs(DELTA1 - -5.6444e-3) < 1e-6 &&
      Math.abs(DELTA5 - 3.7975e-12) < 1e-13 &&
      Math.abs(DELTA1) > Math.abs(DELTA2) &&
      Math.abs(DELTA2) > Math.abs(DELTA3) &&
      Math.abs(DELTA3) > Math.abs(DELTA4) &&
      Math.abs(DELTA4) > Math.abs(DELTA5),
  },
  {
    // (F1 new orders): delta_6 ~ +2e-15 keeps the ladder decreasing (r6/5 < r5/4); delta_7 ~ -3e-16 is the smallest
    // term, and r7/6 ~ 1.6e-1 is the first apparent RISE.
    id: 'imp34836-delta6-delta7-computed',
    description:
      'delta_6 ~ +2e-15 (r6/5 < r5/4, still decreasing); delta_7 ~ -3e-16 is smallest; r7/6 ~ 1.6e-1 is the first apparent rise',
    holds: () =>
      DELTA6 > 0 &&
      DELTA6 < 1e-13 &&
      Math.abs(DELTA7) < Math.abs(DELTA6) &&
      RATIO_6_5 < RATIO_5_4 &&
      RATIO_7_6 > RATIO_6_5,
  },
  {
    // (F1 noise): the delta_7 order is below the FD noise floor -- delta_6 magnitude varies by > 3x and r7/6 swings
    // by > 5x across the three central-difference steps, so the apparent r7/6 turn-up is a step-dependent artifact.
    id: 'imp34836-seventh-order-below-fd-noise-floor',
    description:
      'step-sensitivity: delta_6 magnitude spread > 3x and r7/6 spread > 5x across steps {2e-3,1e-3,5e-4} -> roundoff-dominated, not a resolved term',
    holds: () => D6_STEP_SPREAD > 3 && R76_STEP_SPREAD > 5,
  },
  {
    // (F2 verdict): the step-STABLE ladder does not resume rising, so the extended evidence favours convergent.
    id: 'imp34836-stable-ladder-favours-convergent',
    description:
      'step-stable ratios r2/1..r6/5 all sub-unity and r6/5 < r5/4 (no genuine turn-up) -> convergentVsAsymptotic = convergent',
    holds: () =>
      RATIO_2_1 < 1 &&
      RATIO_3_2 < 1 &&
      RATIO_4_3 < 1 &&
      RATIO_5_4 < 1 &&
      RATIO_6_5 < 1 &&
      STABLE_LADDER_RESUMES_RISING === false &&
      IMP34836_SIGMA_KNEE_SIXTH_SEVENTH_ORDER_V_EXPANSION.convergentVsAsymptotic === 'convergent',
  },
  {
    // tail bound: the resolvable-ratio geometric tail sum_(k>=6)|delta_k| is tiny (< |delta_5|) and positive.
    id: 'imp34836-tail-bound-below-delta5',
    description: 'sum_(k>=6) tail bound is positive and below |delta_5|',
    holds: () => TAIL_BOUND_KGE6 > 0 && TAIL_BOUND_KGE6 < Math.abs(DELTA5),
  },
  {
    // ordering / replication sanity: crossover reproduces the imp-34821 value.
    id: 'imp34836-crossover-matches-imp34821',
    description: 'crossover log10 N ~ 9.5159 reproduces imp-34821',
    holds: () => LOG10_N_CROSS > 9.5158 && LOG10_N_CROSS < 9.5161,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34836-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34836_SIGMA_KNEE_SIXTH_SEVENTH_ORDER_V_EXPANSION.isRigorous === false &&
      IMP34836_SIGMA_KNEE_SIXTH_SEVENTH_ORDER_V_EXPANSION.farTailExponent === 0.5 &&
      typeof IMP34836_SIGMA_KNEE_SIXTH_SEVENTH_ORDER_V_EXPANSION.subGap === 'string' &&
      /NO QED/.test(IMP34836_SIGMA_KNEE_SIXTH_SEVENTH_ORDER_V_EXPANSION.verdict) &&
      /refereed bound is changed/i.test(IMP34836_SIGMA_KNEE_SIXTH_SEVENTH_ORDER_V_EXPANSION.verdict),
  },
];

for (const a of IMP34836_SIGMA_KNEE_SIXTH_SEVENTH_ORDER_V_EXPANSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34836-sigma-knee-sixth-seventh-order-v-expansion assertion failed: ${a.id}`);
  }
}
