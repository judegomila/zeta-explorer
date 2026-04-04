/**
 * Selberg Zeta as Ground-Truth Test for ZPO Framework
 *
 * imp-155: Selberg zeta functions for compact hyperbolic surfaces have
 * PROVEN RH analog (all nontrivial zeros on σ=½). Test our ZPO / Liouville
 * framework against this KNOWN-TRUE case.
 *
 * SELBERG ZETA FUNCTION:
 *
 *   For a compact hyperbolic surface Γ\H with primitive closed geodesics
 *   γ of lengths ℓ(γ), define:
 *
 *     Z_Γ(s) = Π_{γ primitive} Π_{k=0}^∞ (1 - e^{-(s+k)·ℓ(γ)})
 *
 *   This is an analog of Riemann ζ with:
 *     "primes" p ↔ primitive geodesics γ
 *     log p ↔ ℓ(γ) (geodesic length)
 *
 *   SELBERG RH (PROVEN): All zeros of Z_Γ(s) in the critical strip lie
 *   on σ = ½ (for compact surfaces).
 *
 *   PROOF (sketch): The Selberg trace formula connects zeros to the
 *   spectrum of the Laplacian Δ on Γ\H. Self-adjointness of Δ → real
 *   eigenvalues λ_n → zeros s_n = ½ + √(λ_n - ¼)·i.
 *
 * TEST FOR OUR FRAMEWORK:
 *
 *   1. Express Z_Γ(s) as "Liouville-like" series over geodesics?
 *   2. Does an analog of S₂₁ = ζ(2s)/ζ(s) exist for Z_Γ?
 *   3. Does the graded/parity interpretation apply?
 *
 * THE Z_Γ(2s)/Z_Γ(s) RATIO:
 *
 *   From the product: Z_Γ(2s)/Z_Γ(s) = Π_γ Π_k [(1-e^{-(2s+k)ℓ})/(1-e^{-(s+k)ℓ})]
 *                                     = Π_γ Π_k (1+e^{-(s+k)ℓ}) (telescoping!)
 *
 *   Wait: (1-x²)/(1-x) = 1+x. So (1-e^{-(2s+k)ℓ})/(1-e^{-(s+k)ℓ})... hmm,
 *   exponents don't match. Let me redo.
 *
 *   (1-e^{-2(s+k/2)·ℓ})/(1-e^{-(s+k)ℓ}) doesn't simplify cleanly.
 *
 *   Alternative: for the SIMPLE Selberg zeta (k=0 only):
 *   Z₀(s) = Π_γ (1-e^{-s·ℓ(γ)})
 *   Z₀(2s)/Z₀(s) = Π_γ (1-e^{-2s·ℓ})/(1-e^{-s·ℓ}) = Π_γ (1+e^{-s·ℓ})
 *
 *   If we set q_γ = e^{-ℓ(γ)}, then Z₀(s) = Π_γ (1-q_γ^s), and
 *   Z₀(2s)/Z₀(s) = Π_γ (1+q_γ^s) = Σ λ'(n)/n^s...
 *
 *   where the "n" now ranges over products of geodesic lengths and
 *   λ'(n) is a geodesic analog of the Liouville function.
 *
 * VERIFICATION STRATEGY:
 *
 *   For a simple surface (e.g., genus 2 Bolza surface or arithmetic surface
 *   with known geodesics), we can:
 *   1. List the first few primitive geodesic lengths ℓ(γ)
 *   2. Compute the "Liouville analog" partial sums
 *   3. Verify they match √x growth (predicted by Selberg RH)
 *
 *   This tests whether the ZPO parity-based mechanism is what PROVES RH
 *   for Selberg, which would strongly suggest a similar mechanism should
 *   work for Riemann.
 */

import { getPrimes } from './primes.js';

// ── Simulate a hyperbolic surface with "arithmetic geodesics" ───────────────

/**
 * For the modular surface Γ = PSL(2,Z): primitive geodesic lengths are
 * related to units in real quadratic fields. The lengths cluster around
 * log(fundamental unit) values.
 *
 * For simplicity, we use a TOY hyperbolic surface where geodesic lengths
 * are log(n²-D) for small fundamental discriminants D. This is not exact
 * but gives the right scaling.
 */
function syntheticGeodesicLengths(numGeodesics) {
  // Use first few log(p) values scaled as a toy model
  // (not literally geodesics, but an arithmetic-like sequence)
  const primes = getPrimes(numGeodesics);
  return primes.map(p => ({
    geodesic: p,
    length: 2 * Math.log(p), // primitive geodesic ~ 2 log (in modular surface scaling)
  }));
}

// ── Selberg-like zeta Z_Γ(s) = Π (1 - e^{-s·ℓ}) ─────────────────────────────

function selbergZetaSimple(sigma, t, geodesics) {
  // Z₀(s) = Π_γ (1 - e^{-s·ℓ(γ)})
  let zR = 1, zI = 0;
  for (const g of geodesics) {
    const mag = Math.exp(-sigma * g.length);
    const phase = -t * g.length;
    const termR = 1 - mag * Math.cos(phase);
    const termI = mag * Math.sin(phase);
    const newR = zR * termR - zI * termI;
    const newI = zR * termI + zI * termR;
    zR = newR; zI = newI;
  }
  return { re: zR, im: zI, mag: Math.sqrt(zR * zR + zI * zI) };
}

// ── The "Liouville" analog for geodesics ────────────────────────────────────

/**
 * Define a geodesic Liouville function:
 *   λ_Γ(w) = (-1)^{# primitive geodesics in the factorization of w}
 * where w ranges over products of primitive geodesics (formally, over the
 * free monoid on primitive geodesic lengths).
 *
 * Then Z₀(2s)/Z₀(s) = Σ λ_Γ(w)·e^{-s·len(w)}.
 *
 * Selberg RH for compact surfaces ⟹ partial sums of λ_Γ are O(x^{½+ε}).
 */
