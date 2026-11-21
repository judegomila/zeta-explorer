/**
 * Odd Zeta Values & Irrationality Explorer
 *
 * Explores the irrationality of ζ(3), ζ(5), ζ(7), ... through the lens of
 * the ZPO twin-ladder model. At real integer points s = n, both the direct
 * and dual ladders are well-defined, and the Euler product converges absolutely.
 *
 * Known results encoded:
 *   - Apéry (1979): ζ(3) is irrational
 *   - Rivoal (2000): Infinitely many ζ(2n+1) are irrational
 *   - Zudilin (2001): At least one of ζ(5), ζ(7), ζ(9), ζ(11) is irrational
 *   - Ball-Rivoal (2001): dim_Q(span{1, ζ(3), ζ(5), ..., ζ(s)}) ≥ c·log(s)
 *
 * ZPO visualization:
 *   At s = n (real integer), the oscillator chain has no imaginary component.
 *   Each prime p contributes a purely real factor 1/(1 - p^{-n}).
 *   This is an analogy and numerical model; it does not imply irrationality
 *   or linear independence of the numerical zeta values.
 */

import { getPrimes, primeFrequency } from './primes.js';
import { eulerFactor, cAbs, zetaCriticalStrip } from './zeta.js';
import { directLadder, dualLadder, losslessBridge } from './oscillators.js';

// ─── Reference values for odd zeta (high precision) ─────────────────────────
export const ZETA_EXACT = {
  3:  1.2020569031595942,
  5:  1.0369277551433699,
  7:  1.0083492773819228,
  9:  1.0020083928260822,
  11: 1.0004941886041194,
  13: 1.0001227133475785,
  15: 1.0000305882363070,
  17: 1.0000076371976379,
  19: 1.0000019082127165,
  21: 1.0000004769329868,
};

// ─── Known irrationality results ────────────────────────────────────────────
export const IRRATIONALITY_RESULTS = [
  {
    year: 1979,
    author: 'Apéry',
    result: 'ζ(3) is irrational',
    detail: 'Used a remarkable recurrence to construct rational approximations converging too fast for ζ(3) to be rational.',
    latex: '\\zeta(3) \\notin \\mathbb{Q}',
  },
  {
    year: 2000,
    author: 'Rivoal',
    result: 'Infinitely many ζ(2n+1) are irrational',
    detail: 'Showed that among {ζ(3), ζ(5), ζ(7), ...}, infinitely many values are irrational.',
    latex: '\\dim_{\\mathbb{Q}} \\operatorname{span}\\{1, \\zeta(3), \\zeta(5), \\ldots\\} = \\infty',
  },
  {
    year: 2001,
    author: 'Zudilin',
    result: 'At least one of ζ(5), ζ(7), ζ(9), ζ(11) is irrational',
    detail: 'Refined Rivoal\'s method to pinpoint a short list containing at least one irrational value.',
    latex: '\\exists\\, n \\in \\{5,7,9,11\\}:\\; \\zeta(n) \\notin \\mathbb{Q}',
  },
  {
    year: 2001,
    author: 'Ball & Rivoal',
    result: 'Dimension bound for odd zeta span',
    detail: 'The Q-linear span of {1, ζ(3), ζ(5), ..., ζ(s)} has dimension at least c·log(s) for an explicit constant c.',
    latex: '\\dim_{\\mathbb{Q}} \\operatorname{span}\\{1, \\zeta(3), \\zeta(5), \\ldots, \\zeta(s)\\} \\geq \\frac{1 + \\log 2}{3 + \\log 2} \\cdot \\frac{\\log s}{2}',
  },
];

// ─── 1. Compute ζ(n) for odd positive integers ─────────────────────────────

/**
 * Compute ζ(n) for odd positive integer n using both the Euler product
 * and the Dirichlet series, then compare.
 *
 * @param {number} n - Odd positive integer (3, 5, 7, ...)
 * @param {number} numPrimes - Number of primes for Euler product
 * @returns {{ value, eulerProductValue, seriesValue, relativeError, convergenceRate }}
 */
