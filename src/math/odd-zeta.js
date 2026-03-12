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
 * ZPO Interpretation:
 *   At s = n (real integer), the oscillator chain has no imaginary component.
 *   Each prime p contributes a purely real factor 1/(1 - p^{-n}).
 *   The transfer function at odd integers encodes arithmetic information
 *   that is "irrational" — no finite rational combination can reproduce it.
 */

import { getPrimes, primeFrequency } from './primes.js';
import { eulerFactor, cAbs, zetaCriticalStrip } from './zeta.js';
import { directLadder, dualLadder, losslessBridge } from './oscillators.js';

// ─── Reference values for odd zeta (high precision) ─────────────────────────
const ZETA_EXACT = {
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
 * A nonzero determinant of the Gram matrix implies linear independence.
 *
 * @param {number} maxOdd - Maximum odd integer to include
 * @param {number} numPrimes - Number of primes for the inner product sum
 * @returns {{ values, gramMatrix, determinant, nearDependencies }}
 */
export function linearIndependenceTest(maxOdd = 11, numPrimes = 50) {
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
  };
}

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
 * Estimate the irrationality measure of ζ(n) by finding best rational
 * approximations p/q and measuring how fast |ζ(n) - p/q| decreases.
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
export function irrationalityMeasure(n, maxDenom = 5000) {
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

  // Estimate irrationality measure from the slope of log|error| vs log(q)
  let measureEstimate = 2; // default: Liouville bound for algebraic irrationals
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
  };
}

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

// ─── Algorithmic Information Theory Approach ─────────────────────────────────

/**
 * Chaitin's Omega: the halting probability Ω = Σ 2^{-|p|} over halting programs p.
 * Ω is algorithmically random — its binary expansion has maximal Kolmogorov complexity.
 *
 * Connection to ζ(odd): if ζ(2n+1) were rational = a/b, then its binary expansion
 * would be eventually periodic → K(ζ(2n+1)|_N) = O(log N) for the first N bits.
 * But the Euler product encodes ALL primes, suggesting K(ζ(2n+1)|_N) grows like N.
 *
 * We estimate Kolmogorov complexity via compressibility: try to "compress" the
 * binary expansion by finding patterns. Low compression ratio = high complexity = likely irrational.
 *
 * @param {number} n - Odd integer (3, 5, 7, ...)
 * @param {number} bits - Number of binary digits to analyze
 * @returns {{ value, binaryDigits, compressionRatio, kolmogorovEstimate,
 *            isCompressible, lempelZivComplexity, blockEntropy, verdict }}
 */
export function kolmogorovComplexityEstimate(n, bits = 200) {
  // Compute ζ(n) to high precision using the Euler product + series
  const value = oddZetaValue(n, 100).value;

  // Cap bits at float64 mantissa precision (~52 bits).
  // Beyond this, frac *= 2 extracts IEEE 754 rounding noise, not real digits.
  const effectiveBits = Math.min(bits, 52);

  // Extract binary digits of the fractional part
  let frac = value - Math.floor(value);
  const binaryDigits = [];
  for (let i = 0; i < effectiveBits; i++) {
    frac *= 2;
    binaryDigits.push(Math.floor(frac));
    frac -= Math.floor(frac);
  }

  // Lempel-Ziv complexity (count distinct substrings)
  // This is a standard compressibility measure
  const lzComplexity = lempelZivComplexity(binaryDigits);

  // Maximum possible LZ complexity for random sequence of length N ~ N/log2(N)
  const maxLZ = effectiveBits / Math.log2(Math.max(effectiveBits, 2));
  const normalizedLZ = lzComplexity / maxLZ;

  // Block entropy: divide into blocks of size b, compute Shannon entropy
  const blockSize = 8;
  const blockEntropy = computeBlockEntropy(binaryDigits, blockSize);
  const maxBlockEntropy = blockSize; // bits per block for perfectly random

  // Compression ratio: how much smaller can we represent this?
  // Use run-length encoding as a simple compressor
  const rleLength = runLengthEncode(binaryDigits).length;
  const compressionRatio = rleLength / effectiveBits;

  // Kolmogorov complexity lower bound estimate
  // K(x) ≥ |compressed(x)| for any compressor
  const kolmogorovEstimate = Math.max(rleLength, lzComplexity * Math.log2(effectiveBits));

  const isCompressible = compressionRatio < 0.85; // would indicate periodicity

  return {
    n,
    value,
    binaryDigits: binaryDigits.join(''),
    effectiveBits,
    compressionRatio,
    kolmogorovEstimate,
    isCompressible,
    lempelZivComplexity: lzComplexity,
    normalizedLZ,
    blockEntropy,
    maxBlockEntropy,
    precisionNote: bits > 52 ? `Capped at ${effectiveBits} bits (float64 mantissa limit); requested ${bits} would include rounding noise` : null,
    verdict: isCompressible
      ? `ζ(${n}) binary expansion is compressible — suspiciously regular (but may be precision artifacts)`
      : `ζ(${n}) binary expansion appears incompressible — consistent with irrationality (K ≈ ${kolmogorovEstimate.toFixed(0)} bits for ${effectiveBits} bits)`,
  };
}

