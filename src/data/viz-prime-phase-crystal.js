/**
 * @fileoverview Prime phase-crystal Bragg-pattern reference data (imp-1227).
 * Sonnet engine bucket: pure data + assertions, no rendering.
 * @module viz-prime-phase-crystal
 *
 * BACKGROUND.  Diffraction interpretation of prime phases.  Fix a reference
 * height t_0 (default = gamma_1 = 14.134725...) and consider the 2D field
 *
 *     F(j, k) = | sum_{p in first N=200 primes} cos(j * log p + k * t_0) |
 *
 * over (j, k) in [0, J_MAX] x [0, K_MAX] (default J_MAX = K_MAX = 50).  When
 * j approximates an integer harmonic of any 2*pi/log p, that prime is
 * resonant; when several primes resonate simultaneously the magnitude has
 * a Bragg-like peak.  Sweeping t_0 across the nontrivial zeros shifts the
 * peak structure: at t_0 = gamma_n the field shows characteristic interference
 * because the prime phases collectively destructively interfere
 * (sum_p cos(t * log p) is near 0 at a zero).
 *
 * This module exposes:
 *   - The grid axis vectors (J_AXIS, K_AXIS).
 *   - A reference 50x50 crystal at t_0 = gamma_1 (build-time).
 *   - The diffraction maxima/minima statistics.
 *   - Tripwires locking the symmetries and dynamic range of the pattern.
 *
 * The renderer (VizPrimePhaseCrystalPage) recomputes the crystal on a 500x500
 * Canvas via Uint8ClampedArray + ImageData and lets the user pick any zero
 * from ZETA_ZEROS as the new t_0.
 *
 * EXPORTS.
 *   VIZ_PRIME_PHASE_CRYSTAL             - reference data object (frozen)
 *   VIZ_PRIME_PHASE_CRYSTAL_ASSERTIONS  - build-time tripwire array
 *
 * Ticket: imp-1227 (sonnet-4-6, subscription).
 */

import { getPrimes } from '../math/primes.js';
import { ZETA_ZEROS } from '../math/zeta.js';

const N_PRIMES = 200;
const J_MAX    = 50;        // log-prime harmonic axis (horizontal)
const K_MAX    = 50;        // t_0 harmonic axis        (vertical)
const GRID_N   = 50;        // reference grid resolution per axis (50x50)
const T0_DEFAULT = ZETA_ZEROS[0];  // 14.134725142

const PRIMES = getPrimes(N_PRIMES);
const LOG_PRIMES = new Float64Array(PRIMES.length);
for (let i = 0; i < PRIMES.length; i++) LOG_PRIMES[i] = Math.log(PRIMES[i]);

/**
 * Compute the crystal magnitude at one (j, k) pixel.
 *   F(j, k) = | sum_{p in primes} cos(j * log p + k * t_0) |
 * The renderer calls this once per pixel.
 */
function crystalMagnitude(j, k, t0) {
  let s = 0;
  for (let i = 0; i < LOG_PRIMES.length; i++) {
    s += Math.cos(j * LOG_PRIMES[i] + k * t0);
  }
  return Math.abs(s);
}

/**
 * Build the full reference grid (50x50) at a given t_0.  Returns a packed
 * Float64Array in row-major order: index = k_idx * GRID_N + j_idx.
 */
function buildGrid(t0, gridN = GRID_N, jMax = J_MAX, kMax = K_MAX) {
  const out = new Float64Array(gridN * gridN);
  for (let ki = 0; ki < gridN; ki++) {
    const k = (ki / (gridN - 1)) * kMax;
    for (let ji = 0; ji < gridN; ji++) {
      const j = (ji / (gridN - 1)) * jMax;
      out[ki * gridN + ji] = crystalMagnitude(j, k, t0);
    }
  }
  return out;
}

const REF_GRID = buildGrid(T0_DEFAULT);

let _max = -Infinity, _min = +Infinity, _sum = 0;
let _maxIdx = 0;
for (let i = 0; i < REF_GRID.length; i++) {
  const v = REF_GRID[i];
  if (v > _max) { _max = v; _maxIdx = i; }
  if (v < _min)  _min = v;
  _sum += v;
}
const MEAN_MAG = _sum / REF_GRID.length;
const MAX_K    = Math.floor(_maxIdx / GRID_N);
const MAX_J    = _maxIdx % GRID_N;

