import Mathlib

open scoped BigOperators
open scoped Real
open scoped Nat
open scoped Classical
open scoped Pointwise

set_option maxHeartbeats 8000000
set_option maxRecDepth 4000
set_option synthInstance.maxHeartbeats 20000
set_option synthInstance.maxSize 128

set_option relaxedAutoImplicit false
set_option autoImplicit false

set_option pp.fullNames true
set_option pp.structureInstances true
set_option pp.coercions.types true
set_option pp.funBinderTypes true
set_option pp.letVarTypes true
set_option pp.piBinderTypes true

set_option grind.warning false

/-!
# Lemma R1-FN: the sharp finite-`N` excursion cap `Θ ≤ 1 - 2/N`

Setting: reals `x 1 < x 2 < ⋯ < x N` (`N ≥ 2`), an index `i ∈ {1, …, N-1}`, and
`g := x (i+1) - x i`.  The hypothesis `H_min` says that the tracked pair is a global
minimal-gap adjacent pair: `g ≤ x (k+1) - x k` for all `1 ≤ k ≤ N-1`.

For `j ∉ {i, i+1}` one sets `T j := 1 / ((x i - x j) * (x (i+1) - x j))`,
`E := ∑ T j` and `Θ := g² E / 2`.  With `K_L := i - 1`, `K_R := N - 1 - i` and
`f K := K / (K+1)` the results are:

* `R1FN.Eright_le`, `R1FN.Eleft_le`  : per-side telescoping bounds;
* `R1FN.Theta_le_half_f_add_f`, `R1FN.half_f_add_f_le_Thetamax` : `Θ ≤ ½[f K_R + f K_L] ≤ Θmax N`;
* `R1FN.Theta_le_one_sub_two_div_N` : `Θ ≤ 1 - 2/N`;
* `R1FN.Theta_arithmetic`, `R1FN.eq_Thetamax_forces`, `R1FN.eq_one_sub_two_div_N_forces_even` :
  sharpness and the equality characterisation.

Indices are natural numbers; the configuration only ever uses `x 1, …, x N`.
-/

namespace R1FN

/-- `f K = K / (K + 1)`. -/
noncomputable def f (K : ℕ) : ℝ := (K : ℝ) / ((K : ℝ) + 1)

/-- The exact per-`N` maximum `Θmax N = ½ [f ⌈(N-2)/2⌉ + f ⌊(N-2)/2⌋]`.
For `N ≥ 2` one has `⌈(N-2)/2⌉ = (N-1)/2` and `⌊(N-2)/2⌋ = (N-2)/2` in natural division. -/
noncomputable def Thetamax (N : ℕ) : ℝ := (1/2) * (f ((N - 1) / 2) + f ((N - 2) / 2))

/-- `T j = 1 / ((x i - x j) (x (i+1) - x j))`. -/
noncomputable def T (x : ℕ → ℝ) (i j : ℕ) : ℝ := 1 / ((x i - x j) * (x (i + 1) - x j))

/-- `E = ∑_{j ∈ {1,…,N}, j ∉ {i, i+1}} T j`. -/
noncomputable def E (N : ℕ) (x : ℕ → ℝ) (i : ℕ) : ℝ :=
  ∑ j ∈ (Finset.Icc 1 N) \ {i, i + 1}, T x i j

/-- The static excursion functional `Θ = ½ g² E`. -/
noncomputable def Theta (N : ℕ) (x : ℕ → ℝ) (i : ℕ) : ℝ :=
  (1 / 2) * (x (i + 1) - x i) ^ 2 * E N x i

/-- The right environment sum `∑_{j = i+2}^{N} T j`. -/
noncomputable def Eright (N : ℕ) (x : ℕ → ℝ) (i : ℕ) : ℝ := ∑ j ∈ Finset.Icc (i + 2) N, T x i j

/-- The left environment sum `∑_{j = 1}^{i-1} T j`. -/
noncomputable def Eleft (x : ℕ → ℝ) (i : ℕ) : ℝ := ∑ j ∈ Finset.Icc 1 (i - 1), T x i j

/-- The hypotheses of the lemma: `1 ≤ i ≤ N-1`, the tracked gap is positive, and it is a
global minimum among adjacent gaps (`H_min`).  Note that `H_min` together with positivity of
the tracked gap already forces `x 1 < x 2 < ⋯ < x N`. -/
structure Config (N : ℕ) (x : ℕ → ℝ) (i : ℕ) : Prop where
  hi : 1 ≤ i
  hiN : i < N
  hg : x i < x (i + 1)
  hmin : ∀ k, 1 ≤ k → k < N → x (i + 1) - x i ≤ x (k + 1) - x k

/-! ### Elementary facts about `f` -/

