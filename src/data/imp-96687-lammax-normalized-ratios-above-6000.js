/**
 * @module imp-96687-lammax-normalized-ratios-above-6000
 *
 * imp-96687 (numerical, MEASUREMENT ONLY): extend the imp-96604 / imp-96562
 * eight-rung normalized-lam_max ladder (N=250..6000) with the three new measured
 * rungs N=7000,8000,9000 from the imp-96649 NMAX=9000 Gram rebuild, and MEASURE
 * whether either normalized candidate closes on its asymptotic target or stays ~2x.
 *
 * imp-96562 FINDING 3 asked whether either normalized quantity converges visibly
 * to the fitted lam_max slope 0.3526 across the accessible ladder:
 *     lam_max / log N   -> targetSlope 0.3526,
 *     lam_max / trace   -> targetRatio 0.2797 (= 0.3526 / 1.2600).
 * Both were still > 1.8x their targets at the top rung N=6000, so neither was
 * readable as a Szego-type limiting constant. imp-96649 rebuilt the exact
 * Vasyunin Gram to NMAX=9000 and measured lam_max at N=7000,8000,9000. This module
 * appends those three rungs and re-reads the residual-to-target.
 *
 * TRACE AT THE NEW RUNGS IS EXACT, NOT REFIT. The Gram diagonal is
 * G_kk = gcd(k,k) I(k/k,k/k)/(k*k) = k I(1,1)/k^2 = I(1,1)/k, so the trace is
 * closed-form: trace(G_N) = Sum_k G_kk = I(1,1) H_N (H_N the N-th harmonic number).
 * This reproduces every committed imp-96562 trace (N=250..6000) to < 4e-15 rel
 * (the committed N=6000 value 11.6949 is merely 5-digit-rounded, rel 1.8e-6), so
 * the new-rung traces need no Gram off-diagonals -- they are analytic.
 *
 * -------------------------------------------------------------------------------
 * FINDING -- the residual SHRINKS but stays ~2x; three more rungs barely move it.
 * -------------------------------------------------------------------------------
 * Measured across N=6000 -> 9000 (a 50% extension of the accessible reach):
 *     lam_max / log N : 0.6968 -> 0.6894 -> 0.6831 -> 0.6776  (overTarget 1.976x -> 1.922x)
 *     lam_max / trace : 0.5183 -> 0.5134 -> 0.5092 -> 0.5055  (overTarget 1.853x -> 1.807x)
 * Both ratios keep falling monotonically toward their targets, but the total drop
 * over the three new rungs is only 0.019 (log-N ratio) and 0.013 (trace ratio) --
 * ~0.006 and ~0.004 per rung. Neither leaves the "> 1.8x above target" band; the
 * intercept-dominated log approach means N=9000 is still strongly pre-asymptotic,
 * exactly the imp-96562 FINDING 3 reading, now confirmed 50% further out. Extending
 * the ladder does NOT numerically pin 0.3526 as a Szego constant.
 *
 * MEASUREMENT ONLY. No bound is moved, no operator positivity is established, no RH
 * claim is made. Every lam_max is the imp-96649 measured value; every trace is the
 * exact I(1,1) H_N. No refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96604-lammax-normalized-ratio-viz-data.js (the eight-rung ladder extended here)
 * @see imp-96562-route-m-lammax-offdiagonal-szego-assessment.js (FINDING 3, both targets)
 * @see imp-96649-route-m-condfit-rungs-above-6000.js (measured lam_max at N=7000,8000,9000)
 *
 * Ticket: imp-96687 (numerical, opus-4-8, api-pool). Measurement only; NO QED.
 */

import {
  IMP96604_RATIO_SERIES,
  IMP96604_TARGETS,
  IMP96604_HONEST_BANNER,
} from './imp-96604-lammax-normalized-ratio-viz-data.js';
import { IMP96649_NEW_ROWS } from './imp-96649-route-m-condfit-rungs-above-6000.js';
import { IMP96562_I11 } from './imp-96562-route-m-lammax-offdiagonal-szego-assessment.js';

