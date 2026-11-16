# Cubic lever: the conductor exponent of the R2 reflection (derivation 1)

Internal working note, 2026-11-01. Branch `editorial-redesign`. Nothing committed, nothing sent upstream. Not refereed.
This is independent derivation 1; the other derivation file was not read.

Question (from `zf-campaign-synthesis.md` §4 and `src/data/zero-free-campaign-2026-11-01.js`, `nextLever`): in the cubic
lever, the Poisson dual B_y of the cubic Möbius family is reflected by R2, the functional equation of a twisted 6-fold
Kubota series. Its dual length is N(y)^a / D. Referee 1 argued a = 4, referee 2 argued a = 2 (both citing 7/8 Prop 5.1).
At a = 2 the lever gives heuristic counts 8/9 (Framework A) and ≈ 0.807 (Framework B); at a = 4 it is closed.

Labels: **[PROVED]** complete argument here; **[PROVED-rel]** proved relative to a cited theorem used as stated;
**[CITED]** taken from the literature (source and what was actually read are stated); **[EXACT]** exact finite
computation; **[NUMERICAL]** floating-point check of a finite identity or measurement; **[HEURISTIC]** exponent
bookkeeping in a model.

---

## 0. Answer

**a = 4.**

1. B_y is the Kubota series of the conjugate 6-fold symbol at **index class y⁴**, restricted to moduli coprime to y
   (Lemma E, §6). The class is forced: of all Gauss-sum families, only γ₅ = χ(−1)γ̄₁ carries the coefficient class of
   μγ₂, and for that family the cubic twist χ_n(y)^{−2} is the index shift y ↦ y^{−2} ≡ y⁴ (mod sixth powers).
2. The functional equation of a Kubota series at a literal index r has the factor **N(r)^{1/2−u}** (Whittaker
   factor), and the reflected series is at the **same index** r (Theorem R2 / Proposition W, §3).
3. The moduli coprime to y are removed by the transfer lemma (Lemma B, §4). Per prime p | y the reflected series of
   B_y has two pieces (Corollary F, §6):
   * scale **N(p)⁴**, weight 1 (index p⁴);
   * scale **N(p)⁵**, weight **N(p)^{−1/2}** (index p⁰).

   Both cost N(p)⁴/D in mean square. **No piece has scale N(p)².**
4. **Calibration at n = 3.** The same rule reproduces 7/8 Prop 5.1 item 2 for j_p ∈ {0 inactive, 0 active, 2, 4}: the
   scales, the weights (powers of q_p), the supports (the 1_{p|x} of the Ramanujan factor) and the reflected twist
   classes (§5). The rule is: index class e has main scale N(p)^e and a coupling piece at scale N(p)^{n−1} with weight
   N(p)^{−1/2}.
   * j_p = 4 is index class π (e = 1). It has effective scale q_p (the q_p·1_{p|x} part) and a q_p^{−1/2}-weighted
     piece at scale q_p².
   * j_p = 2 is index class π² (e = 2). It has scale q_p², with a character.
5. **The two referee readings.**
   * Referee 1's reading ("index π → N(π), index π² → N(π)²") is the main-piece rule, and it is what Prop 5.1 shows.
   * Referee 2's "q_c² for both j_p" is literally true at n = 3. There q_c² is the **maximal** scale N(p)^{n−1} = N(p)².
     Transported to n = 6, that maximal scale is N(p)⁵, not N(p)².
6. **Why the a = 2 heuristic failed.** It applied the GL(2) index-twist rule ("a twist of conductor h gives N(h)²"). That
   is R1's rule, for index series of theta functions. B_y is a modulus series (Fourier coefficient as a function of the
   spectral variable):
   * its completed form has n − 1 = 5 Gamma factors over K, not 2 (§3);
   * its conductor is the norm of the literal index.

   At n = 3 the two rules agree only because n − 1 = 2 and Patterson's identity makes the theta index series and the
   cubic Kubota modulus series the same Dirichlet series.

**Consequence (model statements, §8).**
* Framework A, model A-V, exact rational evaluation: with the optimal sieve, θ_A = 11/12 − 1/(6a). This equals 7/8 at
  a = 4, a tie. Heath-Brown's c = 2/3 gives θ_A = 1, and no cross exponent c gives θ_A < 7/8.
* Framework B: referee 1's count at a = 4 is 1.046 (referee scratch, not re-derived here).
* The cubic lever is therefore closed in both frameworks, as sufficient-estimate architectures (atlas §9).

θ = 7/8 (unrefereed manuscript), PT Λ ≤ 0.2 and the recorded conditional Λ values are unchanged. RH is open. NO QED.

**What is proved, cited, computed.**
* **Proved here (elementary):** the p-parts (Lemma A), the transfer lemma (Lemma B), the class identity (Lemma E) and
  the n = 3 class map (Lemma D).
* **Cited:** the functional equation of Kubota's series with factor |a|^{1−s} at the same index a:
  * Chinta–Gunnells, Prop 5.1, citing Kubota 1971 and Brubaker–Bump 2006;
  * Diaconu–Ion–Paşol–Popa, Thm 4.1.4, = Brubaker–Bump Thm 1.

  Both were read in their arXiv texts. Brubaker–Bump and Kubota themselves were not read.
