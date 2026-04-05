/**
 * Lagarias Criterion for the Riemann Hypothesis
 *
 * imp-202: Jeffrey Lagarias (2002) discovered a beautiful elementary RH
 * equivalent that is EVEN SIMPLER than Robin's criterion:
 *
 *   RH ⟺ σ(n) ≤ H_n + exp(H_n) · log(H_n)   for all n ≥ 1
 *
 *   with equality if and only if n = 1.
 *
 * Here H_n = 1 + 1/2 + 1/3 + ... + 1/n is the n-th harmonic number.
 *
 * REMARKABLE FEATURES:
 *
 *   • No condition n > 5040 (unlike Robin).
 *   • Equality case n=1 is sharp.
 *   • Connects divisor sums to harmonic sums — elementary combinatorial.
 *
 * ASYMPTOTICALLY:
 *
 *   H_n ~ log n + γ + O(1/n)
 *   exp(H_n) ~ n · e^γ
 *   log(H_n) ~ log log n
 *
 *   So the RHS ≈ log n + γ + n·e^γ·log log n ≈ e^γ · n · log log n
 *
 *   Lagarias ⟹ Robin asymptotically (with corrections for small n).
 *
 * NUMERICAL TEST:
 *
 *   1. Compute σ(n) via divisor sieve.
 *   2. Compute H_n iteratively.
 *   3. Compare σ(n) with H_n + exp(H_n) log(H_n).
 *   4. Verify inequality throughout, track tightest margin.
 */

// ── Divisor sum sieve ──────────────────────────────────────────────────────

function sigmaSieve(N) {
  const sigma = new Float64Array(N + 1);
  for (let i = 1; i <= N; i++) {
    for (let j = i; j <= N; j += i) {
      sigma[j] += i;
    }
  }
  return sigma;
}

// ── Lagarias RHS ───────────────────────────────────────────────────────────

function lagariasRHS(Hn) {
  if (Hn <= 0) return 0;
  return Hn + Math.exp(Hn) * Math.log(Hn);
}

// ── Main test ────────────────────────────────────────────────────────────────

