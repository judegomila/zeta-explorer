/**
 * imp-35191: Tabulate the imp-35151 R5a finite-N monotonicity certificate
 * DIRECTLY on the imp-35104 certified window {50, 100, 200, 500}.
 *
 * MEASUREMENT ONLY. Changes no bound. R5b tail stays IRREDUCIBLE per imp-486.
 * C_mb stays GUE-conditional. NO QED.
 *
 * Context
 * -------
 * imp-35151 classified the imp-35104 R5 tail-monotonicity obligation as
 * SEPARABLE:
 *
 *   R5a (finite-N window monotonicity) is GUE-FREE and decidable by a finite
 *       conjunction of pairwise tau_c_est(N) comparisons, with the imp-486
 *       direct sweep (src/math/m-raw-from-umon-bridge.js) as certificate.
 *   R5b (asymptotic tail monotonicity, N -> infinity) is IRREDUCIBLE per
 *       imp-486 (equivalent to Montgomery / GUE universality).
 *
 * imp-35151 asserted the FORM of the R5a certificate (a finite conjunction of
 * pairwise comparisons) but never TABULATED that conjunction on the concrete
 * imp-35104 certified window {50, 100, 200, 500}. This module supplies the
 * missing tabulation: it recomputes tau_c_est(N) at those four N from the same
 * RvM-unfolded-gap definition used by the imp-486 bridge, exhibits the discrete
 * differences and their signs, and writes out the explicit finite conjunction
 * that discharges R5a unconditionally on the certified window.
 *
 * Definition of the surrogate (identical to bridgeRecord in
 * src/math/m-raw-from-umon-bridge.js)
 * -----------------------------------
 *   F(T)      = (T / (2*pi)) * (log(T/(2*pi)) - 1)          [RvM counting fn]
 *   rho(T)    = F_prime(T) = (1/(2*pi)) * log(T/(2*pi))     [RvM density]
 *   H_N       = min over k in {0..N-2} of ( F(gamma_{k+1}) - F(gamma_k) )
 *   J*(N)     = argmin index of that minimal unfolded gap
 *   tau_c_est(N) = H_N^2 / (8 * rho(gamma_{J*(N)})^2)       [leading-order
 *                                                            collision time]
 *
 * This uses ONLY the closed-form RvM density and the numerical zero ordinates
 * (ZETA_ZEROS). It invokes NO random-matrix input, NO C_mb, NO GUE assumption.
 * The whole computation is a finite table lookup + arithmetic -- exactly the
 * "whyEmpiricalSweepStandsUnconditionally" certificate named by imp-35151 R5a.
 *
 * Finding
 * -------
 * On the certified window the discrete difference of tau_c_est is NON-POSITIVE
 * at every consecutive step, so tau_c_est is non-increasing there:
 *
 *   N       tau_c_est(N)      Delta = tau(N) - tau(N_prev)   sign
 *   ------  ---------------   ----------------------------   ----
 *   50      8.951543e-2       --                              --
 *   100     8.951543e-2       0                               =   (flat step)
 *   200     3.103290e-2      -5.848253e-2                     <
 *   500     1.204694e-2      -1.898596e-2                     <
 *
 * The flat 50 -> 100 step is genuine: the minimal unfolded gap over the first
 * 100 zeros is achieved at the SAME site (J* = 34, within the first 50), so no
 * strictly smaller gap appears among zeros 51..100 and tau_c_est is exactly
 * unchanged -- consistent with (weak) non-increasing monotonicity.
 *
 * The finite conjunction that discharges R5a on {50,100,200,500}:
 *
 *   ( tau_c_est(100) <= tau_c_est(50) )
 *     AND ( tau_c_est(200) <= tau_c_est(100) )
 *     AND ( tau_c_est(500) <= tau_c_est(200) )     ==  TRUE
 *
 * Three pairwise comparisons, all TRUE, all decided by finite arithmetic on the
 * closed-form surrogate. R5a is discharged UNCONDITIONALLY on the certified
 * window. This does NOT touch R5b (the N -> infinity tail complement), which
 * remains irreducible per imp-486, and changes no bound.
 */

import { ZETA_ZEROS } from "../math/zeta.js";
import { IMP_35151_R5_SEPARABILITY } from "./imp-35151-r5-tail-monotonicity-separability.js";

// ── Surrogate helpers (closed-form RvM; mirrors the imp-486 bridge) ───────────

