/**
 * imp-96585 -- Cross-tabulate the imp-96567 box covariances rho_k from the DIRECT double-box integral
 * of T_2 vs the CLOSED FORM -(1/(2 pi^2)) ln(k^2/(k^2-1)) side by side, as a reproducible
 * machine-checkable object that verifies the claimed 6-digit agreement.
 *
 * WHAT imp-96567 CLAIMED (and did NOT tabulate). imp-96567 derived the GUE sine-kernel box-averaged
 * lag correlations at the L = 495.779 non-overlapping tiling two ways and asserted they agree to 6
 * digits for k >= 2 (rho_2 = -0.014950, rho_3 = -0.006121, ...), but it BAKED the direct values as
 * offline literals (from tmp/imp-96567-scratch.mjs) and only asserted the closed form against those
 * literals -- the two INDEPENDENT evaluations were never recomputed and tabulated together in one
 * import-light object. This module supplies exactly that cross-validation: it recomputes rho_k BOTH
 * ways in-process and tabulates the per-k agreement, the max abs deviation, and the telescoping
 * tail identity.
 *
 * THE TWO EVALUATIONS (both re-derived here on T_2(x) = (sin pi x / pi x)^2, no baked rho literals).
 *   (A) DIRECT double-box, triangular reduction:
 *         Sigma^2(L) = L - int_{-L}^{L} (L - |u|) T_2(u) du,
 *         Cov_k^dir  =   - int_{-L}^{L} (L - |u|) T_2(u + kL) du,   rho_k^dir = Cov_k^dir / Sigma^2.
 *       Composite Simpson at 100 panels per unit length resolves the period-1 sin^2; over the box
 *       B at lag k the shifted argument x = u + kL ranges over [(k-1)L, (k+1)L], far from 0.
 *   (B) CLOSED FORM (sin^2 -> 1/2 averaging; L cancels):
 *         Cov_k^cf = -(1/(2 pi^2)) ln(k^2/(k^2-1)),   rho_k^cf = Cov_k^cf / Sigma^2.
 *
 * RESULT (recomputed here, not baked). At 100 panels per unit the direct quadrature gives
 * Sigma^2(L) = 0.974834 (matching the imp-96567 direct value and the GUE asymptotic
 * (1/pi^2)(ln(2 pi L) + gamma + 1) to 6 digits). The per-k direct-vs-closed rho_k deviations are all
 * ~1e-9 or smaller (max abs deviation ~3.2e-9 at k = 2), i.e. the "6-digit agreement" is confirmed
 * with several digits of margin. The k >= 2 covariances telescope: sum_{k>=2} ln(k^2/(k^2-1)) = ln 2
 * (verified to 5e-5 over a 2e4-term partial sum, and exactly as an identity), so
 * sum_{k>=2} Cov_k = -(ln 2)/(2 pi^2).
 *
 * SCOPE. Measurement / verification only; conditional on the GUE sine kernel / Montgomery pair
 * correlation holding for the zeta zeros (UNPROVEN, GRH-flavored); changes NO unconditional bound;
 * RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96567-box-averaged-sine-kernel-lag-decay (the claim this cross-validates)
 * @see imp-96543-sine-kernel-vif-conditional-lower-bound (the VIF certificate the tail feeds)
 * @see imp-96542-excursion-empirical-lag2-lag3-box-covariance (the empirical r_k at this box length)
 *
 * Import-light: no zeros bundle, no sibling imports. Every rho_k is recomputed in-process; only the
 * geometry constant L = 495.779 is carried from the imp-96542 tiling.
 */

const PI = Math.PI;
const GAMMA = 0.5772156649015329;
const L = 495.779; // T = 1.5e5 non-overlapping box length (imp-96542)
const PANELS_PER_UNIT = 100; // Simpson resolution across the period-1 sin^2
const TOL_6DIGIT = 1e-6; // the tolerance the imp-96567 6-digit claim is asserted against

// GUE two-point cluster function (nonnegative).
const clusterT2 = (x) => {
  if (x === 0) return 1;
  const s = Math.sin(PI * x) / (PI * x);
  return s * s;
};

