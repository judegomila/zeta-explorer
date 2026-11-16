# r2-tro6-polar-theorem: the polar law for sextic-character twists of the sextic theta coefficients

2026-11-16. Scope: `tmp/research-2026-11-16/push/r2-tro6-polar-theorem/` only. Nothing committed or pushed.
Not refereed.

**Verdict: partial result.** The polar law of `tro6-spectral` §3 / `tro6-numerics` item 2 is now a statement with a
proof (Theorem P), an explicit constant, an explicit class matrix, and a remainder O(Q^{−A}) for N(c) ≤ Q^{1/2−δ}.
The proof does not use metaplectic theory beyond Theorem A of `sextic-theta-proof.md`: it is Poisson summation in the
row variable followed by Hecke L-functions of sextic residue characters in the modulus variable. The law is
zero-independent. **No η > 0 is proved. θ stays 7/8 (unrefereed manuscript). RH open. NO QED.**

Three findings change earlier notes:

1. **The stored coefficients are far from their limit in first moments.** The stored ρ̂ (`tro6-numerics`,
   `tmp/sextic`) is an estimator with moduli N(n) ≤ 10⁷. Its twisted row sums follow a finite-cutoff form of the law,
   which matches the data to 1–3% with no fitted parameter (§5). At cutoff ∞ the amplitudes differ by factors up to
   3.6 in the resonant class.
2. **The referee's involution is σ′(c) = class of −c mod 4, and at cutoff ∞ it is not a replacement of class(c).** On
   rows prime to 6 the classes class(c) and class(−c) carry equal modulus and opposite sign (Theorem P(b)). At the
   estimator's cutoff the two leading λ-adic terms cancel in class(c) and add in class(−c). This is what E1 of
   `tro6-numerics/REFEREE.md` measured.
