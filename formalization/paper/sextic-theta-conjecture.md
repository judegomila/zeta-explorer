# The P_a^{1/6} term of 7/8 Prop 15.2: the sharpest testable statement, what it is equivalent to, and what it would give

Internal working note, 2026-11-03. Branch `editorial-redesign`. Nothing committed, nothing pushed, nothing sent off the
machine. Not refereed. Scripts and logs: `tmp/sextic/conj_*` (§8).

Read for this note: `zf-campaign-synthesis.md`, `zf-campaign-new-probe.md` (§7, §11), `cubic-r2-conductor-verdict.md` and
both `cubic-r2-conductor-derivation-*.md`, `beat78-synthesis.md`, `beat78-prop152-{subtract,holder,restrict}.md`,
`qrh-improvement-attempt-a.md` (§3–§5), the two sibling notes of this workflow `sextic-theta-computation.md` and
`sextic-theta-literature.md`, the data modules `src/data/zero-free-campaign-2026-11-01.js`,
`src/data/beat78-prop152-2026-10-09.js`, `src/data/qrh-theta-and-improvement-2026-10-08.js`, the 7/8 manuscript
`~/lean-deps/qrh-verify/paper.txt` (§2 Prop 2.1; §4.2 with (4.7) and the restored bar; §6.1 (6.1)–(6.2); §10 Def 10.1,
Lemma 10.4; §12 (12.1)–(12.5); §15 Lemma 15.1, Prop 15.2, Prop 15.3, (15.8)–(15.9); §18 Lemma 18.1; §19.2 (19.2), (19.6);
§20 (20.4)–(20.11), Lemma 20.2), the 11/12 manuscript `paper2.txt` (§2.3–2.4, (2.10)), and atlas §10
(`git show refs/pr/27:research/rh/modules/historical-routes.md`).

Labels:
* **[PROVED]** complete argument in this note; **[PROVED-rel]** proved relative to lemmas of the 7/8 manuscript or of the
  campaign notes, taken as stated (named in each case); **[SKETCH]** the argument is given at the level of detail of the
  manuscript's own Part II, error terms not written to the last ε;
* **[EXACT]** exact rational / closed-form / exact-symbol computation; **[NUMERICAL]** floating-point measurement with the
  stated error model; **[CITED]** read in a source; **[HEURISTIC]** exponent model or unproved identification;
* **[CONJECTURE]** a precisely stated open statement.

---

## 0. Outcome

**No theorem, no θ < 7/8.** The best abscissa is still 7/8 (openai/math family-003 manuscript, Lean-checked by its authors,
unrefereed). PR #14's 0.87488665 is still conditional. No Raymond-chain Λ was computed. PT Λ ≤ 0.2 stands, RH is open,
NO QED.

1. **The statement (§2).** The sharpest statement about sextic theta coefficients that removes or reduces the P_a^{1/6}
   loss is a correlation bound, Conjecture **TRO6(η)**: along the indices −e₀m (m ∈ O) that Lemma 2.2 of the subtract note
   selects, the class-σ sextic theta coefficients ρ_σ(−e₀m) must be decorrelated from the manuscript's completed cubic rows B^J_{m,σ}(Z) by a factor Z^{−ηb/12} beyond
   Cauchy–Schwarz. It is a "bound for the needed mean" in the sense of the task: the mean is the bilinear mean
   Σ_m ρ_σ(−e₀m)B_m, not a mean square. At the paper geometry, η* = 0.0219 (a saving of Z^{−2.28·10⁻⁴}) already buys the
   whole fixed-geometry prize; any larger η is worth something only after Part II is re-proved at a new geometry.
2. **What it is (§3, Proposition E).** In the window where the manuscript's high side is under control, the aggregated
   form of TRO6 is *equivalent* to the zero-free half-plane it would prove, and an *evaluation* of the exceptional block is
   equivalent to locating the zeros of the target L-functions in that window [(a) PROVED-rel, it is the subtract note's
   Cor 3.4; (b), (c) SKETCH]. So the campaign's "can be evaluated but not filtered" should read: evaluating the block is
   the same as locating the zeros. No identity, evaluation or mean of sextic theta coefficients reduces the loss by
   itself. Mean values cannot (extremal vector, subtract note §6). A 6-fold Patterson identity would make the block
   explicit but would not move θ unless it came with a new zero-free argument. The cubic precedent is not a counterexample:
   Patterson's identity enters the 7/8 proof through a *mean square* on the B side (Lemma 15.1), and the A-side mean square
   (Prop 15.2) is already attained.
