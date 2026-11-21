/**
 * imp-96593 -- Does the imp-96567 EXACT closed-form tail rho_k = -(1/(2 pi^2 Sigma^2)) ln(k^2/(k^2-1))
 * upgrade the SOFT z_eff >= 13.71 (VIF_291 <= 0.0197) refinement -- which imp-96571 confined the residual
 * softness to, because it consumes the UNCALIBRATED tabulated rho_2 = -0.020, rho_3 = -0.008 as magnitudes
 * -- to a RIGOROUS conditional bound? Assessment only; conditional on GUE; NO QED.
 *
 * THE STANDING PICTURE (imp-96543 -> imp-96571 -> imp-96567).
 *   imp-96543 built the conditional-on-sine-kernel VIF < 1 certificate at three levels.
 *   imp-96571 showed the explicit VIF_291 <= 0.0752 (z >= 7.012) level is GENUINELY RIGOROUS -- it uses
 *     ONLY the exact rho_1 = -0.4639782 plus sign(rho_{k>=2}) <= 0, dropping the nonpositive tail in the
 *     bound-ENLARGING direction -- and confined ALL remaining softness to the SHARPER VIF_291 <= 0.0197
 *     (z >= 13.71) level, which alone consumes the uncalibrated tabulated rho_2 = -0.020, rho_3 = -0.008.
 *   imp-96567 then DERIVED the exact box-averaged tail Cov_k = -(1/(2 pi^2)) ln(k^2/(k^2-1)),
 *     rho_k = Cov_k / Sigma^2(L), directly from T_2(x) = (sin pi x / pi x)^2 over the L = 495.779 tiling,
 *     matching the direct double-box integral to 6 digits, with sum_{k>=2} rho_k = -0.036022 (telescoping).
 * This ticket asks the sharp follow-up: does substituting that EXACT tail (over the Bartlett-weighted
 * finite window) discharge the calibration softness and make z = 13.71 a rigorous conditional bound?
 *
 * THE DIRECTION-OF-RIGOR TEST (what a rigorous VIF UPPER bound requires). VIF_291 = 1 + 2 sum_{k>=1}
 * (1 - k/291) rho_k, with all Bartlett weights (1 - k/291) > 0 on 1 <= k <= 290 and (sign theorem)
 * rho_k <= 0. To LOWER-bound z we need an UPPER bound on VIF, so each INCLUDED lag must be replaced by a
 * value >= (i.e. LESS negative than) the truth, and DROPPING any remaining negative term only RAISES VIF
 * (safe). The soft z = 13.71 used the two tabulated magnitudes rho_2 = -0.020, rho_3 = -0.008 and dropped
 * k >= 4. THE CATCH: the calibrated closed form gives rho_2 = -0.014950, rho_3 = -0.006121 -- LESS
 * negative than the tabulated -0.020, -0.008. So the tabulated magnitudes were MORE negative than the
 * truth, which pushes VIF too LOW: z = 13.71 was NOT a valid upper-bound level at all -- it was mildly
 * ANTI-conservative. imp-96571 correctly flagged it as soft; the calibration error runs in the
 * significance-INFLATING direction.
 *
 * WHAT THE EXACT TAIL ACTUALLY DELIVERS (three honest levels).
 *   (A) RIGOROUS, two-lag: keep only the calibrated k = 2, 3 and DROP the certified-negative rest.
 *       VIF_291 <= 1 + 2[(1-1/291) rho_1 + (1-2/291) rhoClosed(2) + (1-3/291) rhoClosed(3)] = 0.033421,
 *       giving z >= 10.521. This is a clean rigorous conditional upper bound -- LOWER than the soft
 *       13.71, because the honest (calibrated) two-lag magnitudes are milder than the tabulated ones.
 *   (B) ACTUAL finite-window value: sum the exact closed-form tail across the WHOLE Bartlett window
 *       k = 2..290 (weight (1 - k/291) = 0 for k >= 291, so the window IS the full estimator).
 *       VIF_291 = 0.005463, z = 26.02. No truncation is dropped here -- it is the true conditional value.
 *   (C) The soft tabulated level VIF <= 0.0197 (z = 13.71) sits BETWEEN (A) and (B): it is neither the
 *       rigorous conservative bound (A) nor the actual value (B), and rests on magnitudes now shown to be
 *       mis-calibrated in the anti-conservative direction.
 *
 * VERDICT. The exact closed-form tail DOES discharge the specific softness imp-96571 flagged -- the
 * uncalibrated tabulated rho_2/rho_3 are replaced by a DERIVED, two-independent-ways closed form -- but it
 * does NOT ratify z = 13.71 as the rigorous number. Instead it SPLITS that soft level: the honest
 * rigorous conditional bound from the same two lags is z >= 10.52 (VIF <= 0.0334), and the actual
 * finite-window value is z ~ 26.0 (VIF ~ 0.0055); the 13.71 figure was an artifact of tabulated
 * magnitudes MORE negative than the calibrated truth. The residual obstruction therefore MIGRATES from
 * CALIBRATION to NUMERICAL ENCLOSURE: to make either level fully rigorous (not merely 6-digit) one still
 * needs (i) an interval-certified Sigma^2(L) (currently the GUE asymptotic matching the direct integral to
 * 6 digits, not an enclosure), (ii) a certified one-sided bound that the closed form is >= the true
 * finite-L box correlation (the closed form is the sin^2 -> 1/2 averaged limit; the finite-L correction is
 * O(1/L) oscillatory and its sign must be pinned so VIF stays an UPPER bound), and (iii) GUE throughout.
 * The k >= 4 tail needs no such control for level (A): it is certified nonpositive and merely dropped.
 * ALL conditional on the GUE sine kernel / Montgomery pair correlation for the zeta zeros (UNPROVEN,
 * GRH-flavored); changes NO unconditional bound; assessment only; RH open; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96571-vif-rho1-bound-rigor-assessment (confined the softness to the z >= 13.71 level)
 * @see imp-96567-box-averaged-sine-kernel-lag-decay (the exact closed-form tail and Sigma^2(L))
 * @see imp-96543-sine-kernel-vif-conditional-lower-bound (the three-level certificate and OBSTRUCTION)
 * @see imp-96489-excursion-effective-significance-direct-rho (the exact rho_1 = -0.4639782 union value)
 * @see imp-96628-boxsine-lagcorr-ibp-envelope (certifies the sign-pinning obstruction (ii) flagged here as a two-sided envelope)
 *
 * Import-light: no zeros bundle, no sibling imports. The VIF formula, z map, the closed-form tail, and the
 * three levels are re-derived here from the imp-96543 / imp-96567 / imp-96571 literals.
 */

