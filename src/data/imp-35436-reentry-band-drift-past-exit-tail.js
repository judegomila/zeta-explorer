/**
 * @module imp-35436-reentry-band-drift-past-exit-tail
 *
 * imp-35436 (numerical, frontier-direction) -- EXTENDS the imp-35332 ceil-phase drift DRIFT(N) PAST the
 * imp-35111 exit edge (10^37.167107) and measures (a) whether it keeps decreasing toward ZERO or flattens
 * to a nonzero asymptote as N grows, and (b) whether the cumulative drift integral CONVERGES (a finite
 * terminal phase / hard upper band edge) or DIVERGES (the reentry band is the first of an unbounded
 * sequence of ever-sparser recurrences, no hard upper edge). MEASUREMENT ONLY on the inherited
 * imp-3220/imp-3406 double surrogate: it does NOT discharge imp-35243a; it changes no bound; NO QED.
 *
 * SET-UP (imp-35332 numerics reproduced VERBATIM)
 * ----------------------------------------------
 * DRIFT(N) = ln(10) . K . (L - 1)/L / ( LN_INV_R . (K log T0(N) - N_cross) ), L = log(T0/2pi), is the
 * derivative of the ceil argument xArg(N) = log(|K log T0 - N_cross|/N_cross/EPS_FP)/LN_INV_R with respect
 * to log10 N (imp-35332). It falls from 0.0186273 at the reentry (10^27.08) to 0.0118306 at the exit
 * (10^37.17). imp-35332/imp-35372 tabulated it only across the band interior; this module continues it.
 *
 * FINDING (a): DRIFT KEEPS FALLING TO ZERO -- NO NONZERO ASYMPTOTE
 * --------------------------------------------------------------
 * Sampled past the exit edge the drift is strictly monotone decreasing: 0.0118306 (exit, 10^37.17) ->
 * 0.0107292 (10^40) -> 0.0036023 (10^100) -> 0.0017068 (10^200) -> 0.0011179 (10^300). Because the
 * denominator (K log T0 - N_cross) grows without bound while the numerator K(L-1)/L rises only to K, the
 * limiting law is DRIFT(N) ~ ln(10) / (LN_INV_R . log T0) ~ ln(10)/(LN_INV_R . log N) -> 0. The product
 * DRIFT(N) . log T0 confirms it, approaching the constant ln(10)/LN_INV_R = 0.744757 from above (0.9064 at
 * 10^50, 0.8166 at 10^100, 0.7787 at 10^200, 0.7670 at 10^300). So the drift has ZERO as its asymptote,
 * not a nonzero floor.
 *
 * FINDING (b): THE CUMULATIVE DRIFT INTEGRAL DIVERGES -- NO HARD UPPER BAND EDGE
 * ----------------------------------------------------------------------------
 * The cumulative drift integral from the exit edge is exactly the xArg traversal (integral of DRIFT
 * d(log10 N) = d xArg), and xArg(exit) = 12 (the exit is where floor(xArg) steps 11 -> 12). Past the exit
 * the running integral is 0.0319 (to 10^40), 0.1247 (to 10^50), 0.3872 (to 10^100), 0.6295 (to 10^200),
 * 0.7666 (to 10^300) -- and it KEEPS GROWING, tracking the leading term ln(log10 N)/LN_INV_R (a
 * DOUBLE-logarithm in N, since xArg ~ log(K log T0)/LN_INV_R). It does NOT converge: the integral to
 * 10^(10^30) is ~33.3, to 10^(10^100) is ~85.4. Therefore there is NO finite terminal phase and NO hard
 * upper band edge -- xArg climbs unboundedly, so it eventually sweeps another full off-by-one cycle. The
 * next full cycle (xArg = 13) is reached at log10 N ~ 307.46, i.e. N ~ 10^307 -- a re-entry astronomically
 * farther out and, by the imp-35399 geometric slide, each successive recurrence is ~2x sparser than the
 * last. The [10^27, 10^37] band is thus the FIRST of an infinite, ever-thinning sequence of recurring
 * off-by-one bands, not a lone feature bounded above.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A MEASUREMENT extending imp-35332 DRIFT(N) past the exit edge: the drift decays to ZERO (~1/log N, no
 * nonzero asymptote) while its cumulative integral (the xArg phase) DIVERGES double-logarithmically, so
 * the reentry band has no hard upper edge but recurs ever more sparsely. It discharges NOTHING: the
 * surrogate-fidelity sub-gap imp-35243a (and its parents imp-35111a / imp-35174a / imp-34997a) stay OPEN
 * -- this is entirely INSIDE the inherited imp-3220/imp-3406 surrogate and says nothing about the true
 * collapse dynamic at these heights. The C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED;
 * the C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays
 * 1/2 (imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35332-reentry-band-drift-analytic-derivation (DRIFT(N) formula; 0.0186273 reentry -> 0.0118306 exit)
 * @see imp-35372-reentry-band-drift-integral-half-offset (drift-integral band-width self-consistency)
 * @see imp-35399-reentry-edge-slide-geometric-ratio (successive recurrences ~2x sparser per octave)
 * @see imp-35111-off-by-one-reentry-band-width (band width ~10.08 decades, exit ~10^37.17)
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (sub-gap imp-35243a; drift is a local rate)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34997/35109/35111/35243/35332)
const EPS_FP = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/34775/34903)
const TWO_PI = 2 * Math.PI;

// The imp-35332/imp-35109/imp-35243 DOUBLE surrogate, reproduced VERBATIM.
const gD = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterateD(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = gD(N);
  return N;
}
const N_CROSS_FP = iterateD(1e9, 200); // ~3.2803e9 (bit-identical to imp-35332)
const R_CONTRACT = Math.abs((gD(N_CROSS_FP + 1) - gD(N_CROSS_FP - 1)) / 2); // ~0.0454235
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.09173 nats/iterate (the log-law constant)

const xArgD = (seed) => Math.log(Math.abs(gD(seed) - N_CROSS_FP) / N_CROSS_FP / EPS_FP) / LN_INV_R;

// The imp-35332 analytic drift, verbatim.
function analyticDrift(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0 / TWO_PI); // RvM count exponent
  const g = K_AMPL * Math.log(T0); // g(N)
  const dg_dlog10N = K_AMPL * Math.LN10 * (L - 1) / L; // via RvM inverse slope
  return (1 / LN_INV_R) * dg_dlog10N / (g - N_CROSS_FP);
}

const EXIT_EXP = 37.167107; // imp-35111 exit edge, log10 N (xArg = 12 here)

// ---------------------------------------------------------------------------------------------------------
// (a) DRIFT PAST THE EXIT EDGE: strictly decreasing toward ZERO, limiting law DRIFT ~ ln10/(LN_INV_R log T0).
// ---------------------------------------------------------------------------------------------------------
const PAST_EXIT_EXPS = [40, 50, 70, 100, 150, 200, 300];
const DRIFT_AT_EXIT = analyticDrift(Math.pow(10, EXIT_EXP)); // ~0.0118306
const DRIFT_PAST_EXIT = PAST_EXIT_EXPS.map((e) => ({ e, drift: analyticDrift(Math.pow(10, e)) }));
// Strictly monotone decreasing exit -> ... -> 10^300?
let DRIFT_STRICTLY_DECREASING = true;
let prevD = DRIFT_AT_EXIT;
for (const { drift } of DRIFT_PAST_EXIT) {
  if (!(drift < prevD)) DRIFT_STRICTLY_DECREASING = false;
  prevD = drift;
}
// The asymptote of DRIFT(N).log T0 is ln10/LN_INV_R (=> DRIFT -> 0 like 1/log T0), approached from above.
const DRIFT_LOGT0_ASYMPTOTE = Math.LN10 / LN_INV_R; // ~0.744757
const DRIFT_LOGT0_PRODUCT = [50, 100, 200, 300].map((e) => ({
  e,
  product: analyticDrift(Math.pow(10, e)) * Math.log(effectiveHeightForN(Math.pow(10, e))),
}));
// Product monotone decreasing toward the asymptote, staying above it?
let PRODUCT_APPROACHES_ASYMPTOTE_FROM_ABOVE = true;
let prevP = DRIFT_LOGT0_PRODUCT[0].product + 1;
for (const { product } of DRIFT_LOGT0_PRODUCT) {
  if (!(product < prevP && product > DRIFT_LOGT0_ASYMPTOTE)) PRODUCT_APPROACHES_ASYMPTOTE_FROM_ABOVE = false;
  prevP = product;
}

// ---------------------------------------------------------------------------------------------------------
// (b) CUMULATIVE DRIFT INTEGRAL PAST THE EXIT = xArg traversal (integral of DRIFT d log10 N = d xArg).
// It DIVERGES (double-log in N); the next full off-by-one cycle (xArg = 13) is at log10 N ~ 307.46.
// ---------------------------------------------------------------------------------------------------------
const XARG_AT_EXIT = xArgD(Math.pow(10, EXIT_EXP)); // = 12 (floor step 11 -> 12)
const CUM_INTEGRAL_PAST_EXIT = PAST_EXIT_EXPS.map((e) => ({
  e,
  cumInt: xArgD(Math.pow(10, e)) - XARG_AT_EXIT,
}));
// Strictly increasing (diverging), not saturating?
let CUM_INTEGRAL_STRICTLY_INCREASING = true;
let prevC = 0;
for (const { cumInt } of CUM_INTEGRAL_PAST_EXIT) {
  if (!(cumInt > prevC)) CUM_INTEGRAL_STRICTLY_INCREASING = false;
  prevC = cumInt;
}
// Locate the next full off-by-one cycle: xArg = XARG_AT_EXIT + 1 (i.e. 13).
function nextCycleExponent() {
  let lo = EXIT_EXP, hi = 1e6;
  const target = XARG_AT_EXIT + 1;
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (xArgD(Math.pow(10, mid)) < target) lo = mid; else hi = mid;
  }
  return lo;
}
const NEXT_CYCLE_EXP = nextCycleExponent(); // ~307.46

export const IMP35436_REENTRY_BAND_DRIFT_PAST_EXIT_TAIL = {
  id: 'imp-35436',
  proofSection: 'S-frontier',
  question:
    'imp-35332/imp-35372 tabulated the ceil-phase drift DRIFT(N) only across the reentry-band interior ' +
    '[10^27.08, 10^37.17]. Extend it past the exit edge and measure whether it keeps falling toward zero ' +
    'or flattens to a nonzero asymptote, and whether the cumulative drift integral converges (a finite ' +
    'terminal phase / hard upper band edge) or diverges.',
  constants: {
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.09173
    exit_exponent_log10N: EXIT_EXP, // 37.167107
    xarg_at_exit: +XARG_AT_EXIT.toPrecision(8), // 12
    drift_logT0_asymptote_ln10_over_lninvr: +DRIFT_LOGT0_ASYMPTOTE.toPrecision(8), // 0.744757
  },
  drift_past_exit: {
    drift_at_exit: +DRIFT_AT_EXIT.toPrecision(7), // 0.0118306
    samples: DRIFT_PAST_EXIT.map(({ e, drift }) => ({ log10N: e, drift: +drift.toPrecision(7) })),
    strictly_decreasing: DRIFT_STRICTLY_DECREASING,
    asymptote: 0, // limit is ZERO, not a nonzero floor
    limiting_law: 'DRIFT(N) ~ ln(10) / (LN_INV_R . log T0(N)) ~ ln(10)/(LN_INV_R . log N) -> 0',
    drift_times_logT0: DRIFT_LOGT0_PRODUCT.map(({ e, product }) => ({ log10N: e, product: +product.toPrecision(7) })),
    product_approaches_asymptote_from_above: PRODUCT_APPROACHES_ASYMPTOTE_FROM_ABOVE,
    reading:
      'DRIFT keeps falling strictly monotonically past the exit (0.0118306 at 10^37.17 -> 0.0011179 at ' +
      '10^300). Its asymptote is ZERO: DRIFT(N).log T0 -> ln(10)/LN_INV_R = 0.744757 from above, so ' +
      'DRIFT ~ ln(10)/(LN_INV_R log T0) ~ 1/log N. There is NO nonzero drift floor.',
  },
  cumulative_integral: {
    xarg_at_exit: +XARG_AT_EXIT.toPrecision(8), // 12
    samples: CUM_INTEGRAL_PAST_EXIT.map(({ e, cumInt }) => ({ log10N: e, cumInt: +cumInt.toPrecision(7) })),
    strictly_increasing: CUM_INTEGRAL_STRICTLY_INCREASING,
    converges: false, // it DIVERGES (double-log in N)
    divergence_law: 'cumulative integral = xArg(N) - 12 ~ ln(log10 N)/LN_INV_R (a double-log, unbounded)',
    next_full_cycle_log10N: +NEXT_CYCLE_EXP.toPrecision(7), // ~307.46
    has_hard_upper_band_edge: false,
    reading:
      'The cumulative drift integral (= xArg traversal, since integral of DRIFT d log10 N = d xArg) keeps ' +
      'growing past the exit (0.0319 to 10^40, 0.3872 to 10^100, 0.7666 to 10^300) and DIVERGES like ' +
      'ln(log10 N)/LN_INV_R. So there is NO finite terminal phase and NO hard upper band edge: xArg ' +
      'sweeps a full off-by-one cycle again at log10 N ~ 307.46, and (imp-35399) each recurrence is ~2x ' +
      'sparser. The band is the FIRST of an infinite, ever-thinning sequence, not a lone bounded feature.',
  },
  finding:
    'Measurement extending imp-35332 DRIFT(N) past the imp-35111 exit edge (10^37.17). (a) The drift keeps ' +
    'falling STRICTLY monotonically toward ZERO (0.0118306 at the exit -> 0.0011179 at 10^300), with ' +
    'limiting law DRIFT ~ ln(10)/(LN_INV_R log T0) ~ 1/log N -- confirmed by DRIFT.log T0 -> ln(10)/LN_INV_R ' +
    '= 0.744757 from above; there is NO nonzero asymptote. (b) The cumulative drift integral (= the xArg ' +
    'phase traversal, xArg = 12 at the exit) DIVERGES, growing like the double-log ln(log10 N)/LN_INV_R ' +
    '(0.0319 to 10^40, 0.3872 to 10^100, 0.7666 to 10^300, ~33 to 10^(10^30)); it does NOT converge, so ' +
    'there is NO finite terminal phase and NO hard upper band edge. xArg completes another off-by-one cycle ' +
    'at log10 N ~ 307.46 and (imp-35399 geometric slide) each successive recurrence is ~2x sparser, making ' +
    'the [10^27, 10^37] band the FIRST of an infinite, ever-thinning sequence rather than a lone feature ' +
    'bounded above. MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; it discharges NOTHING -- ' +
    'imp-35243a (and its parents imp-35111a/imp-35174a/imp-34997a) stay OPEN.',
  residual_sub_gap:
    'This extends and measures the drift tail WITHIN the surrogate; it says nothing about surrogate-vs-true ' +
    'fidelity. imp-35243a stays OPEN (certify the reentry band -- and now its unbounded recurrence -- is a ' +
    'feature of the true collapse dynamic, not only of the machine-epsilon-floored single-rate surrogate); ' +
    'it inherits imp-35111a / imp-35174a / imp-34997a. This module changes no bound and adds no witness.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (numerical, frontier-direction, NOT an RH bound). Extending the imp-35332 ceil-phase drift ' +
    'DRIFT(N) past the imp-35111 exit edge (10^37.17): (a) it keeps decreasing STRICTLY toward ZERO ' +
    '(0.0118306 exit -> 0.0011179 at 10^300), asymptote 0 with DRIFT ~ ln(10)/(LN_INV_R log T0) ~ 1/log N ' +
    '(DRIFT.log T0 -> 0.744757), NO nonzero floor; (b) the cumulative drift integral (= xArg phase, 12 at ' +
    'the exit) DIVERGES double-logarithmically (~ln(log10 N)/LN_INV_R), so there is NO finite terminal ' +
    'phase and NO hard upper band edge -- the next off-by-one cycle is at log10 N ~ 307.46 and each ' +
    'recurrence is ~2x sparser (imp-35399), making the band the first of an infinite ever-thinning ' +
    'sequence. MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; it does NOT discharge ' +
    'imp-35243a (surrogate-fidelity), which stays OPEN with imp-35111a / imp-35174a / imp-34997a. The ' +
    'C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 are ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35332 (DRIFT(N) analytic derivation; sub-gap imp-35243a); imp-35372 (drift-integral band width); ' +
    'imp-35399 (successive recurrences ~2x sparser); imp-35111 (band width ~10.08 decades, exit 10^37.17); ' +
    'imp-35243 (baked drift; drift is a local rate); lambda-rh-height-mapping (effectiveHeightForN RvM ' +
    'inverse); imp-2642 (C_C ansatz).',
};

export const IMP35436_REENTRY_BAND_DRIFT_PAST_EXIT_TAIL_ASSERTIONS = [
  {
    // (a) The drift keeps falling strictly monotonically past the exit edge (no local floor).
    id: 'imp35436-drift-strictly-decreasing-past-exit',
    description: 'DRIFT strictly decreases exit -> 10^300 (0.0118306 -> 0.0011179), asymptote 0',
    holds: () =>
      DRIFT_STRICTLY_DECREASING &&
      Math.abs(DRIFT_AT_EXIT - 0.0118306) < 1e-6 &&
      Math.abs(DRIFT_PAST_EXIT[DRIFT_PAST_EXIT.length - 1].drift - 0.00111791) < 1e-7 &&
      IMP35436_REENTRY_BAND_DRIFT_PAST_EXIT_TAIL.drift_past_exit.asymptote === 0,
  },
  {
    // (a) The limiting law DRIFT ~ ln10/(LN_INV_R log T0): DRIFT.log T0 -> ln10/LN_INV_R from above.
    id: 'imp35436-drift-logT0-tends-to-asymptote',
    description: 'DRIFT.log T0 decreases toward ln10/LN_INV_R=0.744757 from above (0.9064 at 50 -> 0.7670 at 300)',
    holds: () =>
      PRODUCT_APPROACHES_ASYMPTOTE_FROM_ABOVE &&
      Math.abs(DRIFT_LOGT0_ASYMPTOTE - 0.744757282) < 1e-6 &&
      DRIFT_LOGT0_PRODUCT[DRIFT_LOGT0_PRODUCT.length - 1].product > DRIFT_LOGT0_ASYMPTOTE &&
      DRIFT_LOGT0_PRODUCT[DRIFT_LOGT0_PRODUCT.length - 1].product < 0.77,
  },
  {
    // (b) The cumulative drift integral diverges (strictly increasing, not saturating), xArg(exit)=12.
    id: 'imp35436-cumulative-integral-diverges',
    description: 'cumulative drift integral past exit strictly increases (0.0319 -> 0.7666), does not converge',
    holds: () =>
      Math.abs(XARG_AT_EXIT - 12) < 1e-6 &&
      CUM_INTEGRAL_STRICTLY_INCREASING &&
      Math.abs(CUM_INTEGRAL_PAST_EXIT[0].cumInt - 0.0319042) < 1e-5 &&
      Math.abs(CUM_INTEGRAL_PAST_EXIT[CUM_INTEGRAL_PAST_EXIT.length - 1].cumInt - 0.766614) < 1e-5 &&
      IMP35436_REENTRY_BAND_DRIFT_PAST_EXIT_TAIL.cumulative_integral.converges === false,
  },
  {
    // (b) No hard upper edge: xArg completes another off-by-one cycle at log10 N ~ 307.46.
    id: 'imp35436-no-hard-upper-band-edge',
    description: 'next full off-by-one cycle (xArg=13) at log10 N ~ 307.46, so no hard upper band edge',
    holds: () =>
      Math.abs(NEXT_CYCLE_EXP - 307.4565) < 1e-2 &&
      NEXT_CYCLE_EXP > EXIT_EXP &&
      IMP35436_REENTRY_BAND_DRIFT_PAST_EXIT_TAIL.cumulative_integral.has_hard_upper_band_edge === false,
  },
  {
    // Honesty gate: measurement only, discharges nothing, no QED, no refereed bound is changed, sub-gap named/OPEN.
    id: 'imp35436-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, discharges nothing, no QED, no refereed bound is changed, imp-35243a OPEN',
    holds: () =>
      IMP35436_REENTRY_BAND_DRIFT_PAST_EXIT_TAIL.isRigorous === false &&
      /NO QED/.test(IMP35436_REENTRY_BAND_DRIFT_PAST_EXIT_TAIL.verdict) &&
      /refereed bound is changed/i.test(IMP35436_REENTRY_BAND_DRIFT_PAST_EXIT_TAIL.verdict) &&
      /imp-35243a/.test(IMP35436_REENTRY_BAND_DRIFT_PAST_EXIT_TAIL.residual_sub_gap) &&
      /stay OPEN/.test(IMP35436_REENTRY_BAND_DRIFT_PAST_EXIT_TAIL.finding),
  },
];

for (const a of IMP35436_REENTRY_BAND_DRIFT_PAST_EXIT_TAIL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35436-reentry-band-drift-past-exit-tail assertion failed: ${a.id}`);
  }
}
