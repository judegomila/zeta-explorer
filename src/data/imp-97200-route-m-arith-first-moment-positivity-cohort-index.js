/**
 * @module imp-97200-route-m-arith-first-moment-positivity-cohort-index
 * @fileoverview imp-97200 -- META cross-reference index note grouping the Route M arithmetic
 *   first-moment POSITIVITY cohort (imp-97133 explicit remainder, imp-97159 crossover, imp-97167
 *   sign-law derivation, imp-97168 reconciliation) as the ARITHMETIC-LEAF-PROVED family, so future
 *   work reads the four as one completed story -- the arithmetic half of the imp-97071 Route M first
 *   moment F(b) is now proved with an explicit remainder, an explicit positivity range, an explained
 *   sign law, and a settled comparison against the mean-square companion target -- instead of four
 *   isolated leaves. Index/meta only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE COHORT (chronological). All four build on the exact leading coefficient kappa_arith =
 *   (3/2) C - 3/8 = 0.5704960511308594... of imp-97096 (C = (log 2pi - gamma)/2), which is the
 *   arithmetic-only part of the imp-97071 first moment F(b) = F_arith(b) + F_cot(b).
 *     imp-97133 -- derives an EXPLICIT rigorous remainder for the Moebius/Stirling coprime sums
 *       L0(b), L1(b), with a named absolute constant 2^omega(b)(log b + 2), yielding
 *       F_arith(b) >= (kappa_arith - eps(b)) phi(b) b with eps(b) = O(b^{-1+o(1)}) -> 0. The bound is
 *       2^omega(b)-modulus-dependent (triangle inequality, no mu-cancellation); a fully uniform O(1/b)
 *       remainder is left as this leaf's residual.
 *     imp-97159 -- from that explicit eps(b), derives the crossover modulus above which
 *       eps(b) < kappa_arith via a primorial-envelope lemma (phi(b) >= W_k b on each omega(b)=k class):
 *       a finite proof gives b0=574 (three cases tiling omega<=3, omega=4, omega>=5), sharpened by
 *       direct check to the exact smallest b0=511. So F_arith(b) > 0 is GUARANTEED, not merely
 *       measured, for every b >= 511.
 *     imp-97167 -- derives the imp-97140 empirical residual sign law from the SAME imp-97133 remainder
 *       divisor sum: r(b) phi(b) = (1/4) Lambda(b) + Sum_{m|b} mu(b/m) delta(m), giving
 *       sign(r(b)) = (-1)^(omega(b)+1) and correcting imp-97140's mislabeled rule string. Characterizes
 *       the primorial-collapse exceptions (b=2310, 2730, 30030+) as points where a k-fold Moebius
 *       difference annihilates the leading tail term; a uniform non-cancellation certificate for every
 *       non-primorial b is left open.
 *     imp-97168 -- reconciles kappa_arith=0.5705 (proved, arithmetic leaf only) against the
 *       project_route_m_lower_companion_first_moment target kappa~0.696 (measured, FULL first moment):
 *       shows they are DIFFERENT functionals (kappa = kappa_arith + kappa_cot), the 0.1255 gap is
 *       exactly the (positive) cotangent leaf, so there is NO genuine shortfall -- and the proved
 *       arithmetic floor 0.5705 exceeds the measured cotangent worst-case downside 0.14 by ~4x.
 *
 *   WHY GROUP THESE (not re-derive). Read individually, imp-97133 reads as a technical remainder
 *   estimate, imp-97159 as a threshold computation, imp-97167 as an unrelated sign-pattern curiosity,
 *   and imp-97168 as a bookkeeping comparison. Read together, the cohort is the COMPLETE arithmetic-leaf
 *   story of the Route M first moment: the exact constant (imp-97096, prior) now carries an explicit
 *   remainder (imp-97133), an explicit range on which it is guaranteed strictly positive (imp-97159), a
 *   derived (not just measured) explanation of its residual's sign pattern (imp-97167), and a settled
 *   accounting against the companion's actual requirement -- kappa>0, not 0.696 -- showing no shortfall
 *   (imp-97168). This index bakes that reading so a future scout does not re-measure eps(b) positivity
 *   ranges already derived, does not re-attempt explaining the sign law imp-97140 only measured, and
 *   does not mistake the kappa_arith/kappa gap for an unresolved deficit.
 *
 *   MEASURED / DERIVED (what each leaf actually establishes).
 *   - F_arith(b) >= (kappa_arith - eps(b)) phi(b) b, eps(b) = (1/2) 2^omega(b)(log b+3)/phi(b) -> 0,
 *     2^omega(b)-modulus-dependent, NOT tight for smooth b (imp-97133, rigorous derivation).
 *   - eps(b) < kappa_arith for all b >= 574 (finite proof), sharply for all b >= 511, so F_arith(b) > 0
 *     is GUARANTEED (not measured) on that explicit range (imp-97159, rigorous derivation).
 *   - sign(r(b)) = (-1)^(omega(b)+1) is DERIVED (not just observed) from
 *     r(b) phi(b) = (1/4) Lambda(b) + Sum_{m|b} mu(b/m) delta(m), with the primorial-collapse
 *     exceptions characterized as the points where the leading tail term is annihilated (imp-97167,
 *     rigorous derivation, uniform non-cancellation for all non-primorial b left open).
 *   - kappa_arith (0.5705, proved) and kappa (0.696, measured) are DIFFERENT functionals differing
 *     exactly by the positive cotangent leaf kappa_cot (~+0.1255); the proved arithmetic floor exceeds
 *     the measured cotangent worst-case downside (0.14) by ~4x, so no genuine shortfall exists
 *     (imp-97168, assessment).
 *
 *   NOT ESTABLISHED (what stays open).
 *   - a fully uniform O(1/b) remainder (no 2^omega(b) factor) for L0(b), L1(b) is not proved, only
 *     plausible from observed mu-cancellation on smooth moduli (imp-97133's residual).
 *   - a quantitative lower bound certifying the derived sign law holds for EVERY non-primorial b (not
 *     just the observed 2799/2801 sample) is not proved (imp-97167's residual).
 *   - the cotangent leaf F_cot(b) (Bettin-Conrey mean value, imp-97097) has no proved absolute lower
 *     bound; kappa>0 for the FULL first moment stays a measurement, not a certificate.
 *
 *   STATUS: a grouping/index note over four already-completed tickets, not a new derivation. No bound
 *   changes: kappa_arith=0.5705 remains the proved arithmetic-leaf floor, kappa~0.696 stays measured for
 *   the full first moment; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (exact kappa_arith derivation, prior to cohort)
 * @see imp-97133-route-m-arith-first-moment-explicit-remainder.js (explicit remainder, F_arith lower bound)
 * @see imp-97159-route-m-arith-first-moment-positivity-crossover.js (rigorous crossover b0=574/511)
 * @see imp-97167-route-m-parity-sign-law-derivation.js (derives the residual sign law, not just measures it)
 * @see imp-97168-route-m-kappa-arith-vs-companion-target-reconciliation.js (kappa_arith vs kappa~0.696)
 * @see imp-97155-route-m-first-moment-evaluation-cohort-index.js (sibling index: the analytic-evaluation cohort)
 * @see project_route_m_lower_companion_first_moment (Route M first-moment program, memory)
 *
 * Ticket: imp-97200 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

const GAMMA = 0.5772156649015329;
const C = (Math.log(2 * Math.PI) - GAMMA) / 2; // (log 2pi - gamma)/2 = 0.6303307...
const KAPPA_ARITH = 1.5 * C - 3 / 8; // = 0.5704960511308594 (imp-97096, exact)

const ROUTE_M_ARITH_FIRST_MOMENT_POSITIVITY_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97133',
    role: 'derives an explicit rigorous remainder for the arithmetic first-moment coprime sums',
    result:
      'F_arith(b) >= (kappa_arith - eps(b)) phi(b) b with a named absolute constant ' +
      '2^omega(b)(log b + 2); eps(b) = O(b^{-1+o(1)}) -> 0 but is 2^omega(b)-modulus-dependent, not a ' +
      'uniform O(1/b) (left as this leaf residual).',
  }),
  Object.freeze({
    id: 'imp-97159',
    role: 'derives the crossover modulus above which the imp-97133 remainder guarantees positivity',
    result:
      'a finite, three-case proof gives eps(b) < kappa_arith for all b >= 574 (sharpened by direct ' +
      'check to the exact smallest b0=511), so F_arith(b) > 0 is GUARANTEED, not merely measured, on ' +
      'that explicit range.',
  }),
  Object.freeze({
    id: 'imp-97167',
    role: 'derives the imp-97140 empirically-observed residual sign law from the same remainder identity',
    result:
      'r(b) phi(b) = (1/4) Lambda(b) + Sum_{m|b} mu(b/m) delta(m) gives sign(r(b)) = (-1)^(omega(b)+1), ' +
      'corrects imp-97140s mislabeled rule string, and characterizes the primorial-collapse exceptions; ' +
      'a uniform non-cancellation certificate for every non-primorial b stays open.',
  }),
  Object.freeze({
    id: 'imp-97168',
    role: 'reconciles the proved arithmetic-leaf constant against the measured full-first-moment target',
    result:
      'kappa_arith=0.5705 (proved) and kappa~0.696 (measured, full first moment) are DIFFERENT ' +
      'functionals differing by the positive cotangent leaf (~+0.1255); no genuine shortfall -- the ' +
      'proved arithmetic floor exceeds the measured cotangent worst-case downside (0.14) by ~4x.',
  }),
]);

export const IMP97200_ROUTE_M_ARITH_FIRST_MOMENT_POSITIVITY_COHORT_INDEX = Object.freeze({
  id: 'imp-97200',
  proofSection: 'S-frontier',
  cohort: ROUTE_M_ARITH_FIRST_MOMENT_POSITIVITY_COHORT,
  measuredSignal:
    'the arithmetic leaf of the Route M first moment is now PROVED with an explicit remainder ' +
    '(imp-97133), an explicit guaranteed-positivity range b>=511 (imp-97159), a derived (not measured) ' +
    'sign law for its residual (imp-97167), and a settled accounting against the mean-square companion ' +
    'target showing no genuine shortfall (imp-97168).',
  namedResiduals: [
    'IMP97133_ARITH_FIRST_MOMENT_UNIFORM_REMAINDER_OPEN',
    'IMP97167_PARITY_SIGN_LAW_UNIFORM_NONCANCELLATION_OPEN',
    'IMP97097_COTANGENT_MEAN_VALUE_LOWER_BOUND_OPEN',
  ],
  kappaArith: KAPPA_ARITH,
  positivityGuaranteedFrom: 511,
  kappaFullMeasured: 0.696,
  anyBoundMoved: false,
  question:
    'The Route M arithmetic first-moment cohort (imp-97133/97159/97167/97168) reads as four separate ' +
    'tickets. Grouped, does the arithmetic leaf of the first moment amount to a complete, self-contained ' +
    'proved-positive family, distinct from the still-open cotangent leaf and from kappa>0 in the ' +
    'mean-square companion sense?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). imp-97133 proves an explicit remainder for F_arith with a ' +
    'named 2^omega(b)-dependent constant; imp-97159 derives from it a rigorous, explicit range (b>=511) ' +
    'on which F_arith(b) > 0 is guaranteed; imp-97167 derives (not just measures) the residuals sign law ' +
    'from the same remainder identity, characterizing its primorial-collapse exceptions; imp-97168 ' +
    'reconciles the proved kappa_arith=0.5705 against the measured full-first-moment kappa~0.696, showing ' +
    'the gap is exactly the positive cotangent leaf and not a shortfall. Together these four form the ' +
    'ARITHMETIC-LEAF-PROVED family: complete on its own terms, with three named residuals left open (a ' +
    'uniform O(1/b) remainder, a uniform sign-law non-cancellation certificate, and the cotangent leafs ' +
    'own lower bound). Establishes nothing new; moves no bound; RH open; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97133 (explicit remainder); imp-97159 (positivity crossover); imp-97167 (sign-law derivation); ' +
    'imp-97168 (kappa_arith vs kappa reconciliation).',
});

export default IMP97200_ROUTE_M_ARITH_FIRST_MOMENT_POSITIVITY_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97200_ROUTE_M_ARITH_FIRST_MOMENT_POSITIVITY_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97200-cohort-has-all-four-members',
    why: 'The whole point of the index is grouping exactly these four tickets; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97200_ROUTE_M_ARITH_FIRST_MOMENT_POSITIVITY_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-97133', 'imp-97159', 'imp-97167', 'imp-97168'].every((id) => ids.includes(id));
    },
  },
  {
    id: 'imp97200-kappa-arith-matches-imp97133',
    why: 'The index quotes the proved arithmetic-leaf coefficient; it must match imp-97096/97133 ' +
      'bit-for-bit, not a rounded restatement.',
    holds: () =>
      Math.abs(IMP97200_ROUTE_M_ARITH_FIRST_MOMENT_POSITIVITY_COHORT_INDEX.kappaArith - 0.5704960511308594) < 1e-12,
  },
  {
    id: 'imp97200-positivity-range-matches-imp97159',
    why: 'The index quotes the exact sharp crossover b0=511 derived in imp-97159; a stale value would ' +
      'silently misrepresent the guaranteed-positivity range.',
    holds: () => IMP97200_ROUTE_M_ARITH_FIRST_MOMENT_POSITIVITY_COHORT_INDEX.positivityGuaranteedFrom === 511,
  },
  {
    id: 'imp97200-named-residuals-present',
    why: 'The index exists to surface the open sub-gaps by name, so future work can find them without ' +
      're-reading all four tickets.',
    holds: () => {
      const idx = IMP97200_ROUTE_M_ARITH_FIRST_MOMENT_POSITIVITY_COHORT_INDEX;
      return (
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.includes('IMP97133_ARITH_FIRST_MOMENT_UNIFORM_REMAINDER_OPEN') &&
        idx.namedResiduals.includes('IMP97167_PARITY_SIGN_LAW_UNIFORM_NONCANCELLATION_OPEN') &&
        idx.namedResiduals.includes('IMP97097_COTANGENT_MEAN_VALUE_LOWER_BOUND_OPEN') &&
        idx.anyBoundMoved === false
      );
    },
  },
  {
    id: 'imp97200-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      /NO QED/.test(IMP97200_ROUTE_M_ARITH_FIRST_MOMENT_POSITIVITY_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97200_ROUTE_M_ARITH_FIRST_MOMENT_POSITIVITY_COHORT_INDEX.verdict) &&
      /RH open/.test(IMP97200_ROUTE_M_ARITH_FIRST_MOMENT_POSITIVITY_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97200_ROUTE_M_ARITH_FIRST_MOMENT_POSITIVITY_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97200-route-m-arith-first-moment-positivity-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
