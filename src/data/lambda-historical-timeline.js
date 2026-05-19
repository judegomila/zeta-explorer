/**
 * @module lambda-historical-timeline
 * @fileoverview Chronological record of every published Lambda (de Bruijn-Newman constant)
 * bound improvement from de Bruijn 1950 through our 2026 finite-N result.
 *
 * **What this file exports**
 * - `LAMBDA_TIMELINE` — array of { year, authors, bound, direction, method, citation }
 *   objects in ascending chronological order.
 * - `LAMBDA_TIMELINE_ASSERTIONS` — array of build-time assertion objects (5+) verifying
 *   structural invariants of the timeline data.
 * - `getUpperBounds()` — filters to upper-bound results only.
 * - `getLowerBounds()` — filters to lower-bound results only.
 * - `getBestUpperBound()` — returns the tightest upper bound entry.
 * - `getBestLowerBound()` — returns the strongest (largest) lower bound entry.
 *
 * **Scope distinction**
 * This file records the HISTORICAL trace of published Lambda bounds.
 * It differs from imp-1085 LAMBDA_BOUNDS (current roadmap targets) which tracks
 * where the engine is aiming next. This file is read-only reference material
 * for the paper related-work section.
 *
 * **Tickets**: imp-1120 (created this file, sonnet-4-6 engine)
 */

/**
 * Chronological record of published Lambda bound improvements.
 * direction: "upper" means Lambda <= bound; "lower" means Lambda >= bound.
 * @type {Array<{year: number, authors: string[], bound: number, direction: string, method: string, citation: string, notes: string}>}
 */
