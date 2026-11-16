# Proof attempt for Conjecture TRO6 (the P_a^{1/6} block of 7/8 Prop 15.2)

Internal working note, 2026-11-03. Branch `editorial-redesign`. Nothing committed, nothing pushed, nothing sent off the
machine. Two internal adversarial referee passes (2026-11-03), both non-refuting; their corrections are applied in
place (marked **[REF-CORR]**) and listed in §11.

Task: prove the statement of `sextic-theta-conjecture.md` (Conjecture TRO6(η)), or the strongest provable part of it,
with the tools named in the task: Kubota functional equations, Kazhdan–Patterson, Weyl group multiple Dirichlet series,
Dunn–Radziwiłł methods, the large sieve for sextic characters.

Read for this note: `sextic-theta-conjecture.md`, `sextic-theta-literature.md`, `sextic-theta-computation.md`,
`zf-campaign-synthesis.md`, `zf-campaign-new-probe.md`, `cubic-r2-conductor-verdict.md` and both
`cubic-r2-conductor-derivation-*.md`, `beat78-prop152-subtract.md` (Lemma 2.2, Prop 2.3, Lemma 3.2, Cor 3.4, Thm 4.1),
`beat78-synthesis.md`, the data modules `src/data/zero-free-campaign-2026-11-01.js` and `src/data/beat78-prop152-2026-10-09.js`,
the 7/8 manuscript `~/lean-deps/qrh-verify/paper.txt` (§2 Prop 2.1; §4.1–4.2 with (4.7)–(4.8); §5.1 Prop 5.1; §6.1–6.2
with (6.1)–(6.2), Lemmas 6.1–6.2; §7.1–7.2; §9.1 Lemma 9.1 and its proof; §12; §15 Lemma 15.1, Prop 15.2, Prop 15.3,
(15.8)–(15.9); §20.6), the 11/12 manuscript `paper2.txt`, and Bröker–Hoffstein, *Fourier coefficients of sextic theta
series* (arXiv:1312.0568 = Math. Comp. 85 (2016), text in `/tmp/sextic-lit/txt/1312.0568.txt`, read as data only: §1,
§2 Lemmas 2.1–2.2 and Thm 2.4, §3 (3.1)–(3.10), §4.5–4.6).

Labels:
* **[PROVED]** complete argument in this note.
* **[PROVED-rel X]** proved here relative to X, taken as stated; X is named each time.
* **[CITED]** statement read in the named source. **[DERIVED]** short deduction from a cited statement.
* **[EXACT]** exact-symbol computation (script and log named).
* **[SKETCH]** argument at the level of detail of the manuscript's Part II; error terms not written to the last ε.
* **[HEURISTIC]** model or unverified identification. **[UNPROVED]** a needed step that is not established here.
* **[CONJECTURE]** a precisely stated open statement.

---

## 0. Outcome

**TRO6(η) is not proved, for any η > 0.** No θ < 7/8 is obtained. No Raymond-chain Λ was computed. PT Λ ≤ 0.2 stands.
RH is open. NO QED.

The strongest provable part, and the obstruction, are as follows.

1. **Theorem A (the zero-independent inputs are theorems)** [PROVED-rel (K1)–(K3) = Bröker–Hoffstein Thm 2.4, (3.1),
   (3.10), and Lemma 9.1 of the 7/8 manuscript]. For the complete class-σ sextic Kubota series D_σ(y; u) of the additive
   rows (all moduli prime to S, including moduli that share primes with the row):
   * **(MV)** Σ_{0<N(m)≤Q} |D_σ(−e₀m; 1/2+ε+it)|² ≪_ε Q^{1+ε}(1+|t|)^{B₀};
   * **(Id)** with A^θ_m := (2κ_σ/3τ)Ŵ₁(1/6+iv)Y′^{−1/3}ρ^♮_σ(−e₀m) one has
     Σ_{q_m≤CQ}|A_m − A^θ_m|² ≪ (1+|v|)^{B₀}(Q/Y′)(QY′)^ε for all Q, Y′ ≥ 1;
   * **(MS)** M^♮_σ(Q) := Σ_{0<N(m)≤Q}|ρ^♮_σ(−e₀m)|² ≪ Q^{5/6+ε};
   * **(A.8)** Prop 15.2 holds for all Q, Y′ ≥ 1 without its P_a²/Y′ term.

   So the hypotheses (Id) and (MS) of the conjecture note's sufficiency argument (its §2.2) are no longer hypotheses.
   They are zero-independent and do not move θ.
