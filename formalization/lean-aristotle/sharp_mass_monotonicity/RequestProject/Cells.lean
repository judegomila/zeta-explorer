import RequestProject.Monotonicity

/-!
# Lemma L4 (cell factorization) and Theorem 2 (per-cell gate form)

The divisor-pattern cell structure: `B_{N,n} = b_t(n) C₀` and `A_{N,n} = b_t(n) e^{yL} C`, so
both brackets `Φ^±` factor through `b_t(n) > 0` and depend on `n` only through
`L = log n` and the active set `𝒟_{N,n}`.
-/

open Filter Set Topology

namespace SharpMass

variable {t : ℝ} {P : Finset ℕ} {N n : ℕ} {y : ℝ}

/-! ### The cell quantities -/

/-- `r_d(L) = exp{(t/4)(∑_{p ∣ d} log²p + ℓ_d² - 2Lℓ_d)}` with `ℓ_d = log d`. -/
noncomputable def rr (t : ℝ) (d : ℕ) (L : ℝ) : ℝ :=
  Real.exp (t / 4 * ((∑ p ∈ d.primeFactors, Real.log p ^ 2) + Real.log d ^ 2
    - 2 * L * Real.log d))

/-- `C₀ = ∑_{d ∈ S} (-1)^{ω(d)} r_d(L)`. -/
noncomputable def C0 (t : ℝ) (S : Finset ℕ) (L : ℝ) : ℝ :=
  ∑ d ∈ S, (-1 : ℝ) ^ (d.primeFactors.card) * rr t d L

/-- `C = ∑_{d ∈ S} (-1)^{ω(d)} r_d(L) d^{-y}`. -/
noncomputable def Cy (t : ℝ) (S : Finset ℕ) (L y : ℝ) : ℝ :=
  ∑ d ∈ S, (-1 : ℝ) ^ (d.primeFactors.card) * rr t d L * (d : ℝ) ^ (-y)

/-- `C' = -∑_{d ∈ S} (-1)^{ω(d)} r_d(L) d^{-y} ℓ_d`. -/
noncomputable def Cy' (t : ℝ) (S : Finset ℕ) (L y : ℝ) : ℝ :=
  -∑ d ∈ S, (-1 : ℝ) ^ (d.primeFactors.card) * rr t d L * (d : ℝ) ^ (-y) * Real.log d

lemma bt_pos (t m : ℝ) : 0 < bt t m := Real.exp_pos _

/-- `λ_d = (-1)^{ω(d)} exp((t/4) ∑_{p ∣ d} log² p)`. -/
lemma lam_eq (t : ℝ) (d : ℕ) :
    lam t d = (-1 : ℝ) ^ (d.primeFactors.card)
      * Real.exp (t / 4 * ∑ p ∈ d.primeFactors, Real.log p ^ 2) := by
  rw [lam, Finset.prod_neg]
  congr 1
  rw [Finset.mul_sum, Real.exp_sum]
  exact Finset.prod_congr rfl fun p _ => rfl

/-- An algebraic regrouping used to factor the cell sums. -/
private lemma mul_sum_combo (S : Finset ℕ) (a L : ℝ) (f g : ℕ → ℝ) :
    a * (L * (∑ d ∈ S, f d) + -(∑ d ∈ S, g d)) = ∑ d ∈ S, a * (L * f d - g d) := by
  rw [Finset.sum_congr rfl (fun d _ => show a * (L * f d - g d) = (a * L) * f d - a * g d by ring),
    Finset.sum_sub_distrib, ← Finset.mul_sum, ← Finset.mul_sum]
  ring

