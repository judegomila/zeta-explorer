import Mathlib.Algebra.Order.Chebyshev
import Mathlib.Algebra.BigOperators.Field
import Mathlib.Basic.Real.Basic
import Mathlib.Tactic.FieldSimp
import Mathlib.Tactic.Positivity
import Mathlib.Tactic.Linarith
import Mathlib.Tactic.NormNum
import Mathlib.Tactic.Ring

/-!
# Route 41 — Lean replay of an Arb certificate (ARB-LEGE leg (E), linear-algebra core)

Certificate format (untrusted data, produced by `tmp/routes-b9-r41-build-cert.py` from the Arb run;
all integers stored zigzag-encoded as natural-number literals, decoded by `zz`):
* `A`    : integer matrix (rows), the Arb midpoint matrix rounded to `2^-pA`;
* `c`    : integer vector, the pole-free constraint vector rounded to `2^-pc`;
* `sNum` : the claimed lower bound `s = sNum / 2^pA`;
* `lam`  : penalty weight;
* `R`    : integer matrix given by columns (upper triangular in practice), an approximate Cholesky
           factor of `G = 4^pc (A - sNum I) + lam c c^T`.

`Cert.rowOK` / `Cert.blockOK` / `Cert.check` are kernel-evaluable Boolean tests (exact integer
arithmetic): `A` symmetric and `F = G - R^T R` diagonally dominant (`∑_j |F_ij| ≤ 2 F_ii`).  They are
discharged by `decide +kernel` (kernel evaluation only; no `native_decide`, so no compiler/`ofReduceBool`
trust), in blocks of rows to bound memory.  `Cert.lower_bound` (proved below, no `sorry`) turns `C.Valid`
into the real statement

  for every real matrix `A'` and vector `c'` within `rhoA`, `rhoc` of the rounded midpoints and every
  real `x` with `c' · x = 0`:   `x^T A' x ≥ (s - n rhoA - (lam / 2^pA) n rhoc^2) |x|^2`.

Nothing here knows what `A'` is (Galerkin matrix of `w - m_T` against spherical Bessel functions);
that identification, the Arb entry enclosures (python-flint 0.9.0; Gauss-Legendre error theorem), the
parity split, the tail bound and the analytic reduction W(h) ≥ ... are TRUSTED inputs, not checked here.

Build (no lake project; reuses the Lean 4.34.1 + Mathlib d13f23b7 build in /tmp/qrh-verify/lean):
`tmp/routes-b9-r41-run-all.sh "200 160" "200 240" "400 320"` from the repo root.
-/

open Finset

namespace ArbReplay

/-! ## 1. Kernel-evaluable primitives -/

/-- zigzag decoding `0,1,2,3,4,... ↦ 0,-1,1,-2,2,...` (data is stored as natural-number literals,
which elaborate much faster than signed integer literals). -/
def zz (k : ℕ) : ℤ := if k % 2 = 0 then ((k / 2 : ℕ) : ℤ) else -(((k + 1) / 2 : ℕ) : ℤ)

/-- dot product of two zigzag-encoded lists, truncated to the shorter one (= zero padding, `zz 0 = 0`). -/
def dotZ : List ℕ → List ℕ → ℤ
  | a :: as, b :: bs => zz a * zz b + dotZ as bs
  | _, _ => 0

/-- `sumTo f n = f 0 + ... + f (n-1)` -/
def sumTo (f : ℕ → ℤ) : ℕ → ℤ
  | 0 => 0
  | k + 1 => sumTo f k + f k

/-- `allTo p n = p 0 && ... && p (n-1)` -/
def allTo (p : ℕ → Bool) : ℕ → Bool
  | 0 => true
  | k + 1 => allTo p k && p k

def iabs (x : ℤ) : ℤ := if x < 0 then -x else x


