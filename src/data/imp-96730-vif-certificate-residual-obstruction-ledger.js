/**
 * imp-96730 -- Re-audit of the imp-96593 residual-obstruction list for a rigorous CONDITIONAL VIF
 * certificate, now that imp-96628 has certified the box sine-kernel lag-correlation two-sided envelope
 * |DeltaCov_k(L)| <= C(k)/L^2. Honest residual ledger; conditional on GUE; NO QED.
 *
 * THE imp-96593 OBSTRUCTION LIST (its VERDICT clauses (i)-(iii)). imp-96593 found the exact closed-form
 * tail rho_k = -(1/(2 pi^2 Sigma^2)) ln(k^2/(k^2-1)) discharges the CALIBRATION softness imp-96571 had
 * flagged, but that full rigor (not merely 6-digit) of the conditional two-lag level (A)
 * VIF_291 <= 0.0334214 / z >= 10.5211 still needed:
 *   (i)   an interval-certified Sigma^2(L) (was the GUE asymptotic matching the direct integral to 6
 *         digits, not an enclosure);
 *   (ii)  a certified one-sided bound that the closed form is >= the true finite-L box correlation --
 *         the O(1/L) oscillatory finite-L correction sign PINNED so VIF stays an UPPER bound;
 *   (iii) GUE / Montgomery pair correlation throughout (UNPROVEN).
 *
 * WHAT HAS SINCE LANDED.
 *   - imp-96618 gave a 300-bit interval enclosure Sigma^2(495.779) of width ~1.08e-35, ~30 orders below
 *     any figure at issue: obstruction (i) is DISCHARGED (and it surfaced the honest outward rounding
 *     VIF_2LAG <= 0.0334214, z_2LAG >= 10.5211285).
 *   - imp-96617 MEASURED the finite-L correction sign: it is genuinely OSCILLATORY (lag-alternating), so
 *     a one-SIDED bound (the literal form of obstruction (ii)) is UNACHIEVABLE -- that route is CLOSED.
 *     The residual it left was a two-SIDED enclosure with a MEASURED constant C ~ 2.07e-3.
 *   - imp-96628 CERTIFIED that constant: two integrations by parts on the oscillatory correction integral
 *     give |DeltaCov_k(L)| <= C(k)/L^2 for ALL L > 0, ALL k >= 2, with the explicit L-uniform
 *     C(k) = (1/(8 pi^4)) [ 2/k^2 + 1/(k-1)^2 + 1/(k+1)^2 + V(k) ], C(2) = 3/(8 pi^4) = 3.850e-3.
 *
 * RE-CASTING OBSTRUCTION (ii). A rigorous conditional VIF certificate does NOT actually require a
 * one-sided bound. VIF_291 = 1 + 2 sum_{k=1}^{290} (1-k/291) rho_k with rho_k = Cov_k/Sigma^2. Because
 * the finite-L correction is two-sided, the honest object is an INTERVAL Cov_k(L) in [Cov_k(inf) -
 * C(k)/L^2, Cov_k(inf) + C(k)/L^2]. Summing the certified envelope across the WHOLE Bartlett window
 * (weight (1-k/291) > 0 on k < 291) gives a rigorous VIF interval half-width
 *   HW = (2/Sigma^2) sum_{k=2}^{290} (1-k/291) C(k)/L^2 = 5.65e-8   (at L = 495.779),
 * i.e. VIF is pinned to +/- 5.65e-8 by the lag k >= 2 corrections -- ~1.7e-6 of the two-lag level (A)
 * bound 0.0334214 and ~1.0e-5 of the actual finite-window value 0.005463. So obstruction (ii), in its
 * correct two-SIDED re-cast, is DISCHARGED: the certified envelope converts the closed-form point tail
 * into a rigorous VIF interval whose width is negligible against every figure at issue. (The literal
 * one-sided form remains impossible, and that is fine -- an interval, not a one-sided bound, is what the
 * certificate needs.)
 *
 * THE RESIDUAL LEDGER (what still blocks a fully rigorous conditional certificate).
 *   R0 [GUE]  -- obstruction (iii) is UNTOUCHED and is the binding gate: the entire construction assumes
 *      the GUE sine kernel / Montgomery pair correlation for the actual zeta zeros, which is UNPROVEN
 *      (GRH-flavored). No amount of enclosure work reaches it; it changes no unconditional bound.
 *   R1 [k = 1 provenance]  -- the certified envelope is stated for k >= 2 ONLY (I_1 diverges
 *      logarithmically). The head uses rho_1 = -0.4639782 as an EXACT union-identity box value
 *      (imp-96489); whether that value is exact AT the finite window L = 495.779 or is an infinite-L
 *      limit carrying its own (un-enveloped) finite-L correction is NOT certified here. Since rho_1
 *      dominates VIF (2(1-1/291) rho_1 = -0.9246), any un-enclosed k = 1 finite-L correction would sit
 *      ~10^7 x above HW: this is the SHARPEST remaining enclosure residual, and it is named, not closed.
 *   R2 [truncation tail]  -- NON-ISSUE, recorded to retire it: the Bartlett weight (1-k/291) vanishes for
 *      k >= 291, so the k = 1..290 window IS the entire estimator. There is no infinite k >= K tail to
 *      bound; the "k = 2..K truncation tail" named in the ticket does not arise for this hard-box tiling.
 *   R3 [window L = 495.779]  -- NON-ISSUE: C(k)/L^2 is L-UNIFORM (holds for all L > 0), so the fixed
 *      certificate window introduces no residual; HW simply scales as 1/L^2.
 *
 * VERDICT. Of the three imp-96593 obstructions, (i) [interval Sigma^2(L)] is discharged by imp-96618 and
 * (ii) [finite-L correction] is discharged in its correct TWO-SIDED re-cast by the imp-96628 certified
 * envelope -- summed over the Bartlett window it pins VIF to +/- 5.65e-8, negligible against the level
 * (A) bound 0.0334214 and the actual value 0.005463. The literal one-sided form of (ii) stays
 * impossible (imp-96617: the sign oscillates) but is not what the certificate needs. What remains: R0,
 * obstruction (iii) [GUE / pair correlation, UNPROVEN], the binding conditional gate; and R1, the k = 1
 * lag's exact-value provenance at finite L (excluded from the k >= 2 envelope, dominant in VIF, its
 * finite-L correction not enclosed here). R2 (truncation tail) and R3 (window) are non-issues by the
 * finite Bartlett window and the L-uniformity of C(k). The certificate does NOT close. Assessment only;
 * conditional on the GUE sine kernel / Montgomery pair correlation for the zeta zeros (UNPROVEN); changes
 * NO unconditional bound; RH open; NO QED; no refereed bound is changed; the zero-side route
 * stays PCC/GRH-gated.
 *
 * @see imp-96593-vif-exact-tail-rigor-upgrade-assessment (the obstruction list (i)-(iii) re-audited here)
 * @see imp-96618-vif-sigma2-interval-enclosure (discharges obstruction (i))
 * @see imp-96617-finite-L-correction-sign (the sign oscillates: one-sided route CLOSED)
 * @see imp-96628-boxsine-lagcorr-ibp-envelope (the certified two-sided C(k)/L^2 envelope)
 * @see imp-96489-excursion-effective-significance-direct-rho (the exact rho_1 union value, R1)
 *
 * Import-light: no zeros bundle, no sibling imports. C(k), V(k), and the VIF interval half-width HW are
 * re-derived here from the imp-96628 closed constant and the imp-96593 / imp-96567 literals.
 */

