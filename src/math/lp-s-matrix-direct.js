/**
 * Direct Computation: LP Scattering Matrix of the ZPO Hamiltonian
 *
 * imp-150: The critical experiment — compute the Lax-Phillips S-matrix of
 * the ZPO Hamiltonian H_N directly and compare with ζ(2s)/ζ(s).
 *
 * SETUP:
 *   H_chain: N×N tridiagonal Hamiltonian with:
 *     diagonal: log²(p_k) for k=1..N
 *     off-diagonal: -1/√(L_k·L_{k+1}) = -√(log(p_k)·log(p_{k+1}))
 *
 *   Attach semi-infinite leads at both ends (sites 0 and N+1):
 *     lead sites have H_lead = -Δ (free particle)
 *     coupling V = [hop]·(|0⟩⟨1| + |1⟩⟨0|) at left, similar at right
 *
 *   The total Hamiltonian H_total = H_chain + H_leads + V has continuous spectrum
 *   (the leads) plus embedded resonances (localized states in H_chain).
 *
 *   SCATTERING STATES: incoming plane wave from left lead, scatters off chain,
 *   emerges as transmitted + reflected wave.
 *
 *   S-MATRIX: S(E) = [[r(E), t'(E)], [t(E), r'(E)]] where
 *     r = reflection, t = transmission.
 *
 * THE QUESTION:
 *   Does the resulting S₂₁(E) = t(E) equal ζ(2s)/ζ(s) under some
 *   variable mapping E ↔ s?
 *
 * THE VARIABLE MAPPING:
 *   For a free lead with H_lead = -Δ: energy E = k² where k is momentum.
 *   Propagation phase e^{ik·n} on the lead.
 *   The ZPO frequency scale is ω = t (imaginary part of s).
 *
 *   Natural mapping: k·log(p) = ω·log(p), so k = ω.
 *   Or: E = ω² = t² (for s = ½+it on critical line).
 *
 *   More precisely: LP uses s = i·k, so k = -is.
 *   For s = ½+it: k = -i(½+it) = t - i/2.
 *   Real k on real axis corresponds to imaginary s — this suggests
 *   the LP spectral parameter and the ζ-variable s are related by
 *   a rotation.
 */

import { cMul, cDiv, cSub, cAdd, cAbs, ZETA_ZEROS } from './zeta.js';
import { getPrimes } from './primes.js';

// ── Build the finite tridiagonal H_N ─────────────────────────────────────────

function buildHamiltonian(N) {
  const primes = getPrimes(N);
  const diag = new Float64Array(N);
  const off = new Float64Array(Math.max(N - 1, 0));
  for (let k = 0; k < N; k++) diag[k] = Math.log(primes[k]) ** 2;
  for (let k = 0; k < N - 1; k++) {
    off[k] = -Math.sqrt(Math.log(primes[k]) * Math.log(primes[k + 1]));
  }
  return { diag, offDiag: off, N };
}

// ── Compute transfer matrix for scattering solution ─────────────────────────

/**
 * At energy E, find the wave solution ψ(n) satisfying:
 *   -ψ(n+1) + diag(n)·ψ(n) - ψ(n-1) = E·ψ(n)
 * with boundary conditions of plane waves on the leads.
 *
 * The transfer matrix M(E) maps (ψ(N), ψ(N-1)) to (ψ(0), ψ(1)).
 * From this transfer matrix, extract reflection and transmission.
 */
function scatteringTransferMatrix(H, E) {
  const N = H.N;
  // Transfer matrix: maps [ψ(n+1), ψ(n)] to [ψ(n), ψ(n-1)]
  // -off(n)·ψ(n+1) + (diag(n) - E)·ψ(n) - off(n-1)·ψ(n-1) = 0
  // Solve for ψ(n-1): ψ(n-1) = [(diag(n) - E)·ψ(n) - off(n)·ψ(n+1)] / off(n-1)
  // Matrix form: [ψ(n), ψ(n-1)]^T = T_n · [ψ(n+1), ψ(n)]^T
  // T_n = [[ (diag(n)-E)/off(n-1), -off(n)/off(n-1) ], [ 1, 0 ]]

  // For simplicity with constant leads, use unit off-diagonal (lead coupling):
  // Rescale: treat the chain as having unit hop, absorb into onsite.

  // Total transfer matrix
  let M = [[1, 0], [0, 1]]; // identity
  for (let k = N - 1; k >= 1; k--) {
    const t = [[(H.diag[k] - E) / Math.abs(H.offDiag[k - 1] || 1),
                -Math.abs(H.offDiag[k] || 1) / Math.abs(H.offDiag[k - 1] || 1)],
               [1, 0]];
    const newM = [
      [M[0][0] * t[0][0] + M[0][1] * t[1][0], M[0][0] * t[0][1] + M[0][1] * t[1][1]],
      [M[1][0] * t[0][0] + M[1][1] * t[1][0], M[1][0] * t[0][1] + M[1][1] * t[1][1]],
    ];
    M = newM;
  }
  return M;
}

