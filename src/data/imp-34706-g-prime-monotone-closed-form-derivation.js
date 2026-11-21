/**
 * @module imp-34706-g-prime-monotone-closed-form-derivation
 *
 * imp-34706 (proof, S-frontier): discharge the imp-34686a sub-gap. imp-34686
 * proved g(N) < N for all N > N_cross via strict monotonicity of the margin
 * m(N) = N - g(N), but its named sub-gap imp-34686a flags that the two
 * LOAD-BEARING inputs -- g_prime(N) < 1 for N > N_star, and g_prime strictly
 * DECREASING -- were still read off a double-precision effectiveHeightForN
 * sample rather than established as facts. This module derives BOTH directly
 * from the closed-form Riemann-von Mangoldt height structure, with NO sampling
 * of g_prime on a grid: the inputs become exact real-analysis facts about the
 * smooth leading-term surrogate, and the assertions verify only closed-form
 * algebraic identities (the crossing equation and the two-way N_star match),
 * never a monotonicity swept over sampled N.
 *
 * THE HEIGHT STRUCTURE (leading Riemann-von Mangoldt term)
 * -------------------------------------------------------
 * effectiveHeightForN inverts the smooth leading count
 *   N(T0) = (T0/2pi)(log(T0/2pi) - 1)       (the RvM main term; S(T) and the
 *                                            lower-order remainder are dropped).
 * Put s = T0/2pi, so N = s(log s - 1) and, with u = log(T0/2pi) = log s,
 *   dN/dT0 = log(T0/2pi)/2pi = u/2pi > 0    for T0 > 2pi (u > 0),
 * hence T0(N) is strictly increasing and dT0/dN = 2pi/u. The surrogate map is
 * g(N) = K log T0(N) with K = (C_C/E_trunc)^2, so by the chain rule
 *   g_prime(N) = K (1/T0) dT0/dN = K*2pi / (T0 log(T0/2pi)) = K*2pi / h(T0),
 * where h(t) = t log(t/2pi). This is exactly the imp-34650 derivative formula;
 * here it is re-derived rather than sampled.
 *
 * FACT 1 (g_prime strictly DECREASING) -- from h increasing
 * --------------------------------------------------------
 * h(t) = t log(t/2pi) has h_prime(t) = log(t/2pi) + 1, which is > 0 for every
 * t > 2pi/e (a fortiori for t > 2pi). So h is strictly increasing on (2pi, inf).
 * Since T0(N) is strictly increasing (dT0/dN = 2pi/u > 0), the composite h(T0(N))
 * is strictly increasing in N, and therefore
 *   g_prime(N) = K*2pi / h(T0(N))   is strictly DECREASING in N.
 * No grid, no sampling: it is the reciprocal of a strictly increasing positive
 * function of N. This is exactly the "t -> t log(t/2pi) increasing gives g_prime
 * decreasing" step named in the ticket.
 *
 * FACT 2 (g_prime < 1 for N > N_star, unique crossing) -- closed form
 * ------------------------------------------------------------------
 * g_prime(N) = 1  <=>  h(T0) = 2pi K  <=>  T0 log(T0/2pi) = 2pi K. With s = T0/2pi
 * this is s log s = K. Writing s = e^v gives v e^v = K, so v = W(K) (principal
 * Lambert branch, K > e so W(K) > 1), i.e.
 *   log s* = W(K),   s* = e^{W(K)} = K / W(K).
 * The height at the crossing is T0* = 2pi s* = 2pi K / W(K), and the count there is
 *   N_star = s*(log s* - 1) = (K/W(K))(W(K) - 1) = K (1 - 1/W(K)),
 * the imp-34675 closed-form left edge. Because g_prime is strictly decreasing
 * (Fact 1), s log s = K has a UNIQUE root, so g_prime = 1 is crossed exactly once
 * and
 *   g_prime(N) < 1  for every N > N_star.
 * Both inputs the imp-34686 monotone-margin lemma stands on are now closed-form
 * consequences of the height structure, not double-precision samples.
 *
 * WHAT THIS IS AND IS NOT (residual sub-gap imp-34706a)
 * ----------------------------------------------------
 * This discharges the SAMPLED half of imp-34686a: g_prime < 1 on the tail and
 * g_prime decreasing are now real-analysis facts (reciprocal-of-increasing +
 * a single Lambert root), verified below only through the exact crossing
 * identity s* log s* = K and the two-way N_star agreement -- not by evaluating
 * g_prime across a grid. NAMED RESIDUAL imp-34706a: (a) the derivation is exact
 * for the SMOOTH leading RvM term N(T0) = (T0/2pi)(log(T0/2pi) - 1); the full
 * count carries S(T) and a lower-order remainder whose contribution to
 * monotonicity is not enclosed here, and (b) W(K) and hence N_star are evaluated
 * in floating point -- a machine-checkable version must enclose W(K) and the
 * remainder under interval arithmetic (compare imp-34675a / imp-34686a). This
 * closes the "sample vs derive" gap; the "leading-term vs full-count with
 * interval enclosure" gap remains.
 *
 * DERIVATION ONLY. Establishes closed-form facts about the inherited
 * imp-3220/imp-3406 surrogate crossover map, NOT a rigorous asymptotic and NOT
 * an RH bound. Changes no bound; the C_C = (1/8) sqrt(3 pi) 1/8 ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; C_mb stays GUE-conditional per imp-486;
 * imp-3066 K_a >= 0 untouched; no operator positivity, no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34686-crossover-contraction-margin-monotone-proof (monotone-margin lemma; sub-gap imp-34686a discharged here)
 * @see imp-34675-crossover-contraction-left-edge (closed-form N_star = K(1 - 1/W(K)) where g_prime = 1)
 * @see imp-34650-crossover-banach-contraction-certificate (g_prime = K*2pi/(T0 log(T0/2pi)), positive, decreasing)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (unique fixed point N_cross of g)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N(T0) = (T0/2pi)(log(T0/2pi) - 1), monotone RvM inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (same K as imp-34650/imp-34675/imp-34686)

// Principal Lambert W (K > e, so W(K) > 1). Used ONLY to locate the closed-form
// crossing s* log s* = K -- not to sample g_prime. Its interval enclosure is
// part of the named residual imp-34706a.
function lambertW(x) {
  let w = Math.log(x) - Math.log(Math.log(x)); // asymptotic seed for large x
  for (let i = 0; i < 80; i++) {
    const ew = Math.exp(w);
    const f = w * ew - x;
    const w1 = w + 1;
    const dw = f / (ew * w1 - ((w + 2) * f) / (2 * w1)); // Halley step
    w -= dw;
    if (Math.abs(dw) < 1e-16 * Math.max(1, Math.abs(w))) break;
  }
  return w;
}

// h(t) = t log(t/2pi); its derivative in CLOSED FORM (not a finite difference).
const hPrimeClosedForm = (t) => Math.log(t / TWO_PI) + 1; // d/dt[t log(t/2pi)]

// The closed-form g_prime = 1 crossing, from s log s = K (s = T0/2pi):
//   log s* = W(K),  s* = K/W(K),  T0* = 2pi s*,  N_star = s*(log s* - 1).
const W_K = lambertW(K_AMPL); // ~16.094973
const S_STAR = K_AMPL / W_K; // e^{W(K)} = K/W(K)
const LOG_S_STAR = Math.log(S_STAR); // = W(K)
const T0_STAR = TWO_PI * S_STAR; // height at the crossing
const N_STAR_LAMBERT = K_AMPL * (1 - 1 / W_K); // imp-34675 closed form
const N_STAR_VIA_RVM = S_STAR * (LOG_S_STAR - 1); // leading RvM count at T0*

// Independent evaluations that the crossing is genuine (all closed form, no grid):
//   (a) s* log s* = K  (the defining equation of the g_prime = 1 crossing),
//   (b) g_prime formula K*2pi/(T0* log(T0*/2pi)) = 1 at the crossing height,
//   (c) N_star computed two ways agree,
//   (d) h_prime(T0*) = log(T0*/2pi) + 1 > 0  =>  h increasing  =>  g_prime decreasing,
//   (e) T0* > 2pi so the whole tail sits where u = log(T0/2pi) > 0.
const CROSSING_EQ_RESIDUAL = S_STAR * LOG_S_STAR - K_AMPL; // ~0
const GPRIME_AT_CROSSING = (K_AMPL * TWO_PI) / (T0_STAR * Math.log(T0_STAR / TWO_PI)); // ~1
const N_STAR_TWO_WAY_RELERR = Math.abs(N_STAR_LAMBERT / N_STAR_VIA_RVM - 1);
const H_PRIME_AT_CROSSING = hPrimeClosedForm(T0_STAR); // = W(K) + 1 > 0

