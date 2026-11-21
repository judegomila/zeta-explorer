/**
 * @module imp-97068-mirror-descent-poisson-kernel-viz-data
 * @fileoverview imp-97068 -- chart-ready reshape of the rh-bridge-mirror-descent-2026-09-25 PROVED
 *   pair (mirror) lemma A1: for every horizontal offset Delta > 0 and every a in [0, 2y],
 *   f(a) + f(2y - a) >= f(2y) = 2y/(Delta^2 + 4y^2), f(h) := h/(Delta^2 + h^2), equality only at
 *   a in {0, 2y} (a neighbour at the same height as the zero). This bakes two series: (1) the
 *   descent-kernel floor f(2y, Delta) as a function of Delta for three heights y (the seam y0 =
 *   0.165, y = 0.5, y = 1), showing how fast the guaranteed per-neighbour pull decays with
 *   horizontal offset; (2) the pair-lemma inequality itself at one fixed (y, Delta), plotting
 *   f(a) + f(2y-a) across a in [0, 2y] against its floor f(2y), so the "no dip below the floor"
 *   claim is directly legible. The A4 Poisson-domination best-constant limit (c = 3/4 at eta = 2y,
 *   never attained) is carried as a plain annotation, not re-derived. Presentation only; every
 *   number is computed with the imported f() verbatim; no new Lambda bound; the underlying
 *   theorem stays conditional (H_desc-mirror hypothesis open, pointwise NS-RIGID class);
 *   no refereed bound is changed; RH open; NO QED.
 *
 * @see rh-bridge-mirror-descent-2026-09-25.js (source: A1 pair lemma, A4 Poisson domination; f() reused verbatim)
 */

import { f } from './rh-bridge-mirror-descent-2026-09-25.js';

const KERNEL_Y_VALUES = Object.freeze([0.165, 0.5, 1]);
const KERNEL_COLORS = Object.freeze({ 0.165: '#f87171', 0.5: '#38bdf8', 1: '#4ade80' });
const DELTA_MAX = 5;
const DELTA_STEPS = 60;

function buildKernelSeries(y) {
  const points = [];
  for (let i = 0; i <= DELTA_STEPS; i++) {
    const D = (i / DELTA_STEPS) * DELTA_MAX;
    points.push({ x: D, y: f(2 * y, D) });
  }
  return Object.freeze({
    label: `y = ${y}`,
    y,
    color: KERNEL_COLORS[y],
    points: Object.freeze(points),
  });
}

// Series 1: descent-kernel floor f(2y, Delta) vs Delta, one curve per height y.
export const IMP97068_KERNEL_SERIES = Object.freeze(KERNEL_Y_VALUES.map(buildKernelSeries));

// Series 2: pair-lemma inequality at a fixed (y, Delta) -- f(a) + f(2y-a) across a in [0, 2y],
// compared against its floor f(2y). Chosen (y, Delta) = (0.5, 0.5): a mid-range, non-degenerate
// example where the floor is neither the D->0 nor the D->infinity limiting regime.
const PAIR_Y = 0.5;
const PAIR_D = 0.5;
const PAIR_A_STEPS = 80;

function buildPairLemmaCurve(y, D) {
  const points = [];
  for (let i = 0; i <= PAIR_A_STEPS; i++) {
    const a = (i / PAIR_A_STEPS) * (2 * y);
    points.push({ x: a, y: f(a, D) + f(2 * y - a, D) });
  }
  return Object.freeze(points);
}

export const IMP97068_PAIR_LEMMA_CURVE = Object.freeze({
  y: PAIR_Y,
  D: PAIR_D,
  floor: f(2 * PAIR_Y, PAIR_D),
  points: buildPairLemmaCurve(PAIR_Y, PAIR_D),
});

// A4 Poisson-domination annotation: at eta = 2y the best constant c(Y, y) = 2y/eta -> 3/4 as
// Y -> 2y from above, a limit never attained (Y = eta must exceed 2y). Plain literal, not a curve.
export const IMP97068_POISSON_DOMINATION_LIMIT = Object.freeze({
  label: 'eta = 2y best-constant limit (A4)',
  etaOverY: 2,
  bestConstant: 0.75,
  attained: false,
  note: 'c(Y, y) = 2y/eta for Y >= sqrt5*y; as Y -> 2y+ the constant tends to 3/4 but 2y itself is below the sqrt5*y threshold, so 3/4 is a limit, never attained.',
});

