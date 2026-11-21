/**
 * @module imp-124830-kernel-sqrt10-curvature-derivation
 *
 * imp-124830 (numerical/derivation, frontier cross-check): imp-97823/imp-124776 report that the shared
 * reconstruction kernel |K| = |1/(N sigma_N)| per-decade growth ratio brackets sqrt(10) = 10^(1/2) = 3.162278
 * from opposite sides on the two arms of the imp-97520 L1 sigma peak (sigma_max ~ 0.949429, N_peak ~ 9.22e5),
 * converging in the deep window -- but the sqrt(10) value was stated as a MEASURED asymptote, never DERIVED from
 * the peak curvature. This leaf DERIVES the sqrt(10) explicitly and separates the two distinct roles the local
 * peak expansion plays: (a) the fold ORDER fixes the exponent, (b) the curvature MAGNITUDE fixes only the
 * amplitude. It then MEASURES the deep-window convergence rate |ratio_k - sqrt(10)| in the g = 1e-6 .. 1e-8
 * window on BOTH arms. Reuses the imp-97721/imp-97823/imp-97833 kernel construction verbatim; measurement/
 * derivation ONLY on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 and the C_C 1/8 ansatz are UNTOUCHED; pinned constants untouched; changes no
 * bound; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE DERIVATION -- WHY sqrt(10), AND WHAT THE CURVATURE ACTUALLY CONTROLS
 * ----------------------------------------------------------------------
 * Near the interior peak, in x = ln N with dx = x - x_peak, sigma(x) = sigma_max - A*dx^2 - B*dx^3 - ... The
 * near-peak gap is g = sigma_max - sigma = A*dx^2 + O(dx^3), so |dx| = sqrt(g/A)*(1 + O(sqrt(g))). The Jacobian
 * is d sigma / d ln N = -2A*dx + O(dx^2), and the kernel is K = -1/(d sigma / d ln N), hence at leading order
 *      |K| = 1 / (2 A |dx|) = 1 / (2 A * sqrt(g/A)) = 1 / (2 sqrt(A)) * g^(-1/2)  ==  C * g^(-1/2),
 *      C = 1 / (2 sqrt(A)).
 * TWO SEPARATE FACTS FALL OUT, and this leaf is about keeping them separate:
 *   (D1) THE EXPONENT -1/2 IS THE FOLD ORDER, NOT THE CURVATURE VALUE. The per-decade growth ratio is
 *        r = |K|(g/10) / |K|(g) = (g/10)^(-1/2) / g^(-1/2) = 10^(1/2) = sqrt(10), EXACTLY, and A CANCELS. So
 *        sqrt(10) is not an amplitude that happens to land near 3.162278 -- it is 10^(-p) with p = -1/2, and
 *        p = -1/2 is forced purely by the peak being a NON-DEGENERATE order-2 maximum (the gap is quadratic in
 *        dx). Any smooth interior maximum, at ANY curvature A > 0, gives sqrt(10) per decade; a degenerate
 *        order-2m maximum (g ~ dx^(2m)) would instead give 10^(1/2m). The curvature MAGNITUDE is invisible to
 *        the ratio -- this is the content the earlier "measured sqrt(10)" statements left implicit.
 *   (D2) THE CURVATURE MAGNITUDE FIXES ONLY THE AMPLITUDE C = 1/(2 sqrt(A)). This is the falsifiable, curvature
 *        -dependent prediction: with the imp-97833 stencil curvature A = -sigma''(x_peak)/2, the closed form
 *        predicts the |K| amplitude C_pred = 1/(2 sqrt(A)) exactly, and the measured amplitude C_meas =
 *        |K|(g) * sqrt(g) must converge to C_pred as g -> 0 on both arms. That is the quantitative link between
 *        the sqrt(10) law and the peak curvature the ticket asks for.
 * The -1/2 far-tail slope of the log10|K|-vs-log10(g) fit (imp-97823 M1, p = -0.4994/-0.5006) is the SAME
 * exponent read off the same fold-order-2 Jacobian; the sqrt(10) per-decade ratio 10^(-p) and that slope are two
 * views of one fact.
 *
 * THE MEASUREMENT (the deliverable)
 * ---------------------------------
 *   (i)  AMPLITUDE CLOSED FORM. A = -sigma''(x_peak)/2 (5-point O(h^2) stencil, h = 0.05, imp-97833 verbatim);
 *        C_pred = 1/(2 sqrt(A)). Measured amplitude C_meas = |K|(g)*sqrt(g) at g = 1e-6, 1e-7, 1e-8 on both arms;
 *        report the relative error C_meas / C_pred - 1 and confirm it shrinks toward zero (the two arms bracket
 *        C_pred from opposite sides -- the cubic-fold antisymmetry appears in the amplitude too).
 *   (ii) DEEP-WINDOW CONVERGENCE RATE. |ratio_k - sqrt(10)| for the two decade ratios in g = 1e-6 .. 1e-8 on each
 *        arm, and the decade-over-decade decay factor (predicted ~1/sqrt(10) = 0.316228, since the O(sqrt(g))
 *        running correction shrinks by sqrt(10) each decade). Confirm the arms bracket sqrt(10) (upslope from
 *        below, downslope from above).
 *
 * THE FINDING (derivation / measurement only)
 * -------------------------------------------
 *   (D)  sqrt(10) DERIVED, CURVATURE-INDEPENDENT. The per-decade growth is 10^(-p) with p = -1/2 forced by the
 *        order-2 (quadratic-gap) fold; A cancels from the ratio. The curvature magnitude enters ONLY the
 *        amplitude C = 1/(2 sqrt(A)): with A = 3.2160e-3 the closed form predicts C_pred = 8.816882, and the
 *        measured C_meas = |K|*sqrt(g) converges onto it from both arms (upslope from above, downslope from
 *        below) to < 2e-3 relative at g = 1e-8 -- the curvature-to-amplitude link is quantitatively confirmed.
 *   (M)  DEEP-WINDOW CONVERGENCE RATE. In g = 1e-6 .. 1e-8, |ratio - sqrt(10)| runs 3.11e-3 -> 9.83e-4 (upslope,
 *        from below) / 3.12e-3 -> 9.84e-4 (downslope, from above), decaying by a factor ~0.316 per decade
 *        (~1/sqrt(10)) -- the O(sqrt(g)) running correction, opposite-signed on the two arms, exactly the
 *        imp-97833 cubic-fold signature. The sqrt(10) asymptote is approached geometrically, not saturated.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the
 * C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED and
 * appear only as the fixed surrogate; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97823-kernel-decade-growth-sqrt10 (|K| ~ sqrt(10) per decade measured; sqrt(10) stated, not derived)
 * @see imp-124776-kernel-decade-ratio-vs-gap-viz-data (per-decade ratio brackets sqrt(10) from both arms)
 * @see imp-97833-cubic-fold-curvature-B (A = -sigma''/2, B = -sigma'''/6 stencils; cubic-fold running correction)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (L1 peak sigma_max ~ 0.949429, N_peak ~ 9.22e5)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-97644/imp-97721/imp-97823/imp-97833 exactly
const SQRT10 = Math.sqrt(10); // 3.16227766... (the exact prediction)

// EXACT imp-3406/imp-97644/imp-97721/imp-97823/imp-97833 surrogate (baseline amplitudes c = C_C_PINNED, e = E_TRUNC_PT, f = 1).
function sigmaAt(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return E_coll / E_N;
}
// Interior peak location: ternary search in x = ln N (imp-97662/imp-97721/imp-97823/imp-97833 verbatim).
function peakLogN() {
  let a = Math.log(1e4);
  let b = Math.log(1e8);
  for (let i = 0; i < 300; i++) {
    const m1 = a + (b - a) / 3;
    const m2 = b - (b - a) / 3;
    if (sigmaAt(Math.exp(m1)) < sigmaAt(Math.exp(m2))) a = m1;
    else b = m2;
  }
  return (a + b) / 2;
}

const X_PEAK = peakLogN();
const N_PEAK = Math.exp(X_PEAK);
const SIGMA_MAX = sigmaAt(N_PEAK);

// Curvature A = -sigma''(x_peak)/2 via a 5-point O(h^2) central stencil in x = ln N (imp-97833 h = 0.05 primary).
const sig = (dx) => sigmaAt(Math.exp(X_PEAK + dx));
function curvatureA(h) {
  const s2h = sig(2 * h);
  const sh = sig(h);
  const s0 = sig(0);
  const smh = sig(-h);
  const sm2h = sig(-2 * h);
  const d2 = (-s2h + 16 * sh - 30 * s0 + 16 * smh - sm2h) / (12 * h * h); // sigma''
  return -d2 / 2;
}
const A_FIT = curvatureA(0.05); // ~3.2160e-3 (imp-97833 primary readout)
const C_PRED = 1 / (2 * Math.sqrt(A_FIT)); // closed-form kernel amplitude: |K| = C_pred * g^(-1/2)

// d sigma / d ln N via 5-point O(h^4) stencil (imp-97721/imp-97823/imp-97833) -- the shared kernel K = -1/(N sigma_N).
const H_STENCIL = 1e-4;
function dSigmaDlnN(N, h) {
  const s = (d) => sigmaAt(N * Math.exp(d));
  return (-s(2 * h) + 8 * s(h) - 8 * s(-h) + s(-2 * h)) / (12 * h);
}
// Downslope crossing (right arm): sigma first drops below target.
function crossBelow(target) {
  let a = X_PEAK;
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (sigmaAt(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
// Upslope crossing (left arm): sigma first rises above target.
function crossAbove(target) {
  let a = Math.log(1e4);
  let b = X_PEAK;
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (sigmaAt(Math.exp(m)) < target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
function absKAtGap(g, arm) {
  const target = SIGMA_MAX - g;
  const N = arm === 'down' ? crossBelow(target) : crossAbove(target);
  return Math.abs(-1 / dSigmaDlnN(N, H_STENCIL));
}

const DEEP_GAPS = [1e-6, 1e-7, 1e-8]; // the deep near-peak window (three gaps -> two decade ratios)

// Per-arm derivation cross-check (amplitude closed form) + deep-window convergence rate.
function armReport(arm) {
  const ks = DEEP_GAPS.map((g) => absKAtGap(g, arm));
  // (i) amplitude closed form C = |K|*sqrt(g) -> C_pred = 1/(2 sqrt(A)).
  const cMeas = DEEP_GAPS.map((g, i) => ks[i] * Math.sqrt(g));
  const cRelErr = cMeas.map((c) => c / C_PRED - 1);
  // (ii) deep-window per-decade ratios, deviation from sqrt(10), and decade-over-decade decay of that deviation.
  const ratios = [];
  for (let i = 0; i + 1 < ks.length; i++) ratios.push(ks[i + 1] / ks[i]);
  const dev = ratios.map((r) => r - SQRT10);
  const devDecay = [];
  for (let i = 0; i + 1 < dev.length; i++) devDecay.push(Math.abs(dev[i + 1]) / Math.abs(dev[i]));
  return {
    absK: ks.map((v) => +v.toExponential(5)),
    amplitude_C_measured: cMeas.map((v) => +v.toFixed(6)),
    amplitude_C_rel_err: cRelErr.map((v) => +v.toExponential(3)),
    per_decade_ratios: ratios.map((v) => +v.toFixed(6)),
    ratio_deviation_from_sqrt10: dev.map((v) => +v.toExponential(3)),
    deviation_decade_decay_factor: devDecay.map((v) => +v.toFixed(4)), // ~1/sqrt(10) = 0.3162
  };
}

const UP = armReport('up');
const DOWN = armReport('down');

export const IMP124830_KERNEL_SQRT10_CURVATURE_DERIVATION = {
  id: 'imp-124830',
  proofSection: 'S-frontier',
  question:
    'imp-97823/imp-124776 report the reconstruction kernel |K| = |1/(N sigma_N)| per-decade growth ratio brackets ' +
    'sqrt(10) = 3.162278 from both arms of the imp-97520 L1 sigma peak (sigma_max ~ 0.949429, N_peak ~ 9.22e5), ' +
    'converging in the deep window -- but sqrt(10) was stated as a MEASURED asymptote, never DERIVED from the peak ' +
    'curvature. Why does the ratio tend to sqrt(10), and what does the curvature actually control? Measure the ' +
    'deep-window convergence rate |ratio - sqrt(10)| (g = 1e-6..1e-8) on both arms. Derivation/measurement only; ' +
    'pinned constants untouched; no bound moves; no QED.',
  method:
    'Reusing the imp-97721/imp-97823/imp-97833 kernel construction verbatim, DERIVE |K| = 1/(2 sqrt(A)) * g^(-1/2) ' +
    'from the near-peak expansion sigma = sigma_max - A*dx^2 - ... (g = A*dx^2, d sigma / d ln N = -2A*dx), and ' +
    'separate the two roles: the fold ORDER 2 fixes the exponent -1/2 so the per-decade ratio is 10^(1/2) = ' +
    'sqrt(10) with A CANCELLING, while the curvature MAGNITUDE fixes only the amplitude C = 1/(2 sqrt(A)). ' +
    'CROSS-CHECK the amplitude: measure C_meas = |K|(g)*sqrt(g) at g = 1e-6,1e-7,1e-8 on both arms vs C_pred = ' +
    '1/(2 sqrt(A)) with A = -sigma the peak second-derivative half (imp-97833 5-point stencil). MEASURE the ' +
    'deep-window |ratio - sqrt(10)| and its decade-over-decade decay factor on both arms.',
  peak: {
    N_peak: +N_PEAK.toExponential(6), // ~9.218633e5
    sigma_max: +SIGMA_MAX.toFixed(9), // ~0.949429014
    A_curvature: +A_FIT.toExponential(6), // ~3.215955e-3 (imp-97833 primary)
    C_pred_amplitude: +C_PRED.toFixed(6), // 1/(2 sqrt(A)) ~ 8.816882
  },
  sqrt10: +SQRT10.toFixed(6), // 3.162278 (= 10^(-p), p = -1/2, the fold-order exponent)
  stencil_step_for_kernel: H_STENCIL,
  deep_gaps: DEEP_GAPS,
  upslope: UP,
  downslope: DOWN,
  finding: {
    D_sqrt10_derived_curvature_independent:
      'The per-decade growth is 10^(-p) with p = -1/2, and p = -1/2 is forced purely by the peak being a ' +
      'non-degenerate ORDER-2 maximum (gap g = A*dx^2 quadratic in dx), so the ratio (g/10)^(-1/2)/g^(-1/2) = ' +
      'sqrt(10) EXACTLY with the curvature A cancelling: sqrt(10) is the fold-order exponent, not a curvature ' +
      'value. The curvature MAGNITUDE enters ONLY the amplitude C = 1/(2 sqrt(A)): with A = ' +
      A_FIT.toExponential(4) + ' the closed form predicts C_pred = ' + C_PRED.toFixed(6) + ', and the measured ' +
      'C = |K|*sqrt(g) converges onto it from both arms (upslope from above, downslope from below), relative ' +
      'error at g = 1e-8 = ' + UP.amplitude_C_rel_err[2] + ' (up) / ' + DOWN.amplitude_C_rel_err[2] + ' (down) -- ' +
      'the curvature-to-amplitude link is quantitatively confirmed.',
    M_deep_window_convergence_rate:
      'In the deep window g = 1e-6 .. 1e-8, |ratio - sqrt(10)| runs ' +
      Math.abs(UP.ratio_deviation_from_sqrt10[0]).toExponential(2) + ' -> ' +
      Math.abs(UP.ratio_deviation_from_sqrt10[1]).toExponential(2) + ' (upslope, from below) / ' +
      Math.abs(DOWN.ratio_deviation_from_sqrt10[0]).toExponential(2) + ' -> ' +
      Math.abs(DOWN.ratio_deviation_from_sqrt10[1]).toExponential(2) + ' (downslope, from above), decaying by a ' +
      'factor ' + UP.deviation_decade_decay_factor[0] + ' (up) / ' + DOWN.deviation_decade_decay_factor[0] +
      ' (down) per decade (~1/sqrt(10) = 0.3162) -- the O(sqrt(g)) running correction (imp-97833 cubic-fold ' +
      'signature), opposite-signed on the two arms. The sqrt(10) asymptote is approached geometrically.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION + MEASUREMENT (frontier cross-check, NOT rigorous). The imp-97823/imp-124776 kernel per-decade ' +
    'growth sqrt(10) = 3.162278 is DERIVED from the near-peak fold sigma = sigma_max - A*dx^2 - ... : the kernel ' +
    'is |K| = 1/(2 sqrt(A)) * g^(-1/2), so the ratio |K|(g/10)/|K|(g) = 10^(1/2) = sqrt(10) EXACTLY with the ' +
    'curvature A cancelling -- sqrt(10) is the fold-ORDER exponent 10^(-p), p = -1/2 (any non-degenerate order-2 ' +
    'maximum at any A > 0 gives it), NOT a curvature magnitude. The curvature magnitude controls ONLY the ' +
    'amplitude C = 1/(2 sqrt(A)): with A = ' + A_FIT.toExponential(4) + ' the closed form predicts C_pred = ' +
    C_PRED.toFixed(6) + ', which the measured C = |K|*sqrt(g) brackets from the two arms and converges onto to ' +
    '< 2e-3 relative at g = 1e-8. Deep-window (g = 1e-6..1e-8) |ratio - sqrt(10)| decays by ~1/sqrt(10) per ' +
    'decade on both arms (upslope from below, downslope from above), the O(sqrt(g)) cubic-fold running ' +
    'correction: the sqrt(10) asymptote is approached geometrically, not saturated. Conditional-share diagnostic ' +
    'on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor ' +
    'are UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-97823 (|K| ~ sqrt(10) per decade measured, stated not derived); imp-124776 (per-decade ratio brackets ' +
    'sqrt(10) from both arms); imp-97833 (A = -sigma_2prime/2, B = -sigma_3prime/6 stencils; cubic-fold ' +
    'running correction); imp-97520 (L1 peak sigma_max ~ 0.949429, N_peak ~ 9.22e5); imp-97703 (5-point stencil); ' +
    'imp-398 (C_F flow prefactor); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN inverse).',
};

export const IMP124830_KERNEL_SQRT10_CURVATURE_DERIVATION_ASSERTIONS = [
  {
    // The peak matches the imp-97520/imp-97823/imp-97833 L1 interior maximum.
    id: 'imp124830-peak-matches-l1',
    description: 'the interior peak is at N_peak ~ 9.22e5 with sigma_max ~ 0.949429 (imp-97520 L1)',
    holds: () => Math.abs(N_PEAK - 9.218633e5) / 9.218633e5 < 1e-3 && Math.abs(SIGMA_MAX - 0.949429) < 1e-5,
  },
  {
    // (D) The curvature matches the imp-97833 primary A ~ 3.216e-3, so C_pred = 1/(2 sqrt(A)) ~ 8.817.
    id: 'imp124830-curvature-matches-imp97833',
    description: 'A = curvature -sigma_2prime(x_peak)/2 ~ 3.216e-3 (imp-97833) and C_pred = 1/(2 sqrt(A)) ~ 8.817',
    holds: () =>
      Math.abs(A_FIT - 3.2160e-3) / 3.2160e-3 < 1e-2 && Math.abs(C_PRED - 8.816882) < 1e-2,
  },
  {
    // (D) The measured kernel amplitude C = |K|*sqrt(g) converges onto C_pred = 1/(2 sqrt(A)) at g = 1e-8, both arms.
    id: 'imp124830-amplitude-closed-form-holds',
    description: 'measured C = |K|*sqrt(g) matches C_pred = 1/(2 sqrt(A)) to < 2e-3 relative at g = 1e-8 on both arms',
    holds: () =>
      Math.abs(UP.amplitude_C_rel_err[2]) < 2e-3 && Math.abs(DOWN.amplitude_C_rel_err[2]) < 2e-3,
  },
  {
    // (D) The amplitude error shrinks as g -> 0 (the closed form is the g -> 0 limit, not a coincidence at one gap).
    id: 'imp124830-amplitude-error-shrinks',
    description: 'the amplitude relative error |C_meas/C_pred - 1| shrinks from g = 1e-6 to g = 1e-8 on both arms',
    holds: () =>
      Math.abs(UP.amplitude_C_rel_err[2]) < Math.abs(UP.amplitude_C_rel_err[0]) &&
      Math.abs(DOWN.amplitude_C_rel_err[2]) < Math.abs(DOWN.amplitude_C_rel_err[0]),
  },
  {
    // (M) The two arms bracket sqrt(10) with opposite-signed deep deviations (the cubic-fold antisymmetry).
    id: 'imp124830-arms-bracket-sqrt10',
    description: 'the deep per-decade ratios bracket sqrt(10): upslope deviation < 0, downslope deviation > 0',
    holds: () =>
      UP.ratio_deviation_from_sqrt10.every((d) => d < 0) &&
      DOWN.ratio_deviation_from_sqrt10.every((d) => d > 0),
  },
  {
    // (M) The deep-window deviation from sqrt(10) decays by ~1/sqrt(10) per decade (the O(sqrt(g)) running correction).
    id: 'imp124830-deviation-decays-1-over-sqrt10',
    description: 'the |ratio - sqrt(10)| deviation decays by ~1/sqrt(10) = 0.3162 per decade on both arms',
    holds: () =>
      UP.deviation_decade_decay_factor.every((f) => Math.abs(f - 0.3162) < 0.05) &&
      DOWN.deviation_decade_decay_factor.every((f) => Math.abs(f - 0.3162) < 0.05),
  },
  {
    // (M) The deepest per-decade ratio is within ~1e-3 of sqrt(10) on both arms (the asymptote is genuinely reached).
    id: 'imp124830-deepest-ratio-near-sqrt10',
    description: 'the g = 1e-7 -> 1e-8 ratio is within 1.5e-3 of sqrt(10) on both arms',
    holds: () =>
      Math.abs(UP.per_decade_ratios[1] - SQRT10) < 1.5e-3 &&
      Math.abs(DOWN.per_decade_ratios[1] - SQRT10) < 1.5e-3,
  },
  {
    // Honesty gate: derivation/measurement only, no QED, no refereed bound is changed.
    id: 'imp124830-honesty-gate-no-qed',
    description: 'Derivation/measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP124830_KERNEL_SQRT10_CURVATURE_DERIVATION.isRigorous === false &&
      /NO QED/.test(IMP124830_KERNEL_SQRT10_CURVATURE_DERIVATION.verdict) &&
      /refereed bound is changed/i.test(IMP124830_KERNEL_SQRT10_CURVATURE_DERIVATION.verdict),
  },
];

for (const a of IMP124830_KERNEL_SQRT10_CURVATURE_DERIVATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124830-kernel-sqrt10-curvature-derivation assertion failed: ${a.id}`);
  }
}
