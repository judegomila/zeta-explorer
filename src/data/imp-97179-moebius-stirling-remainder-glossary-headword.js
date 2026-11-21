/**
 * @module imp-97179-moebius-stirling-remainder-glossary-headword
 * @fileoverview imp-97179 -- import-light glossary/Concepts headword for the imp-97133 finding: an
 *   EXPLICIT rigorous remainder bound, with a named absolute constant, for the Moebius/Stirling
 *   coprime log-sums that drive the Route M arithmetic first moment.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-97133 closed the imp-97096 explicit-remainder sub-gap by proving Theorem 1
 *   (L0(b) = phi(b)(log b - 1) + E0(b), |E0(b)| <= 2^omega(b)(log b + 2)) and Theorem 2
 *   (the analogous L1(b) bound), via the exact floor((b-1)/d) = b/d - 1 identity for d|b, Robbins
 *   Stirling bounds, and the Euler phi-telescope Sum mu(d)(b/d) = phi(b). This headword bakes the
 *   named constant 2^omega(b)(log b + 2) verbatim so a reader looking for "the imp-97096 remainder
 *   bound" finds the exact statement without re-deriving it.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   For L0(b) = Sum_{a coprime to b, a<b} log a and L1(b) = Sum_{a coprime to b, a<b} a log a,
 *   |E0(b)| <= 2^omega(b)(log b + 2) and |E1(b)| <= 2^omega(b) b (log b + 2), where omega(b) is the
 *   number of distinct primes dividing b. This upgrades the exact leading coefficient
 *   kappa_arith = (3/2)C - 3/8 = 0.5704960511308594 into an explicit absolute lower bound
 *   F_arith(b) >= (kappa_arith - eps(b)) phi(b) b, eps(b) = (1/2) 2^omega(b)(log b + 3)/phi(b) -> 0.
 *
 *   STATUS: glossary headword restating already-committed imp-97133 findings, not a new estimate.
 *   The bound is 2^omega(b)-modulus-dependent (triangle inequality, no mu-cancellation) and vacuous
 *   on a finite set of small highly-composite moduli (e.g. b=210); a fully uniform O(1/b) bound
 *   stays an open residual. Moves no bound; T ~ 2.594e7 anchor unchanged; no refereed bound is changed;
 *   RH open. NO QED.
 *
 * @see imp-97133-route-m-arith-first-moment-explicit-remainder.js (source: the theorems + corollary)
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (the sub-gap this closes; exact kappa_arith)
 * @see imp-97122-route-m-arith-first-moment-convergence-rate.js (measured O(log b / b) rate)
 *
 * Ticket: imp-97179 (content, low, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The explicit remainder headword, baked verbatim (no re-import).
const MOEBIUS_STIRLING_REMAINDER_HEADWORD = Object.freeze({
  key: 'moebius-stirling-explicit-remainder-constant-2-pow-omega-log-b-plus-2',
  term:
    'imp-97133 finding: the Route M coprime log-sums L0(b) = Sum log a and L1(b) = Sum a log a ' +
    '(over a coprime to b, 1 <= a < b) have EXPLICIT rigorous remainders with the named absolute ' +
    'constant 2^omega(b)(log b + 2), upgrading kappa_arith into an absolute lower bound on F_arith(b)',
  definition:
    'L0(b) = phi(b)(log b - 1) + E0(b) with |E0(b)| <= 2^omega(b)(log b + 2), and ' +
    'L1(b) = phi(b) b((1/2) log b - 1/4) + E1(b) with |E1(b)| <= 2^omega(b) b (log b + 2), where ' +
    'omega(b) counts the distinct primes dividing b. Combined with the exact elementary parts of ' +
    'imp-97096, this yields F_arith(b) = kappa_arith phi(b) b + (1/2)(b E0(b) - E1(b)) with ' +
    '|remainder| <= (1/2) 2^omega(b) b (log b + 3), i.e. F_arith(b) >= (kappa_arith - eps(b)) phi(b) b, ' +
    'eps(b) = (1/2) 2^omega(b)(log b + 3)/phi(b).',
  mechanism:
    'The proof exploits an exact identity special to divisors of b: for every d|b, ' +
    'floor((b-1)/d) = b/d - 1 exactly (no fractional remainder), so Robbins Stirling bounds applied ' +
    'to log((b/d - 1)!) combine with the exact Euler phi-telescope Sum_{d|b} mu(d)(b/d) = phi(b) to ' +
    'produce a clean main term plus a triangle-bounded divisor-sum remainder. The remainder is ' +
    'INHERENTLY 2^omega(b)-dependent (no mu-sign cancellation exploited), so eps(b) -> 0 as ' +
    'O(b^{-1+o(1)}) but is vacuous (kappa_arith - eps(b) <= 0) on a finite set of small ' +
    'highly-composite moduli such as b=210, where a direct per-value check still confirms F_arith > 0.',
  verificationStatus:
    'Restates the already-committed imp-97133 theorems (numerically verified worst-case ratios ' +
    '|E0|/bound ~ 0.20 on the tightest prime case, |E1|/bound ~ 0.022) and the imp-97096 sub-gap ' +
    'closure; no new numerical computation. Establishes no uniform (2^omega-free) O(1/b) remainder -- ' +
    'that stays the named residual of imp-97133; moves no bound; T ~ 2.594e7 anchor unchanged; ' +
    'no refereed bound is changed; RH open; NO QED.',
});

export const IMP97179_MOEBIUS_STIRLING_REMAINDER_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97179',
  proofSection: 'Route-M',
  glosses: 'imp-97133',
  question:
    'imp-97096 left the Moebius/Stirling remainder for the Route M arithmetic first moment ' +
    'unquantified (explicitRemainderBoundProved:false). What is the explicit rigorous remainder ' +
    'bound imp-97133 proved, and what named absolute constant does it carry?',
  headword: MOEBIUS_STIRLING_REMAINDER_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-97133 explicit remainder ' +
    'theorems: |E0(b)| <= 2^omega(b)(log b + 2) and |E1(b)| <= 2^omega(b) b (log b + 2), yielding ' +
    'F_arith(b) >= (kappa_arith - eps(b)) phi(b) b with eps(b) = (1/2) 2^omega(b)(log b + 3)/phi(b) -> 0. ' +
    'Establishes nothing new; moves no bound; interval-rigorous reach unchanged; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-97133 (the explicit remainder theorems, corollary, and honest uniform-vs-modulus-dependent ' +
    'assessment); imp-97096 (the sub-gap this closes and the exact kappa_arith leading coefficient).',
});

export default IMP97179_MOEBIUS_STIRLING_REMAINDER_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97179_MOEBIUS_STIRLING_REMAINDER_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97179-headword-carries-named-constant',
    why: 'The headword must state the named absolute constant 2^omega(b)(log b + 2) and the ' +
      'resulting eps(b) formula -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP97179_MOEBIUS_STIRLING_REMAINDER_GLOSSARY_HEADWORD.headword;
      return (
        /2\^omega\(b\)\(log b \+ 2\)/.test(h.term) &&
        /2\^omega\(b\) b \(log b \+ 2\)/.test(h.definition) &&
        /eps\(b\) = \(1\/2\) 2\^omega\(b\)\(log b \+ 3\)\/phi\(b\)/.test(h.definition)
      );
    },
  },
  {
    id: 'imp97179-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97179_MOEBIUS_STIRLING_REMAINDER_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97179_MOEBIUS_STIRLING_REMAINDER_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97179_MOEBIUS_STIRLING_REMAINDER_GLOSSARY_HEADWORD.verdict) &&
      IMP97179_MOEBIUS_STIRLING_REMAINDER_GLOSSARY_HEADWORD.glosses === 'imp-97133',
  },
];

for (const assertion of IMP97179_MOEBIUS_STIRLING_REMAINDER_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97179-moebius-stirling-remainder-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
