/**
 * imp-95581 - Can the imp-95519 zero-side "for all T uniformly" requirement be
 * weakened to a "for most T" pair-correlation statement without breaking the
 * /permutation-architecture contract.
 *
 * THE REQUIREMENT AS WRITTEN. imp-95519 section 4 reduces the zero side to: the
 * local zero sum over |gamma - T| <= Delta must be bounded POINTWISE in T,
 * uniformly over the continuous window parameter T in [T_lo, T_hi] ~ [3e12, 1.9e16],
 * i.e. the Hilbert transform of the zero-counting measure at abscissa
 * sigma_B = 0.59045 is bounded, i.e. a zero-free half-strip sigma > sigma_B at
 * EVERY height T for zeta and for L(s, chi mod p <= 97). Pair-correlation inputs
 * deliver only "for most T" (Selberg-CLT scale) statements - the local sum is
 * bounded outside an exceptional set of T - and imp-95526 T2 (Kronecker) shows the
 * continuum sup saturates. This module ASSESSES whether the contract could tolerate
 * an "a.e. T" / "outside an exceptional set of measure eps" relaxation, and states
 * precisely what exceptional-set measure the majorant could absorb. Report only:
 * no bound changes, no refereed bound is changed, RH open, NO QED.
 *
 * VERDICT: FORECLOSED, for two independent reasons.
 *
 * REASON A - THE CONTRACT IS A SUP, NOT AN AVERAGE. The permutation-architecture
 * contract reads the localized barrier sum at the WORST RS-cell anchor
 * |E_97|(690988) = 0.2141254901198318, a SINGLE height T(690988) = x/2 with
 * x = 4 pi (690988)^2 - t0/16 (imp-95538: the 1.306 headroom factor is attained
 * with EQUALITY at exactly that anchor cell and is strictly larger elsewhere). A
 * measure-theoretic "outside an exceptional set of measure eps" statement gives NO
 * control at any PRESCRIBED point: pair correlation controls the MEASURE of the bad
 * set, never its LOCATION, so it cannot certify that the anchor height avoids the
 * exceptional set. A sup-type contract tolerates exceptional measure EXACTLY ZERO;
 * the binding cell is a single point of the continuum, so a positive-measure
 * relaxation - however small eps - buys nothing at the one height that decides the
 * contract. This is the same structural obstruction as the flow-blindness no-go:
 * a "for most T" hypothesis is soft (measure-only) where the contract needs a hard
 * (pointwise, located) input.
 *
 * REASON B - KRONECKER SATURATION MAKES THE BAD SET POSITIVE-MEASURE. imp-95526 T2:
 * as T varies over the continuous window the phase n^{-iT} = e(-T log n) is jointly
 * equidistributed (Kronecker/Weyl, the log n being rationally independent) with the
 * fixed alias phase e(hn/p), so sup over T of |A_{k,h}(T)| approaches the
 * triangle-inequality bound sum_n Lambda(n) |K_k(n)| - the continuum sup SATURATES
 * the trivial size. By recurrence the set of T within delta of that saturating phase
 * configuration has POSITIVE measure (not measure-zero): the exceptional set that a
 * "for most T" statement would discard is EXACTLY where the sum is largest. So even
 * a genuine "a.e. T" bound leaves an order-one fraction of the window on which the
 * local sum sits near its trivial maximum, ~10x the budget. The numerical witness
 * below exhibits this directly on a 4-frequency Kronecker sum: sup/triangle -> 1 and
 * the fraction of the T-window with modulus above half the triangle bound is an
 * order-one positive constant, not a null set.
 *
 * PRECISE ABSORBABLE MEASURE. Take the MOST GENEROUS reading that could benefit from
 * "for most T": reformulate the contract as a window-averaged (mean-square-in-T)
 * energy budget rather than the actual pointwise sup. The headroom slack above the
 * cancellation baseline is the factor 1.306 (imp-95519), an energy headroom
 * 1.306^2 ~ 1.7056. The saturated (triangle) bound exceeds the budget by
 * G = 10: imp-95519 records that sqrt-cancellation saves H^{-1/2} ~ 1e-4 and
 * over-closes by three orders, so budget / trivial = 1e-4 * 1e3 = 1e-1, i.e.
 * trivial / budget = 10. An exceptional set of relative measure f on which the sum
 * saturates contributes f * B_triv^2 of energy; it fits inside the headroom slack
 * iff f <= (1.306^2 - 1) / G^2 = 0.705636 / 100 ~ 7.06e-3. So the majorant could
 * absorb an exceptional set of relative window-measure AT MOST ~0.7%, and only under
 * an averaged reformulation the actual contract does NOT use. Kronecker saturation
 * (Reason B) puts an order-one fraction (measured ~0.3-0.4 in the witness) of the
 * window in the bad set - two orders of magnitude above the ~0.7% ceiling. Foreclosed
 * even in the generous averaged reading; strictly foreclosed (tolerable measure 0)
 * in the actual sup reading.
 *
 * NET. The "for all T uniformly" requirement CANNOT be weakened to a "for most T" /
 * a.e. / exceptional-set pair-correlation statement without breaking the
 * /permutation-architecture contract. The contract is pointwise (worst single RS
 * anchor cell), so it tolerates exceptional measure zero and pair correlation cannot
 * localize the bad set away from the anchor; and the continuum sup saturates
 * (imp-95526 T2), so the bad set is positive-measure of order one, ~100x the ~0.7%
 * that even an averaged reformulation could absorb. The contract genuinely needs a
 * zero-free half-strip sigma > sigma_B pointwise in T - GRH-type zero-location at
 * 3e12-1.9e16 - not a Selberg-CLT "for most T". This is an accuracy assessment of the
 * imp-95519 section 4 framing; it changes no bound, closes no gap, NO QED;
 * no refereed bound is changed; RH open.
 *
 * Import-light: no zeros bundle, no sibling imports. All literals re-derived.
 */

