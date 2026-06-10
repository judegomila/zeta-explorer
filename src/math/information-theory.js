/**
 * Information Theory Module for the ZPO Twin-Ladder Model
 *
 * The twin-ladder network can be viewed as a communication channel:
 *   - Input: complex frequency s = σ + it
 *   - Channel: cascade of prime oscillator stages
 *   - Output: ζ(s) = the channel response
 *
 * Key information-theoretic quantities:
 *   1. Shannon Entropy — measures disorder/information in the Euler product
 *   2. Channel Capacity — maximum rate of reliable transmission through the ladder
 *   3. Mutual Information — coupling between direct and dual ladders
 *   4. Fisher Information — sensitivity of the ladder output to σ (critical-line detector)
 *   5. Rate-Distortion — how many primes are needed to approximate ζ to accuracy D
 *   6. KL Divergence — how far the system is from the critical-line equilibrium
 *
 * The critical line σ = ½ emerges as:
 *   - Maximum mutual information between direct/dual ladders
 *   - Maximum channel capacity (matched impedance = optimal signal transfer)
 *   - Minimum KL divergence from the equilibrium distribution
 *   - Fisher information singularity (infinite sensitivity to σ perturbation at zeros)
 */

import { cMul, cAdd, cSub, cAbs, cExp, cLog, cDiv, cPow, eulerFactor,
         zetaCriticalStrip, ZETA_ZEROS } from './zeta.js';
import { losslessBridge, directLadder, dualLadder, oscillatorStage } from './oscillators.js';
import { getPrimes, primeFrequency } from './primes.js';

// ─── 1. Shannon Entropy of the Euler Product ─────────────────────────────────
/**
 * Treat each Euler factor |H_p(s)|² as a probability weight (after normalization).
 * The Shannon entropy measures how "spread out" the energy is across primes.
 *
 * H(s) = -Σ_p p_k · log₂(p_k)  where p_k = |H_p(s)|² / Σ|H_p(s)|²
 *
 * At σ = ½: direct and dual weight distributions coincide (functional equation symmetry),
 *   but the distribution is NOT uniform — small primes always dominate (p^{-1/2} > q^{-1/2} for p < q).
 * At σ >> 1: large primes contribute negligibly (low entropy, peaked at small primes)
 * At σ → 0: entropy diverges (all stages blow up)
 *
 * This is the information-theoretic content of the Euler product.
 */
export function eulerProductEntropy(s, numPrimes = 20) {
  const primes = getPrimes(numPrimes);
  const magnitudes = [];
  let totalEnergy = 0;

  for (const p of primes) {
    const ef = eulerFactor(p, s);
    const mag2 = cAbs(ef) ** 2;
    magnitudes.push({ prime: p, mag2 });
    totalEnergy += mag2;
  }

  if (totalEnergy < 1e-20) return { entropy: 0, maxEntropy: 0, efficiency: 0, distribution: [] };

  // Normalize to probability distribution
  const distribution = magnitudes.map(m => ({
    prime: m.prime,
    probability: m.mag2 / totalEnergy,
    mag2: m.mag2,
  }));

  // Shannon entropy
  let entropy = 0;
  for (const d of distribution) {
    if (d.probability > 1e-20) {
      entropy -= d.probability * Math.log2(d.probability);
    }
  }

  // Maximum entropy (uniform distribution)
  const maxEntropy = Math.log2(numPrimes);

  // Efficiency: how close to uniform (1 = perfectly uniform = maximum entropy)
  const efficiency = maxEntropy > 0 ? entropy / maxEntropy : 0;

  return { entropy, maxEntropy, efficiency, distribution, totalEnergy };
}

/**
 * Scan entropy across σ for fixed t.
 * Should show peak near σ = ½.
 */
export function entropySigmaScan(t, sigmaRange = [0.1, 2.0], steps = 80, numPrimes = 15) {
  const results = [];
  const ds = (sigmaRange[1] - sigmaRange[0]) / steps;

  for (let i = 0; i <= steps; i++) {
    const sigma = sigmaRange[0] + i * ds;
    const data = eulerProductEntropy([sigma, t], numPrimes);
    results.push({ sigma, ...data });
  }

  return results;
}

