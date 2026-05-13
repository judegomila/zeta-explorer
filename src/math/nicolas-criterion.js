/**
 * Nicolas Criterion for RH via Primorials
 *
 * imp-277: RH iff phi(N_k)/N_k < e^{-gamma}/log(log(N_k)) for all k >= 1
 * where N_k = primorial = 2*3*5*...*p_k.
 *
 * imp-1051 cross-verification (2026-05-13, opus-4-7):
 *   - FORMULA: matches Nicolas (1983) "Petites valeurs de la fonction
 *     d'Euler", J. Number Theory 17, 375-388. Equivalent form: assuming RH,
 *     e^gamma . log(log(N_k)) . phi(N_k)/N_k < 1 for all k where the LHS
 *     is defined, i.e. phi(N_k)/N_k < e^{-gamma}/loglog(N_k).
 *   - CONSTANT: EULER_GAMMA = 0.5772156649015329 matches gamma to 15+
 *     decimal digits; e^{-gamma} = 0.5614594835668851 (recomputed).
 *   - RECURRENCE: phi(N_k)/N_k = prod_{i=1..k}(1 - 1/p_i) and
 *     log(N_k) = sum_{i=1..k} log(p_i). Both increments are algebraically
 *     exact; only standard double-precision ULP error accumulates.
 *   - EDGE CASES: for k=1 (N_1=2) we have log(log(2)) ~= -0.367 < 0, so
 *     the bound is negative and a naive `phi < bound` would falsely report
 *     "fail". The `if (loglogNk <= 0) continue` guard correctly skips
 *     this iteration. For k >= 2 (N_k >= 6 > e) loglogNk > 0, so no
 *     NaN/Inf is producible. sievePrimes(100) yields 25 primes and the
 *     loop caps at 20 — no out-of-bounds index.
 *   - NUMERICAL CROSS-CHECK (independently recomputed via a separate
 *     Node script using the same recurrence but written from scratch):
 *       k=2  phi/N=0.33333333  bound=0.96272519  margin=0.62939186
 *       k=3  phi/N=0.26666667  bound=0.45866094  margin=0.19199427
 *       k=4  phi/N=0.22857143  bound=0.33488864  margin=0.10631721
 *       k=5  phi/N=0.20779221  bound=0.27427766  margin=0.06648545
 *       k=6  phi/N=0.19180819  bound=0.24064856  margin=0.04884037
 *       k=20 phi/N=0.12779768  bound=0.13626204  margin=0.00846436
 *     All values agree to displayed precision with nicolasCriterionTest()
 *     output. Margins shrink monotonically as Nicolas's asymptotic predicts.
 *   - COSMETIC MISLABEL (worth a follow-up ticket, NOT fixed here): the
 *     keyFindings strings hardcode `(k=1)` for the first margin and
 *     `k=${results.length}` for the last. But because k=1 is skipped by
 *     the loglogNk guard, the first emitted row has k=2 and the last has
 *     k=20 (with current loop cap), while results.length=19. The numbers
 *     are correct; only the k-index labels are off by one.
 *   - SCOPE: this is a numerical sanity check on the first ~20
 *     primorials. It does NOT prove RH; Nicolas's theorem applies for
 *     all k.
 *   - VERDICT: nicolasCriterionTest() formula, recurrence, guard, and
 *     emitted numbers are all CORRECT. One cosmetic label bug flagged.
 */

const EULER_GAMMA = 0.5772156649015329;

function sievePrimes(N) {
  const s = new Uint8Array(N+1); const P = [];
  for (let n=2;n<=N;n++){if(!s[n]){P.push(n);for(let k=2*n;k<=N;k+=n)s[k]=1;}} return P;
}

export function nicolasCriterionTest() {
  const primes = sievePrimes(100);
  const egamma = Math.exp(-EULER_GAMMA);
  const results = [];
  let logNk = 0, phiRatio = 1;

  for (let k = 0; k < Math.min(primes.length, 20); k++) {
    logNk += Math.log(primes[k]);
    phiRatio *= (1 - 1/primes[k]);
    const loglogNk = Math.log(logNk);
    if (loglogNk <= 0) continue;
    const bound = egamma / loglogNk;
    results.push({
      k: k+1, p_k: primes[k], 'log(N_k)': +logNk.toFixed(4),
      'phi/N': +phiRatio.toFixed(8), bound: +bound.toFixed(8),
      margin: +(bound - phiRatio).toFixed(8), holds: phiRatio < bound,
    });
  }

  const allHold = results.every(r => r.holds);

  return {
    framework: { name: 'Nicolas Criterion (1983)',
      statement: 'RH iff phi(N_k)/N_k < e^{-gamma}/loglog(N_k) for all k',
      primorial: 'N_k = product of first k primes' },
    results,
    all_hold: allHold,
    keyFindings: [
      `Tested k=1..${results.length}, ALL hold: ${allHold}.`,
      `Margin: ${results[0]?.margin} (k=1) -> ${results[results.length-1]?.margin} (k=${results.length}).`,
      `Nicolas: simplest RH equivalence. Dual to Robin (sigma side).`,
    ],
    verdict: `NICOLAS: phi(N_k)/N_k < e^{-gamma}/loglog(N_k) for ${results.length} k. ALL HOLD. Consistent with RH.`,
  };
}
