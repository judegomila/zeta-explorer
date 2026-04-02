/**
 * Physical LC Cascade: S₂₁ for the REAL Transfer Matrix
 *
 * imp-133: The [[1,a],[a,1]] embedding (imp-121) was algebraically convenient
 * but it is NOT the physical LC section. The REAL LC transfer matrix is:
 *
 *   T_p(ω) = [[cos(ω log p), Z_p sin(ω log p)], [-sin(ω log p)/Z_p, cos(ω log p)]]
 *
 * with Z_p = 1/log(p), and the complex frequency ω is related to s via the
 * lossless-axis mapping.
 *
 * KEY QUESTION: What is S₂₁ for the PHYSICAL cascade, and are ζ-zeros
 * its ZEROS (making Darlington applicable) or its POLES?
 *
 * THE TWO EMBEDDINGS:
 *   Embedding A (imp-121): T_p = [[1, p^{-s}], [p^{-s}, 1]]
 *     → S₂₁ = ζ(2s)/ζ(s), ζ-zeros are POLES
 *     → S₁₁ ≡ 0 (perfectly matched)
 *
 *   Embedding B (physical LC): T_p = [[cos θ, Z sin θ], [-sin θ/Z, cos θ]]
 *     → S₂₁ = ? (to be computed)
 *     → S₁₁ = ? (to be computed)
 *
 * These are DIFFERENT matrices with the SAME determinant (det = 1).
 * They give DIFFERENT S-matrices with DIFFERENT zero/pole structures.
 */

import { cMul, cDiv, cSub, cAdd, cAbs, ZETA_ZEROS } from './zeta.js';
import { getPrimes } from './primes.js';

// ── Physical LC cascade: ABCD at complex frequency ───────────────────────────

/**
 * The physical LC transfer matrix at complex frequency s = σ + it.
 *
 * For the LC section with L = 1/log(p), C = log(p):
 *   resonant frequency ω₀ = 1/√(LC) = 1
 *   impedance Z₀ = √(L/C) = 1/log(p)
 *   electrical length θ = ω·√(LC) = ω (for ω₀=1)
 *
 * At complex frequency s = σ + it:
 *   θ = s · log(p) (the electrical length is s·log p, not just t·log p)
 *   cos(θ) and sin(θ) become complex (cosh/sinh terms)
 */
function physicalTransferMatrix(p, sigma, t) {
  const logP = Math.log(p);
  const Zp = 1 / logP;

  // Complex θ = (σ+it) · logP
  const thetaR = sigma * logP;
  const thetaI = t * logP;

  // cos(a+bi) = cos(a)cosh(b) - i·sin(a)sinh(b)
  const cosTheta = [
    Math.cos(thetaR) * Math.cosh(thetaI),
    -Math.sin(thetaR) * Math.sinh(thetaI),
  ];
  // sin(a+bi) = sin(a)cosh(b) + i·cos(a)sinh(b)
  const sinTheta = [
    Math.sin(thetaR) * Math.cosh(thetaI),
    Math.cos(thetaR) * Math.sinh(thetaI),
  ];

  // T = [[cos θ, Z·sin θ], [-sin θ/Z, cos θ]]
  return {
    A: cosTheta,
    B: [Zp * sinTheta[0], Zp * sinTheta[1]],
    C: [-sinTheta[0] / Zp, -sinTheta[1] / Zp],
    D: cosTheta,
  };
}

/**
 * Build the N-prime physical cascade ABCD matrix.
 */
function physicalCascadeABCD(sigma, t, N) {
  const primes = getPrimes(N);
  let A = [1, 0], B = [0, 0], C = [0, 0], D = [1, 0];

  for (const p of primes) {
    const Tp = physicalTransferMatrix(p, sigma, t);

    // Matrix multiply: [A',B';C',D'] = [A,B;C,D] × [Tp.A,Tp.B;Tp.C,Tp.D]
    const nA = cAdd(cMul(A, Tp.A), cMul(B, Tp.C));
    const nB = cAdd(cMul(A, Tp.B), cMul(B, Tp.D));
    const nC = cAdd(cMul(C, Tp.A), cMul(D, Tp.C));
    const nD = cAdd(cMul(C, Tp.B), cMul(D, Tp.D));
    A = nA; B = nB; C = nC; D = nD;
  }

  return { A, B, C, D };
}

