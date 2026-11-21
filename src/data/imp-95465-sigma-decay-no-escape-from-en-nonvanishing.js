/**
 * @module imp-95465-sigma-decay-no-escape-from-en-nonvanishing
 *
 * imp-95465 (proof, S-frontier): ASSESSMENT. imp-95448 records that even a
 * fully audited R_A ladder is INERT for Lambda while imp-2621 (refuted amplified
 * M_infty rate) and imp-35164 (E(N) does not vanish -- it FLOORS at the
 * N-independent E_trunc) stand. The roadmap conditional share
 * sigma(N) = E_coll / E(N) peaks ~94.9% near N ~ 9.22e5 then decays monotonically
 * toward 0 (imp-33582) as the constant truncation floor E_trunc outlives the
 * vanishing GUE-conditional E_coll. QUESTION: does that post-peak decay of the
 * conditional share open ANY escape from the imp-35164 non-vanishing obstruction?
 *
 * THE COMPONENT MODEL (identical inherited sub-terms to imp-3406 / imp-33582)
 * -------------------------------------------------------------------------
 *     E(N)    = E_trunc + E_flow + E_coll
 *     E_trunc = 3.06e-5                          (N-INDEPENDENT fixed-strip floor, imp-2631)
 *     E_flow  = C_F (log T0 / T0) Gronwall  -> 0 (unconditional, imp-398)
 *     E_coll  = C_C_PINNED sqrt(log T0 / N) -> 0 (GUE-conditional collapse, imp-486)
 *     sigma(N) = E_coll / E(N)                    (bridge-conditional share, imp-3406)
 * No re-derivation, no fresh model: the exact inherited sub-terms, reused only to
 * make the structural assessment concrete. The ESCAPE would be lim E(N) = 0 (the
 * asymptotic dream that pushes Lambda -> 0); imp-35164 refutes it via lim E = E_trunc.
 *
 * THE ASSESSMENT (structural / logical -- NO escape)
 * --------------------------------------------------
 *  (A) THE DECAY IS LOGICALLY EQUIVALENT TO THE OBSTRUCTION, NOT AN ESCAPE FROM IT.
 *      Because E_flow, E_coll -> 0 while E_trunc > 0 is fixed,
 *          lim_N sigma(N) = 0   <=>   lim_N E(N) = E_trunc   (> 0).
 *      Indeed 1 - sigma(N) = (E_trunc + E_flow) / E(N), so sigma -> 0 forces
 *      E -> E_trunc + E_flow -> E_trunc. The post-peak decay of the share is not a
 *      new phenomenon separate from imp-35164 -- it is the SAME statement written
 *      as a share. sigma decays PRECISELY BECAUSE the non-vanishing floor dominates;
 *      it is the numerical signature of the obstruction, not a route around it.
 *  (B) THE THREE IMAGINABLE ESCAPES FROM (A) ALL FAIL.
 *      (b1) "sigma -> 0 means E_coll is negligible, so drop it and the residual is
 *           small" -- dropping E_coll leaves E_trunc + E_flow -> E_trunc, exactly the
 *           floor imp-35164 names. A vanishing SHARE means the collapse channel loses
 *           leverage over the total, giving it LESS power to move E, not the
 *           truncation channel any less power.
 *      (b2) "the decaying share means diminishing returns from height, so push N to
 *           shrink E" -- the marginal return dE/dN -> 0 while E stays pinned >= E_trunc.
 *           Diminishing returns toward a positive floor is the OPPOSITE of escape.
 *      (b3) "an amplified collapse rate lets E_coll's decay pull E_trunc down" --
 *           E_coll (GUE-conditional) and E_trunc (fixed-strip truncation) are
 *           structurally INDEPENDENT ADDITIVE channels; E_coll cannot subtract from
 *           E_trunc. The only rate-amplification route is imp-2621, which is REFUTED.
 *           sigma -> 0 makes this LESS plausible: the collapse channel carries
 *           vanishing weight in E.
 *  (C) WHERE AN ESCAPE WOULD ACTUALLY HAVE TO COME FROM -- not from sigma at all.
 *      Either (i) certify E_trunc itself and drive it to 0 -- but E_trunc is
 *      N-INDEPENDENT by construction, so no height/collapse lever touches it; the
 *      only lever is a better truncation lemma (the uncertified-E_trunc conditional,
 *      imp-34791 honest ~5.1e-5) -- or (ii) the C_H / G6a asymptotic bridge, which is
 *      RH-EQUIVALENT (imp-35147). Both lie OUTSIDE the height/collapse channel that
 *      sigma measures.
 *
 * VERDICT: NO ESCAPE. The imp-33582 post-peak monotone decay of sigma is logically
 * equivalent to E(N) flooring at E_trunc, so it RE-STATES the imp-35164 obstruction
 * rather than escaping it. Any escape must come from an N-independent E_trunc
 * certificate or the RH-equivalent C_H bridge -- neither reachable via the
 * height/collapse channel sigma measures. imp-2621 stays refuted, imp-35164 stands,
 * the R_A ladder stays INERT for Lambda (imp-95448).
 *
 * ASSESSMENT ONLY (structural over the inherited surrogate model, which is NOT a
 * rigorous asymptotic). Changes no bound; establishes no operator positivity; the
 * C_mb / C_H GUE-conditional inputs are UNTOUCHED; imp-3066 K_a >= 0 untouched; no
 * RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (sigma peak ~9.22e5, decay-to-0)
 * @see imp-95448-ra-ladder-input-data-audit (R_A ladder INERT while imp-2621/imp-35164 stand)
 * @see asymptotic-lambda-bound-2026-05-20 (imp-35164 E(N) floors at E_trunc; imp-2621 refuted)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-INDEPENDENT fixed-strip floor (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582 exactly

// EXACT imp-3406/imp-33582 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional collapse (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Post-peak sample ladder (N well past the imp-33582 peak ~9.22e5): watch sigma -> 0
// and E(N) -> E_trunc IN LOCKSTEP -- the (A) equivalence made concrete.
const SAMPLE_N = [1e7, 1e8, 1e9, 1e10, 1e12, 1e14, 1e16, 1e18];
const LOCKSTEP_LADDER = SAMPLE_N.map((N) => {
  const p = parts(N);
  return {
    N: +N.toExponential(0),
    sigma: +p.sigma.toFixed(6), // -> 0
    E_over_Etrunc: +(p.E_N / E_TRUNC_PT).toFixed(6), // -> 1 (E -> E_trunc)
    residualAboveFloor: +((p.E_N - E_TRUNC_PT) / p.E_N).toFixed(6), // = 1 - E_trunc/E -> 0
    oneMinusSigma: +(1 - p.sigma).toFixed(6), // = (E_trunc + E_flow)/E
  };
});

// (A) exact algebraic identity check: 1 - sigma = (E_trunc + E_flow)/E at every N.
function identityResidual(N) {
  const p = parts(N);
  return Math.abs(1 - p.sigma - (E_TRUNC_PT + p.E_flow) / p.E_N);
}
const MAX_IDENTITY_RESIDUAL = Math.max(...SAMPLE_N.map(identityResidual)); // ~0 (machine eps)

// (b1)/(b2) the floor: E(N) is bounded strictly below by E_trunc for ALL N (drop
// E_coll and you still keep E_trunc + E_flow >= E_trunc > 0). inf_N E(N) = E_trunc.
const FLOOR = E_TRUNC_PT;
const MIN_SAMPLED_E = Math.min(...SAMPLE_N.map((N) => parts(N).E_N)); // -> E_trunc from above
const ESCAPE_EXISTS = false;

export const IMP95465_SIGMA_DECAY_NO_ESCAPE = {
  id: 'imp-95465',
  proofSection: 'S-frontier',
  question:
    'Does the imp-33582 post-peak monotone decay of the conditional share ' +
    'sigma(N) = E_coll/E(N) (peak ~94.9% near N ~ 9.22e5, decaying to 0 as the ' +
    'N-independent E_trunc floor outlives the vanishing GUE-conditional E_coll) open ' +
    'ANY escape from the imp-35164 non-vanishing obstruction (E(N) floors at E_trunc), ' +
    'or confirm it does not? Assessment only; changes no bound; no QED.',
  escapeExists: ESCAPE_EXISTS,
  floor_E_trunc: E_TRUNC_PT,
  minSampledE: +MIN_SAMPLED_E.toExponential(6),
  maxIdentityResidual: +MAX_IDENTITY_RESIDUAL.toExponential(3),
  lockstepLadder: LOCKSTEP_LADDER,
  assessment: {
    A_decay_is_the_obstruction_re_expressed:
      'Because E_flow, E_coll -> 0 while E_trunc > 0 is fixed, lim sigma(N) = 0 is ' +
      'LOGICALLY EQUIVALENT to lim E(N) = E_trunc: the exact identity ' +
      '1 - sigma = (E_trunc + E_flow)/E forces E -> E_trunc as sigma -> 0. The ' +
      'post-peak decay of the share is the SAME statement as imp-35164 written as a ' +
      'share -- sigma decays PRECISELY BECAUSE the non-vanishing floor dominates, so ' +
      'it is the numerical signature of the obstruction, not a route around it.',
    B_three_imaginable_escapes_all_fail:
      '(b1) sigma -> 0 makes E_coll a negligible SHARE, but dropping it leaves ' +
      'E_trunc + E_flow -> E_trunc, the floor itself; a vanishing share gives the ' +
      'collapse channel LESS leverage over E, not the truncation channel less power. ' +
      '(b2) the diminishing marginal return dE/dN -> 0 leaves E pinned >= E_trunc, ' +
      'the opposite of escape. (b3) E_coll and E_trunc are independent ADDITIVE ' +
      'channels, so E_coll cannot subtract from E_trunc; the only rate-amplification ' +
      'route is imp-2621, which is REFUTED, and sigma -> 0 makes it less plausible.',
    C_where_an_escape_would_have_to_come_from:
      'Not from sigma at all: either certify E_trunc and drive it to 0 (impossible via ' +
      'height/collapse -- E_trunc is N-INDEPENDENT; only a better truncation lemma, the ' +
      'imp-34791 uncertified-E_trunc conditional, moves it), or the C_H / G6a asymptotic ' +
      'bridge, which is RH-EQUIVALENT (imp-35147). Both lie OUTSIDE the channel sigma measures.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT (structural / logical over the inherited surrogate model, NOT rigorous). ' +
    'NO ESCAPE: the imp-33582 post-peak monotone decay of sigma(N) = E_coll/E(N) is ' +
    'logically equivalent to E(N) flooring at the N-independent E_trunc (exact identity ' +
    '1 - sigma = (E_trunc + E_flow)/E; sampled E(N) descends to E_trunc from above, ' +
    'residual-above-floor -> 0 in lockstep with sigma -> 0), so it RE-STATES the imp-35164 ' +
    'obstruction rather than escaping it. All three imaginable escapes fail: a vanishing ' +
    'share removes leverage from the collapse channel not power from the floor; diminishing ' +
    'returns pin E >= E_trunc; and the additive-independent E_coll cannot approach E_trunc ' +
    '(the only rate-amplification route imp-2621 is REFUTED). Any escape must come from an ' +
    'N-independent E_trunc certificate (imp-34791) or the RH-equivalent C_H bridge (imp-35147), ' +
    'neither reachable via the height/collapse channel sigma measures. imp-2621 stays refuted, ' +
    'imp-35164 stands, the R_A ladder stays INERT (imp-95448); changes no bound; establishes no ' +
    'operator positivity; the C_mb / C_H GUE-conditional inputs are UNTOUCHED; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33582 (sigma post-peak decay-to-0); imp-35164 (E(N) floors at E_trunc, does not ' +
    'vanish); imp-2621 (refuted amplified M_infty rate); imp-95448 (R_A ladder INERT); ' +
    'imp-34791 (uncertified E_trunc conditional); imp-35147 (C_H RH-equivalent); imp-2631 ' +
    '(E_trunc fixed-strip route); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping.',
};

export const IMP95465_SIGMA_DECAY_NO_ESCAPE_ASSERTIONS = [
  {
    // (A): the exact algebraic identity 1 - sigma = (E_trunc + E_flow)/E holds at
    // every sampled N -- the equivalence "sigma -> 0 <=> E -> E_trunc" is exact,
    // not a fit. Residual must be machine-epsilon small.
    id: 'imp95465-decay-equivalence-identity-exact',
    description: '1 - sigma = (E_trunc + E_flow)/E exact at all sampled N (residual < 1e-12)',
    holds: () => MAX_IDENTITY_RESIDUAL < 1e-12,
  },
  {
    // (A): sigma decays and E/E_trunc descends toward 1 IN LOCKSTEP down the ladder,
    // both monotone -- the share vanishing and E flooring at E_trunc are one motion.
    id: 'imp95465-sigma-and-E-descend-in-lockstep',
    description: 'down the ladder sigma strictly decreases and E/E_trunc strictly decreases toward 1',
    holds: () => {
      for (let i = 1; i < LOCKSTEP_LADDER.length; i++) {
        if (!(LOCKSTEP_LADDER[i].sigma < LOCKSTEP_LADDER[i - 1].sigma)) return false;
        if (!(LOCKSTEP_LADDER[i].E_over_Etrunc < LOCKSTEP_LADDER[i - 1].E_over_Etrunc)) return false;
      }
      const last = LOCKSTEP_LADDER[LOCKSTEP_LADDER.length - 1];
      return last.sigma < 0.05 && last.E_over_Etrunc < 1.05 && last.E_over_Etrunc > 1;
    },
  },
  {
    // (b1)/(b2): the floor is real -- E(N) stays STRICTLY above E_trunc at every N
    // (dropping E_coll never removes the floor), and inf_N E(N) descends to E_trunc.
    id: 'imp95465-E-bounded-below-by-Etrunc',
    description: 'E(N) > E_trunc at all sampled N; min sampled E within 5% of E_trunc from above',
    holds: () =>
      SAMPLE_N.every((N) => parts(N).E_N > FLOOR) &&
      MIN_SAMPLED_E > FLOOR &&
      MIN_SAMPLED_E < FLOOR * 1.05,
  },
  {
    // Verdict gate: escape is NEGATIVE and the assessment names the true off-channel
    // levers (N-independent E_trunc certificate / RH-equivalent C_H), not sigma.
    id: 'imp95465-no-escape-verdict',
    description: 'escapeExists false; verdict states NO ESCAPE and names imp-35164 standing',
    holds: () =>
      IMP95465_SIGMA_DECAY_NO_ESCAPE.escapeExists === false &&
      /NO ESCAPE/.test(IMP95465_SIGMA_DECAY_NO_ESCAPE.verdict) &&
      /imp-35164 stands/.test(IMP95465_SIGMA_DECAY_NO_ESCAPE.verdict),
  },
  {
    // Honesty gate: assessment only (not rigorous), imp-2621 stays refuted, no QED, no refereed bound is changed.
    id: 'imp95465-honesty-gate-no-qed',
    description: 'assessment only: not rigorous, imp-2621 refuted, no QED, no refereed bound is changed',
    holds: () =>
      IMP95465_SIGMA_DECAY_NO_ESCAPE.isRigorous === false &&
      /REFUTED/.test(IMP95465_SIGMA_DECAY_NO_ESCAPE.verdict) &&
      /NO QED/.test(IMP95465_SIGMA_DECAY_NO_ESCAPE.verdict) &&
      /refereed bound is changed/i.test(IMP95465_SIGMA_DECAY_NO_ESCAPE.verdict),
  },
];

for (const a of IMP95465_SIGMA_DECAY_NO_ESCAPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95465-sigma-decay-no-escape-from-en-nonvanishing assertion failed: ${a.id}`);
  }
}
