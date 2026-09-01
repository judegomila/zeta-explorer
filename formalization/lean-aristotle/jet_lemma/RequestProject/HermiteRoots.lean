import RequestProject.HeatOp

/-!
# The Hermite polynomials have `n` distinct real roots

The main result of this file is `hermiteReal_eq_prod_X_sub_C`: for every `n`,
`hermiteReal n` is a product of `n` distinct linear factors over `ℝ`.  The proof
is the classical sign-alternation induction along the recursion
`He_{n+1} = X · He_n - He_n'`.
-/

open Polynomial Finset

namespace JetLemma

section General

variable {n : ℕ}

lemma monic_prod_X_sub_C (S : Finset ℕ) (r : ℕ → ℝ) :
    (∏ i ∈ S, (X - C (r i))).Monic :=
  monic_prod_of_monic _ _ fun _ _ => monic_X_sub_C _

lemma natDegree_prod_X_sub_C (S : Finset ℕ) (r : ℕ → ℝ) :
    (∏ i ∈ S, (X - C (r i))).natDegree = S.card := by
  rw [natDegree_prod _ _ (fun i _ => X_sub_C_ne_zero (r i))]
  simp

/-- Intermediate value theorem for polynomials, in the form used below. -/
lemma exists_root_Ioo {q : ℝ[X]} {a b : ℝ} (hab : a < b) (h : q.eval a * q.eval b < 0) :
    ∃ x, a < x ∧ x < b ∧ q.eval x = 0 := by
  have hcont : ContinuousOn (fun x => q.eval x) (Set.Icc a b) := (q.continuous_aeval).continuousOn
  rcases mul_neg_iff.mp h with ⟨h1, h2⟩ | ⟨h1, h2⟩
  · obtain ⟨x, hx, hx0⟩ :=
      intermediate_value_Ioo' hab.le hcont (show (0 : ℝ) ∈ Set.Ioo (q.eval b) (q.eval a) from ⟨h2, h1⟩)
    exact ⟨x, hx.1, hx.2, hx0⟩
  · obtain ⟨x, hx, hx0⟩ :=
      intermediate_value_Ioo hab.le hcont (show (0 : ℝ) ∈ Set.Ioo (q.eval a) (q.eval b) from ⟨h1, h2⟩)
    exact ⟨x, hx.1, hx.2, hx0⟩

/-- A monic polynomial of degree `deg` with `deg` distinct roots is the product of the
corresponding linear factors. -/
lemma eq_prod_of_monic_of_roots {q : ℝ[X]} {T : Finset ℝ} (hq : q.Monic)
    (hdeg : q.natDegree = T.card) (hroots : ∀ x ∈ T, q.eval x = 0) :
    q = ∏ x ∈ T, (X - C x) := by
  have hq0 : q ≠ 0 := hq.ne_zero
  have hle : T.val ≤ q.roots := by
    rw [Multiset.le_iff_count]
    intro x
    rw [count_roots]
    by_cases hx : x ∈ T
    · rw [Multiset.count_eq_one_of_mem T.nodup hx]
      exact (rootMultiplicity_pos hq0).mpr (hroots x hx)
    · simp [Multiset.count_eq_zero_of_notMem, hx]
  have hdvd : (∏ x ∈ T, (X - C x)) ∣ q := by
    have h1 : (T.val.map fun a => X - C a).prod ∣ (q.roots.map fun a => X - C a).prod :=
      Multiset.prod_dvd_prod_of_le (Multiset.map_le_map hle)
    have h2 := h1.trans q.prod_multiset_X_sub_C_dvd
    rwa [Finset.prod_eq_multiset_prod]
  obtain ⟨u, hu⟩ := hdvd
  have hP : (∏ x ∈ T, (X - C x)).Monic := monic_prod_of_monic _ _ fun _ _ => monic_X_sub_C _
  have hPdeg : (∏ x ∈ T, (X - C x)).natDegree = T.card := by
    rw [natDegree_prod _ _ (fun i _ => X_sub_C_ne_zero i)]
    simp
  have hum : u.Monic := hP.of_mul_monic_left (hu ▸ hq)
  have hudeg : u.natDegree = 0 := by
    have h3 := hu ▸ hdeg
    rw [natDegree_mul hP.ne_zero hum.ne_zero, hPdeg] at h3
    omega
  rw [hu, hum.natDegree_eq_zero.mp hudeg, mul_one]

