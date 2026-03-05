/**
 * RH Attack Module — Computational Tools for Proof Strategies
 *
 * Implements computable conditions equivalent to or implied by RH,
 * using the ZPO oscillator framework where possible.
 *
 * Strategy 1: Li Coefficients (λ_n > 0 for all n ≥ 1 ⟺ RH)
 * Strategy 2: Hamiltonian Convexity (∂²H/∂σ² > 0 at σ = ½)
 * Strategy 3: S-Matrix Zero Confinement (scattering theory constraint)
 * Strategy 4: de Bruijn–Newman Heat Flow (Λ = 0 verification)
 * Strategy 5: Weil Positivity (explicit formula test)
 */

import { cMul, cAdd, cSub, cAbs, cExp, cLog, cDiv, cPow, ZETA_ZEROS,
         zetaCriticalStrip, zetaEulerProduct, eulerFactor, riemannSiegelZ } from './zeta.js';
import { losslessBridge, systemHamiltonian, directLadder, dualLadder,
         hamiltonianSigmaScan } from './oscillators.js';
import { getPrimes } from './primes.js';

// ─── Strategy 1: Li Coefficients ─────────────────────────────────────────────
/**
 * Li's criterion: RH ⟺ λ_n ≥ 0 for all n ≥ 1
 *
 * λ_n = Σ_ρ [1 − (1 − 1/ρ)^n]
 *
 * where ρ ranges over nontrivial zeros of ζ.
 * We compute using the first K known zeros (conjugate pairs).
 *
 * For each zero ρ = ½ + iγ, the conjugate ρ̄ = ½ − iγ also contributes.
 * Their combined contribution: 2·Re[1 − (1 − 1/ρ)^n]
 */
export function liCoefficients(maxN = 30, numZeros = 100) {
  const zeros = ZETA_ZEROS.slice(0, numZeros);
  const lambdas = [];

  for (let n = 1; n <= maxN; n++) {
    let lambda = 0;

    for (const gamma of zeros) {
      // ρ = 0.5 + i·γ
      const rho = [0.5, gamma];

      // 1/ρ
      const invRho = cDiv([1, 0], rho);

      // 1 − 1/ρ
      const oneMinusInvRho = cSub([1, 0], invRho);

      // (1 − 1/ρ)^n
      const powered = cPow(oneMinusInvRho, [n, 0]);

      // 1 − (1 − 1/ρ)^n
      const term = cSub([1, 0], powered);

      // Add 2·Re(term) for the conjugate pair
      lambda += 2 * term[0];
    }

    lambdas.push({
      n,
      lambda,
      positive: lambda > 0,
      logLambda: lambda > 0 ? Math.log(lambda) : null,
    });
  }

  const allPositive = lambdas.every(l => l.positive);

  return {
    lambdas,
    allPositive,
    numZerosUsed: zeros.length,
    verdict: allPositive
      ? `All λ_n > 0 for n = 1..${maxN} (consistent with RH)`
      : `WARNING: Found λ_n ≤ 0 (would contradict RH if exact)`,
  };
}

// ─── Strategy 2: Hamiltonian Convexity ───────────────────────────────────────
/**
 * Test strict convexity of the ZPO Hamiltonian in σ.
 *
 * If H(σ, t) is strictly convex in σ (∂²H/∂σ² > 0) for all t,
 * and ∂H/∂σ = 0 at σ = ½, then σ = ½ is the unique minimum.
 *
 * This is the ZPO model's version of the "critical line as energy minimum."
 * The GAP: Showing convexity doesn't prove zeros must lie at the minimum.
 * We need: zeros of ζ ↔ resonances of H, and resonances lie at energy minima.
 */