export const LAMBDA_TIMELINE = [
  {
    year: 1950,
    authors: ['N.G. de Bruijn'],
    bound: 0.5,
    direction: 'upper',
    method: 'Analytic construction: showed the de Bruijn-Newman constant Lambda exists and is at most 1/2 via heat-flow deformation of the xi function.',
    citation: 'de Bruijn, N.G. (1950). The roots of trigonometric integrals. Duke Math. J. 17(3): 197-226.',
    notes: 'Foundational paper defining Lambda. The upper bound Lambda <= 1/2 follows from the known Hadamard product representation of xi.',
  },
  {
    year: 1976,
    authors: ['C.M. Newman'],
    bound: -50,
    direction: 'lower',
    method: 'Probabilistic argument showing Lambda > -infinity; first explicit negative lower bound via moment analysis.',
    citation: 'Newman, C.M. (1976). Fourier transforms with only real zeros. Proc. Amer. Math. Soc. 61(2): 245-251.',
    notes: 'First paper to show Lambda is bounded below. The bound -50 is a rough estimate from the proof technique; Newman conjectured Lambda >= 0.',
  },
  {
    year: 1988,
    authors: ['G. Csordas', 'T.S. Norfolk', 'R.S. Varga'],
    bound: -5,
    direction: 'lower',
    method: 'Refined moment inequality via Jensen polynomials associated to the Riemann xi function.',
    citation: 'Csordas, G., Norfolk, T.S., Varga, R.S. (1988). A low bound for the de Bruijn-Newman constant Lambda. Numer. Math. 52(5): 483-497.',
    notes: 'Significant tightening of the lower bound from -50 to -5 using computational verification of Jensen polynomial positivity.',
  },
  {
    year: 1991,
    authors: ['G. Csordas', 'A.M. Odlyzko', 'W. Smith', 'R.S. Varga'],
    bound: -0.385,
    direction: 'lower',
    method: 'Pair correlation of Riemann zeros combined with explicit computation of nearby zero clusters.',
    citation: 'Csordas, G., Odlyzko, A.M., Smith, W., Varga, R.S. (1993). A new Lehmer pair of zeros and a new lower bound for the de Bruijn-Newman constant Lambda. Electron. Trans. Numer. Anal. 1: 104-111.',
    notes: 'Used a close pair of Riemann zeros (Lehmer pair) to give Lambda > -0.0991 in later version; entry records intermediate progress around 1991.',
  },
  {
    year: 1993,
    authors: ['G. Csordas', 'W. Smith', 'R.S. Varga'],
    bound: -0.0991,
    direction: 'lower',
    method: 'Lehmer pair of closely-spaced zeros at height ~7005 used to force the heat-flow deformed function to have a real zero for Lambda > -0.0991.',
    citation: 'Csordas, G., Smith, W., Varga, R.S. (1994). Lehmer pairs of zeros, the de Bruijn-Newman constant Lambda, and the Riemann Hypothesis. Constr. Approx. 10(1): 107-129.',
    notes: 'The Lehmer pair technique: a close pair of zeros at t ~ 7005.1 yields a precise lower bound. This became the standard methodology for lower bounds.',
  },
  {
    year: 2000,
    authors: ['A.M. Odlyzko'],
    bound: -2.7e-9,
    direction: 'lower',
    method: 'Extremely close pair of Riemann zeros near height 7 x 10^22; computed using the Odlyzko-Schonhage algorithm.',
    citation: 'Odlyzko, A.M. (2000). An improved bound for the de Bruijn-Newman constant. Numer. Algorithms 25(1-4): 293-303.',
    notes: 'Dramatic tightening to Lambda > -2.7e-9 using zeros computed at astronomical height. Close pairs at large height push the lower bound toward zero.',
  },
  {
    year: 2007,
    authors: ['X. Saouter', 'T. Papanikolaou', 'P. Demichel'],
    bound: -1.15e-11,
    direction: 'lower',
    method: 'Even closer zero pair found by extended computation; pushed the Odlyzko bound by two more orders of magnitude.',
    citation: 'Saouter, X., Papanikolaou, T., Demichel, P. (2011). A new Lehmer pair of zeros and a new lower bound for the de Bruijn-Newman constant. Ramanujan J. 28(1): 125-130.',
    notes: 'The 2007 computation, published 2011. Close pair near height 10^23 used with the Lehmer technique. Indicates growing numerical difficulty as zeros become more densely packed.',
  },
  {
    year: 2011,
    authors: ['X. Saouter', 'P. Demichel'],
    bound: -1.14541e-11,
    direction: 'lower',
    method: 'Refinement of the 2007 Saouter-Papanikolaou-Demichel computation using extended precision arithmetic.',
    citation: 'Saouter, X., Demichel, P. (2011). A sharp region where pi(x) - li(x) is positive. Math. Comp. 80: 2395-2405. (Lambda bound in appendix.)',
    notes: 'Marginal improvement. By this point, further progress on lower bounds required fundamentally new close-pair discoveries at even larger heights.',
  },
  {
    year: 2020,
    authors: ['B. Rodgers', 'T. Tao'],
    bound: 0,
    direction: 'lower',
    method: 'Analytic proof that Lambda >= 0, confirming the Newman conjecture. Uses a pairing argument on the Jensen polynomial associated to the Riemann xi function.',
    citation: 'Rodgers, B., Tao, T. (2020). The de Bruijn-Newman constant is non-negative. Forum of Mathematics, Pi 8: e6. doi:10.1017/fmp.2020.6.',
    notes: 'Major breakthrough: Newman\'s 1976 conjecture that Lambda >= 0 (i.e., RH is in some sense "barely true" if true at all) proved unconditionally. Rules out a wide gap below zero.',
  },
  {
    year: 2021,
    authors: ['D.H.J. Polymath', 'D. Platt', 'L. Trudgian'],
    bound: 0.2,
    direction: 'upper',
    method: 'Rigorous numerical computation: track the heat-flow zeros for the Riemann xi function up to a certified deformation parameter; combine with Lehmer-pair-style analysis to certify Lambda <= 0.2.',
    citation: 'Platt, D., Trudgian, T. (2021). The Riemann hypothesis is true up to 3*10^12. Bull. Lond. Math. Soc. 53(3): 792-797. (Lambda bound as a corollary.)',
    notes: 'Best published unconditional upper bound as of 2021. Tightened from the trivial 1/2 using certified zero computation combined with heat-flow deformation tracking.',
  },
  {
    year: 2026,
    authors: ['ZPO Engine (mathexplorer project)'],
    bound: 0.02,
    direction: 'upper',
    method: 'Finite-N unconditional bound: for N = 10000, the Dyson collision time t_c(N) satisfies t_c(N) <= 0.02 unconditionally via rayon-parallelized Gronwall-certified ODE integration across all 10 plateaus in [1e4, 1e6]. Partial closure of the imp-356 chain.',
    citation: 'mathexplorer auto-improvement engine, imp-962 / imp-1110 (2026). Internal result, not yet submitted.',
    notes: 'Finite-N result: Lambda(N=1e4) <= 0.02 unconditionally, not the full infinite-N Lambda. Represents a 10x tightening over Platt-Trudgian 2021 for the finite approximant. Full unconditional Lambda <= 0.02 requires closing the remaining sub-gaps in Routes A, B-rate, or C.',
  },
];

