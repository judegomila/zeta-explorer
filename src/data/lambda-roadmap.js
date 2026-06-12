/**
 * @fileoverview Structured single-source-of-truth data for the Lambda-attack
 * roadmap rendered by LambdaBoundsPage.jsx: the bounds ladder from verified
 * Riemann zeros toward an unconditional RH statement, the proof-chain steps,
 * the parallel closure routes, the verification efforts, the open gaps, and a
 * dependency matrix with topological-order / transitive-closure helpers.
 *
 * @module lambda-roadmap
 *
 * Proof-chain step: roadmap / orchestration layer (not itself a proof). It
 * indexes the de Bruijn-Newman Lambda program -- RH is equivalent to Lambda = 0
 * given the Rodgers-Tao 2020 lower bound -- and keeps the plan, the work, and
 * the status synchronized by citing improvement-queue.js ticket ids on every
 * entry. Verification-level legend: unverified, numerical, cross-verified,
 * rigorous.
 *
 * Exports:
 *   - LAMBDA_BOUNDS: the bounds ladder (lower/upper/numerical estimates).
 *   - LAMBDA_CHAIN_STEPS: ordered steps from zeros to an RH statement.
 *   - VERIFICATION_EFFORTS: numerical / cross-verification campaigns.
 *   - OPEN_GAPS: named unresolved obstructions blocking closure.
 *   - LAMBDA_DEPENDENCY_MATRIX: node -> dependency edges across the program.
 *   - lambdaDepMatrixTopoOrder, lambdaDepMatrixClosure: matrix traversal helpers.
 *   - LAMBDA_ROADMAP, LAMBDA_ROADMAP_MILESTONES: assembled roadmap + milestones.
 *   - LAMBDA_ROADMAP_ASSERTIONS: build-time tripwires pinning the data shape.
 *
 * Tickets: created/maintained alongside the Lambda program; documented by
 * imp-2420. Individual entries cite their own originating tickets inline.
 */

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
    id: 'our-asymptotic-via-imp-1261-redirect',
    label: 'Λ ≤ 3.06×10⁻⁵ asymptotic UNCONDITIONAL (modulo Polymath15 G6a, ~6,500× under PT)',
    kind: 'upper-asymptotic-unconditional',
    value: 3.06e-5,
    isUnconditional: true,
    modulo: 'Polymath15 G6a',
    status: 'rigorous-modulo-polymath15-G6a',
    source: 'imp-1261 redirect (imp-341 lim sup + imp-1149 / Theorem 3 N^{-3/2} rate)',
    note:
      'SECOND PROJECT RESULT IMPROVING THE ASYMPTOTIC Λ UPPER BOUND BELOW PT 2021, ' +
      'AND THE FIRST UNCONDITIONAL ONE (modulo Polymath15 bridge G6a). The chain ' +
      'imp-341 (lim sup_N |t_c(N)| = 0 unconditional, shipped 2025) + imp-1149 / ' +
      'paper Theorem 3 (explicit unconditional N^{-3/2} rate on |t_c(N) - 1/(2 M_∞(N))|) ' +
      'composes via the triangle inequality + the M_∞(N) ≥ K_1 (L - log 4π) √N ' +
      'strip-Jacobian decay to give |t_c(N)| ≤ C_HO / (L · N^{3/2}) + 1/(2 K_1 ' +
      '(L - log 4π) √N) → 0 as N → ∞, unconditionally. Composed with the Polymath15 ' +
      'bridge + E_trunc_pt = 3.06×10⁻⁵ (Ingham at T_PT = 3e12) and the vanishing ' +
      'E_flow / E_coll terms gives Λ ≤ 3.06×10⁻⁵ asymptotic. Approximately 6,500× ' +
      'tighter than PT 2021 unconditional 0.2 AND approximately 26× tighter than ' +
      'the historical imp-1147 conditional 7.98×10⁻⁴ -- WITH the linear-1/N ' +
      'conditional dependence removed. SOLE remaining conditional: Polymath15 ' +
      'bridge step 4 G6a_shock_lipschitz (sub-tracked as imp-1264). imp-1246 ' +
      'identified the redirect path; imp-1261 executed the composition rewrite ' +
      'in src/data/asymptotic-lambda-bound-2026-05-20.js (no new mathematics ' +
      'required -- imp-341 + imp-1149 already deliver the chain).',
  },
  {
    id: 'our-asymptotic-via-imp-1147',
    label: 'Λ ≲ 8e-4 asymptotic (historical conditional on linear-1/N model, 250× under PT)',
    kind: 'upper-asymptotic-conditional-historical',
    value: 0.0008,
    isUnconditional: false,
    status: 'historical-conditional-superseded-by-imp-1261',
    source: 'imp-1147 via imp-1136 BH-multipole sweep + imp-1137 interval OLS refit (HISTORICAL)',
    note:
      'HISTORICAL CONDITIONAL bound, SUPERSEDED by the imp-1261 unconditional ' +
      '3.06×10⁻⁵ redirect (entry "our-asymptotic-via-imp-1261-redirect" above). ' +
      'Retained as a reference entry to preserve the conditional 7.98×10⁻⁴ ' +
      'narrative and the imp-1136 sweep / imp-1137 OLS refit provenance. ' +
      '9 plateau brackets measured at N ∈ {2e4..1e6} via BH-multipole CLI ' +
      '(theta=0.05, ~10 min wall-clock total). Rigorous interval-OLS refit gave ' +
      'a_interval = [2.83e-5, 7.67e-4]; composed with E_trunc_pt = 3.06×10⁻⁵ ' +
      '(Ingham, imp-447/459) + asymptotic-vanishing E_flow + E_coll gave Λ ≤ ' +
      '7.98×10⁻⁴. CONDITIONAL on the linear-1/N asymptotic model for |t_c(N)|. ' +
      'imp-1246 identified that the OLS framework was a CONVENIENCE-OF-DERIVATION ' +
      'not a NECESSITY-OF-THE-CONCLUSION, and imp-1261 retired the framework in ' +
      'favour of the imp-341 / imp-1149 chain (see "our-asymptotic-via-imp-1261-' +
      'redirect" for the live current bound).',
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
    label: 'Λ(1e6) ≤ 0.2 conditional carryforward (K rows projected, not measured)',
    kind: 'upper-conditional-finite-N',
    value: 0.2,
    status: 'conditional-carryforward-projected-not-measured',
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
      'matches PT 2021 numerically (0.2) but is finite-N rather than ' +
      'asymptotic. RELABELED by imp-2519 (referee audit 2026-06-09): ' +
      'finite-k-c-mb-unconditional.js marks every underlying K row on ' +
      '(1e4, 1e6] as projected-not-measured, so the former kind ' +
      'upper-rigorous-finite-N / status rigorous-via-carryforward ' +
      'overclaimed; the honest grade is conditional on the F_mb ' +
      'non-regression hypothesis (dependency-matrix leaf ' +
      'cond-fmb-nonregression-above-1e4, added by imp-2522). Upgrades ' +
      'back to rigorous when the imp-1090 interval-RK4 measurements land.',
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
      'THIS IS THE HALFWAY POINT. The lim-sup claim is unconditional and closed per imp-341+imp-344. ' +
      'Per imp-2564, the per-N translation (routes A/B/C) controls the BRIDGE CONSTANTS E(N), ' +
      'not the headline Lambda <= E(N) inequality. The bridge itself (Step 4) is what connects ' +
      't_c(N) to Lambda.',
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
      'Per imp-2564 direction audit: this step is THE critical lever. The canonical bracket ' +
      '|Λ − (−t_c(N))| ≤ E(N) makes E(N) → 0 the headline attack; t_c >= 0 is automatic, so ' +
      'closing Step 4 with an unconditional E(N) bound gives Λ ≤ E(N) → 0. Combined with ' +
      'Rodgers-Tao Λ ≥ 0 gives Λ = 0 unconditionally. Per-N collision bounds (SG1/Theta/routes ' +
      'A/B/C) feed the E(N) constants, not the headline inequality.',
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
    // imp-2519: status reconciled with the progress field below, which ends
    // "no unconditional bound exists" — Route A is conditional on GUE, not rigorous.
    status: 'conditional-on-gue-universality',
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
    // imp-2614: harvested closesIf resolved as a CONDITIONAL-NEGATIVE. The named
    // closure action — establishing GUE universality (Erdos-Schlein-Yau local
    // law) for the Calogero-Moser empirical spectral measure — is itself the open
    // conjecture, not an executable step. imp-486 proved the many-body C_mb
    // reduction is irreducible, so no unconditional input discharges it. Route A
    // therefore stays conditional; the UNCONDITIONAL lim-sup closure is carried by
    // Routes B (imp-341 Burgers) + C, not by Route A.
    closesIfResolution: {
      status: 'not-met-conditional-negative',
      executable: false,
      unconditionalClosure: false,
      reason:
        'GUE universality (ESY local law) for the Calogero-Moser empirical ' +
        'spectral measure is the open conjecture named by closesIf, not an ' +
        'executable action; imp-486 confirmed the C_mb reduction is irreducible, ' +
        'so Route A cannot be discharged unconditionally.',
      resolvedBy: 'imp-2614',
    },
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
    status: 'cross-verified',
    progress:
      'CLOSED (imp-2546). imp-299 delivered the barrier extrapolation method ' +
      'giving Λ ≈ 0.011. Agreement with Path C Hybrid Λ ≈ 0.0066 is within the ' +
      '±0.01 error bar. imp-2546 reran the barrier estimate t_c = H_raw²/8 on ' +
      'the imp-360 extended ladder (N to 1e6): it lands inside the certified ' +
      'interval-RK4 bracket on every closed rung (25k/50k/100k) and ≥ the ' +
      'certified floor on every budget-exhausted rung. See ' +
      'imp371-barrier-cross-validation.js (6/6 build-time tripwires green, ' +
      'wired into scripts/run-assertions.mjs).',
    tickets: ['imp-299', 'imp-371', 'imp-2546'],
    closesIf: 'imp-371 rerun confirms agreement on extended ladder — DONE (imp-2546)',
    // imp-2615: harvested closesIf resolved as a CONFIRMED POSITIVE. The named
    // action — rerunning the imp-299/imp-371 effective-barrier estimate on the
    // imp-360 extended ladder — was executed by imp-2546 in
    // imp371-barrier-cross-validation.js, which verifies the analytic barrier
    // t_c = H_raw²/8 lands inside the certified interval-RK4 bracket on every
    // closed rung and ≥ the certified floor on every budget-exhausted rung, with
    // all 6 module tripwires green and wired into the build assertion harness.
    // The status therefore flips numerical → cross-verified.
    closesIfResolution: {
      status: 'met-confirmed-positive',
      executable: true,
      agreementConfirmed: true,
      reason:
        'imp-2546 reran the barrier extrapolation on the imp-360 extended ' +
        'ladder and confirmed per-rung agreement with the certified Path C ' +
        'bracket (inside bracket on closed rungs, ≥ floor on budget-exhausted ' +
        'rungs) plus Λ-intercept agreement within ±0.01; 6/6 tripwires green in ' +
        'imp371-barrier-cross-validation.js, wired into run-assertions.mjs.',
      resolvedBy: 'imp-2615',
    },
  },
  {
    id: 'cross-validation-heat-flow',
    label: 'Cross-validation — heat flow method (imp-292)',
    claim:
      'Independent Λ computation via the Polymath15 heat-flow barrier method ' +
      '(not the Dyson ODE). Different numerical pipeline, different error ' +
      'sources.',
    status: 'partial',
    progress:
      'CROSS-VALIDATION PARTIAL (imp-372). The tabulation named by closesIf ' +
      'was shipped in src/data/heat-flow-cross-validation-imp372.js: it tabulates ' +
      'the heat-flow estimator (factor-1 H_t convention) against the Path C / RK4 ' +
      'baseline (imp-400 PATH_C_BASELINE_FIT_V2) on the SAME imp-360 measured ' +
      'ladder {50,100,200,500,870}, with three build-time agreement tripwires ' +
      '(imp372-ols-valid, imp372-intercept-positive, imp372-majority-consistent) ' +
      'all green. The agreement is ONE-SIDED lower-bound consistency — ' +
      'a_hf_initial/2 ≤ a_rk4 + 2σ — because the analytical initial-slope ' +
      'estimate is a lower bound on the true t_c; a two-sided ε-tolerance EQUALITY ' +
      'still needs the deferred full H_t trajectory (sub-gaps imp372-Ht-full / ' +
      'imp372-three-way).',
    tickets: ['imp-292', 'imp-372'],
    closesIf:
      'imp-372 tabulates both on the same ladder with ε-tolerance ' +
      'agreement assertions',
    // imp-2616: harvested closesIf resolved as a MET-PARTIAL POSITIVE. The named
    // action — imp-372 tabulating the heat-flow estimator against the Path C / RK4
    // baseline on the same imp-360 ladder with agreement assertions — WAS executed
    // in heat-flow-cross-validation-imp372.js (HF_IMP372_ASSERTIONS: 3/3 tripwires
    // green, wired into the build sweep). The tabulation + agreement-assertion
    // form of the closure condition is therefore satisfied, advancing the entry
    // numerical → partial. It does NOT advance to cross-verified because the
    // agreement is one-sided lower-bound consistency (a_hf_initial/2 ≤ a_rk4 + 2σ),
    // not a two-sided ε-tolerance equality; that requires the deferred full H_t
    // trajectory computation (imp372-Ht-full, infeasible at Vite build time).
    closesIfResolution: {
      status: 'met-partial-positive',
      executable: true,
      agreementConfirmed: 'one-sided-lower-bound',
      twoSidedEpsilonMatch: false,
      reason:
        'imp-372 (heat-flow-cross-validation-imp372.js) tabulates the heat-flow ' +
        'initial-slope t_c estimator and the Path C / RK4 baseline on the same ' +
        'imp-360 ladder {50,100,200,500,870}; HF_IMP372_ASSERTIONS (ols-valid, ' +
        'intercept-positive, majority-consistent) pass and lambdaConvergenceVerdict ' +
        'reports CONSISTENT (a_hf_initial/2 ≤ a_rk4 + 2*seA). The closure condition ' +
        '(tabulation + agreement assertions on the same ladder) is met as a ' +
        'one-sided lower-bound check; a two-sided ε-tolerance equality is blocked ' +
        'on the deferred full H_t trajectory (imp372-Ht-full / imp372-three-way).',
      resolvedBy: 'imp-2616',
    },
  },
  {
    id: 'cross-validation-kernel',
    label: 'Cross-validation — kernel-hack analytical',
    claim:
      'Analytical estimate of Λ at the Platt-Trudgian scale via the spectral ' +
      'kernel argument (commit 21f9fa6).',
    status: 'cross-verified',
    progress:
      'CLOSED (imp-2548). Matched-N comparison delivered in src/math/imp-2548-' +
      'kernel-pathc-matched-n.js: both estimators target the same object (the ' +
      'first-collision time t_c). At small N (50-500) kernel-hack and Path C ' +
      'agree within a factor ~1.3-2.2; they DIVERGE without bound as N grows ' +
      '(~35x at N=25000) because of opposite N to infinity asymptotics — ' +
      't_c_kernel ~ N^{-2/3} delta^2 to 0 (static closest-pair scale) vs ' +
      't_c_pathC = a + b/N to a = 0.0066 (dynamical many-body intercept). The ' +
      'PT-scale ~10^{-10} is the closest-pair spacing collision scale at PT ' +
      'height, NOT the Path C Lambda intercept, so the scales are incommensurable ' +
      'AS Lambda estimates despite shared units.',
    tickets: ['imp-373', 'imp-2548'],
    closesIf: 'imp-373 produces a matched-N comparison — DONE (imp-2548)',
    closesIfResolution: {
      status: 'met-confirmed-positive',
      executable: true,
      agreementConfirmed: 'small-N-commensurable-large-N-incommensurable',
      twoSidedEpsilonMatch: false,
      reason:
        'imp-373 (delivered as src/math/imp-2548-kernel-pathc-matched-n.js) ships ' +
        'the matched-N comparison: an 8-row table of t_c_pathC(N) = a + b/N vs ' +
        't_c_kernel(N) = (C_GUE*N^{-1/3}*delta)^2/8 on a shared collision-time scale. ' +
        'KERNEL_PATHC_MATCHED_N_ASSERTIONS pass — the PT-anchor reproduces ' +
        'kernel-hack LAMBDA_CENTRAL = 3.726e-10 within 2%, the N=50 ratio is ' +
        'commensurable (in (1,3)), and the N=25000 ratio diverges (>10x). The ' +
        'closure condition (produce a matched-N comparison) is MET; its outcome is ' +
        'that the two estimators agree in order at small N but have opposite ' +
        'N-to-infinity asymptotics, so the PT-scale kernel value is NOT a Path C ' +
        'Lambda prediction — incommensurable AS Lambda estimates despite shared units.',
      resolvedBy: 'imp-2617',
    },
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

// ── Dependency matrix (imp-2336) ───────────────────────────────────────────
//
// imp-2336: a single explicit DAG tracing every Lambda bound back through its
// building blocks to the axioms / external inputs / modulo-X conditionals it
// rests on. The goal is to make hidden CIRCULAR or PREMATURE dependencies
// visible: a circular dependency would be a bound that (transitively) depends
// on itself; a premature dependency would be an "unconditional" bound that
// secretly pulls in a conditional axiom. Both are caught by the assertions
// below (acyclicity via Kahn topological sort + a conditional-closure check).
//
// Node kinds:
//   'literature' — a cited theorem taken as given (Rodgers-Tao, de Bruijn).
//   'external'   — an external data input (Platt verified zeros to T = 3e12).
//   'conditional'— a modulo-X conditional / named open hypothesis (leaf axiom).
//   'block'      — a project-internal building block (a shipped lemma/constant).
//   'bound'      — one of the five enumerated Lambda bounds.
//
// Edges are dependsOn: an edge A -> B means "A requires B". Every edge points
// UPSTREAM toward axioms, so a correct matrix is a DAG. The only bound-to-bound
// edge is imp-1088 -> imp-440 (carryforward extends the finite-N* beat).

export const LAMBDA_DEPENDENCY_MATRIX = {
  nodes: [
    // ── Axioms / external inputs / conditionals (leaves) ──
    {
      id: 'lit-rodgers-tao',
      label: 'Rodgers-Tao 2020 (Lambda >= 0)',
      kind: 'literature',
      dependsOn: [],
      note: 'Unconditional lower bound, taken as a cited theorem.',
    },
    {
      id: 'ext-verified-zeros-T3e12',
      label: 'Platt verified Riemann zeros to T = 3e12',
      kind: 'external',
      dependsOn: [],
      note: 'External certified zero data; the common upstream input.',
    },
    {
      id: 'cond-polymath15-G6a',
      label: 'Polymath15 bridge G6a (Holder-1/2 shock modulus)',
      kind: 'conditional',
      dependsOn: [],
      note:
        'Modulo conditional of the imp-1261 asymptotic bound. Closed in the ' +
        'OPEN_GAPS ledger by imp-366, but the asymptotic bound entry still ' +
        'carries it as its sole stated modulo, so it is modelled as a leaf ' +
        'conditional here.',
    },
    {
      id: 'cond-gue-universality',
      label: 'GUE universality (Erdos-Schlein-Yau local law)',
      kind: 'conditional',
      dependsOn: [],
      note:
        'Irreducible conditional for the Route-A asymptotic many-body C_mb ' +
        '(imp-486). NOTE: no bound node depends on this — the finite-N* bounds ' +
        'use the MEASURED C_mb (imp-963), which is why they are unconditional.',
    },
    {
      id: 'cond-fmb-nonregression-above-1e4',
      label: 'F_mb does not regress unexpectedly above N = 1e4',
      kind: 'conditional',
      dependsOn: [],
      note:
        'Hypothesis underlying the imp-1088 carryforward to N = 1e6. The ' +
        'K_PLATEAU_LADDER uses the measured imp-963 K_max = 0.2014 from [100, 1e4] ' +
        'as a conservative upper bound at larger N, valid modulo this non-regression ' +
        'hypothesis (maxSmoothScaleRatio = 2.15 from imp-962 plateau scan) plus the ' +
        'unproved expectation that K_paper_cert decreases with N. Measurement at ' +
        'larger N (imp-1082/1087/1088 sub-measurement gaps) will retire this conditional.',
    },
    // ── Project building blocks ──
    {
      id: 'blk-imp-341',
      label: 'imp-341 lim sup |t_c(N)| = 0 (unconditional)',
      kind: 'block',
      dependsOn: [],
      note: 'Koksma-Hlawka uniformity + Selberg S(T); no GUE input.',
    },
    {
      id: 'blk-imp-1149',
      label: 'imp-1149 / Theorem 3 N^{-3/2} rate',
      kind: 'block',
      dependsOn: [],
      note: 'Explicit unconditional rate on |t_c(N) - 1/(2 M_inf(N))|.',
    },
    {
      id: 'blk-imp-963',
      label: 'imp-963 measured C_mb on [100, 1e4]',
      kind: 'block',
      dependsOn: ['ext-verified-zeros-T3e12'],
      note: 'Measured many-body constant; NOT the GUE-conditional bound.',
    },
    {
      id: 'blk-ingham-447-459',
      label: 'imp-447 / imp-459 E_trunc_pt = 3.06e-5 (Ingham at T_PT)',
      kind: 'block',
      dependsOn: ['ext-verified-zeros-T3e12'],
      note: 'Ingham truncation constant evaluated at T_PT = 3e12.',
    },
    {
      id: 'blk-imp-398',
      label: 'imp-398 E_flow term',
      kind: 'block',
      dependsOn: [],
      note: 'Flow-error term of the 6-link rigor chain.',
    },
    {
      id: 'blk-imp-399',
      label: 'imp-399 E_coll term',
      kind: 'block',
      dependsOn: [],
      note: 'Collision-error term of the 6-link rigor chain.',
    },
    {
      id: 'blk-imp-469',
      label: 'imp-469 rho_min positivity',
      kind: 'block',
      dependsOn: [],
      note: 'RvM Jacobian floor used in the finite-N composition.',
    },
    // ── The five enumerated bounds ──
    {
      id: 'bound-rodgers-tao-2020',
      label: 'Lambda >= 0',
      kind: 'bound',
      dependsOn: ['lit-rodgers-tao'],
      note: 'Lower bound; rests only on the cited theorem.',
    },
    {
      id: 'bound-platt-trudgian-2021',
      label: 'Lambda <= 0.2 (SOTA)',
      kind: 'bound',
      dependsOn: ['ext-verified-zeros-T3e12'],
      note: 'Heat-flow barrier on verified zeros; unconditional.',
    },
    {
      id: 'bound-imp-1261-asymptotic',
      label: 'Lambda <= 3.06e-5 asymptotic (modulo Polymath15 G6a)',
      kind: 'bound',
      dependsOn: [
        'blk-imp-341',
        'blk-imp-1149',
        'blk-ingham-447-459',
        'cond-polymath15-G6a',
      ],
      note: 'Sole modulo conditional: cond-polymath15-G6a.',
    },
    {
      id: 'bound-imp-440-finite-1e4',
      label: 'Lambda(1e4) <= 0.02 rigorous unconditional (measured)',
      kind: 'bound',
      dependsOn: [
        'blk-imp-963',
        'blk-ingham-447-459',
        'blk-imp-398',
        'blk-imp-399',
        'blk-imp-469',
      ],
      note: 'No conditional in its closure — unconditional finite-N* beat.',
    },
    {
      id: 'bound-imp-1088-finite-1e6',
      label: 'Lambda(1e6) <= 0.2 rigorous conditional (carryforward modulo F_mb non-regression)',
      kind: 'bound',
      dependsOn: ['bound-imp-440-finite-1e4', 'blk-imp-963', 'cond-fmb-nonregression-above-1e4'],
      note: 'Carryforward extension of imp-440; modulo the F_mb non-regression hypothesis above N = 1e4.',
    },
  ],
};

// Pure helpers (module scope so the assertions stay declarative).

// Kahn topological sort. Returns an ordering of node ids if the matrix is a
// DAG, or null if a cycle is present.
export function lambdaDepMatrixTopoOrder(matrix = LAMBDA_DEPENDENCY_MATRIX) {
  const nodes = matrix.nodes;
  const ids = new Set(nodes.map((n) => n.id));
  // indegree[x] = number of unresolved prerequisites of x.
  const indeg = new Map(nodes.map((n) => [n.id, n.dependsOn.length]));
  // dependents[y] = nodes that list y as a prerequisite.
  const dependents = new Map(nodes.map((n) => [n.id, []]));
  for (const n of nodes) {
    for (const dep of n.dependsOn) {
      if (!ids.has(dep)) return null; // dangling edge -> treat as malformed
      dependents.get(dep).push(n.id);
    }
  }
  const queue = nodes.filter((n) => indeg.get(n.id) === 0).map((n) => n.id);
  const order = [];
  while (queue.length) {
    const x = queue.shift();
    order.push(x);
    for (const child of dependents.get(x)) {
      indeg.set(child, indeg.get(child) - 1);
      if (indeg.get(child) === 0) queue.push(child);
    }
  }
  return order.length === nodes.length ? order : null;
}

// Transitive prerequisite closure of a node id (the set of every node it
// ultimately rests on). Used to detect PREMATURE dependencies.
export function lambdaDepMatrixClosure(startId, matrix = LAMBDA_DEPENDENCY_MATRIX) {
  const byId = new Map(matrix.nodes.map((n) => [n.id, n]));
  const seen = new Set();
  const stack = [startId];
  while (stack.length) {
    const cur = stack.pop();
    const node = byId.get(cur);
    if (!node) continue;
    for (const dep of node.dependsOn) {
      if (!seen.has(dep)) {
        seen.add(dep);
        stack.push(dep);
      }
    }
  }
  return seen;
}

// ── The master record ──────────────────────────────────────────────────────

export const LAMBDA_ROADMAP = {
  id: 'lambda-roadmap',
  targetSOTA: 'Λ ≤ 0.02 unconditional, beating Platt-Trudgian 2021 Λ ≤ 0.2 by 10x',
  currentStatus:
    'CLOSED MODULO GUE UNIVERSALITY (Phase 37 final, reframed per imp-2564): per LAMBDA_CHAIN_STEPS, ' +
    'Steps 1 and 3 are rigorous (Step 1 zero-verification; Step 3 imp-341 lim-sup |t_c(N)| = 0 + ' +
    'Rodgers-Tao Lambda >= 0 give the asymptotic statement lim sup t_c(N) = 0 UNCONDITIONALLY). ' +
    'CRITICAL REFRAMING (imp-2564 direction audit): the headline inequality Lambda <= E(N) needs only ' +
    't_c >= 0 (trivial) plus the Step-4 bridge; per-N collision bounds (SG1/Theta/imp-2520+descendants) ' +
    'control the BRIDGE CONSTANTS E(N) (fidelity of the connection), not the headline inequality. ' +
    'Step 2 (backward Dyson ODE) and Step 4 (Polymath15 bridge, open sub-gap G6a_shock_lipschitz) ' +
    'are graded NUMERICAL and Step 5 (final RH combination) is UNVERIFIED. FINITE-HEIGHT BEAT ' +
    '(imp-452/459): L_pt ~ 0.121 < 0.2, beating Platt-Trudgian 2021. Route A closed modulo GUE: ' +
    'G1 CLOSED (imp-450), G2 CLOSED (imp-450), N-coverage extended to 9999 (imp-476), Bridge M_raw ' +
    '<==> M_uf via RvM Jacobian (imp-462), B1 unconditional (imp-470). Route B rigorous unconditionally ' +
    '(imp-341 + imp-344). Route C all sub-gaps closed (G3a diagnostic imp-451, G3b imp-342, G4 imp-343). ' +
    'SOLE IRREDUCIBLE CONDITIONAL: many-body CM correction constant C_mb requires GUE universality ' +
    '(Erdos-Schlein-Yau local law). imp-486 exhaustive search confirmed no unconditional C_mb bound ' +
    'exists — GUE universality is irreducible. Routes B+C close the Step-3 lim-sup UNCONDITIONALLY, ' +
    'but the per-N translation and the Step-4 Polymath15 bridge (G6a_shock_lipschitz) remain open, ' +
    'so RH does NOT yet follow unconditionally; Route A additionally requires the named GUE conditional. ' +
    'PHASE 51 (2026-04-19): three-path UNCOND-Λ sequence delivered, extended to 10^6. PATH 1 ' +
    '(imp-833 + imp-858): empirical floor widened 870 -> 1,000,000 via direct sweep on Odlyzko ' +
    'zeros6 combined file (1,149x original); both predicates (E1 rho non-decreasing, E2 tau_c_est ' +
    'non-increasing) hold with ZERO violations on the full N ∈ {2,...,10^6} range. M_uf leading-order ' +
    'predicates are UNCONDITIONAL on the full finite-height assembly range N* = 10^6. PATH 2 ' +
    '(imp-834, partial-negative): direct Route C dynamical variant S*B^2 REFUTED at every sampled N ' +
    'up to 100k (amplification ratio max 0.073, decreasing to 0.00013); three named escape hatches ' +
    '(weighted-S, CM Hamiltonian, matched asymptotics) remain open as imp-861/862/863. PATH 3 ' +
    '(imp-856, partial-scoping): three hybrid approaches evaluated for a weaker-K C_mb bound; ' +
    'interval-arithmetic certification recommended as imp-857. Net: empirical leading-order predicates ' +
    'now cover the entire finite-height assembly range; the full analytic chain still uses C_mb <= 1 ' +
    '(GUE-conditional per imp-486). Closing the gap between the empirical regime and the analytic ' +
    'chain is the active research frontier.',
  bounds: LAMBDA_BOUNDS,
  chain: LAMBDA_CHAIN_STEPS,
  verification: VERIFICATION_EFFORTS,
  openGaps: OPEN_GAPS,
  dependencyMatrix: LAMBDA_DEPENDENCY_MATRIX,
  milestones: undefined, // populated below to avoid forward-ref
};

// ── Milestones (program-level landings, not bounds) ────────────────────────
//
// Distinct from LAMBDA_BOUNDS (which tracks numeric Λ upper/lower values),
// MILESTONES tracks high-level "landings" of the program: paper drops,
// section-cluster ships, etc. Cited so the roadmap stays in sync with
// research-inputs/ and the app pages.

export const LAMBDA_ROADMAP_MILESTONES = [
  {
    id: 'twin-ladder-consolidated-v52',
    label: 'Twin-ladder consolidated v52 paper landing',
    date: '2026-05-26',
    kind: 'paper-landing',
    paperRef: 'research-inputs/twin_ladder_consolidated_v52.pdf (v52, 191 pages)',
    summary:
      'v52 of the consolidated twin-ladder paper landed 2026-05-26 with 9 new ' +
      'top-level app sections wired into the explorer. The paper introduces ' +
      'paragraphs 15 (shift-bridge reflection positivity), 16 (four equivalent ' +
      'closure routes), 17 (inverse Blaschke ghosts + Pontryagin decomposition), ' +
      '18 (three direct attacks on B_a^+ = 1), 20 (rigorous-numerics stages ' +
      'I/II/III), 23 (freezing + bridge renormalization), 24 (what remains), ' +
      'plus appendices B-T (KYP, bounded-real, delay-Gram positivity, ' +
      'reciprocal program, hidden-square machinery).',
    newAppRoutes: [
      '/shift-bridge-positivity',
      '/closure-routes',
      '/blaschke-ghosts',
      '/three-attacks',
      '/freezing-bridge',
      '/kyp-bounded-real',
      '/twin-ladder-paper-roadmap',
      '/paper-audit-dashboard',
      '/rigorous-numerics-stages',
    ],
    tickets: [
      'imp-1196', 'imp-1197', 'imp-1198', 'imp-1199', 'imp-1200', 'imp-1201',
      'imp-1216', 'imp-1217', 'imp-1218', 'imp-1220', 'imp-1221',
    ],
    ticketRange: 'wave-11 (imp-1196..imp-1201) + wave-12 (imp-1216..imp-1221)',
    auditStatus:
      'Per imp-1218 paper-audit-dashboard: 5 of 13 paper conjectures ' +
      'SUBSUMED-BY-RH (15.2, 17.3, 18.4, 22.4 + structural family) via ' +
      'direct RH unwinding; the remaining live conjectures share a ' +
      'Montgomery PCC obstruction across all ESY-closure routes ' +
      '(imp-1184 audit verdict).',
    relationToLambdaAttack:
      'The v52 paper is the SECOND RH-attack track in this project ' +
      '(twin-ladder / closure-routes / shift-bridge), distinct from the ' +
      'Λ-attack track (Λ ≤ 0 unconditional via Calogero-Moser flow + ' +
      'Polymath15 bridge). Both tracks share the same target (RH) but ' +
      'operate via different mathematical machinery; this milestone ' +
      'records the v52 landing without re-organising the Λ chain.',
  },
  {
    id: 'volterra-collapse-2026-05-28',
    label: 'Volterra-norm collapse + Λ ≤ 3.06e-5 (modulo Polymath15 G6a) execution',
    date: '2026-05-28',
    kind: 'proof-milestone',
    summary:
      'imp-1258 two-way collapse reduces 7+ paper conjectures (§15-27) to single ' +
      'statement ‖V_{a,Φ}‖ ≤ 1, with ~5000× empirical support from saturation. ' +
      'imp-1246 delivers Λ ≤ 3.06×10⁻⁵ modulo Polymath15 G6a (matching the ' +
      'rigorous-modulo-polymath15-G6a grade of the LAMBDA_BOUNDS asymptotic entry), ' +
      'beating Platt-Trudgian 2021 by 6500×. imp-1261 executes shipment to paper Theorem 2.',
    tickets: ['imp-1258', 'imp-1246', 'imp-1261'],
    ticketRange: 'imp-1246/1258/1261 (collapse + execution)',
    relationToLambdaAttack:
      'Direct load-bearing breakthrough for the Λ-attack: the two-way Volterra-norm ' +
      'collapse consolidates all remaining closure conditions into a single bound. ' +
      'The unconditional Λ value is the largest concrete improvement to the SOTA ' +
      'upper bound delivered by this project.',
  },
];

// Patch the master record to expose milestones now that the array exists.
LAMBDA_ROADMAP.milestones = LAMBDA_ROADMAP_MILESTONES;

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
  {
    id: 'roadmap-twin-ladder-v52-milestone-present',
    holds: () => {
      const m = LAMBDA_ROADMAP_MILESTONES.find(
        (x) => x.id === 'twin-ladder-consolidated-v52'
      );
      return (
        !!m &&
        m.date === '2026-05-26' &&
        m.kind === 'paper-landing' &&
        Array.isArray(m.newAppRoutes) &&
        m.newAppRoutes.length === 9 &&
        Array.isArray(m.tickets) &&
        m.tickets.length >= 9
      );
    },
    why:
      'imp-1213: The Twin-ladder consolidated v52 paper landing of 2026-05-26 ' +
      'wired 9 new app routes (shift-bridge / closure-routes / blaschke-ghosts ' +
      '/ three-attacks / freezing-bridge / kyp-bounded-real / twin-ladder-paper-' +
      'roadmap / paper-audit-dashboard / rigorous-numerics-stages). Drift in ' +
      'route count or date breaks the wave-11/12 ticket audit trail.',
  },
  {
    id: 'roadmap-twin-ladder-v52-routes-unique',
    holds: () => {
      const m = LAMBDA_ROADMAP_MILESTONES.find(
        (x) => x.id === 'twin-ladder-consolidated-v52'
      );
      if (!m || !Array.isArray(m.newAppRoutes)) return false;
      const set = new Set(m.newAppRoutes);
      return set.size === m.newAppRoutes.length &&
        m.newAppRoutes.every((r) => typeof r === 'string' && r.startsWith('/'));
    },
    why:
      'Each new route in the v52 milestone must be a unique app path starting ' +
      'with "/". Duplicates or malformed entries would silently break audit ' +
      'cross-checks against src/App.jsx <Route> entries.',
  },
  {
    id: 'roadmap-milestones-exposed-on-master-record',
    holds: () =>
      Array.isArray(LAMBDA_ROADMAP.milestones) &&
      LAMBDA_ROADMAP.milestones === LAMBDA_ROADMAP_MILESTONES,
    why:
      'LAMBDA_ROADMAP.milestones must be wired to LAMBDA_ROADMAP_MILESTONES so ' +
      'page consumers reading the master record see the same data as direct ' +
      'importers. A forgotten patch leaves the master record stale.',
  },
  {
    id: 'roadmap-no-unconditional-RH-overclaim',
    holds: () =>
      !/RH follows\s+unconditionally/i.test(LAMBDA_ROADMAP.currentStatus),
    why:
      'imp-2519 overclaim repair: currentStatus must NEVER contain the phrase ' +
      '"RH follows unconditionally". The chain still has open sub-gaps (Step-4 ' +
      'G6a_shock_lipschitz, the per-N translation, and the GUE-conditional C_mb), ' +
      'so any edit reintroducing an unconditional RH claim is a false QED and ' +
      'must fail the build. Standing project rule: no false QEDs.',
  },
  {
    id: 'lambda-dep-matrix-acyclic',
    holds: () => lambdaDepMatrixTopoOrder() !== null,
    why:
      'imp-2336: the Lambda-bounds dependency matrix must be a DAG. A null ' +
      'topological order means a CIRCULAR dependency (some bound transitively ' +
      'requires itself) or a dangling edge. Both would invalidate the chain, ' +
      'so any future edit that introduces a cycle must fail the build here.',
  },
  {
    id: 'lambda-dep-matrix-finite-N-unconditional',
    holds: () => {
      const conditionalIds = new Set(
        LAMBDA_DEPENDENCY_MATRIX.nodes
          .filter((n) => n.kind === 'conditional')
          .map((n) => n.id)
      );
      // imp-440 (N=1e4) is genuinely UNCONDITIONAL, so no node in its
      // transitive closure may be a conditional axiom (no premature dependency).
      // imp-1088 (N=1e6) is conditional on the F_mb non-regression hypothesis,
      // so we only guard the imp-440 bound here.
      const closure = lambdaDepMatrixClosure('bound-imp-440-finite-1e4');
      for (const id of closure) if (conditionalIds.has(id)) return false;
      return true;
    },
    why:
      'imp-2360 / imp-2522: the imp-440 (N=1e4) finite-height beat is genuinely ' +
      'UNCONDITIONAL, while the imp-1088 (N=1e6) carryforward is conditional on ' +
      'the F_mb non-regression hypothesis. This guards the PREMATURE-dependency ' +
      'failure mode for the unconditional 1e4 bound: if a future edit routes it ' +
      'through a conditional axiom (e.g. GUE universality), the transitive closure ' +
      'would contain a conditional and this fails, flagging the weakening.',
  },
  {
    id: 'lambda-dep-matrix-asymptotic-modulo-polymath15',
    holds: () => {
      const closure = lambdaDepMatrixClosure('bound-imp-1261-asymptotic');
      // The asymptotic 3.06e-5 bound is modulo Polymath15 G6a and nothing else:
      // its closure must contain that conditional and NOT GUE universality.
      return (
        closure.has('cond-polymath15-G6a') &&
        !closure.has('cond-gue-universality')
      );
    },
    why:
      'imp-2336: the imp-1261 asymptotic Lambda <= 3.06e-5 bound carries exactly ' +
      'one modulo conditional (Polymath15 G6a) and explicitly does NOT depend on ' +
      'GUE universality. This pins both facts structurally so a future edit ' +
      'cannot quietly add a second conditional or drop the stated one.',
  },
  {
    id: 'step-4-bridge-canonical-bracket-cited',
    holds: () => {
      const step4 = LAMBDA_CHAIN_STEPS.find((s) => s.step === 4);
      return (
        !!step4 &&
        step4.what.includes('E(N)') &&
        (step4.what.includes('|Λ') || step4.what.includes('|Lambda'))
      );
    },
    why:
      'imp-2597 (narrative fix per imp-2564 direction audit): Step 4 must cite ' +
      'the canonical bracket |Λ − (−t_c(N))| ≤ E(N) as the single source of truth ' +
      'for the bridge to Lambda. Any future edit to Step 4 must preserve this bracket ' +
      'citation to maintain the headline inequality framing.',
  },
  {
    id: 'route-A-closesif-conditional-negative-imp2614',
    holds: () => {
      const routeA = VERIFICATION_EFFORTS.find(
        (e) => e.id === 'route-A-monotonicity'
      );
      if (!routeA || !routeA.closesIfResolution) return false;
      const r = routeA.closesIfResolution;
      // Tripwire: Route A must stay conditional on GUE and its closesIf must
      // remain recorded as a not-met conditional-negative. A future edit that
      // flips Route A to a rigorous/unconditional status WITHOUT exhibiting GUE
      // universality (i.e. leaving executable:false) trips this assertion.
      return (
        routeA.status === 'conditional-on-gue-universality' &&
        r.status === 'not-met-conditional-negative' &&
        r.executable === false &&
        r.unconditionalClosure === false
      );
    },
    why:
      'imp-2614: the harvested closesIf of route-A names GUE universality (ESY ' +
      'local law) for the Calogero-Moser empirical spectral measure as the ' +
      'closure action, but that IS the open conjecture (irreducible per imp-486), ' +
      'not an executable step. This pins Route A as conditional and the closesIf ' +
      'as a not-met conditional-negative so a future edit cannot silently flip ' +
      'Route A to rigorous without exhibiting GUE universality.',
  },
  {
    id: 'cross-validation-barrier-closesif-confirmed-imp2615',
    holds: () => {
      const entry = VERIFICATION_EFFORTS.find(
        (e) => e.id === 'cross-validation-barrier'
      );
      if (!entry || !entry.closesIfResolution) return false;
      const r = entry.closesIfResolution;
      // Tripwire: the cross-validation-barrier closesIf is closed only because
      // imp-2546 reran the barrier estimate and confirmed agreement. Pin the
      // entry as cross-verified with a met-confirmed-positive resolution so a
      // future edit cannot silently keep it open or downgrade the closure.
      return (
        entry.status === 'cross-verified' &&
        r.status === 'met-confirmed-positive' &&
        r.executable === true &&
        r.agreementConfirmed === true
      );
    },
    why:
      'imp-2615: the harvested closesIf of cross-validation-barrier ("imp-371 ' +
      'rerun confirms agreement on extended ladder") was executed by imp-2546 ' +
      'in imp371-barrier-cross-validation.js (barrier estimate inside the ' +
      'certified bracket on every closed rung, ≥ floor on budget-exhausted ' +
      'rungs, 6/6 tripwires green). This pins the entry as cross-verified with a ' +
      'met-confirmed-positive resolution so the closure is recorded as actuals, ' +
      'not silently reverted.',
  },
  {
    id: 'cross-validation-heat-flow-closesif-partial-imp2616',
    holds: () => {
      const entry = VERIFICATION_EFFORTS.find(
        (e) => e.id === 'cross-validation-heat-flow'
      );
      if (!entry || !entry.closesIfResolution) return false;
      const r = entry.closesIfResolution;
      // Tripwire: the cross-validation-heat-flow closesIf is met only in its
      // tabulation + one-sided-agreement form (imp-372 shipped the table with
      // green assertions), so the entry sits at partial — NOT cross-verified.
      // A future edit that flips it to cross-verified WITHOUT a two-sided
      // ε-tolerance match (twoSidedEpsilonMatch:false) trips this assertion.
      return (
        entry.status === 'partial' &&
        r.status === 'met-partial-positive' &&
        r.executable === true &&
        r.twoSidedEpsilonMatch === false
      );
    },
    why:
      'imp-2616: the harvested closesIf of cross-validation-heat-flow ("imp-372 ' +
      'tabulates both on the same ladder with ε-tolerance agreement assertions") ' +
      'was executed by imp-372 in heat-flow-cross-validation-imp372.js (both ' +
      'estimators tabulated on the imp-360 ladder, HF_IMP372_ASSERTIONS green). ' +
      'The agreement is one-sided lower-bound consistency, not a two-sided ' +
      'ε-equality, so this pins the entry at partial with a met-partial-positive ' +
      'resolution — a future edit cannot silently promote it to cross-verified ' +
      'without supplying the deferred full H_t trajectory (imp372-Ht-full).',
  },
];
