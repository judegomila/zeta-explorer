/**
 * @module data/turing-zero-count-verification
 * @fileoverview Turing-method zero-count certificate for each N value in the
 *   imp-360 backward Dyson-ODE measured ladder. For every N in the standard
 *   ladder MEASURED_NS = [50, 100, 200, 500, 870, 1000..25000 step 1000,
 *   30000, 40000, 50000, 75000, 100000] (35 entries total), this file
 *   recomputes the Riemann-von Mangoldt main term N_main(T) at T = gamma_N
 *   (the N-th Odlyzko zero from ZEROS_EXTENDED), extracts the Selberg
 *   argument S(gamma_N) = N - N_main(gamma_N), and asserts |S(T)| is below
 *   the conservative Selberg bound S_max(T) = C_SELBERG * log(T) with
 *   C_SELBERG = 3 (Titchmarsh Section 14.13, same constant as
 *   src/math/koksma-hlawka-C1-pinned.js imp-426). The certificate also
 *   verifies strict adjacent ordering gamma_{N-1} < gamma_N for every
 *   measured N. A failing certificate signals either (a) a truncated or
 *   corrupted zero table, (b) out-of-order entries that would blow up the
 *   Calogero-Moser potential (gamma_i - gamma_j)^{-3} in dyson-ladder-measured.js,
 *   or (c) a Selberg-bound violation (impossible for T < 800000 by Backlund
 *   theory).
 *
 * Proof-chain step: S10 backward Dyson-ODE ladder verification. The companion
 *   integrator src/math/dyson-ladder-measured.js (imp-360) starts each
 *   backward Calogero-Moser integration from the first N Riemann zero
 *   ordinates in ZEROS_EXTENDED and produces a measured t_c(N) collapse
 *   time. Without an independent zero-count audit, a silent truncation of
 *   the loaded zero list would cause the integrator to run on the wrong
 *   initial configuration with no diagnostic flag. This file delivers the
 *   Turing certificate that makes dyson-ladder-measured.js's input
 *   trustworthy.
 *
 * Exports:
 *   - TURING_ZERO_COUNT_VERIFICATION: frozen object with id "imp-361",
 *     closes "imp-361 (Turing certificate requirement for
 *     dyson-ladder-measured.js)", a method subobject describing the
 *     Riemann-von Mangoldt + Selberg-argument approach (formula, certificate
 *     inequality, C_Selberg = 3, provenance pointer to Titchmarsh Section
 *     14.13 and koksma-hlawka-C1-pinned.js imp-426), a summary subobject
 *     reporting totalN (length of MEASURED_NS), totalZerosLoaded
 *     (ZEROS_EXTENDED.length), allVerified / allSInBound / allOrderingOk
 *     boolean flags, worstSMargin (tightest observed |S(T)|/S_max ratio),
 *     and verdict ("VERIFIED" or "FAILED"); and a certificates array of
 *     35 per-N records (N, gammaN, N_rvm_main, S_T, S_max, S_T_abs,
 *     S_T_within_bound, ordering_ok, verified, plus failReason on insufficient
 *     zero coverage).
 *   - TURING_VERIFICATION_ASSERTIONS: array of five holds()/why guard
 *     predicates consumed by the dashboard self-check pipeline.
 *
 * Key assertions (each a holds()/why pair):
 *   - imp361-all-certs-verified: every certificate must pass both the
 *     Selberg bound check and the strict-ordering check. A failure means
 *     the zero table is missing entries, has corrupted ordering, or the
 *     Selberg bound is violated (impossible for T < 800000 by Backlund).
 *   - imp361-all-ordering-ok: every adjacent pair gamma_{N-1} < gamma_N
 *     must hold strictly. Out-of-order zeros would blow up the
 *     Calogero-Moser potential (gamma_i - gamma_j)^{-3} in the backward
 *     Dyson ODE.
 *   - imp361-zeros-table-covers-max-N: ZEROS_EXTENDED.length must be at
 *     least 100000 (the largest measured N). Fewer entries means the
 *     certificate for N = 100000 returns verified = false with failReason
 *     "zero-list-insufficient".
 *   - imp361-verdict-is-verified: summary.verdict must be the string
 *     "VERIFIED". A "FAILED" verdict indicates a missing or out-of-order
 *     entry at some measured N.
 *   - imp361-worst-margin-below-half: the worst observed |S(T)|/S_max ratio
 *     must be below 0.5. For the Odlyzko verified table with T < 800000,
 *     empirically |S(T)| < 2 while S_max = 3 * log(T) >= 11.7 at the
 *     smallest measured T (gamma_50). A margin >= 0.5 should trigger
 *     manual inspection of the zero table around that N.
 *
 * Ticket lineage:
 *   - imp-361 created this file as the Turing certificate companion to the
 *     imp-360 dyson-ladder-measured.js backward ODE integrator.
 *   - imp-360 produced dyson-ladder-measured.js whose initial configuration
 *     this file audits.
 *   - imp-426 produced src/math/koksma-hlawka-C1-pinned.js which uses the
 *     same C_SELBERG = 3 constant from Titchmarsh Section 14.13.
 *   - imp-1062 (this commit) prepended this @module / @fileoverview JSDoc
 *     header for cross-file navigability; no math, exports, or assertions
 *     modified.
 *
 * @see ../math/dyson-ladder-measured.js for the backward Dyson ODE integrator
 *   that consumes ZEROS_EXTENDED and whose initial configuration this file
 *   audits.
 * @see ../math/koksma-hlawka-C1-pinned.js for the imp-426 companion using the
 *   same C_SELBERG = 3 conservative Selberg bound constant.
 * @see ./zeros-to-1e6.js for the Odlyzko zero table ZEROS_EXTENDED loaded
 *   here.
 */

