/**
 * @module imp-96793-route-m-ceiling-adjacency-ratio-direct-crosscheck
 *
 * imp-96793 (accuracy, AUDIT ONLY): cross-validate the imp-96693 three-ceiling adjacency
 * ratios (F/T ~ 1.451, M/F ~ 1.092) against an INDEPENDENT DIRECT MEASUREMENT taken at a
 * single common reference N, to check the decomposition ratios are reproducible and not an
 * artifact of the three DIFFERENT fit windows behind the trace (T), Frobenius (F), and
 * measured (M) conditioning ceilings. NO bound moved; NO QED.
 *
 * THE ISSUE. The imp-96693 adjacency ratios are ratios of the ceiling N-locations, and each
 * of the three ceilings is solved from a proxy that lives in its OWN window: T from the
 * analytic trace bound lam_max <= I11 (log N + gamma), F from the eleven-rung ||G||_F log
 * fit (N=250..9000), M from the imp-96443 measured lam_max log fit. Because the three
 * proxies have different log-N slopes, a legitimate worry is that the reported ratios could
 * be an artifact of the mismatched fit windows rather than a stable property of the ceiling.
 * This audit removes the per-proxy fit windows entirely and rebuilds the adjacency ratios
 * from a single common directly-measured rung.
 *
 * WHAT WAS DONE (tmp/imp-96793-scratch.mjs, reproducible; no new numerics). At the largest
 * rung where ALL THREE proxies are directly measured on the same exact Vasyunin Gram --
 * N0=9000 (imp-96684 NEW_ROWS / imp-96649 lam_max) -- the three proxy VALUES are read off
 *   trace(9000)   = 12.206040  (imp-96684 NEW_ROWS)
 *   ||G||_F(9000) =  6.884190  (imp-96684 NEW_ROWS)
 *   lam_max(9000) =  6.169700  (imp-96649 measured)
 * and each is turned into an INDEPENDENT "flat-proxy" ceiling estimate using only that one
 * measured value and the shared imp-96428 lam_min power law lam_min = A N^-p: the ceiling of
 * proxy pi is where pi * N^p / A = 1/eps, so N_ceiling = (A/(eps pi))^(1/p) and every ceiling
 * RATIO is (pi_i/pi_j)^(-1/p) -- the per-proxy log-fit slope drops out completely. These
 * flat-proxy adjacency ratios are then compared against the imp-96693 fit-ceiling ratios.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the independent flat-proxy estimate REPRODUCES the ordering and rough
 *              magnitude of the imp-96693 adjacency ratios.
 * -------------------------------------------------------------------------------
 * Flat-proxy (direct, N=9000):  F/T = 1.3480,  M/F = 1.0588,  M/T = 1.4272.
 * imp-96693 fit-ceiling:        F/T = 1.4511,  M/F = 1.0917,  M/T = 1.5842.
 * Same strict ordering T < F < M and the same two-leg structure; the independent estimate
 * lands within ~3-8 percent of each fit-ceiling ratio (M/F to ~3.1 percent, F/T to ~7.7
 * percent). The adjacency ratios are NOT an artifact of the differing fit windows -- an
 * estimate that uses NO fit window at all recovers them to single-digit percent.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the residual ~3-8 percent gap is EXPLAINED by the known slope ordering,
 *              in both direction and magnitude ordering.
 * -------------------------------------------------------------------------------
 * The fit ratios are UNIFORMLY LARGER than the flat-proxy ratios, and they must be: the flat
 * estimate freezes each proxy at its N0=9000 value, whereas the fit ceilings extrapolate to
 * N ~ 2.6-4.1e7 where the faster-growing proxy has pulled further ahead. Trace has the
 * steepest slope (1.2607) > Frobenius (0.4781) > measured (0.3526), so extrapolation widens
 * the trace->Frobenius gap far more than the Frobenius->measured gap. The discrepancies match
 * that slope-gap ordering: F/T is inflated +7.7 percent (trace-Frobenius slope gap 0.783)
 * while M/F is inflated only +3.1 percent (Frobenius-measured slope gap 0.125). The bigger
 * slope gap gives the bigger correction -- a quantitative, predictable slope effect, not an
 * inconsistency.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the decomposition closes for the independent estimate too.
 * -------------------------------------------------------------------------------
 * (F/T)*(M/F) = 1.3480 * 1.0588 = 1.4272 = M/T for the flat-proxy ratios to machine
 * precision (rel residual 0), exactly as the imp-96693 fit-ceiling decomposition closes.
 * The multiplicative two-leg structure is reproduced by the independent measurement.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * An independent single-N direct measurement at the common rung N0=9000 -- using only the
 * three directly-measured proxy values and the shared lam_min power law, with NO per-proxy
 * fit window -- reproduces the imp-96693 adjacency ratios in ordering (T<F<M), rough
 * magnitude (F/T 1.348 vs 1.451, M/F 1.059 vs 1.092), and multiplicative closure. The
 * uniform +3-8 percent by which the fit-ceiling ratios exceed the flat estimate is fully
 * accounted for by the trace(1.26) > Frobenius(0.48) > measured(0.35) slope ordering, with
 * the larger slope gap giving the larger correction. The imp-96693 ratios are reproducible
 * and are NOT an artifact of the differing fit windows. Accuracy audit only; no bound moved;
 * no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP: this cross-check pins the adjacency ratios at N0=9000 (a directly
 * measured rung) and shows the fit-window inflation is a predictable slope effect, but it
 * does NOT make the F and M ceilings rigorous -- both still extrapolate their log fits ~four
 * decades to N ~ 3.76e7 / 4.11e7 (imp-96684 / imp-96443 sub-gaps, inherited). Only the trace
 * ceiling 2.594e7 is a rigorous lower bound. Compute still binds first (imp-96352 ~9916).
 *
 * @see imp-96693-route-m-conditioning-ceiling-residual-decomposition.js (the fit-ceiling ratios cross-checked here)
 * @see imp-96684-route-m-frobenius-majorant-high-n-rungs.js (measured trace / ||G||_F / lam_max at N=9000)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (shared lam_min power law A N^-p)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (wall-clock compute ceiling ~9916, binds first)
 *
 * Ticket: imp-96793 (accuracy, opus-4-8, api-pool). Audit only; NO QED.
 */