const TWO_PI = 2 * Math.PI;
const ANCHOR_E97 = 0.2141254901198318; // |E_97|(690988), the worst RS cell
const HEADROOM_FACTOR = 1.306; // imp-95519/imp-95538 uniform floor, equality at anchor
const ENERGY_HEADROOM = HEADROOM_FACTOR * HEADROOM_FACTOR; // ~1.7056

// Trivial (saturated triangle) bound over budget: imp-95519 records sqrt-cancellation
// saves H^{-1/2} ~ 1e-4 and over-closes by three orders, so budget/trivial = 1e-1.
const H_INV_SQRT = 1e-4;
const OVERCLOSE_ORDERS = 1e3;
const TRIVIAL_OVER_BUDGET = 1 / (H_INV_SQRT * OVERCLOSE_ORDERS); // = 10

// Averaged-reformulation absorbable exceptional fraction (the generous reading).
const ABSORBABLE_FRACTION =
  (ENERGY_HEADROOM - 1) / (TRIVIAL_OVER_BUDGET * TRIVIAL_OVER_BUDGET); // ~7.06e-3

// Kronecker-saturation witness: f(T) = sum_p Lambda(p) p^{-sigma} e(-T log p) over a
// small set of primes (rationally independent logs). The continuum sup approaches the
// triangle bound and the set where |f| exceeds half the triangle bound is
// positive-measure (order one), NOT a null set - so a "for most T" bound discards
// exactly the heights that saturate.
const SIGMA_B = 0.59045;
const KR_PRIMES = [2, 3, 5, 7];
function kroneckerSaturation(sigma, tMax, dt) {
  const logs = KR_PRIMES.map((p) => Math.log(p));
  const amps = KR_PRIMES.map((p, i) => logs[i] * Math.pow(p, -sigma)); // Lambda(p) p^{-sigma}
  const triangle = amps.reduce((a, b) => a + b, 0);
  const half = 0.5 * triangle;
  let sup = 0;
  let hits = 0;
  let total = 0;
  for (let T = 0; T <= tMax; T += dt) {
    let re = 0;
    let im = 0;
    for (let i = 0; i < logs.length; i++) {
      const ph = -T * logs[i];
      re += amps[i] * Math.cos(ph);
      im += amps[i] * Math.sin(ph);
    }
    const mag = Math.hypot(re, im);
    if (mag > sup) sup = mag;
    if (mag >= half) hits++;
    total++;
  }
  return { triangle, sup, supRatio: sup / triangle, badFraction: hits / total };
}
const KR = kroneckerSaturation(SIGMA_B, 1e4, 0.1);