export const IMP97068_VERDICT = Object.freeze({
  ticket: 'imp-97068',
  pairLemmaProved: true,
  poissonDominationProved: true,
  bestConstantAttained: false,
  flowDescentTheoremConditional: true,
  hypothesisOpen: true,
  pointwiseClass: 'NS-RIGID',
  anyBoundMoved: false,
  operatorPositivityProved: false,
  ptLambdaSOTA: 0.2,
  qed: false,
});
export default IMP97068_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97068_ASSERTIONS = [
  {
    id: 'imp97068-kernel-series-three-heights',
    holds: () => IMP97068_KERNEL_SERIES.length === 3
      && IMP97068_KERNEL_SERIES.every((s) => s.points.length === DELTA_STEPS + 1),
    why: 'the descent-kernel floor f(2y, Delta) is plotted for exactly the three tabulated heights y0=0.165, 0.5, 1.',
  },
  {
    id: 'imp97068-kernel-at-delta-0-equals-1-over-2y',
    holds: () => IMP97068_KERNEL_SERIES.every((s) => Math.abs(s.points[0].y - 1 / (2 * s.y)) < 1e-9),
    why: 'at Delta=0, f(2y,0) = 2y/(2y)^2 = 1/(2y) (the self-term identity A2 building block).',
  },
  {
    id: 'imp97068-kernel-decays-with-delta',
    holds: () => IMP97068_KERNEL_SERIES.every((s) => s.points[s.points.length - 1].y < s.points[0].y),
    why: 'f(2y, Delta) is strictly decreasing in Delta for Delta > 0, so the guaranteed pull weakens with horizontal offset.',
  },
  {
    id: 'imp97068-pair-lemma-curve-never-dips-below-floor',
    holds: () => IMP97068_PAIR_LEMMA_CURVE.points.every((p) => p.y >= IMP97068_PAIR_LEMMA_CURVE.floor - 1e-9),
    why: 'A1 pair lemma: f(a)+f(2y-a) >= f(2y) for every a in [0,2y], the floor value being f(2y,Delta) itself.',
  },
  {
    id: 'imp97068-pair-lemma-curve-equality-only-at-endpoints',
    holds: () => {
      const pts = IMP97068_PAIR_LEMMA_CURVE.points;
      const first = pts[0];
      const last = pts[pts.length - 1];
      const interior = pts.slice(1, -1);
      return Math.abs(first.y - IMP97068_PAIR_LEMMA_CURVE.floor) < 1e-9
        && Math.abs(last.y - IMP97068_PAIR_LEMMA_CURVE.floor) < 1e-9
        && interior.every((p) => p.y > IMP97068_PAIR_LEMMA_CURVE.floor + 1e-6);
    },
    why: 'A1 equality holds only at a in {0, 2y} (a neighbour at the same height as the zero); every interior sample is strictly above the floor.',
  },
  {
    id: 'imp97068-poisson-limit-not-attained',
    holds: () => IMP97068_POISSON_DOMINATION_LIMIT.bestConstant === 0.75
      && IMP97068_POISSON_DOMINATION_LIMIT.attained === false,
    why: 'A4: the best constant c=3/4 at eta=2y is a limit never attained, since eta=2y sits below the sqrt5*y threshold where the c=2y/eta bound is proved.',
  },
  {
    id: 'imp97068-verdict-conditional-no-qed',
    holds: () => IMP97068_VERDICT.pairLemmaProved === true
      && IMP97068_VERDICT.flowDescentTheoremConditional === true
      && IMP97068_VERDICT.hypothesisOpen === true
      && IMP97068_VERDICT.anyBoundMoved === false
      && IMP97068_VERDICT.operatorPositivityProved === false
      && IMP97068_VERDICT.qed === false,
    why: 'the pair lemma and Poisson domination are proved elementary facts, but the flow-descent theorem built on them stays conditional (hypothesis open, pointwise NS-RIGID class); no new Lambda bound; NO QED.',
  },
];

for (const a of IMP97068_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97068-mirror-descent-poisson-kernel-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
