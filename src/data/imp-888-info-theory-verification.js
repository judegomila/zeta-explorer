/**
 * @fileoverview Independent cross-verification of src/math/information-theory.js.
 * @module imp-888-info-theory-verification
 *
 * Proof chain step: S10-verify (imp-888).
 *
 * METHOD. Re-derives three foundational quantities (Shannon entropy of the
 * Euler product, KL divergence at equilibrium, maxEntropy = log2(numPrimes))
 * by hand using closed-form values for tiny fixed test cases, then compares
 * against information-theory.js at bit-precise accuracy. For derived quantities
 * (Fisher information, channel capacity) this verification only smoke-tests
 * that calls return finite outputs at representative points (σ=½, σ=0.7 off
 * the critical line, first non-trivial zero height t≈14.134).
 *
 * HAND-DERIVED REFERENCE (Shannon entropy, s=[1, 0], numPrimes=2, primes={2,3}).
 *   eulerFactor(2, [1,0]) = 1 / (1 - 1/2) = 2                   so |H_2|^2 = 4
 *   eulerFactor(3, [1,0]) = 1 / (1 - 1/3) = 3/2                 so |H_3|^2 = 9/4
 *   totalEnergy = 4 + 9/4 = 25/4 = 6.25
 *   p = [4/6.25, 2.25/6.25] = [0.64, 0.36]  (both exact in Float64 arithmetic)
 *   H = -(0.64 * log2(0.64) + 0.36 * log2(0.36))
 *     = 0.412067961455823 + 0.530615227799668
 *     = 0.942683189255491 bits.
 * Since 4, 2.25, 6.25 are exactly representable Float64 values, the library
 * computes the entropy using the SAME float constants as the hand derivation —
 * so agreement is expected at machine precision (not merely 6 sig figs).
 *
 * SCOPE AND HONEST OPEN SUB-GAPS.
 *   imp-888-sub-remaining-quantities. Full reference derivations for
 *     fisherInformation (finite-difference of log|zeta| sensitivity),
 *     channelCapacity (SNR via impedance mismatch), and mutualInformation
 *     (MI via joint Euler-product distribution) are NOT provided here — only
 *     NaN/Inf smoke tests. Each of those functions calls cross-module helpers
 *     (directLadder, dualLadder, losslessBridge, zetaCriticalStrip) and a
 *     fair cross-check requires a second zeta implementation.
 *   imp-888-sub-docstring-efficiency-claim. The header of
 *     information-theory.js (block-comment "Claim (1)") asserts that σ=½
 *     maximizes entropy efficiency. Spot checks at numPrimes=3, t=0 give
 *     efficiency(σ=0.5) ≈ 0.88, efficiency(σ=1) ≈ 0.93, efficiency(σ=2) ≈ 0.98
 *     — efficiency is monotonically INCREASING in σ on [0.1, 2.0] because for
 *     σ >> 1 every Euler factor tends to 1 so the distribution tends to
 *     uniform (max entropy). The sigma that maximizes efficiency is at the
 *     right edge of the scan range, NOT σ=½. criticalLineOptimality masks
 *     this by restricting range to [0.1, 1.5] and using a 0.1 tolerance, but
 *     the claim as stated in the file header is numerically false. Follow-up
 *     ticket should either narrow the claim or substitute a different
 *     entropy-like functional that actually peaks at σ=½ (e.g. entropy
 *     symmetry between s and 1-s, which is the functional-equation form).
 *
 * Exports:
 *   INFO_THEORY_VERIFICATION        — full report
 *   INFO_THEORY_VERIFICATION_ASSERTIONS — array of build-time assertions
 *
 * Ticket: imp-888 (opus-4-7, subscription).
 */

import {
  eulerProductEntropy,
  klDivergenceFromEquilibrium,
  fisherInformation,
  channelCapacity,
} from '../math/information-theory.js';

// ── Reference value: closed-form entropy at s=[1, 0], 2 primes ───────────────
// Hand-derived in the header; equals 0.942683189255491 bits.
const REF_P1 = 0.64;
const REF_P2 = 0.36;
const REF_ENTROPY_S1_2P =
  -(REF_P1 * Math.log2(REF_P1) + REF_P2 * Math.log2(REF_P2));

