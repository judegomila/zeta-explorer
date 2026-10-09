# Strategy 1 for the sixth-power exceptional term of Prop 15.2: subtract the periodic-mean component before Cauchy–Schwarz

Internal analysis, 2026-10-08. Branch `editorial-redesign`, nothing committed.
Source: openai/math family 003, the 7/8 manuscript `/tmp/qrh-verify/paper.txt` ("A Zero-Free Half-Plane Re s > 7/8").
Equation, lemma and line numbers refer to that text. The manuscript is Lean-formalised by its authors and unrefereed.
Earlier notes: `beat78-synthesis.md`, `beat78-meansquare.md`, `beat78-amplifier.md` (read first).
Scripts: `tmp/beat78-prop152-subtract-*` and the shared library `tmp/beat78_prop152_subtract_lib.py`.

Status labels:

* **[P]** proved here: a complete argument, or an exact (rational / finite-field / exact-symbol) computation.
* **[P-rel]** proved relative to lemmas of the 7/8 paper taken as stated.
* **[S]** proof sketch at the level of detail of the paper's own proof of Prop 15.2. The steps are standard (Poisson, Möbius, lattice-point counting), but the error terms are not written out to the last ε.
* **[H]** heuristic.
* **[N]** numerical illustration in floating point. These are not proofs.

---

## 0. Outcome

**Strategy 1 does not beat 7/8.** No rigorous gain: θ′ = 7/8, unchanged. Λ status is unchanged as well: PT Λ ≤ 0.2 stands, and the
conditional values from the 7/8 start are those recorded in `beat78-synthesis.md`.

The reasons are listed below. Each is proved in the section cited unless it is labelled otherwise.

1. **The periodic-mean component is the entire column coefficient.** [P-rel, exact check]
   * On each ray class σ ∈ T the additive coefficient of Prop 15.2 has the form

     c_σ(s) = κ_σ · 1_σ(s) · \overline{χ_s(e₀)} / τ,  |κ_σ| = 1,

     where e₀ is an explicit S-unit (Lemma 2.2).
   * Hence A_{m,σ,ν}(Y′) = (κ_σ/τ)·Ã_{σ,ν}(e₀m), where Ã is the *untwisted* Gauss-sum polynomial.
   * The mean-zero remainder of c_σ with respect to the exceptional frequencies is therefore **identically zero**.
     "Run Cauchy–Schwarz on the mean-zero remainder" has nothing to act on. The subtracted "main term" is the whole probe.
2. **The exceptional term is a genuine main term, so Prop 15.2 is sharp.** [S]
   * Σ_m |A_m|² = (Q/Y′)[𝔈_σ(ν)·P_a^{1/6} + O((P_a^{1/12} + 1 + P_a²/Y′)Z^ε)], with an explicit constant 𝔈_σ(ν) > 0 (Prop 2.3).
   * On σ × σ the C = 1 Gram coefficient at every exceptional frequency is **identically 1** (Lemma 2.2(ii)). It is a smooth count of
     coprime column pairs, with no oscillation at all.
3. **Subtraction is circular.** [P-rel] Decompose A = A^E + A^R in any way such that the remainder obeys the non-exceptional
   mean-square bound. Then:
   * Q^{−1/2}⟨A^E, B⟩ equals the probe up to O(Z^{lx/2+ε}) (Lemma 3.2);
   * ‖A^E‖² ≥ (1 − o(1))‖A‖² (Lemma 3.3);
   * Cauchy–Schwarz on A^E returns lx/2 + b/12, that is σ₀ = 7/8 exactly;
   * for any hypothetical family zero with C(β) > lx/2 (β > 83/96 at the paper geometry), the whole signal lies in the
     exceptional piece (Cor 3.4).
4. **The exceptional component cannot be designed away without deleting the signal.** [P]
   * At every prime p ∤ 6 of S:
     * the high-side principal double residue needs ξ_p⁶ = 1 (paper l. 3182: "ξ(H/s) = ξ(u)ξ(s) because ξ(a)⁶ = 1");
     * ξ_p⁶ = 1 ⟺ ξ_p ∈ ⟨χ_p⟩ ⟺ the low-side exceptional coset is nonempty at p (Thm 4.1);
     * this was checked exactly over all 1,763,844 characters of 76 residue fields.
   * Letting the auxiliary modulus b\* grow never helps. The extra low exponent is β/2 + max(0, (b − (1+f)β)/12) ≥ b/12, with
     equality only at β = 0 (Prop 4.2, exact).
   * Changing the s-weight, restricting the columns, changing the row majorant, or moving the exceptional moment to a shorter
     s-range all leave the exceptional mass (Q/Y′)P_a^{1/6} in place (Prop 4.3).
5. **No explicit structure is available to estimate the exceptional component directly.** [H, with N support]
   * In the row variable the exceptional component is the residual-spectrum ("theta") part of the sextic Kubota–Eisenstein
     series, evaluated at e₀m (§5.1).
   * For the 6-fold cover of GL(2) its Fourier coefficients are not determined: Kazhdan–Patterson uniqueness holds only for
     n ∈ {2, 3}. This is a recalled literature fact, not re-derived here.
   * The Gauss-sum identity (4.7), γ₁ = μ·α·G·γ̄₂, converts sextic Gauss sums into Möbius- and Hecke-twisted cubic Gauss sums.
     Their main term has exponent 2/3, not the cubic exponent 5/6, so Patterson's explicit cubic theta coefficients do not
     determine it (§5.4).
   * Numerics (§5.3), at X = 3·10⁵ with 84,677 columns:
     * Σ_{q_s≤X} γ₂(s) reproduces Patterson's X^{5/6}: a 24.6σ total excess, and a class-energy slope of 1.667 against 1.654
       predicted for 5/6;
     * Σ_{q_s≤X} γ₁(s) has no coherent total, but per-class main terms with exponent 2/3: x^{2/3} is the best model in all five
       leading classes, and the energy slope is 1.259 against 1.264 predicted for 2/3 and 1.499 for 5/6.
     * So the μα-twisted cubic Gauss sums are not small. They carry the sextic main term.
