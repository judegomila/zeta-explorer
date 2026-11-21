/**
 * imp-95704 -- delta-scaling of the imp-95689 finite-size Szego edge coefficient
 * C = f''(pi) / (2 A_opt) for the rho = 1 uniform-lattice block floor.
 *
 * GRADE: numerical tabulation extending an already-established endpoint result.
 * Imports no heavy bundle; no bignum eigensolver. imp-95689 pinned the rho = 1
 * uniform-lattice block floor to the EXACT infinite-lattice limit F / A_opt = 1
 * with a nondegenerate quadratic-minimum correction
 *
 *     F / A_opt = 1 + C (pi / (N + 1))^2 + O(N^{-3}),   C = f''(pi) / (2 A_opt),
 *
 * but reported C only at delta = ln 1.3 (C = 71.690) with a single well-
 * conditioned validation at delta = 3. This module MEASURES C across a delta grid
 * and reports how the finite-size Szego edge coefficient scales with delta.
 *
 * THE DUAL (imp-95689). At rho = 1 the seam Gram G_{jk} = sech((j - k) delta / 2)
 * is Toeplitz with symbol f(theta) whose minimum sits at theta = pi. Poisson
 * summation gives the cancellation-free dual
 *
 *     f(theta)   = (2 pi / delta) sum_k sech( pi (2 pi k - theta) / delta ),
 *     f''(theta) = -(2 pi / delta)(pi / delta)^2
 *                    sum_k sech(u_k)(2 sech^2 u_k - 1),  u_k = pi(2 pi k - theta)/delta,
 *
 * and A_opt = min_theta f = f(pi) = (4 pi / delta) sum_n sech(pi^2 (2n+1) / delta)
 * (imp-95419). Both f''(pi) and A_opt are evaluated as sums of tiny positive terms
 * with no cancellation, so C = f''(pi) / (2 A_opt) is well conditioned even where
 * A_opt itself underflows toward the float64 range.
 *
 * MEASURED GRID (dual-form, cancellation-free):
 *
 *   delta      A_opt          f''(pi)        C = f''(pi)/(2 A_opt)   C * delta^2
 *   ln1.2      4.2634e-22     1.2659e-19     148.45462              4.934802
 *   ln1.3      4.4063e-15     6.3177e-13      71.69030              4.934802
 *   ln1.5      1.6632e-09     9.9845e-08      30.01669              4.934802
 *   ln2        2.3745e-05     4.8777e-04      10.27114              4.934802
 *   1          1.2999e-03     1.2830e-02       4.93480              4.934802
 *   3          3.1214e-01     3.3851e-01       0.54225              4.880225
 *
 * THE SCALING LAW. C blows up as delta -> 0, and it does so in a completely
 * explicit way: C * delta^2 = pi^2 / 2 = 4.9348022 to full precision across the
 * whole small/moderate-delta range (delta <= 1), so
 *
 *     C(delta) = pi^2 / (2 delta^2)   (exact as delta -> 0).
 *
 * WHY (closed form). At theta = pi the dual sums are dominated by their single
 * smallest-argument term, sech(pi^2 / delta) (the n = 0 / k = 0,1 terms), and for
 * small delta 2 sech^2 - 1 -> -1. Hence the LEADING behaviour of the two duals is
 *
 *     A_opt   ~ (4 pi / delta) sech(pi^2 / delta),
 *     f''(pi) ~ (4 pi / delta)(pi / delta)^2 sech(pi^2 / delta),
 *
 * and the identical (4 pi / delta) sech(pi^2 / delta) prefactor CANCELS in the
 * ratio, leaving C = f''(pi) / (2 A_opt) -> (1 / 2)(pi / delta)^2 = pi^2/(2 delta^2).
 * The blow-up is therefore benign: it is a pure delta^{-2} rescaling of the SAME
 * transcendental prefactor that governs A_opt, not a new small-delta pathology. It
 * does not signal any breakdown of the imp-95689 exponent-2 law -- it only means
 * that at tiny delta a fixed lattice size N must satisfy N + 1 >> pi / delta before
 * the finite-size correction C (pi/(N+1))^2 becomes small (the natural finite-size
 * variable is delta (N + 1), not N + 1). At delta = 3 the single-term approximation
 * is only ~99% accurate (C delta^2 = 4.880 vs 4.935) because higher Poisson terms
 * contribute, so the exact delta^{-2} law is a small-delta asymptotic, sharp well
 * inside the imp-95693 rho-sweep regime (delta = ln 1.2 .. ln 2).
 *
 * HONEST SCOPE. (a) Tabulation of an already-established endpoint coefficient
 * across delta; introduces no new cited input and no new bound. (b) The delta^{-2}
 * law is the small-delta single-term asymptotic of the imp-95689 dual, cross-checked
 * against the exact dual ratio on the grid (agreement to < 1e-5 for delta <= 1).
 * (c) Model seam family only; the imp-95212 envelope port, signed WEIGHT, and
 * modulus/phase legs stay OPEN. Changes NO bound of the Lambda program; NO QED;
 * no refereed bound is changed.
 *
 * @see imp-95689-rho1-szego-dual-convergence-rate (C at delta = ln 1.3)
 * @see imp-95419-separated-class-optimal-riesz-floor (A_opt = symbol infimum)
 * @see imp-95693-twin-pair-block-floor-rho-tabulation (the delta = ln 1.2 endpoint)
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95704_RHO1_SZEGO_COEFFICIENT_DELTA_SCALING = {
  id: "imp-95704",
  title:
    "DELTA-SCALING: the imp-95689 finite-size Szego edge coefficient " +
    "C = f''(pi)/(2 A_opt) of the rho = 1 block floor obeys C = pi^2/(2 delta^2) " +
    "exactly as delta -> 0 -- it BLOWS UP like delta^{-2}, a pure rescaling of the " +
    "shared sech(pi^2/delta) prefactor that cancels in the ratio, not a pathology",
  question:
    "how does the imp-95689 exponent-2 convergence coefficient C = f''(pi)/(2 A_opt) " +
    "scale with the in-pair gap delta -- does C blow up as delta -> 0 where A_opt " +
    "underflows?",
  // Measured C grid (dual-form, cancellation-free) and the C * delta^2 invariant.
  grid: [
    { label: "ln1.2", delta: 0.1823215567939546, aOpt: 4.263426e-22, f2AtPi: 1.265851e-19, C: 148.4546169, cDeltaSq: 4.934802 },
    { label: "ln1.3", delta: 0.26236426446749106, aOpt: 4.406252e-15, f2AtPi: 6.317711e-13, C: 71.69029824, cDeltaSq: 4.934802 },
    { label: "ln1.5", delta: 0.4054651081081644, aOpt: 1.663158e-9, f2AtPi: 9.984499e-8, C: 30.01668827, cDeltaSq: 4.934802 },
    { label: "ln2", delta: 0.6931471805599453, aOpt: 2.374485e-5, f2AtPi: 4.877735e-4, C: 10.27114423, cDeltaSq: 4.934802 },
    { label: "1", delta: 1, aOpt: 1.299945e-3, f2AtPi: 1.282995e-2, C: 4.934802095, cDeltaSq: 4.934802 },
    { label: "3", delta: 3, aOpt: 3.121395e-1, f2AtPi: 3.385136e-1, C: 0.5422472749, cDeltaSq: 4.880225 },
  ],
  // The exact small-delta law: C * delta^2 -> pi^2 / 2.
  cDeltaSqLimit: Math.PI * Math.PI / 2, // = 4.934802200544679
  scalingLaw: "C(delta) = pi^2 / (2 delta^2)  (exact as delta -> 0)",
  blowsUpAsDeltaToZero: true,
  blowUpExponent: -2, // C ~ delta^{-2}
  benign: true, // shared sech(pi^2/delta) prefactor cancels in the ratio
  boundChange: false,
  qed: false,
  verdict:
    "MEASURED. The imp-95689 finite-size Szego edge coefficient " +
    "C = f''(pi)/(2 A_opt) is tabulated across delta = ln 1.2, ln 1.3, ln 1.5, " +
    "ln 2, 1, 3 via the cancellation-free Poisson dual (both f''(pi) and A_opt are " +
    "sums of tiny positive terms, so C is well conditioned even where A_opt " +
    "underflows to ~4e-22 at delta = ln 1.2). C BLOWS UP as delta -> 0 and does so " +
    "explicitly: C * delta^2 = pi^2/2 = 4.9348022 to full precision for delta <= 1, " +
    "i.e. C(delta) = pi^2/(2 delta^2). The blow-up is benign -- both duals share the " +
    "same leading sech(pi^2/delta) prefactor which cancels in the ratio, leaving the " +
    "pure delta^{-2} rescaling -- so it is not a small-delta pathology; it only means " +
    "the natural finite-size variable is delta (N + 1) rather than N + 1 (a fixed N " +
    "needs N + 1 >> pi/delta before the correction is small). At delta = 3 the single- " +
    "term approximation is only ~99% accurate (C delta^2 = 4.880) because higher " +
    "Poisson terms enter, so the exact delta^{-2} law is a small-delta asymptotic, " +
    "sharp inside the imp-95693 rho-sweep regime. Tabulation of an established " +
    "endpoint coefficient; no new cited input. Model seam family only; the imp-95212 " +
    "envelope port, signed WEIGHT, and modulus/phase legs stay OPEN. Changes no " +
    "bound of the Lambda program; NO QED; no refereed bound is changed.",
  closesTickets: ["imp-95704"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

function sech(x) {
  return 2 / (Math.exp(x) + Math.exp(-x));
}

// Cancellation-free Poisson dual of the sech-Toeplitz symbol at theta:
//   f(theta) = (2 pi / delta) sum_k sech( pi (2 pi k - theta) / delta )
function fDual(theta, delta) {
  let s = 0;
  for (let k = -60; k <= 60; k++) s += sech((Math.PI * (2 * Math.PI * k - theta)) / delta);
  return ((2 * Math.PI) / delta) * s;
}

// Second derivative of the same dual (cancellation-free):
//   f''(theta) = -(2 pi / delta)(pi / delta)^2 sum_k sech(u_k)(2 sech^2 u_k - 1)
function f2Dual(theta, delta) {
  const a = Math.PI / delta;
  let s = 0;
  for (let k = -60; k <= 60; k++) {
    const u = (Math.PI * (2 * Math.PI * k - theta)) / delta;
    const sc = sech(u);
    s += sc * (2 * sc * sc - 1);
  }
  return -((2 * Math.PI) / delta) * a * a * s;
}

// imp-95419 theta-dual scalar class floor A_opt(delta) (== min_theta f at theta = pi)
function aOptDual(delta) {
  let s = 0;
  for (let n = 0; n <= 5000; n++) {
    const t = sech((Math.PI * Math.PI * (2 * n + 1)) / delta);
    s += t;
    if (n > 2 && t < s * 1e-30) break;
  }
  return ((4 * Math.PI) / delta) * s;
}

const REF = IMP95704_RHO1_SZEGO_COEFFICIENT_DELTA_SCALING;

export const IMP95704_ASSERTIONS = [
  {
    id: "imp95704-grid-C-reproduces-dual",
    description:
      "each baked C = f''(pi)/(2 A_opt) grid literal reproduces the cancellation-free " +
      "dual computation to relative 1e-5",
    holds: () =>
      REF.grid.every((row) => {
        const C = f2Dual(Math.PI, row.delta) / (2 * aOptDual(row.delta));
        return Math.abs(C - row.C) / row.C < 1e-5;
      }),
  },
  {
    id: "imp95704-labels-match-delta",
    description:
      "each grid delta literal matches its label (ln 1.2, ln 1.3, ln 1.5, ln 2, 1, 3)",
    holds: () => {
      const want = { "ln1.2": Math.log(1.2), "ln1.3": Math.log(1.3), "ln1.5": Math.log(1.5), "ln2": Math.log(2), "1": 1, "3": 3 };
      return REF.grid.every((row) => Math.abs(row.delta - want[row.label]) < 1e-15);
    },
  },
  {
    id: "imp95704-C-blows-up-monotone-as-delta-shrinks",
    description:
      "C strictly increases as delta decreases across the grid (blow-up toward delta -> 0)",
    holds: () => {
      const sorted = REF.grid.slice().sort((a, b) => b.delta - a.delta); // largest delta first
      for (let i = 1; i < sorted.length; i++) {
        if (!(sorted[i].C > sorted[i - 1].C)) return false;
      }
      return REF.blowsUpAsDeltaToZero === true && REF.blowUpExponent === -2;
    },
  },
  {
    id: "imp95704-delta-squared-law-is-pi-squared-over-two",
    description:
      "for delta <= 1 the product C * delta^2 equals pi^2/2 to full precision " +
      "(the exact small-delta scaling law C = pi^2/(2 delta^2))",
    holds: () => {
      const target = (Math.PI * Math.PI) / 2;
      return REF.grid
        .filter((row) => row.delta <= 1 + 1e-12)
        .every((row) => {
          const C = f2Dual(Math.PI, row.delta) / (2 * aOptDual(row.delta));
          return Math.abs(C * row.delta * row.delta - target) / target < 1e-5;
        }) && Math.abs(REF.cDeltaSqLimit - target) < 1e-12;
    },
  },
  {
    id: "imp95704-large-delta-departs-from-exact-law",
    description:
      "at delta = 3 the single-term law is only approximate: C * delta^2 falls " +
      "~1% below pi^2/2 (higher Poisson terms enter), confirming the law is a " +
      "small-delta asymptotic",
    holds: () => {
      const target = (Math.PI * Math.PI) / 2;
      const row = REF.grid.find((r) => r.label === "3");
      const C = f2Dual(Math.PI, row.delta) / (2 * aOptDual(row.delta));
      const rel = (target - C * row.delta * row.delta) / target;
      return rel > 5e-3 && rel < 5e-2; // ~1% short, not matching to full precision
    },
  },
  {
    id: "imp95704-baked-C-matches-imp95689",
    description:
      "the delta = ln 1.3 grid entry reproduces the imp-95689 baked coefficient 71.690",
    holds: () => {
      const row = REF.grid.find((r) => r.label === "ln1.3");
      return Math.abs(row.C - 71.69029824053476) / 71.69029824053476 < 1e-6;
    },
  },
  {
    id: "imp95704-not-a-bound",
    description:
      "this is a numerical tabulation module; it moves no Lambda bound and proves " +
      "no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      /MEASURED/.test(REF.verdict) &&
      /pi\^2 \/ \(2 delta\^2\)/.test(REF.scalingLaw) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95704-closes-self",
    description: "this module is the deliverable the imp-95704 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95704"),
  },
];

for (const a of IMP95704_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95704-rho1-szego-coefficient-delta-scaling assertion failed: ${a.id}`,
    );
  }
}

export default IMP95704_RHO1_SZEGO_COEFFICIENT_DELTA_SCALING;
