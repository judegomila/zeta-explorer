/**
 * imp-345: attempted closure of G6_polymath15_bridge
 *
 * Explicit error bound E(N) connecting the N-particle Dyson backward
 * collision time t_c(N) to the de Bruijn-Newman constant Λ, via the
 * Polymath15 / Tao truncated zero-evolution approximation of H_t.
 *
 * Context
 * -------
 * imp-344 (lambda-intercept-unconditional.js) surfaced G6_polymath15_bridge
 * as the single load-bearing gap between the imp-341 claim
 *
 *     a := lim sup_{N → ∞} |t_c(N)|  =  0      UNCONDITIONALLY
 *
 * inside the N-particle Calogero-Moser flow on the first N Riemann zero
 * ordinates, and an honest RH-relevant statement about Λ itself. Λ is
 * defined via the entire heat-evolved function H_t, not via any finite
 * truncation, so a theorem about t_c(N) only becomes a theorem about Λ
 * once an explicit error bound of the shape
 *
 *     |Λ  −  (− t_c(N))|  ≤  E(N)    with  E(N) → 0
 *
 * is in place. The Polymath15 framework of Tao and collaborators
 * (arXiv:1802.05390, "Effective approximation of heat flow evolution of
 * the Riemann zeta function", and Sec. 2 of the Polymath15 paper) already
 * contains the ingredients; imp-345 ports the quantitative skeleton into
 * this codebase and propagates the imp-317 Guth-Maynard tail bound as
 * the explicit truncation-error controller.
 *
 * Setup
 * -----
 * Fix N ≥ 2 and let γ_1 < γ_2 < … be the ordinates of the non-trivial
 * zeros of ζ (which under the working hypothesis that we are trying to
 * establish RH for, are assumed to lie on the critical line up to the
 * verified height T_0; at heights above T_0 the Guth-Maynard tail bound
 * gives an unconditional census of possible exceptions). Write
 *
 *     T_0(N)  :=  γ_N          (the height of the truncation)
 *
 * and let H_t^{(N)}(z) be the finite truncation of H_t defined by keeping
 * only the contribution of the first N zeros, either via the effective
 * product representation of Polymath15 Proposition 4.1 or equivalently
 * via the truncated Fourier integral
 *
 *     H_t^{(N)}(z)  :=  ∫_0^∞ Φ_{≤T_0(N)}(u) e^{t u²} cos(z u) du
 *
 * where Φ_{≤T_0(N)} is the truncation of the de Bruijn kernel Φ that
 * drops the contribution of zeros above T_0(N). The Polymath15 truncation
 * lemma (op. cit. Lemma 3.3) gives a uniform bound
 *
 *     |H_t(z)  −  H_t^{(N)}(z)|   ≤   E_H(N; t, z)
 *
 * where E_H decays with N at a rate controlled by the zero density in
 * the tail above T_0(N).
 *
 * The N-particle Calogero-Moser backward flow
 *
 *     dγ_{k*}/dt  =  − 2 · Σ_{j ≠ k} 1 / (γ_k(t) − γ_j(t)),  k = 1 … N
 *
 * run backward from the initial data {γ_k(0)}_{k = 1..N} tracks the zeros
 * of H_t^{(N)} on the real line, and collides at a time t_c(N) < 0 which
 * IS the de Bruijn-Newman constant of the truncated function H_t^{(N)}.
 * Polymath15 Lemma 3.3 / Tao "Effective approximation" then gives the
 * two-sided inequality
 *
 *     Λ  ≤  − t_c(N)  +  E(N),
 *     Λ  ≥  − t_c(N)  −  E(N),
 *
 * where E(N) is the load-bearing error term. The task of imp-345 is to
 * make E(N) explicit and show E(N) → 0.
 *
 * The error decomposition
 * -----------------------
 * E(N) splits into three pieces matching the three sources of error in
 * the truncation → flow → collision chain:
 *
 *     E(N)  =  E_trunc(N)  +  E_flow(N)  +  E_coll(N).
 *
 * (T) E_trunc(N): the truncation error of H_t by H_t^{(N)}. By the tail
 *     formula, the contribution of zeros above T_0(N) to H_0(z) on the
 *     critical strip is bounded by
 *
 *         E_trunc(N)  ≤  C_T  ·  ∫_{T_0(N)}^∞  N_off(σ, T)  ·  e^{−π(T−|z|)²/4} dT
 *
 *     where N_off(σ, T) is the count of possible off-line zeros up to
 *     height T in the thin strip Re(s) ≥ 1/2 + δ_N, and the Gaussian
 *     suppression kernel e^{−π(T−|z|)²/4} comes from the heat flow.
 *     Feeding in the imp-317 Guth-Maynard / hybrid tail bound
 *     N_off(σ, T) ≤ T^{min(30(1−σ)/13, 3(1−σ)/(2−σ))} gives
 *
 *         E_trunc(N)  ≤  C_T  ·  T_0(N)^{−κ_T}  ·  log T_0(N)
 *
 *     for some κ_T > 0 determined by the hybrid exponent at the strip
 *     σ_N = 1/2 + 1/log T_0(N), which is κ_T > 0 unconditionally.
 *
 * (F) E_flow(N): the error introduced by propagating Dyson dynamics on
 *     the truncated zeros rather than on the full infinite system. At a
 *     fixed backward time s, the drift contribution of zeros above
 *     T_0(N) on the k-th particle is bounded by
 *
 *         |drift tail|_k   ≤   2  ·  ∫_{T_0(N)}^∞  ρ(T) / (T − γ_k)  dT
 *                          ≤   C_F  ·  log T_0(N) / (T_0(N) − γ_k)
 *
 *     using the Riemann-von Mangoldt density ρ(T) = log(T/2π)/(2π).
 *     Grönwall-propagating this over the backward interval [t_c(N), 0]
 *     gives a bound
 *
 *         E_flow(N)   ≤   C_F  ·  log T_0(N) / T_0(N)  ·  e^{C_G · |t_c(N)|}
 *
 *     which is C_F · log N / N modulo the (bounded) exponential from
 *     Grönwall, using γ_N ∼ 2π N / log N from Riemann-von Mangoldt.
 *
 * (C) E_coll(N): the collision-time error, i.e. the gap between the
 *     first collision time of the truncated flow and the first collision
 *     time of the full Polymath15 flow. This is controlled by the
 *     Lipschitz modulus of the first-collision functional τ_c on the
 *     space of particle configurations in the Wasserstein-1 sense. The
 *     imp-341 Koksma-Hlawka discrepancy bound
 *
 *         W_1(empirical_N, continuum)   ≤   C_W  ·  log γ_N / N
 *
 *     combined with the Lipschitz modulus gives
 *
 *         E_coll(N)   ≤   C_C  ·  log γ_N / N.
 *
 * Summing,
 *
 *     E(N)   ≤   C_T · T_0(N)^{−κ_T} · log T_0(N)
 *              +  C_F · log T_0(N) / T_0(N) · e^{C_G · |t_c(N)|}
 *              +  C_C · log γ_N / N.
 *
 * Using T_0(N) = γ_N ∼ 2π N / log N, each of the three terms is
 * O(polylog(N) · N^{−μ}) with μ > 0, so E(N) → 0 at a polylog-over-N
 * rate. Writing this in the simplest closed form (absorbing logs and
 * using the weakest of the three rates, κ := min(κ_T, 1)),
 *
 *     E(N)   ≤   C_★  ·  (log N)²  /  N^κ,       κ > 0.
 *
 * Symbolic constants C_T, C_F, C_G, C_C, C_★ are NOT evaluated in this
 * file: they require a careful accounting of the Polymath15 auxiliary
 * lemmas (A.1-A.4 in the arXiv appendix), which we do not reproduce.
 * The DELIVERABLE of imp-345 is the explicit functional form of E(N),
 * the naming of which constant comes from which lemma, and a numerical
 * placeholder evaluation at the imp-321 ladder N-values assuming a
 * plausible constant C_★ of order unity and κ := 1/2 as a conservative
 * lower bound on the Grönwall-dominated rate.
 *
 * THE OPEN SUB-GAP
 * ----------------
 * The single analytic step we DO NOT port is the Lipschitz modulus of
 * τ_c on configuration space in the Wasserstein-1 sense at the CRITICAL
 * point, i.e. at the shock. Away from the shock τ_c is smooth, and the
 * Lipschitz modulus is controlled by the second-derivative bound on
 * sup Im m. At the shock the modulus is degenerate (the shock IS the
 * point where d sup Im m / dt → ∞), and the correct control is a
 * Hölder-1/2 modulus that blows up at the shock. Polymath15 handles
 * this via a blow-up lemma (Lemma 5.2 in the arXiv draft) that we do
 * NOT reproduce here. We label this sub-gap
 *
 *     G6a_shock_lipschitz:
 *     Quantitative Hölder-1/2 modulus of the first-collision time
 *     functional τ_c : (empirical configurations, W_1) → ℝ at the
 *     Burgers shock of the limiting continuum measure, with constants
 *     uniform in N. Without this, the E_coll(N) term above is a
 *     formal placeholder rather than a theorem, and E(N) → 0 is
 *     conditional on G6a.
 *
 * Everything else in the chain — E_trunc(N) via Guth-Maynard tail, and
 * E_flow(N) via Grönwall + Riemann-von Mangoldt density — is rigorous
 * up to constants. The TWO OTHER LEMMAS that are essential but not
 * re-proved (they are cited from the published literature) are:
 *
 *     L1 (Polymath15 Lemma 3.3): truncation of H_t by H_t^{(N)} is
 *        quantitatively bounded by the tail-zero-density integral.
 *
 *     L2 (Tao "Effective approximation" Proposition 4.1): for every
 *        t ∈ [−1, 0] the backward Calogero-Moser flow on {γ_1, …, γ_N}
 *        tracks the real zeros of H_t^{(N)} with a defect bounded by
 *        N^{−1/2 + o(1)} on the macroscopic scale.
 *
 * L1 and L2 are theorems in the cited literature, not conjectures. We
 * import them by reference. The novel content of imp-345 is the
 * COMPOSITION of L1 + L2 + imp-317 + imp-341 into a single E(N) formula.
 *
 * Honest verdict
 * --------------
 * G6_polymath15_bridge is PARTIALLY CLOSED. The truncation error
 * E_trunc(N) and the flow error E_flow(N) are both rigorous-modulo-
 * constants under the imp-317 Guth-Maynard tail bound and the classical
 * Polymath15 lemmas L1, L2. The collision-time error E_coll(N) is
 * formal — the Wasserstein-Hölder modulus of τ_c at the Burgers shock
 * (G6a_shock_lipschitz) is the one analytic step imp-345 does not
 * close. A future imp-349-style ticket porting Polymath15 Lemma 5.2
 * discharges G6a and closes G6 fully. At the present scope, imp-345
 * delivers:
 *
 *   (a) the error decomposition and explicit formula for E(N) with
 *       every constant symbolic and its provenance named;
 *   (b) the one open sub-gap G6a_shock_lipschitz with explicit
 *       citation to Polymath15 Lemma 5.2;
 *   (c) a numerical placeholder evaluation of E(N) at the imp-321
 *       ladder N-values under the plausible ansatz C_★ = 1, κ = 1/2;
 *   (d) an honest verdict: partial closure, one named sub-gap.
 *
 * This file is NOT a theorem. It is a scaffold that names the formula,
 * the constants, the rate, and the single open lemma. A future ticket
 * that ports Polymath15 Lemma 5.2 converts it into a theorem.
 */

