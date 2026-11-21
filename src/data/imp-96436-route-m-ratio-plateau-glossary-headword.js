/**
 * @module imp-96436-route-m-ratio-plateau-glossary-headword
 * @fileoverview imp-96436 -- import-light glossary/Concepts headword for the imp-96105 finding
 *   that the Route M Nyman-Beurling Burnol-normalized quantity ratio(N) does NOT tighten toward
 *   1 through N=6000 -- the extended Vasyunin Gram ladder reconfirms a finite-N plateau, not a
 *   resolved convergence.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96105 rebuilt the exact Vasyunin Gram to NMAX=6000 (from the imp-96094 NMAX=2600 cap)
 *   and extended the ratio(N) ladder into N in {3000,...,6000}. A reader landing on imp-96105
 *   cold has no quick-lookup definition of what ratio(N) is, what "plateau" means here, or why
 *   the extension does not settle the question. This headword bakes those facts VERBATIM (no
 *   re-import of the imp-96105 module, to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   ratio(N) = d_N^2 * log(N) / C_burnol, where d_N^2 = 1 - b.G^{-1}.b is the Route M
 *   Nyman-Beurling distance functional over the exact SPD Vasyunin Gram G_{hk} and
 *   C_burnol = Sum_rho 1/|rho|^2 is the Burnol constant. RH + simple zeros would give
 *   ratio(N) -> 1 asymptotically. Extending the Gram from NMAX=2600 to NMAX=6000, every new
 *   rung (N>2600) sits BELOW 1 in [0.9639, 0.9856]; the full 250..6000 ladder oscillates in a
 *   ~4.6 percent band with six sign changes, non-monotone, worst deviation 0.0361 -- the SAME
 *   magnitude as the pre-extension worst (0.0360). A smooth 1/logN + 1/logN^2 refit over the
 *   extended ladder fits WORSE (max residual 0.0254 vs 0.0216) and extrapolates const 0.837,
 *   not 1.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96105 measurement and its headline figures for
 *   quick reference. It establishes nothing, instantiates no interval, closes no sub-gap, moves
 *   no bound. Measurement/numerics only, NOT an RH bound; NO QED. No refereed bound is changed.
 *
 * @see imp-96105-route-m-vasyunin-gram-extend-n6000 (source: the N=6000 extension this glosses)
 * @see imp-96094-route-m-burnol-ratio-dense-ladder (the pre-extension N<=2600 dense ladder)
 * @see imp-96325-route-m-vasyunin-gram-n1e4-run (the later N=1e4 run: still no tightening)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling (conditioning does not cap the reach)
 *
 * Ticket: imp-96436 (content, sonnet-4-6, sonnet). Documentation only; establishes nothing; NO
 * QED; no refereed bound is changed.
 */

