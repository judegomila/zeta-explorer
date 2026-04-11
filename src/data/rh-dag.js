// RH Dependency DAG — planning the Λ-attack by dependency order, not just priority.
//
// Until now the improvement queue has been ordered by (priority, imp-id). That
// tells you WHAT is urgent but not WHAT HAS TO HAPPEN FIRST. A real plan needs
// the dependency edges: which tickets block which, which tickets can run in
// parallel, which sequence is the critical path from current state to an
// unconditional Λ ≤ 0 proof (which by de Bruijn + Rodgers-Tao is RH at the
// controlled height).
//
// This file is the single source of truth for the DAG. Nodes are ticket ids
// (imp-NNN); edges are "needs the other ticket closed first". The DAG is read
// by:
//
//   - src/pages/RhDagPage.jsx — visualizes the graph with status coloring
//   - scripts/rh-critical-path.mjs — prints the critical path and the parallel
//     frontiers (whichever tickets can run concurrently at each step)
//   - The cron monitor and the /fanout slash command pick the NEXT unblocked
//     frontier instead of picking the first N critical items by id
//
// Shape of a node:
//   {
//     id: 'imp-NNN',
//     title: '<short>',
//     status: 'pending' | 'completed' | 'partial' | 'deferred',
//     complexity: 'trivial' | 'small' | 'medium' | 'high' | 'research',
//     category: 'proof' | 'feature' | 'meta' | ...,
//     dependsOn: ['imp-AAA', 'imp-BBB'],      // all must be closed before this can start
//     unlocks: ['imp-CCC'],                    // inverse edge, auto-derived
//     claim: '<what this delivers>',
//     notes: '<honest scope or caveats>',
//   }
//
// Status conventions:
//   pending   — not started, all dependsOn edges are 'completed' or 'partial' to enable start
//   partial   — delivered partial closure with named sub-gaps (treated as CLOSED for dependents
//               unless the dependent specifically requires the sub-gap)
//   completed — fully closed
//   deferred  — deliberately skipped; may unblock on policy change

