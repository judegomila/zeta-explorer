/**
 * imp-96583 -- Measure the numeric effect of folding the imp-96567 calibrated k>=2 box-covariance
 * tail (closed form rho_k = -(1/(2 pi^2 Sigma^2)) ln(k^2/(k^2-1)), telescoping sum_{k>=2} rho_k =
 * -0.036022) into the imp-96543 explicit VIF_291 <= 0.0752 refinement and its z_eff. Measurement
 * only; conditional on the GUE sine kernel; NO QED.
 *
 * WHAT imp-96543 LEFT AS THE CLEAN CONSTANT. imp-96543 delivered the conditional-on-sine-kernel
 * refinement VIF_291 <= 0.075232 (z_eff >= 7.012) using ONLY the one exactly-known lag
 * rho_1 = -0.4639782 and DROPPING the (nonpositive) tail -- legitimate because dropping negative
 * lags only enlarges the bound. It explicitly declined to fold in rho_2, rho_3 because at that point
 * the tail figures were scale-MIXED (imp-96543 OBSTRUCTION 2), so the sharper rho_1..3 number
 * (VIF <= 0.0197) was flagged as soft, not the headline.
 *
 * WHAT imp-96567 CHANGED. imp-96567 derived the k>=2 tail DIRECTLY from the cluster function
 * T_2(x) = (sin pi x / pi x)^2 over the actual L = 495.779 non-overlapping tiling, giving the exact
 * co-calibrated closed form Cov_k = -(1/(2 pi^2)) ln(k^2/(k^2-1)), rho_k = Cov_k / Sigma^2(L) with
 * Sigma^2 = 0.974834, and the telescoping TAIL BUDGET sum_{k>=2} rho_k = -0.036022. Because this tail
 * is now co-calibrated with rho_1 (same box length, same process), folding it into the Bartlett VIF
 * is no longer a scale mix -- so this ticket quantifies the resulting shift.
 *
 * THE COMPUTATION (finite-window Bartlett, n = 291). VIF_n = 1 + 2 sum_{k=1}^{n-1} (1-k/n) rho_k.
 *   (A) rho_1-only (imp-96543 headline):        VIF_291 = 1 + 2 (1-1/291) rho_1 = 0.075232, z >= 7.012.
 *   (B) rho_1 + calibrated tail, EXACT weights: fold rho_k^closed with the Bartlett weight (1-k/291)
 *       for k = 2..290:  tail contribution 2 sum = -0.069770, so VIF_291 = 0.005463, z >= 26.02.
 *   (C) rho_1 + tail BUDGET (weightless):       using the infinite telescoping sum -0.036022 with
 *       weight ~1 (looser, drops the (1-k/n) taper):  VIF_291 = 0.003189, z >= 34.06.
 *
 * THE HONEST READING (two answers, not one). Whether the tail is "meaningful" or "negligible"
 * depends on which quantity you look at, and the two answers point OPPOSITE ways:
 *   - IN THE COVARIANCE BUDGET the tail IS negligible against rho_1, exactly as imp-96567 said: the
 *     weighted tail contribution 2 sum = -0.06977 is only 7.54% of rho_1's pull
 *     2 (1-1/291) rho_1 = -0.92477. The calibrated tail is a small bounded increment on top of the
 *     dominant lag-1 term.
 *   - IN z_eff the SAME small increment is NOT negligible: because the rho_1-only VIF is already tiny
 *     (0.0752), subtracting another 0.0698 collapses VIF by ~92.7% to 0.00546, and since
 *     z ~ 1/sqrt(VIF), z_eff jumps from 7.01 to 26.02 (+19.0). This is a 1/sqrt(VIF) AMPLIFICATION,
 *     not new statistical information: the covariance content added is small; the leverage is optical.
 *
 * WHY THE BIG z IS NOT THE HEADLINE (the obstruction). The z_eff = 26 / 34 figures sit deep in the
 * VIF -> 0 blow-up region where z = relErr sqrt(n/(2 VIF)) is extremely sensitive to the last few
 * digits of an already-small VIF: a +/-0.001 wobble in VIF (well within the 6-digit closed-form and
 * the L, Sigma^2 calibration precision) moves z by several units. The direction is unambiguous and
 * SAFE (the calibrated tail is nonpositive, so it only reduces variance, tightening the bound), but
 * the magnitude of the z gain is fragile. So the robust conditional statements remain z_eff >= z_cons
 * = 1.9234 (sign level) and z_eff >= 7.01 (rho_1-only); folding the now-calibrated tail tightens the
 * VIF from <= 0.0752 to <= 0.00546 and reports z_eff >= 26 as a co-calibrated refinement, with the
 * explicit caveat that the sub-1% VIF makes that z fragile.
 *
 * RELATION TO THE imp-96543 SOFT NUMBER. imp-96543's scale-mixed rho_1..3 gave VIF <= 0.0197
 * (z >= 13.7). The full CO-CALIBRATED tail here (k = 2..290, not just k = 2, 3) is tighter still
 * (VIF <= 0.00546, z >= 26.0) AND no longer scale-mixed, because imp-96567 co-calibrated the tail; it
 * supersedes the imp-96543 soft figure with a cleaner-provenance one, but inherits the same 1/sqrt(VIF)
 * fragility that keeps it off the headline.
 *
 * VERDICT. Folding the imp-96567 calibrated k>=2 tail (sum rho_k = -0.036022) into the imp-96543
 * VIF_291 refinement moves the bound in the SAFE (variance-reducing) direction and is genuinely
 * co-calibrated (no scale mix): VIF_291 tightens from <= 0.075232 (z >= 7.012, rho_1-only) to
 * <= 0.005463 (z >= 26.02) with the exact Bartlett weights, or <= 0.003189 (z >= 34.06) with the
 * weightless telescoping budget. The tail is NEGLIGIBLE in the covariance budget (7.54% of rho_1's
 * pull, confirming imp-96567) yet NOT negligible in z_eff (+19.0), because the rho_1-only VIF is
 * already ~0.075 and z ~ 1/sqrt(VIF) amplifies the small increment -- an optical, not statistical,
 * gain. The z >= 26 / 34 band is therefore a fragile refinement (sub-1% VIF sits in the 1/sqrt(VIF)
 * blow-up zone); the robust headline stays z_eff >= z_cons = 1.9234 (sign) and z_eff >= 7.01 (rho_1).
 * Measurement only; conditional on the GUE sine kernel / Montgomery pair correlation for the zeta
 * zeros (UNPROVEN); changes no unconditional bound; RH open; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96543-sine-kernel-vif-conditional-lower-bound (the VIF_291 <= 0.0752 refinement folded here)
 * @see imp-96567-box-averaged-sine-kernel-lag-decay (the calibrated tail closed form + budget -0.036022)
 * @see imp-96571-vif-rho1-bound-rigor-assessment (the rigor status of the rho_1-only refinement)
 * @see imp-96489-excursion-effective-significance-direct-rho (the exact rho_1 = -0.4639782 union value)
 *
 * Import-light: no zeros bundle, no sibling imports. N_W, relErr, rho_1 are the imp-96543 literals;
 * Sigma^2 and the tail closed form are the imp-96567 literals; the Bartlett fold is recomputed here.
 */

