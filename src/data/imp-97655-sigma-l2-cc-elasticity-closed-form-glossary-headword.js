/**
 * @module imp-97655-sigma-l2-cc-elasticity-closed-form-glossary-headword
 * @fileoverview imp-97655 -- import-light glossary/Concepts headword recording the imp-97622
 *   unified downslope-landmark C_C-elasticity closed form
 *   E = d(ln N)/d(ln C_C) = 2 / (1 + 2 d(ln R)/dx - d(ln L)/dx), x = ln N, R = E_trunc + E_flow,
 *   and why the L2 below-0.9 landmark (E ~ +2.555) is the steepest of the three downslope
 *   crossings.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-97622 derived a single closed form for the sigma(N) landmark
 *   C_C-elasticity that covers all three downslope crossings (L2 below-0.9, L3 halving, L4
 *   below-0.1): E = 2 / (1 + 2 d(ln R)/dx - d(ln L)/dx), where R = E_trunc + E_flow is the
 *   C_C-independent bridge remainder and L = log T0(N). At L2 (N ~ 2.572e7) the Gronwall flow
 *   share is still live (d ln R/dx ~ -0.080112), giving E = +2.555354, matching the imp-97598
 *   central-difference measurement +2.5554 to four digits.
 *   (b) WHY IT IS NEW. imp-97598 only MEASURED the L2 elasticity numerically; imp-97565 supplied
 *   a closed form 2/(1 - g_prime) for L3 alone. imp-97622 unifies both into one formula and shows
 *   it collapses to the imp-97565 L3 form exactly when the E_flow share is negligible
 *   (d ln R/dx -> 0).
 *   (c) WHY L2 IS STEEPEST. Moving down the tail (L2 -> L3 -> L4) the flow share E_flow/E_trunc
 *   collapses (imp-97585), so |d ln R/dx| falls monotonically: -0.080112 (L2) -> -0.001626 (L3)
 *   -> -0.000031 (L4). The negative 2 d(ln R)/dx term shrinks the denominator only at L2, where
 *   the flow share is still live, inflating E above the +2.1 of the halving landmark and toward
 *   the naive +2 only at L4. The peak L1 is outside this family entirely: it is the minimiser of
 *   R/E_coll rather than a threshold crossing, so C_C cancels and its elasticity is exactly 0.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. Derivation/measurement only, in the inherited
 *   imp-3406/imp-33582 surrogate component model; the C_C 1/8 ansatz (imp-2642/imp-2643) is
 *   perturbed only as a sensitivity probe, not re-pinned; E_trunc pinned 3.06e-5 unchanged; no
 *   operator positivity established; imp-3066 K_a >= 0 untouched.
 *   (e) STATUS: documentation only. No bound moved; not a rigorous asymptotic; the rigorous
 *   anchor stays the trace ceiling; compute binds first; NO QED.
 *
 * @see imp-97622-sigma-l2-cc-elasticity-closed-form.js (source: the unified closed form and the
 *   flow-share explanation for L2 steepness this headword names)
 * @see imp-97598-sigma-landmark-cc-sensitivity (measured L2 C_C-elasticity +2.555, no closed form)
 * @see imp-97565-crossover-cc-sensitivity-landmark-shift (L3 halving closed form 2/(1 - g_prime),
 *   the special case this unifies)
 * @see imp-97585-eflow-etrunc-share-full-ladder (E_flow/E_trunc share collapses down the tail,
 *   the mechanism behind the elasticity relaxing toward +2)
 *
 * Ticket: imp-97655 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The sigma-landmark C_C-elasticity closed-form headword, baked verbatim (no re-import).
const SIGMA_L2_CC_ELASTICITY_CLOSED_FORM_HEADWORD = Object.freeze({
  key: 'sigma-l2-cc-elasticity-closed-form-imp97622',
  term:
    'Unified downslope-landmark C_C-elasticity closed form: E = 2 / (1 + 2 d(ln R)/dx - ' +
    'd(ln L)/dx), and why the L2 below-0.9 landmark (E ~ +2.555) is the steepest',
  definition:
    'For a sigma-landmark at threshold s (the N solving sigma = E_coll/(E_trunc + E_flow + ' +
    'E_coll) = s), the C_C-elasticity d(ln N)/d(ln C_C) has the closed form ' +
    'E = 2 / (1 + 2 d(ln R)/dx - d(ln L)/dx), with x = ln N, R = E_trunc + E_flow the ' +
    'C_C-independent bridge remainder, and L = log T0(N). At the L2 below-0.9 crossing ' +
    '(N ~ 2.572361e7) this evaluates to E = +2.555354, against the imp-97598 measured +2.5554.',
  mechanism:
    'When the flow share is negligible, R ~ E_trunc and d(ln R)/dx -> 0, so the formula ' +
    'collapses to 2/(1 - d(ln L)/dx) = 2/(1 - g_prime), exactly the imp-97565 halving (L3) ' +
    'closed form (+2.102347). L2 stays steeper than L3 and L4 because at its crossing the ' +
    'Gronwall flow share is still live: |d(ln R)/dx| falls monotonically from 0.080112 (L2) to ' +
    '0.001626 (L3) to 0.000031 (L4) as the flow share collapses down the tail (imp-97585). The ' +
    'negative 2 d(ln R)/dx term only meaningfully shrinks the denominator at L2, inflating its ' +
    'elasticity above the +2.1 of L3 and the near-naive +2.079 of L4. The peak landmark L1 is ' +
    'excluded from this family: it is the minimiser of R/E_coll rather than a threshold crossing, ' +
    'so the C_C prefactor cancels and its elasticity is exactly 0.',
  verificationStatus:
    'Re-cited from the imp-97622 derivation module ' +
    '(src/data/imp-97622-sigma-l2-cc-elasticity-closed-form.js), whose baked assertions confirm ' +
    'the L2 closed form matches the imp-97598 measured value to 4 digits, the closed form matches ' +
    'independent numeric central-difference at all three downslope landmarks, the form collapses ' +
    'to the imp-97565 halving value at L3, and |d ln R/dx| falls monotonically L2 -> L3 -> L4. ' +
    'Naming / glossary headword only; supplies no new bound; RH open; no refereed bound is changed' +
    '; NO QED.',
});

export const IMP97655_SIGMA_L2_CC_ELASTICITY_CLOSED_FORM_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97655',
  proofSection: 'S-frontier',
  glosses: 'imp-97622',
  question:
    'imp-97622 derived a unified closed form for the sigma-landmark C_C-elasticity across the ' +
    'three downslope crossings and explained why the L2 below-0.9 landmark (+2.555) is the ' +
    'steepest -- what is the headword for this result?',
  headword: SIGMA_L2_CC_ELASTICITY_CLOSED_FORM_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97622 unified closed form ' +
    'E = 2/(1 + 2 d(ln R)/dx - d(ln L)/dx) for the sigma-landmark C_C-elasticity, matching the ' +
    'imp-97598 measured L2 value +2.5554 at +2.555354, and the flow-share mechanism (imp-97585) ' +
    'explaining why L2 is steepest. No bound moved; not a rigorous asymptotic; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-97622 (the closed-form derivation this glosses); imp-97598 (the L2 measurement refined ' +
    'here); imp-97565 (the L3 halving special case); imp-97585 (the flow-share collapse mechanism).',
});

export default IMP97655_SIGMA_L2_CC_ELASTICITY_CLOSED_FORM_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97655_SIGMA_L2_CC_ELASTICITY_CLOSED_FORM_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97655-headword-names-closed-form-and-values',
    why: 'The headword must name the closed form and the two key numeric values (L2 closed vs ' +
      'measured) -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP97655_SIGMA_L2_CC_ELASTICITY_CLOSED_FORM_GLOSSARY_HEADWORD.headword;
      return (
        /2 \/ \(1 \+ 2 d\(ln R\)\/dx - d\(ln L\)\/dx\)/.test(h.definition) &&
        /\+2\.555354/.test(h.definition) &&
        /\+2\.5554/.test(h.definition) &&
        /2\(1 - g_prime\)|2\/\(1 - g_prime\)/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97655-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-97622.',
    holds: () =>
      IMP97655_SIGMA_L2_CC_ELASTICITY_CLOSED_FORM_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97655_SIGMA_L2_CC_ELASTICITY_CLOSED_FORM_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97655_SIGMA_L2_CC_ELASTICITY_CLOSED_FORM_GLOSSARY_HEADWORD.verdict) &&
      IMP97655_SIGMA_L2_CC_ELASTICITY_CLOSED_FORM_GLOSSARY_HEADWORD.glosses === 'imp-97622',
  },
];

for (const assertion of IMP97655_SIGMA_L2_CC_ELASTICITY_CLOSED_FORM_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97655-sigma-l2-cc-elasticity-closed-form-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