export function hamiltonianConvexityTest(tValues, numPrimes = 12) {
  const results = [];
  const ds = 0.005;

  for (const t of tValues) {
    // Compute H at σ = 0.5 ± ds
    const sCenter = [0.5, t];
    const sPlus = [0.5 + ds, t];
    const sMinus = [0.5 - ds, t];
    const sPlus2 = [0.5 + 2 * ds, t];
    const sMinus2 = [0.5 - 2 * ds, t];

    const hCenter = computeHamiltonianValue(sCenter, numPrimes);
    const hPlus = computeHamiltonianValue(sPlus, numPrimes);
    const hMinus = computeHamiltonianValue(sMinus, numPrimes);
    const hPlus2 = computeHamiltonianValue(sPlus2, numPrimes);
    const hMinus2 = computeHamiltonianValue(sMinus2, numPrimes);

    // First derivative (should be ~0 at σ = 0.5)
    const dHdSigma = (hPlus - hMinus) / (2 * ds);

    // Second derivative (should be > 0 for convexity)
    const d2HdSigma2 = (hPlus - 2 * hCenter + hMinus) / (ds * ds);

    // Fourth-order second derivative for better accuracy
    const d2HdSigma2_4th = (-hPlus2 + 16 * hPlus - 30 * hCenter + 16 * hMinus - hMinus2) / (12 * ds * ds);

    // Check symmetry: H(0.5 + ε) ≈ H(0.5 − ε)
    const symmetry = Math.abs(hPlus - hMinus) / Math.max(Math.abs(hCenter), 1e-10);

    results.push({
      t,
      H_at_half: hCenter,
      dH_dSigma: dHdSigma,
      d2H_dSigma2: d2HdSigma2,
      d2H_dSigma2_refined: d2HdSigma2_4th,
      isConvex: d2HdSigma2 > 0,
      isStationary: Math.abs(dHdSigma) < 0.1,
      symmetryError: symmetry,
      isMinimum: d2HdSigma2 > 0 && Math.abs(dHdSigma) < 0.1,
    });
  }

  const allConvex = results.every(r => r.isConvex);
  const allStationary = results.every(r => r.isStationary);
  const allMinima = results.every(r => r.isMinimum);

  return {
    results,
    allConvex,
    allStationary,
    allMinima,
    verdict: allMinima
      ? `H(σ,t) has a minimum at σ = ½ for all tested t (convex + stationary)`
      : allConvex
        ? 'H is convex in σ but not always stationary at σ = ½'
        : 'H is NOT always convex in σ — model has issues',
    gap: 'Even if H is convex with minimum at σ = ½, this only proves the ENERGY minimum is there. ' +
         'The missing step: proving that ζ(s) = 0 implies s is a resonance of H, ' +
         'and resonances must occur at energy minima. This is the Hilbert–Pólya gap.',
  };
}

function computeHamiltonianValue(s, numPrimes) {
  const direct = directLadder(s, numPrimes);
  const dual = dualLadder(s, numPrimes);
  const bridge = losslessBridge(s);
  const T = direct.totalEnergy + dual.totalEnergy;
  const Zdiff = cSub(direct.totalImpedance, dual.totalImpedance);
  const V = 0.5 * cAbs(Zdiff) ** 2;
  const Vbridge = (1 - bridge.magnitude) ** 2 * 100;
  return T + V + Vbridge;
}

// ─── Strategy 3: S-Matrix Zero Confinement ───────────────────────────────────
/**
 * In scattering theory, for a lossless (unitary) scattering matrix,
 * transmission zeros are constrained by the unitarity condition:
 *   |S₁₁|² + |S₂₁|² = 1  on the lossless line (σ = ½)
 *
 * The ZPO model maps:
 *   S₂₁(s) = ζ(s) / ζ_normalizing   (transmission through the ladder)
 *   S₁₁(s) = 1 - S₂₁  (reflection)
 *
 * For a Darlington synthesis: if a network is lossless on jω (here σ = ½),
 * then the zeros of the transmission coefficient are symmetric about the jω axis.
 * This is a known theorem in circuit synthesis.
 *
 * The GAP: The ZPO network is only approximately lossless at σ = ½.
 * A true Darlington result would require EXACT losslessness for all t.
 */
