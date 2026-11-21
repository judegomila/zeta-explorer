/**
 * @module imp-36026-eN-term-elimination-cascade-viz-data
 * @fileoverview imp-36026 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-35971 E(N) = E_trunc + E_flow +
 *   E_coll TERM-ELIMINATION CASCADE: the three landmark heights along the sigma -> 0 tail
 *   where E_flow drops below 1% of E_trunc, where E_trunc = E_coll (sigma = 0.5), and where
 *   E_coll finally drops below 1% of E_trunc (leaving E_trunc as the sole non-negligible term).
 *
 *   The three landmark N / log10N values are copied verbatim from a plain-node evaluation of
 *   imp-35971-etrunc-sole-survivor-height.js and imp-35950-etrunc-ecoll-crossover-height.js
 *   (no dev-server ssrLoadModule, per [[verify_heavy_assertion_modules]]).
 *
 *   @see imp-35971-etrunc-sole-survivor-height.js (source: E_flow 1% crossing, E_coll 1% / sole-survivor crossing)
 *   @see imp-35950-etrunc-ecoll-crossover-height.js (source: E_trunc = E_coll sigma = 0.5 crossover)
 *   @see imp-35998-w1-apriori-error-ladder-viz-data.js (sibling viz-data ladder pattern)
 *
 *   Ticket: imp-36026 (ux, low). Viz-data only, presentation/no-bound-change; RH-equivalent
 *   untouched; NO QED.
 */

// The three landmark heights of the E(N) term-elimination cascade, height-ordered from the
// earliest term to fall away (E_flow) to the last (E_coll, leaving E_trunc as sole survivor).
export const IMP36026_TERM_ELIMINATION_CASCADE = Object.freeze([
  {
    stage: 'E_flow < 1% of E_trunc',
    N: 4.623e8,
    log10N: 8.6649,
    description: 'E_flow falls below 1% of the fixed E_trunc floor; earliest term to vanish',
    source: 'imp-35971',
  },
  {
    stage: 'E_trunc = E_coll (sigma = 0.5)',
    N: 3.267235e9,
    log10N: 9.5142,
    description: 'E_trunc = E_coll crossover (sigma = 0.5); E_flow already negligible (share ~0.1%)',
    source: 'imp-35950',
  },
  {
    stage: 'E_coll < 1% of E_trunc (sole survivor)',
    N: 4.7214e13,
    log10N: 13.6741,
    description: 'E_coll falls below 1% of E_trunc; E_trunc alone stands as the sole non-negligible term',
    source: 'imp-35971',
  },
]);

export const IMP36026_SCALES = Object.freeze({
  cascadeLength: IMP36026_TERM_ELIMINATION_CASCADE.length,
  decadesFirstToLast: 5.0091, // log10(4.7214e13) - log10(4.623e8), matches imp-35971 decadesFlowBeforeColl ~5.0092
});

export const IMP36026_CASCADE_VIZ_DATA = {
  ticket: 'imp-36026',
  sourceTickets: ['imp-35971', 'imp-35950'],
  cascade: IMP36026_TERM_ELIMINATION_CASCADE,
  scales: IMP36026_SCALES,
  note:
    'Three landmark heights of the E(N) = E_trunc + E_flow + E_coll term-elimination cascade ' +
    'down the sigma -> 0 tail: E_flow drops below 1% of the fixed E_trunc floor first, at ' +
    'N ~ 4.62e8 (imp-35971); E_trunc = E_coll crosses at sigma = 0.5, N ~ 3.267e9 (imp-35950), ' +
    'with E_flow already negligible there; and E_coll itself finally drops below 1% of E_trunc ' +
    'at N ~ 4.7214e13 (imp-35971), leaving E_trunc as the sole non-negligible term across ' +
    '~5.01 decades of height.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-35971 / imp-35950 term-elimination ' +
    'landmarks; adds no new derivation and changes no bound. C_C = (1/8) sqrt(3 pi) ' +
    '(imp-2642 / imp-2643) and E_trunc = 3.06e-5 (imp-2631) are UNTOUCHED; C_mb GUE-conditional ' +
    '(imp-486) untouched; imp-35337a stays OPEN; NO QED. No refereed bound is changed.',
};

export const IMP36026_VIZ_ASSERTIONS = [
  {
    id: 'imp36026-cascade-three-stages',
    description: 'cascade has exactly the three landmark stages',
    holds: () => IMP36026_TERM_ELIMINATION_CASCADE.length === 3,
  },
  {
    id: 'imp36026-cascade-strictly-increasing-height',
    description: 'the three landmark heights are strictly increasing in N (and log10N)',
    holds: () =>
      IMP36026_TERM_ELIMINATION_CASCADE.every(
        (r, i) =>
          i === 0 ||
          (r.N > IMP36026_TERM_ELIMINATION_CASCADE[i - 1].N &&
            r.log10N > IMP36026_TERM_ELIMINATION_CASCADE[i - 1].log10N),
      ),
  },
  {
    id: 'imp36026-middle-stage-is-sigma-half-crossover',
    description: 'the middle stage is the E_trunc = E_coll sigma = 0.5 crossover between the two 1% crossings',
    holds: () => /sigma = 0.5/.test(IMP36026_TERM_ELIMINATION_CASCADE[1].stage),
  },
  {
    id: 'imp36026-decades-span-matches-imp35971',
    description: 'the first-to-last decade span matches the imp-35971 decadesFlowBeforeColl (~5.0092)',
    holds: () => Math.abs(IMP36026_SCALES.decadesFirstToLast - 5.0092) < 2e-3,
  },
  {
    id: 'imp36026-honesty-gate-no-qed',
    description: 'honest status references viz-data-only, untouched constants, imp-35337a OPEN, NO QED, no refereed bound is changed',
    holds: () =>
      /VIZ-DATA ONLY/.test(IMP36026_CASCADE_VIZ_DATA.honest) &&
      /UNTOUCHED/.test(IMP36026_CASCADE_VIZ_DATA.honest) &&
      /imp-35337a stays OPEN/.test(IMP36026_CASCADE_VIZ_DATA.honest) &&
      /NO QED/.test(IMP36026_CASCADE_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP36026_CASCADE_VIZ_DATA.honest),
  },
];

for (const a of IMP36026_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36026-eN-term-elimination-cascade-viz-data assertion failed: ${a.id}`);
  }
}
