import Mathlib

/-!
# Lemma CG: Euler-product head coefficients are nonnegative and nondecreasing

Source: `formalization/paper/cg-monotonicity.md` (Lemma CG, Corollaries CG1, CG2).

Raymond's finite Euler multiplier is `E_t(s) = ∏_{p ∣ 30} (1 - b_t(p) p^{-s})` with
`b_t(x) = exp(t log² x / 4)`. For squarefree `g` and real `u > 0` put

  `C_g(u,t) = ∑_{d ∣ g} μ(d) β_d(t) b_t(u/d)`,   `β_d(t) = ∏_{p ∣ d} b_t(p)`,

and `c_n(t) = C_{gcd(n,30)}(n, t)`.

The file proves, with no `sorry` and no axioms beyond Lean's standard three:

* `covering_identity` — the abstract Möbius/covering identity behind Lemma CG
  (over an arbitrary finite index set with real weights `a p`);
* `D_nonneg_mono` — joint monotonicity (CG1) of the abstract sum;
* `Cg_eq_D` — `C_g(u,t)` equals the abstract sum with `a p = log p`, `ℓ = log (u/g)`;
* `Cg_nonneg_mono` — (CG1) `0 ≤ C_g(u',t') ≤ C_g(u,t)` for `g ≤ u' ≤ u`, `0 ≤ t' ≤ t`,
  for EVERY squarefree `g ≥ 1` (not only `g ∣ 30`);
* `cn_nonneg_mono` — (CG2) `0 ≤ c_n(t') ≤ c_n(t)` for every `n ≥ 1`, `0 ≤ t' ≤ t`.

Formalisation note. The pair atoms of the covering identity are indexed by ORDERED pairs
`(p,q) ∈ P.offDiag` with weight `exp(t a_p a_q / 4) - 1`, instead of the unordered pairs of the
paper with weight `exp(t a_p a_q / 2) - 1`. Since
`(1 + r_pq) = (1 + r'_pq)(1 + r'_qp)` with `r' = exp(t a_p a_q/4) - 1`, this is the same expansion
with each edge split into two ordered half-edges; the covering sum is again a sum of products of
nonnegative, nondecreasing weights, which is all that CG1/CG2 use.
-/

open Finset Real

namespace RaymondCore.CG

section Abstract

variable {ι : Type*} [DecidableEq ι]

/-- Vertex set of an atom: a single vertex `p`, or an ordered pair `(p,q)`. -/
def atomV : ι ⊕ (ι × ι) → Finset ι
  | Sum.inl p => {p}
  | Sum.inr e => {e.1, e.2}

/-- Atoms supported in `S`: its vertices and its ordered pairs of distinct vertices. -/
def atoms (S : Finset ι) : Finset (ι ⊕ (ι × ι)) := S.disjSum S.offDiag

/-- Atom weights `π_p = exp(t ℓ a_p / 2) - 1`, `r'_pq = exp(t a_p a_q / 4) - 1`. -/
noncomputable def wt (a : ι → ℝ) (ℓ t : ℝ) : ι ⊕ (ι × ι) → ℝ
  | Sum.inl p => exp (t * (ℓ * a p / 2)) - 1
  | Sum.inr e => exp (t * (a e.1 * a e.2 / 4)) - 1

/-- The alternating (Möbius) sum: `∑_{S ⊆ P} (-1)^{|P \ S|} exp(t/4 ((ℓ + Σ_S a)² + Σ_{P∖S} a²))`.
With `a p = log p` and `ℓ = log (u/g)` this is `C_g(u,t)` (see `Cg_eq_D`). -/
noncomputable def D (P : Finset ι) (a : ι → ℝ) (ℓ t : ℝ) : ℝ :=
  ∑ S ∈ P.powerset, (-1 : ℝ) ^ (P \ S).card *
    exp (t / 4 * ((ℓ + ∑ p ∈ S, a p) ^ 2 + ∑ p ∈ P \ S, a p ^ 2))

/-- Covering families: sets of atoms of `P` whose vertex sets cover `P`. -/
def covers (P : Finset ι) : Finset (Finset (ι ⊕ (ι × ι))) :=
  (atoms P).powerset.filter (fun B => B.biUnion atomV = P)