const PI = Math.PI;

// Fixed inputs (imp-96543 / imp-96567 / imp-96571 literals; no zeros needed).
const N_W = 291; // conservative non-overlapping hard-box tiling count at T = 1.5e5
const REL_ERR = 0.15945679221237827; // dip depth |residual|/r (held fixed across all models)
const SIGMA2 = 0.974834; // imp-96567 number variance at L = 495.779 (GUE asymptotic == direct to 6 digits)
const RHO_1 = -0.4639782; // imp-96489 exact union-identity lag-1 box value
const RHO_2_TABULATED = -0.020; // imp-96543 uncalibrated tabulated lag-2 magnitude (SOFT input)
const RHO_3_TABULATED = -0.008; // imp-96543 uncalibrated tabulated lag-3 magnitude (SOFT input)

const zFromVif = (vif) => REL_ERR / Math.sqrt(2 / (N_W / vif)); // z at fixed dip depth
const bartlett = (k) => 1 - k / N_W; // finite-window triangular weight (> 0 for k < N_W)

// imp-96567 EXACT closed-form tail (k >= 2): rho_k = -(1/(2 pi^2 Sigma^2)) ln(k^2/(k^2-1)).
const rhoClosed = (k) => -Math.log((k * k) / (k * k - 1)) / (2 * PI * PI) / SIGMA2;