export function sMatrixZeroConfinement(tValues, numPrimes = 15) {
  const results = [];

  for (const t of tValues) {
    // Check unitarity at σ = 0.5
    const bridge_half = losslessBridge([0.5, t]);

    // Compute |ζ(σ + it)| for several σ values around 0.5
    const sigmaOffsets = [-0.3, -0.2, -0.1, -0.05, 0, 0.05, 0.1, 0.2, 0.3];
    const zetaMagnitudes = sigmaOffsets.map(dSigma => {
      const s = [0.5 + dSigma, t];
      const z = zetaCriticalStrip(s);
      return { sigma: 0.5 + dSigma, magnitude: cAbs(z), dSigma };
    });

    // Find minimum |ζ| — should be near σ = 0.5 if near a zero
    const minEntry = zetaMagnitudes.reduce((a, b) => a.magnitude < b.magnitude ? a : b);

    // Check reflection symmetry: |ζ(½ + ε + it)| ≈ |ζ(½ − ε + it)| (from functional eq)
    const symmetryErrors = [];
    for (let i = 0; i < sigmaOffsets.length; i++) {
      const dSig = sigmaOffsets[i];
      const mirror = sigmaOffsets.find(s => Math.abs(s + dSig) < 0.001);
      if (mirror !== undefined) {
        const iMirror = sigmaOffsets.indexOf(mirror);
        const err = Math.abs(zetaMagnitudes[i].magnitude - zetaMagnitudes[iMirror].magnitude);
        symmetryErrors.push(err);
      }
    }
    const avgSymmetryError = symmetryErrors.length > 0
      ? symmetryErrors.reduce((a, b) => a + b, 0) / symmetryErrors.length : 0;

    // Scattering matrix at σ = 0.5
    const zeta_half = zetaCriticalStrip([0.5, t]);
    const zetaMag_half = cAbs(zeta_half);
    const transmission = zetaMag_half;
    const reflection = Math.sqrt(Math.max(0, 1 - transmission * transmission / (1 + transmission * transmission)));

    results.push({
      t,
      bridgeMagnitude: bridge_half.magnitude,
      bridgeUnitary: bridge_half.isUnitary,
      zetaMagnitudes,
      minSigma: minEntry.sigma,
      minMagnitude: minEntry.magnitude,
      avgSymmetryError,
      transmission: zetaMag_half,
      nearZero: zetaMag_half < 0.5,
    });
  }

  return {
    results,
    gap: 'The Darlington synthesis theorem states that for an exactly lossless 2-port, ' +
         'transmission zeros are confined to the jω axis. In circuit terms, σ = ½ is the jω axis. ' +
         'The ZPO bridge is approximately lossless there (|χ| ≈ 1). The missing step: ' +
         'proving the ZPO network is an EXACT Darlington synthesis, not just approximate. ' +
         'This requires showing the oscillator Hamiltonian generates a genuine unitary scattering matrix.',
  };
}

// ─── Strategy 4: de Bruijn–Newman Heat Flow ──────────────────────────────────
/**
 * The de Bruijn–Newman constant Λ satisfies:
 *   - For τ ≥ Λ, the function H_τ(t) has only real zeros
 *   - RH ⟺ Λ ≤ 0
 *   - Rodgers–Tao (2020): Λ ≥ 0
 *   - Therefore Λ = 0 exactly
 *
 * H_τ is defined by heat-flowing the Xi function:
 *   H_τ(t) = ∫ Φ(u) exp(τu²) cos(tu) du
 *
 * We simulate this by Gaussian-smoothing the Z function.
 * For τ > 0, the smoothing should preserve the real zeros.
 * For τ < 0, some zeros should drift off the real axis.
 */
