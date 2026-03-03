/**
 * Supercritical and Thermodynamic Analysis of the Zeta Function
 *
 * Extends the oscillator chain model into the supercritical regime (σ > 1)
 * and below the critical strip (σ < 0), using thermodynamic analogies:
 *
 *   Temperature T ↔ σ (Re(s))  — controls convergence/divergence
 *   Pressure P ↔ derived from Euler product density
 *   Free energy F ↔ -log|ζ(s)|
 *   Entropy S ↔ -∂F/∂T
 *
 * The phase transition at σ = 1 (Bost-Connes) separates the
 * convergent "gas" phase from the critical strip "condensed" phase.
 * The critical line σ = 1/2 is where the system achieves equilibrium.
 *
 * Also implements heat flow (de Bruijn-Newman) for the xi function.
 */

import { getPrimes, primeFrequency } from './primes.js';
import {
  cMul, cDiv, cAdd, cSub, cAbs, cExp, cLog, cPow,
  zetaDirichlet, zetaEulerProduct, zetaCriticalStrip, eulerFactor, ZETA_ZEROS,
  riemannSiegelZ,
} from './zeta.js';
import { losslessBridge, oscillatorStage, directLadder, dualLadder } from './oscillators.js';

// ─── Extended Zeta Computation ─────────────────────────────────────────────────

/**
 * Compute zeta in any region using appropriate method:
 *  - σ > 1.5: Dirichlet series (fast convergence)
 *  - 0 < σ ≤ 1.5: Dirichlet eta / critical strip method
 *  - σ ≤ 0: functional equation reflection
 */
export function zetaExtended(s, N = 300) {
  const sigma = s[0];
  if (sigma > 1.5) {
    return zetaDirichlet(s, Math.min(N, 500));
  }
  if (sigma > -0.5) {
    return zetaCriticalStrip(s, N);
  }
  // Use functional equation: ζ(s) = χ(s) · ζ(1-s)
  const s1 = [1 - s[0], -s[1]];
  const zeta1s = zetaCriticalStrip(s1, N);
  const bridge = losslessBridge(s);
  return cMul(bridge.chi, zeta1s);
}

/**
 * Compute |ζ(s)| over an extended sigma range for fixed t
 */
export function zetaMagnitudeScan(t, sigmaRange = [-4, 6], steps = 200) {
  const points = [];
  const ds = (sigmaRange[1] - sigmaRange[0]) / steps;
  for (let i = 0; i <= steps; i++) {
    const sigma = sigmaRange[0] + i * ds;
    const z = zetaExtended([sigma, t]);
    const mag = cAbs(z);
    const phase = Math.atan2(z[1], z[0]);
    const logMag = mag > 0 ? Math.log10(mag) : -10;
    points.push({ sigma, magnitude: mag, logMagnitude: logMag, phase, re: z[0], im: z[1] });
  }
  return points;
}

/**
 * 2D zeta landscape over extended range
 */
export function zetaLandscapeExtended(sigmaRange, tRange, resolution = 40) {
  const data = [];
  const ds = (sigmaRange[1] - sigmaRange[0]) / resolution;
  const dt = (tRange[1] - tRange[0]) / resolution;
  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      const sigma = sigmaRange[0] + i * ds;
      const t = tRange[0] + j * dt;
      const z = zetaExtended([sigma, t]);
      data.push({
        sigma, t,
        magnitude: cAbs(z),
        logMag: Math.log10(Math.max(cAbs(z), 1e-10)),
        phase: Math.atan2(z[1], z[0]),
      });
    }
  }
  return { data, resolution, sigmaRange, tRange };
}

// ─── Thermodynamic Functions ───────────────────────────────────────────────────

/**
 * Primon gas partition function interpretation.
 * ζ(σ) = Σ exp(-σ·log(n)) = Σ n^{-σ} is a partition function
 * with σ = inverse temperature β and E_n = log(n).
 *
 * Temperature = 1/σ (high σ = cold, low σ = hot)
 * The Euler product gives the "ideal gas" decomposition:
 *   log ζ(s) = Σ_p Σ_k p^{-ks}/k = Σ_p log(1/(1-p^{-s}))
 */