export function oddZetaValue(n, numPrimes = 50) {
  if (n < 3 || n % 2 === 0) {
    return { value: NaN, eulerProductValue: NaN, seriesValue: NaN, relativeError: NaN, convergenceRate: NaN };
  }

  // Euler product: ζ(n) = Π_p 1/(1 - p^{-n})
  // Track second-to-last cumulative value for convergence rate
  const primes = getPrimes(numPrimes);
  let eulerProduct = 1;
  let eulerPrev = 1;
  for (let i = 0; i < primes.length; i++) {
    if (i === primes.length - 1) eulerPrev = eulerProduct;
    eulerProduct *= 1 / (1 - Math.pow(primes[i], -n));
  }

  // Dirichlet series: ζ(n) = Σ_{k=1}^{N} 1/k^n
  const N = 10000;
  let series = 0;
  for (let k = 1; k <= N; k++) {
    series += Math.pow(k, -n);
  }

  // Reference value
  const exact = ZETA_EXACT[n] || series;
  const relativeError = Math.abs(eulerProduct - exact) / exact;

  // Convergence rate: how fast does adding more primes improve the product?
  const convergenceRate = Math.abs(eulerProduct - eulerPrev) / eulerProduct;

  return {
    value: exact,
    eulerProductValue: eulerProduct,
    seriesValue: series,
    relativeError,
    convergenceRate,
  };
}

// ─── 2. Apéry-like accelerated series for ζ(3) ─────────────────────────────

/**
 * Compute Apéry's recurrence sequence for ζ(3).
 *
 * The key recurrence is:
 *   (n+1)³ a_{n+1} = (2n+1)(17n² + 17n + 5) a_n - n³ a_{n-1}
 *
 * with a_0 = 0, a_1 = 6, b_0 = 1, b_1 = 5 (for the denominators).
 * The ratio a_n/b_n converges to ζ(3) geometrically fast.
 *
 * @param {number} maxTerms - Number of terms to compute
 * @returns {{ an, bn, convergents, limit, denominatorGrowth }}
 */
export function aperySequence(maxTerms = 20) {
  const an = [0, 6];
  const bn = [1, 5];
  const convergents = [];
  const denominatorGrowth = [];

  // a_0/b_0 is 0/1 = 0, skip; a_1/b_1 = 6/5 = 1.2
  convergents.push({ n: 1, value: an[1] / bn[1], error: Math.abs(an[1] / bn[1] - ZETA_EXACT[3]) });

  for (let i = 1; i < maxTerms; i++) {
    const n = i;
    const coeff = (2 * n + 1) * (17 * n * n + 17 * n + 5);
    const nCubed = n * n * n;
    const np1Cubed = (n + 1) * (n + 1) * (n + 1);

    const aNext = (coeff * an[i] - nCubed * an[i - 1]) / np1Cubed;
    const bNext = (coeff * bn[i] - nCubed * bn[i - 1]) / np1Cubed;

    an.push(aNext);
    bn.push(bNext);

    const conv = aNext / bNext;
    const err = Math.abs(conv - ZETA_EXACT[3]);
    convergents.push({ n: i + 1, value: conv, error: err });

    // Denominator growth: should be roughly C^n where C = (1+√2)^4 ≈ 33.97
    if (Math.abs(bNext) > 0 && Math.abs(bn[i]) > 0) {
      denominatorGrowth.push({
        n: i + 1,
        ratio: Math.abs(bNext / bn[i]),
        logRatio: Math.log(Math.abs(bNext / bn[i])),
      });
    }
  }

  return {
    an,
    bn,
    convergents,
    limit: ZETA_EXACT[3],
    denominatorGrowth,
    aperyConstant: ZETA_EXACT[3],
  };
}

// ─── 3. ZPO interpretation: ζ(n) as n-th order transfer function ────────────

/**
 * View ζ(n) as the product of n-th order transfer functions along the
 * oscillator chain. At s = n (real axis), each Euler factor is purely real:
 *   H_p^(n) = 1/(1 - p^{-n})
 *
 * @param {number} n - Odd positive integer
 * @param {number} numPrimes - Number of primes
 * @returns {{ stages, totalTransfer, impedanceProfile, phaseProfile }}
 */
