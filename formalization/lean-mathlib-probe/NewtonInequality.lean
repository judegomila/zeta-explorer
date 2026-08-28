/-
  NewtonInequality — full proof of Newton's inequalities for real-rooted polynomials,
  ported from the Aristotle-verified development
  `formalization/lean-aristotle/newton_inequality/RequestProject/NewtonInequality.lean`
  (toolchain v4.28) onto this probe's toolchain (v4.22.0) and its existing
  `MathlibBridge.HasOnlyRealRoots` predicate (definitionally identical:
  `Multiset.card p.roots = p.natDegree`).

  Structure of the proof (unchanged from the delivered development):
  * `newton_low_aux` / `newton_low` — the bottom index triple `(0, 1, 2)` in
    cleared-denominator form `2·n·a₀·a₂ ≤ (n−1)·a₁²`, by induction on the degree,
    peeling off one linear factor `X − r` per step; the induction step is an exact
    algebraic identity whose right-hand side is a square plus a nonnegative multiple
    of the inductive hypothesis.
  * `coeff_div_choose_derivative` — differentiation transports the normalized
    coefficients: `p'ⱼ / C(n−1, j) = n · (pⱼ₊₁ / C(n, j+1))`.
  * `newton_inequality_aux` / `newton_inequality` — induction on `k`: differentiating
    (real-rootedness preserved by `MathlibBridge.hasOnlyRealRoots_derivative`) shifts
    the index triple down by one while scaling all three normalized coefficients by
    the same positive factor `n`, reducing to the `k = 1` case (`newton_low`).

  v4.28 → v4.22 API deltas bridged in this port:
  * `p.Splits` (bare, over `id`) → `Polynomial.Splits (RingHom.id ℝ) p`;
  * `Polynomial.Splits.of_dvd` → `Polynomial.splits_of_splits_of_dvd`;
  * `Nat.add_one_mul_choose_eq` → `Nat.succ_mul_choose_eq` (+ `Nat.succ_eq_add_one`);
  * the local `HasOnlyRealRoots` / `hasOnlyRealRoots_derivative` of the delivered file
    are replaced by the probe's existing `MathlibBridge` versions.
-/
import Mathlib
import MathlibBridge

open scoped BigOperators
open scoped Nat
open scoped Classical

set_option maxHeartbeats 1000000

namespace NewtonInequality

open Polynomial
open MathlibBridge

/-- The natural degree of the derivative of a nonconstant real polynomial. -/
lemma natDegree_derivative_eq_sub_one {p : ℝ[X]} (hp : 0 < p.natDegree) :
    (Polynomial.derivative p).natDegree = p.natDegree - 1 :=
  Polynomial.natDegree_eq_of_degree_eq_some (Polynomial.degree_derivative_eq p hp)

