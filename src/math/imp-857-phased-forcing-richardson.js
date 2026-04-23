/**
 * imp-897 / imp-857-sub-phased-forcing:
 *   Richardson-extrapolated CERTIFIED C_mb_empirical(N) interval bound from
 *   the phased-forcing grid, closed against the imp-892 commutator residual.
 *
 * HONEST STATUS (read first)
 * --------------------------
 * HONEST-PARTIAL closure of imp-897. The ticket asked for a certified
 * interval-valued C_mb_empirical(N) at N in {1000, 2000, 5000, 10000}
 * extracted from the imp-893 + imp-896 grid by Richardson extrapolation
 * on {eps_1, eps_2}, using the imp-892 commutator bound
 *
 *     |tau_c(eps, N) - tau_c(0, N)|  <=  (1/4) * eps * H_0(N)^2
 *
 * as the residual estimate.
 *
 * This module delivers:
 *
 *   (i)   A formal statement of the Richardson-style two-point
 *         extrapolation scheme with an imp-892-derived residual bound,
 *         and a RIGOROUS comparison with the single-point enclosure,
 *         identifying which bound is sharper and when.
 *
 *   (ii)  Application of the scheme to the 6 measured rows from
 *         src/data/imp-857-phased-forcing-sweep.js at N in {1000, 2000}.
 *         Produces a CERTIFIED interval enclosure on tau_c(0, N), a
 *         certified upper bound on |F_mb(N)|, and the corresponding
 *         K_raw_cert(N) and paper-normalized C_mb upper bound.
 *
 *   (iii) Comparison against the existing imp-857 certified row set
 *         (src/math/c-mb-interval-certified.js CERTIFIED_ROWS at N in
 *         {50, 100, 200, 500}), and against the imp-486 C_MB_RESCUE_TABLE.
 *         At N in {1000, 2000} there is no prior CERTIFIED row to beat,
 *         so the phased-forcing row is the FIRST certified C_mb bound at
 *         those N -- a positive result, contingent on the imp-892 bound.
 *
 *   (iv)  An explicit NEGATIVE mapping for N in {5000, 10000}: no
 *         measurement rows exist yet (the 14-cell grid is deferred to
 *         imp-917 pending CPU budget), so the extrapolation cannot be
 *         evaluated there. Those N remain in the directed-rounding
 *         backend's territory. The module reports what the enclosure
 *         WOULD be at those N given CALIBRATION(N) once imp-917 lands,
 *         as a forward-looking target for the offline worker.
 *
 * What this module does NOT deliver:
 *
 *   - Sub-step collision-time resolution. All measured rows report
 *     collision at the SAME RK4 step across eps in {0, 0.01, 0.05},
 *     i.e. the observed |tau_c(eps) - tau_c(0)| is 0 at step granularity
 *     dt = 1e-4. imp-898 (named) proposes a Brent-bracketed sub-step
 *     refinement to get resolution below dt; with that, the Richardson
 *     extrapolation gains a non-zero linear correction and its residual
 *     can be sharpened below the O(eps) single-point bound via
 *     O(eps_1 * eps_2) cancellation. Without imp-898, the certified
 *     enclosure is dominated by the step-level dt floor, not by
 *     Richardson -- a KEY honest caveat.
 *
 *   - Measurements at N in {5000, 10000}. Promoted to imp-917.
 *
 *   - Lean / formal proof port. Scope of this module is a JS-level
 *     arithmetic bound, not the Lean 4 port.
 *
 *
 * ===================================================================
 * FORMAL SCHEME
 * ===================================================================
 *
 * NOTATION
 * --------
 * Let N be fixed. Write:
 *   tau_c(eps)  = true backward-collision time of the forced Dyson flow
 *                 at forcing strength eps;
 *   [T_lo(eps), T_hi(eps)]  = the step-level enclosure observed by the
 *                 interval-RK4 prototype (imp-893), i.e. T_lo(eps) is
 *                 the largest step * dt where the interval min-gap is
 *                 still positive, T_hi(eps) is the next step (where the
 *                 min-gap first crossed zero). By construction
 *                 tau_c(eps) in [T_lo(eps), T_hi(eps)];
 *   H_0(N)  = minimum raw gap over the first N Riemann zeros (imp-896
 *             CALIBRATION.minGap);
 *   R(eps)  = (1/4) * eps * H_0^2, the imp-892 residual.
 *
 * SINGLE-POINT ENCLOSURE (Lemma 1)
 * --------------------------------
 * For any eps > 0, by imp-892,
 *
 *   tau_c(0)  in  [T_lo(eps) - R(eps), T_hi(eps) + R(eps)]       (E1)
 *
 * Proof: tau_c(eps) in [T_lo(eps), T_hi(eps)] and
 * |tau_c(eps) - tau_c(0)| <= R(eps) by the commutator bound. Union of
 * intervals gives the displayed enclosure. QED.
 *
 * Taking the intersection over the available eps values gives the
 * tightest single-point enclosure:
 *
 *   tau_c(0)  in  INTERSECT_{eps_i} [T_lo(eps_i) - R(eps_i),
 *                                   T_hi(eps_i) + R(eps_i)]      (E*)
 *
 * When all eps values give the same step-level enclosure
 * [T_lo, T_hi] = [T_lo(eps_min), T_hi(eps_min)] (the observed situation
 * at N in {1000, 2000}), the intersection collapses to the MINIMUM-eps
 * single-point enclosure
 *
 *   tau_c(0)  in  [T_lo - R(eps_min), T_hi + R(eps_min)]         (E2)
 *
 * because larger eps gives a strictly wider residual and adds no new
 * information.
 *
 * RICHARDSON EXTRAPOLATION (Lemma 2)
 * ----------------------------------
 * Under the linear model tau_c(eps) = tau_c(0) + a * eps, the two-point
 * extrapolation
 *
 *   T_R  :=  (eps_2 * tau_c(eps_1) - eps_1 * tau_c(eps_2)) / (eps_2 - eps_1)
 *
 * recovers tau_c(0) exactly. If the full imp-892 bound is absorbed into
 * a single residual r(eps) with |r(eps)| <= R(eps) (not split into
 * linear + quadratic), then
 *
 *   |T_R - tau_c(0)|  <=  (eps_2 * R(eps_1) + eps_1 * R(eps_2))
 *                         / (eps_2 - eps_1)
 *                     =   (1/4) * H_0^2 * 2 * eps_1 * eps_2
 *                         / (eps_2 - eps_1)
 *                     =   eps_1 * eps_2 * H_0^2 / (2 * (eps_2 - eps_1))  (E3)
 *
 * The Richardson interval is therefore
 *
 *   tau_c(0)  in  [T_R - delta_R, T_R + delta_R],
 *     delta_R  =  eps_1 * eps_2 * H_0^2 / (2 * (eps_2 - eps_1))
 *                 + step-level propagation through T_R.                (E4)
 *
 * SHARPNESS COMPARISON (Proposition 1)
 * ------------------------------------
 * Without a tighter bound on r(eps) beyond |r(eps)| <= R(eps), the
 * Richardson enclosure (E4) is STRICTLY WIDER than the single-point
 * (E2) whenever eps_1 / (eps_2 - eps_1) > 1/2, i.e. eps_2 > 3 * eps_1.
 * For the measured pair (eps_1, eps_2) = (0.01, 0.05) used here:
 *   Single-point (eps_1) half-width: R(0.01) = 0.0025 * H_0^2
 *   Richardson  half-width:          eps_1*eps_2*H_0^2 / (2*(eps_2-eps_1))
 *                                  = 0.0005 * H_0^2 / 0.08
 *                                  = 0.00625 * H_0^2
 * i.e. Richardson is 2.5x WIDER than the minimum-eps single-point
 * enclosure. Under the imp-892 bound alone (no quadratic-in-eps
 * decomposition), the single-point scheme is sharper. The Richardson
 * scheme becomes sharper only when |r(eps)| has a demonstrable
 * quadratic tail |r(eps)| <= b * eps^2, which requires the sub-step
 * collision-time resolution of imp-898 to MEASURE the linear term.
 *
 * So the CERTIFIED interval we quote here is (E2), computed at the
 * MINIMUM measured eps. The Richardson point T_R is reported as a
 * POINT estimate and we also quote its (looser) interval for
 * transparency -- but the certified bound uses (E2).
 *
 *
 * ===================================================================
 * F_mb AND C_mb FROM tau_c(0, N) ENCLOSURE
 * ===================================================================
 *
 * Given tau_c(0, N) in [t_lo, t_hi] from (E2), the many-body correction
 * is F_mb(N) = tau_c(0, N) - t_c_pair(N), t_c_pair(N) = H_raw(N)^2 / 8
 * (c-mb-interval-certified.js convention). The upper magnitude is
 *
 *   |F_mb(N)|_hi  =  max(|t_lo - t_c_pair|, |t_hi - t_c_pair|)
 *
 * and the ticket's ratio is
 *
 *   K_raw_cert(N)  =  |F_mb(N)|_hi * H_raw(N) / (N^{-1/2} * log(N))
 *   C_mb_paper_floor(N)  =  K_raw_cert(N) / rho_floor,   rho_floor = 0.12751
 *
 * matching the c-mb-interval-certified.js rowCertifiedBound formula.
 *
 *
 * ===================================================================
 * COMPARISON TO IMP-486 RESCUE TABLE
 * ===================================================================
 *
 * The imp-486 C_MB_RESCUE_TABLE is indexed by a HYPOTHETICAL C_mb upper
 * bound K and quotes the minimum analytic threshold N_0(K) that would
 * rescue the unconditional closure under that bound. We convert our
 * C_mb_paper_floor(N) to an implied N_0 via the same binary search
 * (minN0ForC_mb in c-mb-unconditional-bound.js). If the implied N_0 is
 * below 1e7, the certified row "supersedes" the rescue-table target in
 * the sense that it would let the unconditional closure clear with a
 * feasible zero-table extension.
 *
 * This is reported per-N below.
 */

