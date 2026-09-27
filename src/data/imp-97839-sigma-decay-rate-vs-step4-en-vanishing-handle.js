/**
 * @module imp-97839-sigma-decay-rate-vs-step4-en-vanishing-handle
 *
 * imp-97839 (proof, S-frontier): ASSESSMENT. The lambda-roadmap Step-4 bridge
 * |Lambda - (-t_c(N))| <= E(N) is gated on an UNSUPPLIED E(N) -> 0 modulo
 * (G-EN-ladder-verify, alongside RH-equivalent C_H and uncertified E_trunc). The
 * imp-33582 / imp-3406 far-tail analysis QUANTIFIES the conditional share
 * sigma(N) = E_coll/E(N): past its interior peak (N ~ 9.22e5, sigma_max ~ 0.9494)
 * it decays with a per-decade local exponent that RAMPS toward 1/2 (dropping below
 * 0.1 at N ~ 3.21e11), because the constant floor E_trunc outlives the vanishing
 * GUE-conditional E_coll -- i.e. E(N) does NOT vanish, it tends to E_trunc > 0.
 * QUESTION (rate-level, distinct from the imp-95465 LIMIT-level "no escape"): does
 * that measured far-tail sigma-DECAY RATE give any QUANTITATIVE HANDLE on the
 * Step-4 E(N) -> 0 requirement, and what is the precise obstruction?
 *
 * THE COMPONENT MODEL (identical inherited sub-terms to imp-3406 / imp-33582 / imp-95465)
 * ------------------------------------------------------------------------------------
 *     E(N)    = E_trunc + E_flow + E_coll
 *     E_trunc = 3.06e-5                          (N-INDEPENDENT fixed-strip floor, imp-2631)
 *     E_flow  = C_F (log T0 / T0) Gronwall  -> 0 (unconditional, imp-398; far-tail negligible)
 *     E_coll  = C_C_PINNED sqrt(log T0 / N) -> 0 (GUE-conditional collapse, imp-486)
 *     sigma(N) = E_coll / E(N)                    (bridge-conditional share, imp-3406)
 * No re-derivation, no fresh model: the exact inherited sub-terms. Write the residual
 * above the floor as R(N) = E(N) - E_trunc = E_coll + E_flow; on the far tail
 * E_flow / E_coll -> 0, so R is E_coll-dominated.
 *
 * THE ASSESSMENT (rate-level -- the decay rate is a handle on the WRONG target)
 * ---------------------------------------------------------------------------
 *  (A) THE FAR-TAIL sigma-DECAY EXPONENT IS THE RESIDUAL / NUMERATOR RATE, NOT E(N)'s.
 *      The pointwise log-slopes decompose exactly (E_trunc is a constant):
 *          d ln sigma / d ln N = d ln R / d ln N  -  d ln E / d ln N.
 *      Measured on the far tail: d ln R / d ln N -> -1/2 (the E_coll collapse rate,
 *      what imp-33582 reports as the ramping "sigma exponent"), while
 *      d ln E / d ln N -> 0 (E frozen at its floor). So the imp-33582 exponent -> 1/2
 *      is carried ENTIRELY by the residual R = E - E_trunc; it is the rate at which
 *      E APPROACHES E_trunc from above, NOT a rate at which E approaches 0.
 *  (B) THE EXACT CHAIN-RULE IDENTITY PINS E(N)'s OWN RATE TO ZERO.
 *      Since dE/dN = dR/dN (E_trunc constant),
 *          d ln E / d ln N = (R / E) * (d ln R / d ln N) = sigma_R * (d ln R / d ln N),
 *      where sigma_R = R/E -> 0. Verified to machine epsilon at every sampled N. So
 *      even though the residual rate stabilizes at a NONZERO -1/2, E(N)'s own rate is
 *      that rate SUPPRESSED by the vanishing residual share sigma_R, hence -> 0. A
 *      nonzero decay rate for the ratio / residual coexists with a ZERO decay rate for
 *      E(N): the very stabilization of the sigma exponent is the quantitative signature
 *      that E(N) has stopped moving.
 *  (C) THE PRECISE OBSTRUCTION: A HANDLE ON THE FLOOR-APPROACH, NOT ON E(N) -> 0.
 *      The sigma-decay rate is a genuine, well-defined quantitative handle -- but on
 *      lim E(N) = E_trunc (a POSITIVE limit), i.e. on how fast the conditional collapse
 *      channel loses weight against the fixed floor. The Step-4 modulo needs a handle on
 *      lim E(N) = 0. These are incompatible targets: inf_N E(N) = E_trunc > 0, so no
 *      finite exponent for E(N) -> 0 exists to be measured, and the residual "half-life"
 *      (~3.4 decades to halve, imp-33582) is a half-life toward E_trunc, never toward 0.
 *      A ratio whose far-tail rate is set entirely by its numerator is definitionally
 *      silent about its (floored) denominator reaching 0.
 *
 * VERDICT: NO QUANTITATIVE HANDLE on E(N) -> 0. The imp-33582 far-tail sigma-decay rate
 * (exponent -> 1/2) quantifies the residual / E_coll collapse rate d ln(E - E_trunc)/d ln N
 * -> -1/2, i.e. the speed of E(N) -> E_trunc, and by the exact identity
 * d ln E / d ln N = sigma_R * d ln(E - E_trunc)/d ln N -> 0 it pins E(N)'s own rate to
 * zero. It therefore supplies a rate-level RESTATEMENT of the imp-35164 floor obstruction
 * (the rate companion to the imp-95465 limit-level "no escape"), not a lever on it. Any
 * handle on E(N) -> 0 must drive the N-INDEPENDENT E_trunc itself (imp-34791 uncertified
 * truncation lemma) or the RH-equivalent C_H bridge (imp-35147) -- both OUTSIDE the
 * height/collapse channel the sigma rate measures; the sole scoped route is the OPEN
 * vanishing-strip Knob A (T_v(N) -> infinity beyond X ~ 3e12, imp-35149 R3).
 *
 * ASSESSMENT ONLY (structural / rate over the inherited surrogate model, which is NOT a
 * rigorous asymptotic). Changes no bound; establishes no operator positivity; the
 * C_mb / C_H GUE-conditional inputs are UNTOUCHED; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-95465-sigma-decay-no-escape-from-en-nonvanishing (LIMIT-level companion: no escape)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (far-tail exponent ramp -> 1/2)
 * @see imp-3406-sigma-highN-extrapolation (interior peak, monotone decay-to-0 right arm)
 * @see asymptotic-lambda-bound-2026-05-20 (imp-35164 E(N) floors at E_trunc; imp-2621 refuted)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-INDEPENDENT fixed-strip floor (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-95465 exactly

// EXACT imp-3406/imp-33582/imp-95465 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditional, far-tail negligible
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional collapse (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  const R = E_N - E_TRUNC_PT; // residual above the floor = E_coll + E_flow
  return { T0, L, E_flow, E_coll, E_N, R, sigma: E_coll / E_N, sigma_R: R / E_N };
}

// Central log-log slope d ln(fn)/d ln N via a small multiplicative step in N.
const H_STEP = 1e-4;
function logSlope(fn, N) {
  const up = Math.log(fn(N * (1 + H_STEP)));
  const dn = Math.log(fn(N / (1 + H_STEP)));
  return (up - dn) / (2 * Math.log(1 + H_STEP));
}

// Far-tail ladder (N well past the imp-33582 peak): watch the residual rate stabilize
// at -1/2 while E(N)'s OWN rate collapses to 0, in lockstep with the vanishing share.
const SAMPLE_N = [1e10, 1e12, 1e14, 1e16, 1e18];
const RATE_LADDER = SAMPLE_N.map((N) => {
  const p = parts(N);
  const sigmaSlope = logSlope((x) => parts(x).sigma, N);
  const residualSlope = logSlope((x) => parts(x).R, N); // -> -1/2 (E_coll collapse rate)
  const eSlope = logSlope((x) => parts(x).E_N, N); // -> 0 (E frozen at the floor)
  const chainProduct = p.sigma_R * residualSlope; // exact chain-rule value of eSlope
  return {
    N: +N.toExponential(0),
    sigma: +p.sigma.toExponential(3),
    sigma_R: +p.sigma_R.toExponential(3), // residual share R/E -> 0
    residualSlope: +residualSlope.toFixed(5), // d ln(E - E_trunc)/d ln N -> -0.5
    eSlope: +eSlope.toExponential(3), // d ln E/d ln N -> 0
    chainProductResidual: +Math.abs(eSlope - chainProduct).toExponential(2), // ~machine eps
    eFlowOverEcoll: +(p.E_flow / p.E_coll).toExponential(2), // -> 0 (R is E_coll-dominated)
  };
});

// (B) exact chain-rule identity residual: d ln E/d ln N = sigma_R * d ln R/d ln N.
const MAX_CHAIN_IDENTITY_RESIDUAL = Math.max(...RATE_LADDER.map((r) => r.chainProductResidual));
// (A)/(C) far-tail residual rate vs E(N)'s own rate at the deepest sampled N.
const DEEP = RATE_LADDER[RATE_LADDER.length - 1];
const HALF = 0.5; // imp-3463 far-tail asymptote the residual rate approaches
const HANDLE_ON_EN_VANISHING = false;

export const IMP97839_SIGMA_DECAY_RATE_VS_STEP4_HANDLE = {
  id: 'imp-97839',
  proofSection: 'S-frontier',
  question:
    'Does the imp-33582 far-tail sigma(N) = E_coll/E(N) DECAY RATE (per-decade exponent ' +
    'ramping toward 1/2, sigma below 0.1 at N ~ 3.21e11) give any QUANTITATIVE HANDLE on ' +
    'the lambda-roadmap Step-4 unsupplied E(N) -> 0 modulo, or definitively obstruct it? ' +
    'Assessment only; the component model is not a rigorous asymptotic; changes no bound; no QED.',
  handleOnEnVanishing: HANDLE_ON_EN_VANISHING,
  farTailAsymptote: HALF,
  deepResidualSlope: DEEP.residualSlope, // ~ -0.488 -> -1/2
  deepEnSlope: DEEP.eSlope, // ~ -3.9e-5 -> 0
  maxChainIdentityResidual: +MAX_CHAIN_IDENTITY_RESIDUAL.toExponential(3),
  rateLadder: RATE_LADDER,
  assessment: {
    A_sigma_exponent_is_the_residual_rate:
      'The pointwise log-slopes decompose exactly (E_trunc constant): ' +
      'd ln sigma/d ln N = d ln R/d ln N - d ln E/d ln N, with R = E - E_trunc. On the ' +
      'far tail d ln R/d ln N -> -1/2 (the E_coll collapse rate imp-33582 reports as the ' +
      'ramping sigma exponent) while d ln E/d ln N -> 0. So the imp-33582 exponent -> 1/2 is ' +
      'carried entirely by the residual R -- it is the rate of E APPROACHING E_trunc from ' +
      'above, not a rate of E approaching 0.',
    B_chain_rule_pins_En_rate_to_zero:
      'Since dE/dN = dR/dN, the exact identity d ln E/d ln N = (R/E) d ln R/d ln N = ' +
      'sigma_R d ln R/d ln N holds to machine epsilon at every sampled N. E(N)s own rate is ' +
      'the nonzero residual rate SUPPRESSED by the vanishing residual share sigma_R -> 0, ' +
      'hence -> 0. A nonzero rate for the ratio / residual coexists with a zero rate for E(N); ' +
      'the stabilization of the sigma exponent is the quantitative signature that E(N) has ' +
      'stopped moving.',
    C_precise_obstruction_wrong_target:
      'The sigma-decay rate is a genuine handle -- but on lim E(N) = E_trunc (a POSITIVE ' +
      'limit), i.e. on how fast the collapse channel loses weight against the fixed floor. ' +
      'Step-4 needs a handle on lim E(N) = 0. These are incompatible: inf_N E(N) = E_trunc > 0, ' +
      'so no finite exponent for E(N) -> 0 exists to be measured, and the residual half-life ' +
      '(~3.4 decades, imp-33582) is toward E_trunc, never toward 0. A ratio whose far-tail rate ' +
      'is set entirely by its numerator is definitionally silent about its floored denominator ' +
      'reaching 0. Any handle on E(N) -> 0 must drive the N-independent E_trunc (imp-34791) or ' +
      'the RH-equivalent C_H bridge (imp-35147), both outside the channel sigma measures; the ' +
      'sole scoped route is the OPEN vanishing-strip Knob A (T_v(N) -> infinity, imp-35149 R3).',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT (rate-level, structural over the inherited surrogate model, NOT rigorous). ' +
    'NO QUANTITATIVE HANDLE on E(N) -> 0: the imp-33582 far-tail sigma-decay rate (exponent ' +
    '-> 1/2) quantifies the residual / E_coll collapse rate d ln(E - E_trunc)/d ln N -> -1/2 ' +
    '(the speed of E(N) -> E_trunc), and by the exact chain-rule identity ' +
    'd ln E/d ln N = sigma_R d ln(E - E_trunc)/d ln N (residual < 1e-9 at all sampled N) it ' +
    'pins E(N)s own rate to 0 as the residual share sigma_R -> 0. So the decay rate is a ' +
    'rate-level RESTATEMENT of the imp-35164 floor obstruction (the rate companion to the ' +
    'imp-95465 limit-level no-escape), a handle on the WRONG target (the positive floor ' +
    'E_trunc, not 0). Any handle on E(N) -> 0 must drive the N-independent E_trunc (imp-34791) ' +
    'or the RH-equivalent C_H bridge (imp-35147), both outside the height/collapse channel the ' +
    'sigma rate measures; the sole scoped route is the OPEN vanishing-strip Knob A (imp-35149 ' +
    'R3, T_v(N) -> infinity beyond X ~ 3e12). imp-35164 stands, imp-2621 stays refuted; changes ' +
    'no bound; establishes no operator positivity; the C_mb / C_H GUE-conditional inputs are ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA.',
  citation:
    'imp-95465 (limit-level no escape); imp-33582 (far-tail sigma exponent ramp -> 1/2); ' +
    'imp-3406 (interior peak, decay-to-0 right arm); imp-3463 (far-tail exponent -> 1/2); ' +
    'imp-35164 (E(N) floors at E_trunc); imp-2621 (refuted amplified M_infty rate); imp-34791 ' +
    '(uncertified E_trunc); imp-35147 (C_H RH-equivalent); imp-35149 (vanishing-strip Knob A); ' +
    'imp-2631 (E_trunc fixed-strip route); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping.',
};

export const IMP97839_SIGMA_DECAY_RATE_VS_STEP4_HANDLE_ASSERTIONS = [
  {
    // (A): the far-tail residual rate d ln(E - E_trunc)/d ln N approaches the imp-3463
    // asymptote -1/2 -- a NONZERO, well-defined rate (the E_coll collapse / floor-approach).
    id: 'imp97839-residual-rate-approaches-minus-half',
    description: 'd ln(E - E_trunc)/d ln N -> -1/2: deep residual slope within 0.02 of -0.5',
    holds: () => Math.abs(DEEP.residualSlope - -HALF) < 0.02,
  },
  {
    // (A)/(B): E(N)s OWN rate collapses toward 0 down the ladder while the residual rate
    // stays pinned near -1/2 -- the two rates are on opposite targets (0 vs the floor).
    id: 'imp97839-En-own-rate-collapses-to-zero',
    description: 'd ln E/d ln N monotonically shrinks in magnitude toward 0 down the ladder; deep |eSlope| < 1e-4',
    holds: () => {
      for (let i = 1; i < RATE_LADDER.length; i++) {
        if (!(Math.abs(RATE_LADDER[i].eSlope) < Math.abs(RATE_LADDER[i - 1].eSlope))) return false;
      }
      return Math.abs(DEEP.eSlope) < 1e-4 && Math.abs(DEEP.residualSlope) > 0.4;
    },
  },
  {
    // (B): exact chain-rule identity d ln E/d ln N = sigma_R * d ln R/d ln N at every N
    // -- E(N)s rate IS the residual rate suppressed by the vanishing residual share.
    id: 'imp97839-chain-rule-identity-exact',
    description: 'd ln E/d ln N = sigma_R d ln(E - E_trunc)/d ln N exact at all sampled N (residual < 1e-9)',
    holds: () => MAX_CHAIN_IDENTITY_RESIDUAL < 1e-9,
  },
  {
    // (C): the residual is E_coll-dominated on the far tail (E_flow/E_coll -> 0), so the
    // measured rate is the GUE-conditional collapse rate, not the unconditional flow term.
    id: 'imp97839-residual-is-ecoll-dominated',
    description: 'E_flow/E_coll -> 0 down the ladder; deep ratio < 1e-5',
    holds: () => {
      for (let i = 1; i < RATE_LADDER.length; i++) {
        if (!(RATE_LADDER[i].eFlowOverEcoll < RATE_LADDER[i - 1].eFlowOverEcoll)) return false;
      }
      return DEEP.eFlowOverEcoll < 1e-5;
    },
  },
  {
    // Verdict gate: handle is NEGATIVE and the verdict names the true off-channel levers
    // (N-independent E_trunc / RH-equivalent C_H / vanishing-strip Knob A), not sigma.
    id: 'imp97839-no-handle-verdict',
    description: 'handleOnEnVanishing false; verdict states NO QUANTITATIVE HANDLE and names imp-35164 standing',
    holds: () =>
      IMP97839_SIGMA_DECAY_RATE_VS_STEP4_HANDLE.handleOnEnVanishing === false &&
      /NO QUANTITATIVE HANDLE/.test(IMP97839_SIGMA_DECAY_RATE_VS_STEP4_HANDLE.verdict) &&
      /imp-35164 stands/.test(IMP97839_SIGMA_DECAY_RATE_VS_STEP4_HANDLE.verdict),
  },
  {
    // Honesty gate: assessment only (not rigorous), imp-2621 stays refuted, no QED, PT SOTA.
    id: 'imp97839-honesty-gate-no-qed',
    description: 'assessment only: not rigorous, imp-2621 refuted, no QED, PT stays SOTA',
    holds: () =>
      IMP97839_SIGMA_DECAY_RATE_VS_STEP4_HANDLE.isRigorous === false &&
      /refuted/.test(IMP97839_SIGMA_DECAY_RATE_VS_STEP4_HANDLE.verdict) &&
      /NO QED/.test(IMP97839_SIGMA_DECAY_RATE_VS_STEP4_HANDLE.verdict) &&
      /remains SOTA/.test(IMP97839_SIGMA_DECAY_RATE_VS_STEP4_HANDLE.verdict),
  },
];

for (const a of IMP97839_SIGMA_DECAY_RATE_VS_STEP4_HANDLE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97839-sigma-decay-rate-vs-step4-en-vanishing-handle assertion failed: ${a.id}`);
  }
}
