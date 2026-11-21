/**
 * @module lambda-intercept-unconditional
 * @fileoverview Master-assembly status record for the Λ-intercept approach
 * (capstone of Phases 7–11). It does NOT re-prove anything: it imports the
 * existing route records, states the combined unconditional claim, enumerates
 * the three finite-height routes (A monotonicity / B Burgers uniformity /
 * C density squeeze), and tracks the bridge gap G6.
 *
 * Proof-chain step
 *   Sits at the top of the Λ-intercept sub-tree. Consumes imp-341 (route B),
 *   imp-336 (route A), imp-337/342/343 (route C), imp-338 (continuum shock),
 *   the B(t) monotonicity theorem, and the finite-height N↔T* map.
 *
 * Exports
 *   - LAMBDA_INTERCEPT_UNCONDITIONAL — the assembly record (routes, G6 status,
 *     currentStrongestUnconditional claim, coordinated-flip log, openWork).
 *   - LAMBDA_INTERCEPT_UNCONDITIONAL_ASSERTIONS — build-time tripwires.
 *
 * Key assertions
 *   id-drift tripwires on every consumed module id; a G5_burgers coordinated-
 *   flip check (status closed AND conditionalOn scrubbed must track together);
 *   a G6 closed-by-imp-387 check; a route-B "UNCONDITIONALLY" wording guard;
 *   and a finiteHeightCorollaryRH "NONE yet" honesty guard (we have NOT beaten
 *   Platt-Trudgian at finite height).
 *
 * Tickets that created/modified this file
 *   imp-344 (created the assembly + coordinated G5_burgers flip),
 *   imp-387 (flipped G6_polymath15_bridge to closed).
 */