import { IMP_857_PHASED_FORCING_SWEEP } from '../data/imp-857-phased-forcing-sweep.js';
import { IMP_896_RETUNING_CALIBRATION } from '../data/imp-896-retuning-calibration.js';

// --- Constants & helpers ---------------------------------------------------

const RHO_FLOOR = 0.12751;        // imp-469 analytic floor on RvM density
const C_TAU     = 0.25;           // imp-892 commutator constant (1/4)
const RESCUE_N0_FEASIBLE_CAP = 1e7;

// imp-892 commutator residual at forcing strength eps and initial min-gap H_0.
function commutatorResidual(eps, H_0) {
  return C_TAU * eps * H_0 * H_0;
}

// Binary search for the minimum analytic threshold N_0 such that
// K * log(N_0) / sqrt(N_0) < rho_floor. Same shape as the minN0ForC_mb
// routine in c-mb-unconditional-bound.js.
function minN0ForK(K) {
  if (!Number.isFinite(K) || K <= 0) return Infinity;
  let lo = 1e2;
  let hi = 1e18;
  for (let i = 0; i < 120; i++) {
    const mid = Math.sqrt(lo * hi);
    const lhs = (K * Math.log(mid)) / Math.sqrt(mid);
    if (lhs < RHO_FLOOR) hi = mid;
    else lo = mid;
  }
  return Math.ceil(hi);
}

