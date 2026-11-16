# Cubic lever: conductor exponent of the R2 reflection — referee/reconciler verdict

Internal working note, 2026-11-01. Branch `editorial-redesign`. Nothing committed, nothing sent upstream. Not refereed
externally. This note compares two independent derivations of the R2 conductor exponent a, checks each against the
literature and against the n = 3 calibration (7/8 Prop 5.1), reruns their numerical checks, adds an independent
implementation of the decisive checks, and decides a.

* Derivation 1: `formalization/paper/cubic-r2-conductor-derivation-1.md` (scripts `tmp/cubic-r2-1-*`).
* Derivation 2: `formalization/paper/cubic-r2-conductor-derivation-2.md` (scripts `tmp/cubic-r2-2-*`).
* Referee check (new, independent code): `tmp/cubic-r2-verdict-check.py`, log `tmp/cubic-r2-verdict-check.log`.
* Context: `zf-campaign-synthesis.md` §1.1 and §4, `zf-campaign-cubic-field.md` §§2–5, `src/data/zero-free-campaign-2026-11-01.js`.

Labels: **[PROVED]** complete elementary argument (in a derivation or here); **[PROVED-rel]** proved relative to a cited
theorem used as stated; **[CITED]** literature, with what was actually read stated; **[EXACT]** exact or symbolic
computation; **[NUMERICAL]** floating-point check of a finite identity, or a measurement; **[HEURISTIC]** exponent
bookkeeping in a model.

---

## 0. Verdict

**a = 4.** Both derivations reach this independently, by the same mechanism. Every check of theirs that was rerun
reproduces their logs (§5).

* **Main reflected term.** For a squarefree row y prime to 6, the R2 dual of B_y has length ≍ Q₀N(y)⁴/D, weight
  Π_{p|y}(1 − 1/N(p)), and stays in index class 4. So its columns c′ carry the cubic character χ_{c′}(y)^{−2}, and this
  is the term to which the lever applies the cubic large sieve. Hence a = 4. [PROVED-rel to the functional equation of
  §2.3]
* **Secondary term.** For each p | y there is also a piece of length ≍ Q₀N(p)⁵·(rest)/D with weight N(p)^{−1/2}, in class
  0 (no character of p). Its mean-square cost is N(p)^{5−1}/D = N(p)⁴/D, the same as the main term.
* **No reading of the functional equation gives 2.** The main exponent is 4, the largest scale exponent is 5, and the
  mean-square exponent is 4.

**Confidence: about 0.95** that the lever's R2 dual-length exponent is 4, and above 0.98 that it is not 2. The residual
risk is that the n = 6 functional equation over Q(ω) is used through Kubota's theorem and the archimedean Whittaker
homogeneity, not through a source that was read and that writes out the S-local data. The published explicit form (BB06
Thm 1, restated as DIPP Thm 4.1.4) assumes μ₁₂ ⊂ K, which fails for Q(ω). This gap cannot move the exponent: the index
exponent κ is fixed at the complex place, where the cover splits, so it is the same for n = 3 and n = 6, and κ = 1 is
forced at n = 3 by 7/8 Prop 5.1 (§3.3).

**Consequence for the cubic lever.** Closed in both frameworks, as sufficient-estimate architectures (atlas §9). This is
exact within the campaign's own heuristic models:

* Framework A (model A-V): θ_A = 11/12 − 1/(6a) for every cross exponent c ≤ 1/2. At a = 4 this is 7/8, a tie at λ = 3/4,
  never below. Heath-Brown's c = 2/3 gives θ_A = 1.
