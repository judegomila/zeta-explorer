/**
 * @module imp-36227-en-threefold-imp321-ladder-viz-data
 * @fileoverview imp-36227 -- lightweight, import-light viz-data module (baked
 *   literals, no heavy imports, per [[no_heavy_imports_in_pages]]) for a chart
 *   of the pinned-constants E(N) = E_trunc + E_flow + E_coll threefold
 *   (imp-35889 / imp-35968 / imp-35971 sub-terms) evaluated across the SEVEN
 *   imp-321 ladder N rungs (PT_SCALE_EXTRAPOLATION.ladder: N = 2458, 5000,
 *   1e4, 1e5, 1e6, 1e7, 1e8), highlighting the imp-35164 / imp-2631
 *   E_trunc = 3.06e-5 fixed-strip floor and locating the E_trunc = E_coll
 *   crossover (imp-35968 sigma = 1/2 landmark, N_cross ~ 3.28e9) relative to
 *   the ladder.
 *
 *   Every row on the imp-321 ladder tops out at N = 1e8, which sits ~1.52
 *   decades BELOW N_cross -- so across the whole ladder E_coll strictly
 *   dominates (shareColl 0.84-0.90) while shareTrunc is a small but strictly
 *   INCREASING floor contribution (0.12% at N=2458 rising to 15.9% at
 *   N=1e8). The chart makes visible that the fixed E_trunc floor never
 *   vanishes and is already closing the gap on E_coll by the ladder's top
 *   rung, well before the ladder reaches the crossover.
 *
 *   The literals are copied verbatim from a plain-node evaluation of the
 *   IDENTICAL imp-3406/imp-33582 sub-terms used by imp-35968 /
 *   imp-35971-etrunc-sole-survivor-height.js (effectiveHeightForN +
 *   C_C_PINNED import chain), run against PT_SCALE_EXTRAPOLATION.ladder
 *   (imp-321); this module does NOT re-run that chain, so importing it into
 *   a page costs nothing at load time (per
 *   [[verify_heavy_assertion_modules]]).
 *
 *   @see imp-321 PT_SCALE_EXTRAPOLATION.ladder (lambda-pt-scale-extrapolation.js -- the 7-row N ladder)
 *   @see imp-35164 (E(N) floors at E_trunc = 3.06e-5 on the current surrogate, does not tend to 0)
 *   @see imp-35968-e-trunc-coll-crossover-location.js (E_trunc = E_coll crossover N_cross ~ 3.28e9)
 *   @see imp-35889-e-share-decomposition-at-knees.js (the E_trunc/E_flow/E_coll split, source formula)
 *   @see imp-2631 (E_trunc = 3.06e-5 fixed-strip floor, N-independent)
 *
 *   Ticket: imp-36227 (ux, medium). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; NO QED.
 */

// The seven imp-321 ladder rows, E(N) = E_trunc + E_flow + E_coll split via
// the pinned imp-3406/imp-33582 sub-terms (E_trunc = 3.06e-5 fixed, imp-2631;
// E_flow = C_F (logT0/T0) exp(GronwallBound), imp-838/imp-2637; E_coll =
// C_C_PINNED sqrt(logT0/N), imp-2642/imp-2643).
export const IMP36227_EN_THREEFOLD_LADDER = Object.freeze([
  { N: 2458, logT0: 8.003043, E_trunc: 3.06e-5, E_flow: 3.053001e-3, E_coll: 2.189688e-2, E_N: 2.498048e-2, shareTrunc: 0.001225, shareFlow: 0.122215, shareColl: 0.87656 },
  { N: 5000, logT0: 8.603208, E_trunc: 3.06e-5, E_flow: 1.951721e-3, E_coll: 1.591808e-2, E_N: 1.79004e-2, shareTrunc: 0.001709, shareFlow: 0.109032, shareColl: 0.889258 },
  { N: 1e4, logT0: 9.198147, E_trunc: 3.06e-5, E_flow: 1.239194e-3, E_coll: 1.163847e-2, E_N: 1.290826e-2, shareTrunc: 0.002371, shareFlow: 0.096, shareColl: 0.901629 },
  { N: 1e5, logT0: 11.2242, E_trunc: 3.06e-5, E_flow: 2.477034e-4, E_coll: 4.065587e-3, E_N: 4.343891e-3, shareTrunc: 0.007044, shareFlow: 0.057023, shareColl: 0.935932 },
  { N: 1e6, logT0: 13.305135, E_trunc: 3.06e-5, E_flow: 4.399126e-5, E_coll: 1.399765e-3, E_N: 1.474357e-3, shareTrunc: 0.020755, shareFlow: 0.029838, shareColl: 0.949408 },
  { N: 1e7, logT0: 15.423424, E_trunc: 3.06e-5, E_flow: 7.173296e-6, E_coll: 4.765802e-4, E_N: 5.143535e-4, shareTrunc: 0.059492, shareFlow: 0.013946, shareColl: 0.926562 },
  { N: 1e8, logT0: 17.568621, E_trunc: 3.06e-5, E_flow: 1.097036e-6, E_coll: 1.608475e-4, E_N: 1.925446e-4, shareTrunc: 0.158924, shareFlow: 0.005698, shareColl: 0.835378 },
]);

export const IMP36227_E_TRUNC_FLOOR = 3.06e-5; // imp-2631 / imp-35164: fixed, N-independent

