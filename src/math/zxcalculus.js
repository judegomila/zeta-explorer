/**
 * ZX-Calculus Module for the ZPO Model
 *
 * Maps the prime oscillator cascade to the ZX-calculus diagrammatic framework:
 *   Z-spider (green) ↔ Euler factor stage (direct ladder)
 *   X-spider (red)   ↔ Dual Euler factor stage (dual ladder)
 *   Hadamard box      ↔ Functional equation bridge χ(s)
 *   Wire              ↔ Signal path / impedance coupling
 *
 * Spider fusion rule  ↔ Euler product partial products
 * Color change rule   ↔ Functional equation s → 1−s
 * Bialgebra rule      ↔ Euler product ↔ Dirichlet series expansion
 * Hopf rule           ↔ Transmission zero (zeta zero)
 *
 * Each spider carries a phase α_p(s) = arg(1/(1 − p^{−s})) from its Euler factor.
 * The Frobenius algebra structure of ZX-calculus matches the impedance algebra
 * of the LC oscillator network.
 */

import { cMul, cAdd, cSub, cAbs, cExp, cLog, cDiv, eulerFactor } from './zeta.js';
import { losslessBridge, oscillatorStage } from './oscillators.js';
import { getPrimes, primeFrequency } from './primes.js';

// ─── Spider Data Structures ──────────────────────────────────────────────────

/**
 * Create a Z-spider (green) representing a direct-ladder Euler factor.
 * Phase α = arg(1/(1 − p^{−s})) ≈ −t·log(p) when p^{−σ} ≪ 1.
 * At σ = 0 the exact phase is t·log(p)/2 − π/2 (not −t·log(p)).
 */
export function createZSpider(prime, s, id) {
  const ef = eulerFactor(prime, s);
  const phase = Math.atan2(ef[1], ef[0]);
  const magnitude = cAbs(ef);
  const omega = primeFrequency(prime);

  return {
    id: id || `z-${prime}`,
    type: 'Z',
    prime,
    phase,
    magnitude,
    frequency: omega,
    eulerFactor: ef,
    inputs: 1,
    outputs: 1,
    color: '#10b981',
  };
}

/**
 * Create an X-spider (red) representing a dual-ladder Euler factor.
 * Uses s → 1−s (functional equation dual).
 */
export function createXSpider(prime, s, id) {
  const sDual = [1 - s[0], -s[1]];
  const ef = eulerFactor(prime, sDual);
  const phase = Math.atan2(ef[1], ef[0]);
  const magnitude = cAbs(ef);

  return {
    id: id || `x-${prime}`,
    type: 'X',
    prime,
    phase,
    magnitude,
    frequency: primeFrequency(prime),
    eulerFactor: ef,
    inputs: 1,
    outputs: 1,
    color: '#ef4444',
  };
}

/**
 * Create a Hadamard box representing the functional equation bridge χ(s).
 */
export function createHadamardBox(s, id) {
  const bridge = losslessBridge(s);
  return {
    id: id || 'H-bridge',
    type: 'H',
    chi: bridge.chi,
    magnitude: bridge.magnitude,
    phase: bridge.phase,
    isUnitary: bridge.isUnitary,
    inputs: 1,
    outputs: 1,
    color: '#f59e0b',
  };
}

// ─── Diagram Construction ────────────────────────────────────────────────────

/**
 * Build the direct ladder as a chain of Z-spiders.
 * Returns { spiders, wires, totalPhase, totalMagnitude, fusedSpider }
 */
export function directLadderDiagram(s, numPrimes = 8) {
  const primes = getPrimes(numPrimes);
  const spiders = primes.map((p, i) => createZSpider(p, s, `z-${i}`));

  // Wires connect sequential spiders
  const wires = [];
  for (let i = 0; i < spiders.length - 1; i++) {
    wires.push({ from: spiders[i].id, to: spiders[i + 1].id });
  }

  // Compute total transfer (product of all Euler factors)
  let totalTransfer = [1, 0];
  let totalPhase = 0;
  for (const sp of spiders) {
    totalTransfer = cMul(totalTransfer, sp.eulerFactor);
    totalPhase += sp.phase;
  }

  // Fused spider: the result of applying spider fusion to entire chain
  const fusedSpider = {
    id: 'z-fused',
    type: 'Z',
    phase: Math.atan2(totalTransfer[1], totalTransfer[0]),
    magnitude: cAbs(totalTransfer),
    eulerFactor: totalTransfer,
    inputs: 1,
    outputs: 1,
    color: '#10b981',
    label: `∏ (fused, ${numPrimes}p)`,
  };

  return { spiders, wires, totalPhase, totalMagnitude: cAbs(totalTransfer), fusedSpider };
}

/**
 * Build the dual ladder as a chain of X-spiders.
 */
