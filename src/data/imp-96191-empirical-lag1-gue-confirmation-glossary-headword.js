/**
 * @module imp-96191-empirical-lag1-gue-confirmation-glossary-headword
 * @fileoverview imp-96191 -- import-light glossary/Concepts headword for the imp-96171
 *   empirical adjacent-box lag-1 confirmation: under a clean unfolded edge-to-edge tiling
 *   the actual Riemann zeros give r1 = -0.5126 at T = 1.5e5, confirming the exact GUE
 *   two-interval proxy rho_exact = -0.46398 (imp-96128), while the imp-95562 raw
 *   variable-width tiling's r1 = +0.243 is a box-overlap artifact, not a real reversal.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96171 closed the imp-96128 empirical-covariance caveat by measuring the sample
 *   lag-1 correlation of the sd(C - E) statistic on the actual 10^6-Odlyzko zeros. A reader
 *   landing on imp-96171 cold has no quick-lookup definition of which tiling gives which
 *   sign, or why the two disagree. This headword bakes that confirmation VERBATIM (no
 *   re-import of the imp-96171 module, to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   At the significant height T = 1.5e5, the empirical lag-1 correlation of the per-box
 *   (C - E) sequence on the actual Riemann zeros depends on the tiling:
 *     - clean unfolded edge-to-edge tiling (290 boxes): r1 = -0.5126, CONFIRMING the exact
 *       GUE two-interval proxy rho_exact = -0.46398 (imp-96128) in sign and magnitude
 *       (difference 0.0486, inside the small-sample band 1.96/sqrt(290) ~ 0.1151).
 *     - imp-95562 raw variable-width tiling (291 boxes): r1 = +0.243, the WRONG sign --
 *       a box-overlap artifact, not a de-correlation reversal.
 *   An L-sweep of the clean tiling (L in {100,200,300,495.78,700,1000}) stays in
 *   [-0.526,-0.433], bracketing the proxy at every scale.
 *
 *   MECHANISM: the raw imp-95562 tiling uses a fixed step 2*Delta(Tc) while each box uses
 *   its local half-width Delta(t) = sqrt(t/2pi); since Delta(t) grows across the +/-30%
 *   span, boxes above the center are wider than the fixed step and OVERLAP, sharing zeros
 *   and injecting spurious POSITIVE correlation. The clean tiling instead uses equal-
 *   unfolded-length boxes via the Riemann-von Mangoldt map N(t), so adjacent boxes are
 *   exactly edge-to-edge -- the direct empirical analog of the sine-kernel two-interval
 *   covariance -- and it restores the GUE-predicted anti-correlation.
 *
 *   STATUS: a MEASUREMENT closing the imp-96128 empirical-covariance caveat. It confirms
 *   the GUE proxy is neither materially under- nor over-stated once the tiling overlap is
 *   removed, and that the true correlation stays on the safe side of the positive flip
 *   threshold rho_crit = 0.57443. Changes no bound; does not raise the ~1.9-sigma
 *   significant-dip confidence (set by excursion depth, not the correlation model).
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96171 empirical lag-1 measurement for quick
 *   reference. It establishes nothing, instantiates no interval, closes no sub-gap beyond
 *   the imp-96128 caveat, moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96171-number-variance-empirical-lag1-vs-gue-proxy (source: the measurement this glosses)
 * @see imp-96128-number-variance-two-interval-covariance-exact (the exact GUE proxy this confirms)
 * @see imp-95562-meansquare-vs-pointwise-gap (the raw tiling whose +0.243 is the overlap artifact)
 *
 * Ticket: imp-96191 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The empirical lag-1 GUE-confirmation headword, baked verbatim (no re-import).
const EMPIRICAL_LAG1_GUE_CONFIRMATION_HEADWORD = Object.freeze({
  key: 'empirical-lag1-gue-confirmation-clean-tiling',
  term:
    'imp-96171 empirical adjacent-box lag-1 confirmation: r1 = -0.5126 under a clean ' +
    'unfolded tiling confirms the GUE proxy rho_exact = -0.46398, while the imp-95562 raw ' +
    'tiling\'s r1 = +0.243 is an overlap artifact',
  definition:
    'At the significant height T = 1.5e5, the sample lag-1 correlation of the per-box ' +
    '(C - E) discrepancy sequence on the actual Riemann zeros is r1 = -0.5126 under a clean ' +
    'unfolded edge-to-edge tiling (290 boxes, L = 495.779), confirming the exact GUE two-' +
    'interval count correlation rho_exact = -0.46398 (imp-96128) in sign and magnitude ' +
    '(difference 0.0486, inside the small-sample band 1.96/sqrt(290) ~ 0.1151). The imp-' +
    '95562 raw variable-width tiling instead gives r1 = +0.243 -- the wrong sign, outside ' +
    'the band. An L-sweep of the clean tiling over L in {100,200,300,495.78,700,1000} stays ' +
    'firmly anti-correlated in [-0.526,-0.433], bracketing the proxy at every scale.',
  mechanism:
    'The raw imp-95562 tiling uses a fixed step 2*Delta(Tc) while each box uses its local ' +
    'half-width Delta(t) = sqrt(t/2pi); since Delta(t) grows across the +/-30% height span, ' +
    'boxes above the center are wider than the fixed step and overlap, sharing zeros and ' +
    'injecting a spurious positive correlation. The clean tiling instead builds equal-' +
    'unfolded-length boxes via the Riemann-von Mangoldt map N(t) = (t/2pi)log(t/2pi) - t/2pi ' +
    '+ 7/8, so adjacent boxes are exactly edge-to-edge -- the direct empirical analog of the ' +
    'sine-kernel two-interval covariance -- which removes the overlap and restores the GUE-' +
    'predicted anti-correlation.',
  verificationStatus:
    'MEASUREMENT closing the imp-96128 empirical-covariance caveat, not a new bound: the ' +
    'empirical correlation stays on the safe side of the positive flip threshold rho_crit = ' +
    '0.57443, exactly as imp-96128 concluded from the proxy alone. Changes no bound; does ' +
    'not raise the ~1.9-sigma significant-dip confidence (set by excursion depth, not the ' +
    'correlation model); no refereed bound is changed; RH open; NO QED.',
});

export const IMP96191_EMPIRICAL_LAG1_GUE_CONFIRMATION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96191',
  proofSection: 'S-frontier',
  glosses: 'imp-96171',
  question:
    'imp-96171 measured the empirical adjacent-box lag-1 correlation of the sd(C - E) ' +
    'statistic on the actual Riemann zeros under two tilings and found opposite signs. What ' +
    'is the confirmed correlation, and why does the raw imp-95562 tiling disagree, for a ' +
    'reader landing on that module cold?',
  headword: EMPIRICAL_LAG1_GUE_CONFIRMATION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96171 empirical ' +
    'lag-1 measurement: clean unfolded tiling r1 = -0.5126 confirms the exact GUE proxy ' +
    'rho_exact = -0.46398 (difference 0.0486, inside the 0.1151 small-sample band), while ' +
    'the imp-95562 raw tiling r1 = +0.243 is a box-overlap artifact of the fixed-step / ' +
    'local-width mismatch. The clean L-sweep stays in [-0.526,-0.433]. Establishes nothing; ' +
    'instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96171 (the empirical measurement this glosses); imp-96128 (the exact GUE proxy ' +
    'this confirms); imp-95562 (the raw tiling whose +0.243 is the overlap artifact).',
});

export default IMP96191_EMPIRICAL_LAG1_GUE_CONFIRMATION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96191_EMPIRICAL_LAG1_GUE_CONFIRMATION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96191-headword-has-required-fields',
    why: 'The headword must name both the confirming clean-tiling r1 and the conflicting ' +
      'raw-tiling r1 -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96191_EMPIRICAL_LAG1_GUE_CONFIRMATION_GLOSSARY_HEADWORD.headword;
      return (
        /-0\.5126/.test(h.definition) &&
        /-0\.46398/.test(h.definition) &&
        /\+0\.243/.test(h.definition) &&
        /0\.57443/.test(h.verificationStatus)
      );
    },
  },
  {
    id: 'imp96191-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96191_EMPIRICAL_LAG1_GUE_CONFIRMATION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96191_EMPIRICAL_LAG1_GUE_CONFIRMATION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96191_EMPIRICAL_LAG1_GUE_CONFIRMATION_GLOSSARY_HEADWORD.verdict) &&
      IMP96191_EMPIRICAL_LAG1_GUE_CONFIRMATION_GLOSSARY_HEADWORD.glosses === 'imp-96171',
  },
];

for (const assertion of IMP96191_EMPIRICAL_LAG1_GUE_CONFIRMATION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96191-empirical-lag1-gue-confirmation-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
