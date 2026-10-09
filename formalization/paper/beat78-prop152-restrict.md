# Strategy 3 for the Prop 15.2 exceptional term: restricting or re-weighting the rows

Date: 2026-10-08. Branch `editorial-redesign`, nothing committed.
Sources: the 7/8 paper (`/tmp/qrh-verify/paper.txt`, openai/math family 003, "A Zero-Free Half-Plane Re s > 7/8"),
the 11/12 paper (`/tmp/qrh-verify/paper2.txt`), and the earlier analysis in `beat78-synthesis.md`,
`beat78-meansquare.md` and `beat78-amplifier.md`. Equation and lemma numbers refer to the 7/8 paper unless stated otherwise.
Scripts and logs: `tmp/beat78-prop152-restrict-*` (listed in §13).

Status labels:
* **[PROVED]**: a complete argument is given here.
* **[PROVED-rel]**: proved relative to lemmas of the 7/8 paper that are used as stated. That paper is unrefereed; its authors formalised it in Lean.
* **[EXACT]**: exact rational or symbolic computation.
* **[NUMERICAL]**: a floating-point measurement in a finite model.
* **[HEURISTIC]**: anything not fully verified.

---

## 0. Outcome

**No zero-free half-plane Re s > θ′ with θ′ < 7/8 is obtained.** No form of Strategy 3 examined here works.

PT Λ ≤ 0.2 stands. The conditional Λ values from the 7/8 start are unchanged. RH is open. NO QED.

No new inequality was proved, so there is no endpoint certificate. §10 records the exact bookkeeping instead.

What is established:

| id | statement | status |
|---|---|---|
| A | **Fourier positivity.** Take any nonnegative row weight supported in the row ball. Its Fourier transform is at least half its mass at every exceptional dual frequency with N(e)N(a)⁶ ≤ c_A·P_a. So no nonnegative weight can vanish on, or damp, those frequencies. | [PROVED] |
| K | **Kummer duality for S-ramified sextic characters.** Every exponent-6 ray character with conductor supported on S equals 𝔞 ↦ χ_𝔞(e) for an S-unit e that is unique modulo sixth powers. | [PROVED] (standard) |
| B | **Exact coherence.** There is an S-unit e₀ with c_σ(s)χ_s(e₀) = 1/τ for all s. Take coprime s₁, s₂ ∈ σ and j = e₀t⁶a⁶ with (a, s₁s₂) = 1. Then the joint coefficient of the frequency j in Prop 15.2's expansion is exactly 1. | [PROVED-rel] (Lemmas 4.1, 4.4, 13.3) |
| C | **Prop 15.2 is sharp.** For every smooth radial row weight ψ = φ∗φ̃ and every \|ν\| ≤ ν₀, Σ_m ψ(m/√Q)\|A_m\|² ≥ κ·(Q/Y′)·P_a^{1/6} in Prop 15.3's range. So the b/12 in Prop 15.3 is the exact output of the Cauchy–Schwarz pairing for smooth row weights. | [PROVED-rel] |
| D | **s-twists.** Twist the s-coefficient by a fixed character. The high-side principal pole exists only if the twist is Kummer-trivialisable. That same condition produces the low-side coherent term. The paper's condition ξ⁶ = 1, which is needed for the ζ_F(6z) pole, is exactly what makes c_σ Kummer-trivialisable. | [PROVED-rel] |
| R | **Class restrictions at an S-prime can remove the term.** Let p ∈ S have ξ_p quadratic. Restrict the rows m to a unit class x mod p. The leading coefficient of the exceptional term then carries the factor 1 + τ_p·c_L·χ_p³(x). On the "anti-coherent" half of the classes it vanishes, and the P_a^{1/6} term is gone (remainder O(P_a^ε)). This requires χ_p³ to be trivial on the T-measurable S-units; otherwise the cancellation is only partial. | [PROVED-rel] at the level of the p-local computation; [NUMERICAL] confirmation |
| E′ | **Duality.** For the same class restriction, the high-side principal signal carries the factor 1 + τ_p·s_H·χ_p³(x). We have s_H = c_L whenever R(π_p,·) ≡ 1. Complete cancellation in R is equivalent to R(π_p,·) ≡ 1: checked for 414/414 primes of norm < 3000, both conditions being functions of π_p mod 4. **So the classes free of the exceptional term are exactly the classes where the signal vanishes.** | [PROVED-rel] local computation + [NUMERICAL] equivalence |
| E, F | **High-side rows and Framework A.** On the high side the sixth-power frequencies are the signal itself: the ζ_F(6z) pole, with c_S ∝ M(1/6). In Framework A and in Lemma 17.6 the sixth-power rows are the amplifier. Restricting them destroys what they carry. | [PROVED] |
| X | **Exponent bookkeeping.** Thin row sets are neutral or worse. Shrinking the row ball is a change of geometry. σ₀ = 5/6 + M/12 − ℓ/6 does not depend on b. | [EXACT] |

**Mechanism in one paragraph.** Expand the low-side A-norm by Poisson. Its exceptional term is the "coherent" part: the dual frequencies whose good part is a sixth power, where the Gauss-sum phases of the additive polynomial cancel exactly (Theorem B). The high-side signal comes from the same sixth-power structure in the dual of m. Every modification of the rows examined here multiplies both by the same local factor:
* nonnegative smooth weights: positivity of the |x|^{−1/3}-moment on both sides;
* fixed-character twists: Kummer duality;
* class restrictions at S-primes: one p-adic factor 1 + τ_p c_L χ_p³(x) on both sides.

So, for every form examined, removing the exceptional term by a row restriction also removes the signal. This fits the exact b-cancellation in σ₀; the structural reading of that is in §11 and is heuristic. A successful restructuring has to break the pairing itself (§11.3). That no row selection of any kind can do it is a conjecture (§12); it is proved here only for the forms listed in the table.

---

## 1. Setting

### 1.1 The low-side step and where P_a^{1/6} enters

(6.2) separates the probe as

  I = Q^{−1/2}/(2π) ∫ Ŵ₀(iν) Σ_σ Σ_{m≠0} Ω(q_m/Q) ξ(m)(q_m/Q)^{−iν} A_{m,σ,ν}(Y) B_{m,σ}(Z) dν.

The additive factor is

  A_{m,σ,ν}(Y′) = Y′^{−3/2} Σ_s c_σ(s) W₁(r_s) r_s^{−1+iν} g_{χ_s}(s, −m),

