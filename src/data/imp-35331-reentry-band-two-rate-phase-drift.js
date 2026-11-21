/**
 * @module imp-35331-reentry-band-two-rate-phase-drift
 *
 * imp-35331 (proof, frontier-direction) -- QUANTITATIVE probe of the imp-35243 R2 (single-rate /
 * linearization fidelity) obstruction for the imp-34997/imp-35111 iters-to-floor REENTRY band. imp-35243 R2
 * flags that the ceil argument xArg = log(collapseDist/EPS_FP)/ln(1/r) uses a SINGLE contraction rate r
 * (|dg/dN| at the fixed point, R_CONTRACT ~ 0.0454235, LN_INV_R ~ 3.09173), while imp-34862 already found a
 * TWO-rate law -- so single-rate fidelity is not automatic. This module RECONSTRUCTS xArg under the imp-34862
 * two-rate law, MEASURES its drift-per-decade against the inherited single-rate DRIFT_PER_DECADE ~ 0.0187, and
 * asks the sharp ticket question: does the two-rate map keep the ceil phase inside the fixed off-by-one window
 * (W, 1) across the nominal band [10^27.08, 10^37.17], or move the band off? ASSESSMENT ONLY: it does NOT
 * discharge imp-35243a / R2; the surrogate half stays OPEN; NO QED.
 *
 * THE TWO-RATE CEIL ARGUMENT
 * --------------------------
 * The imp-34862 two-rate law contracts at an early-transient rate r_0 for the first p post-collapse iterates
 * and at the asymptotic rate r for the tail, giving the count k = 1 + ceil(x_two) with
 *      x_two(seed) = p + [ ln(delta_0 / EPS_FP) - p ln(1/r_0) ] / ln(1/r),
 * where delta_0 = collapseDist(seed) and r_0 = (delta_p / delta_0)^(1/p) is the geometric-mean early rate
 * (ratio-fit). Algebraically x_two = x_single + Delta with the pure additive phase offset
 *      Delta(seed) = p ( 1 - ln(1/r_0) / ln(1/r) ),
 * so the two-rate ceil phase is the single-rate phase shifted by Delta. (The imp-34862 EXACT-PEEL variant,
 * peeling m true iterates then modelling the tail, is ALGEBRAICALLY IDENTICAL to the ratio-fit at p = m,
 * since delta_0 r_0^p = delta_p by construction; both are reported and coincide to machine precision.)
 *
 * WHAT IS MEASURED (all live on the inherited imp-3220/imp-3406 double surrogate)
 * ------------------------------------------------------------------------------
 * At the band edges REENTRY (10^27.084691) and EXIT (10^37.167107): the single-rate xArg (which lands exactly
 * on frac = W at reentry and on the integer 12 at exit, reproducing imp-35111), the two-rate x_two for
 * p in {1,2,3}, the offset Delta at each edge, the two-rate ceil phase frac(x_two), the drift-per-decade of
 * each, and the direct off-by-one census (predicted count 1 + ceil vs the bit-identical Picard count) under
 * BOTH parametrizations across the band.
 *
 * THE RESULT: THE TWO-RATE MAP MOVES THE FRAC-WINDOW OFF, BUT THE OFF-BY-ONE CENSUS IS RATE-ROBUST
 * -----------------------------------------------------------------------------------------------
 * Far above the ~3.28e9 fixed point the early transient is SLOWER than the asymptotic rate on BOTH band edges
 * (r_0 ~ 0.0211..0.0372 < r ~ 0.0454, unlike the [1e9,1e12] band where r_0 straddled r), so ln(1/r_0) >
 * ln(1/r) and the offset is NEGATIVE: Delta ~ -0.186 at reentry to -0.258 at exit (p = 1). Two consequences:
 *
 *   (1) FRAC-WINDOW MODEL NOT PRESERVED. The two-rate ceil phase frac(x_two) sits at ~0.666 (reentry) to
 *       ~0.752 (exit) -- ENTIRELY BELOW the window lower edge W ~ 0.8516 -- across the whole nominal band, and
 *       floor(x_two) stays pinned at 11 (no integer crossing). So the two-rate map does NOT keep the phase in
 *       (W, 1): under the two-rate frac-window MODEL the band is moved off. Because Delta drifts DOWNWARD at
 *       ~ -0.0062/decade, it partially cancels the single-rate up-drift: the two-rate drift is only ~0.0085
 *       phase/decade (~58% of the single-rate ~0.01472/decade endpoint average across the band; the inherited
 *       grid constant is ~0.0187). At that slower drift the window (W, 1) would be re-entered only ~22 decades
 *       higher (reentry ~10^48.9, linear-drift extrapolation) and, being slower, span ~17.4 decades rather than
 *       ~10.08 -- so both the POSITION and the WIDTH of the frac-window band are parametrization-dependent.
 *
 *   (2) DIRECT OFF-BY-ONE CENSUS UNCHANGED. Across the band the directly-measured Picard count is 14 and BOTH
 *       the single-rate and the two-rate predicted counts are 13 (resid = predicted - measured = -1 for both):
 *       the ~0.19 phase shift stays WITHIN the same ceil integer (both frac round up to 12, giving 1 + 12 =
 *       13), so the actual off-by-one POPULATION is identical under the two rate models. This is exactly
 *       consistent with imp-34862 (the two-rate law does NOT remove the off-by-one) and localizes the reason:
 *       the off-by-one lives in the TERMINAL ceil against the EPS_FP floor (R1), not in the contraction rate.
 *
 * THE ASSESSMENT VERDICT (bearing on R2)
 * --------------------------------------
 * Single-rate fidelity is NOT automatic for the frac-window band EDGES: swapping the single rate r for the
 * imp-34862 two-rate law relocates the modelled reentry by ~22 decades and widens the band by ~7 decades, so
 * the band POSITION/WIDTH are rate-model artifacts. But the off-by-one CENSUS itself is rate-ROBUST (both
 * parametrizations predict 13 vs a measured 14). So R2 does not, by itself, either establish or refute the
 * band as a feature of the true dynamic -- it relocates the frac-window edges without changing whether the
 * off-by-one exists. That whether-question routes back onto R1 (the terminal-ceil / EPS_FP floor), consistent
 * with the imp-35330 DAG (R1 root; R2 dominated by R1). This SHARPENS imp-35243 R2 with a number: the drift
 * itself changes by ~42% under the two-rate law and the frac-window band moves off the nominal interval. It
 * discharges NOTHING: R2 and imp-35243a stay OPEN.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A quantitative two-rate reconstruction of the imp-34997/imp-35111 reentry-band ceil phase, measured live on
 * the inherited imp-3220/imp-3406 double surrogate, IEEE-754 double precision, point rate estimates (no
 * interval enclosure). It discharges NOTHING: imp-35111a / imp-35174a / imp-35243a (R2) stay OPEN. MEASUREMENT
 * / ASSESSMENT ONLY; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2
 * (imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (enumerates R1-R4; R2 single-rate fidelity)
 * @see imp-34862-iters-to-floor-two-rate-law (the two-rate law reconstructed here; does NOT remove off-by-one)
 * @see imp-35111-off-by-one-reentry-band-width (parent: single-rate frac-window band edges 10^27.08 / 10^37.17)
 * @see imp-35330-reentry-band-fidelity-requirement-dependency (R2 dominated by R1 in the fidelity DAG)
 * @see imp-35332-reentry-band-drift-analytic-derivation (CAVEAT: the 0.0187 grid constant used below as the
 *      single-rate comparison baseline is a LOCAL value at the reentry edge, not an analytic constant -- the
 *      analytic drift decays 0.0186273 -> 0.0118306 across the band and the exact single-rate traversal is the
 *      drift INTEGRAL, not drift-per-decade times decades)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34862/34997/35111/35243)
const EPS_FP = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/34775/34903)
const PENULT = 1.4536413720400559e-16; // imp-34951 quantized penultimate collapse witness (bit-identical)

// The shared imp-34862/imp-35111/imp-35243 fixed-point map g(N) = K log T0(N), reproduced VERBATIM.
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS_FP = iterate(1e9, 200); // ~3280294351.65 (bit-identical to imp-34862/35111/35243)
const gPrimeAtStep = (h) => (g(N_CROSS_FP + h) - g(N_CROSS_FP - h)) / (2 * h);
const R_CONTRACT = Math.abs(gPrimeAtStep(1)); // ~0.0454235 (single asymptotic rate)
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.09173 nats/iterate

// Post-collapse relative distance and the SINGLE-rate ceil argument (imp-35111 VERBATIM).
const collapseDist = (seed) => Math.abs(g(seed) - N_CROSS_FP) / N_CROSS_FP;
const xArgSingle = (seed) => Math.log(collapseDist(seed) / EPS_FP) / LN_INV_R;

// The fixed off-by-one PHASE window (W, 1): width OFFSET, lower edge W (imp-35111 VERBATIM).
const OFFSET = Math.log(EPS_FP / PENULT) / LN_INV_R; // ~0.148408
const WINDOW_LOWER_EDGE = 1 - OFFSET; // W ~ 0.851592

// Inherited band landmarks (imp-35174 double-double certified) and the inherited grid drift constant.
const REENTRY_EXP = 27.084691; // band-on, log10 N (imp-34997/35111/35174)
const EXIT_EXP = 37.167107; // band-off, log10 N (imp-35111/35174)
const DRIFT_PER_DECADE_GRID = 0.0187; // single-rate ceil-phase grid drift (imp-34997/35109); this is the LOCAL
// reentry-edge value, not an analytic constant -- imp-35332 derives DRIFT(N) analytically and shows it decays
// 0.0186273 -> 0.0118306 across the band, so 0.0187 is a comparison baseline here, not the exact drift law.

// The imp-34862 TWO-rate ceil argument: ratio-fit early rate r_0 over the first p post-collapse iterates,
// then x_two = p + [ln(delta_0/EPS_FP) - p ln(1/r_0)]/ln(1/r) = x_single + p(1 - ln(1/r_0)/ln(1/r)).
function fitEarlyRateR0(seed, p) {
  let N = g(seed);
  const d0 = Math.abs(N - N_CROSS_FP) / N_CROSS_FP;
  for (let i = 0; i < p; i++) N = g(N);
  const dp = Math.abs(N - N_CROSS_FP) / N_CROSS_FP;
  return Math.pow(dp / d0, 1 / p);
}
function xArgTwoRate(seed, p) {
  const d0 = collapseDist(seed);
  const r0 = fitEarlyRateR0(seed, p);
  return p + (Math.log(d0 / EPS_FP) - p * Math.log(1 / r0)) / LN_INV_R;
}
// EXACT-PEEL control (algebraically identical to ratio-fit at m = p): peel m true iterates then tail.
function xArgExactPeel(seed, m) {
  let N = g(seed);
  for (let i = 0; i < m; i++) N = g(N);
  const dm = Math.abs(N - N_CROSS_FP) / N_CROSS_FP;
  return m + Math.log(dm / EPS_FP) / LN_INV_R;
}

// Directly-measured Picard count: iterate g until bit-identical to the fixed point (imp-35111 VERBATIM).
function itersToFloorMeasured(seed, cap = 600) {
  let N = seed;
  let k = 0;
  while (k < cap) {
    N = g(N);
    k++;
    if (N === N_CROSS_FP) break;
  }
  return k;
}

const frac = (x) => x - Math.floor(x);
const REENTRY_N = Math.pow(10, REENTRY_EXP);
const EXIT_N = Math.pow(10, EXIT_EXP);
const BAND_DECADES = EXIT_EXP - REENTRY_EXP; // ~10.082

// Single-rate phase at the band edges (reproduces imp-35111: frac = W at reentry, integer 12 at exit).
const X_SINGLE_REENTRY = xArgSingle(REENTRY_N); // ~11.851592 (frac = W)
const X_SINGLE_EXIT = xArgSingle(EXIT_N); // ~12.000000 (frac = 1)
const DRIFT_SINGLE = (X_SINGLE_EXIT - X_SINGLE_REENTRY) / BAND_DECADES; // ~0.014720 endpoint average

// Two-rate phase, drift, and offset at each band edge, for p in {1,2,3}.
function twoRateProfile(p) {
  const xr = xArgTwoRate(REENTRY_N, p);
  const xe = xArgTwoRate(EXIT_N, p);
  return {
    p,
    r0_reentry: +fitEarlyRateR0(REENTRY_N, p).toPrecision(6),
    r0_exit: +fitEarlyRateR0(EXIT_N, p).toPrecision(6),
    xArg_reentry: +xr.toPrecision(8),
    xArg_exit: +xe.toPrecision(8),
    frac_reentry: +frac(xr).toPrecision(6),
    frac_exit: +frac(xe).toPrecision(6),
    floor_reentry: Math.floor(xr),
    floor_exit: Math.floor(xe),
    offset_reentry: +(xr - X_SINGLE_REENTRY).toPrecision(6),
    offset_exit: +(xe - X_SINGLE_EXIT).toPrecision(6),
    drift_per_decade: +((xe - xr) / BAND_DECADES).toPrecision(6),
    // Phase stays strictly below the window lower edge W across the whole band edge-to-edge.
    below_window_across_band: frac(xr) < WINDOW_LOWER_EDGE && frac(xe) < WINDOW_LOWER_EDGE,
  };
}
const TWO_RATE_PROFILES = [twoRateProfile(1), twoRateProfile(2), twoRateProfile(3)];

// Exact-peel coincides with ratio-fit at m = p (algebraic identity) -- report the max discrepancy.
const EXACT_PEEL_MATCHES_RATIO_FIT = Math.max(
  Math.abs(xArgExactPeel(REENTRY_N, 1) - xArgTwoRate(REENTRY_N, 1)),
  Math.abs(xArgExactPeel(EXIT_N, 1) - xArgTwoRate(EXIT_N, 1)),
  Math.abs(xArgExactPeel(REENTRY_N, 2) - xArgTwoRate(REENTRY_N, 2)),
  Math.abs(xArgExactPeel(EXIT_N, 3) - xArgTwoRate(EXIT_N, 3)),
);

// Direct off-by-one census under single vs two-rate predicted count across the band.
const predSingle = (s) => 1 + Math.ceil(xArgSingle(s));
const predTwo = (s, p) => 1 + Math.ceil(xArgTwoRate(s, p));
const CENSUS = [REENTRY_EXP, 30, 33, EXIT_EXP].map((e) => {
  const s = Math.pow(10, e);
  const m = itersToFloorMeasured(s);
  return {
    log10_N: e,
    measured: m,
    pred_single: predSingle(s),
    resid_single: predSingle(s) - m,
    pred_two_p1: predTwo(s, 1),
    resid_two_p1: predTwo(s, 1) - m,
  };
});
const CENSUS_IDENTICAL = CENSUS.every((c) => c.resid_single === -1 && c.resid_two_p1 === -1);

// Linear-drift extrapolation of the two-rate frac-window band (p = 1): where frac re-enters W, and its width.
const P1 = TWO_RATE_PROFILES[0];
const TWO_RATE_REENTRY_EXP_EXTRAP = +(
  REENTRY_EXP + (WINDOW_LOWER_EDGE - P1.frac_reentry) / P1.drift_per_decade
).toPrecision(6); // ~48.85
const TWO_RATE_WIDTH_DECADES_EXTRAP = +(OFFSET / P1.drift_per_decade).toPrecision(6); // ~17.4

export const IMP35331_REENTRY_BAND_TWO_RATE_PHASE_DRIFT = {
  id: 'imp-35331',
  proofSection: 'S-frontier',
  question:
    'imp-35243 R2 flags that the reentry-band ceil argument xArg uses a SINGLE contraction rate r while ' +
    'imp-34862 found a TWO-rate law, so single-rate fidelity is not automatic. Reconstruct xArg under the ' +
    'two-rate law, measure its drift-per-decade against the single-rate ~0.0187, and assess whether the ' +
    'two-rate map keeps the ceil phase inside the off-by-one window (W, 1) across [10^27.08, 10^37.17] or ' +
    'moves the band off. Assessment only on the inherited surrogate; does NOT discharge R2/imp-35243a; NO QED.',
  constants: {
    contraction_rate_r: +R_CONTRACT.toPrecision(6), // ~0.0454235
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.09173
    window_width_offset: +OFFSET.toPrecision(6), // ~0.148408
    window_lower_edge_W: +WINDOW_LOWER_EDGE.toPrecision(6), // ~0.851592
    drift_per_decade_grid_single: DRIFT_PER_DECADE_GRID, // 0.0187 (inherited imp-34997/35109 grid constant)
    drift_per_decade_endpoint_single: +DRIFT_SINGLE.toPrecision(6), // ~0.014720 (edge-to-edge average)
  },
  single_rate_band_edges: {
    xArg_reentry: +X_SINGLE_REENTRY.toPrecision(8), // ~11.851592 (frac = W, reproduces imp-35111)
    xArg_exit: +X_SINGLE_EXIT.toPrecision(8), // ~12.000000 (integer 12, exit)
    frac_reentry: +frac(X_SINGLE_REENTRY).toPrecision(6), // ~0.851592 = W
    frac_exit: +frac(X_SINGLE_EXIT).toPrecision(6), // ~0.000000 (wraps at the integer)
  },
  two_rate_profiles: TWO_RATE_PROFILES, // ratio-fit p in {1,2,3}: r0, xArg, frac, floor, offset, drift
  exact_peel_matches_ratio_fit_max_abs: +EXACT_PEEL_MATCHES_RATIO_FIT.toPrecision(3), // ~0 (algebraic identity)
  direct_census: CENSUS, // resid = pred - measured across the band, single vs two-rate
  census_identical_off_by_one: CENSUS_IDENTICAL, // true: both predict 13 vs measured 14 (resid -1) everywhere
  two_rate_frac_window_extrapolation: {
    reentry_exp_extrap: TWO_RATE_REENTRY_EXP_EXTRAP, // ~48.85 (~22 decades above the single-rate 27.08)
    width_decades_extrap: TWO_RATE_WIDTH_DECADES_EXTRAP, // ~17.4 (vs single-rate ~10.08)
    note: 'Linear-drift extrapolation of where the two-rate phase re-enters W and its window width; the ' +
      'two-rate frac-window band is relocated ~22 decades up and ~7 decades wider than the single-rate band.',
  },
  band_survives_frac_window:
    'NO -- across the whole nominal band [10^27.08, 10^37.17] the two-rate ceil phase frac(x_two) sits at ' +
    '~0.666..0.752, entirely BELOW the window lower edge W ~ 0.8516, with floor(x_two) pinned at 11. So the ' +
    'two-rate map does NOT keep the phase inside (W, 1): under the two-rate frac-window MODEL the band is ' +
    'MOVED OFF the nominal interval (re-entered only ~22 decades higher, ~17 decades wide).',
  band_survives_direct_census:
    'YES -- the directly-measured Picard count is 14 across the band and BOTH the single-rate and two-rate ' +
    'predicted counts are 13 (resid = -1 for both): the ~0.19 phase shift stays within the same ceil integer, ' +
    'so the actual off-by-one POPULATION is identical under the two rate models. Consistent with imp-34862 ' +
    '(the two-rate law does not remove the off-by-one); the off-by-one lives in the TERMINAL ceil, not the rate.',
  finding:
    'Quantitative two-rate reconstruction of the imp-34997/imp-35111 reentry-band ceil phase. Far above the ' +
    '~3.28e9 fixed point the imp-34862 early-transient rate r_0 is SLOWER than the asymptotic r on both band ' +
    'edges (r_0 ~ 0.0211..0.0372 < r ~ 0.0454, unlike the [1e9,1e12] band where it straddled r), giving a ' +
    'NEGATIVE additive phase offset Delta = p(1 - ln(1/r_0)/ln(1/r)) ~ -0.186 (reentry) to -0.258 (exit) at ' +
    'p = 1 (p = 2,3 and the algebraically-identical exact-peel agree). Two consequences. (1) The two-rate ' +
    'ceil phase frac(x_two) sits at ~0.666..0.752, entirely BELOW the window lower edge W ~ 0.8516 across the ' +
    'whole band, floor pinned at 11 -- the two-rate map does NOT keep the phase in (W, 1); the frac-window ' +
    'band is moved off. Delta drifts down ~ -0.0062/decade, cutting the two-rate drift to ~0.0085 phase/decade ' +
    '(~58% of the single-rate ~0.01472/decade endpoint average; grid constant ~0.0187), so the window would be ' +
    're-entered ~22 decades higher (~10^48.9) and span ~17.4 decades not ~10.08 -- the frac-window band POSITION ' +
    'and WIDTH are parametrization-dependent. (2) But the direct off-by-one CENSUS is unchanged: measured 14, ' +
    'both parametrizations predict 13 (resid -1) everywhere, since the shift stays within one ceil integer. So ' +
    'R2 relocates the frac-window EDGES (single-rate fidelity is NOT automatic for the band position/width) ' +
    'without changing WHETHER the off-by-one exists -- that whether-question routes back onto R1 (terminal ceil ' +
    '/ EPS_FP floor), per the imp-35330 DAG. Sharpens imp-35243 R2 with a number; discharges nothing.',
  residual_sub_gap:
    'R2 / imp-35243a stay OPEN. This module quantifies R2 (the frac-window band edges move ~22 decades and the ' +
    'drift changes ~42% under the two-rate law) but does NOT certify which rate model is faithful to the true ' +
    'dynamic at ~10^37, nor does it discharge R1/R3/R4. It inherits, and does not discharge, imp-35111a / ' +
    'imp-35174a / imp-34997a / imp-35243a.',
  isRigorous: false,
  verdict:
    'ASSESSMENT (proof, frontier-direction, NOT an RH bound). Reconstructing the imp-34997/imp-35111 ' +
    'reentry-band ceil argument xArg under the imp-34862 TWO-rate law: the early-transient rate is slower ' +
    'than the asymptotic r on both band edges, giving a negative phase offset ~ -0.19 to -0.26 and a two-rate ' +
    'drift ~0.0085 phase/decade (~58% of the single-rate ~0.01472/decade endpoint average, grid ~0.0187). ' +
    'Across the whole nominal band [10^27.08, 10^37.17] the two-rate phase frac(x_two) ~ 0.666..0.752 sits ' +
    'ENTIRELY BELOW the window lower edge W ~ 0.8516 (floor pinned 11), so the two-rate map does NOT keep the ' +
    'phase inside (W, 1) -- the frac-window band is MOVED OFF (re-entered ~22 decades higher, ~17 decades ' +
    'wide). BUT the direct off-by-one census is rate-ROBUST: measured 14, both parametrizations predict 13 ' +
    '(resid -1) everywhere, the shift staying within one ceil integer, consistent with imp-34862 (two-rate ' +
    'does not remove the off-by-one). So R2 relocates the frac-window edges without changing whether the ' +
    'off-by-one exists; that routes back onto R1 per the imp-35330 DAG. This SHARPENS imp-35243 R2 with a ' +
    'number but discharges NOTHING: R2 / imp-35243a stay OPEN. MEASUREMENT / ASSESSMENT ONLY on the inherited ' +
    'imp-3220/imp-3406 double surrogate, IEEE-754 double precision, point rate estimates; the C_C = (1/8) ' +
    'sqrt(3 pi) ansatz (imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 ' +
    'K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes no operator ' +
    'positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35243 (enumerates R1-R4; R2 single-rate fidelity, the requirement probed here); imp-34862 (the ' +
    'two-rate law reconstructed here; does NOT remove the off-by-one); imp-35111 (single-rate frac-window ' +
    'band edges 10^27.08 / 10^37.17); imp-35330 (R2 dominated by R1 in the fidelity DAG); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse); imp-2642 (C_C ansatz).',
};

export const IMP35331_REENTRY_BAND_TWO_RATE_PHASE_DRIFT_ASSERTIONS = [
  {
    // The single-rate surrogate reproduces the imp-35111 band edges: frac = W at reentry, integer 12 at exit.
    id: 'imp35331-single-rate-reproduces-imp35111-edges',
    description: 'single-rate xArg lands on frac = W ~ 0.8516 at reentry and on the integer 12 at exit',
    holds: () =>
      Math.abs(frac(X_SINGLE_REENTRY) - WINDOW_LOWER_EDGE) < 1e-4 &&
      Math.abs(X_SINGLE_EXIT - 12) < 1e-4 &&
      Math.abs(R_CONTRACT - 0.0454235) < 1e-5 &&
      Math.abs(LN_INV_R - 3.09173) < 1e-3,
  },
  {
    // The two-rate ceil phase sits BELOW the window across the whole band for every p (band moved off).
    id: 'imp35331-two-rate-phase-below-window',
    description: 'two-rate frac(x_two) is below W ~ 0.8516 at both band edges for p in {1,2,3}, floor pinned 11',
    holds: () =>
      TWO_RATE_PROFILES.every(
        (t) =>
          t.below_window_across_band === true &&
          t.frac_reentry < WINDOW_LOWER_EDGE &&
          t.frac_exit < WINDOW_LOWER_EDGE &&
          t.floor_reentry === 11 &&
          t.floor_exit === 11,
      ),
  },
  {
    // The two-rate drift is strictly SMALLER than the single-rate drift (the offset drifts down and cancels).
    id: 'imp35331-two-rate-drift-smaller',
    description: 'two-rate drift/decade (~0.0085) is positive but well below the single-rate endpoint drift (~0.01472)',
    holds: () =>
      TWO_RATE_PROFILES.every(
        (t) => t.drift_per_decade > 0 && t.drift_per_decade < DRIFT_SINGLE,
      ) &&
      Math.abs(TWO_RATE_PROFILES[0].drift_per_decade - 0.008536) < 1e-4 &&
      DRIFT_SINGLE < DRIFT_PER_DECADE_GRID,
  },
  {
    // The early-transient rate is slower than the asymptotic rate on both band edges (negative offset).
    id: 'imp35331-early-rate-slower-negative-offset',
    description: 'r0 < r on both edges so the two-rate phase offset is negative (~ -0.19 to -0.26 at p=1)',
    holds: () =>
      TWO_RATE_PROFILES.every((t) => t.r0_reentry < R_CONTRACT && t.r0_exit < R_CONTRACT) &&
      TWO_RATE_PROFILES[0].offset_reentry < 0 &&
      TWO_RATE_PROFILES[0].offset_exit < TWO_RATE_PROFILES[0].offset_reentry &&
      Math.abs(TWO_RATE_PROFILES[0].offset_reentry - -0.185818) < 1e-3,
  },
  {
    // The direct off-by-one census is identical under single and two-rate (both predict 13 vs measured 14).
    id: 'imp35331-direct-census-rate-robust',
    description: 'measured 14, both single-rate and two-rate predict 13 (resid -1) across the band',
    holds: () =>
      CENSUS_IDENTICAL === true &&
      CENSUS.every((c) => c.measured === 14 && c.pred_single === 13 && c.pred_two_p1 === 13),
  },
  {
    // Exact-peel and ratio-fit coincide (algebraic identity) -- the two imp-34862 parametrizations agree.
    id: 'imp35331-exact-peel-equals-ratio-fit',
    description: 'exact-peel and ratio-fit two-rate xArg agree to machine precision (delta_0 r0^p = delta_p)',
    holds: () => EXACT_PEEL_MATCHES_RATIO_FIT < 1e-9,
  },
  {
    // Honesty gate: assessment only, discharges nothing, no QED, no refereed bound is changed, sub-gap stays OPEN.
    id: 'imp35331-honesty-gate-no-qed',
    description: 'Assessment only: isRigorous false, R2/imp-35243a OPEN, no QED, no refereed bound is changed',
    holds: () =>
      IMP35331_REENTRY_BAND_TWO_RATE_PHASE_DRIFT.isRigorous === false &&
      /NO QED/.test(IMP35331_REENTRY_BAND_TWO_RATE_PHASE_DRIFT.verdict) &&
      /refereed bound is changed/i.test(IMP35331_REENTRY_BAND_TWO_RATE_PHASE_DRIFT.verdict) &&
      /imp-35243a/.test(IMP35331_REENTRY_BAND_TWO_RATE_PHASE_DRIFT.residual_sub_gap) &&
      /stay OPEN/.test(IMP35331_REENTRY_BAND_TWO_RATE_PHASE_DRIFT.residual_sub_gap),
  },
];

for (const a of IMP35331_REENTRY_BAND_TWO_RATE_PHASE_DRIFT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35331-reentry-band-two-rate-phase-drift assertion failed: ${a.id}`);
  }
}