/-- A monic polynomial of positive degree is eventually positive. -/
lemma exists_gt_eval_pos {q : ℝ[X]} (hq : q.Monic) (hdeg : 0 < q.natDegree) (c : ℝ) :
    ∃ b, c < b ∧ 0 < q.eval b := by
  have h1 : Filter.Tendsto (fun x => q.eval x) Filter.atTop Filter.atTop :=
    q.tendsto_atTop_of_leadingCoeff_nonneg
      (by exact_mod_cast natDegree_pos_iff_degree_pos.mp hdeg) (by simp [hq.leadingCoeff])
  obtain ⟨b, hb1, hb2⟩ := ((h1.eventually_gt_atTop 0).and (Filter.eventually_gt_atTop c)).exists
  exact ⟨b, hb2, hb1⟩

/-- Sign of a monic polynomial of degree `m` near `-∞`. -/
lemma exists_lt_eval_sign {q : ℝ[X]} {m : ℕ} (hq : q.Monic) (hdeg : q.natDegree = m)
    (hm : 0 < m) (c : ℝ) :
    ∃ a, a < c ∧ 0 < (-1 : ℝ) ^ m * q.eval a := by
  have hcomplead : (q.comp (-X : ℝ[X])).leadingCoeff = (-1 : ℝ) ^ m := by
    rw [leadingCoeff_comp (by simp)]
    simp [hq.leadingCoeff, hdeg]
  set g : ℝ[X] := C ((-1 : ℝ) ^ m) * q.comp (-X) with hg
  have hgm : g.Monic := by
    unfold Polynomial.Monic
    rw [hg, leadingCoeff_mul, leadingCoeff_C, hcomplead, ← pow_add]
    rcases Nat.even_or_odd m with he | ho
    · exact Even.neg_one_pow (he.add he)
    · exact Even.neg_one_pow (ho.add_odd ho)
  have hcompdeg : (q.comp (-X : ℝ[X])).natDegree = m := by
    rw [natDegree_comp]
    simp [hdeg]
  have hgdeg : 0 < g.natDegree := by
    rw [hg, natDegree_C_mul (by positivity : ((-1 : ℝ) ^ m) ≠ 0), hcompdeg]
    omega
  obtain ⟨y, hy1, hy2⟩ := exists_gt_eval_pos hgm hgdeg (-c)
  refine ⟨-y, by linarith, ?_⟩
  have hev : g.eval y = (-1 : ℝ) ^ m * q.eval (-y) := by
    rw [hg]; simp [eval_comp]
  linarith [hev ▸ hy2]

/-- Evaluating the derivative of `∏ (X - r j)` at one of the roots. -/
lemma eval_derivative_prod_X_sub_C (r : ℕ → ℝ) {i : ℕ} (hi : i < n) :
    (derivative (∏ j ∈ range n, (X - C (r j)))).eval (r i)
      = ∏ j ∈ (range n).erase i, (r i - r j) := by
  classical
  rw [derivative_prod_finset, eval_finset_sum, Finset.sum_eq_single i]
  · simp [eval_prod]
  · intro b hb hbi
    have hmem : i ∈ (range n).erase b :=
      Finset.mem_erase.mpr ⟨fun h => hbi h.symm, Finset.mem_range.mpr hi⟩
    simp only [eval_mul, eval_prod]
    exact mul_eq_zero_of_left (Finset.prod_eq_zero hmem (by simp)) _
  · intro h
    exact absurd (Finset.mem_range.mpr hi) h

