import Mathlib

open scoped BigOperators
open scoped Real
open scoped Nat
open scoped Classical
open scoped Pointwise

set_option maxHeartbeats 8000000
set_option maxRecDepth 4000
set_option synthInstance.maxHeartbeats 20000
set_option synthInstance.maxSize 128

set_option relaxedAutoImplicit false
set_option autoImplicit false

set_option grind.warning false

/-!
# Isolation-onset closed forms

Formalization of `job23_isolation_onset.tex`:

* **Part I** — Lemma R2-T: the single-nearest-neighbour sign law (exact only for `N = 3`),
  its sign-law corollary, and a conditional flow form.
* **Part II** — Lemma R2-T2 (imp-3005): the symmetric single-shell exact rate, its
  rational/`u`-substitution form, and the closed-form onset
  `c* = √(2+√3) - 1 = (1+√3)/√2 - 1`.

Everything is over `ℝ` for the velocity field of the attractive CM flow

`v x k = -2 * ∑_{j ≠ k} 1 / (x k - x j)`.

Only algebraic identities in the velocity field are claimed.  Flow
existence/regularity is *not* proved; it enters solely as the explicit hypothesis
`hsol` of `IsolationOnset.R2T_flow_form`.  No global multi-body constant is claimed.
-/

namespace IsolationOnset

/-! ## The velocity field -/

/-- Velocity field of the attractive CM flow:
`v x k = -2 ∑_{j ≠ k} 1 / (x k - x j)`. -/
noncomputable def v {N : ℕ} (x : Fin N → ℝ) (k : Fin N) : ℝ :=
  -2 * ∑ j ∈ Finset.univ.erase k, 1 / (x k - x j)

lemma v3_apply_zero (x : Fin 3 → ℝ) : v x 0 = -2 * (1 / (x 0 - x 1) + 1 / (x 0 - x 2)) := by
  simp [v, Finset.sum_erase_eq_sub (Finset.mem_univ (0 : Fin 3)), Fin.sum_univ_three]

lemma v3_apply_one (x : Fin 3 → ℝ) : v x 1 = -2 * (1 / (x 1 - x 0) + 1 / (x 1 - x 2)) := by
  simp [v, Finset.sum_erase_eq_sub (Finset.mem_univ (1 : Fin 3)), Fin.sum_univ_three]

lemma v3_apply_two (x : Fin 3 → ℝ) : v x 2 = -2 * (1 / (x 2 - x 0) + 1 / (x 2 - x 1)) := by
  simp [v, Finset.sum_erase_eq_sub (Finset.mem_univ (2 : Fin 3)), Fin.sum_univ_three]

lemma v4_apply_one (x : Fin 4 → ℝ) :
    v x 1 = -2 * (1 / (x 1 - x 0) + 1 / (x 1 - x 2) + 1 / (x 1 - x 3)) := by
  simp [v, Finset.sum_erase_eq_sub (Finset.mem_univ (1 : Fin 4)), Fin.sum_univ_four]

lemma v4_apply_two (x : Fin 4 → ℝ) :
    v x 2 = -2 * (1 / (x 2 - x 0) + 1 / (x 2 - x 1) + 1 / (x 2 - x 3)) := by
  simp [v, Finset.sum_erase_eq_sub (Finset.mem_univ (2 : Fin 4)), Fin.sum_univ_four]

lemma v4_apply_three (x : Fin 4 → ℝ) :
    v x 3 = -2 * (1 / (x 3 - x 0) + 1 / (x 3 - x 1) + 1 / (x 3 - x 2)) := by
  simp [v, Finset.sum_erase_eq_sub (Finset.mem_univ (3 : Fin 4)), Fin.sum_univ_four]

/-! ## Part I — Lemma R2-T (single nearest neighbour, `N = 3`) -/

/-- The three-body configuration `{0, g, g + d₁}`. -/
noncomputable def cfg3 (g d₁ : ℝ) : Fin 3 → ℝ := ![0, g, g + d₁]

@[simp] lemma cfg3_zero (g d₁ : ℝ) : cfg3 g d₁ 0 = 0 := rfl
@[simp] lemma cfg3_one (g d₁ : ℝ) : cfg3 g d₁ 1 = g := rfl
@[simp] lemma cfg3_two (g d₁ : ℝ) : cfg3 g d₁ 2 = g + d₁ := rfl

/-- **Lemma 1** in translation-general form.

