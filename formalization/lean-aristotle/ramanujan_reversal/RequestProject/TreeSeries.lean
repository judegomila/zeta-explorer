import RequestProject.Triangle
import RequestProject.AbelIdentity

/-!
# The tree function and the row sums of the crossover triangle

Let `T = ∑_{n≥1} n^{n-1} X^n / n!` be the (exponential) tree function.  Abel's identity
(`RamanujanReversal.treeCoeff_conv`) shows that `T` satisfies the differential equation
`X (1 - T) T' = T`.

The main computation of this file is `crossQ_star`:
`X^n (1-T)^{2n-1} (d/dX)^n T = T^n · P_n(1-T)`, where `P_n` is the crossover triangle
polynomial.  Extracting the coefficient of `X^n` yields `P_n(1) = n!·[X^n] T = n^{n-1}`.
-/

namespace RamanujanReversal

open PowerSeries Polynomial

/-- The tree function `T = ∑_{n ≥ 1} n^{n-1} X^n / n!`. -/
noncomputable def treeSeries : ℚ⟦X⟧ := PowerSeries.mk treeCoeff

@[simp] lemma coeff_treeSeries (n : ℕ) : PowerSeries.coeff n treeSeries = treeCoeff n :=
  PowerSeries.coeff_mk n _

/-- `T` with the leading `X` divided out. -/
noncomputable def treeSeriesShift : ℚ⟦X⟧ := PowerSeries.mk (fun n => treeCoeff (n + 1))

lemma treeSeries_eq_X_mul : treeSeries = PowerSeries.X * treeSeriesShift := by
  ext n
  cases n with
  | zero => simp [treeSeriesShift, PowerSeries.coeff_zero_eq_constantCoeff]
  | succ m => simp [treeSeriesShift, PowerSeries.coeff_succ_X_mul]

@[simp] lemma constantCoeff_treeSeriesShift :
    PowerSeries.constantCoeff treeSeriesShift = 1 := by
  simp [treeSeriesShift]

@[simp] lemma constantCoeff_treeSeries : PowerSeries.constantCoeff treeSeries = 0 := by
  simp [← PowerSeries.coeff_zero_eq_constantCoeff]

