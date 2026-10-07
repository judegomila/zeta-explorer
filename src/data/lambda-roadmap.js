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
    kind: 'upper-peer-reviewed-benchmark',
    value: 0.2,
    status: 'rigorous',
    accepted: true,
    published: true,
    peerReviewed: true,
    source: 'Platt & Trudgian, Bull. LMS 2021',
    note:
      'Peer-reviewed upper-bound benchmark. Uses verified Riemann zeros ' +
      'to T = 3·10^12 plus the Polymath15 heat-flow barrier criterion.',
  },
  {
    id: 'mosaic-public-preprint-01875',
    label: 'Public preprint claim: Λ ≤ 3/16 = 0.1875',
    kind: 'upper-public-preprint',
    value: 0.1875,
    claimedUnconditional: true,
    accepted: false,
    status: 'public-preprint-review-open',
    href: 'https://doi.org/10.5281/zenodo.21175533',
    source: 'Mosaic Intelligence, Zenodo 21175533 (2026); Optimization Problems ledger',
    note:
      'PUBLIC, UNREFEREED CERTIFICATE-PACKAGE CLAIM. A local forensic replay found ' +
      'one omitted load-bearing finite sweep and reconstructed the exact 2,054,013-row ' +
      'tile needed by the final assembly. The repaired chain is reproducible and the ' +
      '0.1875 entry is publicly listed, but neither the ledger nor the local repair is ' +
      'peer review or a correctness endorsement.',
  },
  {
    id: 'local-fixed-height-candidate-01787854',
    label: 'Unreviewed proof candidate: Λ ≤ 0.1787854',
    kind: 'upper-private-proof-candidate',
    value: 0.1787854,
    claimedUnconditional: true,
    established: false,
    countsAsEstablishedUpperBound: false,
    accepted: false,
    published: false,
    peerReviewed: false,
    status: 'unreviewed-proof-candidate',
    route: '/newman-lambda-01787854-candidate',
    repository: 'judegomila/dbn-lambda-01787854-candidate-audit',
    repositoryVisibility: 'private',
    tag: 'review-01787854-v3',
    commit: '2e9976c4becbf97e31c56fe75fce07cdff5dd4ea',
    tree: '7f15ecf8c3dbc73d547a2d4a3f2287bd87802f44',
    manifestSha256: '89a201565d5b4a0f02ab49092e3189c7a6d3b0bfaa4e93630c68cf8c4155ae1c',
    source:
      'Private candidate-audit repository, review-01787854-v3 at ' +
      '2e9976c4becbf97e31c56fe75fce07cdff5dd4ea',
    note:
      'UNREVIEWED COMPUTER-ASSISTED PROOF CANDIDATE for an unconditional upper bound. ' +
      'The v3 package presents certificates for the compact slab, final-time half-strip, ' +
      '3,149,013-row finite replay, corrected 10.50 error bounds, tail, height, and exact ' +
      'Polymath assembly interfaces. Packaging, replay, and sealing do not establish the ' +
      'mathematics: the claim is private, unpublished, unpeer-reviewed, not accepted, and ' +
      'does not prove RH. Platt–Trudgian Λ ≤ 0.2 remains the accepted peer-reviewed benchmark.',
  },
  {
    id: 'local-sharper-candidate-01758354',
    label: 'Sharper unreviewed candidate: Λ ≤ 0.1758354',
    kind: 'upper-private-proof-candidate',
    value: 0.1758354,
    claimedUnconditional: true,
    established: false,
    countsAsEstablishedUpperBound: false,
    accepted: false,
    published: false,
    peerReviewed: false,
    status: 'unreviewed-proof-candidate',
    route: '/lambda-01758354-candidate',
    source: 'This project — four-gate barrier certificate (2026)',
    note:
      'A sharper computer-assisted candidate below 0.1787854: a revised mollifier and an ' +
      'extended finite lane certify four independent gates, each machine-checked in Arb interval ' +
      'arithmetic; the y-transfer reduction and Lemma B3 are Lean-checked. Not established, not peer-reviewed, not RH; ' +
      'Platt–Trudgian Λ ≤ 0.2 remains the benchmark.',
  },
  {
    id: 'external-preprint-raymond-0149396',
    label: 'Third-party public preprint claim: Λ ≤ 0.149396 (Raymond)',
    kind: 'upper-public-preprint',
    value: 0.149396,
    exactRational: '18674384228461/125000000000000 = 0.149395073827688',
    claimedUnconditional: true,
    established: false,
    countsAsEstablishedUpperBound: false,
    accepted: false,
    published: true,
    peerReviewed: false,
    status: 'public-preprint-review-open',
    href: 'https://doi.org/10.5281/zenodo.22867547',
    source: 'Dale James Raymond, "Correlated translated probes and the bound Λ < 0.149396 for the de Bruijn–Newman constant", Zenodo 22867547 (2026-09-21)',
    note:
      'EXTERNAL, THIRD-PARTY, UNREFEREED computer-assisted preprint (not this project). ' +
      'Method: a finite-head localisation wall + uniform logarithmic-derivative estimates + a ' +
      'decreasing zero-height barrier, with the key refinement that nonnegative surplus terms in a ' +
      'one-point value–derivative inequality cannot realise their separate worst cases at two ' +
      'prescribed translations simultaneously (the "correlated translated probes"), plus the finite ' +
      'Euler logarithmic derivative. It CITES Gomila\'s Λ ≤ 0.1787854 (Aug 2026) FOR CONTEXT — not ' +
      'as a proof input; the 0.149396 bound is its own independent construction. Author states it ' +
      'has NOT undergone external peer review, is "not a formalisation of the analytic proof", and ' +
      'verification "does not mechanically prove every analytic argument" (AI-assisted); not a proof ' +
      'of RH. Numerically below this project\'s own unreviewed candidates, but at the same ' +
      '(unrefereed) epistemic grade. Notably it lands INSIDE this program’s independently-derived ' +
      'Route VII floor [0.145, 0.150], and its own Part II Theorem 2 (kernel lever exhausted; only ' +
      'remaining in-architecture lever = a joint two-point source estimate, declared OPEN) corroborates ' +
      'the "new mechanism needed below ≈0.145" prediction (see /frontier-dag · t↓0 program floor). ' +
      'DE-RISKED (2026-09-21): the single load-bearing unchecked step — the AI-assisted re-derivation ' +
      'of Polymath15 effective-approximation theory (AF §4.1 eqs 4.2–4.5, extended to −1≤σ≤2) — was ' +
      'independently verified SOUND by a line-by-line check against Polymath15 (arXiv:1904.12438 §6, ' +
      'eqs 62–64) + numerical replay at 6×10¹²: the one genuine σ≥0 step (the δ₃ remainder) is ' +
      'correctly repaired (valid since his t≤0.164<1/5), the caps R₀/R₁ feed a sound inequality, and ' +
      'the "wrong re-derivation passes every finite replay" failure mode is excluded. Remaining ' +
      'unverified trust surfaces: AF §§6–12 (time-variation, kernel catalogue, coupling), the ' +
      '0.1511→0.149395 rung ladder, and execution of the 2.7M-row replay — so it is a strong, ' +
      'analytic-core-verified candidate, still NOT peer-reviewed and still pinned to verified height ' +
      '≈3×10¹². Platt–Trudgian Λ ≤ 0.2 remains the accepted peer-reviewed benchmark.',
  },
  {
    id: 'permutation-completion-contract-014',
    label: 'Strict Λ ≤ 0.14 completion contract (fail-closed — a contract, not a bound)',
    kind: 'completion-contract',
    value: 0.14,
    claimedUnconditional: false,
    established: false,
    countsAsEstablishedUpperBound: false,
    accepted: false,
    status: 'completion-contract-open',
    route: '/permutation-architecture',
    source: 'This project — “Permuting the Zeta Twin Ladder” (2026-08-24)',
    note:
      'A FAIL-CLOSED CONTRACT, not a proved bound: t0 + y0^2/2 = 7/50 = 0.14 would follow if three ' +
      'zero-free statements hold. Two are closed within scope (the Platt–Trudgian verified height ' +
      'supplies one; a rational intermediate box closes another). The route reduces to ONE open ' +
      'family — a uniform correlated lower-edge enclosure |C_E,17| < 0.27968819555261474 on ' +
      '690988 ≤ N ≤ 54799999 — with the [B_v,Π_p] noncommuting weld as the decisive object. Not ' +
      'promoted; Λ ≤ 0.2 remains SOTA.',
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
    label:
      'Λ ≤ 3.06×10⁻⁵ (asymptotic) — OVERCLAIM CORRECTED: NOT a rigorous sub-PT ' +
      'bound; conditional on RH-equivalent C_H + uncertified E_trunc + unsupplied E(N)→0',
    kind: 'upper-asymptotic-conditional',
    value: 3.06e-5,
    isUnconditional: false,
    modulo: 'RH-equivalent C_H/G6a + uncertified E_trunc + unsupplied E(N)→0 + proxy id + refuted M_∞ rate',
    status: 'overclaim-corrected-conditional-RH-equivalent',
    source: 'imp-1261 redirect (imp-341 lim sup + imp-1149 rate); CORRECTED by 3-auditor review 2026-07',
    note:
      'AUDIT CORRECTION 2026-07 (superseded overclaim). Λ ≤ 3.06×10⁻⁵ (asymptotic) ' +
      'is NOT a rigorous sub-PT bound. The earlier "UNCONDITIONAL / second project ' +
      'result / ~6,500× under PT" framing is RETRACTED. It is conditional on: ' +
      '(a) the RH-EQUIVALENT Hölder-½ shock modulus C_H / G6a (imp-2640 Gronwall ' +
      'discharge NEGATIVE / RH-hard-confirmed; imp-35147 shows C_H ⇔ a uniform ' +
      'all-height minimal-gap lower bound) — NOT one lemma away and NOT the sole ' +
      'gate; rh-dag.js marks the G6a node severity:open (earlier "closed" framing = ' +
      'WITHDRAWN overclaim). (b) an uncertified / mis-stated E_trunc constant ' +
      '(imp-34791 prefactor bug → honest ≈ 5.1×10⁻⁵, not 3.06×10⁻⁵; imp-1324 Ramaré ' +
      'line wrong ~9.5×10⁷; obligation G-Etrunc-Eflow-constants closed:false). ' +
      '(c) an unsupplied E(N) → 0 (imp-35164: on the current surrogate E(N) FLOORS ' +
      'at E_trunc and does NOT vanish; obligation G-EN-ladder-verify closed:false). ' +
      'Plus the |t_c(N)| → 0 leg bounds a Stieltjes-transform PROXY (imp-2563 R_A ' +
      'open) on a repo-refuted rate step (imp-2621 falsified the continuum ' +
      'amplification — only the bare limit survives). This superseded route produces no ' +
      'upper bound; Platt–Trudgian Λ ≤ 0.2 remains the peer-reviewed benchmark. The genuinely-unconditional ' +
      'content here is limsup_N |t_c^proxy(N)| = 0 (RvM counting + Trudgian ' +
      'C_Selberg = 3; no GUE / no RH), which is INERT — it does not by itself bound ' +
      'Λ. The one conditional genuinely removed by imp-1246 / imp-1261 is the ' +
      'linear-1/N OLS model, but its removal does not make the composed value ' +
      'rigorous. See src/data/asymptotic-lambda-bound-2026-05-20.js honestScope / ' +
      'numericalStatus for the live status.',
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
      'HISTORICAL CONDITIONAL bound, superseded as a program target by the imp-1261 ' +
      '3.06×10⁻⁵ conditional redirect (entry "our-asymptotic-via-imp-1261-redirect" above). ' +
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
    label: 'Λ(1e4) ≤ 0.02 — finite-N ESTIMATE, C_H-gated (not a rigorous PT beat)',
    kind: 'upper-estimate-finite-N',
    value: 0.02,
    status: 'estimate-c-h-open',
    source: 'imp-440 capstone via imp-963 measured C_mb on [100, 1e4]',
    note:
      'PROJECT ESTIMATE BELOW PT 2021 AT A FINITE N, not a rigorous or ' +
      'unconditional bound. L_pt(N* = 1e4) ~ 0.02 < 0.2 = PT_BOUND numerically, ' +
      'with margin factor ~10x. The 6-link modeled chain (V2 fit + measured C_mb ' +
      'from imp-963 + E_trunc_pt from imp-447 + imp-459 + E_flow from imp-398 + ' +
      'E_coll from imp-399 + rho_min from imp-469) is numerically assembled at N = 1e4. ' +
      'The dominant ' +
      'E_coll term rests on the shock modulus C_H = C_shock*C_Lip/4 whose N-uniform ' +
      'bound is RH-HARD (imp-2640 Gronwall discharge NEGATIVE; ch-wall-frontier-verdict-' +
      '2026-06-26 RH-HARD-CONFIRMED), and the "measured" C_mb / |t_c_proj| is an OLS fit ' +
      '(imp-2632), not a rigorous N-uniform upper bound. Platt-Trudgian Λ ≤ 0.2 remains ' +
      'the rigorous SOTA; compare the honestly-labelled conditional-carryforward sibling ' +
      'below. Lean 4 formalisation of the composition ' +
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
      'C_H-gated finite-N* estimate from the measured N* = 1e4 ' +
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
      'back to rigorous when the imp-1090 interval-RK4 measurements land. ' +
      'HONEST STATUS (imp-3744, 2026-07-03): the F_mb non-regression leg ' +
      'itself is now DISCHARGED -- imp-3725 proved a true-flow two-sided ' +
      'enclosure of t_c(N) per H_raw-plateau, certifying K_paper <= 2.4238e-6 ' +
      'uniformly on [1e4, 1e6] and retiring the imp-962 maxSmoothScaleRatio ' +
      '= 2.15 heuristic slack. This is a real-analysis lemma only -- no GUE ' +
      'input, no local law, and it does NOT close Step 4 (the Polymath15 ' +
      'bridge / open sub-gap G6a_shock_lipschitz remains OPEN) and does NOT ' +
      'make RH follow unconditionally. Residual conditioning of this bound ' +
      'now rests on the OTHER legs (see cond-CH); the discharge only retires ' +
      'the F_mb-specific slack, not the whole conditional.',
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
    // imp-35058 (scoping/assessment ONLY; changes no bound, establishes no
    // operator positivity, closes nothing, NO QED): enumerate — WITHOUT
    // claiming any is discharged — the concrete analytic obligations that
    // separate the current NUMERICAL grade from a rigorous one. The measured
    // rows and the two cross-checks below are all finite-N floating-point (or
    // one-ULP-interval) measurements; NONE supplies a certified, N-UNIFORM,
    // machine-checkable enclosure of |t_c(N)|. All three obligations remain OPEN.
    rigorousUpgradeGap: {
      grade: 'numerical',
      wouldRequire: 'rigorous',
      status: 'OPEN — none of the three ingredients below is closed',
      obligations: [
        {
          key: 'G-step-error',
          label: 'RK4/DP5 step-budget truncation bound',
          need:
            'A CERTIFIED a-priori bound on the local + accumulated truncation ' +
            'error of the integrator as a function of step dt and N, not merely ' +
            'the empirical two-method gap |t_c_RK4 - t_c_DP5|. The DP5-vs-RK4 ' +
            'agreement (imp-2466) is a cross-check, not a certificate: it bounds ' +
            'scheme-DISAGREEMENT, so a shared systematic error common to both ' +
            'RK5(4) and RK4 tableaux is invisible to it.',
          machinery: 'imp-2466 (DP5 cross-integrator), imp-357 cross-integrator check',
          closed: false,
        },
        {
          key: 'G-gronwall',
          label: 'Gronwall stability constant, certified and N-uniform',
          need:
            'An explicit, N-uniform Gronwall propagation constant controlling how ' +
            'zero-ordinate input error and per-step error amplify along the ' +
            'backward flow up to the collision front. backward-flow-stability-' +
            'gronwall.js (imp-2520) supplies the propagation LEMMA in de Bruijn-' +
            'Newman units but its per-N consequence is honestly flagged as ' +
            'Gronwall-vacuous near the true nearest-pair front (floor collapses ' +
            'as strip height to 0); the constant is not yet certified up to t_c.',
          machinery: 'backward-flow-stability-gronwall.js (imp-2520)',
          closed: false,
        },
        {
          key: 'G-interval-enclosure',
          label: 'Interval-arithmetic enclosure of the flow, N-uniform',
          need:
            'A rigorous interval-arithmetic (or ball-arithmetic) enclosure ' +
            '[t_c_lo(N), t_c_hi(N)] valid at the measured N and extensible with a ' +
            'documented N-dependence, with the 1/(x_k - x_j) pole reduction ' +
            'carried through in interval form. imp-362 delivers a one-ULP interval ' +
            'RK4 witness (LAMBDA_INTERVAL_DYSON) at the bundled ordinate table only; ' +
            'it is a single-N enclosure, not an N-uniform certificate.',
          machinery: 'imp-362 (interval RK4 witness, LAMBDA_INTERVAL_DYSON)',
          closed: false,
        },
      ],
      caveat:
        'Discharging all three would elevate Step 2 to rigorous but changes NO ' +
        'Lambda bound on its own: Step 2 feeds the E(N) bridge constants (Step 4), ' +
        'not the headline inequality. The imp-36192 (G-step-error) and imp-36193 ' +
        '(G-interval-enclosure) scope modules ENUMERATE these obligations without ' +
        'discharging any -- they too are scoping-only, NO QED. This field is a ' +
        'scoping map only; Platt-Trudgian Lambda <= 0.2 remains the peer-reviewed benchmark.',
      by: 'imp-35058',
    },
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
      '|Λ − (−t_c(N))| ≤ E(N) makes E(N) → 0 the headline approach; t_c >= 0 is automatic, so ' +
      'closing Step 4 with an unconditional E(N) bound gives Λ ≤ E(N) → 0. Combined with ' +
      'Rodgers-Tao Λ ≥ 0 gives Λ = 0 unconditionally. Per-N collision bounds (SG1/Theta/routes ' +
      'A/B/C) feed the E(N) constants, not the headline inequality. ' +
      'HONEST STATUS (imp-3671): the imp-3642 mesoscopic density-floor profile V0(gamma) does NOT ' +
      'supply a Hölder-1/2 modulus for G6a_shock_lipschitz -- structurally silent verdict, two ' +
      'independent obstructions: (S1) V0 is a strip-sup density scalar, the wrong TYPE of object for ' +
      'a spatial |τ_c(x) − τ_c(x_prime)| <= C_Lip|x − x_prime|^{1/2} modulus; (S2) the mesoscopic ' +
      'reading at y_star = 4d is Gronwall-vacuous at the true nearest-pair front (floor collapses to ' +
      '0 as strip height -> 0, per imp-2520 negative-finding 1). G6a_shock_lipschitz remains OPEN; no ' +
      'candidate closure route has been found via the direct-flow V0 measurement.',
    // imp-35098 (scoping/assessment ONLY; changes no bound, establishes no
    // operator positivity, closes nothing, respects the imp-2519 no-overclaim
    // guard, NO QED): enumerate — WITHOUT claiming any is discharged — the
    // analytic ingredients that separate the current NUMERICAL grade of the
    // Step-4 bridge |Lambda - (-t_c(N))| <= E(N) from a rigorous one. This is
    // DISTINCT from the imp-35058 Step-2 scoping (which lists integrator /
    // Gronwall / interval-enclosure obligations for the backward Dyson ODE):
    // Step 4 is the ANALYTIC BRIDGE itself, so its obligations are the shock
    // modulus, the E-term constant discharge, and the assembled-E(N) ladder
    // check. imp-345 shipped only a partial closure (E_flow rigorous MODULO
    // constants; E_trunc a Guth-Maynard tail), and the assembled E(N) has only
    // ever been evaluated at finite N (floating point) on the imp-321 ladder.
    // All three obligations below remain OPEN.
    rigorousUpgradeGap: {
      grade: 'numerical',
      wouldRequire: 'rigorous (unconditional E(N) -> 0)',
      status: 'OPEN — none of the three ingredients below is closed',
      obligations: [
        {
          key: 'G6a-holder-modulus',
          label: 'G6a_shock_lipschitz Hoelder-1/2 modulus of tau_c at the Burgers shock',
          need:
            'A certified Hoelder-1/2 spatial modulus ' +
            '|tau_c(x) - tau_c(x_prime)| <= C_Lip |x - x_prime|^{1/2} for the ' +
            'collision time tau_c at the Burgers shock, supplying the constant ' +
            'C_H in E_coll. imp-366 ported the Polymath15 Lemma 5.2 LEDGER but ' +
            'the modulus itself is RH-HARD: imp-2640 gap-Lipschitz Gronwall ' +
            'discharge NEGATIVE, the imp-3642/imp-3671 direct-flow V0 profile is ' +
            'the wrong TYPE of object (strip-sup density scalar, not a spatial ' +
            'modulus) and is Gronwall-vacuous at the true nearest-pair front, and ' +
            'the asymptotic modulo persists (imp-35056). This is the sole open ' +
            'sub-gap that gates the whole step.',
          machinery: 'imp-366, imp-2640, imp-3642, imp-3671, imp-35056',
          feedsInto: 'C_H in E_coll, hence the E(N) bridge constant',
          // imp-35101 (scoping/assessment ONLY; changes no bound, closes
          // nothing, no operator positivity, respects the imp-2519 no-overclaim
          // guard, NO QED): assess whether ANY right-TYPE spatial density-floor
          // object could supply the G6a modulus, given imp-3671 two obstructions
          // to V0(gamma) (S1 wrong object type, S2 Gronwall-vacuous at the
          // nearest-pair front). Verdict below: NONE, and the reason sharpens
          // S2 from vacuous to WRONG MONOTONE DIRECTION.
          densityFloorAssessment: {
            question:
              'Does the repo toolkit contain a density-floor object of the ' +
              'CORRECT spatial-modulus type (a two-point ' +
              '|tau_c(x) - tau_c(x_prime)| <= C_Lip |x - x_prime|^{1/2}) that ' +
              'supplies the G6a Hoelder-1/2 modulus?',
            verdict: 'NO right-type density-floor object exists; G6a stays OPEN.',
            keyFinding:
              'The imp-3671 obstructions S1 (wrong TYPE) and S2 (Gronwall-vacuous ' +
              'at the nearest-pair front) are INDEPENDENT: retyping V0(gamma) from ' +
              'a strip-sup scalar into a genuine two-point spatial density ' +
              'difference fixes S1 but NOT S2, because a density FLOOR (a LOWER ' +
              'bound on eigenvalue density, equivalently an UPPER bound on ' +
              'spacing) is the WRONG MONOTONE DIRECTION at the shock. tau_c is set ' +
              'by the nearest pair -- the SMALLEST spacing, i.e. the HIGHEST-' +
              'density region -- exactly where a floor carries no information. So ' +
              'S2 is not a tuning artifact of the y_star = 4d reading; any ' +
              'density-FLOOR object of any type gives the wrong-sign control at ' +
              'the nearest-pair front.',
            candidateRoutes: [
              {
                route: 'R1: retype V0(gamma) to a two-point spatial density difference',
                fixesTypeS1: true,
                fixesSignS2: false,
                note:
                  'right TYPE but still a floor, so still vacuous / wrong-sign at ' +
                  'the nearest-pair front (imp-2520 negative-finding 1)',
              },
              {
                route: 'R2: minimal-gap LOWER bound (density ceiling -- the correct dual object)',
                fixesTypeS1: true,
                fixesSignS2: true,
                note:
                  'right type AND right sign, but NO unconditional such object is ' +
                  'in the toolkit: it IS the imp-2520 nearest-pair front / imp-348 ' +
                  'microscopic local law, available only GUE-conditionally (RH-hard)',
              },
              {
                route: 'R3: direct Polymath15 Lemma 5.2 port (imp-366 ledger)',
                fixesTypeS1: true,
                fixesSignS2: true,
                note:
                  'right type by construction but RH-hard: imp-2640 gap-Lipschitz ' +
                  'Gronwall discharge NEGATIVE, ch-wall-frontier-verdict RH-HARD',
              },
            ],
            conclusion:
              'No density-FLOOR object of any TYPE discharges G6a. The type fix ' +
              '(S1) and the sign fix (S2) are independent, and the only object ' +
              'satisfying both is a minimal-gap lower bound -- exactly the ' +
              'RH-hard nearest-pair control (imp-2520 / imp-348, GUE-conditional). ' +
              'G6a_shock_lipschitz remains OPEN; changes no bound; ' +
              'Platt-Trudgian Lambda <= 0.2 stays SOTA; NO QED.',
            by: 'imp-35101',
          },
          // imp-36214 (independent verification ONLY; discharges nothing, no
          // operator positivity, respects the imp-2519 no-overclaim guard, NO
          // QED): re-derive the imp-35101 route-R1 verdict
          // (fixesTypeS1 = true, fixesSignS2 = false) from first principles via
          // the density/spacing monotone duality, to confirm S1 and S2 are
          // independent and that the type fix does NOT touch the sign defect.
          densityFloorR1Verification: {
            question:
              'Does retyping V0(gamma) from a strip-sup density SCALAR into a ' +
              'genuine two-point spatial density difference |rho(x) - rho(x_prime)| ' +
              'discharge BOTH imp-3671 obstructions, or only S1 (wrong TYPE) while ' +
              'S2 (wrong monotone direction at the nearest-pair front) survives?',
            verdict:
              'VERIFIED: R1 fixes S1 but NOT S2. The type fix and the sign fix are ' +
              'independent; retyping cannot repair the monotone direction.',
            s1Argument:
              'S1 (wrong TYPE) is a purely structural mismatch: the G6a modulus ' +
              'needs a two-point spatial statement ' +
              '|tau_c(x) - tau_c(x_prime)| <= C_H |x - x_prime|^{1/2}, whereas the ' +
              'imp-3642/imp-3671 V0(gamma) is a single strip-sup scalar with no ' +
              'x-dependence. Replacing it by a two-point density difference ' +
              '|rho(x) - rho(x_prime)| is, BY CONSTRUCTION, an object of the right ' +
              'spatial-modulus type, so S1 is discharged. This step is unconditional ' +
              'and costs nothing -- it is a change of the object being estimated, ' +
              'not a new bound.',
            s2Argument:
              'S2 survives because the retyped object is still a density FLOOR, and ' +
              'a floor is the wrong monotone direction at the shock. Duality: a ' +
              'density floor (rho >= rho_min, a LOWER bound on density) is ' +
              'equivalent to an UPPER bound on the local spacing (spacing <= ' +
              '1/rho_min). But tau_c is set by the nearest pair -- the SMALLEST ' +
              'spacing, i.e. the HIGHEST-density point -- and controlling the ' +
              'Hoelder modulus there requires a LOWER bound on that smallest ' +
              'spacing, equivalently a density CEILING (rho <= rho_max). A floor ' +
              'delivers the OPPOSITE inequality at exactly the front that governs ' +
              'the modulus, so it carries no information where it is needed. The ' +
              'retyping changed the type of the object but not its inequality ' +
              'sense, so S2 is untouched.',
            independenceCheck:
              'S1 is about the shape of the object (scalar vs two-point spatial); ' +
              'S2 is about the sense of its inequality (floor vs ceiling). These ' +
              'are orthogonal: one can hold a right-type object that is a floor ' +
              '(this is precisely R1) or a wrong-type object that were it typed ' +
              'would be a ceiling. Hence fixing S1 leaves S2 exactly as it was, ' +
              'confirming the imp-35101 R1 row (fixesTypeS1 = true, ' +
              'fixesSignS2 = false) and sharpening the original imp-3671 ' +
              '"Gronwall-vacuous" reading of S2 into the precise WRONG-MONOTONE-' +
              'DIRECTION statement.',
            conclusion:
              'R1 is confirmed as a genuine but PARTIAL repair: it discharges the ' +
              'type obstruction S1 and nothing else. The sole route repairing both ' +
              'S1 and S2 remains R2, a minimal-gap LOWER bound (density ceiling), ' +
              'which is the RH-hard nearest-pair front (imp-2520 / imp-348, ' +
              'GUE-conditional). G6a_shock_lipschitz stays OPEN; changes no bound; ' +
              'Platt-Trudgian Lambda <= 0.2 stays SOTA; NO QED.',
            by: 'imp-36214',
          },
          // imp-35147 (assessment/classification ONLY; discharges nothing, no
          // operator positivity, respects the imp-2519 no-overclaim guard, NO
          // QED): imp-35101 left ONE minimal-gap object (route R2) as the sole
          // fit for the G6a modulus but never asked whether a WEAKER-than-RH
          // version of it suffices. Enumerate candidate sub-RH minimal-gap
          // inputs, map each to the G6a two-point Hoelder-1/2 requirement, and
          // classify EQUIVALENT-TO-RH / STRICTLY-WEAKER-BUT-SUFFICIENT /
          // INSUFFICIENT. Verdict: the STRICTLY-WEAKER-BUT-SUFFICIENT bucket is
          // EMPTY for the asymptotic (N -> inf) modulus.
          weakerGapAssessment: {
            question:
              'The imp-35101 verdict names a minimal-gap LOWER bound as the sole ' +
              'object fitting the G6a Hoelder-1/2 modulus. Is that object ' +
              'RH-EQUIVALENT, or can a strictly-weaker-than-RH minimal-gap input ' +
              '(averaged, positive-proportion, GUE-conditional, zero-free-region, ' +
              'or finite-height) supply the SAME modulus?',
            modulusRequirement:
              'G6a needs a POINTWISE two-point statement ' +
              '|tau_c(x) - tau_c(x_prime)| <= C_H |x - x_prime|^{1/2} holding at ' +
              'EVERY x, hence a UNIFORM (sup-over-x, worst-case) lower bound on ' +
              'the nearest-pair spacing -- the modulus is controlled at the single ' +
              'x where spacing is SMALLEST (the shock front). This worst-point, ' +
              'all-height, pointwise character is what every candidate is graded ' +
              'against.',
            candidates: [
              {
                key: 'C1',
                input:
                  'Uniform pointwise minimal-gap lower bound at every zero (all ' +
                  'heights): min-gap >= c / log(gamma) for all consecutive pairs',
                classification: 'EQUIVALENT-TO-RH (the fitting object itself; RH-hard)',
                reason:
                  'This IS route R2 / the imp-2520 nearest-pair front / imp-348 ' +
                  'microscopic local law. Right type AND right sign AND uniform. ' +
                  'Not PROVEN literally equivalent to RH, but no route weaker than ' +
                  'RH is known to deliver it; graded as RH-strength, not a lever.',
              },
              {
                key: 'C2',
                input: 'Averaged / mean minimal-gap bound (control of the average spacing)',
                classification: 'INSUFFICIENT',
                reason:
                  'Wrong aggregation: the modulus is a sup-over-x worst-case, and ' +
                  'an average cannot bound the single smallest-spacing point. The ' +
                  'shock front is exactly the extreme x an average washes out.',
              },
              {
                key: 'C3',
                input:
                  'Positive-proportion minimal-gap lower bound (holds for a ' +
                  'positive proportion of zeros)',
                classification: 'INSUFFICIENT',
                reason:
                  'Same defect one level up: tau_c is set by the exceptional ' +
                  'SMALLEST gap, precisely the measure-zero / excluded-proportion ' +
                  'front that a positive-proportion statement says nothing about.',
              },
              {
                key: 'C4',
                input:
                  'GUE-conditional minimal-gap floor (imp-348 microscopic local ' +
                  'law, imp-486 C_mb conditional)',
                classification: 'NOT-WEAKER (rests on RH-level input; = current status)',
                reason:
                  'Supplies the right uniform pointwise object, but GUE spacing ' +
                  'floors are themselves proved conditional on RH-level pair-' +
                  'correlation input; this is the imp-486 GUE conditional already ' +
                  'in the ledger, not a sub-RH lever that improves it.',
              },
              {
                key: 'C5',
                input:
                  'Zero-free-region / zero-density input (genuinely weaker than ' +
                  'RH, unconditional)',
                classification: 'INSUFFICIENT',
                reason:
                  'Wrong axis: these bound HORIZONTAL distance of zeros to the ' +
                  'critical line or COUNT exceptional zeros; they give no ' +
                  'VERTICAL consecutive-spacing lower bound, which is the only ' +
                  'quantity feeding the shock-front modulus.',
              },
              {
                key: 'C6',
                input:
                  'Finite-height minimal-gap lower bound: an unconditional ' +
                  'RH-free spacing floor read off the verified zero list up to ' +
                  'height X (X ~ 3e12)',
                classification:
                  'STRICTLY-WEAKER-THAN-RH and SUFFICIENT ON THE VERIFIED STRIP ' +
                  'ONLY -- INSUFFICIENT for the asymptotic N -> inf modulus',
                reason:
                  'Genuinely sub-RH (a finite computation), and it does supply a ' +
                  'certified uniform pointwise gap floor for all pairs below X. ' +
                  'But the G6a modulus is needed uniformly as N -> inf (the ' +
                  'surrogate strip height grows unbounded), and a finite-height ' +
                  'floor carries no control above X. So it discharges the modulus ' +
                  'on the truncated strip but not asymptotically -- the SAME ' +
                  'verified-height mechanism as the Platt-Trudgian floor.',
              },
            ],
            verdict:
              'The STRICTLY-WEAKER-BUT-SUFFICIENT bucket is EMPTY for the ' +
              'asymptotic (N -> inf) G6a modulus. Every enumerated sub-RH input ' +
              'is either wrong-aggregation (C2), wrong-front (C3) or wrong-axis ' +
              '(C5) INSUFFICIENT, or (C6) sufficient only on the finite verified ' +
              'strip; the fitting object (C1) is RH-hard with no known sub-RH ' +
              'route, and the GUE floor (C4) supplies it only under the imp-486 ' +
              'conditional, which is not weaker than RH for this purpose.',
            conclusion:
              'The G6a minimal-gap modulus is effectively RH-EQUIVALENT in ' +
              'strength: no weaker-than-RH input supplies the asymptotic modulus. ' +
              'The single sub-RH lever that supplies it AT ALL is a finite-height ' +
              'gap floor (C6), and it binds only up to the verified height X -- ' +
              'consistent with the standing finding that the sole non-RH lever on ' +
              'this program is MORE VERIFIED HEIGHT, not a softer analytic input. ' +
              'G6a_shock_lipschitz remains OPEN; C_mb stays GUE-conditional ' +
              '(imp-486); changes no bound; Platt-Trudgian Lambda <= 0.2 stays ' +
              'SOTA; NO QED.',
            by: 'imp-35147',
          },
          // imp-95234 (scoping / factor-localization ONLY; discharges nothing,
          // no operator positivity, respects the imp-2519 no-overclaim guard,
          // NO QED): the prior G6a assessments graded the modulus as an object
          // (imp-35101 TYPE, imp-36214 SIGN, imp-35147 STRENGTH). This field
          // instead factorizes the CONSTANT C_H = C_shock * C_Lip / 4 that the
          // modulus supplies, grades each factor against the repo ledger, and
          // pins WHERE the obstruction and the ansatz live.
          cHEstimateFactorization: {
            question:
              'The C_H estimate feeding E_coll is written C_H = C_shock * C_Lip ' +
              '/ 4. Which of its factors are discharged O(1) constants in the ' +
              'repo, which single factor carries the whole obstruction, and is ' +
              'the numeric value currently used a rigorous bound or an ansatz?',
            neededForm:
              'C_H is the coefficient of the Hoelder-1/2 shock modulus ' +
              '|tau_c(x) - tau_c(x_prime)| <= C_H |x - x_prime|^{1/2}, needed as ' +
              'a finite N-uniform constant so that E_coll = C_C * sqrt(log T0 / ' +
              'N) with C_C = C_H * sqrt(C_KH) is a genuine upper bound rather ' +
              'than a fitted coefficient.',
            factors: [
              {
                factor: 'C_shock (the cusp-law prefactor g_min ~ C_shock * W_1^{1/2})',
                status: 'DISCHARGED (bounded)',
                value: 'C_shock < 1/3',
                source: 'ch-wall-frontier-verdict-2026-06-26',
                note:
                  'A rigorous O(1) constant; contributes no divergence to C_H.',
              },
              {
                factor: 'C_KH (the Selberg / quadrature factor in C_C = C_H * sqrt(C_KH))',
                status: 'DISCHARGED (rigorous)',
                value: 'C_KH = 3 pi (with C_Selberg rigorous)',
                source: 'imp-2641 (via imp-2643 / imp-2633 ledger)',
                note:
                  'The other multiplicative constant in the E_coll coefficient ' +
                  'is a discharged number; it does not gate the estimate.',
              },
              {
                factor: 'C_Lip (the gap-Lipschitz backward-flow Gronwall Jacobian)',
                status: 'NOT N-UNIFORM -- PROVABLY DIVERGENT (RH-HARD-CONFIRMED)',
                value: 'C_Lip -> infinity as N -> infinity (no finite N-uniform value exists)',
                source:
                  'ch-wall-frontier-verdict-2026-06-26 + imp-3010 ' +
                  'ch-lip-three-proofs-table-2026-06-30 (three independent ' +
                  'closures); imp-2640 Gronwall discharge NEGATIVE',
                note:
                  'The entire obstruction localizes here. Three independent ' +
                  'proofs give divergence: (i) the cusp law forces a genuine ' +
                  'LOWER bound C_Lip >= C_shock / (2 sqrt(W_1)) -> infinity as ' +
                  'the nearest pair collides; (ii) the W_1-metric Gronwall ' +
                  'Jacobian C_Lip(W_1, N) = N * g0 / (4 (1 - Theta)) carries an ' +
                  'explicit N factor; (iii) the imp-2662 C_Theta-endpoint route ' +
                  'bounds C_Lip only IF C_Theta is N-uniform, which is itself ' +
                  'open. C_Lip is the sole non-O(1) factor.',
              },
            ],
            ansatzStatus:
              'The numeric value actually carried in the assembled E(N) is ' +
              'C_H = 1/8 (effective coefficient ~0.127), and it is an ANSATZ, ' +
              'NOT a rigorous upper bound (imp-2642 / imp-2643 / imp-2633). ' +
              'The 1/8 is the EXACT quadratic-tangency single-particle constant ' +
              'from the C_KH quadrature (R = 0 two-particle dynamics), NOT the ' +
              'Hoelder modulus C_shock * C_Lip / 4; silently equating the two ' +
              'asserts C_shock * C_Lip = 1/2, and since C_shock < 1/3 that ' +
              'demands C_Lip > 3/2 as a FINITE N-uniform number -- exactly the ' +
              'quantity the C_Lip row above proves does not exist. So the ' +
              'estimate is rigorous-modulo-C_Lip only.',
            verdict:
              'Every factor of C_H = C_shock * C_Lip / 4 is a discharged O(1) ' +
              'constant EXCEPT C_Lip, and C_Lip provably diverges. The missing ' +
              'ingredient is precisely a finite N-uniform C_Lip; this is the ' +
              'SAME wall the imp-35147 weakerGapAssessment lands on (its C1 / ' +
              'route R2, the RH-hard nearest-pair minimal-gap lower bound), now ' +
              'localized to the single divergent factor. The C_H = 1/8 value in ' +
              'the ledger is an ansatz, not a bound.',
            conclusion:
              'The C_H estimate needs a finite N-uniform C_Lip; that factor ' +
              'alone is undischarged and is PROVABLY divergent (not merely ' +
              'unproven), so no repo module bounds it and the assembled E(N) ' +
              'inherits the ansatz. G6a_shock_lipschitz remains OPEN; changes ' +
              'no bound; C_mb stays GUE-conditional (imp-486); Platt-Trudgian ' +
              'Lambda <= 0.2 stays SOTA; NO QED.',
            by: 'imp-95234',
          },
          // imp-97690 (assessment/scoping ONLY; discharges nothing, no operator
          // positivity, respects the imp-2519 no-overclaim guard, NO QED): the
          // prior Step-5 assessments graded the sigma(N) decay against the
          // E_coll MAGNITUDE and the conditional SHARE (imp-96093 far-tail,
          // imp-97402 share-reduction). This field instead asks whether the same
          // post-peak decay supplies any quantitative footing on the STEP-4
          // G6/G6a/C_H two-point Hoelder modulus, and pins the precise
          // category mismatch that forbids it.
          sigmaDecayStep4LeverAssessment: {
            question:
              'Does the imp-33582 post-peak decay of the conditional share ' +
              'sigma(N) = E_coll/E(N) (peak sigma_max ~ 0.949 near N ~ 9.22e5, ' +
              'halved at N ~ 3.27e9, below 0.1 only at N ~ 3.21e11) supply any ' +
              'quantitative lever on the OPEN Step-4 G6/G6a/C_H bridge -- the ' +
              'pointwise two-point Hoelder-1/2 shock modulus -- or is it in the ' +
              'wrong category to move that bridge at all?',
            categoryMismatch:
              'sigma(N) is an AGGREGATE energy-share: it compares the total ' +
              'collision energy E_coll to the assembled E(N) across the whole ' +
              'ensemble. The Step-4 bridge is instead the POINTWISE statement ' +
              '|tau_c(x) - tau_c(x_prime)| <= C_H |x - x_prime|^{1/2} required at ' +
              'EVERY x, hence controlled at the SINGLE worst x where the spacing ' +
              'is smallest (the nearest-pair shock front). A vanishing aggregate ' +
              'share is fully compatible with an UNBOUNDED pointwise modulus at ' +
              'the measure-zero smallest-gap front: this is exactly the ' +
              'imp-35147 C2 (wrong-aggregation: an average cannot bound the ' +
              'single smallest-spacing point) and C3 (wrong-front: the extreme ' +
              'gap is precisely what a share washes out) defect. The sigma ' +
              'decay carries no worst-point, all-height, pointwise content.',
            localizedObstruction:
              'The Step-4 obstruction localizes ENTIRELY on the factor C_Lip ' +
              '(imp-95234 cHEstimateFactorization: C_H = C_shock * C_Lip / 4, ' +
              'every factor O(1) except C_Lip). C_Lip is a nearest-pair-front ' +
              'Gronwall Jacobian that PROVABLY diverges as the nearest pair ' +
              'collides (C_Lip >= C_shock / (2 sqrt(W_1)) -> infinity). The ' +
              'sigma(N) decay is a magnitude/share of E_coll; it neither bounds ' +
              'nor even sees C_Lip, whose divergence lives at the exact front ' +
              'the aggregate share suppresses. A shrinking share therefore ' +
              'shaves nothing off the single divergent factor gating C_H.',
            circularity:
              'Compounding the mismatch: sigma(N) is itself COMPUTED with the ' +
              'GUE-conditional C_mb <= 1 (imp-96093), so the small-share premise ' +
              'presupposes the very conditionality a Step-4 lever would need to ' +
              'be independent of. Even the magnitude reading cannot be asserted ' +
              'unconditionally, so no unconditional Step-4 footing is extracted.',
            verdict:
              'NO quantitative lever. The sigma(N) post-peak decay supplies no ' +
              'footing on the Step-4 G6/G6a/C_H bridge: it is an aggregate ' +
              'energy-share in the wrong statistical category for the pointwise ' +
              'worst-front modulus (imp-35147 C2/C3 wrong-aggregation), it does ' +
              'not touch the localized provably-divergent factor C_Lip ' +
              '(imp-95234), and it is circular on the GUE-conditional C_mb ' +
              '(imp-96093 / imp-486). The shrinking conditional share confirms ' +
              '(does not weaken) the imp-486 conditionality.',
            residualSubGap:
              'SG-97690-step4-pointwise: the only object that would move Step-4 ' +
              'remains a UNIFORM pointwise nearest-pair minimal-gap lower bound ' +
              '(imp-35147 C1 / route R2), RH-hard with no known sub-RH route; ' +
              'this assessment neither supplies nor refutes one and is confined ' +
              'to ruling the sigma-share lever OUT.',
            conclusion:
              'The sigma(N) decay is a Step-5 aggregate-magnitude diagnostic, ' +
              'orthogonal to the Step-4 pointwise worst-front modulus; it moves ' +
              'no bound. G6a_shock_lipschitz remains OPEN; C_mb stays ' +
              'GUE-conditional (imp-486); changes no bound; Platt-Trudgian ' +
              'Lambda <= 0.2 stays SOTA; NO QED.',
            by: 'imp-97690',
          },
          // imp-97707 (assessment/derivation ONLY; discharges nothing, moves no
          // bound, no operator positivity, respects the imp-2519 no-overclaim
          // guard, NO QED): the prior fields graded the C_H CONSTANT
          // (imp-95234 cHEstimateFactorization) and ruled OUT the sigma-share
          // lever (imp-97690). This field walks the WHOLE Step-4 bridge
          // end-to-end -- G6 structural port -> G6a Hoelder modulus -> the
          // E_coll coefficient C_C = C_H * sqrt(C_KH) with C_H = C_shock *
          // C_Lip / 4 -- grading every constant in one place, so the single
          // unproven-at-finite-N dependency is pinned in a single citable trace
          // and the minimal closing statement is stated exactly.
          step4ConstantTraceObstruction: {
            question:
              'Tracing the G6 structural bridge |Lambda - (-t_c(N))| <= E(N) ' +
              'through the G6a Hoelder-1/2 shock modulus into the E_coll ' +
              'coefficient, which SINGLE constant (or dependency) is unproven ' +
              'at finite N, and what is the minimal statement that would close ' +
              'the bridge unconditionally?',
            bridgeChain:
              'G6 records the structural bridge Lambda <= -t_c(N) + E(N) ' +
              '(imp-345/366/387 composition). E(N) = E_coll + E_trunc + E_flow. ' +
              'E_coll = C_C * sqrt(log T0 / N) with C_C = C_H * sqrt(C_KH). G6a ' +
              'is the two-point modulus |tau_c(x) - tau_c(x_prime)| <= C_H ' +
              '|x - x_prime|^{1/2} that supplies C_H = C_shock * C_Lip / 4. So ' +
              'the whole bridge terminates on the constants {C_shock, C_KH, ' +
              'C_H, C_Lip}; E_trunc and E_flow are a SEPARATE gate ' +
              '(G-Etrunc-Eflow-constants) not the G6/G6a load-path.',
            constantTrace: [
              {
                constant: 'C_shock (cusp-law prefactor g_min ~ C_shock * W_1^{1/2})',
                grade: 'DISCHARGED O(1)',
                value: 'C_shock < 1/3',
                source: 'ch-wall-frontier-verdict-2026-06-26',
              },
              {
                constant: 'C_KH = pi * C_Selberg (Selberg/Koksma-Hlawka quadrature factor in C_C)',
                grade: 'DISCHARGED rigorous',
                value: 'C_KH = 3 pi',
                source: 'imp-2641 (imp-2643 / imp-2633 ledger)',
              },
              {
                constant: 'C_H (Hoelder-1/2 coefficient, the G6a modulus output)',
                grade: 'ANSATZ not a bound',
                value: 'carried as C_H = 1/8 (the exact single-particle quadratic-tangency C_collision^{-1}, imp-395), which silently sets C_shock * C_Lip = 1/2',
                source: 'imp-395 g6a-sub-constant-value + imp-95234',
              },
              {
                constant: 'C_Lip (gap-Lipschitz backward-flow Gronwall Jacobian)',
                grade: 'NOT N-UNIFORM -- PROVABLY DIVERGENT (RH-hard-confirmed)',
                value: 'C_Lip -> infinity as N -> infinity; lower bound C_Lip >= C_shock / (2 sqrt(W_1)) at the colliding nearest pair',
                source: 'imp-3010 ch-lip-three-proofs-table-2026-06-30 + imp-2640 Gronwall discharge NEGATIVE + ch-wall-frontier-verdict-2026-06-26',
              },
            ],
            soleUnprovenDependency:
              'C_Lip. Three of the four terminal constants are discharged O(1) ' +
              'numbers (C_shock, C_KH) or a derived ansatz (C_H = 1/8) whose ' +
              'only unproven input is again C_Lip: writing C_H = C_shock * ' +
              'C_Lip / 4 and equating to 1/8 forces C_shock * C_Lip = 1/2, and ' +
              'since C_shock < 1/3 this demands a FINITE N-uniform C_Lip > 3/2 ' +
              '-- exactly the quantity three independent proofs show does not ' +
              'exist. So the entire Step-4 obstruction localizes on the single ' +
              'factor C_Lip, and it is not merely unproven but provably ' +
              'divergent (worse than open).',
            minimalClosingStatement:
              'A finite N-uniform gap-Lipschitz constant C_Lip -- equivalently ' +
              '(imp-35147 C1 / route R2) a uniform pointwise LOWER bound on the ' +
              'nearest-pair minimal gap g_min(mu_N) >= c / N^{alpha} holding for ' +
              'every N with an N-independent c > 0. This is the sole missing ' +
              'ingredient: supplying it turns C_H into a genuine finite constant ' +
              'and the assembled E_coll into an unconditional upper bound. No ' +
              'sub-RH object supplies it (imp-35101 TYPE, imp-36214 SIGN, ' +
              'imp-35147 STRENGTH all negative); the requirement is ' +
              'RH-equivalent as N -> infinity.',
            verdict:
              'The G6/G6a/C_H bridge is discharged at every constant EXCEPT the ' +
              'single Gronwall factor C_Lip, which provably diverges. The ' +
              'precise obstruction blocking the unconditional Lambda theorem is ' +
              'the absence of a finite N-uniform C_Lip (equivalently a uniform ' +
              'nearest-pair minimal-gap lower bound); nothing in Routes B/C, ' +
              'which close only the Step-3 lim-sup skeleton, touches this ' +
              'factor. G6a_shock_lipschitz remains OPEN; C_mb stays ' +
              'GUE-conditional (imp-486); Platt-Trudgian Lambda <= 0.2 stays ' +
              'SOTA; NO QED.',
            by: 'imp-97707',
          },
          closed: false,
        },
        {
          key: 'G-Etrunc-Eflow-constants',
          label: 'Explicit discharge of the E_trunc and E_flow constants',
          need:
            'Replace the imp-345 rigorous-MODULO-constants status with explicit ' +
            'unconditional numerical constants: the E_flow heat-flow term is only ' +
            'rigorous up to unnamed constants, and E_trunc is a Guth-Maynard ' +
            'tail whose prefactor/exponent must be pinned unconditionally (the ' +
            'imp-34791 audit flagged a prefactor 3->5 correction and a WRONG ' +
            'Ramaré line, so the constant chain is not yet certified). Until each ' +
            'constant is a discharged number, the assembled E(N) is not a rigorous ' +
            'bound even with G6a closed.',
          machinery: 'imp-345, imp-354, imp-34791',
          feedsInto: 'the additive assembly E(N) = E_coll + E_trunc + E_flow',
          closed: false,
        },
        {
          key: 'G-EN-ladder-verify',
          label: 'Assembled-E(N) verification at the imp-321 ladder',
          need:
            'A verification that the ASSEMBLED E(N) formula (all three terms with ' +
            'their discharged constants carried through) actually satisfies ' +
            'E(N) -> 0 across the imp-321 N-ladder. The existing ladder rows are ' +
            'finite-N floating-point evaluations of the surrogate, not a certified ' +
            'evaluation of the fully-assembled formula; the imp-35100 far-tail ' +
            'measurement further flags that the constant E_trunc floor can outlive ' +
            'the vanishing GUE-conditional E_coll, so E(N) -> 0 at the ladder is ' +
            'itself in question until the constants are pinned. HONEST STATUS ' +
            '(imp-35164): on the CURRENT surrogate, E(N) does NOT tend to 0 -- it ' +
            'floors at the fixed-strip constant E_trunc = 3.06e-5, so the ' +
            'surrogate as written cannot itself supply the Step-4 E(N) -> 0 rate. ' +
            'The only scoped route that would change this is imp-35149\'s ' +
            'vanishing-strip Knob A (an N-indexed growing verified height T_v(N) ' +
            'at fixed abscissa, NOT the imp-2631 fixed T_v = 3e12 strip), whose ' +
            'hard obligation R3 is an unconditional supply of T_v(N) -> infinity ' +
            'beyond the Platt-Trudgian verified height -- OPEN.',
          machinery: 'imp-321, imp-3220, imp-3406, imp-35100, imp-35149',
          feedsInto: 'the headline Step-4 rate E(N) -> 0',
          // imp-36195 (scoping/enumeration ONLY; discharges nothing, changes no
          // bound, no operator positivity, respects the imp-2519 no-overclaim
          // guard, NO QED): the assembled E(N) = E_coll + E_trunc + E_flow has
          // only ever been evaluated at finite N in floating point on the
          // imp-321 ladder (plus the imp-2860 SINGLE-point N* = 1e4 outward-
          // rounded bracket). Enumerate WITHOUT claiming discharge the concrete
          // ingredients an interval-arithmetic (per-rung, machine-checked) or
          // N-uniform (all-N, closed-form) verification of the ASSEMBLED formula
          // would require, and grade which leg is a bounded engineering
          // extension vs which is analytically blocked.
          assembledCheckScoping: {
            question:
              'What does a rigorous verification of the ASSEMBLED E(N) formula ' +
              '(all three terms, discharged constants carried through) require, ' +
              'beyond the existing finite-N float64 ladder rows and the imp-2860 ' +
              'single-point N* = 1e4 interval bracket?',
            twoLegs:
              'Two distinct verification targets are conflated in the raw ' +
              'obligation. LEG-A (interval, per-rung): extend the imp-2860 ' +
              'single-N* outward-rounded [E_lo, E_hi] to EVERY rung of the ' +
              'imp-321 ladder, certifying the tabulated float64 rows against ' +
              'rounding. LEG-B (N-uniform, all-N): a closed-form envelope ' +
              'E(N) <= f(N) with f explicitly decreasing and f(N) -> 0 holding ' +
              'for ALL N, including ABOVE the finite ladder. These have very ' +
              'different difficulty and are graded separately below.',
            legA_intervalPerRung: {
              grade:
                'bounded engineering extension of imp-2860, BLOCKED only by the ' +
                'two sibling obligations (constants + C_H), not by new analysis',
              ingredients: [
                'A1: retype each of the three sub-terms as an outward-rounded ' +
                  'Interval-VALUED FUNCTION of N over the ladder, not a single ' +
                  'working point. imp-2860 brackets E_flow, E_coll, E_trunc only ' +
                  'at N* = 1e4; the per-rung check re-instantiates each bracket at ' +
                  'every imp-321 N using the same interval-arithmetic primitives ' +
                  '(src/math/interval-arithmetic.js outward-rounded log/sqrt/div).',
                'A2: carry the DISCHARGED constants from the two sibling ' +
                  'obligations. Until G-Etrunc-Eflow-constants pins the E_flow / ' +
                  'E_trunc constants unconditionally and G6a supplies a proven ' +
                  'C_H (not the imp-2642 C_H = 0.127 ANSATZ), the per-rung sum ' +
                  'certifies only NUMERIC WIDTH under rounding, exactly the ' +
                  'imp-2860 caveat -- not that E(N) is a true upper bound.',
                'A3: resolve the imp-2715 non-co-additivity at EACH rung. E_trunc ' +
                  'and E_coll must be instantiated at the SAME height per N; the ' +
                  'per-rung check must pick, for every N, whether the fixed PT ' +
                  'strip (sigma = 3/4, E_trunc = 3.06e-5) or a moving strip ' +
                  'governs, so no rung pastes brackets from incompatible ' +
                  'instantiation heights (the double-count imp-2715 flags).',
              ],
            },
            legB_Nuniform: {
              grade:
                'analytically BLOCKED; not reachable by extending the point-' +
                'interval toolkit',
              ingredients: [
                'B1: a monotone-decay / tail lemma E(N) <= f(N) valid for ALL N, ' +
                  'replacing the finite tabulated rungs. The imp-321 ladder is ' +
                  'finite (stops at N_max); no finite table certifies asymptotic ' +
                  'behaviour, so an explicit ABOVE-LADDER tail certificate is ' +
                  'required, which the point-evaluation Interval class does not ' +
                  'supply (it encloses values at points, not envelopes over an ' +
                  'unbounded N-range).',
                'B2: a decay that actually reaches 0. HONEST STATUS (imp-35164): ' +
                  'on the CURRENT surrogate E(N) does NOT tend to 0 -- it floors ' +
                  'at the fixed-strip constant E_trunc = 3.06e-5, and imp-35100 ' +
                  'shows that constant floor can OUTLIVE the vanishing GUE-' +
                  'conditional E_coll. So LEG-B is not merely un-run: as written ' +
                  'the assembled surrogate has no N-uniform decay to certify.',
                'B3: the vanishing-strip Knob A (imp-35149): the only scoped ' +
                  'route that gives E(N) -> 0 is an N-indexed GROWING verified ' +
                  'height T_v(N) at fixed abscissa, whose hard obligation R3 is ' +
                  'an unconditional supply of T_v(N) -> infinity BEYOND the ' +
                  'Platt-Trudgian verified height X ~ 3e12 -- OPEN, and the same ' +
                  'more-verified-height lever the G6a weakerGapAssessment (C6) ' +
                  'and the PT-floor audit both land on.',
              ],
            },
            verdict:
              'LEG-A (per-rung interval) is a bounded extension of imp-2860 that ' +
              'is nonetheless GATED by the two sibling obligations: it can only ' +
              'certify the tabulated rows against rounding, never that E(N) is a ' +
              'true bound, until the E_flow / E_trunc constants and C_H are ' +
              'discharged. LEG-B (N-uniform) is analytically blocked -- the ' +
              'assembled surrogate as written floors at E_trunc = 3.06e-5 and ' +
              'has no decay to certify, so LEG-B reduces to the OPEN vanishing-' +
              'strip Knob A (T_v(N) -> infinity beyond X ~ 3e12).',
            conclusion:
              'An interval-arithmetic assembled-E(N) check is reachable per-rung ' +
              'but vacuous until the constants and C_H are pinned; an N-uniform ' +
              'check is not reachable at all on the current surrogate and inherits ' +
              'the same more-verified-height wall as the rest of the program. ' +
              'G-EN-ladder-verify stays OPEN; changes no bound; C_mb stays GUE-' +
              'conditional (imp-486); Platt-Trudgian Lambda <= 0.2 stays SOTA; ' +
              'NO QED.',
            by: 'imp-36195',
          },
          closed: false,
        },
      ],
      caveat:
        'Scoping map only. Discharging all three would elevate Step 4 to ' +
        'rigorous and (with t_c >= 0 automatic) give Lambda <= E(N) -> 0, hence ' +
        'Lambda <= 0; but the C_mb many-body correction remains an irreducible ' +
        'GUE conditional (imp-486), capping the reachable claim at RH-modulo-GUE. ' +
        'Changes NO Lambda bound on its own; Platt-Trudgian Lambda <= 0.2 remains ' +
        'SOTA; NO QED.',
      by: 'imp-35098',
    },
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
      'This is the capstone of the whole approach. Everything upstream must ' +
      'be rigorous; this step is just the final combination.',
    // imp-35074 (scoping/assessment ONLY; changes no bound, establishes no
    // operator positivity, closes nothing, respects the imp-2519 no-overclaim
    // guard, NO QED): unlike Step 2 (imp-35058) Step 5 carried no enumeration
    // of what its rigorous closure needs. Step 5 is a bookkeeping COMBINATION,
    // so it inherits the UNVERIFIED grade entirely from its upstream inputs:
    // it cannot be discharged until every ingredient below is discharged. The
    // three missing links compose as follows into a Step-5 RH statement, and
    // ALL THREE remain OPEN:
    //   (per-N translation) + (Step-4 E(N) bridge) => unconditional Lambda <= 0;
    //   Lambda <= 0 with Rodgers-Tao Lambda >= 0 => Lambda = 0;
    //   Lambda = 0 with de Bruijn 1950 (imp-327 height mapping) => RH.
    // The C_mb link is the irreducible named conditional (imp-486): even with
    // the other two links closed, the per-N route-A many-body correction stays
    // GUE-conditional, so the assembled statement is RH-modulo-GUE, not
    // unconditional RH.
    rigorousUpgradeGap: {
      grade: 'unverified',
      wouldRequire: 'rigorous (unconditional) OR rigorous-modulo-GUE',
      status: 'OPEN — Step 5 is a pure combination; none of its three input links is discharged',
      obligations: [
        {
          key: 'G5-perN-translation',
          label: 'Per-N translation of the Step-3 unconditional lim-sup',
          need:
            'A per-N bound r(N) on |t_c(N)| derived from the Step-3 UNCONDITIONAL ' +
            'lim sup_{N->infty} |t_c(N)| <= 0 (imp-341/imp-344, Koksma-Hlawka, no ' +
            'GUE). The lim-sup alone does not yield the per-N rate that the Step-4 ' +
            'E(N) bridge constants consume; routes (A) imp-336 monotonicity, (B) ' +
            'imp-348 O(1/N) local-law rigidity, (C) imp-337/342/343 density squeeze ' +
            'are the candidate translations and none is closed.',
          machinery: 'imp-341, imp-344, imp-348, imp-336, imp-337, imp-342, imp-343',
          feedsInto: 'Step-4 E(N) bridge constants (NOT the headline inequality) per imp-2564',
          closed: false,
        },
        {
          key: 'G5-step4-bridge',
          label: 'Step-4 Polymath15 G6a_shock_lipschitz bridge',
          need:
            'An unconditional E(N) -> 0 in |Lambda - (-t_c(N))| <= E(N), whose sole ' +
            'open sub-gap is G6a_shock_lipschitz: the Hoelder-1/2 modulus of tau_c at ' +
            'the Burgers shock feeding C_H in E_coll. imp-366 ported the Polymath15 ' +
            'Lemma 5.2 LEDGER but the same shock modulus is RH-HARD (imp-2640 gap-' +
            'Lipschitz Gronwall discharge NEGATIVE, ch-wall-frontier-verdict-2026-06-26 ' +
            'RH-HARD-CONFIRMED); the asymptotic modulo persists (imp-35056).',
          machinery: 'imp-345, imp-366, imp-2640, imp-3671',
          feedsInto: 'unconditional Lambda <= E(N) -> 0, hence Lambda <= 0 combined with t_c >= 0',
          closed: false,
        },
        {
          key: 'G5-cmb-gue',
          label: 'C_mb many-body correction — irreducible GUE conditional',
          need:
            'The Route-A many-body Calogero-Moser correction C_mb is the sole ' +
            'irreducible named conditional (imp-486 exhaustive search: no ' +
            'unconditional C_mb bound; GGM+Huxley fail identically). Unless a ' +
            'GUE-free replacement is found, the assembled Step-5 statement is ' +
            'RH-MODULO-GUE-UNIVERSALITY, not unconditional RH. This link cannot ' +
            'be closed by bookkeeping.',
          machinery: 'imp-486, imp-462',
          feedsInto: 'conditions the per-N route-A translation; leaves RH conditional on GUE',
          closed: false,
          // imp-36079 (assessment/scoping ONLY; changes NO bound, closes NOTHING,
          // respects the imp-2519 no-overclaim guard, NO QED): does the irreducible
          // C_mb correction admit a finite-N NON-GUE surrogate over a bounded window,
          // and how far does that surrogate sit from the GUE-conditional constant?
          surrogateAssessment: {
            answer:
              'YES on a bounded window, NO uniformly. A purely finite-N, non-GUE, ' +
              'non-ESY-local-law surrogate for C_mb ALREADY exists over bounded ' +
              'unfolding windows and is directly computable: (i) the imp-963 OLS-' +
              'measured C_mb on [100, 1e4] (imp-2632, a fit not an N-uniform bound), ' +
              'and (ii) the STRONGER imp-3725 true-flow two-sided enclosure of t_c(N) ' +
              'per H_raw plateau, certifying K_paper <= 2.4238e-6 uniformly on the ' +
              'CLOSED window [1e4, 1e6] with zero GUE input (a real-analysis lemma). ' +
              'Both are genuine finite-N non-GUE surrogate bounds on the window they ' +
              'cover.',
            residualGap:
              'The gap to the GUE-conditional constant is exactly the uncomputable ' +
              'asymptotic (N -> infinity) tail N > N_hi. The surrogate is window-LOCAL: ' +
              'it supplies NO N-uniform control past its computed ceiling N_hi, and the ' +
              'imp-3725 enclosure is a per-plateau interval-RK4 measurement whose cost ' +
              'is O(N^2) per rung (heavy-offline-compute-pool-starvation), so extending ' +
              'N_hi is bounded compute, never a limit. The GUE conditional is precisely ' +
              'what supplies the N -> infinity universality (ESY local law) that the ' +
              'per-N route-A translation needs beyond any finite window; that tail is ' +
              'the irreducible residue. Quantitatively the surrogate value 2.4238e-6 ' +
              'sits arbitrarily far (in the extrapolation sense) from the GUE-conditional ' +
              'constant because no finite N_hi bounds the sup over N > N_hi without a ' +
              'universality input.',
            verdict:
              'Surrogate DOES NOT discharge the imp-486 irreducible reduction: it ' +
              'replaces the conditional ONLY on the bounded window it computes, leaving ' +
              'the asymptotic tail GUE-conditional. The assembled Step-5 claim stays ' +
              'RH-MODULO-GUE-UNIVERSALITY; Platt-Trudgian Lambda <= 0.2 remains the peer-reviewed benchmark; ' +
              'NO QED. This confirms (does not weaken) the irreducible grade.',
            by: 'imp-36079',
          },
          // imp-96093 (assessment/scoping ONLY; changes NO bound, closes NOTHING,
          // establishes no operator positivity, respects the imp-2519 no-overclaim
          // guard, NO QED): does the post-peak sigma(N) = E_coll/E(N) decay -- E_coll
          // becoming negligible relative to the constant E_trunc floor in the far tail
          // -- open any unconditional foothold on E_coll that removes or weakens the
          // C_mb GUE conditionality over some N range? Verdict: NO, for two compounding
          // reasons plus a disjoint-window structure, detailed below.
          farTailAssessment: {
            question:
              'Does the post-peak sigma(N) = E_coll/E(N) decay (imp-33582: peak ~9.22e5, ' +
              'above 0.9 until N ~ 2.57e7, halved at N ~ 3.27e9, below 0.1 only at ' +
              'N ~ 3.21e11) open an unconditional foothold on E_coll that removes or ' +
              'weakens the C_mb GUE conditionality (imp-486) over some N range, or is ' +
              'the conditionality irreducible even in the far tail?',
            circularity:
              'The sigma(N) decay curve is itself COMPUTED with the GUE-conditional ' +
              'C_mb <= 1. The far-tail smallness of E_coll (E_trunc floor overtaking the ' +
              'vanishing E_coll) is a CONCLUSION OF that conditional bound, not an ' +
              'independent fact. Stripping the conditionality removes the only bound that ' +
              'makes E_coll finite, so one cannot even assert E_coll decays -- the premise ' +
              '"E_coll is negligible in the far tail" presupposes the very conditionality ' +
              'the foothold would remove. The argument is circular.',
            noCrudeBound:
              'The afford-crudeness idea (inflate C_mb <= 1 to some unconditional ' +
              'C_mb <= M and note M * E_coll stays dominated by E_trunc as sigma -> 0) ' +
              'fails at the root: imp-486 exhaustive search found NO unconditional finite ' +
              'bound C_mb <= M at all (GGM + Huxley fail identically). The boundedness of ' +
              'the many-body Calogero-Moser correction itself requires the ESY local law ' +
              '(GUE universality); there is no crude unconditional E_coll bound of any ' +
              'constant to carry through the far tail.',
            disjointWindows:
              'The one genuine GUE-free unconditional E_coll ingredient (imp-3725 ' +
              'true-flow enclosure K_paper <= 2.4238e-6) holds only on the CLOSED window ' +
              '[1e4, 1e6] below the computed ceiling N_hi -- precisely where sigma is near ' +
              'its peak and E_coll DOMINATES. The far-tail regime where E_coll is ' +
              'negligible (N > 3.21e11) sits ABOVE any N_hi, exactly where the surrogate ' +
              'supplies nothing. Unconditional control and E_coll-negligibility are ' +
              'anti-aligned in N and DISJOINT: the foothold one would want (an ' +
              'unconditional bound in the window where E_coll is negligible) is ' +
              'structurally unavailable.',
            residualSubGap:
              'SG-96093-cmb-boundedness: whether some non-GUE route proves merely that ' +
              'C_mb is BOUNDED (a finite, possibly non-numeric, N-uniform M) -- which ' +
              'would let the far-tail decay carry through with a finite inflation -- ' +
              'remains the same OPEN imp-486 question. No such route is known; this ' +
              'assessment neither supplies nor refutes one.',
            verdict:
              'NO unconditional foothold. The far-tail sigma(N) decay does NOT remove or ' +
              'weaken the C_mb GUE conditionality over ANY N range: the decay curve is ' +
              'circular on the conditional bound, no unconditional finite C_mb bound ' +
              'exists to inflate, and the only unconditional window is disjoint from the ' +
              'E_coll-negligible regime. Confirms (does not weaken) the imp-486 ' +
              'irreducible grade. Changes NO bound; C_mb stays GUE-conditional; ' +
              'Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
            by: 'imp-96093',
          },
          // imp-97402 (assessment/scoping ONLY; changes NO bound, closes NOTHING,
          // establishes no operator positivity, respects the imp-2519 no-overclaim
          // guard, NO QED): can any UNCONDITIONAL partial bound on C_mb (a weaker
          // constant, a restricted range, or a non-GUE input) shave the conditional
          // SHARE sigma(N) = E_coll/E(N) -- which peaks at ~0.9494 near N ~ 9.22e5
          // (imp-3220/imp-3406) -- or does the attempt reach the precise obstruction
          // that forces GUE universality? Verdict: NO share reduction; the obstruction
          // is pinned below.
          shareReductionAssessment: {
            question:
              'Does any unconditional partial bound on C_mb (weaker constant, ' +
              'restricted range, or non-GUE input) shave the conditional share ' +
              'sigma(N) = E_coll/E(N), peak ~0.9494 near N ~ 9.22e5, or reach the ' +
              'precise obstruction forcing GUE universality?',
            directionality:
              'A WEAKER constant is the wrong direction. sigma = E_coll/E(N) and ' +
              'E_coll is monotone increasing in the C_mb prefactor, so replacing the ' +
              'GUE-conditional C_mb <= 1 with an unconditional weaker C_mb <= M (M > 1) ' +
              'INFLATES E_coll and RAISES sigma; it cannot shave the share. Only a ' +
              'TIGHTER unconditional c < 1 would lower sigma, and imp-486 exhaustive ' +
              'search yields no unconditional c < 1 (indeed no unconditional finite M ' +
              'at all; GGM + Huxley fail identically). Share reduction via a partial ' +
              'constant is therefore structurally unavailable.',
            peakCoincidence:
              'The share peak N ~ 9.22e5 sits INSIDE the closed window [1e4, 1e6] where ' +
              'the imp-3725 true-flow enclosure (K_paper <= 2.4238e-6, zero GUE input) ' +
              'holds. So the peak-region E_coll is window-locally computable without GUE ' +
              '-- but this does NOT shave the analytic chain, which invokes C_mb <= 1 ' +
              'N-uniformly (one constant across all N), not window-by-window. A per-window ' +
              'unconditional value cannot be spliced into an N-uniform link without an ' +
              'N-uniform surrogate, which is exactly what is missing (imp-36079 ' +
              'window-local, disjoint from the far tail per imp-96093). The peak share ' +
              'stays conditional in the assembled chain even where a local surrogate exists.',
            preciseObstruction:
              'C_mb is the N-UNIFORM bound on the many-body Calogero-Moser correction, ' +
              'i.e. a uniform bound on the sum over eigenvalue interactions built from ' +
              'the local k-point correlation functions of the zeros at unfolded scale ' +
              'O(1). Controlling those local correlations N-uniformly IS the ESY-type ' +
              'local law / Montgomery pair-correlation statement -- GUE universality is ' +
              'not an incidental hypothesis attached to C_mb but the definitional content ' +
              'of any N-uniform C_mb bound. Hence every partial route (weaker constant, ' +
              'restricted range, alternative input) either changes no share (wrong ' +
              'direction or window-disjoint) or silently re-imports the universality it ' +
              'was meant to avoid. This is the precise obstruction.',
            residualSubGap:
              'SG-97402-cmb-uniform-nongue: whether a genuinely non-GUE route can supply ' +
              'an N-uniform (even non-numeric) local-correlation bound distinct from the ' +
              'ESY local law remains the same OPEN imp-486 question; this assessment ' +
              'neither supplies nor refutes such a route.',
            verdict:
              'NO share reduction. No unconditional partial bound on C_mb shaves the ' +
              'conditional share sigma(N): a weaker constant moves it the wrong way, no ' +
              'tighter unconditional constant exists, the peak-region local surrogate is ' +
              'not N-uniform, and any N-uniform bound is definitionally a GUE-universality ' +
              'statement. Confirms (does not weaken) the imp-486 irreducible grade. ' +
              'Changes NO bound; C_mb stays GUE-conditional; no unconditional Lambda ' +
              'movement; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
            by: 'imp-97402',
          },
        },
      ],
      caveat:
        'Scoping map only. Step 5 establishes no operator positivity and changes ' +
        'NO Lambda bound; it is inert until Steps 3-perN and 4 are rigorous. Even ' +
        'then the C_mb GUE conditional (imp-486) caps the reachable claim at RH-' +
        'modulo-GUE. Platt-Trudgian Lambda <= 0.2 remains the peer-reviewed benchmark; NO QED.',
      by: 'imp-35074',
      // imp-95235 (scoping/assessment ONLY; changes NO bound, closes NOTHING,
      // establishes no operator positivity, respects the imp-2519 no-overclaim
      // guard, NO QED): across the three OPEN input links enumerated in
      // obligations above, which one is the BINDING obstruction -- the link that
      // blocks unconditional RH regardless of per-N route AND is itself certified
      // as hard as RH? Per-link partial-discharge audit + verdict below.
      bindingObstructionAssessment: {
        question:
          'Of the three OPEN input links, which is the binding obstruction to an ' +
          'unconditional Step-5 RH statement (route-independent AND certified hard)?',
        links: [
          {
            key: 'G5-perN-translation',
            partialDischarge:
              'PARTIAL. The lim-sup |t_c(N)| <= 0 itself is UNCONDITIONAL via Route ' +
              'B (imp-341 Burgers, PRIMARY, GUE-free); the missing piece is only the ' +
              'per-N RATE r(N) that the Step-4 bridge constants consume. Three ' +
              'un-refuted candidate translations remain -- (A) imp-336 monotonicity, ' +
              '(B) imp-348 O(1/N) local-law rigidity, (C) imp-337/342/343 density ' +
              'squeeze -- none closed, none refuted.',
            binding: false,
            reason:
              'Multiple live candidate routes, none certified a wall. A missing rate, ' +
              'not a proven-hard obstruction. Not the binding link.',
          },
          {
            key: 'G5-step4-bridge',
            partialDischarge:
              'PARTIAL LEDGER ONLY. imp-366 ported the Polymath15 Lemma 5.2 LEDGER, ' +
              'but the sole open sub-gap G6a_shock_lipschitz -- the Hoelder-1/2 ' +
              'modulus of tau_c at the Burgers shock feeding C_H in E_coll -- is ' +
              'certified RH-HARD (imp-2640 gap-Lipschitz Gronwall discharge NEGATIVE; ' +
              'ch-wall-frontier-verdict-2026-06-26 RH-HARD-CONFIRMED). No repo module ' +
              'supplies an unconditional bound on the shock modulus; the asymptotic ' +
              'modulo persists (imp-35056).',
            binding: true,
            reason:
              'ROUTE-INDEPENDENT: every per-N translation still needs Step-4 E(N) -> ' +
              '0, so this link is on the critical path of ALL routes. It is also the ' +
              'ONLY link certified as hard as RH itself. Hence the binding ' +
              'obstruction for an unconditional Lambda <= 0.',
          },
          {
            key: 'G5-cmb-gue',
            partialDischarge:
              'WINDOW-LOCAL SURROGATE ONLY (imp-36079): imp-3725 certifies K_paper ' +
              '<= 2.4238e-6 GUE-free on the CLOSED window [1e4, 1e6], but supplies NO ' +
              'N-uniform control past N_hi; irreducible per imp-486 (no unconditional ' +
              'C_mb bound; GGM+Huxley fail identically).',
            binding: false,
            reason:
              'Conditions ONLY the Route-A many-body per-N translation; Routes B/C ' +
              'are GUE-free and bypass C_mb entirely. It caps Route A at ' +
              'RH-modulo-GUE-universality but does NOT block the GUE-free path, so it ' +
              'is not the binding obstruction to unconditional RH (only to Route A).',
          },
        ],
        verdict:
          'BINDING OBSTRUCTION = G5-step4-bridge (G6a_shock_lipschitz). It is the ' +
          'only link that is BOTH route-independent (on the critical path of every ' +
          'per-N translation) AND certified RH-HARD. G5-perN retains live ' +
          'un-refuted routes (a missing rate, not a wall) and G5-cmb binds only ' +
          'Route A (Routes B/C bypass it). Scoping only: Step 5 stays unverified, ' +
          'RH does not follow, NO Lambda bound changes. Platt-Trudgian Lambda <= ' +
          '0.2 remains the peer-reviewed benchmark; NO QED.',
        by: 'imp-95235',
      },
    },
    // imp-35099 (scoping/assessment ONLY; changes no bound, closes nothing,
    // respects the imp-2519 no-overclaim guard, NO QED): COMPLEMENT to the
    // imp-35074 rigorousUpgradeGap above. That block enumerates the three OPEN
    // input LINKS whose closure is a research problem; this block enumerates the
    // mechanical BOOKKEEPING-ASSEMBLY items that would STILL remain even after
    // those links (and Step 4) are discharged -- the "have all inputs, now write
    // the capstone" checklist named in the step need field. These items close
    // NOTHING on their own and are inert until Step 4 is rigorous; they are the
    // clerical residue, not a proof. currentStatus must NEVER state RH follows.
    conditionalBookkeeping: {
      framing:
        'Conditional-on-Step-4 (and on the G5-perN-translation link). If and ' +
        'ONLY IF Steps 3-perN and 4 become rigorous do these items become ' +
        'executable; today every one is BLOCKED on that upstream closure. ' +
        'Enumerating them does NOT assert RH and moves NO Lambda bound.',
      items: [
        {
          key: 'B1-final-assembly-write',
          label: 'Write the final RH combination into sota-lambda-claim.js',
          need:
            'Assemble, in SOTA_LAMBDA_CLAIM (src/data/sota-lambda-claim.js, ' +
            'created imp-375), the closed-form chain: an unconditional Lambda <= 0 ' +
            '(from the Step-4 E(N) -> 0 bridge with t_c >= 0) + Rodgers-Tao ' +
            'Lambda >= 0 (2020) => Lambda = 0 => (de Bruijn 1950 / imp-327 height ' +
            'mapping) RH. Today SOTA_LAMBDA_CLAIM headline is the finite-height / ' +
            'asymptotic-modulo-constants record, NOT an unconditional RH claim; the ' +
            'bookkeeping is a STRING/RECORD edit gated on the B-links, not new math.',
          citationChain: 'imp-375 (SOTA record), imp-356 (chain assembly), imp-327 (de Bruijn height mapping)',
          blockedOn: 'G5-step4-bridge + G5-perN-translation + G5-cmb-gue (all OPEN)',
          closed: false,
        },
        {
          key: 'B2-effective-height-Tstar',
          label: 'Produce the effective height T-star(N) at which the assembled result holds',
          need:
            'Report T_star(N) = effectiveHeightForN(N) (Riemann-von Mangoldt ' +
            'inversion, imp-327, src/data/lambda-rh-height-mapping.js) at the N the ' +
            'closed Steps 3-4 actually reach, and state the conclusion as RH up to ' +
            'height T_star(N) -- NOT RH unconditionally. The inversion machinery ' +
            'already exists and is cross-checked by zeroCountAtHeight; the residual ' +
            'clerical act is only substituting the achieved N. Height is bounded by ' +
            'whatever finite N the upstream rate supplies, so T_star(N) is FINITE.',
          citationChain: 'imp-327 (effectiveHeightForN / N_TO_T_STAR_TABLE), imp-375 (headline.effectiveHeight)',
          blockedOn: 'the achieved-N of the closed Steps 3-4 (undefined while OPEN)',
          closed: false,
        },
        {
          key: 'B3-conditional-caveat-propagation',
          label: 'Propagate the RH-modulo-GUE caveat into the final record',
          need:
            'Even with B1/B2 mechanically done, the imp-486 C_mb GUE conditional ' +
            '(G5-cmb-gue above) caps the reachable claim at RH-modulo-GUE-universality ' +
            'on the Route-A per-N translation. The bookkeeping write MUST carry that ' +
            'caveat verbatim and MUST NOT upgrade the status string to unconditional ' +
            'RH; this preserves the imp-2519 no-overclaim guard.',
          citationChain: 'imp-486 (irreducible C_mb), imp-2519 (no-overclaim guard)',
          blockedOn: 'G5-cmb-gue (irreducible; not closable by bookkeeping)',
          closed: false,
        },
      ],
      caveat:
        'Scoping checklist only. NONE of B1-B3 is executable today: all are ' +
        'BLOCKED on the OPEN Step-4 / per-N / C_mb links (see rigorousUpgradeGap). ' +
        'Listing the clerical residue changes NO Lambda bound and does NOT make RH ' +
        'follow. Platt-Trudgian Lambda <= 0.2 remains the peer-reviewed benchmark; NO QED.',
      by: 'imp-35099',
    },
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
      reHarvest: {
        ticket: 'imp-2624',
        cause:
          'imp-2615 appended "— DONE (imp-2546)" to the closesIf string itself, ' +
          'which shifted the producer harvest key (action.slice(0,60)) and the ' +
          'derived title, so auto-ticket-producer.mjs re-seeded the same ' +
          'already-met closesIf as imp-2624. No new proof work was needed: the ' +
          'named action (rerun the imp-299/imp-371 barrier estimate on the ' +
          'imp-360 extended ladder) was executed by imp-2546 and is already ' +
          'recorded here, and imp371-barrier-cross-validation.js stays 6/6 ' +
          'tripwires green. imp-2624 now lives in the queue, so title-dedup in ' +
          'existingState() blocks any third harvest of this closure.',
        confirmedStillMet: true,
      },
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
    status:
      'STRUCTURAL PORT CLOSED; QUANTITATIVE BRIDGE OPEN. The imp-345/366/387 ' +
      'composition records the bridge form, but its E_coll constant still consumes ' +
      'the unresolved N-uniform C_H / G6a shock modulus.',
    owner: 'imp-345 + imp-366 + imp-387; quantitative residual imp-1264 / imp-2640 / imp-2674',
    nextTickets: ['imp-1264', 'imp-35056'],
    severity: 'open',
    blocks: 'unconditional quantitative Λ bounds assembled through the Dyson/collision route family',
  },
  {
    id: 'G6a',
    label: 'Hölder-1/2 modulus of τ_c at the Burgers shock',
    status:
      'LEDGER PORT CLOSED; QUANTITATIVE BRIDGE OPEN (2026-07 audit). ' +
      'imp-366 ported Polymath15 Lemma 5.2, but that port did NOT discharge the ' +
      'Holder-1/2 shock modulus supplying C_H in E_coll. C_H is RH-HARD / ' +
      'undischargeable ' +
      '(imp-2640 gap-Lipschitz Gronwall discharge NEGATIVE, imp-2674, ' +
      'ch-wall-frontier-verdict-2026-06-26 RH-HARD-CONFIRMED). G6a is therefore ' +
      'one load-bearing open gate in the RETRACTED imp-1261 3.06e-5 composition; ' +
      'other independent gates include the uncertified E_trunc constant, the ' +
      'unsupplied E(N)->0 limit, and finite-proxy identification. The former ' +
      '"sole modulo / bound" framing was an overclaim. Assessment only; changes ' +
      'no bound; NO QED.',
    owner: 'imp-366 (Lemma 5.2 port) + imp-2640 / imp-2674 (modulo persistence) + imp-35056 (reconcile)',
    nextTickets: [],
    severity: 'open',
    blocks: 'one of several gates in the withdrawn imp-1261 3.06e-5 composition',
  },
  {
    // imp-3401: formalizes the recurring imp-3066 "lone obstruction" (cited in the
    // honestCaveats of imp-3346 / imp-3347 / imp-3350 / imp-3351 but never recorded as a
    // named gap) as a single canonical open-gap descriptor carrying its best measured magnitude.
    id: 'G7',
    label: 'K_a ≥ 0 off-diagonal endpoint-Hankel operator positivity (the imp-3066 lone obstruction)',
    status:
      'OPEN (imp-3066 + imp-3351) — the RH-equivalent OPERATOR step the COMPLETE scalar mu^pass cover ' +
      '(imp-3007, residual deficit 0) leaves untouched. The scalar cover pins every DIAGONAL of ' +
      'R = Gpass^{-1/2} Gshear Gpass^{-1/2} strictly below 1, but Gshear is a genuine off-diagonal ' +
      'endpoint-Hankel form: the contraction ‖R‖ ≤ 1 (equivalently K_a ≥ 0) additionally needs the ' +
      'off-diagonal cross-terms bounded. Cited as the lone obstruction in the imp-3346 / imp-3347 / ' +
      'imp-3350 / imp-3351 honestCaveats; consolidated here into one named gap by imp-3401. The later ' +
      'capture-ratio C_inf extrapolation cluster (imp-3407 / imp-3440 / imp-3445 / imp-3461) is purely ' +
      'diagnostic numerics on the 1/U scaling of the capture ratio and, per its own honestCaveats, ' +
      'leaves this SAME K_a ≥ 0 magnitude untouched — imp-3416 confirms it remains the single ' +
      'irreducible RH-equivalent residual across that entire cluster, not a new or narrower gap. ' +
      'Assessment only; PT Lambda ≤ 0.2 stays SOTA; NO RH verdict.',
    statement:
      'K_a ≥ 0, i.e. the de-homogenized R = Gpass^{-1/2} Gshear Gpass^{-1/2} is a contraction ' +
      '(‖R‖ ≤ 1), where Gpass is the passive (cosh) diagonal and Gshear the shear (sinh) ' +
      'endpoint-Hankel Gram of section 26.',
    whatClosesIt:
      'A positivity bound on the OFF-DIAGONAL endpoint-Hankel cross-terms of Gshear that pointwise ' +
      '(scalar) weight domination cannot see — e.g. a dominating passive core making R a contraction ' +
      'on the actual section-26 Gram, not merely on a representative truncation.',
    currentMagnitude:
      'On the imp-3066 representative degree-4 monomial truncation (a = 0.5, U = 6): every diagonal ' +
      'R_jj < 1 (max ≈ 0.9909) yet the Perron operator norm ‖R‖ ≈ 4.617, an operator/diagonal gap ' +
      '≈ 3.626 fed entirely by the off-diagonal Hankel cross-terms (off-diagonal Frobenius norm ' +
      '≈ 4.082). imp-3351 confirms min eig(i·Gshear) = −‖Gshear‖ to machine precision at all 16 ' +
      '(a, U) cells (rank-2 hollow antisymmetry), so the Gpass = |Gshear| partial-isometry ‖R‖ = 1 ' +
      'is a tautology and the binding residual is exactly this still-unbounded off-diagonal magnitude. ' +
      'Live source: imp-3066-offdiagonal-hankel-obstruction.js .measured.',
    owner: 'imp-3066',
    nextTickets: [],
    severity: 'open',
    blocks: 'operator positivity K_a ≥ 0 (the RH-equivalent section-26 Gram contraction ‖R‖ ≤ 1)',
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
//   'bound'      — one of the six enumerated Lambda bounds.
//
// Edges are dependsOn: an edge A -> B means "A requires B". Every edge points
// UPSTREAM toward axioms, so a correct matrix is a DAG. The bound-to-bound
// edges are public-preprint -> Platt-Trudgian and imp-1088 -> imp-440. The
// private proof candidate points instead to its immutable v3 package/provenance block.

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
        'conditional here. imp-2674/imp-2640 NEGATIVE: the SAME imp-366 Holder-1/2 ' +
        'shock modulus supplies C_H in E_coll, and C_H is an undischargeable ' +
        'order-unity placeholder (gap-Lipschitz Gronwall diverges at the collision). ' +
        'So this leaf is NOT one-small-lemma-away from discharge — see cond-CH.',
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
        'larger N (imp-1082/1087/1088 sub-measurement gaps) will retire this conditional. ' +
        'DISCHARGED (imp-3725, 2026-07-03, modulo the Odlyzko zero table as input): ' +
        'the gap-domination bootstrap lemma (src/data/imp-3725-fmb-plateau-domination-' +
        'lemma.js) proves the TRUE-FLOW enclosure H^2/8 <= t_c(N) <= H^2/(8*theta) ' +
        'per plateau with theta >= 0.99716, giving certified K_paper(N) <= 2.4238e-6 ' +
        'uniformly on [1e4, 1e6] -- 8.3e4x below the 0.2014 carryforward. The ' +
        'non-regression hypothesis and the 2.15 smooth-scale slack are no longer ' +
        'load-bearing on (1e4, 1e6]; the imp-1082/1087/1088 sub-measurement gaps ' +
        'become optional tightening, not soundness requirements. Node retained for ' +
        'dependency-graph continuity; residual conditioning of bound-imp-1088-finite-' +
        '1e6 now rests on its OTHER legs (see cond-CH).',
    },
    {
      id: 'cond-CH',
      label: 'C_H Holder-modulus constant in E_coll is O(1) (imp-2640 NEGATIVE: undischargeable)',
      kind: 'conditional',
      dependsOn: [],
      note:
        'imp-2674 reconciliation. imp-2640 found C_H in E_coll = C_H * ' +
        'W_1(mu_N, rho_inf)^(1/2) (imp-366 Holder-1/2 shock modulus) is an ' +
        'order-unity PLACEHOLDER, NOT a theorem-backed explicit constant: the ' +
        'gap-Lipschitz Gronwall constant DIVERGES at the collision, so the imp-366 ' +
        'proof yields no explicit value. The finite-N* = 1e4 beat therefore rests on ' +
        'the unproved expectation C_H = O(1) and is an ESTIMATE, not a rigorous ' +
        'unconditional bound. Companion soft spot: imp-2632 classified |t_c_proj| in ' +
        'L_cond as an OLS projection, not a rigorous upper bound on t_c(1e4).',
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
      label: 'imp-447 / imp-459 formal E_trunc_pt = 3.06e-5 (uncertified)',
      kind: 'block',
      dependsOn: ['ext-verified-zeros-T3e12'],
      note:
        'Historical formal value at T_PT = 3e12; the 2026-07 audit found the ' +
        'constant chain uncertified, so this is not an established error bound.',
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
    {
      id: 'blk-newman-01787854-v3-candidate-package',
      label: 'v3 0.1787854 candidate package and immutable replay provenance',
      kind: 'block',
      dependsOn: ['ext-verified-zeros-T3e12'],
      note:
        'Private repository judegomila/dbn-lambda-01787854-candidate-audit; tag ' +
        'review-01787854-v3; commit 2e9976c4becbf97e31c56fe75fce07cdff5dd4ea; ' +
        'tree 7f15ecf8c3dbc73d547a2d4a3f2287bd87802f44; top manifest SHA-256 ' +
        '89a201565d5b4a0f02ab49092e3189c7a6d3b0bfaa4e93630c68cf8c4155ae1c. ' +
        'The package presents the compact-slab, final-time half-strip, finite/tail ' +
        'error, material-replay, height, and criterion-weld certificates for review. ' +
        'Immutable provenance and successful replay do not establish mathematical correctness.',
    },
    // ── The six enumerated bounds ──
    {
      id: 'bound-rodgers-tao-2020',
      label: 'Lambda >= 0',
      kind: 'bound',
      dependsOn: ['lit-rodgers-tao'],
      note: 'Lower bound; rests only on the cited theorem.',
    },
    {
      id: 'bound-platt-trudgian-2021',
      label: 'Lambda <= 0.2 (peer-reviewed benchmark)',
      kind: 'bound',
      dependsOn: ['ext-verified-zeros-T3e12'],
      note: 'Heat-flow barrier on verified zeros; unconditional.',
    },
    {
      id: 'bound-public-preprint-01875',
      label: 'Lambda <= 0.1875 (public unrefereed claim)',
      kind: 'bound',
      dependsOn: ['bound-platt-trudgian-2021'],
      note:
        'Public certificate package listed by Optimization Problems; one omitted ' +
        'finite tile was repaired locally. Reproducible claim, not peer review.',
    },
    {
      id: 'bound-proof-candidate-01787854',
      label: 'Lambda <= 0.1787854 (unreviewed computer-assisted proof candidate)',
      kind: 'candidate-bound',
      countsAsEstablishedBound: false,
      dependsOn: ['blk-newman-01787854-v3-candidate-package'],
      note:
        'Candidate for an unconditional theorem, not an established bound. The private ' +
        'v3 package is unpublished, unpeer-reviewed, and unaccepted; the positive ' +
        'candidate bound would not prove RH even if validated.',
    },
    {
      id: 'bound-imp-1261-asymptotic',
      label: 'WITHDRAWN 3.06e-5 asymptotic composition (not a Lambda bound)',
      kind: 'withdrawn-claim',
      countsAsBound: false,
      dependsOn: [
        'blk-imp-341',
        'blk-imp-1149',
        'blk-ingham-447-459',
        'cond-polymath15-G6a',
      ],
      note:
        'Historical arithmetic only. Open gates include RH-equivalent G6a/C_H, ' +
        'uncertified E_trunc, unsupplied E(N)->0, proxy identification, and a ' +
        'refuted quantitative rate step.',
    },
    {
      id: 'bound-imp-440-finite-1e4',
      label: 'Lambda(1e4) <= 0.02 ESTIMATE (rigorous-modulo-C_H, measured)',
      kind: 'bound',
      dependsOn: [
        'blk-imp-963',
        'blk-ingham-447-459',
        'blk-imp-398',
        'blk-imp-399',
        'blk-imp-469',
        'cond-CH',
      ],
      note:
        'imp-2674: DOWNGRADED from rigorous-unconditional to an ESTIMATE gated on ' +
        'cond-CH. The dominant bridge-error term E_coll carries the undischarged ' +
        'C_H Holder-modulus placeholder (imp-2640 NEGATIVE), so the finite-N* beat ' +
        'is rigorous-modulo-C_H = O(1), not unconditional.',
    },
    {
      id: 'bound-imp-1088-finite-1e6',
      label: 'Lambda(1e6) <= 0.2 rigorous conditional (carryforward modulo F_mb non-regression)',
      kind: 'bound',
      dependsOn: ['bound-imp-440-finite-1e4', 'blk-imp-963', 'cond-fmb-nonregression-above-1e4'],
      note: 'Carryforward extension of imp-440; the F_mb non-regression leg is DISCHARGED by imp-3725 (certified K_paper <= 2.4238e-6 on [1e4, 1e6] at true-flow semantics, modulo the Odlyzko zero table); residual conditioning rests on the other legs (cond-CH et al.).',
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
  targetSOTA:
    'Λ ≤ 0.02 unconditional target, below the private 0.1787854 proof candidate, public 0.1875 claim, and accepted peer-reviewed 0.2 benchmark',
  // imp-35860: leading TL;DR banner so a reader sees the headline before the
  // long append-only measurement log below (currentStatus). Keep in sync by
  // hand -- this does not parse currentStatus, it just restates its opening.
  currentStatusTLDR:
    'STATUS GRADES: Platt-Trudgian Lambda <= 0.2 remains the peer-reviewed upper-bound benchmark. ' +
    'A public, unrefereed certificate package claims Lambda <= 0.1875; the Optimization Problems ' +
    'ledger lists it, and a local audit repaired one omitted finite sweep without substituting for ' +
    'expert review. A separate private v3 package proposes Lambda <= 0.1787854 as an unreviewed ' +
    'computer-assisted proof candidate for an unconditional bound; it is not established, published, ' +
    'peer-reviewed, or accepted, and RH still ' +
    'requires Lambda <= 0. In the inherited Dyson/collision family, ' +
    'Steps 1 and 3 supply an unconditional lim-sup skeleton, Step 2 is numerical, and the ' +
    'quantitative Step-4 G6/G6a/C_H bridge remains open; Route A also carries a GUE conditional. Step 5 is ' +
    'unverified, and RH does not follow. Everything after the opening paragraph of ' +
    'currentStatus below is a ' +
    'measurement-only refinement appendix (imp-33xxx/imp-35xxx landmark quantifications) -- ' +
    'it changes no bound and discharges no open gap. A separate seam-chain / signed-' +
    'certificate program (imp-95210..95420, three-obligation ledger in imp-95388) assesses ' +
    'whether a signed per-window certificate can transcribe the Lambda <= 0.14 completion ' +
    'contract -- a distinct question from the y-thaw package value -- under the same ' +
    'no-bound-change discipline; it is not part of this appendix and is tracked in the ' +
    'imp-95XXX data modules and the OpenFrontierPage seam-chain card, not graded-results.js ' +
    'or program-dag.js (those track only the separate y-thaw O1-O6 package-value ledger).',
  currentStatus:
    'STATUS RECONCILED 2026-07-28: Platt-Trudgian Lambda <= 0.2 remains the accepted peer-reviewed benchmark. ' +
    'The public 0.1875 Zenodo certificate-package claim is reproducible after a local finite-sweep repair ' +
    'and appears in the Optimization Problems ledger, but is unrefereed and not treated here as an accepted theorem. ' +
    'The private review-01787854-v3 fixed-height package at commit 2e9976c4becbf97e31c56fe75fce07cdff5dd4ea ' +
    'is an unreviewed computer-assisted proof candidate for an unconditional 0.1787854 bound. It presents ' +
    'compact-slab, final-time half-strip, full finite-material replay, direct-Dini, corrected 10.50-error, ' +
    'tail, height, and exact-criterion certificates, but neither their seal nor replay establishes the theorem. ' +
    'The candidate is unpublished, unpeer-reviewed, unaccepted, and it does not prove RH. ' +
    'For the inherited LAMBDA_CHAIN_STEPS, Steps 1 and 3 provide the unconditional zero-verification / ' +
    'lim-sup skeleton. Step 2 is numerical, the quantitative Step-4 Polymath15 bridge remains open at ' +
    'G6/G6a/C_H, and Step 5 is unverified. Historical finite values near 0.121 and 0.02 are estimates, ' +
    'not rigorous beats. Route A additionally requires GUE universality; Routes B and C close only the ' +
    'Step-3 lim-sup statement, not the bridge to an unconditional Lambda theorem. RH does not follow. ' +
    'PHASE 51 (2026-04-19, historical measurement log; no unconditional Λ theorem): ' +
    'three-path numerical sequence extended to 10^6. PATH 1 ' +
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
    'chain is the active research frontier. QUANTIFIED (imp-3220): the E(N) bridge conditional share ' +
    'sigma(N) = E_coll(N)/E(N) is U-shaped across N* in {2..10^6}, and is WIDEST (~94.9%) exactly at ' +
    'the N* = 10^6 ceiling — precisely the point PATH 1 extended the unconditional empirical E1/E2 ' +
    'floor to. RECONCILED (imp-3406): extrapolating sigma(N) past the 10^6 ceiling shows the ' +
    '"widest at 10^6" reading is a flat-cap SAMPLING ARTIFACT of the ladder endpoint, not a still-' +
    'climbing frontier — the true interior maximum sits at N ~ 9.22e5 (sigma_max ~ 0.9494), with ' +
    '10^6 landing just 2.1e-5 below it on the downslope. Past the peak sigma decays monotonically ' +
    'toward 0 as the constant truncation floor E_trunc outlives the vanishing GUE-conditional E_coll, ' +
    'so the empirical-vs-analytic conditional gap does NOT keep growing past the range PATH 1 covered ' +
    '— it has already essentially peaked at 10^6. QUANTIFIED (imp-33582): a finer ' +
    'post-peak grid (N in {1e6..1e12}) confirms the decay past the N ~ 9.22e5 peak is ' +
    'monotonic but NOT fixed-rate — the local decay exponent ramps from ~0.0105 in the ' +
    'first post-peak decade toward the far-tail 1/2 asymptote (~0.4310 by [1e11,1e12]) ' +
    'as the constant truncation floor E_trunc only slowly overtakes the vanishing GUE-' +
    'conditional E_coll. Concretely sigma stays above 0.9 until N ~ 2.57e7, halves at ' +
    'N ~ 3.27e9 (matching the independent imp-3444 E_coll=E_trunc crossover to ~0.4%), ' +
    'and drops below 0.1 only at N ~ 3.21e11 — the empirical-vs-analytic conditional ' +
    'gap keeps shrinking well past 10^6, but gradually; this is a quantified decay-' +
    'rate refinement only and changes no bound (C_mb remains GUE-conditional, imp-486). ' +
    'CHARACTERIZED (imp-33701): differencing the imp-33582 six-decade exponent ladder ' +
    'shows it is monotone in VALUE but its ramp velocity (first difference) RISES then ' +
    'FALLS — an S-shaped (sigmoid) approach to the 1/2 asymptote, not a straight or ' +
    'ever-steepening climb — with the ramp acceleration (second difference) changing ' +
    'sign convex-to-concave EXACTLY ONCE, a single knee landing in the [1e10,1e11] ' +
    'decade, steepest over the two-decade [1e9,1e11] plateau. Curvature diagnostic ' +
    'only; changes no bound (C_mb remains GUE-conditional, imp-486). ' +
    'REFINED (imp-33723/imp-33721): two independent follow-ups sharpen the N ~ 3.27e9 ' +
    'halving landmark. imp-33723 derives the neighboring imp-3444 E_coll=E_trunc ' +
    'crossover in CLOSED FORM as a Banach fixed point N_cross = (C_C/E_trunc)^2 * ' +
    'log T0(N_cross) ~ 3.280294e9, matching the original bisection value to ~1.7e-15 ' +
    'relative and confirming the ~0.4% gap to the halving landmark carries no ' +
    'discretization error (it is the Gronwall E_flow term, per imp-33601). imp-33721 ' +
    'separately re-differences the sigma(N) decay-exponent ramp on sub-decade brackets ' +
    'and relocates the imp-33701 sigmoid inflection knee a full decade down, from the ' +
    'whole-decade [1e10,1e11] bracket to N* ~ 3.38e9 — itself only ~3.3% above the ' +
    'same halving landmark. Both refinements are derivation/measurement only and ' +
    'change no bound. ' +
    'ASSESSED (imp-33848): the imp-33796 ordering N_half < N_cross (the sigma=0.5 ' +
    'halving landmark below the E_coll=E_trunc crossover) is provably STRICT in ' +
    'closed form within the component model, not merely at the recomputed ' +
    '~3.267e9 < ~3.280e9 values. With sigma(N) = E_coll/(E_coll+E_trunc+E_flow), ' +
    'the crossover condition E_coll = E_trunc forces sigma(N_cross) = ' +
    '1/(2 + E_flow/E_trunc), which is strictly below 1/2 whenever the Gronwall ' +
    'E_flow term (imp-398) is strictly positive; combined with sigma strictly ' +
    'decreasing past the N ~ 9.22e5 peak (established above) this gives ' +
    'sigma(N_cross) < 1/2 = sigma(N_half) => N_half < N_cross. The strictness ' +
    'thus reduces to two closed-form conditions -- E_flow(N_cross) > 0 and sigma ' +
    'monotone on [N_half, N_cross] -- both holding in the model, and the ~0.4% ' +
    'numerical gap is exactly the E_flow/E_trunc surplus 1/2 - sigma(N_cross). ' +
    'Derivation within the extrapolation component model only -- NOT rigorous, ' +
    'imp-3066 untouched, changes no bound (C_mb GUE-conditional, imp-486), NO QED. ' +
    'EXTENDED (imp-33743/imp-33744): two further closed-form derivations build on ' +
    'both landmarks. imp-33743 generalizes the imp-33723 fixed point to the ' +
    'sigma<0.1 far-tail landmark, solving E_coll = E_trunc*thr/(1-thr) at thr=0.1 ' +
    'via N_cross(thr) = (C_C(1-thr)/(E_trunc*thr))^2 * log T0(N_cross); the ' +
    'resulting closed-form-vs-empirical residual (~7.4e-5 at N ~ 3.21e11) is ' +
    '~54x TIGHTER than the ~0.4% halving residual, the gap traced to the ' +
    'vanishing E_flow term deep in the tail. imp-33744 derives the imp-33721 ' +
    'inflection-vs-halving near-coincidence in closed form as sigma_infl = ' +
    '1/2 - g’/(2g^2), reaching EXACTLY 1/2 only in the pure power-law limit; ' +
    'the measured ~3.3% offset is instead the log-factor running — a structural ' +
    'E_coll term, not the E_flow term implicated in the far-tail residual. Both ' +
    'are derivations/measurements only and change no bound (C_mb remains ' +
    'GUE-conditional, imp-486). ' +
    'EXTENDED (imp-33620): a finer post-peak ladder pushed to N = 1e15 confirms the ' +
    'separated E_coll local exponent keeps approaching the far-tail -1/2 asymptote ' +
    'MONOTONICALLY FROM ABOVE with NO overshoot (-0.4810 at N ~ 1e12 -> -0.4848 at ' +
    'N ~ 1e15, residual to -1/2 still ~0.0152 as log T0(N) saturates), and sigma ' +
    'first drops below 0.01 at N ~ 4.62e13 — ~2.16 decades past the imp-33582 ' +
    'sigma<0.1 landmark above. This is a further decay-rate refinement only and ' +
    'changes no bound (C_mb remains GUE-conditional, imp-486). ' +
    'RESOLVED (imp-34130): the ~0.0152 residual above KEEPS CLOSING toward zero -- it does ' +
    'NOT floor. Extending the OLS ladder to [1e17,1e18] and a log-space direct path past ' +
    'IEEE-double range shows resid(N) decays as ~1/(2 log T0), the identical law governing ' +
    'the sigma-share exponent (imp-33816); measurement only, changes no bound (C_mb remains ' +
    'GUE-conditional, imp-486). ' +
    'HONEST STATUS (imp-33660..imp-33682 lattice-floor cohort): the band-clearing floorUlp(n) ' +
    'peak/trough/gap/amplitude series measured across the shared [400,1200]/[1200,1600] cluster ' +
    'sample is measurement-only and weak-positive at best, with every apparent height or slope ' +
    'trend traced to a two-point (two-outlier) artifact rather than a genuine growth law; this ' +
    'cohort changes no bound and is closed as a dead-end diagnostic thread. ' +
    'COHORT (imp-33843/imp-33844/imp-33845): three further imp-3220/imp-3406-model refinements. ' +
    'imp-33843 fits the imp-33810 ~918x eflow_attr/resid_exp head-to-tail widening across the ' +
    'k=6..11 ladder and finds a log-linear (not power-law) form in k, RMSE ~0.116. imp-33844 ' +
    'derives the imp-33809 M3 saturation-curvature hump peak in closed form at the k=9 ' +
    'E_coll=E_trunc crossover as p_ecoll^2 ln10/8 (restoring the p_ecoll factor tightens the ' +
    'leading ln10/32 overshoot from +11.12% to +1.23%). imp-33845 sharpens the imp-33794 ' +
    'C_ren -> C_PS=pi/sqrt(2) approach into a fixed onset exponent, (C_ren - C_PS) ~ (4/3) ' +
    'eps^{3/2}, settling from 1.48839 (N=2e3) to 1.50000 (N=1e7). All three are ' +
    'derivation/measurement only within the extrapolation component model, change no bound, ' +
    'do NOT discharge H4, and C_mb remains GUE-conditional (imp-486); NO QED. ' +
    'COHORT (imp-33765/imp-33766/imp-33767): three further single-ticket landings. ' +
    'imp-33765 shows the G7/imp-3066 shear obstruction is PROVABLY one-dimensional in ' +
    's=a*U — ||R|| is invariant under the (a,U)->(a/lambda,lambda*U) scaling orbit, and ' +
    'both orthogonal softening levers (shear-coefficient rescaling, decoupled pass rate) ' +
    'are INADMISSIBLE, so the admissible truncation axis sets the ceiling, not a relief. ' +
    'imp-33766 finds H4 (strip-height fold-reading derivative) does NOT separate from H3 ' +
    '(curvature) — the Holder modulus back-conversion couples them through the same ' +
    'quadratic fold, so the minimal H4 input IS the H3 input and H3 (imp-3708) discharges ' +
    'H4 a fortiori. imp-33767 reconciles the imp-33744/imp-33729 sigma-inflection offset ' +
    'dichotomy on one common N ladder, showing the ~0.3-point gap is a landmark-choice ' +
    'artifact (halving vs crossover) that IS EXACTLY the E_flow displacement term. All ' +
    'three are derivation/measurement only, change no bound, do NOT discharge H4/G7, and ' +
    'C_mb remains GUE-conditional (imp-486); NO QED. ' +
    'COHORT (imp-33883/imp-33886/imp-33887): three further single-ticket landings. ' +
    'imp-33883 tests the imp-33853 on-axis fold-modulus small-eps expansion at general ' +
    'angle z_0=eps*e^{i theta} and finds BOTH the leading eps^{-3/2} amplitude modulus ' +
    '|A(theta)|=C_PS=pi/sqrt(2) and the eps^0 onset coefficient 4/3 are theta-INDEPENDENT ' +
    '-- only the complex phase rotates (winding rate 3/2, vanishing at theta=pi/2) -- so ' +
    'neither number is an on-axis artifact. imp-33886 puts formal significance numbers ' +
    'under the imp-33858 STRUCTURED-residual verdict: a Wald-Wolfowitz runs test ' +
    '(z~-3.36, p~7.9e-4) and Durbin-Watson (~0.22, below the d_L~1.22 5% bound) both ' +
    'reject the white-noise null on the 21 signed imp-33843 log-linear residuals well ' +
    'under 1%. imp-33887 reconciles two cohort modules that both claimed gap_ecoll obeys ' +
    '1/(2 log T0) at very different precisions, showing the imp-33856 endpoint residual ' +
    'splits EXACTLY into a discretization term, the exact I1 identity, and a g-vs-law ' +
    'reference offset -- the last two nearly cancelling -- so no mutually-inconsistent ' +
    'precision claim survives. All three are derivation/measurement only, change no ' +
    'bound, do NOT discharge H4/G7, and C_mb remains GUE-conditional (imp-486); NO QED. ' +
    'COHORT (imp-33877/imp-33878/imp-33879): three further single-ticket landings. ' +
    'imp-33877 tests the imp-33858 far-tail k=11 residual excursion (largest signed ' +
    'residual of the imp-33843 log-linear widening fit, +0.2479) against ladder ' +
    'truncation and finds it is a finite-ladder ENDPOINT/TRUNCATION artifact -- the ' +
    'k=11 residual collapses ~86% once no longer the endpoint (+0.2479 -> +0.0345 ' +
    'interior at k=12) while the largest positive residual always re-anchors at the ' +
    'new endpoint and grows there, though the underlying tail deceleration itself is ' +
    'genuine and boundary-independent. imp-33878 refines the imp-33857 X3 hump-argmax ' +
    'grid to 1/128-decade and REFUTES the vanishing-offset hypothesis: the discrete ' +
    'argmax converges DOWNWARD to a continuum k*~8.821 (not toward k_cross~9.516), so ' +
    'the ~0.695-decade gap is a genuine two-notion window-lag separation, not a grid ' +
    'artifact. imp-33879 derives the imp-33856 ~4% midpoint-vs-endpoint anchoring ' +
    'offset in closed form as the half-log-decade Taylor step of 1/(2 log T0), ' +
    'matching the exact offset to <0.11% relative error across 1e12..1e15 (measured ' +
    'range 3.50%..4.38%), confirming the ~4% IS the geometric-center offset and not a ' +
    'model disagreement. All three are derivation/measurement only, change no bound, ' +
    'do NOT discharge H4/G7, and C_mb remains GUE-conditional (imp-486); NO QED. ' +
    'COHORT (imp-34104..imp-34110): seven further phase-zero-branch and ' +
    'endpoint/fixed-band peak-growth measurements. imp-34104 characterises the ' +
    'second real-positive phase-zero branch theta=pi/2-+2pi/p in closed form: it ' +
    'sits entirely outside [0,pi] at distance pi(3-alpha)/(2(1+alpha)) for alpha ' +
    'in (0,1), touching the interval boundary only at alpha=3. imp-34105 cross-' +
    'validates the imp-34045 closed-form branch angles via an independent ' +
    'bracket-and-bisect root-find, matching to ~9e-16 worst discrepancy. imp-34106 ' +
    'extends the imp-34044 doubling-map phase-realignment schedule five dyadic ' +
    'rungs deeper (to 1/2^20), finding it keeps predicting realignment steps down ' +
    'to 1/262144 before departing at 1/524288 -- the departure traced to the ' +
    'precision floor of the stored k* (offset ~4.12e-7 from the true peak), not a ' +
    'breakdown of the doubling-map model. imp-34107 cross-validates the imp-34044 ' +
    'resid_exp(k) schedule from an independent from-source code path, matching ' +
    'all 21 cross-checked quantities to ~2.97e-5 (a round-off floor). imp-34108 ' +
    'extrapolates the imp-34043 saturating endpoint-peak fit to its asymptotic ' +
    'ceiling a~1.678095, reached within 1% only at kEnd~931 and within 0.1% only ' +
    'at kEnd~9314 (~72x/716x beyond the kEnd=11..13 fit window). imp-34109 pushes ' +
    'the imp-34040 fixed-band (k<=10) peak sweep one further decade and finds the ' +
    'earlier saturation onset does NOT persist: increments bottom out near ' +
    'kEnd~18 then re-accelerate, and an unbounded log fit beats the saturating ' +
    'fit, so the peak keeps climbing with no finite ceiling supported within ' +
    'kEnd<=20 -- the opposite verdict from imp-34108’s endpoint family. ' +
    'imp-34110 ranks the imp-34042 leave-two-out folds by curve-shift influence, ' +
    'finding it concentrates at the two boundary edges (low kEnd=11,11.25 and ' +
    'high kEnd=12.75,13, near-mirror images) each ~68x stronger than interior-' +
    'adjacent pairs. All seven are measurement/cross-validation only on the ' +
    'inherited imp-3220/imp-3406 extrapolation component model, change no bound, ' +
    'do NOT discharge H4/G7, and C_mb remains GUE-conditional (imp-486); NO QED. ' +
    'FURTHER QUANTIFIED (imp-34133/imp-34134): two follow-ups pin down the ' +
    'internal structure of the E(N) bridge components. imp-34133 fits the ' +
    'imp-34023 near-flat F2(kEnd)/F3(kEnd) attenuation factors to their ' +
    'asymptotic limits across the extended sign-stable ladder kEnd=13.0..21.0 ' +
    'and finds BOTH saturate to finite positive constants (F2->0.059492, ' +
    'F3->0.835955, R^2>0.9999) rather than collapsing toward 0, confirming F4 ' +
    'alone (which does collapse geometrically, ~x3.2e-5 over the same window) ' +
    'drives the divergence of the over-prediction ratio 1/(F2*F3*F4). imp-34134 ' +
    'tabulates the E_flow/E_trunc ratio across N=1e6..1e18 and finds the point ' +
    'where the Gronwall E_flow term drops negligible against the constant ' +
    'E_trunc=3.06e-5 floor (collapsing the three-term sigma to the two-term ' +
    'form) essentially COINCIDES with the imp-3444 E_coll=E_trunc crossover ' +
    'N~3.280e9, to within about one decade. Both are measurement/curve-fit ' +
    'only within the inherited imp-3220/imp-3406 component model, change no ' +
    'bound, do NOT discharge H4/G7, and C_mb remains GUE-conditional ' +
    '(imp-486); NO QED. ' +
    'NOTED (imp-35009): tabulating four nearby N~3.3e9 landmarks -- N_cross=' +
    '3.280294e9 (imp-33723 Banach fixed point), N_half~3.27e9 (imp-33582 ' +
    'sigma=1/2 halving), N_star~3.38e9 (imp-33721 sigmoid inflection knee), ' +
    'and the imp-34693 admissible seed band [3.11e9,3.45e9] (mid 3.28e9) -- ' +
    'now tabulates all six pairwise relative spreads |a-b|/mean(a,b) ' +
    '(scripts/imp-35009-landmark-cluster-spread.mjs): N_cross/N_half 0.314%, ' +
    'N_cross/N_star 2.994%, N_cross/seedmid 0.009%, N_half/N_star 3.308%, ' +
    'N_half/seedmid 0.305%, N_star/seedmid 3.003%. Max spread 3.308% (the ' +
    'N_half..N_star cluster endpoints), all under 4%; N_cross and the seed-band ' +
    'midpoint coincide to 0.009%; and the seed band brackets all three point ' +
    'landmarks. The tight co-location is consistent with -- but this measurement ' +
    'does NOT prove -- the shared E_coll=E_trunc crossover geometry underlying ' +
    'each. Measurement only on the inherited imp-3220/imp-3406 surrogate; ' +
    'changes no bound; C_mb remains GUE-conditional (imp-486); NO QED. ' +
    'MEASURED (imp-95237): quantifying the imp-486 GUE-conditional dependence at ' +
    'candidate verified heights and the unconditional-replacement threshold the ' +
    'analytic chain would need (tmp/imp-95237-compute.mjs on the inherited ' +
    'imp-3220/imp-3406 surrogate). (a) The conditional share sigma(N)=E_coll/E(N) at ' +
    'verified heights is already TINY -- sigma=0.0188 at N(3e12)~1.236e13 and ' +
    'sigma=0.0133 at N(6e12)~2.539e13 -- because at N~1e13 the GUE-conditional E_coll ' +
    'term (~5.85e-7 / ~4.13e-7) is dwarfed by the N-independent unconditional ' +
    'E_trunc=3.06e-5 floor, so the E(N) bridge is ~98-99% UNCONDITIONAL at verified ' +
    'heights, deep on the post-9.22e5-peak downslope (consistent with the imp-33582 ' +
    'sigma<0.1 landmark at N~3.21e11, far below N~1e13). (b) The rescue inequality the ' +
    'chain actually needs is C_mb*log(N)/sqrt(N) < rho_min~0.12751 (imp-469); an ' +
    'unconditional replacement bound B(N)>=C_mb keeps the chain intact iff ' +
    'B(N) < rho_min*sqrt(N)/log(N), a budget that GROWS like sqrt(N)/log(N) -- ' +
    '~1.487e4 at N(3e12) and ~2.082e4 at N(6e12). So the current C_mb<=1 input sits ' +
    '~1.5e4-2.1e4x below the budget at verified heights: the binding obstruction is ' +
    'NOT the budget size (generous, and growing without limit) but that imp-486 leaves ' +
    'C_mb without ANY unconditional o(sqrt(N)/log(N)) bound -- even a replacement as ' +
    'loose as ~1.5e4 at N~1e13 is unavailable off-GUE. Measurement only on the ' +
    'inherited surrogate; changes no bound; C_mb remains GUE-conditional (imp-486); ' +
    'NO QED. ' +
    'NOTED (imp-97596): the four scattered sigma(N) landmarks above (peak ~9.22e5, ' +
    'below-0.9 ~2.57e7, halving ~3.27e9, below-0.1 ~3.21e11 -- imp-33582/imp-3406/' +
    'imp-33723) are now tabulated as one cross-validated object by imp-97520, which ' +
    'also re-checks the halving landmark against the imp-33723 closed-form N_cross to ' +
    '~0.4% (residual = Gronwall E_flow gap, imp-33601). This prose is retained for ' +
    'narrative continuity; new consumers should cite imp-97520 as the canonical ' +
    'tabulated ladder. Cross-reference only; changes no bound; C_mb remains ' +
    'GUE-conditional (imp-486); NO QED.',
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
      '18 (three direct approaches on B_a^+ = 1), 20 (rigorous-numerics stages ' +
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
      'Dyson/collision Λ-attack track (an unconditional lim-sup skeleton plus ' +
      'a quantitatively open Polymath15 bridge). Both tracks share the same target (RH) but ' +
      'operate via different mathematical machinery; this milestone ' +
      'records the v52 landing without re-organising the Λ chain.',
  },
  {
    id: 'volterra-collapse-2026-05-28',
    label: 'Volterra-norm collapse + Λ ≤ 3.06e-5 (asymptotic) composition — OVERCLAIM CORRECTED',
    date: '2026-05-28',
    kind: 'proof-milestone',
    summary:
      'imp-1258 two-way collapse reduces 7+ paper conjectures (§15-27) to single ' +
      'statement ‖V_{a,Φ}‖ ≤ 1, with ~5000× empirical support from saturation. ' +
      'imp-1246 / imp-1261 composed a Λ ≤ 3.06×10⁻⁵ asymptotic value. AUDIT ' +
      'CORRECTION 2026-07: that value is NOT a rigorous sub-PT bound — the ' +
      '"modulo Polymath15 G6a only / beating PT by 6500×" framing is RETRACTED. ' +
      'It is conditional on the RH-EQUIVALENT shock modulus C_H / G6a (imp-2640 ' +
      'NEGATIVE, imp-35147 RH-equivalent), an uncertified E_trunc constant (imp-34791), ' +
      'and an unsupplied E(N)→0 (imp-35164), plus a proxy-identification gate ' +
      '(imp-2563) on a repo-refuted rate step (imp-2621). Only Λ ≤ 0.2 (PT) is ' +
      'unconditional. See LAMBDA_BOUNDS entry our-asymptotic-via-imp-1261-redirect.',
    tickets: ['imp-1258', 'imp-1246', 'imp-1261'],
    ticketRange: 'imp-1246/1258/1261 (collapse + execution)',
    relationToLambdaAttack:
      'The two-way Volterra-norm collapse consolidates paper conjectures into a ' +
      'single statement. The composed Λ ≤ 3.06×10⁻⁵ value is NOT a rigorous ' +
      'improvement to the SOTA upper bound (audit 2026-07); the SOTA unconditional ' +
      'Λ upper bound remains Platt-Trudgian Λ ≤ 0.2.',
  },
  {
    id: 'irrationality-workstream',
    label: 'Irrationality workstream opened (signed ladder → pipeline)',
    date: '2026-09-16',
    kind: 'workstream',
    summary:
      'A new research workstream, spun off from the twin-ladder machinery: attacking ' +
      'the irrationality of special L-values. The seed result is the verified '
      + 'correspondence G = β(2) = L(2,χ₄) = the twin ladder\'s signed (χ₄) value, and ' +
      'the exact period-dimension obstruction (same shifted-Legendre device gives ' +
      'ζ(2) → 5ζ(2)−8 in a 2-dim period space, but Catalan → G−π+2ln2+π²/12 in a ' +
      '5-dim one; the π-column is forced by the χ₄ functional equation). Generalized ' +
      'into a reusable 6-stage irrationality pipeline (encode → predict → generate → ' +
      'measure → cancel → test), with a period-dimension triage of ζ(5), β(4), γ, and ' +
      'the 2-adic Catalan neighbor.',
    newAppRoutes: [
      '/catalan-signed-ladder',
      '/irrationality-pipeline',
      '/diagrams',
    ],
    tickets: ['imp-95512', 'imp-95513', 'imp-95514', 'imp-95515', 'imp-95516'],
    ticketRange: 'imp-95512..95516 (irrationality objectives)',
    relationToLambdaAttack:
      'A THIRD research track, distinct from both RH-attack tracks (Λ / twin-ladder). ' +
      'It shares the twin-ladder machinery (character-twisted ladders, the σ↔1−σ ' +
      'mirror as functional equation) but targets a different question — irrationality ' +
      'of special VALUES, not zero location. The de Bruijn / Λ core gives NO lever ' +
      'here (zero-location ≠ value-irrationality); the levers are Diophantine ' +
      '(period dimension, Nesterenko/Ball–Rivoal, CDT capacity). Live sub-thread: ' +
      'an independent-replication check of whether Sun\'s (unverified) Catalan ' +
      'preprint margin can be hardened by re-optimizing its S/B ratio. Proves no ' +
      'constant irrational; maps and attacks the obstructions. NO QED.',
  },
  {
    id: 'sub-014-objective',
    label: 'PRIMARY OBJECTIVE: a Λ ≤ 0.14 (or below) upper bound — barrier localized',
    date: '2026-09-21',
    kind: 'objective',
    summary:
      'The program\'s standing primary target: an unconditional Λ upper bound at 0.14 or below ' +
      '(toward Λ→0 / RH). Status after the multi-round assault: NOT achieved, but the barrier is ' +
      'now LOCALIZED to a single object. Every route (the six-mechanism assault, the permutation ' +
      'architecture\'s five levers, the joint two-point estimate) collapses to a POINTWISE lower ' +
      'bound on the Hilbert transform of the H_t zero-counting measure at an arithmetically-fixed ' +
      'abscissa above verified height 3×10¹² = Montgomery-PCC / flow-blindness. Phase-blind, energy, ' +
      'and continuum-uniform methods provably give 0 (proved no-gos). The last candidate non-PCC crack ' +
      'is now CLOSED (imp-95527, 2026-09-21): the vertical linger budget d(y²)/dτ ≤ −2 has an exact ' +
      'pair-interaction formula (verified 8.5e-14) in which a nearly-STACKED pair above (Δ² < y_k²−y_j²) ' +
      'contributes POSITIVE — so the PER-TRAJECTORY budget with a zero\'s own height is REFUTED (a lower ' +
      'zero can rise, e.g. +16.2 at y_j=0.1 under y_k=0.12, Δ=0), and "first-contact = topmost" is FALSE. ' +
      'Only the ENVELOPE form Y(t)=max y_j², D⁺Y ≤ −2 survives — but that IS de Bruijn 1950 Thm 13 = ' +
      'Polymath15 Thm 3.2 (the propagation step already inside the PT Λ≤t₀+y₀²/2 argument), adds NO ' +
      'exclusion power to NC(κ), and its thick band reduces to NC(κ)=PCC. So sub-0.14 is now fully ' +
      'characterized as PCC-walled: every route needs new arithmetic input against the Hilbert-transform ' +
      'object, or more verified height (out of reach). Independent external corroboration of the floor: ' +
      'Raymond\'s Λ<0.149396 lands at [0.145,0.150] and its exhaustion theorem matches "new arithmetic ' +
      'input needed below ≈0.145".',
    tickets: ['imp-95519', 'imp-95525', 'imp-95526', 'imp-95527', 'imp-95528'],
    ticketRange: 'imp-95519 (A_{k,h} localized sum) · 95525 (anchor/seam-phase) · 95526 (NC(κ) gate) · 95527 (vertical linger — LIVE) · 95528 (SOR)',
    relationToLambdaAttack:
      'This IS the Λ attack\'s current quantitative frontier. PT Λ≤0.2 remains the peer-reviewed SOTA; ' +
      'the program\'s unreviewed candidates (0.1758354, 0.1787854) and the 0.14 completion contract sit ' +
      'above/at this line. Closing sub-0.14 unconditionally requires either the one non-PCC lemma ' +
      '(thin band only) or genuinely new arithmetic input against the localized Hilbert-transform ' +
      'object. NO false QED; RH open.',
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
    id: 'roadmap-platt-trudgian-peer-reviewed-benchmark',
    holds: () =>
      LAMBDA_BOUNDS.some(
        (b) =>
          b.id === 'platt-trudgian-2021' &&
          b.value === 0.2 &&
          b.kind === 'upper-peer-reviewed-benchmark' &&
          b.status === 'rigorous' &&
          b.accepted === true &&
          b.published === true &&
          b.peerReviewed === true
      ),
    why:
      'Platt-Trudgian 2021 Λ ≤ 0.2 is the peer-reviewed benchmark. New public ' +
      'claims must be added with their own review grade rather than overwriting it.',
  },
  {
    id: 'roadmap-public-01875-remains-unrefereed',
    holds: () => {
      const publicClaim = LAMBDA_BOUNDS.find(
        (b) => b.id === 'mosaic-public-preprint-01875'
      );
      return (
        publicClaim &&
        publicClaim.value === 0.1875 &&
        publicClaim.claimedUnconditional === true &&
        publicClaim.accepted === false &&
        publicClaim.status === 'public-preprint-review-open' &&
        /21175533/.test(publicClaim.href)
      );
    },
    why:
      'The public 0.1875 package is a reproducible but unrefereed claim. Its ledger ' +
      'listing and local repair must never silently promote it to an accepted theorem.',
  },
  {
    id: 'roadmap-target-better-than-sota',
    holds: () => {
      const publicClaim = LAMBDA_BOUNDS.find(
        (b) => b.id === 'mosaic-public-preprint-01875'
      );
      const privateCandidate = LAMBDA_BOUNDS.find(
        (b) => b.id === 'local-fixed-height-candidate-01787854'
      );
      const target = LAMBDA_BOUNDS.find((b) => b.id === 'our-target-sota');
      return (
        publicClaim &&
        privateCandidate &&
        target &&
        target.value < publicClaim.value &&
        target.value < privateCandidate.value
      );
    },
    why:
      'The target Λ must be strictly below both the strongest public ledger claim and ' +
      'the stronger private proof candidate; otherwise the roadmap is not a roadmap.',
  },
  {
    id: 'roadmap-private-01787854-remains-an-unreviewed-proof-candidate',
    holds: () => {
      const candidate = LAMBDA_BOUNDS.find(
        (b) => b.id === 'local-fixed-height-candidate-01787854'
      );
      return (
        candidate &&
        candidate.value === 0.1787854 &&
        candidate.claimedUnconditional === true &&
        candidate.established === false &&
        candidate.countsAsEstablishedUpperBound === false &&
        candidate.accepted === false &&
        candidate.published === false &&
        candidate.peerReviewed === false &&
        candidate.status === 'unreviewed-proof-candidate' &&
        candidate.repository === 'judegomila/dbn-lambda-01787854-candidate-audit' &&
        candidate.repositoryVisibility === 'private' &&
        candidate.tag === 'review-01787854-v3' &&
        candidate.commit === '2e9976c4becbf97e31c56fe75fce07cdff5dd4ea' &&
        candidate.tree === '7f15ecf8c3dbc73d547a2d4a3f2287bd87802f44' &&
        candidate.manifestSha256 ===
          '89a201565d5b4a0f02ab49092e3189c7a6d3b0bfaa4e93630c68cf8c4155ae1c' &&
        candidate.route === '/newman-lambda-01787854-candidate'
      );
    },
    why:
      'The 0.1787854 entry must remain an unreviewed candidate for an unconditional ' +
      'proof, pinned to the private v3 package without being promoted to an established, ' +
      'published, peer-reviewed, or accepted result.',
  },
  {
    id: 'roadmap-G5-closed-G6-and-G6a-quantitatively-open',
    holds: () => {
      const g5 = OPEN_GAPS.find((g) => g.id === 'G5');
      const g6 = OPEN_GAPS.find((g) => g.id === 'G6');
      const g6a = OPEN_GAPS.find((g) => g.id === 'G6a');
      return (
        g5 &&
        g5.severity === 'closed' &&
        g6 &&
        g6.severity === 'open' &&
        g6a &&
        g6a.severity === 'open'
      );
    },
    why:
      'G5 is closed at the lim-sup skeleton. The G6 bridge has a structural port, ' +
      'but G6 and G6a remain quantitatively open because the N-uniform C_H shock ' +
      'modulus is not discharged. This prevents a structural port from being ' +
      'misreported as an unconditional numerical Λ theorem.',
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
    id: 'lambda-dep-matrix-proof-candidate-is-v3-provenance-backed',
    holds: () => {
      const candidate = LAMBDA_DEPENDENCY_MATRIX.nodes.find(
        (node) => node.id === 'bound-proof-candidate-01787854'
      );
      const packageNode = LAMBDA_DEPENDENCY_MATRIX.nodes.find(
        (node) => node.id === 'blk-newman-01787854-v3-candidate-package'
      );
      const closure = lambdaDepMatrixClosure(
        'bound-proof-candidate-01787854'
      );
      return (
        candidate &&
        packageNode &&
        candidate.kind === 'candidate-bound' &&
        candidate.countsAsEstablishedBound === false &&
        candidate.dependsOn.join(',') === 'blk-newman-01787854-v3-candidate-package' &&
        packageNode.dependsOn.join(',') === 'ext-verified-zeros-T3e12' &&
        packageNode.note.includes('judegomila/dbn-lambda-01787854-candidate-audit') &&
        packageNode.note.includes('review-01787854-v3') &&
        packageNode.note.includes('2e9976c4becbf97e31c56fe75fce07cdff5dd4ea') &&
        packageNode.note.includes('7f15ecf8c3dbc73d547a2d4a3f2287bd87802f44') &&
        packageNode.note.includes(
          '89a201565d5b4a0f02ab49092e3189c7a6d3b0bfaa4e93630c68cf8c4155ae1c'
        ) &&
        closure.has('blk-newman-01787854-v3-candidate-package') &&
        closure.has('ext-verified-zeros-T3e12') &&
        !closure.has('cond-CH') &&
        !closure.has('cond-gue-universality')
      );
    },
    why:
      'The 0.1787854 claim must remain represented as an unestablished proof candidate ' +
      'with exact private-v3 provenance and no accidental dependency on the legacy C_H/GUE lane.',
  },
  {
    id: 'lambda-dep-matrix-finite-N-modulo-C_H',
    holds: () => {
      // imp-2674 reconciliation: imp-2640 (C_H undischargeable, gap-Lipschitz
      // Gronwall diverges at the collision) + imp-2632 (t_c_proj is an OLS
      // projection, not a rigorous bound) downgraded the N=1e4 beat from
      // rigorous-unconditional to an ESTIMATE gated on C_H. Its closure MUST now
      // contain the cond-CH Holder-modulus conditional, and must still NOT route
      // through GUE universality (that stays a Route-A-only asymptotic conditional).
      const closure = lambdaDepMatrixClosure('bound-imp-440-finite-1e4');
      return closure.has('cond-CH') && !closure.has('cond-gue-universality');
    },
    why:
      'imp-2674 (supersedes imp-2360 / imp-2522): the imp-440 (N=1e4) finite-height ' +
      'beat is an ESTIMATE gated on the C_H Holder-modulus constant being O(1) ' +
      '(imp-2640 NEGATIVE: C_H is an order-unity placeholder, the gap-Lipschitz ' +
      'Gronwall constant diverges at the collision). This pins that honest state: ' +
      'cond-CH MUST stay in the closure so a future edit cannot quietly re-promote ' +
      'the beat to rigorous-unconditional, while GUE universality must stay OUT (it ' +
      'is the Route-A asymptotic conditional, not a dependency of the measured ' +
      'finite-N bound).',
  },
  {
    id: 'lambda-dep-matrix-asymptotic-modulo-polymath15',
    holds: () => {
      const closure = lambdaDepMatrixClosure('bound-imp-1261-asymptotic');
      // The dependency-matrix models the C_H / G6a conditional as present and GUE
      // universality as absent (the asymptotic route is gated by C_H, not GUE).
      return (
        closure.has('cond-polymath15-G6a') &&
        !closure.has('cond-gue-universality')
      );
    },
    why:
      'AUDIT CORRECTION 2026-07: the C_H / Polymath15-G6a conditional must appear in ' +
      'the asymptotic route\'s dependency closure (it is RH-EQUIVALENT per imp-2640 / ' +
      'imp-35147), and GUE universality must NOT (that is the separate finite-N ' +
      'Route-A path). This is NOT a claim that G6a is the SOLE gate: the composed ' +
      '3.06e-5 value is additionally conditional on an uncertified E_trunc constant ' +
      '(imp-34791), an unsupplied E(N)→0 (imp-35164), and a proxy-identification / ' +
      'refuted-rate step (imp-2563 / imp-2621) — see the LAMBDA_BOUNDS entry ' +
      'our-asymptotic-via-imp-1261-redirect. This tripwire only pins the G6a-present / ' +
      'GUE-absent shape of the dependency graph.',
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
  {
    id: 'cross-validation-barrier-reharvest-sealed-imp2624',
    holds: () => {
      const entry = VERIFICATION_EFFORTS.find(
        (e) => e.id === 'cross-validation-barrier'
      );
      if (!entry || !entry.closesIfResolution) return false;
      const rh = entry.closesIfResolution.reHarvest;
      // Tripwire: imp-2624 is a re-harvest of the SAME already-met closesIf
      // (imp-2615 appended "— DONE (imp-2546)" to the string, which shifted the
      // producer harvest key). No new proof work exists; the named action was
      // executed by imp-2546. Pin the reHarvest record so the duplicate stays
      // sealed and a future edit cannot reopen it as fresh proof work.
      return (
        !!rh &&
        rh.ticket === 'imp-2624' &&
        rh.confirmedStillMet === true &&
        entry.status === 'cross-verified'
      );
    },
    why:
      'imp-2624: the harvested closesIf of cross-validation-barrier was re-seeded ' +
      'a second time because imp-2615 appended "— DONE (imp-2546)" to the closesIf ' +
      'string, shifting auto-ticket-producer.mjs harvest key (action.slice(0,60)). ' +
      'The named action — rerunning the imp-299/imp-371 barrier estimate on the ' +
      'imp-360 extended ladder — was already executed by imp-2546 ' +
      '(imp371-barrier-cross-validation.js, 6/6 tripwires green), so imp-2624 ' +
      'needed no new proof work. This pins the reHarvest record as confirmed-still-met ' +
      'so the duplicate closure stays sealed and cannot be reopened as fresh work.',
  },
];
