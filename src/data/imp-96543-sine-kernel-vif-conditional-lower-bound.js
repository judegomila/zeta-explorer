/**
 * imp-96543 -- Does the GUE sine-kernel decay theorem (all disjoint-box correlations negative,
 * O(1/k^2) decay, no spectral mass at frequency 0) yield a RIGOROUS VIF < 1 -- and thus convert
 * the imp-96529 model-contingent z_eff climb into a stated conditional-on-sine-kernel LOWER BOUND?
 *
 * WHY THIS FOLLOWS imp-96529. imp-96529 proved that the three measured lags give ZERO model-free
 * improvement over the independent floor z_cons = 1.9234: the PSD-admissible VIF interval STRADDLES
 * 1 (an explicit spectral measure with an atom at frequency theta = 0 matches rho_0..rho_3 exactly
 * yet has VIF_291 = 14.55 > 1). Its VERDICT named exactly one route to a rigorous VIF < 1: a MODEL
 * controlling the whole lag structure -- the GUE sine-kernel theorem that all box correlations are
 * negative and decay like O(1/k^2) with no mass at frequency 0. This ticket assesses that route.
 *
 * THE QUANTITY (unchanged from imp-96529). z = relErr * sqrt(n_eff / 2), n_eff = n_w / VIF, with the
 * exact finite-window variance-inflation factor
 *   VIF_n = Var(S_n) / (n * sigma^2) = 1 + 2 * sum_{k=1}^{n-1} (1 - k/n) * rho_k,   S = sum of n boxes.
 * z_cons = 1.9234 is precisely the VIF = 1 (independence) value. A conditional LOWER bound on z is a
 * conditional UPPER bound on VIF; a rigorous VIF < 1 gives n_eff > n_w and z_eff > z_cons.
 *
 * THE SINE-KERNEL SIGN THEOREM (the engine; conditional on GUE/pair-correlation). For the GUE sine
 * process the two-point cluster function is T_2(x) = (sin(pi x)/(pi x))^2, which is NONNEGATIVE
 * everywhere. The covariance of the eigenvalue COUNTS in two DISJOINT intervals A, B is
 *   Cov(N_A, N_B) = - integral_A integral_B T_2(x - y) dx dy  <=  0,
 * STRICTLY negative whenever A, B have positive length (T_2 > 0 a.e.). Hence for the non-overlapping
 * box tiling every lag correlation is nonpositive: rho_k <= 0 for all k >= 1 (strict for the finite
 * boxes here). The "no spectral mass at frequency 0" clause is the SAME statement in the spectral
 * picture: the count spectral density carries no delta at theta = 0, which is exactly what excludes
 * the imp-96529 worst-case measure (its VIF > 1 came entirely from a positive atom at theta = 0).
 *
 * THE RIGOROUS (CONDITIONAL) VIF < 1 -- SIGN LEVEL. Given rho_k <= 0 for all k >= 1, EVERY term of
 * the finite-window sum has (1 - k/n) > 0 (for 1 <= k < n) times rho_k <= 0, hence <= 0. Therefore
 *   VIF_n = 1 + 2 * sum_{k=1}^{n-1} (1 - k/n) rho_k  <=  1,   STRICT if any rho_k < 0.
 * This is a genuine model-free-once-you-assume-sine-kernel certificate: it needs only the SIGN
 * theorem, no magnitudes and no PSD gymnastics, and it converts z_cons into a real conditional lower
 * bound z_eff >= z_cons = 1.9234. It is exactly the certificate imp-96529 said the three numbers
 * alone could not supply -- the SIGN of the whole tail is what the theorem adds.
 *
 * THE EXPLICIT CONSTANT -- MAGNITUDE LEVEL. Using the ONE exactly-known lag rho_1 = -0.4639782
 * (imp-96489 union identity) and the SIGN of the rest (rho_{k>=2} <= 0, so DROPPING them only
 * enlarges the bound), an explicit conditional upper bound on VIF follows:
 *   VIF_291 <= 1 + 2 * (1 - 1/291) * rho_1 = 0.075232  =>  z_eff >= 7.012.
 * Adding the two theoretical tail lags (rho_2 = -0.020, rho_3 = -0.008, also negative) drives the
 * upper bound to VIF_291 <= 0.019672 (z_eff >= 13.71). Both are legitimate CONDITIONAL bounds, but
 * see the obstruction below on why the sharper one is not the honest headline number.
 *
 * THE OBSTRUCTION (why the explicit constant is soft, and why the model climb differs). Three
 * things are in mutual tension, and the theorem constrains the SIGN far more robustly than any
 * magnitude:
 *   (1) O(1/k^2) DECAY vs stated magnitudes: an O(1/k^2) fall-off anchored at rho_1 = -0.4639782
 *       predicts rho_2 ~ rho_1/4 = -0.1160, but the stated theoretical box value is rho_2 = -0.020
 *       -- a much FASTER drop. The decay-RATE clause and the tabulated magnitudes are not calibrated
 *       to a single normalization, so the O(1/k^2) form cannot be used to bound the tail sum tightly.
 *   (2) SCALE MIX: rho_1 = -0.4639782 is the imp-96489 directly-evaluated union-identity value at the
 *       actual box length, whereas rho_2, rho_3 = -0.020, -0.008 are theoretical sine-process figures
 *       (imp-96509 caveat) -- not empirical adjacent-box covariances of the zeros. Feeding rho_1 and
 *       rho_2/rho_3 into one Bartlett sum mixes two calibrations, so the VIF_291 <= 0.0197 (z >= 13.7)
 *       number should NOT be quoted as the headline; the rho_1-only VIF_291 <= 0.0752 (z >= 7.01) is
 *       the cleaner explicit constant, and the SIGN bound VIF <= 1 (z >= 1.9234) is the robust one.
 *   (3) THE AR MODELS ARE NOT SINE-KERNEL-CONSISTENT: the imp-96509 AR-1 completion predicts
 *       rho_2 = rho_1^2 = +0.2153 > 0, which VIOLATES the sine-kernel negativity theorem. So the
 *       model-contingent climb 3.1787 / 4.3310 / 5.4329 (AR-1/2/3) rests on a POSITIVE-tail
 *       geometric completion, a DIFFERENT model from the all-negative sine kernel. The sine-kernel
 *       route does not merely reproduce those figures; its sign-forced bound (z >= 1.9234 robustly,
 *       or z >= 7.01 using rho_1) is a distinct conditional statement.
 *
 * VERDICT. YES: the GUE sine-kernel decay theorem DOES supply a rigorous VIF < 1, converting the
 * imp-96529 model-contingent climb into a stated CONDITIONAL-ON-SINE-KERNEL lower bound. The robust
 * form uses only the negativity (sign) theorem: rho_k <= 0 for all k >= 1 forces VIF_n <= 1 term by
 * term, hence z_eff >= z_cons = 1.9234, conditional on the sine kernel. An explicit constant follows
 * from the one exactly-known lag: VIF_291 <= 0.0752, z_eff >= 7.01. The obstruction is that the
 * O(1/k^2) decay RATE and the tabulated tail MAGNITUDES are not co-calibrated (and the imp-96509 AR
 * completions carry a positive tail that the theorem forbids), so only the SIGN, not a sharp
 * magnitude, is rigorously delivered -- the headline conditional bound is therefore z_eff >= z_cons,
 * with z_eff >= 7.01 as the rho_1-explicit refinement. ALL of it is conditional on the sine-kernel /
 * Montgomery pair-correlation holding for the actual zeta zeros (UNPROVEN, GRH-flavored); it changes
 * NO unconditional bound. Assessment only; RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96529-excursion-zcons-model-free-tightening-assessment (the model-free straddle this closes)
 * @see imp-96509-excursion-effective-significance-ar2 (the AR(p) climb; positive-tail, not sine-kernel)
 * @see imp-96489-excursion-effective-significance-direct-rho (source of the exact rho_1 = -0.4639782)
 * @see imp-96452-excursion-confidence-2sigma-reach (carries z_cons = 1.9234)
 * @see imp-2431-zpo-pair-correlation-sine-kernel (the sine-kernel / pair-correlation picture)
 *
 * Import-light: no zeros bundle, no sibling imports. n_w, relErr, rho_1, rho_2, rho_3 are the same
 * imp-96529 literals; the sine-kernel cluster-function negativity is re-checked on T_2 here.
 */

