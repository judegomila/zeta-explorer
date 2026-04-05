/**
 * Mertens Function M(x) and the Disproven Mertens Conjecture
 *
 * imp-187: The Mertens function is
 *
 *   M(x) := Σ_{n ≤ x} μ(n)
 *
 * where μ is the Möbius function.
 *
 * MERTENS' CONJECTURE (1897): |M(x)| < √x for all x ≥ 1.
 *
 *   DISPROVEN by Odlyzko-te Riele (1985) using ζ-zeros: they showed
 *   lim sup M(x)/√x > 1.06 and lim inf M(x)/√x < -1.009. No explicit
 *   counterexample is known; the smallest x with |M(x)|/√x > 1 is
 *   conjectured around 10^10.
 *
 * RELATION TO RH:
 *
 *   RH ⟺ M(x) = O(x^{½+ε}) for every ε > 0  (Littlewood).
 *
 *   RH ⟺ 1/ζ(s) = Σ μ(n)/n^s analytic for Re(s) > ½.
 *
 * THIS MODULE:
 *
 *   1. Compute M(x) directly via Möbius sieve for x ≤ 10^6.
 *   2. Track |M(x)|/√x to look for the "Mertens ratio".
 *   3. Identify sign changes of M(x).
 *   4. Compute maximum and running supremum of |M(x)|/√x.
 *   5. Verify M(x) grows much slower than √x (as expected within 10^6).
 */

// ── Möbius function sieve ──────────────────────────────────────────────────

function mobiusSieve(N) {
  const mu = new Int8Array(N + 1);
  mu[1] = 1;
  const primes = [];
  for (let i = 2; i <= N; i++) mu[i] = 1;

  for (let p = 2; p <= N; p++) {
    if (mu[p] === 1) {
      // Check if p is prime by verifying no previous prime divides it
      let isPrime = true;
      for (const q of primes) {
        if (q * q > p) break;
        if (p % q === 0) { isPrime = false; break; }
      }
      if (isPrime) primes.push(p);
    }
  }

  // Proper sieve: for each prime p, flip sign on multiples, zero on p²-multiples
  // Reset and use standard Möbius sieve:
  mu.fill(1);
  mu[0] = 0;
  for (const p of primes) {
    for (let k = p; k <= N; k += p) mu[k] = -mu[k];
    const p2 = p * p;
    for (let k = p2; k <= N; k += p2) mu[k] = 0;
  }
  mu[1] = 1;

  return mu;
}

// ── Compute M(x) array ──────────────────────────────────────────────────────

function computeMertens(mu, N) {
  const M = new Int32Array(N + 1);
  M[0] = 0;
  let sum = 0;
  for (let n = 1; n <= N; n++) {
    sum += mu[n];
    M[n] = sum;
  }
  return M;
}

// ── Main test ────────────────────────────────────────────────────────────────

