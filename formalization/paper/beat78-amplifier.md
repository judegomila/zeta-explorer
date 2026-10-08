# Beat-7/8 angle: amplifier efficiency

Date: 2026-10-08. Branch `editorial-redesign` (nothing committed).
Sources: openai/math family 003 — the 11/12 paper (`/tmp/qrh-verify/paper2.txt`, "The Quasi-Riemann
Hypothesis", 5 Oct 2026) and the 7/8 paper (`/tmp/qrh-verify/paper.txt`, "A Zero-Free Half-Plane
Re s > 7/8", 30 Sep 2026); Lean library `/tmp/qrh-verify/lean` (namespace `OAI`).
Scripts: `tmp/beat78-amplifier-{endgame,reopt,bruteforce,sensitivity,certificate,gauss}.py` (run with `.venv-arb/bin/python`).

Labels used below: **[PROVED]** = complete argument given here (or exact computer check);
**[EXACT-CHECK]** = exact rational / symbolic verification of a stated finite claim;
**[CONDITIONAL]** = valid only if named hypotheses hold; **[HEURISTIC]** = exponent bookkeeping, not a proof.

---

## 0. Result

No zero-free half-plane beyond Re s > 7/8 is obtained. What this angle establishes:

1. **The amplifier density is fixed at 1/6.** Within the chain Poisson in the row variable → Gauss sums →
   Möbius absorbed into cubic theta coefficients → theta reflection → quadratic large sieve, the residue
   degree must be k = 6 (§3, Lemmas C1–C2 [PROVED, given the recalled literature fact that among GL(2)
   theta functions only the cubic one has explicit Gauss-sum coefficients at squarefree indices]). Twists by p², p³, sums over j of A_{p^j}, products of
   primes, smooth weights, unit/S-unit rows and larger fields containing ζ₆ do not change the density of
   trivializing rows (§2.3 [PROVED]). Within mean-square amplification (11/12 paper) the p⁶ amplifier is
   optimal up to D^ε (Lemma A [PROVED]).
2. **In the 7/8 architecture the zero-free abscissa equals σ₀ = 1 − (h − b/2)/6** (§4.1 [PROVED from the
   paper's displayed formulas]). Here h is the log-length of the Poisson frequency range (in which the
   sixth-power frequencies a⁶ produce the signal) and b is the scale asymmetry. Under the low-side constraint
   M + ℓ ≤ 1 (taken with equality) this becomes **σ₀ = 1 − (1 + 3ℓ)/12**, where ℓ is the total length of
   the prime slots. Part I has ℓ = 0, giving 11/12; Part II has ℓ = 1/6, giving 7/8.
3. **So the 7/8 paper already uses the amplifier lever**, in its length form. The prime slots of
   Section 12 act as a products-of-primes amplifier that lengthens the sixth-power frequency range: each
   unit of ℓ adds 3/2 units to h − b/2. The density form (1/6 → 1/k) is not available (item 1).
4. **The length lever is saturated.** Re-optimizing the paper's geometry against the paper's own final
   inequalities gives a ceiling σ₀ ≈ 0.874957, a gain of 4.3·10⁻⁵. The binding constraints are M + ℓ ≤ 1
   (Lemma 15.1) and the endgame row-count inequality (20.4) at δ ≈ 0.387, x = 1/2. An exact certificate
   shows the endgame inequalities hold at a rational geometry with σ₀ = 7/8 − 1/25000
   ([EXACT-CHECK], endgame only). That is **not** a proof of a better region: the paper's other
   geometry-dependent hypotheses would have to be re-verified (§5.4), and the gain is negligible.
5. **Value of the other levers [HEURISTIC]** (§6). Density 1/5, 1/4, 1/3 would give about 0.849, 0.810,
   0.743, but these densities are unavailable. Perfect row counts give 0.870. The low-side cap of the
   current Lemma 15.1 is 13/15 ≈ 0.8667. Removing the low-side sixth-power loss Pa^{1/6} gives about 0.863;
   it amounts to cancellation in Möbius-twisted cubic Gauss sums. This is the same obstruction that rules
   out the cubic family.
6. **Height restriction (T ≥ 3·10¹²) gives nothing for this lever** (§7). The argument concerns the
   family-wide supremum β\* over all Hecke characters of Q(√−3). Its rows are twists of conductor up to
   Z^h, and verified-height data for ζ does not constrain them.

---

## 1. The two architectures and where "1/6" enters

### 1.1 Framework A (11/12 paper): mean square + amplifier

The family is A_u(D) = Σ_n μ(n)ν(n)χ_n(u)W(N n/D), with χ_n(u) = (u/n)₆. Proposition 3.1 gives
Σ_{0<N(u)≤H} |A_u(D)|² ≪ D^{1+ε}H for H = D^{1+ϑ}, 0 < ϑ ≤ 1/10.
Section 3 then uses the rows u = p⁶, Y/2 < N(p) ≤ Y = H^{1/6}. Since χ_n(p⁶) = 1_{p∤n},
A_{p⁶} = A₁ + O(D/Y), and

  |A₁(D)|² ≤ (2/J)Σ_p |A_{p⁶}|² + O(D²/Y²) ≪ D^{2+ϑ+ε}/Y + D²/Y² = D^{11/6+5ϑ/6+ε} + D^{5/3−ϑ/3}   (paper (3.2)).

So A₁ ≪ D^{11/12+5ϑ/12+ε}, and ϑ → 0 gives 11/12. In Lean, the ϑ = 1/10 instance of this step is
`OAI.PowerExtraction.from_mean_square_and_prime_rows` in
`OAI/NumberTheory/DirichletL/GaussSum/SexticNormalization.lean`: J ≥ D^{11/60} and
J·A² ≤ 2D^{21/10+ε} + 2J·D^{49/30} give A ≤ 2D^{23/24+ε}.

### 1.2 Framework B (7/8 paper, both parts): probe + Poisson rows + zero detector

The probe I_η(X,Y,Z) has two exact representations.
- Low side (reflection): |I| ≪ Z^{lx/2+b/12} (Prop. 6.3 with b = 0; Prop. 15.3).
- High side (Poisson): the frequencies are H = u·a⁶ with u sixth-power-free (§7.1). Row u carries
  ζ_F^S(6z)L^S(w,χ_•(u))/L^S(s,ηχ_•(u)) (7.13). The principal row u = 1 has residues at w = 1 and
  **z = 1/6**, the pole of ζ_F(6z) coming from the sum over the sixth powers a⁶. This produces the signal
  Z^{C(s)} with C(s) = s + lx/2 − 1 + h/6 and h = 1 − lx + ℓ (Def. 10.1, (10.3); Lemma 10.5:
  "X^{1/3}Z^{s−5/6}Z^{ℓ/6} = Z^{C(s)}").

Sixth powers enter Framework B in four places:

| place | form | effect |
|---|---|---|
| principal residue of ζ_F(6z) at z = 1/6 | signal gain h/6 | the amplifier proper |
| exceptional frequencies (k) = a₁⁶e in the additive Gram bound (Prop. 15.2, count K_R^{1/6}) | factor Pa^{1/6}, Pa = Z^b | low-side loss b/12 |
| Lemma 17.6 (amplification over rows u·a⁶, P = (H/U)^{1/6}) | e(r) = max{1, (1+5r)/6}, slope α = 5/6 | inverse-witness row counts |
| Lemma 18.1 (threshold A ≤ 5M/6 from "sixth-power form" of rows in Θ; capacity 6κz) | plain-witness capacity z_P = (1−2m)/(6κ) | plain-witness row counts |

Lemma 17.6 is the 11/12 amplification step applied to every row: U^{1/6}H^{5/6} is the Framework-A
bound D·H^{5/6} with the extra rows u·a⁶.

---

## 2. Framework A: general exponent and optimality

### 2.1 General exponent [PROVED as algebra]

Suppose a residue-degree-k family satisfied Σ_{N(u)≤H} |A_u(D)|² ≪ D^{1+ε}H with H = D^λ. The
trivializing rows u = m^k number ≍ H^{1/k}. Then |A₁|² ≪ D^{1+ε}H^{1−1/k}, so

  θ(k, λ) = 1/2 + (1 − 1/k)·λ/2,  in particular θ(k, 1) = 1 − 1/(2k).

For k = 6 this gives θ = 1/2 + 5λ/12: λ = 1 gives 11/12, and **λ = 9/10 gives 7/8**. The 7/8 paper is
therefore equivalent, in exponent terms, to a sextic mean square with row range D^{0.9} (dictionary in
§4.3). Beating 7/8 within Framework A means proving the sextic mean-square bound with λ < 9/10.

The 11/12 paper's own inputs force λ = 1 [HEURISTIC: uses the outline's comparison B_h ≈ √D·T_h].
Take (2.15), Σ_{h≪H*}|T_h(X)|² ≼ H* + H*²/X, with H* = D²/H. Then (2.8) gives
Σ_u|A_u|² ≼ D^{1+λ} + D² + D^{3−λ}. For λ < 1 the term D^{3−λ} dominates and the amplified bound
worsens to D^{3−7λ/6}. The exponent 11/12 sits at λ = 1, where the quadratic large sieve on the
theta-reflected dual reaches its rows-plus-columns balance.

### 2.2 Lemma A (optimality of sixth-power amplification) [PROVED]

*Setting.* Write N₆(H) = #{m : N(m)^6 ≤ H} ≍ H^{1/6}. Suppose an argument bounds |A₁(D)| using only
(i) the mean square Σ_{N(u)≤H}|A_u|² ≤ B, and (ii) the structural relations A_{u m⁶} = A_u (exactly, or
up to the coprimality error).

*Claim.* No such argument can conclude |A₁|² < B/N₆(H).

*Proof.* Take the configuration a(u) = (B/N₆(H))^{1/2} for u a sixth power and a(u) = 0 otherwise. It
satisfies (i) and (ii), and |a(1)|² = B/N₆(H). Any linear amplifier Σ c_u A_u with
Σ_u c_u χ_n(u) ≈ C has to put its mass on u ∈ μ₆·(K^×)⁶: the non-sixth-power part of c contributes
Σ_{u₀≠1} c̃(u₀)A_{u₀}, which (i) controls only through the same mean square. By Cauchy–Schwarz,
C²/‖c‖² ≤ N₆(H). ∎

With B = D^{1+ε}H this is D^{1+ε}H^{5/6}, which is (3.2). **The p⁶ amplifier is optimal for mean-square
amplification up to D^ε.**

### 2.3 Catalogue of amplifiers (k = 6 family) [PROVED unless marked]

| amplifier | trivializing rows used | ratio C²/‖c‖² | resulting A₁ bound at H = D^{1+ϑ} |
|---|---|---|---|
| p⁶, N(p) ~ Y = H^{1/6} (paper) | primes | Y/log Y | D^{11/12+5ϑ/12+ε} |
| all m⁶ with N(m) ≤ H^{1/6}, or smooth weight Φ(N(m)/M) | all sixth powers | ≍ H^{1/6} | same; the coprimality error D·Σ_{p∣m}1/N(p) needs an inductive treatment, no gain |
| (p₁⋯p_r)⁶, products of primes | sixth powers of composites | same count | same exponent; error D/Y^{1/r} is worse |
| ε·m⁶, ε ∈ μ₆, or S-units·m⁶ | other members ν·χ_•(ε) of the family | factor ≤ 6 | constant only |
| p² (χ_n(p²) = (p/n)₃) or p³ (χ_n(p³) = (p/n)₂) | none | — | A_{p²}, A_{p³} are cubic/quadratic twists, not copies of A₁; their p-average is ≈ 0 |
| Σ_{j=0}^{5} A_{p^j} = 6·Σ_{p∤n, χ_n(p)=1} μνW + O(D/Y) | only j = 0 | 1 | isolates the u = 1 row with weight 1: no amplification |
| quadratic sub-family u = v³ (rows N(v) ≤ H^{1/3}) | v = w² | H^{1/6} | the sub-family only inherits Σ_v ≪ DH = D·(#rows)³, not square-root on average: no gain |
| higher moments Σ_u|A_u|^{2j} (if provable at H ≥ D^j) | sixth powers | H^{1/6} | θ = 1/2 + 5λ/12 again; no gain |

---

## 3. Compatibility: which residue degree survives Poisson → Gauss → theta → quadratic sieve

The 11/12 proof needs, in order:
- (G) the Poisson coefficient μ(n)γ_{−1}(n) must equal (finite-modulus function)·α(n)^j·(coefficient of a
  theta function with a usable summation formula);
- (Q) after theta reflection, the twist must be quadratic, χ_p^{−1}χ_p^{−2} = χ_p^{−3} ((2.14)), so that
  Goldmakher–Louvel's quadratic large sieve applies without the (ML)^{2/3} term.

Squarefree theta coefficients with an explicit formula exist only for the cubic theta on GL(2): Patterson,
cubic Gauss sums. The classical theta has no non-square coefficients. For n ≥ 4 on GL(2) the theta
representation does not have a unique Whittaker model (Kazhdan–Patterson: distinguished only for
n ∈ {r, r+1} on GL(r)), and the coefficients are not given by Gauss sums. Suzuki's work on the
biquadratic theta series gives only partial information (as recalled, it relates squares of prime-index
coefficients to Gauss sums). These literature facts are recalled, not re-derived here.

**Lemma C1 (Galois parity) [PROVED].** Let K ⊇ Q(ζ_k), π a degree-one prime with Nπ = p, χ = χ_π the k-th
power residue character, and g(χ^a) Gauss sums for a fixed additive character. Suppose
g(χ^{−1}) = c(π)·Π_t g(χ^t)^{e_t} with c(π) ∈ K^× (p unramified in K) and t ranging over cubic
(t ∈ {k/3, 2k/3}) and quadratic (t = k/2) exponents. Then k ∈ {3, 6}.
*Proof.* The automorphism ζ_p ↦ ζ_p^b of K(ζ_p)/K (which exists because K ∩ Q(ζ_p) = Q) sends g(χ^a) ↦ χ̄^a(b)g(χ^a). Comparing both sides
gives −1 ≡ Σ_t t·e_t (mod k) for all b. Every allowed t is a multiple of k/6 (or of k/3 when 2 ∤ k), so
k/6 must divide 1 (respectively k/3 must divide 1). Hence k = 6 or k = 3. If 3 ∤ k, no cubic exponent is
available at all. ∎

*Normalizations.* Normalized sums γ = g/√p and factors α^j = (π/√p)^j bring in powers of √p. Up to a
finite-modulus sign, √(±p) is the quadratic Gauss sum g(χ^{k/2}), so these factors only shift e_{k/2}
and the parity count is unchanged. The paper's identity in unnormalized form is
g(χ^{−1}) = c(π)·g(χ²)·g(χ³)^{−1}, with c(π) = (unit)·χ̄(4)·π̄ ∈ Q(ζ₆) and −1 ≡ 2 − 3 (mod 6).
Numerical witness (`tmp/beat78-amplifier-gauss.py`): for k = 9, 12 (and k = 4 with quadratic targets)
there is no Galois-invariant combination. For k = 3 and k = 6 there are, including the paper's
γ_{−1}/(γ₂γ₃^{±1}).

**Lemma C2 (Möbius absorption) [PROVED; numerically checked].**
- k = 6 over Z[ω]: μγ_{−1} = χ_n(−1)G^{−1}·ᾱ·γ₂ (paper (4.5) up to its global conjugation convention).
  This rests on γ₂³ = μα, which in turn comes from the cubic Jacobi sum J(χ²,χ²) = −π for primary π: the
  "−1" at each prime is μ. Lean: `breveGamma1_gamma2_eq_neg_alpha_G` (γ₁γ₂ = −α·G). Checked for all
  7 < p < 700, p ≡ 1 (6), with maximum error 4·10⁻¹⁵.
- k = 3: the Poisson coefficient is μγ_{−2} = μ·conj(γ₂), which is exactly μ times a (conjugate) theta
  coefficient. Its ratio to either cubic theta coefficient is μ or μ·conj(γ₂)/γ₂. The first is not
  finite-modulus (a finite-order character cannot equal −1 at every prime). The second has an
  equidistributed phase (Heath-Brown–Patterson). So **μ is not absorbed**. The dual sums are
  Möbius-twisted cubic Gauss sums, whose generating series is ≈ 1/ψ(s) with ψ the cubic theta Dirichlet
  series. ψ has no Euler product, and no zero-free input exists. This holds even though the unconditional
  first moment of cubic Gauss sums *without* μ (OpenAI [23] of the 7/8 paper; Patterson bias) is
  available.
- k = 4 over Z[i]: J(χ,χ) = −χ(−1)π for primary π (checked exactly, 58 primes). So γ₁² carries the −1 and
  μ is absorbed, but **into quartic Gauss sums**, which are not coefficients of a theta function with a
  known summation formula.
- k = 2: the Gauss sums are finite-modulus and μ survives. The dual is again a Möbius sum with quadratic
  twists of row length D²/H, so the method is self-dual and circular. The quadratic large sieve excludes
  square rows, which are exactly the amplifier rows.
- k = 6 over larger fields L ⊇ Q(ω): the same structure (cubic theta over L, quadratic large sieve over L).
  The density of sixth powers in norm balls (or boxes) is still ≍ H^{1/6}, so there is no gain.

**Resulting abscissae.** The incompatible rows are hypothetical: "what the amplifier would give if the
structure worked".

| residue degree k | compatible? | Framework A (λ = 1) | Framework B, all induced changes [HEURISTIC] |
|---|---|---|---|
| 6 (Q(ω), or L ⊇ Q(ω)) | yes | 11/12 | 7/8 (paper); ceiling 0.874957 (§5) |
| 4 (Q(i)) | no: needs quartic-theta summation | 7/8 (equal, not better) | ≈ 0.810 |
| 3 (Q(ω)) | no: μ not absorbed | 5/6 | ≈ 0.743 |
| 2 | no: circular | 3/4 | — |
| 9, 12, 6m (m ≥ 2) | no: Lemma C1 | — | — |

---

## 4. Framework B: the amplifier-length identity and what the 7/8 paper used

### 4.1 Identity [PROVED from Def. 10.1, (10.3), Prop. 15.2–15.3]

The low exponent is lx/2 + b/12 with b = ly − lx (Prop. 15.3; the b/12 is ½·(1/6)·b from Pa^{1/6}). The
signal exponent is C(s) = s − 1 + lx/2 + h/6 with h = 1 − lx + ℓ. The continuation criterion
(Prop. 2.1) closes exactly when C(σ₀) equals the low exponent:

  **σ₀ = 1 − h/6 + b/12 = 1 − (h − b/2)/6 =: 1 − h_eff/6.**

The lx/2 terms cancel. Only the effective sixth-power frequency length h_eff = h − b/2 remains.
- Part I: lx = ly = 1/2, ℓ = 0, so h = 1/2, b = 0, and σ₀ = 11/12.
- Part II: lx = 17/48, ly = 23/48, ℓ = 1/6, so h = 13/16, b = 1/8, h_eff = 3/4, and σ₀ = 7/8.

(`tmp/beat78-amplifier-endgame.py` checks both, and C(s) = s − 11/16 with C(7/8) = 3/16 = lx/2 + b/12.)

### 4.2 The L1-tight family: σ₀ is a function of the prime-slot length alone

The proof of Lemma 15.1 uses M′ + ℓ′ − 1 = −3d ≤ 0 to get T_d ≤ H, i.e. "dual range ≤ residual row range".
At d = 0 this reads **L1: M + ℓ ≤ 1**, with M = lx + ly. Both parts take it with equality. On
M + ℓ = 1 we have lx = (1 − b − ℓ)/2, h_eff = (1 + 3ℓ)/2, and

  **σ₀ = 1 − (1 + 3ℓ)/12  (independent of b).**

ℓ = 0 gives 11/12 and ℓ = 1/6 gives 7/8. **The whole 11/12 → 7/8 step is, in exponent terms, the
introduction of prime slots of total length ℓ = 1/6.** In the marked probe (12.5), Z → Z·q_{p_{J^c}}, so
the completed scale and hence the frequency range h grow by ℓ. The subtraction of the rescaled terms
cancels the scalar slot Euler factor in the principal row, and the normalizer
A_T(Z) ≈ Z^{−ℓ/6}Π_iS_i(Z) with S_i ≈ P_i^{1/6} (§20.1) keeps the per-prime residue q_p^{1/6}.

That is a products-of-primes amplifier acting on the sixth-power frequency sum. Each unit of ℓ adds 3/2
units to h_eff: 1 directly, plus 1/2 from the X budget freed under L1. The asymmetry b and the refined row
counts (zero detector with inverse and plain witnesses, fourth moments with short prime factors,
amplitude-selected slots, Lemma 17.6) are what make the high side absorb ℓ = 1/6.

**Answer to "does the 7/8 improvement already use this lever?"** Yes. It uses the length side of the
amplifier: the products-of-primes slots (ℓ = 1/6) and the shorter X (lx = 17/48), both lengthening the
sixth-power frequency range. It also uses sixth-power amplification inside the row counts (Lemma 17.6,
slope α = 5/6). It does not, and cannot, change the density 1/6 (§3).

### 4.3 Dictionary between the frameworks [HEURISTIC]

Equating 1 − h_eff/6 = 1/2 + 5λ/12 gives λ = 2(3 − h_eff)/5: h_eff = 1/2 ↔ λ = 1, and h_eff = 3/4 ↔
λ = 9/10. To beat 7/8 one needs h_eff > 3/4, equivalently λ < 9/10.

---

## 5. Saturation of the length lever

### 5.1 Endgame reconstruction [EXACT-CHECK]

From (20.4) at d = h, with R = R\* of Prop. 19.2 and (20.8):

  E(h) = a − σ₀ − h/6 − a·ly − ℓ/2 + xδℓ + h(R + δ/2),  a = (1+δ)/2,
  R = 1 − δ + (α − δ)δP_x/(2J),  J = (α − δ)D_x + δP_x,
  D_x = 3 − (1 + 2c)x,  P_x = (1 − x)(2 − 2cx),  c = 1/(3κ) (= 4/9 at κ = 3/4), α = 5/6.

`tmp/beat78-amplifier-endgame.py` verifies symbolically:
- the formula equals the paper's −E\* expression in Lemma 20.2;
- the identity (20.9) holds;
- the constant term is C₀ = −1/48;
- the minimum of −E(h) over the box is 2.28·10⁻⁴, attained at δ ≈ 0.387, x = 1/2 (the paper proves the
  lower bound 49/440640 ≈ 1.1·10⁻⁴);
- E(1/2) = −529/2400 + 25δ/96 at x = 1/2.

In general geometry, E(h) = 1/2 − 3lx/2 + ℓ/2 − 7b/12 − δ(b+ℓ)/2 + xδℓ + h·X(δ,x). On the L1-tight
family, C₀ = −1/4 + 5ℓ/4 + b/6.

### 5.2 Constraint set used for re-optimization (as reconstructed from the paper)

- L1: M + ℓ ≤ 1 (Lemma 15.1, T_d ≤ H).
- L2: M ≥ (1 + 3ℓ)/2. Otherwise the reflected energy at d = 0 exceeds M by (1 + 3ℓ − 2M)/4 and the low
  exponent grows by (1 + 3ℓ − 2M)/8; this is modelled as a soft penalty.
- L3: ly − ℓ − 11b/6 ≥ 0 (Pa²/Y′ ≪ Pa^{1/6} in Prop. 15.3).
- H1: max over δ, x of E(h) ≤ 0.
- H2: supply ℓ/h > 7/37.
- H3: small-row exponent < 0.
- H4: E(1/2) < 0.

For a target σ₀ < 7/8 the 7/8 theorem gives β\* ≤ 7/8, so Lemma 18.1 can be used with κ = 3/4
(no Δ/4 capacity loss) and the bins satisfy δ ≤ 3/4.

### 5.3 Result [HEURISTIC optimum; EXACT-CHECK at a rational point]

`tmp/beat78-amplifier-reopt.py` (SLSQP from several starts) finds the optimum
**σ₀ = 0.8749571** at (lx, b, ℓ) ≈ (0.354849, 0.123464, 0.166838), with h_eff = 0.750258. The active
constraints are L1 and H1. All others have slack: L3 0.085, H2 0.016, H3 0.098, H4 0.024.
An independent grid search (`tmp/beat78-amplifier-bruteforce.py`) over (b, ℓ, L1-slack) gives
σ₀ = 0.8749667 at grid resolution, again with L1 tight. Moving off L1 (M + ℓ < 1) never helps.
On the L1-tight family σ₀ = 7/8 − (ℓ − 1/6)/4. The endgame therefore caps the slot length at
ℓ ≈ 1/6 + 1.7·10⁻⁴. The binding piece is the row excess hX ≈ 0.045 at δ ≈ 0.39, x = 1/2: rows whose
twisted L-functions have zeros near real part 0.69, with maximal prime amplitude.

`tmp/beat78-amplifier-certificate.py` (exact rationals, Bernstein enclosures of the bidegree-(2,3)
numerator 2J·E(h)) certifies that at

  (lx, b, ℓ) = (106451/300000, 247/2000, 1564/9375),  σ₀ = 7/8 − 1/25000 = 0.87496,

the following all hold:
- (a) E(h) < 0 on [1/50, 3/4] × [0, 1/2] (31 boxes; worst Bernstein maximum −5.9·10⁻⁶);
- (b) floor bin: E = −0.00588;
- (c) E(1/2) < 0;
- (d) small rows: −0.0858;
- (e) L1 holds with equality; L3 = 0.085; supply margin 0.0163; 5ℓ − h = 0.0221.

The same script reproduces the paper's Lemma 20.2 regime at (17/48, 1/8, 1/6).

### 5.4 Why this is not a theorem

The certificate covers only the final inequalities. The following geometry-dependent hypotheses of the
7/8 paper would have to be re-proved at the new point:
- Lemma 10.5 and Lemma 10.6 assume σ₀ ∈ [7/8, 1).
- The Euler region D₂ of Lemma 7.1 is stated for Re s ≥ 7/8. Convergence actually needs only Re s > 2/3,
  but the statement would have to be redone.
- Section 16 local errors use O(q_p^{−7/8}), and κ_P < (7/8)·min ℓ_i.
- Prop. 15.3 uses the length bounds lx − d ≥ 3/16 and ly − d ≥ 5/16, and needs M′ > 0; at the new point
  M − 2ℓ = 0.4995, while the paper writes M′ ≥ 1/2.
- Lemma 15.1 holds for d ≤ ℓ. At the new point d\* = 2M − 1 − 3ℓ = 1 − 5ℓ = 0.16587 < ℓ, so there is an
  energy loss of at most (6ℓ − 1)/4 = 2.4·10⁻⁴ for d ∈ (d\*, ℓ]. This is harmless because those summands carry the factor Z^{−d}, but it
  must be written out.
- Lemma 17.1's width and supply margins, Lemma 18.1's mesh and band induction, and the slot-mesh choices
  of Prop. 20.3.

Most of these are open conditions with slack, so a perturbation of size 10⁻³ is expected to preserve
them. The two tight ones, L1 and E(h), are kept tight or certified. Even so, the result would be a
re-tuning worth 4·10⁻⁵ that inherits every step of the 7/8 paper; it is reported as a saturation
diagnostic. For the de Bruijn–Newman input q₀ = (2θ − 1)² it moves 0.5625 to 0.56238.

---

## 6. Value of each lever [HEURISTIC]

Output of `tmp/beat78-amplifier-sensitivity.py`: the same constraint set with one ingredient changed.

| scenario | σ₀ | binding |
|---|---|---|
| paper's constraints, re-optimized | 0.87496 | L1, H1 |
| density 1/5 (α = 4/5, capacity 2/(kκ), low loss b/10) | 0.84917 | L1, H1 |
| density 1/4 | 0.80986 | L1, H1 |
| density 1/3 | 0.74283 | L1, H1 |
| row-count amplification slope α = 0.8 / 0.75 / 2/3 / 0.5 (density kept 1/6) | 0.87479 / 0.87451 / 0.87392 / 0.87223 | L1, H1 |
| relax L1 to M + ℓ ≤ 1 + τ, τ = 0.02 / 0.05 / 0.10 / 0.20 (no penalty) | 0.87371 / 0.87183 / 0.86870 / 0.86333 | L1 (+ L2 at 0.2) |
| perfect row counts R = 1 − δ | 0.87001 | L1, H1(C₀), H4 |
| low-side cap of current Lemma 15.1: L1 ∩ L2 at ℓ = 1/5, M = 4/5 | 13/15 = 0.86667 | exact |
| no Pa^{1/6} exceptional loss (low exponent lx/2) | 0.86340 | — |
| no Pa^{1/6} loss + perfect row counts | 0.85985 | — |

Readings:
- **The density is the dominant constant**, since σ₀ = 1 − h_eff/k with h_eff ≈ 0.75–0.77 in every
  scenario. It is fixed by §3.
- **The row-count amplifier (Lemma 17.6) is not the bottleneck.** Even α = 1/2 gains only 0.003.
- **L1 is the main wall, and it cannot be relaxed for free.** [HEURISTIC reading of the proof] Run with
  M + ℓ = 1 + τ, the proof of Lemma 15.1 gives max(H, v + ℓ_b) ≤ H + τ in both branches of (14.14). The
  energy then rises by τ and the low exponent by τ/2, which exceeds the high-side gain of ≈ 0.063τ. A new reflected-energy bound is
  needed for the regime where the dual range exceeds the residual row range. In Framework A this is the
  same wall that pins λ = 1: the 11/12 recursion keeps H′/X′ = H/X fixed, so the ratio never improves.
- **The low-side loss Pa^{1/6} is the same density appearing as a loss.** At the exceptional frequencies
  k = a⁶e, the additive polynomial satisfies A_{a⁶} ≈ A₁ = Σ_s c(s)g_{χ_s}(s,1). By (4.5) that is
  Σ_s μ(s)·(finite)·ᾱ(s)γ̄₂(s): Möbius-twisted cubic Gauss sums, which are bounded trivially. Removing the
  loss requires cancellation in exactly the sums that make the cubic family fail (§3).

---

## 7. Height-restricted regions (T ≥ 3·10¹²)

The lever gives nothing here.
- The contradiction is with β\* = sup of Re ρ over zeros of all primitive Hecke L-functions over
  Q(√−3) (2.1).
- The Poisson rows bring in twists χ_•(u) with conductors up to Z^h. Their low-lying zeros, at heights
  ≤ 3iT₁, are what the detector bins.
- RH verified for ζ up to height 3·10¹² (or GRH for small conductors) puts no constraint on these twists.
- The Gaussian weight e^{(s−5/6)²} in (2.3) is entire and nonvanishing, so the continuation argument
  already excludes zeros at every height. No height-dependent refinement θ(T) comes out of this
  mechanism.

---

## 8. Obstruction

1. **Density.** The amplifier is the set of trivializing rows μ₆·(K^×)⁶, of density 1/6. Lemma C1
   (Galois parity) and Lemma C2 (μ-absorption) show that k = 6 is the only residue degree for which the
   Poisson coefficient μγ_{−1} is a theta coefficient with a summation formula and the reflected twist is
   quadratic. k = 3 leaves μ unabsorbed; k = 4 lands in quartic Gauss sums; k = 2 is circular; other k with
   3 ∤ k have no cubic Gauss sums at all; k = 3m (m ≥ 3 odd) and k = 6m (m ≥ 2) are parity-obstructed.
2. **Length.** In the 7/8 architecture, σ₀ = 1 − h_eff/6. h_eff is bounded by two rows-plus-columns
   balances:
   - L1, M + ℓ ≤ 1: the quadratic large sieve on the reflected completed row in Lemma 15.1;
   - the endgame row-count inequality (20.4): zero-detector counts of rows up to Z^h, binding at
     δ ≈ 0.387, x = 1/2.

   The paper's geometry is optimal for its own inequalities up to 4.3·10⁻⁵.
3. **Below ≈ 0.867** one would need a new low-side input: a reflected-energy bound beyond M + ℓ = 1 and
   beyond L2, or cancellation in Möbius-twisted cubic Gauss sums. The latter is the same missing input
   that excludes the cubic family.

---

## 9. Reproduction

```
cd /Users/USER/Documents/GitHub/mathexplorer
.venv-arb/bin/python tmp/beat78-amplifier-endgame.py      # reconstruction == paper Lemma 20.2, identity (20.9), C0=-1/48
.venv-arb/bin/python tmp/beat78-amplifier-reopt.py        # optimum sigma0=0.8749571, active L1 & H1
.venv-arb/bin/python tmp/beat78-amplifier-bruteforce.py   # independent grid check (L1 tight, 0.8749667 at grid resolution)
.venv-arb/bin/python tmp/beat78-amplifier-sensitivity.py  # lever-value tables of section 6
.venv-arb/bin/python tmp/beat78-amplifier-certificate.py  # exact endgame certificate at sigma0 = 7/8 - 1/25000
.venv-arb/bin/python tmp/beat78-amplifier-gauss.py        # Gauss/Jacobi sign identities, Galois parity witnesses
```
Each run takes under 30 s, single-threaded.
