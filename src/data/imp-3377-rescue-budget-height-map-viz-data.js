/**
 * @module imp-3377-rescue-budget-height-map-viz-data
 *
 * imp-3377 (ux): lightweight, import-light viz-data module for a chart of the imp-3275
 * rescue-budget K-to-height map K_max(N) = 0.12751*sqrt(N)/log(N) -- the largest C_mb
 * bound K the imp-486 rescue gate tolerates at height N -- and its inverse N_min(K), the
 * smallest height at which a given K clears the gate. Marks K=1 (the GUE-conditional
 * threshold, cleared at N ~ 4307), K ~ 1.384 (the imp-963 certified unconditional edge
 * at N = 10^4), and K ~ 9.23 (the imp-452 recorded-assembly ceiling at N = 10^6).
 *
 * Reference literals are baked from re-running the exact K_max(N) = 0.12751*sqrt(N)/log(N)
 * formula and its bisection inverse -- reproduced here to machine precision, no
 * re-derivation of the underlying theory.
 *
 * @see imp-3275-weaker-k-cmb-degradation.js (source module)
 * @see imp-486
 * @see imp-963
 */

export const IMP3377_RESCUE_THRESHOLD = 0.12751;

// K_max(N) sampled log-spaced across N in [100, 10^6].
export const IMP3377_K_MAX_LADDER = [
  { N: 100, kMax: 0.276884 },
  { N: 147, kMax: 0.309788 },
  { N: 215, kMax: 0.348127 },
  { N: 316, kMax: 0.39381 },
  { N: 464, kMax: 0.447345 },
  { N: 681, kMax: 0.510074 },
  { N: 1000, kMax: 0.583724 },
  { N: 1468, kMax: 0.67001 },
  { N: 2154, kMax: 0.771053 },
  { N: 3162, kMax: 0.889705 },
  { N: 4642, kMax: 1.028976 },
  { N: 6813, kMax: 1.192396 },
  { N: 10000, kMax: 1.384422 },
  { N: 14678, kMax: 1.610176 },
  { N: 21544, kMax: 1.87573 },
  { N: 31623, kMax: 2.188353 },
  { N: 46416, kMax: 2.556557 },
  { N: 68129, kMax: 2.990528 },
  { N: 100000, kMax: 3.502342 },
  { N: 146780, kMax: 4.106308 },
  { N: 215443, kMax: 4.819435 },
  { N: 316228, kMax: 5.66195 },
  { N: 464159, kMax: 6.657854 },
  { N: 681292, kMax: 7.835711 },
  { N: 1000000, kMax: 9.229482 },
];

// The three marked anchors on the K_max(N) curve / its inverse N_min(K).
export const IMP3377_ANCHOR_K1 = { K: 1.0, N: 4307, label: 'K=1 (GUE-conditional threshold)' };
export const IMP3377_ANCHOR_K_CERTIFIED = {
  K: 1.384422234687091,
  N: 10000,
  label: 'K~1.384 (N=10^4 certified unconditional edge, imp-963)',
};
export const IMP3377_ANCHOR_K_ASSEMBLY = {
  K: 9.229481564580608,
  N: 1000000,
  label: 'K~9.23 (N=10^6 recorded-assembly ceiling, imp-452)',
};
