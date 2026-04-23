/**
 * @module dyson-burgers-shock
 * @jsdocTag imp-815+842+844+846+884+886
 *
 * imp-338: Dyson-Burgers shock time for the Riemann-von Mangoldt density
 *
 * imp-328 candidate (ii). Dyson 1962's empirical Stieltjes transform
 *
 *     m_N(z, t) = (1/N) · Σ_k 1 / (γ_k(t) − z)
 *
 * of the N-particle Brownian-motion eigenvalue flow satisfies, in the
 * N → ∞ limit, the inviscid complex Burgers PDE
 *
 *     ∂_t m + 2 m ∂_z m = 0.
 *
 * With u := 2m this is the scalar inviscid Burgers equation u_t + u u_z = 0,
 * whose solution along characteristics is u(z, t) = u_0(z_0) on the line
 * z = z_0 + u_0(z_0) · t. Characteristics cross when the Jacobian vanishes,
 * and for the BACKWARD direction τ = −t > 0 the earliest crossing happens at
 *
 *     τ_shock = inf_{z_0 ∈ ℂ_+} (−Im z_0) / (2 · Im m_0(z_0)).
 *
 * Equivalently, since m_0(x + iy) = ∫ ρ(γ)/(γ − x − iy) dγ has
 *
 *     Im m_0(x + iy) = y · ∫ ρ(γ) / ((γ − x)² + y²) dγ,
 *
 * we get
 *
 *     τ_shock = 1 / (2 · sup_{x, y > 0} ∫ ρ(γ) / ((γ − x)² + y²) dγ).
 *
 * For a SMOOTH non-vanishing density ρ_∞, taking y → 0⁺ at any point x where
 * ρ_∞(x) > 0 sends the denominator integral to π ρ_∞(x) / y → ∞, so
 * τ_shock → 0. The shock forms instantly in the continuum limit: the whole
 * support IS already the shock. Under the assumption that the N-particle
 * empirical Stieltjes transform m_N converges to m_∞ uniformly enough that
 * the backward collision time is continuous in the limit, we get
 *
 *     a := lim sup_{N → ∞} |t_c(N)|  =  τ_shock(ρ_∞)  =  0.
 *
 * That IS the ticket's target closed-form analytic a. It is not a theorem
 * because the uniformity-of-convergence gap is open — Dyson's derivation is
 * asymptotic in distribution, not uniform in (z, t) near the real axis where
 * the collision happens. We flag the gap explicitly and report the finite-N
 * Burgers-shock surrogate that this PDE prediction gives at each anchor N of
 * PATH_C_BASELINE_FIT.
 *
 * Finite-N surrogate
 * ------------------
 * At finite N the empirical Stieltjes transform has a discrete regularization
 * scale: below the mean spacing y_N ≈ 1 / ρ_∞(γ_N) = 2π / log(γ_N / 2π), the
 * Riemann sum defining m_N is dominated by the nearest pole and the Burgers
 * continuum description breaks down. Clipping the characteristic-crossing
 * calculation at y = y_N gives the finite-N surrogate
 *
 *     τ_shock(N)  ≈  y_N / (2 π · ρ_∞(γ_N))
 *                 =  (2π / log(γ_N / 2π)) / (2π · log(γ_N / 2π) / (2π))
 *                 =  2π / log²(γ_N / 2π),
 *
 * with γ_N recovered from the Riemann-von Mangoldt counting function
 * N(T) ≈ (T / 2π) · (log(T / 2π) − 1) by Newton iteration.
 *
 * This surrogate decays to 0 as N → ∞ (as 1 / log² N to leading order) and
 * is therefore compatible with a = 0, but it decays MUCH slower than the
 * empirically observed |t_c(N)| on PATH_C_BASELINE_FIT. The surrogate is
 * therefore a loose closed-form upper envelope, not a tight prediction: it
 * supports the N → ∞ limit statement a = 0 under uniformity, and it is
 * decisively looser than the imp-323 OLS extrapolation at finite N. We
 * report both the surrogate and the ratio to the observed PATH_C_BASELINE_FIT
 * entries so future tightening of either side is visible.
 *
 * What this file delivers
 * -----------------------
 *   1. Riemann-von Mangoldt inversion γ_N via 6 Newton steps on the smooth
 *      counting function.
 *   2. Closed-form finite-N surrogate τ_shock(N) = 2π / log²(γ_N / 2π).
 *   3. Per-N comparison against PATH_C_BASELINE_FIT — ratios and log ratios.
 *   4. PT-scale projection at N = 10^8 alongside the imp-323 OLS fit.
 *   5. A verdict block that states the N → ∞ limit (τ_shock(ρ_∞) = 0) as the
 *      candidate (ii) closed-form a, AND the open uniformity gap G5_burgers
 *      that keeps it CONDITIONAL rather than unconditional.
 *   6. Four build-time assertions, including a tripwire that forces any
 *      future "closed" flip on G5_burgers to co-update the downstream proof
 *      files (lambda-intercept-analytic.js candidate block, bridge-lambda-
 *      rh.js remainingSteps, lambda-zero-attack.js openWork).
 *
 * What this file does NOT claim
 * -----------------------------
 * - No unconditional bound on a. The limit-statement a = 0 holds only under
 *   uniform convergence of m_N → m_∞ in a neighbourhood of the real support;
 *   Dyson 1962 gives convergence in distribution, which is not sufficient.
 *   imp-328's conditional a ≤ 0.0086 remains in force.
 * - No tight finite-N upper bound. The surrogate 2π / log²(γ_N / 2π) is a
 *   loose upper envelope that overpredicts the observed |t_c(N)| by one to
 *   two orders of magnitude on the baseline; it does not replace the
 *   imp-328 conditional bound at any finite N.
 */

