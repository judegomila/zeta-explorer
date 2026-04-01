/**
 * S₁₁ (Reflection Coefficient) Analysis
 *
 * imp-130: After imp-129 showed Darlington confines S₂₁ ZEROS (not poles),
 * we check if ζ-zeros are zeros of S₁₁ instead.
 *
 * THE IDEA:
 *   For a 2-port with ABCD matrix: S₁₁ = (A+B-C-D)/(A+B+C+D)
 *   S₁₁ ZEROS: where A+B-C-D = 0 (= perfect transmission, no reflection)
 *   S₁₁ POLES: where A+B+C+D = 0 (same as S₂₁ poles)
 *
 *   For our cascade (imp-121): A+B+C+D = 2·Π(1+p^{-s}).
 *   What about A+B-C-D?
 *
 * COMPUTATION via the SAME induction technique:
 *
 *   Define Σ₊ = A+B+C+D and Σ₋ = A+B-C-D.
 *   From imp-121: Σ₊(N+1) = (1+a)·Σ₊(N).
 *
 *   For Σ₋:
 *     A' = A + aB, B' = aA + B, C' = C + aD, D' = aC + D
 *     Σ₋' = (A+aB) + (aA+B) - (C+aD) - (aC+D)
 *          = (1+a)(A+B) - (1+a)(C+D)
 *          = (1+a)(A+B-C-D)
 *          = (1+a)·Σ₋
 *
 *   So Σ₋(N+1) = (1+a_{N+1})·Σ₋(N) — SAME recurrence as Σ₊!
 *
 *   Base case: N=0 (identity): A=1,B=0,C=0,D=1. Σ₋ = 1+0-0-1 = 0.
 *   After N=1: Σ₋ = (1+a₁)·0 = 0.
 *   After N=2: Σ₋ = (1+a₂)·0 = 0.
 *   ...
 *   Σ₋(N) = 0 for ALL N!
 *
 *   THEREFORE: S₁₁ = Σ₋/Σ₊ = 0/Σ₊ = 0 for ALL s and ALL N.
 *
 *   S₁₁ ≡ 0. The cascade has ZERO reflection — perfect transmission everywhere.
 *   S₁₁ has no zeros (it's identically zero, or rather, every point is a zero).
 *
 * WHAT THIS MEANS:
 *   The specific T_p = [[1,a],[a,1]] matrix gives a cascade with S₁₁ = 0.
 *   This is because T_p is SYMMETRIC (B = C = a), making the network reciprocal
 *   with perfect matching. S₁₁ = 0 is the matched-impedance condition.
 *
 *   So: S₁₁ zeros do NOT give ζ-zeros (S₁₁ is identically zero).
 *   And: S₂₁ poles give ζ-zeros, but Darlington confines zeros, not poles.
 *
 * THE DEEPER ISSUE:
 *   For the T_p = [[1,a],[a,1]] cascade:
 *     S₁₁ = 0 (identically — no information)
 *     S₂₁ = 1/Π(1+p^{-s}) (all information in transmission)
 *     det(S) = S₁₁·S₂₂ - S₁₂·S₂₁ = 0·S₂₂ - S₁₂·S₂₁
 *
 *   Wait — S is 2×2 extracted from the ABCD. Let me compute ALL four S-parameters.
 *
 *   S₁₁ = (A+B-C-D)/(A+B+C+D) = 0/Σ₊ = 0
 *   S₂₁ = 2/(A+B+C+D) = 2/Σ₊
 *   S₁₂ = 2·(AD-BC)/(A+B+C+D) = 2·det(T)/(Σ₊) = 2/Σ₊ (since det=1)
 *   S₂₂ = (-A+B+C-D)/(A+B+C+D) = ?
 *
 *   Let's compute Σ₂₂ = -A+B+C-D:
 *   Σ₂₂' = -(A+aB) + (aA+B) + (C+aD) - (aC+D)
 *         = (-1+a)A + (-a+1)B + (1-a)C + (a-1)D   ... hmm, let me redo
 *         = -A - aB + aA + B + C + aD - aC - D
 *         = (a-1)A + (1-a)B + (1-a)C + (a-1)D
 *         = (a-1)(A-B-C+D)
 *
 *   This is different from the Σ₊ recurrence. Not simply (1+a)·Σ₂₂.
 *
 *   For the SYMMETRIC cascade (B=C in each T_p): A=D by symmetry.
 *   So Σ₂₂ = -A+B+C-D = -A+2B-A (wait, C=B since T is symmetric)
 *          = -2A+2B = 2(B-A).
 *
 *   And Σ₊ = 2(A+B). So S₂₂ = 2(B-A)/2(A+B) = (B-A)/(A+B).
 *
 *   The S-matrix is: S = [[0, 2/Σ₊], [2/Σ₊, (B-A)/(A+B)]]
 *                      = [[0, S₂₁], [S₂₁, S₂₂]]    (S₁₂ = S₂₁ by reciprocity)
 *
 *   det(S) = 0·S₂₂ - S₂₁² = -S₂₁²
 *
 *   So det(S) = -[ζ(2s)/ζ(s)]² · (some normalization).
 *
 *   det(S) ZEROS: where ζ(2s)/ζ(s) = 0, i.e., where ζ(2s) = 0.
 *   That's at s = ρ/2 ≈ σ = ¼. Not ζ-zeros.
 *
 *   CONCLUSION: For the symmetric T_p = [[1,a],[a,1]] cascade,
 *   NONE of S₁₁, S₂₁, det(S) have zeros at the ζ-zeros.
 *   The ζ-zeros appear ONLY as POLES of S₂₁ (and S₁₂).
 *
 *   This is a fundamental constraint of this specific matrix embedding.
 *   Darlington's zero-confinement theorem cannot directly locate the ζ-zeros
 *   because they are poles, not zeros, of the scattering parameters.
 */

