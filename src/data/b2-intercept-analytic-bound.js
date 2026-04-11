/**
 * imp-458: Conditional analytic upper bound on the Path C intercept a (B2 partial closure)
 *
 * Target gap
 * ----------
 * B2 (lambda-N1e6-final-assembly.js / lambda-zero-attack.js B2-intercept-positivity):
 * The empirical OLS intercept a = 0.0066 in |t_c(N)| ~ a + b/N is the intercept
 * of a fitted curve, not an analytic bound. The assembly requires a rigorously
 * proved a <= 0.02 to upgrade the full finite-height beat to unconditional.
 *
 * The Koksma-Hlawka route (imp-341)
 * ----------------------------------
 * imp-341 (lambda-intercept-burgers-uniformity.js) established, for each N in the
 * PATH_C_BASELINE_FIT, the upper bound on the backward collision time:
 *
 *   tau_c(N)  <=  1 / (2 * (sup_Im_m_inf - psi_N))
 *
 * where:
 *   sup_Im_m_inf  =  pi * rho_inf(gamma_N/2) / y_N_sharp
 *   psi_N         =  C1 * log(gamma_N) / (N * y_N_sharp)
 *   y_N_sharp     =  sqrt(2 * pi / N)
 *   C1            =  pi * C_Selberg  (C_Selberg = 3.0, a conservative constant)
 *   rho_inf(x)    =  log(x / (2*pi)) / (2*pi)  -- Riemann-von Mangoldt density
 *
 * This gives an ANALYTIC (not observed) upper bound on |t_c(N)| at each baseline N.
 * The bound uses only the Selberg unconditional estimate |S(T)| <= C_Selberg * log T
 * and the Riemann-von Mangoldt counting function -- no GUE / local-law input.
 *
 * Under the monotonicity conjecture M
 * ------------------------------------
 * Assumption M: |t_c(N+1)| <= |t_c(N)| for all N >= 2 (the N-particle Calogero-
 * Moser collision time is non-increasing as N grows).
 *
 * Under M, the limit a := lim_{N->inf} |t_c(N)| is the infimum, so:
 *
 *   a  <=  |t_c(N_max)|  <=  tau_c_upper_bound(N_max)
 *
 * for N_max = 2458 (the largest baseline N). The Koksma-Hlawka bound at N_max
 * gives tau_c_upper_bound(2458) ~ 0.0094 << 0.02, so the assembly target a <= 0.02
 * is satisfied under M.
 *
 * Relationship to B1 (imp-457)
 * ----------------------------
 * B1 (imp-457) uses NoSwap + D-monotone to bound the slope b analytically.
 * B2 (this file) uses M to bound the intercept a analytically. Both are
 * conditional closures under structural assumptions about the backward CM flow.
 * M is strictly weaker than the full D-monotone + NoSwap chain of B1: M only
 * requires that collision times decrease monotonically in N, whereas B1 requires
 * a pointwise ODE comparison along each trajectory.
 *
 * Honest status
 * -------------
 * B2 is CONDITIONALLY CLOSED under M.
 * The unconditional closure requires one of:
 *   (a) A proof of M (the open imp-336 monotonicity conjecture), or
 *   (b) A direct per-N ODE bound that does not rely on M (the D-monotone + NoSwap
 *       chain from B1 applied at each individual N rather than inductively).
 *
 * The bound is a_UB = tau_c_upper_bound(N_max) < 0.02, satisfying the assembly
 * condition "a <= 0.02" under M. With both B1 (conditional) and B2 (conditional)
 * closed, the full finite-height beat Lambda < 0.2 becomes conditional on M +
 * D-monotone + NoSwap, rather than on the raw OLS fit.
 *
 * SYNTAX NOTE: avoid star-slash sequences inside JSDoc block text.
 */

import { LAMBDA_INTERCEPT_BURGERS_UNIFORMITY } from './lambda-intercept-burgers-uniformity.js';

const WITNESS_ROWS = LAMBDA_INTERCEPT_BURGERS_UNIFORMITY.numericalWitness.rows;

// ── Find the row at N_max (largest N in the baseline) ───────────────────────

function rowAtNMax(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return rows.reduce((best, row) => (row.N > best.N ? row : best), rows[0]);
}

const N_MAX_ROW = rowAtNMax(WITNESS_ROWS);

// The analytic upper bound on a = lim sup |t_c(N)| under M.
// tau_c_upper_bound_from_sup is 1/(2*(sup Im m_inf - psi)) from imp-341.
const A_UPPER_BOUND =
  N_MAX_ROW !== null && N_MAX_ROW.tau_c_upper_bound_from_sup !== null
    ? +N_MAX_ROW.tau_c_upper_bound_from_sup.toFixed(6)
    : null;

// Assembly target: prove a <= A_UB_CEILING = 0.02.
const A_UB_CEILING = 0.02;

// ── The structured record ─────────────────────────────────────────────────────

