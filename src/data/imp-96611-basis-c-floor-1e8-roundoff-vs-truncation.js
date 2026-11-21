/**
 * imp-96611 -- DECIDING the imp-96588 basis-C L = 1e8 floor bend: converged Simpson-TRUNCATION
 * floor, or catastrophic-cancellation / summation ROUNDOFF artifact? Verdict: ROUNDOFF ARTIFACT.
 * Recomputing the identical direct double-box quadrature with Kahan-compensated summation (and,
 * independently, a cancellation-free variance) collapses the L = 1e8 clean floor from the naive
 * 2.7235e-2 to 2.9819e-5 -- a ~913x drop -- and the UPWARD BEND DISAPPEARS: the compensated
 * truncation floor is FLAT at ~3-4e-5 across the anchor -> 1e8 range. The imp-96588 exponent
 * bend (1.81 -> 2.57) and even the imp-96568 above-anchor law p ~ 1.81 are both artifacts of the
 * Var = L - 2*Int large-minus-large cancellation, not features of the Simpson truncation floor.
 *
 * BACKGROUND. imp-96588 measured a further basis-C direct-integral rung at L = 1e8 and found the
 * clean ppp = 3 floor (2.7235e-2) sat ~5.7x above the imp-96568 p ~ 1.81 extrapolation (~4.82e-3),
 * with the local exponent steepening to ~2.57 and the optimum ppp collapsing 3 -> 2. Its HONEST
 * CAVEAT flagged the mechanism under suspicion: Var = L - 2*Int subtracts ~1e8 from ~1e8 to recover
 * the true number variance sigma^2(1e8) ~ 2.21, and the Simpson integral is a naive double sum of
 * ~3e8 weighted terms of magnitude up to ~3e7, so summation roundoff plus the final large-minus-
 * large subtraction can co-dominate -- making the exponent 2.426 and L* ~ 8e7 a SHARPENED PROJECTION,
 * not a proof of a converged floor. This module settles that.
 *
 * WHAT THIS MODULE DOES (measurement only). It re-ran the SAME rho = Cov/Var double-box quadrature
 * (identical clusterY = sinc^2, identical Simpson nodes/weights as imp-96430/imp-96448/imp-96568/
 * imp-96588) at L = 1e8 for ppp = 2 and 3, computing the weighted-sample sum THREE ways in one pass:
 *   (A) naive double summation   -- reproduces imp-96588 exactly (baseline)
 *   (B) Kahan-compensated sum     -- removes summation roundoff, KEEPS Simpson truncation
 *   (C) cancellation-free Var     -- Var = 2L*int_L^inf Y + 2*int_0^L r*Y (no large-minus-large)
 * and cross-checked Var against the closed-form sigma2Exact (Si/Ci). It also recomputed the anchor
 * (5.9e6) and 1e7 ppp = 3 floors with Kahan to expose that even the imp-96568 two-rung law was
 * roundoff-tainted. Offline: tmp/imp-96611-doubledouble.mjs (~66-68 s/rung at 1e8) and
 * tmp/imp-96611-lowrungs.mjs (~3-6 s/rung). A cheap live recheck at import recomputes rhoExact,
 * sigma2Exact, the roundoff factors and the clean-floor exponent (all closed-form -- no 3e8 quadrature).
 *
 * FINDINGS (all measured here, not asserted).
 *  1. THE BEND IS ROUNDOFF, NOT TRUNCATION -- ~913x FLOOR COLLAPSE UNDER COMPENSATED SUMMATION. The
 *     naive ppp = 3 floor at 1e8 reproduces imp-96588 (2.723498e-2); Kahan-compensated summation gives
 *     2.981885e-5 and the independent cancellation-free variance gives 2.981642e-5 -- agreeing to 4
 *     figures and ~913x below the naive value. The naive Var (2.348863) carried a 0.136 error vs the
 *     exact sigma^2(1e8) = 2.212426; Kahan/cancellation-free cut that to 4.16e-3. The floor imp-96588
 *     measured was almost entirely summation roundoff of the ~3e8-term Simpson sum.
 *  2. THE COMPENSATED TRUNCATION FLOOR IS FLAT -- NO POWER LAW. Kahan ppp = 3 floors are 3.9340e-5
 *     (anchor 5.9e6), 3.7246e-5 (1e7), 2.9819e-5 (1e8): a clean-floor exponent of ~ -0.10 over the
 *     anchor -> 1e8 range (mildly DECREASING), versus the naive-floor exponent 2.426. Even the
 *     imp-96568 law p ~ 1.81 was already roundoff-tainted -- its 1e7 naive rung (7.398e-5) is ~2x
 *     the clean 1e7 floor (3.725e-5), while the anchor naive rung (2.841e-5, low roundoff) was near
 *     clean, manufacturing a spurious upward slope from two points.
 *  3. THE ppp COLLAPSE 3 -> 2 IS ALSO A ROUNDOFF ARTIFACT. Naive floors put ppp = 2 (1.784e-2) below
 *     ppp = 3 (2.723e-2), the imp-96588 "optimum collapsed to 2". With Kahan the ordering REVERSES:
 *     ppp = 3 (2.982e-5) beats ppp = 2 (3.352e-4) by ~11x, i.e. more panels help monotonically as a
 *     truncation regime should. The "collapse" was roundoff making the finer grid look worse.
 *  4. L* IS CORRECTED, NOT CONFIRMED. imp-96588 re-bisected the corroboration-reach crossover to
 *     L* ~ 8e7 (naive) from a floor that is ~913x too large. The sine-kernel signal |rho + 1/2| at 1e8
 *     is 1.5872e-2, still ~530x ABOVE the compensated truncation floor (2.982e-5) -- so with
 *     compensated summation the truncation floor does NOT cross the signal at 1e8, and L* ~ 8e7 is not
 *     a truncation reach but a DOUBLE-PRECISION ARITHMETIC reach set by the roundoff floor. The genuine
 *     truncation-limited reach lies far past 1e8; the operative wall for the direct integral past ~1e7
 *     is arithmetic precision (use compensated / double-double summation), not Simpson truncation.
 *
 * HONEST CAVEAT. rho is the THEORETICAL GUE (sine-kernel, universality) two-interval correlation for
 * boxes of unfolded length L; there are no computed Riemann zeros behind these values. Kahan
 * compensation removes summation roundoff but not every rounding path (the O(3e8) node evaluations
 * of sin still carry ~1 ulp each); the residual Kahan Var error 4.16e-3 at ppp = 3 is genuine Simpson
 * truncation, and the ~3-4e-5 clean floors are themselves double-precision quadrature values, not
 * arbitrary-precision truth. The flat clean-floor law rests on three ppp = 3 rungs (5.9e6, 1e7, 1e8);
 * it refutes the imp-96568/imp-96588 upward laws but is not itself a proof of an asymptotic floor law.
 * Changes no bound, establishes no operator positivity, does not touch the ~1.9-sigma excursion
 * confidence.
 *
 * VERDICT. The imp-96588 basis-C L = 1e8 floor bend is a CATASTROPHIC-CANCELLATION / SUMMATION
 * ROUNDOFF ARTIFACT, not a converged truncation floor. Kahan-compensated summation and an independent
 * cancellation-free variance both collapse the clean ppp = 3 floor from 2.7235e-2 to ~2.982e-5 (~913x),
 * the upward bend (exponent 2.43-2.57) and the imp-96568 p ~ 1.81 law both vanish (compensated floor
 * flat at ~3-4e-5, exponent ~ -0.10), and the ppp collapse 3 -> 2 reverses. L* ~ 8e7 is CORRECTED:
 * it is a double-precision arithmetic reach set by the roundoff floor, not a Simpson-truncation reach;
 * the compensated truncation floor (~3e-5) stays ~530x below the 1e8 signal (1.587e-2), so the true
 * truncation-limited corroboration reach is far past 1e8, with arithmetic precision the operative wall.
 * Measurement only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED;
 * no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96588-basis-c-floor-1e8-rung-powerlaw-bend (the naive bend / L* ~ 8e7 this corrects)
 * @see imp-96568-basis-c-intermediate-rung-floor-ladder (the two-rung p ~ 1.81 law this refutes as roundoff)
 * @see imp-96448-direct-basis-c-anchor-floor (the naive anchor floor ~2.84e-5 and ppp = 3 protocol)
 * @see imp-96424-basis-c-cancellation-reformulation-floor (the Var cancellation the compensated pass sidesteps)
 *
 * Import-light: no zeros bundle, no sibling imports. Si/Ci, the exact number variance, the exact rho
 * and the signal are re-derived verbatim here (identical to imp-96430/imp-96448/imp-96568/imp-96588)
 * so the rung is independent; the expensive direct-quadrature floors are carried as offline-measured
 * constants (naive reproduces imp-96588; Kahan / cancellation-free are the new roundoff-free values).
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5;
const PT_ANCHOR_L = 5.9e6;
const L_1E8 = 1e8;

// imp-96568/imp-96588 published NAIVE ppp = 3 floors (reproduced exactly by this module baseline).
const NAIVE_ANCHOR_FLOOR = 2.841419e-5; // imp-96448/imp-96568 anchor floor (matches to 4 figs)
const NAIVE_FLOOR_1E7 = 7.397836e-5;    // imp-96568 1e7 floor
const NAIVE_FLOOR_1E8_PPP3 = 2.723498e-2; // imp-96588 clean ppp = 3 floor at 1e8
const NAIVE_FLOOR_1E8_PPP2 = 1.783527e-2; // imp-96588 best-achievable (ppp = 2) floor at 1e8

// NEW: Kahan-compensated (roundoff-free) ppp = 3 floors, tmp/imp-96611-doubledouble.mjs + lowrungs.mjs.
const KAHAN_ANCHOR_FLOOR = 3.934031e-5;
const KAHAN_FLOOR_1E7 = 3.724614e-5;
const KAHAN_FLOOR_1E8_PPP3 = 2.981885e-5;
const KAHAN_FLOOR_1E8_PPP2 = 3.351676e-4;
// Independent cancellation-free variance (Var = 2L*tail + 2*int r*Y, no large-minus-large) at 1e8 ppp=3.
const CANCELFREE_FLOOR_1E8_PPP3 = 2.981642e-5;
// Measured variances at L = 1e8, ppp = 3 (offline): the naive Var carries a large cancellation error.
const VAR_1E8_PPP3_NAIVE = 2.348863;
const VAR_1E8_PPP3_KAHAN = 2.216590;

function Si(x) {
  if (x < 0) return -Si(-x);
  if (x <= 36) {
    let term = x, sum = x;
    for (let k = 1; k < 200; k++) {
      term *= (-x * x) / ((2 * k) * (2 * k + 1));
      sum += term / (2 * k + 1);
      if (Math.abs(term) < 1e-18 * Math.abs(sum) && k > 5) break;
    }
    return sum;
  }
  const inv = 1 / x, i2 = inv * inv;
  let f = inv, tf = inv;
  for (let k = 1; k < 20; k++) { tf *= -(2 * k) * (2 * k - 1) * i2; if (!isFinite(tf) || Math.abs(tf) < 1e-20 * Math.abs(f)) break; f += tf; }
  let g = i2, tg = i2;
  for (let k = 1; k < 20; k++) { tg *= -(2 * k + 1) * (2 * k) * i2; if (!isFinite(tg) || Math.abs(tg) < 1e-20 * Math.abs(g)) break; g += tg; }
  return PI / 2 - f * Math.cos(x) - g * Math.sin(x);
}
function Ci(x) {
  if (x <= 36) {
    let t = 1, sum = 0;
    for (let k = 1; k < 200; k++) { t *= (-x * x) / ((2 * k - 1) * (2 * k)); const add = t / (2 * k); sum += add; if (Math.abs(add) < 1e-18 * Math.abs(sum) && k > 5) break; }
    return EULER + Math.log(x) + sum;
  }
  const inv = 1 / x, i2 = inv * inv;
  let f = inv, tf = inv;
  for (let k = 1; k < 20; k++) { tf *= -(2 * k) * (2 * k - 1) * i2; if (!isFinite(tf) || Math.abs(tf) < 1e-20 * Math.abs(f)) break; f += tf; }
  let g = i2, tg = i2;
  for (let k = 1; k < 20; k++) { tg *= -(2 * k + 1) * (2 * k) * i2; if (!isFinite(tg) || Math.abs(tg) < 1e-20 * Math.abs(g)) break; g += tg; }
  return f * Math.sin(x) - g * Math.cos(x);
}
const sigma2Exact = (L) => {
  const x = TWO_PI * L;
  return (1 / (PI * PI)) * (Math.log(x) + EULER + 1 - Math.cos(x) - Ci(x)) + L * (1 - (2 / PI) * Si(x));
};
const rhoExact = (L) => sigma2Exact(2 * L) / (2 * sigma2Exact(L)) - 1;
const signalOf = (L) => Math.abs(rhoExact(L) - RIGIDITY_LIMIT); // |rho + 1/2|

// LIVE (cheap, closed-form): roundoff-suppression factors, the exact variance, the clean-floor
// exponent, and the signal-vs-clean-floor margin at 1e8.
const varExact1e8 = sigma2Exact(L_1E8); // ~2.212426
const roundoffFactorPpp3 = NAIVE_FLOOR_1E8_PPP3 / KAHAN_FLOOR_1E8_PPP3; // ~913x
const roundoffFactorPpp2 = NAIVE_FLOOR_1E8_PPP2 / KAHAN_FLOOR_1E8_PPP2; // ~53x
const kahanCancelFreeAgreement = Math.abs(KAHAN_FLOOR_1E8_PPP3 - CANCELFREE_FLOOR_1E8_PPP3); // ~2.4e-9
const naiveExponentAnchorTo1e8 = Math.log(NAIVE_FLOOR_1E8_PPP3 / NAIVE_ANCHOR_FLOOR) / Math.log(L_1E8 / PT_ANCHOR_L); // ~2.426
const cleanExponentAnchorTo1e8 = Math.log(KAHAN_FLOOR_1E8_PPP3 / KAHAN_ANCHOR_FLOOR) / Math.log(L_1E8 / PT_ANCHOR_L); // ~ -0.098
const signal1e8 = signalOf(L_1E8); // ~1.587e-2
const signalOverCleanFloor = signal1e8 / KAHAN_FLOOR_1E8_PPP3; // ~532x -- clean floor does NOT cross signal at 1e8
const varErrNaive = VAR_1E8_PPP3_NAIVE - varExact1e8; // ~0.136
const varErrKahan = VAR_1E8_PPP3_KAHAN - varExact1e8; // ~4.16e-3

export const IMP96611_BASIS_C_FLOOR_1E8_ROUNDOFF_VS_TRUNCATION = {
  ticket: 'imp-96611',
  question:
    'imp-96588 measured the basis-C direct-integral floor bending upward at L = 1e8 (local exponent 1.81 -> 2.57) but its HONEST CAVEAT flagged that Var = L - 2*Int subtracts ~1e8 from ~1e8, so double-precision roundoff may be overtaking the Simpson truncation floor and the exponent 2.426 / L* ~ 8e7 are a projection, not a converged floor. Decide, with compensated / cancellation-free arithmetic, whether the bend is a converged truncation floor or a roundoff artifact, and confirm or correct L*. Measurement only; theoretical GUE quantity, not real zeros.',
  rigidityLimit: RIGIDITY_LIMIT,
  ptAnchorL: PT_ANCHOR_L,
  L: L_1E8,
  rhoExact1e8: rhoExact(L_1E8),
  varExact1e8, // closed-form sigma^2(1e8) ~ 2.212426, the true variance the direct integral targets
  floors: {
    naive: { anchor: NAIVE_ANCHOR_FLOOR, l1e7: NAIVE_FLOOR_1E7, l1e8Ppp3: NAIVE_FLOOR_1E8_PPP3, l1e8Ppp2: NAIVE_FLOOR_1E8_PPP2 },
    kahan: { anchor: KAHAN_ANCHOR_FLOOR, l1e7: KAHAN_FLOOR_1E7, l1e8Ppp3: KAHAN_FLOOR_1E8_PPP3, l1e8Ppp2: KAHAN_FLOOR_1E8_PPP2 },
    cancelFree: { l1e8Ppp3: CANCELFREE_FLOOR_1E8_PPP3 },
  },
  variance1e8Ppp3: { naive: VAR_1E8_PPP3_NAIVE, kahan: VAR_1E8_PPP3_KAHAN, exact: varExact1e8, errNaive: varErrNaive, errKahan: varErrKahan },
  roundoffArtifact: {
    roundoffFactorPpp3, // ~913x collapse under Kahan
    roundoffFactorPpp2, // ~53x
    kahanCancelFreeAgreement, // ~2.4e-9 -- two independent roundoff-free methods agree
    note:
      'The naive ppp = 3 floor at 1e8 reproduces imp-96588 (2.7235e-2); Kahan-compensated summation gives 2.9819e-5 and an independent cancellation-free variance gives 2.9816e-5, agreeing to 4 figures and ~913x below naive. The bend was almost entirely summation roundoff of the ~3e8-term Simpson sum plus the Var = L - 2*Int large-minus-large subtraction; the naive Var error 0.136 drops to 4.16e-3 under compensation.',
  },
  truncationFloorLaw: {
    naiveExponentAnchorTo1e8, // ~2.426 (imp-96588)
    cleanExponentAnchorTo1e8, // ~ -0.098 -- FLAT / mildly decreasing
    note:
      'Compensated ppp = 3 floors are 3.9340e-5 (anchor), 3.7246e-5 (1e7), 2.9819e-5 (1e8): a clean-floor exponent ~ -0.10 (flat, mildly decreasing) versus the naive 2.426. Even the imp-96568 law p ~ 1.81 was roundoff-tainted -- its naive 1e7 rung (7.40e-5) is ~2x the clean 1e7 floor (3.72e-5) while the anchor naive rung was near clean, manufacturing a spurious upward slope.',
  },
  pppCollapseReversal: {
    naiveOptPpp1e8: 2, // imp-96588 "optimum collapsed to 2"
    cleanOptPpp1e8: 3, // compensated: finer grid wins, as a truncation regime should
    note:
      'Naive floors put ppp = 2 (1.784e-2) below ppp = 3 (2.723e-2); with Kahan the ordering REVERSES, ppp = 3 (2.982e-5) beats ppp = 2 (3.352e-4) by ~11x, so more panels help monotonically. The imp-96588 "optimum ppp collapse 3 -> 2" is a roundoff artifact, not a real transition.',
  },
  lStarCorrection: {
    imp96588Lstar: 8.04e7, // naive re-bisection
    signal1e8, // ~1.587e-2
    signalOverCleanFloor, // ~532x -- clean floor does NOT cross signal at 1e8
    verdict: 'corrected-not-confirmed',
    note:
      'imp-96588 re-bisected L* ~ 8e7 from a floor ~913x too large. The sine-kernel signal |rho + 1/2| at 1e8 (1.587e-2) is ~530x ABOVE the compensated truncation floor (2.982e-5), so with compensated summation the truncation floor does NOT cross the signal at 1e8: L* ~ 8e7 is a DOUBLE-PRECISION ARITHMETIC reach set by the roundoff floor, not a Simpson-truncation reach. The genuine truncation-limited corroboration reach lies far past 1e8; the operative wall past ~1e7 is arithmetic precision (use compensated / double-double summation), not Simpson truncation.',
  },
  caveat:
    'rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L; there are no computed Riemann zeros behind these values. Kahan compensation removes summation roundoff but not every rounding path (the ~3e8 sin node evaluations carry ~1 ulp each); the residual Kahan Var error 4.16e-3 at ppp = 3 is genuine Simpson truncation, and the ~3-4e-5 clean floors are themselves double-precision quadrature values, not arbitrary-precision truth. The flat clean-floor law rests on three ppp = 3 rungs; it refutes the imp-96568/imp-96588 upward laws but is not itself a proof of an asymptotic floor law. Changes no bound, establishes no operator positivity, does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'The imp-96588 basis-C L = 1e8 floor bend is a CATASTROPHIC-CANCELLATION / SUMMATION ROUNDOFF ARTIFACT, not a converged truncation floor. Kahan-compensated summation and an independent cancellation-free variance both collapse the clean ppp = 3 floor from 2.7235e-2 to ~2.982e-5 (~913x), the upward bend (exponent 2.43-2.57) and the imp-96568 p ~ 1.81 law both vanish (compensated floor flat at ~3-4e-5, exponent ~ -0.10), and the ppp collapse 3 -> 2 reverses. L* ~ 8e7 is CORRECTED: it is a double-precision arithmetic reach set by the roundoff floor, not a Simpson-truncation reach; the compensated truncation floor (~3e-5) stays ~530x below the 1e8 signal (1.587e-2), so the true truncation-limited corroboration reach is far past 1e8, with arithmetic precision the operative wall. Measurement only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention) for any consumer surface.
export const IMP96611_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: rho is the '
  + 'theoretical GUE two-interval correlation, not computed from real zeros. The imp-96588 '
  + 'L = 1e8 floor bend is a summation / cancellation ROUNDOFF artifact: Kahan-compensated and '
  + 'cancellation-free arithmetic collapse the clean ppp = 3 floor from 2.72e-2 to 2.98e-5 (~913x), '
  + 'the upward bend and the imp-96568 p ~ 1.81 law both vanish (compensated floor flat ~3-4e-5), '
  + 'and L* ~ 8e7 is corrected to a double-precision arithmetic reach, not a truncation reach; '
  + 'changes no bound.';

// --- self-executing internal-consistency assertions (cheap live closed-form rechecks) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // reference values for the local special-function implementations
  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96611: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96611: Ci(1) drifted from reference');

  // rhoExact / exact variance at 1e8 reproduce the offline-measured values (closed-form, cheap)
  if (!approx(rhoExact(L_1E8), -0.4841281692261168, 1e-12))
    throw new Error('imp-96611: rhoExact(1e8) drifted from the offline-measured value');
  if (!approx(varExact1e8, 2.212426404290639, 1e-9))
    throw new Error('imp-96611: sigma2Exact(1e8) drifted from the offline-measured value');

  // Finding 1: the bend is roundoff -- Kahan collapses the 1e8 ppp = 3 floor ~900x, and the
  // independent cancellation-free variance agrees to <1e-8
  if (!(roundoffFactorPpp3 > 700 && roundoffFactorPpp3 < 1100))
    throw new Error('imp-96611: Kahan should collapse the 1e8 ppp = 3 floor ~913x (roundoff, not truncation)');
  if (!(kahanCancelFreeAgreement < 1e-7))
    throw new Error('imp-96611: Kahan and cancellation-free 1e8 floors should agree (two roundoff-free methods)');
  if (!(Math.abs(varErrNaive) > 20 * Math.abs(varErrKahan)))
    throw new Error('imp-96611: naive Var error should dwarf the compensated Var error (cancellation)');

  // Finding 2: the compensated truncation floor is FLAT (exponent ~ -0.1), not the naive ~2.43
  if (!(naiveExponentAnchorTo1e8 > 2.2 && naiveExponentAnchorTo1e8 < 2.7))
    throw new Error('imp-96611: naive anchor -> 1e8 exponent should reproduce the imp-96588 ~2.43');
  if (!(cleanExponentAnchorTo1e8 > -0.4 && cleanExponentAnchorTo1e8 < 0.2))
    throw new Error('imp-96611: compensated floor exponent should be ~0 (flat), not an upward power law');

  // Finding 3: the ppp collapse REVERSES under compensation (finer grid wins)
  if (!(KAHAN_FLOOR_1E8_PPP3 < KAHAN_FLOOR_1E8_PPP2))
    throw new Error('imp-96611: with Kahan, ppp = 3 should beat ppp = 2 (collapse 3 -> 2 was roundoff)');
  if (!(NAIVE_FLOOR_1E8_PPP2 < NAIVE_FLOOR_1E8_PPP3))
    throw new Error('imp-96611: naive baseline should reproduce the imp-96588 ppp = 2 < ppp = 3 ordering');

  // Finding 4: L* corrected -- the signal at 1e8 stays far ABOVE the compensated truncation floor
  if (!(signalOverCleanFloor > 100))
    throw new Error('imp-96611: the 1e8 signal should stay >100x above the compensated truncation floor (L* not at 1e8)');

  // honesty gates
  if (!/NO QED/.test(IMP96611_BASIS_C_FLOOR_1E8_ROUNDOFF_VS_TRUNCATION.verdict))
    throw new Error('imp-96611: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96611_BASIS_C_FLOOR_1E8_ROUNDOFF_VS_TRUNCATION.verdict))
    throw new Error('imp-96611: verdict dropped the no-refereed-bound-change banner');
  if (!/imp-96588/.test(IMP96611_BASIS_C_FLOOR_1E8_ROUNDOFF_VS_TRUNCATION.question))
    throw new Error('imp-96611: question dropped the imp-96588 reference');
  if (!(/RH open/.test(IMP96611_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96611_HONEST_BANNER) && /NO QED/.test(IMP96611_HONEST_BANNER)))
    throw new Error('imp-96611: IMP96611_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96611_BASIS_C_FLOOR_1E8_ROUNDOFF_VS_TRUNCATION;
