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

/-- (i), right half. -/
theorem stagePoly_ne_zero_right {n : ℕ} (K : Fin n → Fin n → ℝ) (κ ℓ : Fin n → ℝ)
    (hℓ : ∀ p, 0 < ℓ p) (hLY : LeeYangProp K) (s : ℂ)
    (hs : ∀ p, abscissa K κ ℓ p < s.re) : stagePoly K κ ℓ s ≠ 0 := by
  sorry

/-- (i), left half. -/
theorem stagePoly_ne_zero_left {n : ℕ} (K : Fin n → Fin n → ℝ) (κ ℓ : Fin n → ℝ)
    (hℓ : ∀ p, 0 < ℓ p) (hLY : LeeYangProp K) (s : ℂ)
    (hs : ∀ p, s.re < abscissa K κ ℓ p) : stagePoly K κ ℓ s ≠ 0 := by
  sorry

/-- (ii), zeros on the line `Re s = a`. -/
theorem stagePoly_zero_on_line {n : ℕ} (hn : 0 < n) (K : Fin n → Fin n → ℝ) (κ ℓ : Fin n → ℝ)
    (hℓ : ∀ p, 0 < ℓ p) (hLY : LeeYangProp K) (a : ℝ)
    (ha : ∀ p, abscissa K κ ℓ p = a) (s : ℂ) (hzero : stagePoly K κ ℓ s = 0) : s.re = a := by
  sorry

/-- (ii), self-duality.  No Lee–Yang input and no sign condition on `K`; `K` symmetric. -/
theorem stagePoly_self_dual {n : ℕ} (K : Fin n → Fin n → ℝ) (κ ℓ : Fin n → ℝ)
    (hsymm : ∀ p q, K p q = K q p) (hℓ : ∀ p, 0 < ℓ p) (a : ℝ)
    (ha : ∀ p, abscissa K κ ℓ p = a) (s : ℂ) :
    stagePoly K κ ℓ (2 * (a : ℂ) - s)
      = Complex.exp ((s - (a : ℂ)) * ((∑ p, ℓ p : ℝ) : ℂ)) * stagePoly K κ ℓ s := by
  sorry

/-- The Dirichlet polynomial `∑_{d | M} w(d) d^{-s}` over the divisors `d = ∏_{p ∈ S} P p` of the
squarefree `M = ∏ P p`, with `w(d) = exp(∑_{p<q, pq | d} K p q)` (fields `κ = 0`). -/
def dirichletStage {n : ℕ} (K : Fin n → Fin n → ℝ) (P : Fin n → ℕ) (s : ℂ) : ℂ :=
  ∑ S : Finset (Fin n),
    (Real.exp (∑ p ∈ S, ∑ q ∈ S, if p < q then K p q else 0) : ℂ)
      * (((∏ p ∈ S, P p : ℕ) : ℂ)) ^ (-s)

/-- (iii), sum rule: all zeros on the critical line. -/
theorem dirichletStage_zero_on_critical_line {n : ℕ} (hn : 0 < n)
    (K : Fin n → Fin n → ℝ) (P : Fin n → ℕ)
    (hP : ∀ p, (P p).Prime) (hinj : Function.Injective P)
    (hsymm : ∀ p q, K p q = K q p) (hnn : ∀ p q, 0 ≤ K p q)
    (hsum : ∀ p, rowSum K p = Real.log (P p))
    (hLY : LeeYangProp K) (s : ℂ) (hzero : dirichletStage K P s = 0) : s.re = 1 / 2 := by
  sorry

/-- (iii), sum rule: functional equation `Z(1 - s) = M^{s - 1/2} Z(s)`. -/
theorem dirichletStage_functional_equation {n : ℕ}
    (K : Fin n → Fin n → ℝ) (P : Fin n → ℕ)
    (hP : ∀ p, (P p).Prime) (hinj : Function.Injective P)
    (hsymm : ∀ p q, K p q = K q p)
    (hsum : ∀ p, rowSum K p = Real.log (P p)) (s : ℂ) :
    dirichletStage K P (1 - s)
      = (((∏ p, P p : ℕ) : ℂ)) ^ (s - 1 / 2) * dirichletStage K P s := by
  sorry

end
