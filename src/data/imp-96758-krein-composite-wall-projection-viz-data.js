/**
 * @module imp-96758-krein-composite-wall-projection-viz-data
 *
 * imp-96758 (ux): import-light viz-data leaf for the imp-96732 Route I Krein
 * composite-wall projection. Reshapes the two baked projections -- the
 * certified LP design-margin decay eps(2a) = 200(1 - 2a) and the tail atom
 * l1-norm blow-up log10(l1) ~ 73.254*(2a) - 64.238 -- into two chart-ready
 * series over the disputed window 2a in {0.96, 0.98, 0.99, 1.00, 1.0134, ln3},
 * with the 2a = 1.0 transition (margin vanishes while l1 is still modest)
 * marked explicitly.
 *
 * PRESENTATION ONLY. Every value here is reused verbatim from the imp-96732
 * IMP96732_RUNGS / IMP96732_WALLS / IMP96732_VERDICT records; only the
 * two-series chart reshape is new. Changes no bound, establishes no operator
 * positivity, no RH claim; no refereed bound is changed.
 * RH open. NO QED.
 *
 * @see imp-96732-krein-extended-precision-reach-assessment.js (source projection)
 *
 * Ticket: imp-96758 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 *
 * Import-light: only re-exports/reshapes imp-96732 (itself import-light,
 * no zeros bundle, no sibling imports).
 */

import {
  IMP96732_RUNGS,
  IMP96732_WALLS,
  IMP96732_VERDICT,
} from './imp-96732-krein-extended-precision-reach-assessment.js';

// Two chart-ready series over the disputed window, keyed by 2a.
export const IMP96758_EPS_MARGIN_SERIES = Object.freeze(
  IMP96732_RUNGS.map((r) => ({ twoA: r.twoA, eps: r.eps, marginPositive: r.marginPositive })),
);

export const IMP96758_L1_BLOWUP_SERIES = Object.freeze(
  IMP96732_RUNGS.map((r) => ({ twoA: r.twoA, l1: r.projL1, log10L1: Math.log10(r.projL1), log2L1: r.log2L1 })),
);

// The 2a = 1.0 transition: eps margin vanishes while l1 is still modest.
export const IMP96758_TRANSITION_MARKER = Object.freeze({
  twoA: IMP96732_WALLS.epsMarginWallTwoA, // 1.0
  epsAtTransition: IMP96732_RUNGS.find((r) => r.twoA === IMP96732_WALLS.epsMarginWallTwoA).eps,
  l1AtTransition: IMP96732_WALLS.l1AtEpsWall, // ~1.0e9
  l1AtLn3: IMP96732_WALLS.l1AtLn3, // ~1.7e16
  reading: 'eps margin wall reached first (2a=1.0), l1 conditioning blow-up only catastrophic by ln3',
});

export const IMP96758_VERDICT_SUMMARY = Object.freeze({
  ticket: IMP96732_VERDICT.ticket,
  answer: IMP96732_VERDICT.answer,
  intervalRigorousReachUnchanged: IMP96732_VERDICT.intervalRigorousReachUnchanged,
  qed: IMP96732_VERDICT.qed,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96758_ASSERTIONS = [
  {
    id: 'imp96758-six-rungs-present',
    holds: () => IMP96758_EPS_MARGIN_SERIES.length === 6 && IMP96758_L1_BLOWUP_SERIES.length === 6,
    why: 'imp-96732 projected exactly six rungs across the disputed window 2a in {0.96,0.98,0.99,1.00,1.0134,ln3}.',
  },
  {
    id: 'imp96758-eps-series-decreasing',
    holds: () =>
      IMP96758_EPS_MARGIN_SERIES.every(
        (row, i) => i === 0 || row.eps < IMP96758_EPS_MARGIN_SERIES[i - 1].eps,
      ),
    why: 'the certified design margin eps(2a)=200(1-2a) must fall monotonically as 2a grows across the ladder.',
  },
  {
    id: 'imp96758-l1-series-increasing',
    holds: () =>
      IMP96758_L1_BLOWUP_SERIES.every(
        (row, i) => i === 0 || row.log10L1 > IMP96758_L1_BLOWUP_SERIES[i - 1].log10L1,
      ),
    why: 'the projected tail l1-norm must grow monotonically (log-linear fit) as 2a grows across the ladder.',
  },
  {
    id: 'imp96758-transition-marks-eps-vanish-before-l1-blowup',
    holds: () =>
      Math.abs(IMP96758_TRANSITION_MARKER.epsAtTransition) < 1e-9 &&
      IMP96758_TRANSITION_MARKER.l1AtTransition < 1e10 &&
      IMP96758_TRANSITION_MARKER.l1AtLn3 > 1e15,
    why: 'at the 2a=1.0 transition the eps margin must be (near) zero while l1 is still modest (<1e10), confirming the eps wall is reached before the l1 blow-up, which only becomes catastrophic (>1e15) by ln3.',
  },
  {
    id: 'imp96758-verdict-unchanged-no-qed',
    holds: () =>
      IMP96758_VERDICT_SUMMARY.intervalRigorousReachUnchanged === 0.96 &&
      IMP96758_VERDICT_SUMMARY.qed === false,
    why: 'this is a presentation-only reshape: the interval-rigorous reach stays 2a<=0.96 and no QED is claimed.',
  },
];

for (const a of IMP96758_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96758-krein-composite-wall-projection-viz-data assertion failed: ${a.id}`);
  }
}
