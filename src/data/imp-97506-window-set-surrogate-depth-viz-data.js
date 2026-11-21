/**
 * @module imp-97506-window-set-surrogate-depth-viz-data
 *
 * imp-97506 (ux): import-light viz-data leaf visualizing the imp-97481
 * RESULT 3 window-set surrogate limit vs min-prime P0 -- the exact Mertens
 * limit
 *     lim_Y surrogate([P0,Y]) = -c e^{-gamma} / Prod_{p<P0}(1-1/p)
 * that REFUTES the b/4-ceiling lower edge (T(b) >= -1/4): the primorial
 * (P0=2) sits at the SHALLOWEST floor, not the extremizer imp-97432/97461
 * assumed, and the limit sinks unboundedly below -1/4-R(1) as P0 grows.
 *
 * PRESENTATION ONLY. Every point is the imp-97481 IMP97481_KERNEL.windowLimit
 * closed form evaluated verbatim. Establishes no operator positivity;
 * changes no bound; the b/4-ceiling was exploratory Route-M, load-bearing
 * for nothing; kappa_arith unchanged; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-97481-route-m-quarter-ceiling-lower-edge-refuted-window-sets.js (the exact closed form, kernel, and verdict)
 *
 * Ticket: imp-97506 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP97481_KERNEL,
  IMP97481_VERDICT,
  IMP97481_HONEST_BANNER,
} from './imp-97481-route-m-quarter-ceiling-lower-edge-refuted-window-sets.js';

const { primesUpTo, windowLimit, R1 } = IMP97481_KERNEL;

// Primes up to 400 cover every P0 the imp-97481 module names by hand
// (2, 101, 379); the sieve is instant (well under 0.05s) so this leaf
// stays import-light -- no heavy zeros bundle, no external data file.
const PRIMES_TO_400 = primesUpTo(400);

export const IMP97506_CURVE = Object.freeze(
  PRIMES_TO_400.map((P0) =>
    Object.freeze({
      P0,
      limit: windowLimit(PRIMES_TO_400.filter((p) => p < P0)),
    }),
  ),
);

export const IMP97506_CEILING_LINE = Object.freeze({
  lowerEdge: -0.25, // the b/4-ceiling lower edge T(b) >= -1/4
  lowerEdgeMinusR1: -0.25 - R1, // threshold the surrogate limit alone must clear
});

export const IMP97506_VERDICT = Object.freeze({
  ticket: 'imp-97506',
  sourceTicket: 'imp-97481',
  claim:
    'charts the imp-97481 RESULT 3 window-set surrogate limit -c e^{-gamma}/Prod_{p<P0}(1-1/p) vs min-prime P0: ' +
    'the primorial (P0=2) sits at the SHALLOWEST floor -0.046788, and the limit sinks unboundedly (-0.388874 at ' +
    'P0=101, -0.497500 at P0=379), crossing the -1/4-R(1)=-0.251246 threshold well before P0=101 -- refuting the ' +
    'imp-97461 primorial-extremizer premise and the b/4-ceiling lower edge.',
  pointsReusedVerbatim: true,
  operatorPositivityProved: false,
  boundMoves: false,
  qed: false,
});
export default IMP97506_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97506_ASSERTIONS = [
  {
    id: 'imp97506-curve-endpoints-match-imp97481',
    holds: () => {
      const p2 = IMP97506_CURVE.find((pt) => pt.P0 === 2);
      const p101 = IMP97506_CURVE.find((pt) => pt.P0 === 101);
      const p379 = IMP97506_CURVE.find((pt) => pt.P0 === 379);
      return (
        p2 && Math.abs(p2.limit - -0.046788) < 1e-5 &&
        p101 && Math.abs(p101.limit - -0.388874) < 1e-5 &&
        p379 && Math.abs(p379.limit - -0.497500) < 1e-5
      );
    },
    why: 'the charted curve must reproduce the imp-97481 named RESULT 3 anchors exactly (P0=2,101,379).',
  },
  {
    id: 'imp97506-curve-monotone-descending',
    holds: () => {
      for (let i = 1; i < IMP97506_CURVE.length; i++) {
        if (!(IMP97506_CURVE[i].limit < IMP97506_CURVE[i - 1].limit)) return false;
      }
      return true;
    },
    why: 'the window limit sinks strictly deeper as the min prime P0 grows (unbounded below by Mertens 3rd), so charted points must be strictly decreasing.',
  },
  {
    id: 'imp97506-primorial-is-shallowest-not-extremal',
    holds: () =>
      IMP97506_CURVE[0].P0 === 2 &&
      IMP97506_CURVE[0].limit === Math.max(...IMP97506_CURVE.map((pt) => pt.limit)),
    why: 'the primorial (P0=2) must be the shallowest (least negative) point on the curve, refuting the imp-97461 primorial-extremizer premise.',
  },
  {
    id: 'imp97506-limit-crosses-lower-edge-threshold-by-P0-101',
    holds: () => {
      const p101 = IMP97506_CURVE.find((pt) => pt.P0 === 101);
      return p101.limit < IMP97506_CEILING_LINE.lowerEdgeMinusR1;
    },
    why: 'by P0=101 the surrogate limit must already be below -1/4-R(1), so adding the (positive, tiny) Rcorr still lands T(b) below -1/4 for a finite window b.',
  },
  {
    id: 'imp97506-measurement-only-no-qed',
    holds: () =>
      IMP97506_VERDICT.pointsReusedVerbatim === true &&
      IMP97506_VERDICT.operatorPositivityProved === false &&
      IMP97506_VERDICT.boundMoves === false &&
      IMP97506_VERDICT.qed === false &&
      IMP97481_VERDICT.qed === false &&
      /NO QED/.test(IMP97481_HONEST_BANNER),
    why: 'presentation only: points reused verbatim from imp-97481; no operator positivity; no bound moves; NO QED.',
  },
];

for (const t of IMP97506_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97506-window-set-surrogate-depth-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