export function dualLadderDiagram(s, numPrimes = 8) {
  const primes = getPrimes(numPrimes);
  const spiders = primes.map((p, i) => createXSpider(p, s, `x-${i}`));

  const wires = [];
  for (let i = 0; i < spiders.length - 1; i++) {
    wires.push({ from: spiders[i].id, to: spiders[i + 1].id });
  }

  let totalTransfer = [1, 0];
  for (const sp of spiders) {
    totalTransfer = cMul(totalTransfer, sp.eulerFactor);
  }

  const fusedSpider = {
    id: 'x-fused',
    type: 'X',
    phase: Math.atan2(totalTransfer[1], totalTransfer[0]),
    magnitude: cAbs(totalTransfer),
    eulerFactor: totalTransfer,
    inputs: 1,
    outputs: 1,
    color: '#ef4444',
    label: `∏ (fused, ${numPrimes}p)`,
  };

  return { spiders, wires, totalPhase: fusedSpider.phase, totalMagnitude: fusedSpider.magnitude, fusedSpider };
}

/**
 * Build the full twin-ladder ZX diagram:
 *   Direct (green chain) → Bridge (Hadamard) → Dual (red chain)
 */
export function fullTwinLadderDiagram(s, numPrimes = 8) {
  const direct = directLadderDiagram(s, numPrimes);
  const dual = dualLadderDiagram(s, numPrimes);
  const bridge = createHadamardBox(s);

  // Bridge wire: last direct spider → Hadamard → first dual spider
  const bridgeWires = [
    { from: direct.spiders[direct.spiders.length - 1].id, to: bridge.id },
    { from: bridge.id, to: dual.spiders[0].id },
  ];

  return {
    direct,
    dual,
    bridge,
    bridgeWires,
    allSpiders: [...direct.spiders, bridge, ...dual.spiders],
    allWires: [...direct.wires, ...bridgeWires, ...dual.wires],
  };
}

// ─── Rewrite Rules ───────────────────────────────────────────────────────────

/**
 * Spider Fusion: merge two same-colored adjacent spiders.
 * Phases add, Euler factors multiply.
 * This corresponds to combining Euler factors: H_p · H_q = H_{pq}.
 */
export function spiderFusion(spider1, spider2) {
  if (spider1.type !== spider2.type) return null;
  const merged = cMul(spider1.eulerFactor, spider2.eulerFactor);
  return {
    id: `${spider1.id}+${spider2.id}`,
    type: spider1.type,
    phase: Math.atan2(merged[1], merged[0]),
    magnitude: cAbs(merged),
    eulerFactor: merged,
    inputs: spider1.inputs,
    outputs: spider2.outputs,
    color: spider1.color,
    label: `fused(${spider1.prime || '?'},${spider2.prime || '?'})`,
    fusedFrom: [spider1, spider2],
  };
}

/**
 * Color Change: convert a Z-spider to X-spider (or vice versa)
 * by wrapping in Hadamard boxes. Corresponds to s → 1−s.
 *
 * In the ZPO model: applying the functional equation bridge to
 * a direct-ladder factor yields the dual-ladder factor.
 */
export function colorChange(spider, s) {
  const bridge = losslessBridge(s);
  const newEF = cMul(bridge.chi, spider.eulerFactor);
  const newType = spider.type === 'Z' ? 'X' : 'Z';

  return {
    ...spider,
    id: `${spider.id}-cc`,
    type: newType,
    phase: Math.atan2(newEF[1], newEF[0]),
    magnitude: cAbs(newEF),
    eulerFactor: newEF,
    color: newType === 'Z' ? '#10b981' : '#ef4444',
  };
}

/**
 * Pi-Copy: pull a π-phase through a spider of opposite color, negating its phase.
 * Corresponds to: p^{−s} → p^{−(1−s)} = p^{s−1} (phase negation under duality).
 */
export function piCopy(spider) {
  const negEF = [spider.eulerFactor[0], -spider.eulerFactor[1]];
  return {
    ...spider,
    id: `${spider.id}-pi`,
    phase: -spider.phase,
    eulerFactor: negEF,
  };
}

/**
 * Hopf Rule: at a transmission zero, the diagram decouples.
 * Returns the transmission coefficient (0 at zeta zeros).
 */
export function hopfDecoupling(s, numPrimes = 20) {
  let product = [1, 0];
  const primes = getPrimes(numPrimes);
  for (const p of primes) {
    product = cMul(product, eulerFactor(p, s));
  }
  const transmission = cAbs(product);
  const isZero = transmission < 0.1;

  return {
    transmission,
    isZero,
    decoupled: isZero,
    product,
  };
}

// ─── Analysis Functions ──────────────────────────────────────────────────────

/**
 * Compute the phase accumulation along the spider chain.
 * Shows how individual prime phases combine into the total zeta phase.
 */
