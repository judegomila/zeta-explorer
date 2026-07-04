/**
 * @module imp-3929-horizon-elasticity-sharpening-viz-data
 * @fileoverview imp-3929 -- lightweight, import-light literal data for a
 *   visualization of the imp-3898 horizon-elasticity sharpening: per-plateau
 *   comparison of the realised elasticity (dPsi_N/dT)/Psi_N against the
 *   Dmin-based path-local proxy 8/Dmin^2 and the loose global 8/smin^2
 *   ceiling, on the 3 imp-3874-verified plateaus (0, 4, 9), showing the
 *   ~2000x-35000x tightening imp-3898 measured.
 *
 *   Values below are baked reference literals reproduced from
 *   imp-3898-path-local-elasticity-bound.js ROWS. This module does NOT
 *   import imp-3725 / imp-3874 / imp-3854 (and transitively no zeros
 *   bundle), so importing it into a page costs nothing at load time.
 *
 *   @see imp-3898-path-local-elasticity-bound.js (source derivation + live rows)
 *   @see imp-3874-dpsi-sensitivity-verification.js (realisedElasticity, globalCeil source)
 *   @see imp-3725-fmb-plateau-domination-lemma.js (Dmin, H source)
 *
 *   Ticket: imp-3929 (ux, low). Presentation only; measurement/derivation
 *   already certified by imp-3898; no new bound; NO QED.
 */

export const IMP3929_ROWS = Object.freeze([
  {
    plateauIndex: 0,
    realisedElasticity: 8.06298359,
    dminCeil: 7.712952705291778,
    globalCeil: 18374.6873,
    sharpRatio: 1.0453822158753896,
    globalSlack: 2278.8942945126346,
    dminVsGlobal: 2382.3155673434007,
  },
  {
    plateauIndex: 4,
    realisedElasticity: 14.5601443,
    dminCeil: 17.61416887534738,
    globalCeil: 34999.3348,
    sharpRatio: 0.826615459579148,
    globalSlack: 2403.7766438894428,
    dminVsGlobal: 1986.9989352142934,
  },
  {
    plateauIndex: 9,
    realisedElasticity: 17.4486876,
    dminCeil: 16.716980519945853,
    globalCeil: 593328.037,
    sharpRatio: 1.04377028968725,
    globalSlack: 34004.164129799654,
    dminVsGlobal: 35492.53624433379,
  },
]);

export const IMP3929_MIN_SHARP_RATIO = Math.min(...IMP3929_ROWS.map((r) => r.sharpRatio));
export const IMP3929_MAX_SHARP_RATIO = Math.max(...IMP3929_ROWS.map((r) => r.sharpRatio));
export const IMP3929_MIN_GLOBAL_SLACK = Math.min(...IMP3929_ROWS.map((r) => r.globalSlack));
export const IMP3929_MAX_GLOBAL_SLACK = Math.max(...IMP3929_ROWS.map((r) => r.globalSlack));
export const IMP3929_MIN_DMIN_VS_GLOBAL = Math.min(...IMP3929_ROWS.map((r) => r.dminVsGlobal));
export const IMP3929_MAX_DMIN_VS_GLOBAL = Math.max(...IMP3929_ROWS.map((r) => r.dminVsGlobal));
