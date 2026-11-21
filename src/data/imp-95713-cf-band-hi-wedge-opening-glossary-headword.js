/**
 * @module imp-95713-cf-band-hi-wedge-opening-glossary-headword
 * @fileoverview imp-95713 -- import-light glossary/Concepts headword for the imp-95691 finding that
 *   pinning the imp-95674 C_F provenance-band upper edge CF_BAND_HI to a single defensible multiplier
 *   OPENS (never closes) the imp-95617 transition-before-knee inversion wedge by ~2.2x to ~3.4x.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95691 pinned CF_BAND_HI to the geometric mean of the imp-1134 integrated 1.2-1.4x reach and
 *   re-ran the imp-95658/imp-95617 box-min gap there. A reader landing on imp-95691/imp-95674/imp-95617
 *   cold has no quick-lookup definition of what CF_BAND_HI is, why the honest revision runs UPWARD, or
 *   what the resulting wedge-opening magnitude is. This headword bakes those facts VERBATIM (no
 *   re-import of the imp-95691 module, to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   CF_BAND_HI is the upper edge of the honest imp-95674 C_F provenance band -- the imp-1134 integrated
 *   direction-flip reach (~1.2x-1.4x), left unpinned by imp-95674. imp-95691 pinned it to the
 *   geometric mean CF_BAND_HI_PINNED = sqrt(1.2 * 1.4) ~ 1.29615 (the natural single representative of
 *   a multiplicative ratio interval) and re-ran the identical imp-95617 box-min gap sweep there: the
 *   min gap moves from -0.004682 (nominal, cf=1) to -0.013188 (pinned cf), an opening of -0.008506 dex,
 *   i.e. the inversion is ~2.82x DEEPER. The box-min corner stays fixed at (C_C 0.5x, E_trunc 1.5x) for
 *   every cf tested.
 *
 *   THE OPENING IS MONOTONE AND NEVER CLOSES
 *   -----------------------------------------------
 *   Across the pinned upper band the deepening factor rises monotonically with cf and never changes
 *   sign: ~2.23x at the conservative floor (cf=1.2, minGap -0.010441), ~2.82x at the pinned geometric
 *   mean (cf~1.29615, minGap -0.013188), and ~3.45x at the upper reach edge (cf=1.4, minGap -0.016134).
 *   Every honest UPWARD multiplier the imp-1134 provenance supports makes the box-min gap strictly more
 *   negative -- the wedge is opened by ~2.2x to ~3.4x across the pinned band, never closed (the wedge
 *   closes only for a DOWNWARD cf* ~ 0.839, which lies outside the honest band per imp-95674 K1).
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95691 measurement and its headline figures for quick
 *   reference. It establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   Sensitivity/measurement only, on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 *   asymptotic; the C_mb GUE-conditional per imp-486 is untouched; no QED. No refereed bound is changed
 *   . NOTE (honest status): the CF_BAND_HI_PINNED ~1.29615 value has since been superseded
 *   by a chain of sharper measurements (imp-95705 -> imp-95721 -> imp-95747, converging to 9.583x); see
 *   imp-95691's honestStatus field for the current representative.
 *
 * @see imp-95691-cf-band-hi-pinned-wedge-opening (source: the pinning + box-min re-evaluation this glosses)
 * @see imp-95674-cf-provenance-band-wedge-reachability (assembled the band; left CF_BAND_HI unpinned)
 * @see imp-95617-transition-knee-ordering-joint-2d (the joint sweep defining the wedge; nominal -0.00468)
 * @see imp-1134 c-f-bulk-refinement (C_F is a LOWER bound; integrated reach ~1.2-1.4x)
 * @see imp-95747-cf-reff-gue-repulsion-regularization (supersedes the pin with converged 9.583x)
 *
 * Ticket: imp-95713 (content, low). Documentation only; establishes nothing; NO QED; no refereed bound is changed.
 */

