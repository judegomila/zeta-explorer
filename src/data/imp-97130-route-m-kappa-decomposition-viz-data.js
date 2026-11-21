/**
 * @module imp-97130-route-m-kappa-decomposition-viz-data
 * @fileoverview imp-97130 -- chart-ready reshape of the Route M first-moment kappa
 *   decomposition (imp-97096 arithmetic part, EXACT; imp-97097 cotangent part, MEASURED).
 *   Bakes the per-b convergence ladders transcribed from each source module's own
 *   documented readings into two component series (arith, a>=2 convention drifting DOWN
 *   to the exact limit, plus the a>=1 primorial callout at b=2310; cot, climbing UP to the
 *   measured limit), and a final three-bar decomposition (arith EXACT + cot MEASURED =
 *   total MEASURED) for a stacked-bar or two-series comparison. Presentation only: every
 *   literal is either imported verbatim from the two source modules or transcribed from
 *   their own JSDoc-documented per-b readings, no re-derivation. kappa > 0 is measured,
 *   not proved; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (source: exact kappa_arith)
 * @see imp-97097-route-m-cotangent-first-moment-reciprocity.js (source: measured kappa_cot)
 * @see imp-97071-route-m-lower-companion-first-moment-reduction.js (parent: kappa > 0 first-moment bound)
 */

import { IMP97096_KAPPA_ARITH } from './imp-97096-route-m-arith-first-moment-evaluation.js';
import { IMP97097_MEASURED } from './imp-97097-route-m-cotangent-first-moment-reciprocity.js';

export const IMP97130_KAPPA_ARITH = IMP97096_KAPPA_ARITH; // 0.5704960511308594, EXACT
export const IMP97130_KAPPA_COT = IMP97097_MEASURED.kappaCot; // ~0.121, MEASURED
export const IMP97130_KAPPA_TOTAL = IMP97130_KAPPA_ARITH + IMP97130_KAPPA_COT; // ~0.69, MEASURED

// Arithmetic-part convergence ladder (a>=2 convention), transcribed from the imp-97096
// JSDoc: "0.5745 at b=1201 ... drifts DOWN to 0.5705 ... 0.5716 at b=5003, 0.5711 at
// b=9973". Drifts toward the EXACT limit kappa_arith as b grows.
export const IMP97130_ARITH_LADDER = Object.freeze([
  Object.freeze({ component: 'arith', b: 1201, value: 0.5745, convention: 'a>=2', flag: 'measured' }),
  Object.freeze({ component: 'arith', b: 5003, value: 0.5716, convention: 'a>=2', flag: 'measured' }),
  Object.freeze({ component: 'arith', b: 9973, value: 0.5711, convention: 'a>=2', flag: 'measured' }),
]);

// The a>=1 primorial callout point: b=2310 already lands on the exact limit to 5 places
// (the primorial's rich divisor structure accelerates the Moebius/Stirling cancellation).
export const IMP97130_ARITH_PRIMORIAL_POINT = Object.freeze({
  component: 'arith', b: 2310, value: 0.570495, convention: 'a>=1', flag: 'measured',
});

// Cotangent-part convergence ladder, transcribed from the imp-97097 JSDoc: "kappa_cot ...
// ~ +0.12 (climbing 0.059 -> 0.111 -> ~0.121)" at the same b-ladder (31, 101, 257) used for
// the varying-modulus coefficient just above it in that module.
export const IMP97130_COT_LADDER = Object.freeze([
  Object.freeze({ component: 'cot', b: 31, value: 0.059, convention: 'varying-modulus', flag: 'measured' }),
  Object.freeze({ component: 'cot', b: 101, value: 0.111, convention: 'varying-modulus', flag: 'measured' }),
  Object.freeze({ component: 'cot', b: 257, value: 0.121, convention: 'varying-modulus', flag: 'measured' }),
]);

// Combined chart-ready rows for a two-series (arith vs cot) convergence comparison.
export const IMP97130_LADDER_ROWS = Object.freeze([
  ...IMP97130_ARITH_LADDER,
  IMP97130_ARITH_PRIMORIAL_POINT,
  ...IMP97130_COT_LADDER,
]);

// Final three-bar stacked decomposition: exact arithmetic part + measured cotangent part
// = measured total. The EXACT-vs-MEASURED flag is the load-bearing field per bar.
export const IMP97130_DECOMPOSITION_BARS = Object.freeze([
  Object.freeze({ key: 'arith', label: 'arithmetic part (exact)', value: IMP97130_KAPPA_ARITH, flag: 'EXACT', color: '#4ade80' }),
  Object.freeze({ key: 'cot', label: 'cotangent part (measured)', value: IMP97130_KAPPA_COT, flag: 'MEASURED', color: '#38bdf8' }),
  Object.freeze({ key: 'total', label: 'total kappa', value: IMP97130_KAPPA_TOTAL, flag: 'MEASURED', color: '#818cf8' }),
]);