For any three-body configuration `x 0 < x 1 < x 2`, writing `g = x 1 - x 0` (tracked gap)
and `d₁ = x 2 - x 1` (distance to the environment particle), and `ġ = v₂ - v₁`,
`ḋ₁ = v₃ - v₂` for the field increments,

`(ġ d₁ - g ḋ₁)/d₁² = (g - d₁)/d₁² * [2/(g+d₁) + 4(g+d₁)/(d₁ g)]`. -/
theorem R2T_identity_general (x : Fin 3 → ℝ) (h01 : x 0 < x 1) (h12 : x 1 < x 2) :
    ((v x 1 - v x 0) * (x 2 - x 1) - (x 1 - x 0) * (v x 2 - v x 1)) / (x 2 - x 1) ^ 2
      = ((x 1 - x 0) - (x 2 - x 1)) / (x 2 - x 1) ^ 2
          * (2 / ((x 1 - x 0) + (x 2 - x 1))
              + 4 * ((x 1 - x 0) + (x 2 - x 1)) / ((x 2 - x 1) * (x 1 - x 0))) := by
  have a1 : x 1 - x 0 ≠ 0 := by intro h; linarith [sub_eq_zero.mp h]
  have a2 : x 0 - x 1 ≠ 0 := by intro h; linarith [sub_eq_zero.mp h]
  have b1 : x 2 - x 1 ≠ 0 := by intro h; linarith [sub_eq_zero.mp h]
  have b2 : x 1 - x 2 ≠ 0 := by intro h; linarith [sub_eq_zero.mp h]
  have c1 : x 2 - x 0 ≠ 0 := by intro h; linarith [sub_eq_zero.mp h]
  have c2 : x 0 - x 2 ≠ 0 := by intro h; linarith [sub_eq_zero.mp h]
  have s1 : (x 1 - x 0) + (x 2 - x 1) ≠ 0 := by
    have : (x 1 - x 0) + (x 2 - x 1) = x 2 - x 0 := by ring
    rw [this]; exact c1
  rw [v3_apply_zero, v3_apply_one, v3_apply_two]
  field_simp
  ring

/-- **Lemma 1** (exact identity; source line 201), for the configuration `{0, g, g+d₁}`. -/
theorem R2T_identity (g d₁ : ℝ) (hg : 0 < g) (hd : 0 < d₁) :
    ((v (cfg3 g d₁) 1 - v (cfg3 g d₁) 0) * d₁ - g * (v (cfg3 g d₁) 2 - v (cfg3 g d₁) 1)) / d₁ ^ 2
      = (g - d₁) / d₁ ^ 2 * (2 / (g + d₁) + 4 * (g + d₁) / (d₁ * g)) := by
  have h := R2T_identity_general (cfg3 g d₁) (by simpa using hg) (by simp; linarith)
  simp only [cfg3_zero, cfg3_one, cfg3_two] at h
  rw [show g - 0 = g by ring, show g + d₁ - g = d₁ by ring] at h
  simpa using h

/-- The bracket appearing in `R2T_identity` is strictly positive. -/
theorem R2T_bracket_pos (g d₁ : ℝ) (hg : 0 < g) (hd : 0 < d₁) :
    0 < 2 / (g + d₁) + 4 * (g + d₁) / (d₁ * g) := by positivity