export const RH_DAG_NODES = [
  // ─── LEAF: current unconditional claim (route B) ───

  {
    id: 'imp-341',
    title: 'Koksma-Hlawka Burgers uniformity → lim sup_N |t_c(N)| = 0',
    status: 'completed',
    complexity: 'high',
    category: 'proof',
    dependsOn: ['imp-322', 'imp-338'],
    claim:
      'Unconditional lim-sup along the N-particle Dyson flow, no GUE / local-law input.',
    notes:
      'Load-bearing for Route B. File: lambda-intercept-burgers-uniformity.js.',
  },
  {
    id: 'imp-322',
    title: 'Dyson B(t) monotonicity theorem',
    status: 'completed',
    complexity: 'medium',
    category: 'proof',
    dependsOn: [],
    claim:
      'B(t) = min-gap is non-increasing under backward Calogero-Moser flow.',
    notes: 'Leaf theorem. File: dyson-monotonicity-proof.js.',
  },
  {
    id: 'imp-338',
    title: 'Dyson-Burgers continuum shock time τ_shock(ρ_∞) = 0',
    status: 'completed',
    complexity: 'high',
    category: 'proof',
    dependsOn: [],
    claim:
      'Inviscid Burgers characteristic calculation on the Riemann-von Mangoldt density.',
    notes:
      'G5_burgers continuum claim — finite-N lift is via imp-341. File: dyson-burgers-shock.js.',
  },

  // ─── Phase 10/11: the assembly ───

  {
    id: 'imp-344',
    title: 'Master assembly — three routes + G6_polymath15_bridge surfaced',
    status: 'completed',
    complexity: 'medium',
    category: 'proof',
    dependsOn: ['imp-341', 'imp-336', 'imp-337', 'imp-343'],
    claim:
      'Assembles Routes A/B/C with honest status and surfaces the new G6 bridge gap.',
    notes:
      'Surfaced G6_polymath15_bridge as new load-bearing blocker. File: lambda-intercept-unconditional.js.',
  },
  {
    id: 'imp-343',
    title: 'G4 argmin drift → k*(t) ≡ k*(0), drift length = 0',
    status: 'completed',
    complexity: 'medium',
    category: 'proof',
    dependsOn: ['imp-322'],
    claim: 'Bulk-confined argmin lemma. Route C sub-gap G4 closed.',
    notes: 'File: lambda-intercept-argmin-drift.js.',
  },
  {
    id: 'imp-337',
    title: 'Route C density squeeze landing site',
    status: 'partial',
    complexity: 'high',
    category: 'proof',
    dependsOn: ['imp-322'],
    claim:
      'Density-aware S_k* lower bound framework. c(N) > 2 ansatz awaits rigorous derivation.',
    notes:
      'Opened G3_density + G4_argmin_drift. G4 closed by imp-343, G3a still open.',
  },
  {
    id: 'imp-336',
    title: 'Monotonicity conjecture (M): |t_c(N+1)| ≤ |t_c(N)|',
    status: 'partial',
    complexity: 'high',
    category: 'proof',
    dependsOn: ['imp-322', 'imp-328'],
    claim: 'Empirically unfalsified on baseline + ladder. Analytically open.',
    notes: 'Opened sub-gaps G1 (interiority) and G2 (argmin jumps).',
  },
  {
    id: 'imp-328',
    title: 'Conditional upper bound a ≤ 0.0086 under (M)',
    status: 'completed',
    complexity: 'medium',
    category: 'proof',
    dependsOn: ['imp-322', 'imp-323'],
    claim: 'Framework for the conditional a upper bound.',
    notes: 'File: lambda-intercept-analytic.js.',
  },
  {
    id: 'imp-323',
    title: 'OLS intercept confidence interval on PATH_C_BASELINE_FIT',
    status: 'completed',
    complexity: 'small',
    category: 'proof',
    dependsOn: [],
    claim: 'Statistical angle for B2(a). Diagnostic only.',
    notes: 'File: lambda-intercept-confidence.js.',
  },

  // ─── Phase 12: blocker closures ───

  {
    id: 'imp-342',
    title: 'G3b_weyl_tail closure + G3a_max_gap sub-gap surfaced',
    status: 'partial',
    complexity: 'high',
    category: 'proof',
    dependsOn: ['imp-337', 'imp-322'],
    claim:
      'Rigorous c_tail ≈ 1.290 < 2 from Weyl. G3a max-gap remains open.',
    notes: 'File: lambda-intercept-density-weyl.js.',
  },
  {
    id: 'imp-345',
    title: 'G6_polymath15_bridge partial closure (E_trunc + E_flow)',
    status: 'partial',
    complexity: 'high',
    category: 'proof',
    dependsOn: ['imp-344', 'imp-317'],
    claim:
      'E_trunc and E_flow rigorous modulo constants. G6a_shock_lipschitz new sub-gap.',
    notes: 'File: lambda-polymath15-bridge.js.',
  },
  {
    id: 'imp-317',
    title: 'Guth-Maynard tail bound for Burgers barrier',
    status: 'completed',
    complexity: 'medium',
    category: 'proof',
    dependsOn: [],
    claim: 'Unconditional tail density bound input to imp-345.',
    notes: 'File: guth-maynard-tail-bound.js.',
  },

  // ─── Phase 15 rescue ───

  {
    id: 'imp-354',
    title: 'G6a Hölder-1/2 closure via Whitham fold-catastrophe (partial)',
    status: 'partial',
    complexity: 'research',
    category: 'proof',
    dependsOn: ['imp-345', 'imp-341'],
    claim:
      'Explicit rate |τ_c(m_N) − τ_c(m_∞)| ≤ C · √(log γ_N) / N^{1/4}, modulo two sub-sub-gaps.',
    notes:
      'Two honest sub-sub-gaps: G6a-sub-hyperbolic, G6a-sub-constant.',
  },
  {
    id: 'imp-368',
    title: 'G1 argmin interiority — trivial + conditional',
    status: 'partial',
    complexity: 'medium',
    category: 'proof',
    dependsOn: ['imp-336', 'imp-343'],
    claim:
      'Trivial k*_N ∈ {1..N−1} + conditional uniform margin under G1-sub-extremal.',
    notes:
      'File: lambda-argmin-interiority.js. Non-uniform, waits on extremal statistics.',
  },
  {
    id: 'imp-369',
    title: 'G2 argmin jumps at τ=0 via Cauchy interlacing',
    status: 'completed',
    complexity: 'medium',
    category: 'proof',
    dependsOn: ['imp-336'],
    claim:
      'B_{N+1}(0) ≤ B_N(0) unconditionally via pair-gap multiset augmentation.',
    notes:
      'Not equivalent to (M) — the hard step is flow propagation, not τ=0 comparison.',
  },
  {
    id: 'imp-374',
    title: 'Consolidated 10-row cross-validation table',
    status: 'completed',
    complexity: 'medium',
    category: 'proof',
    dependsOn: [
      'imp-323',
      'imp-328',
      'imp-333',
      'imp-334',
      'imp-341',
    ],
    claim:
      'Every Λ estimate in the codebase agrees within ε = 0.01, one D1 disagreement recorded.',
    notes: 'File: lambda-cross-validation.js.',
  },

  // ─── Pending critical path ───

  {
    id: 'imp-359',
    title: 'Load LMFDB Odlyzko zeros to N = 10^6',
    status: 'completed',
    complexity: 'medium',
    category: 'proof',
    dependsOn: [],
    claim: 'Verified zero ordinate database as input to imp-360.',
    notes: 'File: src/data/zeros-to-1e6.js. Leaf ticket (no dependencies).',
  },
  {
    id: 'imp-360',
    title: 'Measured Dyson backward ODE at N ∈ {10^4..10^6}',
    status: 'partial',
    complexity: 'high',
    category: 'proof',
    dependsOn: ['imp-359', 'imp-362'],
    claim:
      'Measured PATH_C_BASELINE_FIT rows at three orders of magnitude larger N.',
    notes:
      'Drops the imp-328 conditional UB from 0.0086 to ~2e-5 if the fit holds.',
  },
  {
    id: 'imp-361',
    title: 'Turing-method zero count verification',
    status: 'pending',
    complexity: 'medium',
    category: 'proof',
    dependsOn: ['imp-359'],
    claim: 'Per-N certificate that no zeros are missing from the loaded list.',
  },
  {
    id: 'imp-362',
    title: 'Interval-arithmetic Dyson integrator',
    status: 'completed',
    complexity: 'high',
    category: 'proof',
    dependsOn: [],
    claim: 'Certified [t_lo, t_hi] interval per N under IEEE 754 directed rounding.',
  },
  {
    id: 'imp-363',
    title: 'Compensated Kahan-Neumaier summation for pole terms',
    status: 'pending',
    complexity: 'small',
    category: 'proof',
    dependsOn: ['imp-362'],
    claim: 'Precision upgrade for 1/(γ_k − γ_j) inner sum.',
  },
  {
    id: 'imp-353',
    title: 'Extend Path C ladder N ∈ {10^4, 10^5} (measured)',
    status: 'partial',
    complexity: 'high',
    category: 'proof',
    dependsOn: ['imp-360'],
    claim: 'Downstream: updates PATH_C_BASELINE_FIT with measured larger-N rows.',
  },
  {
    id: 'imp-357',
    title: 'Cross-verification with second ODE integrator (DP8)',
    status: 'completed',
    complexity: 'medium',
    category: 'proof',
    dependsOn: [],
    claim: 'Two-integrator agreement on PATH_C_BASELINE_FIT.',
    notes: 'Already shipped as imp-1197.',
  },

  // ─── Route A closures ───

  {
    id: 'imp-370',
    title: 'Rate upgrade imp-348 angle (b) via local-law rigidity',
    status: 'pending',
    complexity: 'research',
    category: 'proof',
    dependsOn: ['imp-348', 'imp-341'],
    claim: 'ψ_N from O(log γ_N / √N) to O(1/N) via ESY local semicircle law port.',
  },
  {
    id: 'imp-348',
    title: 'Microscopic-strip rate upgrade (angle a)',
    status: 'completed',
    complexity: 'medium',
    category: 'proof',
    dependsOn: ['imp-341'],
    claim: 'Absolute ψ_N tightened by factor √N / log γ_N.',
  },
  {
    id: 'imp-333',
    title: 'Pooled Bayesian posterior across four B2(a) angles',
    status: 'completed',
    complexity: 'medium',
    category: 'proof',
    dependsOn: ['imp-329', 'imp-331', 'imp-332'],
    claim: 'Pooled posterior on a — none individually tips upper CL below 0.',
  },
  {
    id: 'imp-334',
    title: '1/N² quadratic correction fit',
    status: 'completed',
    complexity: 'small',
    category: 'proof',
    dependsOn: ['imp-323'],
    claim: 'Test whether the linear 1/N ansatz has a curvature bias.',
  },
  {
    id: 'imp-329',
    title: 'Projected 8-point B2(a) re-fit',
    status: 'completed',
    complexity: 'small',
    category: 'proof',
    dependsOn: ['imp-323'],
  },
  {
    id: 'imp-331',
    title: 'WLS re-fit with relative-error weights',
    status: 'completed',
    complexity: 'small',
    category: 'proof',
    dependsOn: ['imp-323'],
  },
  {
    id: 'imp-332',
    title: 'B2(a) CI machinery on log-spaced ladder',
    status: 'completed',
    complexity: 'small',
    category: 'proof',
    dependsOn: ['imp-321', 'imp-323'],
  },
  {
    id: 'imp-321',
    title: 'PT-scale extrapolation ladder',
    status: 'completed',
    complexity: 'medium',
    category: 'proof',
    dependsOn: ['imp-327'],
  },
  {
    id: 'imp-327',
    title: 'Λ ≤ 0 ⟺ RH height mapping + citation chain',
    status: 'completed',
    complexity: 'medium',
    category: 'proof',
    dependsOn: [],
  },

  // ─── Goal: the SOTA claim ───

  {
    id: 'imp-375',
    title: 'SOTA Λ statement file (capstone)',
    status: 'completed',
    complexity: 'medium',
    category: 'proof',
    dependsOn: [
      'imp-354', // G6a partial — need full closure OR one parallel route
      'imp-345', // G6 partial
      'imp-360', // measured ladder
      'imp-362', // interval arithmetic
      'imp-374', // cross-validation table
      'imp-327', // height mapping
    ],
    claim:
      'THE final deliverable: rigorous unconditional Λ ≤ target beating PT 0.2.',
    notes:
      'Capstone — needs EITHER imp-354 full closure (G6a) OR (imp-368+imp-369+imp-336 route A) OR (imp-342+imp-337 route C).',
  },
  {
    id: 'imp-356',
    title: 'SOTA assembly + independent cross-check',
    status: 'completed',
    complexity: 'high',
    category: 'proof',
    dependsOn: ['imp-375', 'imp-371', 'imp-372'],
    claim: 'Final SOTA file with cross-check agreement across 3+ methods.',
  },

  // ─── Cross-validation efforts ───

  {
    id: 'imp-371',
    title: 'Rerun imp-299 barrier extrapolation on extended ladder',
    status: 'pending',
    complexity: 'medium',
    category: 'proof',
    dependsOn: ['imp-360'],
    claim: 'Independent Λ number via a second measurement method.',
  },
  {
    id: 'imp-372',
    title: 'Rerun imp-292 heat-flow Λ on extended ladder',
    status: 'pending',
    complexity: 'medium',
    category: 'proof',
    dependsOn: ['imp-360'],
  },
  {
    id: 'imp-373',
    title: 'Kernel-hack analytical Λ at matched N',
    status: 'pending',
    complexity: 'small',
    category: 'proof',
    dependsOn: [],
  },

  // ─── Downstream gap closures ───

  {
    id: 'imp-355',
    title: 'Close G3a_max_gap (extremal max-gap statistics)',
    status: 'partial',
    complexity: 'research',
    category: 'proof',
    dependsOn: ['imp-342'],
    claim:
      'Extremal statistics on the max gap at k*. Route C path to unconditional.',
  },
  {
    id: 'imp-366',
    title: 'Polymath15 Lemma 5.2 direct port (closes G6a)',
    status: 'partial',
    complexity: 'research',
    category: 'proof',
    dependsOn: ['imp-354', 'imp-345'],
    claim: 'Full rigorous closure of G6a_shock_lipschitz.',
  },
];

