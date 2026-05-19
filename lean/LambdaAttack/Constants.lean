-- lean/LambdaAttack/Constants.lean
-- imp-410: Lean 4 formal definitions of the four Polymath15 bridge constants.
--
-- Constant definitions and positivity proofs for:
--   C_H = 1/8                                  (Holder modulus, imp-395)
--   C_T(T0) = (3*log T0 - 6) / (2*log T0)     (truncation, imp-397)
--   C_F(T0) = (log(T0 / (2*pi)) + 1) / (2*pi) (flow, imp-398)
--   C_C = (1/8) * sqrt(3*pi) ~= 0.3837         (collision, imp-399)
--
-- Status summary:
--   C_H definitions and positivity : fully formal (norm_num)
--   C_C definitions and positivity : fully formal (positivity)
--   C_T positivity (T0 >= exp 2)   : fully formal (log lemmas)
--   C_F positivity (T0 > 2pi/e)    : fully formal (log lemmas)
--   C_T, C_F upper/lower bounds    : fully formal (nlinarith / linarith)
--   C_F_integral_identity          : partial (imp-512: main thm proved via C_F_ibp_value)
--   C_F_ibp_value (skp-512a)       : sorry (IBP + improper integral FTC + boundary limit)
--   C_C_lt_one                     : fully formal (sqrt monotonicity + pi bound)
--
-- Companion JS file: src/math/lean4-koksma-hlawka.js (imp-403 skeleton).
-- Requires: Mathlib 4.9+

import Mathlib.Analysis.SpecialFunctions.Log.Basic
import Mathlib.Analysis.SpecialFunctions.Sqrt
import Mathlib.Data.Real.Pi.Bounds
import Mathlib.Tactic

open Real

noncomputable section

/-! ## Base constants from Koksma-Hlawka bound (imp-341) -/

/-- C_Selberg = 3: Selberg (1946) / Balasubramanian-Goldfeld (1980) bound constant.
    The inequality |S(T)| <= C_Selberg * log T holds with C_Selberg = 3. -/
def C_Selberg : ℝ := 3

lemma C_Selberg_pos : (0 : ℝ) < C_Selberg := by norm_num [C_Selberg]

/-- C_KH = pi * C_Selberg = 3*pi: Koksma-Hlawka W1 discrepancy constant (imp-341).
    Appears in psi_N(y) <= C_KH * log(gamma_N) / (N * y). -/
def C_KH : ℝ := Real.pi * C_Selberg

lemma C_KH_pos : (0 : ℝ) < C_KH := by
  unfold C_KH C_Selberg; positivity

/-! ## C_H = 1/8: Holder modulus constant (imp-395) -/

/-- C_H = 1/8: the Dyson quadratic-tangency Holder modulus constant (imp-395).
    Derived from the two-particle Dyson ODE: d(g_min^2)/dt = -8, so
    |tau_c| <= g_min(0)^2 / 8, giving C_H = 1 / C_collision = 1/8.
    The Gronwall Lipschitz factor C_Lip -> 1 as N -> infinity (tau_c -> 0),
    so C_H = 1/8 is the rigorous asymptotic Holder constant. -/
def C_H : ℝ := 1 / 8

lemma C_H_pos : (0 : ℝ) < C_H := by norm_num [C_H]

lemma C_H_lt_one : C_H < 1 := by norm_num [C_H]

lemma C_H_val : C_H = 1 / 8 := rfl

/-! ## C_T: Truncation constant (imp-397) -/

/-- C_T(T0) = (3*log T0 - 6) / (2*log T0): the Ingham 1940 thin-strip truncation
    constant from imp-397. At sigma_N = 1/2 + 1/log T0 the Ingham zero-density
    exponent is e_I = (3L-6)/(3L-2) with L = log T0, and kappa_T = 4/(3L-2),
    yielding C_T = 2*e_I / (kappa_T * L) = (3L-6)/(2L).
    Role in bridge: E_trunc(N) <= C_T(T0(N)) * T0(N)^(-kappa_T) * log T0(N).
    Satisfies 0 < C_T < 3/2 for all T0 > e^2, and C_T -> 3/2 as T0 -> infinity. -/
