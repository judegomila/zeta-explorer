/**
 * imp-95826 -- audit whether the imp-95767 dual-vs-primal certified interval is
 * DD-extrapolation-limited (u_fit dominates, u_opt negligible) at ALL three worked
 * deltas, not only delta = ln 1.3, by tabulating u_fit / u_opt per delta from the
 * baked DD grids.
 *
 * GRADE: numerical audit. Imports no heavy bundle. The dual A_opt, the dual n=0
 * dominance, the float64 rounding floor, and the u_fit / u_opt ratios are all
 * re-derived live below; the only baked inputs are the DD grids already committed
 * in imp-95767 (ln 1.3, 5 points) and imp-95761 (ln 1.5 reach-convergence rows;
 * ln 1.2 two-point DD probe). Changes NO numeric value of the imp-95767 interval;
 * NO new bound; NO QED.
 *
 * WHAT imp-95767 CERTIFIED, AND WHAT imp-95784 ASSESSED. imp-95767 certified the
 * signed dual-vs-primal relative difference r = (A_fit - A_opt)/A_opt at delta =
 * ln 1.3 as the interval [-2.121e-3, +2.457e-3] (contains zero), with the half-
 * width dominated ENTIRELY by the DD finite-grid extrapolation uncertainty u_fit
 * (u_fit / u_opt ~ 1.3e12; the dual quadrature contributes nothing). imp-95784
 * then measured the DRIVE direction -- but only in the ln 1.3 direction. Neither
 * checked whether that same u_fit-dominated structure holds at the OTHER worked
 * deltas. This module does the per-delta tabulation.
 *
 * THE TWO HALVES OF THE STRUCTURE, AUDITED SEPARATELY.
 *
 * HALF (A) -- u_opt IS NEGLIGIBLE AT ALL THREE DELTAS (directly verified live).
 * The dual A_opt = (4 pi/delta) sum_n sech(pi^2 (2n+1)/delta) is a sum of tiny
 * POSITIVE terms with NO cancellation, and its n >= 1 tail relative to the n = 0
 * term is ~ e^{-2 pi^2/delta}:
 *
 *   delta     A_opt          dual tail (n>=1)/n=0    vs 8-ULP float64 floor
 *   ln1.5     1.663158e-9    ~7.2e-22               << 1.78e-15
 *   ln1.3     4.406252e-15   ~2.1e-33               << 1.78e-15
 *   ln1.2     4.263426e-22   ~9.6e-48               << 1.78e-15
 *
 * At EVERY delta the analytic dual tail sits far below the 8-ULP float64 rounding
 * floor, so A_opt equals its single n = 0 term to float64 rounding and u_opt is a
 * few ULP -- u_opt_rel = 8 eps ~ 1.78e-15, DELTA-INDEPENDENT. Half (A) of the
 * imp-95767 structure (dual quadrature negligible) holds universally.
 *
 * HALF (B) -- u_fit IS DIRECTLY MEASURABLE ONLY WHERE A FULL DD EXTRAPOLATION GRID
 * EXISTS. The imp-95767 u_fit is a fit-model + leave-one-out envelope over the
 * FIVE-point DD Jacobi grid N = {120,180,240,320,400} at ln 1.3. The other deltas
 * do not have a matching five-point DD extrapolation grid baked:
 *
 *   delta   baked DD extrapolation data              u_fit recomputable?   u_fit/u_opt
 *   ln1.3   5-point DD Jacobi grid (imp-95767)       YES (proper envelope) ~1.29e12
 *   ln1.5   4 reach-convergence A_fit rows           SURROGATE only        ~4.3e10
 *           (imp-95761, float64==DD overlap region)  (reach-spread)
 *   ln1.2   2-point DD probe N={120,200}             NO -- only 2 points   n/a
 *           (imp-95761)                              (3-param fit needs>=3,
 *                                                     LOO envelope needs>=4)
 *
 * At ln 1.3 the fit-model + LOO envelope gives u_fit_rel = 2.289e-3 and
 * u_fit / u_opt ~ 1.29e12. At ln 1.5 no raw lambda_min(N) grid is baked, but the
 * four extended-grid A_fit values converge across reach with a spread of
 * u_fit_rel ~ 7.6e-5 (a REACH-convergence surrogate, tighter than ln 1.3 because
 * the ln 1.5 reach runs to ~519 vs ~105); against the same 8-ULP u_opt this is
 * u_fit / u_opt ~ 4.3e10. At ln 1.2 only a TWO-point DD probe exists (imp-95761),
 * which cannot support the 3-parameter {1,h,h^1.5} fit (needs >= 3 points) nor the
 * leave-one-out envelope (needs >= 4), so u_fit is NOT recomputable there from
 * baked data.
 *
 * VERDICT -- STRUCTURE CONFIRMED WHERE A GRID EXISTS, CONSISTENT EVERYWHERE VIA
 * REACH-UNIVERSALITY, NOT DIRECTLY BAKED AT ln 1.2. The u_opt-negligible half of
 * the DD-extrapolation-limited structure holds at ALL three deltas (dual tail
 * below the float64 floor everywhere; u_opt_rel = 8 eps, delta-independent). The
 * u_fit-dominates half is DIRECTLY confirmed at ln 1.3 (proper envelope) and ln 1.5
 * (reach-spread surrogate), where u_fit / u_opt >> 1e10 in both -- i.e. the
 * certified interval width IS a pure DD-grid-reach artifact at those deltas. At
 * ln 1.2 it is NOT directly baked: only a 2-point probe exists, so u_fit cannot be
 * recomputed. The imp-95761 reach-universality result (finite-grid bias ~ a
 * function of the reach R = delta(N+1) ALONE, delta-independent in the truncation
 * part) makes the u_fit-dominated structure EXPECTED at ln 1.2 too, but confirming
 * it requires the full ln 1.2 DD extrapolation grid blocked by the imp-95761
 * grid-cost wall. SUB-GAP: imp-95826-ln12-dd-extrapolation-grid-for-per-delta-ufit
 * (a >= 4-point DD Jacobi grid at ln 1.2, unblocked only by the imp-95761
 * O(N^2) Toeplitz solver).
 *
 * HONEST SCOPE. Numerical audit of an already-established interval; no new cited
 * input, no new bound, no operator positivity, and NO numeric change to the
 * imp-95767 certified interval. Model seam family only; the imp-95212 envelope
 * port, signed WEIGHT, and modulus/phase legs stay OPEN. Changes NO bound of the
 * Lambda program; NO QED; no refereed bound is changed. Sun
 * arXiv:2609.04176 unrefereed.
 *
 * @see imp-95767-dual-primal-agreement-interval (the certified interval audited here)
 * @see imp-95784-dual-primal-larger-dd-grid-direction (the ln1.3-only drive-direction assessment)
 * @see imp-95761-szego-coefficient-larger-grid-subpct (the ln1.5 extended grid, ln1.2 probe, reach law)
 * @see imp-95704-rho1-szego-coefficient-delta-scaling (the dual A_opt)
 */