export function oddZetaAsTransferFunction(n, numPrimes = 30) {
  const primes = getPrimes(numPrimes);
  const stages = [];
  let totalTransfer = 1;

  for (const p of primes) {
    const factor = 1 / (1 - Math.pow(p, -n));
    totalTransfer *= factor;

    // Impedance at s = n: Z_p(n) = n·log(p) + log(p)/n
    const omega = primeFrequency(p);
    const impedance = n * omega + omega / n;

    // Phase is 0 on the real axis (purely real transfer)
    stages.push({
      prime: p,
      factor,
      factorDB: 20 * Math.log10(factor),
      impedance,
      phase: 0,
      decay: Math.pow(p, -n),
      cumulativeTransfer: totalTransfer,
    });
  }

  const impedanceProfile = stages.map(s => ({ prime: s.prime, impedance: s.impedance }));
  const phaseProfile = stages.map(s => ({ prime: s.prime, phase: s.phase }));

  return {
    stages,
    totalTransfer,
    impedanceProfile,
    phaseProfile,
    zetaValue: ZETA_EXACT[n] || totalTransfer,
  };
}

// ─── 4. Linear independence analysis ────────────────────────────────────────

/**
 * Construct the Gram matrix for {1, ζ(3), ζ(5), ..., ζ(maxOdd)} using
 * an inner product derived from Euler factors.
 *
 * The inner product <f, g> is defined as:
 *   <ζ(m), ζ(n)> = Σ_p log(p) / (p^m - 1)(p^n - 1)
 *
 * A nonzero determinant implies linear independence of these prime-indexed
 * feature vectors in the chosen model inner product. It does NOT imply
 * Q-linear independence of the numerical values 1, ζ(3), ζ(5), ...
 *
 * @param {number} maxOdd - Maximum odd integer to include
 * @param {number} numPrimes - Number of primes for the inner product sum
 * @returns {{ values, gramMatrix, determinant, nearDependencies }}
 */
export function modelGramGeometry(maxOdd = 11, numPrimes = 50) {
  const primes = getPrimes(numPrimes);

  // Build the list of odd values: [1, ζ(3), ζ(5), ..., ζ(maxOdd)]
  const oddIndices = [1]; // 1 is the "constant" function
  for (let k = 3; k <= maxOdd; k += 2) {
    oddIndices.push(k);
  }

  const values = oddIndices.map(k => {
    if (k === 1) return { n: 1, value: 1 };
    return { n: k, value: ZETA_EXACT[k] || oddZetaValue(k, numPrimes).eulerProductValue };
  });

  const dim = oddIndices.length;
  const gramMatrix = Array.from({ length: dim }, () => new Array(dim).fill(0));

  // Precompute log(p) and p^k - 1 for all (prime, oddIndex) pairs
  // to avoid redundant Math.log and Math.pow calls in the triple-nested loop.
  const numP = primes.length;
  const logP = new Float64Array(numP);
  // powMinus1[pi * dim + ki] = p^oddIndices[ki] - 1
  const powMinus1 = new Float64Array(numP * dim);
  for (let pi = 0; pi < numP; pi++) {
    const p = primes[pi];
    logP[pi] = Math.log(p);
    for (let ki = 0; ki < dim; ki++) {
      const k = oddIndices[ki];
      powMinus1[pi * dim + ki] = Math.pow(p, k) - 1; // k=1 gives p-1
    }
  }

  // Compute inner products using precomputed tables
  // Use the general formula <f_m, f_n> = Σ_p log(p) / ((p^m - 1)(p^n - 1))
  // consistently for all entries, including the "1" element (treated as index 1,
  // so p^1 - 1 = p - 1). This ensures the Gram matrix corresponds to a single
  // consistent inner product — the previous special-case for <1,1> used
  // Σ log(p)/(p(p-1)) which was inconsistent with the off-diagonal <1, ζ(k)>
  // entries that used Σ log(p)/((p-1)(p^k - 1)).
  for (let i = 0; i < dim; i++) {
    for (let j = i; j < dim; j++) {
      let ip = 0;
      for (let pi = 0; pi < numP; pi++) {
        ip += logP[pi] / (powMinus1[pi * dim + i] * powMinus1[pi * dim + j]);
      }
      gramMatrix[i][j] = ip;
      gramMatrix[j][i] = ip;
    }
  }

  // Compute determinant via LU decomposition (Gaussian elimination)
  const det = matrixDeterminant(gramMatrix);

  // Check for near-dependencies
  const nearDependencies = [];
  for (let i = 0; i < dim; i++) {
    for (let j = i + 1; j < dim; j++) {
      const cosAngle = gramMatrix[i][j] / Math.sqrt(gramMatrix[i][i] * gramMatrix[j][j]);
      if (Math.abs(cosAngle) > 0.99) {
        nearDependencies.push({
          pair: [oddIndices[i], oddIndices[j]],
          cosineAngle: cosAngle,
        });
      }
    }
  }

  return {
    values,
    gramMatrix,
    determinant: det,
    logDeterminant: det > 0 ? Math.log10(det) : -Infinity,
    nearDependencies,
    dimension: dim,
    indices: oddIndices,
    provesQLinearIndependence: false,
    interpretation:
      'Model-feature Gram geometry only; the determinant is not an arithmetic ' +
      'linear-independence test for numerical zeta values.',
  };
}