noncomputable def C_T (T0 : ℝ) : ℝ :=
  (3 * Real.log T0 - 6) / (2 * Real.log T0)

/-- C_T(T0) > 0 when T0 > exp(2) (STRICT, imp-1114).
    At the boundary T0 = exp(2) we have log T0 = 2, so 3*log T0 - 6 = 0 and
    C_T = 0 exactly — NOT positive. The hypothesis is therefore the strict
    `Real.exp 2 < T0`: then 3*log T0 > 6 and 2*log T0 > 0, giving C_T > 0.
    All Polymath15 ladder entries have T0 >= 3000 >> exp(2) ~= 7.39, so the
    strict bound holds with a wide margin for every ladder use site. -/
lemma C_T_pos {T0 : ℝ} (hT0 : Real.exp 2 < T0) : 0 < C_T T0 := by
  have hlog : 2 < Real.log T0 :=
    (Real.log_exp 2) ▸ Real.log_lt_log (Real.exp_pos 2) hT0
  have hlog_pos : 0 < Real.log T0 := by linarith
  unfold C_T
  apply div_pos <;> linarith

/-- C_T < 3/2 for all T0 > 1: universal upper bound from imp-397.
    Proof: (3L-6)/(2L) < 3/2 iff 2*(3L-6) < 3*(2L) = 6L iff 6L-12 < 6L. -/
lemma C_T_lt_three_halves {T0 : ℝ} (hT0 : 1 < T0) : C_T T0 < 3 / 2 := by
  have hlog : 0 < Real.log T0 := Real.log_pos hT0
  unfold C_T
  rw [div_lt_div_iff (by linarith) (by norm_num : (0 : ℝ) < 2)]
  nlinarith

/-- The asymptotic universal bound: C_T < 3/2 for all T0 > 1. -/
theorem C_T_universal_bound : ∀ T0 : ℝ, 1 < T0 → C_T T0 < 3 / 2 :=
  fun T0 h => C_T_lt_three_halves h

/-! ## C_F: Flow constant (imp-398) -/

/-- C_F(T0) = (log(T0 / (2*pi)) + 1) / (2*pi): the Riemann-von Mangoldt off-ladder
    flow constant from imp-398. Derived from the convergent density integral:
      S_{k*}^{off} = INT_{T0}^{inf} log(T/2pi)/(2pi*T^2) dT = C_F(T0)/T0
    by integration by parts (u = log(T/2pi), dv = T^{-2} dT).
    Grows logarithmically without bound: C_F ~= log(T0)/(2pi) as T0 -> infinity.
    Role in bridge: E_flow(N) <= C_F(T0(N)) * log T0(N) / T0(N) * exp(C_G*|t_c(N)|). -/
noncomputable def C_F (T0 : ℝ) : ℝ :=
  (Real.log (T0 / (2 * Real.pi)) + 1) / (2 * Real.pi)

/-- C_F(T0) > 0 when T0 > 2*pi*exp(-1) ~= 2.31.
    Proof: log(T0/2pi) > -1 iff T0/2pi > exp(-1) iff T0 > 2pi/e. -/
lemma C_F_pos {T0 : ℝ} (hT0 : 2 * Real.pi * Real.exp (-1) < T0) : 0 < C_F T0 := by
  unfold C_F
  apply div_pos _ (by positivity)
  have h2pi : (0 : ℝ) < 2 * Real.pi := by positivity
  have hT0_pos : 0 < T0 := lt_trans (by positivity) hT0
  have hfrac_gt : Real.exp (-1) < T0 / (2 * Real.pi) := by
    rw [lt_div_iff h2pi]
    linarith [mul_comm (Real.exp (-1)) (2 * Real.pi)]
  have hlog_gt : (-1 : ℝ) < Real.log (T0 / (2 * Real.pi)) :=
    (Real.log_exp (-1)) ▸ Real.log_lt_log (Real.exp_pos _) hfrac_gt
  linarith

