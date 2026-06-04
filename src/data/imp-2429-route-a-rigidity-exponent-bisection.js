/**
 * @module imp-2429-route-a-rigidity-exponent-bisection
 * @jsdocTag imp-2429
 *
 * imp-2429: Bisect the minimal local-law rigidity exponent alpha in N^-alpha
 * sufficient for the Route A monotonicity step.
 *
 * Wave-2 fan-out, follow-on to imp-2365 (local-law-rigidity-closure.js) and
 * imp-486 (many-body center-of-mass correction shown irreducible under full
 * GUE universality). imp-2365 asked the binary question "does edge-scale
 * rigidity N^-2/3 suffice for Route A monotonicity?". This file treats the
 * required universality strength as a CONTINUOUS parameter alpha and locates,
 * by numerical bisection on a model ensemble, the threshold exponent alpha_c.
 *
 * HONEST SCOPE
 * ------------
 * This is a numerical exploration on a REDUCED MODEL ensemble, not a theorem
 * about the true Calogero-Moser many-body system. It states a conditional
 * threshold under explicitly-named model assumptions, and names a sub-gap
 * (imp-2429-O-coupling-constants) blocking promotion to a rigorous statement.
 * No QED is claimed and the Route A "closed modulo GUE" status is unchanged.
 *
 * MODEL (per imp-456 unfolded-monotonicity + imp-486 CM-correction picture)
 * -------------------------------------------------------------------------
 * imp-456 proved the unfolded Hamiltonian monotonicity H_{N+1} <= H_N
 * unconditionally; the residual obstruction is the many-body center-of-mass
 * correction C_mb, which couples to eigenvalue displacements. We model the
 * monotonicity step at level N as a sign condition
 *
 *     D_det(N)  -  delta(N, alpha)   >=  0,
 *
 * where:
 *   D_det(N) = c_det * log(N) / N
 *       the deterministic per-step decrement of the unfolded log-gas energy
 *       to leading (Selberg) order. c_det is an O(1) normalization.
 *   delta(N, alpha) = c_pert * N^-alpha * maxAbs(z_1..z_N)
 *       the realized C_mb perturbation under an ASSUMED rigidity bound
 *       |lambda_i - gamma_i| <= N^-alpha * (fluctuation). Rigidity is an
 *       L-infinity statement, so the correction couples to the worst-case
 *       displacement over the N points; z_i are iid standard normal
 *       fluctuations (seeded, deterministic RNG). c_pert is an O(1) coupling.
 *
 * Larger alpha = stronger rigidity = smaller error = more easily closes.
 * The closure region is thus alpha >= alpha_c (a MINIMAL sufficient strength);
 * equivalently alpha_c is the largest exponent at which the step is still on
 * the boundary of closing. We report alpha_c and its sensitivity.
 *
 * ANALYTIC LIMIT
 * --------------
 * With E[maxAbs] ~ sqrt(2 log N), the marginal exponent solving
 * D_det(N) = N^-alpha sqrt(2 log N) is
 *     alpha_marginal(N) = 1 + 0.5 * log(2 / log N) / log N,
 * which is < 1 for all finite N and increases to 1 as N -> infinity. So the
 * asymptotic threshold is alpha_inf = 1 (bulk-scale rigidity): edge-scale
 * rigidity alpha = 2/3 is NOT sufficient. This recovers, as a continuous
 * threshold, the imp-486 verdict that bulk GUE universality is required.
 *
 * SYNTAX SAFETY: comments use dg_{k}/dt notation; no apostrophes inside single
 * quoted strings.
 */

