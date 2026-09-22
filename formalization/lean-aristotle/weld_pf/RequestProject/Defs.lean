import Mathlib

/-!
# Weld chain (imp-95008), Lemma PF: definitions

Definitions for the exact partial-fraction closed form of the normalized pair
correlation integral at integer `s`.

Everything follows the source displays:

* `cCoeff s k a b = (-1)^(s-k) * C(2s-k-1, s-k) * (b-a)^(-(2s-k))`
* `dCoeff s k a b = cCoeff s k b a` (the same with `a` and `b` swapped)
* `pCoeff s k S = C(2s-k-1, s-k) * S^(-(2s-k))`
* `Jfun_a`, `Jfun_c` are the `J_a`, `J_c` of the display,
* `Wform` is the closed form claimed for `W (a,b) = ∫_0^∞ dt / ((t+a)^s (t+b)^s)`,
* `Icorr` is the normalized exact pair correlation `I (T, ρ)`.
-/

open scoped BigOperators

namespace WeldPF

/-- The partial-fraction coefficient `c_k = (-1)^(s-k) binom(2s-k-1, s-k) (b-a)^(-(2s-k))`. -/
noncomputable def cCoeff (s k : ℕ) (a b : ℝ) : ℝ :=
  (-1) ^ (s - k) * (Nat.choose (2 * s - k - 1) (s - k) : ℝ) * (b - a) ^ (-(2 * (s : ℤ) - k))

/-- The partial-fraction coefficient `d_k`: the same as `c_k` with `a` and `b` swapped. -/
noncomputable def dCoeff (s k : ℕ) (a b : ℝ) : ℝ := cCoeff s k b a

/-- The (positive) coefficient `p_k = binom(2s-k-1, s-k) S^(-(2s-k))` of the finite piece. -/
noncomputable def pCoeff (s k : ℕ) (S : ℝ) : ℝ :=
  (Nat.choose (2 * s - k - 1) (s - k) : ℝ) * S ^ (-(2 * (s : ℤ) - k))

/-- `J_a(1) = log ((T+a)/a)`, `J_a(k) = (a^(1-k) - (T+a)^(1-k))/(k-1)` for `k ≥ 2`. -/
noncomputable def Jfun_a (T a : ℝ) (k : ℕ) : ℝ :=
  if k = 1 then Real.log ((T + a) / a)
  else (a ^ (1 - (k : ℤ)) - (T + a) ^ (1 - (k : ℤ))) / ((k : ℝ) - 1)

/-- `J_c(1) = log (c/(c-T))`, `J_c(k) = ((c-T)^(1-k) - c^(1-k))/(k-1)` for `k ≥ 2`. -/
noncomputable def Jfun_c (T c : ℝ) (k : ℕ) : ℝ :=
  if k = 1 then Real.log (c / (c - T))
  else ((c - T) ^ (1 - (k : ℤ)) - c ^ (1 - (k : ℤ))) / ((k : ℝ) - 1)

/-- The claimed closed form of `W (a,b)`:
`∑_{k=2}^{s} (c_k a^{1-k} + d_k b^{1-k})/(k-1) + c_1 log (b/a)`. -/
noncomputable def Wform (s : ℕ) (a b : ℝ) : ℝ :=
  (∑ k ∈ Finset.Icc 2 s,
      (cCoeff s k a b * a ^ (1 - (k : ℤ)) + dCoeff s k a b * b ^ (1 - (k : ℤ))) / ((k : ℝ) - 1))
    + cCoeff s 1 a b * Real.log (b / a)

/-- `W (a,b) = ∫_0^∞ dt / ((t+a)^s (t+b)^s)`. -/
noncomputable def W (s : ℕ) (a b : ℝ) : ℝ :=
  ∫ t in Set.Ioi (0 : ℝ), ((t + a) ^ s * (t + b) ^ s)⁻¹

/-- The normalized exact pair correlation
`I (T, ρ) = ρ^{-1/2} ∫_ℝ (1 + |u|/ρ)^{-s} (1 + |u - T|)^{-s} du`. -/
noncomputable def Icorr (s : ℕ) (T ρ : ℝ) : ℝ :=
  ρ ^ (-(1 : ℝ) / 2) * ∫ u : ℝ, ((1 + |u| / ρ) ^ s * (1 + |u - T|) ^ s)⁻¹

end WeldPF
