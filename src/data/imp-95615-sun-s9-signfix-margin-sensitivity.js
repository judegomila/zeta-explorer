/**
 * @fileoverview imp-95615 — SENSITIVITY: how much of the imp-95600 sign-corrected
 * Sun margin (rho* ~ 1/56, delta_0_corr ~ 0.0373) is an artifact of its LOCAL
 * 3-point parabola model of the unpublished Lambda_mid(rho)?
 *
 * Context. imp-95600-sun-s9-signfix-rho-margin-assessment re-derived Sun's
 * rho = S/B margin under his flagged Section-9 wrong-sign B-squared correction
 * (delta_0_corr(rho) = delta_0(rho) - 4 rho^2), using a LOCAL parabola for
 * delta_0(rho) pinned by only three reported facts:
 *   (i)   delta_0(1/50) = 0.038723            (optimum value)
 *   (ii)  delta_0-prime(1/50) = 0             (stationarity at 1/50)
 *   (iii) delta_0(1/20) = 0.00966243          (the gate)
 * That parabola has curvature A = -32.28952 and gives corrected optimum
 * rho* ~ 0.017796 (~1/56), delta_0_corr(rho*) ~ 0.037299, while Sun literal
 * rho=1/20 margin flips NEGATIVE (delta_0_corr(1/20) ~ -0.00033757). imp-95600
 * itself flagged that its verdict "rests on a LOCAL parabolic model whose
 * sensitivity was never measured". This module measures it.
 *
 * METHOD. Vary each of the three pinning inputs one-at-a-time by +/-10% (a band
 * far wider than the quoted precision of Sun figures), recompute
 *   A(d1,d2,r0) = (d2 - d1)/(1/20 - r0)^2,
 *   rho*(A,r0)  = A r0/(A - 4),   delta_0_corr(rho*) = A (rho*-r0)^2 + d1 - 4 rho*^2,
 * and record the resulting band on rho* and on delta_0_corr(rho*). Separately test
 * a NON-parabolic local model: add a free cubic shape term C (rho-r0)^3 that still
 * matches ALL three pins (value + stationarity at r0, value at the gate) and sweep
 * C over [-2, 2].
 *
 * FINDINGS.
 *  F1 (headline conclusion is MODEL-INDEPENDENT). The "Sun literal rho=1/20 margin
 *     goes negative" conclusion does NOT use the parabola at all: 1/20 is a pinning
 *     node, so delta_0_corr(1/20) = delta_0(1/20) - 4 (1/20)^2 = 0.00966243 - 0.01
 *     = -0.00033757 EXACTLY, for ANY local model (parabolic or not) that honours the
 *     reported gate value. The sign flip is robust to the modelling choice entirely;
 *     it is a statement about the single number delta_0(1/20) vs the threshold 0.01.
 *  F2 (how fragile the sign flip is to that ONE number). delta_0(1/20)=0.00966243 sits
 *     only 0.00033757 below the 0.01 threshold, i.e. it would have to be UNDER-reported
 *     by >= 3.494% for the corrected 1/20 margin to climb back to non-negative. So the
 *     flip is robust to model choice but NOT to a >3.5% error in the gate figure itself.
 *  F3 (rho* band). Under +/-10% one-at-a-time perturbation the interior optimum stays
 *     firmly inside (0, 1/50): rho* in ~[0.01578, 0.01986] (1/rho* ~ 50.4..63.4). The
 *     stationarity location r0=1/50 (input iii) dominates the rho* band; the gate value
 *     d2 barely moves it (~[0.01773, 0.01786]). The non-parabolic cubic sweep moves rho*
 *     by < 1e-5 (all three pins fix it to within a hair). rho* is a robust "near 1/56".
 *  F4 (delta_0_corr(rho*) band). The corrected optimum value stays POSITIVE across every
 *     single-input +/-10% perturbation and across the cubic sweep: band ~[0.0335, 0.0412].
 *     It tracks the reported optimum d1=0.038723 roughly linearly (a +/-10% move in d1 is
 *     the widest driver); it NEVER approaches zero. The interior positive margin survives.
 *
 * VERDICT. imp-95600 s two qualitative conclusions are ROBUST to the local-model choice:
 *  - "Sun literal rho=1/20 margin goes NEGATIVE" is in fact model-INDEPENDENT (F1), fragile
 *    only to a >3.5% error in the single reported gate value 0.00966243 (F2);
 *  - the interior positive-margin optimum near rho* ~ 1/56 survives every tested
 *    perturbation and both functional forms, with delta_0_corr(rho*) staying positive
 *    (F3, F4). The parabola is NOT load-bearing for either qualitative claim; it only
 *    sets the second-decimal value of the optimum, which stays ~0.033..0.041.
 * What this does NOT do: it is still an assessment ATOP an unpublished Lambda_mid(rho)
 * and ONE reading of "wrong-sign B-squared"; it neither re-derives Sun Section 9 from the
 * primary source nor certifies the imp-95516 S2-S5 determinant/rank core.
 *
 * Catalan constant G irrationality remains OPEN; Sun arXiv:2609.04176 single-author and
 * unrefereed; NO Lambda movement; no refereed bound is changed; NO QED.
 *
 * NO heavy imports. All figures recomputed here from the ledger constants.
 */

