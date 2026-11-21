/**
 * @module imp-36105-recovery-detuning-width-viz-data
 * @fileoverview imp-36105 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-36061 two-axis
 *   running-accumulator recovery-detuning-width measurement: the alpha-axis edges
 *   (|delta| ~ 0.560 rad at 10%, ~0.611 rad at 1%) and the beta-axis edges
 *   (~3.19 at 10%, ~3.32 at 1%), each plotted against the imp-35991 r<1e-2 basin
 *   edge and the imp-35812 baseline detuning on that axis.
 *
 *   This module does not import imp-36061 or re-run its bisection (no re-deriving
 *   at page-load time); it only bakes the recorded literals (imp-36061 module
 *   doc-comment / export table) for direct charting.
 *
 *   @see imp-36061-w1-accumulator-recovery-detuning-width.js (source measurement)
 *   @see imp-36104-kbn-kahan-separation-onset-viz-data.js (sibling viz-data pattern)
 *   @see imp-35991-w1-accumulator-baseline-margin-to-resonance (the r<1e-2 basin edges widened)
 *   @see imp-35812-w1-summation-scheme-measured-cost (baseline (alpha,beta) term family)
 *
 *   Ticket: imp-36105 (ux, low). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; NO QED.
 */

// imp-36061 measured recovery-detuning-width edges, per axis, at fixed N ~ 488602.
export const IMP36105_AXIS_EDGES = Object.freeze([
  {
    axis: 'alpha',
    label: 'alpha (resonance-proximity, beta=0)',
    basinEdge1e2: 0.0356, // imp-35991 r<1e-2 basin edge
    recoveryEdge10: 0.56, // imp-36061 r<=1.10*r_base edge
    recoveryEdge1: 0.611, // imp-36061 r<=1.01*r_base edge
    baselineDetuning: 0.6180339887498949, // imp-35812 baseline detuning from resonance
    wideningFactor10: 0.56 / 0.0356, // ~15.7x
  },
  {
    axis: 'beta',
    label: 'beta (sqrt-drift, alpha=2*pi)',
    basinEdge1e2: 0.269, // imp-35991 r<1e-2 basin edge
    recoveryEdge10: 3.19, // imp-36061 r<=1.10*r_base edge
    recoveryEdge1: 3.32, // imp-36061 r<=1.01*r_base edge
    baselineDetuning: 2.3999632297286533, // imp-35812 baseline beta
    wideningFactor10: 3.19 / 0.269, // ~11.9x
  },
]);

export const IMP36105_RECOVERY_WIDTH_VIZ_DATA = {
  ticket: 'imp-36105',
  sourceTicket: 'imp-36061',
  axisEdges: IMP36105_AXIS_EDGES,
  note:
    'imp-36061 recover-to-baseline detuning edges on both axes, each an order of magnitude ' +
    'wider than the imp-35991 r<1e-2 basin edge on the same axis: alpha widens ~15.7x, beta ' +
    'widens ~11.9x. The alpha recovery edges sit just INSIDE the imp-35812 baseline detuning ' +
    '(~0.91x-0.99x); the beta recovery edges lie BEYOND the baseline beta (~1.33x-1.38x).',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-36061 measurement exactly; adds no new ' +
    'derivation and changes no bound. Measurement only on a fixed representative term family; ' +
    'certifies no W1 bound; the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) ' +
    'and MECHANICAL (imp-35725). NO QED. No refereed bound is changed.',
};

export const IMP36105_VIZ_ASSERTIONS = [
  {
    id: 'imp36105-two-axes',
    description: 'exactly two axes (alpha, beta) are recorded',
    holds: () =>
      IMP36105_AXIS_EDGES.length === 2 &&
      IMP36105_AXIS_EDGES[0].axis === 'alpha' &&
      IMP36105_AXIS_EDGES[1].axis === 'beta',
  },
  {
    id: 'imp36105-recovery-edges-order',
    description: '1% recovery edge exceeds 10% recovery edge on both axes (tighter target needs more detuning)',
    holds: () => IMP36105_AXIS_EDGES.every((e) => e.recoveryEdge1 > e.recoveryEdge10),
  },
  {
    id: 'imp36105-widening-vs-basin',
    description: 'recovery edges are an order of magnitude wider than the imp-35991 basin edge on both axes',
    holds: () => IMP36105_AXIS_EDGES.every((e) => e.wideningFactor10 > 5),
  },
  {
    id: 'imp36105-alpha-inside-baseline',
    description: 'alpha recovery edges sit just inside the baseline detuning (ratio in (0.85, 1.02))',
    holds: () => {
      const alpha = IMP36105_AXIS_EDGES[0];
      const ratio10 = alpha.recoveryEdge10 / alpha.baselineDetuning;
      const ratio1 = alpha.recoveryEdge1 / alpha.baselineDetuning;
      return ratio10 > 0.85 && ratio10 < 1.02 && ratio1 > 0.85 && ratio1 < 1.02;
    },
  },
  {
    id: 'imp36105-beta-beyond-baseline',
    description: 'beta recovery edges lie beyond the baseline beta (ratio > 1.1)',
    holds: () => {
      const beta = IMP36105_AXIS_EDGES[1];
      return beta.recoveryEdge10 / beta.baselineDetuning > 1.1 && beta.recoveryEdge1 / beta.baselineDetuning > 1.1;
    },
  },
  {
    id: 'imp36105-honesty-gate-no-qed',
    description: 'honest status references measurement-only, greenfield, no bound change, NO QED, no refereed bound is changed',
    holds: () =>
      /VIZ-DATA ONLY/.test(IMP36105_RECOVERY_WIDTH_VIZ_DATA.honest) &&
      /GREENFIELD/.test(IMP36105_RECOVERY_WIDTH_VIZ_DATA.honest) &&
      /NO QED/.test(IMP36105_RECOVERY_WIDTH_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP36105_RECOVERY_WIDTH_VIZ_DATA.honest),
  },
];

for (const a of IMP36105_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36105-recovery-detuning-width-viz-data assertion failed: ${a.id}`);
  }
}
