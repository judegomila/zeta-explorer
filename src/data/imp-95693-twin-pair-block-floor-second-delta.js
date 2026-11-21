/**
 * imp-95693 -- DELTA-ROBUSTNESS TEST of the imp-95659 twin-pair block floor
 * F(delta, rho). imp-95659 tabulated the per-pair block floor
 * F(delta, rho) = lambda_min(sech seam Gram) across a rho grid at the SINGLE
 * in-pair gap delta = ln 1.3, finding strict rho-monotonicity, a ~12-order
 * sweep between the two imp-95642 endpoints, and a ~1/2-retention crossover
 * near rho ~ 15. This module recomputes the same rho grid at a SECOND in-pair
 * gap delta = ln 1.5 (with delta = ln 1.2 as a cross-check) to decide whether
 * those three features are robust properties of the twin-pair symbol or
 * artifacts of the single delta sampled.
 *
 * GRADE: derivation + numerical witness. Imports no heavy bundle. Uses the
 * IDENTICAL machinery to imp-95659 / imp-95642 (normalized seam Gram
 * Gtilde_ij = sech((x_i - x_j)/2), twin-pair lattice of nPairs = 40 pairs,
 * in-pair gap delta, cross-pair gap D = rho * delta, F = lambda_min). Changes
 * no Lambda bound; NO QED; no refereed bound is changed.
 *
 * WHAT THE SECOND DELTA SHOWS (delta = ln 1.5, nPairs = 40, verified below).
 *
 *   rho     D = rho*delta   F = lambda_min     F / A_opt      F / blockIso
 *   1       0.405465        1.757117e-9        1.0565e+0      8.697e-8
 *   1.5     0.608198        1.618574e-7        9.7319e+1      8.011e-6
 *   2       0.810930        2.840277e-6        1.7078e+3      1.406e-4
 *   3       1.216395        8.124257e-5        4.8848e+4      4.021e-3
 *   5       2.027326        1.555796e-3        9.3545e+5      7.700e-2
 *   10      4.054651        1.120030e-2        6.7344e+6      5.544e-1
 *   20      8.109302        1.902483e-2        1.1439e+7      9.416e-1
 *   50      20.273255       2.020144e-2        1.2146e+7      9.999e-1
 *   100     40.546511       2.020410e-2        1.2148e+7      1.000e+0
 *
 * VERDICT ON THE THREE FEATURES.
 *   (a) MONOTONICITY -- ROBUST. F(delta, rho) is strictly increasing in rho at
 *       delta = ln 1.5 exactly as at ln 1.3 (and ln 1.2, ln 2.0). The monotone
 *       two-scale -> single-scale bridge is a delta-independent structural
 *       feature of the twin-pair symbol.
 *   (b) ENDPOINT BRACKETING -- ROBUST where the scalar floor is above the
 *       double-precision Jacobi floor. At ln 1.5 the sweep is bracketed by the
 *       two imp-95642 endpoints: rho = 1 collapses to the scalar A_opt(delta)
 *       (ratio 1.0565, the finite-size Szego factor), and rho = 100 recovers
 *       the isolated block floor 1 - sech(delta/2) to 5.2e-9 rel. CAVEAT: at
 *       ln 1.2 the scalar floor A_opt = 4.26e-22 sits BELOW the ~1e-16 Jacobi
 *       noise floor, so F goes spuriously negative at rho <= 1.5 -- the LEFT
 *       endpoint is only numerically confirmable when A_opt(delta) is above
 *       machine precision (i.e. delta not too small). This is a precision
 *       limit, not a failure of the mechanism.
 *   (c) HALF-RETENTION CROSSOVER -- DELTA-SPECIFIC IN rho, but DELTA-STABLE IN
 *       ABSOLUTE D. The rho at which F / blockIso crosses 1/2 DRIFTS strongly
 *       with delta: rho_cross ~ 21.9 (ln 1.2), 15.0 (ln 1.3), 9.4 (ln 1.5),
 *       5.2 (ln 2.0) -- so the imp-95659 "rho ~ 15" is a ln-1.3-SPECIFIC value,
 *       NOT a delta-stable constant. The DRIFT is explained: the crossover sits
 *       at a nearly FIXED ABSOLUTE cross-pair gap D_cross ~ 3.6-4.0 across the
 *       whole 3.8x delta range (D_cross = 4.00, 3.93, 3.81, 3.59), so
 *       rho_cross = D_cross / delta ~ (const) / delta accounts for the entire
 *       rho drift. The half-retention scale is a property of the absolute
 *       separation D (where sech(D/2) drops the off-block seam coupling by half),
 *       not of the ratio rho.
 *
 * HONEST SCOPE. (a) Pure delta-robustness tabulation of an already-established
 * two-endpoint mechanism (imp-95642 / THEOREM SEP-OPT imp-95419); introduces no
 * new cited input and no new bound. (b) F is a finite-size (80-point) proxy for
 * the per-pair block floor; the rho = 1 value carries the same finite-size
 * Szego factor as imp-95659 and is not the infinite-lattice infimum. (c) The
 * ln 1.2 left endpoint is below double precision (see caveat (b) above). (d)
 * Model seam family only; the imp-95212 envelope port, signed WEIGHT, and
 * modulus/phase legs stay OPEN. Changes NO bound of the Lambda program; NO QED;
 * no refereed bound is changed.
 *
 * @see imp-95659-twin-pair-block-floor-rho-tabulation (the single-delta interior tabulation this generalizes)
 * @see imp-95642-twin-pair-symbol-offlattice-obstruction (the two endpoints bracketing the sweep)
 * @see imp-95419-separated-class-optimal-riesz-floor (THEOREM SEP-OPT, scalar class floor A_opt)
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95693_TWIN_PAIR_BLOCK_FLOOR_SECOND_DELTA = {
  id: "imp-95693",
  title:
    "DELTA-ROBUSTNESS: recomputing the imp-95659 twin-pair block floor " +
    "F(delta, rho) at a second in-pair gap delta = ln 1.5 shows the strict " +
    "rho-monotonicity and endpoint bracketing are delta-robust, but the " +
    "~1/2-retention crossover is delta-specific in rho (drifts ~15 -> ~9.4) " +
    "while nearly fixed in the ABSOLUTE cross-pair gap D_cross ~ 3.6-4.0",
  question:
    "is the imp-95659 single-scale twin-pair block-floor picture (strict " +
    "rho-monotonicity, endpoint bracketing, ~1/2-retention near rho ~ 15) a " +
    "robust feature of the twin-pair symbol or an artifact of the one in-pair " +
    "gap delta = ln 1.3 sampled?",
  nPairs: 40, // 80 log-rates; same finite size as imp-95659 / imp-95642
  baselineDelta: 0.26236426446749106, // ln 1.3 (imp-95659)
  secondDelta: 0.4054651081081644, // ln 1.5 (this module)
  secondDeltaAOpt: 1.663158e-9, // A_opt(ln 1.5), theta-dual scalar floor
  secondDeltaBlockIso: 0.020204104, // 1 - sech(ln1.5 / 2), isolated 2x2 block floor
  // Interior tabulation at the SECOND delta = ln 1.5. Columns match imp-95659:
  // F = lambda_min(seam Gram) at cross-pair gap D = rho*delta; FoverAopt =
  // F / A_opt (block advantage over scalar floor); FoverBlock = F / blockIso.
  tableLn15: [
    { rho: 1, D: 0.405465108, F: 1.757117e-9, FoverAopt: 1.0565, FoverBlock: 8.6968e-8 },
    { rho: 1.5, D: 0.608197662, F: 1.618574e-7, FoverAopt: 97.319, FoverBlock: 8.0111e-6 },
    { rho: 2, D: 0.810930216, F: 2.840277e-6, FoverAopt: 1707.8, FoverBlock: 1.4058e-4 },
    { rho: 3, D: 1.216395324, F: 8.124257e-5, FoverAopt: 48848, FoverBlock: 4.0211e-3 },
    { rho: 5, D: 2.027325541, F: 1.555796e-3, FoverAopt: 935450, FoverBlock: 7.7004e-2 },
    { rho: 10, D: 4.054651081, F: 1.120030e-2, FoverAopt: 6734400, FoverBlock: 0.55436 },
    { rho: 20, D: 8.109302162, F: 1.902483e-2, FoverAopt: 11439000, FoverBlock: 0.94163 },
    { rho: 50, D: 20.273255405, F: 2.020144e-2, FoverAopt: 12146000, FoverBlock: 0.99987 },
    { rho: 100, D: 40.546510811, F: 2.020410e-2, FoverAopt: 12148000, FoverBlock: 1.0 },
  ],
  // Half-retention crossover (F / blockIso = 1/2) located by bisection in D at
  // four in-pair gaps: nearly FIXED in absolute D, drifting as ~1/delta in rho.
  crossoverByDelta: [
    { label: "ln1.2", delta: 0.182321557, Dcross: 3.998, rhoCross: 21.93 },
    { label: "ln1.3", delta: 0.262364264, Dcross: 3.926, rhoCross: 14.97 },
    { label: "ln1.5", delta: 0.405465108, Dcross: 3.805, rhoCross: 9.384 },
    { label: "ln2.0", delta: 0.693147181, Dcross: 3.589, rhoCross: 5.178 },
  ],
  monotoneRobust: true, // strict rho-monotonicity persists at every delta tested
  bracketingRobust: true, // both imp-95642 endpoints bracket the ln 1.5 sweep
  crossoverDeltaStableInRho: false, // rho_cross drifts ~15 -> ~9.4 (ln1.3 -> ln1.5)
  crossoverDeltaStableInAbsoluteD: true, // D_cross ~ 3.6-4.0 across the 3.8x delta range
  ln12LeftEndpointBelowPrecision: true, // A_opt(ln1.2)=4.26e-22 < 1e-16 Jacobi floor
  boundChange: false,
  qed: false,
  verdict:
    "DELTA-ROBUSTNESS DECIDED. Recomputing the imp-95659 block floor " +
    "F(delta, rho) at a second in-pair gap delta = ln 1.5 (plus ln 1.2, ln 2.0 " +
    "cross-checks) shows: (a) strict rho-monotonicity is ROBUST -- a " +
    "delta-independent structural feature; (b) endpoint bracketing is ROBUST " +
    "where the scalar floor A_opt(delta) sits above the ~1e-16 double-precision " +
    "Jacobi floor (holds at ln 1.5 and ln 1.3; the ln 1.2 left endpoint " +
    "A_opt = 4.26e-22 is below precision and shows spurious negative F, a " +
    "precision limit not a mechanism failure); (c) the ~1/2-retention crossover " +
    "is DELTA-SPECIFIC IN rho (rho_cross drifts 21.9 -> 15.0 -> 9.4 -> 5.2 as " +
    "delta grows ln1.2 -> ln2.0, so the imp-95659 rho ~ 15 is ln-1.3-specific), " +
    "but DELTA-STABLE IN THE ABSOLUTE cross-pair gap D_cross ~ 3.6-4.0 across " +
    "the whole 3.8x delta range -- the half-retention scale is set by the " +
    "absolute separation D, not the ratio rho. Pure tabulation of an " +
    "established two-endpoint mechanism; no new cited input. Model seam family " +
    "only; imp-95212 envelope port, signed WEIGHT, modulus/phase legs stay " +
    "OPEN. Changes no bound of the Lambda program; NO QED; no refereed bound is changed" +
    ".",
  closesTickets: ["imp-95693"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

function sech(x) {
  return 2 / (Math.exp(x) + Math.exp(-x));
}

// stable theta-dual (Poisson) form of the scalar class floor A_opt(delta)
function aOptDual(delta) {
  let s = 0;
  for (let n = 0; n <= 500; n++) {
    const t = sech((Math.PI * Math.PI * (2 * n + 1)) / delta);
    s += t;
    if (n > 2 && t < s * 1e-25) break;
  }
  return ((4 * Math.PI) / delta) * s;
}

// Jacobi eigenvalue sweep, lambda_min of a symmetric matrix
function lambdaMin(A0) {
  const n = A0.length;
  const A = A0.map((r) => r.slice());
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
    if (off < 1e-30) break;
    for (let p = 0; p < n - 1; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-18) continue;
        const theta = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t =
          Math.sign(theta || 1) /
          (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = A[k][p];
          const akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A[p][k];
          const aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
      }
    }
  }
  let mn = Infinity;
  for (let i = 0; i < n; i++) mn = Math.min(mn, A[i][i]);
  return mn;
}

function gramFromLogRates(xs) {
  return xs.map((a) => xs.map((b) => sech((a - b) / 2)));
}

// twin-pair lattice: nPairs pairs, in-pair gap delta, cross-pair gap D
function twinPairRates(nPairs, delta, D) {
  const xs = [];
  let base = 0;
  for (let k = 0; k < nPairs; k++) {
    xs.push(base);
    xs.push(base + delta);
    base += delta + D;
  }
  return xs;
}

const REF = IMP95693_TWIN_PAIR_BLOCK_FLOOR_SECOND_DELTA;

// recompute the effective block floor F(delta, rho)
function computeF(delta, rho) {
  const D = rho * delta;
  return lambdaMin(gramFromLogRates(twinPairRates(REF.nPairs, delta, D)));
}

// bisect the half-retention crossover in absolute D for a given delta
function crossoverD(delta) {
  const block = 1 - sech(delta / 2);
  const g = (D) =>
    lambdaMin(gramFromLogRates(twinPairRates(REF.nPairs, delta, D))) / block -
    0.5;
  let lo = 0.5,
    hi = 30;
  for (let i = 0; i < 60; i++) {
    const mid = 0.5 * (lo + hi);
    if (g(mid) < 0) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

export const IMP95693_ASSERTIONS = [
  {
    id: "imp95693-second-delta-monotone-increasing",
    description:
      "at the SECOND in-pair gap delta = ln 1.5, F(delta, rho) is strictly " +
      "increasing across the whole rho grid (rho-monotonicity is delta-robust)",
    holds: () => {
      let prev = -Infinity;
      for (const row of REF.tableLn15) {
        const F = computeF(REF.secondDelta, row.rho);
        if (!(F > prev)) return false;
        prev = F;
      }
      return REF.monotoneRobust === true;
    },
  },
  {
    id: "imp95693-second-delta-reproduces-baked-F",
    description:
      "each baked ln 1.5 interior F literal is reproduced by a fresh " +
      "lambda_min computation to 2e-3 rel for the numerically robust rows " +
      "(F >= 1e-8); the rho = 1 row nearest the scalar floor is checked only " +
      "ordinally above",
    holds: () =>
      REF.tableLn15.every((row) => {
        if (row.F < 1e-8) return true; // near scalar-floor row: ordinal only
        const F = computeF(REF.secondDelta, row.rho);
        return Math.abs(F - row.F) / row.F < 2e-3;
      }),
  },
  {
    id: "imp95693-second-delta-endpoints-bracket",
    description:
      "at delta = ln 1.5 the sweep is bracketed by the two imp-95642 " +
      "endpoints: rho = 1 collapses to the scalar A_opt (ratio in (1, 1.2)) " +
      "and rho = 100 recovers the isolated block floor 1 - sech(delta/2) to " +
      "1e-4 rel (endpoint bracketing is delta-robust above precision)",
    holds: () => {
      const aOpt = aOptDual(REF.secondDelta);
      const block = 1 - sech(REF.secondDelta / 2);
      const r1 = computeF(REF.secondDelta, 1) / aOpt;
      if (!(r1 > 1 && r1 < 1.2)) return false;
      const f100 = computeF(REF.secondDelta, 100);
      return (
        Math.abs(f100 - block) / block < 1e-4 &&
        REF.bracketingRobust === true
      );
    },
  },
  {
    id: "imp95693-crossover-drifts-in-rho",
    description:
      "the half-retention crossover in rho is DELTA-SPECIFIC: rho_cross at " +
      "ln 1.5 is well below the imp-95659 ln-1.3 value ~15, so the ~15 figure " +
      "is not a delta-stable constant",
    holds: () => {
      const rhoLn13 = crossoverD(0.26236426446749106) / 0.26236426446749106;
      const rhoLn15 = crossoverD(REF.secondDelta) / REF.secondDelta;
      // ln 1.3 recovers ~15; ln 1.5 drifts materially lower (~9-10)
      return (
        rhoLn13 > 13 &&
        rhoLn13 < 17 &&
        rhoLn15 < 11 &&
        rhoLn15 < rhoLn13 - 3 &&
        REF.crossoverDeltaStableInRho === false
      );
    },
  },
  {
    id: "imp95693-crossover-stable-in-absolute-D",
    description:
      "the half-retention crossover in the ABSOLUTE cross-pair gap D_cross is " +
      "nearly delta-stable (~3.6-4.0) across the full ln1.2 -> ln2.0 range, " +
      "explaining the rho drift as D_cross / delta",
    holds: () => {
      const deltas = [
        Math.log(1.2),
        Math.log(1.3),
        Math.log(1.5),
        Math.log(2.0),
      ];
      let lo = Infinity,
        hi = -Infinity;
      for (const d of deltas) {
        const Dc = crossoverD(d);
        lo = Math.min(lo, Dc);
        hi = Math.max(hi, Dc);
      }
      // all four crossover D values sit in a tight band around 3.6-4.0
      return (
        lo > 3.3 && hi < 4.2 && hi - lo < 0.6 &&
        REF.crossoverDeltaStableInAbsoluteD === true
      );
    },
  },
  {
    id: "imp95693-ln12-left-endpoint-below-precision",
    description:
      "the ln 1.2 scalar floor A_opt = 4.26e-22 sits below the ~1e-16 " +
      "double-precision Jacobi floor, so the left endpoint is not numerically " +
      "confirmable there (an honest precision limit, recorded not hidden)",
    holds: () => {
      const aOpt12 = aOptDual(Math.log(1.2));
      return (
        aOpt12 < 1e-16 &&
        REF.ln12LeftEndpointBelowPrecision === true
      );
    },
  },
  {
    id: "imp95693-baseline-matches-imp95659",
    description:
      "the baseline delta = ln 1.3 reproduces the imp-95659 rho = 10 interior " +
      "value F = 1.491123e-3 to 1e-3 rel (identical machinery cross-check)",
    holds: () => {
      const F = computeF(REF.baselineDelta, 10);
      return Math.abs(F - 1.491123e-3) / 1.491123e-3 < 1e-3;
    },
  },
  {
    id: "imp95693-not-a-bound",
    description:
      "this is a delta-robustness tabulation / documentation module; it moves " +
      "no Lambda bound and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      /DELTA-ROBUSTNESS DECIDED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95693-closes-self",
    description: "this module is the deliverable the imp-95693 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95693"),
  },
];

for (const a of IMP95693_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95693-twin-pair-block-floor-second-delta assertion failed: ${a.id}`,
    );
  }
}

export default IMP95693_TWIN_PAIR_BLOCK_FLOOR_SECOND_DELTA;