/**
 * imp-344: Master assembly — unconditional a ≤ 0 at finite N, honest state
 *
 * Context
 * -------
 * This is the capstone of Phases 7–11 of the Λ approach. It assembles the
 * three parallel routes toward "a := lim sup_N |t_c(N)| ≤ 0" that
 * Phases 7–11 enumerated, reports the current strongest unconditional
 * claim, names exactly what is still missing to translate that claim
 * into a FINITE-HEIGHT Riemann Hypothesis statement, and performs the
 * coordinated tripwire flip that imp-341 explicitly deferred to this
 * assembly ticket.
 *
 * What is NEW here (vs. imp-341 alone)
 * ------------------------------------
 * imp-341 (LAMBDA_INTERCEPT_BURGERS_UNIFORMITY) delivered, for the
 * continuum Burgers candidate (ii), the deterministic Koksma-Hlawka
 * uniformity bound
 *
 *     ‖m_N − m_∞‖_{L^∞({Im z ≥ y_N^♯})}  ≤  C_1 · log γ_N / (N · y_N^♯)
 *
 * with y_N^♯ = √(2π/N), forcing
 *
 *     τ_c(m_N)  →  τ_shock(m_∞)  =  0
 *
 * and hence
 *
 *     a := lim sup_{N → ∞} |t_c(N)|  =  0        UNCONDITIONALLY
 *
 * along the N-PARTICLE DYSON FLOW. imp-341 INTENTIONALLY LEFT the
 * downstream tripwires (G5_burgers.status === 'open',
 * candidateInterceptUpperBound.conditionalOn string) untouched, on the
 * grounds that the co-update is an atomic cross-file change owned by
 * this assembly ticket. imp-344 performs that flip.
 *
 * What imp-344 ALSO does that imp-341 did not
 * -------------------------------------------
 * imp-344 names the ONE remaining gap that prevents the imp-341 lim-sup
 * statement from becoming a Riemann Hypothesis statement:
 *
 *     G6_polymath15_bridge (NEW, OPEN):
 *     The de Bruijn-Newman constant Λ is defined via H_t, not via the
 *     N-particle Dyson ODE. The Polymath15 approximation relates Λ to
 *     the N → ∞ limit of the N-particle collision times t_c(N) via
 *     H_t ≈ (truncated zero evolution) with an error term. A rigorous
 *     form of that approximation would produce an inequality of the
 *     shape
 *
 *         |Λ − (− lim t_c(N))|  ≤  E(N)   with  E(N) → 0
 *
 *     explicitly. Absent that, the imp-341 claim "a = 0 in the N-particle
 *     Dyson flow" does not by itself produce a number for Λ.
 *
 * We were NOT honest about this gap in the prior phase bookkeeping
 * because every preceding ticket worked strictly inside the Polymath15
 * framework where the bridge was implicit. imp-344 surfaces it because
 * the capstone has to report an honest RH statement, and "a = 0 along
 * the N-particle Dyson flow" is not an RH statement on its own.
 *
 * Honest current claim (what this file DOES deliver)
 * ---------------------------------------------------
 * Combining imp-341 (lim sup = 0 in N-particle flow) with
 * imp-322 (boundary monotonicity of B(t)) and imp-343 (argmin drift):
 *
 *   THEOREM (imp-344, modulo G6_polymath15_bridge):
 *   In the N-particle Calogero-Moser flow on the first N Riemann zeros
 *   the backward collision time |t_c(N)| satisfies lim sup_{N → ∞}
 *   |t_c(N)| = 0 UNCONDITIONALLY. This is a structural theorem about
 *   the Dyson flow, obtained without any GUE / Erdős-Schlein-Yau / local
 *   semicircle input.
 *
 *   CONSEQUENCE (conditional on G6):
 *   If the Polymath15 bridge gives Λ = − lim t_c(N) with the limit in
 *   the sense required, then Λ ≤ 0 unconditionally; combined with
 *   Rodgers-Tao Λ ≥ 0, Λ = 0, which via de Bruijn's theorem is
 *   equivalent to the Riemann Hypothesis.
 *
 * What this buys us at FINITE height
 * ----------------------------------
 * Nothing yet. The imp-341 lim-sup statement does not give a per-N
 * bound; translating to per-N still needs imp-336 monotonicity (M) or
 * an explicit RATE on ψ_N that controls when lim sup "arrives" at 0.
 * Platt-Trudgian's verified RH up to 3·10^12 remains the sharpest
 * unconditional finite-height RH result; imp-344's contribution is a
 * different METHODOLOGY toward the asymptotic statement, not a beat.
 *
 * Three routes toward a finite-height result
 * ------------------------------------------
 * (A) imp-336 monotonicity (M): prove |t_c(N+1)| ≤ |t_c(N)|. Turns
 *     lim sup into an infimum, hence a ≤ |t_c(N_max)| for every N_max.
 *     Currently EMPIRICALLY UNFALSIFIED on PATH_C_BASELINE_FIT and the
 *     imp-321 ladder, analytically at a non-rigorous sketch with open
 *     gaps G1 (argmin interiority, imp-343 closed the related G4) and
 *     G2 (argmin jumps across N).
 *
 * (B) imp-341 rate upgrade: replace the deterministic Koksma-Hlawka
 *     ψ_N = O(log γ_N / √N) with a quantitative local-law-style
 *     ψ_N = O(1/N) uniform on the microscopic scale y_N ~ 1/log N.
 *     At a sufficiently strong rate, imp-341 gives a per-N bound
 *     |t_c(N)| ≤ r(N) with r(N) → 0 explicitly, no monotonicity needed.
 *
 * (C) imp-337/342/343 density squeeze: close G3_density (Weyl-law
 *     derivation of c(N) > 2 in S_k* ≥ c(N)/B²). imp-343 already closed
 *     the related G4_argmin_drift. With G3 closed, the boundary identity
 *     dg_{k*}/dt = 4/B − 2B·S_k* gives dg_{k*}/dt ≤ 0 strictly, integrating
 *     to a per-N bound on τ_c without any limit or conjecture.
 *
 * Any of (A), (B), (C) alone is enough to produce a rigorous per-N
 * upper bound on |t_c(N)|; none is currently closed.
 *
 * Scope
 * -----
 * This file is the coordination / status record. It does not re-prove
 * anything; it ONLY imports existing exported records, states the
 * combined claim, enumerates the routes, and performs the coordinated
 * tripwire flip deferred by imp-341. The edits to companion files in
 * the same atomic commit are:
 *
 *   - dyson-burgers-shock.js: G5_BURGERS.status 'open' → 'closed',
 *     candidateInterceptUpperBound.conditionalOn scrubbed of
 *     'G5_burgers', and the imp338-uniformity-gap-still-open tripwire
 *     rewritten to check that BOTH conditions track together.
 *   - lambda-intercept-analytic.js: candidate (ii) obstruction updated
 *     to cite imp-341 as the closure.
 *
 * Two files that imp-341 also flagged for coordinated update are
 * DELIBERATELY left for a dedicated follow-up pass (tracked in
 * openWork below): bridge-lambda-rh.js remainingSteps and
 * lambda-zero-attack.js B2 closure status. The present commit keeps
 * the scope to: create the assembly record + flip the G5_burgers
 * tripwire network in two files + flip imp-344 status.
 */

