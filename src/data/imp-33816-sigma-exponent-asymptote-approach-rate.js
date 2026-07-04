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
const WITHIN_1PCT_LOG10 = crossLog10(0.495, 80); // ~44.17 (log T0 ~ 99); reliably in double range
// Within 0.1% needs log T0 ~ 1000, i.e. N ~ 1e434, BEYOND IEEE-double range; from the (F2) law.
const WITHIN_0_1PCT_LOG10_FROM_LAW = 434; // log T0 ~ 1000 -> ln N ~ 1000 -> N ~ 1e434

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
  asymptoteCrossings: {
    within_1pct_of_half_at_N_log10: +WITHIN_1PCT_LOG10.toFixed(2), // ~44.17 (N ~ 1e44)
    within_1pct_logT0: +logT0AtLog10(WITHIN_1PCT_LOG10).toFixed(1), // ~99
    within_0_1pct_of_half_at_N_log10_fromLaw: WITHIN_0_1PCT_LOG10_FROM_LAW, // ~434 (beyond IEEE-double range)
    decadesPast1e12_forWithin1pct: +(WITHIN_1PCT_LOG10 - 12).toFixed(1), // ~32.2
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
      'log T0 ~ 1000, i.e. N ~ 1e434, which lies beyond IEEE-double range and is reported from the ' +
      'F2 law rather than evaluated directly.',
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