lemma f_eq (K : ℕ) : f K = 1 - 1 / ((K : ℝ) + 1) := by
  have h : ((K : ℝ) + 1) ≠ 0 := by positivity
  simp only [f]
  field_simp
  ring

/-- Telescoping sum `∑_{r=1}^{K} 1/(r(r+1)) = K/(K+1) = f K`. -/
lemma sum_telescope (K : ℕ) :
    ∑ r ∈ Finset.Icc 1 K, (1 : ℝ) / ((r : ℝ) * ((r : ℝ) + 1)) = f K := by
  induction K with
  | zero => simp [f]
  | succ n ih =>
      rw [Finset.sum_Icc_succ_top (by omega), ih]
      have h1 : ((n : ℝ) + 1) ≠ 0 := by positivity
      have h2 : ((n : ℝ) + 1 + 1) ≠ 0 := by positivity
      rw [f, f]
      push_cast
      field_simp
      ring

/-- Termwise majorant: `g²/((u+g)u) ≤ 1/(r(r+1))` when `u ≥ r g`. -/
lemma term_le {g u : ℝ} (hg : 0 < g) {r : ℕ} (hr : 1 ≤ r) (hu : (r : ℝ) * g ≤ u) :
    g ^ 2 / ((u + g) * u) ≤ 1 / ((r : ℝ) * ((r : ℝ) + 1)) := by
  have hr1 : (1 : ℝ) ≤ (r : ℝ) := by exact_mod_cast hr
  have hu0 : 0 < u := lt_of_lt_of_le (by nlinarith) hu
  have key : 0 ≤ (u - (r : ℝ) * g) * (u + (r : ℝ) * g + g) :=
    mul_nonneg (by linarith) (by nlinarith)
  rw [div_le_div_iff₀ (by nlinarith) (by nlinarith)]
  nlinarith

/-- Termwise equality forces minimal spacing. -/
lemma term_eq {g u : ℝ} (hg : 0 < g) {r : ℕ} (hr : 1 ≤ r) (hu : (r : ℝ) * g ≤ u)
    (heq : g ^ 2 / ((u + g) * u) = 1 / ((r : ℝ) * ((r : ℝ) + 1))) : u = (r : ℝ) * g := by
  have hr1 : (1 : ℝ) ≤ (r : ℝ) := by exact_mod_cast hr
  have hu0 : 0 < u := lt_of_lt_of_le (by nlinarith) hu
  rw [div_eq_div_iff (by nlinarith) (by nlinarith)] at heq
  have hfac : (u - (r : ℝ) * g) * (u + (r : ℝ) * g + g) = 0 := by nlinarith
  rcases mul_eq_zero.1 hfac with h | h
  · linarith
  · nlinarith

/-! ### The abstract one-sided bound -/

/-- One-sided telescoping majorant: if the `r`-th environment particle on a side is at
distance `u r ≥ r g` from the near member of the tracked pair, then the (scaled) side sum is
at most `f K`. -/
lemma side_bound (K : ℕ) (g : ℝ) (hg : 0 < g) (u : ℕ → ℝ)
    (hu : ∀ r ∈ Finset.Icc 1 K, (r : ℝ) * g ≤ u r) :
    ∑ r ∈ Finset.Icc 1 K, g ^ 2 / ((u r + g) * u r) ≤ f K := by
  rw [← sum_telescope K]
  refine Finset.sum_le_sum ?_
  intro r hr
  exact term_le hg (Finset.mem_Icc.1 hr).1 (hu r hr)

/-- Equality in `side_bound` happens exactly for the minimal-spacing configuration. -/
lemma side_bound_eq_iff (K : ℕ) (g : ℝ) (hg : 0 < g) (u : ℕ → ℝ)
    (hu : ∀ r ∈ Finset.Icc 1 K, (r : ℝ) * g ≤ u r) :
    (∑ r ∈ Finset.Icc 1 K, g ^ 2 / ((u r + g) * u r) = f K) ↔
      ∀ r ∈ Finset.Icc 1 K, u r = (r : ℝ) * g := by
  have hterm : ∀ r ∈ Finset.Icc 1 K,
      g ^ 2 / ((u r + g) * u r) ≤ 1 / ((r : ℝ) * ((r : ℝ) + 1)) := fun r hr =>
    term_le hg (Finset.mem_Icc.1 hr).1 (hu r hr)
  rw [← sum_telescope K, Finset.sum_eq_sum_iff_of_le hterm]
  constructor
  · intro h r hr
    exact term_eq hg (Finset.mem_Icc.1 hr).1 (hu r hr) (h r hr)
  · intro h r hr
    have hr1 : 1 ≤ r := (Finset.mem_Icc.1 hr).1
    have hr1' : (1 : ℝ) ≤ (r : ℝ) := by exact_mod_cast hr1
    have h1 : (0 : ℝ) < (r : ℝ) * g := by nlinarith
    have h2 : (0 : ℝ) < (r : ℝ) * g + g := by nlinarith
    rw [h r hr, div_eq_div_iff (by nlinarith) (by nlinarith)]
    ring

