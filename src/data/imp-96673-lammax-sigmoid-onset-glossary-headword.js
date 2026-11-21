/**
 * @module imp-96673-lammax-sigmoid-onset-glossary-headword
 * @fileoverview imp-96673 -- import-light glossary/Concepts headword for the imp-96652
 *   spectral derivation of the Route M lam_max sigmoid onset: the imp-96636 empirical
 *   logistic (r0 = 2.9408, k = 0.8632, R^2 = 0.996) in the rank-r power-iteration Rayleigh
 *   slopes is the EXACT top-eigenpair weight share of a two-scale Vasyunin Gram spectrum,
 *   with width k = 1/ln(lam_1/lam_2) fixed by the top spectral gap ratio (~2.6) and
 *   half-saturation r0 = ln((1-w_1)/w_1)/ln(lam_1/lam_2) fixed by the small top overlap
 *   w_1 ~ 8% (a delocalized/collective top mode).
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96652 asked whether the imp-96636 sigmoidal onset was a structural consequence of
 *   the imp-96443 Vasyunin Gram spectrum, or just an empirical curve-fit accident. It found
 *   the logistic form is forced: diagonalizing G and writing the top-eigenpair weight share
 *   s_r = w_1 lam_1^r / (sum_i w_i lam_i^r) gives, in the two-scale (top + bulk-edge) limit,
 *   EXACTLY a logistic in r. This headword bakes that verdict verbatim (no re-import of the
 *   imp-96652 module, to stay import-light) as a standalone quick-lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   s_r = 1/(1 + ((1-w_1)/w_1)(lam_2/lam_1)^r) = 1/(1 + exp(-(r-r0)/k)), with
 *   k = 1/ln(lam_1/lam_2) (width, set by the top spectral gap ratio) and
 *   r0 = k * ln((1-w_1)/w_1) (half-saturation, set by the top overlap w_1). At N=1000..3000
 *   the exact top-share is logistic to R^2 > 0.99 at every N, and the two-scale closed form
 *   climbs r0 ~ 2.16 -> 2.53 -> 2.75 toward the imp-96636 measured r0 = 2.9408 (within ~10%
 *   at N=3000, monotone trend upward), with the small top overlap w_1 ~ 7.8-9.8% explaining
 *   the delayed onset (b_1/L = 4.7%) directly.
 *
 *   STATUS: a structural-derivation restatement (sharpens IMP96562_SUBGAP), not a new
 *   measurement and not a closed-form derivation of the 0.3526 coefficient itself. w_1 and
 *   the gap ratio lam_1/lam_2 remain measured, mildly N-dependent quantities.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96652 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96652-route-m-lammax-sigmoid-onset-spectral-derivation.js (source: the derivation this glosses)
 * @see imp-96636-route-m-lammax-slope-saturation-fit.js (the empirical logistic 2.94/0.86)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (measured lam_max = 3.0247 + 0.3526 log N)
 *
 * Ticket: imp-96673 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The spectral-derivation headword, baked verbatim (no re-import).
const LAMMAX_SIGMOID_ONSET_HEADWORD = Object.freeze({
  key: 'route-m-lammax-sigmoid-onset-is-top-eigenpair-weight-share',
  term:
    'imp-96652 verdict: the imp-96636 logistic (r0=2.94, k=0.86) rank-r accumulation onset ' +
    'of the 0.3526 Vasyunin lam_max log-slope is the EXACT top-eigenpair weight share ' +
    's_r = w1 lam1^r/(sum_i w_i lam_i^r) of a two-scale Gram spectrum -- width ' +
    'k = 1/ln(lam1/lam2) set by the top gap ratio (~2.6), half-saturation ' +
    'r0 = ln((1-w1)/w1)/ln(lam1/lam2) set by the small top overlap w1 ~ 8%',
  definition:
    'The imp-96612 rank-r power-iteration Rayleigh quotient of the imp-96443 Vasyunin Gram ' +
    'G accumulates its 0.3526 log-slope in a SIGMOIDAL (logistic-in-r) way, fit purely ' +
    'empirically by imp-96636. Diagonalizing G = sum_i lam_i v_i v_i^T and writing the ' +
    'overlap w_i = <e_1, v_i>^2 of the peak basis vector with eigenvector v_i, the moment ' +
    'm_j = <e_1, G^j e_1> = sum_i w_i lam_i^j makes the top-eigenpair SHARE of that moment ' +
    's_r = w1 lam1^r / (sum_i w_i lam_i^r). In the two-scale idealization (top lam1 with ' +
    'small overlap w1, an effective bulk edge lam2 carrying the rest) this share is EXACTLY ' +
    'a logistic in r, so the sigmoid is a forced consequence of the spectrum, not an ' +
    'accidental curve shape.',
  mechanism:
    's_r = 1/(1 + ((1-w1)/w1)(lam2/lam1)^r) = 1/(1 + exp(-(r-r0)/k)), with WIDTH ' +
    'k = 1/ln(lam1/lam2) fixed by the top spectral GAP RATIO and HALF-SATURATION ' +
    'r0 = k*ln((1-w1)/w1) fixed by the top OVERLAP w1. Full eigendecomposition of G_N at ' +
    'N=1000,2000,3000 gives a clean two-scale top (lam1 ~5.5-5.9, lam2 ~1.97-2.39, gap ratio ' +
    '~2.45-2.79) and a SMALL top overlap w1 ~ 7.8-9.8% -- the peak basis vector puts under a ' +
    'tenth of its mass on the top eigenvector, confirming a collective/delocalized top mode. ' +
    'The exact top-share fits a logistic to R^2 > 0.99 at every N, and the two-scale ' +
    'closed-form r0 climbs 2.16 -> 2.53 -> 2.75 toward the imp-96636 measured 2.9408 (within ' +
    '~10% at N=3000, trend still rising with N), while width k ~ 0.97-1.11 brackets the ' +
    'measured 0.8632 from above. Re-fitting the actual log-slope ladder b_r/L (N=250..3000) ' +
    'on this same Gram reproduces the sigmoid (r0=2.63, k=0.71, R^2=0.99) up to the truncated ' +
    'ladder, confirming the same Gram carries the same onset.',
  verificationStatus:
    'Structural-derivation restatement (sharpens IMP96562_SUBGAP: the "why a sigmoid" ' +
    'mystery reduces to the spectral facts w1 ~ 8% small overlap, gap ratio ~2.6), not a ' +
    'new measurement and not a closed-form derivation. w1 and lam1/lam2 remain measured, ' +
    'mildly N-dependent quantities with no closed form or N-asymptotics produced. Changes no ' +
    'bound; establishes no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96673_LAMMAX_SIGMOID_ONSET_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96673',
  proofSection: 'S-frontier',
  glosses: 'imp-96652',
  question:
    'imp-96636 fit the rank-r lam_max Rayleigh log-slope accumulation to a logistic ' +
    '(r0=2.94, k=0.86) purely empirically. Does that sigmoidal onset FOLLOW from the ' +
    'eigenvalue-gap / spectral-density structure of the Vasyunin Gram, rather than being an ' +
    'accidental curve shape?',
  headword: LAMMAX_SIGMOID_ONSET_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96652 verdict: ' +
    'the logistic is the EXACT top-eigenpair weight share s_r of a two-scale Gram spectrum, ' +
    'with width k = 1/ln(lam1/lam2) (gap ratio ~2.6) and half-saturation ' +
    'r0 = ln((1-w1)/w1)/ln(lam1/lam2) (top overlap w1 ~ 8%, delocalized top mode) -- the ' +
    'sigmoid is DERIVED, not coincidental, though no closed form for the 0.3526 coefficient ' +
    'or for w1/gap themselves is produced. Establishes nothing; instantiates no interval; ' +
    'moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96652 (the spectral derivation this glosses); imp-96636 (the empirical logistic ' +
    '2.94/0.86); imp-96612 (rank-r Rayleigh moment ratios); imp-96443 (measured lam_max, ' +
    '0.3526 log-slope coefficient).',
});

export default IMP96673_LAMMAX_SIGMOID_ONSET_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96673_LAMMAX_SIGMOID_ONSET_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96673-headword-has-required-fields',
    why: 'The headword must name the logistic closed form, the width/gap-ratio link, the ' +
      'half-saturation/overlap link, and the measured comparison values -- the entire point ' +
      'of the glossary entry.',
    holds: () => {
      const h = IMP96673_LAMMAX_SIGMOID_ONSET_GLOSSARY_HEADWORD.headword;
      return (
        /k = 1\/ln\(lam1\/lam2\)/.test(h.mechanism) &&
        /2\.9408/.test(h.mechanism) &&
        /0\.8632/.test(h.mechanism) &&
        /w1 ~ 7\.8-9\.8%/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96673-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96673_LAMMAX_SIGMOID_ONSET_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96673_LAMMAX_SIGMOID_ONSET_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96673_LAMMAX_SIGMOID_ONSET_GLOSSARY_HEADWORD.verdict) &&
      IMP96673_LAMMAX_SIGMOID_ONSET_GLOSSARY_HEADWORD.glosses === 'imp-96652',
  },
];

for (const assertion of IMP96673_LAMMAX_SIGMOID_ONSET_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96673-lammax-sigmoid-onset-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