/-- **Corollary 1** (sign law): the sign of the `ρ = g/d₁` rate equals `sign (g - d₁)`.
In particular `ρ < 1` forces the rate to be negative (the isolation margin strictly
self-improves) and the rate vanishes exactly at `g = d₁`, i.e. the threshold is `ρ = 1`. -/
theorem R2T_sign_law (g d₁ : ℝ) (hg : 0 < g) (hd : 0 < d₁) :
    (((v (cfg3 g d₁) 1 - v (cfg3 g d₁) 0) * d₁
        - g * (v (cfg3 g d₁) 2 - v (cfg3 g d₁) 1)) / d₁ ^ 2 < 0 ↔ g < d₁)
    ∧ (((v (cfg3 g d₁) 1 - v (cfg3 g d₁) 0) * d₁
        - g * (v (cfg3 g d₁) 2 - v (cfg3 g d₁) 1)) / d₁ ^ 2 = 0 ↔ g = d₁)
    ∧ (((v (cfg3 g d₁) 1 - v (cfg3 g d₁) 0) * d₁
        - g * (v (cfg3 g d₁) 2 - v (cfg3 g d₁) 1)) / d₁ ^ 2 > 0 ↔ d₁ < g) := by
  have hb := R2T_bracket_pos g d₁ hg hd
  have hd2 : (0:ℝ) < d₁ ^ 2 := by positivity
  rw [R2T_identity g d₁ hg hd]
  set B : ℝ := 2 / (g + d₁) + 4 * (g + d₁) / (d₁ * g) with hB
  refine ⟨?_, ?_, ?_⟩
  · constructor
    · intro h
      by_contra hc
      push_neg at hc
      have : 0 ≤ (g - d₁) / d₁ ^ 2 * B :=
        mul_nonneg (div_nonneg (by linarith) hd2.le) hb.le
      linarith
    · intro h
      exact mul_neg_of_neg_of_pos (div_neg_of_neg_of_pos (by linarith) hd2) hb
  · constructor
    · intro h
      rcases mul_eq_zero.mp h with h1 | h1
      · rcases div_eq_zero_iff.mp h1 with h2 | h2
        · linarith
        · exact absurd h2 (ne_of_gt hd2)
      · exact absurd h1 (ne_of_gt hb)
    · intro h; simp [h]
  · constructor
    · intro h
      by_contra hc
      push_neg at hc
      have : (g - d₁) / d₁ ^ 2 * B ≤ 0 :=
        mul_nonpos_of_nonpos_of_nonneg
          (div_nonpos_of_nonpos_of_nonneg (by linarith) hd2.le) hb.le
      linarith
    · intro h
      exact mul_pos (div_pos (by linarith) hd2) hb

/-- **Conditional Corollary 1′** (flow form; named hypothesis `hsol`).

If `x` is differentiable at `s`, solves `x' = v(x)` at `s`, and keeps `x₀ < x₁ < x₂`,
then `d/ds (g/d₁)` equals the right-hand side of Lemma 1 along the solution (chain rule),
where `g = x₁ - x₀` and `d₁ = x₂ - x₁`. -/
theorem R2T_flow_form (x : ℝ → Fin 3 → ℝ) (s : ℝ)
    (hsol : ∀ k, HasDerivAt (fun t => x t k) (v (x s) k) s)
    (h01 : x s 0 < x s 1) (h12 : x s 1 < x s 2) :
    HasDerivAt (fun t => (x t 1 - x t 0) / (x t 2 - x t 1))
      (((x s 1 - x s 0) - (x s 2 - x s 1)) / (x s 2 - x s 1) ^ 2
        * (2 / ((x s 1 - x s 0) + (x s 2 - x s 1))
          + 4 * ((x s 1 - x s 0) + (x s 2 - x s 1))
              / ((x s 2 - x s 1) * (x s 1 - x s 0)))) s := by
  have hd' : x s 2 - x s 1 ≠ 0 := by intro h; linarith [sub_eq_zero.mp h]
  have hquot : HasDerivAt (fun t => (x t 1 - x t 0) / (x t 2 - x t 1))
      (((v (x s) 1 - v (x s) 0) * (x s 2 - x s 1)
          - (x s 1 - x s 0) * (v (x s) 2 - v (x s) 1)) / (x s 2 - x s 1) ^ 2) s :=
    ((hsol 1).sub (hsol 0)).div ((hsol 2).sub (hsol 1)) hd'
  rwa [R2T_identity_general (x s) h01 h12] at hquot

/-- Along such a solution, if the margin ratio `ρ = g/d₁` is `< 1` then it is strictly
decreasing at `s`: the derivative is negative. -/
theorem R2T_flow_form_neg (x : ℝ → Fin 3 → ℝ) (s : ℝ)
    (hsol : ∀ k, HasDerivAt (fun t => x t k) (v (x s) k) s)
    (h01 : x s 0 < x s 1) (h12 : x s 1 < x s 2)
    (hρ : (x s 1 - x s 0) / (x s 2 - x s 1) < 1) :
    deriv (fun t => (x t 1 - x t 0) / (x t 2 - x t 1)) s < 0 := by
  have hg : 0 < x s 1 - x s 0 := by linarith
  have hd : 0 < x s 2 - x s 1 := by linarith
  have hlt : x s 1 - x s 0 < x s 2 - x s 1 := by
    have := (div_lt_one hd).mp hρ
    linarith
  rw [(R2T_flow_form x s hsol h01 h12).deriv]
  have hb := R2T_bracket_pos (x s 1 - x s 0) (x s 2 - x s 1) hg hd
  have hd2 : (0:ℝ) < (x s 2 - x s 1) ^ 2 := by positivity
  exact mul_neg_of_neg_of_pos (div_neg_of_neg_of_pos (by linarith) hd2) hb

