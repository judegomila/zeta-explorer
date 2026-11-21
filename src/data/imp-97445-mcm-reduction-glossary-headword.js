/**
 * @module imp-97445-mcm-reduction-glossary-headword
 * @fileoverview imp-97445 -- import-light glossary/Concepts headword recording the imp-97422
 *   multiplicative-complete-monotonicity (MCM) REDUCTION: both b/4-ceiling conditions (SIGN
 *   mu(b)Delta(b)<=0 and MAGNITUDE |Delta(b)|<=b/2) at omega(b)>=4 collapse to a single divisor
 *   sum T(b) = Sum_{d|b} mu(d) h(d) (h = g/m), which is exactly the k-th iterated MULTIPLICATIVE
 *   DIFFERENCE (D_{p1}...D_{pk} h)(1) of h, and MCM (non-negativity of every such iterated
 *   difference) implies 0 <= T(b) < 1/4 for every squarefree b via a peel-the-smallest-prime
 *   induction.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) DEFINITION (T(b), h = g/m). g(m) = ln A + (1/12) log m + R(m) is the Glaisher-Kinkelin
 *   log-remainder weight (g(1) = 1/4, g > 0 strictly increasing); h(m) := g(m)/m is strictly
 *   decreasing with max_{m>=2} h(m) = h(2) = g(2)/2 = 0.1534264097. For squarefree b,
 *   T(b) := Sum_{d|b} mu(d) h(d). The complementary-divisor substitution shows Delta(b) =
 *   mu(b) b S(b) with S(b) = T(b) - 1/4, so BOTH ceiling conditions SIGN and MAGNITUDE collapse
 *   to the single two-sided band -1/4 <= T(b) <= 1/4, i.e. |T(b)| <= 1/4.
 *   (b) MULTIPLICATIVE DIFFERENCE IDENTITY. Writing (D_p f)(x) := f(x) - f(px), for squarefree
 *   b = p1 p2 ... pk, T(b) = (D_{p1} D_{p2} ... D_{pk} h)(1) -- a k-th order iterated
 *   multiplicative finite difference of h, evaluated at x=1. One peel of the smallest prime p
 *   gives T(b) = Sum_{d|m} mu(d) c(d), c(d) := h(d) - h(pd) > 0 (m = b/p), which pairs each
 *   negative-mu prime divisor with its biprime companion inside one small positive difference --
 *   the near-cancellation the cruder per-term bound (imp-97392) discarded. Repeated peeling
 *   collapses the omega=4 max signed-group size 8 -> 4 -> 2 -> 1.
 *   (c) MCM HYPOTHESIS AND CONSEQUENCE. MCM: every iterated multiplicative difference
 *   (D_{p1}...D_{pj} h)(x) >= 0 for every finite prime set and every x >= 1 (the finite-difference
 *   form of complete monotonicity of h(e^t) in t). MCM directly gives SIGN (T(b) >= 0) and, via
 *   the induction T(b) <= T(b/p_min) <= ... <= max_prime T(p) = 0.24350 < 1/4, gives MAGNITUDE
 *   too: MCM => 0 <= T(b) < 1/4 for every squarefree b, at omega=4 and beyond.
 *   (d) STATUS: MCM was VERIFIED numerically (through omega=4 to 2e5), not proved, when imp-97422
 *   posed it as the single residual. imp-97432 later found a counterexample at omega=11
 *   (b = p_11# = 200560490130, T(p_11#) = -9.624e-4 < 0), refuting MCM as a universal hypothesis
 *   -- but the weaker b/4 ceiling |T(b)| <= 1/4 that MCM was meant to imply SURVIVES at that
 *   counterexample (cross-ref imp-97465, which glosses the refutation itself).
 *
 *   STATUS: documentation only. No bound moves; this headword names the imp-97422 reduction
 *   (T(b) as an iterated multiplicative difference, and MCM => 0<=T(b)<1/4). NO QED.
 *
 * @see imp-97422-route-m-quarter-ceiling-omega4-multiplicative-difference-reduction.js (source:
 *   the exact reformulation, the multiplicative-difference pairing, and the conditional
 *   0<=T(b)<1/4 reduction this glosses)
 * @see imp-97392-route-m-quarter-ceiling-omega3-magnitude-obstruction.js (the omega>=4 per-term
 *   over-charge obstruction the multiplicative-difference pairing bypasses)
 * @see imp-97465-mcm-refutation-glossary-headword.js (the later imp-97432 refutation of MCM at
 *   omega=11 and why the b/4 ceiling survives it)
 *
 * Ticket: imp-97445 (content, sonnet-4-6, sonnet). Documentation only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

// The MCM reduction headword, baked verbatim (no re-import).
const MCM_REDUCTION_HEADWORD = Object.freeze({
  key: 'mcm-reduction-omega4-imp97422',
  term:
    'MCM (multiplicative complete monotonicity) reduction: both b/4-ceiling conditions at ' +
    'omega(b) >= 4 collapse to the single divisor sum T(b) = Sum_{d|b} mu(d) h(d) (h = g/m), ' +
    'which is the k-th iterated multiplicative difference (D_{p1}...D_{pk} h)(1), and MCM ' +
    'implies 0 <= T(b) < 1/4 for every squarefree b.',
  definition:
    'For h = g/m (g the Glaisher-Kinkelin log-remainder weight) and squarefree b = p1...pk, ' +
    'T(b) := Sum_{d|b} mu(d) h(d) = (D_{p1} D_{p2} ... D_{pk} h)(1), where (D_p f)(x) := ' +
    'f(x) - f(px). The complementary-divisor substitution gives Delta(b) = mu(b) b (T(b) - 1/4), ' +
    'so SIGN mu(b)Delta(b)<=0 and MAGNITUDE |Delta(b)|<=b/2 collapse to the single band ' +
    '-1/4 <= T(b) <= 1/4.',
  pairing:
    'One peel of the smallest prime p (m = b/p) gives T(b) = Sum_{d|m} mu(d) c(d), ' +
    'c(d) = h(d)-h(pd) > 0, pairing each negative-mu prime divisor with its biprime companion -- ' +
    'the near-cancellation the imp-97392 per-term bound discarded. Repeated peels collapse the ' +
    'omega=4 max signed-group size 8 -> 4 -> 2 -> 1, bypassing the per-term threshold ' +
    '1/g(2) = 3.258891.',
  mcmConsequence:
    'MCM (every iterated multiplicative difference of h is >= 0) gives SIGN T(b) >= 0 directly, ' +
    'and MAGNITUDE via the induction T(b) <= T(b/p_min) <= ... <= max_prime T(p) = 0.24350 < 1/4: ' +
    'MCM => 0 <= T(b) < 1/4 for every squarefree b, re-establishing both ceiling conditions at ' +
    'omega=4 and every larger omega. Verified numerically through omega=4 to 2e5 when posed, not ' +
    'proved -- the single residual left by imp-97422.',
  verificationStatus:
    'Re-cited from the imp-97422 measurement module ' +
    '(src/data/imp-97422-route-m-quarter-ceiling-omega4-multiplicative-difference-reduction.js), ' +
    'where the reformulation Delta(b)=mu(b) b S(b), the multiplicative-difference pairing, and ' +
    'the conditional MCM=>0<=T(b)<1/4 induction are verified directly. MCM was later refuted as a ' +
    'universal hypothesis at omega=11 (imp-97432; see imp-97465), though the weaker b/4 ceiling ' +
    'survives that counterexample. Naming / glossary headword only; supplies no new bound; RH ' +
    'open; no refereed bound is changed; NO QED.',
});

export const IMP97445_MCM_REDUCTION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97445',
  proofSection: 'Route-M',
  glosses: 'imp-97422',
  question:
    'imp-97422 reduced both b/4-ceiling conditions at omega(b)>=4 to a single MCM hypothesis on ' +
    'the iterated multiplicative differences of h=g/m. What is the headword for this reduction, ' +
    'and does it move any bound?',
  headword: MCM_REDUCTION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Records the imp-97422 reformulation ' +
    'T(b) = Sum_{d|b} mu(d) g(d)/d = (D_{p1}...D_{pk} h)(1) collapsing SIGN + MAGNITUDE to ' +
    '|T(b)|<=1/4, the multiplicative-difference pairing (max signed group 8 -> 4 -> 2 -> 1 at ' +
    'omega=4), and the conditional consequence MCM => 0<=T(b)<1/4. No bound moved; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-97422 (the reduction, pairing, and conditional MCM consequence this glosses); ' +
    'imp-97392 (the per-term over-charge obstruction the pairing bypasses); imp-97465 (the later ' +
    'omega=11 refutation of MCM and why the b/4 ceiling survives it).',
});

export default IMP97445_MCM_REDUCTION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97445_MCM_REDUCTION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97445-headword-cites-T-definition-and-mcm-consequence',
    why: 'The headword must name the T(b) divisor sum, the iterated multiplicative-difference ' +
      'identity, the group-collapse 8 -> 4 -> 2 -> 1, and the MCM => 0<=T(b)<1/4 consequence -- ' +
      'the entire content of the glossary entry.',
    holds: () => {
      const h = IMP97445_MCM_REDUCTION_GLOSSARY_HEADWORD.headword;
      return (
        /D_\{p1\} D_\{p2\} \.\.\. D_\{pk\} h/.test(h.definition) &&
        /8 -> 4 -> 2 -> 1/.test(h.pairing) &&
        /0 <= T\(b\) < 1\/4/.test(h.mcmConsequence) &&
        /0\.24350/.test(h.mcmConsequence)
      );
    },
  },
  {
    id: 'imp97445-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-97422.',
    holds: () =>
      IMP97445_MCM_REDUCTION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97445_MCM_REDUCTION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97445_MCM_REDUCTION_GLOSSARY_HEADWORD.verdict) &&
      IMP97445_MCM_REDUCTION_GLOSSARY_HEADWORD.glosses === 'imp-97422',
  },
];

for (const assertion of IMP97445_MCM_REDUCTION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97445-mcm-reduction-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
