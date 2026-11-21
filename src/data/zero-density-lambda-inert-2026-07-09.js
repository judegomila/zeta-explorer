/**
 * @module zero-density-lambda-inert-2026-07-09
 * @fileoverview
 * Scoping result (7-lens survey + skeptical verify, web-grounded): can
 * zero-density / large-values estimates tighten the RIGOROUS de Bruijn–Newman
 * Λ ≤ 0.2 bound? Verdict: NO — density is Λ-INERT. It is genuine, live, top-tier
 * RH-ADJACENT progress, but it cannot move the rigorous Λ number.
 *
 * Why (structural, not a matter of sharpening): the Polymath15 / Platt–Trudgian
 * barrier is gated by the VERIFIED zero height X≈3×10¹² — a computation certifying
 * the off-line zero count is EXACTLY zero up to X. A density estimate
 * N(σ,T) ≪ T^{c(1-σ)+ε} is intrinsically a POSITIVE upper bound (> 1 for the
 * relevant T); it permits ≫T^ε exceptional off-line zeros and can NEVER certify
 * N=0. A density result that gave N=0 in a strip would already BE RH there. So
 * density can neither replace one unit of the X computation nor reduce the X
 * needed for a given Λ. Even the full Density Hypothesis (A(σ)≤2) or density-1-
 * on-line moves the rigorous Λ floor by exactly zero.
 *
 * HONEST SCOPE: no bound, no beat, no QED. No refereed bound is changed.
 * This CORRECTS a natural intuition (and a prior in-project recommendation) that
 * zero-density work could tighten Λ.
 */

export const DENSITY_SCOPING_META = {
  date: '2026-07-09',
  question: 'Can zero-density / large-values estimates tighten the rigorous Λ ≤ 0.2 bound?',
  verdict: 'NO — zero-density is Λ-INERT',
  bottomLine:
    'The barrier is gated by verified height X (a computation certifying N=0 off-line up to X). ' +
    'Density is a positive upper bound on off-line zeros and can never certify N=0, so it cannot ' +
    'replace or reduce X. Even the full Density Hypothesis moves the rigorous Λ by exactly zero. ' +
    'The ONLY lever that moves rigorous Λ is pushing X — raw certified computation, inverse-log in ' +
    'effect (X:3e12→~2e13 ⇒ Λ:0.20→0.19), asymptoting far short of RH.',
  sourceCorrections: [
    'Published unconditional bound is Λ≤0.22 (Polymath15, arXiv:1904.12438); 0.20 is the post-Platt–Trudgian audit value.',
    'Rodgers–Tao (arXiv:1801.05914) is the Λ≥0 lower bound.',
    'Guth–Maynard (arXiv:2405.20552, Annals 203, 2026): N(σ,T)≤T^{30(1-σ)/13+o(1)} (30/13≈2.31), first improvement on Ingham in ~80y; primes in x^{17/30+o(1)}. Tao–Trudgian–Yang (arXiv:2501.16779) mechanized the exponent-pair/additive-energy relations.',
  ],
};

// feedsLambda ∈ {DIRECTLY, VIA-HEIGHT-REDUCTION, NO-RH-ADJACENT-ONLY}
export const DENSITY_LEVERS = [
  {
    title: 'Extend the rigorous RH-to-X verification (certified Turing + interval ζ)',
    feedsLambda: 'DIRECTLY',
    promise: 4,
    pitch: 'The single genuine Λ lever — approaches the confirmed sole binding constraint (verified height X) RH-freely. Not a density estimate, not the refuted barrier-tightening class.',
    caveat: 'Inverse-log ceiling: ~0.01 in Λ per decade of X; Λ≤0.10 needs X~10²⁴–10²⁵ (infeasible). Cannot reach RH by computation. It is a decade-of-HPC-per-0.01 grind.',
  },
  {
    title: 'Sharpen explicit zero-COUNTING constants (N(T), S(T), ∫S) feeding Turing',
    feedsLambda: 'VIA-HEIGHT-REDUCTION',
    promise: 2,
    pitch: 'The only analytic (non-compute) class in the correct height pipeline (HSW-2022 N(T) bound, Trudgian S(T)).',
    caveat: 'Mechanism overstated: X is compute-bound by ζ-evaluation over ~(X/2π)log(X/2π) points; counting constants shave only the sub-dominant Turing-window slack. Net Λ movement negligible.',
  },
  {
    title: 'Guth–Maynard large-value / zero-additive-energy → Density Hypothesis A(σ)≤2',
    feedsLambda: 'NO-RH-ADJACENT-ONLY',
    promise: 2,
    pitch: 'The most alive RH-ADJACENT frontier — broke Ingham’s 1940 wall; α=1/2 large-value case is the named bottleneck to A(σ)≤2. Unconditional, live, incrementally tractable.',
    caveat: 'Λ-INERT: density never certifies N=0, so reaching A=2 or the full DH moves Λ by zero. Route strictly as RH-adjacent (prime gaps, short-interval PNT), never as a Λ ticket.',
  },
  {
    title: 'Zero-free STRIP certificate (half-width η) instead of full RH-to-X',
    feedsLambda: 'VIA-HEIGHT-REDUCTION (illusory)',
    promise: 1,
    pitch: 'The only conceptual channel by which a weaker finite-range certificate might reduce required X.',
    caveat: 'Dead-ends: the barrier needs ALL zeros left of it real at t=0 — a far off-line zero at height ≤X violates it regardless of strip width; and the argument-principle count over [0,X] costs the same. No saving.',
  },
];

export const DENSITY_TOP_RECOMMENDATION =
  'For the rigorous Λ number: extending verified height X is the only lever — RH-free, but inverse-log and never a proof of RH. ' +
  'For frontier mathematics (not the Λ number): the Guth–Maynard large-value / Density-Hypothesis program is the best bet — routed honestly as RH-ADJACENT, not as a Λ lever.';

export const ZERO_DENSITY_SCOPING = {
  meta: DENSITY_SCOPING_META,
  levers: DENSITY_LEVERS,
  topRecommendation: DENSITY_TOP_RECOMMENDATION,
};