export function thermodynamicState(sigma, t, numPrimes = 20) {
  const s = [sigma, t];
  const z = zetaExtended(s);
  const mag = cAbs(z);
  const logZ = cLog(z); // log(partition function)

  // Free energy: F = -T·log(Z) = -(1/σ)·log|ζ(σ+it)|
  const temperature = sigma > 0.01 ? 1 / sigma : 100;
  const freeEnergy = -temperature * logZ[0];

  // Entropy: S = -∂F/∂T = log|ζ| - σ·∂log|ζ|/∂σ
  // Derivation: F = -T·log Z, T = 1/σ, so dF/dT = -log Z + σ·∂(log Z)/∂σ,
  // giving S = -dF/dT = log Z - σ·∂(log Z)/∂σ.
  const ds = 0.01;
  const zPlus = zetaExtended([sigma + ds, t]);
  const zMinus = zetaExtended([sigma - ds, t]);
  const logMagPlus = Math.log(Math.max(cAbs(zPlus), 1e-10));
  const logMagMinus = Math.log(Math.max(cAbs(zMinus), 1e-10));
  const logMagCenter = Math.log(Math.max(mag, 1e-10));
  const dLogZ = (logMagPlus - logMagMinus) / (2 * ds);
  const entropy = logMagCenter - sigma * dLogZ;

  // Pressure from Euler product: P = Σ_p log(1/(1-p^{-σ})) / V
  // where V = Σ_p 1 (number of "sites")
  const primes = getPrimes(numPrimes);
  let pressure = 0;
  let eulerLogSum = 0;
  for (const p of primes) {
    const factor = eulerFactor(p, s);
    const logFactor = Math.log(cAbs(factor));
    eulerLogSum += logFactor;
    // Each prime contributes a "partial pressure"
    pressure += logFactor / numPrimes;
  }

  // Internal energy: U = F + T·S = -∂log(Z)/∂β where β = σ
  const internalEnergy = -dLogZ;

  // Specific heat: C_v = β²·∂²log(Z)/∂β² where β = σ
  // Symmetric second derivative stencil: f''(x) ≈ (f(x+h) - 2f(x) + f(x-h)) / h²
  // Reuse zPlus/zMinus from entropy computation above (same sigma±ds, same t)
  const d2LogZ = (logMagPlus - 2 * logMagCenter + logMagMinus) / (ds * ds);
  const specificHeat = sigma > 0.01 ? d2LogZ * (sigma * sigma) : 0;

  // Phase classification
  let phase = 'critical-strip';
  if (sigma > 1) phase = 'supercritical';
  else if (sigma < 0) phase = 'sub-zero';
  else if (Math.abs(sigma - 0.5) < 0.05) phase = 'critical-line';

  return {
    sigma, t, temperature, freeEnergy, entropy, pressure,
    internalEnergy, specificHeat, phase,
    zetaMag: mag, logZetaMag: Math.log10(Math.max(mag, 1e-10)),
    eulerLogSum,
  };
}

/**
 * Scan thermodynamic quantities across sigma
 */
export function thermodynamicScan(t, sigmaRange = [-2, 4], steps = 100, numPrimes = 15) {
  const points = [];
  const ds = (sigmaRange[1] - sigmaRange[0]) / steps;
  for (let i = 0; i <= steps; i++) {
    const sigma = sigmaRange[0] + i * ds;
    points.push(thermodynamicState(sigma, t, numPrimes));
  }
  return points;
}

// ─── De Bruijn-Newman Heat Flow ────────────────────────────────────────────────