/** F(T) = (T / (2*pi)) * (log(T/(2*pi)) - 1) */
function rvmF(T) {
  const L = Math.log(T / (2 * Math.PI));
  return (T / (2 * Math.PI)) * (L - 1);
}

/** rho(T) = F_prime(T) = (1/(2*pi)) * log(T/(2*pi)) */
function rvmDensity(T) {
  return Math.log(T / (2 * Math.PI)) / (2 * Math.PI);
}

/**
 * tau_c_est(N) = H_N^2 / (8 * rho(gamma_{J*(N)})^2), computed exactly as the
 * imp-486 bridgeRecord does. Returns the full record for tabulation.
 */
function tauCEstRecord(N) {
  let H = Infinity;
  let jStar = 0; // 0-indexed
  for (let k = 0; k < N - 1; k++) {
    const d = rvmF(ZETA_ZEROS[k + 1]) - rvmF(ZETA_ZEROS[k]);
    if (d < H) {
      H = d;
      jStar = k;
    }
  }
  const rho = rvmDensity(ZETA_ZEROS[jStar]);
  const tau = (H * H) / (8 * rho * rho);
  return {
    N,
    jStar: jStar + 1, // 1-indexed
    H_N: +H.toExponential(6),
    rho_jStar: +rho.toFixed(6),
    tau_c_est: +tau.toExponential(6),
    tau_c_est_raw: tau,
  };
}

// ── The imp-35104 certified window ────────────────────────────────────────────

const CERTIFIED_WINDOW = [50, 100, 200, 500];

const WINDOW_RECORDS = CERTIFIED_WINDOW.map(tauCEstRecord);

// ── Discrete-difference table (sign conjunction) ──────────────────────────────

const DIFF_ROWS = WINDOW_RECORDS.map((rec, i) => {
  if (i === 0) {
    return { N: rec.N, tau_c_est: rec.tau_c_est, delta: null, sign: null };
  }
  const delta = rec.tau_c_est_raw - WINDOW_RECORDS[i - 1].tau_c_est_raw;
  const sign = delta < -1e-15 ? "<" : delta > 1e-15 ? ">" : "=";
  return {
    N: rec.N,
    N_prev: WINDOW_RECORDS[i - 1].N,
    tau_c_est: rec.tau_c_est,
    delta: +delta.toExponential(6),
    sign,
  };
});

// Non-increasing <=> every consecutive delta is <= 0 (allow tiny fp slack).
const ALL_DELTAS_NONPOSITIVE = DIFF_ROWS.slice(1).every(
  (r) => r.delta <= 1e-15,
);

// The explicit finite conjunction of pairwise comparisons (GUE-free, decidable).
const PAIRWISE_COMPARISONS = WINDOW_RECORDS.slice(1).map((rec, i) => {
  const prev = WINDOW_RECORDS[i];
  return {
    claim: `tau_c_est(${rec.N}) <= tau_c_est(${prev.N})`,
    holds: rec.tau_c_est_raw <= prev.tau_c_est_raw + 1e-15,
  };
});

const FINITE_CONJUNCTION_HOLDS = PAIRWISE_COMPARISONS.every((c) => c.holds);

export const IMP_35191_R5A_CERTIFIED_WINDOW = {
  id: "imp-35191",
  parent: "imp-35151 R5a (finite-N window monotonicity), imp-35104 certified window",
  what:
    "Direct tabulation of the R5a finite conjunction on the imp-35104 " +
    "certified window {50,100,200,500}: tau_c_est(N), discrete-difference " +
    "sign, and the explicit GUE-free pairwise-comparison conjunction.",

  certifiedWindow: CERTIFIED_WINDOW,

  table: WINDOW_RECORDS.map((r) => ({
    N: r.N,
    jStar: r.jStar,
    H_N: r.H_N,
    rho_jStar: r.rho_jStar,
    tau_c_est: r.tau_c_est,
  })),

  diffTable: DIFF_ROWS,

  flatStepNote:
    "The 50 -> 100 step is exactly flat because the minimal unfolded gap over " +
    "the first 100 zeros is achieved at the same site J* = 34 (within the " +
    "first 50); no strictly smaller gap appears among zeros 51..100. This is a " +
    "genuine equality, consistent with weak (non-increasing) monotonicity.",

  finiteConjunction: {
    comparisons: PAIRWISE_COMPARISONS,
    holds: FINITE_CONJUNCTION_HOLDS,
    statement:
      "( tau_c_est(100) <= tau_c_est(50) ) AND " +
      "( tau_c_est(200) <= tau_c_est(100) ) AND " +
      "( tau_c_est(500) <= tau_c_est(200) )",
  },

  r5aDischarged: FINITE_CONJUNCTION_HOLDS && ALL_DELTAS_NONPOSITIVE,

  method:
    "Recomputes tau_c_est(N) = H_N^2/(8 rho^2) from the closed-form RvM " +
    "density and the numerical zero ordinates only -- identical to " +
    "bridgeRecord in src/math/m-raw-from-umon-bridge.js. No C_mb, no GUE, no " +
    "random-matrix input; a finite table lookup plus arithmetic.",

  honesty: {
    measurementOnly: true,
    changesBound: false,
    r5bStaysIrreducible: true,
    cmbStaysGueConditional: true,
    isQED: false,
    ptFloor: "No refereed bound is changed.",
  },
};

