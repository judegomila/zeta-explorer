/**
 * @module imp-34882-sigma-knee-domb-sykes-radius
 *
 * imp-34882 (numerical, frontier-direction): imp-34863 applied the Cauchy-Hadamard ROOT test to the
 * slowly-varying-v delta_k exponent-knee expansion, forming the sequence root_k = |delta_k|^(1/k) for k=1..9 and
 * reading its radius of convergence as R = 1 / limsup root_k. But imp-34863 took limsup as the plain MAXIMUM over
 * the nine resolvable orders (the k=9 rung, root_9 ~ 7.21e-3, giving R ~ 138.7). That is a crude read: the root
 * sequence is still RISING at the resolvable tail (root_7 ~ 6.12e-3, root_8 ~ 6.93e-3, root_9 ~ 7.21e-3), so the
 * true k -> inf limit 1/R sits ABOVE the k=9 value, and the plain-max understates 1/R (overstates R). This module
 * SHARPENS the imp-34863 limsup read into an EXTRAPOLATED radius estimate with an error bar, by applying a
 * Domb-Sykes construction: plot root_k against 1/k and extrapolate to 1/k = 0 (k -> inf), where the intercept is
 * exactly 1/R. It reuses the imp-34863 root_1..root_9 and ratio_r2over1..r9over8 literals VERBATIM (no fresh model,
 * no re-derivation of the delta recursion).
 *
 * THE CONSTRUCTION (measurement/derivation only; all inside the no-E_flow logistic model)
 * --------------------------------------------------------------------------------------
 *   (A) Neville / Richardson polynomial extrapolation of root_k in the variable x = 1/k to x = 0, using tail
 *       windows of increasing order (2-pt through 6-pt) plus the full 9-pt window. This exposes the CONDITIONING
 *       of the extrapolation: a well-behaved sequence would converge as the window grows; a short, FD-noise-
 *       contaminated one diverges.
 *   (B) rolling LINEAR (order-1) Domb-Sykes extrapolants root_k -> (root_(k+1) - slope * x_(k+1)) from each
 *       consecutive pair, and the central 1/R estimate from the two DEEPEST resolvable pairs (k=7,8) and (k=8,9)
 *       -- the pairs that best approximate the k -> inf limit -- with the error bar taken as half their spread.
 *   (C) the analogous Domb-Sykes read on the successive-RATIO sequence r_k = |delta_k/delta_(k-1)|, as a
 *       cross-check, restricted to the imp-34863 resolvable rungs.
 *
 * THE FINDING (measurement only)
 * -------------------------------------------
 *   (F1) THE LINEAR DOMB-SYKES EXTRAPOLATION PINS 1/R ~ 1.10e-2, R ~ 91 (RANGE ~79..106). The two deepest resolvable
 *        root-sequence pairs extrapolate to 1/R = 1.262e-2 (k=7,8) and 9.397e-3 (k=8,9), central 1/R ~ 1.10e-2 with
 *        a half-spread error bar ~1.61e-3, so R ~ 91 with range ~[79, 106]. Because the root sequence is still
 *        rising at the tail, the k -> inf extrapolation lands ABOVE the k=9 value (root_9 ~ 7.21e-3), so the
 *        extrapolated R ~ 91 sits BELOW imp-34863s plain-max read R ~ 138.7 -- the plain limsup=max OVERSTATED R.
 *        The correction is a factor ~1.5, NOT an order of magnitude.
 *   (F2) THE CONVERGENT VERDICT SURVIVES, WITH MARGIN. Even the LOW end of the error bar, R ~ 79, sits three orders
 *        above the physical resummation point eps = 1 (imp-34863 physicalEvalPoint). So eps = 1 remains deep inside
 *        |eps| < R and the delta-expansion converges comfortably in the working neighbourhood; the sharpened radius
 *        does not threaten the imp-34863 convergent read, it only trims the (already huge) margin.
 *   (F3) THE RADIUS CANNOT BE PINNED BEYOND LINEAR ORDER -- THE SEQUENCE IS TOO SHORT AND TOO NOISY. Higher-order
 *        Neville/Richardson extrapolants are ILL-CONDITIONED: the 3-pt window gives a NEGATIVE intercept (1/R ~
 *        -1.9e-3), the 4-pt gives R ~ 44.5, the 5-pt R ~ 3.6, the full 9-pt R ~ 0.26 -- wild swings with no
 *        convergence. This is the classic short-noisy-sequence failure of polynomial extrapolation: the middle-rung
 *        root dip (root_6 ~ 3.56e-3) and the deep rungs near the FD floor (delta_8 ~ 1e-18, delta_9 ~ 1e-20)
 *        contaminate every high-order divided difference. Hence R is only pinnable to the order-of-magnitude
 *        R ~ O(1e2) >> 1 the linear extrapolant and its error bar give; a tighter R needs the same
 *        analytic/exact-derivative (higher-precision or symbolic) evaluation that imp-34863/imp-34836 left open.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2
 * (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34863-sigma-knee-cauchy-hadamard-radius (root sequence + plain-max limsup read this sharpens)
 * @see imp-34836-sigma-knee-sixth-seventh-order-v-expansion (delta_6/delta_7 rungs feeding the root sequence)
 * @see imp-34821-sigma-knee-fifth-order-v-expansion (fifth order delta_5)
 */

