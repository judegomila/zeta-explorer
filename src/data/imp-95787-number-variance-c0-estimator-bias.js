/**
 * imp-95787 -- ESTIMATOR-CHOICE bias of the imp-95722 O(1) offset C0 = 0.3337.
 *
 * imp-95722 pins the finite-height windowing offset as C0 = MAX over the six imp-95710
 * heights of (measuredVar - Selberg term), an upper-ENVELOPE anchor so the derived cap
 * r_cap(T) sits at or above every measured point. imp-95766 F3/F4 flagged that C0 is the
 * dominant (~69% at crossover) but shrinking-share term of the capped variance, robust to
 * ~4x error before r_cap reaches 1. imp-95748 already put a MEASUREMENT-noise band on C0
 * (Gaussian sampling slack on the six variances, ~+/-7.5% on r_cap). This ticket asks the
 * COMPLEMENTARY question: does the MAX-based estimator itself systematically over- or
 * under-estimate the true windowing correction relative to a mean-based or per-height C0,
 * and what is the spread across the six per-height offsets?
 *
 * METHOD (import-light, no zeros bundle, no sibling imports). Re-derive the six per-height
 * offsets offset_i = measuredVar_i - (1/2pi^2) log log(T_i/2pi) from the same six imp-95562
 * measured literals imp-95710/imp-95722 bake, then compare three estimators of C0: the
 * imp-95722 MAX (upper envelope), the arithmetic MEAN (a central windowing correction),
 * and the MIN (a lower envelope). Report the per-height spread and propagate each estimator
 * to r_cap at the imp-95519 window bottom.
 *
 * FINDINGS.
 *  1. The six per-height offsets are [0.2854, 0.2308, 0.2106, 0.3337, 0.2639, 0.2466],
 *     spread max - min = 0.1231 (sd 0.0399). The MAX-based C0 = 0.3337 is pinned by the
 *     SINGLE anomalous T = 1.5e5 height -- the same non-monotone upward bump imp-95710
 *     flagged (r = 0.462 there) -- not by a height trend.
 *  2. By construction the max-based C0 is an OVER-estimate of the typical windowing
 *     correction: it exceeds the mean-based C0 = 0.2618 by 0.0719 (+27.5%) and the
 *     min-based C0 = 0.2106 by 0.1231 (+58%). This is the intended DIRECTION -- an upper
 *     envelope must over-shoot the central value -- and it errs CONSERVATIVE: over-stating
 *     C0 enlarges the upper cap r_cap, so the max choice can only weaken (never falsely
 *     strengthen) the r_cap < 1 conservatism claim.
 *  3. Propagated to the window bottom, r_cap(3.0e12) is 0.2599 (max), 0.2225 (mean),
 *     0.1959 (min). The estimator choice moves r_cap over [0.196, 0.260] -- the whole
 *     range sits far below the GUE asymptote 1 -- so the QUALITATIVE conservatism is
 *     INVARIANT to which of the three estimators pins C0, consistent with the imp-95766
 *     "robust to ~4x error" headroom.
 *
 * VERDICT. The imp-95722 max-based C0 = 0.3337 is a deliberate OVER-estimate of the true
 * windowing correction: it exceeds the mean-based central offset 0.2618 by +27.5% and is
 * pinned by the lone anomalous T = 1.5e5 height, not a trend. The over-estimation is the
 * correct conservative direction for an upper envelope (it can only enlarge the cap). The
 * per-height offsets span [0.2106, 0.3337] (spread 0.1231), and propagated to the window
 * bottom the three estimators give r_cap(3e12) in [0.196, 0.260] -- all far below 1 -- so
 * the r_cap < 1 conservatism does not depend on the max-vs-mean-vs-per-height choice.
 * Measure/assess only; the Selberg leading log log cap is unconditional; the detailed
 * saturation shape is PCC/GRH-gated; changes no bound; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * Import-light: no zeros bundle, no sibling imports. Only the six sd(C - E) literals are
 * measured (imp-95562 over the verified ordinates); every derived quantity is recomputed
 * here from the closed forms.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(T/2pi)
const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L = 2 Delta delta(T)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const SELBERG_C = 1 / (2 * Math.PI * Math.PI); // Selberg leading variance constant
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

// Same six measured literals imp-95710/imp-95722 bake (imp-95562 over the 10^6 Odlyzko ordinates).
const MEASURED = [
  { Tc: 1.0e4, sdDiscrepancy: 0.6218 },
  { Tc: 3.0e4, sdDiscrepancy: 0.5823 },
  { Tc: 7.0e4, sdDiscrepancy: 0.5689 },
  { Tc: 1.5e5, sdDiscrepancy: 0.6714 },
  { Tc: 3.0e5, sdDiscrepancy: 0.6199 },
  { Tc: 5.0e5, sdDiscrepancy: 0.6078 },
];

const rows = MEASURED.map((m) => {
  const measuredVar = m.sdDiscrepancy * m.sdDiscrepancy;
  const selbergTerm = SELBERG_C * logLog(m.Tc);
  return {
    Tc: m.Tc,
    logT: Math.log(m.Tc),
    measuredVariance: measuredVar,
    selbergTerm,
    offset: measuredVar - selbergTerm, // per-height windowing correction
  };
});

const offsets = rows.map((r) => r.offset);
const nH = offsets.length;
const C0_max = Math.max(...offsets); // imp-95722 upper-envelope anchor -> 0.3337
const C0_min = Math.min(...offsets); // lower envelope
const C0_mean = offsets.reduce((s, x) => s + x, 0) / nH; // central windowing correction
const offsetSd = Math.sqrt(offsets.reduce((s, x) => s + (x - C0_mean) ** 2, 0) / nH);
const offsetSpread = C0_max - C0_min; // per-height spread
const argmaxRow = rows.reduce((a, b) => (b.offset > a.offset ? b : a));
const maxOverMean = C0_max / C0_mean; // >1: the max over-estimates the central offset
const maxMinusMean = C0_max - C0_mean;

// Propagate each estimator to r_cap at the imp-95519 window bottom.
const WINDOW_BOTTOM_T = 3.0e12;
const gueVarWB = gueNumberVariance(envelopeCount(WINDOW_BOTTOM_T));
const selbergTermWB = SELBERG_C * logLog(WINDOW_BOTTOM_T);
const rCapAt = (c0) => (selbergTermWB + c0) / gueVarWB;
const rCapMax = rCapAt(C0_max); // 0.2599, matches imp-95722 ~0.26
const rCapMean = rCapAt(C0_mean);
const rCapMin = rCapAt(C0_min);

export const IMP95787_NUMBER_VARIANCE_C0_ESTIMATOR_BIAS = {
  ticket: 'imp-95787',
  source:
    'imp-95722/imp-95766 F3-F4 (the r_cap envelope depends on the O(1) offset C0 = max over the six imp-95710 heights of measuredVar - Selberg term). The six sd(C - E) values are the imp-95562 measured literals over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js; the GUE/Selberg forms are re-derived here. Complementary to imp-95748 (which bands the MEASUREMENT noise, not the estimator choice).',
  definitions: {
    offset: 'per-height windowing correction offset_i = measuredVar_i - (1/2pi^2) log log(T_i/2pi)',
    c0Max: 'C0_max = max_i(offset_i): the imp-95722 upper-envelope anchor (0.3337)',
    c0Mean: 'C0_mean = mean_i(offset_i): a central windowing correction',
    c0Min: 'C0_min = min_i(offset_i): the lower envelope',
    rCap: 'r_cap(3e12) = [(1/2pi^2) log log(3e12/2pi) + C0] / Sigma^2(L(3e12)) for each estimator',
  },
  selbergConstant: SELBERG_C,
  rows,
  estimators: {
    c0Max: C0_max, // 0.3337 (imp-95722)
    c0Mean: C0_mean, // 0.2618
    c0Min: C0_min, // 0.2106
    offsetSpread, // 0.1231 = max - min
    offsetSd, // 0.0399
    argmaxT: argmaxRow.Tc, // 1.5e5 -- the imp-95710 noisy upward bump
    maxOverMean, // 1.2745: the max over-estimates the central offset by ~27.5%
    maxMinusMean, // 0.0719
    direction: 'OVER-estimate: the max-based C0 exceeds the mean-based C0 (upper envelope by construction; errs conservative)',
  },
  windowBottom: {
    T: WINDOW_BOTTOM_T,
    gueVariance: gueVarWB,
    selbergTerm: selbergTermWB,
    rCapMax, // 0.2599
    rCapMean, // 0.2225
    rCapMin, // 0.1959
    rCapRange: [rCapMin, rCapMax], // [0.196, 0.260]
    conservatismInvariant: rCapMax < 1, // whole estimator range below the GUE asymptote 1
  },
  verdict:
    'ESTIMATOR-CHOICE bias of the imp-95722 offset C0 = 0.3337. The six per-height windowing offsets span [0.2106, 0.3337] (spread 0.1231, sd 0.0399), and the max-based C0 is pinned by the single anomalous T = 1.5e5 height -- the same non-monotone bump imp-95710 flagged -- not by a trend. So the max-based C0 is a deliberate OVER-estimate of the true windowing correction: it exceeds the mean-based central offset 0.2618 by +27.5% (and the min 0.2106 by +58%). This is the correct conservative direction -- an upper envelope must over-shoot, and over-stating C0 can only ENLARGE the cap r_cap, never falsely strengthen the r_cap < 1 claim. Propagated to the imp-95519 window bottom, the three estimators give r_cap(3.0e12) in [0.196, 0.260], the whole range far below the GUE asymptote 1, so the QUALITATIVE conservatism is INVARIANT to the max-vs-mean-vs-per-height choice, consistent with the imp-95766 "robust to ~4x error" headroom. Measure/assess only; the Selberg leading log log cap is unconditional; the detailed saturation shape is PCC/GRH-gated; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // the max estimator reproduces the imp-95722 pinning (~0.3337)
  if (!approx(C0_max, 0.333721, 1e-4)) throw new Error('imp-95787: C0_max drifted from the imp-95722 pinning');
  // ordering: min < mean < max (mean strictly interior)
  if (!(C0_min < C0_mean && C0_mean < C0_max)) throw new Error('imp-95787: C0 estimators not ordered min < mean < max');
  // the max OVER-estimates the mean (the whole finding: max/mean > 1)
  if (!(maxOverMean > 1)) throw new Error('imp-95787: max unexpectedly at or below mean -- re-check the direction');
  // spread is a real, non-trivial band
  if (!(offsetSpread > 0.05 && offsetSpread < 0.3)) throw new Error('imp-95787: offset spread outside the expected range');
  // the argmax lands at the imp-95710 noisy bump T = 1.5e5
  if (argmaxRow.Tc !== 1.5e5) throw new Error('imp-95787: envelope argmax not at the expected height');
  // r_cap max reproduces the imp-95722 ~0.26 headline
  if (!approx(rCapMax, 0.26, 0.01)) throw new Error('imp-95787: r_cap max drifted from the imp-95722 0.26');
  // r_cap ordering follows the C0 ordering
  if (!(rCapMin < rCapMean && rCapMean < rCapMax)) throw new Error('imp-95787: r_cap estimators not ordered');
  // conservatism INVARIANT: even the max estimator stays far below 1
  if (!(rCapMax < 1)) throw new Error('imp-95787: r_cap max crossed the GUE asymptote -- conservatism not invariant');
  if (!(rCapMax < 0.5)) throw new Error('imp-95787: r_cap max unexpectedly high -- re-check the propagation');
  // honesty gates
  if (!/NO QED/.test(IMP95787_NUMBER_VARIANCE_C0_ESTIMATOR_BIAS.verdict))
    throw new Error('imp-95787: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP95787_NUMBER_VARIANCE_C0_ESTIMATOR_BIAS.verdict))
    throw new Error('imp-95787: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP95787_NUMBER_VARIANCE_C0_ESTIMATOR_BIAS;
