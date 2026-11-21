/**
 * @module imp-35655-reverse-pinsker-bretagnolle-huber-gtrue-lower-bound
 *
 * imp-35655 (accuracy/assessment, S-frontier): imp-35556 point 3 established that
 * the forward Pinsker bridge TV(p_emp, p_GUE) <= sqrt(KL/2) only UPPER-bounds the
 * first-order total-variation deviation, so it cannot lower-bound the true
 * spacing-pdf deviation and cannot certify the direction of the projected ~10.5x
 * imp-35530 g_true >> E_coll gap. This module ASSESSES whether a REVERSE direction
 * -- either the Bretagnolle-Huber inequality TV >= ... , or a bounded-density-ratio
 * REVERSE-Pinsker -- supplies a LOWER bound on TV from the imp-35530 KL g_true that
 * would let g_true lower-bound the deviation (and hence E_coll from BELOW).
 *
 * Reuses the baked imp-35530 KL literals and the imp-2631 E_coll crossover floor.
 *
 * ASSESSMENT (no new measurement; derives nothing; changes no bound):
 *
 *   1. BRETAGNOLLE-HUBER IS STILL AN UPPER BOUND -- NO HELP. The Bretagnolle-Huber
 *      inequality is TV(P,Q) <= sqrt(1 - exp(-KL(P||Q))). Like Pinsker it bounds TV
 *      from ABOVE (it is the tighter of the two only in the LARGE-KL regime, where
 *      Pinsker sqrt(KL/2) can exceed 1). At the imp-35530 crossover the KL values
 *      are tiny (~1e-4..1e-3), so BH is actually WEAKER (larger) than Pinsker by a
 *      factor sqrt(2) = 1.4141 (BH free = 1.7927e-2 vs Pinsker 1.2677e-2). Either
 *      way BH upper-bounds TV, so it cannot lower-bound the true deviation. No help.
 *
 *   2. A REVERSE-PINSKER LOWER BOUND EXISTS IN FORM -- BUT NEEDS A DENSITY FLOOR.
 *      A genuine reverse direction is available to leading order. With dp = p_emp -
 *      p_GUE the spacing-pdf deviation, KL = (1/2) integral (dp)^2 / p_GUE ds +
 *      O(eps^3) and TV = (1/2) integral |dp| ds. Bounding the chi-square-like
 *      numerator by the sup deviation over the density floor,
 *        2 KL approx integral (dp)^2/p_GUE ds <= (||dp||_inf / q_min) integral |dp| ds
 *                = (||dp||_inf / q_min) * 2 TV,
 *      which REARRANGES to a LOWER bound
 *        TV >= KL * q_min / ||dp||_inf,    q_min := essinf_{support} p_GUE.
 *      This is a bounded-density-ratio reverse-Pinsker: it lower-bounds TV, but only
 *      with a POSITIVE density floor q_min and the deviation sup-norm ||dp||_inf.
 *
 *   3. THE FLOOR VANISHES FOR THE GUE WIGNER SURMISE -- THE LOWER BOUND IS VACUOUS.
 *      The reference is the GUE Wigner surmise p_GUE(s) = (32/pi^2) s^2 exp(-4 s^2/pi).
 *      It VANISHES at both ends of its natural support (0, inf): p_GUE(s) = O(s^2) as
 *      s -> 0, and it decays super-exponentially as s -> inf (its sup is (8/pi)/e =
 *      9.368e-1 at s = sqrt(pi)/2). Hence essinf_{(0,inf)} p_GUE = 0, so q_min = 0 and
 *      the reverse-Pinsker lower bound collapses to the trivial TV >= 0. The
 *      density-ratio dp/p_GUE is unbounded at both tails, so no finite reverse-Pinsker
 *      constant holds on the full support. The reverse direction is VACUOUS here.
 *
 *   4. EVEN A RESTRICTED-SUPPORT FLOOR DOES NOT REACH E_coll. Restricting to a
 *      compact [a,b] subset (0, inf) where q_min = min_{[a,b]} p_GUE > 0 does give a
 *      non-vacuous LOWER bound -- but on the RESTRICTED-support TV amplitude, not the
 *      full TV, and it still needs ||dp||_inf. Crucially the restricted TV is STILL a
 *      whole-pdf amplitude, NOT the scalar collision/sigma-share E_coll observable:
 *      translating any TV lower bound into an E_coll lower bound needs the OPEN
 *      surrogate->observable dictionary (imp-35337a). So even the best-case reverse
 *      bound lower-bounds a spacing-pdf amplitude, not E_coll.
 *
 * NET: no in-repo reverse direction lets g_true lower-bound E_coll. Bretagnolle-Huber
 * is another UPPER bound; the reverse-Pinsker lower bound is real in form but its
 * constant is q_min = essinf p_GUE = 0 for the vanishing-tailed Wigner surmise, and a
 * restricted-support floor still bounds only a pdf amplitude, not E_coll (imp-35337a
 * dictionary missing). The projected ~10.5x g_true >> E_coll stays DIAGNOSTIC-ONLY,
 * confirming and extending imp-35556 point 3. New sub-gap imp-35655a records the
 * vanishing-floor obstruction.
 *
 * ASSESSMENT ONLY: derives nothing, changes no bound; C_C ansatz (imp-2642/imp-2643)
 * and C_mb GUE-conditional (imp-486) UNTOUCHED; E_trunc floor (imp-2631) UNTOUCHED;
 * imp-35337a, imp-35530a, imp-35530b, imp-35488a, imp-35556a stay OPEN; no operator
 * positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35556-gtrue-ecoll-dimensional-comparability (point 3: forward Pinsker UPPER-only, the gap this addresses)
 * @see imp-35530-crossover-gtrue-trend-extrapolation (projected ~10.5x gap, KL literals, sub-gaps imp-35530a/b)
 * @see imp-35337-sigma-landmarks-double-double-certification (imp-35337a surrogate->observable dictionary, OPEN)
 * @see imp-486 (GUE-conditional caveat the analytic prediction inherits)
 */