/-- **The differential equation of the tree function**: `X (1 - T) T' = T`. -/
lemma treeSeries_ode : PowerSeries.X * (1 - treeSeries) * (d⁄dX ℚ) treeSeries = treeSeries := by
  ext n
  cases n with
  | zero => simp [PowerSeries.coeff_zero_eq_constantCoeff]
  | succ m =>
      have h1 : PowerSeries.X * (1 - treeSeries) * (d⁄dX ℚ) treeSeries
          = PowerSeries.X * ((d⁄dX ℚ) treeSeries)
            - PowerSeries.X * (treeSeries * (d⁄dX ℚ) treeSeries) := by ring
      rw [h1, map_sub, PowerSeries.coeff_succ_X_mul, PowerSeries.coeff_succ_X_mul,
        PowerSeries.coeff_derivative, PowerSeries.coeff_mul,
        Finset.Nat.sum_antidiagonal_eq_sum_range_succ_mk]
      simp only [coeff_treeSeries, PowerSeries.coeff_derivative]
      have hconv := treeCoeff_conv (m + 1) (by omega)
      have hsum : ∑ x ∈ Finset.range m.succ,
            treeCoeff x * (treeCoeff (m - x + 1) * (((m - x : ℕ) : ℚ) + 1))
          = ∑ i ∈ Finset.range (m + 1),
              (((m : ℚ) + 1) - i) * treeCoeff i * treeCoeff (m + 1 - i) := by
        refine Finset.sum_congr rfl (fun x hx => ?_)
        have hx' : x ≤ m := by simpa [Nat.lt_succ_iff] using hx
        have h1 : m + 1 - x = m - x + 1 := by omega
        have h2 : ((m - x : ℕ) : ℚ) + 1 = ((m : ℚ) + 1) - x := by
          have h3 : ((m - x : ℕ) : ℚ) = (m : ℚ) - x := by push_cast [hx']; ring
          rw [h3]; ring
        rw [h1, h2]
        ring
      rw [hsum]
      push_cast at hconv
      linarith

/-- `Q_n = P_n(1 - T)`, the crossover polynomial evaluated at `1 - T`. -/
noncomputable def crossQ (n : ℕ) : ℚ⟦X⟧ := Polynomial.aeval (1 - treeSeries) (crossoverPoly ℚ n)

lemma derivative_aeval (p : ℚ[X]) :
    (d⁄dX ℚ) (Polynomial.aeval (1 - treeSeries) p)
      = Polynomial.aeval (1 - treeSeries) (Polynomial.derivative p) * (-(d⁄dX ℚ) treeSeries) := by
  have h := Derivation.comp_aeval_eq (R := ℚ) (A := ℚ⟦X⟧) (M := ℚ⟦X⟧) (1 - treeSeries) (d⁄dX ℚ) p
  simp only [smul_eq_mul] at h
  rw [h]
  simp

lemma crossQ_succ (N : ℕ) (hN : 1 ≤ N) :
    crossQ (N + 1) = ((N : ℚ⟦X⟧) * (1 - treeSeries) + (2 * (N : ℚ⟦X⟧) - 1)) * crossQ N
      - (1 - treeSeries)
        * Polynomial.aeval (1 - treeSeries) (Polynomial.derivative (crossoverPoly ℚ N)) := by
  rw [crossQ, crossoverPoly_succ N hN]
  simp only [map_sub, map_mul, map_add, Polynomial.aeval_X, crossQ, map_ofNat, map_natCast, map_one]

/-- The key identity: `X^n (1-T)^{2n-1} (d/dX)^n T = T^n P_n(1-T)`. -/
theorem crossQ_star (m : ℕ) :
    PowerSeries.X ^ (m + 1) * (1 - treeSeries) ^ (2 * m + 1)
        * ((⇑(d⁄dX ℚ))^[m + 1] treeSeries)
      = treeSeries ^ (m + 1) * crossQ (m + 1) := by
  induction m with
  | zero => simpa [crossQ] using treeSeries_ode
  | succ m ih =>
      have hDy : (d⁄dX ℚ) (1 - treeSeries) = -(d⁄dX ℚ) treeSeries := by simp
      have hiter : (⇑(d⁄dX ℚ))^[m + 2] treeSeries
          = (d⁄dX ℚ) ((⇑(d⁄dX ℚ))^[m + 1] treeSeries) := by
        rw [Function.iterate_succ_apply']
      have hDexp : ((m : ℚ⟦X⟧) + 1) * PowerSeries.X ^ m * (1 - treeSeries) ^ (2 * m + 1)
              * ((⇑(d⁄dX ℚ))^[m + 1] treeSeries)
            - (2 * (m : ℚ⟦X⟧) + 1) * PowerSeries.X ^ (m + 1) * (1 - treeSeries) ^ (2 * m)
              * ((d⁄dX ℚ) treeSeries) * ((⇑(d⁄dX ℚ))^[m + 1] treeSeries)
            + PowerSeries.X ^ (m + 1) * (1 - treeSeries) ^ (2 * m + 1)
              * ((d⁄dX ℚ) ((⇑(d⁄dX ℚ))^[m + 1] treeSeries))
          = ((m : ℚ⟦X⟧) + 1) * treeSeries ^ m * ((d⁄dX ℚ) treeSeries) * crossQ (m + 1)
            - treeSeries ^ (m + 1)
              * Polynomial.aeval (1 - treeSeries)
                  (Polynomial.derivative (crossoverPoly ℚ (m + 1))) * ((d⁄dX ℚ) treeSeries) := by
        have hD := congrArg (⇑(d⁄dX ℚ)) ih
        rw [crossQ] at hD ⊢
        simp only [Derivation.leibniz, PowerSeries.derivative_pow, smul_eq_mul,
          PowerSeries.derivative_X, Nat.add_sub_cancel, derivative_aeval, hDy] at hD
        push_cast at hD ⊢
        linear_combination hD
      rw [show m + 1 + 1 = m + 2 from rfl, hiter, crossQ_succ (m + 1) (by omega)]
      push_cast
      linear_combination (PowerSeries.X * (1 - treeSeries) ^ 2) * hDexp
        + (-((m : ℚ⟦X⟧) + 1) * (1 - treeSeries) ^ 2 + (2 * (m : ℚ⟦X⟧) + 1) * treeSeries) * ih
        + ((2 * (m : ℚ⟦X⟧) + 1) * PowerSeries.X ^ (m + 1) * (1 - treeSeries) ^ (2 * m + 1)
              * ((⇑(d⁄dX ℚ))^[m + 1] treeSeries)
            + ((m : ℚ⟦X⟧) + 1) * (1 - treeSeries) * treeSeries ^ m * crossQ (m + 1)
            - (1 - treeSeries) * treeSeries ^ (m + 1)
                * (Polynomial.aeval (1 - treeSeries))
                    (Polynomial.derivative (crossoverPoly ℚ (m + 1)))) * treeSeries_ode

/-- The constant coefficient of the `n`-th derivative of a power series. -/
lemma constantCoeff_iterate_derivative (n : ℕ) (f : ℚ⟦X⟧) :
    PowerSeries.constantCoeff ((⇑(d⁄dX ℚ))^[n] f)
      = (Nat.factorial n : ℚ) * PowerSeries.coeff n f := by
  induction n generalizing f with
  | zero => simp
  | succ n ih =>
      rw [Function.iterate_succ_apply, ih, PowerSeries.coeff_derivative]
      push_cast [Nat.factorial_succ]
      ring

lemma constantCoeff_aeval (s : ℚ⟦X⟧) (p : ℚ[X]) :
    PowerSeries.constantCoeff (Polynomial.aeval s p) = p.eval (PowerSeries.constantCoeff s) := by
  induction p using Polynomial.induction_on' with
  | add p q hp hq => simp [hp, hq]
  | monomial n a => simp [Polynomial.aeval_monomial, Polynomial.eval_monomial, map_mul, map_pow]

/-- **Row sums of the crossover triangle (over `ℚ`)**: `P_n(1) = n^{n-1}`. -/
theorem crossoverPoly_eval_one_rat (n : ℕ) (hn : 1 ≤ n) :
    (crossoverPoly ℚ n).eval 1 = (n : ℚ) ^ (n - 1) := by
  obtain ⟨m, rfl⟩ : ∃ m, n = m + 1 := ⟨n - 1, by omega⟩
  have hstar := congrArg (PowerSeries.coeff (m + 1)) (crossQ_star m)
  -- left-hand side
  have hL : PowerSeries.coeff (m + 1)
        (PowerSeries.X ^ (m + 1) * (1 - treeSeries) ^ (2 * m + 1)
          * ((⇑(d⁄dX ℚ))^[m + 1] treeSeries))
      = (Nat.factorial (m + 1) : ℚ) * treeCoeff (m + 1) := by
    have hrw : PowerSeries.X ^ (m + 1) * (1 - treeSeries) ^ (2 * m + 1)
          * ((⇑(d⁄dX ℚ))^[m + 1] treeSeries)
        = PowerSeries.X ^ (m + 1)
            * ((1 - treeSeries) ^ (2 * m + 1) * ((⇑(d⁄dX ℚ))^[m + 1] treeSeries)) := by ring
    have hco := PowerSeries.coeff_X_pow_mul
      ((1 - treeSeries) ^ (2 * m + 1) * ((⇑(d⁄dX ℚ))^[m + 1] treeSeries)) (m + 1) 0
    rw [zero_add] at hco
    rw [hrw, hco, PowerSeries.coeff_zero_eq_constantCoeff, map_mul, map_pow,
      constantCoeff_iterate_derivative]
    simp
  -- right-hand side
  have hR : PowerSeries.coeff (m + 1) (treeSeries ^ (m + 1) * crossQ (m + 1))
      = (crossoverPoly ℚ (m + 1)).eval 1 := by
    have hrw : treeSeries ^ (m + 1) * crossQ (m + 1)
        = PowerSeries.X ^ (m + 1) * (treeSeriesShift ^ (m + 1) * crossQ (m + 1)) := by
      rw [treeSeries_eq_X_mul]; ring
    have hco := PowerSeries.coeff_X_pow_mul
      (treeSeriesShift ^ (m + 1) * crossQ (m + 1)) (m + 1) 0
    rw [zero_add] at hco
    rw [hrw, hco, PowerSeries.coeff_zero_eq_constantCoeff, map_mul, map_pow,
      constantCoeff_treeSeriesShift, crossQ, constantCoeff_aeval]
    simp
  rw [hL, hR] at hstar
  rw [← hstar, treeCoeff, treeCount, if_neg (by omega)]
  have hfac : ((Nat.factorial (m + 1) : ℕ) : ℚ) ≠ 0 := by positivity
  field_simp

end RamanujanReversal
