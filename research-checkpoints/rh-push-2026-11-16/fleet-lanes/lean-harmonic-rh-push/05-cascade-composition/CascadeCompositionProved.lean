import Mathlib

/-!
# Series sections of the prime chain: composition identity and rank-one J-defect

`Nm = [[-1,-1],[1,1]]`, `M Z = 1 + (Z/2) Nm`, `J = diag(1,-1)`, `E = [[1,1],[1,1]]`,
Moebius action `T_M[e] = (M₁₁ e + M₁₂)/(M₂₁ e + M₂₂)`.
-/

open Matrix
open scoped ComplexConjugate ComplexOrder

noncomputable section

def Nm : Matrix (Fin 2) (Fin 2) ℂ := !![-1, -1; 1, 1]
def Jm : Matrix (Fin 2) (Fin 2) ℂ := !![1, 0; 0, -1]
def Em : Matrix (Fin 2) (Fin 2) ℂ := !![1, 1; 1, 1]

/-- The series section with impedance `Z`. -/
def Msec (Z : ℂ) : Matrix (Fin 2) (Fin 2) ℂ := 1 + (Z / 2) • Nm

/-- Moebius action of a 2x2 matrix. -/
def mob (M : Matrix (Fin 2) (Fin 2) ℂ) (e : ℂ) : ℂ := (M 0 0 * e + M 0 1) / (M 1 0 * e + M 1 1)

theorem Nm_sq : Nm * Nm = 0 := by
  ext i j
  fin_cases i <;> fin_cases j <;> simp [Nm, Matrix.mul_apply, Fin.sum_univ_two]

/-- (a) Composition identity. -/
theorem Msec_mul (Z₁ Z₂ : ℂ) : Msec Z₁ * Msec Z₂ = Msec (Z₁ + Z₂) := by
  unfold Msec
  rw [add_mul, mul_add, mul_add, one_mul, mul_one, one_mul, smul_mul_smul_comm, Nm_sq,
    smul_zero, add_zero, add_assoc, ← add_smul, add_div, add_comm (Z₂ / 2)]

/-- (a) Any finite chain: the ordered product of the sections is the section of the sum. -/
theorem Msec_list_prod (l : List ℂ) : (l.map Msec).prod = Msec l.sum := by
  induction l with
  | nil => simp [Msec]
  | cons a t ih => simp [List.prod_cons, List.sum_cons, ih, Msec_mul]

lemma Msec_entries (Z : ℂ) :
    Msec Z 0 0 = 1 - Z / 2 ∧ Msec Z 0 1 = -(Z / 2) ∧ Msec Z 1 0 = Z / 2 ∧
      Msec Z 1 1 = 1 + Z / 2 := by
  refine ⟨?_, ?_, ?_, ?_⟩ <;> simp [Msec, Nm] <;> ring

/-- (b) Series connection in the scattering variable. -/
theorem mob_series (Z₁ Z₂ : ℂ) (h2 : 1 + Z₂ ≠ 0) (h12 : 1 + Z₁ + Z₂ ≠ 0) :
    (1 - (Z₁ + Z₂)) / (1 + (Z₁ + Z₂)) = mob (Msec Z₁) ((1 - Z₂) / (1 + Z₂)) := by
  obtain ⟨h00, h01, h10, h11⟩ := Msec_entries Z₁
  unfold mob
  rw [h00, h01, h10, h11]
  have h12' : 1 + (Z₁ + Z₂) ≠ 0 := by rwa [← add_assoc]
  have hden : Z₁ / 2 * ((1 - Z₂) / (1 + Z₂)) + (1 + Z₁ / 2) = (1 + (Z₁ + Z₂)) / (1 + Z₂) := by
    field_simp; ring
  have hnum : (1 - Z₁ / 2) * ((1 - Z₂) / (1 + Z₂)) + -(Z₁ / 2) = (1 - (Z₁ + Z₂)) / (1 + Z₂) := by
    field_simp; ring
  rw [hden, hnum]
  field_simp

/-- (b) Short circuit: `S = T_{M(Z)}[1]`. -/
theorem mob_short (Z : ℂ) (h : 1 + Z ≠ 0) : (1 - Z) / (1 + Z) = mob (Msec Z) 1 := by
  obtain ⟨h00, h01, h10, h11⟩ := Msec_entries Z
  unfold mob
  rw [h00, h01, h10, h11]
  congr 1 <;> ring