export function phaseAccumulation(s, numPrimes = 12) {
  const primes = getPrimes(numPrimes);
  const steps = [];
  let cumPhase = 0;
  let cumTransfer = [1, 0];

  for (const p of primes) {
    const ef = eulerFactor(p, s);
    cumTransfer = cMul(cumTransfer, ef);
    const stepPhase = Math.atan2(ef[1], ef[0]);
    cumPhase += stepPhase;

    steps.push({
      prime: p,
      stepPhase,
      cumulativePhase: cumPhase,
      cumulativeMagnitude: cAbs(cumTransfer),
      normalizedPhase: ((cumPhase % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI),
    });
  }

  return steps;
}

/**
 * Scan across σ to show spider chain symmetry properties.
 * At σ = 0.5, the Z and X chains should be color-symmetric.
 */
export function symmetryScan(t, sigmaRange = [0.1, 0.9], steps = 60, numPrimes = 8) {
  const results = [];
  const ds = (sigmaRange[1] - sigmaRange[0]) / steps;

  for (let i = 0; i <= steps; i++) {
    const sigma = sigmaRange[0] + i * ds;
    const s = [sigma, t];
    const direct = directLadderDiagram(s, numPrimes);
    const dual = dualLadderDiagram(s, numPrimes);
    const bridge = createHadamardBox(s);

    // Symmetry measure: |Z_magnitude - W_magnitude| / max(Z_mag, W_mag)
    const asymmetry = Math.abs(direct.totalMagnitude - dual.totalMagnitude) /
      Math.max(direct.totalMagnitude, dual.totalMagnitude, 0.001);

    // Phase difference between fused spiders
    const phaseDiff = Math.abs(direct.fusedSpider.phase - dual.fusedSpider.phase);

    results.push({
      sigma,
      directMag: direct.totalMagnitude,
      dualMag: dual.totalMagnitude,
      bridgeMag: bridge.magnitude,
      bridgeUnitary: bridge.isUnitary,
      asymmetry,
      phaseDiff,
    });
  }

  return results;
}

/**
 * Demonstrate the bialgebra expansion: product form → sum form.
 * Shows how the Euler product ∏(1−p^{−s})^{−1} expands to Σ n^{−s}.
 *
 * Returns the first N terms of both representations for comparison.
 */
export function bialgebraExpansion(s, numPrimes = 6, maxN = 30) {
  const primes = getPrimes(numPrimes);

  // Product form: multiply Euler factors
  let product = [1, 0];
  const productSteps = [];
  for (const p of primes) {
    const ef = eulerFactor(p, s);
    product = cMul(product, ef);
    productSteps.push({
      prime: p,
      factor: ef,
      cumulative: [...product],
      cumulativeMag: cAbs(product),
    });
  }

  // Sum form: Dirichlet series terms (only using integers with prime factors ≤ max prime)
  const maxPrime = primes[primes.length - 1];
  const sumTerms = [];
  for (let n = 1; n <= maxN; n++) {
    // Check if n is smooth (all prime factors ≤ maxPrime)
    let temp = n;
    let isSmooth = true;
    for (const p of primes) {
      while (temp % p === 0) temp /= p;
    }
    if (temp !== 1) isSmooth = false;

    if (isSmooth) {
      // n^{-s} = exp(-s·log(n))
      const term = cExp(cMul([-s[0], -s[1]], [Math.log(n), 0]));
      sumTerms.push({ n, term, magnitude: cAbs(term) });
    }
  }

  // Partial sum from Dirichlet terms
  let partialSum = [0, 0];
  for (const t of sumTerms) {
    partialSum = cAdd(partialSum, t.term);
  }

  return {
    productResult: product,
    productMag: cAbs(product),
    sumResult: partialSum,
    sumMag: cAbs(partialSum),
    agreement: cAbs(cSub(product, partialSum)),
    productSteps,
    sumTerms,
  };
}

/**
 * Compute transmission through the full twin-ladder at a given s.
 * Checks for transmission zeros (zeta zeros) via the Hopf rule.
 */
export function transmissionAnalysis(t, sigmaRange = [0.4, 0.6], steps = 100, numPrimes = 12) {
  const results = [];
  const ds = (sigmaRange[1] - sigmaRange[0]) / steps;

  for (let i = 0; i <= steps; i++) {
    const sigma = sigmaRange[0] + i * ds;
    const s = [sigma, t];
    const hopf = hopfDecoupling(s, numPrimes);
    const bridge = losslessBridge(s);

    results.push({
      sigma,
      transmission: hopf.transmission,
      isZero: hopf.isZero,
      bridgeMag: bridge.magnitude,
      bridgeUnitary: bridge.isUnitary,
    });
  }

  return results;
}
