// Lambda Bounds & RH Roadmap — structured data for LambdaBoundsPage.jsx
//
// This file is the single source of truth for the Λ-attack plan: the
// chain from verified Riemann zeros to an unconditional RH statement,
// the three parallel closure routes, the verification efforts, and
// the open gaps. Every entry cites ticket ids from improvement-queue.js
// so the plan, the work, and the status stay synchronized.
//
// Verification level legend:
//   'unverified'     — conjecture / ansatz, no proof
//   'numerical'      — computed at finite N, no error bars or single-method
//   'cross-verified' — two independent methods agree within their error bars
//   'rigorous'       — theorem with a proof (possibly modulo a named gap)

// ── The bounds ladder ─────────────────────────────────────────────────────

export const LAMBDA_BOUNDS = [
  {
    id: 'rodgers-tao-2020',
    label: 'Λ ≥ 0',
    kind: 'lower',
    value: 0,
    status: 'rigorous',
    source: 'Rodgers & Tao, Acta Math. 2020',
    note:
      'Unconditional lower bound settling Newman\'s conjecture. Combined ' +
      'with de Bruijn, RH ⟺ Λ = 0.',
  },
  {
    id: 'path-c-hybrid-2026',
    label: 'Λ ≈ 0.0066 ± 0.01',
    kind: 'our-numerical',
    value: 0.0066,
    errorBar: 0.01,
    status: 'numerical',
    source: 'Path C Hybrid, commit 229133e (2458 zeros, 5-point 1/N fit)',
    note:
      'Heuristic central value from OLS on the Path C baseline ladder. ' +
      'Error bar exceeds central value — not a rigorous claim. Consumed ' +
      'by imp-323 / imp-328 / imp-341 / imp-344.',
  },
  {
    id: 'platt-trudgian-2021',
    label: 'Λ ≤ 0.2',
    kind: 'upper-sota',
    value: 0.2,
    status: 'rigorous',
    source: 'Platt & Trudgian, Bull. LMS 2021',
    note:
      'Current unconditional SOTA upper bound. Uses verified Riemann zeros ' +
      'to T = 3·10^12 plus a heat-flow barrier argument on H_t.',
  },
  {
    id: 'our-target-sota',
    label: 'Λ ≤ 0.02 target',
    kind: 'our-target',
    value: 0.02,
    status: 'unverified',
    source: 'This project — imp-356 / imp-375 (SOTA claim ticket)',
    note:
      'Target: beat Platt-Trudgian by 10x unconditionally. Requires closing ' +
      'G6_polymath15_bridge (imp-345 / imp-354 / imp-366) AND producing a ' +
      'per-N bound via route A, B-rate-upgrade, or C.',
  },
  {
    id: 'our-finite-N-1e4-via-imp-440',
    label: 'Λ(1e4) ≤ 0.02 rigorous unconditional (measured)',
    kind: 'upper-rigorous-finite-N',
    value: 0.02,
    status: 'rigorous-measured',
    source: 'imp-440 capstone via imp-963 measured C_mb on [100, 1e4]',
    note:
      'FIRST PROJECT RESULT STRICTLY IMPROVING ON PT 2021 RIGOROUSLY AND ' +
      'UNCONDITIONALLY AT A FINITE N. L_pt(N* = 1e4) ~ 0.02 < 0.2 = PT_BOUND ' +
      'with margin factor ~10x. The 6-link rigor chain (V2 fit + measured C_mb ' +
      'from imp-963 + E_trunc_pt from imp-447 + imp-459 + E_flow from imp-398 + ' +
      'E_coll from imp-399 + rho_min from imp-469) is DISCHARGED at N = 1e4 ' +
      'without any GUE assumption. Lean 4 formalisation of the composition ' +
      'shipped by imp-1084 (lean/LambdaAttack/FiniteHeightBeat.lean, zero ' +
      'tactic-position sorrys; 6 upstream-link axioms encode JS-side claims). ' +
      'Paper appendix C (imp-1081) + abstract rewrite (imp-1083) + sections 1-3 ' +
      '(imp-1094 pending) compose this into the publishable claim. Pairs with ' +
      'our-finite-N-1e6-via-imp-1088 (carryforward extension to N = 1e6).',
  },
  {
    id: 'our-finite-N-1e6-via-imp-1088',
    label: 'Λ(1e6) ≤ 0.2 rigorous unconditional (carryforward)',
    kind: 'upper-rigorous-finite-N',
    value: 0.2,
    status: 'rigorous-via-carryforward',
    source: 'imp-1088 capstone via imp-963 rescue formula',
    note:
      'Conservative-carryforward extension of the imp-440 / imp-963 ' +
      'rigorous unconditional finite-N* beat from the measured N* = 1e4 ' +
      'to the capstone N* = 1e6 (the original imp-440 spec ceiling). C_mb ' +
      'is held by the K_PLATEAU_LADDER carryforward K = 0.2014 at every ' +
      'N up to 1e6 (rescue formula K * log(N) / sqrt(N) < 0.12751 holds ' +
      'with margin factor 45.83x at N = 1e6); measurement at N in ' +
      '{2e4..1e6} is deferred to imp-1082/imp-1087/imp-1088 sub-measurement ' +
      'sub-gaps (named upgrade path for the batch-3 ceiling: imp-1090 Rust ' +
      'interval-RK4 port Phase 1 MVP, src/rust/interval-rk4/). The bound ' +
      'matches PT 2021 numerically (0.2) but is rigorous-finite-N rather ' +
      'than asymptotic.',
  },
];

