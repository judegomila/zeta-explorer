/**
 * @module imp-97425-uniform-per-term-bound-glossary-headword
 * @fileoverview imp-97425 -- import-light glossary/Concepts headword for the imp-97392
 *   uniform per-term bound: max_{m>=2} g(m)/m = g(2)/2 = 0.1534264097 (attained at m=2,
 *   since g(m)/m is strictly decreasing), and the derived signed-group-size threshold
 *   1/g(2) = 3.258891 that gates whether the b/4-ceiling MAGNITUDE proof extends by omega.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-97392 assessed whether the imp-97290 sign + magnitude ceiling conditions for
 *   |E1(b)| <= b/4 extend past omega(b)=2. Its whole argument for omega=3 and its
 *   diagnosis of the omega>=4 obstruction both turn on ONE inequality applied
 *   per proper divisor: since g(m)/m is strictly decreasing for m>=2, every proper
 *   divisor term d g(b/d) with b/d >= 2 obeys d g(b/d) = b (g(b/d)/(b/d)) <= b g(2)/2.
 *   This headword names that per-term bound and its two consequences as a standalone
 *   quick-lookup entry, without re-importing the imp-97392 kernel.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE BOUND. g(m) = ln A + (1/12) log m + R(m) is positive, strictly increasing,
 *   and g(m)/m is strictly decreasing on m>=2, so its maximum over m>=2 is attained at
 *   the smallest case m=2: max_{m>=2} g(m)/m = g(2)/2 = 0.1534264097.
 *   (b) WHY IT MATTERS. Every proper divisor d < b of b contributes a term d g(b/d) to
 *   Delta(b) = Sum_{d|b,d<b} mu(d) d g(b/d); since b/d >= 2, each such term is <= b g(2)/2.
 *   Summing a signed group of size k gives a "per-term" (triangle) bound k * b g(2)/2.
 *   (c) THE THRESHOLD. That per-term bound proves MAGNITUDE (|Delta(b)| <= b/2) only
 *   when the largest signed group has size strictly below 1/g(2) = 3.258891. omega=2
 *   (max group 2) and omega=3 (max group 3) pass; omega=4 (max group 8) and beyond fail
 *   -- the precise, numerically pinned point where the per-term charge over-counts and
 *   genuine Moebius cancellation between the positive-mu and negative-mu groups becomes
 *   necessary instead.
 *   (d) STATUS: documentation only. Re-states a constant and threshold already computed
 *   and verified in imp-97392; establishes no new bound.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an
 *   already-established constant and threshold. Not a proof, not a new bound. NO QED.
 *
 * @see imp-97392-route-m-quarter-ceiling-omega3-magnitude-obstruction.js (source: derives
 *   g(2)/2, proves omega=3 MAGNITUDE with it, and pins the omega>=4 over-charge threshold)
 * @see imp-97290-route-m-arith-quarter-ceiling-semiprime-proof.js (the omega<=2 proof and
 *   the SIGN + MAGNITUDE reduction this per-term bound feeds)
 *
 * Ticket: imp-97425 (content, low, sonnet-4-6). Documentation only; establishes nothing
 * new; NO QED; no refereed bound is changed.
 */

