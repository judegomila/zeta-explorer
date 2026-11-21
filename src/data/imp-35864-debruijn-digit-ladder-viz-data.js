/**
 * @module imp-35864-debruijn-digit-ladder-viz-data
 * @fileoverview imp-35864 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-35811 MEASURED working-digit
 *   ladder D*(x) the exact de Bruijn evaluator needs to keep exp(-pi x/8) resolvable,
 *   on x in [104, 1000].
 *
 *   The literals below are copied verbatim from the imp-35811 BigInt-measured table
 *   (result.table, digitLaw, wideningBuys) -- this module does not import imp-35811
 *   (no ~520-digit BigInt fixed-point recomputation at page-load time) so pages
 *   consuming it stay import-light.
 *
 *   @see imp-35811-exact-debruijn-arbitrary-precision-digit-table.js (source BigInt measurement)
 *   @see imp-35863-krawczyk-split-inversion-viz-data.js (same viz-data pattern)
 *
 *   Ticket: imp-35864 (ux, medium). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; NO QED.
 */

// Measured D*(x) ladder: x, gamma=x/2, D*(x) (BigInt-measured), law=(pi/8ln10).x reference.
export const IMP35864_DIGIT_LADDER = Object.freeze([
  { x: 104, gamma: 52, Dstar: 20, law: 17.736892599943936, label: 'double edge' },
  { x: 150, gamma: 75, Dstar: 27, law: 25.582056634534524, label: null },
  { x: 200, gamma: 100, Dstar: 36, law: 34.10940884604603, label: 'quad reach' },
  { x: 300, gamma: 150, Dstar: 53, law: 51.16411326906905, label: null },
  { x: 500, gamma: 250, Dstar: 87, law: 85.27352211511507, label: null },
  { x: 750, gamma: 375, Dstar: 129, law: 127.9102831726726, label: null },
  { x: 1000, gamma: 500, Dstar: 172, law: 170.54704423023014, label: null },
]);

// The pi/(8 ln10) linear digit law and the ladder-derived measured slope/offset.
export const IMP35864_DIGIT_LAW = Object.freeze({
  digitsPerX: 0.17054704423023015, // pi/(8 ln10)
  slopeMeasured: 0.16964285714285715, // (Dstar[1000]-Dstar[104])/(1000-104)
  guardOffset: 2.2631074000560645, // Dstar(104) - digitsPerX*104
});

// Double (~15.95 decimal digits) and quad IEEE binary128 (~33.9 decimal digits)
// working-precision ceilings, plotted as horizontal bands against the ladder.
export const IMP35864_PRECISION_THRESHOLDS = Object.freeze({
  doubleDigits: 15.95, // IEEE binary64 (~52-bit mantissa) decimal-digit budget
  quadDigits: 33.9, // IEEE binary128 (~112-bit mantissa) decimal-digit budget
  quadReachX: 199.8315789473684, // x at which the measured slope exhausts quadDigits
});

// T_PT = 3e12 (gamma) extrapolation from the MEASURED slope; x = 2.T_PT = 6e12.
export const IMP35864_TPT_EXTRAPOLATION = Object.freeze({
  xTPT: 6e12,
  digitsTPTMeasured: 1017857142857.143, // ~1.018e12 decimal digits
  gigabytesTPT: 422.65602992986527, // ~423 GB of mantissa per evaluated value
});

