# Sextic theta coefficients and the P_a^{1/6} term of Prop 15.2: a numerical study over Z[ω]

Internal working note, 2026-11-03. Branch `editorial-redesign`. Nothing committed, nothing pushed, nothing sent off the
machine. Not refereed. Scripts and logs: `tmp/sextic/` (§9).

Sources read for this note: the 7/8 manuscript `~/lean-deps/qrh-verify/paper.txt` (§§4.1–4.2, 5.1, 6.1, 15.1–15.3;
identity (4.7) with the bar restored), the 11/12 manuscript `paper2.txt` (§2.3, §6 theta normalisation), the OAI 023
comparator statement `~/lean-deps/qrh-verify/lean/ComparatorChallenges/PattersonFirstMoment.lean`, and the internal notes
`zf-campaign-synthesis.md`, `zf-campaign-new-probe.md` (§7), `beat78-prop152-subtract.md` (Lemma 2.2, Prop 2.3, §§5–6),
`beat78-prop152-restrict.md`, `cubic-r2-conductor-verdict.md` (§2.2 transfer formula), `beat78-synthesis.md`, and atlas
§10 (`git show refs/pr/27:research/rh/modules/historical-routes.md`).

Status labels: **[PROVED]** complete argument here; **[EXACT]** exact finite identity or exact-symbol computation;
**[NUMERICAL]** floating-point measurement (with stated error model); **[CITED]** statement read in a source, used as
stated; **[RECALLED]** literature fact not re-read here; **[HEURISTIC]** exponent bookkeeping or an unproved model.

---

## 0. Outcome

**No theorem, and no θ < 7/8.** No 6-fold Patterson-type identity is found, and the data argue against a Gauss-sum
formula for sextic theta coefficients at squarefree indices. PT Λ ≤ 0.2 stands, RH is open, NO QED. What was computed,
all at norm ≤ 10⁷ over Z[ω]:

* **Machinery [EXACT/NUMERICAL].**
  * Exact sextic, cubic and quadratic residue symbols, and the paper's γ₁, γ₂, γ₃ for all 664,616 primary primes and
    all 2,822,619 squarefree primary moduli coprime to 6.
  * Every identity of the paper's §4.2 is verified to ≤ 10⁻⁸ (bars restored in Lemma 4.2 and (4.7)), plus brute force
    up to p = 9,999,991. The corollary used throughout: **γ₁(c) = G(c)γ₂(c)²** on squarefree c.
* **Cubic calibration: success (§4).**
  * Prime first moment against the cited (6/5)c*X^{5/6}/log X (OAI 023 / Dunn–Radziwiłł): κ = 0.988 ± 0.012.
  * Patterson's evaluation at squarefree index reproduced with no free parameter: ĉ(r) = ĉ(1)·conj(g̃₃(r))·N(r)^{−1/6}·
    N(r)/(N(r)+1), rms error 0.5% over 160 primes, ≤ 1.4% on products.
  * Exponent 0.833 ± 0.004; Heath-Brown–Patterson equidistribution (Weyl sums k ≥ 3 at noise, k = 1 bias ∝ X^{−1/6});
    vanishing at index π²; row mean-square slope 0.675 (2/3).
* **Sextic first moments (§5).**
  * Per-class exponent **0.683 [0.669, 0.697]** (Kubota 2/3; 1/2 and 5/6 excluded). Leading class n ≡ 1 mod 4,
    ≡ 1 mod 9: z = 16.5.
  * At primes, a per-class bias of order X^{2/3}/log X (leading class θ = 0.705 [0.665, 0.750], z = 7.5): the sextic
    analogue of Patterson's bias, which also shows up as the cubic ℓ = −1 angular mode.
  * Arguments of γ₁(π) equidistributed (Weyl ≤ 0.004).
  * **So the first moments are X^{2/3}, smaller than the cubic X^{5/6} by X^{1/6}.**
* **The needed mean (§1, §7).** Prop 15.2's P_a^{1/6} term is (Q/Y)P_a^{1/6} = Q^{5/6}Y^{−2/3}. Under the theta
  identification (§1.2) it is (4/9)|Ŵ₁(1/6+iv)|²·Y^{−2/3}·M_σ(Q), with M_σ(Q) = Σ_{0<N(m)≤Q}|ρ_σ(−e₀m)|², the row mean
  square of class-σ sextic theta coefficients along −e₀O.
  * Measured (summed over the 12 classes σ mod 4): M(Q) = 0.38 → 5.47 for Q = 12 → 300, **slope 0.89** (local
    0.70–0.95). Dense, close to 5/6.
  * The sparse alternative (≤ 0.3) is excluded. The term is the norm of a genuine dense theta component.
* **Structure (§6).**
  * The local theory is reproduced where it fixes coefficients: index exponent 5 vanishes; exponent 3 follows from
    exponent 1 through the cubic Gauss sum, ρ(y_Sπ³) = ρ(y_Sπ)conj(γ₂(π))χ_π(y_S)²N(π)^{−1/6}·1.05 (phase alignment
    0.997).
  * At prime indices (exponent 1) there is no Gauss-sum phase law (best 0.50 over 232 candidates, 99% null 0.37).
  * Instead, for the 3-adic base −λ⁴, a class function of π mod 9 carries 75% of held-out power (four-character Fourier
    support), with an irregular remainder at 2.4 × noise.
  * At products, no twisted multiplicativity (≤ 4%).
  * Consequence: no evaluation formula for ρ_σ(−e₀m) at squarefree m; the P_a^{1/6} block can be measured but not
    evaluated from local data. The obstruction of `zf-campaign-synthesis.md` §2.1 stands, now with numerical form (§8).

