/**
 * @module imp-35802-cancellation-free-ratio-beyond-1e18
 *
 * imp-35766 (B3) flagged that the Krawczyk surplus-split ratio R = -dFP/dG, computed the naive way with
 * dG = S_inf (M_G - 1), diverges SPURIOUSLY upward beyond N ~ 1e18 (2.00043 at 1e19, 2.00058 at 1e20) as the
 * near-equal subtraction M_G - 1 ~ -a/2 -> 0 loses all significance to double-precision cancellation. It
 * attributed the upturn to machine-epsilon noise but never recomputed R at those rungs in a cancellation-free
 * way to confirm the -a/2 vs a balance shows no genuine break. This module does exactly that at the
 * N ~ 1e19..1e22 rungs using the algebraically-simplified, subtraction-free ratio
 *
 *   R(N) = 2 . (aLo/a) . (1 - a) / (1 - aLo)        (dG and M_G cancel; no (M_G - 1) subtraction)
 *
 * derived in imp-35766: dG = S_inf . (-a/(2-a)) and dFP = S_inf . M_G . aLo/(1-aLo) with M_G = 2(1-a)/(2-a),
 * so -dFP/dG collapses to the ratio above. Every quantity is O(1)-conditioned: aLo/a is a division of two
 * same-order tiny numbers (~1), and 1-a, 1-aLo are ~1, so there is NO catastrophic cancellation at any N.
 *
 * WHAT THE CANCELLATION-FREE RECOMPUTATION FINDS AT N ~ 1e19..1e22
 * ---------------------------------------------------------------
 *   (C1) THE CLEAN FORM IS RELIABLE THROUGH 1e22 AND MATCHES THE CLOSED-FORM MODEL EXACTLY. R_clean tracks the
 *        imp-35766 model R - 2 = 2 eps/(1-a) (eps = aLo/a - 1) to the machine floor at every rung 1e19..1e22 --
 *        dev = R_clean - 2 vs 2 eps/(1-a) agree to < 1e-9 relative -- so the clean channel carries no artifact.
 *   (C2) THE NAIVE dG = S_inf(M_G-1) FORM IS PURE FLOAT NOISE PAST 1e20, NOT A GENTLE UPTURN. Recomputed the
 *        naive way, R does not merely drift up (2.000434 at 1e19, 2.000578 at 1e20): it COLLAPSES to garbage --
 *        R_naive = 2.000000000 at 1e21 (|dG| ~ 1.9e-10 rounds so the ratio degenerates) and R_naive = 2.028985507
 *        at 1e22 (|dG| ~ 1.9e-11, non-monotone nonsense). This definitively confirms the imp-35766 (B3) reading:
 *        the "deviation from 2" beyond 1e18 is a double-precision cancellation artifact, not a real break.
 *   (C3) HONEST CORRECTION TO THE "MONOTONE DESCENT TOWARD 2" PREMISE. The ticket asked to confirm R "continues
 *        the monotone descent toward 2." The clean recomputation shows it does NOT. The descent imp-35766 saw
 *        from band-top (R-2 ~ 4.170e-4) to the PT anchor (R-2 ~ 3.995e-4) was driven by the 1/(1-a) amplification
 *        relaxing toward 1; that factor is essentially spent by a ~ 1.5e-7 (N ~ 1e15). BEYOND the PT anchor R-2
 *        PLATEAUS at the frozen O(delta) floor and drifts imperceptibly UPWARD (dev 3.99532e-4 at the PT anchor
 *        -> 3.99898e-4 at 1e22, a total drift of ~+3.7e-8 across ~9 decades) as eps creeps toward its asymptote.
 *        The a -> 0 limit of R is 2 + 2 eps_inf ~ 2.0004, NOT 2. So there is NO genuine break (the naive garbage
 *        is float noise) and ALSO no descent to 2 at large N: the true behavior is a frozen ~2.0004 plateau. This
 *        does not contradict the imp-35766 model -- it makes the model s a -> 0 limit explicit.
 *
 * CONSEQUENCE: the imp-35766 (B3) attribution is confirmed and sharpened. The cancellation-free R shows the
 * leading-order -a/2 vs a balance never breaks up to N ~ 1e22; the naive upturn/blowup is entirely a
 * double-precision cancellation artifact in dG; and the large-N asymptote of R is the frozen O(delta) floor
 * ~2.0004, not 2.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; reuses the imp-35266/imp-35766/imp-34996
 * machinery (identical K, delta, S_inf, aOf). The imp-34714a machine certificate REMAINS OPEN; F(m) = 0 stays a
 * double-precision artifact; C_C = 1/8 (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 UNTOUCHED;
 * changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35766-krawczyk-cancellation-ratio-beyond-band (B3 flagged the spurious upturn beyond N ~ 1e18)
 * @see imp-35810-cancellation-onset-height (pinned the float-cancellation onset at N ~ 6.3e18)
 * @see imp-35855-rclean-interval-de-cancellation-assessment (R_direct de-cancellation demo)
 * @see imp-35266-krawczyk-headroom-surplus-decomposition (the 2:1 split -dFP/dG ~ 2.00042, in-band)
 * @see lambda-rh-height-mapping (effectiveHeightForN RvM inverse; zeroCountAtHeight forward N(T))
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35266/imp-35766)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)
const T_PT = 3e12; // Platt-Trudgian verified-zero anchor height

const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};
const N_PT = zeroCountAtHeight(T_PT); // ~1.2362e13 zeros below T_PT = 3e12

// The subtraction-free, O(1)-conditioned ratio R(N) = 2 (aLo/a)(1-a)/(1-aLo), plus the closed-form model
// R - 2 = 2 eps/(1-a) and the naive dG = S_inf(M_G-1) recomputation for the cancellation contrast.
function ratioAt(N) {
  const a = aOf(N);
  const aLo = aOf(N * (1 - DELTA));
  const eps = aLo / a - 1; // fractional shift of the contraction factor across delta (an O(delta) quantity)
  const clean = 2 * (aLo / a) * (1 - a) / (1 - aLo); // cancellation-free exact ratio
  const devClean = clean - 2;
  const devModel = (2 * eps) / (1 - a); // closed-form model of R - 2
  // Naive recomputation with the (M_G - 1) subtraction that loses significance as a -> 0 (imp-35766 channel).
  const G = 1 - a;
  const M_G = (2 * G) / (1 + G);
  const M_FP = 1 / (1 - aLo);
  const dG = S_INF * (M_G - 1);
  const dFP = S_INF * M_G * (M_FP - 1);
  const naive = -dFP / dG;
  return { N, a, eps, clean, devClean, devModel, naive, dG };
}

const RUNGS = [1e19, 1e20, 1e21, 1e22].map(ratioAt);
const R_PT = ratioAt(N_PT);
const R_1E15 = ratioAt(1e15);

// (C1) The clean form matches the closed-form model 2 eps/(1-a) to the machine floor at every 1e19..1e22 rung.
const CLEAN_MATCHES_MODEL = RUNGS.every(
  (r) => Math.abs(r.devClean - r.devModel) / r.devClean < 1e-9,
);
// (C2) The naive dG = S_inf(M_G-1) form is non-monotone float garbage past 1e18: it shows the imp-35766 spurious
// upturn at 1e19/1e20, then a degenerate collapse to EXACTLY 2.0 at 1e21 (|dG| ~ 1.9e-10 rounds so the ratio
// degenerates) and a blowup to ~2.029 at 1e22 -- a non-monotone signature no smooth real ratio could have.
const R_1E19 = RUNGS[0];
const R_1E20 = RUNGS[1];
const R_1E21 = RUNGS[2];
const R_1E22 = RUNGS[3];
const NAIVE_UPTURN_1E19_1E20 =
  R_1E19.naive > R_1E19.clean + 3e-5 && R_1E20.naive > R_1E19.naive; // reproduces 2.00043 -> 2.00058
const NAIVE_COLLAPSE_1E21 = Math.abs(R_1E21.naive - 2.0) < 1e-9; // degenerate collapse to exactly 2.0
const NAIVE_BLOWUP_1E22 = Math.abs(R_1E22.naive - R_1E22.clean) > 1e-2; // 2.028985507 vs ~2.0003999
const NAIVE_GARBAGE_PAST_1E20 = NAIVE_COLLAPSE_1E21 && NAIVE_BLOWUP_1E22;
// The clean R stays pinned near 2.0004 across ALL of 1e19..1e22 -- no break in the -a/2 vs a balance.
const CLEAN_NO_BREAK = RUNGS.every((r) => r.clean > 2.0003 && r.clean < 2.0005);
// (C3) Honest correction: beyond the PT anchor R does NOT descend to 2 -- it plateaus and drifts slightly UP.
const DEV_RISES_NOT_DESCENDS = R_1E22.devClean > R_PT.devClean && R_PT.devClean > 0;
const DRIFT_PT_TO_1E22 = R_1E22.devClean - R_PT.devClean; // ~+3.7e-8 (frozen O(delta) plateau, not a descent)
const PLATEAU_IS_FROZEN = DRIFT_PT_TO_1E22 > 0 && DRIFT_PT_TO_1E22 < 1e-6;

export const IMP35802_CANCELLATION_FREE_RATIO_BEYOND_1E18 = {
  id: 'imp-35802',
  proofSection: 'S-frontier',
  question:
    'imp-35766 (B3) flagged the Krawczyk surplus-split ratio R = -dFP/dG, computed with dG = S_inf(M_G-1), as ' +
    'diverging SPURIOUSLY upward beyond N ~ 1e18 (2.00043 at 1e19, 2.00058 at 1e20) from double-precision ' +
    'cancellation as M_G - 1 ~ -a/2 -> 0, but never recomputed R at those rungs cancellation-free. Recompute R at ' +
    'N ~ 1e19..1e22 via the subtraction-free R(N) = 2 (aLo/a)(1-a)/(1-aLo) and confirm the exact ratio shows no ' +
    'genuine break in the -a/2 vs a balance. Measurement only; surrogate; imp-34714a stays OPEN; NO QED.',
  finding:
    'The cancellation-free R(N) = 2 (aLo/a)(1-a)/(1-aLo) is O(1)-conditioned (aLo/a divides same-order tiny ' +
    'numbers ~1; 1-a, 1-aLo ~ 1) so it stays reliable through N ~ 1e22, matching the imp-35766 model R - 2 = ' +
    '2 eps/(1-a) to the machine floor at every rung. Recomputed the NAIVE way, R does not merely drift up: it ' +
    'COLLAPSES to garbage past 1e20 -- R_naive = 2.000000000 at 1e21 (|dG| ~ 1.9e-10) and 2.028985507 at 1e22 ' +
    '(|dG| ~ 1.9e-11) -- confirming the (B3) upturn is a pure double-precision cancellation artifact in dG, not a ' +
    'real break; the clean R stays pinned at ~2.0004 across all of 1e19..1e22. HONEST CORRECTION to the ticket ' +
    'premise: the clean R does NOT continue a monotone descent toward 2. The descent imp-35766 saw from band-top ' +
    '(R-2 ~ 4.170e-4) to the PT anchor (R-2 ~ 3.995e-4) was the 1/(1-a) amplification relaxing to 1, essentially ' +
    'spent by a ~ 1.5e-7 (N ~ 1e15). Beyond the PT anchor R-2 PLATEAUS at the frozen O(delta) floor and drifts ' +
    'imperceptibly UPWARD (3.99532e-4 at the anchor -> 3.99898e-4 at 1e22, ~+3.7e-8 across ~9 decades) as eps ' +
    'creeps toward its asymptote: the a -> 0 limit of R is 2 + 2 eps_inf ~ 2.0004, NOT 2. So no genuine break AND ' +
    'no descent to 2 -- a frozen ~2.0004 plateau. EVIDENCE / measurement, NOT a machine certificate.',
  constants: {
    N_at_PT_anchor: +N_PT.toPrecision(15),
    T_PT,
    delta: DELTA,
    S_inf_floor: S_INF,
    K_amplitude: +K_AMPL.toPrecision(10),
  },
  measurement: {
    R_clean_1e19: +RUNGS[0].clean.toFixed(10), // ~2.0003998310
    R_clean_1e20: +RUNGS[1].clean.toFixed(10), // ~2.0003998567
    R_clean_1e21: +RUNGS[2].clean.toFixed(10), // ~2.0003998787
    R_clean_1e22: +RUNGS[3].clean.toFixed(10), // ~2.0003998976
    R_naive_1e19: +RUNGS[0].naive.toFixed(9), // ~2.000434399 (spurious upturn begins)
    R_naive_1e20: +RUNGS[1].naive.toFixed(9), // ~2.000578453 (spurious upturn grows)
    R_naive_1e21: +RUNGS[2].naive.toFixed(9), // ~2.000000000 (cancellation collapse)
    R_naive_1e22: +RUNGS[3].naive.toFixed(9), // ~2.028985507 (non-monotone garbage)
    dev_clean_at_PT_anchor: +R_PT.devClean.toExponential(5), // ~3.99532e-4
    dev_clean_1e22: +R_1E22.devClean.toExponential(5), // ~3.99898e-4
    drift_PT_to_1e22: +DRIFT_PT_TO_1E22.toExponential(3), // ~+3.7e-8 (frozen plateau, upward not a descent)
    clean_matches_model: CLEAN_MATCHES_MODEL, // true (clean R = 2 eps/(1-a) model to machine floor)
    naive_upturn_1e19_1e20: NAIVE_UPTURN_1E19_1E20, // true (reproduces the imp-35766 2.00043 -> 2.00058 upturn)
    naive_garbage_past_1e20: NAIVE_GARBAGE_PAST_1E20, // true (collapse to 2.0 at 1e21, blowup at 1e22; artifact)
    clean_no_break: CLEAN_NO_BREAK, // true (clean R in [2.0003,2.0005] across 1e19..1e22)
    dev_rises_not_descends: DEV_RISES_NOT_DESCENDS, // true (R-2 rises slightly, does NOT descend to 2)
  },
  subGap:
    'imp-34714a REMAINS OPEN. Recomputing R cancellation-free at N ~ 1e19..1e22 confirms the (B3) naive upturn is a ' +
    'double-precision artifact and that the -a/2 vs a balance never breaks, but it rests on the gamma(n)/k eps ' +
    'surrogate models of the imp-34687a directed-rounding layer, NOT that layer: it does not prove a directed-' +
    'rounding [g](m)/[F-prime] evaluation yields valid enclosures, and F(m) = 0 remains a double-precision ' +
    'artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'CANCELLATION-FREE KRAWCZYK RATIO AT N ~ 1e19..1e22, MEASURED (frontier, NOT an RH bound). The ticket asked ' +
    'to recompute the imp-35766 surplus-split ratio R = -dFP/dG beyond N ~ 1e18 via the subtraction-free ' +
    'R(N) = 2 (aLo/a)(1-a)/(1-aLo) and confirm the imp-35766 (B3) upturn is float noise, not a real break. RESULT: ' +
    'the clean form is O(1)-conditioned and reliable through 1e22, matching the model R - 2 = 2 eps/(1-a) to the ' +
    'machine floor; the naive dG = S_inf(M_G-1) form collapses to garbage past 1e20 (2.000000000 at 1e21, ' +
    '2.028985507 at 1e22), confirming (B3): the upturn is a double-precision cancellation artifact, and the clean ' +
    'R stays pinned at ~2.0004 with NO break in the -a/2 vs a balance. HONEST CORRECTION: R does NOT descend to 2 ' +
    'beyond the PT anchor -- the band-top->PT descent was the 1/(1-a) factor, spent by a ~ 1.5e-7; beyond, R-2 ' +
    'plateaus at the frozen O(delta) floor and drifts imperceptibly UP (~+3.7e-8 over ~9 decades) as eps -> its ' +
    'asymptote, so the a -> 0 limit is 2 + 2 eps_inf ~ 2.0004, not 2. EVIDENCE, NOT a machine certificate. ' +
    'SUB-GAP imp-34714a REMAINS OPEN: rests on the gamma(n)/k eps surrogate models, not the imp-34687a directed-' +
    'rounding layer, and F(m) = 0 remains a double-precision artifact. Measurement only on the inherited ' +
    'imp-3220/imp-3406 surrogate; reuses the imp-35266/imp-35766/imp-34996 machinery (identical K, delta, S_inf, ' +
    'aOf); the C_C 1/8 ansatz (imp-2642/2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35766 (B3 spurious upturn beyond N ~ 1e18; the algebraic collapse R = 2 (aLo/a)(1-a)/(1-aLo)); ' +
    'imp-35810 (float-cancellation onset ~ 6.3e18); imp-35855 (R_direct de-cancellation demo); imp-35266 ' +
    '(2:1 split -dFP/dG ~ 2.00042 in-band); imp-34996 (S_inf = 1/(2 delta) floor); imp-2642 (C_C 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse; zeroCountAtHeight forward N(T)). Recomputation of ' +
    'a rational ratio in a cancellation-free form + small-parameter expansion: standard.',
};

export const IMP35802_CANCELLATION_FREE_RATIO_BEYOND_1E18_ASSERTIONS = [
  {
    // (C1) The clean form matches the closed-form model 2 eps/(1-a) to the machine floor at every 1e19..1e22 rung.
    id: 'imp35802-clean-matches-model-through-1e22',
    description: 'cancellation-free R = 2 (aLo/a)(1-a)/(1-aLo) matches the model R-2 = 2 eps/(1-a) to <1e-9 rel at 1e19..1e22',
    holds: () => CLEAN_MATCHES_MODEL === true,
  },
  {
    // (C2) The naive dG = S_inf(M_G-1) form is non-monotone float garbage past 1e18 -- confirms the (B3) artifact.
    id: 'imp35802-naive-collapses-past-1e20',
    description: 'naive dG = S_inf(M_G-1) form: upturn 2.00043->2.00058 at 1e19/1e20, collapse to 2.0 at 1e21, 2.028985507 at 1e22 (float cancellation, not a break)',
    holds: () =>
      NAIVE_UPTURN_1E19_1E20 === true &&
      NAIVE_GARBAGE_PAST_1E20 === true &&
      Math.abs(R_1E22.naive - 2.028985507) < 1e-6,
  },
  {
    // The clean ratio shows NO genuine break: R stays pinned near 2.0004 across all of 1e19..1e22.
    id: 'imp35802-clean-no-break-1e19-to-1e22',
    description: 'cancellation-free R stays in [2.0003,2.0005] across 1e19..1e22 (the -a/2 vs a balance does not break)',
    holds: () => CLEAN_NO_BREAK === true,
  },
  {
    // (C3) Honest correction: beyond the PT anchor R does NOT descend to 2 -- it plateaus and drifts slightly UP.
    id: 'imp35802-plateau-not-descent-to-2',
    description: 'beyond the PT anchor R-2 rises slightly (frozen O(delta) plateau ~2.0004, drift ~+3.7e-8 over ~9 decades), not a descent to 2',
    holds: () => DEV_RISES_NOT_DESCENDS === true && PLATEAU_IS_FROZEN === true,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35802-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35802_CANCELLATION_FREE_RATIO_BEYOND_1E18.isRigorous === false &&
      /imp-34714a/.test(IMP35802_CANCELLATION_FREE_RATIO_BEYOND_1E18.subGap) &&
      /REMAINS OPEN/.test(IMP35802_CANCELLATION_FREE_RATIO_BEYOND_1E18.subGap) &&
      /NO QED/.test(IMP35802_CANCELLATION_FREE_RATIO_BEYOND_1E18.verdict) &&
      /refereed bound is changed/i.test(IMP35802_CANCELLATION_FREE_RATIO_BEYOND_1E18.verdict),
  },
];

for (const a of IMP35802_CANCELLATION_FREE_RATIO_BEYOND_1E18_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35802-cancellation-free-ratio-beyond-1e18 assertion failed: ${a.id}`);
  }
}