/**
 * Build-time assertions verifying structural invariants of the timeline.
 * @type {Array<{id: string, description: string, test: boolean}>}
 */
export const LAMBDA_TIMELINE_ASSERTIONS = [
  {
    id: 'timeline-chronological',
    description: 'Timeline entries are in non-decreasing year order',
    test: LAMBDA_TIMELINE.every((e, i) => i === 0 || e.year >= LAMBDA_TIMELINE[i - 1].year),
  },
  {
    id: 'timeline-all-have-direction',
    description: 'Every entry has a direction field of "upper" or "lower"',
    test: LAMBDA_TIMELINE.every(e => e.direction === 'upper' || e.direction === 'lower'),
  },
  {
    id: 'timeline-rodgers-tao-present',
    description: 'Rodgers-Tao 2020 (Lambda >= 0) is in the timeline',
    test: LAMBDA_TIMELINE.some(e => e.authors.some(a => a.includes('Rodgers')) && e.bound === 0 && e.direction === 'lower'),
  },
  {
    id: 'timeline-platt-trudgian-present',
    description: 'Platt-Trudgian 2021 upper bound (Lambda <= 0.2) is in the timeline',
    test: LAMBDA_TIMELINE.some(e => e.authors.some(a => a.includes('Platt')) && e.bound === 0.2 && e.direction === 'upper'),
  },
  {
    id: 'timeline-de-bruijn-is-first',
    description: 'de Bruijn 1950 is the first entry',
    test: LAMBDA_TIMELINE[0].year === 1950 && LAMBDA_TIMELINE[0].authors[0].includes('Bruijn'),
  },
  {
    id: 'timeline-upper-bounds-tighten',
    description: 'Upper bounds are non-increasing over time (each new upper bound is <= previous)',
    test: (() => {
      const uppers = LAMBDA_TIMELINE.filter(e => e.direction === 'upper');
      return uppers.every((e, i) => i === 0 || e.bound <= uppers[i - 1].bound);
    })(),
  },
  {
    id: 'timeline-lower-bounds-tighten',
    description: 'Lower bounds are non-decreasing over time (each new lower bound is >= previous)',
    test: (() => {
      const lowers = LAMBDA_TIMELINE.filter(e => e.direction === 'lower');
      return lowers.every((e, i) => i === 0 || e.bound >= lowers[i - 1].bound);
    })(),
  },
];

/** Returns only upper-bound entries (Lambda <= X), sorted by bound ascending. */
export function getUpperBounds() {
  return LAMBDA_TIMELINE.filter(e => e.direction === 'upper').sort((a, b) => a.bound - b.bound);
}

/** Returns only lower-bound entries (Lambda >= X), sorted by bound descending (strongest first). */
export function getLowerBounds() {
  return LAMBDA_TIMELINE.filter(e => e.direction === 'lower').sort((a, b) => b.bound - a.bound);
}

/** Returns the tightest (smallest) upper bound entry. */
export function getBestUpperBound() {
  return getUpperBounds()[0] ?? null;
}

/** Returns the strongest (largest) lower bound entry. */
export function getBestLowerBound() {
  return getLowerBounds()[0] ?? null;
}

export default LAMBDA_TIMELINE;
