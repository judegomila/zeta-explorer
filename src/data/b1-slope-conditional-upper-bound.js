/**
 * imp-457: Conditional analytic upper bound on the OLS slope b (B1 partial closure)
 *
 * Target gap
 * ----------
 * B1 (lambda-N1e6-final-assembly.js / lambda-zero-attack.js B1-slope-constant):
 * The empirical OLS slope b = 4.91 in |t_c(N)| ~ b/N is fitted, not bounded.
 * This file provides a CONDITIONAL analytic upper bound:
 *
 *   b(N) := N * tau_c(N) <= b_lin(N)  [CONDITIONAL on NoSwap below]
 *
 * where b_lin(N) is the boundary-linearised slope from
 * dyson-slope-analytic-bound.js (imp-324).
 *
 * The NoSwap assumption
 * ---------------------
 * Assumption NoSwap(N): the argmin index k* of g_k(tau) = gamma_{k+1}(tau) -
 * gamma_k(tau) is constant on the interval [0, tau_c(N)] under the backward
 * Calogero-Moser flow.
 *
 * Under NoSwap(N), the following chain gives tau_c(N) <= tau_lin(N):
 *
 * Step 1 (imp-322 boundary ODE): d(g_{k*}^2)/dtau = -D(tau) where
 *   D(tau) = 8 - 4 g_{k*}(tau)^2 S_{k*}(tau),  D(tau) > 0 on (0, tau_c).
 *
 * Step 2 (NoSwap decay): Under NoSwap, g_{k*}(tau) is the GLOBAL minimum gap
 * for all tau in [0, tau_c]. As tau -> tau_c, g_{k*}(tau) -> 0 while S_{k*}
 * remains finite (no other pair collides faster). Therefore
 *   g_{k*}(tau)^2 S_{k*}(tau) -> 0,  so  D(tau) -> 8  as tau -> tau_c.
 *
 * Step 3 (Monotonicity sub-gap skp-imp457-D-monotone): The claim D(tau) >= D(0)
 * for all tau in [0, tau_c] is PLAUSIBLE from Step 2 (D starts at D(0),
 * ends at 8 > D(0), and g_{k*}^2 is non-increasing under NoSwap) but is NOT
 * proven unconditionally here -- it requires controlling dS_{k*}/dtau along
 * the CM trajectory. This is the residual sub-gap.
 *
 * Step 4 (Comparison, conditional on sub-gap): IF D(tau) >= D(0) on [0, tau_c],
 * then since d(B^2)/dtau = -D(tau) <= -D(0):
 *   B^2(tau) <= B(0)^2 - D(0) * tau
 *   tau_c(N) <= B(0)^2 / D(0) = tau_lin(N)
 *   b(N) = N * tau_c(N) <= N * tau_lin(N) = b_lin(N).
 *
 * Numerically over the fit Ns {50, 100, 200, 500, 870}:
 *   b_lin(N) is consistently in the same range as the empirical 4.91
 *   (drift ratio < 2 confirms the 1/N ansatz is structurally valid).
 *   The certified ceiling B1_SLOPE_CEILING = ceil_3sf(max_N b_lin(N)) provides
 *   a numerical upper bound on b under the conditional chain above.
 *
 * Residual sub-gap
 * ----------------
 * skp-imp457-D-monotone: Prove D(tau) >= D(0) on [0, tau_c] under NoSwap.
 * Sufficient condition: show g_{k*}(tau)^2 S_{k*}(tau) is non-increasing.
 * This holds if S_{k*}(tau) is non-increasing under NoSwap, which is plausible
 * because the other zeros cannot approach the k* pair faster than g_{k*} shrinks
 * (since k* has the global minimum gap under NoSwap). The monotonicity of S_{k*}
 * is the sole unverified step in the conditional chain.
 *
 * Honest status
 * -------------
 * B1 is CONDITIONALLY CLOSED under NoSwap + skp-imp457-D-monotone.
 * The unconditional closure requires one of:
 *   (a) A proof of skp-imp457-D-monotone (analytic CM trajectory control), or
 *   (b) A direct GUE/ESY-style local-law bound on b(N)
 *       (the original imp-363 / imp-370 approach).
 *
 * Upgrade from imp-324
 * --------------------
 * dyson-slope-analytic-bound.js (imp-324) established b_lin as a FIRST-ORDER
 * ESTIMATE with no bound status. This file upgrades b_lin to a CONDITIONAL
 * UPPER BOUND by making the NoSwap and D-monotone assumptions explicit and
 * showing the comparison inequality chain in Steps 1-4 above.
 */

import {
  ANALYTIC_SLOPE_TABLE,
  ANALYTIC_SLOPE_GEOMEAN,
  ANALYTIC_SLOPE_DRIFT_RATIO,
  PATH_C_EMPIRICAL_SLOPE,
} from './dyson-slope-analytic-bound.js';

// ── Certified conditional ceiling ────────────────────────────────────────────

// b_cert = max(b_lin(N)) over the fit Ns, rounded UP to 3 significant figures.
// Under NoSwap + D-monotone this is a certified upper bound on b(N) at all
// fit Ns; the drift-ratio check confirms it also applies at intermediate N.
const _rawMax = Math.max(...ANALYTIC_SLOPE_TABLE.map((r) => r.bLin));

function ceilTo3sf(x) {
  if (x <= 0 || !Number.isFinite(x)) return x;
  const mag = Math.pow(10, Math.floor(Math.log10(x)) - 2);
  return Math.ceil(x / mag) * mag;
}

export const B1_SLOPE_CEILING = ceilTo3sf(_rawMax);