lemma mem_atoms_iff_atomV_subset {P S : Finset ι} {x : ι ⊕ (ι × ι)} (hx : x ∈ atoms P) :
    x ∈ atoms S ↔ atomV x ⊆ S := by
  cases x with
  | inl p => simp [atoms, atomV]
  | inr e =>
    simp only [atoms, mem_disjSum, atomV, insert_subset_iff, singleton_subset_iff] at hx ⊢
    simp only [reduceCtorEq, and_false, exists_false, Sum.inr.injEq, exists_eq_right, false_or,
      mem_offDiag] at hx ⊢
    tauto

omit [DecidableEq ι] in
lemma atoms_mono {S P : Finset ι} (h : S ⊆ P) : atoms S ⊆ atoms P := by
  intro x hx
  cases x with
  | inl p => simp only [atoms, mem_disjSum] at hx ⊢; simp_all; exact h hx
  | inr e =>
    simp only [atoms, mem_disjSum, mem_offDiag] at hx ⊢
    simp_all
    exact ⟨h hx.1, h hx.2.1⟩

lemma atomV_subset {P : Finset ι} {x : ι ⊕ (ι × ι)} (hx : x ∈ atoms P) : atomV x ⊆ P :=
  (mem_atoms_iff_atomV_subset hx).1 hx

/-- `(Σ_S a)² = Σ_S a² + Σ_{offDiag S} a_p a_q`. -/
lemma sq_sum_eq (S : Finset ι) (a : ι → ℝ) :
    (∑ p ∈ S, a p) ^ 2 = ∑ p ∈ S, a p ^ 2 + ∑ e ∈ S.offDiag, a e.1 * a e.2 := by
  rw [sq, sum_mul_sum, ← sum_product', ← diag_union_offDiag,
    sum_union (disjoint_diag_offDiag S), sum_diag]
  simp [sq]

/-- Step 1 of the paper (one divisor), in exponential form. -/
lemma exp_term_eq {P S : Finset ι} (hS : S ⊆ P) (a : ι → ℝ) (ℓ t : ℝ) :
    exp (t / 4 * ((ℓ + ∑ p ∈ S, a p) ^ 2 + ∑ p ∈ P \ S, a p ^ 2)) =
      exp (t / 4 * (ℓ ^ 2 + ∑ p ∈ P, a p ^ 2)) * ∏ x ∈ atoms S, (1 + wt a ℓ t x) := by
  have hprod : ∏ x ∈ atoms S, (1 + wt a ℓ t x) =
      exp (∑ p ∈ S, t * (ℓ * a p / 2) + ∑ e ∈ S.offDiag, t * (a e.1 * a e.2 / 4)) := by
    rw [atoms, prod_disjSum, exp_add, exp_sum, exp_sum]
    congr 1 <;> refine prod_congr rfl (fun x _ => ?_) <;> simp [wt]
  rw [hprod, ← exp_add]
  congr 1
  have hsplit : ∑ p ∈ P, a p ^ 2 = ∑ p ∈ P \ S, a p ^ 2 + ∑ p ∈ S, a p ^ 2 :=
    (sum_sdiff hS).symm
  have h1 : ∑ p ∈ S, t * (ℓ * a p / 2) = t * ℓ / 2 * ∑ p ∈ S, a p := by
    rw [mul_sum]; refine sum_congr rfl (fun _ _ => by ring)
  have h2 : ∑ e ∈ S.offDiag, t * (a e.1 * a e.2 / 4) = t / 4 * ∑ e ∈ S.offDiag, a e.1 * a e.2 := by
    rw [mul_sum]; refine sum_congr rfl (fun _ _ => by ring)
  rw [hsplit, h1, h2, add_sq, sq_sum_eq S a]
  ring

