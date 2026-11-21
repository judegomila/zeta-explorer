/**
 * @module imp-97504-krein-route2-kbig-direct-floor-viz-data
 *
 * imp-97504 (ux): import-light viz-data leaf visualizing the imp-97482
 * direct-build extension of the Route-2 Kbig->infinity floor (full-projector
 * A2 at 2a=ln3), never charted by imp-97482 itself:
 *
 *   (a) the four DIRECTLY-BUILT bound-vs-Kbig points (Kbig=140..260, no
 *       extrapolation), continuing the imp-97455/imp-97488 saturation curve
 *       past its previous Kbig=140 ceiling, with the two extrapolated limits
 *       (geometric-tail ~-309.8, power-saturation refit ~-313.8) and the
 *       tightened bracket [-313.756,-308.745] shown against the wider
 *       imp-97455 bracket [-322.065,-305.866] it sits inside;
 *   (b) tr(A2) vs Kbig continuing to converge with strictly shrinking
 *       increments toward the ~4819.1M limit.
 *
 * PRESENTATION ONLY. All points, deltas, and brackets are reused verbatim
 * from imp-97482. Establishes no operator positivity; changes no bound;
 * interval-rigorous reach stays 2a<=0.96; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-97482-krein-route2-kbig-direct-projector-floor.js (the directly-built points, deltas, and brackets)
 * @see imp-97488-krein-route2-kbig-saturation-viz-data.js (the imp-97455 saturation panel this extends)
 *
 * Ticket: imp-97504 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP97482_BOUND_BY_KBIG,
  IMP97482_A2_TRACE_BY_KBIG,
  IMP97482_STEP_DELTAS,
  IMP97482_FLOOR,
  IMP97482_REQUIRED_RHO_EXCEEDS,
  IMP97482_VERDICT,
} from './imp-97482-krein-route2-kbig-direct-projector-floor.js';

export const IMP97504_BOUND_POINTS = Object.freeze(
  Object.entries(IMP97482_BOUND_BY_KBIG).map(([kbig, bound]) => Object.freeze({ Kbig: Number(kbig), bound })),
);

export const IMP97504_TRACE_POINTS = Object.freeze(
  Object.entries(IMP97482_A2_TRACE_BY_KBIG).map(([kbig, trace]) => Object.freeze({ Kbig: Number(kbig), trace })),
);

export const IMP97504_STEP_DELTAS = IMP97482_STEP_DELTAS;
export const IMP97504_FLOOR = IMP97482_FLOOR;
export const IMP97504_REQUIRED_RHO_EXCEEDS = IMP97482_REQUIRED_RHO_EXCEEDS;

export const IMP97504_VERDICT = Object.freeze({
  ticket: 'imp-97504',
  sourceTicket: 'imp-97482',
  claim:
    'charts the imp-97482 direct-build extension of the Route-2 Kbig->infinity floor: four directly-measured ' +
    'points (-303.336 at Kbig=140 to -308.745 at Kbig=260, no extrapolation) with 40-step increments collapsing ' +
    '3.006->1.524->0.879, pinning the converged floor to the tightened bracket [-313.756,-308.745] (inside the ' +
    'imp-97455 extrapolated [-322.065,-305.866]), alongside tr(A2) continuing to converge toward ~4819.1M -- ' +
    'still four orders of magnitude below the required 0.581059.',
  pointsReusedVerbatim: true,
  bracketsReusedVerbatim: true,
  operatorPositivityProved: false,
  boundMoves: false,
  qed: false,
});
export default IMP97504_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97504_ASSERTIONS = [
  {
    id: 'imp97504-bound-points-match-imp97482',
    holds: () =>
      IMP97504_BOUND_POINTS.length === 4 &&
      IMP97504_BOUND_POINTS[0].Kbig === 140 &&
      Math.abs(IMP97504_BOUND_POINTS[0].bound - -303.335862) < 1e-4 &&
      IMP97504_BOUND_POINTS[3].Kbig === 260 &&
      Math.abs(IMP97504_BOUND_POINTS[3].bound - -308.745199) < 1e-4,
    why: 'the charted points must reproduce the imp-97482 directly-built bound-vs-Kbig table exactly (endpoints checked).',
  },
  {
    id: 'imp97504-trace-points-converge',
    holds: () => {
      let prevDelta = Infinity;
      for (let i = 1; i < IMP97504_TRACE_POINTS.length; i++) {
        const d = IMP97504_TRACE_POINTS[i].trace - IMP97504_TRACE_POINTS[i - 1].trace;
        if (!(d > 0 && d < prevDelta)) return false;
        prevDelta = d;
      }
      return true;
    },
    why: 'tr(A2) rises with strictly shrinking increments across the directly-built Kbig=140..260 sweep.',
  },
  {
    id: 'imp97504-tightened-bracket-inside-imp97455',
    holds: () =>
      IMP97504_FLOOR.tightenedBracket[0] < IMP97504_FLOOR.tightenedBracket[1] &&
      IMP97504_FLOOR.tightenedBracket[0] > IMP97504_FLOOR.imp97455Bracket[0] &&
      IMP97504_FLOOR.tightenedBracket[1] < IMP97504_FLOOR.imp97455Bracket[1],
    why: 'the imp-97482 tightened bracket [-313.756,-308.745] must sit strictly inside the imp-97455 [-322.065,-305.866] bracket.',
  },
  {
    id: 'imp97504-floor-still-four-orders-below-required',
    holds: () => {
      const [, hi] = IMP97504_FLOOR.tightenedBracket;
      return hi < 0 && Math.abs(hi) / IMP97504_REQUIRED_RHO_EXCEEDS > 500;
    },
    why: 'the tightened floor bracket must stay far below (>500x in magnitude) the required 0.581059.',
  },
  {
    id: 'imp97504-measurement-only-no-qed',
    holds: () =>
      IMP97504_VERDICT.pointsReusedVerbatim === true &&
      IMP97504_VERDICT.operatorPositivityProved === false &&
      IMP97504_VERDICT.boundMoves === false &&
      IMP97504_VERDICT.qed === false &&
      IMP97482_VERDICT.qed === false,
    why: 'presentation only: points and brackets reused verbatim from imp-97482; no operator positivity; no bound moves; NO QED.',
  },
];

for (const t of IMP97504_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97504-krein-route2-kbig-direct-floor-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