/-! ## Part II — Lemma R2-T2 (imp-3005): symmetric single shell -/

/-- The symmetric single-shell four-body configuration
`{-(g/2+d), -g/2, g/2, g/2+d}`. -/
noncomputable def cfg4 (g d : ℝ) : Fin 4 → ℝ := ![-(g / 2 + d), -(g / 2), g / 2, g / 2 + d]

@[simp] lemma cfg4_zero (g d : ℝ) : cfg4 g d 0 = -(g / 2 + d) := rfl
@[simp] lemma cfg4_one (g d : ℝ) : cfg4 g d 1 = -(g / 2) := rfl
@[simp] lemma cfg4_two (g d : ℝ) : cfg4 g d 2 = g / 2 := rfl
@[simp] lemma cfg4_three (g d : ℝ) : cfg4 g d 3 = g / 2 + d := rfl

/-- The rate function `f(ρ) = -4/ρ + 4ρ/(ρ+1) + 2ρ/(ρ+2) + 4ρ - 2`. -/
noncomputable def f (ρ : ℝ) : ℝ := -(4 / ρ) + 4 * ρ / (ρ + 1) + 2 * ρ / (ρ + 2) + 4 * ρ - 2

/-- The quartic `Q(ρ) = ρ⁴ + 4ρ³ + 2ρ² - 4ρ - 2`. -/
def Q (ρ : ℝ) : ℝ := ρ ^ 4 + 4 * ρ ^ 3 + 2 * ρ ^ 2 - 4 * ρ - 2

/-- The onset constant `c* = √(2+√3) - 1 ≈ 0.93185165`. -/
noncomputable def cstar : ℝ := Real.sqrt (2 + Real.sqrt 3) - 1

/-- **Lemma 2** (exact rate; source line 234).

For the symmetric single-shell configuration, with `ġ = v₃ - v₂` and `ḋ = v₄ - v₃`,

`(ġ d - g ḋ)/d² = f(ρ)/d²`, where `ρ = g/d`. -/
theorem R2T2_rate (g d : ℝ) (hg : 0 < g) (hd : 0 < d) :
    ((v (cfg4 g d) 2 - v (cfg4 g d) 1) * d - g * (v (cfg4 g d) 3 - v (cfg4 g d) 2)) / d ^ 2
      = f (g / d) / d ^ 2 := by
  have hg' : g ≠ 0 := ne_of_gt hg
  have hd' : d ≠ 0 := ne_of_gt hd
  have h1 : g + d ≠ 0 := by positivity
  have h2 : g + 2 * d ≠ 0 := by positivity
  have h3 : g / d + 1 ≠ 0 := by positivity
  have h4 : g / d + 2 ≠ 0 := by positivity
  have h5 : g / d ≠ 0 := by positivity
  rw [v4_apply_one, v4_apply_two, v4_apply_three]
  simp only [cfg4_zero, cfg4_one, cfg4_two, cfg4_three, f]
  rw [show -(g / 2) - -(g / 2 + d) = d by ring, show -(g / 2) - g / 2 = -g by ring,
    show -(g / 2) - (g / 2 + d) = -(g + d) by ring,
    show g / 2 - -(g / 2 + d) = g + d by ring, show g / 2 - -(g / 2) = g by ring,
    show g / 2 - (g / 2 + d) = -d by ring,
    show g / 2 + d - -(g / 2 + d) = g + 2 * d by ring,
    show g / 2 + d - -(g / 2) = g + d by ring, show g / 2 + d - g / 2 = d by ring]
  field_simp
  ring

/-- **Lemma 3(a)**: rational form of the rate function, `f(ρ) = 4 Q(ρ) / (ρ(ρ+1)(ρ+2))`. -/
theorem f_eq_Q_div (ρ : ℝ) (hρ : 0 < ρ) : f ρ = 4 * Q ρ / (ρ * (ρ + 1) * (ρ + 2)) := by
  have h0 : ρ ≠ 0 := ne_of_gt hρ
  have h1 : ρ + 1 ≠ 0 := by positivity
  have h2 : ρ + 2 ≠ 0 := by positivity
  simp only [f, Q]
  field_simp
  ring