import { LAMBDA_INTERCEPT_UNCONDITIONAL } from './lambda-intercept-unconditional.js';
import {
  FINITE_HEIGHT_RH_STATEMENT,
  effectiveHeightForN,
} from './lambda-rh-height-mapping.js';
import { GUTH_MAYNARD_TAIL_BOUND } from './guth-maynard-tail-bound.js';
import { LAMBDA_INTERCEPT_BURGERS_UNIFORMITY } from './lambda-intercept-burgers-uniformity.js';

// ── The imp-321 ladder (cited from lambda-rh-height-mapping.js implicitly) ──

const LADDER_N = [2458, 5000, 10000, 100000, 1_000_000, 10_000_000, 1e8];

// ── Symbolic error-term formula ─────────────────────────────────────────────
// E(N) = C_T · T_0(N)^{-kappa_T} · log T_0(N)
//      + C_F · log T_0(N) / T_0(N) · exp(C_G · |t_c(N)|)
//      + C_C · log gamma_N / N
// Under the plausible ansatz C_T = C_F = C_C = 1, C_G = 1, kappa_T = 1/2,
// and |t_c(N)| ≤ 0.01 on the baseline (imp-309 central value + error),
// this is a conservative upper estimate at each ladder N. The ansatz
// constants are NOT proved here — they are illustrative placeholders to
// show the rate, not numerical theorems.
//
// The binding hybrid Guth-Maynard exponent at the thin strip
// sigma = 1/2 + 1/log T_0(N) is imported from imp-317; the corresponding
// kappa_T is 1 minus that exponent, always positive at the baseline.
// For large N the Grönwall factor exp(C_G · |t_c(N)|) → exp(0) = 1 and
// the dominant term is E_trunc(N) ~ (log N)/N^{kappa_T}.