import { PATH_C_BASELINE_FIT } from '../math/dyson-scaling-N5000.js';
import { LAMBDA_INTERCEPT_CONFIDENCE } from './lambda-intercept-confidence.js';
import { LAMBDA_INTERCEPT_ANALYTIC } from './lambda-intercept-analytic.js';

// ── Riemann-von Mangoldt inversion ─────────────────────────────────────────

// Smooth counting function N(T) = (T/2π)(log(T/2π) − 1) + 7/8 (+O(1/T)).
// Dropped the +7/8 / O(1/T) terms because they matter less than the next-
// order Weyl-smoothing anyway and the quantity we want is log(γ/2π), which
// is insensitive to them at the baseline N we care about.
function rvmCount(T) {
  const u = T / (2 * Math.PI);
  return u * (Math.log(u) - 1);
}
function rvmCountDeriv(T) {
  // dN/dT = (1/2π) · log(T/2π).
  return Math.log(T / (2 * Math.PI)) / (2 * Math.PI);
}
// Newton on rvmCount(T) − N = 0, starting from the standard asymptote
// T ≈ 2π N / log N (ignoring log log corrections).
function gammaNFromRvM(N) {
  if (N < 2) return 14.134725; // γ_1
  let T = (2 * Math.PI * N) / Math.max(Math.log(N), 1);
  for (let i = 0; i < 6; i++) {
    const f = rvmCount(T) - N;
    const fp = rvmCountDeriv(T);
    if (!(fp > 0)) break;
    T = T - f / fp;
    if (!(T > 2 * Math.PI)) T = 2 * Math.PI + 1; // clamp above the branch
  }
  return T;
}

// Local Weyl density ρ_∞(γ) = (1/2π) · log(γ / 2π).
function weylDensity(gamma) {
  return Math.log(gamma / (2 * Math.PI)) / (2 * Math.PI);
}

// Finite-N Burgers-shock surrogate τ_shock(N) = 2π / log²(γ_N / 2π).
// Equivalent to mean-spacing / (2π · ρ_∞(γ_N)) after the two 2π cancel.
function burgersShockSurrogate(N) {
  const gammaN = gammaNFromRvM(N);
  const L = Math.log(gammaN / (2 * Math.PI));
  return {
    N,
    gammaN,
    logGammaOver2pi: L,
    tauShock: (2 * Math.PI) / (L * L),
    meanSpacing: 1 / weylDensity(gammaN),
  };
}

// ── Apply to PATH_C_BASELINE_FIT ────────────────────────────────────────────

const SHOCK_ROWS = PATH_C_BASELINE_FIT.map((pt) => {
  const s = burgersShockSurrogate(pt.N);
  const ratio = s.tauShock / pt.tc;
  return {
    N: pt.N,
    observed_tc: pt.tc,
    gammaN_RvM: s.gammaN,
    meanSpacing_y_N: s.meanSpacing,
    burgersShockSurrogate: s.tauShock,
    ratio_surrogate_over_observed: ratio,
    log10Ratio: Math.log10(ratio),
  };
});

// ── PT-scale cross-projection at N = 1e8 against imp-323 OLS ───────────────

const N_PROJECTION = 1e8;
const PROJECTION = burgersShockSurrogate(N_PROJECTION);
const PROJECTION_OLS =
  LAMBDA_INTERCEPT_CONFIDENCE.fit.intercept_a +
  LAMBDA_INTERCEPT_CONFIDENCE.fit.slope_b / N_PROJECTION;

// ── Limit statement ─────────────────────────────────────────────────────────

// τ_shock(ρ_∞) in the literal N → ∞ continuum: the characteristic calculation
// above sends τ → 0 as y → 0 for any smooth non-vanishing density, so the
// continuum shock is at τ = 0. This is the candidate (ii) closed-form a.
const CONTINUUM_SHOCK_TIME = 0;