// The per-term-bound headword, baked verbatim (no re-import).
const UNIFORM_PER_TERM_BOUND_HEADWORD = Object.freeze({
  key: 'uniform-per-term-bound-g2-half-imp97392',
  term:
    'uniform per-term bound: max_{m>=2} g(m)/m = g(2)/2 = 0.1534264097 (attained at m=2), ' +
    'and the derived signed-group-size threshold 1/g(2) = 3.258891 gating the b/4-ceiling ' +
    'MAGNITUDE proof by omega(b)',
  definition:
    'For g(m) = ln A + (1/12) log m + R(m) (positive, strictly increasing, g(1)=1/4), ' +
    'g(m)/m is strictly decreasing on m>=2, so its maximum there is attained at the ' +
    'smallest case m=2: max_{m>=2} g(m)/m = g(2)/2 = 0.1534264097. Consequently every ' +
    'proper divisor term d g(b/d) in Delta(b) = Sum_{d|b,d<b} mu(d) d g(b/d), which has ' +
    'b/d >= 2, obeys the uniform bound d g(b/d) = b (g(b/d)/(b/d)) <= b g(2)/2.',
  mechanism:
    'Charging every term in a signed group (all proper divisors sharing the same sign of ' +
    'mu(d)) by this uniform per-term bound gives a triangle-inequality total of (group ' +
    'size) * b g(2)/2 for that group. This per-term charge proves MAGNITUDE ' +
    '(|Delta(b)| <= b/2) exactly when the largest signed group size is strictly below ' +
    '1/g(2) = 3.258891: omega=2 (max group 2, const 0.3069) and omega=3 (max group 3, ' +
    'const 0.4603) pass; omega=4 (max group 8, const 1.2274) and beyond over-charge, since ' +
    'the group sizes are binomial coefficients C(omega,.) that cross 1/g(2) at omega=4 -- ' +
    'the precise obstruction imp-97392 pins for a uniform per-term proof past omega=3.',
  verificationStatus:
    'Re-cited from the imp-97392 module ' +
    '(src/data/imp-97392-route-m-quarter-ceiling-omega3-magnitude-obstruction.js), where ' +
    'g(2)/2 and 1/g(2) are computed directly from the exact Glaisher-Kinkelin weight g(m) ' +
    'and verified against the omega=2,3,4,5 group-count table. Naming / glossary headword ' +
    'only; supplies no new bound; RH open; no refereed bound is changed; NO QED.',
});

export const IMP97425_UNIFORM_PER_TERM_BOUND_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97425',
  proofSection: 'S-frontier',
  glosses: 'imp-97392',
  question:
    'imp-97392 proved omega=3 MAGNITUDE and diagnosed the omega>=4 obstruction using one ' +
    'per-term inequality, d g(b/d) <= b g(2)/2, and its threshold 1/g(2) = 3.258891 on the ' +
    'largest signed-group size. What is the headword for that bound and threshold?',
  headword: UNIFORM_PER_TERM_BOUND_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97392 uniform ' +
    'per-term bound max_{m>=2} g(m)/m = g(2)/2 = 0.1534264097 (attained at m=2) and the ' +
    'signed-group-size threshold 1/g(2) = 3.258891 that gates whether the per-term ' +
    'MAGNITUDE proof extends past omega=3. No bound moved; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97392 (derives g(2)/2, proves omega=3 MAGNITUDE with it, pins the omega>=4 ' +
    'over-charge threshold); imp-97290 (the omega<=2 SIGN + MAGNITUDE reduction this feeds).',
});

export default IMP97425_UNIFORM_PER_TERM_BOUND_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97425_UNIFORM_PER_TERM_BOUND_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97425-headword-names-constant-and-threshold',
    why: 'The headword must name both the g(2)/2 constant and the 1/g(2) threshold -- ' +
      'the entire content of the glossary entry.',
    holds: () => {
      const h = IMP97425_UNIFORM_PER_TERM_BOUND_GLOSSARY_HEADWORD.headword;
      return (
        /0\.1534264097/.test(h.term) &&
        /3\.258891/.test(h.term) &&
        /0\.1534264097/.test(h.definition) &&
        /omega=4/.test(h.mechanism) &&
        /1\.2274/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97425-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-97392.',
    holds: () =>
      IMP97425_UNIFORM_PER_TERM_BOUND_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97425_UNIFORM_PER_TERM_BOUND_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97425_UNIFORM_PER_TERM_BOUND_GLOSSARY_HEADWORD.verdict) &&
      IMP97425_UNIFORM_PER_TERM_BOUND_GLOSSARY_HEADWORD.glosses === 'imp-97392',
  },
];

for (const assertion of IMP97425_UNIFORM_PER_TERM_BOUND_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97425-uniform-per-term-bound-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
