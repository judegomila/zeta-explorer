/**
 * Twin Ladder Thermodynamic Framework
 *
 * Prime-power ladders weighted by temperature β and pressure P,
 * with freezing, ground-state collapse, and computable slack index.
 *
 * Each prime p generates a "ladder" of rungs m = 0, 1, 2, ...
 * with amplitude p^{-m/2} and phase m·T·log(p).
 * Thermodynamic weights exp(-β·m·log(p) - P·ψ(m·log(p))) deform
 * the ladder, suppressing higher rungs as β or P increase.
 */

import { getPrimes } from './primes.js';
import { cAdd, cAbs } from './zeta.js';

/**
 * Basic ladder rungs for prime p.
 * Each rung m has amplitude p^{-m/2} and phase m·T·log(p).
 * Returns complex phasor (re, im) for each rung.
 */
export function ladderRungs(p, M, T) {
  const logP = Math.log(p);
  const rungs = [];
  for (let m = 0; m <= M; m++) {
    const amp = Math.pow(p, -m / 2);
    const phase = m * T * logP;
    rungs.push({
      m,
      amp,
      phase,
      re: amp * Math.cos(phase),
      im: amp * Math.sin(phase),
    });
  }
  return rungs;
}

/**
 * Thermodynamic weight for rung m of prime p.
 * w(p, m, β, P) = exp(-β·m·log(p) - P·ψ(m·log(p)))
 * where ψ(x) = x² is the simplest convex penalty.
 */
export function thermodynamicWeight(p, m, beta, P) {
  const x = m * Math.log(p);
  return Math.exp(-beta * x - P * x * x);
}

/**
 * Weighted ladder rungs: basic rungs scaled by thermodynamic weights.
 */
export function weightedLadderRungs(p, M, T, beta, P) {
  const logP = Math.log(p);
  const rungs = [];
  for (let m = 0; m <= M; m++) {
    const amp = Math.pow(p, -m / 2);
    const phase = m * T * logP;
    const w = thermodynamicWeight(p, m, beta, P);
    const wAmp = amp * w;
    rungs.push({
      m,
      amp,
      weight: w,
      weightedAmp: wAmp,
      phase,
      re: wAmp * Math.cos(phase),
      im: wAmp * Math.sin(phase),
    });
  }
  return rungs;
}

/**
 * Deformed twin-ladder sum Z_TL(½+iT; β, P).
 * Sums weighted ladder contributions across all given primes.
 */
export function deformedZTL(T, beta, P, primes, M) {
  let sum = [0, 0];
  for (const p of primes) {
    const rungs = weightedLadderRungs(p, M, T, beta, P);
    let ladderSum = [0, 0];
    for (const r of rungs) {
      ladderSum = cAdd(ladderSum, [r.re, r.im]);
    }
    sum = cAdd(sum, ladderSum);
  }
  return { re: sum[0], im: sum[1], abs: cAbs(sum) };
}

/**
 * Scan |Z_TL(½+iT; β, P)| along T in tRange.
 */
export function deformedZScan(tRange, beta, P, primes, M, steps = 200) {
  const [tMin, tMax] = tRange;
  const dt = (tMax - tMin) / steps;
  const results = [];
  for (let i = 0; i <= steps; i++) {
    const t = tMin + i * dt;
    const z = deformedZTL(t, beta, P, primes, M);
    results.push({ t, re: z.re, im: z.im, abs: z.abs });
  }
  return results;
}

/**
 * Gaussian proxy for frozen ladder: Φ_fr(u) = exp(-α·u²)·Σ c_{2k}·u^{2k}
 * Default coefficients approximate the leading terms.
 */
export function gaussianProxy(u, alpha, coeffs) {
  if (!coeffs) coeffs = [1, -0.1, 0.005]; // c_0, c_2, c_4
  const gaussian = Math.exp(-alpha * u * u);
  let poly = 0;
  for (let k = 0; k < coeffs.length; k++) {
    poly += coeffs[k] * Math.pow(u, 2 * k);
  }
  return gaussian * poly;
}

/**
 * Compare exact ladder sum vs Gaussian proxy for freezing analysis.
 */
export function frozenLadderComparison(p, M, T, alpha, coeffs) {
  const logP = Math.log(p);
  const rungs = ladderRungs(p, M, T);

  // Exact: sum of rung amplitudes (real parts along critical line)
  let exactRe = 0, exactIm = 0;
  for (const r of rungs) {
    exactRe += r.re;
    exactIm += r.im;
  }
  const exactAbs = Math.sqrt(exactRe * exactRe + exactIm * exactIm);

  // Proxy: evaluate Gaussian proxy at u = T·log(p)
  const u = T * logP;
  const proxyVal = gaussianProxy(u, alpha, coeffs);

  return {
    exact: { re: exactRe, im: exactIm, abs: exactAbs },
    proxy: proxyVal,
    error: Math.abs(exactAbs - Math.abs(proxyVal)),
  };
}

/**
 * Slack index: Π_slack = (α - t - ε)·U²
 * Measures how much room remains before the Gaussian proxy fails.
 */
export function slackIndex(alpha, t, epsilon, U) {
  return (alpha - t - epsilon) * U * U;
}

/**
 * Collapse animation data: as β→∞, higher rungs vanish.
 * Returns array of snapshots showing rung weights at each β step.
 */
export function collapseAnimation(p, M, T, betaSteps) {
  if (!betaSteps) betaSteps = [0, 0.5, 1, 2, 3, 5, 8, 12, 20, 50];
  const logP = Math.log(p);
  return betaSteps.map(beta => {
    const rungs = [];
    for (let m = 0; m <= M; m++) {
      const amp = Math.pow(p, -m / 2);
      const w = Math.exp(-beta * m * logP);
      rungs.push({
        m,
        amp,
        weight: w,
        weightedAmp: amp * w,
        phase: m * T * logP,
      });
    }
    return { beta, rungs };
  });
}

/**
 * Phase diagram: 2D grid of |Z_TL| for heatmap rendering.
 * betaRange and PRange are [min, max] arrays.
 */
export function phaseDiagram(betaRange, PRange, primes, M, tSample, resolution = 40) {
  const [bMin, bMax] = betaRange;
  const [pMin, pMax] = PRange;
  const db = (bMax - bMin) / resolution;
  const dp = (pMax - pMin) / resolution;
  const grid = [];
  let maxVal = 0;

  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      const beta = bMin + i * db;
      const P = pMin + j * dp;
      const z = deformedZTL(tSample, beta, P, primes, M);
      if (z.abs > maxVal) maxVal = z.abs;
      grid.push({ beta, P, abs: z.abs, re: z.re, im: z.im });
    }
  }

  return { grid, resolution, betaRange, PRange, maxVal };
}
