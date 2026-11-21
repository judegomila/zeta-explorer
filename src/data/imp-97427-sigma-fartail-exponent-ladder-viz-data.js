/**
 * @module imp-97427-sigma-fartail-exponent-ladder-viz-data
 *
 * imp-97427 (ux): import-light viz-data leaf visualizing the imp-97404 extended
 * sigma(N) far-tail decay-exponent ladder past 1e12: per-decade local exponent
 * p_local climbing 0.4310 [1e11,1e12] -> 0.4646 -> 0.4777 -> 0.4828 [1e14,1e15]
 * with decade R^2 climbing toward ~0.999999, plus the pointwise exponent p(N)
 * 0.4526 (1e12) -> 0.4842 (1e15) -> 0.4889 (1e20) approaching the imp-3463
 * far-tail 1/2 asymptote from below.
 *
 * PRESENTATION ONLY. Reuses the imp-97404 extendedLadder / pointwise arrays
 * verbatim (no re-derivation, no recomputation); establishes no new bound;
 * measurement/fit diagnostic, NOT an RH bound; no refereed bound is changed;
 * RH open; NO QED.
 *
 * @see imp-97404-sigma-fartail-exponent-ladder-past-1e12.js (source: extendedLadder, pointwise, farTailExponent)
 *
 * Ticket: imp-97427 (ux, sonnet-4-6, sonnet). Presentation only, RH-free; changes no bound; NO QED.
 */

import { IMP97404_SIGMA_FARTAIL_EXPONENT_LADDER_PAST_1E12 } from './imp-97404-sigma-fartail-exponent-ladder-past-1e12.js';

const SRC = IMP97404_SIGMA_FARTAIL_EXPONENT_LADDER_PAST_1E12;

export const IMP97427_FAR_TAIL_EXPONENT = SRC.farTailExponent; // 1/2 (imp-3463 asymptote)
export const IMP97427_DECADE_LADDER = SRC.extendedLadder; // per-decade p_local + R^2
export const IMP97427_POINTWISE = SRC.pointwise; // pointwise p(N) + residual to 1/2
export const IMP97427_IMP96151_CROSS_CHECK = SRC.imp96151CrossCheck; // 0.4646 closed-form match at 1e12

export const IMP97427_HONEST_BANNER =
  'Presentation only: the per-decade and pointwise exponent ladders are reused verbatim from the ' +
  'imp-97404 measurement (itself extending imp-33582 on the inherited imp-3406/imp-33582 three-term ' +
  'sigma(N) model). The climb toward the imp-3463 far-tail 1/2 is a measured monotone limit, not a ' +
  'proved asymptotic. No new bound established; no refereed bound is changed; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97427_ASSERTIONS = [
  {
    id: 'imp97427-decade-ladder-matches-source-literals',
    holds: () => {
      const expected = [0.431, 0.4646, 0.4777, 0.4828];
      return IMP97427_DECADE_LADDER.length === 4 &&
        IMP97427_DECADE_LADDER.every((row, i) => Math.abs(row.p_local - expected[i]) < 1e-3);
    },
    why: 'the decade ladder must reproduce the imp-97404 ticket literals (0.4310, 0.4646, 0.4777, 0.4828) sourced live from the imp-97404 module, not transcribed independently.',
  },
  {
    id: 'imp97427-decade-ladder-monotone-below-half',
    holds: () => {
      for (let i = 1; i < IMP97427_DECADE_LADDER.length; i++) {
        if (!(IMP97427_DECADE_LADDER[i].p_local > IMP97427_DECADE_LADDER[i - 1].p_local)) return false;
      }
      return IMP97427_DECADE_LADDER.every((r) => r.p_local < IMP97427_FAR_TAIL_EXPONENT);
    },
    why: 'the per-decade exponent must strictly climb and stay strictly below the imp-3463 far-tail 1/2 asymptote at every rung.',
  },
  {
    id: 'imp97427-pointwise-approaches-half',
    holds: () => {
      for (let i = 1; i < IMP97427_POINTWISE.length; i++) {
        if (!(IMP97427_POINTWISE[i].p > IMP97427_POINTWISE[i - 1].p)) return false;
      }
      return IMP97427_POINTWISE.every((r) => r.p < IMP97427_FAR_TAIL_EXPONENT && r.residualToHalf > 0);
    },
    why: 'the pointwise exponent must strictly climb with a strictly positive, shrinking residual to 1/2 at every probe N, matching the imp-97404 monotone-approach finding.',
  },
  {
    id: 'imp97427-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP97427_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97427_HONEST_BANNER) &&
      /NO QED/.test(IMP97427_HONEST_BANNER),
    why: 'every sigma(N) far-tail viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97427_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97427-sigma-fartail-exponent-ladder-viz-data assertion failed: ${a.id}`);
  }
}
