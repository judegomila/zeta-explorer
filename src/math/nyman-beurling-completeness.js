/**
 * imp-078: Numerical verification of the Nyman-Beurling completeness criterion.
 *
 * Nyman-Beurling theorem:
 *   RH is true if and only if the span of { rho_alpha : 0 < alpha < 1 }
 *   is dense in L^2(0,1), where
 *     rho_alpha(x) = frac(alpha/x) - alpha * frac(1/x)
 *   and frac(y) = y - floor(y) denotes the fractional part.
 *
 * We numerically verify density by computing the L^2 distance from the
 * characteristic function chi_{(0,1)} (identically 1) to the span of N
 * Nyman functions, for increasing N. If the distance decreases toward 0
 * with a power-law decay, that constitutes numerical evidence for RH.
 */

import { getPrimes } from './primes.js';

// ── Fractional part ────────────────────────────────────────────────

/**
 * Fractional part: frac(y) = y - floor(y).
 */
function frac(y) {
  return y - Math.floor(y);
}

// ── Nyman function ─────────────────────────────────────────────────

/**
 * Evaluate the Nyman function rho_alpha(x) = frac(alpha/x) - alpha * frac(1/x).
 *
 * @param {number} alpha - parameter in (0,1)
 * @param {number} x     - evaluation point in (0,1]
 * @returns {number}
 */
function rhoAlpha(alpha, x) {
  return frac(alpha / x) - alpha * frac(1 / x);
}

// ── Simpson's rule inner product on (0,1] ──────────────────────────

/**
 * Compute the L^2(0,1) inner product <f, g> via composite Simpson's rule.
 * Both f and g are arrays of values on a uniform grid (0, dx, 2dx, ..., 1].
 *
 * @param {Float64Array} f - function values on grid
 * @param {Float64Array} g - function values on grid
 * @param {number} dx      - grid spacing
 * @returns {number}
 */
function innerProduct(f, g, dx) {
  const n = f.length;
  // Ensure even number of sub-intervals for Simpson's rule.
  // If n is even (odd number of points), drop the last point and use
  // trapezoidal rule for the final sub-interval.
  const nSimpson = (n % 2 === 0) ? n - 1 : n;
  let sum = 0;

  // Simpson's rule on the bulk
  if (nSimpson >= 3) {
    sum += f[0] * g[0] + f[nSimpson - 1] * g[nSimpson - 1];
    for (let i = 1; i < nSimpson - 1; i += 2) {
      sum += 4 * f[i] * g[i];
    }
    for (let i = 2; i < nSimpson - 1; i += 2) {
      sum += 2 * f[i] * g[i];
    }
    sum *= dx / 3;
  }

  // If we dropped a point, add trapezoidal rule for the last sub-interval
  if (nSimpson < n) {
    sum += 0.5 * dx * (f[nSimpson - 1] * g[nSimpson - 1] + f[nSimpson] * g[nSimpson]);
  }

  return sum;
}

// ── Gaussian elimination with partial pivoting ─────────────────────

/**
 * Solve the linear system Ax = b in-place via Gaussian elimination
 * with partial pivoting. Returns the solution vector x.
 *
 * @param {number[][]} A - n x n matrix (will be modified)
 * @param {number[]}   b - right-hand side (will be modified)
 * @returns {number[]}  solution vector
 */
function solveLinearSystem(A, b) {
  const n = A.length;

  // Forward elimination with partial pivoting
  for (let col = 0; col < n; col++) {
    // Find pivot
    let maxVal = Math.abs(A[col][col]);
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      const val = Math.abs(A[row][col]);
      if (val > maxVal) {
        maxVal = val;
        maxRow = row;
      }
    }

    // Swap rows
    if (maxRow !== col) {
      [A[col], A[maxRow]] = [A[maxRow], A[col]];
      [b[col], b[maxRow]] = [b[maxRow], b[col]];
    }

    const pivot = A[col][col];
    if (Math.abs(pivot) < 1e-30) continue; // singular or near-singular

    // Eliminate below
    for (let row = col + 1; row < n; row++) {
      const factor = A[row][col] / pivot;
      for (let k = col; k < n; k++) {
        A[row][k] -= factor * A[col][k];
      }
      b[row] -= factor * b[col];
    }
  }

  // Back substitution
  const x = new Array(n).fill(0);
  for (let row = n - 1; row >= 0; row--) {
    let sum = b[row];
    for (let k = row + 1; k < n; k++) {
      sum -= A[row][k] * x[k];
    }
    x[row] = Math.abs(A[row][row]) > 1e-30 ? sum / A[row][row] : 0;
  }

  return x;
}