/-- The per-divisor factorization `λ_d b_t(n/d) = b_t(n) (-1)^{ω(d)} r_d(log n)`. -/
lemma lam_mul_bt_ratio (t : ℝ) {n d : ℕ} (hn : 0 < n) (hd : 0 < d) :
    lam t d * bt t ((n : ℝ) / (d : ℝ))
      = bt t n * ((-1 : ℝ) ^ (d.primeFactors.card) * rr t d (Real.log n)) := by
  have hn' : (0 : ℝ) < n := by exact_mod_cast hn
  have hd' : (0 : ℝ) < d := by exact_mod_cast hd
  have hlog : Real.log ((n : ℝ) / (d : ℝ)) = Real.log n - Real.log d :=
    Real.log_div (ne_of_gt hn') (ne_of_gt hd')
  have key : Real.exp (t / 4 * ∑ p ∈ d.primeFactors, Real.log p ^ 2)
        * Real.exp (t / 4 * (Real.log n - Real.log d) ^ 2)
      = Real.exp (t / 4 * Real.log n ^ 2)
        * Real.exp (t / 4 * ((∑ p ∈ d.primeFactors, Real.log p ^ 2) + Real.log d ^ 2
            - 2 * Real.log n * Real.log d)) := by
    rw [← Real.exp_add, ← Real.exp_add]
    congr 1
    ring
  calc lam t d * bt t ((n : ℝ) / (d : ℝ))
      = (-1 : ℝ) ^ (d.primeFactors.card)
          * (Real.exp (t / 4 * ∑ p ∈ d.primeFactors, Real.log p ^ 2)
            * Real.exp (t / 4 * (Real.log n - Real.log d) ^ 2)) := by
        rw [lam_eq, bt, hlog]; ring
    _ = (-1 : ℝ) ^ (d.primeFactors.card)
          * (Real.exp (t / 4 * Real.log n ^ 2)
            * Real.exp (t / 4 * ((∑ p ∈ d.primeFactors, Real.log p ^ 2) + Real.log d ^ 2
              - 2 * Real.log n * Real.log d))) := by rw [key]
    _ = bt t n * ((-1 : ℝ) ^ (d.primeFactors.card) * rr t d (Real.log n)) := by
        rw [bt, rr]; ring

/-! ### Lemma L4: the factorization of `B`, `A`, `g A + A'` and the brackets -/

/-- **L4**: `B_{N,n} = b_t(n) C₀`. -/
theorem L4_Bcoef (hn : 0 < n) :
    Bcoef t P N n = bt t n * C0 t (cellSet P N n) (Real.log n) := by
  rw [Bcoef, C0, Finset.mul_sum]
  refine Finset.sum_congr rfl fun d hd => ?_
  rw [lam_mul_bt_ratio t hn (pos_of_mem_cellSet hd)]

/-- **L4**: `A_{N,n}(y) = b_t(n) e^{yL} C`. -/
theorem L4_Acoef (hn : 0 < n) (y : ℝ) :
    Acoef t P N n y
      = bt t n * Real.exp (y * Real.log n) * Cy t (cellSet P N n) (Real.log n) y := by
  have hn' : (0 : ℝ) < n := by exact_mod_cast hn
  rw [Cy, Finset.mul_sum, Acoef]
  refine Finset.sum_congr rfl fun d hd => ?_
  have hd0 := pos_of_mem_cellSet hd
  have hd' : (0 : ℝ) < d := by exact_mod_cast hd0
  have hpow : ((n : ℝ) / (d : ℝ)) ^ y = Real.exp (y * Real.log n) * (d : ℝ) ^ (-y) := by
    rw [Real.div_rpow hn'.le hd'.le, Real.rpow_def_of_pos hn', Real.rpow_neg hd'.le,
      div_eq_mul_inv, mul_comm y]
  rw [hpow, lam_mul_bt_ratio t hn hd0]
  ring