3. **The proved range does not reach the manuscript rows.** The law holds for N(c) ≤ Q^{1/2−δ}; the rows live at
   N(c) ≍ Q^{7/5}. Relative to the 7/8 manuscript the polar part of the theta–row form is below Cauchy–Schwarz by
   Z^{−1/48}. TRO6^♮(η) is then equivalent to the same bound for the remainder alone (§4). Statement (S) of
   `tro6-spectral` (polar parts = the manuscript's signal) is not supported by this bookkeeping.

Labels: PROVED / PROVED-rel X / CLASSICAL / EXACT (exact-symbol numerical check) / MEASURED / HEURISTIC / OPEN.

---

## 0. Plan; what is new against the atlas, the walls and the sibling notes

* Atlas (PR #27 `historical-routes.md`): no entry on twisted sums of θ₆; `sextic-theta-proof.md` lists them as gap G3
  ("no estimate, no written Voronoi formula"). Sibling notes measured the law and derived it heuristically from the
  cusp constant term (`tro6-spectral`) or from the residue of an approximate functional equation (`tro6-numerics`).
  Neither computed K, the class dependence, or a remainder.
* New here: Lemma F (exact finite Fourier transform, brute-force checked), Theorem P with K₀ and A(σ, τ) in closed
  form, the remainder bound, the vanishing for χ_c^k (k = 2, …, 5), the finite-cutoff form and its check against all
  stored rows, the character expansion of the weight (§3), and the exact reformulation of TRO6^♮ (§4).
* Walls. The law concerns θ₆ alone and contains no target: nothing in it has to fail for Davenport–Heilbronn (§6).
  MV-CAP, flow-blindness and verified height are not engaged (no statement about zeros is made).

## 1. Setting

Notation of `sextic-theta-proof.md` §1 in the toy normalisation of the stored data: F = Q(√−3), O = Z[ω], λ = √−3,
e(z) = exp(2πi Tr(z/λ)), S = S₀ = {2, λ}, primary = ≡ 1 mod 3, χ_s the sextic symbol (zero-extended, defined for all
primary s prime to 6), g̃(y, s) = N(s)^{−1/2}Σ_{d mod s}χ_s(d)e(yd/s), γ₁(c) = g̃(1, c). T = (O/4)^× (12 classes; σ, τ
denote classes; [c] is the class of c). e₀ = −2λ⁵. R(·,·) is the reciprocity bicharacter of manuscript Lemma 4.4:
χ_a(b) = R(b, a)χ_b(a).

  D_σ(y; u) = Σ_{s∈σ} g̃(y, s)N(s)^{−u},   ρ^♮_σ(y) = (3/2)Res_{u=2/3}D_σ(y; u).

For W ∈ C_c^∞(0, ∞), Ŵ(w) = ∫W(t)t^{w−1}dt. For a function ψ on O that is periodic modulo a power of 2λ:

  T_σ(c; ψ, k) := Σ_{m≠0} ψ(m)W(N(m)/Q)χ_c(m)^kρ^♮_σ(−e₀m),   c squarefree, primary, prime to 6.

Constants: r_F = Res_{s=1}ζ_F(s) = π/(3√3), ζ_F(2) = ζ(2)L(2, χ_{−3}) = 1.285190…,

  **K₀ = √3·(3/4)^{1/6}·π^{8/3}·Γ(1/6) / (6480·Γ(5/6)·ζ_F(2)) = 0.0206959.**

Class data (EXACT table, `supp.py`): on primary s prime to 6,
* χ_s(−1) depends on s mod 4; χ_s(ω) on s mod 9; χ_s(2) on s mod 8 (not mod 4); χ_s(λ) on s mod 4 and mod 9;
* the S₀-units ε for which s ↦ χ_s(ε) depends on s mod 4 only are exactly **E₀ = {±4^iλ^{3j}}·(sixth powers)**
  (12 of the 216 classes of units modulo sixth powers);
* as characters of T = ⟨ω⟩ × ⟨−1⟩ × ⟨λ⟩, with θ_{(a,b,c)}(ω^i(−1)^jλ^k) = ζ₃^{ai}(−1)^{bj+ck}:
  χ_•(4) = θ_{(1,0,0)}, χ_•(−1) = θ_{(0,0,1)}, χ_•(λ³) = θ_{(0,1,1)};
* R(a, a)χ_a(−1) = 1 (551 primes; manuscript line 8116 states the same).

For classes σ, τ put z₄ = χ_σ(4)·conj χ_τ(4) ∈ μ₃, z_λ = χ_σ(λ³)χ_τ(λ³) = ±1, y = 4^{−1/3}z₄, and

  A(σ, τ)  = R(σ, τ)χ_τ(−1)(1 + χ_σ(−1)χ_τ(−1)) · 4^{−1/6}/(1 − y) · z_λ3^{−1/3}/(1 − z_λ3^{−1/2}),
  A₆(σ, τ) = R(σ, τ)χ_τ(−1)(1 + χ_σ(−1)χ_τ(−1)) · 4^{−1/6}(4y − 1)/(4y(1 − y)) · z_λ3^{−1/3}.

Values: |A| ∈ {0, 0.4901, 1.8292, 1.8857, 7.0375}; |A₆| ∈ {0, 0.9639, 1.7940}; A(τ, τ) = 7.0375 > 0.

## 2. Theorem P

> **Theorem P** [PROVED-rel (i) Theorem A of `sextic-theta-proof.md` (itself PROVED-rel Bröker–Hoffstein Thm 2.4,
> (3.1), (3.10)), (ii) manuscript Lemma 4.4, (iii) the supplementary laws above (CLASSICAL in form; the moduli 4, 8, 9
> are EXACT-checked on 551 primes, not re-derived). Steps 1–3 are complete and EXACT-checked; Steps 4–6 are standard
> contour arguments written in outline.]
> Let δ > 0, A > 0, c squarefree primary prime to 6 with N(c) ≤ Q^{1/2−δ}, σ ∈ T. Then
>
> (a) T_σ(c; 1, 1) = K₀·A(σ, [c])·γ₁(c)·conj χ_c(−e₀)·N(c)^{−1/3}·(φ(c)/N(c))·Ŵ(5/6)·Q^{5/6} + O_{A,δ,W}(Q^{−A});
>
> (b) the same with ψ = 1_{(m,6)=1} and A₆ in place of A;
>
> (c) T_σ(c; ψ, k) = O_{A,δ,W}(Q^{−A}) for k ∈ {2, 3, 4, 5} and c ≠ 1, for both ψ.

So in the notation of the task: u_c = γ₁(c)conj χ_c(−e₀), K = K₀A(σ, [c])φ(c)/N(c), exponent −1/3 up to the factor
φ(c)/N(c), one sign of the sextic twist only, R(c) = O(Q^{−A}) in the stated range. The polar term is the residue
at w = 5/6 of Σ_mρ^♮_σ(−e₀m)χ_c(m)N(m)^{−w}; in the proof it appears as the double residue at (u, w) = (2/3, 5/6) on
the line u + w = 3/2, the image of the diagonal pole w = 1 under the Poisson step.

### Proof

**Step 0 (reduction to finite sums)** [PROVED-rel Theorem A]. Put U(s) := Σ_mψ(m)W(N(m)/Q)χ_c(m)^kg̃(−e₀m, s). For
W₁ ∈ C_c^∞(0, ∞) with Ŵ₁(1/6) ≠ 0 and X ≥ 1,

  L_X := X^{−1}Σ_{s∈σ}W₁(N(s)/X)(N(s)/X)^{−1/2}U(s) = (2/3)Ŵ₁(1/6)X^{−1/3}·T_σ(c; ψ, k) + O(X^{−1/2+ε}Q^{1+ε}).   (2.1)

This is steps 1–3 of Cor A.6 for each m (Mellin inversion, shift to Re w = 1/2 + ε, one simple pole at w = 2/3),
summed over m with Cauchy–Schwarz and (MV). So T is determined by L_X for one X = Q^{B}, B large.

**Step 1 (Poisson in m)** [PROVED]. The function f_s(r) = ψ(r)χ_c(r)^kg̃(−e₀r, s) has period L = M₀·lcm(s, c)
(M₀ the period of ψ). The lattice LO has dual L^{−1}O for the pairing Tr(xξ/λ), and covolume (√3/2)N(L). Hence

  U(s) = (2/√3)·Q·Σ_{n∈O} f̌_s(n)·Φ(4QN(n)/(3N(L))),   f̌_s(n) = N(L)^{−1}Σ_{r mod L}f_s(r)e(rn/L),

  Φ(x) = π∫₀^∞W(t)J₀(2π√(tx))dt,   Φ̃(z) := ∫₀^∞Φ(x)x^{z−1}dx = π^{1−2z}·(Γ(z)/Γ(1−z))·Ŵ(1−z)  (Re z > 0).

**Step 2 (Lemma F: the finite Fourier transform)** [PROVED from Lemma A.1(a), (e) and Lemma 4.4; EXACT:
`lemmaF_check.py`, 90 brute-force comparisons, max error 2.2·10⁻¹¹, 0 failures]. Take ψ = 1, k = 1.
* (F1) (s, c) = 1 (s need not be squarefree):
  f̌_s(n) = N(sc)^{−1/2}·γ₁(c)·R(s, c)·conj χ_c(n)·χ_s(n)·conj χ_s(e₀).
* (F2) s = δs′ with δ | c, δ ≠ 1, c = δc′, (s′, c) = 1:
  f̌_s(n) = N(s′c′)^{−1/2}N(δ)^{−1}r_δ(n)·γ₁(c)·conj χ_δ(c′)conj χ_δ(−e₀)conj χ_{c′}(n)·R(s′, c′)·χ_{s′}(n)conj χ_{s′}(e₀)χ_δ(s′),
  with r_δ the Ramanujan sum. As a function of s′ this is χ_{s′}(nδ/e₀)R(s′, c) times a factor independent of s′.
* (F3) p² | s for some p | c: f_s ≡ 0.

*Proof.* r ↦ g̃(−e₀r, p^k) is the Fourier transform of χ_p^k, so its transform at n is N(p)^{−k/2}χ_p^k(n/e₀). The
c-part is a Gauss sum. For p | (s, c) and v_p(s) = 1, χ_p(r)g̃(−e₀r, p) = conj χ_p(−e₀)γ₁(p)1_{p∤r}, whose transform
is a Ramanujan sum. For v_p(s) ≥ 2, g̃(−e₀r, p^k) = 0 unless p | r (A.1(a)) and then χ_p(r) = 0. The cross factors are
A.1(e), the Chinese remainder theorem, and χ_c(s)conj χ_s(c) = R(s, c). ∎

For ψ = 1_{(m,6)=1} the frequency is n/(2λ·lcm(s, c)) and the formulas hold with n replaced by n′ = n/(2λ) and the
extra weight w₂(v₂(n′))·w_λ(v_λ(n′)): w₂ = 3/4, w_λ = 2/3 for valuation ≥ 0; −1/4, −1/3 for valuation −1. For
χ_c^k the same computation gives the s′-character χ_{s′}(n·c′^{k−1}δ^{k}/e₀)R^k with support (n, c′) = 1, and
(n, δ) = 1 when k ≠ 1.

**Step 3 (which frequencies are resonant)** [CLASSICAL + EXACT table]. Write a nonzero a ∈ F as a = υ2^iλ^ja₁ with υ
a unit and a₁ primary prime to 6. Then χ_s(a) = χ_s(υ)χ_s(2)^iχ_s(λ)^j·R(a₁, s)χ_{a₁}(s). So s ↦ 1_{s∈σ}χ_s(a) is
(1/12)Σ_ϑconj ϑ(σ)·(Hecke character of conductor dividing 72·rad(a₁)), ϑ over the characters of T. One of the twelve
is principal iff a₁ is a sixth power and υ2^iλ^j ∈ E₀·(sixth powers); then the constant is χ_σ(υ2^iλ^j)/12.
Consequences:
* k = 1, (s, c) = 1: resonant n are n = e₀εj⁶, ε ∈ E₀, (j, 6c) = 1; in O this means n = ±2^Aλ^Bj⁶ with A ≥ 1 odd and
  B ≥ 2, B ≡ 2 mod 3 (A, B ≥ −1 with the weights w₂, w_λ for rows prime to 6).
* k = 1, s = δs′: resonant n are n = e₀εδ⁵j⁶, (j, 6c′) = 1.
* k ∈ {2, …, 5}, c ≠ 1: v_p(n·c′^{k−1}δ^k) ∈ {k − 1, k} at a prime p | c, never ≡ 0 mod 6. No resonant frequency.

**Step 4 (resonant part)** [PROVED-rel, outline]. Insert Mellin inversion for W₁ and Φ in L_X. For δ = 1:

  L_X^{res} = (2Q/√3)N(c)^{−1/2}γ₁(c)R(σ, c)Σ_ε χ_σ(ε)conj χ_c(e₀ε)·X^{−1}(2πi)^{−2}∬Ŵ₁(w − 1/2)Φ̃(z)X^w(4QN(e₀ε)/(3N(c)))^{−z}
       · Σ_{(j,6c)=1}N(j)^{−6z}·[(1/12)ζ_F^{(6cj)}(w + 1/2 − z) + entire] dz dw,

on Re z = η ∈ (1/6, 1/4), Re w = 3. Shift w to Re w = 1/2 + ε: one pole, at w = 1/2 + z, with residue
(r_F/24)(φ(cj)/N(cj))·Ŵ₁(z)X^{z−1/2}. Then Σ_{(j,6c)=1}N(j)^{−6z}φ(j)/N(j) = ζ_F(6z)/ζ_F(6z+1)·Π_{p|6c}(…), and shifting z to
Re z = ε crosses only z = 1/6 (ζ_F(6z + 1) ≠ 0 on Re z ≥ 0), with residue (r_F/(10ζ_F(2)))Π_{p|c}(1 + 1/N(p))^{−1}. All
remaining integrals are O(X^{−1/2+ε}(QN(c))^{O(1)}). The residue is the X^{−1/3} term. For δ ≠ 1 the same computation gives
the δ = 1 term times N(δ)^{−1}·R(δ, δ)χ_δ(−1) = N(δ)^{−1}, and Σ_{δ|c}N(δ)^{−1} = Π_{p|c}(1 + 1/N(p)) cancels the product
above. With conj χ_c(e₀ε) = conj χ_c(−e₀)·conj χ_{[c]}(−ε) (ε ∈ E₀), the sum over ε = ±4^iλ^{3j} is the two geometric
series in A(σ, [c]). Comparing with (2.1):

  T = (3/2)(2/√3)·Φ̃(1/6)(4/3)^{−1/6}·(r_F/24)(r_F/(10ζ_F(2)))·A(σ, [c])·γ₁(c)conj χ_c(−e₀)N(c)^{−1/3}(φ(c)/N(c))Q^{5/6} + …,

and Φ̃(1/6) = π^{2/3}(Γ(1/6)/Γ(5/6))Ŵ(5/6) gives K₀. [EXACT numerics for this step: `limit_check.py` evaluates the
resonant sum at modulus length Y = X/Q and compares with K₀Ŵ(5/6)A(σ, 1): relative deviation 0.25, 0.064, 0.0068,
0.0008, 0.00016 at Y = 10⁴, 10⁷, 10¹⁰, 10¹³, 10¹⁶ (all rows); 0.73, 0.17, 0.018, 0.0021, 0.0006 (rows prime to 6).]

**Step 5 (non-resonant part)** [PROVED-rel, outline]. For a non-resonant n the s′-sum is a smooth sum of length
X/N(δ) of a non-principal Hecke character, restricted to (s′, c′) = 1. Its L-function is entire; with the Euler
factors at c′ and at the primes of n its size on Re v = −A is ≪ (N(n)N(δ)N(c′))^{1/2+A}. Φ restricts to
N(n) ≤ N(s′c)Q^{ε−1}. So each such n contributes ≪ X^{O(1)}·(N(c)²Q^{ε−1})^{A}, and there are X^{O(1)} of them.

**Step 6.** Take X = Q^{B} with B large in terms of the target exponent, then A large in terms of B and δ. ∎

*Remarks.*
* The condition N(c)² ≤ Q^{1−2δ} is the conductor condition: the dual length is N(c)²/Q. For Q^{1/2} < N(c) the
  non-resonant frequencies are a dual sum of that length and R(c) is not small (§5: the residual grows from 0.25 to
  0.71 against a null of 1.0 as N(c) goes from 30 to 400 at Q = 3199).
* S′ ≠ ∅ and the manuscript's weight ξ(m) with coefficient χ_s(b*)/ξ(s) [HEURISTIC; conventions of subtract-note
  Lemma 2.2 not re-derived]: the frequency is prime to S, the factor χ_s(b*)/ξ(s) cancels the s-characters created
  by b* and ξ, and the resonant frequencies are n = ±j⁶ only. The law keeps the shape
  (constant)·γ₁(c)·(finite-order character of c)·N(c)^{−1/3}φ(c)/N(c)·Q^{5/6} with a single S-local term instead of the
  geometric series. Not checked against data (the stored rows carry no ξ and S′ = ∅).

## 3. The row weight and its expansion over characters mod 4 [PROVED-rel Theorem P and (4.7); EXACT: `gexp.py`]

* G on the 12 classes takes the values 1, ±i, and primitive 3rd, 12th roots of unity; G(vw) = G(v)G(w)R(v, w) holds on
  all 144 pairs (defect 2.6·10⁻¹¹); G is not multiplicative. Its expansion has four terms of modulus 1/2:
  **G = ½θ_{(2,0,0)} + ½θ_{(2,0,1)} + (i/2)θ_{(2,1,0)} − (i/2)θ_{(2,1,1)}**, and G² = θ_{(1,0,1)} is a character.
* A row with n = 1 part B_m = Σ_cβ(c)γ₂(c)χ_c(m) pairs with the theta coefficients as Σ_cβ(c)γ₂(c)T_σ(c). By (4.7),
  γ₂γ₁ = μαG. With β(c) = α(c)ν(c)N(c)^{−1/2−t} (one character ν = ν_σθ of the manuscript's expansion) the polar
  part is

    𝔅_P(t) = K₀Ŵ(5/6)Q^{5/6}·Σ_{c sf}μ(c)·α²(c)ν(c)·ω₀(c)·[G(c)A(σ, [c])]·N(c)^{−5/6−t}φ(c)/N(c),

  where ω₀(c) := conj χ_c(−e₀) is a Hecke character of conductor dividing 72 (not a class function mod 4: χ_c(2)
  depends on c mod 8). The bracket is a function on T. Expanding it, G(τ)A(σ, τ) = Σ_ϑb_ϑ(σ)ϑ(τ):

    **𝔅_P(t) = K₀Ŵ(5/6)Q^{5/6}·Σ_ϑ b_ϑ(σ)·E(5/6 + t, χ_ϑ)/L^{(6)}(5/6 + t, χ_ϑ),   χ_ϑ = α²·ν·ω₀·ϑ,**

  E(s, χ) = Π_{p∤6}(1 + χ(p)N(p)^{−s−1}/(1 − χ(p)N(p)^{−s})), holomorphic and bounded in Re s ≥ 1/2.
* Number of nonzero b_ϑ(σ): 12 for all rows (values 0.25–1.10 at σ = [1]); 4 for rows prime to 6
  (ϑ = θ_{(1,1,0)}, θ_{(1,1,1)}: 0.347; θ_{(2,1,0)}, θ_{(2,1,1)}: 0.550).
* The manuscript's full row sums ν_σθ over θ with the coefficients a_θ of G, so its weight is μα²G²ν_σ: G² is a
  character and the expansion is that of τ ↦ G(τ)²A(σ, τ) (same counts: 12 and 4). Corollary L′ of `tro6-period`
  is correct for the full row and wrong per θ; the referee's Ψ = α²Gν is the per-θ weight.
* So the polar part is a finite combination of 1/L over at most 12 twists of α²ν by characters of conductor dividing
  72, as the referee of `tro6-period` stated, with explicit coefficients.

## 4. The remainder, and the bound equivalent to TRO6^♮(η)

Define P_σ(c) as the main term of Theorem P(a) for **every** c, and R_σ(c) := T_σ(c; 1, 1) − P_σ(c).

**4.1 Proved range** [PROVED-rel Theorem P]. R_σ(c) ≪_A Q^{−A} for N(c) ≤ Q^{1/2−δ}. For rows supported on
N(c) ≤ D ≤ Q^{1/2−δ}: Σ_mW·ρ^♮_σ(−e₀m)B_m = 𝔅_P + O(Q^{−A}‖β‖₁), an asymptotic formula.
* Comparison with `tro6-sieve` Prop S (|𝔅| ≪ Q^{1/3+δ}D^{1/6}‖B‖ for D ≤ Q^{1−2δ}, arbitrary β): Cauchy–Schwarz on
  𝔅_P gives Q^{5/6}‖β‖₂(Σ_{N(c)≤D}N(c)^{−2/3})^{1/2} = Q^{5/6}D^{1/6}‖β‖₂, which is Q^{1/3}D^{1/6}‖B‖ when ‖B‖² ≍ Q‖β‖₂²
  [HEURISTIC for that last relation]. So Prop S is the Cauchy–Schwarz size of the polar term. It is attained by
  β(c)γ₂(c) ∝ conj(u_c), and for a Möbius-type β the polar term is the 1/L sum of §3.

**4.2 The rows are outside the range** [PROVED bookkeeping]. At the paper geometry Q = Z^{5/6} and the n = 1 part of
B^J has N(c) ≍ D = Z^{7/6} = Q^{7/5}, with a log-Gaussian weight that is super-polynomially small at N(c) ≤ Q^{1/2}.
There |P(c)| = Q^{5/6}N(c)^{−1/3} = Q^{0.367} is below the random size Q^{5/12} of T(c). The split T = P + R is then a
definition, not an asymptotic.

**4.3 Size of the polar part** [PROVED-rel §3 and the zero-free region assumed]. Let β₀ be the supremum of the real
parts of the zeros of the L(s, χ_ϑ) of §3. Shifting the t-contour of the row: |𝔅_P| ≪ Q^{5/6}D^{β₀−5/6+ε}. Against
the Cauchy–Schwarz bound M^{1/2}‖B‖ = Q^{11/12}:

  𝔅_P/(M^{1/2}‖B‖) ≪ Z^{(7/6)(β₀ − 25/28) + ε},   25/28 = 0.892857.

With β₀ ≤ 7/8 (the unrefereed manuscript; the χ_ϑ are Hecke characters of F) this is Z^{−1/48+ε}. TRO6^♮(η) asks for
Z^{−η/96}. So the polar part satisfies the TRO6 bound for every η ≤ 1 (up to η = 2), relative to the manuscript.
Unconditionally (β₀ ≤ 1) it does not.

**4.4 The equivalent statement** [PROVED-rel 4.3; for the n = 1 part of the rows, toy normalisation].

> Relative to the zero-free half-plane Re s > 7/8 for Hecke L-functions of F, and for 0 < η ≤ 1:
> TRO6^♮(η) ⟺ **(RB_η)**: |Σ_c μ(c)α(c)²ν(c)G(c)·conj γ₁(c)·a_c·R_σ(c)| ≪ (1+|v|)^{J₀}Z^{−ηb/12+ε}M^♮_σ(cQ)^{1/2}‖B^J‖_Q,
> with a_c the smooth weight of the row (N(c) ≍ Z^{7/6} = Q^{7/5}).
> Without the zero-free input: TRO6^♮(η) ⟺ |𝔅_P + Σ_c(…)R_σ(c)| ≪ (same right side), with 𝔅_P given by §3.

* (RB_η) is not proved for any η > 0. Theorem P gives it only for rows with N(c) ≤ Q^{1/2−δ}.
* What this locates: by Theorem D(ii) the sum 𝔅_P + 𝔅_R carries the signal. By 4.3 the signal is not in 𝔅_P when
  β₀ ≤ 7/8. It is in R_σ(c) at Q^{1/2} ≪ N(c) ≍ Q^{7/5}, i.e. in the dual sum of length N(c)²/Q ≍ Q^{9/5}
  (the Type-I form (3.2) of `tro6-period`). `tro6-spectral` (S) evaluated the polar law at all N(c) ≤ Z^{7/6}; its own
  weight X^{1/3}Z^{x−5/6} equals Z^{x−103/144}, which is Z^{−1/36} below Z^{C(x)} = Z^{x−11/16}. The exponents do not
  match, and the range is not covered. Not reconciled with the manuscript's (7.5) here [OPEN].

## 5. Check against the stored data [MEASURED; no parameter fitted]

Data: `tro6-numerics/rows_full.npz`, `E.npy`, `data/conductors.npz` (11,628 rows, N(m) ≤ 3199; 5,814 prime to 6).
No row was used for fitting: nothing is fitted. Weights W(x) = (1 − x)₊^j, j = 2, 3, for which
Φ(x) = π2^{j+1}j!·J_{j+1}(2π√x)/(2π√x)^{j+1}.

**5.1 The stored coefficient is an estimator at cutoff 10⁷.** ρ̂_σ(m) = Σ_{n∈σ, sf, 10³<N(n)≤10⁷}wt_σ(n)g̃(−e₀m, n) (WLS on
89 shells). Steps 1–3 apply to it verbatim and give the finite-cutoff form

  Σ_mψW·χ_c·ρ̂_σ ≈ γ₁(c)R(σ, c)N(c)^{−1/2}(N(c)/(N(c)+1))·(2Q/√3)·Σ_f w_ψ(f)conj χ_c(f)χ_σ(f/e₀)·H_σ(4QN(f)/(3N(c))),
  H_σ(κ) = Σ_{n∈σ}wt_σ(n)N(n)^{−1/2}Φ(κ/N(n)),   f = ±2^Aλ^B  (A odd, B ≡ 2 mod 3; j⁶-multiples are out of reach at this cutoff).

**5.2 c = 1** (`finiteX.py`, `finiteX_c1.log`). Six classes with χ_σ(−1) = +1, complex values; Q = 3199, j = 2:

| rows | | class 0 | 1 | 2 = [1] | 8 = [−1] |
|---|---|---|---|---|---|
| all | data ρ^{str} | 12.84+1.77i | −11.59−1.73i | 15.76 | −14.48 |
| all | finite-cutoff form | 12.84+1.73i | −11.58−1.75i | 15.70 | −14.51 |
| all | cutoff ∞ (Theorem P, complete coefficient) | 13.46+5.59i | −3.61−1.50i | 56.08 | −15.03 |
| prime to 6 | data ρ^{str} | 4.35+1.16i | −11.51−7.08i | −5.75 | −13.75 |
| prime to 6 | finite-cutoff form | 4.44+1.14i | −11.57−7.14i | −5.85 | −13.65 |
| prime to 6 | cutoff ∞ | 6.01+4.79i | −6.01−4.79i | 14.30 | −14.30 |

Σ|data − form|/Σ|form| over the six classes: 0.003–0.030 in the 12 runs (rows all / prime to 6; j = 2, 3;
Q = 800, 1600, 3199). The six classes with χ_σ(−1) = −1 vanish in data and in the form.

**5.3 c ≠ 1** (`finiteX_c.py`, `finiteX_c.log`): all 108 squarefree conductors 1 < N(c) ≤ 400, all 12 classes.

| rows, Q, j | N(c) | #c | corr(data, form) | LS amplitude data/form | rms form | rms(data − form) | rms z for k = 1, 2, 3, 4, 5 |
|---|---|---|---|---|---|---|---|
| all, 3199, 2 | 2–30 | 7 | 0.9979 | 0.988 | 4.93 | 0.32 | 4.90, 0.36, 0.36, 0.39, 0.34 |
| | 31–56 | 7 | 0.9979 | 1.006 | 3.78 | 0.25 | 3.71, 0.56, 0.58, 0.63, 0.57 |
| | 57–100 | 14 | 0.9913 | 0.997 | 3.08 | 0.41 | 3.08, 0.69, 0.70, 0.70, 0.62 |
| | 101–200 | 28 | 0.9816 | 0.986 | 2.62 | 0.50 | 2.58, 0.65, 0.74, 0.70, 0.79 |
| | 201–400 | 52 | 0.9462 | 0.955 | 2.14 | 0.71 | 2.12, 0.80, 0.83, 0.78, 0.84 |
| prime to 6, 3199, 2 | 2–30 | 7 | 0.9971 | 0.995 | 2.85 | 0.22 | 4.96, 0.45, 0.34, 0.52, 0.40 |
| | 31–56 | 7 | 0.9972 | 0.984 | 1.96 | 0.15 | 3.33, 0.63, 0.53, 0.57, 0.51 |
| | 57–100 | 14 | 0.9872 | 0.972 | 1.51 | 0.24 | 2.56, 0.62, 0.59, 0.69, 0.53 |
| | 201–400 | 52 | 0.9370 | 0.983 | 0.99 | 0.36 | 1.80, 0.79, 0.75, 0.71, 0.71 |

(z = |S|/null, null = (Σ|Wρ|²)^{1/2} = 1.01 and 0.57 per class.) Q = 1600 and j = 3 give the same picture (log).
* **K:** amplitude ratio 0.97–1.01 for N(c) ≤ 100. The phase γ₁(c)conj χ_c(−e₀), the factor R(σ, c) and the class
  characters are confirmed cell by cell (log lists ten conductors with all six classes).
* **k = 2, …, 5:** at or below the null level at every band (Theorem P(c)).
* **σ′:** mean |S| over N(c) ≤ 100, Q = 3199, j = 2:

  | rows | σ = [c]: data / form | σ = [−c]: data / form | other 4 classes of the block | other block |
  |---|---|---|---|---|
  | all | 9.64 / 9.72 | 4.60 / 4.57 | 2.99 / 2.95 | 0.00 / 0 |
  | prime to 6 | 0.77 / 0.71 | 4.39 / 4.51 | 2.42 / 2.40 | 0.00 / 0 |

  The pairing 0↔1, 2↔8, 3↔11, 4↔10, 5↔9, 6↔7 of `tro6-numerics/REFEREE.md` E1 is multiplication by the class of −1
  (index 8 = (3, 0)): **σ′(c) = [−c]**. Reason: on rows prime to λ the λ-adic sum has the two leading terms
  −(1/3)3^{1/6} (B = −1) and +(2/3)3^{−1/3}z_λ (B = 2). At cutoff 10⁷ later terms are cut, so the sum is ≈ 0.06 for
  z_λ = +1 (σ = [c]) and −0.86 for z_λ = −1 (σ = [−c]). At cutoff ∞ the sum is exactly z_λ3^{−1/3}: equal modulus.
  On all rows the term B = −1 is absent and σ = [c] leads at every cutoff.
* **Exponent in N(c)** (resonant cell, 7 ≤ N(c) ≤ 400, Q = 3199): all rows: data −0.248, finite-cutoff form −0.220;
  rows prime to 6: data −0.312, form −0.317; N(c)^{−1/3}φ(c)/N(c) on the same conductors: −0.323. The shallow
  exponents −0.28 … −0.30 of the sibling notes are a cutoff effect (the number of frequencies kept grows with N(c)),
  plus the factor φ(c)/N(c).
* **Consequence for earlier statistics.** First-moment statistics of the stored ρ̂ (z² tables, resonant class, span
  fractions, aligned-row correlations of `tro6-numerics` §3.3–3.4) describe ρ̂ at cutoff 10⁷, not ρ^♮. Convergence in
  the cutoff is like (Q/X)^{1/3} with large constants (`limit_check.log`). Mean-square statistics are not addressed
  here.

## 6. DH control

Theorem P is a statement about θ₆ and sextic characters. It contains no target and no statement about zeros, so no
step has to fail for a Davenport–Heilbronn combination. Its proof uses multiplicativity of Gauss sums (A.1(e),
reciprocity) and Hecke L-functions of residue characters s ↦ χ_s(a), only through their poles and convexity bounds.
The Euler product of a target enters in §3 alone: Σ_cμ(c)χ(c)N(c)^{−s}φ(c)/N(c) = E(s, χ)/L(s, χ) needs χ completely
multiplicative. The form is linear in the row, so a combination c₁ν₁ + c₂ν₂ gives c₁E/L(ν₁) + c₂E/L(ν₂), not 1/L of
the combination. §4.3 uses a zero-free region as an input and is labelled so.

## 7. Verdict

* PROVED-rel: Theorem P (polar law, K₀, A, A₆, vanishing for k = 2..5, R(c) ≪ Q^{−A} for N(c) ≤ Q^{1/2−δ}); §3
  (character expansion, at most 12 twists); §4.4 (TRO6^♮(η) ⟺ (RB_η) relative to the 7/8 half-plane).
* MEASURED: the finite-cutoff form reproduces 108 conductors × 12 classes of stored twisted sums and the c = 1 first
  moments at 1–3%, including the referee's class effect, with no fitted parameter.
* OPEN: (RB_η) for any η > 0; T_σ(c) for Q^{1/2} < N(c) (the dual range, where the rows are); the manuscript
  normalisation with ξ and S′; reconciliation with (7.5).
* No η > 0. No change to θ or to any Λ value.

## 8. Three weakest steps

1. **Steps 4–6 are in outline.** The contour shifts, the uniformity in n of the smooth weights, the absolute
   convergence that justifies splitting resonant and non-resonant frequencies, and the count N(n)N(δ)N(c′) for the
   effective conductor are standard but not written to the last ε. The supplementary laws are used with moduli read
   from a table of 551 primes (370 of the 432 classes mod (8, 9) occur), not derived. The Poisson step and K₀ are
   supported numerically (§5, `limit_check.py`); the remainder bound O(Q^{−A}) is not tested numerically (the data
   are cutoff-limited and the residual 0.25 at N(c) ≤ 56 is at the estimator-noise level).
2. **§4.3–4.4 bookkeeping.** It covers the n = 1 part of the rows in the toy normalisation, with D = Z^{7/6} and
   ‖B‖² = Q taken from the sibling notes. The n³ part, the slot primes, ξ, S′ and the J ≠ ∅ tuples are not carried.
   The conflict with `tro6-spectral` (S) is stated, not resolved.
3. **Cutoff ∞ values are not observed.** The amplitudes 7.04 (all rows, σ = [c]) and the equal moduli at [c] and
   [−c] on rows prime to 6 are consequences of Theorem P. The data confirm the finite-cutoff form only; at the stored
   cutoff the two differ by factors up to 3.6.

## 9. Reproduction

`PY=.venv-arb/bin/python`, run in this directory, single process, < 2 GB.

| file | content | time |
|---|---|---|
| `supp.py` → `supp.log`, `supp.json` | supplementary laws, E₀, R(p, p)χ_p(−1) = 1 | 5 s |
| `lemmaF_check.py` → `lemmaF_check.log` | Lemma F by direct summation (90 comparisons) | 20 s |
| `gexp.py` → `gexp.log` | G on classes, its expansion, closed forms of A, b_ϑ | 10 s |
| `limit_check.py` → `limit_check.log` | resonant sum → K₀Ŵ(5/6)A as the modulus length grows | 30 s |
| `finiteX.py` → `finiteX_c1.log` | c = 1 first moments against the finite-cutoff form | 4 min |
| `finiteX_c.py` → `finiteX_c.log`, `finiteX_c.json` | 108 conductors × 12 classes, k = 1..5 | 9 min |
| `lib.py` | K₀, class tables, A(σ, τ) | — |

