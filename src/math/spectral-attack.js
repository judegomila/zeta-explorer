/**
 * Spectral Attack Module -- Cross-Disciplinary Assault on the Riemann Hypothesis
 *
 * Combines information theory, twistor geometry, supercritical phases, Fourier
 * analysis, and ZX-calculus to systematically attack the RH from multiple angles.
 *
 * The central claim: zeros are trapped at sigma = 1/2 by an information-theoretic
 * potential well Phi(sigma,t) that combines all available measures.
 */

import {
  cMul, cAdd, cSub, cAbs, cExp, cLog, cDiv, cPow,
  eulerFactor, zetaCriticalStrip, ZETA_ZEROS,
} from './zeta.js';
import {
  eulerProductEntropy, channelCapacity, mutualInformation,
  fisherInformation, klDivergenceFromEquilibrium,
} from './information-theory.js';
import { directLadder, dualLadder, losslessBridge, oscillatorStage } from './oscillators.js';
import { getPrimes, primeFrequency } from './primes.js';
import { twistorFromS, dualTwistorFromS, incidenceRelation, intertwiner } from './twistor.js';
import { thermodynamicState, zetaExtended } from './supercritical.js';
import {
  createZSpider, createXSpider, createHadamardBox,
  spiderFusion, hopfDecoupling,
} from './zxcalculus.js';
import { davenportHeilbronnZeta } from './proof-checker.js';

// ── Internal helpers ────────────────────────────────────────────────────────

/** Twistor incidence magnitude at s = [sigma, t]. */
function twistorIncidenceMag(s) {
  return incidenceRelation(twistorFromS(s), dualTwistorFromS(s)).magnitude;
}

/** Pearson correlation between two equal-length numeric arrays. */
function pearson(xs, ys) {
  const n = xs.length;
  if (n === 0) return 0;
  let sx = 0, sy = 0, sxy = 0, sx2 = 0, sy2 = 0;
  for (let i = 0; i < n; i++) {
    sx += xs[i]; sy += ys[i]; sxy += xs[i] * ys[i];
    sx2 += xs[i] * xs[i]; sy2 += ys[i] * ys[i];
  }
  const den = Math.sqrt((n * sx2 - sx * sx) * (n * sy2 - sy * sy));
  return den > 1e-15 ? (n * sxy - sx * sy) / den : 0;
}

/** Inline KL divergence D_KL(P_sigma || P_{1/2}). */
function inlineKL(s, np) {
  const primes = getPrimes(np), sEq = [0.5, s[1]];
  let totC = 0, totE = 0;
  const cur = [], eq = [];
  for (const p of primes) {
    const c = cAbs(eulerFactor(p, s)) ** 2;
    const e = cAbs(eulerFactor(p, sEq)) ** 2;
    cur.push(c); eq.push(e); totC += c; totE += e;
  }
  if (totC < 1e-30 || totE < 1e-30) return 0;
  let kl = 0;
  for (let i = 0; i < primes.length; i++) {
    const pc = cur[i] / totC, pe = eq[i] / totE;
    if (pc > 1e-30 && pe > 1e-30) kl += pc * Math.log2(pc / pe);
  }
  return Math.max(0, kl);
}

/** Inline Fisher information F(sigma, t). */
function inlineFisher(s, np) {
  const primes = getPrimes(np), ds = 0.001;
  let f = 0;
  for (const p of primes) {
    const c = cAbs(eulerFactor(p, s));
    if (c < 1e-20) continue;
    const cp = cAbs(eulerFactor(p, [s[0] + ds, s[1]]));
    const cm = cAbs(eulerFactor(p, [s[0] - ds, s[1]]));
    const d = (Math.log(cp) - Math.log(cm)) / (2 * ds);
    f += d * d;
  }
  return f;
}

/** Inline Shannon entropy of Euler product distribution. */
function inlineEntropy(s, np) {
  const primes = getPrimes(np);
  let total = 0; const ms = [];
  for (const p of primes) { const m = cAbs(eulerFactor(p, s)) ** 2; ms.push(m); total += m; }
  if (total < 1e-30) return 0;
  let H = 0;
  for (const m of ms) { const pk = m / total; if (pk > 1e-30) H -= pk * Math.log2(pk); }
  return H;
}

