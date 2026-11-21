/**
 * @module imp-97232-e0-decomposition-glossary-headword
 * @fileoverview imp-97232 -- import-light glossary/Concepts headword for the imp-97202 exact E0
 *   decomposition E0(b) = (1/2) Lambda(b) - (1/2) mu(b) log 2pi + kernel + Stirling-tail, and the
 *   kernel-moment bound |S_k(b)| <= 3 * 2^{-k} that removes the imp-97133 2^omega(b) prefactor.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-97202 regrouped the imp-97133 divisor sum for E0(b) = L0(b) - phi(b)(log b - 1) into three
 *   cancellation-clean pieces via two exact Moebius identities (Sum mu(d) = 0 and Sum mu(d) log d =
 *   -Lambda(b)), then showed the kernel piece is uniformly bounded by a MOMENT sum whose geometric
 *   decay defeats the up-to-2^omega(b) term count. This headword bakes that exact decomposition and
 *   moment bound verbatim (no re-import of the imp-97202 module, to stay import-light) as a
 *   standalone quick-lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   E0(b) = E0_clean(b) + E0_kernel(b) + R(b), where E0_clean(b) = (1/2) Lambda(b) -
 *   (1/2) mu(b) log 2pi carries the entire (1/2) log b leading order with NO divisor-count
 *   dependence, E0_kernel(b) = Sum_{d|b,d<b} mu(d) h(d/b) with h(t) = (1/t - 1/2) log(1 - t)
 *   collapses via its Taylor moments S_k(b) = Sum_{e|b,e>=2} mu(b/e) e^{-k}, and R(b) is the
 *   Stirling-tail remainder. The moment bound |S_k(b)| <= zeta(k) - 1 <= 3 * 2^{-k} (k >= 2) is
 *   exactly what removes the imp-97133 2^omega(b) prefactor: a divisor sum with up to 2^omega(b)
 *   terms is dominated by a geometrically decaying series instead, giving a uniform kernel constant
 *   11/8 independent of omega(b).
 *
 *   STATUS: a documentation-only lookup restating an existing derivation (imp-97202). Establishes
 *   nothing new, instantiates no interval, closes no sub-gap beyond what imp-97202 already closed.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-97202-route-m-arith-first-moment-uniform-remainder.js (source: the derivation this glosses)
 * @see imp-97133-route-m-arith-first-moment-explicit-remainder.js (the 2^omega-dependent bound made uniform)
 * @see imp-97158-route-m-theorem1-remainder-sharpness.js (primes-only saturation measurement)
 *
 * Ticket: imp-97232 (content, low, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The E0 decomposition + moment-bound headword, baked verbatim (no re-import).
const E0_DECOMPOSITION_HEADWORD = Object.freeze({
  key: 'route-m-e0-exact-decomposition-moment-bound-removes-2omega',
  term:
    'imp-97202 exact decomposition E0(b) = (1/2) Lambda(b) - (1/2) mu(b) log 2pi + E0_kernel(b) + ' +
    'R(b), with the kernel-moment bound |S_k(b)| <= zeta(k) - 1 <= 3 * 2^{-k} (k >= 2) that removes ' +
    'the imp-97133 2^omega(b) prefactor from the uniform remainder bound on E0',
  definition:
    'E0(b) = L0(b) - phi(b)(log b - 1) is the imp-97133 Theorem-1 remainder for the coprime-residue ' +
    'log-sum L0(b) = Sum_{a in R_b} log a. Regrouping its proper-divisor expansion with the two exact ' +
    'Moebius identities Sum_{d|b} mu(d) = 0 and Sum_{d|b} mu(d) log d = -Lambda(b) splits E0 into a ' +
    'divisor-count-free clean term, a kernel sum, and a Stirling-tail remainder: ' +
    'E0(b) = E0_clean(b) + E0_kernel(b) + R(b), where E0_clean(b) = (1/2) Lambda(b) - ' +
    '(1/2) mu(b) log 2pi, E0_kernel(b) = Sum_{d|b, d<b} mu(d) h(d/b) with h(t) = (1/t - 1/2) log(1 - t), ' +
    'and R(b) = Sum_{d|b, d<b} mu(d) rho_{b/d-1} collects the Stirling tails 0 < rho_n < 1/(12n).',
  mechanism:
    'Expanding h in its Taylor series (a_0 = -1, a_1 = 0, a_k = (1-k)/(2k(k+1)) for k >= 1, so ' +
    '|a_k| <= 1/(2k)) turns the kernel sum into a sum over MOMENTS S_k(b) = Sum_{d|b,d<b} mu(d) ' +
    '(d/b)^k = Sum_{e|b,e>=2} mu(b/e) e^{-k}. Each moment is uniformly small: |S_k(b)| <= ' +
    'Sum_{e>=2} e^{-k} = zeta(k) - 1 <= 3 * 2^{-k} for k >= 2, regardless of how many divisors b has ' +
    '(i.e. regardless of 2^omega(b)) -- the geometric decay e^{-k} beats the up-to-2^omega(b) term ' +
    'count. This bounds |E0_kernel(b)| < 11/8, a constant independent of omega(b), which is exactly ' +
    'the step that removes the imp-97133 2^omega(b) prefactor from the final uniform bound ' +
    '|E0(b)| <= (1/2) log b + (1/2) log 2pi + 11/8 + (1/6) sigma(b)/b.',
  verificationStatus:
    'Restates an existing exact derivation and a machine-precision-verified decomposition (imp-97202: ' +
    'zero violations over b in [2, 20000], decomposition matches direct E0 to 1e-6 relative on a mixed ' +
    'ladder up to b=2310). Documentation only: establishes nothing new, moves no bound, no rigorous ' +
    'ceiling posted here; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97232_E0_DECOMPOSITION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97232',
  proofSection: 'S-frontier',
  glosses: 'imp-97202',
  question:
    'What is the exact three-piece decomposition of the imp-97133 remainder E0(b), and what specific ' +
    'moment bound on the Moebius kernel sums is responsible for removing the 2^omega(b) prefactor?',
  headword: E0_DECOMPOSITION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-97202 exact decomposition ' +
    'E0(b) = (1/2) Lambda(b) - (1/2) mu(b) log 2pi + E0_kernel(b) + R(b) and the kernel-moment bound ' +
    '|S_k(b)| <= zeta(k) - 1 <= 3 * 2^{-k} (k >= 2), whose geometric decay defeats the up-to-2^omega(b) ' +
    'term count and yields the uniform kernel constant 11/8. Establishes nothing; instantiates no ' +
    'interval; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-97202 (the exact decomposition and moment bound this glosses); imp-97133 (the 2^omega-dependent ' +
    'bound made uniform); imp-97158 (measured primes-only saturation, ratio -> 1/4).',
});

export default IMP97232_E0_DECOMPOSITION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97232_E0_DECOMPOSITION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97232-headword-has-required-fields',
    why: 'The headword must name the three-piece decomposition, the kernel function h, the moment ' +
      'bound constant 3*2^{-k}, and the resulting uniform kernel constant 11/8 -- the entire point of ' +
      'the glossary entry.',
    holds: () => {
      const h = IMP97232_E0_DECOMPOSITION_GLOSSARY_HEADWORD.headword;
      return (
        /E0_clean/.test(h.definition) &&
        /E0_kernel/.test(h.definition) &&
        /R\(b\)/.test(h.definition) &&
        /3 \* 2\^\{-k\}/.test(h.mechanism) &&
        /11\/8/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97232-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97232_E0_DECOMPOSITION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97232_E0_DECOMPOSITION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97232_E0_DECOMPOSITION_GLOSSARY_HEADWORD.verdict) &&
      IMP97232_E0_DECOMPOSITION_GLOSSARY_HEADWORD.glosses === 'imp-97202',
  },
];

for (const assertion of IMP97232_E0_DECOMPOSITION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97232-e0-decomposition-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