with c_σ(s) = 1_{s∈σ} χ_s(b∗)/(τ ξ(s)) and r_s = q_s/Y′.

Prop 15.2 gives Σ_{q_m≪Q} |A_m|² ≪ (Q/Y′)(1 + P_a^{1/6} + P_a²/Y′)Z^ε, with P_a = Y′²/Q. Prop 15.3 pairs this with Lemma 15.1 by Cauchy–Schwarz and gets

  |I| ≪ X′^{1/2} P_a^{1/12} Z^ε = Z^{l_x/2 + b/12 + ε}, b = l_y − l_x.

With h = 1 − l_x + ℓ and C_II(s) = s + l_x/2 − 1 + h/6, this yields

  σ₀ = 1 − h/6 + b/12 = 5/6 + M/12 − ℓ/6  (M = l_x + l_y) [EXACT; E1].

At fixed M, b cancels. The exceptional term costs exactly the b/12 that the asymmetry gains through h.

### 1.2 Five places where sixth powers occur, and which "rows" are meant

| place | variable | sixth-power object | role |
|---|---|---|---|
| Prop 15.2 (low side) | rows m, q_m ≪ Q; columns s ~ Y′ | dual frequencies k = e·a⁶ of m relative to the modulus s₁s₂ | **the exceptional term P_a^{1/6}** |
| §7 (high side) | Poisson frequencies H = u·a⁶ of m | the a-sum ζ_F^S(6z), pole at z = 1/6 | **the principal signal**, c_S = Ŵ₁(1)M(1/6)Res ζ_F^S/6 (10.1) |
| Lemma 17.6 | rows u·a⁶, u sixth-power-free | trivialising rows a⁶ | amplification slope 5/6 in the row counts |
| Lemma 18.1 | rows with inducing character in Θ | sixth-power form of rows | plain-witness capacity |
| 11/12 paper, (3.2) | rows u of A_u(D) | rows u = p⁶ | the amplifier A_{p⁶} = A₁ + O(D/Y) |

The exceptional frequencies of Prop 15.2 are dual frequencies, not rows. Sieving out rows m with large sixth-power part does not touch them (§2.2).

### 1.3 Strategy 3, formalised

Insert a weight w(m) into the m-sum of the probe (6.1), and possibly modify the s-weight. On the low side, every Cauchy–Schwarz split puts a nonnegative weight ω = |w₁|²·1_{ball} on the A-norm. On the high side, Poisson summation in m (§7.1) must remain available.

Weights compatible with that are of three kinds:
* smooth weights;
* weights periodic modulo a fixed modulus;
* short divisor-sum (sieve) weights.

Arbitrary arithmetic weights break the Poisson step.

### 1.4 The exact dual expansion

Let ψ be a Schwartz weight on C. Using Poisson in m with the self-dual measure and e(z) = exp(4πi Im z/√3):

  Σ_m ψ(m/√Q) |A_m|² = (Q/Y′³) Σ_{s₁,s₂} a(s₁) \overline{a(s₂)} Σ_{j∈O} F(s₁,s₂; j) ψ̂(√Q j/(s₁s₂)),   (1.1)

with a(s) = c_σ(s)W₁(r_s)r_s^{−1+iν}. Here F(u,v;j) = Σ_{vx−uy≡j} χ_u(x)\overline{χ_v(y)} is the correlation (13.6). For coprime s₁, s₂ (C = 1), Lemma 13.3 gives

  F(s₁,s₂;j) = χ_{s₁}(j) \overline{χ_{s₂}(−j)} R̂(s₁,s₂),  R̂(s₁,s₂) = \overline{χ_{s₁}(s₂)} χ_{s₂}(s₁) = R(s₁,s₂).   (1.2)

Both are verified numerically:
* (1.1) holds to relative error 1.9·10⁻¹⁵ for a Gaussian ψ, on diagonal and coprime pairs (test T3);
* (1.2) holds to 10⁻¹⁵ by direct enumeration (test T2).

Frequency classes:
* j = 0 is the diagonal.
* j is **exceptional** if every good valuation of j outside C is divisible by six, so j = e·t⁶·a⁶ with e sixth-power-free and S-supported (unit included), t an S-monomial and a good primary.
* All other j are nonexceptional.

---

## 2. Theorem A: Fourier positivity

**Theorem A [PROVED].** Let ω ≥ 0 on O, supported in {q_m ≤ C_Ω Q} and not identically zero, and put ω̂(ξ) = Σ_m ω(m) e(−mξ). Then

  Re ω̂(ξ) ≥ ω̂(0)/2  for all |ξ| ≤ ξ₀ := √3/(8π√(C_Ω Q)).

*Proof.*
* |e(−mξ) − 1| ≤ (4π/√3)|Im(mξ)| ≤ (4π/√3)|m||ξ|.
* So |ω̂(ξ) − ω̂(0)| ≤ (4π/√3)√(C_Ω Q)|ξ|·ω̂(0) ≤ ω̂(0)/2. ∎

### 2.1 Consequence for the exceptional frequencies

For any nonnegative ω, the finite form of (1.1) is

  Σ_m ω(m)|A_m|² = Y′^{−3} Σ_{s₁,s₂} a\bar{a}′ Σ_{j mod s₁s₂} F(s₁,s₂;j) ω̂(j/(s₁s₂)).

* For q_{s_i} ≥ r₋Y′, every exceptional class j ≡ e a⁶ with q_e q_a⁶ ≤ c_A P_a satisfies |j/(s₁s₂)| ≤ ξ₀, where c_A = 3r₋²/(64π²C_Ω).
* Such classes therefore receive weight at least ω̂(0)/2.
* No nonnegative row weight vanishes, or is small, on them.
* A "smooth weight vanishing to high order on the sixth-power frequencies" does not exist among nonnegative weights. A signed weight w still enters the A-norm as |w|² ≥ 0.

Test T5 checked this on random, sparse, sector-shaped and arithmetic-looking weights: min Re ω̂/ω̂(0) = 0.94.

### 2.2 Sieving rows by their sixth-power part

* Rows m = δ⁶m′ with q_δ ≥ D form a set of relative density ≤ Σ_{q_δ≥D} q_δ^{−6}.
* By (1.1) with the restricted weight, their share of every main term is of the same relative order.
* Removing them changes nothing at exponent level.
* In the finite model, the sixth-power-free restriction removes 0.2% of rows and leaves the excess ratio unchanged (§6).

