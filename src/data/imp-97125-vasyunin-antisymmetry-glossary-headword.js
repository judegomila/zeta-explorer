/**
 * @module imp-97125-vasyunin-antisymmetry-glossary-headword
 * @fileoverview imp-97125 -- import-light Concepts glossary headword recording the imp-97097
 *   RESULT 1 finding: the fixed-modulus half of the Route M cotangent first moment,
 *   Sum_{a in R_b} V(a,b), collapses EXACTLY to ZERO for every b >= 2, via the sharp antisymmetry
 *   V(b-a,b) = -V(a,b) realized by the fixed-point-free involution a <-> b-a on the reduced
 *   residues R_b mod b. A reader skimming imp-97071's route (3) "permutation intuition" could miss
 *   that this is the SHARPEST rigorous form of that intuition -- an exact identity, not a heuristic
 *   -- so this headword bakes the antisymmetry and its exact-cancellation consequence on record
 *   without re-deriving it.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q) is the Vasyunin cotangent sum. For (a,b)=1,
 *   b does not divide m a for 1 <= m <= b-1, so frac(-m a/b) = 1 - frac(m a/b); combined with the
 *   odd symmetry Sum_{m=1}^{b-1} cot(pi m/b) = 0 (m <-> b-m), this gives the exact antisymmetry
 *      V(b-a, b) = Sum_m (1 - frac(m a/b)) cot(pi m/b) = -V(a,b).
 *   The map a <-> b-a is a fixed-point-free involution of R_b (a = b-a would force a = b/2, which
 *   is never coprime to b for b >= 2), so the fixed-modulus Vasyunin sums cancel in pairs across
 *   R_b, giving the EXACT identity
 *      Sum_{a in R_b} V(a,b) = 0   for EVERY b >= 2   (no hypothesis, no error term).
 *   Restricting the sum to a >= 2 (as the Route M first moment does) leaves only the single
 *   a=1 boundary term: Sum_{a=2,(a,b)=1}^{b-1} V(a,b) = -V(1,b), and V(1,b) = c_0(1/b) is the
 *   classical cotangent sum, O(b log b) = o(phi(b) b), so it contributes NOTHING to the leading
 *   Route M coefficient. This is why the fixed-modulus half of route (3)'s reciprocity hope carries
 *   no leading lower-bound content -- the ENTIRE leading cotangent moment sits in the separate
 *   varying-modulus half (imp-97097 RESULT 2, not restated here).
 *
 *   STATUS: documentation glossary headword only, not a re-derivation or a new computation.
 *   Establishes nothing new; moves no bound. The imp-97097 obstruction (the varying-modulus half is
 *   NOT elementarised by reciprocity) remains the open residual. NO QED. No refereed bound is changed
 *   ; RH open.
 *
 * @see imp-97097-route-m-cotangent-first-moment-reciprocity.js (source: full derivation of the
 *   antisymmetry, the exact-zero collapse, and the varying-modulus obstruction this headword
 *   glosses only the fixed-modulus RESULT 1 half of)
 * @see imp-97071-route-m-lower-companion-first-moment-reduction.js (parent: the route (3)
 *   "permutation" intuition this antisymmetry sharpens into an exact identity)
 *
 * Ticket: imp-97125 (content, low, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

import { IMP97097_REDUCTION, IMP97097_VERDICT } from './imp-97097-route-m-cotangent-first-moment-reciprocity.js';

// The Vasyunin antisymmetry glossary headword, baked verbatim (no re-import of the derivation text).
const VASYUNIN_ANTISYMMETRY_HEADWORD = Object.freeze({
  key: 'route-m-vasyunin-fixed-modulus-antisymmetry-sum-vanishes',
  term:
    'V(b-a,b) = -V(a,b), the EXACT antisymmetry of the Vasyunin cotangent sum ' +
    'V(a,q) = Sum_{m=1}^{q-1} frac(ma/q) cot(pi m/q) under a <-> b-a, which forces ' +
    'Sum_{a in R_b} V(a,b) = 0 for every b >= 2',
  definition:
    'For (a,b)=1 and 1 <= m <= b-1, b does not divide m a, so frac(-ma/b) = 1 - frac(ma/b); ' +
    'combined with the odd symmetry Sum_{m=1}^{b-1} cot(pi m/b) = 0 (m <-> b-m), this gives ' +
    'V(b-a,b) = Sum_m (1 - frac(ma/b)) cot(pi m/b) = -V(a,b). The map a <-> b-a is a ' +
    'fixed-point-free involution of the reduced residues R_b mod b (a = b-a would force ' +
    'a = b/2, never coprime to b), so the fixed-modulus Vasyunin sums cancel in pairs: ' +
    'Sum_{a in R_b} V(a,b) = 0 for EVERY b >= 2, exactly, with no error term.',
  mechanism:
    'Restricting to a >= 2 (the Route M convention) leaves only the a=1 boundary term: ' +
    'Sum_{a=2,(a,b)=1}^{b-1} V(a,b) = -V(1,b), and V(1,b) = c_0(1/b) is O(b log b) = o(phi(b) b), ' +
    'so it does not contribute to the leading Route M coefficient. This is the sharpest rigorous ' +
    'form of the route (3) "permutation" intuition: the permuting half is an exact identity, but it ' +
    'evaluates to zero (plus a lower-order boundary term), so all leading cotangent content is ' +
    'pushed into the separate varying-modulus half.',
  verificationStatus:
    'Exact identity, machine-verified to 1e-7 at finite even and odd b (imp-97097). Establishes no ' +
    'bound and moves nothing on its own -- the varying-modulus half it isolates remains open and is ' +
    'NOT elementarised by reciprocity (imp-97097 RESULT 2/obstruction). NO QED; no refereed bound is changed' +
    '; RH open.',
});

export const IMP97125_VASYUNIN_ANTISYMMETRY_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97125',
  proofSection: 'S-frontier',
  glosses: 'imp-97097',
  question:
    'imp-97071 route (3) hoped that "as a ranges over reduced residues, m a permutes them" would ' +
    'collapse the fixed-modulus Vasyunin sum Sum_{a in R_b} V(a,b). What is the sharpest exact form ' +
    'of that permutation, and what does it evaluate to?',
  headword: VASYUNIN_ANTISYMMETRY_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-97097 RESULT 1 finding: ' +
    'the fixed-modulus Vasyunin sum collapses EXACTLY to zero via the antisymmetry V(b-a,b) = ' +
    '-V(a,b), realized by the fixed-point-free involution a <-> b-a on R_b, leaving only a ' +
    'lower-order a=1 boundary term when restricted to a >= 2. This is the sharpest rigorous form of ' +
    'the route (3) permutation intuition, and it carries NO leading lower-bound content -- the ' +
    'entire leading cotangent moment lives in the separate varying-modulus half (not restated ' +
    'here). Establishes nothing new; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97097 (the full derivation of the antisymmetry, the exact-zero fixed-modulus collapse, and ' +
    'the varying-modulus obstruction this headword glosses only the RESULT 1 half of); imp-97071 ' +
    '(the parent route (3) permutation intuition this antisymmetry sharpens).',
});

export default IMP97125_VASYUNIN_ANTISYMMETRY_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97125_VASYUNIN_ANTISYMMETRY_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97125-headword-matches-source-identity',
    why: 'The headword must record the same exact antisymmetry and fixed-modulus-vanishes identity ' +
      'as its source module (imp-97097), not a re-typed paraphrase.',
    holds: () =>
      /a <-> b-a/.test(IMP97097_REDUCTION.fixedModulusVanishes) &&
      /Sum_\{a in R_b\} V\(a,b\) = 0/.test(IMP97097_REDUCTION.fixedModulusVanishes) &&
      /V\(b-a,b\) = -V\(a,b\)/.test(IMP97097_REDUCTION.antisymmetry),
  },
  {
    id: 'imp97125-headword-names-involution-and-boundary',
    why: 'The headword must name the fixed-point-free involution and the a=1 boundary term -- the ' +
      'entire point of the glossary entry.',
    holds: () => {
      const h = IMP97125_VASYUNIN_ANTISYMMETRY_GLOSSARY_HEADWORD.headword;
      return (
        /fixed-point-free involution/.test(h.definition) &&
        /V\(b-a,b\) = -V\(a,b\)/.test(h.term) &&
        /V\(1,b\)/.test(h.mechanism) &&
        /o\(phi\(b\) b\)/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97125-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, and the source ' +
      'verdict this headword glosses must still show the varying-modulus half as unresolved.',
    holds: () =>
      IMP97125_VASYUNIN_ANTISYMMETRY_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97125_VASYUNIN_ANTISYMMETRY_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97125_VASYUNIN_ANTISYMMETRY_GLOSSARY_HEADWORD.verdict) &&
      IMP97125_VASYUNIN_ANTISYMMETRY_GLOSSARY_HEADWORD.glosses === 'imp-97097' &&
      IMP97097_VERDICT.fixedModulusVanishesRigorously === true &&
      IMP97097_VERDICT.cotangentLowerBoundProved === false,
  },
];

for (const assertion of IMP97125_VASYUNIN_ANTISYMMETRY_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97125-vasyunin-antisymmetry-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
