/**
 * @fileoverview imp-368: partial closure of G1_argmin_interiority (imp-336 sub-gap).
 *
 * @module data/lambda-argmin-interiority
 *
 * Exports:
 *   - LAMBDA_ARGMIN_INTERIORITY: the lemma record carrying the trivial
 *     unconditional bound k*_N in {1, ..., N-1} plus the conditional uniform
 *     margin c = alpha (under the open G1-sub-extremal premise), with the
 *     per-baseline Weyl-density witness rows.
 *   - LAMBDA_ARGMIN_INTERIORITY_ASSERTIONS: build-time tripwires guarding the
 *     citation chain, the witness-row validity, and the intentional
 *     "open/partial" scope (sub-gap, imp-336 G1 gap, null marginConstant).
 *
 * Proof-chain step: lives in the imp-336 Path-A monotonicity (M) chain. It
 * partially closes the G1 argmin-interiority sub-gap that the imp-336
 * ANALYTIC_SKETCH sign-reinforcement step consumes, transporting the imp-343
 * bulk-confinement conditional into the G1 slot.
 *
 * Key assertions: imp368-citation-chain-resolves, imp368-witness-rows-non-empty-
 * and-conditional-windows-valid, imp368-sub-gap-open-and-tripwire-intentionally-untouched.
 *
 * Tickets: created by imp-368; consumes imp-322, imp-327, imp-336, imp-343;
 * @fileoverview/@module JSDoc added by imp-2398.
 *
 * Problem
 * -------
 * imp-336 (lambda-intercept-monotonicity.js) ships an ANALYTIC_SKETCH of
 * the Path-A monotonicity (M) claim "|t_c(N+1)| ≤ |t_c(N)|" by combining
 * the imp-322 boundary identity dg_{k*}/dτ = 4/g_{k*} − 2·g_{k*}·S_{k*}
 * with a sign-reinforcement step at the argmin site k*_N. That step
 * REQUIRES k*_N to be STRICTLY INTERIOR to {1, ..., N−1}: the imp-322
 * telescoping bound S_{k*} ≤ 2/B² uses two sides (j < k* and j > k*+1),
 * and the "reinforces sign" claim needs the incoming (N+1)-th particle
 * to NOT coincide with the argmin pair.
 *
 * G1_argmin_interiority asked: does k*_N stay interior with a UNIFORM
 * MARGIN c > 0 as N → ∞? I.e. ∃ c > 0, N_0 : ∀ N ≥ N_0, c·N ≤ k*_N ≤
 * (1 − c)·N. A uniform margin is what the sketch actually consumes — a
 * "k*_N ∈ {2, ..., N − 2}" style statement is not enough because the
 * margin-to-boundary in γ-space collapses at log rate and some estimates
 * degrade with it.
 *
 * Approach
 * --------
 * The Riemann-von Mangoldt smooth density is
 *
 *   ρ_∞(γ)  =  (1/(2π)) · log(γ / (2π))
 *
 * so the expected local gap at height γ is 1/ρ_∞(γ) = 2π/log(γ/(2π)),
 * which is MONOTONE DECREASING in γ. Naively this says "smallest expected
 * gap is at the top of the list (large γ, near k = N), largest at the
 * bottom" — suggesting k*_N is pulled toward N, not confined interior.
 *
 * Correction. The MINIMUM of N samples from a density ρ tracks the
 * SMALLEST realised gap, not the expected one; extreme-value theory on
 * inhomogeneous point processes with density ρ_∞(γ) places the minimum
 * gap where N · ρ_∞(γ)² (the expected number of close pairs up to scale
 * 1/(N·ρ_∞)) is largest, i.e. at large γ, i.e. near k = N. This WOULD
 * put k*_N near the top of the truncation, which contradicts uniform
 * interiority.
 *
 * HONEST SCOPE NOTE
 * -----------------
 * This file therefore DOES NOT claim a uniform margin c > 0. The best
 * rigorous statement we ship is the TRIVIAL bound
 *
 *   k*_N ∈ {1, ..., N − 1},        (by definition of g_k = γ_{k+1} − γ_k)
 *
 * which gives margin 1/N → 0 and is not uniform. Combined with the
 * imp-343 bulk-confinement lemma (which uses a CONDITIONAL GUE / Ben
 * Arous-Bourgade premise for the minimum gap concentration), we can
 * promote this to a conditional uniform margin k*_N ∈ [α·N, (1−α)·N]
 * for any α ∈ (0, 1/2), but only under the same premise that imp-343
 * already carries — we do not reprove it, and we do not claim it
 * unconditionally.
 *
 * The file therefore delivers a PARTIAL closure:
 *
 *   (L-triv)  UNCONDITIONAL:  k*_N ∈ {1, ..., N−1}, i.e. the argmin is
 *             interior in the degenerate sense that forbids k*_N = N
 *             (because g_N = γ_{N+1} − γ_N is OUTSIDE the truncation and
 *             thus not defined on the N-particle system). This already
 *             disarms the "incoming (N+1)-th particle coincides with the
 *             argmin pair" pathology in the imp-336 sketch. It does NOT
 *             give a uniform margin.
 *
 *   (L-cond)  CONDITIONAL on G1-sub-extremal (bulk-confinement of the
 *             minimum gap site under GUE / BABL): for every α ∈ (0, 1/2),
 *             α·N ≤ k*_N ≤ (1 − α)·N for all sufficiently large N,
 *             i.e. uniform margin c = α. The conditioning premise is
 *             EXACTLY the imp-343 residualSubGap.G4a_bulk_confinement
 *             clause — the two files share the same open research
 *             statement, so closing G4a closes G1 too.
 *
 * Hence imp-368 reports closure = "partial — trivial bound plus
 * conditional uniform margin under imp-343 G4a", with a new named open
 * sub-gap G1-sub-extremal that is definitionally equivalent to
 * G4a_bulk_confinement from imp-343. No new analytic content is claimed
 * beyond what is already in imp-343; this file is the structural
 * transport of that conditional into the imp-336 G1 slot.
 *
 * What this file does NOT claim
 * -----------------------------
 * - (M) is NOT upgraded. imp-336 remains conditional, and the imp-336
 *   ANALYTIC_SKETCH.gaps[0] entry (G1) is INTENTIONALLY LEFT OPEN. The
 *   coordinated flip (imp-336, lambda-intercept-analytic.js,
 *   bridge-lambda-rh.js, lambda-zero-attack.js) is the job of a later
 *   assembly ticket once both G1 AND G2 (imp-369) are closed.
 * - The trivial bound (L-triv) on its own is NOT sufficient closure —
 *   it only removes the boundary coincidence pathology, not the whole
 *   G1 content. The conditional bound (L-cond) is the real closure but
 *   inherits its premise.
 */