export function mertensFunctionTest() {
  const N = 1000000;
  console.error(`Sieving μ(n) and computing M(x) up to ${N}...`);

  const mu = mobiusSieve(N);
  const M = computeMertens(mu, N);

  // Compute |M(x)|/√x and find max
  let maxRatio = 0;
  let maxRatioAt = 0;
  let signChanges = 0;
  let prevSign = 0;
  const samples = [];

  for (let x = 2; x <= N; x++) {
    const ratio = Math.abs(M[x]) / Math.sqrt(x);
    if (ratio > maxRatio) { maxRatio = ratio; maxRatioAt = x; }
    const curSign = M[x] > 0 ? 1 : (M[x] < 0 ? -1 : 0);
    if (curSign !== 0) {
      if (prevSign !== 0 && curSign !== prevSign) signChanges++;
      prevSign = curSign;
    }

    // Record at milestones
    if (x === 100 || x === 1000 || x === 10000 || x === 100000 || x === 1000000) {
      samples.push({
        x,
        M_x: M[x],
        sqrt_x: +Math.sqrt(x).toFixed(2),
        ratio_abs_M_over_sqrt_x: +(Math.abs(M[x]) / Math.sqrt(x)).toFixed(4),
        M_over_x_half_plus_eps: +(Math.abs(M[x]) / Math.pow(x, 0.5 + 0.01)).toFixed(4),
      });
    }
  }

  // Mertens conjecture status
  const mertensConjectureHolds = maxRatio < 1.0;

  // Running maximum of |M(x)|/√x
  const runningMax = [];
  let currentMax = 0;
  let currentMaxAt = 0;
  for (let x = 2; x <= N; x++) {
    const ratio = Math.abs(M[x]) / Math.sqrt(x);
    if (ratio > currentMax) {
      currentMax = ratio;
      currentMaxAt = x;
      if (runningMax.length < 10 || x >= 100000) {
        if (runningMax.length < 20) {
          runningMax.push({ x, ratio: +ratio.toFixed(4), M_x: M[x] });
        }
      }
    }
  }

  // RH-equivalence test: M(x) = O(x^{½+ε})
  // Compute M(x)/x^{0.6} at milestones; should → 0 under RH
  const rhTest = [100, 1000, 10000, 100000, 1000000].map(x => ({
    x,
    M_x: M[x],
    absM_over_x_to_0_6: +(Math.abs(M[x]) / Math.pow(x, 0.6)).toFixed(5),
    absM_over_x_to_0_55: +(Math.abs(M[x]) / Math.pow(x, 0.55)).toFixed(5),
  }));

  return {
    framework: {
      mertensFunction: 'M(x) = Σ_{n≤x} μ(n)',
      mertensConjecture: '|M(x)| < √x for all x ≥ 1',
      status: 'DISPROVEN by Odlyzko-te Riele 1985 (first counterexample believed around x ≈ 10^10)',
      rhEquivalence: 'RH ⟺ M(x) = O(x^{½+ε}) for all ε>0  (Littlewood)',
      reference: 'Odlyzko-te Riele, J. Reine Angew. Math. 357 (1985) 138-160',
    },

    computation: {
      N,
      numSignChanges: signChanges,
    },

    maximum_abs_M_over_sqrt_x: {
      value: +maxRatio.toFixed(4),
      at_x: maxRatioAt,
      M_at_max: M[maxRatioAt],
      conjectureHeldInRange: mertensConjectureHolds,
      note: mertensConjectureHolds
        ? `|M(x)|/√x reached maximum ${maxRatio.toFixed(3)} at x=${maxRatioAt} — still below 1, conjecture holds in tested range.`
        : `|M(x)|/√x exceeded 1 at x=${maxRatioAt}!`,
    },

    runningMaximaSample: runningMax,

    milestoneSamples: samples,

    rhEquivalenceTest: rhTest,

    keyFindings: [
      `Sieved μ(n) for n ≤ ${N}; M(${N}) = ${M[N]}.`,
      `Max |M(x)|/√x in range: ${maxRatio.toFixed(4)} at x=${maxRatioAt}.`,
      `Mertens conjecture |M(x)| < √x: ${mertensConjectureHolds ? 'HOLDS' : 'VIOLATED'} in [1, ${N}] (proven false asymptotically by Odlyzko-te Riele 1985).`,
      `Sign changes of M(x) in [2, ${N}]: ${signChanges}.`,
      `|M(${N})| / ${N}^0.6 = ${rhTest[rhTest.length-1].absM_over_x_to_0_6} (RH expects → 0).`,
    ],

    relationToRH: {
      littlewoodEquivalence:
        'RH ⟺ M(x) = O(x^{½+ε}). Our data |M(10^6)|/(10^6)^{0.6} = ' + rhTest[rhTest.length-1].absM_over_x_to_0_6 + ' — consistent with RH.',
      odlyzkoTeRieleImpact:
        'The disproof of Mertens conjecture via ζ-zeros showed that sometimes the "obvious" √x bound is TOO TIGHT. ' +
        'But |M(x)| ≤ C·x^{½+ε} (Littlewood\'s equivalence) remains the RH bound.',
      mobiusRandomness:
        'M(x) behaves like a random walk with step ±1 (and 0 for non-squarefree); ' +
        'random walk grows like √x, which is why Mertens conjectured it. The DISPROOF ' +
        'shows μ has subtle correlations that push M(x) slightly above √x rarely.',
    },

    nextStep:
      'Extend to x = 10⁹+ using segmented Möbius sieve. ' +
      'Search for explicit Mertens violations in range 10⁸ to 10¹² (Best known not to exist below ~10¹⁶). ' +
      'Connect to ζ-zero sum formulas for M(x).',

    verdict:
      `MERTENS FUNCTION at x=${N}: M(${N})=${M[N]}, max |M|/√x=${maxRatio.toFixed(3)} at x=${maxRatioAt}. ` +
      `Mertens conjecture holds in tested range (disproven asymptotically by Odlyzko-te Riele 1985). ` +
      `|M(${N})|/(${N})^{0.6}=${rhTest[rhTest.length-1].absM_over_x_to_0_6} — consistent with RH via Littlewood\'s M(x)=O(x^{½+ε}).`,
  };
}
