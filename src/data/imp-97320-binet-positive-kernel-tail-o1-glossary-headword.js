/**
 * @module imp-97320-binet-positive-kernel-tail-o1-glossary-headword
 * @fileoverview imp-97320 -- import-light glossary/Concepts headword for the imp-97289 Binet
 *   positive-kernel representation of the Stirling tail R(b) = Integral_0^inf g(t) S_b(t) dt
 *   (g(t) = 2 Sum_{k>=1} 1/(t^2 + 4 pi^2 k^2) > 0) and the two proved uniform o(1) tail bounds
 *   |R(b)| < 1/12 on the prime and prime-power families.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-97266 MEASURED that the Route M Stirling tail R(b) = Sum_{d|b,d<b} mu(d) rho_{b/d-1} stays
 *   O(1) (~0.127) even on the binding maximal-omega primorial class, but did not certify a
 *   mechanism. imp-97289 supplied the exact Binet-kernel representation underlying that
 *   measurement and proved a genuine uniform bound on two of the three omega-class families. This
 *   headword bakes that representation and the two proved bounds verbatim (no re-import of
 *   imp-97289) so a reader does not conflate "the tail is proved O(1) everywhere" with what is
 *   actually established: a rigorous mechanism plus two proved families, and one open uniform-in-
 *   omega sub-gap on the primorial class.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   THE EXACT REPRESENTATION. Robbins' Stirling remainder rho_n is exactly the Binet function
 *   J(n), and Binet's first formula gives rho_n = Integral_0^inf g(t) e^{-nt} dt with kernel
 *   g(t) = (1/2 - 1/t + 1/(e^t-1))/t = 2 Sum_{k>=1} 1/(t^2 + 4 pi^2 k^2) > 0 for all t > 0
 *   (g(0+) = 1/12, g(t) ~ 1/(2t)). Swapping the finite divisor sum with the integral turns the
 *   Route M tail into R(b) = Integral_0^inf g(t) S_b(t) dt, where S_b(t) = Sum_{d|b,d<b,sqfree}
 *   mu(d) e^{-(b/d-1)t} is a bounded alternating sum whose endpoints are O(1) independent of b:
 *   S_b(0+) in {-1,0,+1} and S_b(t) -> 0 as t -> infinity. EVERY bit of cancellation the Route M
 *   tail relies on lives inside this alternating sum, not in the kernel.
 *   WHAT IS PROVED. Using only 0 < rho_n = J(n) < 1/(12n) and J strictly decreasing (g > 0):
 *   on primes b = p only d = 1 survives, giving 0 < R(p) = J(p-1) < 1/(12(p-1)) <= 1/12; on prime
 *   powers b = p^a (a >= 2) only d in {1,p} survive, giving |R(p^a)| = J(p^{a-1}-1) - J(p^a-1) <
 *   1/(12(p^{a-1}-1)) <= 1/12. So |R(b)| < 1/12 uniformly -- in fact R(b) -> 0 -- on every prime
 *   and prime power, matching the imp-97266 measurement exactly on those two families.
 *   WHAT REMAINS OPEN. The naive triangle bound (discarding the Moebius signs) reproduces exactly
 *   the imp-97202 proved O(log log b) envelope |R(b)| < sigma(b)/(6b); so the ENTIRE gap between
 *   the proved O(log log b) and the measured O(1) is the alternating-sign cancellation in S_b(t)
 *   on the binding maximal-omega primorial class, where sigma(b)/b diverges but |R(b)| stays
 *   ~0.127. A uniform-in-omega bound on that interior cancellation is IMP97289_TAIL_O1_SUBGAP,
 *   left open.
 *
 *   STATUS: a mechanism-level glossary headword over an already-committed honest-partial finding,
 *   not a new computation or a positivity theorem. No bound moved; no refereed bound is changed;
 *   RH open; NO QED.
 *
 * @see imp-97289-route-m-arith-tail-o1-proof.js (source: the Binet positive-kernel mechanism and
 *   the two proved prime/prime-power tail bounds this headword glosses)
 * @see imp-97266-route-m-arith-tail-o1-measurement.js (the O(1) measurement the mechanism explains)
 * @see imp-97202-route-m-arith-first-moment-uniform-remainder.js (the proved O(log log b) envelope
 *   the naive triangle bound reproduces exactly)
 *
 * Ticket: imp-97320 (content, medium, sonnet-4-6). Documentation only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

// The Binet positive-kernel tail-representation headword, baked verbatim (no re-import).
const BINET_POSITIVE_KERNEL_TAIL_O1_HEADWORD = Object.freeze({
  key: 'route-m-stirling-tail-binet-positive-kernel-representation',
  term:
    'imp-97289 finding: the Route M Stirling tail R(b) = Sum_{d|b,d<b} mu(d) rho_{b/d-1} equals ' +
    'Integral_0^inf g(t) S_b(t) dt with a POSITIVE Binet kernel g(t) = 2 Sum_{k>=1} ' +
    '1/(t^2+4 pi^2 k^2) > 0, and this proves the uniform o(1) bound |R(b)| < 1/12 on every prime ' +
    'and prime power (the binding primorial class stays open)',
  definition:
    'Robbins rho_n is exactly the Binet function J(n), so Binet first formula gives rho_n = ' +
    'Integral_0^inf g(t) e^{-nt} dt with g(t) = (1/2 - 1/t + 1/(e^t-1))/t = ' +
    '2 Sum_{k>=1} 1/(t^2 + 4 pi^2 k^2) > 0 for all t > 0 (g(0+) = 1/12, g(t) ~ 1/(2t)). Swapping ' +
    'the finite divisor sum with the integral gives R(b) = Integral_0^inf g(t) S_b(t) dt with ' +
    'S_b(t) = Sum_{d|b,d<b,sqfree} mu(d) e^{-(b/d-1)t}, a bounded alternating sum with O(1) ' +
    'endpoints: S_b(0+) in {-1,0,+1} and S_b(t) -> 0 as t -> infinity.',
  mechanism:
    'Because g > 0, ALL of the cancellation the Route M tail relies on lives in the alternating ' +
    'Moebius sum S_b(t), not in the kernel. On primes only d=1 survives, giving 0 < R(p) = ' +
    'J(p-1) < 1/(12(p-1)) <= 1/12; on prime powers p^a only d in {1,p} survive, giving ' +
    '|R(p^a)| = J(p^{a-1}-1) - J(p^a-1) < 1/(12(p^{a-1}-1)) <= 1/12 (J strictly decreasing). ' +
    'The naive triangle bound (dropping the Moebius signs) reproduces exactly the imp-97202 ' +
    'proved |R(b)| < sigma(b)/(6b) = O(log log b) envelope, so the entire O(log log b) -> O(1) ' +
    'gap is the discarded alternating-sign cancellation, binding on the maximal-omega primorials.',
  verificationStatus:
    'The Binet representation and kernel positivity are rigorous and exact (verified in JS: the ' +
    'kernel integral reproduces rho_n to < 1e-4 for n = 1..20, g > 0 on a wide t-grid, g(0+) = ' +
    '1/12); the uniform bounds |R(p)| < 1/12 and |R(p^a)| < 1/12 are proved on the prime and ' +
    'prime-power ladders. The uniform-in-omega bound on the primorial class (IMP97289_TAIL_O1_' +
    'SUBGAP, measured L ~ 0.127) remains OPEN. No bound moved; no refereed bound is changed; ' +
    'RH open; NO QED.',
});

export const IMP97320_BINET_POSITIVE_KERNEL_TAIL_O1_HEADWORD = Object.freeze({
  id: 'imp-97320',
  proofSection: 'S-frontier',
  glosses: 'imp-97289',
  question:
    'imp-97266 measured that the Route M Stirling tail R(b) stays O(1) (~0.127) on the binding ' +
    'primorial class but did not certify a mechanism. Is there an exact, positive-kernel reason ' +
    'the tail should be bounded at all, and can a genuine uniform bound be proved on any ' +
    'sub-family?',
  headword: BINET_POSITIVE_KERNEL_TAIL_O1_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-97289 finding: the ' +
    'Route M Stirling tail admits the exact Binet positive-kernel representation R(b) = ' +
    'Integral g(t) S_b(t) dt (g > 0), and this mechanism PROVES the uniform o(1) bound ' +
    '|R(b)| < 1/12 on every prime and prime power. The naive triangle bound reproduces exactly ' +
    'the imp-97202 O(log log b) envelope, isolating the whole gap to the measured O(1) as the ' +
    'alternating Moebius cancellation on the binding primorial class, which remains OPEN as ' +
    'IMP97289_TAIL_O1_SUBGAP. No bound is claimed moved; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97289 (the Binet positive-kernel mechanism and the two proved prime/prime-power tail ' +
    'bounds this headword glosses); imp-97266 (the O(1) measurement the mechanism explains); ' +
    'imp-97202 (the proved O(log log b) envelope the naive triangle bound reproduces exactly).',
});

export default IMP97320_BINET_POSITIVE_KERNEL_TAIL_O1_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97320_BINET_POSITIVE_KERNEL_TAIL_O1_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97320-headword-names-binet-kernel-and-bound',
    why: 'The headword must name the exact Binet positive-kernel representation, the ' +
      'proved 1/12 tail bound, and the two families it covers -- the entire point of the entry.',
    holds: () => {
      const h = IMP97320_BINET_POSITIVE_KERNEL_TAIL_O1_HEADWORD.headword;
      return (
        /Binet/.test(h.term) &&
        /g\(t\) = 2 Sum/.test(h.term) &&
        /1\/12/.test(h.term) &&
        /prime and prime power/.test(h.term)
      );
    },
  },
  {
    id: 'imp97320-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97320_BINET_POSITIVE_KERNEL_TAIL_O1_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97320_BINET_POSITIVE_KERNEL_TAIL_O1_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97320_BINET_POSITIVE_KERNEL_TAIL_O1_HEADWORD.verdict) &&
      IMP97320_BINET_POSITIVE_KERNEL_TAIL_O1_HEADWORD.glosses === 'imp-97289',
  },
];

for (const assertion of IMP97320_BINET_POSITIVE_KERNEL_TAIL_O1_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97320-binet-positive-kernel-tail-o1-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
