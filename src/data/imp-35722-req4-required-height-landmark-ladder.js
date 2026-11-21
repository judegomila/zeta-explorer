/**
 * @module imp-35722-req4-required-height-landmark-ladder
 *
 * imp-35722 (numerical, measurement): TABULATE the imp-35538 REQ-4 required-height
 * GAP as a landmark ladder. REQ-4 established that a route-(i) remainder on the
 * natural O(1/log T0) rate needs 1/log T0 <= 0.005, i.e. log T0 >= 200, i.e.
 * T0 >= e^200 ~ 7.23e86, to meet the 0.5% relative crossover budget. imp-35538
 * stated the shortfall against the crossover (~9.6x) and the PT anchor (~7.0x) in
 * prose, and imp-35576 swept the BUDGET b at fixed landmarks -- but the required
 * log-height 200 was never tabulated as a per-LANDMARK ladder, and the PEAK
 * multiple (200 / log T0_peak ~ 15.1x, the LARGEST shortfall) was never computed.
 *
 * WHAT THIS MODULE MEASURES. For each named sigma landmark it takes the actual
 * log-height log T0 from the imp-35538 heightRegime record (computed there via the
 * imp-3220/imp-3406 Riemann-von Mangoldt surrogate effectiveHeightForN) and forms
 * the required-height multiple
 *   multiple = LOG_T0_NEEDED / log T0 = 200 / log T0,
 * the factor by which the landmark log-height must be multiplied to reach the
 * REQ-4 binding height. The ladder, ascending in log-height (so descending in the
 * multiple), is:
 *   - sigma-peak      (N ~ 9.22e5): log T0 ~ 13.23, multiple ~ 15.12x  (NEW: largest gap)
 *   - E_coll=E_trunc  (N ~ 3.28e9): log T0 ~ 20.86, multiple ~  9.59x  (imp-35538 shortfallVsCross)
 *   - Platt-Trudgian  (T0 = 3e12) : log T_PT ~ 28.73, multiple ~  6.96x  (imp-35538 shortfallVsTPT)
 * Even the deepest verified height (the PT anchor) still falls ~7x short of the
 * log-height a natural O(1/log T0) remainder would need to bind, quantifying the
 * "astronomically out of reach" verdict as a landmark table.
 *
 * Measurement only; re-reads the imp-35538 heightRegime figures and forms one new
 * ratio column (the peak multiple) plus the two already-recorded shortfalls;
 * derives no remainder; discharges nothing; changes no bound; establishes no
 * operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), E_trunc =
 * 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a
 * stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35538-route-i-remainder-derivation-requirements (REQ 4; source of the log-heights and the two prose shortfalls)
 * @see imp-35576 (REQ-4 BUDGET sweep at fixed landmarks -- the orthogonal axis to this landmark ladder)
 * @see imp-35580-req4-height-gap-viz-data (bar-chart of the four log-heights; never formed the peak multiple)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (T_PT = 3e12, Lambda <= 0.2).
 */

import { IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS } from './imp-35538-route-i-remainder-derivation-requirements.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

const HR = IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS.heightRegime;

// The REQ-4 binding log-height: 1/log T0 <= 0.005 => log T0 >= 200 (T0 >= e^200 ~ 7.23e86).
const LOG_T0_NEEDED = HR.logT0NeededForHalfPctBudget; // 200

// The three named landmarks, ascending in actual log-height (imp-35538 heightRegime).
const LANDMARKS = [
  { key: 'peak', label: 'sigma-peak (N~9.22e5)', logT0: HR.logT0Peak }, // ~13.2309
  { key: 'cross', label: 'E_coll=E_trunc crossover (N~3.28e9)', logT0: HR.logT0Cross }, // ~20.8576
  { key: 'pt', label: 'Platt-Trudgian anchor (T0=3e12)', logT0: HR.logT_PT }, // ~28.7296
];

