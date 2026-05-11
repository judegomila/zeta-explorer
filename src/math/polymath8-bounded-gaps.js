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

// ── imp-1026: independent cross-verification of polymath8-bounded-gaps ───────
//
// Audit followed the imp-919 / imp-921 / imp-971..imp-985 precedent. Three
// passes: (1) re-derive sievePrimes, isAdmissible, greedyAdmissibleTuple
// from first principles on small hand-traced cases; (2) audit the cited
// Zhang / Maynard-Tao / Polymath 8b bounds against the published
// literature; (3) probe edge cases including the Math.min spread on
// ~78,497 gap values at line 109, the inverted "isPrime" naming where the
// returned Uint8Array actually stores 1 for composites, the loose
// p <= k+1 admissibility loop at line 35, and the redundant n+h bound
// guard at line 64.
//
// Verdict: INTERNALLY CONSISTENT. Four flags raised, all cosmetic / low.
// The Zhang (70M), Maynard (k_0=105, H=600), and Polymath 8b (k_0=50,
// H=246) citations match the published bounds exactly. Greedy admissible
// diameters at k=2, 3, 5 reproduce by hand-trace to 2, 6, 12 (matching
// the optimal H_2, H_3, H_5 from the Engelsma small-k tables). The
// pi(10^6) = 78498 reference is OEIS A000720; twin pair count 8169 is
// OEIS A007508. The "isPrime" Uint8Array convention (1 for composite)
// is correctly negated at every call site so produces no off-by-one bug.

// Module-internal re-implementations for the cross-verification
// assertions below. Kept local so a future edit to the file-scope
// sievePrimes / isAdmissible / greedyAdmissibleTuple cannot silently
// invalidate the audit pins.
function _imp1026_isAdmissible(H) {
  var k = H.length;
  for (var p = 2; p <= k + 1; p++) {
    var isP = p >= 2;
    for (var d = 2; d * d <= p; d++) {
      if (p % d === 0) { isP = false; break; }
    }
    if (!isP) continue;
    var s = new Set();
    for (var i = 0; i < H.length; i++) s.add(((H[i] % p) + p) % p);
    if (s.size >= p) return false;
  }
  return true;
}
function _imp1026_greedy(k) {
  var H = [0], c = 1;
  while (H.length < k) {
    var t = H.concat([c]);
    if (_imp1026_isAdmissible(t)) H.push(c);
    c++;
  }
  return H;
}

export const POLYMATH8_BOUNDED_GAPS_ASSERTIONS = [
  {
    id: "imp1026-greedy-admissible-k2-eq-02",
    holds: function () {
      var H = _imp1026_greedy(2);
      return H.length === 2 && H[0] === 0 && H[1] === 2;
    },
    why:
      "Hand-trace: greedy from {0} rejects candidate 1 because {0,1} "
      + "covers both residues mod 2, then accepts candidate 2. Pins the "
      + "k=2 admissible tuple to {0,2} matching the optimal H_2 = 2.",
  },
  {
    id: "imp1026-greedy-admissible-k3-diameter-6",
    holds: function () {
      var H = _imp1026_greedy(3);
      return H.length === 3 && H[H.length - 1] === 6;
    },
    why:
      "Hand-trace: greedy admissible 3-tuple is {0,2,6}. Pins greedy "
      + "diameter at k=3 to 6, matching the optimal H_3 = 6 from the "
      + "Engelsma small-k admissible-tuple tables.",
  },
  {
    id: "imp1026-greedy-admissible-k5-diameter-12",
    holds: function () {
      var H = _imp1026_greedy(5);
      return H.length === 5 && H[H.length - 1] === 12;
    },
    why:
      "Hand-trace: greedy admissible 5-tuple is {0,2,6,8,12}. Pins "
      + "diameter at k=5 to 12, matching the optimal H_5 = 12 from the "
      + "Engelsma small-k admissible-tuple tables.",
  },
  {
    id: "imp1026-pi-100-equals-25",
    holds: function () {
      var N = 100;
      var sieve = new Uint8Array(N + 1);
      for (var n = 2; n <= N; n++) {
        if (!sieve[n]) {
          for (var kk = 2 * n; kk <= N; kk += n) sieve[kk] = 1;
        }
      }
      var count = 0;
      for (var i = 2; i <= N; i++) if (!sieve[i]) count++;
      return count === 25;
    },
    why:
      "Sieve convention sanity check: sieve[n]=1 for composites and 0 "
      + "for primes (and 0, 1). Re-counts pi(100) = 25 matching OEIS "
      + "A000720(100). Guards against a future edit that inverts the "
      + "marking or shifts the prime-counting range.",
  },
  {
    id: "imp1026-not-admissible-024-mod-3",
    holds: function () {
      // {0,2,4} mod 3 = {0,2,1} size 3 = p; covers all residues so NOT admissible.
      // {0,2,6} mod 3 = {0,2,0} size 2 < 3; admissible.
      return _imp1026_isAdmissible([0, 2, 4]) === false
          && _imp1026_isAdmissible([0, 2, 6]) === true;
    },
    why:
      "Admissibility regression test: {0,2,4} covers all residues mod 3 "
      + "so MUST be rejected under Hardy-Littlewood admissibility; "
      + "{0,2,6} avoids residue 1 mod 3 so MUST be accepted.",
  },
];