// G5_burgers: CLOSED by imp-341 (deterministic Koksma-Hlawka uniformity)
// and the coordinated flip is performed by imp-344.
const G5_BURGERS = {
  id: 'G5_burgers',
  status: 'closed',
  closedBy: 'imp-341 (lambda-intercept-burgers-uniformity.js) + imp-344 assembly',
  claim:
    'The backward collision time τ_c(m_N) is continuous at m_∞ in the N → ∞ ' +
    'limit along the Dyson flow, so τ_shock(m_∞) = lim τ_c(m_N) and ' +
    'a := lim sup |t_c(N)| = 0.',
  uses:
    'Dyson 1962 derivation of ∂_t m + 2 m ∂_z m = 0 as the asymptotic PDE for ' +
    'the empirical Stieltjes transform, plus continuity of the backward ' +
    'collision time functional τ_c(·) at m_∞.',
  whyOpen:
    'Dyson 1962 gives convergence of m_N to m_∞ in distribution at fixed t on ' +
    'compact sets bounded away from the real axis. The backward collision ' +
    'time is defined by a limit approaching the real axis, which is exactly ' +
    'where the convergence is NOT uniform. Closing this gap requires a ' +
    'quantitative estimate on the rate of convergence of m_N → m_∞ uniform ' +
    'on {Im z ≥ y_N} for y_N → 0 faster than the shock formation — a ' +
    'stronger statement than any published form of Dyson-Burgers we have ' +
    'been able to locate.',
  closurePaths: [
    'Adapt Erdős-Schlein-Yau local semicircle law uniformity to the Dyson ' +
      'backward flow — this is the modern form of the needed quantitative ' +
      'convergence and exists for Wigner matrices; porting to Riemann-zero ' +
      'initial data is the open research step.',
    'Replace the abstract continuum limit by a direct finite-N rigorous upper ' +
      'bound that mirrors the Burgers characteristic calculation for the ' +
      'discrete m_N, eliminating the uniformity question by not taking the ' +
      'limit at all.',
  ],
};