export const IMP35864_DEBRUIJN_DIGIT_LADDER_VIZ_DATA = {
  ticket: 'imp-35864',
  sourceTicket: 'imp-35811',
  ladder: IMP35864_DIGIT_LADDER,
  digitLaw: IMP35864_DIGIT_LAW,
  precisionThresholds: IMP35864_PRECISION_THRESHOLDS,
  tptExtrapolation: IMP35864_TPT_EXTRAPOLATION,
  note:
    'Genuine ~520-digit BigInt arithmetic measures the minimum working-digit count D*(x) that keeps ' +
    'exp(-pi x/8) resolvable to 3 significant figures off the O(1) integrand accumulator K ~ 6.214e-2, ' +
    'at a ladder x in [104,1000]. D*(x) rises LINEARLY at slope ~0.1696-0.1705 digits per unit x ' +
    '(matching pi/(8 ln10)), crossing the quad (binary128, ~33.9 digit) ceiling at x ~ 199.8 and ' +
    'extrapolating to ~1.02e12 decimal digits (~423 GB per evaluated value) at the Platt-Trudgian ' +
    'target x = 2.T_PT = 6e12.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-35811 BigInt measurement; adds no new ' +
    'derivation and changes no bound. Measures ONLY the exp(-pi x/8) underflow-driven mantissa-digit ' +
    'requirement using the imp-35781-measured accumulator scale K; it does not evaluate the true H_0 ' +
    'at high precision, extend the evaluator, or certify any value at any height. NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP35864_VIZ_ASSERTIONS = [
  {
    id: 'imp35864-ladder-seven-points-monotone-in-x-and-dstar',
    description: 'ladder has 7 points strictly increasing in both x and Dstar',
    holds: () => {
      const L = IMP35864_DIGIT_LADDER;
      if (L.length !== 7) return false;
      for (let i = 1; i < L.length; i++) {
        if (L[i].x <= L[i - 1].x) return false;
        if (L[i].Dstar <= L[i - 1].Dstar) return false;
      }
      return L[0].x === 104 && L[L.length - 1].x === 1000;
    },
  },
  {
    id: 'imp35864-slope-matches-pi-over-8ln10-law',
    description: 'measured slope matches pi/(8 ln10) to within 5%, each rung within +-3 of law+guardOffset',
    holds: () => {
      const { digitsPerX, slopeMeasured, guardOffset } = IMP35864_DIGIT_LAW;
      if (Math.abs(slopeMeasured / digitsPerX - 1) > 0.05) return false;
      for (const r of IMP35864_DIGIT_LADDER) {
        if (Math.abs(r.Dstar - (digitsPerX * r.x + guardOffset)) > 3) return false;
      }
      return true;
    },
  },
  {
    id: 'imp35864-quad-reach-brackets-x200-rung',
    description: 'quadReachX sits within +-15 of the x=200 ladder rung (the "quad reach" label)',
    holds: () => {
      const quadRung = IMP35864_DIGIT_LADDER.find((r) => r.x === 200);
      return (
        !!quadRung &&
        Math.abs(IMP35864_PRECISION_THRESHOLDS.quadReachX - 200) < 15 &&
        quadRung.Dstar > IMP35864_PRECISION_THRESHOLDS.quadDigits
      );
    },
  },
  {
    id: 'imp35864-tpt-extrapolation-in-expected-range',
    description: 'xTPT=6e12 extrapolates to ~1.0e12 digits (~420-430 GB/value)',
    holds: () =>
      IMP35864_TPT_EXTRAPOLATION.xTPT === 6e12 &&
      Math.abs(IMP35864_TPT_EXTRAPOLATION.digitsTPTMeasured / 1.018e12 - 1) < 0.02 &&
      IMP35864_TPT_EXTRAPOLATION.gigabytesTPT > 400 &&
      IMP35864_TPT_EXTRAPOLATION.gigabytesTPT < 450,
  },
  {
    id: 'imp35864-honesty-gate-no-qed',
    description: 'honest status references measurement-only, no bound change, NO QED, no refereed bound is changed',
    holds: () =>
      /VIZ-DATA ONLY/.test(IMP35864_DEBRUIJN_DIGIT_LADDER_VIZ_DATA.honest) &&
      /NO QED/.test(IMP35864_DEBRUIJN_DIGIT_LADDER_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP35864_DEBRUIJN_DIGIT_LADDER_VIZ_DATA.honest),
  },
];

for (const a of IMP35864_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35864-debruijn-digit-ladder-viz-data assertion failed: ${a.id}`);
  }
}