---

## 1. Which mean the exceptional term needs

### 1.1 The column sum is a class-σ sextic Kubota first moment at index −e₀m [PROVED-rel]

The 7/8 paper's additive polynomial (§6.1) is

  A_{m,σ,v}(Y) = Y^{−1} Σ_{s∈σ} W₁(q_s/Y)·χ_s(b*)/(τξ(s))·(q_s/Y)^{−1/2+iv}·q_s^{−1/2} g_{χ_s}(s, −m),

with g_{χ_s}(s, k) = Σ_{d mod s} χ_s(d) e(kd/s). Write g̃₁(y, s) := q_s^{−1/2} g_{χ_s}(s, y) (normalised sextic Gauss sum
with modulus s at index y). For squarefree s with (s, y) = 1, g̃₁(y, s) = conj(χ_s(y))·γ₁(s) (substitute d ↦ y⁻¹d; checked
by brute force, T9 of §3). By Lemma 2.2 of `beat78-prop152-subtract.md`, c_σ(s)χ_s(e₀) ≡ κ_σ/τ on σ, with e₀ an S-unit; for
the minimal excluded set S = {2, λ} it is

  e₀ = u₀·(−2)^{2t−1}·λ⁵,  t ∈ {1, 2} (ξ at 2 is ϰ₂^t),  u₀ a unit fixed by the generator of b*,  κ_σ = 1.

Hence

  A_m = (κ_σ/τ)·Y^{−1} Σ_{s∈σ} W₁(r_s) r_s^{−1/2+iv} g̃₁(−e₀m, s),  r_s = q_s/Y.

Define the **class-σ first moment at index y**

  F_σ(y; X) := Σ_{s∈σ, N(s) ≤ X} g̃₁(y, s).

If F_σ(y; X) = ρ_σ(y)·X^{2/3} + E_σ(y; X) (the sextic Kubota pole is at normalised exponent 1/2 + 1/6 = 2/3 [RECALLED:
Kubota; the cubic analogue 5/6 is calibrated in §4]), partial summation gives the theta part of A_m:

  A^θ_m = (2κ_σ/3τ)·Ŵ₁(1/6 + iv)·Y^{−1/3}·ρ_σ(−e₀m),  Ŵ₁(w) = ∫W₁(r)r^{w−1}dr.

So **ρ_σ(y) is the (class-σ, index-y) sextic theta coefficient in first-moment normalisation**: the number this note
measures.

### 1.2 The two means