const RHO_GATE = 1 / 20; // 0.05, the pinning node where delta_0(1/20) is reported
const CORR = 4; // corrected margin = delta_0(rho) - 4 rho^2

// imp-95600 pinning inputs.
const D1_BASE = 0.038723; // delta_0(1/50), optimum value      (input i)
const R0_BASE = 1 / 50; // 0.02, stationarity / optimum location (input ii)
const D2_BASE = 0.00966243; // delta_0(1/20), the gate            (input iii)

// Parabola: delta_0(rho) = A (rho - r0)^2 + d1, curvature A pinned by the gate value.
function curvatureA(d1, d2, r0) {
  return (d2 - d1) / Math.pow(RHO_GATE - r0, 2);
}
function delta0Corr(rho, A, d1, r0) {
  return A * Math.pow(rho - r0, 2) + d1 - CORR * rho * rho;
}
// Corrected optimum of A (rho-r0)^2 + d1 - 4 rho^2 : rho* = A r0 / (A - 4).
function rhoStar(A, r0) {
  return (A * r0) / (A - 4);
}

const A_BASE = curvatureA(D1_BASE, D2_BASE, R0_BASE);
const RHO_STAR_BASE = rhoStar(A_BASE, R0_BASE);
const D0CORR_STAR_BASE = delta0Corr(RHO_STAR_BASE, A_BASE, D1_BASE, R0_BASE);

// F1/F2: the 1/20 margin is EXACTLY the gate value minus 4*(1/20)^2, model-free.
const MARGIN_AT_GATE = D2_BASE - CORR * RHO_GATE * RHO_GATE; // -0.00033757, uses no A
const GATE_THRESHOLD = CORR * RHO_GATE * RHO_GATE; // 0.01: delta_0(1/20) must exceed this
const GATE_HEADROOM_PCT = ((GATE_THRESHOLD - D2_BASE) / D2_BASE) * 100; // ~3.494%

// One-at-a-time +/-10% bands on rho* and delta_0_corr(rho*).
const PERTURB = [-0.1, -0.05, 0, 0.05, 0.1];
function oneAtATimeBand(pick) {
  let rMin = Infinity, rMax = -Infinity, dMin = Infinity, dMax = -Infinity;
  for (const f of PERTURB) {
    const { d1, d2, r0 } = pick(f);
    const A = curvatureA(d1, d2, r0);
    const rs = rhoStar(A, r0);
    const dc = delta0Corr(rs, A, d1, r0);
    rMin = Math.min(rMin, rs); rMax = Math.max(rMax, rs);
    dMin = Math.min(dMin, dc); dMax = Math.max(dMax, dc);
  }
  return { rhoStarBand: [rMin, rMax], d0corrBand: [dMin, dMax] };
}
const BAND_D1 = oneAtATimeBand((f) => ({ d1: D1_BASE * (1 + f), d2: D2_BASE, r0: R0_BASE }));
const BAND_D2 = oneAtATimeBand((f) => ({ d1: D1_BASE, d2: D2_BASE * (1 + f), r0: R0_BASE }));
const BAND_R0 = oneAtATimeBand((f) => ({ d1: D1_BASE, d2: D2_BASE, r0: R0_BASE * (1 + f) }));

