/**
 * @module imp-2715-worst-case-EN-headroom-audit
 *
 * imp-2715 (numerical headroom audit): imp-2643 assembles the budget
 *     E(N) = E_trunc + E_flow + E_coll  approx 0.01291  at N* = 1e4
 * at point float64 and asserts E(N) < PT_BOUND = 0.2 with a ~15x margin. That
 * margin is computed at the CENTRAL constant readings. This module re-evaluates
 * E(N) at the WORST-CASE (largest) outward-rounded bracket of every constant
 * available today, at the SAME finite working point N* = 1e4, and certifies that
 * the numeric clearance of 0.2 survives the inflation -- quantifying how robust
 * the (numerically-clears, NOT-rigorous) framing is to constant uncertainty.
 *
 * THE WORST-CASE BRACKETS (each constant pushed to its largest current value)
 * --------------------------------------------------------------------------
 * (1) E_coll = C_C . sqrt(log T0 / N),  C_C = C_H . sqrt(pi . C_Selberg).
 *     - C_H pessimized 1/8 = 0.125 -> 0.127, the imp-2643-cited inflated
 *       coefficient (a positive O(1) quadratic-tangency remainder pushes the
 *       effective Holder coefficient above 1/8; imp-2642).
 *     - C_Selberg pessimized to the conservative 3.0 (the imp-2641 discharge to
 *       the explicit Trudgian 2014 value 2.622 is verified conservative, so 3.0
 *       is the larger / worst-case bracket; it is already the value baked into
 *       C_C_PINNED, so this term is the dominant sub-budget either way).
 * (2) E_flow = C_F . (log T0 / T0) . exp(C_G . |t_c|).
 *     - C_F is analytically PINNED (imp-398), no bracket.
 *     - exp(C_G . |t_c|) pessimized to C_G = 10 (the top of the order-unity
 *       placeholder band, imp-2622) at the A1 unconditional trap |t_c| <= 2.37e-4
 *       (imp-2644). The amplification is <= 1.00237 even at C_G = 10.
 * (3) E_trunc_pt: the FIXED-strip Platt-Trudgian route (sigma = 3/4, Ingham
 *     e_I = 0.6, kappa = 0.4) that imp-2631 shows actually governs the N* = 1e4
 *     working point, giving E_trunc_pt = (2 e_I / kappa) . T_PT^{-kappa}
 *     = 3 . T_PT^{-0.4} approx 3.06e-5 (T_PT = 3e12). This term is numerically
 *     NEGLIGIBLE at N* = 1e4 (~0.23% of E(N)) and is dominated ~380x by E_coll,
 *     so its bracket does not move the verdict.
 *
 * RESULT (numerical headroom, NOT a rigorous bound)
 * -------------------------------------------------
 *     E_coll_worst  approx 1.1825e-2   (vs central 1.1638e-2; C_H 0.125->0.127)
 *   + E_flow_worst  approx 1.2418e-3   (vs central 1.239e-3; C_G 1->10)
 *   + E_trunc_pt    approx 3.064e-5    (negligible)
 *   = E(N)_worst    approx 0.0130972,  still ~15.3x below PT_BOUND = 0.2.
 * The clearance is dominated by E_coll, whose worst-case bracket bumps it by only
 * ~1.6% (0.127/0.125), so the ~15x numeric margin is ROBUST to all current
 * constant placeholders. The explicit NOT-rigorous label is retained: C_H = 0.127
 * is still an ansatz endpoint, not a proven Holder-modulus upper bound (imp-2642).
 *
 * THE NAMED FRAMING / SUB-GAP (why the kappa_T = 0.18 / C_T = 1.46 brackets are
 * NOT added here)
 * ---------------------------------------------------------------------------
 * imp-2625 brackets E_trunc in the ASYMPTOTIC thin-moving-strip regime at
 * gamma = 1e13 (kappa_T floor 0.180, C_T threshold 1.46), where by construction
 * E_trunc(C_T = 1.46, kappa_T = 0.180, gamma = 1e13) approx 0.19976 -- i.e. it
 * SATURATES PT_BOUND at the SOTA height, precisely where E_coll(gamma) -> 0. That
 * is the OTHER endpoint of the imp-2631 two-regime tradeoff: low instantiation
 * height (N* = 1e4) keeps E_trunc tiny but caps |t_c|; high height (1e13) shrinks
 * |t_c| but inflates E_trunc to the 0.2 edge. The two brackets are therefore NOT
 * co-additive: pasting the asymptotic E_trunc bracket (0.1998) onto the N* = 1e4
 * E_coll (0.0118) double-counts across incompatible instantiation heights (and
 * applying kappa_T = 0.180 directly at T0 = 9879 gives a nonsensical E_trunc
 * approx 2.56). This audit pessimizes every constant at the SINGLE coherent
 * working point N* = 1e4 used by the imp-2643 capstone; the asymptotic-regime
 * E_trunc bracket is recorded separately as the SOTA-height saturation endpoint,
 * NOT summed. This is an HONEST numerical headroom statement, not a rigorous
 * unconditional bound -- C_H remains an ansatz (imp-2643 NO-GO, imp-2701 lock).
 *
 * @see imp-2643-honest-assembled-EN (the central-reading capstone this pessimizes)
 * @see imp-2631-honest-truncation-route-assessment (the two-regime E_trunc tradeoff)
 * @see imp-2625-etrunc-constant-pinning (kappa_T floor 0.180, C_T threshold 1.46)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H ansatz, imp-2642)
 * @see imp-2644 (C_G non-binding via the A1 |t_c| trap)
 */