/-- certificate data; all integer lists are zigzag-encoded naturals (see `zz`). -/
structure Cert where
  n : ℕ
  pA : ℕ
  pc : ℕ
  sNum : ℤ
  lam : ℤ
  A : List (List ℕ)
  c : List ℕ
  R : List (List ℕ)

namespace Cert

def Aat (C : Cert) (i j : ℕ) : ℤ := zz ((C.A.getD i []).getD j 0)
def cat (C : Cert) (i : ℕ) : ℤ := zz (C.c.getD i 0)
def Rcol (C : Cert) (i : ℕ) : List ℕ := C.R.getD i []
def Rent (C : Cert) (k i : ℕ) : ℤ := zz ((C.Rcol i).getD k 0)
/-- `4^pc`, computed with (GMP-accelerated) natural-number power. -/
def scale (C : Cert) : ℤ := ((2 ^ (2 * C.pc) : ℕ) : ℤ)
def Gat (C : Cert) (i j : ℕ) : ℤ :=
  C.scale * (C.Aat i j - if i = j then C.sNum else 0) + C.lam * C.cat i * C.cat j
def Fat (C : Cert) (i j : ℕ) : ℤ := C.Gat i j - dotZ (C.Rcol i) (C.Rcol j)

/-- per-row test: column length, symmetry of `A`, diagonal dominance of `F = G - R^T R`. -/
def rowOK (C : Cert) (i : ℕ) : Bool :=
  decide ((C.Rcol i).length ≤ C.n) &&
  allTo (fun j => decide (C.Aat i j = C.Aat j i)) C.n &&
  decide (sumTo (fun j => iabs (C.Fat i j)) C.n ≤ 2 * C.Fat i i)

/-- rows `lo, ..., lo + len - 1` (lets the kernel check run in blocks with bounded memory). -/
def blockOK (C : Cert) (lo len : ℕ) : Bool := allTo (fun k => C.rowOK (lo + k)) len

/-- the whole check in one go. -/
def check (C : Cert) : Bool := decide (0 ≤ C.lam) && C.blockOK 0 C.n

/-- what the soundness theorem consumes. -/
def Valid (C : Cert) : Prop := 0 ≤ C.lam ∧ ∀ i < C.n, C.rowOK i = true

end Cert

/-! ## 2. Bridge lemmas: computation = mathematics -/

theorem sumTo_eq (f : ℕ → ℤ) (n : ℕ) : sumTo f n = ∑ k ∈ range n, f k := by
  induction n with
  | zero => simp [sumTo]
  | succ k ih => simp [sumTo, ih, sum_range_succ]

theorem allTo_iff (p : ℕ → Bool) (n : ℕ) : allTo p n = true ↔ ∀ k < n, p k = true := by
  induction n with
  | zero => simp [allTo]
  | succ k ih =>
    simp only [allTo, Bool.and_eq_true, ih]
    constructor
    · rintro ⟨h1, h2⟩ m hm
      rcases Nat.lt_succ_iff_lt_or_eq.mp hm with h | h
      · exact h1 m h
      · subst h; exact h2
    · intro h
      exact ⟨fun m hm => h m (Nat.lt_succ_of_lt hm), h k (Nat.lt_succ_self k)⟩

theorem iabs_eq (x : ℤ) : iabs x = |x| := by
  unfold iabs
  split_ifs with h
  · rw [abs_of_neg h]
  · rw [abs_of_nonneg (not_lt.mp h)]

theorem zz_zero : zz 0 = 0 := by decide