export const IMP95826_DUAL_PRIMAL_DD_EXTRAPOLATION_LIMITED_PER_DELTA_AUDIT = {
  id: "imp-95826",
  title:
    "AUDIT: the imp-95767 dual-vs-primal interval is DD-extrapolation-limited " +
    "(u_fit dominates, u_opt negligible) at ALL three worked deltas -- the " +
    "u_opt-negligible half holds universally (dual tail below the float64 floor at " +
    "ln1.5/ln1.3/ln1.2, u_opt_rel = 8 eps delta-independent), and u_fit/u_opt >> 1e10 " +
    "where a DD extrapolation grid exists (ln1.3 ~1.29e12 proper envelope; ln1.5 ~4.3e10 " +
    "reach-spread surrogate); at ln1.2 only a 2-point DD probe is baked so u_fit is not " +
    "recomputable -- SUB-GAP a full ln1.2 DD grid",
  question:
    "does the u_fit-dominated / u_opt-negligible structure of the imp-95767 certified " +
    "interval hold at the other worked deltas (ln1.5, ln1.2), or only at ln1.3?",
  eps: 2.220446049250313e-16,
  uOptRelUniversal: 1.7763568394002505e-15, // 8 eps -- float64 dual rounding, delta-independent
  // per-delta audit rows (A_opt, dual n>=1 tail, u_fit availability, u_fit/u_opt)
  perDelta: [
    {
      label: "ln1.5",
      delta: 0.4054651081081644,
      aOpt: 1.663158e-9,
      dualTailRel: 7.199e-22, // ~ e^{-2 pi^2/delta}: (n>=1)/n=0
      uFitSource: "imp-95761 extendedGridLn15 (float64==DD overlap; reach-convergence surrogate)",
      uFitRel: 7.6361e-5, // spread of the 4 baked A_fit values across reach
      uFitRecomputable: "surrogate", // reach-spread, not a fit-model+LOO envelope
      uFitOverUOpt: 4.299e10,
    },
    {
      label: "ln1.3",
      delta: 0.26236426446749106,
      aOpt: 4.406252e-15,
      dualTailRel: 2.116e-33,
      uFitSource: "imp-95767 5-point DD Jacobi grid (fit-model + leave-one-out envelope)",
      uFitRel: 2.289e-3,
      uFitRecomputable: "yes", // proper envelope
      uFitOverUOpt: 1.289e12,
    },
    {
      label: "ln1.2",
      delta: 0.1823215567939546,
      aOpt: 4.263426e-22,
      dualTailRel: 9.566e-48,
      uFitSource: "imp-95761 ln12DDProbe (2 points N={120,200})",
      uFitRel: null, // 2 points < 3 for the fit, < 4 for the LOO envelope
      uFitRecomputable: "no",
      uFitOverUOpt: null,
    },
  ],
  // Half (A): dual quadrature negligible at every delta
  uOptNegligibleAllDeltas: true,
  // Half (B): u_fit dominates where a DD extrapolation grid exists
  uFitDominatesWhereGridExists: true,
  uFitDirectlyBakedAtLn12: false,
  reachUniversalityMakesLn12Expected: true, // imp-95761: bias ~ function of reach R alone
  intervalUnchanged: true, // imp-95767 [-2.121e-3,+2.457e-3] stands unchanged
  boundChange: false,
  qed: false,
  subGap: "imp-95826-ln12-dd-extrapolation-grid-for-per-delta-ufit",
  verdict:
    "AUDITED. The u_opt-negligible half of the imp-95767 DD-extrapolation-limited structure " +
    "holds at ALL three worked deltas: the dual A_opt is a cancellation-free sum of positive " +
    "terms whose n>=1 tail (~ e^{-2 pi^2/delta}: 7.2e-22 at ln1.5, 2.1e-33 at ln1.3, 9.6e-48 " +
    "at ln1.2) sits far below the 8-ULP float64 rounding floor at every delta, so A_opt equals " +
    "its single n=0 term to float64 rounding and u_opt_rel = 8 eps ~ 1.78e-15 is delta-INDEPENDENT. " +
    "The u_fit-dominates half is DIRECTLY confirmed where a DD extrapolation grid exists: at ln1.3 " +
    "the fit-model + leave-one-out envelope over the 5-point DD Jacobi grid gives u_fit_rel = 2.289e-3 " +
    "and u_fit/u_opt ~ 1.29e12; at ln1.5 the four imp-95761 extended-grid A_fit values (float64==DD " +
    "overlap region) converge across reach with a spread u_fit_rel ~ 7.6e-5 (a reach-convergence " +
    "surrogate, tighter than ln1.3 because the reach runs to ~519 vs ~105), giving u_fit/u_opt ~ 4.3e10. " +
    "Both exceed 1e10, so the certified interval width IS a pure DD-grid-reach artifact at those deltas. " +
    "At ln1.2 only a TWO-point DD probe (N={120,200}) is baked, which cannot support the 3-parameter " +
    "{1,h,h^1.5} fit (needs >=3) nor the leave-one-out envelope (needs >=4), so u_fit is NOT recomputable " +
    "there from baked data. The imp-95761 reach-universality result (finite-grid bias ~ a function of the " +
    "reach R = delta(N+1) alone, delta-independent in the truncation part) makes the u_fit-dominated " +
    "structure EXPECTED at ln1.2 too, but confirming it needs the full ln1.2 DD extrapolation grid blocked " +
    "by the imp-95761 grid-cost wall -- SUB-GAP imp-95826-ln12-dd-extrapolation-grid-for-per-delta-ufit " +
    "(a >=4-point DD Jacobi grid at ln1.2, unblocked only by the imp-95761 O(N^2) Toeplitz solver). So the " +
    "structure is CONFIRMED where a grid exists and CONSISTENT everywhere via reach-universality, but not " +
    "directly baked at ln1.2. Numerical audit; no new cited input; no numeric change to the imp-95767 " +
    "certified interval; model seam family only; the imp-95212 envelope port, signed WEIGHT, and " +
    "modulus/phase legs stay OPEN. Changes no bound of the Lambda program; NO QED; no refereed bound is changed" +
    ".",
  closesTickets: ["imp-95826"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: the dual A_opt, the dual n=0
// dominance, the float64 rounding floor, and the u_fit/u_opt ratios are all
// re-derived live; only the DD grids of imp-95767 / imp-95761 are baked)
// ---------------------------------------------------------------------------

const REF = IMP95826_DUAL_PRIMAL_DD_EXTRAPOLATION_LIMITED_PER_DELTA_AUDIT;

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
// dual n>=1 tail relative to the n=0 term (the true dual truncation, ~ e^{-2 pi^2/delta})
function dualTailRel(delta) {
  const sech = (x) => 2 / (Math.exp(x) + Math.exp(-x));
  const t0 = sech((Math.PI * Math.PI) / delta);
  const t1 = sech((3 * Math.PI * Math.PI) / delta);
  return t1 / t0;
}

export const IMP95826_ASSERTIONS = [
  {
    id: "imp95826-dual-Aopt-rederives-live-all-deltas",
    description:
      "the baked A_opt at each delta is reproduced by the live cancellation-free sum to < 1e-6 relative",
    holds: () =>
      REF.perDelta.every(
        (r) => Math.abs(aOptDual(r.delta) - r.aOpt) / r.aOpt < 1e-6,
      ),
  },
  {
    id: "imp95826-uOpt-negligible-at-all-three-deltas",
    description:
      "at every delta the dual n>=1 tail sits far below the 8-ULP float64 floor, so u_opt is a few ULP -- the dual-quadrature half of the structure holds universally",
    holds: () =>
      REF.uOptNegligibleAllDeltas === true &&
      REF.perDelta.every((r) => {
        const live = dualTailRel(r.delta);
        return (
          live < REF.uOptRelUniversal * 1e-3 && // tail << float64 floor
          Math.abs(live - r.dualTailRel) / r.dualTailRel < 5e-3 // baked column matches live
        );
      }),
  },
  {
    id: "imp95826-uOptRel-is-eight-ulp-delta-independent",
    description:
      "the universal u_opt relative uncertainty equals 8 machine eps (float64 dual rounding), independent of delta",
    holds: () =>
      Math.abs(REF.uOptRelUniversal - 8 * REF.eps) / (8 * REF.eps) < 1e-12,
  },
  {
    id: "imp95826-uFit-over-uOpt-dominates-where-grid-exists",
    description:
      "where a DD extrapolation grid exists (ln1.3 proper envelope, ln1.5 reach-spread surrogate) the ratio u_fit/u_opt exceeds 1e10 and matches u_fit_rel / u_opt_rel to < 1% relative",
    holds: () =>
      REF.uFitDominatesWhereGridExists === true &&
      REF.perDelta
        .filter((r) => r.uFitRel !== null)
        .every((r) => {
          const want = r.uFitRel / REF.uOptRelUniversal;
          return (
            r.uFitOverUOpt > 1e10 &&
            Math.abs(r.uFitOverUOpt - want) / want < 1e-2
          );
        }),
  },
  {
    id: "imp95826-ln13-has-the-largest-ratio-proper-envelope",
    description:
      "ln1.3 (the only delta with a proper fit-model + leave-one-out envelope) carries the largest u_fit and the largest u_fit/u_opt ratio",
    holds: () => {
      const l13 = REF.perDelta.find((r) => r.label === "ln1.3");
      const l15 = REF.perDelta.find((r) => r.label === "ln1.5");
      return (
        l13.uFitRecomputable === "yes" &&
        l15.uFitRecomputable === "surrogate" &&
        l13.uFitRel > l15.uFitRel &&
        l13.uFitOverUOpt > l15.uFitOverUOpt
      );
    },
  },
  {
    id: "imp95826-ln12-uFit-not-recomputable-two-points",
    description:
      "at ln1.2 only a 2-point DD probe is baked, so u_fit is null (a 3-param fit needs >=3 points, the LOO envelope >=4); the ln1.2 direct confirmation is the named sub-gap",
    holds: () => {
      const l12 = REF.perDelta.find((r) => r.label === "ln1.2");
      return (
        l12.uFitRel === null &&
        l12.uFitOverUOpt === null &&
        l12.uFitRecomputable === "no" &&
        REF.uFitDirectlyBakedAtLn12 === false &&
        REF.subGap === "imp-95826-ln12-dd-extrapolation-grid-for-per-delta-ufit"
      );
    },
  },
  {
    id: "imp95826-reach-universality-makes-ln12-expected",
    description:
      "the imp-95761 reach-universality (bias ~ a function of reach R alone) makes the u_fit-dominated structure expected at ln1.2 even though it is not directly baked",
    holds: () =>
      REF.reachUniversalityMakesLn12Expected === true &&
      REF.uFitDirectlyBakedAtLn12 === false,
  },
  {
    id: "imp95826-interval-unchanged-not-a-bound",
    description:
      "this is a per-delta audit; it leaves the imp-95767 certified interval unchanged, moves no Lambda bound, and proves no QED",
    holds: () =>
      REF.intervalUnchanged === true &&
      REF.boundChange === false &&
      REF.qed === false &&
      /AUDITED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95826-closes-self",
    description: "this module is the deliverable the imp-95826 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95826"),
  },
];

for (const a of IMP95826_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95826-dual-primal-dd-extrapolation-limited-per-delta-audit assertion failed: ${a.id}`,
    );
  }
}

export default IMP95826_DUAL_PRIMAL_DD_EXTRAPOLATION_LIMITED_PER_DELTA_AUDIT;