* **Proved-rel:** the index factor for the α-twisted (nonspherical) case, from Whittaker homogeneity.
* **Computed:** all finite identities ([NUMERICAL]), to ≤ 1.7·10⁻¹³ for L1 (absolute; the values have modulus up to 7³ = 343) and
  ≤ 4.3·10⁻¹⁵ for L2–L4, and a conductor-collapse test at n = 3 that discriminates the Whittaker rule from the
  twisting rule (§7).

---

## 1. Conventions

These are those of the 7/8 manuscript and `tmp/zf-cubic-field-lib.py`.
* K = Q(ω), O = Z[ω], λ = 1 + 2ω = √−3. Primary means ≡ 1 (mod 3). S = {∞, λ, 2}.
* For c primary and coprime to 6, χ_c(x) = (x/c)₆, with zero extension. It is multiplicative in c.
* e(z) = exp(2πi Tr(z/λ)).

For m ∈ Z, r ∈ O and c primary coprime to 6:

  g_m(r, c) = Σ_{x mod c} χ_c(x)^m e(rx/c),  g̃_m = N(c)^{−1/2} g_m,  γ_m(c) = g̃_m(1, c).

The order of χ^m is n = 6 for m = ±1 (6-fold) and n = 3 for m = ±2 (cubic, χ² = (·/c)₃). Two standard facts:
* **Index shift:** g_m(r, c) = χ_c(r)^{−m} g_m(1, c) when (r, c) = 1.
* **Twisted multiplicativity:** g_m(r, c₁c₂) = [χ_{c₂}(c₁)χ_{c₁}(c₂)]^m g_m(r, c₁) g_m(r, c₂) when (c₁, c₂) = 1.

**Kubota series at a literal index r.** For ψ a character on primary moduli:

  𝒵_{m,ψ}(r; u) = Σ_{c primary, (c,6)=1} ψ(c) g̃_m(r, c) N(c)^{−u}   (Re u > 1).

* ψ = ᾱ·ψ_S, where α(c) = c/|c| and ψ_S has finite order and conductor supported on S. In the cubic lever, ψ_S
  collects G, ν and χ(−1).
* The center of the functional equation is Re u = 1/2.
* 𝒵^{(π)} denotes the same sum restricted to (c, π) = 1.

---

## 2. The index-r coefficient: p-parts

**Lemma A [PROVED; NUMERICAL L1].** Let π be a good prime, q = N(π), and e = v_π(r). The local values g̃_m(r, π^k) are
as follows.

| k | value |
|---|---|
| 0 | 1 |
| n ∤ k | nonzero iff k = e + 1, and then \|g̃\| = q^{e/2} (equal to q^e g(χ_π^{m(e+1)}) / q^{(e+1)/2}) |
| n \| k, k ≤ e | q^{k/2}(1 − 1/q) (Ramanujan sum) |
| n \| k, k = e + 1 | −q^{k/2 − 1} |
| k ≥ e + 2 | 0 |

*Proof.*
* For k ≥ e + 2, put x = x₀ + π^{k−e−1}t. The symbol depends only on x₀ (mod π), and the sum over t (mod π^{e+1}) of
  e((r/π^e)t/π) vanishes.
* For k ≤ e + 1, e(rx/π^k) depends only on x (mod π^{k−e}). The two cases are the orthogonality of χ^{mk} on
  (O/π^k)^× and a primitive Gauss sum modulo π. ∎

This is the table G₀(p^k, p^l) of Diaconu–Ion–Paşol–Popa §4.1.1, with (k, l) = (index exponent, modulus exponent).

So for r = r′π^e with π ∤ r′ and 0 ≤ e ≤ n − 1, the only moduli c divisible by π that occur in 𝒵(r) are c = π^{e+1}c₀:
* when n ∤ e + 1, through the Gauss term, of size q^{e/2};
* when e = n − 1, through the Ramanujan term −q^{n/2−1}.

All other π-power moduli contribute zero. Numerically, 1836 evaluations (n = 3, 6; m = ±1, 2; N(π) = 7, 13, 25; all
units) match the table to 1.7·10⁻¹³.

**The index-r coefficient, written out.** Let r = r_S ∏_{p | r} p^{e_p}, with r_S an S-unit times a power of λ and
0 ≤ e_p ≤ n − 1. Then

  𝒵_{m,ψ}(r; u) = Σ_{T ⊆ {p | r}} Π_{p∈T} [ψ(p^{e_p+1}) g̃_m(r, p^{e_p+1}) N(p)^{−(e_p+1)u}] · (unimodular phase) ·
                   Σ_{c₀ sf, (c₀, 6r)=1} ψ_T(c₀) χ_{c₀}(r_T)^{−m} γ_m(c₀) N(c₀)^{−u}.

The data in the formula are:
* r_T has exponent e_p at p ∉ T and exponent n − 2 − e_p at p ∈ T (Lemma B below);
* ψ_T = ψ · Π_{p∈T} R(·, p)^{e_p+1}, where R(c₀, p) = χ_p(c₀)^m / χ_{c₀}(p)^m = ±1 is the sextic reciprocity sign, a
  character of c₀ of conductor dividing 4 (fixed S-data).