import { Interval } from '../math/interval-arithmetic.js';
import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { IMP2643_HONEST_ASSEMBLED_EN } from './imp-2643-honest-assembled-EN.js';

const N_STAR = 1e4;
const TWO_PI = 2 * Math.PI;
const PT_BOUND = 0.2; // Platt-Trudgian 2021 SOTA unconditional Lambda upper bound.

const T0 = effectiveHeightForN(N_STAR); // gamma_N approx 9.879e3
const L = Math.log(T0); // approx 9.198

// ── (1) E_coll worst-case: C_H = 0.127 (inflated ansatz endpoint), C_Selberg = 3.0 ──
const C_H_WORST = 0.127; // imp-2643-cited inflated quadratic-tangency coefficient (> 1/8)
const C_SELBERG_WORST = 3.0; // conservative bracket (imp-2641 discharge to 2.622 is tighter)
const C_KH_WORST = Math.PI * C_SELBERG_WORST; // = 3 pi
const C_C_WORST = C_H_WORST * Math.sqrt(C_KH_WORST); // approx 0.38989
const E_COLL_WORST = C_C_WORST * Math.sqrt(L / N_STAR);

// ── (2) E_flow worst-case: C_F pinned, Gronwall at C_G = 10 on the A1 |t_c| trap ──
const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // 1.330578, analytically pinned (imp-398)
const TC_A1_TRAP = 2.37e-4; // |t_c| <= 2.37e-4, A1 unconditional (imp-2633/2644)
const C_G_WORST = 10; // top of the order-unity placeholder band (imp-2622)
const GRONWALL_WORST = Math.exp(C_G_WORST * TC_A1_TRAP); // <= 1.00237
const E_FLOW_WORST = C_F * (L / T0) * GRONWALL_WORST;

// ── (3) E_trunc_pt: fixed-strip PT route (sigma = 3/4) that governs N* = 1e4 ──
// imp-2631: at the N* = 1e4 working point E_trunc uses the fixed strip, NOT the
// asymptotic thin-strip kappa_T = 0.18; this term is negligible (~0.23% of E(N)).
const T_PT = 3e12; // Platt-Trudgian verification height
const E_I_FIXED = (3 * (1 - 0.75)) / (2 - 0.75); // Ingham exponent at sigma = 3/4 = 0.6
const KAPPA_FIXED = 1 - E_I_FIXED; // 0.4
const E_TRUNC_PT = ((2 * E_I_FIXED) / KAPPA_FIXED) * Math.pow(T_PT, -KAPPA_FIXED); // 3 T_PT^{-0.4}

const E_N_WORST = E_TRUNC_PT + E_FLOW_WORST + E_COLL_WORST;
const WORST_MARGIN_FACTOR = PT_BOUND / E_N_WORST;

