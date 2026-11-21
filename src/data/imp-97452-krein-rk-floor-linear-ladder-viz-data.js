/**
 * @module imp-97452-krein-rk-floor-linear-ladder-viz-data
 *
 * imp-97452 (ux): import-light viz-data leaf visualizing the imp-97431
 * measurement that the imp-97399 reproducing-kernel Krein floor
 *
 *   floor(a) = -(a/pi) * 18301.61
 *
 * is EXACTLY LINEAR in the half-width a across the band 2a in (0, ln3], and
 * NEVER crosses zero within the interval-rigorous reach 2a <= 0.96 -- nor at
 * the binding (out-of-reach) 2a = ln3. This module reshapes the imp-97431
 * ladder (imported directly, no transcription) into a line-chart series
 * spanning the reach and the vacuous a -> 0 limit, marking the reach-limit
 * and binding rungs.
 *
 * PRESENTATION ONLY. Reuses the imp-97431 floor ladder verbatim; no re-solve.
 * Establishes no operator positivity; changes no bound; interval-rigorous
 * certificate reach stays 2a<=0.96; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-97431-krein-rk-floor-band-dependence.js (the linear-in-a floor law, measured ladder)
 * @see imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js (the floor at the binding 2a=ln3)
 *
 * Ticket: imp-97452 (ux, sonnet-4-6, medium). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  rkFloor,
  IMP97431_FLOOR_LADDER,
  IMP97431_NEG_AREA_FULL_LINE,
  IMP97431_RIGOROUS_REACH_2A,
  IMP97431_BINDING_2A,
  IMP97431_VERDICT,
} from './imp-97431-krein-rk-floor-band-dependence.js';

export const IMP97452_REACH_2A = IMP97431_RIGOROUS_REACH_2A;
export const IMP97452_BINDING_2A = IMP97431_BINDING_2A;
export const IMP97452_NEG_AREA = IMP97431_NEG_AREA_FULL_LINE;

// Dense line series over 2a in (0, ln3], well past the reach for context.
export const IMP97452_CURVE = Object.freeze(
  Array.from({ length: 221 }, (_, i) => {
    const twoA = (i / 220) * IMP97431_BINDING_2A;
    const a = twoA / 2;
    return Object.freeze({ twoA, floor: rkFloor(a) });
  })
);

// The discrete measured rungs from imp-97431, reused verbatim for markers.
export const IMP97452_RUNGS = IMP97431_FLOOR_LADDER;

export const IMP97452_REACH_FLOOR = rkFloor(IMP97452_REACH_2A / 2);
export const IMP97452_BINDING_FLOOR = rkFloor(IMP97452_BINDING_2A / 2);

export const IMP97452_VERDICT = Object.freeze({
  ticket: 'imp-97452',
  sourceTicket: 'imp-97431',
  claim:
    'floor(a) = -(a/pi)*18301.61 is exactly linear in a and stays strictly negative for every 2a in (0, ln3], including throughout the interval-rigorous reach 2a<=0.96; it approaches 0 only in the vacuous a->0 limit, which is never attained in reach.',
  floorNeverCrossesZeroInReach: IMP97431_VERDICT.floorCrossesZeroInReach === false,
  reachFloor: IMP97452_REACH_FLOOR,
  bindingFloor: IMP97452_BINDING_FLOOR,
  qed: false,
});
export default IMP97452_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97452_ASSERTIONS = [
  {
    id: 'imp97452-curve-matches-source-ladder',
    holds: () => {
      // every imp-97431 rung must match a same-2a point recomputed by rkFloor here
      return IMP97452_RUNGS.every((r) => Math.abs(rkFloor(r.a) - r.floor) < 1e-9);
    },
    why: 'the viz curve must reuse the exact imp-97431 rkFloor function, not a re-derivation.',
  },
  {
    id: 'imp97452-curve-strictly-negative-and-monotone',
    holds: () => {
      const pts = IMP97452_CURVE.filter((p) => p.twoA > 0);
      const allNeg = pts.every((p) => p.floor < 0);
      // magnitude increases monotonically with 2a (floor decreases as 2a grows)
      let monotone = true;
      for (let i = 1; i < IMP97452_CURVE.length; i++) {
        if (IMP97452_CURVE[i].floor > IMP97452_CURVE[i - 1].floor + 1e-9) monotone = false;
      }
      return allNeg && monotone;
    },
    why: 'floor(a) = -(a/pi)*18301.61 is strictly negative for a>0 and strictly decreasing as 2a grows, per the imp-97431 finding.',
  },
  {
    id: 'imp97452-reach-and-binding-rungs-match',
    holds: () =>
      Math.abs(IMP97452_REACH_FLOOR - -2796.281) < 0.5 &&
      Math.abs(IMP97452_BINDING_FLOOR - -3200.030) < 0.5 &&
      IMP97452_REACH_2A === 0.96 &&
      Math.abs(IMP97452_BINDING_2A - Math.log(3)) < 1e-12,
    why: 'the reach-limit (2a=0.96) and binding (2a=ln3, out of reach) floor values must match the imp-97431 measured magnitudes.',
  },
  {
    id: 'imp97452-measurement-only-no-qed',
    holds: () => IMP97452_VERDICT.floorNeverCrossesZeroInReach === true && IMP97452_VERDICT.qed === false,
    why: 'presentation only: reuses the imp-97431 verdict that the floor never crosses zero in reach; NO QED.',
  },
];

for (const t of IMP97452_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97452-krein-rk-floor-linear-ladder-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