export const B2_INTERCEPT_BOUND = {
  id:      'imp-458',
  blocker: 'B2-intercept-positivity (lambda-zero-attack.js)',
  title:   'Conditional analytic upper bound on the Path C intercept a',

  status: 'conditional-closed',
  conditions: [
    'M: |t_c(N+1)| <= |t_c(N)| for all N >= 2 (monotonicity of Calogero-Moser collision time)',
  ],

  bound: {
    value:        A_UPPER_BOUND,
    ceiling:      A_UB_CEILING,
    beatsCeiling: A_UPPER_BOUND !== null && A_UPPER_BOUND < A_UB_CEILING,
    nMax:         N_MAX_ROW !== null ? N_MAX_ROW.N         : null,
    gammaMaxRvM:  N_MAX_ROW !== null ? N_MAX_ROW.gammaN_RvM : null,
    formula:
      'Under M: a <= |t_c(N_max)| <= 1/(2*(sup_Im_m_inf(N_max) - psi(N_max))). ' +
      'sup_Im_m_inf and psi are from the Koksma-Hlawka bound in imp-341 ' +
      '(lambda-intercept-burgers-uniformity.js) with C_Selberg = 3.0 (conservative).',
    derivation:
      'imp-341 proved sup Im m_N >= sup Im m_inf - psi_N > 0 at each baseline N, ' +
      'so tau_c(m_N) = 1/(2 sup Im m_N) <= 1/(2*(sup Im m_inf - psi_N)). ' +
      'The bound is analytic: it depends only on N, gamma_N, and the constants ' +
      'C_Selberg and pi, not on the observed tc values. Under M, ' +
      'a = inf_N |t_c(N)| <= |t_c(N_max)| <= this bound.',
    note:
      'C_Selberg = 3.0 is a conservative placeholder matching Titchmarsh section 14.13. ' +
      'Using a tighter constant would lower the bound further. ' +
      'The 0.02 ceiling is comfortably cleared: a_UB is approximately 0.0094.',
  },

  residualSubGap: {
    id:     'imp-336',
    title:  '|t_c(N+1)| <= |t_c(N)| for all N >= 2 (monotonicity conjecture M)',
    status: 'empirically-unfalsified',
    route:
      'Prove that adding gamma_{N+1} to the Calogero-Moser system does not increase tau_c. ' +
      'Heuristic: the extra zero adds a positive term to S_{k*}(t), making ' +
      'dg_{k*}/dtau more negative and bringing the collision forward. ' +
      'The same heuristic underpins the empirical fit b > 0 in |t_c| ~ a + b/N.',
    blocker: false,
    note:
      'M is empirically observed on the entire PATH_C_BASELINE_FIT: ' +
      '0.1435 > 0.0723 > 0.0352 > 0.0163 > 0.0086. ' +
      'The analytic proof is the subject of the open imp-336 ticket.',
  },

  witnessRows: WITNESS_ROWS,

  sources: [
    'lambda-intercept-burgers-uniformity.js (imp-341) -- Koksma-Hlawka tau_c_upper_bound_from_sup',
    'lambda-zero-attack.js B2-intercept-positivity -- the gap being closed',
    'lambda-N1e6-final-assembly.js (imp-452) -- the assembly consuming B2',
    'dyson-scaling-N5000.js PATH_C_BASELINE_FIT -- baseline N values',
  ],
};

// ── Assertions ────────────────────────────────────────────────────────────────

export const B2_BOUND_ASSERTIONS = [
  {
    id: 'imp458-bound-below-ceiling',
    holds: () =>
      B2_INTERCEPT_BOUND.bound.value !== null &&
      B2_INTERCEPT_BOUND.bound.value < A_UB_CEILING,
    why:
      'The analytic upper bound on a must be below the 0.02 assembly ceiling. ' +
      'A failure means the Koksma-Hlawka bound at N_max is not tight enough to ' +
      'certify a <= 0.02, and the B2 closure route needs a larger N or tighter C_Selberg.',
  },
  {
    id: 'imp458-bound-positive',
    holds: () =>
      B2_INTERCEPT_BOUND.bound.value !== null &&
      B2_INTERCEPT_BOUND.bound.value > 0,
    why:
      'The analytic bound must be a positive number. Zero or negative would mean ' +
      'the sup Im m_inf >> psi approximation is degenerate at N_max.',
  },
  {
    id: 'imp458-all-sup-im-positive',
    holds: () =>
      WITNESS_ROWS.length > 0 &&
      LAMBDA_INTERCEPT_BURGERS_UNIFORMITY.numericalWitness.allSupImMNLowerBoundsPositive,
    why:
      'All baseline rows must have sup Im m_N lower bound strictly positive, ' +
      'so the tau_c_upper_bound_from_sup formula gives finite positive bounds. ' +
      'A failure means psi >= sup Im m_inf at some N, breaking the bound direction.',
  },
  {
    id: 'imp458-nmax-is-largest',
    holds: () =>
      N_MAX_ROW !== null &&
      WITNESS_ROWS.every((r) => r.N <= N_MAX_ROW.N),
    why:
      'N_max must be the largest N in UNIFORMITY_ROWS so that under M ' +
      'the bound a <= tau_c_upper_bound(N_max) uses the tightest available row. ' +
      'A failure means rowAtNMax selected a non-maximal row.',
  },
  {
    id: 'imp458-residual-subgap-named-and-open',
    holds: () =>
      B2_INTERCEPT_BOUND.residualSubGap.id === 'imp-336' &&
      B2_INTERCEPT_BOUND.residualSubGap.status !== 'proved',
    why:
      'The residual sub-gap (monotonicity M, imp-336) must be named and not yet ' +
      'marked as proved. Fires if it is accidentally closed without a full analytic ' +
      'proof being supplied in the codebase.',
  },
];
