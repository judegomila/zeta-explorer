/**
 * @module imp-97107-cauchy-schwarz-mean-square-to-first-moment-glossary-headword
 * @fileoverview imp-97107 -- import-light glossary/Concepts headword for the imp-97071 Route M
 *   reduction: the EXACT Cauchy-Schwarz inequality Q(b) >= F(b)^2/S(b) reduces the (unestablished)
 *   mean-SQUARE lower companion Q(b) >= s0_lo b - O(1) to a STRICTLY WEAKER first-MOMENT bound
 *   F(b) >= kappa phi(b) b, and that reduction is itself rigorous even though kappa > 0 remains
 *   measured, not proved.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-97054 posed the Route M lower companion as a mean-SQUARE statement (matching the imp-96750
 *   upper companion's shape) and named three candidate routes to it. imp-97071 found that the
 *   mean-square target is not the right one to chase: pairing the weight a against I(a,b)/a and
 *   applying Cauchy-Schwarz converts the SQUARE requirement into a strictly weaker MEAN-VALUE
 *   (first-moment) requirement, for which the sign-cancellation risk that sinks the imp-96750
 *   upper-companion term-split (an O(b log b) squaring artifact) does not recur. This headword
 *   bakes that reduction verbatim (no re-import of imp-97071) so a reader does not conflate "the
 *   mean-square lower companion is still open" with "no rigorous progress was made on it."
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   THE EXACT STEP. Write Q(b) = Sum_{a} (I(a,b)/a)^2 over interior coprime residues 2<=a<=b-1.
 *   Cauchy-Schwarz on the pairing a * (I(a,b)/a) gives F(b)^2 = (Sum_a I(a,b))^2 <= (Sum_a a^2)
 *   (Sum_a I(a,b)^2/a^2) = S(b) Q(b), i.e. Q(b) >= F(b)^2/S(b) >= 3F(b)^2/b^3 (S(b) <= b^3/3
 *   dropping coprimality upward). This holds for EVERY b, unconditionally -- no hypothesis is
 *   introduced.
 *   WHY IT HELPS. IF the first moment F(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b) satisfies F(b) >=
 *   kappa phi(b) b for an absolute kappa > 0, the exact inequality above transfers -- through the
 *   same regrouping T(M) = 2 Sum_{b<=M} Q(b)/b^2 and the already two-sided imp-96708 sandwich
 *   Int(N) >= T(N) -- to Int(N) >= (36 kappa^2/pi^2) log N, a POSITIVE log-slope that forbids the
 *   Route M concave-quad ||G||_F turnover (only the SIGN of the slope matters). MEASURED kappa ~
 *   0.696 (stable 0.699 at b=211 to 0.696 at b=1201, 0.697 at the primorial b=2310), with BOTH the
 *   arithmetic part (~+0.575 phi(b) b) and the cotangent part (~+0.121 phi(b) b) separately
 *   positive -- unlike the imp-96750 SQUARED case, where the single a=2 arithmetic term alone
 *   overshoots to M log^2 M, term-splitting the FIRST moment does not overshoot.
 *   WHAT REMAINS OPEN. The reduction itself (Q(b) >= F(b)^2/S(b)) is rigorous and unconditional.
 *   What is NOT proved is the first-moment floor F(b) >= kappa phi(b) b with an absolute kappa > 0:
 *   it is measured, not established, so no bound is claimed moved. The arithmetic part is
 *   elementary (a Moebius-weighted coprime sum); the sole genuinely open piece is a Bettin-Conrey
 *   cotangent MEAN VALUE lower bound (strictly weaker than the mean-square lower bound it replaces).
 *
 *   STATUS: a reduction-level glossary headword over an already-committed finding, not a new
 *   computation or a positivity theorem. No bound moved; T ~ 2.594e7 stays the rigorous anchor;
 *   compute (N~9916) binds first regardless. NO QED. No refereed bound is changed; RH open.
 *
 * @see imp-97071-route-m-lower-companion-first-moment-reduction.js (source: the Cauchy-Schwarz
 *   reduction and the measured kappa this headword glosses)
 * @see imp-97054-route-m-two-sided-norm-rejection-assessment.js (the parent posing the mean-square
 *   lower companion this headword shows is not the tight target)
 *
 * Ticket: imp-97107 (content, medium, sonnet-4-6). Documentation only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

// The Cauchy-Schwarz mean-square-to-first-moment reduction headword, baked verbatim (no re-import).
const CAUCHY_SCHWARZ_MEAN_SQUARE_TO_FIRST_MOMENT_HEADWORD = Object.freeze({
  key: 'route-m-lower-companion-cauchy-schwarz-reduces-mean-square-to-first-moment',
  term:
    'imp-97071 finding: the EXACT Cauchy-Schwarz inequality Q(b) >= F(b)^2/S(b) reduces the ' +
    'unestablished mean-SQUARE Route M lower companion to a STRICTLY WEAKER first-MOMENT bound ' +
    'F(b) >= kappa phi(b) b, with kappa ~ 0.696 measured (not proved) stable across primes and ' +
    'primorials',
  definition:
    'For Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2/a^2, pairing weight a against I(a,b)/a and ' +
    'applying Cauchy-Schwarz gives F(b)^2 = (Sum_a I(a,b))^2 <= (Sum_a a^2)(Sum_a I(a,b)^2/a^2) = ' +
    'S(b) Q(b), i.e. Q(b) >= F(b)^2/S(b) >= 3F(b)^2/b^3 for EVERY b -- an exact, unconditional ' +
    'inequality. If the first moment F(b) satisfies F(b) >= kappa phi(b) b for an absolute ' +
    'kappa > 0, this transfers through the exact regrouping T(M) = 2 Sum_{b<=M} Q(b)/b^2 and the ' +
    'two-sided imp-96708 sandwich Int(N) >= T(N) to Int(N) >= (36 kappa^2/pi^2) log N ~ 1.767 ' +
    'log N (kappa=0.696) -- a positive log-slope rejecting the concave ||G||_F turnover, and ' +
    'comfortably below the true interior slope 3.495.',
  mechanism:
    'The imp-96750 upper companion showed that splitting I(a,b) into its arithmetic and cotangent ' +
    'parts and SQUARING overshoots (the a=2 arithmetic term alone forces M log^2 M). That ' +
    'obstruction is specific to squaring: in the unsquared FIRST moment, both parts are measured ' +
    'separately positive and of the same clean order phi(b) b (arithmetic ~+0.575, cotangent ' +
    '~+0.121, summing to kappa~0.696), so term-splitting does not overshoot there. This is why the ' +
    'first moment is the right target: the O(b log b) cancellation that makes the SQUARE delicate ' +
    'is a linear feature the first moment averages away, not a sign war it must referee.',
  verificationStatus:
    'The Cauchy-Schwarz step is rigorous and exact (verified in JS from the Vasyunin kernel at ' +
    'small b in the source module); the first-moment floor kappa > 0 is MEASURED (window-mean ' +
    'reproduction to 1.75127, CS finite-difference slope 1.76 against a true 3.495) but not ' +
    'proved. No new numerical computation here. No bound moved; no refereed bound is changed; ' +
    'RH open; NO QED.',
});

export const IMP97107_CAUCHY_SCHWARZ_MEAN_SQUARE_TO_FIRST_MOMENT_HEADWORD = Object.freeze({
  id: 'imp-97107',
  proofSection: 'S-frontier',
  glosses: 'imp-97071',
  question:
    'imp-97054 posed the Route M lower companion Q(b) >= s0_lo b - O(1) as a mean-SQUARE ' +
    'statement, matching the imp-96750 upper companion. Is the mean-square shape the right target ' +
    'to chase, or does it hide an easier, strictly weaker sufficient condition?',
  headword: CAUCHY_SCHWARZ_MEAN_SQUARE_TO_FIRST_MOMENT_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-97071 finding: the ' +
    'EXACT Cauchy-Schwarz inequality Q(b) >= F(b)^2/S(b) reduces the mean-SQUARE lower companion ' +
    'to a strictly weaker first-MOMENT bound F(b) >= kappa phi(b) b, and that reduction is ' +
    'rigorous regardless of whether kappa > 0 is ever proved. Readers should not treat the ' +
    'mean-square shape from imp-97054 as the tight requirement; the first moment suffices and is ' +
    'free of the imp-96750 squaring overshoot. kappa ~ 0.696 remains MEASURED, not proved; no ' +
    'bound is claimed moved; NO QED. No refereed bound is changed.',
  citation:
    'imp-97071 (the Cauchy-Schwarz reduction and measured kappa this headword glosses); imp-97054 ' +
    '(the parent posing the mean-square lower companion this headword shows is not the tight ' +
    'target); imp-96750 (the upper companion whose term-split squaring overshoot the first moment ' +
    'avoids); imp-96708 (the two-sided sandwich the reduction transfers through).',
});

export default IMP97107_CAUCHY_SCHWARZ_MEAN_SQUARE_TO_FIRST_MOMENT_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97107_CAUCHY_SCHWARZ_MEAN_SQUARE_TO_FIRST_MOMENT_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97107-headword-names-cs-reduction-and-kappa',
    why: 'The headword must name the exact Cauchy-Schwarz inequality, the first-moment target, ' +
      'and the measured kappa -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP97107_CAUCHY_SCHWARZ_MEAN_SQUARE_TO_FIRST_MOMENT_HEADWORD.headword;
      return (
        /Cauchy-Schwarz/.test(h.term) &&
        /F\(b\)\^2\/S\(b\)/.test(h.definition) &&
        /kappa/.test(h.definition) &&
        /0\.696/.test(h.term) &&
        /first-MOMENT/i.test(h.term)
      );
    },
  },
  {
    id: 'imp97107-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97107_CAUCHY_SCHWARZ_MEAN_SQUARE_TO_FIRST_MOMENT_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97107_CAUCHY_SCHWARZ_MEAN_SQUARE_TO_FIRST_MOMENT_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97107_CAUCHY_SCHWARZ_MEAN_SQUARE_TO_FIRST_MOMENT_HEADWORD.verdict) &&
      IMP97107_CAUCHY_SCHWARZ_MEAN_SQUARE_TO_FIRST_MOMENT_HEADWORD.glosses === 'imp-97071',
  },
];

for (const assertion of IMP97107_CAUCHY_SCHWARZ_MEAN_SQUARE_TO_FIRST_MOMENT_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97107-cauchy-schwarz-mean-square-to-first-moment-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