export const IMP36227_CROSSOVER = Object.freeze({
  N_cross: 3.280294e9, // imp-35968: E_trunc = E_coll balance (sigma = 1/2 landmark)
  log10_N_cross: 9.5159,
  sigma_at_cross: 0.499526,
  log10_N_ladder_top: 8, // imp-321 ladder top rung, N = 1e8
  decadesBeyondLadderTop: 1.5159, // N_cross sits ~1.52 decades ABOVE the ladder's top rung
});

export const IMP36227_EN_THREEFOLD_VIZ_DATA = {
  ticket: 'imp-36227',
  sourceTickets: ['imp-321', 'imp-35164', 'imp-35968', 'imp-35889', 'imp-2631'],
  ladder: IMP36227_EN_THREEFOLD_LADDER,
  eTruncFloor: IMP36227_E_TRUNC_FLOOR,
  crossover: IMP36227_CROSSOVER,
  note:
    'Across the entire imp-321 ladder (N = 2458 to N = 1e8) E_coll strictly dominates E(N) ' +
    '(shareColl 0.84-0.90), while the fixed E_trunc = 3.06e-5 floor (imp-2631/imp-35164) is a ' +
    'small but STRICTLY INCREASING share -- from 0.12% at N = 2458 to 15.9% at the ladder top ' +
    'N = 1e8 -- because E_coll and E_flow both shrink with N while E_trunc does not move at all. ' +
    'The E_trunc = E_coll crossover (imp-35968, N_cross ~ 3.28e9) sits ~1.52 decades ABOVE the ' +
    'ladder top, so the ladder never reaches the point where the floor takes over, but the rising ' +
    'shareTrunc column already shows the floor closing the gap.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the pinned-constants E(N) = E_trunc + E_flow + ' +
    'E_coll split (imp-35889/imp-35968 sub-terms) on the imp-321 ladder; adds no new derivation ' +
    'and changes no bound. Measurement only; certifies no W1 bound; establishes no operator ' +
    'positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631) and ' +
    'C_mb GUE-conditional (imp-486) are UNTOUCHED; the E(N) surrogate does NOT tend to 0 on the ' +
    'current model (imp-35164); imp-35337a stays OPEN; NO QED. No refereed bound is changed.',
};

export const IMP36227_VIZ_ASSERTIONS = [
  {
    id: 'imp36227-ladder-has-seven-rows-in-increasing-N',
    description: 'ladder has exactly the seven imp-321 rows in strictly increasing N',
    holds: () =>
      IMP36227_EN_THREEFOLD_LADDER.length === 7 &&
      IMP36227_EN_THREEFOLD_LADDER.every((r, i) => i === 0 || r.N > IMP36227_EN_THREEFOLD_LADDER[i - 1].N),
  },
  {
    id: 'imp36227-e-trunc-floor-constant-across-ladder',
    description: 'E_trunc is the fixed 3.06e-5 floor at every ladder row',
    holds: () => IMP36227_EN_THREEFOLD_LADDER.every((r) => r.E_trunc === IMP36227_E_TRUNC_FLOOR),
  },
  {
    id: 'imp36227-e-coll-dominates-every-row',
    description: 'E_coll is the dominant share (shareColl > shareTrunc and > shareFlow) at every ladder row',
    holds: () =>
      IMP36227_EN_THREEFOLD_LADDER.every((r) => r.shareColl > r.shareTrunc && r.shareColl > r.shareFlow),
  },
  {
    id: 'imp36227-share-trunc-strictly-increasing',
    description: 'shareTrunc strictly increases along the ladder as E_coll/E_flow shrink and E_trunc stays fixed',
    holds: () =>
      IMP36227_EN_THREEFOLD_LADDER.every(
        (r, i) => i === 0 || r.shareTrunc > IMP36227_EN_THREEFOLD_LADDER[i - 1].shareTrunc
      ),
  },
  {
    id: 'imp36227-shares-sum-to-one-each-row',
    description: 'shareTrunc + shareFlow + shareColl ~ 1 at each ladder row',
    holds: () =>
      IMP36227_EN_THREEFOLD_LADDER.every((r) => Math.abs(r.shareTrunc + r.shareFlow + r.shareColl - 1) < 1e-3),
  },
  {
    id: 'imp36227-crossover-beyond-ladder-top',
    description: 'the E_trunc = E_coll crossover N_cross sits strictly above the ladder top (N = 1e8)',
    holds: () =>
      IMP36227_CROSSOVER.N_cross > IMP36227_EN_THREEFOLD_LADDER[IMP36227_EN_THREEFOLD_LADDER.length - 1].N &&
      IMP36227_CROSSOVER.decadesBeyondLadderTop > 0,
  },
  {
    id: 'imp36227-crossover-sigma-near-one-half',
    description: 'sigma at the crossover is ~1/2 (the imp-35968/imp-35337 landmark)',
    holds: () => Math.abs(IMP36227_CROSSOVER.sigma_at_cross - 0.5) < 5e-3,
  },
  {
    id: 'imp36227-honesty-gate-no-qed',
    description: 'honest status references measurement-only, imp-486, imp-35164 (does not tend to 0), NO QED, no refereed bound is changed',
    holds: () =>
      /VIZ-DATA ONLY/.test(IMP36227_EN_THREEFOLD_VIZ_DATA.honest) &&
      /imp-486/.test(IMP36227_EN_THREEFOLD_VIZ_DATA.honest) &&
      /does NOT tend to 0/.test(IMP36227_EN_THREEFOLD_VIZ_DATA.honest) &&
      /NO QED/.test(IMP36227_EN_THREEFOLD_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP36227_EN_THREEFOLD_VIZ_DATA.honest),
  },
];

for (const a of IMP36227_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36227-en-threefold-imp321-ladder-viz-data assertion failed: ${a.id}`);
  }
}
