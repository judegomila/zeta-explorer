/**
 * imp-96853 -- Can a per-lag-partitioned VIF variant salvage a conditional UPPER bound given the
 * box-sine DeltaCov_k sign genuinely lag-alternates (-,+,+,+,- for k = 2..6, imp-96812 horn A), or is
 * the VIF-upper-bound route closed? Assessment + derivation; conditional on GUE; NO QED.
 *
 * THE STANDING OBSTRUCTION (imp-96593 obstruction (ii) -> imp-96628 -> imp-96812). To turn the
 * conditional VIF into a rigorous UPPER bound (to LOWER-bound the effective significance z), each
 * included lag rho_k(L) = Cov_k(L)/Sigma^2 must be replaced by a value >= truth. Using the imp-96567
 * closed form rho_k(inf) = -(1/(2 pi^2 Sigma^2)) ln(k^2/(k^2-1)) as that replacement needs the finite-L
 * correction DeltaCov_k(L) = Cov_k(L) - Cov_k(inf) certified <= 0. imp-96812 horn A found this FATAL to
 * a UNIFORM one-sided bound: the sign of DeltaCov_k genuinely alternates with the lag (-,+,+,+,- for
 * k = 2..6, driven by the explicit leading term B_k), so the closed form UNDER-estimates |Cov_k| at
 * k = 3,4,5 (DeltaCov_k > 0) and OVER-estimates it at k = 2,6 (DeltaCov_k < 0). imp-96812 horn B found
 * the imp-96628 total-variation remainder is too lossy to certify even the per-lag sign.
 *
 * THE QUESTION HERE. Can the VIF sum be REGROUPED by sign-definite lag classes -- bound the
 * positive-DeltaCov lags (k = 3,4,5) by the imp-96628 certified two-sided envelope |DeltaCov_k| <=
 * C(k)/L^2, and the negative-DeltaCov lags by the closed form rho_k(inf) directly -- to recover a
 * WEAKER but still-valid conditional upper bound? Or do the positive-lag contributions structurally
 * overwhelm the VIF budget?
 *
 * FINDING 1 -- THE LITERAL SIGN-PARTITION IS NOT AVAILABLE (horn B), BUT IT IS ALSO NOT NEEDED. A
 * partition that treats k = 3,4,5 (positive DeltaCov) differently from k = 2,6 (negative DeltaCov)
 * would require certifying the sign CLASS of every lag k = 2..290 -- exactly what imp-96812 horn B
 * shows the imp-96628 certificate cannot deliver (the enclosure B_k +/- V(k) straddles zero per lag).
 * So the literal "assign each lag to a sign class" route is blocked. The escape: the imp-96628 envelope
 * is TWO-SIDED, |DeltaCov_k| <= C(k)/L^2, so it bounds BOTH signs at once. Writing
 *   rho_k(L) = rho_k(inf) + DeltaCov_k / Sigma^2 <= rho_k(inf) + C(k) / (L^2 Sigma^2)   (k >= 2),
 * this upper bound is valid REGARDLESS of the sign of DeltaCov_k: at the negative-DeltaCov lags it is
 * merely looser than needed (rho_k(inf) already dominates), at the positive-DeltaCov lags it is exactly
 * what the wrong-sign correction requires. No per-lag sign, and no partition, is needed.
 *
 * FINDING 2 -- THE POSITIVE-LAG (ENVELOPE-SLACK) CONTRIBUTIONS DO NOT OVERWHELM THE BUDGET; THEY ARE
 * NEGLIGIBLE. The Bartlett-weighted envelope-slack sum over the WHOLE window,
 *   Slack = 2 sum_{k=2}^{290} (1 - k/291) C(k) / (L^2 Sigma^2),   C(k) = (1/(8 pi^4))[2/k^2 + 1/(k-1)^2
 *   + 1/(k+1)^2 + V(k)],   L = 495.779,  Sigma^2 = 0.974834,
 * evaluates to Slack = 5.65e-8. That is a factor ~7.5e-7 of the rigorous rho_1-only head VIF_HEAD =
 * 0.075232 and ~1.0e-5 of the actual finite-window value VIF_ACTUAL = 0.005463. The 1/L^2 = 1/(495.779)^2
 * suppression (with the extra 1/(8 pi^4) from the two IBPs) crushes the envelope slack far below the
 * VIF budget: the positive-DeltaCov lags cannot overwhelm it -- they perturb it in the 8th significant
 * figure.
 *
 * FINDING 3 -- THE ENVELOPE-BOUNDED VIF IS A RIGOROUS (CONDITIONAL) UPPER BOUND AT z >= 26.02. Adding
 * the negligible slack to the closed-form finite-window value,
 *   VIF_291 <= VIF_ENV = VIF_ACTUAL + Slack = 0.005463 + 5.65e-8 = 0.0054629   =>   z >= 26.023,
 * essentially indistinguishable from the actual value VIF_ACTUAL = 0.005463 (z = 26.023) -- the
 * two-sided envelope shifts z by ~1.3e-4. Because rho_1 = -0.4639782 is the EXACT finite-L box value
 * (imp-96489, no envelope needed, and the imp-96628 envelope excludes k = 1 where I_1 diverges), the
 * only lags carrying envelope slack are k >= 2, and their slack is the 5.65e-8 above.
 *
 * VERDICT. The VIF-upper-bound route is NOT closed. The literal sign-partition the ticket proposes is
 * unavailable (certifying the per-lag sign class is exactly imp-96812 horn B), but it is unnecessary:
 * the imp-96628 TWO-SIDED envelope |DeltaCov_k(L)| <= C(k)/L^2 bounds rho_k(L) <= rho_k(inf) +
 * C(k)/(L^2 Sigma^2) for EVERY lag k >= 2 regardless of the sign of DeltaCov_k, absorbing the
 * wrong-sign (positive-DeltaCov) lags k = 3,4,5 into a slack term that summed over the whole
 * Bartlett window is only 5.65e-8 -- a factor ~7.5e-7 of the rho_1-only head and ~1.0e-5 of the actual
 * finite-window value, so the positive-lag contributions do NOT overwhelm the budget. This yields a
 * rigorous CONDITIONAL upper bound VIF_291 <= 0.005463 (z >= 26.02), essentially the actual
 * finite-window value. Crucially this SIDESTEPS BOTH horns of imp-96812: horn A (no uniform one-sided
 * sign) is irrelevant because the two-sided envelope needs no one-sidedness, and horn B (per-lag sign
 * uncertifiable) is irrelevant because no partition is needed -- the envelope covers both signs at
 * once. The residual obstruction MIGRATES to the two items imp-96593 already isolated as NOT
 * DeltaCov-sign: (i) an interval-certified Sigma^2(L) (here the 6-digit GUE match 0.974834, not yet an
 * enclosure) and (iii) GUE throughout; obstruction (ii) (the one-sided finite-L correction sign) is
 * now DISCHARGED by the two-sided envelope and no longer blocks. Assessment + derivation only;
 * conditional on the GUE sine kernel / Montgomery pair correlation for the zeta zeros (UNPROVEN,
 * GRH-flavored); changes NO unconditional bound; RH open; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96812-boxsine-onesided-sign-assessment (horn A/B this routes around with the two-sided envelope)
 * @see imp-96628-boxsine-lagcorr-ibp-envelope (the certified two-sided C(k)/L^2 envelope used here)
 * @see imp-96593-vif-exact-tail-rigor-upgrade-assessment (obstruction (ii) now discharged; (i)/(iii) remain)
 * @see imp-96567-box-averaged-sine-kernel-lag-decay (the closed-form tail rho_k(inf) and Sigma^2(L))
 * @see imp-96543-sine-kernel-vif-conditional-lower-bound (the conditional VIF certificate at issue)
 *
 * Import-light: no zeros bundle, no sibling imports. The closed-form tail, the imp-96628 envelope
 * constant C(k), the Bartlett-weighted slack sum, and the VIF/z levels are all re-derived here from the
 * imp-96543 / imp-96567 / imp-96593 / imp-96628 literals and checked in the self-tests below.
 */