/-- **Lemma 3(b)**: the substitution `u = ρ² + 2ρ` turns `Q` into `u² - 2u - 2`. -/
theorem Q_eq_u_quadratic (ρ : ℝ) :
    Q ρ = (ρ ^ 2 + 2 * ρ) ^ 2 - 2 * (ρ ^ 2 + 2 * ρ) - 2 := by
  simp only [Q]; ring

/-! ### Theorem 4 — the closed-form onset -/

lemma sqrt_three_lt_two : Real.sqrt 3 < 2 := by
  nlinarith [Real.sq_sqrt (by norm_num : (0:ℝ) ≤ 3), Real.sqrt_nonneg 3]

lemma one_lt_sqrt_three : 1 < Real.sqrt 3 := by
  nlinarith [Real.sq_sqrt (by norm_num : (0:ℝ) ≤ 3), Real.sqrt_nonneg 3]

/-- `(c* + 1)² = 2 + √3`. -/
lemma cstar_add_one_sq : (cstar + 1) ^ 2 = 2 + Real.sqrt 3 := by
  have h : (0:ℝ) ≤ 2 + Real.sqrt 3 := by positivity
  simp only [cstar]
  rw [show Real.sqrt (2 + Real.sqrt 3) - 1 + 1 = Real.sqrt (2 + Real.sqrt 3) by ring]
  exact Real.sq_sqrt h

lemma cstar_add_one_nonneg : 0 ≤ cstar + 1 := by
  simp only [cstar]
  have : (0:ℝ) ≤ Real.sqrt (2 + Real.sqrt 3) := Real.sqrt_nonneg _
  linarith

/-- **Theorem 4** (equality of the two radical forms): `√(2+√3) = (1+√3)/√2`,
hence `c* = (1+√3)/√2 - 1`. -/
theorem cstar_radical_forms :
    Real.sqrt (2 + Real.sqrt 3) = (1 + Real.sqrt 3) / Real.sqrt 2
      ∧ cstar = (1 + Real.sqrt 3) / Real.sqrt 2 - 1 := by
  have h3 : Real.sqrt 3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  have h2 : Real.sqrt 2 ^ 2 = 2 := Real.sq_sqrt (by norm_num)
  have h2pos : (0:ℝ) < Real.sqrt 2 := Real.sqrt_pos.mpr (by norm_num)
  have h3nn : (0:ℝ) ≤ Real.sqrt 3 := Real.sqrt_nonneg 3
  have hmain : Real.sqrt (2 + Real.sqrt 3) = (1 + Real.sqrt 3) / Real.sqrt 2 := by
    rw [show (2 : ℝ) + Real.sqrt 3 = ((1 + Real.sqrt 3) / Real.sqrt 2) ^ 2 by
      field_simp
      nlinarith [h3, h2]]
    exact Real.sqrt_sq (by positivity)
  exact ⟨hmain, by simp [cstar, hmain]⟩

/-- `c*` lies in `(0, 1)`. -/
theorem cstar_mem_Ioo : 0 < cstar ∧ cstar < 1 := by
  have hlt : Real.sqrt 3 < 2 := sqrt_three_lt_two
  have hgt : 1 < Real.sqrt 3 := one_lt_sqrt_three
  have hsq := cstar_add_one_sq
  have hnn := cstar_add_one_nonneg
  exact ⟨by nlinarith, by nlinarith⟩

/-- Factorization of the quartic:
`Q(ρ) = (ρ - c*) (ρ + c* + 2) ((ρ+1)² - (2 - √3))`. -/
theorem Q_factorization (ρ : ℝ) :
    Q ρ = (ρ - cstar) * (ρ + cstar + 2) * ((ρ + 1) ^ 2 - (2 - Real.sqrt 3)) := by
  have h3 : Real.sqrt 3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  have hc2 : (cstar + 1) ^ 2 = 2 + Real.sqrt 3 := cstar_add_one_sq
  simp only [Q]
  linear_combination ((ρ + 1) ^ 2 - 2 + Real.sqrt 3) * hc2 + h3

/-- `Q(c*) = 0`: `c*` is a root of the quartic (equivalently of `f`). -/
theorem Q_cstar_eq_zero : Q cstar = 0 := by
  rw [Q_factorization]; ring

/-- The two remaining factors of `Q` are strictly positive for `ρ > 0`. -/
lemma Q_cofactors_pos (ρ : ℝ) (hρ : 0 < ρ) :
    0 < (ρ + cstar + 2) * ((ρ + 1) ^ 2 - (2 - Real.sqrt 3)) := by
  have hc := cstar_mem_Ioo
  have hgt : 1 < Real.sqrt 3 := one_lt_sqrt_three
  exact mul_pos (by linarith [hc.1]) (by nlinarith)