export const IMP97130_VERDICT = Object.freeze({
  ticket: 'imp-97130',
  sourceTickets: ['imp-97096', 'imp-97097'],
  kappaArith: IMP97130_KAPPA_ARITH,
  kappaCot: IMP97130_KAPPA_COT,
  kappaTotal: IMP97130_KAPPA_TOTAL,
  kappaPositive: IMP97130_KAPPA_TOTAL > 0,
  anyBoundMoved: false,
  note:
    'the arithmetic part of the Route M first-moment kappa is EXACT ((3/2)C-3/8=0.5704960511...); ' +
    'the cotangent part is MEASURED (~+0.121, from an open varying-modulus Bettin-Conrey mean value); ' +
    'their sum kappa~0.69>0 is therefore MEASURED, not proved. Presentation only; no new Lambda bound; ' +
    'no refereed bound is changed; RH open; NO QED.',
});

export default IMP97130_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97130_ASSERTIONS = [
  {
    id: 'imp97130-arith-ladder-drifts-down-to-exact-limit',
    holds: () =>
      IMP97130_ARITH_LADDER.every((r, i) => i === 0 || r.value <= IMP97130_ARITH_LADDER[i - 1].value) &&
      Math.abs(IMP97130_ARITH_LADDER[IMP97130_ARITH_LADDER.length - 1].value - IMP97130_KAPPA_ARITH) < 0.001,
    why: 'the a>=2 arithmetic ladder (b=1201,5003,9973) drifts monotonically down toward the exact kappa_arith limit, closing to within 0.001 by b=9973 (transcribed from imp-97096).',
  },
  {
    id: 'imp97130-primorial-point-hits-exact-limit',
    holds: () => Math.abs(IMP97130_ARITH_PRIMORIAL_POINT.value - IMP97130_KAPPA_ARITH) < 0.0001,
    why: 'the a>=1 primorial callout (b=2310) lands on the exact kappa_arith limit to 4 decimal places (imp-97096: "hits 0.570495 at the primorial b=2310").',
  },
  {
    id: 'imp97130-cot-ladder-climbs-to-measured-limit',
    holds: () =>
      IMP97130_COT_LADDER.every((r, i) => i === 0 || r.value >= IMP97130_COT_LADDER[i - 1].value) &&
      Math.abs(IMP97130_COT_LADDER[IMP97130_COT_LADDER.length - 1].value - IMP97130_KAPPA_COT) < 0.001,
    why: 'the cotangent ladder (b=31,101,257) climbs monotonically up toward the measured kappa_cot limit (imp-97097: "climbing 0.059 -> 0.111 -> ~0.121").',
  },
  {
    id: 'imp97130-decomposition-bars-flags-and-sum',
    holds: () => {
      const [arith, cot, total] = IMP97130_DECOMPOSITION_BARS;
      return (
        arith.flag === 'EXACT' &&
        cot.flag === 'MEASURED' &&
        total.flag === 'MEASURED' &&
        Math.abs(total.value - (arith.value + cot.value)) < 1e-12
      );
    },
    why: 'the total bar must be flagged MEASURED (it inherits the measured cotangent uncertainty) even though the arithmetic bar is EXACT, and must equal the exact sum of the two component values.',
  },
  {
    id: 'imp97130-values-imported-verbatim',
    holds: () =>
      IMP97130_KAPPA_ARITH === IMP97096_KAPPA_ARITH && IMP97130_KAPPA_COT === IMP97097_MEASURED.kappaCot,
    why: 'the component values must be imported verbatim from the two source modules, not re-derived.',
  },
  {
    id: 'imp97130-honesty-gate-no-qed',
    holds: () =>
      IMP97130_VERDICT.anyBoundMoved === false &&
      IMP97130_VERDICT.kappaPositive === true &&
      /MEASURED, not proved/.test(IMP97130_VERDICT.note) &&
      /refereed bound is changed/i.test(IMP97130_VERDICT.note) &&
      /RH open/.test(IMP97130_VERDICT.note) &&
      /NO QED/.test(IMP97130_VERDICT.note),
    why: 'presentation-only leaf: no bound moved, kappa>0 explicitly framed as measured not proved, no-refereed-bound-change line and NO QED present.',
  },
];

for (const a of IMP97130_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97130-route-m-kappa-decomposition-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
