/**
 * Prime Oscillator Chain Model
 *
 * Each prime p defines an oscillator with:
 *   - Natural frequency: omega_p = log(p)
 *   - The Euler factor 1/(1 - p^{-s}) acts as a resonator/filter
 *
 * Two ladder networks (direct and dual) connect via a lossless bridge.
 * The critical line Re(s) = 1/2 represents the point of Hamiltonian minimization
 * where the direct and dual ladders are perfectly impedance-matched.
 */

import { getPrimes, primeFrequency } from './primes.js';
import { eulerFactor, cMul, cDiv, cAdd, cSub, cAbs, cExp, cPow } from './zeta.js';

/**
 * Oscillator stage for prime p at complex frequency s.
 * Models as a series LC resonator:
 *   L_p = log(p)  (inductance proportional to prime frequency)
 *   C_p = 1/log(p) (capacitance as inverse)
 *   Resonant frequency: omega_p = 1/sqrt(L*C) = 1 (normalized)
 *   Quality factor depends on Re(s)
 */
export function oscillatorStage(p, s) {
  const omega = primeFrequency(p);
  const L = omega;
  const C = 1 / omega;

  // Impedance of the LC oscillator at complex frequency s = sigma + j*t
  // Z(s) = sL + 1/(sC) = s*log(p) + log(p)/s
  const sL = [s[0] * L, s[1] * L];
  const invSC = cDiv([L, 0], s);
  const Z = cAdd(sL, invSC);

  // Transfer function through this stage (Euler factor interpretation)
  const H = eulerFactor(p, s);

  // Energy stored in this oscillator
  const Hmag = cAbs(H);
  const energy = 0.5 * L * Hmag * Hmag;

  // Resonance analysis
  const resonantFreq = omega;
  const bandwidth = 2 * s[0] * omega; // proportional to sigma
  const Q = resonantFreq / (2 * s[0] || 0.001);

  return {
    prime: p,
    frequency: omega,
    inductance: L,
    capacitance: C,
    impedance: Z,
    transferFunction: H,
    magnitude: Hmag,
    phase: Math.atan2(H[1], H[0]),
    energy,
    Q,
    bandwidth,
    resonantFreq,
  };
}

/**
 * Build the full direct ladder network.
 * Cascade of oscillator stages, one per prime.
 */
export function directLadder(s, numPrimes = 20) {
  const primes = getPrimes(numPrimes);
  const stages = [];
  let cumulativeH = [1, 0];
  let totalEnergy = 0;
  let totalImpedance = [0, 0];

  for (const p of primes) {
    const stage = oscillatorStage(p, s);
    cumulativeH = cMul(cumulativeH, stage.transferFunction);
    totalEnergy += stage.energy;
    totalImpedance = cAdd(totalImpedance, stage.impedance);
    stages.push({
      ...stage,
      cumulativeTransfer: [...cumulativeH],
      cumulativeMagnitude: cAbs(cumulativeH),
      cumulativePhase: Math.atan2(cumulativeH[1], cumulativeH[0]),
    });
  }

  return {
    stages,
    totalTransfer: cumulativeH,
    totalMagnitude: cAbs(cumulativeH),
    totalPhase: Math.atan2(cumulativeH[1], cumulativeH[0]),
    totalEnergy,
    totalImpedance,
  };
}

/**
 * The dual ladder: applies the functional equation transformation s -> 1-s.
 * If the direct ladder computes zeta(s) via Euler product,
 * the dual computes zeta(1-s).
 *
 * The functional equation:
 *   zeta(s) = 2^s * pi^{s-1} * sin(pi*s/2) * Gamma(1-s) * zeta(1-s)
 *
 * encodes the "lossless bridge" connecting the two ladders.
 */
export function dualLadder(s, numPrimes = 20) {
  const sDual = [1 - s[0], -s[1]];
  return directLadder(sDual, numPrimes);
}

/**
 * Lossless bridge factor: the prefactor in the functional equation
 * chi(s) = 2^s * pi^{s-1} * sin(pi*s/2) * Gamma(1-s)
 *
 * This connects direct zeta(s) to dual zeta(1-s):
 *   zeta(s) = chi(s) * zeta(1-s)
 */
export function losslessBridge(s) {
  // Approximate using Stirling for Gamma, exact for the rest
  const twoToS = cPow([2, 0], s);
  const piToSm1 = cPow([Math.PI, 0], [s[0] - 1, s[1]]);

  // sin(pi*s/2)
  const halfPiS = [Math.PI * s[0] / 2, Math.PI * s[1] / 2];
  const sinTerm = cDiv(
    cSub(cExp([halfPiS[1], halfPiS[0]]), cExp([-halfPiS[1], -halfPiS[0]])),
    [0, 2]
  );

  // Gamma(1-s) via Stirling approximation for |s| not too small
  const oneMinusS = [1 - s[0], -s[1]];
  const gammaApprox = stirlingGamma(oneMinusS);

  let chi = cMul(twoToS, piToSm1);
  chi = cMul(chi, sinTerm);
  chi = cMul(chi, gammaApprox);

  // Scattering matrix for the bridge (unitary at sigma = 1/2)
  const chiMag = cAbs(chi);

  return {
    chi,
    magnitude: chiMag,
    phase: Math.atan2(chi[1], chi[0]),
    isUnitary: Math.abs(chiMag - 1) < 0.01,
    reflectionCoeff: Math.abs(1 - chiMag) / (1 + chiMag),
  };
}

