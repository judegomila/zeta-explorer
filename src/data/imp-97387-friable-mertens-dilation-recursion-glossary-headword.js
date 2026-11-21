/**
 * @module imp-97387-friable-mertens-dilation-recursion-glossary-headword
 * @fileoverview imp-97387 -- import-light glossary/Concepts headword recording the imp-97353
 *   RESULT 1 dilation recursion M_k = (I - D_{p_k}) M_{k-1} for the primorial friable Moebius
 *   partial sum M_k(t) = Sum_{e : P^+(e) <= p_k} mu(e) e^{-e t}. Peeling the largest prime p_k
 *   from the divisors of the k-th primorial b_k = p_1 ... p_k (each divisor either omits p_k,
 *   giving e | b_{k-1}, or is p_k e' with e' | b_{k-1}, contributing mu(p_k e') = -mu(e'))
 *   gives the exact recursion M_k(t) = M_{k-1}(t) - M_{k-1}(p_k t), M_0(t) = e^{-t}, equivalently
 *   M_k = prod_{j=1}^k (I - D_{p_j}) e^{-t} with the (commuting) dilation operator D_p f(t) = f(p t).
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) EXACT DIVISOR-PEELING IDENTITY. M_k(t) = M_{k-1}(t) - M_{k-1}(p_k t), M_0(t) = e^{-t},
 *   verified to 7e-16 by direct comparison against exact signed-divisor enumeration.
 *   (b) OPERATOR FORM. M_k = prod_{j=1}^k (I - D_{p_j}) e^{-t}, recasting the k-th friable partial
 *   sum as a k-fold dilation-difference of a single seed function, with the D_p commuting.
 *   (c) WHY IT MATTERS. This is the operator-level form of the imp-97332 friable reformulation,
 *   and it is what drives the boundary-layer blow-up: it feeds the imp-97353 RESULT 2 initial-slope
 *   identity |M_k'(0)| = prod_{p<=p_k}(p-1) and the RESULT 3 total-variation reduction
 *   sup_t |M_k(t)| <= TV(M_{k-1}), both of which underlie the RESULT 4 finding that
 *   sup_t |M_k(t)| = o(p_k) is MEASURED-FALSE (grows like 1.71^k instead), relocating the
 *   imp-97332 RESULT 4(iii) obstruction to a signed cancellation estimate.
 *   (d) STATUS: documentation only. No bound moves; this headword names an exact identity that
 *   imp-97353 already established and used, it does not add new content.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an exact recursion.
 *   Not a proof, not a new bound, no uniform remainder supplied. NO QED.
 *
 * @see imp-97353-friable-mertens-sup-refutation.js (source: RESULT 1 dilation recursion, RESULT 2
 *   slope identity, RESULT 3 TV reduction, RESULT 4 exponential sup growth this headword glosses)
 * @see imp-97332-route-m-tail-interchange-assessment.js (the friable reformulation being recast
 *   at the operator level, and the RESULT 4(iii) sup-majorant ingredient this recursion feeds into)
 *
 * Ticket: imp-97387 (content, low, sonnet-4-6). Documentation only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

// The dilation recursion headword, baked verbatim (no re-import).
const DILATION_RECURSION_HEADWORD = Object.freeze({
  key: 'friable-mertens-dilation-recursion-imp97353',
  term:
    'imp-97353 dilation recursion M_k = (I - D_{p_k}) M_{k-1}: the k-th primorial friable ' +
    'Moebius partial sum M_k(t) = Sum_{e : P^+(e) <= p_k} mu(e) e^{-e t} is exactly a k-fold ' +
    'dilation-difference of the single seed function e^{-t}',
  definition:
    'Peeling the largest prime p_k from the divisors of the k-th primorial b_k = p_1 ... p_k ' +
    '(each divisor of b_k either omits p_k, giving e | b_{k-1}, or is p_k e prime with e prime | ' +
    'b_{k-1}, contributing mu(p_k e prime) = -mu(e prime)) gives the exact recursion ' +
    'M_k(t) = M_{k-1}(t) - M_{k-1}(p_k t), with seed M_0(t) = e^{-t}.',
  mechanism:
    'Equivalently, M_k = prod_{j=1}^k (I - D_{p_j}) e^{-t}, where the dilation operator ' +
    'D_p f(t) = f(p t) and the D_p commute. This operator-level form is the imp-97332 friable ' +
    'reformulation recast as a k-fold dilation-difference, and it drives the imp-97353 RESULT 2 ' +
    'super-exponential initial-slope identity and the RESULT 3 total-variation reduction ' +
    'sup_t |M_k(t)| <= TV(M_{k-1}).',
  verificationStatus:
    'Re-cited from the imp-97353 measurement module ' +
    '(src/data/imp-97353-friable-mertens-sup-refutation.js), where the recursion is verified ' +
    'exactly (to 7e-16) by direct comparison against signed-divisor enumeration at k = 1..10. ' +
    'Naming / glossary headword only; supplies no new bound; RH open; no refereed bound is changed' +
    '; NO QED.',
});

export const IMP97387_FRIABLE_MERTENS_DILATION_RECURSION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97387',
  proofSection: 'Route-M',
  glosses: 'imp-97353',
  question:
    'imp-97353 established the exact recursion M_k = (I - D_{p_k}) M_{k-1} for the primorial ' +
    'friable Moebius partial sum, using it to drive the boundary-layer slope identity and the ' +
    'total-variation reduction. What is the headword for this recursion, and does it move any bound?',
  headword: DILATION_RECURSION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Records the imp-97353 RESULT 1 exact ' +
    'dilation recursion M_k = (I - D_{p_k}) M_{k-1}, M_0(t) = e^{-t}, equivalently ' +
    'M_k = prod_{j=1}^k (I - D_{p_j}) e^{-t}: peeling the largest prime from the primorial ' +
    'divisor set recasts the friable partial sum as a k-fold dilation-difference of a single ' +
    'seed. No bound moved; NO QED. No refereed bound is changed.',
  citation:
    'imp-97353 (the dilation recursion, slope identity, and TV reduction this glosses); ' +
    'imp-97332 (the friable reformulation the recursion recasts at the operator level).',
});

export default IMP97387_FRIABLE_MERTENS_DILATION_RECURSION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97387_FRIABLE_MERTENS_DILATION_RECURSION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97387-headword-cites-recursion-and-operator-form',
    why: 'The headword must name both the recursion M_k = M_{k-1}(t) - M_{k-1}(p_k t) and its ' +
      'operator form prod (I - D_{p_j}) -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP97387_FRIABLE_MERTENS_DILATION_RECURSION_GLOSSARY_HEADWORD.headword;
      return (
        /M_k\(t\) = M_\{k-1\}\(t\) - M_\{k-1\}\(p_k t\)/.test(h.definition) &&
        /D_p f\(t\) = f\(p t\)/.test(h.mechanism) &&
        /prod_\{j=1\}\^k/.test(h.mechanism) &&
        /7e-16/.test(h.verificationStatus)
      );
    },
  },
  {
    id: 'imp97387-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-97353.',
    holds: () =>
      IMP97387_FRIABLE_MERTENS_DILATION_RECURSION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97387_FRIABLE_MERTENS_DILATION_RECURSION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97387_FRIABLE_MERTENS_DILATION_RECURSION_GLOSSARY_HEADWORD.verdict) &&
      IMP97387_FRIABLE_MERTENS_DILATION_RECURSION_GLOSSARY_HEADWORD.glosses === 'imp-97353',
  },
];

for (const assertion of IMP97387_FRIABLE_MERTENS_DILATION_RECURSION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97387-friable-mertens-dilation-recursion-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