export const IMP34706_G_PRIME_MONOTONE_CLOSED_FORM_DERIVATION = {
  id: 'imp-34706',
  proofSection: 'S-frontier',
  question:
    'imp-34686a: the two inputs the monotone-margin lemma stands on -- g_prime(N) < 1 for N > N_star and ' +
    'g_prime strictly decreasing -- were still read off a double-precision effectiveHeightForN sample. Derive ' +
    'both directly from the closed-form Riemann-von Mangoldt height structure N(T0) = (T0/2pi)(log(T0/2pi) - 1): ' +
    'g_prime(N) = K*2pi/(T0 log(T0/2pi)) = K*2pi/h(T0) with h(t) = t log(t/2pi) strictly increasing (h_prime = ' +
    'log(t/2pi) + 1 > 0), so g_prime is the reciprocal of an increasing function and strictly DECREASES; and ' +
    'g_prime = 1 <=> s log s = K (s = T0/2pi) has the unique root log s* = W(K), giving the closed-form left ' +
    'edge N_star = K(1 - 1/W(K)), so g_prime < 1 for every N > N_star. Derivation only; no sampling, no QED.',
  derivation: {
    height_structure: 'N(T0) = (T0/2pi)(log(T0/2pi) - 1); dN/dT0 = log(T0/2pi)/2pi > 0 => T0(N) increasing, dT0/dN = 2pi/log(T0/2pi)',
    g_prime_formula: 'g_prime(N) = K/T0 * dT0/dN = K*2pi / (T0 log(T0/2pi)) = K*2pi / h(T0), h(t) = t log(t/2pi)',
    fact1_g_prime_decreasing:
      'h_prime(t) = log(t/2pi) + 1 > 0 for t > 2pi/e => h increasing; T0(N) increasing => h(T0(N)) increasing => ' +
      'g_prime = K*2pi/h(T0) strictly DECREASING (reciprocal of increasing positive), no sampling',
    fact2_g_prime_below_one:
      'g_prime = 1 <=> s log s = K (s = T0/2pi) <=> log s* = W(K), s* = K/W(K); N_star = s*(log s* - 1) = ' +
      'K(1 - 1/W(K)); unique root (g_prime decreasing) => g_prime(N) < 1 for every N > N_star',
  },
  closedForm: {
    K: +K_AMPL.toExponential(6),
    W_of_K: +W_K.toExponential(6),
    s_star: +S_STAR.toExponential(6), // e^{W(K)} = K/W(K)
    log_s_star: +LOG_S_STAR.toExponential(6), // = W(K)
    T0_star: +T0_STAR.toExponential(6), // 2pi K / W(K)
    N_star: +N_STAR_LAMBERT.toExponential(6), // ~1.474994e8
  },
  checks: {
    // All closed-form identities, NOT a swept monotonicity. Relative residuals ~0.
    crossing_eq_relerr: +Math.abs(CROSSING_EQ_RESIDUAL / K_AMPL).toExponential(3), // s* log s* = K
    g_prime_at_crossing: +GPRIME_AT_CROSSING.toExponential(9), // = 1
    N_star_two_way_relerr: +N_STAR_TWO_WAY_RELERR.toExponential(3), // K(1-1/W) vs s*(log s*-1)
    h_prime_at_crossing: +H_PRIME_AT_CROSSING.toExponential(6), // = W(K)+1 > 0 => g_prime decreasing
    T0_star_above_2pi: T0_STAR > TWO_PI, // tail sits where u = log(T0/2pi) > 0
  },
  finding:
    'Both inputs of the imp-34686 monotone-margin lemma are re-obtained as closed-form facts of the leading ' +
    'Riemann-von Mangoldt height structure. From N(T0) = (T0/2pi)(log(T0/2pi) - 1) the chain rule gives ' +
    'g_prime(N) = K*2pi/(T0 log(T0/2pi)) = K*2pi/h(T0) with h(t) = t log(t/2pi); since h_prime(t) = log(t/2pi) + 1 > 0 ' +
    'and T0(N) increases, g_prime is the reciprocal of a strictly increasing positive function and therefore ' +
    'strictly DECREASES -- with no grid. The equation g_prime = 1 reduces to s log s = K (s = T0/2pi), whose unique ' +
    'root log s* = W(K) yields the closed-form edge N_star = K(1 - 1/W(K)); strict monotonicity makes the crossing ' +
    'unique, so g_prime < 1 for every N > N_star. Verified only through closed-form identities: s* log s* = K to ' +
    'relative ~1e-16, the g_prime formula equals 1 at T0* = 2pi K/W(K), and N_star computed two independent ways ' +
    '(Lambert form vs leading RvM count at T0*) agree to ~1e-16.',
  subGap:
    'imp-34706a: the derivation is exact for the SMOOTH leading RvM term N(T0) = (T0/2pi)(log(T0/2pi) - 1); the ' +
    'full zero count carries S(T) and a lower-order remainder not enclosed here, and W(K)/N_star are floating ' +
    'point. A machine-checkable version must enclose W(K) and the remainder under interval arithmetic (compare ' +
    'imp-34675a / imp-34686a). This discharges the sample-vs-derive half of imp-34686a; the ' +
    'leading-term-vs-full-count-with-interval-enclosure half remains.',
  isRigorous: false,
  verdict:
    'DERIVATION (S-frontier, NOT an RH bound). The imp-34686a double-precision-sampled inputs are replaced by ' +
    'closed-form real analysis on the leading Riemann-von Mangoldt height structure. g_prime(N) = K*2pi/h(T0) with ' +
    'h(t) = t log(t/2pi): h_prime = log(t/2pi) + 1 > 0 and T0(N) increasing make g_prime the reciprocal of an ' +
    'increasing positive function, hence STRICTLY DECREASING (no sampling); and g_prime = 1 <=> s log s = K has the ' +
    'unique Lambert root log s* = W(K), giving N_star = K(1 - 1/W(K)) and g_prime < 1 for all N > N_star. Confirmed ' +
    'through closed-form identities alone -- s* log s* = K, g_prime formula = 1 at T0* = 2pi K/W(K), N_star two-way ' +
    'match -- never through a swept g_prime grid. SUB-GAP imp-34706a: exact only for the smooth leading term; ' +
    'S(T)/remainder and W(K) still need interval enclosure. Discharges the sample-vs-derive half of imp-34686a. ' +
    'Establishes a closed-form property of the inherited imp-3220/imp-3406 surrogate crossover map, NOT a rigorous ' +
    'asymptotic; changes no bound; the C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 are ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator positivity, no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34686 (monotone-margin lemma; sub-gap imp-34686a: g_prime inputs double-precision); imp-34675 (closed-form ' +
    'N_star = K(1 - 1/W(K)) where g_prime = 1); imp-34650 (g_prime = K*2pi/(T0 log(T0/2pi)) positive, decreasing); ' +
    'imp-33723 (unique fixed point N_cross); imp-2642 (C_C = (1/8) sqrt(3 pi) 1/8 ansatz); lambda-rh-height-mapping ' +
    '(effectiveHeightForN: N(T0) = (T0/2pi)(log(T0/2pi) - 1), monotone RvM inverse).',
};