---

## 3. Kummer duality and the exact coherence of the exceptional coefficient

**Lemma K [PROVED; standard Kummer theory over F ∋ μ₆, h_F = 1].** Let S contain the primes above 6. Every finite-order Hecke character ψ with ψ⁶ = 1 and conductor supported on S satisfies ψ(𝔞) = χ_𝔞(e) on ideals coprime to S, for an S-unit e that is unique in O_S^×/(O_S^×)⁶.

*Proof.*
1. By Lemma 4.1, e ↦ (𝔞 ↦ χ_𝔞(e)) maps O_S^×/(O_S^×)⁶ into the exponent-6 characters with conductor supported on S.
2. **Injective.** If χ_𝔞(e) = 1 for all 𝔞 coprime to S, Chebotarev gives F(e^{1/6}) = F. Hence e ∈ F^{×6} ∩ O_S^× = (O_S^×)⁶.
3. **Surjective.**
   * By class field theory, ψ cuts out a cyclic extension L/F of degree d | 6, unramified outside S.
   * By Kummer theory, L = F(x^{1/6}) with x ∈ F^×.
   * Unramified at p ∉ S, p ∤ 6, forces 6 | v_p(x).
   * Class number one gives x = e·z⁶ with e ∈ O_S^×.
   * The characters of Gal(F(e^{1/6})/F) are σ ↦ (σ(e^{1/6})/e^{1/6})^k, which equals χ_𝔞(e^k) at Frobenius (Lemma 4.1). ∎

**Corollary.** s ↦ \overline{ξ}(s mod b∗) on primary s is a ray character mod 3b∗ of exponent dividing 6. Lemma 4.1 says s ↦ χ_s(b∗) is one as well. So τ·c_σ(s) = χ_s(b∗ e_ξ) for an S-unit e_ξ. Put e₀ := (b∗e_ξ)^{−1}, the sixth-power-free representative. Then

  c_σ(s) χ_s(e₀) = 1/τ  for every primary s outside S, with s ∈ σ.   (3.1)

**Theorem B (exact coherence) [PROVED-rel: Lemmas 4.1, 4.4, 13.3 as stated].** Let s₁ ≠ s₂ be coprime with s₁, s₂ ∈ σ. Let j = e₀t⁶a⁶ with t an S-monomial and a good primary coprime to s₁s₂. Then

  c_σ(s₁) \overline{c_σ(s₂)} F(s₁,s₂;j) = 1.

More generally, define E_σ = {e : s ↦ c_σ(s)χ_s(e) is constant on σ}. For e ∈ E_σ the coefficient is |f_e(σ)|² = 1. For e ∉ E_σ it equals f_e(s₁)\overline{f_e(s₂)} with f_e nonconstant on σ.

*Proof.*
1. By (1.2) and χ_s(t⁶a⁶) = 1 for (a, s) = 1, F = χ_{s₁}(e₀) \overline{χ_{s₂}(e₀)} \overline{χ_{s₂}(−1)} R(s₁,s₂).
2. By (3.1), the first two factors combine with c_σ(s₁)\overline{c_σ(s₂)} into |τ|^{−2} = 1.
3. Lemma 4.4 gives χ_n(−1) = R(n,n). T is chosen so that R factors through T. So R(s₁,s₂) = R(σ,σ) = χ_{s₂}(−1) on σ × σ.
4. The remaining product is therefore R(σ,σ)² = 1. ∎

Tests T4 and T4b confirm the inputs:
* R̂ ∈ {±1} and depends only on (s₁, s₂) mod 4 (144 class pairs);
* χ_{s₂}(−1)R̂(s₁,s₂) = 1 for all 680 coprime pairs with s₁ ≡ s₂ mod 4.

The paper's Prop 15.2 bounds these coefficients by |L_C| ≤ q_C. Theorem B shows that bound is attained at C = 1 with no cancellation: this is a dual main term.

---

## 4. Theorem C: the exceptional term is attained

**Theorem C [PROVED-rel].** Hypotheses:
* φ ∈ C_c^∞(C) is radial, nonnegative and nonzero, with supp φ ⊂ {|x| ≤ ½√C_Ω}.
* ψ = φ∗φ̃, normalised so that ψ ≤ 1. Then ψ ≥ 0, ψ ≤ 1_{ball} and ψ̂ = |φ̂|² ≥ 0.
* The range of Prop 15.3 holds: P_a ≥ Z^{b₀} with b₀ > 0, and P_a^{11/6} ≤ Y′Z^{−1/12}.
* \|ν\| ≤ ν₀ := π/(4 log(r₊/r₋)).

Then, for Z ≥ Z₀(fixed data),

  Σ_{q_m≪Q} |A_{m,σ,ν}(Y′)|² ≥ Σ_m ψ(m/√Q)|A_{m,σ,ν}|² ≥ κ·(Q/Y′)·P_a^{1/6},  κ > 0 depending only on the fixed data.

*Proof.*

**Step 1 (exact expansion).** Expand by (1.1) and split the sum into four parts:
* 𝔇: the diagonal j = 0, which is ≥ 0;
* 𝔈₁: C = 1 and j exceptional;
* 𝔈_{>1}: C ≠ 1 and j exceptional;
* 𝔑: j nonexceptional.

**Step 2 (nonexceptional part).** The paper's nonexceptional argument uses only Schwartz decay of the kernel, the zero complete mean of the residual coefficient and four-dimensional lattice Poisson. It applies verbatim to ψ and gives |𝔑| ≪ (1+|ν|)^J (Q/Y′)(P_a²/Y′)Z^ε ≪ (Q/Y′)P_a^{1/6}Z^{−1/12+ε}.

**Step 3 (main lower bound).** Let 𝔈₁^{coh} be the part of 𝔈₁ with e ∈ E_σ. By Theorem B,

  𝔈₁^{coh} = (Q/Y′³) Σ_{e∈E_σ} Σ_t Σ_{(s₁,s₂)=1; s_i∈σ} W₁(r₁)W₁(r₂)(r₁r₂)^{−1}(r₁/r₂)^{iν} Σ_{(a,s₁s₂)=1} ψ̂(√Q e t⁶a⁶/(s₁s₂)).