// Backward-compatible name retained for callers; it is not an arithmetic test.
export const linearIndependenceTest = modelGramGeometry;

/**
 * Compute determinant of a square matrix via Gaussian elimination.
 */
function matrixDeterminant(matrix) {
  const n = matrix.length;
  // Clone the matrix
  const a = matrix.map(row => [...row]);
  let det = 1;

  for (let col = 0; col < n; col++) {
    // Partial pivoting
    let maxRow = col;
    let maxVal = Math.abs(a[col][col]);
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(a[row][col]) > maxVal) {
        maxVal = Math.abs(a[row][col]);
        maxRow = row;
      }
    }
    if (maxRow !== col) {
      [a[col], a[maxRow]] = [a[maxRow], a[col]];
      det *= -1;
    }
    if (Math.abs(a[col][col]) < 1e-30) return 0;

    det *= a[col][col];
    for (let row = col + 1; row < n; row++) {
      const factor = a[row][col] / a[col][col];
      for (let k = col; k < n; k++) {
        a[row][k] -= factor * a[col][k];
      }
    }
  }
  return det;
}

// ─── 5. Irrationality measure computation ───────────────────────────────────

/**
 * Compute a finite continued-fraction slope diagnostic for ζ(n).
 * A fit to finitely many floating-point approximations does not estimate or
 * certify the irrationality measure in the theorem-level sense.
 *
 * The irrationality measure μ satisfies:
 *   |ζ(n) - p/q| > c/q^μ  for all p/q with q large enough.
 *
 * Known bounds:
 *   - ζ(3): μ ≤ 5.513891... (Rhin & Viola, 2001)
 *   - ζ(2): μ ≤ 5.441... (Rhin & Viola, 1996)
 *   - Any irrational: μ ≥ 2
 *
 * We use continued fraction expansion to find best approximations.
 *
 * @param {number} n - Odd positive integer
 * @param {number} maxDenom - Maximum denominator to search
 * @returns {{ value, bestApproximations, measureEstimate, aperyBound }}
 */
export function approximationSlopeDiagnostic(n, maxDenom = 5000) {
  const value = ZETA_EXACT[n] || oddZetaValue(n, 100).eulerProductValue;

  // Continued fraction expansion
  const bestApproximations = [];
  let x = value;
  let p0 = 0, p1 = 1;
  let q0 = 1, q1 = 0;

  for (let i = 0; i < 50 && q1 < maxDenom; i++) {
    const a = Math.floor(x);
    const pNew = a * p1 + p0;
    const qNew = a * q1 + q0;

    if (qNew > maxDenom) break;
    if (qNew > 0) {
      const error = Math.abs(value - pNew / qNew);
      bestApproximations.push({
        p: pNew,
        q: qNew,
        approximation: pNew / qNew,
        error,
        logError: error > 0 ? Math.log(error) : -40,
        logQ: Math.log(qNew),
      });
    }

    p0 = p1; p1 = pNew;
    q0 = q1; q1 = qNew;

    const frac = x - a;
    if (Math.abs(frac) < 1e-15) break;
    x = 1 / frac;
  }

  // Descriptive finite-sample slope of log|error| vs log(q).
  let measureEstimate = 2;
  if (bestApproximations.length >= 4) {
    // Use least-squares fit on log|ζ(n) - p/q| vs -log(q)
    const pts = bestApproximations
      .filter(a => a.error > 0 && a.q > 1)
      .map(a => ({ x: Math.log(a.q), y: Math.log(a.error) }));
    if (pts.length >= 3) {
      let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
      for (const pt of pts) {
        sumX += pt.x;
        sumY += pt.y;
        sumXY += pt.x * pt.y;
        sumX2 += pt.x * pt.x;
      }
      const N = pts.length;
      const slope = (N * sumXY - sumX * sumY) / (N * sumX2 - sumX * sumX);
      measureEstimate = -slope;
    }
  }

  // Known bounds for specific values
  const knownBounds = {
    3: 5.513891,
    5: null,  // Not proven irrational individually
    7: null,
    9: null,
    11: null,
  };

  return {
    value,
    bestApproximations,
    measureEstimate,
    aperyBound: knownBounds[n] || null,
    isProvenIrrational: n === 3,
    knownBound: knownBounds[n],
    isCertifiedMeasure: false,
    diagnosticOnly: true,
  };
}

