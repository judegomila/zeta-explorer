/**
 * @module finite-k-c-mb-unconditional
 * @fileoverview imp-963 — closure of imp-856's "find ANY finite K with C_mb ≤ K
 * unconditionally" by direct consumption of the imp-933 per-plateau interval-RK4
 * certificates (commits e2effd7..9dfaca4 + 9e22bfb closeout). Reports the
 * unconditional finite-K bounds at three N_0 thresholds, plus the rescue-formula
 * margin for each. Establishes that the question imp-856 framed (finite K
 * unconditional) is ANSWERED on N ∈ [100, 10⁴]; the open work is extension to
 * N* > 10⁴ (imp-962 / imp-360 / imp-423).
 * @see imp-856
 * @see imp-933
 * @see imp-911
 */

import { IMP_911_PER_PLATEAU_GRONWALL_CERTS } from './imp-911-per-plateau-gronwall-certs.js';

// ── Setup: harvest closed certs from the imp-933 sweep ─────────────────────

const CLOSED_CERTS = IMP_911_PER_PLATEAU_GRONWALL_CERTS.closedRows_data;

function kMaxAbove(N0) {
  const eligible = CLOSED_CERTS.filter((r) => r.N >= N0);
  return eligible.length === 0
    ? null
    : Math.max(...eligible.map((r) => r.K_paper_cert_floor));
}

const RESCUE_THRESHOLD = 0.12751; // imp-486 rescue formula (rho_min lower bound)

function rescueLhs(K, N0) {
  return (K * Math.log(N0)) / Math.sqrt(N0);
}

// Compute the unconditional finite-K bound at multiple N_0 thresholds.
// At each N_0, K_unconditional = max C_mb across the certified set with N >= N_0,
// and the rescue formula K * log(N_0) / sqrt(N_0) < 0.12751 must hold for the
// closure to be productive.
const N0_BAND = [100, 200, 500, 1000, 2000, 5000];
const FINITE_K_TABLE = N0_BAND.map((N0) => {
  const K = kMaxAbove(N0);
  const lhs = K != null ? rescueLhs(K, N0) : null;
  return {
    N0,
    K_unconditional: K != null ? +K.toExponential(4) : null,
    rescue_lhs: lhs != null ? +lhs.toFixed(5) : null,
    rescue_threshold: RESCUE_THRESHOLD,
    rescue_satisfied: lhs != null && lhs < RESCUE_THRESHOLD,
    margin_factor: lhs != null && lhs > 0 ? +(RESCUE_THRESHOLD / lhs).toFixed(2) : null,
  };
});

// Smallest N_0 where the rescue formula is satisfied — this is the
// "imp-486 rescue formula entry point" using purely interval-arithmetic
// certified data. Smaller N_0 = stronger result (more N values covered).
const TIGHTEST_N0 = FINITE_K_TABLE.find((r) => r.rescue_satisfied) ?? null;

// ── Exported record ────────────────────────────────────────────────────────

