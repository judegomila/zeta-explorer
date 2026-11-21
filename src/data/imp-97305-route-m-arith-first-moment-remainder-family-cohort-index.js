/**
 * @module imp-97305-route-m-arith-first-moment-remainder-family-cohort-index
 * @fileoverview imp-97305 -- META cross-reference index note grouping the Route M arithmetic
 *   first-moment uniform-remainder family (E0 uniform bound; E1 uniform constant; the Stirling-tail
 *   R(b) sharpening) as ONE cohort, distinct from the imp-97282 cotangent c_1/M2w cohort that imp-97218
 *   already separates it from. Read individually, the nine member leaves land at different statuses
 *   (one CLOSED, several MEASURED, several HONEST-PARTIAL) and a future scout may re-attempt a
 *   closed or already-obstructed piece, or miss that E0 is done while E1 and the tail remain open.
 *   Index/meta only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE COHORT (logical order, not chronological). All nine sharpen the SAME imp-97133 explicit
 *   remainder pair E0(b), E1(b) for the coprime sums L0(b) = Sum_{a in R_b} log a and
 *   L1(b) = Sum_{a in R_b} a log a, R_b = {a : 1<=a<=b-1, (a,b)=1}.
 *     imp-97202 -- CLOSES the E0 half: proves a genuinely uniform-in-b bound with NO 2^omega(b)
 *       prefactor, |E0(b)| <= (1/2) log b + O(log log b), via the exact Moebius-moment regrouping
 *       E0 = (1/2)Lambda(b) - (1/2)mu(b) log 2pi + kernel + R(b) and the geometric moment decay
 *       |S_k(b)| <= zeta(k)-1 <= 3*2^{-k} that defeats the up-to-2^omega term count.
 *     imp-97231 -- honest-status note recording that E0 closure and naming the two residuals it
 *       leaves open (the E1 constant; the R(b) tail), so the closure is not mistaken for the whole
 *       remainder pair being settled.
 *     imp-97218 -- banner distinguishing this arithmetic remainder gap from the SEPARATE cotangent
 *       mean-value gap (imp-97097); closing one does not touch the other.
 *     imp-97208 -- derives the TIGHTER E1 ceiling |E1(b)| <= b/4 + 2^omega(b)(log b+2), proves the
 *       EXACT prime asymptotic E1(prime b) = -b/4 + (1/12)log b + ln A + O(1/b) (Glaisher-Kinkelin),
 *       and measures 0 violations of |E1(b)|<=b/4 over b in [2,20000].
 *     imp-97269 -- cross-validates imp-97208 across ALL divisor classes: the b/4 ceiling is
 *       class-uniform (binds only on primes, undershoots on every smooth class), separating the
 *       class-uniform b-scale over-count 4(log b+2) from the class-dependent 2^omega inflation of
 *       the OLD imp-97133 constant.
 *     imp-97265 -- proof ATTEMPT on the b/4 ceiling: HONEST PARTIAL. Supplies an exact
 *       factorial-free per-divisor identity, proves the prime ceiling with a strictly positive
 *       margin, but finds a NEW obstruction -- close-prime-factor semiprimes (b=p*q, q=nextprime(p))
 *       ALSO saturate the ceiling toward 1, not primes alone -- and rules out tail-peeling as a
 *       reduction. Does not close the ceiling.
 *     imp-97288 -- attacks the explicit E1 uniform CONSTANT (not just the b/4 ceiling): HONEST
 *       PARTIAL. Derives the exact closed form CK(b), gives fully explicit bounds for three of its
 *       four constituents, and reduces the fourth to a single named Mertens-product estimate.
 *     imp-97266 -- MEASURES the Stirling tail R(b): vanishes like 1/(12b) on primes and prime
 *       powers, converges (alternating sign) to a finite limit L~0.127 on the binding primorial
 *       class -- decisively O(1), not the proved O(log log b) triangle envelope. Measurement only.
 *     imp-97289 -- PROVES the O(1) tail mechanism (Binet positive-kernel integral representation)
 *       on the prime and prime-power families (indeed o(1) there); the third (primorial/binding)
 *       family is reduced to one named cancellation inequality, not closed.
 *
 *   WHY GROUP THESE (not re-derive). Read individually, a scout sees imp-97202 as already closed
 *   and may not notice imp-97208/97269/97265/97288 (E1) and imp-97266/97289 (tail) are a DIFFERENT,
 *   still-open half of the same imp-97133 remainder pair -- or may re-attempt the b/4 ceiling past
 *   the imp-97265 semiprime obstruction, or re-attempt tail-peeling (already ruled out), or the
 *   primorial tail cancellation via the triangle bound (already shown asymptotically infinitely
 *   loose). This index bakes the closed/open split so future work targets the two live residuals
 *   (the E1 fourth constituent; the primorial tail cancellation inequality) instead.
 *
 *   STATUS SPLIT (verbatim from the member leaves).
 *   - E0 (L0 remainder): CLOSED. Uniform bound, no 2^omega, imp-97202/imp-97231.
 *   - E1 (L1 remainder) CEILING |E1(b)|<=b/4: MEASURED (0 violations, b<=20000), PROVED on primes
 *     only; OPEN on the full class (imp-97265 semiprime-saturation obstruction, not closed).
 *   - E1 EXPLICIT UNIFORM CONSTANT: HONEST PARTIAL, one Mertens-product estimate short (imp-97288).
 *   - R(b) TAIL: MEASURED O(1), L~0.127 (imp-97266); PROVED O(1)/o(1) on 2 of 3 omega-class
 *     families, primorial family reduced to one named inequality (imp-97289).
 *
 *   STATUS: a grouping/index note over nine already-committed modules, not a new derivation. No
 *   bound changes: no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97202-route-m-arith-first-moment-uniform-remainder.js (E0 closure)
 * @see imp-97231-route-m-e0-uniform-remainder-honest-status.js (E0 closure honest-status note)
 * @see imp-97218-route-m-first-moment-two-open-halves-banner.js (arith vs cotangent split)
 * @see imp-97208-route-m-theorem2-tighter-remainder.js (E1 b/4 ceiling, prime proof)
 * @see imp-97269-route-m-e1-quarter-b-class-uniformity-crosscheck.js (E1 ceiling class-uniformity)
 * @see imp-97265-route-m-arith-first-moment-quarter-ceiling-proof.js (E1 ceiling proof attempt, obstruction)
 * @see imp-97288-route-m-e1-explicit-uniform-constant.js (E1 explicit constant, honest partial)
 * @see imp-97266-route-m-arith-tail-o1-measurement.js (R(b) tail O(1) measurement)
 * @see imp-97289-route-m-arith-tail-o1-proof.js (R(b) tail O(1) proof, honest partial)
 * @see imp-97282-route-m-cotangent-c1-m2w-cohort-index.js (sibling cohort: the SEPARATE cotangent gap this excludes)
 *
 * Ticket: imp-97305 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

const ARITH_FIRST_MOMENT_REMAINDER_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97202',
    role: 'closes the E0 (log-weight) remainder half',
    status: 'CLOSED',
    result:
      'Uniform-in-b bound |E0(b)| <= (1/2) log b + (1/2) log 2pi + 11/8 + (1/6) sigma(b)/b, NO ' +
      '2^omega(b) prefactor, via exact Moebius-moment regrouping and geometric moment decay ' +
      '|S_k(b)| <= zeta(k)-1 <= 3*2^{-k}.',
  }),
  Object.freeze({
    id: 'imp-97231',
    role: 'honest-status note recording the E0 closure',
    status: 'NOTE',
    result:
      'Records imp-97202 CLOSED for E0; names the two residuals it leaves open (E1 constant; R(b) ' +
      'tail sharpening) so the closure is not mistaken for the whole remainder pair.',
  }),
  Object.freeze({
    id: 'imp-97218',
    role: 'banner separating this cohort from the cotangent mean-value gap',
    status: 'NOTE',
    result:
      'IMP97096_ARITH_EXPLICIT_REMAINDER_BOUND_OPEN (this cohort) is a DIFFERENT open problem from ' +
      'IMP97097_COTANGENT_MEAN_VALUE_LOWER_BOUND_OPEN; closing one does not touch the other.',
  }),
  Object.freeze({
    id: 'imp-97208',
    role: 'derives the tighter E1 (weighted) ceiling and the exact prime asymptotic',
    status: 'MEASURED + PROVED-ON-PRIMES',
    result:
      '|E1(b)| <= b/4 + 2^omega(b)(log b+2); exact prime asymptotic E1(prime b) = -b/4 + ' +
      '(1/12)log b + ln A + O(1/b); 0 violations of |E1(b)|<=b/4 measured over b in [2,20000].',
  }),
  Object.freeze({
    id: 'imp-97269',
    role: 'cross-validates the b/4 ceiling class-uniformity',
    status: 'MEASURED',
    result:
      'The b/4 ceiling is class-uniform: binds (rises to 1) only on primes, undershoots on every ' +
      'smooth class; separates the class-uniform b-scale over-count 4(log b+2) from the ' +
      'class-dependent 2^omega inflation of the old constant.',
  }),
  Object.freeze({
    id: 'imp-97265',
    role: 'proof attempt on the b/4 ceiling; finds a new obstruction',
    status: 'HONEST PARTIAL -- NOT CLOSED',
    result:
      'Exact factorial-free per-divisor identity; proves the prime ceiling with a strictly ' +
      'positive margin; but close-prime-factor semiprimes (b=p*q, q=nextprime(p)) ALSO saturate ' +
      'the ceiling toward 1 -- not primes alone -- and tail-peeling is ruled out as a reduction.',
  }),
  Object.freeze({
    id: 'imp-97288',
    role: 'attacks the explicit E1 uniform constant (not just the ceiling)',
    status: 'HONEST PARTIAL -- ONE CONSTITUENT SHORT',
    result:
      'Exact closed form CK(b); three of four constituents given fully explicit uniform bounds; ' +
      'the fourth reduces to a single named Mertens-product estimate.',
  }),
  Object.freeze({
    id: 'imp-97266',
    role: 'measures the Stirling tail R(b)',
    status: 'MEASURED O(1)',
    result:
      'R(b) vanishes like 1/(12b) on primes and prime powers; converges (alternating sign) to a ' +
      'finite limit L~0.127 on the binding primorial class -- decisively O(1), not the proved ' +
      'O(log log b) triangle envelope. Measurement only.',
  }),
  Object.freeze({
    id: 'imp-97289',
    role: 'proves the O(1) tail mechanism on two of three omega-class families',
    status: 'HONEST PARTIAL -- ONE FAMILY OPEN',
    result:
      'Binet positive-kernel integral representation proves O(1) (indeed o(1)) on the prime and ' +
      'prime-power families; the primorial/binding family is reduced to one named cancellation ' +
      'inequality, not closed.',
  }),
]);

export const IMP97305_ARITH_FIRST_MOMENT_REMAINDER_FAMILY_COHORT_INDEX = Object.freeze({
  id: 'imp-97305',
  proofSection: 'S-frontier',
  cohort: ARITH_FIRST_MOMENT_REMAINDER_COHORT,
  e0Status: 'CLOSED (imp-97202/imp-97231): uniform |E0(b)| <= (1/2) log b + O(log log b), no 2^omega.',
  e1CeilingStatus: 'MEASURED+PROVED-ON-PRIMES, OPEN in full (imp-97208/97269/97265): |E1(b)|<=b/4 obstructed past primes by close-prime semiprimes.',
  e1ConstantStatus: 'HONEST PARTIAL (imp-97288): one Mertens-product estimate short of the explicit uniform constant.',
  tailStatus: 'MEASURED O(1), PROVED on 2/3 families (imp-97266/imp-97289): primorial family reduced to one named cancellation inequality.',
  question:
    'The Route M arithmetic first-moment remainder leaves (imp-97202/97208/97218/97231/97265/' +
    '97266/97269/97288/97289) read as separate tickets landing at different statuses. Grouped, ' +
    'which half of the imp-97133 remainder pair is actually settled, and which residuals remain ' +
    'the live targets for future work?',
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). The cohort splits cleanly: E0 (the log-weight ' +
    'remainder) is CLOSED with a genuinely uniform bound and no 2^omega prefactor (imp-97202, ' +
    'recorded by imp-97231); the SEPARATE cotangent mean-value gap is explicitly excluded ' +
    '(imp-97218). E1 (the weight-b remainder) is only partly settled: the b/4 ceiling is measured ' +
    'with zero violations and proved exactly on the prime class (imp-97208/97269), but imp-97265 ' +
    'shows close-prime-factor semiprimes saturate it too, obstructing a full-class proof, and the ' +
    'explicit uniform constant (imp-97288) is one Mertens-product estimate short. The Stirling tail ' +
    'R(b) is measured O(1) (imp-97266) and proved O(1)/o(1) on two of three omega-class families ' +
    '(imp-97289), with the primorial/binding family reduced to one named cancellation inequality. ' +
    'Future work on this thread should treat E0 as done, should not re-attempt tail-peeling on the ' +
    'b/4 ceiling (already ruled out) or the primorial tail via the plain triangle bound (already ' +
    'shown asymptotically infinitely loose), and should target the two live residuals: the E1 ' +
    'Mertens-product constituent and the primorial-family tail cancellation inequality. No bound ' +
    'on Lambda moves; establishes nothing new; RH open; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97202 (E0 closure); imp-97231 (E0 honest-status note); imp-97218 (arith/cotangent split ' +
    'banner); imp-97208 (E1 tighter ceiling + prime proof); imp-97269 (E1 ceiling class-uniformity ' +
    'crosscheck); imp-97265 (E1 ceiling proof attempt, semiprime obstruction); imp-97288 (E1 ' +
    'explicit constant, honest partial); imp-97266 (R(b) tail O(1) measurement); imp-97289 (R(b) ' +
    'tail O(1) proof, honest partial); imp-97282 (sibling cotangent cohort this excludes).',
});

export default IMP97305_ARITH_FIRST_MOMENT_REMAINDER_FAMILY_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97305_ARITH_FIRST_MOMENT_REMAINDER_FAMILY_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97305-cohort-has-all-nine-members',
    why: 'The whole point of the index is grouping exactly these nine modules; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97305_ARITH_FIRST_MOMENT_REMAINDER_FAMILY_COHORT_INDEX.cohort.map((c) => c.id);
      return [
        'imp-97202',
        'imp-97231',
        'imp-97218',
        'imp-97208',
        'imp-97269',
        'imp-97265',
        'imp-97288',
        'imp-97266',
        'imp-97289',
      ].every((id) => ids.includes(id));
    },
  },
  {
    id: 'imp97305-status-fields-present-and-consistent',
    why: 'The index exists to separate CLOSED from OPEN pieces of the same remainder pair; each ' +
      'status field must be present and must not overclaim closure of the still-open halves.',
    holds: () => {
      const idx = IMP97305_ARITH_FIRST_MOMENT_REMAINDER_FAMILY_COHORT_INDEX;
      return (
        typeof idx.e0Status === 'string' && /CLOSED/.test(idx.e0Status) &&
        typeof idx.e1CeilingStatus === 'string' && /OPEN/.test(idx.e1CeilingStatus) &&
        typeof idx.e1ConstantStatus === 'string' && /HONEST PARTIAL/.test(idx.e1ConstantStatus) &&
        typeof idx.tailStatus === 'string' && /MEASURED O\(1\)/.test(idx.tailStatus)
      );
    },
  },
  {
    id: 'imp97305-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97305_ARITH_FIRST_MOMENT_REMAINDER_FAMILY_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97305_ARITH_FIRST_MOMENT_REMAINDER_FAMILY_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97305_ARITH_FIRST_MOMENT_REMAINDER_FAMILY_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97305_ARITH_FIRST_MOMENT_REMAINDER_FAMILY_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97305-route-m-arith-first-moment-remainder-family-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