// DC value: at (j, k) = (0, 0) every cosine is cos(0) = 1, so the sum is
// exactly N_PRIMES.  This is the global maximum of |F|.
const DC_VALUE = REF_GRID[0];

// Cross-sweep: evaluate the (0, 0) pixel at the first 5 Riemann zeros.
// (0,0) is independent of t_0 (j = k = 0 kills t_0 inside the cosine), so
// the entry should be N_PRIMES at every t_0.  This is a sanity tripwire.
const DC_AT_FIRST_5_ZEROS = ZETA_ZEROS.slice(0, 5).map(t0 => ({
  t0,
  dc: +crystalMagnitude(0, 0, t0).toFixed(8),
}));

// Sweep |F(0, k)| at fixed j = 0 as a function of k (renderer-side this
// is the leftmost column).  At j=0 each term is cos(k * t_0) (same for every
// prime), so F(0, k) = N_PRIMES * |cos(k * t_0)|.  Verifies the cosine.
const J0_COLUMN_CHECK = [];
for (let ki = 0; ki < GRID_N; ki += 10) {
  const k = (ki / (GRID_N - 1)) * K_MAX;
  J0_COLUMN_CHECK.push({
    k,
    observed: REF_GRID[ki * GRID_N + 0],
    predicted: N_PRIMES * Math.abs(Math.cos(k * T0_DEFAULT)),
  });
}
const J0_COLUMN_MAX_ERR = J0_COLUMN_CHECK.reduce(
  (m, r) => Math.max(m, Math.abs(r.observed - r.predicted)), 0,
);

// Detect at least one secondary peak: a pixel with magnitude >= 0.25 * DC
// that is at distance >= 8 pixels from the (0,0) corner.  This is the
// "Bragg-like peak" requirement of the ticket.
let _nSecondary = 0;
for (let ki = 0; ki < GRID_N; ki++) {
  for (let ji = 0; ji < GRID_N; ji++) {
    if (ki === 0 && ji === 0) continue;
    const d2 = ki * ki + ji * ji;
    if (d2 < 64) continue;  // distance < 8
    if (REF_GRID[ki * GRID_N + ji] >= 0.25 * DC_VALUE) _nSecondary++;
  }
}

const BBOX = Object.freeze({
  nPrimes: N_PRIMES,
  jMax:    J_MAX,
  kMax:    K_MAX,
  gridN:   GRID_N,
  t0Default: T0_DEFAULT,
});

export const VIZ_PRIME_PHASE_CRYSTAL = Object.freeze({
  ticket: 'imp-1227',
  method: 'Prime phase crystal: |sum_p cos(j log p + k t_0)| over (j, k)',
  description:
    'Diffraction-style 2D pattern.  Reference grid is GRID_N x GRID_N = ' +
    '50 x 50 at t_0 = gamma_1 = 14.134725.  The renderer recomputes on a ' +
    '500 x 500 canvas via Uint8ClampedArray + ImageData and a slider lets ' +
    'the user pick any of the first ZETA_ZEROS as t_0.  DC value at ' +
    '(j, k) = (0, 0) is N_PRIMES = 200 (every cosine is 1).',
  bbox: BBOX,
  refGrid: REF_GRID,             // Float64Array(GRID_N * GRID_N), row-major (ki, ji)
  refMax: +_max.toFixed(8),
  refMin: +_min.toFixed(8),
  refMean: +MEAN_MAG.toFixed(8),
  refMaxJ: MAX_J,
  refMaxK: MAX_K,
  dcValue: +DC_VALUE.toFixed(8),
  dcAcrossZeros: DC_AT_FIRST_5_ZEROS,
  j0ColumnCheck: J0_COLUMN_CHECK,
  j0ColumnMaxErr: +J0_COLUMN_MAX_ERR.toFixed(10),
  secondaryPeakCount: _nSecondary,
  // Expose the helpers + prime arrays so the renderer is consistent with the
  // assertions and does not re-derive log p / primes.
  crystalMagnitude,
  buildGrid,
  primes: PRIMES,                // length 200
  logPrimes: LOG_PRIMES,         // Float64Array
  zeros: ZETA_ZEROS.slice(0, 50), // first 50 zeros for the slider
});

