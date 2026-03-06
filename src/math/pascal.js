/**
 * Pascal's Triangle, Binomial Coefficients, and the Zeta Function
 *
 * Key results implemented:
 *   1. Brothers' e: lim s_{n-1}·s_{n+1}/s_n² = e  (row products)
 *   2. Pi from central binomials: π = lim 4^{2n}/(n·C(2n,n)²)
 *   3. Hasse-Sondow formula: ζ(s) via Pascal-weighted sums
 *   4. Pascal-decorated zeta: row-weighted Dirichlet polynomials
 */

import { cMul, cAdd, cDiv, cAbs, cPow } from './zeta.js';

// ─── Pascal's Triangle Core ──────────────────────────────────────────────────

/** Compute binomial coefficient C(n, k) */
export function binomial(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k > n - k) k = n - k;
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = result * (n - i) / (i + 1);
  }
  return Math.round(result);
}

/** Generate row n of Pascal's triangle */
export function pascalRow(n) {
  const row = new Array(n + 1);
  for (let k = 0; k <= n; k++) row[k] = binomial(n, k);
  return row;
}

/** Generate first numRows rows of Pascal's triangle */
export function pascalTriangle(numRows) {
  const rows = [];
  for (let n = 0; n < numRows; n++) rows.push(pascalRow(n));
  return rows;
}

// ─── Brothers' e from Pascal's Triangle ──────────────────────────────────────

/** Product of all entries in row n: s_n = ∏_{k=0}^{n} C(n,k) */
export function rowProduct(n) {
  let logProd = 0;
  for (let k = 0; k <= n; k++) {
    logProd += Math.log(binomial(n, k));
  }
  return logProd; // return log for numerical stability
}

/**
 * Brothers' convergence to e:
 * s_{n-1}·s_{n+1}/s_n² = (1 + 1/n)^n → e
 * Returns array of { n, ratio, error } for n = 2..maxN
 */
export function brothersEConvergence(maxN = 30) {
  const points = [];
  const E = Math.E;
  for (let n = 2; n <= maxN; n++) {
    const logSm = rowProduct(n - 1);
    const logS = rowProduct(n);
    const logSp = rowProduct(n + 1);
    // log(s_{n-1} * s_{n+1} / s_n^2) = logSm + logSp - 2*logS
    const logRatio = logSm + logSp - 2 * logS;
    const ratio = Math.exp(logRatio);
    points.push({
      n,
      ratio,
      error: Math.abs(ratio - E),
      classic: Math.pow(1 + 1 / n, n), // classical (1+1/n)^n for comparison
    });
  }
  return points;
}

// ─── Pi from Central Binomial Coefficients ───────────────────────────────────

/** Central binomial coefficient C(2n, n) */
export function centralBinomial(n) {
  return binomial(2 * n, n);
}

/**
 * Pi approximation: π = lim 4^{2n} / (n · C(2n,n)²)
 * Returns convergence data
 */
export function piFromPascal(maxN = 40) {
  const points = [];
  for (let n = 1; n <= maxN; n++) {
    const cb = centralBinomial(n);
    // Use logs to avoid overflow: log(4^{2n}) = 2n·log(4)
    const logNum = 2 * n * Math.log(4);
    const logDenom = Math.log(n) + 2 * Math.log(cb);
    const approx = Math.exp(logNum - logDenom);
    points.push({
      n,
      centralBinom: cb,
      piApprox: approx,
      error: Math.abs(approx - Math.PI),
    });
  }
  return points;
}

/**
 * Pi via arcsin series: π/2 = arcsin(1) = Σ C(2n,n)/(4^n·(2n+1))
 * Partial sums of 2·arcsin(1) converge to π
 */
export function piArcsinSeries(maxTerms = 30) {
  const points = [];
  let sum = 0;
  for (let n = 0; n < maxTerms; n++) {
    const cb = centralBinomial(n);
    // term = C(2n,n) / (4^n · (2n+1))
    const logTerm = Math.log(cb) - n * Math.log(4) - Math.log(2 * n + 1);
    sum += Math.exp(logTerm);
    // sum approximates π/2
    points.push({
      n,
      partialSum: sum,
      piApprox: 2 * sum,
      error: Math.abs(2 * sum - Math.PI),
    });
  }
  return points;
}

// ─── Hasse-Sondow Formula: ζ(s) via Pascal's Triangle ───────────────────────

/**
 * Inner sum of Hasse formula: Σ_{k=0}^{n} (-1)^k C(n,k) (k+1)^{-s}
 * This is the n-th forward difference of f(k) = (k+1)^{-s}
 * weighted by row n of Pascal's triangle
 */
