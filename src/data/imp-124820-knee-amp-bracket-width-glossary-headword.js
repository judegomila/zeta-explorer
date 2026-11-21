/**
 * @module imp-124820-knee-amp-bracket-width-glossary-headword
 * @fileoverview imp-124820 -- import-light glossary/Concepts headword recording the imp-124771
 *   knee-amplification bracket-width reconciliation: the ~1.3% gap between the imp-97805 discrete
 *   E_flow amplification A ~ 9.54 (bracket width W = 0.25) and the imp-97804 closed-form A ~ 9.42
 *   (the continuous W -> 0 knee) is a finite-BRACKET-WIDTH artifact, not a PPD discretization bias
 *   -- both values are correct at their respective widths.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-124771 held the fine PPD limit (PPD = 120, past the imp-97805
 *   PPD-convergence point) and swept the imp-97805 D2 knee-amplification estimator across the
 *   bracket-width ladder W in {0.25, 0.20, 0.15, 0.125, 0.10}. The amplification A falls
 *   monotonically from A ~ 9.542 at the baseline W = 0.25 (reproducing imp-97805 to < 0.01) to
 *   A ~ 9.397 at the finest bracket W = 0.10, matching the imp-97804 closed-form A ~ 9.42 to
 *   ~0.3% -- a >4x collapse of the ~1.3% baseline residual. A PPD-stability sweep at the finest
 *   bracket (PPD = 40..200) holds A to a ~0.02% spread, exonerating PPD as the source of the gap.
 *   (b) WHY IT IS NEW. imp-97805 fixed the bracket width at W = 0.25 and refined only the OLS
 *   grid density (PPD), reporting W as "the only material knob" without ever pushing it toward
 *   the continuum. imp-124771 is the first leaf to vary W itself at a fine, converged PPD and
 *   show the discrete estimator's W -> 0 limit lands on the imp-97804 closed form.
 *   (c) WHY IT MATTERS. Both A ~ 9.54 (W = 0.25) and A ~ 9.42 (W -> 0) are CORRECT -- at their
 *   own bracket widths. The quarter-decade second difference used as the production estimator
 *   overestimates the curvature amplification by ~1.5% relative to the continuum; the discrepancy
 *   previously read as an unreconciled discrete-vs-closed-form residual is fully explained by that
 *   one discretization scale, with PPD contributing no measurable part of it.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. This is a sensitivity/reconciliation fact about the
 *   imp-33721 sub-decade knee-to-crossover amplification diagnostic. The component model is the
 *   inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic; the C_mb GUE-conditional
 *   per imp-486 is untouched; establishes no operator positivity; imp-3066 K_a >= 0 untouched.
 *   (e) STATUS: documentation only. No bound moved; no new coefficient pinned beyond re-citing the
 *   imp-124771 bracket-width ladder; the rigorous anchor stays the trace ceiling; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   measurement. Not a new derivation. NO QED.
 *
 * @see imp-124771-knee-amp-bracket-width-reconcile.js (source: the bracket-width ladder and
 *   reconciliation this headword names)
 * @see imp-97805-knee-eflow-amplification-ratio (discrete A ~ 9.54, PPD-refined at W = 0.25)
 * @see imp-97804-knee-eflow-linear-expansion (closed-form A ~ 9.42 via the continuous d2p/dt2=0 knee)
 * @see imp-33721-sigma-ramp-inflection-subdecade (the sub-decade knee estimator this amplification is on)
 *
 * Ticket: imp-124820 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The knee-amplification bracket-width headword, baked verbatim (no re-import of the heavy zeros bundle).
const KNEE_AMP_BRACKET_WIDTH_HEADWORD = Object.freeze({
  key: 'knee-amp-bracket-width-imp124771',
  term:
    'Knee-amplification bracket-width reconciliation: the ~1.3% imp-97805-vs-imp-97804 gap ' +
    '(A ~ 9.54 discrete vs A ~ 9.42 closed-form) is a finite-bracket-width artifact, with both ' +
    'values correct at their own widths',
  definition:
    'Holding the imp-97805 D2 knee-amplification estimator at a fine, PPD-converged grid ' +
    '(PPD = 120) and sweeping the bracket width W in {0.25, 0.20, 0.15, 0.125, 0.10}, the ' +
    'amplification A falls MONOTONICALLY from A ~ 9.542 at the baseline W = 0.25 (reproducing ' +
    'imp-97805 to < 0.01) to A ~ 9.397 at the finest bracket W = 0.10, matching the imp-97804 ' +
    'closed-form A ~ 9.42 to ~0.3% -- a >4x collapse of the baseline ~1.3% residual.',
  mechanism:
    'The residual is a finite-BRACKET-WIDTH artifact, not a PPD discretization bias: a ' +
    'PPD-stability sweep at the finest bracket (PPD = 40, 60, 80, 120, 160, 200) holds A to a ' +
    '~0.02% spread, so PPD refinement converges A at every fixed W and contributes no measurable ' +
    'part of the discrete-vs-continuous gap. The continuous closed form IS the W -> 0 limit of the ' +
    'discrete estimator; the production quarter-decade second difference (W = 0.25) overestimates ' +
    'the curvature amplification by ~1.5% because the bracket is too coarse, not because the ' +
    'underlying OLS grid is too sparse. Both A ~ 9.54 (W = 0.25) and A ~ 9.42 (W -> 0) are ' +
    'therefore correct answers to two different, well-defined discretizations of the same quantity.',
  verificationStatus:
    'Re-cited from the imp-124771 measurement module ' +
    '(src/data/imp-124771-knee-amp-bracket-width-reconcile.js): the W = 0.25, PPD = 120 reuse gate ' +
    'reproduces the imp-97805 PPD-refined baseline (A ~ 9.54) to < 0.01; A(W) is monotonically ' +
    'increasing in W across the full ladder; the finest bracket W = 0.10 matches the imp-97804 ' +
    'closed form (A ~ 9.42) to < 0.6%; the residual collapses by > 3x from W = 0.25 to W = 0.10; ' +
    'the finest-bracket PPD sweep has < 0.01 spread. Naming / glossary headword only; supplies no ' +
    'new bound; the C_C 1/8 ansatz and E_trunc/E_flow component model are untouched; RH open; ' +
    'no refereed bound is changed; NO QED.',
});

export const IMP124820_KNEE_AMP_BRACKET_WIDTH_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-124820',
  proofSection: 'S-frontier',
  glosses: 'imp-124771',
  question:
    'imp-124771 reconciled the ~1.3% gap between the imp-97805 discrete knee-amplification ' +
    'A ~ 9.54 (bracket width W = 0.25) and the imp-97804 closed-form A ~ 9.42 (W -> 0) -- what is ' +
    'the headword for the result that this is a finite-bracket-width artifact, with both values ' +
    'correct at their own widths?',
  headword: KNEE_AMP_BRACKET_WIDTH_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-124771 result: the ' +
    'imp-97805 discrete E_flow knee-amplification A ~ 9.54 at bracket width W = 0.25 and the ' +
    'imp-97804 closed-form A ~ 9.42 at the continuous W -> 0 limit are BOTH correct at their own ' +
    'widths -- the ~1.3% gap between them is a finite-bracket-width artifact of the D2 estimator, ' +
    'not a PPD discretization bias, and collapses to ~0.3% when the bracket is refined to W = 0.10 ' +
    'at a fine, PPD-converged grid. No bound moved; the component model and all pinned surrogate ' +
    'constants are untouched; NO QED. No refereed bound is changed.',
  citation:
    'imp-124771 (the bracket-width ladder and reconciliation this glosses); imp-97805 (discrete ' +
    'A ~ 9.54, PPD-refined at W = 0.25); imp-97804 (closed-form A ~ 9.42 via the continuous ' +
    'd2p/dt2 = 0 knee); imp-33721 (sub-decade knee-to-crossover amplification estimator).',
});

export default IMP124820_KNEE_AMP_BRACKET_WIDTH_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124820_KNEE_AMP_BRACKET_WIDTH_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp124820-headword-names-both-values-and-widths',
    why: 'The headword must name both amplification values, their bracket widths, and the ' +
      'residual collapse -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP124820_KNEE_AMP_BRACKET_WIDTH_GLOSSARY_HEADWORD.headword;
      return (
        /9\.542/.test(h.definition) &&
        /9\.397/.test(h.definition) &&
        /W = 0\.25/.test(h.definition) &&
        /W = 0\.10/.test(h.definition) &&
        />4x/.test(h.definition) &&
        /~1\.5%/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp124820-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-124771.',
    holds: () =>
      IMP124820_KNEE_AMP_BRACKET_WIDTH_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP124820_KNEE_AMP_BRACKET_WIDTH_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP124820_KNEE_AMP_BRACKET_WIDTH_GLOSSARY_HEADWORD.verdict) &&
      IMP124820_KNEE_AMP_BRACKET_WIDTH_GLOSSARY_HEADWORD.glosses === 'imp-124771',
  },
];

for (const assertion of IMP124820_KNEE_AMP_BRACKET_WIDTH_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124820-knee-amp-bracket-width-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