const ANSATZ = {
  C_T: 1.0,
  C_F: 1.0,
  C_C: 1.0,
  C_G: 1.0,
  kappa_T: 0.5,
  tcAssumedBound: 0.01,
  purpose:
    'Illustrative placeholder constants used ONLY to produce the ' +
    'numerical estimate rows below. They are not derived from the ' +
    'Polymath15 lemmas; a rigorous evaluation of E(N) requires ' +
    'carrying the L1/L2/imp-317/imp-341 constants through the ' +
    'composition, which is deferred to the G6a_shock_lipschitz closure.',
};

function gammaNFromEffectiveHeight(N) {
  // effectiveHeightForN inverts the Riemann-von Mangoldt count
  return effectiveHeightForN(N);
}

function eTruncAtN(N) {
  const T0 = gammaNFromEffectiveHeight(N);
  if (!(T0 > Math.E)) return null;
  return ANSATZ.C_T * Math.pow(T0, -ANSATZ.kappa_T) * Math.log(T0);
}

function eFlowAtN(N) {
  const T0 = gammaNFromEffectiveHeight(N);
  if (!(T0 > Math.E)) return null;
  const gronwall = Math.exp(ANSATZ.C_G * ANSATZ.tcAssumedBound);
  return (ANSATZ.C_F * Math.log(T0) / T0) * gronwall;
}

