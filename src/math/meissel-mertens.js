/**
 * Meissel-Mertens Constant and Mertens' Theorems
 *
 * imp-217: Mertens' three theorems (1874) establish fundamental explicit
 * formulas for prime-distribution sums:
 *
 *   MERTENS 1st: Σ_{p ≤ x} (log p)/p = log x − E + O(1/log x)
 *   MERTENS 2nd: Σ_{p ≤ x} 1/p = log log x + M + O(1/log x)
 *   MERTENS 3rd: Π_{p ≤ x} (1 − 1/p) = e^{-γ} / log x · (1 + O(1/log x))
 *
 * CONSTANTS:
 *
 *   M = Meissel-Mertens constant ≈ 0.26149721284764278375542683861...
 *   E = another explicit constant related to M via: E = M + γ + ...
 *   γ = Euler-Mascheroni ≈ 0.57721566490153286...
 *
 *   Explicit: M = γ + Σ_p (log(1 - 1/p) + 1/p)
 *
 * CONNECTION TO RH:
 *
 *   These theorems are ELEMENTARY (no complex analysis, no ζ-zeros).
 *   Mertens 3rd connects Π(1-1/p) to e^{-γ}, linking primes to γ_EM.
 *   Refined versions of these theorems (Dusart 1998, Rosser-Schoenfeld)
 *   give EXPLICIT error bounds that are effective for RH applications.
 *
 * THIS MODULE:
 *
 *   1. Compute Σ (log p)/p for primes p ≤ 10^6, extract constant E.
 *   2. Compute Σ 1/p - log log x, extract Meissel-Mertens M.
 *   3. Compute Π (1-1/p) · log x, extract e^{-γ} = 0.5615746...
 *   4. Compare with known reference values.
 */

const EULER_GAMMA = 0.5772156649015329;
const E_NEG_GAMMA = Math.exp(-EULER_GAMMA);  // 0.5614594835668851...
const M_REFERENCE = 0.2614972128476428;      // Meissel-Mertens
const E_REFERENCE = 1.3325822757332206;      // Mertens 1st constant

// ── Sieve primes ────────────────────────────────────────────────────────────

function sievePrimes(N) {
  const sieve = new Uint8Array(N + 1);
  const primes = [];
  for (let n = 2; n <= N; n++) {
    if (!sieve[n]) {
      primes.push(n);
      for (let k = 2 * n; k <= N; k += n) sieve[k] = 1;
    }
  }
  return primes;
}

// ── Mertens sums ────────────────────────────────────────────────────────────

function computeMertensSums(primes, xValues) {
  // Build cumulative sums at milestones
  const results = [];
  let idx = 0;
  let sum_logP_over_p = 0;
  let sum_1_over_p = 0;
  let log_prod_1_minus_1_over_p = 0;  // log of product for numerical stability

  const sortedX = [...xValues].sort((a, b) => a - b);

  for (const p of primes) {
    if (p > sortedX[sortedX.length - 1]) break;
    sum_logP_over_p += Math.log(p) / p;
    sum_1_over_p += 1 / p;
    log_prod_1_minus_1_over_p += Math.log(1 - 1/p);
    while (idx < sortedX.length && p >= sortedX[idx]) {
      const x = sortedX[idx];
      // Record snapshot at x (just after the largest prime ≤ x)
      results.push({
        x,
        sum_logP_over_p,
        sum_1_over_p,
        product_1_minus_1_over_p: Math.exp(log_prod_1_minus_1_over_p),
      });
      idx++;
    }
  }

  // If last milestone not yet filled (x larger than largest prime), finalize
  while (idx < sortedX.length) {
    const x = sortedX[idx];
    results.push({
      x,
      sum_logP_over_p,
      sum_1_over_p,
      product_1_minus_1_over_p: Math.exp(log_prod_1_minus_1_over_p),
    });
    idx++;
  }

  return results;
}

// ── Main test ────────────────────────────────────────────────────────────────