/-- Sub-gap skp-512a: IBP evaluation of the RvM flow integral on [T0, inf).
    Antiderivative: F(T) = -(log(T/(2*pi)) + 1)/(2*pi*T).
    Derivative check: F'(T) = log(T/(2*pi))/(2*pi*T^2) for T > 0.
    Boundary: F(T) -> 0 as T -> inf (log grows slower than T).
    Conclusion: integral = 0 - F(T0) = (log(T0/(2*pi)) + 1)/(2*pi*T0). -/
private lemma C_F_ibp_value {T0 : ℝ} (hT0 : 0 < T0) :
    ∫ T in Set.Ici T0, Real.log (T / (2 * Real.pi)) / (2 * Real.pi * T ^ 2) =
    (Real.log (T0 / (2 * Real.pi)) + 1) / (2 * Real.pi * T0) := by
  sorry -- skp-512a: use intervalIntegral FTC + tendsto boundary vanishing; integrability via log/T^2 decay

/-- The RvM integral identity underlying C_F (imp-398, integration by parts).
    INT_{T0}^{inf} log(T/2pi) / (2pi * T^2) dT = C_F(T0) / T0.
    Partial closure (imp-512): sorry reduced to C_F_ibp_value (skp-512a) + div_div algebra. -/
theorem C_F_integral_identity {T0 : ℝ} (hT0 : 0 < T0) :
    ∫ T in Set.Ici T0, Real.log (T / (2 * Real.pi)) / (2 * Real.pi * T ^ 2)
    = C_F T0 / T0 := by
  rw [C_F_ibp_value hT0]
  unfold C_F
  rw [div_div]

/-! ## C_C = (1/8)*sqrt(3*pi): Collision constant (imp-399) -/

/-- C_C = C_H * sqrt(C_KH) = (1/8) * sqrt(3*pi) ~= 0.3837: the combined Holder
    times Koksma-Hlawka collision constant from imp-399. N-independent.
    Derived: E_coll(N) <= C_H * W1(mu_N, rho_inf)^{1/2}
                       <= C_H * (C_KH * log(gamma_N)/N)^{1/2}
                        = C_C * sqrt(log(gamma_N)/N).
    Improves on the symbolic placeholder C_C = sqrt(3*pi) ~= 3.07 by factor 8. -/
noncomputable def C_C : ℝ := C_H * Real.sqrt C_KH

lemma C_C_pos : (0 : ℝ) < C_C :=
  mul_pos C_H_pos (Real.sqrt_pos.mpr C_KH_pos)

/-- C_C expressed in closed form. -/
lemma C_C_eq : C_C = (1 / 8) * Real.sqrt (3 * Real.pi) := by
  unfold C_C C_H C_KH C_Selberg; rw [mul_comm Real.pi (3 : ℝ)]

/-- C_C < 1: the pinned collision constant is tighter than the ANSATZ placeholder 1.
    Proof path: 3*pi < 64 (using pi < 3.1416), so sqrt(3*pi) < 8, so (1/8)*sqrt(3*pi) < 1. -/
lemma C_C_lt_one : C_C < 1 := by
  rw [C_C_eq]
  have hpi : Real.pi < 3.1416 := by
    have hbound := Real.pi_lt_3141593
    have hlit : (3.141593 : ℝ) < 3.1416 := by norm_num
    linarith
  have h3pi : 3 * Real.pi < 64 := by
    have hlit3 : 3 * (3.1416 : ℝ) < 64 := by norm_num
    linarith
  have hsqrt : Real.sqrt (3 * Real.pi) < Real.sqrt 64 :=
    Real.sqrt_lt_sqrt (by positivity) h3pi
  have h8 : Real.sqrt 64 = 8 := by
    have : (64 : ℝ) = 8 ^ 2 := by norm_num
    rw [this, Real.sqrt_sq (by norm_num : (0 : ℝ) ≤ 8)]
  rw [h8] at hsqrt
  have : (1 / 8) * Real.sqrt (3 * Real.pi) < (1 / 8) * 8 :=
    mul_lt_mul_of_pos_left hsqrt (by norm_num)
  linarith