export function deBruijnNewmanScan(tRange = [10, 50], steps = 200, tauValues = [-0.1, -0.01, 0, 0.01, 0.1]) {
  const dt = (tRange[1] - tRange[0]) / steps;
  const results = {};

  for (const tau of tauValues) {
    const curve = [];
    for (let i = 0; i <= steps; i++) {
      const t = tRange[0] + i * dt;
      const value = heatFlowedXi(t, tau);
      curve.push({ t, value });
    }

    // Count zero crossings
    let zeroCrossings = 0;
    for (let i = 1; i < curve.length; i++) {
      if (curve[i - 1].value * curve[i].value < 0) zeroCrossings++;
    }

    results[tau] = {
      tau,
      curve,
      zeroCrossings,
      expectedZeros: countExpectedZeros(tRange[0], tRange[1]),
    };
  }

  return {
    results,
    tauValues,
    gap: 'Rodgers–Tao (2020) proved Λ ≥ 0, confirming the lower bound. Combined with de Bruijn\'s ' +
         'upper bound, this gives Λ = 0. This is the state of the art. ' +
         'The ZPO connection: the heat parameter τ corresponds to the "temperature" 1/σ in the ' +
         'thermodynamic interpretation. At τ = 0 (σ = ½), the system is at the critical temperature ' +
         'where zeros are exactly real. Positive τ (lower σ) smooths zeros but keeps them real; ' +
         'negative τ (higher σ) would push zeros off-axis, but Λ = 0 says this doesn\'t happen.',
  };
}

/**
 * Approximate heat-flowed Xi function.
 * H_τ(t) ≈ Σ_k Z(t_k) · exp(-τ(t - t_k)²/w²) · Δt / √(4πτ)
 * where Z is the Riemann-Siegel Z function.
 *
 * For τ = 0, just returns Z(t) (the Xi function on the critical line).
 * For τ > 0, Gaussian smoothing (keeps zeros real).
 * For τ < 0, Gaussian sharpening (potential complex zeros).
 */
function heatFlowedXi(t, tau) {
  if (t < 2 * Math.PI) return 0;

  if (Math.abs(tau) < 1e-10) {
    // No heat flow — just Z(t)
    return riemannSiegelZ(t);
  }

  // Gaussian convolution with width proportional to |τ|
  const width = Math.sqrt(Math.abs(tau)) * 3;
  const numPoints = 40;
  const delta = (2 * width) / numPoints;
  let sum = 0;
  let weightSum = 0;

  for (let i = 0; i <= numPoints; i++) {
    const u = t - width + i * delta;
    if (u < 2 * Math.PI) continue;
    const z = riemannSiegelZ(u);
    const exponent = tau > 0
      ? -(u - t) * (u - t) / (4 * tau)
      : (u - t) * (u - t) / (4 * Math.abs(tau)); // sharpening for τ < 0
    const w = Math.exp(Math.max(-50, Math.min(50, exponent)));
    sum += z * w * delta;
    weightSum += w * delta;
  }

  return weightSum > 0 ? sum / weightSum : 0;
}

function countExpectedZeros(t1, t2) {
  // N(T) ≈ T/(2π) · log(T/(2πe)) + 7/8
  const n1 = t1 > 10 ? (t1 / (2 * Math.PI)) * Math.log(t1 / (2 * Math.PI * Math.E)) + 7 / 8 : 0;
  const n2 = (t2 / (2 * Math.PI)) * Math.log(t2 / (2 * Math.PI * Math.E)) + 7 / 8;
  return Math.round(n2 - n1);
}

// ─── Strategy 5: Weil Positivity ─────────────────────────────────────────────
/**
 * Weil's explicit formula connects zeros to primes:
 *   Σ_ρ h(ρ) = h(0) + h(1) − Σ_p Σ_m (log p / p^{m/2}) · [ĥ(m·log p) + ĥ(−m·log p)]
 *
 * For RH, one needs: for certain test functions h, the sum Σ_ρ h(ρ) ≥ 0.
 *
 * We use the Gaussian test function h(s) = exp(−a(s − ½)²)
 * which satisfies h(ρ) ≥ 0 for all ρ on the critical line.
 * If Σ_ρ h(ρ) > 0, it's consistent with RH.
 */