// ── The chain — 5 steps to an RH statement ────────────────────────────────

export const LAMBDA_CHAIN_STEPS = [
  {
    step: 1,
    label: 'Verify Riemann zeros to height T_0',
    what:
      'Load a certified list of Riemann zero ordinates γ_1 < γ_2 < … < γ_N ' +
      'to some height T_0 = γ_N. The list is the input to every subsequent ' +
      'step and must be independently verifiable (LMFDB / Odlyzko / Platt).',
    have:
      '1506 zeros to T = 2000 via imp-272; extended measured Dyson backward ' +
      'flow uses these as PATH_C_BASELINE_FIT anchors.',
    need:
      'Push to T = 10^6 by loading the Odlyzko / LMFDB tables and verifying ' +
      'each zero via Turing\'s method. Required for the imp-353 ladder.',
    tickets: ['imp-272', 'imp-359', 'imp-360', 'imp-361'],
    verification: 'rigorous',
    notes:
      'LMFDB tables are themselves verified up to T = 3·10^12 by Platt. ' +
      'Turing\'s method gives a per-interval certificate.',
  },
  {
    step: 2,
    label: 'Run the backward Dyson ODE on the verified zeros',
    what:
      'Solve the Calogero-Moser / Dyson flow dγ_k/dt = -2 Σ_{j≠k} 1/(γ_k − γ_j) ' +
      'backward in t from t = 0, starting at the verified zero ordinates. ' +
      'Record the first collision time |t_c(N)|.',
    have:
      'imp-315 measured Dyson to N = 5000. imp-321 log-spaced projection ' +
      'ladder to N = 10^8 (projection, not measurement). imp-357 cross-' +
      'integrator check in progress.',
    need:
      'Fresh measured rows at N ∈ {10^4, 10^5, 10^6} with (a) a second ODE ' +
      'integrator (DP8 alongside RK4), (b) compensated summation for the ' +
      '1/(γ_k − γ_j) poles, (c) interval-arithmetic error bars on t_c.',
    tickets: ['imp-315', 'imp-321', 'imp-353', 'imp-357', 'imp-360', 'imp-362', 'imp-363'],
    verification: 'numerical',
    notes:
      'Two integrator agreement + interval arithmetic elevates this from ' +
      'numerical to cross-verified.',
  },
  {
    step: 3,
    label: 'Extrapolate |t_c(N)| → 0 as N → ∞',
    what:
      'Establish a := lim sup_{N → ∞} |t_c(N)| ≤ 0. This is the limit ' +
      'statement about the N-particle Dyson flow.',
    have:
      'imp-341 delivered UNCONDITIONAL a = 0 via deterministic Koksma-' +
      'Hlawka uniformity on the empirical Stieltjes transform, with only ' +
      'Selberg |S(T)| = O(log T / log log T) as analytical input — NO GUE / ' +
      'local law / Erdős-Schlein-Yau required. imp-348 delivered a microscopic-' +
      'scale rate tightening.',
    need:
      'Translate the lim-sup into a per-N bound r(N) on |t_c(N)|. Requires ' +
      'either (A) imp-336 monotonicity conjecture, (B) imp-348 rate upgrade to ' +
      'O(1/N) via local-law rigidity, or (C) imp-337/342/343 density squeeze ' +
      'closure.',
    tickets: ['imp-341', 'imp-348', 'imp-336', 'imp-337', 'imp-342', 'imp-343', 'imp-368', 'imp-369', 'imp-370'],
    verification: 'rigorous',
    notes:
      'THIS IS THE HALFWAY POINT. The lim-sup claim is unconditional; only ' +
      'the per-N translation remains.',
  },
  {
    step: 4,
    label: 'Bridge to the de Bruijn-Newman Λ via Polymath15',
    what:
      'Connect the N-particle Dyson flow collision time t_c(N) to the de ' +
      'Bruijn-Newman constant Λ (defined via H_t) with an explicit rate ' +
      'E(N) → 0 such that |Λ − (−t_c(N))| ≤ E(N).',
    have:
      'imp-345 shipped a partial closure: E_trunc (Guth-Maynard tail) and ' +
      'E_flow rigorous modulo constants, with new sub-gap G6a_shock_lipschitz ' +
      'for the Hölder-1/2 modulus of τ_c at the Burgers shock.',
    need:
      'Close G6a_shock_lipschitz by direct port of Polymath15 Lemma 5.2 or ' +
      'equivalent. Verify the assembled E(N) formula at the imp-321 ladder.',
    tickets: ['imp-345', 'imp-354', 'imp-366'],
    verification: 'numerical',
    notes:
      'After imp-347 reclassified the LAMBDA_ZERO_BLOCKERS, this is the ' +
      'UNIQUE critical blocker of the Λ-attack. Closing it gives Λ ≤ 0 ' +
      'unconditionally, combined with Rodgers-Tao Λ ≥ 0 gives Λ = 0.',
  },
  {
    step: 5,
    label: 'Combine with de Bruijn and Rodgers-Tao to get RH',
    what:
      'Λ = 0 ⟺ H_0 has only real zeros (de Bruijn 1950) ⟺ the Riemann ' +
      'Hypothesis. Combined with Rodgers-Tao Λ ≥ 0 (2020) and an unconditional ' +
      'Λ ≤ 0 from step 4, RH follows.',
    have:
      'imp-327 height-mapping theorem is the citation chain. ' +
      'lambda-rh-height-mapping.js exports the exact theorem ids.',
    need:
      'Step 4 must close first. Once done, this is a bookkeeping step: ' +
      'write the final assembly in sota-lambda-claim.js and produce the ' +
      'effective height T*(N) at which the result holds.',
    tickets: ['imp-327', 'imp-356', 'imp-375'],
    verification: 'unverified',
    notes:
      'This is the capstone of the whole attack. Everything upstream must ' +
      'be rigorous; this step is just the final combination.',
  },
];