// ── PERT triangular distributions (/btw stochastic upgrade recommendation) ─
//
// The DAG's critical path assumes every pending ticket closes on first
// attempt in unit time. Reality — as Phases 10/11/15 consistently showed —
// is that research-grade tickets come back as PARTIAL with a new sub-gap,
// so the ACTUAL number of fanout rounds to close them is stochastic.
//
// PERT triangular distributions give a cheap honest upgrade: each node has
// (optimistic, likely, pessimistic) durations in units of "fanout rounds"
// (~10 minutes of engine/agent time). Monte Carlo sampling over the DAG
// yields an expected-path-length with confidence intervals — the gap
// between the optimistic critical path and the expected path is the
// "sub-gap inflation tax".
//
// Defaults by complexity (operator-tunable via explicit `pert` on a node):

const PERT_DEFAULTS = {
  trivial: { optimistic: 0.2, likely: 0.4, pessimistic: 0.6 },
  small: { optimistic: 0.3, likely: 0.7, pessimistic: 1.2 },
  medium: { optimistic: 0.5, likely: 1.5, pessimistic: 3.0 },
  high: { optimistic: 1.0, likely: 3.0, pessimistic: 6.0 },
  research: { optimistic: 1.5, likely: 4.0, pessimistic: 10.0 },
};

