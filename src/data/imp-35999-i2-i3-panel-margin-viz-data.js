/**
 * @module imp-35999-i2-i3-panel-margin-viz-data
 * @fileoverview imp-35999 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-35951 I2 panel-count-vs-margin
 *   ladder and I3 modulus-floor sizing, both read from the HELD imp-33923 sampled
 *   off-axis phase-winding proxy (isRigorous:false).
 *
 *   Panels-vs-margin: n = ceil(3m/4) over the imp-33923 pi/2 sweep arc (total winding
 *   3pi/4 rad): m=1 -> 1 panel (borderline), m=2 -> 2 panels, m=4 -> 3 panels. The
 *   held 10-node sample itself sits at an intrinsic margin of ~12 below the pi cap
 *   (per-node |Delta arg| = pi/12).
 *
 *   Modulus floor: the sampled |f| floor is C_PS = pi/sqrt(2) ~ 2.2214, angle-robust
 *   across the sweep (spread ~0), the candidate delta for I3.
 *
 *   This module does not import imp-35951 (no re-deriving the sizing at page-load
 *   time); it only bakes the recorded literals for direct charting.
 *
 *   @see imp-35951-i2-i3-sizing-from-imp33923-sampled-proxy.js (source sizing)
 *   @see imp-35956-pairwise-tree-shape-ladder-viz-data.js (sibling viz-data pattern)
 *
 *   Ticket: imp-35999 (ux, low). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; NO QED.
 */

const HALF_TURN = Math.PI; // I2 cap threshold: |Delta arg f| < pi per panel
const TOTAL_WINDING = (3 * Math.PI) / 4; // imp-35951 total winding over the pi/2 sweep arc
const C_PS = Math.PI / Math.SQRT2; // ~2.2214: imp-35951 I3 modulus-floor proxy

// Panel-count-vs-margin ladder: n = ceil(3m/4) (imp-35951).
export const IMP35999_PANEL_MARGIN_LADDER = Object.freeze([
  { margin: 1, panels: 1, label: 'borderline' },
  { margin: 2, panels: 2 },
  { margin: 4, panels: 3 },
]);

export const IMP35999_SCALES = Object.freeze({
  totalWindingRad: +TOTAL_WINDING.toFixed(9), // 3 pi / 4 ~ 2.356
  capThresholdRad: HALF_TURN,
  sampleIntrinsicMargin: 12, // held 10-node sample: per-node |Delta arg| = pi/12, factor 12 below cap
  modulusFloorProxy: +C_PS.toFixed(12), // I3 candidate delta
});

export const IMP35999_PANEL_MARGIN_VIZ_DATA = {
  ticket: 'imp-35999',
  sourceTicket: 'imp-35951',
  ladder: IMP35999_PANEL_MARGIN_LADDER,
  scales: IMP35999_SCALES,
  note:
    'imp-35951 I2 panel-count-vs-margin ladder (n = ceil(3m/4): 1, 2, 3 panels at margin 1, 2, 4) ' +
    'and the I3 modulus-floor proxy C_PS = pi/sqrt(2) ~ 2.2214, both read from the HELD imp-33923 ' +
    'sampled off-axis phase-winding proxy (slope magnitude 3/2, angle-robust modulus).',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-35951 sizing exactly; adds no new derivation ' +
    'and changes no bound. Both the panel count and the modulus floor are PROXIES on the off-axis model ' +
    'cusp rho = |x|^{-1/2}, NOT the true H_t = A + B - C on dR at T_PT = 3e12; I2 and I3 stay GREENFIELD ' +
    '(imp-35681 Part A / imp-35725). NO QED. No refereed bound is changed.',
};

export const IMP35999_VIZ_ASSERTIONS = [
  {
    id: 'imp35999-ladder-three-rungs',
    description: 'ladder has exactly 3 rungs (margins 1, 2, 4)',
    holds: () => IMP35999_PANEL_MARGIN_LADDER.length === 3,
  },
  {
    id: 'imp35999-panel-formula-ceil-3m-over-4',
    description: 'panels = ceil(3m/4) for each margin rung',
    holds: () => IMP35999_PANEL_MARGIN_LADDER.every((r) => r.panels === Math.ceil((3 * r.margin) / 4)),
  },
  {
    id: 'imp35999-total-winding-matches-source',
    description: 'total winding over the sweep arc is 3 pi / 4 ~ 2.356 rad, matching imp-35951',
    holds: () => Math.abs(IMP35999_SCALES.totalWindingRad - (3 * Math.PI) / 4) < 1e-6,
  },
  {
    id: 'imp35999-modulus-floor-is-cps',
    description: 'modulus floor proxy is C_PS = pi/sqrt(2) ~ 2.2214',
    holds: () =>
      Math.abs(IMP35999_SCALES.modulusFloorProxy - Math.PI / Math.SQRT2) < 1e-9 &&
      Math.abs(IMP35999_SCALES.modulusFloorProxy - 2.221441469) < 1e-6,
  },
  {
    id: 'imp35999-honesty-gate-no-qed',
    description: 'honest status references measurement-only, greenfield, no bound change, NO QED, no refereed bound is changed',
    holds: () =>
      /VIZ-DATA ONLY/.test(IMP35999_PANEL_MARGIN_VIZ_DATA.honest) &&
      /GREENFIELD/.test(IMP35999_PANEL_MARGIN_VIZ_DATA.honest) &&
      /NO QED/.test(IMP35999_PANEL_MARGIN_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP35999_PANEL_MARGIN_VIZ_DATA.honest),
  },
];

for (const a of IMP35999_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35999-i2-i3-panel-margin-viz-data assertion failed: ${a.id}`);
  }
}