// ── Outward-rounded UPPER bracket of E(N)_worst (rounding-robust the ~15.3x margin) ──
// The point sum above is float64; this re-evaluates the SAME worst-case constants
// (C_H = 0.127, C_Selberg = 3.0, C_G = 10) in outward-rounded Interval arithmetic so
// the clearance of PT_BOUND survives rounding, not just point evaluation. T0 carries
// the imp-2860 displayed-digit half-width 0.5; the Gronwall factor at C_G = 10 uses
// the RIGOROUS elementary band exp(x) <= 1 + x + x^2 (valid for x = 2.37e-3 << 1),
// never Math.exp, so the upper endpoint is a genuine bracket. NUMERIC width only:
// C_H = 0.127 stays an ANSATZ endpoint, so E_N_WORST_HI does NOT upgrade rigor.
const TWO_PI_I = Interval.exact(TWO_PI);
const T0_I = new Interval(T0 - 0.5, T0 + 0.5);
const L_I = T0_I.log();
const C_C_I = Interval.exact(C_H_WORST).mul(Interval.exact(Math.PI).mul(Interval.exact(C_SELBERG_WORST)).sqrt());
const E_COLL_I = C_C_I.mul(L_I.div(Interval.exact(N_STAR)).sqrt());
const C_F_I = T0_I.div(TWO_PI_I).log().add(Interval.exact(1)).div(TWO_PI_I);
const GRONWALL_X = C_G_WORST * TC_A1_TRAP; // 2.37e-3
const GRONWALL_HI_I = new Interval(1, 1 + GRONWALL_X + GRONWALL_X ** 2); // exp(x) <= 1+x+x^2 for x<<1
const E_FLOW_I = C_F_I.mul(L_I.div(T0_I)).mul(GRONWALL_HI_I);
const E_TRUNC_I = new Interval(E_TRUNC_PT * (1 - 5e-13), E_TRUNC_PT * (1 + 5e-13));
const E_N_WORST_I = E_TRUNC_I.add(E_FLOW_I).add(E_COLL_I);
const E_N_WORST_HI = E_N_WORST_I.hi;
const WORST_MARGIN_FACTOR_BRACKETED = PT_BOUND / E_N_WORST_HI;

// Machine-checkable label: the C_H = 0.127 endpoint is an ANSATZ, NOT a proven Holder
// modulus -- this guards the worst-case audit from being misread as rigorous.
const C_H_WORST_ENDPOINT_KIND = 'ANSATZ';

// ── The asymptotic-regime E_trunc bracket (SOTA-height saturation endpoint) ──
// Recorded for transparency, NOT summed into E_N_WORST (see the module header):
// at gamma = 1e13 the kappa_T = 0.180 / C_T = 1.46 brackets saturate PT_BOUND by
// construction, precisely where E_coll(gamma) -> 0 (the imp-2631 two-regime
// tradeoff). Pasting it onto the N* = 1e4 E_coll would double-count heights.
const GAMMA_SOTA = 1e13;
const KAPPA_T_FLOOR = 0.18; // imp-2625 unconditional floor
const C_T_THRESHOLD = 1.46; // imp-2625 C_T <= 1.46 threshold for < 0.2 at gamma = 1e13
const E_TRUNC_ASYMPTOTIC = C_T_THRESHOLD * Math.pow(GAMMA_SOTA, -KAPPA_T_FLOOR) * Math.log(GAMMA_SOTA);

// Central readings (from the capstone) for the robustness comparison.
const E_N_CENTRAL = IMP2643_HONEST_ASSEMBLED_EN.E_N; // 0.0129087
const E_COLL_INFLATION = C_H_WORST / 0.125; // 1.016 -- the E_coll worst/central ratio

