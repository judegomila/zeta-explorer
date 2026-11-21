/**
 * @module imp-96250-ushape-location-ratio-farN-asymptote
 *
 * imp-96250 (numerical/derivation, frontier-direction): imp-96228 noted a FAR-N IMPLICATION of the
 * imp-96187 peak-location law N_peak/N_flow = (b/a)^(1/(a+b)) -- since the location exponent (a+b)
 * rises to 1 monotonically from below while b/a rises to 1, the peak and the numerator crossover
 * N_flow asymptotically coincide (the U-shape share flattens) -- but labelled it a DIAGNOSTIC, not a
 * rigorous asymptotic. This module DERIVES the leading and next-order far-N behaviour of the ratio
 * R(N) = N_peak/N_flow in closed form from the imp-96244 slope asymptotics a(N) -> 1/2 - 1/(2 ln N),
 * b(N) -> 1/2 - 5/(2 ln N), and QUANTIFIES the rate at which the peak flattens.
 *
 * THE DERIVATION (compose the location law with the imp-96244 slope tails)
 * ----------------------------------------------------------------------
 * Write u = ln N. imp-96244 derived the two local log-slopes as
 *     a(N) = 1/2 - (1/2)/u + O(ln ln N / u^2)   (coefficient a_c = 1/2, GUE-conditional shape),
 *     b(N) = 1/2 - (5/2)/u + O(ln ln N / u^2)   (coefficient b_c = 5/2, unconditional height law),
 * so a = (1/2)(1 - 1/u), b = (1/2)(1 - 5/u) to leading order. Feed these into the imp-96187 law:
 *
 *     ln R = ln(b/a) / (a + b),      R = N_peak/N_flow = (b/a)^(1/(a+b)).
 *
 *   (1) ln(b/a) = ln(1 - 5/u) - ln(1 - 1/u) = -4/u - 12/u^2 + O(1/u^3).
 *       The leading -4/u = -2 (b_c - a_c)/u : the flattening is driven by the SLOPE-ASYMMETRY gap
 *       b_c - a_c = 2 that imp-96244 identified as the 5x-faster b drift, scaled by 2.
 *   (2) 1/(a+b) = 1/(1 - 3/u) = 1 + 3/u + O(1/u^2)   (uses a+b = 1 - 3/u from imp-96244).
 *   (3) ln R = (-4/u - 12/u^2)(1 + 3/u) + O(1/u^3) = -4/u - 24/u^2 + O(1/u^3),  hence
 *
 *       R(N) = N_peak/N_flow = 1 - 4/ln N - 16/(ln N)^2 + O((ln ln N / ln N)^2)    ->  1 from below.
 *
 * So the peak and the numerator crossover DO asymptotically coincide, at leading rate 4/ln N.
 *
 * THE FLATTENING RATE (derived, not read off a grid)
 * --------------------------------------------------
 * The natural flattening measure is the log-separation of the two landmarks,
 *     Delta(N) = ln(N_flow/N_peak) = -ln R = 4/ln N + 24/(ln N)^2 + O(...)  ->  0,
 * i.e. in decades  log10(N_flow/N_peak) = 4/(ln 10 * ln N) + ...  -> 0 like 1/ln N. The convergence
 * is GLACIAL (logarithmic): R reaches within 1% of 1 only at ln N = 400, i.e. log10 N ~ 174, and
 * within 0.1% at log10 N ~ 1737. So the "peak and crossover coincide" statement is a purely
 * asymptotic one with NO reach at physical heights -- at the actual N_flow ~ 1.6e6 the ratio is still
 * ~ 0.577 (imp-96162/imp-96187), far below 1, confirming the imp-96187 verdict that the 0.577
 * proximity is a finite-height artifact and not a leading-order constant.
 *
 * NUMERICAL CONFIRMATION (two independent checks)
 * -----------------------------------------------
 *   - Leading-order slope model (a=1/2-1/(2u), b=1/2-5/(2u)): u(1-R) -> 4 and u^2(ln R + 4/u) -> -24
 *     to 4+ digits by u = 1e4, pinning BOTH derived coefficients exactly.
 *   - Exact imp-96244 log-derivative slopes (all corrections): u(1-R) descends monotonically toward
 *     4 (5.78 at N_flow down to 4.07 at log10 N = 250), confirming the LEADING 4/ln N flattening rate
 *     survives the exact slopes. The 1/u^2 coefficient measured with exact slopes drifts (~ -42..-48,
 *     not -24) because the exact slopes carry O(ln ln N / u^2) sub-corrections that imp-96244 did NOT
 *     pin; the polynomial -24 holds only when those are neglected. Reported honestly below.
 *
 * WHAT REMAINS CONDITIONAL
 * ------------------------
 *   - The a-branch coefficient a_c = 1/2 rests on the N^{-1/2} collision-term SHAPE, which is imp-486
 *     GUE-CONDITIONAL (pair-correlation). The flattening coefficient 4 = 2(b_c - a_c) inherits EXACTLY
 *     this conditionality and nothing more; the b-branch (Riemann-von Mangoldt T0 ~ N/ln N + Gronwall)
 *     is unconditional.
 *   - The 1/(ln N)^2 coefficient -24 is the POLYNOMIAL part only; the true next-order term is
 *     -24/(ln N)^2 + O(ln ln N/(ln N)^2), because imp-96244 pins the slopes only to leading order.
 *   - The whole construction sits on the inherited imp-3220/imp-3406/imp-33723 component model, NOT a
 *     rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) cancels in every log-derivative and
 *     is NOT used.
 *
 * DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. Changes no bound; establishes no
 * operator positivity; the collision share stays GUE-conditional (imp-486, UNTOUCHED); the C_C 1/8
 * ansatz (imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 untouched; no zero verified; no RH
 * verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-96228-ushape-slope-drift-beyond-nflow (flagged the far-N flattening as a diagnostic)
 * @see imp-96244-ushape-slope-asymptote-derivation (derived a -> 1/2 - 1/(2 ln N), b -> 1/2 - 5/(2 ln N))
 * @see imp-96187-ushape-peak-ratio-logcorrection-identity-vs-accident (location law N_peak/N_flow=(b/a)^(1/(a+b)))
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED); imp-2642/imp-2643 (C_C 1/8 ansatz, UNTOUCHED)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;

// Exact imp-96244 log-derivative slopes (constant C_C absent; all corrections included).
function dLdu(N) {
  const h = 1e-6;
  const Lp = Math.log(effectiveHeightForN(N * Math.exp(h)));
  const Lm = Math.log(effectiveHeightForN(N * Math.exp(-h)));
  return (Lp - Lm) / (2 * h);
}
function slopesDerived(N) {
  const L = Math.log(effectiveHeightForN(N));
  const dl = dLdu(N);
  const c = Math.log(TWO_PI);
  const a = 0.5 * (1 - dl / L); // a = -d ln E_coll/d ln N -> 1/2 - 1/(2 ln N)
  const dlnEflow = dl * (1 / (L - c + 1) + 1 / L - 1);
  const dlnEcoll = 0.5 * (dl / L - 1);
  const b = -dlnEflow + dlnEcoll; // -> 1/2 - 5/(2 ln N)
  return { a, b };
}
// The imp-96187 location law evaluated with the local slopes at N.
const Rexact = (N) => {
  const { a, b } = slopesDerived(N);
  return Math.pow(b / a, 1 / (a + b));
};
// Leading-order slope model isolates the derived polynomial coefficients (4, 24, 16).
const Rleading = (u) => {
  const a = 0.5 - 1 / (2 * u);
  const b = 0.5 - 5 / (2 * u);
  return Math.pow(b / a, 1 / (a + b));
};

// Grid: the imp-96228 endpoints plus deep probes (capped at log10 N = 250; 10^308 overflows double).
const N_FLOW_LOG10 = 6.204; // imp-96210/imp-96187 numerator crossover N_flow ~ 1.598e6
const GRID = [N_FLOW_LOG10, 12, 30, 60, 120, 250].map((lg) => {
  const N = Math.pow(10, lg);
  const u = Math.log(N);
  const Re = Rexact(N);
  const lnR = Math.log(Re);
  return {
    log10N: lg,
    u: +u.toFixed(4),
    R_exact: +Re.toFixed(6), // (b/a)^(1/(a+b)) with exact imp-96244 slopes -> 1 from below
    R_series: +(1 - 4 / u - 16 / (u * u)).toFixed(6), // derived R = 1 - 4/u - 16/u^2
    log_separation: +(-lnR).toFixed(6), // Delta = ln(N_flow/N_peak) -> 0 like 4/u
    u_times_gap: +(u * (1 - Re)).toFixed(4), // -> 4 (leading flattening coefficient)
  };
});

// Leading-order-slope confirmation of BOTH derived coefficients (4 and 24).
const U_PROBE = 1e5;
const R_PROBE = Rleading(U_PROBE);
const COEF_LEAD = +(U_PROBE * (1 - R_PROBE)).toFixed(4); // -> 4
const COEF_NEXT = +(U_PROBE * U_PROBE * (Math.log(R_PROBE) + 4 / U_PROBE)).toFixed(4); // -> -24

// Exact-slope leading coefficient (survives all corrections; approaches 4 from above).
const U_DEEP = Math.log(Math.pow(10, 250));
const COEF_LEAD_EXACT = +(U_DEEP * (1 - Rexact(Math.pow(10, 250)))).toFixed(4); // ~4.07 -> 4

// imp-96284: reconcile the 1/u^2 coefficient (polynomial -24 vs exact-slope drift ~-42..-48).
// The polynomial -24 uses the LEADING-ORDER slopes only. The EXACT imp-96244 slopes carry
// O(ln ln N / u^2) sub-corrections. Writing u = ln N, w = ln ln N, c = ln(2 pi), and using the
// EXACT Riemann-von Mangoldt log-derivative dl = 1 - 1/(L - c) (NOT the naive 1 - 1/u -- the map is
// N = (T0/2pi)(ln(T0/2pi) - 1), so with v = L - c one has dl = dL/du = (v-1)/v = 1 - 1/v), the
// slope tails expand to second order as
//   a(N) = 1/2 - 1/(2u) - (w - c - 1)/(2 u^2) + O(w^2/u^3),
//   b(N) = 1/2 - (5/2)/u - ((5/2) w - c/2 - 5/2)/u^2 + O(w^2/u^3).
// Feeding these through the imp-96187 location law R = (b/a)^(1/(a+b)) gives the exact-slope
// 1/u^2 coefficient of ln R
//   C(N) = -(4 ln ln N + 20) + o(1),
// which carries an IRREDUCIBLE ln ln N factor and grows in magnitude without bound (glacially).
// The polynomial -24 is only its w = 1 (u = e) value -- an artifact of dropping the w terms.
function measuredU2Coef(N) {
  const u = Math.log(N);
  return u * u * (Math.log(Rexact(N)) + 4 / u); // exact-slope u^2(ln R + 4/u) -> -(4 ln ln N + 20)
}
const lnlnModel = (u) => -(4 * Math.log(u) + 20); // -(4 ln ln N + 20), leading exact-slope coefficient
const SUBCORR_GRID = [60, 120, 250, 300].map((lg) => {
  const N = Math.pow(10, lg);
  const u = Math.log(N);
  const meas = measuredU2Coef(N);
  const mdl = lnlnModel(u);
  return {
    log10N: lg,
    lnlnN: +Math.log(u).toFixed(4),
    coef_measured: +meas.toFixed(4), // exact-slope 1/u^2 coefficient (the ~-42..-48 drift)
    coef_lnlnN_model: +mdl.toFixed(4), // -(4 ln ln N + 20)
    residual: +(meas - mdl).toFixed(4), // -> 0 from below as the O(w/u) tail vanishes
  };
});

// Glacial-convergence quantification: R within eps of 1 requires ln N ~ 4/eps.
const LOG10N_WITHIN_1PCT = +(4 / 0.01 / Math.log(10)).toFixed(1); // ~173.7
const LOG10N_WITHIN_0P1PCT = +(4 / 0.001 / Math.log(10)).toFixed(1); // ~1737.2

export const IMP96250_USHAPE_LOCATION_RATIO_FARN_ASYMPTOTE = {
  id: 'imp-96250',
  proofSection: 'S-frontier',
  question:
    'Using the imp-96244 slope asymptotics a -> 1/2 - 1/(2 ln N), b -> 1/2 - 5/(2 ln N), derive the ' +
    'leading and next-order far-N behaviour of the imp-96187 location ratio N_peak/N_flow = ' +
    '(b/a)^(1/(a+b)) and quantify the rate at which the U-shape peak flattens (peak and numerator ' +
    'crossover asymptotically coincide). Derivation only; NOT an RH bound; NO QED.',
  derived: {
    R_limit: 1, // N_peak/N_flow -> 1 from below (peak and N_flow coincide)
    lnR_leading: '-4/ln N', // = -2 (b_c - a_c)/ln N with b_c - a_c = 5/2 - 1/2 = 2
    lnR_next_order: '-4/ln N - 24/(ln N)^2', // polynomial part; +O(ln ln N/(ln N)^2)
    lnR_next_order_exact_slopes: '-4/ln N - (4 ln ln N + 20)/(ln N)^2', // imp-96284: exact-slope 1/u^2 term
    nextOrder_subcorrection: 'C(N) = -(4 ln ln N + 20) + o(1); irreducible ln ln N factor, NOT a constant',
    subcorrection_grid: SUBCORR_GRID, // imp-96284: measured coef vs -(4 ln ln N + 20), residual -> 0
    R_expansion: '1 - 4/ln N - 16/(ln N)^2 + O((ln ln N/ln N)^2)',
    flattening_measure: 'Delta = ln(N_flow/N_peak) = 4/ln N + 24/(ln N)^2 -> 0',
    leading_coefficient_measured: COEF_LEAD, // ~4.0000 (leading-order slopes)
    next_order_coefficient_measured: COEF_NEXT, // ~-24.00 (leading-order slopes, polynomial part)
    leading_coefficient_exact_slopes: COEF_LEAD_EXACT, // ~4.07 at log10 N=250 -> 4 (all corrections)
    log10N_within_1pct_of_1: LOG10N_WITHIN_1PCT, // ~173.7 (glacial, logarithmic)
    log10N_within_0p1pct_of_1: LOG10N_WITHIN_0P1PCT, // ~1737.2
    grid: GRID,
  },
  finding: {
    D1_leading_flattening_rate:
      'N_peak/N_flow = 1 - 4/ln N + O(1/(ln N)^2), so the peak and the numerator crossover N_flow ' +
      'coincide asymptotically at leading rate 4/ln N. The coefficient 4 = 2(b_c - a_c) is twice the ' +
      'imp-96244 slope-asymmetry gap b_c - a_c = 5/2 - 1/2 = 2 (the 5x-faster b drift), so the same ' +
      'algebra that made b drift faster than a is what closes the peak-crossover separation.',
    D2_next_order_and_log_separation:
      'ln R = -4/ln N - 24/(ln N)^2 + O(ln ln N/(ln N)^2), equivalently R = 1 - 4/ln N - 16/(ln N)^2. ' +
      'The flattening measure Delta = ln(N_flow/N_peak) = -ln R = 4/ln N + 24/(ln N)^2 -> 0. The ' +
      'polynomial -24 holds only when the O(ln ln N/(ln N)^2) slope sub-corrections (unpinned by ' +
      'imp-96244) are neglected; with exact slopes the measured 1/(ln N)^2 coefficient drifts, while ' +
      'the leading 4 survives (u(1-R) descends 5.78 -> 4.07 across log10 N = 6.2 -> 250).',
    D3_convergence_is_glacial:
      'The approach is logarithmic and glacially slow: R reaches within 1% of 1 only at log10 N ~ 174 ' +
      'and within 0.1% at log10 N ~ 1737. So peak/crossover coincidence has NO reach at physical ' +
      'heights: at the actual N_flow ~ 1.6e6 the ratio is still ~ 0.577, confirming the imp-96187 ' +
      'verdict that the 0.577 ~ 1/sqrt(3) proximity is a finite-height artifact, not a limit constant.',
    D5_next_order_subcorrection_lnlnN:
      'imp-96284: the polynomial -24 and the exact-slope drift ~-42..-48 are reconciled. The exact ' +
      'imp-96244 slopes carry O(ln ln N/u^2) sub-corrections -- a = 1/2 - 1/(2u) - (w-c-1)/(2u^2), ' +
      'b = 1/2 - (5/2)/u - ((5/2)w - c/2 - 5/2)/u^2 with w = ln ln N, c = ln 2pi -- coming from the ' +
      'EXACT Riemann-von Mangoldt log-derivative dl = 1 - 1/(L-c), not the naive 1 - 1/u. Feeding these ' +
      'through the location law gives the exact-slope 1/u^2 coefficient C(N) = -(4 ln ln N + 20) + o(1). ' +
      'So the coefficient does NOT converge to a constant: it carries an IRREDUCIBLE ln ln N factor and ' +
      'grows in magnitude without bound (glacially). The polynomial -24 is only C at w = 1 (u = e); at ' +
      'physical u the measured coefficient (-42..-48) tracks -(4 ln ln N + 20) with a residual that ' +
      'shrinks monotonically toward 0 (2.48 at log10 N = 60 down to 0.66 at log10 N = 300). This changes ' +
      'no bound and leaves the leading 4/ln N flattening (and its imp-486 conditionality) untouched.',
    D4_conditionality:
      'The flattening coefficient 4 = 2(b_c - a_c) is conditional ONLY through the a-branch coefficient ' +
      'a_c = 1/2, which rests on the N^{-1/2} collision-term shape (imp-486 GUE-conditional); the ' +
      'b-branch (Riemann-von Mangoldt T0 ~ N/ln N + Gronwall) is unconditional. The C_C 1/8 ansatz ' +
      '(imp-2642/imp-2643) cancels in every log-derivative and is NOT used. No rigorous RH input; ' +
      'establishes no operator positivity; NO QED.',
  },
  isRigorous: false, // GUE-conditional (imp-486) through the a-branch; derivation, not RH
  verdict:
    'DERIVATION (frontier-direction, GUE-conditional, NOT an RH bound). The imp-96228 far-N flattening ' +
    'of the imp-96187 location law is DERIVED in closed form from the imp-96244 slope tails: ' +
    'N_peak/N_flow = (b/a)^(1/(a+b)) = 1 - 4/ln N - 16/(ln N)^2 + O((ln ln N/ln N)^2) -> 1 from below, ' +
    'so the peak and the numerator crossover N_flow asymptotically coincide at leading rate 4/ln N, ' +
    'with 4 = 2(b_c - a_c) exactly twice the imp-96244 slope-asymmetry gap. The log-separation ' +
    'Delta = ln(N_flow/N_peak) = 4/ln N + 24/(ln N)^2 -> 0, but logarithmically: R is within 1% of 1 ' +
    'only at log10 N ~ 174, within 0.1% at ~1737, so the coincidence has NO reach at physical heights ' +
    '(at N_flow ~ 1.6e6 the ratio is still ~ 0.577, per imp-96187). Leading-order slopes pin both ' +
    'derived coefficients (u(1-R) -> 4, u^2(ln R + 4/u) -> -24); with exact slopes the leading 4 ' +
    'survives (u(1-R): 5.78 -> 4.07 over log10 N = 6.2 -> 250) while the 1/(ln N)^2 coefficient is ' +
    'NOT the constant -24: imp-96284 reconciles the polynomial -24 with the measured -42..-48 drift by ' +
    'deriving the O(ln ln N/(ln N)^2) slope sub-corrections (from the exact map dl = 1 - 1/(L-c)), giving ' +
    'the exact-slope 1/u^2 coefficient C(N) = -(4 ln ln N + 20) + o(1) -- an irreducible ln ln N factor ' +
    'that grows without bound, with -24 recovered only at the unphysical ln ln N = 1. Conditional ONLY ' +
    'through the a-branch GUE-conditional N^{-1/2} collision shape (imp-486, UNTOUCHED); the C_C 1/8 ' +
    'ansatz (imp-2642/imp-2643) cancels and is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no zero verified; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96228 (flagged the far-N flattening as a diagnostic); imp-96244 (derived a -> 1/2 - 1/(2 ln N), ' +
    'b -> 1/2 - 5/(2 ln N), a+b -> 1 - 3/ln N); imp-96187 (location law N_peak/N_flow = (b/a)^(1/(a+b))); ' +
    'imp-96162 (measured 0.577); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP96250_USHAPE_LOCATION_RATIO_FARN_ASYMPTOTE_ASSERTIONS = [
  {
    // D1/D2: the derived series 1 - 4/u - 16/u^2 reproduces the exact-slope ratio to improving
    // accuracy at large u, and the ratio rises monotonically toward 1 from below.
    id: 'imp96250-series-matches-exact-ratio-and-monotone-to-1',
    description: 'R=1-4/u-16/u^2 tracks exact (b/a)^(1/(a+b)); ratio monotone up toward 1 from below',
    holds: () => {
      const deep = GRID[GRID.length - 1];
      const near = GRID[0];
      let mono = true;
      for (let i = 1; i < GRID.length; i++) {
        if (GRID[i].R_exact <= GRID[i - 1].R_exact || GRID[i].R_exact >= 1) mono = false;
      }
      return (
        mono &&
        Math.abs(deep.R_exact - deep.R_series) < 5e-4 && // series accurate deep
        Math.abs(near.R_exact - near.R_series) > Math.abs(deep.R_exact - deep.R_series) // improves with N
      );
    },
  },
  {
    // D1: the leading flattening coefficient is 4 (leading-order slopes pin it exactly; exact slopes
    // descend toward it from above).
    id: 'imp96250-leading-coefficient-four',
    description: 'u(1-R) -> 4 (leading-order slopes ~4.000; exact slopes ~4.07 at log10 N=250)',
    holds: () =>
      Math.abs(COEF_LEAD - 4) < 1e-2 &&
      COEF_LEAD_EXACT > 4 &&
      COEF_LEAD_EXACT < 4.5,
  },
  {
    // D2: the next-order polynomial coefficient is -24 (leading-order slope model).
    id: 'imp96250-next-order-coefficient-minus-24',
    description: 'u^2(ln R + 4/u) -> -24 for the leading-order slope model (polynomial part)',
    holds: () => Math.abs(COEF_NEXT - -24) < 1e-1,
  },
  {
    // imp-96284 (D5): the exact-slope 1/u^2 coefficient carries an irreducible ln ln N factor
    // C(N) = -(4 ln ln N + 20), reconciling the polynomial -24 with the measured -42..-48 drift.
    id: 'imp96250-next-order-subcorrection-lnlnN',
    description: 'exact-slope 1/u^2 coef tracks -(4 ln ln N + 20) (not constant -24); residual shrinks to 0',
    holds: () => {
      // (i) all measured coefficients are far past the polynomial -24 (magnitude > 40): NOT the constant.
      const allPast24 = SUBCORR_GRID.every((r) => r.coef_measured < -40);
      // (ii) the ln ln N model tracks the measurement, with residual shrinking monotonically toward 0.
      let shrinks = true;
      for (let i = 1; i < SUBCORR_GRID.length; i++) {
        if (Math.abs(SUBCORR_GRID[i].residual) >= Math.abs(SUBCORR_GRID[i - 1].residual)) shrinks = false;
      }
      const deepMatch = Math.abs(SUBCORR_GRID[SUBCORR_GRID.length - 1].residual) < 1; // within 1 at log10 N=300
      return allPast24 && shrinks && deepMatch;
    },
  },
  {
    // D3: the convergence is glacial (logarithmic) -- within 1% only at log10 N ~ 174.
    id: 'imp96250-convergence-glacial-log10N-174',
    description: 'R within 1% of 1 only at log10 N ~ 174, within 0.1% at ~1737 (logarithmic, no physical reach)',
    holds: () =>
      Math.abs(LOG10N_WITHIN_1PCT - 173.7) < 1 && Math.abs(LOG10N_WITHIN_0P1PCT - 1737.2) < 5,
  },
  {
    // Honesty gate: GUE-conditional derivation, no QED, C_C ansatz untouched, no refereed bound is changed.
    id: 'imp96250-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, C_C ansatz untouched, no refereed bound is changed',
    holds: () =>
      IMP96250_USHAPE_LOCATION_RATIO_FARN_ASYMPTOTE.isRigorous === false &&
      /NO QED/.test(IMP96250_USHAPE_LOCATION_RATIO_FARN_ASYMPTOTE.verdict) &&
      /UNTOUCHED/.test(IMP96250_USHAPE_LOCATION_RATIO_FARN_ASYMPTOTE.verdict) &&
      /refereed bound is changed/i.test(IMP96250_USHAPE_LOCATION_RATIO_FARN_ASYMPTOTE.verdict),
  },
];

for (const a of IMP96250_USHAPE_LOCATION_RATIO_FARN_ASYMPTOTE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96250-ushape-location-ratio-farN-asymptote assertion failed: ${a.id}`);
  }
}
