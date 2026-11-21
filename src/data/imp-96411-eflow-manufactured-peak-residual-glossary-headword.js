/**
 * @module imp-96411-eflow-manufactured-peak-residual-glossary-headword
 * @fileoverview imp-96411 -- import-light glossary/Concepts headword for the imp-96266
 *   result: the imp-96151/imp-96176 closed-form conditional-share model sigma_CF(N) omits
 *   E_flow, and the omitted piece has the EXACT closed form
 *   R(N) = sigma_full - sigma_CF = -sigma_full(N) * E_flow(N) / (E_trunc + E_coll(N))
 *   (an algebraic identity to ~1e-16, not a fitted residual). Because E_flow/E_N falls
 *   steeply across the U-shape region, this differential suppression is what MANUFACTURES
 *   the imp-3220 interior peak out of an otherwise monotone-decreasing two-term share.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96266 measured the residual identity and the peak-recovery accuracy of
 *   re-applying it, but left no standalone quick-lookup entry for a reader who only
 *   wants the headline claim: the dropped E_flow term is not a small correction the
 *   closed form can ignore -- it is the mechanism that creates the peak. This headword
 *   bakes that verbatim (no re-import of the imp-96266/imp-96151/imp-3220 modules, to
 *   stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   R(N) = sigma_full - sigma_CF = -sigma_full(N) * E_flow(N)/(E_trunc + E_coll(N)),
 *   reproduced to ~1.5e-16 (an exact identity: sigma_CF coincides with the E_flow-dropped
 *   two-term share to machine epsilon). E_flow sits in the denominator so R < 0 always --
 *   E_flow strictly SUPPRESSES the share. The fractional suppression E_flow/E_N falls from
 *   1.38e-1 at N=1e3 to 3.06e-2 at the peak (N ~ 9.22e5) to 1.22e-5 at N=1e12: strong on
 *   the left arm, vanishing past the crossover. That differential shape bends the
 *   monotone-decreasing two-term share into the rising-then-falling imp-3220 U-shape.
 *   Re-applying the correction to sigma_CF recovers the interior maximum to 9.2e-4 in
 *   height and ~9% in location.
 *
 *   MECHANISM: the peak is not a feature of the crossover/collapse competition the closed
 *   form models -- it is a Gronwall-flow feature, cleanly separable from it. The closed
 *   form's fixed point N_cross (~3.28e9) plays no role in where the peak sits; the peak
 *   location is set by where E_flow's suppression stops falling fast enough to keep
 *   pulling the share down.
 *
 *   STATUS: a measurement (frontier-direction), not a rigorous asymptotic. The component
 *   model is the inherited imp-3220/imp-3406/imp-33723 extrapolation; the C_mb
 *   GUE-conditional per imp-486 stays untouched.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96266 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96266-eflow-peak-recovery-residual (source: the residual identity and peak-recovery measurement this glosses)
 * @see imp-96151-sigma-closed-form-crossover-fartail-reproduction (closed-form share model; peak omitted)
 * @see imp-96176-sigma-closed-form-ladder-viz-data (caption: peak is an E_flow effect the crossover model omits)
 * @see imp-3220-en-bridge-fidelity-frontier (interior peak sigma_max ~ 0.9494 at N ~ 9.22e5)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 *
 * Ticket: imp-96411 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The manufactured-peak headword, baked verbatim (no re-import).
const EFLOW_MANUFACTURED_PEAK_HEADWORD = Object.freeze({
  key: 'eflow-manufactured-peak-residual-identity',
  term:
    'imp-96266 verdict: the imp-3220 conditional-share U-shape interior peak is manufactured ' +
    'by the E_flow term the imp-96151 closed-form model omits',
  definition:
    'The residual between the full three-term share and the closed-form two-term ' +
    'approximation, R(N) = sigma_full - sigma_CF, has the exact closed form ' +
    'R(N) = -sigma_full(N) * E_flow(N) / (E_trunc + E_coll(N)) (an algebraic identity to ' +
    '~1.5e-16, not a fit). E_flow sits in the denominator, so R is strictly negative: ' +
    'E_flow always suppresses the share.',
  mechanism:
    'E_flow/E_N falls steeply across the U-shape region -- 1.38e-1 at N=1e3, 5.70e-2 at ' +
    '1e5, 3.06e-2 at the peak (N ~ 9.22e5), 1.40e-2 at 1e7, 1.22e-5 at 1e12. Strong-left/' +
    'weak-right suppression bends the monotone-decreasing two-term share into the rising-' +
    'then-falling full share, converting a share with NO interior maximum into the ' +
    'imp-3220 U-shape peak (sigma_max ~ 0.949429 at N ~ 9.22e5). Re-applying the ' +
    'suppression to the closed-form baseline recovers the peak to 9.2e-4 in height and ' +
    '~9% in location, confirming the peak is a Gronwall-flow feature, cleanly separable ' +
    'from the crossover/collapse competition the closed form models.',
  verificationStatus:
    'Measurement (frontier-direction), conditional-share diagnostic, not a rigorous ' +
    'asymptotic. Component model is the inherited imp-3220/imp-3406/imp-33723 ' +
    'extrapolation; the C_mb GUE-conditional per imp-486 stays untouched. Changes no ' +
    'bound; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96411_EFLOW_MANUFACTURED_PEAK_RESIDUAL_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96411',
  proofSection: 'S-frontier',
  glosses: 'imp-96266',
  question:
    'imp-96266 measured the residual between the imp-3220 full three-term conditional ' +
    'share and the imp-96151 closed-form approximation that omits E_flow. What is that ' +
    'residual, and how does it build the U-shape interior peak the closed form misses?',
  headword: EFLOW_MANUFACTURED_PEAK_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96266 verdict: ' +
    'R(N) = sigma_full - sigma_CF = -sigma_full(N)*E_flow(N)/(E_trunc+E_coll(N)) is an ' +
    'exact identity (not a fit), strictly negative, and differentially strong on the left ' +
    'arm of the U-shape -- this is what manufactures the imp-3220 interior peak out of an ' +
    'otherwise monotone-decreasing two-term share. Establishes nothing; instantiates no ' +
    'interval; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96266 (the residual identity and peak-recovery measurement this glosses); ' +
    'imp-96151 (closed-form share model; peak omitted); imp-96176 (caption attributing ' +
    'the peak to E_flow); imp-3220 (interior peak landmark); imp-486 (C_mb GUE-conditional).',
});

export default IMP96411_EFLOW_MANUFACTURED_PEAK_RESIDUAL_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96411_EFLOW_MANUFACTURED_PEAK_RESIDUAL_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96411-headword-has-required-fields',
    why: 'The headword must name the residual identity, its sign, and the peak-recovery ' +
      'accuracy numbers -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96411_EFLOW_MANUFACTURED_PEAK_RESIDUAL_GLOSSARY_HEADWORD.headword;
      return (
        /E_flow\(N\) \/ \(E_trunc \+ E_coll\(N\)\)/.test(h.definition) &&
        /strictly negative/.test(h.definition) &&
        /9\.2e-4/.test(h.mechanism) &&
        /9%/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96411-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96411_EFLOW_MANUFACTURED_PEAK_RESIDUAL_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96411_EFLOW_MANUFACTURED_PEAK_RESIDUAL_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96411_EFLOW_MANUFACTURED_PEAK_RESIDUAL_GLOSSARY_HEADWORD.verdict) &&
      IMP96411_EFLOW_MANUFACTURED_PEAK_RESIDUAL_GLOSSARY_HEADWORD.glosses === 'imp-96266',
  },
];

for (const assertion of IMP96411_EFLOW_MANUFACTURED_PEAK_RESIDUAL_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96411-eflow-manufactured-peak-residual-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