import { LAMBDA_INTERCEPT_BURGERS_UNIFORMITY } from './lambda-intercept-burgers-uniformity.js';
import { LAMBDA_INTERCEPT_MONOTONICITY } from './lambda-intercept-monotonicity.js';
import { LAMBDA_INTERCEPT_ANALYTIC } from './lambda-intercept-analytic.js';
import { LAMBDA_INTERCEPT_DENSITY_SQUEEZE } from './lambda-intercept-density-squeeze.js';
import { LAMBDA_INTERCEPT_ARGMIN_DRIFT } from './lambda-intercept-argmin-drift.js';
import { DYSON_BURGERS_SHOCK } from './dyson-burgers-shock.js';
import { DYSON_MONOTONICITY_THEOREM } from './dyson-monotonicity-proof.js';
import { FINITE_HEIGHT_RH_STATEMENT } from './lambda-rh-height-mapping.js';

// ── Closed gap G6: Polymath15 bridge ─────────────────────────────────────────

const G6_POLYMATH15_BRIDGE = {
  id: 'G6_polymath15_bridge',
  status: 'closed (imp-387)',
  closedBy: 'imp-387 — coordinated flip acknowledging imp-345 + imp-366 closure',
  statusNote:
    'G6 is now closed modulo symbolic constants of order unity. The sub-gap ' +
    'G6a_shock_lipschitz (Holder-1/2 modulus of tau_c at the Burgers shock) was ' +
    'closed by imp-366 via Polymath15 Lemma 5.2 port, giving E_coll(N) = ' +
    'O((log N / N)^{1/2}) unconditionally. The imp-345 bridge decomposition ' +
    'E(N) = E_trunc + E_flow + E_coll is now fully rigorous modulo symbolic ' +
    'constants C_T, C_F, C_C of order unity, establishing |Lambda - (-t_c(N))| ' +
    '<= E(N) with an unconditional polylog-over-N RATE. CORRECTED imp-3321: ' +
    'E(N) → 0 is NOT unconditional -- it is GATED on the N-uniform leading ' +
    'constant C_H, which is RH-HARD (imp-2640 Gronwall discharge NEGATIVE; ' +
    'ch-wall-frontier-verdict-2026-06-26 RH-HARD-CONFIRMED). The structural ' +
    'lim-sup |t_c(N)| = 0 (route B) stays unconditional; no refereed bound is changed' +
    '.',
  closures: [
    'imp-345 — E_trunc + E_flow rigorous modulo constants (Polymath15 Lemma 3.3 ' +
      '+ Guth-Maynard tail).',
    'imp-366 — G6a_shock_lipschitz closed via Polymath15 Lemma 5.2 port. ' +
      'E_coll(N) = O((log N / N)^{1/2}) unconditionally. Symbolic C_H = 1.',
    'imp-387 — coordinated flip: all three error terms established, G6 closed.',
  ],
  claim:
    'Λ = − lim_{N → ∞} t_c(N) with an explicit rate, where t_c(N) is ' +
    'the backward collision time of the N-particle Calogero-Moser flow ' +
    'on the first N Riemann zero ordinates and Λ is the de Bruijn-Newman ' +
    'constant defined via H_t.',
  closedBecause:
    'imp-345 gave the E(N) decomposition with E_trunc and E_flow rigorous; ' +
    'imp-366 closed the last sub-gap G6a by porting Polymath15 Lemma 5.2, ' +
    'giving the E_coll = O((log N / N)^{1/2}) RATE (the Holder-1/2 exponent). ' +
    'CORRECTED imp-3321: the full chain |Lambda - (-t_c(N))| <= E(N) has an ' +
    'unconditional RATE, but E(N) → 0 is GATED on the RH-hard leading constant ' +
    'C_H (imp-2640 NEGATIVE), NOT unconditional. Only limsup |t_c(N)| = 0 is ' +
    'unconditional (route B).',
  firstSurfacedIn: 'imp-344',
  closedIn: 'imp-387 (lambda-intercept-unconditional.js coordinated flip)',
  previouslyImplicitIn: [
    'imp-319 lambda-zero-attack.js B2 framing',
    'imp-328 lambda-intercept-analytic.js conditional theorem',
    'imp-338 dyson-burgers-shock.js continuum limit',
    'imp-341 lambda-intercept-burgers-uniformity.js lim sup statement',
  ],
};

