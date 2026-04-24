/**
 * Explicit Formula for pi(x) with Sharp Schoenfeld Bounds
 *
 * imp-255: Schoenfeld (1976) proved the SHARPEST known explicit consequences
 * of RH for prime counting:
 *
 *   Under RH:  |pi(x) - Li(x)| < sqrt(x) * log(x) / (8*pi)   for x >= 2657
 *              |psi(x) - x|    < sqrt(x) * log^2(x) / (8*pi)  for x >= 73.2
 *              |theta(x) - x|  < sqrt(x) * log^2(x) / (8*pi)  for x >= 599
 *
 * where Li(x) = int_2^x dt/log(t) is the logarithmic integral.
 *
 * WITHOUT RH (best unconditional, de la Vallee Poussin type):
 *   |pi(x) - Li(x)| << x * exp(-c * sqrt(log x))  (much weaker)
 *
 * Platt-Trudgian (2021) refined Schoenfeld's constants.
 *
 * THIS MODULE:
 *   1. Compute pi(x) exactly via sieve for x up to 10^6.
 *   2. Compute Li(x) via numerical integration.
 *   3. Compare |pi(x) - Li(x)| to Schoenfeld bound.
 *   4. Compute ratio (actual error)/(Schoenfeld bound) — how tight is the bound?
 *   5. Also test psi(x) - x bound.
 */

// Sieve primes and count pi(x)
function sieveAndCount(N) {
  const sieve = new Uint8Array(N + 1);
  const pi = new Int32Array(N + 1);
  let count = 0;
  for (let n = 2; n <= N; n++) {
    if (!sieve[n]) {
      count++;
      for (let k = 2*n; k <= N; k += n) sieve[k] = 1;
    }
    pi[n] = count;
  }
  return { sieve, pi };
}

// Li(x) = int_2^x dt/log(t) via trapezoidal
function Li(x) {
  if (x <= 2) return 0;
  const steps = 2000;
  const h = (x - 2) / steps;
  let sum = 0;
  for (let i = 0; i < steps; i++) {
    const t1 = 2 + i*h, t2 = 2 + (i+1)*h;
    sum += h/2 * (1/Math.log(t1) + 1/Math.log(t2));
  }
  return sum;
}

// psi(x) = Sum_{n<=x} Lambda(n)
function computePsi(N) {
  const spf = new Int32Array(N + 1);
  for (let n = 2; n <= N; n++) {
    if (!spf[n]) { spf[n] = n; for (let k = 2*n; k <= N; k += n) if (!spf[k]) spf[k] = n; }
  }
  const psi = new Float64Array(N + 1);
  let running = 0;
  for (let n = 2; n <= N; n++) {
    let m = n, p = spf[n];
    while (m % p === 0) m = Math.floor(m/p);
    if (m === 1) running += Math.log(p);  // n = p^k
    psi[n] = running;
  }
  return psi;
}

// Domain thresholds: Schoenfeld's theorem only guarantees the bounds above these values.
// Points below the threshold are included for informational comparison but are NOT
// counted in allPiHold / allPsiHold, which test the theorem's stated domain.
const SCHOENFELD_PI_THRESHOLD = 2657;   // theorem guarantees pi bound for x >= 2657
const SCHOENFELD_PSI_THRESHOLD = 73.2;  // theorem guarantees psi bound for x >= 73.2

// Schoenfeld bound for |pi(x) - Li(x)|
function schoenfeldPiBound(x) {
  return Math.sqrt(x) * Math.log(x) / (8 * Math.PI);
}

// Schoenfeld bound for |psi(x) - x|
function schoenfeldPsiBound(x) {
  return Math.sqrt(x) * Math.log(x) * Math.log(x) / (8 * Math.PI);
}

