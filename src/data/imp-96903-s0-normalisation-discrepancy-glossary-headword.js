/**
 * @module imp-96903-s0-normalisation-discrepancy-glossary-headword
 * @fileoverview imp-96903 -- import-light glossary/Concepts headword recording the OPEN
 *   imp-96796 s0 normalisation discrepancy: imp-96770 STEP 3 quotes an inline "sharp
 *   measured s0 ~ 0.76 for this kernel" while imp-96750's top-window Q(b)/b measurement
 *   gives s0 ~ 1.751 -- a ~2.3x gap between the two orphan modules' candidate values for
 *   the same limit constant s0 = lim_{b->oo} Q(b)/b.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96796 checked whether the imp-96770 homogeneous envelope numerically brackets the
 *   imp-96750 s0 candidate from above, and found that it does -- ROBUSTLY, because the
 *   envelope constant 5 K^2 ~ 7.94 exceeds BOTH cited values (0.76 and 1.751) from above.
 *   That robustness let imp-96796 close its own above-bracket question WITHOUT resolving
 *   which of the two cited s0 values (if either) is the correct sharp constant. This
 *   headword bakes that leftover discrepancy verbatim (no re-import of the imp-96796
 *   module, to stay import-light) so a reader does not conflate "the above-bracket verdict
 *   is robust" (true) with "the s0 normalisation question is settled" (false -- it remains
 *   open).
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) TWO CITED VALUES FOR ONE LIMIT. s0 = lim_{b->oo} Q(b)/b, Q(b) = Sum_{a=2,
 *   (a,b)=1}^{b-1} I(a,b)^2/a^2, is a single well-defined limit constant. imp-96770 STEP 3
 *   quotes an inline "sharp measured s0 ~ 0.76 for this kernel"; imp-96750's own top-window
 *   Q(b)/b means (b in [100,1200)) climb 1.690, 1.729, 1.745, 1.751, extrapolating to
 *   s0 ~ 1.751. The ratio 1.751 / 0.76 ~ 2.30.
 *   (b) NEITHER VALUE IS DISPLACED BY imp-96796. imp-96796's own measurement only needed
 *   an UPPER bracket; the homogeneous envelope constant 5 K^2 ~ 7.94 (K ~ 1.26 measured)
 *   dominates both 0.76 (ratio ~10.44) and 1.751 (ratio ~4.53), so imp-96796's above-bracket
 *   conclusion holds regardless of which cited value is sharp -- but that robustness is a
 *   reason the discrepancy was never adjudicated, not evidence that it was.
 *   (c) STATUS: open bookkeeping question, not a numerical defect in either source module.
 *   Whether the gap is a genuine kernel-normalisation difference (e.g. different weighting
 *   or a different sub-range of a averaged into "this kernel" in imp-96770 STEP 3) or a
 *   transcription slip in one of the two modules is unresolved. No downstream bound depends
 *   on which value is correct, since only the above-bracket direction is used anywhere.
 *
 *   STATUS: documentation only -- a naming/bookkeeping note recording an unresolved ~2.3x
 *   discrepancy between two cited candidate values for the same s0 limit. Not a proof, not
 *   a new bound, not a resolution of which value (if either) is sharp. NO QED.
 *
 * @see imp-96796-route-m-homogeneous-envelope-s0-upper-bracket.js (source measurement: the
 *   IMP96796_DISCREPANCY field this glosses, and the robust above-bracket verdict)
 * @see imp-96770-route-m-weighted-cotangent-homogeneous-envelope.js (STEP 3 inline s0 ~ 0.76)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction.js (top-window s0 ~ 1.751)
 *
 * Ticket: imp-96903 (content, low, sonnet-4-6). Documentation only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

// The s0 normalisation discrepancy headword, baked verbatim (no re-import).
const S0_NORMALISATION_DISCREPANCY_HEADWORD = Object.freeze({
  key: 's0-normalisation-discrepancy-imp96770-vs-imp96750-open',
  term:
    'imp-96796 flagged (but did not resolve) a ~2.3x normalisation discrepancy between two ' +
    'cited candidate values of the same limit constant s0 = lim_{b->oo} Q(b)/b: imp-96770 ' +
    'STEP 3 inline "sharp measured s0 ~ 0.76 for this kernel" versus imp-96750 top-window ' +
    'Q(b)/b -> s0 ~ 1.751',
  definition:
    'Two orphan modules cite two different numbers for the same well-defined limit ' +
    's0 = lim_{b->oo} Q(b)/b, Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2/a^2: imp-96770 STEP 3 ' +
    'gives an inline sharp value s0 ~ 0.76 "for this kernel", while imp-96750 measures the ' +
    'top-window Q(b)/b means 1.690, 1.729, 1.745, 1.751 (b in [100,1200)) and extrapolates ' +
    's0 ~ 1.751. Ratio 1.751 / 0.76 ~ 2.30.',
  mechanism:
    'imp-96796 needed only an UPPER bracket for s0, and the imp-96770 homogeneous envelope ' +
    'constant 5 K^2 ~ 7.94 (K ~ 1.26 measured) exceeds both cited values -- ratio ~10.44 ' +
    'over 0.76 and ~4.53 over 1.751 -- so imp-96796s above-bracket conclusion is robust to ' +
    'the discrepancy in either direction. That robustness is exactly why the discrepancy ' +
    'could be left open rather than adjudicated: no downstream above-bracket claim turns on ' +
    'which of the two values (if either) is the true sharp s0.',
  verificationStatus:
    'Re-cited from the imp-96796 IMP96796_DISCREPANCY field ' +
    '(src/data/imp-96796-route-m-homogeneous-envelope-s0-upper-bracket.js), which itself ' +
    'cites imp-96770 STEP 3 and the imp-96750 top-window means verbatim. Naming / ' +
    'bookkeeping headword only; resolves no new interval; establishes no operator or ' +
    'zero-side result; does not determine which of 0.76 or 1.751 is the correct sharp s0; ' +
    'RH open; no refereed bound is changed; NO QED.',
});

export const IMP96903_S0_NORMALISATION_DISCREPANCY_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96903',
  proofSection: 'S-frontier',
  glosses: 'imp-96796',
  question:
    'imp-96796 noted that imp-96770 STEP 3 cites an inline sharp s0 ~ 0.76 while imp-96750 ' +
    'measures a top-window s0 ~ 1.751 for the same limit constant. Which one is right, and ' +
    'does the open gap between them affect any bound?',
  headword: S0_NORMALISATION_DISCREPANCY_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Records the open imp-96796 s0 ' +
    'normalisation discrepancy: imp-96770 STEP 3 (sharp s0 ~ 0.76) versus imp-96750 (top-' +
    'window s0 ~ 1.751) differ by a factor ~2.30, and imp-96796 left the discrepancy ' +
    'unresolved because its own above-bracket verdict (envelope constant 5 K^2 ~ 7.94 ' +
    'dominates both cited values) is robust to it either way. No bound moved; which value ' +
    '(if either) is the correct sharp s0 remains open; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96796 (the IMP96796_DISCREPANCY field this glosses and the robust above-bracket ' +
    'verdict); imp-96770 (STEP 3 inline s0 ~ 0.76); imp-96750 (top-window s0 ~ 1.751).',
});

export default IMP96903_S0_NORMALISATION_DISCREPANCY_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96903_S0_NORMALISATION_DISCREPANCY_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96903-headword-cites-both-s0-values',
    why: 'The headword must name both cited s0 values and the ~2.3x ratio between them -- ' +
      'the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96903_S0_NORMALISATION_DISCREPANCY_GLOSSARY_HEADWORD.headword;
      return (
        /0\.76/.test(h.definition) &&
        /1\.751/.test(h.definition) &&
        /2\.30/.test(h.definition) &&
        /robust/i.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96903-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, discrepancy left open, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96903_S0_NORMALISATION_DISCREPANCY_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96903_S0_NORMALISATION_DISCREPANCY_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96903_S0_NORMALISATION_DISCREPANCY_GLOSSARY_HEADWORD.verdict) &&
      /remains open/.test(IMP96903_S0_NORMALISATION_DISCREPANCY_GLOSSARY_HEADWORD.verdict) &&
      IMP96903_S0_NORMALISATION_DISCREPANCY_GLOSSARY_HEADWORD.glosses === 'imp-96796',
  },
];

for (const assertion of IMP96903_S0_NORMALISATION_DISCREPANCY_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96903-s0-normalisation-discrepancy-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
