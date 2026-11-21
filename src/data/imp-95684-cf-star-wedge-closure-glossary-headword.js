/**
 * @module imp-95684-cf-star-wedge-closure-glossary-headword
 * @fileoverview imp-95684 -- import-light glossary/Concepts headword for the imp-95660 measurement:
 *   the imp-95617 E_flow-driven G1 inversion wedge closes under only a ~16pct downward revision of
 *   the imp-398 C_F prefactor, i.e. the box-min gap crosses zero at a C_F multiplier cf* ~ 0.83891.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95660 swept a scalar multiplier cf on the imp-398 C_F prefactor across [0, 1.5] and bisected
 *   the value cf* at which the imp-95617 inversion wedge stops inverting anywhere in the (C_C,
 *   E_trunc) box. A reader landing on imp-95660 cold has no quick-lookup definition of what cf*
 *   names or why "~16pct" is the headline figure. This headword bakes those facts VERBATIM (no
 *   re-import of the imp-95660 module, to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   cf* is the C_F multiplier at which the imp-95617 box-min gap (log10 N_knee - log10 N_cross,
 *   minimized over the +/-50% (C_C, E_trunc) multiplier box) crosses zero: the box-min gap rises
 *   monotonically as cf falls from cf=1.0 (-0.00468, inverting, matching imp-95617) through cf=0.90
 *   (-0.00178), cf=0.85 (-0.00032, still inverting), cf=0.75 (+0.00260), to cf=0 (+0.01708, matching
 *   the imp-95639 E_flow=0 branch). Bisecting gives cf* = 0.83891: for cf < cf*, anyInvertInBox is
 *   false everywhere in the searched box. Since 1 - cf* ~ 0.1611, the wedge closes under a downward
 *   C_F revision of ~16.11pct -- i.e. a fairly modest fraction of the nominal prefactor, which is why
 *   imp-95674 went on to check whether the honest imp-398 provenance band actually reaches cf*
 *   (it does not: see imp-95695).
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95660 cf* figure and the ~16pct headline for quick
 *   reference. It establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   Sensitivity/measurement only, NOT an RH bound; no QED. No refereed bound is changed.
 *
 * @see imp-95660-cf-multiplier-wedge-closure (source: the cf sweep and the bisected cf* = 0.83891)
 * @see imp-95617-transition-knee-ordering-joint-2d (the joint 2-D sweep that surfaced the wedge)
 * @see imp-95639-eflow-zero-inversion-wedge (the cf=0 endpoint this sweep interpolates toward)
 * @see imp-95695-cf-wedge-foreclosure-glossary-headword (whether the honest C_F band reaches cf*: it does not)
 *
 * Ticket: imp-95684 (content, low). Documentation only; establishes nothing; NO QED; no refereed bound is changed.
 */

// The cf*-wedge-closure headword, baked verbatim (no re-import).
const CF_STAR_WEDGE_CLOSURE_HEADWORD = Object.freeze({
  key: 'imp-95660-cf-star-wedge-closure',
  term: 'imp-95660 measurement: the imp-95617 inversion wedge closes at C_F multiplier cf* = 0.83891',
  definition:
    'cf* is the imp-398 C_F prefactor multiplier at which the imp-95617 box-min gap ' +
    '(log10 N_knee - log10 N_cross, minimized over the +/-50% (C_C, E_trunc) box) crosses zero. ' +
    'The box-min gap rises monotonically as cf falls: cf=1.0 -> -0.00468 (inverting, matches ' +
    'imp-95617), cf=0.90 -> -0.00178, cf=0.85 -> -0.00032 (still inverting), cf=0.75 -> +0.00260, ' +
    'cf=0 -> +0.01708 (matches the imp-95639 E_flow=0 branch). Bisecting the box-min gap to zero ' +
    'gives cf* = 0.83891.',
  headlineFigure:
    'Since 1 - cf* = 0.16109, the imp-95617 inversion wedge closes (anyInvertInBox flips ' +
    'true -> false) under a downward revision of the C_F prefactor by only ~16.11pct.',
  whyItMatters:
    'A ~16pct downward swing sounds modest relative to the nominal prefactor, which is why the ' +
    'follow-up question (imp-95674, glossed at imp-95695) was whether the honest imp-398 provenance ' +
    'band actually reaches cf* = 0.839. It does not: the honest band floor is ~0.995, and the ' +
    'honestly-supported revision direction is UPWARD, not downward, so the wedge stays FORECLOSED ' +
    'despite the ~16pct figure looking reachable in isolation.',
});

export const IMP95684_CF_STAR_WEDGE_CLOSURE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95684',
  proofSection: 'S-frontier',
  glosses: 'imp-95660',
  scopes: 'imp-95617',
  question:
    'imp-95660 bisected a C_F multiplier cf* = 0.83891 at which the imp-95617 inversion wedge closes. ' +
    'What is cf*, why is "~16pct downward revision" the headline figure, and how does that relate to ' +
    'the later foreclosure verdict, for a reader landing cold?',
  headword: CF_STAR_WEDGE_CLOSURE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95660 measurement: the ' +
    'imp-95617 E_flow-driven inversion wedge closes at a C_F multiplier cf* = 0.83891, i.e. under a ' +
    '~16.11pct downward revision of the imp-398 C_F prefactor. Establishes nothing; instantiates no ' +
    'interval; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-95660 (bisected cf* = 0.83891); imp-95617 (joint 2-D sweep surfacing the wedge); imp-95639 ' +
    '(cf=0 endpoint); imp-95674/imp-95695 (whether the honest C_F band reaches cf*: it does not).',
});

export default IMP95684_CF_STAR_WEDGE_CLOSURE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95684_CF_STAR_WEDGE_CLOSURE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95684-headword-has-required-fields',
    why: 'The headword must name cf*, the ~16pct headline figure, and the box-min gap endpoints -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95684_CF_STAR_WEDGE_CLOSURE_GLOSSARY_HEADWORD.headword;
      return (
        /0\.83891/.test(h.definition) &&
        /-0\.00468/.test(h.definition) &&
        /16\.11pct/.test(h.headlineFigure) &&
        /FORECLOSED/.test(h.whyItMatters)
      );
    },
  },
  {
    id: 'imp95684-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95684_CF_STAR_WEDGE_CLOSURE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95684_CF_STAR_WEDGE_CLOSURE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95684_CF_STAR_WEDGE_CLOSURE_GLOSSARY_HEADWORD.verdict) &&
      IMP95684_CF_STAR_WEDGE_CLOSURE_GLOSSARY_HEADWORD.glosses === 'imp-95660' &&
      IMP95684_CF_STAR_WEDGE_CLOSURE_GLOSSARY_HEADWORD.scopes === 'imp-95617',
  },
];

for (const assertion of IMP95684_CF_STAR_WEDGE_CLOSURE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-95684-cf-star-wedge-closure-glossary-headword assertion failed: ${assertion.id}`);
  }
}