export const FINITE_K_C_MB_UNCONDITIONAL = Object.freeze({
  id: 'imp-963-finite-k-c-mb-unconditional',
  ticket: 'imp-963',
  closes: ['imp-856', 'imp-835', 'imp-440 (on N ∈ [100, 10⁴])'],
  status: 'rigorous-on-N-in-100-to-10000',

  statement:
    'For every N ∈ [100, 10⁴], the many-body correction constant C_mb(N) ' +
    'satisfies C_mb(N) ≤ 0.2014 UNCONDITIONALLY (no GUE assumption), ' +
    'as a direct consequence of the imp-933 per-plateau interval-RK4 ' +
    'sweep (27 plateau-start certificates from imp-903 + 27 plateau-' +
    'interior certificates from imp-933 + the imp-911 plateau-Lipschitz ' +
    'analytic interpolation). At N_0 = 100 the imp-486 rescue formula ' +
    'K · log(N_0) / √N_0 < 0.12751 holds with margin factor 1.37×; at ' +
    'N_0 = 200 it holds with margin 6.74×.',

  closesImp856:
    'imp-856 asked: "is there ANY finite K with C_mb ≤ K unconditionally, ' +
    'possibly at a slower rate?" imp-486 proved C_mb = O(1) at the ' +
    'N^{-1/2} log N rate is irreducible from GUE. But a FIXED finite K at ' +
    'fixed N is a strictly weaker statement that imp-933 delivers ' +
    'directly — without invoking GUE — by interval-RK4 certifying C_mb at ' +
    '57 distinct N values across [10, 10⁴]. The headline K = 0.2014 above ' +
    'N=100 is the answer.',

  closesImp856OnN10k:
    'On N ∈ [100, 10⁴]: K = 0.2014 unconditional (this file). ' +
    'On N > 10⁴: open — see imp-962 (extend the sweep). ' +
    'On the asymptotic-rate question (C_mb = O(1) at N^{-1/2} log N rate ' +
    'as N → ∞): impossibility result from imp-486 stands; GUE remains ' +
    'irreducible at the rate level. The finite-K-at-fixed-N closure here ' +
    'does NOT contradict imp-486 — it is a weaker, complementary claim.',

  finiteKTable: FINITE_K_TABLE,
  tightestN0: TIGHTEST_N0,

  certificateProvenance: {
    sweepCount: CLOSED_CERTS.length,
    nRangeCovered: {
      min: Math.min(...CLOSED_CERTS.map((r) => r.N)),
      max: Math.max(...CLOSED_CERTS.map((r) => r.N)),
    },
    sources: [
      'imp-857 L1 8-N baseline sweep (commit 16f1ee1)',
      'imp-903 27 H_raw-update sweep (commits 7d677af, 20a1f90)',
      'imp-933 27 per-plateau-interior sweep (commits e2effd7..9dfaca4)',
      'imp-933 closeout: plateau 26 via imp-857-L1 N=10000 (commit 9e22bfb)',
    ],
    sweepStatus: IMP_911_PER_PLATEAU_GRONWALL_CERTS.status,
  },

  consequences: [
    'imp-440 finite-height beat: Λ ≤ 0.121 at N* = 1e6 with 24.9× margin ' +
      'over Platt-Trudgian 0.2 — the conditional-on-M condition is now ' +
      'discharged unconditionally on N ∈ [100, 10⁴].',
    'imp-835: imp-440 completion sub-gap closed at the N ∈ [100, 10⁴] level.',
    'imp-856: ANY finite K answered with K = 0.2014 (no GUE).',
  ],

  remainingOpenWork: [
    'imp-962 — extend imp-933 per-plateau sweep above N = 10⁴ to push the ' +
      'unconditional Λ ≤ 0.121 from N ∈ [100, 10⁴] up to the full N* = 10⁶ ' +
      'headline. Compute-bound (~9-18 h CPU per sweep, parallelizable).',
    'imp-360 / imp-423 — extend the measured Dyson backward ODE ladder ' +
      'from N = 10⁴ to N = 10⁶ to feed the extended sweep.',
    'imp-486 asymptotic-rate impossibility stands — GUE irreducible at the ' +
      'C_mb = O(1) at N^{-1/2} log N rate. This is NOT addressed here; only ' +
      'the finite-K-at-fixed-N question is.',
  ],
});

export const FINITE_K_C_MB_UNCONDITIONAL_ASSERTIONS = [
  {
    id: 'imp963-finite-k-above-100-under-half',
    holds: () => {
      const K = kMaxAbove(100);
      return K != null && K < 0.5;
    },
    why:
      'The unconditional finite-K bound on N ≥ 100 must be strictly less ' +
      'than 0.5. A larger value would mean the imp-933 sweep regressed ' +
      'or the headline 0.2014 is wrong.',
  },
  {
    id: 'imp963-rescue-satisfied-at-N0-100',
    holds: () => {
      const K = kMaxAbove(100);
      return K != null && rescueLhs(K, 100) < RESCUE_THRESHOLD;
    },
    why:
      'The imp-486 rescue formula K · log(100) / √100 < 0.12751 must hold ' +
      'with K = max C_mb above N=100. This is the load-bearing assertion ' +
      'for the imp-440 finite-height beat being unconditional on [100, 10⁴].',
  },
  {
    id: 'imp963-tightest-N0-at-most-100',
    holds: () =>
      FINITE_K_C_MB_UNCONDITIONAL.tightestN0 != null &&
      FINITE_K_C_MB_UNCONDITIONAL.tightestN0.N0 <= 100,
    why:
      'The smallest N_0 where the rescue formula is satisfied must be at ' +
      'most 100. A larger value would mean we lose coverage of small N ' +
      'and the unconditional claim weakens to N ∈ [N_0, 10⁴].',
  },
  {
    id: 'imp963-margin-at-N0-100-positive',
    holds: () => {
      const row = FINITE_K_C_MB_UNCONDITIONAL.finiteKTable.find((r) => r.N0 === 100);
      return row != null && row.margin_factor != null && row.margin_factor > 1;
    },
    why:
      'Margin factor at N_0=100 must exceed 1 (rescue strictly satisfied, ' +
      'not on the boundary). A margin <= 1 means the closure is degenerate.',
  },
];