// Composite Simpson of g over [a,b] with n (forced even) panels.
function simpson(g, a, b, n) {
  if (n % 2) n += 1;
  const h = (b - a) / n;
  let s = g(a) + g(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * g(a + i * h);
  return (s * h) / 3;
}

const panels = () => Math.max(4, Math.round(2 * L * PANELS_PER_UNIT));

// (A) DIRECT double-box, triangular reduction.
const sigma2Direct = () => L - simpson((u) => (L - Math.abs(u)) * clusterT2(u), -L, L, panels());
const covDirect = (k) => -simpson((u) => (L - Math.abs(u)) * clusterT2(u + k * L), -L, L, panels());

// (B) CLOSED FORM.
const covClosed = (k) => -Math.log((k * k) / (k * k - 1)) / (2 * PI * PI);

// GUE asymptotic number variance (cross-check on Sigma^2).
const sigma2Asymptotic = (len) => (Math.log(2 * PI * len) + GAMMA + 1) / (PI * PI);

const SIGMA2_DIRECT = sigma2Direct();
const KS = [2, 3, 4, 5, 6];

// The side-by-side cross-tabulation (the object this ticket asks for).
const CROSSTAB = KS.map((k) => {
  const rhoDirect = covDirect(k) / SIGMA2_DIRECT;
  const rhoClosed = covClosed(k) / SIGMA2_DIRECT;
  return {
    k,
    rhoDirect,
    rhoClosed,
    absDeviation: Math.abs(rhoDirect - rhoClosed),
  };
});
const MAX_ABS_DEVIATION = CROSSTAB.reduce((m, r) => Math.max(m, r.absDeviation), 0);

// Telescoping tail identity sum_{k>=2} ln(k^2/(k^2-1)) = ln 2 (partial sum as the reproducible check).
let TELESCOPE_PARTIAL = 0;
for (let k = 2; k <= 20000; k++) TELESCOPE_PARTIAL += Math.log((k * k) / (k * k - 1));
const TELESCOPE_TARGET = Math.log(2);
const TAIL_COV_SUM = -TELESCOPE_TARGET / (2 * PI * PI); // -(ln 2)/(2 pi^2)

export const IMP96585_BOX_COVARIANCE_DIRECT_VS_CLOSEDFORM_CROSSTAB = {
  ticket: 'imp-96585',
  question:
    'Cross-tabulate the imp-96567 box covariances rho_k from the direct double-box integral of T_2 vs the closed form -(1/(2 pi^2)) ln(k^2/(k^2-1)) side by side as a reproducible check of the claimed 6-digit agreement.',
  boxLength: L,
  panelsPerUnit: PANELS_PER_UNIT,
  numberVariance: {
    direct: SIGMA2_DIRECT, // 0.974834
    asymptotic: sigma2Asymptotic(L), // (1/pi^2)(ln(2 pi L)+gamma+1)
    note: 'direct double-box Sigma^2(L) matches the GUE asymptotic and the imp-96567 baked value to 6 digits',
  },
  crossTab: CROSSTAB, // per-k rho_direct, rho_closed, |deviation|
  maxAbsDeviation: MAX_ABS_DEVIATION, // ~3.2e-9, well inside the 6-digit tolerance
  sixDigitTolerance: TOL_6DIGIT,
  agreesToSixDigits: MAX_ABS_DEVIATION <= TOL_6DIGIT,
  telescope: {
    identity: 'sum_{k>=2} ln(k^2/(k^2-1)) = ln 2',
    partialSum: TELESCOPE_PARTIAL, // 2e4-term partial sum
    target: TELESCOPE_TARGET, // ln 2
    tailCovSum: TAIL_COV_SUM, // -(ln 2)/(2 pi^2) = -0.035116
  },
  conditionality:
    'Conditional on the GUE sine kernel / Montgomery pair correlation holding for the actual zeta zeros (UNPROVEN, GRH-flavored). It changes NO unconditional bound.',
  verdict:
    'Independent cross-validation CONFIRMS the imp-96567 claim: recomputing the box lag correlations rho_k BOTH ways at the L = 495.779 non-overlapping tiling -- (A) the direct double-box Simpson quadrature of T_2 = (sin pi x / pi x)^2 (triangular reduction, 100 panels/unit) and (B) the closed form rho_k = -(1/(2 pi^2 Sigma^2)) ln(k^2/(k^2-1)) -- gives Sigma^2(L) = 0.974834 and a max abs deviation of only ~3.2e-9 over k = 2..6, so the stated 6-digit agreement holds with several digits of margin. The k >= 2 covariances telescope (sum_{k>=2} ln(k^2/(k^2-1)) = ln 2), giving sum_{k>=2} Cov_k = -(ln 2)/(2 pi^2). Measurement / verification only; conditional on the GUE sine kernel / Montgomery pair correlation for the zeta zeros (UNPROVEN); changes no unconditional bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention).
export const IMP96585_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Verification only: recomputing the GUE sine-kernel '
  + 'box lag correlations rho_k both ways at L = 495.779 -- direct double-box Simpson quadrature of T_2 '
  + 'vs the closed form -(1/(2 pi^2 Sigma^2)) ln(k^2/(k^2-1)) -- agrees to a max abs deviation ~3.2e-9 '
  + 'over k = 2..6 (well inside the claimed 6 digits), with Sigma^2 = 0.974834 and the k>=2 tail '
  + 'telescoping to -(ln 2)/(2 pi^2). Conditional on the pair correlation for the zeta zeros (UNPROVEN); '
  + 'changes no unconditional bound.';

// --- self-executing internal-consistency assertions (fresh in-process recomputation; no zeros) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // direct number variance matches the GUE asymptotic and the imp-96567 baked 0.974834
  if (!approx(SIGMA2_DIRECT, sigma2Asymptotic(L), 5e-4))
    throw new Error('imp-96585: direct Sigma^2 drifted from the GUE asymptotic');
  if (!approx(SIGMA2_DIRECT, 0.974834, 1e-6))
    throw new Error('imp-96585: direct Sigma^2 must reproduce the imp-96567 value 0.974834');
  // every cross-tab row: both evaluations nonpositive and agreeing to 6 digits
  for (const row of CROSSTAB) {
    if (!(row.rhoDirect <= 0 && row.rhoClosed <= 0))
      throw new Error('imp-96585: both box lag correlations must be nonpositive');
    if (!(row.absDeviation <= TOL_6DIGIT))
      throw new Error('imp-96585: direct vs closed-form rho_k must agree to 6 digits at every lag');
  }
  // the headline max deviation is genuinely tiny (several digits inside the claim)
  if (!(MAX_ABS_DEVIATION <= TOL_6DIGIT))
    throw new Error('imp-96585: max abs deviation must sit inside the 6-digit tolerance');
  if (!(MAX_ABS_DEVIATION < 1e-7))
    throw new Error('imp-96585: max abs deviation should be well below 1e-7 (several-digit margin)');
  // spot-check the recomputed magnitudes against the imp-96567 tabulated direct rho_2, rho_3
  if (!approx(CROSSTAB[0].rhoDirect, -0.014950, 1e-5))
    throw new Error('imp-96585: recomputed rho_2 must match the imp-96567 tabulated -0.014950');
  if (!approx(CROSSTAB[1].rhoDirect, -0.006121, 1e-5))
    throw new Error('imp-96585: recomputed rho_3 must match the imp-96567 tabulated -0.006121');
  // telescoping identity: partial sum approaches ln 2 from below (each term positive)
  if (!(TELESCOPE_PARTIAL > 0 && TELESCOPE_PARTIAL < TELESCOPE_TARGET))
    throw new Error('imp-96585: telescoping partial sum must lie in (0, ln 2)');
  if (!approx(TELESCOPE_PARTIAL, TELESCOPE_TARGET, 5e-4))
    throw new Error('imp-96585: telescoping partial sum must approach ln 2');
  if (!approx(TAIL_COV_SUM, -Math.log(2) / (2 * PI * PI), 1e-12))
    throw new Error('imp-96585: tail cov sum must equal -(ln 2)/(2 pi^2)');
  // honesty gates
  if (!/NO QED/.test(IMP96585_BOX_COVARIANCE_DIRECT_VS_CLOSEDFORM_CROSSTAB.verdict))
    throw new Error('imp-96585: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96585_BOX_COVARIANCE_DIRECT_VS_CLOSEDFORM_CROSSTAB.verdict))
    throw new Error('imp-96585: verdict dropped the no-refereed-bound-change banner');
  if (!/[Cc]onditional/.test(IMP96585_BOX_COVARIANCE_DIRECT_VS_CLOSEDFORM_CROSSTAB.verdict))
    throw new Error('imp-96585: verdict must flag the result as CONDITIONAL');
  if (!(/RH open/.test(IMP96585_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96585_HONEST_BANNER) && /NO QED/.test(IMP96585_HONEST_BANNER)))
    throw new Error('imp-96585: IMP96585_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96585_BOX_COVARIANCE_DIRECT_VS_CLOSEDFORM_CROSSTAB;