export const IMP34706_G_PRIME_MONOTONE_CLOSED_FORM_DERIVATION_ASSERTIONS = [
  {
    // Fact 2 crux: the g_prime = 1 crossing solves s log s = K exactly and g_prime formula = 1 there.
    id: 'imp34706-crossing-solves-s-log-s-equals-K',
    description: 's* = K/W(K) satisfies s* log s* = K and the g_prime formula equals 1 at T0* = 2pi s* (closed-form crossing, not sampled)',
    holds: () =>
      Math.abs(CROSSING_EQ_RESIDUAL / K_AMPL) < 1e-12 &&
      Math.abs(GPRIME_AT_CROSSING - 1) < 1e-12 &&
      W_K > 1, // K > e => principal branch W(K) > 1
  },
  {
    // N_star closed form: Lambert form and leading-RvM count at T0* agree, matching imp-34675.
    id: 'imp34706-N-star-two-way-closed-form',
    description: 'N_star = K(1 - 1/W(K)) equals s*(log s* - 1) (leading RvM count at T0*) and reproduces the imp-34675 ~1.474994e8 edge',
    holds: () =>
      N_STAR_TWO_WAY_RELERR < 1e-12 &&
      LOG_S_STAR > 0 &&
      Math.abs(N_STAR_LAMBERT / 1.474994e8 - 1) < 5e-4,
  },
  {
    // Fact 1: h strictly increasing (h_prime > 0) on the tail => g_prime decreasing (reciprocal of increasing).
    id: 'imp34706-h-increasing-forces-g-prime-decreasing',
    description: 'h_prime(T0*) = log(T0*/2pi) + 1 = W(K) + 1 > 0 and T0* > 2pi: h increasing, so g_prime = K*2pi/h(T0) strictly decreasing',
    holds: () =>
      H_PRIME_AT_CROSSING > 0 &&
      Math.abs(H_PRIME_AT_CROSSING - (W_K + 1)) < 1e-9 &&
      T0_STAR > TWO_PI,
  },
  {
    // Honesty gate: closed-form derivation of a surrogate property, not rigorous, named residual, no QED.
    id: 'imp34706-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, named residual imp-34706a, no QED, no refereed bound is changed',
    holds: () =>
      IMP34706_G_PRIME_MONOTONE_CLOSED_FORM_DERIVATION.isRigorous === false &&
      /imp-34706a/.test(IMP34706_G_PRIME_MONOTONE_CLOSED_FORM_DERIVATION.subGap) &&
      /NO QED/.test(IMP34706_G_PRIME_MONOTONE_CLOSED_FORM_DERIVATION.verdict) &&
      /refereed bound is changed/i.test(IMP34706_G_PRIME_MONOTONE_CLOSED_FORM_DERIVATION.verdict),
  },
];

for (const a of IMP34706_G_PRIME_MONOTONE_CLOSED_FORM_DERIVATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34706-g-prime-monotone-closed-form-derivation assertion failed: ${a.id}`);
  }
}