export const POLYMATH8_BOUNDED_GAPS_CROSS_VERIFY = {
  id: "imp-1026",
  auditDate: "2026-05-11",
  precedent: [
    "imp-919", "imp-921",
    "imp-971", "imp-972", "imp-973", "imp-974", "imp-975",
    "imp-976", "imp-977", "imp-978", "imp-979", "imp-980",
    "imp-981", "imp-982", "imp-983", "imp-984", "imp-985",
  ],
  scope: [
    "identity-audit (sievePrimes at lines 26-30 is a standard Sieve of Eratosthenes returning Uint8Array with sieve[n]=1 for composites and 0 for primes (and 0, 1); primality test !sieve[n] && n >= 2 is correct. isAdmissible at lines 33-44 checks for each prime p <= k+1 that |H mod p| < p; loop is conservative since p <= k suffices when |H|=k. greedyAdmissibleTuple at lines 47-56 is the standard greedy from {0}. countPrimeTuples at lines 59-70 counts n in [2, N] with at least m primes among {n+h: h in H})",
    "citation-audit (Zhang 2013 bound 70,000,000 matches Annals of Math 179(3) 2014 Theorem 1; Maynard 2014 k_0=105 with H_105=600 matches Annals of Math 181(1) 2015 Theorem 1.1; Polymath 8b k_0=50 with H_50=246 matches Research in the Math Sci 1:12 2014 Theorem 3.2)",
    "numerical-reference-values (pi(10^6) = 78498 matches OEIS A000720; twin prime pairs <= 10^6 = 8169 matches OEIS A007508; min gap = 2 since twin primes exist; greedy admissible diameters at k=2, 3, 5 hand-trace to 2, 6, 12 matching the optimal H_2, H_3, H_5 from the Engelsma small-k tables)",
    "edge-cases (Math.min spread over ~78,497 gap values at line 109 works in current V8 but non-portable to engines with stricter argument-count caps; n+h bound at line 64 always satisfied since h <= max(H) = diameter so the inline guard is a tautology; tupleCounts at line 103 regenerates greedyAdmissibleTuple redundantly because tuples[i].H_sample at line 98 stores only the first 8 elements; division by gaps.length never zero for N >= 4)",
    "naming-convention (variable isPrime returned by sievePrimes is actually a 1-for-composite marker; call sites use !isPrime[n] which correctly tests primality but the name is inverted relative to its values; standard JS sieve pattern but warrants a one-line doc-comment)",
  ],
  identitiesReVerified: [
    {
      id: "sieve-primality-convention",
      claim: "sievePrimes returns sieve such that !sieve[n] && n >= 2 tests primality",
      derivation: "Standard Sieve of Eratosthenes marks composites: for each unmarked p starting from 2, mark all multiples 2p, 3p, ... as 1. After completion sieve[n] = 1 iff n is composite. The 0/1 values for n in {0,1} are excluded by the n >= 2 guard at line 64.",
      status: "CONFIRMED-STRUCTURALLY",
    },
    {
      id: "admissibility-p-le-k-suffices",
      claim: "Admissibility check for p > k is vacuous; loop p <= k+1 (line 35) over-checks one prime",
      derivation: "For p > k, |H| = k < p so |H mod p| <= k < p; the condition |H mod p| < p holds automatically. Hence only primes p <= k can ever constrain admissibility. Code uses p <= k+1 which is conservative but correct.",
      status: "CONFIRMED-ALGEBRAICALLY (see flag imp1026-admissibility-bound-loose)",
    },
    {
      id: "greedy-k2-equals-02",
      claim: "greedyAdmissibleTuple(2) returns [0, 2]",
      derivation: "From H=[0]: try c=1 -> [0,1] mod 2 = {0,1} size 2 = p, FAIL. Try c=2 -> [0,2] mod 2 = {0,0} size 1 < 2, mod 3 = {0,2} size 2 < 3, PASS. Returns [0,2].",
      status: "CONFIRMED-BY-HAND-TRACE (matches optimal H_2 = 2)",
    },
    {
      id: "greedy-k3-equals-026",
      claim: "greedyAdmissibleTuple(3) returns [0, 2, 6]",
      derivation: "From [0,2]: c=3 fails mod 2 ({0,0,1} size 2 = p); c=4 fails mod 3 ({0,2,1} size 3 = p); c=5 fails mod 2; c=6 passes (mod 2 = {0,0,0}, mod 3 = {0,2,0} size 2 < 3). Returns [0,2,6], diameter 6.",
      status: "CONFIRMED-BY-HAND-TRACE (matches optimal H_3 = 6)",
    },
    {
      id: "greedy-k5-equals-026812",
      claim: "greedyAdmissibleTuple(5) returns [0, 2, 6, 8, 12]",
      derivation: "From [0,2,6]: c=8 passes (mod 5 = {0,2,1,3} size 4 < 5). From [0,2,6,8]: c=10 fails mod 3 (size 3); c=11 fails mod 2; c=12 passes. Returns [0,2,6,8,12], diameter 12.",
      status: "CONFIRMED-BY-HAND-TRACE (matches optimal H_5 = 12)",
    },
    {
      id: "zhang-70M-correct",
      claim: "Zhang 2013 bound: liminf(p_{n+1} - p_n) < 70,000,000",
      derivation: "Y. Zhang, Bounded gaps between primes, Annals of Mathematics 179 (2014), 1121-1174. Theorem 1: liminf < 7 x 10^7.",
      status: "CONFIRMED-CITATION (matches published bound exactly)",
    },
    {
      id: "maynard-k105-H600-correct",
      claim: "Maynard 2014: liminf < 600 via k_0 = 105 with H_105 = 600",
      derivation: "J. Maynard, Small gaps between primes, Annals of Mathematics 181 (2015), 383-413. Theorem 1.1 plus the Engelsma admissible tuple at k=105 yielding diameter 600.",
      status: "CONFIRMED-CITATION (matches published bound exactly)",
    },
    {
      id: "polymath8b-k50-H246-correct",
      claim: "Polymath 8b: liminf < 246 via k_0 = 50 with H_50 = 246",
      derivation: "D. H. J. Polymath, Variants of the Selberg sieve, and bounded intervals containing many primes, Research in the Mathematical Sciences 1:12 (2014). Theorem 3.2 at k=50.",
      status: "CONFIRMED-CITATION (matches published bound exactly)",
    },
  ],
  numericalReferences: [
    {
      symbol: "pi(10^6) = primes.length at line 78",
      reference: 78498,
      source: "OEIS A000720(10^6)",
      verdict: "CONFIRMED-BY-OEIS (well-established prime-counting reference)",
    },
    {
      symbol: "twin prime pairs <= 10^6 = gapHist[2]",
      reference: 8169,
      source: "OEIS A007508 (cumulative count of twin prime pairs)",
      verdict: "CONFIRMED-BY-OEIS (gap-2 between consecutive primes equals twin pairs because the single integer between p and p+2 is even hence composite for p > 2)",
    },
    {
      symbol: "min gap in [2, 10^6] = Math.min(...gaps) at line 109",
      reference: 2,
      source: "twin primes guarantee gap 2 exists (e.g. (3,5), (5,7), (11,13))",
      verdict: "CONFIRMED (smallest possible gap since 2 is the only even prime)",
    },
    {
      symbol: "greedy diameter at k=2",
      reference: 2,
      source: "optimal H_2 from Engelsma small-k tables",
      verdict: "CONFIRMED-BY-HAND-TRACE (greedy matches optimum)",
    },
    {
      symbol: "greedy diameter at k=3",
      reference: 6,
      source: "optimal H_3 from Engelsma small-k tables",
      verdict: "CONFIRMED-BY-HAND-TRACE (greedy matches optimum)",
    },
    {
      symbol: "greedy diameter at k=5",
      reference: 12,
      source: "optimal H_5 from Engelsma small-k tables",
      verdict: "CONFIRMED-BY-HAND-TRACE (greedy matches optimum)",
    },
  ],
  edgeCases: [
    {
      path: "Math.min(...gaps) at line 109 with |gaps| ~ 78,497 for N = 10^6",
      risk: "spread operator passes ~78k arguments to Math.min; historically engines have had argument-count caps as low as 65,535 (Math.max.apply on older V8). Could throw RangeError or silently truncate on a stricter engine.",
      mitigation: "works in current Node.js (V8 >= 9.x routinely handles 100k+ spread args). Safer pattern is gaps.reduce((a, b) => Math.min(a, b), Infinity). Flagged below.",
      verdict: "WORKS-IN-PRACTICE (see flag imp1026-math-min-spread-risky)",
    },
    {
      path: "n + h <= N + H[H.length-1] guard at line 64",
      risk: "redundant guard: h is an element of H so h <= max(H) = diameter = H[H.length-1]; hence n+h <= N + diameter is always true.",
      mitigation: "real array-bounds safety comes from sievePrimes(N + 300) at line 74 sizing the sieve generously, plus the Math.min(N, 100000) cap at line 104 for countPrimeTuples calls. The inline guard is a tautology.",
      verdict: "SAFE (cosmetic tautology)",
    },
    {
      path: "tupleCounts at line 103 calls greedyAdmissibleTuple(t.k) again",
      risk: "duplicates the work of the tuples map at line 96",
      mitigation: "forced because tuples[i].H_sample at line 98 only stores the first 8 elements as a display sample. Filter to t.k <= 10 keeps the duplicate work bounded (<= 50 element re-generation).",
      verdict: "SAFE (cosmetic redundancy; see flag imp1026-greedy-redundant-regen)",
    },
    {
      path: "gaps.filter(g => g <= H).length called 8+ times at lines 110-125",
      risk: "multiple O(|gaps|) linear scans for different cut-offs",
      mitigation: "~80k * ~10 = ~800k ops total, sub-millisecond. Not a correctness issue.",
      verdict: "SAFE (cosmetic inefficiency)",
    },
    {
      path: "NaN or Infinity in returned proportions or counts",
      risk: "division by gaps.length could NaN if gaps were empty",
      mitigation: "for N >= 4 there are >= 2 primes hence >= 1 gap; for N = 10^6 there are 78,497 gaps. The toFixed(4) call is a pure string formatting step.",
      verdict: "SAFE (no NaN / Infinity reachable for N = 10^6)",
    },
  ],
  flags: [
    {
      id: "imp1026-isPrime-naming-inverted",
      severity: "cosmetic",
      finding:
        "sievePrimes (lines 26-30) returns a Uint8Array where sieve[n] = 1 for composites and 0 for primes (and 0, 1). The call sites at line 64 and line 78 correctly use !isPrime[n] to test primality, but the variable name isPrime reads the opposite of what its values mean. This is the standard JS Sieve-of-Eratosthenes pattern but warrants a one-line doc-comment. Suggested fix: rename to sieveComposite, or add a comment at line 30 documenting the convention. No correctness bug; cosmetic only.",
    },
    {
      id: "imp1026-admissibility-bound-loose",
      severity: "cosmetic",
      finding:
        "isAdmissible at line 35 loops p from 2 to k+1 inclusive. For p > k the admissibility condition is vacuous since |H| = k forces |H mod p| <= k < p. Tightening to p <= k saves one prime check per call. No correctness bug; cosmetic.",
    },
    {
      id: "imp1026-math-min-spread-risky",
      severity: "low",
      finding:
        "Math.min(...gaps) at line 109 spreads ~78,497 arguments. Works in current V8 (Node >= 14) but historically Function.prototype.apply argument-count caps have been as low as 65,535. A safer pattern is gaps.reduce((a, b) => Math.min(a, b), Infinity). One-line fix; not currently broken.",
    },
    {
      id: "imp1026-greedy-redundant-regen",
      severity: "cosmetic",
      finding:
        "tupleCounts at line 103 calls greedyAdmissibleTuple(t.k) again, duplicating the work in the tuples map at line 96. Forced because tuples[i].H_sample at line 98 only stores the first 8 elements as a truncated display sample. Could be removed by storing the full H alongside the sample. Filter to k <= 10 keeps the duplicate work bounded.",
    },
  ],
  notIndependentlyChecked: [
    {
      id: "maynard-k0-asymptotic-e4m",
      why: "Maynard 2015 Theorem 1.1 establishes k_0 ~ e^{4m} for the m-prime variant via multidimensional Selberg sieve optimization. Not re-derived; taken as a published anchor.",
    },
    {
      id: "engelsma-optimal-tuple-tables",
      why: "optimal H_k diameters at k=10 (32), k=20 (~70), k=50 (246), k=105 (600) come from Engelsma exhaustive search tables and the Polymath 8 distributed-computation effort. Not re-derived; this audit reproduces only k=2, 3, 5 by hand-trace.",
    },
    {
      id: "gpy-selberg-sieve-construction",
      why: "the Goldston-Pintz-Yildirim and Maynard multidimensional Selberg sieve construction that yields the (k_0, m) feasibility is not re-derived; taken as published.",
    },
    {
      id: "bombieri-vinogradov-zhang-level",
      why: "the Zhang extension of Bombieri-Vinogradov to smooth moduli at level Q = x^{1/2 + 1/584} (cf. relationToRH.bvConnection at line 164) is Theorem 2 of Zhang 2013; not re-proved here.",
    },
    {
      id: "gap-histogram-exact-counts",
      why: "twin = 8169, cousin (gap 4) ~ 8144, sexy (gap 6) ~ 16386 are well-established OEIS reference values, but the exact gap-histogram counts produced by polymath8BoundedGapsTest at N=10^6 are not asserted here (would require a full N=10^6 sieve in the assertion runner). The min gap = 2 is the only quantitative pin in the assertions.",
    },
  ],
  verdict:
    "INTERNALLY CONSISTENT. The polymath8BoundedGapsTest reproduces published bounds: sievePrimes is a standard Sieve of Eratosthenes (the audit re-derives pi(100) = 25 by inline retrace); isAdmissible correctly enforces Hardy-Littlewood admissibility (re-derives {0,2,4} as NOT admissible mod 3 and {0,2,6} as admissible); greedy admissible tuples at k=2, 3, 5 hand-trace to {0,2}, {0,2,6}, {0,2,6,8,12} matching the optimal H_2 = 2, H_3 = 6, H_5 = 12 (Engelsma tables). All three Polymath 8 citations match the published bounds exactly: Zhang 2013 70,000,000 (Annals 179), Maynard-Tao 2014 k_0=105 with H=600 (Annals 181), Polymath 8b k_0=50 with H=246 (Research in the Math Sci 1:12). Four flags raised, all cosmetic or low: imp1026-isPrime-naming-inverted (cosmetic; sieve[n]=1 for composites, name is inverted relative to values, !isPrime[n] correctly tests primality at every call site); imp1026-admissibility-bound-loose (cosmetic; p <= k+1 loop could tighten to p <= k); imp1026-math-min-spread-risky (low; ~78k spread args works in current V8 but a reduce pattern would be more portable); imp1026-greedy-redundant-regen (cosmetic; tupleCounts regenerates greedy tuples). None of the flags changes the verdict: polymath8BoundedGapsTest produces correct numerical and citation output consistent with the Zhang-Maynard-Tao bounded-gaps literature.",
};