6. **Toy Gram over Z[ω]** [N] (§5.2). The brute-force row sum equals the exact Poisson expansion to 5·10⁻¹³.
   * With a sextic-type column coefficient, the exceptional frequencies carry +3.4% … +5.4% of the diagonal.
   * With an order-5 auxiliary character they carry 0 (noise ≤ 0.1%).
   * With the paper's quadratic ξ the exceptional coset is shifted to e₀ = Λ² (norm 49). It switches on exactly when P_a passes
     ≈ 49: 0 → 0.03% → 1.5% → 4.4% at P_a = 16, 64, 256, 1024.

**What would be needed** (§6) is a bound for the correlation of the completed rows B^J with the exceptional (theta) direction
of A, called Hypothesis TRO below. By Lemma 3.2, TRO *is* the improved low bound; it is not a separate, easier estimate.
Mean-square information about A and B cannot supply it.

---

## 1. Setting

For a fixed rescaled subset J (slot length d), tuple p_J and ray class σ ∈ T, the separated low sum is (6.2) with rescaled scales:

  I_J = Q^{−1/2}/(2π) ∫ Ŵ₀(iv) Σ_{m≠0} Ω(q_m/Q) ξ(m) (q_m/Q)^{−iv} A_{m,σ,v}(Y′) B^J_{m,σ}(Z) dv,

where:
* Q = q_{b\*}X′Y′ ≍ Z^{M′} and P_a = Y′²/Q = q_{b\*}^{−1}Z^{b};
* A_{m,σ,v}(Y′) = Y′^{−3/2} Σ_s c_σ(s) W₁(r_s) r_s^{−1+iv} g_{χ_s}(s, −m), with r_s = q_s/Y′;
* c_σ(s) = 1_{s∈σ} χ_s(b\*)/(τξ(s)) (proof of Prop 15.2, l. 6318);
* B^J is the marked completed row (§15.1).

The inputs are:

* **Prop 15.2.** Σ_{q_m≪Q} |A_m|² ≪ (1+|v|)^{J}(Q/Y′)(1 + P_a^{1/6} + P_a²/Y′)Z^ε.
* **Lemma 15.1.** Σ_{q_m≪Q} |B^J_m|² ≪ Z^{M′+ε}.
* **Prop 15.3.** Cauchy–Schwarz gives Q^{−1/2}((Q/Y′)P_a^{1/6})^{1/2}Z^{M′/2} = (X′)^{1/2}P_a^{1/12}, and after the tuple sum
  (15.8) the low exponent is lx/2 + b/12.
* **(15.9).** C(s) = lx/2 + s − 1 + h/6. Hence σ_low = 1 − h/6 + b/12 = 5/6 + M/12 − ℓ/6. The exceptional loss b/12 cancels
  the b-dependence of lx, and Lemma 15.1's range 2M ≥ 1 + 4ℓ then forces σ_low ≥ 7/8.

**Strategy 1** (task statement): subtract the exceptional (sixth-power-frequency) component of the row coefficients A_m before
the Cauchy–Schwarz step. Bound that component separately, using its explicit structure. Run Cauchy–Schwarz on the mean-zero
remainder. If the remainder has no P_a^{1/6} term and the separate bound beats it, the low exponent drops toward lx/2.

---

## 2. The exceptional term, exactly

### 2.1 Dual expansion (paper's proof, normalisations checked)

Majorise the row ball by a nonnegative radial Schwartz Φ and put 𝒢 := Σ_{m∈O} Φ(m/√Q)|A_m|². Use the self-dual measure of §4.1,
under which O has covolume one and e(z) = exp(2πi Tr(z/λ)). Poisson summation in m gives

  𝒢 = (Q/Y′³) Σ_{s₁,s₂} c(s₁)\bar c(s₂) ω(s₁)\bar ω(s₂) Σ_{j∈O} Φ̂(√Q j/(s₁s₂)) F(s₁, s₂; j),  ω(s) = W₁(r_s)r_s^{−1+iν}.

Here F is the full correlation (13.6):

  F(s₁, s₂; j) = Σ_{x mod s₁, y mod s₂, x s₂ − y s₁ ≡ j} χ_{s₁}(x) \overline{χ_{s₂}(y)}.

The conjugation on the second symbol was lost in the PDF extraction. For coprime s₁, s₂ (C = 1), solving the congruence gives

  F(s₁, s₂; j) = χ_{s₁}(j) \overline{χ_{s₂}(−j)} R(s₁, s₂),   (2.1)

using Lemma 4.4 in the form χ_b(a) = R(a, b)χ_a(b).

[N] `beat78-prop152-subtract-gram.py --validate`, on a toy column set over Z[ω]:
* the brute-force row sum and the full dual expansion (all j, all pairs, F by enumeration) agree to a relative error of
  4.9·10⁻¹³;
* (2.1) holds in 224/224 tests.

The library self-test confirms the following against the paper:
* Lemma 4.2: γ₂³ = −α to 4·10⁻¹⁵;
* Lemma 4.4: reciprocity holds on 1742 prime pairs, and χ_p(−1) = R(p, p);
* Γ(p) = γ₃(p);
* (4.7) holds once the conjugation lost in extraction is restored: G(c) = \overline{χ_c(4)}Γ(c) and γ₁γ₂ = μαG, to 4·10⁻¹⁵.

### 2.2 Which frequencies have nonzero mean

**Lemma 2.1** [P-rel]. The cases below decide when a frequency j = Ck can carry a nonzero mean of the joint coefficient. Here C is
the gcd of the columns and (m₁, m₂) are the residual columns.