export function lagariasCriterionTest() {
  const N = 1000000;
  console.error(`Computing σ(n) for n ≤ ${N}...`);
  const sigma = sigmaSieve(N);

  // Compute H_n iteratively and check Lagarias inequality
  let Hn = 0;
  let violations = 0;
  let violationExamples = [];
  let tightestMargin = Infinity;
  let tightestMarginAt = 0;
  let tightestRatio = 0;
  let tightestRatioAt = 0;

  const samples = [];
  const milestones = new Set([1, 2, 3, 5, 6, 10, 100, 720, 840, 5040, 10080, 100000, 1000000]);

  for (let n = 1; n <= N; n++) {
    Hn += 1 / n;
    const rhs = lagariasRHS(Hn);
    const margin = rhs - sigma[n];
    const ratio = sigma[n] / rhs;

    if (margin < 0) {
      violations++;
      if (violationExamples.length < 5) {
        violationExamples.push({ n, sigma_n: sigma[n], rhs: +rhs.toFixed(4), margin: +margin.toFixed(4) });
      }
    }

    if (n >= 2 && margin < tightestMargin) {
      tightestMargin = margin;
      tightestMarginAt = n;
    }
    if (n >= 2 && ratio > tightestRatio) {
      tightestRatio = ratio;
      tightestRatioAt = n;
    }

    if (milestones.has(n)) {
      samples.push({
        n,
        sigma_n: sigma[n],
        H_n: +Hn.toFixed(4),
        exp_Hn_log_Hn: +(Math.exp(Hn) * Math.log(Hn)).toFixed(4),
        rhs: +rhs.toFixed(4),
        margin: +margin.toFixed(4),
        ratio: +ratio.toFixed(4),
        satisfied: margin >= 0,
      });
    }
  }

  // Compare with Robin: asymptotic equivalence
  const comparison = (() => {
    // At n=10000: Robin's e^γ·n·log log n vs Lagarias's H_n + exp(H_n)log(H_n)
    const n = 10000;
    let Hn10k = 0;
    for (let k = 1; k <= n; k++) Hn10k += 1/k;
    const logN = Math.log(n);
    const loglogN = Math.log(logN);
    const E_GAMMA = Math.exp(0.5772156649015329);
    return {
      n,
      sigma_n: sigma[n],
      Robin_RHS: +(E_GAMMA * n * loglogN).toFixed(2),
      Lagarias_RHS: +lagariasRHS(Hn10k).toFixed(2),
      ratio_Lagarias_to_Robin: +(lagariasRHS(Hn10k) / (E_GAMMA * n * loglogN)).toFixed(4),
    };
  })();

  return {
    framework: {
      name: "Lagarias Criterion (2002)",
      statement: 'RH ⟺ σ(n) ≤ H_n + exp(H_n)·log(H_n) for all n ≥ 1',
      equality_case: 'n = 1 (H_1=1, exp(1)·log(1)=0, RHS=1=σ(1))',
      reference: 'J. Lagarias, An Elementary Problem Equivalent to RH, Amer. Math. Monthly 109 (2002), 534-543',
    },

    results: {
      N_tested: N,
      violations_found: violations,
      tightest_margin: +tightestMargin.toFixed(6),
      tightest_margin_at: tightestMarginAt,
      tightest_ratio: +tightestRatio.toFixed(4),
      tightest_ratio_at: tightestRatioAt,
    },

    samples,

    violationExamples,

    comparison_with_Robin: comparison,

    verdict_rh: violations === 0
      ? 'RH CONSISTENT: Lagarias inequality holds for all n ≤ 10^6.'
      : `RH VIOLATED: ${violations} counterexamples found.`,

    keyFindings: [
      `Tested Lagarias inequality σ(n) ≤ H_n + exp(H_n)·log(H_n) for n ≤ ${N}.`,
      `Violations found: ${violations}.`,
      `Tightest margin (rhs - σ(n)): ${tightestMargin.toFixed(4)} at n=${tightestMarginAt}.`,
      `Tightest ratio σ(n)/rhs: ${tightestRatio.toFixed(4)} at n=${tightestRatioAt}.`,
      `At n=1: equality verified (σ(1)=1=H_1, exp(1)·log(1)=0, RHS=1).`,
      `Asymptotic: Lagarias RHS ≈ ${comparison.ratio_Lagarias_to_Robin}× Robin RHS at n=${comparison.n}.`,
    ],

    relationToRH: {
      beauty:
        'Lagarias criterion is arguably the MOST ELEMENTARY RH equivalent: ' +
        'pure combinatorial statement using divisor sums and harmonic numbers.',
      asymptoticLink:
        'H_n ~ log n + γ + O(1/n), exp(H_n) ~ n·e^γ, log(H_n) ~ log log n. ' +
        'So Lagarias RHS ~ e^γ · n · log log n = Robin RHS (asymptotically).',
      strongerThanRobin:
        'Lagarias holds WITHOUT the n > 5040 restriction. It is the "complete" ' +
        'elementary form of Robin\'s criterion.',
      hundred_dollar_problem:
        'Lagarias offered US$100 for an elementary (non-ζ) proof. The only known proof ' +
        'uses Robin\'s ζ-based argument — so the prize is still open.',
    },

    nextStep:
      'Extend to n = 10^9 via segmented divisor sieve. ' +
      'Compare margins for Robin vs Lagarias across ranges. ' +
      'Explore "critical" n where Lagarias is tightest (likely colossally abundant numbers).',

    verdict:
      `LAGARIAS CRITERION VERIFIED up to n=${N}: ${violations === 0 ? 'NO violations' : violations + ' violations'}. ` +
      `Tightest margin: ${tightestMargin.toFixed(3)} at n=${tightestMarginAt}. ` +
      'Elementary RH-equivalent via harmonic numbers and divisor sums.',
  };
}
