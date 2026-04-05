/**
 * Zhang-Maynard-Tao Bounded Prime Gaps Witnesses
 *
 * imp-189: Zhang (2013) proved a massive breakthrough: there are
 * INFINITELY many primes p with the property that p and some p' > p
 * with p' - p ≤ 70,000,000 are both prime. This shattered what had
 * previously been an open conjecture for nearly a century.
 *
 * SUBSEQUENT IMPROVEMENTS:
 *
 *   Zhang 2013:        H_1 := lim inf(p_{n+1}-p_n) ≤ 70,000,000
 *   Maynard 2014:      H_1 ≤ 600  (unconditional)
 *   Polymath8b 2014:   H_1 ≤ 246  (current best unconditional)
 *   Under GRH:         H_1 ≤ 6
 *   Twin prime conj.:  H_1 = 2  (OPEN)
 *
 * HARDY-LITTLEWOOD k-TUPLE CONJECTURE:
 *
 *   For an admissible k-tuple {h_0, h_1, ..., h_{k-1}}, the number of
 *   prime constellations p, p+h_1, ..., p+h_{k-1} in [2, x] is
 *
 *     π_k(x; H) ~ C(H) · x / (log x)^k
 *
 *   where C(H) is the singular series for H.
 *
 * THIS MODULE:
 *
 *   1. Sieve primes up to 10⁶.
 *   2. Find ALL prime pairs with gap 2, 4, 6, 8, 10, 12.
 *   3. Find prime constellations: (p, p+2, p+6), (p, p+2, p+6, p+8), etc.
 *   4. Compare with Hardy-Littlewood predictions.
 *   5. Verify bounded-gap witnesses (many pairs with gap ≤ 246).
 */

// ── Sieve of Eratosthenes ───────────────────────────────────────────────────

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

// ── Singular series for Hardy-Littlewood constants ─────────────────────────
// Twin prime constant C_2 = Π_{p>2} (1 - 1/(p-1)²) ≈ 0.6601618

const C_TWIN = 0.6601618158468695;

// For gap g: singular series constant (simplified for small even g)
// π(x; gap=g) ~ 2 · C_g · x/(log x)² where C_g = C_2 · (g-related factor)
function hardyLittlewoodSingular(g) {
  // For gap pairs: π_2(x; g) ~ 2·C_2·x/(log x)²  (all even gaps, up to constants)
  // More refined: C_2(g) = C_2 · Π_{p|g, p>2} (p-1)/(p-2)
  let factor = C_TWIN;
  let gg = g;
  for (let p = 3; p * p <= gg; p += 2) {
    if (gg % p === 0) {
      factor *= (p - 1) / (p - 2);
      while (gg % p === 0) gg /= p;
    }
  }
  if (gg > 2) factor *= (gg - 1) / (gg - 2);
  return factor;
}

// ── Find prime pairs with specific gap ──────────────────────────────────────

function findPairs(primes, sieve, gap, xMax) {
  const pairs = [];
  for (const p of primes) {
    if (p > xMax) break;
    const q = p + gap;
    if (q <= xMax && !sieve[q]) pairs.push([p, q]);
  }
  return pairs;
}

// ── Find prime k-tuples ─────────────────────────────────────────────────────

function findKTuples(primes, sieve, offsets, xMax) {
  const tuples = [];
  for (const p of primes) {
    if (p + offsets[offsets.length - 1] > xMax) break;
    let valid = true;
    for (const h of offsets) {
      const q = p + h;
      if (q > 1 && sieve[q] && q !== p) { valid = false; break; }
      // Actually sieve[q] is 1 if composite, 0 if prime.
      // But need q to be prime.
      if (q > 1 && sieve[q] === 1) { valid = false; break; }
    }
    if (valid) tuples.push(offsets.map(h => p + h));
  }
  return tuples;
}

// ── Main test ────────────────────────────────────────────────────────────────