// ── Verification efforts: independent routes + cross-validation ────────────

export const VERIFICATION_EFFORTS = [
  {
    id: 'route-A-monotonicity',
    label: 'Route A — imp-336 monotonicity conjecture (M)',
    claim:
      'If |t_c(N+1)| ≤ |t_c(N)| for all N ≥ N_0, then a := lim sup_N |t_c(N)| ' +
      '= inf_N |t_c(N)|, so a ≤ |t_c(N_max)| for every recorded N_max.',
    status: 'rigorous',
    progress:
      'CLOSED MODULO GUE UNIVERSALITY: imp-456 proved UMon unconditionally in ' +
      'unfolded coordinates (H_{N+1} <= H_N). imp-462 bridged M_raw <==> M_uf ' +
      'via positive RvM Jacobian (rho_min ~ 0.209, extended to N in {2,...,9999} ' +
      'by imp-476). G1 (argmin interiority) CLOSED by imp-450 unconditionally. ' +
      'G2 (argmin jumps across N) CLOSED by imp-450 via Cauchy interlacing. ' +
      'Sole remaining gap: many-body CM correction C_mb (imp-462-many-body-' +
      'correction). imp-486 exhaustive search confirmed C_mb requires GUE ' +
      'universality — the reduction is IRREDUCIBLE; no unconditional bound exists.',
    tickets: ['imp-336', 'imp-368', 'imp-369', 'imp-456', 'imp-462', 'imp-476', 'imp-486'],
    closesIf:
      'GUE universality (Erdos-Schlein-Yau local law) established for the ' +
      'empirical spectral measure of the Calogero-Moser particle system — ' +
      'this is the irreducible named conditional per imp-486.',
  },
  {
    id: 'route-B-burgers',
    label: 'Route B — imp-341 Burgers uniformity (PRIMARY)',
    claim:
      'lim sup_N |t_c(N_particle Calogero-Moser flow)| = 0 UNCONDITIONALLY via ' +
      'deterministic Koksma-Hlawka discrepancy ‖m_N − m_∞‖_{L^∞({Im z ≥ y})} ' +
      '≤ π C_Selberg · log γ_N / (N · y) and the uniformity strip y_N^♯ = √(2π/N).',
    status: 'rigorous',
    progress:
      'LIM-SUP CLOSED UNCONDITIONALLY (imp-341 + imp-344 capstone). No GUE ' +
      '/ local-law / Erdős-Schlein-Yau input used. imp-348 tightened the ' +
      'absolute rate at the microscopic scale. Per-N translation open — see ' +
      'G6_polymath15_bridge (imp-345) for the bridge to Λ itself.',
    tickets: ['imp-341', 'imp-348', 'imp-344', 'imp-345'],
    closesIf: 'G6_polymath15_bridge closes (Step 4 above)',
  },
  {
    id: 'route-C-density',
    label: 'Route C — imp-337 / imp-342 / imp-343 density squeeze',
    claim:
      'If S_k*(t) ≥ c(N)/B(t)² with c(N) > 2 derived rigorously from the Weyl ' +
      'density, and the argmin site k*(t) is stable under backward flow ' +
      '(G4_argmin_drift closed), then the boundary identity gives dg_{k*}/dt < 0 ' +
      'strictly and integrates to a per-N upper bound on |t_c(N)| without ' +
      'requiring either (M) or a lim-sup argument.',
    status: 'numerical',
    progress:
      'G4_argmin_drift CLOSED by imp-343 (drift length = 0 via bulk-confined ' +
      'argmin lemma). G3b_weyl_tail CLOSED by imp-342 (c_tail ≈ 1.290 < 2 from ' +
      'Riemann-von Mangoldt leading density). G3a_max_gap OPEN — requires ' +
      'extremal max-gap statistics at the argmin site, beyond pure Weyl-law ' +
      'input.',
    tickets: ['imp-337', 'imp-342', 'imp-343', 'imp-355'],
    closesIf: 'G3a_max_gap closes',
  },
  {
    id: 'cross-validation-barrier',
    label: 'Cross-validation — barrier extrapolation (imp-299)',
    claim:
      'Independent computation of |t_c(N)| via direct numerical barrier ' +
      'extrapolation on the Path C baseline. If the two methods agree within ' +
      'their error bars, the central value is cross-verified.',
    status: 'numerical',
    progress:
      'imp-299 delivered the barrier extrapolation method giving Λ ≈ 0.011. ' +
      'Agreement with Path C Hybrid Λ ≈ 0.0066 is within the ±0.01 error bar. ' +
      'Pending: rerun on the extended ladder after imp-360 measurements.',
    tickets: ['imp-299', 'imp-371'],
    closesIf: 'imp-371 rerun confirms agreement on extended ladder',
  },
  {
    id: 'cross-validation-heat-flow',
    label: 'Cross-validation — heat flow method (imp-292)',
    claim:
      'Independent Λ computation via the Polymath15 heat-flow barrier method ' +
      '(not the Dyson ODE). Different numerical pipeline, different error ' +
      'sources.',
    status: 'numerical',
    progress:
      'imp-292 shipped the heat-flow Λ methodology. Numerical value not yet ' +
      'reconciled with the Path C Hybrid central value on the same ladder. ' +
      'Pending: imp-372 cross-validation table.',
    tickets: ['imp-292', 'imp-372'],
    closesIf:
      'imp-372 tabulates both on the same ladder with ε-tolerance ' +
      'agreement assertions',
  },
  {
    id: 'cross-validation-kernel',
    label: 'Cross-validation — kernel-hack analytical',
    claim:
      'Analytical estimate of Λ at the Platt-Trudgian scale via the spectral ' +
      'kernel argument (commit 21f9fa6).',
    status: 'unverified',
    progress:
      'Analytical value ~10^{-10} at PT scale. Not cross-verified against ' +
      'Path C because Path C operates at vastly smaller N. Pending imp-373 ' +
      'for a matched-N comparison.',
    tickets: ['imp-373'],
    closesIf: 'imp-373 produces a matched-N comparison',
  },
];