* Framework B (the referee's generalised cubic-kernel model): σ₀ = 1.04598 at a = 4, i.e. trivial.

The a = 2 results are withdrawn: 8/9, the threshold c < 8/13, the Framework-B count ≈ 0.807, the ≈ −0.02 conditional-Λ
price, and "not dead at the automorphy step". The six-input Framework-B work list (synthesis §4) is moot. The best θ
stays 7/8, from the unrefereed manuscript. PR #14's 0.87488665 stays conditional. PT Λ ≤ 0.2 stands. RH is open. NO QED.

---

## 1. The question and the two answers

In the cubic lever the Poisson dual of the cubic Möbius family is (cubic note §2.2)

  B_y(D) = Σ_n μ(n)ν(n)γ₂(n)·conj(χ_n(y))²·W(N n/D),  n squarefree primary, (n, 6y) = 1.

R2 reflects it to a sum of length N(y)^a/D. The campaign's second pass took a = 2 from a "degree-2 twisting rule". Its
two referees split: referee 1 argued a = 4; referee 2 argued a = 2, reading the scale q_c² that 7/8 Prop 5.1 displays
"for both j_p".

| | derivation 1 | derivation 2 |
|---|---|---|
| answer | a = 4 | a = 4 |
| class of B_y | index class y⁴ (Lemma E) | index class y⁴ (§2) |
| index factor of the FE | N(r)^{1/2−u}, cited (CG Prop 5.1; DIPP Thm 4.1.4 = BB06 Thm 1); Prop W for the α-twisted case | N(r)^{1−2s}, from the Jacquet integral (§3.1); cited as above; κ = 1 forced by Prop 5.1 (§4.3) |
| transfer (stripped ↔ full) | Lemma B (= CG Lemmas 5.3–5.4, DIPP Lemma 4.2.2) | (F2)/(I1) (= DIPP Lemma 4.2.2) |
| local reflection | Prop C: pieces [N^e, 1] and [N^{n−1}, N^{−1/2}] | exact formula (R), (R′), (R″), checked symbolically |
| n = 3 calibration | bookkeeping table, finite-field check of Prop 5.1's own local sums | symbolic rebuild of Prop 5.1's local factors, exact in X and q |
| secondary piece | mean-square cost N(p)⁴/D, never dominates in model A-V | class 0; re-reflected it is O(N(p)^{−1}) times a class-4 sum of length D |
| n = 3 numerics | joint logistic fit: a₁ ≈ 1.1–1.25, a₂ ≈ 2.3–2.6 | isotonic collapse: e = 1 → 1.00 [0.87, 1.13]; e = 2 → 2.75 [1.17, 4.00] |
| n = 6 numerics | uninformative | uninformative (base conductor Q₀ ≳ 6·10⁵) |
| confidence | about 0.9 | high that a ≠ 2 and the main exponent is 4 |

The two derivations differ in presentation only (§4).

---

## 2. The index-r coefficient and its functional equation

### 2.1 Objects

K = Q(ω), O = Z[ω], λ = 1 + 2ω = √−3, S = {∞, λ, 2}. Primary means ≡ 1 (mod 3). χ_c(x) = (x/c)₆, e(z) = exp(2πi Tr(z/λ)).
For n | 6, put k = 6/n. The n-fold Gauss sum with symbol sign ε = ±1 is

  g(r, c) = Σ_{x mod c} χ_c(x)^{εk} e(rx/c),  g̃(r, c) = N(c)^{−1/2} g(r, c).

The lever uses n = 6, ε = −1. The cubic theta of the 7/8 paper uses n = 3 (χ²).

The Kubota series at literal index r, for a character ψ on primary moduli prime to 6, is

  𝒵(r; u) = Σ_{c primary, (c,6)=1} ψ(c) g̃(r, c) N(c)^{−u}  (Re u > 1, centre u = 1/2).

**The lever's dual is a stripped Kubota series in class 4** [PROVED; NUMERICAL]:

* (7/8, 4.7), with the bar restored (G = conj(χ_•(4))γ₃), gives μγ₂ = αG·conj(γ₁) on squarefree moduli.
* conj(γ₁(n)) = χ_n(−1)γ_{−1}(n).
* For (y, n) = 1, the index shift gives χ_n(y)^{−2}γ_{−1}(n) = g̃_{−1}(y⁴, n).

So B_y = Σ_{(n,6y)=1, sf} ν(n)α(n)G(n)χ_n(−1)·g̃_{−1}(y⁴, n)·W(N n/D): the α-twisted Kubota series of the 6-fold symbol
χ^{−1} at index y⁴, restricted to moduli prime to y. Here α(c) = c/|c|, and G, ν, χ(−1) are finite-order S-data.

**The class is forced.** In the Gauss-class ledger (cubic note Thm 2.4), [μγ₂] = x⁴ and [γ_t] = x^{3−t}, so only
t ≡ 5 (γ₅ = χ(−1)γ̄₁) carries μγ₂. For that family the twist χ_n(y)^{−2} is the index move y ↦ y^{−2}, whose least
integral representative modulo sixth powers is y⁴ for squarefree y. The conjugate orientation gives the same class.

The obvious alternative, reading γ₂conj(χ(y))² as the cubic Kubota coefficient at index y (class 1, where Prop 5.1 would
give exponent 1), is not available: μγ₂ is not a sequence of cubic Kubota coefficients, and μ is absorbed only through
(4.7), which moves the series to the 6-fold symbol.

Independent checks (referee code): (4.7) with the bar holds on 30 moduli to 1.7·10⁻¹⁵ and fails without it by 1.73;
γ₂³ = μα to 3.4·10⁻¹⁵; the class-4 identity holds to 2.8·10⁻¹⁵; index y² differs in 98 of 145 cases (expected about
2/3).

### 2.2 The index-r coefficient at one prime

Fix a good prime p, q = N(p), and X = q^{1/2−u}. For r = r′p^e with p ∤ r′ and 0 ≤ e ≤ n − 1, the p-power moduli are
given by the table G₀ of DIPP §4.1.1 [PROVED; NUMERICAL]. Normalised, with index exponent k and modulus exponent l:

| case | g̃(·p^k, p^l) |
|---|---|
| l = 0 | 1 |
| l = k + 1, n ∤ l | Gauss sum, modulus q^{k/2} |
| l = k + 1, n \| l | −q^{(k−1)/2} |
| k ≥ l, n \| l | q^{l/2}(1 − 1/q) |
| otherwise | 0 |

Write D(p^e) for the full series and S_e for the series over moduli prime to p (the "stripped" series of class e).
Twisted multiplicativity and sextic reciprocity then give [PROVED; = DIPP Lemma 4.2.2 = CG Lemmas 5.3–5.4]:

  D(p^e) = S_e + β_e X^{e+1} S_{e*},  e* ≡ −e − 2 (mod n),

where β_e = ψ(p)^{e+1} g_{e+1}(p)/q. Here |β_e| = q^{−1/2}, except β_{n−1} = −1/q. The reciprocity sign R(c₀, p) = ±1 is a
character of conductor dividing 4 and is absorbed into ψ.

For the lever (n = 6, e = 4): e* = 0, so the coupled series carries no character of p.

Independent checks: the G₀ table holds on 378 values (n = 6 with ε = ±1, and n = 3) to 2.3·10⁻¹⁴; the coupling ratio is
±1 in all 21 cases (n = 6, e = 0..4; n = 3, e = 0, 1) to 1.4·10⁻¹⁵.

### 2.3 The functional equation

[CITED: DIPP arXiv:2607.27131v1 Thm 4.1.4 = BB06 Thm 1, text read; CG arXiv:0803.0691v2 Prop 5.1, text read. Kubota
1969/1971 and BB06 itself were not read.]

  Λ(r, u) := G_n(u) ζ_K^S(nu − n/2 + 1) 𝒵(r; u),  G_n(u) = (2π)^{−(n−1)(u−1/2)} Γ(nu − n/2)/Γ(u − 1/2),

  Λ(r, u) = ψ(r) **N(r)^{1/2−u}** Π_{v∈S_f}(1 − q_v^{nu−n/2−1})^{−1} Σ_{η∈K_S^×/(K_S^×)^n} P_η(u)ψ(η) Σ_E K_{η,E,[r]} Λ_E(r, 1 − u).

* **Same index on both sides.** |r| = N(r), so the index factor has exponent 1 in N(r). CG writes the same factor as
  |a|^{1−s}, with centre s = 1.
* **Degree.** By Gauss multiplication, G_n(u) ∝ Π_{j=1}^{n−1} Γ(u − 1/2 + j/n). That is n − 1 Gamma factors over K: 2
  for n = 3 and **5 for n = 6**. The referee checked the n = 6 identity to 10⁻²⁵ with mpmath.
* **Local factors at the primes dividing 6.** In the DIPP/BB06 form, for n = 6 these would be (for Q(ω) this is the
  expected shape, not an established statement, see the hypothesis gap below):
  * the Euler factors (1 − 3^{6u−4})^{−1}(1 − 4^{6u−4})^{−1};
  * the Dirichlet polynomials P_η in 3^{−u} and 4^{−u};
  * the unimodular constants K_{η,E,[r]};
  * a finite mixing over η (S-units modulo sixth powers) and E (ray classes).

  The index r enters these only through its class modulo n-th powers and S-units, a finite set. So they set a fixed base
  conductor Q₀ and never touch the exponent of N(y) when (y, 6) = 1. If y meets 6, Lemma 4.1 of the 7/8 paper turns the
  S-part of χ_•(y) into another fixed ray character. Q₀ is not computed. Derivation 2 measures Q₀ ≈ 1.6·10³ at n = 3
  and Q₀ ≳ 6·10⁵ at n = 6.
* **Index exponent from the archimedean place.** In H³ coordinates the r-th Fourier coefficient is D(r, s)·J_s(r, v),
  with J_s(r, v) ∝ v|r|^{2s−1}K_{2s−1}(c|r|v). The cover splits at the complex place, so this holds for every n, and
  K_{2s−1} = K_{1−2s}. Comparing the r-th coefficients of E(s) = M(s)E(1 − s) gives D(r, s) = N(r)^{1−2s}·(r-free
  S-data)·D(r, 1 − s), i.e. N(r)^{1/2−u} with u = 2s − 1/2. [PROVED, given the existence of the FE; derivation 1 Prop W,
  derivation 2 §3.1]
* **The α twist** changes only the archimedean K-type, hence the Gamma factors and the orientation α ↔ ᾱ on the dual
  side, not the index factor. At n = 3 the shift is visible: Prop 5.1 has Γ(s + 1/3)Γ(s + 2/3).
* **The hypothesis gap.** BB06 and DIPP assume μ_{2n} ⊂ K. Q(ω) contains μ₆ but not μ₁₂. For n = 6, therefore, the
  functional equation is Kubota's for the 6-fold cover (μ₆ ⊂ K suffices), the index factor is the archimedean one above,
  and the explicit S-data are not written out in any source read here. The nonspherical (α-twisted) Eisenstein FE is
  taken from the general theory of Eisenstein series on covering groups [CITED, not read].

### 2.4 Local factors at a prime of the twist, and the conductor

Solve the 2 × 2 transfer system for (e, e*). Apply the FE to the two full series; the p-factor of the ζ-ratio is
E_p = (1 − X^n/q)/(1 − X^{−n}/q). Then re-expand on the dual side. This gives [EXACT; derivation 2 (R), re-derived by the
referee directly from DIPP Lemma 4.2.2 + Thm 4.1.4, check B1]:

  (R)  S_e(u) = Φ/(1 − X^{−n}/q) · [ (1 − 1/q) X^e S′_e + β_e (X^{−1} − X^{n−1}) S′_{e*} ]   (e* ≠ e),
  (R′) S_{n−1}(u) = X^{n−1} Φ S′_{n−1}.

Here S′ are the stripped dual series at 1 − u, Φ carries no p-dependence, and 1/(1 − X^{−n}/q) = Σ_k q^{−k}X^{−nk} only
shortens dual lengths. A factor X^m multiplies the dual length by N(p)^m. So:

| n | class e | main term (exponent, class, weight) | secondary (exponent, class, weight) |
|---|---|---|---|
| 3 | 0 | 0, class 0, 1 − 1/q | 2, class 1, q^{−1/2} |
| 3 | 1 | 1, class 1, 1 − 1/q | 2, class 0, q^{−1/2} |
| 3 | 2 | 2, class 2 (clean) | — |
| 6 | **4 (lever)** | **4, class 4, 1 − 1/q** | **5, class 0, q^{−1/2}** |
| 6 | 5 | 5, class 5 (clean) | — |

**Conductor of the reflected B_y** [PROVED-rel to §2.3]. The local reflections at distinct primes of a squarefree y
compose; the reciprocity characters belong to ψ. This gives:

* **Main term:** Π_{p|y}(1 − 1/q_p)X_p⁴·S′₄. Length ∝ Q₀N(y)⁴/D, class 4. Its columns carry χ_{c′}(y)^{−2}, so the cubic
  large sieve applies with N(y)⁴/D columns. **a = 4.**
* **Mixed pieces** (secondary at T ⊆ {p | y}): length ∝ Q₀Π_{p∉T}N(p)⁴Π_{p∈T}N(p)⁵/D, weight Π_{p∈T}N(p)^{−1/2}, class 0
  at T. Mean-square cost Q₀N(y)⁴/D. In model A-V they never dominate (derivation 1 §6). Re-reflected, they are
  O(Π_{p∈T}N(p)^{−1}) times class-4 sums of length D (derivation 2 §3.6).
* **Rows with square factors** (y₀ = y₁y₂²): class 2 at the primes of y₂, so the exponent there is 2 = 1 per unit of
  log N(p²). These rows are sparse, and they only lower dual lengths.

**A sign at n = 6** (derivation 2 §3.7, not verified by anyone). Here β₄β₀ = χ_p(−1)/q. If that sign were not absorbed
by the S-data, (R) would carry an extra factor (1 − X⁶/q)/(1 + X⁶/q) and the main weight would become 1 + 1/q. Neither
change raises an exponent (the extra factor tends to −1 as |X| → ∞). a is unaffected.

---

## 3. Calibration at n = 3 against 7/8 Prop 5.1

Source: `~/lean-deps/qrh-verify/paper.txt`, Prop 5.1 (lines 1390–1580) and its proof (lines 1581–2043), read for this
note. Prop 5.1 is the theta-index reflection R1 of T(s, Ψ) = L₀(s, Ψ)D(s, Ψ), with D = Σ_n γ₂(n)ᾱ(n)Ψ(n)q_n^{−s} and
Ψ ∋ χ_p^{j_p}. Its output is the dual sum Σ_µ d(µ)α(µ)ϑ(λ⁴µ)Π_p B_p(λ⁴µ)q_µ^{−1/2}V♯(q_µX/q_c²), with c = c_F·Π_{active} p
and

  B_p = χ_p^{−j_p−2} (j_p ≠ 0, 4);  B_p = q_p^{−1/2}(−1 + q_p 1_{p|x}) (j_p = 4);  B_p = q_p^{−1/2}χ_p^{−2} (j_p = 0, active);

an inactive j_p = 0 prime contributes the scalar 1 − q_p^{−1}.

R1 and R2 are two functional equations of the same Dirichlet series, so their local data must agree. That is what makes
Prop 5.1 a calibration of R2.

### 3.1 Class map [PROVED; NUMERICAL]

For even j, cubic reciprocity gives χ_p(n)^j = χ_n(p)^j, and the index shift gives γ₂(n)χ_p(n)^j = g̃₂(p^e, n) with
e ≡ −j/2 (mod 3). So j_p = 0, 2, 4 are the classes e = 0, 2, 1. The convention χ_p(x)⁰ = 1_{p∤x} makes D and L₀ both
stripped at p.

* Odd j_p are sextic twists of cubic Gauss sums, not index moves. For them Prop 5.1's twisting rule (scale q_p²) is
  correct.
* The lever's twist is an index move.

The referee code reproduces the map uniquely.

### 3.2 Local factors rebuilt from the printed statement [EXACT]

Inputs:
* each active prime contributes (q_p²)^{1/2−s} = X²;
* the dual variable is w = 1 − s, with q^{−w} = q^{−1/2}X^{−1};
* (5.2)/(5.9) give d(uλ^k n b³) ∝ |b|g̃₃(n). So v_p(µ) = 3k contributes q^{k/2} in class 0, and v_p(µ) = 3k + 1
  contributes q^{k/2}g̃₃(p) times a class-1 twist (twisted multiplicativity and cubic reciprocity);
* one cube step is Y = q^{1/2−3w} = X^{−3}/q.

Summing B_p over v_p(µ):

| j_p (class) | Prop 5.1, rebuilt | Kubota side, (R)/(R′) at n = 3 | match |
|---|---|---|---|
| 2 (e = 2) | X²·S♯₂ (B_p vanishes on p \| µ) | X² S′₂ | exact |
| 4 (e = 1), v_p(µ) ≡ 1 (mod 3), where B_p = q^{1/2}(1 − 1/q) | (1 − 1/q)X/(1 − X^{−3}/q) · g̃ S♯₁ | main (1 − 1/q)X S′₁/(1 − X^{−3}/q) | exact |
| 4 (e = 1), v_p(µ) = 0 (B_p = −q^{−1/2}) plus v_p(µ) = 3k ≥ 3 | q^{−1/2}(X^{−1} − X²)/(1 − X^{−3}/q) · S♯₀ | secondary β₁(X^{−1} − X²)S′₀/(1 − X^{−3}/q) | exact, with \|β₁\| = q^{−1/2} |
| 0 (e = 0), inactive | (1 − 1/q)/(1 − X^{−3}/q) · S♯₀ | main (1 − 1/q)S′₀/(1 − X^{−3}/q) | exact |
| 0 (e = 0), active + inactive class-1 part | (1 − 1/q)g̃q^{−1/2}X^{−1}/(1 − Y) + u₀q^{−1/2}X² | secondary β₀(X^{−1} − X²)/(1 − X^{−3}/q) | exact iff β₀ = g̃q^{−1/2} and u₀ = −g̃ |

The last row's sign is carried by Prop 5.1 (ω_{p,0} = −τ⁺_{p,2}χ_p(ε_p)^{−2}).

**What "exactly" covers.** Every power of X, every power of q, the factor 1 − q_p^{−1}, the Ramanujan structure and the
cube completion of Prop 5.1 are reproduced. The unimodular constants (τ^±, χ_p(σ_p), ε_p, κ_F, K_{η,E}) are matched in
modulus only (and, for j_p = 0, in relative sign), not as complex numbers. They do not affect any conductor.

Checks: derivation 2's symbolic §C (rerun, identical) and the referee's independent rebuild B2, coded from the printed
statement.

### 3.3 The index exponent is forced

Suppose the FE had index factor N(r)^{κ(1/2−u)}.

* Then (R′) at n = 3, e = 2 reads X^{2κ}. Prop 5.1 gives X² at j_p = 2, so κ = 1 (derivation 2 §4.3).
* The referee checked j_p = 4 separately: of κ ∈ {1/2, 1, 2}, only κ = 1 reproduces both its main and its secondary part
  (check B3).
* κ comes from the archimedean Whittaker function (§2.3), which is the same for every n. So κ = 1 at n = 6, and the
  lever's exponent is 4κ = 4.

### 3.4 The two referee readings

* **Referee 1** ("index π → N(π), index π² → N(π)²") reads the main term: exponent = index class. Transported to the
  lever's class 4, this gives 4. Confirmed.
* **Referee 2** ("q_c² for both j_p") reads the scale Prop 5.1 displays, which is the maximal scale q^{n−1}. At n = 3 that
  is the secondary for j_p ∈ {0, 4} and the clean main term for j_p = 2. Transported by the same rule, the maximal scale
  at n = 6 is q⁵, not q².
* **The second pass's a = 2** came from a "degree-2 twisting rule". A twisting rule with the correct degree, n − 1 = 5
  Gamma factors over K, gives the maximal scale N(y)⁵, again not N(y)². The value 2 at n = 6 would need one of three
  things, each excluded:
  * a degree-2 FE for this series, contradicted by its 5 Gamma factors;
  * a class-2 realisation of μγ₂χ(y)^{−2}, excluded by the ledger;
  * κ = 1/2, contradicted by Prop 5.1 (κ is archimedean, hence the same for n = 3 and n = 6).

### 3.5 Numerical corroboration at n = 3 [NUMERICAL, illustration, not proof]

Both derivations' collapse tests measure the dual-length exponent of the twisted cubic series.

* Derivation 2, shape-free isotonic fit, N(c) ≤ 2·10⁶, 67 twisting primes:
  * e = 1 (j_p = 4): 1.00, bootstrap [0.87, 1.13]; the score difference against exponent 2 is 97.8;
  * e = 2: 2.75 [1.17, 4.00];
  * e = 0: 0.
* Derivation 1, joint logistic fit, X = 10⁵:
  * a₁ = 1.25 [1.14, 1.35], a₂ = 2.59 [2.36, 2.78];
  * costs: free 2395.7, a_e = e 2425.7, twisting rule 3459.9.

In both, the e = 1 drop moves with N(h)¹, which rejects "exponent 2 for every cubic twist" as the unit-weight exponent.
The ratio a₂/a₁ is about 2. At n = 6 no exponent is measurable at feasible height (Q₀ ≳ 6·10⁵; class 4 at N(y) = 7 would
need D ≳ 1.4·10⁹). The campaign's E1–E3 could not separate a = 2 from a = 4.

---

## 4. Referee comparison of the two derivations

| item | derivation 1 | derivation 2 | referee finding |
|---|---|---|---|
| class y⁴, forced | Lemma E, ledger | §2, ledger + μ absorption | agree; independent check A2; (4.7) bar confirmed (A0) |
| prime-power table, transfer | Lemma A, Lemma B | §3.4, (F2) | agree; = DIPP 4.1.1 / Lemma 4.2.2 and CG Lemmas 5.3–5.4 (texts read); checks A1, A3 |
| FE index factor | cited + Prop W | Jacquet integral + cited; κ forced by Prop 5.1 | agree; DIPP Thm 4.1.4 and CG Prop 5.1 texts confirm "same index, \|a\|^{1/2−s}" with \|·\| the norm |
| local reflection | two pieces; main weight given as 1 | exact (R): main weight 1 − 1/q | agree on exponents; (R) is the exact form; re-derived from DIPP (B1) |
| n = 3 calibration | L4c is a hand-transcribed comparison; L4b checks Prop 5.1's own local sums (5.11) | symbolic rebuild, exact in X and q | the substantive calibration is derivation 2's; the referee's independent rebuild B2 agrees; κ = 1 from both j_p = 2 and j_p = 4 (B3) |
| secondary piece | mean-square cost N⁴/D | class 0, O(q^{−1}) after re-reflection | both valid; neither changes a |
| μ₁₂ ⊄ Q(ω) | flagged; relies on Prop W | flagged; also a sign χ_p(−1) at n = 6 | shared residual risk; exponent-neutral (§2.4) |
| Framework A | θ_A = 11/12 − 1/(6a) (small c) | same table | rerun identical; independently re-implemented (check C) |
| Framework B at a = 4 | quotes referee 1's 1.046 | reruns it: 1.04598 | rerun identical (both scripts) |
| data-module closed form for θ_A | — | valid on λ ≥ 1 only | confirmed: at a = 4, c = 1/2 it gives 29/30, the all-λ minimum is 7/8; the module's existing assertion (c = 2/3 → 1) is unaffected |

No error was found that affects a. Three minor points:
1. Derivation 1's "weight 1" for the main piece is exactly 1 − 1/q.
2. Derivation 1's L4c bookkeeping transcribes Prop 5.1's pieces by hand, so it is not an independent computation.
3. Derivation 2's stated run time for the symbolic script (about 40 s) is about 1 s.

---

## 5. Numerical checks rerun

All with `.venv-arb/bin/python`, outputs in `/tmp/cr2-verdict/`.

| script | result | vs stored log |
|---|---|---|
| `tmp/cubic-r2-1-local.py` | L1 1836 values 1.71e-13; L2 28 cases 1.99e-15; L3 281 pairs 4.34e-15 (y²: 92/281); L4a unique map; L4b 5.30e-16 / 3.1e-15 | identical (timing only) |
| `tmp/cubic-r2-1-frameworkA.py` | a = 4: 1 (c = 2/3), 14/15 (8/13), 7/8 at λ = 3/4 (c ≤ 8/15) | identical |
| `tmp/cubic-r2-1-collapse.py 100000 3 200` | a₁ = 1.25 [1.14, 1.35], a₂ = 2.59 [2.36, 2.78]; costs 2395.7 / 2425.7 / 3459.9 | identical (timing only) |
| `tmp/cubic-r2-2-local.py` | L1–L5 all pass (7.3e-14, 1.6e-15, 7.4e-15, 2.6e-15, 3.5e-15) | identical |
| `tmp/cubic-r2-2-symbolic.py` | (R), (R′), (R″); n = 3 calibration; κ = 1 only | identical |
| `tmp/cubic-r2-2-composite-check.py` | (4.7) with bar: 12 primes 8.5e-16, 301 composites 9.9e-15; without bar fails by 1.73 | identical |
| `tmp/cubic-r2-2-frameworkA.py`, `-refgrid.py`, `-refB.py` | exact a = 4 values; grid artefact 0.8749 vs exact 7/8; Framework B 0.80664 / 1.04598 / 1.30460 at a = 2 / 4 / 5 | identical |
| `tmp/cubic-r2-2-isotonic.py ... 60` (saved data) | e = 1: 1.00 [0.87, 1.13]; e = 2: 2.75 [1.17, 4.00]; e = 0: 0.00 | identical |
| **`tmp/cubic-r2-verdict-check.py`** (new, independent code) | A0–A4, B1–B4, C: all pass, 2.6 s | — |

Not rerun:
* derivation 1's X = 3·10⁵ collapse (about 4 min, 4 GB);
* derivation 2's C-program regeneration of the Gauss-sum tables (about 6 min); its saved data were used;
* derivation 1's n = 6 run (uninformative).

Not done by anyone: a direct numerical test of the functional-equation identity itself (this needs the explicit
S-scattering data and cusp coefficients), and any n = 6 measurement (Q₀ ≳ 6·10⁵).

---

## 6. Consequence for the cubic lever

**Framework A** (model A-V, exact within the model) [HEURISTIC model; EXACT within it; checks C and both derivations]:

| a | c = 2/3 (Heath-Brown) | c = 8/13 | c ≤ 8/15 |
|---|---|---|---|
| 2 (withdrawn) | 8/9 | 7/8 | 5/6 at c = 1/2 |
| 3 | 23/24 | 14/15 | 31/36 |
| **4** | **1** | **14/15** | **7/8, at λ = 3/4 (tie)** |
| 5 | 1 | 14/15 | 53/60 |

For c ≤ 1/2 the model does not depend on c, and θ_A = 11/12 − 1/(6a), attained at λ = 1/2 + 1/a. So θ_A < 7/8 iff
a < 4. At a = 4 no cubic sieve exponent gives θ_A < 7/8.

**Framework B** (the referee's constraint set with the cubic-kernel penalty generalised to T_d = aM + (a − 1)ℓ − 1)
[HEURISTIC]: σ₀ = 1.04598 at a = 4, i.e. trivial. This model was not re-derived from 7/8 Lemma 15.1 at general a.

**Status after the verdict:**
* The cubic lever is closed in both frameworks, as sufficient-estimate architectures. It is not a statement about the
  actual probe (atlas §9).
* Withdrawn (all rested on a = 2): 8/9 with Heath-Brown, the threshold c < 8/13, the Framework-B count ≈ 0.807 (kernel
  variants 0.797–0.838), its ≈ −0.02 conditional-Λ price, and "not dead at the automorphy step".
* Unchanged: best θ = 7/8 (openai/math manuscript, Lean-checked by its authors, unrefereed); PR #14's B = 0.87488665,
  conditional on Xu–Sang v2 and on the 7/8 theorem; PT Λ ≤ 0.2; RH open; NO QED.

**The six-input work list is moot at a = 4.** It was: R2 with cusp data; cubic Lemmas 5.5, 14.2, 14.3, 15.1; a cubic
Gram bound; a λ-adic device; the k = 3 high side; an endpoint certificate. Completing it would build a Framework-B probe
whose model count is 1.046.

**What would reopen the lever** (none is available):
1. A twist-changing, index-variable reflection for the 6-fold object, i.e. a 6-fold index–modulus (Patterson-type)
   identity. Local theory does not supply one (Kazhdan–Patterson non-uniqueness [RECALLED]), and a GL(2)-type FE would
   conflict with the 5 Gamma factors.
2. A large-sieve bound for the class-4 reflected sums that gains beyond what their conductor gives, i.e. an effective
   a < 4 in model A-V together with c ≤ 1/2 (with Heath-Brown's c = 2/3 it would need a < 13/7).
3. A realisation of μγ₂χ(y)^{−2} by an automorphic object of smaller conductor. Excluded within Gauss-sum families by
   the ledger [PROVED-rel].

---

## 7. Status of each claim

| claim | status | evidence |
|---|---|---|
| B_y = stripped α-twisted 6-fold Kubota series at index class y⁴; class forced | PROVED (given (4.7) with the bar) | both derivations; A0, A2 |
| prime-power table; transfer D(p^e) = S_e + β_e X^{e+1}S_{e*} | PROVED; = DIPP 4.1.1, Lemma 4.2.2; CG Lemmas 5.3–5.4 | A1, A3; texts read |
| FE with index factor N(r)^{1/2−u} at the same index, n − 1 Gamma factors | CITED (DIPP Thm 4.1.4 = BB06 Thm 1; CG Prop 5.1; hypothesis μ_{2n} ⊂ K) | texts read; Gauss multiplication checked |
| index factor for n = 6 over Q(ω) and for the α twist | PROVED-rel (archimedean homogeneity, given Kubota's FE and the general Eisenstein FE on covers) | not in a read source with S-data |
| local reflection (R), (R′); exponent table | EXACT given the FE | derivation 2 symbolic; B1 |
| n = 3: (R)/(R′) reproduce Prop 5.1 item 2 for j_p ∈ {0, 2, 4} | EXACT in X and q; units in modulus only | derivation 2 §C; B2 |
| κ = 1 forced by Prop 5.1 | EXACT | B3 (j_p = 2 and j_p = 4) |
| **a = 4** (main); secondary exponent 5 at weight N^{−1/2}; a ≠ 2 | PROVED-rel to the FE | §2.4 |
| sign χ_p(−1) at n = 6 | not verified; exponent-neutral | §2.4 |
| n = 3 collapse exponents (1 for e = 1, about 2–2.6 for e = 2) | NUMERICAL (illustration) | reruns identical |
| n = 6 exponents | not measurable (Q₀ ≳ 6·10⁵) | derivation 2 §6.3 |
| θ_A = 11/12 − 1/(6a) for c ≤ 1/2; a = 4 gives ≥ 7/8 | EXACT within model A-V (HEURISTIC model) | C; both derivations |
| Framework B 1.04598 at a = 4 | NUMERICAL within the referee's model (HEURISTIC) | refB, cond_exp |

---

## 8. Reproduction

```
cd /Users/USER/Documents/GitHub/mathexplorer
.venv-arb/bin/python tmp/cubic-r2-verdict-check.py          # referee: independent A0-A4, B1-B4, C (about 3 s)
.venv-arb/bin/python tmp/cubic-r2-1-local.py                # derivation 1 L1-L4 (2 s)
.venv-arb/bin/python tmp/cubic-r2-2-local.py                # derivation 2 L1-L5 (< 1 s)
.venv-arb/bin/python tmp/cubic-r2-2-symbolic.py             # (R), calibration, kappa (about 1 s)
.venv-arb/bin/python tmp/cubic-r2-2-composite-check.py      # (4.7) with / without the bar (about 1 s)
.venv-arb/bin/python tmp/cubic-r2-1-frameworkA.py           # model A-V exact table
.venv-arb/bin/python tmp/cubic-r2-2-refB.py                 # Framework B at a = 2, 4, 5
.venv-arb/bin/python tmp/cubic-r2-1-collapse.py 100000 3 200        # n = 3 collapse (about 30 s)
.venv-arb/bin/python tmp/cubic-r2-2-isotonic.py tmp/cubic-r2-2-data/collapse-X2000000.json 60   # (about 1 min)
```

**References.**
* A. Diaconu, B. Ion, V. Paşol, A. A. Popa, arXiv:2607.27131v1: §4.1.1 (G₀), §4.1.3 (G(s)), Thm 4.1.4 (= [BB06] Thm 1),
  §4.1.8, Lemma 4.2.2. Read (local copy `/tmp/cr2-1-lit/dbip/`).
* G. Chinta, P. E. Gunnells, arXiv:0803.0691v2: §5, (5.1)–(5.3), Prop 5.1, Lemmas 5.3–5.4. Read (`/tmp/cr2-1-lit/cg/`).
* B. Brubaker, D. Bump, On Kubota's Dirichlet series, J. reine angew. Math. 598 (2006). Not read; cited through the two
  above.
* T. Kubota, On automorphic functions and the reciprocity law in a number field (1969). Not read.
* openai/math family 003, 7/8 manuscript: (4.7), Prop 5.1 with proof, (5.2), (5.9)–(5.11). Read.
* Route atlas (refs/pr/27, `research/rh/modules/historical-routes.md`), §§9, 10, 12. Read.