/-- The sign of the derivative at the `i`-th of `n` increasing roots is `(-1)^(n-1-i)`. -/
lemma sign_eval_derivative_prod (r : ℕ → ℝ) (hmono : ∀ i j, i < j → j < n → r i < r j)
    {i : ℕ} (hi : i < n) :
    0 < (-1 : ℝ) ^ (n - 1 - i) * (derivative (∏ j ∈ range n, (X - C (r j)))).eval (r i) := by
  rw [eval_derivative_prod_X_sub_C r hi]
  have hsplit : (range n).erase i = range i ∪ Finset.Ioo i n := by
    ext j
    simp only [Finset.mem_erase, Finset.mem_range, Finset.mem_union, Finset.mem_Ioo]
    omega
  have hdisj : Disjoint (range i) (Finset.Ioo i n) := by
    rw [Finset.disjoint_left]
    intro x hx hx'
    simp only [Finset.mem_range] at hx
    simp only [Finset.mem_Ioo] at hx'
    omega
  rw [hsplit, Finset.prod_union hdisj]
  have hA : 0 < ∏ j ∈ range i, (r i - r j) := by
    refine Finset.prod_pos fun j hj => ?_
    have hji : j < i := Finset.mem_range.mp hj
    have := hmono j i hji hi
    linarith
  have hcong : ∀ j ∈ Finset.Ioo i n, (r i - r j) = -(r j - r i) := fun j _ => by ring
  have hBeq : ∏ j ∈ Finset.Ioo i n, (r i - r j)
      = (-1 : ℝ) ^ (n - 1 - i) * ∏ j ∈ Finset.Ioo i n, (r j - r i) := by
    rw [Finset.prod_congr rfl hcong, Finset.prod_neg, Nat.card_Ioo]
    congr 2
    omega
  have hB : 0 < ∏ j ∈ Finset.Ioo i n, (r j - r i) := by
    refine Finset.prod_pos fun j hj => ?_
    simp only [Finset.mem_Ioo] at hj
    have := hmono i j hj.1 hj.2
    linarith
  have hsq : ((-1 : ℝ) ^ (n - 1 - i)) * ((-1 : ℝ) ^ (n - 1 - i)) = 1 := by
    rw [← pow_add]
    rcases Nat.even_or_odd (n - 1 - i) with he | ho
    · exact Even.neg_one_pow (he.add he)
    · exact Even.neg_one_pow (ho.add_odd ho)
  rw [hBeq]
  have hrw : (-1 : ℝ) ^ (n - 1 - i) *
      ((∏ j ∈ range i, (r i - r j)) *
        ((-1 : ℝ) ^ (n - 1 - i) * ∏ j ∈ Finset.Ioo i n, (r j - r i)))
      = ((-1 : ℝ) ^ (n - 1 - i) * (-1 : ℝ) ^ (n - 1 - i)) *
        ((∏ j ∈ range i, (r i - r j)) * ∏ j ∈ Finset.Ioo i n, (r j - r i)) := by ring
  rw [hrw, hsq, one_mul]
  exact mul_pos hA hB

end General