// The rigorous rho_1-only head (imp-96571): exact rho_1 + tail SIGN, tail dropped (bound-enlarging).
const VIF_HEAD = 1 + 2 * bartlett(1) * RHO_1; // 0.075232 (z = 7.012), already rigorous

// The SOFT tabulated level imp-96571 confined the residual softness to.
const VIF_SOFT = 1 + 2 * (bartlett(1) * RHO_1 + bartlett(2) * RHO_2_TABULATED + bartlett(3) * RHO_3_TABULATED);
const Z_SOFT = zFromVif(VIF_SOFT); // 13.713 (SOFT: uncalibrated magnitudes, anti-conservative)

// LEVEL (A) -- rigorous two-lag: calibrated k = 2, 3 closed form + drop the certified-negative rest.
const VIF_RIGOROUS_2LAG = 1 + 2 * (bartlett(1) * RHO_1 + bartlett(2) * rhoClosed(2) + bartlett(3) * rhoClosed(3));
const Z_RIGOROUS_2LAG = zFromVif(VIF_RIGOROUS_2LAG); // 10.521 (rigorous conditional upper bound)

// LEVEL (B) -- actual finite-window value: exact closed-form tail over the WHOLE Bartlett window.
let tailFull = 0;
for (let k = 2; k <= N_W - 1; k++) tailFull += bartlett(k) * rhoClosed(k);
const VIF_ACTUAL = VIF_HEAD + 2 * tailFull; // 0.005463 (the true conditional value)
const Z_ACTUAL = zFromVif(VIF_ACTUAL); // 26.02

