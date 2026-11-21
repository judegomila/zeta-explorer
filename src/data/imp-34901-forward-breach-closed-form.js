/**
 * @module imp-34901-forward-breach-closed-form
 *
 * imp-34901 (proof, frontier): imp-34889 MEASURED that the forward route crosses the (H2) margin at step 5
 * band-wide and reduced the crossing to a ratio condition with the fixed bracket half-width delta cancelling. It
 * never wrote the closed-form crossing step or its band-invariance as a lemma. This module DERIVES the exact
 * closed form n_star = ceil(log2(N FP_LO(N) / K)) analytically from the imp-34889 surrogate crossing condition,
 * shows the seed image half-width K delta / FP_LO(N) is T0(N)-INDEPENDENT (the RvM-inverse height cancels),
 * and proves the integer ceil is band-INVARIANT (= 5) across the whole imp-34693 admissible seed band: the
 * right-hand side ~19.9 sits strictly inside the power-of-two window (16, 32] whose logarithm the ceil reads,
 * and the widest k=10 rung moves it only ~+-5.5% -- far too little to cross either integer boundary.
 *
 * A CORRECTION TO THE imp-34889 PROSE (kept honest)
 * -------------------------------------------------
 * The imp-34889 model text wrote the reduced crossing condition as "2^n > (K/FP_LO)/N". That literal ratio is
 * the RECIPROCAL of the true right-hand side: (K/FP_LO)/N ~ 0.05, whereas the ~20 that imp-34889 elsewhere
 * cites is N/(K/FP_LO) = N FP_LO / K ~ 19.9. Re-deriving from the imp-34889 code (below) fixes the direction:
 * the crossing condition is 2^n > N FP_LO(N) / K, so n_star = ceil(log2(N FP_LO(N) / K)). Every downstream
 * imp-34889 number (RHS ~20, crossing step 5, +-5% band move) is unchanged -- only the written ratio is flipped
 * right-way-up here.
 *
 * THE DERIVATION (from the imp-34889 toImageHalfWidth + margin, VERBATIM)
 * ----------------------------------------------------------------------
 * At a band point N the (H2) seed bracket is [T0(N)](1 +/- delta), of T-width 2 delta T0(N). The imp-34889
 * image map is toImageHalfWidth(w_T) = (K (w_T/2)/T0(N))/FP_LO(N), so the SEED image half-width is
 *   toImageHalfWidth(2 delta T0(N)) = (K (delta T0(N))/T0(N))/FP_LO(N) = K delta / FP_LO(N),
 * in which T0(N) CANCELS -- the seed image half-width is T0(N)-independent (only the weak FP_LO(N) drift
 * survives). The forward route doubles the enclosure width per Newton step (interval subtraction adds widths;
 * near the fixed point w(dT) ~ w([T])), so after n steps the image half-width is (K delta / FP_LO) 2^n. The
 * (H2) margin at the band point is delta * N. The band point crosses at the first step whose image half-width
 * exceeds the margin:
 *   (K delta / FP_LO) 2^n > delta N   <=>   (K / FP_LO) 2^n > N   <=>   2^n > N FP_LO / K,
 * the fixed bracket half-width delta CANCELLING entirely. The first integer n satisfying 2^n > R (R not a
 * power of two) is n_star = floor(log2 R) + 1 = ceil(log2 R), giving the CLOSED FORM
 *   n_star(N) = ceil( log2( N FP_LO(N) / K ) ).
 *
 * WHY THE CEIL IS BAND-INVARIANT (= 5), AND HOW MUCH THE BAND WOULD HAVE TO WIDEN TO MOVE IT
 * -----------------------------------------------------------------------------------------
 * n_star = 5 exactly when the right-hand side R(N) = N FP_LO(N) / K lies in the half-open dyadic window
 * (2^4, 2^5] = (16, 32] (then 2^5 = 32 > R >= 16 = 2^4, so the first crossing is at step 5). At the band centre
 * R(N_cross) ~ 19.91 (log2 ~ 4.315), strictly interior to (16, 32] with margin ~19.6% down to 16 (n_star -> 4)
 * and ~60.7% up to 32 (n_star -> 6). Across the widest imp-34693 k=10 rung (rho/N_cross ~ 5.2%) R spans only
 * [18.82, 21.00] -- a rel spread ~10.9%, a worst one-sided move ~5.5% -- because R inherits N's ~+-5.2% swing
 * and FP_LO(N) drifts only ~0.5%. That ~5.5% move is ~3.6x smaller than the ~19.6% headroom to the NEAREST
 * (lower) dyadic boundary, so the integer ceil cannot cross. Quantifying the threshold: the seed band
 * rho(1,k) = (1-L)/[(1-L_c) L^k] widens by 1/L ~ 6.73 per rung, and the lower band edge does not reach R = 16
 * (n_star -> 4) until k = 11 (rho/N_cross ~ 35%) -- a FULL rung, ~6.7x wider than the k=10 band any Picard
 * iteration ever needs. So n_star is pinned at 5 across the entire admissible band with a wide integer margin.
 *
 * WHAT STAYS OPEN
 * --------------
 * DERIVATION ON THE imp-34889 SURROGATE ONLY (inherited imp-3220/imp-3406 crossover map; first-order
 * outward-rounding surrogate, NOT the imp-34687a certified transcendental layer). It formalises the closed-form
 * crossing step and its band-invariance as a lemma but does NOT instantiate the imp-34687a directed-rounding
 * layer and does NOT discharge the conditional. imp-34714a REMAINS OPEN. C_C = (1/8) sqrt(3 pi) ansatz
 * (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched;
 * changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34889-forward-breach-band-uniformity (the band-wide crossing MEASUREMENT this formalises)
 * @see imp-34865-forward-vs-contraction-width-inflation (the single-point N_cross surrogate + image map reused)
 * @see imp-34693-crossover-contraction-seed-band (the admissible seed band rho(1,k) = (1-L)/[(1-L_c) L^k])
 * @see imp-34799-krawczyk-directed-rounding-width-bound (the (H2)-margin ceiling)
 * @see imp-34687 (f monotone+convex => inner interval-Newton is a verified contraction; sub-gap imp-34687a)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the RvM-inverse height whose T0 cancels)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34889_FORWARD_BREACH_BAND_UNIFORMITY } from './imp-34889-forward-breach-band-uniformity.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34889/imp-34865/imp-34799)
const DELTA = 2e-4; // same FIXED relative bracket half-width as imp-34889/imp-34865/imp-34799

// Shared imp-33723/imp-34865 Banach map and its closed-form derivative (VERBATIM from imp-34889).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const gPrime = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // 3.28029435165241e9
const L_CONTRACTION = gPrime(1e9); // ~0.148483 (imp-34693 L, band widens by 1/L per rung)
const L_AT_CROSS = gPrime(N_CROSS); // ~0.045423 (imp-34693 L_c)
// imp-34693 admissible seed-band half-width (VERBATIM): rho(tol,k) = tol (1-L)/[(1-L_c) L^k].
const rho = (tol, k) => (tol * (1 - L_CONTRACTION)) / ((1 - L_AT_CROSS) * Math.pow(L_CONTRACTION, k));

// imp-34889 Krawczyk quotient denominator floor at N (FP_LO) and the derived closed-form crossing step.
const FP_LO = (N) => 1 - Math.abs(gPrime(N * (1 - DELTA)));
const seedImageHalfWidth = (N) => (K_AMPL * DELTA) / FP_LO(N); // = K delta / FP_LO, T0(N)-independent
const breachRHS = (N) => (N * FP_LO(N)) / K_AMPL; // the true 2^n > N FP_LO / K right-hand side
const nStar = (N) => Math.ceil(Math.log2(breachRHS(N))); // closed-form crossing step n_star(N)

// Dyadic window whose logarithm the ceil reads: n_star = 5 iff R in (2^4, 2^5] = (16, 32].
const LOWER_POW2 = 16; // 2^4 (crossing below => n_star -> 4)
const UPPER_POW2 = 32; // 2^5 (crossing above => n_star -> 6)

// --- Band sweep: the closed-form n_star at each imp-34693 rung, plus the widest-rung spread of R ------------
const K_GRID = [0, 5, 10];
const bandTable = K_GRID.map((k) => {
  const r = rho(1, k);
  const lo = N_CROSS - r;
  const hi = N_CROSS + r;
  return {
    k,
    rho_frac_of_N_cross: +(r / N_CROSS).toExponential(3),
    breachRHS_lo: +breachRHS(lo).toFixed(4),
    breachRHS_hi: +breachRHS(hi).toFixed(4),
    n_star_lo: nStar(lo),
    n_star_hi: nStar(hi),
  };
});

const R_CENTER = breachRHS(N_CROSS); // ~19.910
const R10 = rho(1, 10);
const R_LO10 = breachRHS(N_CROSS - R10);
const R_HI10 = breachRHS(N_CROSS + R10);
const RHS_REL_SPREAD_K10 = Math.abs(R_HI10 - R_LO10) / R_CENTER; // ~0.109
const RHS_WORST_MOVE_K10 = Math.max(Math.abs(R_HI10 - R_CENTER), Math.abs(R_LO10 - R_CENTER)) / R_CENTER; // ~0.055
const MARGIN_DOWN = (R_CENTER - LOWER_POW2) / R_CENTER; // ~0.196 headroom to 16 (n_star -> 4)
const MARGIN_UP = (UPPER_POW2 - R_CENTER) / R_CENTER; // ~0.607 headroom to 32 (n_star -> 6)

// The seed image half-width K delta / FP_LO is T0(N)-independent: its band spread is only the FP_LO drift.
const SEED_IMG_REL_SPREAD_K10 =
  Math.abs(seedImageHalfWidth(N_CROSS + R10) - seedImageHalfWidth(N_CROSS - R10)) / seedImageHalfWidth(N_CROSS);

// The first rung whose LOWER band edge drops R to <= 16 (n_star -> 4): quantifies how much wider the band must
// get before the integer ceil can move off 5.
let CRITICAL_K = null;
for (let k = 10; k <= 24; k++) {
  const lo = N_CROSS - rho(1, k);
  if (lo > 0 && nStar(lo) < 5) {
    CRITICAL_K = k;
    break;
  }
}

// n_star is exactly 5 at every sampled band point (the closed form agrees with the imp-34889 measurement).
const N_STAR_BAND_MIN = Math.min(...bandTable.flatMap((r) => [r.n_star_lo, r.n_star_hi]), nStar(N_CROSS));
const N_STAR_BAND_MAX = Math.max(...bandTable.flatMap((r) => [r.n_star_lo, r.n_star_hi]), nStar(N_CROSS));

// Cross-check the derived closed-form step against the published imp-34889 measured crossing step (5).
const BREACH_STEP_PUBLISHED = IMP34889_FORWARD_BREACH_BAND_UNIFORMITY.measured.breach_step_band_min; // 5

export const IMP34901_FORWARD_BREACH_CLOSED_FORM = {
  id: 'imp-34901',
  proofSection: 'S-frontier',
  question:
    'imp-34889 MEASURED the forward-route (H2)-margin crossing at step 5 band-wide and reduced it to a ratio ' +
    'condition with the fixed bracket half-width delta cancelling, but never wrote the closed-form crossing step ' +
    'or its band-invariance as a lemma. Derive the exact closed form n_star = ceil(log2(N FP_LO(N)/K)) from ' +
    'the imp-34889 surrogate crossing condition, show the seed image half-width K delta / FP_LO(N) is ' +
    'T0(N)-independent, and prove the integer ceil is band-invariant (= 5) across the whole imp-34693 ' +
    'admissible seed band -- quantifying how much wider the band must get before the ceil could cross an ' +
    'integer power-of-two boundary. Derivation on the imp-34889 surrogate only; does NOT instantiate the ' +
    'imp-34687a directed-rounding layer; imp-34714a REMAINS OPEN; changes no bound; NO QED.',
  derivation: {
    seedImageHalfWidth:
      'The (H2) seed bracket [T0(N)](1 +/- delta) has T-width 2 delta T0(N); the imp-34889 image map ' +
      'toImageHalfWidth(w_T) = (K (w_T/2)/T0(N))/FP_LO(N) sends it to (K delta T0(N)/T0(N))/FP_LO(N) = ' +
      'K delta / FP_LO(N), in which T0(N) CANCELS -- the seed image half-width is T0(N)-independent (only the ' +
      'weak FP_LO(N) drift survives).',
    breachCondition:
      'Forward doubling gives image half-width (K delta / FP_LO) 2^n after n steps; the (H2) margin is ' +
      'delta * N. Crossing ((K delta/FP_LO) 2^n > delta N) reduces to (K/FP_LO) 2^n > N, i.e. 2^n > N FP_LO/K -- ' +
      'the fixed bracket half-width delta cancels entirely. The first integer n with 2^n > R (R not a power of ' +
      'two) is ceil(log2 R), so n_star(N) = ceil(log2(N FP_LO(N)/K)).',
    correction:
      'The imp-34889 model prose wrote the reduced condition as "2^n > (K/FP_LO)/N", the RECIPROCAL of the ' +
      'true right-hand side ((K/FP_LO)/N ~ 0.05 vs N FP_LO/K ~ 19.9). Re-deriving from the imp-34889 code ' +
      'fixes the direction: the crossing condition is 2^n > N FP_LO(N)/K. All downstream imp-34889 numbers ' +
      '(RHS ~20, crossing step 5, +-5% band move) are unchanged -- only the written ratio is flipped right-way-up.',
    bandInvariance:
      'n_star = 5 iff R = N FP_LO/K lies in the dyadic window (2^4, 2^5] = (16, 32]. At the band centre ' +
      'R ~ 19.91 (log2 ~ 4.315), interior with ~19.6% headroom to 16 (n_star -> 4) and ~60.7% to 32 ' +
      '(n_star -> 6). The widest imp-34693 k=10 rung (rho/N_cross ~ 5.2%) moves R only ~+-5.5% (rel spread ' +
      '~10.9%) -- ~3.6x under the nearest-boundary headroom -- so the integer ceil cannot cross. The lower ' +
      'band edge does not reach R = 16 until k = 11 (rho/N_cross ~ 35%), a full 1/L ~ 6.7x wider rung than any ' +
      'Picard iteration needs.',
  },
  constants: {
    N_cross: +N_CROSS.toPrecision(15), // 3.28029435165241e9
    K: +K_AMPL.toExponential(4), // ~1.5727e8
    delta: +DELTA.toExponential(1), // 2e-4
    FP_LO_center: +FP_LO(N_CROSS).toFixed(6), // ~0.954568
    L_contraction: +L_CONTRACTION.toExponential(6), // ~1.484829e-1 (band widens by 1/L ~ 6.73 per rung)
    lower_pow2: LOWER_POW2, // 16 (2^4)
    upper_pow2: UPPER_POW2, // 32 (2^5)
  },
  closedForm: {
    formula: 'n_star(N) = ceil( log2( N FP_LO(N) / K ) )',
    breach_rhs_center: +R_CENTER.toFixed(6), // ~19.909997
    log2_rhs_center: +Math.log2(R_CENTER).toFixed(6), // ~4.315421
    n_star_center: nStar(N_CROSS), // 5
    seed_image_half_width_center: +seedImageHalfWidth(N_CROSS).toExponential(4), // ~3.295e4 (K delta / FP_LO)
  },
  bandTable, // closed-form n_star and crossing RHS at each imp-34693 rung edge
  measured: {
    n_star_band_min: N_STAR_BAND_MIN, // 5
    n_star_band_max: N_STAR_BAND_MAX, // 5
    breach_rhs_in_dyadic_window: R_CENTER > LOWER_POW2 && R_CENTER <= UPPER_POW2, // true (16 < R <= 32)
    breach_rhs_rel_spread_k10: +RHS_REL_SPREAD_K10.toExponential(3), // ~1.094e-1
    breach_rhs_worst_move_k10: +RHS_WORST_MOVE_K10.toExponential(3), // ~5.47e-2
    margin_down_to_16: +MARGIN_DOWN.toFixed(4), // ~0.1964 (headroom before n_star -> 4)
    margin_up_to_32: +MARGIN_UP.toFixed(4), // ~0.6072 (headroom before n_star -> 6)
    seed_image_half_width_rel_spread_k10: +SEED_IMG_REL_SPREAD_K10.toExponential(3), // ~5e-3 (FP_LO drift only)
    critical_band_rung_for_shift: CRITICAL_K, // 11 (first rung whose lower edge drops n_star off 5)
  },
  crosscheck: {
    closed_form_matches_imp34889_measured: nStar(N_CROSS) === BREACH_STEP_PUBLISHED, // true (both 5)
    breach_step_published_imp34889: BREACH_STEP_PUBLISHED, // 5
  },
  finding:
    'Formalising the imp-34889 surrogate crossing as a lemma: the seed image half-width K delta / FP_LO(N) is ' +
    'T0(N)-INDEPENDENT (the RvM-inverse height cancels in toImageHalfWidth), so the crossing condition ' +
    '(K delta/FP_LO) 2^n > delta N reduces to 2^n > N FP_LO(N)/K (the fixed bracket half-width delta cancels) ' +
    'and the CLOSED-FORM crossing step is n_star(N) = ceil(log2(N FP_LO(N)/K)). This corrects the imp-34889 ' +
    'prose, which wrote the reduced ratio upside-down as (K/FP_LO)/N ~ 0.05; the true right-hand side is ' +
    'N FP_LO/K ~ 19.91, matching the ~20 imp-34889 elsewhere cites. n_star = 5 exactly when that right-hand ' +
    'side lies in the dyadic window (16, 32]; at the band centre it is ~19.91 (log2 ~ 4.315), with ~19.6% ' +
    'headroom to 16 (n_star -> 4) and ~60.7% to 32 (n_star -> 6). Across the widest imp-34693 k=10 rung the ' +
    'right-hand side moves only ~+-5.5% (rel spread ~10.9%) -- ~3.6x under the nearest-boundary headroom -- so ' +
    'the integer ceil is PINNED at 5 band-wide; the lower band edge does not reach 16 until k = 11 ' +
    '(rho/N_cross ~ 35%), a full 1/L ~ 6.7x wider rung than any Picard iteration needs. The closed form ' +
    'agrees with the imp-34889 MEASURED crossing step (both 5) at every sampled point. DERIVATION on the ' +
    'imp-34889 surrogate only; establishes no operator positivity; imp-34714a REMAINS OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN. The closed form n_star = ceil(log2(N FP_LO(N)/K)) and its band-invariance are ' +
    'derived on the imp-34889 first-order outward-rounding SURROGATE (inherited imp-3220/imp-3406 crossover ' +
    'map), NOT on the imp-34687a certified transcendental layer; the derivation does NOT instantiate that ' +
    'layer and does NOT prove the forward endpoints are valid enclosures. A formalisation of the surrogate ' +
    'crossing step, not a machine certificate. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'FORWARD-BREACH CLOSED FORM (frontier, NOT an RH bound). imp-34889 measured the forward (H2)-margin crossing ' +
    'at step 5 band-wide and reduced it to a ratio with the fixed bracket half-width delta cancelling; this ' +
    'module DERIVES the exact closed form. The seed image half-width K delta / FP_LO(N) is T0(N)-independent ' +
    '(the RvM-inverse height cancels), so the crossing condition reduces to 2^n > N FP_LO(N)/K and ' +
    'n_star(N) = ceil(log2(N FP_LO(N)/K)). This corrects the imp-34889 prose, which wrote the ratio ' +
    'upside-down as (K/FP_LO)/N ~ 0.05; the true right-hand side is N FP_LO/K ~ 19.91 (the ~20 imp-34889 ' +
    'cites). n_star = 5 iff that right-hand side lies in the dyadic window (16, 32]; at centre ~19.91 with ' +
    '~19.6% headroom down to 16 and ~60.7% up to 32, and the widest imp-34693 k=10 rung moves it only ~+-5.5% ' +
    '-- ~3.6x under the nearest-boundary headroom -- so the integer ceil is band-INVARIANT at 5. The lower ' +
    'band edge does not reach 16 (n_star -> 4) until k = 11 (rho/N_cross ~ 35%), a full 1/L ~ 6.7x wider rung ' +
    'than any Picard iteration needs. The closed form agrees with the imp-34889 measured crossing step (both 5) ' +
    'at every sampled band point. DERIVATION on the imp-34889 surrogate only; does NOT instantiate the ' +
    'imp-34687a directed-rounding layer; SUB-GAP imp-34714a REMAINS OPEN. The C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; ' +
    'changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34889 (forward-breach band-uniformity measurement this formalises; surrogate image map + margin ' +
    'reused); imp-34865 (forward-vs-contraction width inflation at N_cross); imp-34693 (admissible seed band ' +
    'rho(1,k) = (1-L)/[(1-L_c) L^k]); imp-34799 ((H2)-margin ceiling); imp-34687 (f monotone+convex => inner ' +
    'interval-Newton is a verified contraction; sub-gap imp-34687a); imp-34714 (Krawczyk existence-uniqueness ' +
    'lemma; sub-gap imp-34714a); imp-33723 (Banach map g(N) = K log T0(N)); imp-2642 (C_C 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN, the RvM-inverse height whose T0 cancels).',
};

export const IMP34901_FORWARD_BREACH_CLOSED_FORM_ASSERTIONS = [
  {
    // The derived closed form n_star = ceil(log2(N FP_LO/K)) equals 5 at every sampled imp-34693 band point.
    id: 'imp34901-closed-form-n-star-5-band-wide',
    description: 'closed-form crossing step n_star = ceil(log2(N FP_LO/K)) equals 5 at every sampled band point',
    holds: () => N_STAR_BAND_MIN === 5 && N_STAR_BAND_MAX === 5 && nStar(N_CROSS) === 5,
  },
  {
    // The crossing right-hand side R = N FP_LO / K sits strictly inside the dyadic window (16, 32] that pins n_star.
    id: 'imp34901-breach-rhs-in-dyadic-window',
    description: 'crossing RHS N FP_LO/K ~ 19.9 lies strictly inside (16, 32], the window whose log the ceil reads',
    holds: () => R_CENTER > LOWER_POW2 && R_CENTER <= UPPER_POW2 && Math.abs(R_CENTER - 19.91) < 0.1,
  },
  {
    // The band moves R far less than the headroom to the nearest dyadic boundary, so the ceil cannot cross.
    id: 'imp34901-band-move-under-boundary-margin',
    description: 'widest k=10 band moves R ~+-5.5%, well under the ~19.6% headroom to the nearest (lower) boundary',
    holds: () => RHS_WORST_MOVE_K10 < MARGIN_DOWN && RHS_WORST_MOVE_K10 < 0.07 && MARGIN_DOWN > 0.15,
  },
  {
    // Seed image half-width K delta / FP_LO is T0(N)-independent: its band spread is only the FP_LO drift (<1%).
    id: 'imp34901-seed-image-half-width-T0-independent',
    description: 'seed image half-width K delta / FP_LO is T0-independent (band spread is FP_LO drift only, < 1%)',
    holds: () => SEED_IMG_REL_SPREAD_K10 < 1e-2 && CRITICAL_K === 11,
  },
  {
    // The derived closed form agrees with the imp-34889 MEASURED crossing step (both 5).
    id: 'imp34901-closed-form-matches-imp34889-measured',
    description: 'the derived closed-form crossing step equals the imp-34889 measured crossing step (both 5)',
    holds: () => nStar(N_CROSS) === BREACH_STEP_PUBLISHED && BREACH_STEP_PUBLISHED === 5,
  },
  {
    // Honesty gate: derivation/surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34901-honesty-gate-no-qed',
    description: 'closed-form derivation: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34901_FORWARD_BREACH_CLOSED_FORM.isRigorous === false &&
      /imp-34714a/.test(IMP34901_FORWARD_BREACH_CLOSED_FORM.subGap) &&
      /REMAINS OPEN/.test(IMP34901_FORWARD_BREACH_CLOSED_FORM.subGap) &&
      /NO QED/.test(IMP34901_FORWARD_BREACH_CLOSED_FORM.verdict) &&
      /refereed bound is changed/i.test(IMP34901_FORWARD_BREACH_CLOSED_FORM.verdict),
  },
];

for (const a of IMP34901_FORWARD_BREACH_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34901-forward-breach-closed-form assertion failed: ${a.id}`);
  }
}