/-- **Theorem 4** (sign dichotomy for `Q`): for `ρ > 0`, `Q < 0` below `c*`,
`Q = 0` at `c*`, and `Q > 0` above `c*`. -/
theorem Q_sign (ρ : ℝ) (hρ : 0 < ρ) :
    (ρ < cstar → Q ρ < 0) ∧ (ρ = cstar → Q ρ = 0) ∧ (cstar < ρ → 0 < Q ρ) := by
  have hcof := Q_cofactors_pos ρ hρ
  have hQ : Q ρ = (ρ - cstar) * ((ρ + cstar + 2) * ((ρ + 1) ^ 2 - (2 - Real.sqrt 3))) := by
    rw [Q_factorization]; ring
  refine ⟨fun h => ?_, fun h => ?_, fun h => ?_⟩
  · rw [hQ]; exact mul_neg_of_neg_of_pos (by linarith) hcof
  · rw [hQ, h]; ring
  · rw [hQ]; exact mul_pos (by linarith) hcof

/-- **Theorem 4** (sign dichotomy for the rate function `f`):
for `ρ > 0`, `f < 0` on `(0, c*)` (isolation margin improving), `f(c*) = 0`, and
`f > 0` above `c*` (worsening) — in particular on `(c*, 1)`. -/
theorem f_sign (ρ : ℝ) (hρ : 0 < ρ) :
    (ρ < cstar → f ρ < 0) ∧ (ρ = cstar → f ρ = 0) ∧ (cstar < ρ → 0 < f ρ) := by
  have hden : 0 < ρ * (ρ + 1) * (ρ + 2) := by positivity
  have hf := f_eq_Q_div ρ hρ
  obtain ⟨h1, h2, h3⟩ := Q_sign ρ hρ
  refine ⟨fun h => ?_, fun h => ?_, fun h => ?_⟩
  · rw [hf]; exact div_neg_of_neg_of_pos (by linarith [h1 h]) hden
  · rw [hf, h2 h]; simp
  · rw [hf]; exact div_pos (by linarith [h3 h]) hden

/-- Numerical bounds on `√3`. -/
lemma sqrt_three_bounds : 1.7320508 < Real.sqrt 3 ∧ Real.sqrt 3 < 1.7320509 := by
  have h3 : Real.sqrt 3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  have hnn : (0:ℝ) ≤ Real.sqrt 3 := Real.sqrt_nonneg 3
  constructor <;> nlinarith [h3, hnn]

/-- The numerical value quoted in the source: `c* ≈ 0.93185165`. -/
theorem cstar_approx : |cstar - 0.93185165| < 1e-7 := by
  have hb := sqrt_three_bounds
  have hsq := cstar_add_one_sq
  have hnn := cstar_add_one_nonneg
  rw [abs_lt]
  constructor <;> nlinarith [hsq, hnn, hb.1, hb.2]

/-- **Theorem 4** (uniqueness): `c*` is the unique root of `Q` in `(0,1)`. -/
theorem Q_unique_root_Ioo (ρ : ℝ) (hρ : ρ ∈ Set.Ioo (0:ℝ) 1) :
    Q ρ = 0 ↔ ρ = cstar := by
  obtain ⟨s1, s2, s3⟩ := Q_sign ρ hρ.1
  refine ⟨fun h => ?_, s2⟩
  rcases lt_trichotomy ρ cstar with hlt | heq | hgt
  · exact absurd h (ne_of_lt (s1 hlt))
  · exact heq
  · exact absurd h (ne_of_gt (s3 hgt))

/-- **Theorem 4** (uniqueness for `f`): `c*` is the unique root of the rate function `f`
in `(0,1)`; together with `f_sign` this is the onset statement — the rate turns from
negative to positive exactly at `c*`. -/
theorem f_unique_root_Ioo (ρ : ℝ) (hρ : ρ ∈ Set.Ioo (0:ℝ) 1) :
    f ρ = 0 ↔ ρ = cstar := by
  obtain ⟨s1, s2, s3⟩ := f_sign ρ hρ.1
  refine ⟨fun h => ?_, s2⟩
  rcases lt_trichotomy ρ cstar with hlt | heq | hgt
  · exact absurd h (ne_of_lt (s1 hlt))
  · exact heq
  · exact absurd h (ne_of_gt (s3 hgt))

end IsolationOnset