/-- Step 3 of the paper: the inner alternating sum. -/
lemma inner_alt_sum {P U : Finset ι} (hU : U ⊆ P) :
    ∑ S ∈ P.powerset with U ⊆ S, (-1 : ℝ) ^ (P \ S).card = if U = P then 1 else 0 := by
  have hre : ∑ S ∈ P.powerset with U ⊆ S, (-1 : ℝ) ^ (P \ S).card =
      ∑ R ∈ (P \ U).powerset, (-1 : ℝ) ^ R.card := by
    refine sum_nbij' (fun S => P \ S) (fun R => P \ R) ?_ ?_ ?_ ?_ ?_
    · intro S hS
      simp only [mem_filter, mem_powerset] at hS ⊢
      exact sdiff_subset_sdiff (le_refl P) hS.2
    · intro R hR
      simp only [mem_filter, mem_powerset] at hR ⊢
      refine ⟨sdiff_subset, ?_⟩
      intro x hx
      rw [mem_sdiff]
      exact ⟨hU hx, fun hxR => (mem_sdiff.1 (hR hxR)).2 hx⟩
    · intro S hS
      simp only [mem_filter, mem_powerset] at hS
      exact Finset.sdiff_sdiff_eq_self hS.1
    · intro R hR
      simp only [mem_powerset] at hR
      exact Finset.sdiff_sdiff_eq_self (hR.trans sdiff_subset)
    · intro S _; rfl
  rw [hre]
  have hz := sum_powerset_neg_one_pow_card (x := P \ U)
  have hcast : ∑ R ∈ (P \ U).powerset, (-1 : ℝ) ^ R.card =
      ((∑ R ∈ (P \ U).powerset, (-1 : ℤ) ^ R.card : ℤ) : ℝ) := by push_cast; rfl
  rw [hcast, hz]
  have hiff : P \ U = ∅ ↔ U = P := by
    rw [sdiff_eq_empty_iff_subset]
    exact ⟨fun h => le_antisymm hU h, fun h => h ▸ le_refl _⟩
  by_cases h : U = P
  · simp [h]
  · have : ¬ (P \ U = ∅) := fun h' => h (hiff.1 h')
    simp [h, this]

