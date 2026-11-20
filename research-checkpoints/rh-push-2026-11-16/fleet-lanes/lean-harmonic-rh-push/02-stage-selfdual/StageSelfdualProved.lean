import Mathlib

/-!
# Stage theorem for pair ferromagnets on prime spins (reduction to Lee–Yang)

Sites `Fin n`, each with a positive "energy" `ℓ p` (for the application `ℓ p = log (P p)`,
`P p` a prime), symmetric pair couplings `K p q ≥ 0`, real fields `κ p`.

  `stagePoly K κ ℓ s = ∑_{S ⊆ Fin n} exp(∑_{p<q in S} K p q + ∑_{p ∈ S} κ p) * exp(-s * ∑_{p ∈ S} ℓ p)`

(for `ℓ = log P` this is the Dirichlet polynomial `∑_{d | M} w(d) d^{-s}`, `M = ∏ P p` squarefree).
`a p = (κ p + r p / 2) / ℓ p`, `r p = ∑_{q ≠ p} K p q`.

The multivariate Lee–Yang circle theorem enters only as the explicit hypothesis `LeeYangProp K`
(it is the subject of a separate file).  Claims:
 (i)  no zeros for `Re s > max a p` and for `Re s < min a p`;
 (ii) if `a p = a` for all `p`: every zero has `Re s = a`, and
      `stagePoly (2a - s) = exp((s - a) * ∑ ℓ) * stagePoly s`  (this identity needs no Lee–Yang
      and no sign condition on `K`);
 (iii) sum rule `κ = 0`, `r p = log (P p)`: all zeros of `∑_{d | M} w(d) d^{-s}` on `Re s = 1/2`
      and `Z(1 - s) = M^{s - 1/2} Z(s)`.
-/

open Finset BigOperators

noncomputable section

def stageZ {n : ℕ} (K : Fin n → Fin n → ℝ) (z : Fin n → ℂ) : ℂ :=
  ∑ S : Finset (Fin n),
    (Real.exp (∑ p ∈ S, ∑ q ∈ S, if p < q then K p q else 0) : ℂ) * ∏ p ∈ S, z p

def rowSum {n : ℕ} (K : Fin n → Fin n → ℝ) (p : Fin n) : ℝ :=
  ∑ q ∈ (Finset.univ.erase p), K p q

/-- The statement of the multivariate Lee–Yang circle theorem for the coupling matrix `K`. -/
def LeeYangProp {n : ℕ} (K : Fin n → Fin n → ℝ) : Prop :=
  ∀ z : Fin n → ℂ,
    ((∀ p, ‖z p‖ * Real.exp (rowSum K p / 2) < 1) → stageZ K z ≠ 0) ∧
    ((∀ p, 1 < ‖z p‖ * Real.exp (rowSum K p / 2)) → stageZ K z ≠ 0)

/-- The stage polynomial in the variable `s`. -/
def stagePoly {n : ℕ} (K : Fin n → Fin n → ℝ) (κ ℓ : Fin n → ℝ) (s : ℂ) : ℂ :=
  stageZ K (fun p => Complex.exp ((κ p : ℂ) - s * (ℓ p : ℂ)))

/-- The Lee–Yang abscissa of the site `p`. -/
def abscissa {n : ℕ} (K : Fin n → Fin n → ℝ) (κ ℓ : Fin n → ℝ) (p : Fin n) : ℝ :=
  (κ p + rowSum K p / 2) / ℓ p

/-! ## Helper lemmas (proof part) -/

/-- Pair energy of a subset. -/
def pairE {n : ℕ} (K : Fin n → Fin n → ℝ) (S : Finset (Fin n)) : ℝ :=
  ∑ p ∈ S, ∑ q ∈ S, if p < q then K p q else 0