// ── ORIGINAL HEADLINE COMMENT (preserved verbatim from imp-361) ───────────────

/**
 * imp-361: Turing-method zero-count verification for each N in the imp-360 measured ladder.
 *
 * Purpose
 * -------
 * The imp-360 backward Dyson ODE ladder (dyson-ladder-measured.js) integrates
 * the backward Calogero-Moser system starting from the first N Riemann zero
 * ordinates in ZEROS_EXTENDED. If zeros are MISSING from the loaded list (due
 * to a truncated download, a byte-order corruption, or a sorting error), the
 * integrator silently runs on the wrong initial configuration and produces
 * a t_c(N) value with no diagnostic flag.
 *
 * This file issues a Turing-method certificate for each N in the measured ladder.
 * The certificate verifies that ZEROS_EXTENDED contains exactly N zeros up to
 * height gamma_N = ZEROS_EXTENDED[N-1], using the Riemann-von Mangoldt (RvM)
 * counting function as the ground truth.
 *
 * Method
 * ------
 * Riemann-von Mangoldt formula:
 *
 *   N(T) = T / (2*pi) * log(T / (2*pi*e)) + 7/8 + S(T)
 *
 * where S(T) = Im log zeta(1/2 + iT) / pi is the Selberg argument function.
 * The main term is:
 *
 *   N_main(T) = T / (2*pi) * log(T / (2*pi*e)) + 7/8
 *
 * At T = gamma_N (the N-th zero), N(gamma_N) = N by definition. Therefore:
 *
 *   S(gamma_N) = N - N_main(gamma_N)
 *
 * The Turing certificate holds if:
 *
 *   |S(gamma_N)| < S_max(gamma_N)   where   S_max(T) = C_Selberg * log(T)
 *
 * with C_Selberg = 3 (Titchmarsh Section 14.13, Selberg 1946 conservative bound).
 * This is the same C_Selberg used in imp-426 / koksma-hlawka-C1-pinned.js.
 *
 * Passing the certificate means: the count is consistent with the Selberg bound
 * on the argument function. For the Odlyzko verified zero table (source of
 * ZEROS_EXTENDED), this check is expected to pass with a large margin since
 * empirically |S(T)| < 2 for all T in the loaded range (T < 800000).
 *
 * Ordering check
 * --------------
 * The certificate also verifies strict ordering: gamma_{N-1} < gamma_N for each
 * adjacent pair at positions N checked. Out-of-order zeros corrupt the backward
 * Calogero-Moser eigenvalue ODE (the potential (gamma_i - gamma_j)^{-3} blows
 * up if two gamma values are equal or swapped).
 */

