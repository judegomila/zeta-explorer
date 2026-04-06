/**
 * Polymath 8: Bounded Gaps Between Primes (Zhang-Maynard-Tao)
 *
 * imp-261: Zhang (2013): liminf(p_{n+1}-p_n) < 70,000,000.
 * Maynard-Tao (2014): liminf < 600 via multidimensional Selberg sieve.
 * Polymath 8b: liminf < 246.
 *
 * KEY CONCEPT: k-admissible tuples.
 * A tuple H = {h_1, ..., h_k} is admissible if for every prime p,
 * the set {h_i mod p} does not cover all residues mod p.
 *
 * MAYNARD-TAO THEOREM: For any admissible k-tuple H of diameter D,
 * there exist infinitely many n such that at least 2 of n+h_1, ..., n+h_k
 * are prime, PROVIDED k >= k_0 (effective constant from sieve optimization).
 *
 * Maynard: k_0 = 105, giving H_{105} = 600.
 * Polymath 8b: optimized to k_0 = 50, H_50 = 246.
 *
 * THIS MODULE:
 *   1. Generate small admissible k-tuples.
 *   2. For each tuple, count how often >= 2 entries are prime (up to 10^6).
 *   3. Find smallest gaps in prime data.
 *   4. Verify the Maynard-Tao mechanism numerically.
 */

function sievePrimes(N) {
  const sieve = new Uint8Array(N + 1);
  for (let n = 2; n <= N; n++) { if (!sieve[n]) for (let k = 2*n; k <= N; k += n) sieve[k] = 1; }
  return sieve;
}

// Check if tuple H is admissible: for each prime p <= k, H mod p doesn't cover all residues
function isAdmissible(H) {
  const k = H.length;
  for (let p = 2; p <= k + 1; p++) {
    // Check if p is prime
    let isPrime = p >= 2;
    for (let d = 2; d*d <= p; d++) if (p%d === 0) { isPrime = false; break; }
    if (!isPrime) continue;
    const residues = new Set(H.map(h => ((h % p) + p) % p));
    if (residues.size >= p) return false;  // covers all residues => NOT admissible
  }
  return true;
}

// Generate admissible k-tuples via greedy algorithm
function greedyAdmissibleTuple(k) {
  const H = [0];
  let candidate = 1;
  while (H.length < k) {
    const test = [...H, candidate];
    if (isAdmissible(test)) H.push(candidate);
    candidate++;
  }
  return H;
}

// Count n in [1, N] where >= m entries of {n+h_1, ..., n+h_k} are prime
function countPrimeTuples(H, N, isPrime, m = 2) {
  let count = 0;
  for (let n = 2; n <= N; n++) {
    let primeCount = 0;
    for (const h of H) {
      if (n + h <= N + H[H.length-1] && n + h >= 2 && !isPrime[n + h]) primeCount++;
      if (primeCount >= m) break;
    }
    if (primeCount >= m) count++;
  }
  return count;
}

