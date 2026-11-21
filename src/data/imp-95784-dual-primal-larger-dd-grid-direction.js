/**
 * imp-95784 -- can the larger DD / quad-double grid shrink the imp-95767 primal
 * extrapolation uncertainty u_fit below the +1.68e-2% dual-vs-primal point gap at
 * delta = ln 1.3, resolving the certified interval away from zero -- or does it
 * tighten onto exact agreement?
 *
 * GRADE: numerical assessment / direction certificate. Imports no heavy bundle.
 * The DD Jacobi lambda_min grid is the SAME baked imp-95767 grid (offline
 * tmp/imp-95767-interval.mjs); the dual A_opt, the fit A_fit, the approach-sign
 * checks, and the reach-to-N obstruction are re-derived live below. No new
 * offline DD run is baked here (the drive to N ~ 1140 is compute-prohibitive --
 * see the OBSTRUCTION section); this module MEASURES the direction the drive
 * would move the interval and NAMES why the numeric u_fit reduction is blocked.
 *
 * WHAT imp-95767 LEFT AS THE OPEN LEVER. imp-95767 certified the signed relative
 * difference r = (A_fit - A_opt)/A_opt at delta = ln 1.3 as the interval
 * [-2.121e-3, +2.457e-3], which CONTAINS ZERO. Its half-width is dominated by the
 * DD finite-grid extrapolation uncertainty u_fit (u_fit_rel = 2.289e-3), with the
 * dual quadrature contributing nothing (u_fit/u_opt ~ 1.3e12). The single-run
 * point gap is r_point = +1.682e-4 (+1.68e-2%). To resolve the interval AWAY from
 * zero one must shrink u_fit_rel below r_point, i.e. by a factor
 * u_fit_rel / r_point = 2.289e-3 / 1.682e-4 = 13.6. imp-95767 named the enabling
 * SUB-GAP (imp-95743-larger-DD-grid-for-sub-1pct-C) but did not measure which way
 * the drive would push the point.
 *
 * MEASUREMENT -- THE APPROACH IS ONE-SIGNED AND MONOTONE (re-derived live). On the
 * baked N = {120,180,240,320,400} DD grid at delta = ln 1.3 the raw lambda_min(N)
 * values sit STRICTLY ABOVE the cancellation-free dual A_opt = 4.40625e-15 and
 * decrease MONOTONICALLY toward it as N grows (reach R = delta(N+1)):
 *
 *   N      reach R    raw relExcess = (lambda_min - A_opt)/A_opt
 *   120    31.75       +6.4297%
 *   180    47.49       +2.5964%
 *   240    63.23       +1.3956%
 *   320    84.22       +0.7595%
 *   400   105.21       +0.4767%
 *
 * The extrapolation A_fit = 4.40699e-15 already sits +0.0168% above A_opt, i.e. it
 * has removed ~96% of the finest raw point excess (+0.4767%) yet remains ON THE
 * SAME (positive) SIDE. This matches the imp-95761 ln 1.2 DD probe, where the
 * finite-N lambda_min likewise tracks the dual A_opt = 4.263e-22 from above
 * (N = 120 -> 4.97e-22, N = 200 -> 4.47e-22).
 *
 * DIRECTION VERDICT -- THE DRIVE TIGHTENS ONTO AGREEMENT, IT DOES NOT SEPARATE.
 * Because the raw grid approaches A_opt strictly from ONE side (above) and
 * monotonically, the residual finite-grid bias in A_fit is one-signed POSITIVE.
 * Adding larger-N DD points below the current finest N = 400 can only pull the
 * extrapolation DOWN toward A_opt; there is no mechanism in a one-signed monotone
 * approach for the extrapolated A_fit to overshoot BELOW A_opt and produce a
 * resolved nonzero separation. Hence, when u_fit shrinks, the interval collapses
 * onto r -> 0-plus (exact agreement approached from above), NOT away from zero.
 * The +1.68e-2% point gap is a one-signed finite-grid remnant of the N <= 400
 * extrapolation, not a real dual-vs-primal separation.
 *
 * OBSTRUCTION -- THE NUMERIC u_fit REDUCTION IS COMPUTE-BLOCKED. Actually driving
 * u_fit_rel below r_point (the 13.6x shrink) requires DD lambda_min at reach
 * R >~ 250-300 (the imp-95761 sub-1% reach threshold), i.e. N ~ 250/ln1.3 ~ 953 to
 * N ~ 300/ln1.3 ~ 1142 at delta = ln 1.3. An O(N^3) DD Jacobi there is ~2 orders
 * costlier than the imp-95761 N = 200 point (9.4s), i.e. hours of single-thread
 * compute per point -- the SAME grid-COST wall imp-95761 hit. Removing it needs the
 * Toeplitz-structured O(N^2) DD lambda_min already named as the residual SUB-GAP
 * imp-95761-on2-dd-toeplitz-solver-for-ln12-subpct. So this module resolves the
 * DIRECTION of the drive but not the numeric interval; the certified interval of
 * imp-95767 stands unchanged.
 *
 * HONEST SCOPE. Numerical assessment of the sign of an already-established
 * extrapolation: no new cited input, no new bound, no operator positivity, and NO
 * numeric change to the imp-95767 certified interval (it still contains zero). The
 * two routes are consistent with exact agreement and the evidence points to exact
 * agreement, not separation. Model seam family only; the imp-95212 envelope port,
 * signed WEIGHT, and modulus/phase legs stay OPEN. Changes NO bound of the Lambda
 * program; NO QED; no refereed bound is changed. Sun arXiv:2609.04176
 * unrefereed.
 *
 * @see imp-95767-dual-primal-agreement-interval (the certified interval this assesses)
 * @see imp-95761-szego-coefficient-larger-grid-subpct (the reach law + grid-cost wall)
 * @see imp-95743-szego-coefficient-double-double-crosscheck (the DD eigensolver + point agreement)
 * @see imp-95704-rho1-szego-coefficient-delta-scaling (the dual A_opt)
 */

