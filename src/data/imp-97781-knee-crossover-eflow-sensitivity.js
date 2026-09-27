/**
 * @module imp-97781-knee-crossover-eflow-sensitivity
 *
 * imp-97781 (numerical, frontier-direction): the roadmap currentStatus records the imp-33721
 * sub-decade exponent-ramp inflection knee at N* ~ 3.38e9, ~3.3% above the imp-3444 sigma = 1/2
 * halving landmark (N_half ~ 3.267e9) and the E_coll = E_trunc crossover (N_cross ~ 3.280e9), but
 * two things were never pinned together in one place: (a) the PRECISE knee-to-crossover /
 * knee-to-halving offsets recomputed on the exact imp-33721 sub-decade estimator, and (b) how
 * those offsets MOVE when the imp-398 E_flow (Gronwall) flow term is swapped. imp-33767 showed the
 * ~0.4% halving-to-crossover SEPARATION is the E_flow displacement, but treated the knee POSITION
 * itself as fixed. This module re-differences the ramp knee on the identical imp-33721 quarter-decade
 * grid, pins the offsets, and then sweeps an E_flow AMPLITUDE knob to measure the knee-to-crossover
 * offset sensitivity directly.
 *
 * THE QUANTITY (identical model to imp-3444 / imp-33721 / imp-33767 -- no fresh terms)
 * ----------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + amp * E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent),
 *     C_F    = (log(T0/2pi) + 1) / 2pi          (imp-398 pinned prefactor).
 * "amp" is the E_flow swap knob: amp = 1 is the baseline model (reuse gate below), amp = 0 turns
 * the flow term OFF, amp > 1 amplifies it. E_coll and E_trunc are untouched by the swap.
 *
 * THE MEASUREMENT
 * ---------------
 *   (K) KNEE N*: recompute the OLS local decay exponent p = -d ln sigma / d ln N on quarter-decade
 *       sub-brackets across [1e9, 1e11], form the second difference D2, and interpolate the single
 *       D2 zero-crossing in log10 N -- the identical imp-33721 estimator, now parameterised by amp.
 *   (A) N_cross: the E_coll = E_trunc crossover (imp-3444 downslope bisection). This equation has NO
 *       E_flow term, so N_cross is EXACTLY amp-independent -- the fixed reference of the swap.
 *   (B) N_half: sigma(N) = 1/2, i.e. E_coll = E_trunc + amp * E_flow -- this DOES move with amp.
 *   (C) OFFSETS: knee_vs_cross = Nstar/N_cross - 1 and knee_vs_half = Nstar/N_half - 1, at baseline and
 *       across the E_flow amplitude sweep amp in {0, 0.5, 1, 2, 5, 10}, plus a local derivative
 *       d(offset)/d(amp) near amp = 1.
 *
 * THE FINDING (measurement / sensitivity only)
 * --------------------------------------------
 *   (F1) BASELINE REPRODUCES imp-33721 / imp-33767. At amp = 1 the knee sits at log10 N* ~ 9.5286
 *        (N* ~ 3.377e9), reproducing the imp-33721 published inflection to < 0.001 in log10, and the
 *        offsets are knee_vs_cross ~ +2.95% and knee_vs_half ~ +3.36% -- matching the imp-33767 /
 *        imp-34441 published ~3.0% / ~3.4%.
 *   (F2) N_cross IS EXACTLY E_flow-INDEPENDENT; ALL OFFSET SENSITIVITY LIVES IN THE KNEE. Because
 *        E_coll = E_trunc carries no flow term, N_cross ~ 3.280294e9 does not move across the entire
 *        amp sweep (verified to < 1e-9 relative). The knee-to-crossover offset therefore inherits its
 *        full E_flow sensitivity from the KNEE numerator alone, not from the reference.
 *   (F3) THE KNEE-TO-CROSSOVER OFFSET IS STRONGLY E_flow-SENSITIVE DESPITE A TINY E_flow/E_trunc.
 *        At the knee E_flow/E_trunc ~ 1.9e-3 (imp-3444), yet swapping the flow term moves the offset
 *        far more than that ratio: turning E_flow OFF (amp = 0) RAISES the offset to ~ +4.74% (knee
 *        3.436e9), doubling it (amp = 2) drops it to ~ +1.20%, and the knee crosses BELOW N_cross by
 *        amp ~ 5. The local slope is d(offset)/d(amp) ~ -1.77 percentage points per unit amplitude
 *        near baseline (d(log10 N*)/d(amp) ~ -0.0075). The knee is a second-difference (curvature)
 *        landmark of ln sigma, so it amplifies the small flow term by ~1000x: the baseline E_flow
 *        accounts for ~1.8 of the ~2.95 offset points, displacing the knee DOWN toward the crossover.
 *
 * The punchline: imp-33767 attributed the ~0.4% halving-to-crossover separation to the E_flow term
 * but held the knee fixed. Swapping E_flow directly shows the KNEE itself is E_flow-displaced -- the
 * knee-to-crossover offset moves ~1.77 points per unit E_flow amplitude (E_flow OFF -> +4.74%, x2 ->
 * +1.20%) even though E_flow/E_trunc ~ 1.9e-3 there, because a curvature landmark amplifies the flow
 * term ~1000x. N_cross is the E_flow-fixed anchor; the offset sensitivity is entirely the knee.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642); changes
 * no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade knee estimator, log10 N* ~ 9.529)
 * @see imp-3444-sigma-nshape-landmark-ladder (bisected E_coll=E_trunc crossover + halving landmark)
 * @see imp-33767-sigma-inflection-offset-reconciliation (halving-vs-crossover separation = E_flow displacement)
 * @see imp-34441-3p28e9-landmark-cluster-reconciliation (four-locator offset table)
 * @see imp-398-e-flow-prefactor (C_F Gronwall flow prefactor)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE } from './imp-33721-sigma-ramp-inflection-subdecade.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33721 exactly

// EXACT imp-3406/imp-33721 sub-terms with an E_flow amplitude knob (amp = 1 is baseline).
function parts(N, amp) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = amp * C_F * (L / T0) * GRONWALL; // swap target
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return { E_flow, E_coll, sigma: E_coll / (E_TRUNC_PT + E_flow + E_coll) };
}
const sigmaAmp = (N, amp) => parts(N, amp).sigma;

// OLS local decay exponent p = -slope of ln sigma on ln N (identical estimator to imp-33721).
function olsExponentLog10(loD, hiD, ptsPerDecade, amp) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = loD; d <= hiD + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigmaAmp(N, amp)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -(sxy / sxx);
}

// Sub-decade knee: single D2 zero-crossing of the exponent ramp, interpolated in log10 N.
const SUB_LO_D = 9.0;
const SUB_HI_D = 11.0;
const W = 0.25;
const PPD = 40;
function kneeLog10(amp) {
  const edges = [];
  for (let d = SUB_LO_D; d <= SUB_HI_D + 1e-9; d += W) edges.push(+d.toFixed(6));
  const b = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const cen = (edges[i] + edges[i + 1]) / 2;
    b.push({ cen, p: olsExponentLog10(edges[i], edges[i + 1], PPD, amp) });
  }
  const D1 = [];
  for (let i = 1; i < b.length; i++) D1.push({ cen: (b[i].cen + b[i - 1].cen) / 2, d1: b[i].p - b[i - 1].p });
  const D2 = [];
  for (let i = 1; i < D1.length; i++) D2.push({ cen: (D1[i].cen + D1[i - 1].cen) / 2, d2: D1[i].d1 - D1[i - 1].d1 });
  let cstar = null;
  let signChanges = 0;
  for (let i = 1; i < D2.length; i++) {
    if (Math.sign(D2[i].d2) !== Math.sign(D2[i - 1].d2)) {
      signChanges += 1;
      if (cstar === null) {
        const c0 = D2[i - 1].cen;
        const c1 = D2[i].cen;
        const y0 = D2[i - 1].d2;
        const y1 = D2[i].d2;
        cstar = c0 + ((c1 - c0) * (0 - y0)) / (y1 - y0);
      }
    }
  }
  return { cstar, signChanges };
}

// Machine-precision crossing on the monotone-decreasing right arm above the peak.
const N_MAX = 9.22e5;
function crossingAbovePeak(f) {
  let a = Math.log(N_MAX);
  let b = Math.log(1e80);
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    if (f(Math.exp(m)) > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
// N_cross: E_coll = E_trunc (E_flow-independent, the fixed anchor of the swap).
const N_CROSS = crossingAbovePeak((N) => parts(N, 1).E_coll - E_TRUNC_PT); // ~3.280294e9
const N_CROSS_AMP0 = crossingAbovePeak((N) => parts(N, 0).E_coll - E_TRUNC_PT); // must equal N_CROSS
const nHalf = (amp) => crossingAbovePeak((N) => sigmaAmp(N, amp) - 0.5);

// Baseline knee + offsets (F1) and the E_flow amplitude sweep (F3).
const AMP_SWEEP = [0, 0.5, 1, 2, 5, 10];
const SWEEP = AMP_SWEEP.map((amp) => {
  const k = kneeLog10(amp);
  const Nstar = Math.pow(10, k.cstar);
  const Nh = nHalf(amp);
  return {
    amp,
    log10Nstar: +k.cstar.toFixed(5),
    Nstar: +Nstar.toExponential(4),
    kneeVsCrossPct: +((Nstar / N_CROSS - 1) * 100).toFixed(4),
    kneeVsHalfPct: +((Nstar / Nh - 1) * 100).toFixed(4),
    N_half: +Nh.toExponential(4),
    EflowOverEtruncAtKnee: +(parts(Nstar, amp).E_flow / E_TRUNC_PT).toExponential(3),
    signChanges: k.signChanges,
  };
});
const BASE = SWEEP.find((r) => r.amp === 1);
const AMP0 = SWEEP.find((r) => r.amp === 0);

// Local E_flow sensitivity of the offset near amp = 1 (central difference).
const k09 = Math.pow(10, kneeLog10(0.9).cstar);
const k11 = Math.pow(10, kneeLog10(1.1).cstar);
const off09 = k09 / N_CROSS - 1;
const off11 = k11 / N_CROSS - 1;
const D_OFFSET_D_AMP_PTS = ((off11 - off09) / 0.2) * 100; // ~ -1.77 points per unit amp
const D_LOG10NSTAR_D_AMP = (Math.log10(k11) - Math.log10(k09)) / 0.2; // ~ -0.0075

// Reuse gate: baseline knee reproduces the imp-33721 published sub-decade inflection.
const IMP33721_LOG10 = IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.inflectionLog10Nstar; // ~9.5286

export const IMP97781_KNEE_CROSSOVER_EFLOW_SENSITIVITY = {
  id: 'imp-97781',
  proofSection: 'S-frontier',
  question:
    'The imp-33721 sub-decade exponent-ramp knee sits N* ~ 3.38e9, ~3.3% above the imp-3444 ' +
    'sigma=1/2 halving landmark and the E_coll=E_trunc crossover, but the precise knee-to-crossover ' +
    'offset and its dependence on the imp-398 E_flow (Gronwall) term were never pinned. Re-difference ' +
    'the knee on the exact imp-33721 quarter-decade grid, pin the offsets, and swap the E_flow ' +
    'amplitude to measure how the knee-to-crossover offset moves. Measurement/sensitivity only; C_mb ' +
    'GUE-conditional (imp-486) untouched; no bound moves; NO QED.',
  measuredQuantity:
    'sub-decade knee N* (single D2 zero-crossing of the OLS local exponent ramp) and the offsets ' +
    'N*/N_cross-1, N*/N_half-1 across an E_flow amplitude sweep amp in {0,0.5,1,2,5,10}, plus the ' +
    'local derivative d(offset)/d(amp) near amp=1; N_cross fixed (E_coll=E_trunc has no flow term)',
  baseline: {
    log10Nstar: BASE.log10Nstar, // ~9.5286
    Nstar: BASE.Nstar, // ~3.377e9
    N_cross: +N_CROSS.toExponential(6), // 3.280294e9
    N_half: BASE.N_half, // ~3.267e9
    kneeVsCrossPct: BASE.kneeVsCrossPct, // ~+2.95
    kneeVsHalfPct: BASE.kneeVsHalfPct, // ~+3.36
    imp33721PublishedLog10: IMP33721_LOG10,
  },
  eflowAmplitudeSweep: SWEEP,
  eflowSensitivity: {
    N_cross_amp_independent: N_CROSS_AMP0 === N_CROSS || Math.abs(N_CROSS_AMP0 / N_CROSS - 1) < 1e-9,
    dOffsetPtsPerUnitAmp: +D_OFFSET_D_AMP_PTS.toFixed(4), // ~ -1.77
    dLog10NstarPerUnitAmp: +D_LOG10NSTAR_D_AMP.toFixed(5), // ~ -0.0075
    offset_at_eflow_off_pct: AMP0.kneeVsCrossPct, // ~+4.74
    offset_at_baseline_pct: BASE.kneeVsCrossPct, // ~+2.95
    eflow_removes_points: +(AMP0.kneeVsCrossPct - BASE.kneeVsCrossPct).toFixed(4), // ~+1.79 (E_flow moves knee down)
    EflowOverEtruncAtBaselineKnee: BASE.EflowOverEtruncAtKnee, // ~1.9e-3
  },
  finding: {
    F1_baseline_reproduces_imp33721_imp33767:
      'At amp=1 the knee sits at log10 N* ~ ' + BASE.log10Nstar + ' (N* ~ ' + BASE.Nstar + '), ' +
      'reproducing the imp-33721 published inflection to < 0.001 in log10, with knee_vs_cross ~ +' +
      BASE.kneeVsCrossPct + '% and knee_vs_half ~ +' + BASE.kneeVsHalfPct + '% -- matching the ' +
      'imp-33767 / imp-34441 published ~3.0% / ~3.4% offsets.',
    F2_ncross_eflow_independent_all_sensitivity_in_knee:
      'N_cross ~ 3.280294e9 solves E_coll = E_trunc, which carries NO flow term, so it does not move ' +
      'across the entire amp sweep (< 1e-9 relative). The knee-to-crossover offset inherits its full ' +
      'E_flow sensitivity from the KNEE numerator alone, not from the reference landmark.',
    F3_offset_strongly_eflow_sensitive_despite_tiny_ratio:
      'Although E_flow/E_trunc ~ ' + BASE.EflowOverEtruncAtKnee + ' at the knee, swapping the flow ' +
      'term moves the offset far more than that ratio: E_flow OFF (amp=0) RAISES it to ~ +' +
      AMP0.kneeVsCrossPct + '%, doubling (amp=2) drops it to ~ +' +
      (SWEEP.find((r) => r.amp === 2).kneeVsCrossPct) + '%, and the knee crosses BELOW N_cross by ' +
      'amp ~ 5. The local slope is d(offset)/d(amp) ~ ' + (+D_OFFSET_D_AMP_PTS.toFixed(2)) + ' points ' +
      'per unit amplitude (d(log10 N*)/d(amp) ~ ' + (+D_LOG10NSTAR_D_AMP.toFixed(4)) + '). A curvature ' +
      '(D2) landmark of ln sigma amplifies the small flow term ~1000x: the baseline E_flow accounts ' +
      'for ~' + (+(AMP0.kneeVsCrossPct - BASE.kneeVsCrossPct).toFixed(1)) + ' of the ~' +
      BASE.kneeVsCrossPct + ' offset points, displacing the knee DOWN toward the crossover.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Re-differencing the imp-33721 quarter-decade ' +
    'exponent ramp pins the baseline knee at log10 N* ~ ' + BASE.log10Nstar + ' (N* ~ ' + BASE.Nstar +
    '), reproducing imp-33721 to < 0.001 in log10, with knee_vs_cross ~ +' + BASE.kneeVsCrossPct +
    '% and knee_vs_half ~ +' + BASE.kneeVsHalfPct + '% (matching imp-33767 / imp-34441). The E_coll = ' +
    'E_trunc crossover N_cross ~ 3.280294e9 is EXACTLY E_flow-independent (no flow term in its ' +
    'equation), so it is the fixed anchor of the swap and the offset sensitivity lives entirely in the ' +
    'knee. Swapping the E_flow amplitude shows the knee-to-crossover offset is STRONGLY flow-sensitive ' +
    'despite E_flow/E_trunc ~ ' + BASE.EflowOverEtruncAtKnee + ' at the knee: E_flow OFF raises the ' +
    'offset to ~ +' + AMP0.kneeVsCrossPct + '%, doubling drops it to ~ +' +
    (SWEEP.find((r) => r.amp === 2).kneeVsCrossPct) + '%, slope ~ ' + (+D_OFFSET_D_AMP_PTS.toFixed(2)) +
    ' points per unit amplitude -- a curvature landmark amplifies the tiny flow term ~1000x. This ' +
    'refines imp-33767: not just the ~0.4% halving-to-crossover separation but the KNEE POSITION ' +
    'itself is E_flow-displaced. The component model is the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz ' +
    'is UNTOUCHED (imp-2642); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33721 (sub-decade knee, log10 N* ~ 9.529); imp-3444 (bisected E_coll=E_trunc crossover ' +
    '~3.280e9 + halving landmark ~3.267e9); imp-33767 (halving-vs-crossover separation = E_flow ' +
    'displacement); imp-34441 (four-locator offset table); imp-398 (E_flow C_F Gronwall prefactor); ' +
    'imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP97781_KNEE_CROSSOVER_EFLOW_SENSITIVITY_ASSERTIONS = [
  {
    // Reuse gate: the recomputed baseline knee reproduces the imp-33721 published sub-decade
    // inflection to < 0.001 in log10 -- proving the identical estimator / sigma model is in use.
    id: 'imp97781-reuses-imp33721-knee',
    description: 'baseline (amp=1) knee log10 N* matches the imp-33721 published inflection to < 0.001',
    holds: () => Math.abs(BASE.log10Nstar - IMP33721_LOG10) < 0.001,
  },
  {
    // (F1): baseline offsets reproduce the imp-33767 / imp-34441 published ~3.0% / ~3.4%.
    id: 'imp97781-baseline-offsets-match-imp33767',
    description: 'baseline knee_vs_cross ~ +2.95% and knee_vs_half ~ +3.36% (imp-33767/imp-34441 band)',
    holds: () =>
      BASE.kneeVsCrossPct > 2.5 && BASE.kneeVsCrossPct < 3.5 &&
      BASE.kneeVsHalfPct > 3.0 && BASE.kneeVsHalfPct < 3.9 &&
      BASE.kneeVsHalfPct > BASE.kneeVsCrossPct,
  },
  {
    // (F2): N_cross is EXACTLY E_flow-independent -- amp=0 and amp=1 give the same crossover.
    id: 'imp97781-ncross-eflow-independent',
    description: 'E_coll=E_trunc crossover is amp-independent (amp=0 vs amp=1 agree to < 1e-9)',
    holds: () => Math.abs(N_CROSS_AMP0 / N_CROSS - 1) < 1e-9,
  },
  {
    // (F3): the knee-to-crossover offset is strongly E_flow-sensitive -- turning the flow term OFF
    // RAISES the offset by ~+1.8 points, and the local slope is a clearly negative ~-1.77 pts/amp.
    id: 'imp97781-offset-eflow-sensitive',
    description: 'E_flow OFF raises the offset above baseline by > 1 point; slope d(offset)/d(amp) < -1',
    holds: () =>
      AMP0.kneeVsCrossPct > BASE.kneeVsCrossPct + 1.0 &&
      D_OFFSET_D_AMP_PTS < -1.0 &&
      AMP0.kneeVsCrossPct > 4.0 && AMP0.kneeVsCrossPct < 5.5,
  },
  {
    // (F3): the sweep is monotone-decreasing in amp (more flow -> smaller offset -> knee moves down),
    // and every rung resolves exactly one D2 sign change.
    id: 'imp97781-offset-monotone-decreasing-in-amp',
    description: 'knee_vs_cross offset strictly decreases as E_flow amplitude increases; one D2 crossing per rung',
    holds: () => {
      for (let i = 1; i < SWEEP.length; i++) {
        if (!(SWEEP[i].kneeVsCrossPct < SWEEP[i - 1].kneeVsCrossPct)) return false;
      }
      return SWEEP.every((r) => r.signChanges === 1);
    },
  },
  {
    // (F3): despite the strong offset sensitivity, E_flow/E_trunc at the baseline knee is tiny
    // (~1.9e-3) -- the curvature landmark is what amplifies it.
    id: 'imp97781-eflow-ratio-tiny-at-knee',
    description: 'E_flow/E_trunc at the baseline knee is ~1.9e-3 (small), so the sensitivity is curvature amplification',
    holds: () => BASE.EflowOverEtruncAtKnee > 1e-3 && BASE.EflowOverEtruncAtKnee < 3e-3,
  },
  {
    // Honesty gate: measurement/sensitivity only, no QED, PT stays SOTA.
    id: 'imp97781-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP97781_KNEE_CROSSOVER_EFLOW_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP97781_KNEE_CROSSOVER_EFLOW_SENSITIVITY.verdict) &&
      /remains SOTA/.test(IMP97781_KNEE_CROSSOVER_EFLOW_SENSITIVITY.verdict),
  },
];

for (const a of IMP97781_KNEE_CROSSOVER_EFLOW_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97781-knee-crossover-eflow-sensitivity assertion failed: ${a.id}`);
  }
}