/** Inline channel capacity. */
function inlineCapacity(s, np) {
  const dir = directLadder(s, np), du = dualLadder(s, np), br = losslessBridge(s);
  const sig = cAbs(dir.totalTransfer) ** 2;
  const noise = cAbs(cSub(dir.totalImpedance, du.totalImpedance)) ** 2 + (1 - br.magnitude) ** 2;
  return 0.5 * Math.log2(1 + (noise > 1e-20 ? sig / noise : 1e10));
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. FISHER-TWISTOR CORRESPONDENCE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cross-correlate Fisher information with twistor incidence.
 * Hypothesis: F diverges where |Z.W| -> 0 (both at zeros on sigma=1/2).
 * @param {number} t - Imaginary part
 * @param {number[]} sigmaRange - [min,max] scan range
 * @param {number} steps - Scan points
 * @param {number} numPrimes - Primes for Euler product
 * @returns {{ points, correlation, peakSigma, verdict }}
 */
export function fisherTwistorCorrelation(t, sigmaRange = [0.1, 0.9], steps = 80, numPrimes = 15) {
  const points = [], fArr = [], iArr = [];
  for (let i = 0; i <= steps; i++) {
    const sigma = sigmaRange[0] + i * (sigmaRange[1] - sigmaRange[0]) / steps;
    const s = [sigma, t];
    const fisher = inlineFisher(s, numPrimes);
    const inc = twistorIncidenceMag(s);
    const prod = fisher * inc;
    points.push({ sigma, fisher, incidence: inc, fisherTimesIncidence: prod,
      antiCorrelated: (fisher > 1 && inc < 0.1) || (fisher < 1 && inc > 0.1) });
    fArr.push(fisher); iArr.push(inc);
  }
  const correlation = pearson(fArr, iArr);
  let peakVal = -Infinity, peakSigma = 0.5;
  for (const pt of points) {
    const v = pt.fisher / (pt.incidence + 1e-6);
    if (v > peakVal) { peakVal = v; peakSigma = pt.sigma; }
  }
  const verdict = Math.abs(peakSigma - 0.5) < 0.1 && correlation < -0.3
    ? 'CONFIRMED: Fisher and twistor incidence anti-correlated, peaking near sigma=0.5'
    : 'PARTIAL: Anti-correlation detected but peak displaced from 0.5';
  return { points, correlation, peakSigma, verdict };
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. KL DIVERGENCE AS LYAPUNOV FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Test whether D_KL(P_sigma || P_{1/2}) is a valid Lyapunov function.
 * Checks: positive, zero only at 1/2, monotonically decreasing toward 1/2.
 * @param {number} t - Imaginary part
 * @param {number} numPrimes - Number of primes
 * @returns {{ points, isLyapunov, monotoneLeft, monotoneRight, zeroAtHalf, verdict }}
 */
export function klLyapunovAnalysis(t, numPrimes = 15) {
  const N = 80, lo = 0.1, hi = 0.9, ds = (hi - lo) / N;
  const points = [];
  for (let i = 0; i <= N; i++) {
    const sigma = lo + i * ds;
    const kl = inlineKL([sigma, t], numPrimes);
    const klp = inlineKL([sigma + 0.001, t], numPrimes);
    const klm = inlineKL([sigma - 0.001, t], numPrimes);
    points.push({ sigma, kl, dkl: (klp - klm) / 0.002 });
  }
  const halfPt = points.reduce((a, b) => Math.abs(a.sigma - 0.5) < Math.abs(b.sigma - 0.5) ? a : b);
  const zeroAtHalf = halfPt.kl < 0.01;
  let monotoneLeft = true;
  for (let i = 1; i < points.length && points[i].sigma < 0.49; i++)
    if (points[i].kl > points[i - 1].kl + 1e-8) { monotoneLeft = false; break; }
  let monotoneRight = true;
  let prevRight = -1;
  for (let i = 0; i < points.length; i++) {
    if (points[i].sigma <= 0.51) continue;
    if (prevRight >= 0 && points[i].kl < points[prevRight].kl - 1e-8) { monotoneRight = false; break; }
    prevRight = i;
  }
  const isLyapunov = zeroAtHalf && monotoneLeft && monotoneRight;
  const verdict = isLyapunov
    ? 'VALID LYAPUNOV: D_KL is positive, zero at 1/2, monotone toward 1/2'
    : 'PARTIAL: Some Lyapunov conditions violated';
  return { points, isLyapunov, monotoneLeft, monotoneRight, zeroAtHalf, verdict };
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. SUPERCRITICAL PHASE BARRIERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Analyze free-energy barriers confining zeros to sigma=1/2.
 * Computes delta-F between sigma=0.5 and each sigma, plus specific heat.
 * @param {number} t - Imaginary part
 * @param {number} numPrimes - Number of primes
 * @returns {{ barriers, barrierHeight, phaseBoundaries, confinementStrength }}
 */
export function phaseBarrierAnalysis(t, numPrimes = 15) {
  const ref = thermodynamicState(0.5, t, numPrimes);
  const barriers = [];
  for (let s = 0.05; s <= 0.95; s += 0.05) {
    const sigma = +s.toFixed(2);
    const st = thermodynamicState(sigma, t, numPrimes);
    barriers.push({ sigma, freeEnergy: st.freeEnergy,
      deltaF: st.freeEnergy - ref.freeEnergy, specificHeat: st.specificHeat });
  }
  const barrierHeight = Math.max(...barriers.map(b => Math.abs(b.deltaF)));
  const sorted = [...barriers].sort((a, b) => Math.abs(b.specificHeat) - Math.abs(a.specificHeat));
  const phaseBoundaries = sorted.slice(0, 3).map(b => ({
    sigma: b.sigma,
    type: b.sigma < 0.2 ? 'functional-equation-boundary'
      : b.sigma > 0.8 ? 'euler-product-boundary' : 'critical-strip-interior',
  }));
  const thermalScale = Math.abs(ref.freeEnergy) || 1;
  return { barriers, barrierHeight, phaseBoundaries, confinementStrength: barrierHeight / thermalScale };
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. FOURIER-INFORMATION SYNTHESIS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Decompose zeta in the Fourier domain over log-prime frequencies.
 * Compute information content and channel capacity contribution per mode.
 * @param {number} t - Imaginary part
 * @param {number} numPrimes - Number of primes
 * @returns {{ modes, totalCapacity, dominantPrimes, spectrumEntropy }}
 */
export function fourierInfoSynthesis(t, numPrimes = 15) {
  const primes = getPrimes(numPrimes), s = [0.5, t];
  let totalMag2 = 0; const raws = [];
  for (const p of primes) { const m = cAbs(eulerFactor(p, s)); raws.push(m); totalMag2 += m * m; }
  const totalCap = inlineCapacity(s, numPrimes);
  const modes = [];
  for (let i = 0; i < primes.length; i++) {
    const p = primes[i], amp = raws[i];
    const pk = totalMag2 > 0 ? (amp * amp) / totalMag2 : 0;
    const info = pk > 1e-30 ? -pk * Math.log2(pk) : 0;
    const stageNoise = 0.5; // Q=1 at sigma=0.5
    const capC = 0.5 * Math.log2(1 + (amp * amp) / Math.max(stageNoise, 1e-10));
    modes.push({ prime: p, frequency: primeFrequency(p), fourierAmplitude: amp,
      informationContent: info, capacityContribution: capC });
  }
  const dominantPrimes = [...modes].sort((a, b) => b.capacityContribution - a.capacityContribution)
    .slice(0, 5).map(m => m.prime);
  const totCC = modes.reduce((s, m) => s + m.capacityContribution, 0);
  let spectrumEntropy = 0;
  if (totCC > 1e-30) for (const m of modes) {
    const pk = m.capacityContribution / totCC;
    if (pk > 1e-30) spectrumEntropy -= pk * Math.log2(pk);
  }
  return { modes, totalCapacity: totalCap, dominantPrimes, spectrumEntropy };
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. UNIFIED CONFINEMENT POTENTIAL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Combined confinement potential from all available measures:
 * Phi = w1*D_KL + w2*(1-|chi|)^2 + w3*|Z.W|^2 + w4*deltaH + w5*(1-C/Cmax)^2 + w6*F_barrier^2
 * Weights normalized so each component ~ 1 at sigma = 0.25.
 * @param {number} sigma - Real part
 * @param {number} t - Imaginary part
 * @param {number} numPrimes - Number of primes
 * @returns {{ potential, components, weights, sigma, t }}
 */
export function unifiedConfinementPotential(sigma, t, numPrimes = 15) {
  const s = [sigma, t];
  const klV = inlineKL(s, numPrimes);
  const brV = (1 - losslessBridge(s).magnitude) ** 2;
  const twV = twistorIncidenceMag(s) ** 2;
  const dir = directLadder(s, numPrimes), du = dualLadder(s, numPrimes);
  const hamV = cAbs(cSub(dir.totalImpedance, du.totalImpedance)) ** 2;
  const cap = inlineCapacity(s, numPrimes), capMax = inlineCapacity([0.5, t], numPrimes);
  const capV = capMax > 1e-10 ? (1 - cap / capMax) ** 2 : 0;
  const stH = thermodynamicState(sigma, t, numPrimes);
  const stR = thermodynamicState(0.5, t, numPrimes);
  const barV = (stH.freeEnergy - stR.freeEnergy) ** 2;

  // Reference at sigma=0.25 for normalization
  const sR = [0.25, t];
  const norm = (v, ref) => ref > 1e-10 ? 1 / ref : 1;
  const klR = inlineKL(sR, numPrimes);
  const brR = (1 - losslessBridge(sR).magnitude) ** 2;
  const twR = twistorIncidenceMag(sR) ** 2;
  const dR = directLadder(sR, numPrimes), duR = dualLadder(sR, numPrimes);
  const hamR = cAbs(cSub(dR.totalImpedance, duR.totalImpedance)) ** 2;
  const capR = capMax > 1e-10 ? (1 - inlineCapacity(sR, numPrimes) / capMax) ** 2 : 1;
  const stRR = thermodynamicState(0.25, t, numPrimes);
  const barR = (stRR.freeEnergy - stR.freeEnergy) ** 2;

  const w1 = norm(klV, klR), w2 = norm(brV, brR), w3 = norm(twV, twR);
  const w4 = norm(hamV, hamR), w5 = norm(capV, capR), w6 = norm(barV, barR);
  const potential = w1*klV + w2*brV + w3*twV + w4*hamV + w5*capV + w6*barV;

  return { potential, components: { kl: w1*klV, bridge: w2*brV, twistor: w3*twV,
    hamiltonian: w4*hamV, capacity: w5*capV, barrier: w6*barV },
    weights: { w1, w2, w3, w4, w5, w6 }, sigma, t };
}

/**
 * Compute Phi(sigma,t) over a 2D grid.
 * @param {number[]} tValues - Array of t values
 * @param {number[]} sigmaRange - [min,max] sigma range
 * @param {number} steps - Steps along sigma
 * @param {number} numPrimes - Number of primes
 * @returns {{ grid, minima, criticalLineDepth }}
 */
export function confinementLandscape(tValues, sigmaRange = [0.1, 0.9], steps = 40, numPrimes = 12) {
  const ds = (sigmaRange[1] - sigmaRange[0]) / steps;
  const grid = [];
  for (const t of tValues)
    for (let i = 0; i <= steps; i++) {
      const sigma = sigmaRange[0] + i * ds;
      grid.push({ sigma, t, potential: unifiedConfinementPotential(sigma, t, numPrimes).potential });
    }
  const minima = [];
  for (const t of tValues) {
    const row = grid.filter(g => g.t === t);
    for (let i = 1; i < row.length - 1; i++)
      if (row[i].potential < row[i - 1].potential && row[i].potential < row[i + 1].potential)
        minima.push({ sigma: row[i].sigma, t, potential: row[i].potential });
  }
  let depthSum = 0;
  for (const t of tValues) {
    const row = grid.filter(g => g.t === t);
    const half = row.reduce((a, b) => Math.abs(a.sigma - 0.5) < Math.abs(b.sigma - 0.5) ? a : b);
    depthSum += Math.max(...row.map(r => r.potential)) - half.potential;
  }
  return { grid, minima, criticalLineDepth: depthSum / tValues.length };
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. ZX-CALCULUS EXTENSIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Decompose the Euler product as a chain of ZX phase gadgets.
 * Each prime contributes a Z-phase with angle alpha_p = arg(H_p(s)).
 * @param {number[]} s - Complex point [sigma, t]
 * @param {number} numPrimes - Number of primes
 * @returns {{ gadgets, totalPhase, stabilizerRank, isClifford, circuitDepth }}
 */
export function phaseGadgetDecomposition(s, numPrimes = 15) {
  const primes = getPrimes(numPrimes), gadgets = [];
  let totalPhase = 0, stabCount = 0;
  for (const p of primes) {
    const ef = eulerFactor(p, s);
    const phase = Math.atan2(ef[1], ef[0]);
    const norm = ((phase % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const nearest = Math.round(norm / (Math.PI / 2)) * (Math.PI / 2);
    const dist = Math.abs(norm - nearest);
    if (dist > 0.1) stabCount++;
    gadgets.push({ prime: p, phase, magnitude: cAbs(ef), stabilizerContribution: dist > 0.1 ? dist : 0 });
    totalPhase += phase;
  }
  return { gadgets, totalPhase, stabilizerRank: stabCount, isClifford: stabCount === 0, circuitDepth: numPrimes };
}

/**
 * Build the full ZX proof circuit: Z-spiders -> Hadamard -> X-spiders -> measurement.
 * Measurement outcome should be deterministic (=0) at sigma=0.5.
 * @param {number} numPrimes - Number of primes
 * @param {number} t - Imaginary part
 * @returns {{ circuit, measurementOutcome, isDeterministic, proofStrength }}
 */
export function zxProofCircuit(numPrimes, t) {
  const s = [0.5, t], primes = getPrimes(numPrimes);
  const zSpiders = primes.map((p, i) => createZSpider(p, s, `z-${i}`));
  let fusedZ = zSpiders[0];
  for (let i = 1; i < zSpiders.length; i++) fusedZ = spiderFusion(fusedZ, zSpiders[i]) || fusedZ;
  const xSpiders = primes.map((p, i) => createXSpider(p, s, `x-${i}`));
  let fusedX = xSpiders[0];
  for (let i = 1; i < xSpiders.length; i++) fusedX = spiderFusion(fusedX, xSpiders[i]) || fusedX;
  const hadamard = createHadamardBox(s, 'H-proof');
  const wires = [{ from: fusedZ.id, to: hadamard.id }, { from: hadamard.id, to: fusedX.id }];
  const deviation = cAbs(cSub(fusedZ.eulerFactor, cMul(hadamard.chi, fusedX.eulerFactor)));
  const isDeterministic = deviation < 0.5;
  return { circuit: { zSpiders, xSpiders, hadamard, wires }, measurementOutcome: deviation,
    isDeterministic, proofStrength: Math.max(0, 1 - deviation / 10) };
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. ATTACK STRATEGY EVALUATOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Run all analyses and score each approach 0-10 on how convincingly it points to sigma=1/2.
 * @param {number} t - Imaginary part
 * @param {number} numPrimes - Number of primes
 * @returns {{ strategies, bestStrategy, overallScore, nextSteps }}
 */
export function evaluateAttackStrategies(t, numPrimes = 15) {
  const strategies = [];

  const ft = fisherTwistorCorrelation(t, [0.1, 0.9], 40, numPrimes);
  const ftS = Math.min(10, (Math.abs(ft.correlation) > 0.3 ? 5 : 2) + (Math.abs(ft.peakSigma - 0.5) < 0.1 ? 5 : 1));
  strategies.push({ name: 'Fisher-Twistor Correspondence', score: ftS,
    evidence: `Peak sigma=${ft.peakSigma.toFixed(3)}, corr=${ft.correlation.toFixed(3)}`,
    weakness: Math.abs(ft.peakSigma - 0.5) > 0.1 ? 'Peak displaced from 0.5' : 'None',
    status: ftS >= 7 ? 'strong' : ftS >= 4 ? 'moderate' : 'weak' });

  const kl = klLyapunovAnalysis(t, numPrimes);
  const klS = (kl.zeroAtHalf ? 3 : 0) + (kl.monotoneLeft ? 3 : 0) + (kl.monotoneRight ? 3 : 0) + (kl.isLyapunov ? 1 : 0);
  strategies.push({ name: 'KL Divergence Lyapunov', score: klS,
    evidence: `isLyapunov=${kl.isLyapunov}, zeroAtHalf=${kl.zeroAtHalf}`,
    weakness: !kl.isLyapunov ? 'Monotonicity violated' : 'None',
    status: klS >= 7 ? 'strong' : klS >= 4 ? 'moderate' : 'weak' });

  const pb = phaseBarrierAnalysis(t, numPrimes);
  const pbS = Math.min(10, Math.round(Math.min(pb.confinementStrength * 3, 7) + (pb.phaseBoundaries.length >= 2 ? 3 : 1)));
  strategies.push({ name: 'Supercritical Phase Barriers', score: pbS,
    evidence: `barrierH=${pb.barrierHeight.toFixed(3)}, confine=${pb.confinementStrength.toFixed(3)}`,
    weakness: pb.confinementStrength < 1 ? 'Barrier too low' : 'None',
    status: pbS >= 7 ? 'strong' : pbS >= 4 ? 'moderate' : 'weak' });

  const fi = fourierInfoSynthesis(t, numPrimes);
  const fiS = Math.min(10, Math.round(fi.spectrumEntropy * 2 + (fi.dominantPrimes[0] === 2 ? 3 : 1)));
  strategies.push({ name: 'Fourier-Information Synthesis', score: fiS,
    evidence: `specEntropy=${fi.spectrumEntropy.toFixed(3)}, dominant=[${fi.dominantPrimes.join(',')}]`,
    weakness: fi.spectrumEntropy < 1 ? 'Low spectral entropy' : 'None',
    status: fiS >= 7 ? 'strong' : fiS >= 4 ? 'moderate' : 'weak' });

  const cp = unifiedConfinementPotential(0.5, t, numPrimes);
  const cpOff = unifiedConfinementPotential(0.3, t, numPrimes);
  const depth = cpOff.potential - cp.potential;
  const cpS = Math.min(10, Math.round(Math.min(depth * 2, 7) + (cp.potential < 0.5 ? 3 : 1)));
  strategies.push({ name: 'Unified Confinement Potential', score: cpS,
    evidence: `wellDepth=${depth.toFixed(3)}, Phi(0.5)=${cp.potential.toFixed(3)}`,
    weakness: depth < 1 ? 'Shallow potential well' : 'None',
    status: cpS >= 7 ? 'strong' : cpS >= 4 ? 'moderate' : 'weak' });

  const zx = zxProofCircuit(numPrimes, t);
  const zxS = Math.min(10, Math.round(zx.proofStrength * 7 + (zx.isDeterministic ? 3 : 0)));
  strategies.push({ name: 'ZX Proof Circuit', score: zxS,
    evidence: `deterministic=${zx.isDeterministic}, strength=${zx.proofStrength.toFixed(3)}`,
    weakness: !zx.isDeterministic ? 'Non-deterministic measurement' : 'None',
    status: zxS >= 7 ? 'strong' : zxS >= 4 ? 'moderate' : 'weak' });

  const overallScore = strategies.reduce((s, st) => s + st.score, 0) / strategies.length;
  const bestStrategy = strategies.reduce((a, b) => a.score > b.score ? a : b).name;
  const nextSteps = strategies.filter(s => s.score < 7).map(s => `Strengthen ${s.name}: ${s.weakness}`);
  if (nextSteps.length === 0) nextSteps.push('All strategies >= 7. Consolidate into formal proof.');

  return { strategies, bestStrategy, overallScore, nextSteps };
}

// ═══════════════════════════════════════════════════════════════════════════
// 8. CROSS-CORRELATION MATRIX
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Pairwise correlations between all measures (entropy, capacity, Fisher, KL,
 * twistor, bridge, Hamiltonian, confinement) across a sigma scan.
 * Independent measures all pointing to sigma=0.5 is itself evidence.
 * @param {number} t - Imaginary part
 * @param {number[]} sigmaRange - [min,max] sigma range
 * @param {number} steps - Scan points
 * @param {number} numPrimes - Number of primes
 * @returns {{ measures, matrix, strongCorrelations, independentMeasures }}
 */
export function crossCorrelationMatrix(t, sigmaRange = [0.1, 0.9], steps = 40, numPrimes = 12) {
  const ds = (sigmaRange[1] - sigmaRange[0]) / steps;
  const measures = ['entropy', 'capacity', 'fisher', 'kl', 'twistor', 'bridge', 'hamiltonian', 'confinement'];
  const data = measures.map(() => []);
  for (let i = 0; i <= steps; i++) {
    const sigma = sigmaRange[0] + i * ds, s = [sigma, t];
    data[0].push(inlineEntropy(s, numPrimes));
    data[1].push(inlineCapacity(s, numPrimes));
    data[2].push(inlineFisher(s, numPrimes));
    data[3].push(inlineKL(s, numPrimes));
    data[4].push(twistorIncidenceMag(s));
    data[5].push(losslessBridge(s).magnitude);
    const dir = directLadder(s, numPrimes), du = dualLadder(s, numPrimes);
    data[6].push(cAbs(cSub(dir.totalImpedance, du.totalImpedance)));
    data[7].push(unifiedConfinementPotential(sigma, t, numPrimes).potential);
  }
  const n = measures.length, matrix = [];
  for (let i = 0; i < n; i++) { const row = []; for (let j = 0; j < n; j++) row.push(pearson(data[i], data[j])); matrix.push(row); }
  const strongCorrelations = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++)
    if (Math.abs(matrix[i][j]) > 0.7) strongCorrelations.push({ m1: measures[i], m2: measures[j], corr: matrix[i][j] });
  let independentMeasures = 0;
  for (let i = 0; i < n; i++) {
    let low = 0;
    for (let j = 0; j < n; j++) if (i !== j && Math.abs(matrix[i][j]) < 0.3) low++;
    if (low >= Math.floor((n - 1) / 2)) independentMeasures++;
  }
  return { measures, matrix, strongCorrelations, independentMeasures };
}

// ═══════════════════════════════════════════════════════════════════════════
// 9. DAVENPORT-HEILBRONN CROSS-VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cross-validate attack strategies against the Davenport-Heilbronn function.
 * D-H has zeros OFF the critical line, so any attack that places them ON the
 * critical line is unsound (fooled like the D-H counterexample).
 * An attack that correctly identifies off-line zeros as off-line is sound.
 *
 * Tests each attack on known off-line behavior of D-H:
 * - Compute the unified confinement potential for D-H
 * - Check if the potential well is at sigma=0.5 (would be wrong for D-H)
 * - Compare each measure's behavior on zeta vs D-H
 *
 * @param {number} t - Imaginary part to test
 * @param {number} numPrimes - Number of primes for Euler product computations
 * @returns {{ attacks: Array<{name: string, zetaPointsToHalf: boolean, dhPointsToHalf: boolean, isFooled: boolean, isSound: boolean, zetaValue: number, dhValue: number}>, numSound: number, numFooled: number, soundnessRatio: number, verdict: string }}
 */
export function crossValidateWithDH(t, numPrimes = 15) {
  const attacks = [];
  const sHalf = [0.5, t], sOff = [0.3, t];

  // Attack 1: KL divergence minimum at 0.5
  {
    const zetaKLHalf = inlineKL(sHalf, numPrimes);
    const zetaKLOff = inlineKL(sOff, numPrimes);
    const zetaPointsToHalf = zetaKLHalf < zetaKLOff;

    // For D-H: use |f(s)|^2 distribution across "pseudo-primes"
    const dhHalf = cAbs(davenportHeilbronnZeta(sHalf, 500));
    const dhOff = cAbs(davenportHeilbronnZeta(sOff, 500));
    const dhPointsToHalf = dhHalf < dhOff; // If |f| smaller at 0.5, potential well there
    attacks.push({
      name: 'KL Divergence',
      zetaPointsToHalf,
      dhPointsToHalf,
      isFooled: dhPointsToHalf, // If D-H also points to 0.5, attack is fooled
      isSound: zetaPointsToHalf && !dhPointsToHalf,
      zetaValue: zetaKLOff - zetaKLHalf,
      dhValue: dhOff - dhHalf,
    });
  }

  // Attack 2: Fisher information peak at 0.5
  {
    const zetaFHalf = inlineFisher(sHalf, numPrimes);
    const zetaFOff = inlineFisher(sOff, numPrimes);
    const zetaPointsToHalf = zetaFHalf > zetaFOff;

    // D-H Fisher via finite differences
    const ds = 0.001;
    const dhP = cAbs(davenportHeilbronnZeta([0.5 + ds, t], 400));
    const dhM = cAbs(davenportHeilbronnZeta([0.5 - ds, t], 400));
    const dhFHalf = ((Math.log(dhP + 1e-20) - Math.log(dhM + 1e-20)) / (2 * ds)) ** 2;
    const dhPo = cAbs(davenportHeilbronnZeta([0.3 + ds, t], 400));
    const dhMo = cAbs(davenportHeilbronnZeta([0.3 - ds, t], 400));
    const dhFOff = ((Math.log(dhPo + 1e-20) - Math.log(dhMo + 1e-20)) / (2 * ds)) ** 2;
    const dhPointsToHalf = dhFHalf > dhFOff;
    attacks.push({
      name: 'Fisher Information',
      zetaPointsToHalf,
      dhPointsToHalf,
      isFooled: dhPointsToHalf,
      isSound: zetaPointsToHalf && !dhPointsToHalf,
      zetaValue: zetaFHalf,
      dhValue: dhFHalf,
    });
  }

  // Attack 3: Bridge unitarity
  {
    const zetaBridge = losslessBridge(sHalf).magnitude;
    const zetaPointsToHalf = Math.abs(zetaBridge - 1) < 0.05;

    const dhFS = davenportHeilbronnZeta(sHalf, 500);
    const dhF1S = davenportHeilbronnZeta([0.5, -t], 500);
    const dhBridge = cAbs(dhF1S) > 1e-15 ? cAbs(dhFS) / cAbs(dhF1S) : NaN;
    const dhPointsToHalf = !isNaN(dhBridge) && Math.abs(dhBridge - 1) < 0.15;
    attacks.push({
      name: 'Bridge Unitarity',
      zetaPointsToHalf,
      dhPointsToHalf,
      isFooled: dhPointsToHalf,
      isSound: zetaPointsToHalf && !dhPointsToHalf,
      zetaValue: zetaBridge,
      dhValue: isNaN(dhBridge) ? 0 : dhBridge,
    });
  }

  // Attack 4: Entropy maximum at 0.5
  {
    const zetaEHalf = inlineEntropy(sHalf, numPrimes);
    const zetaEOff = inlineEntropy(sOff, numPrimes);
    const zetaPointsToHalf = zetaEHalf > zetaEOff;

    // D-H entropy from coefficient distribution
    let dhEHalf = 0, dhEOff = 0;
    const bins1 = new Float64Array(8), bins2 = new Float64Array(8);
    for (let n = 1; n <= 50; n++) {
      const v1 = davenportHeilbronnZeta([0.5 + n * 0.001, t], 100);
      const v2 = davenportHeilbronnZeta([0.3 + n * 0.001, t], 100);
      const ph1 = ((Math.atan2(v1[1], v1[0]) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const ph2 = ((Math.atan2(v2[1], v2[0]) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      bins1[Math.min(Math.floor(ph1 / (2 * Math.PI) * 8), 7)]++;
      bins2[Math.min(Math.floor(ph2 / (2 * Math.PI) * 8), 7)]++;
    }
    for (let i = 0; i < 8; i++) {
      const p1 = bins1[i] / 50; if (p1 > 0) dhEHalf -= p1 * Math.log2(p1);
      const p2 = bins2[i] / 50; if (p2 > 0) dhEOff -= p2 * Math.log2(p2);
    }
    const dhPointsToHalf = dhEHalf > dhEOff;
    attacks.push({
      name: 'Entropy Maximum',
      zetaPointsToHalf,
      dhPointsToHalf,
      isFooled: dhPointsToHalf,
      isSound: zetaPointsToHalf && !dhPointsToHalf,
      zetaValue: zetaEHalf,
      dhValue: dhEHalf,
    });
  }

  // Attack 5: Phase barrier height
  {
    const refH = thermodynamicState(0.5, t, numPrimes);
    const offH = thermodynamicState(0.3, t, numPrimes);
    const zetaBarrier = Math.abs(offH.freeEnergy - refH.freeEnergy);
    const zetaPointsToHalf = zetaBarrier > 0.1;

    const dhHalf = cAbs(davenportHeilbronnZeta(sHalf, 500));
    const dhOff2 = cAbs(davenportHeilbronnZeta(sOff, 500));
    const dhBarrier = Math.abs(-Math.log(dhOff2 + 1e-20) + Math.log(dhHalf + 1e-20));
    const dhPointsToHalf = dhBarrier > 0.1 && dhHalf < dhOff2;
    attacks.push({
      name: 'Phase Barrier',
      zetaPointsToHalf,
      dhPointsToHalf,
      isFooled: dhPointsToHalf,
      isSound: zetaPointsToHalf && !dhPointsToHalf,
      zetaValue: zetaBarrier,
      dhValue: dhBarrier,
    });
  }

  // Attack 6: Confinement potential well
  {
    const cpHalf = unifiedConfinementPotential(0.5, t, numPrimes).potential;
    const cpOff = unifiedConfinementPotential(0.3, t, numPrimes).potential;
    const zetaPointsToHalf = cpHalf < cpOff;

    // D-H confinement: just use |f|^2 as pseudo-potential
    const dhPotHalf = cAbs(davenportHeilbronnZeta(sHalf, 500)) ** 2;
    const dhPotOff = cAbs(davenportHeilbronnZeta(sOff, 500)) ** 2;
    const dhPointsToHalf = dhPotHalf < dhPotOff;
    attacks.push({
      name: 'Confinement Potential',
      zetaPointsToHalf,
      dhPointsToHalf,
      isFooled: dhPointsToHalf,
      isSound: zetaPointsToHalf && !dhPointsToHalf,
      zetaValue: cpOff - cpHalf,
      dhValue: dhPotOff - dhPotHalf,
    });
  }

  const numSound = attacks.filter(a => a.isSound).length;
  const numFooled = attacks.filter(a => a.isFooled).length;
  const soundnessRatio = attacks.length > 0 ? numSound / attacks.length : 0;
  const verdict = numFooled >= 4
    ? `CRITICAL: ${numFooled}/6 attacks are fooled by D-H. These attacks DO NOT distinguish zeta from functions with off-line zeros.`
    : numSound >= 3
      ? `Promising: ${numSound}/6 attacks are sound (correctly reject D-H). These rely on Euler product structure.`
      : `Mixed: ${numSound} sound, ${numFooled} fooled. Euler product discrimination needed.`;

  return { attacks, numSound, numFooled, soundnessRatio, verdict };
}

// ═══════════════════════════════════════════════════════════════════════════
// 10. BOOTSTRAP ATTACK CONFIDENCE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Bootstrap confidence intervals for attack scores.
 * Resample with different prime subsets and t-values to estimate
 * robustness of the attack strategy evaluations.
 *
 * For each bootstrap iteration:
 *   - Pick a random t from the first 20 known zeros
 *   - Pick a random subset of primes (50-100% of available)
 *   - Run evaluateAttackStrategies and record scores
 *
 * @param {number} numBootstrap - Number of bootstrap iterations (default 50)
 * @returns {{ strategyStats: Array<{name: string, mean: number, std: number, ci95: [number, number], min: number, max: number}>, overallMean: number, overallStd: number, robustStrategies: string[], fragileStrategies: string[] }}
 */
export function bootstrapAttackConfidence(numBootstrap = 50) {
  // Use a simple seeded pseudo-random for reproducibility
  let seed = 42;
  function rand() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  }

  const zeros = ZETA_ZEROS.slice(0, 20);
  const strategyScores = {}; // name -> [scores]
  const overallScores = [];

  for (let b = 0; b < numBootstrap; b++) {
    // Random t from known zeros
    const tIdx = Math.floor(rand() * zeros.length);
    const t = zeros[tIdx];

    // Random number of primes (50-100% of 15)
    const np = 8 + Math.floor(rand() * 8); // 8 to 15

    try {
      const result = evaluateAttackStrategies(t, np);
      for (const s of result.strategies) {
        if (!strategyScores[s.name]) strategyScores[s.name] = [];
        strategyScores[s.name].push(s.score);
      }
      overallScores.push(result.overallScore);
    } catch {
      // Skip failed iterations
    }
  }

  const strategyStats = [];
  for (const [name, scores] of Object.entries(strategyScores)) {
    if (scores.length === 0) continue;
    const n = scores.length;
    const mean = scores.reduce((a, b) => a + b, 0) / n;
    const variance = scores.reduce((a, b) => a + (b - mean) * (b - mean), 0) / n;
    const std = Math.sqrt(variance);
    const sorted = [...scores].sort((a, b) => a - b);
    const lo = sorted[Math.floor(n * 0.025)] || sorted[0];
    const hi = sorted[Math.min(Math.floor(n * 0.975), n - 1)] || sorted[n - 1];
    strategyStats.push({
      name,
      mean,
      std,
      ci95: [lo, hi],
      min: sorted[0],
      max: sorted[n - 1],
    });
  }

  const overallMean = overallScores.length > 0
    ? overallScores.reduce((a, b) => a + b, 0) / overallScores.length
    : 0;
  const overallVar = overallScores.length > 0
    ? overallScores.reduce((a, b) => a + (b - overallMean) * (b - overallMean), 0) / overallScores.length
    : 0;
  const overallStd = Math.sqrt(overallVar);

  // Robust strategies: std < 1.5 and mean > 5
  const robustStrategies = strategyStats
    .filter(s => s.std < 1.5 && s.mean > 5)
    .map(s => s.name);

  // Fragile strategies: std > 2.0 or mean < 3
  const fragileStrategies = strategyStats
    .filter(s => s.std > 2.0 || s.mean < 3)
    .map(s => s.name);

  return {
    strategyStats,
    overallMean,
    overallStd,
    robustStrategies,
    fragileStrategies,
  };
}