// ── Alpha distributions ────────────────────────────────────────────

/**
 * Generate N alpha values uniformly spaced in (0,1).
 */
function uniformAlphas(N) {
  const alphas = [];
  for (let i = 1; i <= N; i++) {
    alphas.push(i / (N + 1));
  }
  return alphas;
}

/**
 * Generate N alpha values logarithmically spaced in (0,1).
 * Concentrates points near 0, which is where rho_alpha has richer structure.
 */
function logAlphas(N) {
  const alphas = [];
  for (let i = 1; i <= N; i++) {
    // Map uniform [0,1] -> logarithmic scale biased toward 0
    const t = i / (N + 1);
    alphas.push(Math.pow(t, 2)); // quadratic concentration near 0
  }
  return alphas;
}

/**
 * Generate alpha values as 1/p for the first N primes.
 * This connects to the Euler product and prime distribution.
 */
function primeAlphas(N) {
  const primes = getPrimes(N);
  return primes.slice(0, N).map(p => 1 / p);
}

// ── Core computation: distance from chi to span{rho_alpha_i} ──────

/**
 * Compute the L^2 distance from the constant function 1 (i.e. chi_{(0,1)})
 * to the span of { rho_{alpha_1}, ..., rho_{alpha_N} }.
 *
 * The minimum distance squared is:
 *   d^2 = ||chi||^2 - b^T G^{-1} b = 1 - b^T c
 * where G_{ij} = <rho_{alpha_i}, rho_{alpha_j}>, b_i = <rho_{alpha_i}, chi>,
 * and c = G^{-1} b (solved via Gaussian elimination).
 *
 * @param {number[]} alphas     - the alpha values
 * @param {number}   numPoints  - number of quadrature points (default 1200)
 * @returns {{ distance: number, coefficients: number[] }}
 */
function computeDistance(alphas, numPoints = 1200) {
  const N = alphas.length;
  const dx = 1 / numPoints;

  // Build quadrature grid on (0,1] -- avoid x=0 where rho is singular
  const xPts = new Float64Array(numPoints);
  for (let i = 0; i < numPoints; i++) {
    xPts[i] = (i + 1) * dx;
  }

  // Evaluate each rho_{alpha_i} on the grid
  const rhoVals = [];
  for (let i = 0; i < N; i++) {
    const vals = new Float64Array(numPoints);
    const a = alphas[i];
    for (let k = 0; k < numPoints; k++) {
      vals[k] = rhoAlpha(a, xPts[k]);
    }
    rhoVals.push(vals);
  }

  // chi_{(0,1)} is identically 1 on the grid
  const chi = new Float64Array(numPoints).fill(1);

  // Build Gram matrix G_{ij} = <rho_{alpha_i}, rho_{alpha_j}>
  const G = [];
  for (let i = 0; i < N; i++) {
    G[i] = new Array(N);
    for (let j = 0; j <= i; j++) {
      const val = innerProduct(rhoVals[i], rhoVals[j], dx);
      G[i][j] = val;
      if (j < i) G[j][i] = val; // symmetric
    }
  }

  // Add Tikhonov regularization to the diagonal for stability
  const REG = 1e-12;
  for (let i = 0; i < N; i++) {
    G[i][i] += REG;
  }

  // Build right-hand side b_i = <rho_{alpha_i}, chi>
  const b = new Array(N);
  for (let i = 0; i < N; i++) {
    b[i] = innerProduct(rhoVals[i], chi, dx);
  }

  // Solve G c = b
  // Deep-copy G and b since the solver modifies them in-place
  const Gcopy = G.map(row => [...row]);
  const bcopy = [...b];
  const c = solveLinearSystem(Gcopy, bcopy);

  // Distance^2 = ||chi||^2 - b^T c = 1 - sum(b_i * c_i)
  let bTc = 0;
  for (let i = 0; i < N; i++) {
    bTc += b[i] * c[i];
  }

  // Clamp to avoid tiny negative values from numerical noise
  const dist2 = Math.max(0, 1 - bTc);
  const distance = Math.sqrt(dist2);

  return { distance, coefficients: c };
}

// ── Power-law fit: distance ~ C * N^{-beta} ───────────────────────

/**
 * Fit log(distance) = log(C) - beta * log(N) via least squares.
 * Returns { C, beta }.
 */
