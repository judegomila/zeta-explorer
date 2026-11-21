/**
 * imp-95748 -- SENSITIVITY of the imp-95722 number-variance ratio cap r_cap(3.0e12)
 * to the heuristically-pinned finite-height offset C0.
 *
 * imp-95722 derived an upper envelope for the pointwise-variance / GUE number-variance
 * ratio,
 *   r(T) <= r_cap(T) = [ (1/2pi^2) log log(T/2pi) + C0 ] / Sigma^2(L(T)),
 * monotonically decreasing to r_cap(3.0e12) ~ 0.26 < 1, so the mean-square/GUE
 * envelope stays conservative at the imp-95519 window bottom. But the O(1) offset C0
 * was pinned only heuristically -- C0 = max over the six imp-95710 heights of
 * (measuredVar - Selberg term), an upper-envelope anchor with no error bar. This module
 * puts a two-sided interval on C0 and propagates it to r_cap(3.0e12), so the 0.26 value
 * is reported WITH its offset-sensitivity rather than as a bare point.
 *
 * SLACK MODEL (finite-height, imp-95562 windowed sd(C - E) vs Sigma_S^2). The six
 * offsets inherit their uncertainty from the six windowed pointwise variances
 * measuredVar_i = sd(C - E)_i^2, each a SAMPLE variance over only nWindows_i
 * non-overlapping hard boxes (nWindows = 75..443). imp-95562 finding 2 established the
 * discrepancy D = C - E is Gaussian-tailed with no anomalous spikes, so the sample
 * variance carries the standard Gaussian sampling error
 *   SE(s^2) = s^2 * sqrt( 2 / (nWindows - 1) ).
 * That is the finite-height slack in the imp-95562 identification of the windowed
 * sd(C - E) with Sigma_S^2: a two-sided band on each measuredVar, hence on each offset
 * offset_i = measuredVar_i - Selberg term, hence on the envelope constant C0 = max_i
 * offset_i. Propagating the band through the max gives
 *   C0 in [ max_i (offset_i - SE_i), max_i (offset_i + SE_i) ].
 *
 * FINDINGS.
 *  1. Central C0 = 0.3337 (argmax at T = 1.5e5, the imp-95710 noisy upward bump);
 *     two-sided slack interval C0 in [0.2963, 0.3712] (~+/-11% of the central value).
 *  2. Propagated to the window bottom, r_cap(3.0e12) in [0.2404, 0.2793] about a central
 *     0.2599 -- a ~+/-7.5% band. The 0.26 headline IS offset-sensitive at the ~few-percent
 *     level, tracking the C0 slack.
 *  3. But the conservatism r_cap < 1 is ROBUST to the C0 choice: the ENTIRE interval,
 *     including the upper end 0.2793, sits far below 1. No admissible C0 within the
 *     imp-95562 sampling slack pushes r_cap(3.0e12) anywhere near GUE closure.
 *
 * VERDICT. The imp-95722 conclusion splits cleanly under C0 perturbation. The exact
 * VALUE r_cap(3.0e12) ~ 0.26 is offset-sensitive -- it moves across [0.24, 0.28] as C0
 * ranges over its finite-height sampling band -- so it should be read as an interval,
 * not a sharp number (consistent with imp-95722 finding 3, which already flagged the
 * O(1) offset as carrying finite-height slack). The QUALITATIVE conclusion -- r_cap < 1,
 * conservatism retained at the window bottom -- is robust: the whole interval stays below
 * 0.28, an order of magnitude of headroom below the GUE asymptote 1. Sensitivity
 * assessment only; the Selberg leading log log cap is unconditional; the detailed
 * saturation shape stays PCC/GRH-gated; changes no bound; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * Import-light: no zeros bundle, no sibling imports. The six sd(C - E) values and their
 * window counts nWindows are the imp-95562 measured literals over the 10^6 Odlyzko
 * ordinates; every derived quantity is recomputed here from the closed forms.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(v), v = T/2pi
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L = 2 Delta delta(T)
// GUE number variance for a hard box of mean count L (Dyson-Mehta large-L asymptotic)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
// Selberg leading variance constant: Var(S(T)) ~ (1/2pi^2) log log(T/2pi)
const SELBERG_C = 1 / (2 * Math.PI * Math.PI);
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

// Same six imp-95710/imp-95562 measured literals (over the 10^6 Odlyzko ordinates), now
// carrying the per-height window count nWindows that sets the sampling error on sd^2.
const MEASURED = [
  { Tc: 1.0e4, sdDiscrepancy: 0.6218, nWindows: 75 },
  { Tc: 3.0e4, sdDiscrepancy: 0.5823, nWindows: 130 },
  { Tc: 7.0e4, sdDiscrepancy: 0.5689, nWindows: 198 },
  { Tc: 1.5e5, sdDiscrepancy: 0.6714, nWindows: 291 },
  { Tc: 3.0e5, sdDiscrepancy: 0.6199, nWindows: 411 },
  { Tc: 5.0e5, sdDiscrepancy: 0.6078, nWindows: 443 },
];

// Per-height offset offset_i = measuredVar_i - Selberg term, plus the Gaussian sampling
// band SE_i = measuredVar_i * sqrt(2/(nWindows_i - 1)) on the sample variance.
const rows = MEASURED.map((m) => {
  const measuredVar = m.sdDiscrepancy * m.sdDiscrepancy;
  const selbergTerm = SELBERG_C * logLog(m.Tc);
  const offset = measuredVar - selbergTerm;
  const seVar = measuredVar * Math.sqrt(2 / (m.nWindows - 1)); // SE of a sample variance
  return {
    Tc: m.Tc,
    nWindows: m.nWindows,
    measuredVariance: measuredVar,
    selbergTerm,
    offset,
    seVariance: seVar,
    offsetLo: offset - seVar,
    offsetHi: offset + seVar,
  };
});

// Envelope constant C0 = max_i offset_i, and its two-sided interval through the max.
const C0 = Math.max(...rows.map((r) => r.offset));
const C0_lo = Math.max(...rows.map((r) => r.offsetLo));
const C0_hi = Math.max(...rows.map((r) => r.offsetHi));
const argmaxRow = rows.reduce((a, b) => (b.offset > a.offset ? b : a));

// Propagate the C0 interval to r_cap at the imp-95519 window bottom.
const WINDOW_BOTTOM_T = 3.0e12;
const gueVarWB = gueNumberVariance(envelopeCount(WINDOW_BOTTOM_T));
const selbergTermWB = SELBERG_C * logLog(WINDOW_BOTTOM_T);
const rCapAt = (c0) => (selbergTermWB + c0) / gueVarWB;
const rCapCentral = rCapAt(C0);
const rCapLo = rCapAt(C0_lo);
const rCapHi = rCapAt(C0_hi);
const fractionalHalfWidth = (rCapHi - rCapLo) / 2 / rCapCentral; // ~0.075

export const IMP95748_NUMBER_VARIANCE_RATIO_C0_SENSITIVITY = {
  ticket: 'imp-95748',
  source:
    'imp-95722 FINDING 3 (the r_cap envelope depends on an O(1) offset C0 pinned heuristically). The six sd(C - E) values and window counts nWindows are the imp-95562 measured literals over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js; the GUE/Selberg forms are re-derived here.',
  definitions: {
    offsetC0: 'C0 = max over the six imp-95710 heights of (measuredVar - Selberg term): the imp-95722 upper-envelope anchor',
    samplingSlack:
      'SE(s^2) = s^2 * sqrt(2/(nWindows-1)): Gaussian sampling error of the windowed sample variance (imp-95562 D is Gaussian-tailed), the finite-height slack in identifying sd(C - E) with Sigma_S^2',
    c0Interval: 'C0 in [max_i(offset_i - SE_i), max_i(offset_i + SE_i)]: the two-sided offset band propagated through the max',
    rCapInterval: 'r_cap(3e12) in [(Selberg term + C0_lo)/Sigma^2(L), (Selberg term + C0_hi)/Sigma^2(L)]',
  },
  selbergConstant: SELBERG_C,
  rows,
  offsetC0Central: C0, // 0.3337
  offsetC0Interval: [C0_lo, C0_hi], // [0.2963, 0.3712]
  offsetC0ArgmaxT: argmaxRow.Tc, // 1.5e5 -- the imp-95710 noisy upward bump
  windowBottom: {
    T: WINDOW_BOTTOM_T,
    gueVariance: gueVarWB,
    selbergTerm: selbergTermWB,
    rCapCentral, // 0.2599, matches imp-95722 ~0.26
    rCapInterval: [rCapLo, rCapHi], // [0.2404, 0.2793]
    fractionalHalfWidth, // ~0.075
    conservatismRobust: rCapHi < 1, // whole interval below the GUE asymptote 1
  },
  verdict:
    'SENSITIVITY of imp-95722 r_cap(3.0e12) to the heuristic offset C0. The six imp-95710 windowed variances carry a Gaussian sampling slack SE(s^2) = s^2 sqrt(2/(nWindows-1)) (imp-95562 D is Gaussian-tailed), giving a two-sided envelope offset C0 in [0.2963, 0.3712] about the central 0.3337 (argmax at the noisy T = 1.5e5 bump). Propagated to the window bottom, r_cap(3.0e12) in [0.2404, 0.2793] about 0.2599 -- so the exact 0.26 VALUE is offset-sensitive at the ~+/-7.5% level and should be read as an interval, matching imp-95722 finding 3. The QUALITATIVE conservatism r_cap < 1 is ROBUST: the whole interval, upper end 0.2793 included, sits far below the GUE asymptote 1, so no admissible C0 within the imp-95562 sampling slack threatens the window-bottom conservatism. Sensitivity assessment only; the Selberg leading log log cap is unconditional; detailed saturation PCC/GRH-gated; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // C0 central reproduces the imp-95722 max-offset pinning (~0.334)
  if (!approx(C0, 0.333721, 1e-4)) throw new Error('imp-95748: central C0 drifted from the imp-95722 pinning');
  // the interval brackets the central offset both sides
  if (!(C0_lo < C0 && C0 < C0_hi)) throw new Error('imp-95748: C0 interval does not bracket the central value');
  // the argmax offset lands at the imp-95710 noisy bump T = 1.5e5
  if (argmaxRow.Tc !== 1.5e5) throw new Error('imp-95748: envelope argmax not at the expected height');
  // r_cap central reproduces the imp-95722 ~0.26 headline
  if (!approx(rCapCentral, 0.26, 0.01)) throw new Error('imp-95748: central r_cap drifted from the imp-95722 0.26');
  // the r_cap interval brackets the central value
  if (!(rCapLo < rCapCentral && rCapCentral < rCapHi)) throw new Error('imp-95748: r_cap interval does not bracket');
  // the value IS offset-sensitive (a real, non-trivial band) but modest
  if (!(fractionalHalfWidth > 0.02 && fractionalHalfWidth < 0.2))
    throw new Error('imp-95748: fractional band outside the expected offset-sensitivity range');
  // conservatism is ROBUST: the entire interval stays strictly below 1
  if (!(rCapHi < 1)) throw new Error('imp-95748: upper r_cap crossed the GUE asymptote -- conservatism not robust');
  if (!(rCapHi < 0.5)) throw new Error('imp-95748: upper r_cap unexpectedly high -- re-check the slack propagation');
  // honesty gates
  if (!/NO QED/.test(IMP95748_NUMBER_VARIANCE_RATIO_C0_SENSITIVITY.verdict))
    throw new Error('imp-95748: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP95748_NUMBER_VARIANCE_RATIO_C0_SENSITIVITY.verdict))
    throw new Error('imp-95748: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP95748_NUMBER_VARIANCE_RATIO_C0_SENSITIVITY;