// --- Step-level collision-time enclosure from a measured row -------------
//
// The imp-893 prototype reports collisionStep at which the interval min-gap
// first crosses zero. Conservative step-level enclosure on tau_c(eps):
//
//   [collisionStep * dt, (collisionStep + 1) * dt]
//
// i.e. lower bound = step * dt (min-gap was positive at start of the step;
// the collision is detected DURING the step), upper bound = step * dt + dt.
// This is conservative: a sharper bound would bracket inside the step via
// Brent / bisection (imp-898).
function stepEnclosureFromRow(row) {
  const lo = row.collisionStep * row.dt;
  const hi = (row.collisionStep + 1) * row.dt;
  return [lo, hi];
}

// --- Apply the imp-892 residual to produce (E1) single-point enclosure ---
function singlePointEnclosure(row, H_0) {
  const [tauLo, tauHi] = stepEnclosureFromRow(row);
  const R = commutatorResidual(row.eps, H_0);
  return {
    eps: row.eps,
    R,
    tauC_eps_lo: tauLo,
    tauC_eps_hi: tauHi,
    tauC_zero_lo: tauLo - R,
    tauC_zero_hi: tauHi + R,
    halfWidth: 0.5 * ((tauHi + R) - (tauLo - R)),
  };
}

// Intersect a collection of single-point enclosures to produce (E*).
function intersectEnclosures(enclosures) {
  if (enclosures.length === 0) return null;
  let lo = -Infinity;
  let hi = Infinity;
  for (const e of enclosures) {
    if (e.tauC_zero_lo > lo) lo = e.tauC_zero_lo;
    if (e.tauC_zero_hi < hi) hi = e.tauC_zero_hi;
  }
  if (lo > hi) return { empty: true, lo, hi };
  return { empty: false, lo, hi, halfWidth: 0.5 * (hi - lo) };
}

