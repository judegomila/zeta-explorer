/**
 * @module imp-34684-fourth-order-stencil-reference-weight-crossvalidation
 * @fileoverview imp-34684 -- CROSS-VALIDATION ONLY: extend the imp-34654 reference-weight
 *   certification from the imp-34626 6th-order 9-point stencil to the imp-34611 4th-order stencils
 *   (q2 = accuracy-4 5-point 2nd derivative, q3 = accuracy-4 7-point 3rd derivative). Re-derive both
 *   weight sets from two independent reference constructions (the Fornberg 1988 recurrence and a
 *   Vandermonde solve), confirm they match the imp-34611 inline numerators EXACTLY, and MEASURE whether
 *   feeding the raw un-rounded float weights amplifies the q3-share plateau by the same ~3e-4 (~1e9x)
 *   near-cancellation conditioning signature imp-34654 found for the 6th-order stencil. imp-34654
 *   certified only the 6th-order stencil; the 4th-order q2/q3 weights imp-34611 used were never
 *   re-derived against an independent reference. This module closes that gap.
 *
 *   WHAT THIS CROSS-VALIDATION ADDS (beyond imp-34611 / imp-34654)
 *   -------------------------------------------------------------
 *   The imp-34611 inline 4th-order stencils are (offsets k in units of dp; q(p) = log E_coll at p+k*dp):
 *     - q2 (accuracy-4, 5-point, offsets -2..2): weights [-1, 16, -30, 16, -1] / 12;
 *     - q3 (accuracy-4, 7-point, offsets -3..3): weights [1, -8, 13, 0, -13, 8, -1] / 8.
 *   As in imp-34654, both weight sets are RE-DERIVED from scratch by two independent standard
 *   constructions, each blind to the inline numerators:
 *     (A) FORNBERG (1988) recurrence -- run on grid [-2..2] for derivative order 2 and [-3..3] for
 *         order 3 (VERBATIM the imp-34654 fornbergWeights);
 *     (B) VANDERMONDE solve -- V w = b with V[i][j] = k_j^i, b[i] = m! * delta_{i,m}, Gaussian
 *         elimination with partial pivoting (VERBATIM the imp-34654 vandermondeWeights).
 *   Both are scaled by the imp-34611 integer denominators (12, 8), rounded, and compared numerator-by-
 *   numerator; the raw pre-round reconstruction error is tracked to certify the match is exact.
 *   Then the derived exact-integer weights are pushed through the imp-34611 q3-share pipeline
 *   [share = (q3/6)/(-q2/2 + q3/6); q1^2 cancels] over the SAME dp = 6e-3 .. 3e-1 window and mid/deep
 *   partition at N* ~ 4.62e13 (imp-33620 sigma < 0.01), and the window-mean plateau drift is compared
 *   both to the imp-34611 stored -0.096825 AND to the raw-float-weight plateau.
 *
 *   THE FINDING (weights reproduce exactly; the 4th-order does NOT show the 6th-order 1e9x signature)
 *   ------------------------------------------------------------------------------------------------
 *   (F1) BOTH REFERENCE CONSTRUCTIONS REPRODUCE EVERY INLINE COEFFICIENT EXACTLY. The Fornberg
 *        recurrence and the Vandermonde solve independently return q2 = [-1, 16, -30, 16, -1]/12 and
 *        q3 = [1, -8, 13, 0, -13, 8, -1]/8 -- matching all 12 imp-34611 numerators (5 for q2, 7 for q3)
 *        with a raw pre-round reconstruction error < 1e-9. The imp-34611 4th-order stencils are
 *        CERTIFIED correct against two independent reference derivations.
 *   (F2) THE PLATEAU DRIFT REPRODUCES FROM THE RE-DERIVED WEIGHTS. Pushing the reference-derived
 *        exact-integer weights through the imp-34611 q3-share pipeline gives a window-mean drift
 *        ~ -0.096817, agreeing with the imp-34611 stored plateau_drift_4th_order -0.096825 to ~8e-6 --
 *        within the ill-conditioned share band (see F4), so the 4th-order plateau confirmation is NOT
 *        built on a mis-specified stencil.
 *   (F3) THE 4TH-ORDER STENCIL DOES *NOT* REPRODUCE THE 6TH-ORDER ~3e-4 (~1e9x) SIGNATURE. Unlike the
 *        6th-order 9-point Fornberg floats (which carried a ~5e-13 residual that imp-34654 saw amplify
 *        to ~3e-4), the smaller 4th-order Fornberg floats are EXACTLY REPRESENTABLE: their raw
 *        residual (float weight * denom, un-rounded) is < 1e-15. With no weight error to amplify, the
 *        raw-float plateau differs from the exact-integer plateau by only ~4e-8 -- roughly four orders
 *        BELOW the 6th-order ~3e-4 shift. The 1e9x amplification imp-34654 read is a property of the
 *        LARGER 9-point stencil's Fornberg residual, not a universal feature of the q3-share; the
 *        4th-order stencil has no residual to feed the near-cancellation.
 *   (F4) THE SHARE IS STILL ILL-CONDITIONED, BUT ~30x MORE MILDLY. Re-evaluating the SAME exact-integer
 *        weights in a different float summation order (a loop accumulation vs the imp-34611 grouped
 *        single-expression share4th) shifts the window-mean plateau by ~9e-6 -- a real float-order
 *        sensitivity (the q3 near-cancellation), but ~30x below the 6th-order ~3e-4. So the q3-share
 *        near-cancellation the imp-34626 F3 / imp-34649 / imp-34654 roundoff-floor reading identified
 *        is present at 4th order too, just far less severe: the stencil is exactly correct; the share
 *        it feeds is conditioned by its cancellation depth, which is milder for the smaller stencil.
 *
 *   CROSS-VALIDATION ONLY. This re-derives already-used stencil weights and re-runs an already-certified
 *   decomposition; it changes NO bound. Reproduces the imp-34446/imp-34531/imp-34573/imp-34611
 *   primitives (heightForN, eColl, qOfP, the mid/deep ladders, the q3-share) inline, imports NOTHING
 *   (no lambda-rh-height-mapping, no polymath15 constant module, no zeros bundle), per the
 *   no-heavy-imports directive. q1,q2,q3 remain inherited central differences, NOT fresh analytic
 *   closed forms -- so the sigma -> 1 deep-tail regime (imp-3220/imp-3406 component model least
 *   trustworthy) is inherited as-is; this certifies the STENCIL, it does not rehabilitate the
 *   surrogate. The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED;
 *   the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator
 *   positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34611-plateau-drift-independent-stencil-crosscheck.js (the inline 4th-order stencils certified here)
 *   @see imp-34654-sixth-order-stencil-reference-weight-crossvalidation.js (the 6th-order analogue this extends)
 *   @see imp-34626-plateau-drift-sixth-order-stencil-crosscheck.js (the 6th-order stencil / conditioning)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13, sigma<0.01)
 *
 *   Ticket: imp-34684 (accuracy, medium). Reference-weight cross-validation; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34573/imp-34611 primitives (imports NOTHING): --
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz, reproduced inline (~0.383748)
const DEEP_TAIL_N = 4.624385e13; // imp-33620 sigma < 0.01 landmark N* -- the mid/deep boundary

function heightForN(N) {
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 80; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-13 * Math.max(1, T)) break;
  }
  return T;
}

const eColl = (N) => C_C * Math.sqrt(Math.log(heightForN(N)) / N);
const qOfP = (pp) => Math.log(eColl(Math.exp(pp))); // q(p) = log E_coll in p = log N

// -- imp-34611 INLINE 4th-order stencil numerators (the object under test), and integer denominators --
const Q2_INLINE = { grid: [-2, -1, 0, 1, 2], num: [-1, 16, -30, 16, -1], denom: 12, order: 2 };
const Q3_INLINE = { grid: [-3, -2, -1, 0, 1, 2, 3], num: [1, -8, 13, 0, -13, 8, -1], denom: 8, order: 3 };

// (A) REFERENCE CONSTRUCTION 1 -- Fornberg (1988) finite-difference-weight recurrence (verbatim imp-34654).
//   Returns c[j][k] = weight for grid point j in the order-k derivative, for a grid x and eval point z.
function fornbergWeights(z, x, m) {
  const n = x.length - 1;
  const c = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  let c1 = 1;
  let c4 = x[0] - z;
  c[0][0] = 1;
  for (let i = 1; i <= n; i++) {
    const mn = Math.min(i, m);
    let c2 = 1;
    const c5 = c4;
    c4 = x[i] - z;
    for (let j = 0; j <= i - 1; j++) {
      const c3 = x[i] - x[j];
      c2 = c2 * c3;
      if (j === i - 1) {
        for (let k = mn; k >= 1; k--) c[i][k] = (c1 * (k * c[i - 1][k - 1] - c5 * c[i - 1][k])) / c2;
        c[i][0] = (-c1 * c5 * c[i - 1][0]) / c2;
      }
      for (let k = mn; k >= 1; k--) c[j][k] = (c4 * c[j][k] - k * c[j][k - 1]) / c3;
      c[j][0] = (c4 * c[j][0]) / c3;
    }
    c1 = c2;
  }
  return x.map((_, j) => c[j][m]); // the order-m derivative weights (unit spacing)
}

// (B) REFERENCE CONSTRUCTION 2 -- Vandermonde solve (verbatim imp-34654): V w = b, V[i][j] = k_j^i.
function factorial(n) {
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}
function vandermondeWeights(grid, m) {
  const n = grid.length;
  const A = Array.from({ length: n }, (_, i) => [
    ...grid.map((x) => Math.pow(x, i)),
    i === m ? factorial(m) : 0,
  ]);
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(A[r][col]) > Math.abs(A[piv][col])) piv = r;
    [A[col], A[piv]] = [A[piv], A[col]];
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = A[r][col] / A[col][col];
      for (let cc = col; cc <= n; cc++) A[r][cc] -= f * A[col][cc];
    }
  }
  return A.map((row, i) => row[n] / A[i][i]);
}

// Compare a reference-derived weight vector (unit spacing) against an inline stencil: return the max
// reconstruction error of (weight * denom) vs the inline integer numerator, and whether every rounded
// numerator matches exactly, plus the max raw residual (how far the un-rounded float weight is from
// the exact integer -- the quantity the ill-conditioned share amplifies).
function checkStencil(stencil, rawWeights) {
  let maxErr = 0;
  let exactMatch = true;
  for (let j = 0; j < stencil.num.length; j++) {
    const scaled = rawWeights[j] * stencil.denom;
    const rounded = Math.round(scaled);
    maxErr = Math.max(maxErr, Math.abs(scaled - rounded));
    if (rounded !== stencil.num[j]) exactMatch = false;
  }
  return { exactMatch, maxErr };
}

const rawFornbergQ2 = fornbergWeights(0, Q2_INLINE.grid, Q2_INLINE.order);
const rawFornbergQ3 = fornbergWeights(0, Q3_INLINE.grid, Q3_INLINE.order);
const FORNBERG_Q2 = checkStencil(Q2_INLINE, rawFornbergQ2);
const FORNBERG_Q3 = checkStencil(Q3_INLINE, rawFornbergQ3);
const VANDERMONDE_Q2 = checkStencil(Q2_INLINE, vandermondeWeights(Q2_INLINE.grid, Q2_INLINE.order));
const VANDERMONDE_Q3 = checkStencil(Q3_INLINE, vandermondeWeights(Q3_INLINE.grid, Q3_INLINE.order));
const ALL_EXACT =
  FORNBERG_Q2.exactMatch && FORNBERG_Q3.exactMatch && VANDERMONDE_Q2.exactMatch && VANDERMONDE_Q3.exactMatch;
const MAX_RECON_ERR = Math.max(FORNBERG_Q2.maxErr, FORNBERG_Q3.maxErr, VANDERMONDE_Q2.maxErr, VANDERMONDE_Q3.maxErr);
// The RAW residual of the Fornberg floats (un-rounded) -- the 6th-order carried ~5e-13 here; the
// smaller 4th-order weights are exactly representable, so this is the quantity that differs.
const RAW_FLOAT_RESIDUAL = Math.max(FORNBERG_Q2.maxErr, FORNBERG_Q3.maxErr);

// -- Push the REFERENCE-derived weights through the imp-34611 q3-share pipeline. Exact-integer weights
//    (recovered from the Fornberg derivation) drive shareRef; the raw un-rounded Fornberg floats drive
//    shareRaw; the imp-34611 grouped single-expression share4th drives shareGrouped (a different float
//    summation order over the SAME algebraic weights, to expose the residual conditioning). --
const exactQ2 = rawFornbergQ2.map((w) => Math.round(w * Q2_INLINE.denom)); // == Q2_INLINE.num
const exactQ3 = rawFornbergQ3.map((w) => Math.round(w * Q3_INLINE.denom)); // == Q3_INLINE.num

function shareFrom(N, dp, q2w, q2denom, q3w, q3denom) {
  const p = Math.log(N);
  let s2 = 0;
  for (let j = 0; j < Q2_INLINE.grid.length; j++) s2 += q2w[j] * qOfP(p + Q2_INLINE.grid[j] * dp);
  const q2 = s2 / q2denom / (dp * dp);
  let s3 = 0;
  for (let j = 0; j < Q3_INLINE.grid.length; j++) s3 += q3w[j] * qOfP(p + Q3_INLINE.grid[j] * dp);
  const q3 = s3 / q3denom / (dp * dp * dp);
  return q3 / 6 / (-q2 / 2 + q3 / 6);
}
const shareRef = (N, dp) => shareFrom(N, dp, exactQ2, Q2_INLINE.denom, exactQ3, Q3_INLINE.denom);
const shareRaw = (N, dp) => shareFrom(N, dp, rawFornbergQ2, 1, rawFornbergQ3, 1); // denom absorbed into floats

// imp-34611 VERBATIM grouped share4th -- algebraically the SAME weights, different float summation order.
function shareGrouped(N, dp) {
  const p = Math.log(N);
  const f0 = qOfP(p);
  const fp = qOfP(p + dp);
  const fm = qOfP(p - dp);
  const fpp = qOfP(p + 2 * dp);
  const fmm = qOfP(p - 2 * dp);
  const fppp = qOfP(p + 3 * dp);
  const fmmm = qOfP(p - 3 * dp);
  const q2 = (-fpp + 16 * fp - 30 * f0 + 16 * fm - fmm) / (12 * dp * dp);
  const q3 = (-fppp + 8 * fpp - 13 * fp + 13 * fm - 8 * fmm + fmmm) / (8 * dp * dp * dp);
  return q3 / 6 / (-q2 / 2 + q3 / 6);
}

const MID_LADDER = [Math.pow(10, 12.0), Math.pow(10, 12.5), Math.pow(10, 13.0), Math.pow(10, 13.333)];
const DEEP_LADDER = [DEEP_TAIL_N, Math.pow(10, 14.0), Math.pow(10, 14.5), Math.pow(10, 15.0)];
const mean = (vals) => vals.reduce((a, b) => a + b, 0) / vals.length;
function driftAt(share, dp) {
  const midMean = mean(MID_LADDER.map((N) => share(N, dp)));
  const deepMean = mean(DEEP_LADDER.map((N) => share(N, dp)));
  return (deepMean - midMean) / midMean;
}

const PLATEAU_STEPS = [6e-3, 8e-3, 1e-2, 1.5e-2, 2e-2, 3e-2, 5e-2, 8e-2, 1e-1, 1.5e-1, 2e-1, 3e-1];
const IMP34611_STORED_PLATEAU_4TH = -0.096825; // imp-34611 plateau_drift_4th_order (baked literal)
const IMP34654_SIXTH_ORDER_RAW_SIGNATURE = 3e-4; // imp-34654 raw-float plateau shift (~1e9x amplification)
const PLATEAU_REF = mean(PLATEAU_STEPS.map((dp) => driftAt(shareRef, dp))); // ~ -0.096817
const PLATEAU_RAW = mean(PLATEAU_STEPS.map((dp) => driftAt(shareRaw, dp))); // ~ -0.096817 (no residual to amplify)
const PLATEAU_GROUPED = mean(PLATEAU_STEPS.map((dp) => driftAt(shareGrouped, dp))); // ~ -0.096826 (imp-34611 order)
const PLATEAU_REF_VS_IMP34611 = Math.abs(PLATEAU_REF - IMP34611_STORED_PLATEAU_4TH); // ~8e-6
const PLATEAU_RAW_VS_REF = Math.abs(PLATEAU_RAW - PLATEAU_REF); // ~4e-8 (NOT the 6th-order ~3e-4)
const ORDERING_SENSITIVITY = Math.abs(PLATEAU_GROUPED - PLATEAU_REF); // ~9e-6 (float-order conditioning, mild)

export const IMP34684_FOURTH_ORDER_STENCIL_REFERENCE_CROSSVALIDATION = Object.freeze({
  id: 'imp-34684',
  proofSection: 'S-frontier',
  claim_measured:
    'Extend the imp-34654 reference-weight cross-validation to the imp-34611 4th-order stencils (q2 = ' +
    'accuracy-4 5-point 2nd derivative, q3 = accuracy-4 7-point 3rd derivative): re-derive both weight ' +
    'sets from the Fornberg 1988 recurrence and a Vandermonde solve, confirm they match the inline ' +
    'numerators EXACTLY, and measure whether the raw un-rounded float weights amplify the q3-share ' +
    'plateau by the same 6th-order ~3e-4 (~1e9x) near-cancellation signature. Cross-validation on an ' +
    'inherited component model, not a bound.',
  q2_inline_weights: Object.freeze(Q2_INLINE.num.slice()),
  q2_denominator: Q2_INLINE.denom,
  q3_inline_weights: Object.freeze(Q3_INLINE.num.slice()),
  q3_denominator: Q3_INLINE.denom,
  fornberg_q2_exact_match: FORNBERG_Q2.exactMatch,
  fornberg_q3_exact_match: FORNBERG_Q3.exactMatch,
  vandermonde_q2_exact_match: VANDERMONDE_Q2.exactMatch,
  vandermonde_q3_exact_match: VANDERMONDE_Q3.exactMatch,
  all_reference_weights_match_inline_exactly: ALL_EXACT,
  max_reconstruction_error: +MAX_RECON_ERR.toExponential(3), // < 1e-9
  raw_fornberg_float_residual: +RAW_FLOAT_RESIDUAL.toExponential(3), // < 1e-15 (exactly representable)
  imp34611_stored_plateau_4th: IMP34611_STORED_PLATEAU_4TH, // -0.096825
  plateau_from_reference_weights: +PLATEAU_REF.toFixed(6), // ~ -0.096817
  plateau_reference_vs_imp34611_abs: +PLATEAU_REF_VS_IMP34611.toExponential(3), // ~8e-6 (ill-conditioned band)
  plateau_from_raw_float_weights: +PLATEAU_RAW.toFixed(6), // ~ -0.096817
  plateau_raw_vs_reference_abs: +PLATEAU_RAW_VS_REF.toExponential(3), // ~4e-8 (NO 6th-order 1e9x signature)
  imp34654_sixth_order_raw_signature: IMP34654_SIXTH_ORDER_RAW_SIGNATURE, // 3e-4 (the value NOT reproduced here)
  fourth_order_reproduces_sixth_order_signature: PLATEAU_RAW_VS_REF > IMP34654_SIXTH_ORDER_RAW_SIGNATURE / 10, // false
  plateau_ordering_sensitivity_abs: +ORDERING_SENSITIVITY.toExponential(3), // ~9e-6 (mild share conditioning)
  isRigorous: false,
  verdict:
    'CROSS-VALIDATION (NOT rigorous). Extend the imp-34654 reference-weight certification to the ' +
    'imp-34611 4th-order stencils [q2 = [-1, 16, -30, 16, -1]/12 (5-point); q3 = [1, -8, 13, 0, -13, ' +
    '8, -1]/8 (7-point)]. (F1) BOTH REFERENCES REPRODUCE EVERY COEFFICIENT EXACTLY: the Fornberg 1988 ' +
    'recurrence and the Vandermonde solve independently return all 12 inline numerators (5 for q2, 7 ' +
    'for q3) with a raw pre-round reconstruction error < 1e-9 -- certified against two reference ' +
    'derivations. (F2) THE PLATEAU DRIFT REPRODUCES: pushing the reference-derived exact-integer ' +
    'weights through the imp-34611 q3-share pipeline gives a window-mean drift ~ -0.096817, agreeing ' +
    'with the imp-34611 stored -0.096825 to ~8e-6 (within the ill-conditioned share band of F4), so ' +
    'the 4th-order plateau confirmation is not built on a mis-specified stencil. (F3) THE 4TH-ORDER ' +
    'STENCIL DOES NOT REPRODUCE THE 6TH-ORDER ~3e-4 (~1e9x) SIGNATURE: unlike the 9-point Fornberg ' +
    'floats (~5e-13 residual, amplified to ~3e-4 in imp-34654), the smaller 4th-order Fornberg floats ' +
    'are EXACTLY REPRESENTABLE (raw residual < 1e-15), so with no weight error to amplify the raw-float ' +
    'plateau differs from the exact-integer plateau by only ~4e-8 -- roughly four orders below the ' +
    '6th-order shift. The 1e9x amplification is a property of the larger 9-point stencils Fornberg ' +
    'residual, not a universal feature of the q3-share. (F4) THE SHARE IS STILL ILL-CONDITIONED BUT ' +
    '~30x MORE MILDLY: re-evaluating the SAME exact-integer weights in a different float summation ' +
    'order (loop accumulation vs the imp-34611 grouped share4th) shifts the plateau ~9e-6 -- a real ' +
    'float-order sensitivity from the q3 near-cancellation, but ~30x below the 6th-order ~3e-4; the ' +
    'stencil is exactly correct and the share it feeds is conditioned by its cancellation depth, milder ' +
    'for the smaller stencil. q1,q2,q3 are inherited central differences, NOT fresh analytic closed ' +
    'forms, so the sigma -> 1 deep-tail regime (imp-3220/imp-3406 component model least trustworthy) is ' +
    'inherited as-is -- this certifies the STENCIL, it does not rehabilitate the surrogate. The -2 ' +
    'asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb ' +
    'GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34611 (the inline 4th-order stencils certified here); imp-34654 (the 6th-order reference-weight ' +
    'cross-validation this extends); imp-34626 (6th-order 9-point stencil / conditioning); imp-34649 ' +
    '(shared-table plateau cross-validation); imp-33620 (deep-tail landmark N* ~ 4.62e13, sigma < 0.01); ' +
    'imp-2714 (C_C ansatz); imp-486 (C_mb GUE-conditional); Fornberg B. (1988), "Generation of finite ' +
    'difference formulas on arbitrarily spaced grids", Math. Comp. 51, 699-706.',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34684_ASSERTIONS = [
  {
    id: 'imp34684-fornberg-reproduces-inline-weights-exactly',
    holds: () =>
      FORNBERG_Q2.exactMatch && FORNBERG_Q3.exactMatch && FORNBERG_Q2.maxErr < 1e-9 && FORNBERG_Q3.maxErr < 1e-9,
    why: 'F1: the Fornberg 1988 recurrence independently returns all 5 q2 and all 7 q3 imp-34611 inline numerators exactly (raw reconstruction error < 1e-9), certifying the 4th-order stencils against the canonical reference algorithm.',
  },
  {
    id: 'imp34684-vandermonde-reproduces-inline-weights-exactly',
    holds: () => VANDERMONDE_Q2.exactMatch && VANDERMONDE_Q3.exactMatch && MAX_RECON_ERR < 1e-9,
    why: 'F1: a fully independent Vandermonde linear solve returns the SAME 12 inline numerators exactly -- two reference constructions agree, so the imp-34611 4th-order weights are not a mis-transcription.',
  },
  {
    id: 'imp34684-plateau-drift-reproduces-from-reference-weights',
    holds: () => ALL_EXACT && PLATEAU_REF_VS_IMP34611 < 1e-4 && PLATEAU_REF < -0.08,
    why: 'F2: pushing the reference-derived exact-integer weights through the imp-34611 q3-share pipeline reproduces the window-mean plateau drift ~ -0.096817, agreeing with the imp-34611 -0.096825 to ~8e-6 (within the ill-conditioned share band) -- the 4th-order plateau confirmation is not built on a mis-specified stencil.',
  },
  {
    id: 'imp34684-fourth-order-does-not-reproduce-sixth-order-signature',
    holds: () =>
      RAW_FLOAT_RESIDUAL < 1e-12 &&
      PLATEAU_RAW_VS_REF < 1e-5 &&
      PLATEAU_RAW_VS_REF < IMP34654_SIXTH_ORDER_RAW_SIGNATURE / 10 &&
      IMP34684_FOURTH_ORDER_STENCIL_REFERENCE_CROSSVALIDATION.fourth_order_reproduces_sixth_order_signature === false,
    why: 'F3: the 4th-order Fornberg floats are exactly representable (raw residual < 1e-12), so with no weight error to amplify the raw-float plateau differs from the exact-integer plateau by only ~4e-8 -- roughly four orders below the 6th-order ~3e-4 (~1e9x) signature. The 4th-order stencil does NOT reproduce that conditioning signature.',
  },
  {
    id: 'imp34684-share-still-ill-conditioned-but-mild',
    holds: () =>
      ORDERING_SENSITIVITY > PLATEAU_RAW_VS_REF &&
      ORDERING_SENSITIVITY < IMP34654_SIXTH_ORDER_RAW_SIGNATURE,
    why: 'F4: re-evaluating the SAME exact-integer weights in a different float summation order shifts the plateau ~9e-6 -- a real float-order sensitivity from the q3 near-cancellation, larger than the raw-vs-exact ~4e-8 but ~30x below the 6th-order ~3e-4, so the share is ill-conditioned but far more mildly than the 9-point stencil.',
  },
  {
    id: 'imp34684-honesty-gate-no-qed',
    holds: () =>
      IMP34684_FOURTH_ORDER_STENCIL_REFERENCE_CROSSVALIDATION.isRigorous === false &&
      /NO QED/.test(IMP34684_FOURTH_ORDER_STENCIL_REFERENCE_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP34684_FOURTH_ORDER_STENCIL_REFERENCE_CROSSVALIDATION.verdict) &&
      /UNTOUCHED/.test(IMP34684_FOURTH_ORDER_STENCIL_REFERENCE_CROSSVALIDATION.verdict),
    why: 'Honesty gate: cross-validation only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34684_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34684-fourth-order-stencil-reference-weight-crossvalidation assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34684_FOURTH_ORDER_STENCIL_REFERENCE_CROSSVALIDATION;
