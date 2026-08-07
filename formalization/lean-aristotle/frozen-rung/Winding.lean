import Mathlib

/-!
# Part 2: the winding-form counting identity

This file formalizes the combinatorial core of Part 2 of `frozen-rung-pt-equivalence.tex`
(Theorem 3.2 and Proposition 3.3).

The zeros of `X(w) = ξ(1/2 + w)` inside the band `|Im w| < T` are modelled by a finite
multiset `Zs : Multiset ℂ` (multiplicities included) that is symmetric under `λ ↦ -λ` and lies
in the strip `|Re λ| ≤ 1/2`.  Fixing a level `a ∈ (0, 1/2)` avoiding the real parts of the
zeros, the four counts appearing in Theorem 3.2 are

* `ghostCount a Zs = #{λ : Re λ > a}` — the band ghost count `g(a,T)` (this is also the value
  `V_a(T)` produced by the argument principle on `D_{a,T}`, Standing Input 2.3);
* `centralCount a Zs = #{λ : -a < Re λ < a}` — the central zeros;
* `numCount a Zs`, `denCount a Zs` — the zero counts `Z_num`, `Z_den` of `X(· - a)`, `X(· + a)`
  on `D_T` produced by the argument principle, whose difference is the winding number
  `W_a(T)` of `R_a` on `∂D_T`;
* `bandCount Zs` — the total band count `N_X(T) = 2 N(T)`.

The theorem `FrozenRung.winding_count_identity` proves `Z_num - Z_den = c` and
`N_X = c + 2g`, i.e. exactly the chain `g(a,T) = ½[N_X(T) - W_a(T)] = N(T) - ½ W_a(T)`.
The analytic inputs (the argument principle evaluations of `V_a(T)` and `W_a(T)`) are the
Standing Inputs of the paper and enter `FrozenRung.winding_identity` as hypotheses.
-/

namespace FrozenRung

open Multiset

/-- The band ghost count `g(a,T) = #{λ : X(λ) = 0, Re λ > a, |Im λ| < T}`. -/
noncomputable def ghostCount (a : ℝ) (Zs : Multiset ℂ) : ℕ := Zs.countP fun l => a < l.re

/-- The count of central zeros `#{λ : -a < Re λ < a}`. -/
noncomputable def centralCount (a : ℝ) (Zs : Multiset ℂ) : ℕ :=
  Zs.countP fun l => -a < l.re ∧ l.re < a

/-- `Z_num = #{λ : λ + a ∈ D_T}`, the zero count of the numerator `X(· - a)` on `D_T`. -/
noncomputable def numCount (a : ℝ) (Zs : Multiset ℂ) : ℕ :=
  Zs.countP fun l => 0 < (l + (a : ℂ)).re ∧ (l + (a : ℂ)).re < 1

/-- `Z_den = #{λ : λ - a ∈ D_T}`, the zero count of the denominator `X(· + a)` on `D_T`. -/
noncomputable def denCount (a : ℝ) (Zs : Multiset ℂ) : ℕ :=
  Zs.countP fun l => 0 < (l - (a : ℂ)).re ∧ (l - (a : ℂ)).re < 1

/-- The total band count `N_X(T)`. -/
def bandCount (Zs : Multiset ℂ) : ℕ := Multiset.card Zs

/-- The standing conventions of §3: the level `a` lies in `(0,1/2)`, all zeros lie in the
critical strip `|Re λ| ≤ 1/2`, no zero has real part `±a`, and the zero multiset is symmetric
under `λ ↦ -λ` (the functional equation `X(-w) = X(w)`). -/
structure BandData (a : ℝ) (Zs : Multiset ℂ) : Prop where
  pos : 0 < a
  lt_half : a < 1 / 2
  strip : ∀ l ∈ Zs, |l.re| ≤ 1 / 2
  avoid_pos : ∀ l ∈ Zs, l.re ≠ a
  avoid_neg : ∀ l ∈ Zs, l.re ≠ -a
  symm : Zs.map (fun l => -l) = Zs

section CountP

variable {α : Type*}

