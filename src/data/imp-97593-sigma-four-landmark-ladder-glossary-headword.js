/**
 * @module imp-97593-sigma-four-landmark-ladder-glossary-headword
 * @fileoverview imp-97593 -- import-light glossary/Concepts headword recording the imp-97520
 *   sigma(N) = E_coll/E_N conditional-share four-landmark ladder (peak / below-0.9 / halving /
 *   below-0.1), tabulated as one strictly-increasing object spanning ~5.54 decades, plus the
 *   ~0.4% halving-vs-N_cross E_flow offset it re-measures at a common precision.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-97520 recomputed four previously-scattered roadmap landmarks of the
 *   conditional share sigma(N) = E_coll/(E_trunc + E_flow + E_coll) from the exact inherited
 *   imp-3406/imp-33582 sub-terms and tabulated them as one object: L1 the interior PEAK
 *   (N ~ 9.218633e5, sigma_max ~ 0.949429), L2 the downslope crossing BELOW 0.9 (N ~ 2.572361e7),
 *   L3 the HALVING crossing sigma = 1/2 (N ~ 3.267235e9), and L4 the downslope crossing BELOW 0.1
 *   (N ~ 3.213181e11) -- strictly increasing, spanning ~5.54 decades from peak to tail.
 *   (b) THE HALVING CROSS-VALIDATION. Measured at this same common precision, the ladder halving
 *   landmark N_half sits (N_cross - N_half)/N_cross ~ 3.98e-3 (~0.4%) below the imp-33723
 *   closed-form fixed point N_cross ~ 3.280294e9. By the imp-33601 identity
 *   sigma = 1/2 <=> E_coll = E_trunc + E_flow, that residual is exactly the Gronwall flow term:
 *   E_flow/E_trunc ~ 1.91e-3 at N_half, the same attribution imp-33723/imp-33601 already made,
 *   now reproduced from the tabulated ladder rather than from a separately-bisected landmark.
 *   (c) WHY IT IS NEW. Before imp-97520 the four numbers lived in three different modules
 *   (imp-33582, imp-3406, imp-33723) as scattered prose; this is the first module to tabulate all
 *   four together and re-run the halving cross-check against the closed form at a shared precision.
 *   (d) WHY IT CHANGES NOTHING. No new sub-term, no new constant: same C_C 1/8 ansatz
 *   (imp-2642/imp-2643), same C_mb GUE-conditional per imp-486, same inherited imp-3220/imp-3406
 *   surrogate. It is a tabulation and cross-validation of already-established landmarks, not a
 *   new derivation.
 *   (e) STATUS: documentation only. No new bound; no operator positivity; RH open; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   result. Not a new derivation. NO QED.
 *
 * @see imp-97520-sigma-conditional-share-landmark-ladder.js (source: the four-landmark tabulation
 *   and halving cross-validation this headword names)
 * @see imp-33723-sigma-half-vs-crossover-closed-form.js (closed-form N_cross fixed point)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset.js (identity sigma=1/2 <=> E_coll=E_trunc+E_flow)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay.js (F3: sigma=1/2 halving landmark)
 * @see imp-3406-sigma-highN-extrapolation.js (the inherited sigma(N) component model)
 *
 * Ticket: imp-97593 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The sigma(N) four-landmark-ladder headword, baked verbatim (no re-import).
const SIGMA_FOUR_LANDMARK_LADDER_HEADWORD = Object.freeze({
  key: 'sigma-conditional-share-four-landmark-ladder-imp97520',
  term:
    'sigma(N) four-landmark ladder: the peak / below-0.9 / halving / below-0.1 crossings of the ' +
    'conditional share tabulated as one strictly-increasing object, with the halving landmark ' +
    're-cross-validated against the imp-33723 closed form',
  definition:
    'For sigma(N) = E_coll / (E_trunc + E_flow + E_coll), four landmarks recomputed from the exact ' +
    'inherited imp-3406/imp-33582 sub-terms: L1 interior peak (N ~ 9.218633e5, sigma_max ~ 0.949429), ' +
    'L2 downslope crossing below 0.9 (N ~ 2.572361e7), L3 halving crossing sigma = 1/2 ' +
    '(N ~ 3.267235e9, the imp-33582 F3 landmark), and L4 downslope crossing below 0.1 ' +
    '(N ~ 3.213181e11), strictly increasing and spanning ~5.54 decades.',
  mechanism:
    'The halving landmark L3 sits (N_cross - N_half)/N_cross ~ 3.98e-3 (~0.4%) below the imp-33723 ' +
    'closed-form fixed point N_cross ~ 3.280294e9. By the imp-33601 identity ' +
    'sigma = 1/2 <=> E_coll = E_trunc + E_flow, the offset is exactly the Gronwall flow term: ' +
    'E_flow/E_trunc ~ 1.91e-3 at N_half. Before this ladder the four numbers were scattered across ' +
    'three separate modules (imp-33582, imp-3406, imp-33723) as prose; this tabulates them together ' +
    'and re-runs the halving-vs-closed-form check at a common precision, reproducing the same ' +
    'E_flow attribution imp-33723/imp-33601 already made.',
  verificationStatus:
    'Re-cited from the imp-97520 derivation module ' +
    '(src/data/imp-97520-sigma-conditional-share-landmark-ladder.js). Measurement / verification ' +
    'cross-check only on the inherited imp-3220/imp-3406 surrogate component model, not a rigorous ' +
    'asymptotic; C_mb GUE-conditional per imp-486 untouched; C_C 1/8 ansatz (imp-2642/imp-2643) ' +
    'untouched. Naming / glossary headword only; supplies no new bound; RH open; ' +
    'no refereed bound is changed; NO QED.',
});

export const IMP97593_SIGMA_FOUR_LANDMARK_LADDER_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97593',
  proofSection: 'S-frontier',
  glosses: 'imp-97520',
  question:
    'imp-97520 tabulated the sigma(N) peak / below-0.9 / halving / below-0.1 landmark ladder as one ' +
    'strictly-increasing object and re-measured the ~0.4% halving-vs-N_cross E_flow offset at a ' +
    'common precision -- the first time these four scattered roadmap landmarks were assembled ' +
    'together. What is the headword for this result?',
  headword: SIGMA_FOUR_LANDMARK_LADDER_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97520 sigma(N) ' +
    'four-landmark ladder (peak ~9.22e5, below-0.9 ~2.57e7, halving ~3.27e9, below-0.1 ~3.21e11) ' +
    'and its halving-landmark cross-validation against the imp-33723 closed form N_cross, which ' +
    'agrees to ~0.4% with the residual attributed to the Gronwall E_flow term ' +
    '(E_flow/E_trunc ~ 1.91e-3). No bound moved; NO QED. No refereed bound is changed.',
  citation:
    'imp-97520 (the four-landmark tabulation and halving cross-validation this glosses); ' +
    'imp-33723 (closed-form N_cross fixed point); imp-33601 (E_flow offset identity); ' +
    'imp-33582 (F3 halving landmark); imp-3406 (inherited sigma(N) component model).',
});

export default IMP97593_SIGMA_FOUR_LANDMARK_LADDER_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97593_SIGMA_FOUR_LANDMARK_LADDER_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97593-headword-names-ladder-and-offset',
    why: 'The headword must name all four landmarks, the decade span, and the ~0.4% E_flow ' +
      'halving offset -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP97593_SIGMA_FOUR_LANDMARK_LADDER_GLOSSARY_HEADWORD.headword;
      return (
        /9\.218633e5/.test(h.definition) &&
        /2\.572361e7/.test(h.definition) &&
        /3\.267235e9/.test(h.definition) &&
        /3\.213181e11/.test(h.definition) &&
        /3\.98e-3/.test(h.mechanism) &&
        /1\.91e-3/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97593-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-97520.',
    holds: () =>
      IMP97593_SIGMA_FOUR_LANDMARK_LADDER_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97593_SIGMA_FOUR_LANDMARK_LADDER_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97593_SIGMA_FOUR_LANDMARK_LADDER_GLOSSARY_HEADWORD.verdict) &&
      IMP97593_SIGMA_FOUR_LANDMARK_LADDER_GLOSSARY_HEADWORD.glosses === 'imp-97520',
  },
];

for (const assertion of IMP97593_SIGMA_FOUR_LANDMARK_LADDER_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97593-sigma-four-landmark-ladder-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