/-- **L4**: `g_N A + A' = b_t(n) e^{yL} ((g_N + L) C + C')`. -/
theorem L4_gA_add_Aderiv (hn : 0 < n) (y : ℝ) :
    gN t N * Acoef t P N n y + Aderiv t P N n y
      = bt t n * Real.exp (y * Real.log n)
        * ((gN t N + Real.log n) * Cy t (cellSet P N n) (Real.log n) y
            + Cy' t (cellSet P N n) (Real.log n) y) := by
  have hn' : (0 : ℝ) < n := by exact_mod_cast hn
  have hA' : Aderiv t P N n y
      = bt t n * Real.exp (y * Real.log n)
        * (Real.log n * Cy t (cellSet P N n) (Real.log n) y
            + Cy' t (cellSet P N n) (Real.log n) y) := by
    rw [Cy, Cy', mul_sum_combo, Aderiv]
    refine Finset.sum_congr rfl fun d hd => ?_
    have hd0 := pos_of_mem_cellSet hd
    have hd' : (0 : ℝ) < d := by exact_mod_cast hd0
    have hpow : ((n : ℝ) / (d : ℝ)) ^ y = Real.exp (y * Real.log n) * (d : ℝ) ^ (-y) := by
      rw [Real.div_rpow hn'.le hd'.le, Real.rpow_def_of_pos hn', Real.rpow_neg hd'.le,
        div_eq_mul_inv, mul_comm y]
    have hlog : Real.log ((n : ℝ) / (d : ℝ)) = Real.log n - Real.log d :=
      Real.log_div (ne_of_gt hn') (ne_of_gt hd')
    rw [hpow, hlog, lam_mul_bt_ratio t hn hd0]
    ring
  rw [hA', L4_Acoef hn]
  ring

/-- Factoring `b_t(n) > 0` out of the first bracket. -/
private lemma bracket_factor_minus (b e gam Lc g Z C C' : ℝ) (hb : 0 < b) (he : 0 < e) :
    gam * |b * e * ((g + Lc) * C + C')| - Lc / 2 * |b * Z - gam * (b * e * C)|
      = b * (gam * e * |(g + Lc) * C + C'| - Lc / 2 * |Z - gam * e * C|) := by
  rw [show b * e * ((g + Lc) * C + C') = b * (e * ((g + Lc) * C + C')) by ring,
    show b * Z - gam * (b * e * C) = b * (Z - gam * e * C) by ring]
  simp only [abs_mul, abs_of_pos hb, abs_of_pos he]
  ring

/-- Factoring `b_t(n) > 0` out of the second bracket. -/
private lemma bracket_factor_plus (b e gam Lc g Z C C' cc cd : ℝ) (hb : 0 < b) (he : 0 < e) :
    cd * |b * Z + gam * (b * e * C)| + cc * gam * |b * e * ((g + Lc) * C + C')|
        - Lc / 2 * cc * |b * Z + gam * (b * e * C)|
      = b * (cc * (gam * e) * |(g + Lc) * C + C'|
          + (cd - Lc / 2 * cc) * |Z + gam * e * C|) := by
  rw [show b * e * ((g + Lc) * C + C') = b * (e * ((g + Lc) * C + C')) by ring,
    show b * Z + gam * (b * e * C) = b * (Z + gam * e * C) by ring]
  simp only [abs_mul, abs_of_pos hb, abs_of_pos he]
  ring

/-- **L4**: the first bracket in cell form. -/
theorem L4_PhiMinus (hn : 0 < n) (y : ℝ) :
    PhiMinus t P N n y
      = bt t n * (gammaN t N y * Real.exp (y * Real.log n)
            * |(gN t N + Real.log n) * Cy t (cellSet P N n) (Real.log n) y
                + Cy' t (cellSet P N n) (Real.log n) y|
          - Real.log n / 2 * |C0 t (cellSet P N n) (Real.log n)
              - gammaN t N y * Real.exp (y * Real.log n)
                  * Cy t (cellSet P N n) (Real.log n) y|) := by
  rw [PhiMinus, L4_gA_add_Aderiv hn, L4_Bcoef hn, L4_Acoef hn]
  exact bracket_factor_minus _ _ _ _ _ _ _ _ (bt_pos t n) (Real.exp_pos _)

/-- **L4**: the second bracket in cell form. -/
theorem L4_PhiPlus (hn : 0 < n) (y : ℝ) :
    PhiPlus t P N n y
      = bt t n * (cfun (gammaN t N y) * (gammaN t N y * Real.exp (y * Real.log n))
            * |(gN t N + Real.log n) * Cy t (cellSet P N n) (Real.log n) y
                + Cy' t (cellSet P N n) (Real.log n) y|
          + (cdotN t N y - Real.log n / 2 * cfun (gammaN t N y))
              * |C0 t (cellSet P N n) (Real.log n)
                  + gammaN t N y * Real.exp (y * Real.log n)
                      * Cy t (cellSet P N n) (Real.log n) y|) := by
  rw [PhiPlus, L4_gA_add_Aderiv hn, L4_Bcoef hn, L4_Acoef hn]
  exact bracket_factor_plus _ _ _ _ _ _ _ _ _ _ (bt_pos t n) (Real.exp_pos _)

/-! ### The active sets and the cell decomposition -/

/-- The active set is exactly the set of divisors of the gcd mask `G₀ = gcd(n, D)` lying above
the ratio `n/N`; in particular it is an upper segment of the divisors of `G₀`, which is the
sealed sector decomposition. -/
theorem mem_cellSet_iff (hD : Dnum P ≠ 0) {d : ℕ} :
    d ∈ cellSet P N n ↔ d ∣ Nat.gcd n (Dnum P) ∧ n ≤ d * N := by
  rw [cellSet, Finset.mem_filter, Nat.mem_divisors, Nat.dvd_gcd_iff]
  constructor
  · rintro ⟨⟨h1, -⟩, h2, h3⟩; exact ⟨⟨h2, h1⟩, h3⟩
  · rintro ⟨⟨h1, h2⟩, h3⟩; exact ⟨⟨h2, hD⟩, h1, h3⟩

/-- Ratio-sector form of the previous lemma: for `N ≥ 1` the active set consists of the
divisors `d` of the gcd mask with `n/N ≤ d`. -/
theorem mem_cellSet_iff_ratio (hD : Dnum P ≠ 0) (hN : 0 < N) {d : ℕ} :
    d ∈ cellSet P N n ↔ d ∣ Nat.gcd n (Dnum P) ∧ (n : ℝ) / (N : ℝ) ≤ (d : ℝ) := by
  have hN' : (0 : ℝ) < N := by exact_mod_cast hN
  rw [mem_cellSet_iff hD, div_le_iff₀ hN']
  constructor
  · rintro ⟨h1, h2⟩; exact ⟨h1, by exact_mod_cast h2⟩
  · rintro ⟨h1, h2⟩; exact ⟨h1, by exact_mod_cast h2⟩

/-- The active set is upward closed inside the divisors of the gcd mask. -/
theorem cellSet_upward_closed (hD : Dnum P ≠ 0) {d d' : ℕ} (hd : d ∈ cellSet P N n)
    (hdvd : d' ∣ Nat.gcd n (Dnum P)) (hle : d ≤ d') : d' ∈ cellSet P N n := by
  rw [mem_cellSet_iff hD] at hd ⊢
  exact ⟨hdvd, hd.2.trans (Nat.mul_le_mul_right N hle)⟩

/-- An empty active set makes the summand identically `0`: no gate is needed there. -/
theorem summand_eq_zero_of_cellSet_empty (h : cellSet P N n = ∅) (y : ℝ) :
    max (u1 t P N n y) (u2 t P N n y) * wgt t N n y = 0 := by
  have hB : Bcoef t P N n = 0 := by rw [Bcoef, h, Finset.sum_empty]
  have hA : Acoef t P N n y = 0 := by rw [Acoef, h, Finset.sum_empty]
  simp [u1, u2, hB, hA]

/-- The number of divisor-pattern cells (gcd mask together with ratio sector) is
`∑_{G₀ ∣ D} τ(G₀) = 3^{|P|}`. -/
theorem cell_count (hP : ∀ p ∈ P, p.Prime) :
    ∑ G ∈ (Dnum P).divisors, G.divisors.card = 3 ^ P.card := by
  classical
  have hmul : (ArithmeticFunction.zeta * ArithmeticFunction.sigma 0 :
      ArithmeticFunction ℕ).IsMultiplicative :=
    ArithmeticFunction.isMultiplicative_zeta.mul ArithmeticFunction.isMultiplicative_sigma
  have hpw : ((P : Set ℕ)).Pairwise (Function.onFun Nat.Coprime (fun p => p)) := by
    intro p hp q hq hne
    exact (Nat.coprime_primes (hP p hp) (hP q hq)).2 hne
  have h := hmul.map_prod (fun p => p) P hpw
  rw [ArithmeticFunction.zeta_mul_apply] at h
  simp only [ArithmeticFunction.sigma_zero_apply] at h
  rw [Dnum, h]
  rw [Finset.prod_congr rfl (fun p hp => ?_), Finset.prod_const]
  rw [ArithmeticFunction.zeta_mul_apply]
  simp only [ArithmeticFunction.sigma_zero_apply]
  have h1p : (1 : ℕ) ≠ p := ne_of_lt (hP p hp).one_lt
  rw [(hP p hp).divisors, Finset.sum_pair h1p, Nat.divisors_one, (hP p hp).divisors,
    Finset.card_insert_of_notMem (by simp [h1p]), Finset.card_singleton, Finset.card_singleton]

/-! ### Theorem 2: per-cell gate form -/

/-- The first bracket as a function of the cell data `(L, y, γ, g)` and the active set `S`. -/
noncomputable def cellBracketMinus (t : ℝ) (S : Finset ℕ) (L y gam g : ℝ) : ℝ :=
  gam * Real.exp (y * L) * |(g + L) * Cy t S L y + Cy' t S L y|
    - L / 2 * |C0 t S L - gam * Real.exp (y * L) * Cy t S L y|

/-- The second bracket as a function of the cell data `(L, y, γ, g)` and the active set `S`,
with `c = c(γ)` and `ċ = -2gγ/(1+γ)²`. -/
noncomputable def cellBracketPlus (t : ℝ) (S : Finset ℕ) (L y gam g : ℝ) : ℝ :=
  cfun gam * (gam * Real.exp (y * L)) * |(g + L) * Cy t S L y + Cy' t S L y|
    + (-2 * g * gam / (1 + gam) ^ 2 - L / 2 * cfun gam)
      * |C0 t S L + gam * Real.exp (y * L) * Cy t S L y|

lemma PhiMinus_eq_cellBracket (hn : 0 < n) (y : ℝ) :
    PhiMinus t P N n y
      = bt t n * cellBracketMinus t (cellSet P N n) (Real.log n) y (gammaN t N y) (gN t N) := by
  rw [L4_PhiMinus hn, cellBracketMinus]

lemma PhiPlus_eq_cellBracket (hn : 0 < n) (y : ℝ) :
    PhiPlus t P N n y
      = bt t n * cellBracketPlus t (cellSet P N n) (Real.log n) y (gammaN t N y) (gN t N) := by
  rw [L4_PhiPlus hn, cellBracketPlus, cdotN]

/-- **Theorem 2 (per-cell gate form).** If for every cell (identified by its active set `S`)
there is a region `R S` of parameter points `(L, y, γ, g)` which (i) contains all points
`(log n, y, γ_N(y), g_N)` arising from cutoffs `N ∈ 𝒩` and `2 ≤ n ≤ DN`, `y ∈ I`, and (ii) on
which both cell brackets are `≤ 0`, then gate (G4) holds for every `N ∈ 𝒩`. -/
theorem theorem2_G4 {ylo yhi : ℝ} (Nset : Finset ℕ) (R : Finset ℕ → Set (ℝ × ℝ × ℝ × ℝ))
    (hi : ∀ N ∈ Nset, ∀ n, 2 ≤ n → n ≤ Dnum P * N → ∀ y ∈ Icc ylo yhi,
      (Real.log n, y, gammaN t N y, gN t N) ∈ R (cellSet P N n))
    (hii : ∀ S : Finset ℕ, ∀ p ∈ R S,
      cellBracketMinus t S p.1 p.2.1 p.2.2.1 p.2.2.2 ≤ 0 ∧
        cellBracketPlus t S p.1 p.2.1 p.2.2.1 p.2.2.2 ≤ 0) :
    ∀ N ∈ Nset, G4 t P N ylo yhi := by
  intro N hN n hn hnDN y hy
  have hn0 : 0 < n := lt_of_lt_of_le (by norm_num) hn
  have hmem := hi N hN n hn hnDN y hy
  have hbr := hii (cellSet P N n) _ hmem
  refine ⟨?_, ?_⟩
  · rw [PhiMinus_eq_cellBracket hn0]
    exact mul_nonpos_of_nonneg_of_nonpos (bt_pos t n).le hbr.1
  · rw [PhiPlus_eq_cellBracket hn0]
    exact mul_nonpos_of_nonneg_of_nonpos (bt_pos t n).le hbr.2

/-- **Theorem 2.** With the per-cell hull conditions of `theorem2_G4` and gates (G1)–(G3) for
each cutoff in `𝒩`, the conclusion of the Main Theorem holds for every `N ∈ 𝒩`. -/
theorem theorem2_conclusion {ylo yhi : ℝ} (Nset : Finset ℕ) (R : Finset ℕ → Set (ℝ × ℝ × ℝ × ℝ))
    (hq : ∀ N ∈ Nset, 0 < qN t N)
    (hG1 : ∀ N ∈ Nset, G1 t N ylo yhi) (hG2 : ∀ N ∈ Nset, G2 t N)
    (hG3 : ∀ N ∈ Nset, G3 t N ylo yhi)
    (hi : ∀ N ∈ Nset, ∀ n, 2 ≤ n → n ≤ Dnum P * N → ∀ y ∈ Icc ylo yhi,
      (Real.log n, y, gammaN t N y, gN t N) ∈ R (cellSet P N n))
    (hii : ∀ S : Finset ℕ, ∀ p ∈ R S,
      cellBracketMinus t S p.1 p.2.1 p.2.2.1 p.2.2.2 ≤ 0 ∧
        cellBracketPlus t S p.1 p.2.1 p.2.2.1 p.2.2.2 ≤ 0) :
    ∀ N ∈ Nset, AntitoneOn (fun y => Fsharp t P N y - gammaN t N y) (Icc ylo yhi) ∧
      AntitoneOn (Fsharp t P N) (Icc ylo yhi) ∧
      MonotoneOn (NumSharp t P N) (Icc ylo yhi) := by
  intro N hN
  have hG4 : G4 t P N ylo yhi := theorem2_G4 (P := P) Nset R hi hii N hN
  exact ⟨Fsharp_sub_gammaN_antitoneOn (hq N hN) (hG1 N hN) (hG3 N hN) hG4,
    Fsharp_antitoneOn (hq N hN) (hG1 N hN) (hG2 N hN) (hG3 N hN) hG4,
    NumSharp_monotoneOn (hq N hN) (hG1 N hN) (hG2 N hN) (hG3 N hN) hG4⟩

end SharpMass
