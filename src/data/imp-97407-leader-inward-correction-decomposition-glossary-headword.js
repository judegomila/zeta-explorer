/**
 * @module imp-97407-leader-inward-correction-decomposition-glossary-headword
 * @fileoverview imp-97407 -- import-light glossary/Concepts headword recording the imp-97290
 *   "leader + inward-correction" decomposition E1(b) = mu(b)(b/4) + Delta(b) and its sign +
 *   magnitude reduction of the Route M arithmetic |E1(b)| <= b/4 ceiling.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE DECOMPOSITION. An EXACT identity (verified to machine precision, not an estimate)
 *   splitting E1(b) = L1(b) - phi(b) b((1/2)log b - 1/4) into a clean +-b/4 LEADER carrying all
 *   of the b-scale content, mu(b)(b/4), plus a correction Delta(b) = Sum_{d|b, d<b} mu(d) d g(b/d)
 *   over PROPER divisors of the smooth positive weight g(m) = ln A + (1/12) log m + R(m)
 *   (g(1) = 1/4 exactly; ln A = Glaisher-Kinkelin log-constant).
 *   (b) WHY THE SIGN IS PARITY. The leader's sign is mu(b) = (-1)^omega(b): NEGATIVE on
 *   odd-omega b (primes, p*q*r, ...), POSITIVE on even-omega b (semiprimes p*q, ...). This
 *   corrects the imp-97265 framing that attributed the +-b/4 to the "d=1 term" -- the true
 *   carrier is the d=b remainder R(1) = 1/4 - ln A, and its sign flips with the parity of the
 *   leader, not with d=1.
 *   (c) THE REDUCTION. |E1(b)| <= b/4 becomes EQUIVALENT to (i) SIGN: mu(b) Delta(b) <= 0 (the
 *   correction must point inward, opposite the leader) and (ii) MAGNITUDE: |Delta(b)| <= b/2.
 *   (d) WHAT IT PROVES. Using g(m)/m <= g(2)/2 (decreasing, attained at m=2), imp-97290 proves
 *   both (i) and (ii) for every distinct-prime semiprime b = pq, giving the strict ceiling
 *   |E1(pq)| < pq/4 -- lifting the imp-97265 prime-only ceiling to the full omega=2 class,
 *   including the near-twin saturating family (6, 77, 899, 5183, 47053, ...).
 *   (e) WHAT REMAINS OPEN. omega(b) >= 3: the sign and magnitude conditions on Delta(b) with the
 *   Moebius cancellation retained (the naive triangle bound over-charges for many-small-prime b,
 *   since sigma(b)/b = prod(1+1/p) is unbounded).
 *   (f) STATUS: documentation only. No rigorous uniform ceiling for omega>=3; no bound on Lambda
 *   moves; no refereed bound is changed; RH open; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   decomposition and partial proof. Not a new proof, not a new bound. NO QED.
 *
 * @see imp-97290-route-m-arith-quarter-ceiling-semiprime-proof.js (source: the exact decomposition,
 *   the ceiling reduction, and the proved semiprime ceiling)
 * @see imp-97265-route-m-arith-first-moment-quarter-ceiling-proof.js (the prime ceiling / close-factor
 *   residual imp-97290 advances)
 * @see imp-97269-route-m-e1-quarter-b-class-uniformity-crosscheck.js (per-class |E1|/(b/4) tabulation
 *   showing the omega>=3 over-charge behaviour the residual names)
 *
 * Ticket: imp-97407 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The leader + inward-correction headword, baked verbatim (no re-import).
const LEADER_INWARD_CORRECTION_HEADWORD = Object.freeze({
  key: 'leader-inward-correction-decomposition-imp97290',
  term:
    'leader + inward-correction decomposition: the exact identity E1(b) = mu(b)(b/4) + Delta(b) ' +
    'isolating the Route M arithmetic +-b/4 leader with a parity-fixed sign, plus its sign + ' +
    'magnitude reduction of the |E1(b)| <= b/4 ceiling',
  definition:
    'An exact identity (verified to machine precision on a mixed ladder to b=30030) splitting ' +
    'E1(b) = L1(b) - phi(b) b((1/2)log b - 1/4) into a clean +-b/4 leader mu(b)(b/4), whose sign ' +
    'is the parity (-1)^omega(b) (negative on primes / odd omega, positive on semiprimes / even ' +
    'omega), plus a correction Delta(b) = Sum_{d|b, d<b} mu(d) d g(b/d) over proper divisors of ' +
    'the smooth positive weight g(m) = ln A + (1/12) log m + R(m), g(1) = 1/4 exactly.',
  mechanism:
    'The reduction: |E1(b)| <= b/4 is EQUIVALENT to (i) SIGN: mu(b) Delta(b) <= 0 (the correction ' +
    'must point inward, opposite the leader) and (ii) MAGNITUDE: |Delta(b)| <= b/2. imp-97290 ' +
    'proves both for every distinct-prime semiprime b = pq via g(m)/m <= g(2)/2 = 0.1534264097 ' +
    '(decreasing, attained at m=2): SIGN gives Delta(pq) = g(pq) - p g(q) - q g(p) < 0, MAGNITUDE ' +
    'gives p g(q) + q g(p) <= pq g(2) = 0.306853 pq < pq/2. This lifts the imp-97265 prime-only ' +
    'ceiling to the full omega=2 class, including the near-twin saturating family ' +
    '(6, 77, 899, 5183, 47053, 1005973, 4003997). omega(b) >= 3 stays OPEN: the sign and magnitude ' +
    'conditions with the Moebius cancellation retained, since the naive triangle bound ' +
    '|Delta(b)| <= Sum_{d<b} d g(b/d) over-charges for many-small-prime b (sigma(b)/b unbounded).',
  verificationStatus:
    'Re-cited from the imp-97290 source module ' +
    '(src/data/imp-97290-route-m-arith-quarter-ceiling-semiprime-proof.js). The leader ' +
    'decomposition is an exact identity verified to ~1e-6 relative on a mixed ladder (primes, ' +
    'prime powers, primorials, semiprimes) to b=30030; the semiprime ceiling |E1(pq)| < pq/4 is ' +
    'proved rigorously for all distinct-prime semiprimes. The omega>=3 uniform ceiling is NOT ' +
    'proved. Naming / glossary headword only; supplies no new bound; RH open; no refereed bound is changed' +
    '; NO QED.',
});

export const IMP97407_LEADER_INWARD_CORRECTION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97407',
  proofSection: 'S-frontier',
  glosses: 'imp-97290',
  question:
    'imp-97290 proved an exact identity E1(b) = mu(b)(b/4) + Delta(b) isolating the Route M ' +
    'arithmetic +-b/4 leader with sign (-1)^omega(b), reduced the |E1(b)| <= b/4 ceiling to a ' +
    'sign + magnitude condition on Delta(b), and proved the full semiprime ceiling. What is the ' +
    'headword for this decomposition?',
  headword: LEADER_INWARD_CORRECTION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97290 leader + ' +
    'inward-correction decomposition E1(b) = mu(b)(b/4) + Delta(b): the exact identity isolating ' +
    'the +-b/4 leader with parity sign (-1)^omega(b), and its sign + magnitude reduction of the ' +
    '|E1(b)| <= b/4 ceiling (proved for omega <= 2, open for omega >= 3). No bound moved; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-97290 (the exact decomposition, the ceiling reduction, and the proved semiprime ceiling); ' +
    'imp-97265 (the prime ceiling this advances).',
});

export default IMP97407_LEADER_INWARD_CORRECTION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97407_LEADER_INWARD_CORRECTION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97407-headword-names-decomposition-and-reduction',
    why: 'The headword must name the exact decomposition, the parity sign of the leader, and the ' +
      'sign+magnitude reduction -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP97407_LEADER_INWARD_CORRECTION_GLOSSARY_HEADWORD.headword;
      return (
        /mu\(b\)\(b\/4\)/.test(h.definition) &&
        /\(-1\)\^omega\(b\)/.test(h.definition) &&
        /mu\(b\) Delta\(b\) <= 0/.test(h.mechanism) &&
        /0\.1534264097/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97407-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-97290.',
    holds: () =>
      IMP97407_LEADER_INWARD_CORRECTION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97407_LEADER_INWARD_CORRECTION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97407_LEADER_INWARD_CORRECTION_GLOSSARY_HEADWORD.verdict) &&
      IMP97407_LEADER_INWARD_CORRECTION_GLOSSARY_HEADWORD.glosses === 'imp-97290',
  },
];

for (const assertion of IMP97407_LEADER_INWARD_CORRECTION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97407-leader-inward-correction-decomposition-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
