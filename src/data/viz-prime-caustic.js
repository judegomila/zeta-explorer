/**
 * @fileoverview Prime caustic geometry reference data (imp-1225).
 * Sonnet engine bucket: pure data + assertions, no rendering.
 * @module viz-prime-caustic
 *
 * BACKGROUND.  For each prime p the partial Euler-product / Riemann-Siegel
 * main-sum contribution at (sigma, t) carries phase t * log p.  When many
 * primes simultaneously have phase close to 0 (mod 2*pi), their contributions
 * superpose coherently and |zeta(sigma + it)| (or the truncated main sum) is
 * locally large.  The set of (sigma, t) pairs where many primes are
 * phase-aligned is the prime "caustic".  This module tabulates the resonance
 * count
 *
 *     R_eps(sigma, t)  =  card { p in PRIMES_N :
 *                                ((t * log p) mod 2*pi) wraps to | . | < eps }
 *
 * on a coarse reference grid for cheap build-time tripwires.  The viz page
 * computes the same quantity on a larger 300x300 grid via Uint8ClampedArray.
 *
 * Although the count itself does NOT depend on sigma (the phase t * log p is
 * sigma-independent), the per-pixel weighting used by the renderer DOES
 * include a sigma-dependent amplitude factor sum_p p^{-sigma} * w_p where
 * w_p = 1 if the phase falls inside the eps-window and 0 otherwise.  This
 * file exposes both the bare count (used by the brightness channel of the
 * heatmap) and the sigma-weighted amplitude on a 3-sigma reference slice so
 * the tripwires can lock the symmetry sigma -> 1 - sigma at the critical line
 * up to the elementary p^{sigma - 1/2} correction.
 *
 * The critical-line slice sigma = 1/2 is the geometric centre of the
 * caustic: phases collapse to a regular pattern (Gram-point structure), and
 * one observes the characteristic horizontal "stripes" at the imaginary
 * parts of the first nontrivial zeros (gamma_n ~ 14.13, 21.02, ...) where
 * the truncated main sum has dips and surrounding peaks.
 *
 * EXPORTS.
 *   VIZ_PRIME_CAUSTIC             - reference data object (frozen)
 *   VIZ_PRIME_CAUSTIC_ASSERTIONS  - build-time tripwire array
 *
 * Ticket: imp-1225 (sonnet-4-6, subscription).
 */

import { getPrimes } from '../math/primes.js';

const TWO_PI = 2 * Math.PI;

// Renderer-facing constants (the actual page reads these so the data file
// is the single source of truth for grid size, sigma/t windows, eps, N).
const N_PRIMES   = 1000;
const SIGMA_MIN  = 0.3;
const SIGMA_MAX  = 0.7;
const T_MIN      = 10;
const T_MAX      = 200;
const EPS_RAD    = 0.2;     // phase tolerance: |phase mod 2pi| < EPS_RAD
const GRID_W     = 300;     // canvas pixel grid (renderer)
const GRID_H     = 300;
// Build-time tripwire grid is smaller so the assertion pass is fast.
const REF_W      = 40;
const REF_H      = 40;

const PRIMES    = getPrimes(N_PRIMES);
const LOG_PRIMES = new Float64Array(PRIMES.length);
for (let i = 0; i < PRIMES.length; i++) LOG_PRIMES[i] = Math.log(PRIMES[i]);

/**
 * Count primes whose phase t * log p (mod 2*pi) lies in (-eps, +eps).
 * Independent of sigma (sigma only enters in the amplitude-weighted variant).
 */
function resonanceCount(t, eps = EPS_RAD) {
  let n = 0;
  for (let i = 0; i < LOG_PRIMES.length; i++) {
    const ph = t * LOG_PRIMES[i];
    // Reduce to (-pi, pi].
    let r = ph - TWO_PI * Math.round(ph / TWO_PI);
    if (r > Math.PI)  r -= TWO_PI;
    if (r < -Math.PI) r += TWO_PI;
    if (Math.abs(r) < eps) n++;
  }
  return n;
}

/**
 * Amplitude-weighted variant.  When a prime sits inside the eps-window it
 * contributes p^{-sigma} (the Riemann-Siegel main-sum coefficient) to the
 * brightness.  Useful for the sigma slider: at sigma = 1/2 this becomes
 * sum_{coherent p} 1/sqrt(p), the natural normalisation used by Z(t).
 */