/-- Auxiliary form of Newton's inequality at the bottom index triple `(0, 1, 2)`, proved by
induction on the degree by peeling off a linear factor. -/
lemma newton_low_aux : ∀ (N : ℕ) (p : ℝ[X]), p.natDegree ≤ N → HasOnlyRealRoots p →
    2 * (p.natDegree : ℝ) * p.coeff 0 * p.coeff 2
      ≤ ((p.natDegree : ℝ) - 1) * (p.coeff 1) ^ 2 := by
  intro N
  induction N with
  | zero =>
      intro p hpN _
      have h0 : p.natDegree = 0 := Nat.le_zero.mp hpN
      have c1 : p.coeff 1 = 0 := Polynomial.coeff_eq_zero_of_natDegree_lt (by omega)
      have c2 : p.coeff 2 = 0 := Polynomial.coeff_eq_zero_of_natDegree_lt (by omega)
      simp [c1, c2]
  | succ N ih =>
      intro p hpN hp
      have hp' : Multiset.card p.roots = p.natDegree := hp
      by_cases h2 : p.natDegree ≤ 1
      · have c2 : p.coeff 2 = 0 := Polynomial.coeff_eq_zero_of_natDegree_lt (by omega)
        rcases Nat.lt_or_ge p.natDegree 1 with h | h
        · have c1 : p.coeff 1 = 0 := Polynomial.coeff_eq_zero_of_natDegree_lt (by omega)
          simp [c1, c2]
        · have h1 : p.natDegree = 1 := by omega
          simp [c2, h1]
      · push_neg at h2
        have hp0 : p ≠ 0 := fun h => by simp [h] at h2
        have hroots : p.roots ≠ 0 := by
          intro h
          rw [h] at hp'
          simp at hp'
          omega
        obtain ⟨r, hr⟩ := Multiset.exists_mem_of_ne_zero hroots
        have hrr : p.IsRoot r := Polynomial.isRoot_of_mem_roots hr
        set g := p /ₘ (X - C r) with hgdef
        have hfac : (X - C r) * g = p := Polynomial.mul_divByMonic_eq_iff_isRoot.mpr hrr
        have hexp : p = X * g - C r * g := by rw [← hfac]; ring
        have hg0 : g ≠ 0 := by
          intro h
          rw [h, mul_zero] at hfac
          exact hp0 hfac.symm
        have hdeg : p.natDegree = g.natDegree + 1 := by
          rw [← hfac, Polynomial.natDegree_mul (Polynomial.X_sub_C_ne_zero r) hg0,
            Polynomial.natDegree_X_sub_C]
          ring
        have hgsplit : HasOnlyRealRoots g := by
          have hps : Polynomial.Splits (RingHom.id ℝ) p :=
            Polynomial.splits_iff_card_roots.mpr hp'
          have hdvd : g ∣ p := ⟨X - C r, by rw [← hfac]; ring⟩
          exact Polynomial.splits_iff_card_roots.mp
            (Polynomial.splits_of_splits_of_dvd (RingHom.id ℝ) hp0 hps hdvd)
        have hIH := ih g (by omega) hgsplit
        have c0 : p.coeff 0 = -r * g.coeff 0 := by rw [hexp]; simp
        have c1 : p.coeff 1 = g.coeff 0 - r * g.coeff 1 := by rw [hexp]; simp
        have c2 : p.coeff 2 = g.coeff 1 - r * g.coeff 2 := by rw [hexp]; simp
        set m : ℝ := (g.natDegree : ℝ) with hm
        have hmpos : (1 : ℝ) ≤ m := by
          rw [hm]; exact_mod_cast (show 1 ≤ g.natDegree by omega)
        have hm0 : (0 : ℝ) < m := lt_of_lt_of_le zero_lt_one hmpos
        have hnm : (p.natDegree : ℝ) = m + 1 := by rw [hdeg, hm]; push_cast; ring
        have E : 0 ≤ (m - 1) * (g.coeff 1) ^ 2 - 2 * m * g.coeff 0 * g.coeff 2 := by linarith
        -- The exact algebraic identity behind the induction step.
        have key : m * (((p.natDegree : ℝ) - 1) * (p.coeff 1) ^ 2
              - 2 * (p.natDegree : ℝ) * p.coeff 0 * p.coeff 2)
            = (m * g.coeff 0 + r * g.coeff 1) ^ 2
              + (m + 1) * r ^ 2 * ((m - 1) * (g.coeff 1) ^ 2 - 2 * m * g.coeff 0 * g.coeff 2) := by
          rw [hnm, c0, c1, c2]; ring
        have hrhs : (0 : ℝ) ≤ (m * g.coeff 0 + r * g.coeff 1) ^ 2
              + (m + 1) * r ^ 2 * ((m - 1) * (g.coeff 1) ^ 2 - 2 * m * g.coeff 0 * g.coeff 2) :=
          add_nonneg (sq_nonneg _) (mul_nonneg (mul_nonneg (by linarith) (sq_nonneg r)) E)
        have h3 : 0 ≤ m * (((p.natDegree : ℝ) - 1) * (p.coeff 1) ^ 2
              - 2 * (p.natDegree : ℝ) * p.coeff 0 * p.coeff 2) := by rw [key]; exact hrhs
        nlinarith [h3, hm0]

/-- Newton's inequality at the bottom index triple `(0, 1, 2)`, in cleared-denominator form:
for a real-rooted `p` of degree `n`, `2 n a₀ a₂ ≤ (n - 1) a₁²`. -/
lemma newton_low {p : ℝ[X]} (hp : HasOnlyRealRoots p) :
    2 * (p.natDegree : ℝ) * p.coeff 0 * p.coeff 2
      ≤ ((p.natDegree : ℝ) - 1) * (p.coeff 1) ^ 2 :=
  newton_low_aux p.natDegree p le_rfl hp

