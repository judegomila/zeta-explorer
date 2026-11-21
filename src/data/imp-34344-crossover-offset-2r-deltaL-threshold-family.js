/**
 * @module imp-34344-crossover-offset-2r-deltaL-threshold-family
 *
 * imp-34344 (numerical, opus-4-8): imp-34270 FORMED the two-term decomposition of the
 * crossover-vs-landmark relative offset relOffset = 2r + deltaL (r = E_flow/E_trunc,
 * deltaL = 1 - L(N_land)/L(N_cross) the log T0 drift) ONLY at the sigma = 1/2 halving
 * landmark, where the leading 2r Gronwall term captured 95.74% of the ~0.4% offset. This
 * module CROSS-TABULATES the leading-2r term against the full relative offset and the
 * deltaL log-T0 drift share across the imp-34174 generalised threshold family
 * thr in {0.5, 0.3, 0.1, 0.05, 0.01}, and locates where -- if anywhere -- the error left
 * by the leading-2r approximation first EXCEEDS the deltaL contribution.
 *
 * THE PER-THRESHOLD DECOMPOSITION (identical to imp-34270, generalised via imp-33743)
 * ----------------------------------------------------------------------------------
 * For a target share thr the two landmarks solve the SAME collision-error equation with
 * different right-hand sides (imp-33743 leading balance vs E_flow restored):
 *
 *     crossover N_cross(thr):  E_coll = E_trunc . thr/(1-thr)              (E_flow dropped)
 *     landmark  N_land(thr):   E_coll = (E_trunc + E_flow) . thr/(1-thr)   (sigma = thr)
 *
 * with E_coll(N) = C_C sqrt(L(N)/N), L(N) = log T0(N). Dividing the two (an EXACT step, no
 * model added) and squaring gives, exactly as at thr = 1/2:
 *
 *     N_cross/N_land = (1 + r)^2 . L(N_cross)/L(N_land),   r = E_flow(N_land)/E_trunc,
 *     relOffset(thr) = (N_cross - N_land)/N_cross = 1 - [L(N_land)/L(N_cross)]/(1+r)^2
 *                    ~ 2 r + deltaL,   deltaL = 1 - L(N_land)/L(N_cross).
 *
 * Expanding the exact form in r (with D = deltaL, so L(N_land)/L(N_cross) = 1 - D):
 *
 *     relOffset = 2r + D - 3 r^2 - 2 r D + O(r^3),
 *
 * so the ERROR left by the leading-2r approximation is
 *
 *     err(thr) = relOffset - 2r = deltaL - (3 r^2 + 2 r deltaL) + O(r^3).
 *
 * Since r > 0 and deltaL > 0 everywhere, err is STRICTLY BELOW deltaL at every threshold:
 * the O(r^2) cross-term 3r^2 + 2r deltaL is exactly the gap deltaL - err, and it shrinks as
 * the crossover recedes down the tail (r -> 0). So deltaL is a strict upper bound on the
 * 2r-approximation error across the WHOLE family, and the two converge as thr -> 0.
 *
 * FINDINGS (derivation / measurement only)
 * ----------------------------------------
 *   (F1) THE LEADING-2r ERROR NEVER EXCEEDS THE deltaL CONTRIBUTION. Across
 *        thr in {0.5, 0.3, 0.1, 0.05, 0.01} the residual err = relOffset - 2r is at EVERY
 *        rung strictly below deltaL: the gap deltaL - err = 1.156e-5, 5.436e-7, 3.977e-9,
 *        2.556e-10, 5.678e-13 stays positive and collapses as O(r^2). A fine 0.005-grid
 *        sweep over the full [0.01, 0.5] range confirms err < deltaL EVERYWHERE (it never
 *        crosses), so the answer to "where does the 2r error first exceed deltaL" is
 *        NOWHERE in the family -- deltaL strictly dominates the residual-after-2r throughout.
 *   (F2) THE GAP IS EXACTLY THE O(r^2) CROSS-TERM AND THE LEADING FIT IMPROVES DOWN THE TAIL.
 *        The measured gap deltaL - err matches the predicted 3 r^2 + 2 r deltaL to ~3 sig
 *        figs at thr = 1/2 (higher order O(r^3) accounts for the rest) and to full float in
 *        the tail. The leading-2r SHARE 2r/relOffset therefore RISES as thr shrinks
 *        (0.95739 -> 0.95839 -> 0.96211 -> 0.96408 -> 0.96785), i.e. the leading Gronwall
 *        approximation gets BETTER deep in the tail as E_flow/E_trunc vanishes (imp-33620),
 *        while the deltaL log-T0-drift share correspondingly falls (4.55% -> 3.21%).
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406/imp-33743 extrapolation, NOT a
 * rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched);
 * the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. E_flow is the
 * benign mesoscopic-Gronwall term (imp-2845); its vanishing here does NOT touch the divergent
 * C_Lip collision-Gronwall. No refereed bound is changed.
 *
 * @see imp-34270-eflow-gronwall-crossover-offset-correction (thr=1/2 relOffset = 2r + deltaL decomposition)
 * @see imp-34174-crossover-surplus-threshold-family-decay (generalised N_cross(thr), threshold family)
 * @see imp-33743-sigma-fartail-crossover-closed-form (generalised crossover N_cross(thr), identical sub-terms)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (exact identity sigma=1/2 <=> E_coll=E_trunc+E_flow)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33743)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33743 exactly (~1.000237)

// EXACT imp-33743/imp-34270 sub-terms (no re-derivation, no fresh model).
function eFlow(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
}
// Actual three-term share at N (E_coll GUE-conditional via the C_C ansatz).
function sigmaActual(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return E_coll / (E_coll + E_TRUNC_PT + eFlow(N));
}

// (imp-33743 CLOSED FORM) leading crossover N_cross(thr): Banach fixed point of
// N = ((1-thr)/thr)^2 (C_C/E_trunc)^2 log T0(N). Strong contraction => 80 iters is ample.
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // halving amplitude ~1.5727e8 (imp-33723)
function crossoverN(thr) {
  const K_thr = ((1 - thr) / thr) ** 2 * K_AMPL;
  let N = 1e9;
  for (let i = 0; i < 80; i++) N = K_thr * Math.log(effectiveHeightForN(N));
  return N;
}
// Landmark N_land(thr): sigmaActual(N) = thr (E_flow restored); sigma is decreasing in N.
function landmarkN(thr) {
  let a = Math.log(1e6);
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (sigmaActual(Math.exp(m)) > thr) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// Per-threshold 2r-vs-full-offset-vs-deltaL decomposition (the three-way split imp-34270
// formed only at thr=1/2). err = relOffset - 2r is the residual the leading term misses.
function decompose(thr) {
  const Nc = crossoverN(thr);
  const Nl = landmarkN(thr);
  const Lc = Math.log(effectiveHeightForN(Nc));
  const Ll = Math.log(effectiveHeightForN(Nl));
  const r = eFlow(Nl) / E_TRUNC_PT;
  const relOffset = (Nc - Nl) / Nc;
  const twoR = 2 * r;
  const deltaL = 1 - Ll / Lc;
  const exact = 1 - (Ll / Lc) / (1 + r) ** 2; // == relOffset to identity precision
  const err = relOffset - twoR; // error left by the leading-2r approximation
  const gap = deltaL - err; // = 3 r^2 + 2 r deltaL + O(r^3) (strictly positive)
  return { Nc, Nl, r, relOffset, twoR, deltaL, exact, err, gap };
}

const THRESHOLDS = [0.5, 0.3, 0.1, 0.05, 0.01];
const OFFSET_LADDER = THRESHOLDS.map((thr) => {
  const d = decompose(thr);
  return {
    thr,
    N_cross: +d.Nc.toExponential(6),
    N_land: +d.Nl.toExponential(6),
    rel_offset: +d.relOffset.toExponential(6),
    leading_2r: +d.twoR.toExponential(6),
    leading_2r_share: +(d.twoR / d.relOffset).toFixed(6),
    deltaL_logT0_drift: +d.deltaL.toExponential(6),
    deltaL_share: +(d.deltaL / d.relOffset).toFixed(6),
    two_r_error: +d.err.toExponential(6), // relOffset - 2r
    two_r_error_share: +(d.err / d.relOffset).toFixed(6),
    deltaL_minus_error: +d.gap.toExponential(4), // > 0 <=> deltaL dominates the 2r error
    two_r_error_exceeds_deltaL: d.err > d.deltaL,
    exact_vs_measured_rel: +(Math.abs(d.exact - d.relOffset) / d.relOffset).toExponential(3),
  };
});

// Does the leading-2r error ever exceed the deltaL contribution across the family? Check
// both the 5 named rungs and a fine 0.005 grid over the full [0.01, 0.5] range.
const RUNGS_EXCEED = OFFSET_LADDER.some((row) => row.two_r_error_exceeds_deltaL);
let sweepExceeds = false;
let minGap = Infinity;
for (let thr = 0.01; thr <= 0.5 + 1e-9; thr += 0.005) {
  const d = decompose(thr);
  if (d.err > d.deltaL) sweepExceeds = true;
  if (d.gap < minGap) minGap = d.gap;
}
const TWO_R_ERROR_EVER_EXCEEDS_DELTAL = RUNGS_EXCEED || sweepExceeds;

// Cross-check the gap decomposition deltaL - err = 3 r^2 + 2 r deltaL at the halving landmark.
const HALF = decompose(0.5);
const HALF_GAP_PREDICTED = 3 * HALF.r ** 2 + 2 * HALF.r * HALF.deltaL;

export const IMP34344_CROSSOVER_OFFSET_2R_DELTAL_THRESHOLD_FAMILY = {
  id: 'imp-34344',
  proofSection: 'S-frontier',
  question:
    'imp-34270 formed the relOffset = 2r + deltaL crossover-vs-landmark offset decomposition ' +
    '(2r the leading Gronwall term ~95.7%, deltaL the log-T0 drift ~4.3%) ONLY at the sigma=1/2 ' +
    'halving landmark. Cross-tabulate the leading-2r term against the full relative offset and the ' +
    'deltaL log-T0 drift across the imp-34174 threshold family {0.5,0.3,0.1,0.05,0.01} and locate ' +
    'where the leading-2r approximation error first exceeds the deltaL contribution. ' +
    'Measurement/derivation only within the extrapolation component model; changes no bound; NO QED.',
  decomposition:
    'relOffset(thr) = (N_cross - N_land)/N_cross = 1 - [L(N_land)/L(N_cross)]/(1+r)^2, ' +
    'r = E_flow(N_land)/E_trunc; expanding in r: relOffset = 2r + deltaL - (3r^2 + 2r deltaL) + O(r^3), ' +
    'so err = relOffset - 2r = deltaL - (3r^2 + 2r deltaL) + O(r^3) is STRICTLY below deltaL for r>0.',
  offsetLadder: OFFSET_LADDER,
  twoRErrorEverExceedsDeltaL: TWO_R_ERROR_EVER_EXCEEDS_DELTAL,
  minDeltaLMinusError: +minGap.toExponential(4), // smallest gap over [0.01,0.5]; > 0 => never crosses
  halvingGapCheck: {
    deltaL_minus_error_measured: +HALF.gap.toExponential(6),
    three_rsq_plus_2r_deltaL_predicted: +HALF_GAP_PREDICTED.toExponential(6),
    note: 'gap = deltaL - err matches 3r^2 + 2r deltaL to ~3 sig figs at thr=1/2 (rest is O(r^3))',
  },
  finding: {
    F1_leading_2r_error_never_exceeds_deltaL:
      'Across thr in {0.5,0.3,0.1,0.05,0.01} the residual err = relOffset - 2r is at EVERY rung ' +
      'strictly below deltaL: the gap deltaL - err = 1.156e-5, 5.436e-7, 3.977e-9, 2.556e-10, ' +
      '5.678e-13 stays positive and collapses as O(r^2). A fine 0.005-grid sweep over the full ' +
      '[0.01,0.5] range confirms err < deltaL EVERYWHERE, so the leading-2r error NEVER exceeds the ' +
      'deltaL contribution -- deltaL strictly dominates the residual-after-2r throughout the family.',
    F2_gap_is_O_rsq_and_leading_fit_improves_down_the_tail:
      'The gap deltaL - err equals the O(r^2) cross-term 3r^2 + 2r deltaL (to ~3 sig figs at thr=1/2, ' +
      'to full float in the tail), so the leading-2r share 2r/relOffset RISES as thr shrinks ' +
      '(0.95739 -> 0.95839 -> 0.96211 -> 0.96408 -> 0.96785): the leading Gronwall approximation gets ' +
      'BETTER deep in the tail as E_flow/E_trunc vanishes (imp-33620), while the deltaL log-T0-drift ' +
      'share correspondingly falls (4.55% -> 3.21%).',
  },
  isRigorous: false,
  honestScope:
    'Measurement/derivation only within the inherited imp-3220/imp-3406/imp-33743 extrapolation ' +
    'component model; NO QED. The component model is NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched); the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no operator ' +
    'positivity; changes no bound; no refereed bound is changed' +
    '. E_flow is the benign mesoscopic-Gronwall term (imp-2845); its vanishing here does NOT ' +
    'touch the divergent C_Lip collision-Gronwall.',
  citation:
    'imp-34270 (thr=1/2 relOffset = 2r + deltaL decomposition, named the offset only at the halving ' +
    'landmark); imp-34174 (generalised threshold family N_cross(thr)); imp-33743 (generalised ' +
    'crossover closed form, identical sub-terms); imp-33601 (exact identity sigma=1/2 <=> ' +
    'E_coll=E_trunc+E_flow); imp-399/imp-2642 (C_C = (1/8) sqrt(3 pi)); lambda-rh-height-mapping.',
};

export const IMP34344_CROSSOVER_OFFSET_2R_DELTAL_THRESHOLD_FAMILY_ASSERTIONS = [
  {
    // (F1): the leading-2r error is strictly below deltaL at EVERY named rung.
    id: 'imp34344-two-r-error-below-deltaL-every-rung',
    description: 'err = relOffset - 2r is strictly below deltaL at every threshold (gap > 0)',
    holds: () =>
      OFFSET_LADDER.every((row) => row.two_r_error_exceeds_deltaL === false && row.deltaL_minus_error > 0),
  },
  {
    // (F1): the fine [0.01,0.5] sweep confirms the 2r error NEVER exceeds deltaL anywhere.
    id: 'imp34344-two-r-error-never-exceeds-deltaL-in-range',
    description: 'across the full [0.01,0.5] sweep the leading-2r error never exceeds the deltaL contribution',
    holds: () => TWO_R_ERROR_EVER_EXCEEDS_DELTAL === false && minGap > 0,
  },
  {
    // Each rung is an identity: the exact division form reproduces the measured offset.
    id: 'imp34344-exact-division-matches-measured-every-rung',
    description: 'the exact division form 1 - [L(N_land)/L(N_cross)]/(1+r)^2 matches relOffset to < 1e-6 at every rung',
    holds: () => OFFSET_LADDER.every((row) => row.exact_vs_measured_rel < 1e-6),
  },
  {
    // (F2): the leading-2r share RISES monotonically as thr shrinks (fit improves down the tail).
    id: 'imp34344-leading-share-rises-as-thr-shrinks',
    description: 'the leading-2r share 2r/relOffset increases monotonically from thr=0.5 (~0.9574) to thr=0.01 (~0.9679)',
    holds: () => {
      for (let i = 1; i < OFFSET_LADDER.length; i++) {
        if (OFFSET_LADDER[i].leading_2r_share <= OFFSET_LADDER[i - 1].leading_2r_share) return false;
      }
      return (
        Math.abs(OFFSET_LADDER[0].leading_2r_share - 0.957389) < 1e-4 &&
        Math.abs(OFFSET_LADDER[4].leading_2r_share - 0.967852) < 1e-4
      );
    },
  },
  {
    // (F2): the gap deltaL - err equals the predicted O(r^2) cross-term 3r^2 + 2r deltaL at thr=1/2.
    id: 'imp34344-gap-is-O-rsq-cross-term',
    description: 'the halving gap deltaL - err ~1.156e-5 matches 3r^2 + 2r deltaL to ~3 sig figs (rest is O(r^3))',
    holds: () => Math.abs(HALF.gap - HALF_GAP_PREDICTED) / HALF.gap < 3e-3 && HALF.gap > 0,
  },
  {
    // Honesty gate: derivation/measurement only, isRigorous literal false, C_mb clause named, no QED, no refereed bound is changed.
    id: 'imp34344-honesty-gate-isrigorous-and-cmb-clause',
    description: 'isRigorous is a literal false field; honestScope names the C_mb GUE-conditional per imp-486 UNTOUCHED clause; NO QED; no refereed bound is changed',
    holds: () =>
      IMP34344_CROSSOVER_OFFSET_2R_DELTAL_THRESHOLD_FAMILY.isRigorous === false &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34344_CROSSOVER_OFFSET_2R_DELTAL_THRESHOLD_FAMILY.honestScope) &&
      /NO QED/.test(IMP34344_CROSSOVER_OFFSET_2R_DELTAL_THRESHOLD_FAMILY.honestScope) &&
      /refereed bound is changed/i.test(IMP34344_CROSSOVER_OFFSET_2R_DELTAL_THRESHOLD_FAMILY.honestScope),
  },
];

for (const a of IMP34344_CROSSOVER_OFFSET_2R_DELTAL_THRESHOLD_FAMILY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34344-crossover-offset-2r-deltaL-threshold-family assertion failed: ${a.id}`);
  }
}