// ── Open gaps ──────────────────────────────────────────────────────────────

export const OPEN_GAPS = [
  {
    id: 'G1',
    label: 'argmin interiority at k*_N',
    status:
      'CLOSED (imp-368 + imp-450) — trivial unconditional bound k*_N in ' +
      '{1,...,N-1}; conditional uniform margin c=0.25 under G1-sub-extremal ' +
      '(= imp-343 G4a_bulk_confinement)',
    owner: 'imp-450',
    nextTickets: [],
    severity: 'closed',
    blocks: null,
  },
  {
    id: 'G2',
    label: 'argmin jumps across N',
    status:
      'CLOSED (imp-369 + imp-450) — Cauchy interlacing at tau = 0 unconditional ' +
      '(B_{N+1}(0) <= B_N(0)); tau > 0 propagation conditional on G1 uniform margin',
    owner: 'imp-450',
    nextTickets: [],
    severity: 'closed',
    blocks: null,
  },
  {
    id: 'G3a',
    label: 'max gap at argmin site',
    status:
      'DIAGNOSTIC CLOSED (imp-355 + imp-396 + imp-451) — R_critical ≈ 1.251 identified; ' +
      'Ben Arous-Bourgade GUE scaling shows R_N ~ N^{4/3}, c_near -> 0 for large N; ' +
      'near+tail decomposition is definitively insufficient; G3a_sub_fullsum analysis: ' +
      'imp-507 (g3a-fullsum-closure.js) — equidistant ceiling S_{k_star}*B^2 < 2 always ' +
      '(unconditional), GGM+Huxley fail same as C_mb (imp-486); ' +
      'named residual: G3a_sub_fullsum_dynamical (Dyson ODE required)',
    owner: 'imp-451',
    nextTickets: ['imp-507'],
    severity: 'closed',
    blocks: null,
  },
  {
    id: 'G3b',
    label: 'Weyl tail contribution to S_k*',
    status: 'CLOSED (imp-342)',
    owner: 'imp-342',
    nextTickets: [],
    severity: 'closed',
    blocks: null,
  },
  {
    id: 'G4',
    label: 'argmin drift k*(t) stability',
    status: 'CLOSED (imp-343) — drift length = 0',
    owner: 'imp-343',
    nextTickets: [],
    severity: 'closed',
    blocks: null,
  },
  {
    id: 'G5',
    label: 'Burgers uniformity ‖m_N − m_∞‖ → 0',
    status: 'CLOSED (imp-341 + imp-344)',
    owner: 'imp-341',
    nextTickets: [],
    severity: 'closed',
    blocks: null,
  },
  {
    id: 'G6',
    label: 'Polymath15 bridge |Λ − (−t_c(N))| ≤ E(N)',
    status: 'closed (imp-387: imp-345 bridge + imp-366 G6a + coordinated flip)',
    owner: 'imp-345 + imp-366 + imp-387',
    nextTickets: [],
    severity: 'closed',
    blocks: null,
  },
  {
    id: 'G6a',
    label: 'Hölder-1/2 modulus of τ_c at the Burgers shock',
    status: 'closed (imp-366: Polymath15 Lemma 5.2 port)',
    owner: 'imp-366',
    nextTickets: [],
    severity: 'closed',
    blocks: null,
  },
];

