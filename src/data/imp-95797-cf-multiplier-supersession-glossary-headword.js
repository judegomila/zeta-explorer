/**
 * @module imp-95797-cf-multiplier-supersession-glossary-headword
 * @fileoverview imp-95797 -- import-light glossary/Concepts headword for the CF_BAND_HI
 *   multiplier supersession chain: imp-95691 pinned 1.29615 (geometric-mean of the
 *   imp-1134 integrated reach) -> imp-95705 MEASURED 1.914x (direct integrated
 *   direction-flip reach) -> imp-95721 derived an edge-dominated, cutoff-dependent
 *   6.1x-8.6x density-weighted band -> imp-95747 found the GUE pair-correlation
 *   repulsion regularizes the near-anchor divergence to a cutoff-INDEPENDENT converged
 *   value r_eff_GUE = 9.583x.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   Four modules in sequence each supersede the previous one's CF_BAND_HI estimate, and
 *   imp-95691's own header already carries a "SUPERSEDED" note pointing forward through
 *   the chain -- but a reader landing on any ONE of the four modules cold has to chase
 *   three separate files to reconstruct why the number moved four times and which value
 *   is currently the honest one to cite. This headword bakes the whole chain (VERBATIM
 *   values, no re-import, to stay import-light) as a single standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The upper edge of the imp-398 C_F provenance band (CF_BAND_HI) was estimated four
 *   times with increasing rigor, each superseding the last:
 *     1. imp-95691 PINNED CF_BAND_HI_PINNED = sqrt(1.2*1.4) = 1.29615, the geometric
 *        mean of the imp-1134 integrated-reach range [1.2, 1.4] -- a downweighted
 *        estimate of the fixed-alpha local flip ratio, not a direct measurement.
 *     2. imp-95705 MEASURED the integrated direction-flip reach directly: 1.914x at the
 *        bulk-midpoint representative (uniform bulk average 2.632x) -- already ~1.5x
 *        above the imp-95691 pin.
 *     3. imp-95721 found the density-weighted effective multiplier r_eff is EDGE-
 *        dominated (reach(alpha) ~ K_NEAR/(1-alpha) against a near-flat RvM weight,
 *        log-divergent at the anchor), giving a cutoff-scalar-dependent band from
 *        6.1x (10 mean-spacing cutoff) to 8.6x (1 mean-spacing cutoff).
 *     4. imp-95747 reweighted that density by the GUE pair-correlation form factor
 *        g(x) = 1 - (sin(pi x)/(pi x))^2, which vanishes quadratically as separation
 *        x->0 and cancels the 1/(1-alpha) singularity linearly, REGULARIZING the
 *        log-divergence: r_eff SATURATES at a cutoff-independent r_eff_GUE = 9.583x
 *        (vs. the flat-RvM value still climbing past 18x at a 1e-4-spacing cutoff).
 *   All of 1.914x, the 6.1x-8.6x band, and 9.583x sit ABOVE the imp-95691 geometric-mean
 *   pin 1.29615x. imp-95747's 9.583x is the current most defensible single CF_BAND_HI
 *   representative because it no longer depends on an arbitrary near-anchor cutoff
 *   choice, unlike the imp-95721 band it supersedes.
 *
 *   MECHANISM: each step in the chain replaces a downweighted/heuristic estimate with a
 *   more direct measurement or a more physically complete weighting -- first swapping a
 *   fixed-alpha local ratio for an integrated-reach average (imp-95705), then swapping a
 *   flat density for the correctly edge-dominated one (imp-95721), then swapping the
 *   bare RvM density for the GUE-repulsion-corrected one that removes the residual
 *   cutoff-dependence (imp-95747). Every honest revision in the chain moves CF_BAND_HI
 *   UPWARD, monotonically deepening the same imp-95617 box-min inversion wedge rather
 *   than healing or migrating it (per imp-95691's own re-run at each pinned value).
 *
 *   STATUS: numerical measurement/sensitivity chain only. r_eff_GUE = 9.583x is the
 *   current honest CF_BAND_HI representative pending any further supersession; the
 *   imp-95691 pin 1.29615 is KEPT UNCHANGED in that module because other modules
 *   depend on its exact value, but downstream readers should cite 9.583x.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95691/95705/95721/95747 supersession
 *   chain for quick reference. It establishes nothing, instantiates no interval, closes
 *   no sub-gap, moves no bound beyond what those four modules already measured. NO QED.
 *   No refereed bound is changed.
 *
 * @see imp-95691-cf-band-hi-pinned-wedge-opening (chain link 1: geometric-mean pin 1.29615)
 * @see imp-95705-cf-integrated-reach-measured (chain link 2: measured 1.914x)
 * @see imp-95721-cf-alpha-weight-density-pinned (chain link 3: edge-dominated 6.1x-8.6x band)
 * @see imp-95747-cf-reff-gue-repulsion-regularization (chain link 4: converged 9.583x)
 *
 * Ticket: imp-95797 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The CF_BAND_HI multiplier supersession-chain headword, baked verbatim (no re-import).
const CF_MULTIPLIER_SUPERSESSION_HEADWORD = Object.freeze({
  key: 'cf-band-hi-multiplier-supersession-chain',
  term:
    'CF_BAND_HI multiplier supersession chain (1.29615 pin -> 1.914x -> 6.1x-8.6x band -> 9.583x converged)',
  definition:
    'Four successive estimates of the upper edge of the imp-398 C_F provenance band, ' +
    'each superseding the last: imp-95691 pinned CF_BAND_HI_PINNED = sqrt(1.2*1.4) = ' +
    '1.29615 (geometric mean of the imp-1134 integrated-reach range); imp-95705 ' +
    'MEASURED the integrated direction-flip reach directly at 1.914x (bulk-midpoint); ' +
    'imp-95721 found the density-weighted effective multiplier is edge-dominated and ' +
    'cutoff-dependent, ranging 6.1x-8.6x; imp-95747 reweighted by the GUE pair-' +
    'correlation form factor and found the divergence regularizes to a cutoff-' +
    'independent converged value r_eff_GUE = 9.583x, the current honest representative.',
  mechanism:
    'Each link replaces a coarser estimate with a more direct measurement or a more ' +
    'physically complete weighting: fixed-alpha ratio -> integrated-reach average -> ' +
    'edge-dominated density weighting -> GUE-repulsion-corrected weighting that ' +
    'cancels the near-anchor 1/(1-alpha) singularity linearly (g(x) ~ (pi^2/3)x^2 as ' +
    'x->0), removing the residual cutoff-dependence left by imp-95721.',
  verificationStatus:
    'All four values are monotonically increasing (1.29615 < 1.914 < 6.1-8.6 < 9.583) ' +
    'and every one sits above the prior pin, so each honest revision deepens rather ' +
    'than heals the imp-95617 box-min inversion wedge. r_eff_GUE = 9.583x is the ' +
    'current most defensible single CF_BAND_HI representative since it no longer ' +
    'depends on an arbitrary near-anchor cutoff choice. Numerical measurement chain ' +
    'only -- no bound moved beyond what imp-95691/95705/95721/95747 already measured.',
});

export const IMP95797_CF_MULTIPLIER_SUPERSESSION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95797',
  proofSection: 'S-frontier',
  glosses: 'imp-95691,imp-95705,imp-95721,imp-95747',
  question:
    'The CF_BAND_HI upper-multiplier estimate moved four times across imp-95691 ' +
    '(1.29615), imp-95705 (1.914x), imp-95721 (6.1x-8.6x), and imp-95747 (9.583x). ' +
    'What does each supersession step change, why does the number keep climbing, and ' +
    'which value is currently honest to cite, for a reader landing on any one of the ' +
    'four modules cold?',
  headword: CF_MULTIPLIER_SUPERSESSION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the four-step ' +
    'CF_BAND_HI supersession chain and identifies imp-95747 converged r_eff_GUE = ' +
    '9.583x as the current honest CF_BAND_HI representative, above the imp-95691 pin ' +
    '1.29615 that remains unchanged in its own module for downstream-dependency ' +
    'reasons. Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-95691 (geometric-mean pin 1.29615 and its own SUPERSEDED forward-pointer ' +
    'note); imp-95705 (measured integrated reach 1.914x); imp-95721 (edge-dominated ' +
    'cutoff-dependent 6.1x-8.6x band); imp-95747 (GUE-repulsion-regularized converged ' +
    '9.583x, the current representative).',
});

export default IMP95797_CF_MULTIPLIER_SUPERSESSION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95797_CF_MULTIPLIER_SUPERSESSION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95797-headword-has-required-fields',
    why: 'The headword must name all four chain values (1.29615, 1.914x, 6.1x-8.6x, ' +
      '9.583x) and identify the GUE-repulsion mechanism -- the entire point of the ' +
      'glossary entry.',
    holds: () => {
      const h = IMP95797_CF_MULTIPLIER_SUPERSESSION_GLOSSARY_HEADWORD.headword;
      return (
        /1\.29615/.test(h.definition) &&
        /1\.914x/.test(h.definition) &&
        /6\.1x-8\.6x/.test(h.definition) &&
        /9\.583x/.test(h.definition) &&
        /GUE/i.test(h.mechanism) &&
        /cutoff-dependence/i.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp95797-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95797_CF_MULTIPLIER_SUPERSESSION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95797_CF_MULTIPLIER_SUPERSESSION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95797_CF_MULTIPLIER_SUPERSESSION_GLOSSARY_HEADWORD.verdict) &&
      IMP95797_CF_MULTIPLIER_SUPERSESSION_GLOSSARY_HEADWORD.glosses ===
        'imp-95691,imp-95705,imp-95721,imp-95747',
  },
];

for (const assertion of IMP95797_CF_MULTIPLIER_SUPERSESSION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95797-cf-multiplier-supersession-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
