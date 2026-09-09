import RequestProject.FrozenRung.L2Conditional

/-!
# Non-vacuity check for the Target 2 hypotheses

The conditional theorem `FrozenRung.l2_conditional` carries the unproven Hypothesis (ZR)
together with a strip bound and a ghost configuration.  This file exhibits a single entire
function for which all of these hypotheses hold simultaneously, so that the hypothesis package
is demonstrably satisfiable (and the theorem is not vacuous).

The test function is `Xtest w = w - 1/4`, whose unique zero `1/4` lies in the box
`0 < Re w ≤ 1/2`, `|Im w| ≤ 1`.
-/

namespace FrozenRung

open Metric

/-- A test function with a single, fully uncancelled ghost at `1/4`. -/
noncomputable def Xtest : ℂ → ℂ := fun w => w - (1 / 4 : ℂ)

theorem Xtest_analytic : AnalyticOnNhd ℂ Xtest Set.univ := by
  intro z _
  exact (analyticAt_id).sub analyticAt_const

theorem deriv_Xtest (z : ℂ) : deriv Xtest z = 1 := by
  unfold Xtest
  rw [deriv_sub_const]
  exact deriv_id z

/-- The ghost at `1/4`, of multiplicity one. -/
noncomputable def ghostTest : Ghost Xtest 1 where
  lam := (1 / 4 : ℂ)
  re_pos := by norm_num
  re_le := by norm_num
  im_le := by norm_num
  m := 1
  m_pos := le_rfl
  g := fun _ => 1
  g_analytic := fun z _ => analyticAt_const
  factor := by intro ζ _; simp [Xtest]

theorem zeroRepulsion_Xtest : ZeroRepulsion Xtest 1 (1 / 4) {1 / 8} where
  eta_pos := by norm_num
  levels := by
    intro a ha
    simp only [Finset.mem_singleton] at ha
    subst ha
    norm_num
  repulsion := by
    intro lam hlam _ _ _
    have hlam' : lam = (1 / 4 : ℂ) := by
      have : lam - (1 / 4 : ℂ) = 0 := hlam
      linear_combination this
    refine ⟨1 / 8, Finset.mem_singleton_self _, ?_, ?_⟩
    · rw [hlam']
      norm_num
    · rw [hlam']
      norm_num [Xtest]

theorem stripBound_Xtest : StripBound Xtest 1 8 where
  pos := by norm_num
  bound_X := by
    intro ζ hre him
    have h := Complex.norm_le_abs_re_add_abs_im (ζ - (1 / 4 : ℂ))
    have hre' : (ζ - (1 / 4 : ℂ)).re = ζ.re - 1 / 4 := by simp
    have him' : (ζ - (1 / 4 : ℂ)).im = ζ.im := by simp
    rw [hre', him'] at h
    have h1 : |ζ.re - 1 / 4| ≤ 2 + 1 / 4 := by
      rw [abs_le] at hre ⊢; constructor <;> linarith [hre.1, hre.2]
    have h2 : |ζ.im| ≤ 3 := by linarith [him]
    calc ‖Xtest ζ‖ = ‖ζ - (1 / 4 : ℂ)‖ := rfl
      _ ≤ |ζ.re - 1 / 4| + |ζ.im| := h
      _ ≤ 8 := by linarith
  bound_deriv := by
    intro ζ _ _
    rw [deriv_Xtest]
    norm_num

/-- The conditional theorem applied to the test data: with `eta = 1/4` and `B = 8` the
admissible spacing is `2 s ≤ rho0 (1/4) 8 = 1/128`, and the mesh of spacing `1/256` detects the
ghost.  This instantiation shows that the hypothesis package of `l2_conditional` is
satisfiable. -/
example : ∃ a ∈ ({1 / 8} : Finset ℝ),
    ∃ zhat ∈ meshLattice (1 / 256) (((1 / 256 : ℝ) : ℂ)) 1,
      ‖Xtest (zhat + a)‖ < ‖Xtest (zhat - a)‖ :=
  l2_conditional le_rfl Xtest_analytic zeroRepulsion_Xtest stripBound_Xtest
    (by norm_num) (by rw [rho0]; norm_num) (by norm_num) (by norm_num) ghostTest

end FrozenRung