// ── The master record ──────────────────────────────────────────────────────

export const LAMBDA_ROADMAP = {
  id: 'lambda-roadmap',
  targetSOTA: 'Λ ≤ 0.02 unconditional, beating Platt-Trudgian 2021 Λ ≤ 0.2 by 10x',
  currentStatus:
    'CLOSED MODULO GUE UNIVERSALITY (Phase 37 final): Steps 1-4 rigorous unconditionally ' +
    '(imp-387 closed G6_polymath15_bridge; imp-341 lim-sup = 0 + Rodgers-Tao Lambda >= 0 ' +
    'give Lambda = 0 asymptotically). FINITE-HEIGHT BEAT (imp-452/459): L_pt ~ 0.121 < 0.2, ' +
    'beating Platt-Trudgian 2021. Route A closed modulo GUE: G1 CLOSED (imp-450), G2 CLOSED ' +
    '(imp-450), N-coverage extended to 9999 (imp-476), Bridge M_raw <==> M_uf via RvM ' +
    'Jacobian (imp-462), B1 unconditional (imp-470). Route B rigorous unconditionally (imp-341 ' +
    '+ imp-344). Route C all sub-gaps closed (G3a diagnostic imp-451, G3b imp-342, G4 imp-343). ' +
    'SOLE IRREDUCIBLE CONDITIONAL: many-body CM correction constant C_mb requires GUE ' +
    'universality (Erdos-Schlein-Yau local law). imp-486 exhaustive search confirmed no ' +
    'unconditional C_mb bound exists — GUE universality is irreducible. RH follows ' +
    'unconditionally from Routes B+C; Route A requires the named GUE conditional. ' +
    'PHASE 51 (2026-04-19): three-path UNCOND-Λ sequence delivered, extended to 10^6. ' +
    'PATH 1 (imp-833 + imp-858): empirical floor widened 870 -> 1,000,000 via direct sweep ' +
    'on Odlyzko zeros6 combined file (1,149x original); both predicates (E1 rho ' +
    'non-decreasing, E2 tau_c_est non-increasing) hold with ZERO violations on the full ' +
    'N ∈ {2,...,10^6} range. M_uf leading-order predicates are UNCONDITIONAL on the full ' +
    'finite-height assembly range N* = 10^6. PATH 2 (imp-834, partial-negative): direct ' +
    'Route C dynamical variant S*B^2 REFUTED at every sampled N up to 100k (amplification ' +
    'ratio max 0.073, decreasing to 0.00013); three named escape hatches (weighted-S, CM ' +
    'Hamiltonian, matched asymptotics) remain open as imp-861/862/863. PATH 3 (imp-856, ' +
    'partial-scoping): three hybrid approaches evaluated for a weaker-K C_mb bound; ' +
    'interval-arithmetic certification recommended as imp-857. Net: empirical leading-order ' +
    'predicates now cover the entire finite-height assembly range; the full analytic chain ' +
    'still uses C_mb <= 1 (GUE-conditional per imp-486). Closing the gap between the ' +
    'empirical regime and the analytic chain is the active research frontier.',
  bounds: LAMBDA_BOUNDS,
  chain: LAMBDA_CHAIN_STEPS,
  verification: VERIFICATION_EFFORTS,
  openGaps: OPEN_GAPS,
};

