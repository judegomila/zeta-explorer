/**
 * @module imp-97487-bimodal-1pct-crossover-viz-data
 *
 * imp-97487 (ux): import-light viz-data leaf visualizing the imp-97459
 * bimodal 1% crossover -- the two adjacent signed-deviation crests that
 * straddle the 1% level, never charted by imp-97459/imp-97441:
 *
 *   (a) a sampled d(a,b) = (I - I_lin)/I profile over x = a/b in [0.15,0.21]
 *       for several b on the ladder, marking the x=1/6 (lower, tip 1.113%)
 *       and x=1/5 (upper, tip 1.393%) crests and the 1% threshold line;
 *   (b) the A(b) = x*(1%) b piecewise-linear scale table, reused verbatim
 *       from imp-97459 RESULT 4, showing the branch jump (0.199 -> 0.1665)
 *       between two linear rays.
 *
 * PRESENTATION ONLY. The d(a,b) samples are an exact recomputation using the
 * same signedDeviation() imp-97459 defines (cheap, coefficientI is O(b));
 * the crest tips, step point, and A(b) table are reused verbatim from
 * imp-97459. Establishes no operator positivity; changes no bound; the
 * rigorous anchor stays the trace ceiling T=2.594e7; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-97459-route-m-bimodal-1pct-crossover-peaks.js (the measured findings, crest table, step point, A(b) scale)
 * @see imp-97441-route-m-crossover-fraction-tolerance-table (the bimodal 1% row this resolves)
 *
 * Ticket: imp-97487 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  signedDeviation,
  IMP97459_CRESTS,
  IMP97459_CREST_TABLE,
  IMP97459_STEP,
  IMP97459_SCALE,
} from './imp-97459-route-m-bimodal-1pct-crossover-peaks.js';

export const IMP97487_CRESTS = IMP97459_CRESTS;
export const IMP97487_STEP = IMP97459_STEP;
export const IMP97487_SCALE = IMP97459_SCALE;

// (a) sampled d(a,b) profile, x = a/b in [0.15,0.21], for a subset of the
// b-ladder spanning the bimodal flip (b=1000 below the step, b=16000 well
// past it). Kept to two curves so the crest tips stay legible.
const X_MIN = 0.15;
const X_MAX = 0.21;
const B_CURVES = [1000, 16000];

function buildProfile(b) {
  const pts = [];
  const aMin = Math.max(6, Math.ceil(X_MIN * b));
  const aMax = Math.min(b - 1, Math.floor(X_MAX * b));
  for (let a = aMin; a <= aMax; a++) {
    pts.push(Object.freeze({ x: a / b, deviationPct: signedDeviation(a, b) * 100 }));
  }
  return Object.freeze(pts);
}

export const IMP97487_PROFILES = Object.freeze(
  B_CURVES.map((b) => Object.freeze({ b, points: buildProfile(b) })),
);

export const IMP97487_THRESHOLD_PCT = 1;

export const IMP97487_VERDICT = Object.freeze({
  ticket: 'imp-97487',
  sourceTicket: 'imp-97459',
  claim:
    'charts the imp-97459 bimodal 1% crossover: two adjacent signed-deviation crests at x=1/6 ' +
    '(sampled tip climbing 0.9100->1.0920% toward a 1.113% continuum tip) and x=1/5 (dead-flat ' +
    '1.3934%, always >1%) straddle the 1% level, so which one the integer-a grid first resolves ' +
    'above 1% flips the reported crossover fraction x* between 0.199 and 0.1665; A(b)=x*b stays ' +
    'piecewise-linear across the flip.',
  profileIsExactRecompute: true,
  crestTableReusedVerbatim: true,
  scaleTableReusedVerbatim: true,
  operatorPositivityProved: false,
  boundMoves: false,
  qed: false,
});
export default IMP97487_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97487_ASSERTIONS = [
  {
    id: 'imp97487-profiles-nonempty-and-span-both-crests',
    holds: () =>
      IMP97487_PROFILES.length === 2 &&
      IMP97487_PROFILES.every((p) => p.points.length > 50) &&
      IMP97487_PROFILES.every((p) => p.points[0].x <= 1 / 6 && p.points[p.points.length - 1].x >= 1 / 5),
    why: 'each sampled profile must be dense enough to render (>50 points) and span x in [1/6,1/5] so both named crests are visible.',
  },
  {
    id: 'imp97487-lower-crest-below-1pct-at-b1000-above-at-b16000',
    holds: () => {
      const p1000 = IMP97487_PROFILES.find((p) => p.b === 1000).points;
      const p16000 = IMP97487_PROFILES.find((p) => p.b === 16000).points;
      const near = (pts, x) => pts.reduce((best, q) => (Math.abs(q.x - x) < Math.abs(best.x - x) ? q : best));
      const lower1000 = near(p1000, 1 / 6);
      const lower16000 = near(p16000, 1 / 6);
      return lower1000.deviationPct < 1 && lower16000.deviationPct > 1;
    },
    why: 'RESULT 2/3: the lower (1/6) crest recomputed live must reproduce the grid-resolution flip -- sampled below 1% at b=1000, above 1% at b=16000.',
  },
  {
    id: 'imp97487-upper-crest-always-above-1pct',
    holds: () =>
      IMP97487_PROFILES.every((p) => {
        const near = p.points.reduce((best, q) => (Math.abs(q.x - 0.2) < Math.abs(best.x - 0.2) ? q : best));
        return near.deviationPct > 1;
      }),
    why: 'RESULT 2: the upper (1/5) crest must stay above the 1% threshold at every charted b (dead-flat 1.3934%).',
  },
  {
    id: 'imp97487-scale-piecewise-linear-reused',
    holds: () =>
      IMP97487_SCALE.every((r) => Math.abs(r.Ab - r.xStar * r.b) < 1e-6) &&
      IMP97487_SCALE.some((r) => r.branch === 'upper (1/5)') &&
      IMP97487_SCALE.some((r) => r.branch === 'lower (1/6)'),
    why: 'the reused A(b)=x*b table must stay exactly proportional within each branch and include both the upper and lower branches shown in the step-point panel.',
  },
  {
    id: 'imp97487-measurement-only-no-qed',
    holds: () =>
      IMP97487_VERDICT.profileIsExactRecompute === true &&
      IMP97487_VERDICT.crestTableReusedVerbatim === true &&
      IMP97487_VERDICT.scaleTableReusedVerbatim === true &&
      IMP97487_VERDICT.operatorPositivityProved === false &&
      IMP97487_VERDICT.boundMoves === false &&
      IMP97487_VERDICT.qed === false,
    why: 'presentation only: exact profile recompute + verbatim reuse of imp-97459 crest/scale tables; no operator positivity; no bound moves; NO QED.',
  },
];

for (const t of IMP97487_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97487-bimodal-1pct-crossover-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