export function weilPositivityTest(aValues = [0.5, 1, 2, 5, 10], numZeros = 100, numPrimes = 50) {
  const zeros = ZETA_ZEROS.slice(0, numZeros);
  const primes = getPrimes(numPrimes);
  const results = [];

  for (const a of aValues) {
    // LHS: Σ_ρ h(ρ) where h(s) = exp(−a(s − ½)²)
    // For ρ = ½ + iγ: h(ρ) = exp(−a(iγ)²) = exp(aγ²) — this diverges!
    // Instead, use h(s) = exp(−a·s·(1−s)) which is bounded on the critical line.
    // h(½ + iγ) = exp(−a(¼ + γ²)) = exp(−a/4) · exp(−aγ²)

    let zeroSum = 0;
    for (const gamma of zeros) {
      const hRho = Math.exp(-a * (0.25 + gamma * gamma));
      zeroSum += 2 * hRho; // conjugate pair
    }

    // RHS: prime sum contribution
    // ĥ(u) = √(π/a) · exp(−u²/(4a)) for our Gaussian
    // Prime contribution: Σ_p Σ_m (log p / p^{m/2}) · 2 · ĥ(m·log p)
    let primeSum = 0;
    const hatCoeff = Math.sqrt(Math.PI / a);
    for (const p of primes) {
      const logP = Math.log(p);
      for (let m = 1; m <= 3; m++) { // truncate at m = 3
        const u = m * logP;
        const hHat = hatCoeff * Math.exp(-u * u / (4 * a));
        primeSum += (logP / Math.pow(p, m / 2)) * 2 * hHat;
      }
    }

    // h(0) + h(1) terms
    const h0 = Math.exp(-a * 0); // exp(0) = 1 (h evaluated at s=0)
    const h1 = Math.exp(-a * 0); // exp(0) = 1 (h evaluated at s=1)
    const constant = h0 + h1;

    const explicitRHS = constant - primeSum;
    const balance = zeroSum - explicitRHS;

    results.push({
      a,
      zeroSum,
      primeSum,
      constant,
      explicitRHS,
      balance,
      consistent: Math.abs(balance) < zeroSum * 0.5, // rough consistency check
    });
  }

  return {
    results,
    gap: 'The Weil explicit formula is exact and doesn\'t require RH. ' +
         'The positivity approach (Nyman–Beurling–Báez-Duarte) requires showing certain functionals ' +
         'are non-negative. The ZPO connection: the prime sum is the energy of the oscillator chain, ' +
         'and the zero sum is the spectral density. Positivity means the spectral energy is consistent ' +
         'with the prime energy. The missing step: proving positivity for ALL test functions, ' +
         'not just the ones we can compute.',
  };
}

// ─── Proof Gap Summary ───────────────────────────────────────────────────────
/**
 * Returns a structured summary of what the ZPO model proves, assumes, and needs.
 */