/-- (c) Rank-one J-defect. -/
theorem J_defect (Z : ℂ) : Jm - (Msec Z)ᴴ * Jm * Msec Z = ((Z.re : ℝ) : ℂ) • Em := by
  ext i j
  fin_cases i <;> fin_cases j <;>
    simp [Msec, Nm, Jm, Em, Matrix.mul_apply, Fin.sum_univ_two, Matrix.conjTranspose_apply,
      Complex.ext_iff, Complex.conj_ofNat] <;>
    constructor <;> ring

lemma Em_posSemidef : Em.PosSemidef := by
  have h : Em = (!![1, 1; 0, 0] : Matrix (Fin 2) (Fin 2) ℂ)ᴴ * !![1, 1; 0, 0] := by
    ext i j
    fin_cases i <;> fin_cases j <;>
      simp [Em, Matrix.mul_apply, Fin.sum_univ_two, Matrix.conjTranspose_apply]
  rw [h]
  exact Matrix.posSemidef_conjTranspose_mul_self _

/-- (c) J-contractive iff `Re Z ≥ 0`. -/
theorem J_contractive_iff (Z : ℂ) :
    (Jm - (Msec Z)ᴴ * Jm * Msec Z).PosSemidef ↔ 0 ≤ Z.re := by
  rw [J_defect]
  constructor
  · intro h
    have h0 := h.diag_nonneg (i := 0)
    simp [Em] at h0
    exact h0
  · intro h
    have h' : (0 : ℂ) ≤ ((Z.re : ℝ) : ℂ) := by exact_mod_cast h
    exact Em_posSemidef.smul h'

/-- (c) J-unitary iff `Re Z = 0`. -/
theorem J_unitary_iff (Z : ℂ) : (Msec Z)ᴴ * Jm * Msec Z = Jm ↔ Z.re = 0 := by
  have hd := J_defect Z
  constructor
  · intro h
    rw [h, sub_self] at hd
    have h0 := congrFun (congrFun hd 0) 0
    simp [Em] at h0
    exact_mod_cast h0.symm
  · intro h
    rw [h] at hd
    simp at hd
    exact (sub_eq_zero.mp hd).symm

/-- (c) Scalar defect of the scattering function `S = (1 - αL)/(1 + αL)`. -/
theorem scattering_defect (α : ℝ) (L : ℂ) (h : 1 + (α : ℂ) * L ≠ 0) :
    1 - ‖(1 - (α : ℂ) * L) / (1 + (α : ℂ) * L)‖ ^ 2
      = 4 * α * L.re / ‖1 + (α : ℂ) * L‖ ^ 2 := by
  have hn : Complex.normSq (1 + (α : ℂ) * L) ≠ 0 := by
    simpa [Complex.normSq_eq_zero] using h
  rw [norm_div, div_pow, Complex.sq_norm, Complex.sq_norm]
  rw [eq_div_iff hn, sub_mul, div_mul_cancel₀ _ hn]
  simp [Complex.normSq_apply]
  ring

/-- (d) Reference change. -/
theorem reference_change (L W : ℂ) :
    ‖L - W‖ ^ 2 - ‖L + conj W‖ ^ 2 = -4 * L.re * W.re := by
  rw [Complex.sq_norm, Complex.sq_norm]
  simp [Complex.normSq_apply]
  ring

/-- (d) Power-wave scattering function is contractive iff `Re L ≥ 0`, for `Re W > 0`. -/
theorem power_wave_contractive_iff (L W : ℂ) (hW : 0 < W.re) (h : conj W + L ≠ 0) :
    ‖(W - L) / (conj W + L)‖ ≤ 1 ↔ 0 ≤ L.re := by
  have hpos : 0 < ‖conj W + L‖ := norm_pos_iff.mpr h
  rw [norm_div, div_le_one hpos]
  have key : ‖W - L‖ ^ 2 - ‖conj W + L‖ ^ 2 = -4 * L.re * W.re := by
    rw [norm_sub_rev, add_comm]
    exact reference_change L W
  rw [← abs_norm (W - L), ← abs_norm (conj W + L), ← sq_le_sq]
  constructor
  · intro hle
    by_contra hneg
    push_neg at hneg
    nlinarith [mul_pos_of_neg_of_neg hneg (neg_neg_of_pos hW)]
  · intro hL
    nlinarith [mul_nonneg hL hW.le]

end

#print axioms Nm_sq
#print axioms Msec_mul
#print axioms Msec_list_prod
#print axioms mob_series
#print axioms mob_short
#print axioms J_defect
#print axioms J_contractive_iff
#print axioms J_unitary_iff
#print axioms scattering_defect
#print axioms reference_change
#print axioms power_wave_contractive_iff