// Fixed inputs (imp-96529 / imp-96489 literals; no zeros needed).
const N_W = 291; // conservative naive non-overlapping hard-box tiling count at T = 1.5e5
const REL_ERR = 0.15945679221237827; // dip depth |residual|/r (held fixed across all models)
const RHO_1 = -0.4639782; // imp-96489 directly-evaluated union-identity rho_exact (exact box value)
const RHO_2 = -0.020; // theoretical sine-process lag-2 box correlation (imp-96509 caveat; scale-mixed)
const RHO_3 = -0.008; // theoretical sine-process lag-3 box correlation (imp-96509 caveat; scale-mixed)

const zFromVif = (vif) => REL_ERR / Math.sqrt(2 / (N_W / vif)); // z at fixed dip depth
const zCons = zFromVif(1); // 1.923422: the VIF = 1 independence floor

// --- Sine-kernel SIGN certificate: T_2 >= 0 => all disjoint-box covariances <= 0 => rho_k <= 0 ------
// T_2(x) = (sin(pi x)/(pi x))^2 is the GUE two-point cluster function; nonnegative everywhere.
const clusterT2 = (x) => {
  if (x === 0) return 1; // limit of (sin(pi x)/(pi x))^2 at 0
  const s = Math.sin(Math.PI * x) / (Math.PI * x);
  return s * s;
};