// The Route-M ratio(N) plateau headword, baked verbatim (no re-import).
const ROUTE_M_RATIO_PLATEAU_HEADWORD = Object.freeze({
  key: 'imp-96105-route-m-ratio-plateau-not-tightening',
  term: 'imp-96105 verdict: the Route M Burnol-normalized ratio(N) does NOT tighten toward 1 through N=6000',
  definition:
    'ratio(N) = d_N^2 * log(N) / C_burnol, the Route M Nyman-Beurling Burnol-normalized quantity ' +
    'built from the exact SPD Vasyunin Gram G_{hk} = gcd(h,k) I(h/gcd,k/gcd)/(hk). RH + simple ' +
    'zeros would give ratio(N) -> 1 asymptotically. Extending the Gram from the imp-96094 ' +
    'NMAX=2600 cap to NMAX=6000, every new rung (N>2600) sits below 1 in [0.9639, 0.9856]; the ' +
    'full 250..6000 ladder has band [0.9639, 1.0102], spread ~4.6 percent, six sign changes, ' +
    'non-monotone.',
  noTightening:
    'The N>2600 extension sub-band has spread ~2.17 percent and worst deviation |1 - ratio| = ' +
    '0.0361 (at N=3500) -- the SAME magnitude as the pre-extension worst (0.0360 at N=750). A ' +
    'smooth 1/logN + 1/logN^2 refit over the extended ladder fits WORSE than the pre-extension ' +
    'fit (max residual 0.0254 vs 0.0216) and extrapolates const 0.837, not 1: the remainder is ' +
    'genuine non-smooth lower-order structure, not conditioning noise (lam_min stays positive ' +
    'and decreases smoothly, 2.06e-5 at N=250 to 4.69e-8 at N=6000, so the Gram is SPD ' +
    'throughout).',
  status:
    'Whether ratio(N) -> 1 manifests only for N well beyond 6000 remained undecided at imp-96105 ' +
    'time; later runs (imp-96325 to N=1e4, eight sign changes, same 0.0361 worst deviation) and ' +
    'the imp-96428 conditioning-ceiling analysis (conditioning does not cap the reach until ' +
    'N ~ 2.16e5 to 1e7) confirm the plateau persists and is not a numerical-conditioning ' +
    'artifact.',
});

export const IMP96436_ROUTE_M_RATIO_PLATEAU_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96436',
  proofSection: 'S-frontier',
  glosses: 'imp-96105',
  scopes: 'imp-96094',
  question:
    'imp-96105 extended the imp-96094 Route M Burnol-normalized ratio(N) ladder from NMAX=2600 ' +
    'to NMAX=6000. What is ratio(N), and why does the extension not resolve it into a monotone ' +
    'approach to 1, for a reader landing on imp-96105 cold?',
  headword: ROUTE_M_RATIO_PLATEAU_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96105 verdict: ' +
    'extending the SPD Vasyunin Gram from NMAX=2600 to NMAX=6000 does NOT resolve ratio(N) into ' +
    'a monotone approach to the Burnol constant -- every new rung sits below 1, the full ladder ' +
    'oscillates in a ~4.6 percent band with six sign changes, and a smooth 1/logN model fits ' +
    'worse. Establishes nothing; instantiates no interval; moves no bound; measurement only, NOT ' +
    'an RH bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96105 (N=6000 extension and headline figures); imp-96094 (pre-extension N<=2600 dense ' +
    'ladder); imp-96325 (later N=1e4 run, same plateau); imp-96428 (conditioning does not cap ' +
    'the reach).',
});

export default IMP96436_ROUTE_M_RATIO_PLATEAU_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96436_ROUTE_M_RATIO_PLATEAU_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96436-headword-has-required-fields',
    why: 'The headword must name ratio(N), the NMAX=2600->6000 extension, and the no-tightening verdict -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96436_ROUTE_M_RATIO_PLATEAU_GLOSSARY_HEADWORD.headword;
      return (
        /d_N\^2 \* log\(N\) \/ C_burnol/.test(h.definition) &&
        /NMAX=6000/.test(h.definition) &&
        /0\.9639/.test(h.definition) &&
        /0\.0361/.test(h.noTightening) &&
        /WORSE/.test(h.noTightening)
      );
    },
  },
  {
    id: 'imp96436-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96436_ROUTE_M_RATIO_PLATEAU_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96436_ROUTE_M_RATIO_PLATEAU_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96436_ROUTE_M_RATIO_PLATEAU_GLOSSARY_HEADWORD.verdict) &&
      IMP96436_ROUTE_M_RATIO_PLATEAU_GLOSSARY_HEADWORD.glosses === 'imp-96105' &&
      IMP96436_ROUTE_M_RATIO_PLATEAU_GLOSSARY_HEADWORD.scopes === 'imp-96094',
  },
];

for (const assertion of IMP96436_ROUTE_M_RATIO_PLATEAU_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-96436-route-m-ratio-plateau-glossary-headword assertion failed: ${assertion.id}`);
  }
}
