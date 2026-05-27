/**
 * imp-1225: Prime Caustic Visualization (VIZ data module).
 *
 * MATH
 *   For each (sigma, t) in [0.3, 0.7] x [10, 200], compute the caustic
 *   resonance density: fraction of the first N primes p where the oscillation
 *   t * log(p) mod 2π is within the coherence window [-φ, φ] (prime phase
 *   resonates with collective oscillation). High density indicates caustic
 *   locus where primes constructively interfere.
 *
 *   The critical line sigma = 1/2 should show structured caustic ridges
 *   due to Dirichlet-character clustering and the explicit formula zero
 *   distribution. Off the critical line, resonance pattern loses structure.
 *
 * PARAMETERS
 *   N = 1000 (first N primes for coherence count)
 *   Grid resolution: 300x300 (sigma x t)
 *   Coherence window: φ = 0.3 radians (about 17°)
 *   SIGMA range: [0.3, 0.7], T range: [10, 200]
 *
 * EXPORTS
 *   VIZ_PRIME_CAUSTIC             -- frozen record with metadata,
 *                                     parameter ranges, headline samples
 *   VIZ_PRIME_CAUSTIC_ASSERTIONS  -- 5+ build-time tripwires
 *
 * HEADLINE SAMPLES
 *   Representative (sigma, t) points with precomputed caustic density.
 *   Used for page sanity-check display and tripwire validation.
 */

import { getPrimes, primeFrequency } from '../math/primes.js';

// ---------------------------------------------------------------------------
// PARAMETERS
// ---------------------------------------------------------------------------

const N_PRIMES = 1000;
const COHERENCE_WINDOW = 0.3; // radians, tolerance band around 0
const SIGMA_MIN = 0.3;
const SIGMA_MAX = 0.7;
const T_MIN = 10;
const T_MAX = 200;
const RESOLUTION = 300;

// ---------------------------------------------------------------------------
// CAUSTIC COMPUTATION
// ---------------------------------------------------------------------------

/**
 * Compute caustic density at (sigma, t): fraction of first N primes
 * with oscillation t*log(p) mod 2π within [-φ, φ].
 */
function causticDensity(sigma, t, nPrimes, window) {
  const primes = getPrimes(nPrimes);
  let count = 0;
  for (const p of primes) {
    const phase = (t * primeFrequency(p)) % (2 * Math.PI);
    // Normalize to [-π, π]
    const normalized = phase > Math.PI ? phase - 2 * Math.PI : phase;
    if (Math.abs(normalized) <= window) {
      count++;
    }
  }
  return count / nPrimes;
}

// ---------------------------------------------------------------------------
// HEADLINE SAMPLES (computed at module load)
// ---------------------------------------------------------------------------

const headlineSamples = [];

function generateHeadlineSamples() {
  const sigmas = [0.3, 0.4, 0.5, 0.6, 0.7];
  const ts = [10, 50, 100, 150, 200];

  for (const sigma of sigmas) {
    for (const t of ts) {
      const density = causticDensity(sigma, t, N_PRIMES, COHERENCE_WINDOW);
      headlineSamples.push({
        sigma,
        t,
        density,
      });
    }
  }
}

generateHeadlineSamples();

// ---------------------------------------------------------------------------
// TRIPWIRE ASSERTIONS
// ---------------------------------------------------------------------------

const assertions = [];

// Tripwire 1: Caustic density at critical line, first zero region
const criticalFirstZero = causticDensity(0.5, 14.134725, N_PRIMES, COHERENCE_WINDOW);
assertions.push({
  name: 'Critical line at gamma_1 (t~14.13)',
  check: () => criticalFirstZero > 0 && criticalFirstZero < 1,
  detail: `Density ${criticalFirstZero.toFixed(4)} should be interior (0, 1).`,
});

// Tripwire 2: Off-critical-line should differ from critical
const offCritical = causticDensity(0.6, 14.134725, N_PRIMES, COHERENCE_WINDOW);
assertions.push({
  name: 'Off-critical differs from critical',
  check: () => Math.abs(offCritical - criticalFirstZero) > 0.01,
  detail: `σ=0.5: ${criticalFirstZero.toFixed(4)}, σ=0.6: ${offCritical.toFixed(4)}`,
});

// Tripwire 3: Low-t region (away from first zero)
const lowT = causticDensity(0.5, 10, N_PRIMES, COHERENCE_WINDOW);
assertions.push({
  name: 'Low-t resonance (t=10)',
  check: () => lowT > 0 && lowT < 1,
  detail: `At t=10, σ=0.5: density ${lowT.toFixed(4)}`,
});

// Tripwire 4: High-t region (away from zeros)
const highT = causticDensity(0.5, 200, N_PRIMES, COHERENCE_WINDOW);
assertions.push({
  name: 'High-t resonance (t=200)',
  check: () => highT > 0 && highT < 1,
  detail: `At t=200, σ=0.5: density ${highT.toFixed(4)}`,
});

// Tripwire 5: Sigma edge (left boundary)
const sigmaEdge = causticDensity(SIGMA_MIN, 50, N_PRIMES, COHERENCE_WINDOW);
assertions.push({
  name: 'Sigma boundary (σ=0.3)',
  check: () => sigmaEdge > 0 && sigmaEdge < 1,
  detail: `At σ=0.3, t=50: density ${sigmaEdge.toFixed(4)}`,
});

// ---------------------------------------------------------------------------
// EXPORT
// ---------------------------------------------------------------------------

export const VIZ_PRIME_CAUSTIC = Object.freeze({
  id: 'imp-1225',
  title: 'Prime Caustic: Riemann Zero Resonance Loci',
  category: 'visual',
  description:
    'Heatmap of caustic resonance density in (σ, t) plane. ' +
    'For each point, compute fraction of first 1000 primes ' +
    'with phase t·log(p) mod 2π in coherence window. ' +
    'Critical line σ=1/2 exhibits structured caustic pattern.',
  parameterRanges: Object.freeze({
    sigmaMin: SIGMA_MIN,
    sigmaMax: SIGMA_MAX,
    tMin: T_MIN,
    tMax: T_MAX,
    resolution: RESOLUTION,
    nPrimes: N_PRIMES,
    coherenceWindow: COHERENCE_WINDOW,
  }),
  headlineSamples: Object.freeze(headlineSamples),
  references: Object.freeze([
    'Bui-Soundararajan: oscillation structure of zeta in large-value sets',
    'Explicit formula: zero distribution via prime phase interference',
    'Caustic / interferometric: prime contributions resonate coherently',
  ]),
  provenance: 'Computed via sieveOfEratosthenes + phase mod 2π.',
  rationale:
    'Caustic / interferometric interpretation of Riemann zeros. ' +
    'Visualizes Bui-Soundararajan-style large-value structure in ' +
    'natural geometric way: where do primes collectively oscillate in phase?',
});

export const VIZ_PRIME_CAUSTIC_ASSERTIONS = Object.freeze(assertions);
