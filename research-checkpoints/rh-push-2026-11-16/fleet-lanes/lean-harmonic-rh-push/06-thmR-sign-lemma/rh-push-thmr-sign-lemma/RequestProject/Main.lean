import Mathlib

/-!
# Sign lemma behind Theorem R (zero tolerance of all-order Pick positivity)

Theorem R perturbs the von Mangoldt weights by a real sequence `η` supported on `n ≥ 2` with
`∑ |η n| n^{-1/2} < ∞`.  On the imaginary axis the perturbed function has real part
`-g(y)`, `g(y) = ∑_n η(n) n^{-1/2} cos(y log n)`.  The step that carries the theorem:
a nonzero `η` forces `g > 0` on a nonempty open set of `y` (so positivity of the real part fails
there).  The reason is that `g` is almost periodic with mean value zero (no `n = 1` term, the
frequencies `log n`, `n ≥ 2`, are distinct and nonzero) and is not identically zero.

`c n` below stands for `η(n) n^{-1/2}`.
-/

open Finset BigOperators Filter Topology

noncomputable section

/-- The almost periodic cosine series with coefficients `c n` at the frequencies `log n`. -/
def gser (c : ℕ → ℝ) (y : ℝ) : ℝ := ∑' n : ℕ, c n * Real.cos (y * Real.log n)

/-- A nonzero absolutely summable cosine series over the frequencies `log n`, `n ≥ 2`, takes a
strictly positive value. -/
theorem gser_exists_pos (c : ℕ → ℝ) (hsum : Summable fun n => |c n|)
    (h0 : c 0 = 0) (h1 : c 1 = 0) (hne : ∃ n, c n ≠ 0) :
    ∃ y : ℝ, 0 < gser c y := by
  sorry

/-- ... and a strictly negative value. -/
theorem gser_exists_neg (c : ℕ → ℝ) (hsum : Summable fun n => |c n|)
    (h0 : c 0 = 0) (h1 : c 1 = 0) (hne : ∃ n, c n ≠ 0) :
    ∃ y : ℝ, gser c y < 0 := by
  sorry

/-- The series is continuous. -/
theorem gser_continuous (c : ℕ → ℝ) (hsum : Summable fun n => |c n|) :
    Continuous (gser c) := by
  sorry

/-- Open-set form used in Theorem R: positivity on an interval, so a point can be chosen away
from any prescribed closed set with empty interior (the axis zeros). -/
theorem gser_pos_on_interval (c : ℕ → ℝ) (hsum : Summable fun n => |c n|)
    (h0 : c 0 = 0) (h1 : c 1 = 0) (hne : ∃ n, c n ≠ 0) :
    ∃ y₀ ε : ℝ, 0 < ε ∧ ∀ y, |y - y₀| < ε → 0 < gser c y := by
  sorry

/-- Theorem R in the lane's variables: `η` real, supported on `n ≥ 2`, nonzero,
`∑ |η n| n^{-1/2} < ∞`.  Then `∑ η(n) n^{-1/2} cos(y log n) > 0` on an interval, and for any
countable exceptional set `Zs` (heights of axis zeros/poles) there is a `y ∉ Zs` where the sum
is positive, i.e. where the real part `-g(y)` of the perturbed function is negative. -/
theorem theoremR_sign (η : ℕ → ℝ)
    (hsum : Summable fun n : ℕ => |η n| * (n : ℝ) ^ (-(1 / 2 : ℝ)))
    (h0 : η 0 = 0) (h1 : η 1 = 0) (hne : ∃ n, η n ≠ 0) (Zs : Set ℝ) (hZ : Zs.Countable) :
    ∃ y : ℝ, y ∉ Zs ∧
      0 < ∑' n : ℕ, η n * (n : ℝ) ^ (-(1 / 2 : ℝ)) * Real.cos (y * Real.log n) := by
  sorry

end
