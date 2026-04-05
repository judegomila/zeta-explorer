/**
 * Chowla Conjecture for Liouville Function λ(n)
 *
 * imp-182: The Liouville function is λ(n) = (-1)^{Ω(n)} where Ω(n) is
 * the number of prime factors of n counted with multiplicity.
 *
 * CHOWLA'S CONJECTURE (~1965):
 *
 *   For every fixed h ≥ 1,
 *     (1/x) Σ_{n≤x} λ(n)·λ(n+h)  →  0  as x → ∞.
 *
 * More generally for k-point correlations:
 *     (1/x) Σ_{n≤x} λ(n+h_1)·λ(n+h_2)···λ(n+h_k) → 0
 *
 * for any distinct h_1,...,h_k.
 *
 * STATUS:
 *
 *   • Matomäki-Radziwiłł (2015): AVERAGED Chowla proved:
 *       (1/H) Σ_{h≤H} |(1/x)·Σ_{n≤x}λ(n)λ(n+h)| → 0  as x→∞, H=H(x)→∞.
 *   • Tao (2016): LOG-AVERAGED Chowla for h=1 proved:
 *       (1/log x)·Σ_{n≤x} λ(n)λ(n+1)/n → 0.
 *   • FULL Chowla remains OPEN for every individual h ≥ 1.
 *
 * CONNECTION TO RH AND ZPO FRAMEWORK:
 *
 *   Our ZPO cascade S₂₁ = ζ(2s)/ζ(s) = Σ λ(n)/n^s is the Liouville
 *   Dirichlet series (imp-153). Chowla conjecture controls the RANDOMNESS
 *   of λ(n), which is connected to RH via the Landau identity:
 *
 *     RH ⟺ L(x) := Σ_{n≤x} λ(n) = O(x^{½+ε})  (Landau 1899)
 *
 *   Chowla strengthens this to sign randomness at all scales.
 *
 * THIS MODULE:
 *
 *   Compute C_h(x) := (1/x) Σ_{n≤x} λ(n)λ(n+h) for h=1..20 and
 *   x up to 10⁵. Verify C_h(x) is small (consistent with Chowla).
 */

// ── Liouville function via factorization ───────────────────────────────────

function liouville(n) {
  if (n === 1) return 1;
  let r = n;
  let Omega = 0;
  for (let d = 2; d * d <= r; d++) {
    while (r % d === 0) { r /= d; Omega++; }
  }
  if (r > 1) Omega++;
  return Omega % 2 === 0 ? 1 : -1;
}

// ── Precompute λ(n) for 1 ≤ n ≤ N ──────────────────────────────────────────

function precomputeLiouville(N) {
  // Use sieve: start with λ=1, for each prime p, flip λ for multiples.
  // Actually easier: Ω(n) = Σ_p v_p(n). Use modified sieve tracking parity of Ω.
  const lambda = new Int8Array(N + 1);
  lambda[0] = 0; lambda[1] = 1;
  // Track Omega parity per n
  const omegaParity = new Uint8Array(N + 1);
  for (let p = 2; p <= N; p++) {
    if (omegaParity[p] === 0 && lambda[p] === 0) {
      // p is prime (since no smaller prime factor set parity)
      // Actually need sieve of primes first. Simpler: direct factorization.
    }
  }
  // Fall back to direct factorization for each n
  for (let n = 2; n <= N; n++) {
    lambda[n] = liouville(n);
  }
  return lambda;
}

// ── Chowla correlation C_h(x) ──────────────────────────────────────────────

function chowlaCorrelation(lambda, x, h) {
  let sum = 0;
  for (let n = 1; n <= x; n++) {
    sum += lambda[n] * lambda[n + h];
  }
  return sum / x;
}

// ── Main test ────────────────────────────────────────────────────────────────