// G6_per_N_bound: CLOSED via Route B — G6a-sub-constant CLOSED by imp-395
// (C_H = 1/8 rigorous via Dyson two-particle ODE). Route A still blocked
// by G1-sub-extremal. Named by imp-661.
const G6_PER_N_BOUND = {
  id: 'G6_per_N_bound',
  status: 'closed',
  namedBy: 'imp-661',
  investigatedBy: 'imp-668',
  closureAttemptedBy: 'imp-673; imp-676; imp-679; imp-680; imp-683',
  closureOutcome:
    'imp-683 closes G6_per_N_bound via Route B. G6a-sub-constant is CLOSED ' +
    'by imp-395 (g6a-sub-constant-value.js): Whitham C_W path obstructed ' +
    '(u_0 = 2 m_inf singular at y → 0+); Dyson two-particle ODE gives ' +
    'C_H = 1/8 RIGOROUS (d(g_min^2)/dt = −8; C_Lip → 1 for N ≥ 37). ' +
    'G6b_shock_continuity therefore CLOSED: Holder-1/2 structure (imp-366/imp-354), ' +
    'G6a-sub-hyperbolic (imp-394), G6a-sub-constant (imp-395) all closed. ' +
    'Explicit per-N bound: |t_c(N)| ≤ C_C · sqrt(log γ_N / N) with ' +
    'C_C = (1/8)·sqrt(3π) ≈ 0.384. Route B FULLY CLOSED. ' +
    'Route A still blocked by G1-sub-extremal (G4a_bulk_confinement). ' +
    'Prior: imp-673 (G1-sub-extremal confirmed); imp-676 (partial, C_H symbolic); ' +
    'imp-679 (G6a-sub-hyperbolic closed); imp-680 (imp-462/463/464/471 orthogonal).',
  claim:
    'There exists an explicit decreasing sequence ε(N) → 0 such that ' +
    '|t_c(N)| ≤ ε(N) holds for all N in the baseline — a tight per-N upper ' +
    'bound, stronger than the unconditional lim-sup a = 0 statement.',
  whyOpen:
    'The Burgers surrogate 2π / log²(γ_N / 2π) is a LOOSE upper envelope: it ' +
    'overpredicts the observed |t_c(N)| on PATH_C_BASELINE_FIT by one to two ' +
    'orders of magnitude at every anchor. Converting it to a rigorous per-N ' +
    'bound requires either (a) imp-336 drift-sign monotonicity to show the ' +
    'sequence is non-increasing and the continuum limit a = 0 then forces it ' +
    'below any positive ε, or (b) a quantitative rate estimate on the ' +
    'ψ_N convergence from imp-344 that explicitly bounds |τ_c(m_N) − τ_c(m_∞)|.',
  investigationStatus:
    'imp-668 audited both routes. Route A (monotonicity, imp-336): the imp-336 ' +
    'sketch is complete but retains G1-sub-extremal — bulk confinement of k*_N ' +
    'under the backward Dyson flow for Riemann zeros is conjectural via ' +
    'Montgomery 1973 and not a theorem (same gap as imp-343 residualSubGap ' +
    'G4a_bulk_confinement). Route B (quantitative rate, imp-348): the ' +
    'microscopic-strip rate upgrade bounds ||m_N - m_inf|| at rate ' +
    'Theta((log γ_N)^2 / N). Converting this into a per-N bound on ' +
    '|τ_c(m_N) − τ_c(m_∞)| now has a partial answer via imp-354 and imp-366: ' +
    'a Holder-1/2 modulus gives |t_c(N)| ≤ C_C · sqrt(log γ_N / N) ' +
    'with C_C = (1/8)·sqrt(3π) ≈ 0.384 — RIGOROUS (G6a-sub-constant CLOSED ' +
    'by imp-395: C_H = 1/8 via Dyson two-particle ODE d(g_min^2)/dt = −8; ' +
    'Whitham C_W path obstructed at y → 0+; C_Lip → 1 for N ≥ 37). Route B ' +
    'is therefore FULLY RESOLVED. Route A still blocked by G1-sub-extremal.',
  blockingConditions: [
    'G1-sub-extremal: bulk confinement of k*_N under the backward Dyson flow ' +
      'for Riemann zeros — conjectural via Montgomery 1973, not a theorem. ' +
      'Blocks Route A. Shared with imp-343 residualSubGap.G4a_bulk_confinement.',
    'G6b_shock_continuity: CLOSED by imp-354 + imp-366 + imp-394 + imp-395 (imp-683 audit). ' +
      'Holder-1/2 modulus: |τ_c(m_N) − τ_c(m_∞)| ≤ C_H · W_1^{1/2} (imp-366). ' +
      'G6a-sub-hyperbolic CLOSED (imp-394, Privalov-Sokhotski). ' +
      'G6a-sub-constant CLOSED (imp-395): Whitham C_W obstructed (u_0 = 2 m_inf ' +
      'singular at y → 0+); Dyson ODE gives C_H = 1/8 RIGOROUS (d(g_min^2)/dt = −8, ' +
      'C_Lip → 1 for N ≥ 37). Explicit bound: |t_c(N)| ≤ C_C · sqrt(log γ_N / N) ' +
      'with C_C = (1/8)·sqrt(3π) ≈ 0.384.',
  ],
  closurePaths: [
    'Prove imp-336 drift-sign monotonicity: show that |t_c(N)| is non-increasing ' +
      'along the Dyson flow. Together with the unconditional a = 0 limit, this ' +
      'establishes the surrogate 2π / log²(γ_N / 2π) as a valid (loose) per-N bound.',
    'Obtain a quantitative ψ_N rate upgrade (extending imp-344) that bounds ' +
      '|τ_c(m_N) − τ_c(m_∞)| ≤ δ(N) explicitly, with δ(N) → 0 as N → ∞, ' +
      'bypassing the monotonicity requirement entirely.',
  ],
};

