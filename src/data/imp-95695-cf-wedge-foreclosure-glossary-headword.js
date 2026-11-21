/**
 * @module imp-95695-cf-wedge-foreclosure-glossary-headword
 * @fileoverview imp-95695 -- import-light glossary/Concepts headword for the imp-95674 K1 decision:
 *   the imp-95617 E_flow transition-knee inversion wedge is physically FORECLOSED because the
 *   imp-95660 wedge-closure multiplier cf* = 0.839 sits OUTSIDE the honest imp-398 C_F provenance
 *   band [~0.995, 1.40], and imp-1134 shows the honest revision direction points UPWARD (C_F is a
 *   lower bound, not a value with room to move down).
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95674 assembled the imp-398 C_F provenance lineage and decided the imp-95660 wedge-closure
 *   multiplier cf* = 0.839 falls outside it, but a reader landing on that module cold has no
 *   quick-lookup definition of what "the wedge", "cf*", and "the honest band" name, or why the
 *   verdict is foreclosure rather than reachability. This headword bakes those facts VERBATIM (no
 *   re-import of the imp-95674 module, to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The wedge: the imp-95617 joint transition-before-knee sweep found a narrow box where the
 *   E_flow-inclusive gap goes negative (inverts) at the nominal C_F multiplier cf = 1. imp-95660
 *   measured that this wedge closes (the box-min gap returns non-negative) only if C_F is revised
 *   DOWNWARD by a multiplier cf* = 0.83891 (a ~16.1pct cut). imp-95674 then derived the honest
 *   provenance band for that multiplier from the imp-398/imp-838 closed form, the imp-2704 interval
 *   certificate (~5e-5 fractional uncertainty, three orders of magnitude too small to matter), and
 *   the imp-1134 downward-tightening audit: band ~ [0.995, 1.40], asymmetric and downward-narrow.
 *   K1: cf* = 0.839 sits ~0.156 below even the most generous honest floor (~0.995) -- an overshoot
 *   of ~32x the largest honest downward lane (~0.5pct, and that lane properly lives in the C_G
 *   Gronwall micro-floor, not C_F). K2: imp-1134 shows the natural denominator refinement RAISES
 *   C_F (ratios ~1.91x/4.56x local, ~1.2-1.4x integrated), so C_F is a LOWER bound and the
 *   physically-supported revision is UPWARD, which drives the wedge gap MORE negative, not toward
 *   closure. Verdict: the imp-95617 E_flow inversion wedge is physically UNREACHABLE/FORECLOSED --
 *   the ~16pct fragility imp-95660 measured is a fragility to a revision the provenance forbids.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95674 K1/K2 decision and the cf*-vs-band figures for
 *   quick reference. It establishes nothing, instantiates no interval, closes no sub-gap, moves no
 *   bound. imp-2519 no-overclaim guard preserved; NO QED. No refereed bound is changed.
 *
 * @see imp-95674-cf-provenance-band-wedge-reachability (source: the honest C_F band + K1/K2 decision this glosses)
 * @see imp-95660-cf-multiplier-wedge-closure (source: the measured cf* = 0.839 wedge-closure multiplier)
 * @see imp-95617-transition-knee-ordering-joint-2d (the joint 2-D sweep that surfaced the wedge)
 * @see c-f-bulk-refinement-2026-05 (imp-1134: C_F is a LOWER bound; honest downward factor 1.00x)
 *
 * Ticket: imp-95695 (content, medium). Documentation only; establishes nothing; wedge stays
 * FORECLOSED per imp-95674; NO QED; no refereed bound is changed.
 */