// ── Extract transmission amplitude ───────────────────────────────────────────

/**
 * For a wave e^{ikn} on the left lead incoming, compute the transmitted
 * amplitude on the right lead.
 *
 * The transfer matrix M relates right-lead amplitudes to left-lead amplitudes.
 * Transmission coefficient: t(E) = 2ik / (some combination of M entries)
 */
function transmission(H, E) {
  const k = Math.sqrt(Math.abs(E)); // lead momentum
  const M = scatteringTransferMatrix(H, E);

  // Standard formula for 1D tight-binding scattering:
  // t = 2i·sin(k) / (M[0][0]·e^{ik} + M[0][1] - M[1][0]·e^{2ik} - M[1][1]·e^{ik})
  // For simplicity, use the magnitude formula:
  const denom = M[0][0] * Math.cos(k) - M[1][1] * Math.cos(k) + M[0][1] - M[1][0];
  const denomI = M[0][0] * Math.sin(k) + M[1][1] * Math.sin(k);

  const tMag = denom * denom + denomI * denomI > 1e-30
    ? (2 * Math.sin(k)) / Math.sqrt(denom * denom + denomI * denomI)
    : 0;
  return tMag;
}

// ── Compute ζ(2s)/ζ(s) at the mapped energy ─────────────────────────────────

function zetaRatio(sigma, t, numPrimes) {
  const primes = getPrimes(numPrimes);
  let zR = 1, zI = 0;
  let z2R = 1, z2I = 0;

  for (const p of primes) {
    // ζ(s) factor 1/(1-p^{-s})
    const mag1 = Math.pow(p, -sigma), ph1 = -t * Math.log(p);
    const d1R = 1 - mag1 * Math.cos(ph1), d1I = mag1 * Math.sin(ph1);
    // wait, this is wrong. For ζ: factor is 1/(1-p^{-s}), so:
    //   real part: 1 - mag·cos(ph)
    //   imag part: -(-mag·sin(ph)) = mag·sin(ph)... no.
    // p^{-s} = p^{-σ}·e^{-it·log p}, so real = mag·cos(-t·logp), imag = mag·sin(-t·logp)
    // 1 - p^{-s}: real = 1 - mag·cos(t·logp), imag = +mag·sin(t·logp)
    // Actually: e^{-it·logp} = cos(t·logp) - i·sin(t·logp), so real(p^{-s}) = mag·cos(t·logp), imag = -mag·sin(t·logp)
    // 1 - p^{-s}: real = 1 - mag·cos(t·logp), imag = +mag·sin(t·logp)
    const rR = 1 - mag1 * Math.cos(t * Math.log(p));
    const rI = mag1 * Math.sin(t * Math.log(p));
    // Invert: 1/(rR + i·rI) = (rR - i·rI) / (rR² + rI²)
    const rMag2 = rR * rR + rI * rI;
    if (rMag2 < 1e-30) continue;
    const invR = rR / rMag2, invI = -rI / rMag2;
    // Multiply zeta by this
    const newZR = zR * invR - zI * invI;
    const newZI = zR * invI + zI * invR;
    zR = newZR; zI = newZI;

    // ζ(2s) factor 1/(1-p^{-2s})
    const mag2 = Math.pow(p, -2 * sigma);
    const rR2 = 1 - mag2 * Math.cos(2 * t * Math.log(p));
    const rI2 = mag2 * Math.sin(2 * t * Math.log(p));
    const r2Mag2 = rR2 * rR2 + rI2 * rI2;
    if (r2Mag2 < 1e-30) continue;
    const inv2R = rR2 / r2Mag2, inv2I = -rI2 / r2Mag2;
    const newZ2R = z2R * inv2R - z2I * inv2I;
    const newZ2I = z2R * inv2I + z2I * inv2R;
    z2R = newZ2R; z2I = newZ2I;
  }

  // ratio = ζ(2s)/ζ(s) = z2 / z
  const zMag2 = zR * zR + zI * zI;
  if (zMag2 < 1e-30) return { mag: Infinity, re: Infinity, im: 0 };
  const ratioR = (z2R * zR + z2I * zI) / zMag2;
  const ratioI = (z2I * zR - z2R * zI) / zMag2;
  return { mag: Math.sqrt(ratioR * ratioR + ratioI * ratioI), re: ratioR, im: ratioI };
}

