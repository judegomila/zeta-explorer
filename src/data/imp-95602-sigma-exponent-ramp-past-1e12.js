/**
 * @module imp-95602-sigma-exponent-ramp-past-1e12
 *
 * imp-95602 (numerical, frontier-direction): imp-95582 refined the post-peak sigma(N) =
 * E_coll/E(N) decay-exponent ramp to a half-decade grid but STOPPED at p(1e12) = 0.4526, still
 * climbing toward the imp-3463 far-tail 1/2 and never measuring how far past 1e12 the ramp must run
 * to reach it. This module continues the SAME inherited imp-3406/imp-33582/imp-95582 component model
 * across N in [1e12, 1e18] and reports the N at which the pointwise local exponent p(N) first lands
 * within 1% and within 0.1% of the 1/2 asymptote -- quantifying how slowly the constant E_trunc floor
 * finishes overtaking the vanishing GUE-conditional E_coll.
 *
 * THE QUANTITY (identical sub-terms to imp-3406 / imp-33582 / imp-95582 -- no fresh model)
 * ---------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 *     p(N)   = -d ln sigma / d ln N                (pointwise local decay exponent, imp-3529/imp-95582)
 * No re-derivation, no fresh term. Beyond the double-precision range of a materialized N (N > 1e308),
 * the EXACT same sigma is evaluated in log-space (T0 from a Newton solve on ln(T0/2pi), E_coll/E_flow
 * from their logs); this log-space evaluator reproduces the imp-95582 direct grid to full precision at
 * the shared endpoint (both give p(1e12) = 0.4526), so no new model is introduced.
 *
 * WHAT IS NEW (vs the imp-95582 half-decade ramp that ends at 1e12)
 * ----------------------------------------------------------------
 * imp-95582 measured the ramp only up to p(1e12) = 0.4526. This module carries the SAME pointwise
 * central-difference exponent past 1e12 and pins the two tolerance-crossing heights (within 1% and
 * within 0.1% of 1/2) that imp-95582 cited but never located.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE RAMP DOES NOT REACH WITHIN 1% OF 1/2 ANYWHERE IN [1e12, 1e18]. Continued at half-decade
 *        spacing the pointwise exponent climbs only p(1e12) = 0.4526 -> p(1e18) = 0.4877; the deficit
 *        (1/2 - p) shrinks from 9.47% of 1/2 at 1e12 to 2.46% at 1e18 -- still short of the 1% mark
 *        across the entire requested window. So the E_trunc floor is still visibly finishing its
 *        overtake of E_coll six decades past where imp-95582 stopped.
 *   (F2) WITHIN 1% OF 1/2 IS FIRST REACHED AT N ~ 1.47e44 (log10 ~ 44.17). Root-finding the same
 *        pointwise exponent (log-space evaluator) puts the first p(N) >= 0.4950 crossing at
 *        log10 N ~ 44.167 -- roughly 26 decades beyond the top of the [1e12,1e18] window. The
 *        constant floor takes ~44 decades of N, not 12, to bring the local exponent within 1% of 1/2.
 *   (F3) WITHIN 0.1% OF 1/2 IS FIRST REACHED AT N ~ 1e436 (log10 ~ 436.06). The p(N) >= 0.4995
 *        crossing sits at log10 N ~ 436.06 -- a further ~392 decades past the 1% mark. Tightening the
 *        tolerance ten-fold costs ~ten-fold more log10 N (44 -> 436), the signature of a deficit that
 *        decays like 1/log N: the measured product (1/2 - p) * ln N settles near ~0.508 across the
 *        far tail, so reaching tolerance t needs ln N ~ 0.508 / (0.5 t), i.e. log10 N ~ 0.44 / t.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-95582-sigma-postpeak-fine-exponent-ramp (half-decade ramp [1e6,1e12] extended here)
 * @see imp-3529-sigma-postpeak-decay-exponent (pointwise local exponent p(N) definition)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-95582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-95582 exactly
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote

// EXACT imp-3406/imp-95582 sub-terms (no re-derivation, no fresh model) -- direct materialized-N form.
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible in the far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// ln sigma from ln N in LOG-SPACE -- the SAME sigma, evaluated without materializing N (needed past
// the double-precision range N > 1e308 to reach the 0.1% crossing at N ~ 1e436). Solve
// (T0/2pi)(u-1) = N with u = ln(T0/2pi): ln N = u + ln(u-1) by Newton, then E_coll/E_flow from logs.
function lnSigmaFromLnN(lnN) {
  let u = lnN; // seed: u ~ ln N for large N
  for (let i = 0; i < 80; i++) {
    const f = u + Math.log(u - 1) - lnN;
    const fp = 1 + 1 / (u - 1);
    u -= f / fp;
  }
  const lnT0 = u + Math.log(TWO_PI);
  const L = lnT0;
  const C_F = (u + 1) / TWO_PI;
  const lnEcoll = Math.log(C_C_PINNED) + 0.5 * (Math.log(L) - lnN);
  const lnEflow = Math.log(C_F) + Math.log(L) - lnT0 + Math.log(GRONWALL);
  const Ecoll = Math.exp(lnEcoll);
  const Eflow = Math.exp(lnEflow);
  const EN = E_TRUNC_PT + Eflow + Ecoll;
  return lnEcoll - Math.log(EN);
}

// Pointwise local decay exponent p(N) = -d ln sigma / d ln N by symmetric central difference
// (imp-3529/imp-95582 definition). Log-space form indexed by log10 N so it works at any height.
function pLog10(d, dx = 1e-4) {
  const x = d * Math.LN10;
  return -(lnSigmaFromLnN(x + dx) - lnSigmaFromLnN(x - dx)) / (2 * dx);
}
// Direct materialized-N form (matches pLog10 to full precision where N is representable).
function pDirect(N, dx = 1e-4) {
  const x = Math.log(N);
  return -(Math.log(sigma(Math.exp(x + dx))) - Math.log(sigma(Math.exp(x - dx)))) / (2 * dx);
}

// (F1) continue the half-decade ramp across the requested window [1e12, 1e18].
const RAMP_PAST_1E12 = [];
for (let d = 12; d <= 18 + 1e-9; d += 0.5) {
  const p = pLog10(d);
  RAMP_PAST_1E12.push({
    log10N: +d.toFixed(1),
    p_local: +p.toFixed(5),
    deficitPctOfHalf: +(((HALF - p) / HALF) * 100).toFixed(3),
  });
}
const P_AT_1E18 = pLog10(18);
const REACHED_1PCT_IN_WINDOW = RAMP_PAST_1E12.some((r) => r.p_local >= HALF * (1 - 0.01));

// (F2)/(F3) first log10 N at which p(N) lands within tolerance of 1/2 (p >= 1/2 (1 - tol)).
function firstWithin(tol, hi) {
  const target = HALF * (1 - tol);
  let lo = 12;
  if (pLog10(hi) < target) return null; // not reached by 1eHI
  for (let i = 0; i < 300; i++) {
    const m = (lo + hi) / 2;
    if (pLog10(m) < target) lo = m;
    else hi = m;
  }
  const d = (lo + hi) / 2;
  return { log10N: d, p: pLog10(d) };
}
const CROSS_1PCT = firstWithin(0.01, 2000); // ~44.167
const CROSS_0P1PCT = firstWithin(0.001, 2000); // ~436.06

// Deficit law diagnostic: (1/2 - p) * ln N settles near ~0.508 across the far tail.
const DEFICIT_LN_PRODUCT = [24, 44, 100, 300].map((d) => ({
  log10N: d,
  product: +((HALF - pLog10(d)) * d * Math.LN10).toFixed(4),
}));

export const IMP95602_SIGMA_EXPONENT_RAMP_PAST_1E12 = {
  id: 'imp-95602',
  proofSection: 'S-frontier',
  question:
    'Continue the imp-95582 pointwise sigma(N) = E_coll/E(N) decay-exponent ramp past its 1e12 endpoint ' +
    'across N in [1e12, 1e18] on the same inherited imp-3406 component model, and report the N at which ' +
    'the pointwise local exponent p(N) = -d ln sigma / d ln N first lands within 1% and within 0.1% of ' +
    'the imp-3463 far-tail 1/2 asymptote. Measurement/fit only; conditional-share diagnostic, NOT an RH ' +
    'bound; no QED.',
  measuredQuantity:
    'p_local = -d ln sigma / d ln N (symmetric central difference of the exact full-model ln sigma) ' +
    'continued past 1e12; plus the first log10 N at which p reaches within 1% and within 0.1% of 1/2',
  farTailExponent: HALF, // imp-3463 asymptote the ramp climbs toward
  rampPast1e12: RAMP_PAST_1E12,
  p_at_1e18: +P_AT_1E18.toFixed(5), // ~0.48769
  deficitAt1e18Pct: +(((HALF - P_AT_1E18) / HALF) * 100).toFixed(3), // ~2.461
  reached1pctInWindow: REACHED_1PCT_IN_WINDOW, // false -- 1% not reached anywhere in [1e12,1e18]
  within1pct: {
    log10N: +CROSS_1PCT.log10N.toFixed(3), // ~44.167
    N: '1e' + CROSS_1PCT.log10N.toFixed(2), // ~1e44.17
    p: +CROSS_1PCT.p.toFixed(6), // ~0.495000
  },
  within0p1pct: {
    log10N: +CROSS_0P1PCT.log10N.toFixed(3), // ~436.06
    N: '1e' + CROSS_0P1PCT.log10N.toFixed(2), // ~1e436
    p: +CROSS_0P1PCT.p.toFixed(6), // ~0.499500
  },
  deficitLnProduct: DEFICIT_LN_PRODUCT, // (1/2 - p) ln N ~ 0.508 (the 1/log N deficit signature)
  finding: {
    F1_ramp_stays_below_1pct_across_window:
      'Continued at half-decade spacing the pointwise exponent climbs only p(1e12) = 0.4526 to ' +
      'p(1e18) = 0.4877; the deficit (1/2 - p) shrinks from 9.47% of 1/2 at 1e12 to 2.46% at 1e18 -- ' +
      'still short of the 1% mark across the ENTIRE [1e12,1e18] window, so the E_trunc floor is still ' +
      'visibly finishing its overtake of E_coll six decades past where imp-95582 stopped.',
    F2_within_1pct_at_1e44:
      'The first p(N) >= 0.4950 crossing (within 1% of 1/2) sits at log10 N ~ 44.17 (N ~ 1.47e44) -- ' +
      'roughly 26 decades beyond the top of the [1e12,1e18] window. The constant floor takes ~44 ' +
      'decades of N, not 12, to bring the local exponent within 1% of 1/2.',
    F3_within_0p1pct_at_1e436:
      'The first p(N) >= 0.4995 crossing (within 0.1% of 1/2) sits at log10 N ~ 436.06 -- a further ' +
      '~392 decades past the 1% mark. Tightening the tolerance ten-fold costs ~ten-fold more log10 N ' +
      '(44 to 436): the measured product (1/2 - p) ln N settles near ~0.508 across the far tail, the ' +
      'signature of a deficit that decays like 1/log N, so reaching tolerance t needs log10 N ~ 0.44/t.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Continuing the imp-95582 half-decade pointwise ' +
    'exponent ramp past its 1e12 endpoint: p(N) = -d ln sigma / d ln N climbs only from ~0.4526 (1e12) ' +
    'to ~0.4877 (1e18), so the ramp NEVER reaches within 1% of the imp-3463 far-tail 1/2 anywhere in ' +
    '[1e12,1e18] (deficit still ~2.46% at 1e18). The first within-1% crossing lands at log10 N ~ 44.17 ' +
    '(N ~ 1.47e44) and the first within-0.1% crossing at log10 N ~ 436 -- a 1/log N-slow finish, with ' +
    'the measured (1/2 - p) ln N ~ 0.508 in the far tail. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 ' +
    'is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-95582 (half-decade ramp [1e6,1e12] extended here); imp-3529 (pointwise local exponent p(N)); ' +
    'imp-3463 (far-tail leading form, exponent -> 1/2); imp-3444 (E_coll = E_trunc crossover ' +
    'N ~ 3.280e9); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping.',
};

export const IMP95602_SIGMA_EXPONENT_RAMP_PAST_1E12_ASSERTIONS = [
  {
    // Log-space evaluator reproduces the imp-95582 inherited direct model at the shared endpoint
    // (no new model): both give p(1e12) = 0.4526.
    id: 'imp95602-logspace-matches-direct-at-1e12',
    description: 'log-space p(1e12) reproduces the direct materialized-N p(1e12) to <1e-6',
    holds: () => Math.abs(pLog10(12) - pDirect(1e12)) < 1e-6,
  },
  {
    // (F1) across [1e12,1e18] the ramp is strictly increasing and NEVER reaches within 1% of 1/2.
    id: 'imp95602-ramp-below-1pct-across-window',
    description: 'p strictly increases on [1e12,1e18], p(1e18) in (0.48,0.49), 1% never reached in-window',
    holds: () => {
      for (let i = 1; i < RAMP_PAST_1E12.length; i++) {
        if (!(RAMP_PAST_1E12[i].p_local > RAMP_PAST_1E12[i - 1].p_local)) return false;
      }
      return (
        REACHED_1PCT_IN_WINDOW === false &&
        P_AT_1E18 > 0.48 &&
        P_AT_1E18 < 0.49 &&
        RAMP_PAST_1E12.every((r) => r.p_local < HALF)
      );
    },
  },
  {
    // (F2) within 1% of 1/2 first reached ~1e44, far beyond the [1e12,1e18] window.
    id: 'imp95602-within-1pct-at-1e44',
    description: 'first p >= 0.5(1-0.01) crossing at log10 N in (43,45), well past 1e18',
    holds: () => CROSS_1PCT !== null && CROSS_1PCT.log10N > 43 && CROSS_1PCT.log10N < 45 && CROSS_1PCT.log10N > 18,
  },
  {
    // (F3) within 0.1% of 1/2 first reached ~1e436, ~10x further in log10 N than the 1% mark.
    id: 'imp95602-within-0p1pct-at-1e436',
    description: 'first p >= 0.5(1-0.001) crossing at log10 N in (420,450), ~10x the 1% crossing',
    holds: () =>
      CROSS_0P1PCT !== null &&
      CROSS_0P1PCT.log10N > 420 &&
      CROSS_0P1PCT.log10N < 450 &&
      CROSS_0P1PCT.log10N / CROSS_1PCT.log10N > 8,
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp95602-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP95602_SIGMA_EXPONENT_RAMP_PAST_1E12.isRigorous === false &&
      IMP95602_SIGMA_EXPONENT_RAMP_PAST_1E12.farTailExponent === 0.5 &&
      /NO QED/.test(IMP95602_SIGMA_EXPONENT_RAMP_PAST_1E12.verdict) &&
      /refereed bound is changed/i.test(IMP95602_SIGMA_EXPONENT_RAMP_PAST_1E12.verdict),
  },
];

for (const a of IMP95602_SIGMA_EXPONENT_RAMP_PAST_1E12_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95602-sigma-exponent-ramp-past-1e12 assertion failed: ${a.id}`);
  }
}
