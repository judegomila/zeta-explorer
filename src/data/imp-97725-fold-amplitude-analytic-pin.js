/**
 * @module imp-97725-fold-amplitude-analytic-pin
 *
 * imp-97725 (numerical, frontier-direction): pin the imp-97662/imp-97683
 * square-root-fold amplitude
 *
 *     E = d(ln N)/d(ln C_C) ~ +/- K / sqrt(sigma_max - s),
 *         K = ( d sigma_max / d(ln C_C) ) / ( 2 sqrt(A) ),   A = -sigma_xx(x_peak)/2,
 *
 * ANALYTICALLY via the imp-97700 exact implicit-differentiation route, replacing the
 * imp-97662 bare finite differences and the imp-97683 least-squares fit with a
 * closed-form numerator and a curvature read from the SMOOTH component functions
 * (no bisected root, no finite-difference-of-a-quantized-root). Same inherited
 * imp-3406/imp-33582 surrogate component model; the pinned C_C 1/8 ansatz is
 * perturbed only conceptually (it enters E_coll as a bare prefactor), not re-pinned.
 *
 * THE EXACT NUMERATOR (closed form, no fit)
 * -----------------------------------------
 * Write sigma = E_coll/(R + E_coll) = 1/(1 + rho), rho = R/E_coll. C_C enters ONLY
 * as a bare multiplicative prefactor on E_coll = C_C * sqrt(L/N), so at fixed N
 * rho ~ 1/C_C and d(rho)/d(ln C_C) = -rho. The peak LOCATION x_peak is C_C-invariant
 * (imp-97598/imp-97661: a common prefactor on E_coll cannot move the maximiser of
 * E_coll/R), so d(x_peak)/d(ln C_C) = 0 and the peak height moves only through the
 * explicit prefactor:
 *
 *     d sigma_max / d(ln C_C) = -1/(1+rho)^2 * d(rho_min)/d(ln C_C)
 *                             = -1/(1+rho)^2 * (-rho_min)
 *                             = rho_min/(1+rho_min)^2
 *                             = sigma_max * (1 - sigma_max)     EXACTLY,
 *
 * using sigma_max = 1/(1+rho_min) so that rho_min/(1+rho_min)^2 = sigma_max(1-sigma_max).
 * At sigma_max = 0.9494290142 this gives 0.9494290142 * 0.0505709858 = 4.801356e-2,
 * matching the imp-97662 2-point / imp-97683 5-point measured value to all 6 figures
 * with NO finite difference. The numerator of K is therefore pinned in closed form.
 *
 * THE CURVATURE A (exact structure, height-mapping-limited value)
 * --------------------------------------------------------------
 * With phi = ln rho = ln R + x/2 - ln C_C - (1/2) ln L (x = ln N), the peak condition
 * phi_x(x_peak) = 0 is exactly the imp-97662 denominator 1 + 2 d(ln R)/dx - d(ln L)/dx
 * = 0. Since rho = e^phi, at the peak rho_x = 0 and rho_xx = phi_xx * rho_min, and
 * sigma_xx = -rho_xx/(1+rho)^2 (the (rho_x)^2 term vanishes at the peak), so
 *
 *     A = -sigma_xx(x_peak)/2 = phi_xx(x_peak) * rho_min/(2 (1+rho_min)^2)
 *                             = phi_xx(x_peak) * sigma_max(1-sigma_max) / 2,
 *     phi_xx = (ln R)_xx - (1/2)(ln L)_xx.
 *
 * phi_xx is a property of the SMOOTH R(N) and L(N) = ln T0(N) (T0 = effectiveHeightForN,
 * the Riemann-von Mangoldt inverse), so it is read directly from the component functions
 * -- the imp-97700 lesson: differentiate the smooth model, never a bisected root. There
 * is no bisection and no crossing, so no quantization floor. Numerically
 * phi_xx(x_peak) = 1.339604e-1 giving A = 3.215959e-3, matching the imp-97662 3-point
 * value 3.215950e-3 and the imp-97683 even-polynomial fit 3.215955e-3 to 6 figures.
 *
 * THE PINNED AMPLITUDE
 * --------------------
 * Substituting the exact numerator and the phi_xx curvature, the amplitude collapses to
 *
 *     K = sigma_max(1-sigma_max) / (2 sqrt(A))
 *       = sqrt( sigma_max(1-sigma_max) / (2 phi_xx(x_peak)) ),
 *
 * because A = phi_xx * sigma_max(1-sigma_max)/2 makes the S = sigma_max(1-sigma_max)
 * factor combine to a single square root. This gives K = 0.423330, reproducing the
 * imp-97662 measured / imp-97683 cross-checked value with a closed-form numerator and a
 * single smooth-model curvature -- no bare second difference and no least-squares fit.
 *
 * HONEST SUB-GAP: K IS NOT A UNIVERSAL CONSTANT (height-mapping-dependent denominator)
 * ----------------------------------------------------------------------------------
 * The NUMERATOR sigma_max(1-sigma_max) is pinned to a closed form. The DENOMINATOR
 * 2 sqrt(A) = sqrt(2 phi_xx(x_peak) * sigma_max(1-sigma_max)) still carries phi_xx, the
 * second log-derivative combination (ln R)_xx - (1/2)(ln L)_xx of the height mapping
 * T0(N) = effectiveHeightForN(N). That inverse Riemann-von Mangoldt map has no
 * elementary closed form, so phi_xx -- and hence K = 0.423330 -- is a numerical
 * property of the inherited imp-3406/imp-33582 surrogate curvature at this particular
 * peak, NOT a dimensionless universal constant. What is pinned analytically is the
 * STRUCTURE K = sqrt(S/(2 phi_xx)) with S = sigma_max(1-sigma_max) exact; the value
 * 0.4233 inherits the model dependence of phi_xx. Pinning K to a pure number would
 * require a closed-form peak curvature of the height mapping, which is not available.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound.
 * The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C
 * 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED (it enters only as a bare prefactor and
 * is not re-pinned); E_trunc pinned 3.06e-5 unchanged; changes no bound; establishes
 * no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-97662-cc-elasticity-peak-divergence (the fold law and first K route ~0.423330)
 * @see imp-97683-fold-amplitude-independent-crosscheck (second route: even-poly fit + 5-point)
 * @see imp-97700-gexp-identity-analytic-crossing (exact implicit-differentiation route, smooth model)
 * @see imp-97668-nonlinear-amplitude-audit (amplitude structure of the component model)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (L1 peak sigma_max ~ 0.949429)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5;
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97622/imp-97662 exactly

// EXACT imp-3406/imp-33582/imp-97622/imp-97662 sub-terms; C_C enters E_coll as a bare prefactor.
function parts(N, cc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = cc * Math.sqrt(L / N);
  const R = E_TRUNC_PT + E_flow;
  return { T0, L, R, E_coll, sigma: E_coll / (R + E_coll), rho: R / E_coll };
}

// Interior peak location (C_C-invariant): ternary search in x = ln N.
function peakLogN(cc) {
  let a = Math.log(1e4);
  let b = Math.log(1e8);
  for (let i = 0; i < 300; i++) {
    const m1 = a + (b - a) / 3;
    const m2 = b - (b - a) / 3;
    if (parts(Math.exp(m1), cc).sigma < parts(Math.exp(m2), cc).sigma) a = m1;
    else b = m2;
  }
  return (a + b) / 2;
}

// Second log-derivative of a SMOOTH component function in x = ln N (no crossing, no bisected root).
function d2LnDx2(fn, x, h) {
  const f = (k) => Math.log(fn(Math.exp(x + k * h)));
  return (-f(2) + 16 * f(1) - 30 * f(0) + 16 * f(-1) - f(-2)) / (12 * h * h);
}
// Direct second derivative of sigma in x (for the A cross-check).
function d2SigmaDx2(x, h, cc) {
  const s = (k) => parts(Math.exp(x + k * h), cc).sigma;
  return (-s(2) + 16 * s(1) - 30 * s(0) + 16 * s(-1) - s(-2)) / (12 * h * h);
}

const cc = C_C_PINNED;
const X_PEAK = peakLogN(cc);
const N_PEAK = Math.exp(X_PEAK);
const P_PEAK = parts(N_PEAK, cc);
const SIGMA_MAX = P_PEAK.sigma;
const RHO_MIN = P_PEAK.rho;

// ---- EXACT NUMERATOR: d sigma_max / d ln C_C = sigma_max (1 - sigma_max) (closed form) ----
const DSMAX_DLNCC_EXACT = SIGMA_MAX * (1 - SIGMA_MAX);

// ---- CURVATURE A via phi_xx on the SMOOTH model: A = phi_xx * sigma_max(1-sigma_max)/2 ----
const H = 1e-4;
const PHI_XX = d2LnDx2((n) => parts(n, cc).R, X_PEAK, H) - 0.5 * d2LnDx2((n) => parts(n, cc).L, X_PEAK, H);
const A_ANALYTIC = (PHI_XX * SIGMA_MAX * (1 - SIGMA_MAX)) / 2;
const A_DIRECT = -0.5 * d2SigmaDx2(X_PEAK, H, cc); // cross-check: direct sigma_xx

// ---- PINNED AMPLITUDE: K = numerator/(2 sqrt A) = sqrt( S / (2 phi_xx) ) ----
const K_FROM_A = DSMAX_DLNCC_EXACT / (2 * Math.sqrt(A_ANALYTIC));
const K_CLOSED = Math.sqrt(DSMAX_DLNCC_EXACT / (2 * PHI_XX)); // collapsed single-sqrt form

export const IMP97725_FOLD_AMPLITUDE_ANALYTIC_PIN = {
  id: 'imp-97725',
  proofSection: 'S-frontier',
  question:
    'Derive the imp-97662/imp-97683 square-root-fold amplitude K ~ 0.4233 analytically via the imp-97700 exact ' +
    'implicit-differentiation route -- a closed-form d sigma_max/d ln C_C and a curvature A = -sigma_xx(x_peak)/2 ' +
    'read from the SMOOTH component functions rather than bare finite differences or a least-squares fit -- and ' +
    'assess whether K is pinned to a closed form / stable value matching the measured 0.4233. Measurement/derivation ' +
    'only; C_C 1/8 ansatz untouched (enters as a bare prefactor); no bound moves; NO QED.',
  peak: {
    N_peak: +N_PEAK.toExponential(6), // ~9.218633e5
    sigma_max: +SIGMA_MAX.toFixed(10), // ~0.9494290142
    rho_min: +RHO_MIN.toExponential(6), // ~5.326463e-2
  },
  numeratorExact: {
    form: 'd sigma_max / d ln C_C = sigma_max (1 - sigma_max)  [rho ~ 1/C_C, x_peak C_C-invariant]',
    value: +DSMAX_DLNCC_EXACT.toExponential(6), // ~4.801356e-2 -- closed form, no finite difference
    imp97662_imp97683_measured: 4.801356e-2,
  },
  curvature: {
    form: 'A = -sigma_xx(x_peak)/2 = phi_xx(x_peak) * sigma_max(1-sigma_max)/2,  phi_xx = (lnR)_xx - (1/2)(lnL)_xx',
    phi_xx: +PHI_XX.toExponential(6), // ~1.339604e-1 (smooth-model second log-derivative)
    A_analytic: +A_ANALYTIC.toExponential(6), // ~3.215959e-3
    A_direct_sigma_xx: +A_DIRECT.toExponential(6), // ~3.215942e-3 cross-check
    imp97662_3point: 3.21595e-3,
    imp97683_evenfit: 3.215955e-3,
  },
  amplitude: {
    form: 'K = [sigma_max(1-sigma_max)] / (2 sqrt(A)) = sqrt( sigma_max(1-sigma_max) / (2 phi_xx) )',
    K_from_A: +K_FROM_A.toFixed(6), // ~0.423330
    K_closed_single_sqrt: +K_CLOSED.toFixed(6), // ~0.423330 (identical collapsed form)
    K_measured: 0.42333,
  },
  finding:
    'The imp-97662/imp-97683 fold amplitude K = 0.423330 is reproduced with NO finite-difference numerator and NO ' +
    'least-squares fit. The peak-height sensitivity is pinned in closed form: since C_C enters E_coll only as a ' +
    'bare prefactor (rho = R/E_coll ~ 1/C_C) and the peak LOCATION is C_C-invariant, d sigma_max/d ln C_C = ' +
    'rho_min/(1+rho_min)^2 = sigma_max(1-sigma_max) = 4.801356e-2 EXACTLY, matching the measured value to all 6 ' +
    'figures. The curvature carries an exact structure A = phi_xx(x_peak) * sigma_max(1-sigma_max)/2 with phi_xx = ' +
    '(ln R)_xx - (1/2)(ln L)_xx read directly from the SMOOTH R(N), L(N) (no bisected root, no quantization floor, ' +
    'per imp-97700); phi_xx = 1.339604e-1 gives A = 3.215959e-3, matching the imp-97662 3-point 3.21595e-3 and the ' +
    'imp-97683 even-poly fit 3.215955e-3. Hence K = sigma_max(1-sigma_max)/(2 sqrt(A)) = sqrt(sigma_max(1-sigma_max)' +
    '/(2 phi_xx)) = 0.423330. HONEST SUB-GAP: K is NOT a universal constant -- only its NUMERATOR is closed form; ' +
    'the denominator 2 sqrt(A) still carries phi_xx, a second log-derivative of the Riemann-von Mangoldt inverse ' +
    'height map T0(N), which has no elementary closed form. So K = 0.4233 is a numerical property of the inherited ' +
    'imp-3406 surrogate curvature at this peak, and what is pinned analytically is the structure K = sqrt(S/(2 ' +
    'phi_xx)) with S = sigma_max(1-sigma_max) exact, not a pure number.',
  isRigorous: false,
  verdict:
    'DERIVATION + MEASUREMENT (frontier-direction, NOT rigorous). The imp-97662/imp-97683 square-root-fold ' +
    'amplitude K = 0.423330 is pinned to the closed structure K = sigma_max(1-sigma_max)/(2 sqrt(A)) = ' +
    'sqrt(sigma_max(1-sigma_max)/(2 phi_xx)) via the imp-97700 implicit-differentiation route: the NUMERATOR ' +
    'd sigma_max/d ln C_C = sigma_max(1-sigma_max) = 4.801356e-2 is EXACT (C_C is a bare E_coll prefactor and ' +
    'x_peak is C_C-invariant), and the curvature A = phi_xx * sigma_max(1-sigma_max)/2 is read from the smooth ' +
    'R(N), L(N) with no bisected root, giving A = 3.215959e-3 matching both prior routes. SUB-GAP (does not close): ' +
    'K is NOT a universal constant -- the denominator carries phi_xx = (ln R)_xx - (1/2)(ln L)_xx, a second ' +
    'log-derivative of the Riemann-von Mangoldt inverse height map with no elementary closed form, so K = 0.4233 ' +
    'inherits the surrogate curvature; the analytic pin is the structure, not a pure number. Component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 and the ' +
    'C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; E_trunc pinned 3.06e-5 unchanged; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97662 (fold law, first K route ~0.423330); imp-97683 (second route: even-poly fit + 5-point); imp-97700 ' +
    '(implicit-differentiation route, differentiate the smooth model); imp-97668 (amplitude structure); imp-97520 ' +
    '(L1 peak sigma_max ~ 0.949429); imp-97598/imp-97661 (peak-location C_C-invariance); imp-2642/imp-2643 ' +
    '(C_C = (1/8) sqrt(3 pi) ansatz); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP97725_FOLD_AMPLITUDE_ANALYTIC_PIN_ASSERTIONS = [
  {
    id: 'imp97725-numerator-closed-form-matches-measured',
    description: 'the exact numerator sigma_max(1-sigma_max) reproduces the measured d sigma_max/d ln C_C ~ 4.801356e-2',
    holds: () => Math.abs(DSMAX_DLNCC_EXACT - 4.801356e-2) < 5e-8,
  },
  {
    id: 'imp97725-numerator-equals-rho-identity',
    description: 'sigma_max(1-sigma_max) equals rho_min/(1+rho_min)^2 (the implicit-differentiation identity)',
    holds: () => Math.abs(DSMAX_DLNCC_EXACT - RHO_MIN / (1 + RHO_MIN) ** 2) < 1e-14,
  },
  {
    id: 'imp97725-curvature-phi-route-matches-direct-and-prior',
    description: 'A from phi_xx * sigma_max(1-sigma_max)/2 matches the direct sigma_xx and the imp-97662/imp-97683 A',
    holds: () =>
      Math.abs(A_ANALYTIC - A_DIRECT) < 1e-7 && Math.abs(A_ANALYTIC - 3.21595e-3) < 5e-8,
  },
  {
    id: 'imp97725-K-pinned-matches-measured',
    description: 'the analytic K = numerator/(2 sqrt A) = sqrt(S/(2 phi_xx)) reproduces the measured 0.423330',
    holds: () =>
      Math.abs(K_FROM_A - 0.42333) < 5e-4 && Math.abs(K_FROM_A - K_CLOSED) < 1e-9,
  },
  {
    id: 'imp97725-honesty-gate-no-qed',
    description: 'derivation only: isRigorous false, no QED, no refereed bound is changed, ansatz untouched',
    holds: () =>
      IMP97725_FOLD_AMPLITUDE_ANALYTIC_PIN.isRigorous === false &&
      /NO QED/.test(IMP97725_FOLD_AMPLITUDE_ANALYTIC_PIN.verdict) &&
      /refereed bound is changed/i.test(IMP97725_FOLD_AMPLITUDE_ANALYTIC_PIN.verdict) &&
      /SUB-GAP/.test(IMP97725_FOLD_AMPLITUDE_ANALYTIC_PIN.verdict),
  },
];

for (const a of IMP97725_FOLD_AMPLITUDE_ANALYTIC_PIN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97725-fold-amplitude-analytic-pin assertion failed: ${a.id}`);
  }
}
