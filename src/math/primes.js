/**
 * Prime number utilities and Euler factor phase rates.
 * Each prime p has Euler factor phase rotation rate log(p) from p^{-s} = e^{-s·log(p)}.
 * In the LC oscillator model, log(p) is the characteristic impedance Z₀ = √(L/C),
 * while the resonant frequency is ω₀ = 1/√(LC) = 1 for all primes.
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
 * Explicit formula: ψ(x) = x - Σ_ρ x^ρ/ρ - log(2π) - ½log(1 - x^{-2})
 * Returns the terms to subtract from x: zeroSum + log(2π) + ½log(1-x^{-2}).
 * Usage: ψ(x) ≈ x - explicitFormulaTerms(x, zeros).
 */
export function explicitFormulaTerms(x, zeros, sigma = 0.5) {
  const logx = Math.log(x);
  const xSigma = Math.pow(x, sigma);
  let zeroSum = 0;
  for (const t of zeros) {
    // x^(sigma + it) / (sigma + it) + x^(sigma - it) / (sigma - it)
    const cosT = Math.cos(t * logx);
    const sinT = Math.sin(t * logx);
    const denom = sigma * sigma + t * t;
    // Real part of x^rho/rho + x^rho_bar/rho_bar
    zeroSum += 2 * xSigma * (sigma * cosT + t * sinT) / denom;
  }
  // Add constant term log(2π) and trivial zero contribution ½log(1 - x^{-2})
  const constant = Math.log(2 * Math.PI);
  const trivialZeros = x > 1 ? 0.5 * Math.log(1 - 1 / (x * x)) : 0;
  return zeroSum + constant + trivialZeros;
}
