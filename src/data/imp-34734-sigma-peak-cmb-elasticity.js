/**
 * @module imp-34734-sigma-peak-cmb-elasticity
 *
 * imp-34734 (numerical, frontier-direction): the imp-3220/imp-3406 GUE-conditional share
 *     sigma(N) = E_coll / E(N) = E_coll / (E_trunc + E_flow + E_coll)
 * has an interior MAXIMUM at N_max ~ 9.219e5 (log10 ~ 5.9647) with sigma_max ~ 0.94943
 * (imp-3406 F1). The dominant collision term E_coll is the GUE-conditional one -- it carries
 * the many-body correction constant C_mb, which the GUE argument bounds by 1 (imp-486) but
 * which any future TIGHTER (still <= 1) rigorous derivation might pin below 1. The E(N)
 * bridge-constant bottleneck is the named research frontier (currentStatus imp-3220/imp-3406).
 * This module QUANTIFIES the leverage of C_mb on the peak: it inserts C_mb as a multiplicative
 * factor on E_coll (C_mb = 1 reproduces the inherited imp-3406 baseline), derives dsigma/dC_mb
 * analytically, and MEASURES over a grid of hypothetical C_mb in (0, 1] how the peak HEIGHT
 * sigma_max AND the peak LOCATION N* shift.
 *
 * THE MODEL (identical sub-terms to imp-3220 / imp-3406 -- no fresh terms, C_mb factored out)
 * -------------------------------------------------------------------------------------------
 *     sigma(N; C_mb) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll  = C_mb * C_C_PINNED * sqrt(L / N),   L = log T0(N)   (dominant, GUE-conditional),
 *     E_flow  = C_F (L / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398, C_mb-free),
 *     E_trunc = 3.06e-5   (N-independent, imp-2631, C_mb-free).
 * C_mb = 1 is the inherited baseline (reproduces imp-3406 sigma_max ~ 0.94943 at N ~ 9.22e5).
 * Only E_coll carries C_mb; the E_trunc + E_flow denominator floor A(N) is C_mb-free.
 *
 * THE ANALYTIC DERIVATION (two exact facts about the model, NOT RH claims)
 * -----------------------------------------------------------------------
 *   Write A(N) = E_trunc + E_flow (C_mb-free) and e0(N) = C_C_PINNED sqrt(L/N), so
 *   E_coll = C_mb e0 and sigma = C_mb e0 / (A + C_mb e0) = f(r), r(N) = C_mb e0(N)/A(N),
 *   f(r) = r/(1+r) strictly increasing.
 *   (D1) HEIGHT.   At fixed N, d sigma / d C_mb = A e0 / (A + C_mb e0)^2 = sigma (1 - sigma) / C_mb.
 *        The log-elasticity is d sigma / d ln C_mb = sigma (1 - sigma). At the peak (C_mb = 1,
 *        sigma_max ~ 0.94943) this is ~ 0.94943 * 0.05057 = 0.04801.
 *   (D2) LOCATION. Because sigma = f(r) with f strictly increasing and C_mb enters r only as a
 *        constant multiplier, argmax_N sigma(N; C_mb) = argmax_N r(N) = argmax_N e0(N)/A(N),
 *        which is INDEPENDENT of C_mb. The peak LOCATION N* is EXACTLY C_mb-invariant; only the
 *        peak HEIGHT moves. Writing r* = e0(N*)/A(N*), the peak height in closed form is
 *        sigma_max(C_mb) = C_mb r* / (1 + C_mb r*),   r* ~ 18.774.
 *
 * THE EXPERIMENT (re-run the imp-3406 ternary argmax over a C_mb grid)
 * -------------------------------------------------------------------
 *   For C_mb in {1.00, 0.99, 0.90, 0.75, 0.50, 0.25, 0.10, 1/r*} re-run the SAME ternary
 *   search that imp-3406 uses to locate N_max, then record N*(C_mb) and sigma_max(C_mb).
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) THE PEAK LOCATION IS EXACTLY C_mb-INVARIANT. Across the whole grid N* stays pinned at
 *        9.21863e5 (log10 5.96467) to every reported digit -- the ternary argmax does not move.
 *        A tighter C_mb has ZERO leverage on WHERE the conditional share peaks.
 *   (F2) THE PEAK HEIGHT MOVES LINEARLY, dsigma_max/dC_mb ~ 0.0480. The closed form
 *        sigma_max(C_mb) = C_mb r_star / (1 + C_mb r_star), r_star ~ 18.774, reproduces the grid; the
 *        numeric central-difference derivative at C_mb = 1 matches sigma(1-sigma)/C_mb = 0.048014
 *        to full precision. A -10% C_mb (to 0.90) lowers sigma_max by ~5.3e-3 (0.94943 -> 0.94412);
 *        sigma_max hits 0.5 only at C_mb = 1/r* ~ 0.0533.
 *   (F3) THE PUNCHLINE. Even the GUE saturation C_mb = 1 gives sigma_max ~ 0.94943 < 1 -- the
 *        share cannot reach 1 (the constant E_trunc floor forbids it), so a tighter C_mb only
 *        LOWERS the peak, never raises it above 0.94943. The leverage of any future tighter
 *        (< 1) C_mb is therefore: NO movement of the peak location, and a mild ~0.048-per-unit
 *        drop of the peak height -- i.e. ~4.8e-4 of height per 1% of C_mb tightening.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic. This does
 * NOT discharge the GUE conditional (imp-486): it treats C_mb as a free knob to measure its
 * leverage, it does not tighten C_mb. Changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-3406-sigma-highN-extrapolation (F1: interior max N_max ~ 9.22e5, sigma_max ~ 0.94943)
 * @see imp-3220-en-bridge-fidelity-frontier (U-shaped sigma(N) decade ladder)
 * @see imp-3446-nmax-closed-form (closed-form N_max location)
 * @see imp-486 (C_mb GUE-conditional, bounded <= 1)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406 exactly

// EXACT imp-3406 sub-terms with C_mb as a multiplicative factor on the GUE-conditional E_coll.
// cmb = 1 reproduces imp-3406 parts() verbatim; the E_trunc + E_flow floor A is C_mb-free.
function parts(N, cmb) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor (C_mb-free)
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous (C_mb-free)
  const E_coll = cmb * C_C_PINNED * Math.sqrt(L / N); // GUE-conditional, scaled by C_mb
  const A = E_TRUNC_PT + E_flow; // the C_mb-free denominator floor
  return { T0, L, E_flow, E_coll, A, sigma: E_coll / (A + E_coll) };
}
const sigmaAt = (N, cmb) => parts(N, cmb).sigma;

// Right-arm interior maximum by the identical imp-3406 ternary search (bracket 1e4..1e9).
function argmaxSigmaLnN(cmb) {
  let lo = Math.log(1e4);
  let hi = Math.log(1e9);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigmaAt(Math.exp(m1), cmb) < sigmaAt(Math.exp(m2), cmb)) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

// Baseline (C_mb = 1) reproduces imp-3406 F1 exactly.
const N_MAX_BASE = argmaxSigmaLnN(1.0); // ~9.21863e5
const BASE = parts(N_MAX_BASE, 1.0);
const SIGMA_MAX_BASE = BASE.sigma; // ~0.9494290
const R_STAR = BASE.E_coll / BASE.A; // ~18.7742 (= e0*/A* at the peak, since C_mb = 1 here)