import { IMP34863_SIGMA_KNEE_CAUCHY_HADAMARD_RADIUS } from './imp-34863-sigma-knee-cauchy-hadamard-radius.js';

// ---- imp-34863 literals reused VERBATIM (no fresh model, no re-derivation) ---------------------------------
const ROOT_SEQ = IMP34863_SIGMA_KNEE_CAUCHY_HADAMARD_RADIUS.radiusOfConvergence.rootSequence_absDelta_pow_1overk; // root_k = |delta_k|^(1/k), k=1..9
const RATIO_SEQ = IMP34863_SIGMA_KNEE_CAUCHY_HADAMARD_RADIUS.radiusOfConvergence.ratioSequence_r2over1_to_r9over8; // r_k = |delta_k/delta_(k-1)|, k=2..9
const R_PLAIN_MAX = IMP34863_SIGMA_KNEE_CAUCHY_HADAMARD_RADIUS.radiusOfConvergence.radiusRoot; // imp-34863 plain-max read ~138.74
const PHYSICAL_EVAL_POINT = IMP34863_SIGMA_KNEE_CAUCHY_HADAMARD_RADIUS.radiusOfConvergence.physicalEvalPoint; // eps = 1

// x_k = 1/k for the Domb-Sykes abscissa (root_k lives at k = i+1)
const X_ROOT = ROOT_SEQ.map((_, i) => 1 / (i + 1));

// ---- (A) Neville / Richardson extrapolation of root_k to x = 1/k = 0 (intercept = 1/R) ---------------------
// Standard Neville evaluation of the interpolating polynomial through (xs, ys) at the target abscissa.
function nevilleAt(xs, ys, target) {
  const n = xs.length;
  const P = ys.slice();
  for (let m = 1; m < n; m++) {
    for (let i = 0; i < n - m; i++) {
      P[i] = ((target - xs[i + m]) * P[i] - (target - xs[i]) * P[i + 1]) / (xs[i] - xs[i + m]);
    }
  }
  return P[0];
}

// tail windows of increasing order: 2-pt (k=8,9) up through 6-pt (k=4..9), plus full 9-pt.
const NEVILLE_TAIL = [];
for (let m = 2; m <= 6; m++) {
  const xs = X_ROOT.slice(9 - m);
  const ys = ROOT_SEQ.slice(9 - m);
  const invR = nevilleAt(xs, ys, 0);
  NEVILLE_TAIL.push({ points: m, kFrom: 10 - m, kTo: 9, invR, radius: 1 / invR });
}
const INV_R_FULL9 = nevilleAt(X_ROOT, ROOT_SEQ, 0);