/-- Transport of the normalized coefficients under differentiation:
`p'ⱼ / C(n-1, j) = n · (pⱼ₊₁ / C(n, j+1))`. -/
lemma coeff_div_choose_derivative (p : ℝ[X]) (hp : 1 ≤ p.natDegree) (j : ℕ) :
    (Polynomial.derivative p).coeff j
        / (((Polynomial.derivative p).natDegree.choose j : ℕ) : ℝ)
      = (p.natDegree : ℝ) * (p.coeff (j + 1) / ((p.natDegree.choose (j + 1) : ℕ) : ℝ)) := by
  set n := p.natDegree with hn
  have hd : (Polynomial.derivative p).natDegree = n - 1 :=
    natDegree_derivative_eq_sub_one hp
  have key : n * ((n - 1).choose j) = (n.choose (j + 1)) * (j + 1) := by
    have := Nat.succ_mul_choose_eq (n - 1) j
    simp only [Nat.succ_eq_add_one] at this
    rwa [Nat.sub_add_cancel hp] at this
  rw [hd, Polynomial.coeff_derivative]
  by_cases hj : j ≤ n - 1
  · have h1' : (((n - 1).choose j : ℕ) : ℝ) ≠ 0 :=
      Nat.cast_ne_zero.mpr (Nat.choose_pos hj).ne'
    have h2' : ((n.choose (j + 1) : ℕ) : ℝ) ≠ 0 :=
      Nat.cast_ne_zero.mpr (Nat.choose_pos (by omega : j + 1 ≤ n)).ne'
    have keyR : (n : ℝ) * (((n - 1).choose j : ℕ) : ℝ)
        = ((n.choose (j + 1) : ℕ) : ℝ) * ((j : ℝ) + 1) := by
      exact_mod_cast congrArg (fun m : ℕ => (m : ℝ)) key
    field_simp
    linear_combination (-p.coeff (j + 1)) * keyR
  · have h1 : ((n - 1).choose j) = 0 := Nat.choose_eq_zero_of_lt (by omega)
    have h2 : (n.choose (j + 1)) = 0 := Nat.choose_eq_zero_of_lt (by omega)
    simp [h1, h2]

