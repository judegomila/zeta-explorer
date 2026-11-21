/**
 * @module imp-36094-kbn-kahan-naive-error-ladder-viz-data
 * @fileoverview imp-36094 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-36023 KBN-vs-classic-Kahan-
 *   vs-naive summation-error ladder across the imp-35812 N ladder [1000, 10000, 100000,
 *   488602] on the imp-35973 combined worst-case (clustered same-sign) term order.
 *
 *   Shows three normalized-error series against the unit-roundoff reference
 *   u = 2^-53 ~ 1.1102e-16: the naive left-to-right sum (grows with conditioning
 *   kappa), classic Kahan compensation, and Kahan-Babuska-Neumaier (KBN) compensation.
 *   The compensated (Kahan/KBN) series stay N-FLAT ~3-4 orders below u at every rung;
 *   the naive series grows from ~1.07e-16 to ~4.86e-15 across the ladder. The classic
 *   Kahan endpoint (~2.31e-19 at N~488602) reproduces the imp-35973 single-endpoint figure.
 *
 *   This module does not import imp-36023 or re-run the measurement (no re-deriving at
 *   page-load time); it only bakes the recorded literals for direct charting.
 *
 *   @see imp-36023-kbn-combined-worst-ladder.js (source measurement)
 *   @see imp-35973-w1-summation-order-shape-cross-term (single-endpoint combined stress)
 *   @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + N ladder)
 *   @see imp-35999-i2-i3-panel-margin-viz-data.js (sibling viz-data pattern)
 *
 *   Ticket: imp-36094 (content, medium). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; NO QED.
 */

const U_ROUNDOFF = 2 ** -53; // unit roundoff u ~ 1.1102e-16

// imp-36023 measured ladder on the imp-35973 combined worst (clustered) order.
export const IMP36094_ERROR_LADDER = Object.freeze([
  { N: 1000, kappa: 61.9, naive: 1.07e-16, kahan: 3.74e-19, kbn: 3.74e-19 },
  { N: 10000, kappa: 194.5, naive: 4.9e-16, kahan: 3.51e-19, kbn: 3.51e-19 },
  { N: 100000, kappa: 632.6, naive: 8.54e-16, kahan: 3.74e-19, kbn: 9.73e-20 },
  { N: 488602, kappa: 1391.0, naive: 4.86e-15, kahan: 2.31e-19, kbn: 1.89e-20 },
]);

export const IMP36094_SCALES = Object.freeze({
  unitRoundoff: U_ROUNDOFF,
  kbnOverUAtN1000: 3.37e-3,
  kbnOverUAtNEndpoint: 1.7e-4,
});

export const IMP36094_ERROR_LADDER_VIZ_DATA = {
  ticket: 'imp-36094',
  sourceTicket: 'imp-36023',
  ladder: IMP36094_ERROR_LADDER,
  scales: IMP36094_SCALES,
  note:
    'imp-36023 KBN-vs-classic-Kahan-vs-naive normalized error across the imp-35812 N ladder ' +
    '[1000, 10000, 100000, 488602] on the imp-35973 combined worst clustered order. Naive grows ' +
    'with conditioning kappa (~62 to ~1391) from ~1.07e-16 to ~4.86e-15; both compensated series ' +
    'stay N-flat ~3-4 orders below the unit-roundoff reference u = 2^-53 ~ 1.1102e-16; the classic ' +
    'Kahan endpoint (~2.31e-19 at N~488602) reproduces the imp-35973 single-endpoint figure.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-36023 measurement exactly; adds no new ' +
    'derivation and changes no bound. Measurement only on a fixed representative term family; ' +
    'certifies no W1 bound; the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) ' +
    'and MECHANICAL (imp-35725). NO QED. No refereed bound is changed.',
};

export const IMP36094_VIZ_ASSERTIONS = [
  {
    id: 'imp36094-ladder-four-rungs',
    description: 'ladder has exactly 4 rungs matching the imp-35812 N ladder',
    holds: () =>
      IMP36094_ERROR_LADDER.length === 4 &&
      IMP36094_ERROR_LADDER[0].N === 1000 &&
      IMP36094_ERROR_LADDER[3].N === 488602,
  },
  {
    id: 'imp36094-naive-grows-with-n',
    description: 'naive normalized error grows with N (conditioning-driven)',
    holds: () =>
      IMP36094_ERROR_LADDER[3].naive > 10 * IMP36094_ERROR_LADDER[0].naive &&
      IMP36094_ERROR_LADDER.every((r, i) => i === 0 || r.naive >= IMP36094_ERROR_LADDER[i - 1].naive),
  },
  {
    id: 'imp36094-compensated-below-unit-roundoff',
    description: 'both Kahan and KBN normalized errors stay below u at every rung',
    holds: () =>
      IMP36094_ERROR_LADDER.every((r) => r.kahan < U_ROUNDOFF && r.kbn < U_ROUNDOFF),
  },
  {
    id: 'imp36094-kbn-le-kahan-every-rung',
    description: 'KBN error never exceeds classic Kahan error at any rung (KBN at least as tight)',
    holds: () => IMP36094_ERROR_LADDER.every((r) => r.kbn <= r.kahan + 1e-30),
  },
  {
    id: 'imp36094-endpoint-matches-imp35973',
    description: 'endpoint classic-Kahan value reproduces the imp-35973 ~2.31e-19 figure',
    holds: () => Math.abs(IMP36094_ERROR_LADDER[3].kahan - 2.31e-19) / 2.31e-19 < 0.05,
  },
  {
    id: 'imp36094-honesty-gate-no-qed',
    description: 'honest status references measurement-only, greenfield, no bound change, NO QED, no refereed bound is changed',
    holds: () =>
      /VIZ-DATA ONLY/.test(IMP36094_ERROR_LADDER_VIZ_DATA.honest) &&
      /GREENFIELD/.test(IMP36094_ERROR_LADDER_VIZ_DATA.honest) &&
      /NO QED/.test(IMP36094_ERROR_LADDER_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP36094_ERROR_LADDER_VIZ_DATA.honest),
  },
];

for (const a of IMP36094_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36094-kbn-kahan-naive-error-ladder-viz-data assertion failed: ${a.id}`);
  }
}
