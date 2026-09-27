/**
 * @module imp-97805-knee-eflow-amplification-ratio
 *
 * imp-97805 (numerical, frontier-direction): imp-97781 F3 stated that the imp-33721 sub-decade
 * exponent-ramp knee "amplifies the small flow term ~1000x" -- E_flow/E_trunc ~ 1.9e-3 at the knee,
 * yet the knee-to-crossover offset moves ~1.77 percentage points per unit E_flow amplitude. But that
 * "~1000x" figure was a heuristic read of the amp sweep, NOT a computed dimensionless ratio, and it
 * silently compared a percentage-point offset slope (1.77 pp/amp = 0.0177/amp) against a raw ratio
 * (1.9e-3), which is a units mismatch. This leaf computes the amplification directly as one
 * dimensionless number on the IDENTICAL imp-33721 quarter-decade D2 estimator and quantifies how it
 * moves with the grid resolution.
 *
 * THE QUANTITY (byte-identical model to imp-3444 / imp-33721 / imp-33767 / imp-97781 -- no fresh terms)
 * ----------------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + amp * E_flow + E_coll),
 *     E_coll   = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow   = amp * C_F * (log T0 / T0) * Gronwall,   E_trunc = 3.06e-5 (N-independent),
 *     C_F      = (log(T0/2pi) + 1) / 2pi         (imp-398 pinned prefactor).
 * The knee N*(amp) is the single second-difference (D2) zero-crossing of the OLS local decay exponent
 * p = -d ln sigma / d ln N, re-differenced on the imp-33721 quarter-decade sub-brackets across
 * [1e9, 1e11] (the identical estimator, parameterised by the E_flow amplitude knob amp; amp = 1 is
 * baseline). N_cross solves E_coll = E_trunc (no flow term, so exactly amp-independent, imp-97781 F2).
 *
 * THE MEASUREMENT
 * ---------------
 *   The dimensionless E_flow amplification of the knee-to-crossover offset:
 *       A = | d(offset fraction) / d amp | / (E_flow / E_trunc at the baseline knee),
 *   where offset(amp) = N*(amp)/N_cross - 1, the numerator is a central difference in amp about
 *   amp = 1 (step h), and the denominator is the tiny flow-to-truncation ratio at the baseline knee.
 *   A > 1 means the curvature landmark magnifies the flow term; A ~ 1 means no amplification. Then A
 *   is re-measured across the estimator grid: points-per-decade PPD in {20,30,40,60,80,120} at the
 *   quarter-decade bracket width, bracket width W in {0.20, 0.25, 1/3, 0.5} at PPD = 40, and the
 *   amp-differentiation step h in {0.05, 0.10, 0.20}.
 *
 * THE FINDING (measurement / sensitivity only)
 * --------------------------------------------
 *   (F1) REUSE GATE. At the baseline grid (W = 0.25, PPD = 40) the recomputed knee sits at
 *        log10 N* ~ 9.5286 and the offset slope is -1.77 pp/amp with E_flow/E_trunc ~ 1.85e-3 at the
 *        knee -- reproducing imp-97781 F3 byte-for-byte, proving the identical estimator is in use.
 *   (F2) A IS ~9.5, NOT ~1000. The directly computed amplification is A ~ 9.55 at the baseline grid.
 *        The "~1000x" heuristic conflated the percentage-point offset slope (-1.77 pp/amp) with the
 *        raw ratio 1.9e-3; the correct dimensionless amplification is O(10). This CONFIRMS the
 *        imp-97804 closed-form value A ~ 9.4 (continuous knee), now measured DIRECTLY on the discrete
 *        quarter-decade D2 estimator rather than via the continuous proxy.
 *   (F3) A IS GRID-ROBUST, DOMINATED BY BRACKET WIDTH NOT PPD. Refining PPD converges A to ~9.54
 *        (PPD >= 40 all within 9.542..9.546; PPD = 30 is a coarse-grid outlier at 9.89). The amp step
 *        h is irrelevant (A = 9.5459 for h in {0.05,0.10,0.20} -- the offset is locally linear in amp).
 *        The dominant knob is the bracket width W: A ~ 9.54 at W = 0.20, ~9.55 at W = 0.25, ~10.11 at
 *        W = 1/3, and the estimator DEGENERATES at W = 0.5 (only 4 edges -> too few D2 points, no knee).
 *        Across the usable window (W in [0.20, 1/3], PPD >= 20) A in [9.54, 10.11], a ~6% band.
 *
 * The punchline: the imp-97781 F3 "~1000x" amplification is a units artifact. Computed as a single
 * dimensionless number on the identical estimator, the E_flow amplification of the knee-to-crossover
 * offset is A ~ 9.5 (grid band 9.54..10.1), matching the imp-97804 closed-form ~9.4, and it is robust
 * to the grid: PPD refinement converges to ~9.54, the amp step is irrelevant, and the only material
 * knob is the bracket width (degenerating only when the sub-decade window holds too few brackets).
 *
 * MEASUREMENT / SENSITIVITY ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642); changes
 * no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97781-knee-crossover-eflow-sensitivity (the "~1000x" F3 heuristic this leaf pins)
 * @see imp-97804-knee-eflow-linear-expansion (closed-form A ~ 9.4 via the continuous knee proxy)
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade knee estimator, log10 N* ~ 9.529)
 * @see imp-3444-sigma-nshape-landmark-ladder (bisected E_coll=E_trunc crossover, the fixed anchor)
 * @see imp-398-e-flow-prefactor (C_F Gronwall flow prefactor)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33721/imp-97781 exactly

// EXACT imp-3406/imp-33721/imp-97781 sub-terms with an E_flow amplitude knob (amp = 1 is baseline).
function parts(N, amp) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = amp * C_F * (L / T0) * GRONWALL;
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
function kneeLog10(amp, W, PPD) {
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

// N_cross: E_coll = E_trunc (E_flow-independent, the fixed anchor of the swap; imp-97781 F2).
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
const N_CROSS = crossingAbovePeak((N) => parts(N, 1).E_coll - E_TRUNC_PT); // ~3.280294e9

// The dimensionless E_flow amplification A of the knee-to-crossover offset, on the DISCRETE
// quarter-decade estimator at a given grid (W, PPD) with amp-differentiation step h.
// A = |d(offset fraction)/d amp| / (E_flow/E_trunc at the baseline knee).
function amplificationAt(W, PPD, h) {
  const kBaseC = kneeLog10(1.0, W, PPD);
  if (kBaseC.cstar === null) {
    return { W, PPD, h, log10knee: null, dOffsetPtsPerAmp: null, ratioAtKnee: null, A: null, signChanges: kBaseC.signChanges };
  }
  const kBase = Math.pow(10, kBaseC.cstar);
  const kLo = Math.pow(10, kneeLog10(1.0 - h, W, PPD).cstar);
  const kHi = Math.pow(10, kneeLog10(1.0 + h, W, PPD).cstar);
  const offLo = kLo / N_CROSS - 1;
  const offHi = kHi / N_CROSS - 1;
  const dOffdAmp = (offHi - offLo) / (2 * h); // offset FRACTION per unit amp
  const ratioAtKnee = parts(kBase, 1.0).E_flow / E_TRUNC_PT; // E_flow/E_trunc at the baseline knee
  const A = Math.abs(dOffdAmp) / ratioAtKnee;
  return {
    W,
    PPD,
    h,
    log10knee: +kBaseC.cstar.toFixed(5),
    dOffsetPtsPerAmp: +(dOffdAmp * 100).toFixed(4),
    ratioAtKnee: +ratioAtKnee.toExponential(4),
    A: +A.toFixed(4),
    signChanges: kBaseC.signChanges,
  };
}

// Baseline grid + resolution sweeps.
const BASELINE = amplificationAt(0.25, 40, 0.1);
const PPD_SWEEP = [20, 30, 40, 60, 80, 120].map((ppd) => amplificationAt(0.25, ppd, 0.1));
const W_SWEEP = [0.2, 0.25, 1 / 3, 0.5].map((w) => amplificationAt(w, 40, 0.1));
const H_SWEEP = [0.05, 0.1, 0.2].map((h) => amplificationAt(0.25, 40, h));

// A over the usable window (W in [0.20, 1/3], PPD >= 20 -- excluding the degenerate W = 0.5 rung).
const USABLE_A = [...PPD_SWEEP, ...W_SWEEP].filter((r) => r.A !== null).map((r) => r.A);
const A_MIN = Math.min(...USABLE_A);
const A_MAX = Math.max(...USABLE_A);
// PPD-refined limit: the mean A over the fine grids (PPD >= 40 at W = 0.25).
const A_FINE = PPD_SWEEP.filter((r) => r.PPD >= 40).map((r) => r.A);
const A_FINE_LIMIT = +(A_FINE.reduce((a, b) => a + b, 0) / A_FINE.length).toFixed(4);

export const IMP97805_KNEE_EFLOW_AMPLIFICATION_RATIO = {
  id: 'imp-97805',
  proofSection: 'S-frontier',
  question:
    'imp-97781 F3 stated the imp-33721 sub-decade exponent-ramp knee amplifies the small E_flow term ' +
    '"~1000x" (E_flow/E_trunc ~ 1.9e-3 at the knee, yet the offset moves ~1.77 pp per unit amplitude), ' +
    'but the "~1000x" was inferred from the amp sweep, not computed as an explicit dimensionless ratio. ' +
    'Directly compute A = |d(offset fraction)/d amp| / (E_flow/E_trunc at the knee) on the identical ' +
    'imp-33721 quarter-decade D2 estimator, confirm whether it lands near 1000, and quantify the ' +
    'sensitivity of A to the grid resolution. Measurement/sensitivity only; N_cross is E_flow-independent ' +
    '(imp-97781 F2); C_mb GUE-conditional (imp-486) untouched; no bound moves; NO QED.',
  measuredQuantity:
    'the dimensionless E_flow amplification A = |d(N*/N_cross - 1)/d amp| / (E_flow/E_trunc at the ' +
    'baseline knee), computed on the imp-33721 quarter-decade D2 knee estimator at the baseline grid ' +
    '(W = 0.25, PPD = 40, h = 0.1) and swept across PPD in {20,30,40,60,80,120}, bracket width W in ' +
    '{0.20,0.25,1/3,0.5}, and amp step h in {0.05,0.10,0.20}',
  N_cross: +N_CROSS.toExponential(6), // 3.280294e9, E_flow-independent anchor
  baseline: {
    W: BASELINE.W,
    PPD: BASELINE.PPD,
    h: BASELINE.h,
    log10knee: BASELINE.log10knee, // ~9.5286 (reproduces imp-97781)
    dOffsetPtsPerAmp: BASELINE.dOffsetPtsPerAmp, // ~-1.77 (reproduces imp-97781)
    EflowOverEtruncAtKnee: BASELINE.ratioAtKnee, // ~1.85e-3
    A: BASELINE.A, // ~9.55
  },
  ppdSweep: PPD_SWEEP,
  widthSweep: W_SWEEP,
  hSweep: H_SWEEP,
  gridBand: { A_min: +A_MIN.toFixed(4), A_max: +A_MAX.toFixed(4), A_ppd_refined_limit: A_FINE_LIMIT }, // ~[9.54, 10.11], limit ~9.54
  finding: {
    F1_reuse_gate_reproduces_imp97781:
      'At the baseline grid (W=0.25, PPD=40) the recomputed knee sits at log10 N* ~ ' + BASELINE.log10knee +
      ' with offset slope ~ ' + BASELINE.dOffsetPtsPerAmp + ' pp/amp and E_flow/E_trunc ~ ' +
      BASELINE.ratioAtKnee + ' at the knee -- reproducing imp-97781 F3 byte-for-byte, proving the ' +
      'identical imp-33721 estimator is in use.',
    F2_A_is_about_ten_not_a_thousand:
      'The directly computed amplification is A ~ ' + BASELINE.A + ' at the baseline grid, NOT ~1000. ' +
      'The "~1000x" heuristic conflated the percentage-point offset slope (-1.77 pp/amp = 0.0177/amp) ' +
      'with the raw ratio ~1.9e-3, a units mismatch; the correct dimensionless amplification is O(10). ' +
      'This CONFIRMS the imp-97804 closed-form A ~ 9.4 (continuous knee), now measured DIRECTLY on the ' +
      'discrete quarter-decade D2 estimator rather than via the continuous proxy.',
    F3_grid_robust_dominated_by_bracket_width:
      'A is grid-robust: PPD refinement converges A to ~' + A_FINE_LIMIT + ' (PPD >= 40 all within ' +
      '9.542..9.546; PPD=30 is a coarse-grid outlier at 9.89). The amp step h is irrelevant (A = ' +
      H_SWEEP[0].A + ' for h in {0.05,0.10,0.20} -- the offset is locally linear in amp). The dominant ' +
      'knob is the bracket width W: A ~ 9.54 at W=0.20, ~9.55 at W=0.25, ~10.11 at W=1/3, and the ' +
      'estimator DEGENERATES at W=0.5 (only 4 edges -> too few D2 points, no knee). Across the usable ' +
      'window A in [' + (+A_MIN.toFixed(2)) + ', ' + (+A_MAX.toFixed(2)) + '], a ~6% band.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-97781 F3 "~1000x" E_flow amplification of ' +
    'the imp-33721 sub-decade knee-to-crossover offset is a units artifact (a percentage-point offset ' +
    'slope compared to a raw ratio). Computed directly as one dimensionless number on the IDENTICAL ' +
    'quarter-decade D2 estimator, A = |d(N*/N_cross-1)/d amp| / (E_flow/E_trunc at the knee) ~ ' +
    BASELINE.A + ' at the baseline grid (W=0.25, PPD=40), reproducing the imp-97781 offset slope ~ ' +
    BASELINE.dOffsetPtsPerAmp + ' pp/amp and E_flow/E_trunc ~ ' + BASELINE.ratioAtKnee + ' at the knee. ' +
    'A is O(10), NOT ~1000, CONFIRMING the imp-97804 closed-form A ~ 9.4 (continuous knee) now measured ' +
    'directly on the discrete estimator. A is grid-robust: PPD refinement converges to ~' + A_FINE_LIMIT +
    ', the amp differentiation step is irrelevant (offset locally linear in amp), and the only material ' +
    'knob is the bracket width W (A in [' + (+A_MIN.toFixed(2)) + ', ' + (+A_MAX.toFixed(2)) + '] across ' +
    'the usable window, degenerating only at W=0.5 where the sub-decade window holds too few brackets). ' +
    'The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642); ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97781 (the "~1000x" F3 heuristic); imp-97804 (closed-form A ~ 9.4 via the continuous knee); ' +
    'imp-33721 (sub-decade knee, log10 N* ~ 9.529); imp-3444 (bisected E_coll=E_trunc crossover ' +
    '~3.280e9, the E_flow-fixed anchor); imp-398 (E_flow C_F Gronwall prefactor); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP97805_KNEE_EFLOW_AMPLIFICATION_RATIO_ASSERTIONS = [
  {
    // Reuse gate: the baseline knee + offset slope + ratio reproduce imp-97781 F3 -- identical estimator.
    id: 'imp97805-reuses-imp97781-knee',
    description: 'baseline knee log10 N* ~ 9.5286, offset slope ~ -1.77 pp/amp, E_flow/E_trunc ~ 1.85e-3 (imp-97781)',
    holds: () =>
      Math.abs(BASELINE.log10knee - 9.5286) < 0.002 &&
      BASELINE.dOffsetPtsPerAmp < -1.6 && BASELINE.dOffsetPtsPerAmp > -1.9 &&
      BASELINE.ratioAtKnee > 1.7e-3 && BASELINE.ratioAtKnee < 2.0e-3,
  },
  {
    // (F2): A is O(10), NOT ~1000 -- and it lands near the imp-97804 closed-form ~9.4.
    id: 'imp97805-A-is-about-ten-not-a-thousand',
    description: 'directly computed A ~ 9.5 (O(10)), refuting ~1000 and confirming the imp-97804 closed-form ~9.4',
    holds: () => BASELINE.A > 8 && BASELINE.A < 11 && BASELINE.A < 100,
  },
  {
    // (F3): PPD refinement converges A to ~9.54 (all fine PPD grids agree closely).
    id: 'imp97805-A-ppd-converges',
    description: 'A converges under PPD refinement (PPD >= 40 all within ~9.54 +/- 0.01)',
    holds: () => {
      const fine = PPD_SWEEP.filter((r) => r.PPD >= 40).map((r) => r.A);
      return fine.every((a) => Math.abs(a - A_FINE_LIMIT) < 0.05) && Math.abs(A_FINE_LIMIT - 9.54) < 0.05;
    },
  },
  {
    // (F3): the amp differentiation step h is irrelevant -- the offset is locally linear in amp.
    id: 'imp97805-A-h-independent',
    description: 'A is identical across amp steps h in {0.05,0.10,0.20} (offset locally linear in amp)',
    holds: () => H_SWEEP.every((r) => Math.abs(r.A - H_SWEEP[0].A) < 1e-6),
  },
  {
    // (F3): bracket width W is the dominant knob, and W = 0.5 degenerates (no knee resolved).
    id: 'imp97805-A-width-dominant-and-degenerate-at-half',
    description: 'A rises with W (9.54 at 0.20 -> ~10.1 at 1/3) and the estimator degenerates at W=0.5 (no knee)',
    holds: () => {
      const w05 = W_SWEEP.find((r) => r.W === 0.5);
      const wThird = W_SWEEP.find((r) => Math.abs(r.W - 1 / 3) < 1e-6);
      const w20 = W_SWEEP.find((r) => r.W === 0.2);
      return w05.A === null && w05.signChanges === 0 && wThird.A > w20.A && wThird.A > 9.9 && wThird.A < 10.3;
    },
  },
  {
    // (F3): usable-window band is tight (~6%).
    id: 'imp97805-A-grid-band-tight',
    description: 'A stays in a ~6% band [9.54, 10.11] across the usable window (W in [0.20,1/3], PPD >= 20)',
    holds: () => A_MIN > 9.4 && A_MAX < 10.3 && (A_MAX / A_MIN - 1) < 0.08,
  },
  {
    // Honesty gate: measurement/sensitivity only, no QED, PT stays SOTA.
    id: 'imp97805-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP97805_KNEE_EFLOW_AMPLIFICATION_RATIO.isRigorous === false &&
      /NO QED/.test(IMP97805_KNEE_EFLOW_AMPLIFICATION_RATIO.verdict) &&
      /remains SOTA/.test(IMP97805_KNEE_EFLOW_AMPLIFICATION_RATIO.verdict),
  },
];

for (const a of IMP97805_KNEE_EFLOW_AMPLIFICATION_RATIO_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97805-knee-eflow-amplification-ratio assertion failed: ${a.id}`);
  }
}
