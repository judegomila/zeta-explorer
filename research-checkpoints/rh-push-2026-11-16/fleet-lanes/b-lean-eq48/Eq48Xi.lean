/-
Eq48Xi.lean  (2026-11-16, slug b-lean-eq48)

Instantiates `Eq48Pick` / `Eq48Generic` at the actual Riemann xi function of Mathlib:

  `xi(s) = s (s-1)/2 * completedRiemannZeta s`,   `Lxi(x) = Re (xi'/xi)(1/2 + x)`.

Proved here (no hypotheses): `xi` is analytic and zero-free on `Re s > 1`, and `Lxi` is
real-analytic on `(1/2, ∞)`  (hypothesis (H-AN) of `Eq48Generic`).

Stated here as propositions and PROVED in `Eq48LemmaA` (`xiLow`, `xiGrow`):
  `XiLow`   : `Lxi(y) >= c > 0` for all large `y`          (Lemma A of RESULT.md),
  `XiGrow`  : `Lxi(y)/y -> 0` as `y -> ∞`                  (Lemma A: `L = O(log x)`).
-/
import Mathlib
import Eq48Pick
import Eq48Generic

open Complex Filter Topology

namespace Eq48

/-- Riemann xi function. -/
noncomputable def xi (s : ℂ) : ℂ := s * (s - 1) / 2 * completedRiemannZeta s

/-- `L(x) = (xi'/xi)(1/2 + x)` for real `x` (real part; the value is real for real `x`, which is
not needed below). -/
noncomputable def Lxi (x : ℝ) : ℝ := (logDeriv xi (1 / 2 + (x : ℂ))).re

lemma completedRiemannZeta_ne_zero_of_one_lt_re {s : ℂ} (hs : 1 < s.re) :
    completedRiemannZeta s ≠ 0 := by
  have hs0 : s ≠ 0 := by
    rintro rfl
    simp at hs
    linarith
  intro h
  have hz := riemannZeta_def_of_ne_zero hs0
  rw [h, zero_div] at hz
  exact riemannZeta_ne_zero_of_one_lt_re hs hz

lemma xi_ne_zero {s : ℂ} (hs : 1 < s.re) : xi s ≠ 0 := by
  have hs0 : s ≠ 0 := by
    rintro rfl
    simp at hs
    linarith
  have hs1 : s - 1 ≠ 0 := by
    intro h
    have : s = 1 := sub_eq_zero.1 h
    rw [this] at hs
    simp at hs
  unfold xi
  exact mul_ne_zero (div_ne_zero (mul_ne_zero hs0 hs1) two_ne_zero)
    (completedRiemannZeta_ne_zero_of_one_lt_re hs)

lemma isOpen_halfPlane : IsOpen {s : ℂ | 1 < s.re} :=
  isOpen_lt continuous_const Complex.continuous_re

lemma xi_analyticOnNhd : AnalyticOnNhd ℂ xi {s : ℂ | 1 < s.re} := by
  refine DifferentiableOn.analyticOnNhd (fun s hs => ?_) isOpen_halfPlane
  have hs' : 1 < s.re := hs
  have hs0 : s ≠ 0 := by
    rintro rfl
    simp at hs'
    linarith
  have hs1 : s ≠ 1 := by
    rintro rfl
    simp at hs'
  have h1 : DifferentiableAt ℂ completedRiemannZeta s := differentiableAt_completedZeta hs0 hs1
  have h2 : DifferentiableAt ℂ (fun s : ℂ => s * (s - 1) / 2) s := by fun_prop
  exact (h2.mul h1).differentiableWithinAt

lemma logDeriv_xi_analyticAt {s : ℂ} (hs : 1 < s.re) : AnalyticAt ℂ (logDeriv xi) s := by
  have h := xi_analyticOnNhd s hs
  have : logDeriv xi = fun z => deriv xi z / xi z := by
    funext z; simp [logDeriv_apply]
  rw [this]
  exact h.deriv.div h (xi_ne_zero hs)

/-- **(H-AN) for xi, proved.** `Lxi` is real-analytic on `(1/2, ∞)`. -/
theorem Lxi_analyticOnNhd : AnalyticOnNhd ℝ Lxi (Set.Ioi (1 / 2)) := by
  intro x hx
  have hx' : (1 / 2 : ℝ) < x := hx
  have hre : 1 < ((1 / 2 : ℂ) + (x : ℂ)).re := by
    simp
    linarith
  have h1 : AnalyticAt ℝ (logDeriv xi) ((1 / 2 : ℂ) + (x : ℂ)) :=
    (logDeriv_xi_analyticAt hre).restrictScalars
  have h2 : AnalyticAt ℝ (fun x : ℝ => (1 / 2 : ℂ) + (x : ℂ)) x :=
    analyticAt_const.add (Complex.ofRealCLM.analyticAt x)
  have h3 : AnalyticAt ℝ (fun x : ℝ => logDeriv xi ((1 / 2 : ℂ) + (x : ℂ))) x :=
    AnalyticAt.comp (g := logDeriv xi) (f := fun x : ℝ => (1 / 2 : ℂ) + (x : ℂ)) h1 h2
  exact (Complex.reCLM.analyticAt _).comp h3

/-- Lemma A, lower bound (proved in `Eq48LemmaA.xiLow`). -/
def XiLow : Prop := ∃ c : ℝ, 0 < c ∧ ∀ᶠ y in atTop, c ≤ Lxi y

/-- Lemma A, growth `L = O(log x)` (proved in `Eq48LemmaA.xiGrow`). -/
def XiGrow : Prop := Tendsto (fun y => Lxi y / y) atTop (𝓝 0)

/-- **Theorem 2, (a) <=> (b), for the Riemann xi function**, with Lemma B machine-checked and the
two asymptotic facts of Lemma A as the only hypotheses. -/
theorem xi_residualTarget_iff_fullClass (hlow : XiLow) (hgrow : XiGrow) :
    ResidualTarget Lxi (Set.Ioi (1 / 2)) ↔ FullClass Lxi (Set.Ioi (1 / 2)) := by
  obtain ⟨c, hc, hl⟩ := hlow
  exact residualTarget_iff_fullClass_of_analytic (by norm_num) Lxi_analyticOnNhd hc hl hgrow

/-- **Theorem 2, (a') => (b_I), for xi, prefix-PD form**: no hypotheses beyond prefix-PD. -/
theorem xi_bI_of_prefix_posDef (x : ℕ → ℝ) (hPD : ∀ n, (pick Lxi (pre x n)).PosDef)
    {m : ℕ} (s : Fin m → ℝ) (hsD : ∀ i, s i ∈ Set.Ioi (1 / 2 : ℝ))
    (hsI : ∀ i, s i ∈ closure (Set.range x)) : (pick Lxi s).PosSemidef :=
  bI_of_prefix_posDef isOpen_Ioi (fun _ hx => lt_trans (by norm_num) hx)
    Lxi_analyticOnNhd.continuousOn x hPD s hsD hsI

end Eq48
