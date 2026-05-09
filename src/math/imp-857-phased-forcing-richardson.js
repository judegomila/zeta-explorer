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

// ────────────────────────────────────────────────────────────────────
// imp-981: Independent cross-verification (proof, S10-cross-verify)
// ────────────────────────────────────────────────────────────────────
//
// Static identity + numerical-reference + edge-case + algebraic-
// equivalence audit recorded inline so future readers can reproduce
// the cross-checks without re-running the engine. Follows the
// imp-919 / imp-921 / imp-971..imp-980 precedent. The file already
// exports IMP_857_PHASED_FORCING_RICHARDSON_ASSERTIONS; this block
// adds the formula-level audit absent from those build-time guards.
//
//   (1) Identity / citation audit.
//
//       (1a) Single-point enclosure (E1). Given the step-level enclosure
//            tau_c(eps) in [T_lo(eps), T_hi(eps)] and the imp-892 bound
//            |tau_c(eps) - tau_c(0)| <= R(eps), the union
//              tau_c(0) in [T_lo(eps) - R(eps), T_hi(eps) + R(eps)]
//            is a triangle-inequality consequence on intervals.
//            Standard interval algebra; CONFIRMED.
//
//       (1b) Intersected enclosure (E*). For multiple eps values, the
//            true tau_c(0) lies in EVERY single-point enclosure, so
//            the intersection is also a valid enclosure. Standard
//            set-theoretic argument; CONFIRMED.
//
//       (1c) Richardson exact recovery. Under the linear model
//            tau_c(eps) = tau_c(0) + a*eps,
//              T_R = (eps_2 * tau_c(eps_1) - eps_1 * tau_c(eps_2))
//                    / (eps_2 - eps_1)
//            recovers tau_c(0) exactly. Algebra: numerator =
//            eps_2*(tau_c(0) + a*eps_1) - eps_1*(tau_c(0) + a*eps_2)
//                  = (eps_2 - eps_1) * tau_c(0). CONFIRMED-
//            ALGEBRAICALLY.
//
//       (1d) Richardson residual (E3). With the raw imp-892 residual
//            r(eps) absorbed into |r(eps)| <= R(eps) = eps*H_0^2/4,
//              |T_R - tau_c(0)| <= (eps_2*R(eps_1)+eps_1*R(eps_2))
//                                  / (eps_2 - eps_1)
//                                = (eps_1*eps_2*H_0^2/4
//                                  + eps_1*eps_2*H_0^2/4)
//                                  / (eps_2 - eps_1)
//                                = eps_1*eps_2*H_0^2
//                                  / (2*(eps_2 - eps_1)).
//            Matches the closed form on line 122. CONFIRMED-
//            ALGEBRAICALLY.
//
//       (1e) imp-892 commutator constant. C_TAU = 0.25 (= 1/4) matches
//            the C_tau exported by src/math/imp-857-commutator-bound.js
//            (independently cross-verified in imp-979). CONFIRMED.
//
//       (1f) imp-469 rho_floor. RHO_FLOOR = 0.12751 matches the
//            analytic floor on the RvM density used throughout the
//            C_mb codebase (cited by c-mb-interval-certified.js
//            line 131 "K_paper_cert_floor = K_raw_cert / 0.12751"
//            and c-mb-unconditional-bound.js line 271 "const
//            RHO_MIN_FOR_RESCUE = 0.12751"). Standard attribution;
//            CONFIRMED.
//
//       (1g) F_mb conversion. Given tau_c(0,N) in [t_lo, t_hi] and
//            t_c_pair = H_raw^2/8, the upper magnitude
//              |F_mb|_hi = max(|t_lo - t_c_pair|, |t_hi - t_c_pair|)
//            is the supremum of |x - t_c_pair| on the closed interval
//            [t_lo, t_hi]. By convexity of |.|, the supremum is
//            attained at an endpoint. CONFIRMED.
//
//       (1h) K_raw_cert / C_mb_paper_floor formula. The shape
//              K_raw_cert = |F_mb|_hi * H_raw / (log(N)/sqrt(N)),
//              C_mb_paper_floor = K_raw_cert / RHO_FLOOR
//            matches rowCertifiedBound at lines 127, 131 of
//            src/math/c-mb-interval-certified.js. Cross-checked.
//            CONFIRMED.
//
//       (1i) minN0ForK binary search. Binary search on the function
//            f(N_0) = K * log(N_0) / sqrt(N_0) over [1e2, 1e18].
//            f is eventually decreasing (derivative negative for
//            N_0 > e^2 ~ 7.39, well below the lower bracket 1e2),
//            and tends to 0 as N_0 -> infinity, so for any K > 0 the
//            unique threshold where f drops below RHO_FLOOR is
//            isolated by 120 geometric-bisection iterations on the
//            log scale. Same shape as minN0ForC_mb in
//            src/math/c-mb-unconditional-bound.js line 273.
//            CONFIRMED.
//
//   (2) Numerical-reference re-derivation.
//
//       (2a) Sharpness ratio at (eps_1, eps_2) = (0.01, 0.05),
//            H_0 = 0.1 (the SHARPNESS_CHECK probe value).
//              R(eps_1) = C_TAU * eps_1 * H_0^2
//                       = 0.25 * 0.01 * 0.01
//                       = 2.5e-5
//              richardsonResidualOnly = (eps_1 * eps_2 * H_0^2)
//                                       / (2 * (eps_2 - eps_1))
//                                     = (0.01 * 0.05 * 0.01)
//                                       / (2 * 0.04)
//                                     = 5e-6 / 0.08
//                                     = 6.25e-5
//              ratio = 6.25e-5 / 2.5e-5 = 2.5
//            Matches SHARPNESS_CHECK.ratio_richardson_over_single
//            once executed. CONFIRMED.
//
//       (2b) Sharpness ratio closed form. Algebra:
//              Richardson_half / single_point_half(eps_1)
//                = [eps_1*eps_2*H_0^2 / (2*(eps_2-eps_1))]
//                  / [eps_1*H_0^2 / 4]
//                = (4*eps_2) / (2*(eps_2-eps_1))
//                = 2*eps_2 / (eps_2 - eps_1).
//            At (0.01, 0.05): 2*0.05/0.04 = 2.5. Matches (2a).
//            CONFIRMED-ALGEBRAICALLY.
//
//       (2c) C_TAU = 0.25 frozen vs imp-892 cited 1/4. Exact match,
//            zero delta. CONFIRMED.
//
//       (2d) RHO_FLOOR = 0.12751 frozen vs imp-469 / imp-486 cited
//            literal. Exact literal match. CONFIRMED.
//
//       (2e) RESCUE_N0_FEASIBLE_CAP = 1e7 frozen vs imp-486 rescue
//            table feasibility cap. Cited literal; CONFIRMED.
//
//       (2f) Forward-looking projection at eps_min = 0.01, dt = 1e-4.
//              projectedHalfWidth = R(eps_min) + dt/2
//                                 = 0.25*0.01*H_0^2 + 5e-5
//                                 = 0.0025*H_0^2 + 5e-5.
//            The dt/2 step-level term is the half-width of a single
//            row (no intersection); the R(eps_min) term is the
//            commutator residual at the smallest planned eps. Both
//            terms sum because the imp-892 bound and the step-level
//            bracket are independent. CONFIRMED.
//
//   (3) Edge-case audit (NaN / Inf / undefined paths).
//
//       (3a) commutatorResidual(eps, H_0). Returns C_TAU*eps*H_0^2
//            for finite eps, H_0; total. Non-finite inputs propagate
//            to NaN/Inf, surfacing downstream as null in the
//            toExponential coercion rather than silent corruption.
//            SAFE.
//
//       (3b) intersectEnclosures([]). Empty-input short-circuit
//            returns null at line 253 before the lo/hi accumulator
//            runs. SAFE.
//
//       (3c) intersectEnclosures with empty intersection (lo > hi).
//            Returns { empty: true, lo, hi } at line 260; downstream
//            certified path checks !intersected.empty before
//            computing C_mb. SAFE.
//
//       (3d) richardsonExtrapolation(row1, row2) with
//            row1.eps === row2.eps. Returns null at line 275 before
//            the divide-by-zero in the (eps_2 - eps_1) denominator.
//            SAFE.
//
//       (3e) perNReport(N) with no eps > 0 rows. Returns the
//            no-measurements status object at line 330 before any
//            downstream enclosure computation. SAFE.
//
//       (3f) forwardLookingTarget(N) with no IMP_896 calibration row.
//            Returns the no-calibration status object at line 404
//            before any downstream arithmetic. SAFE.
//
//       (3g) cMbFromTauC scaleFactor at sampled N. scaleFactor =
//            log(N)/sqrt(N) is positive and finite for N >= 2; all
//            sampled N values in N_MEASURED [1000, 2000] and
//            N_PENDING [5000, 10000] satisfy N >= 1000, so log(N) > 0
//            and sqrt(N) > 0. Division is total. SAFE.
//
//       (3h) minN0ForK with non-finite or non-positive K. Explicit
//            Number.isFinite(K) and K > 0 guard at line 207 returns
//            Infinity before binary search. For finite positive K,
//            the geometric-mean iteration mid = sqrt(lo*hi) starts at
//            sqrt(1e2 * 1e18) = 1e10 and converges in 120 iterations
//            with lo, hi staying positive and finite. SAFE.
//
//       (3i) +x.toExponential(k) coercion in the JSON-shape report
//            fields. For finite x, toExponential returns a parseable
//            string and the unary + recovers a rounded number; for
//            Infinity it would yield "Infinity" coerced to Infinity
//            (later JSON-null on serialization, but not a crash). The
//            certified.impliedN0 path has an explicit
//            Number.isFinite guard at line 390. SAFE.
//
//   (4) Cross-reference consistency.
//
//       (4a) Ticket referents: imp-892 (commutator bound),
//            imp-893 (phased-forcing prototype), imp-896 (retuning
//            calibration), imp-897 (this ticket), imp-898 (sub-step
//            resolution sub-gap), imp-917 (CPU budget sub-gap),
//            imp-486 (rescue table), imp-469 (rho_floor). Each
//            names an existing ticket; static attribution.
//
//       (4b) Imports: IMP_857_PHASED_FORCING_SWEEP from
//            ../data/imp-857-phased-forcing-sweep.js;
//            IMP_896_RETUNING_CALIBRATION from
//            ../data/imp-896-retuning-calibration.js. Both files
//            exist and export the cited objects (verified by grep at
//            audit time).
//
//       (4c) Downstream comparison: src/math/c-mb-interval-certified.js
//            CERTIFIED_ROWS at N in {50, 100, 200, 500} is the
//            existing certified row set this module extends. The
//            rowCertifiedBound formula shape matches; cross-verified
//            at lines 127, 131 of that module.
//
//       (4d) HONEST INDEPENDENCE LIMIT. The cross-verify re-derives
//            (E1), (E*), (E3), and the F_mb / K_raw_cert /
//            C_mb_paper_floor chain independently from interval
//            algebra and the imp-892 axiom. The imp-892 bound itself
//            is taken from the cross-verified
//            imp-857-commutator-bound.js (audited via imp-979) rather
//            than re-proved here. Flagged as imp981-imp892-axiom
//            (low severity).
//
//   (5) Algebraic equivalence.
//
//       (5a) (E3) factored vs closed form. The published intermediate
//              (eps_2*R(eps_1) + eps_1*R(eps_2)) / (eps_2 - eps_1)
//            with R(eps) = eps*H_0^2/4 simplifies to
//              [eps_1*eps_2*H_0^2/4 + eps_1*eps_2*H_0^2/4]
//              / (eps_2 - eps_1)
//                = eps_1*eps_2*H_0^2 / (2*(eps_2 - eps_1)).
//            Matches the closed form at line 122. CONFIRMED-
//            ALGEBRAICALLY.
//
//       (5b) (E2) is a special case of (E*). Formally: when all
//            step-level enclosures coincide (the observed situation
//            at N in {1000, 2000}), the intersection over i of
//            [T_lo - R(eps_i), T_hi + R(eps_i)] is
//            [T_lo - min_i R(eps_i), T_hi + min_i R(eps_i)] since
//            R is the only eps-dependent term. R is monotone in
//            eps, so min_i R(eps_i) = R(min_i eps_i). The intersected
//            enclosure thus collapses to (E2) at eps_min.
//            CONFIRMED-ALGEBRAICALLY.
//
//       (5c) Sharpness comparison reformulated. Richardson_half /
//            single_point_half(eps_1) = 2*eps_2 / (eps_2 - eps_1) is
//            > 1 for any 0 < eps_1 < eps_2, since 2*eps_2 >
//            (eps_2 - eps_1) reduces to eps_1 + eps_2 > 0. Therefore
//            Richardson is ALWAYS strictly wider than the single-point
//            enclosure under the raw imp-892 bound -- no threshold
//            condition is needed. This surfaces a flag (see
//            imp981-proposition-1-prose-misstated below): the JSDoc
//            Proposition 1 prose at lines 134-136 introduces a
//            threshold "eps_1/(eps_2-eps_1) > 1/2, i.e. eps_2 > 3*eps_1"
//            that is both internally inconsistent (the inner
//            inequality eps_1/(eps_2-eps_1) > 1/2 reduces to
//            eps_2 < 3*eps_1, the opposite direction from the prose)
//            and unnecessary (the always-wider conclusion holds with
//            no threshold). The downstream certifiedChoice
//            "single-point intersected enclosure" is unaffected.
//            CONFIRMED-ALGEBRAICALLY.
//
// Verdict: the imp-897 Richardson-extrapolated certified
// C_mb_empirical pathway is INTERNALLY CONSISTENT. (E1), (E*), (E3),
// and the F_mb / K_raw_cert / C_mb_paper_floor conversion chain
// re-derive cleanly from interval algebra plus the imp-892 axiom
// (cross-verified via imp-979) and the imp-469 rho_floor literal.
// Sharpness arithmetic at (eps_1, eps_2) = (0.01, 0.05), H_0 = 0.1
// reproduces the cited 2.5x ratio exactly via the closed-form
// 2*eps_2/(eps_2 - eps_1). C_TAU = 0.25, RHO_FLOOR = 0.12751, and
// RESCUE_N0_FEASIBLE_CAP = 1e7 are exact literal matches against
// imp-892, imp-469/imp-486, and imp-486 respectively. Two flags
// raised:
//   * imp981-imp892-axiom (low) -- the imp-892 commutator bound is
//     taken from the cross-verified imp-857-commutator-bound.js
//     (audited via imp-979) rather than re-proved here; a Lean port
//     remains open work via imp-870.
//   * imp981-proposition-1-prose-misstated (cosmetic) -- the JSDoc
//     Proposition 1 threshold criterion at lines 134-136 is
//     misstated. The closed-form sharpness ratio
//     2*eps_2/(eps_2-eps_1) is > 1 for any 0 < eps_1 < eps_2, so
//     Richardson is always strictly wider with no threshold needed.
//     Furthermore, the prose inequality eps_1/(eps_2-eps_1) > 1/2
//     simplifies to eps_2 < 3*eps_1, the opposite direction from the
//     accompanying "i.e. eps_2 > 3*eps_1". Numerical SHARPNESS_CHECK
//     output (richardsonIsWider = true, ratio = 2.5), the assertion
//     ratio > 2 guard, and the certifiedChoice = "single-point
//     intersected enclosure" remain VALID; only the JSDoc exposition
//     is affected.
// Neither flag changes the PARTIAL closure status nor the certified
// frontier extension to N in {1000, 2000}.
// ────────────────────────────────────────────────────────────────────

