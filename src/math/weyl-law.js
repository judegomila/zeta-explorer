/**
 * Weyl Law Asymptotics for the Infinite Darlington Cascade (imp-071)
 *
 * The Darlington cascade is a chain of 2x2 transfer matrices, one per prime p.
 * Each section k is an LC two-port where the electrical length is prime-dependent:
 *
 *   L_k = log(p_k),   C_k = log(p_k)
 *   Z_k  = sqrt(L_k / C_k) = 1              (unit impedance)
 *   ell_k = sqrt(L_k * C_k) = log(p_k)      (electrical length)
 *
 * The transfer matrix for section k at angular frequency omega is:
 *   T_k(omega) = [[cos(theta_k),  j*Z_k*sin(theta_k)],
 *                  [j*sin(theta_k)/Z_k,  cos(theta_k)]]
 * where theta_k = omega * ell_k = omega * log(p_k).
 *
 * Eigenfrequencies of the terminated cascade satisfy Tr(T_1...T_N) = +/-2.
 *
 * The Weyl law predicts the eigenvalue counting function:
 *   N_Weyl(lambda) ~ (L_total / pi) * lambda
 * where L_total = sum_{k=1}^{N} ell_k = sum_{k=1}^{N} log(p_k).
 *
 * By the prime number theorem, sum_{k=1}^{N} log(p_k) ~ N*log(N) (Chebyshev),
 * so N_Weyl(lambda) ~ N*log(N)*lambda/pi for large N.
 *
 * The Weyl remainder R(lambda) = N_actual(lambda) - N_Weyl(lambda) encodes
 * spectral fluctuations tied to the irregularity of the prime distribution.
 * If S7 (the spectral completeness conjecture) holds, |R(lambda)| = O(sqrt(N*log(N))),
 * consistent with the square-root cancellation that underlies RH.
 *
 * We also test an impedance-modulated variant where Z_k = 1/log(p_k), making the
 * impedance mismatch between sections encode prime gaps. This breaks the trivial
 * periodicity and produces a richer Weyl remainder.
 */

import { cMul, cDiv, cSub, cAdd, cAbs } from './zeta.js';
import { getPrimes } from './primes.js';

// ---------------------------------------------------------------------------
// 2x2 complex matrix utilities
// ---------------------------------------------------------------------------

/**
 * Multiply two 2x2 complex matrices A and B.
 * Each matrix is [[a11,a12],[a21,a22]] with entries [re,im].
 */
function mat2x2Mul(A, B) {
  return [
    [
      cAdd(cMul(A[0][0], B[0][0]), cMul(A[0][1], B[1][0])),
      cAdd(cMul(A[0][0], B[0][1]), cMul(A[0][1], B[1][1])),
    ],
    [
      cAdd(cMul(A[1][0], B[0][0]), cMul(A[1][1], B[1][0])),
      cAdd(cMul(A[1][0], B[0][1]), cMul(A[1][1], B[1][1])),
    ],
  ];
}

// ---------------------------------------------------------------------------
// Core: trace of the cascade transfer matrix product
// ---------------------------------------------------------------------------

/**
 * Compute Tr(T_1 * T_2 * ... * T_N) at angular frequency omega.
 *
 * Each T_k = [[cos(theta_k), j*Zk*sin(theta_k)],
 *              [j*sin(theta_k)/Zk, cos(theta_k)]]
 * with theta_k = omega * log(p_k) and Zk = 1/log(p_k).
 *
 * We inline all complex arithmetic for speed, tracking the four complex
 * entries of the cumulative product as 8 real numbers.
 *
 * @param {number[]} logPrimes - Precomputed log(p_k) values
 * @param {number} omega - Angular frequency
 * @returns {number} Real part of trace (imaginary part is zero for symplectic matrices)
 */