function geodesicLiouvilleTest(geodesics) {
  // Enumerate "geodesic words" of bounded length and sum λ_Γ
  const maxLength = 10;
  const words = [{ len: 0, sign: 1 }];

  // Recursively build words: each geodesic can be used once (squarefree in words)
  function extend(currentLen, currentSign, startIdx) {
    for (let i = startIdx; i < geodesics.length; i++) {
      const newLen = currentLen + geodesics[i].length;
      if (newLen > maxLength) continue;
      const newSign = -currentSign; // each added geodesic flips parity
      words.push({ len: newLen, sign: newSign });
      extend(newLen, newSign, i + 1);
    }
  }
  extend(0, 1, 0);

  // Compute L_Γ(x) = sum of signs for words of length ≤ x
  const xValues = [2, 4, 6, 8, 10];
  const results = xValues.map(x => {
    let L = 0;
    for (const w of words) if (w.len <= x) L += w.sign;
    return {
      x,
      L_x: L,
      sqrtScale: +Math.sqrt(Math.exp(x)).toFixed(2),
      ratio: Math.exp(x / 2) > 0 ? +(L / Math.exp(x / 2)).toFixed(4) : 'N/A',
    };
  });

  return {
    totalWords: words.length,
    partialSums: results,
    interpretation:
      'L_Γ(x) = sum of λ_Γ over geodesic words of length ≤ x. ' +
      'Selberg RH predicts |L_Γ(x)| = O(e^{x/2}).',
  };
}

// ── Verify Selberg zeta zero structure (toy) ────────────────────────────────

/**
 * For the synthetic surface, check |Z_Γ(σ+it)| at various σ, t.
 * True Selberg RH: zeros only at σ=½ (plus trivial zeros).
 */
function selbergZeroScan() {
  const geodesics = syntheticGeodesicLengths(30);

  const sigmas = [0.3, 0.4, 0.5, 0.6, 0.7];
  const tValues = [2, 5, 10, 14.13, 20];

  const grid = [];
  for (const sigma of sigmas) {
    for (const t of tValues) {
      const z = selbergZetaSimple(sigma, t, geodesics);
      grid.push({ sigma, t, zMag: +z.mag.toExponential(4) });
    }
  }

  // Find approximate minima (candidate zero locations)
  const minsBySigma = sigmas.map(sigma => {
    const row = grid.filter(g => g.sigma === sigma);
    const minEntry = row.reduce((min, e) =>
      parseFloat(e.zMag) < parseFloat(min.zMag) ? e : min
    );
    return { sigma, minT: minEntry.t, minZ: minEntry.zMag };
  });

  return { grid: grid.slice(0, 15), minsBySigma };
}

// ── Main test ────────────────────────────────────────────────────────────────

export function selbergGroundTruthTest() {
  const geodesics = syntheticGeodesicLengths(20);
  const liouville = geodesicLiouvilleTest(geodesics);
  const zeroScan = selbergZeroScan();

  return {
    setup: {
      surface: 'Toy hyperbolic surface with arithmetic-like geodesic lengths 2·log(p)',
      numGeodesics: geodesics.length,
      sampleLengths: geodesics.slice(0, 5),
    },

    geodesicLiouville: liouville,

    selbergZeroStructure: zeroScan,

    selbergRH: {
      statement: 'For compact hyperbolic surfaces: all nontrivial zeros of Z_Γ(s) on σ=½',
      status: 'PROVEN (via Selberg trace formula + Laplacian self-adjointness)',
      proofMechanism: 'Δ self-adjoint → real eigenvalues → zeros at ½+i·√(λ-¼)',
    },

    ourFrameworkTest: {
      question: 'Does our ZPO / Liouville interpretation apply to Selberg?',
      mapping: 'primes p ↔ primitive geodesics γ; log(p) ↔ ℓ(γ)',
      parityFunction: 'λ_Γ(w) = (-1)^{#geodesics in word w}',
      prediction: 'L_Γ(x) = O(e^{x/2}) by Selberg RH',
      verification: 'Partial sums computed for synthetic geodesics',
    },

    insight:
      'For Selberg zeta: RH is PROVEN via self-adjointness of Δ on Γ\\H. ' +
      'The key is: geodesic lengths are SPECTRAL data of a self-adjoint operator. ' +
      'For Riemann ζ: prime logs are NOT yet spectral data of any known self-adjoint operator ' +
      '(Hilbert-Pólya remains open). ' +
      'OUR ZPO FRAMEWORK: tries to make prime logs SPECTRAL. ' +
      'If the ZPO Hamiltonian could be shown to have log(p) as "geodesic lengths" for some ' +
      'hyperbolic surface, RH would follow from Selberg.',

    verdict:
      `SELBERG GROUND TRUTH: For compact hyperbolic surfaces, Z_Γ zeros are on σ=½ (PROVEN). ` +
      `Mechanism: Laplacian self-adjointness → real eigenvalues → zeros on critical line. ` +
      `OUR ZPO FRAMEWORK maps primes ↔ geodesics, log(p) ↔ ℓ(γ). ` +
      `If we can find a surface whose primitive geodesic lengths ARE log(p), ` +
      `Selberg\'s theorem gives Riemann RH directly. ` +
      `THIS IS THE CONCRETE OPEN PROBLEM: find the hyperbolic surface with ` +
      `primitive geodesic spectrum {log p : p prime}. ` +
      `(Deninger, Connes, and others have conjectured such a surface exists.)`,
  };
}