/-! ### Geometry of the configuration -/

variable {N : ℕ} {x : ℕ → ℝ} {i : ℕ}

/-- All adjacent gaps are at least the tracked gap `g > 0`. -/
lemma Config.gap_pos (hc : Config N x i) {k : ℕ} (hk1 : 1 ≤ k) (hkN : k < N) :
    0 < x (k + 1) - x k :=
  lt_of_lt_of_le (by linarith [hc.hg]) (hc.hmin k hk1 hkN)

/-- Distances are at least the number of gaps times `g`. -/
lemma Config.dist_ge (hc : Config N x i) {a b : ℕ} (ha : 1 ≤ a) (hab : a ≤ b) (hb : b ≤ N) :
    ((b - a : ℕ) : ℝ) * (x (i + 1) - x i) ≤ x b - x a := by
  induction b, hab using Nat.le_induction with
  | base => simp
  | succ n hn ih =>
      have h1 := ih (by omega)
      have h2 := hc.hmin n (by omega) (by omega)
      have hcast : ((n + 1 - a : ℕ) : ℝ) = ((n - a : ℕ) : ℝ) + 1 := by
        have hn' : n + 1 - a = (n - a) + 1 := by omega
        rw [hn']; push_cast; ring
      rw [hcast]
      nlinarith [h1, h2]

/-- The environment index set splits into the left and the right block. -/
lemma E_split (hc : Config N x i) : E N x i = Eleft x i + Eright N x i := by
  have hi := hc.hi
  have hiN := hc.hiN
  have hset : (Finset.Icc 1 N) \ ({i, i + 1} : Finset ℕ)
      = Finset.Icc 1 (i - 1) ∪ Finset.Icc (i + 2) N := by
    ext j
    simp only [Finset.mem_sdiff, Finset.mem_Icc, Finset.mem_insert, Finset.mem_singleton,
      Finset.mem_union, not_or]
    omega
  have hdisj : Disjoint (Finset.Icc 1 (i - 1)) (Finset.Icc (i + 2) N) := by
    rw [Finset.disjoint_left]
    intro j hj hj2
    simp only [Finset.mem_Icc] at hj hj2
    omega
  rw [E, hset, Finset.sum_union hdisj, Eleft, Eright]

/-! ### (i) Per-side telescoping bounds -/

/-- The distance from `x (i+1)` to the `r`-th right environment particle `x (i + 1 + r)`. -/
noncomputable def uR (x : ℕ → ℝ) (i r : ℕ) : ℝ := x (i + 1 + r) - x (i + 1)

/-- The distance from `x i` to the `r`-th left environment particle `x (i - r)`. -/
noncomputable def uL (x : ℕ → ℝ) (i r : ℕ) : ℝ := x i - x (i - r)

lemma Eright_eq_sum (hc : Config N x i) :
    (x (i + 1) - x i) ^ 2 * Eright N x i =
      ∑ r ∈ Finset.Icc 1 (N - 1 - i),
        (x (i + 1) - x i) ^ 2 / ((uR x i r + (x (i + 1) - x i)) * uR x i r) := by
  have hi := hc.hi
  have hiN := hc.hiN
  rw [Eright, Finset.mul_sum]
  refine Finset.sum_nbij' (fun j => j - (i + 1)) (fun r => i + 1 + r) ?_ ?_ ?_ ?_ ?_
  · intro j hj; simp only [Finset.mem_Icc] at hj ⊢; omega
  · intro r hr; simp only [Finset.mem_Icc] at hr ⊢; omega
  · intro j hj; simp only [Finset.mem_Icc] at hj; show i + 1 + (j - (i + 1)) = j; omega
  · intro r hr; simp only [Finset.mem_Icc] at hr; show i + 1 + r - (i + 1) = r; omega
  · intro j hj
    simp only [Finset.mem_Icc] at hj
    have hj' : i + 1 + (j - (i + 1)) = j := by omega
    simp only [T, uR, hj']
    rw [mul_one_div]
    congr 1
    ring

lemma Eleft_eq_sum (hc : Config N x i) :
    (x (i + 1) - x i) ^ 2 * Eleft x i =
      ∑ r ∈ Finset.Icc 1 (i - 1),
        (x (i + 1) - x i) ^ 2 / ((uL x i r + (x (i + 1) - x i)) * uL x i r) := by
  have hi := hc.hi
  have hiN := hc.hiN
  rw [Eleft, Finset.mul_sum]
  refine Finset.sum_nbij' (fun j => i - j) (fun r => i - r) ?_ ?_ ?_ ?_ ?_
  · intro j hj; simp only [Finset.mem_Icc] at hj ⊢; omega
  · intro r hr; simp only [Finset.mem_Icc] at hr ⊢; omega
  · intro j hj; simp only [Finset.mem_Icc] at hj; show i - (i - j) = j; omega
  · intro r hr; simp only [Finset.mem_Icc] at hr; show i - (i - r) = r; omega
  · intro j hj
    simp only [Finset.mem_Icc] at hj
    have hj' : i - (i - j) = j := by omega
    simp only [T, uL, hj']
    rw [mul_one_div]
    congr 1
    ring

/-- The `r`-th right environment particle is at distance at least `r g`. -/
lemma uR_ge (hc : Config N x i) :
    ∀ r ∈ Finset.Icc 1 (N - 1 - i), (r : ℝ) * (x (i + 1) - x i) ≤ uR x i r := by
  have hi := hc.hi
  have hiN := hc.hiN
  intro r hr
  simp only [Finset.mem_Icc] at hr
  have hd := hc.dist_ge (a := i + 1) (b := i + 1 + r) (by omega) (by omega) (by omega)
  have hcast : ((i + 1 + r - (i + 1) : ℕ) : ℝ) = (r : ℝ) := by
    have h : i + 1 + r - (i + 1) = r := by omega
    rw [h]
  rw [hcast] at hd
  simpa [uR] using hd

/-- The `r`-th left environment particle is at distance at least `r g`. -/
lemma uL_ge (hc : Config N x i) :
    ∀ r ∈ Finset.Icc 1 (i - 1), (r : ℝ) * (x (i + 1) - x i) ≤ uL x i r := by
  have hi := hc.hi
  have hiN := hc.hiN
  intro r hr
  simp only [Finset.mem_Icc] at hr
  have hd := hc.dist_ge (a := i - r) (b := i) (by omega) (by omega) (by omega)
  have hcast : ((i - (i - r) : ℕ) : ℝ) = (r : ℝ) := by
    have h : i - (i - r) = r := by omega
    rw [h]
  rw [hcast] at hd
  simpa [uL] using hd

/-- **(i)** Right telescoping bound: `g² E_right ≤ f K_R`, `K_R = N - 1 - i`. -/
theorem Eright_le (hc : Config N x i) :
    (x (i + 1) - x i) ^ 2 * Eright N x i ≤ f (N - 1 - i) := by
  rw [Eright_eq_sum hc]
  exact side_bound _ _ (by linarith [hc.hg]) _ (uR_ge hc)

/-- **(i)** Left telescoping bound: `g² E_left ≤ f K_L`, `K_L = i - 1`. -/
theorem Eleft_le (hc : Config N x i) :
    (x (i + 1) - x i) ^ 2 * Eleft x i ≤ f (i - 1) := by
  rw [Eleft_eq_sum hc]
  exact side_bound _ _ (by linarith [hc.hg]) _ (uL_ge hc)

/-! ### (ii) `Θ ≤ ½ (f K_R + f K_L) ≤ Θmax N` -/

/-- **(ii)a** `Θ ≤ ½ (f K_R + f K_L)`. -/
theorem Theta_le_half_f_add_f (hc : Config N x i) :
    Theta N x i ≤ (1 / 2) * (f (N - 1 - i) + f (i - 1)) := by
  have hR := Eright_le hc
  have hL := Eleft_le hc
  have hexp : (1 / 2 : ℝ) * (x (i + 1) - x i) ^ 2 * (Eleft x i + Eright N x i)
      = (1 / 2) * ((x (i + 1) - x i) ^ 2 * Eleft x i + (x (i + 1) - x i) ^ 2 * Eright N x i) := by
    ring
  rw [Theta, E_split hc, hexp]
  linarith

/-- Product bound behind discrete concavity of `f`: for a fixed sum the product
`(a+1)(b+1)` is maximal at the balanced split. -/
lemma nat_prod_le (a b : ℕ) : (a + 1) * (b + 1) ≤ ((a + b + 1) / 2 + 1) * ((a + b) / 2 + 1) := by
  rcases Nat.even_or_odd (a + b) with ⟨t, ht⟩ | ⟨t, ht⟩
  · have h1 : (a + b + 1) / 2 = t := by omega
    have h2 : (a + b) / 2 = t := by omega
    rw [h1, h2]; zify
    have ht' : (a : ℤ) + b = 2 * t := by exact_mod_cast (by omega : a + b = 2 * t)
    nlinarith [sq_nonneg ((a : ℤ) - b)]
  · have h1 : (a + b + 1) / 2 = t + 1 := by omega
    have h2 : (a + b) / 2 = t := by omega
    rw [h1, h2]; zify
    have ht' : (a : ℤ) + b = 2 * t + 1 := by exact_mod_cast (by omega : a + b = 2 * t + 1)
    have hne : ((a : ℤ) - b) ^ 2 ≥ 1 := by
      rcases lt_trichotomy a b with h | h | h
      · have : (a : ℤ) - b ≤ -1 := by omega
        nlinarith
      · omega
      · have : (a : ℤ) - b ≥ 1 := by omega
        nlinarith
    nlinarith

/-- If two positive pairs have the same sum and the first has the smaller product, then the
first has the larger sum of reciprocals. -/
lemma inv_add_inv_le {A B P Q : ℝ} (hA : 0 < A) (hB : 0 < B) (hP : 0 < P) (hQ : 0 < Q)
    (hsum : A + B = P + Q) (hprod : A * B ≤ P * Q) : 1 / P + 1 / Q ≤ 1 / A + 1 / B := by
  have hQ' : Q = A + B - P := by linarith
  subst hQ'
  rw [div_add_div _ _ (by positivity) (by positivity),
    div_add_div _ _ (by positivity) (by positivity),
    div_le_div_iff₀ (by positivity) (by positivity)]
  nlinarith [hprod]

/-- Balanced splits maximise `f a + f b` for a fixed sum. -/
lemma f_add_f_le (a b : ℕ) : f a + f b ≤ f ((a + b + 1) / 2) + f ((a + b) / 2) := by
  have hp : ((a + b + 1) / 2 + (a + b) / 2 : ℕ) = a + b := by omega
  have hprod : ((a : ℝ) + 1) * ((b : ℝ) + 1)
      ≤ ((((a + b + 1) / 2 : ℕ) : ℝ) + 1) * ((((a + b) / 2 : ℕ) : ℝ) + 1) := by
    have h := (Nat.cast_le (α := ℝ)).2 (nat_prod_le a b)
    push_cast at h
    linarith
  have hsum : ((a : ℝ) + 1) + ((b : ℝ) + 1)
      = ((((a + b + 1) / 2 : ℕ) : ℝ) + 1) + ((((a + b) / 2 : ℕ) : ℝ) + 1) := by
    have h := (Nat.cast_inj (R := ℝ)).2 hp
    push_cast at h
    linarith
  have h := inv_add_inv_le (A := (a : ℝ) + 1) (B := (b : ℝ) + 1)
    (P := (((a + b + 1) / 2 : ℕ) : ℝ) + 1) (Q := (((a + b) / 2 : ℕ) : ℝ) + 1)
    (by positivity) (by positivity) (by positivity) (by positivity) hsum hprod
  rw [f_eq, f_eq, f_eq, f_eq]
  linarith

/-- Equality in `f_add_f_le` forces the balanced split. -/
lemma f_add_f_eq_iff (a b : ℕ) :
    (f a + f b = f ((a + b + 1) / 2) + f ((a + b) / 2)) ↔
      (a = (a + b) / 2 ∨ a = (a + b + 1) / 2) := by
  set p := (a + b + 1) / 2 with hpdef
  set q := (a + b) / 2 with hqdef
  have hpq : p + q = a + b := by omega
  constructor
  · intro heq
    rw [f_eq, f_eq, f_eq, f_eq] at heq
    have hA : (0 : ℝ) < (a : ℝ) + 1 := by positivity
    have hB : (0 : ℝ) < (b : ℝ) + 1 := by positivity
    have hP : (0 : ℝ) < (p : ℝ) + 1 := by positivity
    have hQ : (0 : ℝ) < (q : ℝ) + 1 := by positivity
    have hsum : ((a : ℝ) + 1) + ((b : ℝ) + 1) = ((p : ℝ) + 1) + ((q : ℝ) + 1) := by
      have h := (Nat.cast_inj (R := ℝ)).2 hpq
      push_cast at h; linarith
    have hinv : 1 / ((a : ℝ) + 1) + 1 / ((b : ℝ) + 1)
        = 1 / ((p : ℝ) + 1) + 1 / ((q : ℝ) + 1) := by linarith
    have hS : (0 : ℝ) < ((a : ℝ) + 1) + ((b : ℝ) + 1) := by linarith
    have hprodR : ((a : ℝ) + 1) * ((b : ℝ) + 1) = ((p : ℝ) + 1) * ((q : ℝ) + 1) := by
      field_simp at hinv
      apply mul_left_cancel₀ (ne_of_gt hS)
      linear_combination ((a : ℝ) + 1) * ((b : ℝ) + 1) * hsum - hinv
    have hprodN : (a + 1) * (b + 1) = (p + 1) * (q + 1) := by
      have h : (((a + 1) * (b + 1) : ℕ) : ℝ) = (((p + 1) * (q + 1) : ℕ) : ℝ) := by
        push_cast; linarith
      exact_mod_cast h
    have h2 : (a : ℤ) + b = (p : ℤ) + q := by exact_mod_cast hpq.symm
    have h1 : ((a : ℤ) + 1) * ((b : ℤ) + 1) = ((p : ℤ) + 1) * ((q : ℤ) + 1) := by
      exact_mod_cast hprodN
    have hfac : ((a : ℤ) - b - ((p : ℤ) - q)) * ((a : ℤ) - b + ((p : ℤ) - q)) = 0 := by
      nlinarith [h1, h2]
    rcases mul_eq_zero.1 hfac with h | h
    · right; omega
    · left; omega
  · intro h
    rcases h with h | h
    · have hb : b = p := by omega
      rw [h, hb]; ring
    · have hb : b = q := by omega
      rw [h, hb]

/-- Half of `f a + f b` is at most `1 - 2/N` whenever `a + b + 2 = N` (AM–HM). -/
lemma half_f_add_f_le_bound (a b Nn : ℕ) (h : a + b + 2 = Nn) :
    (1 / 2) * (f a + f b) ≤ 1 - 2 / (Nn : ℝ) := by
  have hN : ((Nn : ℝ)) = ((a : ℝ) + 1) + ((b : ℝ) + 1) := by
    have h' := (Nat.cast_inj (R := ℝ)).2 h
    push_cast at h'
    linarith
  have hkey : 4 / (Nn : ℝ) ≤ 1 / ((a : ℝ) + 1) + 1 / ((b : ℝ) + 1) := by
    rw [hN, div_add_div _ _ (by positivity) (by positivity),
      div_le_div_iff₀ (by positivity) (by positivity)]
    nlinarith [sq_nonneg ((a : ℝ) - b)]
  have hrw : (2 : ℝ) / (Nn : ℝ) = (1 / 2) * (4 / (Nn : ℝ)) := by ring
  rw [f_eq, f_eq, hrw]
  linarith

/-- **(ii)b** `½ (f K_R + f K_L) ≤ Θmax N`. -/
theorem half_f_add_f_le_Thetamax (hc : Config N x i) :
    (1 / 2) * (f (N - 1 - i) + f (i - 1)) ≤ Thetamax N := by
  have hi := hc.hi
  have hiN := hc.hiN
  have h := f_add_f_le (N - 1 - i) (i - 1)
  have e1 : (N - 1 - i) + (i - 1) + 1 = N - 1 := by omega
  have e2 : (N - 1 - i) + (i - 1) = N - 2 := by omega
  rw [e1, e2] at h
  rw [Thetamax]
  linarith

/-- **(ii)** `Θ ≤ Θmax N`. -/
theorem Theta_le_Thetamax (hc : Config N x i) : Theta N x i ≤ Thetamax N :=
  le_trans (Theta_le_half_f_add_f hc) (half_f_add_f_le_Thetamax hc)

/-! ### (iii) The cap `Θ ≤ 1 - 2/N` -/

lemma Thetamax_le_one_sub_two_div_N {N : ℕ} (hN : 2 ≤ N) :
    Thetamax N ≤ 1 - 2 / (N : ℝ) := by
  rw [Thetamax]
  exact half_f_add_f_le_bound ((N - 1) / 2) ((N - 2) / 2) N (by omega)

/-- **(iii)** The sharp finite-`N` cap. -/
theorem Theta_le_one_sub_two_div_N (hc : Config N x i) :
    Theta N x i ≤ 1 - 2 / (N : ℝ) := by
  have hi := hc.hi
  have hiN := hc.hiN
  exact le_trans (Theta_le_half_f_add_f hc)
    (half_f_add_f_le_bound (N - 1 - i) (i - 1) N (by omega))

/-! ### (iv) Sharpness and the equality characterisation -/

/-- Equality in the right telescoping bound holds exactly for minimal spacing on the right. -/
lemma Eright_eq_iff (hc : Config N x i) :
    ((x (i + 1) - x i) ^ 2 * Eright N x i = f (N - 1 - i)) ↔
      ∀ r ∈ Finset.Icc 1 (N - 1 - i), uR x i r = (r : ℝ) * (x (i + 1) - x i) := by
  rw [Eright_eq_sum hc]
  exact side_bound_eq_iff _ _ (by linarith [hc.hg]) _ (uR_ge hc)

/-- Equality in the left telescoping bound holds exactly for minimal spacing on the left. -/
lemma Eleft_eq_iff (hc : Config N x i) :
    ((x (i + 1) - x i) ^ 2 * Eleft x i = f (i - 1)) ↔
      ∀ r ∈ Finset.Icc 1 (i - 1), uL x i r = (r : ℝ) * (x (i + 1) - x i) := by
  rw [Eleft_eq_sum hc]
  exact side_bound_eq_iff _ _ (by linarith [hc.hg]) _ (uL_ge hc)

/-- `Θ` is `½ (g² E_left + g² E_right)`. -/
lemma Theta_eq_half_add (hc : Config N x i) :
    Theta N x i = (1 / 2) * ((x (i + 1) - x i) ^ 2 * Eleft x i
      + (x (i + 1) - x i) ^ 2 * Eright N x i) := by
  rw [Theta, E_split hc]
  ring

/-- The balanced split is an admissible index. -/
theorem Config_arithmetic (N : ℕ) (hN : 2 ≤ N) (a d : ℝ) (hd : 0 < d) :
    Config N (fun k => a + k * d) ((N - 2) / 2 + 1) := by
  refine ⟨by omega, by omega, ?_, ?_⟩
  · push_cast
    nlinarith
  · intro k _ _
    push_cast
    ring_nf
    linarith

/-- The uniform lattice with the tracked pair at the balanced split attains `Θmax N`. -/
theorem Theta_arithmetic (N : ℕ) (hN : 2 ≤ N) (a d : ℝ) (hd : 0 < d) :
    Theta N (fun k => a + k * d) ((N - 2) / 2 + 1) = Thetamax N := by
  set i : ℕ := (N - 2) / 2 + 1 with hidef
  set x : ℕ → ℝ := fun k => a + k * d with hxdef
  have hc : Config N x i := Config_arithmetic N hN a d hd
  have hER : (x (i + 1) - x i) ^ 2 * Eright N x i = f (N - 1 - i) := by
    refine (Eright_eq_iff hc).2 ?_
    intro r _
    simp only [uR, hxdef]
    push_cast
    ring
  have hEL : (x (i + 1) - x i) ^ 2 * Eleft x i = f (i - 1) := by
    refine (Eleft_eq_iff hc).2 ?_
    intro r hr
    simp only [Finset.mem_Icc] at hr
    have hri : (((i - r : ℕ)) : ℝ) = (i : ℝ) - (r : ℝ) := by
      have h : r ≤ i := by omega
      push_cast [h]
      ring
    simp only [uL, hxdef]
    rw [hri]
    push_cast
    ring
  have e1 : i - 1 = (N - 2) / 2 := by omega
  have e2 : N - 1 - i = (N - 1) / 2 := by omega
  rw [Theta_eq_half_add hc, hER, hEL, e1, e2, Thetamax]
  ring

/-- **(iv)** Equality `Θ = Θmax N` forces the uniform minimal-spacing lattice and a balanced
split of the environment. -/
theorem eq_Thetamax_forces (hc : Config N x i) (heq : Theta N x i = Thetamax N) :
    (∀ k, 1 ≤ k → k < N → x (k + 1) - x k = x (i + 1) - x i) ∧
      (i - 1 = (N - 2) / 2 ∨ i - 1 = (N - 1) / 2) := by
  have hi := hc.hi
  have hiN := hc.hiN
  have h1 := Theta_le_half_f_add_f hc
  have h2 := half_f_add_f_le_Thetamax hc
  have hR := Eright_le hc
  have hL := Eleft_le hc
  have hhalf : Theta N x i = (1 / 2) * (f (N - 1 - i) + f (i - 1)) := by linarith
  have hmaxeq : (1 / 2) * (f (N - 1 - i) + f (i - 1)) = Thetamax N := by linarith
  rw [Theta_eq_half_add hc] at hhalf
  have hER : (x (i + 1) - x i) ^ 2 * Eright N x i = f (N - 1 - i) := by linarith
  have hEL : (x (i + 1) - x i) ^ 2 * Eleft x i = f (i - 1) := by linarith
  have huR := (Eright_eq_iff hc).1 hER
  have huL := (Eleft_eq_iff hc).1 hEL
  refine ⟨?_, ?_⟩
  · intro k hk1 hk2
    rcases lt_trichotomy k i with hk | hk | hk
    · have e1 := huL (i - k) (Finset.mem_Icc.2 ⟨by omega, by omega⟩)
      have e2 : uL x i (i - k - 1) = ((i - k - 1 : ℕ) : ℝ) * (x (i + 1) - x i) := by
        rcases Nat.eq_zero_or_pos (i - k - 1) with h0 | hpos
        · rw [h0]; simp [uL]
        · exact huL _ (Finset.mem_Icc.2 ⟨by omega, by omega⟩)
      rw [uL, show i - (i - k) = k from by omega] at e1
      rw [uL, show i - (i - k - 1) = k + 1 from by omega] at e2
      have hcast : ((i - k : ℕ) : ℝ) = ((i - k - 1 : ℕ) : ℝ) + 1 := by
        have h : i - k = (i - k - 1) + 1 := by omega
        rw [h]; push_cast; ring
      rw [hcast] at e1
      linarith
    · rw [hk]
    · have e1 := huR (k + 1 - (i + 1)) (Finset.mem_Icc.2 ⟨by omega, by omega⟩)
      have e2 : uR x i (k - (i + 1)) = ((k - (i + 1) : ℕ) : ℝ) * (x (i + 1) - x i) := by
        rcases Nat.eq_zero_or_pos (k - (i + 1)) with h0 | hpos
        · rw [h0]; simp [uR]
        · exact huR _ (Finset.mem_Icc.2 ⟨by omega, by omega⟩)
      rw [uR, show i + 1 + (k + 1 - (i + 1)) = k + 1 from by omega] at e1
      rw [uR, show i + 1 + (k - (i + 1)) = k from by omega] at e2
      have hcast : ((k + 1 - (i + 1) : ℕ) : ℝ) = ((k - (i + 1) : ℕ) : ℝ) + 1 := by
        have h : k + 1 - (i + 1) = (k - (i + 1)) + 1 := by omega
        rw [h]; push_cast; ring
      rw [hcast] at e1
      linarith
  · rw [Thetamax] at hmaxeq
    have hiff := f_add_f_eq_iff (N - 1 - i) (i - 1)
    rw [show (N - 1 - i) + (i - 1) + 1 = N - 1 from by omega,
      show (N - 1 - i) + (i - 1) = N - 2 from by omega] at hiff
    have h3 : f (N - 1 - i) + f (i - 1) = f ((N - 1) / 2) + f ((N - 2) / 2) := by linarith
    rcases hiff.1 h3 with h | h
    · right; omega
    · left; omega

/-- For odd `N` the exact maximum is strictly below the cap `1 - 2/N`. -/
lemma Thetamax_lt_of_odd (Nn : ℕ) (hN : 2 ≤ Nn) (hodd : ¬ Even Nn) :
    Thetamax Nn < 1 - 2 / (Nn : ℝ) := by
  obtain ⟨m, hm⟩ : ∃ m, Nn = 2 * m + 1 := by
    rcases Nat.even_or_odd Nn with h | h
    · exact absurd h hodd
    · have hpar := Nat.odd_iff.1 h
      exact ⟨Nn / 2, by omega⟩
  have hm1 : 1 ≤ m := by omega
  have hM : (1 : ℝ) ≤ (m : ℝ) := by exact_mod_cast hm1
  have e1 : (Nn - 1) / 2 = m := by omega
  have e2 : (Nn - 2) / 2 = m - 1 := by omega
  have hcast : (((m - 1 : ℕ)) : ℝ) + 1 = (m : ℝ) := by
    have h : m - 1 + 1 = m := by omega
    have h' := (Nat.cast_inj (R := ℝ)).2 h
    push_cast at h'
    linarith
  have hNcast : ((Nn : ℕ) : ℝ) = 2 * (m : ℝ) + 1 := by rw [hm]; push_cast; ring
  have key : 2 / (2 * (m : ℝ) + 1) < (1 / 2) * (1 / ((m : ℝ) + 1) + 1 / (m : ℝ)) := by
    rw [show (1 / 2 : ℝ) * (1 / ((m : ℝ) + 1) + 1 / (m : ℝ))
        = (2 * (m : ℝ) + 1) / (2 * (m : ℝ) * ((m : ℝ) + 1)) by field_simp; ring]
    rw [div_lt_div_iff₀ (by linarith) (by nlinarith)]
    nlinarith
  rw [Thetamax, e1, e2, f_eq, f_eq, hcast, hNcast]
  linarith

/-- **(iv)** `Θ = 1 - 2/N` additionally forces `N` even. -/
theorem eq_one_sub_two_div_N_forces_even (hc : Config N x i)
    (heq : Theta N x i = 1 - 2 / (N : ℝ)) : Even N := by
  have hi := hc.hi
  have hiN := hc.hiN
  by_contra hodd
  have h1 := Theta_le_Thetamax hc
  have h2 := Thetamax_lt_of_odd N (by omega) hodd
  rw [heq] at h1
  linarith

/-! ### Numerical sanity checks -/

/-- For the uniform lattice `x k = k` with `N = 4` and the tracked pair `{2,3}` one gets
`Θ = 1/2 = 1 - 2/4`, the cap being attained. -/
example : Theta 4 (fun k => (k : ℝ)) 2 = 1 / 2 := by
  have hset : (Finset.Icc 1 4) \ ({2, 3} : Finset ℕ) = {1, 4} := by decide
  simp [Theta, E, hset, T]
  norm_num

/-- For `N = 3` the exact maximum `Θmax 3 = 1/4` is strictly below the cap `1 - 2/3`. -/
example : Theta 3 (fun k => (k : ℝ)) 1 = 1 / 4 := by
  have hset : (Finset.Icc 1 3) \ ({1, 2} : Finset ℕ) = {3} := by decide
  simp [Theta, E, hset, T]
  norm_num

example : Thetamax 3 = 1 / 4 := by
  norm_num [Thetamax, f]

end R1FN