// Backward-compatible name retained for callers; the result is diagnostic only.
export const irrationalityMeasure = approximationSlopeDiagnostic;

// ─── 6. Twin-ladder resonance at odd integers ───────────────────────────────

/**
 * Analyze the twin-ladder system at s = n (real odd integer).
 * At real integer points, both direct and dual ladders have purely real
 * transfer functions, and the bridge factor chi(n) has known values.
 *
 * @param {number} n - Odd positive integer
 * @param {number} numPrimes - Number of primes
 * @returns {{ directLadderAt_n, dualLadderAt_n, bridgeAt_n, mismatch, resonanceQ }}
 */
export function oddResonanceAnalysis(n, numPrimes = 20) {
  const s = [n, 0]; // s = n on the real axis

  const direct = directLadder(s, numPrimes);
  const dual = dualLadder(s, numPrimes); // at s = 1-n

  const bridge = losslessBridge(s);

  // Mismatch between direct and dual
  const directMag = direct.totalMagnitude;
  const dualMag = dual.totalMagnitude;
  const mismatch = Math.abs(directMag - dualMag * bridge.magnitude) / directMag;

  // Resonance Q factor at this point
  const resonanceQ = directMag / (direct.totalEnergy || 1);

  return {
    directLadderAt_n: {
      magnitude: directMag,
      phase: direct.totalPhase,
      energy: direct.totalEnergy,
      stages: direct.stages.length,
    },
    dualLadderAt_n: {
      magnitude: dualMag,
      phase: dual.totalPhase,
      energy: dual.totalEnergy,
    },
    bridgeAt_n: {
      magnitude: bridge.magnitude,
      phase: bridge.phase,
      isUnitary: bridge.isUnitary,
    },
    mismatch,
    resonanceQ,
    zetaValue: ZETA_EXACT[n] || directMag,
  };
}

// ─── 7. Hermite-Padé approximants ──────────────────────────────────────────

/**
 * Compute Padé-type approximants for ζ(n).
 * These are rational functions R(n) = P(n)/Q(n) that approximate ζ(n).
 *
 * We use a simple [m/m] Padé approach based on the series expansion:
 *   ζ(n) = 1 + 1/2^n + 1/3^n + ... and form rational approximants.
 *
 * @param {number} n - Odd positive integer
 * @param {number} order - Order of the Padé approximant
 * @returns {{ approximant, remainder, denominatorDegree, convergenceRate }}
 */
export function hermitePadeApproximants(n, order = 8) {
  const target = ZETA_EXACT[n] || oddZetaValue(n, 100).eulerProductValue;

  // Build partial sums and use them to construct rational approximants
  const partialSums = [];
  let sum = 0;
  for (let k = 1; k <= 2 * order + 5; k++) {
    sum += Math.pow(k, -n);
    partialSums.push({ k, sum, error: Math.abs(sum - target) });
  }

  // Compute successive Padé-like approximants using Wynn's epsilon algorithm
  // on the partial sums
  const approximants = [];
  const eps = Array.from({ length: 2 * order + 2 }, () => new Array(2 * order + 2).fill(0));

  // Initialize: eps_{-1}(k) = 0, eps_0(k) = S_k
  for (let k = 0; k < Math.min(partialSums.length, 2 * order + 1); k++) {
    eps[0][k] = partialSums[k].sum;
  }

  for (let j = 1; j <= order; j++) {
    for (let k = 0; k < 2 * order + 1 - j; k++) {
      const diff = eps[j - 1][k + 1] - eps[j - 1][k];
      if (Math.abs(diff) < 1e-30) {
        eps[j][k] = eps[j - 1][k + 1];
      } else {
        eps[j][k] = (j >= 2 ? eps[j - 2][k + 1] : 0) + 1 / diff;
      }
    }

    // Even-order epsilon values are the Padé approximants
    if (j % 2 === 0) {
      const approxValue = eps[j][0];
      const err = Math.abs(approxValue - target);
      approximants.push({
        order: j / 2,
        value: approxValue,
        error: err,
        logError: err > 0 ? Math.log10(err) : -16,
      });
    }
  }

  // Convergence rate from successive approximants
  let convergenceRate = 0;
  if (approximants.length >= 2) {
    const last = approximants[approximants.length - 1];
    const prev = approximants[approximants.length - 2];
    if (prev.error > 0 && last.error > 0) {
      convergenceRate = Math.log(prev.error / last.error);
    }
  }

  return {
    approximants,
    target,
    partialSums,
    convergenceRate,
    bestApproximant: approximants.length > 0 ? approximants[approximants.length - 1] : null,
  };
}