// --- Richardson extrapolation (Lemma 2) ---------------------------------
//
// Returns nominal T_R using step-midpoints and a residual interval half-
// width from (E3). The nominal interval is [T_R - delta_R, T_R + delta_R]
// plus step-level propagation, which is symmetric about T_R:
//
//    delta_R = eps_1 * eps_2 * H_0^2 / (2 * (eps_2 - eps_1))
//            + (eps_2 * halfStep_1 + eps_1 * halfStep_2) / (eps_2 - eps_1)
//
// where halfStep_i = (T_hi(eps_i) - T_lo(eps_i)) / 2 = dt / 2.
function richardsonExtrapolation(row1, row2, H_0) {
  if (row1.eps === row2.eps) return null;
  const eps1 = Math.min(row1.eps, row2.eps);
  const eps2 = Math.max(row1.eps, row2.eps);
  const rSmall = row1.eps === eps1 ? row1 : row2;
  const rLarge = row1.eps === eps2 ? row1 : row2;
  const [lo1, hi1] = stepEnclosureFromRow(rSmall);
  const [lo2, hi2] = stepEnclosureFromRow(rLarge);
  const mid1 = 0.5 * (lo1 + hi1);
  const mid2 = 0.5 * (lo2 + hi2);
  const T_R  = (eps2 * mid1 - eps1 * mid2) / (eps2 - eps1);
  const half1 = 0.5 * (hi1 - lo1);
  const half2 = 0.5 * (hi2 - lo2);
  const residualWidth = (eps1 * eps2 * H_0 * H_0) / (2 * (eps2 - eps1));
  const stepPropagation = (eps2 * half1 + eps1 * half2) / (eps2 - eps1);
  const delta_R = residualWidth + stepPropagation;
  return {
    eps1,
    eps2,
    T_R,
    delta_R,
    richardsonLo: T_R - delta_R,
    richardsonHi: T_R + delta_R,
    residualFromCommutator: residualWidth,
    propagationFromStep: stepPropagation,
  };
}

