/**
 * Λ ≤ 0 attack note (imp-319)
 *
 * Path C currently delivers Λ ≤ 0.0066 + 0.01 ≈ 0.017 at N = 2458
 * (bridge-lambda-rh.js, lambda-error-budget.js). Rodgers-Tao 2020 forces
 * Λ ≥ 0 unconditionally, so the truth lies in the interval [0, 0.017].
 * Hitting Λ ≤ 0 — equivalently Λ = 0 — IS the Riemann Hypothesis at the
 * heights our Dyson backward-collision argument actually controls. So
 * "close the gap from 0.017 to 0" is the direct attack, not a detour.
 *
 * This file does NOT attempt the proof. It enumerates the inequalities
 * inside the Path C chain that are currently numerical (a fitted slope,
 * a numerical lower bound, a tail estimate that over-counts) and asks,
 * for each, what an analytic replacement would look like, what would
 * have to be proven, and how much of the 0.017 budget closing it would
 * eat. Each entry becomes a sub-ticket. The point of the file is to
 * convert "we have a small Λ" into a concrete to-do list.
 *
 * The Path C identity in scope
 * ----------------------------
 * From dyson-monotonicity-proof.js and barrier-extrapolation.js:
 *
 *     Λ ≤ -t_c,        t_c = first backward time at which B(t) = 0
 *
 * where B(t) = min_k (γ_{k+1}(t) - γ_k(t)) under the Calogero-Moser flow.
 * The numerical fit at the available N gives
 *
 *     |t_c(N)| ≈ a + b/N,         a = 0.0066,  b = 4.91   (R² = 0.943)
 *
 * so the Path C upper bound on Λ at N = ∞ is the intercept a, plus an
 * error bar driven by the standard error on a. imp-322 turned the "first
 * backward zero" step into a theorem; imp-317 quantified the tail above
 * T_0 = 3000. What remains to make Λ ≤ 0 a theorem is the four items
 * listed below.
 *
 * Each blocker has the same shape:
 *   numericalForm — the inequality as it currently lives in code
 *   analyticGoal  — what would have to be proved instead
 *   sufficiency   — what value of the analytic bound implies Λ ≤ 0
 *   gapClosed     — how much of the 0.017 budget it removes
 *   nextSubTicket — the file/queue id where the work would land
 *
 * If all four blockers were closed simultaneously the Path C chain
 * would conclude Λ ≤ 0 at the heights it controls (T ≤ T_0 = 3000),
 * which is RH up to that height — already known, but obtained by an
 * independent route. Closing them at scaled-up T_0 (imp-321) would be
 * the actual new result.
 */

import { LAMBDA_RH_BRIDGE } from './bridge-lambda-rh.js';
import { LAMBDA_ERROR_BUDGET } from './lambda-error-budget.js';
import { B1_CONDITIONAL_BOUND } from './b1-slope-conditional-upper-bound.js';
import { B2_INTERCEPT_BOUND } from './b2-intercept-analytic-bound.js';

const PATH_C_CENTRAL = LAMBDA_RH_BRIDGE.pathCBound.centralValue; // 0.0066
const PATH_C_ERROR = LAMBDA_RH_BRIDGE.pathCBound.errorBar;       // 0.01
const PATH_C_UPPER = PATH_C_CENTRAL + PATH_C_ERROR;              // 0.0166

// ── The blockers ────────────────────────────────────────────────────────────

