/-
Copyright (c) 2026 Jude Gomila. All rights reserved.
Released under Apache 2.0 license as described in the file LICENSE.
Authors: Jude Gomila
-/
import Mathlib.Analysis.Calculus.LocalExtr.Rolle
import Mathlib.Analysis.Calculus.Deriv.Polynomial
import Mathlib.Analysis.Calculus.LocalExtr.Polynomial
import Mathlib.Analysis.SpecialFunctions.ExpDeriv
import Mathlib.Analysis.SpecialFunctions.PolynomialExp
import Mathlib.Analysis.Calculus.LocalExtr.Basic
import Mathlib.Topology.Order.Compact
import Mathlib.Order.Filter.AtTopBot.Field
import Mathlib.Topology.Algebra.Polynomial
import Mathlib.Analysis.Polynomial.CauchyBound
import Mathlib.RingTheory.Polynomial.Vieta
import Mathlib.Topology.MetricSpace.Sequences
import Mathlib.Data.Nat.Choose.Sum
import Mathlib.Data.Nat.Factorial.BigOperators
import Mathlib.Analysis.Normed.Module.FiniteDimension
import Mathlib.Analysis.SpecificLimits.Basic
import Mathlib.Algebra.Module.LinearMap.End
import Mathlib.Algebra.Polynomial.BigOperators

/-!
# Preservation of real-rootedness: Hermite–Poulain and the heat operator

A real polynomial is *real-rooted* (its roots "split over `ℝ`") when the number of its
real roots, counted with multiplicity, equals its degree.  Equivalently every complex
root is real.  The class of real-rooted real polynomials is the polynomial part of the
**Laguerre–Pólya class**.

This file proves, `sorry`-free and with only the standard axioms
(`propext`, `Classical.choice`, `Quot.sound`), the classical closure properties of this
class under a family of differential operators, culminating in the polynomial case of
**de Bruijn's theorem** / the **Pólya–Schur** characterization of the multiplier `e^{-t x²}`:

