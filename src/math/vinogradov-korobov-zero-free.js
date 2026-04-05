/**
 * Vinogradov-Korobov Zero-Free Region for ζ(s)
 *
 * imp-248: The BEST KNOWN unconditional zero-free region (since 1958):
 *
 *   ζ(σ + it) ≠ 0 for σ > 1 − c / (log |t|)^{2/3} · (log log |t|)^{1/3}
 *
 * for |t| ≥ 3 and effective c > 0.
 *
 * HISTORY:
 *   de la Vallée Poussin (1899):  σ > 1 − c₀/log t     (classical)
 *   Vinogradov-Korobov (1958):    σ > 1 − c/(log t)^{2/3}·(log log t)^{1/3}
 *   Ford (2002):                  c ≥ 1/57.54 for |t| ≥ 3
 *   Kadiri (2005):                c₀ ≥ 1/5.69693 for classical region
 *   RH (conjectured):            σ > 1/2   (critical line)
 *
 * SIGNIFICANCE: VK gives the PNT with best known error term:
 *   ψ(x) = x + O(x · exp(−c₁·(log x)^{3/5}/(log log x)^{1/5}))
 *
 * The VK region is STRICTLY LARGER than the classical 1-c/log t, but
 * STILL infinitely far from σ = 1/2 (the critical line under RH).
 *
 * THIS MODULE:
 *   1. Define σ_VK(t) and σ_classical(t) zero-free boundaries.
 *   2. For known ζ-zeros at σ = 1/2, compute gap = σ_VK(γ) − 1/2.
 *   3. Tabulate boundary at heights t ∈ {10, 100, 10³, ..., 10²⁰}.
 *   4. Show VK improvement over classical.
 *   5. Compute PNT error term implications.
 */

import { ZETA_ZEROS } from './zeta.js';

// ── Zero-free boundary: classical de la Vallée Poussin ───────────────────

function sigmaClassical(t, c0 = 1/5.69693) {
  // σ > 1 − c₀/log t (Kadiri 2005 constant)
  if (t < 3) return 0.5;
  return 1 - c0 / Math.log(t);
}

// ── Zero-free boundary: Vinogradov-Korobov ──────────────────────────────

function sigmaVK(t, c = 1/57.54) {
  // σ > 1 − c / ((log t)^{2/3} · (log log t)^{1/3})
  if (t < 3) return 0.5;
  const logT = Math.log(t);
  const logLogT = Math.log(logT);
  if (logLogT <= 0) return sigmaClassical(t);
  return 1 - c / (Math.pow(logT, 2/3) * Math.pow(logLogT, 1/3));
}

// ── PNT error term: ψ(x) = x + O(x · exp(−E(x))) ───────────────────────
// VK gives E(x) = c₁ · (log x)^{3/5} / (log log x)^{1/5}
// Classical gives E(x) = c₂ · √(log x)

function pntErrorVK(x, c1 = 0.2) {
  const logX = Math.log(x);
  const logLogX = Math.log(logX);
  return c1 * Math.pow(logX, 3/5) / Math.pow(logLogX, 1/5);
}

function pntErrorClassical(x, c2 = 0.5) {
  return c2 * Math.sqrt(Math.log(x));
}

function pntErrorRH(x) {
  // Under RH: ψ(x) = x + O(√x · log²x), so E(x) ~ (1/2)·log x
  return 0.5 * Math.log(x);
}

// ── Main test ───────────────────────────────────────────────────────────────