* For \|ν\| ≤ ν₀, Re(r₁/r₂)^{iν} ≥ 1/√2, and every term has ψ̂ ≥ 0.
* Fix y₀ > 0 with ψ̂(y) ≥ ψ̂(0)/2 for |y| ≤ y₀. Keep only e = e₀, t = 1, and those a with ψ̂ ≥ ψ̂(0)/2 at their frequency. A sufficient condition is q_a ≤ A₋ = (y₀²r₋²P_a/q_{e₀})^{1/6}, since |√Q e₀a⁶/(s₁s₂)|² = q_{e₀}q_a⁶/(r₁r₂P_a).
* Möbius over the divisors of D = s₁s₂ gives #{a good, q_a ≤ A, (a,D) = 1} = κ_S A φ(D)/q_D + O_S(2^{ω(D)}(A^{1/2}+1)), with κ_S = (π/3√3)Π_{p∈S}(1 − q_p^{−1}).
* The mean value of the nonnegative multiplicative weight φ(s₁s₂)/q_{s₁s₂} over coprime pairs in σ (writing Π_{p|s}(1−1/q_p) = Σ_{d|s}μ(d)/q_d) is c_pair Y′² + O(Y′^{3/2}), with c_pair > 0 an absolutely convergent Euler product.
* Hence

  Re 𝔈₁^{coh} ≥ (ψ̂(0)/(2√2)) κ_S c_pair (y₀²r₋²/q_{e₀})^{1/6} (Q/Y′) P_a^{1/6} − O((Q/Y′)P_a^{1/12}(log Y′)³).

**Step 4 (the other exceptional pieces are nonnegative up to negligible error).** For fixed (C, d, k), the residual coefficient (after Möbius d) is periodic modulo r = lcm(l_fixed, rad C, rad k). Lattice Poisson, with the complete mean extracted, gives main term = (complete mean) × (volume), plus an error ≪ q_C N²(q_r/N)^A.

* **C = 1, e ∉ E_σ.** The complete mean vanishes: f_e restricted to σ is a nontrivial fixed character, independent of the moving moduli by CRT.
* **C ≠ 1.** The complete mean is a product of local means, each real and ≥ 0:
  * at S-places: |mean of a T-measurable character|²;
  * at p | C with p ∤ n₁n₂: from (13.8), P^{c−1}·γ·|mean χ_p^{c+v}|², where γ = P−1 or P−2 whenever the mean is nonzero;
  * at p | C with p dividing exactly one residual: P^{c−1}(P−1)1_{6|c}1_{p∤k} ≥ 0;
  * at p | a₁: a coprimality indicator.
* The Möbius sum over d reassembles these into means over coprime residual pairs, which stay ≥ 0.
* The real part of each volume is ≥ (1/√2)·|volume|.
* For C₀ ≤ Y′^{1/8} and D₀ ≤ Y′^{1/6}, the Poisson error is a negative power of Y′, because q_r ≪ RP_a and N ≥ Y′^{17/24}.
* Larger C₀ or D₀ are covered by the paper's trivial bound with factor C₀^{−1/6}D₀^{−1}, which costs a power of Y′. This holds even with the 6^{|S|} count of e.

**Step 5.** Collecting: 𝔐 = 𝔇 + 𝔈 + 𝔑 ≥ Re 𝔈₁^{coh} − o((Q/Y′)P_a^{1/6}) − |𝔑| ≥ (κ/2)(Q/Y′)P_a^{1/6}. ∎

**What is new versus used as stated.**
* New and written out here: Theorem B, the a-count, the nonnegativity of the complete means at C ≠ 1, and the assembly.
* Used as stated: the paper's nonexceptional estimate and its lattice-Poisson and trivial exceptional bounds.

**Corollary C1.** For every smooth radial row weight, Cauchy–Schwarz with the A-norm gives at least X′^{1/2}P_a^{1/12}·Z^{−ε}·(Σ|B|²/Z^{M′})^{1/2}. The b/12 cannot be lowered by any change of the smooth row profile.

### 4.1 Numerical confirmation [NUMERICAL]

The finite model (`tmp/beat78-prop152-restrict-toy.py`):
* A_m = Y^{−3/2}Σ_s a(s)g_{χ_s}(s,−m) with a(s) = W₁(q_s/Y)(Y/q_s), over squarefree primary s whose prime factors are good primes of norm > P₀;
* Gaussian row weight;
* Y = 20000; 200 000 rows per point.

"ratio" = mean(|A_m|² − diag_m)/mean(diag_m): the off-diagonal excess relative to the diagonal. "E1" is the C = 1 exceptional prediction from (1.1)–(1.2), an exact finite sum with no fitted parameter.

| P = Y²/Q | 16 | 64 | 256 | 1024 | 4096 |
|---|---|---|---|---|---|
| P₀ = 1: measured | 0.0135 ± 0.0023 | 0.0483 ± 0.0024 | 0.0731 ± 0.0024 | 0.1032 ± 0.0025 | 0.1192 ± 0.0025 |
| P₀ = 1: predicted E1 | 0.0154 | 0.0481 | 0.0696 | 0.1050 | 0.1295 |
| P₀ = 50: measured | — | 0.0229 ± 0.0023 | 0.0315 ± 0.0023 | 0.0479 ± 0.0024 | 0.0601 ± 0.0024 |
| P₀ = 50: predicted, coherence candidates only | — | 0.0223 | 0.0322 | 0.0492 | 0.0608 |

For P₀ = 50 the prediction uses only j = unit × λ^v × 2^w. With C ≠ 1 suppressed (P₀ = 50), the measured excess equals the coherent C = 1 term to within 0.5σ at every P.

The growth with P here is logarithmic. The asymptotic P^{1/6} law needs good a with q_a⁶ ≤ P, that is P ≥ 7⁶.

A sibling measurement on the same model, in the Hölder strategy (`tmp/beat78-prop152-holder-meansquare-Y20000.log`), finds the excess spread over the rows: kurtosis ≈ 2.0, and a top-1% share equal to the random-phase control. The coherent component is not carried by a sparse set of rows.

---

## 5. Re-weighting the s-variable: Proposition D

**Proposition D [PROVED-rel].** Replace c_σ(s) by c_σ(s)θ(s), with θ a fixed finite-order character of conductor supported on S.

