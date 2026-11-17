import OAI.NumberTheory.DirichletL.Hecke.Nonvanishing
import OAI.NumberTheory.DirichletL.Hecke.IdealBridge
import Mathlib.Analysis.Normed.Module.Connected
import Mathlib.Analysis.Complex.CauchyIntegral
import Mathlib.NumberTheory.LSeries.Basic
import Mathlib.NumberTheory.NumberField.DedekindZeta

namespace OAI
noncomputable section
open scoped BigOperators Classical
namespace SevenEighths.HeckeFamily

local instance instPIR : IsPrincipalIdealRing O := IsCyclotomicExtension.Rat.three_pid K

/-- The coefficient of a nonzero ideal is the residue character at any generator. -/
theorem idealCoeff_of_generator (χ : Character) {I : Ideal O} (hI : I ≠ ⊥) {a : O}
    (ha : Ideal.span {a} = I) :
    idealCoeff χ I = χ.residue (Ideal.Quotient.mk χ.modulus a) :=
  IdealCharacter.ofResidue_of_generator χ.modulus χ.residue χ.unit_trivial hI ha

theorem idealCoeff_mul (χ : Character) (I J : Ideal O) :
    idealCoeff χ (I * J) = idealCoeff χ I * idealCoeff χ J := map_mul _ I J

theorem idealCoeff_one (χ : Character) : idealCoeff χ 1 = 1 := map_one _

/-- The coefficient is nonzero exactly on ideals coprime to the modulus. -/
theorem idealCoeff_ne_zero_iff (χ : Character) {I : Ideal O} (hI : I ≠ ⊥) :
    idealCoeff χ I ≠ 0 ↔ IsCoprime I χ.modulus := by
  have hg : Ideal.span {Submodule.IsPrincipal.generator I} = I :=
    Ideal.span_singleton_generator I
  rw [idealCoeff_of_generator χ hI hg]
  have hu := IdealCharacter.isUnit_mk_iff_isCoprime χ.modulus (Submodule.IsPrincipal.generator I)
  rw [hg] at hu
  rw [← hu]
  constructor
  · intro h
    by_contra hn
    exact h (MulChar.map_nonunit χ.residue hn)
  · intro h
    exact (h.map χ.residue).ne_zero