lemma rowSum_eq {n : ℕ} (K : Fin n → Fin n → ℝ) (p : Fin n) :
    rowSum K p = ∑ q, if q = p then 0 else K p q := by
  have h := Finset.sum_erase_add (Finset.univ) (fun q => if q = p then 0 else K p q)
    (Finset.mem_univ p)
  rw [← h]
  simp only [if_true, add_zero]
  unfold rowSum
  apply Finset.sum_congr rfl
  intro q hq
  rw [if_neg (Finset.ne_of_mem_erase hq)]

lemma diag_sum {n : ℕ} (K : Fin n → Fin n → ℝ) (hsymm : ∀ p q, K p q = K q p)
    (S : Finset (Fin n)) :
    ∑ p ∈ S, ∑ q ∈ S, (if q = p then 0 else K p q) = 2 * pairE K S := by
  have h1 : ∀ p q : Fin n, (if q = p then 0 else K p q)
      = (if p < q then K p q else 0) + (if q < p then K q p else 0) := by
    intro p q
    rcases lt_trichotomy p q with h | h | h
    · rw [if_neg (ne_of_gt h), if_pos h, if_neg (not_lt.mpr (le_of_lt h)), add_zero]
    · subst h; simp
    · rw [if_neg (ne_of_lt h), if_neg (not_lt.mpr (le_of_lt h)), if_pos h, zero_add, hsymm]
  have h2 : ∑ p ∈ S, ∑ q ∈ S, (if q < p then K q p else 0) = pairE K S := by
    unfold pairE
    rw [Finset.sum_comm]
  simp_rw [h1, Finset.sum_add_distrib]
  rw [h2]
  unfold pairE
  ring

lemma rowSum_sum {n : ℕ} (K : Fin n → Fin n → ℝ) (hsymm : ∀ p q, K p q = K q p)
    (S : Finset (Fin n)) :
    ∑ p ∈ S, rowSum K p = 2 * pairE K S + ∑ p ∈ S, ∑ q ∈ Sᶜ, K p q := by
  rw [← diag_sum K hsymm S, ← Finset.sum_add_distrib]
  apply Finset.sum_congr rfl
  intro p hp
  rw [rowSum_eq, ← Finset.sum_add_sum_compl S]
  congr 1
  apply Finset.sum_congr rfl
  intro q hq
  have hne : q ≠ p := by
    rintro rfl
    exact (Finset.mem_compl.mp hq) hp
  rw [if_neg hne]

lemma cross_symm {n : ℕ} (K : Fin n → Fin n → ℝ) (hsymm : ∀ p q, K p q = K q p)
    (S : Finset (Fin n)) :
    ∑ p ∈ Sᶜ, ∑ q ∈ Sᶜᶜ, K p q = ∑ p ∈ S, ∑ q ∈ Sᶜ, K p q := by
  rw [compl_compl, Finset.sum_comm]
  apply Finset.sum_congr rfl
  intro p _
  apply Finset.sum_congr rfl
  intro q _
  exact hsymm q p

/-- The combinatorial identity behind self-duality. -/
lemma energy_balance {n : ℕ} (K : Fin n → Fin n → ℝ) (hsymm : ∀ p q, K p q = K q p)
    (S : Finset (Fin n)) :
    pairE K S - (∑ p ∈ S, rowSum K p) / 2 = pairE K Sᶜ - (∑ p ∈ Sᶜ, rowSum K p) / 2 := by
  rw [rowSum_sum K hsymm S, rowSum_sum K hsymm Sᶜ, cross_symm K hsymm S]
  ring

lemma stagePoly_eq {n : ℕ} (K : Fin n → Fin n → ℝ) (κ ℓ : Fin n → ℝ) (s : ℂ) :
    stagePoly K κ ℓ s = ∑ S : Finset (Fin n),
      Complex.exp ((pairE K S : ℂ) + ((∑ p ∈ S, κ p : ℝ) : ℂ) - s * ((∑ p ∈ S, ℓ p : ℝ) : ℂ)) := by
  unfold stagePoly stageZ
  apply Finset.sum_congr rfl
  intro S _
  rw [Complex.ofReal_exp, ← Complex.exp_sum, ← Complex.exp_add]
  congr 1
  unfold pairE
  rw [Finset.sum_sub_distrib, ← Finset.mul_sum]
  push_cast
  ring