/-- Newton's inequality, proved by induction on `k`: differentiating shifts the index triple
down by one while multiplying all three normalized coefficients by the same positive factor `n`,
so the case `k = 1` (handled by `newton_low`) suffices. -/
theorem newton_inequality_aux : ∀ (k : ℕ) (p : ℝ[X]), HasOnlyRealRoots p → 1 ≤ k →
    k + 1 ≤ p.natDegree →
    (p.coeff (k - 1) / (p.natDegree.choose (k - 1) : ℝ))
        * (p.coeff (k + 1) / (p.natDegree.choose (k + 1) : ℝ))
      ≤ (p.coeff k / (p.natDegree.choose k : ℝ)) ^ 2 := by
  intro k
  induction k with
  | zero => intro p _ h _; exact absurd h (by omega)
  | succ k ih =>
      intro p hp _ hk
      rcases Nat.eq_zero_or_pos k with hk0 | hk0
      · subst hk0
        simp only [zero_add] at *
        have hn2 : 2 ≤ p.natDegree := by omega
        have hnR : (2 : ℝ) ≤ (p.natDegree : ℝ) := by exact_mod_cast hn2
        have hc0 : ((p.natDegree.choose 0 : ℕ) : ℝ) = 1 := by simp
        have hc1 : ((p.natDegree.choose 1 : ℕ) : ℝ) = (p.natDegree : ℝ) := by
          simp [Nat.choose_one_right]
        have hc2N : p.natDegree * (p.natDegree - 1) = p.natDegree.choose 2 * 2 := by
          have := Nat.succ_mul_choose_eq (p.natDegree - 1) 1
          simp only [Nat.succ_eq_add_one] at this
          rw [Nat.sub_add_cancel (by omega)] at this
          simpa [Nat.choose_one_right] using this
        have hc2 : ((p.natDegree.choose 2 : ℕ) : ℝ)
            = (p.natDegree : ℝ) * ((p.natDegree : ℝ) - 1) / 2 := by
          have h := congrArg (fun m : ℕ => (m : ℝ)) hc2N
          push_cast [Nat.cast_sub (show 1 ≤ p.natDegree by omega)] at h
          linarith
        have hlow := newton_low hp
        have hnpos : (0 : ℝ) < (p.natDegree : ℝ) := by linarith
        have hn1 : (0 : ℝ) < (p.natDegree : ℝ) - 1 := by linarith
        rw [hc0, hc1, hc2]
        have hid : (p.coeff 1 / (p.natDegree : ℝ)) ^ 2
            - p.coeff 0 / 1 * (p.coeff 2 / ((p.natDegree : ℝ) * ((p.natDegree : ℝ) - 1) / 2))
            = (((p.natDegree : ℝ) - 1) * (p.coeff 1) ^ 2
                - 2 * (p.natDegree : ℝ) * p.coeff 0 * p.coeff 2)
              / ((p.natDegree : ℝ) ^ 2 * ((p.natDegree : ℝ) - 1)) := by
          field_simp
          ring
        have hnn : (0 : ℝ) ≤ (((p.natDegree : ℝ) - 1) * (p.coeff 1) ^ 2
                - 2 * (p.natDegree : ℝ) * p.coeff 0 * p.coeff 2)
              / ((p.natDegree : ℝ) ^ 2 * ((p.natDegree : ℝ) - 1)) :=
          div_nonneg (by linarith) (by positivity)
        linarith [hid, hnn]
      · have hn : 1 ≤ p.natDegree := by omega
        have hqrr : HasOnlyRealRoots (Polynomial.derivative p) := hasOnlyRealRoots_derivative hp
        have hqdeg : (Polynomial.derivative p).natDegree = p.natDegree - 1 :=
          natDegree_derivative_eq_sub_one hn
        have hqk : k + 1 ≤ (Polynomial.derivative p).natDegree := by omega
        have hIH := ih (Polynomial.derivative p) hqrr hk0 hqk
        have e1 := coeff_div_choose_derivative p hn (k - 1)
        have e2 := coeff_div_choose_derivative p hn k
        have e3 := coeff_div_choose_derivative p hn (k + 1)
        rw [Nat.sub_add_cancel hk0] at e1
        rw [e1, e2, e3] at hIH
        have hnpos : (0 : ℝ) < (p.natDegree : ℝ) := by
          have : 0 < p.natDegree := by omega
          exact_mod_cast this
        have hsq : (0 : ℝ) < (p.natDegree : ℝ) ^ 2 := by positivity
        simp only [Nat.add_sub_cancel]
        refine le_of_mul_le_mul_left ?_ hsq
        calc (p.natDegree : ℝ) ^ 2 * (p.coeff k / ((p.natDegree.choose k : ℕ) : ℝ)
              * (p.coeff (k + 1 + 1) / ((p.natDegree.choose (k + 1 + 1) : ℕ) : ℝ)))
            = ((p.natDegree : ℝ) * (p.coeff k / ((p.natDegree.choose k : ℕ) : ℝ)))
              * ((p.natDegree : ℝ) * (p.coeff (k + 1 + 1)
                  / ((p.natDegree.choose (k + 1 + 1) : ℕ) : ℝ))) := by ring
          _ ≤ ((p.natDegree : ℝ) * (p.coeff (k + 1)
                / ((p.natDegree.choose (k + 1) : ℕ) : ℝ))) ^ 2 := hIH
          _ = (p.natDegree : ℝ) ^ 2 * (p.coeff (k + 1)
                / ((p.natDegree.choose (k + 1) : ℕ) : ℝ)) ^ 2 := by ring

/-- **Newton's inequality.**  For a real polynomial `p` all of whose roots are real, the
normalized coefficients `p.coeff k / (p.natDegree.choose k)` are log-concave:
`p̃ₖ₋₁ · p̃ₖ₊₁ ≤ p̃ₖ²` for `1 ≤ k ≤ p.natDegree - 1`. -/
theorem newton_inequality {p : ℝ[X]} (hp : HasOnlyRealRoots p) {k : ℕ}
    (hk0 : 1 ≤ k) (hk : k + 1 ≤ p.natDegree) :
    (p.coeff (k - 1) / (p.natDegree.choose (k - 1) : ℝ))
        * (p.coeff (k + 1) / (p.natDegree.choose (k + 1) : ℝ))
      ≤ (p.coeff k / (p.natDegree.choose k : ℝ)) ^ 2 :=
  newton_inequality_aux k p hp hk0 hk

end NewtonInequality
