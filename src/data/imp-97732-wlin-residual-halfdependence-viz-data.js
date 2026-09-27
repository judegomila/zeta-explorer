/**
 * @module imp-97732-wlin-residual-halfdependence-viz-data
 *
 * imp-97732: import-light viz-data leaf charting the imp-97705 residual-VALUE half-dependence
 * drift (x=0.25 smooth column: -5.3256e-3 -> -5.2414e-3 -> -5.0952e-3 across half=100/200/400)
 * alongside the factorization-independence relative-span bands at each half. Reuses
 * IMP97705_RESID_BY_HALF and IMP97705_REL_SPAN_PCT verbatim (no re-derivation, no new
 * computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97705-wlin-residual-halforder-refinement.js (IMP97705_RESID_BY_HALF, IMP97705_REL_SPAN_PCT, IMP97705_VERDICT)
 */

import {
  IMP97705_RESID_BY_HALF,
  IMP97705_REL_SPAN_PCT,
  IMP97705_VERDICT,
} from './imp-97705-wlin-residual-halforder-refinement.js';

const HALVES = [100, 200, 400];

// One row per x node: the residual VALUE (smooth column, representative of all four
// factorizations at a node) at each half-order, showing the monotonic drift.
export const IMP97732_VALUE_DRIFT_ROWS = Object.freeze(
  IMP97705_RESID_BY_HALF[200].map((_, i) =>
    Object.freeze({
      x: IMP97705_RESID_BY_HALF[200][i].x,
      byHalf: Object.freeze(HALVES.map((h) => IMP97705_RESID_BY_HALF[h][i].smooth)),
    })
  )
);

// One row per half-order: the relative factorization span (%) per x node.
export const IMP97732_REL_SPAN_ROWS = Object.freeze(
  HALVES.map((h) => Object.freeze({ half: h, spans: Object.freeze(IMP97705_REL_SPAN_PCT[h]) }))
);

export const IMP97732_SUMMARY = Object.freeze({
  reading:
    `The residual VALUE w(x)-w_lin(x) at x=0.25 drifts monotonically as the phase-window half ` +
    `widens (-5.3256e-3 -> -5.2414e-3 -> -5.0952e-3 across half=100/200/400), a window-averaging ` +
    `effect, not noise -- every one of the four x nodes drifts the same direction at every half. ` +
    `Meanwhile the factorization relative span at the two large-magnitude nodes (x=0.12, x=0.25) ` +
    `stays under 1% at every half, so the factorization-INDEPENDENCE is the discretization fixed ` +
    `point, while the residual value itself is not.`,
  verdict: IMP97705_VERDICT.conclusion,
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97732_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97732-four-x-nodes',
    description: 'exactly four x-node drift rows (0.01, 0.05, 0.12, 0.25)',
    holds: () => IMP97732_VALUE_DRIFT_ROWS.length === 4,
  },
  {
    id: 'imp97732-x025-monotonic-drift',
    description: 'the x=0.25 residual value increases monotonically across half=100,200,400',
    holds: () => {
      const row = IMP97732_VALUE_DRIFT_ROWS.find((r) => r.x === 0.25);
      const [v100, v200, v400] = row.byHalf;
      return v100 < v200 && v200 < v400;
    },
  },
  {
    id: 'imp97732-three-half-rows',
    description: 'exactly three relative-span rows, one per half-order',
    holds: () =>
      IMP97732_REL_SPAN_ROWS.length === 3 &&
      IMP97732_REL_SPAN_ROWS.map((r) => r.half).join(',') === '100,200,400',
  },
  {
    id: 'imp97732-large-node-subpercent-every-half',
    description: 'x=0.12 and x=0.25 relative span stays under 1% at every half-order',
    holds: () =>
      IMP97732_REL_SPAN_ROWS.every((r) =>
        r.spans.filter((s) => s.x === 0.12 || s.x === 0.25).every((s) => s.rel < 1)
      ),
  },
  {
    id: 'imp97732-values-match-imp97705-source',
    description: 'value-drift rows match IMP97705_RESID_BY_HALF verbatim',
    holds: () =>
      IMP97732_VALUE_DRIFT_ROWS.every(
        (row, i) =>
          row.byHalf[0] === IMP97705_RESID_BY_HALF[100][i].smooth &&
          row.byHalf[2] === IMP97705_RESID_BY_HALF[400][i].smooth
      ),
  },
  {
    id: 'imp97732-honesty-gate-no-qed',
    description: 'the reused verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97732_SUMMARY.verdict) && /NO QED/.test(IMP97732_SUMMARY.verdict),
  },
];

for (const assertion of IMP97732_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97732 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97732_SUMMARY;
