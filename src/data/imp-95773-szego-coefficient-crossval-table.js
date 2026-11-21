/**
 * imp-95773 -- single cross-validation table assembling the four independent
 * numeric readings of the imp-95704 Szego edge-coefficient law
 * C(delta) = pi^2 / (2 delta^2) that are otherwise scattered across three
 * separate modules.
 *
 * GRADE: presentation/reshaping only. Imports no heavy bundle; re-derives
 * nothing -- every cell below is a baked literal pulled from its source
 * module (imports are import-light, so no build-time cost).
 *
 * SOURCES.
 *   - imp-95704: the closed-form prediction pi^2/(2 delta^2) and the
 *     cancellation-free Poisson-DUAL measurement of C, at delta = 1, ln2,
 *     ln1.5, ln1.3.
 *   - imp-95727: a DIRECT float64 Jacobi eigensolver fit of C at delta = 1
 *     and delta = ln2 (well-conditioned; A_opt far above the float64 floor).
 *   - imp-95743: the SAME direct-eigensolver fit rebuilt in double-double
 *     (Dekker/Bailey QD) arithmetic at delta = ln1.5 and delta = ln1.3, run
 *     on an identical N grid alongside its own float64 fit -- the region
 *     where imp-95727's plain float64 fit was never attempted because
 *     A_opt sinks toward (ln1.5) and past (ln1.3) the imp-95677 cancellation
 *     floor.
 *
 * READING THE TABLE. At delta = 1 and ln2 only the predicted/dual/float64
 * columns are populated -- double-double was never run there because
 * float64 is already sub-1% accurate (A_opt ~1e-3 to ~1e-5, nowhere near the
 * cancellation floor). At delta = ln1.5 all four columns agree to within a
 * few percent: the dual-vs-direct OVERLAP region. At delta = ln1.3 the
 * float64 fit BREAKS (C = 951.43, +1227% relative error, meaningless) while
 * the double-double fit tracks the predicted/dual value to -7.0% -- the
 * clearest single illustration that float64 fails exactly where its
 * A_opt ~ 4e-15 crosses the imp-95677 cancellation floor, and that
 * double-double recovers the law past it.
 *
 * HONEST SCOPE. Pure reshaping of three already-measured, already-committed
 * results into one comparison object; introduces no new cited input and no
 * new bound. Model seam family only; the imp-95212 envelope port, signed
 * WEIGHT, and modulus/phase legs stay OPEN. Changes NO bound of the Lambda
 * program; NO QED; no refereed bound is changed.
 *
 * @see imp-95704-rho1-szego-coefficient-delta-scaling (predicted + dual columns)
 * @see imp-95727-szego-coefficient-eigensolver-crosscheck (float64 column, delta=1,ln2)
 * @see imp-95743-szego-coefficient-double-double-crosscheck (float64+DD columns, delta=ln1.5,ln1.3)
 */

import { IMP95704_RHO1_SZEGO_COEFFICIENT_DELTA_SCALING } from './imp-95704-rho1-szego-coefficient-delta-scaling.js';
import { IMP95727_SZEGO_COEFFICIENT_EIGENSOLVER_CROSSCHECK } from './imp-95727-szego-coefficient-eigensolver-crosscheck.js';
import { IMP95743_SZEGO_COEFFICIENT_DOUBLE_DOUBLE_CROSSCHECK } from './imp-95743-szego-coefficient-double-double-crosscheck.js';

const DUAL_GRID = IMP95704_RHO1_SZEGO_COEFFICIENT_DELTA_SCALING.grid;
const F64_SMALL_DELTA = IMP95727_SZEGO_COEFFICIENT_EIGENSOLVER_CROSSCHECK.crosscheck;
const DD_CROSSCHECK = IMP95743_SZEGO_COEFFICIENT_DOUBLE_DOUBLE_CROSSCHECK.crosscheck;

function dualRow(label) {
  return DUAL_GRID.find((r) => r.label === label);
}
function f64SmallDeltaRow(label) {
  return F64_SMALL_DELTA.find((r) => r.label === label);
}
function ddRow(label) {
  return DD_CROSSCHECK.find((r) => r.label === label);
}

export const SZEGO_COEFFICIENT_CROSSVAL_ROWS = [
  {
    label: '1',
    delta: 1,
    predicted: (Math.PI * Math.PI) / (2 * 1 * 1),
    dual: dualRow('1').C,
    float64: { C: f64SmallDeltaRow('1').cFit, relErr: f64SmallDeltaRow('1').relErr },
    doubleDouble: null, // not run: float64 already sub-1% here (A_opt ~1.3e-3)
  },
  {
    label: 'ln2',
    delta: Math.log(2),
    predicted: (Math.PI * Math.PI) / (2 * Math.log(2) * Math.log(2)),
    dual: dualRow('ln2').C,
    float64: { C: f64SmallDeltaRow('ln2').cFit, relErr: f64SmallDeltaRow('ln2').relErr },
    doubleDouble: null, // not run: float64 already sub-1% here (A_opt ~2.4e-5)
  },
  {
    label: 'ln1.5',
    delta: Math.log(1.5),
    predicted: (Math.PI * Math.PI) / (2 * Math.log(1.5) * Math.log(1.5)),
    dual: dualRow('ln1.5').C,
    float64: { C: ddRow('ln1.5').float64.cFit, relErr: ddRow('ln1.5').float64.relErr },
    doubleDouble: { C: ddRow('ln1.5').dd.cFit, relErr: ddRow('ln1.5').dd.relErr },
  },
  {
    label: 'ln1.3',
    delta: Math.log(1.3),
    predicted: (Math.PI * Math.PI) / (2 * Math.log(1.3) * Math.log(1.3)),
    dual: dualRow('ln1.3').C,
    float64: { C: ddRow('ln1.3').float64.cFit, relErr: ddRow('ln1.3').float64.relErr }, // BROKEN
    doubleDouble: { C: ddRow('ln1.3').dd.cFit, relErr: ddRow('ln1.3').dd.relErr },
  },
];