// ─── 8. Scan: how ζ(n) varies with n for odd n ─────────────────────────────

/**
 * Compute ζ(n) for all odd n from 3 to maxN, showing how the values
 * decay towards 1 as n increases.
 *
 * @param {number} maxN - Maximum odd integer
 * @param {number} numPrimes - Number of primes for Euler product
 * @returns {Array<{ n, value, eulerProduct, log2Value, entropyContribution }>}
 */
export function oddZetaDecay(maxN = 21, numPrimes = 50) {
  const results = [];
  const primes = getPrimes(numPrimes);

  for (let n = 3; n <= maxN; n += 2) {
    let eulerProduct = 1;
    let entropy = 0;

    for (const p of primes) {
      const factor = 1 / (1 - Math.pow(p, -n));
      eulerProduct *= factor;
      // Information content: -log2 of each factor's contribution to the excess
      const excess = factor - 1;
      if (excess > 1e-30) {
        entropy -= excess * Math.log2(excess);
      }
    }

    const value = ZETA_EXACT[n] || eulerProduct;
    const excess = value - 1;

    results.push({
      n,
      value,
      eulerProduct,
      excess,
      log2Value: Math.log2(excess),
      entropyContribution: entropy,
      leadingTerm: Math.pow(2, -n),  // The 2^{-n} term dominates
    });
  }

  return results;
}

// ─── 9. Euler product convergence trace ─────────────────────────────────────

/**
 * Trace the Euler product as primes are added one by one for a given odd n.
 * Shows how the product builds up to ζ(n).
 *
 * @param {number} n - Odd positive integer
 * @param {number} numPrimes - Number of primes
 * @returns {Array<{ primeIndex, prime, factor, cumulativeProduct, error }>}
 */
export function eulerProductTrace(n, numPrimes = 50) {
  const primes = getPrimes(numPrimes);
  const target = ZETA_EXACT[n] || oddZetaValue(n, 200).seriesValue;
  const trace = [];
  let product = 1;

  for (let i = 0; i < primes.length; i++) {
    const p = primes[i];
    const factor = 1 / (1 - Math.pow(p, -n));
    product *= factor;

    trace.push({
      primeIndex: i + 1,
      prime: p,
      factor,
      factorMinusOne: factor - 1,
      cumulativeProduct: product,
      error: Math.abs(product - target),
      relativeError: Math.abs(product - target) / target,
    });
  }

  return trace;
}

// ─── 10. Transfer function decay comparison ─────────────────────────────────

/**
 * Compare the Euler factor magnitudes |H_p(n)| = 1/(1 - p^{-n}) across
 * different odd values of n. Higher n means faster decay (fewer primes matter).
 *
 * @param {number[]} nValues - Array of odd integers to compare
 * @param {number} numPrimes - Number of primes
 * @returns {{ primes, profiles }}
 */
export function transferFunctionDecayComparison(nValues, numPrimes = 30) {
  const primes = getPrimes(numPrimes);

  const profiles = nValues.map(n => {
    const factors = primes.map(p => {
      const f = 1 / (1 - Math.pow(p, -n));
      return {
        prime: p,
        factor: f,
        excessDB: 20 * Math.log10(f - 1 + 1e-30),
        decay: Math.pow(p, -n),
      };
    });
    return { n, factors };
  });

  return { primes, profiles };
}

// ─── Algorithmic information audit ──────────────────────────────────────────

/**
 * Return the computability obstruction to an ordinary Kolmogorov-complexity
 * proof for a fixed zeta value. This deliberately replaces the retired
 * finite-digit "complexity estimators": compression tests on float64 digits
 * cannot lower-bound Kolmogorov complexity or prove irrationality.
 *
 * @param {number} n - Integer n > 1
 */