export function hasseInnerSum(n, s) {
  let re = 0, im = 0;
  for (let k = 0; k <= n; k++) {
    const sign = (k % 2 === 0) ? 1 : -1;
    const coeff = sign * binomial(n, k);
    // (k+1)^{-s} where s = [sigma, t]
    const base = k + 1;
    const logBase = Math.log(base);
    const mag = Math.pow(base, -s[0]); // base^{-sigma}
    const phase = -s[1] * logBase;      // -t·log(base)
    re += coeff * mag * Math.cos(phase);
    im += coeff * mag * Math.sin(phase);
  }
  return [re, im];
}

/**
 * Hasse-Sondow formula for ζ(s):
 * ζ(s) = 1/(1-2^{1-s}) · Σ_{n=0}^{N} (1/2^{n+1}) · Σ_{k=0}^{n} (-1)^k C(n,k)(k+1)^{-s}
 *
 * Returns { value: [re,im], partialSums: [...] } with convergence data
 */
export function hasseZeta(s, maxTerms = 40) {
  // Prefactor: 1/(1-2^{1-s})
  const s1 = [1 - s[0], -s[1]];
  const pow2 = cPow([2, 0], s1); // 2^{1-s}
  const denom = [1 - pow2[0], -pow2[1]]; // 1 - 2^{1-s}
  const prefactor = cDiv([1, 0], denom);

  let sumRe = 0, sumIm = 0;
  const partialSums = [];

  for (let n = 0; n <= maxTerms; n++) {
    const inner = hasseInnerSum(n, s);
    const weight = Math.pow(0.5, n + 1); // 1/2^{n+1}
    sumRe += weight * inner[0];
    sumIm += weight * inner[1];

    // ζ(s) = prefactor * sum
    const zetaRe = prefactor[0] * sumRe - prefactor[1] * sumIm;
    const zetaIm = prefactor[0] * sumIm + prefactor[1] * sumRe;

    partialSums.push({
      n,
      innerSum: inner,
      rowContribution: [weight * inner[0], weight * inner[1]],
      zeta: [zetaRe, zetaIm],
      zetaMag: Math.sqrt(zetaRe * zetaRe + zetaIm * zetaIm),
    });
  }

  const value = [
    prefactor[0] * sumRe - prefactor[1] * sumIm,
    prefactor[0] * sumIm + prefactor[1] * sumRe,
  ];

  return { value, partialSums, prefactor };
}

// ─── Pascal-Decorated Zeta Scan ──────────────────────────────────────────────

/**
 * Scan |ζ(σ+it)| computed via Hasse formula across sigma range.
 * Shows how Pascal triangle rows build up the zeta function.
 */
export function pascalZetaScan(t, sigmaRange = [0.05, 2.0], steps = 60, maxTerms = 30) {
  const points = [];
  const ds = (sigmaRange[1] - sigmaRange[0]) / steps;
  for (let i = 0; i <= steps; i++) {
    const sigma = sigmaRange[0] + i * ds;
    const result = hasseZeta([sigma, t], maxTerms);
    points.push({
      sigma,
      zetaMag: cAbs(result.value),
      zetaRe: result.value[0],
      zetaIm: result.value[1],
    });
  }
  return points;
}

/**
 * For a fixed s, show how adding more Pascal triangle rows
 * improves the Hasse approximation of ζ(s).
 * Returns convergence data per row.
 */
export function pascalRowConvergence(s, maxRows = 40) {
  const result = hasseZeta(s, maxRows);
  return result.partialSums.map(ps => ({
    row: ps.n,
    zetaMag: ps.zetaMag,
    zetaRe: ps.zeta[0],
    zetaIm: ps.zeta[1],
    innerMag: cAbs(ps.innerSum),
    contributionMag: cAbs(ps.rowContribution),
  }));
}

/**
 * Row-weighted Dirichlet polynomial: Z_N(s) = Σ_{k=0}^{N} C(N,k)(k+1)^{-s}
 * Shows the "shape" of a single Pascal row's contribution to zeta
 */
export function rowWeightedDirichlet(N, sigmaRange = [0.05, 3.0], t = 0, steps = 60) {
  const points = [];
  const ds = (sigmaRange[1] - sigmaRange[0]) / steps;
  for (let i = 0; i <= steps; i++) {
    const sigma = sigmaRange[0] + i * ds;
    const s = [sigma, t];
    let re = 0, im = 0;
    for (let k = 0; k <= N; k++) {
      const coeff = binomial(N, k);
      const base = k + 1;
      const mag = Math.pow(base, -sigma);
      const phase = -t * Math.log(base);
      re += coeff * mag * Math.cos(phase);
      im += coeff * mag * Math.sin(phase);
    }
    points.push({
      sigma,
      mag: Math.sqrt(re * re + im * im),
      re, im,
      logMag: Math.log10(Math.max(Math.sqrt(re * re + im * im), 1e-10)),
    });
  }
  return { N, points };
}