3. **Numerical evidence (§4).** Exact symbols over Z[ω], moduli of norm ≤ 10⁷, rows N(m) ≤ 796 (2904 rows, extending the
   computation note's N(m) ≤ 300):
   * the needed mean square is dense: M(Q) ∝ Q^{0.868}, bootstrap 95% [0.834, 0.899], against 5/6 = 0.833 (0.894 at
     Q ≤ 300). The loss is a genuine dense term.
   * the odd part (good part of m not a square) carries 85.7% of M(796), and its share rises. The even part, where the CFH
     conjecture would evaluate the coefficients, carries 14.3%, falling like Q^{−0.44} (predicted Q^{−1/2}).
   * toy TRO with α-twisted cubic rows (the manuscript's twist): at the noise level. Over the 216 tests on rows outside the
     Kummer coset, the largest normalised correlation is 0.043 against a 99% look-elsewhere null of 0.060 (p = 0.73). The
     detection threshold is an aligned fraction of about 8% of ‖B‖. Without the α twist the rows couple to the theta
     coefficients only through Patterson's cubic-theta main term on the S-unit rows (|B|² ∝ R^{0.65} there), and the α
     twist removes this coupling.
   * unchanged from the computation note: no Gauss-sum law at prime indices (alignment 0.50, 99% null 0.37), no twisted
     multiplicativity at products (≤ 4%).
4. **θ it would give (§5).**
   * Fixed geometry: σ₀ = 7/8 − η/96, capped by the binding row bin of Lemma 20.2 at 7/8 − 2.2815·10⁻⁴ = **0.8747719**
     [EXACT, with Lemma 18.1 as stated]. Extending Lemma 18.1 below κ = 3/4 gives 0.8747704. The certified margin
     49/440640 gives 0.8748888.
   * The "≈ 2.9·10⁻⁴" cap quoted in the synthesis and in the data modules takes (20.10)'s worst-case capacity term Δ/4 as
     an exact gain for Δ < 0. At the binding bin the actual capacity gain is 0.006|Δ|, so the cap is 2.28–2.30·10⁻⁴.
   * Re-optimised geometry [HEURISTIC model, paper row counts, Part II not re-proved]: η = 0.0219 → 0.874766,
     0.05 → 0.874485, 0.1 → 0.873944, 0.25 → 0.872320, 0.5 → 0.869617, 1 → 0.864094.
   * Λ prices at 0.003 per 0.01 of θ: about 7·10⁻⁵ at fixed geometry, 3.2·10⁻⁴ at η = 0.1, 3.3·10⁻³ at η = 1. These are
     prices, not bounds (atlas §12).
5. **What is plausibly provable (§6).**
   * The zero-independent parts are plausibly provable with standard methods:
     * the row mean-square asymptotic M_σ(Q) ≍ Q^{5/6} (Rankin–Selberg for the L² residual form θ₆);
     * the identification of Prop 15.2's exceptional term with ‖A^θ‖² (a contour shift past the Kubota pole plus a mean
       value of the continued Kubota series);
     * the exact symmetries used below.
   * None of these moves θ.
   * TRO6 itself is, in the window, the improved zero-free region. It is provable only by an argument that also proves
     that region, and the sextic theta coefficients do not make that argument easier.

---

## 1. Setting

Paper geometry (12.4): b = 1/8, h = 13/16, ℓ = 1/6, l_x = 17/48, l_y = 23/48, M = l_x + l_y = 5/6, M + ℓ = 1;
C(s) = s + l_x/2 − 1 + h/6 = s − 11/16, C(7/8) = 3/16 = l_x/2 + b/12. For a rescaled tuple J (slot length d ≤ ℓ):
X′ = X/q_{p_J}, Y′ = Y/q_{p_J}, Q = q_{b*}X′Y′ ≍ Z^{M′}, M′ = M − 2d, P_a = Y′²/Q = q_{b*}^{−1}Z^b.

**The low separation (6.2) [CITED].**

  I_J = (Q^{−1/2}/2π) ∫ Ŵ₀(iv) Σ_{m≠0} Ω(q_m/Q) ξ(m) (q_m/Q)^{−iv} A_{m,σ,v}(Y′) B^J_{m,σ}(Z) dv,

with A_{m,σ,v}(Y′) = Y′^{−3/2}Σ_s c_σ(s)W₁(r_s)r_s^{−1+iv}g_{χ_s}(s, −m), c_σ(s) = 1_{s∈σ}χ_s(b*)/(τξ(s)), and B^J the marked
completed row of §15.1: a Mellin integral of T(t + 1/2, ν_σθχ_•(m)) = Σ_{c sf, n} γ₂(c)α(cn³)ν_σθ(cn³)χ_{cn³}(m)q_c^{−1/2−t}q_n^{−1−3t}.
So the row m enters B only through A ↦ χ_A(m) = (m/A)₆, and the target η only through ν_σ = ηΞ^{−1}R(·, s_σ).

**The three inputs and the loss [CITED / PROVED-rel].**
* Prop 15.2: Σ_{q_m≪Q}|A_m|² ≪ (Q/Y′)(1 + P_a^{1/6} + P_a²/Y′)Z^ε.
* Lemma 15.1: Σ|B^J_m|² ≪ Z^{M′+ε}.
* Cauchy–Schwarz (Prop 15.3) gives (X′)^{1/2}P_a^{1/12} per tuple and l_x/2 + b/12 after (15.8). By (15.9),
  σ_low = 1 − h/6 + b/12 = 5/6 + (M − 2ℓ)/12, where b cancels.

The P_a^{1/6} term is a main term:
* Prop 2.3 of the subtract note [S] and Proposition 2 of the holder note [PROVED-MT] give
  Σ|A_m|² = (Q/Y′)[𝔡 + 𝔈P_a^{1/6}](1 + o(1)) with 𝔈 > 0.
* On σ × σ the Gram coefficient at the exceptional frequencies ±e₀a⁶ is identically 1 (subtract Lemma 2.2(ii)).

**The coset and the theta coefficients [PROVED-rel; HEURISTIC identification].** By subtract Lemma 2.2,
A_{m,σ,v} = (κ_σ/τ)Ã_{σ,v}(e₀m) for an S-unit e₀; for S = {2, λ}, e₀ = u₀(−2)^{2t−1}λ⁵. Write g̃₁(y, s) =
conj(χ_s(y))γ₁(s) for (y, s) = 1 and define the **class-σ sextic theta coefficient** ρ_σ(y) by

  Σ_{s∈σ, s sf, (s,6y)=1, N(s)≤X} g̃₁(y, s) = ρ_σ(y)X^{2/3} + o(X^{2/3})

(first-moment normalisation; by partial summation (2/3)ρ_σ(y) is the residue at u = 2/3 of the stripped class-σ Kubota
series Σ_{s∈σ} g̃₁(y, s)N(s)^{−u}). If the theta
part of Ã is its residue at the Kubota pole (subtract §5.1, [HEURISTIC]), then

  A^θ_m = (2κ_σ/3τ)·Ŵ₁(1/6 + iv)·Y′^{−1/3}·ρ_σ(−e₀m),

and Σ_{q_m≤Q}|A^θ_m|² ≍ Y′^{−2/3}M_σ(Q) with M_σ(Q) := Σ_{0<N(m)≤Q}|ρ_σ(−e₀m)|². This equals the exceptional term
(Q/Y′)P_a^{1/6} = Y′^{−2/3}Q^{5/6} exactly when M_σ(Q) ≍ Q^{5/6} (computation note §1.2).

---

## 2. The statement

### 2.1 Conjecture TRO6(η)

For a rescaled tuple J (slot length d ≤ ℓ), a class σ ∈ T and a height v, define the **theta–row form**

  𝔅^J_{σ,v}(Z) := Σ_{m≠0} Ω(q_m/Q) ξ(m) (q_m/Q)^{−iv} ρ_σ(−e₀m) B^J_{m,σ}(Z).

Cauchy–Schwarz and Lemma 15.1 give |𝔅| ≤ M_σ(cQ)^{1/2}‖B^J‖_Q ≪ Q^{5/12}Z^{M′/2+ε}, with ‖B^J‖_Q² := Σ_{q_m≪Q}|B^J_{m,σ}(Z)|².

> **Conjecture TRO6(η) [CONJECTURE].** There is η > 0 such that for every ε > 0, uniformly in J, σ and v,
>
>   |𝔅^J_{σ,v}(Z)| ≪_ε (1 + |v|)^{J₀} · Z^{−ηb/12 + ε} · M_σ(cQ)^{1/2} · ‖B^J‖_Q.

Equivalently, the saving over Cauchy–Schwarz is P_a^{−η/12} = q_{b*}^{η/12}Z^{−ηb/12}. In words: along the indices
−e₀m, the sextic theta coefficients have correlation at most Z^{−ηb/12} with the completed cubic rows of the target.

### 2.2 Sufficiency [PROVED-rel]

Assume, besides TRO6(η):
* **(Id)** the theta identification: A^R := A − A^θ satisfies Σ_{q_m≪Q}|A^R_m|² ≪ (1+|v|)^J(Q/Y′)(1 + P_a²/Y′)Z^ε, i.e.
  the remainder has no exceptional term (subtract note §5.1, [HEURISTIC] there);
* **(MS)** M_σ(Q) ≪ Q^{5/6+ε}.

Then TRO(η) of the subtract note holds, and the low exponent is l_x/2 + (1 − η)b/12, i.e. σ_low = 1 − h/6 + (1 − η)b/12
(at the paper geometry 7/8 − η/96).

*Proof.*
1. Split I_J = I^θ_J + I^R_J along A = A^θ + A^R.
2. The remainder: Cauchy–Schwarz, (Id) and Lemma 15.1 give I^R_J ≪ (X′)^{1/2}(1 + P_a²/Y′)^{1/2}Z^ε (subtract Lemma 3.2).
   * At the paper geometry l_y − d − 2b ≥ l_y − ℓ − 2b = 1/16 > 0, so P_a²/Y′ ≪ 1 and I^R_J ≪ (X′)^{1/2}Z^ε.
   * On other geometries the weaker condition l_y − d − (2 − th)b ≥ 0, with th = (1 − η)/6, keeps I^R_J below the theta
     part (§5.1, B4).
3. The theta part: I^θ_J = Q^{−1/2}(2κ_σ/3τ)∫Ŵ₀(iv)Ŵ₁(1/6 + iv)Y′^{−1/3}𝔅^J_{σ,v} dv/2π.
   * TRO6(η), (MS) and Lemma 15.1 bound it by Q^{−1/2}·Y′^{−1/3}·Z^{−ηb/12+ε}·Q^{5/12}·Z^{M′/2}.
   * Since Q = q_{b*}Z^{M′}/r_J², Z^{M′/2} ≍ Q^{1/2}. Since X′ = Q/(q_{b*}Y′), Q^{5/12}Y′^{−1/3} ≍ (X′)^{1/2}P_a^{1/12}.
   * So I^θ_J ≪ (X′)^{1/2}P_a^{1/12}Z^{−ηb/12+ε}: the bound of Prop 15.3 times Z^{−ηb/12}.
   * The v-integral converges because Ŵ₀(iv) decays faster than any power.
4. The tuple sum (15.8) is unchanged (f(d) = −d), which gives l_x/2 + b/12 − ηb/12. Then (15.9) converts this to
   σ_low. ∎

### 2.3 How much is needed

* At the paper geometry the high side caps any low-side gain at m_hi = 2.2815·10⁻⁴ (§5.2). So **TRO6(η*) with
  η* = 96·m_hi = 0.0219** already gives the whole fixed-geometry prize, σ₀ = 0.8747719.
* η* corresponds to a saving of Z^{−2.28·10⁻⁴} in 𝔅, i.e. P_a^{−0.00183}.
* Larger η is worth something only on a re-optimised geometry with Part II re-proved (§5.3).

### 2.4 In what sense it is testable

1. **Finite-scale proxy.** The normalised correlation r_σ(Q; B) := |𝔅|/(M_σ(Q)^{1/2}‖B‖_Q) can be computed from measured
   theta coefficients and explicit rows. TRO6 predicts r ≪ Z^{−ηb/12}. In a world with no zeros near 7/8 one expects r of
   the order (#rows)^{−1/2}. The toy test of §4.3 finds this, but it cannot measure an exponent.
2. **Exact form.** By Proposition E (§3), in the window σ₀ ∈ (7/8 − m_hi, 7/8] the aggregated form of TRO6 is equivalent to
   the zero-free half-plane Re s > σ₀ for the family. A counterexample would be a zero of some Hecke L-function of Q(ω) (or
   of ζ) with real part in (σ₀, 7/8], i.e. a GRH violation. None is known. No finite computation settles it.

### 2.5 The other candidate statements, and their status

The table lists every identity / evaluation / mean-type statement about the sextic theta coefficients considered in the
campaign, what it would give, and its status.

| candidate | what it would give | status |
|---|---|---|
| (C1) 6-fold Patterson identity: ρ_σ at squarefree index = explicit Gauss-sum expression × local factor | an explicit A^θ; by Prop E no gain by itself | **false at prime indices** [NUMERICAL: best phase alignment 0.50 over 232 local candidates, 99% look-elsewhere null 0.37, computation note §6.1]; **no twisted multiplicativity** at products (≤ 4%, §6.3 there); not expected in the literature (KP84 non-uniqueness, 15 or 5 Whittaker dimensions for GL₂^{(6)}; Patterson 2014: odd-part values "irregular"; BH16 Conj 5.7 irregular even for τ(π)²) [CITED in the literature note] |
| (C2) a thinner needed mean: M_σ(Q) ≪ Q^{5/6−δ} | the exceptional term becomes (Q/Y′)P_a^{1/6}Q^{−δ}, i.e. exponent 1/6 − δM′/b | **false**: Prop 2.3 (subtract) [S] / holder Prop 2 give the lower bound ≫ (Q/Y′)P_a^{1/6}; measured slope 0.868 [0.834, 0.899] (§4.1) |
| (C3) support on the rows whose index −e₀m lies in e₀·(S-units)·(sixth powers) (the n = 2 pattern) | M ≍ Q^{1/6}(log Q)², so ‖A^θ‖² ≍ (Q/Y′)P_a^{1/6}Q^{−2/3} falls below the diagonal (full removal) | **false** [NUMERICAL]: the coset rows carry 10.6% of M(796), and the share falls (§4.2) |
| (C4) the even part: CFH12 Conj 2.1, τ₆(m₁²m₂⁴) through cubic Gauss sums | evaluates the rows whose good part is a square | CONJ-lit (proved over F_q(T)) [CITED]; covers a **vanishing share**: 14.3% of M(796), ∝ Q^{−0.44} (§4.2) |
| (C5) a class law at prime indices (h(π mod 9)·N^{−κ}, four-character Fourier support) | evaluates a fixed fraction | [NUMERICAL]: 75% of held-out power, residual 2.4 × noise (computation note §6.2); a fixed fraction gives no power saving (remark below) |
| (C6) TRO6(η) | σ_low = 7/8 − η/96 at fixed geometry | **open**; in the window, equivalent to the zero-free region (Prop E) |

**Remark (only power savings count) [PROVED].** Suppose A^θ = A^θ_expl + A^θ_irr, where the explicit part is evaluated
exactly and the irregular part carries a fixed fraction φ > 0 of ‖A^θ‖². Cauchy–Schwarz on the irregular part still gives
φ^{1/2}·(X′)^{1/2}P_a^{1/12}, which has the same exponent. So (C4) and (C5) can change constants but not θ, unless the
irregular part is a power smaller. That is (C2) or (C3) again, both false.

---

## 3. Proposition E: the exceptional block is the signal

### 3.1 Statement

Let m_hi := min_{δ,x}(−E*) = 35√16354/12696 − 1491/4232 = 2.2815·10⁻⁴ be the margin of Lemma 20.2's binding row bin
(§5.2). Below 7/8 the manuscript's high side is not written down, so its availability is stated as a hypothesis.

**Hypothesis (H_{σ₀}).** Fix σ₀ ∈ (83/96, 7/8]. Then:
* the Part II high side (Lemma 10.4 with σ₀ in place of 7/8, Lemma 10.5, Sections 16, 19 and 20, with Lemma 18.1 applied
  at κ = 3/4) holds under β* > σ₀ and gives (2.5) of Prop 2.1;
* (10.2) holds on Re s > σ₀, so that H_η does not vanish there.

At σ₀ = 7/8 this is the manuscript. For 7/8 − m_hi < σ₀ < 7/8 the exponents allow it (§5.2), but the statements written
for σ₀ ≥ 7/8 must be re-checked: Lemma 10.4's range, the Euler region D₂, (16.13), Lemma 16.2. This is the kind of
re-check `qrh-improvement-attempt-a.md` §3 P4–P8 did for σ₀ = 34999/40000. It is not done here.

> **Proposition E.** Fix the manuscript's data and geometry and σ₀ ∈ (7/8 − m_hi, 7/8] with (H_{σ₀}). Let A = A^E + A^R
> be any decomposition of the additive rows (for every rescaled tuple, class and height) with
> Σ_{q_m≪Q}|A^R_m|² ≪ (1+|v|)^J(Q/Y′)(1 + P_a²/Y′)Z^ε. Let J^E_η(Z) be the normalised probe J_{II,η} with A replaced by
> A^E (the aggregated exceptional block).
>
> * **(a) [PROVED-rel]** If J^E_η(Z) ≪ Z^{C(σ₀)+ω} for every primitive η and every ω > 0, then β* ≤ σ₀: every Hecke
>   L-function of the family, and through Prop 11.3 every Dirichlet L-function and ζ, is zero-free in Re s > σ₀.
> * **(b) [SKETCH]** Conversely, if β* ≤ σ₀, then J^E_η(Z) ≪ Z^{C(σ₀)+ε} for every ε > 0.
> * **(c) [SKETCH]** Suppose J^E_η(Z) = F_η(Z) + O(Z^{C(σ₁)+ε}) with σ₁ ∈ (83/96, 7/8] and put
>   F̂_η(s) := ∫₁^∞ F_η(Z)Z^{−C(s)−1}dZ. Then F̂_η(s) − e^{(s−5/6)²}H_η(s)/L^S_F(s, η) continues holomorphically to
>   Re s > max(σ₁, 7/8 − m_hi). Hence the poles of F̂_η in that half-plane are exactly the zeros of L^S_F(s, η) there.

### 3.2 Proofs

**(a).**
1. Lemma 3.2 of the subtract note (S4 in the data module, referee grade "PROVED, tautological reduction"), summed over
   tuples with (15.8) and divided by c_S A_T(Z) (|A_T|^{−1} ≪ Z^ε by (20.1)), gives J_{II,η} = J^E_η + O(Z^{l_x/2+ε}).
2. Here l_x/2 = C(1 − h/6) = C(83/96) < C(σ₀). So |J_{II,η}| ≪ Z^{C(σ₀)+ω}, which is (2.4) of Prop 2.1.
3. (H_{σ₀}) supplies (2.5), and Prop 2.1 contradicts β* > σ₀. ∎

This is the subtract note's Cor 3.4. It is also the literature note's statement that a bound for 𝔅 "has the strength of
the improved low-side estimate itself".

**(b).**
1. Under β* ≤ σ₀ every retained bin has a ≤ σ₀ < 7/8, so κ_eff = 3/4. The row counts of Prop 19.2 are those of Lemma
   20.2, and every nonprincipal row exponent relative to C(7/8) is ≤ −m_hi + O(e + ϑ + ε).
2. The other ranges of §20.3–20.5 are more negative (§5.1, B4). So J_{II,η} = P_{II,η}/(c_S A_T) + O(Z^{C(7/8)−m_hi+ε}),
   where P_{II,η} is the principal row.
3. The principal row is f_{II,η} plus the remainders of Lemma 10.5. Shift (2.3) to Re s = σ₀ + ε. 1/L^S_F(s, η) is
   holomorphic there, and the Borel–Carathéodory lemma (applied with the convexity bound) gives 1/L^S_F(s, η) ≪ (2 + |t|)^{O(1)}
   on Re s ≥ σ₀ + ε, which the Gaussian e^{(s−5/6)²} absorbs. So f_{II,η} ≪ Z^{C(σ₀)+ε}.
4. With J^E_η = J_{II,η} + O(Z^{l_x/2+ε}) and C(7/8) − m_hi ≤ C(σ₀), the claim follows. ∎
   (Sketch: Part II is written under β* > 7/8; using it under β* ≤ σ₀ needs the same re-checks as (H_{σ₀}).)

**(c).**
1. By the manuscript's theorem (β* ≤ 7/8; unrefereed) and step 1 of (b) at σ₀ = 7/8:
   J^E_η = f_{II,η} + O(Z^{C(7/8)−m_hi+ε}) + O(Z^{C(83/96)+ε}).
2. So F_η − f_{II,η} ≪ Z^{C(max(σ₁, 7/8−m_hi))+ε}, and its transform is holomorphic on Re s > max(σ₁, 7/8 − m_hi) + ε.
3. The transform of f_{II,η} is e^{(s−5/6)²}H_η(s)/L^S_F(s, η) plus an entire function (the part Z < 1, as in the proof of
   Prop 2.1).
4. H_η ≠ 0 by (10.2) / (H_{σ₀}). ∎

### 3.3 Consequences

**E1 (theta form).** Grant (Id). Then A^θ is an admissible A^E. So the aggregated correlation of the sextic theta
coefficients ρ_σ(−e₀·) with the completed cubic rows of the target has, in the window, Mellin poles exactly at the target's
zeros. This makes precise the heuristic that θ₆ "pairs with" the η-twisted cubic data to give 1/L(s, η). The pairing
γ₁γ₂ = μαG of (4.7) is the algebra behind that heuristic; only (c) is claimed here.

**E2 (no evaluation lever) [PROVED-rel, given (c)].**
* Any exact formula for the block yields, by (c), the zeros of L(s, η) in Re s > max(σ₁, 7/8 − m_hi) as poles of its
  transform. This holds whatever the source of the formula: a 6-fold Patterson identity, a CFH-type identity, a Voronoi
  formula for θ₆, or a multiple Dirichlet series.
* Such a formula lowers θ only if it also shows those poles absent, and that is a zero-free statement.
* So the subtraction route (evaluate the block, subtract it, Cauchy–Schwarz the rest) reproduces the high side and
  nothing more.
* The campaign's sentence "the block can be evaluated but not filtered" (synthesis §2.1, new-probe §7.4) should be read
  this way: evaluating the block is the same as locating the zeros in the window.

**E3 (consistency with P14(d)).**
* P14(d) of the new-probe note is the heuristic that a residue filter multiplies the coherent block and the principal
  signal by the same constant A(e₀).
* Prop E(c) explains it for every modified probe whose remainder and nonprincipal bounds are unchanged: in the window the
  block *is* the principal term.
* Not checked for an arbitrary realisation of a filter.

**E4 (why the cubic precedent does not transfer).**
* In the 7/8 proof, Patterson's cubic evaluation (through Dunn–Radziwiłł's explicit cusp expansions, paper §5) enters
  Prop 5.1 and hence Lemma 15.1, a *mean-square* bound for the completed rows.
* A mean square carries no signal, and reflection really shortens it.
* On the A side the mean square (Prop 15.2) is already attained (Prop 2.3 / holder Prop 2). So a sextic identity could only
  be used inside the correlation, where E2 applies.
* The B-side analogue of a sextic identity, a better row mean square, is the cubic lever, closed at a = 4
  (`cubic-r2-conductor-verdict.md`).

**E5 (what a proof of TRO6 would have to contain).** It needs a second expression for the block whose Mellin poles are
known to avoid the window, i.e. information that sees the target's zeros. Inside this probe the only other expression is
the high side (Poisson in m), and that is where the signal comes from. So the lever needs a new probe or new zero-free
input. Neither the sextic-theta literature (literature note §2) nor the measured coefficients (§4) supply either.

---

## 4. Numerical tests [NUMERICAL]

The pass `tmp/sextic/conj_rows.py` runs over all 2904 nonzero m ∈ O with N(m) ≤ 796 against the computation note's
table, which holds all 2,822,619 squarefree primary moduli coprime to 6 with norm ≤ 10⁷ and exact γ₁, γ₂, γ₃. For each
row it stores:
* the complex ρ̂_σ(−e₀m) for the 12 classes σ mod 4, with e₀ = (−2)λ⁵ (t = 1, u₀ = 1; t = 2 gives the same |ρ_σ|,
  computation note §5.4), each with its model standard error;
* toy completed rows B_m(ψ, R) (§4.3);
* the factorisation type of m.

It takes 351 s and stays under 1.5 GB. The analysis is `conj_analyse.py` (log `conj_analyse_800.log`). Error model as in
the computation note: random-phase increment model, empirical noise = 0.85 × model se. At Q ≤ 300 the pass reproduces the
computation note's M(Q) table to all printed digits.

### 4.1 The needed mean square to Q = 796

M(Q) = Σ_σ Σ_{0<N(m)≤Q}|ρ̂_σ(−e₀m)|², noise-bias corrected:

| Q | #m | Σ\|ρ̂\|² | model bias | corrected | empirical-corrected |
|---|---|---|---|---|---|
| 50 | 186 | 1.2689 | 0.1789 | 1.0901 | 1.1397 |
| 100 | 366 | 2.4521 | 0.3514 | 2.1008 | 2.1983 |
| 200 | 732 | 4.4660 | 0.7035 | 3.7625 | 3.9577 |
| 300 | 1074 | 6.5041 | 1.0327 | 5.4714 | 5.7579 |
| 400 | 1458 | 8.6173 | 1.4007 | 7.2167 | 7.6053 |
| 500 | 1812 | 10.2327 | 1.7428 | 8.4899 | 8.9735 |
| 650 | 2346 | 12.7255 | 2.2536 | 10.4720 | 11.0973 |
| 796 | 2904 | 15.4739 | 2.7884 | 12.6855 | 13.4593 |

Log-log slopes:
* model-corrected: **0.868** over Q ∈ [100, 796] (0.882 from 50, 0.869 from 200); empirical-corrected 0.875; raw 0.889.
* bootstrap over rows (resampled within norm shells): mean 0.868, 68% [0.852, 0.885], **95% [0.834, 0.899]**.
* local slopes on successive steps: 0.70, 0.76, 0.95, 0.84, 0.92, 0.96, 0.73, 0.80, 0.95.
* per class σ: mean 0.882, sd 0.053.
* rows prime to 6 (those with ξ(m) ≠ 0 in (6.2)): 0.874 from Q = 100.

**Reading.** The slope has moved from 0.894 (Q ≤ 300) to 0.868, and 5/6 = 0.833 is at the edge of the 95% interval. This
supports (MS) and the identification of Prop 15.2's exceptional term with the dense theta norm ‖A^θ‖². It also shows that
the loss is a genuine dense term: (C2) and (C3) are excluded.

### 4.2 Which rows carry the mean

Rows are split by the good part of m, i.e. m with its unit, λ- and 2-parts removed. Share of the empirical-corrected
M(Q):

| rows | #rows ≤ 796 | Q = 12 | 50 | 100 | 300 | 500 | 796 | slope (Q ≥ 50) |
|---|---|---|---|---|---|---|---|---|
| good part a square (**even part**, CFH domain) | 252 | 0.873 | 0.524 | 0.326 | 0.215 | 0.165 | **0.143** | 0.430 |
| good part a sixth power (**Kummer coset** rows; up to 796 these are the S-unit rows only, since N(π⁶) ≥ 7⁶) | 126 | 0.873 | 0.525 | 0.327 | 0.188 | 0.136 | 0.106 | 0.317 |
| good part not a square (**odd part**) | 2652 | 0.127 | 0.476 | 0.674 | 0.785 | 0.835 | **0.857** | 1.08 (transient) |
| good part squarefree | 2730 | 1.000 | 1.001 | 1.001 | 0.973 | 0.963 | 0.954 | 0.868 |

**Reading.**
* At small Q the mean comes almost entirely from the S-unit rows, where the theta coefficients are large: |ρ(−λ⁴)| = 0.38
  in the computation note §5.3.
* As Q grows, the mass moves to the odd part. The even part's share falls like Q^{0.430−0.868} = Q^{−0.44}. Counting
  predicts Q^{−1/2}: about Q^{1/2} square rows with |ρ|² ≍ N^{−1/6} give Q^{1/3}, against Q^{5/6}.
* So the literature note's counting heuristic is confirmed. Even a proof of the CFH conjecture (C4) would evaluate a
  vanishing share of the block. The rest lies where no formula is known or expected.

### 4.3 Toy theta–row correlation (the finite-scale proxy for TRO6)

**Toy rows.**

  B_m(ψ, R) = Σ_{c sf, (c,6m)=1} γ₂(c)ψ(c)χ_c(m)N(c)^{−1/2}V(N(c)/R),  V(x) = exp(−2 log²x) (|log x| ≤ 2.2),

with ψ ∈ {αG, α, 1}, α(c) = c/|c|, G(c) = conj(χ_c(4))γ₃(c), and R ∈ {10⁴, 10⁵, 10⁶}. Compared with the manuscript's
B^J_{m,σ}:
* (6.1) carries γ₂(c)α(cn³)G(cn³)χ_{cn³}(m); ψ = αG and ψ = α are the manuscript's twist.
* The n³ part, the target η, Ξ^{−1} and R(·, s_σ) are omitted. All of these are finite-order S-data or a sparse sub-sum.
* R = 10⁴ at Q = 796 matches the manuscript's length ratio log R/log Q ≈ (1 + ℓ)/M = 1.4.

**Statistic.**
* r = |Σ_m ρ̂_σ(−e₀m)B_m| / (‖ρ̂_σ‖‖B‖), plus the same with conj(B).
* Null: independent uniform phases on ρ̂ with the moduli kept, 2000 draws.
* Look-elsewhere: the maximum over 12 classes × 9 rows × 2 pairings, i.e. 216 statistics.

| Q | rows | #rows | single-pair null rms | observed max of r | null max: median / 99% | p |
|---|---|---|---|---|---|---|
| 300 | all | 1074 | 0.030 | 0.093 | 0.079 / 0.103 | 0.06 |
| 300 | outside the Kummer coset | 978 | 0.032 | 0.074 | 0.077 / 0.101 | 0.67 |
| 796 | all | 2904 | 0.0185 | 0.075 | 0.049 / 0.065 | **0.001** |
| 796 | prime to 6 | 1458 | 0.027 | 0.083 | 0.073 / 0.093 | 0.08 |
| 796 | outside the Kummer coset | 2778 | 0.019 | **0.043** | 0.045 / 0.060 | **0.73** |

Mean over σ of r²·#rows (null ≈ 1) at Q = 796, all rows, for the pairings ⟨ρ, B⟩ / ⟨ρ, conj B⟩:

| ψ \ R | 10⁴ | 10⁵ | 10⁶ |
|---|---|---|---|
| αG | 1.09 / 1.56 | 0.63 / 1.48 | 1.54 / 0.54 |
| α | 1.44 / 0.61 | 1.18 / 0.82 | 0.84 / 1.49 |
| 1 | 3.15 / 2.50 | 5.46 / 5.25 | 6.47 / 5.60 |

Outside the Kummer coset the ψ = 1 row drops to 2.10 / 1.25, 0.50 / 1.84 and 1.13 / 0.52.

**Where the only excess comes from.** For ψ = 1 the rows have a large mean square on the S-unit rows: 1.75, 7.53 and 34.4
at R = 10⁴, 10⁵, 10⁶, against 0.18–0.21 on odd rows.
* This grows like R^{0.65}, i.e. |B| ∝ R^{1/3}. That is Patterson's cubic-theta main term R^{5/6}·R^{−1/2}: on an S-unit
  row, c ↦ χ_c(m) is a character of conductor dividing a power of 6, so B_m is a smoothed cubic Gauss-sum sum with a
  Kubota pole.
* With the α twist the S-unit rows have 0.16, 0.09, 0.04, i.e. no main term. The infinity type of α shifts the K-type,
  and the cubic theta pole does not appear.
* Why the manuscript needs the twist [HEURISTIC exponent count]:
  * Untwisted, the theta main term sits on the rows m ∈ (S-units)·(sixth powers). This is because the cubic theta vanishes
    at indices with a prime to the second power, so a square row m = k² carries the term only when k is a cube.
  * There are about Q^{1/6} such rows, each with |B|² ≍ R^{2/3}. At d = 0 they would give
    Σ|B|² ≳ Z^{M′/6 + 2(1+ℓ′)/3} = Z^{0.917}, above Lemma 15.1's Z^{M′} = Z^{0.833}.
  * The toy confirms that the α twist removes the term.

**Sensitivity.** Write B′ = B + f‖B‖·conj(ρ̂_σ)/‖ρ̂_σ‖. Then f = 0.08 reaches the 99% look-elsewhere threshold at Q = 796.
A perfectly aligned B would give r ≈ 0.91, since the measured ρ̂ is 83% signal.

**Reading.**
* With the manuscript's twist, no correlation between the sextic theta coefficients on the coset and the cubic rows is
  visible at N(m) ≤ 796 and R ≤ 10⁶. The aligned fraction is below about 8% of ‖B‖.
* The only coupling found is zero-independent: Patterson's main term on the Kummer-coset rows. It is absent for the
  α-twisted rows.
* This is what Prop E predicts in a world without zeros near 7/8, so it is consistent with TRO6. It says nothing about η:
  at these sizes r ~ (#rows)^{−1/2}, far below any Z^{−ηb/12}.

### 4.4 Side findings

1. **Exact antisymmetry [PROVED].**
   * g̃₁(−y, n) = conj(χ_n(−1))g̃₁(y, n), and χ_n(−1) = ±1 depends only on n mod 4. So ρ_σ(−y) = χ_σ(−1)ρ_σ(y) on every
     class σ mod 4.
   * On the 6 classes with χ_σ(−1) = −1, row sums over ±m vanish identically. The measured first moments there are 0 to
     rounding.
   * Here χ_n(−1) = (−1)^{(N(n)−1)/6}, which depends on N(n) mod 12 and so on n mod 4.
   * Consequently every mean that is odd in m drops out on those classes.
2. **Coherent row first moment [NUMERICAL].**
   * On the 6 classes with χ_σ(−1) = +1, |Σ_{N(m)≤Q}ρ̂_σ(−e₀m)|/(Σ|ρ̂_σ|²)^{1/2} = 5.3 / 3.2 / 8.3 / 3.2 / 4.8 / 5.3 at
     Q = 100, and 9.4 / 7.9 / 12.4 / 7.9 / 11.1 / 9.4 at Q = 796. A random walk would give ≈ 1.
   * It persists with the S-unit rows removed (9.9 / 7.9 / 9.4 / 7.9 / 11.8 / 9.9 at Q = 796).
   * It is consistent with the constant-term pole of θ₆'s Mellin transform (CFH12 §5: poles at u = 11/12 and 1/12)
     [HEURISTIC link, normalisation not traced].
   * It could pair only with an m-independent component of B. The α-twisted rows have none (S-unit-row mean square
     0.04–0.19, below the row average 0.19–0.24). It does not affect TRO6.

---

## 5. What TRO6 would give in θ

Scripts: `conj_bookkeeping.py` (exact, log `conj_bookkeeping.log`) and `conj_reopt.py` (model, log `conj_reopt.log`).

### 5.1 Exact bookkeeping at the paper geometry [EXACT]

**B1.** With exceptional exponent th in place of 1/6 (th = (1 − η)/6 under TRO6(η)):

  σ_low(th) = 1 − h/6 + th·b/2 = 5/6 + (M − 2ℓ)/12 − b(1/12 − th/2),

which is checked symbolically. At (b, ℓ, M) = (1/8, 1/6, 5/6) this is **7/8 − η/96** (83/96 at η = 1). On M + ℓ = 1 it
is 11/12 − ℓ/4 − ηb/12. So b stops cancelling once η > 0, and that is why re-optimising helps (§5.3).

**B4.** The other Section-20 inequalities at the paper geometry, against a shift of up to 2.863·10⁻⁴:

| inequality | E | margin left |
|---|---|---|
| floor bin (20.5) | −7/1200 | 5.55·10⁻³ |
| δ = α endpoint (20.7) | −1/48 − 5/96 | 7.26·10⁻² |
| d ≤ 1/2 (20.11) | −49/14400 | 3.12·10⁻³ |
| small rows (20.6) | −63/800 | 7.85·10⁻² |

All keep positive margins. The length condition of step 2 in §2.2, l_y − ℓ − (2 − th)b, equals 1/12, 13/160 and 1/16 at
η = 0, 1/10 and 1, all positive.

### 5.2 The high-side cap (the check asked for)

**B2 [EXACT].**
* Lemma 20.2's closed form: −E*(δ, y) = [10(37+34y) − 8(237+377y+26y²)δ + 48(51+131y+94y²+32y³)δ²] / (96·jy), with
  jy = 185 + 170y + (−138 + 12y + 96y²)δ and y = 1/2 − x. It is checked symbolically against (20.4) with R* from (20.8).
* The minimum over the whole box is at x = 1/2 (grid check: 3001 × 501 points), at δ* = 185/138 − 35√16354/4692 =
  0.3866376:

  **m_hi = 35√16354/12696 − 1491/4232 = 2.2814731·10⁻⁴**

  This is 2.05 times the certified 49/440640 = 1.112·10⁻⁴.

**B3: what a low-side shift Δ = β* − 7/8 < 0 costs on the high side.**
* Lemma 10.4's exponent satisfies C(σ₀) + E_{σ₀} = C(7/8) + E_{7/8}, so the nonprincipal rows do not depend on the
  target. The condition for the contradiction at a zero β* ∈ (σ₀, 7/8] is E_{7/8,actual}(h) < Δ, i.e. 7/8 − σ₀ < −E_actual.
* β* enters E_actual only through the bin ceiling (irrelevant: δ* = 0.387 < κ) and through the plain capacity
  z_P = (1 − 2m)/(6κ) of Lemma 18.1. That lemma is stated for 3/4 ≤ κ ≤ 1.

| reading | cap on 7/8 − σ₀ | σ₀ reachable | η* = 96·cap |
|---|---|---|---|
| **(S) Lemma 18.1 as stated**: κ_eff = 3/4 for β* ≤ 7/8, no capacity gain | **2.2815·10⁻⁴** (certified 1.112·10⁻⁴) | **0.8747719** (certified 0.8748888) | **0.0219** (certified 0.0107) |
| (X) Lemma 18.1 extended to κ = 2β* − 1 < 3/4, actual capacity gain | 2.2958·10⁻⁴ [NUMERICAL] | 0.8747704 | 0.0220 |
| (L) (20.10) read literally for Δ < 0, with factor 1 − h/4 = 51/64 | 2.863·10⁻⁴ (certified 1.395·10⁻⁴) | 0.8747137 | 0.0275 |

Reading (X):
* The binding margin m(κ) = min −E* was evaluated from the Prop 19.2 closed form with plain-capacity coefficient
  k = 1/(6κ). This form reproduces Lemma 20.2 exactly at k = 2/9.
* Its slope is dm/dΔ = −0.00625 at κ = 3/4.
* (20.10) uses the worst-case bound "the capacity comparison (19.6) raises the count exponent by at most Δ/4". At the
  binding bin the actual change in E is 0.006Δ, not hΔ/4 = 0.203Δ.

**Verdict.**
* The "≈ 2.9·10⁻⁴" cap of `zf-campaign-synthesis.md` §1.3 and of the data modules (`p152-lemma202-margin-and-delta-cap`)
  is reading (L). It treats an upper bound valid for Δ > 0 as an exact gain for Δ < 0.
* With Lemma 18.1 as stated the cap is **2.28·10⁻⁴**. Even extended below κ = 3/4 it is 2.30·10⁻⁴. The certified value is
  1.11·10⁻⁴.
* The fixed-geometry prize is therefore 7/8 − σ₀ ≤ 2.28·10⁻⁴, and TRO6 with **η ≈ 0.022** saturates it.

### 5.3 Re-optimised geometry [HEURISTIC model, not a certificate]

The model is that of `qrh_improvement_a_sensitivity.py`, imported unchanged; the only addition is a switch for Lemma
15.1's range. It uses:
* the closed-form R* of Prop 19.2;
* every Section-20 inequality, the prime supply ℓ/h, and the Prop 15.3 length conditions with P_a²/Y′ ≤ P_a^{th};
* M + ℓ = 1, with (ℓ, b) optimised by multi-start grid refinement (final step ~10⁻⁶, seeded with the paper geometry).

The Lemma 15.1 range is 2M ≥ 1 + 4ℓ as proved, or 2M ≥ 1 + 3ℓ with tuple slack. It only matters at η ≤ 0.01.

| η | σ₀ (re-optimised) | ℓ | b | binding constraints | fixed geometry (S) |
|---|---|---|---|---|---|
| 0 | 7/8 (as proved) / 0.874958 (slack) | 1/6 / 0.1668 | 0.116 / 0.118 | Lemma 15.1 range / adaptive bin | 7/8 |
| 0.01 | 0.874884 / 0.874873 | 0.1667 | 0.139 / 0.136 | Lemma 15.1 range / adaptive bin | 0.874896 |
| 0.0219 | 0.874766 | 0.1666 | 0.144 | adaptive bin δ ≈ 0.39 | 0.874772 |
| 0.03 | 0.874687 | 0.1665 | 0.142 | adaptive bin | 0.874772 (capped) |
| 0.05 | 0.874485 | 0.1662 | 0.154 | adaptive bin | 0.874772 (capped) |
| 0.1 | **0.873944** | 0.1655 | 0.161 | adaptive bin + floor bin | 0.874772 (capped) |
| 0.25 | 0.872320 | 0.1640 | 0.160 | adaptive bin + floor bin | 0.874772 (capped) |
| 0.5 | 0.869617 | 0.1584 | 0.179 | floor bin | 0.874772 (capped) |
| 1 | **0.864094** | 0.1552 | 0.165 | floor bin | 0.874772 (capped) |

* Consistent with the earlier model values in `beat78-synthesis.md` §3 (0.87393 at η = 0.1) and
  `qrh-improvement-attempt-a.md` §4 (0.864078 at c′ = 0).
* The synthesis's 0.8636 / 0.86362 at η = 1 came from a different row-count model (numerical witnesses). The two models
  differ by about 5·10⁻⁴ there.
* Every value below 0.874772 needs b ≈ 0.14–0.18 instead of 1/8, i.e. a new geometry. Part II would have to be
  re-proved there, with an endpoint certificate in the Lemma 20.2 / `Endpoint.lean` pattern. The Lean tree hard-codes the
  geometry and budgets (`qrh-improvement-attempt-a.md` §3).
* For η ≥ 0.5 the floor bin binds: 2/3 + ℓ + b/6 against 11/12 − ℓ/4 − ηb/12. The limit with every row count ideal is
  31/36 (beat78 synthesis O6).

### 5.4 Λ prices (not bounds)

`src/data/qrh-theta-and-improvement-2026-10-08.js` gives about 0.003 of conditional Λ per 0.01 of θ near 7/8:
* fixed geometry (2.28·10⁻⁴ in θ): about 7·10⁻⁵;
* η = 0.1 re-optimised (1.06·10⁻³): about 3·10⁻⁴;
* η = 1 re-optimised (1.09·10⁻²): about 3.3·10⁻³.

These are prices of hypothetical half-planes, not Newman-Λ bounds (atlas §12). `tmp/oai-lambda-raymond.py` was not run,
because no θ < 7/8 is established.

---

## 6. What is plausibly provable

| statement | content | plausibility | moves θ? |
|---|---|---|---|
| (MS) M_σ(Q) ≍ Q^{5/6} along the coset | Rankin–Selberg for the residual form θ₆ (L² on the 6-fold cover: constant term y^{5/6}, ∫^∞ y^{5/3}y^{−3}dy < ∞), restricted to the coset −e₀O and class σ by finitely many characters | standard method, not located in a source (literature note §3); supported by §4.1 | no: it says the loss is real |
| (Id) the exceptional term is ‖A^θ‖² | shift the s-Mellin contour of Ã_{σ,v}(y) past the Kubota pole (u = 2/3); the remainder needs a y-mean value of the continued class-σ Kubota series on Re u = 1/2 + ε, from the explicit functional equation (EP92 §5 / BH16 (3.1), (3.10)) and a large sieve for sextic Gauss sums | plausible, technical | no |
| Prop 2.3 of the subtract note (the exceptional term is a main term) | lattice-point counting plus Lemma 2.2(ii) | sketch exists; standard to complete | no |
| Prop E (a) | | done (PROVED-rel) | — |
| Prop E (b), (c) | needs Part II below 7/8, i.e. (H_{σ₀}) | re-checks of the kind done in `qrh-improvement-attempt-a.md` §3 for σ₀ = 34999/40000 | no: they show TRO6 is the region |
| exact symmetries (§4.4) | | proved | no |
| even-part evaluation (CFH) | Rankin–Selberg / double Dirichlet series against θ₂ | open over number fields; proved over F_q(T) | no: vanishing share (§4.2) |
| TRO6(η), any η > 0 | | in the window it *is* the improved zero-free region (Prop E). A proof needs new zero-free input, and theta knowledge does not make that easier (E2, E5) | yes, but it is the theorem itself |

In short, everything zero-independent in this direction is plausibly provable and none of it moves θ. The one statement
that would move θ is equivalent, in the window, to what it is meant to prove.

---

## 7. Precise obstruction

> In the 7/8 architecture the P_a^{1/6} term of Prop 15.2 is the low-side image of the high-side signal.
>
> 1. **What removing it needs.** A Z^{−ηb/12} decorrelation of the sextic theta coefficients ρ_σ(−e₀m) from the target's
>    completed cubic rows (TRO6(η), §2). At the paper geometry η* = 0.022 suffices for the whole fixed-geometry prize,
>    σ₀ = 7/8 − 2.28·10⁻⁴ (not 2.9·10⁻⁴, §5.2).
> 2. **What that is.** In the window σ₀ ∈ (7/8 − 2.28·10⁻⁴, 7/8] the aggregated TRO6 is equivalent to the family being
>    zero-free in Re s > σ₀. An exact evaluation of the block has Mellin poles exactly at the target's zeros there
>    (Prop E). Evaluating the block is locating the zeros; bounding it is the zero-free region.
> 3. **Why sextic theta coefficients cannot supply it.**
>    * Mean values are saturated by the extremal vector B ∝ conj(A^θ) (subtract note §6).
>    * The mean square is a genuine dense main term (Prop 2.3; measured slope 0.868 [0.834, 0.899]).
>    * The evaluable even part carries a vanishing share (14% at Q = 796, ∝ Q^{−0.44}).
>    * The odd part has no Gauss-sum law, no twisted multiplicativity, and an inexact class law (computation note §6).
>    * Even an exact formula would fall under E2.
> 4. **What would be needed instead.** New zero information about the family, or a probe in which the exceptional coset
>    and the principal signal separate. Theorem 4.1 of the subtract note shows they do not separate inside the
>    sextic-character family. The zero-free campaign examined cubic, quartic, GL(2) and other non-residue probes and found
>    none that works (synthesis §2.2). Non-Poisson summation formulas and residue families of unbounded order are not
>    excluded.
>
> All statements here obstruct a sufficient estimate within this architecture (atlas §9), not the half-plane itself.

**Recommendation.**
* Close the Prop 15.2 evaluation / subtraction / filter lever. This note shows it is the target theorem, not a missing
  coefficient formula.
* Do not spend more compute on sextic theta coefficients for this purpose. The open finite questions (the mod-9 class
  structure, 2-adic refinements, larger X) cannot change the conclusion, which rests on Prop E and not on the numerics.
* Correct the cap figure 2.9·10⁻⁴ → 2.28·10⁻⁴ (2.30·10⁻⁴ with Lemma 18.1 extended) wherever it is quoted.

---

## 8. Reproduction

All files are in `tmp/sextic/` and run with `../../.venv-arb/bin/python` from that directory. They need the computation
note's table `data/sf_1e7.npz`, which `run_all.sh` regenerates.

| file | content | runtime |
|---|---|---|
| `conj_bookkeeping.py` → `conj_bookkeeping.{log,json}` | §5.1–5.2: B1 symbolic σ_low; B2 Lemma 20.2 closed form, exact minimum, grid check; B3 caps under readings S/X/L; B4 other inequalities and length conditions; B5 η* and Λ prices | ~40 s |
| `conj_reopt.py` → `conj_reopt.{log,json}` | §5.3 model curve (imports `formalization/paper/qrh_improvement_a_sensitivity.py`) | ~50 s |
| `conj_rows.py data/sf_1e7.npz conj_rows_800 800` → `conj_rows_800.{npz,log}` | per-row ρ̂_σ(−e₀m) (12 classes, with se), toy rows B_m(ψ, R), row factorisation type; 2904 rows | 351 s, < 1.5 GB |
| `conj_analyse.py conj_rows_800.npz conj_analyse_800.json` → `conj_analyse_800.log` | §4.1–4.4: needed mean and bootstrap, parity split, first moments, toy TRO with phase-randomised nulls and look-elsewhere, injection test, B diagnostics | ~60 s |

---

## 9. Status of each claim

| claim | status |
|---|---|
| σ_low(th) = 5/6 + (M − 2ℓ)/12 − b(1/12 − th/2); 7/8 − η/96 at the paper geometry | EXACT |
| m_hi = 35√16354/12696 − 1491/4232 = 2.2815·10⁻⁴ is the global minimum of Lemma 20.2's −E* | EXACT (closed form) + NUMERICAL (grid) |
| fixed-geometry cap 2.2815·10⁻⁴ (Lemma 18.1 as stated); 2.2958·10⁻⁴ extended; 2.863·10⁻⁴ only under the literal (20.10) reading; certified 1.112·10⁻⁴ | EXACT / NUMERICAL (model derivative) |
| η* = 0.0219 saturates the fixed-geometry prize | EXACT (given the cap) |
| re-optimised σ₀(η): 0.874766, 0.874485, 0.873944, 0.872320, 0.869617, 0.864094 at η = 0.0219, 0.05, 0.1, 0.25, 0.5, 1 | HEURISTIC model |
| TRO6(η) + (Id) + (MS) ⟹ σ_low = 1 − h/6 + (1−η)b/12 | PROVED-rel |
| Prop E (a) | PROVED-rel (= subtract Cor 3.4) |
| Prop E (b), (c), and E1–E5 | SKETCH, relative to (H_{σ₀}) and the manuscript |
| only power savings change θ (remark in §2.5) | PROVED |
| M(Q) slope 0.868, 95% [0.834, 0.899] at Q ≤ 796 | NUMERICAL |
| odd part 85.7% of M(796); even part 14.3%, ∝ Q^{−0.44}; Kummer-coset (S-unit) rows 10.6% | NUMERICAL |
| toy TRO at the null level for α-twisted rows (max 0.043 vs 99% null 0.060 off the Kummer coset; threshold 8% aligned) | NUMERICAL |
| untwisted rows carry Patterson's main term on S-unit rows (\|B\|² ∝ R^{0.65}); the α twist removes it | NUMERICAL (mechanism RECALLED: Kubota–Patterson) |
| ρ_σ(−y) = χ_σ(−1)ρ_σ(y); coherent row first moment on the classes with χ_σ(−1) = +1 | PROVED / NUMERICAL |
| any θ < 7/8, any Λ bound | **none** |

PT Λ ≤ 0.2 stands. RH is open. NO QED.