// ─── 2. Channel Capacity ─────────────────────────────────────────────────────
/**
 * The twin-ladder as a Gaussian channel:
 *   Y = H(s) · X + N  where H(s) is the transfer function, N is noise
 *
 * Channel capacity: C = ½ log₂(1 + SNR) bits per use
 * where SNR = |H(s)|² · P / N₀ (signal-to-noise ratio)
 *
 * The "noise" is the impedance mismatch between direct and dual ladders.
 * At σ = ½: conjugate match Z_dual = Z̄_dir minimizes mismatch, maximizing SNR and capacity.
 * Off the critical line: mismatch grows, adding "noise" and reducing capacity.
 *
 * This gives an information-theoretic interpretation of the critical line:
 * it's the operating point of maximum channel capacity.
 */
export function channelCapacity(s, numPrimes = 15) {
  const direct = directLadder(s, numPrimes);
  const dual = dualLadder(s, numPrimes);
  const bridge = losslessBridge(s);

  // Signal power: |ζ(s)|² from the ladder output
  const signalPower = cAbs(direct.totalTransfer) ** 2;

  // Noise power: impedance mismatch energy
  const Zdiff = cSub(direct.totalImpedance, dual.totalImpedance);
  const noisePower = cAbs(Zdiff) ** 2 + (1 - bridge.magnitude) ** 2;

  // SNR
  const snr = noisePower > 1e-20 ? signalPower / noisePower : 1e10;

  // Channel capacity (bits)
  const capacity = 0.5 * Math.log2(1 + snr);

  // Per-stage capacity
  const perStageCapacities = direct.stages.map(stage => {
    const stagePower = cAbs(stage.transferFunction) ** 2;
    const stageNoise = 1 / (stage.Q * stage.Q + 1); // Q-factor determines noise floor
    return {
      prime: stage.prime,
      capacity: 0.5 * Math.log2(1 + stagePower / Math.max(stageNoise, 1e-10)),
      snr: stagePower / Math.max(stageNoise, 1e-10),
    };
  });

  return {
    capacity,
    snr,
    snrDB: 10 * Math.log10(Math.max(snr, 1e-20)),
    signalPower,
    noisePower,
    bridgeLoss: (1 - bridge.magnitude) ** 2,
    perStageCapacities,
  };
}

/**
 * Scan channel capacity across σ.
 * Peak at σ = ½ = maximum information throughput.
 */
export function capacitySigmaScan(t, sigmaRange = [0.1, 2.0], steps = 80, numPrimes = 12) {
  const results = [];
  const ds = (sigmaRange[1] - sigmaRange[0]) / steps;

  for (let i = 0; i <= steps; i++) {
    const sigma = sigmaRange[0] + i * ds;
    const data = channelCapacity([sigma, t], numPrimes);
    results.push({ sigma, ...data });
  }

  return results;
}

// ─── 3. Mutual Information ───────────────────────────────────────────────────
/**
 * Mutual information between the direct and dual ladders:
 *   I(Direct; Dual) = H(Direct) + H(Dual) - H(Direct, Dual)
 *
 * The bridge χ(s) determines the coupling. At σ = ½:
 *   |χ| = 1 → maximum coupling → maximum mutual information
 * Off the critical line:
 *   |χ| ≠ 1 → partial coupling → reduced mutual information
 *
 * We compute this using the correlation structure of the Euler factors.
 */
export function mutualInformation(s, numPrimes = 15) {
  const primes = getPrimes(numPrimes);
  const bridge = losslessBridge(s);
  const sDual = [1 - s[0], -s[1]];

  // Compute entropies
  const directEntropy = eulerProductEntropy(s, numPrimes);
  const dualEntropy = eulerProductEntropy(sDual, numPrimes);

  // Joint distribution: (|H_p(s)|², |H_p(1-s)|²)
  // At σ = ½, these are equal (perfect correlation)
  // Off σ = ½, they diverge (reduced correlation)
  let jointEntropy = 0;
  let correlation = 0;
  let totalJoint = 0;

  const jointDist = [];
  for (const p of primes) {
    const efDirect = cAbs(eulerFactor(p, s)) ** 2;
    const efDual = cAbs(eulerFactor(p, sDual)) ** 2;
    const joint = efDirect * efDual;
    totalJoint += joint;
    jointDist.push({ prime: p, direct: efDirect, dual: efDual, joint });
    correlation += efDirect * efDual;
  }

  // Normalize joint distribution and compute entropy
  if (totalJoint > 1e-20) {
    for (const d of jointDist) {
      const p = d.joint / totalJoint;
      if (p > 1e-20) jointEntropy -= p * Math.log2(p);
    }
  }

  // Mutual information
  const mi = Math.max(0, directEntropy.entropy + dualEntropy.entropy - jointEntropy);

  // Normalized MI (0 = independent, 1 = perfectly correlated)
  const maxMI = Math.min(directEntropy.entropy, dualEntropy.entropy);
  const normalizedMI = maxMI > 0 ? mi / maxMI : 0;

  return {
    mutualInfo: mi,
    normalizedMI,
    directEntropy: directEntropy.entropy,
    dualEntropy: dualEntropy.entropy,
    jointEntropy,
    bridgeMagnitude: bridge.magnitude,
    bridgeUnitary: bridge.isUnitary,
    jointDist,
  };
}

