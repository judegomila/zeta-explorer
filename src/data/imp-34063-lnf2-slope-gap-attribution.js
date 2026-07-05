/**
 * @module imp-34063-lnf2-slope-gap-attribution
 *
 * imp-34063 (numerical, frontier-direction): imp-34004 R3 found the per-step normaliser
 * log-attenuation magnitude m = -ln F2 is proportional to the collision share
 * sigma = E_coll/E_N across the imp-33810 quarter-decade ladder, with fitted slope 0.27583 vs
 * the leading closed-form 0.28782 = 0.25(ln10)/2 -- a ~4% gap that imp-34004 attributed only
 * NARRATIVELY to "the E_flow/E_N and -1/(2 ln T0) sub-terms and the midpoint-sigma finite
 * difference". This module recomputes d ln E_N / d ln N EXACTLY (central difference in ln N,
 * per sub-term) at each step midpoint, isolates each named contribution to the slope shortfall,
 * and reports WHICH sub-term dominates the 4% gap. Measurement only; verbatim inherited
 * imp-3406/imp-33810 parts(); no fresh model.
 *
 * THE EXACT DECOMPOSITION (additive, in m-vs-sigma slope space)
 * ------------------------------------------------------------
 *   Write E_N = E_trunc + E_flow + E_coll (E_trunc frozen). The exact per-step attenuation is
 *   the finite difference m_i = -ln(E_N(b)/E_N(a)) over Delta = 0.25 ln10 in ln N. Compare it to
 *   three references, each regressed (OLS m vs sigma_mid) exactly as imp-34004 did:
 *     CF       closed form           = 0.25(ln10)/2 = 0.287823        (uses -sigma/2 leading)
 *     coll     -d E_coll/d ln N / E_N * Delta, regressed vs sigma     (exact collision term)
 *     flow     -d E_flow/d ln N / E_N * Delta, regressed vs sigma     (exact flow term)
 *     deriv    coll + flow = the exact d ln E_N/d ln N * Delta        (no finite-difference error)
 *     fit      the actual finite-difference m (imp-34004 slope 0.27583)
 *   Because OLS is linear, deriv_slope = coll_slope + flow_slope, and the total gap splits EXACTLY:
 *     CF - fit  =  (CF - coll_slope)  +  (- flow_slope)  +  (deriv_slope - fit)
 *                     ^ coll sqrt(L)       ^ E_flow adds      ^ midpoint finite-diff (g''') bias
 *                       correction           attenuation        of the centred difference
 *
 * THE FINDING (numerical / measurement only)
 * ------------------------------------------
 *   (A1) THE GAP REPRODUCES imp-34004: CF - fit = 0.011995 (4.17% of CF), fit slope 0.27583.
 *   (A2) THE COLLISION sqrt(ln T0) CORRECTION DOMINATES, AND OVERSHOOTS THE GAP. Differentiating
 *        E_coll = C_C sqrt(ln T0 / N) gives d E_coll/d ln N = E_coll(-1/2 + (1/(2 ln T0)) d ln T0/d ln N),
 *        so the exact collision attenuation is sigma/2 * (1 - (1/ln T0) d ln T0/d ln N), NOT sigma/2.
 *        That +1/(2 ln T0) sub-term alone reduces the slope by CF - coll_slope = 0.016677
 *        (= 5.79% of CF) -- LARGER than the whole 4.17% gap. This is the ticket "-1/(2 ln T0)" term
 *        and it is the dominant driver.
 *   (A3) E_flow PARTIALLY OFFSETS IT (does not add to the shortfall in net). The E_flow term
 *        contributes flow_slope = +0.004881 of ADDED attenuation (E_flow ~ L/T0 falls with N),
 *        pulling the slope back UP by 0.004881 = 1.70% of CF -- i.e. it CANCELS part of the coll
 *        correction rather than deepening the gap, opposite to the narrative bundling.
 *   (A4) THE MIDPOINT FINITE-DIFFERENCE BIAS IS NEGLIGIBLE. The centred-difference m under-reads the
 *        midpoint derivative by only deriv_slope - fit = 0.000200 = 0.07% of CF (the O(Delta^2) g'''
 *        term), two orders of magnitude below the coll correction.
 *   (A5) THE THREE ADD BACK TO THE GAP EXACTLY: 0.016677 - 0.004881 + 0.000200 = 0.011995 = CF - fit.
 *
 * The punchline: the ~4% gap is NOT one narrative bundle. It is a LARGE collision-side reduction
 * (the +1/(2 ln T0) sqrt(ln T0)-derivative sub-term, ~5.8% of CF, the dominant driver) partly
 * CANCELLED by the E_flow term (~1.7% of CF, acting in the opposite direction), with the midpoint
 * finite-difference bias essentially irrelevant (~0.07% of CF). The single sub-term that dominates
 * the shortfall is the E_coll sqrt(ln T0) correction, i.e. the ticket "-1/(2 ln T0)" term.
 *
 * NUMERICAL / MEASUREMENT ONLY. Exact WITHIN the inherited imp-3220/imp-3406 component model, which
 * is NOT a rigorous asymptotic. Descriptive attribution, NOT a derived bound; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; the C_mb GUE-conditional share
 * per imp-486 is UNTOUCHED; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-34004-lnf2-saturation-law-fit (the fitted slope 0.27583 and closed form 0.28782 this attributes)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21 quarter-decade rungs)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33962/imp-34004 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34004 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

function rungHeightN(k) {
  return Math.pow(10, k + 1); // imp-33810 rung upper endpoint
}

const RUNG_KS = [];
for (let k = 6; k <= 11 + 1e-9; k += 0.25) RUNG_KS.push(+k.toFixed(2));
const RUNG_N = RUNG_KS.map(rungHeightN);
const RUNG_PARTS = RUNG_N.map(parts);

const DELTA_LN_N = 0.25 * Math.LN10; // ln-N span of one quarter-decade step

// d(part)/d ln N by high-accuracy central difference in ln N (h small, symmetric).
function dPartDlnN(N, key, h = 1e-6) {
  const Np = Math.exp(Math.log(N) + h);
  const Nm = Math.exp(Math.log(N) - h);
  return (parts(Np)[key] - parts(Nm)[key]) / (2 * h);
}

// Per adjacent-rung step: exact finite-difference m and the exact per-sub-term attenuation
// contributions to -Delta * d ln E_N / d ln N evaluated at the log-midpoint.
const STEPS = [];
for (let i = 0; i < RUNG_KS.length - 1; i++) {
  const EN_a = RUNG_PARTS[i].E_N;
  const EN_b = RUNG_PARTS[i + 1].E_N;
  const m = -Math.log(EN_b / EN_a); // fitted (finite-difference) magnitude, > 0
  const logNmid = (Math.log10(RUNG_N[i]) + Math.log10(RUNG_N[i + 1])) / 2;
  const Nmid = Math.pow(10, logNmid);
  const pm = parts(Nmid);
  const dColl = dPartDlnN(Nmid, 'E_coll');
  const dFlow = dPartDlnN(Nmid, 'E_flow');
  // -d ln E_N/d ln N split additively (E_trunc frozen contributes 0):
  const attColl = (-dColl / pm.E_N) * DELTA_LN_N; // collision term, per-step
  const attFlow = (-dFlow / pm.E_N) * DELTA_LN_N; // flow term, per-step
  const mDeriv = attColl + attFlow; // exact derivative-based per-step m (no finite-diff error)
  STEPS.push({ step: i, sigma: pm.sigma, m, mDeriv, attColl, attFlow });
}

// --- OLS slope of y vs sigma (matches imp-34004 model D construction) ---
function olsSlope(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return sxy / sxx;
}

const SIGMA = STEPS.map((s) => s.sigma);
const SLOPE_CF = 0.5 * 0.25 * Math.LN10; // 0.287823 closed form
const SLOPE_FIT = olsSlope(SIGMA, STEPS.map((s) => s.m)); // 0.275828 (imp-34004)
const SLOPE_DERIV = olsSlope(SIGMA, STEPS.map((s) => s.mDeriv)); // 0.276028
const SLOPE_COLL = olsSlope(SIGMA, STEPS.map((s) => s.attColl)); // 0.271146
const SLOPE_FLOW = olsSlope(SIGMA, STEPS.map((s) => s.attFlow)); // 0.004881

// Additive split of the total gap CF - fit into the three named contributions.
const GAP_TOTAL = SLOPE_CF - SLOPE_FIT; // 0.011995
const CONTRIB_COLL = SLOPE_CF - SLOPE_COLL; // 0.016677 -- the +1/(2 ln T0) sqrt(L) correction (dominant)
const CONTRIB_FLOW = -SLOPE_FLOW; // -0.004881 -- E_flow pulls slope back UP (offsets, not adds)
const CONTRIB_FD = SLOPE_DERIV - SLOPE_FIT; // 0.000200 -- midpoint centred-difference g''' bias
const RESIDUAL = GAP_TOTAL - (CONTRIB_COLL + CONTRIB_FLOW + CONTRIB_FD); // ~0 (exact additivity check)

const asPctCF = (x) => (x / SLOPE_CF) * 100;

export const IMP34063_LNF2_SLOPE_GAP_ATTRIBUTION = {
  id: 'imp-34063',
  proofSection: 'S-frontier',
  question:
    'imp-34004 R3 found m = -ln F2 proportional to sigma = E_coll/E_N with fitted slope 0.27583 vs ' +
    'the closed form 0.28782 = 0.25(ln10)/2, a ~4% gap attributed only narratively to the E_flow/E_N ' +
    'and -1/(2 ln T0) sub-terms and the midpoint finite difference. Recompute d ln E_N/d ln N exactly ' +
    'per sub-term, isolate each contribution to the slope shortfall, and report which dominates. ' +
    'Measurement/attribution only; inherited imp-3406/imp-33810 parts(); no bound, NO QED.',
  measuredQuantity:
    'per adjacent-rung step (20 over k=6.00..11.00) the exact -Delta d ln E_N/d ln N split into ' +
    'collision and flow contributions at the log-midpoint (central difference h=1e-6), each regressed ' +
    'OLS vs sigma_mid; the additive split of CF - fit into (CF - coll_slope), -flow_slope, and ' +
    '(deriv_slope - fit)',
  slopes: {
    closed_form: +SLOPE_CF.toFixed(6), // 0.287823
    fitted_finite_diff: +SLOPE_FIT.toFixed(6), // 0.275828 (matches imp-34004)
    exact_derivative: +SLOPE_DERIV.toFixed(6), // 0.276028
    coll_term_only: +SLOPE_COLL.toFixed(6), // 0.271146
    flow_term_only: +SLOPE_FLOW.toFixed(6), // 0.004881
  },
  gapAttribution: {
    gap_total: +GAP_TOTAL.toFixed(6), // 0.011995
    gap_rel_pct_of_CF: +asPctCF(GAP_TOTAL).toFixed(3), // 4.168
    coll_sqrtL_correction: +CONTRIB_COLL.toFixed(6), // 0.016677 (dominant, widens gap)
    coll_pct_of_CF: +asPctCF(CONTRIB_COLL).toFixed(3), // 5.794
    flow_contribution: +CONTRIB_FLOW.toFixed(6), // -0.004881 (offsets, narrows gap)
    flow_pct_of_CF: +asPctCF(CONTRIB_FLOW).toFixed(3), // -1.696
    midpoint_finite_diff_bias: +CONTRIB_FD.toFixed(6), // 0.000200 (negligible)
    finite_diff_pct_of_CF: +asPctCF(CONTRIB_FD).toFixed(3), // 0.069
    additivity_residual: +RESIDUAL.toExponential(2), // ~0 -- the split is exact
  },
  finding: {
    A1_gap_reproduces_imp34004:
      'CF - fit = 0.011995 (4.17% of CF 0.287823), fitted slope 0.275828 -- the imp-34004 4% gap, exactly.',
    A2_coll_sqrtL_correction_dominates:
      'Differentiating E_coll = C_C sqrt(ln T0 / N) gives d E_coll/d ln N = E_coll(-1/2 + ' +
      '(1/(2 ln T0)) d ln T0/d ln N), so the exact collision attenuation is sigma/2 (1 - (1/ln T0) ' +
      'd ln T0/d ln N), not sigma/2. That +1/(2 ln T0) sub-term reduces the slope by 0.016677 = 5.79% ' +
      'of CF -- LARGER than the whole gap; it is the dominant driver (the ticket -1/(2 ln T0) term).',
    A3_flow_partially_offsets:
      'The E_flow ~ L/T0 term falls with N and ADDS attenuation, contributing flow_slope = +0.004881 ' +
      '(1.70% of CF). It pulls the slope back UP, CANCELLING part of the coll correction rather than ' +
      'deepening the shortfall -- opposite to the narrative bundling of "E_flow and -1/(2 ln T0)".',
    A4_midpoint_finite_diff_negligible:
      'The centred-difference m under-reads the midpoint derivative by only deriv - fit = 0.000200 = ' +
      '0.07% of CF (the O(Delta^2) g-triple-prime term), two orders below the coll correction.',
    A5_additive_split_exact:
      '0.016677 - 0.004881 + 0.000200 = 0.011995 = CF - fit to machine precision (residual ~1e-18): ' +
      'the three named sub-terms account for the whole gap with no unexplained remainder.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / MEASUREMENT (frontier-direction, NOT rigorous). Decomposing the imp-34004 ~4% slope ' +
    'gap (closed-form 0.287823 vs fitted 0.275828) by recomputing d ln E_N/d ln N exactly per sub-term ' +
    'shows it is NOT one narrative bundle: the E_coll sqrt(ln T0) correction -- the +1/(2 ln T0) ' +
    'derivative sub-term named in the ticket -- DOMINATES at 5.79% of CF (0.016677, larger than the ' +
    'whole gap); the E_flow term OFFSETS it by 1.70% (0.004881, pulling the slope back up, opposite to ' +
    'the bundling); and the midpoint finite-difference bias is negligible at 0.07% (0.000200). The ' +
    'three add back to the 4.17% gap exactly. Exact WITHIN the inherited imp-3220/imp-3406 component ' +
    'model, which is NOT a rigorous asymptotic; attribution NOT a bound; changes no bound; establishes ' +
    'no operator positivity; imp-3066 K_a >= 0 untouched; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-34004 (the fitted slope 0.27583 and closed form 0.28782 this attributes); imp-33810 (the 21 ' +
    'quarter-decade rungs); lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C ' +
    '(E_coll prefactor).',
};

export const IMP34063_LNF2_SLOPE_GAP_ATTRIBUTION_ASSERTIONS = [
  {
    // (A1) The gap reproduces imp-34004: fitted slope 0.27583, CF 0.28782, gap ~4.17%.
    id: 'imp34063-gap-reproduces-imp34004',
    description: 'fit slope ~0.27583, CF ~0.28782, gap ~4.17% of CF -- matches imp-34004',
    holds: () =>
      STEPS.length === 20 &&
      Math.abs(SLOPE_FIT - 0.275828) < 1e-4 &&
      Math.abs(SLOPE_CF - 0.287823) < 1e-5 &&
      Math.abs(asPctCF(GAP_TOTAL) - 4.168) < 0.05,
  },
  {
    // (A2) The collision sqrt(ln T0) correction dominates and overshoots the whole gap.
    id: 'imp34063-coll-correction-dominates',
    description: 'coll contribution (CF - coll_slope) ~0.016677 > gap_total ~0.011995, and is the largest term',
    holds: () =>
      Math.abs(CONTRIB_COLL - 0.016677) < 1e-4 &&
      CONTRIB_COLL > GAP_TOTAL &&
      CONTRIB_COLL > Math.abs(CONTRIB_FLOW) &&
      CONTRIB_COLL > Math.abs(CONTRIB_FD),
  },
  {
    // (A3) E_flow offsets (negative contribution) and (A4) finite-diff is negligible.
    id: 'imp34063-flow-offsets-finitediff-negligible',
    description: 'flow contribution < 0 (offsets), midpoint finite-diff bias < 0.1% of CF',
    holds: () =>
      CONTRIB_FLOW < 0 &&
      Math.abs(CONTRIB_FLOW + 0.004881) < 1e-4 &&
      Math.abs(asPctCF(CONTRIB_FD)) < 0.1 &&
      CONTRIB_FD > 0,
  },
  {
    // (A5) The additive split is exact: the three contributions sum to the total gap.
    id: 'imp34063-additive-split-exact',
    description: 'coll + flow + finite-diff = CF - fit to machine precision',
    holds: () => Math.abs(RESIDUAL) < 1e-12,
  },
  {
    // Honesty gate: numerical/measurement only, isRigorous false, no QED, PT SOTA.
    id: 'imp34063-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, PT SOTA',
    holds: () =>
      IMP34063_LNF2_SLOPE_GAP_ATTRIBUTION.isRigorous === false &&
      /NO QED/.test(IMP34063_LNF2_SLOPE_GAP_ATTRIBUTION.verdict) &&
      /remains SOTA/.test(IMP34063_LNF2_SLOPE_GAP_ATTRIBUTION.verdict),
  },
];

for (const a of IMP34063_LNF2_SLOPE_GAP_ATTRIBUTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34063-lnf2-slope-gap-attribution assertion failed: ${a.id}`);
  }
}
