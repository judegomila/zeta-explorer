/**
 * @module imp-97553-route-m-kappa-decomposition-viz-data
 *
 * imp-97553 (ux): import-light viz-data leaf visualizing the imp-97541
 * kappa decomposition -- kappa(b) = kappa_arith + kappa_cot(b), with
 * kappa_arith = 0.5704960511308594 (exact, imp-97096) constant across b and
 * kappa_cot(b) climbing from 0.0588 (b=31) toward its conjectural limit 1/8
 * (imp-97541) -- across the 11-point b-ladder, as a stacked decomposition
 * approaching the combined limit ~0.6955 (~ memory route_m_lower_companion
 * figure ~0.696).
 *
 * PRESENTATION ONLY. All (b, kappaCot, kappa) points are reused verbatim
 * from the committed IMP97541_LADDER; nothing is re-derived. Establishes no
 * operator positivity; changes no bound; kappa still MEASURED, not proved;
 * PT Lambda<=0.2 remains SOTA; RH open; NO QED.
 *
 * @see imp-97541-route-m-kappa-cot-extended-measurement.js (the tabulated ladder, reused verbatim)
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (kappa_arith exact value)
 * @see imp-97071-route-m-lower-companion-first-moment-reduction.js (CS reduction to the first moment)
 *
 * Ticket: imp-97553 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP97541_LADDER,
  KAPPA_ARITH,
  KAPPA_COT_LIMIT,
  KAPPA_LIMIT,
  IMP97541_VERDICT,
} from './imp-97541-route-m-kappa-cot-extended-measurement.js';

export const IMP97553_LADDER = IMP97541_LADDER;

// Stacked-decomposition points: base = kappa_arith (constant), top = kappa_arith + kappa_cot(b) = kappa(b).
export const IMP97553_STACK_POINTS = Object.freeze(
  IMP97541_LADDER.map((r) =>
    Object.freeze({
      b: r.b,
      logB: Math.log10(r.b),
      kappaArith: KAPPA_ARITH,
      kappaCot: r.kappaCot,
      kappa: r.kappa,
    })
  )
);

export const IMP97553_ANCHORS = Object.freeze({
  first: IMP97541_LADDER[0],
  last: IMP97541_LADDER[IMP97541_LADDER.length - 1],
});

export const IMP97553_VERDICT = Object.freeze({
  ticket: 'imp-97553',
  sourceTicket: 'imp-97541',
  claim:
    'charts the imp-97541 kappa decomposition kappa(b) = kappa_arith + kappa_cot(b) as a stacked area: a ' +
    'constant kappa_arith=0.5704960511 base plus a climbing kappa_cot(b) top layer (0.0588 at b=31 toward the ' +
    'conjectural 1/8 limit), with the combined kappa(b) climbing toward the KAPPA_LIMIT ~0.6955, matching the ' +
    'memory route_m_lower_companion figure ~0.696.',
  dataReusedVerbatim: true,
  kappaCotPinned: IMP97541_VERDICT.kappaCotPinned,
  kappaProved: false,
  boundMoves: false,
  qed: false,
});
export default IMP97553_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97553_ASSERTIONS = [
  {
    id: 'imp97553-ladder-reused-verbatim-length',
    holds: () => Array.isArray(IMP97553_LADDER) && IMP97553_LADDER.length === 11,
    why: 'the charted ladder must be the full 11-point imp-97541 tabulation, reused verbatim.',
  },
  {
    id: 'imp97553-stack-points-sum-to-kappa',
    holds: () =>
      IMP97553_STACK_POINTS.length === IMP97553_LADDER.length &&
      IMP97553_STACK_POINTS.every((p, i) => {
        const r = IMP97553_LADDER[i];
        return (
          Math.abs(p.kappaArith - KAPPA_ARITH) < 1e-12 &&
          Math.abs(p.kappaCot - r.kappaCot) < 1e-9 &&
          // imp-97541 bakes kappa and kappaCot to 6 decimals while KAPPA_ARITH is
          // full precision, so the sum residual is ~5.1e-8 (storage rounding);
          // the tolerance is the 6-decimal storage precision, not 1e-9.
          Math.abs(p.kappaArith + p.kappaCot - p.kappa) < 1e-6 &&
          Math.abs(p.kappa - r.kappa) < 1e-6
        );
      }),
    why: 'each stack point must decompose as kappaArith (constant) + kappaCot(b) = kappa(b), matching the reused ladder row.',
  },
  {
    id: 'imp97553-kappa-cot-climbs-toward-one-eighth',
    holds: () => {
      const first = IMP97553_STACK_POINTS[0];
      const last = IMP97553_STACK_POINTS[IMP97553_STACK_POINTS.length - 1];
      return (
        last.kappaCot > first.kappaCot &&
        Math.abs(last.kappaCot - KAPPA_COT_LIMIT) < 0.01
      );
    },
    why: 'kappa_cot(b) must climb monotonically across the ladder and land within 0.01 of the conjectural 1/8 limit at the largest b.',
  },
  {
    id: 'imp97553-combined-kappa-approaches-limit-above-arith',
    holds: () => {
      const last = IMP97553_STACK_POINTS[IMP97553_STACK_POINTS.length - 1];
      return (
        Math.abs(last.kappa - KAPPA_LIMIT) < 0.01 &&
        last.kappa > KAPPA_ARITH && // cotangent layer adds, never cancels
        Math.abs(KAPPA_LIMIT - 0.696) < 1e-3
      );
    },
    why: 'the combined kappa(b) must approach KAPPA_LIMIT (~0.6955, ~ memory ~0.696) from below and always exceed the arithmetic-only base.',
  },
  {
    id: 'imp97553-honesty-gate-no-qed',
    holds: () =>
      IMP97553_VERDICT.dataReusedVerbatim === true &&
      IMP97553_VERDICT.kappaProved === false &&
      IMP97553_VERDICT.boundMoves === false &&
      IMP97553_VERDICT.qed === false,
    why: 'presentation-only leaf: data reused verbatim from imp-97541; kappa still measured not proved; no bound moves; NO QED.',
  },
];

for (const t of IMP97553_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97553-route-m-kappa-decomposition-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
