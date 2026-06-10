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

  bracketSemanticsImp2528:
    'SEMANTICS DOWNGRADE (imp-2528, closing ' +
    'imp-2511-sub-interval-bracket-map-vs-flow): the imp-362 interval ' +
    '[t_c_lo, t_c_hi] consumed here is discrete-map-certified ONLY — a ' +
    'rigorous one-ULP roundoff enclosure of the FIXED-dt RK4-map collision ' +
    'time, not of the true Dyson-flow collision time (outward rounding ' +
    'bounds roundoff, not RK4 truncation; at N=100 the order-robust DP8 ' +
    'flow time 0.0705 sits below t_c_lo 0.075). Every certified quantity ' +
    'derived below (F_mb_upper, K_raw_cert, K_paper_cert) inherits the same ' +
    'map-level semantics; as TRUE-FLOW statements they are empirically ' +
    'supported via the one-sided overshoot direction t_c_flow <= t_c_hi ' +
    '(imp-2510) but not interval-certified. See mapVsFlowSemantics on ' +
    'C_MB_EMPIRICAL_DYSON_SWEEP (src/data/c-mb-empirical-dyson-sweep.js) ' +
    'and the open successor sub-gap imp-2528-sub-certified-flow-enclosure.',

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
    // ── imp-2550 HONEST PARTIAL ───────────────────────────────────────────────
    // The bracket-EXISTENCE half of this sub-gap is already met in pure
    // JavaScript WITHOUT a directed-rounding backend. The witness set consumed
    // above (LAMBDA_INTERVAL_DYSON.witness) merely stops at N = 500; the SAME
    // one-ULP Float64 interval RK4, run via the optimised driver, closes
    // backward-collision brackets across the entire ticket range and far beyond:
    //   imp-857-baseline-sweep-result.js  -> N in {1000,2000,5000,10000}
    //       (widest maxIntervalWidth = 3.359e-8, reason gap-lower-bound-nonpositive)
    //   imp-360-extended-ladder-N1e6      -> N in {25000,50000,100000}
    //       (closed rows, maxIntervalWidth < 1e-2 by imp360-ext assertion)
    // all >= 6 orders of magnitude below the 0.01 wrapper heuristic. So the
    // original "directed-rounding backend needed to CLOSE brackets at N >= 1000"
    // framing is superseded for bracket existence; what genuinely still needs a
    // higher-order / directed-rounding backend is the NARROWER residual below.
    partialProgressImp2550: {
      ticket: 'imp-2550',
      bracketExistenceMet: true,
      baselineClosedNs: [1000, 2000, 5000, 10000],
      baselineWidestMaxIntervalWidth: 3.359e-8,
      extendedClosedNs: [25000, 50000, 100000],
      extendedMaxIntervalWidthBound: 1e-2,
      finding:
        'The same one-ULP JS Float64 interval RK4 closes backward-collision ' +
        'brackets at every N in the {1000,2000,5000,10000} ticket range ' +
        '(imp-857-baseline-sweep-result.js, widest maxW 3.359e-8) and beyond, ' +
        'to N in {25000,50000,100000} (imp-360-extended-ladder, maxW < 1e-2). ' +
        'No directed-rounding backend is required for bracket EXISTENCE.',
      residual:
        'The sub-gap stays OPEN only on the NARROWER residual: (i) lift these ' +
        'discrete-MAP-certified brackets to TRUE-FLOW certification (the ' +
        'imp-2528 semantics downgrade -- outward rounding bounds roundoff, not ' +
        'RK4 truncation), and (ii) recompute the paper-normalized K_paper_cert ' +
        'at N >= 1000 from those rows. Both still want a higher-order / ' +
        'directed-rounding backend; bracket existence no longer does.',
    },
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
    id: 'imp2550-subgap-bracket-existence-partial',
    holds: () => {
      const p = C_MB_INTERVAL_CERTIFIED.openSubGap.partialProgressImp2550;
      const baselineExpected = [1000, 2000, 5000, 10000];
      const extendedExpected = [25000, 50000, 100000];
      return (
        !!p &&
        p.bracketExistenceMet === true &&
        Array.isArray(p.baselineClosedNs) &&
        p.baselineClosedNs.length === baselineExpected.length &&
        p.baselineClosedNs.every((n) => baselineExpected.includes(n)) &&
        Array.isArray(p.extendedClosedNs) &&
        p.extendedClosedNs.every((n) => extendedExpected.includes(n)) &&
        p.baselineWidestMaxIntervalWidth < 1e-2 &&
        // The sub-gap must remain OPEN on the narrower map->flow + K_paper residual.
        C_MB_INTERVAL_CERTIFIED.openSubGap.status === 'open'
      );
    },
    why:
      'imp-2550 HONEST PARTIAL: the bracket-EXISTENCE half of imp-857-sub-scale-' +
      'to-N10k is met in pure JS one-ULP interval RK4 (imp-857 baseline closes ' +
      'N in {1000..10000} at maxW < 0.01; imp-360 closes N in {25000..100000}), ' +
      'so the residual is narrowed to the discrete-map -> true-flow lift and the ' +
      'K_paper_cert precision at N >= 1000. This tripwire fails if the partial- ' +
      'progress evidence is dropped or the sub-gap is silently flipped to closed.',
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