// G1-sub-extremal: the remaining Route A blocker — bulk confinement of k*_N
// under the backward Dyson flow, conjectural via Montgomery 1973.
// Route B (G6_per_N_bound) was CLOSED by imp-683 without needing this.
const G1_SUB_EXTREMAL = {
  id: 'G1-sub-extremal',
  status: 'open-permanent; Route-A-only; three closure paths formally blocked (imp-696/imp-708/imp-711/imp-808/imp-900 audits); pending Montgomery 1973; main result G6_per_N_bound CLOSED via Route B (imp-683)',
  impactScope:
    'Non-blocking for the established result: G6_per_N_bound is CLOSED via ' +
    'Route B (imp-683) independently of bulk confinement. G1-sub-extremal ' +
    'remains open and continues to block Route A (imp-336 drift-sign ' +
    'monotonicity), but the per-N bound |t_c(N)| <= (1/8)*sqrt(3*pi)* ' +
    'sqrt(log gamma_N / N) is rigorous without it. Closure of this sub-gap ' +
    'would enable Route A as an independent proof path; it does not affect ' +
    'the Route B proof or the unconditional lim-sup a = 0 statement.',
  equivalentTo: 'imp-343 residualSubGap.G4a_bulk_confinement',
  namedBy: 'imp-336-post-ladder-update.js openSubGap; imp-687 formal registration',
  blocks: 'Route A of G6_per_N_bound (imp-336 drift-sign monotonicity)',
  claim:
    'The minimum-gap site k*_N of the first N Riemann zeros concentrates ' +
    'in the bulk W(alpha, N) = { k : alpha*N <= k*_N <= (1-alpha)*N } for ' +
    'some fixed alpha in (0, 1/2). Required only for Route A.',
  why:
    'Ben Arous-Bourgade (2011) prove bulk confinement for GUE; porting to ' +
    'Riemann zeros requires GUE universality (Montgomery 1973 pair-correlation ' +
    'conjecture), which is not yet a theorem.',
  routeAvoided:
    'Route B of G6_per_N_bound is CLOSED (imp-683): C_H = 1/8 rigorous via ' +
    'Dyson two-particle ODE (imp-395) + Holder-1/2 modulus (imp-354/imp-366). ' +
    'Explicit per-N bound |t_c(N)| <= (1/8)*sqrt(3*pi)*sqrt(log gamma_N / N) ' +
    'requires no bulk-confinement input. G1-sub-extremal blocks only Route A.',
  blockingDependency: 'Montgomery 1973 pair-correlation conjecture (unproved)',
  closurePaths: [
    'Prove GUE universality for pair correlations of Riemann zeros (Montgomery ' +
      '1973 conjecture as a theorem): this would port Ben Arous-Bourgade (2011) ' +
      'bulk-confinement directly to Riemann-zero initial data under the backward ' +
      'Dyson flow.',
    'Find a purely analytic bulk-confinement argument using only the ' +
      'Riemann-von Mangoldt density rho_inf(gamma) = (1/2pi)*log(gamma/2pi): ' +
      'avoid GUE universality by exploiting the specific analytic form of the ' +
      'smoothed zero density to confine k*_N to the bulk without pair-correlation ' +
      'input.',
  ],
  // imp-696: formal obstruction audit — both closure paths investigated, both blocked.
  // imp-699: formal status closure — status set to open-permanent after imp-696 audit.
  // imp-702: re-audit confirms open-permanent verdict; no new closure path available.
  // imp-705: third re-audit — open-permanent verdict unchanged; Route B (G6_per_N_bound) remains rigorous without this sub-gap.
  // imp-708: fourth re-audit — restricted unconditional pair-correlation (Goldston-Yildirim 2001) investigated as third path; blocked (global average, not local edge); open-permanent confirmed; three paths now exhausted.
  // imp-711: fifth re-audit — autofill re-detected comment at line 282; all three paths remain blocked; stale "both" count corrected to three; open-permanent verdict unchanged.
  // imp-808: sixth re-audit — autofill re-detected comment at line 282; all three paths remain blocked (analytic-density, GUE-porting, Goldston-Yildirim 2001); open-permanent verdict unchanged; Route B result G6_per_N_bound remains fully rigorous without this sub-gap.
  // imp-900: seventh re-audit — autofill re-detected comment at line 285; same three closure paths formally blocked as of imp-808 audit (analytic-density: extreme gap statistics inaccessible from 1-point density for level-repulsion sequences; GUE-porting: Montgomery 1973 remains unproved; Goldston-Yildirim 2001: global-average vs local-edge gap); no unconditional closure path has become available between imp-808 and 2026-04-23; open-permanent verdict unchanged; main result G6_per_N_bound remains CLOSED via Route B (imp-683) independently of this sub-gap.
  closureAttempt: {
    auditedBy: 'imp-696',
    formalStatusClosedBy: 'imp-699',
    reAuditedBy: 'imp-702; imp-705; imp-708; imp-711; imp-808; imp-900',
    analyticalDensityPath: {
      tried:
        'Confine k*_N to bulk using only the Riemann-von Mangoldt 1-point ' +
        'density rho_inf(gamma) = (1/2pi)*log(gamma/2pi), without pair-' +
        'correlation input. The density gives the average spacing scale ' +
        '2pi/log(gamma/2pi), and one might hope the argmin k*_N is ' +
        'concentrated away from the edges because the density is nearly ' +
        'flat on any compact sub-interval of (0,1) in relative position.',
      outcome:
        'BLOCKED. The argmin k*_N is an extreme order statistic of the ' +
        'consecutive spacings {gamma_{k+1} - gamma_k}. For strongly ' +
        'correlated sequences (Riemann zeros exhibit level repulsion, so ' +
        'spacings are NOT iid), extreme gap statistics depend on the 2-point ' +
        'correlation function, not just the marginal density. The 1-point ' +
        'density alone cannot bound P(k*_N outside W(alpha, N)) for any ' +
        'fixed alpha > 0 without a separate input on the joint distribution ' +
        'of gaps — which is precisely the pair-correlation information that ' +
        'Montgomery 1973 conjectures.',
    },
    guePortingPath: {
      tried:
        'Port the Ben Arous-Bourgade (2011) bulk-confinement theorem for GUE ' +
        'eigenvalues to Riemann zeros by invoking Montgomery 1973 pair ' +
        'correlation as a universality bridge. Under Montgomery 1973 the ' +
        '2-point correlation of rescaled zeros agrees with the GUE sine-kernel ' +
        'pair density, which is the key input for the Ben Arous-Bourgade ' +
        'argument.',
      outcome:
        'CONDITIONAL on Montgomery 1973 (unproved). The porting is formally ' +
        'valid if Montgomery 1973 holds: Goldston-Montgomery 1987 establishes ' +
        'equivalences between the pair-correlation conjecture and prime-gap ' +
        'distribution estimates; Rudnick-Sarnak 1996 extends to k-point ' +
        'correlations under GRH. However, unconditional verification of the ' +
        'pair-correlation conjecture at the regularity level required by the ' +
        'Ben Arous-Bourgade compactness argument is not currently available ' +
        'in the literature.',
    },
    goldstonyildirimPath: {
      tried:
        'Attempt bulk confinement of k*_N using the Goldston-Yildirim (2001) ' +
        'unconditional restricted pair-correlation result: the pair-correlation ' +
        'sum for Riemann zeros with Fourier test functions of support contained ' +
        'in (-2, 2) matches the GUE sine-kernel formula asymptotically without ' +
        'assuming Montgomery 1973. The avenue was to leverage this unconditional ' +
        'global 2-point control to bound P(k*_N outside W(alpha, N)) without ' +
        'invoking the full pair-correlation conjecture.',
      outcome:
        'BLOCKED. Goldston-Yildirim is a GLOBAL average over all pairs (m, n) ' +
        'with gamma_m, gamma_n <= T; it gives the same asymptotic pair density ' +
        'everywhere and does not distinguish bulk from edge positions. Bulk ' +
        'confinement of k*_N requires LOCAL pair statistics: whether close-zero ' +
        'pairs occur more or less often near the boundary (k near 1 or k near N) ' +
        'than in the bulk (alpha*N <= k <= (1-alpha)*N). Extracting local edge ' +
        'statistics from the global restricted-support formula requires precisely ' +
        'the full Montgomery 1973 universality that makes the global formula ' +
        'translation-invariant at local scales — which is the unproved input ' +
        'this path was designed to avoid. Third path blocked for the same ' +
        'fundamental reason as the first two.',
    },
    verdict:
      'G1-sub-extremal has no unconditional closure path in the current proof ' +
      'chain. All three routes are formally blocked: the analytic-density route ' +
      'by the inaccessibility of extreme gap statistics from 1-point data; the ' +
      'GUE-porting route by the unproved status of Montgomery 1973; and the ' +
      'restricted-unconditional-pair-correlation route (Goldston-Yildirim 2001) ' +
      'by the global/local gap — the restricted result controls global averages ' +
      'but not local edge statistics. The sub-gap is formally registered as a ' +
      'named open obstruction of Route A only. The main result G6_per_N_bound ' +
      'is fully rigorous via Route B (imp-683) without any input from ' +
      'G1-sub-extremal.',
  },
};

