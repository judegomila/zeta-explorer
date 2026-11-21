/**
 * @module imp-96659-lammax-slope-saturation-glossary-headword
 * @fileoverview imp-96659 -- import-light glossary/Concepts headword for the imp-96636
 *   saturation-model finding: the rank-r Route M lam_max log-slope sequence b_r climbs
 *   toward the measured target 0.3526253785070698 in a SIGMOIDAL (logistic), not
 *   single-exponential, shape -- half-saturation rank r0 = 2.940802, width k = 0.863214,
 *   r2 = 0.996115.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96612 measured the rank-r moment-ratio log-slopes b_r converging toward the
 *   imp-96443 measured coefficient. imp-96636 asked which saturation curve describes
 *   that convergence, fitting three candidate models with scipy curve_fit
 *   (tmp/imp-96636-saturation-fit.py) and found the single-exponential ansatz -- both
 *   fixed-amplitude and free-amplitude variants -- systematically underfits, while a
 *   logistic captures the curvature almost exactly. This headword bakes that verdict
 *   verbatim (no re-import of the imp-96636 module, to stay import-light) as a
 *   standalone quick-lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   Fit b_r (r=0..11) toward target L = 0.3526253785070698 with three models:
 *   (1) fixed-amplitude exponential b_r = L(1-e^{-r/r0}): r0=3.222852, r2=0.919383,
 *   rmse=0.037183, maxResid=0.077454 (at r=1) -- S-shaped residuals, goodFit=false;
 *   the IMPLIED per-rung r0 DRIFTS non-constant from 20.72 (r=1) down to 1.56 (r=11),
 *   the diagnostic signature of wrong curvature.
 *   (2) free-amplitude exponential b_r = A(1-e^{-r/r0}): A=0.41498 (overshoots L,
 *   unphysical), r0=4.548018, r2=0.944007, goodFit=false.
 *   (3) logistic b_r = L/(1+e^{-(r-r0)/k}): half-saturation rank r0=2.940802, width
 *   k=0.863214, r2=0.996115, rmse=0.008163, maxResid=0.017060 -- goodFit=true.
 *   Why the single exponential fails: it rises FASTEST at r=0, but a rank-one
 *   surrogate alone (imp-96586) contributes only b_1/L ~ 4.7% of the target -- there is
 *   no fast-start component for a pure exponential to match, so the onset is delayed
 *   (sigmoidal) rather than front-loaded. modeCountFor90pct = 6 collective modes needed
 *   to reach 90% of the target slope.
 *
 *   STATUS: sharpens (does not close) the imp-96562 numerical-pinnability sub-gap by
 *   naming the correct functional form of the mode-accumulation curve. Establishes no
 *   operator positivity, closes no analytic gap. NO QED. No refereed bound is changed.
 *
 * @see imp-96636-route-m-lammax-slope-saturation-fit.js (source: the fits this glosses)
 * @see imp-96612-route-m-lammax-rankr-power-iteration-bracket.js (the underlying b_r sequence)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (the measured target slope 0.3526253785070698)
 * @see imp-96562-route-m-lammax-offdiagonal-szego-assessment.js (names IMP96562_SUBGAP this sharpens)
 * @see imp-96647-vasyunin-lammax-collective-rank-glossary-headword.js (sibling headword on the same rank-r sequence, mode-count framing)
 *
 * Ticket: imp-96659 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The saturation-model headword, baked verbatim (no re-import).
const LAMMAX_SLOPE_SATURATION_HEADWORD = Object.freeze({
  key: 'lammax-slope-onset-is-sigmoidal-not-exponential',
  term:
    'imp-96636 verdict: the rank-r Route M lam_max log-slope b_r approaches its ' +
    'measured target 0.3526 in a SIGMOIDAL (logistic) shape, half-saturation rank ' +
    'r0 ~ 2.94, width k ~ 0.86 (r2 = 0.996) -- a single-exponential saturation ansatz ' +
    'systematically underfits (r2 <= 0.944) because it rises fastest at r=0 while the ' +
    'true onset is delayed',
  definition:
    'The rank-r power-iteration moment-ratio log-slope sequence b_r (r=0..11, imp-96612) ' +
    'converges toward the measured leading coefficient b_meas = 0.3526253785070698 ' +
    '(imp-96443). Fitting this sequence with a fixed-amplitude single exponential ' +
    'b_r = L(1-e^{-r/r0}) gives r2 = 0.919383 with S-shaped residuals and an implied ' +
    'per-rung time-constant that drifts non-constant from r0~20.72 (at r=1) down to ' +
    'r0~1.56 (at r=11) -- the standard diagnostic that the curve has the wrong ' +
    'curvature. A free-amplitude exponential does little better (r2 = 0.944007) and ' +
    'overshoots the physical amplitude (fitted A = 0.41498 > L). A LOGISTIC ' +
    'b_r = L/(1+e^{-(r-r0)/k}) fits almost exactly: half-saturation rank r0 = 2.940802, ' +
    'width k = 0.863214, r2 = 0.996115, max residual 0.0171.',
  mechanism:
    'Why the exponential fails: it is front-loaded (fastest rise at r=0), but the ' +
    'rank-one surrogate (imp-96586, r=1) already captures only b_1/L ~ 4.7% of the ' +
    'target slope -- there is no fast-start component for a pure exponential to match, ' +
    'so the accumulation is delayed/sigmoidal rather than front-loaded. ' +
    'modeCountFor90pct = 6 collective off-diagonal power-iteration modes are needed to ' +
    'reach 90% of the target slope, consistent with the imp-96612/imp-96647 rank-~6 ' +
    'collective-mode finding. Fit source: tmp/imp-96636-saturation-fit.py (scipy ' +
    'curve_fit) against the frozen IMP96636_BR_SEQUENCE.',
  verificationStatus:
    'Sharpens (does not close) the imp-96562 numerical-pinnability sub-gap by naming ' +
    'the functional FORM of the mode-accumulation curve. Not a closed-form/averaged-' +
    'symbol asymptotic prediction of the 0.3526 coefficient itself. Changes no bound; ' +
    'establishes no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96659_LAMMAX_SLOPE_SATURATION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96659',
  proofSection: 'S-frontier',
  glosses: 'imp-96636',
  question:
    'imp-96636 asked which saturation curve best describes the rank-r lam_max ' +
    'log-slope sequence b_r converging toward its measured target, and why a ' +
    'single-exponential ansatz underfits it.',
  headword: LAMMAX_SLOPE_SATURATION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96636 ' +
    'verdict: a logistic b_r = L/(1+e^{-(r-r0)/k}) with half-saturation rank ' +
    'r0 = 2.940802 and width k = 0.863214 fits the sequence (r2 = 0.996115), while both ' +
    'fixed- and free-amplitude single exponentials underfit (r2 <= 0.944) with a ' +
    'non-constant implied time-constant -- the onset is sigmoidal/delayed because a ' +
    'rank-one surrogate alone captures only ~4.7% of the target slope. Establishes ' +
    'nothing; instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96636 (the saturation-model fits this glosses); imp-96612 (the underlying ' +
    'rank-r log-slope sequence b_r); imp-96443 (the measured target slope ' +
    '0.3526253785070698); imp-96586 (the rank-one one-step proxy, ~4.7% of target); ' +
    'imp-96562 (the numerical-pinnability sub-gap this sharpens).',
});

export default IMP96659_LAMMAX_SLOPE_SATURATION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96659_LAMMAX_SLOPE_SATURATION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96659-headword-has-required-fields',
    why: 'The headword must name the logistic parameters (r0 ~ 2.94, k ~ 0.86) and why ' +
      'the single-exponential ansatz fails -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96659_LAMMAX_SLOPE_SATURATION_GLOSSARY_HEADWORD.headword;
      return (
        /SIGMOIDAL/.test(h.term) &&
        /2\.940802/.test(h.definition) &&
        /0\.863214/.test(h.definition) &&
        /0\.3526253785070698/.test(h.definition) &&
        /4\.7%/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96659-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96659_LAMMAX_SLOPE_SATURATION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96659_LAMMAX_SLOPE_SATURATION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96659_LAMMAX_SLOPE_SATURATION_GLOSSARY_HEADWORD.verdict) &&
      IMP96659_LAMMAX_SLOPE_SATURATION_GLOSSARY_HEADWORD.glosses === 'imp-96636',
  },
];

for (const assertion of IMP96659_LAMMAX_SLOPE_SATURATION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96659-lammax-slope-saturation-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
