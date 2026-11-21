/**
 * @module imp-34355-fartail-crossover-residual-collapse-viz-data
 * @fileoverview imp-34355 -- VIZ DATA ONLY for the imp-33743 far-tail closed-form crossover
 *   residual collapse.
 *
 *   imp-33723 pinned the closed-form crossover N_cross for the sigma = 1/2 HALVING landmark;
 *   its closed-form-vs-empirical residual is ~3.98e-3 (~0.4%), entirely the dropped Gronwall
 *   E_flow term (E_flow/E_trunc ~ 1.9057e-3 at N_half). imp-33743 generalised the closed form
 *   to an arbitrary threshold thr and evaluated it at the imp-33582 sigma < 0.1 FAR-TAIL
 *   landmark: the residual there is only ~7.38e-5 (~0.007%), ~54x TIGHTER, because E_flow decays
 *   down the tail (E_flow/E_trunc ~ 3.5488e-5 at the far tail) -- the same ~54x ratio. Restoring
 *   E_flow in the threshold balance closes the far-tail residual to ~1.33e-15 (floating-point
 *   noise), confirming the entire ~7.38e-5 gap is the flow term, NOT a discretization artifact.
 *
 *   Values below are baked reference literals, reproduced exactly by re-evaluating the
 *   imp-33743 module's landmarks/crossoverCheck/residualContrast fields (direct import + JSON
 *   dump, not re-derived here) plus the imp-33723 halving E_flow/E_trunc ratio it cites. This
 *   module does NOT import lambda-rh-height-mapping.js or polymath15-constant-C-C.js -- no
 *   fresh computation, per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-33743-sigma-fartail-crossover-closed-form.js (source measurement: far-tail closed form + residual)
 *   @see imp-33723-sigma-half-vs-crossover-closed-form.js (halving-landmark closed form + E_flow/E_trunc source)
 *   @see imp-33601-sigma-half-vs-crossover-eflow-offset.js (exact identity sigma=1/2 <=> E_coll=E_trunc+E_flow)
 *
 *   Ticket: imp-34355 (ux, low). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. C_mb GUE-conditional per imp-486 UNTOUCHED. NO QED.
 *   No refereed bound is changed.
 */

// -- two-landmark comparison: residual and E_flow/E_trunc both drop in lockstep by ~54x --
export const IMP34355_LANDMARK_COMPARISON = Object.freeze([
  Object.freeze({
    landmark: 'Halving (thr=0.5)',
    thr: 0.5,
    N_cross: 3.280294e9,
    rel_offset: 3.98e-3,
    E_flow_over_E_trunc: 1.9057e-3,
  }),
  Object.freeze({
    landmark: 'Far-tail (thr=0.1)',
    thr: 0.1,
    N_cross: 3.213418e11,
    rel_offset: 7.3772e-5,
    E_flow_over_E_trunc: 3.5488e-5,
  }),
]);

// -- far-tail residual collapse when E_flow is restored in the threshold balance --
export const IMP34355_FARTAIL_RESIDUAL_COLLAPSE = Object.freeze([
  Object.freeze({ variant: 'Closed form (E_flow dropped)', rel_offset: 7.3772e-5 }),
  Object.freeze({ variant: 'E_flow restored', rel_offset: 1.33e-15 }),
]);

export const IMP34355_SUMMARY = Object.freeze({
  fartail_is_tighter_by: 53.95,
  logT0_relative_drift_over_offset: 2.8e-6,
  contraction_factor_at_root: 3.7948e-2,
  amplitude_ratio_to_halving: 81,
});

export default Object.freeze({
  id: 'imp-34355-fartail-crossover-residual-collapse-viz-data',
  ticket: 'imp-34355',
  source: 'imp-33743-sigma-fartail-crossover-closed-form.js',
  landmarkComparison: IMP34355_LANDMARK_COMPARISON,
  residualCollapse: IMP34355_FARTAIL_RESIDUAL_COLLAPSE,
  summary: IMP34355_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34355_ASSERTIONS = [
  {
    id: 'imp34355-two-landmarks-in-order',
    holds: () => {
      const rows = IMP34355_LANDMARK_COMPARISON;
      return rows.length === 2 && rows[0].thr === 0.5 && rows[1].thr === 0.1;
    },
    why: 'The comparison must be exactly {halving thr=0.5, far-tail thr=0.1} in that order (imp-33723/imp-33743).',
  },
  {
    id: 'imp34355-fartail-residual-and-eflow-ratio-both-drop-by-about-54x',
    holds: () => {
      const [half, far] = IMP34355_LANDMARK_COMPARISON;
      const residualRatio = half.rel_offset / far.rel_offset;
      const flowRatio = half.E_flow_over_E_trunc / far.E_flow_over_E_trunc;
      return (
        Math.abs(residualRatio - 53.95) < 1 &&
        Math.abs(flowRatio - 53.7) < 1 &&
        Math.abs(residualRatio - flowRatio) < 2
      );
    },
    why: 'D2: the far-tail residual and the E_flow/E_trunc ratio must collapse by the SAME ~54x factor, confirming the residual IS the E_flow term.',
  },
  {
    id: 'imp34355-eflow-restored-closes-residual-to-near-zero',
    holds: () => {
      const [closedForm, restored] = IMP34355_FARTAIL_RESIDUAL_COLLAPSE;
      return closedForm.rel_offset > 1e-5 && restored.rel_offset < 1e-9 && restored.rel_offset > 0;
    },
    why: 'Restoring E_flow in the threshold balance must close the ~7.38e-5 far-tail residual to floating-point noise (~1.33e-15), confirming NO discretization contribution.',
  },
  {
    id: 'imp34355-summary-matches-fartail-tightening',
    holds: () =>
      Math.abs(IMP34355_SUMMARY.fartail_is_tighter_by - 53.95) < 0.5 &&
      IMP34355_SUMMARY.amplitude_ratio_to_halving === 81,
    why: 'Summary fields must reproduce imp-33743 exactly: ~54x tightening, amplitude 81x the halving K.',
  },
];

for (const assertion of IMP34355_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-34355-fartail-crossover-residual-collapse-viz-data assertion failed: ${assertion.id}`);
  }
}
