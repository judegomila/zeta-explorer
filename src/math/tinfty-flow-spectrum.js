/**
 * Spectrum of the T^∞ Flow Generator
 *
 * imp-160: Compute the spectrum of the generator ∂ = d/dt of the abelian
 * flow on T^∞ = Π S¹_{log p} and check if it encodes ζ-zeros.
 *
 * THE OPERATOR:
 *
 *   The flow Φ_t(ω_1, ω_2, ...) = (ω_1+t, ω_2+t, ...).
 *   Generator: ∂ = d/dt = Σ_k ∂/∂ω_k (sum of partial derivatives).
 *
 *   Acts on L²(T^∞) = L²(S¹_{log 2}) ⊗ L²(S¹_{log 3}) ⊗ ...
 *
 *   Fourier basis on S¹_{log p}: e_{n_p}(ω_p) = exp(i·(2π n_p/log p)·ω_p), n_p ∈ ℤ.
 *
 *   Tensor product basis: e_{n_1} ⊗ e_{n_2} ⊗ ... where n = (n_1, n_2, ...) ∈ ℤ^∞.
 *
 *   Action of ∂ on this basis:
 *     ∂ e_n = i·(Σ_k (2π n_k/log p_k)) · e_n
 *
 *   So ∂ is DIAGONAL in the Fourier basis, with eigenvalues:
 *     λ(n) = i·(2π·Σ_k n_k/log p_k)
 *
 *   Or, dividing by i: "frequency" spectrum
 *     ω(n) = 2π·Σ_k (n_k/log p_k)  (real numbers)
 *
 * RELATION TO INTEGERS:
 *
 *   A multi-index n = (n_1, n_2, ...) with n_k ∈ ℤ corresponds to an integer m
 *   via m = Π p_k^{n_k} (positive or negative exponents give rationals).
 *
 *   For POSITIVE integers m = Π p_k^{n_k}: log(m) = Σ n_k · log(p_k).
 *   The flow eigenvalue is 2π·Σ n_k/log p_k — NOT log(m), but DUAL to it
 *   under Pontryagin duality.
 *
 * IS THIS THE HILBERT-PÓLYA SPECTRUM?
 *
 *   Eigenvalues: {2π·Σ n_k/log p_k : n ∈ ℤ^∞}.
 *   These are dense in ℝ (by Kronecker-Weyl).
 *   They do NOT directly correspond to ζ-zeros.
 *
 *   The ζ-zeros are at specific real t-values (14.1347, 21.0220, ...).
 *   These do NOT arise as Σ n_k/log p_k for simple integer vectors.
 *
 *   So: the NAÏVE flow generator on T^∞ does NOT have ζ-zeros as spectrum.
 *   It has a DIFFERENT (denser) spectrum.
 *
 * WHAT'S NEEDED FOR HILBERT-PÓLYA:
 *
 *   We need a MODIFIED operator whose spectrum IS {t_n : ζ(½+it_n) = 0}.
 *   Options:
 *
 *   1. PROJECT the flow onto a specific SUBSPACE (e.g., cuspidal functions).
 *   2. REGULARIZE the spectrum (removing zero modes, etc.).
 *   3. Use a DIFFERENT Hamiltonian built from T^∞ (e.g., position operator).
 *   4. Consider the DUAL (Pontryagin) formulation with integer basis.
 *
 * CONNECTION TO CONNES' ADELIC FLOW:
 *
 *   Connes' approach (1999): use the ADELE ring A = ℝ × Π_p ℚ_p, quotient by ℚ.
 *   Construct a Hilbert space and flow whose spectrum IS the ζ-zeros.
 *
 *   This is FAR more sophisticated than the naïve T^∞ flow:
 *   - Uses p-adic numbers, not just S¹_{log p}.
 *   - Includes the "place at infinity" (real numbers).
 *   - The flow is dilation, not translation.
 *
 *   The T^∞ flow (our imp-159) is a SIMPLIFIED version that gives the Euler
 *   product but not the zeros.
 */

import { getPrimes } from './primes.js';
import { ZETA_ZEROS } from './zeta.js';

// ── Compute flow generator eigenvalues ──────────────────────────────────────

/**
 * Enumerate eigenvalues ω(n) = 2π·Σ n_k/log p_k for small n_k.
 */
function flowEigenvalues(numPrimes, maxAbsN) {
  const primes = getPrimes(numPrimes);
  const invLogP = primes.map(p => 2 * Math.PI / Math.log(p));

  const eigenvalues = [];

  // Enumerate integer vectors with Σ|n_k| ≤ maxAbsN (finite support)
  function enumerate(index, current, nonZeroCount) {
    if (index >= numPrimes || nonZeroCount >= maxAbsN) {
      // Compute eigenvalue
      const omega = current.reduce((sum, n_k, k) => sum + n_k * invLogP[k], 0);
      if (omega !== 0) eigenvalues.push(omega);
      return;
    }
    for (let n_k = -maxAbsN; n_k <= maxAbsN; n_k++) {
      current[index] = n_k;
      if (Math.abs(n_k) + nonZeroCount <= maxAbsN) {
        enumerate(index + 1, current, nonZeroCount + Math.abs(n_k));
      }
      current[index] = 0;
    }
  }

  // Simplified: only consider vectors with at most 2 nonzero components
  for (let i = 0; i < numPrimes; i++) {
    for (let n_i = -maxAbsN; n_i <= maxAbsN; n_i++) {
      if (n_i === 0) continue;
      eigenvalues.push(n_i * invLogP[i]);
      for (let j = i + 1; j < numPrimes; j++) {
        for (let n_j = -maxAbsN; n_j <= maxAbsN; n_j++) {
          if (n_j === 0) continue;
          eigenvalues.push(n_i * invLogP[i] + n_j * invLogP[j]);
        }
      }
    }
  }

  // Filter to positive, sort, deduplicate
  const positive = eigenvalues.filter(e => e > 0).sort((a, b) => a - b);
  const unique = [];
  for (const e of positive) {
    if (unique.length === 0 || Math.abs(e - unique[unique.length - 1]) > 1e-6) {
      unique.push(e);
    }
  }
  return unique;
}