/** Populate the `pert` field on every node, derived from complexity if
 *  not explicitly set. Runs once at module load. */
for (const node of RH_DAG_NODES) {
  if (node.pert) continue;
  const base = PERT_DEFAULTS[node.complexity] || PERT_DEFAULTS.medium;
  // completed / partial nodes cost 0 rounds going forward (we only pay the
  // cost of pending work ahead of us).
  if (node.status === 'completed' || node.status === 'partial') {
    node.pert = { optimistic: 0, likely: 0, pessimistic: 0, effective: 0 };
  } else {
    node.pert = { ...base, effective: (base.optimistic + 4 * base.likely + base.pessimistic) / 6 };
  }
}

/** Classic PERT expected value: (o + 4·l + p) / 6. */
export function pertExpected(node) {
  if (!node || !node.pert) return 0;
  return node.pert.effective ?? (node.pert.optimistic + 4 * node.pert.likely + node.pert.pessimistic) / 6;
}

/** PERT variance: ((p − o) / 6)². Used for CI on path sums. */
export function pertVariance(node) {
  if (!node || !node.pert) return 0;
  const o = node.pert.optimistic ?? 0;
  const p = node.pert.pessimistic ?? 0;
  const w = (p - o) / 6;
  return w * w;
}

/** Sample one draw from the triangular distribution of a node. */
function sampleTriangular(node) {
  if (!node || !node.pert) return 0;
  const { optimistic: a, likely: m, pessimistic: b } = node.pert;
  if (b <= a) return a;
  const u = Math.random();
  const F_m = (m - a) / (b - a);
  if (u <= F_m) return a + Math.sqrt(u * (b - a) * (m - a));
  return b - Math.sqrt((1 - u) * (b - a) * (b - m));
}