const PI = Math.PI;

// Fixed inputs (imp-96543 / imp-96567 / imp-96593 literals; no zeros needed).
const N_W = 291; // conservative non-overlapping hard-box tiling count at T = 1.5e5
const REL_ERR = 0.15945679221237827; // dip depth |residual|/r (held fixed across all models)
const SIGMA2 = 0.974834; // imp-96567 number variance at L = 495.779 (GUE asymptotic == direct to 6 digits)
const RHO_1 = -0.4639782; // imp-96489 exact union-identity lag-1 box value (exact; no envelope needed)
const L = 495.779; // certificate window (imp-96542 / imp-96567 box length)

const zFromVif = (vif) => REL_ERR / Math.sqrt(2 / (N_W / vif)); // z at fixed dip depth
const bartlett = (k) => 1 - k / N_W; // finite-window triangular weight (> 0 for k < N_W)

// imp-96567 EXACT closed-form tail (k >= 2): rho_k(inf) = -(1/(2 pi^2 Sigma^2)) ln(k^2/(k^2-1)).
const rhoClosed = (k) => -Math.log((k * k) / (k * k - 1)) / (2 * PI * PI) / SIGMA2;

// imp-96628 total-variation constant V(k) and certified two-sided envelope constant C(k).
function totalVariation(k) {
  const Am1 = 1 / ((k - 1) * (k - 1)); // A'(-1)
  const A0m = (k - 2) / (k * k * k); //   A'(0-)
  const A0p = -(k + 2) / (k * k * k); //  A'(0+)
  const A1 = -1 / ((k + 1) * (k + 1)); // A'(1)
  return Math.abs(A0m - Am1) + Math.abs(A1 - A0p);
}
// C(k): |DeltaCov_k(L)| <= C(k)/L^2 for all L > 0, all k >= 2 (imp-96628, TWO-SIDED).
function envelopeConst(k) {
  const bracket = 2 / (k * k) + 1 / ((k - 1) * (k - 1)) + 1 / ((k + 1) * (k + 1)) + totalVariation(k);
  return bracket / (8 * Math.pow(PI, 4));
}

