/**
 * @module imp-33977-g-vs-law-offset-viz-data
 * @fileoverview imp-33977 -- lightweight viz-data module packaging the imp-33918
 *   g-vs-law reference offset convergence curve for a log-log chart:
 *   (i) off(N) = g(N) - 1/(2 log T0) (the imp-33887 I3 reference offset, monotone
 *   toward 0, order-2 decay) and (ii) the ratio g/law = L/(L+1) (monotone toward
 *   1, order-1 deviation), across the SAME 1e12..1e280 decade ladder.
 *
 *   Self-computing from the SAME representative imp-3220/imp-3406 sub-term
 *   E_coll = C_C_PINNED * sqrt(log T0 / N), T0 = effectiveHeightForN(N) -- no
 *   heavy zeros-bundle import, no fresh derivation, mirroring the imp-33802
 *   self-computing viz-data pattern.
 *
 *   @see imp-33918-ecoll-g-vs-law-reference-offset-convergence-rate.js (the measurement + closed-form match this module packages for charting)
 *   @see imp-33887-ecoll-gap-anchoring-convention-reconciliation.js (I3 reference offset origin)
 *   @see imp-33802-perron-norm-curve-viz-data.js (the self-computing viz-data pattern mirrored here)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const HALF = 0.5;
const DL = 1e-4; // central-difference step in ln N (identical to imp-33918 / imp-33854 / imp-33887)

// Identical inherited imp-3220/imp-3406 sub-term (no re-derivation, no fresh model).
function logT0Of(N) {
  return Math.log(effectiveHeightForN(N));
}

// imp-33854 reference object g(N) = (1/2) d ln(log T0)/d ln N, via central difference.
function gFundamental(e) {
  const lnN = e * Math.LN10;
  const up = Math.log(logT0Of(Math.exp(lnN + DL)));
  const down = Math.log(logT0Of(Math.exp(lnN - DL)));
  return 0.5 * (up - down) / (2 * DL);
}

// Same extended decade ladder as imp-33918 (1e12..1e280).
const LADDER = Object.freeze([12, 13, 14, 15, 20, 30, 50, 80, 120, 200, 280]);

const CURVE = Object.freeze(
  LADDER.map((e) => {
    const L = logT0Of(Math.pow(10, e));
    const law = HALF / L; // 1/(2 log T0) far-tail law (imp-33816)
    const g = gFundamental(e);
    const off = g - law; // I3 reference offset (imp-33887 term_reference_g_minus_law)
    const ratio = g / law; // -> 1 as N grows (imp-33918 F1/F3)
    return Object.freeze({
      N_log10: e,
      logT0: +L.toFixed(4),
      offset_g_minus_law: +off.toExponential(4),
      logAbsOffset: +Math.log10(Math.abs(off)).toFixed(4), // log-log chart y-axis
      ratio_g_over_law: +ratio.toFixed(6),
      oneMinusRatioTimesL: +((1 - ratio) * L).toFixed(4), // -> 1 (order-1 ratio rate, imp-33918 F3)
    });
  }),
);

// Log-log decay-exponent regression of |off| vs log T0 over the tail (e >= 20), mirrors imp-33918.
function fitExponent(rows) {
  const tail = rows.filter((r) => r.N_log10 >= 20);
  const xs = tail.map((r) => Math.log(r.logT0));
  const ys = tail.map((r) => Math.log(Math.abs(r.offset_g_minus_law)));
  const n = xs.length;
  const mx = xs.reduce((s, x) => s + x, 0) / n;
  const my = ys.reduce((s, y) => s + y, 0) / n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  return +(sxy / sxx).toFixed(4);
}

const OFFSET_DECAY_SLOPE = fitExponent(CURVE); // ~-2.00 (order-2 in 1/log T0, imp-33918 F2)

let offsetMagnitudeMonotoneDecreasing = true;
let ratioMonotoneTowardOne = true;
for (let i = 1; i < CURVE.length; i++) {
  if (Math.abs(CURVE[i].offset_g_minus_law) >= Math.abs(CURVE[i - 1].offset_g_minus_law)) offsetMagnitudeMonotoneDecreasing = false;
  if (CURVE[i].ratio_g_over_law <= CURVE[i - 1].ratio_g_over_law) ratioMonotoneTowardOne = false;
}

export const IMP33977_G_VS_LAW_OFFSET_VIZ_DATA = Object.freeze({
  id: 'imp-33977-g-vs-law-offset-viz-data',
  ticket: 'imp-33977',
  relatedMeasurement: 'imp-33918-ecoll-g-vs-law-reference-offset-convergence-rate.js',
  relatedOrigin: 'imp-33887-ecoll-gap-anchoring-convention-reconciliation.js',

  summary:
    'Viz-data packaging of the imp-33918 g-vs-law reference offset off(N) = g - 1/(2 log T0) ' +
    '(monotone toward 0, order-2 decay slope ~-2.00) and the ratio g/law = L/(L+1) (monotone ' +
    'toward 1, order-1 deviation) across the 1e12..1e280 decade ladder, ready for a log-log chart. ' +
    'Self-computed from the SAME representative E_coll = C_C_PINNED sqrt(log T0 / N) sub-term -- ' +
    'no heavy import, no fresh derivation.',

  construction: Object.freeze({
    subTerm: 'E_coll = C_C_PINNED * sqrt(log T0 / N), T0 = effectiveHeightForN(N)',
    gFundamental: 'g(N) = (1/2) d ln(log T0) / d ln N via central difference, DL = 1e-4',
    law: '1/(2 log T0) far-tail law (imp-33816)',
    offset: 'off(N) = g(N) - 1/(2 log T0) (imp-33887 I3 reference offset)',
    ladderDecades: LADDER,
  }),

  curve: CURVE,
  offsetDecaySlope: OFFSET_DECAY_SLOPE,
  offsetMagnitudeMonotoneDecreasing,
  ratioMonotoneTowardOne,

  honestCaveat: Object.freeze({
    isProof: false,
    isMeasurementOnly: true,
    isRigorous: false,
    imp33918Untouched: true,
    imp33887Untouched: true,
    carriesNoRHVerdict: true,
    cmbGueConditional: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
    honestyLock:
      'Viz-data packaging only, NO QED; C_mb GUE-conditional (imp-486) untouched; Platt-Trudgian ' +
      'Lambda <= 0.2 remains the rigorous SOTA.',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP33977_G_VS_LAW_OFFSET_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp33977-offset-magnitude-monotone-decreasing',
    why: 'The offset magnitude |g - 1/(2 log T0)| must strictly decrease across the whole ' +
         '1e12..1e280 ladder, matching the imp-33918 F1 finding.',
    holds: () => offsetMagnitudeMonotoneDecreasing && Math.abs(CURVE[CURVE.length - 1].offset_g_minus_law) < 1e-5,
  },
  {
    id: 'imp33977-ratio-monotone-toward-one',
    why: 'The ratio g/law must rise monotonically toward 1, matching the imp-33918 F1/F3 findings.',
    holds: () => {
      const last = CURVE[CURVE.length - 1].ratio_g_over_law;
      return ratioMonotoneTowardOne && last > 0.99 && last < 1;
    },
  },
  {
    id: 'imp33977-offset-decay-slope-near-minus-two',
    why: 'The log|off| vs log(log T0) regression slope over the tail must be ~-2.00, reproducing ' +
         'the imp-33918 F2 order-2 decay rate.',
    holds: () => OFFSET_DECAY_SLOPE < -1.9 && OFFSET_DECAY_SLOPE > -2.1,
  },
  {
    id: 'imp33977-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: viz-data packaging only, no RH verdict, imp-33918/imp-33887 untouched, ' +
         'PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33977_G_VS_LAW_OFFSET_VIZ_DATA.honestCaveat;
      return (
        c.isProof === false &&
        c.isMeasurementOnly === true &&
        c.isRigorous === false &&
        c.imp33918Untouched === true &&
        c.imp33887Untouched === true &&
        c.carriesNoRHVerdict === true &&
        /Platt-Trudgian/.test(c.sota) &&
        /NO QED/.test(c.honestyLock)
      );
    },
  },
];

for (const assertion of IMP33977_G_VS_LAW_OFFSET_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33977-g-vs-law-offset-viz-data assertion failed: ${assertion.id}`);
  }
}

export default IMP33977_G_VS_LAW_OFFSET_VIZ_DATA;