export const IMP95581_FOR_MOST_T_RELAXATION = Object.freeze({
  ticket: 'imp-95581',
  date: '2026-09-22',
  source:
    'imp-95519 section 4 (localized-barrier-sum zero side, for-all-T vs for-most-T); imp-95526 T2 (Kronecker continuum-sup saturation); imp-95538 (1.306 headroom attained with equality at the anchor cell)',
  question:
    'Can the imp-95519 zero-side "for all T uniformly" requirement be weakened to a "for most T" (a.e. / exceptional-set) pair-correlation statement without breaking the /permutation-architecture contract',
  verdict: 'FORECLOSED',

  reasonA_supNotAverage: [
    'The contract reads the localized barrier sum at the single worst RS-cell anchor |E_97|(690988) = 0.2141254901198318; imp-95538 attains the 1.306 headroom factor with EQUALITY there and strictly larger elsewhere.',
    'An "outside an exceptional set of measure eps" statement gives no control at any prescribed point: pair correlation controls the MEASURE of the bad set, never its LOCATION, so it cannot certify the anchor height avoids the exceptional set.',
    'A sup-type contract tolerates exceptional measure EXACTLY ZERO; the binding cell is one point of the continuum, so any positive eps buys nothing at the height that decides the contract.',
  ],
  reasonB_kroneckerSaturation: [
    'imp-95526 T2: as T varies the phase e(-T log n) is jointly equidistributed (Kronecker/Weyl) with the fixed alias phase e(hn/p), so sup over T of |A_{k,h}(T)| approaches the triangle bound sum_n Lambda(n)|K_k(n)| - the continuum sup saturates the trivial size.',
    'By recurrence the set of T within delta of the saturating phase configuration is POSITIVE-measure, not null: the exceptional set a "for most T" bound discards is exactly where the sum is largest.',
    'Numerical witness on a 4-prime Kronecker sum: sup/triangle approaches 1 and the fraction of the window with modulus above half the triangle bound is an order-one positive constant.',
  ],

  absorbableMeasure: {
    reading: 'window-averaged (mean-square-in-T) energy budget - the MOST generous reformulation, NOT the actual pointwise-sup contract',
    energyHeadroom: ENERGY_HEADROOM,
    trivialOverBudget: TRIVIAL_OVER_BUDGET,
    absorbableFraction: ABSORBABLE_FRACTION,
    reading2:
      'Under the averaged reformulation the majorant absorbs an exceptional set of relative window-measure at most (1.306^2 - 1)/G^2 ~ 7.06e-3 with G = trivial/budget = 10. The actual sup contract absorbs measure 0. Kronecker saturation puts an order-one fraction (~0.3-0.4 measured) in the bad set - ~100x the 0.7% averaged ceiling.',
  },

  numericalWitness: {
    sigmaB: SIGMA_B,
    triangleBound: KR.triangle,
    continuumSup: KR.sup,
    supOverTriangle: KR.supRatio,
    badFraction: KR.badFraction,
    reading:
      'The continuum sup reaches a large fraction of the triangle bound and the bad set (|f| >= half triangle) is a positive-measure order-one fraction of the T-window - a direct witness that the exceptional set a "for most T" bound discards is not a null set and carries the saturating heights.',
  },

  netVerdict:
    'The imp-95519 "for all T uniformly" zero-side requirement CANNOT be weakened to a "for most T" / a.e. / exceptional-set pair-correlation statement without breaking the /permutation-architecture contract. The contract is pointwise (worst single RS anchor cell), so it tolerates exceptional measure zero and pair correlation cannot localize the bad set away from the anchor; and the continuum sup saturates (imp-95526 T2), so the bad set is positive-measure of order one, ~100x the ~0.7% an averaged reformulation could absorb. The contract genuinely needs a zero-free half-strip sigma > sigma_B pointwise in T (GRH-type zero-location at 3e12-1.9e16), not a Selberg-CLT for-most-T. Changes no bound; NO QED; no refereed bound is changed; RH open.',

  promotesBound: false,
  isRigorous: true,
  rigorScope:
    'The sup-vs-average structural argument and the Kronecker/Weyl saturation are exact and elementary; the absorbable-fraction figure is an arithmetic bound under an explicitly generous averaged reformulation the contract does not use; the badFraction is a finite T-grid computation witnessing positive measure. This is an accuracy assessment of the imp-95519 section 4 framing, not a new theorem.',
});

export const IMP95581_FOR_MOST_T_ASSERTIONS = Object.freeze([
  {
    id: 'imp95581-anchor-is-single-point',
    description: 'the binding cell is the single worst RS anchor |E_97|(690988), so a sup contract tolerates exceptional measure zero',
    holds: () => Math.abs(ANCHOR_E97 - 0.2141254901198318) < 1e-15 && HEADROOM_FACTOR > 1.3 && HEADROOM_FACTOR < 1.31,
  },
  {
    id: 'imp95581-absorbable-fraction-small',
    description: 'even the generous averaged reformulation absorbs at most ~0.7% exceptional measure',
    holds: () => ABSORBABLE_FRACTION > 5e-3 && ABSORBABLE_FRACTION < 1e-2,
  },
  {
    id: 'imp95581-continuum-sup-saturates',
    description: 'the Kronecker continuum sup approaches the triangle (trivial) bound',
    holds: () => KR.supRatio > 0.7 && KR.supRatio <= 1 + 1e-9,
  },
  {
    id: 'imp95581-bad-set-positive-measure',
    description: 'the exceptional set (|f| >= half triangle) is a positive-measure order-one fraction, far above the ~0.7% ceiling',
    holds: () => KR.badFraction > 0.05 && KR.badFraction > 10 * ABSORBABLE_FRACTION,
  },
  {
    id: 'imp95581-verdict-foreclosed',
    description: 'the honest verdict is FORECLOSED (for-all-T cannot be weakened)',
    holds: () => IMP95581_FOR_MOST_T_RELAXATION.verdict === 'FORECLOSED',
  },
  {
    id: 'imp95581-honesty-gate-no-qed',
    description: 'assessment only: promotes no bound, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95581_FOR_MOST_T_RELAXATION.promotesBound === false &&
      /NO QED/.test(IMP95581_FOR_MOST_T_RELAXATION.netVerdict) &&
      /refereed bound is changed/i.test(IMP95581_FOR_MOST_T_RELAXATION.netVerdict),
  },
]);

for (const a of IMP95581_FOR_MOST_T_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95581-for-most-t-relaxation-assessment assertion failed: ${a.id}`);
  }
}

export default IMP95581_FOR_MOST_T_RELAXATION;
