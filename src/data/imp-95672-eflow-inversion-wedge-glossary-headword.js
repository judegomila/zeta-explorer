/**
 * @module imp-95672-eflow-inversion-wedge-glossary-headword
 * @fileoverview imp-95672 -- import-light glossary/Concepts headword for the imp-95639 finding that the
 *   imp-95617 transition-before-knee G1 INVERSION WEDGE is essentially 100% E_flow-DRIVEN: zeroing the
 *   imp-398 absolute-additive E_flow term removes the inversion entirely (box min gap goes from ~ -0.00468
 *   to ~ +0.01708, anyInvertInBox flips true -> false).
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95639 re-ran the exact imp-95617 joint (C_C, E_trunc) sweep with E_flow set identically to zero
 *   and measured E_flow's isolated contribution. A reader landing on imp-95617/95639 cold has no
 *   quick-lookup definition of what the "inversion wedge" is or why it disappears when E_flow is
 *   dropped. This headword bakes those facts VERBATIM (no re-import of the imp-95639 module, to stay
 *   import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The imp-95617 G1 inversion wedge is the region of the nominal [0.5x, 1.5x] x [0.5x, 1.5x] (C_C,
 *   E_trunc) multiplier box where gap = log10 N_knee - log10 N_cross dips below zero (transition
 *   ordering inverts), bottoming at min gap ~ -0.00468 in the low-C_C / high-E_trunc corner. imp-95639
 *   re-ran that identical sweep with the absolute additive E_flow = C_F (log T0 / T0) Gronwall term
 *   (imp-398) set to zero: the box min gap rises to ~ +0.01708 and MIGRATES to the opposite corner
 *   (high-C_C / low-E_trunc), anyInvertInBox flips true -> false, and the gap = 0 contour is pushed
 *   below the C_C = 0.1x search floor entirely -- out of the searched window. Since the E_coll/E_trunc
 *   balance alone never inverts anywhere in the box, the wedge is attributable to E_flow, not to that
 *   balance.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95639 measurement and its headline figures for quick
 *   reference. It establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   Sensitivity/measurement only, NOT an RH bound; the component model is the inherited imp-3220/imp-3406
 *   extrapolation, not a rigorous asymptotic; no QED. No refereed bound is changed.
 *
 * @see imp-95639-eflow-zero-inversion-wedge (source: the isolated E_flow measurement this glosses)
 * @see imp-95617-transition-knee-ordering-joint-2d (the joint sweep WITH E_flow defining the wedge)
 * @see imp-95598-transition-knee-ordering-robustness (F2 named E_flow as the pure-A-scaling breaker)
 * @see imp-398 (E_flow = C_F (log T0 / T0) Gronwall absolute additive term)
 *
 * Ticket: imp-95672 (content, low). Documentation only; establishes nothing; NO QED; no refereed bound is changed.
 */

// The E_flow-inversion-wedge headword, baked verbatim (no re-import).
const EFLOW_INVERSION_WEDGE_HEADWORD = Object.freeze({
  key: 'imp-95617-inversion-wedge-is-eflow-driven',
  term: 'imp-95639 verdict: the imp-95617 transition-before-knee inversion wedge is ~100% E_flow-driven',
  definition:
    'The imp-95617 G1 inversion wedge is the region of the nominal [0.5x, 1.5x] x [0.5x, 1.5x] (C_C, ' +
    'E_trunc) multiplier box where gap = log10 N_knee - log10 N_cross dips below zero, bottoming at ' +
    'min gap ~ -0.00468 in the low-C_C / high-E_trunc corner. imp-95639 zeroed the imp-398 absolute ' +
    'additive E_flow term in that identical sweep and found the min gap rises to ~ +0.01708, migrating ' +
    'to the OPPOSITE corner (high-C_C / low-E_trunc), with anyInvertInBox flipping true -> false.',
  contourDisplacement:
    'With E_flow present, the gap = 0 contour is a rising curve C_C_invert(E_trunc) ~ 0.399 -> 0.499 -> ' +
    '0.565 sitting inside the box. With E_flow = 0 the gap stays strictly positive down to the C_C = ' +
    '0.1x bisection floor for every E_trunc multiplier, pushing the contour below C_C = 0.1x -- out of ' +
    'the searched [0.1x, 1.5x] window entirely.',
  attribution:
    'Since the pure E_coll/E_trunc balance (E_flow = 0) never inverts anywhere in the box, the entire ' +
    'imp-95617 wedge is attributable to the absolute additive E_flow term, not to the E_coll/E_trunc ' +
    'balance. E_flow also widens the pinned base gap by ~ +0.00732 dex when removed (from ~0.01315 to ' +
    '~0.02047), confirming it is the fragility source that imp-95598 F2 named as the pure-A-scaling ' +
    'breaker.',
});

export const IMP95672_EFLOW_INVERSION_WEDGE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95672',
  proofSection: 'S-frontier',
  glosses: 'imp-95639',
  scopes: 'imp-95617',
  question:
    'imp-95639 measured E_flow (imp-398)\'s isolated contribution to the imp-95617 transition-before-' +
    'knee inversion wedge by zeroing it in the identical sweep. What is the wedge, and why does it ' +
    'vanish when E_flow is removed, for a reader landing on imp-95617/95639 cold?',
  headword: EFLOW_INVERSION_WEDGE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95639 verdict: zeroing the ' +
    'imp-398 absolute-additive E_flow term removes the imp-95617 inversion wedge entirely (min gap ' +
    '~ -0.00468 -> ~ +0.01708, anyInvertInBox true -> false), so the wedge is essentially 100% ' +
    'E_flow-driven within the nominal +/-50% box. Establishes nothing; instantiates no interval; moves ' +
    'no bound; sensitivity/measurement only, NOT an RH bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-95639 (isolated E_flow-zero measurement and headline figures); imp-95617 (joint sweep WITH ' +
    'E_flow defining the wedge); imp-95598 (F2 named E_flow as the pure-A-scaling breaker); imp-398 ' +
    '(E_flow absolute additive term).',
});

export default IMP95672_EFLOW_INVERSION_WEDGE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95672_EFLOW_INVERSION_WEDGE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95672-headword-has-required-fields',
    why: 'The headword must name the wedge, the -0.00468 -> +0.01708 shift, and the E_flow attribution -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95672_EFLOW_INVERSION_WEDGE_GLOSSARY_HEADWORD.headword;
      return (
        /-0\.00468/.test(h.definition) &&
        /\+0\.01708/.test(h.definition) &&
        /OPPOSITE corner/.test(h.definition) &&
        /out of/.test(h.contourDisplacement) &&
        /attributable to the absolute additive E_flow term/.test(h.attribution)
      );
    },
  },
  {
    id: 'imp95672-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95672_EFLOW_INVERSION_WEDGE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95672_EFLOW_INVERSION_WEDGE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95672_EFLOW_INVERSION_WEDGE_GLOSSARY_HEADWORD.verdict) &&
      IMP95672_EFLOW_INVERSION_WEDGE_GLOSSARY_HEADWORD.glosses === 'imp-95639' &&
      IMP95672_EFLOW_INVERSION_WEDGE_GLOSSARY_HEADWORD.scopes === 'imp-95617',
  },
];

for (const assertion of IMP95672_EFLOW_INVERSION_WEDGE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-95672-eflow-inversion-wedge-glossary-headword assertion failed: ${assertion.id}`);
  }
}