// Aggregate rho* / delta_0_corr band across all three single-input sweeps.
const RHO_STAR_LO = Math.min(BAND_D1.rhoStarBand[0], BAND_D2.rhoStarBand[0], BAND_R0.rhoStarBand[0]);
const RHO_STAR_HI = Math.max(BAND_D1.rhoStarBand[1], BAND_D2.rhoStarBand[1], BAND_R0.rhoStarBand[1]);
const D0CORR_LO = Math.min(BAND_D1.d0corrBand[0], BAND_D2.d0corrBand[0], BAND_R0.d0corrBand[0]);
const D0CORR_HI = Math.max(BAND_D1.d0corrBand[1], BAND_D2.d0corrBand[1], BAND_R0.d0corrBand[1]);

// Non-parabolic local model: delta_0(rho) = A_C (rho-r0)^2 + C (rho-r0)^3 + d1, with the
// cubic keeping value+stationarity at r0 and A_C re-pinned by the gate value. Sweep shape C.
function cubicOptimum(C) {
  const dx = RHO_GATE - R0_BASE;
  const AC = (D2_BASE - D1_BASE - C * Math.pow(dx, 3)) / Math.pow(dx, 2);
  let rho = RHO_STAR_BASE;
  for (let i = 0; i < 60; i += 1) {
    const x = rho - R0_BASE;
    const fp = 2 * AC * x + 3 * C * x * x - 8 * rho; // d/drho of A_C x^2 + C x^3 + d1 - 4 rho^2
    const fpp = 2 * AC + 6 * C * x - 8;
    rho -= fp / fpp;
  }
  const x = rho - R0_BASE;
  return { rhoStar: rho, d0corr: AC * x * x + C * x * x * x + D1_BASE - CORR * rho * rho };
}
const CUBIC_SWEEP = [-2, -1, -0.5, 0, 0.5, 1, 2].map((C) => ({ C, ...cubicOptimum(C) }));
const CUBIC_RHO_LO = Math.min(...CUBIC_SWEEP.map((r) => r.rhoStar));
const CUBIC_RHO_HI = Math.max(...CUBIC_SWEEP.map((r) => r.rhoStar));
const CUBIC_D0_LO = Math.min(...CUBIC_SWEEP.map((r) => r.d0corr));
const CUBIC_D0_HI = Math.max(...CUBIC_SWEEP.map((r) => r.d0corr));