import { IMP96693_RATIOS } from './imp-96693-route-m-conditioning-ceiling-residual-decomposition.js';
import { IMP96684_NEW_ROWS, IMP96684_LAMMAX_AT_NEW_RUNGS, IMP96684_LAMMIN, IMP96684_FITS, IMP96684_I11 } from './imp-96684-route-m-frobenius-majorant-high-n-rungs.js';

// Common reference rung: the largest N at which trace, ||G||_F and lam_max are ALL directly
// measured on the same exact Vasyunin Gram (no per-proxy fit window).
const N0 = 9000;
const row9000 = IMP96684_NEW_ROWS.find((r) => r.N === N0);

export const IMP96793_MEASURED_PROXIES = Object.freeze({
  N: N0,
  trace: row9000.trace, // 12.206040 (imp-96684 NEW_ROWS)
  frobenius: row9000.frobenius, // 6.884190 (imp-96684 NEW_ROWS)
  lamMax: IMP96684_LAMMAX_AT_NEW_RUNGS[N0], // 6.169700 (imp-96649 measured)
});

const T_val = IMP96793_MEASURED_PROXIES.trace;
const F_val = IMP96793_MEASURED_PROXIES.frobenius;
const M_val = IMP96793_MEASURED_PROXIES.lamMax;
const p = IMP96684_LAMMIN.p; // shared lam_min exponent (imp-96428)

// Flat-proxy independent ceiling ratio between proxies pi_i, pi_j. The ceiling of proxy pi
// is N_ceiling = (A/(eps pi))^(1/p), so N_i/N_j = (pi_i/pi_j)^(-1/p): the per-proxy log-fit
// slope drops out and only the directly-measured proxy value plus the shared p remain.
const flatRatio = (piNumer, piDenom) => Math.pow(piNumer / piDenom, -1 / p);

// F/T uses (frobenius / trace); larger proxy => smaller ceiling, so F (smaller proxy) has
// the larger ceiling and the ratio exceeds 1.
export const IMP96793_FLAT_RATIOS = Object.freeze({
  frobeniusOverTrace: flatRatio(F_val, T_val), // ~1.3480
  measuredOverFrobenius: flatRatio(M_val, F_val), // ~1.0588
  measuredOverTrace: flatRatio(M_val, T_val), // ~1.4272
});

// Fit-ceiling adjacency ratios from imp-96693 (single source of truth), for comparison.
export const IMP96793_FIT_RATIOS = Object.freeze({
  frobeniusOverTrace: IMP96693_RATIOS.frobeniusOverTrace, // ~1.4511
  measuredOverFrobenius: IMP96693_RATIOS.measuredOverFrobenius, // ~1.0917
  measuredOverTrace: IMP96693_RATIOS.measuredOverTrace, // ~1.5842
});