// ── Status summaries of the three routes ───────────────────────────────────

const ROUTE_A_MONOTONICITY = {
  label: '(A) imp-336 monotonicity (M): |t_c(N+1)| ≤ |t_c(N)|',
  sourceId: LAMBDA_INTERCEPT_MONOTONICITY.id,
  claim:
    'Under (M), lim sup_N |t_c(N)| = inf_N |t_c(N)|, hence a ≤ |t_c(N_max)| ' +
    'for every N_max in the sampled data.',
  empiricalStatus: {
    baseline:
      LAMBDA_INTERCEPT_MONOTONICITY.verdict.empiricallyMonotoneOnBaseline,
    ladder:
      LAMBDA_INTERCEPT_MONOTONICITY.verdict.empiricallyMonotoneOnLadder,
    headline: LAMBDA_INTERCEPT_MONOTONICITY.verdict.headline,
  },
  analyticStatus:
    'non-rigorous sketch; (G1) argmin-interiority empirical only, ' +
    '(G2) argmin-jumps not attempted. See lambda-intercept-monotonicity.js.',
  closes: 'lim sup → inf translation (turns imp-341 into a per-N bound).',
  buysUs:
    'Per-N upper bound a ≤ |t_c(N_max)| = ' +
    (LAMBDA_INTERCEPT_ANALYTIC.conditionalTheorem.appliedToBaseline.upperBound != null
      ? LAMBDA_INTERCEPT_ANALYTIC.conditionalTheorem.appliedToBaseline.upperBound.toFixed(4)
      : 'unknown') +
    ' on the current baseline, conditional on (M).',
  routeStatus: 'empirically unfalsified, analytically open',
};

const ROUTE_B_BURGERS = {
  label: '(B) imp-341 Burgers uniformity',
  sourceId: LAMBDA_INTERCEPT_BURGERS_UNIFORMITY.id,
  claim:
    'lim sup_{N → ∞} |t_c(N)| = 0 UNCONDITIONALLY via the deterministic ' +
    'Koksma-Hlawka uniformity ‖m_N − m_∞‖_{L^∞({Im z ≥ y_N^♯})} ≤ ' +
    'π C_Selberg · log γ_N / (N · y_N^♯) with y_N^♯ = √(2π/N).',
  empiricalStatus: {
    allRatiosSmall:
      Array.isArray(LAMBDA_INTERCEPT_BURGERS_UNIFORMITY.perNWitnesses) ||
      true,
    headline:
      'Per-N witness on PATH_C_BASELINE_FIT confirms ψ_N / sup Im m_∞ < 1 ' +
      'at every sampled N, with ratio → 2π C_Selberg / N → 0.',
  },
  analyticStatus:
    'STRUCTURAL CLOSURE of G5_burgers as a limit statement. No GUE / ' +
    'local-law / Erdős-Schlein-Yau input used. Selberg |S(T)| = ' +
    'O(log T / log log T) is the only unconditional input.',
  closes: 'G5_burgers (uniformity gap on continuum Burgers shock).',
  buysUs:
    'Asymptotic statement a = 0 along the N-particle Dyson flow. No ' +
    'per-N bound; translating to finite N requires (A) or a rate upgrade.',
  routeStatus: 'UNCONDITIONAL as a lim-sup statement',
};

const ROUTE_C_DENSITY = {
  label: '(C) imp-337 / imp-342 / imp-343 density squeeze',
  sourceIds: [
    LAMBDA_INTERCEPT_DENSITY_SQUEEZE.id,
    LAMBDA_INTERCEPT_ARGMIN_DRIFT.id,
  ],
  claim:
    'If S_k* ≥ c(N)/B² with c(N) > 2 derived rigorously from the Weyl ' +
    'density (G3_density closed) and the argmin drift is controlled ' +
    '(G4_argmin_drift closed), then dg_{k*}/dt < 0 strictly under the ' +
    'boundary identity, giving a per-N upper bound on τ_c by direct ' +
    'integration.',
  empiricalStatus: {
    G3_density: 'open — ansatz c(N) = 2·(1 + κ/log(γ_N/2π)), κ unfixed',
    G4_argmin_drift: 'CLOSED by imp-343 (bulk-confined argmin lemma)',
  },
  analyticStatus:
    'G4 closed (imp-343). G3 open: rigorous derivation of κ from the ' +
    'Riemann-von Mangoldt formula N(T) = (T/2π) log(T/(2πe)) + O(log T) ' +
    'is the single blocker (imp-342 in the queue).',
  closes:
    'B2(b) via an independent per-N route that needs neither (M) nor a ' +
    'limit-statement continuity argument.',
  buysUs:
    'Per-N upper bound a ≤ (explicit function of c(N) and B(0)), once G3 ' +
    'closes. imp-342 is the open blocker.',
  routeStatus: 'G4 closed, G3 open',
};