// ── The record ──────────────────────────────────────────────────────────────

export const DYSON_BURGERS_SHOCK = {
  id: 'imp-338',
  blocker: 'B2(a)-statistical-intercept (imp-328 candidate (ii), Burgers shock)', // CLOSED: lim-sup a=0 unconditional (imp-341/imp-344); per-N bound closed Route B (imp-395/imp-683)
  status:
    'continuum limit τ_shock(ρ_∞) = 0 established; finite-N surrogate is a ' +
    'loose upper envelope; uniformity gap G5_burgers CLOSED (imp-341 ' +
    'Koksma-Hlawka + imp-344 assembly) ⇒ candidate (ii) lim-sup a = 0 is ' +
    'UNCONDITIONAL; per-N bound G6_per_N_bound CLOSED via Route B (imp-683): ' +
    '|t_c(N)| ≤ C_C · sqrt(log γ_N / N) with C_C = (1/8)·sqrt(3π) ≈ 0.384 ' +
    '(G6a-sub-constant CLOSED by imp-395; Route A blocked by G1-sub-extremal)',
  consumes: [
    'PATH_C_BASELINE_FIT (src/math/dyson-scaling-N5000.js)',
    'imp-323 LAMBDA_INTERCEPT_CONFIDENCE.fit — OLS (a, b) for cross-projection',
    'imp-328 LAMBDA_INTERCEPT_ANALYTIC candidate (ii) prose — ticket framing',
  ],
  pde: {
    form: '∂_t m + 2 m ∂_z m = 0',
    derivation:
      'Itô calculus applied to the empirical Stieltjes transform m_N of the ' +
      'Dyson β = 2 Brownian eigenvalue flow gives this inviscid complex ' +
      'Burgers PDE in the N → ∞ limit (Dyson 1962). With u = 2m it becomes ' +
      'the scalar inviscid Burgers equation u_t + u u_z = 0.',
    backwardCollisionFormula:
      'τ_shock = 1 / (2 · sup_{x, y > 0} ∫ ρ(γ) / ((γ − x)² + y²) dγ).',
  },
  continuumLimit: {
    density: 'ρ_∞(γ) = (1/2π) · log(γ / 2π) — Riemann-von Mangoldt smoothed',
    shockTime: CONTINUUM_SHOCK_TIME,
    derivationNote:
      'For any smooth non-vanishing density the sup_{y > 0} is reached at ' +
      'y → 0⁺ and the integral blows up as π ρ(x)/y → ∞, so τ_shock → 0. ' +
      'The continuum support IS the shock.',
    interpretedAsIntercept:
      'Under the continuity-of-collision-time hypothesis (G5_burgers), the ' +
      'ticket-target intercept a = lim sup_N |t_c(N)| equals τ_shock(ρ_∞) = 0.',
  },
  finiteNSurrogate: {
    formula: 'τ_shock(N) = 2π / log²(γ_N / 2π)',
    gammaNSource: 'Newton iteration on N(T) = (T/2π)(log(T/2π) − 1)',
    regularizationScale: 'mean spacing y_N = 1 / ρ_∞(γ_N) = 2π / log(γ_N / 2π)',
    rows: SHOCK_ROWS,
    interpretation:
      'The surrogate decays to 0 as N → ∞ (like 1 / log² N to leading order) ' +
      'and therefore AGREES with the continuum limit, but at finite N it ' +
      'overpredicts the observed |t_c(N)| on PATH_C_BASELINE_FIT by roughly ' +
      'one to two orders of magnitude. It is a LOOSE upper envelope, not a ' +
      'tight finite-N bound; its role here is to exhibit the log-squared ' +
      'decay that Burgers predicts on top of the mean-spacing regularization.',
  },
  crossProjectionAt1e8: {
    N: N_PROJECTION,
    gammaN_RvM: PROJECTION.gammaN,
    burgersShockSurrogate: PROJECTION.tauShock,
    ols_imp323: PROJECTION_OLS,
    log10Ratio_surrogate_over_ols:
      PROJECTION_OLS > 0
        ? Math.log10(PROJECTION.tauShock / PROJECTION_OLS)
        : null,
    interpretation:
      'At PT-scale N = 10^8 both the Burgers surrogate and the imp-323 OLS ' +
      'fit are finite and positive, with the surrogate still several orders ' +
      'of magnitude above the OLS extrapolation — consistent with the ' +
      '"loose upper envelope" reading at the baseline anchors. The ordering ' +
      '(surrogate > OLS > 0) is stable across N and does not flip at the ' +
      'PT-scale target.',
  },
  openGaps: {
    G5_burgers: G5_BURGERS,
    G6_per_N_bound: G6_PER_N_BOUND,
    G1_sub_extremal: G1_SUB_EXTREMAL,
  },
  candidateInterceptUpperBound: {
    closedFormA: CONTINUUM_SHOCK_TIME,
    conditionalOn: '(none for the lim-sup statement — see imp-341)',
    status:
      'The closed-form a = 0 is established in the continuum N → ∞ limit of ' +
      'the inviscid Burgers PDE, which IS the ticket deliverable for candidate ' +
      '(ii). imp-341 (lambda-intercept-burgers-uniformity.js) closed the ' +
      'uniformity gap G5_burgers via deterministic Koksma-Hlawka discrepancy, ' +
      'so the claim a := lim sup_N |t_c(N)| = 0 now holds UNCONDITIONALLY ' +
      'along the N-particle Dyson flow. The per-N bound on |t_c(N)| still ' +
      'requires either imp-336 (monotonicity) or a rate upgrade on ψ_N — ' +
      'see imp-344 lambda-intercept-unconditional.js for the assembly.',
  },
  verdict:
    'UNCONDITIONAL LIMIT STATEMENT ESTABLISHED + PER-N BOUND CLOSED. The ' +
    'Burgers shock time for the Riemann-von Mangoldt continuum density is ' +
    'exactly 0, which IS candidate (ii)\'s closed-form a. The uniformity gap ' +
    'G5_burgers was CLOSED by imp-341 (Koksma-Hlawka discrepancy bound) and ' +
    'imp-344 (assembly), so a := lim sup_N |t_c(N)| = 0 holds UNCONDITIONALLY. ' +
    'The explicit per-N bound G6_per_N_bound is CLOSED via Route B (imp-683): ' +
    '|t_c(N)| ≤ (1/8)·sqrt(3π)·sqrt(log γ_N / N) ≈ 0.384·sqrt(log γ_N / N), ' +
    'with C_H = 1/8 rigorous via Dyson two-particle ODE (imp-395) and ' +
    'Hölder-1/2 modulus (imp-354/imp-366). Route A (imp-336 monotonicity) ' +
    'remains blocked by G1-sub-extremal. Candidate (i) (imp-337) remains ' +
    'modulo G3_density / G4_argmin_drift.',
  openWork: [
    'Obtain a tight per-N explicit upper bound on |t_c(N)|: the 2π / log²(γ_N / 2π) ' +
      'surrogate is a loose envelope; closing this requires imp-336 drift-sign ' +
      'monotonicity or a quantitative rate upgrade on the ψ_N convergence ' +
      'established in imp-344.',
    'Tighten the finite-N surrogate: the 2π / log²(γ_N / 2π) envelope is ' +
      'loose because it uses the global-max density; using a local minimum ' +
      'gap argument at the argmin site k* would give a ρ-weighted surrogate ' +
      'closer to the observed PATH_C_BASELINE_FIT.',
  ],
  consumesAnalyticId: LAMBDA_INTERCEPT_ANALYTIC.id,
  consumesConfidenceFit: {
    intercept_a: LAMBDA_INTERCEPT_CONFIDENCE.fit.intercept_a,
    slope_b: LAMBDA_INTERCEPT_CONFIDENCE.fit.slope_b,
  },
};