const PI = Math.PI;

// Fixed inputs (imp-96543 / imp-96567 / imp-96593 / imp-96618 literals; no zeros needed).
const N_W = 291; // conservative non-overlapping hard-box tiling count at T = 1.5e5
const L = 495.779; // fixed VIF certificate window
const SIGMA2 = 0.974834; // number variance at L (imp-96618 interval-certified; double literal here)
const RHO_1 = -0.4639782; // imp-96489 exact union-identity lag-1 box value (R1: provenance at finite L)
const bartlett = (k) => 1 - k / N_W; // finite-window triangular weight (> 0 for k < N_W)

// imp-96628 certified two-sided envelope constant: |DeltaCov_k(L)| <= C(k)/L^2 for all L > 0, k >= 2.
function totalVariation(k) {
  const Am1 = 1 / ((k - 1) * (k - 1)); // A_prime(-1)
  const A0m = (k - 2) / (k * k * k); //   A_prime(0-)
  const A0p = -(k + 2) / (k * k * k); //  A_prime(0+)
  const A1 = -1 / ((k + 1) * (k + 1)); // A_prime(1)
  return Math.abs(A0m - Am1) + Math.abs(A1 - A0p);
}
function envelopeConst(k) {
  const bracket = 2 / (k * k) + 1 / ((k - 1) * (k - 1)) + 1 / ((k + 1) * (k + 1)) + totalVariation(k);
  return bracket / (8 * Math.pow(PI, 4));
}