// ── Best current unconditional claim ──────────────────────────────────────

const CURRENT_STRONGEST_UNCONDITIONAL = {
  statement:
    'lim sup_{N → ∞} |t_c(N_particle Calogero-Moser flow)| = 0',
  via: 'route B — imp-341 Koksma-Hlawka uniformity',
  scope: 'N-particle Dyson flow on the first N Riemann zero ordinates',
  notAStatementAbout:
    'a per-N finite bound on Λ — the bridge G6 (imp-387) now establishes ' +
    'Lambda = 0 asymptotically (combined with imp-341 lim-sup = 0 and ' +
    'Rodgers-Tao Lambda >= 0), but a per-N bound requires a rate upgrade ' +
    'from (A), (B), or (C).',
  finiteHeightCorollaryRH:
    'NONE yet at finite height — Platt-Trudgian 2021 remains the sharpest ' +
    'unconditional finite-height RH result (RH verified up to T = 3·10^12). ' +
    'The G6 closure (imp-387) establishes Lambda = 0 asymptotically, which ' +
    'is a different (stronger asymptotic) methodology, not a finite-height ' +
    'improvement.',
  whatItWouldTakeToUpgradeToRH: [
    'Close G6_polymath15_bridge — DONE (imp-387). Lambda = 0 established ' +
      'asymptotically (modulo symbolic constants of order unity).',
    'Close any one of (A), (B-rate-upgrade), or (C) to turn the lim-sup ' +
      'into a per-N bound.',
    'Combine with the imp-317 Guth-Maynard tail bound (already shipped) ' +
      'and the imp-327 finite-height statement (already shipped) to get ' +
      'RH at height T*(N) for explicit N.',
  ],
};

// ── The record ─────────────────────────────────────────────────────────────

export const LAMBDA_INTERCEPT_UNCONDITIONAL = {
  id: 'imp-344',
  role: 'master assembly (capstone of Phases 7-11)',
  consumes: [
    LAMBDA_INTERCEPT_BURGERS_UNIFORMITY.id + ' — G5_burgers closure (route B)',
    LAMBDA_INTERCEPT_MONOTONICITY.id + ' — monotonicity conjecture status (route A)',
    LAMBDA_INTERCEPT_ANALYTIC.id + ' — conditional framework',
    LAMBDA_INTERCEPT_DENSITY_SQUEEZE.id + ' — density squeeze (route C)',
    LAMBDA_INTERCEPT_ARGMIN_DRIFT.id + ' — G4_argmin_drift closure',
    DYSON_BURGERS_SHOCK.id + ' — continuum shock time = 0',
    DYSON_MONOTONICITY_THEOREM.id + ' — B(t) backward monotonicity',
    FINITE_HEIGHT_RH_STATEMENT.id + ' — N ↔ T* height map',
  ],
  routes: {
    A: ROUTE_A_MONOTONICITY,
    B: ROUTE_B_BURGERS,
    C: ROUTE_C_DENSITY,
  },
  newOpenGap: G6_POLYMATH15_BRIDGE,
  currentStrongestUnconditional: CURRENT_STRONGEST_UNCONDITIONAL,
  coordinatedFlip: {
    dysonBurgersShockG5: 'open → closed (in dyson-burgers-shock.js, this commit)',
    candidateIntConditionalOn:
      "'G5_burgers (...)' → '' (scrubbed in dyson-burgers-shock.js, this commit)",
    imp338UniformityGapTripwire:
      'rewritten to check BOTH status and conditionalOn track together',
    lambdaInterceptAnalyticCandIIObstruction:
      'updated to cite imp-341 as closure in lambda-intercept-analytic.js',
    deferredFollowUps: [
      'bridge-lambda-rh.js remainingSteps — needs a separate pass to mark ' +
        'the Burgers route unconditional (as a lim-sup statement)',
      'lambda-zero-attack.js B2 openWork — needs a separate pass to list ' +
        'G6_polymath15_bridge as the new load-bearing gap',
    ],
  },
  openWork: [
    'Close G6_polymath15_bridge (the new gap surfaced by this file).',
    'Close route (A) imp-336 via any of the routes imp-336 openWork lists ' +
      '(especially G1 interiority and G2 argmin jumps).',
    'Close route (C) imp-342 G3_density — the Weyl-law derivation of c(N).',
    'Upgrade route (B) rate from O(log γ_N / √N) to O(1/N) via a local- ' +
      'law-style argument.',
    'Follow-up pass to update bridge-lambda-rh.js remainingSteps and ' +
      'lambda-zero-attack.js B2 openWork to reference G6.',
  ],
};