* **Mean square (what Prop 15.2's P_a^{1/6} term is).** Σ_{q_m≤Q}|A^θ_m|² = (4/9)|Ŵ₁(1/6+iv)|²·Y^{−2/3}·M_σ(Q), with

    M_σ(Q) := Σ_{m∈O, 0<N(m)≤Q} |ρ_σ(−e₀m)|².

  The exceptional term of Prop 15.2 is (Q/Y)P_a^{1/6} = Q^{5/6}Y^{−2/3} (P_a = Y²/Q), with an explicit positive constant
  (`beat78-prop152-subtract.md` Prop 2.3). Identifying it with ‖A^θ‖² (that note's §5.1, labelled [H] there) is
  equivalent to **M_σ(Q) ≍ Q^{5/6}**. A theta supported only on e₀·(S-units)·(sixth powers), the n = 2 pattern, would
  instead give M_σ(Q) ≍ Q^{1/6}·(log Q)². So the relevant X^{5/6} is a row mean square of theta coefficients, not a
  first moment.
* **Correlation (what evaluating the block needs).** The subtraction/TRO route (`beat78-prop152-subtract.md` §6) needs

    Σ_m Ω(q_m/Q)ξ(m)(q_m/Q)^{−iv}·ρ_σ(−e₀m)·B^J_{m,σ}(Z),
    B_m = Σ_θ a_θ Σ_{A=cn³} γ₂(c)α(A)ν_σθ(A)χ_A(m)·(Mellin weight),

  i.e. the individual values ρ_σ(−e₀m), correlated against completed cubic rows. A mean square cannot supply it (that
  note, §6); a closed formula for ρ_σ at squarefree indices (a 6-fold Patterson identity) could.
* **First moments (columns).** F_σ(y; X) itself: exponent 2/3 per class (sextic) against 5/6 (cubic, Patterson). Over
  primes, the cubic first moment is ~ (6/5)c*X^{5/6}/log X [CITED: OAI 023, stated unconditionally, unrefereed,
  Lean-formalised by its authors; Dunn–Radziwiłł under GRH]; the sextic analogue would be X^{2/3}/log X.

**Restriction used here.** The paper's s-sum also contains non-squarefree s whose square part divides a power of m
(g_{χ_s}(s, −m) = 0 otherwise, since g(k, π^l) = 0 for (k, π) = 1, l ≥ 2 [PROVED, elementary]). All sums below use
squarefree moduli coprime to 6y ("stripped" at the primes of y). This changes ρ_σ(y) by local factors at the primes of y
and no exponent.

---

## 2. Implementation (exact symbols, normalised Gauss sums)

* **Arithmetic and symbols** (`tmp/sextic/zomega.py`). Elements a + bω; primary = a ≡ 1, b ≡ 0 (mod 3); split primes
  π = a + bω with b > 0 and conj(π); inert primes −q (q ≡ 2 mod 3, norm q²). χ_π(x) = the sixth root of unity ≡
  x^{(Nπ−1)/6} (mod π), computed exactly (O/π = F_p via ω ↦ −a/b, or F_{q²}). Composite symbols multiplicatively.
  Cubic = χ², quadratic = χ³. e(z) = exp(2πi Tr(z/λ)).
* **Prime Gauss sums** (`tmp/sextic/gauss6.c`). For each split p ≡ 1 (mod 6) the six sextic Gaussian periods
  η_t = Σ_i e(g^{6i+t}/π) (g a primitive root; e(x/π) = exp(−2πi·b·x/p) for rational x) by six multiplicative chains,
  with 32-bit fixed-point phases (error < 10⁻⁹ per term); then γ_j(π) = p^{−1/2} Σ_t ζ₆^{j·j₀·t}η_t, with χ_π(g) = ζ₆^{j₀}, and
  γ_j(conj π) = conj γ_j(π). Inert primes by direct summation over F_{q²}; all give γ_j(−q) = 1.
  Coverage: all 664,616 primary primes outside {2, λ} of norm ≤ 10⁷ (2 × 332,194 split prime ideals + 228 inert).
* **Squarefree moduli** (`tmp/sextic/build_table.py`). All squarefree primary n coprime to 6 with N(n) ≤ X, by
  γ_j(mπ) = (χ_m(π)χ_π(m))^j γ_j(m)γ_j(π) (CRT; the paper's proof of (4.7)) with χ_m(π) = R(π, m)χ_π(m) (Lemma 4.4).
  Index twists conj(χ_n(y)) by exponent propagation along the factor tree.
* **Fits** (`tmp/sextic/alib.py`). Partial sums on 90 geometric shells in [10³, X]; WLS on shell increments for
  F(X) = c·X^θ with the random-phase increment model Var = #terms (calibrated: random-phase surrogates reproduce the
  model se to 4%). Free exponents by profile χ² (Δχ² = 1 intervals). Empirical noise: the rms of fitted constants at
  indices where the residue vanishes (§6.1).

---

## 3. Verification of the machinery [EXACT / NUMERICAL] (`selftest.py`, log `selftest.log`)

All checks pass (`tmp/sextic/selftest.log`, `check_large_{A,B}.log`, `data/build_1e7.log`):

| id | identity (7/8 paper numbering) | data | max error |
|---|---|---|---|
| T1 | period tables = brute-force Gauss sums (complex-embedding e(z)), j = 1..5 | 40 primes | 9.1e-10 |
| T2 | Lemma 4.2: γ₂(p)³ = −α(p); γ₁γ₂ = conj(H(4))·γ₃γ₂³ (the printed H(4) fails by 1.73) | 551 primes, N ≤ 4000 | 3.0e-9 |
| T3 | Lemma 4.3: γ₃(p) = Γ(p) (four-term formula); Γ(p)² = χ_p(−1) | 551 primes | 1.1e-9 |
| T4 | Lemma 4.4: χ_b(a) = R(a, b)χ_a(b) | 7289 coprime pairs (primes and composites) | 6.0e-16 |
| T5 | γ_j(ab) = χ_a(b)^jχ_b(a)^jγ_j(a)γ_j(b) against brute force | 31 composites, j = 1, 2, 3 | 1.9e-9 |
| T6 | (4.7): γ₂³ = μα; γ₁γ₂ = μαG with G = conj(χ_c(4))γ₃ (without the bar: fails by 1.73) | same | 1.0e-13 |
| T7 | **γ₁(c) = G(c)·γ₂(c)²** on squarefree c (corollary of (4.7), used below) | 31 composites; all 2,822,619 nodes at 10⁷ | 1.2e-13; 5.5e-9 over all nodes (γ₂³ = μα: 7.7e-9) |
| T8 | Dunn–Radziwiłł normalisation g̃₃(n) = χ_n(λ)⁻²γ₂(n) (paper (5.10)) | 30 primes + 10 composites | 9.1e-10 |
| T9 | g̃_j(y, n) = conj(χ_n(y))^jγ_j(n), (y, n) = 1 | random y, j = 1, 2 | 3.0e-12 |
| T10 | agreement with the independent C code `tmp/cubic-r2-2-gauss.c` | 4000 primes | 1.3e-9 |
| large | brute force at p = 1000003, 3964531, 7099969, 7100017, 8542711, 9999991 | j = 1, 2, 3 | 7.4e-10 |
| tree | cross symbol via reciprocity = direct product of prime symbols | 2264 random nodes | 0 mismatches |

Inert primes: γ_j(−q) = 1 for all j and all q ≤ 3163 (pure Gauss sums).

**Error model.** Random-phase surrogates on the same support give sd(ĉ) = 0.00504 against the model se 0.00523 (cubic
index 1, 10⁶). The model se is the right scale for the sextic sums (empirical noise from vanishing indices = 0.85 × model
se, §6.1). It is conservative for the cubic sums, whose partial sums fluctuate several times less than a random walk:
the index-law residuals of §4 scatter 4–6× below the model se.

---

## 4. Calibration on the cubic case (norm ≤ 10⁷) [NUMERICAL] (`calib_cubic.py`, log `calib_cubic_1e7.log`)

Normalisation g̃₃ (Dunn–Radziwiłł; T8). Moduli: all primary primes / squarefree moduli outside {2, λ}.

| check | target | measured |
|---|---|---|
| C1 prime first moment | Σ_{N(π)≤X} g̃₃(π) ~ (6/5)c*X^{5/6}/log X, c* = (2π)^{2/3}/(3Γ(2/3)) = 0.838189 [CITED: OAI 023 comparator `patterson_firstMoment`, sum over all primary primes; Dunn–Radziwiłł prove it under GRH]; the cited angular comparison makes c*·Σ N(π)^{−1/6} the natural model | S(10⁷) = 45659 vs model 46283: ratio 0.9865 ± 0.0125; shell fit over [10³, 10⁷]: **κ = 0.9878 ± 0.0122** (target 1). Against the cruder (6/5)c*X^{5/6}/log X the ratio is 1.074 (the expected Li-type 1/log X correction) |
| C2 angular modes | Σ (π/\|π\|)^ℓ g̃₃(π) = o(X^{5/6}/log X), ℓ ≠ 0 [CITED, same source] | \|sum\|/model ≤ 0.020 for ℓ = ±2, ±3, +1; ℓ = −1: −0.0424 (3.4σ), down from −0.0747 at 10⁶ (ratio 0.57 ≈ 10^{−1/6}): an X^{2/3}/log X component. By γ₂³ = μα and γ₁ = Gγ₂², the ℓ = −1 mode is −Σ χ_π(λ)⁻²G(π)conj(γ₁(π)), a twisted sextic prime sum; §5.5 finds its X^{2/3}/log X bias |
| C3 equidistribution (Heath-Brown–Patterson) | Weyl sums mean g̃₃(π)^k → 0 [RECALLED: HBP 1979] | k = 1: 0.0687 (the bias c*N^{−1/6} on average; 0.103 at 10⁶, ratio 0.67 ≈ 10^{−1/6}); k = 2: 0.0030; k = 3..6: ≤ 0.0014 (noise 0.0012). The arguments are equidistributed with a bias decaying like X^{−1/6} (12-bin histogram ratio max/min 1.30 at 10⁷, 1.48 at 10⁶) |
| C4 squarefree first moment | Σ_{N(n)≤X} g̃₃(n) = C₁X^{5/6} + o [RECALLED: Kubota–Patterson, residue at 4/3 unnormalised] | free exponent **0.8330 [0.8290, 0.8370]**; C₁ = 0.28389 ± 0.00242 (χ² at 2/3 worse by 2322) |
| C5 Patterson's evaluation | index-r constant ∝ conj(g̃₃(r))N(r)^{−1/6} at squarefree r [CITED: 7/8 paper (5.9), from Patterson Thm 8.1 via DR] | zero-parameter law **ĉ(r) = ĉ(1)·conj(g̃₃(r))·N(r)^{−1/6}·N(r)/(N(r)+1)** (stripped series; N/(N+1) = the density of non-multiples of π among squarefree moduli): over all 160 primes with N ≤ 967, rms deviation 0.0049, max 0.0118 (model se 0.023); on 10 products π₁π₂ (N ≤ 3139) the ratio to the product law is 0.986–1.007. The unconjugated candidate gives random phases (\|mean\| 0.066) |
| C6 row mean square | Σ_{N(r)≤Q}\|ĉ(r)\|² ≍ Q^{2/3} (\|τ\| ≍ 1 on squarefree indices) | slope **0.675** over Q ∈ [20, 300] |
| vanishing | theta coefficient 0 at v_π = 2 (DR support (5.2): indices uλ^k n b³) | index π²: mean z² = 0.10 over 60 primes (pure noise would give 1) |

**Calibration verdict.** Every cited or recalled cubic statement that was tested is reproduced: the OAI 023 / Dunn–Radziwiłł
constant to 1.2%, Patterson's coefficient formula at squarefree indices with no free parameter to 0.5% rms, the 5/6
exponent to ±0.004, equidistribution, the vanishing pattern, and the mean-square exponent. The same code, applied to
γ₁, is used below.

---

## 5. Sextic first moments (norm ≤ 10⁷) [NUMERICAL] (`sextic_moments.py`, log `sextic_moments_1e7.log`)

### 5.1 Arguments at primes

By T7, γ₁(π) = G(π)γ₂(π)² with G of finite order (12th roots of unity on classes mod 4), so equidistribution of
arg γ₁(π) follows from the k = 2, 4 Weyl sums of γ₂ (Heath-Brown–Patterson type statement; RECALLED). Measured over all
664,616 primes: mean γ₁(π)^k = +0.0040, −0.0002, −0.0004, +0.0008, −0.0006, +0.0010 for k = 1..6 (noise 0.0012). The
12-bin histogram is flat to 1.6%. The k = 1 value (3.3σ) is the trace of the per-class prime bias of §5.5.

### 5.2 Per-class first moments over squarefree moduli

Classes: n mod 4 (12 unit classes) × n mod 9 (9 primary classes) = 108 classes, ≈ 26,100 moduli each. S0: χ_n(ω),
χ_n(λ) and G(n) are constant on these classes; χ_n(−2) takes two values (its quadratic part needs n mod 8).

| quantity | value |
|---|---|
| Σ over 108 classes of z² (z = \|ĉ\|/se at exponent 2/3) | **1393**, null (random phases) 107 |
| leading class n ≡ 1 (mod 4), n ≡ 1 (mod 9) | ĉ = 0.0521 ± 0.0032 (z = 16.5); free exponent **0.696 [0.671, 0.722]**; χ² at 1/2, 2/3, 5/6 = 214.3, 148.7, 169.9 (dof 138) |
| next five classes (z = 5.9–7.0) | free exponents 0.66, 0.74, 0.74, 0.68, 0.63 (±0.05–0.07) |
| joint common exponent, 14 classes with z > 5 | **0.6830 [0.6690, 0.6970]** (Kubota value 1/2 + 1/6 = 0.6667) |
| all classes together | ĉ = 0.184 ± 0.032 (z = 5.7), exponent 0.689 [0.636, 0.750] |

The sextic main term per class has exponent 2/3, not the cubic 5/6, and not 1/2. This confirms and sharpens
`beat78-prop152-subtract.md` §5.3 (there: per-class 0.61–0.70 at 3·10⁵). At 10⁶ the leading-class exponent was still
undetermined (0.572 [0.507, 0.640]); 10⁷ is needed.

### 5.3 S-unit indices

Over all moduli, the index-y first moment for the 216 classes y = ζ₆^i λ^j (−2)^k: 50 of 216 have z > 4,
Σ z² = 2724 (null 432). Strongest: y = −λ⁴ (ρ = 0.383 ± 0.032, z = 11.9), −λ⁴(−2) (z = 10.5), −λ⁴(−8) (9.1), −2 (8.8),
4 (8.0); index 1 has z = 5.7. The weights by λ-exponent and by 2-exponent are uneven (λ⁴ and (−2)^{0,1} strongest,
(−2)⁵ almost absent: Σz² = 15). This is the S-local support of the sextic theta in this normalisation.

### 5.4 The paper's indices −e₀ (S = {2, λ})

e₀ = u₀(−2)^{2t−1}λ⁵. Per class σ mod 4 (the paper's T, mod 12): z = 1.3–4.8; summed over σ: z = 2.5–4.5. t = 1 and
t = 2 give identical \|ρ_σ\| because χ_n(4) is constant on classes mod 4 [PROVED: χ_n(4) = (n/−2)₃² depends on n mod 2].
The column sum at m = 1 carries a weak theta residue. The mean over m (§7) is what matters.

### 5.5 Prime first moment of the sextic Gauss sums

Per-class model c·Σ_{π∈class} N(π)^{θ−1} (the X^θ/log X analogue). Over 108 classes Σz² = 385 at θ = 2/3 (null 105);
total χ² 8745 / 8582 / 8605 at θ = 1/2, 2/3, 5/6. Leading class (again n ≡ 1 mod 4, ≡ 1 mod 9): z = 7.5 and free
θ = **0.705 [0.665, 0.750]**, constant 13.25 ± 1.77 in Σ γ₁(π) ≈ c·Σ N(π)^{−1/3}. So sextic Gauss sums at primes carry a
per-class bias of order X^{2/3}/log X, the sextic analogue of Patterson's X^{5/6}/log X. It cancels between classes
(all-class Weyl mean 0.004). No source read here states this; it is a measurement, not a theorem.

**Answer to "X^{5/6} or smaller?" for the first moments.** The sextic first moments are of order X^{2/3} per class
(squarefree moduli) and X^{2/3}/log X per class (primes). These are smaller than the cubic X^{5/6} and X^{5/6}/log X by
X^{1/6}. X^{5/6} is the order of the row mean square (§7), not of a first moment.

---

## 6. Structure of the sextic theta coefficients (norm ≤ 10⁷) [NUMERICAL]

Logs: `sextic_theta_1e7.log`, `prime_index_law_1e7.log`, `product_law_1e7.log`. Base index y_S = −λ⁴, the strongest
S-unit index (§5.3). ρ(y) is the X^{2/3} constant of the index-y first moment over all residue classes of squarefree
moduli coprime to 6y. A stripped series S_e(π) means index y_S·π^e with moduli coprime to π.

### 6.1 Prime-power indices: what the local theory fixes

The transfer relation D(p^e) = S_e + β_e X^{e+1} S_{e*}, with e* ≡ −e − 2 (mod 6) and β_e ∝ g_{e+1}(p)/q
(`cubic-r2-conductor-verdict.md` §2.2, = DIPP Lemma 4.2.2 [CITED there]), pairs the exponents as (0, 4) and (1, 3). It
leaves 2 self-paired and 5 alone. The local theta theory then fixes some coefficients in terms of others [RECALLED:
Kazhdan–Patterson periodicity; not re-derived]. Measured at 36 primes with N ≤ 160:

| exponent e | mean z² of ρ(y_S π^e) (noise = 1) | finding |
|---|---|---|
| 5 | **0.72** (60 primes; cubic analogue e = 2: 0.10) | **vanishes**. The empirical noise from these fits is 0.85 × model se |
| 4 | 2.7 | small, \|ρ(y_Sπ⁴)/ρ(y_S)\| ≈ 0.07 (median); partial phase alignment 0.60 with conj(γ₁(π))χ_π(y_S)⁴ (99% null 0.48) |
| 3 | 11.6 | **determined by e = 1:** ρ(y_Sπ³) = ρ(y_Sπ)·conj(γ₂(π))·χ_π(y_S)²·N(π)^{−1/6}·r, with phase alignment **0.997** (23 primes; 99% look-elsewhere null 0.61) and r = 1.05 (coefficient of variation 0.10) |
| 2 | 22.0 | self-paired; best Gauss-sum phase alignment 0.54 (99% null 0.48) |
| 1 | 40.1 | **no Gauss-sum law**: best alignment over 232 local candidates (γ₂^a χ_π(y_S)^b α^c G^d, 77 primes) is 0.50 against a 99% look-elsewhere null of 0.37; the stripped version (36 primes, 108 candidates) gives 0.55 against 0.48. Partial, not a law |
| 0 | 139 | base |

The (1, 3) relation is the 6-fold analogue of Patterson's cubic relation. The cubic Gauss sum γ₂(π) enters as the
transfer coefficient β₁ ∝ g₂(π) predicts, and the magnitude scales as N(π²)^{−1/12}. So the machinery sees the local
theory exactly where the theory fixes the coefficients. The e = 1 coefficients (squarefree type) are not given by any
Gauss-sum expression tested, which is the expected numerical face of Kazhdan–Patterson non-uniqueness.

### 6.2 Prime indices: a dominant 3-adic class component

u(π) := ρ(y_Sπ)/ρ(y_S), for 235 primes with N(π) ≤ 1500. Class laws u(π) = h(class of π)·N(π)^{−κ} were fitted on the 77
primes with N ≤ 400 and tested on the 158 held-out primes with 400 < N ≤ 1500:

| base y_S | law | held-out fraction of power explained | held-out χ²/(2n) (noise = 1) | random-phase null (median / 99%) |
|---|---|---|---|---|
| −λ⁴ | h(π mod 9), κ = 0.13 | **0.749** | 2.44 | −0.12 / −0.02 |
| −λ⁴ | h(π mod 4) | 0.187 | 7.9 | |
| −λ⁴ | h(χ_π(y_S)) | 0.156 | 8.2 | |
| −λ⁴(−2) | h(π mod 9) | 0.465 | 5.4 | −0.12 / −0.03 |
| −λ⁴(−8) | h(π mod 9) | −0.01 | 6.9 | −0.24 / −0.08 |
| −2 | h(π mod 9) | 0.258 | 4.2 | −0.10 / 0.00 |
| cubic control, Patterson u₃(π) | h(π mod 9) | 0.182 | 593 | −0.05 / 0.00 |

At 10⁶ (fit N ≤ 150, held out 150 < N ≤ 400) the same −λ⁴ law explained 0.842 with held-out χ²/(2n) = 0.90, i.e. it
was exact within the larger noise. At 10⁷ the residual is resolved: 2.4 × noise.

Reading:
* For the purely 3-adic base −λ⁴, about three quarters of the prime-index coefficient is a function of π mod 9. Its
  phase does not involve any Gauss sum at π, in contrast to the cubic case, where the same test fails completely
  (χ²/(2n) = 593) because Patterson's coefficient carries conj(g̃₃(π)).
* The rest is an irregular component, resolved only at 10⁷.
* For bases with a 2-adic part the mod-9 law is weaker. The 2-adic class (mod 4 or mod 8) presumably enters; finer class
  laws could not be cross-validated with 77 fit primes.
* The fitted h for −λ⁴ is real at the self-conjugate classes, conj-symmetric under π ↦ π̄, and vanishes at
  π ≡ 4 (mod 9) (h = 0.02). Write π ≡ 1 + 3(t₀ + t₁ω) (mod 9) and ψ_{st}(π) = ω^{s t₀ + t t₁}. Then the Fourier
  transform of h on (O/9)^×_primary ≅ (Z/3)² is concentrated on four characters with nearly equal moduli 0.43–0.45:
  ψ₀₀, ψ₀₁, ψ₁₂ and ψ₂₀ (the last two with phases ±0.63·π/3). The other five are ≤ 0.04. The class values are
  h = 1.55, 0.67e^{−0.49iπ/3}, 0.43e^{−1.16iπ/3}, 0.02, 0.43e^{+1.16iπ/3}, 1.02e^{−1.61iπ/3}, 1.12, 1.02e^{+1.61iπ/3},
  0.67e^{+0.49iπ/3} for (t₀, t₁) = (0,0), (0,1), (0,2), (1,0), (1,1), (1,2), (2,0), (2,1), (2,2).

Whether this reflects a closed form (for instance λ-adic local Whittaker data evaluated at the index y_Sπ) is not
settled here. It is an empirical regularity [NUMERICAL], not found in the sources read, and it is not exact at 10⁷.

### 6.3 Products of two primes

925 pairs (N(π_i) ≤ 200), base −λ⁴, half-split cross-validation:

* **Twisted multiplicativity** u(π₁π₂) = s·u(π₁)u(π₂)·(χ_{π₁}(π₂)χ_{π₂}(π₁))^j explains at most 4% for any j (null 99%: 1%).
  The cubic theta satisfies its analogue to 1.4% (§4, C5 products).
* A class law in the class of π₁π₂ mod 9 explains 45% (held-out χ²/(2n) = 4.9). Laws on the pair of classes, with or
  without the cross symbol, explain 35–39%.

So squarefree-index coefficients are not determined by prime-index ones in any of these ways.

---

## 7. The needed mean [NUMERICAL]

M(Q) := Σ_{σ mod 4} Σ_{m∈O, 0<N(m)≤Q} |ρ_σ(−e₀m)|², with e₀ = (−2)λ⁵ and units absorbed by m. It is computed from 1074 indices × 12
classes and corrected for noise bias by subtracting Σ se² (model) or (0.85·se)² (empirical); `sextic_theta_1e7.log`:

| Q | #m | Σ\|ρ̂\|² | model noise bias | corrected | empirical-noise corrected |
|---|---|---|---|---|---|
| 12 | 42 | 0.425 | 0.041 | 0.384 | 0.395 |
| 25 | 90 | 0.730 | 0.087 | 0.643 | 0.668 |
| 50 | 186 | 1.269 | 0.179 | 1.090 | 1.141 |
| 100 | 366 | 2.452 | 0.351 | 2.101 | 2.201 |
| 200 | 732 | 4.466 | 0.704 | 3.763 | 3.963 |
| 300 | 1074 | 6.504 | 1.033 | 5.471 | 5.766 |

* Log-log slope over Q ∈ [50, 300]: **0.894** (model-corrected), 0.898 (empirical), 0.907 (raw).
* Local slopes on successive doublings are 0.70, 0.76, 0.95, 0.84, 0.93. Per-class slopes are 0.76–1.05.
* Cubic control (§4, C6): 0.675 against 2/3.

Reading:
* **The row mean square is dense.** A theta supported on e₀·(S-units)·(sixth powers), the n = 2 pattern, would give a
  slope ≤ 0.3. The measured 0.89 is close to the 5/6 that the identification "exceptional term = ‖A^θ‖²" requires
  (§1.2). The excess over 5/6 is of the size of the local-slope scatter. It is consistent with the flat prime-index
  magnitudes of §6.2 (κ ≈ 0 to 0.13 rather than 1/12) at these small norms.
* So the P_a^{1/6} term of Prop 15.2 is numerically the norm of a dense sextic theta component evaluated along the coset
  −e₀O. This supports, at the level of exponents, the heuristic §5.1 of `beat78-prop152-subtract.md`.
* t = 2 (e₀ = −8λ⁵) gives identical values (§5.4).

---

## 8. What this means for the P_a^{1/6} lever

* **Evaluation needs individual coefficients.** Removing or reducing the term through the subtraction/TRO route needs
  Σ_m ρ_σ(−e₀m)·(completed cubic row B_m), i.e. the individual values ρ_σ(−e₀m) at squarefree (and general) m (§1.2).
  The numerics give the following.
  * At prime-power exponents 3 and 5 the coefficients are fixed by the local theory (§6.1). This is the part a 6-fold
    Patterson identity would cover, and it is not where the squarefree indices live.
  * At exponent 1 (prime indices) there is no Gauss-sum law. About 75% of the coefficient is a 3-adic class function
    (for the 3-adic base), with an irregular remainder at 2.4 × noise (§6.2).
  * At products neither twisted multiplicativity (≤ 4%) nor class laws (≤ 45%) determine the coefficient (§6.3).

  **So no evaluation formula for ρ_σ(−e₀m) at squarefree m is visible in the data, and none is claimed.** A formula of
  Patterson type (Gauss sum × N^{−κ} × local factor) is ruled out at prime indices by the alignment tests. The best
  alignment, 0.50, is far from the near-1 that the cubic law gives (calibration rms 0.5%).
* **The term is genuine and dense.** The needed mean square grows like Q^{0.89} (§7), consistent with Q^{5/6}. With
  Prop 2.3 of the subtract note (exact positive constant) and Theorem C of the restrict note, this leaves no room for the
  term to be an overestimate. The numerics confirm it by a separate route: theta residues are extracted from column
  first moments, not from the Gram expansion.
* **The model prizes are unchanged** (`beat78-synthesis.md` §3): θ ≈ 0.87393 for a 10% reduction, ≈ 0.8636 for full
  removal, Λ price ≈ 0.003 per 0.01 of θ. Neither is reachable from these results.

**Precise obstruction (numerical form).**
* A 6-fold Patterson-type identity would have to express the e = 1 sextic theta coefficients through local data.
* Measured at 10⁷:
  * these coefficients have no Gauss-sum phase law (alignment ≤ 0.50 over 232 candidates);
  * they carry a dominant but inexact 3-adic class component (75% of held-out power, residual 2.4 × noise);
  * they do not compose multiplicatively at products (≤ 4%).
* The local theory itself is reproduced where it applies:
  * e = 5 vanishes;
  * e = 3 follows from e = 1 through the cubic Gauss sum at 0.997 alignment;
  * the cubic calibration matches Patterson's formula to 0.5%.
* So the missing ingredient is global, not local. Kazhdan–Patterson non-uniqueness [RECALLED] is consistent with every
  measurement here.

**Leads, none started.**
1. Explain the four-character structure of h (§6.2). One test is to compute λ-adic Whittaker data of the 6-fold theta at
   index y_Sπ. If the class component is exactly a finite sum of Hecke characters of conductor 9, the irregular
   remainder is the genuinely non-local part, and its size bounds what any formula can capture.
2. Repeat §6.2 with 2-adic class refinement (mod 8 × mod 9). This needs more primes per class, i.e. N(π) up to ~10⁴
   (about 1,250 primes, ~10 min at 10⁷).
3. Extend X: 3·10⁷ costs ~9× the 10⁷ Gaussian-period time (~4.5 CPU-hours) for a 1.2× gain in signal-to-noise. This is
   low value unless lead 1 needs it.
4. A direct toy computation of the correlation Σ_m ρ_σ(−e₀m)B_m with a small completed cubic row would test TRO
   numerically. It was not attempted.

**Λ.** Unchanged. No θ < 7/8 is obtained, and the Raymond chain was not run. PT Λ ≤ 0.2 stands, RH is open, NO QED.

---

## 9. Reproduction

All in `tmp/sextic/`. Run with `../../.venv-arb/bin/python` from that directory (`run_all.sh` lists the sequence).

| file | content | runtime |
|---|---|---|
| `gauss6.c` → `gauss6` | sextic Gaussian periods: split primes (6 chains, 32-bit phases) and inert primes | 45 s to 10⁶; ~35 min wall × 2 processes for (10⁶, 10⁷] |
| `data/split_*.bin`, `data/inert_3163.bin` | periods for all 332,194 split p ≡ 1 (6) ≤ 10⁷ and 228 inert q ≤ 3163 (144-byte records) | |
| `zomega.py` | Z[ω], symbols, prime objects, brute-force Gauss sums, vectorised symbols | library |
| `selftest.py` → `selftest.log` | T1–T10 | ~60 s |
| `check_large.py` → `check_large_{A,B}.log` | brute force at six primes up to 9,999,991 | ~20 s |
| `build_table.py` → `data/sf_1e{6,7}.npz` | all squarefree moduli (282,269 / 2,822,619) with γ₁, γ₂, γ₃ and the factor tree | 1 s / 10 s |
| `alib.py` | partial sums, binned shells, WLS fits, profile χ², surrogates | library |
| `calib_cubic.py` → `calib_cubic_1e{6,7}.{log,json}` | §4 | 15 s / 3 min |
| `sextic_moments.py` → `sextic_moments_1e{6,7}.{log,json}` | §5 | 1 s / 9 s |
| `sextic_theta.py` → `sextic_theta_1e{6,7}.{log,json}` | §6.1, §6.2 (first part), §7 | 7 s / 2.5 min |
| `prime_index_law.py` → `prime_index_law_1e{6,7}.{log,json}` | §6.2 class laws with held-out validation, cubic control | 7 s / 2 min |
| `product_law.py` → `product_law_1e{6,7}.{log,json}` | §6.3 | 4 s / 1 min |

Peak memory per process is below 1.5 GB, with at most two heavy processes at a time.

---

## 10. Status of each claim

| claim | status |
|---|---|
| Machinery: symbols, γ_j, twisted multiplicativity, (4.7) with bars, γ₁ = Gγ₂², DR normalisation | EXACT (finite identities) / NUMERICAL ≤ 10⁻⁸ (§3) |
| Column sum of Prop 15.2 = class-σ Kubota first moment at index −e₀m; P_a^{1/6} term ⟺ M_σ(Q) ≍ Q^{5/6} under the theta identification | PROVED-rel (§1.1, partial summation; e₀ from the subtract note's Lemma 2.2); the identification itself is [HEURISTIC] (subtract note §5.1) |
| t = 1, 2 give identical \|ρ_σ\| on classes mod 4 | PROVED (§5.4) |
| Cubic: prime first moment = cited OAI 023 / DR constant (κ = 0.988 ± 0.012); exponent 0.833 ± 0.004; Patterson's formula with factor N/(N+1) to 0.5% rms; vanishing at π²; mean-square slope 0.675 | NUMERICAL (calibration of CITED / RECALLED statements) |
| Sextic first moments: exponent 0.683 [0.669, 0.697] per class; prime sums biased at X^{0.705 [0.665, 0.750]}/log X per class; arguments equidistributed | NUMERICAL |
| Sextic theta: vanishing at e = 5; (1, 3) relation through conj(γ₂(π))χ_π(y_S)²N^{−1/6} | NUMERICAL (the local theory behind it RECALLED) |
| No Gauss-sum law at prime indices; dominant inexact 3-adic class component (75% held-out); no twisted multiplicativity at products | NUMERICAL (cross-validated, look-elsewhere-corrected nulls) |
| Needed mean square slope 0.89 over Q ∈ [50, 300] (dense; sparse alternative excluded) | NUMERICAL |
| Any θ < 7/8, any Λ bound | **none** |
