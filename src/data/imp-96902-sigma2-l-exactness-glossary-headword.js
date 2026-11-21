/**
 * @module imp-96902-sigma2-l-exactness-glossary-headword
 * @fileoverview imp-96902 -- import-light glossary/Concepts headword for the imp-96874
 *   sub-gap IMP96874_SIGMA2_L_EXACTNESS: the interval enclosure of the box-sine number
 *   variance Sigma^2(L) at the Bartlett window is 7.8e-14 wide when L = 495.779 is taken
 *   as the EXACT window, but only +/- 1.02e-7 wide if L is only pinned to 6 digits --
 *   because dSigma^2/dL = 1/(pi^2 L) is the LEADING term and the oscillatory Ci/Si
 *   contributions to the derivative CANCEL to that order.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96874 derived a rigorous interval enclosure of the exact Dyson-Mehta number
 *   variance Sigma^2(L) at the certificate window, discharging imp-96853 residual item
 *   (i). Along the way it flagged a distinct, honest caveat: the headline 7.8e-14
 *   half-width assumes L = 495.779 is the EXACT box length, not a rounded display of some
 *   underlying T = 1.5e5 proxy. This headword bakes that L-exactness sub-gap verbatim (no
 *   re-import of the imp-96874 module, to stay import-light) so a reader does not conflate
 *   "the enclosure method is rigorous" (true, and unaffected by this caveat) with "the
 *   enclosure width survives any uncertainty in L" (false at only 6 digits of L).
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) TWO DIFFERENT NUMBERS, TWO DIFFERENT QUESTIONS. At exact L = 495.779 the
 *   enveloping-Stieltjes enclosure is Sigma^2(L) in [0.9748336999829, 0.9748336999831],
 *   half-width 7.8e-14 -- this measures how tightly the CLOSED FORM can be evaluated at a
 *   given L, and is essentially double-precision-limited (argument-roundoff dominated, the
 *   transcendental-tail truncation is below 1e-16 at x = 2 pi L ~ 3115).
 *   (b) IF L ITSELF IS ONLY KNOWN TO 6 DIGITS (+/- 0.0005), the induced uncertainty in
 *   Sigma^2 is +/- 1.02e-7 -- still 7 honest digits, but 6 orders of magnitude looser than
 *   (a). This is not a flaw in the enclosure method; it is what propagating an input
 *   uncertainty through the DERIVATIVE looks like.
 *   (c) WHY THE GAP IS SO NARROW (not narrower): dSigma^2/dL = 1/(pi^2 L) = 2.043e-4
 *   exactly reproduces the measured central-difference derivative, i.e. the oscillatory
 *   Ci/Si pieces of Sigma^2(L) contribute NOTHING to the derivative at this order -- only
 *   the leading log-growth term ln(2 pi L)/pi^2 survives differentiation. So the
 *   L-sensitivity is as mild as it could be for a quantity with an oscillatory closed form;
 *   the residual is purely "is L pinned exactly," not "is the derivative badly behaved."
 *   (d) STATUS: open naming/bookkeeping question, not a numerical defect. Whether
 *   L = 495.779 is a defined-exact box length (in which case the 7.8e-14 enclosure stands
 *   unconditionally) or a rounded display of a T = 1.5e5-derived proxy (in which case only
 *   the 1.02e-7 enclosure is honest) is unresolved by imp-96874 itself and is the residual
 *   this headword records.
 *
 *   STATUS: documentation only -- a naming/precision bookkeeping note distinguishing two
 *   enclosure widths under two different assumptions about L. Not a proof, not a new bound,
 *   not a resolution of the L-exactness question. NO QED.
 *
 * @see imp-96874-boxsine-number-variance-interval-enclosure.js (source measurement: the
 *   IMP96874_SIGMA2_L_EXACTNESS sub-gap this glosses)
 * @see imp-96853-vif-twosided-envelope-partition-assessment (the residual item (i) the
 *   imp-96874 enclosure discharges; item (iii) GUE-throughout remains open)
 * @see imp-96567-box-averaged-sine-kernel-lag-decay (the direct Sigma^2 = 0.974834 and the
 *   T_2 setup this enclosure certifies)
 *
 * Ticket: imp-96902 (content, low, sonnet-4-6). Documentation only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

// The L-exactness headword, baked verbatim (no re-import).
const SIGMA2_L_EXACTNESS_HEADWORD = Object.freeze({
  key: 'sigma2-l-exactness-derivative-cancellation-two-enclosure-widths',
  term:
    'imp-96874 sub-gap IMP96874_SIGMA2_L_EXACTNESS: the box-sine number variance ' +
    'enclosure Sigma^2(495.779) is 7.8e-14 wide at EXACT L but only +/- 1.02e-7 wide if L ' +
    'is pinned to just 6 digits, because dSigma^2/dL = 1/(pi^2 L) is the leading term and ' +
    'the oscillatory Ci/Si derivative contributions cancel to that order',
  definition:
    'Two enclosure widths for the same Sigma^2(495.779), depending on what is assumed ' +
    'about the box length L: (a) treating L = 495.779 as EXACT, the enveloping-Stieltjes ' +
    'method gives the rigorous interval Sigma^2(L) in [0.9748336999829, 0.9748336999831], ' +
    'half-width 7.8e-14, dominated by argument roundoff (the transcendental-tail ' +
    'truncation is below double precision at x = 2 pi L ~ 3115); (b) treating L as known ' +
    'only to 6 digits (+/- 0.0005), the propagated uncertainty is +/- 1.02e-7 -- 6 orders ' +
    'of magnitude looser, but still 7 honest digits.',
  mechanism:
    'The gap between (a) and (b) is set entirely by dSigma^2/dL, measured (central ' +
    'difference) as 2.043e-4 and matched exactly by the closed-form leading term ' +
    '1/(pi^2 L) = 2.043e-4. Sigma^2(L) = (1/pi^2)[ln x + gamma + 1 - cos x - Ci(x)] + ' +
    'L[1 - (2/pi) Si(x)] has oscillatory Ci(x)/Si(x) terms, but their contributions to the derivative cancel at this order -- only ' +
    'the ln x = ln(2 pi L) log-growth term survives, so the L-sensitivity is as mild as an ' +
    'oscillatory closed form can produce. ' +
    'The residual is a bookkeeping question -- is L = 495.779 a defined-exact box length or ' +
    'a rounded display of the underlying T = 1.5e5 tiling proxy -- not a defect in either ' +
    'enclosure method.',
  verificationStatus:
    'Re-derived from the imp-96874 closed form and enveloping-Stieltjes brackets ' +
    '(src/data/imp-96874-boxsine-number-variance-interval-enclosure.js); both enclosure ' +
    'widths and the derivative identity are checked by that module\'s self-tests. Naming ' +
    '/ bookkeeping headword only; resolves no new interval; establishes no operator or ' +
    'zero-side result; conditional on the GUE sine-kernel hypothesis carried unchanged ' +
    'from imp-96874; RH open; no refereed bound is changed; NO QED.',
});

export const IMP96902_SIGMA2_L_EXACTNESS_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96902',
  proofSection: 'S-frontier',
  glosses: 'imp-96874',
  question:
    'imp-96874 certified Sigma^2(495.779) to a 7.8e-14 half-width assuming L = 495.779 is ' +
    'exact. What happens to that enclosure if L itself is only known to 6 digits, and why ' +
    'is the gap between the two cases as narrow as it is?',
  headword: SIGMA2_L_EXACTNESS_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96874 sub-gap ' +
    'IMP96874_SIGMA2_L_EXACTNESS: the rigorous enclosure of Sigma^2(495.779) is 7.8e-14 ' +
    'wide at exact L but degrades to +/- 1.02e-7 if L is pinned only to 6 digits, because ' +
    'dSigma^2/dL = 1/(pi^2 L) = 2.043e-4 is the leading log-growth term and the ' +
    'oscillatory Ci/Si derivative contributions cancel to this order -- the residual is ' +
    'whether L = 495.779 is a defined-exact box length or a rounded T = 1.5e5 proxy, a ' +
    'bookkeeping question rather than a numerical defect in either enclosure. Establishes ' +
    'nothing; instantiates no new interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96874 (the enclosure and the IMP96874_SIGMA2_L_EXACTNESS sub-gap this glosses); ' +
    'imp-96853 (the residual item (i) the imp-96874 enclosure discharges); imp-96567 (the ' +
    'direct Sigma^2 = 0.974834 value the closed form reproduces).',
});

export default IMP96902_SIGMA2_L_EXACTNESS_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96902_SIGMA2_L_EXACTNESS_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96902-headword-has-required-fields',
    why: 'The headword must name both enclosure widths and the derivative-cancellation ' +
      'cause -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96902_SIGMA2_L_EXACTNESS_GLOSSARY_HEADWORD.headword;
      return (
        /7\.8e-14/.test(h.definition) &&
        /1\.02e-7/.test(h.definition) &&
        /cancel/i.test(h.mechanism) &&
        /1\s*\/\s*\(pi\^2 L\)|1\/\(pi\^2 L\)/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96902-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96902_SIGMA2_L_EXACTNESS_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96902_SIGMA2_L_EXACTNESS_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96902_SIGMA2_L_EXACTNESS_GLOSSARY_HEADWORD.verdict) &&
      IMP96902_SIGMA2_L_EXACTNESS_GLOSSARY_HEADWORD.glosses === 'imp-96874',
  },
];

for (const assertion of IMP96902_SIGMA2_L_EXACTNESS_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96902-sigma2-l-exactness-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