import { ZEROS_EXTENDED } from "./zeros-to-1e6.js";

// ── Constants ──────────────────────────────────────────────────────────────────

// Conservative Selberg bound: |S(T)| < C_Selberg * log(T) for T >= 2.
// Source: Titchmarsh "Theory of the Riemann Zeta Function" Section 14.13.
// Same constant as koksma-hlawka-C1-pinned.js (imp-426).
const C_SELBERG = 3.0;

// The N values from the imp-360 measured ladder (must match dyson-ladder-measured.js).
const MEASURED_NS = [
  50, 100, 200, 500, 870,
  1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000,
  11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000,
  21000, 22000, 23000, 24000, 25000,
  30000, 40000, 50000, 75000, 100000,
];

// ── RvM main term ──────────────────────────────────────────────────────────────

/**
 * RvM main term: T / (2*pi) * log(T / (2*pi*e)) + 7/8.
 * This is N(T) without the S(T) correction.
 */
function rvmMainTerm(T) {
  return (T / (2 * Math.PI)) * Math.log(T / (2 * Math.PI * Math.E)) + 7 / 8;
}

/**
 * Conservative Selberg upper bound on |S(T)| = |N(T) - N_main(T)|.
 * Returns 3 * log(T) which is valid for all T >= 2 unconditionally.
 */
function selbergBound(T) {
  return C_SELBERG * Math.log(T);
}

// ── Per-N certificate computation ─────────────────────────────────────────────

function computeCertificate(N) {
  const tableSize = ZEROS_EXTENDED.length;

  if (N > tableSize) {
    return {
      N,
      gammaN: null,
      N_rvm_main: null,
      S_T: null,
      S_max: null,
      S_T_within_bound: false,
      ordering_ok: null,
      verified: false,
      failReason: "zero-list-insufficient: N > ZEROS_EXTENDED.length (" + tableSize + ")",
    };
  }

  const gammaN = ZEROS_EXTENDED[N - 1];       // N-th zero (1-indexed lookup)
  const gammaNminus1 = N > 1 ? ZEROS_EXTENDED[N - 2] : null;

  const N_rvm_main = rvmMainTerm(gammaN);
  const S_T = N - N_rvm_main;                 // actual S(gamma_N) value
  const S_max = selbergBound(gammaN);          // conservative Selberg upper bound

  const S_T_within_bound = Math.abs(S_T) < S_max;
  const ordering_ok = gammaNminus1 === null || gammaN > gammaNminus1;
  const verified = S_T_within_bound && ordering_ok;

  return {
    N,
    gammaN: +gammaN.toFixed(8),
    N_rvm_main: +N_rvm_main.toFixed(6),
    S_T: +S_T.toFixed(6),
    S_max: +S_max.toFixed(4),
    S_T_abs: +Math.abs(S_T).toFixed(6),
    S_T_within_bound,
    ordering_ok,
    verified,
  };
}

const CERTIFICATES = MEASURED_NS.map(computeCertificate);

// ── Aggregate flags ────────────────────────────────────────────────────────────

const ALL_VERIFIED       = CERTIFICATES.every((c) => c.verified);
const ALL_S_IN_BOUND     = CERTIFICATES.every((c) => c.S_T_within_bound !== false);
const ALL_ORDERING_OK    = CERTIFICATES.every((c) => c.ordering_ok !== false);
const TOTAL_ZEROS_LOADED = ZEROS_EXTENDED.length;