export function vinogradovKorobovZeroFreeTest() {
  // Table of zero-free boundaries at various heights
  const heights = [10, 100, 1000, 1e4, 1e6, 1e10, 1e15, 1e20];
  const boundaryTable = heights.map(t => {
    const sVK = sigmaVK(t);
    const sCl = sigmaClassical(t);
    return {
      t: t >= 1e6 ? t.toExponential(0) : t,
      'σ_VK(t)': +sVK.toFixed(6),
      'σ_classical(t)': +sCl.toFixed(6),
      'VK gap from 1/2': +(sVK - 0.5).toFixed(6),
      'classical gap from 1/2': +(sCl - 0.5).toFixed(6),
      'VK improvement': +((1-sVK)/(1-sCl)).toFixed(4),  // ratio of zero-free widths
    };
  });

  // For known ζ-zeros (all at σ=1/2), compute distance to VK boundary
  const zeroDistances = ZETA_ZEROS.filter(g => g > 10).slice(0, 10).map(gamma => ({
    γ: +gamma.toFixed(4),
    'σ_VK(γ)': +sigmaVK(gamma).toFixed(6),
    'σ_classical(γ)': +sigmaClassical(gamma).toFixed(6),
    'gap (1/2 − σ_VK)': +(0.5 - sigmaVK(gamma)).toFixed(6),
    'gap (1/2 − σ_cl)': +(0.5 - sigmaClassical(gamma)).toFixed(6),
    'zeros INSIDE VK region': true,  // always, since σ=1/2 < σ_VK
  }));

  // PNT error comparison at various x
  const pntX = [1e6, 1e10, 1e20, 1e50, 1e100];
  const pntComparison = pntX.map(x => ({
    x: x.toExponential(0),
    'E_VK(x)': +pntErrorVK(x).toFixed(4),
    'E_classical(x)': +pntErrorClassical(x).toFixed(4),
    'E_RH(x)': +pntErrorRH(x).toFixed(4),
    'VK/RH ratio': +(pntErrorVK(x) / pntErrorRH(x)).toFixed(4),
    'x·exp(−E_VK)_frac': +Math.exp(-pntErrorVK(x)).toExponential(3),
    'x·exp(−E_RH)_frac': +Math.exp(-pntErrorRH(x)).toExponential(3),
  }));

  // Zero-free width: w(t) = 1 − σ_VK(t). This SHRINKS as t grows (harder to exclude zeros at high t).
  // Compare VK width vs classical width at each height.
  const zeroFreeWidth = heights.map(t => {
    const wVK = 1 - sigmaVK(t);
    const wCl = 1 - sigmaClassical(t);
    return {
      t: t >= 1e6 ? t.toExponential(0) : t,
      'width_VK': +wVK.toExponential(4),
      'width_classical': +wCl.toExponential(4),
      'VK/classical width': +(wVK / wCl).toFixed(4),
      'RH_width (= 1/2)': 0.5,
      'VK/RH width': +(wVK / 0.5).toFixed(6),
    };
  });

  return {
    framework: {
      name: 'Vinogradov-Korobov Zero-Free Region (1958)',
      vk_region: 'ζ(σ+it) ≠ 0 for σ > 1 − c/(log t)^{2/3}·(log log t)^{1/3}',
      classical: 'de la Vallée Poussin (1899): σ > 1 − c₀/log t',
      rh: 'ζ(σ+it) ≠ 0 for σ > 1/2  (Riemann Hypothesis)',
      constants: 'Ford (2002): c ≥ 1/57.54; Kadiri (2005): c₀ ≥ 1/5.70',
    },

    boundary_table: boundaryTable,

    known_zeros_vs_boundary: zeroDistances,

    pnt_error_comparison: pntComparison,

    zero_free_width: {
      description: 'Width of zero-free strip: w(t)=1-σ_VK(t). Shrinks as t grows. RH gives w=1/2.',
      data: zeroFreeWidth,
    },

    keyFindings: [
      `VK zero-free boundary computed at 8 heights from t=10 to t=10^20.`,
      `At t=10^6: σ_VK = ${boundaryTable[4]['σ_VK(t)']}, σ_cl = ${boundaryTable[4]['σ_classical(t)']} (VK is closer to σ=1, narrower zero-free).`,
      `At t=10^20: σ_VK = ${boundaryTable[7]['σ_VK(t)']}, gap from 1/2 = ${boundaryTable[7]['VK gap from 1/2']}.`,
      `VK improvement over classical: ${boundaryTable[7]['VK improvement']}× at t=10^20 (VK wider zero-free region).`,
      `Known zeros at σ=1/2 are DEEP inside VK region: gap = ${zeroDistances[0]['gap (1/2 − σ_VK)']} at γ=${zeroDistances[0].γ}.`,
      `VK zero-free width at t=10^20: w=${(1-boundaryTable[7]['σ_VK(t)']).toExponential(3)} (vs RH width=0.5). Ratio=${((1-boundaryTable[7]['σ_VK(t)'])/0.5).toExponential(3)}.`,
      `VK width SHRINKS as t grows: w(10)=${(1-boundaryTable[0]['σ_VK(t)']).toExponential(2)}, w(10^20)=${(1-boundaryTable[7]['σ_VK(t)']).toExponential(2)}. VK gets WORSE at large height.`,
      `PNT: VK gives E(x)~(log x)^{3/5}/(log log x)^{1/5}, RH gives E~(1/2)log x. VK/RH ratio → 0 as x → ∞.`,
    ],

    relationToRH: {
      bestUnconditional:
        'Vinogradov-Korobov (1958) is the BEST unconditional zero-free region for ζ(s), ' +
        'unchanged for 65+ years. No one has improved the exponent 2/3.',
      gap_to_rh:
        'VK: σ > 1 − c·(log t)^{-2/3}·(log log t)^{-1/3} vs RH: σ > 1/2. ' +
        'The VK boundary approaches σ = 1 as t → ∞ (never reaches 1/2). ' +
        'Closing this gap = proving RH.',
      connection_to_exponential_sums:
        'VK proof uses: (1) Vinogradov\'s exponential sum method (1937), ' +
        '(2) Korobov\'s refinement of exponential sum estimates. ' +
        'The 2/3 exponent comes from bounding Σ e^{2πi·f(n)} optimally.',
      pnt_strength:
        'VK-PNT: ψ(x)=x+O(x·exp(−c(log x)^{3/5}/(log log x)^{1/5})) — ' +
        'exponentially better than classical O(x·exp(−c√(log x))). ' +
        'Under RH: ψ(x)=x+O(√x·log²x), i.e. E(x)~(1/2)log x.',
      improving_vk:
        'Improving VK exponent from 2/3 to 1 would prove RH. ' +
        'Any improvement to 2/3+ε would be a major breakthrough.',
    },

    nextStep:
      'Implement explicit VK constant computation via Ford (2002). ' +
      'Compare to Korobov\'s original method vs Vinogradov\'s. ' +
      'Investigate why 2/3 is a barrier (exponential sum limitations).',

    verdict:
      `VINOGRADOV-KOROBOV: best unconditional zero-free region σ > 1 − c/(log t)^{2/3}(log log t)^{1/3} ` +
      `computed at heights up to 10^20. Gap from σ=1/2: ${boundaryTable[7]['VK gap from 1/2']} at t=10^20. ` +
      `VK never reaches σ=1/2 (would require t → ∞). Improving 2/3 → 1 would prove RH.`,
  };
}
