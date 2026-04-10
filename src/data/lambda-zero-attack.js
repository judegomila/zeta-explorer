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
  },
  {
    id: 'B2-intercept-positivity',
    title: 'The intercept a = 0.0066 is positive, not provably zero',
    numericalForm:
      'The least-squares intercept of |t_c(N)| against 1/N at five Ns is a ' +
      '= 0.0066 ± ~0.007. The Path C upper bound on Λ is a + (error bar), ' +
      'so the entire question of whether Λ ≤ 0 reduces to: is a actually 0?',
    analyticGoal:
      'Show a = lim_{N→∞} |t_c(N)| = 0. Equivalently: prove that the ' +
      'Calogero-Moser collision time on the first N zeros tends to 0 as ' +
      'N → ∞, and identify the rate. If the rate is 1/N (linear in 1/N) ' +
      'the intercept is 0 by definition; if the rate is sub-linear (e.g. ' +
      '1/log N) the intercept is also 0 but the current fit is biased.',
    sufficiency:
      'A proven intercept a = 0 reduces Path C to Λ ≤ 0 + (slope·0) = 0, ' +
      'which is RH at the heights controlled by Steps 1-3 of the bridge. ' +
      'This is the load-bearing inequality of the whole approach.',
    gapClosed:
      PATH_C_UPPER.toFixed(4) +
      ' — the entire current upper bound. This is the only blocker whose ' +
      'resolution alone would yield Λ ≤ 0. All other blockers tighten the ' +
      'error bar around a, but only B2 makes a vanish.',
    nextSubTicket:
      'New ticket: prove (or disprove) lim_{N→∞} |t_c(N)| = 0 from the ' +
      'GUE limit of the Polymath15 flow on the first N Riemann zeros. ' +
      'Likely needs Erdős-Kac / Cipolla / Tao moment methods.',
    severity: 'critical',
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
];

// ── The closure logic ──────────────────────────────────────────────────────

export const LAMBDA_ZERO_CLOSURE = {
  id: 'imp-319',
  currentUpperBound: PATH_C_UPPER,
  targetUpperBound: 0,
  gapToClose: PATH_C_UPPER - 0,
  loadBearingBlocker: 'B2-intercept-positivity',
  why:
    'B2 is the ONLY blocker whose resolution alone yields Λ ≤ 0. B1, B3, ' +
    'B4 each tighten the error bar or the conditional, but only B2 reduces ' +
    'the central value. Any attack roadmap that does not place B2 at the ' +
    'top is mis-prioritised.',
  necessaryButNotSufficient: ['B1-slope-constant', 'B3-dyson-repulsion-lower-bound'],
  needed: 'B4-gm-tail-overcount',
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
      'imp-319 asserts that B2 (intercept positivity) is the unique closure ' +
      'step. If a future edit promotes a second blocker to critical without ' +
      'demoting B2, the prioritisation has been quietly broken.',
  },
];