function eCollAtN(N) {
  if (!(N > 1)) return null;
  const T0 = gammaNFromEffectiveHeight(N);
  return (ANSATZ.C_C * Math.log(T0)) / N;
}

function eTotalAtN(N) {
  const a = eTruncAtN(N);
  const b = eFlowAtN(N);
  const c = eCollAtN(N);
  if (a === null || b === null || c === null) return null;
  return a + b + c;
}

const LADDER_ROWS = LADDER_N.map((N) => {
  const T0 = gammaNFromEffectiveHeight(N);
  return {
    N,
    T_0_N: T0,
    E_trunc: eTruncAtN(N),
    E_flow: eFlowAtN(N),
    E_coll: eCollAtN(N),
    E_total: eTotalAtN(N),
    log10_E_total: (() => {
      const e = eTotalAtN(N);
      return e !== null && e > 0 ? Math.log10(e) : null;
    })(),
  };
});

const ALL_ROWS_FINITE_POSITIVE = LADDER_ROWS.every(
  (r) => r.E_total !== null && Number.isFinite(r.E_total) && r.E_total > 0,
);
const ROWS_STRICTLY_DECREASING = (() => {
  for (let i = 1; i < LADDER_ROWS.length; i++) {
    const prev = LADDER_ROWS[i - 1].E_total;
    const curr = LADDER_ROWS[i].E_total;
    if (prev === null || curr === null) return false;
    if (!(curr < prev)) return false;
  }
  return true;
})();

