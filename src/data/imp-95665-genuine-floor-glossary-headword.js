/**
 * @module imp-95665-genuine-floor-glossary-headword
 * @fileoverview imp-95665 -- import-light glossary/Concepts headword for the imp-95642 verdict:
 *   the twin-pair block-vs-scalar residual SPLIT-OPT - SPLIT-RZ = 4.611560 (imp-95609) is a GENUINE
 *   FLOOR of the single-scale delta-separated class -- a lattice-specific TWO-SCALE effect that
 *   cannot be ported off-lattice / m-uniformly -- and not un-ported slack awaiting a sharper minorant.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95642 assembled the SEP-OPT class-infimum argument and the two-endpoint numerical witness
 *   deciding the imp-95609 open question, but a reader landing on that module cold has no
 *   quick-lookup definition of what "the block floor", "the two-scale geometry", and "genuine floor
 *   vs un-ported slack" name. This headword bakes those facts VERBATIM (no re-import of the imp-95642
 *   module, to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The gap: the off-lattice m-uniform scalar-floor onset SPLIT-OPT = 20.593144 sits 4.611560
 *   depth-units above the sharper lattice-pinned twin-pair-symbol onset SPLIT-RZ = 15.981584
 *   (imp-95609). The question was whether that gap is un-ported SLACK (a sharper off-lattice symbol
 *   could close it) or a GENUINE FLOOR (no off-lattice symbol can do better than SPLIT-OPT). The
 *   twin-pair Toeplitz block symbol is sharp only on a TWO-SCALE geometry: an in-pair gap delta and a
 *   cross-pair gap D bounded strictly above delta (D >= rho delta, rho > 1); its sharpness is exactly
 *   the retained in-pair 2x2 coupling, giving an isolated block floor 1 - sech(delta/2) that is
 *   ~1.94e12x the scalar floor A_opt(delta) at delta = ln 1.3. But the delta-separated CLASS is
 *   SINGLE-SCALE (min gap >= delta only) and admits D -> delta+ (the uniform lattice), where THEOREM
 *   SEP-OPT (imp-95419) forces per-pair lambda_min to degrade continuously down to the scalar
 *   A_opt(delta) -- the two-scale structure dissolves. Hence any class-uniform block constant is
 *   bounded above by A_opt(delta), so SPLIT-OPT is class-optimal and the 4.611560 gap is GENUINE, not
 *   slack. Mechanically, the port fails because retaining the in-pair coupling while killing
 *   cross-pair terms needs a matrix-valued minorant of exponential type in the OPEN window
 *   (delta, D); under the class D can approach delta, so that window is empty.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95642 genuine-floor decision and the block-vs-scalar
 *   figures for quick reference. It establishes nothing, instantiates no interval, closes no sub-gap,
 *   moves no bound. imp-2519 no-overclaim guard preserved; NO QED. No refereed bound is changed.
 *
 * @see imp-95642-twin-pair-symbol-offlattice-obstruction (source: the genuine-floor obstruction and witness this glosses)
 * @see imp-95419-separated-class-optimal-riesz-floor (THEOREM SEP-OPT, scalar class floor)
 * @see imp-95609-seam-gram-onset-ladder-table (the open 4.611560 residual this settles)
 *
 * Ticket: imp-95665 (content, low). Documentation only; establishes nothing; residual gap stays a
 * GENUINE FLOOR per imp-95642; NO QED; no refereed bound is changed.
 */