1. *High side.* In Lemma 7.1 the s-variable enters through W = χ_l(u)Q^{−w}. Row u therefore carries L^S(w, θχ_•(u)). Physical rows have (u, S) = 1, and χ_•(u) is ramified at the primes of u unless u is a unit (§10.1). So a pole at w = 1 exists only if θ = χ_•(ζ^{−k}), i.e. only if θ is a unit-Kummer character.
2. *Low side.* The coherent condition is that θc_σχ_•(e) is constant on σ for some S-unit e. By Lemma K, such e exists exactly when θ has exponent 6.
3. Hence a twist that keeps the signal (θ unit-Kummer) always keeps a coherent term. A twist of order not dividing 6 removes the coherent term and also removes every principal pole.
4. *The order condition on ξ.* The high side needs ξ(a⁶) = 1 to obtain ζ_F^S(6z). If ξ⁶ ≠ 1, the a-sum becomes L(6z, ξ⁶), which has no pole at z = 1/6. The condition ξ⁶ = 1 is also what makes c_σ = χ_•(b∗)\overline{ξ}/τ an exponent-6 character, which is Kummer-trivialisable by Lemma K. So the condition that creates the signal is the one that creates the low-side coherent term.

**Numerical [NUMERICAL]** (P₀ = 13, θ a character of order d mod π₁₃; test T6 identifies θ = χ_•(π₁₃^k) up to a class function exactly when d | 6). The coherent frequency is j = e^{−1}: π₁₃³ (norm 2197) for d = 2, π₁₃² (169) for d = 3, π₁₃ (13) for d = 6.

| order d | Kummer? | P = 256 | P = 1024 | P = 4096 | P = 65536 |
|---|---|---|---|---|---|
| 1 | yes | 0.0455 (pred 0.0447) | 0.0661 (0.0670) | — | — |
| 6 | yes, j = π₁₃ | 0.0126 (0.0125) | 0.0348 (0.0324) | — | — |
| 3 | yes, j = π₁₃² | −0.0015 (−0.0009) | −0.0061 (−0.0008) | 0.0122 (0.0144) | 0.0408 (0.0462) |
| 2 | yes, j = π₁₃³ | −0.0001 (−0.0003) | −0.0017 (−0.0009) | −0.0034 (−0.0015) | 0.0082 (0.0165) |
| 4 | no | 0.0005 (−0.0007) | −0.0027 (−0.0016) | −0.0045 (−0.0015) | −0.0021 (−0.0035) |
| 12 | no | 0.0023 (−0.0008) | −0.0035 (−0.0013) | −0.0021 (−0.0014) | −0.0093 (−0.0040) |

Standard errors are ≈ 0.0023. The P = 65536 points lie far outside Prop 15.3's range, so agreement there is only qualitative.

The coherent term appears exactly when the threshold P ≳ q_{e₀} is crossed, and never for non-Kummer twists.

---

## 6. Row restrictions compatible with Poisson [NUMERICAL]

P₀ = 50, so all primes of norm ≤ 50 are in S and restrictions by them are fixed-modulus restrictions. Same model as §4.1; ratio ± s.e. (log `tmp/beat78-prop152-restrict-toy-C-P050.log`).

| restriction | fraction of rows | P = 1024 | P = 4096 |
|---|---|---|---|
| all rows | 1 | 0.0479 ± 0.0024 | 0.0601 ± 0.0024 |
| sixth-power-free | 0.998 | 0.0477 ± 0.0024 | 0.0604 ± 0.0024 |
| rough (no prime of norm ≤ 50) | 0.227 | 0.0563 ± 0.0050 | 0.0635 ± 0.0050 |
| coprime to 6 | 0.50 | 0.0533 ± 0.0033 | 0.0619 ± 0.0034 |
| m ≡ 1 mod 3 | 0.11 | 0.0457 ± 0.0070 | 0.0438 ± 0.0071 |
| random half | 0.50 | 0.0463 ± 0.0033 | 0.0634 ± 0.0034 |
| sextic residues mod π₇ | 0.14 | 0.0549 ± 0.0063 | 0.0676 ± 0.0063 |
| divisible by π₇ | 0.14 | 0.0443 ± 0.0062 | 0.0466 ± 0.0062 |
| sector \|arg m\| < π/12 | 0.084 | 0.0356 ± 0.0081 | 0.0588 ± 0.0082 |
| inner q_m < Q/2 | 0.39 | 0.0573 ± 0.0038 | 0.0674 ± 0.0038 |
| outer q_m > 2Q | 0.14 | 0.0211 ± 0.0062 | 0.0563 ± 0.0065 |

Every restriction compatible with Poisson leaves the ratio unchanged within about 2σ.

The radial dependence (inner rows above the average, outer rows below) has the sign predicted by the |x|^{−1/3}-moment law of §9. The leading coefficient is ∝ ∫ω(x)|x|^{−1/3}, which is positive for ω ≥ 0 by the same argument as the paper's M(1/6) > 0. The constant is π^{2/3}Γ(1/6)/Γ(5/6) = 10.5776… (E7, Arb).

---

## 7. Class restrictions at an S-prime: Lemma R

This is the one mechanism found that removes the exceptional term.

### 7.1 Statement

Fix p ∈ S with p ∤ 6 and ξ_p = χ_p³, the quadratic character mod π_p. Put τ_p = q_p^{−1/2}g(ξ_p).

The p-component of c_σ is χ_p⁴: the factor χ_s(b∗) contributes χ_p and \overline{ξ_p} contributes χ_p³.

Let E_T′ be the S-units whose Kummer character factors through T, and let e′ denote the p-free part of a coherent type e ∈ e₀E_T′.

**Lemma R [PROVED-rel; p-local computation written out].** Suppose χ_p³ is trivial on E_T′, and put c_L := χ_p³(e₀^{(p-free)}). Let x ∈ (O/π_p)^× satisfy 1 + τ_p c_L χ_p³(x) = 0, an "anti-coherent" class. Then for ψ as in Theorem C, or any radial Schwartz majorant,

  Σ_{m≡x (π_p)} ψ(m/√Q)|A_{m,σ,ν}|² = q_p^{−1}·𝔇 + O((1+|ν|)^J (Q/Y′)(P_a²/Y′ + P_a^ε) Z^ε).

The P_a^{1/6} term of Prop 15.2 is absent on these rows.

If χ_p³ is nontrivial on E_T′, the coherent types split by the sign of χ_p³(e′). The leading coefficient on every class is then a positive combination, so the term is only reduced by a constant factor.

### 7.2 Proof

1. **Coset Poisson.** Poisson on the coset x + π_pO gives

   Σ_{m≡x} ψ(m/√Q)e(−mξ) = (Q/q_p) Σ_n e(nx/π_p) ψ̂(√Q(ξ + n/π_p)).

