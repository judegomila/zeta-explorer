/**
 * P15-1: Lehmer Pair Database — Find All Tight Zero Pairs
 *
 * imp-295 (CRITICAL): Lehmer pairs are consecutive ζ-zeros (γ_n, γ_{n+1})
 * with anomalously small normalized gap:
 *
 *   normalized_gap = (γ_{n+1} - γ_n) * log(γ_n/(2π)) / (2π)
 *
 * Mean normalized gap = 1.0 (by Riemann-von Mangoldt normalization).
 * Lehmer pairs have normalized_gap << 1.
 *
 * WHY THEY MATTER: Lehmer pairs collide FIRST under backward heat flow.
 * The tightest pair determines Λ from below via Csordas-Smith-Varga.
 * They are the BOTTLENECK for the entire Polymath15 approach.
 */

import { ZETA_ZEROS } from './zeta.js';

export function lehmerPairDatabaseTest() {
  const zeros = ZETA_ZEROS;
  const N = zeros.length;

  // Compute all gaps and normalized gaps
  const pairs = [];
  for (let i = 0; i < N - 1; i++) {
    const g1 = zeros[i], g2 = zeros[i+1];
    const gap = g2 - g1;
    const density = Math.log(g1 / (2*Math.PI)) / (2*Math.PI);
    const normalizedGap = gap * density;
    pairs.push({ index: i+1, gamma: +g1.toFixed(4), gap: +gap.toFixed(6), normalizedGap: +normalizedGap.toFixed(6), density: +density.toFixed(6) });
  }

  // Sort by normalized gap (tightest first)
  const sorted = [...pairs].sort((a,b) => a.normalizedGap - b.normalizedGap);

  // Top 20 tightest (Lehmer pairs)
  const top20 = sorted.slice(0, 20);

  // Statistics
  const allNormGaps = pairs.map(p => p.normalizedGap);
  const mean = allNormGaps.reduce((a,b)=>a+b,0) / allNormGaps.length;
  const variance = allNormGaps.reduce((s,x)=>s+(x-mean)**2,0) / allNormGaps.length;
  const min = allNormGaps[0] < allNormGaps[allNormGaps.length-1] ? Math.min(...allNormGaps) : sorted[0].normalizedGap;

  // Histogram of normalized gaps
  const bins = 20, binMax = 3;
  const hist = new Array(bins).fill(0);
  for (const ng of allNormGaps) {
    const b = Math.floor(ng / (binMax/bins));
    if (b >= 0 && b < bins) hist[b]++;
  }
  const binW = binMax/bins;
  const gapDistribution = hist.map((c, i) => ({
    x: +((i+0.5)*binW).toFixed(2),
    count: c,
    density: +(c / (allNormGaps.length * binW)).toFixed(4),
    GUE_prediction: +(Math.PI**2/6 * ((i+0.5)*binW)**2 * Math.exp(-Math.PI/4*((i+0.5)*binW)**2) * 2).toFixed(4),
  }));

  // Csordas-Smith-Varga relevance: tightest pair gives lower bound on Λ
  const tightest = sorted[0];
  // Simplified CSV: Λ ≥ -(gap^2 * gamma^2) / (8 * π^2) approximately
  // (actual formula involves more terms; this is order-of-magnitude)
  const csvEstimate = -(tightest.gap * tightest.gap * tightest.gamma * tightest.gamma) / (8 * Math.PI * Math.PI);

  return {
    framework: {
      name: 'Lehmer Pair Database (P15-1)',
      definition: 'Consecutive ζ-zeros with normalized gap << 1',
      normalization: 'normalized_gap = raw_gap × log(γ/(2π))/(2π)',
      role: 'Bottleneck for Λ: tightest pair collides first under backward heat flow',
    },

    total_pairs: pairs.length,
    mean_normalized_gap: +mean.toFixed(4),
    variance: +variance.toFixed(4),
    min_normalized_gap: +min.toFixed(6),

    top_20_lehmer_pairs: top20,

    gap_distribution: gapDistribution.filter((_,i) => i % 2 === 0),

    csv_relevance: {
      tightest_pair: tightest,
      csv_lower_bound_estimate: +csvEstimate.toFixed(6),
      note: 'Simplified CSV estimate; imp-300 will compute exact bound',
    },

    keyFindings: [
      `Scanned ${pairs.length} consecutive pairs from ${N} zeros.`,
      `Mean normalized gap: ${mean.toFixed(4)} (expected ~1.0 from GUE).`,
      `TIGHTEST pair: index ${tightest.index}, γ=${tightest.gamma}, gap=${tightest.gap}, normalized=${tightest.normalizedGap}.`,
      `Top 5 tightest: ${top20.slice(0,5).map(p => `#${p.index}:${p.normalizedGap}`).join(', ')}.`,
      `${sorted.filter(p=>p.normalizedGap < 0.3).length} pairs with normalized gap < 0.3 (Lehmer-tight).`,
      `${sorted.filter(p=>p.normalizedGap < 0.5).length} pairs with normalized gap < 0.5.`,
      `CSV lower bound estimate from tightest: Λ ≥ ${csvEstimate.toFixed(6)}.`,
      `These pairs will collide FIRST under backward Dyson ODE (imp-296/297).`,
    ],

    verdict:
      `LEHMER DATABASE: ${pairs.length} pairs scanned. Tightest normalized gap = ${min.toFixed(4)}. ` +
      `${sorted.filter(p=>p.normalizedGap<0.5).length} Lehmer pairs (gap<0.5). Ready for Dyson ODE.`,
  };
}