* (i) **C = 1.** Write j = ε·j_S·j_good: a unit, an S-part, and a good part. By (4.8),
  χ_{m}(j) = χ_m(εj_S) R(m, j_good) Π_{p|j_good} χ_p(m)^{v_p(j)}.
  * If some v_p(j) ≢ 0 (mod 6), the coefficient carries the nonprincipal character χ_p^{v_p(j)} of m₁ mod p, so its complete
    mean vanishes. This is exactly the paper's "nonexceptional" case.
  * If j_good = a⁶, then χ_m(j) = χ_m(εj_S)·1_{(m,a)=1}.
* (ii) **C > 1.** Suppose p | C with c = v_p(C).
  * If p | k, the local factor (13.8) is the constant P^{c−1}(P − 1), and the p-part of χ_{n₁}(k)\overline{χ_{n₂}(−k)} is
    χ_p(n₁)^{v_p(k)}\overline{χ_p(n₂)}^{v_p(k)}.
  * If p ∤ k, the local factor is P^{c−1}χ_p(n₁/n₂)^c times −1 or P − 2.

  So the local mean at p is nonzero iff either p | k and 6 | v_p(k), or p ∤ k and 6 | c. In every nonzero case the local
  factor is ≥ 0. For squarefree columns (c = 1), the nonzero-mean frequencies with gcd C are j = C·εe′a⁶ with rad(C) | a. Their
  count is about (P_a/(q_{e′}q_C⁷))^{1/6}.

The paper's count (6^{ω(C)} values of e, l. 6344) over-counts the classes with nonzero mean: it allows any C-part of e, and only
e_C = 1 with rad(C) | a contributes. This does not change the exponent, because the C = 1 term dominates.

### 2.3 The S-unit e₀ and the structure of c_σ

Write the paper's auxiliary character as ξ = Π_{p∈S} ξ_p. For p ∤ 6 the order of ξ_p divides 6, so ξ_p = χ_p^{g_p} with
g_p ∈ {1,…,5}; the paper's example takes ξ_p quadratic, g_p = 3. At the prime over 2, ξ₂ is a character of order 3 of F₄^×.
At λ = √−3, ξ_λ is quadratic on F₃^×, which is trivial on primary s.

**Lemma 2.2** [P-rel; exact check, Part C of `-algebra.py`]. Define the S-unit

  e₀ := u₀ · (−2)^{2t−1} · λ⁵ · Π_{p∈S, p∤6} π_p^{g_p − 1},

where:
* t ∈ {1, 2} is fixed by ϰ₂^t = ξ₂, with ϰ₂(s) := χ_s(−2)² = (s/(−2))₃ the cubic character of s mod 2;
* u₀ cancels the unit in the chosen generator of b\*.

Then, for primary s outside S,

  ψ₀(s)χ_s(e₀) = Π_{p∈S, p∤6} R(π_p, s)^{g_p},  ψ₀ := χ_•(b\*)\bar ξ.

The right side depends only on the square class of s mod 4. Since T factors R, it is constant on every ray class σ ∈ T.
Consequently:

* (i) c_σ = κ_σ 1_σ \overline{χ_•(e₀)}/τ with κ_σ = Π_p R(π_p, σ)^{g_p} ∈ {±1}. Since \overline{χ_s(e₀)} g(s, −m) = g(s, −e₀m) for
  (s, e₀) = 1, this gives

  A_{m,σ,ν}(Y′) = (κ_σ/τ) Ã_{σ,ν}(e₀m),  Ã_{σ,ν}(y) := Y′^{−3/2} Σ_{s∈σ} W₁(r_s)r_s^{−1+iν} g(s, −y).

* (ii) For coprime s₁, s₂ ∈ σ, (s₁s₂, a) = 1 and k = ±e₀a⁶,

  c(s₁)\bar c(s₂) F(s₁, s₂; k) = 1  identically.

  Proof: by (2.1) the left side is f(s₁)\overline{f(s₂)}·\overline{χ_{s₂}(−1)}R(s₁, s₂), with f = c·χ_•(±e₀) = κ_σ/τ on σ. Also
  \overline{χ_{s₂}(−1)} = R(s₂, s₂) (Lemma 4.4), and R(s₁, s₂)R(s₂, s₂) = 1 for s₁, s₂ in one square class. ∎

  The same holds for k = εe′a⁶ whenever (ε, e′) lies in E_σ, the set of pairs with c·χ_•(εe′) factoring through T. E_σ ⊇
  {(±1, e₀)}.

*Proof of the main identity.* Use reciprocity χ_s(π_p) = R(π_p, s)χ_p(s). At p ∤ 6 the p-component of ψ₀χ_•(e₀) is
R(π_p, s)^{g_p}·χ_p(s)^{1−g_p+(g_p−1)} = R(π_p, s)^{g_p}. At 2, (1 + i) = 2t is even, so χ_s(−2)^{2t} = ϰ₂(s)^t = ξ₂(s) cancels
\bar ξ₂. At λ, χ_s(λ)⁶ = 1 and ξ_λ(s) = 1. ∎

[P] Exact verification (Part C):
* 429 squarefree primary columns with q_s ≤ 3000, toy S = {2, λ, π₇, π₁₃};
* all 50 choices (g₇, g₁₃, t₀);
* ψ₀χ_•(e₀) = R(π₇, s)^{g₇}R(π₁₃, s)^{g₁₃} in every case.

Part D verifies (ii) on 2894 coprime same-class pairs with exact symbols: the value is exactly 1. The same coefficient at a
non-exceptional frequency (e₀ times a good prime of norm 7) has |mean| = 0.045.