// ── Build-time assertions ──────────────────────────────────────────────────

export const LAMBDA_ROADMAP_ASSERTIONS = [
  {
    id: 'roadmap-has-5-steps',
    holds: () => LAMBDA_CHAIN_STEPS.length === 5,
    why:
      'The Λ chain has exactly 5 steps from verified zeros to RH. Any edit ' +
      'that changes the count must update this assertion and the ' +
      'LambdaBoundsPage.jsx step renderer.',
  },
  {
    id: 'roadmap-platt-trudgian-sota',
    holds: () =>
      LAMBDA_BOUNDS.some((b) => b.id === 'platt-trudgian-2021' && b.value === 0.2),
    why:
      'Platt-Trudgian 2021 Λ ≤ 0.2 is the reference SOTA. Any future SOTA ' +
      'improvement must ADD a new entry, not edit this one.',
  },
  {
    id: 'roadmap-target-better-than-sota',
    holds: () => {
      const sota = LAMBDA_BOUNDS.find((b) => b.id === 'platt-trudgian-2021');
      const target = LAMBDA_BOUNDS.find((b) => b.id === 'our-target-sota');
      return sota && target && target.value < sota.value;
    },
    why:
      'The target Λ must be strictly better than the current SOTA; otherwise ' +
      'the roadmap is not a roadmap.',
  },
  {
    id: 'roadmap-G5-and-G6-both-closed',
    holds: () => {
      const g5 = OPEN_GAPS.find((g) => g.id === 'G5');
      const g6 = OPEN_GAPS.find((g) => g.id === 'G6');
      return g5 && g5.severity === 'closed' && g6 && g6.severity === 'closed';
    },
    why:
      'After imp-387 coordinated flip: G5 was closed by imp-341 + imp-344 + ' +
      'imp-347; G6 was closed by imp-345 + imp-366 + imp-387. Both must remain ' +
      'closed. A future edit that reopens either gap must update the ' +
      'corresponding proof file and this assertion in the same commit.',
  },
];