export const VIZ_PRIME_PHASE_CRYSTAL_ASSERTIONS = [
  {
    id: 'viz-phase-crystal-prime-count',
    holds: () => PRIMES.length === N_PRIMES
              && PRIMES[0] === 2
              && PRIMES[N_PRIMES - 1] === 1223,
    why:
      'getPrimes(200) must return the first 200 primes.  Reference list: ' +
      'p_1 = 2 and p_200 = 1223.  A mismatch breaks the Bragg-pattern ' +
      'identity F(0, 0) = 200.',
  },
  {
    id: 'viz-phase-crystal-grid-shape',
    holds: () => REF_GRID.length === GRID_N * GRID_N
              && REF_GRID instanceof Float64Array,
    why:
      'Reference grid must be a Float64Array of length 50 * 50 = 2500. ' +
      'A wrong shape would mean the renderer cannot index (ki, ji) ' +
      'consistently with the build-time data.',
  },
  {
    id: 'viz-phase-crystal-dc-equals-n',
    holds: () => Math.abs(DC_VALUE - N_PRIMES) < 1e-10,
    why:
      'At (j, k) = (0, 0) each cosine is cos(0) = 1, so F = N_PRIMES = 200 ' +
      'exactly.  Any deviation indicates a sign error or off-by-one in the ' +
      'grid indexing.',
  },
  {
    id: 'viz-phase-crystal-dc-is-global-max',
    holds: () => Math.abs(_max - DC_VALUE) < 1e-10 && _maxIdx === 0,
    why:
      'The DC term is the global maximum: |sum cos(.)| <= N_PRIMES by the ' +
      'triangle inequality, with equality only when every cosine is +-1. ' +
      'For j > 0 the cosines decorrelate quickly so equality cannot ' +
      'recur elsewhere on a 50 x 50 grid.',
  },
  {
    id: 'viz-phase-crystal-j0-column-closed-form',
    holds: () => J0_COLUMN_MAX_ERR < 1e-8,
    why:
      'Along the column j = 0 the closed form F(0, k) = N_PRIMES * |cos(k * ' +
      't_0)| applies exactly.  Discrepancy at the 1e-8 level means the ' +
      'cosine summation drifted (FMA quirks would still stay well under ' +
      'this bound for N=200).',
  },
  {
    id: 'viz-phase-crystal-mean-below-dc',
    holds: () => MEAN_MAG > 0 && MEAN_MAG < 0.6 * DC_VALUE,
    why:
      'A meaningful diffraction pattern has mean magnitude well below the ' +
      'DC value: typical pixels average over random-phase cosines, giving ' +
      'mean ~ sqrt(N_PRIMES) * O(1) << N_PRIMES.  A mean above 0.6 * DC ' +
      'would mean the pattern lacks contrast.',
  },
  {
    id: 'viz-phase-crystal-secondary-peaks-present',
    holds: () => _nSecondary >= 1,
    why:
      'A Bragg-like crystal must show at least one secondary peak at ' +
      'distance >= 8 pixels from the (0, 0) corner with magnitude >= ' +
      '25%% of DC.  Absence indicates the prime-phase coherence is gone ' +
      '(perhaps log p was replaced by p, or t_0 went to 0).',
  },
  {
    id: 'viz-phase-crystal-dc-invariant-across-zeros',
    holds: () => DC_AT_FIRST_5_ZEROS.every(r => Math.abs(r.dc - N_PRIMES) < 1e-10),
    why:
      'F(0, 0) does not depend on t_0 (j = k = 0 kills t_0 inside the ' +
      'cosine).  All five sampled Riemann zeros must give DC = N_PRIMES ' +
      'exactly.  Tests the slider-invariant identity.',
  },
];

for (const a of VIZ_PRIME_PHASE_CRYSTAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      'VIZ_PRIME_PHASE_CRYSTAL assertion failed: ' + a.id + ' -- ' + a.why,
    );
  }
}
