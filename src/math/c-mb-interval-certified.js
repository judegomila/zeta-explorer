/**
 * imp-857 / PATH 3 follow-up (UNCOND-Λ): Interval-arithmetic CERTIFIED Dyson
 * sweep for the many-body correction C_mb.
 *
 * SCOPE AND HONEST STATUS (read first)
 * ------------------------------------
 * This is an HONEST-PARTIAL closure of imp-857. The ticket requested certified
 * C_mb_empirical(N) at N in {100, 200, 500, 1000, 2000, 5000, 10000}. What is
 * DELIVERED here: a certified upper bound on the many-body correction at the
 * subset of N where the existing interval-Dyson RK4 integrator
 * (src/math/interval-dyson-integrator.mjs, imp-362) actually closes its
 * collision-time bracket, namely N in {50, 100, 200, 500}. What is NOT
 * delivered: the full {1000, 2000, 5000, 10000} range — the interval-RK4
 * wrapper blows up under one-ULP Float64 inflation before the step budget
 * closes the bracket at N >= 1000. Moving to full range requires a directed-
 * rounding backend (Arb via WASM or CAPD via a native binding). This sub-gap
 * is NAMED (imp-857-sub-scale-to-N10k) and recorded below so a successor
 * ticket can pick it up cleanly.
 *
 * WHAT THIS FILE COMPUTES
 * -----------------------
 * For each witness row of LAMBDA_INTERVAL_DYSON with a CLOSED bracket
 * (reason === "gap-lower-bound-nonpositive"):
 *
 *   1. The minimum RAW gap H_raw(N) over the first N Riemann zeros.
 *   2. The leading-order PAIR collision-time estimate
 *        t_c_pair(N) = H_raw(N)^2 / 8
 *      This is the 2-particle Calogero-Moser closed-form: under
 *      dg_k/dt = -2 * sum 1/(g_k - g_j) restricted to a single pair, the gap
 *      satisfies dB/dt = -4/B, i.e. d(B^2)/dt = -8, giving t_c = B(0)^2 / 8.
 *   3. The CERTIFIED interval [t_c_lo, t_c_hi] for the full N-body collision
 *      time from the imp-362 interval RK4 integrator.
 *   4. The many-body residual interval
 *        F_mb(N) in [t_c_lo - t_c_pair, t_c_hi - t_c_pair]
 *      with upper magnitude
 *        |F_mb(N)|_hi = max(|t_c_lo - t_c_pair|, |t_c_hi - t_c_pair|).
 *      This is the rigorous upper bound on the many-body correction at N.
 *   5. The ticket's ratio
 *        K_raw_cert(N) = |F_mb(N)|_hi * H_raw(N) / (N^{-1/2} * log(N))
 *      A finite uniform upper bound on K_raw_cert over N is the HEADLINE.
 *   6. A dimensionless relative correction
 *        R_rel_cert(N) = max(|t_c_lo - t_c_pair|, |t_c_hi - t_c_pair|)
 *                        / t_c_pair
 *      If R_rel_cert << 1, the leading-order pair estimate dominates.
 *
 * WHY RAW COORDINATES
 * -------------------
 * The interval RK4 integrator (imp-362) implements the RAW Dyson flow
 * dg_k/dt = -2 * sum 1/(g_k - g_j), so [t_c_lo, t_c_hi] is in RAW time. The
 * pair leading-order estimate in raw time is t_c_pair = H_raw^2 / 8 (no rho
 * factor). This matches the empirical sweep imp-833/858 estimate t_c_est =
 * H_unf^2 / (8 * rho^2) = H_raw^2 / 8 (rho cancels) so both coordinate systems
 * agree on the leading-order pair collision time at leading order. Good.
 *
 * RELATION TO THE PAPER'S C_mb
 * ----------------------------
 * c-mb-unconditional-bound.js writes the paper-standard bound as
 *   |F_mb(N)| <= C_mb * rho^2 * N^{-1/2} * log(N) / H_unf,
 * i.e. C_mb = |F_mb| * H_unf / (rho^2 * N^{-1/2} * log(N)) with H_unf the
 * UNFOLDED min-gap. Substituting H_unf = rho * H_raw:
 *   C_mb = |F_mb| * H_raw / (rho * N^{-1/2} * log(N)) = K_raw_cert(N) / rho(N).
 * Since rho(gamma_N) > rho(14) = 0.12751 (imp-469 analytic floor), we have
 *   C_mb_cert(N) <= K_raw_cert(N) / 0.12751.
 * The CERTIFIED K_CMB_PAPER_UPPER below applies this rho-floor conversion to
 * quote an upper bound in the paper's C_mb normalization.
 *
 * INPUT: NONE (reads existing precomputed witness + zero table)
 * OUTPUT: C_MB_INTERVAL_CERTIFIED record with rows, K_certified, and status.
 * COST: O(N^2) per row for H_raw computation (cheap at these N);
 *       interval-RK4 is NOT re-run (it already ran at module load of
 *       interval-dyson-integrator.mjs; we only consume its WITNESS_ROWS).
 *
 * SYNTAX NOTE: avoid (star)(slash) sequences in JSDoc. Use "N^{-1/2}" etc.
 */