2. **Correction to the conjecture note.** The theta coefficient that the additive rows see is the *complete* residue
   ρ^♮_σ: its Kubota series runs over all moduli prime to the manuscript's S, including moduli sharing primes with the
   row (Bröker–Hoffstein §4.6 also keeps those). The conjecture note's ρ_σ uses squarefree moduli prime to 6y. It strips
   the gcd moduli and keeps the primes of S′. Both differences are explicit finite linear corrections ((3.9), Lemma A.0,
   [PROVED]). **[REF-CORR]** (Id) is proved for ρ^♮ and is *not established* for ρ_σ. That it *fails* for ρ_σ is
   [HEURISTIC]: it needs the difference to carry a fixed positive share of the mean square, and that rests on the size
   heuristics of §3.9 and on the unproved lower bound M^♮ ≫ Q^{5/6}. TRO6 is stated with ρ^♮ (TRO6^♮ below) because
   that is the coefficient for which (Id) is a theorem; referee 2 confirmed from manuscript §6.1 ("This includes
   nonsquarefree s") that ρ^♮ is the coefficient the rows see. The two coefficients are explicit linear combinations of
   each other with coefficient mass Π_{p|y}(1 + O(N(p)^{−5/6})) ≪ N(y)^ε (not bounded); the conjecture note's
   qualitative numerical findings are expected to transfer [HEURISTIC].
3. **Lemma B (only the unrescaled tuples matter)** [PROVED-rel (15.8), Prop 15.3]. TRO6 is needed only for the rescaled
   subsets J with d = Σ_{i∈J}ℓ_i < ηb/12. With the manuscript's slots ℓ_i = ℓ/K (§20.6) this is |J| < ηK/16, i.e. only
   J = ∅ (all slots marked) whenever K < 16/η.
4. **Theorem C (TRO6^♮ is the only remaining hypothesis)** [PROVED-rel Theorem A, Lemma 15.1, (15.8), Prop 2.1].
   TRO6^♮(η) on the tuples of Lemma B gives |I_{ϑ,modified}(Z)| ≪ Z^{l_x/2+(1−η)b/12+ε} (ϑ = target character, the
   manuscript's η). With the high-side hypothesis (H_{σ₀}) it gives the zero-free half-plane Re s > max(7/8 − η/96, 7/8 − m_hi) for every Hecke L-function over
   Q(√−3), every Dirichlet L-function and ζ (m_hi = 2.2815·10⁻⁴, conjecture note §5.2).
5. **Theorem D (the obstruction)**.
   * (i) [PROVED-rel Theorem A, Lemma 15.1, (15.8)] The compensated probe *equals* the aggregated theta–row form up to
     O(Z^{17/96+ε}): I_{ϑ,modified}(Z) = Θ_ϑ(Z) + O(Z^{l_x/2+ε}).
   * (ii) [PROVED-rel] Hence the aggregated TRO6^♮(η) is equivalent to the improved low bound
     |I_{ϑ,modified}(Z)| ≪ Z^{3/16−η/96+ε} (0 < η ≤ 1). No high-side input is used for this equivalence.
   * (iii) [PROVED-rel Prop 2.1 + (H_{σ₀}); converse SKETCH = conjecture note Prop E(b)] In the window
     σ₀ = 7/8 − η/96 ∈ (7/8 − m_hi, 7/8] the improved low bound is equivalent to the family being zero-free in Re s > σ₀.

   So, given the manuscript and (H_{σ₀}), a proof of TRO6(η) for some η ∈ (0, 0.0219) yields the zero-free
   half-plane Re s > 7/8 − η/96 for ζ and all Dirichlet L-functions, and conversely (SKETCH). The named tools give
   only target-independent statements about ρ^♮, or bounds uniform in the coefficient vector (§7, §8). **[REF-CORR]**
   That none of them can supply TRO6 is an assessment, not a theorem. Without (H_{σ₀}) the proved content is D(ii):
   TRO6^♮ restated as the improved low bound.

**What each named tool gives** (§7):

| tool | yield in this problem | where it stops |
|---|---|---|
| Kubota / Eckhardt–Patterson functional equation (Bröker–Hoffstein (3.1)) | Theorem A: (MV), (Id), (MS), (A.8) | says nothing about the correlation with the target's rows |
| sextic large sieve (Lemma 9.1, Blomer–Goldmakher–Louvel) | Lemmas A.2–A.3, hence (MV) | any bound uniform in the coefficient vector is at least Cauchy–Schwarz; using arithmetic means Poisson in m, which is the high side |
| Kazhdan–Patterson | no Whittaker uniqueness for GL₂^{(6)}: ρ^♮ is not determined by local data on the odd part | gives no evaluation; by Theorem D an evaluation would not suffice anyway |
| WMDS / Chinta–Friedberg–Hoffstein Rankin–Selberg | the block's Dirichlet series is a residue of a multiple Dirichlet series; CFH sees only the even part | the block's Mellin transform has poles at the target's zeros in the window (Prop E(c), SKETCH) |
| Dunn–Radziwiłł | unconditional θ₃ cusp expansions and Voronoi are already inside Prop 5.1 / Lemma 15.1 | their prime asymptotic assumes GRH, which here is (more than) the target |
| 6-fold Patterson identity | would make A^θ explicit | numerically false at primes (computation note); by Theorem D(i) any evaluation of the block is an evaluation of the probe |

**Precise obstruction** (§8). With Theorem A, Lemma 3.2 of the subtract note becomes an identity between the probe and
the theta–row form with no unproved input on the low side. The P_a^{1/6} loss is the Cauchy–Schwarz norm of that form.
Removing it by a power is the improved low bound itself. In the window that is the improved zero-free half-plane.

---

## 1. Setting and notation

Notation of the 7/8 manuscript (§4.1). F = Q(√−3), O = Z[ω], λ = √−3, primary generators (≡ 1 mod 3), e(z) =
exp(2πi Tr(z/λ)), χ_p(x) = (x/p)₆ zero-extended, χ_c(x) = Π_p χ_p(x)^{v_p(c)} for every primary c outside S (also
non-squarefree c), γ_j(c) = q_c^{−1/2}Σ_{v mod c}χ_c(v)^j e(v/c) for squarefree c. S is the manuscript's finite excluded
set: it contains 2, λ and a finite set S′ of good primes (conductor primes and all primes of norm ≤ P₀). The ray group T
is the ray group modulo 12; for a primary c its class is c mod 4 (manuscript Lemma 4.4).

**Complete Gauss sums.** For y ∈ O∖{0} and every primary c prime to S put

  g̃(y, c) := N(c)^{−1/2} Σ_{d mod c} χ_c(d) e(yd/c).

For (y, c) = 1 and c squarefree, g̃(y, c) = conj(χ_c(y))γ₁(c); for (y, c) = 1 and c not squarefree, g̃(y, c) = 0.

**Complete class-σ Kubota series.** For σ ∈ T,

  D_σ(y; u) := Σ_{c ∈ σ} g̃(y, c) N(c)^{−u}    (c primary, prime to S; absolutely convergent for Re u > 1).

**Complete theta coefficient.** ρ^♮_σ(y) := (3/2)·Res_{u=2/3} D_σ(y; u) (Theorem A, Step A.5, shows the residue exists
and is the only singularity in Re u ≥ 1/2). The factor 3/2 matches the first-moment normalisation of the conjecture
note. The conjecture note's ρ_σ is the residue of the *stripped* series (c squarefree, (c, 6y) = 1); see §3.9.

**Rows and the additive factor.** Rows are m ∈ O, 0 < q_m ≤ CQ. The S-unit e₀ and the sign κ_σ ∈ {±1} are those of
subtract-note Lemma 2.2 [P-rel there, exact-checked]. The manuscript's additive factor (§6.1) satisfies

  A_m := A_{m,σ,v}(Y′) = (κ_σ/τ)·Ã(e₀m),   Ã(y) := Y′^{−1} Σ_{s∈σ} W₁(N(s)/Y′)(N(s)/Y′)^{−1/2+iv} g̃(−y, s).   (1.1)

Put A^θ_m := (2κ_σ/3τ)Ŵ₁(1/6+iv)Y′^{−1/3}ρ^♮_σ(−e₀m), A^R_m := A_m − A^θ_m, and
M^♮_σ(Q) := Σ_{0<q_m≤Q}|ρ^♮_σ(−e₀m)|². Ŵ₁(w) = ∫₀^∞W₁(r)r^{w−1}dr.

**Low separation, tuples, rows B.** As in the conjecture note §1: for a rescaled subset J with slot length d,
Q = q_{b*}X′Y′ ≍ Z^{M′}, P_a = Y′²/Q = q_{b*}^{−1}Z^b, and (6.2) reads

  I_J = (Q^{−1/2}/2π)∫Ŵ₀(iv) Σ_σ Σ_{m≠0} Ω(q_m/Q)ξ(m)(q_m/Q)^{−iv} A_{m,σ,v}(Y′) B^J_{m,σ}(Z) dv.

Lemma 15.1: ‖B^J‖²_Q := Σ_{q_m≪Q}|B^J_{m,σ}(Z)|² ≪ Z^{M′+ε}.

---

## 2. The statement and what proving it would mean

**Theta–row form.** 𝔅^{♮,J}_{σ,v}(Z) := Σ_{m≠0} Ω(q_m/Q)ξ(m)(q_m/Q)^{−iv} ρ^♮_σ(−e₀m) B^J_{m,σ}(Z).

> **Conjecture TRO6^♮(η) [CONJECTURE].** There is η > 0 such that for every ε > 0, uniformly in J, σ, v,
>
>   |𝔅^{♮,J}_{σ,v}(Z)| ≪_ε (1+|v|)^{J₀} Z^{−ηb/12+ε} M^♮_σ(cQ)^{1/2} ‖B^J‖_Q.

This is TRO6(η) of the conjecture note with ρ_σ replaced by ρ^♮_σ (reason: §3.9). Cauchy–Schwarz gives the case η = 0.

**Aggregated form.** For the paper's data define

  Θ_ϑ(Z) := Σ_J Σ_{tuples p_J} c_J(p_J) · Q^{−1/2}·(1/2π)∫Ŵ₀(iv)Ŵ₁(1/6+iv)Y′^{−1/3} Σ_σ (2κ_σ/3τ) 𝔅^{♮,J}_{σ,v}(Z) dv,   (2.1)

where ϑ is the target character (the manuscript's η; the letter η is kept for the exponent of TRO6),
c_J(p_J) = (−1)^{|J|}q_{p_J}^{−3/2}ϑ(p_{J^c})Π_iW_i(q_{p_i}/P_i) are the coefficients of (12.5), and the tuple sums are
those of (12.5) and (15.8). "Aggregated TRO6^♮(η)" means |Θ_ϑ(Z)| ≪ Z^{l_x/2+(1−η)b/12+ε} for every primitive ϑ.

**What a proof would have to deliver.** By Theorem D below, the aggregated TRO6^♮(η) is the same statement as the
improved low bound for the probe, and in the window σ₀ = 7/8 − η/96 > 7/8 − m_hi it is the same statement as the
zero-free half-plane Re s > σ₀ for the family (given (H_{σ₀})). A proof of TRO6 is therefore a proof of a new
quasi-Riemann bound for ζ. Section 7 records why each named tool cannot produce one.

---

## 3. Theorem A: the zero-independent inputs

### 3.1 Statement

> **Theorem A [PROVED-rel (K1)–(K3), (LS)].** Fix σ ∈ T, the fixed data (S, e₀, W₁), a row-ball constant C and ε > 0.
> There is B₀ depending only on the fixed data such that for all Q, Y′ ≥ 1 and t, v ∈ R:
> * **(MV)** Σ_{0<q_m≤Q} |D_σ(−e₀m; 1/2+ε+it)|² ≪ Q^{1+O(ε)}(1+|t|)^{B₀};
> * **(Id)** Σ_{0<q_m≤CQ} |A^R_m|² ≪ (1+|v|)^{B₀}(Q/Y′)(QY′)^{O(ε)};
> * **(MS)** M^♮_σ(Q) ≪ Q^{5/6+O(ε)};
> * **(A.8)** Σ_{0<q_m≤CQ} |A_m|² ≪ (1+|v|)^{B₀}(Q/Y′)(1 + P_a^{1/6})(QY′)^{O(ε)}, with P_a = Y′²/Q.
>
> Moreover D_σ(y; u) is holomorphic on Re u ≥ 1/2 except for at most a simple pole at u = 2/3, with polynomial growth
> in |Im u| there.

The proof is Steps A.0–A.8 below. Only (K1)–(K3), (LS) and, for (MS), the manuscript's elementary Lemma 6.2 are
cited. Every other step is proved here.

### 3.2 Inputs

Bröker–Hoffstein (BH16) work with S₀ = {places above 2, 3, ∞}, N = [F:Q] = 2, n = 6.

* **(K1)** [CITED BH16 Thm 2.4, which cites Eckhardt–Patterson §5 (not read)]. For r ∈ O∖{0} and a coset η of
  K_{S₀}^×/K_{S₀}^{×6}, the series ψ(r, s, η) = Σ_c g₆(r, ε, c)|c|_{S₀}^{−s−1}L_{S₀}(|·|^{6s+1}), the sum over ideals
  prime to 6 with generator in ηK_{S₀}^{×6}, converges absolutely for Re s > 1/2, continues meromorphically to C, and in
  Re s ≥ 0 has at most one pole, at s = 1/6. The pole is simple (the constant term ratio
  ζ*_F(12s−6)/ζ*_F(12s−5) of Kubota's Eisenstein series has a simple pole there; BH16 §1) [CITED]. Here
  L_{S₀}(|·|^{6s+1}) = ζ_F^{S₀}(6s+1) and g₆(r, ε, c) = Σ_{x mod c} ε((x/c)_{S₀}) e_{S₀}(rx/c).
* **(K2)** [CITED BH16 (3.1), (3.10); DERIVED Laurent property]. Put γ(s) = Γ(6s)/Γ(s), Ψ(r, s, η) = y₁^{−s}γ(s)ψ(r, s, η),
  y₁ = (2π)⁵|r|_{S₀}^{−1/2}Π_{v|6}|π_v|_v^{3d_v}. Over a full set of representatives η_i of K_{S₀}^×/K_{S₀}^{×6}O_{S₀}^×,
  Ψ(r, s, η_i) = κ₀G_f(s)Σ_j T_ij(r, s)Ψ(r, −s, η_j), with κ₀ = 6Π_v|π_v|^{−d_v/2} and
  G_f(s) = Π_{v|6}(1 − |π_v|_v^{1−6s})^{−1}.
  * By (3.10), T_ij(r, s) is a finite sum of: Hilbert-symbol constants × Π_{v|6}|r/(η_iη_j)|_v^s × Π_{v|6}(1 − |π_v|_v^{6s})
    × products of Tate factors Γ_v(|·|^sε(y,·)).
  * The unramified Tate factors have denominators 1 − ζq_v^{−s} with ζ ∈ μ₆, and each divides 1 − q_v^{−6s}. The
    ramified ones are monomials in q_v^{−s}.
  * Hence T_ij(r, s) is a Laurent polynomial in 3^{−s}, 4^{−s}. BH16 §4.5 report the same from their computation:
    denominator V⁵W³ with V = 3^{−s}, W = 4^{−s}.
  * For r whose S₀-part is reduced (valuations at 2 and λ in {0, …, 5}), the coefficients run over a finite set.
* **(K3)** [CITED BH16 §3, remark after (3.1), citing their reference [4, Thm 2.4]]. Ψ(r, s, η) decays exponentially in
  |Im s| on vertical strips away from its poles. (Below only finite order and polynomial growth of ψ are used, together
  with the Gaussian in 𝔥.)
* **(LS)** [CITED manuscript Lemma 9.1; it specialises Blomer–Goldmakher–Louvel Thm 1.3 and Heath-Brown's cubic sieve].
  For a fixed finite S containing the primes above 6:
  Σ_{k sf, q_k≤K}|Σ_{n sf, q_n≤D} c_nχ_n(k)^{±1}|² ≪_{S,ε} (KD)^ε(K + D + (KD)^{2/3})Σ|c_n|².
  Fixed restrictions of the rows and of the column support are allowed.

**Matching of conventions** [DERIVED; routine, not written out in full].
* For z = rx/c with c prime to 6, the 2- and 3-adic factors of e_{S₀} are 1, so e_{S₀}(z) = exp(−2πi Tr z) = e(−λz).
* (x/c)_{S₀} = χ_c(x)^{±1}, by the product formula for Hilbert symbols.
* Hence g̃_{BH}(r, c) := N(c)^{−1/2}g₆(r, ε, c) equals g̃(−λr, c), or the complex conjugate of g̃(λr, c).
* Each class σ ∈ T is a union of S₀-cosets. Two primary c in one coset differ by a 2-adic and 3-adic sixth power times
  an S₀-unit; sixth powers of local units are ≡ 1 mod 4 and mod 3λ, and primary normalisation removes the unit.
* So a class-σ series with moduli prime to S₀ is a finite sum of the ψ(r, u − 1/2, η), divided by ζ_F^{S₀}(6u − 2),
  with r = ∓λ^{−1}y (possibly conjugated at ū).
* Conjugation, a change of the index by a unit or an S₀-unit, and the factor 1/ζ_F^{S₀}(6u−2) (bounded and nonzero on
  Re u ≥ 1/2 + ε) do not affect any statement below.

### 3.3 Step A.1: Gauss sums at moduli meeting the row [PROVED; EXACT check]

**Lemma A.1.** Let p be a primary prime outside S₀, y ∈ O∖{0}, j = v_p(y), k ≥ 1, and g(y, c) := N(c)^{1/2}g̃(y, c).
* (a) g(y, p^k) = 0 unless k = j + 1, or 6 | k ≤ j.
* (b) If k = j + 1 and 6 ∤ k: g(y, p^k) = N(p)^j·g_{χ_p^k}(p, y/p^j) and |g̃(y, p^k)|² = N(p)^{k−1}.
* (c) If k = j + 1 and 6 | k: g(y, p^k) = −N(p)^j and |g̃(y, p^k)|² = N(p)^{k−2}.
* (d) If 6 | k ≤ j: g(y, p^k) = N(p)^k(1 − N(p)^{−1}) and |g̃(y, p^k)|² ≤ N(p)^k.
* (e) For coprime primary c₁, c₂ prime to S₀: g̃(y, c₁c₂) = χ_{c₁}(c₂)χ_{c₂}(c₁)g̃(y, c₁)g̃(y, c₂).
* (f) Let c be primary, prime to S₀, and c = c₁c₂ with c₁ the part of c on the primes dividing y. If g̃(y, c) ≠ 0,
  then c₂ is squarefree and prime to y, c₁ is powerful (every exponent ≥ 2), and

    g̃(y, c) = g̃(y, c₁) · R(c₂, c₁) · γ₁(c₂) · conj(χ_{c₂}(y c₁⁴)).   (A.2)

  Moreover |g̃(y, c₁)|² ≤ N(d′), where d′ = d′(y, c₁) := Π_{p^k∥c₁}p^{e_p} with e_p = k − 1 in cases (b), (c) and
  e_p = k in case (d). Then rad(c₁) | d′, d′ | y and d′ | c₁.

*Proof.*
1. (a)–(d). Write y = p^jy′. The character χ_p(d)^k depends on d mod p. The additive factor e(yd/p^k) depends on
   d mod p^{max(k−j, 0)}.
   * If k ≥ j + 2: summing over the lifts d = d₀ + p^{k−1}t (t mod p) multiplies each term by Σ_t e(y′t/p) = 0.
   * If k ≤ j: the additive factor is 1, so the sum is Σ_{d mod p^k}χ_p(d)^k. This is 0 unless 6 | k, and then φ(p^k).
   * If k = j + 1: the summand depends on d mod p, and each residue has N(p)^j lifts. So
     g = N(p)^jΣ_{d₀ mod p}χ_p(d₀)^k e(y′d₀/p). This is a Gauss sum of absolute value N(p)^{1/2} if 6 ∤ k, and the
     Ramanujan sum −1 if 6 | k.
   * Dividing by N(p)^{k/2} gives the sizes.
2. (e) is the Chinese remainder theorem with d = c₂x + c₁w.
3. (f), structure. If p ∤ y and p² | c, then (a) with j = 0 kills the term. If p | y, (a) forces
   v_p(c) ∈ {j + 1} ∪ {6, 12, …, ≤ j}, and all of these are ≥ 2. If p ∤ y then g̃(y, p) = conj(χ_p(y))γ₁(p) ≠ 0.
4. (f), identity. For c₂ squarefree and prime to y, g̃(y, c₂) = conj(χ_{c₂}(y))γ₁(c₂). Lemma 4.4 gives
   χ_{c₁}(c₂) = R(c₂, c₁)χ_{c₂}(c₁). So
   χ_{c₁}(c₂)χ_{c₂}(c₁)conj(χ_{c₂}(y)) = R(c₂, c₁)χ_{c₂}(c₁)²conj(χ_{c₂}(y)) = R(c₂, c₁)conj(χ_{c₂}(yc₁⁴)),
   and (e) gives (A.2).
5. The bound on |g̃(y, c₁)|² is the product of (b)–(d) over p | c₁; the multiplicativity factors in (e) are roots of
   unity. ∎

[EXACT] `tmp/sextic/proof_checks.py` (log `proof_checks.log`, summary `proof_checks.json`), by direct summation over
complete residue systems:
* (a)–(d): 84 cases (primes of norm 7, 13, 19; j ∈ {0, 1, 2, 3, 5, 6}; k ≤ 7 for norm 7; moduli of norm ≤ 9·10⁵);
* (A.2) and (e): 16 cases each (c₁ ∈ {π₇², π₇³, π₇²π₁₃²}, c₂ ∈ {π₁₉, π₄₃, π₁₉π₄₃});
* zero failures.

### 3.4 Step A.2: large sieve with arbitrary rows [PROVED-rel (LS)]

**Lemma A.2.** For K, D ≥ 1 and b(c) supported on squarefree primary c prime to S₀ with N(c) ≤ D,

  Σ_{y primary, prime to S₀, N(y)≤K} |Σ_c b(c)χ_c(y)^{±1}|² ≪_ε (KD)^ε(K + K^{1/2}D + (KD)^{2/3}) Σ_c|b(c)|².

*Proof.*
1. Write y = af uniquely, with a squarefree, f powerful and (a, f) = 1. Then χ_c(y) = χ_c(a)χ_c(f).
2. Fix f with B < N(f) ≤ 2B. The coefficients b(c)χ_c(f)^{±1} do not depend on a, and (a, f) = 1 is a fixed
   restriction of the rows.
3. (LS) with S = S₀ and K/B in place of K bounds this part by (KD)^ε(K/B + D + (KD/B)^{2/3})Σ|b|².
4. There are ≪ B^{1/2} powerful f with N(f) ≤ 2B. Summing over dyadic B ≤ K,
   Σ_B B^{1/2}(K/B + D + (KD/B)^{2/3}) ≪ K + K^{1/2}D + (KD)^{2/3}. ∎

### 3.5 Step A.3: large sieve for the complete Gauss-sum coefficients [PROVED-rel A.1, A.2]

**Lemma A.3.** Fix a unit ε₀ and an S₀-part y_S with valuations in {0, …, 5}. For Q, C ≥ 1 and b(c) supported on
primary c prime to S₀ with N(c) ≤ C,

  Σ_{y_g primary, prime to S₀, N(y_g)≤Q} |Σ_c b(c) g̃(ε₀y_Sy_g, c)|² ≪_ε (QC)^ε(Q + Q^{1/2}C + (QC)^{2/3}) Σ_c|b(c)|².

*Proof.*
1. g̃(ε₀y_Sy_g, c) = conj(χ_c(ε₀y_S))g̃(y_g, c), by d ↦ (ε₀y_S)^{−1}d mod c. The factor depends on c only; absorb it
   into b(c). Write y = y_g.
2. By A.1(f), Σ_c b(c)g̃(y, c) = Σ_{c₁}g̃(y, c₁)I_{c₁}(y). Here c₁ runs over the powerful moduli with rad(c₁) | y and
   g̃(y, c₁) ≠ 0, and
   I_{c₁}(y) := Σ_{c₂ sf, (c₂, y)=1} b(c₁c₂)R(c₂, c₁)γ₁(c₂)conj(χ_{c₂}(yc₁⁴)).
   There are at most Π_{p|y}(2 + v_p(y)) ≤ d_O(y)² ≪ Q^ε admissible c₁. By Cauchy–Schwarz,
   |Σ_c b(c)g̃(y, c)|² ≪ Q^εΣ_{c₁}|g̃(y, c₁)|²|I_{c₁}(y)|².
3. Fix c₁ and the case pattern of A.1 at each p | c₁ (≪ N(c₁)^ε patterns). The corresponding rows satisfy d′ | y.
   Write y = d′y″ with N(y″) ≤ Q/N(d′). Then conj(χ_{c₂}(yc₁⁴)) = conj(χ_{c₂}(d′c₁⁴))·conj(χ_{c₂}(y″)). The condition
   (c₂, y) = 1 is carried by the zero values of χ_{c₂}(d′) and χ_{c₂}(y″). So I_{c₁}(y) = Σ_{c₂}b′(c₂)conj(χ_{c₂}(y″))
   with b′(c₂) := b(c₁c₂)R(c₂, c₁)γ₁(c₂)conj(χ_{c₂}(d′c₁⁴)). This b′ does not depend on y″, and |b′(c₂)| ≤ |b(c₁c₂)|.
4. Apply Lemma A.2 with K = Q/N(d′) and D = C/N(c₁), and use |g̃(y, c₁)|² ≤ N(d′) and 1 ≤ N(d′) ≤ N(c₁). This
   (c₁, pattern) contributes
   ≪ (QC)^εN(d′)(Q/N(d′) + (Q/N(d′))^{1/2}C/N(c₁) + (QC/(N(d′)N(c₁)))^{2/3})Σ_{c₂}|b(c₁c₂)|²
   ≤ (QC)^ε(Q + Q^{1/2}C + (QC)^{2/3})Σ_{c₂}|b(c₁c₂)|².
5. In a nonzero term, c₁ is the powerful part of c and c₂ is its squarefree part. So each c belongs to one c₁, and
   Σ_{c₁}Σ_{c₂}|b(c₁c₂)|² ≤ Σ_c|b(c)|². ∎

*Remark.* Step 3 uses two facts from A.1: c₁ is powerful, and the rows that carry c₁ are divisible by d′ with
|g̃(y, c₁)|² ≤ N(d′). A trivial treatment of the gcd terms loses a factor N(c)^{1/2}.

### 3.6 Step A.0: moduli prime to the full excluded set S [PROVED]

The manuscript's s-sums run over moduli prime to S = S₀ ∪ S′, with S′ a fixed finite set of good primes. (K1)–(K2)
concern moduli prime to S₀. Removing one prime p ∈ S′ is a finite linear inversion.

**Lemma A.0.** Fix p ∈ S′. For y with p ∤ y, a class σ′ ∈ T and a ∈ Z/6Z, put

  V_{a,σ′}(y; u) := Σ_{c∈σ′, p∤c} g̃(yp^a, c)N(c)^{−u},   D^{(p)}_{σ′}(Y; u) := Σ_{c∈σ′} g̃(Y, c)N(c)^{−u},

with all moduli prime to S₀ and to a fixed set S″ ⊂ S′∖{p}. (The lemma is applied with S″ = S′ first and then with
S″ shrinking by one prime at each step; S″ plays no role in the local analysis at p.)
* (a) g̃(Yp⁶, c) = g̃(Y, c) for p ∤ c. So V_{a,σ′} depends only on a mod 6. For a row with v_p(y) = v, the p-coprime
  series at y is V_{v mod 6}(yp^{−v}).
* (b) For b ∈ {0, …, 5}:
  D^{(p)}_{σ′}(yp^b; u) = V_{b,σ′}(y; u) + a_b(y, σ′; u)·V_{(4−b) mod 6, σ′p^{−(b+1)}}(y; u),
  where a_b := g̃(yp^b, p^{b+1})N(p)^{−(b+1)u}R(σ′p^{−(b+1)}, p)^{b+1}, |a_b| = N(p)^{b/2−(b+1)Re u} for b ≤ 4, and
  |a₅| = N(p)^{2−6Re u}.
* (c) The 72 equations (b) (b ∈ Z/6Z, σ′ ∈ T) in the 72 unknowns V_{a,σ′} split into blocks
  {(b, σ′), (4 − b, σ′p^{−(b+1)})} of size 1 or 2. Each block determinant is 1 − aa′ or 1 + a, with
  |aa′| = N(p)^{2−6Re u} and |a| ≤ N(p)^{1−3Re u}. On Re u ≥ 1/2 every determinant has absolute value
  ≥ 1 − N(p)^{−1/2} > 0.
* Consequently each V_{a,σ′}(y; u) is a linear combination of the six series D^{(p)}_{σ″}(yp^b; u), b ∈ {0, …, 5}. The
  coefficients are holomorphic and bounded on Re u ≥ 1/2 (indeed on Re u > 1/3 + δ) and depend on y only through
  χ_p(y). Iterating over p ∈ S′: the manuscript's series D_σ(y; u) is a linear combination of S₀-series at the indices
  y_{(S′)}Π_{p∈S′}p^{b_p}, b_p ∈ {0, …, 5}, with coefficients holomorphic and bounded on Re u ≥ 1/2 uniformly in y.

*Proof.*
1. (a): for p ∤ c substitute d ↦ p^{−6}d.
2. (b): split c = p^kc′ with p ∤ c′. By A.1(a) with j = b ≤ 5, only k = 0 and k = b + 1 contribute.
   * For k = b + 1, A.1(e) and Lemma 4.4 give χ_{p^{b+1}}(c′)χ_{c′}(p^{b+1}) = R(c′, p)^{b+1}χ_{c′}(p)^{2b+2}.
   * Also g̃(yp^b, c′) = conj(χ_{c′}(p))^b g̃(y, c′).
   * The phases multiply to R(c′, p)^{b+1}conj(χ_{c′}(p))^{−b−2}, which is the index (4 − b) mod 6.
   * R(c′, p) is constant on the class σ′p^{−(b+1)} of c′, because R depends on square classes mod 4.
   * The sizes are A.1(b), (c).
3. (c): the equation (4 − b, σ′p^{−(b+1)}) involves the unknown (b, σ′p^{−6}) = (b, σ′), since p⁶ ≡ 1 mod 4
   ((O/4)^× ≅ C₃ × C₂ × C₂ has exponent 6). In each case ((0,4), (1,3), (2,2), (5,5)) the block product of the |a_b| is
   N(p)^{2−6Re u}. Good primes have N(p) ≥ 7. ∎

*Remark.* The coupling 0 ↔ 4, 1 ↔ 3, with 2 and 5 self-coupled, mirrors the local pattern of the Kazhdan–Patterson
Hecke relations recalled in the literature note §2.3.

### 3.7 Step A.4: approximate functional equation [PROVED-rel (K1)–(K3)]

**Lemma A.4.** Let r ∈ O∖{0} have reduced S₀-part, and put Y(r) := y₁(r)^{−1} ≍ N(r_g)^{1/2}. Let η_i be a coset,
s₀ = ε + it with 0 < ε < 1/24, and 𝔥(w) := e^{w²}((s₀ + w)² − 1/36)/(s₀² − 1/36). Write
T_ij(r, s) = Σ_ν t_{ij,ν}(r)q_ν^{−s} (a finite sum, q_ν = 3^{ν₁}4^{ν₂}, ν ∈ Z²). Then

  ψ(r, s₀, η_i) = Σ_{c∈η_i}Σ_{(k,6)=1} N(k)^{−1−6s₀} g̃_{BH}(r, c)N(c)^{−1/2−s₀} V₁(N(c)N(k)⁶/Y(r))
    − κ₀Σ_jΣ_ν t_{ij,ν}(r)Y(r)^{−2s₀}q_ν^{−s₀} Σ_{c∈η_j}Σ_k N(k)^{−1+6s₀} g̃_{BH}(r, c)N(c)^{−1/2+s₀} V₂(N(c)N(k)⁶/(q_νY(r))),

where k runs over all ideals in the second line,

  V₁(x) = (1/2πi)∫_{(2)}[γ(s₀+w)/γ(s₀)]x^{−w}𝔥(w)dw/w,   V₂(x) = (1/2πi)∫_{(−2)}[γ(−s₀−w)/γ(s₀)]x^{w}𝔥(w)dw/w,

and for every A > 0 there is B = B(A) with

  |V₁(x)| ≪ (1+|t|)^B min(1, x^{−A}),   |V₂(x)| ≪ (1+|t|)^B min(x^{−2ε}, x^{−A}).

The same bounds hold for (x∂_x)^jV_i, with B = B(A, j).

*Proof.*
1. Poles. Ψ(r, s, η_i) is meromorphic with poles at most at s = ±1/6.
   * In Re s ≥ 0 this is (K1); γ has a removable point at s = 0.
   * In Re s < 0 use (K2): there G_f(s) and γ(−s) are holomorphic, and ψ(r, −s, ·) has its only pole at −s = 1/6.
   * 𝔥 vanishes at s₀ + w = ±1/6 and 𝔥(0) = 1.
2. Shift ∫_{(2)}Ψ(r, s₀ + w, η_i)𝔥(w)dw/w to Re w = −2. The only residue is Ψ(r, s₀, η_i) at w = 0. The horizontal
   segments vanish by (K3) and the Gaussian.
3. On Re w = 2, expand ψ; it converges absolutely since Re(s₀ + w) > 1/2.
4. On Re w = −2, apply (K2). For Re s < −1/2 one has G_f(s)L_{S₀}(|·|^{1−6s}) = ζ_F(1 − 6s), so
   G_f(s)Ψ(r, −s, η_j) = Y(r)^{−s}γ(−s)ζ_F(1 − 6s)Σ_{c∈η_j}g₆(r, ε, c)|c|^{s−1}. Expand ζ_F(1 − 6s) = Σ_kN(k)^{−1+6s}
   and T_ij.
5. Divide by Y(r)^{s₀}γ(s₀) and collect the w-powers; this gives the two lines.
6. Bounds for x ≥ 1: move the contours to Re w = A (V₁) or Re w = −A (V₂).
7. Bounds for x < 1:
   * Move V₁ to Re w = −1/4. This crosses w = 0 (residue 1) and Re(s₀ + w) = −1/6, where the pole of Γ(6(s₀ + w)) is
     cancelled by the factor (s₀ + w)² − 1/36 of 𝔥.
   * Move V₂ to Re w = −2ε. No pole is crossed: γ(−s₀ − w) is holomorphic for Re(s₀ + w) < 0.
8. Stirling bounds the gamma ratios by (1 + |t| + |w|)^{O_A(1)}e^{(5π/2)|Im w|}, which e^{w²} absorbs. The
   derivatives (x∂_x)^j bring down powers of w. ∎

### 3.8 Steps A.5–A.8: the mean value and its consequences

**Proposition A.5 (MV)** [PROVED-rel A.0–A.4]. For every t ∈ R and Q ≥ 1,
Σ_{0<q_m≤Q}|D_σ(−e₀m; 1/2+ε+it)|² ≪_ε Q^{1+O(ε)}(1+|t|)^{B₀}. Moreover D_σ(y; u) is holomorphic on Re u ≥ 1/2 except
for at most a simple pole at u = 2/3, with polynomial growth in |Im u| there.

*Proof.*
1. Reduction to S₀-series (A.0). |D_σ(y; u₀)|² ≪ Σ_{(b_p), classes}|D^{S₀}(y_{(S′)}Π_pp^{b_p}; u₀)|². The map from rows m
   to the indices y_{(S′)}Πp^{b_p} has multiplicity ≪ (log Q)^{|S′|}, because the S′-part of m is forgotten. So it
   suffices to bound Σ_r|D^{S₀}_{σ″}(r; u₀)|² over r in a fixed (unit, S₀-part) class with N(r_g) ≤ C′Q.
2. D^{S₀} is a finite combination of the ψ, divided by ζ_F^{S₀}(6u − 2), and |1/ζ_F^{S₀}(1 + 6ε + 6it)| ≪ ε^{−1}. So
   it suffices to treat ψ(r, s₀, η) with s₀ = ε + it, u₀ = 1/2 + s₀.
3. Apply Lemma A.4. There are finitely many terms (one direct sum; finitely many dual sums indexed by j, ν). Their
   coefficients are bounded uniformly in r: |Y(r)^{−2s₀}| ≤ 1, and the t_{ij,ν}(r) lie in a finite set. Take one term,
   S(r) = Σ_kβ(k)Σ_c g̃_{BH}(r, c)N(c)^{−α}U(N(c)N(k)⁶/(qY(r))), with α ∈ {1/2 + s₀, 1/2 − s₀}, |β(k)| ≤ N(k)^{−1+6ε}
   and U ∈ {V₁, V₂}.
4. Truncation. Y(r) ≪ Q^{1/2}, U(x) ≪ (1+|t|)^Bx^{−A} and |g̃_{BH}(r, c)| ≤ N(c)^{1/2}. So the terms with
   N(c)N(k)⁶ ≥ Q^{1/2+ε}(1+|t|)^{c₀} contribute O(Q^{−10}). Below that, N(k) ≤ Q^{1/12+ε}(1+|t|)^{c₀}. Then
   Σ_k|β(k)| ≪ Q^{O(ε)}(1+|t|)^{O(1)}, and Cauchy–Schwarz in k costs no more.
5. Fix k and a dyadic block N(c) ∼ C ≤ Q^{1/2+ε}(1+|t|)^{c₀} (smooth partition ω(N(c)/C)). Separate U by Mellin
   inversion on Re z = 3ε: U(x) = (1/2πi)∫Ũ(z)x^{−z}dz, with |Ũ(3ε + iτ)| ≪ (1+|t|)^B(1+|τ|)^{−2} by the bounds of A.4
   for U and (x∂_x)²U. Then
   |S_{k,C}(r)| ≤ Q^{O(ε)}∫|Ũ(z)||Σ_c b_z(c)g̃_{BH}(r, c)||dz|,  b_z(c) := ω(N(c)/C)N(c)^{−α−z}(N(k)⁶/q)^{−z},
   and Σ_c|b_z(c)|² ≪ 1, since |N(c)^{−α−z}| ≤ N(c)^{−1/2−ε} in both cases.
6. Cauchy–Schwarz in z and Lemma A.3 (applied to g̃(r′, c) or its conjugate, by the matching of §3.2) give
   Σ_r|S_{k,C}(r)|² ≪ Q^{O(ε)}(1+|t|)^{O(1)}(Q + Q^{1/2}C + (QC)^{2/3}) ≪ Q^{1+O(ε)}(1+|t|)^{O(1)}, using
   C ≤ Q^{1/2+ε}(1+|t|)^{c₀}.
7. Summing over the O(log Q) blocks, the values of k and the finitely many terms gives (MV).
8. Holomorphy and the pole: (K1), and A.0, whose coefficients are holomorphic on Re u > 1/3.
9. Polynomial growth: for each fixed r, Lemma A.4 gives |ψ(r, ε + it, η)| ≪_r (1+|t|)^B, and on Re u ≥ 1 + ε the series
   is bounded. Phragmén–Lindelöf interpolates (finite order by (K3)) after multiplying by u − 2/3. ∎

**Corollary A.6 (Id)** [PROVED-rel A.5]. For Q, Y′ ≥ 1 and v ∈ R,
Σ_{0<q_m≤CQ}|A^R_m|² ≪ (1+|v|)^{B₀}(Q/Y′)(QY′)^{O(ε)}.

*Proof.*
1. Mellin: W₁(r)r^{−1/2+iv} = (1/2πi)∫_{(2)}Ŵ₁(w − 1/2 + iv)r^{−w}dw. By (1.1),
   Ã(y) = Y′^{−1}(1/2πi)∫_{(2)}Ŵ₁(w − 1/2 + iv)Y′^wD_σ(−y; w)dw.
2. Move the contour to Re w = 1/2 + ε. By A.5 there is one simple pole, at w = 2/3, and polynomial growth; Ŵ₁ decays
   faster than any power on vertical lines.
3. The residue is Ŵ₁(1/6 + iv)Y′^{2/3}(2/3)ρ^♮_σ(−y). At y = e₀m, with the factor κ_σ/τ, this is Y′·A^θ_m. Hence
   A^R_m = (κ_σ/τ)Y′^{−1}(1/2πi)∫_{(1/2+ε)}Ŵ₁(w − 1/2 + iv)Y′^wD_σ(−e₀m; w)dw.
4. Cauchy–Schwarz in w and (MV):
   Σ_m|A^R_m|² ≤ Y′^{−1+2ε}(∫|Ŵ₁(ε + iτ)|dτ)·∫|Ŵ₁(ε + i(τ + v))|Σ_m|D_σ(−e₀m; 1/2 + ε + iτ)|²dτ
   ≪ (1+|v|)^{B₀}Y′^{−1+2ε}Q^{1+O(ε)}. ∎

**Corollary A.7 (MS)** [PROVED-rel A.6 and manuscript Lemma 6.2]. M^♮_σ(Q) ≪ Q^{5/6+O(ε)}.

*Proof.*
1. Take v = 0 and Y′ = Q^{1/2}. Lemma 6.2 (the planar additive large sieve; the manuscript gives a complete elementary
   proof) gives Σ_{q_m≤CQ}|A_m|² ≪ (Q + Y′²)/Y′ ≪ Q^{1/2}. Lemma 6.2 is stated for A with the coefficient c_σ; by (1.1),
   |A_m| = |Ã(e₀m)|.
2. With A.6, Σ|A^θ_m|² ≤ 2Σ|A_m|² + 2Σ|A^R_m|² ≪ Q^{1/2+O(ε)}.
3. Σ|A^θ_m|² = (4/9)Ŵ₁(1/6)²Q^{−1/3}M^♮_σ(CQ), and Ŵ₁(1/6) > 0 since W₁ ≥ 0, W₁ ≠ 0. ∎

**Corollary A.8** [PROVED-rel A.6, A.7]. Σ_{0<q_m≤CQ}|A_m|² ≪ (1+|v|)^{B₀}(Q/Y′)(1 + P_a^{1/6})(QY′)^{O(ε)} for all
Q, Y′ ≥ 1.

*Proof.* |A|² ≤ 2|A^θ|² + 2|A^R|², and Σ|A^θ|² ≪ Y′^{−2/3}M^♮_σ(CQ) ≪ Y′^{−2/3}Q^{5/6+ε} = (Q/Y′)P_a^{1/6}Q^ε. ∎

*Consequences of A.8.*
* Prop 15.3 needs the length condition l_y − d − 11b/6 ≥ 1/12 only to absorb P_a²/Y′. With A.8 that condition is not
  needed.
* The condition is not binding at the paper geometry, nor in the conjecture note's re-optimised model (§5.3 there). So
  no value of θ changes.

*Lower bound, conditional.* If Prop 2.3 of the subtract note holds ([S] there), then
Σ|A_m|² ≥ (𝔈_σ(v) + o(1))(Q/Y′)P_a^{1/6}. With A.6 this gives M^♮_σ(Q) ≫ Q^{5/6}. [SKETCH, relative to Prop 2.3.]

### 3.9 Which coefficient the rows see [PROVED identities; HEURISTIC sizes; REF-CORR applied]

The additive rows see ρ^♮_σ: the residue of the class-σ series over **all** moduli prime to the manuscript's S,
including moduli that share primes with the row. The conjecture note's ρ_σ, and all its numerics, use a different
series: squarefree moduli prime to 6y. The two differ in two explicit ways.

**(a) Moduli sharing primes with the row.** Take residues termwise in (A.2); the c₁-sum is finite for fixed y. This
gives

  ρ^♮_σ(y) = Σ_{c₁} g̃(y, c₁) N(c₁)^{−2/3} R(σc₁^{−1}, c₁) · ρ^{str}_{σc₁^{−1}}(y c₁⁴),   (3.9)

where c₁ runs over the powerful moduli of A.1(f), and
ρ^{str}_{σ′}(Y) := (3/2)Res_{u=2/3}Σ_{c∈σ′, c sf, (c, Y)=1}conj(χ_c(Y))γ₁(c)N(c)^{−u}. The c₁ = 1 term is ρ^{str}_σ(y).
* *Squarefree rows.* If the good part of y is squarefree, then c₁ = Π_{p∈P}p² over subsets P of its primes. The p² term
  has weight N(p)^{1/2}·N(p)^{−4/3} = N(p)^{−5/6} (A.1(b) with j = 1).
* *Prime rows.* For y = π: ρ^♮_σ(π) = ρ^{str}_σ(π) + N(π)^{−5/6}γ₂(π)ρ^{str}_{σπ^{−2}}(π³), since R(·, π²) = 1. With the
  measured exponent-3 law |ρ(π³)| ≈ 1.05·N(π)^{−1/6}|ρ(π)| (computation note §6.1), the relative correction is
  ≈ N(π)^{−1}. **[REF-CORR]** For a row with v_p(y) = 1 the c₁ = p² term sits at index yp⁸, i.e. at index exponent 3
  against exponent 1 (not 2 against 0); both referees.

**(b) The primes of S′.** ρ_σ allows moduli divisible by the primes p ∈ S′, and A excludes them. Lemma A.0 gives the
exact relation: the S-coprime series is an explicit combination of S₀-series at the indices y·Πp^{b_p}. For p ∤ y the
terms with p | c carry relative weight |g̃(y, p)|N(p)^{−2/3} = N(p)^{−2/3} at the pole. S′ contains every prime of norm
≤ P₀, including norms 7, 13, 19, so these terms are not small (7^{−2/3} ≈ 0.27).

**Sizes** [HEURISTIC].
* (a) Rows divisible by p have density N(p)^{−1}, and the p² term has squared weight N(p)^{−5/3}. With moduli prime to 6
  only (the conjecture note's computations) the mean-square proportion is about
  Σ_pN(p)^{−8/3} ≈ 2·7^{−8/3} + 2·13^{−8/3} + 2·19^{−8/3} + … ≈ 0.015 if the companion coefficient is comparable to
  |ρ^{str}(y)|. ~~The computation note's §6.1 table (mean z² 22.0 at exponent 2 against 139 at exponent 0) suggests a
  ratio nearer 1/6, i.e. about 0.003.~~ **[REF-CORR]** Wrong exponents: the right comparison is exponent 3 against
  exponent 1 (mean z² 11.6 against 40.1, or the law 1.05·N^{−1/6}), which gives a share of about **0.4–0.8%**, still
  inside the 0.3–1.5% range of §9 [HEURISTIC]. With the manuscript's S only primes of norm > P₀ enter, giving
  ≈ Σ_{N(p)>P₀}N(p)^{−8/3}.
* (b) ~~A fixed proportion of order one when S′ contains small primes.~~ **[REF-CORR]** Withdrawn. Lemma A.0 couples
  exponent 0 to exponent 4, so the relative size of the S′ correction is N(p)^{−2/3}·|ρ(yp⁴)/ρ(y)|, not N(p)^{−2/3}.
  Referee 1 measured the ratio at the S-unit base at about 0.07. The size of (b) is not established.
* ~~Both are fixed positive proportions, independent of Q.~~ **[REF-CORR]** Not established; Q-independence is expected
  [HEURISTIC].

**Consequence.**
* (Id) holds for ρ^♮_σ (Cor A.6).
* For a coefficient that differs from ρ^♮_σ by a fixed positive proportion of its mean square, (Id) fails as P_a → ∞:
  the difference of the two theta parts has mean square ≍ (Q/Y′)P_a^{1/6}, which is of exceptional size [PROVED-rel
  M^♮ ≫ Q^{5/6}]. **[REF-CORR]** Whether ρ_σ − ρ^♮_σ carries such a share is the HEURISTIC size estimate above, and
  M^♮ ≫ Q^{5/6} is itself only SKETCH (relative to subtract-note Prop 2.3). So "(Id) fails for ρ_σ" is not established;
  what is established is that (Id) is proved for ρ^♮ and not for ρ_σ. TRO6 is stated with ρ^♮_σ (TRO6^♮).
* **[REF-CORR]** The two coefficients are explicit linear combinations of each other ((3.9); Lemma A.0 is invertible).
  The coefficients are not bounded: their mass is Π_{p|y}(1 + O(N(p)^{−5/6})), which is ≪ N(y)^ε. (3.9) is not
  triangular: exponents 1 and 3 couple in both directions. Transfer of mean-square exponents and of the presence or
  absence of local Gauss-sum laws is therefore expected up to N^ε factors [HEURISTIC]. The prime-row correction (a) is
  ≈ N(π)^{−1}.
* ~~Bröker–Hoffstein's Algorithm 4.1 (§4.6) also keeps the moduli that share a prime with r, i.e. it computes the
  complete coefficient (for their S₀).~~ **[REF-CORR]** Over-read: the printed loop of Algorithm 4.1 uses squarefree
  moduli coprime to r. Only the §4.6 text keeps the moduli sharing a prime with r.

---

## 4. Lemma B: only the unrescaled tuples need TRO6

Notation from here on: ϑ denotes the target character (the manuscript's η), so that η is only the saving exponent of
TRO6(η). Thus I_{ϑ,modified}, J_{II,ϑ}, f_{II,ϑ}, L^S_F(s, ϑ) are the manuscript's I_{η,modified}, J_{II,η}, f_{II,η},
L^S_F(s, η).

**Lemma B** [PROVED-rel Prop 15.3 and (15.8)]. Let 0 < η ≤ 1. Suppose that for every rescaled subset J with
d = Σ_{i∈J}ℓ_i < ηb/12 and every tuple p_J, the separated sum I_J of (6.2) satisfies
|I_J| ≪ (X′)^{1/2}P_a^{(1−η)/12}Z^ε. Then
|I_{ϑ,modified}(Z)| ≪ Z^{l_x/2+(1−η)b/12+ε}.
* With the manuscript's slots ℓ_i = ℓ/K (§20.6) the condition d < ηb/12 reads |J| < ηbK/(12ℓ) = ηK/16.
* If K < 16/η, only J = ∅ is involved, i.e. the tuple with every slot marked and no rescaling.

*Proof.*
1. J with d ≥ ηb/12: Prop 15.3 gives (X′)^{1/2}P_a^{1/12}Z^ε per tuple. The tuple sum (15.8) adds f(d) = −d, so the
   total exponent is l_x/2 + b/12 − d ≤ l_x/2 + (1 − η)b/12, since P_a ≍ Z^b.
2. J with d < ηb/12: the assumed bound and (15.8) give l_x/2 + (1 − η)b/12 − d ≤ l_x/2 + (1 − η)b/12.
3. There are finitely many J. ∎

*Remark.* At η* = 96·m_hi = 0.0219 the threshold is K < 731. The manuscript fixes K only through
2ℓ/K < min(η_mesh, b_round, 1/185), so K > 61.7, and η_mesh is not explicit. Whether K < 731 is therefore not
decided by the text [UNPROVED]. The lemma is stated for general K.

---

## 5. Theorem C: TRO6^♮ is the only remaining hypothesis

**Theorem C** [PROVED-rel Theorem A, Lemma 15.1, Lemma B, (20.1); last clause also relative to Prop 2.1 and (H_{σ₀})].
Let 0 < η ≤ 1. Assume TRO6^♮(η) for the tuples of Lemma B, uniformly in σ, v and p_J. Then

  |I_{ϑ,modified}(Z)| ≪ Z^{l_x/2+(1−η)b/12+ε} = Z^{3/16−η/96+ε}

at the paper geometry. Let σ₀ ∈ (7/8 − m_hi, 7/8] with σ₀ ≥ 7/8 − η/96, and assume (H_{σ₀}) (conjecture note §3.1:
the Part II high side and (10.2) hold with σ₀ in place of 7/8). If the hypothesis holds for every primitive target ϑ,
then β* ≤ σ₀: every Hecke L-function over Q(√−3), every Dirichlet L-function and ζ are zero-free in Re s > σ₀.

*Proof.*
1. Split A = A^θ + A^R in (6.2).
2. The A^R part, per tuple: Cauchy–Schwarz, Cor A.6 and Lemma 15.1 give
   Q^{−1/2}((Q/Y′)Z^ε)^{1/2}(Z^{M′+ε})^{1/2} ≪ (Q/Y′)^{1/2}Z^{O(ε)} ≍ (X′)^{1/2}Z^{O(ε)},
   using Z^{M′} ≍ Q and Q/Y′ = q_{b*}X′. No length condition is needed, since A.6 has no P_a²/Y′ term.
3. The A^θ part:
   I^θ_J = Q^{−1/2}(1/2π)∫Ŵ₀(iv)Ŵ₁(1/6+iv)Y′^{−1/3}Σ_σ(2κ_σ/3τ)𝔅^{♮,J}_{σ,v}dv.
   * TRO6^♮(η), Cor A.7 and Lemma 15.1 give |𝔅^{♮,J}_{σ,v}| ≪ (1+|v|)^{J₀}Z^{−ηb/12+ε}Q^{5/12+ε}Z^{M′/2+ε}.
   * Z^{M′/2} ≍ Q^{1/2}, and Q^{5/12}Y′^{−1/3} ≍ (X′)^{1/2}P_a^{1/12} since X′ = Q/(q_{b*}Y′) and P_a = Y′²/Q.
   * So |I^θ_J| ≪ (X′)^{1/2}P_a^{1/12}Z^{−ηb/12+O(ε)} ≍ (X′)^{1/2}P_a^{(1−η)/12}Z^{O(ε)}.
   * The v-integral converges because Ŵ₀(iv) decays faster than any power.
4. Lemma B gives the low bound.
5. With |A_T(Z)|^{−1} ≪ Z^ε from (20.1): |J_{II,ϑ}(Z)| ≪ Z^{C(σ₀)+ε}, which is (2.4) of Prop 2.1 at σ₀.
   (H_{σ₀}) supplies (2.2) and (2.5). Prop 2.1 then contradicts β* > σ₀. The restriction σ₀ > 7/8 − m_hi is the
   fixed-geometry high-side cap (conjecture note §5.2, B3). ∎

---

## 6. Theorem D: the probe is the theta–row form (the obstruction)

**Theorem D.**
* **(i)** [PROVED-rel Theorem A, Lemma 15.1, (15.8)] For every primitive target ϑ:
  I_{ϑ,modified}(Z) = Θ_ϑ(Z) + O(Z^{l_x/2+ε}), with Θ_ϑ the aggregated theta–row form (2.1) and l_x/2 = 17/96.
* **(ii)** [PROVED-rel (i)] For 0 < η ≤ 1: |Θ_ϑ(Z)| ≪ Z^{3/16−η/96+ε} for all ε > 0 if and only if
  |I_{ϑ,modified}(Z)| ≪ Z^{3/16−η/96+ε} for all ε > 0.
* **(iii)** Let σ₀ = 7/8 − η/96 ∈ (7/8 − m_hi, 7/8] and assume (H_{σ₀}).
  * (a) [PROVED-rel Prop 2.1] If |Θ_ϑ(Z)| ≪ Z^{C(σ₀)+ω} for every primitive ϑ and every ω > 0, then β* ≤ σ₀.
  * (b) [SKETCH, = conjecture note Prop E(b)] Conversely, if β* ≤ σ₀, then |Θ_ϑ(Z)| ≪ Z^{C(σ₀)+ε} for every ϑ.

*Proof.*
1. (i): split A = A^θ + A^R in (6.2), as in Theorem C. The A^θ part is Θ_ϑ by definition (2.1). The A^R part is
   O((X′)^{1/2}Z^{O(ε)}) per tuple (Theorem C, step 2), and (15.8) sums it to O(Z^{l_x/2+ε}).
2. (ii): 17/96 ≤ 3/16 − η/96 if and only if η ≤ 1.
3. (iii)(a): by (i), |I_{ϑ,modified}| ≪ Z^{C(σ₀)+ω}, since C(σ₀) ≥ C(83/96) = 17/96. Divide by c_SA_T(Z) and apply
   Prop 2.1 with (H_{σ₀}).
4. (iii)(b): conjecture note §3.2(b). It uses Part II below 7/8, i.e. (H_{σ₀}) and its re-checks. ∎

*What is new compared with the subtract note and the conjecture note.*
* Theorem D(i) is subtract-note Lemma 3.2 with A^E = A^θ.
* The decomposition is now explicit, and its remainder estimate (Id) is proved (Cor A.6).
* So the low side of the 7/8 architecture contains no unproved step between the probe and the sextic theta
  coefficients. Item E1 of the conjecture note (A^θ is an admissible exceptional piece) is now proved, with ρ^♮ in
  place of ρ_σ.

*Consequence (E2 of the conjecture note, low side now rigorous).* An evaluation of Θ_ϑ with error o(Z^{C(σ₀)}) is an
evaluation of the probe with the same error, by (i). Through the high side, its Mellin transform has poles exactly at
the zeros of L^S_F(s, ϑ) in Re s > max(σ₁, 7/8 − m_hi) (conjecture note Prop E(c), [SKETCH]). This holds whatever the
source of the evaluation: a 6-fold Patterson identity, a CFH-type identity, a Voronoi formula for θ₆, or a multiple
Dirichlet series.

---

## 7. The named tools, one by one

### 7.1 Kubota / Eckhardt–Patterson functional equation

* **Used for:** Theorem A, i.e. continuation, the simple pole at u = 2/3, the approximate functional equation, and
  hence (MV), (Id), (MS), (A.8).
* **What it cannot give:**
  * The functional equation acts on the modulus variable for each fixed row index. Its matrix T(r, s) depends on r
    only through the S₀-adic class of r and N(r_g).
  * It produces statements about ρ^♮ alone.
  * TRO6 concerns the pairing of ρ^♮ with B^J, which depends on the target ϑ. By Theorem D a proof of TRO6 must
    contain information about the zeros of L^S_F(s, ϑ).
* **Status:** [PROVED-rel (K1)–(K3)] for the yield.

### 7.2 Large sieve for sextic characters

* **Used for:** Lemmas A.2–A.3, hence (MV).
* **Applied to 𝔅 directly:** write 𝔅 = Σ_m ρ^♮_σ(−e₀m)b_m with b_m := Ω(q_m/Q)ξ(m)(q_m/Q)^{−iv}B^J_{m,σ}(Z).
  * The large sieve gives inequalities |Σ_m a_mb_m| ≤ F·‖a‖ that hold for every vector a; they are operator-norm
    bounds.
  * Taking a = conj(b)/‖b‖ shows F ≥ ‖b‖. So a large-sieve bound for 𝔅 is at best the Cauchy–Schwarz bound
    ‖ρ^♮‖·‖b‖ [PROVED, elementary; this is the extremal vector of subtract note §6].
* **Using the arithmetic of ρ^♮ beyond its norm** means expanding ρ^♮ (a residue of a Gauss-sum series) and B^J (a
  series over completed indices A = cn³) and executing the m-sum.
  * The m-sum of conj(χ_s(m))χ_A(m)e(·) is evaluated by Poisson summation modulo sb*A. That is (7.1) of the
    manuscript, i.e. the high side, and its principal row u = 1 carries 1/L^S_F(s, ϑ) (manuscript §7.2, §10.7).
* **Status:** [PROVED] for the extremal statement. **[REF-CORR]** The identification "using the arithmetic of ρ^♮
  means Poisson in m, i.e. the high side" is an informal claim, not stated in any source: [HEURISTIC], not [CITED].

### 7.3 Kazhdan–Patterson

[CITED, literature note §2.3: KP84 Thm I.3.5, Cor I.3.6; Gao–Shahidi–Szpruch arXiv:2102.08859 §4.3.2, Thm 4.9.]

* **What it gives.** For GL₂^{(6)} the local theta representation has a Whittaker space of dimension > 1: 15 or 5 for
  the GL₂ cover, constituents of dimension 2 and 1 for SL₂^{(6)}. Consequences:
  * no Euler product for ρ^♮ at squarefree indices. For n = 3, uniqueness gives Patterson's τ₃(d) = g₃(1, d)/N(d)^{1/2};
  * the Hecke relations at p ∤ 6y link the exponents 0 ↔ 4 and 1 ↔ 3 only. The coupling pattern of Lemma A.0 is the
    series-level form of this;
  * two free local coefficients per prime, τ(π) and τ(π²).
* **What it cannot give:**
  * an evaluation of ρ^♮ at composite squarefree indices;
  * and even an evaluation would only evaluate the probe (Theorem D(i)). It would move θ only together with a
    zero-free argument.

### 7.4 Weyl group multiple Dirichlet series; Chinta–Friedberg–Hoffstein Rankin–Selberg

* **The relevant series.** For a fixed completed index A, the row-Dirichlet series of the theta–row pairing is
  Σ_m ρ^♮_σ(−e₀m)χ_A(m)N(m)^{−w} = (3/2)Res_{u=2/3}Z_A(u, w), with
  Z_A(u, w) := Σ_mΣ_{s∈σ} g̃(−e₀m, s)χ_A(m)N(s)^{−u}N(m)^{−w}.
  This is a double Dirichlet series of A₂ type (Kubota functional equation in u, Hecke functional equation in w),
  twisted by χ_A. The block is a smoothed sum over A of these, with target-dependent coefficients.
  * WMDS theory continues such series by the group generated by the two functional equations and convexity.
  * The full triple series over (s, A, m), with the target in the coefficients of A, is not in the literature and its
    continuation is not attempted here [UNPROVED].
* **What it cannot give.**
  * By Theorem D(i) and Prop E(c) [SKETCH], the Mellin transform of the aggregated block has poles at the zeros of
    L^S_F(s, ϑ) in the window.
  * So a continuation of the multiple Dirichlet series that shows the block small would continue 1/L^S_F(s, ϑ) across
    those points, which is the zero-free statement.
  * The functional-equation group is target-blind and cannot exclude the poles.
* **The CFH Rankin–Selberg identity** (θ₆ against θ₂; conjectural over number fields, proved over F_q(T)) sees only
  square indices.
  * The even part carries 14.3% of M at Q = 796 and falls like Q^{−0.44} [NUMERICAL, conjecture note §4.2, on ρ^{str}].
  * By "only power savings count" (conjecture note §2.5, [PROVED]) a part with a fixed or decreasing share cannot
    change the exponent.

### 7.5 Dunn–Radziwiłł

[CITED, literature note §2.2.]

* **What they prove.** Under GRH, Patterson's asymptotic Σ_{N(p)≤X}g̃₃(p) ∼ cX^{5/6}/log X. They use an explicit
  Voronoi formula for cubic Gauss sums and explicit cusp expansions of θ₃; both are unconditional.
* **Already used.** The unconditional parts are inside the manuscript (Prop 5.1, hence Lemma 15.1).
* **What the method needs here.** The GRH-conditional step turns smooth Gauss-sum asymptotics into Möbius-weighted
  (prime) asymptotics. In TRO6 the corresponding input is a power saving for target-twisted Möbius sums, i.e. by
  Theorem D the improved zero-free region itself. So the method reduces TRO6 to GRH-type input and stops there
  [HEURISTIC description of the method's structure].

### 7.6 A 6-fold Patterson identity

* **Not expected:** by Kazhdan–Patterson (7.3).
* **Not observed numerically:** computation note §6.1 finds no Gauss-sum law at prime indices (alignment 0.50 against a
  99% null of 0.37) [NUMERICAL, on ρ^{str}]. By §3.9 the prime-row correction to ρ^♮ is
  N(π)^{−5/6}γ₂(π)ρ^{str}_{σπ^{−2}}(π³), of relative size ≈ N(π)^{−1} by the measured exponent-3 law (computation note
  §6.1). That is 14% at N = 7, 8% at N = 13 and below 2% for N ≥ 61. A correction of this size at the few smallest of
  the 77 primes tested cannot turn an alignment of 0.50 into a law.
* **Would not suffice:** by Theorem D(i), any formula for the block evaluates the probe [PROVED-rel].

---

## 8. Precise obstruction

> With Theorem A, the low side of the 7/8 architecture contains no unproved step between the probe and the sextic theta
> coefficients:
>
>   I_{ϑ,modified}(Z) = Θ_ϑ(Z) + O(Z^{17/96+ε})   (Theorem D(i)),
>
> where Θ_ϑ is the aggregated correlation of the complete sextic theta coefficients ρ^♮_σ(−e₀m) with the target's
> completed cubic rows B^J. The P_a^{1/6} loss of Prop 15.2 is the Cauchy–Schwarz bound for this form:
> Σ|A^θ|² = (4/9)|Ŵ₁(1/6+iv)|²Y′^{−2/3}M^♮_σ ≪ (Q/Y′)P_a^{1/6}Z^ε (Cor A.7), with equality of order given subtract-note
> Prop 2.3 [S].
>
> 1. **What removing it is.** Removing a power Z^{−ηb/12} of the loss is the aggregated TRO6^♮(η), and that is the
>    improved low bound for the probe (Theorem D(ii)). No high-side input enters this equivalence.
> 2. **What that is.** For η < 96·m_hi = 0.0219, i.e. in the window 7/8 − m_hi < 7/8 − η/96, the improved low bound is,
>    given (H_{σ₀}), the zero-free half-plane Re s > 7/8 − η/96 for all Hecke L-functions over Q(√−3), hence for all
>    Dirichlet L-functions and ζ (Theorem D(iii); the converse direction is SKETCH).
> 3. **Why the named tools cannot supply it.**
>    * Kubota / Eckhardt–Patterson functional equations, Kazhdan–Patterson local theory, mean values, CFH-type
>      identities and conjectural evaluations all give statements about ρ^♮ alone, and none of these depends on ϑ.
>    * The large sieve gives bounds uniform in the coefficient vector, which cannot beat Cauchy–Schwarz (§7.2).
>    * Information on the target's zeros enters the probe only through the m-Poisson (high) side, and there it is the
>      principal signal f_{II,ϑ}.
>    * **[REF-CORR]** Given (H_{σ₀}) (unproved below 7/8), a proof of TRO6^♮(η) for η < 0.0219 is equivalent to new
>      zero-free input for the family (D(iii); converse SKETCH). Without (H_{σ₀}) the proved content is only D(ii):
>      TRO6^♮ is the improved low bound. "None of the named tools can supply it" is an assessment, not a theorem.
> 4. **What would be needed instead.** Either new zero information (a quasi-Riemann improvement for ζ in its own
>    right), or a different probe in which the exceptional coset and the principal signal separate. Inside the
>    sextic-character family they do not separate (subtract-note Theorem 4.1). The zero-free campaign examined cubic,
>    quartic, GL(2) and other non-residue probes and found none that works (synthesis §2.2).
>
> All statements obstruct a sufficient estimate within this architecture, not the half-plane itself.

**Recommendation.**
* Treat the Prop 15.2 evaluation / subtraction / filter lever as closed.
* Theorem A removes the last unproved hypotheses on the low side. What remains is exactly the target theorem.
* State TRO6 with the complete coefficient ρ^♮ (§3.9) wherever it is quoted.

---

## 9. Status of each claim

| claim | status |
|---|---|
| TRO6(η) / TRO6^♮(η) for some η > 0 | **not proved**; [CONJECTURE] |
| (MV) mean value of the complete class-σ Kubota series on Re u = 1/2+ε over the rows −e₀m | PROVED-rel (K1)–(K3), (LS) |
| (Id) theta identification, Σ\|A − A^θ\|² ≪ (Q/Y′)Z^ε, no P_a²/Y′ term | PROVED-rel (MV) |
| (MS) M^♮_σ(Q) ≪ Q^{5/6+ε} | PROVED-rel (Id) + manuscript Lemma 6.2 |
| (A.8) Prop 15.2 without the P_a²/Y′ term, all Q, Y′ ≥ 1 | PROVED-rel (Id), (MS) |
| M^♮_σ(Q) ≫ Q^{5/6} | SKETCH, relative to subtract-note Prop 2.3 [S]; **[REF-CORR]** referee 1: understated, holder Prop 2 / restrict Thm C give it PROVED-rel at main-term level |
| Lemma A.1 (Gauss sums at moduli meeting the row; decomposition (A.2)) | PROVED; EXACT check (84 + 16 + 16 cases, 0 failures) |
| Lemma A.2 (large sieve, arbitrary rows) | PROVED-rel manuscript Lemma 9.1 |
| Lemma A.3 (large sieve, complete Gauss-sum coefficients) | PROVED-rel A.1, A.2 |
| Lemma A.0 (moduli prime to the full excluded set: finite inversion) | PROVED |
| Lemma A.4 (approximate functional equation) | PROVED-rel BH16 Thm 2.4, (3.1), (3.10), exponential decay |
| T_ij(r, s) is a Laurent polynomial in 3^{−s}, 4^{−s} | DERIVED from BH16 (3.10); agrees with BH16 §4.5 |
| matching of BH16 and manuscript conventions | DERIVED, routine, not written out in full |
| (3.9) and Lemma A.0: ρ^♮ (manuscript's S, gcd moduli kept) = explicit finite combination of stripped 6-coprime residues | PROVED |
| size of the difference: gcd part ≈ 0.4–0.8% of M (moduli prime to 6; corrected exponent comparison 3 vs 1) | HEURISTIC [REF-CORR] |
| S′ part "of order one" | **WITHDRAWN** [REF-CORR]; relative size N(p)^{−2/3}\|ρ(yp⁴)/ρ(y)\|, measured ratio ≈ 0.07 at the S-unit base; not established |
| (Id) fails for the conjecture note's ρ_σ | HEURISTIC, not established [REF-CORR]; (Id) is PROVED-rel for ρ^♮ only |
| ρ^♮ (all moduli prime to S, incl. nonsquarefree) is the coefficient the rows see | PROVED-rel manuscript §6.1 (confirmed by referee 2) |
| ρ_σ ↔ ρ^♮ coefficients "bounded", (3.9) "triangular" | **WITHDRAWN** [REF-CORR]; mass ≪ N(y)^ε, exponents 1, 3 couple both ways |
| Bröker–Hoffstein Algorithm 4.1 computes the complete coefficient | **WITHDRAWN** [REF-CORR]; printed loop uses squarefree moduli coprime to r |
| §7.2 "arithmetic of ρ^♮ = Poisson in m = high side" | HEURISTIC [REF-CORR] (was labelled CITED) |
| Lemma B (only d < ηb/12, i.e. \|J\| < ηK/16, needs TRO6) | PROVED-rel Prop 15.3, (15.8) |
| whether the manuscript's K is < 731 (then only J = ∅) | UNPROVED (K is not explicit) |
| Theorem C (TRO6^♮ alone ⟹ low bound l_x/2 + (1−η)b/12) | PROVED-rel Theorem A, Lemma 15.1, Lemma B |
| Theorem C, zero-free clause | PROVED-rel Prop 2.1 + (H_{σ₀}); (H_{σ₀}) UNPROVED below 7/8 |
| Theorem D(i), (ii) (probe = theta–row form; TRO6 ⟺ improved low bound) | PROVED-rel Theorem A, Lemma 15.1, (15.8) |
| Theorem D(iii)(a) (TRO6 ⟹ zero-free) | PROVED-rel Prop 2.1 + (H_{σ₀}) |
| Theorem D(iii)(b) (zero-free ⟹ TRO6) | SKETCH (= conjecture note Prop E(b)) |
| large-sieve bounds cannot beat Cauchy–Schwarz (extremal vector) | PROVED |
| Kazhdan–Patterson non-uniqueness for GL₂^{(6)} | CITED |
| WMDS route: the block's Mellin transform has poles at the target's zeros | SKETCH (via Prop E(c)); the triple series is UNPROVED territory |
| Dunn–Radziwiłł: the method needs GRH-type input here | CITED + HEURISTIC description |
| any θ < 7/8, any Λ bound | **none** |

Unproved inputs used anywhere in this note: (H_{σ₀}) below 7/8, the Eckhardt–Patterson theory behind BH16 Thm 2.4 and
(3.1) (cited, not read), the routine convention matching of §3.2, Prop E(b),(c) of the conjecture note (SKETCH), and
the 7/8 manuscript itself (Lean-checked by its authors, unrefereed). **[REF-CORR]** Also: Lemma A.0 needs the ray group
T to have 2-adic level ≤ 4 and exponent 6; the manuscript leaves T open; this holds for the mod-12 and mod-36 ray groups
(referee 1, not checked for other choices). The inputs of Theorem A also include manuscript Lemma 4.4 (reciprocity
R(c₂, c₁)), used in A.1(f) and A.0(b).

PT Λ ≤ 0.2 stands. RH is open. NO QED.

---

## 10. Reproduction

| file | content | runtime |
|---|---|---|
| `tmp/sextic/proof_checks.py` → `proof_checks.log`, `proof_checks.json` | Lemma A.1(a)–(d) on 84 prime-power cases; (A.2) and twisted multiplicativity on 16 cases each; direct summation over complete residue systems of O/c | 2 s |

Run from `tmp/sextic/` with `../../.venv-arb/bin/python proof_checks.py`. It imports `zomega.py` (same directory). All
other statements of this note are proofs or citations; no other computation was needed.

---

## 11. Referee reconciliation (2026-11-03)

Two independent adversarial referee passes. Both: **refuted = false**. Severity: referee 1 "low", referee 2 "minor".
Neither found a mathematical error in a step labelled PROVED or PROVED-rel. The corrections below are applied in place
above (marked [REF-CORR]). The relayed text of referee 2's problem list was truncated after its first item; only the
items that reached this note are reconciled.

**Independent checks (both from scratch, without `zomega.py`), 0 failures in all.**
* Referee 1 (`/tmp/sextic-referee1/check.py`, `check.log`): A.1(a)–(d) exact values 1240 cases (inert primes of norm
  25, 121; j ≤ 7); A.1(e) 49; (A.2) 76 incl. patterns (c), (d); A.0(b) termwise identity 265, vanishing 1325;
  R(c′, p) depends only on c′ mod 4 (367 primes × 4 values of p); g̃(π, π²) = N^{1/2}γ₂(π); (O/4)^× has exponent 6.
  The note's `proof_checks.py` reproduces 84 + 16 + 16 cases.
* Referee 2 (`/tmp/sextic-ref2/check_lemmas.py`, `check_e0.py`): Lemma 4.2 orientation 24; reciprocity table 528
  pairs; A.1(a)–(d) 128; (A.2) incl. (c), (d) 18; A.0(b) identity and |a_b| 172; subtract-note Lemma 2.2 also for
  nonsquarefree columns, 20000 cases.
* Both re-derived the constants: m_hi = 2.28147·10⁻⁴, η* = 0.021902, 16/η* = 730.5, K > 61.67,
  l_x/2 + (1−η)b/12 = 3/16 − η/96, l_y − ℓ − 11b/6 = 1/12 (equality at d = ℓ), Σ N^{−8/3} = 0.01486, 7^{−2/3} = 0.273.
* Referee 2 checked against the manuscript text that A_m sums over all primary s prime to S including nonsquarefree s
  (§6.1, proof of Lemma 6.2). So ρ^♮ is the right coefficient; that part of the correction to the conjecture note
  **stands**.

**Survives both referees.** Theorem A ((MV), (Id) for ρ^♮, (MS) M^♮ ≪ Q^{5/6+ε}, (A.8) Prop 15.2 without its P_a²/Y′
term), relative to BH16 Thm 2.4, (3.1), (3.10) and manuscript Lemmas 4.4, 6.2, 9.1. Lemmas A.0–A.4. Identity (3.9).
Lemma B. Theorem C (zero-free clause also needs (H_{σ₀})). Theorem D(i), (ii). D(iii)(a) relative to (H_{σ₀});
D(iii)(b) remains SKETCH. **None of this moves θ.**

**Killed or downgraded.**

| # | claim in the submitted note | referee | outcome |
|---|---|---|---|
| K1 | "(Id) fails for ρ_σ" stated as a conclusion (§0 item 2, §3.9) | 1 | downgraded to HEURISTIC; rests on heuristic sizes and on M^♮ ≫ Q^{5/6} (SKETCH) |
| K2 | §3.9(a) size from exponent 2 vs 0 (z² 22.0/139, share ≈ 0.3%) | 1, 2 | wrong exponents; correct is 3 vs 1 (z² 11.6/40.1 or 1.05·N^{−1/6}); share ≈ 0.4–0.8% (HEURISTIC) |
| K3 | §3.9(b) S′ correction "of order one" | 1 | withdrawn; relative size N(p)^{−2/3}\|ρ(yp⁴)/ρ(y)\|, measured ≈ 0.07 at the S-unit base |
| K4 | ρ_σ ↔ ρ^♮ "bounded" linear combinations; (3.9) "triangular" | 1 | withdrawn; mass Π_{p\|y}(1 + O(N(p)^{−5/6})) ≪ N(y)^ε; exponents 1, 3 couple both ways |
| K5 | §7.2 "arithmetic of ρ^♮ = Poisson in m = high side" labelled CITED | 1 | relabelled HEURISTIC (no source states it) |
| K6 | "none of the named tools can supply TRO6" | 1 | an assessment, not a theorem |
| K7 | "TRO6 requires new zero-free input" without its condition | 1 | needs (H_{σ₀}), unproved below 7/8; without it the content is D(ii) only |
| K8 | BH16 Algorithm 4.1 "computes the complete coefficient" | 1 | over-read; printed loop uses squarefree moduli coprime to r |
| K9 | M^♮ ≫ Q^{5/6} only SKETCH | 1 | understated: holder Prop 2 / restrict Thm C give it PROVED-rel at main-term level |
| K10 | inputs of Theorem A | 1 | add manuscript Lemma 4.4; Lemma A.0 needs ray group of 2-adic level ≤ 4 and exponent 6 (true for mod 12, mod 36; manuscript leaves T open) |
| K11 | summary statement of TRO6^♮ | 1 | the (1+\|v\|)^{J₀} factor (present in §2) was dropped in the summary |

Not checked by either referee: Eckhardt–Patterson §5 itself (cited via BH16), and the full convention matching.

**Effect on θ and Λ.** No rigorous improvement survived; the referees did not upgrade anything. θ = 7/8 (itself from
the unrefereed manuscript). The conditional values in `sextic-theta-synthesis.md` §4 (Raymond chain at PT height with
q0 = (2θ − 1)² + 2·10⁻⁶) are conditional on TRO6^♮(η), (H_{σ₀}) and the 7/8 manuscript; they are not bounds.
PT Λ ≤ 0.2 stands. RH is open. NO QED.
