/**
 * imp-96267 -- EXTRAPOLATE the imp-96150/imp-96177 monotone two-interval covariance drift and
 * MEASURE the height at which the exact GUE adjacent-box correlation rho_exact first reaches within
 * epsilon of the GUE-rigidity limit -1/2.
 *
 * WHAT imp-96150/imp-96177 LEFT OPEN. imp-96150 tabulated the exact GUE two-interval count
 * correlation rho_exact = Sigma^2(2L)/(2 Sigma^2(L)) - 1 at the five imp-96090 held-out heights
 * {2e4, 5e4, 1e5, 2e5, 4e5} and found it drifts monotonically from -0.4587 to -0.4660, "slowly toward
 * the GUE-rigidity limit -1/2" (imp-96177 headword). Neither module said HOW slowly: at what height the
 * drift would actually put rho_exact within a chosen epsilon of -1/2. This module COMPUTES (does not
 * fit) rho_exact on a decade ladder of heights out to 1e12+ and reports the crossing heights for
 * epsilon in {1e-2, 1e-3}, using the SAME closed form as imp-96150.
 *
 * THE DRIFT HAS AN EXACT CLOSED FORM (why the reach is astronomically far). With the sine-kernel
 * number variance Sigma^2(L) = (log(2pi L) + gamma + 1)/pi^2, the deviation from the rigidity limit
 * collapses to a one-line identity:
 *     rho_exact + 1/2 = (Sigma^2(2L) - Sigma^2(L)) / (2 Sigma^2(L))
 *                     = (log 2 / pi^2) / (2 Sigma^2(L))
 *                     = (log 2) / (2 (log(2pi L) + gamma + 1)).
 * (The numerator Sigma^2(2L) - Sigma^2(L) is EXACTLY log2/pi^2 because doubling L adds only log2 to the
 * logarithmic variance.) So the approach to -1/2 is governed by 1/log(2pi L), and since
 * L ~ sqrt(T/2pi) log(T/2pi)/pi grows like sqrt(T), log(2pi L) ~ (1/2) log T: the deviation decays
 * like 1/log T -- the slowest possible envelope. Reaching |rho_exact + 1/2| < epsilon requires
 * log(2pi L) + gamma + 1 > log2/(2 epsilon), i.e. a height T that is EXPONENTIALLY large in 1/epsilon.
 *
 * FINDINGS.
 *  1. THE DECADE LADDER CONFIRMS THE MONOTONE, LOGARITHMICALLY-SLOW DRIFT. rho_exact at
 *     T = 1e4..1e12 runs -0.45643, -0.46304, -0.46774, -0.47129, -0.47408, -0.47635, -0.47823,
 *     -0.47982, -0.48118 -- monotone toward -1/2, but the deviation |rho_exact + 1/2| only falls from
 *     0.0436 to 0.0188 across EIGHT decades. It roughly halves per ~8 decades, exactly the 1/log T law.
 *  2. THE epsilon = 1e-2 REACH IS T ~ 2.6e25 (log10 T ~ 25.42). Even to bring the correlation within
 *     0.01 of the rigidity limit takes a height ~13 orders of magnitude beyond the Platt-Trudgian
 *     verified height 3e12 (where rho_exact is still -0.4818, deviation 0.0182 -- not even within 1e-2).
 *  3. THE epsilon = 1e-3 REACH IS T ~ 1.6e294 (log10 T ~ 294.2). Tightening the target tenfold pushes
 *     the required height up by ~269 further decades: the exponential-in-1/epsilon blow-up in full force.
 *     There is no accessible height (verified or plausibly reachable) at which rho_exact is within 1e-3
 *     of -1/2.
 *
 * INTERPRETATION. The "drifts monotonically toward -1/2" observation of imp-96150/imp-96177 is exactly
 * right but the drift is a 1/log T crawl: the GUE-rigidity limit is a genuine asymptote that the finite
 * height accessible-band correlation never operationally reaches. This does NOT weaken the imp-96128
 * anti-correlation verdict (rho_exact is strongly negative and safe-side at every finite height); it
 * quantifies just how far off the -1/2 endpoint sits, and confirms the accessible-band value ~-0.46..
 * -0.48 is the operative correlation for any real census, not the -1/2 idealization.
 *
 * HONEST CAVEAT. rho_exact is the THEORETICAL GUE (sine-kernel, universality) two-interval correlation
 * for boxes of unfolded length L(T); the crossing heights are properties of that closed-form envelope,
 * not measurements of the actual Riemann zeros (which exist to no such height). This is a pure
 * extrapolation of the imp-96150 formula. It changes no bound, establishes no operator positivity, and
 * does not touch the ~1.9-sigma excursion confidence.
 *
 * VERDICT. The exact GUE two-interval correlation rho_exact drifts toward the rigidity limit -1/2 like
 * (log 2)/(2 log(2pi L)) ~ 1/log T -- the slowest possible envelope. On a decade ladder to 1e12 the
 * deviation |rho_exact + 1/2| only falls 0.0436 -> 0.0188; reaching within 1e-2 of -1/2 needs
 * T ~ 2.6e25 (~13 decades past the Platt-Trudgian verified 3e12), and within 1e-3 needs T ~ 1.6e294.
 * The rigidity limit is an asymptote no accessible height reaches. Measurement/documentation only;
 * changes no bound; establishes no operator positivity; RH open; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96150-number-variance-two-interval-covariance-heldout-heights (the five held-out heights and the exact closed form)
 * @see imp-96177-heldout-covariance-uniformity-glossary-headword ("drifting monotonically toward the GUE-rigidity limit -1/2")
 * @see imp-96128-number-variance-two-interval-covariance-exact (the single-height exact covariance and safe-side verdict)
 *
 * Import-light: no zeros bundle, no sibling imports. The number-variance and unfolded-length formulas
 * are re-derived verbatim from imp-96150 (the same sine-kernel closed form).
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5; // the GUE-rigidity two-interval correlation asymptote

// Formulas identical to imp-96150 (no re-import, to stay import-light).
const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(T/2pi)
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L zeros per box
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI); // Sigma^2(L)
const rhoExactAt = (T) => {
  const L = envelopeCount(T);
  return gueNumberVariance(2 * L) / (2 * gueNumberVariance(L)) - 1;
};
const deviationAt = (T) => Math.abs(rhoExactAt(T) - RIGIDITY_LIMIT); // |rho_exact + 1/2|

// The one-line closed form for the deviation (log2 / (2 (log(2pi L) + gamma + 1))), used as an
// internal cross-check against the direct rho_exact - (-1/2) evaluation.
const deviationClosedForm = (T) => {
  const L = envelopeCount(T);
  return Math.LN2 / (2 * (Math.log(TWO_PI * L) + EULER + 1));
};

// The decade ladder out to 1e12 plus the Platt-Trudgian verified-height anchor 3e12.
const LADDER_HEIGHTS = [1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 3e12];

const ladder = LADDER_HEIGHTS.map((T) => {
  const rhoExact = rhoExactAt(T);
  return {
    T,
    zerosPerBox: envelopeCount(T),
    rhoExact,
    deviation: Math.abs(rhoExact - RIGIDITY_LIMIT),
    isPlattTrudgianAnchor: T === 3e12,
  };
});

// deviation(T) is smooth and strictly decreasing in T, so a log10-T bisection isolates the crossing
// where |rho_exact + 1/2| first falls below a target epsilon.
const crossingLog10 = (epsilon) => {
  let lo = 4; // deviation(1e4) ~ 0.044 > any target here
  let hi = 500; // deviation(1e500) far below 1e-3
  for (let i = 0; i < 200; i += 1) {
    const mid = (lo + hi) / 2;
    if (deviationAt(Math.pow(10, mid)) > epsilon) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
};

const EPSILONS = [1e-2, 1e-3];
const crossings = EPSILONS.map((epsilon) => {
  const log10T = crossingLog10(epsilon);
  return {
    epsilon,
    log10Height: log10T,
    height: Math.pow(10, log10T),
    decadesPastPlattTrudgian: log10T - Math.log10(3e12),
  };
});

// imp-96305: TABULATE the deviationClosedForm-vs-direct cross-check across the FULL reach range
// T = 1e4..1e294 (the same decade span over which the epsilon = 1e-3 crossing lives), so the identity
// deviation(T) = deviationClosedForm(T) is a checked, exported claim rather than only a code comment.
// The two are algebraically identical (Sigma^2(2L) - Sigma^2(L) is exactly log2/pi^2), so any gap is
// pure floating-point roundoff. maxRelDiscrepancy is the worst relative gap over the whole ladder.
const CROSS_CHECK_LOG10 = [];
for (let e = 4; e <= 294; e += 1) CROSS_CHECK_LOG10.push(e);
const closedFormCrossCheck = (() => {
  let maxRel = 0;
  let maxAbs = 0;
  let maxRelLog10 = CROSS_CHECK_LOG10[0];
  for (const e of CROSS_CHECK_LOG10) {
    const T = Math.pow(10, e);
    const direct = deviationAt(T);
    const closed = deviationClosedForm(T);
    const abs = Math.abs(direct - closed);
    const rel = abs / Math.abs(closed);
    if (rel > maxRel) {
      maxRel = rel;
      maxRelLog10 = e;
    }
    if (abs > maxAbs) maxAbs = abs;
  }
  return {
    log10RangeStart: CROSS_CHECK_LOG10[0],
    log10RangeEnd: CROSS_CHECK_LOG10[CROSS_CHECK_LOG10.length - 1],
    rungs: CROSS_CHECK_LOG10.length,
    maxRelDiscrepancy: maxRel,
    maxAbsDiscrepancy: maxAbs,
    maxRelAtLog10Height: maxRelLog10,
    note: 'deviationClosedForm(T) = log2/(2(log(2pi L)+gamma+1)) reproduces the direct |rho_exact - (-1/2)| to floating-point precision across all 291 decade rungs T = 1e4..1e294; the ~1.5e-13 max relative gap is pure roundoff, confirming the closed form is an exact identity, not an approximation.',
  };
})();

export const IMP96267_COVARIANCE_DRIFT_RIGIDITY_LIMIT_REACH = {
  ticket: 'imp-96267',
  source:
    'imp-96150/imp-96177 reported rho_exact = Sigma^2(2L)/(2 Sigma^2(L)) - 1 drifts monotonically from -0.4587 to -0.4660 across the five imp-96090 held-out heights {2e4..4e5}, "slowly toward the GUE-rigidity limit -1/2", without quantifying the height at which the drift reaches within epsilon of -1/2. This module COMPUTES (does not fit) rho_exact on a decade ladder to 1e12+ and reports the epsilon-reach crossings via the same closed form.',
  definitions: {
    rhoExact: 'rho_exact(T) = Sigma^2(2L)/(2 Sigma^2(L)) - 1, L = 2 Delta delta(T), the exact GUE adjacent-box lag-1 correlation (imp-96150)',
    deviation: '|rho_exact(T) - (-1/2)|: distance to the GUE-rigidity limit; closed form log2/(2 (log(2pi L) + gamma + 1)) ~ 1/log T',
    crossing: 'the smallest height T at which the deviation first falls below a target epsilon (log10-T bisection on the monotone deviation)',
  },
  rigidityLimit: RIGIDITY_LIMIT,
  closedForm: 'rho_exact + 1/2 = (Sigma^2(2L) - Sigma^2(L))/(2 Sigma^2(L)) = (log 2)/(2 (log(2pi L) + gamma + 1)); numerator is exactly log2/pi^2 since doubling L adds only log2 to the log variance',
  plattTrudgianAnchor: { T: 3e12, rhoExact: rhoExactAt(3e12), deviation: deviationAt(3e12) },
  ladder: ladder.map((r) => ({
    T: r.T,
    zerosPerBox: r.zerosPerBox,
    rhoExact: r.rhoExact,
    deviation: r.deviation,
    isPlattTrudgianAnchor: r.isPlattTrudgianAnchor,
  })),
  crossings,
  closedFormCrossCheck,
  caveat:
    'rho_exact is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L(T), not a measurement of the actual Riemann zeros (which exist to no such height). The crossing heights are properties of the closed-form envelope -- a pure extrapolation of the imp-96150 formula -- not empirical covariances. This changes no bound and does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'The exact GUE two-interval correlation rho_exact drifts toward the rigidity limit -1/2 like (log 2)/(2 log(2pi L)) ~ 1/log T -- the slowest possible envelope. On a decade ladder to 1e12 the deviation only falls 0.0436 -> 0.0188; reaching within 1e-2 of -1/2 needs T ~ 2.6e25 (~13 decades past the Platt-Trudgian verified 3e12, where rho_exact is still -0.4818), and within 1e-3 needs T ~ 1.6e294. The rigidity limit is an asymptote no accessible height reaches. Measurement/documentation only; changes no bound; establishes no operator positivity; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  const at = (T) => ladder.find((r) => r.T === T);

  // ladder has the 9-rung decade set plus the PT anchor
  if (ladder.length !== 10) throw new Error('imp-96267: expected 9 decade rungs plus the PT anchor');
  if (!ladder.some((r) => r.isPlattTrudgianAnchor)) throw new Error('imp-96267: PT anchor missing');

  // the closed form matches the direct rho_exact - (-1/2) evaluation everywhere (the key identity)
  for (const r of ladder) {
    if (!approx(r.deviation, deviationClosedForm(r.T), 1e-12))
      throw new Error(`imp-96267: closed-form deviation mismatch at T = ${r.T}`);
  }

  // imp-96305: the tabulated cross-check over the FULL reach range T = 1e4..1e294 confirms the
  // closed form is an EXACT identity -- worst relative gap is pure roundoff (~1.5e-13, well below 1e-12).
  if (closedFormCrossCheck.rungs !== 291)
    throw new Error('imp-96305: cross-check should span all 291 decade rungs 1e4..1e294');
  if (!(closedFormCrossCheck.maxRelDiscrepancy < 1e-12))
    throw new Error('imp-96305: closed-form vs direct max relative discrepancy should be roundoff (<1e-12)');
  if (!(closedFormCrossCheck.maxAbsDiscrepancy < 1e-14))
    throw new Error('imp-96305: closed-form vs direct max absolute discrepancy should be roundoff (<1e-14)');

  // ladder reproduces the offline census (matches the imp-96150 formula at the shared decade points)
  if (!approx(at(1e5).rhoExact, -0.463042, 1e-5)) throw new Error('imp-96267: T = 1e5 rho_exact drifted');
  if (!approx(at(1e6).rhoExact, -0.467737, 1e-5)) throw new Error('imp-96267: T = 1e6 rho_exact drifted');
  if (!approx(at(1e12).rhoExact, -0.481182, 1e-5)) throw new Error('imp-96267: T = 1e12 rho_exact drifted');

  // MONOTONE toward -1/2: deviation strictly decreasing across the decade ladder (exclude the 3e12 anchor)
  const decadeRows = ladder.filter((r) => !r.isPlattTrudgianAnchor);
  for (let i = 1; i < decadeRows.length; i += 1) {
    if (!(decadeRows[i].deviation < decadeRows[i - 1].deviation))
      throw new Error('imp-96267: deviation should decrease monotonically with height');
  }
  // and the total drop across eight decades is only ~0.025 (logarithmically slow)
  const drop = decadeRows[0].deviation - decadeRows[decadeRows.length - 1].deviation;
  if (!(drop > 0.02 && drop < 0.03)) throw new Error('imp-96267: eight-decade deviation drop should be ~0.025');

  // PT verified height is NOT even within 1e-2 of the rigidity limit
  if (!(deviationAt(3e12) > 1e-2)) throw new Error('imp-96267: PT anchor deviation should exceed 1e-2');

  // crossing heights: epsilon = 1e-2 near log10 T ~ 25.4, epsilon = 1e-3 near log10 T ~ 294.2
  const c2 = crossings.find((c) => c.epsilon === 1e-2);
  const c3 = crossings.find((c) => c.epsilon === 1e-3);
  if (!approx(c2.log10Height, 25.42, 0.1)) throw new Error('imp-96267: epsilon = 1e-2 crossing height drifted');
  if (!approx(c3.log10Height, 294.2, 0.5)) throw new Error('imp-96267: epsilon = 1e-3 crossing height drifted');
  // and both crossings are the correct side of epsilon (deviation just below at the crossing)
  if (!(deviationAt(Math.pow(10, c2.log10Height)) < 1e-2 + 1e-6))
    throw new Error('imp-96267: epsilon = 1e-2 crossing does not satisfy the target');
  // both are astronomically past the PT verified height
  if (!(c2.decadesPastPlattTrudgian > 10)) throw new Error('imp-96267: epsilon = 1e-2 reach should be >10 decades past PT');

  // honesty gates
  if (!/NO QED/.test(IMP96267_COVARIANCE_DRIFT_RIGIDITY_LIMIT_REACH.verdict))
    throw new Error('imp-96267: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96267_COVARIANCE_DRIFT_RIGIDITY_LIMIT_REACH.verdict))
    throw new Error('imp-96267: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96267_COVARIANCE_DRIFT_RIGIDITY_LIMIT_REACH;