// ── Self-executing tripwire assertions ───────────────────────────────────────
(function assertImp35191() {
  const A = IMP_35191_R5A_CERTIFIED_WINDOW;

  // (T1) The window is exactly the imp-35104 certified window.
  if (
    A.certifiedWindow.length !== 4 ||
    A.certifiedWindow[0] !== 50 ||
    A.certifiedWindow[1] !== 100 ||
    A.certifiedWindow[2] !== 200 ||
    A.certifiedWindow[3] !== 500
  ) {
    throw new Error("imp-35191 T1: certified window is not {50,100,200,500}");
  }

  // (T2) Baked tau_c_est reference literals reproduced at 7-sig-fig tolerance.
  const REF = {
    50: 8.951543e-2,
    100: 8.951543e-2,
    200: 3.103290e-2,
    500: 1.204694e-2,
  };
  for (const rec of WINDOW_RECORDS) {
    if (Math.abs(rec.tau_c_est - REF[rec.N]) > 1e-6) {
      throw new Error(
        `imp-35191 T2: tau_c_est(${rec.N}) = ${rec.tau_c_est} != baked ${REF[rec.N]}`,
      );
    }
  }

  // (T3) Non-increasing: every consecutive discrete difference is <= 0.
  if (ALL_DELTAS_NONPOSITIVE !== true) {
    throw new Error("imp-35191 T3: tau_c_est not non-increasing on the window");
  }

  // (T4) The 50 -> 100 step is a genuine flat step at the SAME argmin site.
  if (
    WINDOW_RECORDS[0].jStar !== WINDOW_RECORDS[1].jStar ||
    Math.abs(WINDOW_RECORDS[0].tau_c_est_raw - WINDOW_RECORDS[1].tau_c_est_raw) >
      1e-15
  ) {
    throw new Error("imp-35191 T4: expected a flat 50->100 step at a shared J*");
  }

  // (T5) The two strict drops (100->200, 200->500) are genuinely negative.
  if (!(DIFF_ROWS[2].delta < 0) || !(DIFF_ROWS[3].delta < 0)) {
    throw new Error("imp-35191 T5: expected strict drops at 100->200 and 200->500");
  }

  // (T6) The explicit finite conjunction holds -> R5a discharged on the window.
  if (
    A.finiteConjunction.comparisons.length !== 3 ||
    A.finiteConjunction.holds !== true ||
    A.r5aDischarged !== true
  ) {
    throw new Error("imp-35191 T6: R5a finite conjunction did not discharge");
  }

  // (T7) Ties back to the imp-35151 separability verdict (GUE-free R5a).
  if (
    IMP_35151_R5_SEPARABILITY.verdict !== "SEPARABLE-WITH-IRREDUCIBLE-TAIL" ||
    IMP_35151_R5_SEPARABILITY.decomposition.R5a.invokesGUE !== false
  ) {
    throw new Error("imp-35191 T7: imp-35151 R5a separability anchor missing");
  }

  // (T8) Honesty gate: measurement only, no bound change, no QED.
  const h = A.honesty;
  if (
    h.measurementOnly !== true ||
    h.changesBound !== false ||
    h.r5bStaysIrreducible !== true ||
    h.cmbStaysGueConditional !== true ||
    h.isQED !== false
  ) {
    throw new Error("imp-35191 T8: honesty gate violated");
  }
})();