export function ordinaryKolmogorovPrefixAudit(n) {
  if (!Number.isInteger(n) || n <= 1) {
    throw new Error('ordinaryKolmogorovPrefixAudit requires an integer n > 1');
  }

  return {
    n,
    status: 'REFUTED_AS_STATED',
    conditionalBound: 'K(d_b(zeta(n),N) | N,b) = O_n(1)',
    unconditionalBound: 'K(d_b(zeta(n),N)) = O_n(log N)',
    computabilityWitness:
      'The Dirichlet partial sums have effective tail ' +
      '0 < zeta(n)-sum_{r<=M} r^(-n) < M^(1-n)/(n-1).',
    consequence:
      'A lower bound c*N^alpha would imply noncomputability and therefore ' +
      'cannot hold for this fixed zeta value.',
    eulerProductNote:
      'Counting evaluated primes measures work performed by one algorithm, ' +
      'not ordinary Kolmogorov program length.',
    provesIrrationality: false,
  };
}


// ── Cross-verification record (imp-1060, 2026-05-13) ─────────────────────────
//
// HISTORICAL RECORD. Independent re-derivation of numeric calculations made by
// an earlier version of this file. The 2026-08-28 audit retired its Chaitin and
// digit-randomness functions: checking their arithmetic did not validate their
// theorem-level interpretation. Uses no
// helper from this file (the verifier re-implemented each computation from
// scratch and compared). Findings recorded as data so the audit is grep-able
// and survives future edits.
//
// SYNTAX NOTE: line // comments are used throughout so that any reference to
// the star-slash sequence cannot prematurely close a JSDoc block.