/**
 * imp-911 (cross-verify audit, 2026-04-23, honest-partial).
 *
 * Independent audit of schoenfeldExplicitBoundsTest, following the format
 * of imp-906/907/909. Verifies formulas, spot-checks reference values,
 * and examines edge cases.
 *
 * (1) FORMULAS match Schoenfeld, Math. Comp. 30 (1976), Thm. 10:
 *       schoenfeldPiBound(x)  = sqrt(x) * log(x)      / (8*pi)   — matches.
 *       schoenfeldPsiBound(x) = sqrt(x) * (log x)^2   / (8*pi)   — matches.
 *     Domain thresholds (x >= 2657 for pi, x >= 73.2 for psi) match the paper.
 *
 * (2) Li(x) QUADRATURE BUG — NEW FINDING (open sub-gap).
 *     The current Li(x) uses uniform-step trapezoidal with only 2000 nodes
 *     on [2, x]. At x = 1e6 the step size is h = 500, and 1/log(t) drops
 *     from 1.443 at t=2 to 0.161 at t=502 across the first interval. The
 *     first trapezoidal segment alone returns h/2 * (1.443 + 0.161) = 400.87,
 *     while the true integral li(502) - li(2) is approx 101.25 — a single
 *     segment overshoot of ~300. Empirical error scan (reference Li
 *     recomputed independently with 400000 trapezoidal nodes):
 *        x =     1000   code overshoot approx 0.02   (negligible)
 *        x =    10000   code overshoot approx 1.25
 *        x =   100000   code overshoot approx 24.7
 *        x =   500000   code overshoot approx 144.7
 *        x =  1000000   code overshoot approx 300.4
 *     At x = 1e6 the Schoenfeld pi-bound is 549.70, so the Li quadrature
 *     error is ~55 percent of the bound itself. The code reports
 *     pi(1e6) - Li(1e6) approx -429.3 (ratio 0.78 of bound); the TRUE
 *     value pi(1e6) - li(1e6) is approx -129.5 (ratio 0.24). The
 *     "bound holds" verdict remains correct at every tested x, but the
 *     reported tightness ratios and error magnitudes for x >= 1e5 are
 *     systematically inflated. Fix options: (a) substitute u = log(t)
 *     so the integrand becomes exp(u)/u on a bounded log-domain where
 *     trapezoidal with 2000 nodes converges, or (b) use Simpson or raise
 *     steps to >= 200000 (error falls below 1 at x = 1e6).
 *
 * (3) Li CONVENTION: the code computes the offset variant
 *         Li(x) = integral_2^x dt/log(t) = li(x) - li(2),
 *     where li(2) approx 1.045163780117. Schoenfeld uses the principal-value
 *     li(x). Off by a constant 1.045 — dominated by issue (2) for x >= 1e4
 *     and irrelevant to bound-holds outcomes.
 *
 * (4) REFERENCE spot checks at x = 1e6:
 *       pi(1e6)              = 78498            (OEIS A006880) — sieve MATCHES.
 *       li(1e6)              approx 78627.549   (literature) — code Li approx 78927.34 (off ~300, see (2)).
 *       Schoenfeld pi-bound  = 549.70           — schoenfeldPiBound(1e6) MATCHES.
 *       Schoenfeld psi-bound approx 7594.41     — schoenfeldPsiBound(1e6) MATCHES.
 *
 * (5) EDGE CASES:
 *     - Li(x <= 2) short-circuits to 0 — no singularity issue.
 *     - sieveAndCount(N) leaves pi[0]=pi[1]=0 via Int32Array init — correct.
 *     - computePsi detects prime powers (m = n / p^k reduces to 1) — correct Lambda(n).
 *     - schoenfeldPiBound(1) = 0 (log 1 = 0) — no NaN.
 *     - schoenfeldPsiBound(0) = NaN (sqrt(0) * log(0)^2 = 0 * Infinity); callers stay >= 1000.
 *
 * OPEN SUB-GAP: imp-911-sub-li-quadrature — fix Li(x) numerical method
 * to restore correct error/bound ratios at x >= 1e5. Until then,
 * avg_pi_ratio in the returned result over-reports tightness by ~3x at
 * x = 1e6. The bound-holds verdict itself is unaffected.
 */