2. **Change of variable.** Combine J = π_p(s₂x′ − s₁y) + n s₁s₂ (bijective modulo π_p s₁s₂). The C = 1 coefficient of J becomes

   c(s₁)\overline{c(s₂)} χ_{s₁}(J) \overline{χ_{s₂}(−J)} \overline{χ_{s₁}(π_p)} χ_{s₂}(π_p) R(s₁,s₂) · e(J \overline{s₁s₂} x/π_p),

   with the kernel ψ̂(√Q J/(π_p s₁s₂)).

3. **Split by V = v_p(J).**
   * *V ≥ 1.* Then e(·) = 1, and the p-character on s₁ is χ_p^{4+V−1}. Its mean is 1_{V≡3 (6)}. These are the coherent frequencies of the unrestricted problem, rescaled by π_p, and they are uniform in x.
   * *V = 0.* The p-character on s_i is χ_p³ (κ = 3), coupled through e(J x \overline{u₁u₂}/π_p). The mean over u₁, u₂ ∈ (O/π_p)^× is

     (q_p−1)^{−2} Σ χ_p³(u₁)χ_p³(u₂) e(Jx\overline{u₁u₂}/π_p) = χ_p³(Jx) g(χ_p³)/(q_p − 1)  (using χ_p⁶ = 1),

     and χ_p³(J) = χ_p³(e′) = c_L.

4. **Leading residue.** Write ψ̂_rad(y) = (2πi)^{−1}∫Ψ(w)y^{−w}dw. The a-sum then gives ζ_F^S(3w), and the leading residue sits at w = 1/3. At w = 1/3 the p-adic factor is

   Φ_p(x) = q_p^{1/6}·τ_p c_L χ_p³(x)·q_p^{1/2}/(q_p−1) + Σ_{k≥0} q_p^{(1−3−6k)/6}
          = (q_p^{2/3}/(q_p − 1))·(1 + τ_p c_L χ_p³(x)).   (7.1)

   (The sum over k is q_p^{−1/3}/(1 − q_p^{−1}).)

5. **Remainder.** On anti-coherent classes Φ_p(x) = 0. All other factors of the integrand are holomorphic in Re w > 0: ζ_F^S(3w) has its only pole at 1/3, Ψ is holomorphic there, and the coprimality factors are bounded by 2^{ω}. Shifting to Re w = σ′ > 0 bounds the remaining coherent part by O(P_a^{σ′/2}). This covers both C = 1 and C ≠ 1, because C is coprime to p and the substitution x → x\overline{C²} preserves χ_p³(x).

6. **The rest.** Oscillatory types and nonexceptional frequencies are bounded as in Theorem C, steps 2 and 4. ∎

### 7.3 Numerical confirmation [NUMERICAL]

The finite model's θ of order 3 mod π₁₃ has p-component χ_p⁴, so κ = 3, the same as the paper's c_σ with ξ_p quadratic. The rows were split by their class mod π₁₃ (600 000 rows). The prediction is an exact finite sum of the C = 1 coherent terms with the class-restricted factor (`tmp/beat78-prop152-restrict-classpred.py`, no fitted parameter).

| P | QR classes measured | QR predicted | NR classes measured | NR predicted |
|---|---|---|---|---|
| 256 | 0.0028 ± 0.0019 | 0.0018 | −0.0038 ± 0.0019 | −0.0027 |
| 4096 | 0.0219 ± 0.0019 | 0.0273 | **0.0025 ± 0.0019** | **0.0036** |
| 65536 | 0.0645 ± 0.0020 | 0.0652 | 0.0225 ± 0.0020 | 0.0314 |

The control is θ = 1, where c's p-component is trivial and κ = 5. There QR = 0.0444, NR = 0.0458 at P = 256, and 0.0792 vs 0.0795 at P = 4096: uniform, as Lemma R predicts.

At P = 4096 the non-residue classes carry essentially no exceptional mass and the residue classes carry twice the average. At P = 65536 the non-residue classes regain mass from the 2-power types: χ_{π₁₃}³(2) = (2/13) = −1, so π₁₃ is not a prime for which complete cancellation holds.

---

## 8. Proposition E′: the signal vanishes on exactly the anti-coherent classes

### 8.1 The high side of the class-restricted probe

Insert 1_{m≡x (π_p)} into (6.1) and write b∗ = π_p b′. In §7.1 the m-Poisson coefficient involves g_{wχ_A}(b∗A, k) with k = (H − b∗Ad)/s ≡ H\overline{s} mod π_p. By CRT, with m₀ = b′A·x′ + π_pA·y + π_pb′·z,

  g_{wχ_A}(b∗A, k) = [Σ_{x′} w_p(b′Ax′)e(x′k/π_p)] · ξ′(π_pA)g_{ξ′}(b′,k) · χ_A(π_pb′)g_{χ_A}(A,k),

and the bracket equals ξ_p(x)·e(x\overline{b′A}k/π_p) for w_p = ξ_p1_x. This was checked numerically to 3.5·10⁻¹⁴ (`tmp/beat78-prop152-restrict-crt.py`). The original bracket is ξ_p(b′A)\overline{ξ_p}(k)g(ξ_p).

* **Frequencies with p ∤ H.** Expand e(·) into multiplicative characters ψ mod π_p. The s-series acquires ψ\overline{ξ_p}, so only ψ = ξ_p gives a pole at w = 1. The resulting term is uniform in x and equals the original signal divided by (q_p − 1): its S-factor is √q_{b∗}/(q_p−1).
* **New frequencies p | H.** These are absent in the original, where the primitive ξ_p kills them.
  * Only u = π_p³ (with a allowed to contain π_p) gives a pole. Its s-character is χ_s(π_p³)\overline{ξ_p}(s) = R(π_p,s).
  * Its A-character is R(π_p,A), so it carries a signal for η·R(π_p,·).
  * Its S-factor is ξ_p(x)·ξ_p(b′)·ξ′(π_p)³·√q_{b′}/τ_p. The factor ξ_p(b′) is left over from the CRT splitting of τ, and ξ′(π_p)³ comes from the b′-Gauss sums at H = π_p³a⁶.
  * The row weight q_{π_p³}^{−1/6}Σ_k q_p^{−k} = q_p^{−1/2}/(1 − q_p^{−1}) makes its relative size exactly 1.
  * When R(π_p,·) ≡ 1, the good-prime correction factors of this row coincide with those of u = 1, because ξ_p² = 1.