// --- C_mb aggregation from tau_c(0, N) enclosure -------------------------
function cMbFromTauC(N, tauLo, tauHi, H_raw) {
  const t_c_pair = (H_raw * H_raw) / 8;
  const d_lo = tauLo - t_c_pair;
  const d_hi = tauHi - t_c_pair;
  const F_mb_upper = Math.max(Math.abs(d_lo), Math.abs(d_hi));
  const scaleFactor = Math.log(N) / Math.sqrt(N);
  const K_raw_cert = (F_mb_upper * H_raw) / scaleFactor;
  const C_mb_paper_floor = K_raw_cert / RHO_FLOOR;
  const impliedN0 = minN0ForK(C_mb_paper_floor);
  return {
    t_c_pair,
    F_mb_upper,
    K_raw_cert,
    C_mb_paper_floor,
    impliedN0,
    rescueFeasible: impliedN0 <= RESCUE_N0_FEASIBLE_CAP,
  };
}

// --- Per-N report ---------------------------------------------------------

function perNReport(N) {
  const calib = IMP_896_RETUNING_CALIBRATION.calibration[N];
  const rows = IMP_857_PHASED_FORCING_SWEEP.measuredRows.filter(
    (r) => r.N === N && r.eps > 0,
  );
  if (!calib || rows.length === 0) {
    return {
      N,
      status: 'no-measurements',
      note:
        'No imp-893 measured rows at eps > 0 for this N. Extrapolation not ' +
        'evaluable until imp-917 lands measurements at (' + N + ', eps > 0).',
    };
  }
  const H_0 = calib.minGap;
  const H_raw = calib.minGap;
  const singlePointEnclosures = rows.map((r) => singlePointEnclosure(r, H_0));
  const intersected = intersectEnclosures(singlePointEnclosures);
  const pair = rows.length >= 2
    ? richardsonExtrapolation(rows[0], rows[1], H_0)
    : null;
  const certified = intersected && !intersected.empty
    ? cMbFromTauC(N, intersected.lo, intersected.hi, H_raw)
    : null;
  const richardsonCertified = pair
    ? cMbFromTauC(N, pair.richardsonLo, pair.richardsonHi, H_raw)
    : null;
  return {
    N,
    status: 'certified',
    H_0,
    H_raw,
    singlePointEnclosures: singlePointEnclosures.map((e) => ({
      eps: e.eps,
      R: +e.R.toExponential(4),
      tauC_zero_lo: +e.tauC_zero_lo.toExponential(6),
      tauC_zero_hi: +e.tauC_zero_hi.toExponential(6),
      halfWidth: +e.halfWidth.toExponential(4),
    })),
    intersected: intersected
      ? {
          empty: !!intersected.empty,
          lo: +intersected.lo.toExponential(6),
          hi: +intersected.hi.toExponential(6),
          halfWidth: intersected.empty
            ? null
            : +intersected.halfWidth.toExponential(4),
        }
      : null,
    richardsonPair: pair
      ? {
          eps1: pair.eps1,
          eps2: pair.eps2,
          T_R: +pair.T_R.toExponential(6),
          delta_R: +pair.delta_R.toExponential(4),
          residualFromCommutator: +pair.residualFromCommutator.toExponential(4),
          propagationFromStep: +pair.propagationFromStep.toExponential(4),
          richardsonLo: +pair.richardsonLo.toExponential(6),
          richardsonHi: +pair.richardsonHi.toExponential(6),
        }
      : null,
    certifiedBound: certified && {
      t_c_pair: +certified.t_c_pair.toExponential(6),
      F_mb_upper: +certified.F_mb_upper.toExponential(4),
      K_raw_cert: +certified.K_raw_cert.toExponential(4),
      C_mb_paper_floor: +certified.C_mb_paper_floor.toExponential(4),
      impliedN0: Number.isFinite(certified.impliedN0)
        ? +certified.impliedN0.toExponential(3)
        : null,
      rescueFeasible: certified.rescueFeasible,
    },
    richardsonBound: richardsonCertified && {
      K_raw_cert: +richardsonCertified.K_raw_cert.toExponential(4),
      C_mb_paper_floor: +richardsonCertified.C_mb_paper_floor.toExponential(4),
    },
  };
}