// Lempel-Ziv complexity (LZ76): count distinct factors in sequential parsing
function lempelZivComplexity(seq) {
  const s = seq.join('');
  if (s.length === 0) return 0;
  let complexity = 1; // first character is always a new phrase
  let i = 1;
  while (i < s.length) {
    let len = 1;
    // Find the longest prefix of s[i..] that appears in history s[0..i-1].
    // Extend len while the substring IS found (!== -1); stop when it's NOT found.
    // Then len is the first non-match length, so the longest match has length len-1.
    // New phrase = longest match (len-1) + one new character = length len.
    while (i + len <= s.length && s.substring(0, i).indexOf(s.substring(i, i + len)) !== -1) {
      len++;
    }
    complexity++;
    i += len;
  }
  return complexity;
}

// Block entropy
function computeBlockEntropy(bits, blockSize) {
  const numBlocks = Math.floor(bits.length / blockSize);
  if (numBlocks === 0) return 0;
  const counts = {};
  for (let i = 0; i < numBlocks; i++) {
    const block = bits.slice(i * blockSize, (i + 1) * blockSize).join('');
    counts[block] = (counts[block] || 0) + 1;
  }
  let entropy = 0;
  for (const key in counts) {
    const p = counts[key] / numBlocks;
    if (p > 0) entropy -= p * Math.log2(p);
  }
  return entropy;
}

// Run-length encoding
function runLengthEncode(bits) {
  const rle = [];
  let current = bits[0];
  let count = 1;
  for (let i = 1; i < bits.length; i++) {
    if (bits[i] === current) {
      count++;
    } else {
      rle.push([current, count]);
      current = bits[i];
      count = 1;
    }
  }
  rle.push([current, count]);
  return rle;
}

/**
 * Chaitin's Theorem applied to odd zeta: if ζ(n) is irrational, then
 * its digits cannot be produced by a program shorter than ~N bits for N digits.
 *
 * We test this by checking if the Euler product "compresses" the information:
 * The product uses ~K primes, each contributing ~log(p) bits.
 * Total "program length" = Σ_{p≤P_K} log2(log(p)) + O(K)
 * If this is << N (number of digits we can compute), the Euler product
 * is an efficient "program" for computing ζ(n), but it's infinite.
 *
 * @param {number} n - Odd integer
 * @param {number} maxPrimes - Maximum primes in Euler product
 * @returns {{ primePrograms, totalProgramBits, digitsComputed,
 *            compressionRatio, chaitinBound, interpretation }}
 */
export function chaitinEulerAnalysis(n, maxPrimes = 50) {
  const primes = getPrimes(maxPrimes);
  const primePrograms = [];
  let totalProgramBits = 0;
  let cumulativeProduct = 1;

  for (let i = 0; i < primes.length; i++) {
    const p = primes[i];
    const factor = 1 / (1 - Math.pow(p, -n));
    cumulativeProduct *= factor;

    // "Program length" to describe this prime's contribution
    // Need to encode: which prime (log2(p) bits) + the exponent n (log2(n) bits)
    const primeBits = Math.log2(p) + Math.log2(n);
    totalProgramBits += primeBits;

    // How many correct digits does this partial product give?
    const error = Math.abs(cumulativeProduct - ZETA_EXACT[n]) / ZETA_EXACT[n];
    const correctDigits = error > 0 ? -Math.log10(error) : 16;

    primePrograms.push({
      prime: p,
      factor,
      cumulativeProduct,
      primeBits,
      totalBitsSoFar: totalProgramBits,
      correctDigits,
      bitsPerDigit: totalProgramBits / Math.max(correctDigits, 0.1),
    });
  }

  const finalDigits = primePrograms[primePrograms.length - 1].correctDigits;
  const compressionRatio = totalProgramBits / (finalDigits * Math.log2(10));

  // Chaitin's bound: for a random real, K(x|_N) ≥ N - O(1)
  // For a computable irrational, K(x|_N) can be << N (the program is finite)
  // For ζ(n), the "program" is the Euler product (infinite but structured)
  const chaitinBound = finalDigits * Math.log2(10); // bits needed for random

  return {
    primePrograms,
    totalProgramBits,
    digitsComputed: finalDigits,
    compressionRatio,
    chaitinBound,
    interpretation: compressionRatio < 1
      ? `The Euler product with ${maxPrimes} primes is an efficient "program" for ζ(${n}): ` +
        `${totalProgramBits.toFixed(0)} bits encode ${finalDigits.toFixed(1)} digits ` +
        `(ratio ${compressionRatio.toFixed(2)}). But the program is infinite — ` +
        `requiring ALL primes means the Kolmogorov complexity of ζ(${n}) is infinite, ` +
        `which is consistent with irrationality (and even transcendence).`
      : `The Euler product is NOT efficiently compressing ζ(${n}). ` +
        `This may indicate numerical precision limits rather than a mathematical property.`,
  };
}