/**
 * The Xi function: Ξ(t) = ξ(1/2 + it) where ξ is the completed zeta.
 * ξ(s) = (1/2)s(s-1)π^{-s/2}Γ(s/2)ζ(s)
 *
 * The heat-evolved family: H_τ(t) satisfies ∂H/∂τ = ∂²H/∂t²
 * At τ=0, H_0(t) = Ξ(t). For τ>0 (forward heat), zeros stay real —
 * de Bruijn proved H_τ has only real zeros for τ ≥ Λ, and Rodgers-Tao
 * showed Λ ≥ 0. For τ<0 (backward heat / inverse diffusion), zeros
 * can scatter off the real line into conjugate pairs.
 *
 * We approximate by tracking how individual zeros evolve:
 * Under heat flow, zeros at positions γ_n repel each other.
 */
export function heatFlowZeros(tau, numZeros = 30) {
  // For small τ, zeros approximately evolve as:
  // γ_n(τ) ≈ γ_n(0) + τ·velocity_n
  // where velocity comes from the repulsive interaction between zeros
  const zeros = ZETA_ZEROS.slice(0, numZeros);
  const evolved = zeros.map((gamma, n) => {
    // Compute repulsive force from other zeros
    let force = 0;
    for (let m = 0; m < zeros.length; m++) {
      if (m === n) continue;
      const diff = gamma - zeros[m];
      if (Math.abs(diff) > 0.01) {
        force += 1 / diff;
      }
    }
    // Under heat flow, zeros spread apart (τ>0) or compress (τ<0)
    const velocity = force / (2 * Math.PI);
    const newGamma = gamma + tau * velocity;

    // For τ < 0 (backward heat / inverse diffusion), zeros acquire imaginary parts
    // (leave the real line), forming conjugate pairs: one goes to σ=0.5+δ, the other to σ=0.5-δ.
    // For τ > 0 (forward heat / smoothing), zeros stay real — de Bruijn proved H_τ has only
    // real zeros for all τ ≥ Λ, and Rodgers-Tao showed Λ ≥ 0, so τ > 0 preserves RH.
    const localDensity = zeros.filter(z => Math.abs(z - gamma) < 5).length / 10;
    const pairSign = n % 2 === 0 ? 1 : -1;
    const sigmaDisplacement = tau < 0 ? Math.abs(tau) * 0.1 * localDensity * pairSign : 0;

    return {
      index: n,
      gamma0: gamma,
      gamma: newGamma,
      sigma: 0.5 + sigmaDisplacement,
      force,
      velocity,
    };
  });
  return evolved;
}

/**
 * Approximate the heat-evolved Xi function value
 * H_τ(t) ≈ Ξ(t) convolved with Gaussian of width √(2τ)
 *
 * For visualization, we compute |H_τ(t)| along the real axis
 */
export function heatEvolvedXi(t, tau, numTerms = 50) {
  // For τ ≤ 0, the backward heat equation (inverse diffusion) is ill-posed and
  // cannot be computed via Gaussian convolution. Return the unsmoothed Z(t)
  // directly as H₀(t) = Ξ(t). Note: τ < 0 is where zeros CAN scatter off the
  // real line; τ ≥ 0 is where Rodgers-Tao (Λ ≥ 0) guarantees they stay real.
  if (tau <= 0) {
    return riemannSiegelZ(t);
  }

  // For τ > 0, approximate H_τ(t) ≈ Ξ(t) convolved with Gaussian of width √(2τ)
  const width = Math.sqrt(2 * tau);

  // Sample Ξ at nearby points and convolve with Gaussian
  const numSamples = numTerms;
  const sampleRange = width * 4;
  let result = 0;
  let normalization = 0;

  for (let i = 0; i < numSamples; i++) {
    const offset = -sampleRange + (2 * sampleRange * i) / (numSamples - 1);
    const tSample = t + offset;
    // Approximate Ξ(t) via the Riemann-Siegel Z function, which is real-valued
    // and has zeros exactly where ζ(½+it) does — unlike Re(ζ), which has different zeros
    const signedVal = riemannSiegelZ(tSample);
    // Gaussian kernel (forward heat equation for τ>0)
    const w = Math.exp(-offset * offset / (2 * width * width));
    result += signedVal * w;
    normalization += w;
  }

  return normalization > 0 ? result / normalization : 0;
}

