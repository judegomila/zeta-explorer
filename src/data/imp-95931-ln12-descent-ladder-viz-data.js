/**
 * imp-95931 -- viz panel for the ln 1.2 u_fit_rel descent ladder.
 *
 * Three separate tickets (imp-95860, imp-95881, imp-95896) each extended the ln 1.2
 * DD Jacobi lambda_min(N) grid further and re-ran the same primal A_fit envelope,
 * producing a three-rung descent: u_fit_rel tightens 0.54% -> 0.34% -> 0.247% as the
 * reach grows ~182 -> ~511 -> ~948, approaching but never crossing the ln 1.3 direct
 * interval (0.23%, imp-95841/imp-95857). No consumer ever plotted this ladder
 * against the ln 1.3 target line -- this module assembles it.
 *
 * Import-light: only imports the three frozen source records (no zeros bundle). The
 * imp-95896 module runs one cheap live N=120 DD shift-invert solve (~0.06s) as part
 * of its own self-executing assertions; no additional heavy work is added here.
 *
 * @see imp-95860-ln12-extended-grid-ufit-tightening (rung 1: N<=1000, reach ~182, 0.54%)
 * @see imp-95881-ln12-past1000-ufit-tightening (rung 2: N<=2800, reach ~511, 0.34%)
 * @see imp-95896-ln12-past2800-ufit-tightening (rung 3: N<=5200, reach ~948, 0.247%, ln1.3 target 0.23%)
 */

import { IMP95860_LN12_EXTENDED_GRID_UFIT_TIGHTENING } from './imp-95860-ln12-extended-grid-ufit-tightening.js';
import { IMP95881_LN12_PAST1000_UFIT_TIGHTENING } from './imp-95881-ln12-past1000-ufit-tightening.js';
import { IMP95896_LN12_PAST2800_UFIT_TIGHTENING } from './imp-95896-ln12-past2800-ufit-tightening.js';

const R1 = IMP95860_LN12_EXTENDED_GRID_UFIT_TIGHTENING;
const R2 = IMP95881_LN12_PAST1000_UFIT_TIGHTENING;
const R3 = IMP95896_LN12_PAST2800_UFIT_TIGHTENING;

export const IMP95931_DESCENT_LADDER = Object.freeze([
  Object.freeze({
    rung: 1,
    ticket: 'imp-95860',
    gridLabel: '8-point (N<=1000)',
    reach: R1.reachExtendedTo,
    uFitRelPct: R1.uFitRel * 100,
  }),
  Object.freeze({
    rung: 2,
    ticket: 'imp-95881',
    gridLabel: '11-point (N<=2800)',
    reach: R2.reachExtendedTo,
    uFitRelPct: R2.uFitRel * 100,
  }),
  Object.freeze({
    rung: 3,
    ticket: 'imp-95896',
    gridLabel: '14-point (N<=5200)',
    reach: R3.reachExtendedTo,
    uFitRelPct: R3.uFitRel * 100,
  }),
]);

export const IMP95931_LN13_DIRECT_UFIT_REL_PCT = R3.ln13DirectUFitRel * 100; // 0.23%

export const IMP95931_LOOSER_THAN_LN13_FACTOR = R3.looserThanLn13Factor; // 1.072x at the final rung

export const IMP95931_CAVEAT_BANNER =
  'Presentation only: re-plots the three frozen ln 1.2 u_fit_rel measurements ' +
  '(imp-95860 / imp-95881 / imp-95896) verbatim against the frozen ln 1.3 direct ' +
  'target (no re-derivation, no fresh extrapolation run). The ladder descends toward ' +
  'the ln 1.3 level but has NOT crossed it (0.247% vs 0.23%, still 1.07x looser); ' +
  'crossing needs still larger N per the imp-95820-ln125-shift-budget-scaling ' +
  'residual. Changes no bound, establishes no operator positivity, no RH claim; ' +
  'no refereed bound is changed; NO QED.';

export const IMP95931_ASSERTIONS = [
  {
    id: 'imp95931-three-rungs-in-order',
    description:
      'exactly three rungs exist, ordered by increasing reach and increasing N, one per source ticket',
    holds: () =>
      IMP95931_DESCENT_LADDER.length === 3 &&
      IMP95931_DESCENT_LADDER.every((r, i) => i === 0 || r.reach > IMP95931_DESCENT_LADDER[i - 1].reach) &&
      IMP95931_DESCENT_LADDER.map((r) => r.ticket).join(',') === 'imp-95860,imp-95881,imp-95896',
  },
  {
    id: 'imp95931-uFitRel-strictly-descends',
    description:
      'u_fit_rel% strictly decreases rung over rung (0.54% -> 0.34% -> 0.247%), matching the source uFitRel fields exactly',
    holds: () => {
      const [a, b, c] = IMP95931_DESCENT_LADDER;
      return (
        a.uFitRelPct > b.uFitRelPct &&
        b.uFitRelPct > c.uFitRelPct &&
        Math.abs(a.uFitRelPct - R1.uFitRel * 100) < 1e-12 &&
        Math.abs(b.uFitRelPct - R2.uFitRel * 100) < 1e-12 &&
        Math.abs(c.uFitRelPct - R3.uFitRel * 100) < 1e-12
      );
    },
  },
  {
    id: 'imp95931-reaches-match-source-reachExtendedTo',
    description: 'each rung reach equals the matching source reachExtendedTo field exactly',
    holds: () => {
      const [a, b, c] = IMP95931_DESCENT_LADDER;
      return a.reach === R1.reachExtendedTo && b.reach === R2.reachExtendedTo && c.reach === R3.reachExtendedTo;
    },
  },
  {
    id: 'imp95931-descends-toward-but-not-past-ln13',
    description:
      'the final rung u_fit_rel% is closer to the ln 1.3 target than either earlier rung, but still strictly greater (has not crossed below it)',
    holds: () => {
      const [a, b, c] = IMP95931_DESCENT_LADDER;
      const target = IMP95931_LN13_DIRECT_UFIT_REL_PCT;
      const distA = Math.abs(a.uFitRelPct - target);
      const distB = Math.abs(b.uFitRelPct - target);
      const distC = Math.abs(c.uFitRelPct - target);
      return (
        distC < distB &&
        distB < distA &&
        c.uFitRelPct > target &&
        R3.stillLooserThanLn13 === true &&
        R3.reachedLn13Level === false &&
        Math.abs(c.uFitRelPct / target - IMP95931_LOOSER_THAN_LN13_FACTOR) / IMP95931_LOOSER_THAN_LN13_FACTOR < 1e-2
      );
    },
  },
  {
    id: 'imp95931-no-new-bound-caveat-present',
    description: 'the caveat banner names the still-looser status and the no-QED status',
    holds: () =>
      /1\.07x/.test(IMP95931_CAVEAT_BANNER) &&
      /NO QED/.test(IMP95931_CAVEAT_BANNER) &&
      R3.qed === false,
  },
];

for (const a of IMP95931_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95931-ln12-descent-ladder-viz-data assertion failed: ${a.id}`);
  }
}