lemma norm_site {n : ℕ} (K : Fin n → Fin n → ℝ) (κ ℓ : Fin n → ℝ) (s : ℂ) (p : Fin n) :
    ‖Complex.exp ((κ p : ℂ) - s * (ℓ p : ℂ))‖ * Real.exp (rowSum K p / 2)
      = Real.exp (κ p + rowSum K p / 2 - s.re * ℓ p) := by
  rw [Complex.norm_exp, ← Real.exp_add]
  congr 1
  simp
  ring

/-- (i), right half. -/
theorem stagePoly_ne_zero_right {n : ℕ} (K : Fin n → Fin n → ℝ) (κ ℓ : Fin n → ℝ)
    (hℓ : ∀ p, 0 < ℓ p) (hLY : LeeYangProp K) (s : ℂ)
    (hs : ∀ p, abscissa K κ ℓ p < s.re) : stagePoly K κ ℓ s ≠ 0 := by
  apply (hLY _).1
  intro p
  rw [norm_site, Real.exp_lt_one_iff]
  have h := hs p
  unfold abscissa at h
  rw [div_lt_iff₀ (hℓ p)] at h
  linarith

/-- (i), left half. -/
theorem stagePoly_ne_zero_left {n : ℕ} (K : Fin n → Fin n → ℝ) (κ ℓ : Fin n → ℝ)
    (hℓ : ∀ p, 0 < ℓ p) (hLY : LeeYangProp K) (s : ℂ)
    (hs : ∀ p, s.re < abscissa K κ ℓ p) : stagePoly K κ ℓ s ≠ 0 := by
  apply (hLY _).2
  intro p
  rw [norm_site, Real.one_lt_exp_iff]
  have h := hs p
  unfold abscissa at h
  rw [lt_div_iff₀ (hℓ p)] at h
  linarith

/-- (ii), zeros on the line `Re s = a`. -/
theorem stagePoly_zero_on_line {n : ℕ} (hn : 0 < n) (K : Fin n → Fin n → ℝ) (κ ℓ : Fin n → ℝ)
    (hℓ : ∀ p, 0 < ℓ p) (hLY : LeeYangProp K) (a : ℝ)
    (ha : ∀ p, abscissa K κ ℓ p = a) (s : ℂ) (hzero : stagePoly K κ ℓ s = 0) : s.re = a := by
  rcases lt_trichotomy s.re a with h | h | h
  · exact absurd hzero (stagePoly_ne_zero_left K κ ℓ hℓ hLY s (fun p => by rw [ha p]; exact h))
  · exact h
  · exact absurd hzero (stagePoly_ne_zero_right K κ ℓ hℓ hLY s (fun p => by rw [ha p]; exact h))

