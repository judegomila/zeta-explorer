import RequestProject.Defs

/-!
# Iterated derivatives pass to locally uniform limits

On `ℂ`, a locally uniform limit of entire functions is entire and all iterated
derivatives converge locally uniformly as well.
-/

open Filter Polynomial

namespace EntireLP

/-- The derivative of an entire function is entire. -/
theorem differentiable_deriv {f : ℂ → ℂ} (h : Differentiable ℂ f) :
    Differentiable ℂ (deriv f) := by
  have h1 : AnalyticOnNhd ℂ f Set.univ := h.differentiableOn.analyticOnNhd isOpen_univ
  intro x
  exact (h1.deriv x (Set.mem_univ x)).differentiableAt

/-- Every iterated derivative of an entire function is entire. -/
theorem differentiable_iteratedDeriv {f : ℂ → ℂ} (h : Differentiable ℂ f) (m : ℕ) :
    Differentiable ℂ (iteratedDeriv m f) := by
  induction m with
  | zero => simpa [iteratedDeriv_zero] using h
  | succ m ih => rw [iteratedDeriv_succ]; exact differentiable_deriv ih

/-- A locally uniform limit of entire functions is entire. -/
theorem differentiable_of_tendstoLocallyUniformly {F : ℕ → ℂ → ℂ} {f : ℂ → ℂ}
    (hF : ∀ n, Differentiable ℂ (F n)) (h : TendstoLocallyUniformly F f atTop) :
    Differentiable ℂ f := by
  rw [← tendstoLocallyUniformlyOn_univ] at h
  have := h.differentiableOn (Eventually.of_forall fun n => (hF n).differentiableOn) isOpen_univ
  rw [differentiableOn_univ] at this
  exact this

/-- Iterated derivatives of a locally uniformly convergent sequence of entire functions
converge locally uniformly to the corresponding derivative of the limit. -/
theorem tendstoLocallyUniformly_iteratedDeriv {F : ℕ → ℂ → ℂ} {f : ℂ → ℂ}
    (hF : ∀ n, Differentiable ℂ (F n)) (h : TendstoLocallyUniformly F f atTop) (m : ℕ) :
    TendstoLocallyUniformly (fun n => iteratedDeriv m (F n)) (iteratedDeriv m f) atTop := by
  induction m with
  | zero => simpa [iteratedDeriv_zero] using h
  | succ m ih =>
    rw [← tendstoLocallyUniformlyOn_univ] at ih ⊢
    have hd := ih.deriv
      (Eventually.of_forall fun n =>
        (differentiable_iteratedDeriv (hF n) m).differentiableOn) isOpen_univ
    simpa [iteratedDeriv_succ, Function.comp_def] using hd

/-- Pointwise convergence of iterated derivatives. -/
theorem tendsto_iteratedDeriv_at {F : ℕ → ℂ → ℂ} {f : ℂ → ℂ}
    (hF : ∀ n, Differentiable ℂ (F n)) (h : TendstoLocallyUniformly F f atTop) (m : ℕ) (z : ℂ) :
    Tendsto (fun n => iteratedDeriv m (F n) z) atTop (nhds (iteratedDeriv m f z)) := by
  have h' := tendstoLocallyUniformly_iteratedDeriv hF h m
  rw [← tendstoLocallyUniformlyOn_univ] at h'
  exact h'.tendsto_at (Set.mem_univ z)

/-- A real polynomial, viewed as a function on `ℂ`, is entire. -/
theorem differentiable_toEntire (P : ℝ[X]) : Differentiable ℂ (toEntire P) := by
  have : toEntire P = fun z : ℂ => (P.map (algebraMap ℝ ℂ)).eval z := by
    funext z
    simp [toEntire, aeval_def, eval_map]
  rw [this]
  exact Polynomial.differentiable _

end EntireLP
