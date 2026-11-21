/**
 * @module imp-35121-ecoll-etrunc-eflow-decomposition-viz-data
 * @fileoverview imp-35121 -- lightweight, import-light literal data for a
 *   three-series shared-axis component chart of the imp-33601/imp-33602
 *   surrogate E(N) = E_coll(N) + E_trunc + E_flow(N) decomposition across
 *   N in [1e6, 1e13], visually exposing which term dominates at each of the
 *   four imp-33601-family landmarks: the imp-3406 sigma peak (N ~ 9.22e5),
 *   the imp-33582 N_half (N ~ 3.267e9, sigma = 1/2 exactly by construction),
 *   the imp-33723 closed-form N_cross (N ~ 3.280294e9, E_coll = E_trunc),
 *   and the imp-33721 ramp inflection N_star (N ~ 3.38e9).
 *
 *   Values below are baked reference literals reproduced from the exact
 *   imp-33601 `parts(N)` component model (E_coll = C_C_PINNED*sqrt(logT0/N),
 *   E_trunc = 3.06e-5 fixed, E_flow = C_F*(logT0/T0)*Gronwall via the same
 *   Riemann-von Mangoldt effectiveHeightForN inverse) -- this module does
 *   NOT re-run that computation or import the surrounding polymath15/dyson
 *   dependency chain, so importing it into a page costs nothing at load
 *   time (mirrors the imp-33628 pattern).
 *
 *   @see imp-33601-sigma-half-vs-crossover-eflow-offset.js (the source parts(N) model)
 *   @see imp-33602-etrunc-ecoll-component-ladder.js (the two-term decade ladder)
 *   @see imp-33628-etrunc-ecoll-crossover-viz-data.js (sibling two-series viz, same pattern)
 *   @see imp-3406-sigma-highN-extrapolation.js (sigma peak landmark, N ~ 9.22e5)
 *   @see imp-33723-sigma-half-vs-crossover-closed-form.js (closed-form N_cross)
 *   @see imp-33721-sigma-ramp-inflection-subdecade.js (N_star ramp inflection)
 *   @see imp-35105 (pending tabulation companion of this same decomposition)
 *   @see Imp35121EcollEtruncEflowDecompositionViz.jsx (imp-35160: the page
 *     consumer -- route /viz-imp35121-ecoll-etrunc-eflow-decomposition,
 *     cross-linked from the imp-33628 and imp-35161 sibling pages)
 *
 *   Ticket: imp-35121 (ux, medium). Visualization only on the inherited
 *   imp-3220/imp-3406 surrogate; C_mb GUE-conditional per imp-486; changes
 *   no bound; establishes no operator positivity; imp-3066 K_a >= 0
 *   untouched; NO QED. No refereed bound is changed.
 */

// One point per decade, N = 1e6 .. 1e13, from the imp-33601 parts(N) model.
export const IMP35121_LADDER = Object.freeze([
  { N: 1e6, E_coll: 1.399765e-3, E_trunc: 3.06e-5, E_flow: 4.399126e-5, sigma: 0.949408 },
  { N: 1e7, E_coll: 4.765802e-4, E_trunc: 3.06e-5, E_flow: 7.173296e-6, sigma: 0.926562 },
  { N: 1e8, E_coll: 1.608475e-4, E_trunc: 3.06e-5, E_flow: 1.097036e-6, sigma: 0.835378 },
  { N: 1e9, E_coll: 5.390807e-5, E_trunc: 3.06e-5, E_flow: 1.596328e-7, sigma: 0.636702 },
  { N: 1e10, E_coll: 1.796464e-5, E_trunc: 3.06e-5, E_flow: 2.232663e-8, sigma: 0.369742 },
  { N: 1e11, E_coll: 5.958471e-6, E_trunc: 3.06e-5, E_flow: 3.023626e-9, sigma: 0.162971 },
  { N: 1e12, E_coll: 1.968477e-6, E_trunc: 3.06e-5, E_flow: 3.986902e-10, sigma: 0.06044 },
  { N: 1e13, E_coll: 6.481298e-7, E_trunc: 3.06e-5, E_flow: 5.140257e-11, sigma: 0.020741 },
]);

// The four imp-33601-family landmarks, each with the full component readout
// so the chart can show which of E_coll/E_trunc/E_flow dominates there.
export const IMP35121_LANDMARKS = Object.freeze([
  {
    key: 'peak',
    label: 'imp-3406 sigma peak',
    N: 9.219e5,
    E_coll: 1.453781e-3,
    E_trunc: 3.06e-5,
    E_flow: 4.683509e-5,
    sigma: 0.9494,
    dominant: 'E_coll',
  },
  {
    key: 'N_half',
    label: 'imp-33582 N_half (sigma=1/2)',
    N: 3.267235e9,
    E_coll: 3.065832e-5,
    E_trunc: 3.06e-5,
    E_flow: 5.831525e-8,
    sigma: 0.5,
    dominant: 'E_coll (exactly balances E_trunc+E_flow)',
  },
  {
    key: 'N_cross',
    label: 'imp-33723 N_cross (E_coll=E_trunc)',
    N: 3.280294352e9,
    E_coll: 3.06e-5,
    E_trunc: 3.06e-5,
    E_flow: 5.811677e-8,
    sigma: 0.499526,
    dominant: 'E_coll = E_trunc (tie)',
  },
  {
    key: 'N_star',
    label: 'imp-33721 N_star (ramp inflection)',
    N: 3.38e9,
    E_coll: 3.016579e-5,
    E_trunc: 3.06e-5,
    E_flow: 5.664819e-8,
    sigma: 0.495965,
    dominant: 'E_trunc',
  },
]);
