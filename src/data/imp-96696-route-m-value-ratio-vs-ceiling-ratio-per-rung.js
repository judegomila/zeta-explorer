/**
 * @module imp-96696-route-m-value-ratio-vs-ceiling-ratio-per-rung
 *
 * imp-96696 (accuracy, AUDIT ONLY): tabulate the Route M lam_max VALUE ratio
 * rigorous(N)/measured(N) across every measured rung N=250..6000 and set it beside
 * the single CEILING ratio (measuredFitCeilingN/rigorousTraceCeilingN), to keep the
 * two overstatement multipliers that imp-96686 found conflated in prose from being
 * mistaken for the same number.
 *
 * BACKGROUND. imp-96548 records two DIFFERENT "trace-domination overstates lam_max"
 * figures that read alike in prose:
 *   - the VALUE ratio  ~1.92x  (rigorous 11.6948 / measured 6.0924 at N=6000), and
 *   - the CEILING ratio ~1.58x (measuredFitCeilingN 4.11e7 / rigorousTraceCeilingN
 *     2.59e7), a single scalar coming from the double-precision Cholesky ceiling shift.
 * imp-96686 FINDING flagged them as distinct quantities being conflated; imp-96698 then
 * fixed the one user-visible glossary surface (imp-96574) that carried the wrong
 * multiplier. This ticket does the per-rung cross-check the conflation motivates.
 *
 * WHAT WAS DONE (tmp/imp-96696-scratch.mjs, reproducible). Using the imp-96548 curve
 * forms verbatim -- rigorous(N) = I(1,1) (log N + gamma) [SPD trace domination] and
 * measured(N) = 3.0247 + 0.3526 log N [imp-96443 fit] -- the value ratio was evaluated
 * at each accessible rung N=250,500,1000,2000,3000,4000,5000,6000, and cross-checked
 * against the RAW per-rung ratio trace(G_N)/lam_max(G_N) taken directly from the
 * imp-96443 power-iteration table (IMP96443_LAMMAX_ROWS). The single ceiling ratio was
 * re-solved from the same lam_min power law (A N^-p, A=0.8186721, p=1.917927).
 *
 * -------------------------------------------------------------------------------
 * FINDING -- the value ratio is NOT a constant ~1.9x; it is a monotone-increasing
 * function of N that DOES cross the 1.58 ceiling-ratio level, at N ~ 327.
 * -------------------------------------------------------------------------------
 * The value ratio grows cleanly from ~1.546 at N=250 to ~1.920 at N=6000 (raw
 * trace/lam_max agrees: 1.560 -> 1.929). So:
 *   (a) at the TOP rung N=6000 the value ratio 1.92x IS distinct from the ceiling
 *       ratio 1.58x -- the two multipliers describe different things and the
 *       imp-96548 / imp-96574 top-rung labelling is correct; but
 *   (b) the value ratio is NOT universally ~1.9x -- it is N-dependent, and it PASSES
 *       THROUGH the 1.58 ceiling-ratio level near N ~ 327 (between the N=250 and
 *       N=500 rungs, inside the accessible ladder). So the naive claim "the value
 *       ratio stays near 1.9x and never coincides with 1.58x" is FALSE at the bottom
 *       of the ladder: near N ~ 327 the value ratio numerically equals the ceiling
 *       ratio, which is exactly the coincidence that makes the prose conflation easy
 *       to fall into.
 * The practical upshot for downstream consumers: the value ratio must always be
 * anchored to a SPECIFIC N (canonically N=6000: ~1.92x), never quoted as a universal
 * constant, because as an N-varying curve it is numerically indistinguishable from the
 * 1.58 ceiling ratio near N ~ 327. The 1.58 figure is a single N-independent scalar
 * (a ceiling-N shift), not a per-rung value ratio.
 *
 * The value ratio rising toward the slope ratio I(1,1)/0.3526 = ~3.575 as N grows is
 * the expected asymptotic: the additive fit intercept (3.0247 vs I(1,1) gamma = 0.728)
 * washes out in log N, so value ratio -> slope ratio ~3.575 as N -> infinity, far
 * above both 1.92 and 1.58. Over the accessible ladder it has only reached ~1.92.
 *
 * AUDIT ONLY. Changes no bound, establishes no operator positivity, makes no RH claim;
 * no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (the two ratios; curve forms)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (raw per-rung lam_max / trace rows)
 * @see imp-96574-spd-trace-domination-log-shape-glossary-headword.js (glossary surface; imp-96698 fixed the mislabel)
 *
 * Ticket: imp-96696 (accuracy, opus-4-8, api-pool). Audit only; NO QED.
 */

