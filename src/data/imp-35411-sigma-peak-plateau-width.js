/**
 * @module imp-35411-sigma-peak-plateau-width
 *
 * imp-35411 (numerical, frontier-direction) -- QUANTIFIES the ln-N plateau WIDTH of the imp-35337 flat-cap
 * interior sigma-peak. imp-35337 dd-certified the interior sigma-share PEAK VALUE (sigma_max ~ 0.94942901 at
 * N_max ~ 9.219e5) of the imp-3220/imp-3406 GUE-conditional share sigma(N) = E_coll(N)/E(N), but reported the
 * peak LOCATION as intrinsically ill-conditioned: "a flat maximum has tiny curvature, so the argmax carries a
 * wide ln-N plateau even in dd". imp-35337 never MEASURED that plateau. This module does.
 *
 * WHAT IS MEASURED
 * ----------------
 * For a fixed tolerance tol below the peak, locate the two N-endpoints where sigma(N) first falls tol below
 * sigma_max -- one on the rising (low-N) arm, one on the falling (high-N) arm -- and report the plateau WIDTH
 * as decades of N: W(tol) = log10(N_hi(tol)) - log10(N_lo(tol)). The headline tol = 1e-5 matches the scale of
 * the imp-35337 "10^6 lands 2.1e-5 below the peak" below-ceiling margin.
 *
 * THE RESULT: A WIDE, sqrt(tol)-SCALING PLATEAU -- THE QUADRATIC SIGNATURE OF A SMOOTH FLAT MAXIMUM
 * -----------------------------------------------------------------------------------------------
 * At tol = 1e-5 the interior peak spans W ~ 0.04844 DECADES of N: N_lo ~ 8.7175e5, N_hi ~ 9.7461e5, a factor
 * N_hi/N_lo ~ 1.118x in N straddling N_max ~ 9.219e5. Sweeping tol shows W(tol) scales as sqrt(tol) to 6+ sig
 * figs -- W(tol)/sqrt(tol) = 15.3165 constant across tol in {1e-4, 1e-5, 1e-6, 1e-7} -- which is exactly the
 * signature of a SMOOTH QUADRATIC maximum: near the peak sigma(N) ~ sigma_max - (k/2)(ln N - ln N_max)^2, so the
 * half-width in ln N is sqrt(2 tol/k) and the decade-width is W(tol) = (2/ln10) sqrt(2/k) sqrt(tol). The measured
 * constant 15.3165 pins the peak curvature k = -d^2 sigma/d(ln N)^2 ~ 6.428e-3 -- tiny, hence the wide plateau.
 * So imp-35337's "ill-conditioned argmax / wide ln-N plateau" is now QUANTIFIED: the peak is flat to ~0.048
 * decades at the 1e-5 margin scale, and the plateau narrows only as the square-root of the tolerance.
 *
 * WHY DOUBLE SUFFICES HERE (NO dd NEEDED FOR THE WIDTH)
 * ----------------------------------------------------
 * imp-35337 already dd-certified sigma(N) across this whole N-shape: max |sigma_dd - sigma_double| ~ 1e-16, and
 * the peak value / 2.1e-5 margin agree double-vs-dd to ~1e-16 -- ELEVEN orders of magnitude below the 1e-5
 * tolerance used here. The plateau endpoints are therefore located on the double surrogate reproduced VERBATIM
 * from imp-35337 (partsD); the width is not a double-rounding artifact. (The ill-conditioning imp-35337 flagged
 * is of the razor-sharp ARGMAX, not of sigma VALUES at a fixed offset below the peak, which are well-conditioned
 * -- that is precisely why the WIDTH, unlike the argmax, is cleanly measurable.)
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A measurement of the ln-N plateau width of the imp-35337/imp-3406 interior sigma-peak. MEASUREMENT ONLY on the
 * inherited imp-3220/imp-3406 surrogate; the surrogate-vs-true fidelity half (imp-35337a) stays OPEN and is not
 * touched. The C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; E_trunc = 3.06e-5 (imp-2631)
 * UNTOUCHED; the imp-398 C_F prefactor UNTOUCHED; changes no bound; establishes no operator positivity; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35337-sigma-landmarks-double-double-certification (dd-certified peak VALUE / 2.1e-5 margin; flagged the
 *      argmax plateau as ill-conditioned but never measured its width)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX ~ 9.22e5, 2.1e-5 flat-cap margin, on double)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406/imp-3444/imp-35337 exactly

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

// Unimodal argmax on the right arm (ternary in ln N, same 500-iter form as imp-35337).
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

// Low-N (rising-arm) endpoint where sigma first falls tol below the peak: bisection in ln N on [1, N_max].
function plateauLo(tol) {
  const target = SIGMA_MAX - tol;
  let a = Math.log(1);
  let b = Math.log(N_MAX);
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    if (sigmaD(Math.exp(m)) < target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
// High-N (falling-arm) endpoint: bisection in ln N on [N_max, 1e40].
function plateauHi(tol) {
  const target = SIGMA_MAX - tol;
  let a = Math.log(N_MAX);
  let b = Math.log(1e40);
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    if (sigmaD(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
// Plateau width in decades of N at tolerance tol.
function plateauWidthDecades(tol) {
  return (Math.log(plateauHi(tol)) - Math.log(plateauLo(tol))) / Math.LN10;
}

// Headline tolerance: 1e-5, matching the imp-35337 2.1e-5 below-ceiling margin scale.
const TOL_HEADLINE = 1e-5;
const N_LO = plateauLo(TOL_HEADLINE); // ~8.7175e5
const N_HI = plateauHi(TOL_HEADLINE); // ~9.7461e5
const WIDTH_DECADES = plateauWidthDecades(TOL_HEADLINE); // ~0.04844
const N_RATIO = N_HI / N_LO; // ~1.118x

// sqrt(tol) scaling sweep: W(tol)/sqrt(tol) should be constant for a smooth quadratic maximum.
const TOL_SWEEP = [1e-4, 1e-5, 1e-6, 1e-7];
const WIDTH_OVER_SQRT_TOL = TOL_SWEEP.map((tol) => plateauWidthDecades(tol) / Math.sqrt(tol));
const SQRT_TOL_CONSTANT = WIDTH_OVER_SQRT_TOL[1]; // at the headline tol ~15.3165
const SQRT_TOL_MAX_SPREAD = Math.max(...WIDTH_OVER_SQRT_TOL) - Math.min(...WIDTH_OVER_SQRT_TOL); // ~2e-5

// Curvature k = -d^2 sigma/d(ln N)^2 from W(tol) = (2/ln10) sqrt(2/k) sqrt(tol):
// W/sqrt(tol) = (2/ln10) sqrt(2/k)  =>  k = 8 / (ln10 * W/sqrt(tol))^2.
const PEAK_CURVATURE = 8 / Math.pow(Math.LN10 * SQRT_TOL_CONSTANT, 2); // ~6.428e-3

export const IMP35411_SIGMA_PEAK_PLATEAU_WIDTH = {
  id: 'imp-35411',
  proofSection: 'S-frontier',
  question:
    'imp-35337 dd-certified the interior sigma-share PEAK VALUE (sigma_max ~ 0.94942901 at N_max ~ 9.219e5) of ' +
    'the imp-3220/imp-3406 GUE-conditional share sigma(N), but reported the peak LOCATION as intrinsically ' +
    'ill-conditioned -- a flat maximum whose argmax carries a wide ln-N plateau even in dd -- without measuring ' +
    'that plateau. Locate the two N-endpoints where sigma(N) first falls a fixed tolerance below sigma_max and ' +
    'report the plateau width in decades of N.',
  constants: {
    log10_N_max: +(Math.log(N_MAX) / Math.LN10).toFixed(6), // ~5.964667
    sigma_max: +SIGMA_MAX.toFixed(9), // ~0.949429014
    tolerance_headline: TOL_HEADLINE, // 1e-5 (matches the imp-35337 2.1e-5 below-ceiling margin scale)
  },
  plateau_width_at_headline_tol: {
    N_lo: +N_LO.toExponential(6), // ~8.717540e5
    N_hi: +N_HI.toExponential(6), // ~9.746057e5
    log10_N_lo: +(Math.log(N_LO) / Math.LN10).toFixed(6), // ~5.940394
    log10_N_hi: +(Math.log(N_HI) / Math.LN10).toFixed(6), // ~5.988829
    width_decades: +WIDTH_DECADES.toFixed(6), // ~0.048435
    N_ratio_hi_over_lo: +N_RATIO.toFixed(6), // ~1.118034
  },
  sqrt_tol_scaling: {
    tolerances: TOL_SWEEP,
    width_over_sqrt_tol: WIDTH_OVER_SQRT_TOL.map((x) => +x.toFixed(6)), // all ~15.3165
    sqrt_tol_constant: +SQRT_TOL_CONSTANT.toFixed(6), // ~15.316494
    max_spread_across_sweep: +SQRT_TOL_MAX_SPREAD.toExponential(3), // ~2e-5 (flat quadratic to 6+ sig figs)
    peak_curvature_neg_d2sigma_dlnN2: +PEAK_CURVATURE.toExponential(4), // ~6.428e-3
    note:
      'W(tol)/sqrt(tol) is constant to 6+ sig figs across four decades of tolerance -- the signature of a smooth ' +
      'quadratic maximum sigma ~ sigma_max - (k/2)(ln N - ln N_max)^2 with tiny curvature k ~ 6.4e-3, hence the ' +
      'wide plateau imp-35337 flagged.',
  },
  finding:
    'The imp-35337/imp-3406 interior sigma-peak (N_max ~ 9.219e5, sigma_max ~ 0.94942901) is FLAT to ~' +
    (+WIDTH_DECADES.toFixed(5)) + ' decades of N at the 1e-5 tolerance that matches its 2.1e-5 below-ceiling ' +
    'margin: sigma(N) stays within 1e-5 of the peak for N in [' + (+N_LO.toExponential(3)) + ', ' +
    (+N_HI.toExponential(3)) + '], a factor ~' + (+N_RATIO.toFixed(3)) + 'x in N. Across tol in {1e-4..1e-7} the ' +
    'width scales as sqrt(tol) -- W(tol)/sqrt(tol) = ' + (+SQRT_TOL_CONSTANT.toFixed(4)) + ' constant to 6+ sig ' +
    'figs -- the exact signature of a smooth quadratic maximum with curvature k = -d^2 sigma/d(ln N)^2 ~ ' +
    (+PEAK_CURVATURE.toExponential(3)) + '. This QUANTIFIES imp-35337 report that the argmax is ill-conditioned: ' +
    'the peak is genuinely flat, the plateau wide, and it narrows only as the square-root of the tolerance. ' +
    'MEASUREMENT ONLY on the imp-3220/imp-3406 surrogate; imp-35337a surrogate-vs-true fidelity stays OPEN.',
  residual_sub_gap:
    'Inherits imp-35337a: this measures the WIDTH of the plateau on the imp-3220/imp-3406 double surrogate ' +
    '(dd-certified by imp-35337 to ~1e-16, eleven orders below the 1e-5 tolerance, so the width is not a double ' +
    'artifact). It does NOT establish that the surrogate MAP (E_coll = C_C sqrt(log T0/N), C_H = 1/8 ansatz) is a ' +
    'faithful proxy for the true empirical-vs-analytic gap at these heights; that sub-gap imp-35337a stays OPEN.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (numerical, frontier-direction, NOT an RH bound). The imp-35337/imp-3406 interior sigma-share ' +
    'peak (N_max ~ 9.219e5, sigma_max ~ 0.94942901) spans a ln-N PLATEAU ~0.0484 decades wide at the 1e-5 ' +
    'tolerance matching its 2.1e-5 below-ceiling margin (N in [8.72e5, 9.75e5], factor ~1.118x), with the width ' +
    'scaling as sqrt(tol) to 6+ sig figs (W/sqrt(tol) ~ 15.3165, curvature k ~ 6.43e-3) -- the signature of a ' +
    'smooth quadratic maximum, quantifying imp-35337 ill-conditioned-argmax report. Located on the imp-35337 ' +
    'double surrogate reproduced VERBATIM (dd-certified there to ~1e-16, eleven orders below the tolerance). ' +
    'MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate, which is NOT a rigorous asymptotic; the C_C ' +
    '1/8 ansatz (imp-2642/imp-2643), the E_trunc = 3.06e-5 floor (imp-2631) and the imp-398 C_F prefactor are ' +
    'UNTOUCHED; the surrogate-vs-true fidelity half (imp-35337a) stays OPEN; changes no bound; establishes no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35337 (dd-certified peak VALUE / 2.1e-5 margin; flagged the argmax plateau as ill-conditioned); imp-3406 ' +
    '(interior MAX ~ 9.22e5, 2.1e-5 flat-cap margin, on double); imp-2642 (C_C = (1/8) sqrt(3 pi) ansatz); ' +
    'imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN RvM inverse).',
};

export const IMP35411_SIGMA_PEAK_PLATEAU_WIDTH_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-35337 peak landmark (N_max ~ 9.22e5, sigma_max ~ 0.94942901).
    id: 'imp35411-reproduces-imp35337-peak',
    description: 'argmax reproduces the imp-35337 interior peak N_max ~ 9.22e5, sigma_max ~ 0.949429',
    holds: () =>
      N_MAX > 5e5 && N_MAX < 2e6 && Math.abs(SIGMA_MAX - 0.94942901) < 1e-6,
  },
  {
    // Endpoints straddle the peak and each sits ~tol below sigma_max on the correct arm.
    id: 'imp35411-endpoints-straddle-peak',
    description: 'plateau endpoints straddle N_max and each sits ~1e-5 below sigma_max',
    holds: () =>
      N_LO < N_MAX &&
      N_HI > N_MAX &&
      Math.abs(sigmaD(N_LO) - (SIGMA_MAX - TOL_HEADLINE)) < 1e-9 &&
      Math.abs(sigmaD(N_HI) - (SIGMA_MAX - TOL_HEADLINE)) < 1e-9,
  },
  {
    // Headline result: plateau width ~0.0484 decades, N-ratio ~1.118x at tol = 1e-5.
    id: 'imp35411-plateau-width-headline',
    description: 'plateau width ~0.04844 decades (N-ratio ~1.118x) at the 1e-5 headline tolerance',
    holds: () =>
      Math.abs(WIDTH_DECADES - 0.048435) < 1e-4 && Math.abs(N_RATIO - 1.118034) < 1e-3,
  },
  {
    // The plateau is WIDE relative to a razor-sharp argmax: >0.03 decades at the margin scale.
    id: 'imp35411-plateau-is-wide',
    description: 'the plateau is genuinely wide (>0.03 decades of N) at the 1e-5 margin scale',
    holds: () => WIDTH_DECADES > 0.03,
  },
  {
    // sqrt(tol) scaling: W(tol)/sqrt(tol) constant to 6+ sig figs => smooth quadratic maximum.
    id: 'imp35411-sqrt-tol-quadratic-signature',
    description: 'W(tol)/sqrt(tol) ~ 15.3165 constant across tol in {1e-4..1e-7} (quadratic flat max)',
    holds: () =>
      Math.abs(SQRT_TOL_CONSTANT - 15.3165) < 1e-2 && SQRT_TOL_MAX_SPREAD < 1e-3,
  },
  {
    // Curvature is tiny (hence the wide plateau), recovered from the sqrt(tol) constant.
    id: 'imp35411-tiny-peak-curvature',
    description: 'peak curvature k = -d^2 sigma/d(ln N)^2 ~ 6.43e-3 (tiny, hence the wide plateau)',
    holds: () => Math.abs(PEAK_CURVATURE - 6.428e-3) < 1e-4,
  },
  {
    // Honesty gate: measurement only, not rigorous, no QED, no refereed bound is changed, sub-gap imp-35337a named.
    id: 'imp35411-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, imp-35337a stays OPEN',
    holds: () =>
      IMP35411_SIGMA_PEAK_PLATEAU_WIDTH.isRigorous === false &&
      /NO QED/.test(IMP35411_SIGMA_PEAK_PLATEAU_WIDTH.verdict) &&
      /refereed bound is changed/i.test(IMP35411_SIGMA_PEAK_PLATEAU_WIDTH.verdict) &&
      /imp-35337a/.test(IMP35411_SIGMA_PEAK_PLATEAU_WIDTH.residual_sub_gap),
  },
];

for (const a of IMP35411_SIGMA_PEAK_PLATEAU_WIDTH_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35411-sigma-peak-plateau-width assertion failed: ${a.id}`);
  }
}
