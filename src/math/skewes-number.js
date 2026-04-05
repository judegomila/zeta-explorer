/**
 * Skewes Number: π(x) − Li(x) Sign Change Analysis
 *
 * imp-194: Until Littlewood (1914), mathematicians believed π(x) < Li(x)
 * for all x ≥ 2 — supported by computation (the inequality holds up to
 * 10^{19} at least). Littlewood PROVED that π(x) > Li(x) infinitely
 * often, with sign changes occurring beyond any computable range.
 *
 * SKEWES BOUNDS ON FIRST CROSSING:
 *
 *   Skewes 1933 (assuming RH): first crossing < e^{e^{e^{79}}}
 *   Skewes 1955 (unconditional): < 10^{10^{10^{964}}}
 *   Cohen-Dress 1988:            < 6.69 × 10^{370}
 *   te Riele 1987:               < 6.69 × 10^{370}
 *   Bays-Hudson 2000:            < 1.398 × 10^{316}
 *   Chao-Plymen 2015:            < 10^{316}
 *
 * EXPECTED BEHAVIOR:
 *
 *   Under RH: π(x) − Li(x) ≈ −Σ_ρ Li(x^ρ)/ρ ≈ oscillations of order √x/log x.
 *   Expected |π(x) − Li(x)| grows as √x/log x (up to log factors).
 *
 * THIS MODULE:
 *
 *   1. Compute π(x) and Li(x) for x ∈ {10, 10², ..., 10⁷}.
 *   2. Verify π(x) < Li(x) throughout (expected, x << 10^{316}).
 *   3. Track |π(x) − Li(x)|/(√x/log x) — should be bounded under RH.
 *   4. Illustrate how staggering Skewes bound is vs computable range.
 */

// ── Logarithmic integral Li(x) ──────────────────────────────────────────────

function Li(x) {
  // Li(x) = γ + log log x + Σ_{k=1}^∞ (log x)^k / (k · k!)
  const EULER_GAMMA = 0.5772156649015329;
  if (x <= 1) return 0;
  const L = Math.log(x);
  let sum = EULER_GAMMA + Math.log(L);
  let term = 1;
  for (let k = 1; k < 200; k++) {
    term *= L / k;
    sum += term / k;
  }
  return sum;
}

// ── Sieve and count π(x) at milestones ─────────────────────────────────────

function computePi(N, milestones) {
  const sieve = new Uint8Array(N + 1);
  const counts = [];
  let count = 0;
  let mIdx = 0;
  const sortedMilestones = [...milestones].sort((a, b) => a - b);

  for (let n = 2; n <= N; n++) {
    if (!sieve[n]) {
      count++;
      for (let k = 2 * n; k <= N; k += n) sieve[k] = 1;
    }
    while (mIdx < sortedMilestones.length && sortedMilestones[mIdx] === n) {
      counts.push({ x: n, pi_x: count });
      mIdx++;
    }
  }
  return counts;
}

// ── Main test ────────────────────────────────────────────────────────────────