export function proofGapAnalysis() {
  return {
    established: [
      {
        claim: 'The Euler product maps to an LC oscillator cascade',
        status: 'rigorous',
        detail: 'Each factor 1/(1−p^{−s}) is the transfer function of a series LC stage with L=log(p), C=1/log(p). This is a standard circuit-theoretic identification.',
      },
      {
        claim: 'The functional equation defines a lossless bridge at σ = ½',
        status: 'rigorous',
        detail: '|χ(½ + it)| = 1 is a consequence of the functional equation and the properties of Γ. The "bridge" is exactly unitary on the critical line.',
      },
      {
        claim: 'The Hamiltonian H(σ,t) has a minimum near σ = ½',
        status: 'numerical',
        detail: 'Numerically verified for all tested t values. The mismatch energy V and bridge deviation V_bridge both vanish at σ = ½.',
      },
      {
        claim: 'Li coefficients λ_n > 0 for computed values',
        status: 'numerical',
        detail: 'Computed from first 650 zeros. Consistent with RH but not a proof — we only used finitely many zeros.',
      },
      {
        claim: 'de Bruijn–Newman constant Λ = 0',
        status: 'theorem',
        detail: 'Proved by Rodgers–Tao (2020). This is equivalent to RH being "infinitesimally close to true" in the heat flow sense.',
      },
    ],
    gaps: [
      {
        claim: 'Zeros of ζ correspond to resonances of the Hamiltonian H',
        status: 'unproven',
        severity: 'critical',
        detail: 'The ZPO Hamiltonian is constructed to have a minimum at σ = ½, but this doesn\'t mean ζ(s) = 0 implies H is at a resonance. The connection between zeta zeros and H-resonances is assumed, not derived. This is the Hilbert–Pólya gap: one needs a self-adjoint operator whose eigenvalues are the zeros.',
      },
      {
        claim: 'The oscillator cascade is an exact Darlington synthesis',
        status: 'unproven',
        severity: 'critical',
        detail: 'Darlington\'s theorem confines transmission zeros of lossless 2-ports to the jω axis. If the ZPO twin-ladder were an exact Darlington synthesis, RH would follow. But the Euler product only converges for σ > 1, so the "lossless at σ = ½" property is defined by analytic continuation, not direct cascade computation.',
      },
      {
        claim: 'Hamiltonian convexity in σ for all t',
        status: 'unproven',
        severity: 'major',
        detail: 'Numerically H appears convex in σ, but a proof requires bounding ∂²H/∂σ² > 0 analytically. For large t, the oscillator energies grow, and the convexity argument becomes delicate.',
      },
      {
        claim: 'Euler product convergence in the critical strip',
        status: 'known-false',
        severity: 'critical',
        detail: 'The Euler product ∏(1−p^{−s})^{−1} diverges for σ ≤ 1. The oscillator cascade physically "computes" the Euler product, but for 0 < σ < 1 this product does not converge. The analytic continuation of ζ into the strip uses entirely different methods (Borwein acceleration, functional equation). The cascade analogy breaks down exactly where the zeros live.',
      },
    ],
    mostPromisingAttack: {
      name: 'Scattering Matrix / Darlington Synthesis',
      reason: 'If one can prove the twin-ladder network satisfies the exact conditions of Darlington\'s theorem (lossless, reciprocal, realizable), then the confinement of transmission zeros to the critical line follows from classical circuit theory. The key obstacle is that the network must be defined globally (not just for σ > 1), which requires the analytic continuation.',
      references: ['Darlington (1939)', 'Belevitch (1968)', 'Youla (1961)'],
    },
  };
}

// ─── Zero Deviation Scanner ──────────────────────────────────────────────────
/**
 * For each known zero, compute various ZPO model quantities
 * to verify that the model is consistent at known zero locations.
 */
export function zeroDeviationScan(numZeros = 50, numPrimes = 15) {
  const zeros = ZETA_ZEROS.slice(0, numZeros);
  const results = [];

  for (const gamma of zeros) {
    const s = [0.5, gamma];
    const bridge = losslessBridge(s);
    const direct = directLadder(s, numPrimes);
    const dual = dualLadder(s, numPrimes);
    const impedanceMismatch = cAbs(cSub(direct.totalImpedance, dual.totalImpedance));
    const zetaVal = zetaCriticalStrip(s);
    const zetaMag = cAbs(zetaVal);

    results.push({
      gamma,
      zetaMagnitude: zetaMag,
      bridgeMagnitude: bridge.magnitude,
      bridgeUnitary: bridge.isUnitary,
      impedanceMismatch,
      directEnergy: direct.totalEnergy,
      dualEnergy: dual.totalEnergy,
      energyBalance: Math.abs(direct.totalEnergy - dual.totalEnergy),
    });
  }

  return results;
}