import { LAMBDA_INTERVAL_DYSON } from './interval-dyson-integrator.mjs';
import { ZETA_ZEROS } from './zeta.js';

// ── RvM density (raw-coord, gives rho at a single point). ────────────────────

function rvmDensity(T) {
  return Math.log(T / (2 * Math.PI)) / (2 * Math.PI);
}

// Minimum raw gap over the first N zeros. O(N).
function minRawGap(N) {
  let H = Infinity;
  for (let i = 0; i < N - 1; i++) {
    const d = ZETA_ZEROS[i + 1] - ZETA_ZEROS[i];
    if (d < H) H = d;
  }
  return H;
}

// ── Per-row certified C_mb bound from the existing interval witness. ─────────

function rowCertifiedBound(row) {
  if (row.reason !== 'gap-lower-bound-nonpositive') {
    return {
      N: row.N,
      status: 'skipped',
      reason: row.reason,
      note:
        'Interval RK4 did not close the bracket at this N under the current ' +
        'one-ULP wrapper. No certified bound.',
    };
  }
  const N = row.N;
  if (ZETA_ZEROS.length < N) {
    return { N, status: 'zero-list-insufficient' };
  }

  const H_raw     = minRawGap(N);
  const rho_N     = rvmDensity(ZETA_ZEROS[N - 1]);
  const t_c_pair  = (H_raw * H_raw) / 8;
  const t_c_lo    = row.t_c_lo;
  const t_c_hi    = row.t_c_hi;

  // |F_mb|_hi = max over endpoints of |endpoint - t_c_pair|.
  const d_lo        = t_c_lo - t_c_pair;
  const d_hi        = t_c_hi - t_c_pair;
  const F_mb_upper  = Math.max(Math.abs(d_lo), Math.abs(d_hi));

  // Ticket's formula (raw-coord): K_raw = |F_mb| * H_raw / (N^{-1/2} * log(N)).
  const scale_invN  = 1 / Math.sqrt(N);
  const scaleFactor = scale_invN * Math.log(N);
  const K_raw_cert  = (F_mb_upper * H_raw) / scaleFactor;

  // Paper-normalization via the imp-469 analytic rho-floor: C_mb = K_raw/rho.
  const K_paper_cert_strict = K_raw_cert / rho_N;
  const K_paper_cert_floor  = K_raw_cert / 0.12751; // rho(14), uniform floor

  // Relative correction: fraction of t_c_pair accounted for by F_mb.
  const R_rel_cert = F_mb_upper / t_c_pair;

  return {
    N,
    status: 'certified',
    t_c_pair: +t_c_pair.toExponential(6),
    t_c_lo,
    t_c_hi,
    bracketWidth: +(t_c_hi - t_c_lo).toExponential(4),
    H_raw: +H_raw.toFixed(6),
    rho_N: +rho_N.toFixed(6),
    F_mb_upper: +F_mb_upper.toExponential(4),
    K_raw_cert: +K_raw_cert.toExponential(4),
    K_paper_cert_strict: +K_paper_cert_strict.toExponential(4),
    K_paper_cert_floor:  +K_paper_cert_floor.toExponential(4),
    R_rel_cert: +R_rel_cert.toExponential(4),
  };
}