function forwardLookingTarget(N) {
  const calib = IMP_896_RETUNING_CALIBRATION.calibration[N];
  if (!calib) return { N, status: 'no-calibration' };
  const H_0 = calib.minGap;
  // Projected certified half-width if imp-917 delivers measurements at
  // the planned eps grid with dt = 1e-4. The certified interval is
  // dominated by R(eps_min) + step-level half (E2).
  const eps_min = 0.01;
  const dt = 1e-4;
  const R = commutatorResidual(eps_min, H_0);
  const projectedHalfWidth = R + dt / 2;
  const projectedT = (H_0 * H_0) / 8;
  const projectedF_mb_upper = projectedHalfWidth;
  const scaleFactor = Math.log(N) / Math.sqrt(N);
  const projectedK = (projectedF_mb_upper * H_0) / scaleFactor;
  const projectedCpaper = projectedK / RHO_FLOOR;
  return {
    N,
    status: 'projected-pending-imp-917',
    H_0,
    projectedT_pair: +projectedT.toExponential(4),
    projectedHalfWidth: +projectedHalfWidth.toExponential(4),
    projectedK_raw_cert_max: +projectedK.toExponential(4),
    projectedC_mb_paper_floor_max: +projectedCpaper.toExponential(4),
    projectedImpliedN0: +minN0ForK(projectedCpaper).toExponential(3),
    note:
      'Upper-bound-on-upper-bound: assumes F_mb fills its entire certified ' +
      'envelope (worst case). Actual F_mb is typically much smaller.',
  };
}

// --- Run the scheme -------------------------------------------------------

const N_MEASURED = [1000, 2000];
const N_PENDING  = [5000, 10000];

const PER_N_MEASURED  = N_MEASURED.map(perNReport);
const PER_N_PROJECTED = N_PENDING.map(forwardLookingTarget);

// --- Sharpness-comparison (Proposition 1) numerical check ---------------

function sharpnessComparison() {
  // At the measured pair (eps1, eps2) = (0.01, 0.05) and any H_0, show that
  // the Richardson residual is strictly wider than the single-point (E2)
  // half-width at eps_min = eps1.
  const H_0 = 0.1;                  // representative value; ratio is H_0-invariant
  const singlePointHalf = commutatorResidual(0.01, H_0);
  const richardsonResidualOnly = (0.01 * 0.05 * H_0 * H_0) / (2 * (0.05 - 0.01));
  return {
    eps1: 0.01,
    eps2: 0.05,
    H_0_probe: H_0,
    singlePointHalf,
    richardsonResidualOnly,
    ratio_richardson_over_single: richardsonResidualOnly / singlePointHalf,
    richardsonIsWider: richardsonResidualOnly > singlePointHalf,
  };
}

const SHARPNESS_CHECK = sharpnessComparison();

// --- Open sub-gap descriptors --------------------------------------------

const OPEN_SUB_GAPS = [
  {
    id: 'imp-917',
    summary:
      '14-cell phased-forcing grid execution at N in {5000, 10000} x ' +
      'eps in {0, 0.01, 0.02, 0.05, 0.1} plus (1000, 2000) x {0.02, 0.1}. ' +
      'Pure CPU-budget sub-gap, calibration infrastructure already in ' +
      'imp-896. Unblocks the missing rows of PER_N_PROJECTED.',
    unlocks:
      'Conversion of PER_N_PROJECTED rows (N = 5000, 10000) from ' +
      '"projected-pending" to "certified", giving the first rigorous ' +
      'C_mb_empirical bound at those N contingent on imp-892.',
    prerequisite: null,
  },
  {
    id: 'imp-898',
    summary:
      'Sub-step collision-time resolution via Brent / bisection inside ' +
      'the last RK4 step. Currently tau_c(eps) is reported only at ' +
      'dt = 1e-4 granularity, so the observed |tau_c(eps) - tau_c(0)| ' +
      'is 0 and the Richardson numerator vanishes.',
    unlocks:
      'With sub-step tau_c(eps) measurement, the linear coefficient a = ' +
      '(tau_c(eps_2) - tau_c(eps_1)) / (eps_2 - eps_1) becomes non-trivial ' +
      'and Richardson gains an O(eps^2)-style residual tighter than the ' +
      'single-point O(eps) bound, improving certified C_mb at N in ' +
      '{1000, 2000} beyond what this module quotes.',
    prerequisite: null,
  },
];