// The rigorous VIF interval half-width contributed by the certified envelope over the whole Bartlett
// window (lags k >= 2). rho_k = Cov_k/Sigma^2, so the Cov half-width C(k)/L^2 maps to VIF via 2*w_k/Sigma^2.
let HW = 0;
for (let k = 2; k <= N_W - 1; k++) HW += bartlett(k) * envelopeConst(k) / (L * L);
HW = (2 / SIGMA2) * HW; // 5.65e-8

// Reference VIF figures at issue (imp-96593 level (A) bound and level (B) actual value).
const VIF_LEVEL_A = 0.0334214; // imp-96618 outward-rounded two-lag upper bound
const VIF_ACTUAL = 0.005463; // imp-96593 actual finite-window value (full exact tail)

export const IMP96730_VIF_CERTIFICATE_RESIDUAL_OBSTRUCTION_LEDGER = {
  ticket: 'imp-96730',
  question:
    'Now that imp-96628 certifies the box sine-kernel lag-correlation two-sided envelope |DeltaCov_k(L)| <= C(k)/L^2, re-audit the imp-96593 obstruction list: which obstructions to a rigorous conditional VIF certificate does the certified envelope discharge, and which remain?',
  obstructionList: {
    i: { statement: 'interval-certified Sigma^2(L)', status: 'DISCHARGED by imp-96618 (300-bit enclosure width ~1.08e-35)' },
    ii: { statement: 'certified bound on the finite-L box-correlation correction (obstruction (ii))', status: 'DISCHARGED in its TWO-SIDED re-cast by imp-96628; the literal one-sided form is impossible (imp-96617: sign oscillates) but not what the certificate needs' },
    iii: { statement: 'GUE / Montgomery pair correlation throughout', status: 'REMAINS (R0) -- UNPROVEN binding conditional gate' },
  },
  vifIntervalHalfWidth: HW, // 5.65e-8: VIF pinned by summing the certified envelope over lags k >= 2
  halfWidthVsLevelA: HW / VIF_LEVEL_A, // ~1.7e-6
  halfWidthVsActual: HW / VIF_ACTUAL, // ~1.0e-5
  residualLedger: {
    R0_GUE: 'Obstruction (iii): the whole construction assumes the GUE sine kernel / Montgomery pair correlation for the zeta zeros (UNPROVEN, GRH-flavored). The binding gate; changes no unconditional bound.',
    R1_k1_provenance: 'The certified envelope is k >= 2 only (I_1 diverges logarithmically). rho_1 = -0.4639782 is used as an EXACT union-identity box value (imp-96489); whether it is exact at the finite window L = 495.779 or an infinite-L limit with its own un-enclosed finite-L correction is NOT certified here. rho_1 dominates VIF (2(1-1/291) rho_1 = -0.9246), so this is the sharpest remaining enclosure residual -- named, not closed.',
    R2_truncation_tail: 'NON-ISSUE: the Bartlett weight (1-k/291) vanishes for k >= 291, so k = 1..290 IS the whole estimator. No infinite k >= K tail arises for this hard-box tiling.',
    R3_window_L: 'NON-ISSUE: C(k)/L^2 is L-uniform (all L > 0), so the fixed window L = 495.779 introduces no residual; HW scales as 1/L^2.',
  },
  conditionality:
    'All conditional on the GUE sine kernel / Montgomery pair correlation holding for the actual zeta zeros (UNPROVEN, GRH-flavored). Changes NO unconditional bound.',
  verdict:
    'Of the three imp-96593 obstructions, (i) [interval Sigma^2(L)] is discharged by imp-96618 and (ii) [finite-L correction] is discharged in its correct TWO-SIDED re-cast by the imp-96628 certified envelope: summed over the Bartlett window it pins VIF to +/- 5.65e-8 (~1.7e-6 of the level (A) bound 0.0334214, ~1.0e-5 of the actual value 0.005463). The literal one-sided form of (ii) stays impossible (imp-96617: the sign oscillates) but is not what the certificate needs -- an interval is. What REMAINS: R0, obstruction (iii) [GUE / pair correlation, UNPROVEN], the binding conditional gate; and R1, the k = 1 lag exact-value provenance at finite L (excluded from the k >= 2 envelope, dominant in VIF, its finite-L correction not enclosed here). R2 (truncation tail) and R3 (window) are non-issues by the finite Bartlett window and the L-uniformity of C(k). The certificate does NOT close. Assessment only; conditional on the GUE sine kernel / Montgomery pair correlation for the zeta zeros (UNPROVEN); changes NO unconditional bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 / imp-96593 / imp-96628 convention).
export const IMP96730_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment only: re-auditing the imp-96593 VIF '
  + 'obstruction list, (i) interval Sigma^2(L) is discharged (imp-96618) and (ii) the finite-L correction '
  + 'is discharged in its TWO-SIDED re-cast by the imp-96628 certified envelope |DeltaCov_k| <= C(k)/L^2 '
  + '(summed over lags it pins VIF to +/- 5.65e-8). The one-sided form of (ii) stays impossible (imp-96617: '
  + 'sign oscillates). REMAINING: R0 = obstruction (iii) GUE / pair correlation (UNPROVEN, binding gate) and '
  + 'R1 = the k = 1 lag exact-value provenance at finite L (envelope is k >= 2 only, rho_1 dominates VIF). '
  + 'R2 (truncation tail) and R3 (window) are non-issues. Certificate does NOT close. Conditional on the '
  + 'pair correlation for the zeta zeros (UNPROVEN); changes no unconditional bound.';

// --- self-executing internal-consistency assertions (re-derivation only; no zeros, no offline script) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // 1. The certified envelope constant reproduces the imp-96628 literals.
  if (!approx(envelopeConst(2), 3 / (8 * Math.pow(PI, 4)), 1e-15))
    throw new Error('imp-96730: C(2) must equal 3/(8 pi^4) = 3.850e-3 (imp-96628 literal)');
  if (!approx(totalVariation(2), 1 + 7 / 18, 1e-12))
    throw new Error('imp-96730: V(2) must equal 1 + 7/18 (imp-96628 literal)');

  // 2. The VIF interval half-width from summing the envelope over the Bartlett window is ~5.65e-8.
  if (!approx(HW, 5.65e-8, 5e-10))
    throw new Error('imp-96730: envelope-summed VIF half-width must be ~5.65e-8');

  // 3. HW is negligible against both figures at issue (this is what discharges obstruction (ii)).
  if (!(HW / VIF_LEVEL_A < 1e-5))
    throw new Error('imp-96730: VIF half-width must be negligible vs the level (A) bound 0.0334214');
  if (!(HW / VIF_ACTUAL < 1e-4))
    throw new Error('imp-96730: VIF half-width must be negligible vs the actual value 0.005463');

  // 4. R1 is genuinely the dominant residual: the k = 1 head term far exceeds HW in magnitude.
  const head1 = Math.abs(2 * bartlett(1) * RHO_1); // 0.9246
  if (!(head1 > 1e6 * HW))
    throw new Error('imp-96730: the k = 1 head must dominate HW (R1 is the sharpest residual)');

  // 5. R2 non-issue: the Bartlett weight vanishes at and beyond k = 291 (finite window IS the estimator).
  if (!(bartlett(N_W) === 0 && bartlett(N_W - 1) > 0))
    throw new Error('imp-96730: the Bartlett window must terminate exactly at k = 291 (no truncation tail)');

  // honesty gates
  if (!/NO QED/.test(IMP96730_VIF_CERTIFICATE_RESIDUAL_OBSTRUCTION_LEDGER.verdict))
    throw new Error('imp-96730: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96730_VIF_CERTIFICATE_RESIDUAL_OBSTRUCTION_LEDGER.verdict))
    throw new Error('imp-96730: verdict dropped the no-refereed-bound-change banner');
  if (!/[Cc]onditional/.test(IMP96730_VIF_CERTIFICATE_RESIDUAL_OBSTRUCTION_LEDGER.verdict))
    throw new Error('imp-96730: verdict must flag the result as CONDITIONAL');
  if (!/does NOT close/.test(IMP96730_VIF_CERTIFICATE_RESIDUAL_OBSTRUCTION_LEDGER.verdict))
    throw new Error('imp-96730: verdict must state the certificate does NOT close');
  if (!(/RH open/.test(IMP96730_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96730_HONEST_BANNER) && /NO QED/.test(IMP96730_HONEST_BANNER)))
    throw new Error('imp-96730: IMP96730_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96730_VIF_CERTIFICATE_RESIDUAL_OBSTRUCTION_LEDGER;