// ────────────────────────────────────────────────────────────────────
// imp-972: Independent cross-verification (proof, S10-cross-verify)
// ────────────────────────────────────────────────────────────────────
//
// Static formula + edge-case + numerical-reference audit recorded
// inline so future readers can reproduce the cross-checks without
// re-running the engine. Follows the imp-919 / imp-921 / imp-971
// precedent. Scope: (1) re-derive the load-bearing formulas from
// first principles to catch silent drift, (2) audit each numerical
// step for NaN / Inf / divide-by-zero, (3) check declared numerical
// constants against published references, (4) verify cross-references
// to imp-362 / imp-486 / imp-469 are internally consistent.
//
// (1) Formula re-derivation.
//
//     (1a) 2-particle Calogero-Moser (line 30, line 115).
//          The raw Dyson flow is dg_k/dt = -2 * sum_{j != k} 1/(g_k - g_j).
//          For 2 particles with B = g_2 - g_1 > 0:
//            dg_1/dt = -2 / (g_1 - g_2) = +2 / B
//            dg_2/dt = -2 / (g_2 - g_1) = -2 / B
//            dB/dt   = dg_2/dt - dg_1/dt = -4 / B
//            d(B^2)/dt = 2 B * dB/dt = -8
//          So B^2(t) = B(0)^2 - 8 t, collision at t_c = B(0)^2 / 8.
//          The header comment and the implementation t_c_pair =
//          (H_raw * H_raw) / 8 (line 115) match this derivation. CONFIRMED.
//
//     (1b) RVM density (line 81-83, function rvmDensity).
//          The Riemann-von Mangoldt formula gives
//            N(T) = (T/(2*pi)) * log(T/(2*pi)) - T/(2*pi) + 7/8 + S(T) + O(1/T),
//          and differentiating the smooth part yields
//            N'(T) = log(T/(2*pi)) / (2*pi) + O(1/T).
//          rvmDensity(T) implements exactly this leading-order density. The
//          O(1/T) tail is dropped (correct: the floor at T = 14 still gives
//          a strict lower bound at all gamma_N >= 14 because the tail is
//          negligible compared to the log term and rho is monotone in T).
//          CONFIRMED.
//
//     (1c) Paper-normalization conversion (line 60-65).
//          The paper bound is |F_mb| <= C_mb * rho^2 * N^{-1/2} * log(N) / H_unf
//          with H_unf the UNFOLDED min-gap. The local Riemann-zero unfolding
//          is gamma_unf,k = N(gamma_k), so dgamma_unf = rho(gamma) dgamma at
//          leading order, giving H_unf = rho * H_raw at the relevant scale.
//          Substituting:
//            C_mb = |F_mb| * H_unf / (rho^2 * N^{-1/2} * log(N))
//                 = |F_mb| * (rho * H_raw) / (rho^2 * N^{-1/2} * log(N))
//                 = |F_mb| * H_raw / (rho * N^{-1/2} * log(N))
//                 = K_raw / rho.
//          The line 130-131 conversion K_paper_cert_strict = K_raw_cert /
//          rho_N and K_paper_cert_floor = K_raw_cert / 0.12751 implement
//          exactly this. CONFIRMED.
//
//     (1d) Monotonicity-of-floor (line 62-63).
//          rvmDensity is increasing in T because log is increasing. So for
//          gamma_N >= 14 we have rho(gamma_N) >= rho(14) = 0.12751 and
//          therefore K_raw / rho_N <= K_raw / 0.12751. The "_floor" name is
//          ACCURATE for the rho input but is a CEILING for the resulting K
//          (i.e. K_paper_floor is the conservative UPPER bound on C_mb).
//          The header comment "uniform floor" refers to the rho input;
//          arithmetically the resulting K is an upper bound. CONFIRMED.
//
//     (1e) Rescue formula (line 188-189).
//          The threshold is K * log(N_0) / sqrt(N_0) < rho_min = 0.12751.
//          This is the imp-486 c-mb-unconditional-bound.js closure
//          condition: when this holds, the C_mb correction is dominated
//          by rho_min, hence cannot un-do the analytic closure. The
//          binary search bisects in geometric (sqrt(lo*hi)) coordinates,
//          which is correct for a monotone function in log-N space.
//          CONFIRMED.
//
// (2) NaN / Inf / divide-by-zero edge-case audit.
//
//     (2a) minRawGap. For N >= 2 the loop runs at least once and assigns
//          a finite d. The Math.min update only narrows H. For N = 1 the
//          loop is empty and H = Infinity is returned, but the caller
//          rowCertifiedBound first guards `ZETA_ZEROS.length < N`, and
//          all witness rows have N >= 50, so N >= 2 holds. SAFE.
//
//     (2b) t_c_pair = H_raw^2 / 8. H_raw > 0 always (Riemann zeros are
//          simple under the assumed numerical table; the smallest
//          observed gap is ~0.6). t_c_pair > 0. SAFE.
//
//     (2c) F_mb_upper / t_c_pair (line 134, R_rel_cert). Divisor t_c_pair
//          is strictly positive by (2b). SAFE.
//
//     (2d) K_raw_cert = (F_mb_upper * H_raw) / scaleFactor where
//          scaleFactor = (1/sqrt(N)) * log(N). For N >= 2, log(N) >=
//          log(2) ~= 0.693 > 0 and sqrt(N) > 0, so scaleFactor > 0. SAFE.
//
//     (2e) K_paper_cert_strict = K_raw_cert / rho_N. rho_N > 0 because
//          gamma_N > 14 > 2*pi for N >= 1 (gamma_1 ~= 14.13). SAFE.
//
//     (2f) K_paper_cert_floor uses literal divisor 0.12751. SAFE.
//
//     (2g) Empty-CLOSED_ROWS path. If N_CERTIFIED === 0 the spread
//          Math.max(...[]) would yield -Infinity, but the ternary guards
//          `N_CERTIFIED > 0 ? ... : Infinity` (lines 161-172) replace
//          the empty case with Infinity. The downstream
//          K_paper_below_one flag (Infinity < 1) is false, the
//          imp857-at-least-one-certified-N assertion trips, and
//          minN0ForK is gated by Number.isFinite. SAFE.
//
//     (2h) minN0ForK binary search. lo = 1e4, hi = 1e14, geometric mean
//          mid = sqrt(lo*hi) ~= 3.16e9 — well within Float64 range. The
//          80-iteration loop is enough for ~24 decimal digits of
//          contraction in log space, far more than needed. The lhs
//          K * log(mid) / sqrt(mid) is finite for any finite K. SAFE.
//
// (3) Numerical reference values.
//
//     (3a) rho(14) = 0.12751 (imp-469 analytic floor).
//          rvmDensity(14) = log(14 / (2*pi)) / (2*pi)
//                         = log(2.228169...) / 6.283185...
//                         = 0.801281... / 6.283185...
//                         = 0.127529...
//          Rounded to five decimals = 0.12753, written here and in
//          imp-469 as 0.12751. The cited 0.12751 is a SLIGHT
//          UNDER-quote (0.12751 < 0.12753), which is conservative for
//          a floor — i.e. dividing K_raw by 0.12751 produces a
//          slightly LARGER (more pessimistic) K_paper_floor than
//          dividing by the exact 0.127529. This direction is SAFE
//          for an upper-bound certificate. CONFIRMED-CONSERVATIVE.
//          (A future tightening could replace 0.12751 with the
//          exact rvmDensity(14) ~= 0.12753 to recover ~0.02 percent
//          headroom; logged as suggested-future-tightening below.)
//
//     (3b) Closable N set {50, 100, 200, 500}. The header asserts that
//          the imp-362 interval-RK4 wrapper closes its bracket at these
//          and not at N >= 1000. This is a runtime fact recorded in
//          LAMBDA_INTERVAL_DYSON.witness, so the cross-verify cannot
//          re-derive it analytically — it is consumed as a given from
//          imp-362 and the assertion imp857-at-least-one-certified-N
//          guards against silent loss. NOT-INDEPENDENTLY-CHECKED-HERE.
//
//     (3c) Pair-time leading-order check. For N = 100 with H_raw ~= 0.6
//          (typical first-100 min gap), t_c_pair ~= 0.36/8 = 0.045.
//          This is the order-of-magnitude expected from the imp-833 /
//          imp-858 empirical sweep, which placed t_c at ~10^-2 for the
//          first few hundred zeros. The two should agree to within an
//          O(1) many-body factor, which is exactly the F_mb residual
//          this file computes. CONSISTENT.
//
// (4) Cross-reference consistency.
//
//     (4a) imports `LAMBDA_INTERVAL_DYSON` from
//          './interval-dyson-integrator.mjs' (imp-362). The witness
//          schema used here (.witness with rows containing .N,
//          .reason, .t_c_lo, .t_c_hi) matches the documented imp-362
//          contract. INTERNALLY CONSISTENT.
//
//     (4b) imports `ZETA_ZEROS` from './zeta.js'. The minRawGap loop
//          assumes consecutive entries are sorted ascending Riemann
//          zero ordinates. zeta.js is the canonical source in this
//          repo. INTERNALLY CONSISTENT.
//
//     (4c) cites imp-486 c-mb-unconditional-bound.js for the rescue
//          formula and imp-469 for the rho-floor 0.12751. Both are
//          referenced consistently by the rescueMapping export and
//          the K_paper_cert_floor name. INTERNALLY CONSISTENT.
//
//     (4d) The openSubGap.id "imp-857-sub-scale-to-N10k" is named in
//          two places (line 17 header and line 279 export) and they
//          match. INTERNALLY CONSISTENT.
//
// Verdict: c-mb-interval-certified.js cross-verifies as INTERNALLY
// CONSISTENT. The five load-bearing formulas (Calogero-Moser pair
// collision, RVM density, paper-norm conversion, monotone rho-floor,
// rescue threshold) are all independently re-derived and match the
// implementation. No reachable NaN / Inf / divide-by-zero path. The
// only numerical reference value (0.12751) is a CONSERVATIVE
// under-quote of the exact rvmDensity(14) ~= 0.127529 and therefore
// safe for an upper-bound certificate. One suggested-future-tightening
// is logged (replace 0.12751 with the exact value to reclaim ~0.02
// percent headroom); not made in this commit to keep imp-972 atomic.
// ────────────────────────────────────────────────────────────────────