/**
 * Scan the heat-evolved Xi function over a t range
 */
export function heatFlowScan(tau, tRange = [10, 50], steps = 100) {
  const points = [];
  const dt = (tRange[1] - tRange[0]) / steps;
  for (let i = 0; i <= steps; i++) {
    const t = tRange[0] + i * dt;
    const value = heatEvolvedXi(t, tau);
    points.push({ t, value, tau });
  }
  return points;
}

// ─── Fourier Analysis of Ladder Transfer Function ──────────────────────────────

/**
 * Compute the frequency spectrum of the ladder transfer function.
 * The transfer function H(σ + iω) as a function of ω (for fixed σ)
 * IS the frequency response of the oscillator chain.
 *
 * We sample |∏_p 1/(1-p^{-σ-iω})| for a range of ω values.
 */
export function ladderFrequencyResponse(sigma, omegaRange = [0.1, 80], steps = 200, numPrimes = 15) {
  const primes = getPrimes(numPrimes);
  const points = [];
  const dw = (omegaRange[1] - omegaRange[0]) / steps;

  for (let i = 0; i <= steps; i++) {
    const omega = omegaRange[0] + i * dw;
    const s = [sigma, omega];

    // Compute full transfer function
    let H = [1, 0];
    const perPrime = [];
    for (const p of primes) {
      const factor = eulerFactor(p, s);
      H = cMul(H, factor);
      perPrime.push({
        prime: p,
        magnitude: cAbs(factor),
        phase: Math.atan2(factor[1], factor[0]),
      });
    }

    const magnitude = cAbs(H);
    const magnitudeDb = 20 * Math.log10(Math.max(magnitude, 1e-10));
    const phase = Math.atan2(H[1], H[0]);

    points.push({
      omega, magnitude, magnitudeDb, phase, perPrime,
      logOmega: Math.log10(omega),
    });
  }
  return points;
}

/**
 * Compute the spectral energy density of the oscillator chain.
 * For each frequency ω, measure how much energy is stored in oscillations
 * at that frequency across the direct and dual ladders.
 */
export function spectralEnergyDensity(sigma, omegaRange = [0.1, 80], steps = 150, numPrimes = 15) {
  const points = [];
  const dw = (omegaRange[1] - omegaRange[0]) / steps;

  for (let i = 0; i <= steps; i++) {
    const omega = omegaRange[0] + i * dw;
    const s = [sigma, omega];

    const direct = directLadder(s, numPrimes);
    const dual = dualLadder(s, numPrimes);

    const directEnergy = direct.totalEnergy;
    const dualEnergy = dual.totalEnergy;
    const totalEnergy = directEnergy + dualEnergy;

    // Mismatch at this frequency
    const mismatch = cAbs(cSub(direct.totalImpedance, dual.totalImpedance));

    // Bridge factor
    const bridge = losslessBridge(s);

    points.push({
      omega,
      directEnergy,
      dualEnergy,
      totalEnergy,
      mismatch,
      bridgeMag: bridge.magnitude,
      logOmega: Math.log10(omega),
    });
  }
  return points;
}

/**
 * Compute the "prime harmonic series" — contribution of each prime
 * to the overall frequency response at a given sigma.
 */
export function primeHarmonicDecomposition(sigma, numPrimes = 20) {
  const primes = getPrimes(numPrimes);
  return primes.map(p => {
    const omega = primeFrequency(p); // log(p)
    const harmonics = [];

    // Each prime contributes at frequencies k·log(p) for k=1,2,3,...
    for (let k = 1; k <= 5; k++) {
      const freq = k * omega;
      const s = [sigma, freq];
      const factor = eulerFactor(p, s);
      harmonics.push({
        k,
        frequency: freq,
        magnitude: cAbs(factor),
        phase: Math.atan2(factor[1], factor[0]),
        energy: 0.5 * omega * cAbs(factor) ** 2,
      });
    }

    // Fundamental resonance properties
    const Q = 1 / (2 * (sigma || 0.001));
    const bandwidth = 2 * sigma; // BW = ω₀/Q = 2σ (ω₀ = 1 for all primes)

    return {
      prime: p,
      fundamentalFreq: omega,
      Q,
      bandwidth,
      harmonics,
    };
  });
}