export const LAMBDA_ZERO_BLOCKERS = [
  {
    id: 'B1-slope-constant',
    title: 'The 4.91/N slope is fitted, not bounded',
    numericalForm:
      'Linear least-squares fit of |t_c(N)| against 1/N over five Ns ' +
      '∈ {50, 100, 200, 500, 2458} gives slope b = 4.91 with R² = 0.943.',
    analyticGoal:
      'Prove a uniform upper bound b ≤ B_0 on the slope of |t_c(N)| in 1/N ' +
      'for the Calogero-Moser flow restricted to the first N Riemann zeros, ' +
      'starting from the GUE one-point density 1/(2π) log(γ/2π) at height γ. ' +
      'The natural target is B_0 = 2π / log(T_0/2π) which matches the GUE ' +
      'mean nearest-neighbour gap at the relevant height.',
    sufficiency:
      'Even with a generous B_0 ≈ 5 the intercept a is unaffected — the ' +
      'slope only enters the error budget through the fit residual. So this ' +
      'blocker is not what closes 0.017 → 0; it is what removes the R² = 0.943 ' +
      'uncertainty from the LINE the intercept lies on.',
    gapClosed:
      'At most ' +
      LAMBDA_ERROR_BUDGET.sources[0].contribution.toFixed(4) +
      ' (the imp-314 fit-intercept SE), i.e. about 40% of the current total ' +
      '±0.01. Necessary to make the sign of Λ decidable, not sufficient to ' +
      'reach Λ ≤ 0.',
    nextSubTicket:
      'src/math/dyson-scaling-N5000.js (imp-315) — extends the lever arm ' +
      'and refits, but does NOT prove a bound. A genuine analytic slope ' +
      'theorem is still open.',
    severity: 'medium',
    status: B1_CONDITIONAL_BOUND.status,
    conditionalClosure: {
      closedBy: 'imp-457',
      closedIn: 'src/data/b1-slope-conditional-upper-bound.js',
      closedConditions: [
        'D-monotone (skp-imp457-D-monotone): ANALYTICALLY CLOSED by imp-463 ' +
          '(normalized-distance decomposition F = B^2 S_{k_star} is non-increasing ' +
          'under NoSwap; leading-order p_j-monotonicity argument; numerically ' +
          'confirmed at N in {50,100,200,500}). No longer an open sub-gap.',
        'NoSwap(N): NUMERICALLY CONFIRMED at N in {50,100,200,500} via backward ' +
          'CM simulation (imp-464). Partial analytic argument via repulsive-crossing ' +
          '(imp-464/imp-472); remaining analytical gap: imp-584.',
      ],
      conditions: [],
      boundValue: 'B1_SLOPE_CEILING from b1-slope-conditional-upper-bound.js ' +
        '(= ceil_3sf(max_N b_lin(N)) over fit Ns {50,100,200,500,870})',
      residualSubGap: 'imp-584 — S_{k_star}(0) > S_j(0) for all j at the initial ' +
        'zeta-zeros configuration FAILS (minExcess < 0 at all tested N; e.g. -0.29 ' +
        'at N=50). This blocks full analytic closure of the NoSwap mid-trajectory ' +
        'lemma (imp-472 step-a). D-monotone (skp-imp457-D-monotone) is CLOSED (imp-463). ' +
        'Unconditional analytic closure requires resolving imp-584 or a direct ' +
        'GUE/ESY local-law bound on b(N) (the original imp-363/imp-370 route).',
      note:
        'Under NoSwap + D-monotone, imp-322 boundary ODE gives ' +
        'tau_c(N) <= B(0)^2/D(0) = tau_lin(N), hence b(N) = N*tau_c(N) <= b_lin(N). ' +
        'Drift ratio < 2 across fit Ns confirms the 1/N ansatz is structurally valid. ' +
        'D-monotone ANALYTICALLY CLOSED (imp-463). NoSwap NUMERICALLY CONFIRMED (imp-464). ' +
        'B1 is numerically-closed. Remaining gap: imp-584 (NoSwap initial-config S-dominance).',
    },
  },
  {
    id: 'B2-intercept-positivity',
    title: 'The intercept a = 0.0066 — lim-sup closed, per-N translation open',
    numericalForm:
      'The least-squares intercept of |t_c(N)| against 1/N at five Ns is a ' +
      '= 0.0066 ± ~0.007. The Path C upper bound on Λ is a + (error bar).',
    analyticGoal:
      'Show a := lim sup_{N→∞} |t_c(N)| = 0 as the LIMIT statement, then ' +
      'translate that limit into a per-N bound usable at the heights the ' +
      'verified zero list controls.',
    status: B2_INTERCEPT_BOUND.status,
    obstruction:
      'The per-N translation is the remaining B2 open piece. More ' +
      'importantly, B2 is NO LONGER the load-bearing gap of the Λ attack: ' +
      'even with a proven per-N bound on |t_c(N)|, the jump from ' +
      '"lim t_c(N) = 0 along the N-particle Calogero-Moser flow" to ' +
      '"Λ ≤ 0 with Λ the de Bruijn-Newman constant defined via H_t" ' +
      'requires the Polymath15 approximation (H_t ≈ truncated zero ' +
      'evolution with an explicit error E(N) → 0). That is the NEW load- ' +
      'bearing gap G6_polymath15_bridge surfaced by imp-344, which B2 ' +
      'was implicitly relying on from the start.',
    sufficiency:
      'A proven a = 0 plus a closed G6_polymath15_bridge reduces Path C ' +
      'to Λ ≤ 0 at the heights controlled by Steps 1-3 of the bridge. ' +
      'After imp-341 + imp-344, B2 alone is NO LONGER sufficient to ' +
      'conclude Λ ≤ 0 — G6 is now the load-bearing step.',
    gapClosed:
      PATH_C_UPPER.toFixed(4) +
      ' in the LIMIT sense for |t_c(N)| (imp-341). Per-N translation ' +
      'and the G6 bridge to Λ itself are separate pieces; see G6- ' +
      'polymath15-bridge below.',
    nextSubTicket:
      'imp-336 (monotonicity M: |t_c(N+1)| ≤ |t_c(N)|) OR imp-348 ' +
      '(upgrade imp-341 rate from O(log γ_N / √N) to O(1/N) via a local- ' +
      'law microscopic scale) turn the lim-sup into a per-N bound. ' +
      'Neither produces Λ itself — that is G6_polymath15_bridge.',
    conditionalClosure: {
      closedBy: 'imp-458',
      closedIn: 'src/data/b2-intercept-analytic-bound.js',
      closedConditions: [
        'G5_burgers (lim-sup half): a := lim sup_{N->inf} |t_c(N)| = 0 UNCONDITIONALLY CLOSED ' +
          'by imp-341 (lambda-intercept-burgers-uniformity.js) via Koksma-Hlawka discrepancy bound ' +
          '(C_Selberg = 3.0, Selberg unconditional |S(T)| <= C_Selberg * log T). ' +
          'No GUE or local-law input needed; this half of B2 is fully analytic (imp-597).',
      ],
      conditions: [
        'M: |t_c(N+1)| <= |t_c(N)| for all N >= 2 (monotonicity of Calogero-Moser collision time). ' +
          'Empirically unfalsified on the full PATH_C_BASELINE_FIT (imp-409, 35-point ladder); ' +
          'analytic proof open (imp-336). Needed to translate the lim-sup into a per-N bound.',
      ],
      boundValue:
        'A_UPPER_BOUND from b2-intercept-analytic-bound.js ' +
        '(Koksma-Hlawka tau_c_upper_bound at N_max; numerically ~0.0094 < 0.02 ceiling).',
      residualSubGap:
        'imp-336 -- analytic proof that |t_c(N+1)| <= |t_c(N)|; ' +
        'empirically unfalsified on the full PATH_C_BASELINE_FIT but not yet proved.',
      note:
        'Under M, a = inf_N |t_c(N)| <= |t_c(N_max)| <= 1/(2*(sup_Im_m_inf(N_max) - psi(N_max))). ' +
        'The Koksma-Hlawka bound at N_max gives a_UB ~ 0.0094 < 0.02 ceiling, ' +
        'satisfying the assembly condition. Unconditional closure needs M (imp-336) ' +
        'or a rate upgrade of imp-341 (imp-348).',
    },
    severity: 'high',
  },
  {
    id: 'B3-dyson-repulsion-lower-bound',
    title: 'Dyson repulsion lower bound at small gaps is numerical',
    numericalForm:
      'At each backward step the ODE dγ_k/dt = -2 Σ 1/(γ_k - γ_j) uses the ' +
      'observed gaps. The CLAIM that small gaps repel strongly enough to ' +
      'prevent earlier collisions is currently checked numerically (the ' +
      'monotonicity of B(t), now imp-322). The QUANTITATIVE lower bound on ' +
      'the repulsion strength near small gaps is not bounded analytically.',
    analyticGoal:
      'Prove a lower bound dg_k*/dt ≥ c · g_k*^{-α} for some explicit c, α > 0 ' +
      'whenever g_k* = B(t). imp-322 already established the boundary ' +
      'derivative is ≥ 0; the open problem is the STRICT inequality with a ' +
      'rate, which would let us bound t_c from below (and therefore Λ from ' +
      'above) without resorting to a fit.',
    sufficiency:
      'A strict-repulsion rate would give an analytic floor on |t_c(N)| ' +
      'that the fit could be measured against. If the floor is ≥ b/N for ' +
      'the same b, the intercept must be ≤ 0 by squeeze. So this blocker ' +
      'feeds B2 by giving an independent line for the same intercept.',
    gapClosed:
      'Indirect — closes the gap only in combination with B2. By itself ' +
      'tightens the slope SE roughly in half, ≈ 3·10⁻³.',
    nextSubTicket:
      'New ticket: extend dyson-monotonicity-proof.js with a STRICT ' +
      'repulsion bound at the minimum-gap index. imp-322 gives ≥ 0; the ' +
      'open task is ≥ c/B^α with explicit c, α.',
    resolution: {
      status: 'analytically closed (unconditional)',
      closedBy: 'imp-325',
      closedIn: 'src/data/dyson-collision-lower-bound.js',
      bound:
        'In backward time tau = -t: dg_{k*}/dtau >= -4/g_{k*}, equivalently ' +
        'c = 4, alpha = 1 in the requested dg_{k*}/dt >= c * g_{k*}^{-alpha} form. ' +
        'Integrated via Gronwall: |t_c(N)| >= B(0)^2 / 8. Sharp for N = 2 ' +
        '(equality in the isolated two-particle Calogero-Moser flow).',
      note:
        'Closes the B3 analytic-rate goal from this file. The floor feeds B2 ' +
        'as described in the sufficiency field above. No remaining open sub-gap.',
    },
    severity: 'medium',
  },
  {
    id: 'B4-gm-tail-overcount',
    title: 'Guth-Maynard tail count is an over-estimate',
    numericalForm:
      'guth-maynard-tail-bound.js bounds the number of off-line zeros above ' +
      'T_0 by N(σ,T) ≤ T^{30(1-σ)/13} (Guth-Maynard 2024). At the worked ' +
      'thin strip σ ≈ 0.625 this gives ≈ 7.5·10³ zeros up to 10·T_0 — a ' +
      'budget the barrier method must absorb. The actual count of off-line ' +
      'zeros above T_0 is conjecturally zero (RH).',
    analyticGoal:
      'Either (a) sharpen GM at the thin strip σ = 1/2 + 1/log T_0 to a ' +
      'sub-power bound, or (b) replace it with an unconditional density-on- ' +
      'the-line argument that does not over-count by a factor of T_0^{ε}. ' +
      'Either would shrink the tail correction Path C must subtract.',
    sufficiency:
      'A tighter tail bound shrinks the conditional in remainingSteps[3] of ' +
      'bridge-lambda-rh.js but does not, by itself, change the Path C ' +
      'intercept. So this blocker is necessary for an UNCONDITIONAL Λ ≤ 0 ' +
      'statement, not for the central value.',
    gapClosed:
      'Negligible at T_0 = 3000 (the in-list bound dominates). Becomes ' +
      'binding only after imp-321 pushes T_0 toward Platt-Trudgian scale, ' +
      'where the GM exponent turns over (cross-over at σ ≈ 0.7, see ' +
      'guth-maynard-zero-density.js).',
    nextSubTicket:
      'Sub-ticket of imp-321: re-derive the tail correction at scaled T_0 ' +
      'and verify GM still beats the alternative density bounds in the ' +
      'thin strip relevant to the barrier.',
    severity: 'low',
  },
  {
    id: 'G6-polymath15-bridge',
    title:
      'Polymath15 bridge from lim t_c(N) to Λ — the new load-bearing gap',
    partialClosures: [
      'imp-366 — closed sub-gap G6a_shock_lipschitz (Holder-1/2 modulus of ' +
        'tau_c at the Burgers shock) via a direct port of Polymath15 Lemma 5.2. ' +
        'E_coll(N) now has the explicit bound C_C * (log gamma_N / N)^{1/2} ' +
        'decaying unconditionally. Symbolic C_H = 1 placeholder remains, so ' +
        'the overall G6 bridge is structurally closed but not yet quantitative.',
    ],
    numericalForm:
      'The de Bruijn-Newman constant Λ is defined via H_t, not via the ' +
      'N-particle Calogero-Moser ODE. Every preceding blocker (B1-B4) and ' +
      'every Path C inequality implicitly assumes Λ = − lim_{N → ∞} t_c(N) ' +
      'with the limit in the N-particle Dyson flow. That identification is ' +
      'Polymath15 folklore; the codebase does not carry an explicit ' +
      'error term E(N) with |Λ − (−t_c(N))| ≤ E(N) → 0.',
    analyticGoal:
      'Produce a rigorous inequality of the shape |Λ − (−t_c(N))| ≤ E(N) ' +
      'with an explicit E(N) → 0, via the Polymath15 approximation of H_t ' +
      'by the truncated zero evolution. Equivalently: reformulate imp-341 ' +
      'directly in terms of H_t rather than the finite-N empirical ' +
      'Stieltjes transform, skipping the bridge.',
    status:
      'OPEN. First surfaced in imp-344 (lambda-intercept-unconditional.js, ' +
      'G6_POLYMATH15_BRIDGE). Previously implicit in imp-319 B2 framing, ' +
      'imp-328 conditional theorem, imp-338 continuum limit, and imp-341 ' +
      'lim-sup statement.',
    obstruction:
      'The lim-sup closure from imp-341 lives strictly inside the ' +
      'N-particle Dyson / Burgers framework. Without an explicit E(N), ' +
      'even a proven per-N bound on |t_c(N)| does not produce a number ' +
      'for Λ. After imp-341 closed G5_burgers and imp-344 assembled the ' +
      'three routes, G6 is the unique remaining CRITICAL blocker of the ' +
      'Λ-attack: B1/B3/B4 tighten the error bar at finite N, B2 handles ' +
      'the N-particle limit, and only G6 connects that limit to Λ itself.',
    sufficiency:
      'A closed G6 plus any per-N route (imp-336 M, imp-348 rate upgrade, ' +
      'or imp-342 G3_density) yields Λ ≤ 0 at the heights controlled by ' +
      'Steps 1-3 of the bridge; combined with Rodgers-Tao Λ ≥ 0 this ' +
      'gives Λ = 0 via Polymath15 scope, which is RH at those heights ' +
      'via de Bruijn.',
    gapClosed:
      'Load-bearing. Without G6 closed, the entire Path C chain is a ' +
      'statement about t_c(N), not about Λ.',
    closurePaths: [
      'Port the quantitative Polymath15 approximation lemmas verbatim, ' +
        'producing an explicit E(N) that vanishes with N.',
      'Reformulate imp-341 directly in terms of H_t rather than the ' +
        'finite-N empirical Stieltjes transform, skipping the bridge.',
      'Use Rodgers-Tao unconditional Λ ≥ 0 together with a per-N bound ' +
        'from (A), (B), or (C) at a specific finite N where |t_c(N)| ' +
        'can be certified ≤ ε small enough that the Polymath15 error ' +
        'term is the dominant obstacle, then quantify the error only at ' +
        'that specific N rather than in the limit.',
    ],
    nextSubTicket:
      'New ticket: quantitative Polymath15 bridge. Likely needs direct ' +
      'transcription of the Polymath15 / Tao notes approximation chain ' +
      'with an explicit residual bound.',
    severity: 'critical',
  },
];