const CERTIFIED_ROWS = LAMBDA_INTERVAL_DYSON.witness.map(rowCertifiedBound);

const CLOSED_ROWS = CERTIFIED_ROWS.filter((r) => r.status === 'certified');

// ── Headline aggregates over closed rows. ────────────────────────────────────

const N_CERTIFIED = CLOSED_ROWS.length;

const K_RAW_MAX        = N_CERTIFIED > 0
  ? Math.max(...CLOSED_ROWS.map((r) => r.K_raw_cert))
  : Infinity;
const K_PAPER_MAX_STRICT = N_CERTIFIED > 0
  ? Math.max(...CLOSED_ROWS.map((r) => r.K_paper_cert_strict))
  : Infinity;
const K_PAPER_MAX_FLOOR  = N_CERTIFIED > 0
  ? Math.max(...CLOSED_ROWS.map((r) => r.K_paper_cert_floor))
  : Infinity;
const R_REL_MAX          = N_CERTIFIED > 0
  ? Math.max(...CLOSED_ROWS.map((r) => r.R_rel_cert))
  : Infinity;

// ── Rescue-table mapping (echoes imp-486 / c-mb-unconditional-bound.js). ─────
//
// The analytic closure condition at threshold N_0 is:
//   K * log(N_0) / sqrt(N_0) < rho_min = 0.12751
// Binary-search the minimum N_0 that satisfies this for the CERTIFIED K_paper.
// This quotes the N_0 above which the interval certificate WOULD rescue the
// analytic closure (if the certificate could be extended to all N, which is
// the open sub-gap).

function minN0ForK(K) {
  let lo = 1e4;
  let hi = 1e14;
  for (let i = 0; i < 80; i++) {
    const mid = Math.sqrt(lo * hi);
    const lhs = (K * Math.log(mid)) / Math.sqrt(mid);
    if (lhs < 0.12751) hi = mid;
    else lo = mid;
  }
  return Math.ceil(hi);
}

const N0_RESCUE_STRICT = Number.isFinite(K_PAPER_MAX_STRICT)
  ? minN0ForK(K_PAPER_MAX_STRICT)
  : Infinity;
const N0_RESCUE_FLOOR  = Number.isFinite(K_PAPER_MAX_FLOOR)
  ? minN0ForK(K_PAPER_MAX_FLOOR)
  : Infinity;

// ── Closure record ──────────────────────────────────────────────────────────