const PI = Math.PI;

// imp-96543 fixed inputs (no zeros needed).
const N_W = 291; // conservative non-overlapping hard-box tiling count at T = 1.5e5
const REL_ERR = 0.15945679221237827; // dip depth |residual|/r (held fixed across all models)
const RHO_1 = -0.4639782; // imp-96489 directly-evaluated union-identity exact box value

// imp-96567 calibrated tail inputs.
const SIGMA2 = 0.974834; // direct number variance at L = 495.779
const rhoClosed = (k) => -Math.log((k * k) / (k * k - 1)) / (2 * PI * PI) / SIGMA2; // k >= 2
const TAIL_RHO_SUM = -Math.log(2) / (2 * PI * PI) / SIGMA2; // -0.036022 (telescoping budget)

const zFromVif = (vif) => REL_ERR / Math.sqrt(2 / (N_W / vif)); // z at fixed dip depth
const zCons = zFromVif(1); // 1.923422: the VIF = 1 independence floor

// (A) rho_1-only refinement (imp-96543 headline explicit constant).
const RHO1_PULL = 2 * (1 - 1 / N_W) * RHO_1; // -0.924768 (rho_1 contribution to VIF - 1)
const VIF_RHO1 = 1 + RHO1_PULL; // 0.075232
const Z_RHO1 = zFromVif(VIF_RHO1); // 7.012484

// (B) rho_1 + calibrated tail, EXACT Bartlett weights (1 - k/n), k = 2..n-1.
let tailWeighted = 0;
for (let k = 2; k <= N_W - 1; k++) tailWeighted += (1 - k / N_W) * rhoClosed(k);
const TAIL_PULL = 2 * tailWeighted; // -0.069770
const VIF_FULL = VIF_RHO1 + TAIL_PULL; // 0.005463
const Z_FULL = zFromVif(VIF_FULL); // 26.023

// (C) rho_1 + weightless telescoping tail budget (looser; drops the (1-k/n) taper).
const VIF_BUDGET = VIF_RHO1 + 2 * TAIL_RHO_SUM; // 0.003189
const Z_BUDGET = zFromVif(VIF_BUDGET); // 34.061

