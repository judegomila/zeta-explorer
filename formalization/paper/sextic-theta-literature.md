# Sextic theta coefficients: literature survey for the exceptional term of 7/8 Prop 15.2

Internal working note, 2026-11-03. Branch `editorial-redesign`. Nothing committed, nothing sent upstream, not refereed.
Literature survey only: no new theorem is claimed. Downloads (untrusted, read as text only) are in `/tmp/sextic-lit/dl/`,
text extractions in `/tmp/sextic-lit/txt/`.

Inputs read first: `zf-campaign-synthesis.md`, `zf-campaign-new-probe.md` (§7, §11), `cubic-r2-conductor-verdict.md` and
both `cubic-r2-conductor-derivation-*.md`, `beat78-prop152-subtract.md` (§§2–7), `src/data/zero-free-campaign-2026-11-01.js`,
`src/data/beat78-prop152-2026-10-09.js` (referee-corrected statuses), the 7/8 paper `~/lean-deps/qrh-verify/paper.txt`
(§4.2 incl. (4.7), §5.1 Prop 5.1, §6.1, §15.2 Prop 15.2), the 11/12 paper `paper2.txt` (§2.4, eq. (2.10)), and atlas §10
(`git show refs/pr/27:research/rh/modules/historical-routes.md`).

Labels:
* **[CITED-read]**: statement read in the source (text or abstract named in the entry).
* **[CITED-via X]**: read only as quoted by source X.
* **[PROVED-lit]**: a theorem in the cited source.
* **[CONJ-lit]**: a conjecture in the cited source.
* **[NUM-lit]**: numerical evidence reported in the cited source.
* **[DERIVED]**: a short deduction made here from a cited statement.
* **[HEURISTIC]**: bookkeeping or an unverified structural remark made here.

---

## 0. Answer

**What is known for n = 6 (theta function on the 6-fold cover of GL₂ over Q(ω)).**

1. **Definition and analytic continuation.** θ₆ is Kubota's residue of the 6-fold metaplectic Eisenstein series. Its
   Fourier coefficients are residues of Kubota Dirichlet series of sextic Gauss sums. These series have meromorphic
   continuation, a vector-valued functional equation with explicit S-local data (Eckhardt–Patterson §5, written out for
   n = 6 over Q(ζ₆) by Bröker–Hoffstein §§3–4), and convexity bounds (Patterson 1987). [PROVED-lit]
2. **Hecke theory.** Kazhdan–Patterson periodicity and the Hecke relations give, for (m, p) = 1:
   τ(mp⁶) = N(p)^{1/2}τ(m), τ(mp⁵) = 0, τ(mp⁴) ∝ τ(m), τ(mp) ∝ τ(mp³), and τ(mp²) ∝ τ(mp²) (self-relation through a
   quadratic Gauss sum). Two local coefficients per prime are left free: τ(π) (equivalently τ(π³)) and τ(π²).
   [PROVED-lit / CITED-via CFH12, BH16, DDHL]