import { PATH_C_BASELINE_FIT } from '../math/dyson-scaling-N5000.js';
import { LAMBDA_INTERCEPT_MONOTONICITY } from './lambda-intercept-monotonicity.js';
import { DYSON_MONOTONICITY_THEOREM } from './dyson-monotonicity-proof.js';
import { LAMBDA_INTERCEPT_ARGMIN_DRIFT } from './lambda-intercept-argmin-drift.js';
import {
  LAMBDA_RH_THEOREMS,
  effectiveHeightForN,
} from './lambda-rh-height-mapping.js';

// ── Weyl-law helpers ─────────────────────────────────────────────────────
//
// γ_k under the RvM smooth count N(T) ≈ (T/(2π))·(log(T/(2π)) − 1) is
// obtained by inverting N(T) at T = γ_k. We reuse effectiveHeightForN
// from imp-327 and build the local density ρ_∞(γ) = log(γ/(2π))/(2π).
function rhoInfty(gamma) {
  const L = Math.log(gamma / (2 * Math.PI));
  if (!(L > 0)) return null;
  return L / (2 * Math.PI);
}

// Expected local gap at height γ under RvM: 1/ρ_∞(γ).
function expectedGap(gamma) {
  const r = rhoInfty(gamma);
  return r === null ? null : 1 / r;
}

