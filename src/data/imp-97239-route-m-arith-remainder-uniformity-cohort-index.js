/**
 * @module imp-97239-route-m-arith-remainder-uniformity-cohort-index
 * @fileoverview imp-97239 -- META cross-reference index note grouping the Route M arithmetic-remainder
 *   UNIFORMITY cohort (imp-97133 explicit 2^omega(b) bound / imp-97158 primes-only sharpness measurement /
 *   imp-97202 2^omega-removal for the binding E0 term, with the E1 uniform constant left as its own named
 *   residual) as a single ARC, so future work reads the three together as "derive with a modulus-dependent
 *   constant, measure whether that dependence is forced, then remove it for the binding term" instead of
 *   three isolated leaves. Index/meta only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE COHORT (chronological). All three act on the imp-97133 Theorem-1/Theorem-2 remainders for the
 *   Moebius/Stirling coprime sums L0(b) = Sum_{a in R_b} log a, L1(b) = Sum_{a in R_b} a log a
 *   (R_b = {a : 1<=a<b, (a,b)=1}), which feed the exact leading coefficient kappa_arith = (3/2) C - 3/8 =
 *   0.5704960511308594... of imp-97096 (C = (log 2pi - gamma)/2).
 *     imp-97133 -- derives an EXPLICIT rigorous remainder via Moebius inversion + Robbins Stirling bounds:
 *       L0(b) = phi(b)(log b - 1) + E0(b), |E0(b)| <= 2^omega(b)(log b + 2), and similarly for L1/E1,
 *       yielding F_arith(b) >= (kappa_arith - eps(b)) phi(b) b with an explicit but 2^omega(b)-MODULUS-
 *       DEPENDENT eps(b) -- a pure triangle-inequality bound, no mu-cancellation exploited.
 *     imp-97158 -- MEASURES how sharp that constant actually is: the E0 bound is saturated ONLY along the
 *       primes, where the ratio |E0|/bound climbs monotonically toward the asymptotic limit 1/4 (a finite
 *       factor-4 overhead); prime powers and primorials undershoot by orders of magnitude (genuine
 *       mu-sign cancellation the triangle bound discards); the E1 bound is uniformly looser (~40x, ratio
 *       -> 0 everywhere) and never saturates. Read alone, this measurement reads as evidence that 2^omega(b)
 *       is close to necessary on the tight (prime) class.
 *     imp-97202 -- answers the question imp-97158's measurement raises: does primes-only saturation FORCE
 *       the 2^omega(b) prefactor? NO. An exact Moebius-moment regrouping (using Sum mu(d) = 0 and the
 *       Dirichlet identity Sum mu(d) log d = -Lambda(b)) collapses the up-to-2^omega(b)-term divisor sums
 *       into |E0(b)| <= (1/2) log b + (1/2) log 2pi + 11/8 + (1/6) sigma(b)/b = (1/2) log b + O(log log b),
 *       a genuinely UNIFORM bound with NO 2^omega(b) factor, for the binding E0 term. It shows the 1/4
 *       saturation ratio imp-97158 measured was itself a factor-2 overcounting artifact of the triangle
 *       method, not evidence of necessity. The analogous uniform constant for the (loose, non-binding) E1
 *       term is left as this leaf's own named residual, together with sharpening the proven O(log log b)
 *       Stirling-tail slack to the measured O(1).
 *
 *   WHY GROUP THESE (not re-derive). Read individually, imp-97133 reads as a completed remainder result
 *   whose 2^omega(b) dependence looks like a fixed cost of the method, imp-97158 reads as a sharpness
 *   measurement that appears to CONFIRM that cost is close to forced (primes saturate at 1/4), and
 *   imp-97202 reads as an unrelated later derivation. Read together, the three form one arc: a scout
 *   stopping after imp-97133+imp-97158 would wrongly conclude the 2^omega(b) prefactor is load-bearing on
 *   the tight (prime) class; imp-97202 shows it was a 2x triangle-inequality artifact all along, removable
 *   by exploiting the SAME divisor-sum structure imp-97158 measured. This index bakes that reading so a
 *   future scout does not re-measure E0 saturation ratios already computed, does not re-attempt "is 2^omega
 *   forced" (already answered NO for E0), and does not mistake the E1 residual left in imp-97202 for a gap
 *   in E0.
 *
 *   MEASURED / DERIVED (what each leaf actually establishes).
 *   - F_arith(b) >= (kappa_arith - eps(b)) phi(b) b, eps(b) = (1/2) 2^omega(b)(log b+3)/phi(b) -> 0, an
 *     explicit but 2^omega(b)-modulus-dependent bound (imp-97133, rigorous derivation).
 *   - the E0 bound saturates ONLY along primes (asymptotic ratio -> 1/4, ~5.0x margin at b~5000); prime
 *     powers/primorials undershoot by orders via mu-cancellation; the E1 bound is uniformly loose (~40x,
 *     ratio -> 0 everywhere), identifying E0 as the binding remainder and E1 as slack (imp-97158,
 *     measurement, no bound moved).
 *   - a fully UNIFORM (no 2^omega(b)) bound for the binding E0 term: |E0(b)| <= (1/2) log b + (1/2) log 2pi
 *     + 11/8 + (1/6) sigma(b)/b, via an exact Moebius-moment regrouping (Sum mu(d)=0, Sum mu(d) log d =
 *     -Lambda(b), and a geometric moment bound |S_k(b)| <= zeta(k)-1 <= 3*2^-k that beats the up-to-2^omega
 *     term count); answers NO to "does primes-only sharpness force 2^omega" (imp-97202, rigorous
 *     derivation, verified zero violations over b in [2,20000]).
 *
 *   NOT ESTABLISHED (what stays open).
 *   - an explicit UNIFORM (no 2^omega(b)) constant for the E1 remainder is not pinned, only asserted
 *     plausible by the same moment mechanism (imp-97202's own named residual).
 *   - the Stirling-tail bound |R(b)| = O(log log b) (via Robin's sigma(b)/b bound) is proven but not
 *     sharpened to the measured true behavior |R(b)| <= 0.13 = O(1) (imp-97202's own named residual).
 *   - the cotangent leaf F_cot(b) (Bettin-Conrey mean value, imp-97097) has no proved absolute lower bound;
 *     kappa>0 for the FULL first moment stays a measurement, not a certificate.
 *
 *   STATUS: a grouping/index note over three already-completed tickets, not a new derivation. No bound
 *   changes: kappa_arith=0.5705 remains the proved arithmetic-leaf constant, the E0 remainder is now proved
 *   uniform (no 2^omega); no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (exact kappa_arith derivation, prior to cohort)
 * @see imp-97133-route-m-arith-first-moment-explicit-remainder.js (explicit but 2^omega(b)-dependent remainder)
 * @see imp-97158-route-m-theorem1-remainder-sharpness.js (measures saturation: primes-only, ratio -> 1/4)
 * @see imp-97202-route-m-arith-first-moment-uniform-remainder.js (removes 2^omega for the binding E0 term)
 * @see imp-97200-route-m-arith-first-moment-positivity-cohort-index.js (sibling index: the positivity cohort)
 * @see project_route_m_lower_companion_first_moment (Route M first-moment program, memory)
 *
 * Ticket: imp-97239 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

const GAMMA = 0.5772156649015329;
const C = (Math.log(2 * Math.PI) - GAMMA) / 2; // (log 2pi - gamma)/2 = 0.6303307...
const KAPPA_ARITH = 1.5 * C - 3 / 8; // = 0.5704960511308594 (imp-97096, exact)

const ROUTE_M_ARITH_REMAINDER_UNIFORMITY_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97133',
    role: 'derives an explicit but 2^omega(b)-modulus-dependent rigorous remainder for the coprime sums',
    result:
      'F_arith(b) >= (kappa_arith - eps(b)) phi(b) b with a named absolute constant 2^omega(b)(log b + 2) ' +
      'for both L0 (E0) and L1 (E1) remainders; a pure triangle-inequality bound with no mu-cancellation ' +
      'exploited (left as this leafs residual).',
  }),
  Object.freeze({
    id: 'imp-97158',
    role: 'measures the sharpness of the imp-97133 constants across b-classes',
    result:
      'the E0 bound saturates ONLY along the primes, ratio -> 1/4 asymptotically (finite factor-4 ' +
      'overhead); prime powers/primorials undershoot by orders via mu-cancellation; the E1 bound is ' +
      'uniformly looser (~40x, ratio -> 0 everywhere), identifying E0 as binding and E1 as slack.',
  }),
  Object.freeze({
    id: 'imp-97202',
    role: 'removes the 2^omega(b) prefactor from the binding E0 term via an exact Moebius-moment regrouping',
    result:
      '|E0(b)| <= (1/2) log b + (1/2) log 2pi + 11/8 + (1/6) sigma(b)/b, a genuinely UNIFORM bound with NO ' +
      '2^omega(b) factor, answering NO to whether primes-only saturation forces it; the analogous uniform ' +
      'constant for E1 and the O(log log b) -> O(1) Stirling-tail sharpening are left as named residuals.',
  }),
]);

export const IMP97239_ROUTE_M_ARITH_REMAINDER_UNIFORMITY_COHORT_INDEX = Object.freeze({
  id: 'imp-97239',
  proofSection: 'S-frontier',
  cohort: ROUTE_M_ARITH_REMAINDER_UNIFORMITY_COHORT,
  measuredSignal:
    'the binding E0 remainder of the Route M arithmetic first moment now carries a UNIFORM bound with ' +
    'no 2^omega(b) prefactor (imp-97202), after imp-97133 first proved a 2^omega(b)-dependent version and ' +
    'imp-97158 measured that dependence looked close to forced on the tight (prime) class -- it was not.',
  namedResiduals: [
    'IMP97202_E1_UNIFORM_CONSTANT_OPEN',
    'IMP97202_STIRLING_TAIL_O1_SHARPENING_OPEN',
    'IMP97097_COTANGENT_MEAN_VALUE_LOWER_BOUND_OPEN',
  ],
  kappaArith: KAPPA_ARITH,
  primesOnlySaturationRatioLimit: 0.25, // imp-97158: asymptotic ratio |E0|/(2^omega(log b+2)) -> 1/4 on primes
  uniformE0Bound: '(1/2) log b + (1/2) log 2pi + 11/8 + (1/6) sigma(b)/b',
  forcedBy2omega: false,
  anyBoundMoved: false,
  question:
    'The Route M arithmetic-remainder cohort (imp-97133/97158/97202) reads as three separate tickets, and ' +
    'the middle one (imp-97158) reads as evidence the 2^omega(b) prefactor is close to necessary on primes. ' +
    'Grouped, does the cohort settle whether that prefactor is actually forced, and by how much does the ' +
    'binding remainder improve once it is removed?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). imp-97133 proves an explicit but 2^omega(b)-dependent ' +
    'remainder for both E0 and E1; imp-97158 measures that the E0 bound saturates only on primes (ratio ' +
    '-> 1/4) while E1 never saturates (~40x loose), correctly identifying E0 as binding; imp-97202 then ' +
    'shows the primes-only saturation was a factor-2 triangle-inequality artifact, not necessity, and ' +
    'removes 2^omega(b) entirely from the binding E0 term via an exact Moebius-moment regrouping, leaving ' +
    'only the (already-known-loose) E1 constant and an O(log log b)->O(1) tail sharpening open. Together ' +
    'these three form the UNIFORMITY-FOR-THE-BINDING-TERM family: a scout stopping after the first two ' +
    'would misjudge 2^omega(b) as forced; the cohort corrects that. Establishes nothing new; moves no ' +
    'bound; RH open; NO QED. No refereed bound is changed.',
  citation:
    'imp-97133 (explicit 2^omega(b) remainder); imp-97158 (sharpness measurement, primes-only saturation); ' +
    'imp-97202 (uniform E0 remainder, 2^omega(b) removed, NO to forced-necessity).',
});

export default IMP97239_ROUTE_M_ARITH_REMAINDER_UNIFORMITY_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97239_ROUTE_M_ARITH_REMAINDER_UNIFORMITY_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97239-cohort-has-all-three-members',
    why: 'The whole point of the index is grouping exactly these three tickets; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97239_ROUTE_M_ARITH_REMAINDER_UNIFORMITY_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-97133', 'imp-97158', 'imp-97202'].every((id) => ids.includes(id));
    },
  },
  {
    id: 'imp97239-kappa-arith-matches-imp97133',
    why: 'The index quotes the proved arithmetic-leaf coefficient; it must match imp-97096/97133 ' +
      'bit-for-bit, not a rounded restatement.',
    holds: () =>
      Math.abs(IMP97239_ROUTE_M_ARITH_REMAINDER_UNIFORMITY_COHORT_INDEX.kappaArith - 0.5704960511308594) < 1e-12,
  },
  {
    id: 'imp97239-not-forced-by-2omega',
    why: 'The whole point of this index is that imp-97202 answers NO to the question imp-97158s ' +
      'measurement raises; a flipped flag would silently misrepresent the settled answer.',
    holds: () => IMP97239_ROUTE_M_ARITH_REMAINDER_UNIFORMITY_COHORT_INDEX.forcedBy2omega === false,
  },
  {
    id: 'imp97239-named-residuals-present',
    why: 'The index exists to surface the open sub-gaps by name, so future work can find them without ' +
      're-reading all three tickets.',
    holds: () => {
      const idx = IMP97239_ROUTE_M_ARITH_REMAINDER_UNIFORMITY_COHORT_INDEX;
      return (
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.includes('IMP97202_E1_UNIFORM_CONSTANT_OPEN') &&
        idx.namedResiduals.includes('IMP97202_STIRLING_TAIL_O1_SHARPENING_OPEN') &&
        idx.namedResiduals.includes('IMP97097_COTANGENT_MEAN_VALUE_LOWER_BOUND_OPEN') &&
        idx.anyBoundMoved === false
      );
    },
  },
  {
    id: 'imp97239-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      /NO QED/.test(IMP97239_ROUTE_M_ARITH_REMAINDER_UNIFORMITY_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97239_ROUTE_M_ARITH_REMAINDER_UNIFORMITY_COHORT_INDEX.verdict) &&
      /RH open/.test(IMP97239_ROUTE_M_ARITH_REMAINDER_UNIFORMITY_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97239_ROUTE_M_ARITH_REMAINDER_UNIFORMITY_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97239-route-m-arith-remainder-uniformity-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