**Remark (the paper's ξ shifts the coset).** With g_p = 3 (quadratic ξ_p), e₀ contains π_p² for every p ∈ S, p ∤ 6. The
exceptional frequencies start at q_k = q_{e₀} = 4^{2t−1}·3⁵·Π_p q_p², which is enormous because S contains every prime of norm
≤ P₀. The term is present only once P_a > q_{e₀}, and it then carries the constant factor q_{e₀}^{−1/6}. Since S is fixed before
Z → ∞, this changes no exponent (see Prop 4.2 for letting S grow).

### 2.4 The exceptional main term

**Proposition 2.3** [S]. Fix σ and ν, and let P_a → ∞ with P_a²/Y′ ≤ P_a^{1/6−δ}. Then

  𝒢 = (Q/Y′)·[𝔈_σ(ν)·P_a^{1/6} + O_ε((P_a^{1/12} + 1 + P_a²/Y′)Z^ε)],

  𝔈_σ(ν) = (1/6)·ρ_S³·δ_σ²·𝔖_σ·M_Φ(1/6)·|Ŵ₁(1/6 + iν)|²·Σ_{(ε,e′)∈E_σ} q_{e′}^{−1/6}·(1 + 𝔠_σ),

where 0 ≤ 𝔠_σ ≪ Σ_{C>1 squarefree good} q_C^{−13/6} ≤ Π_{p≥5}(1 + q_p^{−13/6}) − 1 = 0.0466. 𝔠_σ is the contribution of
C > 1.

The ingredients are:

* ρ_S = (π/(3√3))Π_{p∈S}(1 − q_p^{−1}), the density of good primary ideals;
* δ_σ, the relative density of the class σ;
* 𝔖_σ > 0, the absolutely convergent Euler product from the coprimality conditions;
* M_Φ(1/6) = ∫₀^∞ φ(u)u^{−5/6} du with Φ̂(y) = φ(|y|²). M_Φ(1/6) > 0 for every nonnegative nonzero Φ, by the argument of (7.2);
* Ŵ₁(w) = ∫W₁(r)r^{w−1} dr.

So 𝔈_σ(ν) > 0 for every ν outside the discrete zero set of Ŵ₁(1/6 + i·).

*Sketch.*

1. By Lemma 2.1 the nonzero-mean exceptional frequencies with C = 1 are k = εe′a⁶ with (ε, e′) ∈ E_σ and a good. By Lemma 2.2(ii)
   their coefficient is 1 on coprime pairs of σ coprime to a.
2. The a-sum is Σ_{a good, (a, s₁s₂)=1} φ(q_a⁶X) with X = Qq_{e′}/(q_{s₁}q_{s₂}). By lattice-point counting it equals
   (1/6)ρ_S h(s₁s₂) M_Φ(1/6) X^{−1/6}(1 + O(X^{1/12+ε})), where h(n) = Π_{p|n}(1 − q_p^{−1}). [P, numerically: ratio 1.0000 at
   X = 10⁻²¹ with Φ̂ Gaussian, Part H.]
3. X^{−1/6} = P_a^{1/6}(r₁r₂/q_{e′})^{1/6}. The remaining coprime double sum Σ_{(s₁,s₂)=1} u(s₁)\bar u(s₂)h(s₁)h(s₂), with
   u = ω r^{1/6} 1_σ, equals Σ_d μ(d)|Σ_{d|s∈σ} u h|². This is δ_σ²ρ_S²Y′²|Ŵ₁(1/6+iν)|²𝔖_σ + O(Y′^{2−θ}).
4. The C > 1 classes with nonzero mean (Lemma 2.1(ii)) contribute per C about
   (Q/Y′³)·(Y′/q_C)²·q_C·(P_a/(q_{e′}q_C⁷))^{1/6} = (Q/Y′)P_a^{1/6}q_{e′}^{−1/6}q_C^{−13/6}.
   * Their coefficient is the local factor L_C ≥ 0: on the class σ/C the phases χ_{n₁}(±1)\overline{χ_{n₂}(∓1)}R(n₁, n₂) equal 1,
     as in Lemma 2.2(ii).
   * So they add a nonnegative factor 1 + 𝔠_σ with 𝔠_σ ≪ 0.047, computed with rational primes up to 2·10⁶.
   * Columns with higher prime powers add further nonnegative terms of smaller order.
5. Diagonal and non-exceptional frequencies contribute O((Q/Y′)(1 + P_a²/Y′)Z^ε) by the paper's own argument. ∎

Consequences:

* The P_a^{1/6} term of (15.4) is attained up to a constant factor. No sharper proof of Prop 15.2 can remove it.
* The previous synthesis described this term as "a dual main term with periodic coefficients of generically nonzero mean".
  Lemma 2.2(ii) sharpens that: for the paper's coefficient the periodic coefficient is not merely of nonzero mean, it is
  identically 1 on σ × σ.

---

## 3. Strategy 1 proper

### 3.1 Column form: the remainder is zero

The periodic coefficient of the exceptional frequencies is a function of the column s. The exceptional ("periodic-mean")
component of c_σ is its projection onto the span of 1_σ\overline{χ_•(εe′)}, (ε, e′) ∈ E_σ. By Lemma 2.2(i), c_σ lies in that
span. Hence

  c_σ^{E} = c_σ,  c_σ^{R} = 0.

The literal Strategy 1 therefore subtracts the whole additive polynomial and leaves Cauchy–Schwarz nothing to act on. [P-rel]

**Remark (frequency picture).** [P-rel]
* Write A_m = Σ_{(s,x)} a_{s,x}e(−mx/s), with a_{s,x} = Y′^{−3/2}c(s)ω(s)χ_s(x).
* Take coprime columns s₁, s₂ ∈ σ and an exceptional k = ±e₀a⁶ with (a, s₁s₂) = 1. The congruence x s₂ − y s₁ ≡ k pairs each
  fraction x/s₁ with exactly one fraction y/s₂.
* By Lemma 2.2(ii), along every such pair a_{s₁,x}\overline{a_{s₂,y}} = Y′^{−3}ω(s₁)\overline{ω(s₂)}. The coefficients are
  phase-coherent along these pairs.
* Every fraction has such a partner in every coprime column.

So the exceptional mass is not carried by any sub-collection of fractions or columns. It is a coherence of all coefficients, and
no splitting of the column or fraction set can isolate it.

### 3.2 General form: any decomposition of the row vector

One may still split the row vector (A_m)_m in some other way, for instance spectrally (§5.1). The following two lemmas apply to
every such split.

**Lemma 3.2 (circularity)** [P-rel]. Let A_m = A^E_m + A^R_m on the row ball, with

  Σ_{q_m≪Q} |A^R_m|² ≪ (1+|v|)^{J}(Q/Y′)(1 + P_a²/Y′)Z^ε  (no exceptional term).

Let I^E_J denote (6.2) with A replaced by A^E. Then |I_J − I^E_J| ≪ (X′)^{1/2}(1 + P_a²/Y′)^{1/2}Z^ε.

Now sum over tuples with (15.8) at the paper geometry. There ly − ℓ − 2b = 1/16 > 0, so P_a²/Y′ ≤ 1 for every d ≤ ℓ. This gives

  I^E = I_{η,modified} + O(Z^{lx/2+ε}).

*Proof.* Cauchy–Schwarz and Lemma 15.1 applied to I_J − I^E_J, exactly as in Prop 15.3. ∎

**Lemma 3.3** [S]. Under the hypothesis of Lemma 3.2, ‖A^E‖ ≥ ‖A‖ − ‖A^R‖ = ‖A‖(1 − O(P_a^{−1/12}Z^ε)), by Prop 2.3. Cauchy–Schwarz
on I^E therefore returns exactly (X′)^{1/2}P_a^{1/12}, and σ_low = 7/8. ∎

**Corollary 3.4 (where the signal lives)** [P-rel]. Take an improved target σ₀ ∈ (1 − h/6, 7/8), so that C(σ₀) > lx/2, and the
contradiction hypothesis β\* > σ₀. Then |I^R| ≪ Z^{lx/2+ε} = o(Z^{C(σ₀)}). Any bound |I^E| ≪ Z^{C(σ₀)−ω} proves the improved
region through Prop 2.1, and conversely I^E = I + O(Z^{lx/2+ε}).

At the paper geometry 1 − h/6 = 83/96. A zero with β > 83/96 cannot be seen by the remainder at all; its signal lies entirely in
the subtracted piece.

So the "separate estimate of the exceptional component" asked for by Strategy 1 is the improved low bound for the probe itself,
up to O(Z^{lx/2}). Subtraction is a relabelling, not a restructuring. It could only help if A^E had an explicit structure that made
⟨A^E, B⟩ evaluable by some means other than Cauchy–Schwarz. Section 5 shows no such structure is available.

Exact bookkeeping (Part A of `-algebra.py`):
* C-S on the remainder gives x′/2;
* C-S on the exceptional piece gives x′/2 + b/12;
* the maximum gives σ_low = 7/8;
* the threshold β = 83/96.

---

## 4. Removing the exceptional component by redesigning the probe

### 4.1 Duality: the signal and the exceptional coset have one source

**Theorem 4.1** [P]. Consider the probe (6.1) with an arbitrary auxiliary character ξ mod b\* whose restriction to each prime of
S is nonprincipal; the order of ξ is not restricted. Fix p ∈ S, p ∤ 6.

* (a) **High side.** The local factor at b\* of the Poisson coefficient is √q_{b\*}τ ξ(A)ξ(H/s) (l. 3180), and
  ξ(H/s) = ξ(u)ξ(a)⁶\bar ξ(s) for H = ua⁶. If ξ_p⁶ ≠ 1, the a-sum of every row is L^S(6z, ξ⁶). This function is regular at
  z = 1/6 because ξ⁶ is nonprincipal. The double residue of Lemma 10.5, which is the signal, is then absent.
* (b) **Low side.** The exceptional coset is nonempty at p, i.e. some f has (ψ₀χ_•(π_p^f))_p = 1, iff ξ_p ∈ ⟨χ_p⟩.
* (c) In the cyclic character group of (O/p)^×, the subgroup ⟨χ_p⟩ is the unique subgroup of order 6. Hence
  ξ_p⁶ = 1 ⟺ ξ_p ∈ ⟨χ_p⟩.

Hence every probe in this family that has the principal signal also has a nonempty exceptional coset at every p ∈ S, p ∤ 6. At
p | 6 the coset condition is met by the 2- and λ-parts of e₀ (Lemma 2.2). So the probe has the main term of Prop 2.3.

Exact check (Part B): (a) ⟺ (b) ⟺ (c) holds for all 1,763,844 characters of the 76 residue fields with 5 ≤ p < 400. ∎

The same statement holds for any periodic column coefficient c = Σ ĉ(ψ)ψ.
* After the b\*-cancellation, the high side's principal-row s-sum carries the twist ψξχ_•(b\*)^{−1}, and it has the w = 1 pole only
  for the ψ₀-component (times T-characters). That component lies in the exceptional group H.
* Components outside H have no exceptional term, but they also carry no signal.

**The constants match as well** (Part H).
* The low-side exceptional constant contains (1/6)ρ_S·M_Φ(1/6). That is the residue of ζ_F^S(6z) at z = 1/6, weighted by the
  1/6-Mellin moment of the row weight's Fourier transform.
* The high-side signal contains c_S·M(1/6) (Lemma 10.5, (7.2)). That is the same residue, weighted by the same moment of the
  probe's row weight W₀.

Both are the sixth-power part of the m-Poisson dual. On the high side it is the dual of the bilinear form; on the low side it is
the dual of |A|².

### 4.2 A growing auxiliary modulus

Suppose q_{b\*} = Z^{β} with β > 0. Then:
* Q = q_{b\*}X′Y′ and P_a = Z^{b−β};
* the coset norm is q_{e₀} = q_{b\*}^{f} with 0 ≤ f ≤ 4 (f = g − 1);
* the exceptional count is (P_a/q_{e₀})^{1/6}.

**Proposition 4.2** [P, exact]. Grant Lemma 15.1 in the enlarged ball at the paper's per-row size, Σ|B|² ≪ QZ^ε. Even then the
low exponent is

  lx/2 + β/2 + max(0, (b − (1+f)β)/12) ≥ lx/2 + b/12,

with equality only at β = 0. Indeed β/2 + (b − 5β)/12 = b/12 + β/12.

The exact piecewise-linear minimisation is Part F, over f ≤ 4 and β ∈ [0, 1] on a 1/4000 grid with Fractions. ∎

Killing the coset needs q_{e₀} ≥ P_a, which costs q_{b\*}^{1/2} ≥ Z^{b/10} > Z^{b/12}. Growing b\* only makes things worse, and
in the true geometry it also violates Lemma 15.1's column-branch range M′ + ℓ′ ≤ 1.

### 4.3 Other variants

**Proposition 4.3.**

* (i) **The s-weight.** [P] 𝔈 ∝ |Ŵ₁(1/6 + iν)|². This cannot vanish for all ν (Mellin inversion along Re w = 1/6), and the low
  bound integrates over ν. Only constants change.
* (ii) **Restricting the columns** to primes, a sifted set, or any subset of positive relative density in residue classes. [P]
  The exceptional coefficient on σ × σ is identically 1 (Lemma 2.2(ii)), so the exceptional part becomes a positive count of
  coprime pairs in the subset. Its ratio to the diagonal stays of order one.
* (iii) **The row majorant.** [P] Cauchy–Schwarz needs Φ ≥ 0, and then M_Φ(1/6) > 0.
* (iv) **Moving the exceptional moment to a shorter s-range** (two-scale subtraction). [P in the exponent model, Part G]
  * Put c^E = (Y′/Y″)^{7/6}·c on s ≍ Y″. This matches the q^{1/6}-weighted moment, which is what the a-sum sees.
  * Its exceptional part is (Q/Y′)P_a^{1/6} for every Y″ ≥ √Q.
  * For Y″ < √Q its diagonal is (Q/Y′)(Y′/Y″)^{1/3} ≥ (Q/Y′)P_a^{1/6}.
  * So in the exponent model the exceptional mass is invariant: among single-scale column vectors carrying the same
    exceptional moment, the Gram norm is ≥ (Q/Y′)P_a^{1/6}. A statement over all column vectors would need the spectral
    decomposition of §5.1. That is [H].
* (v) **Weighted Cauchy–Schwarz** Σ|A|²u · Σ|B|²/u with a positive row weight u. The exceptional part of Σ|A|²u is again
  ∝ M_{u}(1/6) > 0, by (iii). A gain would need u to correlate with the theta coefficients of §5.1. That is the Hölder / weighted
  variant, treated in the sibling note on Strategy 2 (`tmp/beat78-prop152-holder-algebra.py`).

---

## 5. Is there an explicit structure for a direct estimate?

### 5.1 The exceptional component in the row variable [H]

Ã_{σ,ν}(y) is the y-th Fourier coefficient of a truncated sextic Kubota–Eisenstein series on the 6-fold cover, of level dividing
the T-modulus. Shift the s-Mellin contour past the Kubota pole at w = 1 + 1/6 (unnormalised Gauss sums). The residue gives

  Ã^θ_{σ,ν}(y) = Res · Ŵ₁(1/6 + iν) · Y′^{−1/3} · τ_σ(y),

where τ_σ(y) are the Fourier coefficients of the residual (theta) form.

The exponents are consistent with Prop 2.3:
* The Gram exceptional term (Q/Y′)P_a^{1/6} = Y′^{−2/3}Q^{5/6} equals ‖Ã^θ‖² if Σ_{q_y≤Q}|τ_σ(y)|² ≍ Q^{5/6} = Q^{1−1/6}.
* That is the n = 6 case of the rule Σ|τ_n|² ≍ X^{1−1/n}.
* For n = 2 the same computation is exact: the exceptional frequencies are squares, the theta coefficients are supported on
  squares, and (Q/Y′)P_a^{1/2} = Q^{1/2} = #{squares ≤ Q}.

So the explicit structure asked for in Strategy 1 is the sextic theta series at argument e₀m. This identification is heuristic:
it needs the spectral decomposition of the truncated Eisenstein series, and the fact that the continuous part has no exceptional
Gram term. Lemma 3.2 does not depend on it.

### 5.2 Toy Gram over Z[ω] [N]

Script: `tmp/beat78-prop152-subtract-gram.py`; log: `tmp/beat78-prop152-subtract-gram-Y2000.log`.

The columns are squarefree primary s with 1000 < q_s ≤ 2000, coprime to 6·Λ₇·Λ₃₁; there are 244 of them. The rows are all of O,
weighted by exp(−πq_m/Q). The table gives each part as a fraction of the diagonal.

* "μ₆" is the frequency set j ∈ μ₆, the exceptional coset for c = 1.
* "μ₆Λ₇²" is the coset for the paper-type case B.
* "rest" is everything else.

| P_a | A: c = 1 (μ₆) | B1: ξ = χ_Λ (μ₆) | B: ξ quadratic (μ₆ / μ₆Λ₇²) | C: ξ of order 5 (μ₆ / μ₆Λ₇²) |
|---|---|---|---|---|
| 16 | +3.37% | +3.92% | −0.09% / 0.00% | +0.06% / 0.00% |
| 64 | +4.84% | +5.57% | −0.12% / +0.03% | +0.08% / 0.00% |
| 256 | +5.30% | +6.09% | −0.14% / +1.52% | +0.08% / +0.03% |
| 1024 | +5.43% | +6.22% | −0.14% / +4.37% | +0.08% / +0.09% |

The "rest" column is O(10⁻³) for P_a ≤ 64 and ≤ 2.7% at P_a = 1024, where the non-exceptional terms P_a²/Y′ start to grow.

Readings:
* The exceptional part is real and positive. Its size saturates once the Gaussian factor exp(−(4π/3)Qq_k/(q₁q₂)) reaches 1.
* It is decided by the order of ξ, exactly as Theorem 4.1 says.
* For the paper's quadratic ξ it moves to the coset e₀ = Λ² and appears only when P_a > q_{e₀} = 49.
* The saturated ratio exceptional/diagonal matches the C = 1 prediction for case A.
  * The model (density of columns) × (mean 1/2 over the two units ±1) gives 5.91%.
  * The same with the exact R-phases of the 244 columns gives 5.67%.
  * The observed value at P_a = 1024, where the Gaussian factor is slightly below 1, is 5.43%.
* No C > 1 exceptional term can appear in this range: it needs q_k ≥ 7⁶.

### 5.3 Partial sums of sextic and cubic Gauss sums [N]

Script: `tmp/beat78-prop152-subtract-theta.py`. It computes γ_j on squarefree primary s via twisted multiplicativity,
γ_j(sπ) = γ_j(s)γ_j(π)R(π, s)^jχ_π(s)^{2j}, and sums by class (square class mod 4) × (s mod 9).

At X = 3·10⁴ (8459 columns):
* **Cubic control, Σγ₂.** Total |S|/√n = 11.7, local slope 0.85. This is Patterson's X^{5/6} main term, with the classes
  s ≡ 1 (mod 9) dominant and real.
* **Sextic, Σγ₁.**
  * The total over all classes is 1.45σ: no coherent total.
  * The class (square class [1], s ≡ 1 mod 9) has |S|/√n = 6.0 and slope 0.84.
  * Three further classes are about 3σ.
  * The median over the 36 classes is 1.03 (random walk ≈ 0.89).

At X = 3·10⁵ (84,677 columns; log `tmp/beat78-prop152-subtract-theta-300k.log`; fits from
`tmp/beat78-prop152-subtract-thetafit.py`, log `-thetafit.log`):

| sum | total \|S\|/√n | leading class \|S\|/√n | fitted exponents (5 leading classes) | best one-parameter model | Σ_classes\|S\|²/n | energy slope X/4→X (pred. θ = 2/3 / 5/6) |
|---|---|---|---|---|---|---|
| γ₂ (cubic control) | 24.6 | 16.6 | 0.81–0.86 | x^{5/6} in 5/5 | 86.9 | 1.667 (1.328 / 1.654) |
| γ₁ (sextic) | 2.6 | 7.8 | 0.61–0.70 | x^{2/3} in 5/5 | 5.80 | 1.259 (1.264 / 1.499) |

How the energy test works:
* model each class sum as c·x^θ plus square-root noise;
* the measured energy ratio at X fixes the main-term share, which predicts the slope between X/4 and X;
* the sextic data match θ = 2/3 and exclude 5/6; the cubic data match 5/6.

Readings:
* The sextic Gauss-sum sums have per-class main terms of order X^{2/3}, whose phases cancel in the full sum over primary s.
  The leading class grows from 6.0σ at X = 3·10⁴ to 7.8σ at X = 3·10⁵, consistent with the X^{1/6} growth of a 2/3-main term
  over √X noise.
* This is the residual spectrum of §5.1 at the Kubota point 1/2 + 1/6, and it is nonzero on these classes.
* By (4.7) the same sums are the μα-twisted cubic Gauss sums. So those sums have a genuine main term at 2/3 and are not small.

### 5.4 Why the cubic theta coefficients and (4.7) do not supply the structure

(4.7) (checked; see §2.1) gives, for squarefree c,

  γ₁(c) = μ(c)·α(c)·G(c)·\overline{γ₂(c)}.

So the sextic Kubota series is a Möbius- and Hecke(α)-twisted cubic Gauss-sum series. Patterson's theorem is about the untwisted
cubic series, with main term X^{5/6} and explicit coefficients. The twist by μ·α does two things:
* α has infinity type 1, which changes the K-type;
* μ changes the twisted-multiplicative structure.

The resulting main term sits at the sextic exponent 2/3, with the sextic theta coefficients. The cubic theory gives no formula for
it. For n = 6 the theta representation of the n-fold cover of GL(2) has no unique Whittaker model (Kazhdan–Patterson: unique only
for n ∈ {2, 3}), so the coefficients τ_σ at squarefree arguments are not determined by local data. [recalled, not re-derived]

**Correction to `beat78-amplifier.md` §6.** That note says removing the loss "requires cancellation in Möbius-twisted cubic Gauss
sums". The referee already re-classified the loss as a dual main term. §5.3 adds that the relevant μα-twisted sums carry a genuine
main term of their own (the sextic residual spectrum). There is no cancellation to find. The quantity to control is a correlation
(§6), not a cancellation.

---

## 6. What would be needed

**Hypothesis TRO(η)** (theta–row orthogonality). For every rescaled J, class σ and height v,

  | Σ_{m≠0} Ω(q_m/Q) ξ(m)(q_m/Q)^{−iv} A_{m,σ,v}(Y′) B^J_{m,σ}(Z) | ≪ (1+|v|)^{J}(Q/Y′)^{1/2} P_a^{(1−η)/12} Z^{M′/2+ε}.

* **TRO(η) is the improved low bound.** It is equivalent to |I_{η,modified}| ≪ Z^{lx/2+(1−η)b/12+ε} (Lemma 3.2), and it gives
  σ_low = 1 − h/6 + (1−η)b/12. With the rest of Part II unchanged, the heuristic models give:
  * η = 0.1 → σ₀ ≈ 0.87393;
  * η = 1 → σ₀ ≈ 0.8636.

  These come from `beat78-synthesis.md` §3. They are endgame-only and not re-verified here.
* **It cannot come from mean squares.** The vector \bar A·‖B‖/‖A‖ satisfies Lemma 15.1 and Prop 15.2 and saturates
  Cauchy–Schwarz. So no argument whose only inputs about A and B are their mean squares proves TRO for any η > 0.
* **What it would need instead.** TRO needs arithmetic information about B^J relative to the exceptional direction of A. By
  §5.1, that direction is the twisted sextic theta series at e₀m, and B^J is built from cubic Gauss sums at completed indices cn³.
  The required statement is a correlation bound between a sextic theta series and twisted completed cubic rows. Nothing of this
  kind is in the paper or in the literature recalled here.
* **What it would exclude.** Any proof of TRO(η) excludes family zeros with C(β) ∈ (lx/2 + (1−η)b/12, lx/2 + b/12], i.e.
  β ∈ (7/8 − ηb/12, 7/8]. In a world with such a zero, the left side of TRO is the signal (Cor 3.4).

**Possible next steps.** None is started here.

* **(a) A global identity for the sextic residual spectrum over Q(ω).**
  * Kazhdan–Patterson non-uniqueness is a local statement; it does not exclude a global identity expressing the sextic theta
    series through cubic and quadratic theta series.
  * Such an identity would turn ⟨Ã^θ(e₀·), B^J⟩ into a correlation of cubic theta coefficients with completed cubic rows.
    Patterson's cubic theta transformation might then be applicable.
  * A cheap first test: extract the per-class constants c_σ of Σ_{q_s≤X}γ₁(s) ~ c_σX^{2/3} from §5.3 at larger X, and compare them
    with products of Patterson's cubic constants.
* **(b) Abandon the Prop 15.2 side.** By Theorem 4.1, every sextic-character probe with the principal signal carries the exceptional
  term. The remaining levers are those listed in `beat78-synthesis.md` §4: a wider Lemma 15.1 range together with better row
  counts at δ ≈ 0.39, or a different probe.

---

## 7. Precise obstruction (Strategy 1)

> In the 7/8 paper, the exceptional (sixth-power-frequency) component of the additive row coefficients is not a separable part of
> the coefficient.
>
> 1. **The coefficient is its own exceptional component.** On every ray class σ, the column coefficient equals
>    κ_σ 1_σ \overline{χ_•(e₀)}/τ for an explicit S-unit e₀ (Lemma 2.2). Its periodic-mean component is the whole coefficient,
>    and the mean-zero remainder is 0.
> 2. **The term is a main term.** The Gram coefficient at the exceptional frequencies ±e₀a⁶ is identically 1, and the exceptional
>    term is a main term of size 𝔈·(Q/Y′)P_a^{1/6} with 𝔈 > 0 (Prop 2.3).
> 3. **Any subtraction is circular.** For every decomposition A = A^E + A^R whose remainder has no exceptional term, the
>    subtracted piece reproduces the probe up to O(Z^{lx/2+ε}) and has ‖A^E‖ ~ ‖A‖. Cauchy–Schwarz on it returns lx/2 + b/12,
>    i.e. 7/8 (Lemmas 3.2–3.3).
> 4. **The probe cannot be redesigned to avoid it.** The exceptional coset exists exactly when the probe has its principal signal:
>    both require ξ⁶ = 1, the a-sum pole of ζ_F^S(6z) at z = 1/6 (Thm 4.1). Enlarging b\* costs more than it saves (Prop 4.2).
> 5. **The required structure is not available.** Its explicit form is the sextic residual spectrum. Its coefficients are not
>    known, and the identity (4.7) and the cubic theta coefficients do not determine them (§5).
>
> A gain therefore requires a non-Cauchy–Schwarz bound for the full bilinear form, Hypothesis TRO. That is a correlation estimate
> between the completed cubic rows and the sextic theta direction, and it is not derivable from the paper's mean-square inputs.

---

## 8. Reproduction

All scripts are run with `.venv-arb/bin/python`. Runtimes are single-threaded.

| script | content | status | runtime |
|---|---|---|---|
| `tmp/beat78_prop152_subtract_lib.py` | Z[ω] arithmetic, sextic symbols, Gauss sums, square classes and R (table 4.4) | library | — |
| `tmp/beat78-prop152-subtract-algebra.py` → `-algebra.log` | Parts A–H, 17 checks: bookkeeping, duality (1,763,844 characters), e₀ structure lemma (exact symbols), identically-1 coefficient, dilation identity, growing b\*, two-scale invariance, residue constant | 17/17 pass | ≈ 20 s |
| `tmp/beat78-prop152-subtract-gram.py --validate` → `-gram-validate.log` | brute-force row sum = full dual expansion (4.9·10⁻¹³); (2.1) on 224 tests | pass | ≈ 1 min |
| `tmp/beat78-prop152-subtract-gram.py 2000 1024,256,64,16` → `-gram-Y2000.log` | §5.2 table | [N] | ≈ 3 min |
| `tmp/beat78-prop152-subtract-theta.py 30000` and `300000` → `-theta-300k.log`, `-theta.out.json` | §5.3 | [N] | 7 s / ≈ 15 min |
| `tmp/beat78-prop152-subtract-thetafit.py` → `-thetafit.log` | §5.3 exponent fits and energy test | [N] | < 1 s |

The library self-test checks Lemmas 4.2 and 4.4 and (4.7) against the paper on 122 primes with q ≤ 700, and on products of two of
them. It is `tmp/beat78-prop152-subtract-selftest.py` → `-selftest.log`, which passes in about 5 s.
