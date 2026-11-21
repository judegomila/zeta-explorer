/**
 * @module imp-96647-vasyunin-lammax-collective-rank-glossary-headword
 * @fileoverview imp-96647 -- import-light glossary/Concepts headword for the imp-96612
 *   collective-rank finding: the 0.3526 Vasyunin lam_max log-slope is built from ~6
 *   COLLECTIVE off-diagonal power-iteration modes (r>=4 reaches within 25%, r>=6 reaches
 *   within 10%, r~11 lands within 0.1%), and NO rank-one / mean-field / multiplicative-
 *   Toeplitz surrogate reproduces it.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96612 asked whether an r-step power-iteration / rank-r Rayleigh surrogate from
 *   the peak basis vector e_1 narrows the imp-96586 rank-one bracket [0.0166, 4.7062]
 *   toward the measured slope 0.3526 (imp-96443), and how many collective modes the
 *   coefficient needs. It found YES with a caveat: the moment-ratio slopes climb
 *   monotonically from below (0 -> 0.0166 at r=1 -> 0.3526 at r~11) but only because
 *   R_r -> lam_max by SPD power/Lanczos theory, so this MEASURES the collective rank
 *   rather than independently PREDICTING the coefficient. This headword bakes that
 *   mode-count verdict verbatim (no re-import of the imp-96612 module, to stay
 *   import-light) as a standalone quick-lookup entry: a reader must not expect a
 *   rank-one / mean-field / multiplicative-Toeplitz surrogate to reproduce 0.3526 --
 *   the coefficient is intrinsically a rank-~6 collective quantity.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The rank-r moment-ratio log-slopes b_r = log-slope of R_r(N) = (G_N^{r+1})_11 /
 *   (G_N^r)_11 climb monotonically toward the measured b_meas = 0.3526253785070698:
 *   r=0 gives 0.0 (frozen diagonal, no log-growth), r=1 gives 0.01661 (0.047x, <=4.7%
 *   captured -- this is the imp-96586 rank-one one-step Rayleigh proxy), r=4 gives
 *   0.26902 (0.763x, first within 25%), r=6 gives 0.33404 (0.947x, first within 10%),
 *   and r=11 gives 0.35232 (0.999x). So a rank-one surrogate captures under 5% of the
 *   slope; reaching 75% needs r>=4 and 90% needs r>=6 collective power-iteration modes.
 *
 *   STATUS: a heuristic mode-count measurement (quantifies imp-96586 FINDING 2 that the
 *   coefficient is collective, not single-mode), not an independent prediction of
 *   0.3526 and not a closed-form / averaged-symbol / multiplicative-Toeplitz asymptotic.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96612 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96612-route-m-lammax-rankr-power-iteration-bracket.js (source: the assessment this glosses)
 * @see imp-96586-route-m-lammax-meanfield-cesaro-proxy.js (rank-one bracket [0.0166, 4.7062] this narrows)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (the measured lam_max ladder, slope 0.3526)
 * @see imp-96562-route-m-lammax-offdiagonal-szego-assessment.js (names IMP96562_SUBGAP this sharpens)
 *
 * Ticket: imp-96647 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The collective-rank mode-count headword, baked verbatim (no re-import).
const VASYUNIN_LAMMAX_COLLECTIVE_RANK_HEADWORD = Object.freeze({
  key: 'vasyunin-lammax-slope-needs-6-collective-power-iteration-modes',
  term:
    'imp-96612 verdict: the 0.3526 Vasyunin lam_max log-slope is a COLLECTIVE rank-~6 ' +
    'quantity -- a rank-one surrogate captures <5%, reaching within 25% needs r>=4 and ' +
    'within 10% needs r>=6 collective off-diagonal power-iteration modes, with NO ' +
    'rank-one / mean-field / multiplicative-Toeplitz surrogate reproducing it',
  definition:
    'The rank-r power-iteration moment ratio R_r(N) = (G_N^{r+1})_11 / (G_N^r)_11, ' +
    'formed from the peak basis vector e_1 on the exact Vasyunin Gram ' +
    'G_{hk} = gcd(h,k) I(h/g,k/g)/(hk), converges to lam_max(G_N) as r grows by SPD ' +
    'power/Lanczos theory. Its log-slope b_r therefore climbs monotonically from 0 ' +
    '(r=0, frozen diagonal) toward the measured leading log-coefficient ' +
    'b_meas = 0.3526253785070698 (imp-96443). Tracking how fast b_r approaches b_meas ' +
    'measures how many collective off-diagonal modes the coefficient needs -- it is ' +
    'not, by itself, an independent prediction of the coefficient, since R_r -> lam_max ' +
    'is guaranteed by construction regardless of the operator’s structure.',
  mechanism:
    'Fitted rank-r slopes on the imp-96443 ladder N=250..6000: r=0 b=0.0 (0.000x); ' +
    'r=1 b=0.01661 (0.047x, == imp-96586 P2 one-step Rayleigh); r=2 b=0.09286 (0.263x); ' +
    'r=3 b=0.19357 (0.549x); r=4 b=0.26902 (0.763x, r>=4 first within 25%); ' +
    'r=5 b=0.31228 (0.886x); r=6 b=0.33404 (0.947x, r>=6 first within 10%); ' +
    'r=7 b=0.34429 (0.976x); r=8 b=0.34894 (0.990x); r=11 b=0.35232 (0.9991x). ' +
    'This CONVERGES FROM BELOW (unlike the imp-96586 Gershgorin row-sum overshoot ' +
    '4.7062x, which is not a power iterate). Consequently no rank-one, mean-field, or ' +
    'classical multiplicative-Toeplitz/Szego surrogate (imp-96603) can reproduce 0.3526 ' +
    'with a closed form: the coefficient is intrinsically a rank-~6 collective quantity, ' +
    'requiring the operator applied to e_1 six-plus times before 90% of the log-growth ' +
    'is captured.',
  verificationStatus:
    'Heuristic mode-count measurement (quantifies imp-96586 FINDING 2), not an ' +
    'independent prediction of the 0.3526 coefficient and not a closed-form/averaged-' +
    'symbol/multiplicative-Toeplitz asymptotic. Changes no bound; establishes no ' +
    'operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96647_VASYUNIN_LAMMAX_COLLECTIVE_RANK_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96647',
  proofSection: 'S-frontier',
  glosses: 'imp-96612',
  question:
    'imp-96612 asked whether an r-step power-iteration / rank-r Rayleigh surrogate from ' +
    'the peak basis vector e_1 narrows the imp-96586 rank-one bracket toward the ' +
    'measured 0.3526 Vasyunin lam_max log-slope, and how many collective modes the ' +
    'coefficient needs. How many modes does it take, and does any low-rank surrogate ' +
    'independently predict the coefficient?',
  headword: VASYUNIN_LAMMAX_COLLECTIVE_RANK_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96612 ' +
    'verdict: the coefficient needs r>=4 for 75% and r>=6 for 90% of its collective ' +
    'off-diagonal power-iteration modes (r~11 within 0.1%), a rank-one surrogate ' +
    'captures under 5%, and no rank-one / mean-field / multiplicative-Toeplitz ' +
    'surrogate reproduces 0.3526 with a closed form -- the convergence measures the ' +
    'collective rank, it does not independently predict the coefficient. Establishes ' +
    'nothing; instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96612 (the rank-r power-iteration bracket and finding this glosses); ' +
    'imp-96586 (the rank-one bracket [0.0166, 4.7062] this narrows); imp-96443 (the ' +
    'measured lam_max ladder, slope 0.3526253785070698); imp-96562/imp-96603 (why no ' +
    'closed-form Szego-type surrogate exists).',
});

export default IMP96647_VASYUNIN_LAMMAX_COLLECTIVE_RANK_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96647_VASYUNIN_LAMMAX_COLLECTIVE_RANK_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96647-headword-has-required-fields',
    why: 'The headword must name the collective mode counts (r>=4 for 75%, r>=6 for ' +
      '90%) and the measured coefficient it targets -- the entire point of the ' +
      'glossary entry.',
    holds: () => {
      const h = IMP96647_VASYUNIN_LAMMAX_COLLECTIVE_RANK_GLOSSARY_HEADWORD.headword;
      return (
        /COLLECTIVE/.test(h.term) &&
        /0\.3526253785070698/.test(h.definition) &&
        /r>=4/.test(h.mechanism) &&
        /r>=6/.test(h.mechanism) &&
        /rank-~6/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96647-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96647_VASYUNIN_LAMMAX_COLLECTIVE_RANK_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96647_VASYUNIN_LAMMAX_COLLECTIVE_RANK_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96647_VASYUNIN_LAMMAX_COLLECTIVE_RANK_GLOSSARY_HEADWORD.verdict) &&
      IMP96647_VASYUNIN_LAMMAX_COLLECTIVE_RANK_GLOSSARY_HEADWORD.glosses === 'imp-96612',
  },
];

for (const assertion of IMP96647_VASYUNIN_LAMMAX_COLLECTIVE_RANK_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96647-vasyunin-lammax-collective-rank-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