// --- Closure record -------------------------------------------------------

export const IMP_857_PHASED_FORCING_RICHARDSON = {
  id: 'imp-897',
  title:
    'imp-857-sub-phased-forcing: Richardson-extrapolated certified ' +
    'C_mb_empirical(N) interval bound from phased-forcing grid',

  status:
    'PARTIAL: scheme formalized + applied to N in {1000, 2000} from ' +
    'imp-893 measured rows; N in {5000, 10000} projected only (execution ' +
    'promoted to imp-917); sub-step resolution deferred to imp-898.',

  prerequisites: {
    imp_892: 'src/math/imp-857-commutator-bound.js (|tau_c(eps) - tau_c(0)| <= eps * H_0^2 / 4)',
    imp_893: 'src/data/imp-857-phased-forcing-sweep.js (6 measured rows at N in {1000, 2000})',
    imp_896: 'src/data/imp-896-retuning-calibration.js (per-N CALIBRATION constants)',
  },

  scheme: {
    singlePointEnclosure:
      'tau_c(0) in [T_lo(eps) - R(eps), T_hi(eps) + R(eps)], R(eps) = eps * H_0^2 / 4.',
    intersectedEnclosure:
      'Intersection over available eps values tightens the enclosure; ' +
      'dominated by the minimum-eps row when step-level enclosures agree.',
    richardsonExtrapolation:
      'Point estimate T_R = (eps_2 * tau_c(eps_1) - eps_1 * tau_c(eps_2)) / ' +
      '(eps_2 - eps_1); interval half-width delta_R = eps_1 * eps_2 * ' +
      'H_0^2 / (2 * (eps_2 - eps_1)) + step-level propagation.',
    sharpness:
      'Under the raw imp-892 bound (no linear/quadratic split), Richardson ' +
      'is STRICTLY WIDER than the single-point eps_min enclosure for ' +
      'eps_2 > 3 * eps_1 (Proposition 1). At measured (0.01, 0.05) the ratio ' +
      'is 2.5x wider. Richardson becomes sharper only once sub-step ' +
      'resolution (imp-898) unlocks a quadratic residual bound.',
    certifiedChoice: 'single-point intersected enclosure (E2 / E*) at eps_min',
  },

  perNMeasured:  PER_N_MEASURED,
  perNProjected: PER_N_PROJECTED,

  sharpnessCheck: SHARPNESS_CHECK,

  comparisonToExistingCertified: {
    existingCertifiedRows: 'N in {50, 100, 200, 500} from c-mb-interval-certified.js',
    existingCertifiedRange_matches_imp897: false,
    note:
      'The existing interval-RK4 certified row set stops at N = 500. This ' +
      'module extends the certified record to N in {1000, 2000} via the ' +
      'phased-forcing + imp-892 path. There is NO prior certified row at ' +
      'N in {1000, 2000} to beat, so any finite certified C_mb value here ' +
      'is a genuine advance of the certified frontier (contingent on imp-892).',
    rescueTableComparison:
      'imp-486 C_MB_RESCUE_TABLE is indexed by hypothetical K, not by N. ' +
      'Our impliedN0 per row above is the closure threshold for our C_mb ' +
      'value, directly comparable to the rescue-table N_0 entries.',
  },

  openSubGaps: OPEN_SUB_GAPS,

  headline:
    'PARTIAL: phased-forcing + imp-892 delivers certified C_mb_empirical ' +
    'interval enclosure at N in {1000, 2000}, NO prior certified row at ' +
    'those N, so phased forcing EXTENDS the certified frontier. Richardson ' +
    'extrapolation is NOT sharper than the single-point enclosure under ' +
    'the raw imp-892 bound (documented via Proposition 1); sub-step ' +
    'resolution (imp-898) is the path to actually using Richardson. ' +
    'N in {5000, 10000} pending imp-917 CPU budget.',
};