// The C_F wedge-foreclosure glossary headword, baked verbatim (no re-import).
const CF_WEDGE_FORECLOSURE_HEADWORD = Object.freeze({
  key: 'cf-wedge-foreclosure-k1',
  term: 'imp-95674 K1 decision: the imp-95617 E_flow inversion wedge is FORECLOSED',
  definition:
    'The imp-95617 transition-before-knee joint sweep surfaced a narrow box where the E_flow-' +
    'inclusive box-min gap goes negative at the nominal imp-398 C_F multiplier cf = 1. imp-95660 ' +
    'measured that this wedge only closes (gap returns non-negative) for a DOWNWARD C_F revision ' +
    'cf <= cf* = 0.83891 (a ~16.11pct cut).',
  honestBand:
    'imp-95674 derived the honest imp-398 C_F provenance band as a multiplier cf in ' +
    '[~0.995, ~1.40] from the imp-398/imp-838 closed form, the imp-2704 interval certificate ' +
    '(~5e-5 fractional uncertainty), and the imp-1134 downward-tightening audit (rigorous downward ' +
    'factor 1.00x; largest honest downward lane ~0.5pct, and that lane lives in C_G, not C_F).',
  k1Decision:
    'cf* = 0.839 sits ~0.156 below even the most generous honest floor (~0.995) -- an overshoot of ' +
    '~32x the largest honest downward lane -- so cf* is OUTSIDE the honest band: the wedge is ' +
    'physically FORECLOSED, not reachable.',
  k2WrongDirection:
    'imp-1134 shows the natural denominator refinement RAISES C_F (ratios ~1.91x/4.56x local, ' +
    '~1.2-1.4x integrated), i.e. C_F is a LOWER bound. The physically-supported revision is UPWARD ' +
    '(cf ~1.2-1.4), which drives the box-min gap MORE negative and does NOT close the wedge.',
});

export const IMP95695_CF_WEDGE_FORECLOSURE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95695',
  proofSection: 'S-frontier',
  glosses: 'imp-95674',
  scopes: 'imp-95617',
  question:
    'imp-95674 decided that the imp-95660 wedge-closure multiplier cf* = 0.839 lies outside the ' +
    'honest imp-398 C_F provenance band. What is the wedge, what is cf*, what is the honest band, ' +
    'and why is the verdict foreclosure rather than reachability, for a reader landing cold?',
  headword: CF_WEDGE_FORECLOSURE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95674 K1/K2 decision: ' +
    'the imp-95617 E_flow inversion wedge needs a C_F multiplier cf* = 0.839 that sits ~0.156 below ' +
    'the most generous honest imp-398 provenance floor (~0.995), an overshoot of ~32x the largest ' +
    'honest downward lane, and the honest evidence (imp-1134) points the OTHER way (C_F is a LOWER ' +
    'bound, supported revision is UPWARD). The wedge is physically FORECLOSED. Establishes nothing; ' +
    'instantiates no interval; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-95674 (honest C_F band + K1/K2 decision); imp-95660 (measured cf* = 0.839); imp-95617 ' +
    '(joint 2-D sweep surfacing the wedge); imp-1134 (C_F is a LOWER bound).',
});

export default IMP95695_CF_WEDGE_FORECLOSURE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95695_CF_WEDGE_FORECLOSURE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95695-headword-has-required-fields',
    why: 'The headword must name cf*, the honest band figures, and both the K1 foreclosure and K2 wrong-direction reasons -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95695_CF_WEDGE_FORECLOSURE_GLOSSARY_HEADWORD.headword;
      return (
        /0\.83891/.test(h.definition) &&
        /0\.995/.test(h.honestBand) &&
        /1\.40/.test(h.honestBand) &&
        /FORECLOSED/.test(h.k1Decision) &&
        /LOWER bound/.test(h.k2WrongDirection)
      );
    },
  },
  {
    id: 'imp95695-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, wedge stays FORECLOSED, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95695_CF_WEDGE_FORECLOSURE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95695_CF_WEDGE_FORECLOSURE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95695_CF_WEDGE_FORECLOSURE_GLOSSARY_HEADWORD.verdict) &&
      /FORECLOSED/.test(IMP95695_CF_WEDGE_FORECLOSURE_GLOSSARY_HEADWORD.verdict) &&
      IMP95695_CF_WEDGE_FORECLOSURE_GLOSSARY_HEADWORD.glosses === 'imp-95674' &&
      IMP95695_CF_WEDGE_FORECLOSURE_GLOSSARY_HEADWORD.scopes === 'imp-95617',
  },
];

for (const assertion of IMP95695_CF_WEDGE_FORECLOSURE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-95695-cf-wedge-foreclosure-glossary-headword assertion failed: ${assertion.id}`);
  }
}