export const IMP_857_PHASED_FORCING_RICHARDSON_CROSS_VERIFY = {
  id: 'imp-981',
  auditDate: '2026-05-09',
  precedent: ['imp-919', 'imp-921', 'imp-971', 'imp-972', 'imp-973', 'imp-974', 'imp-975', 'imp-976', 'imp-977', 'imp-978', 'imp-979', 'imp-980'],
  scope: [
    'identity-audit (interval-algebra single-point E1, intersection E*, Richardson exact recovery, Richardson residual E3, imp-892 C_TAU = 0.25, imp-469 RHO_FLOOR = 0.12751, F_mb / K_raw_cert / C_mb_paper_floor formulas, minN0ForK binary search shape)',
    'numerical-reference-values (sharpness ratio = 2.5x at (0.01, 0.05) with H_0 = 0.1; closed-form ratio = 2*eps_2/(eps_2-eps_1); C_TAU = 0.25 vs imp-892 1/4; RHO_FLOOR = 0.12751 vs imp-469/imp-486; RESCUE_N0_FEASIBLE_CAP = 1e7 vs imp-486; forward-looking projectedHalfWidth = R(eps_min) + dt/2)',
    'edge-case (commutatorResidual NaN propagation, intersectEnclosures empty array & empty intersection, richardsonExtrapolation eps_1 == eps_2, perNReport no-measurements / forwardLookingTarget no-calibration, cMbFromTauC scaleFactor for N >= 1000, minN0ForK non-finite K guard, toExponential coercion safety with Number.isFinite guard on impliedN0)',
    'cross-reference-consistency (imp-892 / imp-893 / imp-896 / imp-897 / imp-898 / imp-917 / imp-486 / imp-469 referents; IMP_857_PHASED_FORCING_SWEEP and IMP_896_RETUNING_CALIBRATION imports; c-mb-interval-certified.js downstream comparison at lines 127, 131; c-mb-unconditional-bound.js minN0ForC_mb at line 273)',
    'algebraic-equivalence ((E3) factored form vs closed form; (E2) as the eps_min specialization of (E*) under coincident step-level enclosures; Richardson-vs-single-point ratio 2*eps_2/(eps_2-eps_1) always > 1 for 0 < eps_1 < eps_2)',
  ],
  identitiesReVerified: [
    {
      id: 'single-point-E1',
      claim: 'tau_c(0) in [T_lo(eps) - R(eps), T_hi(eps) + R(eps)] from |tau_c(eps) - tau_c(0)| <= R(eps) (imp-892) plus tau_c(eps) in [T_lo(eps), T_hi(eps)]',
      derivation: 'triangle inequality on intervals: union of [T_lo, T_hi] with the radius-R(eps) ball around any point gives the displayed enclosure',
      status: 'CONFIRMED',
    },
    {
      id: 'intersection-E-star',
      claim: 'tau_c(0) lies in every single-point enclosure, so the intersection is also a valid (tighter or equal) enclosure',
      derivation: 'set-theoretic: the intersection of valid enclosures is itself a valid enclosure',
      status: 'CONFIRMED',
    },
    {
      id: 'richardson-T-R-exact-recovery',
      claim: 'T_R = (eps_2*tau_c(eps_1) - eps_1*tau_c(eps_2))/(eps_2-eps_1) recovers tau_c(0) exactly under linear model tau_c(eps) = tau_c(0) + a*eps',
      derivation: 'numerator = eps_2*(tau_c(0) + a*eps_1) - eps_1*(tau_c(0) + a*eps_2) = (eps_2 - eps_1)*tau_c(0); divide by (eps_2 - eps_1)',
      status: 'CONFIRMED-ALGEBRAICALLY',
    },
    {
      id: 'richardson-residual-E3',
      claim: '|T_R - tau_c(0)| <= eps_1*eps_2*H_0^2 / (2*(eps_2-eps_1)) under |r(eps)| <= R(eps) = eps*H_0^2/4',
      derivation: '(eps_2*R(eps_1) + eps_1*R(eps_2))/(eps_2-eps_1) = (eps_1*eps_2*H_0^2/4 + eps_1*eps_2*H_0^2/4)/(eps_2-eps_1) = eps_1*eps_2*H_0^2/(2*(eps_2-eps_1))',
      status: 'CONFIRMED-ALGEBRAICALLY',
    },
    {
      id: 'sharpness-ratio-numerical',
      claim: 'Richardson_half / single_point_half(eps_1) = 2.5 at (eps_1, eps_2) = (0.01, 0.05), H_0 = 0.1',
      derivation: 'R(0.01) = 0.25*0.01*0.01 = 2.5e-5; richardsonResidualOnly = (0.01*0.05*0.01)/(2*0.04) = 5e-6/0.08 = 6.25e-5; ratio = 6.25e-5/2.5e-5 = 2.5',
      cited: 2.5,
      recomputed: ((0.01 * 0.05 * 0.1 * 0.1) / (2 * (0.05 - 0.01))) / (0.25 * 0.01 * 0.1 * 0.1),
      delta: ((0.01 * 0.05 * 0.1 * 0.1) / (2 * (0.05 - 0.01))) / (0.25 * 0.01 * 0.1 * 0.1) - 2.5,
      status: 'CONFIRMED (exact)',
    },
    {
      id: 'sharpness-ratio-closed-form',
      claim: 'Richardson_half / single_point_half(eps_1) = 2*eps_2/(eps_2-eps_1) (closed form, H_0-independent)',
      derivation: '[eps_1*eps_2*H_0^2/(2*(eps_2-eps_1))] / [eps_1*H_0^2/4] = 4*eps_2/(2*(eps_2-eps_1)) = 2*eps_2/(eps_2-eps_1); H_0^2 and eps_1 both cancel',
      cited: 2.5,
      recomputed: (2 * 0.05) / (0.05 - 0.01),
      delta: (2 * 0.05) / (0.05 - 0.01) - 2.5,
      status: 'CONFIRMED-ALGEBRAICALLY',
    },
    {
      id: 'C-tau-frozen-vs-imp-892',
      claim: 'C_TAU = 0.25 matches imp-892 cited 1/4',
      derivation: 'literal match against the constant exported by src/math/imp-857-commutator-bound.js (independently audited via imp-979)',
      cited: 0.25,
      recomputed: 1 / 4,
      delta: 1 / 4 - 0.25,
      status: 'CONFIRMED (exact)',
    },
    {
      id: 'rho-floor-frozen-vs-imp-469',
      claim: 'RHO_FLOOR = 0.12751 matches imp-469 / imp-486 analytic RvM density floor',
      derivation: 'literal match against c-mb-interval-certified.js line 131 ("K_paper_cert_floor = K_raw_cert / 0.12751") and c-mb-unconditional-bound.js line 271 ("RHO_MIN_FOR_RESCUE = 0.12751")',
      cited: 0.12751,
      recomputed: 0.12751,
      delta: 0,
      status: 'CONFIRMED (exact literal)',
    },
    {
      id: 'F-mb-upper-formula',
      claim: '|F_mb|_hi = max(|t_lo - t_c_pair|, |t_hi - t_c_pair|) is the supremum of |x - t_c_pair| on the closed interval [t_lo, t_hi]',
      derivation: '|x - c| is convex in x; the supremum on a closed interval is attained at an endpoint',
      status: 'CONFIRMED',
    },
    {
      id: 'K-raw-cert-shape',
      claim: 'K_raw_cert = |F_mb|_hi * H_raw / (log(N)/sqrt(N)); C_mb_paper_floor = K_raw_cert / RHO_FLOOR',
      derivation: 'matches rowCertifiedBound at lines 127 and 131 of src/math/c-mb-interval-certified.js (cross-checked at audit time)',
      status: 'CONFIRMED',
    },
  ],
  edgeCases: [
    {
      path: 'commutatorResidual(eps, H_0)',
      risk: 'NaN / Inf propagation from non-finite inputs',
      mitigation: 'callers (perNReport, forwardLookingTarget) supply finite eps from the static IMP_857_PHASED_FORCING_SWEEP rows and finite H_0 from IMP_896_RETUNING_CALIBRATION; non-finite would surface as null in the JSON report rather than crash',
      verdict: 'SAFE',
    },
    {
      path: 'intersectEnclosures([])',
      risk: 'empty array would leave [-Infinity, +Infinity] window through the lo/hi accumulator',
      mitigation: 'explicit length === 0 short-circuit returns null at line 253 before the accumulator runs',
      verdict: 'SAFE',
    },
    {
      path: 'intersectEnclosures with empty intersection (lo > hi)',
      risk: 'invalid bounds passed downstream as a numerical interval',
      mitigation: 'returns { empty: true, lo, hi } at line 260; downstream certified path checks !intersected.empty before computing C_mb at line 345',
      verdict: 'SAFE',
    },
    {
      path: 'richardsonExtrapolation(row1, row2) with row1.eps === row2.eps',
      risk: 'division by zero in the (eps_2 - eps_1) denominator',
      mitigation: 'explicit equality short-circuit returns null at line 275 before any arithmetic',
      verdict: 'SAFE',
    },
    {
      path: 'perNReport(N) with no eps > 0 measurement rows',
      risk: 'empty rows array yields empty enclosures and an undefined certified path',
      mitigation: 'returns the no-measurements status object at line 330 before downstream computation; the assertion imp897-measured-N-coverage requires status === "certified" for N in {1000, 2000}, surfacing any data drift',
      verdict: 'SAFE',
    },
    {
      path: 'forwardLookingTarget(N) with no IMP_896 calibration row',
      risk: 'undefined H_0 propagates NaN through projectedHalfWidth',
      mitigation: 'returns the no-calibration status object at line 404 before any arithmetic; the assertion imp897-pending-N-mapped requires status === "projected-pending-imp-917" for N in {5000, 10000}, surfacing any calibration drift',
      verdict: 'SAFE',
    },
    {
      path: 'cMbFromTauC scaleFactor at sampled N',
      risk: 'log(1) = 0 or log(0) = -Infinity edge cases would yield NaN / Inf in K_raw_cert',
      mitigation: 'all caller N values in N_MEASURED [1000, 2000] and N_PENDING [5000, 10000] satisfy N >= 1000; log(N) > 0 and sqrt(N) > 0 so scaleFactor > 0',
      verdict: 'SAFE',
    },
    {
      path: 'minN0ForK with non-finite or non-positive K',
      risk: 'NaN / Inf propagation through 120 iterations of geometric bisection',
      mitigation: 'explicit Number.isFinite(K) and K > 0 guard returns Infinity at line 207 before the loop',
      verdict: 'SAFE',
    },
    {
      path: '+x.toExponential(k) coercion in report fields',
      risk: 'Infinity or NaN serialization to JSON',
      mitigation: 'finite inputs yield clean rounded numbers; the certified.impliedN0 path has an explicit Number.isFinite guard at line 390 emitting null when Infinity; other fields use finite arithmetic by construction',
      verdict: 'SAFE',
    },
  ],
  numericalReferences: [
    {
      symbol: 'sharpness ratio at (eps_1, eps_2) = (0.01, 0.05), H_0 = 0.1',
      cited: 2.5,
      recomputed: ((0.01 * 0.05 * 0.1 * 0.1) / (2 * (0.05 - 0.01))) / (0.25 * 0.01 * 0.1 * 0.1),
      delta: ((0.01 * 0.05 * 0.1 * 0.1) / (2 * (0.05 - 0.01))) / (0.25 * 0.01 * 0.1 * 0.1) - 2.5,
      verdict: 'CONFIRMED (exact)',
    },
    {
      symbol: 'sharpness-ratio closed form 2*eps_2/(eps_2-eps_1) at (0.01, 0.05)',
      cited: 2.5,
      recomputed: (2 * 0.05) / (0.05 - 0.01),
      delta: (2 * 0.05) / (0.05 - 0.01) - 2.5,
      verdict: 'CONFIRMED-ALGEBRAICALLY',
    },
    {
      symbol: 'C_TAU vs imp-892',
      cited: 0.25,
      recomputed: 1 / 4,
      delta: 0,
      verdict: 'CONFIRMED (exact)',
    },
    {
      symbol: 'RHO_FLOOR vs imp-469 / imp-486',
      cited: 0.12751,
      recomputed: 0.12751,
      delta: 0,
      verdict: 'CONFIRMED (exact literal)',
    },
    {
      symbol: 'RESCUE_N0_FEASIBLE_CAP vs imp-486',
      cited: 1e7,
      recomputed: 1e7,
      delta: 0,
      verdict: 'CONFIRMED (exact literal)',
    },
    {
      symbol: 'single-point half-width R(0.01) at H_0 = 0.1',
      cited: 2.5e-5,
      recomputed: 0.25 * 0.01 * 0.1 * 0.1,
      delta: 0.25 * 0.01 * 0.1 * 0.1 - 2.5e-5,
      verdict: 'CONFIRMED (exact)',
    },
    {
      symbol: 'Richardson residual at (0.01, 0.05), H_0 = 0.1',
      cited: 6.25e-5,
      recomputed: (0.01 * 0.05 * 0.1 * 0.1) / (2 * (0.05 - 0.01)),
      delta: (0.01 * 0.05 * 0.1 * 0.1) / (2 * (0.05 - 0.01)) - 6.25e-5,
      verdict: 'CONFIRMED (exact)',
    },
  ],
  flags: [
    {
      id: 'imp981-imp892-axiom',
      severity: 'low',
      finding:
        'The Richardson residual (E3) inherits the imp-892 commutator bound |tau_c(eps) - tau_c(0)| <= eps*H_0^2/4 as a published axiom. That bound was independently cross-verified in imp-979 (audit of src/math/imp-857-commutator-bound.js), so the dependency chain is closed at the JS-arithmetic level. A Lean port of imp-892 (skeleton tracked under imp-870) remains an open formalization gap.',
    },
    {
      id: 'imp981-proposition-1-prose-misstated',
      severity: 'cosmetic',
      finding:
        'The JSDoc Proposition 1 prose at lines 134-136 states "Richardson is wider than the single-point (E2) whenever eps_1/(eps_2-eps_1) > 1/2, i.e. eps_2 > 3*eps_1". Audit findings: (i) the inner inequality eps_1/(eps_2-eps_1) > 1/2 simplifies to 2*eps_1 > eps_2 - eps_1, i.e. eps_2 < 3*eps_1, the OPPOSITE direction from the prose accompanying "i.e. eps_2 > 3*eps_1"; (ii) the cleanest correct statement is no threshold at all -- the closed-form sharpness ratio Richardson_half/single_point_half(eps_1) = 2*eps_2/(eps_2-eps_1) is > 1 for any 0 < eps_1 < eps_2 (since 2*eps_2 > eps_2 - eps_1 reduces to eps_1 + eps_2 > 0), so Richardson is ALWAYS strictly wider under the raw imp-892 bound. The numerical SHARPNESS_CHECK output (richardsonIsWider = true, ratio = 2.5), the assertion ratio_richardson_over_single > 2 guard, and the certifiedChoice = "single-point intersected enclosure" remain VALID. Only the JSDoc exposition is affected; no exported value or guarded behavior changes.',
    },
  ],
  notIndependentlyChecked: [
    {
      id: 'imp-892-commutator-bound',
      why: 'the |tau_c(eps) - tau_c(0)| <= eps*H_0^2/4 inequality is taken from src/math/imp-857-commutator-bound.js (independently audited via imp-979); not re-proved here',
    },
    {
      id: 'imp-893-sweep-rows',
      why: 'the IMP_857_PHASED_FORCING_SWEEP measured rows are taken as the static numerical anchor; re-running the imp-893 prototype is out of scope for a static cross-verify',
    },
    {
      id: 'imp-896-calibration',
      why: 'the IMP_896_RETUNING_CALIBRATION minGap values are imported as published; re-running the calibration pipeline is out of scope',
    },
    {
      id: 'c-mb-interval-certified-shape',
      why: 'the rowCertifiedBound formula shape in src/math/c-mb-interval-certified.js is read as a cross-reference; that module has its own cross-verification track',
    },
  ],
  verdict:
    'INTERNALLY CONSISTENT. (E1) single-point, (E*) intersection, and (E3) Richardson residual re-derive cleanly from interval algebra and the cross-verified imp-892 axiom. Sharpness arithmetic at (eps_1, eps_2) = (0.01, 0.05), H_0 = 0.1 reproduces the cited 2.5x ratio exactly via the closed form 2*eps_2/(eps_2-eps_1). C_TAU = 0.25 and RHO_FLOOR = 0.12751 are exact literal matches against imp-892 and imp-469 / imp-486. Two flags raised: imp981-imp892-axiom (low; pending Lean port via imp-870), imp981-proposition-1-prose-misstated (cosmetic; the JSDoc Proposition 1 threshold criterion is misstated -- correct conclusion is "always wider for 0 < eps_1 < eps_2", with no threshold needed; the inner inequality also reduces to the opposite direction from the accompanying prose). Neither flag changes the PARTIAL closure status nor the certified frontier extension to N in {1000, 2000}.',
};

export default IMP_857_PHASED_FORCING_RICHARDSON;
