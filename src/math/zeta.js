/**
 * Riemann zeta function computation and related functions.
 * Implements the Dirichlet series, Euler product, and functional equation.
 */

import { getPrimes, primeFrequency } from './primes.js';

/**
 * Complex number arithmetic helpers
 */
export function cMul(a, b) {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}

export function cDiv(a, b) {
  const d = b[0] * b[0] + b[1] * b[1];
  return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d];
}

export function cAdd(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}

export function cSub(a, b) {
  return [a[0] - b[0], a[1] - b[1]];
}

export function cAbs(a) {
  return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
}

export function cExp(a) {
  const r = Math.exp(a[0]);
  return [r * Math.cos(a[1]), r * Math.sin(a[1])];
}

export function cLog(a) {
  return [Math.log(cAbs(a)), Math.atan2(a[1], a[0])];
}

export function cPow(base, exp) {
  if (base[0] === 0 && base[1] === 0) return [0, 0];
  return cExp(cMul(exp, cLog(base)));
}

/**
 * Zeta via Dirichlet series (converges for Re(s) > 1)
 * zeta(s) = sum_{n=1}^{N} 1/n^s
 */
export function zetaDirichlet(s, N = 1000) {
  let result = [0, 0];
  for (let n = 1; n <= N; n++) {
    const term = cPow([n, 0], [-s[0], -s[1]]);
    result = cAdd(result, term);
  }
  return result;
}

/**
 * Zeta via Euler product (product over primes)
 * zeta(s) = prod_p (1 - p^{-s})^{-1}
 */
export function zetaEulerProduct(s, numPrimes = 100) {
  const primes = getPrimes(numPrimes);
  let result = [1, 0];
  for (const p of primes) {
    const pMinusS = cPow([p, 0], [-s[0], -s[1]]);
    const factor = cSub([1, 0], pMinusS);
    result = cDiv(result, factor);
  }
  return result;
}

/**
 * Individual Euler factor for prime p: 1/(1 - p^{-s})
 * This is the transfer function of one oscillator stage.
 */
export function eulerFactor(p, s) {
  const pMinusS = cPow([p, 0], [-s[0], -s[1]]);
  return cDiv([1, 0], cSub([1, 0], pMinusS));
}

/**
 * Partial Euler product up to the k-th prime
 */
export function partialEulerProduct(s, k) {
  const primes = getPrimes(k);
  let result = [1, 0];
  const stages = [{ prime: 1, factor: [1, 0], cumulative: [1, 0] }];
  for (let i = 0; i < primes.length; i++) {
    const p = primes[i];
    const f = eulerFactor(p, s);
    result = cMul(result, f);
    stages.push({
      prime: p,
      frequency: primeFrequency(p),
      factor: f,
      cumulative: [...result],
    });
  }
  return { value: result, stages };
}

/**
 * Riemann-Siegel Z function (approximation for visualizing on critical line)
 * Z(t) = exp(i*theta(t)) * zeta(1/2 + it)
 * where theta(t) is the Riemann-Siegel theta function
 */
export function riemannSiegelTheta(t) {
  // theta(t) ≈ t/2 * log(t/(2*pi)) - t/2 - pi/8 + ...
  return (t / 2) * Math.log(t / (2 * Math.PI)) - t / 2 - Math.PI / 8
    + 1 / (48 * t) + 7 / (5760 * t * t * t);
}

export function riemannSiegelZ(t) {
  const N = Math.floor(Math.sqrt(t / (2 * Math.PI)));
  let sum = 0;
  for (let n = 1; n <= N; n++) {
    sum += Math.cos(riemannSiegelTheta(t) - t * Math.log(n)) / Math.sqrt(n);
  }
  return 2 * sum;
}

/**
 * First 50 known imaginary parts of nontrivial zeta zeros
 */
export const ZETA_ZEROS = [
  14.134725, 21.022040, 25.010858, 30.424876, 32.935062,
  37.586178, 40.918719, 43.327073, 48.005151, 49.773832,
  52.970321, 56.446248, 59.347044, 60.831779, 65.112544,
  67.079811, 69.546402, 72.067158, 75.704691, 77.144840,
  79.337375, 82.910381, 84.735493, 87.425275, 88.809111,
  92.491899, 94.651344, 95.870634, 98.831194, 101.317851,
  103.725538, 105.446623, 107.168611, 111.029554, 111.874659,
  114.320220, 116.226680, 118.790783, 121.370125, 122.946829,
  124.256819, 127.516684, 129.578704, 131.087688, 133.497737,
  134.756510, 138.116042, 139.736209, 141.123707, 143.111846,
];

/**
 * Compute zeta on the critical strip using a simple approximation
 * Uses the alternating Dirichlet eta function: eta(s) = (1 - 2^{1-s}) * zeta(s)
 */
export function zetaCriticalStrip(s, N = 200) {
  // Borwein's method / Euler-Maclaurin with Knopp-Hasse series
  // eta(s) = sum_{n=0}^{inf} (1/(n+1)^s) * (-1)^n
  let eta = [0, 0];
  for (let n = 0; n < N; n++) {
    const sign = n % 2 === 0 ? 1 : -1;
    const term = cPow([n + 1, 0], [-s[0], -s[1]]);
    eta = cAdd(eta, [sign * term[0], sign * term[1]]);
  }
  // zeta(s) = eta(s) / (1 - 2^{1-s})
  const twoTo1MinusS = cPow([2, 0], [1 - s[0], -s[1]]);
  const denom = cSub([1, 0], twoTo1MinusS);
  return cDiv(eta, denom);
}