/-- **Lemma CG (covering identity), abstract form.** -/
theorem covering_identity (P : Finset ι) (a : ι → ℝ) (ℓ t : ℝ) :
    D P a ℓ t = exp (t / 4 * (ℓ ^ 2 + ∑ p ∈ P, a p ^ 2)) *
      ∑ B ∈ covers P, ∏ x ∈ B, wt a ℓ t x := by
  set K := exp (t / 4 * (ℓ ^ 2 + ∑ p ∈ P, a p ^ 2))
  set f : Finset (ι ⊕ (ι × ι)) → ℝ := fun B => ∏ x ∈ B, wt a ℓ t x
  -- expand each term
  have h1 : D P a ℓ t = ∑ S ∈ P.powerset, (-1 : ℝ) ^ (P \ S).card *
      (K * ∑ B ∈ (atoms P).powerset with B ⊆ atoms S, f B) := by
    unfold D
    refine sum_congr rfl (fun S hS => ?_)
    rw [mem_powerset] at hS
    rw [exp_term_eq hS, prod_one_add]
    congr 2
    have : (atoms S).powerset = (atoms P).powerset.filter (fun B => B ⊆ atoms S) := by
      ext B
      simp only [mem_powerset, mem_filter]
      exact ⟨fun h => ⟨h.trans (atoms_mono hS), h⟩, fun h => h.2⟩
    rw [this]
  -- swap the sums
  have h2 : ∑ S ∈ P.powerset, (-1 : ℝ) ^ (P \ S).card *
      (K * ∑ B ∈ (atoms P).powerset with B ⊆ atoms S, f B) =
      K * ∑ B ∈ (atoms P).powerset, f B *
        ∑ S ∈ P.powerset with B.biUnion atomV ⊆ S, (-1 : ℝ) ^ (P \ S).card := by
    simp_rw [sum_filter, mul_sum, mul_ite, mul_zero]
    rw [sum_comm]
    refine sum_congr rfl (fun B hB => sum_congr rfl (fun S _ => ?_))
    rw [mem_powerset] at hB
    have hiff : B ⊆ atoms S ↔ B.biUnion atomV ⊆ S := by
      rw [biUnion_subset]
      exact ⟨fun h x hx => (mem_atoms_iff_atomV_subset (hB hx)).1 (h hx),
        fun h x hx => (mem_atoms_iff_atomV_subset (hB hx)).2 (h x hx)⟩
    by_cases h : B ⊆ atoms S
    · have h' := hiff.1 h
      simp only [h, h', ↓reduceIte]; ring
    · have h' : ¬ B.biUnion atomV ⊆ S := fun h' => h (hiff.2 h')
      simp only [h, h', ↓reduceIte]
  rw [h1, h2]
  congr 1
  rw [covers, sum_filter]
  refine sum_congr rfl (fun B hB => ?_)
  rw [mem_powerset] at hB
  have hU : B.biUnion atomV ⊆ P := biUnion_subset.2 (fun x hx => atomV_subset (hB hx))
  rw [inner_alt_sum hU]
  split_ifs <;> simp [f]

omit [DecidableEq ι] in
lemma wt_nonneg_mono {P : Finset ι} {a : ι → ℝ} (ha : ∀ p ∈ P, 0 ≤ a p)
    {ℓ ℓ' t t' : ℝ} (hℓ' : 0 ≤ ℓ') (hℓ : ℓ' ≤ ℓ) (ht' : 0 ≤ t') (ht : t' ≤ t)
    {x : ι ⊕ (ι × ι)} (hx : x ∈ atoms P) :
    0 ≤ wt a ℓ' t' x ∧ wt a ℓ' t' x ≤ wt a ℓ t x := by
  cases x with
  | inl p =>
    have hp : p ∈ P := by simpa [atoms] using hx
    have hap := ha p hp
    have e0 : 0 ≤ t' * (ℓ' * a p / 2) := by positivity
    have e1 : t' * (ℓ' * a p / 2) ≤ t * (ℓ * a p / 2) := by
      apply mul_le_mul ht _ (by positivity) (by linarith)
      have := mul_le_mul_of_nonneg_right hℓ hap
      linarith
    simp only [wt]
    constructor
    · have := Real.one_le_exp e0; linarith
    · have := Real.exp_le_exp.2 e1; linarith
  | inr e =>
    have he : e ∈ P.offDiag := by simpa [atoms] using hx
    rw [mem_offDiag] at he
    have h1 := ha _ he.1
    have h2 := ha _ he.2.1
    have e0 : 0 ≤ t' * (a e.1 * a e.2 / 4) := by positivity
    have e1 : t' * (a e.1 * a e.2 / 4) ≤ t * (a e.1 * a e.2 / 4) :=
      mul_le_mul_of_nonneg_right ht (by positivity)
    simp only [wt]
    constructor
    · have := Real.one_le_exp e0; linarith
    · have := Real.exp_le_exp.2 e1; linarith

/-- **Corollary CG1 (abstract).** For `a ≥ 0` on `P`, `0 ≤ ℓ' ≤ ℓ`, `0 ≤ t' ≤ t`:
`0 ≤ D(ℓ',t') ≤ D(ℓ,t)`. -/
theorem D_nonneg_mono {P : Finset ι} {a : ι → ℝ} (ha : ∀ p ∈ P, 0 ≤ a p)
    {ℓ ℓ' t t' : ℝ} (hℓ' : 0 ≤ ℓ') (hℓ : ℓ' ≤ ℓ) (ht' : 0 ≤ t') (ht : t' ≤ t) :
    0 ≤ D P a ℓ' t' ∧ D P a ℓ' t' ≤ D P a ℓ t := by
  rw [covering_identity, covering_identity]
  have hs : 0 ≤ ∑ p ∈ P, a p ^ 2 := sum_nonneg (fun _ _ => sq_nonneg _)
  have hK : exp (t' / 4 * (ℓ' ^ 2 + ∑ p ∈ P, a p ^ 2)) ≤
      exp (t / 4 * (ℓ ^ 2 + ∑ p ∈ P, a p ^ 2)) := by
    apply Real.exp_le_exp.2
    apply mul_le_mul (by linarith) _ (by positivity) (by linarith)
    have : ℓ' ^ 2 ≤ ℓ ^ 2 := pow_le_pow_left₀ hℓ' hℓ 2
    linarith
  have hmem : ∀ B ∈ covers P, ∀ x ∈ B, x ∈ atoms P := by
    intro B hB x hx
    rw [covers, mem_filter, mem_powerset] at hB
    exact hB.1 hx
  have hS0 : 0 ≤ ∑ B ∈ covers P, ∏ x ∈ B, wt a ℓ' t' x :=
    sum_nonneg (fun B hB => prod_nonneg (fun x hx =>
      (wt_nonneg_mono ha hℓ' hℓ ht' ht (hmem B hB x hx)).1))
  have hS : ∑ B ∈ covers P, ∏ x ∈ B, wt a ℓ' t' x ≤ ∑ B ∈ covers P, ∏ x ∈ B, wt a ℓ t x :=
    sum_le_sum (fun B hB => prod_le_prod₀
      (fun x hx => (wt_nonneg_mono ha hℓ' hℓ ht' ht (hmem B hB x hx)).1)
      (fun x hx => (wt_nonneg_mono ha hℓ' hℓ ht' ht (hmem B hB x hx)).2))
  exact ⟨mul_nonneg (exp_pos _).le hS0,
    mul_le_mul hK hS hS0 (exp_pos _).le⟩