export const SUN_S9_SIGNFIX_MARGIN_SENSITIVITY = Object.freeze({
  id: 'imp-95615-sun-s9-signfix-margin-sensitivity',
  title:
    'Sensitivity of the imp-95600 sign-corrected Sun margin (rho*~1/56, delta_0_corr~0.0373) '
    + 'to its LOCAL 3-point parabola model of the unpublished Lambda_mid(rho)',
  status:
    'SENSITIVITY — "1/20 margin NEGATIVE" is MODEL-INDEPENDENT (F1), fragile only to a '
    + '>3.49% error in the single gate value 0.00966243 (F2); interior optimum rho*~1/56 and '
    + 'delta_0_corr~0.0373 survive every +/-10% single-input and non-parabolic perturbation '
    + '(F3,F4); parabola NOT load-bearing for either qualitative claim; '
    + 'G irrationality OPEN; Sun unrefereed; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  assesses: 'imp-95600-sun-s9-signfix-rho-margin-assessment',

  base: {
    curvatureA: A_BASE, // -32.289522
    rhoStar: RHO_STAR_BASE, // 0.017796
    inverseRhoStar: 1 / RHO_STAR_BASE, // ~56.19
    d0corrAtOptimum: D0CORR_STAR_BASE, // 0.037299
    marginAtGate: MARGIN_AT_GATE, // -0.00033757
  },

  // F1/F2: the 1/20 sign flip uses no model at all.
  gateSignFlip: {
    marginAtGate: MARGIN_AT_GATE, // -0.00033757, EXACTLY d2 - 4*(1/20)^2
    threshold: GATE_THRESHOLD, // 0.01
    reportedGateValue: D2_BASE, // 0.00966243
    headroomPct: GATE_HEADROOM_PCT, // ~3.494% : gate would need this much upward error to un-flip
    modelIndependent: true,
    note:
      '1/20 is a pinning node, so delta_0_corr(1/20) = delta_0(1/20) - 4*(1/20)^2 for ANY '
      + 'local model honouring the reported gate value; the negative sign is not an artifact '
      + 'of the parabola, only of the gate figure being below 0.01.',
  },

  // F3/F4: one-at-a-time +/-10% bands.
  perturbationBands: {
    d1_optimumValue: BAND_D1,
    d2_gateValue: BAND_D2,
    r0_stationarity: BAND_R0,
    aggregateRhoStar: [RHO_STAR_LO, RHO_STAR_HI], // ~[0.01578, 0.01986] ; 1/rho* ~ 50.4..63.4
    aggregateD0corr: [D0CORR_LO, D0CORR_HI], // ~[0.0335, 0.0412], stays positive
    rhoStarDriver: 'r0 (the stationarity location 1/50) dominates the rho* band',
    d0corrDriver: 'd1 (the reported optimum value 0.038723) dominates the delta_0_corr band',
  },

  // Non-parabolic (free cubic shape term) local model, all three pins held.
  nonParabolic: {
    model: 'delta_0(rho) = A_C (rho-r0)^2 + C (rho-r0)^3 + d1, cubic keeps value+stationarity at r0',
    sweepC: CUBIC_SWEEP,
    rhoStarBand: [CUBIC_RHO_LO, CUBIC_RHO_HI], // moves < 1e-5
    d0corrBand: [CUBIC_D0_LO, CUBIC_D0_HI], // essentially unchanged, positive
    note: 'the three pins fix rho* and delta_0_corr(rho*) to within a hair; shape freedom is inert',
  },

  verdict:
    'The two qualitative conclusions of imp-95600 are robust to the local-model choice. '
    + 'The headline "Sun literal rho=1/20 margin goes NEGATIVE" is model-INDEPENDENT (evaluated '
    + 'at a pinning node), fragile only to a >3.49% upward error in the single reported gate '
    + 'value 0.00966243. The interior positive-margin optimum near rho*~1/56 survives every '
    + '+/-10% single-input perturbation (rho* in ~[1/63, 1/50]) and the non-parabolic cubic '
    + 'family, with delta_0_corr(rho*) staying positive in ~[0.0335, 0.0412]. The parabola is '
    + 'thus NOT load-bearing for either claim; it only sets the second-decimal value of the '
    + 'optimum.',

  caveats:
    'Assessment ATOP an unpublished Lambda_mid(rho) and ONE reading of "wrong-sign B-squared" '
    + '(-2rho^2 to +2rho^2). Not a primary-source re-derivation of Sun Section 9 nor a '
    + 'certification of the imp-95516 S2-S5 determinant/rank core. Catalan G irrationality OPEN; '
    + 'Sun arXiv:2609.04176 unrefereed; NO Lambda movement; no refereed bound is changed; NO QED.',
});

export const SUN_S9_SIGNFIX_MARGIN_SENSITIVITY_ASSERTIONS = Object.freeze([
  {
    name: 'F1: 1/20 margin equals gate value minus 4*(1/20)^2 EXACTLY (model-independent)',
    holds: () => Math.abs(MARGIN_AT_GATE - (D2_BASE - 0.01)) < 1e-12 && MARGIN_AT_GATE < 0,
  },
  {
    name: 'F2: gate figure sits ~3.49% below the 0.01 threshold (headroom to un-flip)',
    holds: () => Math.abs(GATE_HEADROOM_PCT - 3.494) < 0.02,
  },
  {
    name: 'F3: rho* stays inside (0, 1/50) across all +/-10% single-input perturbations',
    holds: () => RHO_STAR_LO > 0 && RHO_STAR_HI < 0.02,
  },
  {
    name: 'F4: delta_0_corr(rho*) stays positive across all perturbations and the cubic sweep',
    holds: () => D0CORR_LO > 0 && CUBIC_D0_LO > 0,
  },
  {
    name: 'non-parabolic cubic shape freedom moves rho* by < 1e-4 (parabola not load-bearing)',
    holds: () => (CUBIC_RHO_HI - CUBIC_RHO_LO) < 1e-4,
  },
  {
    name: 'honest: assessment only, G irrationality OPEN, no refereed bound is changed, NO QED',
    holds: () => /G irrationality OPEN/.test(SUN_S9_SIGNFIX_MARGIN_SENSITIVITY.status)
      && /refereed bound is changed/i.test(SUN_S9_SIGNFIX_MARGIN_SENSITIVITY.status)
      && /NO QED/.test(SUN_S9_SIGNFIX_MARGIN_SENSITIVITY.status),
  },
]);

export default SUN_S9_SIGNFIX_MARGIN_SENSITIVITY;
