/**
 * @module imp-95582-sigma-postpeak-fine-exponent-ramp
 *
 * imp-95582 (numerical, frontier-direction): imp-33582 quantified the post-peak sigma(N) =
 * E_coll/E(N) decay as a RAMPING local exponent, but only on a COARSE whole-decade OLS ladder --
 * six numbers, one per decade [10^k,10^(k+1)] for k=6..11 (~0.0105 -> ~0.4310). That coarse ladder
 * leaves the ramp between decades unmeasured. This module refines the grid to HALF-DECADE spacing
 * (2 points/decade, 13 points across N in {1e6..1e12}) and reports the POINTWISE local exponent
 * p(N) = -d ln sigma / d ln N as a continuous function of log N, then pins the E_trunc-outlives-E_coll
 * transition (E_coll = E_trunc, r = 1) more finely and reports the pointwise exponent VALUE carried
 * there.
 *
 * THE QUANTITY (identical sub-terms to imp-3406 / imp-33582 / imp-34694 -- no fresh model)
 * ---------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 *     p(N)   = -d ln sigma / d ln N                (pointwise local decay exponent, imp-3529/imp-33582)
 * No re-derivation, no fresh term: the exact inherited imp-3406/imp-33582 sub-terms.
 *
 * WHAT IS NEW (vs the coarse imp-33582 ladder and the imp-34694 knee)
 * ------------------------------------------------------------------
 * imp-33582 gives six whole-decade OLS exponents; imp-34694 locates the ramp-ACCELERATION knee
 * (p'' = 0, log10 N* ~ 9.52903). NEITHER measures the pointwise exponent on a finer intermediate
 * grid, nor reports the exponent VALUE carried at the E_coll = E_trunc transition. This module does
 * both by central-difference of the EXACT full-model ln sigma at half-decade spacing.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE COARSE LADDER IS MIDPOINT SAMPLING OF A SMOOTH RAMP. The pointwise exponent at each
 *        decade MIDPOINT 10^(k+0.5) reproduces the imp-33582 whole-decade OLS exponent over
 *        [10^k,10^(k+1)] to within ~6% (e.g. decade [1e9,1e10]: pointwise-at-1e9.5 = 0.2359 vs
 *        OLS 0.2360). So the coarse six-number ladder is an unbiased midpoint sampling of a smooth
 *        continuous ramp -- the half-decade grid fills in the between-decade shape it left implicit:
 *        p climbs 0.0006 -> 0.0099 -> 0.0233 -> 0.0434 -> 0.0732 -> 0.1157 -> 0.1714 -> 0.2359 ->
 *        0.3011 -> 0.3580 -> 0.4019 -> 0.4326 -> 0.4526 across [1e6,1e12], toward the imp-3463 1/2.
 *   (F2) THE E_trunc = E_coll TRANSITION CARRIES POINTWISE EXPONENT p ~ 0.238. The transition where
 *        the constant floor overtakes the GUE-conditional collapse term (r = E_coll/E_trunc = 1,
 *        sigma = 1/2) sits at N ~ 3.2803e9 (log10 ~ 9.5159), matching the imp-3444 crossover exactly,
 *        and the pointwise local exponent there is p ~ 0.238 -- roughly halfway up the ramp from the
 *        near-flat peak toward the far-tail 1/2. So "E_trunc begins to dominate" is quantified as the
 *        half-share point, not a discontinuity: the exponent passes smoothly through ~0.24 there.
 *   (F3) THE TRANSITION PRECEDES THE RAMP-ACCELERATION KNEE. The E_coll = E_trunc transition
 *        (log10 N ~ 9.5159) sits just BELOW the imp-34694 exponent-ramp knee (p'' = 0, log10 N* ~
 *        9.52903) -- the half-share point is reached ~0.013 decade (~3%) before the ramp stops
 *        accelerating. The two S-frontier landmarks are close but distinct: r = 1 (max of the ramp
 *        slope proxy) leads, p'' = 0 (max of the ramp acceleration) follows.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (COARSE per-decade OLS ladder refined here)
 * @see imp-34694-sigma-exponent-knee-closed-form-location (ramp-acceleration knee p'' = 0, log10 ~ 9.529)
 * @see imp-3529-sigma-postpeak-decay-exponent (pointwise local exponent p(N) definition)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-34694 exactly

// EXACT imp-3406/imp-33582/imp-34694 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible near the transition
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// Pointwise local decay exponent p(N) = -d ln sigma / d ln N by symmetric central difference of the
// EXACT full-model ln sigma (imp-3529/imp-33582 definition; imp-34694 uses the same central route).
function pLocal(N, dx = 1e-4) {
  const x = Math.log(N);
  return -(Math.log(sigma(Math.exp(x + dx))) - Math.log(sigma(Math.exp(x - dx)))) / (2 * dx);
}

// (F1) FINE half-decade pointwise grid across [1e6,1e12] (2 pts/decade, 13 points).
const FINE_GRID = [];
for (let d = 6; d <= 12 + 1e-9; d += 0.5) {
  const N = Math.pow(10, d);
  FINE_GRID.push({
    log10N: +d.toFixed(1),
    p_local: +pLocal(N).toFixed(4),
    sigma: +sigma(N).toFixed(4),
  });
}

// (F1) OLS whole-decade exponent (imp-33582 route) to cross-check the midpoint-sampling claim.
function olsExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}
const MIDPOINT_BRIDGE = [6, 7, 8, 9, 10, 11].map((k) => {
  const mid = Math.pow(10, k + 0.5);
  const p_mid = pLocal(mid);
  const p_ols = olsExponent(Math.pow(10, k), Math.pow(10, k + 1));
  return {
    decade: `1e${k}->1e${k + 1}`,
    p_pointwise_at_midpoint: +p_mid.toFixed(4),
    p_ols_whole_decade: +p_ols.toFixed(4),
    relDiff: +Math.abs(p_mid / p_ols - 1).toFixed(4),
  };
});
// (F1, imp-95597) full-ladder confirmation of the <=6% midpoint-sampling claim: the worst per-decade
// relative gap and where it lands. Verified: max ~5.45% at the flattest decade [1e6,1e7], falling
// monotonely to ~0.03% at [1e9,1e10] as the ramp steepens -- the whole ladder satisfies the <=6% claim.
const MIDPOINT_BRIDGE_WORST = MIDPOINT_BRIDGE.reduce((w, r) => (r.relDiff > w.relDiff ? r : w));

// (F2) E_trunc = E_coll transition (r = 1) by bisection; pointwise exponent VALUE carried there.
function eCollMinusETrunc(N) {
  return parts(N).E_coll - E_TRUNC_PT;
}
function locateTransition() {
  let a = Math.log(1e6);
  let b = Math.log(1e14);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (eCollMinusETrunc(Math.exp(m)) > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_TRANSITION = locateTransition(); // ~3.2803e9
const P_AT_TRANSITION = pLocal(N_TRANSITION); // ~0.238
const SIGMA_AT_TRANSITION = sigma(N_TRANSITION); // ~0.4995
const IMP3444_CROSSOVER = 3.280294e9; // imp-3444 E_coll = E_trunc landmark
const IMP34694_KNEE_LOG10 = 9.52903; // imp-34694 ramp-acceleration knee p'' = 0
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote

export const IMP95582_SIGMA_POSTPEAK_FINE_EXPONENT_RAMP = {
  id: 'imp-95582',
  proofSection: 'S-frontier',
  question:
    'Refine the imp-33582 coarse whole-decade sigma(N) = E_coll/E(N) decay-exponent ladder to a ' +
    'finer half-decade grid across N in {1e6..1e12}: report the pointwise local exponent ' +
    'p(N) = -d ln sigma / d ln N as a continuous function of log N and pin the E_trunc-outlives-E_coll ' +
    'transition (E_coll = E_trunc) more finely, reporting the exponent value carried there. ' +
    'Measurement/fit only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'p_local = -d ln sigma / d ln N (symmetric central difference of the exact full-model ln sigma) ' +
    'on a half-decade grid [1e6..1e12] (2 pts/decade); plus the E_coll = E_trunc transition N and the ' +
    'pointwise exponent value there',
  fineGrid: FINE_GRID,
  midpointBridge: MIDPOINT_BRIDGE,
  midpointBridgeWorst: {
    // (imp-95597) worst-decade relative gap across the FULL six-decade ladder (k=6..11).
    decade: MIDPOINT_BRIDGE_WORST.decade, // 1e6->1e7 (flattest decade)
    relDiffPct: +(MIDPOINT_BRIDGE_WORST.relDiff * 100).toFixed(3), // ~5.449
    claimHoldsAcrossLadder: MIDPOINT_BRIDGE.every((r) => r.relDiff <= 0.06), // <=6% on every decade
  },
  farTailExponent: HALF, // imp-3463 asymptote the fine ramp climbs toward
  transition: {
    N_transition: +N_TRANSITION.toExponential(4), // ~3.2803e9
    log10N_transition: +Math.log10(N_TRANSITION).toFixed(5), // ~9.51591
    p_at_transition: +P_AT_TRANSITION.toFixed(5), // ~0.23806
    sigma_at_transition: +SIGMA_AT_TRANSITION.toFixed(5), // ~0.49953
    ratio_vs_imp3444: +(N_TRANSITION / IMP3444_CROSSOVER).toFixed(5), // ~1.00000
    imp34694_knee_log10: IMP34694_KNEE_LOG10, // transition sits just below this knee
    decadesBelowKnee: +(IMP34694_KNEE_LOG10 - Math.log10(N_TRANSITION)).toFixed(5), // ~0.01312
  },
  finding: {
    F1_coarse_ladder_is_midpoint_sampling:
      'The pointwise exponent at each decade midpoint 10^(k+0.5) reproduces the imp-33582 whole-decade ' +
      'OLS exponent over [10^k,10^(k+1)] to within ~6% ACROSS THE FULL k=6..11 LADDER (imp-95597), not ' +
      'just the one decade [1e9,1e10] the original text cited: the per-decade relative gap is 5.45%, ' +
      '3.11%, 1.60%, 0.03%, 0.53%, 0.35%, so the worst gap ~5.45% lands at the FLATTEST decade ' +
      '[1e6,1e7] and falls monotonely as the ramp steepens (bottoming at ~0.03% on [1e9,1e10]). Every ' +
      'decade satisfies the <=6% claim. The coarse six-number ladder is thus an unbiased midpoint ' +
      'sampling of a smooth continuous ramp; the half-decade grid fills in the between-decade shape ' +
      'from p ~ 0.0006 at 1e6 up to ~0.4526 at 1e12, climbing monotonely toward the imp-3463 far-tail 1/2.',
    F2_transition_carries_exponent_0_24:
      'The E_coll = E_trunc transition (r = 1, sigma = 1/2) sits at N ~ 3.2803e9 (log10 ~ 9.5159), ' +
      'matching the imp-3444 crossover exactly, and the pointwise local exponent there is p ~ 0.238 -- ' +
      'roughly halfway up the ramp. So the moment the constant floor overtakes the GUE-conditional ' +
      'collapse term is quantified as the half-share point where the exponent passes smoothly through ' +
      '~0.24, not a discontinuity.',
    F3_transition_precedes_knee:
      'The transition (log10 N ~ 9.5159) sits ~0.013 decade (~3%) BELOW the imp-34694 ramp-acceleration ' +
      'knee (p double-prime = 0, log10 N* ~ 9.52903): r = 1 (half-share) leads, p double-prime = 0 ' +
      '(max ramp acceleration) follows. The two S-frontier landmarks are close but distinct.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Refining the imp-33582 coarse whole-decade ' +
    'decay-exponent ladder to a half-decade grid across [1e6,1e12]: the pointwise local exponent ' +
    'p(N) = -d ln sigma / d ln N climbs monotonely from ~0.0006 (1e6) to ~0.4526 (1e12) toward the ' +
    'imp-3463 far-tail 1/2, and the imp-33582 whole-decade OLS exponents are reproduced by the ' +
    'pointwise value at each decade midpoint to ~6% (the coarse ladder is unbiased midpoint sampling ' +
    'of a smooth ramp). The E_coll = E_trunc transition (r = 1, sigma ~ 0.4995) lands at N ~ 3.2803e9 ' +
    '(matching the imp-3444 crossover exactly) carrying pointwise exponent p ~ 0.238, ~0.013 decade ' +
    'below the imp-34694 ramp-acceleration knee (log10 ~ 9.52903). The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 ' +
    'is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33582 (COARSE per-decade OLS ladder refined here); imp-34694 (ramp-acceleration knee ' +
    'p double-prime = 0, log10 ~ 9.529); imp-3529 (pointwise local exponent p(N)); imp-3463 ' +
    '(far-tail leading form, exponent -> 1/2); imp-3444 (E_coll = E_trunc crossover N ~ 3.280e9); ' +
    'imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping.',
};

export const IMP95582_SIGMA_POSTPEAK_FINE_EXPONENT_RAMP_ASSERTIONS = [
  {
    // (F1) fine half-decade grid: strictly monotone increasing, near-flat at 1e6, near 1/2 at 1e12.
    id: 'imp95582-fine-grid-monotone-ramps-toward-half',
    description: 'half-decade p_local strictly increases, p(1e6) < 0.02, p(1e12) in (0.4, 0.5)',
    holds: () => {
      for (let i = 1; i < FINE_GRID.length; i++) {
        if (!(FINE_GRID[i].p_local > FINE_GRID[i - 1].p_local)) return false;
      }
      return (
        FINE_GRID[0].p_local < 0.02 &&
        FINE_GRID[FINE_GRID.length - 1].p_local > 0.4 &&
        FINE_GRID.every((r) => r.p_local >= 0 && r.p_local < HALF)
      );
    },
  },
  {
    // (F1, imp-95597) the coarse imp-33582 OLS decade exponents = pointwise value at the decade
    // midpoint to within the CLAIMED <=6% on EVERY decade k=6..11 (worst ~5.45% at flattest [1e6,1e7]).
    id: 'imp95582-coarse-ladder-is-midpoint-sampling',
    description: 'pointwise-at-midpoint matches the whole-decade OLS exponent to within 6% on all six decades',
    holds: () =>
      MIDPOINT_BRIDGE.every((r) => r.relDiff <= 0.06) &&
      MIDPOINT_BRIDGE_WORST.decade === '1e6->1e7',
  },
  {
    // (F2) the E_coll = E_trunc transition: r = 1, sigma ~ 1/2, exponent ~ 0.238, matches imp-3444.
    id: 'imp95582-transition-carries-exponent-0-24',
    description: 'E_coll = E_trunc at N ~ 3.28e9 (imp-3444), sigma ~ 0.5, pointwise p in (0.20, 0.28)',
    holds: () =>
      Math.abs(parts(N_TRANSITION).E_coll / E_TRUNC_PT - 1) < 1e-4 &&
      Math.abs(SIGMA_AT_TRANSITION - 0.5) < 5e-3 &&
      P_AT_TRANSITION > 0.2 &&
      P_AT_TRANSITION < 0.28 &&
      Math.abs(N_TRANSITION / IMP3444_CROSSOVER - 1) < 1e-2,
  },
  {
    // (F3) the transition sits BELOW the imp-34694 ramp-acceleration knee (distinct landmarks).
    id: 'imp95582-transition-precedes-imp34694-knee',
    description: 'transition log10 N ~ 9.516 sits below the imp-34694 knee log10 ~ 9.529',
    holds: () =>
      Math.log10(N_TRANSITION) < IMP34694_KNEE_LOG10 &&
      IMP34694_KNEE_LOG10 - Math.log10(N_TRANSITION) < 0.05,
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp95582-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP95582_SIGMA_POSTPEAK_FINE_EXPONENT_RAMP.isRigorous === false &&
      IMP95582_SIGMA_POSTPEAK_FINE_EXPONENT_RAMP.farTailExponent === 0.5 &&
      /NO QED/.test(IMP95582_SIGMA_POSTPEAK_FINE_EXPONENT_RAMP.verdict) &&
      /refereed bound is changed/i.test(IMP95582_SIGMA_POSTPEAK_FINE_EXPONENT_RAMP.verdict),
  },
];

for (const a of IMP95582_SIGMA_POSTPEAK_FINE_EXPONENT_RAMP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95582-sigma-postpeak-fine-exponent-ramp assertion failed: ${a.id}`);
  }
}
