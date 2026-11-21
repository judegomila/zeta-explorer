/**
 * @module imp-35470-sigma-peak-curvature-5point-stencil
 *
 * imp-35470 (numerical, frontier-direction) -- cross-checks the interior sigma-peak curvature
 * k = -d^2 sigma/d(ln N)^2 with a HIGHER-ORDER (5-point, O(h^4)) central second-difference stencil at the
 * peak N_max ~ 9.219e5, a route INDEPENDENT of BOTH the imp-35411 sqrt(tol) width-fit constant 15.3165 AND the
 * imp-35450 3-point O(h^2) stencil. It measures the same k a third way and reports which digits reproduce.
 *
 * THREE INDEPENDENT ROUTES TO THE SAME CURVATURE
 * ----------------------------------------------
 *   imp-35411:  INDIRECT -- read k off the far-field plateau width, W(tol)/sqrt(tol) = 15.316494 constant,
 *               via the quadratic flat-max model k = 8 / (ln10 * W/sqrt(tol))^2. Raw inferred k ~ 6.431909e-3.
 *   imp-35450:  DIRECT 3-point -- central second difference k = -[sig(u0+h)-2 sig(u0)+sig(u0-h)]/h^2,
 *               O(h^2) truncation, drifts from 6.4324e-3 at h=1e-1 to a 6.43191e-3 plateau, Richardson-confirmed.
 *   THIS (imp-35470):  DIRECT 5-point -- central second difference
 *               k = -[-sig(u0-2h)+16 sig(u0-h)-30 sig(u0)+16 sig(u0+h)-sig(u0+2h)] / (12 h^2), O(h^4) truncation.
 *   Because the 5-point stencil cancels the leading O(h^2) truncation term ANALYTICALLY (not by extrapolation),
 *   its estimate is essentially STEP-INDEPENDENT: k_5pt(h) = 6.43191023e-3 across the ENTIRE FD-step sweep
 *   h in {1e-1..2e-3}, with a max spread of ~5e-11 -- far flatter than the imp-35450 3-point drift, and reached
 *   WITHOUT any Richardson step. This is the cleanest of the three routes.
 *
 * THE RESULT: THE 5-POINT DIRECT k CONFIRMS THE RAW 6.4319e-3, NOT THE ROUNDED 6.428e-3 HEADLINE
 * ---------------------------------------------------------------------------------------------
 * The 5-point curvature k_5pt = 6.4319102e-3 agrees with the imp-35411 width-INFERRED k = 6.4319090e-3 to a
 * relative difference ~2e-7, matching the imp-35450 3-point/Richardson agreement independently. It does NOT
 * reproduce the imp-35411 "~6.428e-3" HEADLINE quote (off by ~6.1e-4 relative): as imp-35450 already flagged,
 * that headline is a slightly-off rounding of imp-35411's own raw inferred 6.4319e-3, and both direct stencils
 * confirm the raw value. So the width-fit's curvature is corroborated to ~6 sig figs by two structurally
 * different direct differentiations, independent of the width constant 15.3165 that produced it.
 *
 * WHY DOUBLE SUFFICES (NO dd NEEDED FOR THE CURVATURE)
 * ---------------------------------------------------
 * imp-35337 dd-certified sigma(N) across this N-shape to max |sigma_dd - sigma_double| ~ 1e-16. The 5-point
 * stencil is step-independent down to h = 2e-3 (its h^2-scale cancellation error ~ 1e-16/h^2 ~ 2.5e-11 relative
 * is far below the ~2e-7 route-agreement reported), so the curvature is not a double-rounding artifact -- which
 * is exactly why the O(h^4) estimate sits flat at all step sizes rather than diverging at small h.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A DIRECT higher-order finite-difference cross-check of the imp-35337/imp-3406 interior sigma-peak curvature,
 * independent of the imp-35411 width fit and the imp-35450 3-point stencil. MEASUREMENT ONLY on the inherited
 * imp-3220/imp-3406 surrogate; the surrogate-vs-true fidelity half (imp-35337a) stays OPEN and is not touched.
 * The C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; E_trunc = 3.06e-5 (imp-2631) UNTOUCHED;
 * the imp-398 C_F prefactor UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound; establishes
 * no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35450-sigma-peak-curvature-direct-fd (DIRECT 3-point O(h^2) FD + Richardson; ~6.43191e-3)
 * @see imp-35411-sigma-peak-plateau-width (INDIRECT width-inferred k from the constant 15.3165; raw ~6.4319e-3)
 * @see imp-35337-sigma-landmarks-double-double-certification (dd-certified peak VALUE / 2.1e-5 margin)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406/imp-35337/imp-35411/imp-35450 exactly

// The imp-35337 DOUBLE surrogate, reproduced VERBATIM from imp-35411/imp-35450 (dd-certified to ~1e-16).
function sigmaD(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return E_coll / E_N;
}

// Unimodal argmax on the right arm (ternary in ln N, same 500-iter form as imp-35337/imp-35411/imp-35450).
function argmaxD(loN, hiN) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigmaD(Math.exp(m1)) < sigmaD(Math.exp(m2))) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

const N_MAX = argmaxD(1e4, 1e9); // ~9.2186e5
const SIGMA_MAX = sigmaD(N_MAX); // ~0.949429014
const U0 = Math.log(N_MAX); // ln N_max ~ 13.734152

// sigma as a function of u = ln N (curvature is measured in the ln-N variable, as in imp-35411/imp-35450).
const sigU = (u) => sigmaD(Math.exp(u));

// DIRECT 5-point (O(h^4)) central second-difference curvature:
//   sigma''(u0) ~ [-sig(u0-2h) + 16 sig(u0-h) - 30 sig(u0) + 16 sig(u0+h) - sig(u0+2h)] / (12 h^2),  k = -sigma''.
// The leading O(h^2) truncation term cancels analytically, so k_5pt is step-independent (no Richardson needed).
function curvature5pt(h) {
  return -(
    -sigU(U0 - 2 * h) + 16 * sigU(U0 - h) - 30 * sigU(U0) + 16 * sigU(U0 + h) - sigU(U0 + 2 * h)
  ) / (12 * h * h);
}

// FD-step sweep (in ln N): the 5-point estimate sits flat at ALL step sizes -- the O(h^4) signature.
const FD_STEPS = [1e-1, 5e-2, 2e-2, 1e-2, 5e-3, 2e-3];
const FD_CURVATURES_5PT = FD_STEPS.map(curvature5pt);
const K_5PT = curvature5pt(1e-2); // ~6.4319102e-3 (representative; all steps agree)
const K_5PT_MAX_SPREAD = Math.max(...FD_CURVATURES_5PT) - Math.min(...FD_CURVATURES_5PT); // ~5e-11

// imp-35411 width-inferred k, reproduced EXACTLY from its raw width constant (NOT the rounded 6.428e-3 quote).
function plateauLo(tol) {
  const target = SIGMA_MAX - tol;
  let a = Math.log(1);
  let b = U0;
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    if (sigmaD(Math.exp(m)) < target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
function plateauHi(tol) {
  const target = SIGMA_MAX - tol;
  let a = U0;
  let b = Math.log(1e40);
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    if (sigmaD(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const WIDTH_OVER_SQRT_TOL = ((Math.log(plateauHi(1e-5)) - Math.log(plateauLo(1e-5))) / Math.LN10) / Math.sqrt(1e-5);
const K_WIDTH_INFERRED = 8 / Math.pow(Math.LN10 * WIDTH_OVER_SQRT_TOL, 2); // imp-35411 raw ~6.4319090e-3

// Relative agreement of the DIRECT 5-point curvature vs the INDIRECT width-inferred curvature.
const REL_AGREEMENT_WIDTH = Math.abs(K_5PT - K_WIDTH_INFERRED) / K_WIDTH_INFERRED; // ~2e-7
// Relative distance from the imp-35411 ROUNDED headline quote 6.428e-3 (which the direct routes do NOT confirm).
const REL_FROM_ROUNDED_HEADLINE = Math.abs(K_5PT - 6.428e-3) / K_5PT; // ~6.1e-4

export const IMP35470_SIGMA_PEAK_CURVATURE_5POINT_STENCIL = {
  id: 'imp-35470',
  proofSection: 'S-frontier',
  question:
    'imp-35411 pinned the interior sigma-peak curvature k ~ 6.4319e-3 INDIRECTLY from the plateau-width constant ' +
    'W(tol)/sqrt(tol) = 15.3165, and imp-35450 confirmed it DIRECTLY with a 3-point O(h^2) central second ' +
    'difference. Cross-check k a THIRD way with a higher-order 5-point O(h^4) central second difference at ' +
    'N_max ~ 9.219e5 on the same partsD double surrogate -- independent of BOTH the width fit AND the 3-point ' +
    'stencil -- and report which digits of the width-inferred k it reproduces.',
  constants: {
    log10_N_max: +(U0 / Math.LN10).toFixed(6), // ~5.964667
    sigma_max: +SIGMA_MAX.toFixed(9), // ~0.949429014
    ln_N_max: +U0.toFixed(6), // ~13.734152
  },
  direct_5point_curvature: {
    fd_steps_in_lnN: FD_STEPS,
    fd_curvatures_5pt: FD_CURVATURES_5PT.map((k) => +k.toExponential(7)), // all ~6.4319102e-3 (step-independent)
    k_5pt: +K_5PT.toExponential(7), // ~6.4319102e-3
    max_spread_across_sweep: +K_5PT_MAX_SPREAD.toExponential(3), // ~5e-11 (O(h^4) => flat at all steps)
    note:
      'Central 5-point second difference k_5pt = -[-sig(u0-2h)+16 sig(u0-h)-30 sig(u0)+16 sig(u0+h)-sig(u0+2h)] ' +
      '/(12 h^2) in u = ln N. The leading O(h^2) truncation term cancels analytically, so k_5pt is step-independent ' +
      '(~6.4319102e-3 across h in {1e-1..2e-3}, spread ~5e-11) with NO Richardson step -- flatter than the ' +
      'imp-35450 3-point O(h^2) drift.',
  },
  cross_check: {
    k_width_inferred: +K_WIDTH_INFERRED.toExponential(7), // imp-35411 raw ~6.4319090e-3
    rel_agreement_vs_width_inferred: +REL_AGREEMENT_WIDTH.toExponential(3), // ~2e-7
    rel_distance_from_rounded_headline_6428e3: +REL_FROM_ROUNDED_HEADLINE.toExponential(3), // ~6.1e-4
    note:
      'The DIRECT 5-point curvature agrees with the INDIRECT width-inferred k to ~2e-7 relative -- a third, ' +
      'structurally distinct route (O(h^4) stencil) pins the SAME k as the width fit and the 3-point stencil. It ' +
      'reproduces the imp-35411 RAW inferred 6.4319e-3, NOT the rounded "6.428e-3" headline quote (off by ~6.1e-4 ' +
      'relative), corroborating the imp-35450 finding that the headline is a slightly-off rounding.',
  },
  finding:
    'A DIRECT 5-point O(h^4) central second-difference of sigma(ln N) at N_max ~ 9.219e5 measures the interior ' +
    'sigma-peak curvature k = -d^2 sigma/d(ln N)^2 = ' + (+K_5PT.toExponential(7)) + ', step-independent across ' +
    'h in {1e-1..2e-3} (spread ~' + (+K_5PT_MAX_SPREAD.toExponential(1)) + ') because the O(h^2) truncation term ' +
    'cancels analytically -- flatter than the imp-35450 3-point stencil and requiring no Richardson step. This ' +
    'agrees with the imp-35411 width-INFERRED k = ' + (+K_WIDTH_INFERRED.toExponential(7)) + ' to ~' +
    (+REL_AGREEMENT_WIDTH.toExponential(1)) + ' relative, so THREE independent routes (far-field plateau width, ' +
    '3-point derivative, 5-point derivative) pin the same tiny curvature to ~6 sig figs. It confirms the RAW ' +
    '6.4319e-3, not the rounded 6.428e-3 headline (off ~6.1e-4). MEASUREMENT ONLY on the imp-3220/imp-3406 ' +
    'surrogate; imp-35337a stays OPEN.',
  residual_sub_gap:
    'Inherits imp-35337a: this cross-checks the CURVATURE of the peak on the imp-3220/imp-3406 double surrogate ' +
    '(dd-certified by imp-35337 to ~1e-16, so the h^2-scale FD cancellation error ~2.5e-11 relative at the ' +
    'smallest step is far below the ~2e-7 route-agreement -- not a double artifact). It does NOT establish that ' +
    'the surrogate MAP (E_coll = C_C sqrt(log T0/N), C_H = 1/8 ansatz) is a faithful proxy for the true ' +
    'empirical-vs-analytic gap at these heights; that sub-gap imp-35337a stays OPEN.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (numerical, frontier-direction, NOT an RH bound). The imp-35337/imp-3406 interior sigma-share ' +
    'peak curvature k = -d^2 sigma/d(ln N)^2 at N_max ~ 9.219e5, cross-checked with a DIRECT 5-point O(h^4) ' +
    'central second difference in ln N, is ~6.4319102e-3, step-independent across h in {1e-1..2e-3} (spread ~5e-11, ' +
    'no Richardson needed) and agreeing with the imp-35411 width-INFERRED k ~ 6.4319090e-3 to ~2e-7 relative -- a ' +
    'third independent route (beyond the width fit and the imp-35450 3-point stencil) pinning the same curvature. ' +
    'It confirms the RAW 6.4319e-3, not the rounded 6.428e-3 headline (off ~6.1e-4). Located on the imp-35337 ' +
    'double surrogate reproduced VERBATIM (dd-certified there to ~1e-16). MEASUREMENT ONLY on the inherited ' +
    'imp-3220/imp-3406 surrogate, which is NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643), the ' +
    'E_trunc = 3.06e-5 floor (imp-2631) and the imp-398 C_F prefactor are UNTOUCHED; C_mb GUE-conditional per ' +
    'imp-486 UNTOUCHED; the surrogate-vs-true fidelity half (imp-35337a) stays OPEN; changes no bound; establishes ' +
    'no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35450 (DIRECT 3-point O(h^2) FD + Richardson, ~6.43191e-3); imp-35411 (INDIRECT width-inferred k from ' +
    'the constant 15.3165, raw ~6.4319e-3); imp-35337 (dd-certified peak VALUE / 2.1e-5 margin); imp-3406 ' +
    '(interior MAX ~ 9.22e5, on double); imp-2642 (C_C = (1/8) sqrt(3 pi) ansatz); imp-398 (E_flow C_F prefactor); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN RvM inverse).',
};

export const IMP35470_SIGMA_PEAK_CURVATURE_5POINT_STENCIL_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-35337/imp-35411/imp-35450 peak landmark (N_max ~ 9.22e5, sigma_max ~ 0.94942901).
    id: 'imp35470-reproduces-imp35450-peak',
    description: 'argmax reproduces the interior peak N_max ~ 9.22e5, sigma_max ~ 0.949429',
    holds: () =>
      N_MAX > 5e5 && N_MAX < 2e6 && Math.abs(SIGMA_MAX - 0.94942901) < 1e-6,
  },
  {
    // Direct 5-point curvature lands near the raw 6.4319e-3.
    id: 'imp35470-direct-5point-curvature',
    description: 'direct 5-point O(h^4) curvature k ~ 6.4319102e-3',
    holds: () => Math.abs(K_5PT - 6.4319102e-3) < 5e-7,
  },
  {
    // The O(h^4) stencil is step-independent: max spread across the whole sweep is tiny (no drift, no Richardson).
    id: 'imp35470-5point-step-independent',
    description: '5-point curvature is step-independent across the FD sweep (max spread < 1e-9)',
    holds: () => K_5PT_MAX_SPREAD < 1e-9,
  },
  {
    // Headline cross-check: 5-point direct FD agrees with the imp-35411 width-inferred k to < 1e-5 relative.
    id: 'imp35470-5point-vs-width-agree',
    description: 'direct 5-point curvature agrees with the imp-35411 width-inferred k to < 1e-5 relative',
    holds: () => REL_AGREEMENT_WIDTH < 1e-5,
  },
  {
    // Honesty on the rounding: the direct route confirms the RAW 6.4319e-3, NOT the rounded 6.428e-3 headline.
    id: 'imp35470-confirms-raw-not-rounded',
    description: 'the 5-point k confirms the raw 6.4319e-3, not the rounded 6.428e-3 headline (off ~6e-4)',
    holds: () => REL_FROM_ROUNDED_HEADLINE > 1e-4 && Math.abs(K_5PT - 6.43191e-3) < 1e-6,
  },
  {
    // Honesty gate: measurement only, not rigorous, no QED, no refereed bound is changed, sub-gap imp-35337a named.
    id: 'imp35470-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, imp-35337a stays OPEN',
    holds: () =>
      IMP35470_SIGMA_PEAK_CURVATURE_5POINT_STENCIL.isRigorous === false &&
      /NO QED/.test(IMP35470_SIGMA_PEAK_CURVATURE_5POINT_STENCIL.verdict) &&
      /refereed bound is changed/i.test(IMP35470_SIGMA_PEAK_CURVATURE_5POINT_STENCIL.verdict) &&
      /imp-35337a/.test(IMP35470_SIGMA_PEAK_CURVATURE_5POINT_STENCIL.residual_sub_gap),
  },
];

for (const a of IMP35470_SIGMA_PEAK_CURVATURE_5POINT_STENCIL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35470-sigma-peak-curvature-5point-stencil assertion failed: ${a.id}`);
  }
}
