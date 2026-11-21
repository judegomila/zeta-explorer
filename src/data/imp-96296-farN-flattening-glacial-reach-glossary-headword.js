/**
 * @module imp-96296-farN-flattening-glacial-reach-glossary-headword
 * @fileoverview imp-96296 -- import-light glossary/Concepts headword for the imp-96250
 *   result: the imp-96187 U-shape location ratio R(N) = N_peak/N_flow flattens toward 1
 *   as R(N) = 1 - 4/ln N - 16/(ln N)^2 + O((ln ln N/ln N)^2), but the approach is
 *   logarithmic and GLACIAL -- R is within 1% of 1 only at log10 N ~ 174, and within
 *   0.1% only at log10 N ~ 1737, so the flattening has NO reach at physical heights
 *   (at the actual N_flow ~ 1.6e6 the ratio is still ~ 0.577).
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96250 derived the closed-form far-N expansion of R(N) from the imp-96244 slope
 *   tails and quantified its convergence rate, but the module has no standalone
 *   quick-lookup entry stating the headline number for a reader who only wants the
 *   "how slow is this" answer: log10 N ~ 174 for 1%, ~1737 for 0.1%. This headword bakes
 *   that verbatim (no re-import of the imp-96250/imp-96244/imp-96187 modules, to stay
 *   import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   R(N) = N_peak/N_flow = 1 - 4/ln N - 16/(ln N)^2 + O((ln ln N/ln N)^2) -> 1 from below,
 *   with leading rate 4/ln N. The convergence is logarithmic, hence glacial: R reaches
 *   within 1% of 1 only at log10 N ~ 174 and within 0.1% at log10 N ~ 1737. At the actual
 *   N_flow ~ 1.6e6 (log10 N ~ 6.2) the ratio is still ~ 0.577, confirming that the
 *   imp-96187 0.577 ~ 1/sqrt(3) proximity is a finite-height artifact, not a limit
 *   constant reached in practice.
 *
 *   MECHANISM: the leading coefficient 4 = 2(b_c - a_c) is exactly twice the imp-96244
 *   slope-asymmetry gap b_c - a_c = 5/2 - 1/2 = 2 (the b-branch drifts 5x faster than the
 *   a-branch), so the same algebra that separates the two slopes is what eventually
 *   closes the peak/crossover gap -- just on a ln N timescale, not an N timescale.
 *
 *   STATUS: a derived asymptotic rate, conditional only through the a-branch GUE
 *   collision-term shape (imp-486). It establishes nothing about physically reachable N.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96250 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96250-ushape-location-ratio-farN-asymptote (source: the far-N asymptote and rate this glosses)
 * @see imp-96244-ushape-slope-asymptote-derivation (the a -> 1/2-1/(2 ln N), b -> 1/2-5/(2 ln N) slope tails)
 * @see imp-96187-ushape-peak-ratio-logcorrection-identity-vs-accident (the 0.577 finite-height reading)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 *
 * Ticket: imp-96296 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The glacial-flattening headword, baked verbatim (no re-import).
const FARN_FLATTENING_GLACIAL_REACH_HEADWORD = Object.freeze({
  key: 'ushape-location-ratio-farN-flattening-is-glacial',
  term:
    'imp-96250 verdict: the imp-96187 U-shape location ratio R(N)=N_peak/N_flow flattens ' +
    'toward 1 logarithmically, so the flattening has no reach at physical heights',
  definition:
    'The imp-96250 closed-form far-N expansion R(N) = N_peak/N_flow = ' +
    '1 - 4/ln N - 16/(ln N)^2 + O((ln ln N/ln N)^2) rises toward 1 from below at leading ' +
    'rate 4/ln N. The convergence is logarithmic, hence GLACIAL: R reaches within 1% of 1 ' +
    'only at log10 N ~ 173.7, and within 0.1% only at log10 N ~ 1737.2. At the actual ' +
    'N_flow ~ 1.6e6 (log10 N ~ 6.2) the ratio is still ~ 0.577.',
  mechanism:
    'The leading coefficient 4 equals 2(b_c - a_c), exactly twice the imp-96244 slope-' +
    'asymmetry gap b_c - a_c = 5/2 - 1/2 = 2 between the b-branch (height law, ' +
    'unconditional) and the a-branch (collision-term shape, GUE-conditional). The same ' +
    'algebra that makes b drift 5x faster than a is what eventually closes the peak/' +
    'crossover separation -- but only on a ln N timescale, so no accessible N benefits.',
  verificationStatus:
    'Derived asymptotic rate, conditional only through the a-branch GUE collision-term ' +
    'shape (imp-486, UNTOUCHED). Confirms the imp-96187 verdict that the 0.577 proximity ' +
    'at N_flow is a finite-height artifact, not a limit constant reached in practice. ' +
    'Changes no bound; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96296_FARN_FLATTENING_GLACIAL_REACH_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96296',
  proofSection: 'S-frontier',
  glosses: 'imp-96250',
  question:
    'imp-96250 derived that the imp-96187 U-shape location ratio R(N) flattens toward 1 as ' +
    'N grows. How fast does that flattening actually reach 1, and does it matter at any ' +
    'physically accessible height?',
  headword: FARN_FLATTENING_GLACIAL_REACH_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96250 verdict: ' +
    'R(N) = 1 - 4/ln N - 16/(ln N)^2 + O((ln ln N/ln N)^2) -> 1 from below, but the ' +
    'approach is logarithmic and glacial -- within 1% of 1 only at log10 N ~ 174, within ' +
    '0.1% at ~1737 -- so it has NO reach at physical heights (at N_flow ~ 1.6e6 the ratio ' +
    'is still ~ 0.577). Establishes nothing; instantiates no interval; moves no bound; ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-96250 (the far-N asymptote and rate this glosses); imp-96244 (the slope tails ' +
    'the asymptote is derived from); imp-96187 (the 0.577 finite-height reading and its ' +
    'location law); imp-486 (C_mb GUE-conditional).',
});

export default IMP96296_FARN_FLATTENING_GLACIAL_REACH_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96296_FARN_FLATTENING_GLACIAL_REACH_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96296-headword-has-required-fields',
    why: 'The headword must name the flattening rate, both reach thresholds, and the ' +
      'finite-height 0.577 reading -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96296_FARN_FLATTENING_GLACIAL_REACH_GLOSSARY_HEADWORD.headword;
      return (
        /4\/ln N/.test(h.definition) &&
        /173\.7/.test(h.definition) &&
        /1737\.2/.test(h.definition) &&
        /0\.577/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96296-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96296_FARN_FLATTENING_GLACIAL_REACH_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96296_FARN_FLATTENING_GLACIAL_REACH_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96296_FARN_FLATTENING_GLACIAL_REACH_GLOSSARY_HEADWORD.verdict) &&
      IMP96296_FARN_FLATTENING_GLACIAL_REACH_GLOSSARY_HEADWORD.glosses === 'imp-96250',
  },
];

for (const assertion of IMP96296_FARN_FLATTENING_GLACIAL_REACH_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96296-farN-flattening-glacial-reach-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