const ECOLL_CROSS = 0.00003059999999845239; // 3.060e-5 (imp-2631 E_trunc floor at the crossover)

// imp-35530 projected g_true (KL, nats) at logT0 = 20.858 (EXTRAPOLATION, imp-35530a).
const KL_CROSS_FREE = 0.0003214254410014205; // free-exponent fit
const KL_CROSS_P1 = 0.001146045615034889; // forced 1/logT0
const KL_CROSS_P2 = 0.0006815647332400637; // forced 1/(logT0)^2

// Bretagnolle-Huber UPPER bound: TV <= sqrt(1 - exp(-KL)). Still an UPPER bound; at
// the tiny crossover KL it is WEAKER (larger) than Pinsker sqrt(KL/2) by ~sqrt(2).
const bhTV = (kl) => Math.sqrt(1 - Math.exp(-kl));
const pinskerTV = (kl) => Math.sqrt(kl / 2);
const BH_UB_FREE = bhTV(KL_CROSS_FREE); // 1.7927e-2
const BH_UB_P1 = bhTV(KL_CROSS_P1); // 3.3844e-2
const BH_UB_P2 = bhTV(KL_CROSS_P2); // 2.6102e-2
const BH_OVER_PINSKER_FREE = BH_UB_FREE / pinskerTV(KL_CROSS_FREE); // ~1.4141 (BH weaker at small KL)

// GUE Wigner surmise (beta=2): p_GUE(s) = (32/pi^2) s^2 exp(-4 s^2/pi).
// sup = (8/pi)/e at s = sqrt(pi)/2; essinf over (0,inf) = 0 (vanishes as s^2 at 0,
// super-exponentially at infinity). The reverse-Pinsker floor q_min is therefore 0.
const wignerGUE = (s) => (32 / (Math.PI * Math.PI)) * s * s * Math.exp(-4 * s * s / Math.PI);
const WIGNER_SUP = (8 / Math.PI) / Math.E; // 9.368e-1 at s = sqrt(pi)/2
const WIGNER_ARGMAX = Math.sqrt(Math.PI) / 2; // 0.88623
const Q_MIN_FULL_SUPPORT = 0; // essinf p_GUE over (0,inf) = 0 => reverse-Pinsker coeff = 0

