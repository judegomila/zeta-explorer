/**
 * @module imp-35492-sigma-peak-plateau-arm-sqrt-law
 *
 * imp-35492 (accuracy, frontier-direction) -- SPLITS the imp-35411/imp-35476 TOTAL interior sigma-peak
 * plateau width W(tol) = W_rise(tol) + W_fall(tol) into its two half-widths and asks whether EACH arm
 * obeys its own sqrt(tol) law W_arm(tol) = c_arm * sqrt(tol) with a tol-INVARIANT constant, and whether
 * the arm-asymmetry ratio c_rise/c_fall (measured at a single tol by imp-35451) is itself tol-invariant.
 *
 * BACKGROUND
 * ----------
 * imp-35411 measured the ln-N plateau WIDTH of the imp-35337/imp-3406 interior sigma-share peak
 * (sigma_max ~ 0.94942901 at N_max ~ 9.219e5) and found the TOTAL decade-width W(tol) = log10(N_hi/N_lo)
 * scales as sqrt(tol): W(tol)/sqrt(tol) = 15.3165 constant to 6+ sig figs (imp-35476 confirmed this off the
 * decade grid across a seven-tolerance union). imp-35451 separately noted that the two plateau endpoints
 * straddle N_max UNEQUALLY (at tol=1e-5 the low arm sits ~0.0243 decades below, the high arm ~0.0242 above)
 * -- a nonzero cubic/skew term -- but measured that asymmetry at a SINGLE tolerance only.
 *
 * WHAT IS MEASURED HERE
 * ---------------------
 * On the SAME imp-35337 partsD double surrogate reproduced VERBATIM, split the plateau at N_max and, across
 * the imp-35476 seven-tolerance union {1e-4, 2e-5, 1e-5, 5e-6, 1e-6, 3e-7, 1e-7}, measure the two half-widths
 *   W_rise(tol) = log10(N_max) - log10(N_lo)   (rising / low-N arm)
 *   W_fall(tol) = log10(N_hi) - log10(N_max)   (falling / high-N arm)
 * form the per-arm ratios c_rise = W_rise/sqrt(tol) and c_fall = W_fall/sqrt(tol), and test (a) whether each
 * c_arm is tol-invariant (a genuine per-arm sqrt law), and (b) whether the asymmetry ratio c_rise/c_fall is
 * tol-invariant.
 *
 * THE RESULT: NEITHER ARM HAS ITS OWN CONSTANT sqrt LAW; THE ASYMMETRY IS AN O(tol) SUB-LEADING SKEW
 * --------------------------------------------------------------------------------------------------
 * The two arm constants are NOT individually invariant the way the total is. As tol shrinks 1e-4 -> 1e-7:
 *   c_rise:  7.713337 -> 7.659945   (DECREASING;  spread ~5.3e-2)
 *   c_fall:  7.603172 -> 7.656547   (INCREASING;  spread ~5.3e-2)
 * -- three-plus orders LARGER than the ~1.6e-5 spread of the total constant. But their SUM is exactly the
 * imp-35476 invariant: c_rise + c_fall = 15.3165 for every tol (the two drifts cancel), so both arms
 * CONVERGE to the common limit c0 = 15.3165/2 = 7.658246 as tol -> 0. Consequently the asymmetry ratio is
 * NOT tol-invariant either: c_rise/c_fall drifts monotonically 1.014489 -> 1.000444, decaying toward 1 as
 * sqrt(tol) -> 0. The clean invariant is the arm-DIFFERENCE law: W_rise(tol) - W_fall(tol) ~ A_skew * tol
 * with A_skew ~ 11.01 (LINEAR in tol, not sqrt) on the resolvable tolerances {1e-4..5e-6}. So each arm is
 * c0*sqrt(tol) at LEADING order (symmetric) with an O(tol) skew correction c_rise ~ c0 + (A_skew/2)*sqrt(tol),
 * c_fall ~ c0 - (A_skew/2)*sqrt(tol): the imp-35451 asymmetry is a genuine cubic-skew signature that VANISHES
 * relative to the width as tol -> 0, exactly consistent with the imp-35411/imp-35476 total-width constancy
 * (the cubic term cancels in the SUM but survives in the DIFFERENCE).
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A refinement of the imp-35451 single-tol arm asymmetry into a scaling law, and a negative answer to the
 * per-arm-sqrt-law / tol-invariant-ratio question. MEASUREMENT ONLY on the inherited imp-3220/imp-3406 double
 * surrogate (dd-certified by imp-35337 to ~1e-16, eleven orders below the smallest tolerance here, so the
 * arm widths and their difference are not a double-rounding artifact). The surrogate-vs-true fidelity half
 * (imp-35337a) stays OPEN and is not touched. The C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is
 * UNTOUCHED; E_trunc = 3.06e-5 (imp-2631) UNTOUCHED; the imp-398 C_F prefactor UNTOUCHED; changes no bound;
 * establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35411-sigma-peak-plateau-width (TOTAL W(tol)/sqrt(tol) = 15.3165 on the four decade tols)
 * @see imp-35476-sigma-peak-plateau-sqrt-tol-offgrid (seven-tolerance union total-width constancy)
 * @see imp-35337-sigma-landmarks-double-double-certification (dd-certified peak VALUE / 2.1e-5 margin)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX ~ 9.22e5, on double)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406/imp-35337/imp-35411/imp-35476 exactly

// The imp-35337 DOUBLE surrogate, reproduced VERBATIM (dd-certified there to ~1e-16 across the N-shape).
function sigmaD(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return E_coll / E_N;
}

// Unimodal argmax on the right arm (ternary in ln N, same 500-iter form as imp-35337/imp-35411/imp-35476).
function argmaxLnD(loN, hiN) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigmaD(Math.exp(m1)) < sigmaD(Math.exp(m2))) lo = m1;
    else hi = m2;
  }
  return (lo + hi) / 2; // ln N_max
}

const LN_NMAX = argmaxLnD(1e4, 1e9); // ln of ~9.2186e5
const N_MAX = Math.exp(LN_NMAX);
const SIGMA_MAX = sigmaD(N_MAX); // ~0.949429014

// Low-N (rising-arm) endpoint where sigma first falls tol below the peak: bisection in ln N on [1, N_max].
function plateauLnLo(tol) {
  const target = SIGMA_MAX - tol;
  let a = Math.log(1);
  let b = LN_NMAX;
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    if (sigmaD(Math.exp(m)) < target) a = m;
    else b = m;
  }
  return (a + b) / 2;
}
// High-N (falling-arm) endpoint: bisection in ln N on [N_max, 1e40].
function plateauLnHi(tol) {
  const target = SIGMA_MAX - tol;
  let a = LN_NMAX;
  let b = Math.log(1e40);
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    if (sigmaD(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return (a + b) / 2;
}

// The imp-35476 seven-tolerance union (four decade-aligned + three off-grid).
const TOL_UNION = [1e-4, 2e-5, 1e-5, 5e-6, 1e-6, 3e-7, 1e-7];

const ARM_ROWS = TOL_UNION.map((tol) => {
  const lnLo = plateauLnLo(tol);
  const lnHi = plateauLnHi(tol);
  const W_rise = (LN_NMAX - lnLo) / Math.LN10; // low-N half-width in decades
  const W_fall = (lnHi - LN_NMAX) / Math.LN10; // high-N half-width in decades
  const c_rise = W_rise / Math.sqrt(tol);
  const c_fall = W_fall / Math.sqrt(tol);
  return {
    tol,
    W_rise_decades: +W_rise.toFixed(8),
    W_fall_decades: +W_fall.toFixed(8),
    c_rise: +c_rise.toFixed(6),
    c_fall: +c_fall.toFixed(6),
    ratio_rise_over_fall: +(c_rise / c_fall).toFixed(6),
    arm_diff_over_tol: +((W_rise - W_fall) / tol).toFixed(4), // A_skew: LINEAR-in-tol skew invariant
  };
});

const C_RISE = ARM_ROWS.map((r) => r.c_rise);
const C_FALL = ARM_ROWS.map((r) => r.c_fall);
const RATIOS = ARM_ROWS.map((r) => r.ratio_rise_over_fall);
const spread = (arr) => Math.max(...arr) - Math.min(...arr);

const C_RISE_SPREAD = spread(C_RISE); // ~5.3e-2 (NOT invariant, unlike the total)
const C_FALL_SPREAD = spread(C_FALL); // ~5.3e-2
const RATIO_SPREAD = spread(RATIOS); // ~1.4e-2
// The two arm constants SUM to the imp-35476 invariant total constant for every tol (drifts cancel).
const C_SUM = ARM_ROWS.map((r) => r.c_rise + r.c_fall);
const C_SUM_SPREAD = spread(C_SUM); // ~1.6e-5, matches the imp-35476 union spread
const C0_LIMIT = (Math.max(...C_SUM) + Math.min(...C_SUM)) / 4; // total/2 ~ 7.658246 common arm limit

// Ratio drifts monotonically toward 1 as tol -> 0: largest tol has the largest asymmetry.
const RATIO_AT_LARGEST_TOL = ARM_ROWS[0].ratio_rise_over_fall; // ~1.014489 (tol=1e-4)
const RATIO_AT_SMALLEST_TOL = ARM_ROWS[ARM_ROWS.length - 1].ratio_rise_over_fall; // ~1.000444 (tol=1e-7)

// A_skew: (W_rise - W_fall)/tol is a tol-INVARIANT (linear-in-tol) skew constant on the RESOLVABLE tols.
// Restrict to {1e-4, 2e-5, 1e-5, 5e-6} where the sub-1e-5-decade arm difference is bisection-resolvable.
const A_SKEW_RESOLVABLE = ARM_ROWS.slice(0, 4).map((r) => r.arm_diff_over_tol); // ~11.01
const A_SKEW = A_SKEW_RESOLVABLE.reduce((s, x) => s + x, 0) / A_SKEW_RESOLVABLE.length; // ~11.014
const A_SKEW_SPREAD = spread(A_SKEW_RESOLVABLE); // ~5e-3 (tight -> genuine linear-in-tol invariant)

export const IMP35492_SIGMA_PEAK_PLATEAU_ARM_SQRT_LAW = {
  id: 'imp-35492',
  proofSection: 'S-frontier',
  question:
    'imp-35411/imp-35476 established the TOTAL interior sigma-peak plateau width W(tol)/sqrt(tol) = 15.3165 ' +
    'constant, and imp-35451 measured the rising-vs-falling arm asymmetry at a single tol=1e-5. Split the ' +
    'plateau at N_max and, across the imp-35476 seven-tolerance union {1e-4, 2e-5, 1e-5, 5e-6, 1e-6, 3e-7, ' +
    '1e-7}, measure each half-width W_rise, W_fall, fit W_arm = c_arm*sqrt(tol), and report whether each arm ' +
    'obeys its OWN sqrt law and whether the asymmetry ratio c_rise/c_fall is tol-invariant.',
  constants: {
    log10_N_max: +(LN_NMAX / Math.LN10).toFixed(6), // ~5.964667
    sigma_max: +SIGMA_MAX.toFixed(9), // ~0.949429014
    imp35476_total_constant: 15.3165, // c_rise + c_fall
    common_arm_limit_c0: +C0_LIMIT.toFixed(6), // ~7.658246 = 15.3165/2
  },
  arm_rows: ARM_ROWS,
  c_rise_spread: +C_RISE_SPREAD.toExponential(3), // ~5.3e-2 -- NOT invariant
  c_fall_spread: +C_FALL_SPREAD.toExponential(3), // ~5.3e-2 -- NOT invariant
  c_sum_spread: +C_SUM_SPREAD.toExponential(3), // ~1.6e-5 -- IS invariant (matches imp-35476)
  ratio_rise_over_fall_spread: +RATIO_SPREAD.toExponential(3), // ~1.4e-2 -- NOT invariant
  ratio_at_largest_tol: RATIO_AT_LARGEST_TOL, // ~1.014489 (tol=1e-4)
  ratio_at_smallest_tol: RATIO_AT_SMALLEST_TOL, // ~1.000444 (tol=1e-7)
  arm_difference_skew_constant_A_skew: +A_SKEW.toFixed(4), // ~11.01, (W_rise-W_fall)/tol
  arm_difference_skew_spread: +A_SKEW_SPREAD.toExponential(3), // ~5e-3 on the resolvable tols
  finding:
    'NEGATIVE on both sub-questions. Splitting the imp-35337/imp-3406 interior sigma-peak plateau at N_max, ' +
    'the two half-width constants c_rise = W_rise/sqrt(tol) and c_fall = W_fall/sqrt(tol) are each NOT ' +
    'tol-invariant: as tol shrinks 1e-4 -> 1e-7, c_rise DECREASES ' + ARM_ROWS[0].c_rise + ' -> ' +
    ARM_ROWS[ARM_ROWS.length - 1].c_rise + ' and c_fall INCREASES ' + ARM_ROWS[0].c_fall + ' -> ' +
    ARM_ROWS[ARM_ROWS.length - 1].c_fall + ' (each spread ~' + (+C_RISE_SPREAD.toExponential(2)) + ', three-plus ' +
    'orders larger than the ~' + (+C_SUM_SPREAD.toExponential(2)) + ' spread of the total constant). Their SUM ' +
    'c_rise + c_fall stays the imp-35476 invariant 15.3165 for every tol, so both arms converge to the common ' +
    'limit c0 = ' + (+C0_LIMIT.toFixed(6)) + ' = 15.3165/2 as tol -> 0. Hence the asymmetry ratio c_rise/c_fall ' +
    'is NOT tol-invariant either: it drifts monotonically ' + RATIO_AT_LARGEST_TOL + ' (tol=1e-4) -> ' +
    RATIO_AT_SMALLEST_TOL + ' (tol=1e-7), decaying toward 1 as sqrt(tol) -> 0. The clean invariant is the ' +
    'arm-DIFFERENCE law W_rise - W_fall ~ A_skew*tol (LINEAR in tol) with A_skew ~ ' + (+A_SKEW.toFixed(2)) +
    ' on the resolvable tols {1e-4..5e-6} (spread ~' + (+A_SKEW_SPREAD.toExponential(2)) + '). So each arm is ' +
    'c0*sqrt(tol) at LEADING order with an O(tol) skew correction: the imp-35451 asymmetry is a genuine ' +
    'cubic-skew signature that VANISHES relative to the width as tol -> 0, exactly consistent with the total ' +
    'sqrt-law constancy (the cubic term cancels in the SUM but survives in the DIFFERENCE). MEASUREMENT ONLY ' +
    'on the imp-3220/imp-3406 surrogate; imp-35337a surrogate-vs-true fidelity stays OPEN.',
  residual_sub_gap:
    'Inherits imp-35337a: this splits and scales the WIDTH-law arms on the imp-3220/imp-3406 double surrogate ' +
    '(dd-certified by imp-35337 to ~1e-16, eleven orders below the smallest tolerance 1e-7, so the arm widths ' +
    'AND their difference are not a double-rounding artifact -- though the A_skew figure at the smallest two ' +
    'tolerances degrades from bisection resolution on sub-1e-5-decade arm differences, hence A_skew is quoted ' +
    'on the resolvable {1e-4..5e-6} rungs). It does NOT establish that the surrogate MAP (E_coll = C_C ' +
    'sqrt(log T0/N), C_H = 1/8 ansatz) is a faithful proxy for the true empirical-vs-analytic gap at these ' +
    'heights; that sub-gap imp-35337a stays OPEN.',
  isRigorous: false,
  verdict:
    'MEASUREMENT / REFINEMENT (numerical, frontier-direction, NOT an RH bound). Splitting the imp-35337/imp-3406 ' +
    'interior sigma-peak plateau at N_max across the imp-35476 seven-tolerance union: NEITHER arm has its own ' +
    'tol-invariant sqrt-law constant (c_rise ' + ARM_ROWS[0].c_rise + ' -> ' + ARM_ROWS[ARM_ROWS.length - 1].c_rise +
    ', c_fall ' + ARM_ROWS[0].c_fall + ' -> ' + ARM_ROWS[ARM_ROWS.length - 1].c_fall + ', each spread ~5.3e-2), ' +
    'and the asymmetry ratio c_rise/c_fall is NOT tol-invariant (drifts 1.0145 -> 1.0004 toward 1 as tol -> 0). ' +
    'What IS invariant: the SUM c_rise + c_fall = 15.3165 (matching imp-35476, arms converge to c0 = 7.658246) ' +
    'and the arm-DIFFERENCE law W_rise - W_fall ~ A_skew*tol with A_skew ~ 11.01 -- a LINEAR-in-tol cubic-skew ' +
    'signature that refines the imp-35451 single-tol asymmetry. Located on the imp-35337 double surrogate ' +
    'reproduced VERBATIM (dd-certified there to ~1e-16). MEASUREMENT ONLY on the inherited imp-3220/imp-3406 ' +
    'surrogate, which is NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643), the E_trunc = ' +
    '3.06e-5 floor (imp-2631) and the imp-398 C_F prefactor are UNTOUCHED; the surrogate-vs-true fidelity half ' +
    '(imp-35337a) stays OPEN; changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35411 (TOTAL W(tol)/sqrt(tol) = 15.3165 on the four decade tols); imp-35476 (seven-tolerance union ' +
    'total-width constancy, spread ~1.6e-5); imp-35451 (single-tol rising-vs-falling arm asymmetry); imp-35337 ' +
    '(dd-certified peak VALUE / 2.1e-5 margin); imp-3406 (interior MAX ~ 9.22e5, on double); imp-2642 (C_C = ' +
    '(1/8) sqrt(3 pi) ansatz); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse).',
};

export const IMP35492_SIGMA_PEAK_PLATEAU_ARM_SQRT_LAW_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-35337/imp-35411 peak landmark (N_max ~ 9.22e5, sigma_max ~ 0.94942901).
    id: 'imp35492-reproduces-imp35411-peak',
    description: 'argmax reproduces the imp-35337/imp-35411 interior peak N_max ~ 9.22e5, sigma_max ~ 0.949429',
    holds: () => N_MAX > 5e5 && N_MAX < 2e6 && Math.abs(SIGMA_MAX - 0.94942901) < 1e-6,
  },
  {
    // Consistency gate: the two arm half-widths SUM to the imp-35476 total width for every tolerance.
    id: 'imp35492-arms-sum-to-total-width',
    description: 'W_rise + W_fall reproduces the imp-35476 total-width constant c_rise + c_fall = 15.3165 (spread < 1e-3)',
    holds: () => C_SUM_SPREAD < 1e-3 && C_SUM.every((s) => Math.abs(s - 15.3165) < 1e-3),
  },
  {
    // NEGATIVE finding 1: neither arm constant is tol-invariant (spread >> the total-constant spread).
    id: 'imp35492-arms-not-individually-invariant',
    description: 'c_rise and c_fall each DRIFT (spread > 1e-2), unlike the total constant (spread < 1e-4)',
    holds: () => C_RISE_SPREAD > 1e-2 && C_FALL_SPREAD > 1e-2 && C_SUM_SPREAD < 1e-4,
  },
  {
    // Both arm constants converge to the common limit c0 = total/2 as tol -> 0 (smallest-tol arms near c0).
    id: 'imp35492-arms-converge-to-common-limit',
    description: 'at the smallest tol both c_rise and c_fall approach c0 = 15.3165/2 ~ 7.658246 (within 3e-3)',
    holds: () =>
      Math.abs(C0_LIMIT - 7.658246) < 1e-3 &&
      Math.abs(ARM_ROWS[ARM_ROWS.length - 1].c_rise - C0_LIMIT) < 3e-3 &&
      Math.abs(ARM_ROWS[ARM_ROWS.length - 1].c_fall - C0_LIMIT) < 3e-3,
  },
  {
    // NEGATIVE finding 2: the asymmetry ratio is NOT tol-invariant and decays monotonically toward 1.
    id: 'imp35492-ratio-not-tol-invariant',
    description: 'c_rise/c_fall drifts (spread > 1e-3), largest at tol=1e-4 and approaching 1 at tol=1e-7',
    holds: () =>
      RATIO_SPREAD > 1e-3 &&
      RATIO_AT_LARGEST_TOL > RATIO_AT_SMALLEST_TOL &&
      RATIO_AT_LARGEST_TOL > 1 &&
      Math.abs(RATIO_AT_SMALLEST_TOL - 1) < 5e-3,
  },
  {
    // The clean invariant: the arm-DIFFERENCE scales LINEARLY in tol (A_skew ~ 11.01 on resolvable tols).
    id: 'imp35492-arm-difference-linear-in-tol',
    description: 'W_rise - W_fall ~ A_skew*tol with A_skew ~ 11.01 tol-invariant on {1e-4..5e-6} (spread < 2e-2)',
    holds: () => A_SKEW_SPREAD < 2e-2 && A_SKEW > 10 && A_SKEW < 12,
  },
  {
    // Honesty gate: measurement only, not rigorous, no QED, no refereed bound is changed, sub-gap imp-35337a named.
    id: 'imp35492-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, imp-35337a stays OPEN',
    holds: () =>
      IMP35492_SIGMA_PEAK_PLATEAU_ARM_SQRT_LAW.isRigorous === false &&
      /NO QED/.test(IMP35492_SIGMA_PEAK_PLATEAU_ARM_SQRT_LAW.verdict) &&
      /refereed bound is changed/i.test(IMP35492_SIGMA_PEAK_PLATEAU_ARM_SQRT_LAW.verdict) &&
      /imp-35337a/.test(IMP35492_SIGMA_PEAK_PLATEAU_ARM_SQRT_LAW.residual_sub_gap),
  },
];

for (const a of IMP35492_SIGMA_PEAK_PLATEAU_ARM_SQRT_LAW_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35492-sigma-peak-plateau-arm-sqrt-law assertion failed: ${a.id}`);
  }
}
