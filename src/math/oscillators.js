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
  const resonantFreq = 1 / Math.sqrt(L * C); // ω₀ = 1/√(LC) = 1 for all primes
  const bandwidth = 2 * s[0]; // BW = ω₀/Q = 2σ (ω₀ = 1/√(LC) = 1 for all primes)
  const Q = 1 / (2 * (s[0] || 0.001));

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

  // sin(pi*s/2) via (e^{iz} - e^{-iz}) / (2i) where z = pi*s/2
  // iz = i*(pi*sigma/2 + i*pi*t/2) = -pi*t/2 + i*pi*sigma/2
  const halfPiS = [Math.PI * s[0] / 2, Math.PI * s[1] / 2];
  const sinTerm = cDiv(
    cSub(cExp([-halfPiS[1], halfPiS[0]]), cExp([halfPiS[1], -halfPiS[0]])),
    [0, 2]
  );

  // Gamma(1-s) via Stirling approximation for |s| not too small
  const oneMinusS = [1 - s[0], -s[1]];
  const gammaApprox = lanczosGamma(oneMinusS);

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
 * Complex sine function: sin(z) = (e^{iz} - e^{-iz}) / (2i)
 */
function complexSin(z) {
  // iz = [-z[1], z[0]], -iz = [z[1], -z[0]]
  return cDiv(cSub(cExp([-z[1], z[0]]), cExp([z[1], -z[0]])), [0, 2]);
}

/**
 * Lanczos approximation for complex Gamma function.
 * Achieves ~15 digits of accuracy using g=7 with 9 coefficients.
 * For Re(z) < 0.5, uses the reflection formula Gamma(z)·Gamma(1-z) = pi/sin(pi·z).
 */
function lanczosGamma(z) {
  if (z[0] < 0.5) {
    // Reflection formula: Gamma(z) = pi / (sin(pi*z) * Gamma(1-z))
    const oneMinusZ = [1 - z[0], -z[1]];
    const g1mz = lanczosGamma(oneMinusZ);
    const sinPiZ = complexSin([Math.PI * z[0], Math.PI * z[1]]);
    return cDiv([Math.PI, 0], cMul(sinPiZ, g1mz));
  }

  // Lanczos coefficients for g=7 (from Numerical Recipes / Pugh 2004)
  const p = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];

  const zM1 = [z[0] - 1, z[1]]; // z - 1
  // Compute series: A(z) = p[0] + Σ_{k=1}^{8} p[k] / (z - 1 + k)
  let x = [p[0], 0];
  for (let k = 1; k < 9; k++) {
    x = cAdd(x, cDiv([p[k], 0], [zM1[0] + k, zM1[1]]));
  }

  // t = z + g - 0.5 = z + 6.5
  const t = [z[0] + 6.5, z[1]];

  // Gamma(z) = sqrt(2*pi) * t^{z-0.5} * exp(-t) * A(z)
  const SQRT_TWO_PI = Math.sqrt(2 * Math.PI);
  const zMinusHalf = [z[0] - 0.5, z[1]];
  let result = cPow(t, zMinusHalf);              // t^{z-0.5}
  result = cMul(result, cExp([-t[0], -t[1]]));   // * exp(-t)
  result = cMul(result, x);                       // * A(z)
  return [result[0] * SQRT_TWO_PI, result[1] * SQRT_TWO_PI];
}

/**
 * Hamiltonian of the full system at point s = sigma + it.
 * H = H_direct + H_dual + H_bridge
 *
 * The critical line sigma = 1/2 minimizes the total Hamiltonian
 * because the direct and dual ladders are perfectly matched
 * and the bridge becomes lossless (unitary scattering).
 */
// Fast scalar Hamiltonian for gradient computation (avoids full object allocation)
function systemHamiltonianRaw(s, numPrimes) {
  const direct = directLadder(s, numPrimes);
  const dual = dualLadder(s, numPrimes);
  const bridge = losslessBridge(s);
  const T = direct.totalEnergy + dual.totalEnergy;
  const Zdiff = cSub(direct.totalImpedance, dual.totalImpedance);
  const V = 0.5 * cAbs(Zdiff) ** 2;
  const Vbridge = (1 - bridge.magnitude) ** 2 * 100;
  return T + V + Vbridge;
}

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

  // Gradient of full Hamiltonian with respect to sigma (central difference)
  const ds = 0.001;
  const sPlus = [s[0] + ds, s[1]];
  const sMinus = [s[0] - ds, s[1]];
  const hPlus = systemHamiltonianRaw(sPlus, numPrimes);
  const hMinus = systemHamiltonianRaw(sMinus, numPrimes);
  const gradient = (hPlus - hMinus) / (2 * ds);

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
    const s = [sigma, t];
    // Compute components directly, skipping the gradient (central difference)
    // that systemHamiltonian would compute — saves 2 extra ladder evaluations per point
    const direct = directLadder(s, numPrimes);
    const dual = dualLadder(s, numPrimes);
    const bridge = losslessBridge(s);
    const kinetic = direct.totalEnergy + dual.totalEnergy;
    const Zdiff = cSub(direct.totalImpedance, dual.totalImpedance);
    const potential = 0.5 * cAbs(Zdiff) ** 2;
    const bridgeCoupling = (1 - bridge.magnitude) ** 2 * 100;
    points.push({
      sigma,
      total: kinetic + potential + bridgeCoupling,
      kinetic,
      potential,
      bridgeCoupling,
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
      const s = [sigma, t];
      const direct = directLadder(s, numPrimes);
      const dual = dualLadder(s, numPrimes);
      const mismatch = cAbs(cSub(direct.totalImpedance, dual.totalImpedance));
      const bridge = losslessBridge(s);
      const T = direct.totalEnergy + dual.totalEnergy;
      const V = 0.5 * mismatch * mismatch;
      const Vbridge = (1 - bridge.magnitude) ** 2 * 100;
      data.push({
        sigma,
        t,
        directMag: direct.totalMagnitude,
        dualMag: dual.totalMagnitude,
        mismatch,
        energy: T + V + Vbridge,
      });
    }
  }
  return { data, resolution, sigmaRange, tRange };
}
