import OAI.NumberTheory.DirichletL.Nonvanishing
import OAI.NumberTheory.DirichletL.Hecke.Nonvanishing
import OAI.NumberTheory.DirichletL.Hecke.Dirichlet
open Lean Elab Command Meta

#print axioms OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re
#print axioms OAI.DirichletCharacter.LFunction_ne_zero_of_seven_eighths_lt_re
#print axioms OAI.SevenEighths.HeckeFamily.LFunction_ne_zero_of_seven_eighths_lt_re
#print axioms OAI.SevenEighths.HeckeFamily.LFunction_ofResidue_ne_zero_of_seven_eighths_lt_re
#print axioms OAI.SevenEighths.HeckeRayFamily.LFunction_ne_zero_of_seven_eighths_lt_re
#print axioms OAI.SevenEighths.ProbeFinalAssemblyUnconditional.detector_certified_bands
-- faithfulness bridge lemmas for the OAI Hecke L-function
#print axioms OAI.SevenEighths.HeckeFamily.LFunction_eq_ideal_tsum
#print axioms OAI.SevenEighths.HeckeFamily.LFunction_differentiableAt
#print axioms OAI.SevenEighths.HeckeFamily.LFunction_entire_nonprincipal
#print axioms OAI.SevenEighths.HeckeFamily.idealCoeff_span
#print axioms OAI.SevenEighths.HeckeDirichlet.LFunction_eq_dirichlet_product

set_option pp.fullNames true in
#check @OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re
set_option pp.fullNames true in
#check @OAI.DirichletCharacter.LFunction_ne_zero_of_seven_eighths_lt_re
set_option pp.fullNames true in
#check @OAI.SevenEighths.HeckeFamily.LFunction_ne_zero_of_seven_eighths_lt_re

/-- every constant occurring in the statement, with the module that defines it -/
def stmtConsts (n : Name) : CommandElabM Unit := do
  let env ← getEnv
  let some ci := env.find? n | throwError "missing {n}"
  let cs := ci.type.getUsedConstants
  let mut out := #[]
  for c in cs do
    let m := match env.getModuleIdxFor? c with
      | some i => toString env.header.moduleNames[i.toNat]!
      | none => "<this file>"
    out := out.push s!"  {c}  @ {m}"
  logInfo m!"STATEMENT CONSTANTS of {n}:\n{"\n".intercalate out.toList}"

run_cmd stmtConsts ``OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re
run_cmd stmtConsts ``OAI.DirichletCharacter.LFunction_ne_zero_of_seven_eighths_lt_re
run_cmd stmtConsts ``OAI.SevenEighths.HeckeFamily.LFunction_ne_zero_of_seven_eighths_lt_re

-- Restatement with nothing but Mathlib names (no OAI namespace open).
example {s : ℂ} (hs : (7 / 8 : ℝ) < s.re) : _root_.riemannZeta s ≠ 0 :=
  OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re hs
example {q : ℕ} [NeZero q] (χ : _root_.DirichletCharacter ℂ q) {s : ℂ}
    (hs : (7 / 8 : ℝ) < s.re) (hpole : ¬ (χ = 1 ∧ s = 1)) :
    _root_.DirichletCharacter.LFunction χ s ≠ 0 :=
  OAI.DirichletCharacter.LFunction_ne_zero_of_seven_eighths_lt_re χ hs hpole
-- zeta agrees with the Dirichlet series (Mathlib lemma), so the object is the classical one
example {s : ℂ} (hs : 1 < s.re) : _root_.riemannZeta s = ∑' n : ℕ, 1 / ((n : ℂ) + 1) ^ s :=
  zeta_eq_tsum_one_div_nat_add_one_cpow hs
example {q : ℕ} [NeZero q] (χ : _root_.DirichletCharacter ℂ q) {s : ℂ} (hs : 1 < s.re) :
    _root_.DirichletCharacter.LFunction χ s = LSeries (fun n => χ n) s :=
  _root_.DirichletCharacter.LFunction_eq_LSeries χ hs

-- Hecke: the OAI object in Mathlib terms.
section
open OAI.SevenEighths.HeckeFamily
example : O = NumberField.RingOfIntegers (CyclotomicField 3 ℚ) := rfl
/-- Dirichlet series over nonzero ideals of Z[omega], Re s > 1 -/
example (χ : Character) {s : ℂ} (hs : 1 < s.re) :
    LFunction χ s = ∑' I : Ideal O, idealCoeff χ I / (Ideal.absNorm I : ℂ) ^ s :=
  LFunction_eq_ideal_tsum χ hs
example (χ : Character) {z : O} (hz : z ≠ 0) :
    idealCoeff χ (Ideal.span {z}) = χ.residue (Ideal.Quotient.mk χ.modulus z) :=
  idealCoeff_span χ hz
example (χ : Character) : idealCoeff χ ⊥ = 0 := idealCoeff_zero χ
example (χ : Character) (hχ : χ.residue ≠ 1) : Differentiable ℂ (LFunction χ) :=
  LFunction_entire_nonprincipal χ hχ
example (χ : Character) {s : ℂ} (h0 : s ≠ 0) (h1 : s ≠ 1) : DifferentiableAt ℂ (LFunction χ) s :=
  LFunction_differentiableAt χ h0 (Or.inl h1)
/-- every unit-trivial character of (O/M)^x, any nonzero modulus M, is in the family -/
example (M : Ideal O) (hM : M ≠ ⊥) (χ : MulChar (O ⧸ M) ℂ)
    (hu : ∀ u : Oˣ, χ (Ideal.Quotient.mk M (u : O)) = 1) :
    (Character.ofResidue M hM χ hu).residue = χ := rfl
end

-- list all modules in the transitive closure
run_cmd do
  let env ← getEnv
  let ms := env.header.moduleNames
  IO.FS.writeFile "closure-all-modules.txt" ("\n".intercalate (ms.toList.map toString) ++ "\n")
  logInfo m!"closure modules: {ms.size}"
