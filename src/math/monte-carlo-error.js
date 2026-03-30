/**
 * Monte Carlo Error Estimation for Non-Rigorous Computations
 *
 * imp-092: Perturb inputs by machine epsilon, run multiple trials,
 * measure output variance. Flag fragile computations for interval
 * arithmetic upgrade.
 *
 * For each key computation:
 *   1. Run the computation with exact inputs → baseline value
 *   2. Run N trials with inputs perturbed by ±ε·|input|·randn()
 *   3. Compute mean, std, coefficient of variation (CV = std/|mean|)
 *   4. If CV > threshold → flag as fragile
 */

import { cMul, cDiv, cSub, cAdd, cAbs, ZETA_ZEROS } from './zeta.js';
import { getPrimes } from './primes.js';

const EPS = 2.220446049250313e-16; // IEEE 754 double precision epsilon

/**
 * Box-Muller transform for standard normal random numbers.
 */
function randn() {
  let u, v, s;
  do {
    u = 2 * Math.random() - 1;
    v = 2 * Math.random() - 1;
    s = u * u + v * v;
  } while (s >= 1 || s === 0);
  return u * Math.sqrt(-2 * Math.log(s) / s);
}

/**
 * Perturb a real value by relative machine epsilon.
 * x → x · (1 + scale·ε·randn())
 */
function perturbReal(x, scale = 1) {
  return x * (1 + scale * EPS * randn());
}

/**
 * Perturb a complex value [re, im].
 */
function perturbComplex(z, scale = 1) {
  return [perturbReal(z[0], scale), perturbReal(z[1], scale)];
}

/**
 * Compute mean and standard deviation of an array.
 */
function stats(values) {
  const n = values.length;
  if (n === 0) return { mean: 0, std: 0, cv: 0 };
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((s, x) => s + (x - mean) ** 2, 0) / Math.max(n - 1, 1);
  const std = Math.sqrt(variance);
  const cv = Math.abs(mean) > 1e-30 ? std / Math.abs(mean) : (std > 0 ? Infinity : 0);
  return { mean, std, cv };
}

// ── Computation wrappers with perturbation ──────────────────────────────────

/**
 * Li coefficient λ_n from perturbed zeros.
 */
function liCoefficientPerturbed(n, zeros, scale) {
  let sum = 0;
  for (const gamma of zeros) {
    const g = perturbReal(gamma, scale);
    const rho = [0.5, g];
    const oneMinusInvRho = cSub([1, 0], cDiv([1, 0], rho));
    let power = [1, 0];
    for (let k = 0; k < n; k++) power = cMul(power, oneMinusInvRho);
    const contrib = cSub([1, 0], power);
    sum += contrib[0]; // Real part
  }
  return sum;
}

/**
 * Euler product unitarity deficit with perturbed primes.
 */
function unitarityDeficitPerturbed(sigma, t, numPrimes, scale) {
  const primes = getPrimes(numPrimes);
  let product = [1, 0];

  for (const p of primes) {
    const pp = perturbReal(p, scale);
    const logP = Math.log(pp);
    const pSig = Math.pow(pp, -sigma);
    const phase = -t * logP;
    const pms = [pSig * Math.cos(phase), pSig * Math.sin(phase)];
    const denom = cSub([1, 0], pms);
    if (cAbs(denom) < 1e-20) continue;
    product = cMul(product, cDiv([1, 0], denom));
  }

  const magPlus = cAbs(product);

  // Compute conjugate
  let productBar = [1, 0];
  for (const p of primes) {
    const pp = perturbReal(p, scale);
    const logP = Math.log(pp);
    const pSig = Math.pow(pp, -sigma);
    const phase = t * logP;
    const pms = [pSig * Math.cos(phase), pSig * Math.sin(phase)];
    const denom = cSub([1, 0], pms);
    if (cAbs(denom) < 1e-20) continue;
    productBar = cMul(productBar, cDiv([1, 0], denom));
  }

  const magMinus = cAbs(productBar);
  return magMinus > 1e-30 ? Math.abs(magPlus / magMinus - 1) : NaN;
}

/**
 * Hamiltonian energy H(σ,t) = Σ_p log(p)/(p^σ-1)² · (1 + 2p^σ cos(t·logp))
 */