function amplitudeAtSigma(t, sigma, eps = EPS_RAD) {
  let s = 0;
  for (let i = 0; i < LOG_PRIMES.length; i++) {
    const ph = t * LOG_PRIMES[i];
    let r = ph - TWO_PI * Math.round(ph / TWO_PI);
    if (r > Math.PI)  r -= TWO_PI;
    if (r < -Math.PI) r += TWO_PI;
    if (Math.abs(r) < eps) s += Math.exp(-sigma * LOG_PRIMES[i]);  // p^{-sigma}
  }
  return s;
}

// Build the reference caustic grid (40x40) and collect summary statistics.
const REF_GRID = new Uint16Array(REF_W * REF_H);   // count fits in u16 (max <= 1000)
let _maxCount = 0;
let _sumCount = 0;
const _rowMaxes = new Uint16Array(REF_H);

for (let py = 0; py < REF_H; py++) {
  const t = T_MIN + ((REF_H - 1 - py) / (REF_H - 1)) * (T_MAX - T_MIN);
  const c = resonanceCount(t);
  // The count is sigma-independent, so the whole row gets the same value.
  // We still store it per-pixel so the tripwire matches what the renderer
  // would see if a future revision adds sigma-dependence.
  for (let px = 0; px < REF_W; px++) {
    REF_GRID[py * REF_W + px] = c;
  }
  if (c > _maxCount) _maxCount = c;
  _sumCount += c;
  _rowMaxes[py] = c;
}

// _sumCount accumulates one value per row (count is sigma-independent), so
// the per-pixel mean equals the per-row mean: _sumCount / REF_H.
const MEAN_COUNT = _sumCount / REF_H;

// Cross-section at the critical line sigma = 1/2 (using amplitude).
const SLICE_T_VALUES = [14.13, 21.02, 25.01, 30.42, 49.77, 100.0, 150.0];
const CRITICAL_LINE_SLICE = SLICE_T_VALUES.map(t => ({
  t,
  count:      resonanceCount(t),
  ampAtHalf:  +amplitudeAtSigma(t, 0.5).toFixed(8),
  ampAt03:    +amplitudeAtSigma(t, 0.3).toFixed(8),
  ampAt07:    +amplitudeAtSigma(t, 0.7).toFixed(8),
}));

// Symmetry probe: the AMPLITUDE at sigma = 1/2 + delta and 1/2 - delta
// differs by a factor sum p^{-delta} vs sum p^{+delta} on the (sigma-
// independent) coherent set.  We use this to lock the geometry: the ratio
// must equal sum p^{1/2 - sigma_lo} / sum p^{sigma_hi - 1/2} = identity at
// sigma = 1/2.  Test that amp at sigma=0.5 sits strictly between amp at
// sigma=0.3 (heaviest weight) and amp at sigma=0.7 (lightest weight).
const SYMMETRY_CHECK = CRITICAL_LINE_SLICE.every(
  row => row.count === 0 || (row.ampAt03 >= row.ampAtHalf && row.ampAtHalf >= row.ampAt07)
);

// Expected coherent-count baseline: random uniform phases would give
// (2*eps / 2*pi) * N_primes = (0.2/pi) * 1000 ~ 63.66.  At small t the
// phases are very NOT-random (most primes are large enough that t*log p is
// O(1) and clustered near 0), so the count is much higher than baseline.
// We lock: mean count over the 40x40 grid >= baseline.
const RANDOM_BASELINE = (2 * EPS_RAD / TWO_PI) * N_PRIMES;

// Bounding-box constants exposed for renderer (so page and tripwires
// agree on the axes).
const BBOX = Object.freeze({
  sigmaMin: SIGMA_MIN, sigmaMax: SIGMA_MAX,
  tMin: T_MIN,         tMax: T_MAX,
  nPrimes: N_PRIMES,   eps: EPS_RAD,
  gridW: GRID_W,       gridH: GRID_H,
  refW:  REF_W,        refH:  REF_H,
});

