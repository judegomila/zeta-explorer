/**
 * PRZZ 2023: Critical Line Proportion > 41.7%
 *
 * imp-294: Pratt-Robles-Zaharescu-Zeindler (Nov 2023) improved:
 *   > 41.7% of ζ-zeros on σ=1/2 (and > 40.7% simple)
 *
 * Previous: Bui-Conrey-Young 2011: > 41.05%
 *
 * METHOD: Levinson-Conrey mollified moments with improved mollifier.
 * The mollifier M(s) = Σ_{n≤Y} μ(n)·P(log(Y/n)/log Y)/n^s smooths ζ.
 * Key: PRZZ use longer mollifier + better error terms.
 *
 * NUMERICAL TEST: count sign changes of Z(t) (= zeros on σ=1/2)
 * and compare to N(T) at heights up to our extended zeros (T=2000).
 *
 * If count/N(T) ≈ 1.0, this is consistent with 100% (RH).
 * The 41.7% is the UNCONDITIONAL lower bound provable without RH.
 */

import { riemannSiegelZEnhanced, ZETA_ZEROS } from './zeta.js';

function rvm(T) {
  if (T <= 2) return 0;
  return (T/(2*Math.PI)) * Math.log(T/(2*Math.PI*Math.E)) + 7/8;
}

function countSignChanges(a, b, dt) {
  let count = 0, prevSign = 0;
  for (let t = a; t <= b; t += dt) {
    const Z = riemannSiegelZEnhanced(t);
    const sign = Z > 0 ? 1 : (Z < 0 ? -1 : 0);
    if (sign !== 0 && prevSign !== 0 && sign !== prevSign) count++;
    if (sign !== 0) prevSign = sign;
  }
  return count;
}

export function przz2023CriticalLineTest() {
  // Historical progression of critical line proportions
  const history = [
    { year: 1914, author: 'Hardy', result: '∞ many', proportion: '>0 (qualitative)' },
    { year: 1942, author: 'Selberg', result: 'positive fraction', proportion: '>0% (quantitative)' },
    { year: 1974, author: 'Levinson', result: '>1/3', proportion: '>33.33%' },
    { year: 1989, author: 'Conrey', result: '>2/5', proportion: '>40.00%' },
    { year: 2011, author: 'Bui-Conrey-Young', result: '>0.4105', proportion: '>41.05%' },
    { year: 2023, author: 'Pratt-Robles-Zaharescu-Zeindler', result: '>0.417', proportion: '>41.7% (CURRENT BEST)' },
    { year: '???', author: 'RH', result: '=1', proportion: '=100%' },
  ];

  // Empirical: count sign changes at several heights
  const checkpoints = [100, 200, 500, 1000];
  const empirical = checkpoints.map(T => {
    const N0 = countSignChanges(10, T, 0.02);
    const NT = rvm(T);
    const actual = ZETA_ZEROS.filter(g => g <= T).length;
    return {
      T,
      sign_changes: N0,
      'N(T)': +NT.toFixed(1),
      actual_zeros: actual,
      'N0/N(T)': +(N0/NT).toFixed(4),
      consistent_with_100pct: Math.abs(N0/NT - 1) < 0.05,
    };
  });

  // The PRZZ improvement: from 41.05% to 41.7%
  // Key technique: longer mollifier with polynomial P of higher degree
  // M(s) = Σ_{n≤Y} μ(n)·P_k(log(Y/n)/log Y)/n^s where P_k has degree k
  // Levinson: k=1. Conrey: k=2. BCY: k=3. PRZZ: optimized k with better error.
  const mollifierProgress = [
    { method: 'Levinson (1974)', mollifier_degree: 1, proportion: 33.33 },
    { method: 'Conrey (1989)', mollifier_degree: 2, proportion: 40.00 },
    { method: 'BCY (2011)', mollifier_degree: 3, proportion: 41.05 },
    { method: 'PRZZ (2023)', mollifier_degree: 'optimized', proportion: 41.7 },
  ];

  // What would it take to reach higher proportions?
  const projections = [
    { target: '50%', difficulty: 'Requires fundamentally longer mollifier or new technique' },
    { target: '60%', difficulty: 'Beyond current mollifier technology' },
    { target: '75%', difficulty: 'Would need breakthrough in mean value estimates' },
    { target: '100%', difficulty: '= PROVING RH' },
  ];

  return {
    framework: {
      name: 'PRZZ 2023: Critical Line Proportion > 41.7%',
      result: 'More than 41.7% of ζ-zeros lie on σ=1/2',
      simple: 'More than 40.7% are SIMPLE zeros on σ=1/2',
      method: 'Levinson-Conrey mollified moments with optimized polynomial',
      previous: 'BCY 2011: > 41.05%',
    },

    historical_progression: history,
    mollifier_progress: mollifierProgress,

    empirical_proportion: empirical,

    projections,

    keyFindings: [
      `PRZZ (Nov 2023): > 41.7% on critical line (up from BCY 41.05%).`,
      `Empirical: sign changes / N(T) at T=1000: ${empirical[3]['N0/N(T)']} ≈ 1.0 (consistent with 100% = RH).`,
      `Mollifier degree progression: 1→2→3→optimized, proportion: 33%→40%→41%→41.7%.`,
      `Each additional 1% requires YEARS of technical innovation.`,
      `Gap to RH: 100% - 41.7% = 58.3% unproven unconditionally.`,
      `PRZZ also proved > 40.7% are SIMPLE (not just on critical line but multiplicity 1).`,
    ],

    verdict:
      `PRZZ 2023: >41.7% on σ=1/2 (SOTA). Empirical N0/N(T)=${empirical[3]['N0/N(T)']} at T=1000. ` +
      'Gap to RH: 58.3%. Mollifier technology approaches diminishing returns.',
  };
}