export const IMP96593_VIF_EXACT_TAIL_RIGOR_UPGRADE_ASSESSMENT = {
  ticket: 'imp-96593',
  question:
    'Does substituting the imp-96567 exact closed-form tail rho_k = -(1/(2 pi^2 Sigma^2)) ln(k^2/(k^2-1)) over the Bartlett-weighted finite window upgrade the SOFT z_eff >= 13.71 (VIF_291 <= 0.0197) refinement -- which consumes the uncalibrated tabulated rho_2 = -0.020, rho_3 = -0.008 -- to a rigorous conditional bound, or does the residual obstruction persist?',
  directionOfRigor:
    'A rigorous VIF UPPER bound (to LOWER-bound z) needs each INCLUDED lag replaced by a value >= truth (less negative) and dropped terms nonpositive. The calibrated closed form rho_2 = -0.014950, rho_3 = -0.006121 is LESS negative than the tabulated -0.020, -0.008, so the tabulated magnitudes were MORE negative than truth and pushed VIF too LOW: z = 13.71 was mildly ANTI-conservative, never a valid upper-bound level.',
  levels: {
    softTabulated: { vifUpper: VIF_SOFT, zLower: Z_SOFT, inputs: 'tabulated rho_2 = -0.020, rho_3 = -0.008 (drop k >= 4)', status: 'SOFT / anti-conservative (mis-calibrated magnitudes)' },
    rigorousTwoLag: { vifUpper: VIF_RIGOROUS_2LAG, zLower: Z_RIGOROUS_2LAG, inputs: 'calibrated closed-form rho_2 = -0.014950, rho_3 = -0.006121 (drop certified-negative k >= 4)', status: 'RIGOROUS conditional upper bound (modulo the enclosure residual below)' },
    actualFiniteWindow: { vif: VIF_ACTUAL, z: Z_ACTUAL, inputs: 'exact closed-form tail summed across the whole k = 2..290 Bartlett window (nothing dropped)', status: 'the true conditional value (needs closed-form-vs-direct certification across all k)' },
  },
  closedFormTail: { rho2: rhoClosed(2), rho3: rhoClosed(3), formula: 'rho_k = -(1/(2 pi^2 Sigma^2)) ln(k^2/(k^2-1)), k >= 2', tailRhoSum: -Math.log(2) / (2 * PI * PI) / SIGMA2 },
  residualObstruction:
    'The softness MIGRATES from CALIBRATION to NUMERICAL ENCLOSURE. The exact closed form discharges the uncalibrated-tabulated softness (the specific thing imp-96571 flagged), but full rigor (not 6-digit) still needs: (i) an interval-certified Sigma^2(L) (currently the GUE asymptotic matching the direct integral to 6 digits, not an enclosure); (ii) a certified one-sided bound that the closed form is >= the true finite-L box correlation (the closed form is the sin^2 -> 1/2 averaged limit; the O(1/L) oscillatory finite-L correction sign must be pinned so VIF stays an UPPER bound); (iii) GUE throughout. The dropped k >= 4 tail needs no such control for the two-lag level -- it is certified nonpositive and merely discarded.',
  conditionality:
    'All of the above is conditional on the GUE sine kernel / Montgomery pair correlation holding for the actual zeta zeros (UNPROVEN, GRH-flavored). It changes NO unconditional bound.',
  verdict:
    'PARTIAL. The imp-96567 exact closed-form tail DOES discharge the specific softness imp-96571 flagged -- the uncalibrated tabulated rho_2 = -0.020, rho_3 = -0.008 are replaced by a derived, two-independent-ways closed form rho_2 = -0.014950, rho_3 = -0.006121 -- but it does NOT ratify z = 13.71 as the rigorous number. It SPLITS that soft level: the honest rigorous conditional bound from the same two calibrated lags (drop the certified-negative rest) is z >= 10.52 (VIF <= 0.0334), and the actual finite-window value from the full exact tail is z ~ 26.0 (VIF ~ 0.0055). The 13.71 figure was an artifact of tabulated magnitudes MORE negative than the calibrated truth, i.e. mildly anti-conservative, so it was never a valid upper-bound level. The residual obstruction MIGRATES from calibration to numerical enclosure: full rigor still needs an interval-certified Sigma^2(L), a certified one-sided bound that the closed form >= the true finite-L correlation (O(1/L) oscillatory correction sign pinned), and GUE throughout. Conditional on the GUE sine kernel / Montgomery pair correlation for the zeta zeros (UNPROVEN); changes no unconditional bound; assessment only; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention).
export const IMP96593_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment only: the imp-96567 exact closed-form tail '
  + 'rho_k = -(1/(2 pi^2 Sigma^2)) ln(k^2/(k^2-1)) discharges the uncalibrated tabulated rho_2/rho_3 '
  + 'softness but does NOT ratify z = 13.71 -- it SPLITS it. The calibrated closed form (rho_2 = -0.0150, '
  + 'rho_3 = -0.0061) is LESS negative than the tabulated -0.020/-0.008, so 13.71 was mildly '
  + 'anti-conservative; the honest rigorous two-lag bound is z >= 10.52 (VIF <= 0.0334) and the actual '
  + 'finite-window value is z ~ 26.0 (VIF ~ 0.0055). Residual obstruction MIGRATES from calibration to '
  + 'numerical enclosure (interval Sigma^2(L); one-sided finite-L correction; GUE). Conditional on the '
  + 'pair correlation for the zeta zeros (UNPROVEN); changes no unconditional bound.';

// --- self-executing internal-consistency assertions (formula / level re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // the rigorous head and the soft level reproduce the imp-96571 literals
  if (!approx(VIF_HEAD, 0.075232, 1e-5)) throw new Error('imp-96593: rho_1-only head VIF drifted from 0.0752');
  if (!approx(VIF_SOFT, 0.019672, 1e-5)) throw new Error('imp-96593: soft tabulated VIF drifted from 0.0197');
  if (!approx(Z_SOFT, 13.713, 1e-2)) throw new Error('imp-96593: soft z drifted from 13.71');
  // the closed-form tail reproduces the imp-96567 calibrated magnitudes
  if (!approx(rhoClosed(2), -0.014950, 1e-5)) throw new Error('imp-96593: closed-form rho_2 drifted from -0.014950');
  if (!approx(rhoClosed(3), -0.006121, 1e-5)) throw new Error('imp-96593: closed-form rho_3 drifted from -0.006121');
  // DIRECTION OF RIGOR: the calibrated closed form is LESS negative than the tabulated magnitudes,
  // so the tabulated (soft) level was anti-conservative (VIF pushed too low, z too high).
  if (!(rhoClosed(2) > RHO_2_TABULATED)) throw new Error('imp-96593: closed-form rho_2 must be less negative than the tabulated value');
  if (!(rhoClosed(3) > RHO_3_TABULATED)) throw new Error('imp-96593: closed-form rho_3 must be less negative than the tabulated value');
  if (!(VIF_RIGOROUS_2LAG > VIF_SOFT)) throw new Error('imp-96593: honest two-lag VIF must EXCEED the soft VIF (soft was anti-conservative)');
  if (!(Z_RIGOROUS_2LAG < Z_SOFT)) throw new Error('imp-96593: honest two-lag z must be BELOW the soft 13.71');
  // LEVEL (A) rigorous two-lag lands at z ~ 10.52 and is a valid upper bound (< the rho_1 head VIF)
  if (!approx(VIF_RIGOROUS_2LAG, 0.033421, 1e-5)) throw new Error('imp-96593: rigorous two-lag VIF drifted from 0.0334');
  if (!approx(Z_RIGOROUS_2LAG, 10.521, 1e-2)) throw new Error('imp-96593: rigorous two-lag z drifted from 10.52');
  if (!(VIF_RIGOROUS_2LAG < VIF_HEAD)) throw new Error('imp-96593: the two-lag bound must sit below the rho_1-only head');
  // dropped k >= 4 tail is certified nonpositive (so dropping it only RAISES VIF: safe for an upper bound)
  for (let k = 4; k <= N_W - 1; k++) {
    if (!(rhoClosed(k) <= 0)) throw new Error('imp-96593: dropped tail lag must be nonpositive');
    if (!(bartlett(k) > 0)) throw new Error('imp-96593: Bartlett weight must be positive for k < N_W');
  }
  // LEVEL (B) actual finite-window value sits below the two-lag bound and gives the larger z ~ 26
  if (!approx(VIF_ACTUAL, 0.005463, 1e-5)) throw new Error('imp-96593: actual finite-window VIF drifted from 0.0055');
  if (!approx(Z_ACTUAL, 26.02, 5e-2)) throw new Error('imp-96593: actual finite-window z drifted from 26.0');
  if (!(VIF_ACTUAL < VIF_RIGOROUS_2LAG)) throw new Error('imp-96593: the actual value must sit below the two-lag upper bound');
  // ordering: actual value <= rigorous two-lag bound <= rho_1 head, and soft sits between actual and two-lag
  if (!(VIF_ACTUAL < VIF_SOFT && VIF_SOFT < VIF_RIGOROUS_2LAG)) throw new Error('imp-96593: soft level must sit between the actual value and the rigorous two-lag bound');
  // honesty gates
  if (!/NO QED/.test(IMP96593_VIF_EXACT_TAIL_RIGOR_UPGRADE_ASSESSMENT.verdict))
    throw new Error('imp-96593: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96593_VIF_EXACT_TAIL_RIGOR_UPGRADE_ASSESSMENT.verdict))
    throw new Error('imp-96593: verdict dropped the no-refereed-bound-change banner');
  if (!/conditional/i.test(IMP96593_VIF_EXACT_TAIL_RIGOR_UPGRADE_ASSESSMENT.verdict))
    throw new Error('imp-96593: verdict must flag the result as CONDITIONAL');
  if (!(/RH open/.test(IMP96593_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96593_HONEST_BANNER) && /NO QED/.test(IMP96593_HONEST_BANNER)))
    throw new Error('imp-96593: IMP96593_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96593_VIF_EXACT_TAIL_RIGOR_UPGRADE_ASSESSMENT;