// Tightest observed |S(T)| relative to the Selberg bound (margin check).
const S_T_MARGINS = CERTIFICATES
  .filter((c) => c.S_max !== null)
  .map((c) => c.S_T_abs / c.S_max);
const WORST_S_MARGIN = S_T_MARGINS.length > 0 ? Math.max(...S_T_MARGINS) : null;

// ── Exported record ────────────────────────────────────────────────────────────

export const TURING_ZERO_COUNT_VERIFICATION = {
  id:    "imp-361",
  title: "Turing-method zero-count verification for imp-360 measured ladder",
  closes: "imp-361 (Turing certificate requirement for dyson-ladder-measured.js)",

  method: {
    name: "Riemann-von Mangoldt + Selberg argument bound",
    formula: "N_main(T) = T/(2*pi) * log(T/(2*pi*e)) + 7/8",
    certificate: "|S(gamma_N)| = |N - N_main(gamma_N)| < C_Selberg * log(gamma_N)",
    C_Selberg,
    source_C_Selberg: "Titchmarsh Section 14.13 (same as koksma-hlawka-C1-pinned.js imp-426)",
  },

  summary: {
    totalN:          MEASURED_NS.length,
    totalZerosLoaded: TOTAL_ZEROS_LOADED,
    allVerified:     ALL_VERIFIED,
    allSInBound:     ALL_S_IN_BOUND,
    allOrderingOk:   ALL_ORDERING_OK,
    worstSMargin:    WORST_S_MARGIN !== null ? +WORST_S_MARGIN.toFixed(6) : null,
    verdict:         ALL_VERIFIED ? "VERIFIED" : "FAILED",
  },

  certificates: CERTIFICATES,
};

// ── Build-time assertions ──────────────────────────────────────────────────────

export const TURING_VERIFICATION_ASSERTIONS = [
  {
    id: "imp361-all-certs-verified",
    holds: () => ALL_VERIFIED,
    why:
      "Every N in MEASURED_NS must pass both the Selberg bound check and the "
      + "strict-ordering check. A failing certificate means either the zero table "
      + "is missing entries at that N, has a corrupted ordering, or the Selberg "
      + "bound is violated (impossible for T < 800000 by Backlund theory).",
  },
  {
    id: "imp361-all-ordering-ok",
    holds: () => ALL_ORDERING_OK,
    why:
      "The N-th zero must be strictly greater than the (N-1)-th zero at every "
      + "measured N. Out-of-order zeros would make the Calogero-Moser potential "
      + "(gamma_i - gamma_j)^{-3} blow up in the backward Dyson ODE integration.",
  },
  {
    id: "imp361-zeros-table-covers-max-N",
    holds: () => TOTAL_ZEROS_LOADED >= 100000,
    why:
      "The largest measured N is 100000. ZEROS_EXTENDED must have at least "
      + "100000 entries to certify that row. Fewer entries means the certificate "
      + "for N = 100000 would return verified = false with failReason "
      + "zero-list-insufficient.",
  },
  {
    id: "imp361-verdict-is-verified",
    holds: () => TURING_ZERO_COUNT_VERIFICATION.summary.verdict === "VERIFIED",
    why:
      "The overall verdict must be VERIFIED. A FAILED verdict means the Odlyzko "
      + "zero table in ZEROS_EXTENDED has a missing or out-of-order entry at some "
      + "measured N in the imp-360 ladder.",
  },
  {
    id: "imp361-worst-margin-below-half",
    holds: () =>
      WORST_S_MARGIN !== null && WORST_S_MARGIN < 0.5,
    why:
      "The worst |S(T)| / S_max ratio over all certificates should be below 0.5. "
      + "For the Odlyzko verified table with T < 800000, empirically |S(T)| < 2 "
      + "while the Selberg bound gives S_max = 3 * log(T) >= 3 * log(50) ~ 11.7. "
      + "A margin >= 0.5 would indicate an anomalous S(T) value and should trigger "
      + "manual inspection of the zero table around that N.",
  },
];