/-- (ii), self-duality.  No Lee–Yang input and no sign condition on `K`; `K` symmetric. -/
theorem stagePoly_self_dual {n : ℕ} (K : Fin n → Fin n → ℝ) (κ ℓ : Fin n → ℝ)
    (hsymm : ∀ p q, K p q = K q p) (hℓ : ∀ p, 0 < ℓ p) (a : ℝ)
    (ha : ∀ p, abscissa K κ ℓ p = a) (s : ℂ) :
    stagePoly K κ ℓ (2 * (a : ℂ) - s)
      = Complex.exp ((s - (a : ℂ)) * ((∑ p, ℓ p : ℝ) : ℂ)) * stagePoly K κ ℓ s := by
  have hκ : ∀ p, κ p = a * ℓ p - rowSum K p / 2 := by
    intro p
    have h := ha p
    unfold abscissa at h
    rw [div_eq_iff (ne_of_gt (hℓ p))] at h
    linarith
  have hκS : ∀ S : Finset (Fin n),
      ∑ p ∈ S, κ p = a * ∑ p ∈ S, ℓ p - (∑ p ∈ S, rowSum K p) / 2 := by
    intro S
    rw [Finset.mul_sum, Finset.sum_div, ← Finset.sum_sub_distrib]
    exact Finset.sum_congr rfl (fun p _ => hκ p)
  rw [stagePoly_eq, stagePoly_eq, Finset.mul_sum]
  refine Fintype.sum_bijective compl compl_bijective _ _ (fun S => ?_)
  rw [← Complex.exp_add]
  congr 1
  have hL : (∑ p, ℓ p) = ∑ p ∈ S, ℓ p + ∑ p ∈ Sᶜ, ℓ p := (Finset.sum_add_sum_compl S _).symm
  have hE := energy_balance K hsymm S
  have h1 := hκS S
  have h2 := hκS Sᶜ
  have hLc : ((∑ p, ℓ p : ℝ) : ℂ) = ((∑ p ∈ S, ℓ p : ℝ) : ℂ) + ((∑ p ∈ Sᶜ, ℓ p : ℝ) : ℂ) := by
    rw [hL]; push_cast; rfl
  have hEc : (pairE K S : ℂ) - ((∑ p ∈ S, rowSum K p : ℝ) : ℂ) / 2
      = (pairE K Sᶜ : ℂ) - ((∑ p ∈ Sᶜ, rowSum K p : ℝ) : ℂ) / 2 := by
    exact_mod_cast hE
  have h1c : ((∑ p ∈ S, κ p : ℝ) : ℂ)
      = (a : ℂ) * ((∑ p ∈ S, ℓ p : ℝ) : ℂ) - ((∑ p ∈ S, rowSum K p : ℝ) : ℂ) / 2 := by
    exact_mod_cast h1
  have h2c : ((∑ p ∈ Sᶜ, κ p : ℝ) : ℂ)
      = (a : ℂ) * ((∑ p ∈ Sᶜ, ℓ p : ℝ) : ℂ) - ((∑ p ∈ Sᶜ, rowSum K p : ℝ) : ℂ) / 2 := by
    exact_mod_cast h2
  rw [hLc]
  linear_combination h1c - h2c + hEc

/-- The Dirichlet polynomial `∑_{d | M} w(d) d^{-s}` over the divisors `d = ∏_{p ∈ S} P p` of the
squarefree `M = ∏ P p`, with `w(d) = exp(∑_{p<q, pq | d} K p q)` (fields `κ = 0`). -/
def dirichletStage {n : ℕ} (K : Fin n → Fin n → ℝ) (P : Fin n → ℕ) (s : ℂ) : ℂ :=
  ∑ S : Finset (Fin n),
    (Real.exp (∑ p ∈ S, ∑ q ∈ S, if p < q then K p q else 0) : ℂ)
      * (((∏ p ∈ S, P p : ℕ) : ℂ)) ^ (-s)

lemma natProd_cpow {n : ℕ} (P : Fin n → ℕ) (hP : ∀ p, (P p).Prime) (S : Finset (Fin n))
    (w : ℂ) :
    (((∏ p ∈ S, P p : ℕ) : ℂ)) ^ w = Complex.exp (((∑ p ∈ S, Real.log (P p) : ℝ) : ℂ) * w) := by
  have hpos : ∀ p ∈ S, (0 : ℝ) < (P p : ℝ) := fun p _ => by exact_mod_cast (hP p).pos
  have hprod : (0 : ℝ) < ∏ p ∈ S, (P p : ℝ) := Finset.prod_pos hpos
  have hcast : (((∏ p ∈ S, P p : ℕ) : ℂ)) = ((∏ p ∈ S, (P p : ℝ) : ℝ) : ℂ) := by
    push_cast; rfl
  rw [hcast, Complex.cpow_def_of_ne_zero (by exact_mod_cast ne_of_gt hprod),
    ← Complex.ofReal_log (le_of_lt hprod), Real.log_prod (fun p hp => ne_of_gt (hpos p hp))]