/-- Splitting a count along a disjoint disjunction. -/
theorem countP_split (s : Multiset α) (p q r : α → Prop)
    [DecidablePred p] [DecidablePred q] [DecidablePred r]
    (h : ∀ x ∈ s, (p x ↔ (q x ∨ r x))) (hdisj : ∀ x ∈ s, ¬ (q x ∧ r x)) :
    s.countP p = s.countP q + s.countP r := by
  induction s using Multiset.induction with
  | empty => simp
  | cons b s ih =>
      have hmem : ∀ x ∈ s, x ∈ b ::ₘ s := fun x hx => Multiset.mem_cons_of_mem hx
      have ih' := ih (fun x hx => h x (hmem x hx)) (fun x hx => hdisj x (hmem x hx))
      have ha := h b (Multiset.mem_cons_self b s)
      have hda := hdisj b (Multiset.mem_cons_self b s)
      rw [Multiset.countP_cons, Multiset.countP_cons, Multiset.countP_cons, ih']
      by_cases hq : q b
      · by_cases hr : r b
        · exact absurd ⟨hq, hr⟩ hda
        · have hp : p b := ha.2 (Or.inl hq)
          rw [if_pos hp, if_pos hq, if_neg hr]
          omega
      · by_cases hr : r b
        · have hp : p b := ha.2 (Or.inr hr)
          rw [if_pos hp, if_neg hq, if_pos hr]
          omega
        · have hp : ¬ p b := fun hpb => (ha.1 hpb).elim hq hr
          rw [if_neg hp, if_neg hq, if_neg hr]
          omega

end CountP

variable {a : ℝ} {Zs : Multiset ℂ}

theorem denCount_eq_ghostCount (h : BandData a Zs) : denCount a Zs = ghostCount a Zs := by
  refine Multiset.countP_congr rfl ?_
  intro l hl
  have hs := h.strip l hl
  rw [abs_le] at hs
  simp only [Complex.sub_re, Complex.ofReal_re]
  rw [eq_iff_iff]
  constructor
  · rintro ⟨h1, -⟩; linarith
  · intro h1; exact ⟨by linarith, by linarith [h.pos]⟩

theorem numCount_eq (h : BandData a Zs) :
    numCount a Zs = centralCount a Zs + ghostCount a Zs := by
  have hnum : numCount a Zs = Zs.countP fun l => -a < l.re := by
    refine Multiset.countP_congr rfl ?_
    intro l hl
    have hs := h.strip l hl
    rw [abs_le] at hs
    simp only [Complex.add_re, Complex.ofReal_re]
    rw [eq_iff_iff]
    constructor
    · rintro ⟨h1, -⟩; linarith
    · intro h1; exact ⟨by linarith, by linarith [h.lt_half]⟩
  rw [hnum]
  simp only [centralCount, ghostCount]
  refine countP_split Zs (fun l : ℂ => -a < l.re) (fun l : ℂ => -a < l.re ∧ l.re < a)
    (fun l : ℂ => a < l.re) ?_ ?_
  · intro l hl
    have hne := h.avoid_pos l hl
    constructor
    · intro h1
      rcases lt_trichotomy l.re a with h2 | h2 | h2
      · exact Or.inl ⟨h1, h2⟩
      · exact absurd h2 hne
      · exact Or.inr h2
    · rintro (⟨h1, -⟩ | h1)
      · exact h1
      · linarith [h.pos]
  · rintro l - ⟨⟨-, h1⟩, h2⟩
    linarith

theorem bandCount_eq (h : BandData a Zs) :
    bandCount Zs = centralCount a Zs + 2 * ghostCount a Zs := by
  have hsymcount : (Zs.countP fun l => l.re < -a) = ghostCount a Zs := by
    conv_lhs => rw [← h.symm]
    rw [Multiset.countP_map, ghostCount, Multiset.countP_eq_card_filter]
    refine congrArg Multiset.card (Multiset.filter_congr ?_)
    intro l _
    simp only [Complex.neg_re]
    constructor
    · intro h1; linarith
    · intro h1; linarith
  have hsplit : bandCount Zs =
      (Zs.countP fun l => l.re < -a) + Zs.countP fun l => -a < l.re := by
    have hc : (Zs.countP fun _ : ℂ => True) = bandCount Zs :=
      Multiset.countP_eq_card.2 (fun _ _ => trivial)
    rw [← hc]
    refine countP_split Zs (fun _ : ℂ => True) (fun l : ℂ => l.re < -a)
      (fun l : ℂ => -a < l.re) ?_ ?_
    · intro l hl
      have hne := h.avoid_neg l hl
      simp only [true_iff]
      rcases lt_trichotomy l.re (-a) with h2 | h2 | h2
      · exact Or.inl h2
      · exact absurd h2 hne
      · exact Or.inr h2
    · rintro l - ⟨h1, h2⟩; linarith
  have hpos : (Zs.countP fun l => -a < l.re) = centralCount a Zs + ghostCount a Zs := by
    rw [← numCount_eq h]
    refine (Multiset.countP_congr rfl ?_).symm
    intro l hl
    have hs := h.strip l hl
    rw [abs_le] at hs
    simp only [Complex.add_re, Complex.ofReal_re]
    rw [eq_iff_iff]
    constructor
    · rintro ⟨h1, -⟩; linarith
    · intro h1; exact ⟨by linarith, by linarith [h.lt_half]⟩
  rw [hsplit, hsymcount, hpos]
  ring

/-- **Theorem 3.2 (winding identity), counting core.** With the boundary-avoidance conventions
of §3, the difference of the numerator and denominator zero counts on `D_T` is the number of
central zeros, and the total band count splits as `N_X = c + 2g`.  Consequently
`2 g(a,T) = N_X(T) - W_a(T)` with `W_a(T) = Z_num - Z_den`. -/
theorem winding_count_identity (h : BandData a Zs) :
    ((numCount a Zs : ℤ) - denCount a Zs = centralCount a Zs) ∧
    ((bandCount Zs : ℤ) = centralCount a Zs + 2 * ghostCount a Zs) ∧
    (2 * (ghostCount a Zs : ℤ) = bandCount Zs - ((numCount a Zs : ℤ) - denCount a Zs)) := by
  have h1 := numCount_eq h
  have h2 := denCount_eq_ghostCount h
  have h3 := bandCount_eq h
  refine ⟨by omega, by exact_mod_cast h3, by omega⟩

/-- **Theorem 3.2 (winding identity).** Let `V_a(T)` be the value of the argument-principle
contour integral over `∂D_{a,T}` (Standing Input 2.3: it equals the number of zeros of `X` in
`D_{a,T}`, i.e. `g(a,T)`), let `W_a(T)` be the winding number of `R_a` over `∂D_T`
(the argument principle again: it equals `Z_num - Z_den`), and let `N(T)` be the half-band
count, `N_X(T) = 2 N(T)`.  Then
`g(a,T) = V_a(T) = ½ [N_X(T) - W_a(T)] = N(T) - ½ W_a(T)`. -/
theorem winding_identity (h : BandData a Zs) (Va Wa Nhalf : ℤ)
    (hVa : Va = ghostCount a Zs)
    (hWa : Wa = (numCount a Zs : ℤ) - denCount a Zs)
    (hN : (bandCount Zs : ℤ) = 2 * Nhalf) :
    Va = ghostCount a Zs ∧ 2 * (ghostCount a Zs : ℤ) = bandCount Zs - Wa ∧
      (ghostCount a Zs : ℤ) = Nhalf - Wa / 2 := by
  obtain ⟨e1, e2, e3⟩ := winding_count_identity h
  refine ⟨hVa, by omega, ?_⟩
  have hWaeven : Wa = 2 * (Nhalf - ghostCount a Zs) := by omega
  rw [hWaeven]
  omega

/-! ## Proposition 3.3: the equivalence chain -/

/-- **Proposition 3.3, (i) ⟺ (ii).** For a zero multiset symmetric under `λ ↦ -λ`, every zero
lies on the critical line if and only if the winding-form certificate passes at every level
`a > 0`, i.e. `g(a,T) = 0` for all `a > 0`. -/
theorem critical_line_iff_no_ghosts (hsym : Zs.map (fun l => -l) = Zs) :
    (∀ l ∈ Zs, l.re = 0) ↔ ∀ a : ℝ, 0 < a → ghostCount a Zs = 0 := by
  constructor
  · intro h a ha
    rw [ghostCount, Multiset.countP_eq_zero]
    intro l hl
    rw [h l hl]
    exact not_lt.2 ha.le
  · intro h l hl
    by_contra hne
    have hmem : ∀ z ∈ Zs, -z ∈ Zs := by
      intro z hz
      have : -z ∈ Zs.map (fun l => -l) := Multiset.mem_map_of_mem _ hz
      rwa [hsym] at this
    obtain ⟨w, hw, hwpos⟩ : ∃ w ∈ Zs, 0 < w.re := by
      rcases lt_trichotomy l.re 0 with h1 | h1 | h1
      · exact ⟨-l, hmem l hl, by simp; linarith⟩
      · exact absurd h1 hne
      · exact ⟨l, hl, h1⟩
    have hg := h (w.re / 2) (by linarith)
    rw [ghostCount, Multiset.countP_eq_zero] at hg
    exact hg w hw (by linarith)

/-! ## Proposition 3.3: uncancelled ghosts (the v70 coprimality correction) -/

/-- A zero configuration with multiplicities: `mult λ` is the multiplicity of `λ` as a zero of
`X`, positive exactly on the finite set `supp`. -/
structure ZeroConfig where
  /-- The multiplicity function. -/
  mult : ℂ → ℕ
  /-- The (finite) support of the multiplicity function. -/
  supp : Finset ℂ
  /-- `supp` is exactly where `mult` is positive. -/
  mem_supp : ∀ z, z ∈ supp ↔ 0 < mult z

/-- There is a ghost at level `a`: a zero with real part exceeding `a`. -/
def ZeroConfig.HasGhost (Z : ZeroConfig) (a : ℝ) : Prop := ∃ l ∈ Z.supp, a < l.re

/-- There is an *uncancelled* ghost at level `a`: a zero `λ` with `Re λ > a` whose
multiplicity is not matched by that of the translate `λ - 2a`, so that the ghost pole
`α = λ - a` of `R_a` survives with multiplicity `[m(λ) - m(λ-2a)]₊ > 0`. -/
def ZeroConfig.HasUncancelledGhost (Z : ZeroConfig) (a : ℝ) : Prop :=
  ∃ l ∈ Z.supp, a < l.re ∧ Z.mult (l - 2 * a) < Z.mult l

/-- **Proposition 3.3, (ii) ⟺ (iii).** Ghost-freeness at every level is equivalent to
uncancelled-ghost-freeness at every level.  The forward direction is immediate; the converse
uses that, for a fixed zero `λ₀` with `Re λ₀ = δ > 0`, cancellation `X(λ₀ - 2a) = 0` can occur
for only finitely many levels `a`, while `(0, δ)` is infinite. -/
theorem no_ghosts_iff_no_uncancelled_ghosts (Z : ZeroConfig) :
    (∀ a : ℝ, 0 < a → ¬ Z.HasGhost a) ↔ (∀ a : ℝ, 0 < a → ¬ Z.HasUncancelledGhost a) := by
  constructor
  · rintro h a ha ⟨l, hl, hlre, -⟩
    exact h a ha ⟨l, hl, hlre⟩
  · intro h a ha ⟨l, hl, hlre⟩
    -- the levels at which `l` is cancelled are contained in a finite set
    set bad : Finset ℝ := Z.supp.image (fun z => (l.re - z.re) / 2) with hbad
    have hinf : (Set.Ioo 0 l.re \ (bad : Set ℝ)).Infinite :=
      (Set.Ioo_infinite (by linarith)).diff bad.finite_toSet
    obtain ⟨b, hb⟩ := hinf.nonempty
    have hb1 : 0 < b := hb.1.1
    have hb2 : b < l.re := hb.1.2
    have hbnotbad : b ∉ bad := hb.2
    refine h b hb1 ⟨l, hl, hb2, ?_⟩
    have hmul : Z.mult (l - 2 * b) = 0 := by
      by_contra hc
      have hmem : (l - 2 * (b:ℂ)) ∈ Z.supp := (Z.mem_supp _).2 (Nat.pos_of_ne_zero hc)
      refine hbnotbad ?_
      rw [hbad, Finset.mem_image]
      exact ⟨l - 2 * (b:ℂ), hmem, by simp⟩
    rw [hmul]
    exact (Z.mem_supp l).1 hl

end FrozenRung
