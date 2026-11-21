/**
 * @module imp-96198-frozen-floor-shortfall-glossary-headword
 * @fileoverview imp-96198 -- import-light glossary/Concepts headword for the imp-96166
 *   frozen-floor shortfall: the empirical E(N) decay exponent measured across a wide
 *   N-ladder does NOT tend to 0 in the limit N -> infinity -- it tends to the frozen,
 *   N-INDEPENDENT Platt-Trudgian fixed-strip term E_trunc ~ 3.06e-5, pinned to the
 *   verification height T_PT = 3e12, and the sole decaying sub-term (E_coll) is
 *   simultaneously the one GUE-conditional part of the budget.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96166 measured p(N) = -dlog E(N)/dlog N across a ten-point N-ladder and found a
 *   sharp two-regime shape (sqrt-law decay, then collapse to ~0). A reader landing on
 *   imp-96166 cold can read the collapse-to-0 exponent as "E(N) -> 0, the Step-4 bridge
 *   is satisfied" -- exactly backwards. The exponent collapses to 0 BECAUSE E(N) has
 *   already plateaued at a strictly positive floor, not because it is converging to
 *   zero. This headword bakes that one distinction verbatim (no re-import of imp-96166,
 *   to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   E(N) = E_trunc + E_flow + E_coll (identical imp-3220 sub-term formulas). E_trunc ~
 *   3.06e-5 is N-INDEPENDENT: it is the Platt-Trudgian fixed-strip term tied to the
 *   FINITE verification height T_PT = 3e12, so it never decays regardless of N. The only
 *   term that decays with N is E_coll = C_C sqrt(log T0 / N) -- and E_coll is exactly the
 *   sole GUE-conditional piece of the budget (imp-486 C_mb). So lim_N E(N) = E_trunc, a
 *   definite positive number, not 0. The Step-4 bridge (lambda-roadmap
 *   conditionalBookkeeping B1-B3, blockedOn G5-step4-bridge) needs lim_N E(N) = 0 to
 *   upgrade |Lambda - (-t_c(N))| <= E(N) into an unconditional Lambda <= 0; crossing that
 *   threshold needs E_trunc -> 0 (T_PT -> infinity, i.e. more verified height), NOT a
 *   faster N-decay of the part that is already decaying.
 *
 *   STATUS: a MEASUREMENT restated as a lookup entry, not a QED. Nothing here closes the
 *   bridge, moves the Lambda <= 0.2 Platt-Trudgian bound, or proves a new height. RH
 *   remains OPEN.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96166 conclusion for quick reference. It
 *   establishes nothing new, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96166-en-decay-exponent-vs-step4-bridge-threshold (source: the N-ladder measurement and the crossover)
 * @see imp-3220-en-bridge-fidelity-frontier (E(N) sub-term formulas, conditional share)
 * @see imp-35164 (qualitative "E(N) FLOORS" obstruction this quantifies)
 *
 * Ticket: imp-96198 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The frozen-floor-shortfall headword, baked verbatim (no re-import of imp-96166).
const FROZEN_FLOOR_SHORTFALL_HEADWORD = Object.freeze({
  key: 'frozen-floor-shortfall-en-etrunc',
  term:
    'imp-96166 frozen-floor shortfall: E(N) tends to E_trunc, NOT 0, because E_trunc is ' +
    'pinned to the finite verification height T_PT = 3e12',
  definition:
    'E(N) = E_trunc + E_flow + E_coll (imp-3220 sub-term formulas). E_trunc ~ 3.06e-5 is ' +
    'N-INDEPENDENT -- it is the Platt-Trudgian fixed-strip term tied to the finite ' +
    'verification height T_PT = 3e12, so it never decays as N grows. The only term that ' +
    'decays with N is E_coll = C_C sqrt(log T0 / N), and E_coll is exactly the sole ' +
    'GUE-conditional piece of the budget (imp-486 C_mb). Past the crossover N_x ~ 3.28e9 ' +
    '(where E_coll drops below E_trunc), E(N) plateaus at the frozen floor E_trunc and ' +
    'the measured decay exponent collapses toward 0 -- not because E(N) is converging to ' +
    'zero, but because it has already stopped decaying.',
  mechanism:
    'lim_N E(N) = E_trunc, a definite positive number pinned to a FINITE verification ' +
    'height -- NOT 0. The Step-4 bridge (lambda-roadmap ' +
    'conditionalBookkeeping B1-B3, blockedOn G5-step4-bridge) needs lim_N E(N) = 0 to ' +
    'upgrade the conditional |Lambda - (-t_c(N))| <= E(N) into an unconditional ' +
    'Lambda <= 0. Since the one decaying sub-term (E_coll) is simultaneously the sole ' +
    'GUE-conditional term, crossing the threshold cannot come from decaying E_coll ' +
    'faster: it needs E_trunc -> 0 directly, i.e. pushing the verification height ' +
    'T_PT -> infinity (or a genuinely different fixed-strip route whose tail decays with ' +
    'N instead of freezing).',
  consequence:
    'The Step-4 bridge needs MORE VERIFIED HEIGHT, not a faster N-decay law. Any future ' +
    'attempt to close conditionalBookkeeping B1-B3 by re-fitting or accelerating the ' +
    'E_coll / E_flow decay is aimed at the wrong term: the frozen E_trunc floor sets the ' +
    'limit regardless of how fast the decaying terms fall. Changes no bound; no refereed bound is changed' +
    '; RH open.',
});

export const IMP96198_FROZEN_FLOOR_SHORTFALL_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96198',
  proofSection: 'S-frontier',
  glosses: 'imp-96166',
  question:
    'imp-96166 measures a two-regime E(N) decay exponent that collapses toward 0 past a ' +
    'crossover N_x ~ 3.28e9. Is that a sign the Step-4 bridge threshold E(N) -> 0 is being ' +
    'met, for a reader landing on the thread cold?',
  headword: FROZEN_FLOOR_SHORTFALL_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). The exponent collapse is the ' +
    'OPPOSITE of the bridge condition: E(N) plateaus at the frozen, N-independent ' +
    'E_trunc ~ 3.06e-5 (pinned to the finite T_PT = 3e12 verification height), so ' +
    'lim_N E(N) = E_trunc > 0, not 0. The sole decaying term (E_coll) is also the sole ' +
    'GUE-conditional term, so closing the Step-4 bridge needs E_trunc -> 0 (more verified ' +
    'height), not a faster N-decay. Establishes nothing; instantiates no interval; moves ' +
    'no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96166 (the N-ladder decay-exponent measurement and crossover this glosses); ' +
    'imp-3220 (E(N) sub-term formulas); imp-35164 (qualitative "E(N) FLOORS" ' +
    'obstruction); lambda-roadmap Step 4 / conditionalBookkeeping B1-B3.',
});

export default IMP96198_FROZEN_FLOOR_SHORTFALL_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96198_FROZEN_FLOOR_SHORTFALL_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96198-headword-states-the-floor-not-zero',
    why: 'The headword must state that E(N) tends to E_trunc (not 0), name the pinned ' +
      'height T_PT=3e12, and identify E_coll as the sole GUE-conditional decaying term -- ' +
      'the entire content of the imp-96166 finding this restates.',
    holds: () => {
      const h = IMP96198_FROZEN_FLOOR_SHORTFALL_GLOSSARY_HEADWORD.headword;
      return (
        /E_trunc/.test(h.definition) &&
        /3e12/.test(h.definition) &&
        /NOT 0|not 0/.test(h.definition + h.mechanism) &&
        /GUE-conditional/.test(h.definition) &&
        /verified height|verification height/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96198-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, ' +
      'source ticket id recorded.',
    holds: () =>
      IMP96198_FROZEN_FLOOR_SHORTFALL_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96198_FROZEN_FLOOR_SHORTFALL_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96198_FROZEN_FLOOR_SHORTFALL_GLOSSARY_HEADWORD.verdict) &&
      /imp-96166/.test(IMP96198_FROZEN_FLOOR_SHORTFALL_GLOSSARY_HEADWORD.glosses),
  },
];

for (const assertion of IMP96198_FROZEN_FLOOR_SHORTFALL_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96198-frozen-floor-shortfall-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