---

## 3. The functional equation (R2)

**Theorem R2 [CITED].** Let ψ have finite order and be unramified outside S (the spherical case). Assume μ_{2n} ⊂ K.
Define

  G_n(u) = (2π)^{−(n−1)u} n^{nu−(n+1)/2} Π_{j=1}^{n−1} Γ(u − 1/2 + j/n)   (K imaginary quadratic, so [K:Q]/2 = 1)

and Λ(r, u) = G_n(u) ζ_K^S(nu − n/2 + 1) 𝒵_ψ(r; u). Then Λ has meromorphic continuation, with at most simple poles at
u = 1/2 ± 1/n, and

  Λ(r, u) = ψ(r) **N(r)^{1/2−u}** Π_{v∈S_f}(1 − q_v^{nu−n/2−1})^{−1} Σ_{η ∈ K_S^×/(K_S^×)^n} P_η(u) ψ(η) Σ_E K_{η,E,[r]} Λ_E(r, 1 − u).

The ingredients on the right are:
* P_η are Dirichlet polynomials in q_v^{−u}, v ∈ S_f;
* the K_{η,E,[r]} lie on the unit circle;
* E runs over finitely many classes;
* **the index r on the right is the same index r.**

Sources, both read in their arXiv texts (copies under `/tmp/cr2-1-lit/`, untrusted downloads, text extracted with
`pdftotext`):
* Diaconu–Ion–Paşol–Popa, arXiv:2607.27131v1, Theorem 4.1.4, which is "[BB06], Theorem 1", and §4.1.3 for G(s);
* Chinta–Gunnells, arXiv:0803.0691v2, Proposition 5.1, which cites Kubota 1971a,b and Brubaker–Bump 2006 and has the
  factor |a|^{1−s} in the unnormalised variable (center s = 1), with (5.2)–(5.3) for G_m and ζ(ms − m + 1).

Brubaker–Bump (J. reine angew. Math. 598 (2006) 159–184) and Kubota (1969, 1971) were not read.

**Local factors at the primes dividing 6.** The moduli are coprime to 6, so λ and 2 enter only through the reflection:
* the factors Π_{v∈S_f}(1 − q_v^{nu−n/2−1})^{−1};
* the Dirichlet polynomials P_η;
* the finite mixing over η and E.

The index r enters this S-part only through its class in K_S^×/(K_S^×)^n, which is a finite set. So the S-part adds a
**fixed constant C_S(n) to the conductor, independent of the good part of r**, and it never changes the exponent of
N(y).

**Proposition W (index dependence, including the α twist) [PROVED-rel].** Assume the (possibly nonspherical) n-fold
Kubota Eisenstein series over K has a functional equation E(·, s) = Φ(s)E(·, 1 − s) with finite scattering at S. Then
its c-series at index r satisfies a functional equation with the factor N(r)^{1/2−u} and the same index r on the right.

*Proof.*
1. At the complex place the cover splits, so the archimedean theory is that of GL(2, C). The r-th Fourier coefficient of
   E at n(x)a(v) is ρ(r, s)·J_r(v, s), with J_r(v, s) = ∫_C φ_s(w n(x) a(v)) e(−rx) dx for a K-finite section φ_s of
   weight k.
2. The K-component of w n(x) a(v) is homogeneous of degree 0 in (x, v) and rotation-covariant. Substituting x = v y
   therefore gives J_r(v, s) = v^{2−2s}F_s(rv), with F_s(ξ) = (ξ/|ξ|)^k F_s(|ξ|).
3. Hence J_r(v, s) = (r/|r|)^k |r|^{2s−2} J_1(|r|v, s): **the only dependence on |r| is the power |r|^{2s−2}**.
4. Archimedean Whittaker functionals on the principal series of GL(2, C) are unique, so the intertwining operator gives
   J′_1(·, 1 − s) = c(s) J_1(·, s).
5. Comparing the r-th coefficients of the two sides of E(s) = ΦE(1 − s) gives
   ρ(r, s)|r|^{2s−2} = c(s) Σ Φ ρ′(r, 1 − s)|r|^{−2s}.
6. So ρ(r, s) = |r|^{2−4s}·c(s)·Σ Φ ρ′(r, 1 − s), at the same index r. With u = 2s − 1/2, |r|^{2−4s} = N(r)^{1/2−u}. ∎

In the spherical case, J_1(ρ, s) ∝ ρ K_{2s−1}(4πρ)/Γ(2s); this formula is not needed above.

This is the α-twisted (nonspherical) case the cubic lever needs: α changes only the archimedean K-type, hence only the
Gamma factor.
* At n = 3 the shift by 1/2 is visible: Prop 5.1 has Γ(s + 1/3)Γ(s + 2/3), against the spherical
  Γ(s − 1/6)Γ(s + 1/6) of G_3.