// Curve constants, reused verbatim from imp-96548 / imp-96443.
export const IMP96696_CONSTANTS = Object.freeze({
  i11: 1.2606614015078126, // Gram diagonal numerator I(1,1); rigorous trace slope
  gamma: 0.5772156649015329, // Euler-Mascheroni; H_N = log N + gamma + O(1/N)
  measuredFitA: 3.0246914027257246, // imp-96443 lam_max fit intercept
  measuredFitB: 0.3526253785070698, // imp-96443 lam_max fit slope
  slopeRatioAsymptote: 1.2606614015078126 / 0.3526253785070698, // ~3.575, value-ratio limit as N->inf
});

const rigorousCurve = (N) =>
  IMP96696_CONSTANTS.i11 * (Math.log(N) + IMP96696_CONSTANTS.gamma);
const measuredCurve = (N) =>
  IMP96696_CONSTANTS.measuredFitA + IMP96696_CONSTANTS.measuredFitB * Math.log(N);

// Raw per-rung trace and lam_max from imp-96443 power iteration (IMP96443_LAMMAX_ROWS),
// carried here so the fit-curve value ratio can be cross-checked against the direct data.
const RAW_ROWS = Object.freeze([
  Object.freeze({ N: 250, lamMax: 4.930210017770543, trace: 7.6908858100937 }),
  Object.freeze({ N: 500, lamMax: 5.228866173055301, trace: 8.563450305446962 }),
  Object.freeze({ N: 1000, lamMax: 5.495523758931842, trace: 9.43664418600729 }),
  Object.freeze({ N: 2000, lamMax: 5.733924618097868, trace: 10.310152995544131 }),
  Object.freeze({ N: 3000, lamMax: 5.861648882285381, trace: 10.821202166468481 }),
  Object.freeze({ N: 4000, lamMax: 5.94745308383515, trace: 11.183819328662667 }),
  Object.freeze({ N: 5000, lamMax: 6.01140643903531, trace: 11.46509627662857 }),
  Object.freeze({ N: 6000, lamMax: 6.062043896086687, trace: 11.6949 }),
]);

// Per-rung table: fit-curve value ratio rigorous(N)/measured(N) and the raw
// trace(G_N)/lam_max(G_N) cross-check at each accessible rung.
export const IMP96696_VALUE_RATIO_ROWS = Object.freeze(
  RAW_ROWS.map((r) =>
    Object.freeze({
      N: r.N,
      rigorousCurve: rigorousCurve(r.N),
      measuredCurve: measuredCurve(r.N),
      fitValueRatio: rigorousCurve(r.N) / measuredCurve(r.N),
      rawTraceOverLamMax: r.trace / r.lamMax,
    }),
  ),
);

// The single N-independent ceiling ratio (measuredFitCeilingN / rigorousTraceCeilingN),
// re-solved from the same lam_min power law as imp-96548.
function solveCeiling(lamMaxOf) {
  const eps = 2.220446049250313e-16;
  const A = 0.8186721;
  const p = 1.917927;
  let lo = 1e3;
  let hi = 1e10;
  for (let i = 0; i < 300; i += 1) {
    const N = Math.sqrt(lo * hi);
    const cond = lamMaxOf(N) / (A * Math.pow(N, -p));
    if (cond > 1 / eps) hi = N;
    else lo = N;
  }
  return Math.sqrt(lo * hi);
}

const measuredFitCeilingN = solveCeiling(measuredCurve);
const rigorousTraceCeilingN = solveCeiling(rigorousCurve);

export const IMP96696_CEILING_RATIO = Object.freeze({
  measuredFitCeilingN, // ~4.11e7
  rigorousTraceCeilingN, // ~2.59e7
  ceilingRatio: measuredFitCeilingN / rigorousTraceCeilingN, // ~1.584 scalar
  isNIndependentScalar: true,
  note:
    'the 1.58 figure is a single scalar (a double-precision Cholesky ceiling-N shift), ' +
    'NOT a per-rung value ratio; it must not be confused with the N=6000 value ratio 1.92x.',
});

// The crossing rung where the fit value ratio numerically equals the ceiling ratio.
function solveCrossing(target) {
  let lo = 250;
  let hi = 6000;
  for (let i = 0; i < 200; i += 1) {
    const N = Math.sqrt(lo * hi);
    const vr = rigorousCurve(N) / measuredCurve(N);
    if (vr > target) hi = N;
    else lo = N;
  }
  return Math.sqrt(lo * hi);
}