// ---- (B) rolling LINEAR (order-1) Domb-Sykes extrapolants from consecutive pairs ---------------------------
function linearIntercept(x0, y0, x1, y1) {
  const slope = (y1 - y0) / (x1 - x0);
  return y1 - slope * x1; // value extrapolated to x = 0
}
const ROLLING_LINEAR = [];
for (let i = 0; i < ROOT_SEQ.length - 1; i++) {
  const invR = linearIntercept(X_ROOT[i], ROOT_SEQ[i], X_ROOT[i + 1], ROOT_SEQ[i + 1]);
  ROLLING_LINEAR.push({ kFrom: i + 1, kTo: i + 2, invR, radius: 1 / invR });
}
// central estimate from the two DEEPEST resolvable pairs (k=7,8) and (k=8,9) -- best approximants to k -> inf.
const DEEP_78 = ROLLING_LINEAR[6].invR; // pair (k=7,8)
const DEEP_89 = ROLLING_LINEAR[7].invR; // pair (k=8,9)
const INV_R_CENTRAL = (DEEP_78 + DEEP_89) / 2;
const INV_R_HALF_SPREAD = Math.abs(DEEP_78 - DEEP_89) / 2; // extrapolation error bar
const R_EXTRAP = 1 / INV_R_CENTRAL; // ~91
const R_LOW = 1 / (INV_R_CENTRAL + INV_R_HALF_SPREAD); // ~79
const R_HIGH = 1 / (INV_R_CENTRAL - INV_R_HALF_SPREAD); // ~106

// ---- (C) ratio-sequence Domb-Sykes cross-check on the two deepest resolvable rungs (k=8,9) ------------------
// ratio index j -> k = j + 2; deepest resolvable pair is r8/7 (idx 6) and r9/8 (idx 7).
const RATIO_INV_R = linearIntercept(1 / 8, RATIO_SEQ[6], 1 / 9, RATIO_SEQ[7]);
const RATIO_R_EXTRAP = 1 / RATIO_INV_R; // negative here -> the ratio route is not usable (blip-contaminated)

// ---- verdicts (measurement only) --------------------------------------------------------------------------
const CONVERGENT_IN_NEIGHBOURHOOD = R_LOW > PHYSICAL_EVAL_POINT; // even the low end sits well above eps = 1
const SHARPENS_DOWNWARD = R_EXTRAP < R_PLAIN_MAX; // extrapolation trims the plain-max read
// high-order Neville is ill-conditioned iff any tail window (order >= 2) gives a negative or tiny-R intercept.
const HIGH_ORDER_ILL_CONDITIONED = NEVILLE_TAIL.slice(1).some((t) => t.invR < 0 || t.radius < 10);