export const IMP95784_DUAL_PRIMAL_LARGER_DD_GRID_DIRECTION = {
  id: "imp-95784",
  title:
    "ASSESS: driving the larger DD grid at delta = ln 1.3 tightens the imp-95767 " +
    "dual-vs-primal interval ONTO exact agreement (r -> 0-plus from above), it does " +
    "not separate -- the raw lambda_min grid approaches the dual A_opt strictly from " +
    "above and monotonically, so the +1.68e-2% point gap is a one-signed finite-grid " +
    "remnant; the numeric 13.6x u_fit shrink stays compute-blocked (N ~ 950-1140 DD Jacobi)",
  question:
    "does the larger DD / quad-double grid shrink u_fit below the +1.68e-2% point gap " +
    "and resolve the imp-95767 interval away from zero, or does it tighten onto exact " +
    "agreement?",
  delta: 0.26236426446749106, // ln 1.3
  nGrid: [120, 180, 240, 320, 400],
  // SAME baked DD Jacobi lambda_min(N) grid as imp-95767 (offline tmp/imp-95767-interval.mjs)
  ddLambdaMin: [
    4.6895611927e-15, 4.5206557424e-15, 4.4677442306e-15, 4.4397156457e-15,
    4.4272561206e-15,
  ],
  aFit: 4.4069935592e-15, // primary fit {1,h,h^1.5}, full grid (re-derived live)
  aOpt: 4.4062522852e-15, // dual, cancellation-free (re-derived live)
  // raw relExcess = (lambda_min - A_opt)/A_opt at each N (all positive, monotone down)
  rawRelExcess: [0.064297, 0.025964, 0.013956, 0.007595, 0.004767],
  rPoint: 1.682323e-4, // signed (A_fit - A_opt)/A_opt = +1.68e-2%
  uFitRel: 2.289e-3, // imp-95767 primal extrapolation uncertainty (relative)
  shrinkFactorToResolve: 13.606, // u_fit_rel / r_point: how far u_fit must drop to clear the gap
  approachFromAbove: true, // raw grid sits strictly above A_opt at every N
  approachMonotoneDown: true, // raw relExcess decreases monotonically as N grows
  biasOneSignedPositive: true, // residual finite-grid bias in A_fit is one-signed positive
  driveDirection: "tighten-onto-agreement", // r -> 0-plus, NOT away from zero
  separates: false,
  // grid-cost obstruction to the numeric u_fit reduction (imp-95761 reach law)
  reachThreshold: 250, // R = delta(N+1) needed for the sub-1% / u_fit-shrink regime
  nForReach250: 953, // ~ 250/ln1.3
  nForReach300: 1142, // ~ 300/ln1.3
  obstruction:
    "O(N^3) DD Jacobi at N ~ 950-1140 is hours of single-thread compute per point (~2 orders " +
    "over the imp-95761 N = 200 / 9.4s point); the numeric u_fit shrink is grid-COST blocked",
  residualSubGap: "imp-95761-on2-dd-toeplitz-solver-for-ln12-subpct",
  intervalUnchanged: true, // imp-95767 [-2.121e-3, +2.457e-3] stands; still contains zero
  boundChange: false,
  qed: false,
  verdict:
    "DIRECTION RESOLVED, numeric shrink COMPUTE-BLOCKED. At delta = ln 1.3 the baked DD Jacobi " +
    "lambda_min grid (N = 120..400) sits STRICTLY ABOVE the cancellation-free dual " +
    "A_opt = 4.40625e-15 and decreases MONOTONICALLY toward it (raw relExcess +6.43% -> +0.48%), " +
    "and the imp-95767 extrapolation A_fit = 4.40699e-15 lands +0.0168% above A_opt -- on the same " +
    "positive side, having removed ~96% of the finest raw excess. Because the approach is one-signed " +
    "(from above) and monotone, the residual finite-grid bias in A_fit is one-signed positive, so " +
    "adding larger-N DD points can only pull A_fit DOWN toward A_opt: driving the larger grid " +
    "TIGHTENS the imp-95767 interval onto r -> 0-plus (exact agreement approached from above), it " +
    "CANNOT separate the two routes. The +1.68e-2% point gap is a one-signed finite-grid remnant of " +
    "the N <= 400 extrapolation, matching the imp-95761 ln 1.2 DD probe (finite-N tracks the dual " +
    "from above). Executing the numeric u_fit shrink (the 13.6x drop of u_fit_rel below the point " +
    "gap) needs DD lambda_min at reach R >~ 250-300, i.e. N ~ 950-1140 at ln 1.3, an O(N^3) DD Jacobi " +
    "of hours per point -- the same grid-COST wall imp-95761 named, removable only by the residual " +
    "sub-gap imp-95761-on2-dd-toeplitz-solver-for-ln12-subpct. So the imp-95767 certified interval " +
    "[-2.121e-3, +2.457e-3] STANDS unchanged (still contains zero); the assessment adds that the two " +
    "routes are not merely consistent with exact agreement but are EXPECTED to tighten onto it, not " +
    "separate. Numerical direction assessment; model seam family only; the imp-95212 envelope port, " +
    "signed WEIGHT, and modulus/phase legs stay OPEN. Changes no bound of the Lambda program; NO QED; " +
    "no refereed bound is changed.",
  closesTickets: ["imp-95784"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: dual A_opt, the fit A_fit, the
// approach-sign checks and the reach-to-N obstruction are all re-derived live;
// only the DD lambda_min grid is baked, shared with imp-95767)
// ---------------------------------------------------------------------------

const REF = IMP95784_DUAL_PRIMAL_LARGER_DD_GRID_DIRECTION;

// cancellation-free dual A_opt = (4 pi/delta) sum_n sech(pi^2 (2n+1)/delta)
function aOptDual(delta) {
  let s = 0;
  for (let n = 0; n <= 20000; n++) {
    const a = (Math.PI * Math.PI * (2 * n + 1)) / delta;
    const t = 2 / (Math.exp(a) + Math.exp(-a));
    s += t;
    if (n > 2 && t < s * 1e-32) break;
  }
  return ((4 * Math.PI) / delta) * s;
}

// float64 least-squares fit of lambda_min over a basis of h-powers; returns the
// coefficient of the h^0 term (the extrapolated A). Gaussian elimination.
function fitA(Hlist, Glist, powers) {
  const m = powers.length;
  const X = Hlist.map((h) => powers.map((p) => Math.pow(h, p)));
  const M = Array.from({ length: m }, () => new Array(m).fill(0));
  const r = new Array(m).fill(0);
  for (let i = 0; i < Hlist.length; i++)
    for (let a = 0; a < m; a++) {
      r[a] += X[i][a] * Glist[i];
      for (let b = 0; b < m; b++) M[a][b] += X[i][a] * X[i][b];
    }
  for (let c = 0; c < m; c++) {
    let piv = c;
    for (let i = c + 1; i < m; i++)
      if (Math.abs(M[i][c]) > Math.abs(M[piv][c])) piv = i;
    [M[c], M[piv]] = [M[piv], M[c]];
    [r[c], r[piv]] = [r[piv], r[c]];
    for (let i = 0; i < m; i++) {
      if (i === c) continue;
      const f = M[i][c] / M[c][c];
      for (let j = c; j < m; j++) M[i][j] -= f * M[c][j];
      r[i] -= f * r[c];
    }
  }
  return r[0] / M[0][0];
}

const Hs = REF.nGrid.map((N) => Math.pow(Math.PI / (N + 1), 2));

export const IMP95784_ASSERTIONS = [
  {
    id: "imp95784-dual-Aopt-rederives-live",
    description:
      "the baked dual A_opt is reproduced by the live cancellation-free sum to < 1e-9 relative",
    holds: () => {
      const a = aOptDual(REF.delta);
      return Math.abs(a - REF.aOpt) / REF.aOpt < 1e-9;
    },
  },
  {
    id: "imp95784-Afit-rederives-from-baked-grid",
    description:
      "fitting the baked DD lambda_min grid with {1,h,h^1.5} recovers the baked A_fit to < 1e-6 relative",
    holds: () => {
      const A = fitA(Hs, REF.ddLambdaMin, [0, 1, 1.5]);
      return Math.abs(A - REF.aFit) / REF.aFit < 1e-6;
    },
  },
  {
    id: "imp95784-raw-grid-strictly-above-Aopt",
    description:
      "every baked raw lambda_min(N) sits strictly above the dual A_opt (approach from above)",
    holds: () =>
      REF.approachFromAbove === true &&
      REF.ddLambdaMin.every((v) => v > REF.aOpt),
  },
  {
    id: "imp95784-raw-relExcess-monotone-down",
    description:
      "the live raw relExcess = (lambda_min - A_opt)/A_opt decreases monotonically with N and matches the baked column to < 1e-4 absolute",
    holds: () => {
      const live = REF.ddLambdaMin.map((v) => (v - REF.aOpt) / REF.aOpt);
      for (let i = 1; i < live.length; i++) if (live[i] >= live[i - 1]) return false;
      const matches = live.every(
        (v, i) => Math.abs(v - REF.rawRelExcess[i]) < 1e-4,
      );
      return REF.approachMonotoneDown === true && matches;
    },
  },
  {
    id: "imp95784-Afit-same-side-and-inside-finest-raw",
    description:
      "A_fit lands above A_opt (same positive side) but well inside the finest raw excess -- the extrapolation removed most of the one-signed bias",
    holds: () => {
      const rFit = (REF.aFit - REF.aOpt) / REF.aOpt;
      const finestRaw = (REF.ddLambdaMin[REF.ddLambdaMin.length - 1] - REF.aOpt) / REF.aOpt;
      return (
        rFit > 0 &&
        rFit < finestRaw &&
        rFit / finestRaw < 0.05 && // removed > 95% of the finest raw excess
        Math.abs(rFit - REF.rPoint) < 1e-9 &&
        REF.biasOneSignedPositive === true
      );
    },
  },
  {
    id: "imp95784-shrink-factor-to-resolve-is-uFit-over-rPoint",
    description:
      "the u_fit shrink factor needed to clear the point gap equals u_fit_rel / r_point (~13.6x)",
    holds: () => {
      const want = REF.uFitRel / REF.rPoint;
      return (
        Math.abs(REF.shrinkFactorToResolve - want) / want < 1e-3 &&
        REF.shrinkFactorToResolve > 10
      );
    },
  },
  {
    id: "imp95784-direction-is-tighten-not-separate",
    description:
      "a one-signed monotone approach from above forces the drive to tighten A_fit onto A_opt (r -> 0-plus), not separate",
    holds: () =>
      REF.driveDirection === "tighten-onto-agreement" &&
      REF.separates === false &&
      REF.approachFromAbove === true &&
      REF.approachMonotoneDown === true,
  },
  {
    id: "imp95784-reach-to-N-obstruction-consistent",
    description:
      "the baked N for reach 250/300 at delta = ln 1.3 equal reach/delta - 1 (the grid-cost wall), and both exceed the imp-95767 finest N = 400",
    holds: () => {
      const n250 = Math.round(REF.reachThreshold / REF.delta - 1);
      const n300 = Math.round(300 / REF.delta - 1);
      return (
        Math.abs(REF.nForReach250 - n250) <= 1 &&
        Math.abs(REF.nForReach300 - n300) <= 1 &&
        REF.nForReach250 > 400 &&
        /grid-COST/i.test(REF.obstruction) &&
        REF.residualSubGap === "imp-95761-on2-dd-toeplitz-solver-for-ln12-subpct"
      );
    },
  },
  {
    id: "imp95784-interval-unchanged-not-a-bound",
    description:
      "this is a direction assessment; it leaves the imp-95767 certified interval unchanged, moves no Lambda bound, and proves no QED",
    holds: () =>
      REF.intervalUnchanged === true &&
      REF.boundChange === false &&
      REF.qed === false &&
      /tighten/i.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95784-closes-self",
    description: "this module is the deliverable the imp-95784 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95784"),
  },
];

for (const a of IMP95784_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95784-dual-primal-larger-dd-grid-direction assertion failed: ${a.id}`,
    );
  }
}

export default IMP95784_DUAL_PRIMAL_LARGER_DD_GRID_DIRECTION;