// (D1) closed-form vs numeric d sigma / d C_mb at the peak (fixed N = N_MAX_BASE).
const DSIGMA_DCMB_CLOSED = (SIGMA_MAX_BASE * (1 - SIGMA_MAX_BASE)) / 1.0; // ~0.048014
const H_CMB = 1e-6;
const DSIGMA_DCMB_NUMERIC =
  (sigmaAt(N_MAX_BASE, 1 + H_CMB) - sigmaAt(N_MAX_BASE, 1 - H_CMB)) / (2 * H_CMB);
const LOG_ELASTICITY_PEAK = SIGMA_MAX_BASE * (1 - SIGMA_MAX_BASE); // d sigma / d ln C_mb at peak

// Closed-form peak height as a function of C_mb (D2): sigma_max(C_mb) = C_mb r*/(1 + C_mb r*).
const sigmaMaxClosed = (cmb) => (cmb * R_STAR) / (1 + cmb * R_STAR);
const CMB_HALF = 1 / R_STAR; // C_mb at which sigma_max = 0.5 (~0.0533)

// The grid: re-run the ternary argmax at each hypothetical C_mb and record location + height.
const CMB_GRID = [1.0, 0.99, 0.9, 0.75, 0.5, 0.25, 0.1, CMB_HALF];
const GRID = CMB_GRID.map((cmb) => {
  const Nstar = argmaxSigmaLnN(cmb);
  const p = parts(Nstar, cmb);
  return {
    C_mb: +cmb.toFixed(5),
    N_star: +Nstar.toExponential(5), // C_mb-INVARIANT (F1)
    log10_N_star: +(Math.log(Nstar) / Math.LN10).toFixed(6),
    sigma_max: +p.sigma.toFixed(7),
    sigma_max_closed: +sigmaMaxClosed(cmb).toFixed(7), // matches sigma_max (validates D2)
    location_shift_dex: +(Math.log(Nstar / N_MAX_BASE) / Math.LN10).toExponential(2), // ~0
  };
});