/-- Inductive step: if a monic polynomial `p` is a product of `n` distinct linear factors,
then so is `X * p - p'`, with `n + 1` factors. -/
theorem exists_ordered_roots_step {n : ℕ} {p : ℝ[X]} (r : ℕ → ℝ)
    (hmono : ∀ i j, i < j → j < n → r i < r j)
    (hp : p = ∏ i ∈ range n, (X - C (r i))) :
    ∃ t : ℕ → ℝ, (∀ i j, i < j → j < n + 1 → t i < t j) ∧
      X * p - derivative p = ∏ i ∈ range (n + 1), (X - C (t i)) := by
  classical
  have hpm : p.Monic := hp ▸ monic_prod_X_sub_C _ _
  have hpdeg : p.natDegree = n := by rw [hp, natDegree_prod_X_sub_C, Finset.card_range]
  have hXpm : (X * p).Monic := monic_X.mul hpm
  have hXpdeg : (X * p).natDegree = n + 1 := by
    rw [natDegree_mul X_ne_zero hpm.ne_zero, natDegree_X, hpdeg, Nat.add_comm]
  have hDdeg : (derivative p).natDegree < (X * p).natDegree := by
    have := (natDegree_derivative_le p).trans (Nat.sub_le p.natDegree 1)
    omega
  have hqm : (X * p - derivative p).Monic := hXpm.sub_of_left (degree_lt_degree hDdeg)
  have hqdeg : (X * p - derivative p).natDegree = n + 1 := by
    rw [natDegree_sub_eq_left_of_natDegree_lt hDdeg, hXpdeg]
  set q : ℝ[X] := X * p - derivative p with hqdef
  rcases Nat.eq_zero_or_pos n with hn0 | hnpos
  · subst hn0
    refine ⟨fun _ => 0, by intro i j hij hj; omega, ?_⟩
    simp [hqdef, hp]
  -- signs of `q` at the roots of `p`
  have hpev : ∀ i, i < n → p.eval (r i) = 0 := by
    intro i hi
    rw [hp, eval_prod]
    exact Finset.prod_eq_zero (Finset.mem_range.mpr hi) (by simp)
  have hqev : ∀ i, i < n → q.eval (r i) = -(derivative p).eval (r i) := by
    intro i hi
    rw [hqdef]
    simp [hpev i hi]
  have hsign : ∀ i, i < n → 0 < (-1 : ℝ) ^ (n - 1 - i) * (derivative p).eval (r i) := by
    intro i hi
    rw [hp]
    exact sign_eval_derivative_prod r hmono hi
  obtain ⟨b, hb1, hb2⟩ := exists_gt_eval_pos hqm (by omega : 0 < q.natDegree) (r (n - 1))
  obtain ⟨a, ha1, ha2⟩ := exists_lt_eval_sign hqm hqdeg (by omega) (r 0)
  set L : ℕ → ℝ := fun k => if k = 0 then a else r (k - 1) with hL
  set R : ℕ → ℝ := fun k => if k = n then b else r k with hR
  have hLsign : ∀ k, k ≤ n → 0 < (-1 : ℝ) ^ (n + 1 - k) * q.eval (L k) := by
    intro k hk
    rcases Nat.eq_zero_or_pos k with hk0 | hk0
    · subst hk0; simpa [hL] using ha2
    · have hk1 : k - 1 < n := by omega
      have hs := hsign (k - 1) hk1
      have he : (-1 : ℝ) ^ (n + 1 - k) = -(-1 : ℝ) ^ (n - 1 - (k - 1)) := by
        rw [show n + 1 - k = (n - 1 - (k - 1)) + 1 by omega, pow_succ]
        ring
      have hLk : L k = r (k - 1) := by
        simp only [hL]; rw [if_neg (by omega : ¬(k = 0))]
      rw [hLk, hqev (k - 1) hk1, he]
      nlinarith [hs]
  have hRsign : ∀ k, k ≤ n → 0 < (-1 : ℝ) ^ (n - k) * q.eval (R k) := by
    intro k hk
    rcases eq_or_lt_of_le hk with hkn | hkn
    · subst hkn
      simpa [hR] using hb2
    · have hs := hsign k hkn
      have he : (-1 : ℝ) ^ (n - k) = -(-1 : ℝ) ^ (n - 1 - k) := by
        rw [show n - k = (n - 1 - k) + 1 by omega, pow_succ]
        ring
      have hRk : R k = r k := by
        simp only [hR]; rw [if_neg (by omega : ¬(k = n))]
      rw [hRk, hqev k hkn, he]
      nlinarith [hs]
  have hLR : ∀ k, k ≤ n → L k < R k := by
    intro k hk
    rcases Nat.eq_zero_or_pos k with hk0 | hk0
    · subst hk0
      have hRk : R 0 = r 0 := by
        simp only [hR]; rw [if_neg (by omega : ¬((0 : ℕ) = n))]
      have hL0 : L 0 = a := by simp [hL]
      rw [hL0, hRk]
      exact ha1
    · have hLk : L k = r (k - 1) := by
        simp only [hL]; rw [if_neg (by omega : ¬(k = 0))]
      rcases eq_or_lt_of_le hk with hkn | hkn
      · subst hkn
        have hRk : R k = b := by simp [hR]
        rw [hLk, hRk]
        exact hb1
      · have hRk : R k = r k := by
          simp only [hR]; rw [if_neg (by omega : ¬(k = n))]
        rw [hLk, hRk]
        exact hmono (k - 1) k (by omega) hkn
  have hprod : ∀ k, k ≤ n → q.eval (L k) * q.eval (R k) < 0 := by
    intro k hk
    have h1 := hLsign k hk
    have h2 := hRsign k hk
    have he : (-1 : ℝ) ^ (n + 1 - k) = -(-1 : ℝ) ^ (n - k) := by
      rw [show n + 1 - k = (n - k) + 1 by omega, pow_succ]
      ring
    have hsq : ((-1 : ℝ) ^ (n - k)) * ((-1 : ℝ) ^ (n - k)) = 1 := by
      rw [← pow_add]
      rcases Nat.even_or_odd (n - k) with hev | hod
      · exact Even.neg_one_pow (hev.add hev)
      · exact Even.neg_one_pow (hod.add_odd hod)
    rw [he] at h1
    nlinarith [h1, h2, hsq]
  have hex : ∀ k, ∃ x, k ≤ n → (L k < x ∧ x < R k ∧ q.eval x = 0) := by
    intro k
    by_cases hk : k ≤ n
    · obtain ⟨x, hx1, hx2, hx3⟩ := exists_root_Ioo (hLR k hk) (hprod k hk)
      exact ⟨x, fun _ => ⟨hx1, hx2, hx3⟩⟩
    · exact ⟨0, fun h => absurd h hk⟩
  choose t ht using hex
  have hmono_t : ∀ i j, i < j → j < n + 1 → t i < t j := by
    intro i j hij hj
    have hi : i ≤ n := by omega
    have hj' : j ≤ n := by omega
    have h1 := ht i hi
    have h2 := ht j hj'
    have hRi : R i = r i := by simp only [hR]; rw [if_neg (by omega : ¬(i = n))]
    have hLj : L j = r (j - 1) := by simp only [hL]; rw [if_neg (by omega : ¬(j = 0))]
    have hle : R i ≤ L j := by
      rw [hRi, hLj]
      rcases eq_or_lt_of_le (by omega : i ≤ j - 1) with h | h
      · rw [h]
      · exact le_of_lt (hmono i (j - 1) h (by omega))
    linarith [h1.2.1, h2.1]
  refine ⟨t, hmono_t, ?_⟩
  have hinj : ∀ x ∈ range (n + 1), ∀ y ∈ range (n + 1), t x = t y → x = y := by
    intro x hx y hy hxy
    simp only [Finset.mem_range] at hx hy
    by_contra hne
    rcases Nat.lt_or_ge x y with h | h
    · exact absurd hxy (ne_of_lt (hmono_t x y h hy))
    · have : y < x := by omega
      exact absurd hxy.symm (ne_of_lt (hmono_t y x this hx))
  have hinjOn : Set.InjOn t ↑(range (n + 1)) := by
    intro x hx y hy hxy
    exact hinj x (by simpa using hx) y (by simpa using hy) hxy
  have hcard : ((range (n + 1)).image t).card = n + 1 := by
    rw [Finset.card_image_of_injOn hinjOn, Finset.card_range]
  have heq : q = ∏ x ∈ (range (n + 1)).image t, (X - C x) := by
    refine eq_prod_of_monic_of_roots hqm (by rw [hqdeg, hcard]) ?_
    intro x hx
    obtain ⟨k, hk, rfl⟩ := Finset.mem_image.mp hx
    exact (ht k (by simpa using Nat.lt_succ_iff.mp (Finset.mem_range.mp hk))).2.2
  rw [heq, Finset.prod_image hinjOn]