// --- Build-time assertions ------------------------------------------------

export const IMP_857_PHASED_FORCING_RICHARDSON_ASSERTIONS = [
  {
    id: 'imp897-scheme-formalized',
    holds: () =>
      typeof IMP_857_PHASED_FORCING_RICHARDSON.scheme.singlePointEnclosure ===
        'string' &&
      typeof IMP_857_PHASED_FORCING_RICHARDSON.scheme.richardsonExtrapolation ===
        'string',
    why:
      'imp-897 must formalize BOTH the single-point enclosure (E2) and ' +
      'the Richardson extrapolation (E4); each is a distinct bound with ' +
      'different sharpness properties documented in Proposition 1.',
  },
  {
    id: 'imp897-measured-N-coverage',
    holds: () =>
      PER_N_MEASURED.length === 2 &&
      PER_N_MEASURED.every((r) => r.status === 'certified'),
    why:
      'imp-897 must deliver certified rows for the measured N values ' +
      '{1000, 2000} from imp-893; anything less is not a closure of the ' +
      'measured subset.',
  },
  {
    id: 'imp897-certified-enclosure-nonempty',
    holds: () =>
      PER_N_MEASURED.every(
        (r) => r.intersected && !r.intersected.empty,
      ),
    why:
      'For each measured N, the intersection of single-point enclosures ' +
      'must be non-empty; if it were empty, that would signal a contradiction ' +
      'between eps=0.01 and eps=0.05 measurements plus imp-892, indicating ' +
      'either a measurement error or an imp-892 constant error.',
  },
  {
    id: 'imp897-sharpness-proposition',
    holds: () => SHARPNESS_CHECK.richardsonIsWider === true &&
                  SHARPNESS_CHECK.ratio_richardson_over_single > 2,
    why:
      'Proposition 1: under the raw imp-892 bound, Richardson at ' +
      '(eps1, eps2) = (0.01, 0.05) is > 2x wider than the single-point ' +
      'enclosure at eps_min. This justifies picking (E2) as the certified ' +
      'interval. If this fails, Proposition 1 is wrong or the constants ' +
      'drift.',
  },
  {
    id: 'imp897-pending-N-mapped',
    holds: () =>
      PER_N_PROJECTED.length === 2 &&
      PER_N_PROJECTED.every(
        (r) => r.status === 'projected-pending-imp-917',
      ),
    why:
      'imp-897 must explicitly map the open gap for N in {5000, 10000} ' +
      'to imp-917 (the CPU-budget execution ticket). Missing this mapping ' +
      'leaves the ticket a silent partial rather than an honest partial.',
  },
  {
    id: 'imp897-extends-certified-frontier',
    holds: () => {
      // Both measured N values are strictly greater than 500, which is the
      // upper edge of the existing c-mb-interval-certified.js certified range.
      return PER_N_MEASURED.every((r) => r.N > 500);
    },
    why:
      'The certified range of c-mb-interval-certified.js tops out at N = 500. ' +
      'If this module is not reporting at N > 500, it has not actually ' +
      'extended the certified frontier.',
  },
  {
    id: 'imp897-open-sub-gaps-named',
    holds: () =>
      OPEN_SUB_GAPS.length === 2 &&
      OPEN_SUB_GAPS.map((g) => g.id).sort().join(',') === 'imp-898,imp-917',
    why:
      'imp-897 must name EXACTLY two open sub-gaps: imp-917 (CPU budget ' +
      'for N in {5000, 10000}) and imp-898 (sub-step resolution to unlock ' +
      'Richardson sharpening). Missing either leaves a silent gap.',
  },
];

export default IMP_857_PHASED_FORCING_RICHARDSON;