/-- On ideals coprime to the modulus the coefficient has absolute value one. -/
theorem norm_idealCoeff_of_isCoprime (χ : Character) {I : Ideal O} (hI : I ≠ ⊥)
    (hc : IsCoprime I χ.modulus) : ‖idealCoeff χ I‖ = 1 := by
  have hg : Ideal.span {Submodule.IsPrincipal.generator I} = I :=
    Ideal.span_singleton_generator I
  rw [idealCoeff_of_generator χ hI hg]
  have hu := IdealCharacter.isUnit_mk_iff_isCoprime χ.modulus (Submodule.IsPrincipal.generator I)
  rw [hg] at hu
  obtain ⟨u, hu'⟩ := hu.mpr hc
  have : Finite (O ⧸ χ.modulus) := Ring.HasFiniteQuotients.finiteQuotient χ.modulus_ne_bot
  have hpow : u ^ Nat.card (O ⧸ χ.modulus)ˣ = 1 := pow_card_eq_one'
  have h1 : χ.residue (Ideal.Quotient.mk χ.modulus (Submodule.IsPrincipal.generator I)) ^
      Nat.card (O ⧸ χ.modulus)ˣ = 1 := by
    rw [← hu', ← map_pow, ← Units.val_pow_eq_pow_val, hpow, Units.val_one, map_one]
  exact Complex.norm_eq_one_of_pow_eq_one h1 Nat.card_pos.ne'

theorem idealTerm_summable (χ : Character) {s : ℂ} (hs : 1 < s.re) :
    Summable (idealTerm χ s) := by
  have h := (elementTerm_hasSum χ hs).summable
  have hinj : Function.Injective
      (fun I : UnrestrictedIdealReindex.NonzeroIdeal =>
        ConcretePrimeRowBridge.idealGenerator I.val) := fun I J hIJ =>
    Subtype.ext (ConcretePrimeRowBridge.idealGenerator_injective hIJ)
  have h2 := h.comp_injective hinj
  have h3 : Summable (fun I : UnrestrictedIdealReindex.NonzeroIdeal => idealTerm χ s I.val) := by
    refine h2.congr ?_
    intro I
    exact elementTerm_idealGenerator χ s I
  refine (Function.Injective.summable_iff Subtype.val_injective ?_).mp h3
  intro I hI
  have hI0 : I = 0 := by
    by_contra hne
    exact hI ⟨⟨I, hne⟩, rfl⟩
  rw [hI0]
  unfold idealTerm
  rw [map_zero, zero_div]

/-- For `Re s > 1` the OAI Hecke L-function is the sum over all ideals of
`χ(I) / N(I)^s`, as a convergent (unconditionally summable) series. -/
theorem LFunction_hasSum_ideal (χ : Character) {s : ℂ} (hs : 1 < s.re) :
    HasSum (fun I : Ideal O => idealCoeff χ I / (Ideal.absNorm I : ℂ) ^ s) (LFunction χ s) := by
  have h := (idealTerm_summable χ hs).hasSum
  rw [← LFunction_eq_ideal_tsum χ hs] at h
  exact h

/-- Dirichlet coefficients: `a_n = ∑_{N(I) = n} χ(I)`. -/
def normCoeff (χ : Character) (n : ℕ) : ℂ :=
  ∑ I ∈ (Ideal.finite_setOfPred_absNorm_eq (S := O) n).toFinset, idealCoeff χ I

/-- For `Re s > 1` the OAI Hecke L-function is the Dirichlet series `∑ a_n n^{-s}`
(Mathlib `LSeries`) with `a_n = ∑_{N(I) = n} χ(I)`. -/
theorem LFunction_eq_LSeries (χ : Character) {s : ℂ} (hs : 1 < s.re) :
    LFunction χ s = LSeries (normCoeff χ) s := by
  have h := LFunction_hasSum_ideal χ hs
  have hσ := (Equiv.sigmaFiberEquiv (fun I : Ideal O => Ideal.absNorm I)).hasSum_iff.mpr h
  have hfin : ∀ n : ℕ, Finite {I : Ideal O // Ideal.absNorm I = n} := fun n =>
    (Ideal.finite_setOfPred_absNorm_eq (S := O) n).to_subtype
  have key : HasSum (fun n : ℕ => LSeries.term (normCoeff χ) s n) (LFunction χ s) := by
    refine hσ.sigma ?_
    intro n
    have hfinn := hfin n
    let _ : Fintype {I : Ideal O // Ideal.absNorm I = n} := Fintype.ofFinite _
    have hval : LSeries.term (normCoeff χ) s n =
        ∑ c : {I : Ideal O // Ideal.absNorm I = n},
          idealCoeff χ c.val / (Ideal.absNorm c.val : ℂ) ^ s := by
      by_cases hn : n = 0
      · subst hn
        rw [LSeries.term_zero]
        symm
        apply Finset.sum_eq_zero
        intro c _
        have hc : c.val = ⊥ := Ideal.absNorm_eq_zero_iff.mp c.property
        have hz : idealCoeff χ ⊥ = 0 := idealCoeff_zero χ
        rw [hc, hz, zero_div]
      · rw [LSeries.term_of_ne_zero hn, normCoeff, Finset.sum_div]
        rw [Finset.sum_subtype _ (p := fun I : Ideal O => Ideal.absNorm I = n) (fun I => by simp)]
        apply Finset.sum_congr rfl
        intro c _
        rw [c.property]
    rw [hval]
    exact hasSum_fintype (fun c : {I : Ideal O // Ideal.absNorm I = n} =>
      idealCoeff χ c.val / (Ideal.absNorm c.val : ℂ) ^ s)
  exact key.tsum_eq.symm

/-- With modulus `⊤` every nonzero ideal has coefficient one. -/
theorem idealCoeff_of_modulus_top (χ : Character) (hM : χ.modulus = ⊤) {I : Ideal O}
    (hI : I ≠ ⊥) : idealCoeff χ I = 1 := by
  have hg : Ideal.span {Submodule.IsPrincipal.generator I} = I :=
    Ideal.span_singleton_generator I
  rw [idealCoeff_of_generator χ hI hg]
  have : Subsingleton (O ⧸ χ.modulus) := Ideal.Quotient.subsingleton_iff.mpr hM
  rw [Subsingleton.elim (Ideal.Quotient.mk χ.modulus (Submodule.IsPrincipal.generator I)) 1,
    map_one]

/-- Anchor to a Mathlib object: for modulus `⊤` and `Re s > 1` the OAI Hecke L-function is
Mathlib's Dedekind zeta function of `ℚ(ζ₃)`. -/
theorem LFunction_eq_dedekindZeta_of_modulus_top (χ : Character) (hM : χ.modulus = ⊤)
    {s : ℂ} (hs : 1 < s.re) : LFunction χ s = NumberField.dedekindZeta K s := by
  rw [LFunction_eq_LSeries χ hs, NumberField.dedekindZeta]
  apply LSeries_congr
  intro n hn
  rw [normCoeff]
  have hone : ∀ I ∈ (Ideal.finite_setOfPred_absNorm_eq (S := O) n).toFinset,
      idealCoeff χ I = 1 := by
    intro I hI
    apply idealCoeff_of_modulus_top χ hM
    rintro rfl
    have h0 : Ideal.absNorm (⊥ : Ideal O) = n := by simpa using hI
    rw [Ideal.absNorm_bot] at h0
    exact hn h0.symm
  have hcard : (Ideal.finite_setOfPred_absNorm_eq (S := O) n).toFinset.card =
      Nat.card {I : Ideal O // Ideal.absNorm I = n} := by
    rw [← Set.ncard_eq_toFinset_card {I : Ideal O | Ideal.absNorm I = n}
      (Ideal.finite_setOfPred_absNorm_eq n), ← Nat.card_coe_set_eq]
    rfl
  rw [Finset.sum_congr rfl hone, Finset.sum_const, nsmul_eq_mul, mul_one, hcard]

/-- The modulus-`⊤` character exists (so the previous theorem is not vacuous). -/
theorem exists_character_modulus_top : ∃ χ : Character, χ.modulus = ⊤ :=
  ⟨Character.ofResidue ⊤ top_ne_bot 1 (fun u => MulChar.one_apply
    (u.isUnit.map (Ideal.Quotient.mk ⊤))), rfl⟩

theorem compl_zero_one_isOpen : IsOpen ({0, 1}ᶜ : Set ℂ) :=
  (Set.toFinite {0, 1}).isClosed.isOpen_compl

theorem compl_zero_one_isPreconnected : IsPreconnected ({0, 1}ᶜ : Set ℂ) := by
  have hr : 1 < Module.rank ℝ ℂ := by
    rw [Complex.rank_real_complex]
    norm_num
  exact ((Set.toFinite ({0, 1} : Set ℂ)).countable.isPathConnected_compl_of_one_lt_rank
    hr).isConnected.isPreconnected

/-- Uniqueness: any function holomorphic on `ℂ \ {0, 1}` that agrees with the Hecke
Dirichlet series on `Re s > 1` equals the OAI `LFunction` on `ℂ \ {0, 1}`. -/
theorem LFunction_unique (χ : Character) (F : ℂ → ℂ)
    (hF : DifferentiableOn ℂ F ({0, 1}ᶜ : Set ℂ))
    (hseries : ∀ s : ℂ, 1 < s.re →
      HasSum (fun I : Ideal O => idealCoeff χ I / (Ideal.absNorm I : ℂ) ^ s) (F s)) :
    Set.EqOn F (LFunction χ) ({0, 1}ᶜ : Set ℂ) := by
  have hFa : AnalyticOnNhd ℂ F ({0, 1}ᶜ : Set ℂ) := hF.analyticOnNhd compl_zero_one_isOpen
  have hLd : DifferentiableOn ℂ (LFunction χ) ({0, 1}ᶜ : Set ℂ) := by
    intro s hs
    have hs' : s ≠ 0 ∧ s ≠ 1 := by simpa [not_or] using hs
    exact (LFunction_differentiableAt χ hs'.1 (Or.inl hs'.2)).differentiableWithinAt
  have hLa : AnalyticOnNhd ℂ (LFunction χ) ({0, 1}ᶜ : Set ℂ) :=
    hLd.analyticOnNhd compl_zero_one_isOpen
  have h2 : (2 : ℂ) ∈ ({0, 1}ᶜ : Set ℂ) := by norm_num
  refine hFa.eqOn_of_preconnected_of_eventuallyEq hLa compl_zero_one_isPreconnected h2 ?_
  have hopen : IsOpen {s : ℂ | 1 < s.re} := isOpen_lt continuous_const Complex.continuous_re
  have hmem : (2 : ℂ) ∈ {s : ℂ | 1 < s.re} := by norm_num
  filter_upwards [hopen.mem_nhds hmem] with s hs
  exact (hseries s hs).unique (LFunction_hasSum_ideal χ hs)

/-- The 7/8 nonvanishing theorem stated for any holomorphic function on `ℂ \ {0, 1}` with
the Hecke Dirichlet series on `Re s > 1`, with no reference to the OAI construction. -/
theorem ne_zero_of_hasSum_of_seven_eighths_lt_re (χ : Character) (F : ℂ → ℂ)
    (hF : DifferentiableOn ℂ F ({0, 1}ᶜ : Set ℂ))
    (hseries : ∀ s : ℂ, 1 < s.re →
      HasSum (fun I : Ideal O => idealCoeff χ I / (Ideal.absNorm I : ℂ) ^ s) (F s))
    {s : ℂ} (hs : (7 / 8 : ℝ) < s.re) (hs1 : s ≠ 1) : F s ≠ 0 := by
  have hs0 : s ≠ 0 := by
    rintro rfl
    norm_num at hs
  have hmem : s ∈ ({0, 1}ᶜ : Set ℂ) := by simp [hs0, hs1]
  rw [LFunction_unique χ F hF hseries hmem]
  exact LFunction_ne_zero_of_seven_eighths_lt_re χ hs (fun h => hs1 h.2)

end SevenEighths.HeckeFamily
end
end OAI

#print axioms OAI.SevenEighths.HeckeFamily.idealCoeff_of_generator
#print axioms OAI.SevenEighths.HeckeFamily.idealCoeff_ne_zero_iff
#print axioms OAI.SevenEighths.HeckeFamily.norm_idealCoeff_of_isCoprime
#print axioms OAI.SevenEighths.HeckeFamily.idealTerm_summable
#print axioms OAI.SevenEighths.HeckeFamily.LFunction_hasSum_ideal
#print axioms OAI.SevenEighths.HeckeFamily.LFunction_eq_LSeries
#print axioms OAI.SevenEighths.HeckeFamily.LFunction_unique
#print axioms OAI.SevenEighths.HeckeFamily.ne_zero_of_hasSum_of_seven_eighths_lt_re
#print axioms OAI.SevenEighths.HeckeFamily.LFunction_ne_zero_of_seven_eighths_lt_re
#print axioms OAI.SevenEighths.HeckeFamily.idealCoeff_of_modulus_top
#print axioms OAI.SevenEighths.HeckeFamily.LFunction_eq_dedekindZeta_of_modulus_top
#print axioms OAI.SevenEighths.HeckeFamily.exists_character_modulus_top
#print axioms OAI.SevenEighths.HeckeFamily.idealCoeff_mul
#check @OAI.SevenEighths.HeckeFamily.LFunction_eq_LSeries
#check @OAI.SevenEighths.HeckeFamily.LFunction_unique
#check @OAI.SevenEighths.HeckeFamily.LFunction_eq_dedekindZeta_of_modulus_top
#check @OAI.SevenEighths.HeckeFamily.ne_zero_of_hasSum_of_seven_eighths_lt_re