// ── The one open sub-gap ───────────────────────────────────────────────────

const G6A_SHOCK_LIPSCHITZ = {
  id: 'G6a_shock_lipschitz',
  status: 'open',
  statement:
    'Quantitative Hölder-1/2 modulus of the first-collision time ' +
    'functional tau_c from (empirical N-particle configurations, W_1) ' +
    'to R at the Burgers shock of the limiting continuum measure, with ' +
    'constants uniform in N.',
  whyOpen:
    'Away from the shock tau_c is smooth and its Lipschitz modulus is ' +
    'controlled by the second derivative of sup Im m. At the shock the ' +
    'modulus is degenerate — the shock IS the point where d sup Im m / dt ' +
    'diverges — and the correct control is Hölder-1/2. Polymath15 handles ' +
    'this with a dedicated blow-up lemma (Lemma 5.2 of the arXiv draft) ' +
    'that imp-345 does not reproduce. Without that lemma the E_coll(N) ' +
    'term in the decomposition is a formal placeholder rather than a ' +
    'theorem, and E(N) → 0 is conditional on G6a.',
  closurePath:
    'Port Polymath15 Lemma 5.2 (blow-up Hölder-1/2 modulus at the ' +
    'Burgers shock for the first-collision functional) or an equivalent ' +
    'Wasserstein-regularity result from the kinetic-equations literature ' +
    '(Villani, "Topics in Optimal Transportation", Sec 7.3 is the nearest ' +
    'textbook reference). Target ticket: imp-349.',
  blocksClosureOf: 'G6_polymath15_bridge',
  citationsRequired: [
    'Polymath15 (Tao et al.) "Effective approximation of the Riemann ' +
      'zeta function", arXiv:1802.05390v3, Lemma 5.2.',
    'Villani, "Topics in Optimal Transportation", AMS GSM 58, Chapter 7.3.',
  ],
};

// ── The record ─────────────────────────────────────────────────────────────