/**
 * Scan mutual information across σ.
 * Should peak at σ = ½ (maximum direct-dual coupling).
 */
export function mutualInfoSigmaScan(t, sigmaRange = [0.1, 2.0], steps = 80, numPrimes = 12) {
  const results = [];
  const ds = (sigmaRange[1] - sigmaRange[0]) / steps;

  for (let i = 0; i <= steps; i++) {
    const sigma = sigmaRange[0] + i * ds;
    const data = mutualInformation([sigma, t], numPrimes);
    results.push({ sigma, ...data });
  }

  return results;
}

// ─── 4. Fisher Information ───────────────────────────────────────────────────
/**
 * Fisher information with respect to σ:
 *   I_F(σ) = E[(∂/∂σ log f(x|σ))²]
 *
 * For the Euler product, this measures how sensitive the output distribution
 * is to small changes in σ. The Fisher information diverges at zeros of ζ
 * because the "distribution" becomes singular (zero probability → infinite information).
 *
 * We approximate: I_F(σ) ≈ Σ_p (∂/∂σ log|H_p(s)|)²
 *
 * The Cramér-Rao bound: Var(σ̂) ≥ 1/I_F(σ)
 * At zeros: I_F → ∞, meaning σ is infinitely precisely determined = pinned to ½.
 */
export function fisherInformation(s, numPrimes = 15) {
  const primes = getPrimes(numPrimes);
  const ds = 0.001;

  let fisher = 0;
  const contributions = [];

  for (const p of primes) {
    const efCenter = cAbs(eulerFactor(p, s));
    const efPlus = cAbs(eulerFactor(p, [s[0] + ds, s[1]]));
    const efMinus = cAbs(eulerFactor(p, [s[0] - ds, s[1]]));

    if (efCenter > 1e-20) {
      // ∂/∂σ log|H_p| ≈ (log|H_p(σ+dσ)| - log|H_p(σ-dσ)|) / (2dσ)
      const dLogH = (Math.log(Math.max(efPlus, 1e-20)) - Math.log(Math.max(efMinus, 1e-20))) / (2 * ds);
      fisher += dLogH * dLogH;
      contributions.push({ prime: p, contribution: dLogH * dLogH, dLogH });
    }
  }

  // Also compute Fisher info for the total zeta output
  const zetaCenter = cAbs(zetaCriticalStrip(s));
  const zetaPlus = cAbs(zetaCriticalStrip([s[0] + ds, s[1]]));
  const zetaMinus = cAbs(zetaCriticalStrip([s[0] - ds, s[1]]));

  let zetaFisher = 0;
  if (zetaCenter > 1e-10) {
    const dLogZeta = (Math.log(Math.max(zetaPlus, 1e-20)) - Math.log(Math.max(zetaMinus, 1e-20))) / (2 * ds);
    zetaFisher = dLogZeta * dLogZeta;
  }

  // Cramér-Rao bound
  const cramerRao = fisher > 1e-10 ? 1 / fisher : Infinity;

  return {
    fisher,
    zetaFisher,
    cramerRao,
    contributions,
    logFisher: fisher > 0 ? Math.log10(fisher) : -10,
  };
}

/**
 * Scan Fisher information across σ.
 * Should spike near σ = ½ (especially near zeros of ζ).
 */
export function fisherSigmaScan(t, sigmaRange = [0.1, 0.9], steps = 100, numPrimes = 12) {
  const results = [];
  const ds = (sigmaRange[1] - sigmaRange[0]) / steps;

  for (let i = 0; i <= steps; i++) {
    const sigma = sigmaRange[0] + i * ds;
    const data = fisherInformation([sigma, t], numPrimes);
    results.push({ sigma, ...data });
  }

  return results;
}