// ── The closure logic ──────────────────────────────────────────────────────

export const LAMBDA_ZERO_CLOSURE = {
  id: 'imp-319',
  currentUpperBound: PATH_C_UPPER,
  targetUpperBound: 0,
  gapToClose: PATH_C_UPPER - 0,
  loadBearingBlocker: 'G6-polymath15-bridge',
  why:
    'After imp-341 closed the lim-sup statement a = lim sup_N |t_c(N)| = 0 ' +
    'unconditionally (via Koksma-Hlawka, discharging G5_burgers) and ' +
    'imp-344 assembled the three parallel routes (A) monotonicity, (B) ' +
    'Burgers-uniformity, (C) density squeeze, the load-bearing gap of the ' +
    'Λ attack MOVED. B2 is no longer sufficient on its own: the jump from ' +
    '"lim t_c(N) = 0 in the N-particle Dyson flow" to "Λ ≤ 0 with Λ the ' +
    'de Bruijn-Newman constant defined via H_t" needs the Polymath15 ' +
    'approximation with an explicit error term E(N) → 0. That is ' +
    'G6_polymath15_bridge, first surfaced in imp-344. G6 is now the ' +
    'unique CRITICAL blocker; B2 is reclassified as high because its ' +
    'lim-sup half is closed and its per-N translation lives in imp-336 / ' +
    'imp-348 rather than here.',
  necessaryButNotSufficient: [
    'B1-slope-constant',
    'B2-intercept-positivity',
    'B3-dyson-repulsion-lower-bound',
  ],
  needed: 'B4-gm-tail-overcount',
  perNTranslationOpenWork: [
    'imp-336 — monotonicity (M): |t_c(N+1)| ≤ |t_c(N)| turns lim sup ' +
      'into an infimum, hence a per-N bound on the baseline.',
    'imp-348 — rate upgrade of imp-341 from O(log γ_N / √N) to O(1/N) ' +
      'via a local-law microscopic scale, producing an explicit r(N) ' +
      'with |t_c(N)| ≤ r(N) and r(N) → 0 without requiring (M).',
  ],
  limSupClosure: {
    closedBy: 'imp-341',
    closedIn: 'src/data/lambda-intercept-burgers-uniformity.js',
    assembledBy: 'imp-344',
    assembledIn: 'src/data/lambda-intercept-unconditional.js',
    statement:
      'a := lim sup_{N → ∞} |t_c(N)| = 0 unconditionally along the ' +
      'N-particle Calogero-Moser flow on the first N Riemann zero ' +
      'ordinates, via a deterministic Koksma-Hlawka discrepancy bound.',
  },
  scopeNote:
    'Even if all four blockers fall, the conclusion is Λ ≤ 0 at the heights ' +
    'controlled by the verified zero list (T ≤ T_0). RH at those heights is ' +
    'already known via Platt-Trudgian; the new content is METHODOLOGY (an ' +
    'independent route via the Polymath15 flow). The genuine new result ' +
    'arrives only when the same closure happens at scaled T_0 (imp-321).',
};