/**
 * Algorithmic randomness test: compare the statistical properties of ζ(n) digits
 * to those of Chaitin's Ω. Both should appear "random" if they're algorithmically random.
 *
 * Tests: digit frequency, serial correlation, runs test, spectral test
 *
 * @param {number} n - Odd integer
 * @param {number} bits - Number of binary digits
 * @returns {{ digitBalance, serialCorrelation, runsTestZ, spectralPeaks,
 *            randomnessScore, comparedToOmega }}
 */
export function algorithmicRandomnessTest(n, bits = 200) {
  const value = oddZetaValue(n, 100).value;
  // Cap at float64 mantissa precision to avoid analyzing rounding noise
  const effectiveBits = Math.min(bits, 52);
  let frac = value - Math.floor(value);
  const digits = [];
  for (let i = 0; i < effectiveBits; i++) {
    frac *= 2;
    digits.push(Math.floor(frac));
    frac -= Math.floor(frac);
  }

  // 1. Digit balance (should be ~50% ones for random)
  const ones = digits.filter(d => d === 1).length;
  const digitBalance = ones / effectiveBits;

  // 2. Serial correlation (lag-1 autocorrelation)
  let sumProd = 0, sumSq = 0;
  const mean = digitBalance;
  for (let i = 0; i < effectiveBits - 1; i++) {
    sumProd += (digits[i] - mean) * (digits[i + 1] - mean);
    sumSq += (digits[i] - mean) ** 2;
  }
  const serialCorrelation = sumSq > 0 ? sumProd / sumSq : 0;

  // 3. Runs test (count runs of consecutive same digits)
  let runs = 1;
  for (let i = 1; i < effectiveBits; i++) {
    if (digits[i] !== digits[i - 1]) runs++;
  }
  const expectedRuns = 1 + 2 * ones * (effectiveBits - ones) / effectiveBits;
  const varianceRuns = (expectedRuns - 1) * (expectedRuns - 2) / (effectiveBits - 1);
  const runsTestZ = varianceRuns > 0 ? (runs - expectedRuns) / Math.sqrt(varianceRuns) : 0;

  // 4. Simple spectral test (DFT magnitude peaks)
  const spectralPeaks = [];
  for (let k = 1; k <= Math.min(20, effectiveBits / 4); k++) {
    let re = 0, im = 0;
    for (let j = 0; j < effectiveBits; j++) {
      const angle = 2 * Math.PI * k * j / effectiveBits;
      re += (digits[j] - 0.5) * Math.cos(angle);
      im += (digits[j] - 0.5) * Math.sin(angle);
    }
    const magnitude = Math.sqrt(re * re + im * im) / Math.sqrt(effectiveBits);
    spectralPeaks.push({ frequency: k, magnitude });
  }
  const maxSpectral = Math.max(...spectralPeaks.map(s => s.magnitude));

  // Overall randomness score (0-10, 10 = perfectly random-looking)
  const balanceScore = 10 * (1 - 2 * Math.abs(digitBalance - 0.5));
  const correlationScore = 10 * (1 - Math.min(Math.abs(serialCorrelation) * 5, 1));
  const runsScore = 10 * (1 - Math.min(Math.abs(runsTestZ) / 3, 1));
  const spectralScore = 10 * (1 - Math.min(maxSpectral * 2, 1));
  const randomnessScore = (balanceScore + correlationScore + runsScore + spectralScore) / 4;

  return {
    n,
    bits: effectiveBits,
    effectiveBits,
    digitBalance,
    serialCorrelation,
    runsTestZ,
    spectralPeaks,
    maxSpectralPeak: maxSpectral,
    randomnessScore,
    comparedToOmega: `Chaitin's Ω achieves randomness score 10/10 by definition (algorithmically random). ` +
      `ζ(${n}) scores ${randomnessScore.toFixed(1)}/10 — ` +
      (randomnessScore > 7 ? 'consistent with algorithmic randomness and irrationality' :
       randomnessScore > 4 ? 'moderate randomness, possibly limited by floating-point precision' :
       'low randomness score — may indicate periodicity or precision artifacts'),
    precisionNote: effectiveBits < bits
      ? `Capped from ${bits} to ${effectiveBits} bits (float64 mantissa limit)`
      : null,
  };
}