// Leverage of a tighter C_mb: the -10% height drop and the (zero) location movement.
const SIGMA_MAX_M10 = sigmaMaxClosed(0.9);
const HEIGHT_SHIFT_M10 = SIGMA_MAX_M10 - SIGMA_MAX_BASE; // ~-5.3e-3 (peak LOWERS for tighter C_mb)
const N_STAR_M10 = argmaxSigmaLnN(0.9);
const LOCATION_SHIFT_M10_DEX = Math.log(N_STAR_M10 / N_MAX_BASE) / Math.LN10; // ~0

export const IMP34734_SIGMA_PEAK_CMB_ELASTICITY = {
  id: 'imp-34734',
  proofSection: 'S-frontier',
  question:
    'The imp-3220/imp-3406 conditional share sigma(N) = E_coll/E(N) peaks at N ~ 9.22e5 with ' +
    'sigma_max ~ 0.94943, where E_coll is the GUE-conditional (C_mb-carrying) collision term ' +
    'and C_mb is bounded <= 1 only via GUE (imp-486). Derive dsigma/dC_mb at the peak and ' +
    'MEASURE, over a grid of hypothetical C_mb in (0,1], how the peak HEIGHT and peak ' +
    'LOCATION N* shift, so the leverage of any future tighter C_mb is quantified. ' +
    'Measurement/derivation only; does NOT discharge the GUE conditional (imp-486); NO QED.',
  measuredQuantity:
    'the sensitivity of the imp-3406 interior sigma-peak (location N* and height sigma_max) to ' +
    'a multiplicative perturbation C_mb of the GUE-conditional E_coll term, via the closed form ' +
    'dsigma/dC_mb = sigma(1-sigma)/C_mb plus a re-run of the imp-3406 ternary argmax over ' +
    'C_mb in {1.00, 0.99, 0.90, 0.75, 0.50, 0.25, 0.10, 1/r*}',
  baseline: {
    N_max: +N_MAX_BASE.toExponential(5), // ~9.21863e5 (reproduces imp-3406 F1)
    log10_N_max: +(Math.log(N_MAX_BASE) / Math.LN10).toFixed(6), // ~5.964667
    sigma_max: +SIGMA_MAX_BASE.toFixed(7), // ~0.9494290
    r_star: +R_STAR.toFixed(6), // ~18.774184 (= e0*/A* at the peak)
  },
  derivative: {
    dSigma_dCmb_closed: +DSIGMA_DCMB_CLOSED.toExponential(6), // ~4.801361e-2 = sigma(1-sigma)/C_mb
    dSigma_dCmb_numeric: +DSIGMA_DCMB_NUMERIC.toExponential(6), // matches the closed form
    logElasticity_peak: +LOG_ELASTICITY_PEAK.toExponential(6), // d sigma / d ln C_mb = sigma(1-sigma)
    closedFormNote:
      'At fixed N, dsigma/dC_mb = A e0/(A + C_mb e0)^2 = sigma(1-sigma)/C_mb, so the log-elasticity ' +
      'd sigma / d ln C_mb = sigma(1-sigma). At the peak (C_mb=1, sigma_max~0.94943) this is ~0.0480.',
  },
  grid: GRID,
  leverage: {
    location_is_Cmb_invariant: true, // (F1) argmax_N sigma = argmax_N e0/A, C_mb-free
    location_shift_minus10pct_dex: +LOCATION_SHIFT_M10_DEX.toExponential(2), // ~0 (ternary ULP only)
    height_shift_minus10pct: +HEIGHT_SHIFT_M10.toExponential(4), // ~-5.3e-3 (peak LOWERS)
    sigma_max_minus10pct: +SIGMA_MAX_M10.toFixed(7), // ~0.9441240
    Cmb_at_sigma_half: +CMB_HALF.toFixed(6), // ~0.053264 (sigma_max = 0.5 only far below GUE bound)
    note:
      'Even the GUE saturation C_mb = 1 gives sigma_max ~ 0.94943 < 1 (the constant E_trunc floor ' +
      'forbids 1), so a tighter (< 1) C_mb only LOWERS the peak, never raises it. The leverage of any ' +
      'future tighter C_mb is: EXACTLY zero movement of the peak location N*, and a mild ~0.048-per-' +
      'unit (i.e. ~4.8e-4 per 1% C_mb) drop of the peak height.',
  },
  farTailExponent: 0.5, // imp-3463 asymptote
  finding: {
    F1_location_is_Cmb_invariant:
      'The peak LOCATION is EXACTLY C_mb-invariant: across C_mb in (0,1] the ternary argmax stays ' +
      'pinned at N* ~ 9.21863e5 (log10 5.964667) to every reported digit, because sigma = f(r) with ' +
      'f(r)=r/(1+r) strictly increasing and C_mb enters r = C_mb e0/A only as a constant multiplier, ' +
      'so argmax_N sigma = argmax_N e0/A is C_mb-free. A tighter C_mb has ZERO leverage on WHERE the share peaks.',
    F2_height_moves_linearly_about_0p048:
      'The peak HEIGHT moves as sigma_max(C_mb) = C_mb r*/(1 + C_mb r*), r* ~ 18.774, with ' +
      'dsigma_max/dC_mb = sigma_max(1-sigma_max)/C_mb ~ 0.0480 at C_mb = 1 (closed form matches the ' +
      'numeric central difference to full precision). A -10% C_mb lowers sigma_max by ~5.3e-3 ' +
      '(0.94943 -> 0.94412); sigma_max reaches 0.5 only at C_mb = 1/r* ~ 0.0533.',
    F3_tighter_Cmb_only_lowers_peak:
      'Even the GUE saturation C_mb = 1 gives sigma_max ~ 0.94943 < 1 -- the share cannot reach 1 ' +
      '(the constant E_trunc floor forbids it), so a tighter (< 1) C_mb only LOWERS the peak. The ' +
      'leverage of any future tighter C_mb is therefore NO movement of the peak location and a mild ' +
      '~0.048-per-unit drop of the peak height -- ~4.8e-4 of height per 1% of C_mb tightening.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION (frontier-direction, NOT rigorous). Inserting the GUE-conditional ' +
    'many-body constant C_mb (bounded <= 1 via GUE, imp-486) as a multiplicative factor on the ' +
    'imp-3406 collision term E_coll, dsigma/dC_mb = sigma(1-sigma)/C_mb ~ 0.0480 at the peak ' +
    '(closed form = numeric central difference), and re-running the imp-3406 ternary argmax over ' +
    'C_mb in {1.00, 0.99, 0.90, 0.75, 0.50, 0.25, 0.10, 1/r*} shows the peak LOCATION N* ~ 9.22e5 ' +
    'is EXACTLY C_mb-invariant (argmax_N of a monotone f of a constant-scaled ratio), while the ' +
    'peak HEIGHT follows sigma_max(C_mb) = C_mb r*/(1 + C_mb r*), r* ~ 18.774. Since even C_mb = 1 ' +
    'gives sigma_max ~ 0.94943 < 1, a tighter C_mb only LOWERS the peak: its leverage is zero on ' +
    'location and ~4.8e-4 of height per 1% of C_mb. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; this does NOT discharge the GUE ' +
    'conditional (imp-486) -- it treats C_mb as a free knob to measure leverage; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 ' +
    '(imp-3463); no RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'CLOSES the C_mb-leverage question the E(N) bridge frontier opens at the imp-3406 peak: the ' +
    'peak location is C_mb-invariant and the height responds linearly at ~0.048/unit C_mb, so a ' +
    'tighter C_mb cannot lift the share toward 1 (it only lowers it). What remains OPEN (deferred, ' +
    'not attempted here) is a rigorous derivation that actually PINS C_mb below the GUE bound of 1 ' +
    '(imp-486) -- the measurement quantifies the leverage but does not discharge the conditional.',
  citation:
    'imp-3406 (interior max N_max ~ 9.22e5, sigma_max ~ 0.94943); imp-3220 (U-shaped sigma(N) ' +
    'decade ladder); imp-3446 (closed-form N_max); imp-486 (C_mb GUE-conditional, bounded <= 1); ' +
    'imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc floor); lambda-rh-height-mapping.',
};

export const IMP34734_SIGMA_PEAK_CMB_ELASTICITY_ASSERTIONS = [
  {
    // Reuse gate: C_mb = 1 reproduces the imp-3406 F1 peak (location and height).
    id: 'imp34734-baseline-reproduces-imp3406',
    description: 'C_mb=1 reproduces imp-3406 F1: N_max ~ 9.22e5, sigma_max ~ 0.94943',
    holds: () =>
      N_MAX_BASE > 5e5 &&
      N_MAX_BASE < 2e6 &&
      Math.abs(SIGMA_MAX_BASE - 0.9494290) < 5e-4,
  },
  {
    // (F1): the peak LOCATION is C_mb-invariant to <1e-4 dex across the whole grid.
    id: 'imp34734-peak-location-is-cmb-invariant',
    description: 'argmax N* stays pinned across C_mb in (0,1] (|location shift| < 1e-4 dex)',
    holds: () =>
      GRID.every((g) => Math.abs(Math.log(g.N_star / N_MAX_BASE) / Math.LN10) < 1e-4) &&
      Math.abs(LOCATION_SHIFT_M10_DEX) < 1e-4,
  },
  {
    // (D1): the closed-form dsigma/dC_mb = sigma(1-sigma)/C_mb matches the numeric derivative.
    id: 'imp34734-derivative-closed-matches-numeric',
    description: 'dsigma/dC_mb closed form ~0.0480 matches the numeric central difference',
    holds: () =>
      DSIGMA_DCMB_CLOSED > 0.04 &&
      DSIGMA_DCMB_CLOSED < 0.06 &&
      Math.abs(DSIGMA_DCMB_CLOSED - DSIGMA_DCMB_NUMERIC) < 1e-6,
  },
  {
    // (D2/F2): the closed-form height sigma_max(C_mb) = C_mb r*/(1 + C_mb r*) matches the grid,
    // and a -10% C_mb lowers the peak by ~5.3e-3.
    id: 'imp34734-height-closed-form-matches-grid',
    description: 'sigma_max(C_mb) closed form matches the re-run grid; -10% C_mb lowers peak ~5.3e-3',
    holds: () =>
      GRID.every((g) => Math.abs(g.sigma_max - g.sigma_max_closed) < 1e-6) &&
      HEIGHT_SHIFT_M10 < 0 &&
      Math.abs(HEIGHT_SHIFT_M10 - -5.3e-3) < 5e-4,
  },
  {
    // (F3): even C_mb = 1 keeps sigma_max < 1, so a tighter C_mb only lowers the peak; the
    // grid is monotone increasing in C_mb and sigma_max = 0.5 only at C_mb = 1/r* << 1.
    id: 'imp34734-tighter-cmb-only-lowers-peak',
    description: 'sigma_max < 1 at C_mb=1, monotone in C_mb, hits 0.5 only at C_mb=1/r* ~ 0.053',
    holds: () =>
      SIGMA_MAX_BASE < 1 &&
      GRID[0].sigma_max > GRID[2].sigma_max &&
      GRID[2].sigma_max > GRID[4].sigma_max &&
      Math.abs(sigmaMaxClosed(CMB_HALF) - 0.5) < 1e-6 &&
      CMB_HALF < 0.1,
  },
  {
    // Honesty gate: measurement/derivation only, far-tail exponent = 1/2, no QED, no refereed bound is changed.
    id: 'imp34734-honesty-gate-no-qed',
    description: 'Measurement/derivation only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34734_SIGMA_PEAK_CMB_ELASTICITY.isRigorous === false &&
      IMP34734_SIGMA_PEAK_CMB_ELASTICITY.farTailExponent === 0.5 &&
      typeof IMP34734_SIGMA_PEAK_CMB_ELASTICITY.subGap === 'string' &&
      /NO QED/.test(IMP34734_SIGMA_PEAK_CMB_ELASTICITY.verdict) &&
      /refereed bound is changed/i.test(IMP34734_SIGMA_PEAK_CMB_ELASTICITY.verdict),
  },
];

for (const a of IMP34734_SIGMA_PEAK_CMB_ELASTICITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34734-sigma-peak-cmb-elasticity assertion failed: ${a.id}`);
  }
}