// Finite-window Bartlett VIF from an explicit list of nonpositive lags (tail beyond the list = 0).
const vifFromLags = (lags) => {
  let s = 0;
  for (let k = 1; k <= lags.length; k++) s += (1 - k / N_W) * lags[k - 1];
  return 1 + 2 * s;
};

// SIGN level: rho_k <= 0 for all k >= 1 makes every term nonpositive => VIF_n <= 1 (robust bound).
const VIF_SIGN_UPPER = 1; // conditional-on-sine-kernel: VIF <= 1 exactly from the sign theorem
const Z_SIGN_LOWER = zFromVif(VIF_SIGN_UPPER); // 1.9234: robust conditional lower bound == z_cons

// MAGNITUDE level: use the one exact lag rho_1, drop the (nonpositive) tail => explicit upper bound.
const VIF_RHO1_UPPER = 1 + 2 * (1 - 1 / N_W) * RHO_1; // 0.075232
const Z_RHO1_LOWER = zFromVif(VIF_RHO1_UPPER); // 7.012484

// Sharper (scale-mixed, NOT the headline): also fold the two theoretical negative tail lags.
const VIF_RHO123_UPPER = vifFromLags([RHO_1, RHO_2, RHO_3]); // 0.019672
const Z_RHO123_LOWER = zFromVif(VIF_RHO123_UPPER); // 13.713

// Consistency diagnostics for the obstruction.
const RHO2_PRED_INVSQ = RHO_1 / 4; // O(1/k^2) decay from rho_1 predicts rho_2 ~ -0.1160 (vs -0.020)
const RHO2_PRED_AR1 = RHO_1 * RHO_1; // AR-1 predicts rho_2 = +0.2153 > 0 (violates sine-kernel sign)

