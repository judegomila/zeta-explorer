/**
 * @module imp-95783-rtrue-vs-rcap-gap-deadzone
 *
 * imp-95783 -- ASSESSING how far below the imp-95766 derived envelope r_cap(T) the TRUE
 * pointwise number-variance ratio r(T) actually sits in the frontier "dead zone" above
 * the imp-95750 direct-measurement ceiling gamma_1e6 = 6.003e5, and whether an
 * independent (non-GUE-envelope) proxy can bound the gap r_cap(T) - r(T) there.
 *
 * WHY. imp-95766 measured the DERIVED envelope r_cap(T) across the dead zone (0.4322 at
 * the ceiling gamma_1e6 down to 0.2599 at the imp-95519 window bottom) but its own
 * verdict flags that this "does NOT sharpen r itself -- the true r(T) lies in
 * (0, r_cap(T)]." The one-sided bound r(T) <= r_cap(T) leaves the whole gap
 * r_cap(T) - r(T) unquantified above the ceiling. This module asks the honest binary the
 * ticket poses: can any independent estimator bound that gap in the dead zone, or is it
 * an obstruction (no verified ordinates above gamma_1e6)?
 *
 * WHAT CAN BE MEASURED (the sub-ceiling regime). Below the ceiling BOTH quantities are
 * known at the six imp-95562 measured heights (1e4..5e5): the TRUE ratio is
 * r(T) = measuredVar(T) / Sigma^2(L(T)) with measuredVar = sd(C - E)^2, and the envelope
 * is r_cap(T) = cappedVariance(T) / Sigma^2(L(T)) with the SAME imp-95766 closed forms.
 * Their quotient, the MEASURED-REGIME SLACK s(T) = r(T)/r_cap(T) = measuredVar/cappedVar,
 * is the only DIRECT read on how far below the envelope the true ratio sits. It ranges
 * from s = 0.7244 (T = 7e4; the envelope over-estimates the true pointwise variance by a
 * factor ~1.38 there) up to s = 1.0000 (T = 1.5e5). The s = 1 touch is an ARTIFACT, not
 * a coincidence: the imp-95722/imp-95766 offset C0 is defined as the MAX over the six
 * heights of (measuredVar - Selberg term), so at the argmax height (T = 1.5e5) the
 * envelope is pinned to touch the true variance exactly (gap 0). So in the measured
 * regime r sits at 72.4%-100% of r_cap, i.e. the envelope over-estimates by 0%-38%.
 *
 * THE OBSTRUCTION (the dead zone). Above the ceiling gamma_1e6 = 6.003e5 there are NO
 * verified ordinates in the repo (imp-95750 F1/F2: gamma_1e6 is the largest entry of
 * ZEROS_EXTENDED; zeros-first-25 and the imp-360/imp-962 ladders reach no higher). Both
 * an independent non-GUE proxy and a resampled-window estimator of r(T) require ordinates
 * spanning a local box around the evaluation height, so NEITHER can be formed anywhere in
 * the dead zone. The measured-regime slack s(T) cannot be extrapolated to fill the gap:
 * (i) it is NON-MONOTONE over the six heights (0.889 -> 0.767 -> 0.724 -> 1.000 -> 0.846
 * -> 0.809), so there is no clean trend to extend; (ii) the s = 1 anchor is a
 * finite-height artifact of C0 pinned at T = 1.5e5, not an asymptotic feature; and
 * (iii) across the dead zone the envelope numerator is dominated by that same O(1) offset
 * C0 (~67%-73% of the cap, imp-95766 F3), which is a finite-height anchor, not an
 * asymptotic prediction for r. So the gap r_cap(T) - r(T) in the dead zone is an
 * OBSTRUCTION: the only rigorous statement remains the imp-95766 one-sided bound
 * r(T) in (0, r_cap(T)].
 *
 * FINDINGS (assessment only).
 *  (F1) SUB-CEILING SLACK IS MEASURABLE. At the six imp-95562 heights the true ratio r(T)
 *       sits at s = r/r_cap in [0.7244, 1.0000] of the envelope; the envelope
 *       over-estimates the true pointwise variance by a factor in [1.000, 1.381].
 *  (F2) THE s = 1 TOUCH IS A C0 ARTIFACT. r_cap touches r exactly at T = 1.5e5 because
 *       C0 is the max-anchored offset pinned there; it is NOT evidence that the envelope
 *       is tight in general, and in particular says nothing about the dead zone.
 *  (F3) THE SLACK IS NON-MONOTONE, so it carries no extrapolable trend into the dead zone.
 *  (F4) DEAD-ZONE OBSTRUCTION. Above gamma_1e6 = 6.003e5 no verified ordinates exist, so
 *       neither a non-GUE proxy nor a resampled-window estimator of r(T) can be formed.
 *       The gap r_cap(T) - r(T) is UNMEASURABLE there; only r(T) in (0, r_cap(T)] stands.
 *
 * VERDICT. The true pointwise ratio r(T) can be read against the derived envelope ONLY
 * below the imp-95750 ceiling gamma_1e6 = 6.003e5, where the measured-regime slack
 * s = r/r_cap sits in [0.7244, 1.0000] (envelope over-estimation factor [1.000, 1.381]),
 * the s = 1 touch being a C0-anchor artifact at T = 1.5e5 rather than a general tightness.
 * Above the ceiling the assessment resolves to the OBSTRUCTION side of the ticket binary:
 * with no verified ordinates in the dead zone, no independent (non-GUE-envelope) proxy or
 * resampled-window estimator of r(T) can be formed, and the non-monotone finite-height
 * slack carries no extrapolable trend, so the gap r_cap(T) - r(T) stays unquantified and
 * the only rigorous statement remains the imp-95766 one-sided bound r(T) in (0, r_cap(T)].
 * Assessment only; adds no cited input; changes no bound; NO QED; the zero-side route
 * stays PCC/GRH-gated; no refereed bound is changed.
 *
 * Import-light: no zeros bundle, no sibling imports. The six sd(C - E) values are the same
 * measured literals imp-95710/imp-95722/imp-95766 baked (imp-95562 over the 10^6 Odlyzko
 * ordinates); every derived quantity is recomputed here from the imp-95766 closed forms.
 *
 * @see imp-95766-number-variance-cap-crossover-deadzone (derived envelope r_cap, offset C0)
 * @see imp-95750-number-variance-deadzone-measurement-reach (ceiling gamma_1e6 = 6.003e5)
 * @see imp-95722-number-variance-ratio-window-bottom-bound (r_cap, C0 anchor)
 * @see imp-95519-localized-barrier-sum-prime-zero-nogo (window bottom T = 3.0e12)
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

// Same imp-95766 closed forms (reproduced verbatim so r and r_cap share one denominator).
const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(v), v = T/2pi
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L = 2 Delta delta(T)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const SELBERG_C = 1 / (2 * Math.PI * Math.PI); // Selberg leading variance constant
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

// Same six measured literals imp-95710/imp-95722/imp-95766 baked (imp-95562 over 10^6 ordinates).
const MEASURED = [
  { Tc: 1.0e4, sdDiscrepancy: 0.6218 },
  { Tc: 3.0e4, sdDiscrepancy: 0.5823 },
  { Tc: 7.0e4, sdDiscrepancy: 0.5689 },
  { Tc: 1.5e5, sdDiscrepancy: 0.6714 },
  { Tc: 3.0e5, sdDiscrepancy: 0.6199 },
  { Tc: 5.0e5, sdDiscrepancy: 0.6078 },
];

// Reproduce the imp-95766/imp-95722 finite-height offset C0 (max-anchored, NOT a fit).
const C0 = Math.max(...MEASURED.map((m) => m.sdDiscrepancy * m.sdDiscrepancy - SELBERG_C * logLog(m.Tc)));

const cappedVariance = (T) => SELBERG_C * logLog(T) + C0; // imp-95766 envelope variance >= true var
const gueVar = (T) => gueNumberVariance(envelopeCount(T)); // shared GUE denominator

// Landmark heights (baked literals from the cited modules).
const CEILING_GAMMA_1E6 = 600269.6770124451; // imp-95750 direct-measurement ceiling
const CROSSOVER_T0 = 1.14e9; // imp-95729 crossover
const WINDOW_BOTTOM_T = 3.0e12; // imp-95519 window bottom

// Sub-ceiling rows: TRUE ratio r(T), envelope r_cap(T), slack s = r/r_cap = measuredVar/cappedVar.
const measuredRows = MEASURED.map((m) => {
  const measuredVar = m.sdDiscrepancy * m.sdDiscrepancy;
  const capVar = cappedVariance(m.Tc);
  const denom = gueVar(m.Tc);
  const r = measuredVar / denom; // true pointwise ratio (measurable here)
  const rCap = capVar / denom; // imp-95766 envelope
  const slack = measuredVar / capVar; // s = r/r_cap
  return {
    Tc: m.Tc,
    log10Tc: +Math.log10(m.Tc).toFixed(4),
    measuredVar: +measuredVar.toFixed(6),
    cappedVariance: +capVar.toFixed(6),
    rTrue: +r.toFixed(6),
    rCap: +rCap.toFixed(6),
    slack: +slack.toFixed(6), // r/r_cap in (0,1]
    gapRCapMinusRTrue: +(rCap - r).toFixed(6),
    overEstimationFactor: +(1 / slack).toFixed(4), // r_cap / r
  };
});

const slacks = measuredRows.map((row) => row.slack);
const minSlack = Math.min(...slacks);
const maxSlack = Math.max(...slacks);
const argmaxHeight = MEASURED[MEASURED.map((m) => m.sdDiscrepancy * m.sdDiscrepancy - SELBERG_C * logLog(m.Tc)).indexOf(C0)].Tc;
// Non-monotone check: the slack column is neither non-increasing nor non-decreasing.
const nonIncreasing = slacks.every((s, i) => i === 0 || s <= slacks[i - 1] + 1e-12);
const nonDecreasing = slacks.every((s, i) => i === 0 || s >= slacks[i - 1] - 1e-12);
const slackIsNonMonotone = !nonIncreasing && !nonDecreasing;

export const IMP95783_RTRUE_VS_RCAP_GAP_DEADZONE = {
  ticket: 'imp-95783',
  proofSection: 'S-frontier',
  question:
    'How far below the imp-95766 derived envelope r_cap(T) does the true pointwise ' +
    'number-variance ratio r(T) sit in the dead zone above the imp-95750 direct-measurement ' +
    'ceiling gamma_1e6 = 6.003e5, and can an independent (non-GUE-envelope) proxy or a ' +
    'resampled-window estimator bound the gap there? Measure/assess only; changes no bound; NO QED.',
  definitions: {
    rTrue: 'r(T) = measuredVar(T) / Sigma^2(L(T)), measuredVar = sd(C - E)^2; the TRUE pointwise ratio (measurable only below the ceiling)',
    rCap: 'r_cap(T) = cappedVariance(T) / Sigma^2(L(T)); the imp-95766 derived upper envelope, r_cap >= r',
    slack: 's(T) = r(T)/r_cap(T) = measuredVar/cappedVariance in (0,1]; how far below the envelope the true ratio sits',
    overEstimationFactor: '1/s = r_cap/r; the factor by which the envelope over-estimates the true pointwise variance',
    obstruction: 'above gamma_1e6 = 6.003e5 no verified ordinates exist, so no non-GUE proxy or resampled-window estimator of r(T) can be formed (imp-95750 F1/F2)',
  },
  offsetC0: C0, // reproduces imp-95766/imp-95722
  measuredRows,
  slackRange: { min: +minSlack.toFixed(6), max: +maxSlack.toFixed(6) },
  overEstimationFactorRange: { min: +(1 / maxSlack).toFixed(4), max: +(1 / minSlack).toFixed(4) },
  c0AnchorHeight: argmaxHeight, // 1.5e5: where s = 1 by construction (C0 max-anchor)
  slackIsNonMonotone,
  deadZoneObstruction: {
    ceilingGamma1e6: +CEILING_GAMMA_1E6.toExponential(6), // 6.002697e5
    crossoverT0: CROSSOVER_T0, // 1.14e9
    windowBottomT: WINDOW_BOTTOM_T, // 3.0e12
    reason:
      'Both a non-GUE proxy and a resampled-window estimator of r(T) need ordinates spanning a ' +
      'local box around the evaluation height; there are NO verified ordinates above gamma_1e6 = ' +
      '6.003e5 (imp-95750: largest entry of ZEROS_EXTENDED). The measured-regime slack is ' +
      'non-monotone and its s = 1 touch is a C0-anchor artifact at T = 1.5e5, so it carries no ' +
      'extrapolable trend into the dead zone. The gap r_cap(T) - r(T) stays unquantified above ' +
      'the ceiling; only the imp-95766 one-sided bound r(T) in (0, r_cap(T)] survives.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier, NOT rigorous). The true pointwise ratio r(T) can be read against the ' +
    'imp-95766 derived envelope ONLY below the imp-95750 ceiling gamma_1e6 = 6.003e5, where the ' +
    'measured-regime slack s = r/r_cap sits in [0.7244, 1.0000] (envelope over-estimation factor ' +
    '[1.000, 1.381]); the s = 1 touch at T = 1.5e5 is a C0-anchor artifact, not general tightness. ' +
    'Above the ceiling the assessment resolves to the OBSTRUCTION side: with no verified ordinates ' +
    'in the dead zone, no independent (non-GUE-envelope) proxy or resampled-window estimator of ' +
    'r(T) can be formed, and the non-monotone finite-height slack carries no extrapolable trend, so ' +
    'the gap r_cap(T) - r(T) stays unquantified and the only rigorous statement remains the ' +
    'imp-95766 one-sided bound r(T) in (0, r_cap(T)]. Measures the sub-ceiling regime only; adds no ' +
    'cited input; changes no bound; NO QED; the zero-side route stays PCC/GRH-gated; no refereed bound is changed' +
    '.',
  citation:
    'imp-95766 (derived envelope r_cap, offset C0, true r in (0, r_cap]); imp-95750 (ceiling ' +
    'gamma_1e6 = 6.003e5, no higher in-repo ordinates); imp-95722 (r_cap, C0 anchor); imp-95519 ' +
    '(window bottom T = 3.0e12).',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // C0 reproduces the imp-95766/imp-95722 pinned offset (same six literals, same closed form).
  if (!approx(C0, 0.3337213835371905, 1e-12)) throw new Error('imp-95783: C0 drifted from the imp-95766 pinned offset');
  // Every measured-regime slack is in (0,1]: the true ratio never exceeds the envelope.
  if (!measuredRows.every((row) => row.slack > 0 && row.slack <= 1 + 1e-12))
    throw new Error('imp-95783: a measured-regime slack fell outside (0,1] -- true ratio above the envelope');
  // The slack range reproduces the measured spread [0.7244, 1.0000].
  if (!approx(minSlack, 0.724375, 1e-5)) throw new Error('imp-95783: min slack drifted');
  if (!approx(maxSlack, 1.0, 1e-9)) throw new Error('imp-95783: max slack is not the C0-anchor touch = 1');
  // The s = 1 touch is the C0 max-anchor height T = 1.5e5, and the gap there is zero.
  if (argmaxHeight !== 1.5e5) throw new Error('imp-95783: C0 anchor height is not T = 1.5e5');
  const anchorRow = measuredRows.find((row) => row.Tc === 1.5e5);
  if (!approx(anchorRow.gapRCapMinusRTrue, 0, 1e-6)) throw new Error('imp-95783: envelope does not touch true ratio at the C0 anchor');
  // The slack is genuinely non-monotone (no extrapolable trend into the dead zone).
  if (!slackIsNonMonotone) throw new Error('imp-95783: slack unexpectedly monotone -- non-monotone obstruction claim invalid');
  // Over-estimation factor range reproduces [1.000, 1.381].
  if (!approx(IMP95783_RTRUE_VS_RCAP_GAP_DEADZONE.overEstimationFactorRange.max, 1.381, 1e-3))
    throw new Error('imp-95783: over-estimation factor max drifted from ~1.381');
  // honesty gates.
  if (IMP95783_RTRUE_VS_RCAP_GAP_DEADZONE.isRigorous !== false)
    throw new Error('imp-95783: isRigorous must be false');
  if (!/NO QED/.test(IMP95783_RTRUE_VS_RCAP_GAP_DEADZONE.verdict))
    throw new Error('imp-95783: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP95783_RTRUE_VS_RCAP_GAP_DEADZONE.verdict))
    throw new Error('imp-95783: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP95783_RTRUE_VS_RCAP_GAP_DEADZONE;