So for R(π_p,·) ≡ 1, the signal of the restricted probe on class x is

  f_η·(c_S/(q_p − 1))·(1 + τ_p s_H χ_p³(x)),  s_H := χ_p³(b′)·Π_{p′∈S, p′≠p} ξ_{p′}³(π_p).   (8.1)

### 8.2 s_H = c_L

* c_L = χ_p³(e₀^{(p-free)}) = χ_p³(b′)·χ_p³(e_ξ^{(p-free)}).
* At an odd p′ ≠ p, \overline{ξ_{p′}} = χ_{p′}^{v_{p′}(e_ξ)}. So ξ_{p′}³(π_p) = (π_p/π_{p′})₂^{v} and χ_p³(π_{p′}^{v}) = (π_{p′}/π_p)₂^{v}.
* These agree by quadratic reciprocity, whose sign R(π_p,π_{p′}) is 1.
* The places over 2 and 3 contribute 1 on both sides.
  * In s_H: ξ_λ(π_p) = 1 because π_p ≡ 1 mod λ, and ξ₂³ = 1 because (O/2)^× has order 3.
  * In c_L: let e₂₃ be the {2,3}-part of e_ξ. It satisfies χ_•(e₂₃) = \overline{ξ_λ ξ₂}·Π_{p′} R(π_{p′},·)^{−v_{p′}}. Here ξ_λ is trivial on primary elements, ξ₂ lives mod 2, and each R(π_{p′},·) is a T-character. So χ_•(e₂₃) is T-measurable, hence e₂₃ ∈ E_T′, and χ_p³(e₂₃) = 1 by the hypothesis of Lemma R.

Hence s_H = c_L, and (7.1) and (8.1) vanish on the same classes.

### 8.3 Complete cancellation forces R(π_p,·) ≡ 1

Take T to be the ray classes mod 12 on primary elements, the coarsest admissible choice since R must factor through T. Then:
* E_T′ = ⟨−1, λ³, 4⟩ modulo sixth powers: 12 classes, found by direct search.
* For all 414 primes π_p of norm < 3000:

  χ_p³ trivial on E_T′  ⟺  R(π_p,·) ≡ 1  ⟺  π_p ≡ 1, ω, ω² mod 4

  (`tmp/beat78-prop152-restrict-duality.py`, 414/414).

How far this is proved:
* R(π_p,·) is a function of π_p mod 4 by Lemma 4.4.
* χ_p³(−1) = (−1)^{(q_p−1)/2} is a function of π_p mod 4 because q_p is.
* χ_p³(4) = 1.
* For χ_p³(λ³) = (λ/π_p)₂, the product formula for Hilbert symbols gives (λ/π_p)₂ = (λ,π_p)₂. The λ-adic symbol is 1 because π_p ≡ 1 mod λ. That makes (λ/π_p)₂ a function of π_p modulo a power of 2. That the power 4 already suffices was observed on all 414 primes, not proved.
* All twelve primary classes mod 4 occur among the tested primes, and both conditions agree on every one of them.

A finer T enlarges E_T′ and only strengthens the hypothesis. With E_T′ = ⟨ζ, λ, 2⟩, all 22 qualifying primes below 1500 also have R ≡ 1. The structural reason is local Hilbert-symbol duality at 2 and 3 together with the product formula; this was not written out [HEURISTIC].

### 8.4 Conclusion of the class route

* Complete removal of the exceptional term on a class restricted at p requires p to satisfy the hypothesis of Lemma R. That forces R(π_p,·) ≡ 1, and then (8.1) vanishes on exactly those classes.
* If R(π_p,·) ≢ 1, χ_p³ is nontrivial on E_T′. Lemma R then gives only a constant-factor reduction, while the signal stays uniform.
* In neither case does the exponent change.
* Restrictions at several S-primes multiply the local factors and change nothing.
* At good primes the coefficient has no p-component (κ = 5), so the coherent mass is uniform over classes. The θ = 1 control confirms this.

**Remark (principal ξ_p).** The paper requires ξ_p nonprincipal. If ξ_p were principal (κ = 0), then:
* *Low side.* The p-adic factor would be −q^{1/6}/(q−1) + Σ_{k≥1}q^{(1−6k)/6} = 0 on every unit class.
* *High side.* The S-factor of the signal would be −1 + (q−1)Σ_{k≥1}q^{−k} = 0.

Both vanish identically (checked for q = 7, 13, 193). This is why the probe needs a primitive ξ, and it is the same duality.

---

## 9. High-side rows and Framework A

**Proposition E [PROVED].**
* The high-side "sixth-power frequencies" are the a-sum Σ_a q_a^{−6z} = ζ_F^S(6z).
* Its pole at z = 1/6 produces the factor X^{1/3}Z^{h/6} in Z^{C(s)} (Lemma 10.5), with the constant c_S ∝ M(1/6) = ∫W̃₀(r)r^{−5/6}dr > 0 (7.2).
* Excluding frequencies with a ≠ 1 removes the z-pole. The signal exponent drops by h/6, and the continuation criterion then needs σ₀ ≥ 1 + b/12.
* The positivity functional of the m-weight is the |x|^{−1/3}-moment on both sides: M(1/6) on the high side, ∫ψ|x|^{−1/3} on the low side.

**Proposition F [PROVED].** In the 11/12 paper's amplification (3.2), |A₁|² ≤ (2/J)Σ_p|A_{p⁶}|² + O(D²/Y²). The same holds for Lemma 17.6, whose rows u·a⁶ give slope 5/6. Restricting the rows to avoid sixth powers sets J = 1, which leaves only the trivial bound. Lemma A of `beat78-amplifier.md` already shows that p⁶ amplification is optimal among mean-square arguments.

---

## 10. Exponent chain [EXACT]

`tmp/beat78-prop152-restrict-exponents.py` (sympy rationals, plus Arb for E7):

* **E1.** σ₀ = 1 − h/6 + ηb/12 = 5/6 + M/12 − ℓ/6 − (1−η)b/12.
  * Theorem C gives η = 1 for smooth weights.
  * §7–§8 show that no class restriction at an S-prime gives η < 1 while keeping the signal. On classes where η = 0, the signal is 0.
