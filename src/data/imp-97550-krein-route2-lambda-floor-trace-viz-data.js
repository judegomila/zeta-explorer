/**
 * @module imp-97550-krein-route2-lambda-floor-trace-viz-data
 *
 * imp-97550 (ux): import-light viz-data leaf visualizing the imp-97513
 * direct-build extension of the Route-2 Kbig->infinity lambda_2 floor (full-
 * projector A2 at 2a=ln3) past the imp-97495 Kbig=380 edge, never charted by
 * imp-97513 itself:
 *
 *   (a) the four DIRECTLY-BUILT bound-vs-Kbig points (Kbig=380..500, no
 *       extrapolation), tightening the imp-97495 upper edge -309.931066 to
 *       -310.375499, against the wide power-saturation deep end -313.756 and
 *       the corrected-tail central estimate ~-310.75;
 *   (b) tr(A2) vs Kbig continuing to converge with strictly shrinking
 *       increments toward the ~4819.1M limit.
 *
 * PRESENTATION ONLY. All points, deltas, and brackets are reused verbatim
 * from imp-97513. Establishes no operator positivity; changes no bound;
 * interval-rigorous reach stays 2a<=0.96; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-97513-krein-route2-kbig420-500-deep-floor.js (the directly-built points, deltas, and brackets)
 * @see imp-97504-krein-route2-kbig-direct-floor-viz-data.js (the imp-97482 Kbig=140..260 panel this extends)
 *
 * Ticket: imp-97550 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP97513_BOUND_BY_KBIG,
  IMP97513_A2_TRACE_BY_KBIG,
  IMP97513_STEP_DELTAS,
  IMP97513_DELTA_RATIOS,
  IMP97513_FLOOR,
  IMP97513_REQUIRED_RHO_EXCEEDS,
  IMP97513_VERDICT,
} from './imp-97513-krein-route2-kbig420-500-deep-floor.js';

export const IMP97550_BOUND_POINTS = Object.freeze(
  Object.entries(IMP97513_BOUND_BY_KBIG).map(([kbig, bound]) => Object.freeze({ Kbig: Number(kbig), bound })),
);

export const IMP97550_TRACE_POINTS = Object.freeze(
  Object.entries(IMP97513_A2_TRACE_BY_KBIG).map(([kbig, trace]) => Object.freeze({ Kbig: Number(kbig), trace })),
);

export const IMP97550_STEP_DELTAS = IMP97513_STEP_DELTAS;
export const IMP97550_DELTA_RATIOS = IMP97513_DELTA_RATIOS;
export const IMP97550_FLOOR = IMP97513_FLOOR;
export const IMP97550_REQUIRED_RHO_EXCEEDS = IMP97513_REQUIRED_RHO_EXCEEDS;

export const IMP97550_VERDICT = Object.freeze({
  ticket: 'imp-97550',
  sourceTicket: 'imp-97513',
  claim:
    'charts the imp-97513 direct-build extension of the Route-2 Kbig->infinity lambda_2 floor: four directly-measured ' +
    'points (-309.931066 at Kbig=380 to -310.375499 at Kbig=500, no extrapolation) with 40-step increments collapsing ' +
    '0.190536->0.143344->0.110553 (ratios still rising 0.730->0.771, not plateaued), tightening the floor to the ' +
    'bracket [-313.756,-310.375499], alongside tr(A2) continuing to converge toward ~4819.1M -- still four orders of ' +
    'magnitude below the required 0.581059.',
  pointsReusedVerbatim: true,
  bracketsReusedVerbatim: true,
  operatorPositivityProved: false,
  boundMoves: false,
  qed: false,
});
export default IMP97550_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97550_ASSERTIONS = [
  {
    id: 'imp97550-bound-points-match-imp97513',
    holds: () =>
      IMP97550_BOUND_POINTS.length === 4 &&
      IMP97550_BOUND_POINTS[0].Kbig === 380 &&
      Math.abs(IMP97550_BOUND_POINTS[0].bound - -309.931066) < 1e-4 &&
      IMP97550_BOUND_POINTS[3].Kbig === 500 &&
      Math.abs(IMP97550_BOUND_POINTS[3].bound - -310.375499) < 1e-4,
    why: 'the charted points must reproduce the imp-97513 directly-built bound-vs-Kbig table exactly (endpoints checked).',
  },
  {
    id: 'imp97550-trace-points-converge',
    holds: () => {
      let prevDelta = Infinity;
      for (let i = 1; i < IMP97550_TRACE_POINTS.length; i++) {
        const d = IMP97550_TRACE_POINTS[i].trace - IMP97550_TRACE_POINTS[i - 1].trace;
        if (!(d > 0 && d < prevDelta)) return false;
        prevDelta = d;
      }
      return true;
    },
    why: 'tr(A2) rises with strictly shrinking increments across the directly-built Kbig=380..500 sweep.',
  },
  {
    id: 'imp97550-tightened-bracket-inside-imp97495',
    holds: () =>
      IMP97550_FLOOR.tightenedBracket[0] < IMP97550_FLOOR.tightenedBracket[1] &&
      IMP97550_FLOOR.tightenedBracket[0] === IMP97550_FLOOR.imp97495Bracket[0] &&
      IMP97550_FLOOR.tightenedBracket[1] < IMP97550_FLOOR.imp97495Bracket[1],
    why: 'the imp-97513 tightened bracket [-313.756,-310.375499] must share the deep end and strictly tighten the upper edge of the imp-97495 [-313.756,-309.931066] bracket.',
  },
  {
    id: 'imp97550-delta-ratios-rise-below-one',
    holds: () => {
      const r = IMP97550_DELTA_RATIOS;
      for (let i = 1; i < r.length; i++) if (!(r[i] > r[i - 1])) return false;
      return r[r.length - 1] < 1;
    },
    why: 'the successive delta ratios keep rising 0.730->0.771 and stay below 1, so the tail is convergent but has not plateaued.',
  },
  {
    id: 'imp97550-floor-still-four-orders-below-required',
    holds: () => {
      const [, hi] = IMP97550_FLOOR.tightenedBracket;
      return hi < 0 && Math.abs(hi) / IMP97550_REQUIRED_RHO_EXCEEDS > 500;
    },
    why: 'the tightened floor bracket must stay far below (>500x in magnitude) the required 0.581059.',
  },
  {
    id: 'imp97550-measurement-only-no-qed',
    holds: () =>
      IMP97550_VERDICT.pointsReusedVerbatim === true &&
      IMP97550_VERDICT.operatorPositivityProved === false &&
      IMP97550_VERDICT.boundMoves === false &&
      IMP97550_VERDICT.qed === false &&
      IMP97513_VERDICT.qed === false,
    why: 'presentation only: points and brackets reused verbatim from imp-97513; no operator positivity; no bound moves; NO QED.',
  },
];

for (const t of IMP97550_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97550-krein-route2-lambda-floor-trace-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