/-! ## Summary theorem -/

/-- All four Polymath15 bridge constants are strictly positive real numbers.
    C_T and C_F are functions of T0; the hypotheses are satisfied for all
    ladder entries (minimum T0 ~= 3000, well above max(exp(2), 2pi/e) ~= 7.4). -/
theorem bridge_constants_positive
    {T0 : ℝ} (hT0_exp2 : Real.exp 2 < T0) (hT0_pi : 2 * Real.pi * Real.exp (-1) < T0) :
    (0 : ℝ) < C_H ∧ 0 < C_T T0 ∧ 0 < C_F T0 ∧ 0 < C_C :=
  ⟨C_H_pos, C_T_pos hT0_exp2, C_F_pos hT0_pi, C_C_pos⟩

end

/-! ## Open sorrys in this file (imp-1012 audit 2026-05-08)

    `grep -n sorry lean/LambdaAttack/Constants.lean` returns three matches:
      line  17 — comment-only (status table inside the header doc-block)
      line 128 — ACTUAL `sorry` in tactic position (C_F_ibp_value, skp-512a)
      line 132 — comment-only (mention of "sorry reduced to ..." in the
                 docstring of C_F_integral_identity)

    Total in-code sorrys: ONE (line 128, C_F_ibp_value).

    Class for that sorry: (a) pure formalization gap — Mathlib-tactic
    mechanical, NOT a substantive mathematical gap.

    Math is closed paper-side and JS-side. The IBP evaluation
        INT_{T0}^{inf} log(T/(2*pi)) / (2*pi * T^2) dT
            = (log(T0/(2*pi)) + 1) / (2*pi * T0)
    follows from
        F(T) = -(log(T/(2*pi)) + 1) / (2*pi * T),
        F'(T) = log(T/(2*pi)) / (2*pi * T^2),         (computed)
        F(T) -> 0 as T -> inf,                         (log T / T -> 0)
        log(T/(2*pi)) / (2*pi * T^2) is L^1 on [T0, inf) for T0 > 0,
        FTC + boundary value give the stated equality.

    JS-side certificate: src/math/lean4-c-f-ibp.js exports
    C_F_IBP_CERTIFICATE with remainingSubGap = 'skp-512a-lean-tactic',
    classifying the gap explicitly as "pure Lean 4 mechanical".

    Resolution path (Mathlib lemma chain to wire up the tactic):
      * `Real.tendsto_log_div_atTop`            -- log T / T -> 0 boundary vanishing
      * `intervalIntegral.integral_Ioi_of_hasDerivAt_of_tendsto`
                                                -- FTC on the half-line
      * `MeasureTheory.IntegrableOn`           -- L^1 on Set.Ici T0 via log/T^2 decay
      * `HasDerivAt` chain rule + `Real.hasDerivAt_log`
                                                -- compute F' and match the integrand
    The proposed tactic body is sketched in src/math/lean4-c-f-ibp.js
    (see exported `leanTactic` template, lines 147-171).

    Deliverable for imp-1012: one in-code sorry at line 128, classified as
    class (a) (formalization-only). The Mathlib tactic transcription itself
    is a follow-up Lean ticket (skp-512a-lean-tactic); flipping that gap
    requires verifying Mathlib namespaces against the active Mathlib pin
    and is left out of this audit-only closure (consistent with imp-1008
    Capstone.lean treatment).

    Ticket imp-1012 closes as audit-only with the explicit class-(a) tag.
-/