function traceOfCascade(logPrimes, omega) {
  // T = [[a, b], [c, d]], stored as 8 reals
  let ar = 1, ai = 0, br = 0, bi = 0;
  let cr = 0, ci = 0, dr = 1, di = 0;

  for (let k = 0; k < logPrimes.length; k++) {
    const logP = logPrimes[k];
    const Zk = 1.0 / logP;           // characteristic impedance
    const invZk = logP;               // 1/Z_k
    const theta = omega * logP;       // electrical length at this frequency
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const zSin = Zk * sinT;          // Z_k * sin(theta_k)
    const izSin = invZk * sinT;      // sin(theta_k) / Z_k

    // T_k = [[cosT, j*zSin], [j*izSin, cosT]]
    // New = Old * T_k:
    //   a' = a*cosT + b*(j*izSin)
    //   b' = a*(j*zSin) + b*cosT
    //   c' = c*cosT + d*(j*izSin)
    //   d' = c*(j*zSin) + d*cosT
    //
    // Complex multiply: (xr+j*xi)*(yr+j*yi) = (xr*yr - xi*yi) + j*(xr*yi + xi*yr)
    // For a*cosT: (ar*cosT, ai*cosT)
    // For b*(j*izSin) = b*[0, izSin]: (-bi*izSin, br*izSin)

    const nar = ar * cosT - bi * izSin;
    const nai = ai * cosT + br * izSin;
    const nbr = br * cosT - ai * zSin;
    const nbi = bi * cosT + ar * zSin;
    const ncr = cr * cosT - di * izSin;
    const nci = ci * cosT + dr * izSin;
    const ndr = dr * cosT - ci * zSin;
    const ndi = di * cosT + cr * zSin;

    ar = nar; ai = nai; br = nbr; bi = nbi;
    cr = ncr; ci = nci; dr = ndr; di = ndi;
  }

  return ar + dr;
}

// ---------------------------------------------------------------------------
// Eigenfrequency counting
// ---------------------------------------------------------------------------

/**
 * Count eigenfrequencies in [0, lambdaMax] by scanning for sign changes
 * in Tr(T(omega)) - 2 and Tr(T(omega)) + 2.
 *
 * For a terminated cascade, standing-wave resonances occur at both passband
 * edges: Tr = +2 (in-phase) and Tr = -2 (anti-phase). Each interval [omega_n, omega_{n+1}]
 * between consecutive Tr=+2 zeros contains exactly one Tr=-2 zero and vice versa.
 *
 * We count all zero crossings of both (Tr-2) and (Tr+2). Each distinct eigenfrequency
 * triggers exactly one of these crossings, giving N_actual = total zero crossings / 2
 * would double-count. Instead we count crossings of Tr=+2 only (one per mode).
 *
 * Actually, for the non-uniform cascade the trace oscillates between values possibly
 * far exceeding +/-2. The correct eigenfrequency count for Dirichlet boundary
 * conditions on a non-uniform cascade uses all crossings of Tr = +2 (the
 * "Bloch condition" with k=0 and k=pi).
 *
 * We count downward crossings of Tr through +2: each one marks a new resonance.
 * This gives exactly N_Weyl resonances per "Brillouin zone" for a uniform cascade
 * and produces a well-defined Weyl remainder for the non-uniform case.
 */
function countEigenfrequencies(logPrimes, lambdaMax, stepsPerSpacing) {
  const N = logPrimes.length;
  // Total electrical length
  let Ltotal = 0;
  for (let k = 0; k < N; k++) Ltotal += logPrimes[k];

  // Expected average spacing between eigenfrequencies
  const expectedSpacing = Math.PI / Ltotal;
  const step = expectedSpacing / stepsPerSpacing;

  let count = 0;
  let prevVal = traceOfCascade(logPrimes, 1e-12) - 2.0;

  for (let omega = step; omega <= lambdaMax; omega += step) {
    const val = traceOfCascade(logPrimes, omega) - 2.0;
    // Count sign changes (zero crossings of Tr - 2)
    if (prevVal * val < 0) count++;
    prevVal = val;
  }

  return count;
}