// ── Deterministic seeded RNG (mulberry32 + Box-Muller) ────────────────────────

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function standardNormal(rng) {
  // Box-Muller; guard u against 0 to avoid log(0).
  let u = rng();
  if (u < 1e-12) u = 1e-12;
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function maxAbsNormals(N, rng) {
  let m = 0;
  for (let i = 0; i < N; i++) {
    const z = Math.abs(standardNormal(rng));
    if (z > m) m = z;
  }
  return m;
}

// ── Model constants ───────────────────────────────────────────────────────────

const C_DET = 1.0;  // O(1) deterministic decrement normalization
const C_PERT = 1.0; // O(1) C_mb coupling normalization

function dDet(N) {
  return (C_DET * Math.log(N)) / N;
}

// ── Model ensemble ──────────────────────────────────────────────────────────

const N_LADDER = [64, 128, 256, 512, 1024, 2048, 4096];
const N_SEEDS = 32;

// Precompute maxAbs(z_1..z_N) once per (N, seed). These do NOT depend on alpha,
// so the bisection only rescales them by N^-alpha. Deterministic given seeds.
const MAXZ = N_LADDER.map((N, k) =>
  Array.from({ length: N_SEEDS }, (_, s) =>
    maxAbsNormals(N, mulberry32(1009 * (k + 1) + 7919 * (s + 1) + 17)),
  ),
);

// Median maxAbs per N (for the empirical per-row marginal exponent).
function median(arr) {
  const a = [...arr].sort((x, y) => x - y);
  const n = a.length;
  return n % 2 ? a[(n - 1) / 2] : 0.5 * (a[n / 2 - 1] + a[n / 2]);
}
const MED_MAXZ = MAXZ.map((row) => median(row));

// Fraction of (N, seed) realizations whose monotonicity step closes at exponent
// alpha:  D_det(N) >= C_PERT * N^-alpha * maxZ.
function closureFraction(alpha) {
  let closed = 0;
  let total = 0;
  for (let k = 0; k < N_LADDER.length; k++) {
    const N = N_LADDER[k];
    const d = dDet(N);
    const scale = C_PERT * Math.pow(N, -alpha);
    for (let s = 0; s < N_SEEDS; s++) {
      total++;
      if (d - scale * MAXZ[k][s] >= 0) closed++;
    }
  }
  return closed / total;
}

// closureFraction is monotone non-decreasing in alpha, so we bisect for the
// smallest alpha achieving a target closure probability.
function bisectThreshold(target, lo = 0.3, hi = 1.6, iters = 60) {
  let a = lo;
  let b = hi;
  for (let i = 0; i < iters; i++) {
    const mid = 0.5 * (a + b);
    if (closureFraction(mid) >= target) b = mid;
    else a = mid;
  }
  return 0.5 * (a + b);
}

const TARGETS = [0.5, 0.9, 0.99];
const ALPHA_C_BY_TARGET = TARGETS.map((t) => ({
  target: t,
  alphaC: bisectThreshold(t),
}));

const ALPHA_C_MEDIAN = ALPHA_C_BY_TARGET.find((r) => r.target === 0.5).alphaC;
const ALPHA_C_P99 = ALPHA_C_BY_TARGET.find((r) => r.target === 0.99).alphaC;

// ── Sensitivity ───────────────────────────────────────────────────────────────

// (1) Sharpness: slope of closure fraction in alpha at the median threshold.
const H_FD = 1e-3;
const SENS_SLOPE =
  (closureFraction(ALPHA_C_MEDIAN + H_FD) - closureFraction(ALPHA_C_MEDIAN - H_FD)) /
  (2 * H_FD);

// (2) Probability-requirement sensitivity: how much the threshold moves between
// the p50 and p99 closure requirements.
const SENS_TARGET_SPREAD = ALPHA_C_P99 - ALPHA_C_MEDIAN;

// (3) Constant sensitivity: re-bisect the median threshold with c_det scaled by
// 1/2 and 2 to confirm the threshold moves only logarithmically (O(1) constants
// shift alpha_c by O(1/log N), not by an order-one amount).
function bisectMedianWithCdet(cdetFactor) {
  const cd = C_DET * cdetFactor;
  const frac = (alpha) => {
    let closed = 0;
    let total = 0;
    for (let k = 0; k < N_LADDER.length; k++) {
      const N = N_LADDER[k];
      const d = (cd * Math.log(N)) / N;
      const scale = C_PERT * Math.pow(N, -alpha);
      for (let s = 0; s < N_SEEDS; s++) {
        total++;
        if (d - scale * MAXZ[k][s] >= 0) closed++;
      }
    }
    return closed / total;
  };
  let a = 0.3;
  let b = 1.6;
  for (let i = 0; i < 60; i++) {
    const mid = 0.5 * (a + b);
    if (frac(mid) >= 0.5) b = mid;
    else a = mid;
  }
  return 0.5 * (a + b);
}
const ALPHA_C_CDET_HALF = bisectMedianWithCdet(0.5);
const ALPHA_C_CDET_DOUBLE = bisectMedianWithCdet(2.0);
const SENS_CDET_RANGE = Math.abs(ALPHA_C_CDET_DOUBLE - ALPHA_C_CDET_HALF);

// ── Per-row analytic + empirical marginal exponents ───────────────────────────
//
// analyticMarginal: 1 + 0.5*log(2/log N)/log N (uses E[maxAbs] ~ sqrt(2 log N)).
// empiricalMarginal: solve D_det(N) = N^-alpha * median(maxAbs) per row.
const PER_ROW = N_LADDER.map((N, k) => {
  const logN = Math.log(N);
  const analyticMarginal = 1 + (0.5 * Math.log(2 / logN)) / logN;
  const empiricalMarginal = Math.log(MED_MAXZ[k] / dDet(N)) / logN;
  return {
    N,
    medMaxAbs: MED_MAXZ[k],
    dDet: dDet(N),
    analyticMarginal,
    empiricalMarginal,
  };
});

// Reference exponents: edge-scale rigidity (2/3) vs bulk-scale (1).
const EDGE_ALPHA = 2 / 3;
const BULK_ALPHA = 1.0;
const EDGE_CLOSURE_FRACTION = closureFraction(EDGE_ALPHA);
const BULK_CLOSURE_FRACTION = closureFraction(BULK_ALPHA);

// ── Sub-gap blocking a rigorous statement ─────────────────────────────────────

const IMP2429_SUB_GAP = {
  id: "imp-2429-O-coupling-constants",
  label: "First-principles C_mb coupling weights and decrement constant",
  description:
    "The threshold alpha_c is computed against a reduced model: a leading-order " +
    "log-gas decrement D_det(N) = c_det log(N)/N and a worst-case L-infinity " +
    "coupling of the many-body CM correction to eigenvalue displacements. The " +
    "true Route A step requires the actual CM Hessian / coupling weights and the " +
    "exact deterministic decrement constant, neither derived here. Pinning those " +
    "is precisely the imp-486 obstruction (the reduction needs GUE universality). " +
    "Until they are derived, alpha_c is a model-conditional threshold, not the " +
    "rigidity exponent of the genuine many-body monotonicity step.",
  reference: "imp-486 many-body CM correction; imp-2365 local-law-rigidity-closure.js",
  difficulty: "research-grade / open",
  partialProgress:
    "Continuous-threshold map established: the step closes for alpha >= alpha_c " +
    "with alpha_c near 0.9 on the measured ladder and analytic limit alpha_inf = 1. " +
    "Edge-scale rigidity (alpha = 2/3) is insufficient; bulk-scale (alpha -> 1) is " +
    "required, consistent with imp-486.",
};

// ── Closure record ────────────────────────────────────────────────────────────

export const ROUTE_A_RIGIDITY_EXPONENT_BISECTION = {
  id: "imp-2429",
  title:
    "Bisect the minimal local-law rigidity exponent alpha in N^-alpha sufficient " +
    "for Route A monotonicity",
  status: "partial",
  closureType: "honest-partial-numerical",
  proofSection: null,

  summary:
    "Treats the required rigidity strength as a continuous exponent alpha (assumed " +
    "bound |lambda_i - gamma_i| <= N^-alpha) and bisects, on a seeded model " +
    "ensemble, the threshold alpha_c at which the unfolded Route A monotonicity " +
    "step (imp-456) marginally survives the many-body CM correction (imp-486). " +
    "Reports alpha_c at three closure-probability targets, its sensitivity to the " +
    "probability requirement and to the O(1) model constants, and the per-row " +
    "marginal exponents with their analytic limit alpha_inf = 1.",

  model: {
    decrement: "D_det(N) = c_det * log(N) / N  (leading-order log-gas, c_det = 1)",
    perturbation:
      "delta(N, alpha) = c_pert * N^-alpha * maxAbs(z_1..z_N), z_i iid N(0,1), " +
      "c_pert = 1 (worst-case L-infinity rigidity coupling)",
    closureCondition: "D_det(N) - delta(N, alpha) >= 0",
    ladder: N_LADDER,
    seeds: N_SEEDS,
  },

  thresholds: {
    description:
      "alpha_c by closure-probability target on the model ensemble. Larger alpha = " +
      "stronger rigidity; step closes for alpha >= alpha_c.",
    byTarget: ALPHA_C_BY_TARGET,
    alphaCMedian: ALPHA_C_MEDIAN,
    alphaCp99: ALPHA_C_P99,
    analyticLimit: BULK_ALPHA,
  },

  sensitivity: {
    description:
      "Three sensitivity probes of alpha_c.",
    closureSlopeAtThreshold: SENS_SLOPE,
    targetSpread_p50_to_p99: SENS_TARGET_SPREAD,
    constantRange_cdet_half_to_double: SENS_CDET_RANGE,
    alphaCWithCdetHalf: ALPHA_C_CDET_HALF,
    alphaCWithCdetDouble: ALPHA_C_CDET_DOUBLE,
  },

  perRowMarginal: {
    description:
      "Per-row marginal exponent. analyticMarginal = 1 + 0.5 log(2/log N)/log N " +
      "(< 1 for finite N, -> 1 as N -> infinity). empiricalMarginal solves the " +
      "median-displacement closure equation directly.",
    rows: PER_ROW,
  },

  referenceExponents: {
    edgeAlpha: EDGE_ALPHA,
    edgeClosureFraction: EDGE_CLOSURE_FRACTION,
    bulkAlpha: BULK_ALPHA,
    bulkClosureFraction: BULK_CLOSURE_FRACTION,
    verdict:
      "Edge-scale rigidity (alpha = 2/3) leaves the step OPEN on the ensemble; " +
      "bulk-scale rigidity (alpha -> 1) closes it. The imp-2365 candidate input " +
      "N^-2/3 is therefore insufficient.",
  },

  subGap: IMP2429_SUB_GAP,

  verdict:
    "CONDITIONAL NUMERICAL THRESHOLD: on the reduced model ensemble the Route A " +
    "monotonicity step closes for alpha >= alpha_c, with alpha_c near 0.9 on the " +
    "measured N-ladder (64..4096) and analytic limit alpha_inf = 1 (bulk-scale " +
    "rigidity). The threshold is insensitive to the O(1) model constants (moves " +
    "only O(1/log N) when c_det is varied by a factor of 4) but sharp in the " +
    "fluctuations. Edge-scale rigidity N^-2/3 is NOT sufficient; essentially bulk " +
    "GUE rigidity is required, recovering the imp-486 irreducibility verdict as a " +
    "continuous exponent. NOT a theorem: see sub-gap imp-2429-O-coupling-constants.",
};

// ── Build-time assertions ─────────────────────────────────────────────────────

export const ROUTE_A_RIGIDITY_EXPONENT_BISECTION_ASSERTIONS = [
  {
    id: "imp2429-ensemble-populated",
    holds: () =>
      MAXZ.length === N_LADDER.length &&
      MAXZ.every((row) => row.length === N_SEEDS && row.every((v) => v > 0)),
    why:
      "Each (N, seed) cell must hold a positive maxAbs fluctuation. An empty or " +
      "zero cell means the seeded RNG or Box-Muller draw failed and every " +
      "downstream threshold is meaningless.",
  },
  {
    id: "imp2429-closure-monotone-in-alpha",
    holds: () =>
      closureFraction(0.4) <= closureFraction(0.9) &&
      closureFraction(0.9) <= closureFraction(1.4),
    why:
      "Stronger rigidity (larger alpha) can only help the step close, so the " +
      "closure fraction must be non-decreasing in alpha. A violation means the " +
      "closure condition or the N^-alpha scaling is mis-implemented and the " +
      "bisection is invalid.",
  },
  {
    id: "imp2429-threshold-above-edge",
    holds: () => ALPHA_C_MEDIAN > EDGE_ALPHA,
    why:
      "The central finding: the threshold exponent exceeds the edge-scale value " +
      "2/3. If alpha_c fell at or below 2/3 the imp-2365 edge-rigidity input would " +
      "suffice, contradicting the imp-486 bulk-universality obstruction. This " +
      "tripwire guards the headline conditional conclusion.",
  },
  {
    id: "imp2429-threshold-below-limit",
    holds: () => ALPHA_C_P99 < 1.05,
    why:
      "At finite N the threshold must sit just below (or at) the analytic bulk " +
      "limit alpha_inf = 1; even the strict p99 requirement should not push it " +
      "materially past 1. A much larger value signals the fluctuation scale or " +
      "decrement is wrong.",
  },
  {
    id: "imp2429-edge-insufficient-bulk-sufficient",
    holds: () =>
      EDGE_CLOSURE_FRACTION < 0.5 && BULK_CLOSURE_FRACTION > 0.9,
    why:
      "Edge-scale rigidity (alpha = 2/3) must leave a majority of realizations " +
      "OPEN while bulk-scale rigidity (alpha = 1) closes nearly all of them. This " +
      "separates the sufficient from the insufficient input and is the operational " +
      "content of the threshold.",
  },
  {
    id: "imp2429-constants-only-log-sensitive",
    holds: () => SENS_CDET_RANGE < 0.35,
    why:
      "Varying the O(1) decrement constant c_det by a factor of 4 must move the " +
      "threshold only logarithmically: the expected shift is log(4)/log(N), which " +
      "is at most about 0.33 at the smallest ladder point (N = 64) and smaller for " +
      "larger N. A move beyond this band would mean alpha_c is an artefact of the " +
      "arbitrary normalization (a power-law dependence on c_det) rather than a " +
      "genuine exponent.",
  },
  {
    id: "imp2429-sensitivity-slope-positive",
    holds: () => SENS_SLOPE > 0,
    why:
      "The closure fraction must increase with alpha at the threshold (positive " +
      "transition slope). A non-positive slope would mean the threshold is not a " +
      "real boundary and the reported sensitivity is spurious.",
  },
  {
    id: "imp2429-sub-gap-named",
    holds: () =>
      typeof IMP2429_SUB_GAP.id === "string" &&
      IMP2429_SUB_GAP.id.startsWith("imp-2429"),
    why:
      "An honest partial closure must name a sub-gap blocking a rigorous statement. " +
      "The id must start with imp-2429 to tie it to this ticket; a wrong id breaks " +
      "the audit trail and risks a false impression of full closure.",
  },
];