export const C_MB_INTERVAL_CERTIFIED = {
  id:    'imp-857',
  title: 'PATH 3 follow-up: interval-arithmetic certified Dyson sweep for C_mb_empirical(N)',
  status: 'partial',
  closureLevel: 'honest-partial-on-closable-N',

  consumes: [
    'imp-362 interval-dyson-integrator.mjs (witness table of closed brackets)',
    'imp-315/357 RK4/DP8 Dyson integrators (implicit via the witness OLS fits)',
    'imp-833 empirical-m-sweep-extended.js (leading-order predicates E1,E2)',
    'imp-486 c-mb-unconditional-bound.js (C_MB_RESCUE_TABLE target)',
    'imp-469 RVM analytic rho-floor rho(14) = 0.12751 (paper-normalization)',
  ],

  method:
    'For each N where the interval-RK4 integrator closes its backward- ' +
    'collision bracket, combine (a) the minimum RAW gap H_raw(N) over the ' +
    'first N Riemann zeros, (b) the leading-order 2-particle estimate t_c_pair ' +
    '= H_raw^2 / 8, and (c) the certified interval [t_c_lo, t_c_hi] from ' +
    'imp-362 to produce an UPPER endpoint on |F_mb(N)| = |t_c_true - t_c_pair|. ' +
    'The upper bound on |F_mb| is max(|t_c_lo - t_c_pair|, |t_c_hi - t_c_pair|). ' +
    'K_raw_cert(N) = |F_mb|_hi * H_raw / (N^{-1/2} * log(N)) is the ticket-ratio; ' +
    'K_paper_cert(N) = K_raw_cert(N) / rho_N converts to the paper-standard C_mb ' +
    'normalization (dividing by either the exact rho_N or the analytic floor 0.12751).',

  requestedRange:    [100, 200, 500, 1000, 2000, 5000, 10000],
  certifiedRange:    CLOSED_ROWS.map((r) => r.N),
  notCertifiedRange: CERTIFIED_ROWS
    .filter((r) => r.status !== 'certified')
    .map((r) => ({ N: r.N, reason: r.reason ?? r.status })),

  rows: CERTIFIED_ROWS,

  headline: {
    nCertifiedNs:         N_CERTIFIED,
    K_raw_max:            +K_RAW_MAX.toExponential(4),
    K_paper_max_strict:   +K_PAPER_MAX_STRICT.toExponential(4),
    K_paper_max_floor:    +K_PAPER_MAX_FLOOR.toExponential(4),
    R_rel_max:            +R_REL_MAX.toExponential(4),
    K_paper_below_one:    K_PAPER_MAX_FLOOR < 1,
    K_paper_below_seven:  K_PAPER_MAX_FLOOR < 7,
  },

  rescueMapping: {
    using_K_paper_strict: {
      K: +K_PAPER_MAX_STRICT.toExponential(4),
      N0_required: N0_RESCUE_STRICT,
      N0_scientific: Number.isFinite(N0_RESCUE_STRICT)
        ? N0_RESCUE_STRICT.toExponential(2)
        : 'infinite',
      note:
        'Minimum N_0 (via imp-486 rescue formula K*log(N_0)/sqrt(N_0) < rho_min ' +
        '= 0.12751) assuming the CERTIFIED K applies at all N >= N_0.',
    },
    using_K_paper_floor: {
      K: +K_PAPER_MAX_FLOOR.toExponential(4),
      N0_required: N0_RESCUE_FLOOR,
      N0_scientific: Number.isFinite(N0_RESCUE_FLOOR)
        ? N0_RESCUE_FLOOR.toExponential(2)
        : 'infinite',
      note:
        'Same mapping under the uniform rho-floor (conservative) K = ' +
        'K_raw / 0.12751.',
    },
    caveat:
      'This mapping ONLY rescues the closure if the CERTIFIED upper bound can ' +
      'be EXTENDED from the closable N set {50,100,200,500} to all N. That ' +
      'extension is the open sub-gap imp-857-sub-scale-to-N10k. With the ' +
      'current closable range alone, the mapping is SUGGESTIVE: IF a directed- ' +
      'rounding backend confirms the same K_paper_cert at N = 10000 (and by ' +
      'monotonicity-of-corrections heuristics, no worse), the rescue table ' +
      'would apply at the quoted N_0.',
  },

  openSubGap: {
    id: 'imp-857-sub-scale-to-N10k',
    statement:
      'Extend the certified interval sweep from {50, 100, 200, 500} (closable ' +
      'under one-ULP JavaScript Float64 inflation) to the full ticket range ' +
      '{100, 200, 500, 1000, 2000, 5000, 10000}. Requires a directed-rounding ' +
      'interval-arithmetic backend (Arb via WASM, MPFI, or CAPD via native ' +
      'binding) so the wrapper width does not dominate the RK4 contraction at ' +
      'thousands of backward steps. Alternatively a Krawczyk / mean-value-form ' +
      'contraction could tame wrapper growth in JavaScript itself.',
    difficulty: 'research-grade-infra',
    status: 'open',
  },

  honestStatus:
    N_CERTIFIED > 0
      ? 'HONEST-PARTIAL CERTIFICATION on N in {' +
        CLOSED_ROWS.map((r) => r.N).join(', ') +
        '}: interval RK4 closes a backward-collision bracket at each and ' +
        'the paper-normalized certified upper bound K_paper_cert (using the ' +
        'analytic rho-floor 0.12751) maxes out at ' +
        K_PAPER_MAX_FLOOR.toExponential(3) +
        '. The ticket-requested range {100, 200, 500, 1000, 2000, 5000, ' +
        '10000} is only partially covered — the N >= 1000 rows exhaust the ' +
        'interval-RK4 step budget under one-ULP Float64 inflation and are ' +
        'recorded as imp-857-sub-scale-to-N10k (directed-rounding backend ' +
        'needed). K_paper_max_below_one = ' +
        String(K_PAPER_MAX_FLOOR < 1) +
        '; if TRUE, this matches the imp-856 preliminary estimate and would ' +
        '(once extended to the full range) elevate the imp-833 empirical ' +
        'closure on N <= 10000 from numerical to interval-certified rigor.'
      : 'FAILURE: no witness row closed its bracket under the existing imp-362 ' +
        'interval integrator. This would indicate a regression in imp-362 and ' +
        'must be investigated before imp-857 can progress.',
};

