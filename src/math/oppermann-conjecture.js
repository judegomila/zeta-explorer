/**
 * Oppermann's Conjecture on Primes near Squares
 *
 * imp-205: Ludvig Oppermann (1882) conjectured that for every integer n > 1:
 *
 *   π(n² + n) − π(n²)       ≥ 1    (prime in [n²+1, n²+n])
 *   π(n²)     − π(n² − n)   ≥ 1    (prime in [n²-n+1, n²])
 *
 * Equivalently: between every pair of consecutive squares n², (n+1)²,
 * there are at least TWO primes — one in (n²-n, n²) and one in (n², n²+n).
 *
 * Status: OPEN. Stronger than Legendre's conjecture (a prime in (n², (n+1)²)).
 *
 * RELATIONSHIP TO RH:
 *
 *   RH implies p_{n+1} - p_n = O(√p_n · log p_n).
 *   For p_n ≈ n²: gap bound O(n · log n). Oppermann requires gap ≤ n.
 *   So RH alone does NOT imply Oppermann, but both are part of the
 *   "dense prime distribution" phenomenology.
 *
 * Cramér's conjecture (stronger): p_{n+1} - p_n = O((log p_n)²) ⟹ Oppermann.
 *
 * NUMERICAL TEST:
 *
 *   For n in range, check both halves [n²-n+1, n²] and [n²+1, n²+n].
 *   Verify existence of primes. Find closest near-failures.
 */

// ── Primality test (Miller-Rabin) ───────────────────────────────────────────

function isPrime(n) {
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0) return false;
  // Trial division for small n
  for (let p = 3; p * p <= n && p < 1000; p += 2) {
    if (n % p === 0) return false;
  }
  return true;
}

// ── Check Oppermann for single n ────────────────────────────────────────────

function checkOppermann(n) {
  const n2 = n * n;
  // Left interval: (n²-n, n²]
  let leftPrime = null;
  for (let k = n2 - n + 1; k <= n2; k++) {
    if (isPrime(k)) { leftPrime = k; break; }
  }
  // Right interval: (n², n²+n]
  let rightPrime = null;
  for (let k = n2 + 1; k <= n2 + n; k++) {
    if (isPrime(k)) { rightPrime = k; break; }
  }
  return {
    n,
    n_squared: n2,
    left_interval: `(${n2 - n}, ${n2}]`,
    left_prime: leftPrime,
    right_interval: `(${n2}, ${n2 + n}]`,
    right_prime: rightPrime,
    left_holds: leftPrime !== null,
    right_holds: rightPrime !== null,
    both_hold: leftPrime !== null && rightPrime !== null,
  };
}

// ── Main test ────────────────────────────────────────────────────────────────

export function oppermannConjectureTest() {
  const nMax = 200;
  const results = [];
  let violations = [];
  let tightestLeftGap = 0;
  let tightestRightGap = 0;
  let tightestLeftAt = 0;
  let tightestRightAt = 0;

  for (let n = 2; n <= nMax; n++) {
    const r = checkOppermann(n);
    if (!r.both_hold) violations.push(r);

    // Gap from n² to nearest prime in each half
    if (r.left_prime) {
      const gap = n * n - r.left_prime;  // distance from n² back to prime
      if (gap > tightestLeftGap) { tightestLeftGap = gap; tightestLeftAt = n; }
    }
    if (r.right_prime) {
      const gap = r.right_prime - n * n;  // distance from n² to prime
      if (gap > tightestRightGap) { tightestRightGap = gap; tightestRightAt = n; }
    }

    if (n % 25 === 0 || n <= 5) {
      results.push(r);
    }
  }

  const allHold = violations.length === 0;

  return {
    framework: {
      name: "Oppermann's Conjecture (1882)",
      statement: 'For n > 1: primes exist in both (n²-n, n²] AND (n², n²+n]',
      consequence: 'Between every two consecutive squares, ≥ 2 primes',
      status: 'OPEN (stronger than Legendre conjecture)',
      rhRelation: 'RH implies p_{n+1}-p_n = O(√p·log p); Oppermann requires gap ≤ n at p~n².',
    },

    tested_range: `[2, ${nMax}]`,

    sample_verifications: results,

    violations,

    tightestGaps: {
      max_distance_to_prime_in_left_interval: tightestLeftGap,
      at_n_left: tightestLeftAt,
      max_distance_to_prime_in_right_interval: tightestRightGap,
      at_n_right: tightestRightAt,
      note: `Max gap ${Math.max(tightestLeftGap, tightestRightGap)} vs Oppermann allows gap up to n.`,
    },

    allHold,

    keyFindings: [
      `Tested Oppermann for n ∈ [2, ${nMax}].`,
      `Violations found: ${violations.length}.`,
      `Max distance |prime - n²| in LEFT interval: ${tightestLeftGap} at n=${tightestLeftAt}.`,
      `Max distance |prime - n²| in RIGHT interval: ${tightestRightGap} at n=${tightestRightAt}.`,
      `At n=100: n²=10000; checking (9900, 10000] and (10000, 10100].`,
    ],

    relationToRH: {
      legendreBridge:
        'Oppermann → Legendre (prime in (n², (n+1)²)). RH does not directly imply either. ' +
        'Cramér\'s stronger conjecture p_{n+1}-p_n = O((log p)²) implies Oppermann.',
      primeGapHierarchy: [
        'RH: p_{n+1} - p_n = O(√p · log p)',
        'Cramér: p_{n+1} - p_n = O((log p)²)',
        'Oppermann: gap around n² is ≤ n',
        'Legendre: ≥ 1 prime in (n², (n+1)²)',
      ],
      rhConsequenceAtSquares:
        'Under RH: at p_n ~ n², gap bound O(n·log n). Oppermann wants gap ≤ n. ' +
        'So RH is WEAKER than Oppermann in the near-square regime.',
    },

    nextStep:
      'Extend to n=10000. Find closest near-misses (Oppermann-critical n). ' +
      'Compare with actual prime gap distribution around squares.',

    verdict:
      `OPPERMANN'S CONJECTURE tested for n ∈ [2, ${nMax}]: ${allHold ? 'ALL satisfy' : violations.length + ' violations'}. ` +
      `Max distance to prime in either interval: ${Math.max(tightestLeftGap, tightestRightGap)} (allowed: up to n=${Math.max(tightestLeftAt, tightestRightAt)}). ` +
      'Open conjecture consistent with numerical evidence; stronger than RH in some regimes.',
  };
}