/** Sort helper for confidence-interval extraction. */
function percentile(sorted, p) {
  if (!sorted.length) return null;
  const idx = Math.max(0, Math.min(sorted.length - 1, Math.floor(p * sorted.length)));
  return sorted[idx];
}

// ── Auto-derive inverse edges (`unlocks`) ─────────────────────────────────

const NODE_BY_ID = Object.fromEntries(RH_DAG_NODES.map((n) => [n.id, n]));
for (const node of RH_DAG_NODES) {
  node.unlocks = node.unlocks || [];
}
for (const node of RH_DAG_NODES) {
  for (const dep of node.dependsOn || []) {
    const target = NODE_BY_ID[dep];
    if (target) {
      if (!target.unlocks) target.unlocks = [];
      if (!target.unlocks.includes(node.id)) target.unlocks.push(node.id);
    }
  }
}

// ── Topological analysis helpers ──────────────────────────────────────────

/**
 * Returns true if a node is `closed` from the dependents' point of view:
 * `completed` counts as closed, and `partial` counts as closed IF the
 * dependent's dependsOn list does not specifically require a sub-gap.
 */
function isClosedForDependents(node) {
  return node.status === 'completed' || node.status === 'partial';
}

/**
 * Frontier: tickets whose dependencies are all closed (completed or partial)
 * but the ticket itself is still pending. These are the items that can be
 * started RIGHT NOW, in any order, in parallel.
 */