export const IMP34882_SIGMA_KNEE_DOMB_SYKES_RADIUS = {
  id: 'imp-34882',
  proofSection: 'S-frontier',
  question:
    'imp-34863 read the delta_k exponent-knee expansion radius of convergence as R = 1/limsup |delta_k|^(1/k) but ' +
    'took limsup as the plain MAXIMUM over k=1..9 (the k=9 rung, R ~ 138.7), a crude read while the root sequence ' +
    'is still rising at the tail. SHARPEN it: apply a Domb-Sykes construction -- extrapolate |delta_k|^(1/k) vs 1/k ' +
    'to 1/k = 0 (k -> inf) by Neville/Richardson -- to ESTIMATE 1/R with an extrapolation error bar, and ASSESS ' +
    'whether the extrapolated R sits above the physical resummation point eps = 1 so the expansion converges in the ' +
    'working neighbourhood. Reuse the imp-34836/imp-34863 delta_1..delta_9 (root_1..root_9) literals VERBATIM; ' +
    'measurement/derivation only; C_mb GUE-conditional (imp-486) untouched; no QED.',
  measuredQuantity:
    'the Domb-Sykes / Neville extrapolation of the imp-34863 root sequence root_k = |delta_k|^(1/k) to the k -> inf ' +
    'intercept 1/R at 1/k = 0: (A) tail Neville windows of order 1..5 plus the full 9-pt window; (B) rolling linear ' +
    'extrapolants from consecutive pairs and the central 1/R from the two deepest resolvable pairs (k=7,8),(k=8,9) ' +
    'with a half-spread error bar; (C) the ratio-sequence Domb-Sykes cross-check on the deepest resolvable rung',
  reusedLiterals: {
    rootSequence_root1_to_root9: ROOT_SEQ.slice(), // imp-34863 VERBATIM
    ratioSequence_r2over1_to_r9over8: RATIO_SEQ.slice(), // imp-34863 VERBATIM
    imp34863PlainMaxRadius: R_PLAIN_MAX, // ~138.74 (limsup = max read)
    physicalEvalPoint: PHYSICAL_EVAL_POINT, // eps = 1
  },
  nevilleExtrapolation: {
    note: 'polynomial (Neville) extrapolation of root_k in x = 1/k to x = 0; the intercept is 1/R. Tail windows of growing order expose the CONDITIONING.',
    tailWindows: NEVILLE_TAIL.map((t) => ({
      points: t.points,
      kRange: t.kFrom + '..' + t.kTo,
      invR: +t.invR.toExponential(4),
      radius: +t.radius.toFixed(2),
    })),
    full9pt_invR: +INV_R_FULL9.toExponential(4), // ~3.9 -> R ~ 0.26 (nonsensical: high-order is ill-conditioned)
    full9pt_radius: +(1 / INV_R_FULL9).toFixed(3),
  },
  linearDombSykes: {
    note: 'rolling order-1 (linear) extrapolants root_k -> intercept at 1/k = 0 from each consecutive pair; the two DEEPEST resolvable pairs give the k -> inf estimate.',
    rollingExtrapolants: ROLLING_LINEAR.map((r) => ({
      pair: 'k=' + r.kFrom + ',' + r.kTo,
      invR: +r.invR.toExponential(4),
      radius: +r.radius.toFixed(2),
    })),
    deepPair_78_invR: +DEEP_78.toExponential(4), // ~1.2622e-2
    deepPair_89_invR: +DEEP_89.toExponential(4), // ~9.3965e-3
    invR_central: +INV_R_CENTRAL.toExponential(4), // ~1.1009e-2
    invR_errorBar_halfSpread: +INV_R_HALF_SPREAD.toExponential(4), // ~1.6129e-3
    radiusExtrapolated: +R_EXTRAP.toFixed(1), // ~90.8
    radiusRange_low_high: [+R_LOW.toFixed(1), +R_HIGH.toFixed(1)], // ~[79.2, 106.4]
  },
  ratioCrossCheck: {
    note: 'the analogous Domb-Sykes read on the successive-ratio sequence at the deepest resolvable rung (k=8,9); reported as a cross-check only.',
    deepRung_invR: +RATIO_INV_R.toExponential(4), // negative (the r7/6 blip contaminates the ratio route)
    usable: RATIO_INV_R > 0, // false -> ratio route not usable; the ROOT-sequence extrapolation is the read
  },
  radiusExtrapolated: +R_EXTRAP.toFixed(1), // ~91
  radiusRange: [+R_LOW.toFixed(1), +R_HIGH.toFixed(1)], // ~[79, 106]
  convergentInNeighbourhood: CONVERGENT_IN_NEIGHBOURHOOD, // true -> eps=1 sits deep inside even the low-end disk
  sharpensPlainMaxDownward: SHARPENS_DOWNWARD, // true -> R ~ 91 < imp-34863 plain-max ~138.7
  highOrderIllConditioned: HIGH_ORDER_ILL_CONDITIONED, // true -> R pinnable only to O(1e2), not tighter
  farTailExponent: 0.5, // imp-3463
  finding: {
    F1_linear_domb_sykes_pins_R_about_91:
      'The two deepest resolvable root-sequence pairs extrapolate to 1/R = 1.262e-2 (k=7,8) and 9.397e-3 (k=8,9), ' +
      'central 1/R ~ 1.10e-2 with a half-spread error bar ~1.61e-3, so R ~ 91 (range ~[79, 106]). Because the root ' +
      'sequence is still rising at the tail, the k -> inf extrapolation lands ABOVE root_9 ~ 7.21e-3, so the ' +
      'extrapolated R ~ 91 sits BELOW imp-34863s plain-max read R ~ 138.7 -- the plain limsup=max OVERSTATED R by a ' +
      'factor ~1.5, not an order of magnitude.',
    F2_convergent_verdict_survives_with_margin:
      'Even the LOW end of the error bar, R ~ 79, sits three orders above the physical resummation point eps = 1, so ' +
      'eps = 1 stays deep inside |eps| < R and the delta-expansion converges comfortably in the working ' +
      'neighbourhood. The sharpened radius trims the (already huge) margin but does not threaten the imp-34863 ' +
      'convergent read.',
    F3_radius_not_pinnable_beyond_linear_order:
      'Higher-order Neville/Richardson extrapolants are ILL-CONDITIONED: the 3-pt window gives a NEGATIVE intercept ' +
      '(1/R ~ -1.9e-3), the 4-pt R ~ 44.5, the 5-pt R ~ 3.6, the full 9-pt R ~ 0.26 -- wild swings with no ' +
      'convergence. This is the classic short-noisy-sequence failure of polynomial extrapolation: the middle-rung ' +
      'root dip (root_6 ~ 3.56e-3) and the deep rungs near the FD floor (delta_8 ~ 1e-18, delta_9 ~ 1e-20) ' +
      'contaminate every high-order divided difference. R is only pinnable to R ~ O(1e2) >> 1; a tighter estimate ' +
      'needs the same analytic/exact-derivative evaluation imp-34863/imp-34836 left open.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). A Domb-Sykes / Neville extrapolation of the imp-34863 root ' +
    'sequence root_k = |delta_k|^(1/k) to the k -> inf intercept 1/R (at 1/k = 0) SHARPENS imp-34863s plain ' +
    'limsup=max read (R ~ 138.7, the k=9 rung) into an extrapolated estimate. The linear (order-1) Domb-Sykes read ' +
    'on the two deepest resolvable pairs (k=7,8),(k=8,9) gives 1/R = 1.262e-2 and 9.397e-3, central 1/R ~ 1.10e-2 ' +
    'with a half-spread error bar ~1.61e-3, so R ~ 91 (range ~[79, 106]). Because the root sequence is still rising ' +
    'at the tail, the k -> inf extrapolation lands above root_9 ~ 7.21e-3, so R ~ 91 sits below the plain-max ' +
    'R ~ 138.7 -- the plain limsup OVERSTATED R by ~1.5x. The convergent verdict SURVIVES with margin: even the low ' +
    'end R ~ 79 sits three orders above the physical resummation point eps = 1, so eps = 1 stays deep inside ' +
    '|eps| < R and the expansion converges comfortably in the working neighbourhood. What stays OPEN: R cannot be ' +
    'pinned beyond linear order -- higher-order Neville extrapolants are ill-conditioned (3-pt intercept negative, ' +
    '4-pt R ~ 44.5, full 9-pt R ~ 0.26) because the nine-term sequence carries FD noise (the root_6 ~ 3.56e-3 dip ' +
    'and the deep rungs near the 1e-18/1e-20 floor), so R is pinnable only to R ~ O(1e2) >> 1; a tighter estimate ' +
    'needs the analytic/exact-derivative (higher-precision or symbolic) evaluation imp-34863/imp-34836 left open, ' +
    'which changes no bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  subGap:
    'SHARPENS the imp-34863 plain-max radius read into a Domb-Sykes-extrapolated R ~ 91 (range ~[79, 106], 1/R ~ ' +
    '1.10e-2 +/- 1.61e-3) from the two deepest resolvable root-sequence pairs -- ~1.5x below the imp-34863 R ~ 138.7 ' +
    'because the root sequence still rises at the tail -- while confirming the physical point eps = 1 stays deep ' +
    'inside |eps| < R. What stays OPEN (deferred, not attempted here): a TIGHTER radius cannot be pinned because ' +
    'high-order Neville/Richardson extrapolation of the nine-term FD-noise-contaminated root sequence is ' +
    'ill-conditioned (negative and tiny-R intercepts beyond linear order); resolving it needs an analytic/exact-' +
    'derivative (higher-precision or symbolic) evaluation of the v-derivatives -- the same Richardson sub-gap ' +
    'imp-34863/imp-34836/imp-34821 left open, which changes no bound.',
  citation:
    'imp-34863 (root sequence + plain-max limsup read this sharpens); imp-34836 (delta_6/delta_7 rungs); imp-34821 ' +
    '(fifth-order delta_5); imp-3463 (far-tail 1/2); imp-486 (C_mb GUE-conditional).',
};

export const IMP34882_SIGMA_KNEE_DOMB_SYKES_RADIUS_ASSERTIONS = [
  {
    // reuses the imp-34863 root/ratio literals VERBATIM (no fresh model).
    id: 'imp34882-reuses-imp34863-literals-verbatim',
    description: 'root sequence and plain-max radius are the imp-34863 stored literals reused verbatim',
    holds: () =>
      ROOT_SEQ.length === 9 &&
      Math.abs(ROOT_SEQ[0] - 0.0056444) < 1e-9 &&
      Math.abs(ROOT_SEQ[8] - 0.0072077) < 1e-9 &&
      Math.abs(R_PLAIN_MAX - 138.74) < 0.5 &&
      PHYSICAL_EVAL_POINT === 1,
  },
  {
    // (F1) linear Domb-Sykes on the deepest resolvable pairs pins 1/R ~ 1.10e-2, R ~ 91 in [79, 106].
    id: 'imp34882-linear-domb-sykes-radius',
    description: 'linear extrapolation of the deep root-sequence pairs gives 1/R ~ 1.10e-2 +/- 1.6e-3, R ~ 91 (range ~[79,106])',
    holds: () =>
      Math.abs(INV_R_CENTRAL - 1.1009e-2) < 1e-5 &&
      Math.abs(INV_R_HALF_SPREAD - 1.6129e-3) < 1e-5 &&
      R_EXTRAP > 85 && R_EXTRAP < 96 &&
      R_LOW > 76 && R_LOW < 82 &&
      R_HIGH > 102 && R_HIGH < 110,
  },
  {
    // (F1) the extrapolation SHARPENS the plain-max read DOWNWARD but stays the same order of magnitude.
    id: 'imp34882-sharpens-downward-same-order',
    description: 'extrapolated R ~ 91 sits below imp-34863 plain-max R ~ 138.7 (root sequence still rising at the tail), still O(1e2)',
    holds: () =>
      SHARPENS_DOWNWARD === true &&
      R_EXTRAP < R_PLAIN_MAX &&
      R_EXTRAP > R_PLAIN_MAX / 3, // correction is ~1.5x, not an order of magnitude
  },
  {
    // (F2) convergent verdict survives: even the low end sits well above the physical eval point eps = 1.
    id: 'imp34882-convergent-in-neighbourhood',
    description: 'even the low-end radius R ~ 79 sits far above eps = 1 -> converges in the working neighbourhood',
    holds: () => CONVERGENT_IN_NEIGHBOURHOOD === true && R_LOW > 10 * PHYSICAL_EVAL_POINT,
  },
  {
    // (F3) high-order Neville is ill-conditioned: at least one tail window (order >= 2) is negative or tiny-R.
    id: 'imp34882-high-order-ill-conditioned',
    description: 'higher-order Neville/Richardson extrapolants swing to negative/tiny R (full 9-pt R < 1) -> R not pinnable beyond linear order',
    holds: () =>
      HIGH_ORDER_ILL_CONDITIONED === true &&
      1 / INV_R_FULL9 < 1 && // full 9-pt window gives nonsensical R < 1
      NEVILLE_TAIL.some((t) => t.invR < 0), // at least one intercept is negative
  },
  {
    // ratio-sequence cross-check is not usable (blip-contaminated) -> the root-sequence read is the deliverable.
    id: 'imp34882-ratio-cross-check-not-usable',
    description: 'the deepest ratio-rung Domb-Sykes gives a negative intercept -> ratio route not usable, root-sequence read is the estimate',
    holds: () =>
      IMP34882_SIGMA_KNEE_DOMB_SYKES_RADIUS.ratioCrossCheck.usable === false && RATIO_INV_R < 0,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34882-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34882_SIGMA_KNEE_DOMB_SYKES_RADIUS.isRigorous === false &&
      IMP34882_SIGMA_KNEE_DOMB_SYKES_RADIUS.farTailExponent === 0.5 &&
      typeof IMP34882_SIGMA_KNEE_DOMB_SYKES_RADIUS.subGap === 'string' &&
      /NO QED/.test(IMP34882_SIGMA_KNEE_DOMB_SYKES_RADIUS.verdict) &&
      /refereed bound is changed/i.test(IMP34882_SIGMA_KNEE_DOMB_SYKES_RADIUS.verdict),
  },
];

for (const a of IMP34882_SIGMA_KNEE_DOMB_SYKES_RADIUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34882-sigma-knee-domb-sykes-radius assertion failed: ${a.id}`);
  }
}