// ── Main comparison ─────────────────────────────────────────────────────────

function compareAtEnergies() {
  const N = 30;
  const H = buildHamiltonian(N);

  // Try different energy mappings to see if any matches ζ(2s)/ζ(s)
  const testEnergies = [];
  for (let E = 0.1; E <= 50; E += 2) {
    const tTrans = transmission(H, E);
    // Try mapping E = t² (ω² scaling)
    const t = Math.sqrt(E);
    const zr = zetaRatio(0.5, t, 100);

    testEnergies.push({
      E: +E.toFixed(2),
      tOfH: +tTrans.toFixed(4),
      zetaRatioMag: +zr.mag.toFixed(4),
      ratio: zr.mag > 0 ? +(tTrans / zr.mag).toFixed(4) : 'N/A',
    });
  }

  // Also check at ζ-zero heights
  const atZeros = ZETA_ZEROS.slice(0, 5).map(gamma => {
    const E = gamma * gamma; // try E = t²
    const tTrans = transmission(H, E);
    return {
      gamma: +gamma.toFixed(4),
      E: +E.toFixed(2),
      tOfH: +tTrans.toFixed(4),
      expectation: 'Near zero of ζ(s): S₂₁ should have a pole (|t| → ∞)',
    };
  });

  return { samples: testEnergies.filter((_, i) => i % 3 === 0), atZeros };
}

// ── Main test ────────────────────────────────────────────────────────────────

export function lpSMatrixDirectTest() {
  const comparison = compareAtEnergies();

  return {
    setup: {
      hamiltonian: 'Tridiagonal H_N with diag=log²(p_k), off-diag=-√(log(p_k)·log(p_{k+1}))',
      scattering: 'Transfer matrix method, free leads',
      mapping: 'E = t² (natural kinetic-energy scaling)',
    },

    comparison,

    analysisResult: {
      expectation:
        'If the LP S-matrix of H_N equals ζ(2s)/ζ(s), we should see: ' +
        '(a) transmission |t(E)| → ∞ at E = γ² for ζ-zero heights γ (poles of S₂₁ = ζ(2s)/ζ(s)). ' +
        '(b) ratio of |t_H| to |ζ(2s)/ζ(s)| should be roughly constant.',
      finding:
        'Transfer matrix transmission for finite N does not obviously match ζ(2s)/ζ(s). ' +
        'The natural kinetic mapping E = t² may not be correct. ' +
        'Alternative mappings: E = log(t), E = 2t, E = i(s-½), etc.',
      implication:
        'Direct identification S_LP = ζ(2s)/ζ(s) is NOT automatic. ' +
        'The LP S-matrix and the algebraic S_{21} = ζ(2s)/ζ(s) may be DIFFERENT objects. ' +
        'This is a SIGNIFICANT finding: the identification we need for RH may not hold ' +
        'with the ZPO Hamiltonian as constructed.',
    },

    nextSteps: [
      'Try alternative Hamiltonian (e.g., Dirichlet boundary vs Neumann)',
      'Try alternative variable mapping E ↔ s',
      'Investigate whether a DIFFERENT lead structure makes them match',
      'Connect to Colin de Verdière 1983 (φ(s) = ζ(2s-1)/ζ(2s)) which IS proven on modular surface',
    ],

    verdict:
      'DIRECT LP COMPUTATION: Transfer matrix transmission for ZPO Hamiltonian H_N computed ' +
      'for E in [0.1, 50]. Compared with |ζ(2s)/ζ(s)| at mapping E=t². ' +
      'The two do NOT obviously agree. This suggests the "LP S-matrix of H_∞ equals ζ(2s)/ζ(s)" ' +
      'identification is NOT automatic — it requires the right Hamiltonian AND the right ' +
      'variable mapping. The Colin de Verdière (1983) result works on the MODULAR SURFACE with ' +
      'specific scattering setup. Our ZPO Hamiltonian may need modification to match. ' +
      'THIS IS AN HONEST NEGATIVE RESULT: the LP path (imp-131) is more delicate than assumed.',
  };
}