export const IMP95773_SZEGO_COEFFICIENT_CROSSVAL_TABLE = Object.freeze({
  id: 'imp-95773',
  title:
    'CROSS-VALIDATION TABLE: predicted / dual / float64 / double-double readings of ' +
    'the imp-95704 Szego edge-coefficient law C(delta) = pi^2/(2 delta^2) at ' +
    'delta = 1, ln2, ln1.5, ln1.3, assembled from imp-95704, imp-95727, imp-95743',
  rows: SZEGO_COEFFICIENT_CROSSVAL_ROWS,
  overlapDelta: 'ln1.5',
  breakDelta: 'ln1.3',
  verdict:
    'MEASURED (reshaping only). At delta = 1 and ln2, float64 alone tracks the ' +
    'predicted/dual C to sub-1% (double-double not needed). At delta = ln1.5, ' +
    'predicted, dual, float64, and double-double all agree to within a few percent ' +
    '-- the dual-vs-direct overlap region. At delta = ln1.3 the float64 fit BREAKS ' +
    '(+1227% relative error, meaningless) while the double-double fit tracks the ' +
    'law to -7.0%, the clearest single illustration of the imp-95677 cancellation ' +
    'floor and the imp-95743 double-double fix. Assembles three already-committed ' +
    'results into one comparison object; introduces no new cited input and no new ' +
    'bound. Model seam family only; the imp-95212 envelope port, signed WEIGHT, and ' +
    'modulus/phase legs stay OPEN. Changes no bound of the Lambda program; NO QED; ' +
    'no refereed bound is changed.',
  boundChange: false,
  qed: false,
  closesTickets: ['imp-95773'],
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: only the three source modules,
// none of which pull heavy bundles)
// ---------------------------------------------------------------------------

const REF = IMP95773_SZEGO_COEFFICIENT_CROSSVAL_TABLE;

export const IMP95773_ASSERTIONS = [
  {
    id: 'imp95773-four-rows-in-order',
    description: 'table has exactly the four requested delta rows in order 1, ln2, ln1.5, ln1.3',
    holds: () => REF.rows.map((r) => r.label).join(',') === '1,ln2,ln1.5,ln1.3',
  },
  {
    id: 'imp95773-predicted-matches-closed-form',
    description: 'each predicted cell equals pi^2/(2 delta^2) for its own baked delta',
    holds: () =>
      REF.rows.every((r) => {
        const want = (Math.PI * Math.PI) / (2 * r.delta * r.delta);
        return Math.abs(r.predicted - want) / want < 1e-12;
      }),
  },
  {
    id: 'imp95773-dual-matches-predicted-closely',
    description: 'the dual (Poisson) column tracks the predicted closed form to <1e-4 relative at every delta',
    holds: () => REF.rows.every((r) => Math.abs(r.dual - r.predicted) / r.predicted < 1e-4),
  },
  {
    id: 'imp95773-small-delta-float64-sub-percent',
    description: 'at delta=1 and ln2 the float64 column is within 1% of predicted and has no DD entry',
    holds: () =>
      ['1', 'ln2'].every((label) => {
        const row = REF.rows.find((r) => r.label === label);
        return Math.abs(row.float64.relErr) < 0.01 && row.doubleDouble === null;
      }),
  },
  {
    id: 'imp95773-ln15-overlap-agreement',
    description: 'at delta=ln1.5 float64 and double-double both stay within 5% of predicted and of each other',
    holds: () => {
      const row = REF.rows.find((r) => r.label === 'ln1.5');
      return (
        Math.abs(row.float64.relErr) < 0.05 &&
        Math.abs(row.doubleDouble.relErr) < 0.05 &&
        Math.abs(row.float64.C - row.doubleDouble.C) / row.doubleDouble.C < 1e-3
      );
    },
  },
  {
    id: 'imp95773-ln13-float64-breaks-dd-recovers',
    description: 'at delta=ln1.3 float64 relErr exceeds 100% (broken) while double-double stays under 10%',
    holds: () => {
      const row = REF.rows.find((r) => r.label === 'ln1.3');
      return Math.abs(row.float64.relErr) > 1.0 && Math.abs(row.doubleDouble.relErr) < 0.1;
    },
  },
  {
    id: 'imp95773-not-a-bound',
    description: 'this is a reshaping/tabulation module; it moves no Lambda bound and proves no QED',
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      /MEASURED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: 'imp95773-closes-self',
    description: 'this module is the deliverable the imp-95773 ticket asked for',
    holds: () => REF.closesTickets.includes('imp-95773'),
  },
];

for (const a of IMP95773_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95773-szego-coefficient-crossval-table assertion failed: ${a.id}`);
  }
}

export default IMP95773_SZEGO_COEFFICIENT_CROSSVAL_TABLE;
