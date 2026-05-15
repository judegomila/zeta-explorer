/**
 * @module brun-constant
 * @fileoverview Brun (1919) twin-prime reciprocal sum: numerically evaluates
 * the famous constant B_2 = sum over twin primes p of (1/p + 1/(p+2)), which
 * Brun proved converges (a striking contrast with Euler's divergent sum of
 * all prime reciprocals). The module sieves primes up to 10^7 via the
 * Sieve of Eratosthenes, enumerates every twin pair (p, p+2), accumulates
 * the partial sum S(x), and extrapolates the slow Hardy-Littlewood tail
 * 4*C_2/log(x) (with twin-prime constant C_2 approx 0.660162) to recover
 * B_2 approx 1.9021605778 (Nicely 1996, Sebah 2002). Brun's sieve laid
 * the analytic-number-theory foundation later refined by Selberg, Bombieri,
 * Zhang, and Maynard. Key export: `brunConstantTest` (returns the partial
 * sum, the Hardy-Littlewood tail estimate, the extrapolated B_2, and a
 * comparison with the reference value). Originating ticket: imp-195.
 * Proof-chain step: anchors the convergence baseline that the RH attack
 * uses to bound twin-prime density contributions before invoking the
 * Bombieri-Vinogradov / bounded-gaps machinery downstream.
 * @see imp-195
 * @see imp-1073
 */

/**
 * Brun Constant B_2 for Twin Primes
 *
 * imp-195: Brun (1919) proved that the sum of reciprocals of twin primes
 * CONVERGES:
 *
 *   B_2 := Σ_{twin primes p} (1/p + 1/(p+2))
 *        = (1/3 + 1/5) + (1/5 + 1/7) + (1/11 + 1/13) + (1/17 + 1/19) + ...
 *        ≈ 1.9021605778...
 *
 * This is a REMARKABLE result: while the sum of ALL prime reciprocals
 * diverges (Euler: Σ 1/p = ∞), the twin-prime sub-sum CONVERGES.
 * Brun used a SIEVE method, establishing the foundation of modern
 * analytic number theory.
 *
 * IMPLICATION: We CANNOT prove the twin prime conjecture via reciprocals
 * (they converge regardless of whether infinitely many twins exist).
 *
 * BEST KNOWN VALUE (from extensive computation):
 *
 *   B_2 ≈ 1.9021605778...   (Nicely 1996, Sebah 2002)
 *
 * CONVERGENCE RATE:
 *
 *   Under Hardy-Littlewood twin prime conjecture:
 *     π_2(x) ~ 2C_2 · x/(log x)²  where C_2 ≈ 0.660162
 *   ⟹ tail of B_2 sum from x: ~ 4C_2/log x  (very slow convergence!)
 *
 * THIS MODULE:
 *
 *   1. Sieve primes up to 10^7.
 *   2. Find all twin prime pairs.
 *   3. Compute partial sum S(x) = Σ_{(p,p+2) twin, p≤x} (1/p + 1/(p+2)).
 *   4. Estimate tail via Hardy-Littlewood, extrapolate to B_2.
 *   5. Compare with reference value.
 */

const TWIN_PRIME_CONSTANT = 0.6601618158468695;
const B_2_REFERENCE = 1.9021605778;

// ── Sieve ──────────────────────────────────────────────────────────────────

function sievePrimes(N) {
  const sieve = new Uint8Array(N + 1);
  const primes = [];
  for (let n = 2; n <= N; n++) {
    if (!sieve[n]) {
      primes.push(n);
      for (let k = 2 * n; k <= N; k += n) sieve[k] = 1;
    }
  }
  return { primes, sieve };
}

// ── Twin primes and cumulative B_2 sum ─────────────────────────────────────

function computeBrunPartial(primes, sieve, xMax) {
  const twinPairs = [];
  let partialSum = 0;
  const milestones = [100, 1000, 10000, 100000, 1000000, 10000000];
  const milestoneResults = [];
  let mIdx = 0;

  for (const p of primes) {
    if (p > xMax) break;
    const q = p + 2;
    if (q <= xMax && !sieve[q]) {
      twinPairs.push([p, q]);
      partialSum += 1 / p + 1 / q;
    }
    // Record at milestones
    while (mIdx < milestones.length && p >= milestones[mIdx]) {
      const tailEstimate = (4 * TWIN_PRIME_CONSTANT) / Math.log(milestones[mIdx]);
      milestoneResults.push({
        x: milestones[mIdx],
        twinPairsFound: twinPairs.length,
        partialSum_S_x: +partialSum.toFixed(6),
        HL_tail_estimate: +tailEstimate.toFixed(4),
        B_2_estimate: +(partialSum + tailEstimate).toFixed(4),
      });
      mIdx++;
    }
  }

  return { twinPairs, partialSum, milestoneResults };
}