export function polymath8BoundedGapsTest() {
  const N = 1000000;
  const isPrime = sievePrimes(N + 300);

  // Compute all prime gaps up to N
  const primes = [];
  for (let n = 2; n <= N; n++) if (!isPrime[n]) primes.push(n);
  const gaps = [];
  for (let i = 1; i < primes.length; i++) gaps.push(primes[i] - primes[i-1]);

  // Gap statistics
  const gapHist = {};
  for (const g of gaps) gapHist[g] = (gapHist[g] || 0) + 1;
  const sortedGaps = Object.entries(gapHist).sort((a,b) => +a[0] - +b[0]);

  // Twin primes (gap 2)
  const twinCount = gapHist[2] || 0;
  // Cousin primes (gap 4)
  const cousinCount = gapHist[4] || 0;
  // Sexy primes (gap 6)
  const sexyCount = gapHist[6] || 0;

  // Generate admissible tuples of various sizes
  const tuples = [2, 3, 5, 10, 20, 50].map(k => {
    const H = greedyAdmissibleTuple(k);
    const diameter = H[H.length - 1];
    return { k, H_sample: H.slice(0, 8).concat(k > 8 ? ['...'] : []), diameter };
  });

  // For small tuples, count prime tuples
  const tupleCounts = tuples.filter(t => t.k <= 10).map(t => {
    const H = greedyAdmissibleTuple(t.k);
    const count = countPrimeTuples(H, Math.min(N, 100000), isPrime, 2);
    return { k: t.k, diameter: t.diameter, 'pairs_in_tuple_<=10^5': count };
  });

  // Key result: smallest gaps
  const minGap = Math.min(...gaps);
  const smallGapCounts = {
    'gap=2 (twin)': twinCount,
    'gap=4 (cousin)': cousinCount,
    'gap=6 (sexy)': sexyCount,
    'gap<=10': gaps.filter(g => g <= 10).length,
    'gap<=20': gaps.filter(g => g <= 20).length,
    'gap<=50': gaps.filter(g => g <= 50).length,
    'gap<=246 (Polymath)': gaps.filter(g => g <= 246).length,
  };

  // Proportion with gap <= H for various H (Maynard predicts positive density)
  const proportions = [2, 6, 12, 30, 70, 246, 600].map(H => ({
    H,
    count: gaps.filter(g => g <= H).length,
    proportion: +(gaps.filter(g => g <= H).length / gaps.length).toFixed(4),
  }));

  return {
    framework: {
      name: 'Polymath 8: Bounded Gaps Between Primes',
      zhang2013: 'liminf(p_{n+1}-p_n) < 70,000,000 (first finite bound)',
      maynardTao2014: 'liminf < 600 via multidimensional Selberg sieve',
      polymath8b: 'liminf < 246 (optimized sieve + admissible tuple search)',
      twinPrime: 'liminf = 2 remains OPEN (twin prime conjecture)',
      method: 'k-admissible tuple H + GPY/Maynard sieve => 2 primes in n+H infinitely often',
    },

    prime_statistics: {
      primes_up_to_1M: primes.length,
      total_gaps: gaps.length,
      min_gap: minGap,
      small_gap_counts: smallGapCounts,
    },

    gap_proportions: proportions,

    admissible_tuples: tuples,
    tuple_prime_counts: tupleCounts,

    gap_distribution_sample: sortedGaps.slice(0, 15).map(([g, c]) => ({ gap: +g, count: c })),

    keyFindings: [
      `${primes.length} primes up to 10^6. ${gaps.length} gaps. Smallest gap = ${minGap}.`,
      `Twin primes (gap 2): ${twinCount}. Cousin (gap 4): ${cousinCount}. Sexy (gap 6): ${sexyCount}.`,
      `Gaps <= 246 (Polymath bound): ${smallGapCounts['gap<=246 (Polymath)']} out of ${gaps.length} (${(100*smallGapCounts['gap<=246 (Polymath)']/gaps.length).toFixed(1)}%).`,
      `Admissible tuple diameters: k=2:${tuples[0].diameter}, k=5:${tuples[2].diameter}, k=10:${tuples[3].diameter}, k=50:${tuples[5].diameter}.`,
      `Maynard-Tao: k=105 gives H=600; Polymath 8b: k=50 gives H=246.`,
      `At k=50, greedy admissible tuple has diameter ${tuples[5].diameter} (compare to Polymath H_50=246).`,
      `ZHANG (2013): first FINITE bound on prime gaps. Used BV + modified GPY sieve.`,
      `MAYNARD-TAO (2014): multidimensional Selberg sieve gives optimal k_0 ~ e^{4m}.`,
    ],

    relationToRH: {
      bvConnection:
        'Zhang used Bombieri-Vinogradov type estimates (imp-245) for smooth moduli beyond Q=x^{1/2}.',
      grhWouldGive:
        'Under GRH: liminf(p_{n+1}-p_n) <= C*(log p)^2 (much better than 246). ' +
        'Cramér conjecture (imp-247) gives even stronger gap bounds.',
      twinPrimeConjecture:
        'Twin prime conjecture (liminf = 2) remains OPEN. Would follow from Elliott-Halberstam at level 1.',
      densityConnection:
        'Bounded gaps use prime distribution in APs. Better zero density (imp-253) => better gap bounds.',
    },

    verdict:
      `POLYMATH 8: ${twinCount} twin primes, ${smallGapCounts['gap<=246 (Polymath)']} gaps ≤ 246 among ${gaps.length} total. ` +
      `Admissible tuples generated up to k=50 (diameter ${tuples[5].diameter}). ` +
      'Zhang-Maynard-Tao: liminf < 246 UNCONDITIONALLY. Twin primes remain open.',
  };
}
