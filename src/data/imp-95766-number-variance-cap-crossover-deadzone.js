/**
 * @module imp-95766-number-variance-cap-crossover-deadzone
 *
 * imp-95766 -- MEASURING the imp-95722 derived number-variance cap r_cap(T) at the
 * imp-95729 crossover height T0 ~ 1.14e9 and reporting its margin below 1 across the
 * 3.28-decade "dead zone" that the imp-95750 direct sd(C - E) measurement cannot reach.
 *
 * WHY. imp-95750 (F3) established that the direct sd(C - E) pointwise-variance
 * measurement is hard-capped by the largest verified ordinate in the repo,
 * gamma_1e6 = 6.003e5, so it covers only ~2.4% of the 3.36-decade gap up to the
 * imp-95729 crossover. Everything above that ceiling -- the whole dead zone up to the
 * imp-95519 window bottom T = 3.0e12 -- rests on the imp-95722 DERIVED envelope
 * r_cap(T) = [ (1/2pi^2) log log(T/2pi) + C0 ] / Sigma^2(L(T)). But imp-95722 only
 * pinned and reported r_cap at ONE height, the window bottom T = 3.0e12
 * (r_cap ~ 0.26). The crossover height T0 ~ 1.14e9 -- the E_coll = E_trunc turning
 * point the dead-zone conservatism is supposed to protect -- was never evaluated, and
 * the O(1) offset C0 was never propagated across the dead zone. This module fills that
 * in: it recomputes r_cap and its margin (1 - r_cap) at the crossover and at a grid of
 * dead-zone heights, and reports how much of the cap the O(1) offset C0 accounts for at
 * each height (offset headroom).
 *
 * METHOD (import-light; reuses the imp-95722 closed forms, no new cited input). The
 * Selberg numerator cap (1/2pi^2) log log(T/2pi), the GUE denominator Sigma^2(L(T)),
 * the envelope count L(T) = 2 Delta delta(T), and the finite-height offset
 * C0 = max over the six imp-95710 measured heights of (measuredVar - Selberg term) are
 * all recomputed here from the SAME six imp-95562 measured sd(C - E) literals and the
 * SAME closed forms imp-95722 uses, so C0 and r_cap(3.0e12) reproduce imp-95722 to
 * float precision. Only the EVALUATION HEIGHTS are new (the crossover and the dead-zone
 * grid); no formula, constant, or bound changes.
 *
 * FINDINGS (envelope measurement only).
 *  (F1) r_cap(T0 = 1.14e9) = 0.3237, i.e. a margin of 0.6763 below 1 at the crossover:
 *       the GUE/mean-square envelope over-estimates the true pointwise fluctuation by a
 *       factor ~3.09 there. The conservatism (r < 1) that imp-95722 proved at the window
 *       bottom is therefore ALSO in force -- with room to spare -- at the crossover, the
 *       height the dead-zone conservatism actually has to cover.
 *  (F2) r_cap falls MONOTONICALLY across the whole dead zone: 0.4322 at the ceiling
 *       gamma_1e6 = 6.003e5, 0.3237 at the crossover T0 = 1.14e9, 0.2599 at the window
 *       bottom T = 3.0e12. Every intermediate grid point (1e7, 1e8, 1e10, 1e11) sits on
 *       that monotone descent, so the margin below 1 only WIDENS with height across the
 *       dead zone (0.568 -> 0.676 -> 0.740).
 *  (F3) The O(1) offset C0 = 0.3337 is the DOMINANT term of the capped variance but its
 *       fractional weight SHRINKS with height: it is ~73.0% of the cap at the ceiling,
 *       ~69.1% at the crossover, ~66.7% at the window bottom, as the Selberg log log T
 *       term slowly grows. So the finite-height slack that C0 carries becomes a smaller
 *       share of the (already sub-1) cap as T rises -- the envelope leans LESS on the
 *       O(1) offset deeper into the dead zone, not more.
 *  (F4) OFFSET HEADROOM. For r_cap to reach 1 the offset would have to grow to
 *       C0 = 1.343 at the crossover (~4.02x the pinned value) and C0 = 1.759 at the
 *       window bottom (~5.27x). So even a 4x error in the finite-height offset would not
 *       flip the conservatism at the crossover: the sub-1 margin is robust to the O(1)
 *       slack imp-95722 flagged, well beyond any plausible windowing correction.
 *
 * VERDICT. The imp-95722 derived envelope is now measured across the dead zone, not just
 * at its bottom: r_cap(T0 = 1.14e9) = 0.3237 (margin 0.6763 below 1) at the imp-95729
 * crossover, descending monotonically from 0.4322 at the imp-95750 direct-measurement
 * ceiling gamma_1e6 = 6.003e5 to 0.2599 at the imp-95519 window bottom. The GUE/mean-
 * square envelope stays conservative (r < 1) everywhere the direct measurement cannot
 * reach, and increasingly so with height. The O(1) offset C0 = 0.3337, though the
 * dominant single term (~69% of the cap at the crossover), would have to grow ~4x to
 * threaten the sub-1 margin there, so the conservatism is robust to the finite-height
 * slack. This measures the derived envelope only; it does NOT sharpen r itself (the true
 * r(T) lies in (0, r_cap(T)]), adds no cited input, and changes no bound. The zero-side
 * route stays PCC/GRH-gated; NO QED; no refereed bound is changed.
 *
 * Import-light: no zeros bundle, no sibling imports. The six sd(C - E) values are the
 * same measured literals imp-95710/imp-95722 baked (imp-95562 over the 10^6 Odlyzko
 * ordinates); every derived quantity is recomputed here from the closed forms.
 *
 * @see imp-95722-number-variance-ratio-window-bottom-bound (derived envelope r_cap, C0)
 * @see imp-95750-number-variance-deadzone-measurement-reach (F3 dead-zone reliance)
 * @see imp-95729-crossover-height-vs-variance-window (crossover T0 ~ 1.14e9)
 * @see imp-95519-localized-barrier-sum-prime-zero-nogo (window bottom T = 3.0e12)
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(v), v = T/2pi
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L = 2 Delta delta(T)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const SELBERG_C = 1 / (2 * Math.PI * Math.PI); // Selberg leading variance constant
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

// Same six measured literals imp-95710/imp-95722 baked (imp-95562 over the 10^6 ordinates).
const MEASURED = [
  { Tc: 1.0e4, sdDiscrepancy: 0.6218 },
  { Tc: 3.0e4, sdDiscrepancy: 0.5823 },
  { Tc: 7.0e4, sdDiscrepancy: 0.5689 },
  { Tc: 1.5e5, sdDiscrepancy: 0.6714 },
  { Tc: 3.0e5, sdDiscrepancy: 0.6199 },
  { Tc: 5.0e5, sdDiscrepancy: 0.6078 },
];

// Reproduce the imp-95722 finite-height offset C0 (upper-envelope anchor, NOT a fit).
const C0 = Math.max(...MEASURED.map((m) => m.sdDiscrepancy * m.sdDiscrepancy - SELBERG_C * logLog(m.Tc)));

const cappedVariance = (T) => SELBERG_C * logLog(T) + C0; // >= true pointwise var
const cappedRatio = (T) => cappedVariance(T) / gueNumberVariance(envelopeCount(T)); // r_cap(T)

// Landmark heights (baked literals from the cited modules).
const CEILING_GAMMA_1E6 = 600269.6770124451; // imp-95750 direct-measurement ceiling
const CROSSOVER_T0 = 1.14e9; // imp-95729 E_coll = E_trunc crossover
const WINDOW_BOTTOM_T = 3.0e12; // imp-95519 verified-height window bottom

// Evaluation grid: the ceiling, the crossover, four dead-zone interiors, the window bottom.
const GRID_T = [CEILING_GAMMA_1E6, 1.0e7, 1.0e8, CROSSOVER_T0, 1.0e10, 1.0e11, WINDOW_BOTTOM_T];

const deadZoneRows = GRID_T.map((T) => {
  const selbergTerm = SELBERG_C * logLog(T);
  const capVar = cappedVariance(T);
  const rCap = cappedRatio(T);
  return {
    T,
    log10T: +Math.log10(T).toFixed(4),
    selbergTerm: +selbergTerm.toFixed(6),
    cappedVariance: +capVar.toFixed(6),
    gueVariance: +gueNumberVariance(envelopeCount(T)).toFixed(6),
    rCap: +rCap.toFixed(6), // r_cap(T)
    marginBelowOne: +(1 - rCap).toFixed(6), // 1 - r_cap(T)
    offsetFractionPct: +((C0 / capVar) * 100).toFixed(2), // share of the cap from C0
  };
});

// Offset headroom: how large C0 would have to grow for r_cap(T) to reach 1.
const offsetToBreak = (T) => gueNumberVariance(envelopeCount(T)) - SELBERG_C * logLog(T);
const crossoverBreakC0 = offsetToBreak(CROSSOVER_T0);
const windowBottomBreakC0 = offsetToBreak(WINDOW_BOTTOM_T);

const crossover = {
  T: CROSSOVER_T0,
  rCap: +cappedRatio(CROSSOVER_T0).toFixed(6), // 0.3237
  marginBelowOne: +(1 - cappedRatio(CROSSOVER_T0)).toFixed(6), // 0.6763
  overEstimationFactor: +(1 / cappedRatio(CROSSOVER_T0)).toFixed(4), // ~3.09
  offsetFractionPct: +((C0 / cappedVariance(CROSSOVER_T0)) * 100).toFixed(2), // ~69.1%
  offsetToBreakC0: +crossoverBreakC0.toFixed(6), // 1.343
  offsetBreakMultiple: +(crossoverBreakC0 / C0).toFixed(3), // ~4.02x
};

export const IMP95766_NUMBER_VARIANCE_CAP_CROSSOVER_DEADZONE = {
  ticket: 'imp-95766',
  proofSection: 'S-frontier',
  question:
    'Measure the imp-95722 derived number-variance cap r_cap(T) at the imp-95729 crossover ' +
    'height T0 ~ 1.14e9 and report its margin below 1 across the 3.28-decade dead zone the ' +
    'imp-95750 direct measurement cannot reach; report how the O(1) offset C0 propagates. ' +
    'Envelope measurement only; changes no bound; NO QED.',
  definitions: {
    cappedRatio:
      'r_cap(T) = [ (1/2pi^2) log log(T/2pi) + C0 ] / Sigma^2(L(T)) >= r(T); the imp-95722 ' +
      'derived upper envelope (Selberg-unconditional numerator + GUE denominator)',
    offsetC0:
      'finite-height envelope offset = max over the six imp-95710 measured heights of ' +
      '(measuredVar - Selberg term); an upper-envelope anchor, NOT a slope fit (reproduces imp-95722)',
    marginBelowOne: '1 - r_cap(T): how far the GUE/mean-square envelope stays above the true fluctuation',
    offsetFraction: 'C0 / cappedVariance(T): the share of the capped variance carried by the O(1) offset',
    offsetToBreak: 'the value C0 would have to reach for r_cap(T) = 1 (finite-height-slack headroom)',
  },
  selbergConstant: SELBERG_C,
  offsetC0: C0, // 0.3337... (reproduces imp-95722)
  deadZoneRows,
  crossover,
  offsetHeadroom: {
    crossoverBreakC0: +crossoverBreakC0.toFixed(6), // 1.343
    crossoverBreakMultiple: +(crossoverBreakC0 / C0).toFixed(3), // ~4.02x current C0
    windowBottomBreakC0: +windowBottomBreakC0.toFixed(6), // 1.759
    windowBottomBreakMultiple: +(windowBottomBreakC0 / C0).toFixed(3), // ~5.27x current C0
    note:
      'r_cap stays below 1 across the dead zone unless the O(1) offset C0 grows ~4x (crossover) ' +
      'to ~5.3x (window bottom); the sub-1 margin is robust to the finite-height slack imp-95722 flagged',
  },
  monotoneAcrossDeadZone:
    deadZoneRows.every((r, i) => i === 0 || r.rCap <= deadZoneRows[i - 1].rCap + 1e-12),
  conservatismRetainedAtCrossover: crossover.rCap < 1,
  isRigorous: false,
  verdict:
    'ENVELOPE MEASUREMENT (frontier, NOT rigorous). The imp-95722 derived cap r_cap(T) is now ' +
    'measured across the dead zone, not just at its bottom: r_cap(T0 = 1.14e9) = 0.3237 (margin ' +
    '0.6763 below 1) at the imp-95729 crossover, descending monotonically from 0.4322 at the ' +
    'imp-95750 direct-measurement ceiling gamma_1e6 = 6.003e5 to 0.2599 at the imp-95519 window ' +
    'bottom T = 3.0e12. The GUE/mean-square envelope stays conservative (r < 1) everywhere the ' +
    'direct measurement cannot reach, and increasingly so with height. The O(1) offset C0 = 0.3337 ' +
    'is the dominant single term (~69% of the cap at the crossover) but its fractional weight shrinks ' +
    'with height, and it would have to grow ~4x to threaten the sub-1 margin at the crossover, so the ' +
    'conservatism is robust to the finite-height slack. Measures the derived envelope only; does not ' +
    'sharpen r itself (true r in (0, r_cap]); adds no cited input; changes no bound. The zero-side ' +
    'route stays PCC/GRH-gated; NO QED; no refereed bound is changed.',
  citation:
    'imp-95722 (derived envelope r_cap, offset C0, r_cap(3e12) ~ 0.26); imp-95750 (dead-zone ' +
    'reliance F3, ceiling gamma_1e6 = 6.003e5); imp-95729 (crossover T0 ~ 1.14e9); imp-95519 ' +
    '(window bottom T = 3.0e12).',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // C0 reproduces the imp-95722 pinned offset (same six literals, same closed form).
  if (!approx(C0, 0.3337213835371905, 1e-12)) throw new Error('imp-95766: C0 drifted from the imp-95722 pinned offset');
  // r_cap at the window bottom reproduces the imp-95722 ~0.26 value.
  if (!approx(cappedRatio(WINDOW_BOTTOM_T), 0.259869, 1e-5))
    throw new Error('imp-95766: window-bottom r_cap does not reproduce imp-95722 ~0.26');
  // the crossover cap is strictly in (0,1): conservatism retained where it must hold.
  if (!(crossover.rCap > 0 && crossover.rCap < 1))
    throw new Error('imp-95766: crossover r_cap outside (0,1) -- conservatism not retained');
  if (!approx(crossover.rCap, 0.323716, 1e-5)) throw new Error('imp-95766: crossover r_cap value drifted');
  if (!approx(crossover.marginBelowOne, 0.676284, 1e-5)) throw new Error('imp-95766: crossover margin drifted');
  // r_cap falls monotonically across the dead-zone grid (log log T numerator vs log T denominator).
  if (!IMP95766_NUMBER_VARIANCE_CAP_CROSSOVER_DEADZONE.monotoneAcrossDeadZone)
    throw new Error('imp-95766: r_cap not monotone decreasing across the dead-zone grid');
  // the O(1) offset is the dominant but sub-100% share, shrinking with height.
  const first = deadZoneRows[0].offsetFractionPct;
  const last = deadZoneRows[deadZoneRows.length - 1].offsetFractionPct;
  if (!(first > 50 && first < 100 && last < first))
    throw new Error('imp-95766: offset-fraction propagation not shrinking dominant share');
  // offset headroom: C0 must grow several-fold to break the sub-1 margin.
  if (!(crossoverBreakC0 / C0 > 3 && windowBottomBreakC0 / C0 > crossoverBreakC0 / C0))
    throw new Error('imp-95766: offset headroom below the expected several-fold robustness');
  // honesty gates.
  if (IMP95766_NUMBER_VARIANCE_CAP_CROSSOVER_DEADZONE.isRigorous !== false)
    throw new Error('imp-95766: isRigorous must be false');
  if (!/NO QED/.test(IMP95766_NUMBER_VARIANCE_CAP_CROSSOVER_DEADZONE.verdict))
    throw new Error('imp-95766: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP95766_NUMBER_VARIANCE_CAP_CROSSOVER_DEADZONE.verdict))
    throw new Error('imp-95766: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP95766_NUMBER_VARIANCE_CAP_CROSSOVER_DEADZONE;