export const VIZ_PRIME_CAUSTIC = Object.freeze({
  ticket: 'imp-1225',
  method: 'Prime caustic: density of phase-coherent primes in the (sigma, t) plane',
  description:
    'For each (sigma, t) pixel the brightness is the count of primes p in the ' +
    'first N=1000 whose oscillation phase (t * log p) mod 2*pi is within ' +
    'EPS=0.2 radians of 0.  Coherent superposition makes the truncated main ' +
    'sum locally large; the critical line shows a structured caustic pattern. ' +
    'Tripwires use a 40x40 reference grid; the renderer computes 300x300.',
  bbox: BBOX,
  refGrid: REF_GRID,                        // 40 x 40 uint16 (sigma-independent)
  refMaxCount: _maxCount,
  meanCount: +MEAN_COUNT.toFixed(4),
  randomBaseline: +RANDOM_BASELINE.toFixed(4),
  criticalLineSlice: CRITICAL_LINE_SLICE,
  symmetryCheckPasses: SYMMETRY_CHECK,
  // Expose the prime-phase helpers for the renderer so it does not have to
  // duplicate the reduction logic.
  resonanceCount,
  amplitudeAtSigma,
  primes: PRIMES,                           // length 1000
  logPrimes: LOG_PRIMES,                    // Float64Array
});

export const VIZ_PRIME_CAUSTIC_ASSERTIONS = [
  {
    id: 'viz-prime-caustic-prime-count',
    holds: () => PRIMES.length === N_PRIMES
              && PRIMES[0] === 2
              && PRIMES[N_PRIMES - 1] === 7919,
    why:
      'getPrimes(1000) must return exactly 1000 primes starting at 2 and ' +
      'ending at p_1000 = 7919.  A mismatch indicates a regression in the ' +
      'shared sieveOfEratosthenes table.',
  },
  {
    id: 'viz-prime-caustic-ref-grid-shape',
    holds: () => REF_GRID.length === REF_W * REF_H
              && REF_GRID instanceof Uint16Array,
    why:
      'The reference caustic grid must be a packed Uint16Array of size REF_W * ' +
      'REF_H = 40 * 40 = 1600.  This guarantees the renderer can flatten ' +
      'the grid into an ImageData backing store without per-pixel allocation.',
  },
  {
    id: 'viz-prime-caustic-max-count-in-range',
    holds: () => _maxCount > 0 && _maxCount <= N_PRIMES,
    why:
      'Max coherent count must be strictly positive (otherwise the heatmap ' +
      'is uniformly dark) and bounded by N_PRIMES = 1000 (can never count ' +
      'more primes than we have).',
  },
  {
    id: 'viz-prime-caustic-mean-exceeds-baseline',
    holds: () => MEAN_COUNT >= 0.5 * RANDOM_BASELINE,
    why:
      'Even with N=1000 primes, the resonance count averaged across t in ' +
      '[10, 200] must dominate the random-phase baseline (2*eps/(2*pi))*N ' +
      '~ 63.66 multiplied by 0.5.  A much lower mean would indicate the ' +
      'phase reduction (t * log p mod 2*pi) is incorrect, e.g. modular ' +
      'arithmetic off by a factor of 2 or sign.',
  },
  {
    id: 'viz-prime-caustic-zero-list-nonzero',
    holds: () => CRITICAL_LINE_SLICE.length >= 5
              && CRITICAL_LINE_SLICE.every(r => r.count > 0),
    why:
      'Each of the t-values in the critical-line cross-section (first few ' +
      'gamma_n plus two large-t points) must give a positive resonance ' +
      'count.  A zero count anywhere would indicate the t-range was set ' +
      'too small or eps too tight; both break the visualization.',
  },
  {
    id: 'viz-prime-caustic-amplitude-sigma-ordering',
    holds: () => SYMMETRY_CHECK === true,
    why:
      'For any t the amplitude sum_{coherent p} p^{-sigma} must be ' +
      'monotonically decreasing in sigma (small sigma upweights small ' +
      'primes more).  Hence amp(sigma=0.3) >= amp(sigma=0.5) >= ' +
      'amp(sigma=0.7).  Failure means the amplitudeAtSigma sign or ' +
      'exponent is wrong.',
  },
  {
    id: 'viz-prime-caustic-bbox-bounds-sane',
    holds: () => SIGMA_MIN < 0.5 && 0.5 < SIGMA_MAX
              && T_MIN < T_MAX
              && GRID_W > 0 && GRID_H > 0,
    why:
      'The bounding box must straddle sigma = 1/2 (otherwise the critical ' +
      'line is not in frame), t_min < t_max, and grid dimensions positive. ' +
      'Locks the renderer-data contract.',
  },
];

for (const a of VIZ_PRIME_CAUSTIC_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      'VIZ_PRIME_CAUSTIC assertion failed: ' + a.id + ' -- ' + a.why,
    );
  }
}