end Abstract

section Raymond

open ArithmeticFunction

/-- `b_t(x) = exp(t log² x / 4)`. -/
noncomputable def bt (t x : ℝ) : ℝ := exp (t * Real.log x ^ 2 / 4)

/-- `β_d(t) = ∏_{p ∣ d} b_t(p)`. -/
noncomputable def betaD (t : ℝ) (d : ℕ) : ℝ := ∏ p ∈ d.primeFactors, bt t p

/-- `C_g(u,t) = ∑_{d ∣ g} μ(d) β_d(t) b_t(u/d)` (cg-monotonicity.md eq. (0.2)). -/
noncomputable def Cg (g : ℕ) (u t : ℝ) : ℝ :=
  ∑ d ∈ g.divisors, ((ArithmeticFunction.moebius d : ℤ) : ℝ) * betaD t d * bt t (u / d)

/-- Raymond's head coefficient `c_n(t) = ∑_{d ∣ (n,30)} μ(d) β_d(t) b_t(n/d)` (eq. (0.1)). -/
noncomputable def cn (n : ℕ) (t : ℝ) : ℝ := Cg (Nat.gcd n 30) n t

lemma log_natCast_prod (D : Finset ℕ) (hD : ∀ p ∈ D, p.Prime) :
    Real.log ((∏ p ∈ D, p : ℕ) : ℝ) = ∑ p ∈ D, Real.log p := by
  rw [Nat.cast_prod, Real.log_prod]
  intro p hp
  exact_mod_cast (hD p hp).ne_zero

/-- `C_g(u,t)` is the abstract alternating sum with `a p = log p`, `ℓ = log(u/g)`. -/
theorem Cg_eq_D {g : ℕ} (hg : Squarefree g) {u : ℝ} (hu : 0 < u) (t : ℝ) :
    Cg g u t = D g.primeFactors (fun p => Real.log p) (Real.log (u / g)) t := by
  have hg0 : g ≠ 0 := hg.ne_zero
  set P := g.primeFactors with hP
  have hprimes : ∀ p ∈ P, p.Prime := fun p hp => Nat.prime_of_mem_primeFactors hp
  have hgP : (∏ p ∈ P, p) = g := Nat.prod_primeFactors_of_squarefree hg
  unfold D Cg
  symm
  refine sum_nbij' (fun S => ∏ p ∈ P \ S, p) (fun d => P \ d.primeFactors) ?_ ?_ ?_ ?_ ?_
  · intro S _
    simp only [Nat.mem_divisors]
    refine ⟨?_, hg0⟩
    calc (∏ p ∈ P \ S, p) ∣ ∏ p ∈ P, p := prod_dvd_prod_of_subset _ _ _ sdiff_subset
      _ = g := hgP
  · intro d _
    simp only [mem_powerset]
    exact sdiff_subset
  · intro S hS
    simp only [mem_powerset] at hS
    rw [Nat.primeFactors_prod (fun p hp => hprimes p (mem_sdiff.1 hp).1)]
    exact Finset.sdiff_sdiff_eq_self hS
  · intro d hd
    simp only [Nat.mem_divisors] at hd
    have hsub : d.primeFactors ⊆ P := Nat.primeFactors_mono hd.1 hg0
    rw [Finset.sdiff_sdiff_eq_self hsub]
    exact Nat.prod_primeFactors_of_squarefree (hg.squarefree_of_dvd hd.1)
  · intro S hS
    simp only [mem_powerset] at hS
    set Dset := P \ S with hDset
    have hDprimes : ∀ p ∈ Dset, p.Prime := fun p hp => hprimes p (mem_sdiff.1 hp).1
    have hDsub : Dset ⊆ g.primeFactors := sdiff_subset
    -- Möbius value
    have hmu : ((ArithmeticFunction.moebius (∏ p ∈ Dset, p) : ℤ) : ℝ) = (-1 : ℝ) ^ Dset.card := by
      rw [isMultiplicative_moebius.map_prod_of_subset_primeFactors g Dset hDsub]
      rw [prod_congr rfl (fun p hp => moebius_apply_prime (hDprimes p hp))]
      simp
    -- β value
    have hbeta : betaD t (∏ p ∈ Dset, p) = exp (t / 4 * ∑ p ∈ Dset, Real.log p ^ 2) := by
      rw [betaD, Nat.primeFactors_prod hDprimes]
      simp only [bt]
      rw [← exp_sum, mul_sum]
      congr 1; refine sum_congr rfl (fun _ _ => by ring)
    -- log of u / d
    have hlogg : Real.log (g : ℝ) = ∑ p ∈ P, Real.log p := by
      conv_lhs => rw [← hgP]
      exact log_natCast_prod P hprimes
    have hd0 : ((∏ p ∈ Dset, p : ℕ) : ℝ) ≠ 0 := by
      rw [Nat.cast_prod]; exact prod_ne_zero_iff.2 (fun p hp => by
        exact_mod_cast (hDprimes p hp).ne_zero)
    have hg0' : (g : ℝ) ≠ 0 := by exact_mod_cast hg0
    have hlog : Real.log (u / ((∏ p ∈ Dset, p : ℕ) : ℝ)) =
        Real.log (u / g) + ∑ p ∈ S, Real.log p := by
      rw [Real.log_div hu.ne' hd0, Real.log_div hu.ne' hg0', log_natCast_prod Dset hDprimes,
        hlogg, ← sum_sdiff hS]
      ring
    rw [hmu, hbeta, bt, hlog, mul_assoc, ← exp_add]
    congr 2
    ring