function fitPowerLaw(Ns, distances) {
  // Filter out zero or negative distances
  const logN = [];
  const logD = [];
  for (let i = 0; i < Ns.length; i++) {
    if (distances[i] > 1e-15) {
      logN.push(Math.log(Ns[i]));
      logD.push(Math.log(distances[i]));
    }
  }

  if (logN.length < 2) {
    return { C: 0, beta: Infinity }; // distance is effectively zero
  }

  const n = logN.length;
  let sumX = 0, sumY = 0, sumXX = 0, sumXY = 0;
  for (let i = 0; i < n; i++) {
    sumX += logN[i];
    sumY += logD[i];
    sumXX += logN[i] * logN[i];
    sumXY += logN[i] * logD[i];
  }

  const denom = n * sumXX - sumX * sumX;
  if (Math.abs(denom) < 1e-30) {
    return { C: Math.exp(sumY / n), beta: 0 };
  }

  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;

  return { C: Math.exp(intercept), beta: -slope };
}

// ── Main test ──────────────────────────────────────────────────────

/**
 * Nyman-Beurling completeness test.
 *
 * For increasing N, compute the L^2 distance from chi_{(0,1)} to the
 * span of N Nyman functions. If the distance decreases with a positive
 * power-law exponent beta, this is numerical evidence that the span
 * is dense in L^2(0,1), which is equivalent to RH.
 *
 * Tests three alpha distributions: uniform, logarithmic, and 1/p (primes).
 *
 * @returns {object} results including distances, decay rates, and verdict
 */
export function nymanBeurlingTest() {
  const testNs = [5, 10, 20, 50, 100];

  const distributions = [
    { name: 'uniform',     generate: uniformAlphas },
    { name: 'logarithmic', generate: logAlphas },
    { name: 'prime (1/p)', generate: primeAlphas },
  ];

  const results = {};

  for (const dist of distributions) {
    const distances = [];
    const details = [];

    for (const N of testNs) {
      const alphas = dist.generate(N);
      const { distance, coefficients } = computeDistance(alphas);
      distances.push(distance);

      // Compute max |c_i| as a diagnostic for coefficient growth
      const maxCoeff = Math.max(...coefficients.map(Math.abs));

      details.push({
        N,
        distance: +distance.toExponential(6),
        maxCoeff: +maxCoeff.toExponential(4),
      });
    }

    // Check monotonic decrease
    let monotoneDecreasing = true;
    for (let i = 1; i < distances.length; i++) {
      if (distances[i] >= distances[i - 1] * 1.01) { // allow 1% tolerance
        monotoneDecreasing = false;
        break;
      }
    }

    // Fit power-law decay: distance ~ C * N^{-beta}
    const { C, beta } = fitPowerLaw(testNs, distances);

    results[dist.name] = {
      details,
      monotoneDecreasing,
      decayFit: {
        C: +C.toExponential(4),
        beta: +beta.toFixed(4),
        formula: `distance ≈ ${C.toExponential(2)} * N^{-${beta.toFixed(3)}}`,
      },
    };
  }

  // ── Overall verdict ──────────────────────────────────────────────

  const allBetas = distributions.map(d => results[d.name].decayFit.beta);
  const allMonotone = distributions.every(d => results[d.name].monotoneDecreasing);
  const minBeta = Math.min(...allBetas);
  const avgBeta = allBetas.reduce((a, b) => a + b, 0) / allBetas.length;

  let verdict;
  if (minBeta > 0.3 && allMonotone) {
    verdict = `CONSISTENT WITH RH: All three alpha distributions show monotone distance `
      + `decrease with average decay exponent β = ${avgBeta.toFixed(3)} > 0. `
      + `The Nyman functions are becoming dense in L²(0,1) at a power-law rate, `
      + `providing numerical evidence for the Riemann Hypothesis via the `
      + `Nyman-Beurling completeness criterion.`;
  } else if (minBeta > 0) {
    verdict = `WEAKLY CONSISTENT WITH RH: Distance decreases for all distributions `
      + `(min β = ${minBeta.toFixed(3)}), but the decay is slow or non-monotone. `
      + `More terms may be needed for a conclusive test.`;
  } else {
    verdict = `INCONCLUSIVE: At least one distribution shows non-decreasing distance `
      + `(min β = ${minBeta.toFixed(3)}). This does not contradict RH — it may `
      + `indicate insufficient quadrature resolution or poor alpha selection.`;
  }

  return {
    description: 'Nyman-Beurling completeness criterion: RH ⟺ span{ρ_α} dense in L²(0,1)',
    method: 'Compute L² distance from χ_{(0,1)} to span of N Nyman functions ρ_α(x) = {α/x} - α{1/x}',
    testNs,
    results,
    summary: {
      allMonotoneDecreasing: allMonotone,
      decayExponents: Object.fromEntries(
        distributions.map(d => [d.name, results[d.name].decayFit.beta])
      ),
      averageBeta: +avgBeta.toFixed(4),
    },
    verdict,
  };
}