/**
 * Extract S-parameters from ABCD with impedance normalization Z₀ = 1.
 *
 *   S₁₁ = (A + B/Z₀ - C·Z₀ - D) / (A + B/Z₀ + C·Z₀ + D)
 *   S₂₁ = 2 / (A + B/Z₀ + C·Z₀ + D)
 *
 * With Z₀ = 1:
 *   S₁₁ = (A + B - C - D) / (A + B + C + D)
 *   S₂₁ = 2 / (A + B + C + D)
 */
function extractSParams(abcd) {
  const { A, B, C, D } = abcd;
  const num11 = cSub(cAdd(A, B), cAdd(C, D));
  const denom = cAdd(cAdd(A, B), cAdd(C, D));

  const s11 = cAbs(denom) > 1e-20 ? cDiv(num11, denom) : [NaN, NaN];
  const s21 = cAbs(denom) > 1e-20 ? cDiv([2, 0], denom) : [NaN, NaN];
  const det = cSub(cMul(A, D), cMul(B, C));

  return { s11, s21, det, denomMag: cAbs(denom) };
}

// ── Compute S₂₁ at ζ-zeros for the PHYSICAL cascade ─────────────────────────

/**
 * At known ζ-zeros s = ½ + iγ: compute S₂₁ for the physical LC cascade.
 * If S₂₁ → 0 at ζ-zeros: they are ZEROS of S₂₁ (Darlington applies!)
 * If S₂₁ → ∞ at ζ-zeros: they are POLES (need LP instead)
 */
function physicalS21AtZetaZeros(N) {
  return ZETA_ZEROS.slice(0, 20).map((gamma, idx) => {
    const abcd = physicalCascadeABCD(0.5, gamma, N);
    const s = extractSParams(abcd);

    return {
      index: idx + 1,
      gamma: +gamma.toFixed(4),
      s11Mag: +cAbs(s.s11).toExponential(6),
      s21Mag: +cAbs(s.s21).toExponential(6),
      denomMag: +s.denomMag.toExponential(6),
      detMag: +cAbs(s.det).toExponential(6),
      s21IsZero: cAbs(s.s21) < 0.01,
      s21IsPole: cAbs(s.s21) > 100,
    };
  });
}

// ── Compare with embedding A ─────────────────────────────────────────────────

/**
 * Compare: physical LC cascade vs [[1,a],[a,1]] cascade at the same s.
 */
function compareEmbeddings(sigma, t, N) {
  // Physical LC
  const physABCD = physicalCascadeABCD(sigma, t, N);
  const physS = extractSParams(physABCD);

  // Embedding A: [[1,a],[a,1]]
  const primes = getPrimes(N);
  let eA = [1,0], eB = [0,0], eC = [0,0], eD = [1,0];
  for (const p of primes) {
    const mag = Math.pow(p, -sigma), ph = -t * Math.log(p);
    const ap = [mag * Math.cos(ph), mag * Math.sin(ph)];
    const nA = cAdd(eA, cMul(ap, eB)), nB = cAdd(cMul(ap, eA), eB);
    const nC = cAdd(eC, cMul(ap, eD)), nD = cAdd(cMul(ap, eC), eD);
    eA = nA; eB = nB; eC = nC; eD = nD;
  }
  const embDenom = cAdd(cAdd(eA, eB), cAdd(eC, eD));
  const embS21 = cAbs(embDenom) > 1e-20 ? cDiv([2, 0], embDenom) : [NaN, NaN];
  const embS11 = cAbs(embDenom) > 1e-20 ? cDiv(cSub(cAdd(eA, eB), cAdd(eC, eD)), embDenom) : [NaN, NaN];

  return {
    sigma, t, N,
    physical: {
      s11Mag: +cAbs(physS.s11).toExponential(6),
      s21Mag: +cAbs(physS.s21).toExponential(6),
      detMag: +cAbs(physS.det).toExponential(6),
    },
    embeddingA: {
      s11Mag: +cAbs(embS11).toExponential(6),
      s21Mag: +cAbs(embS21).toExponential(6),
    },
    areDifferent: Math.abs(cAbs(physS.s21) - cAbs(embS21)) / (cAbs(embS21) + 1e-30) > 0.01,
  };
}