* `Polynomial.hasOnlyRealRoots_derivative` — differentiation `D` preserves real-rootedness
  (a multiplicity-counting form of Rolle's theorem);
* `Polynomial.hermitePoulain_shift` — the atomic Hermite–Poulain shift `p ↦ p' + c • p`
  preserves real-rootedness, for every real `c`;
* `Polynomial.oneMinusCD2_realRooted` — the finite heat factor `1 - c • D²` (`c > 0`)
  preserves real-rootedness (via `1 - c D² = (1 + √c D)(1 - √c D)`);
* `Polynomial.hasOnlyRealRoots_of_tendsto_coeff` — real-rootedness is closed under
  coefficient-wise limits within a fixed-degree, fixed-leading-coefficient family
  (a real-variable, root-vector-compactness form of Hurwitz's theorem — no complex analysis);
* `Polynomial.heat_preserves_LP` — for `t ≥ 0` the heat operator `e^{-t D²}`
  (`Polynomial.heatOp`) preserves real-rootedness.

## Main definitions

* `Polynomial.HasOnlyRealRoots p` : `Multiset.card p.roots = p.natDegree`.  For a field `K`
  this predicate coincides with `p.Splits (RingHom.id K)`; see
  `Polynomial.splits_iff_card_roots`.
* `Polynomial.oneMinusCD2 c p` : the finite heat factor `p - c • D²p = (1 - c • D²) p`.
* `Polynomial.heatOp t p` : the heat / Laguerre–Pólya multiplier
  `e^{-t D²} p = ∑ₖ ((-t)ᵏ / k!) • D^{2k} p` (a finite sum since `D^{2k} p = 0` for `2k > deg p`).

## Implementation notes

The heat operator is realised as an honest finite polynomial map and its algebra
(additivity, homogeneity, degree/leading-coefficient preservation) is proved directly.
The passage to the limit is split into two purely real-variable ingredients:

* **coefficient bridge** (`Polynomial.oneMinusCD2_iterate_tendsto_heatOp`):
  `(1 - (t/n) • D²)ⁿ p → heatOp t p` coefficient-wise, from the operator binomial theorem
  and the `Nat.choose` asymptotic `C(n, j) (-t/n)ʲ → (-t)ʲ / j!`;
* **Hurwitz replacement** (`Polynomial.hasOnlyRealRoots_of_tendsto_coeff`): real-rootedness
  survives coefficient limits, proved by bounding the roots uniformly (Cauchy's bound),
  extracting a convergent subsequence of root vectors (Bolzano–Weierstrass) and using
  continuity of the Vieta map.

## References

* G. Pólya and J. Schur, *Über zwei Arten von Faktorenfolgen in der Theorie der
  algebraischen Gleichungen*, J. Reine Angew. Math. **144** (1914), 89–113.
* N. G. de Bruijn, *The roots of trigonometric integrals*, Duke Math. J. **17** (1950), 197–226.
* N. Obreschkoff, *Verteilung und Berechnung der Nullstellen reeller Polynome*, VEB, 1963
  (Hermite–Poulain theorem).
* Q. I. Rahman and G. Schmeisser, *Analytic Theory of Polynomials*, Oxford, 2002, Thm 5.4.4.

## Tags

polynomial, real roots, real-rooted, Laguerre–Pólya, Hermite–Poulain, Pólya–Schur,
de Bruijn, heat operator, Rolle, Hurwitz
-/

open scoped Polynomial

namespace Polynomial

/-! ## Root interlacing (Rolle for polynomials, with a root strictly between) -/

/-- **Rolle for polynomials.**  If a real polynomial `p` vanishes at two distinct points
`a < b`, then its formal derivative vanishes at some strictly interior point `c ∈ (a, b)`.
This upgrades the mean value theorem (`exists_deriv_eq_zero`) through the
polynomial-derivative identity `Polynomial.deriv`. -/
theorem derivative_hasRoot_between {p : ℝ[X]} {a b : ℝ}
    (hab : a < b) (ha : p.eval a = 0) (hb : p.eval b = 0) :
    ∃ c, a < c ∧ c < b ∧ (Polynomial.derivative p).eval c = 0 := by
  obtain ⟨c, hc, hc0⟩ :=
    exists_deriv_eq_zero hab p.continuousOn (ha.trans hb.symm)
  refine ⟨c, hc.1, hc.2, ?_⟩
  rwa [p.deriv] at hc0

/-- Between any two real roots `a < b` of `p`, the derivative `p.derivative` has a real
root.  This is the atomic step underlying root-count interlacing. -/
theorem exists_derivative_root_of_two_roots {p : ℝ[X]} {a b : ℝ}
    (hab : a < b) (ha : p.IsRoot a) (hb : p.IsRoot b) :
    ∃ c, a < c ∧ c < b ∧ (Polynomial.derivative p).IsRoot c :=
  derivative_hasRoot_between hab ha hb

/-! ## Real-rootedness and its closure under differentiation -/

/-- **Real-rootedness predicate.**  `p.HasOnlyRealRoots` says the real polynomial `p`
"has only real roots" (splits over `ℝ`): the number of its real roots, counted with
multiplicity, equals its degree.  For a field `K`, `p.roots.card = p.natDegree` is
equivalent to `p.Splits (RingHom.id K)` (`Polynomial.splits_iff_card_roots`), so this is
the ℝ-specialization of the "splits over the base field" predicate. -/
def HasOnlyRealRoots (p : ℝ[X]) : Prop :=
  Multiset.card p.roots = p.natDegree

/-- **Differentiation preserves real-rootedness.**  The derivative of a real-rooted real
polynomial is real-rooted, roots counted with multiplicity.

Proof: combine `Polynomial.card_roots'` (`card p'.roots ≤ p'.natDegree`),
`Polynomial.card_roots_le_derivative` (Rolle, with multiplicity:
`card p.roots ≤ card p'.roots + 1`) and `Polynomial.natDegree_derivative_le`
(`p'.natDegree ≤ p.natDegree - 1`); with `card p.roots = p.natDegree`, linear arithmetic
over `ℕ` forces `card p'.roots = p'.natDegree`. -/
theorem hasOnlyRealRoots_derivative {p : ℝ[X]} (hp : HasOnlyRealRoots p) :
    HasOnlyRealRoots (Polynomial.derivative p) := by
  have h1 : Multiset.card (Polynomial.derivative p).roots ≤ (Polynomial.derivative p).natDegree :=
    Polynomial.card_roots' _
  have h2 : Multiset.card p.roots ≤ Multiset.card (Polynomial.derivative p).roots + 1 :=
    Polynomial.card_roots_le_derivative p
  have h3 : (Polynomial.derivative p).natDegree ≤ p.natDegree - 1 :=
    Polynomial.natDegree_derivative_le p
  unfold HasOnlyRealRoots at hp ⊢
  omega

/-- **Iterated differentiation preserves real-rootedness.**  Every formal derivative
`D^n p` of a real-rooted real polynomial is real-rooted. -/
theorem hasOnlyRealRoots_iterate_derivative {p : ℝ[X]} (hp : HasOnlyRealRoots p) :
    ∀ n : ℕ, HasOnlyRealRoots (Polynomial.derivative^[n] p)
  | 0 => hp
  | n + 1 => by
      rw [Function.iterate_succ', Function.comp_apply]
      exact hasOnlyRealRoots_derivative (hasOnlyRealRoots_iterate_derivative hp n)

/-! ## The Hermite–Poulain shift `p ↦ p' + c • p`

The device throughout is the real function `g x = e^{c x} · p x`, whose derivative is
`g' x = e^{c x} · (p' + c • p) x`.  Since `e^{c x} > 0`, the real zeros of the shifted
polynomial `q := p' + c • p` are exactly the zeros of `g'`. -/

/-- **Shifted-root interlacing.**  Between any two distinct real roots `a < b` of `p`, the
shifted polynomial `p' + c • p` has a real root.  The exponential factor `e^{c x}` (not a
polynomial) is handled by the analytic Rolle theorem `exists_deriv_eq_zero` applied to
`g x = e^{c x} · p x`; because `e^{c x} ≠ 0`, a zero of `g'` forces a zero of `p' + c • p`. -/
theorem exists_shifted_root_between (c : ℝ) {p : ℝ[X]} {a b : ℝ}
    (hab : a < b) (ha : p.eval a = 0) (hb : p.eval b = 0) :
    ∃ z, a < z ∧ z < b ∧ (Polynomial.derivative p + c • p).eval z = 0 := by
  have hcont : ContinuousOn (fun x => Real.exp (c * x) * p.eval x) (Set.Icc a b) :=
    ((Real.continuous_exp.comp (continuous_const.mul continuous_id)).mul p.continuous).continuousOn
  have hI : (fun x => Real.exp (c * x) * p.eval x) a
      = (fun x => Real.exp (c * x) * p.eval x) b := by simp [ha, hb]
  obtain ⟨z, hz, hz0⟩ := exists_deriv_eq_zero hab hcont hI
  refine ⟨z, hz.1, hz.2, ?_⟩
  have h1 : HasDerivAt (fun x : ℝ => Real.exp (c * x)) (Real.exp (c * z) * c) z := by
    simpa using ((hasDerivAt_id z).const_mul c).exp
  have h2 : HasDerivAt (fun x => p.eval x) ((Polynomial.derivative p).eval z) z := p.hasDerivAt z
  have hval : Real.exp (c * z) * c * p.eval z + Real.exp (c * z) * (Polynomial.derivative p).eval z
      = Real.exp (c * z) * (Polynomial.derivative p + c • p).eval z := by
    rw [Polynomial.eval_add, Polynomial.eval_smul, smul_eq_mul]; ring
  have hd : HasDerivAt (fun x => Real.exp (c * x) * p.eval x)
      (Real.exp (c * z) * (Polynomial.derivative p + c • p).eval z) z := hval ▸ h1.mul h2
  rw [hd.deriv] at hz0
  rcases mul_eq_zero.mp hz0 with h | h
  · exact absurd h (Real.exp_ne_zero _)
  · exact h

open Filter Topology in
/-- **Root below the least root, case `c > 0`.**  If `a` is a root of `p` below which `p` has
no roots, then `q := p' + c • p` has a root strictly below `a`.

For `c > 0` the function `g x = e^{c x} · p x` decays to `0` at `-∞` while being nonzero just
left of `a` and zero at `a`, so on a suitable interval `g` attains an interior extremum
`ξ`, where Fermat's theorem gives `g' ξ = 0`, i.e. `q ξ = 0`. -/
theorem exists_shifted_root_atBot {c : ℝ} (hc : 0 < c) {p : ℝ[X]} {a : ℝ}
    (ha : p.eval a = 0) (hmin : ∀ x : ℝ, x < a → p.eval x ≠ 0) :
    ∃ z, z < a ∧ (Polynomial.derivative p + c • p).eval z = 0 := by
  classical
  set g : ℝ → ℝ := fun x => Real.exp (c * x) * p.eval x with hgdef
  have hcont : Continuous g :=
    (Real.continuous_exp.comp (continuous_const.mul continuous_id)).mul p.continuous
  have hderiv : ∀ x : ℝ,
      HasDerivAt g (Real.exp (c * x) * (Polynomial.derivative p + c • p).eval x) x := by
    intro x
    have h1 : HasDerivAt (fun x : ℝ => Real.exp (c * x)) (Real.exp (c * x) * c) x := by
      simpa using ((hasDerivAt_id x).const_mul c).exp
    have h2 : HasDerivAt (fun x => p.eval x) ((Polynomial.derivative p).eval x) x := p.hasDerivAt x
    have hval : Real.exp (c * x) * c * p.eval x + Real.exp (c * x) * (Polynomial.derivative p).eval x
        = Real.exp (c * x) * (Polynomial.derivative p + c • p).eval x := by
      rw [Polynomial.eval_add, Polynomial.eval_smul, smul_eq_mul]; ring
    exact hval ▸ h1.mul h2
  have hcne : c ≠ 0 := ne_of_gt hc
  have hlim : Tendsto g atBot (𝓝 0) := by
    have hφ : Tendsto (fun x : ℝ => -c * x) atBot atTop :=
      (tendsto_const_mul_atTop_of_neg (by linarith : -c < 0)).mpr tendsto_id
    have hcomp := (Polynomial.tendsto_div_exp_atTop
        (p.comp (Polynomial.C (-c⁻¹) * Polynomial.X))).comp hφ
    refine hcomp.congr (fun x => ?_)
    simp only [Function.comp_apply, Polynomial.eval_comp, Polynomial.eval_mul,
      Polynomial.eval_C, Polynomial.eval_X]
    have hxx : -c⁻¹ * (-c * x) = x := by field_simp
    rw [hxx, hgdef, show -c * x = -(c * x) by ring, Real.exp_neg, div_inv_eq_mul, mul_comm]
  have ha0 : g a = 0 := by simp [hgdef, ha]
  have hx0 : g (a - 1) ≠ 0 := by
    have hp1 : p.eval (a - 1) ≠ 0 := hmin _ (by linarith)
    exact mul_ne_zero (Real.exp_ne_zero _) hp1
  rcases lt_or_gt_of_ne hx0 with hlt | hgt
  · -- `g (a-1) < 0`: `g` has an interior minimum
    have hev : (g ⁻¹' Set.Ioi (g (a - 1))) ∈ atBot := hlim (Ioi_mem_nhds hlt)
    obtain ⟨N, hN⟩ := eventually_atBot.1 hev
    set b : ℝ := min N (a - 2) with hbdef
    have hbN : b ≤ N := min_le_left _ _
    have hba2 : b ≤ a - 2 := min_le_right _ _
    have hba : b < a := by linarith
    have hgb : g (a - 1) < g b := hN b hbN
    have hmem1 : a - 1 ∈ Set.Icc b a := ⟨by linarith, by linarith⟩
    obtain ⟨ξ, hξmem, hξmin⟩ :=
      isCompact_Icc.exists_isMinOn (Set.nonempty_Icc.2 hba.le) hcont.continuousOn
    have hle1 : g ξ ≤ g (a - 1) := hξmin hmem1
    have hlea : g ξ ≤ g a := hξmin ⟨by linarith, le_refl a⟩
    have hleb : g ξ ≤ g b := hξmin ⟨le_refl b, hba.le⟩
    have hξa : ξ ≠ a := fun h => by rw [h, ha0] at hle1; linarith
    have hξb : ξ ≠ b := fun h => by rw [h] at hle1; linarith
    have hξIoo : ξ ∈ Set.Ioo b a :=
      ⟨lt_of_le_of_ne hξmem.1 (fun h => hξb h.symm), lt_of_le_of_ne hξmem.2 hξa⟩
    have hloc : IsLocalMin g ξ := hξmin.isLocalMin (Icc_mem_nhds hξIoo.1 hξIoo.2)
    have hd0 : Real.exp (c * ξ) * (Polynomial.derivative p + c • p).eval ξ = 0 :=
      hloc.hasDerivAt_eq_zero (hderiv ξ)
    exact ⟨ξ, hξIoo.2, (mul_eq_zero.1 hd0).resolve_left (Real.exp_ne_zero _)⟩
  · -- `g (a-1) > 0`: `g` has an interior maximum
    have hev : (g ⁻¹' Set.Iio (g (a - 1))) ∈ atBot := hlim (Iio_mem_nhds hgt)
    obtain ⟨N, hN⟩ := eventually_atBot.1 hev
    set b : ℝ := min N (a - 2) with hbdef
    have hbN : b ≤ N := min_le_left _ _
    have hba2 : b ≤ a - 2 := min_le_right _ _
    have hba : b < a := by linarith
    have hgb : g b < g (a - 1) := hN b hbN
    have hmem1 : a - 1 ∈ Set.Icc b a := ⟨by linarith, by linarith⟩
    obtain ⟨ξ, hξmem, hξmax⟩ :=
      isCompact_Icc.exists_isMaxOn (Set.nonempty_Icc.2 hba.le) hcont.continuousOn
    have hge1 : g (a - 1) ≤ g ξ := hξmax hmem1
    have hgea : g a ≤ g ξ := hξmax ⟨by linarith, le_refl a⟩
    have hgeb : g b ≤ g ξ := hξmax ⟨le_refl b, hba.le⟩
    have hξa : ξ ≠ a := fun h => by rw [h, ha0] at hge1; linarith
    have hξb : ξ ≠ b := fun h => by rw [h] at hge1; linarith
    have hξIoo : ξ ∈ Set.Ioo b a :=
      ⟨lt_of_le_of_ne hξmem.1 (fun h => hξb h.symm), lt_of_le_of_ne hξmem.2 hξa⟩
    have hloc : IsLocalMax g ξ := hξmax.isLocalMax (Icc_mem_nhds hξIoo.1 hξIoo.2)
    have hd0 : Real.exp (c * ξ) * (Polynomial.derivative p + c • p).eval ξ = 0 :=
      hloc.hasDerivAt_eq_zero (hderiv ξ)
    exact ⟨ξ, hξIoo.2, (mul_eq_zero.1 hd0).resolve_left (Real.exp_ne_zero _)⟩

open Filter Topology in
/-- **Root above the greatest root, case `c < 0`.**  Mirror of `exists_shifted_root_atBot`:
if `a` is a root of `p` above which `p` has no roots, then `q := p' + c • p` has a root
strictly above `a`.  Now `g x = e^{c x} · p x → 0` at `+∞` (as `c < 0`). -/
theorem exists_shifted_root_atTop {c : ℝ} (hc : c < 0) {p : ℝ[X]} {a : ℝ}
    (ha : p.eval a = 0) (hmax : ∀ x : ℝ, a < x → p.eval x ≠ 0) :
    ∃ z, a < z ∧ (Polynomial.derivative p + c • p).eval z = 0 := by
  classical
  set g : ℝ → ℝ := fun x => Real.exp (c * x) * p.eval x with hgdef
  have hcont : Continuous g :=
    (Real.continuous_exp.comp (continuous_const.mul continuous_id)).mul p.continuous
  have hderiv : ∀ x : ℝ,
      HasDerivAt g (Real.exp (c * x) * (Polynomial.derivative p + c • p).eval x) x := by
    intro x
    have h1 : HasDerivAt (fun x : ℝ => Real.exp (c * x)) (Real.exp (c * x) * c) x := by
      simpa using ((hasDerivAt_id x).const_mul c).exp
    have h2 : HasDerivAt (fun x => p.eval x) ((Polynomial.derivative p).eval x) x := p.hasDerivAt x
    have hval : Real.exp (c * x) * c * p.eval x + Real.exp (c * x) * (Polynomial.derivative p).eval x
        = Real.exp (c * x) * (Polynomial.derivative p + c • p).eval x := by
      rw [Polynomial.eval_add, Polynomial.eval_smul, smul_eq_mul]; ring
    exact hval ▸ h1.mul h2
  have hcne : c ≠ 0 := ne_of_lt hc
  have hlim : Tendsto g atTop (𝓝 0) := by
    have hφ : Tendsto (fun x : ℝ => -c * x) atTop atTop :=
      Tendsto.const_mul_atTop (by linarith : 0 < -c) tendsto_id
    have hcomp := (Polynomial.tendsto_div_exp_atTop
        (p.comp (Polynomial.C (-c⁻¹) * Polynomial.X))).comp hφ
    refine hcomp.congr (fun x => ?_)
    simp only [Function.comp_apply, Polynomial.eval_comp, Polynomial.eval_mul,
      Polynomial.eval_C, Polynomial.eval_X]
    have hxx : -c⁻¹ * (-c * x) = x := by field_simp
    rw [hxx, hgdef, show -c * x = -(c * x) by ring, Real.exp_neg, div_inv_eq_mul, mul_comm]
  have ha0 : g a = 0 := by simp [hgdef, ha]
  have hx0 : g (a + 1) ≠ 0 := by
    have hp1 : p.eval (a + 1) ≠ 0 := hmax _ (by linarith)
    exact mul_ne_zero (Real.exp_ne_zero _) hp1
  rcases lt_or_gt_of_ne hx0 with hlt | hgt
  · -- `g (a+1) < 0`: interior minimum on `[a, b]`
    have hev : (g ⁻¹' Set.Ioi (g (a + 1))) ∈ atTop := hlim (Ioi_mem_nhds hlt)
    obtain ⟨N, hN⟩ := eventually_atTop.1 hev
    set b : ℝ := max N (a + 2) with hbdef
    have hbN : N ≤ b := le_max_left _ _
    have hba2 : a + 2 ≤ b := le_max_right _ _
    have hba : a < b := by linarith
    have hgb : g (a + 1) < g b := hN b hbN
    have hmem1 : a + 1 ∈ Set.Icc a b := ⟨by linarith, by linarith⟩
    obtain ⟨ξ, hξmem, hξmin⟩ :=
      isCompact_Icc.exists_isMinOn (Set.nonempty_Icc.2 hba.le) hcont.continuousOn
    have hle1 : g ξ ≤ g (a + 1) := hξmin hmem1
    have hlea : g ξ ≤ g a := hξmin ⟨le_refl a, hba.le⟩
    have hleb : g ξ ≤ g b := hξmin ⟨hba.le, le_refl b⟩
    have hξa : ξ ≠ a := fun h => by rw [h, ha0] at hle1; linarith
    have hξb : ξ ≠ b := fun h => by rw [h] at hle1; linarith
    have hξIoo : ξ ∈ Set.Ioo a b :=
      ⟨lt_of_le_of_ne hξmem.1 (fun h => hξa h.symm), lt_of_le_of_ne hξmem.2 hξb⟩
    have hloc : IsLocalMin g ξ := hξmin.isLocalMin (Icc_mem_nhds hξIoo.1 hξIoo.2)
    have hd0 : Real.exp (c * ξ) * (Polynomial.derivative p + c • p).eval ξ = 0 :=
      hloc.hasDerivAt_eq_zero (hderiv ξ)
    exact ⟨ξ, hξIoo.1, (mul_eq_zero.1 hd0).resolve_left (Real.exp_ne_zero _)⟩
  · -- `g (a+1) > 0`: interior maximum on `[a, b]`
    have hev : (g ⁻¹' Set.Iio (g (a + 1))) ∈ atTop := hlim (Iio_mem_nhds hgt)
    obtain ⟨N, hN⟩ := eventually_atTop.1 hev
    set b : ℝ := max N (a + 2) with hbdef
    have hbN : N ≤ b := le_max_left _ _
    have hba2 : a + 2 ≤ b := le_max_right _ _
    have hba : a < b := by linarith
    have hgb : g b < g (a + 1) := hN b hbN
    have hmem1 : a + 1 ∈ Set.Icc a b := ⟨by linarith, by linarith⟩
    obtain ⟨ξ, hξmem, hξmax⟩ :=
      isCompact_Icc.exists_isMaxOn (Set.nonempty_Icc.2 hba.le) hcont.continuousOn
    have hge1 : g (a + 1) ≤ g ξ := hξmax hmem1
    have hgea : g a ≤ g ξ := hξmax ⟨le_refl a, hba.le⟩
    have hgeb : g b ≤ g ξ := hξmax ⟨hba.le, le_refl b⟩
    have hξa : ξ ≠ a := fun h => by rw [h, ha0] at hge1; linarith
    have hξb : ξ ≠ b := fun h => by rw [h] at hge1; linarith
    have hξIoo : ξ ∈ Set.Ioo a b :=
      ⟨lt_of_le_of_ne hξmem.1 (fun h => hξa h.symm), lt_of_le_of_ne hξmem.2 hξb⟩
    have hloc : IsLocalMax g ξ := hξmax.isLocalMax (Icc_mem_nhds hξIoo.1 hξIoo.2)
    have hd0 : Real.exp (c * ξ) * (Polynomial.derivative p + c • p).eval ξ = 0 :=
      hloc.hasDerivAt_eq_zero (hderiv ξ)
    exact ⟨ξ, hξIoo.1, (mul_eq_zero.1 hd0).resolve_left (Real.exp_ne_zero _)⟩

open Finset in
/-- **Root-count lower bound for the Hermite–Poulain shift.**  For a real-rooted `p ≠ 0` and
`c ≠ 0`, the shifted polynomial `q := p' + c • p` has at least `natDegree p` real roots
counted with multiplicity.

This mirrors `Polynomial.card_roots_le_derivative` but *without* its `+ 1`: the extra root
"at infinity" (`exists_shifted_root_atBot` for `c > 0`, `exists_shifted_root_atTop` for
`c < 0`) supplies the missing `n`-th root beyond the extreme root of `p`.  Inherited
multiplicities come from `rootMultiplicity_sub_one_le_derivative_rootMultiplicity` and
`rootMultiplicity_add`; distinct interior roots from `exists_shifted_root_between`; the
`Finset` bookkeeping from `Finset.card_le_diff_of_interleaved`. -/
theorem hermitePoulain_card_lower {c : ℝ} (hc : c ≠ 0) {p : ℝ[X]}
    (hp : HasOnlyRealRoots p) (hp0 : p ≠ 0) :
    p.natDegree ≤ Multiset.card (Polynomial.derivative p + c • p).roots := by
  classical
  set q : ℝ[X] := Polynomial.derivative p + c • p with hqdef
  -- `q ≠ 0`: its `natDegree p`-coefficient is `c * leadingCoeff p ≠ 0`.
  have hq0 : q ≠ 0 := by
    have hpd : (Polynomial.derivative p).coeff p.natDegree = 0 := by
      rcases Nat.eq_zero_or_pos p.natDegree with h0 | hpos
      · rw [Polynomial.derivative_of_natDegree_zero h0, Polynomial.coeff_zero]
      · exact Polynomial.coeff_eq_zero_of_natDegree_lt
          (lt_of_le_of_lt (Polynomial.natDegree_derivative_le p) (by omega))
    have hcoeff : q.coeff p.natDegree = c * p.leadingCoeff := by
      rw [hqdef, Polynomial.coeff_add, hpd, Polynomial.coeff_smul, smul_eq_mul, zero_add]
      rfl
    intro h
    rw [h, Polynomial.coeff_zero] at hcoeff
    exact (mul_ne_zero hc (Polynomial.leadingCoeff_ne_zero.2 hp0)) hcoeff.symm
  -- Inherited-multiplicity bound.
  have hmult : ∀ x : ℝ, p.rootMultiplicity x - 1 ≤ q.rootMultiplicity x := by
    intro x
    have h1 : p.rootMultiplicity x - 1 ≤ (Polynomial.derivative p).rootMultiplicity x :=
      Polynomial.rootMultiplicity_sub_one_le_derivative_rootMultiplicity p x
    have h2 : (c • p).rootMultiplicity x = p.rootMultiplicity x := by
      rw [← Polynomial.count_roots, ← Polynomial.count_roots, Polynomial.roots_smul_nonzero p hc]
    have h3 : min ((Polynomial.derivative p).rootMultiplicity x) ((c • p).rootMultiplicity x)
        ≤ q.rootMultiplicity x := Polynomial.rootMultiplicity_add x hq0
    have h4 : p.rootMultiplicity x - 1 ≤ min ((Polynomial.derivative p).rootMultiplicity x)
        ((c • p).rootMultiplicity x) := le_min h1 (by rw [h2]; omega)
    exact h4.trans h3
  -- Distinct-roots bound: `s.card ≤ (t \ s).card`.
  set s : Finset ℝ := p.roots.toFinset with hsdef
  set t : Finset ℝ := q.roots.toFinset with htdef
  -- interior interleaving (both orientations, from `exists_shifted_root_between`).
  have hmemt : ∀ z : ℝ, q.eval z = 0 → z ∈ t := by
    intro z hz; rw [htdef, Multiset.mem_toFinset, Polynomial.mem_roots hq0]; exact hz
  have hmems : ∀ {x : ℝ}, x ∈ s → p.eval x = 0 := by
    intro x hx; rw [hsdef, Multiset.mem_toFinset, Polynomial.mem_roots hp0] at hx; exact hx
  have hinterior : ∀ x ∈ s, ∀ y ∈ s, x < y → ∃ z ∈ t, x < z ∧ z < y := by
    intro x hx y hy hxy
    obtain ⟨z, hz1, hz2, hz3⟩ := exists_shifted_root_between c hxy (hmems hx) (hmems hy)
    exact ⟨z, hmemt z hz3, hz1, hz2⟩
  have hkey : s.card ≤ (t \ s).card := by
    -- The interior `k-1` roots plus the root at infinity give `k` roots of `q` off `s`.
    rcases s.eq_empty_or_nonempty with hsempty | hsne
    · simp [hsempty]
    · -- `s` is nonempty; pick the extreme root and the root beyond it.
      rcases lt_or_gt_of_ne hc with hcneg | hcpos
      · -- `c < 0`: the extra root sits *above* `max s`.
        set a : ℝ := s.max' hsne with hadef
        have hamem : a ∈ s := s.max'_mem hsne
        have hale : ∀ x ∈ s, x ≤ a := fun x hx => s.le_max' x hx
        obtain ⟨w, haw, hwq⟩ :=
          exists_shifted_root_atTop hcneg (hmems hamem)
            (fun x hax hpx => by
              have : x ≤ a := hale x (by
                rw [hsdef, Multiset.mem_toFinset, Polynomial.mem_roots hp0]; exact hpx)
              linarith)
        have hwt : w ∈ t := hmemt w hwq
        have hws : w ∉ s := fun h => by have := hale w h; linarith
        -- an auxiliary point above everything in `t`, off `t`.
        obtain ⟨u, huw, hut⟩ : ∃ u : ℝ, w < u ∧ ∀ z ∈ t, z < u := by
          refine ⟨(insert w t).max' ⟨w, mem_insert_self _ _⟩ + 1, ?_, fun z hz => ?_⟩
          · have := (insert w t).le_max' w (mem_insert_self _ _); linarith
          · have := (insert w t).le_max' z (mem_insert_of_mem hz); linarith
        have hus : u ∉ s := fun h => by have := hale u h; linarith
        have hut' : u ∉ t := fun h => lt_irrefl u (hut u h)
        have hinter' : ∀ x ∈ insert u s, ∀ y ∈ insert u s, x < y →
            (∀ z ∈ insert u s, z ∉ Set.Ioo x y) → ∃ z ∈ t, x < z ∧ z < y := by
          intro x hx y hy hxy _
          rcases mem_insert.1 hx with hxu | hxs
          · -- `x = u` is the maximum, so `x < y` is impossible.
            subst hxu
            rcases mem_insert.1 hy with hyu | hys
            · exact absurd (hyu ▸ hxy) (lt_irrefl _)
            · exact absurd (lt_trans hxy (lt_of_le_of_lt (hale y hys) (lt_trans haw huw))) (by
                have := hale y hys; linarith)
          · rcases mem_insert.1 hy with hyu | hys
            · -- `y = u`: use the root `w` with `x < w < u`.
              subst hyu
              refine ⟨w, hwt, ?_, huw⟩
              exact lt_of_le_of_lt (hale x hxs) haw
            · exact hinterior x hxs y hys hxy
        have hcard := Finset.card_le_diff_of_interleaved hinter'
        rw [Finset.card_insert_of_notMem hus, Finset.sdiff_insert,
          Finset.erase_eq_of_notMem (by simp [hut']), Nat.add_le_add_iff_right] at hcard
        exact hcard
      · -- `c > 0`: the extra root sits *below* `min s`.
        set a : ℝ := s.min' hsne with hadef
        have hamem : a ∈ s := s.min'_mem hsne
        have hage : ∀ x ∈ s, a ≤ x := fun x hx => s.min'_le x hx
        obtain ⟨w, hwa, hwq⟩ :=
          exists_shifted_root_atBot hcpos (hmems hamem)
            (fun x hxa hpx => by
              have : a ≤ x := hage x (by
                rw [hsdef, Multiset.mem_toFinset, Polynomial.mem_roots hp0]; exact hpx)
              linarith)
        have hwt : w ∈ t := hmemt w hwq
        have hws : w ∉ s := fun h => by have := hage w h; linarith
        obtain ⟨u, huw, hut⟩ : ∃ u : ℝ, u < w ∧ ∀ z ∈ t, u < z := by
          refine ⟨(insert w t).min' ⟨w, mem_insert_self _ _⟩ - 1, ?_, fun z hz => ?_⟩
          · have := (insert w t).min'_le w (mem_insert_self _ _); linarith
          · have := (insert w t).min'_le z (mem_insert_of_mem hz); linarith
        have hus : u ∉ s := fun h => by have := hage u h; linarith
        have hut' : u ∉ t := fun h => lt_irrefl u (hut u h)
        have hinter' : ∀ x ∈ insert u s, ∀ y ∈ insert u s, x < y →
            (∀ z ∈ insert u s, z ∉ Set.Ioo x y) → ∃ z ∈ t, x < z ∧ z < y := by
          intro x hx y hy hxy _
          rcases mem_insert.1 hx with hxu | hxs
          · -- `x = u` is the minimum: use the root `w` with `u < w < y`.
            subst hxu
            rcases mem_insert.1 hy with hyu | hys
            · exact absurd (hyu ▸ hxy) (lt_irrefl _)
            · refine ⟨w, hwt, huw, ?_⟩
              exact lt_of_lt_of_le hwa (hage y hys)
          · rcases mem_insert.1 hy with hyu | hys
            · -- `y = u` is the minimum, so `x < y` is impossible.
              subst hyu
              exact absurd (lt_trans (lt_of_lt_of_le (lt_trans huw hwa) (hage x hxs)) hxy)
                (lt_irrefl _)
            · exact hinterior x hxs y hys hxy
        have hcard := Finset.card_le_diff_of_interleaved hinter'
        rw [Finset.card_insert_of_notMem hus, Finset.sdiff_insert,
          Finset.erase_eq_of_notMem (by simp [hut']), Nat.add_le_add_iff_right] at hcard
        exact hcard
  -- Final assembly: `card p.roots = ∑ (rootMult p - 1) + s.card ≤ card q.roots`.
  have hsum_p : Multiset.card p.roots = (∑ x ∈ s, (p.rootMultiplicity x - 1)) + s.card := by
    rw [hsdef]
    conv_lhs => rw [← Multiset.toFinset_sum_count_eq p.roots]
    rw [Finset.card_eq_sum_ones, ← Finset.sum_add_distrib]
    refine Finset.sum_congr rfl (fun x hx => ?_)
    rw [Polynomial.count_roots]
    have : 1 ≤ p.rootMultiplicity x := by
      rw [← Polynomial.count_roots]
      exact Multiset.one_le_count_iff_mem.2 (Multiset.mem_toFinset.1 hx)
    omega
  have hDcard : (t \ s).card ≤ ∑ x ∈ t \ s, q.rootMultiplicity x := by
    rw [Finset.card_eq_sum_ones]
    refine Finset.sum_le_sum (fun x hx => ?_)
    rw [← Polynomial.count_roots]
    exact Multiset.one_le_count_iff_mem.2 (Multiset.mem_toFinset.1 (Finset.mem_sdiff.1 hx).1)
  have hcard_q : Multiset.card q.roots = ∑ x ∈ t, q.rootMultiplicity x := by
    rw [htdef, ← Multiset.toFinset_sum_count_eq q.roots]
    exact Finset.sum_congr rfl (fun x _ => Polynomial.count_roots q)
  have hunion : ∑ x ∈ s ∪ t, q.rootMultiplicity x = ∑ x ∈ t, q.rootMultiplicity x :=
    (Finset.sum_subset Finset.subset_union_right (fun x _ hx =>
      Polynomial.rootMultiplicity_eq_zero (fun hroot => hx (hmemt x hroot)))).symm
  have hsplit : (∑ x ∈ s, q.rootMultiplicity x) + (∑ x ∈ t \ s, q.rootMultiplicity x)
      = Multiset.card q.roots := by
    rw [← Finset.sum_union Finset.disjoint_sdiff, Finset.union_sdiff_self_eq_union, hunion,
      hcard_q]
  have hfinal : Multiset.card p.roots ≤ Multiset.card q.roots := by
    rw [hsum_p, ← hsplit]
    have hle1 : (∑ x ∈ s, (p.rootMultiplicity x - 1)) ≤ ∑ x ∈ s, q.rootMultiplicity x :=
      Finset.sum_le_sum (fun x _ => hmult x)
    calc (∑ x ∈ s, (p.rootMultiplicity x - 1)) + s.card
        ≤ (∑ x ∈ s, q.rootMultiplicity x) + s.card := by omega
      _ ≤ (∑ x ∈ s, q.rootMultiplicity x) + (t \ s).card := by omega
      _ ≤ (∑ x ∈ s, q.rootMultiplicity x) + (∑ x ∈ t \ s, q.rootMultiplicity x) := by omega
  have hpe : Multiset.card p.roots = p.natDegree := hp
  exact hpe ▸ hfinal

/-- **The Hermite–Poulain shift preserves real-rootedness.**  For every real `c`, the
operator `p ↦ p' + c • p` maps real-rooted polynomials to real-rooted polynomials
(roots counted with multiplicity).

For `c = 0` this is `hasOnlyRealRoots_derivative`; for `p = 0` both sides are `0`.  For
`c ≠ 0, p ≠ 0`: the shifted polynomial has the same degree as `p` (the `c • p` term
dominates the lower-degree `p'`), so `Polynomial.card_roots'` gives
`card q.roots ≤ natDegree q = card p.roots`, while `hermitePoulain_card_lower` gives the
matching lower bound; the two pin `card q.roots = natDegree q`. -/
theorem hermitePoulain_shift (c : ℝ) {p : ℝ[X]} (hp : HasOnlyRealRoots p) :
    HasOnlyRealRoots (Polynomial.derivative p + c • p) := by
  rcases eq_or_ne c 0 with rfl | hc
  · have h0 : Polynomial.derivative p + (0 : ℝ) • p = Polynomial.derivative p := by
      rw [zero_smul, add_zero]
    rw [h0]; exact hasOnlyRealRoots_derivative hp
  rcases eq_or_ne p 0 with rfl | hp0
  · simp only [Polynomial.derivative_zero, smul_zero, add_zero, HasOnlyRealRoots,
      Polynomial.roots_zero, Polynomial.natDegree_zero, Multiset.card_zero]
  have hdeg : (Polynomial.derivative p + c • p).natDegree = p.natDegree := by
    rcases Nat.eq_zero_or_pos p.natDegree with h0 | hpos
    · rw [Polynomial.derivative_of_natDegree_zero h0, zero_add, Polynomial.natDegree_smul p hc]
    · have hside : (Polynomial.derivative p).natDegree < (c • p).natDegree := by
        rw [Polynomial.natDegree_smul p hc]
        exact Polynomial.natDegree_derivative_lt hpos.ne'
      rw [add_comm, Polynomial.natDegree_add_eq_left_of_natDegree_lt hside,
          Polynomial.natDegree_smul p hc]
  have hle : Multiset.card (Polynomial.derivative p + c • p).roots
      ≤ (Polynomial.derivative p + c • p).natDegree := Polynomial.card_roots' _
  have hge : p.natDegree ≤ Multiset.card (Polynomial.derivative p + c • p).roots :=
    hermitePoulain_card_lower hc hp hp0
  unfold HasOnlyRealRoots at hp ⊢
  omega

/-! ## The finite heat factor `1 - c • D²` and its powers -/

/-- **Scaling by a nonzero constant preserves real-rootedness.**  For `a ≠ 0`,
`roots (a • p) = roots p` and `natDegree (a • p) = natDegree p`. -/
theorem hasOnlyRealRoots_smul {a : ℝ} (ha : a ≠ 0) {p : ℝ[X]}
    (hp : HasOnlyRealRoots p) : HasOnlyRealRoots (a • p) := by
  unfold HasOnlyRealRoots at hp ⊢
  rw [Polynomial.roots_smul_nonzero p ha, Polynomial.natDegree_smul p ha]
  exact hp

/-- The finite heat factor `1 - c • D²` acting on `p`, i.e. `p - c • p''`.  For `t ≥ 0`
the `n`-th iterate `(1 - (t/n) • D²)ⁿ` converges to the heat operator
`e^{-t D²} = heatOp t`. -/
noncomputable def oneMinusCD2 (c : ℝ) (p : ℝ[X]) : ℝ[X] :=
  p - c • Polynomial.derivative (Polynomial.derivative p)

/-- **The finite heat factor `1 - c • D²` preserves real-rootedness** (for `c > 0`).

Via the factorization `1 - c • D² = (1 + √c • D)(1 - √c • D)`: writing `s := √c`, the two
Hermite–Poulain shifts `p ↦ p' + (-1/s) • p` and `q ↦ q' + (1/s) • q`, followed by scaling
by `-c ≠ 0`, reconstruct `p - c • p''` (the cross `p'` terms cancel because the shift
constants `±1/s` sum to `0`). -/
theorem oneMinusCD2_realRooted {c : ℝ} (hc : 0 < c) {p : ℝ[X]}
    (hp : HasOnlyRealRoots p) : HasOnlyRealRoots (oneMinusCD2 c p) := by
  have hcne : c ≠ 0 := ne_of_gt hc
  set s : ℝ := Real.sqrt c with hsdef
  have hspos : 0 < s := Real.sqrt_pos.mpr hc
  have hs : s ≠ 0 := ne_of_gt hspos
  have hss : s * s = c := Real.mul_self_sqrt hc.le
  set q : ℝ[X] := Polynomial.derivative p + (-1/s) • p with hqdef
  have hq : HasOnlyRealRoots q := by
    rw [hqdef]; exact hermitePoulain_shift (-1/s) hp
  have hcomp : HasOnlyRealRoots (Polynomial.derivative q + (1/s) • q) :=
    hermitePoulain_shift (1/s) hq
  have hfin : HasOnlyRealRoots ((-c) • (Polynomial.derivative q + (1/s) • q)) :=
    hasOnlyRealRoots_smul (neg_ne_zero.mpr hcne) hcomp
  have hid : oneMinusCD2 c p = (-c) • (Polynomial.derivative q + (1/s) • q) := by
    have ecomp : Polynomial.derivative q + (1/s) • q
        = Polynomial.derivative (Polynomial.derivative p) + (-(1/c)) • p := by
      rw [hqdef, Polynomial.derivative_add, Polynomial.derivative_smul, smul_add, smul_smul,
        show (1/s) * (-1/s) = -(1/c) by
          rw [show (1/s) * (-1/s) = -(1/(s*s)) by ring, hss]]
      module
    rw [ecomp]
    unfold oneMinusCD2
    rw [smul_add, smul_smul, show (-c) * (-(1/c)) = 1 by
      rw [neg_mul_neg, mul_one_div, div_self hcne], one_smul]
    module
  rw [hid]; exact hfin

/-- **Every finite power `(1 - c • D²)ⁿ` preserves real-rootedness** (for `c > 0`). -/
theorem oneMinusCD2_iterate_realRooted {c : ℝ} (hc : 0 < c) {p : ℝ[X]}
    (hp : HasOnlyRealRoots p) : ∀ n : ℕ, HasOnlyRealRoots ((oneMinusCD2 c)^[n] p)
  | 0 => by simpa using hp
  | n + 1 => by
      rw [Function.iterate_succ', Function.comp_apply]
      exact oneMinusCD2_realRooted hc (oneMinusCD2_iterate_realRooted hc hp n)

/-- **The finite heat factor preserves degree.**  `c • p''` has strictly smaller degree
than `p` (or `p'' = 0` when `deg p = 0`), so `(1 - c • D²) p` has the same degree as `p`. -/
theorem oneMinusCD2_natDegree (c : ℝ) (p : ℝ[X]) :
    (oneMinusCD2 c p).natDegree = p.natDegree := by
  unfold oneMinusCD2
  rcases Nat.eq_zero_or_pos p.natDegree with hN | hN
  · rw [Polynomial.derivative_of_natDegree_zero hN, Polynomial.derivative_zero, smul_zero,
      sub_zero]
  · have hd2 : (Polynomial.derivative (Polynomial.derivative p)).natDegree < p.natDegree := by
      have h1 := Polynomial.natDegree_derivative_le (Polynomial.derivative p)
      have h2 := Polynomial.natDegree_derivative_le p
      omega
    exact Polynomial.natDegree_sub_eq_left_of_natDegree_lt
      (lt_of_le_of_lt (Polynomial.natDegree_smul_le _ _) hd2)

/-- **Every finite power `(1 - c • D²)ⁿ` preserves degree.** -/
theorem oneMinusCD2_iterate_natDegree (c : ℝ) (p : ℝ[X]) :
    ∀ n : ℕ, ((oneMinusCD2 c)^[n] p).natDegree = p.natDegree
  | 0 => by simp
  | n + 1 => by
      rw [Function.iterate_succ', Function.comp_apply, oneMinusCD2_natDegree,
        oneMinusCD2_iterate_natDegree c p n]

/-- **The finite heat factor preserves the leading coefficient.** -/
theorem oneMinusCD2_leadingCoeff (c : ℝ) (p : ℝ[X]) :
    (oneMinusCD2 c p).leadingCoeff = p.leadingCoeff := by
  have hz : (Polynomial.derivative (Polynomial.derivative p)).coeff p.natDegree = 0 := by
    rcases Nat.eq_zero_or_pos p.natDegree with h0 | hpos
    · rw [Polynomial.derivative_of_natDegree_zero h0, Polynomial.derivative_zero,
        Polynomial.coeff_zero]
    · refine Polynomial.coeff_eq_zero_of_natDegree_lt ?_
      have h1 := Polynomial.natDegree_derivative_le (Polynomial.derivative p)
      have h2 := Polynomial.natDegree_derivative_le p
      omega
  unfold Polynomial.leadingCoeff
  rw [oneMinusCD2_natDegree, oneMinusCD2, Polynomial.coeff_sub, Polynomial.coeff_smul,
    smul_eq_mul, hz, mul_zero, sub_zero]

/-- **Every finite power `(1 - c • D²)ⁿ` preserves the leading coefficient.** -/
theorem oneMinusCD2_iterate_leadingCoeff (c : ℝ) (p : ℝ[X]) :
    ∀ n : ℕ, ((oneMinusCD2 c)^[n] p).leadingCoeff = p.leadingCoeff
  | 0 => by simp
  | n + 1 => by
      rw [Function.iterate_succ', Function.comp_apply, oneMinusCD2_leadingCoeff,
        oneMinusCD2_iterate_leadingCoeff c p n]

/-! ## The heat / Laguerre–Pólya multiplier operator `e^{-t D²}`

`heatOp t p = ∑ₖ ((-t)ᵏ / k!) • D^{2k} p` is the operator `e^{-t D²}` (Fourier symbol
`e^{-t x²}`).  The sum is genuinely finite: `D^{2k} p = 0` once `2k > deg p`.  For `t ≥ 0`
the symbol lies in the Laguerre–Pólya class, so `e^{-t D²}` preserves real-rootedness; the
forward operator `e^{+t D²}` does not (e.g. `e^{t D²}(X² - 1) = X² + (2t - 1)` acquires a
conjugate pair of non-real roots for `t > 1/2`), which is why `heat_preserves_LP` requires
`0 ≤ t`. -/

/-- Fixed-cutoff heat partial sum `∑_{k<N} ((-t)ᵏ / k!) • D^{2k} p`, with an *explicit*
cutoff `N` so that additivity / homogeneity can be proved at a cutoff independent of
`natDegree` (which changes under `+` and `•`). -/
noncomputable def heatPartial (N : ℕ) (t : ℝ) (p : ℝ[X]) : ℝ[X] :=
  ∑ k ∈ Finset.range N, ((-t) ^ k / (Nat.factorial k : ℝ)) • Polynomial.derivative^[2 * k] p

/-- Iterated formal derivative is additive.  (Mathlib has `iterate_derivative_sum` and
`iterate_derivative_smul` but no bare `iterate_derivative_add`.) -/
theorem iterate_derivative_add (k : ℕ) (p q : ℝ[X]) :
    Polynomial.derivative^[k] (p + q)
      = Polynomial.derivative^[k] p + Polynomial.derivative^[k] q := by
  induction k with
  | zero => simp
  | succ k ih =>
      simp only [Function.iterate_succ_apply', ih, Polynomial.derivative_add]

/-- `heatPartial N t` is additive (at a fixed cutoff `N`). -/
theorem heatPartial_add (N : ℕ) (t : ℝ) (p q : ℝ[X]) :
    heatPartial N t (p + q) = heatPartial N t p + heatPartial N t q := by
  unfold heatPartial
  rw [← Finset.sum_add_distrib]
  refine Finset.sum_congr rfl fun k _ => ?_
  rw [iterate_derivative_add, smul_add]

/-- `heatPartial N t` is `ℝ`-homogeneous (at a fixed cutoff `N`). -/
theorem heatPartial_smul (N : ℕ) (t c : ℝ) (p : ℝ[X]) :
    heatPartial N t (c • p) = c • heatPartial N t p := by
  unfold heatPartial
  rw [Finset.smul_sum]
  refine Finset.sum_congr rfl fun k _ => ?_
  rw [Polynomial.iterate_derivative_smul]
  exact smul_comm _ _ _

/-- **Cutoff stability.**  Enlarging the cutoff `N` beyond `natDegree p + 1` adds only zero
terms (`D^{2k} p = 0` for `2k > natDegree p`), so `heatPartial` is independent of `N` once
`N ≥ natDegree p + 1`. -/
theorem heatPartial_stable {N : ℕ} {t : ℝ} {p : ℝ[X]} (h : p.natDegree + 1 ≤ N) :
    heatPartial N t p = heatPartial (p.natDegree + 1) t p := by
  unfold heatPartial
  refine (Finset.sum_subset (Finset.range_subset.mpr h) ?_).symm
  intro k _ hk
  simp only [Finset.mem_range, not_lt] at hk
  rw [Polynomial.iterate_derivative_eq_zero (by omega : p.natDegree < 2 * k), smul_zero]

/-- **The heat / Laguerre–Pólya multiplier operator** `e^{-t D²}` on `ℝ[X]`, as a genuine
finite (computable) polynomial map. -/
noncomputable def heatOp (t : ℝ) (p : ℝ[X]) : ℝ[X] := heatPartial (p.natDegree + 1) t p

/-- `heatOp 0 = id`: at `t = 0` every `k ≥ 1` term vanishes and the `k = 0` term is `p`. -/
@[simp] theorem heatOp_zero (p : ℝ[X]) : heatOp 0 p = p := by
  unfold heatOp heatPartial
  rw [Finset.sum_eq_single (0 : ℕ)]
  · simp
  · intro k _ hk
    rw [neg_zero, zero_pow hk, zero_div, zero_smul]
  · intro h
    exact absurd (Finset.mem_range.mpr (Nat.succ_pos _)) h

/-- `heatOp t` is additive. -/
theorem heatOp_add (t : ℝ) (p q : ℝ[X]) :
    heatOp t (p + q) = heatOp t p + heatOp t q := by
  obtain ⟨N, hpq, hp, hq⟩ :
      ∃ N, (p + q).natDegree + 1 ≤ N ∧ p.natDegree + 1 ≤ N ∧ q.natDegree + 1 ≤ N :=
    ⟨(p + q).natDegree + p.natDegree + q.natDegree + 1, by omega, by omega, by omega⟩
  unfold heatOp
  rw [← heatPartial_stable hpq, ← heatPartial_stable hp, ← heatPartial_stable hq,
      heatPartial_add]

/-- `heatOp t` is `ℝ`-homogeneous. -/
theorem heatOp_smul (t c : ℝ) (p : ℝ[X]) :
    heatOp t (c • p) = c • heatOp t p := by
  obtain ⟨N, hcp, hp⟩ : ∃ N, (c • p).natDegree + 1 ≤ N ∧ p.natDegree + 1 ≤ N :=
    ⟨(c • p).natDegree + p.natDegree + 1, by omega, by omega⟩
  unfold heatOp
  rw [← heatPartial_stable hcp, ← heatPartial_stable hp, heatPartial_smul]

/-- **`heatOp` preserves degree.**  `heatOp t p = p + (lower-degree terms)`: the `k = 0`
term is `p` and every `k ≥ 1` term has degree `≤ natDegree p - 2 < natDegree p`. -/
theorem heatOp_natDegree (t : ℝ) (p : ℝ[X]) : (heatOp t p).natDegree = p.natDegree := by
  have hrw : heatOp t p =
      (∑ k ∈ Finset.range p.natDegree,
        ((-t) ^ (k + 1) / (Nat.factorial (k + 1) : ℝ))
          • Polynomial.derivative^[2 * (k + 1)] p) + p := by
    unfold heatOp heatPartial
    rw [Finset.sum_range_succ']
    congr 1
    simp
  rcases Nat.eq_zero_or_pos p.natDegree with hN | hN
  · rw [hrw]; simp [hN]
  · have hlt : (∑ k ∈ Finset.range p.natDegree,
          ((-t) ^ (k + 1) / (Nat.factorial (k + 1) : ℝ))
            • Polynomial.derivative^[2 * (k + 1)] p).natDegree < p.natDegree := by
      have hbound : (∑ k ∈ Finset.range p.natDegree,
            ((-t) ^ (k + 1) / (Nat.factorial (k + 1) : ℝ))
              • Polynomial.derivative^[2 * (k + 1)] p).natDegree ≤ p.natDegree - 1 := by
        refine Polynomial.natDegree_sum_le_of_forall_le (Finset.range p.natDegree)
          (fun k => ((-t) ^ (k + 1) / (Nat.factorial (k + 1) : ℝ))
            • Polynomial.derivative^[2 * (k + 1)] p) (fun k _ => ?_)
        show (((-t) ^ (k + 1) / (Nat.factorial (k + 1) : ℝ))
            • Polynomial.derivative^[2 * (k + 1)] p).natDegree ≤ p.natDegree - 1
        have h1 : (((-t) ^ (k + 1) / (Nat.factorial (k + 1) : ℝ))
            • Polynomial.derivative^[2 * (k + 1)] p).natDegree
            ≤ (Polynomial.derivative^[2 * (k + 1)] p).natDegree :=
          Polynomial.natDegree_smul_le _ _
        have h2 : (Polynomial.derivative^[2 * (k + 1)] p).natDegree ≤ p.natDegree - 2 * (k + 1) :=
          Polynomial.natDegree_iterate_derivative _ _
        omega
      omega
    rw [hrw, add_comm]
    exact Polynomial.natDegree_add_eq_left_of_natDegree_lt hlt

/-! ## The coefficient bridge `(1 - (t/n) • D²)ⁿ p → heatOp t p` -/

section HeatLimit
open Filter Topology Polynomial
open scoped NNReal

/-- **Operator binomial expansion.**  `(1 - c • D²)ⁿ p = ∑ⱼ C(n, j) (-c)ʲ • D^{2j} p`.
Proved in the endomorphism ring `Module.End ℝ ℝ[X]` via `Commute.add_pow` (the identity
commutes with `c • D²`), then evaluated at `p`. -/
theorem oneMinusCD2_iterate_eq_sum (c : ℝ) (p : ℝ[X]) (n : ℕ) :
    (oneMinusCD2 c)^[n] p
      = ∑ j ∈ Finset.range (n + 1),
          ((n.choose j : ℝ) * (-c) ^ j) • Polynomial.derivative^[2 * j] p := by
  classical
  set Δ : Module.End ℝ ℝ[X] := Polynomial.derivative * Polynomial.derivative with hΔ
  set T : Module.End ℝ ℝ[X] := -(c • Δ) + 1 with hT
  have hTapp : ⇑T = oneMinusCD2 c := by
    funext q
    rw [hT]
    simp only [LinearMap.add_apply, LinearMap.neg_apply, LinearMap.smul_apply,
      Module.End.one_apply, hΔ, Module.End.mul_apply]
    unfold oneMinusCD2
    abel
  have hiter : (oneMinusCD2 c)^[n] p = (T ^ n) p := by
    rw [Module.End.pow_apply, hTapp]
  rw [hiter, hT]
  have hbin : (-(c • Δ) + 1) ^ n
      = ∑ m ∈ Finset.range (n + 1), (-(c • Δ)) ^ m * (n.choose m : Module.End ℝ ℝ[X]) := by
    rw [(Commute.one_right (-(c • Δ))).add_pow]
    refine Finset.sum_congr rfl (fun m _ => ?_)
    rw [one_pow, mul_one]
  rw [hbin, LinearMap.sum_apply]
  refine Finset.sum_congr rfl (fun m _ => ?_)
  have hpow : (-(c • Δ)) ^ m = (-c) ^ m • Δ ^ m := by
    have hns : (-(c • Δ) : Module.End ℝ ℝ[X]) = (-c) • Δ := (neg_smul c Δ).symm
    rw [hns, smul_pow]
  have hΔm : (Δ ^ m) p = Polynomial.derivative^[2 * m] p := by
    have h1 : Δ ^ m = (Polynomial.derivative : Module.End ℝ ℝ[X]) ^ (2 * m) := by
      rw [hΔ, pow_mul, pow_two]
    rw [h1, Module.End.pow_apply]
  rw [Module.End.mul_apply, Module.End.natCast_apply, ← Nat.cast_smul_eq_nsmul ℝ,
    LinearMap.map_smul, hpow, LinearMap.smul_apply, hΔm, smul_smul]

/-- **Scalar limit.**  `C(n, j) (-t/n)ʲ → (-t)ʲ / j!` as `n → ∞`, via
`n.choose j / nʲ → 1/j!` (a finite product `∏_{i<j}(1 - i/n) → 1`). -/
theorem choose_mul_pow_tendsto (t : ℝ) (j : ℕ) :
    Tendsto (fun n : ℕ => (n.choose j : ℝ) * (-(t / n)) ^ j) atTop
      (𝓝 ((-t) ^ j / j.factorial)) := by
  have hg : Tendsto (fun n : ℕ => (n.choose j : ℝ) / (n : ℝ) ^ j) atTop
      (𝓝 (1 / j.factorial)) := by
    have hfac : ∀ i : ℕ, Tendsto (fun n : ℕ => ((n : ℝ) - i) / n) atTop (𝓝 1) := by
      intro i
      have h0 : Tendsto (fun n : ℕ => (1 : ℝ) - (i : ℝ) / n) atTop (𝓝 (1 - 0)) :=
        tendsto_const_nhds.sub (tendsto_const_div_atTop_nhds_zero_nat (i : ℝ))
      rw [sub_zero] at h0
      refine h0.congr' ?_
      filter_upwards [eventually_gt_atTop 0] with n hn
      have hn0 : (n : ℝ) ≠ 0 := Nat.cast_ne_zero.mpr hn.ne'
      field_simp
    have hprod : Tendsto (fun n : ℕ => ∏ i ∈ Finset.range j, ((n : ℝ) - (i : ℝ)) / (n : ℝ))
        atTop (𝓝 1) := by
      have h := tendsto_finset_prod (Finset.range j)
        (f := fun (i : ℕ) (n : ℕ) => ((n : ℝ) - (i : ℝ)) / (n : ℝ))
        (a := fun (_ : ℕ) => (1 : ℝ)) (x := atTop) (fun i _ => hfac i)
      simpa using h
    have hlim1 : Tendsto (fun n : ℕ => (1 / (j.factorial : ℝ)) * ∏ i ∈ Finset.range j, ((n : ℝ) - i) / n)
        atTop (𝓝 (1 / (j.factorial : ℝ))) := by
      have := hprod.const_mul (1 / (j.factorial : ℝ))
      rwa [mul_one] at this
    refine hlim1.congr' ?_
    filter_upwards [eventually_ge_atTop j] with n hn
    have hcast : (∏ i ∈ Finset.range j, ((n : ℝ) - i)) = (j.factorial : ℝ) * (n.choose j : ℝ) := by
      have h1 : (n.descFactorial j : ℝ) = ∏ i ∈ Finset.range j, ((n : ℝ) - i) := by
        rw [Nat.descFactorial_eq_prod_range, Nat.cast_prod]
        refine Finset.prod_congr rfl (fun i hi => ?_)
        rw [Nat.cast_sub (le_of_lt (lt_of_lt_of_le (Finset.mem_range.mp hi) hn))]
      rw [← h1, Nat.descFactorial_eq_factorial_mul_choose, Nat.cast_mul]
    rw [Finset.prod_div_distrib, Finset.prod_const, Finset.card_range, hcast, one_div,
      ← mul_div_assoc, inv_mul_cancel_left₀ (Nat.cast_ne_zero.mpr (Nat.factorial_ne_zero j))]
  have hpt : ∀ n : ℕ, (-(t / n)) ^ j = (-t) ^ j / (n : ℝ) ^ j := by
    intro n; rw [← neg_div, div_pow]
  have hrw : (fun n : ℕ => (n.choose j : ℝ) * (-(t / n)) ^ j)
      = (fun n : ℕ => (-t) ^ j * ((n.choose j : ℝ) / (n : ℝ) ^ j)) := by
    funext n; rw [hpt]; ring
  rw [hrw]
  have := hg.const_mul ((-t) ^ j)
  rwa [mul_one_div] at this

/-- **The coefficient limit.**  For every `m`,
`((1 - (t/n) • D²)ⁿ p).coeff m → (heatOp t p).coeff m` as `n → ∞`. -/
theorem oneMinusCD2_iterate_tendsto_heatOp (t : ℝ) (p : ℝ[X]) (m : ℕ) :
    Tendsto (fun n : ℕ => ((oneMinusCD2 (t / n))^[n] p).coeff m) atTop
      (𝓝 ((heatOp t p).coeff m)) := by
  -- target coefficient as a finite sum over `range (natDegree p + 1)`
  have hheat : (heatOp t p).coeff m
      = ∑ j ∈ Finset.range (p.natDegree + 1),
          ((-t) ^ j / (j.factorial : ℝ)) * (Polynomial.derivative^[2 * j] p).coeff m := by
    unfold heatOp heatPartial
    rw [Polynomial.finset_sum_coeff]
    refine Finset.sum_congr rfl (fun j _ => ?_)
    rw [Polynomial.coeff_smul, smul_eq_mul]
  rw [hheat]
  -- eventual equality of qₙ.coeff m with the fixed-range sum
  refine Tendsto.congr' ?_
    (tendsto_finset_sum (Finset.range (p.natDegree + 1))
      (f := fun j (n : ℕ) =>
        ((n.choose j : ℝ) * (-(t / n)) ^ j) * (Polynomial.derivative^[2 * j] p).coeff m)
      (a := fun j => ((-t) ^ j / (j.factorial : ℝ)) * (Polynomial.derivative^[2 * j] p).coeff m)
      (fun j _ => (choose_mul_pow_tendsto t j).mul_const _))
  filter_upwards [eventually_ge_atTop p.natDegree] with n hn
  rw [oneMinusCD2_iterate_eq_sum, Polynomial.finset_sum_coeff,
    ← Finset.sum_subset (Finset.range_subset.mpr (show p.natDegree + 1 ≤ n + 1 by omega))
      (fun j _ hj => by
        simp only [Finset.mem_range, not_lt] at hj
        rw [Polynomial.coeff_smul,
          Polynomial.iterate_derivative_eq_zero (show p.natDegree < 2 * j by omega),
          Polynomial.coeff_zero, smul_zero])]
  refine Finset.sum_congr rfl (fun j _ => ?_)
  rw [Polynomial.coeff_smul, smul_eq_mul]

end HeatLimit

/-! ## Real-rootedness is closed under coefficient limits (Hurwitz via root compactness)

If real-rooted `pₙ` of a common degree `d` and fixed nonzero leading coefficient `a`
converge coefficient-wise to `p` (of degree `d`), then `p` is real-rooted.  Each
`pₙ = C a · ∏ᵢ(X - rₙ,ᵢ)` with real roots; the roots are uniformly bounded (Cauchy's bound,
`Polynomial.IsRoot.norm_lt_cauchyBound`), so the root-vectors live in a compact box.
Bolzano–Weierstrass (`tendsto_subseq_of_bounded`) extracts a convergent subsequence
`rₙₖ → s`, and continuity of Vieta forces `p = C a · ∏ᵢ(X - sᵢ)`. -/

section HurwitzReplacement
open Filter Topology Polynomial
open scoped NNReal

/-- **Continuity of Vieta coefficients.**  For every `k`, the `k`-th coefficient of the
parametrised product `∏ᵢ∈s (X - wᵢ)` is a continuous function of the root vector `w`. -/
theorem continuous_prod_X_sub_C_coeff {d : ℕ} (s : Finset (Fin d)) :
    ∀ k : ℕ, Continuous (fun w : Fin d → ℝ => (∏ i ∈ s, (X - C (w i))).coeff k) := by
  induction s using Finset.induction_on with
  | empty =>
      intro k
      simp only [Finset.prod_empty]
      exact continuous_const
  | @insert a s ha ih =>
      intro k
      simp only [Finset.prod_insert ha]
      have hExpand : (fun w : Fin d → ℝ => ((X - C (w a)) * ∏ i ∈ s, (X - C (w i))).coeff k)
          = (fun w : Fin d → ℝ =>
              ((X : ℝ[X]) * ∏ i ∈ s, (X - C (w i))).coeff k
                - (w a) * (∏ i ∈ s, (X - C (w i))).coeff k) := by
        funext w
        rw [sub_mul, Polynomial.coeff_sub, Polynomial.C_mul', Polynomial.coeff_smul, smul_eq_mul]
      rw [hExpand]
      apply Continuous.sub
      · cases k with
        | zero => simp only [Polynomial.coeff_X_mul_zero]; exact continuous_const
        | succ k => simp only [Polynomial.coeff_X_mul]; exact ih k
      · exact (continuous_apply a).mul (ih k)

/-- **Real-rootedness is closed under coefficient limits.**  A real-variable, root-vector
compactness form of Hurwitz's theorem (no complex analysis).  If a family `P n` of
real-rooted polynomials of constant degree `d` and constant nonzero leading coefficient `a`
converges coefficient-wise to `p` (also of degree `d`), then `p` is real-rooted. -/
theorem hasOnlyRealRoots_of_tendsto_coeff {d : ℕ} {a : ℝ} (ha : a ≠ 0)
    {P : ℕ → ℝ[X]} {p : ℝ[X]}
    (hPdeg : ∀ n, (P n).natDegree = d) (hPlead : ∀ n, (P n).leadingCoeff = a)
    (hPrr : ∀ n, HasOnlyRealRoots (P n)) (hpdeg : p.natDegree = d)
    (hlim : ∀ m, Tendsto (fun n => (P n).coeff m) atTop (𝓝 (p.coeff m))) :
    HasOnlyRealRoots p := by
  classical
  rcases Nat.eq_zero_or_pos d with hd0 | hdpos
  · -- degree 0: card roots ≤ natDegree = 0
    unfold HasOnlyRealRoots
    have hcr := Polynomial.card_roots' p
    rw [hpdeg, hd0] at hcr ⊢
    omega
  -- basic facts
  have hPne : ∀ n, P n ≠ 0 := fun n =>
    Polynomial.leadingCoeff_ne_zero.mp (by rw [hPlead n]; exact ha)
  have hcoeffd : p.coeff d = a := by
    have h2 : (fun n => (P n).coeff d) = (fun _ : ℕ => a) := by
      funext n; rw [← hPdeg n]; exact hPlead n
    have h1 := hlim d
    rw [h2] at h1
    exact tendsto_nhds_unique h1 tendsto_const_nhds
  have hplead : p.leadingCoeff = a := by
    rw [Polynomial.leadingCoeff, hpdeg]; exact hcoeffd
  -- root vectors from each Pₙ
  have hcardn : ∀ n, Multiset.card (P n).roots = d := fun n => (hPrr n).trans (hPdeg n)
  have hlenL : ∀ n, ((P n).roots.toList).length = d := fun n => by
    rw [Multiset.length_toList, hcardn n]
  have hlistprod : ∀ (L : List ℝ),
      (L.map (fun r => (X : ℝ[X]) - C r)).prod = ∏ i : Fin L.length, ((X : ℝ[X]) - C (L.get i)) := by
    intro L
    conv_lhs => rw [← List.finRange_map_get L, List.map_map]
    rw [← List.prod_ofFn, List.ofFn_eq_map]
    rfl
  set v : ℕ → Fin d → ℝ :=
    fun n i => ((P n).roots.toList).get (Fin.cast (hlenL n).symm i) with hvdef
  have hprod : ∀ n, P n = Polynomial.C a * ∏ i : Fin d, ((X : ℝ[X]) - C (v n i)) := by
    intro n
    have hbase := (Polynomial.C_leadingCoeff_mul_prod_multiset_X_sub_C (hPrr n)).symm
    rw [hPlead n] at hbase
    rw [hbase]
    congr 1
    rw [← Multiset.coe_toList (P n).roots, Multiset.map_coe, Multiset.prod_coe, hlistprod]
    simp only [hvdef]
    exact (Fin.prod_congr' (fun j => (X : ℝ[X]) - C ((P n).roots.toList.get j)) (hlenL n).symm).symm
  have hroot : ∀ n i, (P n).IsRoot (v n i) := by
    intro n i
    have hmem : v n i ∈ (P n).roots := by
      rw [hvdef, ← Multiset.mem_toList]
      exact List.get_mem _ _
    rw [← Polynomial.mem_roots (hPne n)]
    exact hmem
  -- uniform coefficient bound (convergent ⇒ bounded)
  have hbdd : ∀ k, ∃ Cb : ℝ, ∀ n, |(P n).coeff k| ≤ Cb := by
    intro k
    have hb : Bornology.IsBounded (Set.range (fun n => (P n).coeff k)) :=
      Metric.isBounded_range_of_tendsto_cofinite (by rw [Nat.cofinite_eq_atTop]; exact hlim k)
    rw [isBounded_iff_forall_norm_le] at hb
    obtain ⟨Cb, hCb⟩ := hb
    exact ⟨Cb, fun n => by have := hCb _ (Set.mem_range_self n); rwa [Real.norm_eq_abs] at this⟩
  choose Cb hCb using hbdd
  -- uniform Cauchy bound
  set R : ℝ := (((∑ k ∈ Finset.range d, ‖Cb k‖₊) / ‖a‖₊ + 1 : ℝ≥0) : ℝ) with hRdef
  have hcb : ∀ n, (Polynomial.cauchyBound (P n) : ℝ) ≤ R := by
    intro n
    have hsup : Finset.sup (Finset.range d) (fun k => ‖(P n).coeff k‖₊)
        ≤ ∑ k ∈ Finset.range d, ‖Cb k‖₊ := by
      refine Finset.sup_le (fun k hk => ?_)
      refine le_trans ?_ (Finset.single_le_sum (fun i _ => zero_le _) hk)
      rw [← NNReal.coe_le_coe]
      simp only [coe_nnnorm, Real.norm_eq_abs]
      exact le_trans (hCb k n) (le_abs_self _)
    have hle : Polynomial.cauchyBound (P n) ≤ (∑ k ∈ Finset.range d, ‖Cb k‖₊) / ‖a‖₊ + 1 := by
      unfold Polynomial.cauchyBound
      rw [hPdeg n, hPlead n]
      gcongr
    rw [hRdef, NNReal.coe_le_coe]
    exact hle
  have hbound : ∀ n i, |v n i| ≤ R := by
    intro n i
    have hlt := Polynomial.IsRoot.norm_lt_cauchyBound (hPne n) (hroot n i)
    have h2 : |v n i| < (Polynomial.cauchyBound (P n) : ℝ) := by
      have := NNReal.coe_lt_coe.mpr hlt
      simpa [Real.norm_eq_abs] using this
    exact le_of_lt (lt_of_lt_of_le h2 (hcb n))
  -- Bolzano–Weierstrass
  have hR0 : 0 ≤ R := le_trans (abs_nonneg _) (hbound 0 ⟨0, hdpos⟩)
  have hmem : ∀ n, v n ∈ Metric.closedBall (0 : Fin d → ℝ) R := by
    intro n
    rw [mem_closedBall_zero_iff, pi_norm_le_iff_of_nonneg hR0]
    intro i; rw [Real.norm_eq_abs]; exact hbound n i
  obtain ⟨w, -, φ, hφ, hvφ⟩ :=
    tendsto_subseq_of_bounded Metric.isBounded_closedBall hmem
  -- the limit product equals p
  have hpeq : p = Polynomial.C a * ∏ i : Fin d, ((X : ℝ[X]) - C (w i)) := by
    apply Polynomial.ext
    intro k
    have hlimP : Tendsto (fun m => (P (φ m)).coeff k) atTop (𝓝 (p.coeff k)) :=
      (hlim k).comp hφ.tendsto_atTop
    have hcont : Continuous
        (fun w : Fin d → ℝ => (∏ i : Fin d, ((X : ℝ[X]) - C (w i))).coeff k) :=
      continuous_prod_X_sub_C_coeff Finset.univ k
    have hlimQ : Tendsto
        (fun m => (∏ i : Fin d, ((X : ℝ[X]) - C (v (φ m) i))).coeff k) atTop
        (𝓝 ((∏ i : Fin d, ((X : ℝ[X]) - C (w i))).coeff k)) :=
      (hcont.tendsto w).comp hvφ
    have heq : ∀ m, (P (φ m)).coeff k
        = a * (∏ i : Fin d, ((X : ℝ[X]) - C (v (φ m) i))).coeff k := by
      intro m; rw [hprod (φ m), Polynomial.coeff_C_mul]
    have hlimP' : Tendsto (fun m => (P (φ m)).coeff k) atTop
        (𝓝 (a * (∏ i : Fin d, ((X : ℝ[X]) - C (w i))).coeff k)) := by
      simp only [heq]; exact hlimQ.const_mul a
    have huniq := tendsto_nhds_unique hlimP hlimP'
    rw [Polynomial.coeff_C_mul]; exact huniq
  -- conclude real-rootedness of the limit product
  have hprodms : (∏ i : Fin d, ((X : ℝ[X]) - C (w i)))
      = (((Finset.univ : Finset (Fin d)).val.map w).map (fun r => (X : ℝ[X]) - C r)).prod := by
    rw [Finset.prod_eq_multiset_prod, Multiset.map_map]; rfl
  have hroots_p : p.roots = (Finset.univ : Finset (Fin d)).val.map w := by
    rw [hpeq, hprodms, Polynomial.C_mul', Polynomial.roots_smul_nonzero _ ha,
      Polynomial.roots_multiset_prod_X_sub_C]
  unfold HasOnlyRealRoots
  rw [hroots_p, Multiset.card_map, hpdeg]
  simp

end HurwitzReplacement

/-! ## The polynomial de Bruijn / Pólya–Schur theorem -/

/-- **The heat operator preserves real-rootedness (polynomial de Bruijn / Pólya–Schur).**

For `t ≥ 0`, if `p` has only real roots then so does `e^{-t D²} p = heatOp t p`.  This is
the polynomial case of de Bruijn's theorem, equivalently the Pólya–Schur characterization
of the Laguerre–Pólya multiplier `e^{-t x²}`.

Proof: for `t > 0, p ≠ 0`, the approximants `qₙ := (1 - (t/n) • D²)ⁿ p` are real-rooted
(`oneMinusCD2_iterate_realRooted`) of constant degree and leading coefficient
(`oneMinusCD2_iterate_natDegree`, `oneMinusCD2_iterate_leadingCoeff`) and converge
coefficient-wise to `heatOp t p` (`oneMinusCD2_iterate_tendsto_heatOp`); real-rootedness
passes to the limit by `hasOnlyRealRoots_of_tendsto_coeff`.  The cases `t = 0` (`heatOp_zero`)
and `p = 0` are handled directly. -/
theorem heat_preserves_LP (t : ℝ) (ht : 0 ≤ t) {p : ℝ[X]} (hp : HasOnlyRealRoots p) :
    HasOnlyRealRoots (heatOp t p) := by
  rcases eq_or_lt_of_le ht with rfl | htpos
  · -- t = 0: heatOp 0 = id
    rw [heatOp_zero]; exact hp
  rcases eq_or_ne p 0 with rfl | hp0
  · -- p = 0: heatOp t 0 has degree 0, so real-rooted
    unfold HasOnlyRealRoots
    have hcr := Polynomial.card_roots' (heatOp t (0 : ℝ[X]))
    rw [heatOp_natDegree, Polynomial.natDegree_zero] at hcr ⊢
    omega
  -- p ≠ 0, t > 0: apply the Hurwitz replacement to the approximants.
  have ha : p.leadingCoeff ≠ 0 := Polynomial.leadingCoeff_ne_zero.mpr hp0
  refine hasOnlyRealRoots_of_tendsto_coeff (d := p.natDegree) (a := p.leadingCoeff)
    (P := fun n => (oneMinusCD2 (t / n))^[n] p) (p := heatOp t p) ha ?_ ?_ ?_ ?_ ?_
  · intro n; exact oneMinusCD2_iterate_natDegree _ p n
  · intro n; exact oneMinusCD2_iterate_leadingCoeff _ p n
  · intro n
    rcases Nat.eq_zero_or_pos n with rfl | hn
    · simpa using hp
    · exact oneMinusCD2_iterate_realRooted
        (div_pos htpos (by exact_mod_cast hn)) hp n
  · exact heatOp_natDegree t p
  · intro m; exact oneMinusCD2_iterate_tendsto_heatOp t p m

/-! ## Axiom audit

Each result below should report only the standard mathlib axioms
`propext`, `Classical.choice`, `Quot.sound` — no `sorryAx`. -/

#print axioms derivative_hasRoot_between
#print axioms exists_derivative_root_of_two_roots
#print axioms hasOnlyRealRoots_derivative
#print axioms hasOnlyRealRoots_iterate_derivative
#print axioms exists_shifted_root_between
#print axioms exists_shifted_root_atBot
#print axioms exists_shifted_root_atTop
#print axioms hermitePoulain_card_lower
#print axioms hermitePoulain_shift
#print axioms hasOnlyRealRoots_smul
#print axioms oneMinusCD2_realRooted
#print axioms oneMinusCD2_iterate_realRooted
#print axioms oneMinusCD2_natDegree
#print axioms oneMinusCD2_iterate_natDegree
#print axioms oneMinusCD2_leadingCoeff
#print axioms oneMinusCD2_iterate_leadingCoeff
#print axioms iterate_derivative_add
#print axioms heatPartial_add
#print axioms heatPartial_smul
#print axioms heatPartial_stable
#print axioms heatOp_zero
#print axioms heatOp_add
#print axioms heatOp_smul
#print axioms heatOp_natDegree
#print axioms oneMinusCD2_iterate_eq_sum
#print axioms choose_mul_pow_tendsto
#print axioms oneMinusCD2_iterate_tendsto_heatOp
#print axioms continuous_prod_X_sub_C_coeff
#print axioms hasOnlyRealRoots_of_tendsto_coeff
#print axioms heat_preserves_LP

end Polynomial