function hamiltonianPerturbed(sigma, t, numPrimes, scale) {
  const primes = getPrimes(numPrimes);
  let H = 0;
  for (const p of primes) {
    const pp = perturbReal(p, scale);
    const logP = Math.log(pp);
    const pSig = Math.pow(pp, sigma);
    const denom = (pSig - 1) * (pSig - 1);
    if (denom < 1e-30) continue;
    H += logP / denom * (1 + 2 * pSig * Math.cos(t * logP));
  }
  return H;
}

/**
 * Mertens product Π(1-1/p) with perturbation.
 */
function mertensProductPerturbed(numPrimes, scale) {
  const primes = getPrimes(numPrimes);
  let product = 1;
  for (const p of primes) {
    const pp = perturbReal(p, scale);
    product *= (1 - 1 / pp);
  }
  return product;
}

/**
 * S-matrix determinant (should be 1 by SL(2,R)).
 */
function cascadeDetPerturbed(omega, numPrimes, scale) {
  const primes = getPrimes(numPrimes);
  let S = [[1, 0], [0, 1]];

  for (const p of primes) {
    const pp = perturbReal(p, scale);
    const logP = Math.log(pp);
    const arg = perturbReal(omega, scale) * logP;
    const c = Math.cos(arg), s = Math.sin(arg);
    const Zp = 1 / logP;
    const T = [[c, Zp * s], [-s / Zp, c]];
    S = [
      [S[0][0] * T[0][0] + S[0][1] * T[1][0], S[0][0] * T[0][1] + S[0][1] * T[1][1]],
      [S[1][0] * T[0][0] + S[1][1] * T[1][0], S[1][0] * T[0][1] + S[1][1] * T[1][1]],
    ];
  }
  return S[0][0] * S[1][1] - S[0][1] * S[1][0];
}

// ── Main test ────────────────────────────────────────────────────────────────

/**
 * Run Monte Carlo error estimation on all key computations.
 */