/**
 * Compute the DFT of the von Mangoldt function Λ(n) to reveal
 * the spectral content (should peak at zeta zero locations).
 */
export function vonMangoldtSpectrum(maxN = 500, numFreqs = 200, freqRange = [0, 60]) {
  // Compute Λ(n) for n = 1..maxN
  const lambda = new Float64Array(maxN + 1);
  const primesList = getPrimes(100);
  for (let n = 2; n <= maxN; n++) {
    let found = false;
    for (const p of primesList) {
      if (p * p > n) break;
      if (n % p === 0) {
        let m = n;
        while (m % p === 0) m /= p;
        if (m === 1) { lambda[n] = Math.log(p); }
        found = true;
        break;
      }
    }
    if (!found) {
      // n has no prime factor ≤ √n, so n is prime
      lambda[n] = Math.log(n);
    }
  }

  // Precompute sparse list of non-zero entries with cached log values.
  // This avoids recomputing Math.log(n) for every frequency (saves ~48k log calls
  // with maxN=800, numFreqs=300) and skips zero entries without branching.
  const nonZero = [];
  for (let n = 2; n <= maxN; n++) {
    if (lambda[n] !== 0) {
      nonZero.push({ lambdaN: lambda[n], logN: Math.log(n) });
    }
  }

  // Compute Fourier transform: F(ω) = Σ Λ(n) · e^{-iω·log(n)}
  const spectrum = [];
  const df = (freqRange[1] - freqRange[0]) / numFreqs;
  for (let i = 0; i <= numFreqs; i++) {
    const freq = freqRange[0] + i * df;
    let re = 0, im = 0;
    for (let j = 0; j < nonZero.length; j++) {
      const phase = -freq * nonZero[j].logN;
      re += nonZero[j].lambdaN * Math.cos(phase);
      im += nonZero[j].lambdaN * Math.sin(phase);
    }
    const mag = Math.sqrt(re * re + im * im);
    spectrum.push({ frequency: freq, magnitude: mag, re, im, power: mag * mag });
  }

  return spectrum;
}

// ─── Euler Product Phase Analysis ──────────────────────────────────────────────

/**
 * Analyze the Euler product convergence across the sigma boundary.
 * For σ > 1: product converges (each factor bounded).
 * For σ < 1: product diverges (factors grow).
 * The transition is the phase boundary.
 */
export function eulerProductPhaseAnalysis(t, sigmaRange = [-1, 3], steps = 100, numPrimes = 20) {
  const primes = getPrimes(numPrimes);
  const points = [];
  const ds = (sigmaRange[1] - sigmaRange[0]) / steps;

  for (let i = 0; i <= steps; i++) {
    const sigma = sigmaRange[0] + i * ds;
    const s = [sigma, t];

    let cumMag = 1;
    let logCumMag = 0;
    let maxFactor = 0;
    let converging = true;

    for (const p of primes) {
      const factor = eulerFactor(p, s);
      const fMag = cAbs(factor);
      cumMag *= fMag;
      logCumMag += Math.log(fMag);
      maxFactor = Math.max(maxFactor, fMag);
      if (fMag > 2) converging = false;
    }

    points.push({
      sigma,
      cumulativeMagnitude: cumMag,
      logCumulativeMag: logCumMag,
      maxFactorMag: maxFactor,
      isConverging: converging,
      avgFactorMag: Math.exp(logCumMag / numPrimes),
    });
  }
  return points;
}