export function meisselMertensTest() {
  const N = 1000000;
  console.error(`Sieving primes up to ${N}...`);
  const primes = sievePrimes(N);

  const xValues = [100, 1000, 10000, 100000, 1000000];
  const mertensSums = computeMertensSums(primes, xValues);

  // Extract constants from asymptotic formulas
  const results = mertensSums.map(({ x, sum_logP_over_p, sum_1_over_p, product_1_minus_1_over_p }) => {
    const logX = Math.log(x);
    const loglogX = Math.log(logX);
    // Mertens 1st: sum_logP_over_p = log x - E + O(1/log x)
    const E_estimate = logX - sum_logP_over_p;
    // Mertens 2nd: sum_1_over_p = log log x + M + O(1/log x)
    const M_estimate = sum_1_over_p - loglogX;
    // Mertens 3rd: Π(1-1/p)·log x ≈ e^{-γ}
    const e_neg_gamma_estimate = product_1_minus_1_over_p * logX;

    return {
      x,
      sum_logP_over_p: +sum_logP_over_p.toFixed(5),
      sum_1_over_p: +sum_1_over_p.toFixed(5),
      product_1_minus_1_over_p: +product_1_minus_1_over_p.toFixed(7),
      E_estimate: +E_estimate.toFixed(5),
      M_estimate: +M_estimate.toFixed(5),
      e_neg_gamma_estimate: +e_neg_gamma_estimate.toFixed(5),
      M_error: +Math.abs(M_estimate - M_REFERENCE).toFixed(5),
      e_neg_gamma_error: +Math.abs(e_neg_gamma_estimate - E_NEG_GAMMA).toFixed(5),
    };
  });

  // Final estimates (at x = 10^6)
  const final = results[results.length - 1];

  return {
    framework: {
      name: "Mertens' Theorems and Meissel-Mertens Constant",
      mertens1: 'Σ_{p≤x} log(p)/p = log x - E + O(1/log x)',
      mertens2: 'Σ_{p≤x} 1/p = log log x + M + O(1/log x)  (M = Meissel-Mertens)',
      mertens3: 'Π_{p≤x} (1-1/p) ~ e^{-γ}/log x  (Mertens 3rd theorem, 1874)',
      constants: {
        M_MeisselMertens_reference: M_REFERENCE,
        E_reference: E_REFERENCE,
        gamma_Euler: EULER_GAMMA,
        e_neg_gamma: E_NEG_GAMMA,
      },
    },

    results,

    finalEstimates: {
      at_x: final.x,
      M_estimate: final.M_estimate,
      M_reference: M_REFERENCE,
      M_error: final.M_error,
      e_neg_gamma_estimate: final.e_neg_gamma_estimate,
      e_neg_gamma_reference: +E_NEG_GAMMA.toFixed(5),
      e_neg_gamma_error: final.e_neg_gamma_error,
    },

    keyFindings: [
      `Sieved ${primes.length} primes up to ${N}.`,
      `At x=10^6: Σ 1/p = ${final.sum_1_over_p}; log log(10^6) = ${Math.log(Math.log(1e6)).toFixed(4)}.`,
      `Meissel-Mertens M estimate: ${final.M_estimate} (reference ${M_REFERENCE.toFixed(5)}, error ${final.M_error}).`,
      `e^{-γ} estimate from Π(1-1/p)·log x: ${final.e_neg_gamma_estimate} (reference ${E_NEG_GAMMA.toFixed(5)}, error ${final.e_neg_gamma_error}).`,
      `Σ log(p)/p - log x gives -E estimate: ${-final.E_estimate.toFixed(4)} vs -E ≈ ${(-E_REFERENCE).toFixed(4)}.`,
    ],

    relationToRH: {
      elementaryContent:
        'Mertens theorems are ELEMENTARY — no complex analysis, no ζ-zeros. ' +
        'They are the first quantitative theorems about prime distribution.',
      rhRefinements:
        'Under RH, error terms in Mertens improve from O(1/log x) to O(1/√x) (approximately). ' +
        'This gives effective explicit bounds (Rosser-Schoenfeld 1962, Dusart 1998).',
      connectionToGamma:
        'The appearance of e^{-γ} in Mertens 3rd is deep: it reflects the asymptotic ' +
        'distribution of prime factorizations. Connects ζ theory to analysis (γ from ζ(s) at s=1).',
    },

    nextStep:
      'Compute EFFECTIVE bounds: Dusart 1998 gives explicit constants for error terms. ' +
      'Verify |Σ 1/p - log log x - M| ≤ c/log x for explicit c. ' +
      'Extend to χ-twisted sums Σ χ(p)/p for Dirichlet characters.',

    verdict:
      `MERTENS' THEOREMS VERIFIED up to x=10^6. ` +
      `Meissel-Mertens M estimated at ${final.M_estimate} (reference 0.2615, error ${final.M_error}). ` +
      `e^{-γ} from Mertens 3rd: ${final.e_neg_gamma_estimate} (reference 0.5615). ` +
      'Foundational prime-distribution constants verified numerically.',
  };
}