3. **Local non-uniqueness.** The local theta representation has a Whittaker space of dimension > 1 for n = 6. On GL_r,
   the dimension is 1 only for r = n, or for r = n − 1 under a condition on the cover (Kazhdan–Patterson Cor. I.3.6).
   For the Kazhdan–Patterson 6-fold cover of GL₂, Gao–Shahidi–Szpruch (§4.3.2, from Gao's formula) give
   dim Wh_ψ(Θ) = m(n−1)/d = 15/d with d = gcd(4p+1, 6), i.e. 15 or 5 depending on the cover. The unramified theta
   constituents of its restriction to SL₂^{(6)} have dimensions 2 and 1 (GSS Thm 4.9(ii)). [CITED-read]
4. **Even part (local exponents 0, 2, 4).** The Chinta–Friedberg–Hoffstein conjecture predicts τ₆(m₁²m₂⁴) in terms of
   cubic Gauss sums, e.g. τ₆(p²) = 2G₁⁽³⁾(1, p). Status:
   * proved over F_q(T) [PROVED-lit];
   * numerically supported over Q(ζ₆) after a 3-adic correction [NUM-lit];
   * reproduced at square indices by a Friedberg–Ginzburg descent function that is conjectured, not proved, to equal θ₆
     [PROVED-lit for the descent function].
5. **Odd part (local exponents 1, 3; this contains the squarefree indices).** No formula, proved or conjectured, at
   composite squarefree indices.
   * At prime indices only τ(π)² is conjectured (Bröker–Hoffstein Conj. 5.7), with unexplained extra factors: 3^l and
     elements of norm 7 or 13, and no pattern found. [CONJ-lit, NUM-lit]
   * Over F_q(T), Patterson (2014) finds that coefficients at r with three prime factors are hypergeometric-type character
     sums, "irregular" outside the n = 4 and CFH square cases, and that "a complete evaluation does not seem [a]
     reasonable expectation". [CITED-read]
6. **Quantitative information.**
   * Mean square (Rankin–Selberg): this is the size Prop 15.2's exceptional term already records. [standard; not located
     in a read source]
   * Individual convexity bound: residue ρ₆(r) ≪ N(r)^{1/6+ε}. [DERIVED from Patterson's lemma as stated by Gao–Zhao]
   * First moment: the Mellin transform of θ₆ has its poles at u = 11/12 and 1/12. [CITED-read: CFH12 §5]

**Best available tools.** None of them evaluates or bounds the quantity Prop 15.2 needs.
* **Computation.** The explicit functional equation (EP92 §5 / BH16 (3.1), (3.10)) and Bröker–Hoffstein's Algorithm
  4.1 compute individual coefficients numerically. Examples: τ(1, V) to 16 digits; τ(π²) for N(π) < 8000; τ(π) for
  N(π) < 900. This is the right tool for the "cheap test" of the beat78 next step (§6.2), not a proof tool.
* **Structure.** The CFH double-Dirichlet-series / Rankin–Selberg method is the only method that has produced exact
  identities for coefficients of higher theta functions. It produces them only on the even part: the convolution with
  θ₂ picks out square indices, and the identity is conjectural over number fields.

**The precise gap.** Removing or reducing the P_a^{1/6} loss requires Hypothesis TRO(η): a power-saving bound,
beyond ‖ρ₆,σ(e₀·)‖₂·‖B‖₂, for the correlation

  𝔅 = Σ_m Σ_{c sf, n} ω(q_m/Q) · ρ₆,σ(e₀m) · τ₃(cn³)ν(cn³) · χ_{cn³}(m) · V(q_c q_n³/Z),

that is, a correlation between the coefficients of two different metaplectic theta functions (6-fold and 3-fold),
coupled by the sextic residue symbol, on rows e₀m whose good part is generically squarefree (odd part of θ₆).

The literature supplies none of the three things that could give such a bound:
1. a formula for the odd part of θ₆;
2. any non-mean-square information about it (mean-square and convexity inputs are saturated by the Cauchy–Schwarz
   extremal vector, subtract note §6);
3. any identity or bound for cross-cover correlations of this kind.

By Lemma 3.2 of the subtract note (S4 in the data module, graded PROVED as a tautological reduction), a bound for 𝔅
has the strength of the improved low-side estimate itself. So the missing input is a new arithmetic statement, not a
coefficient lookup.

**Consequences.**
* Best θ is still 7/8 (unrefereed manuscript). PR #14's 0.87488665 is still conditional. PT Λ ≤ 0.2 stands. RH is
  open. NO QED.
* No Λ was computed. The TRO model prices quoted in §1.3 are heuristic, not bounds.

**Side findings** (§6):
* BH16 writes out the explicit S-local functional equation for n = 6 over Q(ζ₆). This removes the "not in a read source"
  caveat of the cubic-r2 verdict. It is consistent with κ = 1 and a = 4.
* The beat78 "cheap test" (per-class X^{2/3} constants) can only probe the even part. Recommendation: treat the Prop 15.2
  evaluation and subtraction lever as closed unless a new idea for cross-cover correlations appears.

---

## 1. The object and the input Prop 15.2 would need

### 1.1 Where the sextic theta coefficients enter

* **The additive factor.** In the low sum (6.2) the additive factor is
  A_{m,σ,v}(Y′) = Y′^{−1}Σ_{s∈σ} W₁(q_s/Y′)χ_s(b*)(τξ(s))^{−1}(q_s/Y′)^{−1/2+iv}q_s^{−1/2}g_{χ_s}(s, −m) (7/8 §6.1).
* **Structure lemma S1.** For an explicit S-unit e₀, c_σ = κ_σ1_σ conj(χ_s(e₀))/τ, hence
  A_{m,σ,ν} = (κ_σ/τ)Ã_{σ,ν}(e₀m) (subtract note Lemma 2.2; referee grade PROVED relative to the paper).
* **Kubota series.** Ã_{σ,ν}(y) is a smoothed partial sum of the class-σ Kubota series Σ_s g₆(y, s)N(s)^{−w}.
* **Exceptional part.** Its residual ("theta") part at the Kubota pole is Res · Ŵ₁(1/6 + iν) · Y′^{−1/3} · ρ₆,σ(e₀m),
  where ρ₆,σ(y) is the residue of the class-σ series at index y (subtract note §5.1). This identification is
  [HEURISTIC] in the campaign notes and stays so here.

**Normalisations.** Bröker–Hoffstein (BH16) write θ^{(n)}(z) = τ(0)y^{1−1/n} + y Σ_{m≠0} τ_n(m)K_{1/n}(4π|m|y)e(mx)
and τ_n(m) = N(m)^{1/(2n)} Res A_m. CFH12 (2.4) gives the same relation. So ρ₆(m) = N(m)^{−1/12}τ₆(m) [CITED-read].

**Check against the campaign's size [HEURISTIC].** Assume Σ_{N(m)≤X}|τ₆(m)|² ≍ X, the Rankin–Selberg size of a
square-integrable residual form (standard, not located in a read source). Then Σ_{N(m)≤Q}|ρ₆(m)|² ≍ Q^{5/6}. That is
the size used in subtract note §5.1 to match the exceptional Gram term (Q/Y′)P_a^{1/6}.

### 1.2 Parity split of the coefficient function

Write the index as m = Π p^{e_p}. Periodicity τ(mp⁶) = N(p)^{1/2}τ(m) reduces e_p to {0, …, 5}. The coefficient
function then splits into two parts:

* **Even part:** all e_p ∈ {0, 2, 4}. This is the domain of the CFH conjecture (§2.5).
* **Odd part:** some e_p ∈ {1, 3}. Hecke relates exponent 1 to exponent 3 at each prime, and exponent 5 gives 0.

**Where the coherent block lives [HEURISTIC; counting only].** The block is e₀t⁶a⁶ (P14, new-probe note §7.2). Its Gram
pairing with B runs over all rows m, through ρ₆,σ(e₀m). The good part of a generic row is squarefree with positive
density, so the pairing ⟨A^θ, B⟩ is dominated by the odd part. No result in §2 reaches the odd part beyond conjectures
at single primes.

### 1.3 The needed statement, with referee-corrected values

**Hypothesis TRO(η)** (subtract note §6): for every rescaled J, class σ and height v,

  |Σ_{m≠0} Ω(q_m/Q)ξ(m)(q_m/Q)^{−iv}A_{m,σ,v}(Y′)B^J_{m,σ}(Z)| ≪ (1+|v|)^{J}(Q/Y′)^{1/2}P_a^{(1−η)/12}Z^{M′/2+ε}.

**How TRO relates to the low bound.**
* TRO is sufficient for the improved low bound. It is not claimed to be equivalent.
* Lemma 3.2 (S4) says that any improved bound for the low sum I is equivalent to the same bound for the aggregated
  exceptional piece I^E. So the exceptional piece must be estimated with the full strength of the target.

**The B rows (7/8 §6.1).** B_{m,σ}(Z) is a Mellin integral of T(s, ν_σθχ_•(m)) = L₀·D, with
D = Σ_{c sf} γ₂(c)ᾱ(c)Ψ(c)q_c^{−s}. Here γ₂(c) is the cubic theta coefficient at squarefree c (11/12 paper (2.10):
c_θ(nb³) = 3^{5/2}|b|χ_n(λ)²γ₂(n)), and the row m enters through the sextic symbol χ_{cn³}(m). Inserting the residual
part of A gives the correlation 𝔅 displayed in §0.

**Values.** These are the referee-corrected entries of `src/data/beat78-prop152-2026-10-09.js`.

| scenario | σ_low | status |
|---|---|---|
| TRO(η) at fixed paper geometry | 7/8 − η/96 | [HEURISTIC] |
| η = 0.1, fixed geometry | 839/960 = 0.873958 | [HEURISTIC] |
| η = 1, fixed geometry | 83/96 = 0.864583 | [HEURISTIC] |
| η = 0.1, re-optimised model | 0.87393 | heuristic model, not re-verified |
| η = 1, re-optimised model | 0.8636 | heuristic model, not re-verified |

**High-side cap.** At the paper geometry any low-side gain above about 2.9·10⁻⁴ in θ is blocked by the Lemma 20.2 margin
(2.2815·10⁻⁴). Beyond that, Part II must be re-proved at a re-optimised geometry.

**Λ.** The rate of about 0.003 of conditional Λ per 0.01 of θ is a price, not a bound (atlas §12;
`src/data/qrh-theta-and-improvement-2026-10-08.js`).

### 1.4 Three kinds of literature input that could help

| kind | what it would do | §2 finding |
|---|---|---|
| (a) explicit formula for ρ₆ at squarefree arguments: a 6-fold analogue of Patterson's τ₃(d) = g₃(1, d)/N(d)^{1/2} | make A^θ an explicit Gauss-sum polynomial, so ⟨A^θ, B⟩ could be reflected again, as Prop 5.1 does with the cubic theta | absent; not expected (KP, BH16 Conj. 5.7, Patterson 2014) |
| (b) an exact identity for the specific mean ⟨ρ₆,σ(e₀·), B⟩ (Rankin–Selberg or double Dirichlet series type) | evaluate the block, giving the "subtraction route" | absent; the only known identity of this type (CFH) is for square indices, via θ₂ |
| (c) a correlation or large-sieve-type bound that uses arithmetic of ρ₆ beyond its mean square | give TRO directly | absent |

---

## 2. Survey, source by source

Each entry gives three things: the precise statement, what it gives for n = 6 over Q(ω), and whether it can evaluate or
bound the mean that Prop 15.2's exceptional term needs (shortened below to "Needed mean").

### 2.1 Kubota (1969, 1971): the definition

**Statement** [CITED-via BH16 §1, CFH12 §1, DDHL §4.5]:
* For K ⊇ μ_n, the n-fold metaplectic Eisenstein series E^{(n)}(z, s) on H³ satisfies E(γz) = κ(γ)E(z) with
  κ(γ) = (c/d)_n on a congruence subgroup.
* Its constant term is y^{2s} + [ζ*_K(2ns − n)/ζ*_K(2ns − n + 1)]y^{2−2s}, which has a pole at s = 1/2 + 1/(2n).
* The residue there is the theta function θ^{(n)}.
* The m-th Fourier coefficient of E^{(n)} is A_m(s) = Σ_d g_n(m, d)N(d)^{−2s} times a K-Bessel factor.

**For n = 6:** it defines θ₆, with the pole at s = 7/12 (u = 2/3 for normalised Gauss sums), and expresses τ₆(m) as a
residue.

**Needed mean:** no. The residue representation is exactly the form in which Prop 15.2's A^θ already appears.

### 2.2 Patterson (1977, 1978), Deligne (1980), Heath-Brown–Patterson (1979), Heath-Brown (2000), Dunn–Radziwiłł (2024): the cubic case

**Patterson 1977 (Crelle 296)** [CITED-via BH16 §1 and the 11/12 paper (2.10)]:
* τ₃(m³d) = N(m)^{1/2}τ₃(d).
* For cube-free d, τ₃(d) = 0 if p² | d.
* For squarefree d, τ₃(d) = g^{(3)}(1, d)/N(d)^{1/2}, up to fixed constants at 3. The 11/12 paper's normalisation is
  c_θ(nb³) = 3^{5/2}|b|χ_n(λ)²γ₂(n).
* Method: a metaplectic converse theorem, identifying the Mellin transform of θ₃ with A₁(s) of E^{(3)}.
* Deligne (Bourbaki exp. 539) explains the product structure by uniqueness of the local Whittaker model (KP84
  introduction, read).

**Analytic statements about cubic Gauss sums:**

| source | statement | status |
|---|---|---|
| Patterson 1978 | conjecture: X^{5/6}/log X bias of cubic Gauss sums at primes | conjecture |
| Heath-Brown–Patterson 1979 | equidistribution of cubic Gauss sums at primes | [CITED-via DDHL §1.1] |
| Heath-Brown 2000 | unconditional upper bound for the sum at primes; cubic large sieve | [CITED-via DDHL §1.1 and 7/8 refs] |
| Dunn–Radziwiłł (Annals 200, 2024) | the asymptotic under GRH; an explicit level-aspect Voronoi formula for cubic Gauss sums; Heath-Brown's cubic large sieve sharp under GRH | [CITED-read: arXiv abstract] |

The 7/8 paper uses Dunn–Radziwiłł's unconditional explicit cusp expansions of θ₃ (§5, App. A) as its "fixed theta
input" (7/8 §5, l. 1377–1380). It also cites an OpenAI manuscript claiming an unconditional first moment; that manuscript
is not on the machine and is unverified.

**For n = 6:** these are the n = 3 tools underneath Prop 5.1 and the 11/12 / 7/8 architecture. None has a sextic
counterpart.

**Needed mean:** no. They control the B side (cubic), not ρ₆.

### 2.3 Kazhdan–Patterson (1984): theta representations on GL_r^{(n)}

**Statement** [CITED-read: KP84 introduction, Theorem I.3.5 and Corollary I.3.6, numdam scan, OCR]:
* Theta (exceptional) representations V₀(ω′) are defined as residues and as Langlands quotients.
* For |n|_p = 1, dim Wh(V₀(ω′)) equals the number of images in Z^r/Λ of the free W-orbits (orbits of size r!) of W
  acting on Z^r/nZ^r (Thm I.3.5; Λ is the lattice of the maximal isotropic subgroup of the metaplectic torus).
* That dimension is 1 iff either r = n − 1 and 2(c+1) ≢ 0 (mod n), or r = n (Cor. I.3.6). Here c is the twisting
  parameter of the cover.
  * The OCR of the congruence sign is ambiguous. The reading ≢ is the one consistent with Patterson's cubic case
    n = 3, r = 2, c = 0.
  * The introduction says: "they have a unique Whittaker model only when r = n − 1 or n".
  * Cai 2019 (abstract and introduction read) restates this as: generic iff n ≥ r; unique iff n = r or r + 1, the latter
    only for certain covers.

**Hecke relations and periodicity for the theta coefficients**, in the heuristic setting that ignores bad primes
[CITED-via CFH12 (2.5) and BH16 §1, both citing KP84 and Hoffstein 1993]. For p ∤ m and 0 ≤ i ≤ n − 2:

  τ^{(n)}(mp^i) = G_{i+1}(m, p)·τ^{(n)}(mp^{n−2−i}),  τ^{(n)}(mp^{n−1}) = 0,  τ^{(n)}(mp^n) = N(p)^{1/2}τ^{(n)}(m),

where G_j is the normalised Gauss sum of the j-th power of the n-th power residue symbol.

**For n = 6 (GL₂):**
* Uniqueness fails (r = 2 is neither n nor n − 1).
* The relations read: τ(mp⁵) = 0; τ(mp⁴) = G₅(m,p)τ(m); τ(mp) = G₂(m,p)τ(mp³); τ(mp²) = G₃(m,p)τ(mp²).
* G₃ is the normalised quadratic Gauss sum, so τ(mp²) = 0 unless m is a quadratic residue mod p, and is otherwise free.
* Free per prime: τ(π) (equivalently τ(π³)) and τ(π²). DDHL §1.2 states the general count as "n/2 − 1 undetermined
  coefficients among 1, π, …, π^{n−1}" for even n, which is 2 at n = 6.
* At a squarefree index r = p₁⋯p_k the relation at p₁ links τ(r) only to τ(p₁³p₂⋯p_k). Nothing links τ(mp) to τ(m) as
  in the cubic case τ₃(mp) = G₂(m, p)τ₃(m). So the odd part has no twisted multiplicativity.

**Gao–Shahidi–Szpruch** (arXiv:2102.08859, §4.3.2 and Thm 4.9, read) give the local numbers for the pair of n-fold
covers (GL₂, SL₂), n = 2m even, in their Brylinski–Deligne parametrisation (p, q) with 2p − q = −1 and
d = gcd(4p+1, n).
* GL₂ theta: dim Wh_ψ(π_{χ,Δ}) = m(n−1)/d, "the number of free W-orbits in X_{Q,n}" (|X_{Q,n}| = n²/d), from
  [Gao20, Thm 6.6]. At n = 6 this is 15 or 5. The count is over all classes of the Whittaker index modulo the torus
  action, so it is not the per-prime count of free Hecke coefficients above.
* SL₂ constituents, m odd (Thm 4.9(ii)): the unramified theta constituents π(ω_{γ0,j})_Δ have dimension (m+1)/2 and
  (m−1)/2, which is 2 and 1 at n = 6.
* So uniqueness fails for the GL₂ theta at n = 6, and also for one of its unramified SL₂ constituents.

**Needed mean:** no. These results explain why local theory determines nothing on the odd part. The prior notes
recalled them; they are now [CITED-read].

### 2.4 The quartic case n = 4: Suzuki (1983, 1997), Patterson (1984), Bump–Hoffstein (1989), Eckhardt–Patterson (1992), Hoffstein (1992), David–Dunn–Hamieh–Lin (2023/2026)

**Suzuki 1983 (Crelle 340)** [CITED-via DDHL §4.5]. For m squarefree, m ≡ 1 (mod λ³), (m, ν) = 1:
* ψ_β(m⁴ν) = ψ_β(ν);
* ψ_β(m³ν) = 0 for m ≠ 1;
* ψ_β(m²ν) = g₄(ν, m)N(m)^{−3/4}ψ_β(ν) for m ≡ 1 (mod 4). For m ≡ 1 + λ³ (mod 4) there is a sign (−1)^{(N(β)−1)/4}
  and the class β changes to β(1 + λ³);
* ψ_β(mν) = 0 unless every normalised quadratic Gauss sum g₂(mν/m₁, m₁) = N(m₁)^{1/2} (m₁ | m).

"The properties (4.37)–(4.41) say nothing about ψ⁽⁴⁾(π)". Suzuki's Rankin–Selberg approach determines arguments but not
moduli (FG18 introduction).

**Patterson's quartic conjecture** (Pat84, refined as EP92 Conj. 2.11) [CONJ-lit, CITED-via CFH12 §2, DDHL §4.5]:

  ζ(4w−1)Σ τ₁⁽⁴⁾(m)²N(m)^{−w} = (ζ(4w−1)Σ G₃⁽⁴⁾(1, m)N(m)^{−w})²,

which gives τ₁⁽⁴⁾(p)² = 2G₃⁽⁴⁾(1, p). This is CFH12's convention; BH16 writes G₁ with the conjugate symbol. Status:
* proved over F_q(T) (Hoffstein 1992);
* "shown to hold on average" by Bump–Hoffstein 1989 (as DDHL describe it; BH89 not read);
* BH89's weaker conjecture τ₁(p)G₁(1, p) = τ₃(p), i.e. the argument of τ₄(p), was proved over function fields by
  Suzuki 1997;
* over number fields: "remains wide open" (DDHL, v5, Jan 2026).

**DDHL** (arXiv:2306.11875v5, to appear in ANT) [CITED-read]:
* They prove Σ_{c≡β (4)} g̃₄(c)(c/|c|)^ℓΛ(c)R(N(c)/X) ≪ X^{5/6+ε} + X^{3/4+ε}|ℓ|^{3/2+ε}.
* The Type-I pole term uses Suzuki's evaluation at squares; without it, convexity gives only ψ⁽⁴⁾(m²) ≪ N(m)^{1/4+ε}.
* They state that for n ≥ 5 the Type-I series "has Dirichlet coefficients g̃_n(a^{n−2}, c), and consequently has a
  functional equation that behaves like a GL_{n−2}-object in a".

**For n = 6:** the quartic story is the template.
* The analogue of Suzuki's square-index theorem is the CFH conjecture: not proved over number fields.
* The analogue of τ₄(p)² is BH16 Conj. 5.7: irregular.
* The analogue of the DDHL Type-I obstruction at n = 6 is a GL₄-like functional equation in a.

**Needed mean:** no.

### 2.5 Chinta–Friedberg–Hoffstein (2012): the sextic square-index conjecture

**Conjecture 2.1** [CONJ-lit, CITED-read]:

  ζ(3u−1/2)Σ_m τ₁⁽⁶⁾(m²)N(m)^{−u} = ζ(3u−1/2)Σ_d G₁⁽³⁾(1, d)N(d)^{−u} · Σ_m τ₁⁽³⁾(m)N(m)^{−u}.

Coefficientwise, for m₁, m₂ squarefree and coprime:

  τ₁⁽⁶⁾(m₁²m₂⁴) = G₁⁽³⁾(1, m₂)²G₁⁽³⁾(1, m₁)(m₂/m₁)₃Σ_{m₁=d₁d₂}(d₂/d₁)₃,

and in particular τ⁽⁶⁾(p²) = 2G₁⁽³⁾(1, p).

**Evidence.**
* Poles and gamma factors match. They are obtained by viewing the left side as the residue of
  Z₁(s, w) = Σ_{d,m} G₁⁽²ⁿ⁾(m², d)N(d)^{−s}N(m)^{−w}, a double Dirichlet series that is the Rankin–Selberg convolution of
  E^{(2n)} with θ₂ (§§3–5).
* Proved over F_q(T) for odd n (Thm 6.3, under their conditions on q: q ≡ 1 (mod n), q ≡ 1 (mod 4), q an even power
  of the characteristic). This covers 2n = 6.
* For the analogous 2n-fold statements with n ≥ 4, the Hecke relations confirm it only at the top index. The authors
  note it "is certainly not true over a number field for n ≥ 5".

Their survey statement: "aside from some suggestions concerning the algebraic number field in which these coefficients
ought to lie the values of the coefficients are not in general understood, even heuristically."

**For n = 6:** a conjectural complete description of the even part of θ₆ through cubic data. This is the existing,
conjectural, "global expression of the sextic theta through cubic and quadratic theta series" that the beat78 next step
asks for (§6.3).

**Needed mean:** no. The method sees θ₆ only through θ₂, whose coefficients are supported on squares, so it never meets
exponents 1 or 3. No automorphic form on a cover of GL₂ has coefficients supported on cubes (θ₃ is supported on cn³ with
c squarefree and nonzero Gauss sums at c). So the CFH mechanism does not isolate the odd part [HEURISTIC remark].

### 2.6 Bröker–Hoffstein (Math. Comp. 85, 2016; arXiv:1312.0568): sextic coefficients, partly proved, partly conjectured

**Setting** [CITED-read]: n = 6, K = Q(ζ₆), S = {2, 3, ∞}, [K_S^× : K_S^{×6}O_S^×] = 6³ = 216 cosets (Lemma 2.2).
* ψ(r, s, η) = Σ_c g₆(r, ε, c)|c|_S^{−s−1}L_S(|·|^{6s+1}) has at most one pole in Re s ≥ 0, at s = 1/6 (Thm 2.4,
  citing EP92 §5).
* τ(r, V) = N(r)^{1/12}Res_{s=1/6}Σ_{η∈V}ψ(r, s, η). It depends on the coset set V.

**Functional equation (3.1)** [CITED-read; theory from EP92 §5, not read]:

  Ψ(r, s, η_i) = n^{N/2}G_f(s)Π|π_v|^{−d_v/2}Σ_j T_{ij}(r, s)Ψ(r, −s, η_j),  Ψ = y₁^{−s}(Γ(ns)/Γ(s))^{N/2}ψ,

with y₁ = (2π)^{N(n−1)/2}|r|_S^{−1/2}Π|π_v|^{nd_v/2}.
* T_{ij} is given by Hilbert symbols and Tate's local ρ-factors, formula (3.10).
* For n = 6 it is a 216 × 216 matrix over Z[ζ₃₆]((1/3)^s, (1/4)^s) with denominator V⁵W³ (§4.5).
* Check used by the authors: T(r, s)T(r, −s) is diagonal.

**Proved:**
* Lemma 5.1: for |π| ≡ 1 (mod 4) and the special V of (5.1), τ(π⁴, V)/τ(1, V) = |π|^{−1/2}g₆(1, ε, π). This is the
  Hecke-determined coefficient.
* Lemma 5.3: for |π| ≡ 1 (mod 12), τ(π², V) ≠ 0 ⇒ (π/π̄)₆ = 1.

**Computed:** τ(1, V) ≈ 0.1358547858696091 (16 digits, agreeing with Wellhausen 1996). [NUM-lit]

**Conjectured** [CONJ-lit; NUM-lit]:
* **Conj. 5.2:** τ(π⁴, V) for |π| ≡ 3 (mod 4), with an extra factor (−1, π)₆/√3. Checked at |π| = 7, 19, 31.
* **Conj. 5.4–5.6:** τ(π², V)/τ(1, V) = (root of unity)·2g₃(1, ε², π)/|π|^{1/2}, with an extra 1/√3 when |π| ≡ 7
  (mod 12), and −2 for inert π.
  * The roots of unity ζ₆^{g(π)} and ζ₁₂^{h(π)} have "no pattern".
  * There are unexplained vanishings at norms 37, 313, 373, 661, 769, and at inert 5, 17, 29, 41, 53, 59, 89.
  * Data: N(π) < 1300 and N(π) < 8000 depending on class.
* **Conj. 5.7 (prime index, i.e. odd part):**
  (τ(π, V)/τ(1, V))² = ζ₆^{k(π)}g₃(1, ε², π)|π|^{−1/2}·3^{l(π)}·(1 − 3ζ₆)^{m(π)}(−2 + 3ζ₆)^{n(π)} when |π| ≡ 1 (mod 4),
  with l ∈ {−1, 0} and m, n ∈ {0, 2} not both 2. The norm-7 elements are replaced by the norm-13 elements 1 + 3ζ₆,
  4 − 3ζ₆ in the other class.
  * The authors found no pattern in k(π), nor in when the norm-7 or norm-13 factors appear.
  * Evidence: N(π) < 900 in one class. The other class rests on Wellhausen's N(π) < 100 and is described by the authors
    as less reliable ("on thinner ice"; their text names the class inconsistently).

**For n = 6:** the only literature data on the odd part, and only at a single prime and only for the square τ(π)².
Nothing at composite squarefree indices. The algorithm evaluates any single τ(r, V) numerically, at a cost that grows
with N(r).

**Needed mean:** no for a proof. Usable for numerics (§6.2).

### 2.7 Friedberg–Ginzburg: descent (JEMS 20, 2018), covers of Sp (Bull. Iranian Math. Soc. 43, 2017), global integrals (arXiv:1403.3929)

**Descent (arXiv:1403.3930v3)** [CITED-read: abstract, §1, Conjecture 1, Theorem 1]:
* They start from the theta representation of the 3-fold cover of Sp₄, induced from the cubic theta of GL₂. A descent
  integral produces an L² function σ on the 6-fold cover of SL₂.
* **Theorem 1.** For m₁, m₂ in a multiplicative set R generated by primes close to 1 at an undetermined finite set S of
  places:
  * periodicity holds: τ_σ(m₁m₂³) = |m₂|^{1/2}τ_σ(m₁);
  * for m₁, m₂ squarefree and coprime, the coefficient at diag(m₁m₂², (m₁m₂²)^{−1}) equals
    γ(m₁)G₁⁽³⁾(1, m₁)G₁⁽³⁾(1, m₂)²(m₂/m₁)₃Σ_{m₁=d₁d₂}(d₂/d₁)₃. This is FG's equation (45); it is the CFH relation
    of §2.5, up to the unit γ(m₁).
* σ has non-zero projection to the residual spectrum. **σ = θ is Conjecture 1, not proved.**

**For n = 6:** square-index evidence only. The coefficients of the SL₂ function at diag(a, a^{−1}) for one character ψ
see only GL₂ indices a². Squarefree GL₂ indices would need the ψ_t-coefficients with t a non-square, which are not
treated.

**The other two papers:**
* FG 2017: on the 6-fold cover of Sp₄ (n = r = 3) they unconditionally construct a generic representation with
  factorizable Whittaker functions computed by cubic Gauss sums. Equality with the theta representation of Sp₄^{(6)} is
  conjectured.
* FG 2014: convolves theta on GL₃^{(n)} with forms on GL₂^{(n′)}; concrete cases n = n′ = 3 and n = 4, n′ = 2.

None of these is about GL₂^{(6)} at odd indices.

**Needed mean:** no.

### 2.8 Function fields: Hoffstein (Invent. Math. 107, 1992), Patterson (Glasgow Math. J. 49, 2007; arXiv:1411.7594, 2014)

**What these papers do** [CITED-read: Patterson 2014 abstract, §§1–4; Hoffstein 1992 via CFH12 §6 and Patterson 2014]:
* Over F_q(T) every Kubota Dirichlet series is a rational function. The theta coefficients ρ₀(r, ε, i) are therefore
  given in closed form (Hoffstein 1992, Patterson 2007).
* Patterson 2014 proves a PGL₂(F_q) symmetry of the coefficients (Theorem 1) and analyses r with at most three
  degree-1 prime factors, exponents ≤ [n/2] − 1.

**Patterson 2014, §4, by number of prime factors of r:**

| r | value of ρ₀(r, ε, i) |
|---|---|
| one or two prime factors | τ(εχ^i) times a Jacobi sum, via the Anderson–Evans–van Wamelen evaluation of Selberg sums |
| three prime factors | relations "known from the theory of the hypergeometric function"; values are finite-field hypergeometric analogues |

Quotes on the three-factor case:
* Special forms appear only "when n = 4, or when n = 6 and e₀, e₁, e_λ are all 2". The latter is the CFH even case.
* "In other cases, as one would expect, the values are irregular."
* "a complete evaluation does not seem [a] reasonable expectation … One can, for example, make estimates for the
  ρ₀(r, ε, i) in different metrics. One would suspect that one can do better than relatively elementary convexity
  bounds."

**For n = 6:** squarefree r has all exponents 1, so with three or more prime factors it falls in the "irregular" class
even over F_q(T). This is the strongest available indication against a closed-form 6-fold Patterson identity on the odd
part.

**Needed mean:** no. Patterson's suggestion (estimates "in different metrics", beating convexity) is the kind of input
TRO needs; it is stated as a hope, not a result.

### 2.9 Weyl group multiple Dirichlet series

Sources: Brubaker–Bump–Chinta–Friedberg–Hoffstein 2006; Brubaker–Bump–Friedberg–Hoffstein (Annals 166, 2007,
"Eisenstein series and twisted unstable A_r"); Brubaker–Bump–Friedberg (Annals 173, 2011; Annals of Math Studies 175);
Chinta–Gunnells (arXiv:0803.0691); Brubaker–Bump–Friedberg–Hoffstein (Springer Proc. Math. 9, 2012).

**Statement** [CITED-read: abstracts; BBFH 2012 via the UMN record]:
* Multiple Dirichlet series built from n-th order Gauss sums and residue symbols on the edges of a Dynkin diagram have
  meromorphic continuation to C^r and a finite group of functional equations. Chinta–Gunnells construct them for every
  reduced root system.
* BBFH 2012: for n large (the stable range), the theta Whittaker coefficients at p-power indices in the Hecke orbit equal
  the p-parts of stable WMDS up to an explicit constant.

**For n = 6:** gives the analytic machinery of which Kubota's series is the rank-1 case. Residues of rank-2 series
produce Dirichlet series of the form Σ_c g_n(m′, c)·ρ_n(m c^{±1})N(c)^{−s}, i.e. theta coefficients against Gauss sums
[HEURISTIC; the orientation and the exact residue were not checked in a source]. The p-power coefficients that the
literature identifies are the Hecke-determined ones.

**Needed mean:** no. The 7/8 correlation pairs ρ₆ with cubic data (the second power of the sextic symbol) through
χ_c(m). That is a mixed-order configuration. The type-A WMDS read here use one symbol power throughout; whether 𝔅 is a
residue of any series with known continuation is not addressed in the literature.

### 2.10 Representation theory of covers: Cai (Trans. AMS 371, 2019; arXiv:1602.06614), Gao (PJM 290, 2017; Math. Ann. 376, 2020), Gao–Shahidi–Szpruch (arXiv:2102.08859)

**Statement** [CITED-read: Cai abstract and introduction; GSS Thm 4.9]:
* Cai: unique semi-Whittaker functionals; the unipotent orbit attached to Θ_r^{(n)}. KP's genericity criterion is
  restated (§2.3).
* Gao gives bounds and formulas for dim Wh(Θ) as counts of free W-orbits.
* GSS §4.3.2 and Theorem 4.9 give the GL₂^{(n)} and SL₂^{(n)} numbers used in §2.3.
* Gao, "Generalized Bump–Hoffstein conjecture for coverings of the general linear groups" (J. Algebra 499, 2018) [title
  only, from the GSS bibliography; not read]. By its title it concerns theta on covers of GL_r in the uniqueness range,
  not GL₂^{(6)}.

**For n = 6:** confirms local non-uniqueness, quantitatively.

**Needed mean:** no.

### 2.11 Sums of n-th order Gauss sums

Sources: Patterson (PLMS 54, 1987); Gao–Zhao (FACM 70, 2024; arXiv:2306.10726); Ma (arXiv:2606.26440, 2026).

**Statements** [CITED-read unless noted]:
* **Patterson 1987** [CITED-via DDHL, Gao–Zhao]: equidistribution of n-th order Gauss sums at primes over K ⊇ μ_n, with a
  power saving. For n = 4, DDHL quote the bound X^{19/20}.
* **Patterson's lemma**, as stated in Gao–Zhao Lemma 2.14: h_j(r, s; χ) = Σ_m χ(m)g(r, χ_{j,m})N(m)^{−s} continues
  meromorphically, is holomorphic in Re s > 1 except for a possible pole at s = 1 + 1/j, and for
  σ₁ − 1/2 ≤ σ ≤ σ₁ = 3/2 + ε satisfies
  |((j(s−1))² − 1)h_j(r, s; χ)| ≪ N(r)^{(σ₁−σ+ε)/2}(1+|s|²)^{(σ₁−σ+ε)(j−1)/2}.
* **Gao–Zhao** use this to evaluate first moments of quadratic, cubic, quartic and sextic families of Hecke L-functions
  through double Dirichlet series. Their Theorem 1.3 has error term X^{1/2+1/j−α+ε}, which is X^{2/3−α+ε} at j = 6. The
  exponent 1/2 + 1/j matches the theta pole. That inference was not traced line by line; they do not evaluate the
  residues.
* **Ma 2026** (abstract only): homological vanishing over F_q[t] gives an upper bound for the bias of higher-order Gauss
  sums. It is conjectured sharp only for prime-power orders, and 6 is not one.

**For n = 6, derived here** [DERIVED]. Take j = 6 in Lemma 2.14 at s = 7/6, which lies in [σ₁ − 1/2, σ₁]. Since
(6(s−1))² − 1 has derivative 12 there:

  ρ₆(r) = Res_{s=7/6}h₆(r, s; χ) ≪_ε N(r)^{1/6+ε}, uniformly in r.

Equivalently τ₆(r) ≪ N(r)^{1/4+ε} in the BH16 normalisation. The same computation at j = 4 gives ψ⁽⁴⁾(m²) ≪ N(m)^{1/4+ε},
which is the convexity bound DDHL quote. That agreement serves as a check. The mean-square size is N(r)^{−1/12} on
average (§1.1), so convexity is far from the truth.

**Needed mean:** no. The quantities are either a single residue size or a pole bounded as an error term.

### 2.12 The other names on the task list

* **Kerr–Shparlinski–Wu–Xi** (arXiv:2204.05038, JLMS) [CITED-read: abstract]: bilinear forms with Kloosterman sums, with
  applications to fourth moments of Dirichlet L-functions. Nothing on Gauss sums of order ≥ 3, sextic objects or theta
  coefficients. Shparlinski's "Bilinear sums of Gauss sums" (Acta Arith. 202, 2022, search snippet only) concerns
  families of Gauss sums modulo a prime over Q, a different object. A search found no Kerr–Shparlinski–Wu–Xi result on
  cubic or sextic Gauss sums over Q(ω).
* **"Leslie":** searches (2026-11-03) located no paper by an author of that name on n-fold metaplectic theta
  coefficients. Nothing is attributed to it here.
* **Hoffstein–Jung–Lee** (arXiv:2109.10434) [CITED-read: abstract]: a triple product with the cubic theta over Q(√−3).
  This is n = 3 and not about coefficients.
* **Flicker** (Invent. Math. 57, 1980) [recalled, not read]: Shimura-type correspondence for n-fold covers of GL₂. It
  matches representations, not Fourier coefficients.

### 2.13 Summary table

| source | n = 6 content | squarefree (odd-part) content | evaluates or bounds the needed mean? |
|---|---|---|---|
| Kubota 69/71 | defines θ₆, residue formula | — | no |
| Patterson 77; DR 24; HB 00 | none (cubic) | — | no (B side only) |
| KP 84; GSS; Gao; Cai | non-uniqueness; Hecke relations | proves that local theory leaves it free | no |
| Suzuki 83/97; EP 92; BH 89; Hoffstein 92 | quartic template; EP92 §5 FE used by BH16 | quartic τ₄(p) open | no |
| CFH 12 | even-part conjecture | none | no |
| BH 16 | explicit FE, algorithm, Lemmas 5.1 and 5.3, Conj. 5.2–5.7 | τ(π)² only, irregular | no (numerics only) |
| FG 14/17/18 | square-index descent | none | no |
| Patterson 07/14 | function-field closed forms | "irregular"; no complete evaluation expected | no |
| WMDS | analytic machinery | Hecke-determined coefficients only | no |
| Patterson 87; Gao–Zhao; DDHL; Ma | residue sizes, convexity | ρ₆ ≪ N^{1/6+ε} | no |
| KSWX | none | none | no |

---

## 3. What exists for n = 6 (GL₂ over Q(ω)), by status

| item | statement | status |
|---|---|---|
| θ₆ as a residue | τ₆(m) = N(m)^{1/12}·Res of the sextic Kubota series | PROVED-lit (Kubota; BH16 §2) |
| continuation and FE of ψ(r, s, η) | vector FE with 216 × 216 S-matrix, explicit for n = 6 over Q(ζ₆) | PROVED-lit (EP92 §5, displayed in BH16 (3.1), (3.10), §4.5) |
| Gamma factors | (Γ(6s)/Γ(s)) = const·6^{6s}Π_{k=1}^{5}Γ(s + k/6): 5 factors | PROVED (Gauss multiplication) |
| index factor of the FE | y₁^{−s} with y₁ ∝ \|r\|_S^{−1/2}, i.e. N(r)^{1/2−u}; T_{ij} depends on r only through r_v, v ∈ S_f | CITED-read (BH16); agrees with the cubic-r2 verdict's κ = 1 |
| periodicity τ(mp⁶) = N(p)^{1/2}τ(m) | — | PROVED-lit (KP84) |
| Hecke relations | τ(mp⁵) = 0; τ(mp⁴) = G₅τ(m); τ(mp) = G₂τ(mp³); τ(mp²) = G₃τ(mp²) | PROVED-lit (KP84; CITED-via CFH12, BH16) |
| local non-uniqueness | dim Wh > 1 (KP Cor. I.3.6); GL₂^{(6)} theta: 15 or 5; its unramified SL₂^{(6)} constituents: 2 and 1 | CITED-read (KP84; GSS §4.3.2, Thm 4.9) |
| τ(π⁴, V) for N(π) ≡ 1 (mod 4) | = τ(1, V)\|π\|^{−1/2}g₆(1, ε, π) | PROVED-lit (BH16 L. 5.1) |
| vanishing criterion for τ(π², V), N(π) ≡ 1 (mod 12) | τ(π², V) ≠ 0 ⇒ (π/π̄)₆ = 1 | PROVED-lit (BH16 L. 5.3) |
| τ(1, V) | ≈ 0.1358547858696091 | NUM-lit (BH16, Wellhausen) |
| even part | τ₆(m₁²m₂⁴) via cubic Gauss sums | CONJ-lit (CFH12 Conj. 2.1); NUM-lit (BH16, with 1/√3 and roots of unity); PROVED over F_q(T); descent-consistent (FG18 Thm 1) |
| τ(π², V) values | 2g₃/\|π\|^{1/2} times unpatterned roots of unity; some unexplained zeros | CONJ-lit + NUM-lit (BH16 Conj. 5.4–5.6) |
| τ(π)² (prime, odd part) | ζ₆^k·g₃\|π\|^{−1/2}·3^l·(norm-7 or norm-13 element)^{0 or 2}, no pattern | CONJ-lit + NUM-lit (BH16 Conj. 5.7; thin data in one class) |
| τ₆ at composite squarefree indices | — | **nothing**, not even conjectured |
| function-field squarefree values (3 or more primes) | finite-field hypergeometric sums, "irregular" | CITED-read (Patterson 2014) |
| individual size | ρ₆(r) ≪ N(r)^{1/6+ε}, i.e. τ₆(r) ≪ N(r)^{1/4+ε} | DERIVED (Patterson's lemma, Gao–Zhao L. 2.14) |
| mean square | Σ_{N(m)≤X}\|τ₆(m)\|² ≍ X, i.e. Σ\|ρ₆\|² ≍ X^{5/6} | standard (Rankin–Selberg), not located in a read source |
| first moment of θ₆ | Mellin transform poles at u = 11/12, 1/12 | CITED-read (CFH12 §5) |
| correlations of ρ₆ with cubic data or sextic-symbol twists | — | **nothing** |

---

## 4. Best available tool

There is no tool in the literature that evaluates or bounds the Prop 15.2 exceptional correlation. The candidates are
ranked by usefulness to the campaign.

1. **Explicit FE plus residue algorithm** (EP92 §5; BH16 §§3–4, Algorithm 4.1).
   * Gives: numerical values of individual τ₆(r, V) for any coset set V, to many digits when N(r) is small. The authors
     used Gauss sums of primes up to norm 10⁸ and parameters x ∈ [1/500, 1/100].
   * Use: the cheap test of §6.2, and checking any proposed formula on small indices.
   * Limit: one coefficient at a time, at a cost growing with N(r). Not a proof tool for sums over r ≍ Q.
2. **CFH double-Dirichlet-series method** (CFH12 §§3–5).
   * Gives: the poles and Gamma factors of Rankin–Selberg-type convolutions of θ₆ with other theta functions, hence
     candidate identities in Patterson's style. It is the only method that has produced exact (conjectural)
     higher-theta identities.
   * Limit: the only convolution worked out is θ₆ × θ₂, which sees the even part only. Over number fields the identity
     is a conjecture.
3. **Quantitative inputs** (Rankin–Selberg mean square; Patterson's convexity lemma).
   * Gives: sizes.
   * Limit: proved useless for TRO. The Cauchy–Schwarz-extremal vector satisfies all mean-square inputs (subtract note
     §6; holder note: sup_B|Σ A_m B_m| = ‖A‖₂V when only Σ|B|² ≤ V² is known).

---

## 5. The precise gap

**Gap.** Write ρ₆,σ(y) for the residue at u = 2/3 of the class-σ Kubota series Σ_{s∈σ} g̃₆(y, s)N(s)^{−u}. These are the
sextic theta coefficients in residue normalisation; the identification with A^θ is [HEURISTIC], subtract §5.1.

To lower 7/8 through Prop 15.2 at fixed geometry (to 7/8 − η/96, inside the 2.9·10⁻⁴ high-side cap), one needs TRO(η).
Its theta part is the bilinear form

  𝔅_J = Σ_m Σ_{c sf, n} ω_J(q_m/Q)ξ(m)(q_m/Q)^{−iv}·ρ₆,σ(e₀m)·γ₂(c)α(cn³)ν(cn³)G(cn³)χ_{cn³}(m)·V(q_c q_n³/Z),

(schematic: the normalising powers of q_c, q_n and the Mellin integral in Z are absorbed into V), which must be bounded
by Z^{−ηb/12} times ‖ρ₆,σ(e₀·)‖₂‖B‖₂. The literature provides the following:

| | what is needed | what the literature has |
|---|---|---|
| G1 coefficientwise | ρ₆,σ at e₀m, good part squarefree (odd part) | No formula, proved or conjectured, beyond BH16 Conj. 5.7 for τ(π)² at a single prime. Local theory proves these values are not determined by Hecke data (KP84; GSS). Function-field evidence says they are irregular (Patterson 2014). |
| G2 mean-type | information that beats Cauchy–Schwarz | Only Rankin–Selberg mean squares and convexity. These are exactly the inputs shown not to give TRO. |
| G3 twisted sums in the conductor aspect | Σ_m ρ₆(e₀m)χ_c(m)w(N(m)/Q) for sextic characters χ_c of growing conductor | No estimate, and no written Voronoi formula for θ₆. θ₆ is automorphic for a congruence subgroup with the sextic Kubota multiplier, so such a formula exists in principle, with θ₆'s unknown cusp coefficients on the dual side [HEURISTIC]. |
| G4 identities | a Rankin–Selberg or multiple-Dirichlet-series identity involving ρ₆ at odd indices together with cubic data | None. CFH is confined to the even part. The WMDS literature uses one symbol order and identifies only Hecke-determined coefficients. |

**Strength of the missing input.** By S4 (Lemma 3.2, referee grade PROVED, tautological reduction), any improved bound
for the probe's low sum is equivalent to the same bound for the exceptional piece. So a proof of TRO(η) is not a lookup
of coefficients. It is a new low-side estimate whose payoff is a zero-free statement. Its high-side partner at
β* < 7/8 also needs a re-optimised geometry and a re-proved Part II (referee correction to Cor. 3.4).

In the literature on n-fold theta functions nothing at this level exists for any n ≥ 4. The quartic counterpart, the
values τ₄(p), is itself "wide open" (DDHL 2026).

**What "a 6-fold Patterson-type identity" would have to be, and why it is not available.** Patterson's cubic identity is
the statement τ₃(d) = g₃(1, d)/N(d)^{1/2} at squarefree d. It follows from uniqueness of the local Whittaker model (n = 3,
r = 2, KP Cor. I.3.6).

* For n = 6 the analogous statement would be τ₆(d) = (explicit arithmetic function of d) at squarefree d.
* KP Thm I.3.5 and the Hecke relations show that local data cannot produce it.
* BH16's prime-index data (τ(π)² with irregular extra factors) and Patterson's function-field analysis (irregular
  hypergeometric values) indicate that no such closed form exists in Gauss-sum terms.
* A global identity of CFH type through other theta series is the remaining possibility. The one known (conjecturally)
  sees only the even part, and the coherent block's Gram pairing is dominated by the odd part (§1.2).

---

## 6. Side findings for the campaign

### 6.1 An explicit source for the n = 6 functional equation over Q(ω)

The cubic-r2 verdict (§0, §2.3) names its residual risk: the n = 6 functional equation over Q(ω) "is used through
Kubota's theorem and the archimedean Whittaker homogeneity, not through a source that was read and that writes out the
S-local data", because BB06/DIPP assume μ₁₂ ⊂ K.

**BH16 writes out these data for n = 6 over K = Q(ζ₆)** (μ₆ ⊂ K, μ₁₂ ⊄ K), citing EP92 §5 for the theory:
* the FE (3.1);
* the transition-matrix formula (3.10), with Hilbert symbols at 2 and 3 and Tate's local ρ-factors;
* the explicit 216 × 216 matrix of §4.5, with its check T(r, s)T(r, −s) diagonal.

What the displayed formulas show:
* the index enters through y₁^{−s}, y₁ ∝ |r|_S^{−1/2}, which gives an index factor N(r)^{1/2−u}, i.e. κ = 1;
* the Gamma factor (Γ(6s)/Γ(s))^{N/2} with N = 2 is a product of 5 Gamma factors;
* T_{ij} depends on r only through its S-adic components.

This agrees with the verdict's a = 4 derivation. It is exponent-neutral, as the verdict anticipated. EP92 itself was not
read.

**Status change:** the verdict's caveat "not in a read source" becomes "displayed in BH16 (read); theory in EP92 §5 (not
read)". Nothing changes in a.

### 6.2 The "cheap test" of the beat78 next step

`beat78-prop152-2026-10-09.js` `nextStep`: compare the per-class constants c_σ in Σγ₁(s) ~ c_σX^{2/3} with products of
Patterson's cubic constants; "If none, drop Prop 15.2 levers."

**What the constants are [HEURISTIC identification].** The c_σ are residues of class-restricted sextic Kubota series at
index 1, i.e. θ₆ coefficients at S-unit indices. These are BH16's τ(1, V)-type numbers over the 216 cosets.

**What the literature implies.**
1. These indices have good part 1, so all good exponents are 0: they belong to the even part.
2. Whatever relation the constants satisfy cannot reach the odd part that carries the coherent block's pairing (§1.2).
3. The beat78 criterion asked for a global identity for the sextic residual spectrum through cubic and quadratic theta
   series. For the even part such an identity exists conjecturally (CFH). For the odd part none is known, and Patterson
   2014 indicates none of closed form should be expected.

**Recommendation.** Treat the Prop 15.2 evaluation and subtraction lever as closed, pending a new idea for cross-cover
correlations (§7). If the test is still wanted as a numerical calibration, the tool is BH16 Algorithm 4.1 (or the
campaign's own Σγ₁ fits at larger X). The orientation conventions must be matched: BH16's sextic symbol is the
conjugate of CFH's, the coset set V differs, and the conjugation in (4.7) must be restored.

### 6.3 Upgrades to statuses in the campaign notes

| item in campaign notes | old status | new status |
|---|---|---|
| "Kazhdan–Patterson non-uniqueness for n = 6" (subtract §5.4; new-probe §7.4, §11; cubic-r2 §6) | recalled | CITED-read: KP84 Thm I.3.5, Cor. I.3.6; GSS §4.3.2 and Thm 4.9(ii) |
| "sextic theta coefficients at squarefree indices unknown" (synthesis §2.1; data modules) | recalled | CITED-read: BH16 §1, §5; CFH12 §1; DDHL §1.2 and §4.5; Patterson 2014 §4 |
| "global identity through cubic and quadratic theta series" (beat78 next step) | open question | partially answered: exists conjecturally for the even part only (CFH12 Conj. 2.1, proved over F_q(T)); nothing for the odd part |

---

## 7. What would change the picture

None of the following is in the literature, and each is research-level.

1. **A CFH-type identity for the odd part.** Candidates are the convolutions θ₆ × θ₃ and θ₆ × θ₆ (unconjugated, the
   analogue of Patterson's D₂).
   * Formally, the Kubota multipliers allow such Rankin–Selberg integrals against a metaplectic Eisenstein series:
     θ₆θ₃ with a quadratic-multiplier series, since κ·κ²·κ³ = 1.
   * The θ₆ × θ₃ convolution would see indices cn³, hence (by the exponent-1 ↔ exponent-3 Hecke relation) odd-part
     coefficients weighted by cubic Gauss sums. Its leading constant would be a triple theta period.
   * [HEURISTIC; not checked in any source; the regularisation and cocycle compatibility are not verified.]
   * Even such an identity gives index-coupled means. 𝔅 is coupled through χ_c(m), not through equal indices.
   * BH16's irregular τ(π)² data argue against a clean θ₆ × θ₆ factorisation of quartic type.
2. **A Voronoi formula for θ₆ combined with the cubic reflection of B (Prop 5.1)** [HEURISTIC]. The sextic Kubota
   multiplier would move a sextic twist χ^j to χ^{−j−1}, which at j = 1 is cubic. The reflected rows would then need the
   cubic large sieve. This is the configuration in which the cubic lever closed (a = 4, cubic-r2 verdict).
3. **Realising 𝔅 as a residue of a multiple Dirichlet series with known continuation.** Its mixed orders (sextic theta,
   cubic theta, sextic symbol) fall outside the single-order type-A WMDS read here.
4. **Descent beyond square indices.** This needs Friedberg–Ginzburg Conjecture 1 (σ = θ₆), together with a descent that
   computes the ψ_t-Whittaker coefficients for non-square t, which see odd GL₂ indices. FG suggest that CFH is "the first
   in a series of relations"; none of the further relations is established.

Even if (1) or (4) were realised, TRO still needs cancellation in a bilinear form that, by S4, carries the probe's
low-side strength. Knowing the coefficients would be an enabling step (a new reflection), not a proof.

---

## 8. Sources

**Read (text or full statement):**
* Bröker–Hoffstein, arXiv:1312.0568 (= Math. Comp. 85 (2016) 1901–1927), all of it.
* Chinta–Friedberg–Hoffstein, author PDF of Springer Proc. Math. 9 (2012) 149–170, all of it.
* David–Dunn–Hamieh–Lin, arXiv:2306.11875v5: §1, §3, §4.5, references.
* Friedberg–Ginzburg, arXiv:1403.3930v3 (JEMS 20 (2018) 1913–1957): abstract, §1, §§5–7 (Conjecture 1, Theorem 1).
* Friedberg–Ginzburg, arXiv:1403.3929: abstract and §1.
* Patterson, arXiv:1411.7594: §§1–4.
* Kazhdan–Patterson, Publ. IHÉS 59 (1984): introduction and §I.3 (Thm I.3.5, Cor. I.3.6) from the numdam scan. The OCR
  is noisy.
* Cai, arXiv:1602.06614: abstract and introduction.
* Gao–Shahidi–Szpruch, arXiv:2102.08859: §1 (Thm 1.5), §4.3.2, Thm 4.9 and its proof.
* Gao–Zhao, arXiv:2306.10726: §1, Lemma 2.14.
* The 7/8 and 11/12 manuscripts (sections listed in the header).

**Read as abstract only:** Dunn–Radziwiłł arXiv:2109.07463; Friedberg–Ginzburg arXiv:1601.04970; Ma arXiv:2606.26440;
Kerr–Shparlinski–Wu–Xi arXiv:2204.05038; Hoffstein–Jung–Lee arXiv:2109.10434; Brubaker–Bump–Friedberg–Hoffstein, Springer
Proc. Math. 9 (2012) 83–95 (UMN record); Chinta–Gunnells arXiv:0803.0691.

**Cited only through the sources above (not read):** Kubota 1969, 1971; Patterson 1977, 1978, 1984, 1987, 2007;
Heath-Brown–Patterson 1979; Heath-Brown 2000; Deligne 1980; Suzuki 1983, 1997; Bump–Hoffstein 1989; Eckhardt–Patterson
1992; Hoffstein 1992, 1993; Wellhausen 1996; Brubaker–Bump 2006; Gao 2017, 2020; Flicker 1980.

**Searched, not located:** a relevant paper by an author named Leslie; any 2024–2026 work on GL₂^{(6)} theta coefficients;
a proof of the CFH conjecture over a number field; a proof of Patterson's quartic conjecture over a number field.

---

## 9. Reproduction

Downloads (untrusted, read only through `pdftotext`; not executed). Each is saved as `/tmp/sextic-lit/dl/<id>.pdf`:

```
for id in 1312.0568 2306.11875 1411.7594 1403.3930 1403.3929 1602.06614 2102.08859 2306.10726; do
  curl -sL -o /tmp/sextic-lit/dl/$id.pdf https://arxiv.org/pdf/$id; done
curl -sL -o /tmp/sextic-lit/dl/cfh12.pdf https://chinta.ccny.cuny.edu/publ/patterson.pdf
curl -sL -o /tmp/sextic-lit/dl/kp84.pdf https://www.numdam.org/item/PMIHES_1984__59__35_0.pdf
for f in /tmp/sextic-lit/dl/*.pdf; do pdftotext -layout "$f" /tmp/sextic-lit/txt/$(basename "$f" .pdf).txt; done
```

**Key line references in the text extractions:**

| file | lines | content |
|---|---|---|
| `1312.0568.txt` | 150–330 | Hecke relations; CFH restated |
| `1312.0568.txt` | 596–640 | FE (3.1), Ψ normalisation |
| `1312.0568.txt` | 790–830 | T_{ij} (3.10) |
| `1312.0568.txt` | 1300–1500 | §5 lemmas and conjectures |
| `cfh12.txt` | 280–330 | Conjecture 2.1 |
| `cfh12.txt` | 1000–1070 | Theorem 6.3 |
| `2306.11875.txt` | 246–262 | count of undetermined coefficients; Suzuki at squares |
| `2306.11875.txt` | 893–985 | §4.5 history and status |
| `1411.7594.txt` | 380–460 | "irregular", "complete evaluation" |
| `kp84.txt` | 2066–2087 | Thm I.3.5, Cor. I.3.6 |
| `2102.08859.txt` | 3870–3950 | GSS §4.3.2 (GL₂ count) and Thm 4.9 |
| `2306.10726.txt` | 826–846 | Lemma 2.14 |
| `1403.3930.txt` | 1884–1910 | FG Theorem 1 |

No computation was run for this note beyond the convexity arithmetic of §2.11 (done by hand: f(s) = 36(s−1)² − 1,
f′(7/6) = 12, exponent (3/2 − 7/6)/2 = 1/6; at j = 4 the exponent (3/2 − 5/4)/2 = 1/8 reproduces DDHL's
ψ⁽⁴⁾(m²) ≪ N(m)^{1/4+ε}).
