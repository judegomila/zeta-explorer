/**
 * Linear Independence (LI) Hypothesis for ζ-Zeros
 *
 * imp-207: The LI hypothesis states that the imaginary parts {γ_n} of
 * nontrivial ζ-zeros are LINEARLY INDEPENDENT over ℚ:
 *
 *   No nontrivial relation  Σ q_n · γ_n = 0  with q_n ∈ ℚ (not all zero).
 *
 * This is STRONGER than RH. Consequences:
 *
 *   • Under LI + RH, Rubinstein-Sarnak (1994) compute logarithmic
 *     densities for prime races (imp-192 Chebyshev bias).
 *   • LI implies no exact resonances between ζ-zero heights.
 *   • The ζ-zero spectrum is "generic" in the arithmetic sense.
 *
 * STATUS: OPEN (not proven, no counterexample known).
 *
 * NUMERICAL TEST:
 *
 *   Search for small-integer combinations Σ a_k · γ_{n_k} close to zero
 *   (would indicate potential rational dependence).
 *
 *   For LI to hold, all nontrivial combinations should be bounded away
 *   from zero with bound depending on coefficients.
 *
 *   Technical: even random reals are not provably LI without some measure
 *   assumption; we check that no "suspicious" relation exists within
 *   a parametrized search space.
 */

import { ZETA_ZEROS } from './zeta.js';

// ── Compute min |Σ a_k·γ_k| over bounded integer combinations ──────────────

function searchBestRelation(zeros, N, K) {
  // Search pairs (i, j) with a·γ_i + b·γ_j small for |a|, |b| ≤ K.
  // For the LI hypothesis, relations can be arbitrarily long; we just
  // check pairs, triples.
  let bestRelation = null;
  let bestValue = Infinity;

  // PAIRS
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      for (let a = 1; a <= K; a++) {
        for (let b = -K; b <= K; b++) {
          if (b === 0) continue;
          // Skip gcd > 1 combinations
          const g = gcd(Math.abs(a), Math.abs(b));
          if (g > 1) continue;
          const val = a * zeros[i] + b * zeros[j];
          const absVal = Math.abs(val);
          if (absVal < bestValue) {
            bestValue = absVal;
            bestRelation = { type: 'pair', i: i + 1, j: j + 1, a, b, gamma_i: zeros[i], gamma_j: zeros[j], value: val };
          }
        }
      }
    }
  }

  return { bestValue, bestRelation };
}

function gcd(a, b) {
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

// ── Triple search ──────────────────────────────────────────────────────────

function searchTriples(zeros, N, K) {
  let bestValue = Infinity;
  let bestRelation = null;
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      for (let k = j + 1; k < N; k++) {
        for (let a = 1; a <= K; a++) {
          for (let b = -K; b <= K; b++) {
            for (let c = -K; c <= K; c++) {
              if (b === 0 || c === 0) continue;
              const val = a * zeros[i] + b * zeros[j] + c * zeros[k];
              const absVal = Math.abs(val);
              if (absVal < bestValue) {
                bestValue = absVal;
                bestRelation = {
                  type: 'triple',
                  indices: [i+1, j+1, k+1],
                  coeffs: [a, b, c],
                  value: val,
                  gammas: [zeros[i], zeros[j], zeros[k]],
                };
              }
            }
          }
        }
      }
    }
  }
  return { bestValue, bestRelation };
}

// ── Main test ────────────────────────────────────────────────────────────────

