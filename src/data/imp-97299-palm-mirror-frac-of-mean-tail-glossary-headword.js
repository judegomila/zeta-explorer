/**
 * @module imp-97299-palm-mirror-frac-of-mean-tail-glossary-headword
 * @fileoverview imp-97299 -- import-light glossary/Concepts headword recording the imp-97189
 *   result for the neutral rigid-lattice Palm 2-slot mirror-count "fraction of mean" ladder:
 *       frac(ln N) = 1 - (2/y0)/ln N = 1 - 12.1212.../ln N,     y0 = 0.165.
 *   imp-97127 had stopped the ladder at ln N = 22 (frac = 0.535, "well below 1") and read this
 *   as a HEIGHT effect rather than a y0-window relaxation. imp-97189 extended the same kernel to
 *   ln N = 1e8 and found the count trails its asymptotic mean ln N/2 by a FIXED ADDITIVE constant
 *   at every height: palm2(ln N) = ln N/2 - 1/y0 + o(1), with the deficit 1/y0 = 6.060606...
 *   measured to 1e-6 by ln N = 1e5. Equivalently 2/y0 = 12.121212 is the exact multiplicative
 *   constant in (1 - frac) * ln N -> 12.12.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE APPROACH IS INFINITELY SLOW. frac -> 1 only like 1 - O(1/ln N): reaching frac = 0.90
 *   needs ln N ~ 120.5 (N ~ e^120, a factor ~1e45 above the imp-97101 parity crossing
 *   ln N* = 18.394); frac = 0.99 needs ln N ~ 1212; frac = 0.999 needs ln N ~ 12121 -- heights
 *   with no physical zeta-computation analogue.
 *   (b) THE DEFICIT IS FIXED, NOT SHRINKING. The count never "catches up" to a fraction of its
 *   own gap -- it lags by the SAME additive constant 1/y0 = 6.06 at ln N = 100 as at ln N = 1e6.
 *   All of the frac -> 1 convergence is a division artifact of the growing denominator ln N/2,
 *   not a narrowing of the numerator's gap.
 *   (c) THIS CONFIRMS THE HEIGHT-EFFECT READING, NOT A y0 REACH. Because the deficit is pinned to
 *   1/y0 exactly (not to ln N* or the crossing density), the imp-97127 "well below 1" verdict
 *   is sharpened from a qualitative observation into an exact asymptotic law with a named,
 *   measured constant.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording a measured asymptotic
 *   law. Not a proof, no bound moved. NO QED.
 *
 * @see imp-97189-palm-mirror-frac-of-mean-extended-ladder.js (source measurement: the ln N = 1e8
 *   ladder, the fixed additive deficit 1/y0, the frac-target bisection table)
 * @see imp-97127-palm-mirror-height-effect-honest-status.js (the frac < 1 verdict this sharpens)
 * @see imp-97101-palm-mirror-parity-crossing-ladder.js (the 2-slot parity crossing ln N* = 18.394
 *   the deficit dwarfs)
 *
 * Ticket: imp-97299 (content, low, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The Palm-mirror frac-of-mean tail headword, baked verbatim (no re-import).
const PALM_MIRROR_FRAC_OF_MEAN_TAIL_HEADWORD = Object.freeze({
  key: 'palm-mirror-frac-of-mean-imp97189-infinitely-slow-tail',
  term:
    'imp-97189 Palm-mirror frac-of-mean infinitely-slow tail: the neutral rigid-lattice 2-slot ' +
    'mirror count trails its asymptotic mean ln N/2 by a FIXED additive constant 1/y0 = 6.0606 at ' +
    'every height, so frac(ln N) = 1 - (2/y0)/ln N = 1 - 12.1212/ln N -- frac approaches 1 but ' +
    'never reaches it at any finite height',
  definition:
    'For the imp-97101 mirror kernel with y0 = 0.165, palm2(ln N) = ln N/2 - 1/y0 + o(1) with the ' +
    'additive deficit 1/y0 = 6.060606... measured to 1e-6 by ln N = 1e5. Equivalently ' +
    'frac(ln N) = palm2(ln N)/(ln N/2) = 1 - 12.1212.../ln N, i.e. the deficit 1 - frac decays only ' +
    'like ~12.12/ln N, not exponentially or polynomially faster.',
  mechanism:
    'The convergence of frac to 1 is entirely a division artifact: the numerator gap ' +
    '(ln N/2 - palm2) is PINNED at 1/y0, never shrinking, while the denominator ln N/2 grows -- so ' +
    'frac -> 1 without the count ever narrowing its absolute lag behind the mean. Reaching ' +
    'frac = 0.90 needs ln N ~ 120.5 (N ~ e^120, ~1e45 above the imp-97101 parity crossing ' +
    'ln N* = 18.394); frac = 0.99 needs ln N ~ 1212; frac = 0.999 needs ln N ~ 12121.',
  verificationStatus:
    'Re-cited from the imp-97189 measurement module ' +
    '(src/data/imp-97189-palm-mirror-frac-of-mean-extended-ladder.js), which recomputes the ladder ' +
    'in-module (7 rungs to ln N = 1e6, exact bisection table to frac = 0.999) and asserts the fixed ' +
    'additive deficit equals 1/y0 to 1e-3. Naming / glossary headword only; no bound moved; RH ' +
    'open; no refereed bound is changed; NO QED.',
});

export const IMP97299_PALM_MIRROR_FRAC_OF_MEAN_TAIL_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97299',
  proofSection: 'Route-M',
  glosses: 'imp-97189',
  question:
    'imp-97189 extended the imp-97127 Palm-mirror frac-of-mean ladder past ln N = 22 and found ' +
    'frac(ln N) = 1 - (2/y0)/ln N with a fixed additive deficit 1/y0 = 6.06 in the count itself. ' +
    'What is the headword for this infinitely-slow tail, and does it pin a value or move any bound?',
  headword: PALM_MIRROR_FRAC_OF_MEAN_TAIL_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Records the imp-97189 result: the ' +
    'Palm-mirror 2-slot mirror count trails its mean ln N/2 by the fixed additive constant ' +
    '1/y0 = 6.0606 at every height, giving frac(ln N) = 1 - 12.1212/ln N -- an infinitely-slow ' +
    '1 - O(1/ln N) approach to 1 that sharpens (not replaces) the imp-97127 height-effect verdict. ' +
    'No coefficient value newly pinned beyond the re-cited measurement; no bound moved; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-97189 (the tail law this glosses: fixed additive deficit 1/y0, the frac-target bisection ' +
    'table); imp-97127 (the frac < 1 height-effect verdict being sharpened); imp-97101 (the 2-slot ' +
    'parity crossing ln N* = 18.394 the deficit dwarfs).',
});

export default IMP97299_PALM_MIRROR_FRAC_OF_MEAN_TAIL_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97299_PALM_MIRROR_FRAC_OF_MEAN_TAIL_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97299-headword-cites-deficit-and-law',
    why: 'The headword must name the fixed additive deficit 1/y0 and the resulting frac tail law ' +
      '-- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP97299_PALM_MIRROR_FRAC_OF_MEAN_TAIL_GLOSSARY_HEADWORD.headword;
      return (
        /1\/y0 = 6\.0606/.test(h.definition) &&
        /12\.1212/.test(h.definition) &&
        /ln N\* = 18\.394/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97299-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no-refereed-bound-change line present, correctly glosses ' +
      'imp-97189.',
    holds: () =>
      IMP97299_PALM_MIRROR_FRAC_OF_MEAN_TAIL_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97299_PALM_MIRROR_FRAC_OF_MEAN_TAIL_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97299_PALM_MIRROR_FRAC_OF_MEAN_TAIL_GLOSSARY_HEADWORD.verdict) &&
      IMP97299_PALM_MIRROR_FRAC_OF_MEAN_TAIL_GLOSSARY_HEADWORD.glosses === 'imp-97189',
  },
];

for (const assertion of IMP97299_PALM_MIRROR_FRAC_OF_MEAN_TAIL_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97299-palm-mirror-frac-of-mean-tail-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