// ── Compare with ζ-zeros ────────────────────────────────────────────────────

function compareWithZetaZeros(spectrum) {
  const zeros = ZETA_ZEROS.slice(0, 20);
  const comparisons = zeros.map(gamma => {
    // Find nearest spectrum element to γ
    let nearest = spectrum[0] || 0;
    let minDist = Math.abs(spectrum[0] - gamma);
    for (const s of spectrum) {
      const d = Math.abs(s - gamma);
      if (d < minDist) { minDist = d; nearest = s; }
    }
    return { gamma: +gamma.toFixed(4), nearestEigenvalue: +nearest.toFixed(4), distance: +minDist.toFixed(4) };
  });

  const closeMatches = comparisons.filter(c => c.distance < 0.1).length;
  return { comparisons, closeMatches, totalTested: zeros.length };
}

// ── Position operator as alternative ────────────────────────────────────────

/**
 * Alternative: the POSITION operator on T^∞.
 * X_k acts on S¹_{log p_k} by multiplication by ω_k (mod log p_k).
 * The combined position X = (X_1, X_2, ...) has different spectrum.
 * On each circle: X_k has continuous spectrum [0, log p_k).
 *
 * The combined operator Σ X_k: its spectrum fills [0, ∞) continuously.
 * Not discrete, and doesn't directly give ζ-zeros.
 */
function positionOperatorSpectrum() {
  return {
    operator: 'X = Σ X_k where X_k is position on S¹_{log p_k}',
    spectrum: 'Continuous [0, Σ log p_k) = [0, log(primorial))',
    structure: 'Not discrete, not related to ζ-zeros',
    useful: false,
  };
}

// ── Main test ────────────────────────────────────────────────────────────────

export function tInftyFlowSpectrumTest() {
  // Compute flow eigenvalues for small integer vectors
  const spectrum = flowEigenvalues(10, 3);
  const comparison = compareWithZetaZeros(spectrum);
  const position = positionOperatorSpectrum();

  return {
    flowGenerator: {
      definition: '∂ = d/dt = Σ_k ∂/∂ω_k on L²(T^∞)',
      fourierBasis: 'Tensor product of circles S¹_{log p_k}',
      eigenvalues: 'ω(n) = 2π·Σ n_k/log(p_k) for n ∈ ℤ^∞',
      selfAdjoint: true,
      discrete: true,
      denseInR: true, // by Kronecker-Weyl
    },

    spectrum: {
      numComputed: spectrum.length,
      firstTen: spectrum.slice(0, 10).map(s => +s.toFixed(4)),
      note: '2π/log(2) ≈ 9.06, 2π/log(3) ≈ 5.72, 2π/log(5) ≈ 3.90, ...',
    },

    zetaZeroComparison: comparison,
    matchesZetaZeros: comparison.closeMatches > comparison.totalTested * 0.3,

    positionOperatorAttempt: position,

    honestFinding:
      'The FLOW GENERATOR ∂ on L²(T^∞) has spectrum {2π·Σ n_k/log p_k}. ' +
      `Compared with first 20 ζ-zeros: ${comparison.closeMatches} close matches (distance<0.1). ` +
      'This is NOT a direct Hilbert-Pólya spectrum — the values are different from ζ-zeros.',

    interpretation:
      'The naïve T^∞ flow generator gives the DUAL lattice {2π/log p} and its integer ' +
      'combinations. These are related to the primes but DIFFERENT from ζ-zeros. ' +
      'The ζ-zeros are NOT simply linear combinations of 2π/log(p_k). ' +
      'This confirms: the abelian flow on T^∞ gives the Euler product (imp-159) ' +
      'but not the zeros. A MODIFIED or PROJECTED operator is needed.',

    connesPath:
      'Connes (1999) resolved this by using ADELIC structure (including p-adic ' +
      'completions), not just T^∞. The Connes-Meyer-Marcolli adelic Hamiltonian ' +
      'has ζ-zeros as spectrum — but the construction is highly sophisticated.',

    verdict:
      `T^∞ FLOW GENERATOR SPECTRUM: NOT directly ζ-zeros. ` +
      `Eigenvalues are {2π·Σ n_k/log p_k}, which are DIFFERENT from the Riemann zeros. ` +
      `${comparison.closeMatches}/${comparison.totalTested} accidental close matches. ` +
      `The abelian T^∞ flow gives the Euler product (imp-159) but not RH directly. ` +
      `Connes' adelic approach uses richer structure (p-adic places) that DOES give zeros. ` +
      `Our T^∞ framework is the "real place" part of Connes' adelic picture — ` +
      `elegant but incomplete without the p-adic completions.`,
  };
}