export function boundedPrimeGapsTest() {
  const N = 1000000;
  console.error(`Sieving primes up to ${N}...`);
  const { primes, sieve } = sievePrimes(N);

  // 1. Find pairs with gap 2, 4, 6, 8, 10, 12, ...
  const gapCounts = [];
  for (const g of [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]) {
    const pairs = findPairs(primes, sieve, g, N);
    const C_g = hardyLittlewoodSingular(g);
    const predicted = 2 * C_g * N / Math.pow(Math.log(N), 2);
    gapCounts.push({
      gap: g,
      actual: pairs.length,
      C_g: +C_g.toFixed(4),
      hardyLittlewoodPredicted: +predicted.toFixed(1),
      ratio: +(pairs.length / predicted).toFixed(4),
      firstFew: pairs.slice(0, 3),
      lastFew: pairs.slice(-3),
    });
  }

  // 2. Prime triples (p, p+2, p+6)
  const triples = findKTuples(primes, sieve, [0, 2, 6], N);
  // 3. Prime quadruples (p, p+2, p+6, p+8)
  const quadruples = findKTuples(primes, sieve, [0, 2, 6, 8], N);
  // 4. Prime quintuples (p, p+2, p+6, p+8, p+12)
  const quintuples = findKTuples(primes, sieve, [0, 2, 6, 8, 12], N);
  // 5. Prime sextuples (p, p+4, p+6, p+10, p+12, p+16)
  const sextuples = findKTuples(primes, sieve, [0, 4, 6, 10, 12, 16], N);

  // 6. Maynard-Tao bound: H_1 ≤ 246. Verify: in our range, find many pairs with gap ≤ 246.
  // The bound says infinitely many n with p_{n+1}-p_n ≤ 246.
  let pairsWithinMT_bound = 0;
  let pairsWithinGRH_bound = 0;
  for (let i = 0; i < primes.length - 1; i++) {
    const gap = primes[i + 1] - primes[i];
    if (gap <= 246) pairsWithinMT_bound++;
    if (gap <= 6) pairsWithinGRH_bound++;
  }

  return {
    framework: {
      zhang2013: 'H_1 := lim inf(p_{n+1}-p_n) ≤ 70,000,000',
      maynard2014: 'H_1 ≤ 600',
      polymath8b_2014: 'H_1 ≤ 246 (current best unconditional)',
      underGRH: 'H_1 ≤ 6',
      twinPrimeConjecture: 'H_1 = 2 (OPEN)',
    },

    setup: {
      sievedTo: N,
      numPrimes: primes.length,
    },

    gapPairCounts: gapCounts,

    prime_kTuples: {
      triples_0_2_6: {
        count: triples.length,
        firstFew: triples.slice(0, 3),
        lastFew: triples.slice(-3),
      },
      quadruples_0_2_6_8: {
        count: quadruples.length,
        firstFew: quadruples.slice(0, 3),
        lastFew: quadruples.slice(-2),
      },
      quintuples_0_2_6_8_12: {
        count: quintuples.length,
        firstFew: quintuples.slice(0, 3),
        lastFew: quintuples.slice(-2),
      },
      sextuples_0_4_6_10_12_16: {
        count: sextuples.length,
        firstFew: sextuples.slice(0, 3),
        lastFew: sextuples.slice(-2),
      },
    },

    boundedGapWitnesses: {
      pairs_with_gap_le_246: pairsWithinMT_bound,
      pairs_with_gap_le_6_GRH: pairsWithinGRH_bound,
      totalAdjacentPairs: primes.length - 1,
      pct_within_MT_bound: +((pairsWithinMT_bound / (primes.length - 1)) * 100).toFixed(2),
    },

    keyFindings: [
      `Sieved ${primes.length} primes up to ${N}.`,
      `Twin primes (gap 2): ${gapCounts[0].actual} actual vs ${gapCounts[0].hardyLittlewoodPredicted} HL predicted (ratio ${gapCounts[0].ratio}).`,
      `Sexy primes (gap 6): ${gapCounts[2].actual}, C_6=${gapCounts[2].C_g}, ratio ${gapCounts[2].ratio}.`,
      `Prime triples (p, p+2, p+6): ${triples.length} witnesses.`,
      `Prime sextuples (p+{0,4,6,10,12,16}): ${sextuples.length} witnesses.`,
      `${pairsWithinMT_bound}/${primes.length-1} adjacent prime pairs have gap ≤ 246 (Maynard-Tao bound) = ${((pairsWithinMT_bound/(primes.length-1))*100).toFixed(2)}%.`,
    ],

    relationToRH: {
      grhConnection:
        'Maynard-Tao H_1 ≤ 6 under GRH shows that GRH → sharper prime-gap bounds. ' +
        'Since GRH extends RH to L-functions, bounded gaps are GRH-equivalents.',
      significanceForRH:
        'Bounded prime gaps are a TRIUMPH of modern analytic number theory. ' +
        'The methods (Goldston-Pintz-Yıldırım sieve + Zhang-Maynard modifications) ' +
        'connect prime distribution to L-function theory — the same machinery behind RH.',
    },

    nextStep:
      'Extend to x = 10⁸+ for better HL ratio convergence. ' +
      'Find smallest prime k-tuples for each k ≤ 20. ' +
      'Test Polignac\'s conjecture: infinitely many p_{n+1}-p_n = g for every even g (case g=2 is twin prime).',

    verdict:
      `BOUNDED PRIME GAPS: ${gapCounts[0].actual} twin primes, ${triples.length} triples, ${sextuples.length} sextuples up to 10^6. ` +
      `${pairsWithinMT_bound} pairs with gap ≤ 246 (Maynard-Tao 2014 lim inf). ` +
      `${pairsWithinGRH_bound} pairs with gap ≤ 6 (GRH-conditional Maynard 2014 lim inf). ` +
      'Numerical evidence for Zhang-Maynard-Tao bounded-gap framework.',
  };
}