theorem dotZ_eq (l1 l2 : List ℕ) (m : ℕ) (h : l1.length ≤ m) :
    dotZ l1 l2 = ∑ k ∈ range m, zz (l1.getD k 0) * zz (l2.getD k 0) := by
  induction l1 generalizing l2 m with
  | nil => simp [dotZ, zz_zero]
  | cons a as ih =>
    cases l2 with
    | nil => simp [dotZ, zz_zero]
    | cons b bs =>
      cases m with
      | zero => simp at h
      | succ m =>
        rw [sum_range_succ']
        simp only [List.getD_cons_succ, List.getD_cons_zero]
        rw [dotZ, ih bs m (by simpa using h)]
        ring

namespace Cert

theorem valid_of_check (C : Cert) (hc : C.check = true) : C.Valid := by
  simp only [check, blockOK, Bool.and_eq_true, decide_eq_true_eq, allTo_iff, Nat.zero_add] at hc
  exact hc

theorem valid_of_blocks (C : Cert) (B nb : ℕ) (hn : C.n = nb * B) (hlam : decide (0 ≤ C.lam) = true)
    (hb : ∀ b < nb, C.blockOK (b * B) B = true) : C.Valid := by
  refine ⟨by simpa using hlam, fun i hi => ?_⟩
  rw [hn] at hi
  have hB : 0 < B := by
    rcases Nat.eq_zero_or_pos B with h | h
    · subst h; simp at hi
    · exact h
  have hdiv : i / B < nb := (Nat.div_lt_iff_lt_mul hB).mpr hi
  have hblk := hb (i / B) hdiv
  simp only [blockOK, allTo_iff] at hblk
  have := hblk (i % B) (Nat.mod_lt i hB)
  rwa [Nat.div_add_mod'] at this

theorem row_spec (C : Cert) (i : ℕ) (h : C.rowOK i = true) :
    (C.Rcol i).length ≤ C.n ∧ (∀ j < C.n, C.Aat i j = C.Aat j i) ∧
      ∑ j ∈ range C.n, |C.Fat i j| ≤ 2 * C.Fat i i := by
  simp only [rowOK, Bool.and_eq_true, decide_eq_true_eq, allTo_iff] at h
  obtain ⟨⟨hlen, hsym⟩, hdd⟩ := h
  refine ⟨hlen, hsym, ?_⟩
  rw [sumTo_eq] at hdd
  simpa [iabs_eq] using hdd

end Cert

/-! ## 3. Real quadratic-form lemmas -/

/-- quadratic form over indices `< n` -/
def qf (n : ℕ) (M : ℕ → ℕ → ℝ) (x : ℕ → ℝ) : ℝ :=
  ∑ i ∈ range n, ∑ j ∈ range n, x i * M i j * x j

def nsq (n : ℕ) (x : ℕ → ℝ) : ℝ := ∑ i ∈ range n, x i ^ 2

theorem nsq_nonneg (n : ℕ) (x : ℕ → ℝ) : 0 ≤ nsq n x :=
  sum_nonneg (fun i _ => sq_nonneg (x i))

/-- symmetric `F` with `∑_j |F_ij| ≤ 2 F_ii` (diagonal dominance) is positive semidefinite. -/
theorem qf_nonneg_of_dd (n : ℕ) (F : ℕ → ℕ → ℝ)
    (hsym : ∀ i < n, ∀ j < n, F i j = F j i)
    (hdd : ∀ i < n, ∑ j ∈ range n, |F i j| ≤ 2 * F i i) (x : ℕ → ℝ) : 0 ≤ qf n F x := by
  have hdiag : ∀ i < n, 0 ≤ F i i := by
    intro i hi
    have h1 : |F i i| ≤ ∑ j ∈ range n, |F i j| :=
      single_le_sum (f := fun j => |F i j|) (fun j _ => abs_nonneg _) (mem_range.mpr hi)
    have h2 := hdd i hi
    have h3 := le_abs_self (F i i)
    have h4 := neg_abs_le (F i i)
    linarith
  -- termwise lower bound
  have key : ∀ i ∈ range n, ∀ j ∈ range n,
      (if i = j then 2 * F i i * x i ^ 2 else 0) - |F i j| * x i ^ 2 / 2 - |F i j| * x j ^ 2 / 2
        ≤ x i * F i j * x j := by
    intro i hi j _
    by_cases h : i = j
    · subst h
      simp only [↓reduceIte]
      rw [abs_of_nonneg (hdiag i (mem_range.mp hi))]
      nlinarith [sq_nonneg (x i)]
    · simp only [h, ↓reduceIte]
      have e1 : -(|F i j| * (|x i| * |x j|)) ≤ x i * F i j * x j := by
        have := neg_abs_le (x i * F i j * x j)
        rw [abs_mul, abs_mul] at this
        nlinarith
      have e2 : 2 * (|x i| * |x j|) ≤ x i ^ 2 + x j ^ 2 := by
        nlinarith [sq_nonneg (|x i| - |x j|), sq_abs (x i), sq_abs (x j)]
      have e3 : 0 ≤ |F i j| := abs_nonneg _
      nlinarith
  have hsum := sum_le_sum (fun i hi => sum_le_sum (fun j hj => key i hi j hj))
  -- evaluate the left side
  have hswap : ∑ i ∈ range n, ∑ j ∈ range n, |F i j| * x j ^ 2 / 2
      = ∑ i ∈ range n, ∑ j ∈ range n, |F i j| * x i ^ 2 / 2 := by
    rw [sum_comm]
    apply sum_congr rfl; intro i hi; apply sum_congr rfl; intro j hj
    rw [hsym j (mem_range.mp hj) i (mem_range.mp hi)]
  have hite : ∀ i ∈ range n, ∑ j ∈ range n, (if i = j then 2 * F i i * x i ^ 2 else 0)
      = 2 * F i i * x i ^ 2 := by
    intro i hi; rw [sum_ite_eq]; simp [hi]
  simp only [sum_sub_distrib] at hsum
  rw [sum_congr rfl hite, hswap] at hsum
  have hlow : 0 ≤ ∑ i ∈ range n, 2 * F i i * x i ^ 2
      - ∑ i ∈ range n, ∑ j ∈ range n, |F i j| * x i ^ 2 / 2
      - ∑ i ∈ range n, ∑ j ∈ range n, |F i j| * x i ^ 2 / 2 := by
    have : ∀ i ∈ range n, ∑ j ∈ range n, |F i j| * x i ^ 2 / 2
        = (∑ j ∈ range n, |F i j|) * x i ^ 2 / 2 := by
      intro i _; rw [sum_mul, sum_div]
    rw [sum_congr rfl this, ← sum_sub_distrib, ← sum_sub_distrib]
    apply sum_nonneg; intro i hi
    have := hdd i (mem_range.mp hi)
    nlinarith [sq_nonneg (x i)]
  unfold qf; linarith

/-- Gram matrices are positive semidefinite. -/
theorem qf_gram (n m : ℕ) (R : ℕ → ℕ → ℝ) (x : ℕ → ℝ) :
    qf n (fun i j => ∑ k ∈ range m, R k i * R k j) x
      = ∑ k ∈ range m, (∑ i ∈ range n, R k i * x i) ^ 2 := by
  unfold qf
  have hk : ∀ k, (∑ i ∈ range n, R k i * x i) ^ 2
      = ∑ i ∈ range n, ∑ j ∈ range n, x i * (R k i * R k j) * x j := by
    intro k; rw [sq, sum_mul_sum]
    apply sum_congr rfl; intro i _; apply sum_congr rfl; intro j _; ring
  simp_rw [hk]
  conv_rhs => rw [sum_comm]
  apply sum_congr rfl; intro i _
  conv_rhs => rw [sum_comm]
  apply sum_congr rfl; intro j _
  rw [mul_sum, sum_mul]

/-- entrywise perturbation bound: `|x^T E x| ≤ ρ n |x|^2` if `|E_ij| ≤ ρ`. -/
theorem qf_perturb (n : ℕ) (E : ℕ → ℕ → ℝ) (ρ : ℝ) (hE : ∀ i < n, ∀ j < n, |E i j| ≤ ρ)
    (x : ℕ → ℝ) : |qf n E x| ≤ ρ * n * nsq n x := by
  have key : ∀ i ∈ range n, ∀ j ∈ range n, |x i * E i j * x j| ≤ ρ * x i ^ 2 / 2 + ρ * x j ^ 2 / 2 := by
    intro i hi j hj
    have h1 := hE i (mem_range.mp hi) j (mem_range.mp hj)
    rw [abs_mul, abs_mul]
    have e2 : 2 * (|x i| * |x j|) ≤ x i ^ 2 + x j ^ 2 := by
      nlinarith [sq_nonneg (|x i| - |x j|), sq_abs (x i), sq_abs (x j)]
    have e0 : 0 ≤ |x i| * |x j| := mul_nonneg (abs_nonneg _) (abs_nonneg _)
    nlinarith [abs_nonneg (E i j), abs_nonneg (x i), abs_nonneg (x j)]
  unfold qf
  calc |∑ i ∈ range n, ∑ j ∈ range n, x i * E i j * x j|
      ≤ ∑ i ∈ range n, |∑ j ∈ range n, x i * E i j * x j| := abs_sum_le_sum_abs _ _
    _ ≤ ∑ i ∈ range n, ∑ j ∈ range n, |x i * E i j * x j| :=
        sum_le_sum (fun i _ => abs_sum_le_sum_abs _ _)
    _ ≤ ∑ i ∈ range n, ∑ j ∈ range n, (ρ * x i ^ 2 / 2 + ρ * x j ^ 2 / 2) :=
        sum_le_sum (fun i hi => sum_le_sum (fun j hj => key i hi j hj))
    _ = ρ * n * nsq n x := by
        unfold nsq
        have h1 : ∀ i ∈ range n, ∑ j ∈ range n, (ρ * x i ^ 2 / 2 + ρ * x j ^ 2 / 2)
            = n * (ρ * x i ^ 2 / 2) + ∑ j ∈ range n, ρ * x j ^ 2 / 2 := by
          intro i _; rw [sum_add_distrib, sum_const, card_range, nsmul_eq_mul]
        have h2 : ∑ j ∈ range n, ρ * x j ^ 2 / 2 = ρ / 2 * ∑ j ∈ range n, x j ^ 2 := by
          rw [mul_sum]; apply sum_congr rfl; intro j _; ring
        rw [sum_congr rfl h1, sum_add_distrib, sum_const, card_range, nsmul_eq_mul, ← mul_sum, h2]
        ring

theorem qf_congr (n : ℕ) (M N : ℕ → ℕ → ℝ) (h : ∀ i < n, ∀ j < n, M i j = N i j) (x : ℕ → ℝ) :
    qf n M x = qf n N x := by
  unfold qf
  apply sum_congr rfl; intro i hi; apply sum_congr rfl; intro j hj
  rw [h i (mem_range.mp hi) j (mem_range.mp hj)]

theorem qf_add (n : ℕ) (M N : ℕ → ℕ → ℝ) (x : ℕ → ℝ) :
    qf n (fun i j => M i j + N i j) x = qf n M x + qf n N x := by
  unfold qf
  rw [← sum_add_distrib]
  apply sum_congr rfl; intro i _
  rw [← sum_add_distrib]
  apply sum_congr rfl; intro j _
  ring

theorem qf_smul (n : ℕ) (a : ℝ) (M : ℕ → ℕ → ℝ) (x : ℕ → ℝ) :
    qf n (fun i j => a * M i j) x = a * qf n M x := by
  unfold qf
  rw [mul_sum]
  apply sum_congr rfl; intro i _
  rw [mul_sum]
  apply sum_congr rfl; intro j _
  ring

theorem qf_id (n : ℕ) (x : ℕ → ℝ) :
    qf n (fun i j => if i = j then (1 : ℝ) else 0) x = nsq n x := by
  unfold qf nsq
  apply sum_congr rfl; intro i hi
  simp only [mul_ite, ite_mul, mul_one, mul_zero, zero_mul]
  rw [sum_ite_eq]
  simp [hi, sq]

theorem qf_rank1 (n : ℕ) (u : ℕ → ℝ) (x : ℕ → ℝ) :
    qf n (fun i j => u i * u j) x = (∑ i ∈ range n, u i * x i) ^ 2 := by
  unfold qf
  rw [sq, sum_mul_sum]
  apply sum_congr rfl; intro i _
  apply sum_congr rfl; intro j _
  ring

/-- `(∑ ĉ_i x_i)^2 ≤ ρ^2 n |x|^2` when `c · x = 0` and `|c_i - ĉ_i| ≤ ρ`. -/
theorem penalty_bound (n : ℕ) (c chat x : ℕ → ℝ) (ρ : ℝ)
    (hc : ∀ i < n, |c i - chat i| ≤ ρ) (hx : ∑ i ∈ range n, c i * x i = 0) :
    (∑ i ∈ range n, chat i * x i) ^ 2 ≤ ρ ^ 2 * n * nsq n x := by
  have h1 : ∑ i ∈ range n, chat i * x i = ∑ i ∈ range n, (chat i - c i) * x i := by
    have : ∑ i ∈ range n, (chat i - c i) * x i
        = ∑ i ∈ range n, chat i * x i - ∑ i ∈ range n, c i * x i := by
      rw [← sum_sub_distrib]; apply sum_congr rfl; intro i _; ring
    rw [this, hx, sub_zero]
  have h2 : |∑ i ∈ range n, chat i * x i| ≤ ρ * ∑ i ∈ range n, |x i| := by
    rw [h1, mul_sum]
    refine (abs_sum_le_sum_abs _ _).trans (sum_le_sum (fun i hi => ?_))
    rw [abs_mul, abs_sub_comm]
    exact mul_le_mul_of_nonneg_right (hc i (mem_range.mp hi)) (abs_nonneg _)
  have hρ : 0 ≤ ρ ∨ n = 0 := by
    rcases Nat.eq_zero_or_pos n with h | h
    · exact Or.inr h
    · exact Or.inl ((abs_nonneg _).trans (hc 0 h))
  have h3 : (∑ i ∈ range n, |x i|) ^ 2 ≤ n * nsq n x := by
    have := sq_sum_le_card_mul_sum_sq (s := range n) (f := fun i => |x i|)
    simpa [nsq, sq_abs] using this
  rcases hρ with hρ | hn
  · have h4 : 0 ≤ ρ * ∑ i ∈ range n, |x i| :=
      mul_nonneg hρ (sum_nonneg (fun i _ => abs_nonneg _))
    calc (∑ i ∈ range n, chat i * x i) ^ 2 = |∑ i ∈ range n, chat i * x i| ^ 2 := (sq_abs _).symm
      _ ≤ (ρ * ∑ i ∈ range n, |x i|) ^ 2 := pow_le_pow_left₀ (abs_nonneg _) h2 2
      _ = ρ ^ 2 * (∑ i ∈ range n, |x i|) ^ 2 := by ring
      _ ≤ ρ ^ 2 * (n * nsq n x) := mul_le_mul_of_nonneg_left h3 (sq_nonneg ρ)
      _ = ρ ^ 2 * n * nsq n x := by ring
  · subst hn; simp [nsq]

namespace Cert

theorem dot_sym (C : Cert) (hlen : ∀ i < C.n, (C.Rcol i).length ≤ C.n) (i j : ℕ)
    (hi : i < C.n) (hj : j < C.n) :
    dotZ (C.Rcol i) (C.Rcol j) = dotZ (C.Rcol j) (C.Rcol i) := by
  rw [dotZ_eq _ _ C.n (hlen i hi), dotZ_eq _ _ C.n (hlen j hj)]
  apply sum_congr rfl; intro k _; ring

/-- the checked certificate makes `G` positive semidefinite (as a real quadratic form). -/
theorem G_psd (C : Cert) (hc : C.Valid) (x : ℕ → ℝ) :
    0 ≤ qf C.n (fun i j => (C.Gat i j : ℝ)) x := by
  have hrows : ∀ i < C.n, _ := fun i hi => C.row_spec i (hc.2 i hi)
  have hlen : ∀ i < C.n, (C.Rcol i).length ≤ C.n := fun i hi => (hrows i hi).1
  -- F symmetric
  have hFsym : ∀ i < C.n, ∀ j < C.n, (C.Fat i j : ℝ) = (C.Fat j i : ℝ) := by
    intro i hi j hj
    have hA := (hrows i hi).2.1 j hj
    have hd := C.dot_sym hlen i j hi hj
    unfold Fat Gat
    rw [hA, hd]
    by_cases h : i = j
    · subst h; rfl
    · simp only [h, Ne.symm h, ↓reduceIte]; push_cast; ring
  have hFdd : ∀ i < C.n, ∑ j ∈ range C.n, |(C.Fat i j : ℝ)| ≤ 2 * (C.Fat i i : ℝ) := by
    intro i hi
    have := (hrows i hi).2.2
    have : ((∑ j ∈ range C.n, |C.Fat i j| : ℤ) : ℝ) ≤ ((2 * C.Fat i i : ℤ) : ℝ) := by exact_mod_cast this
    push_cast at this
    exact this
  have hF := qf_nonneg_of_dd C.n (fun i j => (C.Fat i j : ℝ)) hFsym hFdd x
  have hR := qf_gram C.n C.n (fun k i => (C.Rent k i : ℝ)) x
  have hRnn : 0 ≤ qf C.n (fun i j => ∑ k ∈ range C.n, (C.Rent k i : ℝ) * (C.Rent k j : ℝ)) x := by
    rw [hR]; exact sum_nonneg (fun k _ => sq_nonneg _)
  have hsplit : qf C.n (fun i j => (C.Gat i j : ℝ)) x
      = qf C.n (fun i j => (C.Fat i j : ℝ) + ∑ k ∈ range C.n, (C.Rent k i : ℝ) * (C.Rent k j : ℝ)) x := by
    apply qf_congr; intro i hi j hj
    have hd := dotZ_eq (C.Rcol i) (C.Rcol j) C.n (hlen i hi)
    unfold Fat
    rw [hd]
    push_cast
    unfold Rent
    ring
  rw [hsplit, qf_add]
  linarith

/-- **Soundness of the Route-41 certificate.**  If `C.Valid` (from `check` or from row blocks), then for every real matrix `A`
and vector `c` within `ρA`, `ρc` of the stored (scaled) midpoints and every `x ⟂ c` (indices `< n`):
`x^T A x ≥ (sNum/2^pA - ρA n - (lam/2^pA) ρc^2 n) |x|^2`. -/
theorem lower_bound (C : Cert) (hc : C.Valid)
    (A : ℕ → ℕ → ℝ) (c : ℕ → ℝ) (ρA ρc : ℝ)
    (hA : ∀ i < C.n, ∀ j < C.n, |A i j - (C.Aat i j : ℝ) / 2 ^ C.pA| ≤ ρA)
    (hcv : ∀ i < C.n, |c i - (C.cat i : ℝ) / 2 ^ C.pc| ≤ ρc)
    (x : ℕ → ℝ) (hx : ∑ i ∈ range C.n, c i * x i = 0) :
    ((C.sNum : ℝ) / 2 ^ C.pA - ρA * C.n - (C.lam : ℝ) / 2 ^ C.pA * (ρc ^ 2 * C.n)) * nsq C.n x
      ≤ qf C.n A x := by
  have hlam : (0 : ℝ) ≤ C.lam := by exact_mod_cast hc.1
  set n := C.n
  set S := nsq n x
  set p : ℝ := 2 ^ C.pA
  set q : ℝ := 2 ^ C.pc
  have hp : 0 < p := by positivity
  have hq : 0 < q := by positivity
  have hS : 0 ≤ S := nsq_nonneg n x
  set Am : ℕ → ℕ → ℝ := fun i j => (C.Aat i j : ℝ) / p
  set ch : ℕ → ℝ := fun i => (C.cat i : ℝ) / q
  -- (1) expand qf G
  have hscale : ((C.scale : ℤ) : ℝ) = q ^ 2 := by
    simp only [Cert.scale, q]; push_cast; ring
  have hGexp : qf n (fun i j => (C.Gat i j : ℝ)) x
      = q ^ 2 * p * qf n Am x - q ^ 2 * (C.sNum : ℝ) * S
        + (C.lam : ℝ) * q ^ 2 * (∑ i ∈ range n, ch i * x i) ^ 2 := by
    have e1 : (fun i j => (C.Gat i j : ℝ)) = fun i j =>
        ((q ^ 2 * p) * Am i j + (-(q ^ 2 * (C.sNum : ℝ))) * (if i = j then (1 : ℝ) else 0))
          + ((C.lam : ℝ) * q ^ 2) * (ch i * ch j) := by
      funext i j
      simp only [Gat, Am, ch]
      rw [Int.cast_add, Int.cast_mul, Int.cast_mul, Int.cast_mul, Int.cast_sub, hscale]
      by_cases h : i = j
      · simp only [h, ↓reduceIte]; field_simp; ring
      · simp only [h, ↓reduceIte, Int.cast_zero]; field_simp; ring
    rw [e1, qf_add, qf_add, qf_smul, qf_smul, qf_smul, qf_id, qf_rank1]
    ring
  have hG := C.G_psd hc x
  rw [hGexp] at hG
  -- (2) divide by q^2 p
  have hq2 : 0 < q ^ 2 := by positivity
  have h2 : (C.sNum : ℝ) / p * S - (C.lam : ℝ) / p * (∑ i ∈ range n, ch i * x i) ^ 2 ≤ qf n Am x := by
    have : 0 ≤ q ^ 2 * (p * qf n Am x - (C.sNum : ℝ) * S
        + (C.lam : ℝ) * (∑ i ∈ range n, ch i * x i) ^ 2) := by nlinarith
    have h' : 0 ≤ p * qf n Am x - (C.sNum : ℝ) * S + (C.lam : ℝ) * (∑ i ∈ range n, ch i * x i) ^ 2 := by
      by_contra hneg
      have hneg' := lt_of_not_ge hneg
      nlinarith
    rw [div_mul_eq_mul_div, div_mul_eq_mul_div, ← sub_div, div_le_iff₀ hp]
    linarith
  -- (3) penalty
  have h3 := penalty_bound n c ch x ρc (fun i hi => hcv i hi) hx
  have h3' : (C.lam : ℝ) / p * (∑ i ∈ range n, ch i * x i) ^ 2 ≤ (C.lam : ℝ) / p * (ρc ^ 2 * n * S) :=
    mul_le_mul_of_nonneg_left h3 (div_nonneg hlam hp.le)
  -- (4) perturbation
  have h4 := qf_perturb n (fun i j => A i j - Am i j) ρA (fun i hi j hj => hA i hi j hj) x
  have h5 : qf n A x = qf n Am x + qf n (fun i j => A i j - Am i j) x := by
    rw [← qf_add]; apply qf_congr; intro i _ j _; ring
  have h6 := neg_abs_le (qf n (fun i j => A i j - Am i j) x)
  have : (C.lam : ℝ) / p * (ρc ^ 2 * n * S) = (C.lam : ℝ) / p * (ρc ^ 2 * n) * S := by ring
  nlinarith

end Cert

end ArbReplay
