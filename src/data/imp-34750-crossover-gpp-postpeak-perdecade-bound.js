/**
 * @module imp-34750-crossover-gpp-postpeak-perdecade-bound
 *
 * imp-34750 (numerical, S-frontier): imp-34731/imp-34727 isolated the closed-form second
 * derivative of the inherited imp-33723 crossover map g(N) = K log T0(N) as
 *     g_dd(N) = -4 pi^2 K (u + 1) / (T^2 u^3),   T = T0(N),  u = log(T/2pi),  K = (C_C/E_trunc)^2,
 * and proved |g_dd| is monotone-decreasing with sharp left-endpoint ceiling B ~ 1.4802e-10, but
 * ONLY on the single band I = [1e9, 1e10]. This module ASSESSES whether that monotone-decreasing
 * ceiling extends across the wider post-peak span [1e9, 1e12] (where the imp-33582 decay-exponent
 * ramp lives) and TABULATES the sharp per-decade left-endpoint bound B(decade).
 *
 * THE MAP (inherited, unchanged from imp-33723 -- reused verbatim)
 * ---------------------------------------------------------------
 * g(N) = K log T0(N), with T0(N) = effectiveHeightForN(N) the Riemann-von Mangoldt inverse of
 * N(T) = (T/2pi)(log(T/2pi) - 1), and K = (C_C_PINNED / E_trunc)^2 ~ 1.5727e8. Writing T = T0(N),
 * u = log(T/2pi) >= 0, the chain rule through T0(N) gives (imp-34731):
 *     g_prime(N) = 2 pi K / (T u),        g_dd(N) = -4 pi^2 K (u + 1) / (T^2 u^3).
 *
 * WHY THE MONOTONE-DECREASING CEILING EXTENDS (the assessment)
 * -----------------------------------------------------------
 * On the WHOLE post-peak span both T0(N) and u = log(T0/2pi) are strictly INCREASING in N (T0
 * grows without bound and u = log(T0/2pi) with it). In |g_dd| = 4 pi^2 K (u+1)/(T^2 u^3) the
 * numerator grows only like (u + 1) ~ u while the denominator T^2 u^3 grows quadratically in T
 * AND cubically in u; the growth gap only WIDENS as N increases (T0 accelerates past 1e10), so
 * |g_dd| stays strictly decreasing across all of [1e9, 1e12]. Hence on EACH decade band
 * [10^d, 10^(d+1)] the supremum of |g_dd| is attained at that band's LEFT endpoint, giving the
 * sharp per-decade bound
 *     B(d) = 4 pi^2 K (u_d + 1) / (T_d^2 u_d^3),   T_d = T0(10^d),  u_d = log(T_d/2pi).
 * The global ceiling over the whole span is B(9) = B_[1e9,1e10] ~ 1.4802e-10 (the imp-34731
 * value), and the per-decade bounds fall off by roughly two orders of magnitude per decade
 * (T^2 dominates), so the tail decades are far tighter than the first.
 *
 * THE FINDING (assessment / measurement only)
 * -------------------------------------------
 *   (A1) MONOTONICITY EXTENDS. Sampling |g_dd| on a dense log grid across the full [1e9, 1e12]
 *        span confirms it is strictly monotone-decreasing everywhere -- the imp-34731 argument is
 *        not an artifact of the narrow [1e9, 1e10] window; the same T^2 u^3 vs (u+1) growth gap
 *        holds (in fact widens) all the way to 1e12.
 *   (A2) PER-DECADE SHARP BOUNDS TABULATED. For each decade band [10^d, 10^(d+1)],
 *        d in {9, 10, 11}, the sharp bound B(d) is the closed-form value at the left endpoint
 *        10^d (each band's own argmax lands at its left endpoint, tightness ratio 1.000). The
 *        global span ceiling is B(9) ~ 1.4802e-10, matching imp-34731 exactly.
 *
 * The punchline: the imp-34731/imp-34727 g_dd ceiling is NOT special to [1e9, 1e10] -- |g_dd|
 * stays monotone-decreasing across the whole post-peak span [1e9, 1e12], so the sharp bound on
 * any sub-band is its left-endpoint value, and the per-decade ladder B(9) ~ 1.48e-10 >>
 * B(10) >> B(11) decays ~ two orders per decade.
 *
 * ASSESSMENT / MEASUREMENT ONLY. This bounds the curvature of the INHERITED imp-3220/imp-3406
 * surrogate crossover map on the inherited surrogate; it adds NO RH bound and asserts no operator
 * positivity. The C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; changes no bound; NO QED. No refereed bound is changed.
 *
 * @see imp-34731-crossover-map-second-derivative-bound (closed-form g_dd + ceiling on [1e9,1e10])
 * @see imp-33723-sigma-half-vs-crossover-closed-form (fixed point N = K log T0(N), g_prime form)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (post-peak decay-exponent ramp to 1e12)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const FOUR_PI2 = 4 * Math.PI * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (imp-33723 amplitude, same as imp-34731)

const SPAN_LO = 1e9;
const SPAN_HI = 1e12;

// CLOSED FORM (imp-34731): g_dd(N) = -4 pi^2 K (u+1) / (T^2 u^3), T = T0(N), u = log(T/2pi).
function gDoublePrimeAbs(N) {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (FOUR_PI2 * K_AMPL * (u + 1)) / (T * T * u * u * u);
}

// (A1) confirm |g_dd| is monotone-decreasing on the FULL [1e9, 1e12] span (dense log grid).
let SPAN_MONOTONE_DECREASING = true;
let SPAN_MAX_ABS = 0;
let SPAN_ARGMAX = SPAN_LO;
let prev = Infinity;
const N_GRID = 300;
for (let k = 0; k <= N_GRID; k++) {
  const N = SPAN_LO * Math.pow(SPAN_HI / SPAN_LO, k / N_GRID);
  const a = gDoublePrimeAbs(N);
  if (a > SPAN_MAX_ABS) {
    SPAN_MAX_ABS = a;
    SPAN_ARGMAX = N;
  }
  if (a > prev * (1 + 1e-12)) SPAN_MONOTONE_DECREASING = false;
  prev = a;
}

// (A2) sharp per-decade left-endpoint bound B(d) on each band [10^d, 10^(d+1)], d in {9,10,11}.
const DECADE_EXPONENTS = [9, 10, 11];
const DECADE_ROWS = DECADE_EXPONENTS.map((d) => {
  const NL = Math.pow(10, d);
  const NH = Math.pow(10, d + 1);
  const TL = effectiveHeightForN(NL);
  const uL = Math.log(TL / TWO_PI);
  const B = (FOUR_PI2 * K_AMPL * (uL + 1)) / (TL * TL * uL * uL * uL); // left-endpoint sup
  // tightness: within-band argmax should be the left endpoint (each band decreasing)
  let bandMax = 0;
  let bandMono = true;
  let p = Infinity;
  for (let k = 0; k <= 100; k++) {
    const N = NL * Math.pow(NH / NL, k / 100);
    const a = gDoublePrimeAbs(N);
    if (a > bandMax) bandMax = a;
    if (a > p * (1 + 1e-12)) bandMono = false;
    p = a;
  }
  return {
    band: `[1e${d},1e${d + 1}]`,
    N_left: NL,
    T0_left: TL,
    u_left: uL,
    B_decade: B,
    band_monotone_decreasing: bandMono,
    tightness_B_over_bandmax: B / bandMax,
  };
});

const B_SPAN_CEILING = DECADE_ROWS[0].B_decade; // B(9) = global ceiling over [1e9,1e12]
// decay factor per decade (should be ~two orders: T^2 dominates)
const DECAY_9_TO_10 = DECADE_ROWS[0].B_decade / DECADE_ROWS[1].B_decade;
const DECAY_10_TO_11 = DECADE_ROWS[1].B_decade / DECADE_ROWS[2].B_decade;

export const IMP34750_CROSSOVER_GPP_POSTPEAK_PERDECADE_BOUND = {
  id: 'imp-34750',
  proofSection: 'S-frontier',
  question:
    'Assess whether the imp-34731/imp-34727 closed-form second-derivative ceiling ' +
    '|g_dd(N)| = 4 pi^2 K (u+1)/(T^2 u^3) of the inherited imp-33723 crossover map ' +
    'g(N) = K log T0(N) stays monotone-decreasing across the full post-peak span [1e9, 1e12], ' +
    'and tabulate the sharp per-decade left-endpoint bound B(decade). Assessment/measurement ' +
    'only on the inherited surrogate; adds no RH bound; no QED.',
  closedFormSecondDerivative:
    'g_dd(N) = -4 pi^2 K (u + 1) / (T^2 u^3),  T = T0(N), u = log(T/2pi), K = (C_C/E_trunc)^2',
  monotonicityArgument:
    'Across all of [1e9, 1e12] both T0(N) and u = log(T0/2pi) increase in N; the denominator ' +
    'T^2 u^3 grows quadratically in T and cubically in u while the numerator grows only like ' +
    '(u+1), and the growth gap widens past 1e10, so |g_dd| stays strictly decreasing and each ' +
    'sub-bands supremum is its left-endpoint value.',
  span: {
    lo: SPAN_LO,
    hi: SPAN_HI,
    K_amplitude: +K_AMPL.toExponential(6), // ~1.572709e8 (same as imp-34731)
    monotone_decreasing_on_full_span: SPAN_MONOTONE_DECREASING,
    max_abs_on_span: +SPAN_MAX_ABS.toExponential(6),
    argmax_N: +SPAN_ARGMAX.toExponential(3), // 1.000e9 (left endpoint of the whole span)
    span_ceiling_B: +B_SPAN_CEILING.toExponential(6), // ~1.480193e-10 (matches imp-34731)
  },
  perDecade: DECADE_ROWS.map((r) => ({
    band: r.band,
    N_left: +r.N_left.toExponential(0),
    T0_left: +r.T0_left.toExponential(6),
    u_left: +r.u_left.toExponential(6),
    B_decade: +r.B_decade.toExponential(6),
    band_monotone_decreasing: r.band_monotone_decreasing,
    tightness_B_over_bandmax: +r.tightness_B_over_bandmax.toFixed(6),
  })),
  decadeDecay: {
    B9_over_B10: +DECAY_9_TO_10.toExponential(3),
    B10_over_B11: +DECAY_10_TO_11.toExponential(3),
  },
  finding: {
    A1_monotonicity_extends:
      '|g_dd| is strictly monotone-decreasing on the entire [1e9, 1e12] span (300-point log ' +
      'grid); the imp-34731 [1e9, 1e10] result is not a narrow-window artifact -- the ' +
      'T^2 u^3 vs (u+1) growth gap holds and widens all the way to 1e12.',
    A2_per_decade_bounds:
      'On each decade [10^d, 10^(d+1)] the sharp bound B(d) is the closed-form left-endpoint ' +
      'value (per-band tightness ratio 1.000). B(9) ~ 1.4802e-10 is the global span ceiling ' +
      '(matches imp-34731), and B decays roughly two orders of magnitude per decade as T^2 ' +
      'dominates.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier-direction). The imp-34731/imp-34727 closed-form ceiling ' +
    '|g_dd(N)| = 4 pi^2 K (u+1)/(T^2 u^3) of the inherited imp-33723 crossover map ' +
    'g(N) = K log T0(N) stays MONOTONE-DECREASING across the full post-peak span [1e9, 1e12], ' +
    'not just the [1e9, 1e10] band it was proved on: both T0 and u = log(T0/2pi) increase in N ' +
    'and the T^2 u^3 denominator outgrows the (u+1) numerator (the gap widening past 1e10), ' +
    'confirmed on a 300-point log grid. Hence on each decade [10^d, 10^(d+1)] the sharp bound ' +
    'B(d) is the left-endpoint value, tabulated for d in {9, 10, 11}: the global span ceiling ' +
    'is B(9) ~ 1.4802e-10 (matching imp-34731 exactly) and B falls off ~ two orders of ' +
    'magnitude per decade. Assessment/measurement only on the INHERITED surrogate map; the ' +
    'C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34731 (closed-form g_dd + sharp ceiling B ~ 1.4802e-10 on [1e9,1e10]); imp-34727 ' +
    '(identical closed form inside its seed-band enclosure); imp-33723 (fixed point ' +
    'N = K log T0(N), g_prime = 2 pi K/(T u)); imp-33582 (post-peak decay-exponent ramp to ' +
    '1e12); lambda-rh-height-mapping (effectiveHeightForN, Riemann-von Mangoldt inverse); ' +
    'imp-2631 (E_trunc fixed-strip route); imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP34750_CROSSOVER_GPP_POSTPEAK_PERDECADE_BOUND_ASSERTIONS = [
  {
    // (A1): monotone-decreasing extends across the full [1e9,1e12] span; argmax at left endpoint.
    id: 'imp34750-monotone-decreasing-on-full-span',
    description: '|g_dd| monotone-decreasing on [1e9,1e12]; span argmax at the left endpoint',
    holds: () =>
      SPAN_MONOTONE_DECREASING && Math.abs(SPAN_ARGMAX - SPAN_LO) / SPAN_LO < 1e-6,
  },
  {
    // (A2): each decade band is decreasing so its sharp bound is the left-endpoint value.
    id: 'imp34750-per-decade-bound-is-left-endpoint',
    description: 'each decade band decreasing; per-band tightness B/bandmax = 1.000',
    holds: () =>
      DECADE_ROWS.every(
        (r) => r.band_monotone_decreasing && Math.abs(r.tightness_B_over_bandmax - 1) < 1e-9,
      ),
  },
  {
    // The span ceiling reproduces the imp-34731 endpoint value; bounds strictly decrease per decade.
    id: 'imp34750-span-ceiling-matches-imp34731-and-decays',
    description: 'B(9) ~ 1.4802e-10 (imp-34731) and B(9) > B(10) > B(11)',
    holds: () =>
      Math.abs(B_SPAN_CEILING / 1.480193e-10 - 1) < 1e-3 &&
      DECADE_ROWS[0].B_decade > DECADE_ROWS[1].B_decade &&
      DECADE_ROWS[1].B_decade > DECADE_ROWS[2].B_decade,
  },
  {
    // Honesty gate: assessment/measurement only, no QED, no refereed bound is changed.
    id: 'imp34750-honesty-gate-no-qed',
    description: 'Assessment only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34750_CROSSOVER_GPP_POSTPEAK_PERDECADE_BOUND.isRigorous === false &&
      /NO QED/.test(IMP34750_CROSSOVER_GPP_POSTPEAK_PERDECADE_BOUND.verdict) &&
      /refereed bound is changed/i.test(IMP34750_CROSSOVER_GPP_POSTPEAK_PERDECADE_BOUND.verdict),
  },
];

for (const a of IMP34750_CROSSOVER_GPP_POSTPEAK_PERDECADE_BOUND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34750-crossover-gpp-postpeak-perdecade-bound assertion failed: ${a.id}`);
  }
}