// ── Main test ────────────────────────────────────────────────────────────────

export function brunConstantTest() {
  const N = 10000000;
  console.error(`Sieving primes up to ${N}...`);
  const { primes, sieve } = sievePrimes(N);
  const { twinPairs, partialSum, milestoneResults } = computeBrunPartial(primes, sieve, N);

  // Final extrapolation using Hardy-Littlewood tail
  const tailAtN = (4 * TWIN_PRIME_CONSTANT) / Math.log(N);
  const B_2_estimate_final = partialSum + tailAtN;
  const error_vs_reference = Math.abs(B_2_estimate_final - B_2_REFERENCE);

  return {
    framework: {
      name: 'Brun Constant B_2 for Twin Primes',
      definition: 'B_2 = Σ over twin primes (1/p + 1/(p+2))',
      brun1919: 'PROVED: sum converges (unlike Σ 1/p which diverges)',
      referenceValue: B_2_REFERENCE,
      convergenceRate: 'Tail from x ~ 4·C_2/log(x), very slow',
    },

    computation: {
      N,
      numPrimes: primes.length,
      numTwinPairs: twinPairs.length,
    },

    convergenceBehavior: milestoneResults,

    finalEstimate: {
      partialSum_to_10_7: +partialSum.toFixed(6),
      HL_tail_estimate: +tailAtN.toFixed(4),
      B_2_estimate: +B_2_estimate_final.toFixed(4),
      B_2_reference: B_2_REFERENCE,
      error: +error_vs_reference.toFixed(4),
    },

    twinPairSamples: {
      first10: twinPairs.slice(0, 10),
      last5: twinPairs.slice(-5),
    },

    keyFindings: [
      `Found ${twinPairs.length} twin prime pairs with p ≤ ${N}.`,
      `Partial sum S(${N}) = ${partialSum.toFixed(6)}.`,
      `Hardy-Littlewood tail estimate from x=${N}: 4·C_2/log(${N}) = ${tailAtN.toFixed(4)}.`,
      `B_2 estimate (partial + tail): ${B_2_estimate_final.toFixed(4)} (reference ${B_2_REFERENCE}).`,
      `Error vs reference: ${error_vs_reference.toFixed(4)} (tail estimate crude).`,
    ],

    relationToRH: {
      historicalSignificance:
        'Brun 1919 introduced the SIEVE METHOD to prove B_2 converges. ' +
        'This founded modern analytic number theory and led to Selberg, Erdős, ' +
        'Chen, Maynard, and ultimately Zhang-Maynard-Tao bounded gaps (imp-189).',
      nonRHConclusion:
        'B_2 convergence is INDEPENDENT of twin prime conjecture (holds whether or not ' +
        'there are infinitely many twins). So it cannot prove twin primes exist.',
      cprConnection:
        'Hardy-Littlewood TWIN PRIME conjecture π_2(x) ~ 2C_2·x/(log x)² gives the ' +
        'convergence rate. GRH-conditional refinements improve the tail bound.',
    },

    nextStep:
      'Extend to x = 10^10+ via segmented Wheel sieve. ' +
      'Compute refined tail estimate with lower-order Hardy-Littlewood terms. ' +
      'Use Deleglise-Rivat or Sebah method for B_2 to 8+ digits.',

    verdict:
      `BRUN CONSTANT: ${twinPairs.length} twin pairs found up to ${N}. ` +
      `Partial sum S(${N}) = ${partialSum.toFixed(4)}, HL tail ${tailAtN.toFixed(4)}, B_2 estimate ${B_2_estimate_final.toFixed(4)} ` +
      `(reference ${B_2_REFERENCE}, error ${error_vs_reference.toFixed(4)}). ` +
      'Slow convergence (~1/log x) makes precise B_2 computation challenging.',
  };
}