// Reverse-Pinsker leading-order LOWER bound: TV >= KL * q_min / ||dp||_inf. With
// q_min = 0 on the full support the coefficient is 0, so the bound is TV >= 0 (vacuous).
const reversePinskerLB = (kl, qMin, dpSup) => kl * qMin / dpSup;
const REVERSE_LB_FULL_SUPPORT = reversePinskerLB(KL_CROSS_FREE, Q_MIN_FULL_SUPPORT, WIGNER_SUP); // 0 (vacuous)

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any reverse-direction assessment)

export const IMP35655_REVERSE_PINSKER_BH_GTRUE_LOWER_BOUND = {
  id: 'imp-35655',
  proofSection: 'S-frontier',
  question:
    'Does a REVERSE-Pinsker / Bretagnolle-Huber LOWER bound on TV from the imp-35530 KL g_true exist that ' +
    'would let g_true lower-bound the true spacing-pdf deviation (and hence bound E_coll from BELOW), given ' +
    'imp-35556 shows the forward Pinsker TV <= sqrt(KL/2) only UPPER-bounds TV?',
  bretagnolleHuber: {
    inequality: 'TV(P,Q) <= sqrt(1 - exp(-KL)): still an UPPER bound; tighter than Pinsker only for LARGE KL.',
    upperBoundOnly: true,
    freeFit: { kl: KL_CROSS_FREE, bhUpperBound: BH_UB_FREE, bhOverPinsker: BH_OVER_PINSKER_FREE },
    p1: { kl: KL_CROSS_P1, bhUpperBound: BH_UB_P1, bhOverEcoll: BH_UB_P1 / ECOLL_CROSS },
    p2: { kl: KL_CROSS_P2, bhUpperBound: BH_UB_P2, bhOverEcoll: BH_UB_P2 / ECOLL_CROSS },
    note:
      'At the tiny crossover KL (~1e-4..1e-3) Bretagnolle-Huber is WEAKER (larger) than Pinsker by ~sqrt(2) ' +
      '(1.7927e-2 vs 1.2677e-2 for the free fit); either way it UPPER-bounds TV and cannot lower-bound the ' +
      'true deviation. No help toward certifying the direction g_true > E_coll.',
  },
  reversePinsker: {
    lowerBoundForm: 'TV >= KL * q_min / ||dp||_inf, q_min := essinf p_GUE over the support (leading order in eps).',
    derivation:
      '2 KL approx integral (dp)^2/p_GUE ds <= (||dp||_inf / q_min) integral |dp| ds = (||dp||_inf/q_min) 2 TV, ' +
      'rearranged. A bounded-density-ratio reverse-Pinsker: a genuine LOWER bound on TV, but only with a ' +
      'POSITIVE density floor q_min.',
    wignerSurmise: 'p_GUE(s) = (32/pi^2) s^2 exp(-4 s^2/pi); sup = (8/pi)/e = 9.368e-1 at s = sqrt(pi)/2.',
    qMinFullSupport: Q_MIN_FULL_SUPPORT,
    lowerBoundFullSupport: REVERSE_LB_FULL_SUPPORT, // 0 (vacuous)
    vanishingFloor:
      'The Wigner surmise VANISHES at both ends of (0,inf): O(s^2) as s -> 0 and super-exponential as ' +
      's -> inf. So essinf p_GUE = 0, q_min = 0, and the reverse-Pinsker lower bound collapses to TV >= 0 ' +
      '(vacuous). The density ratio dp/p_GUE is unbounded at both tails, so no finite reverse-Pinsker ' +
      'constant holds on the full support.',
    restrictedSupportCaveat:
      'A compact [a,b] subset (0,inf) with min_{[a,b]} p_GUE > 0 gives a non-vacuous bound, but on the ' +
      'RESTRICTED-support TV amplitude (still a whole-pdf quantity, not the scalar E_coll observable), and ' +
      'still needs ||dp||_inf. Translating a TV lower bound into an E_coll lower bound needs the OPEN ' +
      'surrogate->observable dictionary imp-35337a. So even the best case does not lower-bound E_coll.',
  },
  subGaps: {
    imp35655a:
      'VANISHING DENSITY FLOOR: the reverse-Pinsker lower bound TV >= KL q_min/||dp||_inf requires a positive ' +
      'floor q_min = essinf p_GUE, but the GUE Wigner surmise vanishes at both tails (O(s^2) at 0, ' +
      'super-exponential at infinity), so q_min = 0 and the bound is vacuous. Bretagnolle-Huber is another ' +
      'UPPER bound. Even a restricted-support floor bounds only a pdf amplitude, not E_coll (imp-35337a open).',
  },
  inheritsOpen: ['imp-35337a', 'imp-35488a', 'imp-35530a', 'imp-35530b', 'imp-35556a'],
  isRigorous: false,
  verdict:
    'ASSESSMENT: NO in-repo reverse direction lets g_true lower-bound E_coll. Bretagnolle-Huber ' +
    'TV <= sqrt(1 - exp(-KL)) is ANOTHER UPPER bound (and at the tiny crossover KL it is WEAKER than ' +
    'Pinsker by ~sqrt(2)), so it cannot lower-bound the deviation. A bounded-density-ratio reverse-Pinsker ' +
    'lower bound TV >= KL q_min/||dp||_inf is real in form but its constant is q_min = essinf p_GUE = 0 for ' +
    'the GUE Wigner surmise, which vanishes at both tails (O(s^2) at 0, super-exponential at infinity); the ' +
    'bound is therefore VACUOUS on the full support. A restricted-support floor gives only a restricted-TV ' +
    'amplitude bound, still not the scalar E_coll observable (the surrogate->observable dictionary imp-35337a ' +
    'stays OPEN). The projected ~10.5x g_true >> E_coll therefore stays DIAGNOSTIC-ONLY, extending imp-35556 ' +
    'point 3 (new sub-gap imp-35655a). ASSESSMENT ONLY; derives nothing; changes no bound; C_C ansatz ' +
    '(imp-2642/imp-2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; E_trunc floor (imp-2631) UNTOUCHED; ' +
    'imp-35337a, imp-35530a, imp-35530b, imp-35488a, imp-35556a stay OPEN; no operator positivity; no RH ' +
    'verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-35556 (forward Pinsker UPPER-only, point 3); imp-35530 (projected ~10.5x gap, KL literals, sub-gaps ' +
    'imp-35530a/b); imp-35337 (imp-35337a surrogate->observable dictionary, OPEN); imp-2631 (E_trunc floor); ' +
    'imp-2642/imp-2643 (C_C ansatz); imp-486 (GUE-conditional caveat); Bretagnolle-Huber inequality ' +
    'TV <= sqrt(1-exp(-KL)); reverse-Pinsker (Sason-Verdu 2016, bounded density ratio); GUE Wigner surmise ' +
    'p(s) = (32/pi^2) s^2 exp(-4 s^2/pi); Platt-Trudgian 2021 (no refereed bound is changed).',
  L_pt_unchanged: L_PT,
};