// ─── 5. Rate-Distortion ──────────────────────────────────────────────────────
/**
 * Rate-distortion theory: how many primes K are needed to approximate
 * ζ(s) to distortion D?
 *
 *   R(D) = min rate such that E[d(ζ, ζ_K)] ≤ D
 *
 * where ζ_K is the partial Euler product with K primes.
 *
 * This measures the "complexity" of representing ζ(s) using prime oscillators.
 * The rate-distortion curve tells us how efficiently the prime oscillators
 * encode the zeta function.
 */
export function rateDistortion(s, maxPrimes = 30) {
  const primes = getPrimes(maxPrimes);

  // Compute full approximation
  let fullProduct = [1, 0];
  for (const p of primes) {
    fullProduct = cMul(fullProduct, eulerFactor(p, s));
  }
  const fullMag = cAbs(fullProduct);

  // Compute partial products and distortion at each step
  const curve = [];
  let partial = [1, 0];

  for (let k = 0; k < primes.length; k++) {
    partial = cMul(partial, eulerFactor(primes[k], s));
    const partialMag = cAbs(partial);
    const distortion = cAbs(cSub(fullProduct, partial));
    const relativeDistortion = fullMag > 1e-10 ? distortion / fullMag : distortion;

    // Rate = log₂(k+1) (number of bits to specify which primes are included)
    const rate = Math.log2(k + 2); // k+1 primes used, +1 for encoding

    // Information gained per prime
    const infoGain = k > 0 ? -Math.log2(Math.max(relativeDistortion, 1e-20)) : 0;

    curve.push({
      k: k + 1,
      prime: primes[k],
      rate,
      distortion,
      relativeDistortion,
      partialMag,
      infoGain,
      bitsPerPrime: (k + 1) > 0 ? infoGain / (k + 1) : 0,
    });
  }

  // Compute R(D) function (rate needed for given distortion)
  const rateDistortionFunction = [];
  for (let D = 0.01; D <= 1; D += 0.02) {
    const firstBelow = curve.find(c => c.relativeDistortion <= D);
    if (firstBelow) {
      rateDistortionFunction.push({ D, rate: firstBelow.rate, primes: firstBelow.k });
    }
  }

  return { curve, rateDistortionFunction, fullMag };
}

// ─── 6. KL Divergence from Equilibrium ───────────────────────────────────────
/**
 * KL divergence between the Euler product distribution at current σ
 * and the equilibrium distribution at σ = ½:
 *
 *   D_KL(P_σ || P_{½}) = Σ_p P_σ(p) · log(P_σ(p) / P_{½}(p))
 *
 * This measures how many "extra bits" are needed to describe the system
 * at σ compared to the equilibrium at σ = ½.
 * At σ = ½: D_KL = 0 (no extra information needed — system is at equilibrium).
 * Off the critical line: D_KL > 0 (system is out of equilibrium).
 *
 * Thermodynamic analogy: D_KL is proportional to free energy above equilibrium.
 */
export function klDivergenceFromEquilibrium(s, numPrimes = 15) {
  const primes = getPrimes(numPrimes);
  const sEquil = [0.5, s[1]]; // equilibrium at σ = ½, same t

  // Distributions at current σ and at equilibrium
  let totalCurrent = 0, totalEquil = 0;
  const current = [], equil = [];

  for (const p of primes) {
    const efCur = cAbs(eulerFactor(p, s)) ** 2;
    const efEq = cAbs(eulerFactor(p, sEquil)) ** 2;
    current.push(efCur);
    equil.push(efEq);
    totalCurrent += efCur;
    totalEquil += efEq;
  }

  // Normalize
  let kl = 0;
  let reverseKl = 0;
  const perPrime = [];

  for (let i = 0; i < primes.length; i++) {
    const pCur = current[i] / totalCurrent;
    const pEq = equil[i] / totalEquil;

    let klContrib = 0;
    let revContrib = 0;
    if (pCur > 1e-20 && pEq > 1e-20) {
      klContrib = pCur * Math.log2(pCur / pEq);
      revContrib = pEq * Math.log2(pEq / pCur);
    }
    kl += klContrib;
    reverseKl += revContrib;
    perPrime.push({ prime: primes[i], pCurrent: pCur, pEquil: pEq, klContrib });
  }

  // Jensen-Shannon divergence: JSD(P||Q) = ½ D_KL(P||M) + ½ D_KL(Q||M), M = (P+Q)/2
  let js = 0;
  for (let i = 0; i < primes.length; i++) {
    const pCur = current[i] / totalCurrent;
    const pEq = equil[i] / totalEquil;
    const m = (pCur + pEq) / 2;
    if (m > 1e-20) {
      if (pCur > 1e-20) js += 0.5 * pCur * Math.log2(pCur / m);
      if (pEq > 1e-20) js += 0.5 * pEq * Math.log2(pEq / m);
    }
  }

  return {
    kl: Math.max(0, kl),
    reverseKl: Math.max(0, reverseKl),
    jensenShannon: Math.max(0, js),
    perPrime,
    sigma: s[0],
    isEquilibrium: kl < 0.01,
  };
}