// Negligible-in-budget vs not-negligible-in-z diagnostics.
const TAIL_FRACTION_OF_RHO1 = TAIL_PULL / RHO1_PULL; // 0.0754: tail is 7.5% of rho_1 pull
const VIF_COLLAPSE_FRACTION = (VIF_RHO1 - VIF_FULL) / VIF_RHO1; // 0.9274: 92.7% VIF collapse
const DELTA_Z_FULL = Z_FULL - Z_RHO1; // +19.011

export const IMP96583_VIF_CALIBRATED_TAIL_FOLD = {
  ticket: 'imp-96583',
  question:
    'Measure the numeric effect of folding the imp-96567 calibrated k>=2 box-covariance tail (closed form rho_k = -(1/(2 pi^2 Sigma^2)) ln(k^2/(k^2-1)), telescoping sum_{k>=2} rho_k = -0.036022) into the imp-96543 explicit VIF_291 <= 0.0752 refinement and its z_eff.',
  windowCount: N_W,
  rho1Only: {
    vif: VIF_RHO1, // 0.075232
    zEff: Z_RHO1, // 7.012484
    note: 'imp-96543 headline explicit constant: exact rho_1 plus the sign of the (dropped) tail.',
  },
  withCalibratedTailExactWeights: {
    tailPull: TAIL_PULL, // -0.069770 = 2 sum_{k=2}^{290} (1-k/291) rho_k^closed
    vif: VIF_FULL, // 0.005463
    zEff: Z_FULL, // 26.023
    note: 'rho_1 plus the imp-96567 co-calibrated closed-form tail with the exact Bartlett weights (1-k/n).',
  },
  withTailBudgetWeightless: {
    tailSum: TAIL_RHO_SUM, // -0.036022 (infinite telescoping budget, weight ~1)
    vif: VIF_BUDGET, // 0.003189
    zEff: Z_BUDGET, // 34.061
    note: 'Looser variant folding the full telescoping budget without the (1-k/n) taper; over-counts the tail.',
  },
  negligibilityTwoWays: {
    tailFractionOfRho1Pull: TAIL_FRACTION_OF_RHO1, // 0.0754: NEGLIGIBLE in the covariance budget
    vifCollapseFraction: VIF_COLLAPSE_FRACTION, // 0.9274: yet a 92.7% collapse of the already-tiny VIF
    deltaZ: DELTA_Z_FULL, // +19.011: NOT negligible in z_eff (1/sqrt(VIF) amplification)
    reading:
      'The tail is negligible AGAINST rho_1 in the covariance budget (7.54% of rho_1 pull, confirming imp-96567), but NOT negligible in z_eff (+19.0): because the rho_1-only VIF is already ~0.075, z ~ 1/sqrt(VIF) amplifies the small increment. The z gain is optical (leverage), not new statistical information.',
  },
  fragility:
    'The z_eff = 26 / 34 band sits deep in the VIF -> 0 blow-up region where z = relErr sqrt(n/(2 VIF)) is extremely sensitive to the last digits of a sub-1% VIF: a +/-0.001 VIF wobble (within the closed-form / L / Sigma^2 precision) moves z by several units. The direction is unambiguous and SAFE (nonpositive tail only reduces variance), but the magnitude of the z gain is fragile, so it is a refinement, not the headline.',
  relationToImp96543Soft:
    'imp-96543 scale-mixed rho_1..3 gave VIF <= 0.0197 (z >= 13.7). The full CO-CALIBRATED tail here (k = 2..290) is tighter (VIF <= 0.00546, z >= 26.0) AND no longer scale-mixed, superseding that soft figure with cleaner provenance while inheriting the same 1/sqrt(VIF) fragility.',
  conditionality:
    'All of the above is conditional on the GUE sine kernel / Montgomery pair correlation holding for the actual zeta zeros (UNPROVEN, GRH-flavored). It changes NO unconditional bound.',
  verdict:
    'Folding the imp-96567 calibrated k>=2 tail (sum rho_k = -0.036022) into the imp-96543 VIF_291 refinement moves the bound in the SAFE (variance-reducing) direction and is genuinely co-calibrated (no scale mix): VIF_291 tightens from <= 0.075232 (z >= 7.012, rho_1-only) to <= 0.005463 (z >= 26.02) with the exact Bartlett weights, or <= 0.003189 (z >= 34.06) with the weightless telescoping budget. The tail is NEGLIGIBLE in the covariance budget (7.54% of rho_1 pull, confirming imp-96567) yet NOT negligible in z_eff (+19.0), because the rho_1-only VIF is already ~0.075 and z ~ 1/sqrt(VIF) amplifies the small increment -- an optical, not statistical, gain. The z >= 26 / 34 band is a fragile refinement (sub-1% VIF sits in the 1/sqrt(VIF) blow-up zone); the robust headline stays z_eff >= z_cons = 1.9234 (sign) and z_eff >= 7.01 (rho_1). Measurement only; conditional on the GUE sine kernel / Montgomery pair correlation for the zeta zeros (UNPROVEN); changes no unconditional bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention).
export const IMP96583_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: folding the imp-96567 calibrated '
  + 'k>=2 tail (sum rho_k = -0.036022) into the imp-96543 VIF_291 refinement tightens VIF from <= 0.0752 '
  + '(z >= 7.01, rho_1-only) to <= 0.00546 (z >= 26.02, exact Bartlett weights). The tail is negligible '
  + 'in the covariance budget (7.5% of rho_1 pull) but NOT in z_eff (+19.0) via 1/sqrt(VIF) amplification; '
  + 'the sub-1% VIF makes the big z fragile, so the robust headline stays z_eff >= 1.9234 (sign) and '
  + 'z_eff >= 7.01 (rho_1). Conditional on the pair correlation for the zeta zeros (UNPROVEN); changes '
  + 'no unconditional bound.';

// --- self-executing internal-consistency assertions (formula re-derivation only; no zeros) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // floor and rho_1-only refinement reproduce the imp-96543 literals
  if (!approx(zCons, 1.923422, 1e-5)) throw new Error('imp-96583: z_cons drifted from 1.9234');
  if (!approx(VIF_RHO1, 0.075232, 1e-5)) throw new Error('imp-96583: rho_1-only VIF drifted from 0.0752');
  if (!approx(Z_RHO1, 7.012484, 1e-4)) throw new Error('imp-96583: rho_1-only z drifted from 7.01');
  // calibrated tail reproduces the imp-96567 closed-form values and telescoping budget
  if (!approx(rhoClosed(2), -0.014950, 1e-5)) throw new Error('imp-96583: closed-form rho_2 drifted from -0.014950');
  if (!approx(rhoClosed(3), -0.006121, 1e-5)) throw new Error('imp-96583: closed-form rho_3 drifted from -0.006121');
  if (!approx(TAIL_RHO_SUM, -0.036022, 1e-5)) throw new Error('imp-96583: telescoping tail sum drifted from -0.036022');
  // folding the nonpositive tail only LOWERS the VIF (safe / variance-reducing direction)
  if (!(VIF_FULL < VIF_RHO1)) throw new Error('imp-96583: folding the negative tail must lower the VIF');
  if (!(VIF_BUDGET < VIF_FULL)) throw new Error('imp-96583: the weightless budget must over-count vs exact weights');
  if (!approx(VIF_FULL, 0.005463, 1e-5)) throw new Error('imp-96583: full-tail VIF drifted from 0.005463');
  if (!approx(Z_FULL, 26.023, 1e-2)) throw new Error('imp-96583: full-tail z drifted from 26.02');
  if (!approx(VIF_BUDGET, 0.003189, 1e-5)) throw new Error('imp-96583: budget-tail VIF drifted from 0.003189');
  if (!approx(Z_BUDGET, 34.061, 1e-2)) throw new Error('imp-96583: budget-tail z drifted from 34.06');
  // the two-way negligibility: small in the budget, large in z
  if (!(TAIL_FRACTION_OF_RHO1 > 0 && TAIL_FRACTION_OF_RHO1 < 0.1))
    throw new Error('imp-96583: tail must be a small (<10%) fraction of the rho_1 pull');
  if (!(VIF_COLLAPSE_FRACTION > 0.9)) throw new Error('imp-96583: the tiny VIF must collapse by >90%');
  if (!(DELTA_Z_FULL > 15)) throw new Error('imp-96583: the z_eff amplification must exceed 15');
  if (!(Z_FULL > Z_RHO1 && Z_RHO1 > zCons)) throw new Error('imp-96583: z ordering must be budget/full > rho_1 > floor');
  // honesty gates
  if (!/NO QED/.test(IMP96583_VIF_CALIBRATED_TAIL_FOLD.verdict))
    throw new Error('imp-96583: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96583_VIF_CALIBRATED_TAIL_FOLD.verdict))
    throw new Error('imp-96583: verdict dropped the no-refereed-bound-change banner');
  if (!/conditional/i.test(IMP96583_VIF_CALIBRATED_TAIL_FOLD.verdict))
    throw new Error('imp-96583: verdict must flag the result as CONDITIONAL');
  if (!(/RH open/.test(IMP96583_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96583_HONEST_BANNER) && /NO QED/.test(IMP96583_HONEST_BANNER)))
    throw new Error('imp-96583: IMP96583_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96583_VIF_CALIBRATED_TAIL_FOLD;