/-- **Corollary CG1 for `C_g`.** For squarefree `g` and `g ≤ u' ≤ u`, `0 ≤ t' ≤ t`:
`0 ≤ C_g(u',t') ≤ C_g(u,t)`. -/
theorem Cg_nonneg_mono {g : ℕ} (hg : Squarefree g) {u u' t t' : ℝ}
    (hu' : (g : ℝ) ≤ u') (hu : u' ≤ u) (ht' : 0 ≤ t') (ht : t' ≤ t) :
    0 ≤ Cg g u' t' ∧ Cg g u' t' ≤ Cg g u t := by
  have hg0 : (0 : ℝ) < g := by exact_mod_cast Nat.pos_of_ne_zero hg.ne_zero
  have hu'0 : 0 < u' := lt_of_lt_of_le hg0 hu'
  have hu0 : 0 < u := lt_of_lt_of_le hu'0 hu
  rw [Cg_eq_D hg hu'0, Cg_eq_D hg hu0]
  apply D_nonneg_mono
  · intro p hp
    exact Real.log_nonneg (by exact_mod_cast (Nat.prime_of_mem_primeFactors hp).one_le)
  · exact Real.log_nonneg ((one_le_div hg0).2 hu')
  · exact Real.log_le_log (div_pos hu'0 hg0) (div_le_div_of_nonneg_right hu hg0.le)
  · exact ht'
  · exact ht

lemma squarefree_thirty : Squarefree (30 : ℕ) := by
  rw [show (30 : ℕ) = 2 * 3 * 5 by norm_num, Nat.squarefree_mul_iff, Nat.squarefree_mul_iff]
  exact ⟨by norm_num, ⟨by norm_num, Nat.prime_two.squarefree, Nat.prime_three.squarefree⟩,
    Nat.prime_five.squarefree⟩

/-- **Corollary CG2 (Raymond's statement, every `n ≥ 1`).** `t ↦ c_n(t)` is nonnegative and
nondecreasing on `[0, ∞)`. -/
theorem cn_nonneg_mono {n : ℕ} (hn : 1 ≤ n) {t t' : ℝ} (ht' : 0 ≤ t') (ht : t' ≤ t) :
    0 ≤ cn n t' ∧ cn n t' ≤ cn n t := by
  have hsq : Squarefree (Nat.gcd n 30) :=
    Squarefree.squarefree_of_dvd (Nat.gcd_dvd_right n 30) squarefree_thirty
  have hle : ((Nat.gcd n 30 : ℕ) : ℝ) ≤ (n : ℝ) := by
    exact_mod_cast Nat.le_of_dvd hn (Nat.gcd_dvd_left n 30)
  exact Cg_nonneg_mono hsq hle le_rfl ht' ht

end Raymond

end RaymondCore.CG