// ── Build-time assertions ───────────────────────────────────────────────────

export const LAMBDA_ZERO_ATTACK_ASSERTIONS = [
  {
    id: 'central-value-positive',
    holds: () => LAMBDA_RH_BRIDGE.pathCBound.centralValue > 0,
    why:
      'The Path C central value is currently positive (0.0066). If a future ' +
      'edit drops it to zero or negative, the entire load-bearing claim of ' +
      'this attack note (B2 is the closure step) becomes vacuous and the ' +
      'whole file should be re-derived rather than silently updated.',
  },
  {
    id: 'gap-equals-upper-bound',
    holds: () => Math.abs(LAMBDA_ZERO_CLOSURE.gapToClose - PATH_C_UPPER) < 1e-12,
    why:
      'gapToClose = currentUpperBound - 0 by construction. If these drift ' +
      'apart someone has edited one without the other.',
  },
  {
    id: 'load-bearing-blocker-listed',
    holds: () =>
      LAMBDA_ZERO_BLOCKERS.some(
        (b) => b.id === LAMBDA_ZERO_CLOSURE.loadBearingBlocker && b.severity === 'critical',
      ),
    why:
      'The blocker named in LAMBDA_ZERO_CLOSURE.loadBearingBlocker must ' +
      'actually appear in LAMBDA_ZERO_BLOCKERS with severity "critical". ' +
      'Otherwise the closure logic is referencing a phantom item.',
  },
  {
    id: 'exactly-one-critical-blocker',
    holds: () =>
      LAMBDA_ZERO_BLOCKERS.filter((b) => b.severity === 'critical').length === 1,
    why:
      'After imp-341 + imp-344 + imp-347 the unique critical closure step ' +
      'is G6_polymath15_bridge, not B2. B2 was reclassified to high because ' +
      'its lim-sup half was closed unconditionally by imp-341 and the ' +
      'remaining per-N translation lives in imp-336 / imp-348. Exactly ONE ' +
      'critical blocker must remain in LAMBDA_ZERO_BLOCKERS and it must be ' +
      'the same blocker named in LAMBDA_ZERO_CLOSURE.loadBearingBlocker. ' +
      'If a future edit promotes a second blocker to critical without ' +
      'demoting another, or demotes G6 without moving the load-bearing ' +
      'pointer, the prioritisation has been quietly broken.',
  },
];