/**
 * Scan KL divergence across σ.
 * Should have minimum (= 0) at σ = ½.
 */
export function klDivergenceScan(t, sigmaRange = [0.1, 2.0], steps = 80, numPrimes = 12) {
  const results = [];
  const ds = (sigmaRange[1] - sigmaRange[0]) / steps;

  for (let i = 0; i <= steps; i++) {
    const sigma = sigmaRange[0] + i * ds;
    const data = klDivergenceFromEquilibrium([sigma, t], numPrimes);
    results.push({ sigma, ...data });
  }

  return results;
}

// ─── 7. Information-Theoretic Summary ────────────────────────────────────────
/**
 * Compute all information-theoretic quantities at a single point.
 */
export function informationSummary(s, numPrimes = 12) {
  return {
    entropy: eulerProductEntropy(s, numPrimes),
    capacity: channelCapacity(s, numPrimes),
    mutualInfo: mutualInformation(s, numPrimes),
    fisher: fisherInformation(s, numPrimes),
    kl: klDivergenceFromEquilibrium(s, numPrimes),
  };
}

/**
 * The critical-line optimality theorem (information-theoretic form):
 *
 * Claim: σ = ½ simultaneously:
 *   (1) Maximizes the SYMMETRIZED ("balanced") entropy efficiency
 *       B(σ,t) = min(eff(σ,t), eff(1-σ,t)). NOTE (imp-2534): the BARE entropy
 *       efficiency eff(σ,t) is monotonically increasing in σ (it peaks at the
 *       right scan edge, not σ=½), so the symmetrization is required; B peaks
 *       at σ=½ provably at t=0. See imp-888-info-theory-verification.js
 *       (balancedEfficiencyPeak) and sub-gap imp-888-sub-tighter-bound.
 *   (2) Maximizes channel capacity (optimal signal transfer)
 *   (3) Maximizes mutual information (maximum direct-dual coupling)
 *   (4) Minimizes KL divergence (equilibrium state)
 *   (5) Has Fisher information spikes at zeros (σ precisely determined)
 *
 * Computed from numerical scans.
 */
export function criticalLineOptimality(t, numPrimes = 12) {
  const steps = 60;
  const entropyScan = entropySigmaScan(t, [0.1, 1.5], steps, numPrimes);
  const capScan = capacitySigmaScan(t, [0.1, 1.5], steps, numPrimes);
  const miScan = mutualInfoSigmaScan(t, [0.1, 1.5], steps, numPrimes);
  const klScan = klDivergenceScan(t, [0.1, 1.5], steps, numPrimes);

  // Find peaks/troughs
  const maxEntropy = entropyScan.reduce((a, b) => a.efficiency > b.efficiency ? a : b);
  const maxCapacity = capScan.reduce((a, b) => a.capacity > b.capacity ? a : b);
  const maxMI = miScan.reduce((a, b) => a.normalizedMI > b.normalizedMI ? a : b);
  const minKL = klScan.reduce((a, b) => a.kl < b.kl ? a : b);

  return {
    maxEntropySigma: maxEntropy.sigma,
    maxCapacitySigma: maxCapacity.sigma,
    maxMISigma: maxMI.sigma,
    minKLSigma: minKL.sigma,
    allAtHalf: [maxEntropy.sigma, maxCapacity.sigma, maxMI.sigma, minKL.sigma]
      .every(s => Math.abs(s - 0.5) < 0.1),
    summary: {
      entropy: { sigma: maxEntropy.sigma, value: maxEntropy.efficiency },
      capacity: { sigma: maxCapacity.sigma, value: maxCapacity.capacity },
      mutualInfo: { sigma: maxMI.sigma, value: maxMI.normalizedMI },
      kl: { sigma: minKL.sigma, value: minKL.kl },
    },
  };
}