lemma dirichletStage_eq {n : ℕ} (K : Fin n → Fin n → ℝ) (P : Fin n → ℕ)
    (hP : ∀ p, (P p).Prime) (s : ℂ) :
    dirichletStage K P s = stagePoly K 0 (fun p => Real.log (P p)) s := by
  rw [stagePoly_eq]
  unfold dirichletStage
  apply Finset.sum_congr rfl
  intro S _
  rw [natProd_cpow P hP S, Complex.ofReal_exp, ← Complex.exp_add]
  congr 1
  unfold pairE
  simp
  ring

lemma abscissa_half {n : ℕ} (K : Fin n → Fin n → ℝ) (P : Fin n → ℕ)
    (hP : ∀ p, (P p).Prime) (hsum : ∀ p, rowSum K p = Real.log (P p)) (p : Fin n) :
    abscissa K 0 (fun p => Real.log (P p)) p = 1 / 2 := by
  have hpos : 0 < Real.log (P p) := Real.log_pos (by exact_mod_cast (hP p).one_lt)
  unfold abscissa
  rw [hsum p]
  simp only [Pi.zero_apply]
  field_simp
  ring

/-- (iii), sum rule: all zeros on the critical line. -/
theorem dirichletStage_zero_on_critical_line {n : ℕ} (hn : 0 < n)
    (K : Fin n → Fin n → ℝ) (P : Fin n → ℕ)
    (hP : ∀ p, (P p).Prime) (hinj : Function.Injective P)
    (hsymm : ∀ p q, K p q = K q p) (hnn : ∀ p q, 0 ≤ K p q)
    (hsum : ∀ p, rowSum K p = Real.log (P p))
    (hLY : LeeYangProp K) (s : ℂ) (hzero : dirichletStage K P s = 0) : s.re = 1 / 2 := by
  have hpos : ∀ p, 0 < Real.log (P p) := fun p =>
    Real.log_pos (by exact_mod_cast (hP p).one_lt)
  rw [dirichletStage_eq K P hP] at hzero
  refine stagePoly_zero_on_line hn K 0 (fun p => Real.log (P p)) hpos hLY (1 / 2)
    (fun p => abscissa_half K P hP hsum p) s hzero

/-- (iii), sum rule: functional equation `Z(1 - s) = M^{s - 1/2} Z(s)`. -/
theorem dirichletStage_functional_equation {n : ℕ}
    (K : Fin n → Fin n → ℝ) (P : Fin n → ℕ)
    (hP : ∀ p, (P p).Prime) (hinj : Function.Injective P)
    (hsymm : ∀ p q, K p q = K q p)
    (hsum : ∀ p, rowSum K p = Real.log (P p)) (s : ℂ) :
    dirichletStage K P (1 - s)
      = (((∏ p, P p : ℕ) : ℂ)) ^ (s - 1 / 2) * dirichletStage K P s := by
  have hpos : ∀ p, 0 < Real.log (P p) := fun p =>
    Real.log_pos (by exact_mod_cast (hP p).one_lt)
  rw [dirichletStage_eq K P hP, dirichletStage_eq K P hP]
  have h := stagePoly_self_dual K 0 (fun p => Real.log (P p)) hsymm hpos (1 / 2)
    (fun p => abscissa_half K P hP hsum p) s
  have e1 : (2 * ((1 / 2 : ℝ) : ℂ) - s) = 1 - s := by push_cast; ring
  rw [e1] at h
  rw [h]
  congr 1
  rw [natProd_cpow P hP Finset.univ]
  congr 1
  push_cast
  ring

end

#print axioms stagePoly_ne_zero_right
#print axioms stagePoly_ne_zero_left
#print axioms stagePoly_zero_on_line
#print axioms stagePoly_self_dual
#print axioms dirichletStage_zero_on_critical_line
#print axioms dirichletStage_functional_equation