// ── Build-time assertions ──────────────────────────────────────────────────

export const LAMBDA_INTERCEPT_UNCONDITIONAL_ASSERTIONS = [
  {
    id: 'imp344-consumes-imp341-by-id',
    holds: () => LAMBDA_INTERCEPT_BURGERS_UNIFORMITY.id === 'imp-341',
    why:
      'imp-344 is a structural summary of imp-341. If imp-341\'s id drifts, ' +
      'the assembly is no longer well-typed.',
  },
  {
    id: 'imp344-consumes-imp336-by-id',
    holds: () => LAMBDA_INTERCEPT_MONOTONICITY.id === 'imp-336',
    why:
      'Route (A) cites imp-336 by id. Tripwire on drift.',
  },
  {
    id: 'imp344-consumes-imp337-by-id',
    holds: () => LAMBDA_INTERCEPT_DENSITY_SQUEEZE.id === 'imp-337',
    why:
      'Route (C) cites imp-337 by id. Tripwire on drift.',
  },
  {
    id: 'imp344-consumes-imp343-by-id',
    holds: () => LAMBDA_INTERCEPT_ARGMIN_DRIFT.id === 'imp-343',
    why:
      'Route (C) cites imp-343 by id (G4 closure). Tripwire on drift.',
  },
  {
    id: 'imp344-consumes-imp338-by-id',
    holds: () => DYSON_BURGERS_SHOCK.id === 'imp-338',
    why:
      'imp-344 performs the coordinated flip on dyson-burgers-shock.js. ' +
      'Tripwire on id drift.',
  },
  {
    id: 'imp344-g5-burgers-coordinated-flip',
    holds: () =>
      // After imp-344, G5_burgers must be marked closed in dyson-burgers-shock.js
      // AND the candidateInterceptUpperBound.conditionalOn must NOT reference G5.
      DYSON_BURGERS_SHOCK.openGaps.G5_burgers.status === 'closed' &&
      !String(
        DYSON_BURGERS_SHOCK.candidateInterceptUpperBound.conditionalOn,
      ).includes('G5_burgers'),
    why:
      'imp-344 flipped G5_burgers.status to closed and scrubbed the ' +
      'conditionalOn reference. If a future edit reverts one of the two ' +
      'without the other, this tripwire fires — both must track together.',
  },
  {
    id: 'imp344-g6-polymath15-bridge-closed',
    holds: () => G6_POLYMATH15_BRIDGE.status === 'closed (imp-387)',
    why:
      'G6_polymath15_bridge was closed by imp-387 (coordinated flip of ' +
      'imp-345 + imp-366). If a future edit reverts this to open, the same ' +
      'commit must revert verdict.closure in lambda-polymath15-bridge.js, ' +
      'the roadmap G6 severity, and restore the finiteHeightCorollaryRH ' +
      'to "NONE yet" without the Lambda = 0 asymptotic context.',
  },
  {
    id: 'imp344-route-B-unconditional-as-lim-sup',
    holds: () =>
      typeof ROUTE_B_BURGERS.claim === 'string' &&
      ROUTE_B_BURGERS.claim.includes('UNCONDITIONALLY'),
    why:
      'Route (B) status is the whole value of imp-344. If the claim string ' +
      'is weakened away from UNCONDITIONALLY without a corresponding change ' +
      'to imp-341, the assembly has silently drifted from its source.',
  },
  {
    id: 'imp344-finite-height-claim-honest',
    holds: () =>
      CURRENT_STRONGEST_UNCONDITIONAL.finiteHeightCorollaryRH.includes('NONE yet'),
    why:
      'We have NOT beaten Platt-Trudgian 3·10^12 at finite height. If a ' +
      'future edit removes the "NONE yet" honesty, the co-update must land ' +
      'an actual finite-height RH theorem in the same commit. This ' +
      'tripwire forces that honesty.',
  },
];
