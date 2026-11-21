/**
 * @module imp-95755-cf-alpha-flip-reach-edge-dominance-glossary-headword
 * @fileoverview imp-95755 -- import-light glossary/Concepts headword for the imp-95721
 *   edge-dominated density-weighted C_F flip-reach: reach(alpha) ~ K_NEAR/(1-alpha) against
 *   a near-flat RvM weight makes the effective multiplier r_eff near-anchor-EDGE-dominated
 *   (r_eff 6.1-8.6x at one-mean-spacing cutoff), not bulk-midpoint (1.914x).
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95721 derived the CF alpha-weight (the RvM density of off-ladder zeros weighting
 *   their flip contribution) and showed the resulting population-average multiplier is
 *   dominated by the near-anchor edge, not the bulk-midpoint heuristic k_star=0.5 that
 *   imp-95705 had used. A reader landing on that module cold has no quick-lookup definition
 *   of what "edge-dominated" means here or why it replaces the bulk-midpoint pick. This
 *   headword bakes those facts VERBATIM (no re-import of the imp-95721 module, to stay
 *   import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The closed-form flip-contribution reach(alpha) has the exact near-anchor law
 *   reach(alpha) ~ K_NEAR/(1-alpha) with K_NEAR = 0.860, diverging as the off-ladder height
 *   alpha*T0 approaches the anchor T0. Weighting reach(alpha) by the Riemann-von Mangoldt
 *   off-ladder density rho(alpha*T0) -- near-flat across the bulk -- makes the population-
 *   average integral r_eff(alpha_max) LOG-divergent at alpha_max -> 1: the near-anchor EDGE
 *   dominates the average, not the bulk midpoint. At the physical cutoff (nearest admissible
 *   off-ladder zero, one mean spacing s/T0 = 3.4085e-4 from the anchor), r_eff = 8.587x
 *   (c = 1 spacing), staying in [6.1, 8.6]x for c in [1,10] spacings -- 2.3x-3.3x above the
 *   heuristic uniform-bulk-average 2.632x and 3.2x-4.5x above the bulk-midpoint 1.914x.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95721 edge-dominance derivation and the
 *   resulting r_eff band for quick reference. It establishes nothing, instantiates no
 *   interval, closes no sub-gap, moves no bound. imp-2519 no-overclaim guard preserved;
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-95721-cf-alpha-weight-density-pinned (source: the edge-dominance derivation and r_eff band this glosses)
 * @see imp-95705-cf-integrated-reach-measured (the heuristic single-alpha reach profile this supersedes)
 * @see imp-95660-cf-multiplier-wedge-closure (the box-min gap model re-evaluated at the derived r_eff)
 *
 * Ticket: imp-95755 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The edge-dominance headword, baked verbatim (no re-import).
const CF_ALPHA_FLIP_REACH_EDGE_DOMINANCE_HEADWORD = Object.freeze({
  key: 'cf-alpha-flip-reach-edge-dominance',
  term: 'edge-dominated density-weighted C_F flip-reach (CF alpha-weight edge dominance)',
  definition:
    'The population-average effective multiplier r_eff(alpha_max) = ' +
    'int rho(alpha*T0) reach(alpha) dalpha / int rho(alpha*T0) dalpha, where reach(alpha) is ' +
    'the imp-95705 closed-form flip-contribution reach and rho(alpha*T0) is the near-flat ' +
    'Riemann-von Mangoldt off-ladder density. Because reach(alpha) ~ K_NEAR/(1-alpha) ' +
    'diverges as alpha -> 1 (imp-95721), the weighted integral is LOG-dominated by the ' +
    'near-anchor edge alpha_max -> 1, not by the bulk midpoint alpha = 0.5.',
  nearAnchorLaw:
    'reach(alpha)*(1-alpha) -> K_NEAR = 0.860 as alpha -> 1 (0.8961 at alpha=0.9, 0.8606 at ' +
    'alpha=0.9999): the flip contribution of an off-ladder zero diverges like 1/(1-alpha) as ' +
    'it approaches the anchor T0.',
  physicalCutoffBand:
    'With the physical near-anchor cutoff set to the nearest admissible off-ladder zero (one ' +
    'mean spacing s/T0 = 3.4085e-4 at T0 = 2990.04), r_eff = 8.587x at c = 1 spacing, and ' +
    'stays in [6.1, 8.6]x for c in [1,10] spacings -- ABOVE both the imp-95705 bulk-midpoint ' +
    'pick k_star = 0.5 (1.914x) and the heuristic uniform-bulk-average (2.632x, which itself ' +
    'is exactly this same integral truncated at the ad-hoc edge alpha_max = 0.9, r_eff = ' +
    '2.703x).',
  boxMinConsequence:
    'Re-running the imp-95658/imp-95617 box-min gap at the derived r_eff deepens minGap from ' +
    '-0.004682 (nominal) to -0.171451 (~36.6x) at the same fixed (C_C 0.5x, E_trunc 1.5x) ' +
    'wedge corner: the density-weighted, edge-dominated multiplier deepens the same wedge ' +
    'inversion far further than the bulk-midpoint heuristic, it does not migrate or heal it.',
});

export const IMP95755_CF_ALPHA_FLIP_REACH_EDGE_DOMINANCE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95755',
  proofSection: 'S-frontier',
  glosses: 'imp-95721',
  scopes: 'imp-95705',
  question:
    'imp-95721 derived the RvM-density-weighted CF alpha-weight and showed the resulting ' +
    'effective multiplier r_eff is dominated by the near-anchor edge, not the imp-95705 bulk-' +
    'midpoint heuristic k_star=0.5. What does "edge-dominated" mean here, why does the ' +
    'near-anchor 1/(1-alpha) reach law force it, and how large is the resulting r_eff band, ' +
    'for a reader landing on that module cold?',
  headword: CF_ALPHA_FLIP_REACH_EDGE_DOMINANCE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95721 edge-' +
    'dominance derivation: the RvM-density-weighted flip-reach average is log-divergent at ' +
    'the near-anchor edge because reach(alpha) ~ 0.860/(1-alpha), so the effective multiplier ' +
    'r_eff is set by the near-anchor cutoff (6.1-8.6x at physical cutoffs of 1-10 mean ' +
    'spacings) rather than by the bulk midpoint (1.914x). Establishes nothing; instantiates ' +
    'no interval; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-95721 (edge-dominance derivation and r_eff band); imp-95705 (heuristic single-alpha ' +
    'reach profile this supersedes); imp-95660 (box-min gap model re-evaluated at r_eff); ' +
    'imp-1134 (c-f-bulk-refinement; C_F is a lower bound).',
});

export default IMP95755_CF_ALPHA_FLIP_REACH_EDGE_DOMINANCE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95755_CF_ALPHA_FLIP_REACH_EDGE_DOMINANCE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95755-headword-has-required-fields',
    why: 'The headword must name the near-anchor 1/(1-alpha) divergence, the edge-dominance mechanism, and the physical r_eff band -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95755_CF_ALPHA_FLIP_REACH_EDGE_DOMINANCE_GLOSSARY_HEADWORD.headword;
      return (
        /\(1-alpha\)/.test(h.definition) &&
        /edge/i.test(h.definition) &&
        /K_NEAR = 0\.860/.test(h.nearAnchorLaw) &&
        /8\.587x/.test(h.physicalCutoffBand) &&
        /36\.6x/.test(h.boxMinConsequence)
      );
    },
  },
  {
    id: 'imp95755-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95755_CF_ALPHA_FLIP_REACH_EDGE_DOMINANCE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95755_CF_ALPHA_FLIP_REACH_EDGE_DOMINANCE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95755_CF_ALPHA_FLIP_REACH_EDGE_DOMINANCE_GLOSSARY_HEADWORD.verdict) &&
      IMP95755_CF_ALPHA_FLIP_REACH_EDGE_DOMINANCE_GLOSSARY_HEADWORD.glosses === 'imp-95721' &&
      IMP95755_CF_ALPHA_FLIP_REACH_EDGE_DOMINANCE_GLOSSARY_HEADWORD.scopes === 'imp-95705',
  },
];

for (const assertion of IMP95755_CF_ALPHA_FLIP_REACH_EDGE_DOMINANCE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95755-cf-alpha-flip-reach-edge-dominance-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