// Exact Gram trace: diag(G)_kk = I(1,1)/k, so trace(G_N) = I(1,1) * H_N.
function harmonic(N) {
  let s = 0;
  for (let k = 1; k <= N; k += 1) s += 1 / k;
  return s;
}
export const traceExact = (N) => IMP96562_I11 * harmonic(N);

// The three new rungs, shaped like the imp-96604 series (measured lam_max, exact trace).
export const IMP96687_NEW_RATIO_ROWS = Object.freeze(
  IMP96649_NEW_ROWS.map((r) => {
    const tr = traceExact(r.N);
    return Object.freeze({
      N: r.N,
      logN: Math.log10(r.N),
      lamMax: r.lamMax,
      traceExact: tr,
      lamMaxOverLogN: r.lamMax / Math.log(r.N),
      lamMaxOverTrace: r.lamMax / tr,
    });
  }),
);

// Eleven-rung combined ladder: imp-96604 eight rungs (N=250..6000) + three new (7000..9000).
export const IMP96687_RATIO_SERIES = Object.freeze([
  ...IMP96604_RATIO_SERIES.map((r) =>
    Object.freeze({
      N: r.N,
      logN: r.logN,
      lamMaxOverLogN: r.lamMaxOverLogN,
      lamMaxOverTrace: r.lamMaxOverTrace,
    }),
  ),
  ...IMP96687_NEW_RATIO_ROWS.map((r) =>
    Object.freeze({
      N: r.N,
      logN: r.logN,
      lamMaxOverLogN: r.lamMaxOverLogN,
      lamMaxOverTrace: r.lamMaxOverTrace,
    }),
  ),
]);

export const IMP96687_TARGETS = IMP96604_TARGETS;

// Residual-to-target at N=6000 (last committed rung) vs N=9000 (new top rung).
const at6000 = IMP96604_RATIO_SERIES[IMP96604_RATIO_SERIES.length - 1];
const at9000 = IMP96687_NEW_RATIO_ROWS[IMP96687_NEW_RATIO_ROWS.length - 1];

export const IMP96687_RESIDUAL_SUMMARY = Object.freeze({
  lamMaxOverLogN: Object.freeze({
    target: IMP96687_TARGETS.lamMaxOverLogNTarget, // 0.3526
    at6000: at6000.lamMaxOverLogN,
    at9000: at9000.lamMaxOverLogN,
    overTargetAt6000: at6000.lamMaxOverLogN / IMP96687_TARGETS.lamMaxOverLogNTarget, // ~1.976x
    overTargetAt9000: at9000.lamMaxOverLogN / IMP96687_TARGETS.lamMaxOverLogNTarget, // ~1.922x
    dropOver3Rungs: at6000.lamMaxOverLogN - at9000.lamMaxOverLogN, // ~0.019
  }),
  lamMaxOverTrace: Object.freeze({
    target: IMP96687_TARGETS.lamMaxOverTraceTarget, // 0.2797
    at6000: at6000.lamMaxOverTrace,
    at9000: at9000.lamMaxOverTrace,
    overTargetAt6000: at6000.lamMaxOverTrace / IMP96687_TARGETS.lamMaxOverTraceTarget, // ~1.853x
    overTargetAt9000: at9000.lamMaxOverTrace / IMP96687_TARGETS.lamMaxOverTraceTarget, // ~1.807x
    dropOver3Rungs: at6000.lamMaxOverTrace - at9000.lamMaxOverTrace, // ~0.013
  }),
  reading:
    'both normalized ratios keep falling monotonically toward their targets across the ' +
    'new rungs 7000,8000,9000, but only by ~0.02 (log-N) / ~0.01 (trace) over a 50% ' +
    'extension of N; both ' +
    'remain > 1.8x their targets at N=9000. The residual SHRINKS but STAYS ~2x -- extending ' +
    'the ladder does not numerically pin 0.3526 as a Szego constant (imp-96562 FINDING 3 ' +
    'confirmed 50% further out).',
  stillAbove18xAt9000: true,
  pinnableFromExtendedLadder: false,
});