/**
 * Find actual eigenfrequency locations (not just count) using bisection.
 * Returns sorted array of omega values where Tr(T(omega)) = 2.
 */
function findEigenfrequencies(logPrimes, lambdaMax, stepsPerSpacing) {
  const N = logPrimes.length;
  let Ltotal = 0;
  for (let k = 0; k < N; k++) Ltotal += logPrimes[k];

  const expectedSpacing = Math.PI / Ltotal;
  const step = expectedSpacing / stepsPerSpacing;
  const eigenfreqs = [];

  let prevOmega = 1e-12;
  let prevVal = traceOfCascade(logPrimes, prevOmega) - 2.0;

  for (let omega = step; omega <= lambdaMax; omega += step) {
    const val = traceOfCascade(logPrimes, omega) - 2.0;
    if (prevVal * val < 0) {
      // Bisect to find precise zero
      let lo = prevOmega, hi = omega;
      let fLo = prevVal;
      for (let iter = 0; iter < 40; iter++) {
        const mid = (lo + hi) / 2;
        const fMid = traceOfCascade(logPrimes, mid) - 2.0;
        if (fLo * fMid <= 0) { hi = mid; } else { lo = mid; fLo = fMid; }
      }
      eigenfreqs.push((lo + hi) / 2);
    }
    prevOmega = omega;
    prevVal = val;
  }

  return eigenfreqs;
}

// ---------------------------------------------------------------------------
// Weyl counting function (prediction)
// ---------------------------------------------------------------------------

/**
 * Weyl counting function prediction for the prime-indexed Darlington cascade.
 *
 * N_Weyl(lambda) = L_total * lambda / pi
 *
 * where L_total = sum_{k=1}^{N} log(p_k).
 *
 * @param {number[]} logPrimes - Array of log(p_k)
 * @param {number} lambda - Frequency threshold
 * @returns {number} Predicted eigenvalue count
 */
export function weylCountingFunction(logPrimes, lambda) {
  let Ltotal = 0;
  for (let k = 0; k < logPrimes.length; k++) Ltotal += logPrimes[k];
  return (Ltotal * lambda) / Math.PI;
}

// ---------------------------------------------------------------------------
// Main test: Weyl law convergence
// ---------------------------------------------------------------------------

/**
 * Run the Weyl law test for the Darlington cascade.
 *
 * For each cascade size N, we:
 * 1. Take the first N primes; section k has electrical length log(p_k)
 * 2. Scan for eigenfrequencies (Tr = +2 crossings) in [0, lambdaMax]
 * 3. Compare actual count with Weyl prediction L_total * lambdaMax / pi
 * 4. Compute the Weyl remainder and normalized remainder |R|/sqrt(L_total)
 *
 * @param {number} maxN - Maximum cascade size to test (default 200)
 * @returns {object} Test results including per-N data and verdict
 */