// The rigorous rho_1-only head (imp-96571): exact rho_1, tail dropped in the bound-enlarging direction.
const VIF_HEAD = 1 + 2 * bartlett(1) * RHO_1; // 0.075232 (z = 7.012)

// Actual finite-window value (imp-96593 level B): closed-form tail summed across the whole window.
let tailFull = 0;
for (let k = 2; k <= N_W - 1; k++) tailFull += bartlett(k) * rhoClosed(k);
const VIF_ACTUAL = VIF_HEAD + 2 * tailFull; // 0.005463 (the closed-form finite-window value)

// Envelope-slack sum: 2 sum (1-k/N) C(k)/(L^2 Sigma^2) -- covers BOTH signs of DeltaCov_k at once.
let slackSum = 0;
for (let k = 2; k <= N_W - 1; k++) slackSum += bartlett(k) * envelopeConst(k) / (L * L) / SIGMA2;
slackSum *= 2; // 5.65e-8 (negligible vs the VIF budget)

// The rigorous CONDITIONAL two-sided-envelope upper bound (sidesteps both imp-96812 horns).
const VIF_ENV = VIF_ACTUAL + slackSum; // 0.0054629
const Z_ENV = zFromVif(VIF_ENV); // 26.023

export const IMP96853_VIF_TWOSIDED_ENVELOPE_PARTITION_ASSESSMENT = {
  ticket: 'imp-96853',
  question:
    'Given the box-sine DeltaCov_k sign genuinely lag-alternates (-,+,+,+,- for k = 2..6, imp-96812 horn A), can a per-lag-partitioned VIF variant -- positive-DeltaCov lags (k = 3,4,5) bounded by the certified two-sided envelope, negative-DeltaCov lags by the closed form -- salvage a weaker but valid conditional upper bound, or do the positive-lag contributions overwhelm the budget?',
  partitionNotNeeded:
    'The literal sign-partition would need the per-lag sign CLASS of every k = 2..290 certified -- exactly imp-96812 horn B, which the total-variation remainder cannot deliver. But it is unnecessary: the imp-96628 envelope is TWO-SIDED, |DeltaCov_k| <= C(k)/L^2, so rho_k(L) = rho_k(inf) + DeltaCov_k/Sigma^2 <= rho_k(inf) + C(k)/(L^2 Sigma^2) is a valid upper bound for EVERY k >= 2 regardless of the sign of DeltaCov_k (looser than needed at the negative lags, exactly right at the positive lags).',
  envelopeSlackSum: slackSum, // 5.65e-8
  slackFractionOfHead: slackSum / VIF_HEAD, // ~7.5e-7
  slackFractionOfActual: slackSum / VIF_ACTUAL, // ~1.0e-5
  positiveLagsOverwhelmBudget: false,
  levels: {
    rho1Head: { vifUpper: VIF_HEAD, zLower: zFromVif(VIF_HEAD), note: 'rigorous rho_1-only head (drop certified-negative tail)' },
    actualFiniteWindow: { vif: VIF_ACTUAL, z: zFromVif(VIF_ACTUAL), note: 'closed-form tail over the whole Bartlett window (the finite-window value; under-estimates at positive-DeltaCov lags)' },
    twoSidedEnvelopeBound: { vifUpper: VIF_ENV, zLower: Z_ENV, note: 'RIGOROUS conditional upper bound: closed form + two-sided envelope slack over all k >= 2; needs NO per-lag sign' },
  },
  envelopeConstFormula:
    'C(k) = (1/(8 pi^4)) [2/k^2 + 1/(k-1)^2 + 1/(k+1)^2 + V(k)] (imp-96628); slack per lag rho_k(L) <= rho_k(inf) + C(k)/(L^2 Sigma^2).',
  sidestepsHorns:
    'Horn A (no uniform one-sided sign) is irrelevant: the two-sided envelope needs no one-sidedness. Horn B (per-lag sign uncertifiable) is irrelevant: no partition is needed -- the envelope covers both signs at once.',
  residualObstruction:
    'The one-sided finite-L correction sign (imp-96593 obstruction (ii)) is now DISCHARGED by the two-sided envelope. What remains is exactly the two items imp-96593 already isolated as NOT DeltaCov-sign: (i) an interval-certified Sigma^2(L) (here the 6-digit GUE match 0.974834, not yet an enclosure), and (iii) GUE throughout.',
  conditionality:
    'Conditional on the GUE sine kernel / Montgomery pair correlation holding for the actual zeta zeros (UNPROVEN, GRH-flavored). Changes NO unconditional bound.',
  verdict:
    'The VIF-upper-bound route is NOT closed. The literal sign-partition the ticket proposes is unavailable (certifying the per-lag sign class is exactly imp-96812 horn B), but it is unnecessary: the imp-96628 TWO-SIDED envelope |DeltaCov_k(L)| <= C(k)/L^2 bounds rho_k(L) <= rho_k(inf) + C(k)/(L^2 Sigma^2) for EVERY lag k >= 2 regardless of the sign of DeltaCov_k, absorbing the wrong-sign (positive-DeltaCov) lags k = 3,4,5 into a slack term that summed over the whole Bartlett window is only 5.65e-8 -- a factor ~7.5e-7 of the rho_1-only head VIF_HEAD = 0.075232 and ~1.0e-5 of the actual finite-window value VIF_ACTUAL = 0.005463, so the positive-lag contributions do NOT overwhelm the budget. This yields a rigorous CONDITIONAL upper bound VIF_291 <= 0.005463 (z >= 26.02), essentially the actual finite-window value (the envelope shifts z by ~1.3e-4). Crucially this SIDESTEPS BOTH horns of imp-96812: horn A (no uniform one-sided sign) is irrelevant because the two-sided envelope needs no one-sidedness, and horn B (per-lag sign uncertifiable) is irrelevant because no partition is needed -- the envelope covers both signs at once. The residual obstruction MIGRATES to the two items imp-96593 already isolated as NOT DeltaCov-sign: (i) an interval-certified Sigma^2(L) (here the 6-digit GUE match 0.974834, not yet an enclosure) and (iii) GUE throughout; obstruction (ii) (the one-sided finite-L correction sign) is now DISCHARGED by the two-sided envelope and no longer blocks. Assessment + derivation only; conditional on the GUE sine kernel / Montgomery pair correlation for the zeta zeros (UNPROVEN); changes no unconditional bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 / imp-96593 / imp-96628 / imp-96812 convention).
export const IMP96853_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment + derivation: the VIF-upper-bound route is '
  + 'NOT closed. The literal per-lag sign-partition is unavailable (imp-96812 horn B) but unnecessary -- '
  + 'the imp-96628 TWO-SIDED envelope |DeltaCov_k| <= C(k)/L^2 bounds every lag k >= 2 regardless of sign, '
  + 'so rho_k(L) <= rho_k(inf) + C(k)/(L^2 Sigma^2) and the wrong-sign (positive-DeltaCov) lags k = 3,4,5 '
  + 'are absorbed into a slack summed over the whole window of only 5.65e-8 (~7.5e-7 of the rho_1 head), '
  + 'so they do NOT overwhelm the budget. Rigorous conditional bound VIF_291 <= 0.005463 (z >= 26.02). This '
  + 'sidesteps both imp-96812 horns; the residual is an interval Sigma^2(L) and GUE. Conditional on the pair '
  + 'correlation for the zeta zeros (UNPROVEN); changes no unconditional bound.';

// --- self-executing internal-consistency assertions (re-derivation; no zeros, no offline script) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // 1. Reproduce the standing imp-96593 literals (head, actual finite-window value).
  if (!approx(VIF_HEAD, 0.075232, 1e-5)) throw new Error('imp-96853: rho_1-only head VIF drifted from 0.0752');
  if (!approx(VIF_ACTUAL, 0.005463, 1e-5)) throw new Error('imp-96853: actual finite-window VIF drifted from 0.0055');
  if (!approx(zFromVif(VIF_ACTUAL), 26.02, 5e-2)) throw new Error('imp-96853: actual finite-window z drifted from 26.0');

  // 2. Reproduce the imp-96628 certified envelope constant C(2) = 3/(8 pi^4).
  if (!approx(envelopeConst(2), 3 / (8 * Math.pow(PI, 4)), 1e-15))
    throw new Error('imp-96853: C(2) must equal 3/(8 pi^4) = 3.8497e-3 (imp-96628)');

  // 3. THE CORE FINDING: the two-sided envelope slack summed over the whole window is negligible --
  //    the positive-DeltaCov lags do NOT overwhelm the VIF budget.
  if (!approx(slackSum, 5.65e-8, 1e-9)) throw new Error('imp-96853: envelope-slack sum drifted from 5.65e-8');
  if (!(slackSum / VIF_HEAD < 1e-6)) throw new Error('imp-96853: slack must be < 1e-6 of the rho_1 head (does not overwhelm the budget)');
  if (!(slackSum / VIF_ACTUAL < 1e-4)) throw new Error('imp-96853: slack must stay well below the finite-window value');
  if (IMP96853_VIF_TWOSIDED_ENVELOPE_PARTITION_ASSESSMENT.positiveLagsOverwhelmBudget !== false)
    throw new Error('imp-96853: positive-lag contributions must be recorded as NOT overwhelming the budget');

  // 4. The envelope bound is a VALID UPPER bound and it lands essentially at the finite-window value.
  if (!(VIF_ENV >= VIF_ACTUAL)) throw new Error('imp-96853: the envelope bound must be >= the closed-form value (upper bound)');
  if (!(VIF_ENV < VIF_HEAD)) throw new Error('imp-96853: the envelope bound must still sit below the rho_1-only head');
  if (!approx(VIF_ENV, 0.0054629, 1e-6)) throw new Error('imp-96853: envelope-bounded VIF drifted from 0.0054629');
  if (!approx(Z_ENV, 26.023, 1e-2)) throw new Error('imp-96853: envelope-bounded z drifted from 26.02');

  // 5. The per-lag two-sided upper bound rho_k(inf) + C(k)/(L^2 Sigma^2) genuinely covers both signs:
  //    it must exceed the closed form at every lag (so it is safe for the negative-DeltaCov lags too).
  for (const k of [2, 3, 4, 5, 6]) {
    const upper = rhoClosed(k) + envelopeConst(k) / (L * L) / SIGMA2;
    if (!(upper > rhoClosed(k))) throw new Error('imp-96853: two-sided upper bound must exceed the closed form at k = ' + k);
    if (!(envelopeConst(k) / (L * L) / SIGMA2 > 0)) throw new Error('imp-96853: envelope slack must be positive at k = ' + k);
  }

  // 6. C(k) decays with the lag (leading 1/(k-1)^2 term shrinks), so small-k lags dominate the slack.
  for (const k of [3, 4, 5, 6])
    if (!(envelopeConst(k) < envelopeConst(k - 1))) throw new Error('imp-96853: C(k) must decrease with lag k');

  // honesty gates
  if (!/NO QED/.test(IMP96853_VIF_TWOSIDED_ENVELOPE_PARTITION_ASSESSMENT.verdict))
    throw new Error('imp-96853: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96853_VIF_TWOSIDED_ENVELOPE_PARTITION_ASSESSMENT.verdict))
    throw new Error('imp-96853: verdict dropped the no-refereed-bound-change banner');
  if (!/[Cc]onditional/.test(IMP96853_VIF_TWOSIDED_ENVELOPE_PARTITION_ASSESSMENT.verdict))
    throw new Error('imp-96853: verdict must flag the result as CONDITIONAL');
  if (!(/RH open/.test(IMP96853_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96853_HONEST_BANNER) && /NO QED/.test(IMP96853_HONEST_BANNER)))
    throw new Error('imp-96853: IMP96853_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96853_VIF_TWOSIDED_ENVELOPE_PARTITION_ASSESSMENT;