* **E2.** At the paper geometry (17/48, 23/48, 1/6), σ₀ = 7/8. On Lemma 15.1's boundary 2M = 1 + 4ℓ the low side is identically 7/8.
* **E3.** Take a thin row set of density Z^{−ρ}. The A-norm shrinks by Z^{−ρ} with the same exceptional/diagonal ratio, and the principal Poisson coefficient shrinks by Z^{−ρ}. The required σ₀ rises by ρ/2 if Lemma 15.1 is not re-proved on the subset, and by 0 if it is. It never falls.
* **E4.** Shrinking the row ball is the change of geometry l_x → l_x − κ. σ₀ = 5/6 + M′/12 − ℓ/6 under the same range 2M′ ≥ 1 + 4ℓ, so the minimum is still 7/8.
* **E5.** Removing the term entirely at the paper geometry would give 83/96. This is not reachable by Strategy 3; for reference the earlier full-removal model value was ≈ 0.8635.
* **E7.** π^{2/3}Γ(1/6)/Γ(5/6) = [10.57764763509 ± 5·10⁻¹⁴] > 0 and πΓ(5/6) = [3.54618904063 ± 3·10⁻¹⁵] > 0.

θ′ = 7/8; no change. No endpoint certificate is produced because no inequality of Part II changed.

---

## 11. Structural reading and what a successful restructuring would need

### 11.1 The exceptional term is the signal-carrying component [HEURISTIC]

The coherent part of A_m is the Kubota–Patterson residue of the s-sum of sextic Gauss sums. The Dirichlet series Σ_s g₆(m,s)N(s)^{−w} has its pole at w = 7/6. This gives A_m ≈ c·τ₆(m)·Y′^{−1/3}. The mean square of the sextic theta coefficients over q_m ≤ Q is ≍ Q^{5/6}, which reproduces (Q/Y′)P_a^{1/6} = Q^{5/6}Y′^{−2/3} exactly.

This reading is consistent with:
* the absence of row concentration (§4.1, kurtosis ≈ 2);
* the equidistribution of the coherent mass over every Poisson-compatible row set (§6);
* the local factors of §7–§8.

Every local computation above fits the form signal(x) ∝ a_p(x)·b_p(x) with coherent mass ∝ |a_p(x)|². Killing the coherent component kills the signal.

### 11.2 Why b cancels in σ₀ [HEURISTIC]

Raising b at fixed M lowers l_x by δ/2. The signal exponent then changes by −δ/4 + δ/12 = −δ/6. The coherent norm (P_a^{1/12} = Z^{b/12}) changes the low bound by −δ/4 + δ/12 = −δ/6 as well. The part of the signal gained from the asymmetry is carried by the coherent component, and Cauchy–Schwarz pays for that component's norm.

### 11.3 What is left

Any route below 7/8 through Prop 15.2 must avoid estimating ⟨A, B⟩ through ‖A‖.

1. **Separate the pairing.** Split A = A^{coh} + A^{rest}. Evaluate ⟨A^{coh}, B⟩ explicitly as the signal plus a remainder, through the theta and Kubota–Patterson structure (Strategy 1, the subtraction route). Bound only ⟨A^{rest}, B⟩ by Cauchy–Schwarz.
   * Lemma R and the C = 1 coherent formula show that A^{rest} has no P_a^{1/6} term.
   * The open problem is the explicit evaluation of ⟨A^{coh}, B⟩ with an error below Z^{C(β∗)}. That needs the sextic theta coefficients at squarefree indices, which are unknown for n = 6 (Kazhdan–Patterson non-uniqueness), or a way to avoid them.
2. **Higher moments or Hölder on B** (Strategy 2). These must exploit the misalignment between B and A^{coh}.
3. **A different probe.** For example, change Lemma 15.1's range or the high-side row counts, which are the other inputs to 7/8 (`beat78-meansquare.md`).

---

## 12. Verified vs unverified

**Verified:**
* Theorem A (complete proof).
* Lemma K (standard; proof given).
* Theorem B (proof from Lemmas 4.1, 4.4, 13.3; inputs confirmed numerically by T2, T4, T4b).
* Theorem C (proof written out relative to the paper's Prop 15.2 estimates).
* Proposition D (relative to Lemma 7.1 and §10.1; twist table).
* The p-local identity (7.1) and its numerical confirmation.
* The CRT factorisation of the class-restricted Gauss sum.
* The relation s_H = c_L via quadratic reciprocity under R(π_p,·) ≡ 1.
* The 414/414 equivalence check.
* Propositions E and F.
* The exact bookkeeping E1–E7.
* Self-tests T1–T6.

**Unverified or heuristic:**
* The general implication "χ_p³ trivial on E_T′ ⇒ R(π_p,·) ≡ 1". It is checked on all twelve classes mod 4 through primes of norm < 3000; the local Hilbert-symbol proof is not written out.
* The remainder bounds in Lemma R and Theorem C are written at the paper's level of detail; the paper's own estimates are used as stated.
* Weights that are nonzero on m ≡ 0 mod p, other than the principal-ξ_p case, are covered only by the general duality, which is a conjecture.
* The Kubota–Patterson reading (§11.1).
* The whole 7/8 paper is unrefereed.

---

## 13. Reproduction

All in `tmp/`, run with `.venv-arb/bin/python` from the repository root.

* `beat78-prop152-restrict-core.py`: Z[ω] arithmetic, sextic symbol tables, Gauss sums (library).
* `beat78-prop152-restrict-selftest.py`: tests T1–T6, about 8 s. Log: `…-selftest.log`.
* `beat78-prop152-restrict-toy.py Y P0 θ NROWS P1,P2,… [tag] [full|coh|none] [classscan]`: the finite model.
  * Logs `…-toy-A-P01.log` (P₀ = 1), `…-toy-C-P050.log` (P₀ = 50, restrictions), `…-toy-B-th*.log` and `…-toy-D-th*.log` (twists), `…-toy-E-th{1,3}.log` (class scans).
  * One P value takes about 15 s at 200 000 rows.
* `beat78-prop152-restrict-classpred.py 20000 3 256,4096,65536`: exact class-restricted prediction (§7.3).
* `beat78-prop152-restrict-crt.py`: CRT factorisation and the principal-ξ_p cancellation (§8.1, §8.4).
* `beat78-prop152-restrict-duality.py`: the 414-prime equivalence (§8.3).
* `beat78-prop152-restrict-exponents.py`: exact bookkeeping E1–E7 (§10).
* `beat78-prop152-restrict-runs{,2,3}.sh`: the sequential background batches used for the logs.