export const IMP96696_FINDING = Object.freeze({
  valueRatioAtTopRung: rigorousCurve(6000) / measuredCurve(6000), // ~1.920
  valueRatioAtBottomRung: rigorousCurve(250) / measuredCurve(250), // ~1.546
  valueRatioIsMonotoneIncreasing: true,
  valueRatioIsConstant: false,
  crossesCeilingRatio: true,
  crossingN: solveCrossing(measuredFitCeilingN / rigorousTraceCeilingN), // ~327, inside the ladder
  distinctAtTopRung: true, // 1.92 vs 1.58 at N=6000
  asymptote: IMP96696_CONSTANTS.slopeRatioAsymptote, // ~3.575 as N->inf
  conclusion:
    'the value ratio and the ceiling ratio are distinct AT THE TOP RUNG (1.92x vs 1.58x), ' +
    'confirming the imp-96548 / imp-96574 top-rung labelling; but the value ratio is NOT a ' +
    'universal constant -- it grows monotonically from ~1.546 (N=250) to ~1.920 (N=6000) and ' +
    'CROSSES the 1.58 ceiling-ratio level near N ~ 327, inside the accessible ladder. So the ' +
    'value ratio must always be quoted at a specific N (canonically N=6000: ~1.92x); the 1.58 ' +
    'ceiling ratio is a separate N-independent scalar. Audit only; no bound moved; RH open; NO QED.',
});

export const IMP96696_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Accuracy audit only: this tabulates the ' +
  'imp-96548 value ratio rigorous(N)/measured(N) per rung against the single ceiling ratio; ' +
  'both are re-analysis of the imp-96443 / imp-96428 numbers. No bound is claimed moved and no ' +
  'operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96696_ASSERTIONS = [
  {
    id: 'imp96696-value-ratio-monotone-increasing',
    holds: () =>
      IMP96696_VALUE_RATIO_ROWS.every(
        (row, i) =>
          i === 0 || row.fitValueRatio > IMP96696_VALUE_RATIO_ROWS[i - 1].fitValueRatio,
      ),
    why: 'the fit value ratio rigorous(N)/measured(N) strictly increases with N across the ladder: it is not a constant.',
  },
  {
    id: 'imp96696-top-rung-value-ratio-near-1p92',
    holds: () => {
      const top = IMP96696_VALUE_RATIO_ROWS[IMP96696_VALUE_RATIO_ROWS.length - 1];
      return (
        top.N === 6000 &&
        top.fitValueRatio > 1.91 &&
        top.fitValueRatio < 1.93 &&
        top.rawTraceOverLamMax > 1.92 &&
        top.rawTraceOverLamMax < 1.94
      );
    },
    why: 'at the top rung N=6000 the value ratio is ~1.92x by both the fit curves and the raw trace/lam_max data, matching imp-96548 FINDING 2.',
  },
  {
    id: 'imp96696-fit-and-raw-value-ratios-agree',
    holds: () =>
      IMP96696_VALUE_RATIO_ROWS.every(
        (row) => Math.abs(row.fitValueRatio - row.rawTraceOverLamMax) < 0.02,
      ),
    why: 'the fit-curve value ratio agrees with the raw trace/lam_max ratio to < 0.02 at every rung: the tabulation is faithful to the direct data.',
  },
  {
    id: 'imp96696-ceiling-ratio-is-distinct-scalar',
    holds: () =>
      IMP96696_CEILING_RATIO.ceilingRatio > 1.5 &&
      IMP96696_CEILING_RATIO.ceilingRatio < 1.65 &&
      IMP96696_CEILING_RATIO.isNIndependentScalar === true &&
      IMP96696_FINDING.valueRatioAtTopRung - IMP96696_CEILING_RATIO.ceilingRatio > 0.3,
    why: 'the ceiling ratio is a single ~1.58 scalar and differs from the N=6000 value ratio (~1.92) by more than 0.3: distinct multipliers at the top rung.',
  },
  {
    id: 'imp96696-value-ratio-crosses-ceiling-ratio-inside-ladder',
    holds: () =>
      IMP96696_FINDING.crossesCeilingRatio === true &&
      IMP96696_FINDING.crossingN > 250 &&
      IMP96696_FINDING.crossingN < 500,
    why: 'the value ratio passes through the 1.58 ceiling-ratio level near N ~ 327 (between the N=250 and N=500 rungs), so "never coincides with 1.58x" is false at the bottom of the ladder -- the value ratio must be anchored to a specific N.',
  },
  {
    id: 'imp96696-honesty-gate-no-qed',
    holds: () =>
      /RH open/.test(IMP96696_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96696_HONEST_BANNER) &&
      /NO QED/.test(IMP96696_HONEST_BANNER) &&
      IMP96696_FINDING.valueRatioIsConstant === false &&
      IMP96696_FINDING.distinctAtTopRung === true,
    why: 'audit only: the honesty markers are present and the finding records both the distinctness at the top rung and the non-constant, ceiling-ratio-crossing nature of the value ratio.',
  },
];

for (const a of IMP96696_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96696-route-m-value-ratio-vs-ceiling-ratio-per-rung assertion failed: ${a.id}`,
    );
  }
}

export default {
  constants: IMP96696_CONSTANTS,
  valueRatioRows: IMP96696_VALUE_RATIO_ROWS,
  ceilingRatio: IMP96696_CEILING_RATIO,
  finding: IMP96696_FINDING,
  banner: IMP96696_HONEST_BANNER,
};