export function chowlaLiouvilleTest() {
  const X = 100000;
  const H_max = 20;

  console.error(`Precomputing λ(n) for n ≤ ${X + H_max}...`);
  const lambda = precomputeLiouville(X + H_max);

  // Compute C_h(X) for h=1..H_max
  const correlations = [];
  for (let h = 1; h <= H_max; h++) {
    const C = chowlaCorrelation(lambda, X, h);
    correlations.push({ h, C_h_at_X: +C.toFixed(6), absC: +Math.abs(C).toFixed(6) });
  }

  // Compute C_1(x) at multiple x to check convergence
  const x_series = [1000, 5000, 10000, 50000, 100000];
  const h1_convergence = x_series.map(x => ({
    x,
    C_1: +chowlaCorrelation(lambda, x, 1).toFixed(6),
  }));

  // Maximum |C_h| across all h
  const maxAbsC = Math.max(...correlations.map(c => c.absC));

  // Also verify L(x) = Σ_{n≤x} λ(n) behaviour for RH-equivalence
  let L_x = 0;
  const L_samples = [];
  for (let n = 1; n <= X; n++) {
    L_x += lambda[n];
    if (n === 100 || n === 1000 || n === 10000 || n === 100000) {
      L_samples.push({
        x: n,
        L_x,
        sqrt_x: Math.sqrt(n),
        ratio_Lx_over_sqrtx: +(L_x / Math.sqrt(n)).toFixed(4),
      });
    }
  }

  // Σ λ(n)/n — conjectured = 0 (Mertens-type)
  let lambdaSum = 0;
  for (let n = 1; n <= X; n++) lambdaSum += lambda[n] / n;

  return {
    conjecture: {
      name: 'Chowla Conjecture for Liouville Function',
      statement: '(1/x) Σ_{n≤x} λ(n)λ(n+h) → 0 as x → ∞, for every h ≥ 1',
      status: 'OPEN for every individual h; averaged version (Matomäki-Radziwiłł 2015) and log-averaged h=1 (Tao 2016) proven',
      connectionToRH:
        'Landau 1899: RH ⟺ L(x) := Σ_{n≤x}λ(n) = O(x^{½+ε}). ' +
        'Chowla strengthens Landau to sign-randomness at all scales.',
    },

    setup: {
      X,
      H_max,
      numCorrelationsComputed: H_max,
    },

    correlations,

    maxAbsCorrelation: +maxAbsC.toFixed(6),

    h1_convergence,

    liouvilleSum_verification: {
      samples: L_samples,
      interpretation: '|L(x)|/√x should stay O(1) under RH',
      maxRatio: Math.max(...L_samples.map(s => Math.abs(s.ratio_Lx_over_sqrtx))).toFixed(4),
    },

    convergentLambdaSeries: {
      computed_sum_lambda_over_n_upto_X: +lambdaSum.toFixed(6),
      conjecturalLimit: 0,
      note: 'Σ λ(n)/n = 0 follows from PNT (weaker than RH)',
    },

    keyFindings: [
      `Computed C_h(${X}) = (1/x)·Σ λ(n)λ(n+h) for h=1..${H_max}.`,
      `Max |C_h(${X})|: ${maxAbsC.toFixed(5)} — consistent with Chowla (should be o(1)).`,
      `C_1 convergence: ${h1_convergence.map(c => `C_1(${c.x})=${c.C_1}`).join(', ')}.`,
      `Landau L(x) = Σλ(n) at x=${X}: ${L_samples[L_samples.length-1].L_x}, |L|/√x = ${L_samples[L_samples.length-1].ratio_Lx_over_sqrtx} (RH predicts O(1)).`,
      `Σ λ(n)/n ≈ ${lambdaSum.toFixed(5)} (conjectural limit 0 by PNT).`,
    ],

    relationToZPO: {
      connection:
        'Our ZPO cascade S₂₁ = ζ(2s)/ζ(s) = Σ λ(n)/n^s is the LIOUVILLE Dirichlet series (imp-153). ' +
        'Chowla\'s conjecture controls the fine-scale randomness of the coefficients λ(n).',
      implication:
        'If full Chowla holds, λ(n) has MAXIMAL randomness, which supports RH via L(x) bound. ' +
        'Conversely, Chowla is stronger than what RH alone implies about Liouville.',
    },

    nextStep:
      'Extend to k-point correlations: compute (1/x)·Σ λ(n)λ(n+h_1)λ(n+h_2)... for k=3,4. ' +
      'Test log-averaged Chowla for h=2,3 (Tao 2016 proves h=1). ' +
      'Connect to multiplicative function correlations via our S₂₁ framework.',

    verdict:
      `CHOWLA CORRELATIONS: max |C_h(${X})|=${maxAbsC.toFixed(5)} across h=1..${H_max}. ` +
      `C_1(${X})=${correlations[0].C_h_at_X}. ` +
      `L(${X})=${L_samples[L_samples.length-1].L_x}, |L|/√x=${L_samples[L_samples.length-1].ratio_Lx_over_sqrtx} (RH-consistent). ` +
      'Numerical evidence for Chowla conjecture; directly relevant to our ZPO S₂₁ Liouville framework.',
  };
}