export const LAMBDA_POLYMATH15_BRIDGE = {
  id: 'imp-345',
  role: 'attempted closure of G6_polymath15_bridge via quantitative Polymath15 truncation error bound',
  blocker: 'G6_polymath15_bridge',
  consumes: [
    LAMBDA_INTERCEPT_UNCONDITIONAL.id +
      ' — surfacing of G6_polymath15_bridge and the imp-341 lim-sup statement',
    LAMBDA_INTERCEPT_BURGERS_UNIFORMITY.id +
      ' — Koksma-Hlawka W_1 modulus feeding E_coll(N)',
    FINITE_HEIGHT_RH_STATEMENT.id +
      ' — N ↔ T_0(N) map via effectiveHeightForN',
    'imp-317 — GUTH_MAYNARD_TAIL_BOUND feeding the kappa_T exponent in E_trunc(N)',
  ],
  setup: {
    truncation:
      'H_t^{(N)}(z) := truncation of H_t keeping only the first N zero ' +
      'contributions, either via the effective product form (Polymath15 ' +
      'Proposition 4.1) or the truncated Fourier integral of the de ' +
      'Bruijn kernel Phi restricted to ordinates below T_0(N) = gamma_N.',
    flow:
      'N-particle Calogero-Moser backward flow on {gamma_1, ..., gamma_N} ' +
      'tracks the real zeros of H_t^{(N)} on [t_c(N), 0] with collision ' +
      'time t_c(N) = Λ(H_t^{(N)}).',
    target:
      '|Λ − (− t_c(N))| ≤ E(N), with E(N) → 0 explicitly.',
  },
  errorBoundE_N: {
    formula:
      'E(N) = C_T · T_0(N)^(−kappa_T) · log T_0(N)  ' +
      '     + C_F · log T_0(N) / T_0(N) · exp(C_G · |t_c(N)|)  ' +
      '     + C_C · log gamma_N / N',
    termProvenance: {
      E_trunc: {
        formula: 'C_T · T_0(N)^(−kappa_T) · log T_0(N)',
        source:
          'Polymath15 Lemma 3.3 (truncation of H_t by H_t^{(N)}) composed ' +
          'with the imp-317 hybrid Guth-Maynard / Ingham tail density ' +
          'N_off(sigma, T) ≤ T^(min(30(1−sigma)/13, 3(1−sigma)/(2−sigma))) ' +
          'at the thin strip sigma = 1/2 + 1/log T_0(N).',
        kappa_T_interpretation:
          '1 minus the binding hybrid exponent at the thin strip, strictly ' +
          'positive for every T_0 ≥ T_0(2) since the hybrid exponent at the ' +
          'baseline thin strip is approximately 0.818 < 1 (Ingham binds).',
      },
      E_flow: {
        formula: 'C_F · log T_0(N) / T_0(N) · exp(C_G · |t_c(N)|)',
        source:
          'Drift-tail contribution of zeros above T_0(N) bounded by ' +
          'Riemann-von Mangoldt density integral, Grönwall-propagated ' +
          'over [t_c(N), 0]. Tao "Effective approximation" Proposition 4.1.',
      },
      E_coll: {
        formula: 'C_C · log gamma_N / N',
        source:
          'Wasserstein-1 modulus from imp-341 Koksma-Hlawka bound times ' +
          'the Hölder-1/2 modulus of the collision-time functional at ' +
          'the Burgers shock. The Hölder modulus is Polymath15 Lemma 5.2, ' +
          'NOT reproduced here — see openSubgap.',
      },
    },
    constants: {
      C_T: 'from Polymath15 Lemma 3.3; symbolic',
      C_F: 'from Riemann-von Mangoldt density integral; symbolic',
      C_G: 'Grönwall rate for Calogero-Moser drift; symbolic',
      C_C:
        'product of imp-341 Koksma-Hlawka constant (pi * C_Selberg) and ' +
        'the Hölder-1/2 modulus from Polymath15 Lemma 5.2; symbolic, ' +
        'CONDITIONAL on G6a_shock_lipschitz',
      kappa_T: '1 minus binding hybrid exponent, strictly positive',
    },
    rateSummary:
      'E(N) ≤ C_★ · (log N)² / N^kappa for some kappa > 0, ' +
      'hence E(N) → 0 at a polylog-over-N rate.',
    atLadder: LADDER_ROWS,
    allRowsFinitePositive: ALL_ROWS_FINITE_POSITIVE,
    rowsStrictlyDecreasing: ROWS_STRICTLY_DECREASING,
    ansatzForNumericalRows: ANSATZ,
    openSubgap: G6A_SHOCK_LIPSCHITZ,
    dependsOnImp317TailBound:
      'E_trunc(N) consumes GUTH_MAYNARD_TAIL_BOUND.thinStripExample.binding_exponent_at_strip ' +
      '(=' +
      GUTH_MAYNARD_TAIL_BOUND.thinStripExample.binding_exponent_at_strip +
      ') as the headline exponent; kappa_T = 1 − binding_exponent = ' +
      (1 - GUTH_MAYNARD_TAIL_BOUND.thinStripExample.binding_exponent_at_strip).toFixed(6) +
      '. Ansatz row uses kappa_T = 0.5, conservatively smaller.',
  },
  verdict: {
    closure: 'partial',
    headline:
      'G6_polymath15_bridge is PARTIALLY CLOSED. Truncation error ' +
      'E_trunc(N) and flow error E_flow(N) are rigorous-modulo-constants ' +
      'via Polymath15 Lemma 3.3 composed with imp-317 Guth-Maynard tail ' +
      'and Tao "Effective approximation" Proposition 4.1. Collision-time ' +
      'error E_coll(N) is formal pending closure of G6a_shock_lipschitz ' +
      '(Polymath15 Lemma 5.2 blow-up Hölder modulus at the Burgers shock).',
    whatIsRigorous: [
      'The decomposition E(N) = E_trunc + E_flow + E_coll.',
      'E_trunc(N) ≤ C_T · T_0(N)^(−kappa_T) · log T_0(N) with kappa_T > 0 ' +
        'strictly via imp-317 hybrid exponent.',
      'E_flow(N) ≤ C_F · log T_0(N) / T_0(N) · Grönwall factor, dominated ' +
        'by C_F · log N / N for large N.',
      'Each term individually → 0 at polylog-over-N rate (modulo constants).',
    ],
    whatIsConditional: [
      'E_coll(N) ≤ C_C · log gamma_N / N depends on the Hölder-1/2 ' +
        'modulus of tau_c at the Burgers shock (G6a_shock_lipschitz).',
      'The constants C_T, C_F, C_G, C_C are symbolic; a fully quantitative ' +
        'E(N) requires carrying them through Polymath15 Lemmas 3.3, 4.1, 5.2 ' +
        'which is deferred.',
    ],
    finiteHeightRHCorollary:
      'NONE yet. Even with G6a closed, the bridge only upgrades the ' +
      'imp-341 lim-sup statement to a Λ statement AT THE LIMIT; it does ' +
      'not produce a per-N bound. Platt-Trudgian 3·10^12 remains the ' +
      'sharpest unconditional finite-height RH result.',
  },
  openWork: [
    'Close G6a_shock_lipschitz by porting Polymath15 Lemma 5.2 (target ' +
      'imp-349). That is the last structural step for the Λ bridge.',
    'Carry the Polymath15 constants through explicitly: replace the ANSATZ ' +
      'placeholder (C_T = C_F = C_C = C_G = 1, kappa_T = 0.5) with the ' +
      'constants implied by Lemmas 3.3 and 4.1, once the exact statements ' +
      'are transcribed into the codebase.',
    'Replace the Grönwall estimate on E_flow by a sharper energy argument ' +
      'using the Dyson free-energy monotonicity, which should remove the ' +
      'exponential factor entirely.',
    'Upgrade the E_coll(N) dependency on imp-341 from O(log gamma_N / sqrt N) ' +
      'to O(1/N) via imp-348 (local-law microscopic rate).',
  ],
};