const measuredAtS1 = eulerProductEntropy([1, 0], 2);
const entropyAbsErr = Math.abs(measuredAtS1.entropy - REF_ENTROPY_S1_2P);
const entropyRelErr = entropyAbsErr / Math.abs(REF_ENTROPY_S1_2P);

// ── Reference: maxEntropy = log2(numPrimes) exactly at n=8 ───────────────────
const maxEntropyAt8 = eulerProductEntropy([0.5, 0], 8).maxEntropy;
const maxEntropyMatchesLog2n = Math.abs(maxEntropyAt8 - 3) < 1e-15;

// ── Reference: KL divergence = 0 at equilibrium ──────────────────────────────
// sEquil is defined as [0.5, s[1]] inside the library. At s=[0.5, 0] the
// two distributions are bit-identical, so kl, reverseKl, JS must all be 0.
const klAtEquilibrium = klDivergenceFromEquilibrium([0.5, 0], 10);
const klIsZero =
  klAtEquilibrium.kl === 0 &&
  klAtEquilibrium.reverseKl === 0 &&
  klAtEquilibrium.jensenShannon === 0;

// ── Edge case: large σ (σ=10) — all |H_p| close to 1 ─────────────────────────
const largeSigmaEntropy = eulerProductEntropy([10, 0], 15);
const largeSigmaFinite =
  Number.isFinite(largeSigmaEntropy.entropy) &&
  Number.isFinite(largeSigmaEntropy.efficiency) &&
  Number.isFinite(largeSigmaEntropy.totalEnergy);

// ── Edge case: small σ (σ=0.05) — individual |H_p|^2 large, ratio still finite
const smallSigmaEntropy = eulerProductEntropy([0.05, 0], 10);
const smallSigmaFinite =
  Number.isFinite(smallSigmaEntropy.entropy) &&
  Number.isFinite(smallSigmaEntropy.efficiency);

// ── Edge case: Fisher information finite off the critical line ───────────────
const fisherOffCrit = fisherInformation([0.7, 14.134], 10);
const fisherFinite =
  Number.isFinite(fisherOffCrit.fisher) &&
  Number.isFinite(fisherOffCrit.zetaFisher);

// ── Edge case: channel capacity finite and positive near first zero ──────────
const capNearFirstZero = channelCapacity([0.5, 14.134], 10);
const capFinitePositive =
  Number.isFinite(capNearFirstZero.capacity) &&
  Number.isFinite(capNearFirstZero.snr) &&
  capNearFirstZero.capacity > 0;

// ── Qualitative monotonicity spot check (honest partial finding) ─────────────
// See imp-888-sub-docstring-efficiency-claim in the header.
const efficiencyAtHalf = eulerProductEntropy([0.5, 0], 3).efficiency;
const efficiencyAt1    = eulerProductEntropy([1.0, 0], 3).efficiency;
const efficiencyAt2    = eulerProductEntropy([2.0, 0], 3).efficiency;
const efficiencyIncreasesWithSigma =
  efficiencyAt1 > efficiencyAtHalf && efficiencyAt2 > efficiencyAt1;