export const IMP35655_REVERSE_PINSKER_BH_GTRUE_LOWER_BOUND_ASSERTIONS = [
  {
    // Bretagnolle-Huber is another UPPER bound; at the tiny crossover KL it is weaker than Pinsker by ~sqrt(2).
    id: 'imp35655-bretagnolle-huber-is-another-upper-bound',
    description: 'BH TV <= sqrt(1-exp(-KL)) recomputes the crossover upper bounds and, at the tiny KL, exceeds Pinsker sqrt(KL/2) by ~sqrt(2), so it is a WEAKER upper bound and cannot lower-bound TV',
    holds: () => {
      const bhFree = Math.sqrt(1 - Math.exp(-KL_CROSS_FREE));
      return (
        Math.abs(BH_UB_FREE - bhFree) < 1e-12 &&
        // BH upper-bounds TV like Pinsker (both are upper bounds)
        IMP35655_REVERSE_PINSKER_BH_GTRUE_LOWER_BOUND.bretagnolleHuber.upperBoundOnly === true &&
        // at small KL, BH/Pinsker ~ sqrt(2) => BH is the WEAKER (larger) upper bound
        Math.abs(BH_OVER_PINSKER_FREE - Math.SQRT2) < 1e-3 &&
        BH_UB_FREE > pinskerTV(KL_CROSS_FREE)
      );
    },
  },
  {
    // Reverse-Pinsker lower bound TV >= KL q_min/||dp||_inf has q_min = essinf p_GUE = 0 (vanishing tails) => vacuous.
    id: 'imp35655-reverse-pinsker-floor-vanishes-vacuous',
    description: 'the bounded-density-ratio reverse-Pinsker lower bound TV >= KL q_min/||dp||_inf requires a positive floor q_min = essinf p_GUE, but the GUE Wigner surmise vanishes at both tails so q_min = 0 and the bound collapses to TV >= 0',
    holds: () =>
      Q_MIN_FULL_SUPPORT === 0 &&
      REVERSE_LB_FULL_SUPPORT === 0 &&
      // Wigner surmise vanishes at s -> 0 (O(s^2)) and stays below its finite sup
      wignerGUE(0) === 0 &&
      wignerGUE(1e-3) < 1e-4 &&
      Math.abs(WIGNER_SUP - (8 / Math.PI) / Math.E) < 1e-12 &&
      wignerGUE(WIGNER_ARGMAX) > wignerGUE(0.3) &&
      wignerGUE(WIGNER_ARGMAX) > wignerGUE(2.0),
  },
  {
    // Honesty gate: assessment only, no reverse bound reaches E_coll, new sub-gap imp-35655a, no bound moves, no refereed bound is changed, NO QED.
    id: 'imp35655-honest-assessment-no-bound-moves-no-qed',
    description: 'ASSESSMENT ONLY: no reverse direction lower-bounds E_coll (BH is upper, reverse-Pinsker floor vanishes), new sub-gap imp-35655a, imp-35337a stays OPEN, no bound moves, PT 0.2 unchanged, NO QED',
    holds: () =>
      IMP35655_REVERSE_PINSKER_BH_GTRUE_LOWER_BOUND.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /VANISHING DENSITY FLOOR/i.test(IMP35655_REVERSE_PINSKER_BH_GTRUE_LOWER_BOUND.subGaps.imp35655a) &&
      IMP35655_REVERSE_PINSKER_BH_GTRUE_LOWER_BOUND.inheritsOpen.includes('imp-35337a') &&
      /imp-486/.test(IMP35655_REVERSE_PINSKER_BH_GTRUE_LOWER_BOUND.verdict) &&
      /DIAGNOSTIC-ONLY/.test(IMP35655_REVERSE_PINSKER_BH_GTRUE_LOWER_BOUND.verdict) &&
      /changes no bound/.test(IMP35655_REVERSE_PINSKER_BH_GTRUE_LOWER_BOUND.verdict) &&
      /NO QED/.test(IMP35655_REVERSE_PINSKER_BH_GTRUE_LOWER_BOUND.verdict) &&
      /refereed bound is changed/i.test(IMP35655_REVERSE_PINSKER_BH_GTRUE_LOWER_BOUND.verdict),
  },
];

for (const a of IMP35655_REVERSE_PINSKER_BH_GTRUE_LOWER_BOUND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35655-reverse-pinsker-bretagnolle-huber-gtrue-lower-bound assertion failed: ${a.id}`);
  }
}