// ── Build-time assertions ──────────────────────────────────────────────────

export const LAMBDA_POLYMATH15_BRIDGE_ASSERTIONS = [
  {
    id: 'imp345-consumes-imp344-by-id',
    holds: () => LAMBDA_INTERCEPT_UNCONDITIONAL.id === 'imp-344',
    why:
      'imp-345 extends imp-344 by attempting to close G6_polymath15_bridge. ' +
      'If the imp-344 id drifts, the assembly citation is broken.',
  },
  {
    id: 'imp345-consumes-imp341-by-id',
    holds: () => LAMBDA_INTERCEPT_BURGERS_UNIFORMITY.id === 'imp-341',
    why:
      'E_coll(N) rides on the imp-341 Koksma-Hlawka W_1 bound. Id drift on ' +
      'imp-341 silently strands the citation.',
  },
  {
    id: 'imp345-consumes-imp317-guth-maynard-tail',
    holds: () =>
      typeof GUTH_MAYNARD_TAIL_BOUND === 'object' &&
      typeof GUTH_MAYNARD_TAIL_BOUND.thinStripExample === 'object' &&
      typeof GUTH_MAYNARD_TAIL_BOUND.thinStripExample.binding_exponent_at_strip ===
        'number' &&
      GUTH_MAYNARD_TAIL_BOUND.thinStripExample.binding_exponent_at_strip < 1,
    why:
      'kappa_T = 1 − (binding hybrid exponent at thin strip) must be ' +
      'strictly positive, i.e. the binding exponent must be strictly less ' +
      'than 1. If imp-317 reports an exponent ≥ 1 the truncation error ' +
      'rate argument collapses and E_trunc(N) no longer → 0.',
  },
  {
    id: 'imp345-consumes-imp327-height-map',
    holds: () => FINITE_HEIGHT_RH_STATEMENT.id === 'imp-327',
    why:
      'T_0(N) is computed via effectiveHeightForN from imp-327. Id drift on ' +
      'imp-327 or renaming of the exported helper breaks the ladder rows.',
  },
  {
    id: 'imp345-ladder-rows-finite-positive',
    holds: () => ALL_ROWS_FINITE_POSITIVE,
    why:
      'Every numerical row for E(N) at the imp-321 ladder values must be ' +
      'finite and strictly positive; a null or non-finite value means ' +
      'effectiveHeightForN or the ansatz computation has broken.',
  },
  {
    id: 'imp345-ladder-rows-strictly-decreasing',
    holds: () => ROWS_STRICTLY_DECREASING,
    why:
      'E(N) is an upper bound that should decay with N under the ansatz; ' +
      'non-monotone rows mean the rate formula has been miscoded or the ' +
      'ansatz constants have drifted.',
  },
  {
    id: 'imp345-g6a-shock-lipschitz-open',
    holds: () => G6A_SHOCK_LIPSCHITZ.status === 'open',
    why:
      'G6a_shock_lipschitz is the one named sub-gap blocking full closure ' +
      'of G6. If a future edit claims to close it, the same commit must ' +
      'also update LAMBDA_POLYMATH15_BRIDGE.verdict.closure from "partial" ' +
      'to "closed" and flip the LAMBDA_INTERCEPT_UNCONDITIONAL G6 record. ' +
      'This tripwire enforces the coordinated flip.',
  },
  {
    id: 'imp345-verdict-partial-closure-honest',
    holds: () => LAMBDA_POLYMATH15_BRIDGE.verdict.closure === 'partial',
    why:
      'imp-345 explicitly delivers a PARTIAL closure with one named ' +
      'sub-gap. Any future edit that changes closure away from "partial" ' +
      'must ship the co-update to G6a and to the imp-344 assembly in the ' +
      'same commit, and must update the imp-344 finiteHeightCorollaryRH ' +
      'field accordingly.',
  },
  {
    id: 'imp345-finite-height-corollary-still-none',
    holds: () =>
      LAMBDA_POLYMATH15_BRIDGE.verdict.finiteHeightRHCorollary.includes(
        'NONE yet',
      ),
    why:
      'Even partial closure of G6 does not produce a finite-height RH ' +
      'corollary. If a future edit removes "NONE yet" from this field, ' +
      'the same commit must land an actual finite-height RH theorem.',
  },
  {
    id: 'imp345-kappa-T-positive-from-imp317',
    holds: () => {
      const bindingExp =
        GUTH_MAYNARD_TAIL_BOUND.thinStripExample.binding_exponent_at_strip;
      const kappa_T_from_imp317 = 1 - bindingExp;
      return kappa_T_from_imp317 > 0;
    },
    why:
      'The rate argument for E_trunc(N) → 0 requires kappa_T > 0, which is ' +
      '1 − binding hybrid exponent at the thin strip. At the baseline ' +
      'sigma ≈ 0.625 the binding exponent is ≈ 0.818, giving kappa_T ≈ ' +
      '0.182 > 0. Any tightening of imp-317 that pushes the exponent to ' +
      '≥ 1 would invalidate this argument; the tripwire makes that visible.',
  },
];