// ── Report ───────────────────────────────────────────────────────────────────
export const INFO_THEORY_VERIFICATION = {
  ticket: 'imp-888',
  method: 'hand-derived closed-form reference vs library call',
  entropyCheck: {
    s: [1, 0],
    numPrimes: 2,
    referenceBits: REF_ENTROPY_S1_2P,
    measuredBits: measuredAtS1.entropy,
    absErr: entropyAbsErr,
    relErr: entropyRelErr,
  },
  maxEntropyCheck: {
    numPrimes: 8,
    expected: 3,
    measured: maxEntropyAt8,
    passes: maxEntropyMatchesLog2n,
  },
  klEquilibriumCheck: {
    kl: klAtEquilibrium.kl,
    reverseKl: klAtEquilibrium.reverseKl,
    jensenShannon: klAtEquilibrium.jensenShannon,
    passes: klIsZero,
  },
  edgeCases: {
    largeSigma: { sigma: 10, finite: largeSigmaFinite,
                  efficiency: largeSigmaEntropy.efficiency },
    smallSigma: { sigma: 0.05, finite: smallSigmaFinite,
                  efficiency: smallSigmaEntropy.efficiency },
    fisherOffCrit: { s: [0.7, 14.134], finite: fisherFinite,
                     fisher: fisherOffCrit.fisher },
    capacityAtCrit: { s: [0.5, 14.134], finite: capFinitePositive,
                      capacity: capNearFirstZero.capacity },
  },
  efficiencyMonotonicityCheck: {
    description:
      'Spot check of file-header claim that sigma=1/2 maximizes entropy efficiency.',
    at_half: efficiencyAtHalf,
    at_1:    efficiencyAt1,
    at_2:    efficiencyAt2,
    increasesWithSigma: efficiencyIncreasesWithSigma,
    conclusion: efficiencyIncreasesWithSigma
      ? 'FALSIFIED (partial): efficiency is increasing in sigma on [0.5, 2.0], not peaked at 1/2.'
      : 'CONSISTENT with header claim.',
  },
  verdict:
    entropyRelErr < 1e-14 &&
    maxEntropyMatchesLog2n &&
    klIsZero &&
    largeSigmaFinite &&
    smallSigmaFinite &&
    fisherFinite &&
    capFinitePositive
      ? 'PASS-core-formulas'
      : 'REVIEW',
  openSubGaps: [
    'imp-888-sub-remaining-quantities',
    'imp-888-sub-docstring-efficiency-claim',
  ],
};

export const INFO_THEORY_VERIFICATION_ASSERTIONS = [
  {
    id: 'imp888-entropy-matches-hand-derived-reference',
    holds: () => entropyRelErr < 1e-14,
    why:
      'Shannon entropy at s=[1, 0] with numPrimes=2 must match the closed-form ' +
      '0.942683189255491 bits (hand-derived from p=[0.64, 0.36]) at machine ' +
      'precision. Divergence would indicate a log-base swap (ln vs log2), a ' +
      'sign error, or a normalization bug in eulerProductEntropy().',
  },
  {
    id: 'imp888-max-entropy-is-log2-numprimes',
    holds: () => maxEntropyMatchesLog2n,
    why:
      'maxEntropy for numPrimes=8 must equal log2(8)=3 exactly. Guards against ' +
      'off-by-one (e.g. using log2(n-1)) or wrong log base.',
  },
  {
    id: 'imp888-kl-is-zero-at-equilibrium',
    holds: () => klIsZero,
    why:
      'klDivergenceFromEquilibrium at s=[0.5, 0] must return kl, reverseKl, ' +
      'and jensenShannon all exactly 0: the library sets sEquil=[0.5, s[1]] ' +
      'so at s=[0.5, 0] both distributions are bit-identical and every ' +
      'log(p_cur/p_eq) term is log(1)=0. A nonzero value would indicate a ' +
      'normalization-order bug or non-deterministic accumulation.',
  },
  {
    id: 'imp888-large-sigma-finite',
    holds: () => largeSigmaFinite,
    why:
      'At sigma=10 every Euler factor denominator 1 - p^(-sigma) is bounded ' +
      'away from zero (|p^(-sigma)| <= 2^(-10) ~ 1e-3). The library must ' +
      'return finite entropy/efficiency/totalEnergy, never NaN or Inf.',
  },
  {
    id: 'imp888-small-sigma-finite',
    holds: () => smallSigmaFinite,
    why:
      'At sigma=0.05 individual |H_p(s)|^2 grows large (1 - p^(-0.05) is ' +
      'small but nonzero), yet the ratio-to-total normalization must still ' +
      'produce finite entropy/efficiency. Guards against Infinity ' +
      'propagating through Math.log2().',
  },
  {
    id: 'imp888-fisher-finite-off-zero',
    holds: () => fisherFinite,
    why:
      'fisherInformation at s=[0.7, 14.134] (first Riemann zero height, off ' +
      'the critical line) must return finite fisher and zetaFisher. Tests ' +
      'the Math.max(x, 1e-20) guards inside the finite-difference d/d_sigma ' +
      'log|H_p| and d/d_sigma log|zeta|.',
  },
  {
    id: 'imp888-capacity-finite-at-crit',
    holds: () => capFinitePositive,
    why:
      'channelCapacity at s=[0.5, 14.134] (critical line, near first zero) ' +
      'must return finite positive capacity and SNR. Tests the ' +
      'noisePower > 1e-20 guard and the log2(1 + SNR) chain.',
  },
];