export const IMP96687_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: lam_max at N=7000,8000,9000 ' +
  'is the imp-96649 NMAX=9000 power-iteration value; trace is the exact closed form I(1,1) H_N ' +
  '(diag(G)_kk = I(1,1)/k), reproducing every committed imp-96562 trace to < 4e-15 rel. No bound ' +
  'is claimed moved and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96687_ASSERTIONS = [
  {
    id: 'imp96687-eleven-rungs-present',
    holds: () => IMP96687_RATIO_SERIES.length === 11,
    why: 'the extended ladder is the imp-96604 eight rungs (N=250..6000) plus the three new imp-96649 rungs (N=7000,8000,9000).',
  },
  {
    id: 'imp96687-trace-formula-reproduces-committed',
    holds: () =>
      Math.abs(traceExact(250) - 7.6908858100937) / 7.6908858100937 < 1e-12 &&
      Math.abs(traceExact(5000) - 11.46509627662857) / 11.46509627662857 < 1e-12,
    why: 'trace(G_N) = I(1,1) H_N reproduces the committed imp-96562 traces (N=250, N=5000) to < 1e-12 rel, confirming the exact closed-form trace at the new rungs.',
  },
  {
    id: 'imp96687-both-series-still-decreasing',
    holds: () =>
      IMP96687_RATIO_SERIES.every(
        (row, i) =>
          i === 0 ||
          (row.lamMaxOverLogN < IMP96687_RATIO_SERIES[i - 1].lamMaxOverLogN &&
            row.lamMaxOverTrace < IMP96687_RATIO_SERIES[i - 1].lamMaxOverTrace),
      ),
    why: 'both normalized ratios keep falling monotonically toward their targets across the new rungs 7000,8000,9000.',
  },
  {
    id: 'imp96687-residual-shrinks-but-stays-2x',
    holds: () =>
      IMP96687_RESIDUAL_SUMMARY.lamMaxOverLogN.overTargetAt9000 <
        IMP96687_RESIDUAL_SUMMARY.lamMaxOverLogN.overTargetAt6000 &&
      IMP96687_RESIDUAL_SUMMARY.lamMaxOverTrace.overTargetAt9000 <
        IMP96687_RESIDUAL_SUMMARY.lamMaxOverTrace.overTargetAt6000 &&
      IMP96687_RESIDUAL_SUMMARY.lamMaxOverLogN.overTargetAt9000 > 1.8 &&
      IMP96687_RESIDUAL_SUMMARY.lamMaxOverTrace.overTargetAt9000 > 1.8,
    why: 'FINDING: both ratios shrink from N=6000 to N=9000 yet stay > 1.8x their targets -- the extended ladder is still strongly pre-asymptotic and cannot pin 0.3526.',
  },
  {
    id: 'imp96687-honesty-gate-no-qed',
    holds: () =>
      IMP96687_RESIDUAL_SUMMARY.pinnableFromExtendedLadder === false &&
      /RH open/.test(IMP96687_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96687_HONEST_BANNER) &&
      /NO QED/.test(IMP96687_HONEST_BANNER),
    why: 'measurement only: no bound moved, the extended ladder stays unpinnable, and the honesty markers are present.',
  },
];

for (const a of IMP96687_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96687-lammax-normalized-ratios-above-6000 assertion failed: ${a.id}`);
  }
}

export default {
  newRatioRows: IMP96687_NEW_RATIO_ROWS,
  ratioSeries: IMP96687_RATIO_SERIES,
  targets: IMP96687_TARGETS,
  residualSummary: IMP96687_RESIDUAL_SUMMARY,
  banner: IMP96687_HONEST_BANNER,
};
