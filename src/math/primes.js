/**
 * Prime number utilities and oscillator frequency generation.
 * Each prime p generates an oscillator with angular frequency omega_p = log(p).
 */

export function sieveOfEratosthenes(limit) {
  const sieve = new Uint8Array(limit + 1);
  sieve[0] = sieve[1] = 1;
  for (let i = 2; i * i <= limit; i++) {
    if (!sieve[i]) {
      for (let j = i * i; j <= limit; j += i) sieve[j] = 1;
    }
  }
  const primes = [];
  for (let i = 2; i <= limit; i++) {
    if (!sieve[i]) primes.push(i);
  }
  return primes;
}

const PRIMES = sieveOfEratosthenes(10000);

export function getPrimes(n) {
  return PRIMES.slice(0, n);
}

export function primeFrequency(p) {
  return Math.log(p);
}

export function primeWavelength(p) {
  return (2 * Math.PI) / Math.log(p);
}

/**
 * Von Mangoldt function: Lambda(n) = log(p) if n = p^k, else 0
 */
export function vonMangoldt(n) {
  if (n < 2) return 0;
  for (let i = 0; i < PRIMES.length && PRIMES[i] * PRIMES[i] <= n; i++) {
    const p = PRIMES[i];
    if (n % p === 0) {
      let m = n;
      while (m % p === 0) m /= p;
      return m === 1 ? Math.log(p) : 0;
    }
  }
  return Math.log(n);
}

/**
 * Chebyshev psi function: psi(x) = sum_{n <= x} Lambda(n)
 */
export function chebyshevPsi(x) {
  let sum = 0;
  for (let n = 2; n <= x; n++) {
    sum += vonMangoldt(n);
  }
  return sum;
}

/**
 * Explicit formula oscillatory terms: sum over zeros rho of x^rho / rho
 * Uses first numZeros imaginary parts of known zeta zeros.
 */
export function explicitFormulaTerms(x, zeros, sigma = 0.5) {
  let sum = 0;
  for (const t of zeros) {
    // x^(sigma + it) / (sigma + it) + x^(sigma - it) / (sigma - it)
    const logx = Math.log(x);
    const xSigma = Math.pow(x, sigma);
    const cosT = Math.cos(t * logx);
    const sinT = Math.sin(t * logx);
    const denom = sigma * sigma + t * t;
    // Real part of x^rho/rho + x^rho_bar/rho_bar
    sum += 2 * xSigma * (sigma * cosT + t * sinT) / denom;
  }
  return sum;
}