export const IMP96543_SINE_KERNEL_VIF_CONDITIONAL_LOWER_BOUND = {
  ticket: 'imp-96543',
  question:
    'Does the GUE sine-kernel decay theorem (all disjoint-box correlations negative, O(1/k^2) decay, no spectral mass at frequency 0) yield a RIGOROUS VIF < 1 with an explicit constant, converting the imp-96529 model-contingent z_eff climb into a stated conditional-on-sine-kernel lower bound?',
  signTheorem: {
    clusterFunction: 'T_2(x) = (sin(pi x)/(pi x))^2 >= 0 (GUE two-point cluster function)',
    countCovariance: 'Cov(N_A, N_B) = - integral_A integral_B T_2(x - y) dx dy <= 0 for disjoint A, B',
    consequence: 'rho_k <= 0 for all k >= 1 (strict for finite boxes); no spectral mass at theta = 0',
    excludesWorstCase:
      'the no-mass-at-frequency-0 clause is exactly what forbids the imp-96529 worst-case atom at theta = 0 (whose positive long-range term gave VIF > 1).',
  },
  rigorousVifLessThanOne: {
    signLevel: {
      vifUpper: VIF_SIGN_UPPER, // 1 (every Bartlett term nonpositive)
      zLower: Z_SIGN_LOWER, // 1.9234 == z_cons; robust conditional lower bound
      note: 'Needs only the negativity theorem, no magnitudes: VIF_n = 1 + 2 sum (1-k/n) rho_k <= 1 term by term. This is the certificate the three measured numbers alone could not supply (imp-96529).',
    },
    magnitudeLevel: {
      vifUpperRho1: VIF_RHO1_UPPER, // 0.075232 (exact rho_1 + nonpositive tail dropped)
      zLowerRho1: Z_RHO1_LOWER, // 7.0125: the explicit rho_1-based conditional lower bound
      vifUpperRho123: VIF_RHO123_UPPER, // 0.019672 (scale-mixed; NOT the headline)
      zLowerRho123: Z_RHO123_LOWER, // 13.713 (scale-mixed; NOT the headline)
      headline:
        'The rho_1-only VIF_291 <= 0.0752 (z_eff >= 7.01) is the clean explicit constant; the rho_1..3 figure mixes two calibrations and is not quoted as the bound.',
    },
  },
  obstruction: {
    decayRateVsMagnitude: {
      rho2PredictedInvSquare: RHO2_PRED_INVSQ, // -0.1160 from O(1/k^2) anchored at rho_1
      rho2Stated: RHO_2, // -0.020 (much faster drop); rate and magnitudes not co-calibrated
    },
    scaleMix:
      'rho_1 is a union-identity value at the actual box length; rho_2, rho_3 are theoretical sine-process figures. One Bartlett sum over both mixes calibrations, so the sharper VIF <= 0.0197 is soft.',
    arNotSineKernelConsistent: {
      rho2PredictedAR1: RHO2_PRED_AR1, // +0.2153 > 0: AR-1 positive tail VIOLATES the sign theorem
      note: 'The imp-96509 AR-1/2/3 climb (3.18/4.33/5.43) uses a geometric completion with a POSITIVE lag-2 term the sine-kernel theorem forbids; the sine-kernel route is a distinct conditional statement, not a reproduction of the AR figures.',
    },
    whatIsRobust:
      'Only the SIGN (rho_k <= 0) is rigorously delivered by the theorem; a sharp tail MAGNITUDE is not. So the robust conditional bound is z_eff >= z_cons = 1.9234, with z_eff >= 7.01 as the rho_1-explicit refinement.',
  },
  conditionality:
    'ALL of the above is conditional on the GUE sine-kernel / Montgomery pair-correlation holding for the actual zeta zeros (UNPROVEN, GRH-flavored). It changes NO unconditional bound.',
  verdict:
    'YES -- the GUE sine-kernel decay theorem supplies a rigorous VIF < 1 and converts the imp-96529 model-contingent climb into a stated conditional-on-sine-kernel lower bound. Robust form (sign theorem only): all disjoint-box covariances are nonpositive because the cluster function T_2 = (sin(pi x)/(pi x))^2 >= 0, so rho_k <= 0 for all k >= 1 and VIF_n <= 1 term by term, giving z_eff >= z_cons = 1.9234. Explicit constant (using the one exact lag rho_1 = -0.4639782 plus the sign of the rest): VIF_291 <= 0.0752, z_eff >= 7.01. The obstruction is that the O(1/k^2) decay RATE and the tabulated tail magnitudes are not co-calibrated (O(1/k^2) from rho_1 predicts rho_2 ~ -0.116 vs the stated -0.020) and the imp-96509 AR completions carry a positive lag-2 term the theorem forbids, so only the SIGN, not a sharp magnitude, is rigorously delivered. Conditional on the sine kernel / Montgomery pair-correlation for the zeta zeros (UNPROVEN); changes no unconditional bound. Assessment only; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention).
export const IMP96543_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment only: the GUE sine-kernel cluster '
  + 'function T_2 = (sin(pi x)/(pi x))^2 >= 0 forces every disjoint-box covariance <= 0, so rho_k <= 0 '
  + 'for all k >= 1 and VIF_n <= 1 term by term -- a rigorous conditional-on-sine-kernel lower bound '
  + 'z_eff >= z_cons = 1.9234 (z_eff >= 7.01 using the exact rho_1). Only the SIGN is robust; the '
  + 'O(1/k^2) decay rate and tabulated magnitudes are not co-calibrated, and the imp-96509 AR climb '
  + 'uses a positive lag-2 term the theorem forbids. Conditional on the pair-correlation for the zeta '
  + 'zeros (UNPROVEN); changes no unconditional bound.';

// --- self-executing internal-consistency assertions (formula / sign re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // the floor is the VIF = 1 value
  if (!approx(zCons, 1.923422, 1e-5)) throw new Error('imp-96543: z_cons drifted from 1.9234');
  // sine-kernel cluster function is nonnegative on a dense grid (the sign engine)
  for (let x = 0; x <= 12; x += 0.001) {
    if (clusterT2(x) < -1e-15) throw new Error('imp-96543: cluster function T_2 must be nonnegative');
  }
  // SIGN level: nonpositive lags make VIF <= 1 term by term
  if (!(RHO_1 <= 0 && RHO_2 <= 0 && RHO_3 <= 0)) throw new Error('imp-96543: sine-kernel lags must be nonpositive');
  if (!(VIF_SIGN_UPPER <= 1)) throw new Error('imp-96543: sign-level VIF upper bound must be <= 1');
  if (!approx(Z_SIGN_LOWER, zCons, 1e-12)) throw new Error('imp-96543: sign-level z lower bound must equal z_cons');
  // MAGNITUDE level: explicit rho_1-only upper bound and its z, both < 1 / > floor
  if (!approx(VIF_RHO1_UPPER, 0.075232, 1e-5)) throw new Error('imp-96543: rho_1-only VIF upper bound drifted from 0.0752');
  if (!(VIF_RHO1_UPPER < 1)) throw new Error('imp-96543: rho_1-only VIF must be < 1');
  if (!approx(Z_RHO1_LOWER, 7.012484, 1e-4)) throw new Error('imp-96543: rho_1-only z lower bound drifted from 7.01');
  if (!(Z_RHO1_LOWER > zCons)) throw new Error('imp-96543: rho_1-only z must exceed the floor');
  // dropping nonpositive tail lags only ENLARGES the VIF bound (rho_1..3 tighter than rho_1 alone)
  if (!(VIF_RHO123_UPPER <= VIF_RHO1_UPPER)) throw new Error('imp-96543: adding negative tail lags must not raise the VIF bound');
  if (!approx(VIF_RHO123_UPPER, 0.019672, 1e-5)) throw new Error('imp-96543: rho_1..3 VIF bound drifted from 0.0197');
  // obstruction diagnostics: rate vs magnitude tension, and AR-1 positive-tail violation
  if (!(RHO2_PRED_INVSQ < RHO_2)) throw new Error('imp-96543: O(1/k^2) prediction should be more negative than the stated rho_2');
  if (!(RHO2_PRED_AR1 > 0)) throw new Error('imp-96543: AR-1 predicted rho_2 must be positive (the forbidden-sign diagnostic)');
  // honesty gates
  if (!/NO QED/.test(IMP96543_SINE_KERNEL_VIF_CONDITIONAL_LOWER_BOUND.verdict))
    throw new Error('imp-96543: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96543_SINE_KERNEL_VIF_CONDITIONAL_LOWER_BOUND.verdict))
    throw new Error('imp-96543: verdict dropped the no-refereed-bound-change banner');
  if (!/conditional/i.test(IMP96543_SINE_KERNEL_VIF_CONDITIONAL_LOWER_BOUND.verdict))
    throw new Error('imp-96543: verdict must flag the result as CONDITIONAL');
  if (!(/RH open/.test(IMP96543_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96543_HONEST_BANNER) && /NO QED/.test(IMP96543_HONEST_BANNER)))
    throw new Error('imp-96543: IMP96543_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96543_SINE_KERNEL_VIF_CONDITIONAL_LOWER_BOUND;