/**
 * Stirling approximation for Gamma function at complex argument
 * log(Gamma(z)) ≈ (z - 1/2)*log(z) - z + log(2*pi)/2
 */
function stirlingGamma(z) {
  if (cAbs(z) < 0.5) {
    // Use reflection formula for small z
    // Gamma(z) * Gamma(1-z) = pi / sin(pi*z)
    const oneMinusZ = [1 - z[0], -z[1]];
    const g1mz = stirlingGamma(oneMinusZ);
    const piZ = [Math.PI * z[0], Math.PI * z[1]];
    const sinPiZ = cDiv(
      cSub(cExp([piZ[1], piZ[0]]), cExp([-piZ[1], -piZ[0]])),
      [0, 2]
    );
    return cDiv([Math.PI, 0], cMul(sinPiZ, g1mz));
  }
  const { log, sqrt, PI } = Math;
  const logZ = [log(cAbs(z)), Math.atan2(z[1], z[0])];
  const zMinus = [z[0] - 0.5, z[1]];
  const logGamma = cAdd(
    cSub(cMul(zMinus, logZ), z),
    [log(2 * PI) / 2, 0]
  );
  return cExp(logGamma);
}

/**
 * Hamiltonian of the full system at point s = sigma + it.
 * H = H_direct + H_dual + H_bridge
 *
 * The critical line sigma = 1/2 minimizes the total Hamiltonian
 * because the direct and dual ladders are perfectly matched
 * and the bridge becomes lossless (unitary scattering).
 */
export function systemHamiltonian(s, numPrimes = 20) {
  const direct = directLadder(s, numPrimes);
  const dual = dualLadder(s, numPrimes);
  const bridge = losslessBridge(s);

  // Kinetic energy: from the oscillator motions
  const T = direct.totalEnergy + dual.totalEnergy;

  // Potential energy: impedance mismatch between direct and dual
  const Zdiff = cSub(direct.totalImpedance, dual.totalImpedance);
  const mismatch = cAbs(Zdiff);
  const V = 0.5 * mismatch * mismatch;

  // Bridge coupling energy: deviation from unitarity
  const bridgeDeviation = (1 - bridge.magnitude) ** 2;
  const Vbridge = bridgeDeviation * 100; // scaled

  // Total Hamiltonian
  const H = T + V + Vbridge;

  // Gradient with respect to sigma (for optimization visualization)
  const ds = 0.001;
  const sPlus = [s[0] + ds, s[1]];
  const sMinus = [s[0] - ds, s[1]];
  const directP = directLadder(sPlus, numPrimes);
  const directM = directLadder(sMinus, numPrimes);
  const dualP = dualLadder(sPlus, numPrimes);
  const dualM = dualLadder(sMinus, numPrimes);
  const HP = directP.totalEnergy + dualP.totalEnergy;
  const HM = directM.totalEnergy + dualM.totalEnergy;
  const gradient = (HP - HM) / (2 * ds);

  return {
    total: H,
    kinetic: T,
    potential: V,
    bridgeCoupling: Vbridge,
    gradient,
    direct,
    dual,
    bridge,
    sigma: s[0],
    t: s[1],
    isMinimized: Math.abs(s[0] - 0.5) < 0.01,
  };
}

/**
 * Scan the Hamiltonian along the real axis for fixed t
 * to show minimization at sigma = 1/2
 */
export function hamiltonianSigmaScan(t, sigmaRange = [0.05, 0.95], steps = 50, numPrimes = 15) {
  const points = [];
  const ds = (sigmaRange[1] - sigmaRange[0]) / steps;
  for (let i = 0; i <= steps; i++) {
    const sigma = sigmaRange[0] + i * ds;
    const H = systemHamiltonian([sigma, t], numPrimes);
    points.push({
      sigma,
      total: H.total,
      kinetic: H.kinetic,
      potential: H.potential,
      bridgeCoupling: H.bridgeCoupling,
    });
  }
  return points;
}

/**
 * Compute the full 2D energy landscape
 */
export function energyLandscape(sigmaRange, tRange, resolution = 30, numPrimes = 10) {
  const data = [];
  const ds = (sigmaRange[1] - sigmaRange[0]) / resolution;
  const dt = (tRange[1] - tRange[0]) / resolution;
  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      const sigma = sigmaRange[0] + i * ds;
      const t = tRange[0] + j * dt;
      const direct = directLadder([sigma, t], numPrimes);
      const dual = dualLadder([sigma, t], numPrimes);
      const mismatch = cAbs(cSub(direct.totalImpedance, dual.totalImpedance));
      data.push({
        sigma,
        t,
        directMag: direct.totalMagnitude,
        dualMag: dual.totalMagnitude,
        mismatch,
        energy: direct.totalEnergy + dual.totalEnergy + mismatch * mismatch,
      });
    }
  }
  return { data, resolution, sigmaRange, tRange };
}