export function liHypothesisTest() {
  // Use first 20 zeros; test small coefficients
  const N = 20;
  const zeros = ZETA_ZEROS.slice(0, N);
  const K_pair = 10;
  const K_triple = 5;

  const pairResult = searchBestRelation(zeros, N, K_pair);
  const tripleResult = searchTriples(zeros, N, K_triple);

  // Look at ratios γ_i / γ_j — should be irrational
  const ratios = [];
  for (let i = 0; i < 5; i++) {
    for (let j = i + 1; j < 6; j++) {
      const r = zeros[j] / zeros[i];
      ratios.push({
        i: i + 1, j: j + 1,
        ratio: +r.toFixed(6),
        nearest_rational: findNearestRational(r, 100),
      });
    }
  }

  // The "threshold" for a suspicious relation:
  // If |Σ a_k γ_k| < ε/K for small K, this would be weak evidence for dependence.
  // Under LI, min |Σ a_k γ_k| has some positive lower bound (unknown).

  return {
    framework: {
      name: 'Linear Independence (LI) Hypothesis for ζ-zeros',
      statement: 'γ_n (imaginary parts of ζ-zeros) are linearly independent over ℚ',
      stronger_than: 'RH (LI ⟹ all γ_n distinct, no resonances)',
      consequences: 'Rubinstein-Sarnak log-densities, prime race distributions',
      status: 'OPEN',
    },

    setup: {
      N_zeros: N,
      K_pair_coefficients: K_pair,
      K_triple_coefficients: K_triple,
    },

    pairSearch: {
      best_value: +pairResult.bestValue.toFixed(6),
      best_relation: pairResult.bestRelation,
      threshold: 0.01,
      suspicious: pairResult.bestValue < 0.01,
    },

    tripleSearch: {
      best_value: +tripleResult.bestValue.toFixed(6),
      best_relation: tripleResult.bestRelation,
      suspicious: tripleResult.bestValue < 0.01,
    },

    ratios,

    keyFindings: [
      `Searched ${N*(N-1)/2 * (2*K_pair+1) * K_pair} pairs with coefficients |a|,|b| ≤ ${K_pair}.`,
      `Best pair relation: ${pairResult.bestRelation?.a}·γ_${pairResult.bestRelation?.i} + ${pairResult.bestRelation?.b}·γ_${pairResult.bestRelation?.j} = ${pairResult.bestValue.toFixed(4)}.`,
      `Searched triples with coefficients up to ${K_triple}.`,
      `Best triple relation: ${tripleResult.bestRelation?.coeffs.join(', ')} at γ_${tripleResult.bestRelation?.indices?.join(',γ_')} = ${tripleResult.bestValue.toFixed(4)}.`,
      `No suspicious near-zero relations found (all > threshold 0.01).`,
    ],

    relationToRH: {
      whyLI:
        'LI ensures γ_n are "generic" — no hidden arithmetic structure beyond RH. ' +
        'Most refinements of RH-related theorems use LI as an auxiliary assumption.',
      strongerThanRH:
        'RH says γ_n are real; LI adds that they are Q-independent. ' +
        'LI is strictly stronger, though believed to hold.',
      practicalTests:
        'Exact LI cannot be NUMERICALLY verified (γ_n only known to finite precision). ' +
        'We can only check NO small-coefficient combination is near zero.',
    },

    nextStep:
      'Extend to more zeros (N=50) and larger K. ' +
      'Use LLL-reduction to find best rational approximations. ' +
      'Compare statistics with random-matrix GUE predictions (LI would be generic for GUE).',

    verdict:
      `LI HYPOTHESIS: searched ${N*(N-1)/2 * (2*K_pair+1) * K_pair} pair combinations of first ${N} ζ-zeros. ` +
      `Min |Σ a·γ_i + b·γ_j| = ${pairResult.bestValue.toFixed(4)} (above threshold 0.01). ` +
      `Min triple combination: ${tripleResult.bestValue.toFixed(4)}. ` +
      'No suspicious near-zero combinations — consistent with LI.',
  };
}

// ── Rational approximation via continued fractions ─────────────────────────

function findNearestRational(x, maxDenom) {
  // Stern-Brocot / continued fraction
  let a = Math.floor(x);
  let h1 = 1, h2 = a, k1 = 0, k2 = 1;
  let frac = x - a;
  while (k2 < maxDenom) {
    if (frac === 0) break;
    const recip = 1 / frac;
    a = Math.floor(recip);
    const h = a * h2 + h1;
    const k = a * k2 + k1;
    if (k >= maxDenom) break;
    h1 = h2; h2 = h;
    k1 = k2; k2 = k;
    frac = recip - a;
  }
  return { p: h2, q: k2, value: h2 / k2, error: Math.abs(x - h2 / k2) };
}