// The CF_BAND_HI wedge-opening headword, baked verbatim (no re-import).
const CF_BAND_HI_WEDGE_OPENING_HEADWORD = Object.freeze({
  key: 'imp-95617-wedge-opened-by-cf-band-hi-pin',
  term: 'imp-95691 verdict: pinning CF_BAND_HI opens the imp-95617 inversion wedge by ~2.2x-3.4x',
  definition:
    'CF_BAND_HI is the upper edge of the imp-95674 honest C_F provenance band (the imp-1134 integrated ' +
    '~1.2x-1.4x direction-flip reach), left unpinned by imp-95674. imp-95691 pinned it to the geometric ' +
    'mean CF_BAND_HI_PINNED = sqrt(1.2 * 1.4) ~ 1.29615 and re-ran the imp-95617 box-min gap there: the ' +
    'min gap moves from -0.004682 (nominal, cf=1) to -0.013188 (pinned cf) -- an opening of -0.008506 ' +
    'dex, i.e. the inversion wedge is ~2.82x DEEPER than nominal, at the same fixed box-min corner ' +
    '(C_C 0.5x, E_trunc 1.5x).',
  monotoneBand:
    'The deepening factor is monotone across the pinned upper band and never changes sign: ~2.23x at ' +
    'the conservative floor (cf=1.2, minGap -0.010441), ~2.82x at the pinned geometric mean (cf~1.29615, ' +
    'minGap -0.013188), ~3.45x at the upper reach edge (cf=1.4, minGap -0.016134). Every honest UPWARD ' +
    'multiplier the imp-1134 provenance supports opens the wedge further; it closes only for a DOWNWARD ' +
    'cf* ~ 0.839 that lies outside the honest band (imp-95674 K1).',
  attribution:
    'Since the honest C_F provenance revision runs strictly upward (the imp-1134 exact off-ladder ' +
    'denominator is < T^2, not >= T^2), the wedge-opening direction is forced: the transition-before-' +
    'knee inversion first identified in imp-95617 is deepened, never healed, by sharpening the C_F ' +
    'provenance band. This pins the imp-95674 K2 qualitative statement to a definite magnitude.',
});

export const IMP95713_CF_BAND_HI_WEDGE_OPENING_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95713',
  proofSection: 'S-frontier',
  glosses: 'imp-95691',
  scopes: 'imp-95617',
  question:
    'imp-95691 pinned the imp-95674 C_F provenance-band upper edge CF_BAND_HI to a single defensible ' +
    'multiplier and re-ran the imp-95617 box-min gap there. What is CF_BAND_HI, and by how much does ' +
    'pinning it open the wedge, for a reader landing on imp-95691/imp-95674/imp-95617 cold?',
  headword: CF_BAND_HI_WEDGE_OPENING_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95691 verdict: pinning ' +
    'CF_BAND_HI to the geometric mean of the imp-1134 integrated reach (cf ~ 1.29615) drives the ' +
    'imp-95617 box-min gap from -0.004682 to -0.013188 (~2.82x deeper), and every honest upward ' +
    'multiplier in the pinned band (~2.2x to ~3.4x deepening) opens the wedge further, never closing ' +
    'it. Establishes nothing; instantiates no interval; moves no bound; sensitivity/measurement only, ' +
    'NOT an RH bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-95691 (CF_BAND_HI pinning and box-min re-evaluation); imp-95674 (assembled the provenance ' +
    'band; left CF_BAND_HI unpinned); imp-95617 (nominal box-min gap -0.00468 at cf=1); imp-1134 ' +
    'c-f-bulk-refinement (C_F is a LOWER bound; integrated reach ~1.2-1.4x).',
});

export default IMP95713_CF_BAND_HI_WEDGE_OPENING_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95713_CF_BAND_HI_WEDGE_OPENING_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95713-headword-has-required-fields',
    why: 'The headword must name the pinned cf, the -0.004682 -> -0.013188 shift, and the fixed wedge corner -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95713_CF_BAND_HI_WEDGE_OPENING_GLOSSARY_HEADWORD.headword;
      return (
        /1\.29615/.test(h.definition) &&
        /-0\.004682/.test(h.definition) &&
        /-0\.013188/.test(h.definition) &&
        /C_C 0\.5x, E_trunc 1\.5x/.test(h.definition) &&
        /never changes sign/.test(h.monotoneBand) &&
        /forced/.test(h.attribution)
      );
    },
  },
  {
    id: 'imp95713-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95713_CF_BAND_HI_WEDGE_OPENING_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95713_CF_BAND_HI_WEDGE_OPENING_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95713_CF_BAND_HI_WEDGE_OPENING_GLOSSARY_HEADWORD.verdict) &&
      IMP95713_CF_BAND_HI_WEDGE_OPENING_GLOSSARY_HEADWORD.glosses === 'imp-95691' &&
      IMP95713_CF_BAND_HI_WEDGE_OPENING_GLOSSARY_HEADWORD.scopes === 'imp-95617',
  },
];

for (const assertion of IMP95713_CF_BAND_HI_WEDGE_OPENING_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-95713-cf-band-hi-wedge-opening-glossary-headword assertion failed: ${assertion.id}`);
  }
}
