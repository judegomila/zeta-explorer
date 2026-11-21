/**
 * @module imp-97278-e1-remainder-quarter-b-scale-glossary-headword
 * @fileoverview imp-97278 -- import-light glossary/Concepts headword for the imp-97208 finding:
 *   the true b-dependence of the Route M Theorem-2 remainder E1(b) is b/4 (an EXACT prime asymptotic
 *   E1(prime b) = -b/4 + (1/12) log b + ln A + O(1/b)), not the b(log b + 2) the imp-97133 Theorem-2
 *   constant assumed. The old constant over-counts by exactly 4(log b + 2) ~ 4 log b, matching the
 *   imp-97158 measured ~40x looseness.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-97158 measured that the imp-97133 Theorem-2 constant 2^omega(b) b(log b + 2) is uniformly
 *   ~40x loose (saturation ratio -> 0 on every class). imp-97208 traced the looseness to a single
 *   root cause -- the constant multiplies the Theorem-1 (E0-sized) constant by a whole extra factor
 *   of b, but E1 does not grow like b log b, only like b/4 -- and replaced it with the tighter
 *   C2star(b) = b/4 + 2^omega(b)(log b + 2). This headword bakes that b/4 scale and the exact
 *   over-count factor verbatim (no re-import of imp-97208) so a reader does not conflate "the
 *   universal bound is still only measured" with "the b-scale itself is unknown."
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   THE SCALE. |E1(b)| <= b/4 holds for EVERY tested b (0 violations, b in [2,20000]); the old
 *   Theorem-2 constant 2^omega(b) b(log b + 2) over-counts this by exactly
 *       [b(log b + 2)] / [b/4] = 4(log b + 2) ~ 4 log b,
 *   which evaluates to ~46 at b ~ 10^5 -- precisely the ~40x looseness imp-97158 measured.
 *   WHERE b/4 COMES FROM. On a PRIME b only the divisor d=1 survives the Moebius sum, and the
 *   Glaisher-Kinkelin asymptotic for G(n) = Sum_{k=1}^n k log k collapses the n^2 log terms to the
 *   EXACT prime asymptotic E1(prime b) = -b/4 + (1/12) log b + ln A + O(1/b) (ln A = Glaisher-Kinkelin
 *   constant), proved via Glaisher-Kinkelin + the exact d=1 Moebius reduction, no measurement
 *   involved. Since (1/12) log b + ln A > 0, |E1(prime b)| = b/4 - (1/12) log b - ln A < b/4 strictly,
 *   approaching b/4 from BELOW as b grows.
 *   THE TIGHTER CONSTANT. C2star(b) = b/4 + 2^omega(b)(log b + 2) (the b/4 leader plus the same
 *   Theorem-1-style triangle remainder for the sub-leading divisor sums) upper-bounds |E1(b)| with
 *   0 violations over the dense sweep b in [2,20000], is ~4 log b tighter than the old constant
 *   (5.7x at b=7 rising to 108x at b=99991), and SATURATES on primes: r*(b) = |E1(b)|/C2star(b) -> 1
 *   from below (0.640 at 101, 0.931 at 1009, 0.991 at 9973, 0.9989 at 99991).
 *   WHAT REMAINS OPEN. The exact prime asymptotic (hence |E1(prime b)| < b/4) is PROVED. The
 *   universal bounds |E1(b)| <= C2star(b) and |E1(b)| <= b/4 are MEASURED, not proved, for all b; a
 *   full proof needs the mu-cancelling Euler-Maclaurin analysis of Sum_{d|b} mu(d) d G(b/d - 1) that
 *   imp-97202 already exploits on the smooth-b side. Prime powers and primorials undershoot C2star(b)
 *   (mu-sign cancellation of the b/4 leader), so the constant is sharp on the binding prime class and
 *   honestly loose on the smooth classes -- the same primes-tight/smooth-loose profile as before, now
 *   with the correct b-scale.
 *
 *   STATUS: a scale-level glossary headword over an already-committed finding, not a new computation
 *   or a rigorous universal bound. No bound moved; the universal ceiling |E1(b)| <= b/4 stays
 *   MEASURED not proved (prime-class proof only); no refereed bound is changed; RH open. NO QED.
 *
 * @see imp-97208-route-m-theorem2-tighter-remainder.js (source: the b/4 scale, the exact prime
 *   asymptotic, and the tighter C2star(b) constant this headword glosses)
 * @see imp-97158-route-m-theorem1-remainder-sharpness.js (measured the ~40x Theorem-2 looseness that
 *   the b/4 scale explains)
 * @see imp-97133-route-m-arith-first-moment-explicit-remainder.js (the original Theorem-2 constant
 *   2^omega(b) b(log b + 2) whose over-count factor this headword names)
 *
 * Ticket: imp-97278 (content, low, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The imp-97208 b/4 remainder-scale headword, baked verbatim (no re-import).
const E1_REMAINDER_QUARTER_B_SCALE_HEADWORD = Object.freeze({
  key: 'route-m-theorem2-e1-remainder-true-scale-is-quarter-b',
  term:
    'imp-97208 finding: the Route M Theorem-2 remainder E1(b) has TRUE b-scale b/4, not the ' +
    'b(log b + 2) the imp-97133 Theorem-2 constant assumed -- the old constant over-counts by ' +
    'exactly 4(log b + 2) ~ 4 log b, matching the imp-97158 measured ~40x looseness',
  definition:
    'For a PRIME b, only the divisor d=1 survives the Moebius sum defining E1, and the ' +
    'Glaisher-Kinkelin asymptotic for G(n) = Sum k log k collapses to the EXACT asymptotic ' +
    'E1(prime b) = -b/4 + (1/12) log b + ln A + O(1/b) (ln A = Glaisher-Kinkelin constant), proved ' +
    '-- not measured. Hence |E1(prime b)| < b/4 strictly, approaching b/4 from below. The tighter ' +
    'constant C2star(b) = b/4 + 2^omega(b)(log b + 2) upper-bounds |E1(b)| with 0 violations over ' +
    'b in [2,20000], is ~4 log b tighter than the old 2^omega(b) b(log b + 2) (5.7x at b=7 to 108x ' +
    'at b=99991), and saturates on primes: r*(b) -> 1 from below (0.640 at 101 to 0.9989 at 99991).',
  mechanism:
    'The imp-97133 Theorem-2 constant was built by multiplying the Theorem-1 (E0-sized, ' +
    '2^omega(b)(log b + 2)) constant by a whole extra factor of b, implicitly assuming |E1(b)| ' +
    'scales like b times an E0-sized quantity, i.e. like b log b. E1 does not grow that way -- its ' +
    'leading term is a plain b/4, coming from the single surviving d=1 divisor on primes. The ratio ' +
    'of the two b-scales, [b(log b+2)]/[b/4] = 4(log b+2), is exactly the over-count factor, and it ' +
    'reproduces the imp-97158 measured ~40x looseness at b ~ 10^5 (4(log(1e5)+2) ~ 46) almost exactly.',
  verificationStatus:
    'The prime asymptotic E1(prime b) = -b/4 + (1/12) log b + ln A + O(1/b) is PROVED (Glaisher-' +
    'Kinkelin + exact d=1 Moebius reduction), verified to O(1/b) in the source module (diff ~3e-9 at ' +
    'b=1009). The universal bounds |E1(b)| <= C2star(b) and |E1(b)| <= b/4 are MEASURED (0 ' +
    'violations, b in [2,20000]), not proved for all b -- a full proof needs the mu-cancelling ' +
    'divisor-sum Euler-Maclaurin analysis imp-97202 already exploits on the smooth-b side. No new ' +
    'numerical computation here. No bound moved; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97278_E1_REMAINDER_QUARTER_B_SCALE_HEADWORD = Object.freeze({
  id: 'imp-97278',
  proofSection: 'S-frontier',
  glosses: 'imp-97208',
  question:
    'imp-97158 measured that the imp-97133 Theorem-2 constant 2^omega(b) b(log b + 2) is ~40x loose ' +
    'on every class. Is that looseness a diffuse effect of many small slacks, or does it trace to a ' +
    'single, nameable over-count in the b-dependence of the constant?',
  headword: E1_REMAINDER_QUARTER_B_SCALE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-97208 finding: the true ' +
    'b-scale of the Theorem-2 remainder E1(b) is b/4 (proved exactly on the prime class via ' +
    'Glaisher-Kinkelin), not the b(log b + 2) the old constant assumed, and the ratio of the two ' +
    'scales is exactly the ~4 log b over-count factor that explains the imp-97158 ~40x looseness. ' +
    'Readers should not treat the scale of the old constant as informative about how E1(b) actually ' +
    'grows; the tighter C2star(b) = b/4 + 2^omega(b)(log b + 2) tracks it and saturates on primes. ' +
    'The universal ceiling |E1(b)| <= b/4 remains MEASURED, not proved, for all b; no bound is ' +
    'claimed moved; NO QED. No refereed bound is changed.',
  citation:
    'imp-97208 (the b/4 scale, the exact prime asymptotic, and the tighter C2star(b) constant this ' +
    'headword glosses); imp-97158 (measured the ~40x Theorem-2 looseness the b/4 scale explains); ' +
    'imp-97133 (the original Theorem-2 constant 2^omega(b) b(log b + 2) whose over-count factor this ' +
    'headword names); imp-97202 (the mu-cancelling smooth-b refinement the full-b proof would need).',
});

export default IMP97278_E1_REMAINDER_QUARTER_B_SCALE_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97278_E1_REMAINDER_QUARTER_B_SCALE_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97278-headword-names-quarter-b-scale-and-overcount-factor',
    why: 'The headword must name the b/4 scale, the exact prime asymptotic, and the 4(log b+2) ' +
      'over-count factor -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP97278_E1_REMAINDER_QUARTER_B_SCALE_HEADWORD.headword;
      return (
        /b\/4/.test(h.term) &&
        /4\(log b \+ 2\)/.test(h.term) &&
        /Glaisher-Kinkelin/.test(h.definition) &&
        /-b\/4/.test(h.definition) &&
        /~40x/.test(h.term)
      );
    },
  },
  {
    id: 'imp97278-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97278_E1_REMAINDER_QUARTER_B_SCALE_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97278_E1_REMAINDER_QUARTER_B_SCALE_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97278_E1_REMAINDER_QUARTER_B_SCALE_HEADWORD.verdict) &&
      IMP97278_E1_REMAINDER_QUARTER_B_SCALE_HEADWORD.glosses === 'imp-97208',
  },
];

for (const assertion of IMP97278_E1_REMAINDER_QUARTER_B_SCALE_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97278-e1-remainder-quarter-b-scale-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
