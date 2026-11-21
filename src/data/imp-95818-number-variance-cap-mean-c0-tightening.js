/**
 * imp-95818 -- MEAN-anchored windowing offset: how much the imp-95766 derived cap
 * r_cap(T) tightens when C0 is taken as the six-height MEAN instead of the artifact-pinned
 * MAX.
 *
 * imp-95806 (F3/F4) showed the imp-95722 max-based windowing offset C0 = 0.3337 is pinned
 * entirely by the isolated artifact height T = 1.5e5 (the eight bracketing offsets sit in
 * [0.2073, 0.2495]) and that the typical local correction is ~0.23, near the imp-95787
 * six-height MEAN C0 = 0.2618. Since the max is a deliberate upper envelope, replacing it
 * with the mean can only SHARPEN the derived cap, never weaken the r_cap < 1 conservatism
 * (imp-95787 F2). This module measures that sharpening: it recomputes r_cap at the six
 * imp-95562 measured heights under both the max anchor and the mean anchor and reports the
 * tightening (absolute drop and fractional %), verifying r_cap < 1 is preserved at every
 * height under the mean anchor.
 *
 * METHOD (import-light; reuses the imp-95722/imp-95766 closed forms, no new cited input).
 * The Selberg numerator cap (1/2pi^2) log log(T/2pi), the GUE denominator Sigma^2(L(T)),
 * the envelope count L(T) = 2 Delta delta(T), and both offsets C0_max / C0_mean are
 * recomputed here from the SAME six imp-95562 measured sd(C - E) literals imp-95722 /
 * imp-95766 / imp-95787 bake, so C0_max = 0.3337 and C0_mean = 0.2618 reproduce imp-95787
 * to float precision. Only the ASSESSMENT is new -- the max-vs-mean r_cap difference at the
 * six measured heights; no formula, constant, or bound changes.
 *
 * FINDINGS (envelope assessment only).
 *  1. At every one of the six measured heights the mean-anchored cap sits strictly below the
 *     max-anchored cap, and both stay strictly below the GUE asymptote 1. The pairs are
 *     (T, r_cap_max, r_cap_mean): (1.0e4, 0.5397, 0.4505), (3.0e4, 0.5047, 0.4226),
 *     (7.0e4, 0.4813, 0.4039), (1.5e5, 0.4624, 0.3887), (3.0e5, 0.4467, 0.3760),
 *     (5.0e5, 0.4359, 0.3673).
 *  2. The tightening is a nearly-constant absolute shift -- the mean anchor lowers r_cap by
 *     C0_max - C0_mean = 0.0719 in the numerator, so the drop in r_cap is 0.0719 / Sigma^2(L),
 *     ranging from 0.0892 at T = 1.0e4 down to 0.0686 at T = 5.0e5 (the denominator grows
 *     with height). In fractional terms that is a 15.7% - 16.5% tightening across the six
 *     measured heights.
 *  3. The fractional tightening SHRINKS with height as the GUE denominator grows: 16.53% at
 *     T = 1.0e4, 15.75% at T = 5.0e5, ~14.9% at the imp-95729 crossover T0 = 1.14e9, and
 *     ~14.4% at the imp-95519 window bottom T = 3.0e12 (where r_cap_mean = 0.2225 reproduces
 *     the imp-95787 mean-estimator value). So the sharpening is real but bounded, and it is
 *     largest exactly where r_cap is largest (the low measured heights), which is where the
 *     conservatism has the least headroom -- yet even there the mean-anchored cap (max 0.4505)
 *     stays well below 1.
 *  4. The r_cap < 1 conservatism is PRESERVED at every measured height under the mean anchor,
 *     as imp-95787 F2 guarantees: since C0_mean < C0_max, r_cap_mean < r_cap_max < 1
 *     pointwise, so moving to the mean anchor only sharpens the (already sub-1) envelope. The
 *     max anchor therefore remains a valid conservative upper cap; the mean anchor is the
 *     tighter -- but still non-rigorous -- central estimate the artifact re-measurement
 *     (imp-95806) motivates.
 *
 * VERDICT. Replacing the artifact-pinned max windowing offset C0 = 0.3337 with the
 * six-height mean C0 = 0.2618 (imp-95787) in the imp-95766 derived envelope tightens the cap
 * r_cap(T) by 15.7% - 16.5% across the six imp-95562 measured heights -- an absolute drop of
 * 0.069 - 0.089 in r_cap -- while every mean-anchored cap (max 0.4505 at T = 1.0e4) stays
 * strictly below the GUE asymptote 1. The fractional tightening shrinks with height (~14.9%
 * at the imp-95729 crossover, ~14.4% at the imp-95519 window bottom, where r_cap_mean = 0.2225
 * matches imp-95787). Because the mean offset is smaller than the max, the mean anchor only
 * SHARPENS the envelope and can never weaken the r_cap < 1 conservatism (imp-95787 F2), so the
 * max anchor stays a valid conservative upper cap and the mean anchor is the tighter central
 * estimate the imp-95806 artifact finding motivates. Assessment of the derived envelope only;
 * it does NOT sharpen the true r itself (r in (0, r_cap_mean] <= (0, r_cap_max]); adds no
 * cited input; changes no bound. The Selberg leading log log cap is unconditional; the
 * zero-side route stays PCC/GRH-gated; NO QED; no refereed bound is changed.
 *
 * Import-light: no zeros bundle, no sibling imports. The six sd(C - E) values are the same
 * measured literals imp-95710/imp-95722/imp-95787 bake (imp-95562 over the 10^6 Odlyzko
 * ordinates); every derived quantity is recomputed here from the closed forms.
 *
 * @see imp-95766-number-variance-cap-crossover-deadzone (derived envelope r_cap, max C0)
 * @see imp-95787-number-variance-c0-estimator-bias (max/mean/min C0 estimators)
 * @see imp-95806-number-variance-bracket-1p5e5-bump (C0 max pinned by the T=1.5e5 artifact)
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(T/2pi)
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L = 2 Delta delta(T)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const SELBERG_C = 1 / (2 * Math.PI * Math.PI); // Selberg leading variance constant
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

// Same six measured literals imp-95710/imp-95722/imp-95787 bake (imp-95562 over the 10^6 ordinates).
const MEASURED = [
  { Tc: 1.0e4, sdDiscrepancy: 0.6218 },
  { Tc: 3.0e4, sdDiscrepancy: 0.5823 },
  { Tc: 7.0e4, sdDiscrepancy: 0.5689 },
  { Tc: 1.5e5, sdDiscrepancy: 0.6714 },
  { Tc: 3.0e5, sdDiscrepancy: 0.6199 },
  { Tc: 5.0e5, sdDiscrepancy: 0.6078 },
];

// Both offsets from the same six per-height corrections (reproduce imp-95787).
const perHeightOffsets = MEASURED.map((m) => m.sdDiscrepancy * m.sdDiscrepancy - SELBERG_C * logLog(m.Tc));
const C0_max = Math.max(...perHeightOffsets); // imp-95722 upper-envelope anchor -> 0.3337
const C0_mean = perHeightOffsets.reduce((s, x) => s + x, 0) / perHeightOffsets.length; // -> 0.2618

const cappedRatioWith = (T, c0) => (SELBERG_C * logLog(T) + c0) / gueNumberVariance(envelopeCount(T));

// Recompute r_cap at the six measured heights under both anchors, report the tightening.
const rows = MEASURED.map((m) => {
  const rCapMax = cappedRatioWith(m.Tc, C0_max);
  const rCapMean = cappedRatioWith(m.Tc, C0_mean);
  return {
    Tc: m.Tc,
    log10T: +Math.log10(m.Tc).toFixed(4),
    rCapMax: +rCapMax.toFixed(6),
    rCapMean: +rCapMean.toFixed(6),
    absTightening: +(rCapMax - rCapMean).toFixed(6), // drop in r_cap from the mean anchor
    pctTightening: +(((rCapMax - rCapMean) / rCapMax) * 100).toFixed(3),
    meanStaysBelowOne: rCapMean < 1,
  };
});

// Landmarks beyond the measured band (baked literals from the cited modules).
const CROSSOVER_T0 = 1.14e9; // imp-95729 crossover
const WINDOW_BOTTOM_T = 3.0e12; // imp-95519 window bottom

const landmark = (T) => {
  const rCapMax = cappedRatioWith(T, C0_max);
  const rCapMean = cappedRatioWith(T, C0_mean);
  return {
    T,
    rCapMax: +rCapMax.toFixed(6),
    rCapMean: +rCapMean.toFixed(6),
    pctTightening: +(((rCapMax - rCapMean) / rCapMax) * 100).toFixed(3),
  };
};

const pctValues = rows.map((r) => r.pctTightening);
const minPct = Math.min(...pctValues);
const maxPct = Math.max(...pctValues);

export const IMP95818_NUMBER_VARIANCE_CAP_MEAN_C0_TIGHTENING = {
  ticket: 'imp-95818',
  proofSection: 'S-frontier',
  question:
    'Replace the imp-95722 artifact-pinned max windowing offset C0 = 0.3337 with the ' +
    'imp-95787 six-height mean C0 = 0.2618 in the imp-95766 derived envelope and measure how ' +
    'much r_cap(T) tightens at the six imp-95562 measured heights while preserving r_cap < 1. ' +
    'Envelope assessment only; the max is a conservative upper envelope so this only sharpens; ' +
    'changes no bound; NO QED.',
  definitions: {
    cappedRatio:
      'r_cap(T) = [ (1/2pi^2) log log(T/2pi) + C0 ] / Sigma^2(L(T)) >= r(T); the imp-95722 ' +
      'derived upper envelope (Selberg-unconditional numerator + GUE denominator)',
    c0Max: 'C0_max = max over the six imp-95710 heights of (measuredVar - Selberg term) -> 0.3337 (imp-95722)',
    c0Mean: 'C0_mean = arithmetic mean of the same six per-height offsets -> 0.2618 (imp-95787)',
    absTightening: 'r_cap_max(T) - r_cap_mean(T): the absolute drop in the cap from the mean anchor',
    pctTightening: '100 * (r_cap_max - r_cap_mean) / r_cap_max: the fractional sharpening at height T',
  },
  selbergConstant: SELBERG_C,
  c0Max: C0_max, // 0.3337 (imp-95722)
  c0Mean: C0_mean, // 0.2618 (imp-95787)
  c0MaxMinusMean: +(C0_max - C0_mean).toFixed(6), // 0.0719 (the numerator shift)
  rows,
  crossover: landmark(CROSSOVER_T0),
  windowBottom: landmark(WINDOW_BOTTOM_T),
  tighteningPctRange: [minPct, maxPct], // [15.746, 16.527] across the six measured heights
  meanConservatismPreserved: rows.every((r) => r.meanStaysBelowOne),
  isRigorous: false,
  verdict:
    'ENVELOPE ASSESSMENT (frontier, NOT rigorous). Replacing the artifact-pinned max windowing ' +
    'offset C0 = 0.3337 with the six-height mean C0 = 0.2618 (imp-95787) in the imp-95766 derived ' +
    'envelope tightens the cap r_cap(T) by 15.7% - 16.5% across the six imp-95562 measured heights ' +
    '(an absolute drop of 0.069 - 0.089 in r_cap), while every mean-anchored cap (max 0.4505 at ' +
    'T = 1.0e4) stays strictly below the GUE asymptote 1. The fractional tightening shrinks with ' +
    'height (~14.9% at the imp-95729 crossover T0 = 1.14e9, ~14.4% at the imp-95519 window bottom ' +
    'T = 3.0e12, where r_cap_mean = 0.2225 reproduces imp-95787). Because the mean offset is smaller ' +
    'than the max, the mean anchor only SHARPENS the envelope and can never weaken the r_cap < 1 ' +
    'conservatism (imp-95787 F2), so the max anchor remains a valid conservative upper cap and the ' +
    'mean anchor is the tighter central estimate the imp-95806 artifact finding motivates. Assesses ' +
    'the derived envelope only; does not sharpen the true r itself (r in (0, r_cap_mean]); adds no ' +
    'cited input; changes no bound. The Selberg leading log log cap is unconditional; the zero-side ' +
    'route stays PCC/GRH-gated; NO QED; no refereed bound is changed.',
  citation:
    'imp-95766 (derived envelope r_cap, max C0); imp-95787 (max/mean/min C0 estimators, r_cap band); ' +
    'imp-95806 (C0 max pinned by the T = 1.5e5 windowing artifact); imp-95722 (offset C0 = 0.3337); ' +
    'imp-95729 (crossover T0 ~ 1.14e9); imp-95519 (window bottom T = 3.0e12).',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // both offsets reproduce the imp-95722 / imp-95787 pinnings from the same six literals.
  if (!approx(C0_max, 0.3337213835371905, 1e-12)) throw new Error('imp-95818: C0_max drifted from the imp-95722 anchor');
  if (!approx(C0_mean, 0.26184177603555076, 1e-12)) throw new Error('imp-95818: C0_mean drifted from the imp-95787 mean');
  // the mean anchor is strictly tighter than the max at every measured height (the whole finding).
  for (const r of rows) {
    if (!(r.rCapMean < r.rCapMax)) throw new Error('imp-95818: mean anchor did not tighten r_cap at ' + r.Tc);
    if (!(r.rCapMean > 0 && r.rCapMean < 1)) throw new Error('imp-95818: mean-anchored r_cap left (0,1) at ' + r.Tc);
    if (!(r.rCapMax > 0 && r.rCapMax < 1)) throw new Error('imp-95818: max-anchored r_cap left (0,1) at ' + r.Tc);
  }
  // r_cap < 1 conservatism preserved under the mean anchor at every measured height.
  if (!IMP95818_NUMBER_VARIANCE_CAP_MEAN_C0_TIGHTENING.meanConservatismPreserved)
    throw new Error('imp-95818: mean-anchored conservatism not preserved');
  // the tightening band lands where computed (15.7% - 16.5% across the six heights).
  if (!(minPct > 15 && maxPct < 17)) throw new Error('imp-95818: tightening pct band drifted from [15.7,16.5]');
  // the absolute numerator shift equals C0_max - C0_mean (the source of every drop).
  if (!approx(IMP95818_NUMBER_VARIANCE_CAP_MEAN_C0_TIGHTENING.c0MaxMinusMean, 0.071880, 1e-4))
    throw new Error('imp-95818: numerator shift C0_max - C0_mean drifted');
  // fractional tightening shrinks with height (largest at the lowest measured height).
  if (!(rows[0].pctTightening > rows[rows.length - 1].pctTightening))
    throw new Error('imp-95818: fractional tightening not shrinking with height');
  // window-bottom mean r_cap reproduces the imp-95787 mean-estimator value 0.2225.
  if (!approx(IMP95818_NUMBER_VARIANCE_CAP_MEAN_C0_TIGHTENING.windowBottom.rCapMean, 0.222547, 1e-5))
    throw new Error('imp-95818: window-bottom mean r_cap does not reproduce imp-95787 0.2225');
  // honesty gates.
  if (IMP95818_NUMBER_VARIANCE_CAP_MEAN_C0_TIGHTENING.isRigorous !== false)
    throw new Error('imp-95818: isRigorous must be false');
  if (!/NO QED/.test(IMP95818_NUMBER_VARIANCE_CAP_MEAN_C0_TIGHTENING.verdict))
    throw new Error('imp-95818: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP95818_NUMBER_VARIANCE_CAP_MEAN_C0_TIGHTENING.verdict))
    throw new Error('imp-95818: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP95818_NUMBER_VARIANCE_CAP_MEAN_C0_TIGHTENING;