import { cMul, cDiv, cSub, cAdd, cAbs, ZETA_ZEROS } from './zeta.js';
import { getPrimes } from './primes.js';

// ── Verify Σ₋ = 0 for all N ─────────────────────────────────────────────────

function verifySigmaMinus(sigma, t, maxN) {
  const primes = getPrimes(maxN);
  let A = [1,0], B = [0,0], C = [0,0], D = [1,0];
  const results = [];

  for (let k = 0; k < maxN; k++) {
    const p = primes[k];
    const mag = Math.pow(p, -sigma), ph = -t * Math.log(p);
    const ap = [mag * Math.cos(ph), mag * Math.sin(ph)];

    const nA = cAdd(A, cMul(ap, B)), nB = cAdd(cMul(ap, A), B);
    const nC = cAdd(C, cMul(ap, D)), nD = cAdd(cMul(ap, C), D);
    A = nA; B = nB; C = nC; D = nD;

    if ([1,5,10,50,100].includes(k+1)) {
      const sigPlus = cAdd(cAdd(A, B), cAdd(C, D));
      const sigMinus = cSub(cAdd(A, B), cAdd(C, D));
      results.push({
        N: k+1,
        sigPlusMag: +cAbs(sigPlus).toExponential(6),
        sigMinusMag: +cAbs(sigMinus).toExponential(6),
        s11: cAbs(sigPlus) > 1e-20 ? +cAbs(cDiv(sigMinus, sigPlus)).toExponential(6) : 'N/A',
        s21: cAbs(sigPlus) > 1e-20 ? +(2 / cAbs(sigPlus)).toExponential(6) : 'N/A',
      });
    }
  }

  const allZero = results.every(r => parseFloat(r.sigMinusMag) < 1e-8);
  return { results, s11AlwaysZero: allZero };
}

// ── Full S-parameter computation ─────────────────────────────────────────────

function fullSParameters(sigma, t, N) {
  const primes = getPrimes(N);
  let A = [1,0], B = [0,0], C = [0,0], D = [1,0];

  for (const p of primes) {
    const mag = Math.pow(p, -sigma), ph = -t * Math.log(p);
    const ap = [mag * Math.cos(ph), mag * Math.sin(ph)];
    const nA = cAdd(A, cMul(ap, B)), nB = cAdd(cMul(ap, A), B);
    const nC = cAdd(C, cMul(ap, D)), nD = cAdd(cMul(ap, C), D);
    A = nA; B = nB; C = nC; D = nD;
  }

  const sigPlus = cAdd(cAdd(A, B), cAdd(C, D));
  const sigMinus = cSub(cAdd(A, B), cAdd(C, D));

  const s11 = cAbs(sigPlus) > 1e-20 ? cDiv(sigMinus, sigPlus) : [NaN, NaN];
  const s21 = cAbs(sigPlus) > 1e-20 ? cDiv([2, 0], sigPlus) : [NaN, NaN];
  const s12 = s21; // reciprocal: S₁₂ = S₂₁ for symmetric T
  const BminusA = cSub(B, A);
  const AplusB = cAdd(A, B);
  const s22 = cAbs(AplusB) > 1e-20 ? cDiv(BminusA, AplusB) : [NaN, NaN];

  const detS = cSub(cMul(s11, s22), cMul(s12, s21));

  return {
    s11: { re: +s11[0].toExponential(6), im: +s11[1].toExponential(6), mag: +cAbs(s11).toExponential(6) },
    s21: { re: +s21[0].toExponential(6), im: +s21[1].toExponential(6), mag: +cAbs(s21).toExponential(6) },
    s22: { re: +s22[0].toExponential(6), im: +s22[1].toExponential(6), mag: +cAbs(s22).toExponential(6) },
    detS: { re: +detS[0].toExponential(6), im: +detS[1].toExponential(6), mag: +cAbs(detS).toExponential(6) },
  };
}

