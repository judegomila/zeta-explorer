/-
Route 43 (b9) — graded flow-criticality: formal pieces.

Source: formalization/paper/flow-criticality-grading.md (sections 2 and 3).
Compiled against Mathlib d13f23b7 / Lean 4.34.1 and the openai/math OAI library
(tree /tmp/qrh-verify/lean), see tmp/routes-b9-r43-lean/check.sh.  Not part of the
DeBruijnNewman lake target.

Part A (concrete, about Mathlib's `riemannZeta`): the 7/8 half-plane of openai/math family
003 (`OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re`, Lean-checked locally, not
peer-reviewed) plus Mathlib's functional equation `riemannZeta_one_sub` give the
symmetric strip 1/8 ≤ Re ρ ≤ 7/8 for every zero with Re ρ > 0, i.e. |2 Re ρ − 1| ≤ 3/4.
This is the strip input Y = 3/4 that de Bruijn's theorem converts into Λ ≤ 9/32.

Part B (abstract): the graded flow-blindness inequality.  A "flow space" is a type with
an additive ℝ-action (the de Bruijn–Newman heat flow F ↦ F_t) and a function Λ that
shifts by −t along the flow (Λ(F_t) = Λ(F) − t, true for the de Bruijn–Newman constant by
definition and de Bruijn's monotonicity).  Nothing analytic is formalised here: de
Bruijn's strip theorem and Rodgers–Tao's Λ ≥ 0 enter as hypotheses where used.
-/
import Mathlib
import OAI.NumberTheory.DirichletL.Nonvanishing

open Complex

namespace Route43

/-! ## Part A: the QRH strip is symmetric -/

/-- Zeros of ζ with positive real part satisfy `Re ρ ≤ 7/8` (direct from OAI 003). -/
theorem re_le_seven_eighths {ρ : ℂ} (hρ : riemannZeta ρ = 0) : ρ.re ≤ 7 / 8 := by
  by_contra h
  push Not at h
  exact OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re h hρ

/-- Zeros of ζ with positive real part satisfy `1/8 ≤ Re ρ` (OAI 003 + functional equation). -/
theorem one_eighth_le_re {ρ : ℂ} (hρ : riemannZeta ρ = 0) (hpos : 0 < ρ.re) :
    1 / 8 ≤ ρ.re := by
  by_contra h
  push Not at h
  set s : ℂ := 1 - ρ with hs_def
  have hsre : s.re = 1 - ρ.re := by simp [hs_def]
  have hs78 : (7 / 8 : ℝ) < s.re := by rw [hsre]; linarith
  have hslt1 : s.re < 1 := by rw [hsre]; linarith
  have hspos : 0 < s.re := by linarith
  have hnotneg : ∀ n : ℕ, s ≠ -(n : ℂ) := by
    intro n hn
    have : s.re = -(n : ℝ) := by rw [hn]; simp
    have : (0 : ℝ) ≤ n := Nat.cast_nonneg n
    linarith
  have hne1 : s ≠ 1 := by
    intro h1
    have : s.re = 1 := by rw [h1]; simp
    linarith
  have hfe := riemannZeta_one_sub hnotneg hne1
  have hρs : 1 - s = ρ := by simp [hs_def]
  rw [hρs] at hfe
  have hzs : riemannZeta s ≠ 0 := OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re hs78
  have h2pi : (2 * (Real.pi : ℂ)) ≠ 0 := by
    have : (Real.pi : ℂ) ≠ 0 := by exact_mod_cast Real.pi_ne_zero
    exact mul_ne_zero two_ne_zero this
  have hpow : (2 * (Real.pi : ℂ)) ^ (-s) ≠ 0 := by
    rw [Ne, cpow_eq_zero_iff]
    exact fun h => h2pi h.1
  have hgam : Gamma s ≠ 0 := Complex.Gamma_ne_zero hnotneg
  have hcos : cos (Real.pi * s / 2) ≠ 0 := by
    rw [Ne, Complex.cos_eq_zero_iff]
    rintro ⟨k, hk⟩
    have hpi : (Real.pi : ℂ) ≠ 0 := by exact_mod_cast Real.pi_ne_zero
    have hk2 : (Real.pi : ℂ) * s = (Real.pi : ℂ) * (2 * k + 1) := by
      linear_combination 2 * hk
    have hsk : s = 2 * k + 1 := mul_left_cancel₀ hpi hk2
    have hre : s.re = 2 * (k : ℝ) + 1 := by rw [hsk]; simp
    rw [hre] at hs78 hslt1
    -- 7/8 < 2k+1 < 1 is impossible for an integer k
    have h1 : (k : ℝ) < 0 := by linarith
    have h2 : (-1 : ℝ) < k := by linarith
    have h1' : k < 0 := by exact_mod_cast h1
    have h2' : (-1 : ℤ) < k := by exact_mod_cast h2
    omega
  have hprod : 2 * (2 * (Real.pi : ℂ)) ^ (-s) * Gamma s * cos (Real.pi * s / 2) * riemannZeta s ≠ 0 := by
    apply mul_ne_zero
    apply mul_ne_zero
    apply mul_ne_zero
    apply mul_ne_zero
    · exact two_ne_zero
    · exact hpow
    · exact hgam
    · exact hcos
    · exact hzs
  exact hprod (hfe ▸ hρ)

/-- The QRH strip in de Bruijn coordinates: every zero ρ of ζ with `Re ρ > 0` has
`|2 Re ρ − 1| ≤ 3/4`.  With `z = −i(2ρ − 1)` this is `|Im z| ≤ 3/4` (strip input Y = 3/4). -/
theorem qrh_symmetric_strip {ρ : ℂ} (hρ : riemannZeta ρ = 0) (hpos : 0 < ρ.re) :
    |2 * ρ.re - 1| ≤ 3 / 4 := by
  have h1 := re_le_seven_eighths hρ
  have h2 := one_eighth_le_re hρ hpos
  rw [abs_le]
  constructor <;> linarith

/-- de Bruijn's bound `Λ ≤ Y²/2` evaluated at the QRH strip Y = 3/4. -/
theorem qrh_deBruijn_value : ((3 : ℝ) / 4) ^ 2 / 2 = 9 / 32 := by norm_num

/-! ## Part B: graded flow-blindness (abstract) -/

/-- An abstract flow space: an additive ℝ-action `flow` and a functional `Λ` with
`Λ (flow t F) = Λ F - t`.  For the de Bruijn–Newman family, `flow t` is `F ↦ F_t`
(Fourier side multiplication by `e^{t u²}`) and `Λ` is the de Bruijn–Newman constant. -/
structure FlowSpace (α : Type*) where
  flow : ℝ → α → α
  flow_zero : ∀ F, flow 0 F = F
  flow_add : ∀ s t F, flow s (flow t F) = flow (s + t) F
  Λ : α → ℝ
  Λ_flow : ∀ t F, Λ (flow t F) = Λ F - t

variable {α : Type*} (S : FlowSpace α)

/-- A real number `c` is a Λ-yield bound for a property `P` if every member of `P` has
`Λ ≤ c`; the flow-criticality degree κ(P) is the least such `c`. -/
def YieldBound (P : Set α) (c : ℝ) : Prop := ∀ G ∈ P, S.Λ G ≤ c

/-- **Graded flow-blindness (G1).**  If `F ∈ P` and `F_{-τ} ∈ P`, then every Λ-yield bound
for `P` is at least `Λ F + τ`. -/
theorem graded_flow_blindness {P : Set α} {c : ℝ} (hc : YieldBound S P c) {F : α} {τ : ℝ}
    (hback : S.flow (-τ) F ∈ P) : S.Λ F + τ ≤ c := by
  have := hc _ hback
  rw [S.Λ_flow] at this
  linarith

/-- **Corollary (SL2, graded).**  If `Λ F ≥ 0` (Rodgers–Tao for ξ) and `P` has yield bound
`c`, then `P` can survive backward flow from `F` for time at most `c`.  With `c = 0`
(P implies RH class-uniformly) the survival time is `0`: P is flow-critical at `F`. -/
theorem survival_le_yield {P : Set α} {c : ℝ} (hc : YieldBound S P c) {F : α}
    (hΛ : 0 ≤ S.Λ F) {τ : ℝ} (hback : S.flow (-τ) F ∈ P) : τ ≤ c := by
  have := graded_flow_blindness S hc hback
  linarith

theorem rh_strength_forces_criticality {P : Set α} (hc : YieldBound S P 0) {F : α}
    (hΛ : 0 ≤ S.Λ F) {τ : ℝ} (hτ : 0 < τ) : S.flow (-τ) F ∉ P := by
  intro hback
  have := survival_le_yield S hc hΛ hback
  linarith

/-- The canonical members of grade `c`: the sets `{Λ ≤ c}`.  Their yield is exactly `c`
(when nonempty at the top) and their survival from `F` is exactly `c − Λ F`. -/
def LambdaLe (c : ℝ) : Set α := {G | S.Λ G ≤ c}

theorem lambdaLe_survival_iff (c : ℝ) (F : α) (τ : ℝ) :
    S.flow (-τ) F ∈ LambdaLe S c ↔ τ ≤ c - S.Λ F := by
  simp only [LambdaLe, Set.mem_ofPred_eq, S.Λ_flow]
  constructor <;> intro h <;> linarith

/-- **Backward strip growth.**  Let `Y t` bound the imaginary parts of the zeros of the
time-`t` member `flow t F`.  Assume de Bruijn's theorem in the form
`Λ (flow t F) ≤ (Y t)²/2` for every `t` (zeros in `|Im z| ≤ Y` give real zeros after time
`Y²/2`), and Rodgers–Tao `Λ F ≥ 0`.  Then for every `ε ≥ 0`, `(Y (-ε))² ≥ 2 ε`: the
backward strip opens at least like `√(2ε)`. -/
theorem backward_strip_growth (F : α) (Y : ℝ → ℝ)
    (hdB : ∀ t, S.Λ (S.flow t F) ≤ (Y t) ^ 2 / 2) (hRT : 0 ≤ S.Λ F) (ε : ℝ) :
    2 * ε ≤ (Y (-ε)) ^ 2 := by
  have h := hdB (-ε)
  rw [S.Λ_flow] at h
  nlinarith

/-- **Strip ladder (upper half).**  Under the same hypotheses, if a strip property of
width `Y₀` holds at `flow (-τ) F` (i.e. `Y (-τ) ≤ Y₀`), then `τ ≤ Y₀²/2 − Λ F ≤ Y₀²/2`.
For the QRH strip `Y₀ = 3/4` this caps the survival time of QRH at 9/32. -/
theorem strip_survival_cap (F : α) (Y : ℝ → ℝ)
    (hdB : ∀ t, S.Λ (S.flow t F) ≤ (Y t) ^ 2 / 2) (hRT : 0 ≤ S.Λ F)
    {Y₀ τ : ℝ} (_hY₀ : 0 ≤ Y₀) (hYnn : 0 ≤ Y (-τ)) (hstrip : Y (-τ) ≤ Y₀) :
    τ ≤ Y₀ ^ 2 / 2 - S.Λ F ∧ τ ≤ Y₀ ^ 2 / 2 := by
  have h := hdB (-τ)
  rw [S.Λ_flow] at h
  have hsq : (Y (-τ)) ^ 2 ≤ Y₀ ^ 2 := by
    exact pow_le_pow_left₀ hYnn hstrip 2
  constructor <;> nlinarith

theorem qrh_survival_cap (F : α) (Y : ℝ → ℝ)
    (hdB : ∀ t, S.Λ (S.flow t F) ≤ (Y t) ^ 2 / 2) (hRT : 0 ≤ S.Λ F)
    {τ : ℝ} (hYnn : 0 ≤ Y (-τ)) (hstrip : Y (-τ) ≤ 3 / 4) : τ ≤ 9 / 32 := by
  have := (strip_survival_cap S F Y hdB hRT (by norm_num) hYnn hstrip).2
  linarith

end Route43