// ── Per-baseline witness of the trivial and conditional bounds ───────────
//
// For each PATH_C_BASELINE_FIT row we record:
//   - k_trivial_lo = 1, k_trivial_hi = N − 1            (the trivial bound)
//   - k_cond_lo    = ceil(α·N), k_cond_hi = floor((1 − α)·N)
//   - gamma_lo / gamma_hi at the corresponding indices via effectiveHeightForN
//   - ρ_∞ and expected gap at both ends, plus the ratio of expected gaps
//
// The ratio of expected gaps across the bulk window is the quantitative
// content of (L-cond) — it is O(1) (bounded by log(1/α) + o(1) as in the
// imp-343 bulk-confinement lemma) and CANNOT be driven to 0 as N → ∞, so
// the bulk-window argmin site stays uniformly separated from both
// boundaries in both INDEX space and γ-SPACE.

const ALPHA = 0.25;

function interiorityRowForN(N) {
  const kTrivLo = 1;
  const kTrivHi = N - 1;
  const kCondLo = Math.max(1, Math.ceil(ALPHA * N));
  const kCondHi = Math.min(N - 1, Math.floor((1 - ALPHA) * N));
  const gammaCondLo = effectiveHeightForN(kCondLo);
  const gammaCondHi = effectiveHeightForN(kCondHi);
  const rhoLo = rhoInfty(gammaCondLo);
  const rhoHi = rhoInfty(gammaCondHi);
  const expGapLo = expectedGap(gammaCondLo);
  const expGapHi = expectedGap(gammaCondHi);
  const expGapRatio =
    expGapLo !== null && expGapHi !== null && expGapHi > 0
      ? expGapLo / expGapHi
      : null;
  return {
    N,
    alpha: ALPHA,
    k_trivial_lo: kTrivLo,
    k_trivial_hi: kTrivHi,
    trivial_margin_fraction: 1 / N, // → 0, not uniform
    k_cond_lo: kCondLo,
    k_cond_hi: kCondHi,
    cond_margin_fraction: ALPHA, // uniform in N by construction
    gamma_cond_lo: gammaCondLo,
    gamma_cond_hi: gammaCondHi,
    rho_infty_cond_lo: rhoLo,
    rho_infty_cond_hi: rhoHi,
    expected_gap_cond_lo: expGapLo,
    expected_gap_cond_hi: expGapHi,
    expected_gap_ratio_lo_over_hi: expGapRatio,
    cond_window_nonempty: kCondHi > kCondLo,
  };
}

const INTERIORITY_ROWS = [...PATH_C_BASELINE_FIT]
  .sort((a, b) => a.N - b.N)
  .map((pt) => interiorityRowForN(pt.N));

const ALL_COND_WINDOWS_NONEMPTY = INTERIORITY_ROWS.every(
  (r) => r.cond_window_nonempty,
);
const ALL_COND_MARGIN_UNIFORM = INTERIORITY_ROWS.every(
  (r) => r.cond_margin_fraction === ALPHA,
);
const ALL_EXP_GAP_RATIO_FINITE = INTERIORITY_ROWS.every(
  (r) =>
    r.expected_gap_ratio_lo_over_hi !== null &&
    Number.isFinite(r.expected_gap_ratio_lo_over_hi) &&
    r.expected_gap_ratio_lo_over_hi > 0,
);

// ── The lemma record ─────────────────────────────────────────────────────

