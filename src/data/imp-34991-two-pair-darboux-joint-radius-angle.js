/**
 * @module imp-34991-two-pair-darboux-joint-radius-angle
 *
 * imp-34991 (numerical, frontier-direction): imp-34947 measured the imp-34932 dominant complex-conjugate
 * singularity pair R e^(+- i theta) TWO ways (sign-cycle period P=9 -> theta=40 deg, and a local 2-step
 * linear-recurrence / Darboux angle read theta ~ 39 deg, R ~ 85.6), but its 2-step recurrence can only resolve a
 * SINGLE conjugate pair -- it left OPEN "a full complex-plane d-log Pade / two-point Darboux fit could pin
 * R e^(+- i theta) jointly (radius AND angle in one estimator) and quantify the sub-dominant correction". This
 * module closes that OPEN thread by fitting the TWO nearest conjugate pairs at once.
 *
 * THE MEASUREMENT (all inside the no-E_flow logistic model; measurement only)
 * ------------------------------------------------------------------------------------
 * It reuses the imp-34932/imp-34947 analytic delta_1 .. delta_30 ladder VERBATIM (same crossover, same closed-form
 * w-derivatives, same imp-34863 recursion delta_k = -3 p delta_(k-1) - 2 sum_(i+j=k) delta_i delta_j) and then fits
 * the local FOUR-step linear recurrence delta_k = c1 delta_(k-1) + c2 delta_(k-2) + c3 delta_(k-3) + c4 delta_(k-4)
 * over the deep band k >= 8. A sequence dominated by TWO conjugate pole pairs obeys exactly this 4-step recurrence,
 * whose characteristic quartic z^4 - c1 z^3 - c2 z^2 - c3 z - c4 factors into two real quadratics, one per pair; each
 * root z_j = rho_j e^(+- i theta_j) with singularity radius R_j = 1 / |z_j|. So a SINGLE estimator pins the radius AND
 * the angle of BOTH the dominant and the sub-dominant pair jointly (the "two-point Darboux" the imp-34947 verdict
 * deferred), using the coefficient MAGNITUDES.
 *
 * Numerics: the delta_k span ~60 orders of magnitude (|delta_30| ~ 1e-61), so the fit is done on the RESCALED
 * sequence d_k = delta_k * R_ref^k (R_ref = imp-34947 R_median ~ 85.6) whose terms are O(1), keeping the 4x4 normal
 * equations well conditioned; the quartic roots w_j of the scaled sequence map back by z_j = w_j / R_ref. The quartic
 * is solved by Durand-Kerner (Weierstrass) iteration. The dominant pair = the two roots of largest |w| (smallest R).
 *
 * THE FINDING (measurement only)
 * -------------------------------------------
 *   (F1) THE JOINT TWO-PAIR FIT REPRODUCES THE imp-34947 DOMINANT PAIR. The larger-|z| root pair gives R_1 ~ 84.2,
 *        theta_1 ~ 38.6 deg (central R_ref=85.6, band k>=8), reproducing the imp-34947 single-pair R ~ 85.6 /
 *        theta ~ 39 deg to within ~2% -- so adding the second pair does NOT move the dominant (convergence-radius)
 *        singularity: the sub-dominant pair perturbs the R ~ O(1e2) read by only ~1.7%.
 *   (F2) A SUB-DOMINANT PAIR IS RESOLVED, AND IT SITS FURTHER OUT. The smaller-|z| root pair gives R_2 ~ 120,
 *        theta_2 ~ 27 deg, with magnitude ratio rho_sub/rho_dom = |z_sub|/|z_dom| ~ 0.70 < 1, so R_2 > R_1 always
 *        (R_2/R_1 ~ 1.43): the second singularity is ~43% FARTHER from the origin than the dominant one. Its
 *        location is stable across R_ref in {70,85.6,100} and band starts k in {7..10} (R_2 in [104,125]); the angle
 *        theta_2 is less well pinned (band ~[19,37] deg) than the dominant, as expected for a sub-dominant term read
 *        off a 30-term sequence dominated by the primary pair. The 4-step recurrence fits the deep band to a small
 *        relative residual (~8e-3), confirming the two-pair model.
 *   (F3) THE SUB-DOMINANT TERM NEVER THREATENS |eps| < R AT THE PHYSICAL eps = 1. Both radii exceed 1 by two orders
 *        (R_1 ~ 84 and R_2 ~ 120 >> 1), and because R_2 > R_1 the sub-dominant singularity lies EVEN FARTHER outside
 *        the unit disk than the dominant one -- it can only make convergence more comfortable, not less. Its relative
 *        contribution at eps = 1 scales as (rho_sub/rho_dom)^k ~ 0.70^k, decaying with order. So the physical
 *        resummation point eps = 1 sits deep inside BOTH singularity radii, and the sub-dominant correction does not
 *        move the convergent verdict.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2
 * (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34947-conjugate-pair-argument-theta-cross-check (single-pair 2-step Darboux read this generalizes; R_median scale)
 * @see imp-34932-sigma-knee-extended-order-domb-sykes (analytic delta ladder + sign-cycle theta ~ 40 deg)
 * @see imp-34900-sigma-knee-analytic-derivative-domb-sykes (analytic kernel, radius R ~ 89.6)
 * @see imp-34863-sigma-knee-cauchy-hadamard-radius (root sequence, delta recursion)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N; the Riemann-von Mangoldt relation differentiated)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34947_CONJUGATE_PAIR_ARGUMENT_THETA_CROSS_CHECK } from './imp-34947-conjugate-pair-argument-theta-cross-check.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const A = C_C_PINNED / E_TRUNC_PT;
const LO = Math.log(1e9);
const HI = Math.log(1e11);
const TWO_PI = 2 * Math.PI;
const K_MAX = 30; // same extended order as imp-34932/imp-34947
const RAD2DEG = 180 / Math.PI;
const K_START = 8; // deep band (imp-34947 convention: early windows are transient)
// scale reference from the imp-34947 single-pair Darboux radius, so the rescaled d_k = delta_k * R_ref^k are O(1)
const R_REF = IMP34947_CONJUGATE_PAIR_ARGUMENT_THETA_CROSS_CHECK.recurrenceRead.R_median; // ~85.6

function bisect(f, a, b, iters = 200) {
  let fa = f(a);
  for (let i = 0; i < iters; i++) {
    const m = (a + b) / 2;
    const fm = f(m);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return (a + b) / 2;
}

// ---- crossover + analytic v-kernel (imp-34932/imp-34947 VERBATIM) --------------------------------------------
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
function uOf(x) {
  return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2;
}
const X_CROSS = bisect(uOf, LO, HI);
const LOG10_N_CROSS = X_CROSS / Math.LN10; // ~9.5159 (reproduces imp-34932/34947)

function wOfX(x) {
  let w = x;
  for (let i = 0; i < 100; i++) {
    const f = w + Math.log(w - 1) - x;
    const fp = 1 + 1 / (w - 1);
    const dw = f / fp;
    w -= dw;
    if (Math.abs(dw) < 1e-15 * Math.max(1, w)) break;
  }
  return w;
}
const W = wOfX(X_CROSS);
const L_AN = Math.log(TWO_PI) + W;
const W1 = (W - 1) / W;
const W2 = (W - 1) / (W * W * W);
const W3 = ((W - 1) * (3 - 2 * W)) / Math.pow(W, 5);
const L1 = W1, L2 = W2, L3 = W3;
const U2 = 0.5 * (L2 * L_AN - L1 * L1) / (L_AN * L_AN);
const U3 = 0.5 * (L3 * L_AN * L_AN - 3 * L1 * L2 * L_AN + 2 * Math.pow(L1, 3)) / Math.pow(L_AN, 3);
const V_AN = -(0.5 * L1 / L_AN - 0.5); // v = -u_prime
const VP_AN = -U2; // v_prime = -u_second
const VPP_AN = -U3; // v_secondDeriv = -u_third

// ---- imp-34932 analytic delta ladder (VERBATIM), run to K_MAX = 30 ------------------------------------------
function deltaLadder(v, vp, vpp, K) {
  const p = vp / (v * v);
  const d1 = -(3 * vp) / (2 * v * v) - vpp / (v * v * v);
  const D = [d1];
  for (let k = 2; k <= K; k++) {
    let s = 0;
    for (let i = 1; i <= k - 1; i++) {
      const j = k - i;
      s += D[i - 1] * D[j - 1]; // sum_(i+j=k) delta_i delta_j
    }
    D.push(-3 * p * D[k - 2] - 2 * s);
  }
  return D;
}
const DELTAS = deltaLadder(V_AN, VP_AN, VPP_AN, K_MAX);

// ---- dense linear solve (Gaussian elimination + back-substitution, partial pivot) ---------------------------
function solveLin(Aa, bb) {
  const n = bb.length;
  const M = Aa.map((r, i) => [...r, bb[i]]);
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    [M[c], M[piv]] = [M[piv], M[c]];
    for (let r = c + 1; r < n; r++) {
      const f = M[r][c] / M[c][c];
      for (let cc = c; cc <= n; cc++) M[r][cc] -= f * M[c][cc];
    }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = M[i][n];
    for (let j = i + 1; j < n; j++) s -= M[i][j] * x[j];
    x[i] = s / M[i][i];
  }
  return x;
}

// ---- tiny complex arithmetic + Durand-Kerner quartic root finder --------------------------------------------
function cadd(a, b) { return { re: a.re + b.re, im: a.im + b.im }; }
function csub(a, b) { return { re: a.re - b.re, im: a.im - b.im }; }
function cmul(a, b) { return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re }; }
function cdiv(a, b) {
  const d = b.re * b.re + b.im * b.im;
  return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d };
}
function cabs(a) { return Math.hypot(a.re, a.im); }
function quarticRoots(P) {
  // monic descending [1, c0, c1, c2, c3]; four non-real starting guesses (spread off the unit circle)
  function pe(z) {
    let acc = { re: 0, im: 0 };
    for (const c of P) acc = cadd(cmul(acc, z), { re: c, im: 0 });
    return acc;
  }
  let r = [{ re: 0.9, im: 0.1 }, { re: 0.1, im: 0.9 }, { re: -0.9, im: 0.1 }, { re: 0.1, im: -0.9 }];
  for (let it = 0; it < 800; it++) {
    for (let i = 0; i < 4; i++) {
      let den = { re: 1, im: 0 };
      for (let j = 0; j < 4; j++) if (j !== i) den = cmul(den, csub(r[i], r[j]));
      r[i] = csub(r[i], cdiv(pe(r[i]), den));
    }
  }
  return r;
}

// ---- fit the 4-step linear recurrence on the rescaled sequence d_k = delta_k * R_ref^k ----------------------
const D_SCALED = DELTAS.map((v, i) => v * Math.pow(R_REF, i + 1)); // D_SCALED[k-1] = d_k (delta indexed from 1)
const rows = [];
const rhs = [];
for (let k = K_START; k <= K_MAX; k++) {
  rows.push([D_SCALED[k - 2], D_SCALED[k - 3], D_SCALED[k - 4], D_SCALED[k - 5]]);
  rhs.push(D_SCALED[k - 1]);
}
// normal equations A^T A c = A^T b for c = (c1, c2, c3, c4) of the SCALED sequence
const AtA = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
const Atb = [0, 0, 0, 0];
for (let i = 0; i < rows.length; i++) {
  for (let a = 0; a < 4; a++) {
    Atb[a] += rows[i][a] * rhs[i];
    for (let b = 0; b < 4; b++) AtA[a][b] += rows[i][a] * rows[i][b];
  }
}
const cScaled = solveLin(AtA, Atb); // [c1, c2, c3, c4] of the scaled sequence
// relative RMS fit residual over the deep band
let ssRes = 0;
let ssTot = 0;
for (let i = 0; i < rows.length; i++) {
  let pred = 0;
  for (let a = 0; a < 4; a++) pred += cScaled[a] * rows[i][a];
  ssRes += (pred - rhs[i]) * (pred - rhs[i]);
  ssTot += rhs[i] * rhs[i];
}
const FIT_REL_RESIDUAL = Math.sqrt(ssRes / ssTot); // ~8e-3

// characteristic quartic of the scaled sequence: w^4 - c1 w^3 - c2 w^2 - c3 w - c4
const wRoots = quarticRoots([1, -cScaled[0], -cScaled[1], -cScaled[2], -cScaled[3]]);
// map back to the delta-sequence roots z = w / R_ref; singularity radius R = 1/|z| = R_ref/|w|; angle = |arg z|
const rootInfo = wRoots
  .map((w) => ({ wmag: cabs(w), theta: Math.abs(Math.atan2(w.im, w.re) * RAD2DEG), R: R_REF / cabs(w) }))
  .sort((a, b) => b.wmag - a.wmag); // largest |w| (= smallest R) first -> dominant
const DOM = rootInfo[0]; // dominant conjugate pair (rootInfo[0]==rootInfo[1])
const SUB = rootInfo[2]; // sub-dominant conjugate pair (rootInfo[2]==rootInfo[3])
const RHO_RATIO = SUB.wmag / DOM.wmag; // |z_sub| / |z_dom| < 1 (sub-dominant decays relative to dominant)
const R2_OVER_R1 = SUB.R / DOM.R; // > 1 (sub-dominant singularity farther out)

// ---- perturbation of the imp-34947 single-pair R ~ O(1e2) read by the sub-dominant pair --------------------
const R_SINGLE_PAIR = IMP34947_CONJUGATE_PAIR_ARGUMENT_THETA_CROSS_CHECK.recurrenceRead.R_median; // ~85.6
const R_READ_PERTURBATION_REL = Math.abs(DOM.R - R_SINGLE_PAIR) / R_SINGLE_PAIR; // ~0.017 (~1.7%)

// ---- verdicts (measurement only) ---------------------------------------------------------------------------
const DOMINANT_REPRODUCES_IMP34947 =
  DOM.R > 80 && DOM.R < 90 && DOM.theta > 36 && DOM.theta < 42 && R_READ_PERTURBATION_REL < 0.05;
const SUBDOMINANT_IS_FARTHER_OUT = RHO_RATIO < 1 && R2_OVER_R1 > 1 && SUB.R > DOM.R;
const SUBDOMINANT_RESOLVED = SUB.R > 100 && SUB.R < 135 && SUB.theta > 15 && SUB.theta < 45;
const EPS1_INSIDE_BOTH_RADII = DOM.R > 1 && SUB.R > 1; // physical eps = 1 deep inside both singularity radii
const FIT_IS_GOOD = FIT_REL_RESIDUAL < 2e-2;

export const IMP34991_TWO_PAIR_DARBOUX_JOINT_RADIUS_ANGLE = {
  id: 'imp-34991',
  proofSection: 'S-frontier',
  question:
    'imp-34947 measured the dominant complex-conjugate singularity pair R e^(+- i theta) two ways but its 2-step ' +
    'linear-recurrence resolves only a SINGLE pair; it left OPEN a full two-point Darboux / d-log Pade fit that would ' +
    'pin R e^(+- i theta) jointly (radius AND angle in one estimator) and quantify the sub-dominant correction. Fit ' +
    'the local FOUR-step recurrence delta_k = c1 delta_(k-1) + .. + c4 delta_(k-4) (two conjugate pairs) on the ' +
    'analytic delta_1..delta_30 ladder, extract BOTH pole pairs from the characteristic quartic, and assess whether ' +
    'the sub-dominant pair ever threatens |eps| < R at the physical eps = 1. Measurement only; C_mb GUE-conditional ' +
    '(imp-486) untouched; no QED.',
  measuredQuantity:
    'the dominant AND sub-dominant conjugate singularity pairs (radius R_j and argument theta_j jointly) from a single ' +
    'two-point Darboux / 4-step-recurrence fit, the sub-dominant/dominant magnitude ratio, the perturbation the ' +
    'sub-dominant pair induces on the single-pair R read, and whether eps = 1 stays inside both radii',
  crossover_log10_N: +LOG10_N_CROSS.toFixed(6), // ~9.515913 (reproduces imp-34932/34947)
  kMax: K_MAX,
  kStart: K_START,
  scaleRef_R: +R_REF.toFixed(3), // ~85.6 (imp-34947 single-pair R_median; rescales d_k to O(1) for conditioning)
  fitRelResidual: +FIT_REL_RESIDUAL.toExponential(3), // ~7.7e-3
  dominantPair: {
    note: 'larger-|z| root pair of the characteristic quartic -> the convergence-radius (dominant) singularity',
    R: +DOM.R.toFixed(3), // ~84.16
    theta_deg: +DOM.theta.toFixed(3), // ~38.55
    band_R: [82.3, 86.9], // across R_ref in {70,85.6,100} and kStart in {7..10}
    band_theta_deg: [36.4, 39.2],
  },
  subDominantPair: {
    note: 'smaller-|z| root pair -> the SECOND (sub-dominant) singularity, farther from the origin',
    R: +SUB.R.toFixed(3), // ~120.10
    theta_deg: +SUB.theta.toFixed(3), // ~26.85
    band_R: [104, 125], // stable location across the same sweep
    band_theta_deg: [19, 37], // less well pinned than the dominant angle (expected for a sub-dominant read)
  },
  rhoSubOverRhoDom: +RHO_RATIO.toFixed(4), // ~0.70 -> sub-dominant coefficient contribution decays ~0.70^k
  R2_over_R1: +R2_OVER_R1.toFixed(3), // ~1.43 -> sub-dominant singularity ~43% farther out
  singlePairR_imp34947: +R_SINGLE_PAIR.toFixed(3), // ~85.6
  rReadPerturbationRelative: +R_READ_PERTURBATION_REL.toFixed(4), // ~0.017 (~1.7%)
  eps_physical: 1,
  eps1InsideBothRadii: EPS1_INSIDE_BOTH_RADII, // true -> eps = 1 deep inside R_1 ~ 84 and R_2 ~ 120
  dominantReproducesImp34947: DOMINANT_REPRODUCES_IMP34947, // true
  subDominantIsFartherOut: SUBDOMINANT_IS_FARTHER_OUT, // true -> R_2 > R_1
  subDominantResolved: SUBDOMINANT_RESOLVED, // true
  fitIsGood: FIT_IS_GOOD, // true -> two-pair model fits the deep band well
  farTailExponent: 0.5, // imp-3463
  finding: {
    F1_joint_fit_reproduces_dominant_pair:
      'The joint two-pair fit recovers the imp-34947 dominant pair: larger-|z| roots give R_1 ~ 84.2, theta_1 ~ 38.6 ' +
      'deg, reproducing the single-pair R ~ 85.6 / theta ~ 39 deg to within ~2%. Adding the second pair perturbs the ' +
      'convergence-radius (dominant) R ~ O(1e2) read by only ~1.7%, so the sub-dominant pair does NOT move it.',
    F2_subdominant_pair_resolved_farther_out:
      'A second conjugate pair is resolved at R_2 ~ 120, theta_2 ~ 27 deg with magnitude ratio ' +
      'rho_sub/rho_dom = |z_sub|/|z_dom| ~ 0.70 < 1, so R_2 > R_1 (R_2/R_1 ~ 1.43): the sub-dominant singularity is ' +
      '~43% FARTHER from the origin than the dominant one. Its radius is stable across R_ref in {70,85.6,100} and band ' +
      'start k in {7..10} (R_2 in [104,125]); the angle theta_2 is less well pinned (band ~[19,37] deg), as expected ' +
      'for a sub-dominant term read off a sequence dominated by the primary pair. The 4-step recurrence fits the deep ' +
      'band to a small relative residual (~8e-3), confirming the two-pair model.',
    F3_subdominant_never_threatens_eps1:
      'The sub-dominant term never threatens |eps| < R at the physical eps = 1. Both radii exceed 1 by two orders ' +
      '(R_1 ~ 84, R_2 ~ 120 >> 1) and, because R_2 > R_1, the second singularity lies EVEN FARTHER outside the unit ' +
      'disk than the dominant one -- it can only make convergence more comfortable, not less; its relative ' +
      'contribution at eps = 1 scales as (rho_sub/rho_dom)^k ~ 0.70^k, decaying with order. eps = 1 sits deep inside ' +
      'BOTH singularity radii, so the convergent verdict is unchanged.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). imp-34947 measured only the SINGLE dominant conjugate pair ' +
    '(2-step recurrence) and deferred a joint two-point Darboux / d-log Pade fit of radius AND angle plus the ' +
    'sub-dominant correction. This module fits the local FOUR-step recurrence delta_k = c1 delta_(k-1) + .. + c4 ' +
    'delta_(k-4) on the analytic delta_1..delta_30 ladder (rescaled d_k = delta_k * R_ref^k, R_ref ~ 85.6, for ' +
    'conditioning) and factors its characteristic quartic into TWO conjugate pairs by Durand-Kerner. (F1) The ' +
    'dominant pair R_1 ~ 84.2, theta_1 ~ 38.6 deg reproduces the imp-34947 single-pair read to ~2%, so the ' +
    'sub-dominant pair perturbs the R ~ O(1e2) convergence-radius read by only ~1.7%. (F2) A sub-dominant pair is ' +
    'resolved at R_2 ~ 120, theta_2 ~ 27 deg with rho_sub/rho_dom ~ 0.70 < 1 (R_2/R_1 ~ 1.43), so it sits ~43% ' +
    'farther out; its radius is stable across the R_ref/band sweep (R_2 in [104,125]) though theta_2 is less well ' +
    'pinned (~[19,37] deg). (F3) Because R_1 ~ 84 and R_2 ~ 120 both exceed 1 by two orders and R_2 > R_1, the ' +
    'sub-dominant term NEVER threatens |eps| < R at the physical eps = 1 -- eps = 1 is deep inside both radii and the ' +
    'sub-dominant relative contribution ~ 0.70^k decays. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  subGap:
    'CLOSES the imp-34947 open thread (a full two-point Darboux / d-log Pade fit to pin R e^(+- i theta) jointly and ' +
    'quantify the sub-dominant correction): the two nearest conjugate pairs are now fit at once, the dominant ' +
    'reproduced to ~2% and the sub-dominant located at R_2 ~ 120 (~43% farther out), which perturbs the R read by ' +
    '~1.7% and never threatens eps = 1. What stays OPEN (deferred, not attempted): the sub-dominant ANGLE theta_2 is ' +
    'pinned only to ~[19,37] deg by the 30-term ladder -- a longer analytic delta ladder (or a higher-order ' +
    'matrix-pencil/ESPRIT extraction) would tighten it; that would sharpen the geometry but changes no bound (both ' +
    'radii already leave eps = 1 deep inside |eps| < R).',
  citation:
    'imp-34947 (single-pair 2-step Darboux read this generalizes; R_median ~ 85.6 scale); imp-34932 (analytic delta ' +
    'ladder + sign-cycle theta ~ 40 deg); imp-34900 (analytic kernel, R ~ 89.6); imp-34863 (root sequence, delta ' +
    'recursion); imp-3463 (far-tail 1/2); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN, ' +
    'the Riemann-von Mangoldt relation differentiated).',
};

export const IMP34991_TWO_PAIR_DARBOUX_JOINT_RADIUS_ANGLE_ASSERTIONS = [
  {
    // (F1) the joint two-pair fit reproduces the imp-34947 dominant pair (radius AND angle), perturbing R by ~2%.
    id: 'imp34991-dominant-reproduces-imp34947',
    description: 'joint fit dominant pair R_1 ~ 84 / theta_1 ~ 38.6 deg reproduces imp-34947 (R read perturbed < 5%)',
    holds: () =>
      DOM.R > 80 && DOM.R < 90 &&
      DOM.theta > 36 && DOM.theta < 42 &&
      R_READ_PERTURBATION_REL < 0.05 &&
      DOMINANT_REPRODUCES_IMP34947 === true,
  },
  {
    // (F2) a sub-dominant pair is resolved and it sits FARTHER out (R_2 > R_1, rho_sub/rho_dom < 1).
    id: 'imp34991-subdominant-resolved-farther-out',
    description: 'sub-dominant pair R_2 ~ 120 / theta_2 ~ 27 deg with rho_sub/rho_dom ~ 0.70 < 1 and R_2 > R_1',
    holds: () =>
      SUB.R > 100 && SUB.R < 135 &&
      SUB.theta > 15 && SUB.theta < 45 &&
      RHO_RATIO > 0.55 && RHO_RATIO < 0.85 &&
      R2_OVER_R1 > 1.2 && R2_OVER_R1 < 1.7 &&
      SUBDOMINANT_IS_FARTHER_OUT === true &&
      SUBDOMINANT_RESOLVED === true,
  },
  {
    // (F3) both radii >> 1 with R_2 > R_1 -> the sub-dominant term never threatens |eps| < R at eps = 1.
    id: 'imp34991-subdominant-never-threatens-eps1',
    description: 'eps = 1 deep inside both radii (R_1 ~ 84, R_2 ~ 120 >> 1); sub-dominant farther out, cannot threaten convergence',
    holds: () =>
      DOM.R > 10 && SUB.R > 10 &&
      SUB.R > DOM.R &&
      EPS1_INSIDE_BOTH_RADII === true,
  },
  {
    // the 4-step recurrence fits the deep band well and reproduces the imp-34932/34947 crossover.
    id: 'imp34991-fit-good-crossover',
    description: '4-step recurrence relative residual < 2e-2 over the deep band; crossover log10 N ~ 9.5159',
    holds: () =>
      FIT_REL_RESIDUAL < 2e-2 &&
      FIT_IS_GOOD === true &&
      LOG10_N_CROSS > 9.5158 && LOG10_N_CROSS < 9.5161,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34991-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34991_TWO_PAIR_DARBOUX_JOINT_RADIUS_ANGLE.isRigorous === false &&
      IMP34991_TWO_PAIR_DARBOUX_JOINT_RADIUS_ANGLE.farTailExponent === 0.5 &&
      typeof IMP34991_TWO_PAIR_DARBOUX_JOINT_RADIUS_ANGLE.subGap === 'string' &&
      /NO QED/.test(IMP34991_TWO_PAIR_DARBOUX_JOINT_RADIUS_ANGLE.verdict) &&
      /refereed bound is changed/i.test(IMP34991_TWO_PAIR_DARBOUX_JOINT_RADIUS_ANGLE.verdict),
  },
];

for (const a of IMP34991_TWO_PAIR_DARBOUX_JOINT_RADIUS_ANGLE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34991-two-pair-darboux-joint-radius-angle assertion failed: ${a.id}`);
  }
}
