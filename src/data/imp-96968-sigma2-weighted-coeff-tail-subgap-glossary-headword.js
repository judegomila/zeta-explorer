/**
 * @module imp-96968-sigma2-weighted-coeff-tail-subgap-glossary-headword
 * @fileoverview imp-96968 -- import-light glossary/Concepts headword for the imp-96934
 *   SUB-GAP imp-96934-sigma2-weighted-coeff-tail-unmodelled: the beyond-T=3200 Krein
 *   floor residual IS sigma_2-weighted Bessel mass (confirmed in sign and order), but
 *   the literal uniform-j_k^2 (2k+1)/(pi*T) onset-mass model both over-predicts the
 *   absolute fraction and badly under-predicts the super-linear N-growth (measured
 *   p~3.27 vs a linear-in-k_max model), leaving an unexplained component tied to the
 *   sigma_2 ~ t^4 tail weighting and the minimiser's high-k coefficient amplitudes.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96934 tabulated the onset-vs-residual decomposition at N in {76,100,124},
 *   2a=ln3, and reached a two-part verdict: the mechanism has the right OBJECT (the
 *   first-order sigma_2-weighted tail residual reproduces the measured floor lift in
 *   sign and order) but the wrong QUANTITATIVE model (over-predicts the fraction 3-15x,
 *   under-predicts the per-step growth ratio by roughly half). This headword bakes that
 *   two-part distinction verbatim (no re-import of the imp-96934 module, to stay
 *   import-light) so a reader does not conflate "the mechanism is directionally
 *   confirmed" with "the mechanism is quantitatively modelled."
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE OBJECT IS RIGHT. The first-order (Rayleigh) tail residual phi^T A_tail phi
 *   / scaleB -- the sigma_2-weighted Bessel mass beyond T=3200 -- matches the measured
 *   floor lift in sign and within 2x at every tabulated N (0.000643 vs 0.000607 at
 *   N=76; 0.001862 vs 0.001490 at N=100; 0.005481 vs 0.002999 at N=124), and a split
 *   check lam_min(A_lo+A_tail) reproduces the direct T=12800 floor to <=2e-6.
 *   (b) THE MODEL IS NOT QUANTITATIVE. The literal uniform-j_k^2 onset-mass fraction
 *   (2k_max+1)/(pi*T3200) over-predicts the absolute tail fraction by 3-15x (1.62% /
 *   2.10% / 2.58% predicted vs 0.110% / 0.321% / 0.942% measured at N=76/100/124), and
 *   under-predicts the per-N-step growth ratio by roughly half (predicts x1.294 then
 *   x1.227; measured x2.457 then x2.013 -- imp-96928's fitted power law is p~3.27,
 *   confirmed super-cubic).
 *   (c) SUB-GAP: WHAT IS MISSING. The uniform-j_k^2 onset model assumes flat Bessel
 *   mass past onset and a fixed onset-to-cutoff ratio; it omits the sigma_2 =
 *   (t^2+1/4)^2 w_1 ~ t^4 weighting that concentrates mass at larger t, and the pole-
 *   free minimiser's own high-k coefficient amplitudes growing with N (a second-order
 *   effect the onset model, which fixes the trial function, cannot see). Both factors
 *   push in the same direction: more weight at larger t as k_max grows, which is what
 *   produces the super-linear-not-linear residual growth.
 *   (d) NO CHANGE TO THE imp-96934/imp-96917 CONSEQUENCE. The Rayleigh floor is an
 *   UPPER bound throughout; this is a measurement of WHY a simplified model
 *   under/over-shoots, not a new bound. The interval-rigorous certificate reach stays
 *   2a<=0.96.
 *
 *   STATUS: a glossary distinction over a single finite tabulation (N=76,100,124 at
 *   2a=ln3), not a derivation of the missing component. NO QED. No refereed bound is changed.
 *
 * @see imp-96934-bessel-onset-tail-residual-viz-data.js (source: the onset-vs-residual
 *   decomposition and sub-gap this glosses)
 * @see imp-96928-krein-residual-vs-floor-uniform-N-extrap.js (the p~3.27 super-cubic
 *   residual growth fit)
 * @see imp-96917-krein-tladder-plateau-viz-data.js (the beyond-T=3200 residual this
 *   explains)
 *
 * Ticket: imp-96968 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The sub-gap headword, baked verbatim (no re-import).
const SIGMA2_WEIGHTED_COEFF_TAIL_SUBGAP_HEADWORD = Object.freeze({
  key: 'sigma2-weighted-coeff-tail-subgap-object-right-model-wrong',
  term:
    'imp-96934 SUB-GAP imp-96934-sigma2-weighted-coeff-tail-unmodelled: the beyond-' +
    'T=3200 Krein floor residual IS sigma_2-weighted Bessel mass (right OBJECT, ' +
    'confirmed in sign and order) but the literal uniform-j_k^2 (2k+1)/(pi*T) onset-' +
    'mass model is NOT quantitative (over-predicts the fraction 3-15x, under-predicts ' +
    'the super-linear N-growth by roughly half)',
  definition:
    'imp-96934 decomposed the imp-96917 beyond-T=3200 Krein floor residual at N in ' +
    '{76,100,124}, 2a=ln3, into a first-order (Rayleigh) tail-residual estimate ' +
    'phi^T A_tail phi / scaleB and a literal onset-mass prediction (2*kmax+1)/(pi*T3200) ' +
    'from the uniform spherical-Bessel identity int_0^inf j_k^2 = pi/(2(2k+1)). The ' +
    'first-order estimate reproduces the measured floor lift in sign and within 2x at ' +
    'every N (0.000643/0.001862/0.005481 vs measured 0.000607/0.001490/0.002999), so ' +
    'the mechanism has the right object. But the literal onset-mass model over-predicts ' +
    'the absolute tail fraction by 3-15x (1.62%/2.10%/2.58% vs measured sigma_2-' +
    'weighted 0.110%/0.321%/0.942%) and under-predicts the per-N-step growth ratio by ' +
    'roughly half (predicts x1.294 then x1.227; measured x2.457 then x2.013, consistent ' +
    'with imp-96928\'s fitted p~3.27 super-cubic law) -- a quantitative gap, not just a ' +
    'directional one.',
  mechanism:
    'The literal onset-mass model treats the tail as uniform Bessel mass past a fixed ' +
    'onset t~kmax/a, independent of the operator weighting or the minimiser shape. Two ' +
    'factors it omits both push toward larger measured mass and faster N-growth: (1) ' +
    'the sigma_2 = (t^2+1/4)^2 w_1 ~ t^4 weight concentrates mass at larger t rather ' +
    'than spreading it uniformly past onset, and (2) the pole-free minimiser\'s own ' +
    'high-k coefficient amplitudes grow with N (a second-order effect invisible to a ' +
    'model that fixes the trial function). Together these leave an unexplained super-' +
    'linear residual component; the onset model captures only the linear-in-kmax first ' +
    'moment. Neither factor changes the imp-96934/imp-96917 status: the Rayleigh floor ' +
    'remains an UPPER bound and the interval-rigorous certificate reach stays 2a<=0.96.',
  verificationStatus:
    'Re-read of the imp-96934 tabulated onset-vs-residual decomposition (driver ' +
    'tmp/imp-96934-bessel-onset-tail.py, orthogonal Gegenbauer build at N in ' +
    '{76,100,124}, 2a=ln3) plus the imp-96928 super-cubic growth fit (p~3.27). ' +
    'Reconciles a single finite tabulation; not a derivation of the missing sigma_2/' +
    'coefficient-amplitude component. Changes no bound; establishes no operator ' +
    'positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96968_SIGMA2_WEIGHTED_COEFF_TAIL_SUBGAP_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96968',
  proofSection: 'S-frontier',
  glosses: 'imp-96934',
  question:
    'imp-96934 confirmed the beyond-T=3200 Krein floor residual is sigma_2-weighted ' +
    'Bessel mass but found the literal (2k+1)/(pi*T) onset-mass model both over-' +
    'predicts the absolute fraction and badly under-predicts the super-linear N-growth ' +
    '(measured p~3.27 vs linear-in-k model). What IS the sub-gap this leaves, and does ' +
    'confirming the object mean the model is quantitative?',
  headword: SIGMA2_WEIGHTED_COEFF_TAIL_SUBGAP_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96934 two-' +
    'part finding: the sigma_2-weighted-Bessel-mass mechanism has the right OBJECT ' +
    '(first-order tail residual matches the measured floor lift in sign and order at ' +
    'every N), but the literal uniform-j_k^2 onset-mass MODEL is not quantitative ' +
    '(over-predicts the fraction 3-15x, under-predicts the super-linear N-growth by ' +
    'roughly half, imp-96928 p~3.27). The unexplained component traces to the sigma_2 ' +
    '~ t^4 tail weighting and the minimiser\'s high-k coefficient amplitudes, neither of ' +
    'which the fixed-trial-function onset model can see. Does not change the ' +
    'imp-96934/imp-96917 status: Rayleigh floor is an UPPER bound, certificate reach ' +
    'stays 2a<=0.96. Establishes nothing; instantiates no interval; moves no bound; ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-96934 (the onset-vs-residual decomposition and sub-gap this glosses); ' +
    'imp-96928 (the p~3.27 super-cubic residual growth fit); imp-96917 (the beyond-' +
    'T=3200 residual this explains).',
});

export default IMP96968_SIGMA2_WEIGHTED_COEFF_TAIL_SUBGAP_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96968_SIGMA2_WEIGHTED_COEFF_TAIL_SUBGAP_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96968-headword-has-required-fields',
    why: 'The headword must name both the right-object confirmation and the ' +
      'quantitative model gap -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96968_SIGMA2_WEIGHTED_COEFF_TAIL_SUBGAP_GLOSSARY_HEADWORD.headword;
      return (
        /3-15x/.test(h.definition) &&
        /p~3\.27/.test(h.definition) &&
        /right object/i.test(h.term) &&
        /sigma_2.*t\^4/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96968-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96968_SIGMA2_WEIGHTED_COEFF_TAIL_SUBGAP_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96968_SIGMA2_WEIGHTED_COEFF_TAIL_SUBGAP_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96968_SIGMA2_WEIGHTED_COEFF_TAIL_SUBGAP_GLOSSARY_HEADWORD.verdict) &&
      IMP96968_SIGMA2_WEIGHTED_COEFF_TAIL_SUBGAP_GLOSSARY_HEADWORD.glosses === 'imp-96934',
  },
];

for (const assertion of IMP96968_SIGMA2_WEIGHTED_COEFF_TAIL_SUBGAP_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96968-sigma2-weighted-coeff-tail-subgap-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