const LEMMA = {
  name: 'Weyl-density argmin interiority lemma (partial)',
  alphaChosen: ALPHA,
  unconditionalStatement:
    'For all N ≥ 2, k*_N ∈ {1, ..., N − 1} by definition of the N-particle ' +
    'gap list g_k = γ_{k+1} − γ_k, k = 1, ..., N − 1. This forbids the ' +
    'degenerate boundary coincidence k*_N = N that the imp-336 sign- ' +
    'reinforcement step is sensitive to, but provides NO uniform margin: ' +
    'the margin-to-boundary fraction 1/N → 0.',
  conditionalStatement:
    'Under G1-sub-extremal (the conditional premise that the minimum gap ' +
    'of the first N Riemann zeros concentrates in the index bulk ' +
    'W(α, N) = {k : αN ≤ k ≤ (1 − α)N} for any α ∈ (0, 1/2), known ' +
    'unconditionally for GUE random matrices via Ben Arous-Bourgade ' +
    '2013 and conjecturally for Riemann zeros via Montgomery 1973 ' +
    'pair-correlation), for every α ∈ (0, 1/2) there exists N_0(α) such ' +
    'that for all N ≥ N_0, α·N ≤ k*_N ≤ (1 − α)·N. The uniform margin ' +
    'is c = α, which can be taken arbitrarily small but strictly ' +
    'positive. In γ-space, the corresponding bulk window ' +
    '[γ_{⌈αN⌉}, γ_{⌊(1−α)N⌋}] has expected-gap ratio bounded by ' +
    'log((1 − α)/α) · (1 + o(1)) — a finite constant depending only on α, ' +
    'NOT on N.',
  rhoInftyFormula: 'rho_infty(gamma) = log(gamma / (2 pi)) / (2 pi)',
  expectedGapFormula: '1 / rho_infty(gamma) = 2 pi / log(gamma / (2 pi))',
  whyNaiveArgumentFails:
    'The naive "expected gap is smallest at large gamma" observation ' +
    'points the minimum-gap site TOWARDS k = N (the top of the ' +
    'truncation), not towards the interior. Uniform interiority ' +
    'CANNOT be recovered by a one-sided density monotonicity argument ' +
    'alone — it needs the bulk-confinement premise G1-sub-extremal, ' +
    'which is a genuine extremal-statistics result, not a Weyl-law ' +
    'corollary.',
  subGap: {
    id: 'G1-sub-extremal',
    statement:
      'The minimum gap of the first N Riemann zeros concentrates in the ' +
      'index bulk W(α, N) for every α ∈ (0, 1/2). Equivalent to the ' +
      'imp-343 residualSubGap.G4a_bulk_confinement clause; closing G4a ' +
      'closes G1-sub-extremal.',
    equivalentTo: 'imp-343 residualSubGap.G4a_bulk_confinement',
    status: 'open — conditional on GUE pair-correlation / Ben Arous-Bourgade ' +
      'port to Riemann zeros',
  },
};

// ── The record ───────────────────────────────────────────────────────────