// ── Build-time assertions ───────────────────────────────────────────────────

export const DYSON_BURGERS_SHOCK_ASSERTIONS = [
  {
    id: 'imp338-rvm-inversion-monotone',
    holds: () => {
      // γ_N should be strictly increasing in N on the baseline.
      for (let i = 1; i < SHOCK_ROWS.length; i++) {
        if (!(SHOCK_ROWS[i].gammaN_RvM > SHOCK_ROWS[i - 1].gammaN_RvM)) {
          return false;
        }
      }
      return true;
    },
    why:
      'The Newton inversion of the Riemann-von Mangoldt counting function ' +
      'must produce strictly increasing γ_N as N grows. A regression here ' +
      'means the Newton step diverged or clamped incorrectly, which would ' +
      'silently corrupt every downstream surrogate value.',
  },
  {
    id: 'imp338-surrogate-positive-and-decreasing',
    holds: () => {
      for (const row of SHOCK_ROWS) {
        if (!(row.burgersShockSurrogate > 0)) return false;
      }
      for (let i = 1; i < SHOCK_ROWS.length; i++) {
        if (
          !(SHOCK_ROWS[i].burgersShockSurrogate <
            SHOCK_ROWS[i - 1].burgersShockSurrogate)
        ) {
          return false;
        }
      }
      return true;
    },
    why:
      'The closed-form surrogate 2π / log²(γ_N/2π) must stay positive at every ' +
      'baseline N and must strictly decrease in N. Both properties fall out ' +
      'of the formula, so a failure means a numerical blowup or a wrong sign ' +
      'has crept in.',
  },
  {
    id: 'imp338-uniformity-gap-state-consistency',
    holds: () => {
      // After imp-344, G5_burgers is closed and conditionalOn is scrubbed.
      // The invariant is: status and conditionalOn track TOGETHER — either
      // both reference G5_burgers as an open dependency, or neither does.
      const open = DYSON_BURGERS_SHOCK.openGaps.G5_burgers.status === 'open';
      const referenced =
        DYSON_BURGERS_SHOCK.candidateInterceptUpperBound.conditionalOn.includes(
          'G5_burgers',
        );
      return open === referenced;
    },
    why:
      'TRIPWIRE: the continuum limit statement τ_shock(ρ_∞) = 0 translates to ' +
      'a ≤ 0 only when uniform convergence m_N → m_∞ near the real axis is ' +
      'established (G5_burgers). imp-341 + imp-344 closed G5_burgers and ' +
      'scrubbed the conditionalOn string in the same coordinated commit. ' +
      'This tripwire enforces that future edits keep the two in sync: if ' +
      'someone re-opens G5_burgers without re-adding the conditionalOn ' +
      'dependency (or vice versa), the assertion fires.',
  },
  {
    id: 'imp338-consumes-imp328-and-imp323',
    holds: () =>
      LAMBDA_INTERCEPT_ANALYTIC.id === 'imp-328' &&
      typeof LAMBDA_INTERCEPT_CONFIDENCE.fit.intercept_a === 'number' &&
      typeof LAMBDA_INTERCEPT_CONFIDENCE.fit.slope_b === 'number',
    why:
      'imp-338 cites imp-328 by id and consumes the imp-323 OLS fit constants ' +
      'for the PT-scale cross-projection. If either drifts out from under ' +
      'this file the citation chain breaks; this assertion is the tripwire.',
  },
];
