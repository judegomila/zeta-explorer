/**
 * @module imp-96638-box-sine-kernel-two-sided-approx-glossary-headword
 * @fileoverview imp-96638 -- import-light glossary/Concepts headword for the imp-96617
 *   verdict: the box sine-kernel closed-form lag correlation rho_k(inf) =
 *   -(1/(2 pi^2 Sigma^2)) ln(k^2/(k^2-1)) is a two-SIDED ~6-7-digit approximation to the
 *   true finite-L box correlation, NOT a certified one-sided VIF upper bound -- the
 *   finite-L correction's sign is genuinely oscillatory, not one-signed.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96617 measured the sign of the O(1/L) finite-L correction DeltaCov_k(L) =
 *   Cov_k(L) - Cov_k(inf) to decide whether the imp-96567 closed form could serve as a
 *   certified one-sided (upper) bound for a rigorous conditional VIF certificate. This
 *   headword bakes that verdict verbatim (no re-import of the imp-96617 module, to stay
 *   import-light) as a standalone quick-lookup entry: a reader must not treat the closed
 *   form as a one-sided bound just because it is an accurate approximation.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) SIGN OSCILLATES. The exact correction integral DeltaCov_k(L) =
 *   (1/(2 pi^2)) int_{-1}^{1} (1-|v|) cos(2 pi L (v+k)) / (v+k)^2 dv takes BOTH signs
 *   across the certificate L-window and is lag-alternating at the fixed window
 *   L = 495.779 (-, +, +, +, - for k = 2..6). So the closed form is not a certified
 *   one-sided upper bound: it can sit on either side of the true finite-L value.
 *   (b) TINY AND O(1/L^2), NOT O(1/L). The Bartlett triangle weight (1-|v|) vanishes at
 *   the box edges v = +/-1, killing the leading boundary term of the oscillatory
 *   integral, so the envelope is one power smaller than naively expected:
 *   |DeltaCov_k| <~ 2.07e-3/L^2 (measured flat to ~1% across L ~ 50..2000), giving
 *   agreement to ~6-7 significant figures at the certificate window.
 *
 *   STATUS: a sign measurement (closes the one-sided-bound route). The rigorous
 *   envelope constant C flagged here as "not delivered" HAS since been delivered by
 *   imp-96628, which certifies |DeltaCov_k(L)| <= C(k)/L^2 with the explicit L-uniform
 *   C(k) = (1/(8 pi^4)) [2/k^2 + 1/(k-1)^2 + 1/(k+1)^2 + V(k)] for k >= 2, obtained by
 *   two integrations by parts on the oscillatory integral (the first IBP kills the
 *   O(1/L) boundary term because the Bartlett weight vanishes at v = +/-1).
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96617 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96617-finite-L-correction-sign.js (source: the measurement this glosses)
 * @see imp-96628-boxsine-lagcorr-ibp-envelope.js (the certified C(k) that upgrades this measured envelope)
 * @see imp-96567-box-averaged-sine-kernel-lag-decay (the closed form whose sign this probes)
 * @see imp-96593-vif-exact-tail-rigor-upgrade-assessment (VERDICT obstruction (ii): unpinned sign)
 *
 * Ticket: imp-96638 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The two-sided-approximation headword, baked verbatim (no re-import).
const BOX_SINE_KERNEL_TWO_SIDED_APPROX_HEADWORD = Object.freeze({
  key: 'box-sine-kernel-two-sided-approximation-not-one-sided-bound',
  term:
    'imp-96617 verdict: the box sine-kernel closed-form lag correlation ' +
    'rho_k(inf) = -(1/(2 pi^2 Sigma^2)) ln(k^2/(k^2-1)) is a two-SIDED ~6-7-digit ' +
    'approximation (|DeltaCov_k| <~ 2.07e-3/L^2, Bartlett weight kills the O(1/L) term), ' +
    'NOT a certified one-sided VIF upper bound -- the finite-L sign is oscillatory',
  definition:
    'The exact finite-L correction to the box sine-kernel lag-k covariance, ' +
    'DeltaCov_k(L) = Cov_k(L) - Cov_k(inf) = (1/(2 pi^2)) int_{-1}^{1} (1-|v|) ' +
    'cos(2 pi L (v+k)) / (v+k)^2 dv, does not have a fixed sign: it takes both signs ' +
    'as L sweeps the certificate window and is lag-alternating (-, +, +, +, - for ' +
    'k = 2..6) at the fixed window L = 495.779. A quantity whose sign oscillates cannot ' +
    'serve as a one-sided (upper or lower) bound on the true finite-L covariance, no ' +
    'matter how small its magnitude -- the closed form rho_k(inf) is therefore only a ' +
    'two-sided approximation to rho_k(L), not a certified bound in either direction.',
  mechanism:
    'The Bartlett triangle weight (1-|v|) in the correction integral VANISHES at the ' +
    'box edges v = +/-1, which kills the leading boundary term of the oscillatory ' +
    'integral and drops the correction from the naively expected O(1/L) down to a ' +
    'measured O(1/L^2) envelope: L^2 * max|DeltaCov_2| is flat to ~1% across ' +
    'L ~ 50, 200, 495, 2000 (2.026e-3, 2.057e-3, 2.063e-3, 2.066e-3), giving ' +
    '|DeltaCov_k| <~ 2.07e-3/L^2. At the certificate window L = 495.779 this is only ' +
    '~1e-7 relative to Cov_k(inf), i.e. agreement to ~6-7 significant figures -- ' +
    'small, but oscillatory in sign, not one-signed, so the route to a rigorous ' +
    'conditional VIF via a ONE-SIDED closed-form bound stays closed. What remains is a ' +
    'two-sided enclosure Cov_k(L) = Cov_k(inf) +/- C/L^2 with C ~ 2.07e-3 measured; ' +
    'imp-96628 has since CERTIFIED this envelope via two integrations by parts on the ' +
    'oscillatory correction integral, giving the rigorous L-uniform constant ' +
    'C(k) = (1/(8 pi^4)) [2/k^2 + 1/(k-1)^2 + 1/(k+1)^2 + V(k)] for all k >= 2 ' +
    '(C(2) = 3/(8 pi^4) = 3.85e-3, which dominates the measured 2.07e-3, ratio 1.86).',
  verificationStatus:
    'Sign measurement (closes off a proof route); the certified envelope constant is ' +
    'now delivered separately by imp-96628 (two-IBP bound |DeltaCov_k| <= C(k)/L^2). ' +
    'Changes no bound; establishes no operator positivity; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96638_BOX_SINE_KERNEL_TWO_SIDED_APPROX_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96638',
  proofSection: 'S-frontier',
  glosses: 'imp-96617',
  question:
    'imp-96593 obstruction (ii) needed the imp-96567 closed-form box sine-kernel lag ' +
    'correlation to be a certified one-sided (upper) bound on the true finite-L box ' +
    'correlation to make the rigorous conditional VIF level fully certified. imp-96617 ' +
    'measured the sign of the O(1/L) finite-L correction to decide this. Is the closed ' +
    'form a one-sided bound, or only a two-sided approximation?',
  headword: BOX_SINE_KERNEL_TWO_SIDED_APPROX_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96617 ' +
    'verdict: the finite-L correction DeltaCov_k(L) is genuinely OSCILLATORY in sign ' +
    '(both signs across the L-window, lag-alternating at the fixed window), so the ' +
    'closed form is NOT a certified one-sided VIF upper bound -- confirming imp-96593 ' +
    'obstruction (ii). The correction is tiny and obeys a measured O(1/L^2) envelope ' +
    '(|DeltaCov_k| <~ 2.07e-3/L^2, ~1e-7 relative at L = 495.779, ~6-7 digits of ' +
    'agreement) because the Bartlett weight kills the leading O(1/L) boundary term, so ' +
    'a two-sided enclosure is available even though a one-sided bound is not. ' +
    'Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96617 (the sign measurement and finding this glosses); imp-96567 (the closed ' +
    'form whose sign this probes); imp-96593 (names obstruction (ii) this measurement ' +
    'answers).',
});

export default IMP96638_BOX_SINE_KERNEL_TWO_SIDED_APPROX_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96638_BOX_SINE_KERNEL_TWO_SIDED_APPROX_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96638-headword-has-required-fields',
    why: 'The headword must name the oscillatory sign, the O(1/L^2) envelope, and the ' +
      'two-sided-vs-one-sided distinction -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96638_BOX_SINE_KERNEL_TWO_SIDED_APPROX_GLOSSARY_HEADWORD.headword;
      return (
        /oscillat/i.test(h.definition) &&
        /two-sided/i.test(h.definition) &&
        /O\(1\/L\^2\)/.test(h.mechanism) &&
        /Bartlett/.test(h.mechanism) &&
        /2\.07e-3/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96638-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96638_BOX_SINE_KERNEL_TWO_SIDED_APPROX_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96638_BOX_SINE_KERNEL_TWO_SIDED_APPROX_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96638_BOX_SINE_KERNEL_TWO_SIDED_APPROX_GLOSSARY_HEADWORD.verdict) &&
      IMP96638_BOX_SINE_KERNEL_TWO_SIDED_APPROX_GLOSSARY_HEADWORD.glosses === 'imp-96617',
  },
];

for (const assertion of IMP96638_BOX_SINE_KERNEL_TWO_SIDED_APPROX_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96638-box-sine-kernel-two-sided-approx-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