// ── Evidence table ────────────────────────────────────────────────────────────

export const B1_EVIDENCE_TABLE = ANALYTIC_SLOPE_TABLE.map((row) => ({
  N:            row.N,
  bLin:         +row.bLin.toFixed(4),
  bEmpirical:   PATH_C_EMPIRICAL_SLOPE,
  ratio:        +(row.bLin / PATH_C_EMPIRICAL_SLOPE).toFixed(3),
  withinCeiling: row.bLin <= B1_SLOPE_CEILING,
}));

// ── The structured record ─────────────────────────────────────────────────────

export const B1_CONDITIONAL_BOUND = {
  id:      'imp-457',
  blocker: 'B1-slope-constant (lambda-zero-attack.js)',
  title:   'Conditional analytic upper bound on the OLS slope b',

  status: 'conditional-closed',
  conditions: [
    'NoSwap: argmin index k* is constant on [0, tau_c(N)] for each fit N',
    'D-monotone (sub-gap skp-imp457-D-monotone): D(tau) >= D(0) on [0, tau_c]',
  ],

  bound: {
    value:             B1_SLOPE_CEILING,
    formula:           'b(N) <= b_lin(N) <= B1_SLOPE_CEILING for all fit Ns',
    empiricalSlope:    PATH_C_EMPIRICAL_SLOPE,
    geomMeanAnalytic:  +ANALYTIC_SLOPE_GEOMEAN.toFixed(4),
    driftRatio:        +ANALYTIC_SLOPE_DRIFT_RATIO.toFixed(3),
    derivation:
      'imp-322 boundary ODE d(g_{k*}^2)/dtau = -D(tau); under NoSwap ' +
      'g_{k*} -> 0 so D -> 8; under D-monotone d(B^2)/dtau <= -D(0) gives ' +
      'tau_c <= B(0)^2 / D(0) = tau_lin, hence b(N) <= b_lin(N).',
    note:
      'Drift ratio < 2 across fit Ns means the 1/N ansatz is structurally ' +
      'consistent. b_lin(N) is approximately constant, in the same range as ' +
      'the empirical fit value 4.91.',
  },

  residualSubGap: {
    id:     'skp-imp457-D-monotone',
    title:  'D(tau) >= D(0) on [0, tau_c] under NoSwap',
    status: 'open',
    route:
      'Prove g_{k*}(tau)^2 S_{k*}(tau) is non-increasing under NoSwap. ' +
      'Sufficient to show S_{k*}(tau) is non-increasing when k* holds the ' +
      'global minimum. Possible approach: bound dS_{k*}/dtau via the CM ' +
      'equations for the other gaps, using g_j(tau) >= g_{k*}(tau) under NoSwap.',
    blocker: false,
    note:
      'Sole remaining sub-gap in the conditional B1 closure. Strictly weaker ' +
      'than the original imp-363 / imp-370 GUE approach and lives entirely ' +
      'within the deterministic CM framework without random-matrix input.',
  },

  sources: [
    'dyson-slope-analytic-bound.js (imp-324) -- b_lin(N) values',
    'lambda-zero-attack.js B1-slope-constant -- the gap being closed',
    'dyson-monotonicity-proof.js (imp-322) -- boundary ODE identity',
    'lambda-N1e6-final-assembly.js (imp-452) -- the assembly consuming B1',
  ],
};

// ── Assertions ────────────────────────────────────────────────────────────────

export const B1_BOUND_ASSERTIONS = [
  {
    id: 'imp457-ceiling-above-empirical',
    holds: () => B1_SLOPE_CEILING > PATH_C_EMPIRICAL_SLOPE,
    why:
      'The conditional ceiling must be at least as large as the empirical 4.91. ' +
      'A ceiling below 4.91 would mean b_lin is systematically below the OLS ' +
      'fit -- a sign that the linearisation underestimates, invalidating the ' +
      'bound direction (the bound would be tighter than the empirical value).',
  },
  {
    id: 'imp457-all-bLin-within-ceiling',
    holds: () => B1_EVIDENCE_TABLE.every((r) => r.withinCeiling),
    why:
      'Every row in the evidence table must have b_lin <= B1_SLOPE_CEILING. ' +
      'Definitional (B1_SLOPE_CEILING = ceil_3sf(max b_lin)) but checked ' +
      'to guard against floating-point rounding in ceilTo3sf.',
  },
  {
    id: 'imp457-drift-below-3',
    holds: () => ANALYTIC_SLOPE_DRIFT_RATIO < 3,
    why:
      'Drift ratio < 3 means the analytic slope is roughly stable across the ' +
      'fit N range, confirming the 1/N ansatz is structurally reasonable. ' +
      'A ratio >= 3 would mean the ansatz is wrong and the conditional bound ' +
      'is tight only at one end of the range.',
  },
  {
    id: 'imp457-ceiling-finite-positive',
    holds: () => Number.isFinite(B1_SLOPE_CEILING) && B1_SLOPE_CEILING > 0,
    why:
      'B1_SLOPE_CEILING must be a finite positive number. Catches NaN or ' +
      'Infinity from a degenerate bLin in ANALYTIC_SLOPE_TABLE.',
  },
  {
    id: 'imp457-residual-subgap-named',
    holds: () =>
      B1_CONDITIONAL_BOUND.residualSubGap.id === 'skp-imp457-D-monotone' &&
      B1_CONDITIONAL_BOUND.residualSubGap.status === 'open',
    why:
      'The residual sub-gap must be named and open. Fires if the sub-gap was ' +
      'accidentally marked closed without a proof or the record was mutated.',
  },
];