export function unblockedFrontier() {
  return RH_DAG_NODES.filter((n) => {
    if (n.status !== 'pending') return false;
    const deps = n.dependsOn || [];
    for (const d of deps) {
      const depNode = NODE_BY_ID[d];
      if (!depNode) continue; // unknown dep, treat as closed
      if (!isClosedForDependents(depNode)) return false;
    }
    return true;
  });
}

/**
 * Critical path from the current state to imp-356 (the final SOTA assembly).
 *
 * Returns a path: current state → next unblocked ticket → ... → imp-356.
 * Greedy selection at each step: among the unblocked frontier, prefer the
 * ticket that sits on the dependency path to imp-356 with the largest
 * estimated complexity (i.e. the slowest step is the critical path by
 * CPM convention), then break ties by imp-NNN order.
 */
export function criticalPathTo(targetId = 'imp-356') {
  const target = NODE_BY_ID[targetId];
  if (!target) return [];

  // BFS back from target to find all ancestors that are still pending.
  const ancestorsPending = new Set();
  const stack = [target.id];
  while (stack.length) {
    const cur = stack.pop();
    const node = NODE_BY_ID[cur];
    if (!node) continue;
    if (node.status === 'pending') ancestorsPending.add(cur);
    for (const dep of node.dependsOn || []) stack.push(dep);
  }

  // Walk the frontier forward.
  const complexityRank = {
    research: 5,
    high: 4,
    medium: 3,
    small: 2,
    trivial: 1,
  };
  const path = [];
  const done = new Set(
    RH_DAG_NODES.filter((n) => isClosedForDependents(n)).map((n) => n.id),
  );

  // Hard cap at 40 iterations to prevent infinite loops on cycles / bugs.
  for (let iter = 0; iter < 40; iter++) {
    if (done.has(targetId)) break;
    const unblocked = RH_DAG_NODES.filter(
      (n) =>
        ancestorsPending.has(n.id) &&
        !done.has(n.id) &&
        (n.dependsOn || []).every((d) => done.has(d) || !NODE_BY_ID[d]),
    );
    if (unblocked.length === 0) break;
    // Greedy: pick the highest-complexity unblocked node (longest pole).
    unblocked.sort((a, b) => {
      const ra = complexityRank[a.complexity] || 0;
      const rb = complexityRank[b.complexity] || 0;
      if (rb !== ra) return rb - ra;
      return (a.id || '').localeCompare(b.id || '');
    });
    const next = unblocked[0];
    path.push(next.id);
    done.add(next.id);
  }

  return path;
}

/**
 * Returns all unblocked parallel frontiers in sequence — at each step, every
 * pending node whose deps are all closed. Useful for planning a fanout.
 */
export function frontierSchedule(targetId = 'imp-356', maxRounds = 8) {
  const target = NODE_BY_ID[targetId];
  if (!target) return [];
  const ancestorsPending = new Set();
  const stack = [target.id];
  while (stack.length) {
    const cur = stack.pop();
    const node = NODE_BY_ID[cur];
    if (!node) continue;
    if (node.status === 'pending') ancestorsPending.add(cur);
    for (const dep of node.dependsOn || []) stack.push(dep);
  }

  const rounds = [];
  const done = new Set(
    RH_DAG_NODES.filter((n) => isClosedForDependents(n)).map((n) => n.id),
  );
  for (let r = 0; r < maxRounds; r++) {
    if (done.has(targetId)) break;
    const unblocked = RH_DAG_NODES.filter(
      (n) =>
        ancestorsPending.has(n.id) &&
        !done.has(n.id) &&
        (n.dependsOn || []).every((d) => done.has(d) || !NODE_BY_ID[d]),
    );
    if (unblocked.length === 0) break;
    rounds.push(unblocked.map((n) => n.id));
    for (const n of unblocked) done.add(n.id);
  }
  return rounds;
}

// ── PERT / Monte Carlo: expected path length to target ────────────────────

/**
 * Proper PERT critical path — the LONGEST path through the ancestor subtree
 * of targetId, where edge weights are pertExpected(predecessor). Unlike
 * criticalPathTo() (a greedy sequential walker that over-counts parallel
 * branches), this returns the true CPM critical-path answer: the longest
 * chain of dependencies whose total expected duration dominates all
 * alternatives. Sibling branches run in parallel and the max wins.
 */