export const CROSS_VERIFICATION_IMP1060_2026_05_13 = {
  ticket: "imp-1060",
  date: "2026-05-13",
  verifier: "opus-4-7 S10-verify cross-verify pass",
  subject: "src/math/odd-zeta.js",

  computationsChecked: [
    {
      label: "ZETA_EXACT reference table (n = 3, 5, ..., 21)",
      claim:
        "Hard-coded high-precision values for ten odd zetas: ZETA_EXACT[3] = 1.2020569031595942, " +
        "ZETA_EXACT[5] = 1.0369277551433699, ..., ZETA_EXACT[21] = 1.0000004769329868.",
      independentCheck:
        "Recomputed each value via the truncated Dirichlet series sum_{k=1..1e7} 1/k^n " +
        "summed in reverse (large k first) for numerical stability, plus the " +
        "Euler-Maclaurin tail 1/((n-1) N^{n-1}). All ten values agree with the " +
        "table to relative error <= 2.2e-16 (i.e. last-bit float64). Cross-checked " +
        "against the literature: zeta(3) = 1.20205690315959428540...,  " +
        "zeta(5) = 1.03692775514336992633..., consistent at displayed precision.",
      verdict: "OK",
    },
    {
      label: "aperySequence recurrence polynomial",
      claim:
        "Comment says '(n+1)^3 a_{n+1} = (2n+1)(17 n^2 + 17 n + 5) a_n - n^3 a_{n-1}'. " +
        "Code uses coeff = (2*n + 1) * (17*n*n + 17*n + 5).",
      independentCheck:
        "Algebraic expansion: (2n+1)(17 n^2 + 17 n + 5) = 34 n^3 + 51 n^2 + 27 n + 5, " +
        "which is the textbook Apery polynomial (van der Poorten 1979, Henri Cohen 'Number Theory II'). " +
        "Initial conditions a_0 = 0, a_1 = 6, b_0 = 1, b_1 = 5 also match standard Apery sequences.",
      verdict: "OK",
    },
    {
      label: "aperySequence b_n integer sequence (OEIS A005259)",
      claim:
        "Implicit: b_n must reproduce the Apery denominator sequence " +
        "1, 5, 73, 1445, 33001, 819005, 21460825, 584307365, ...",
      independentCheck:
        "Running aperySequence(8) and reading bn[0..7] yields exactly " +
        "[1, 5, 73, 1445, 33001, 819005, 21460825, 584307365] " +
        "(matches OEIS A005259 byte-for-byte). The floating-point recurrence is " +
        "stable enough at this length to land on integers despite the (n+1)^3 division.",
      verdict: "OK",
    },
    {
      label: "aperySequence convergent a_n / b_n converges to zeta(3)",
      claim:
        "convergents[i].value tracks a_{i+1} / b_{i+1} and error is " +
        "|a_{i+1}/b_{i+1} - zeta(3)|; expected ratio of successive errors is " +
        "(1 + sqrt(2))^{-4} = 1 / 33.9706 (Apery's geometric convergence rate).",
      independentCheck:
        "By n = 8 the convergent agrees with ZETA_EXACT[3] to all 16 digits, so error " +
        "saturates at 0 (float64 round-off). The denominator growth ratio " +
        "b_{n+1}/b_n at n = 6..8 is observed to be 26.2, 27.2, 28.0 — climbing " +
        "toward the asymptotic 33.97 as expected.",
      verdict: "OK",
    },
    {
      label: "oddZetaValue Euler product convergence",
      claim:
        "Implicit: Euler product Pi_{p prime} 1/(1 - p^{-n}) with the first 50 primes " +
        "should approximate zeta(n). Relative error should decrease rapidly with n.",
      independentCheck:
        "Computed eulerProductValue for n = 3, 5, 7, 9, 11 with 50 primes. " +
        "Observed relative errors: 1.5e-6 (n=3), 1.5e-11 (n=5), 1.8e-15 (n=7), " +
        "1.1e-15 (n=9), 6.7e-16 (n=11). The slow n=3 convergence is intrinsic " +
        "(tail is O(P^{-2}/log P) with P = 50-th prime = 229, giving ~5e-6 — matches).",
      verdict: "OK",
    },
    {
      label: "Wynn epsilon recurrence in hermitePadeApproximants",
      claim:
        "Code uses eps[j][k] = (j >= 2 ? eps[j-2][k+1] : 0) + 1 / (eps[j-1][k+1] - eps[j-1][k]).",
      independentCheck:
        "This is the textbook Wynn epsilon algorithm " +
        "(epsilon_j(k) = epsilon_{j-2}(k+1) + 1 / (epsilon_{j-1}(k+1) - epsilon_{j-1}(k))) " +
        "with the standard convention epsilon_{-1}(k) = 0. Even-order entries are " +
        "the Pade approximants of the underlying series. Implementation is correct.",
      verdict: "OK",
    },
    {
      label: "algorithmicRandomnessTest runs-test variance",
      claim: "varianceRuns = (expectedRuns - 1) * (expectedRuns - 2) / (effectiveBits - 1).",
      independentCheck:
        "Let mu = E[R] = 1 + 2 n_1 n_0 / n. Then (mu - 1)(mu - 2) / (n - 1) " +
        "= (2 n_1 n_0 / n) * ((2 n_1 n_0 - n) / n) / (n - 1) " +
        "= 2 n_1 n_0 (2 n_1 n_0 - n) / (n^2 (n - 1)), " +
        "the textbook Wald-Wolfowitz runs-test variance.",
      verdict: "OK",
    },
    {
      label: "kolmogorovComplexityEstimate float64 mantissa cap",
      claim: "effectiveBits = min(bits, 52).",
      independentCheck:
        "IEEE 754 double has a 52-bit mantissa (plus implicit leading 1). After " +
        "52 iterations of frac *= 2 the extracted bit is rounding noise rather " +
        "than a real digit of zeta(n). Cap is correct.",
      verdict: "OK",
    },
  ],

  unusedImportsNoted: [
    "eulerFactor (from ./zeta.js) — imported, never referenced",
    "cAbs (from ./zeta.js) — imported, never referenced",
    "zetaCriticalStrip (from ./zeta.js) — imported, never referenced",
  ],

  conceptualCaveats: [
    "chaitinProofStrategy step 1 ('computing N digits of zeta(n) needs all primes <= 10^{N/n}') " +
      "was later refuted as a Kolmogorov lower-bound premise and the function was retired " +
      "by the 2026-08-28 audit. Prime count measures runtime, not program length.",
    "hermitePadeApproximants is named 'Hermite-Pade' but implements scalar Pade via Wynn epsilon. " +
      "True Hermite-Pade is the simultaneous-Pade generalization. Naming is loose but the math is correct.",
  ],

  summary:
    "Eight independent checks (reference table, Apery polynomial, Apery integer sequence, " +
    "Apery convergence, Euler product, Wynn epsilon, runs-test variance, float64 cap) all clean. " +
    "No numerical errors found. Three unused imports and two conceptual caveats logged " +
    "for follow-up but not in scope of this verification pass.",
};