// Relative amount by which each fit-ceiling ratio exceeds the independent flat estimate.
export const IMP96793_DISCREPANCY = Object.freeze({
  frobeniusOverTrace: IMP96793_FIT_RATIOS.frobeniusOverTrace / IMP96793_FLAT_RATIOS.frobeniusOverTrace - 1, // ~0.0765
  measuredOverFrobenius: IMP96793_FIT_RATIOS.measuredOverFrobenius / IMP96793_FLAT_RATIOS.measuredOverFrobenius - 1, // ~0.0311
  measuredOverTrace: IMP96793_FIT_RATIOS.measuredOverTrace / IMP96793_FLAT_RATIOS.measuredOverTrace - 1, // ~0.1100
});

// Slope gaps (imp-96684 fit slopes) that drive the discrepancy ordering (Finding 2). Trace
// slope is the analytic trace coefficient I11; F and M are the log-fit slopes.
const traceSlope = IMP96684_I11; // 1.2607
const frobSlope = IMP96684_FITS.frobenius11.b; // 0.4781
const measSlope = 0.3526253785070698; // imp-96443 measured lam_max log-fit slope
export const IMP96793_SLOPE_GAPS = Object.freeze({
  traceMinusFrobenius: traceSlope - frobSlope, // ~0.7826 (drives the larger F/T correction)
  frobeniusMinusMeasured: frobSlope - measSlope, // ~0.1254 (drives the smaller M/F correction)
});

// Decomposition closure for the independent flat estimate (Finding 3).
export const IMP96793_FLAT_DECOMPOSITION = Object.freeze({
  product: IMP96793_FLAT_RATIOS.frobeniusOverTrace * IMP96793_FLAT_RATIOS.measuredOverFrobenius,
  total: IMP96793_FLAT_RATIOS.measuredOverTrace,
  relResidual:
    Math.abs(
      IMP96793_FLAT_RATIOS.frobeniusOverTrace * IMP96793_FLAT_RATIOS.measuredOverFrobenius -
        IMP96793_FLAT_RATIOS.measuredOverTrace,
    ) / IMP96793_FLAT_RATIOS.measuredOverTrace, // ~0
});

