/**
 * @module imp-35451-sigma-peak-arm-asymmetry
 *
 * imp-35451 (accuracy, frontier-direction) -- QUANTIFIES the rising-vs-falling arm ASYMMETRY of the
 * imp-35411/imp-35337 interior sigma-share peak: it extracts the leading CUBIC (skew) coefficient of
 * sigma(u) about u0 = ln N_max by a direct third-derivative finite difference, and cross-checks it against
 * the measured arm-width imbalance W_rise(tol) - W_fall(tol) across tol in {1e-4 .. 1e-7}.
 *
 * WHAT imp-35411 LEFT OPEN
 * ------------------------
 * imp-35411 tabulated the interior sigma-peak plateau endpoints (at tol = 1e-5, N_lo ~ 8.7175e5 and
 * N_hi ~ 9.7461e5) around N_max ~ 9.219e5 but never quantified that these two endpoints straddle the peak
 * UNEQUALLY. In log10 N the low (rising) arm sits ~0.02427 decades below the peak and the high (falling) arm
 * ~0.02416 above -- the rising arm is slightly WIDER. A pure quadratic flat-max model
 * sigma(u0+d) ~ sigma_max - (k/2) d^2 is exactly symmetric, so any arm imbalance is a signature of a nonzero
 * CUBIC term. imp-35411 recorded the imbalance implicitly (in its endpoint table) but never measured the
 * cubic coefficient that produces it. This module does.
 *
 * WHAT IS MEASURED
 * ----------------
 * On the SAME imp-35337 partsD double surrogate reproduced VERBATIM from imp-35411/imp-35450:
 *   (1) The two plateau half-widths in decades, W_rise(tol) = log10(N_max) - log10(N_lo) and
 *       W_fall(tol) = log10(N_hi) - log10(N_max), across tol in {1e-4, 1e-5, 1e-6, 1e-7}. The rising arm is
 *       wider at every tol; the signed imbalance W_rise - W_fall is POSITIVE and scales LINEARLY in tol
 *       (slope A_skew ~ 11.02 decades per unit tol), while the width RATIO W_rise/W_fall decays toward 1
 *       (1.01449 at 1e-4 -> 1.00044 at 1e-7) as sqrt(tol) -> 0.
 *   (2) The leading cubic coefficient c3 of the Taylor expansion sigma(u0 + d) ~ sigma_max - (k/2) d^2 + c3 d^3
 *       via the direct 5-point third-derivative stencil
 *       sigma'''(u0) ~ [sig(u0+2h) - 2 sig(u0+h) + 2 sig(u0-h) - sig(u0-2h)] / (2 h^3), c3 = sigma'''(u0)/6.
 *       Swept over h and Richardson-extrapolated, sigma'''(u0) -> -1.574206e-3, so c3 -> -2.623677e-4
 *       (NEGATIVE: the cubic drops the falling arm faster and the rising arm slower, so at a fixed depth tol
 *       the rising arm reaches further -- exactly the measured W_rise > W_fall sign).
 *
 * THE CROSS-CHECK: THE CUBIC COEFFICIENT PREDICTS THE ARM IMBALANCE SLOPE
 * ----------------------------------------------------------------------
 * Perturbing the cubic root balance sigma_max - tol = sigma_max - (k/2) d^2 + c3 d^3 gives, to leading order,
 * a rising-minus-falling half-width imbalance in ln N of (-4 c3 / k^2) tol, i.e. in decades
 *   A_skew_pred = -4 c3 / (k^2 ln10).
 * With k = 6.43191e-3 (imp-35450) and c3 = -2.6237e-4 this predicts A_skew_pred ~ 11.017, matching the
 * DIRECTLY-measured slope A_skew ~ 11.015 (from the well-resolved tol = 1e-5 endpoints) to ~2.5e-4 relative.
 * So the two INDEPENDENT routes -- the local third derivative at the peak and the far-field arm-width
 * imbalance -- pin the SAME cubic skew, closing the loop imp-35411 left open.
 *
 * GENUINE SURROGATE FEATURE, NOT A DOUBLE-ROUNDING ARTIFACT
 * --------------------------------------------------------
 * imp-35337 dd-certified sigma(N) across this N-shape to ~1e-16. The third-derivative stencil is stable to
 * ~3e-5 relative across h in {2e-2 .. 1e-3} (the h^3-scale FD cancellation error ~ 1e-16 / h^3 ~ 1e-7
 * relative at h = 1e-3, well below the ~3e-5 spread), and the arm imbalance W_rise - W_fall ~ 2.5e-3 in ln N
 * at tol = 1e-4 is thirteen orders above the dd bound. The cubic skew is therefore a genuine feature of the
 * imp-3220/imp-3406 surrogate, not a double artifact.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A direct measurement of the CUBIC (skew) coefficient of the imp-35337/imp-3406 interior sigma-peak and a
 * cross-check that it reproduces the imp-35411 endpoint arm-asymmetry. MEASUREMENT ONLY on the inherited
 * imp-3220/imp-3406 double surrogate; the surrogate-vs-true fidelity half (imp-35337a) stays OPEN and is not
 * touched. The C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; E_trunc = 3.06e-5 (imp-2631)
 * UNTOUCHED; the imp-398 C_F prefactor UNTOUCHED; changes no bound; establishes no operator positivity; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35411-sigma-peak-plateau-width (recorded the asymmetric endpoints; never measured the cubic)
 * @see imp-35450-sigma-peak-curvature-direct-fd (direct k = -sigma''(u0) ~ 6.43191e-3, the quadratic term)
 * @see imp-35492-sigma-peak-plateau-arm-sqrt-law (the arm-difference LINEAR-in-tol law W_rise - W_fall ~ A_skew tol)
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

const sigU = (u) => sigmaD(Math.exp(u));

// Plateau endpoints at depth tol below the peak (same bisection form as imp-35411/imp-35450).
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

// (1) ARM HALF-WIDTHS in decades across tol, and the signed imbalance / ratio.
const TOLS = [1e-4, 1e-5, 1e-6, 1e-7];
const ARM_TABLE = TOLS.map((tol) => {
  const nLo = plateauLo(tol);
  const nHi = plateauHi(tol);
  const wRise = (U0 - Math.log(nLo)) / Math.LN10; // low / rising arm half-width (decades)
  const wFall = (Math.log(nHi) - U0) / Math.LN10; // high / falling arm half-width (decades)
  return {
    tol,
    n_lo: +nLo.toExponential(5),
    n_hi: +nHi.toExponential(5),
    w_rise_decades: +wRise.toExponential(6),
    w_fall_decades: +wFall.toExponential(6),
    imbalance_decades: +(wRise - wFall).toExponential(5), // W_rise - W_fall (POSITIVE)
    ratio: +(wRise / wFall).toFixed(7), // W_rise / W_fall (-> 1 as tol -> 0)
    a_skew_per_tol: +((wRise - wFall) / tol).toFixed(5), // slope of the LINEAR-in-tol imbalance
  };
});
// Directly-measured imbalance slope from the WELL-RESOLVED tol = 1e-5 endpoints (imp-35492 resolvable window).
const A_SKEW_MEASURED = ARM_TABLE[1].a_skew_per_tol; // ~11.015 decades per unit tol

// (2) DIRECT CUBIC coefficient c3 = sigma'''(u0)/6 via the 5-point third-derivative stencil in u = ln N.
function d3FD(h) {
  return (sigU(U0 + 2 * h) - 2 * sigU(U0 + h) + 2 * sigU(U0 - h) - sigU(U0 - 2 * h)) / (2 * h * h * h);
}
const D3_STEPS = [1e-1, 5e-2, 2e-2, 1e-2, 5e-3, 2e-3, 1e-3];
const D3_VALUES = D3_STEPS.map(d3FD);
// Stability spread of the stencil over the resolvable window h in {2e-2 .. 1e-3} (indices 2..6).
const D3_WINDOW = D3_VALUES.slice(2);
const D3_REL_SPREAD = (Math.max(...D3_WINDOW) - Math.min(...D3_WINDOW)) / Math.abs(D3_VALUES[D3_VALUES.length - 1]);
// Richardson extrapolation (eliminates the leading O(h^2) stencil bias) from the h = 2e-2 / 1e-2 pair.
const SIGMA_TRIPLE_PRIME = (4 * d3FD(1e-2) - d3FD(2e-2)) / 3; // ~ -1.574206e-3
const C3 = SIGMA_TRIPLE_PRIME / 6; // ~ -2.623677e-4 (NEGATIVE -> rising arm wider)

// Quadratic curvature k = -sigma''(u0) (imp-35450), needed for the cubic->imbalance prediction.
const K_CURVATURE = -(sigU(U0 + 1e-2) - 2 * sigU(U0) + sigU(U0 - 1e-2)) / (1e-2 * 1e-2); // ~6.43191e-3

// (3) CROSS-CHECK: the cubic coefficient PREDICTS the arm-imbalance slope.
// Perturbing the cubic root balance gives W_rise - W_fall ~ (-4 c3 / k^2) tol in ln N, /ln10 in decades.
const A_SKEW_PREDICTED = (-4 * C3) / (K_CURVATURE * K_CURVATURE * Math.LN10); // ~11.017
const A_SKEW_REL_AGREEMENT = Math.abs(A_SKEW_PREDICTED - A_SKEW_MEASURED) / A_SKEW_PREDICTED; // ~2.5e-4

export const IMP35451_SIGMA_PEAK_ARM_ASYMMETRY = {
  id: 'imp-35451',
  proofSection: 'S-frontier',
  question:
    'imp-35411 tabulated the interior sigma-peak plateau endpoints (N_lo ~ 8.7175e5, N_hi ~ 9.7461e5 at ' +
    'tol = 1e-5) around N_max ~ 9.219e5 but never quantified that they straddle the peak UNEQUALLY -- the ' +
    'rising arm is slightly wider, a signature of a nonzero CUBIC term. Measure the log10-N offsets of both ' +
    'arms across tol in {1e-4 .. 1e-7}, extract the leading cubic coefficient of sigma about ln N_max, and ' +
    'assess whether the asymmetry is a genuine surrogate feature or a double-rounding artifact.',
  constants: {
    log10_N_max: +(U0 / Math.LN10).toFixed(6), // ~5.964667
    sigma_max: +SIGMA_MAX.toFixed(9), // ~0.949429014
    ln_N_max: +U0.toFixed(6), // ~13.734152
    k_curvature: +K_CURVATURE.toExponential(6), // ~6.431916e-3 (imp-35450 quadratic term)
  },
  arm_asymmetry: {
    tols: TOLS,
    table: ARM_TABLE,
    note:
      'W_rise = log10(N_max) - log10(N_lo), W_fall = log10(N_hi) - log10(N_max). The rising arm is WIDER at ' +
      'every tol (imbalance W_rise - W_fall > 0). The imbalance scales LINEARLY in tol (slope A_skew ~ 11.02 ' +
      'decades per unit tol on the resolvable tols), while the ratio W_rise/W_fall decays toward 1 as ' +
      'sqrt(tol) -> 0 (1.01449 at 1e-4 -> 1.00044 at 1e-7) -- the skew VANISHES relative to the width.',
  },
  cubic_coefficient: {
    d3_steps_in_lnN: D3_STEPS,
    d3_values: D3_VALUES.map((d) => +d.toExponential(6)),
    sigma_triple_prime_richardson: +SIGMA_TRIPLE_PRIME.toExponential(7), // ~ -1.574206e-3
    c3_cubic_coefficient: +C3.toExponential(7), // ~ -2.623677e-4
    d3_rel_spread_resolvable_window: +D3_REL_SPREAD.toExponential(3), // ~3.3e-5
    note:
      'Cubic coefficient c3 = sigma-triple-prime(u0)/6 of sigma(u0+d) ~ sigma_max - (k/2) d^2 + c3 d^3, from ' +
      'the 5-point third-difference stencil, Richardson-extrapolated. c3 < 0: the cubic drops the falling arm ' +
      'faster and the rising arm slower, so at a fixed depth tol the rising arm reaches further -- the measured ' +
      'W_rise > W_fall sign. The stencil is stable to ~3e-5 relative across h in {2e-2 .. 1e-3}, far above the ' +
      'imp-35337 dd noise floor (~1e-16/h^3 ~ 1e-7 relative at h = 1e-3), so the skew is NOT a double artifact.',
  },
  cross_check_cubic_predicts_imbalance: {
    a_skew_measured_tol1e5: +A_SKEW_MEASURED.toFixed(5), // ~11.015 (from the tol = 1e-5 endpoints)
    a_skew_predicted_from_c3: +A_SKEW_PREDICTED.toFixed(5), // ~11.017 (= -4 c3 / (k^2 ln10))
    rel_agreement: +A_SKEW_REL_AGREEMENT.toExponential(3), // ~2.5e-4
    note:
      'Perturbing the cubic root balance sigma_max - tol = sigma_max - (k/2) d^2 + c3 d^3 predicts an arm ' +
      'imbalance W_rise - W_fall ~ (-4 c3 / k^2) tol in ln N, i.e. slope A_skew_pred = -4 c3 / (k^2 ln10) in ' +
      'decades. The predicted slope (~11.017) matches the directly-measured slope (~11.015) to ~2.5e-4 ' +
      'relative -- the local third derivative and the far-field arm imbalance pin the SAME cubic skew.',
  },
  finding:
    'The interior sigma-peak (sigma_max ~ 0.94942901 at N_max ~ 9.219e5) is NOT symmetric about ln N_max: the ' +
    'rising (low-N) arm is wider than the falling (high-N) arm at every depth tol, with a POSITIVE imbalance ' +
    'W_rise - W_fall that scales LINEARLY in tol (slope A_skew ~ 11.02 decades/tol) while the width ratio ' +
    'decays toward 1 as sqrt(tol) -> 0. This skew is produced by a NEGATIVE cubic coefficient ' +
    'c3 = sigma-triple-prime(u0)/6 ~ ' + (+C3.toExponential(6)) + ', measured directly by a 5-point ' +
    'third-difference stencil (sigma-triple-prime ~ ' + (+SIGMA_TRIPLE_PRIME.toExponential(6)) + ', ' +
    'Richardson-extrapolated, stable to ~3e-5 relative). The cubic coefficient PREDICTS the measured arm ' +
    'imbalance slope via A_skew = -4 c3 / (k^2 ln10) ~ ' + (+A_SKEW_PREDICTED.toFixed(3)) + ', agreeing with the ' +
    'directly-measured ~' + (+A_SKEW_MEASURED.toFixed(3)) + ' to ~' + (+A_SKEW_REL_AGREEMENT.toExponential(1)) +
    ' relative -- two independent routes pinning the same skew. The asymmetry is a genuine feature of the ' +
    'imp-3220/imp-3406 surrogate (thirteen orders above the imp-35337 dd bound), NOT a double-rounding ' +
    'artifact. MEASUREMENT ONLY; imp-35337a stays OPEN.',
  residual_sub_gap:
    'Inherits imp-35337a: this measures the CUBIC skew of the peak on the imp-3220/imp-3406 double surrogate ' +
    '(dd-certified by imp-35337 to ~1e-16, so the h^3-scale third-difference cancellation error ~1e-7 relative ' +
    'at the smallest step is far below the ~3e-5 stencil spread reported -- not a double artifact). It does NOT ' +
    'establish that the surrogate MAP (E_coll = C_C sqrt(log T0/N), C_H = 1/8 ansatz) is a faithful proxy for ' +
    'the true empirical-vs-analytic gap at these heights; that sub-gap imp-35337a stays OPEN.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (numerical, frontier-direction, NOT an RH bound). The imp-35337/imp-3406 interior sigma-share ' +
    'peak at N_max ~ 9.219e5 is asymmetric: the rising arm is wider than the falling arm, with a POSITIVE ' +
    'imbalance W_rise - W_fall linear in tol (slope ~11.02 decades/tol) and a width ratio decaying to 1 as ' +
    'sqrt(tol) -> 0. The skew is produced by a NEGATIVE cubic coefficient c3 ~ -2.6237e-4 ' +
    '(sigma-triple-prime ~ -1.574206e-3), measured directly by a 5-point third-difference stencil ' +
    '(Richardson-extrapolated, stable to ~3e-5 relative), which PREDICTS the measured arm-imbalance slope via ' +
    'A_skew = -4 c3 / (k^2 ln10) ~ 11.02 to ~2.5e-4 relative -- two independent routes pinning the same skew. ' +
    'Located on the imp-35337 double surrogate reproduced VERBATIM (dd-certified there to ~1e-16, thirteen ' +
    'orders below the arm imbalance). MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate, which is ' +
    'NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643), the E_trunc = 3.06e-5 floor (imp-2631) ' +
    'and the imp-398 C_F prefactor are UNTOUCHED; the surrogate-vs-true fidelity half (imp-35337a) stays OPEN; ' +
    'changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35411 (recorded the asymmetric endpoints; never measured the cubic); imp-35450 (direct quadratic ' +
    'curvature k ~ 6.43191e-3); imp-35492 (arm-difference linear-in-tol law); imp-35337 (dd-certified peak ' +
    'VALUE / 2.1e-5 margin); imp-3406 (interior MAX ~ 9.22e5, on double); imp-2642 (C_C = (1/8) sqrt(3 pi) ' +
    'ansatz); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN RvM inverse).',
};

export const IMP35451_SIGMA_PEAK_ARM_ASYMMETRY_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-35337/imp-35411 peak landmark (N_max ~ 9.22e5, sigma_max ~ 0.94942901).
    id: 'imp35451-reproduces-imp35411-peak',
    description: 'argmax reproduces the imp-35337/imp-35411 interior peak N_max ~ 9.22e5, sigma_max ~ 0.949429',
    holds: () =>
      N_MAX > 5e5 && N_MAX < 2e6 && Math.abs(SIGMA_MAX - 0.94942901) < 1e-6,
  },
  {
    // Rising arm is WIDER than the falling arm at every tol (positive imbalance) -- the asymmetry itself.
    id: 'imp35451-rising-arm-wider',
    description: 'W_rise > W_fall (positive arm imbalance) at every tol -- the peak is asymmetric',
    holds: () => ARM_TABLE.every((r) => r.imbalance_decades > 0 && r.ratio > 1),
  },
  {
    // Endpoint reproduction: at tol = 1e-5 the arms match the imp-35411 N_lo ~ 8.7175e5 / N_hi ~ 9.7461e5.
    id: 'imp35451-reproduces-imp35411-endpoints',
    description: 'tol=1e-5 endpoints reproduce imp-35411 N_lo ~ 8.7175e5 and N_hi ~ 9.7461e5',
    holds: () =>
      Math.abs(ARM_TABLE[1].n_lo - 8.7175e5) < 2e2 && Math.abs(ARM_TABLE[1].n_hi - 9.7461e5) < 2e2,
  },
  {
    // The imbalance is LINEAR in tol: slope A_skew ~ 11 decades/tol, near-constant across the resolvable tols.
    id: 'imp35451-imbalance-linear-in-tol',
    description: 'W_rise - W_fall scales linearly in tol with slope A_skew ~ 11 decades/tol (well-resolved tols)',
    holds: () =>
      A_SKEW_MEASURED > 10 && A_SKEW_MEASURED < 12 &&
      Math.abs(ARM_TABLE[0].a_skew_per_tol - ARM_TABLE[1].a_skew_per_tol) < 0.1,
  },
  {
    // Direct cubic coefficient: c3 < 0 near -2.6237e-4, sigma-triple-prime near -1.5742e-3.
    id: 'imp35451-cubic-coefficient',
    description: 'direct 5-point third-difference gives c3 ~ -2.6237e-4 (sigma-triple-prime ~ -1.5742e-3), c3 < 0',
    holds: () =>
      C3 < 0 && Math.abs(C3 - -2.62368e-4) < 5e-8 &&
      Math.abs(SIGMA_TRIPLE_PRIME - -1.574206e-3) < 5e-7,
  },
  {
    // Cross-check: the cubic coefficient predicts the measured arm-imbalance slope to < 1e-2 relative.
    id: 'imp35451-cubic-predicts-imbalance',
    description: 'A_skew from -4 c3/(k^2 ln10) agrees with the directly-measured imbalance slope to < 1e-2 relative',
    holds: () => A_SKEW_REL_AGREEMENT < 1e-2 && A_SKEW_PREDICTED > 10 && A_SKEW_PREDICTED < 12,
  },
  {
    // Not a double artifact: the third-difference stencil is stable to < 1e-3 relative over the resolvable window.
    id: 'imp35451-not-a-double-artifact',
    description: 'third-difference stencil stable to < 1e-3 relative over h in {2e-2 .. 1e-3} -- above the dd floor',
    holds: () => D3_REL_SPREAD < 1e-3,
  },
  {
    // Honesty gate: measurement only, not rigorous, no QED, no refereed bound is changed, sub-gap imp-35337a named.
    id: 'imp35451-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, imp-35337a stays OPEN',
    holds: () =>
      IMP35451_SIGMA_PEAK_ARM_ASYMMETRY.isRigorous === false &&
      /NO QED/.test(IMP35451_SIGMA_PEAK_ARM_ASYMMETRY.verdict) &&
      /refereed bound is changed/i.test(IMP35451_SIGMA_PEAK_ARM_ASYMMETRY.verdict) &&
      /imp-35337a/.test(IMP35451_SIGMA_PEAK_ARM_ASYMMETRY.residual_sub_gap),
  },
];

for (const a of IMP35451_SIGMA_PEAK_ARM_ASYMMETRY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35451-sigma-peak-arm-asymmetry assertion failed: ${a.id}`);
  }
}