export function monteCarloErrorTest(numTrials = 100) {
  const perturbScale = 1e6; // amplify to 10^6 × ε ≈ 2×10^{-10} relative perturbation
  const fragileThreshold = 0.01; // CV > 1% → fragile

  const zeros = ZETA_ZEROS.slice(0, 50);
  const computations = [];

  // 1. Li coefficients λ_1 through λ_5
  for (const n of [1, 2, 3, 5, 10]) {
    const baseline = liCoefficientPerturbed(n, zeros, 0);
    const trials = [];
    for (let i = 0; i < numTrials; i++) {
      trials.push(liCoefficientPerturbed(n, zeros, perturbScale));
    }
    const s = stats(trials);
    computations.push({
      name: `Li coefficient λ_${n}`,
      baseline: +baseline.toFixed(8),
      mean: +s.mean.toFixed(8),
      std: +s.std.toExponential(3),
      cv: +s.cv.toExponential(3),
      fragile: s.cv > fragileThreshold,
      category: 'proof',
    });
  }

  // 2. Unitarity deficit at σ=½ for various t
  for (const t of [14.13, 21.02, 30]) {
    const baseline = unitarityDeficitPerturbed(0.5, t, 50, 0);
    const trials = [];
    for (let i = 0; i < numTrials; i++) {
      trials.push(unitarityDeficitPerturbed(0.5, t, 50, perturbScale));
    }
    const s = stats(trials.filter(v => !isNaN(v)));
    computations.push({
      name: `Unitarity deficit δ(t=${t})`,
      baseline: +baseline.toExponential(4),
      mean: +s.mean.toExponential(4),
      std: +s.std.toExponential(3),
      cv: +s.cv.toExponential(3),
      fragile: s.cv > fragileThreshold,
      category: 'proof',
    });
  }

  // 3. Hamiltonian energy at σ=½ (should be minimum)
  for (const t of [14.13, 25]) {
    const baseline = hamiltonianPerturbed(0.5, t, 20, 0);
    const trials = [];
    for (let i = 0; i < numTrials; i++) {
      trials.push(hamiltonianPerturbed(0.5, t, 20, perturbScale));
    }
    const s = stats(trials);
    computations.push({
      name: `Hamiltonian H(½,${t})`,
      baseline: +baseline.toFixed(6),
      mean: +s.mean.toFixed(6),
      std: +s.std.toExponential(3),
      cv: +s.cv.toExponential(3),
      fragile: s.cv > fragileThreshold,
      category: 'proof',
    });
  }

  // 4. Mertens product
  for (const np of [20, 50, 100]) {
    const baseline = mertensProductPerturbed(np, 0);
    const trials = [];
    for (let i = 0; i < numTrials; i++) {
      trials.push(mertensProductPerturbed(np, perturbScale));
    }
    const s = stats(trials);
    computations.push({
      name: `Mertens product (${np} primes)`,
      baseline: +baseline.toExponential(8),
      mean: +s.mean.toExponential(8),
      std: +s.std.toExponential(3),
      cv: +s.cv.toExponential(3),
      fragile: s.cv > fragileThreshold,
      category: 'verification',
    });
  }

  // 5. Cascade determinant (should be exactly 1)
  for (const np of [10, 50, 100]) {
    const baseline = cascadeDetPerturbed(1.0, np, 0);
    const trials = [];
    for (let i = 0; i < numTrials; i++) {
      trials.push(cascadeDetPerturbed(1.0, np, perturbScale));
    }
    const s = stats(trials);
    computations.push({
      name: `Cascade det(S_${np})`,
      baseline: +baseline.toFixed(10),
      mean: +s.mean.toFixed(10),
      std: +s.std.toExponential(3),
      cv: +s.cv.toExponential(3),
      fragile: s.cv > fragileThreshold,
      category: 'algebraic',
    });
  }

  // 6. Hamiltonian convexity (d²H/dσ² > 0 at σ=½)
  {
    const h = 0.001;
    const t = 14.13;
    const np = 20;
    const baseline = (hamiltonianPerturbed(0.5 + h, t, np, 0) - 2 * hamiltonianPerturbed(0.5, t, np, 0) + hamiltonianPerturbed(0.5 - h, t, np, 0)) / (h * h);
    const trials = [];
    for (let i = 0; i < numTrials; i++) {
      const sc = perturbScale;
      trials.push(
        (hamiltonianPerturbed(0.5 + h, t, np, sc) - 2 * hamiltonianPerturbed(0.5, t, np, sc) + hamiltonianPerturbed(0.5 - h, t, np, sc)) / (h * h)
      );
    }
    const s = stats(trials);
    computations.push({
      name: `Hamiltonian convexity d²H/dσ²`,
      baseline: +baseline.toFixed(4),
      mean: +s.mean.toFixed(4),
      std: +s.std.toExponential(3),
      cv: +s.cv.toExponential(3),
      fragile: s.cv > fragileThreshold,
      category: 'proof',
    });
  }

  // Summary
  const fragileCount = computations.filter(c => c.fragile).length;
  const robustCount = computations.filter(c => !c.fragile).length;
  const fragileList = computations.filter(c => c.fragile).map(c => c.name);

  // Group by category
  const byCategory = {};
  for (const c of computations) {
    if (!byCategory[c.category]) byCategory[c.category] = { total: 0, fragile: 0 };
    byCategory[c.category].total++;
    if (c.fragile) byCategory[c.category].fragile++;
  }

  return {
    numTrials,
    perturbScale: `${perturbScale}× machine epsilon (relative perturbation ~${(perturbScale * EPS).toExponential(2)})`,
    fragileThreshold: `CV > ${fragileThreshold * 100}%`,
    computations,
    summary: {
      total: computations.length,
      robust: robustCount,
      fragile: fragileCount,
      fragileList,
      byCategory,
    },
    proofChain: [
      { step: 1, claim: `${computations.length} key computations tested with ${numTrials} MC trials each`, status: 'done' },
      { step: 2, claim: `Perturbation scale: ${perturbScale}× ε ≈ ${(perturbScale * EPS).toExponential(1)}`, status: 'set' },
      { step: 3, claim: `${robustCount} computations robust (CV < ${fragileThreshold * 100}%)`, status: robustCount > 0 ? 'verified' : 'none' },
      { step: 4, claim: `${fragileCount} computations fragile`, status: fragileCount === 0 ? 'none found' : 'flagged' },
      { step: 5, claim: 'Fragile computations flagged for interval arithmetic upgrade', status: fragileCount > 0 ? 'actionable' : 'not needed' },
    ],
    verdict:
      `Monte Carlo error estimation (${numTrials} trials, perturbation ${(perturbScale * EPS).toExponential(1)}): ` +
      `${robustCount}/${computations.length} computations are ROBUST (CV < ${fragileThreshold * 100}%). ` +
      (fragileCount > 0
        ? `${fragileCount} FRAGILE: ${fragileList.join('; ')}. ` +
          `These should be upgraded to interval arithmetic for rigorous claims.`
        : `ALL computations are numerically stable at this perturbation level. ` +
          `Floating-point results are reliable to the tested precision.`),
  };
}