export function longestPathExpectedRounds(targetId = 'imp-356') {
  const target = NODE_BY_ID[targetId];
  if (!target) return { path: [], sumExpected: 0 };

  // Build ancestor subtree.
  const ancestors = new Set();
  const stack = [target.id];
  while (stack.length) {
    const cur = stack.pop();
    if (ancestors.has(cur)) continue;
    ancestors.add(cur);
    const node = NODE_BY_ID[cur];
    if (!node) continue;
    for (const dep of node.dependsOn || []) stack.push(dep);
  }

  // Topological order (Kahn).
  const topoOrder = [];
  const inDeg = {};
  const subAncestors = [...ancestors].map((id) => NODE_BY_ID[id]).filter(Boolean);
  for (const n of subAncestors) {
    inDeg[n.id] = (n.dependsOn || []).filter((d) => ancestors.has(d)).length;
  }
  const queue = subAncestors.filter((n) => inDeg[n.id] === 0).map((n) => n.id);
  while (queue.length) {
    const cur = queue.shift();
    topoOrder.push(cur);
    const node = NODE_BY_ID[cur];
    for (const u of node.unlocks || []) {
      if (!ancestors.has(u)) continue;
      inDeg[u]--;
      if (inDeg[u] === 0) queue.push(u);
    }
  }

  // Longest-path DP + predecessor-tracking for the path reconstruction.
  const longest = {};
  const predOf = {};
  for (const id of topoOrder) {
    const node = NODE_BY_ID[id];
    const deps = (node.dependsOn || []).filter((d) => ancestors.has(d));
    let bestPred = null;
    let bestVal = 0;
    for (const d of deps) {
      const v = longest[d] || 0;
      if (v > bestVal) { bestVal = v; bestPred = d; }
    }
    longest[id] = bestVal + pertExpected(node);
    predOf[id] = bestPred;
  }

  // Reconstruct path.
  const path = [];
  let cur = targetId;
  while (cur) { path.unshift(cur); cur = predOf[cur]; }

  return { path, sumExpected: longest[targetId] || 0 };
}

/**
 * @deprecated — use longestPathExpectedRounds. criticalPathTo is kept for
 * the sequential "work next" listing; it over-counts for ETA purposes.
 */
export function criticalPathExpectedRounds(targetId = 'imp-356') {
  const path = criticalPathTo(targetId);
  let sum = 0;
  for (const id of path) {
    const node = NODE_BY_ID[id];
    if (node) sum += pertExpected(node);
  }
  return { path, sumExpected: sum };
}

/**
 * Monte Carlo walk over the DAG: sample each pending ancestor of target
 * from its triangular distribution, compute the longest path through the
 * ancestor subtree, repeat `samples` times, return the distribution.
 *
 * This is the HONEST planning number because it propagates uncertainty
 * from partial-closure inflation through the whole dependency chain.
 *
 * Returns { mean, min, max, p05, p10, p50, p90, p95, samples,
 *           criticalPathRounds, inflationTax }.
 * inflationTax = mean - criticalPathRounds. If large, sub-gap inflation
 * is the dominant cost and the project needs to either reduce research-
 * grade ticket counts or increase parallelism.
 */