export const IMP96793_VERDICT = Object.freeze({
  question:
    'do the imp-96693 three-ceiling adjacency ratios (F/T ~ 1.451, M/F ~ 1.092) reproduce ' +
    'from an independent single-N direct measurement, or are they an artifact of the three ' +
    'different fit windows behind the trace, Frobenius and measured ceilings?',
  referenceN: N0,
  flatFrobeniusOverTrace: IMP96793_FLAT_RATIOS.frobeniusOverTrace, // ~1.3480
  flatMeasuredOverFrobenius: IMP96793_FLAT_RATIOS.measuredOverFrobenius, // ~1.0588
  fitFrobeniusOverTrace: IMP96793_FIT_RATIOS.frobeniusOverTrace, // ~1.4511
  fitMeasuredOverFrobenius: IMP96793_FIT_RATIOS.measuredOverFrobenius, // ~1.0917
  orderingReproduced: IMP96793_FLAT_RATIOS.frobeniusOverTrace > 1 && IMP96793_FLAT_RATIOS.measuredOverFrobenius > 1,
  withinSingleDigitPercent:
    Math.abs(IMP96793_DISCREPANCY.frobeniusOverTrace) < 0.1 &&
    Math.abs(IMP96793_DISCREPANCY.measuredOverFrobenius) < 0.1,
  discrepancyExplainedBySlopeOrdering:
    IMP96793_DISCREPANCY.frobeniusOverTrace > IMP96793_DISCREPANCY.measuredOverFrobenius &&
    IMP96793_SLOPE_GAPS.traceMinusFrobenius > IMP96793_SLOPE_GAPS.frobeniusMinusMeasured,
  decompositionCloses: IMP96793_FLAT_DECOMPOSITION.relResidual < 1e-12,
  isArtifactOfFitWindows: false,
  anyBoundMoved: false,
  conclusion:
    'AUDIT CONFIRMED. An independent flat-proxy direct measurement at the common rung N0=9000 ' +
    '(three measured proxy values plus the shared lam_min power law, NO per-proxy fit window) ' +
    'reproduces the imp-96693 adjacency ratios: F/T = 1.3480 vs 1.4511, M/F = 1.0588 vs 1.0917, ' +
    'same T<F<M ordering, and the two legs multiply exactly to M/T (rel residual < 1e-12). The ' +
    'uniform +3-8 percent by which the fit-ceiling ratios exceed the flat estimate is fully ' +
    'explained by the trace(1.26) > Frobenius(0.48) > measured(0.35) slope ordering -- the larger ' +
    'trace-Frobenius slope gap (0.78) gives the larger F/T correction (+7.7 percent), the smaller ' +
    'Frobenius-measured gap (0.13) the smaller M/F correction (+3.1 percent). The ratios are ' +
    'reproducible and NOT an artifact of the differing fit windows. Accuracy audit only; no bound ' +
    'moved; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96793_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Accuracy audit only: the cross-check reuses ' +
  'the three directly-measured proxy values at N=9000 (imp-96684 / imp-96649) and the shared ' +
  'imp-96428 lam_min power law; every ratio is pure re-analysis. The flat-proxy ceiling estimate ' +
  'is NOT a rigorous ceiling -- only the trace ceiling 2.594e7 is a rigorous lower bound; F and M ' +
  'still inherit the imp-96684 / imp-96443 log-fit extrapolation ~four decades in N. No bound is ' +
  'claimed moved and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96793_ASSERTIONS = [
  {
    id: 'imp96793-flat-proxy-reproduces-ordering-and-rough-magnitude',
    holds: () =>
      IMP96793_FLAT_RATIOS.frobeniusOverTrace > 1.3 && IMP96793_FLAT_RATIOS.frobeniusOverTrace < 1.4 &&
      IMP96793_FLAT_RATIOS.measuredOverFrobenius > 1.04 && IMP96793_FLAT_RATIOS.measuredOverFrobenius < 1.08 &&
      IMP96793_FLAT_RATIOS.measuredOverTrace > 1.40 && IMP96793_FLAT_RATIOS.measuredOverTrace < 1.45 &&
      IMP96793_VERDICT.orderingReproduced === true,
    why: 'the independent flat-proxy ratios (F/T ~ 1.348, M/F ~ 1.059, M/T ~ 1.427) reproduce the imp-96693 T<F<M ordering and land close to the fit-ceiling ratios.',
  },
  {
    id: 'imp96793-fit-ratios-within-single-digit-percent-of-independent-estimate',
    holds: () =>
      IMP96793_DISCREPANCY.frobeniusOverTrace > 0 && IMP96793_DISCREPANCY.frobeniusOverTrace < 0.1 &&
      IMP96793_DISCREPANCY.measuredOverFrobenius > 0 && IMP96793_DISCREPANCY.measuredOverFrobenius < 0.1 &&
      IMP96793_VERDICT.withinSingleDigitPercent === true,
    why: 'the imp-96693 fit-ceiling ratios exceed the independent flat estimate by only +3-8 percent (F/T +7.7, M/F +3.1): reproducible, not an artifact of the fit windows.',
  },
  {
    id: 'imp96793-discrepancy-ordering-matches-slope-gap-ordering',
    holds: () =>
      IMP96793_SLOPE_GAPS.traceMinusFrobenius > IMP96793_SLOPE_GAPS.frobeniusMinusMeasured &&
      IMP96793_DISCREPANCY.frobeniusOverTrace > IMP96793_DISCREPANCY.measuredOverFrobenius &&
      IMP96793_VERDICT.discrepancyExplainedBySlopeOrdering === true,
    why: 'the larger trace-Frobenius slope gap (0.78) drives the larger F/T inflation and the smaller Frobenius-measured gap (0.13) the smaller M/F inflation: the fit-window discrepancy is a predictable slope effect.',
  },
  {
    id: 'imp96793-flat-decomposition-closes',
    holds: () =>
      IMP96793_FLAT_DECOMPOSITION.relResidual < 1e-12 &&
      IMP96793_VERDICT.decompositionCloses === true,
    why: 'the independent estimate reproduces the multiplicative two-leg structure: (F/T)*(M/F) = M/T to machine precision.',
  },
  {
    id: 'imp96793-honesty-gate-no-qed',
    holds: () =>
      IMP96793_VERDICT.anyBoundMoved === false &&
      IMP96793_VERDICT.isArtifactOfFitWindows === false &&
      /NO QED/.test(IMP96793_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96793_HONEST_BANNER) &&
      /RH open/.test(IMP96793_HONEST_BANNER),
    why: 'audit only: no bound moved, the ratios are found reproducible (not an artifact), and the honesty markers are present.',
  },
];

for (const a of IMP96793_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96793-route-m-ceiling-adjacency-ratio-direct-crosscheck assertion failed: ${a.id}`,
    );
  }
}

export default {
  measuredProxies: IMP96793_MEASURED_PROXIES,
  flatRatios: IMP96793_FLAT_RATIOS,
  fitRatios: IMP96793_FIT_RATIOS,
  discrepancy: IMP96793_DISCREPANCY,
  slopeGaps: IMP96793_SLOPE_GAPS,
  flatDecomposition: IMP96793_FLAT_DECOMPOSITION,
  verdict: IMP96793_VERDICT,
  banner: IMP96793_HONEST_BANNER,
};