// ── Check S₁₁ for the physical cascade (is it still ≡ 0?) ───────────────────

function physicalS11Check(sigma, t, maxN) {
  const nValues = [5, 10, 20, 50, 100];
  return nValues.map(N => {
    const abcd = physicalCascadeABCD(sigma, t, N);
    const s = extractSParams(abcd);
    return {
      N,
      s11Mag: +cAbs(s.s11).toExponential(6),
      s11IsZero: cAbs(s.s11) < 1e-8,
    };
  });
}

// ── Main test ────────────────────────────────────────────────────────────────

export function physicalCascadeS21Test() {
  const N = 100;

  const atZeros = physicalS21AtZetaZeros(N);
  const comparison = [
    compareEmbeddings(2, 5, 50),
    compareEmbeddings(0.5, 14.13, 50),
    compareEmbeddings(0.5, 21.02, 50),
  ];
  const s11Check = physicalS11Check(0.5, 14.13, 100);

  const zerosAreS21Zeros = atZeros.filter(z => z.s21IsZero).length;
  const zerosAreS21Poles = atZeros.filter(z => z.s21IsPole).length;
  const embeddingsDiffer = comparison.some(c => c.areDifferent);
  const physicalS11IsZero = s11Check.every(c => c.s11IsZero);

  return {
    physicalS21AtZeros: {
      total: atZeros.length,
      s21Zeros: zerosAreS21Zeros,
      s21Poles: zerosAreS21Poles,
      neither: atZeros.length - zerosAreS21Zeros - zerosAreS21Poles,
      samples: atZeros.slice(0, 10),
    },
    embeddingComparison: {
      different: embeddingsDiffer,
      results: comparison,
    },
    physicalS11: {
      alwaysZero: physicalS11IsZero,
      results: s11Check,
    },

    conclusion: zerosAreS21Zeros > zerosAreS21Poles
      ? 'BREAKTHROUGH: For the PHYSICAL LC cascade, ζ-zeros appear as S₂₁ ZEROS (not poles)! ' +
        'This means Darlington\'s zero-confinement theorem DOES apply after all. ' +
        'The [[1,a],[a,1]] embedding was the wrong choice — the physical LC embedding ' +
        'has a different S₂₁ structure where ζ-zeros are transmission nulls.'
      : zerosAreS21Poles > zerosAreS21Zeros
        ? 'Same as embedding A: ζ-zeros are S₂₁ POLES in the physical cascade too. ' +
          'The LP path remains the correct approach.'
        : 'Inconclusive: |S₂₁| is neither clearly zero nor clearly infinite at ζ-zeros ' +
          'for the physical cascade at N=' + N + '. Need more primes or different analysis.',

    verdict:
      `PHYSICAL CASCADE S₂₁: At ${atZeros.length} ζ-zeros with N=${N}: ` +
      `${zerosAreS21Zeros} appear as S₂₁ zeros, ${zerosAreS21Poles} as poles, ` +
      `${atZeros.length - zerosAreS21Zeros - zerosAreS21Poles} inconclusive. ` +
      `Embeddings differ: ${embeddingsDiffer ? 'YES' : 'NO'}. ` +
      `Physical S₁₁ always zero: ${physicalS11IsZero ? 'YES (same as embedding A)' : 'NO (different!)'}. `,
  };
}
