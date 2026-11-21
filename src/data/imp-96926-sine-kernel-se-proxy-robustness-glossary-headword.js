/**
 * @module imp-96926-sine-kernel-se-proxy-robustness-glossary-headword
 * @fileoverview imp-96926 -- import-light Concepts glossary headword recording the imp-96810
 *   exact-sine-kernel SE proxy-robustness result: regenerating the running-min small-gap
 *   exponent ladder from a CORRELATED exact-GUE (determinantal) sample -- rather than the
 *   imp-96774 i.i.d. Wigner-surmise proxy -- shows multi-gap sine-kernel correlations WIDEN the
 *   genuine SE(b) (~1.16x the matched iid SD) rather than narrow it, and the exponent stays at
 *   the cube-root pole c = -1/3 (only ~0.06 SD away). Documentation only; NO QED.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96774 flagged its own honest sub-gap (imp96774-wigner-surmise-iid-proxy): its genuine
 *   SD(b) = 0.056783 (~2.75x the imp-96654 within-realization OLS SE) was measured on an i.i.d.
 *   Wigner-surmise sample that drops exact multi-gap sine-kernel correlations, so the SE
 *   magnitude could in principle have been an artifact of that proxy. imp-96810 closed the
 *   sub-gap by resampling from EXACT GUE via the Dumitriu-Edelman tridiagonal Hermite ensemble
 *   (genuine sine-kernel bulk correlations, no proxy). This headword bakes that closure result
 *   verbatim (no re-import of the imp-96810 module, to stay import-light) so a reader does not
 *   mistake "iid proxy" for a caveat that still needs resolving.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) CORRELATIONS WIDEN, NOT NARROW. At matched N_MAX = 100000 / grid / M = 80 realizations,
 *   the correlated exact-sine-kernel genuine SD(b) = 0.085802 is ~1.1629x the matched iid
 *   Wigner-surmise SD(b) = 0.073786. So the ~2.75x SE inflation of imp-96774 over the imp-96654
 *   OLS SE (0.020615) is PROXY-ROBUST: exact multi-gap correlations preserve it and enlarge the
 *   genuine spread by ~16%, ruling out the "iid proxy inflated the SE" reading.
 *   (b) THE EXACT-GUE EXPONENT IS STILL THE POLE. The correlated mean b = -0.327992 sits only
 *   (b - c)/SD = 0.0623 single-realization SD (0.5568 SE-of-mean) from the cube-root pole
 *   c = -1/3 -- statistically indistinguishable from the pole, matching the imp-96774 iid
 *   reading (-0.3363). Exact sine-kernel correlations do not move the exponent off the pole.
 *   (c) THE REAL-ZEROS RE-SCORE MOVES EVEN CLOSER TO THE POLE. Re-scoring the real-zeros fit
 *   b = -0.395338 against the correlated spread gives (b - c)/SD = -0.723, closer to the pole
 *   than the iid re-score (-1.092) and far from the imp-96654 OLS "-3.006 SE" reading, confirming
 *   the near-pole crossover fragility (imp-96680) under the exact ensemble.
 *   (d) SCOPE. Theoretical GUE (beta = 2) via exact diagonalization, NOT real zeros; N_MAX is
 *   reduced to 100000 (vs 2e6 for the iid full run) with ~30 concatenation seam gaps out of
 *   100000 (negligible, ~3e-4), which does not affect the sign of the widen-vs-narrow result.
 *
 *   STATUS: documentation only -- a glossary headword recording that the imp-96774 SE inflation
 *   is proxy-robust under exact sine-kernel correlations and that the exponent remains
 *   statistically at the cube-root pole. Not a proof, not a new bound, not a resolution of RH.
 *   NO QED.
 *
 * @see imp-96810-sine-kernel-correlated-se.js (source measurement this glosses)
 * @see imp-96774-gmin-exponent-refit-genuine-se.js (the iid-proxy SD 0.0568 / 2.75x inflation)
 * @see imp-96654-gmin-crossover-sensitivity-oscillation.js (the OLS SE = 0.0206 / "3 SE" reading)
 * @see imp-96680-crossover-near-pole-fragility-glossary-headword.js (near-pole fragility headword)
 *
 * Ticket: imp-96926 (content, low, sonnet-4-6). Documentation only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

// The sine-kernel SE proxy-robustness headword, baked verbatim (no re-import).
const SINE_KERNEL_SE_PROXY_ROBUSTNESS_HEADWORD = Object.freeze({
  key: 'sine-kernel-se-proxy-robustness-imp96810-closes-imp96774',
  term:
    'imp-96810 closed the imp-96774 iid-proxy honest sub-gap: exact sine-kernel (correlated) ' +
    'GUE sampling WIDENS the genuine running-min exponent SE(b) by ~1.16x over the matched iid ' +
    'Wigner-surmise SD, and leaves the exponent at the cube-root pole c = -1/3',
  definition:
    'imp-96774 measured a genuine single-realization SD(b) = 0.056783 for the running-min ' +
    'small-gap exponent (~2.75x the imp-96654 OLS SE = 0.020615), but drew its sample from ' +
    'i.i.d. Wigner-surmise gaps that drop exact multi-gap sine-kernel correlations. imp-96810 ' +
    'regenerated the same ladder from exact GUE (Dumitriu-Edelman tridiagonal Hermite ensemble, ' +
    'genuine sine-kernel correlations) at matched N_MAX = 100000 / grid / M = 80, obtaining ' +
    'correlated SD(b) = 0.085802 versus a matched iid control SD(b) = 0.073786 -- ratio 1.1629.',
  mechanism:
    'The matched-iid control at the SAME reduced N_MAX isolates the effect of correlations ' +
    'alone: correlated SD (0.085802) exceeds matched-iid SD (0.073786), so exact multi-gap ' +
    'sine-kernel correlations ENLARGE the genuine spread rather than shrink it, ruling out the ' +
    '"iid proxy inflated the SE" reading. The correlated mean b = -0.327992 remains only 0.0623 ' +
    'SD (0.5568 SE-of-mean) from the pole c = -1/3, matching the iid reading (-0.3363); ' +
    're-scored against the correlated spread the real-zeros fit b = -0.395338 sits -0.723 SD ' +
    'from the pole (vs -1.092 SD under iid and -3.006 SE under the imp-96654 OLS estimate).',
  verificationStatus:
    'Re-cited from the imp-96810 module (src/data/imp-96810-sine-kernel-correlated-se.js), ' +
    'itself reproduced by tmp/imp-96810-sine-kernel-se.py (scipy eigvalsh_tridiagonal, ' +
    '~336 s, 80 realizations). Theoretical exact GUE, not real zeros. Glossary headword only; ' +
    'resolves no new interval; establishes no operator or zero-side result; RH open; ' +
    'no refereed bound is changed; NO QED.',
});

export const IMP96926_SINE_KERNEL_SE_PROXY_ROBUSTNESS_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96926',
  proofSection: 'S-frontier',
  glosses: 'imp-96810',
  closesSubGapOf: 'imp-96774',
  question:
    'imp-96774 flagged that its genuine SE(b) = 0.056783 (~2.75x the imp-96654 OLS SE) was ' +
    'measured on an i.i.d. Wigner-surmise proxy that drops exact multi-gap sine-kernel ' +
    'correlations. Does resampling from exact correlated GUE widen or narrow that SE, and does ' +
    'the exponent stay at the cube-root pole c = -1/3?',
  headword: SINE_KERNEL_SE_PROXY_ROBUSTNESS_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Records that imp-96810 closed the ' +
    'imp-96774 iid-proxy honest sub-gap: exact sine-kernel correlations WIDEN the genuine SE(b) ' +
    'by ~1.16x over the matched iid control (0.085802 vs 0.073786), so the ~2.75x SE inflation ' +
    'over the imp-96654 OLS SE is proxy-robust, and the exact-GUE exponent stays within ~0.06 SD ' +
    'of the cube-root pole c = -1/3. No bound moved; theoretical GUE, not real zeros; the ' +
    'imp-96616 consequence (beating 1/log^2 needs the unproved GUE cube-root law) is unchanged; ' +
    'RH open; NO QED; no refereed bound is changed.',
  citation:
    'imp-96810 (the sine-kernel correlated-SE measurement this glosses); imp-96774 (iid-proxy ' +
    'SD 0.0568 / 2.75x inflation / the sub-gap closed here); imp-96654 (OLS SE = 0.0206); ' +
    'imp-96680 (near-pole fragility headword).',
});

export default IMP96926_SINE_KERNEL_SE_PROXY_ROBUSTNESS_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96926_SINE_KERNEL_SE_PROXY_ROBUSTNESS_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96926-headword-cites-widen-ratio-and-pole',
    why: 'The headword must name the widen-not-narrow ratio (~1.16x) and the pole distance -- ' +
      'the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96926_SINE_KERNEL_SE_PROXY_ROBUSTNESS_GLOSSARY_HEADWORD.headword;
      return (
        /1\.1629/.test(h.definition) &&
        /0\.085802/.test(h.definition) &&
        /0\.073786/.test(h.definition) &&
        /-1\/3/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96926-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, sub-gap closure named, no QED, no-refereed-bound-change ' +
      'line present.',
    holds: () =>
      IMP96926_SINE_KERNEL_SE_PROXY_ROBUSTNESS_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96926_SINE_KERNEL_SE_PROXY_ROBUSTNESS_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96926_SINE_KERNEL_SE_PROXY_ROBUSTNESS_GLOSSARY_HEADWORD.verdict) &&
      IMP96926_SINE_KERNEL_SE_PROXY_ROBUSTNESS_GLOSSARY_HEADWORD.glosses === 'imp-96810' &&
      IMP96926_SINE_KERNEL_SE_PROXY_ROBUSTNESS_GLOSSARY_HEADWORD.closesSubGapOf === 'imp-96774',
  },
];

for (const assertion of IMP96926_SINE_KERNEL_SE_PROXY_ROBUSTNESS_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96926-sine-kernel-se-proxy-robustness-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