// The block-vs-scalar genuine-floor headword, baked verbatim (no re-import).
const GENUINE_FLOOR_HEADWORD = Object.freeze({
  key: 'twin-pair-block-scalar-genuine-floor',
  term: 'imp-95642 verdict: the twin-pair block-vs-scalar 4.611560 residual is a GENUINE FLOOR, not un-ported slack',
  definition:
    'The onset gap SPLIT-OPT (20.593144, off-lattice m-uniform scalar floor) minus SPLIT-RZ ' +
    '(15.981584, lattice-pinned twin-pair-symbol floor) equals 4.611560 depth-units (imp-95609). ' +
    'imp-95642 decides this gap is a GENUINE FLOOR of the single-scale delta-separated class: no ' +
    'off-lattice / m-uniform port of the twin-pair block symbol can close it, because the block ' +
    'sharpening is a lattice-specific TWO-SCALE effect the class does not guarantee.',
  twoScaleMechanism:
    'The twin-pair Toeplitz block symbol is sharp only on a TWO-SCALE geometry: the cross-pair gap ' +
    'D bounded strictly above the in-pair gap delta (D >= rho delta, rho > 1), giving an isolated block floor ' +
    '1 - sech(delta/2) that is ~1.94e12x the scalar floor A_opt(delta) at delta = ln 1.3. The ' +
    'delta-separated class is single-scale (constrains only min gap >= delta) and admits D -> ' +
    'delta+ (the uniform lattice), where THEOREM SEP-OPT (imp-95419) forces per-pair lambda_min to ' +
    'degrade continuously to the scalar A_opt(delta) -- confirmed numerically (finite-size ratio ' +
    '1.092 at 80 points, decreasing to 1).',
  genuineFloorVerdict:
    'Any class-uniform block constant F(delta) valid for every delta-separated configuration obeys ' +
    'F(delta) <= A_opt(delta) (the uniform-lattice member is in the class), so SPLIT-OPT is ' +
    'class-optimal and the 4.611560 gap to SPLIT-RZ is GENUINE -- attributable exactly to the ' +
    'missing two-scale hypothesis, not to an un-found sharper off-lattice symbol.',
  mechanicalObstruction:
    'A matrix-valued minorant retaining the in-pair 2x2 coupling while eliminating cross-pair terms ' +
    'would need exponential type in the OPEN window (delta, D); the delta-separated class allows ' +
    'D -> delta, so that window is empty and no such uniform minorant exists.',
});

export const IMP95665_GENUINE_FLOOR_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95665',
  proofSection: 'S-frontier',
  glosses: 'imp-95642',
  scopes: 'imp-95419',
  question:
    'imp-95642 decided that the imp-95609 twin-pair block-vs-scalar residual 4.611560 is a GENUINE ' +
    'FLOOR, not un-ported slack. What is the two-scale mechanism behind the block symbol, and why ' +
    'does the single-scale delta-separated class foreclose porting it off-lattice, for a reader ' +
    'landing on that module cold?',
  headword: GENUINE_FLOOR_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95642 genuine-floor ' +
    'decision: the twin-pair block symbol is sharp only on a two-scale (delta, D) geometry that the ' +
    'single-scale delta-separated class does not guarantee, so any class-uniform block constant ' +
    'collapses to the scalar A_opt(delta) via THEOREM SEP-OPT, making the 4.611560 residual gap ' +
    'GENUINE rather than un-ported slack. Establishes nothing; instantiates no interval; moves no ' +
    'bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-95642 (genuine-floor obstruction and two-endpoint numerical witness); imp-95419 (THEOREM ' +
    'SEP-OPT, scalar class-optimal floor); imp-95609 (the 4.611560 onset residual this settles); ' +
    'imp-95335 (SPLIT chain, A_sep bracket).',
});

export default IMP95665_GENUINE_FLOOR_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95665_GENUINE_FLOOR_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95665-headword-has-required-fields',
    why: 'The headword must name the residual gap, the two-scale mechanism, and the GENUINE FLOOR verdict -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95665_GENUINE_FLOOR_GLOSSARY_HEADWORD.headword;
      return (
        /4\.611560/.test(h.definition) &&
        /GENUINE FLOOR/.test(h.definition) &&
        /two-scale/i.test(h.twoScaleMechanism) &&
        /GENUINE/.test(h.genuineFloorVerdict)
      );
    },
  },
  {
    id: 'imp95665-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, residual stays a GENUINE FLOOR, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95665_GENUINE_FLOOR_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95665_GENUINE_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95665_GENUINE_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      /GENUINE/.test(IMP95665_GENUINE_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      IMP95665_GENUINE_FLOOR_GLOSSARY_HEADWORD.glosses === 'imp-95642' &&
      IMP95665_GENUINE_FLOOR_GLOSSARY_HEADWORD.scopes === 'imp-95419',
  },
];

for (const assertion of IMP95665_GENUINE_FLOOR_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-95665-genuine-floor-glossary-headword assertion failed: ${assertion.id}`);
  }
}