// The required-height ladder: for each landmark, the multiple 200 / log T0.
const ladder = LANDMARKS.map((lm) => ({
  key: lm.key,
  label: lm.label,
  logT0: lm.logT0,
  // Factor by which the landmark log-height must grow to reach the REQ-4 binding height.
  requiredMultiple: +(LOG_T0_NEEDED / lm.logT0).toFixed(4),
  // Residual log-height gap to the binding threshold (200 - log T0).
  logHeightGap: +(LOG_T0_NEEDED - lm.logT0).toFixed(4),
}));

// The peak multiple is NEW here (imp-35538 recorded only the crossover and PT shortfalls).
const PEAK_MULTIPLE = ladder.find((r) => r.key === 'peak').requiredMultiple; // ~15.12
const CROSS_MULTIPLE = ladder.find((r) => r.key === 'cross').requiredMultiple; // ~9.59
const PT_MULTIPLE = ladder.find((r) => r.key === 'pt').requiredMultiple; // ~6.96

export const IMP35722_REQ4_REQUIRED_HEIGHT_LANDMARK_LADDER = {
  id: 'imp-35722',
  proofSection: 'S-frontier',
  question:
    'Expressed as a per-landmark ladder, by what multiple (200 / log T0) must each named sigma landmark log-height ' +
    'grow to reach the imp-35538 REQ-4 binding log-height log T0 >= 200 (T0 >= e^200 ~ 7.23e86) that an O(1/log T0) ' +
    'route-(i) remainder needs to meet the 0.5% crossover budget?',
  method:
    'Take each landmark log-height log T0 from the imp-35538 heightRegime record (computed via the imp-3220/imp-3406 ' +
    'Riemann-von Mangoldt surrogate effectiveHeightForN) and form the required-height multiple 200 / log T0 and the ' +
    'residual log-height gap 200 - log T0, ascending in log-height across peak, crossover, and the PT anchor.',
  logT0Needed: LOG_T0_NEEDED, // 200
  T0Needed: HR.T0Needed, // ~7.23e86
  peakMultiple: PEAK_MULTIPLE, // ~15.12 (NEW: largest shortfall, never tabulated by imp-35538)
  crossMultiple: CROSS_MULTIPLE, // ~9.59 (matches imp-35538 shortfallVsCross)
  ptMultiple: PT_MULTIPLE, // ~6.96 (matches imp-35538 shortfallVsTPT)
  ladder,
  // Ascending log-height => descending required multiple: peak is the worst-off landmark.
  multipleDescendsWithHeight: true,
  evenPTFallsShort: PT_MULTIPLE > 1,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Tabulating the imp-35538 REQ-4 required-height gap as a per-landmark ladder: the ' +
    'binding log-height log T0 >= 200 (T0 >= e^200 ~ 7.23e86) that an O(1/log T0) route-(i) remainder needs to meet ' +
    'the 0.5% crossover budget is ~15.12x the sigma-peak log-height (~13.23), ~9.59x the E_coll=E_trunc crossover ' +
    'log-height (~20.86), and ~6.96x the Platt-Trudgian anchor log-height (~28.73). The multiple DESCENDS as ' +
    'log-height grows -- the peak is the worst-off landmark -- yet even the deepest verified height (the PT anchor) ' +
    'still falls ~7x short, so no reachable height binds any landmark on the natural rate. The peak multiple (~15.12) ' +
    'is computed here for the first time; the crossover (~9.59) and PT (~6.96) multiples reproduce the imp-35538 ' +
    'shortfallVsCross / shortfallVsTPT figures. Re-reads the imp-35538 heightRegime; derives no remainder; discharges ' +
    'nothing; changes no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), ' +
    'E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; route-(ii) ' +
    '(imp-35488 two-height spot check) remains the only viable partial; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35538 (REQ 4; source of the landmark log-heights and the two prose shortfalls, laddered here with the new ' +
    'peak multiple); imp-35576 (orthogonal REQ-4 budget sweep); imp-35580 (REQ-4 bar-chart viz); imp-2642/imp-2643 ' +
    '(C_C = (1/8) sqrt(3 pi)); imp-2631 (E_trunc floor); imp-486 (GUE-conditional caveat). Literature: ' +
    'Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35722_REQ4_REQUIRED_HEIGHT_LANDMARK_LADDER_ASSERTIONS = [
  {
    // (1) the REQ-4 binding log-height is 200 and the required height is e^200 ~ 7.23e86.
    id: 'imp35722-binding-log-height-is-200',
    description: 'the REQ-4 binding log-height is 200 (T0 = e^200 ~ 7.23e86), inherited from imp-35538',
    holds: () =>
      LOG_T0_NEEDED === 200 &&
      Math.abs(Math.exp(200) - 7.23e86) / 7.23e86 < 0.01,
  },
  {
    // (2) the peak multiple (NEW) is ~15.12 = 200 / log T0_peak and is the largest in the ladder.
    id: 'imp35722-peak-multiple-largest',
    description: 'the new peak multiple ~15.12 = 200 / log T0_peak is the largest required multiple in the ladder',
    holds: () =>
      Math.abs(PEAK_MULTIPLE - 200 / HR.logT0Peak) < 1e-3 &&
      PEAK_MULTIPLE > 15 && PEAK_MULTIPLE < 15.5 &&
      PEAK_MULTIPLE > CROSS_MULTIPLE && CROSS_MULTIPLE > PT_MULTIPLE,
  },
  {
    // (3) crossover and PT multiples reproduce the imp-35538 shortfallVsCross / shortfallVsTPT figures.
    id: 'imp35722-cross-pt-match-imp35538',
    description: 'the crossover (~9.59) and PT (~6.96) multiples reproduce the imp-35538 shortfallVsCross / shortfallVsTPT',
    holds: () =>
      Math.abs(CROSS_MULTIPLE - HR.shortfallVsCross) < 0.02 &&
      Math.abs(PT_MULTIPLE - HR.shortfallVsTPT) < 0.02,
  },
  {
    // (4) the multiple descends monotonically as log-height ascends, yet even the PT anchor falls short.
    id: 'imp35722-multiple-descends-pt-still-short',
    description: 'the required multiple descends as log-height grows across the ladder, yet the PT anchor still has multiple > 1',
    holds: () => {
      const r = IMP35722_REQ4_REQUIRED_HEIGHT_LANDMARK_LADDER;
      const ascendingHeight = ladder.every(
        (row, i) => i === 0 || row.logT0 > ladder[i - 1].logT0,
      );
      const descendingMultiple = ladder.every(
        (row, i) => i === 0 || row.requiredMultiple < ladder[i - 1].requiredMultiple,
      );
      return (
        ascendingHeight && descendingMultiple &&
        r.multipleDescendsWithHeight === true &&
        r.evenPTFallsShort === true &&
        PT_MULTIPLE > 1
      );
    },
  },
  {
    // (5) each ladder row is internally consistent: multiple * logT0 ~ 200 and gap = 200 - logT0.
    id: 'imp35722-ladder-rows-internally-consistent',
    description: 'each ladder row satisfies requiredMultiple * logT0 ~ 200 and logHeightGap = 200 - logT0',
    holds: () =>
      ladder.length === 3 &&
      ladder.every(
        (row) =>
          Math.abs(row.requiredMultiple * row.logT0 - 200) < 0.01 &&
          Math.abs(row.logHeightGap - (200 - row.logT0)) < 1e-4,
      ),
  },
  {
    // (6) honesty gate: measurement only, conditional, no bound moves, no refereed bound is changed, imp-35337a OPEN, NO QED.
    id: 'imp35722-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35722_REQ4_REQUIRED_HEIGHT_LANDMARK_LADDER;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a stays OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35722_REQ4_REQUIRED_HEIGHT_LANDMARK_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35722-req4-required-height-landmark-ladder assertion failed: ${a.id}`);
  }
}