// ── Build-time assertions ──────────────────────────────────────────────────

export const C_MB_INTERVAL_CERTIFIED_ASSERTIONS = [
  {
    id: 'imp857-at-least-one-certified-N',
    holds: () => C_MB_INTERVAL_CERTIFIED.headline.nCertifiedNs >= 1,
    why:
      'The interval-arithmetic sweep must certify at least one N. Zero ' +
      'certified rows means every LAMBDA_INTERVAL_DYSON witness row either ' +
      'failed to close its bracket or was out of scope, so the ticket has ' +
      'no actual numerical content.',
  },
  {
    id: 'imp857-K-raw-finite',
    holds: () => Number.isFinite(C_MB_INTERVAL_CERTIFIED.headline.K_raw_max),
    why:
      'K_raw_max over certified N must be a finite number. Infinity would ' +
      'indicate a degenerate t_c_pair = 0 or a non-closed interval leaked ' +
      'past the rowCertifiedBound filter.',
  },
  {
    id: 'imp857-status-partial',
    holds: () => C_MB_INTERVAL_CERTIFIED.status === 'partial',
    why:
      'HONEST SCOPE TRIPWIRE: the certified range is {50,100,200,500} under ' +
      'the current integrator, not the ticket-requested {100,...,10000}. Do ' +
      'not flip status to closed/completed without extending to N >= 1000 ' +
      'via a directed-rounding backend (sub-gap imp-857-sub-scale-to-N10k).',
  },
  {
    id: 'imp857-open-subgap-named',
    holds: () =>
      C_MB_INTERVAL_CERTIFIED.openSubGap.id === 'imp-857-sub-scale-to-N10k' &&
      C_MB_INTERVAL_CERTIFIED.openSubGap.status === 'open',
    why:
      'The directed-rounding scaling sub-gap must be named and open. ' +
      'Removing or renaming it silently without a closing ticket would ' +
      'hide the residual research work.',
  },
  {
    id: 'imp857-K-paper-matches-imp856-prelim-estimate-or-documents-overrun',
    holds: () =>
      typeof C_MB_INTERVAL_CERTIFIED.headline.K_paper_below_one === 'boolean',
    why:
      'The headline K_paper_below_one flag must be a definite boolean so a ' +
      'downstream reader can see whether the imp-856 preliminary estimate ' +
      '(K_empirical < 1) is confirmed on the closable range. A non-boolean ' +
      'here means the computation short-circuited without producing a verdict.',
  },
  {
    id: 'imp857-rescue-mapping-populated',
    holds: () =>
      typeof C_MB_INTERVAL_CERTIFIED.rescueMapping.using_K_paper_floor.N0_required === 'number',
    why:
      'The rescue mapping must compute a concrete N_0 from the certified K ' +
      'via the imp-486 rescue formula. Without it, the certification has no ' +
      'downstream consumer path to the analytic-closure threshold.',
  },
];