* **Caveat.** For n = 6, Q(ω) contains μ₆ but not μ₁₂, so Brubaker–Bump Thm 1 is not literally applicable. The
  Eisenstein functional equation itself needs only μ_n ⊂ K (Kubota's setting, [CITED, not read]). Proposition W uses
  only the archimedean homogeneity.
* For n = 3, μ₆ ⊂ Q(ω) and the citation applies as stated.

**Degree.** By the multiplication formula, G_n(u) ∝ Π_{j=1}^{n−1} Γ(u − 1/2 + j/n): n − 1 Gamma factors, that is
**degree n − 1 over K**. This is 2 for n = 3 (the same count as a GL(2)/K theta index series) and **5 for n = 6**. At
bounded height the dual length of a smoothed sum of length D is ≍ C·Q/D for every degree, with Q = N(r)·C_S. The
degree affects only constants and how sharp the transition is (§7).

---

## 4. Transfer lemma and the reflected class-e series

Fix a good prime π ∤ r′, q = N(π), X = q^{−u}. Put
* Z_e := 𝒵(r′π^e; u), the literal index, all moduli;
* F_e := 𝒵^{(π)}(r′π^e; u), moduli coprime to π.

F_e depends only on e (mod n); it is the π-deleted series twisted by the class-e character c ↦ χ_c(π)^{−me}.

**Lemma B (transfer) [PROVED; = Chinta–Gunnells Lemmas 5.3–5.4 = Diaconu–Ion–Paşol–Popa Lemma 4.2.2; NUMERICAL L2].**
* For 0 ≤ e ≤ n − 2:

    Z_e = F_e + A_e X^{e+1} F♮_{n−2−e},  A_e = ψ(π)^{e+1} g̃_m(r′π^e, π^{e+1}),  |A_e| = q^{e/2}.

  Here F♮ is F with ψ multiplied by R(·, π)^{e+1}.
* For e = n − 1:

    Z_{n−1} = (1 + ε q^{n/2−1} X^n) F_{n−1},  |ε| = 1.

*Proof.*
1. By Lemma A, the π-divisible moduli are c = π^{e+1}c₀.
2. By twisted multiplicativity, g(r′π^e, π^{e+1}c₀) = [χ_{c₀}(π)χ_π(c₀)]^{m(e+1)} g(r′π^e, π^{e+1}) g(r′π^e, c₀).
3. The index shift gives g(r′π^e, c₀) = χ_{c₀}(π)^{−me} g(r′, c₀).
4. Reciprocity gives χ_π(c₀) = R χ_{c₀}(π). The total twist is therefore R^{e+1} χ_{c₀}(π)^{m(e+2)}, which is the class
   −(e + 2) ≡ n − 2 − e. ∎

Solving the 2 × 2 system for the pair (e, n − 2 − e) gives, for 0 ≤ e ≤ n − 2,

  F_e = [ Z_e − A_e X^{e+1} Z♮_{n−2−e} ] / (1 − ε′ q^{n/2−1} X^n),  |ε′| = 1

(the constant product of the two unimodular coefficients is 1, as in Diaconu–Ion–Paşol–Popa). For e = n − 1,
F_{n−1} = Z_{n−1}/(1 + ε q^{n/2−1}X^n). The denominator is a single Euler factor. On Re u = 1/2 it lies between
1 ± q^{−1}, so it is harmless (cf. 7/8 Lemma 4.10).

**Proposition C (conductor of the reflected class-e series) [PROVED-rel to Theorem R2 / Proposition W].** Apply the
functional equation to each Z on the right.
* **0 ≤ e ≤ n − 2.** The reflected series of F_e consists of two pieces:
  * (i) N(π)^{e(1/2−u)} × (a dual Kubota series at index r′π^e): **scale q^e, weight 1, dual class e**;
  * (ii) A_e X^{e+1} N(π)^{(n−2−e)(1/2−u)} × (a dual at index r′π^{n−2−e})
    = q^{−1/2} · q^{(n−1)(1/2−u)} · (unimodular) × (dual): **scale q^{n−1}, weight q^{−1/2}, dual class n − 2 − e**.
* **e = n − 1:** a single piece, **scale q^{n−1}, weight 1**.

For each piece, the mean-square cost of a dual sum of length (scale)/D with weight w is w²·(scale)/D: q^e/D for (i) and
q^{n−2}/D for (ii). Expanding the dual series again by Lemma B produces only lower-order terms. For example, at n = 3,
e = 1 this gives the term [q, q^{−1}] of §5.

For squarefree y = Π p, the transfer applies prime by prime (Diaconu–Ion–Paşol–Popa Cor. 4.2.4): there are 2^{ω(y)}
pieces, with scale Π_{p∉T} q_p^e Π_{p∈T} q_p^{n−1} and weight Π_{p∈T} q_p^{−1/2}.

We call **e** the conductor exponent of the class: the unit-weight dual length is N(y)^e·C_S/D. The largest scale
present is N(y)^{n−1}.

---

## 5. Calibration at n = 3 against 7/8 Prop 5.1

Source: `~/lean-deps/qrh-verify/paper.txt`, Prop 5.1 (lines 1390–1530) and its proof (lines 1530–1990).

**What Prop 5.1 says.** The reflected sum is Σ_µ d(µ)α(µ)ϑ(λ⁴µ) Π_{p active} B_p(λ⁴µ) q_µ^{−1/2} V♯(q_µX/q_c²), where:
* c = c_F r and r = Π_{p active} p, every p with j_p ≠ 0 is active, and an active or inactive prime with j_p = 0 is
  allowed;
* the local factors are B_p(x) = χ_p(x)^{−j_p−2} (j_p ≠ 0, 4), q_p^{−1/2}(−1 + q_p 1_{p|x}) (j_p = 4), and
  q_p^{−1/2}χ_p(x)^{−2} (j_p = 0, active);
* an inactive j_p = 0 contributes 1 − q_p^{−1} to the scalar.

The local sums behind these factors are re-verified in finite fields (L4b, error ≤ 3.1·10⁻¹⁵).

**Lemma D (class map) [PROVED; NUMERICAL L4a].** For n coprime to π and j even:

  γ₂(n) χ_π(n)^j = g̃₂(π^{e(j)}, n),  with e(0) = 0, e(2) = 2, e(4) = 1.

*Proof.*
1. By reciprocity, χ_π(n)^j = R^j χ_n(π)^j, and R^j = 1 since R = ±1 and j is even.
2. By the index shift, g̃₂(π^e, n) = χ_n(π)^{−2e}γ₂(n).
3. So the identity holds iff −2e ≡ j (mod 6). ∎

Numerically this holds exactly (error ≤ 1.1·10⁻¹⁵, 68 moduli, N(π) = 7, 13). The other assignments fail.

So Prop 5.1's D(s, Ψ) with Ψ ∋ χ_p^{j_p} is, up to Patterson's normalisation (5.9)–(5.10) and fixed S-sector data,
the π-deleted α-twisted cubic Kubota series F_{e(j_p)} (§4).

**Comparison [PROVED-rel; EXACT bookkeeping in L4c].** The pieces are written as [scale, weight, dual class or
support].

| j_p | class e | R2 (Proposition C, n = 3) | Prop 5.1 item 2 | match |
|---|---|---|---|---|
| 0, inactive | 0 | piece (i) [1, 1] together with the Euler factor | factor 1 − q_p^{−1}, no scale change | yes |
| 0, active | 0 | piece (ii) [q², q^{−1/2}], dual class 1 | q_p^{−1/2}χ_p(x)^{−2} at scale q_p². χ^{−2} = χ⁴ is class e(4) = 1 | yes |
| 2 | 2 = n − 1 | [q², 1], dual class 2 | χ_p(x)^{−4} at scale q_p². χ^{−4} = χ² is class e(2) = 2 | yes |
| 4 | 1 | (i) [q, 1], dual class 1; (ii) [q², q^{−1/2}], dual class 0 | q_p^{−1/2}(−1 + q_p 1_{p\|x}) at scale q_p², split below | yes |

How the j_p = 4 row splits:
* On p | x, write x = px′. The weight is q_p^{1/2}·q_p^{−1/2} = 1 (the second factor is from q_µ^{−1/2}) and the scale
  is q_p²/q_p = q_p. This is [q, 1].
* On p ∤ x, the weight is −q_p^{−1/2} at scale q_p². This is [q², q^{−1/2}].
* The −q_p^{−1/2} part restricted to p | x gives [q, q^{−1}], which is the second-order term of (i).

**What matches.** For every cubic class:
* the scale (q_p versus q_p²);
* the weight (the power of q_p);
* the support (1_{p|x});
* the reflected twist class.

The Ramanujan factor −1 + q_p 1_{p|x} = Σ_{d | (p,x)} μ(p/d) N(d) is exactly the two-term transfer
F₁ = Z₁ − A₁X²Z₀ (up to the Euler factor). The unimodular constants (ω_{p,j}, κ_F, K_{η,E}) were not compared; they do
not affect the conductor.

**Odd j_p (1, 3, 5).** These are sextic twists of the cubic theta. They are not classes of the cubic Kubota series.
Prop 5.1 treats them by R1 only, giving χ^{−j−2} at scale q_p². They are not part of the calibration and not needed
here, because B_y is a 6-fold object.

**The two referee readings.** At n = 3:
* the maximal scale N(p)^{n−1} = N(p)² is present for every active class. That is referee 2's "q_c² for both j_p";
* the unit-weight scale is N(p)^e, which is 1 for j_p = 4 and 2 for j_p = 2. That is referee 1's "index π → N(π),
  index π² → N(π)²".

Both are correct statements about n = 3. Only the second transports by class: the first becomes N(p)⁵ at n = 6.

---

## 6. The cubic lever at n = 6

**Lemma E (class of B_y) [PROVED; NUMERICAL L3].** For squarefree primary n coprime to 6y:

  μ(n) g̃₂(y, n) = α(n) G(n) χ_n(−1) g̃_{−1}(y⁴, n)   (literal additive indices y and y⁴).

*Proof.*
1. The left side is μγ₂χ_n(y)^{−2}.
2. By (7/8, 4.7), in the corrected form of cubic Lemma 2.2, μγ₂ = αGγ̄₁.
3. γ̄₁(n) = χ_n(−1) g̃_{−1}(1, n).
4. g̃_{−1}(r, n) = χ_n(r) g̃_{−1}(1, n).
5. So χ_n(y)^{−2}γ̄₁ = χ_n(−1) g̃_{−1}(y^{−2}, n) = χ_n(−1) g̃_{−1}(y⁴, n), since χ_n(y)⁶ = 1. ∎

Numerically this holds to 4.3·10⁻¹⁵ over 281 pairs (n, y). The y² variant agrees only when χ_n(y)² = 1 (92 of 281
pairs, against the expected 1/3).

Hence

  B_y(D) = Σ_{n sf, (n,6y)=1} ν(n)α(n)G(n)χ_n(−1) g̃_{−1}(y⁴, n) W(N n/D).

This is the y-deleted (Lemma B at every p | y) α-twisted Kubota series of the conjugate 6-fold symbol at **index class
y⁴**, with ψ_S = νGχ(−1) as fixed S-data.

**The class is forced.**
* In the Gauss-class ledger (cubic note, Thm 2.4), [μγ₂] = x⁴ and [γ_t] = x^{3−t}. So t ≡ 5 is the only Gauss-sum
  family carrying μγ₂, and γ₅ = χ(−1)γ̄₁.
* For that family the twist χ_n(y)^{−2} is the index shift to y^{−2}.
* For squarefree y, the integral representative of y^{−2}·(K^×)⁶ of least norm is y⁴.
* The same holds for the conjugate cubic family (twist χ⁴) and for the Framework-B probe T^{(3)} at row m (class m^{−2}
  ≡ m⁴, cubic note §5.1(b)).

**Corollary F (a = 4) [PROVED-rel to Theorem R2 / Proposition W].** Proposition C with n = 6 and e = 4 gives, for each
p | y:
* (i) scale N(p)⁴, weight 1 (dual index class 4);
* (ii) scale N(p)⁵, weight N(p)^{−1/2} (dual index class 0);
* Euler factor (1 − ε′N(p)^{2−6u})^{−1}.

So:
* **a = 4**, the unit-weight dual length being N(y)⁴C_S/D;
* the largest scale is N(y)⁵;
* the mean-square cost is N(y)⁴/D for both pieces;
* the smallest scale present is N(y)⁴.

In model A-V, piece (ii) contributes R^{−1}(R + R⁵/D + (R⁶/D)^c). Its column term R⁴/D equals that of (i), and its
cross term R^{6c−1}D^{−c} is no larger than (R⁵/D)^c for c ≤ 1. So (ii) never dominates.

**Rows with square factors.** If p² ∥ y₀ (cube-free rows y = y₀a³), the class at p is 8 ≡ 2, so e = 2 at that prime. Its
unit-weight scale is N(p)² = N(p²)¹. Such rows are sparse: N(y₂) ≤ √R for y₀ = y₁y₂². They lower the conductor, so they
do not increase any dual length. The exponent a refers to the generic squarefree rows, as in the referee dispute.

**Why "degree 2" fails, and why R1 cannot rescue a = 2 [HEURISTIC remark].**
* R1's scale q_c² comes from GL(2) geometry: the reflection v ↦ 1/(q_c v) at a cusp with denominator c. It applies to
  **index** series of a theta function twisted by characters of the index.
* B_y is a **modulus** series. It would be an index series only if the 6-fold theta had Gauss-sum coefficients at
  squarefree indices (a 6-fold Patterson identity). Local theory does not supply one (Kazhdan–Patterson
  non-uniqueness, [RECALLED]).
* More directly: an identity of the form "B_y's generating series is a GL(2)/K index series" would give it a functional
  equation with 2 Gamma factors over K. Theorem R2 gives it 5. Vertical-strip growth on the left side would then
  disagree.
* At n = 3, n − 1 = 2 and the two coincide; Patterson's theorem makes them the same function.

---

## 7. Numerical checks

Scripts are in `tmp/cubic-r2-1-*`, run with `.venv-arb/bin/python`. Logs are next to them.

**Exact / finite (`tmp/cubic-r2-1-local.py`, log `tmp/cubic-r2-1-local.log`, 2 s).**

| check | result |
|---|---|
| L1, Lemma A: g̃_m(uπ^e, π^k) for m = 1, −1 (n = 6), m = 2 (n = 3); N(π) = 7 (k ≤ 7), 13 (k ≤ 4), 25 (k ≤ 3); all 6 units | 1836 values, max deviation 1.7·10⁻¹³ |
| L2, Lemma B: g_m(π^e, π^{e+1}c₀) = R^{e+1} g_m(π^e, π^{e+1}) g_m(π^{n−2−e}, c₀), N(π) = 7, c₀ of norm 13, 13′, 19, 31; n = 6 (e = 0..4), n = 3 (e = 0, 1) | max relative error 2.0·10⁻¹⁵; R ∈ {+1, −1}; g̃(π^e, π^{e+2}c₀) ≤ 1.3·10⁻¹⁴ |
| L3, Lemma E: index y⁴ identity, 68 moduli (Lemma 2.2 re-check 4.0·10⁻¹⁵) | 281 pairs, max error 4.3·10⁻¹⁵; y² variant 92/281 |
| L4a, Lemma D (n = 3) | j = 0 → e = 0, j = 2 → e = 2, j = 4 → e = 1 (≤ 1.1·10⁻¹⁵); the other assignments fail |
| L4b, Prop 5.1 local sums: (5.11) C_{p,j}(h); reflected sums for j = 0..5 (j = 4 Ramanujan, j = 0 active q^{−1/2}τ⁺₂χ^{−2}); p ∈ {7, 13, 19, 31}, all x | ≤ 5.3·10⁻¹⁶ and ≤ 3.1·10⁻¹⁵ |
| L4c, bookkeeping table of §5 | 3/3 MATCH. For n = 6: e = 4 gives pieces (4, 0), (5, −1/2), mean-square exponents 4, 4 |

**Conductor collapse at n = 3 (`tmp/cubic-r2-1-collapse.py X 3`) [NUMERICAL, illustration, not proof].** This test
discriminates the Whittaker rule (scale N(π)^e) from the twisting rule (N(π)² for every nontrivial class).

Setup:
* Literal-index α-twisted cubic Kubota series at r = uπ^e, e = 1, 2, including the moduli π^{e+1}c₀ and the
  L(3u − 1/2, ᾱ³) completion.
* Index primes: all split primes with 7 ≤ N(π) < 448 (82 primes, 6 units each), in dyadic bins.
* Three smooth log-bump weights.
* Normalised energy |S(D)|²/ΣW².
* Joint fit P = A/(1 + (D/(B N̄^{a_e}))^g), with B, g, A shared and the class-0 profile (index a unit) pinning B.
  Bootstrap over index primes.

| X | free fit a₁ | free fit a₂ | cost: free / Whittaker (a_e = e) / twisting (a_e = 2) |
|---|---|---|---|
| 3·10⁴ | 1.11 [1.03, 1.33] | 2.48 [2.21, 2.83] | 2421 / 2436 / 3085 |
| 10⁵ | 1.25 [1.14, 1.35] | 2.59 [2.36, 2.78] | 2396 / 2426 / 3460 |
| 3·10⁵ | **1.13 [1.08, 1.20]** | **2.30 [2.19, 2.43]** | 2217 / **2230** / **3669** |

Reading:
* The ratio a₂/a₁ is 2.0–2.2 at every X. The Whittaker rule predicts 2; the twisting rule predicts 1.
* The twisting rule costs 1400 more than the Whittaker rule at X = 3·10⁵, with no extra parameter. The free fit
  improves on Whittaker by only 13.
* The free exponents move toward (1, 2) as X grows. The residual upward bias comes from the slow transition: the dual
  weight decays like exp(−c x^{1/4}) for 2 Gamma factors over K, so the transition spans about 3 decades of D, while the
  measured range is 3.8 decades.
* Base level: B ≈ 2.2·10², from the Whittaker fit.

**Not done: a direct test of the functional equation identity.** That would need the explicit scattering data: P_η,
K_{η,E}, and the cusp coefficients (Dunn–Radziwiłł for n = 3), none of which are on the machine. The collapse test
checks only the conductor scaling that the functional equation implies.

**n = 6 is out of numerical reach at this size.**
* `tmp/cubic-r2-1-collapse-n6-1e5.log`: no class, the unit index included, shows suppression for D ≤ 4·10⁴. The fit is
  degenerate and not used.
* Reasons:
  * the completed 6-fold series has 5 Gamma factors over K, so the transition is smeared further and the constant is
    larger;
  * the level at 2 and λ adds a 2-deletion coupling at scale N(2)⁵ = 1024.
* The cubic lever's class y⁴ at N(y) = 7 would need D of order C_S·7⁴ ≳ 10⁷–10⁸. So the n = 6 statement rests on
  Theorem R2 / Proposition W and Lemma B. Lemma B is exact and verified at n = 6 (L2). The rule they give is the one
  confirmed numerically at n = 3 and against Prop 5.1.
* This is also why the campaign's E1–E3 could not separate a = 2 from a = 4, in agreement with both referees.

---

## 8. Consequences for the cubic lever

**Framework A, model A-V [HEURISTIC model; EXACT within it; `tmp/cubic-r2-1-frameworkA.py`].** The model is referee
2's, with dual length R^a/D. With exact rationals:

| a | c = 2/3 (Heath-Brown) | c = 8/13 | c ≤ 8/15 |
|---|---|---|---|
| 2 | 8/9 | 7/8 | 5/6 (c ≤ 1/2), 61/72 (c = 8/15) |
| 3 | 23/24 | 14/15 | 31/36 |
| **4** | **1** | **14/15** | **7/8 (tie, at λ = 3/4)** |
| 5 | 1 | 14/15 | 53/60 |

For c small enough, θ_A = 11/12 − 1/(6a). The binding row is r = 2/a, where the reflected column cost a r − 1 reaches
1. So θ_A < 7/8 iff a < 4, and **at a = 4 no cubic sieve exponent gives θ_A < 7/8**.

**Framework B.** Referee 1's run with the generalised cubic-kernel penalty (T_d = aM + (a − 1)ℓ − 1, file
`/tmp/referee-cubic/cond_exp.log`) gives σ₀ = 0.807 (a = 2), 0.943 (a = 3) and **1.046 (a = 4)**. It was not re-derived
here.