/-- `hermiteReal n` has `n` distinct real roots, listed in increasing order. -/
theorem hermiteReal_exists_ordered_roots (n : ℕ) :
    ∃ r : ℕ → ℝ, (∀ i j, i < j → j < n → r i < r j) ∧
      hermiteReal n = ∏ i ∈ range n, (X - C (r i)) := by
  induction n with
  | zero =>
    refine ⟨fun _ => 0, ?_, ?_⟩
    · intro i j hij hj; omega
    · simp [hermiteReal_zero]
  | succ n ih =>
    obtain ⟨r, hmono, hr⟩ := ih
    rw [hermiteReal_succ]
    exact exists_ordered_roots_step r hmono hr

/-- `hermiteReal n` splits into `n` distinct linear factors over `ℝ`. -/
theorem hermiteReal_eq_prod_X_sub_C (n : ℕ) :
    ∃ S : Finset ℝ, S.card = n ∧ hermiteReal n = ∏ x ∈ S, (X - C x) := by
  classical
  obtain ⟨r, hmono, hr⟩ := hermiteReal_exists_ordered_roots n
  have hinjOn : Set.InjOn r ↑(range n) := by
    intro x hx y hy hxy
    simp only [Finset.coe_range, Set.mem_Iio] at hx hy
    by_contra hne
    rcases Nat.lt_or_ge x y with h | h
    · exact absurd hxy (ne_of_lt (hmono x y h hy))
    · exact absurd hxy.symm (ne_of_lt (hmono y x (by omega) hx))
  refine ⟨(range n).image r, ?_, ?_⟩
  · rw [Finset.card_image_of_injOn hinjOn, Finset.card_range]
  · rw [Finset.prod_image hinjOn]
    exact hr

end JetLemma
