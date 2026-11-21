/**
 * @module imp-34714-krawczyk-existence-uniqueness-lemma
 *
 * imp-34714 (proof, frontier): imp-34687 observed inline that on T > 2pi the Riemann-von Mangoldt
 * count f(T) = (T/2pi)(log(T/2pi) - 1) - N has f_prime > 0 and f_dblprime > 0, "exactly the regime
 * in which the interval-Newton / Krawczyk operator is a VERIFIED contraction to a unique root: one
 * Krawczyk step both proves existence-uniqueness and encloses T0" -- but stated it as scope, never
 * formalized. This module FORMALIZES that as a standalone lemma for this specific f, separating the
 * exact real-analysis content (existence, uniqueness, enclosure, contraction rate) from the
 * unimplemented directed-rounding layer (the imp-34687a named sub-gap). Derivation only; no machine
 * certificate; NO QED.
 *
 * LEMMA (Krawczyk existence-uniqueness for the RvM height inverse)
 * ---------------------------------------------------------------
 * Let f(T) = (T/2pi)(log(T/2pi) - 1) - N on the domain T > 2pi, so
 *   f_prime(T)    = log(T/2pi)/2pi,
 *   f_dblprime(T) = 1/(2pi T) > 0                 (strictly convex on T > 2pi).
 * Fix a bracket [T] = [T_lo, T_hi] with T_lo > 2pi, let m = mid([T]), and let
 *   [f_prime] := f_prime([T]) = [ log(T_lo/2pi), log(T_hi/2pi) ] / 2pi
 * be the range of f_prime over [T] (EXACT, because f_prime is monotone increasing so its range on an
 * interval is the interval of its endpoint values). Assume:
 *   (H1) NONVANISHING DERIVATIVE:  0 not in [f_prime]  <=>  T_lo > 2pi  (=> log(T_lo/2pi) > 0).
 *   (H2) SELF-MAP:                 the interval-Newton image
 *          N([T]) := m - f(m) / [f_prime]     satisfies   N([T]) subset [T].
 * THEN f has EXACTLY ONE zero T0 in [T], and T0 in N([T]). If moreover N([T]) subset int([T]) (strict),
 * the interval-Newton iteration [T]^(k+1) = N([T]^(k)) intersect [T]^(k) converges to T0.
 *
 * DERIVATION (three pieces, all EXACT real analysis)
 * --------------------------------------------------
 *  (a) UNIQUENESS. (H1) makes f_prime of constant sign on [T] (here strictly positive), so f is
 *      strictly monotone on [T] -- at most one zero.
 *  (b) EXISTENCE + ENCLOSURE. For any zero T_star in [T], the mean-value form gives
 *      f(m) - f(T_star) = f_prime(xi) (m - T_star) for some xi in [T]; since f(T_star) = 0,
 *      T_star = m - f(m)/f_prime(xi) in m - f(m)/[f_prime] = N([T]). So EVERY zero lies in N([T]).
 *      Conversely f is continuous and strictly monotone, and (H2) with the mean-value map shows the
 *      contraction T -> m - f(m)/f_prime([T]) sends [T] into itself; by the IVT for the monotone f a
 *      zero EXISTS in N([T]) subset [T]. Hence exactly one T0, and T0 in N([T]).
 *  (c) CONTRACTION RATE. With the Krawczyk operator
 *          K([T]) = m - Y f(m) + (1 - Y [f_prime]) ([T] - m),   Y = 1/f_prime(m),
 *      the linear contraction factor is
 *          rho = mag(1 - Y [f_prime]) = max( |1 - f_prime(T_lo)/f_prime(m)|, |1 - f_prime(T_hi)/f_prime(m)| ).
 *      For relative half-width delta = (T_hi - m)/m one has f_prime(T_hi)/f_prime(m) = 1 + delta/U + O(delta^2)
 *      with U = log(m/2pi), so rho ~ delta/U: the monotone-and-convex regime (U ~ 17.9 at N = 1e9) makes
 *      one Krawczyk step contract by ~delta/U << 1, and the iteration is quadratically convergent.
 *
 * SEPARATION OF CONCERNS (the imp-34714 point)
 * --------------------------------------------
 * The lemma is a statement of REAL ANALYSIS: given the EXACT real value f(m) and the EXACT range
 * [f_prime], hypotheses (H1)-(H2) imply existence-uniqueness with no reference to floating point. The
 * imp-34687a directed-rounding layer is required ONLY to certify, on a machine, that the COMPUTED f(m)
 * and [f_prime] are outward-rounded enclosures of those exact quantities; it does not touch the
 * mathematical content. imp-34714 thus isolates the exact Krawczyk existence-uniqueness statement
 * (this lemma) from the unimplemented directed-rounding implementation gap.
 *
 * CONCRETE VERIFICATION AT N = 1e9 (double-precision SURROGATE for the exact evaluations)
 * --------------------------------------------------------------------------------------
 * On the a-priori bracket [T] = [3.7180e8, 3.7195e8] (width 1.5e5, straddling T0):
 *   f(T_lo) = -1.9996e5 < 0,  f(T_hi) = 2.2728e5 > 0     (sign change: a zero exists)
 *   [f_prime] = [2.84823520, 2.84829940]                 (excludes 0: (H1) holds)
 *   N([T]) = [3.7187020448e8, 3.7187020459e8] subset int([T])   ((H2) holds, strict)
 *   encloses T0 = 3.7187020453e8; one step shrinks width 1.5e5 -> 1.08e-1 (ratio ~7.2e-7)
 *   Krawczyk contraction rho = 1.127e-5  (matches delta/U with delta = 2.017e-4, U = 17.896).
 * So one Krawczyk step BOTH proves existence-uniqueness (H1)+(H2) hold, strict) AND encloses T0, as
 * imp-34687 asserted -- now as a formalized lemma rather than an inline remark.
 *
 * WHAT THIS IS AND IS NOT (sub-gap)
 * ---------------------------------
 * NAMED SUB-GAP imp-34714a: the concrete verification evaluates f(m) and [f_prime] in DOUBLE PRECISION
 * (roundoff modelled as a few ULP); turning (H1)-(H2) into a machine-checked certificate needs the
 * imp-34687a directed-rounding / error-bounded arithmetic layer (JS Math has no directed rounding). The
 * lemma STATEMENT is exact and complete; only its machine instantiation carries the rounding gap.
 *
 * DERIVATION ONLY. This formalizes a real-analysis lemma about the interval-Newton solver for the
 * inherited imp-3220/imp-3406 surrogate crossover map, NOT a rigorous asymptotic and NOT an RH bound.
 * C_C = (1/8) sqrt(3 pi) 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per imp-486
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34687-crossover-interval-arithmetic-scope (scoped the IA upgrade; named sub-gap imp-34687a)
 * @see imp-34650-crossover-banach-contraction-certificate (L-contraction certificate on I = [1e9, 1e10])
 * @see imp-34676-crossover-contraction-right-widening (right-widening of the same binding regime at a = 1e9)
 * @see imp-34693-crossover-contraction-seed-band (quantitative seed-band refinement of the same Banach certificate; parallel exact-lemma-vs-machine-certificate distinction)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse, Newton solver)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON;

// The specific f and its exact derivative (f is strictly monotone-increasing and convex on T > 2pi).
const f = (T) => (T / TWO_PI) * (Math.log(T / TWO_PI) - 1) - N_TARGET;
const fPrime = (T) => Math.log(T / TWO_PI) / TWO_PI; // range on [T] follows from monotonicity of f_prime

// Binding regime: the imp-34687 left endpoint N = 1e9 (same crossover as imp-34650/imp-34675/imp-34676).
const N_TARGET = 1e9;
const T0 = effectiveHeightForN(N_TARGET); // 3.7187020453e8

// A-priori bracket that straddles T0 (chosen off-centre so contraction, not luck, does the work).
const T_LO = 3.718e8;
const T_HI = 3.7195e8;
const M = 0.5 * (T_LO + T_HI); // midpoint

// (H1) exact derivative range over [T] (f_prime increasing -> endpoint values), must exclude 0.
const FP_LO = fPrime(T_LO);
const FP_HI = fPrime(T_HI);
const H1_DERIVATIVE_NONVANISHING = FP_LO > 0 && FP_HI > 0; // 0 not in [f_prime] <=> T_lo > 2pi

// Sign change on the bracket endpoints -> a zero exists (IVT for the continuous f).
const F_LO = f(T_LO);
const F_HI = f(T_HI);
const STRADDLES_ROOT = F_LO < 0 && F_HI > 0;

// (H2) interval-Newton image N([T]) = m - f(m)/[f_prime]; interval division by a positive interval.
const F_M = f(M);
const Q_LO = F_M > 0 ? F_M / FP_HI : F_M / FP_LO; // lower end of f(m)/[f_prime]
const Q_HI = F_M > 0 ? F_M / FP_LO : F_M / FP_HI; // upper end of f(m)/[f_prime]
const N_LO = M - Q_HI;
const N_HI = M - Q_LO;
const H2_SELF_MAP_STRICT = N_LO > T_LO && N_HI < T_HI; // N([T]) subset int([T]) (strict)
const T0_ENCLOSED = N_LO <= T0 && T0 <= N_HI; // the unique root lies in the one-step image

// (c) Krawczyk linear contraction factor with preconditioner Y = 1/f_prime(m).
const Y = 1 / fPrime(M);
const RHO = Math.max(Math.abs(1 - Y * FP_LO), Math.abs(1 - Y * FP_HI));
const U_MID = Math.log(M / TWO_PI); // U = log(m/2pi) ~ 17.9
const DELTA = (T_HI - M) / M; // relative half-width
const RHO_MODEL = DELTA / U_MID; // rho ~ delta/U prediction

// One step shrinks the bracket by this ratio (quadratic thereafter).
const WIDTH_OLD = T_HI - T_LO;
const WIDTH_NEW = N_HI - N_LO;
const WIDTH_RATIO = WIDTH_NEW / WIDTH_OLD;

export const IMP34714_KRAWCZYK_EXISTENCE_UNIQUENESS_LEMMA = {
  id: 'imp-34714',
  proofSection: 'S-frontier',
  question:
    'imp-34687 stated inline that on T > 2pi the RvM count f(T) = (T/2pi)(log(T/2pi) - 1) - N has ' +
    'f_prime > 0 and f_dblprime > 0, the regime in which one interval-Newton / Krawczyk step both proves ' +
    'existence-uniqueness and encloses T0. Formalize that as a standalone lemma for this specific f, ' +
    'separating the exact real-analysis content (existence, uniqueness, enclosure, contraction rate) ' +
    'from the unimplemented directed-rounding layer (the imp-34687a sub-gap). Derivation only; no machine ' +
    'certificate; certifies a property of the inherited surrogate crossover, NOT an RH bound; no QED.',
  lemma: {
    statement:
      'For f(T) = (T/2pi)(log(T/2pi) - 1) - N on T > 2pi (f_prime = log(T/2pi)/2pi, f_dblprime = ' +
      '1/(2pi T) > 0) and a bracket [T] = [T_lo, T_hi] with T_lo > 2pi, m = mid([T]), and the EXACT ' +
      'derivative range [f_prime] = [log(T_lo/2pi), log(T_hi/2pi)]/2pi: if (H1) 0 not in [f_prime] and ' +
      '(H2) N([T]) = m - f(m)/[f_prime] subset [T], then f has EXACTLY ONE zero T0 in [T] and T0 in ' +
      'N([T]); if N([T]) subset int([T]) the interval-Newton iteration converges to T0.',
    hypotheses: {
      H1_derivative_nonvanishing: '0 not in [f_prime], i.e. T_lo > 2pi so log(T_lo/2pi) > 0',
      H2_self_map: 'N([T]) = m - f(m)/[f_prime] subset [T] (strict inclusion gives convergence)',
      convexity_regime: 'f_dblprime = 1/(2pi T) > 0 on T > 2pi -> f_prime monotone -> its range is exact',
    },
    conclusion:
      'unique zero T0 in [T]; T0 enclosed by the one-step image N([T]); linear contraction factor ' +
      'rho = mag(1 - f_prime(m)^-1 [f_prime]) ~ delta/U with U = log(m/2pi), delta the relative half-width',
    derivation: {
      uniqueness: '(H1) => f_prime constant sign => f strictly monotone on [T] => at most one zero',
      existence_enclosure:
        'mean-value: every zero T_star = m - f(m)/f_prime(xi) in N([T]); (H2) + IVT for monotone f => a ' +
        'zero exists in N([T]) subset [T]',
      contraction:
        'Krawczyk K([T]) = m - Y f(m) + (1 - Y[f_prime])([T] - m), Y = 1/f_prime(m); rho = ' +
        'mag(1 - Y[f_prime]) ~ delta/U << 1 in the U ~ 17.9 regime',
    },
  },
  verification: {
    // Double-precision surrogate for the exact evaluations; certifies nothing (see imp-34714a).
    N_target: +N_TARGET.toExponential(0),
    T0: +T0.toExponential(9), // 3.718702045e8
    bracket: [+T_LO.toExponential(6), +T_HI.toExponential(6)],
    f_endpoints: [+F_LO.toExponential(4), +F_HI.toExponential(4)], // sign change -> zero exists
    straddles_root: STRADDLES_ROOT,
    fprime_range: [+FP_LO.toExponential(8), +FP_HI.toExponential(8)], // excludes 0 -> (H1)
    H1_derivative_nonvanishing: H1_DERIVATIVE_NONVANISHING,
    newton_image: [+N_LO.toExponential(10), +N_HI.toExponential(10)],
    H2_self_map_strict: H2_SELF_MAP_STRICT, // N([T]) subset int([T])
    T0_enclosed_by_one_step: T0_ENCLOSED,
    krawczyk_rho: +RHO.toExponential(4), // 1.127e-5
    rho_model_delta_over_U: +RHO_MODEL.toExponential(4), // ~delta/U cross-check
    U_mid: +U_MID.toExponential(6), // 17.896191
    width_ratio_one_step: +WIDTH_RATIO.toExponential(4), // ~7.2e-7
  },
  finding:
    'The imp-34687 inline remark is now a formalized lemma: for f(T) = (T/2pi)(log(T/2pi) - 1) - N on ' +
    'T > 2pi, hypotheses (H1) 0 not in [f_prime] and (H2) N([T]) subset [T] imply f has EXACTLY ONE zero ' +
    'T0 in [T], enclosed by the one-step interval-Newton image, with existence from the mean-value / IVT ' +
    'argument, uniqueness from strict monotonicity (f_prime of constant sign), and a Krawczyk linear ' +
    'contraction factor rho = mag(1 - f_prime(m)^-1 [f_prime]) ~ delta/U. At N = 1e9 the a-priori bracket ' +
    '[3.7180e8, 3.7195e8] straddles T0 (f_lo < 0 < f_hi), [f_prime] = [2.84823520, 2.84829940] excludes ' +
    '0, and one Krawczyk step maps it strictly inside itself to [3.7187020448e8, 3.7187020459e8], ' +
    'enclosing T0 = 3.7187020453e8 and shrinking the width by ~7.2e-7 (rho = 1.127e-5, matching ' +
    'delta/U = 2.017e-4/17.896). The lemma is EXACT real analysis in f(m) and the exact range [f_prime]; ' +
    'the ONLY remaining gap is the imp-34687a directed-rounding layer needed to certify the machine ' +
    'evaluations of f(m) and [f_prime] as outward-rounded enclosures.',
  subGap:
    'imp-34714a: the concrete verification evaluates f(m) and [f_prime] in DOUBLE PRECISION (few-ULP ' +
    'roundoff model), so it demonstrates the lemma hypotheses rather than machine-certifying them; a ' +
    'formal certificate needs the imp-34687a directed-rounding / error-bounded arithmetic layer (JS Math ' +
    'has no directed rounding). The lemma STATEMENT is exact and complete; only its machine instantiation ' +
    'carries the rounding gap. This adds no RH bound.',
  isRigorous: false,
  verdict:
    'FORMALIZED LEMMA (frontier, NOT an RH bound). The imp-34687 inline claim -- one interval-Newton / ' +
    'Krawczyk step proves existence-uniqueness and encloses T0 for f(T) = (T/2pi)(log(T/2pi) - 1) - N -- ' +
    'is stated and derived as a standalone lemma. HYPOTHESES: (H1) 0 not in the exact derivative range ' +
    '[f_prime] = [log(T_lo/2pi), log(T_hi/2pi)]/2pi (i.e. T_lo > 2pi), and (H2) the interval-Newton image ' +
    'N([T]) = m - f(m)/[f_prime] subset [T]. CONCLUSION: exactly one zero T0 in [T], enclosed by N([T]); ' +
    'strict inclusion gives quadratic convergence. DERIVATION is exact real analysis -- uniqueness from ' +
    'strict monotonicity (f_prime constant sign), existence/enclosure from the mean-value form plus IVT ' +
    'for the monotone f, and a Krawczyk contraction factor rho = mag(1 - f_prime(m)^-1 [f_prime]) ~ ' +
    'delta/U with U = log(m/2pi). Verified at N = 1e9 on the a-priori bracket [3.7180e8, 3.7195e8]: it ' +
    'straddles T0, [f_prime] = [2.84823520, 2.84829940] excludes 0, and one Krawczyk step maps strictly ' +
    'inside to [3.7187020448e8, 3.7187020459e8] enclosing T0 = 3.7187020453e8, rho = 1.127e-5, width ' +
    'ratio ~7.2e-7. SEPARATION OF CONCERNS: the lemma is EXACT in the real values f(m) and [f_prime]; the ' +
    'imp-34687a directed-rounding layer is needed ONLY to certify the machine evaluations, not the ' +
    'mathematical content. SUB-GAP imp-34714a: the verification uses a double-precision surrogate (few-ULP ' +
    'roundoff model), not a machine certificate. This formalizes a property of the interval-Newton solver ' +
    'for the inherited imp-3220/imp-3406 surrogate crossover map, NOT a rigorous asymptotic; the C_C 1/8 ' +
    'ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 ' +
    'untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34687 (crossover interval-arithmetic scope; the inline Krawczyk remark now formalized; sub-gap ' +
    'imp-34687a directed-rounding layer); imp-34650 (Banach contraction certificate on I = [1e9, 1e10]); ' +
    'imp-33723 (crossover fixed point N_cross); imp-2642 (C_C = (1/8) sqrt(3 pi) 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN, Newton inverse of the Riemann-von Mangoldt count). ' +
    'Interval-Newton / Krawczyk existence-uniqueness: Moore, Krawczyk, Neumaier (standard IA theory).',
};

export const IMP34714_KRAWCZYK_EXISTENCE_UNIQUENESS_LEMMA_ASSERTIONS = [
  {
    // (H1) the exact derivative range excludes 0 -> f strictly monotone -> uniqueness.
    id: 'imp34714-H1-derivative-nonvanishing',
    description: '0 not in [f_prime] = [log(T_lo/2pi), log(T_hi/2pi)]/2pi (T_lo > 2pi) -> unique zero',
    holds: () => H1_DERIVATIVE_NONVANISHING && FP_LO > 0 && T_LO > TWO_PI,
  },
  {
    // Endpoint sign change -> a zero exists (IVT for the continuous f).
    id: 'imp34714-straddles-root',
    description: 'f(T_lo) < 0 < f(T_hi): the bracket straddles a zero of f',
    holds: () => STRADDLES_ROOT && F_LO < 0 && F_HI > 0,
  },
  {
    // (H2) one interval-Newton step maps [T] strictly inside itself and encloses T0.
    id: 'imp34714-H2-self-map-encloses-T0',
    description: 'N([T]) = m - f(m)/[f_prime] subset int([T]) and encloses T0 (existence-uniqueness verified)',
    holds: () => H2_SELF_MAP_STRICT && T0_ENCLOSED && N_LO > T_LO && N_HI < T_HI,
  },
  {
    // Krawczyk contraction factor is small and matches the delta/U model.
    id: 'imp34714-krawczyk-contraction-rate',
    description: 'rho = mag(1 - f_prime(m)^-1 [f_prime]) << 1 and rho ~ delta/U (U ~ 17.9); width shrinks ~7e-7',
    holds: () =>
      RHO > 0 &&
      RHO < 1e-3 &&
      Math.abs(RHO - RHO_MODEL) / RHO_MODEL < 0.05 &&
      WIDTH_RATIO > 0 &&
      WIDTH_RATIO < 1e-5,
  },
  {
    // Honesty gate: formalized lemma / surrogate verification, not rigorous, no QED, no refereed bound is changed.
    id: 'imp34714-honesty-gate-no-qed',
    description: 'Lemma + surrogate: isRigorous false, named sub-gap imp-34714a, no QED, no refereed bound is changed',
    holds: () =>
      IMP34714_KRAWCZYK_EXISTENCE_UNIQUENESS_LEMMA.isRigorous === false &&
      /imp-34714a/.test(IMP34714_KRAWCZYK_EXISTENCE_UNIQUENESS_LEMMA.subGap) &&
      /NO QED/.test(IMP34714_KRAWCZYK_EXISTENCE_UNIQUENESS_LEMMA.verdict) &&
      /refereed bound is changed/i.test(IMP34714_KRAWCZYK_EXISTENCE_UNIQUENESS_LEMMA.verdict),
  },
];

for (const a of IMP34714_KRAWCZYK_EXISTENCE_UNIQUENESS_LEMMA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34714-krawczyk-existence-uniqueness-lemma assertion failed: ${a.id}`);
  }
}