// ── Check at ζ-zeros ─────────────────────────────────────────────────────────

function sParametersAtZetaZeros(N) {
  return ZETA_ZEROS.slice(0, 10).map((gamma, idx) => ({
    zeroIndex: idx + 1,
    gamma: +gamma.toFixed(4),
    ...fullSParameters(0.5, gamma, N),
  }));
}

// ── Main analysis ────────────────────────────────────────────────────────────

export function s11Analysis() {
  const sigmaMinus = verifySigmaMinus(2, 14.13, 100);
  const atZeros = sParametersAtZetaZeros(100);
  const fullS = fullSParameters(2, 5, 100);

  return {
    sigmaMinus,
    sParametersAtZeros: atZeros,
    sampleFullS: fullS,

    algebraicResult: {
      sigmaMinusRecurrence: 'Σ₋(N+1) = (1+a_{N+1})·Σ₋(N), same as Σ₊',
      baseCase: 'Σ₋(0) = A+B-C-D = 1+0-0-1 = 0',
      conclusion: 'Σ₋(N) = 0 for ALL N → S₁₁ ≡ 0',
      meaning: 'The cascade is PERFECTLY MATCHED (zero reflection). ' +
        'This is because T_p = [[1,a],[a,1]] is symmetric (B=C=a).',
    },

    zetaZerosInSParams: {
      s11: 'IDENTICALLY ZERO — no information about ζ-zeros',
      s21: 'POLES at ζ-zeros (ζ(s)=0 → denominator=0)',
      s22: 'More complex — involves (B-A)/(A+B)',
      detS: 'det(S) = -S₂₁² — zeros where ζ(2s)=0, not ζ(s)=0',
    },

    conclusion:
      'For T_p = [[1,a],[a,1]]: S₁₁ ≡ 0, S₂₁ has POLES at ζ-zeros, det(S) has ZEROS at ζ(2s)-zeros. ' +
      'NO S-parameter has ZEROS at ζ-zeros. ' +
      'Darlington\'s zero-confinement cannot directly locate ζ-zeros in this embedding. ' +
      'The ζ-zeros are fundamentally POLES (resonances), not zeros (transmission nulls). ' +
      'This is consistent with the scattering theory interpretation: ' +
      'ζ-zeros = scattering RESONANCES = S-matrix POLES.',

    possibleWaysForward: [
      '1. Use a DIFFERENT matrix embedding where ζ-zeros become S₂₁ ZEROS (not poles).',
      '2. Find a theorem that confines S-matrix POLES (not just zeros) for lossless networks.',
      '3. Use the Lax-Phillips approach which works with resonances (poles) directly.',
      '4. Investigate the S₂₂ parameter — its zero structure may relate to ζ-zeros.',
      '5. Accept that the final step requires LP (pole confinement via contraction semigroup) rather than Darlington (zero confinement).',
    ],

    verdict:
      'S₁₁ ANALYSIS COMPLETE: S₁₁ ≡ 0 (algebraically, by induction). ' +
      'ζ-zeros are POLES of S₂₁, not zeros of any S-parameter. ' +
      'Darlington\'s zero-confinement theorem does NOT directly apply to ζ-zeros. ' +
      'The Lax-Phillips path (which confines RESONANCES = poles) remains the strongest candidate ' +
      'for the final step. The Darlington path needs a different matrix embedding or ' +
      'a pole-confinement variant of the theorem.',
  };
}