**Verdict.** With a = 4 the cubic lever is closed in both frameworks, as a sufficient-estimate architecture: atlas §9,
not a statement about the actual probe.
* The six-item work list for Framework B in the synthesis (§4) is not needed.
* No θ < 7/8 is obtained.
* The 7/8 boundary (unrefereed), PT Λ ≤ 0.2 and the recorded conditional Λ values are unchanged.
* RH is open. NO QED.

**What would change this.**
1. A 6-fold index–modulus identity (R1 for the 6-fold theta). Local theory does not provide one, and §6 gives a
   degree-mismatch obstruction [HEURISTIC].
2. A different automorphic realisation of μγ₂χ(y)^{−2} with smaller conductor. The ledger rules this out within
   Gauss-sum families [PROVED-rel].
3. A large-sieve estimate that exploits the structure of the dual coefficients beyond the conductor. This is outside
   this question.

---

## 9. Status

| claim | status | evidence |
|---|---|---|
| Lemma A (p-parts) | PROVED | L1 (1.7e-13); = DIPP §4.1.1 |
| Theorem R2: factor N(r)^{1/2−u}, same index, S-part fixed, n − 1 Gamma factors | CITED (CG Prop 5.1; DIPP Thm 4.1.4 = BB06 Thm 1; needs μ_{2n} ⊂ K, true for n = 3) | arXiv texts read |
| Proposition W: index factor for the α-twisted case, any n with μ_n ⊂ K | PROVED-rel (existence of the nonspherical Eisenstein FE) | Whittaker homogeneity; at n = 3 matches Prop 5.1 |
| Lemma B (transfer) | PROVED; = CG Lemmas 5.3–5.4, DIPP Lemma 4.2.2 | L2 (2.0e-15) |
| Proposition C (pieces (i) and (ii)) | PROVED-rel (R2/W) | exponent algebra |
| Lemma D (n = 3 class map j ↔ e) | PROVED | L4a |
| Calibration: Prop 5.1 item 2 reproduced (scales, weights, supports, twist classes) for j ∈ {0, 2, 4} | PROVED-rel | L4b, L4c; constants not compared |
| Lemma E (B_y at index class y⁴; forced) | PROVED (Gauss-sum algebra plus the cubic note's ledger) | L3 (4.3e-15) |
| Corollary F: a = 4 (scales N⁴ and N⁵·N^{−1/2}) | PROVED-rel (R2/W) | — |
| Whittaker rule vs twisting rule at n = 3 (analytic) | NUMERICAL | collapse fit, §7 |
| n = 6 analytic test | not reachable (degree 5, level) | n6 log |
| θ_A = 11/12 − 1/(6a); a = 4 gives ≥ 7/8 for all c | EXACT within model A-V (HEURISTIC model) | frameworkA log |
| Framework B 1.046 at a = 4 | referee scratch, not re-derived | `/tmp/referee-cubic/cond_exp.log` |

---

## 10. Reproduction

```
cd /Users/USER/Documents/GitHub/mathexplorer
.venv-arb/bin/python tmp/cubic-r2-1-local.py               # L1-L4, about 2 s
.venv-arb/bin/python tmp/cubic-r2-1-frameworkA.py          # model A-V exact table, about 5 s
.venv-arb/bin/python tmp/cubic-r2-1-collapse.py 100000 3 200   # about 30 s
.venv-arb/bin/python tmp/cubic-r2-1-collapse.py 300000 3 200   # about 4 min, about 4 GB (prime tables)
.venv-arb/bin/python tmp/cubic-r2-1-collapse.py 100000 6 50    # n = 6, uninformative, about 30 s
.venv-arb/bin/python tmp/cubic-r2-1-threshold.py 20000 8       # first per-norm threshold scan (superseded)
```

* Logs: `tmp/cubic-r2-1-{local,frameworkA}.log` and `tmp/cubic-r2-1-collapse-n3-{3e4,1e5,3e5}.log`,
  `tmp/cubic-r2-1-collapse-n6-1e5.log`. The .npz files hold the raw profiles.
* Shared code: `tmp/cubic-r2-1-lib.py`, which imports `tmp/zf-cubic-field-lib.py` for the sextic tables.

**References.**
* G. Chinta, P. E. Gunnells, Constructing Weyl group multiple Dirichlet series, arXiv:0803.0691v2, §5: (5.1)–(5.3),
  Prop. 5.1, Lemmas 5.3–5.4.
* A. Diaconu, B. Ion, V. Paşol, A. A. Popa, On the second moment and non-vanishing of central values of Hecke
  L-functions of r-th order characters, arXiv:2607.27131v1, §4: 4.1.1 (G₀), 4.1.3 (G(s)), Thm 4.1.4, Lemma 4.2.2,
  Cor. 4.2.4.
* B. Brubaker, D. Bump, On Kubota's Dirichlet series, J. reine angew. Math. 598 (2006) 159–184. Not read; cited via
  the two papers above.
* T. Kubota, On automorphic functions and the reciprocity law in a number field (1969), and Kubota 1971a,b. Not read.
* openai/math family 003, the 7/8 manuscript, Prop. 5.1 and (4.7), (5.9)–(5.11). Read.
* Cubic note `zf-campaign-cubic-field.md`: Lemma 2.2, Thm 2.4, §§3.2, 4, 5.1. Read.
