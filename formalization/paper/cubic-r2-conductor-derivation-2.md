# Conductor exponent of the twisted 6-fold Kubota reflection R2 (cubic lever): derivation 2

Internal analysis, 2026-11-01. Branch `editorial-redesign`; nothing committed. This derivation was written without
reading the other derivation file. Scripts are `tmp/cubic-r2-2-*`; logs sit next to them and data in
`tmp/cubic-r2-2-data/`.

**Question** (synthesis §1.1 and §4). In the cubic-field lever, R2 reflects the dual row sum B_y, which has length D,
into a sum of length N(y)^a/D. The two referees disagree:

* referee 1: a = 4;
* referee 2: a = 2, citing (7/8, Prop 5.1).

At a = 2 Heath-Brown's sieve gives 8/9 and Framework B gives about 0.807. At a = 4 the lever is closed. This note
decides a.

**Labels.**

| label | meaning |
|---|---|
| [PROVED] | complete argument given here |
| [PROVED-rel] | relative to identities of the 7/8 manuscript, used as stated (Lean-checked by its authors, unrefereed) |
| [CITED] | literature result; where noted, the statement was checked against the source text |
| [RECALLED] | literature fact from memory, not checked |
| [EXACT] | exact or symbolic computation |
| [NUMERICAL] | floating-point check or measurement |
| [HEURISTIC] | exponent bookkeeping in a model |

---

## 0. Result

**a = 4** [PROVED-rel, modulo the cited functional equation of §3.2].

**The dual.** For squarefree y prime to 6, the lever's dual B_y is the Kubota series of the 6-fold residue symbol in
index class y⁴, restricted to moduli prime to y [EXACT, §2].

**Its R2 reflection.** At each prime p | y (q = N(p)) the reflection has two parts.

* **Main term** [§3.5–3.6].
  * Length ∝ q⁴/D and weight 1 − 1/q.
  * It stays in index class 4. Its dual columns c′ therefore carry the cubic character χ_{c′}(y)^{−2}, so the cubic
    large sieve applies to it.
  * This is the term the lever's model calls N(y)^a/D, so a = 4.
* **Secondary term.**
  * Length ∝ q⁵/D and weight q^{−1/2}.
  * It lies in index class 0: there is no character of y on its columns.
  * Reflected once more, it returns O(q^{−1}) times B_y itself.
* **No reading gives 2.** The main exponent is 4 and the largest length exponent is 5.

**General rule** [§3.6]. For any n | 6 and any prime p ∤ 6, take a stripped series in index class m (0 ≤ m ≤ n − 1).
* It reflects with main exponent m, staying in class m.
* Unless m = n − 1, it also has a secondary exponent n − 1, in class −m − 2 and with weight q^{−1/2}.

**Calibration on n = 3** [EXACT for the X- and q-dependence; unimodular constants matched only in modulus; §4]. The
same computation for the cubic symbol reproduces every local factor of (7/8, Prop 5.1) for the cubic twists
j_p ∈ {0, 2, 4}: B_p, the scale q_c², the inactive factor 1 − q_p^{−1}, and the cube completion at p.

* j_p = 2 (index π²): a clean exponent 2.
* j_p = 4 (index π): main exponent 1, plus a secondary of length q_p². The secondary is the −1 of the Ramanujan factor.
* Referee 1's reading (index π → N(π), index π² → N(π)²) is the main-term reading.
* Referee 2's "q_c² for both j_p" is the secondary length q^{n−1}. That is q² at n = 3 and q⁵ at n = 6, never q² at
  n = 6.

**Numerics** [NUMERICAL, §6].

* **n = 3**, all 564 516 squarefree moduli with N(c) ≤ 2·10⁶ and 67 twisting primes:
  * j_p = 4: measured exponent 1.00, bootstrap 95% [0.87, 1.13]; exponent 2 is rejected;
  * j_p = 2: about 2.75, with a wide interval;
  * j_p = 0: 0.
* **n = 6**: the base series shows no drop up to D ≈ 6·10⁵, so no 6-fold exponent can be measured at this height. The
  numerics therefore do not test a at n = 6 directly. They test the rule on n = 3, where Prop 5.1 is the reference.

