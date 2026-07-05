/**
 * @module imp-33816-sigma-exponent-asymptote-approach-rate
 *
 * imp-33816 (numerical, frontier-direction): imp-33582 mapped the sigma(N) post-peak decay
 * LOCAL exponent ramping from ~0.0105 in the first post-peak decade toward the imp-3463
 * far-tail 1/2 asymptote (per-decade OLS reaching ~0.4310 over [1e11,1e12]), but STOPPED at
 * 1e12 without saying how far the exponent still has to run before it essentially reaches 1/2.
 * This module extends the local-exponent computation past 1e12 and measures the N at which the
 * exponent first comes within 1% (and 0.1%) of 1/2, quantifying the approach RATE of the final
 * asymptote.
 *
 * THE QUANTITY (identical inherited imp-3220 / imp-3406 / imp-3529 / imp-33274 / imp-33582 sub-terms)
 * ---------------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 * No re-derivation, no fresh model: the exact inherited sub-terms. The pointwise local exponent
 *     p(N) = -d ln sigma / d ln N                  (matches imp-3529 / imp-33582 in-window slope)
 * with the far tail p -> 1/2 from below (imp-3463).
 *
 * THE MEASUREMENT: how far past 1e12 the exponent must run to reach within 1% / 0.1% of 1/2
 * -----------------------------------------------------------------------------------------
 *   (a) Extend the imp-33582 per-decade OLS ladder past [1e11,1e12]: k = 12..18. The reproduced
 *       imp-33582 rung [1e11,1e12] = 0.4310 anchors that the identical model is in use.
 *   (b) THE APPROACH-RATE LAW. In the far tail sigma ~ (C_C/E_trunc) sqrt(log T0 / N), so
 *       ln sigma ~ const + (1/2) ln(log T0) - (1/2) ln N and the exact local exponent obeys
 *           gap(N) = 1/2 - p(N) ~ 1 / (2 log T0(N)).
 *       That is validated directly: the ratio gap / (0.5/log T0) -> 1 across N = 1e44..1e200.
 *   (c) CROSSINGS. The N at which p(N) first comes within 1% of 1/2 (p >= 0.495, i.e.
 *       log T0 ~ 100) and within 0.1% (p >= 0.4995, i.e. log T0 ~ 1000), by bisection where
 *       double precision permits and via the (b) law where N exceeds IEEE-double range.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE RAMP DECELERATES PAST 1e12. The per-decade exponent, ~0.4310 over [1e11,1e12],
 *        continues climbing but its per-decade GAIN collapses: [1e12,1e13]=0.4646,
 *        [1e15,1e16]=0.4851, [1e18,1e19]=0.4880 -- the first decade past 1e12 closes ~3.4e-2 of
 *        the remaining gap, the sixth barely ~1e-3. The fast early ramp gives way to a crawl.
 *   (F2) THE RESIDUAL GAP IS LOGARITHMICALLY SLOW. The exact local-exponent shortfall obeys
 *        gap(N) ~ 1/(2 log T0), so closing the gap by a factor of 10 costs ~10x in log T0, i.e.
 *        ~10x in the exponent of N. The approach to 1/2 is not polynomial but logarithmic.
 *   (F3) "ESSENTIALLY 1/2" IS ASTRONOMICALLY FAR PAST 1e12. p first comes within 1% of 1/2
 *        (p >= 0.495) only at N ~ 1e44 -- about 32 decades past the imp-33582 1e12 stopping
 *        point -- where log T0 ~ 99. Within 0.1% (p >= 0.4995) requires log T0 ~ 1000, i.e.
 *        N ~ 1e434, which lies BEYOND the IEEE-double range and is reported from the (F2) law,
 *        not evaluated directly.
 *
 * The punchline: the imp-33582 exponent ramp does NOT essentially reach 1/2 any time soon past
 * 1e12. Its residual shortfall decays only as ~1/(2 log T0), so the exponent is still ~0.465 a
 * decade past 1e12, does not come within 1% of 1/2 until N ~ 1e44, and not within 0.1% until
 * N ~ 1e434 -- the early ramp is fast, the final approach glacial.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2
 * remains SOTA.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (per-decade ramp 0.0105 -> 0.4310 by [1e11,1e12])
 * @see imp-33274-sigma-postpeak-later-window-decay-exponent (FAR-tail sliding window, p_eff -> 1/2)
 * @see imp-3529-sigma-postpeak-decay-exponent (LOCAL pointwise exponent p(N))
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-34126-shortfall-span-scaling-of-centroid-offset (asymptote-approach cohort sibling: span-exponent alpha -> 1)
 * @see imp-34129-widening-slope-drift-convergence-fit (asymptote-approach cohort sibling: widening slope b -> b_inf)
 * @see imp-34130-ecoll-local-exponent-residual-close-vs-floor (asymptote-approach cohort sibling: E_coll residual -> 0 as 1/(2 log T0), same law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-3529/imp-33582 exactly
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote

// EXACT imp-33582 sub-terms, in log-N space so the far tail stays evaluable at large N.
function lnSigma(lnN) {
  const N = Math.exp(lnN);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return Math.log(E_coll / (E_TRUNC_PT + E_flow + E_coll));
}
const logT0AtLog10 = (d) => Math.log(effectiveHeightForN(Math.pow(10, d)));

// Pointwise local exponent p = -d ln sigma / d ln N (imp-3529/imp-33582 in-window slope).
function pLocalAtLog10(d) {
  const lnN = d * Math.LN10;
  const dl = 1e-3;
  return -(lnSigma(lnN + dl) - lnSigma(lnN - dl)) / (2 * dl);
}

// Per-decade OLS exponent over [10^k, 10^(k+1)], 4 pts/decade (identical to imp-33582).
function olsDecade(k) {
  const xs = [];
  const ys = [];
  for (let d = k; d <= k + 1 + 1e-9; d += 0.25) {
    const lnN = d * Math.LN10;
    xs.push(lnN);
    ys.push(lnSigma(lnN));
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

// (F1) Extend the imp-33582 per-decade ladder past [1e11,1e12] (reproduce that rung, then k=12..18).
const PER_DECADE_LADDER = [11, 12, 13, 14, 15, 16, 17, 18].map((k) => ({
  decade: `1e${k}->1e${k + 1}`,
  p_local: +olsDecade(k).toFixed(4),
  gapToHalf: +(HALF - olsDecade(k)).toExponential(3),
}));

// (F2) Approach-rate law: gap(N) = 1/2 - p(N) ~ 1/(2 log T0). Validate the ratio -> 1.
const GAP_LAW_CHECK = [44, 100, 200].map((d) => {
  const gap = HALF - pLocalAtLog10(d);
  const approx = 0.5 / logT0AtLog10(d);
  return { N_log10: d, gap: +gap.toExponential(3), lawEstimate: +approx.toExponential(3), ratio: +(gap / approx).toFixed(4) };
});

// (F3) Crossing: first N (log10) where p >= target. Safe double-range bracket [1e6, 1e(hiLog10)].
function crossLog10(target, hiLog10) {
  let a = 6 * Math.LN10;
  let b = hiLog10 * Math.LN10;
  for (let i = 0; i < 600; i++) {
    const m = (a + b) / 2;
    if (pLocalAtLog10(m / Math.LN10) < target) a = m;
    else b = m;
  }
  return (a + b) / (2 * Math.LN10);
}
// imp-33904: the 90%-of-asymptote mark. The imp-33582 per-decade OLS ladder reaches ~0.4310 by
// [1e11,1e12] but never pins where the exponent first hits 90% of 1/2 (p = 0.45). Solving the same
// pointwise crossing shows p=0.45 lands at N ~ 1e11.92 (log T0 ~ 26.1) -- WITHIN the very [1e11,1e12]
// decade where imp-33582 stopped, and just one decade above the imp-33701 knee decade [1e10,1e11].
// The per-decade OLS averages 0.4310 over that decade because p is still below 0.45 early in it; the
// pointwise value reaches 0.45 near the decade end. This makes the logarithmic slowness vivid: 90%
// arrives at ~1e11.9, yet 99% (below) only at ~1e44 and 99.9% at ~1e436.
const WITHIN_90PCT_LOG10 = crossLog10(0.45, 60); // ~11.92 (log T0 ~ 26.1); 90% of the 1/2 asymptote
const WITHIN_1PCT_LOG10 = crossLog10(0.495, 80); // ~44.17 (log T0 ~ 99); reliably in double range
// Within 0.1% needs log T0 ~ 1000, i.e. N ~ 1e434, BEYOND IEEE-double range; from the (F2) law.
const WITHIN_0_1PCT_LOG10_FROM_LAW = 434; // log T0 ~ 1000 -> ln N ~ 1000 -> N ~ 1e434

// -------------------------------------------------------------------------------------------------
// imp-33859: DIRECT evaluation of the within-0.1% mark, closing the F3 note that the 0.1% crossing
// was reported only from the (F2) law (N and T0 both overflow IEEE-double past ~1e308, so the
// lnSigma path above cannot reach N ~ 1e434). Reformulate the EXACT same sub-terms entirely in
// log-N space so no double ever overflows: from N = (T0/2pi)(log(T0/2pi) - 1) with u = log(T0/2pi),
// ln N = u + log(u - 1) is solved by Newton (never forming T0 or N), then
//     E_coll = C_C sqrt(L/N) = C_C sqrt(L) exp(-lnN/2),  E_flow = C_F (L/T0) Gronwall = C_F L e^-L G.
function logT0FromLnN(lnN) {
  let u = Math.max(2, lnN); // seed u ~ ln N for large N
  for (let i = 0; i < 80; i++) {
    const g = u + Math.log(u - 1) - lnN; // ln N = u + log(u - 1)
    const gp = 1 + 1 / (u - 1);
    const du = g / gp;
    u -= du;
    if (u <= 1) u = 1 + 1e-12;
    if (Math.abs(du) < 1e-13 * Math.max(1, u)) break;
  }
  return { u, L: u + Math.log(TWO_PI) }; // L = log T0 = u + log(2pi)
}
function lnSigmaFromLnN(lnN) {
  const { u, L } = logT0FromLnN(lnN);
  const C_F = (u + 1) / TWO_PI; // = (log(T0/2pi) + 1)/2pi, identical to imp-33582/imp-33816 above
  const lnE_coll = Math.log(C_C_PINNED) + 0.5 * Math.log(L) - 0.5 * lnN; // C_C sqrt(L/N)
  const E_coll = Math.exp(lnE_coll);
  const E_flow = C_F * L * Math.exp(-L) * GRONWALL; // C_F (L/T0) Gronwall, T0 = e^L (underflows to 0 far out)
  return lnE_coll - Math.log(E_TRUNC_PT + E_flow + E_coll);
}
function pLocalFromLnN(lnN) {
  const dl = 1e-3; // identical step to pLocalAtLog10
  return -(lnSigmaFromLnN(lnN + dl) - lnSigmaFromLnN(lnN - dl)) / (2 * dl);
}
function crossLog10Direct(target, hiLog10) {
  let a = 6 * Math.LN10;
  let b = hiLog10 * Math.LN10;
  for (let i = 0; i < 700; i++) {
    const m = (a + b) / 2;
    if (pLocalFromLnN(m) < target) a = m;
    else b = m;
  }
  return (a + b) / (2 * Math.LN10);
}
const WITHIN_0_1PCT_LOG10_DIRECT = crossLog10Direct(0.4995, 600); // ~436.06, DIRECTLY evaluated
const WITHIN_0_1PCT_LOGT0_DIRECT = logT0FromLnN(WITHIN_0_1PCT_LOG10_DIRECT * Math.LN10).L; // ~999.0

// imp-33943: fill the crossing ladder between the imp-33904 90% mark (p=0.45, N~1e11.92) and the
// imp-33816 99% mark (p=0.495, N~1e44) with the intermediate 50% (p=0.25) and 95% (p=0.475) marks,
// solved on the SAME log-space direct path (Newton ln N = u + log(u-1), never forming T0/N). Both
// crossings sit comfortably inside IEEE-double range and reproduce the double-range crossLog10 path
// to <1e-4 in log10 N (verified below), confirming the identical inherited model is in use.
const WITHIN_50PCT_LOG10 = crossLog10Direct(0.25, 30); // ~9.61 (log T0 ~ 21.1); 50% of the 1/2 asymptote
const WITHIN_95PCT_LOG10 = crossLog10Direct(0.475, 80); // ~13.17 (log T0 ~ 28.9); 95% of the 1/2 asymptote

// imp-33949: DIRECTLY confirm the logarithmic (NOT polynomial) shortfall decay by symmetric
// finite-difference of the exact local exponent p = -d ln sigma/d ln N at three WELL-SEPARATED
// decades N = 1e20, 1e50, 1e100 (all comfortably inside IEEE-double range, evaluated on the same
// log-space direct path), cross-checking the closed-form-only 1/(2 log T0) crossings. Two direct
// readings: (i) gap(N) = 1/2 - p(N) matches 0.5/log T0 to <2.4% (ratio -> 1 from below; log T0 * gap
// -> 0.5), and (ii) the EFFECTIVE polynomial decay exponent of the gap, q(N) = -d ln(gap)/d ln N, is
// NOT a positive constant (as any true gap ~ N^-a polynomial would be) but HALVES 1e20->1e50->1e100
// (2.17e-2 -> 8.74e-3 -> 4.37e-3), collapsing toward 0 as ~1/log T0 (q*log T0 -> 1). A vanishing
// effective exponent is the direct signature of logarithmic, not polynomial, decay.
function gapFD(d) {
  return HALF - pLocalFromLnN(d * Math.LN10);
}
function qGapFD(d) {
  const lnN = d * Math.LN10;
  const dl = 1e-2; // symmetric FD step in ln N for the gap decay exponent q = -d ln(gap)/d ln N
  const gPlus = HALF - pLocalFromLnN(lnN + dl);
  const gMinus = HALF - pLocalFromLnN(lnN - dl);
  return -(Math.log(gPlus) - Math.log(gMinus)) / (2 * dl);
}
const DIRECT_THREE_DECADE_GAP_FD = [20, 50, 100].map((d) => {
  const L = logT0FromLnN(d * Math.LN10).L;
  const gap = gapFD(d);
  const q = qGapFD(d);
  return {
    N_log10: d,
    logT0: +L.toFixed(2),
    gap_direct: +gap.toExponential(3), // 1/2 - p via central FD of the exact local exponent
    law_half_over_logT0: +(HALF / L).toExponential(3), // the closed-form 1/(2 log T0) estimate
    ratio_to_law: +(gap / (HALF / L)).toFixed(4), // -> 1 from below
    logT0_times_gap: +(L * gap).toFixed(4), // -> 0.5 (confirms gap ~ 1/(2 log T0))
    effective_poly_exponent_q: +q.toExponential(3), // -d ln(gap)/d ln N; -> 0 if logarithmic
    q_times_logT0: +(q * L).toFixed(4), // -> 1 (q ~ 1/log T0), NOT a positive constant
  };
});

export const IMP33816_SIGMA_EXPONENT_ASYMPTOTE_APPROACH_RATE = {
  id: 'imp-33816',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-33582 sigma(N) post-peak LOCAL decay exponent past its 1e12 stopping point ' +
    '(per-decade ramp ~0.0105 -> ~0.4310 by [1e11,1e12]) and measure how far past 1e12 the ' +
    'exponent must run before it comes within 1% (and 0.1%) of the imp-3463 far-tail 1/2 ' +
    'asymptote -- quantifying the approach rate of the final asymptote. Measurement/fit only; ' +
    'conditional-share diagnostic, NOT an RH bound; C_mb stays GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'pointwise local exponent p(N) = -d ln sigma / d ln N extended past 1e12; the per-decade OLS ' +
    'ladder for k=11..18; the approach-rate law gap(N) = 1/2 - p ~ 1/(2 log T0); and the N at ' +
    'which p first comes within 1% (p>=0.495) and 0.1% (p>=0.4995) of 1/2',
  perDecadeLadderPast1e12: PER_DECADE_LADDER,
  approachRateLaw: {
    form: 'gap(N) = 1/2 - p(N) ~ 1 / (2 log T0(N))',
    ratioCheck: GAP_LAW_CHECK, // gap / (0.5/log T0) -> 1
  },
  directThreeDecadeGapFiniteDifference: {
    // imp-33949: DIRECT symmetric finite-difference of the exact local exponent at three
    // well-separated decades (1e20, 1e50, 1e100), cross-checking the closed-form 1/(2 log T0)
    // crossings. The effective polynomial decay exponent q -> 0 (q log T0 -> 1) is the direct
    // signature that the shortfall decays logarithmically, NOT polynomially.
    form: 'gap(N) = 1/2 - p(N) via central FD; effective poly exponent q = -d ln(gap)/d ln N -> 0 (q log T0 -> 1) => logarithmic, not polynomial',
    rungs: DIRECT_THREE_DECADE_GAP_FD,
  },
  asymptoteCrossings: {
    // imp-33904: the 90%-of-asymptote (p=0.45) crossing, pinning what the imp-33582 ladder left open.
    within_90pct_of_half_at_N_log10: +WITHIN_90PCT_LOG10.toFixed(2), // ~11.92 (N ~ 1e11.9)
    within_90pct_logT0: +logT0AtLog10(WITHIN_90PCT_LOG10).toFixed(1), // ~26.1
    within_90pct_relative_to_imp33582_stop_decades: +(WITHIN_90PCT_LOG10 - 12).toFixed(2), // ~-0.08 (inside [1e11,1e12])
    within_90pct_decades_above_imp33701_knee: +(WITHIN_90PCT_LOG10 - 11).toFixed(2), // ~0.92 (knee decade [1e10,1e11])
    // imp-33943: intermediate ladder rungs solved on the log-space direct path (crossLog10Direct).
    within_50pct_of_half_at_N_log10: +WITHIN_50PCT_LOG10.toFixed(2), // ~9.61 (p=0.25; sits ~2.3 decades BELOW the 90% mark)
    within_50pct_logT0: +logT0FromLnN(WITHIN_50PCT_LOG10 * Math.LN10).L.toFixed(1), // ~21.1
    within_95pct_of_half_at_N_log10: +WITHIN_95PCT_LOG10.toFixed(2), // ~13.17 (p=0.475; strictly between the 90% and 99% marks)
    within_95pct_logT0: +logT0FromLnN(WITHIN_95PCT_LOG10 * Math.LN10).L.toFixed(1), // ~28.9
    within_95pct_decades_above_90pct: +(WITHIN_95PCT_LOG10 - WITHIN_90PCT_LOG10).toFixed(2), // ~1.25 (90%->95%)
    within_99pct_decades_above_95pct: +(WITHIN_1PCT_LOG10 - WITHIN_95PCT_LOG10).toFixed(2), // ~31.0 (95%->99%, the log-slow leg)
    within_1pct_of_half_at_N_log10: +WITHIN_1PCT_LOG10.toFixed(2), // ~44.17 (N ~ 1e44)
    within_1pct_logT0: +logT0AtLog10(WITHIN_1PCT_LOG10).toFixed(1), // ~99
    within_0_1pct_of_half_at_N_log10_fromLaw: WITHIN_0_1PCT_LOG10_FROM_LAW, // ~434 (F2 law, dropped log terms)
    within_0_1pct_of_half_at_N_log10_direct: +WITHIN_0_1PCT_LOG10_DIRECT.toFixed(2), // ~436.06 (imp-33859, DIRECT)
    within_0_1pct_logT0_direct: +WITHIN_0_1PCT_LOGT0_DIRECT.toFixed(1), // ~999.0 (confirms F2 "log T0 ~ 1000")
    within_0_1pct_direct_vs_law_residual_log10: +(WITHIN_0_1PCT_LOG10_DIRECT - WITHIN_0_1PCT_LOG10_FROM_LAW).toFixed(2), // ~2.06 decades
    decadesPast1e12_forWithin1pct: +(WITHIN_1PCT_LOG10 - 12).toFixed(1), // ~32.2
    decadesPast1e12_forWithin0_1pct_direct: +(WITHIN_0_1PCT_LOG10_DIRECT - 12).toFixed(1), // ~424.1
  },
  farTailExponent: HALF, // imp-3463 asymptote the ramp approaches from below
  finding: {
    F1_ramp_decelerates_past_1e12:
      'The per-decade exponent, ~0.4310 over [1e11,1e12], continues climbing but its per-decade ' +
      'gain collapses: [1e12,1e13]=0.4646, [1e15,1e16]=0.4851, [1e18,1e19]=0.4880. The first ' +
      'decade past 1e12 closes ~3.4e-2 of the remaining gap to 1/2, the sixth barely ~1e-3 -- ' +
      'the fast early ramp gives way to a crawl.',
    F2_residual_gap_logarithmically_slow:
      'The exact local-exponent shortfall obeys gap(N) = 1/2 - p(N) ~ 1/(2 log T0), validated ' +
      'directly: gap / (0.5/log T0) -> 1.00 across N = 1e44..1e200. Closing the gap tenfold costs ' +
      '~10x in log T0, i.e. ~10x in the exponent of N -- the approach is logarithmic, not polynomial.',
    F3_essentially_half_astronomically_far:
      'p first comes within 1% of 1/2 (p>=0.495) only at N ~ 1e44 -- about 32 decades past the ' +
      'imp-33582 1e12 stopping point -- where log T0 ~ 99. Within 0.1% (p>=0.4995) requires ' +
      'log T0 ~ 1000, i.e. N ~ 1e434; N and T0 both overflow IEEE-double past ~1e308 so this mark ' +
      'was ORIGINALLY reported from the F2 law rather than evaluated directly (now closed by F4).',
    F5_ninety_pct_of_half_is_at_the_imp33582_stop_imp33904:
      'imp-33904 pins the 90%-of-asymptote mark the imp-33582 ladder left open. The pointwise local ' +
      'exponent first reaches p=0.45 (90% of 1/2) at N ~ 1e11.92 (log T0 ~ 26.1) -- WITHIN the very ' +
      '[1e11,1e12] decade where imp-33582 stopped at per-decade OLS 0.4310, and ~0.9 decade above the ' +
      'imp-33701 knee decade [1e10,1e11]. The per-decade OLS averages 0.4310 over that decade only ' +
      'because p is still below 0.45 early in it. Contrast the logarithmic slowness of the last leg: ' +
      '90% arrives essentially at the 1e12 stop, yet 99% (p=0.495) waits until ~1e44 and 99.9% until ~1e436.',
    F6_intermediate_ladder_rungs_imp33943:
      'imp-33943 fills the crossing ladder between the imp-33904 90% mark (p=0.45, N~1e11.92) and ' +
      'the imp-33816 99% mark (p=0.495, N~1e44) with the intermediate 50% (p=0.25) and 95% (p=0.475) ' +
      'crossings, solved on the identical log-space direct path (both reproduce the double-range ' +
      'crossLog10 path to <1e-4). The 50% mark lands at N~1e9.61 (log T0~21.1), ~2.3 decades BELOW ' +
      'the 90% mark; the 95% mark at N~1e13.17 (log T0~28.9), ~1.25 decades above 90%. The ladder ' +
      'makes the 1/(2 log T0) slowness concrete: 90%->95% costs ~1.25 decades but 95%->99% costs ' +
      '~31 decades -- the same 4.5-point exponent gain, ~25x more N-decades, as the tail flattens.',
    F4_within_0_1pct_evaluated_directly_imp33859:
      'imp-33859 closes the F3 note by evaluating the 0.1% mark DIRECTLY. Recasting the identical ' +
      'sub-terms in log-N space -- solving ln N = u + log(u-1) for u = log(T0/2pi) by Newton so ' +
      'neither N nor T0 is ever formed -- the log-space local exponent reproduces the double-range ' +
      'path to ~1e-11 (machine precision, exactly 0 at N=1e200,1e300) and places the p>=0.4995 ' +
      'crossing at N ~ 1e436.06 (log T0 = 999.0, ~424 decades past 1e12). The direct value sits ' +
      '~2.06 decades above the F2-law estimate (1e434), which had dropped the +log(u-1) and ' +
      'log(2pi) sub-leading terms -- a consistency check confirming the ~1/(2 log T0) law far past 1e44.',
    F7_direct_three_decade_confirms_logarithmic_not_polynomial_imp33949:
      'imp-33949 confirms the logarithmic (not polynomial) shortfall decay DIRECTLY, by symmetric ' +
      'finite-difference of the exact local exponent p = -d ln sigma/d ln N at three well-separated ' +
      'decades N = 1e20, 1e50, 1e100 (all inside IEEE-double range). The direct gap = 1/2 - p tracks ' +
      '0.5/log T0 to <2.4% (ratio 0.977 -> 0.991 -> 0.996; log T0 * gap = 0.488 -> 0.495 -> 0.498, ' +
      'approaching 1/2). Decisively, the EFFECTIVE polynomial decay exponent q = -d ln(gap)/d ln N is ' +
      'NOT the positive constant a>0 that any true gap ~ N^-a would give: it HALVES 2.17e-2 -> 8.74e-3 ' +
      '-> 4.37e-3, collapsing toward 0 as ~1/log T0 (q log T0 = 0.96 -> 0.98 -> 0.99, approaching 1). A ' +
      'vanishing effective exponent is the direct signature of logarithmic slowness. Between 1e20 and ' +
      '1e100 (5.13x in log T0) the gap shrinks 5.04x -- the F2 "~10x in log T0 closes the gap 10x" ' +
      'law, read directly rather than from the closed form.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Extending the imp-33582 sigma(N) post-peak ' +
    'local exponent past its 1e12 stopping point (reproduced rung [1e11,1e12] = 0.4310): the ramp ' +
    'DECELERATES past 1e12 -- [1e12,1e13]=0.4646, [1e15,1e16]=0.4851, [1e18,1e19]=0.4880 -- with ' +
    'the residual shortfall obeying the logarithmically-slow law gap(N) = 1/2 - p ~ 1/(2 log T0) ' +
    '(ratio -> 1.00 over 1e44..1e200). Consequently the exponent does not come within 1% of the ' +
    'imp-3463 far-tail 1/2 until N ~ 1e44 (~32 decades past 1e12, log T0 ~ 99), and not within 0.1% ' +
    'until N ~ 1e434 (log T0 ~ 1000, beyond IEEE-double range, from the law). The early ramp is ' +
    'fast, the final approach glacial. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33582 (per-decade ramp 0.0105 -> 0.4310 by [1e11,1e12]); imp-33274 (FAR-tail sliding ' +
    'window p_eff -> 1/2); imp-3529 (LOCAL pointwise exponent p(N)); imp-3463 (far-tail leading ' +
    'form, exponent -> 1/2 from below); imp-3444 (E_coll = E_trunc crossover N ~ 3.280e9); ' +
    'imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping.',
};

export const IMP33816_SIGMA_EXPONENT_ASYMPTOTE_APPROACH_RATE_ASSERTIONS = [
  {
    // Reuse gate: the extended ladder reproduces the imp-33582 [1e11,1e12] = 0.4310 rung,
    // proving the identical inherited model is in use before extrapolating past 1e12.
    id: 'imp33816-reproduces-imp33582-rung',
    description: 'per-decade [1e11,1e12] exponent reproduces the imp-33582 landmark ~0.4310',
    holds: () => Math.abs(PER_DECADE_LADDER[0].p_local - 0.4310) < 1e-3,
  },
  {
    // (F1): the per-decade exponent keeps climbing past 1e12 but strictly below 1/2, and its
    // per-decade gain shrinks (decelerating ramp).
    id: 'imp33816-ladder-climbs-and-decelerates',
    description: 'per-decade p strictly increases toward 1/2 (all < 0.5) with shrinking per-decade gains',
    holds: () => {
      for (let i = 1; i < PER_DECADE_LADDER.length; i++) {
        if (!(PER_DECADE_LADDER[i].p_local > PER_DECADE_LADDER[i - 1].p_local)) return false;
      }
      const gain1 = PER_DECADE_LADDER[1].p_local - PER_DECADE_LADDER[0].p_local;
      const gainLast = PER_DECADE_LADDER[PER_DECADE_LADDER.length - 1].p_local - PER_DECADE_LADDER[PER_DECADE_LADDER.length - 2].p_local;
      return PER_DECADE_LADDER.every((r) => r.p_local < HALF) && gainLast < gain1;
    },
  },
  {
    // (F2): the approach-rate law gap ~ 1/(2 log T0) is validated: ratio within 1% of 1 by 1e100.
    id: 'imp33816-gap-law-ratio-to-one',
    description: 'gap / (0.5/log T0) converges to 1 (within 1% at N=1e100 and N=1e200)',
    holds: () =>
      GAP_LAW_CHECK.every((r) => r.ratio > 0.9 && r.ratio < 1.1) &&
      Math.abs(GAP_LAW_CHECK[1].ratio - 1) < 1e-2 &&
      Math.abs(GAP_LAW_CHECK[2].ratio - 1) < 1e-2,
  },
  {
    // imp-33904 (F5): the 90%-of-asymptote (p=0.45) crossing lands at N ~ 1e11.9 (log T0 ~ 26),
    // INSIDE the [1e11,1e12] decade where imp-33582 stopped and above the imp-33701 knee decade --
    // a stark contrast to the within-1% (~1e44) and within-0.1% (~1e436) marks.
    id: 'imp33816-within-90pct-crossing-at-imp33582-stop',
    description: 'p reaches 90% of 1/2 (p=0.45) at N ~ 1e11.9 (log T0 ~ 26), inside the imp-33582 [1e11,1e12] stopping decade',
    holds: () =>
      WITHIN_90PCT_LOG10 > 11.5 &&
      WITHIN_90PCT_LOG10 < 12.5 &&
      Math.abs(pLocalAtLog10(WITHIN_90PCT_LOG10) - 0.45) < 1e-4 &&
      WITHIN_90PCT_LOG10 < WITHIN_1PCT_LOG10,
  },
  {
    // (F3): within-1% crossing lands at N ~ 1e44 (log T0 ~ 99), tens of decades past 1e12.
    id: 'imp33816-within-1pct-crossing-astronomical',
    description: 'p within 1% of 1/2 at N ~ 1e44 (~32 decades past 1e12, log T0 ~ 99)',
    holds: () =>
      WITHIN_1PCT_LOG10 > 43 &&
      WITHIN_1PCT_LOG10 < 46 &&
      Math.abs(pLocalAtLog10(WITHIN_1PCT_LOG10) - 0.495) < 1e-4 &&
      WITHIN_1PCT_LOG10 - 12 > 25,
  },
  {
    // imp-33859 (F4): the log-space DIRECT path reproduces the double-range local exponent to
    // machine precision at N=1e200 (proving the identical model), then locates the within-0.1%
    // crossing directly at log T0 ~ 999 (N ~ 1e436), ~2 decades above the dropped-term F2 law.
    id: 'imp33816-within-0-1pct-direct-log-space',
    description: 'log-space direct path reproduces the double-range p and lands the 0.1% mark at log T0 ~ 999 (N ~ 1e436)',
    holds: () =>
      Math.abs(pLocalFromLnN(200 * Math.LN10) - pLocalAtLog10(200)) < 1e-9 &&
      Math.abs(pLocalFromLnN(WITHIN_0_1PCT_LOG10_DIRECT * Math.LN10) - 0.4995) < 1e-4 &&
      WITHIN_0_1PCT_LOG10_DIRECT > 434 &&
      WITHIN_0_1PCT_LOG10_DIRECT < 438 &&
      Math.abs(WITHIN_0_1PCT_LOGT0_DIRECT - 1000) < 5 &&
      WITHIN_0_1PCT_LOG10_DIRECT > WITHIN_0_1PCT_LOG10_FROM_LAW,
  },
  {
    // imp-33943 (F6): the intermediate 50% (p=0.25) and 95% (p=0.475) crossings order correctly
    // within the ladder (50% < 90% < 95% < 99%), hit their target exponents, and reproduce the
    // double-range crossLog10 path -- proving the identical inherited model on the log-space route.
    id: 'imp33816-intermediate-ladder-rungs-imp33943',
    description: 'p=0.25 (50%) at N~1e9.6 and p=0.475 (95%) at N~1e13.2 order correctly (50%<90%<95%<99%) and hit target',
    holds: () =>
      Math.abs(pLocalFromLnN(WITHIN_50PCT_LOG10 * Math.LN10) - 0.25) < 1e-4 &&
      Math.abs(pLocalFromLnN(WITHIN_95PCT_LOG10 * Math.LN10) - 0.475) < 1e-4 &&
      WITHIN_50PCT_LOG10 < WITHIN_90PCT_LOG10 &&
      WITHIN_90PCT_LOG10 < WITHIN_95PCT_LOG10 &&
      WITHIN_95PCT_LOG10 < WITHIN_1PCT_LOG10 &&
      Math.abs(pLocalFromLnN(WITHIN_50PCT_LOG10 * Math.LN10) - pLocalAtLog10(WITHIN_50PCT_LOG10)) < 1e-9 &&
      Math.abs(pLocalFromLnN(WITHIN_95PCT_LOG10 * Math.LN10) - pLocalAtLog10(WITHIN_95PCT_LOG10)) < 1e-9,
  },
  {
    // imp-33949 (F7): DIRECT three-decade finite-difference confirms LOGARITHMIC (not polynomial)
    // decay. gap tracks 0.5/log T0 to <2.4% (ratio -> 1 from below, log T0 * gap -> 0.5) AND the
    // effective polynomial exponent q = -d ln(gap)/d ln N is not constant but halves 1e20->1e50->1e100
    // toward 0 (q log T0 -> 1) -- the direct signature of a logarithmically, not polynomially, slow gap.
    id: 'imp33816-direct-three-decade-logarithmic-not-polynomial-imp33949',
    description: 'direct FD gap at 1e20/1e50/1e100 tracks 0.5/log T0 (log T0 * gap -> 0.5) and effective poly exponent q -> 0 (q log T0 -> 1), not a positive constant',
    holds: () => {
      const r = DIRECT_THREE_DECADE_GAP_FD;
      // (i) gap ~ 1/(2 log T0): ratio -> 1 from below, log T0 * gap -> 0.5
      const lawOk =
        r.every((x) => x.ratio_to_law > 0.97 && x.ratio_to_law <= 1 && Math.abs(x.logT0_times_gap - HALF) < 0.02) &&
        r[0].ratio_to_law < r[1].ratio_to_law &&
        r[1].ratio_to_law < r[2].ratio_to_law;
      // (ii) logarithmic NOT polynomial: q collapses toward 0 (strictly shrinking, ~halving), q log T0 -> 1
      const polyRefuted =
        r[0].effective_poly_exponent_q > r[1].effective_poly_exponent_q &&
        r[1].effective_poly_exponent_q > r[2].effective_poly_exponent_q &&
        r[2].effective_poly_exponent_q < 0.6 * r[0].effective_poly_exponent_q &&
        r.every((x) => x.q_times_logT0 > 0.95 && x.q_times_logT0 < 1.0);
      // identical-model cross-check: the log-space direct path == the double-range path at 1e100
      const sameModel = Math.abs(pLocalFromLnN(100 * Math.LN10) - pLocalAtLog10(100)) < 1e-9;
      return lawOk && polyRefuted && sameModel;
    },
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = 1/2 (imp-3463), no QED, PT SOTA.
    id: 'imp33816-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, PT stays SOTA',
    holds: () =>
      IMP33816_SIGMA_EXPONENT_ASYMPTOTE_APPROACH_RATE.isRigorous === false &&
      IMP33816_SIGMA_EXPONENT_ASYMPTOTE_APPROACH_RATE.farTailExponent === 0.5 &&
      /NO QED/.test(IMP33816_SIGMA_EXPONENT_ASYMPTOTE_APPROACH_RATE.verdict) &&
      /remains SOTA/.test(IMP33816_SIGMA_EXPONENT_ASYMPTOTE_APPROACH_RATE.verdict),
  },
];

for (const a of IMP33816_SIGMA_EXPONENT_ASYMPTOTE_APPROACH_RATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33816-sigma-exponent-asymptote-approach-rate assertion failed: ${a.id}`);
  }
}