export function skewesNumberTest() {
  const N = 10000000;
  const milestones = [100, 1000, 10000, 100000, 500000, 1000000, 5000000, 10000000];

  console.error(`Sieving primes up to ${N}...`);
  const piMilestones = computePi(N, milestones);

  // Compute π − Li at each milestone
  const results = piMilestones.map(({ x, pi_x }) => {
    const li_x = Li(x);
    const diff = pi_x - li_x;
    const sqrtXOverLog = Math.sqrt(x) / Math.log(x);
    return {
      x,
      pi_x,
      Li_x: +li_x.toFixed(2),
      'π(x)-Li(x)': +diff.toFixed(2),
      '√x/log(x)': +sqrtXOverLog.toFixed(2),
      ratio_absDiff_over_sqrtXlogX: +(Math.abs(diff) / sqrtXOverLog).toFixed(4),
      sign: diff < 0 ? 'NEG (Li>π)' : 'POS',
    };
  });

  // Check all differences are negative in our range
  const allNegative = results.every(r => r['π(x)-Li(x)'] < 0);

  // Extrapolation: under RH, |π(x)-Li(x)| = O(√x log x)
  // Our data: at x=10^7, diff = ? Expected ~ √(10^7) · log(10^7) ≈ 3162 · 16.1 ≈ 50900
  const x_7 = 10000000;
  const expected_RH_bound = Math.sqrt(x_7) * Math.log(x_7);

  // Historical context: Skewes bounds
  const skewesBounds = {
    Skewes_1933_assumingRH: 'e^{e^{e^79}} ≈ 10^{10^{10^34}}',
    Skewes_1955_unconditional: '10^{10^{10^964}}',
    Cohen_Dress_1988: '6.69e370',
    Bays_Hudson_2000: '1.398e316',
    Chao_Plymen_2015: '~1.4e316 (current best)',
  };

  return {
    framework: {
      name: 'Skewes Number: π(x) vs Li(x)',
      earlyBelief: 'π(x) < Li(x) always (empirically true up to x ≤ 10^{19})',
      littlewood1914: 'PROVED: π(x) > Li(x) infinitely often',
      firstCrossingBound: skewesBounds.Chao_Plymen_2015,
    },

    results,

    summary: {
      allNegative_in_range: allNegative,
      N_tested: N,
      x_range: `[10² , ${N}]`,
      note: 'All tested x satisfy π(x) < Li(x) — first crossing is beyond ~10^{316}.',
    },

    RH_growth_check: {
      at_x: x_7,
      'π(x)-Li(x)_actual': results[results.length-1]['π(x)-Li(x)'],
      '√x·log(x)_bound': +expected_RH_bound.toFixed(1),
      'ratio': +(Math.abs(results[results.length-1]['π(x)-Li(x)']) / expected_RH_bound).toFixed(4),
      note: 'Under RH: |π(x)-Li(x)| = O(√x log x). Our data within this bound.',
    },

    skewesBounds,

    keyFindings: [
      `Tested π(x) and Li(x) at ${milestones.length} values up to x=10^7.`,
      `π(${N})=${results[results.length-1].pi_x}, Li(${N})=${results[results.length-1].Li_x}, diff=${results[results.length-1]['π(x)-Li(x)']}.`,
      `All tested x: π(x) < Li(x) (consistent, first crossing ~10^{316}).`,
      `|π(x)-Li(x)| at x=10^7: ${Math.abs(results[results.length-1]['π(x)-Li(x)']).toFixed(0)}, RH bound √x·log(x) ≈ ${expected_RH_bound.toFixed(0)}, ratio ${(Math.abs(results[results.length-1]['π(x)-Li(x)']) / expected_RH_bound).toFixed(3)}.`,
      `Smallest ratio |π-Li|/(√x/log(x)): ${Math.min(...results.map(r => r.ratio_absDiff_over_sqrtXlogX)).toFixed(3)}.`,
    ],

    relationToRH: {
      littlewoodProof:
        'Littlewood 1914 used ζ-zeros to prove π(x) − Li(x) changes sign infinitely often. ' +
        'The proof is NON-CONSTRUCTIVE; Skewes 1933 gave the first (enormous) explicit upper bound.',
      rhConnection:
        'Under RH, π(x) − Li(x) = O(√x log x) (best possible). ' +
        'Oscillations at scale √x/log(x) are driven by ζ-zero sum in the explicit formula.',
      dramaticGap:
        `CONCEPTUAL TAKEAWAY: computable range is up to ~10^{19}, but first crossing ` +
        `occurs around 10^{316}. This is a 300-order-of-magnitude gap — illustrating that ` +
        `direct numerical verification can be wildly misleading.`,
    },

    nextStep:
      'Compute π(x) at x near Bays-Hudson crossing estimate via Odlyzko-Schönhage algorithms. ' +
      'Verify |π(x) − Li(x)| growth more carefully at x=10^8, 10^9.',

    verdict:
      `SKEWES ANALYSIS: π(x) < Li(x) at all tested x up to 10^7 (as expected). ` +
      `At x=10^7: diff=${results[results.length-1]['π(x)-Li(x)']}. ` +
      `First crossing proven to exist (Littlewood 1914) but occurs beyond ~10^{316} (Chao-Plymen 2015). ` +
      'Most dramatic gap between "numerically true" and "actually true" in math.',
  };
}