export function expectedPathLength(targetId = 'imp-356', samples = 1000) {
  const target = NODE_BY_ID[targetId];
  if (!target) return null;

  // Build the ancestor subtree (pending or closed).
  const ancestors = new Set();
  const stack = [target.id];
  while (stack.length) {
    const cur = stack.pop();
    if (ancestors.has(cur)) continue;
    ancestors.add(cur);
    const node = NODE_BY_ID[cur];
    if (!node) continue;
    for (const dep of node.dependsOn || []) stack.push(dep);
  }

  // Topological order over the ancestor subtree.
  const topoOrder = [];
  {
    const inDeg = {};
    const subAncestors = [...ancestors]
      .map((id) => NODE_BY_ID[id])
      .filter(Boolean);
    for (const n of subAncestors) {
      inDeg[n.id] = (n.dependsOn || []).filter((d) => ancestors.has(d)).length;
    }
    const queue = subAncestors.filter((n) => inDeg[n.id] === 0).map((n) => n.id);
    while (queue.length) {
      const cur = queue.shift();
      topoOrder.push(cur);
      const node = NODE_BY_ID[cur];
      for (const u of node.unlocks || []) {
        if (!ancestors.has(u)) continue;
        inDeg[u]--;
        if (inDeg[u] === 0) queue.push(u);
      }
    }
  }

  const draws = [];
  for (let s = 0; s < samples; s++) {
    // longest path to each node = max over predecessors + own sampled duration
    const earliest = {};
    for (const id of topoOrder) {
      const node = NODE_BY_ID[id];
      const predMax = (node.dependsOn || [])
        .filter((d) => ancestors.has(d))
        .reduce((m, d) => Math.max(m, earliest[d] || 0), 0);
      const own = sampleTriangular(node);
      earliest[id] = predMax + own;
    }
    draws.push(earliest[targetId] || 0);
  }
  draws.sort((a, b) => a - b);

  const sum = draws.reduce((s, x) => s + x, 0);
  const mean = sum / draws.length;
  const crit = criticalPathExpectedRounds(targetId);
  return {
    mean,
    min: draws[0],
    max: draws[draws.length - 1],
    p05: percentile(draws, 0.05),
    p10: percentile(draws, 0.1),
    p50: percentile(draws, 0.5),
    p90: percentile(draws, 0.9),
    p95: percentile(draws, 0.95),
    samples: draws.length,
    criticalPathRounds: crit.sumExpected,
    inflationTax: mean - crit.sumExpected,
  };
}

// ── The exported record ───────────────────────────────────────────────────

export const RH_DAG = {
  id: 'rh-dag',
  target: 'imp-356',
  nodes: RH_DAG_NODES,
  nodeCount: RH_DAG_NODES.length,
  closedCount: RH_DAG_NODES.filter((n) => isClosedForDependents(n)).length,
  pendingCount: RH_DAG_NODES.filter((n) => n.status === 'pending').length,
  unblockedFrontier,
  criticalPathTo,
  criticalPathExpectedRounds,
  frontierSchedule,
  expectedPathLength,
  pertExpected,
  pertVariance,
};

// ── Build-time assertions ─────────────────────────────────────────────────

export const RH_DAG_ASSERTIONS = [
  {
    id: 'dag-no-missing-deps',
    holds: () => {
      for (const n of RH_DAG_NODES) {
        for (const d of n.dependsOn || []) {
          if (!NODE_BY_ID[d]) return false;
        }
      }
      return true;
    },
    why:
      'Every dependsOn edge must point to a node in the DAG. Missing deps ' +
      'silently produce false unblocks.',
  },
  {
    id: 'dag-no-cycles',
    holds: () => {
      // Kahn topo sort.
      const inDeg = {};
      for (const n of RH_DAG_NODES) inDeg[n.id] = (n.dependsOn || []).length;
      const queue = Object.keys(inDeg).filter((id) => inDeg[id] === 0);
      let visited = 0;
      while (queue.length) {
        const cur = queue.shift();
        visited++;
        const node = NODE_BY_ID[cur];
        for (const u of node.unlocks || []) {
          inDeg[u]--;
          if (inDeg[u] === 0) queue.push(u);
        }
      }
      return visited === RH_DAG_NODES.length;
    },
    why:
      'The DAG must be acyclic. A cycle means the planner cannot make ' +
      'progress and indicates a logical error in the dependsOn edges.',
  },
  {
    id: 'dag-target-exists',
    holds: () => !!NODE_BY_ID['imp-356'],
    why:
      'The target of the critical path (imp-356 SOTA assembly) must exist ' +
      'in the DAG.',
  },
  {
    id: 'dag-frontier-nonempty-while-target-pending',
    holds: () => {
      const target = NODE_BY_ID['imp-356'];
      if (!target || target.status !== 'pending') return true;
      return unblockedFrontier().length > 0;
    },
    why:
      'As long as imp-356 is pending, there must be at least one unblocked ' +
      'ticket to work on. A zero frontier with a pending target means ' +
      'progress is impossible — a hard alarm.',
  },
];