/**
 * Information-theoretic proof strategy for ζ(n) irrationality.
 *
 * The key idea (following Chaitin's methodology):
 * 1. The first N digits of ζ(n) require ALL primes ≤ exp(N^{1/n}) to compute
 * 2. Therefore K(ζ(n)|_N) ≥ π(exp(N^{1/n})) ≈ exp(N^{1/n}) / N^{1/n}
 * 3. For n = 3: K(ζ(3)|_N) ≥ exp(N^{1/3}) / N^{1/3} which grows faster than O(log N)
 * 4. If ζ(3) were rational, K(ζ(3)|_N) = O(log N)
 * 5. Contradiction → ζ(3) is irrational
 *
 * GAP: Step 1 is the hard part — proving that removing any prime changes the N-th digit.
 *
 * @param {number} n - Odd integer
 * @param {number} maxN - Maximum number of digits to analyze
 * @returns {{ steps, complexityGrowth, rationalBound, gapAnalysis, verdict }}
 */
export function chaitinProofStrategy(n, maxN = 100) {
  const steps = [];
  const complexityGrowth = [];

  for (let N = 5; N <= maxN; N += 5) {
    // How many primes needed for N digits of ζ(n)?
    // Each prime p contributes ~p^{-n} to the product, so for N decimal digits
    // we need primes up to ~10^{N/n} (rough estimate)
    const primeBound = Math.pow(10, N / n);
    const numPrimesNeeded = primeBound / Math.log(Math.max(primeBound, 2)); // prime counting function approx

    // Kolmogorov complexity of the "program" = encoding all needed primes
    const programBits = numPrimesNeeded * Math.log2(Math.max(primeBound, 2));

    // Rational bound: if ζ(n) = a/b, K ≤ log2(a) + log2(b) + O(1) = O(log N)
    const rationalBound = 2 * Math.log2(Math.max(N, 2)) + 10; // generous constant

    complexityGrowth.push({
      N,
      primeBound: Math.round(primeBound),
      numPrimesNeeded: Math.round(numPrimesNeeded),
      kolmogorovLower: programBits,
      rationalUpper: rationalBound,
      exceeds: programBits > rationalBound,
    });
  }

  const gapPoint = complexityGrowth.find(c => c.exceeds);

  return {
    n,
    steps: [
      {
        step: 1,
        claim: `Computing N digits of ζ(${n}) requires all primes ≤ 10^{N/${n}}`,
        status: 'unproven',
        detail: 'This is the hardest step. The Euler product converges, so each prime contributes less, but removing ANY prime changes the value. The question is whether it changes the N-th digit.',
      },
      {
        step: 2,
        claim: `K(ζ(${n})|_N) ≥ π(10^{N/${n}}) ≈ 10^{N/${n}} / (N/${n})`,
        status: 'conditional',
        detail: 'Follows from Step 1 + the incompressibility of prime encodings.',
      },
      {
        step: 3,
        claim: `This growth is faster than O(log N), the bound for rational numbers`,
        status: 'proven',
        detail: 'Any exponential growth exceeds logarithmic growth. This is elementary.',
      },
      {
        step: 4,
        claim: `Contradiction → ζ(${n}) is irrational`,
        status: 'conditional',
        detail: 'Follows from Steps 1-3 by Chaitin\'s characterization of rational numbers.',
      },
    ],
    complexityGrowth,
    rationalBound: 'O(log N)',
    gapAnalysis: gapPoint
      ? `The Kolmogorov complexity exceeds the rational bound at N = ${gapPoint.N} digits.`
      : 'Complexity growth not yet exceeding rational bound in tested range.',
    verdict: `The Chaitin approach provides a conceptual framework: ζ(${n}) is irrational because ` +
      `its digits require an infinite "program" (all primes). The critical gap is proving that ` +
      `each prime is individually necessary for computing specific digits — this is the ` +
      `information-theoretic analog of Apéry's algebraic independence argument.`,
  };
}