**Consequence** [EXACT within the campaign's models, §7]. At a = 4 the cubic lever is closed in both frameworks.

* Framework A (model A-V, exact rational evaluation):
  * θ_A = 1 with Heath-Brown's c = 2/3;
  * θ_A ≥ 7/8 for every cubic-sieve exponent c ≥ 1/2, with equality only for c ≤ 8/15 (at λ = 3/4);
  * the referee grid's 0.8749 is a discretisation artefact.
* Framework B: 1.046.

No θ < 7/8 follows. The 7/8 bound (unrefereed manuscript) is unchanged; PT Λ ≤ 0.2 stands; RH is open; NO QED.

| reading | n = 3 (cubic theta, Prop 5.1) | n = 6 (lever, class 4) |
|---|---|---|
| main reflected term (exponent = index class) | j_p = 4: 1; j_p = 2: 2 | **4** |
| largest dual length (secondary term, exponent n − 1) | 2 for every j_p (the q_c² of Prop 5.1) | 5 |
| "degree-2 twisting rule" (cond(χ)²) | 2 for every twist | 2: not derived. R2 is not a twist of a GL(2) L-function in its Fourier variable (§4.4) |

---

## 1. Objects and conventions

Conventions follow 7/8 §4.1:

* O = Z[ω] and λ = 1 + 2ω;
* e(z) = exp(2πi Tr(z/λ));
* χ_c(x) = (x/c)_6, with modulus c, extended by zero off units;
* γ_j(c) = q_c^{−1/2} Σ_{v mod c} χ_c(v)^j e(v/c).

**Kubota Gauss sums.** For the n-fold symbol (n | 6, k = 6/n):

  g(t, c) = Σ_{v mod c} χ_c(v)^k e(tv/c),  g^−(t, c) = Σ_{v mod c} χ_c(v)^{−k} e(tv/c).

Two facts are used throughout [PROVED; checked numerically in L2 and L3].

* **(F1) Index shift.** For (t, c) = 1, g(t, c) = conj(χ_c(t))^k g(1, c) and g^−(t, c) = χ_c(t)^k g^−(1, c).
  * Twisting the modulus by a power of the symbol therefore moves the Fourier index.
  * Only the index modulo n-th powers matters for moduli prime to it.
* **(F2) Twisted multiplicativity.** For coprime c and c′, g(t, cc′) = χ_c(c′)^k χ_{c′}(c)^k g(t, c) g(t, c′).
  * Together with sextic reciprocity χ_p(c₀) = R(c₀, p) χ_{c₀}(p) (7/8, Lemma 4.4), the cross factor of a modulus
    c₀p^j is R(c₀, p)^{kj} χ_{c₀}(p)^{2kj}.

**Index classes and series.** Fix a good prime p (p ∤ 6) of norm q.

* The **index class** of a series at p is m ∈ {0, …, n − 1}, the p-order of the minimal integral representative of the
  index class modulo n-th powers.
* **S_m(s)** is the series over moduli prime to p ("stripped"), with the remaining data fixed: S-local twists Ψ,
  prime-to-p part of the index.
* **D(p^m)** is the full Kubota series at index p^m, over all moduli.

**Variables.**

* Kubota variable: s, with Σ g(r, c) Ψ(c) N(c)^{−2s}. The centre is s = 1/2.
* Local variable: X := N(p)^{1−2s}, so X ↦ 1/X under s ↦ 1 − s.
* In the centred variable of (7/8, Prop 5.1), with normalised Gauss sums and q_c^{−s_P}, s_P = 2s − 1/2 and
  X = N(p)^{1/2 − s_P}.
* A factor X^e in a functional equation multiplies the dual length by N(p)^e. **"Conductor exponent e at p"** means
  exactly this.

---

## 2. The lever's dual is a stripped series in index class 4

**Setup.**

* The dual is B_y(D) = Σ_n μ(n)ν(n)γ₂(n)conj(χ_n(y))² W(N n/D) (cubic-field note §2.2).
* By (4.7), μγ₂ = αG·conj(γ₁) on squarefree moduli.
* Here G(c) = conj(χ_c(4))Γ(c). The manuscript's display loses the bar, as the campaign already found. The bar is
  required numerically: 12 primes and 301 composite moduli agree to 1·10^{−14} with the bar, while without it the
  primes fail by up to 1.73 (§6.1).
* conj(γ₁(c)) = χ_c(−1)γ_{−1}(c).

**The identity** [EXACT, L4]. For n = 6:

  conj(γ₁(c)) · conj(χ_c(y))² = χ_c(−1) · q_c^{−1/2} · g^−(y⁴, c).

In the conjugate orientation, γ₁(c)χ_c(y)² = q_c^{−1/2} g(y⁴, c). Either way the index class is y⁴: **m = 4 at every
prime of a squarefree y.** Index y² (class 2) is a different series; L4's control finds the two differ in 8 of 9 cases.

**Consequences.**

* **Both cubic families land in class 4.** The cubic twists j = 2 and j = 4 = −2 of the cubic family are complex
  conjugates of each other.
* **The class is forced by the absorption of μ.**
  * Read with the cubic symbol, the same twist of γ₂ is index y, i.e. cubic class 1, where (7/8, Prop 5.1) would apply.
  * But μγ₂ is not a sequence of cubic Kubota coefficients. μ is absorbed only by passing to the 6-fold symbol through
    (4.7).
  * So the n = 3 rule cannot be applied to B_y directly. It has to be transported to n = 6, which is what §3 does.
* **Cube-free rows.** For y₀ = y₁y₂² (y₁, y₂ squarefree and coprime), the class is 4 at primes of y₁ and
  8 ≡ 2 (mod 6) at primes of y₂. Squarefree rows, which are the bulk at every height, have class 4 everywhere.
* **Other factors.** α (infinity type), G, ν and χ_c(−1) are archimedean or S-local. They do not touch the primes of y.

---

## 3. The index-r coefficient, its Whittaker factor and its functional equation

### 3.1 Fourier coefficient and Whittaker factor [PROVED, standard computation]

**Fourier coefficient.** On H³ = {(z, v)}, the Eisenstein series of the n-fold Kubota cover is a sum of
κ(γ)·v(γw)^{2s} (spherical K-type), with v(γw) = v/(|c|²(|z + d/c|² + v²)).

* The Bruhat decomposition gives its r-th Fourier coefficient (character e(rz)) as E_r(v, s) = D(r, s) · J_s(r, v).
* The Dirichlet part is D(r, s) = Σ_{c} g(r, c) Ψ(c) N(c)^{−2s}.
* The Jacquet integral is

    J_s(r, v) = ∫_C (v/(|z|² + v²))^{2s} e(−rz) dz
             = (2π^{2s}/Γ(2s)) · (2/√3)^{2s−1} · v · |r|^{2s−1} · K_{2s−1}(4π|r|v/√3).

  This uses z = vu, e(z) = exp(4πi Re(z/λ)), and the Fourier transform of (1 + |u|²)^{−2s} on R², at frequency
  |ξ| = 2|r|v/√3.

**Whittaker factor.**

* The index enters only through |r|^{2s−1} = N(r)^{s−1/2}, times a function of |r|v.
* For the non-spherical K-type, which carries the ᾱ twist (compare the ∂_z̄ in the proof of Prop 5.1), the Bessel index
  changes and a phase (r/|r|)^{±1} appears. The factor N(r)^{s−1/2} is unchanged.

### 3.2 Functional equation and its index factor [CITED; index factor derived from 3.1]

**The functional equation.** Kubota's metaplectic Eisenstein series (Kubota 1969, for F ⊇ μ_n) satisfies
E(·, s) = M(s)E(·, 1 − s).

* Take the r-th Fourier coefficient on both sides; the index r is the same on both sides.
* At each p ∉ S, M(s) acts on the spherical vector by a scalar (the metaplectic Gindikin–Karpelevich factor).
* On the S-component it acts by a finite matrix.
* With K_{2s−1} = K_{1−2s}, this gives

    D(r, s; Ψ) = N(r)^{1−2s} · Σ_{Ψ′} Φ_{ΨΨ′}(s) D(r, 1 − s; Ψ′),

  where Φ does not depend on r away from S.

**Literature** [CITED; text checked].

* Brubaker–Bump [BB06, Thm 1] prove this.
* Diaconu–Ion–Paşol–Popa (arXiv:2607.27131v1, Thm 4.1.4) restate it in the centred normalisation:
  * normalised Gauss sums G(a, b), with series Σ_b ψ(b)G(a, b)|b|^{−s};
  * completed by ζ_F(rs − r/2 + 1) and by G(s) = (2π)^{−(r−1)(s−1/2)} Γ(rs − r/2)/Γ(s − 1/2);
  * the equation is

      D̂_S(s, a, ψ) = ψ(a)|a|^{1/2−s} · ∏_{v∈S_fin}(1 − q_v^{rs−r/2−1})^{−1} · Σ_η P_η(s)ψ(η) Σ_E K_{η,E,[a]} D̂_S(1 − s, a, ψ; E).

* The index factor |a|^{1/2−s} is N(r)^{1−2s} in the variable used here.
* The same source gives the local table G₀(p^k, p^l): 1 if l = 0; q^{k/2} if k = l − 1 with l ≢ 0 (mod r); and so on.
  This is exactly the table of §3.4 after normalisation.
* Its §7.1.4–7.1.6 treats stripped series by the same three steps used below: express the stripped series through
  full ones (its Cor. 4.2.4), apply the equation, and return to stripped series (its Cor. 4.2.6). The factors that
  result are |g|^{1/2−s} at the index and q_v^{k_v/2 − (k_v+1)s} per prime.

**Hypothesis.** BB06 and DIPP assume μ_{2r} ⊂ F (DIPP §1.4.1, §4.1.8: "for simplicity"; Diaconu 2004 removes it for
r = 4, F = Q(i)). For n = 6 over Q(ω), μ₁₂ ⊄ F.

* The equation is then Kubota's.
* The index factor is the archimedean one of §3.1 and does not use μ_{2n}.
* What μ_{2n} ⊂ F simplifies is the S-local data, plus one sign at good primes (§3.7).

### 3.3 Local factors at the primes dividing 6

Here S = {λ, 2, ∞}, with N(λ) = 3 and N(2) = 4. Their contribution to the functional equation is:

* the finite family of Dirichlet polynomials P_η(s) in 3^{−s} and 4^{−s}, of bounded degree;
* the Euler factors ∏_{v∈S_fin}(1 − q_v^{…})^{−1};
* the unimodular constants K;
* the S-scattering between the components Ψ (twists by S-units η, so N(rη) has the same p-part);
* the archimedean factor G(s).

**None of these depends on y** when y is prime to 6. Together they set the base conductor Q₀ of the reflected sums.

**If y meets 6.** Lemma 4.1 of the 7/8 paper turns the S-part of χ_•(y) into a fixed ray character, i.e. another Ψ.
This still produces no y-adic exponent.

**Q₀ is not computed here.** §6.3 measures:

* Q₀ ≈ 1.6·10³ for the n = 3 series;
* Q₀ ≳ 6·10⁵ for the n = 6 series, where no drop is seen. This is why the campaign's E1–E3 could not separate a = 2
  from a = 4.

### 3.4 Local factors at a prime p of the twist [EXACT; checks L1 and L3]

**Gauss sums at prime powers.** Write g_a(p) = Σ_{x mod p} χ_p(x)^{ka} e(x/p), so |g_a| = √q if n ∤ a and g_a = −1 if
n | a. Then:

| modulus p^j | g(p^m, p^j) |
|---|---|
| j = 0 | 1 |
| 1 ≤ j ≤ m | φ(p^j) if n \| j, else 0 |
| j = m + 1 | q^m · g_{m+1}(p) |
| j ≥ m + 2 | 0 |

**Decomposition of the full series.** By (F2), for 0 ≤ m ≤ n − 1 (reciprocity twists absorbed into Ψ):

  D(p^m) = S_m + β_m X^{m+1} S_{m*},  m* ≡ −m − 2 (mod n),  β_m = g_{m+1}(p)/q.

* |β_m| = q^{−1/2} unless m = n − 1, where β_{n−1} = −1/q.
* This is DIPP Lemma 4.2.2, with their k = n − m.
* For the lever (n = 6, m = 4), the full index-p⁴ series is S₄ + β₄X⁵S₀. In the centred variable its p-part is
  1 + (unit)·q²·q^{−5 s_P}, which has size q^{−1/2} at the centre.

### 3.5 Local reflection of the stripped series [PROVED given §3.2; exact algebra, checked symbolically]

Apply §3.2 to D(p^m) and to D(p^{m*}). The p-factor of ζ_F(2ns − n + 1)/ζ_F(2n(1 − s) − n + 1) is
E_p = (1 − X^n/q)/(1 − X^{−n}/q), and β_mβ_{m*} = 1/q. Solving the resulting 2 × 2 system gives:

(R)  for m* ≠ m:
     S_m(s) = Φ/(1 − X^{−n}/q) · [ (1 − 1/q) X^m S_m(1 − s) + β_m (X^{−1} − X^{n−1}) S_{m*}(1 − s) ];

(R′) for m = n − 1:
     S_{n−1}(s) = X^{n−1} Φ S_{n−1}(1 − s);

(R″) for n = 6, m = 2 (a fixed point with |β₂| = q^{−1/2}; A and B are its two reciprocity components):
     (A ± B)(s) = X² Φ (1 ∓ q^{−1/2}X³)/(1 ∓ q^{−1/2}X^{−3}) · (A ± B)(1 − s).

**The factor 1/(1 − X^{−n}/q).** It is the p-factor of the dual completion: on the dual side the completion is not
stripped at p. Expanded as Σ_k q^{−k}X^{−nk}, it only shortens dual lengths.

**Checks.** `tmp/cubic-r2-2-symbolic.py` verifies (R) for n = 2, 3, 4, 6 and all m with m* ≠ m, and verifies (R′) and
(R″).

### 3.6 Conductor exponents

Reading off the powers of X on the dual side:

| n | class m | main term (exponent, class, weight) | secondary term (exponent, class, weight) |
|---|---|---|---|
| 3 | 0 | 0, class 0, 1 − 1/q | 2, class 1, q^{−1/2} |
| 3 | 1 | 1, class 1, 1 − 1/q | 2, class 0, q^{−1/2} |
| 3 | 2 | 2, class 2 (clean) | none |
| 6 | 0 | 0, class 0 | 5, class 4 |
| 6 | 1 | 1, class 1 | 5, class 3 |
| 6 | 2 | 2, class 2 | 5, class 2 (R-twisted) |
| 6 | 3 | 3, class 3 | 5, class 1 |
| 6 | **4 (lever)** | **4, class 4** | **5, class 0** |
| 6 | 5 | 5, class 5 (clean) | none |

**Why the secondary term is harmless for the lever.**

* Its dual is the class-0 stripped series at length L = q⁵Q₀/D ≫ Q₀.
* That series' own main dual has length Q₀/L ≪ 1, so it is negligible.
* Its own secondary is class 4, at length q⁵Q₀/L = D, with weight q^{−1/2}.
* So the secondary of B_y equals q^{−1} times a class-4 sum of length D, up to negligible terms: a relative correction
  of order O(q^{−1}).

**When it is not harmless.** For classes whose secondary is twisted, the large sieve over rows would see it in its
column term. Example: n = 6, m = 2, where the per-row contribution is q^{−1}·(q⁵Q₀/D)·D ≍ q⁴Q₀. This case does not occur
for squarefree rows.

### 3.7 A sign at even n

From g_a g_{−a} = χ_p(−1)^{ka} q:

* β_mβ_{m*} = χ_p(−1)^{k(m+1)}/q.
* For n = 3 this is exactly 1/q, since χ_p(−1)² = 1.
* For n = 6, m = 4 it is χ_p(−1)/q.

**Constraint.** The value −1/q would leave poles at X⁶ = −q; the symbolic check confirms the denominator. So for n = 6
over Q(ω) the sign must be carried by the S-data. By reciprocity the Hilbert symbol (−1, p)_S equals χ_p(−1). Under
BB06's hypothesis μ_{2n} ⊂ F, χ_p(−1) = 1 identically.

**Status.** This was not verified for n = 6. It changes no exponent and no class.

**Local corroboration** [RECALLED]. The structure in (R) is the rank-one Kazhdan–Patterson scattering matrix on
metaplectic Whittaker functionals (Kazhdan–Patterson 1984 Lemma I.3.3; McNamara 2016; Chinta–Offen 2013):

* a diagonal entry (1 − q^{−1})·x^{(…)}/(1 − x^n);
* an off-diagonal Gauss-sum entry coupling the classes k ↦ −k − 2.

---

## 4. Calibration: n = 3 against (7/8, Prop 5.1)

### 4.1 Dictionary [EXACT, check L5]

**Even j_p are index moves.** Prop 5.1 twists D(s, Ψ) = Σ γ₂(n)ᾱ(n)Ψ(n)q_n^{−s} by χ_p(n)^{j_p}. For even j:

  γ₂(c)χ_p(c)^j = R(c, p)^j q^{−1/2} g₃(p^{m₃}, c),  m₃ ≡ −j/2 (mod 3),  with R^j = 1 for even j.

So:

* j_p = 0 → class 0;
* j_p = 2 → index p², class 2;
* j_p = 4 → index p, class 1.

**Odd j_p (1, 3, 5) are not index moves.** They are sextic characters on cubic Gauss sums. For them Prop 5.1 gives the
pure twist χ_p^{−j−2} at scale q_p², i.e. the degree-2 twisting rule holds there. The 11/12 paper's sextic j = 1 is of
this kind. The lever's twist is an index move.

**The involution.** Prop 5.1's reflected exponent −j − 2 (mod 6) is the Kubota involution m₃ ↦ −m₃ − 2 (mod 3):

* 2 ↦ 2;
* 1 ↦ 0 (the Ramanujan, "principal" factor);
* 0 ↦ 1 (the active j_p = 0 term carries χ_p^{−2} = χ_p⁴).

### 4.2 The three local factors, rebuilt [EXACT, symbolic: `tmp/cubic-r2-2-symbolic.py` §C]

**Prop 5.1 in Mellin form.** From (5.1) and the definition of V♯:

* T(s, Ψ) = Σ_terms ζ·R(1/2 − s)K^{s−1/2}·(q_c²)^{1/2−s}·T^♯(1 − s);
* T^♯(w) = Σ_μ d(μ)α(μ)ϑ(λ⁴μ) ∏_p B_p(λ⁴μ) q_μ^{−w}.

**Ingredients.**

* Each active p contributes the scale factor (q_p²)^{1/2−s} = X².
* The cusp coefficients have the p-structure of (5.9) and (5.2):
  * d(μ₀p^{3k}) = q^{k/2} d(μ₀);
  * for p ∤ μ₁, d(pμ₁) = g̃₃(p) · (class-1 twist of d(μ₁)), by twisted multiplicativity and cubic reciprocity.
* Put Y = q^{1/2−3w} = X^{−3}/q (one cube step).

Summing B_p over v_p(μ) gives the following.

**j_p = 2.** Here B_p = χ_p(x)^{−4} = χ_p(x)², which vanishes on p | μ.
* Prop 5.1 local factor: X² S₂^♯.
* Kubota side (R′): X² S₂′.
* They are equal. Neither side has a cube completion at p.

**j_p = 4.** Here B_p = q^{−1/2}(−1 + q·1_{p|x}).
* Class-1 part (v_p ≡ 1 mod 3): X²·q^{1/2}(1 − 1/q)·g̃(p)q^{−w}/(1 − Y) = (1 − 1/q)X/(1 − X^{−3}/q) · [g̃ S₁^♯].
* Class-0 part (v_p = 0 contributes −q^{−1/2}; v_p = 3k ≥ 3 contributes q^{1/2}(1 − 1/q)):
  X²[−q^{−1/2} + q^{1/2}Y]/(1 − Y) = q^{−1/2}(X^{−1} − X²)/(1 − X^{−3}/q).
* Kubota side, (R) with m = 1: [(1 − 1/q)X S₁′ + β₁(X^{−1} − X²) S₀′]/(1 − X^{−3}/q).
* They are equal, with β₁ = q^{−1/2}·(unit).

**j_p = 0.**
* Inactive branch: (1 − q^{−1})·Σ_{all μ} = (1 − 1/q)/(1 − Y) · [S₀^♯ + g̃ q^{−1/2} X^{−1} S₁^♯].
* Active branch, with B_p = q^{−1/2}χ_p^{−2} (class 1, v_p = 0 only): X² q^{−1/2} u S₁^♯.
* Kubota side, (R) with m = 0: [(1 − 1/q)S₀′ + β₀(X^{−1} − X²)S₁′]/(1 − X^{−3}/q).
* They are equal if and only if β₀ = g̃(p)q^{−1/2} and u = −g̃(p). Prop 5.1's ω_{p,0} = −τ⁺_{p,2}χ_p(ε_p)^{−2} carries
  that minus sign.

**What is reproduced.**

* Exactly: every power of X, every power of q, the factor 1 − q_p^{−1}, the Ramanujan structure and the cube completion
  of Prop 5.1.
* Only in modulus (and, for j_p = 0, in relative sign): the unimodular constants τ^±, χ_p(σ_p), ε_p and the cusp
  sector.
* Not done: matching those constants as complex numbers, which needs the cusp normalisations of (5.3).

### 4.3 What fixes the index exponent [EXACT, `symbolic` §D]

Suppose §3.2 had an index factor N(r)^{κ(1−2s)}.

* Then (R′) for n = 3, m = 2 would read X^{2κ}.
* Prop 5.1 gives X² for j_p = 2, so κ = 1. This agrees with the Jacquet-integral computation of §3.1 and with BB06/DIPP.
* Once κ is fixed nothing else is free: the class (§2) and κ give the lever's exponent 4κ = 4.

### 4.4 The two referee readings, and the degree-2 rule

**Referee 1** (index π → N(π), index π² → N(π)²) reads the main term of (R) and (R′). This is the reading the lever's
model needs:

* the model bounds the reflected rows with the cubic large sieve;
* only the main term carries the row character on the columns;
* the secondary is either untwisted (the lever's class 4) or a relative O(q^{−1}) correction.

**Referee 2** ("q_c² for both j_p") reads the literal scale of Prop 5.1. That is max(main, secondary) = q^{n−1}, which
is q² at n = 3. Transported to n = 6 it is q⁵, not q².

**The original N(h)².** The lever's first value came from the degree-2 twisting rule, cond(χ)².

* That rule is correct for functional equations in the Fourier-index variable (R1, the theta's own equation), and for
  non-index twists such as the odd j_p.
* It is not correct for an index move under R2.

**Sanity check at n = 2** [RECALLED: Kubota; Goldfeld–Hoffstein 1985].

* Up to finitely many Euler factors, the quadratic Kubota series is L(2s − 1/2, χ_r)/ζ_F(4s − 1).
* That is a degree-1 Hecke L-function of conductor ∝ N(r), i.e. exponent 1, as the index rule says.
* The degree-2 rule would give exponent 2.

---

## 5. The value of a for the lever [PROVED-rel, modulo §3.2]

**Squarefree rows.** Let y be squarefree and prime to 6. Then B_y is in class 4 at every p | y (§2).

* The local reflections at distinct primes compose. Twisted multiplicativity factorises over primes, up to reciprocity
  characters, which belong to Ψ.
* The **main reflected term** is therefore Π_{p|y}(1 − 1/q_p) X_p⁴ · S₄(1 − s).
  * Its dual length is ∝ Q₀N(y)⁴/D.
  * Its columns are twisted by χ_{c′}(y)^{−2}, a cubic character in y.
  * This is exactly the configuration in which the lever applies Heath-Brown's cubic sieve, with N(y)^a/D columns.
* **Hence a = 4.**
* **Mixed terms** (main at some primes of y, secondary at the others, y = y_a y_b) have length ∝ Q₀N(y_a)⁴N(y_b)⁵/D,
  weight N(y_b)^{−1/2}, and class 0 at y_b. After the re-reflection of §3.6 they are relative O(N(y_b)^{−1})
  corrections.
* **The full series D(y⁴)**, with all moduli including p⁵-multiples, has the clean exponent 4.
* **No variant gives a = 2.** The main exponent is 4 and the largest dual length has exponent 5.

**Square-type rows.** For rows y = y₁y₂² the main exponent is 4·log N(y₁) + 2·log N(y₂), which lies between 1 and 4
times log N(y). Square-type rows are a density-zero part of the Poisson dual rows, and the lever's model is set by the
bulk.

**What would be needed for a = 2.** A reflection whose dual twist conductor is cond(χ)²: an R1-type, index-variable
functional equation for a 6-fold object. The lever already records that none is available (cubic-field note §3.1,
Prop 3.1).

---

## 6. Numerical checks

### 6.1 Exact and local [NUMERICAL to machine precision; `local`, `composite-check`, `collapse` self-checks]

| check | result |
|---|---|
| L1: g(p^m, p^j) for n = 3, 6; π \| 7, π \| 13 for all m ≤ n − 1, j ≤ m + 2; inert 5 for m ≤ 1 | max relative deviation 7.3·10^{−14} |
| L2: index shift, 6 moduli × 6 indices × n = 3, 6 | 1.6·10^{−15} |
| L3: twisted multiplicativity at c₀p^j (125 cases), and sextic reciprocity on 70 ordered prime pairs | 7.4·10^{−15}; exact |
| L4: lever coefficient = χ_c(−1)q^{−1/2}g^−(y⁴, c), and the conjugate orientation | 2.6·10^{−15} |
| L5: Prop 5.1 twists j = 0, 2, 4 ↔ index 1, p², p | 3.5·10^{−15} |
| (4.7) with the bar restored, μγ₂ = αG·conj(γ₁), on 12 primes and 301 composite moduli | 9.9·10^{−15} |
| (4.7) without the bar, at the same 12 primes | fails by up to 1.73 |
| full-series coefficient a(c₀h^{m+1}) = C_{h,m} f(c₀)χ_{c₀}(h)^{−(m+2)} against brute force (two bases, 18 + 18 cases) | 2.3·10^{−14} |
| C_{h,0} = −γ₂(h) on 67 primes | 2.2·10^{−13} |
| C program for the prime class sums, against the campaign lib for p < 200 | 3.5·10^{−13} |

### 6.2 Symbolic [EXACT, `symbolic`]

* (R), (R′) and (R″) hold.
* A sign β_mβ_{m*} = −1/q forces poles at X⁶ = −q.
* The n = 3 calibration (§4.2) holds.
* κ = 1 is the only index exponent consistent with Prop 5.1 (§4.3).

### 6.3 Collapse test of the conductor exponent [NUMERICAL]

**Data.**

* Every squarefree primary modulus prime to 6 with N(c) ≤ 2·10⁶: 564 516 moduli, built from 148 938 good primes (148 824
  split ideals and 114 inert).
* Prime class sums came from a C program (about 3 min per half-range).
* 67 twisting primes h with N(h) ≤ 800, one per conjugate pair. Conjugate pairs give identical energies by the exact
  symmetry c ↦ c̄; the campaign's E3 averaged over both primes above p, so its two samples per prime were the same
  sample.

**Statistic.**

  e(D) = |Σ a(c)W(N c/D)|² / Σ|a(c)|²W(N c/D)²,

averaged over 6 bump shapes, on 52 values of D from 30 to 8.2·10⁵.

* A dual length ≫ 1 gives e ≈ 1.
* A dual length ≪ 1 gives e ≈ 0, plus the predicted q^{−1} plateaus (§3.6).

**Families.**

* n = 3: Prop 5.1's own sequence ᾱγ₂, twisted by χ_h(c)^j for j ∈ {0, 2, 4}.
* n = 6: the lever's base μγ₂ = αG·conj(γ₁), and the campaign's G-free base α·conj(γ₁). Each is twisted to classes
  m = 0, …, 5, both stripped and full.

**Coarse curves** (`tmp/cubic-r2-2-data/summary-table.txt`). Each entry averages 4 grid points and the h in the group.

| D (centre) | 2.2e3 | 4.9e3 | 1.1e4 | 2.5e4 | 5.5e4 | 1.2e5 | 2.7e5 | 6.0e5 |
|---|---|---|---|---|---|---|---|---|
| n=3, h=1 base | 0.740 | 0.192 | 0.060 | 0.045 | 0.071 | 0.069 | 0.024 | 0.027 |
| n=3, j=0, N(h) 409–800 | 0.741 | 0.195 | 0.059 | 0.046 | 0.072 | 0.071 | 0.026 | 0.028 |
| n=3, j=4, N(h) = 7 | 0.646 | 0.643 | 0.390 | 0.294 | 0.146 | 0.222 | 0.089 | 0.093 |
| n=3, j=4, N(h) 67–151 | 0.819 | 0.778 | 0.620 | 0.585 | 0.361 | 0.209 | 0.265 | 0.273 |
| n=3, j=4, N(h) 409–800 | 1.001 | 0.728 | 0.798 | 0.926 | 0.568 | 0.521 | 0.564 | 0.373 |
| n=3, j=2, N(h) = 7 | 0.657 | 0.166 | 0.434 | 0.470 | 0.313 | 0.736 | 0.314 | 0.400 |
| n=3, j=2, N(h) 409–800 | 0.817 | 0.910 | 1.120 | 0.901 | 1.068 | 1.138 | 1.160 | 0.850 |
| n=6, h=1 base, with G (lever B₁) | 0.503 | 0.846 | 0.714 | 0.947 | 0.218 | 1.121 | 0.794 | 0.413 |
| n=6, h=1 base, G-free | 0.359 | 0.146 | 0.335 | 0.296 | 0.265 | 1.216 | 0.912 | 0.423 |
| n=6, class 4 (B_h), N(h) = 7 | 0.468 | 0.609 | 0.703 | 0.508 | 0.662 | 0.171 | 0.626 | 2.057 |

**n = 3 results.**

* The j = 0 drop sits at the same D for every h.
* The j = 4 drop moves out with N(h).
* The j = 2 drop is seen only for the smallest h.

Exponent estimates:

* **Shape-free isotonic collapse** (`isotonic`, bootstrap over h with B = 60, each h's whole curve resampled):
  * j = 0: 0.00, interval [0.00, 0.05];
  * j = 4: **1.00, interval [0.87, 1.13]**; the score difference is 97.8 against exponent 2 and 219.7 against 4;
  * j = 2: 2.75, bootstrap median 2.95, interval [1.17, 4.00]. Only h | 7, 13, 19 have this drop in range.
* **Parametric step model** (`bootstrap`, one Q₀ for all three classes, with the plateau terms of §3.6; κ_shape = 1.5,
  B = 200):
  * Q₀ = 1615;
  * a(j = 4) = 0.70 with interval [0.65, 0.75], and a(j = 2) = 1.50 with interval [1.30, 1.80];
  * ratio 2.13, interval [1.78, 2.50];
  * the likelihood prefers a = 1 over 2 for j = 4 in 100% of resamples (ΔlogL = +444), and a = 2 over 1 for j = 2 in
    99% of resamples;
  * the shape parameters 1 and 3 give the same picture.
* The fixed transition shape biases the parametric exponents low. The robust outputs are the 2:1 ratio and the
  shape-free 1.00.

**Reading.** The n = 3 numerics confirm the main-term reading of Prop 5.1: index π → N(π), index π² → N(π)². "Effective
exponent 2 for every cubic twist" is excluded for j_p = 4.

**n = 6 results.** Neither h = 1 base series (with or without G) drops up to D ≈ 6·10⁵. So the base S-conductor of the
6-fold series exceeds about 6·10⁵; its value is not determined. Consequences:

* Every class with m ≥ 1 would drop beyond D_max.
* The isotonic fits are flat; their bootstrap intervals span [0, 4].
* Hypothesis a = 2 puts the class-4 drop at h | 7 at ≥ 49·Q₀, above 3·10⁷.
* The derived a = 4 puts it at ≥ 2401·Q₀, above 1.4·10⁹.
* Neither is reachable: N(c) ≤ 2·10⁶ already costs about 7·10¹⁰ Gauss-sum terms.

**Relation to the campaign's E3.** The class-4 curves for h | 7, 13, 19 fluctuate between 0.17 and 2.06 with no trend.
E3's cells at 0.26–0.52 are of the same kind, and its base-conductor estimate (about 10³) was too low for the 6-fold
series.

---

## 7. Consequence for the cubic lever

**Framework A** (model A-V of the campaign; exact piecewise-linear rational evaluation in `frameworkA`, λ ∈ [1/20, 2]):

| a | c = 2/3 (Heath-Brown) | c = 8/13 | c = 3/5 | c = 8/15 | c = 1/2 |
|---|---|---|---|---|---|
| 2 | 8/9 | 7/8 | 0.870370 | 0.847222 | 5/6 |
| **4** | **1** | 0.933333 | 0.916667 | 7/8 (λ = 3/4) | 7/8 (λ = 3/4) |
| 5 | 1 | 0.933333 | 0.916667 | 0.883333 | 0.883333 |

* At a = 4, θ_A ≥ 7/8 for every c ≥ 1/2. Equality occurs only at λ = 3/4, for c ≤ 8/15.
* Example: with c = 1/2, the two arms of worst(λ) meet at 9/4 at λ = 3/4, which gives θ = (2 − 1/4)/2 = 7/8 exactly.
* The referee grid's 0.8749 is a discretisation artefact of its r-grid.
* The data module's closed form 1/2 + max(1, 2 − (1 + 1/c)/(1 + a))/3 covers λ ≥ 1 only. It agrees at c = 2/3 (giving 1).

**Framework B** (the referee's generalised constraint set, re-run in `refB`):

* a = 2: 0.80664;
* a = 4: **1.04598**;
* a = 5: 1.30460.

**So:**

* The second pass's a = 2 results all rested on a = 2 and are withdrawn: 8/9 with Heath-Brown's sieve, the threshold
  c < 8/13 for beating 7/8, and the Framework B count of about 0.807.
* The six-input work list for a = 2 (synthesis §4) is moot.
* Within these models no cubic large-sieve exponent c ≥ 1/2 gives θ < 7/8. The best case is the tie 7/8 in Framework A.
* No Λ is changed.

---

## 8. Status of each claim

| claim | status | evidence |
|---|---|---|
| B_y is the stripped series of index class y⁴ (m = 4) for the 6-fold symbol; both cubic families land there | PROVED-rel ((4.7), Lemma 4.4) | L4, composite check |
| prime-power Gauss sums; D(p^m) = S_m + β_mX^{m+1}S_{m*} | PROVED | L1, L3; equals DIPP Lemma 4.2.2 |
| index factor N(r)^{1−2s} of the index-r coefficient | PROVED (Jacquet-integral homogeneity) given the existence of E(s) = M(s)E(1 − s) | §3.1; CITED BB06 Thm 1 via DIPP Thm 4.1.4 (text checked; μ_{2n} ⊂ F hypothesis) |
| meromorphic continuation and functional equation of the 6-fold Eisenstein series over Q(ω) | CITED (Kubota 1969); S-local data for μ₁₂ ⊄ F not written out | DIPP Remark 1.4.1 |
| local reflection (R), (R′), (R″); exponent table §3.6 | PROVED given the above | symbolic §A–B |
| sign χ_p(−1) at n = 6 absorbed by the S-data | HEURISTIC (forced by the absence of poles) | symbolic §A |
| n = 3: (R)/(R′) reproduce Prop 5.1's local factors for j_p = 0, 2, 4 | EXACT in X and q; units in modulus only | symbolic §C |
| κ = 1 forced by Prop 5.1 | EXACT | symbolic §D |
| n = 3 effective exponents measured as 0, 1, about 2–3 for j = 0, 4, 2 | NUMERICAL | isotonic, bootstrap |
| n = 6 exponents | not measurable at N(c) ≤ 2·10⁶ (base S-conductor ≳ 6·10⁵) | collapse, summary table |
| a = 4 (main), secondary exponent 5 untwisted and O(q^{−1}) after re-reflection; a ≠ 2 | PROVED-rel modulo the cited functional equation | §5 |
| Framework A at a = 4: 1 (c = 2/3), ≥ 7/8 for c ≥ 1/2 | EXACT within model A-V | frameworkA |
| Framework B at a = 4: 1.046 | NUMERICAL within the referee's model | refB |
| Kazhdan–Patterson structure of the local scattering matrix | RECALLED | — |

No step proves a zero-free region. The 7/8 boundary (unrefereed manuscript), PT Λ ≤ 0.2 and the recorded conditional Λ
values are unchanged. RH is open. NO QED.

---

## 9. Reproduction

```
cd /Users/USER/Documents/GitHub/mathexplorer
.venv-arb/bin/python tmp/cubic-r2-2-local.py                    # L1-L5 exact Gauss-sum checks (< 1 s)
.venv-arb/bin/python tmp/cubic-r2-2-symbolic.py                 # local reflection, n = 3 calibration, kappa (~40 s)
.venv-arb/bin/python tmp/cubic-r2-2-composite-check.py          # (4.7) with/without the bar: 12 primes, 301 composites (~60 s)
clang -O3 -o tmp/cubic-r2-2-gauss tmp/cubic-r2-2-gauss.c -lm
./tmp/cubic-r2-2-gauss 7 1414213       > tmp/cubic-r2-2-data/gauss-a.txt   # prime class sums (~3 min; run the two in parallel)
./tmp/cubic-r2-2-gauss 1414214 2000000 > tmp/cubic-r2-2-data/gauss-b.txt
.venv-arb/bin/python tmp/cubic-r2-2-collapse.py 2000000         # energies, coefficient self-checks (~2 min)
.venv-arb/bin/python tmp/cubic-r2-2-isotonic.py  tmp/cubic-r2-2-data/collapse-X2000000.json 60
.venv-arb/bin/python tmp/cubic-r2-2-bootstrap.py tmp/cubic-r2-2-data/collapse-X2000000.json 200
.venv-arb/bin/python tmp/cubic-r2-2-analyze.py   tmp/cubic-r2-2-data/collapse-X2000000.json
.venv-arb/bin/python tmp/cubic-r2-2-summary.py   tmp/cubic-r2-2-data/collapse-X2000000.json
.venv-arb/bin/python tmp/cubic-r2-2-frameworkA.py              # exact model A-V values
.venv-arb/bin/python tmp/cubic-r2-2-refB.py                    # referee Framework-B scan at a = 2, 4, 5
```

Logs:

* `tmp/cubic-r2-2-{local,symbolic,composite-check,frameworkA,refB,refgrid}.log`
* `tmp/cubic-r2-2-data/{collapse-X2000000,isotonic,bootstrap,analyze-X2000000}.log`
* `tmp/cubic-r2-2-data/summary-table.txt`

The data files `tmp/cubic-r2-2-data/gauss-{a,b}.txt` (20 MB) can be regenerated with the commands above.

## References

* [Kub69] T. Kubota, *On automorphic functions and the reciprocity law in a number field*, Lectures in Math., Kyoto
  Univ. 2 (1969). Metaplectic Eisenstein series; functional equation. [CITED]
* [BB06] B. Brubaker, D. Bump, *On Kubota's Dirichlet series*, J. reine angew. Math. 598 (2006) 159–184, Thm 1. Index
  factor |a|^{1/2−s}. [CITED through DIPP]
* [DIPP] A. Diaconu, B. Ion, V. Paşol, A. A. Popa, *On the second moment and non-vanishing of central values of Hecke
  L-functions of r-th order characters*, arXiv:2607.27131v1 (2026). Thm 4.1.4 (restating BB06 Thm 1), §4.1.1 (table
  G₀), Lemma 4.2.2 (stripped versus full series), §7.1.5–7.1.6, Remark 1.4.1. [CITED; text checked from the arXiv PDF]
* [KP84] D. Kazhdan, S. J. Patterson, *Metaplectic forms*, Publ. Math. IHES 59 (1984), Lemma I.3.3. [RECALLED]
* [McN16] P. McNamara, *Principal series representations of metaplectic groups over local fields*, Simons Symposia
  (2016). [RECALLED]
* [CO13] G. Chinta, O. Offen, *A metaplectic Casselman–Shalika formula for GL_r*, Amer. J. Math. 135 (2013). [RECALLED]
* [Pat77] S. J. Patterson, *A cubic analogue of the theta series*, J. reine angew. Math. 296 (1977). Used through
  (7/8, (5.9)).
* [HB00] D. R. Heath-Brown, *Kummer's conjecture for cubic Gauss sums*, Israel J. Math. 120 (2000), Thm 2. The cubic
  large sieve, (7/8, 14.6).
* [GH85] D. Goldfeld, J. Hoffstein, *Eisenstein series of 1/2-integral weight and the mean value of real Dirichlet
  L-series*, Invent. Math. 80 (1985). The quadratic Kubota series. [RECALLED]
* (7/8) and (11/12): openai/math family 003 manuscripts, `~/lean-deps/qrh-verify/paper.txt` and `paper2.txt`.
  Lean-formalised by their authors; unrefereed.