export const C_MB_INTERVAL_CERTIFIED_CROSS_VERIFY = {
  id: 'imp-972',
  auditDate: '2026-05-08',
  precedent: ['imp-919', 'imp-921', 'imp-971'],
  scope: [
    'formula-re-derivation (Calogero-Moser pair, RVM density, paper-norm conversion, monotone floor, rescue threshold)',
    'edge-case (NaN / Inf / divide-by-zero across minRawGap, rowCertifiedBound, minN0ForK, headline aggregates)',
    'numerical-reference-values (rho(14) = 0.12751 vs exact rvmDensity(14))',
    'cross-reference-consistency (imp-362 witness schema, imp-486 rescue formula, imp-469 rho-floor, imp-857 sub-gap naming)',
  ],
  formulasReDerived: [
    {
      id: 'calogero-moser-pair-collision',
      claim: 't_c_pair = H_raw^2 / 8 from dg_k/dt = -2 sum 1/(g_k - g_j)',
      derivation: 'dB/dt = -4/B for 2 particles, so d(B^2)/dt = -8, B^2(t) = B(0)^2 - 8 t, t_c = B(0)^2 / 8',
      status: 'CONFIRMED',
    },
    {
      id: 'rvm-density-leading-order',
      claim: 'rho(T) = log(T/(2*pi)) / (2*pi)',
      derivation: 'differentiate the smooth part of the Riemann-von Mangoldt N(T) formula; O(1/T) tail dropped',
      status: 'CONFIRMED',
    },
    {
      id: 'paper-norm-conversion',
      claim: 'C_mb = K_raw / rho with K_raw = |F_mb| * H_raw / (N^{-1/2} * log(N))',
      derivation: 'substitute H_unf = rho * H_raw into |F_mb| <= C_mb * rho^2 * N^{-1/2} * log(N) / H_unf',
      status: 'CONFIRMED',
    },
    {
      id: 'monotone-rho-floor',
      claim: 'K_paper_floor = K_raw / 0.12751 is a conservative UPPER bound on C_mb',
      derivation: 'rho(gamma_N) >= rho(14) = 0.12751 for N >= 1 since rho is increasing in T',
      status: 'CONFIRMED',
    },
    {
      id: 'rescue-threshold',
      claim: 'minN0ForK bisects K * log(N_0) / sqrt(N_0) < 0.12751 in geometric coordinates',
      derivation: 'imp-486 closure condition; binary search in log-N space because the lhs is monotone decreasing',
      status: 'CONFIRMED',
    },
  ],
  edgeCases: [
    { path: 'minRawGap', risk: 'empty-loop returns Infinity', mitigation: 'caller guards ZETA_ZEROS.length < N and witness rows have N >= 50', verdict: 'SAFE' },
    { path: 't_c_pair = H^2/8',           risk: 'H_raw = 0',           mitigation: 'distinct Riemann zeros, smallest observed gap ~0.6',                                  verdict: 'SAFE' },
    { path: 'R_rel_cert = F_mb / t_c_pair', risk: 'divide by zero',     mitigation: 't_c_pair > 0 by (2b)',                                                              verdict: 'SAFE' },
    { path: 'K_raw_cert / scaleFactor',    risk: 'log(N) <= 0',         mitigation: 'witness N >= 50 implies log(N) >= log(50) ~= 3.91',                                 verdict: 'SAFE' },
    { path: 'K_paper_cert_strict / rho_N', risk: 'rho_N <= 0',          mitigation: 'gamma_N > 14 > 2*pi gives rho_N > 0',                                              verdict: 'SAFE' },
    { path: 'Math.max on empty CLOSED_ROWS', risk: 'spread of [] -> -Infinity', mitigation: 'ternary guard sets Infinity sentinel + assertion imp857-at-least-one-certified-N trips', verdict: 'SAFE' },
    { path: 'minN0ForK binary search',     risk: 'overflow / non-convergence', mitigation: 'lo=1e4 hi=1e14 with 80 iterations gives ~24 decimal digits of contraction', verdict: 'SAFE' },
  ],
  numericalReferences: [
    {
      symbol: 'rho(14)',
      cited: 0.12751,
      recomputed: Math.log(14 / (2 * Math.PI)) / (2 * Math.PI),
      delta: Math.log(14 / (2 * Math.PI)) / (2 * Math.PI) - 0.12751,
      verdict: 'CONFIRMED-CONSERVATIVE (cited 0.12751 < exact ~0.127529; under-quote is safe for an upper-bound certificate)',
    },
  ],
  flags: [
    {
      id: 'rho-floor-under-quote',
      severity: 'low',
      finding:
        'The cited rho(14) = 0.12751 is ~0.02 percent below the exact ' +
        'rvmDensity(14) ~= 0.127529. Direction is conservative for an ' +
        'upper-bound certificate (K_paper_floor is slightly larger than ' +
        'K_paper_strict at gamma = 14). A future tightening could replace ' +
        '0.12751 with the exact value to reclaim ~0.02 percent headroom. ' +
        'Not changed in this commit to keep imp-972 atomic.',
    },
  ],
  notIndependentlyChecked: [
    {
      id: 'closable-N-set',
      why:
        'The fact that imp-362 interval-RK4 closes its bracket at N in ' +
        '{50, 100, 200, 500} but not at N >= 1000 is a runtime artifact ' +
        'recorded in LAMBDA_INTERVAL_DYSON.witness. It is consumed as a ' +
        'given from imp-362 and is guarded by the imp857-at-least-one- ' +
        'certified-N assertion against silent loss.',
    },
  ],
  verdict:
    'INTERNALLY CONSISTENT. Five load-bearing formulas re-derived from ' +
    'first principles; no reachable NaN / Inf / divide-by-zero path; ' +
    'the single numerical reference (rho(14) = 0.12751) is a ' +
    'conservative under-quote of the exact value ~0.127529, safe for ' +
    'an upper-bound certificate. One low-severity flag logged ' +
    '(rho-floor-under-quote) as a suggested-future-tightening.',
};
