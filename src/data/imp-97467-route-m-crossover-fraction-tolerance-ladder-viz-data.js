/**
 * @module imp-97467-route-m-crossover-fraction-tolerance-ladder-viz-data
 *
 * imp-97467 (ux): import-light viz-data leaf visualizing the imp-97441
 * measurement of the Route M boundary-to-bulk crossover fraction
 *
 *   x*(eps) = A(b)/b   (largest a/b with |(I - I_lin)/I| <= eps)
 *
 * across eps in {0.5%, 1%, 2%, 5%} on the b-ladder {1000, 2000, 4000, 8000,
 * 16000}. Reshapes the imp-97441 IMP97441_XSTAR_TABLE (imported verbatim, no
 * re-derivation) into four per-tolerance ladders so the b-independence at
 * 0.5%/2%/5% (flat lines) and the BIMODAL step at 1% (the two deviation
 * crests straddling the 1% level, imp-97437 R3) are visually distinct.
 *
 * PRESENTATION ONLY. Reuses the imp-97441 table and verdict verbatim; no
 * re-solve. Establishes no operator positivity; changes no bound; the
 * rigorous anchor stays T = 2.594e7; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-97441-route-m-crossover-fraction-tolerance-table.js (the x*(eps) table, b-independence, curvature fit)
 * @see imp-97419-route-m-uniform-profile-crossover-scale.js (the two-tolerance predecessor measurement)
 * @see imp-97437-route-m-bulk-profile-curvature-crossover.js (the effective-curvature fixed point, kappa_eff=0.0995)
 *
 * Ticket: imp-97467 (ux, sonnet-4-6, sonnet). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP97441_XSTAR_TABLE,
  IMP97441_BINDEPENDENCE,
  IMP97441_VERDICT,
} from './imp-97441-route-m-crossover-fraction-tolerance-table.js';

export const IMP97467_B_LADDER = Object.freeze([1000, 2000, 4000, 8000, 16000]);

const B_KEYS = ['b1000', 'b2000', 'b4000', 'b8000', 'b16000'];

// -- reshape the imp-97441 table rows into per-tolerance point ladders. --------------------------
export const IMP97467_LADDERS = Object.freeze(
  IMP97441_XSTAR_TABLE.map((row) => {
    const bi = IMP97441_BINDEPENDENCE.find((r) => r.eps === row.eps);
    const points = Object.freeze(
      B_KEYS.map((k, i) => Object.freeze({ b: IMP97467_B_LADDER[i], x: row[k] }))
    );
    return Object.freeze({
      eps: row.eps,
      label: `${(row.eps * 100).toFixed(1)}%`,
      points,
      bIndependent: bi.bIndependent,
      ladderSpread: bi.ladderSpread,
      note: bi.note,
    });
  })
);

export const IMP97467_BIMODAL_EPS = 0.01;

export const IMP97467_VERDICT = Object.freeze({
  ticket: 'imp-97467',
  sourceTicket: 'imp-97441',
  claim:
    'x*(eps) = A(b)/b is flat (b-independent to 3-4 digits) across the b-ladder at eps = 0.5%, 2%, 5%, ' +
    'but steps between two values at eps = 1% (0.199 for b<=2000, 0.1665 for b>=4000), an ' +
    'oscillation-marginal tolerance where two crests of the signed deviation straddle the 1% level.',
  flatTolerances: IMP97467_LADDERS.filter((l) => l.bIndependent).map((l) => l.label),
  bimodalTolerance: IMP97467_LADDERS.find((l) => !l.bIndependent)?.label,
  kappaEffToleranceUniform: IMP97441_VERDICT.kappaEffToleranceUniform,
  qed: false,
});
export default IMP97467_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97467_ASSERTIONS = [
  {
    id: 'imp97467-four-ladders-five-points-each',
    holds: () =>
      IMP97467_LADDERS.length === 4 &&
      IMP97467_LADDERS.every((l) => l.points.length === 5),
    why: 'the reshaped viz data must carry all four tolerance rows and all five b-ladder points per row, matching the imp-97441 source table shape.',
  },
  {
    id: 'imp97467-points-match-source-table-verbatim',
    holds: () =>
      IMP97467_LADDERS.every((l, ri) =>
        l.points.every((p, i) => p.x === IMP97441_XSTAR_TABLE[ri][B_KEYS[i]])
      ),
    why: 'every plotted point must equal the imp-97441 IMP97441_XSTAR_TABLE literal exactly (reuse, no re-derivation).',
  },
  {
    id: 'imp97467-flat-tolerances-monotone-and-narrow-spread',
    holds: () =>
      IMP97467_LADDERS.filter((l) => l.bIndependent).every((l) => {
        const xs = l.points.map((p) => p.x);
        const spread = Math.max(...xs) - Math.min(...xs);
        const monotone = xs.every((v, i) => i === 0 || v >= xs[i - 1] - 1e-12);
        return spread < 1e-3 && monotone;
      }),
    why: 'RESULT 2: at eps = 0.5%, 2%, 5% the ladder must be monotone and flat (spread < 1e-3), reproducing the imp-97441 b-independence finding.',
  },
  {
    id: 'imp97467-bimodal-tolerance-is-1pct-with-large-spread',
    holds: () => {
      const l = IMP97467_LADDERS.find((r) => r.eps === IMP97467_BIMODAL_EPS);
      const xs = l.points.map((p) => p.x);
      return !l.bIndependent && Math.max(...xs) - Math.min(...xs) > 1e-2 && xs[0] === 0.199 && xs[4] === 0.1665;
    },
    why: 'RESULT 2: the eps = 1% row must be the flagged bimodal ladder, stepping from 0.199 (b=1000) to 0.1665 (b=16000) with spread > 1e-2.',
  },
  {
    id: 'imp97467-honesty-gate-no-qed',
    holds: () =>
      IMP97467_VERDICT.qed === false &&
      IMP97467_VERDICT.flatTolerances.length === 3 &&
      IMP97467_VERDICT.bimodalTolerance === '1.0%' &&
      IMP97441_VERDICT.anyBoundMoved === false,
    why: 'measurement-only presentation: three flat tolerances, one bimodal tolerance, no bound moved upstream, NO QED.',
  },
];

for (const t of IMP97467_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97467-route-m-crossover-fraction-tolerance-ladder-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