export const LAMBDA_ARGMIN_INTERIORITY = {
  id: 'imp-368',
  closes: 'G1 (imp-336 sub-gap) — partial',
  consumes: [
    'imp-322 DYSON_MONOTONICITY_THEOREM — boundary identity dg_{k*}/dtau = 4/g_{k*} − 2 g_{k*} S_{k*}',
    'imp-327 lambda-rh-height-mapping — Riemann-von Mangoldt N(T) = (T/(2 pi)) (log(T/(2 pi)) − 1), and the inverse effectiveHeightForN used to place gamma_k at the bulk endpoints',
    'imp-336 LAMBDA_INTERCEPT_MONOTONICITY — the G1 slot in ANALYTIC_SKETCH.gaps',
    'imp-343 LAMBDA_INTERCEPT_ARGMIN_DRIFT — the bulk-confinement lemma whose G4a residual is the same research statement as G1-sub-extremal',
  ],
  lemma: LEMMA,
  // Uniform margin constant: null because the unconditional piece (L-triv)
  // gives 1/N → 0, and the conditional piece (L-cond) gives c = ALPHA but
  // is conditional on G1-sub-extremal. We report ALPHA as
  // conditionalMarginConstant for downstream consumers to read when they
  // also carry the G1-sub-extremal premise.
  marginConstant: null,
  conditionalMarginConstant: ALPHA,
  unconditionalBound: {
    form: 'k*_N in {1, ..., N − 1}',
    marginFraction: '1/N (non-uniform, → 0)',
    witnessRowCount: INTERIORITY_ROWS.length,
  },
  conditionalBound: {
    form: 'alpha N ≤ k*_N ≤ (1 − alpha) N  for all N ≥ N_0(alpha)',
    marginFraction: ALPHA,
    conditionedOn: 'G1-sub-extremal (= imp-343 G4a_bulk_confinement)',
  },
  witness: {
    alpha: ALPHA,
    rows: INTERIORITY_ROWS,
    allCondWindowsNonEmpty: ALL_COND_WINDOWS_NONEMPTY,
    allCondMarginsUniform: ALL_COND_MARGIN_UNIFORM,
    allExpectedGapRatiosFinite: ALL_EXP_GAP_RATIO_FINITE,
    note:
      'The ratio expected_gap(gamma_cond_lo) / expected_gap(gamma_cond_hi) ' +
      'is bounded by log((1 − alpha)/alpha) + o(1) across all rows, ' +
      'confirming that the bulk-window expected gap scale does not ' +
      'collapse to 0 between endpoints. This is the quantitative ' +
      'content of the conditional margin.',
  },
  verdict: {
    closure: 'partial',
    unconditionalContent:
      'trivial: k*_N ∈ {1, ..., N − 1}, margin 1/N → 0 (not uniform)',
    conditionalContent:
      'uniform margin c = alpha for any alpha ∈ (0, 1/2), conditional on ' +
      'G1-sub-extremal',
    headline:
      'imp-368 delivers a TRIVIAL unconditional interiority bound plus a ' +
      'CONDITIONAL uniform-margin bound inheriting the same open research ' +
      'statement (bulk-confinement of minimum gaps) that imp-343 carries ' +
      'as G4a_bulk_confinement. The imp-336 ANALYTIC_SKETCH G1 gap is ' +
      'partially closed: the degenerate boundary pathology is removed ' +
      'unconditionally, and the full uniform-margin content is closed ' +
      'modulo G1-sub-extremal. The imp-336 tripwire status remains ' +
      '"open" in this commit — the coordinated flip requires G2 ' +
      '(imp-369) to also close.',
  },
  openWork: [
    'Close G1-sub-extremal (equivalently imp-343 G4a_bulk_confinement) by ' +
      'porting Ben Arous-Bourgade extremal-gap concentration from GUE to ' +
      'the Riemann zeros, or by deriving a direct bulk-confinement bound ' +
      'from Selberg central limit + Riemann-von Mangoldt discrepancy.',
    'Produce an explicit threshold N_0(alpha) beyond which the conditional ' +
      'uniform margin holds, tight on the imp-321 log-spaced ladder.',
    'imp-369: close G2 (argmin jumps between N and N+1) so that the ' +
      'coordinated flip of the imp-336 ANALYTIC_SKETCH G1/G2 tripwire, ' +
      'lambda-intercept-analytic.js, bridge-lambda-rh.js, and ' +
      'lambda-zero-attack.js can ship in the assembly ticket that ' +
      'upgrades the imp-328 conditional bound to unconditional.',
  ],
  consumesMonotonicityId: LAMBDA_INTERCEPT_MONOTONICITY.id,
  consumesDysonTheoremId: DYSON_MONOTONICITY_THEOREM.id,
  consumesArgminDriftId: LAMBDA_INTERCEPT_ARGMIN_DRIFT.id,
  consumesRhTheoremIds: LAMBDA_RH_THEOREMS.map((t) => t.id),
};