export const IMP2715_WORST_CASE_EN_HEADROOM = {
  id: 'imp-2715',
  proofSection: 'S7',
  question:
    'Does the numeric clearance E(N) < PT_BOUND = 0.2 survive when every constant ' +
    'is pushed to its largest current bracket at the SAME N* = 1e4 working point?',
  N_star: N_STAR,
  PT_BOUND,
  heightInputs: { T0: +T0.toExponential(4), logT0: +L.toFixed(4) },
  worstCaseBrackets: {
    E_coll: {
      value: +E_COLL_WORST.toFixed(7),
      C_H_worst: C_H_WORST,
      C_Selberg_worst: C_SELBERG_WORST,
      C_C_worst: +C_C_WORST.toFixed(6),
      note:
        'C_H pushed 0.125 -> 0.127 (imp-2643 inflated ansatz endpoint); C_Selberg ' +
        'at the conservative 3.0 bracket (imp-2641 discharge to 2.622 is tighter). ' +
        'Worst-case inflation over central E_coll is only ~1.6% (0.127/0.125).',
    },
    E_flow: {
      value: +E_FLOW_WORST.toExponential(4),
      C_F: +C_F.toFixed(6),
      C_G_worst: C_G_WORST,
      gronwall_factor: +GRONWALL_WORST.toFixed(6),
      note: 'C_F pinned (imp-398); Gronwall at C_G = 10 on |t_c| <= 2.37e-4 amplifies <= 1.00237.',
    },
    E_trunc_pt: {
      value: +E_TRUNC_PT.toExponential(4),
      sigma: 0.75,
      e_I: +E_I_FIXED.toFixed(4),
      kappa: +KAPPA_FIXED.toFixed(4),
      T_PT,
      note:
        'Fixed-strip PT route (imp-2631) that governs N* = 1e4; negligible (~0.23% ' +
        'of E(N)) and dominated ~380x by E_coll, so its bracket does not move the verdict.',
    },
  },
  E_N_worst: +E_N_WORST.toFixed(7),
  E_N_central: +E_N_CENTRAL.toFixed(7),
  worstMarginFactor: +WORST_MARGIN_FACTOR.toFixed(2),
  E_N_worst_bracket: {
    lo: E_N_WORST_I.lo,
    hi: E_N_WORST_HI,
    width: E_N_WORST_I.width,
    clearsPT: E_N_WORST_HI < PT_BOUND,
    marginFactor: +WORST_MARGIN_FACTOR_BRACKETED.toFixed(2),
    C_H_endpoint_kind: C_H_WORST_ENDPOINT_KIND,
    note:
      'Outward-rounded Interval UPPER bracket of E(N)_worst at the SAME worst-case ' +
      'constants (C_H = 0.127 ANSATZ, C_Selberg = 3.0, C_G = 10); E_N_worst_hi < 0.2 ' +
      'so the ~15x clearance is rounding-robust, not a point sum. NUMERIC width only -- ' +
      'C_H = 0.127 stays an ANSATZ endpoint, not a proven Holder-modulus upper bound.',
  },
  E_coll_inflation_factor: +E_COLL_INFLATION.toFixed(4),
  clearsPTNumerically: E_N_WORST < PT_BOUND,
  asymptoticRegimeEndpoint: {
    gamma: GAMMA_SOTA,
    kappa_T_floor: KAPPA_T_FLOOR,
    C_T_threshold: C_T_THRESHOLD,
    E_trunc_value: +E_TRUNC_ASYMPTOTIC.toFixed(6),
    note:
      'NOT summed into E_N_worst. At gamma = 1e13 the kappa_T = 0.180 / C_T = 1.46 ' +
      'brackets SATURATE PT_BOUND by construction (E_trunc approx 0.1998), precisely ' +
      'where E_coll(gamma) -> 0. This is the OTHER endpoint of the imp-2631 two-regime ' +
      'tradeoff; the two brackets live at incompatible instantiation heights and are ' +
      'not co-additive (applying kappa_T = 0.180 at T0 = 9879 gives a nonsensical ' +
      'E_trunc approx 2.56).',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL HEADROOM (NOT rigorous). At the single coherent working point N* = 1e4, ' +
    'pessimizing every constant to its largest current bracket (C_H = 0.127, C_Selberg = 3.0, ' +
    'C_G = 10) gives E(N)_worst approx 0.0131, still ~15.3x below PT_BOUND = 0.2. The ~15x ' +
    'margin is ROBUST to all current constant placeholders because E_coll dominates and its ' +
    'worst-case bracket inflates it by only ~1.6%. This is a numeric robustness statement, ' +
    'NOT a rigorous unconditional bound: C_H = 0.127 is an ansatz endpoint, not a proven ' +
    'Holder-modulus upper bound (imp-2642), so Lambda <= E(N) stays NON-rigorous and ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA (imp-2643 NO-GO). NO false QED.',
  citation:
    'imp-2643 (central-reading capstone E(N) approx 0.01291); imp-2631 (two-regime E_trunc ' +
    'tradeoff); imp-2625 (kappa_T floor 0.180, C_T threshold 1.46 at gamma = 1e13); ' +
    'imp-2642 (C_H ansatz); imp-2644 (C_G non-binding); Platt-Trudgian 2021 (PT_BOUND = 0.2)',
};

export const IMP2715_WORST_CASE_EN_HEADROOM_ASSERTIONS = [
  {
    id: 'imp2715-worst-case-clears-PT-numerically',
    description: 'Worst-case-bracketed E(N) at N*=1e4 still clears PT_BOUND=0.2 by >10x',
    holds: () => E_N_WORST < PT_BOUND && PT_BOUND / E_N_WORST > 10,
  },
  {
    id: 'imp2715-worst-case-value',
    description: 'Worst-case E(N) is approx 0.0130972 (E_trunc_pt + E_flow_worst + E_coll_worst)',
    holds: () => Math.abs(E_N_WORST - 0.0130972) < 1e-5,
  },
  {
    // The pessimized budget must be STRICTLY larger than the central capstone
    // value (every bracket inflates, none deflates) yet still clear 0.2 -- this
    // is the substance of the robustness claim. Both compared at full float64.
    id: 'imp2715-worst-exceeds-central-but-clears',
    description: 'Worst-case E(N) strictly exceeds the central reading yet still clears 0.2',
    holds: () => E_N_WORST > E_N_CENTRAL && E_N_WORST < PT_BOUND,
  },
  {
    // The whole robustness verdict rests on E_coll dominating: its worst-case
    // bracket inflates it by only ~1.6% (C_H 0.125 -> 0.127), so the ~15x margin
    // cannot be eaten by constant uncertainty. Re-derive the inflation live.
    id: 'imp2715-ecoll-dominates-and-inflation-tiny',
    description: 'E_coll dominates the worst-case budget and its bracket inflation is small (~1.6%)',
    holds: () =>
      E_COLL_WORST / E_N_WORST > 0.88 &&
      Math.abs(E_COLL_INFLATION - 1.016) < 1e-3,
  },
  {
    // Gronwall amplification at the worst-case C_G = 10 stays below 1.003 on the
    // A1 |t_c| trap -- the E_flow bracket is non-binding (imp-2644 territory).
    id: 'imp2715-gronwall-worst-non-binding',
    description: 'Worst-case Gronwall factor (C_G=10 on |t_c|<=2.37e-4) is <= 1.003, so E_flow bracket is non-binding',
    holds: () => GRONWALL_WORST > 1 && GRONWALL_WORST < 1.003,
  },
  {
    // Upgrade of the point check: the OUTWARD-ROUNDED upper endpoint of E(N)_worst
    // (Interval arithmetic, same worst-case constants) still clears PT_BOUND by >10x,
    // and is a genuine bracket enclosing the point sum -- so the ~15x margin is robust
    // to rounding, not just point-evaluation. Re-derived live from the Interval bracket.
    id: 'imp2715-worst-case-outward-bracket-clears-PT',
    description: 'Outward-rounded Interval UPPER bracket of E(N)_worst clears PT_BOUND=0.2 by >10x and encloses the point sum',
    holds: () =>
      Number.isFinite(E_N_WORST_HI) &&
      E_N_WORST_I.lo < E_N_WORST_I.hi &&
      E_N_WORST_I.contains(E_N_WORST) &&
      E_N_WORST_HI < PT_BOUND &&
      PT_BOUND / E_N_WORST_HI > 10,
  },
  {
    // ANSATZ-endpoint tripwire: the worst-case C_H = 0.127 must stay explicitly
    // labelled an ANSATZ endpoint, NOT a proven Holder modulus -- preventing the
    // worst-case audit (and its new outward bracket) from being misread as rigorous.
    id: 'imp2715-CH-worst-endpoint-stays-ansatz',
    description: 'Worst-case C_H = 0.127 endpoint stays explicitly labelled an ANSATZ (not a proven Holder modulus)',
    holds: () =>
      C_H_WORST === 0.127 &&
      C_H_WORST_ENDPOINT_KIND === 'ANSATZ' &&
      IMP2715_WORST_CASE_EN_HEADROOM.E_N_worst_bracket.C_H_endpoint_kind === 'ANSATZ' &&
      IMP2715_WORST_CASE_EN_HEADROOM.isRigorous === false &&
      /ansatz endpoint/.test(IMP2715_WORST_CASE_EN_HEADROOM.E_N_worst_bracket.note.toLowerCase()),
  },
  {
    // The honest framing guard: the asymptotic-regime E_trunc bracket SATURATES
    // PT_BOUND at gamma=1e13 (so it is NOT co-additive with the N*=1e4 E_coll),
    // and the audit verdict is explicitly numerical-NOT-rigorous (no false QED).
    id: 'imp2715-asymptotic-bracket-saturates-and-not-rigorous',
    description: 'Asymptotic E_trunc bracket saturates PT_BOUND at gamma=1e13 (not co-additive) and the verdict stays non-rigorous',
    holds: () =>
      Math.abs(E_TRUNC_ASYMPTOTIC - 0.19976) < 1e-3 &&
      E_TRUNC_ASYMPTOTIC < PT_BOUND &&
      IMP2715_WORST_CASE_EN_HEADROOM.isRigorous === false &&
      /NOT rigorous/.test(IMP2715_WORST_CASE_EN_HEADROOM.verdict) &&
      /remains SOTA/.test(IMP2715_WORST_CASE_EN_HEADROOM.verdict),
  },
];

for (const a of IMP2715_WORST_CASE_EN_HEADROOM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2715-worst-case-EN-headroom-audit assertion failed: ${a.id}`);
  }
}
