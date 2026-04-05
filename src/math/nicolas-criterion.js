/**
 * Nicolas Criterion for RH via Primorials
 *
 * imp-204: Jean-Louis Nicolas (1983) proved an elementary RH equivalent
 * using primorials N_k = p_1 · p_2 · ... · p_k (product of first k primes).
 *
 * NICOLAS'S CRITERION:
 *
 *   Let f(k) := N_k / (φ(N_k) · log log N_k)   for k ≥ 2.
 *
 *   RH ⟺ f(k) > e^γ for all k ≥ 2.
 *
 * where γ ≈ 0.5772 is Euler-Mascheroni and φ(N_k) is Euler's totient.
 *
 * For primorial N_k:
 *   φ(N_k)/N_k = Π_{i=1}^k (1 - 1/p_i)   (Mertens product)
 *
 * By Mertens 3rd theorem:
 *   Π_{p ≤ x} (1 - 1/p) ~ e^{-γ} / log x   as x → ∞
 *
 * So N_k/φ(N_k) = 1/Π(1-1/p_i) ~ e^γ · log N_k (asymptotically).
 * Divide by log log N_k: f(k) ~ e^γ · log N_k / log log N_k.
 *
 * Nicolas's inequality f(k) > e^γ can FAIL if RH fails; it captures
 * the "second-order" behavior of the Mertens product precisely.
 *
 * NUMERICAL TEST:
 *
 *   Compute f(k) for first 20 primorials. Verify f(k) > e^γ throughout.
 */

const EULER_GAMMA = 0.5772156649015329;
const E_GAMMA = Math.exp(EULER_GAMMA);

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

// ── Main test ────────────────────────────────────────────────────────────────

export function nicolasCriterionTest() {
  const primes = sievePrimes(10000);
  const K = 30;  // first 30 primorials

  // Compute N_k and φ(N_k) iteratively using logs to avoid overflow
  // logN_k = Σ log(p_i)
  // φ(N_k)/N_k = Π(1-1/p_i), so log(φ(N_k)) = logN_k + Σ log(1-1/p_i)
  const results = [];
  let logNk = 0;
  let logPhiNk = 0;

  for (let k = 1; k <= K; k++) {
    const p = primes[k - 1];
    logNk += Math.log(p);
    logPhiNk += Math.log(p) + Math.log(1 - 1/p);
    const logLogNk = Math.log(logNk);
    if (logLogNk <= 0) continue;

    // f(k) = N_k / (φ(N_k) · log log N_k) = exp(logNk - logPhiNk) / log log N_k
    const Nk_over_phiNk = Math.exp(logNk - logPhiNk);
    const f = Nk_over_phiNk / logLogNk;
    const margin = f - E_GAMMA;

    results.push({
      k,
      p_k: p,
      log_N_k: +logNk.toFixed(4),
      N_k_over_phi: +Nk_over_phiNk.toFixed(4),
      log_log_N_k: +logLogNk.toFixed(4),
      'f(k)': +f.toFixed(6),
      'f(k)/e^γ': +(f / E_GAMMA).toFixed(4),
      margin: +margin.toFixed(6),
      satisfies_Nicolas: f > E_GAMMA,
    });
  }

  const allSatisfy = results.every(r => r.satisfies_Nicolas);
  const violations = results.filter(r => !r.satisfies_Nicolas);
  const minMargin = Math.min(...results.filter(r => r.satisfies_Nicolas).map(r => r.margin));
  const minMarginAt = results.find(r => r.margin === minMargin);

  return {
    framework: {
      name: "Nicolas Criterion (1983)",
      statement: 'RH ⟺ N_k/(φ(N_k)·log log N_k) > e^γ for all k ≥ 2',
      mertensThird: 'Π_{p≤x}(1-1/p) ~ e^{-γ}/log x',
      e_gamma: +E_GAMMA.toFixed(6),
      reference: 'J.-L. Nicolas, J. Number Theory 17 (1983), 375-388',
    },

    results: results.slice(0, 20),

    summary: {
      K_tested: K,
      all_satisfy_Nicolas: allSatisfy,
      num_violations: violations.length,
      min_margin: +minMargin.toFixed(6),
      min_margin_at_k: minMarginAt?.k,
    },

    keyFindings: [
      `Computed f(k) = N_k/(φ(N_k)·log log N_k) for first ${K} primorials.`,
      `e^γ = ${E_GAMMA.toFixed(6)} (Nicolas threshold).`,
      `Nicolas inequality f(k) > e^γ: ${allSatisfy ? 'SATISFIED at all k' : violations.length + ' violations'}.`,
      `Min margin: ${minMargin.toFixed(4)} at k=${minMarginAt?.k} (p_k=${minMarginAt?.p_k}).`,
      `f(k) ratio to e^γ: values ${results.map(r => r['f(k)/e^γ']).slice(0,5).join(', ')} ...`,
    ],

    relationToRH: {
      mertensLink:
        'Nicolas\'s criterion uses Mertens 3rd theorem: Π_{p≤x}(1-1/p) ~ e^{-γ}/log x. ' +
        'RH tightens this asymptotic via zero-free region constraints.',
      role:
        'If RH holds, f(k) stays strictly above e^γ for all k (and margins grow with k). ' +
        'If RH fails, f(k) may drop to e^γ or below at some specific primorial.',
      elementaryForm:
        'Nicolas\'s criterion is TESTABLE PER-PRIMORIAL — each k gives either ' +
        'confirmation or potential RH-counterexample.',
    },

    nextStep:
      'Extend to k=100+ primorials (need log-arithmetic for p_k=541). ' +
      'Compute asymptotic margin: f(k) - e^γ should → positive value under RH. ' +
      'Cross-reference with Robin (imp-201) on colossally abundant numbers.',

    verdict:
      `NICOLAS'S CRITERION: f(k) = N_k/(φ(N_k)·log log N_k) > e^γ checked for first ${K} primorials. ` +
      `${allSatisfy ? 'ALL SATISFY' : violations.length + ' violations'}. ` +
      `Min margin ${minMargin.toFixed(4)} at k=${minMarginAt?.k}. ` +
      'Elementary RH-equivalent via primorial totient structure.',
  };
}
