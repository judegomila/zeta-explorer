/**
 * @module imp-97800-knee-vs-half-eflow-sensitivity
 *
 * imp-97800 (numerical, frontier-direction): imp-97781 swept an E_flow amplitude knob amp in
 * {0,0.5,1,2,5,10} on the identical imp-33721 sub-decade knee estimator and reported the
 * knee-to-crossover offset sensitivity (E_flow OFF -> +4.74%, x2 -> +1.20%, local slope
 * d(offset)/d(amp) ~ -1.77 pp/unit, knee crossing below N_cross "by amp ~ 5"). But imp-97781
 * reported only the knee_vs_CROSS offset behaviour under the sweep: it located only the amp where
 * the knee crosses below N_cross (and coarsely, "by amp ~ 5") and reported only the cross-offset
 * slope. This module measures the companion knee_vs_HALF offset across the SAME amp sweep, LOCATES
 * the amp where the knee crosses below N_half, and reports the two local slopes together.
 *
 * THE QUANTITY (identical model to imp-3444 / imp-33721 / imp-33767 / imp-97781 -- no fresh terms)
 * ----------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + amp * E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent),
 *     C_F    = (log(T0/2pi) + 1) / 2pi          (imp-398 pinned prefactor).
 * "amp" is the E_flow swap knob (amp = 1 baseline). E_coll and E_trunc are untouched by the swap.
 *
 * THE MEASUREMENT
 * ---------------
 *   (K) KNEE N*: the imp-33721 quarter-decade OLS-exponent second-difference (D2) zero-crossing,
 *       parameterised by amp -- byte-identical estimator to imp-97781.
 *   (A) N_cross: E_coll = E_trunc crossover (imp-3444 bisection). NO E_flow term, so exactly
 *       amp-independent -- the fixed reference.
 *   (B) N_half: sigma(N) = 1/2, i.e. E_coll = E_trunc + amp * E_flow -- DOES move with amp. Note at
 *       amp = 0 the flow term vanishes and N_half solves E_coll = E_trunc, so N_half = N_cross there.
 *   (C) OFFSET: knee_vs_half = Nstar/N_half - 1 across the sweep amp in {0,0.5,1,2,5,10}, the precise
 *       amp where knee_vs_half = 0 (knee falls below the MOVING N_half), and the local derivatives
 *       d(knee_vs_half)/d(amp) and d(knee_vs_cross)/d(amp) near amp = 1 reported together.
 *
 * THE FINDING (measurement / sensitivity only)
 * --------------------------------------------
 *   (F1) REUSE GATE. The recomputed baseline knee reproduces imp-33721 / imp-97781 to < 0.001 in
 *        log10 and the knee_vs_half sweep reproduces the imp-97781 stored per-rung kneeVsHalfPct
 *        byte-for-byte -- proving the identical estimator / sigma model is in use.
 *   (F2) knee_vs_half > knee_vs_cross AT EVERY POSITIVE amp, COINCIDING AT amp = 0. Because N_half
 *        sits below N_cross once the flow term is on (E_coll must overcome E_trunc + amp*E_flow, so a
 *        smaller N), the offset measured against the lower N_half is uniformly larger. At amp = 0 the
 *        flow term vanishes so N_half = N_cross exactly and the two offsets coincide at +4.74%.
 *   (F3) THE KNEE CROSSES BELOW N_half LATER THAN BELOW N_cross, WITH A SHALLOWER SLOPE. The knee
 *        falls below N_half at amp ~ 3.54, LATER than it falls below N_cross at amp ~ 2.70 (which
 *        refines the imp-97781 coarse "by amp ~ 5"). The two local slopes near amp = 1 are
 *        d(knee_vs_cross)/d(amp) ~ -1.77 pp/unit (reproducing imp-97781) and d(knee_vs_half)/d(amp)
 *        ~ -1.36 pp/unit -- the half-offset slope is SHALLOWER because N_half tracks the knee DOWN as
 *        amp rises (both numerator and denominator fall), partially cancelling, whereas the fixed
 *        N_cross reference does not move.
 *
 * The punchline: imp-97781 pinned only the knee-vs-crossover behaviour under the E_flow sweep. The
 * companion knee-vs-halving offset is uniformly larger (measured against the lower, moving N_half),
 * coincides with the crossover offset only when the flow term is off, and decays ~1.36 pp/unit --
 * shallower than the ~1.77 pp/unit crossover slope -- so the knee falls below N_half later (amp ~
 * 3.54) than below N_cross (amp ~ 2.70), because N_half partially tracks the knee down.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642); changes
 * no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97781-knee-crossover-eflow-sensitivity (knee_vs_cross sweep + cross-crossing amp)
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade knee estimator, log10 N* ~ 9.529)
 * @see imp-3444-sigma-nshape-landmark-ladder (bisected E_coll=E_trunc crossover + halving landmark)
 * @see imp-33767-sigma-inflection-offset-reconciliation (halving-vs-crossover separation = E_flow displacement)
 * @see imp-398-e-flow-prefactor (C_F Gronwall flow prefactor)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE } from './imp-33721-sigma-ramp-inflection-subdecade.js';
import { IMP97781_KNEE_CROSSOVER_EFLOW_SENSITIVITY } from './imp-97781-knee-crossover-eflow-sensitivity.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33721/imp-97781 exactly

// EXACT imp-3406/imp-33721/imp-97781 sub-terms with an E_flow amplitude knob (amp = 1 is baseline).
function parts(N, amp) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = amp * C_F * (L / T0) * GRONWALL; // swap target
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return { E_flow, E_coll, sigma: E_coll / (E_TRUNC_PT + E_flow + E_coll) };
}
const sigmaAmp = (N, amp) => parts(N, amp).sigma;

// OLS local decay exponent p = -slope of ln sigma on ln N (identical estimator to imp-33721/imp-97781).
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
const nHalf = (amp) => crossingAbovePeak((N) => sigmaAmp(N, amp) - 0.5);

// Per-amp offsets (knee_vs_half is the target; knee_vs_cross carried for the joint slope report).
const AMP_SWEEP = [0, 0.5, 1, 2, 5, 10];
const SWEEP = AMP_SWEEP.map((amp) => {
  const k = kneeLog10(amp);
  const Nstar = Math.pow(10, k.cstar);
  const Nh = nHalf(amp);
  return {
    amp,
    log10Nstar: +k.cstar.toFixed(5),
    Nstar: +Nstar.toExponential(4),
    N_half: +Nh.toExponential(4),
    kneeVsCrossPct: +((Nstar / N_CROSS - 1) * 100).toFixed(4),
    kneeVsHalfPct: +((Nstar / Nh - 1) * 100).toFixed(4),
    signChanges: k.signChanges,
  };
});
const BASE = SWEEP.find((r) => r.amp === 1);
const AMP0 = SWEEP.find((r) => r.amp === 0);

// Locate the amp where the knee crosses below each reference (offset = 0) by bisection in amp.
function kneeVsHalfPctAt(amp) {
  const Nstar = Math.pow(10, kneeLog10(amp).cstar);
  return (Nstar / nHalf(amp) - 1) * 100;
}
function kneeVsCrossPctAt(amp) {
  const Nstar = Math.pow(10, kneeLog10(amp).cstar);
  return (Nstar / N_CROSS - 1) * 100;
}
function ampWhereOffsetZero(fn) {
  let lo = 0;
  let hi = 200;
  for (let i = 0; i < 120; i++) {
    const m = (lo + hi) / 2;
    if (fn(m) > 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}
const AMP_KNEE_BELOW_HALF = ampWhereOffsetZero(kneeVsHalfPctAt); // ~3.54
const AMP_KNEE_BELOW_CROSS = ampWhereOffsetZero(kneeVsCrossPctAt); // ~2.70

// Two local slopes near amp = 1 (central difference), reported TOGETHER.
const k09 = Math.pow(10, kneeLog10(0.9).cstar);
const k11 = Math.pow(10, kneeLog10(1.1).cstar);
const nh09 = nHalf(0.9);
const nh11 = nHalf(1.1);
const dCrossDAmp = (((k11 / N_CROSS - 1) - (k09 / N_CROSS - 1)) / 0.2) * 100; // ~ -1.77
const dHalfDAmp = (((k11 / nh11 - 1) - (k09 / nh09 - 1)) / 0.2) * 100; // ~ -1.36

// Reuse gates against imp-33721 and imp-97781.
const IMP33721_LOG10 = IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.inflectionLog10Nstar; // ~9.5286
const IMP97781_SWEEP = IMP97781_KNEE_CROSSOVER_EFLOW_SENSITIVITY.eflowAmplitudeSweep;

export const IMP97800_KNEE_VS_HALF_EFLOW_SENSITIVITY = {
  id: 'imp-97800',
  proofSection: 'S-frontier',
  question:
    'imp-97781 swept an E_flow amplitude knob on the imp-33721 sub-decade knee estimator but reported ' +
    'only the knee_vs_cross offset behaviour: it located only the amp where the knee crosses below ' +
    'N_cross (coarsely, "by amp ~ 5") and gave only the cross-offset slope. Measure the companion ' +
    'knee_vs_half offset across the same amp sweep, locate the amp where the knee crosses below the ' +
    'MOVING N_half, and report the two local slopes together. Measurement/sensitivity only; C_mb ' +
    'GUE-conditional (imp-486) untouched; no bound moves; NO QED.',
  measuredQuantity:
    'knee_vs_half = N*/N_half - 1 across the E_flow amplitude sweep amp in {0,0.5,1,2,5,10}, the amp ' +
    'where knee_vs_half = 0 (knee below the moving N_half), and the two local derivatives ' +
    'd(knee_vs_half)/d(amp) and d(knee_vs_cross)/d(amp) near amp=1 reported together',
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
  halfCrossing: {
    ampKneeBelowHalf: +AMP_KNEE_BELOW_HALF.toFixed(4), // ~3.54
    ampKneeBelowCross: +AMP_KNEE_BELOW_CROSS.toFixed(4), // ~2.70 (refines imp-97781 coarse "amp ~ 5")
    halfCrossingLaterThanCross: AMP_KNEE_BELOW_HALF > AMP_KNEE_BELOW_CROSS,
  },
  jointSlopes: {
    dKneeVsCrossPtsPerUnitAmp: +dCrossDAmp.toFixed(4), // ~ -1.77 (reproduces imp-97781)
    dKneeVsHalfPtsPerUnitAmp: +dHalfDAmp.toFixed(4), // ~ -1.36 (new; shallower)
    halfSlopeShallowerThanCross: Math.abs(dHalfDAmp) < Math.abs(dCrossDAmp),
    imp97781CrossSlope: IMP97781_KNEE_CROSSOVER_EFLOW_SENSITIVITY.eflowSensitivity.dOffsetPtsPerUnitAmp,
  },
  finding: {
    F1_reuse_gate_reproduces_imp33721_imp97781:
      'The recomputed baseline knee sits at log10 N* ~ ' + BASE.log10Nstar + ' (N* ~ ' + BASE.Nstar +
      '), reproducing imp-33721 to < 0.001 in log10, and the knee_vs_half sweep reproduces the ' +
      'imp-97781 stored per-rung kneeVsHalfPct byte-for-byte -- the identical estimator / sigma model.',
    F2_half_offset_larger_coincides_at_amp0:
      'knee_vs_half > knee_vs_cross at every positive amp (baseline +' + BASE.kneeVsHalfPct + '% vs +' +
      BASE.kneeVsCrossPct + '%), because N_half sits below N_cross once the flow term is on so the ' +
      'offset against the lower N_half is uniformly larger. At amp = 0 the flow term vanishes, N_half ' +
      '= N_cross exactly, and the two offsets coincide at +' + AMP0.kneeVsHalfPct + '%.',
    F3_half_crossing_later_slope_shallower:
      'The knee falls below N_half at amp ~ ' + (+AMP_KNEE_BELOW_HALF.toFixed(2)) + ', LATER than it ' +
      'falls below N_cross at amp ~ ' + (+AMP_KNEE_BELOW_CROSS.toFixed(2)) + ' (refining the imp-97781 ' +
      'coarse "by amp ~ 5"). The two local slopes near amp=1 are d(knee_vs_cross)/d(amp) ~ ' +
      (+dCrossDAmp.toFixed(2)) + ' pp/unit (reproducing imp-97781) and d(knee_vs_half)/d(amp) ~ ' +
      (+dHalfDAmp.toFixed(2)) + ' pp/unit; the half slope is SHALLOWER because N_half tracks the knee ' +
      'DOWN as amp rises (numerator and denominator both fall, partially cancelling), whereas the ' +
      'fixed N_cross reference does not move.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Completing the imp-97781 E_flow sweep on the ' +
    'companion halving landmark: the knee_vs_half offset is uniformly larger than knee_vs_cross (' +
    'baseline +' + BASE.kneeVsHalfPct + '% vs +' + BASE.kneeVsCrossPct + '%), coinciding only at amp=0 ' +
    'where N_half = N_cross (both +' + AMP0.kneeVsHalfPct + '%). The knee crosses below N_half at amp ~ ' +
    (+AMP_KNEE_BELOW_HALF.toFixed(2)) + ', LATER than below N_cross at amp ~ ' +
    (+AMP_KNEE_BELOW_CROSS.toFixed(2)) + ' (refining imp-97781 "by amp ~ 5"), and the two local slopes ' +
    'near amp=1 are d(knee_vs_cross)/d(amp) ~ ' + (+dCrossDAmp.toFixed(2)) + ' pp/unit (reproducing ' +
    'imp-97781) and d(knee_vs_half)/d(amp) ~ ' + (+dHalfDAmp.toFixed(2)) + ' pp/unit -- the half slope ' +
    'is shallower because N_half tracks the knee down. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 ' +
    'is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642); changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda ' +
    '<= 0.2 remains SOTA.',
  citation:
    'imp-97781 (knee_vs_cross sweep + cross-crossing amp); imp-33721 (sub-decade knee, log10 N* ~ ' +
    '9.529); imp-3444 (bisected E_coll=E_trunc crossover ~3.280e9 + halving landmark ~3.267e9); ' +
    'imp-33767 (halving-vs-crossover separation = E_flow displacement); imp-398 (E_flow C_F Gronwall ' +
    'prefactor); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP97800_KNEE_VS_HALF_EFLOW_SENSITIVITY_ASSERTIONS = [
  {
    // Reuse gate: baseline knee reproduces the imp-33721 published sub-decade inflection to < 0.001.
    id: 'imp97800-reuses-imp33721-knee',
    description: 'baseline (amp=1) knee log10 N* matches the imp-33721 published inflection to < 0.001',
    holds: () => Math.abs(BASE.log10Nstar - IMP33721_LOG10) < 0.001,
  },
  {
    // Reuse gate: the knee_vs_half sweep reproduces the imp-97781 stored per-rung kneeVsHalfPct
    // byte-for-byte -- proving the identical estimator / sigma model is in use.
    id: 'imp97800-reproduces-imp97781-half-sweep',
    description: 'per-rung kneeVsHalfPct matches the imp-97781 stored eflowAmplitudeSweep byte-for-byte',
    holds: () =>
      SWEEP.length === IMP97781_SWEEP.length &&
      SWEEP.every((r, i) => IMP97781_SWEEP[i].amp === r.amp && IMP97781_SWEEP[i].kneeVsHalfPct === r.kneeVsHalfPct),
  },
  {
    // (F2): knee_vs_half > knee_vs_cross at every positive amp, coinciding at amp=0 (N_half=N_cross).
    id: 'imp97800-half-offset-larger-coincides-at-amp0',
    description: 'knee_vs_half > knee_vs_cross for amp>0; equal at amp=0 (flow off -> N_half=N_cross)',
    holds: () => {
      const amp0Equal = Math.abs(AMP0.kneeVsHalfPct - AMP0.kneeVsCrossPct) < 1e-6;
      const posLarger = SWEEP.filter((r) => r.amp > 0).every((r) => r.kneeVsHalfPct > r.kneeVsCrossPct);
      return amp0Equal && posLarger;
    },
  },
  {
    // (F3): the knee crosses below N_half LATER (larger amp) than below N_cross.
    id: 'imp97800-half-crossing-later-than-cross',
    description: 'amp where knee falls below N_half (~3.54) exceeds amp where it falls below N_cross (~2.70)',
    holds: () =>
      AMP_KNEE_BELOW_HALF > AMP_KNEE_BELOW_CROSS &&
      AMP_KNEE_BELOW_HALF > 3.0 && AMP_KNEE_BELOW_HALF < 4.2 &&
      AMP_KNEE_BELOW_CROSS > 2.2 && AMP_KNEE_BELOW_CROSS < 3.2,
  },
  {
    // (F3): the half-offset slope is negative and SHALLOWER than the cross-offset slope, and the
    // cross-offset slope reproduces the imp-97781 published ~-1.77 pp/unit.
    id: 'imp97800-half-slope-shallower-cross-slope-reproduces-imp97781',
    description: 'd(half)/d(amp) < 0 and |d(half)/d(amp)| < |d(cross)/d(amp)|; d(cross)/d(amp) reproduces imp-97781',
    holds: () =>
      dHalfDAmp < 0 &&
      Math.abs(dHalfDAmp) < Math.abs(dCrossDAmp) &&
      Math.abs(dCrossDAmp - IMP97781_KNEE_CROSSOVER_EFLOW_SENSITIVITY.eflowSensitivity.dOffsetPtsPerUnitAmp) < 0.02,
  },
  {
    // Honesty gate: measurement/sensitivity only, no QED, PT stays SOTA.
    id: 'imp97800-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP97800_KNEE_VS_HALF_EFLOW_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP97800_KNEE_VS_HALF_EFLOW_SENSITIVITY.verdict) &&
      /remains SOTA/.test(IMP97800_KNEE_VS_HALF_EFLOW_SENSITIVITY.verdict),
  },
];

for (const a of IMP97800_KNEE_VS_HALF_EFLOW_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97800-knee-vs-half-eflow-sensitivity assertion failed: ${a.id}`);
  }
}