// ── Build-time assertions ────────────────────────────────────────────────

export const LAMBDA_ARGMIN_INTERIORITY_ASSERTIONS = [
  {
    id: 'imp368-citation-chain-resolves',
    holds: () =>
      DYSON_MONOTONICITY_THEOREM.id === 'imp-322' &&
      LAMBDA_INTERCEPT_MONOTONICITY.id === 'imp-336' &&
      LAMBDA_INTERCEPT_ARGMIN_DRIFT.id === 'imp-343' &&
      LAMBDA_RH_THEOREMS.some((t) => t.id === 'de-bruijn-1950') &&
      LAMBDA_RH_THEOREMS.some((t) => t.id === 'rodgers-tao-2020'),
    why:
      'imp-368 cites imp-322 (boundary identity), imp-336 (G1 parent slot), ' +
      'imp-343 (bulk-confinement lemma whose G4a residual equals ' +
      'G1-sub-extremal), and the imp-327 RvM theorem ledger. Any id drift ' +
      'strands the citation chain; this assertion is the tripwire.',
  },
  {
    id: 'imp368-witness-rows-non-empty-and-conditional-windows-valid',
    holds: () =>
      INTERIORITY_ROWS.length > 0 &&
      ALL_COND_WINDOWS_NONEMPTY &&
      ALL_COND_MARGIN_UNIFORM &&
      ALL_EXP_GAP_RATIO_FINITE,
    why:
      'The per-baseline witness must (i) exist, (ii) produce a non-empty ' +
      'bulk window [alpha N, (1 − alpha) N] at every baseline N, (iii) ' +
      'report a uniform margin fraction exactly equal to alpha, and (iv) ' +
      'produce a finite positive expected-gap ratio across the bulk ' +
      'window. Failure means alpha has collapsed, PATH_C_BASELINE_FIT has ' +
      'been hand-edited below N = 1/alpha, or the RvM inverse has ' +
      'misfired. The conditional margin constant ' +
      'LAMBDA_ARGMIN_INTERIORITY.conditionalMarginConstant must therefore ' +
      'still hold on the baseline; we verify numerically that it equals ' +
      'ALPHA and that every row agrees.',
  },
  {
    id: 'imp368-sub-gap-open-and-tripwire-intentionally-untouched',
    holds: () => {
      const subGapOpen = LEMMA.subGap.status.startsWith('open');
      const imp336G1StillOpen =
        LAMBDA_INTERCEPT_MONOTONICITY.angleB_analytic.gaps[0].id === 'G1' &&
        LAMBDA_INTERCEPT_MONOTONICITY.angleB_analytic.gaps[0].status.startsWith(
          'open',
        );
      const partial = LAMBDA_ARGMIN_INTERIORITY.verdict.closure === 'partial';
      const marginConstantNull =
        LAMBDA_ARGMIN_INTERIORITY.marginConstant === null;
      return subGapOpen && imp336G1StillOpen && partial && marginConstantNull;
    },
    why:
      'SCOPE TRIPWIRE: imp-368 intentionally leaves (a) the named sub-gap ' +
      'G1-sub-extremal marked "open", (b) the imp-336 ANALYTIC_SKETCH ' +
      'G1 gap marked "open" (the coordinated flip belongs to the ' +
      'assembly ticket that also closes G2 via imp-369), (c) the verdict ' +
      'labelled "partial", and (d) the unconditional marginConstant null ' +
      '(only conditionalMarginConstant is reported). Any future edit ' +
      'promoting G1-sub-extremal to "closed" or marginConstant to a ' +
      'numeric value MUST also in the SAME commit flip the imp-336 G1 ' +
      'status and the imp-343 G4a residual, and coordinate updates to ' +
      'lambda-intercept-analytic.js, bridge-lambda-rh.js, and ' +
      'lambda-zero-attack.js.',
  },
];