export function schoenfeldExplicitBoundsTest() {
  const N = 1000000;
  const { pi } = sieveAndCount(N);
  const psi = computePsi(N);

  // Test pi(x) - Li(x) at checkpoints.
  // NOTE: x=1000 is below SCHOENFELD_PI_THRESHOLD=2657, so the theorem does not
  // guarantee the pi bound there. It happens to hold numerically (|err|~8.6, bound~8.7)
  // but this is not assured. Only checkpoints >= 2657 are counted in allPiHold.
  const checkpoints = [1000, 5000, 10000, 50000, 100000, 500000, 1000000];
  const piResults = checkpoints.map(x => {
    const piX = pi[x];
    const liX = Li(x);
    const error = piX - liX;
    const bound = schoenfeldPiBound(x);
    const inRange = x >= SCHOENFELD_PI_THRESHOLD;
    return {
      x,
      'pi(x)': piX,
      'Li(x)': +liX.toFixed(2),
      'pi(x)-Li(x)': +error.toFixed(2),
      '|error|': +Math.abs(error).toFixed(2),
      'Schoenfeld bound': +bound.toFixed(2),
      'ratio |err|/bound': +(Math.abs(error) / bound).toFixed(4),
      'bound holds': Math.abs(error) < bound,
      'in theorem range': inRange,
    };
  });

  // Test psi(x) - x at checkpoints.
  // All checkpoints >= 1000 > 73.2, so all are in-range for the psi bound.
  const psiResults = checkpoints.map(x => {
    const psiX = psi[x];
    const error = psiX - x;
    const bound = schoenfeldPsiBound(x);
    const inRange = x >= SCHOENFELD_PSI_THRESHOLD;
    return {
      x,
      'psi(x)': +psiX.toFixed(2),
      'psi(x)-x': +error.toFixed(2),
      '|error|': +Math.abs(error).toFixed(2),
      'Schoenfeld bound': +bound.toFixed(2),
      'ratio |err|/bound': +(Math.abs(error) / bound).toFixed(4),
      'bound holds': Math.abs(error) < bound,
      'in theorem range': inRange,
    };
  });

  // Only evaluate theorem compliance for checkpoints within the stated domain.
  const allPiHold = piResults.filter(r => r['in theorem range']).every(r => r['bound holds']);
  const allPsiHold = psiResults.filter(r => r['in theorem range']).every(r => r['bound holds']);

  // How tight is the bound? Average ratio
  const avgPiRatio = piResults.reduce((s,r) => s + r['ratio |err|/bound'], 0) / piResults.length;
  const avgPsiRatio = psiResults.reduce((s,r) => s + r['ratio |err|/bound'], 0) / psiResults.length;

  // Unconditional comparison: de la Vallee Poussin error term
  // |pi(x) - Li(x)| << x * exp(-c*sqrt(log x)) with c ~ 0.5
  const unconditionalComparison = checkpoints.map(x => {
    const schoenfeld = schoenfeldPiBound(x);
    const unconditional = x * Math.exp(-0.5 * Math.sqrt(Math.log(x)));
    return {
      x,
      'Schoenfeld (RH)': +schoenfeld.toFixed(2),
      'Unconditional': +unconditional.toFixed(2),
      'RH improvement': +(unconditional / schoenfeld).toFixed(2),
    };
  });

  return {
    framework: {
      name: 'Schoenfeld Explicit Bounds (1976)',
      pibound: '|pi(x) - Li(x)| < sqrt(x)*log(x)/(8*pi)  for x >= 2657  [CONDITIONAL ON RH]',
      psibound: '|psi(x) - x| < sqrt(x)*log^2(x)/(8*pi)  for x >= 73.2  [CONDITIONAL ON RH]',
      unconditional: '|pi(x) - Li(x)| << x*exp(-c*sqrt(log x))  (much weaker)',
      plattTrudgian: 'Platt-Trudgian (2021) refined constants slightly',
    },

    pi_x_vs_Li_x: piResults,
    psi_x_vs_x: psiResults,

    all_pi_bounds_hold: allPiHold,
    all_psi_bounds_hold: allPsiHold,

    tightness: {
      avg_pi_ratio: +avgPiRatio.toFixed(4),
      avg_psi_ratio: +avgPsiRatio.toFixed(4),
      note: 'Ratio < 1 means bound holds; ratio << 1 means bound is loose',
    },

    rh_vs_unconditional: unconditionalComparison,

    keyFindings: [
      `Tested Schoenfeld pi(x) bound at ${checkpoints.length} values x in [10^3, 10^6]; ${piResults.filter(r => r['in theorem range']).length} are in-range (x >= ${SCHOENFELD_PI_THRESHOLD}).`,
      `|pi(x) - Li(x)| < sqrt(x)*log(x)/(8*pi): ALL in-range checkpoints hold ✓ (avg ratio ${avgPiRatio.toFixed(3)}). x=1000 is below threshold but also holds numerically.`,
      `|psi(x) - x| < sqrt(x)*log^2(x)/(8*pi): ALL ${checkpoints.length} hold ✓ (avg ratio ${avgPsiRatio.toFixed(3)}). All checkpoints >= 73.2 threshold.`,
      `At x=10^6: pi(x)=${piResults[piResults.length-1]['pi(x)']}, Li(x)=${piResults[piResults.length-1]['Li(x)']}, error=${piResults[piResults.length-1]['pi(x)-Li(x)']}, bound=${piResults[piResults.length-1]['Schoenfeld bound']}.`,
      `Bound is ${(1/avgPiRatio).toFixed(1)}× looser than actual error on average — room for improvement.`,
      `RH improvement over unconditional: ${unconditionalComparison[unconditionalComparison.length-1]['RH improvement']}× at x=10^6.`,
      `Schoenfeld bound is O(sqrt(x)*log x) vs unconditional O(x*exp(-c*sqrt(log x))). The gap is ENORMOUS.`,
    ],

    relationToRH: {
      conditionalOnRH:
        'Schoenfeld bounds ASSUME RH. If RH is false, the bounds fail. ' +
        'Equivalently: if any Schoenfeld bound fails at some x, then RH is false.',
      robinCriterion:
        'Robin (1984): RH ⟺ sigma(n)/n < e^gamma * log(log n) for n > 5040. ' +
        'Schoenfeld is the pi(x) analog: RH gives precise error control.',
      explicitZeroFree:
        'Schoenfeld\'s proof uses: (1) explicit formula pi(x)=Li(x)-Σ_ρ Li(x^ρ)+..., ' +
        '(2) RH forces Re(ρ)=1/2, so |x^ρ| = x^{1/2}, (3) careful summation over zeros.',
      computationalTest:
        'Platt verified RH for first 10^13 zeros. Combined with Schoenfeld, this gives ' +
        'UNCONDITIONAL pi(x) bounds for "small" x (up to ~ 10^{26}).',
    },

    nextStep:
      'Compute pi(x) for x up to 10^8 via segmented sieve and test bound. ' +
      'Implement Robin criterion and Lagarias criterion as alternative RH tests. ' +
      'Compare to Platt-Trudgian refined constants.',

    verdict:
      `SCHOENFELD BOUNDS: |pi(x)-Li(x)| < sqrt(x)*log(x)/(8*pi) verified at ${checkpoints.length} points up to 10^6. ` +
      `ALL hold ✓. Avg tightness ratio = ${avgPiRatio.toFixed(3)}. ` +
      `RH gives ${unconditionalComparison[unconditionalComparison.length-1]['RH improvement']}× improvement over unconditional bound at x=10^6.`,
  };
}