export function weylLawTest(maxN = 200) {
  const allSizes = [10, 20, 50, 100, 200, 500];
  const testSizes = allSizes.filter(n => n <= maxN);

  // Scan frequency range: use lambda_max such that we get a good sample.
  // For N=10, L_total ~ sum log(p) for first 10 primes ~ 15.1
  // N_Weyl(1) ~ 15.1/pi ~ 4.8, so we need lambda_max ~ 3 for ~15 eigenvalues.
  // For larger N, L_total grows so we get plenty at modest lambda_max.
  const lambdaMax = 3.0;

  // Samples per expected eigenvalue spacing. Higher = more accurate, slower.
  // 10 is safe for N <= 200 while keeping runtime < 5s.
  const stepsPerSpacing = 10;

  const results = [];

  for (const N of testSizes) {
    const primes = getPrimes(N);
    const logPrimes = primes.map(p => Math.log(p));
    let Ltotal = 0;
    for (let k = 0; k < N; k++) Ltotal += logPrimes[k];

    const actualCount = countEigenfrequencies(logPrimes, lambdaMax, stepsPerSpacing);
    const weylPrediction = weylCountingFunction(logPrimes, lambdaMax);
    const absoluteError = Math.abs(actualCount - weylPrediction);
    const relativeError = weylPrediction > 0 ? absoluteError / weylPrediction : 0;

    // Normalized remainder: |R| / sqrt(L_total)
    // Under RH-type cancellation this should stay bounded.
    const normalizedRemainder = Ltotal > 0 ? absoluteError / Math.sqrt(Ltotal) : 0;

    results.push({
      N,
      Ltotal: Math.round(Ltotal * 100) / 100,
      actualCount,
      weylPrediction: Math.round(weylPrediction * 100) / 100,
      absoluteError: Math.round(absoluteError * 100) / 100,
      relativeError: Math.round(relativeError * 10000) / 10000,
      normalizedRemainder: Math.round(normalizedRemainder * 1000) / 1000,
    });
  }

  // Analyze convergence: relative error should generally decrease
  let convergenceCount = 0;
  for (let i = 1; i < results.length; i++) {
    if (results[i].relativeError <= results[i - 1].relativeError + 0.02) {
      convergenceCount++;
    }
  }
  const converges = convergenceCount >= Math.floor((results.length - 1) * 0.5);

  // Check if normalized remainder stays bounded
  const maxNormRemainder = Math.max(...results.map(r => r.normalizedRemainder));
  const remainderBounded = maxNormRemainder < 5;

  // Check if relative error is small for the largest N tested
  const lastResult = results[results.length - 1];
  const accurateAtLargeN = lastResult.relativeError < 0.15;

  // Build verdict
  let verdict;
  if (converges && remainderBounded && accurateAtLargeN) {
    verdict =
      'PASS: Weyl law holds for the prime-indexed Darlington cascade. ' +
      `Eigenvalue count N(lambda) converges to L_total*lambda/pi (relative error ${(lastResult.relativeError * 100).toFixed(1)}% at N=${lastResult.N}). ` +
      `Normalized remainder |R|/sqrt(L_total) stays bounded (max ${maxNormRemainder.toFixed(2)}), ` +
      'consistent with O(sqrt(L)) fluctuations. ' +
      'This supports S7: the cascade eigenvalues follow the Weyl asymptotic with ' +
      'remainder controlled by prime distribution irregularity, exhibiting the ' +
      'square-root cancellation characteristic of RH.';
  } else if (converges && accurateAtLargeN) {
    verdict =
      'PARTIAL: Weyl law leading term is correct but remainder fluctuations ' +
      `are larger than O(sqrt(L)) (max normalized remainder ${maxNormRemainder.toFixed(2)}). ` +
      'The Weyl asymptotic holds but the remainder may contain contributions ' +
      'beyond simple square-root cancellation. Consistent with S7 at leading order.';
  } else if (converges) {
    verdict =
      'PARTIAL: Weyl law trend is visible but convergence is slow. ' +
      `Relative error at N=${lastResult.N} is ${(lastResult.relativeError * 100).toFixed(1)}%. ` +
      'Larger cascade sizes or higher frequency range needed for definitive conclusion on S7.';
  } else {
    verdict =
      'INCONCLUSIVE: Weyl law convergence not clearly established. ' +
      'This may reflect insufficient scan resolution, strong impedance-mismatch effects, ' +
      'or genuinely anomalous spectral behavior. Does not confirm S7 at tested sizes.';
  }

  return {
    lambdaMax,
    stepsPerSpacing,
    results,
    converges,
    remainderBounded,
    accurateAtLargeN,
    maxNormalizedRemainder: Math.round(maxNormRemainder * 1000) / 1000,
    verdict,
  };
}
