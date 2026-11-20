# b-escape-law: the route-43 escape law, decided

Date 2026-11-16. Slug `b-escape-law`. Scope: route 43 (`src/data/route-43-flow-criticality-classes-2026-10-14.js`,
`formalization/paper/flow-criticality-grading.md` section 7).

Labels: PROVED (argument written here, internal, unrefereed), CLASSICAL (cited standard result), MEASURED (numerics,
not interval-certified), OPEN.

## 0. Verdict

The escape law is TRUE for every τ > 0, and in a sharper form than route 43 conjectured.

* **Statement decided.** Escape law EL(τ): the zeros of H_{−τ} are contained in no horizontal strip, Y(−τ) = ∞.
* **Theorem A (PROVED, internal).** For every τ > 0, EL(τ) holds. More precisely the zeros of H_{−τ} at large height
  are the images, under an explicit near-affine map z ↦ s_eff(z), of the zeros of one fixed entire almost periodic
  Dirichlet series

      D_τ(s) = Σ_{n≥1} exp(−(τ/4) log² n) n^{−s}
      ( = E ζ(s + iV), V ~ N(0, τ/2), for Re s > 1; for Re s < 1 up to the pole term of size e^{((σ−1)² − t²)/τ} ),

  and  limsup_{|Re ρ|→∞} ( |Im ρ| − (τ/2) log(|Re ρ|/4π) ) = 2σ⁺(τ) − 1,  σ⁺(τ) := sup{Re s : D_τ(s) = 0} ∈ (−∞, σ₁(τ)].
  A positive lower density (≥ c(τ, Y)·X up to height X) of zeros lies outside any strip |Im z| ≤ Y.
* **Numerics (MEASURED).** Zeros of H_{−τ} outside the critical strip (|Im z| > 1) and outside the QRH strip
  (|Im z| > 3/4) located directly for τ = 0.25, 0.2, 0.15, 0.1 (all < 9/32), by Arb zeta + Gaussian convolution,
  each box cross-checked by boundary winding number and independent 160-bit re-evaluation. This is the regime the
  route-43 referee flagged as untested.
* **Consequence.** The binary class "flow-critical at ξ but not RH-strength" is non-empty unconditionally: it
  contains every height-uniform strip statement (the Re s = 1 zero-free line, de la Vallée Poussin/Vinogradov–Korobov
  regions, QRH 7/8) and every o(T) zero-density statement. Binary flow-criticality therefore tests only uniformity
  in height; it does not grade strength. Flow-stable hypotheses are blind not only to RH but to every horizontal
  strip, including the prime-number-theorem line. No hypothesis of strip or density type reaches Λ = 0; the cap is
  κ(P), unchanged from route 43. No Λ bound moves. RH open. No QED on RH.

What is new relative to the atlas and walls: the atlas (PR #27 section 5, 12) and route 43 treat backward flow
qualitatively; route 43 left EL conditional with a heuristic reach τL/2 − 1 and "density open". Here EL is proved,
the reach constant is identified (2σ⁺(τ) − 1, not −1), the zero set is identified with that of D_τ, and the
area-density 1/(4πτ) is measured. Literature: one standard web search found no statement about zeros of H_t for
t < 0 beyond Rodgers–Tao's Λ ≥ 0; novelty against the literature is not claimed.

## 1. Setup and the precise escape law

H_t(z) = ∫_0^∞ e^{tu²} Φ(u) cos(zu) du, H_0(z) = ξ(1/2 + iz/2)/8, ∂_t H = −∂_z² H, Λ(H_t) = Λ − t.
F := H_{−τ}, τ > 0. Since e^{−τu²} cos(zu) = E cos((z − W)u), W ~ N(0, 2τ):

    F(z) = ∫_ℝ H_0(z − u) G_τ(u) du,   G_τ(u) = (4πτ)^{−1/2} exp(−u²/4τ).                      (1.1)  CLASSICAL

F is even, real on ℝ, entire of order 1. Zeros come in quadruples ±ρ, ±ρ̄; it suffices to study the closed lower
half-plane z = x − iη, η ≥ 0, x → +∞. Notation: s_z := (1 + iz)/2 = (1+η)/2 + ix/2, L := log(x/4π).

    J_0(w) := (1/16) s(s−1) π^{−s/2} Γ(s/2) at s = (1+iw)/2      (so H_0(w) = J_0(w) ζ(s)),
    g := log J_0,   g'(w) = (i/2)[1/s + 1/(s−1) − (1/2) log π + (1/2) ψ(s/2)] = (i/4) log(s/2π) + O(1/|s|),
    T♯(z) := J_0(z) exp(τ g'(z)²),
    s_eff(z) := (1+iz)/2 + iτ g'(z)  =  (1+η)/2 − τL/4  +  i(x/2 − πτ/8)  +  O(τ(1+η)/x).           (1.2)

**EL(τ)** (route 43, "CONDITIONAL" line): for every Y < ∞, H_{−τ} has a zero with |Im z| > Y.
Route 43 needs EL(τ) for arbitrarily small τ > 0 (τ < 1/2 for the critical strip, τ < 9/32 for QRH 7/8); for
τ > 1/2 zeros outside |Im z| ≤ 1 are already forced by Y(−τ) ≥ √(2τ) (Lemma G1d + Rodgers–Tao), which never gives
Y(−τ) = ∞.

## 2. Proof of Theorem A

### Lemma 1 (exact Dirichlet form). PROVED
For τ > 0, every z ∈ ℂ and every κ₀ > 1:

    F(z) = Σ_{n≥1} T_n(z),    T_n(z) := ∫_{Im w = −κ₀} J_0(w) n^{−(1+iw)/2} G_τ(z − w) dw,              (2.1)

absolutely convergent, T_n independent of κ₀ > 1.

Proof. In (1.1) substitute w = z − u and move the line of integration to Im w = −κ₀: H_0 is entire and bounded on
horizontal strips, G_τ(z − w) has Gaussian decay in Re w, so Cauchy applies. On Im w = −κ₀, Re s = (1+κ₀)/2 > 1 and
H_0(w) = J_0(w) Σ n^{−s}; Σ_n n^{−(1+κ₀)/2} ∫ |J_0||G_τ| < ∞ gives Fubini. J_0 is analytic for Re s > −2, hence
independence of κ₀. ∎

(Equivalently T_n(z) = e^{−(τ/4) log² n} n^{−(1+iz)/2} J_τ(z − iτ log n) with J_τ = J_0 * G_τ. For τ = 0 the
single sum diverges inside the strip; for τ > 0 it is exact everywhere and no reflected sum is needed.)

### Lemma R (reduction to D_τ). PROVED (constants not tracked) + MEASURED
Fix τ > 0 and a ∈ ℝ. There are C, r₀ such that for all z with Im z < 0, |z| ≥ r₀ and σ(z) := Re s_eff(z) ≥ a:

    | F(z)/T♯(z) − D_τ(s_eff(z)) |  ≤  C log²|z| / |z|.                                              (2.2)

Proof. Let ℓ = log n, b_n = e^{−τℓ²/4}. On the segment [z, w] put R(w) := g(w) − g(z) − g'(z)(w − z), so
J_0(w) = J_0(z) e^{g'(z)(w−z)} e^{R(w)}.

(i) Main term. Replacing e^{R} by 1 in (2.1) gives an entire integrand; moving the line to real u = z − w and using
∫ e^{cu} G_τ(u) du = e^{τc²} with c = −g'(z) + iℓ/2:

    M_n = J_0(z) n^{−(1+iz)/2} exp(τ(−g' + iℓ/2)²) = T♯(z) · b_n · n^{−s_eff(z)}.     (exact algebra)

Hence Σ_n M_n = T♯(z) D_τ(s_eff(z)).

(ii) Error term. E_n := T_n − M_n = ∫_{Im w=−κ₀} J_0(z) e^{g'(z)(w−z)} (e^{R(w)} − 1) n^{−(1+iw)/2} G_τ(z−w) dw.
Write z − w = v + i(κ₀ − η), v real. Taking absolute values,

    |E_n| / |T♯(z)| ≤ n^{−(1+κ₀)/2} · exp( (κ₀ − η + 2τ Im g')² / 4τ ) · ε(z),
    ε(z) := e^{−τ(Re g')²} ∫ e^{−v Re g'} |e^{R} − 1| G_τ(v) dv.

Since σ = (1+η)/2 − τ Im g'(z), the exponent is exactly (κ₀ − (2σ − 1))²/4τ. Choose κ₀ := max(2, 2σ − 1); then the
exponential is ≤ exp((3 − 2a)²/4τ) ∨ 1, and κ₀ − η = κ₀ − (2σ−1) − 2τ Im g' = O(1 + log|z|).
g''(ω) = −(1/4)[−1/s² − 1/(s−1)² + (1/4)ψ'(s/2)] = O(1/|ω|) for Re s ≥ 1 (CLASSICAL: ψ'(s) = O(1/|s|) in Re s ≥ 1/2);
the segment [z, w] stays in Re s ≥ 3/2 (both endpoints have Re s ≥ 3/2 once |z| is large, because
η = 2σ − 1 + 2τ Im g' → ∞). For |v| ≤ |z|/2: |R| ≤ C(v² + log²|z|)/|z|, so that part of ε is ≤ C log²|z|/|z|
(|Re g'| ≤ π/8 + o(1) is bounded). For |v| > |z|/2 use |J_0(w)| ≤ C(κ₀) and |J_0(z)|^{-1} ≤ e^{π|z|/8}|z|^{C}
against G_τ(v) ≤ e^{−|z|²/16τ}: negligible. Summing over n with Σ n^{−(1+κ₀)/2} ≤ ζ(3/2) gives (2.2). ∎

Remark (uniformity down to the real axis). With κ₀ = 1 + δ the same computation gives the bound
C_δ (log²|z|/|z|) exp((1 + δ/2 − σ)²/τ) for all σ; relative to the typical size e^{σ²/τ} of D_τ at σ < 0 this is
≲ x^{−1/2+δ} on 0 ≤ η. So D_τ ∘ s_eff models F on the whole half-plane up to the real axis (MEASURED below at η = 0).

### Lemma D (the model function). PROVED / CLASSICAL
(a) D_τ is entire of order ≤ 2: |D_τ(σ+it)| ≤ Σ b_n n^{−σ} ≤ C exp((|σ|+1)²/τ). PROVED.
(b) D_τ has infinitely many zeros. Proof: otherwise D_τ = Q e^{P} with a polynomial Q and deg P ≤ 2 (Hadamard,
    CLASSICAL). On the real axis D_τ(σ) = 1 + b_2 2^{−σ}(1 + o(1)) → 1 as σ → +∞, which forces P and Q constant
    and D_τ ≡ 1, contradicting b_2 ≠ 0. PROVED.
(c) D_τ is uniformly almost periodic in every strip a ≤ σ ≤ b (absolutely convergent Dirichlet series; Bohr,
    CLASSICAL): for every ε > 0 the set {T : sup_{a≤σ≤b, t} |D_τ(s + iT) − D_τ(s)| < ε} is relatively dense.
(d) σ⁺(τ) := sup{Re s : D_τ(s) = 0} is finite, σ⁺ ≤ σ₁(τ) where Σ_{n≥2} b_n n^{−σ₁} = 1 (triangle inequality), and
    for every ε > 0, inf{|D_τ(s)| : Re s ≥ σ⁺ + ε} > 0. Proof of the last claim: if D_τ(s_k) → 0 with
    Re s_k ∈ [σ⁺+ε, σ₁+1], the translates D_τ(· + i Im s_k) form a normal family on Re s > σ⁺; a limit function is a
    non-zero Dirichlet series with a zero in the open half-plane, and Hurwitz gives zeros of D_τ with Re s > σ⁺. PROVED.
(e) The coefficients e^{−(τ/4) log² n} are not multiplicative for any τ > 0 (b_4 ≠ b_2²): D_τ has no Euler
    product. PROVED (trivial).

### Theorem A. PROVED (internal)
Fix τ > 0.
(i) (escape) Let s₀ = σ₀ + it₀ be a zero of D_τ and 0 < r < 1 with D_τ ≠ 0 on |s − s₀| = r, m := min there. For
    every T in the relatively dense set of Lemma D(c) with tolerance m/3 and T ≥ T₀: H_{−τ} has a zero
    z_T = x − iη with |s_eff(z_T) − (s₀ + iT)| < r, i.e.

        x = 2T + O(1),     η = (τ/2) log(x/4π) + 2σ₀ − 1 + O(r) + o(1)  → ∞.

    Hence Y(−τ) = ∞, and #{zeros with |Im z| > Y, 0 < Re z ≤ X} ≥ c X for X ≥ X₀(Y), c = c(τ) > 0.
(ii) (sharp reach) for every ε > 0 there is r₁ such that H_{−τ} has no zero with |z| ≥ r₁ and Re s_eff(z) ≥ σ⁺(τ) + ε
    (lower half-plane; mirror for the upper). Together with (i):

        limsup_{|Re ρ|→∞} ( |Im ρ| − (τ/2) log(|Re ρ|/4π) ) = 2σ⁺(τ) − 1.

Proof. (i) s_eff is analytic on B(2T, C log T) with s_eff'(z) = i/2 + iτ g''(z) = i/2 + O(1/T) there, hence
univalent on that disc with image ⊇ B(iT, (C/3) log T) (a map whose derivative stays within |c|/3 of a constant c
on a disc is injective and covers the concentric disc of radius |c|R/2 about the image of the centre; CLASSICAL).
Since s_eff(z) − (1+iz)/2 = iτg'(z) = O(log T), for C large and T ≥ T₀ there is a domain Ω_T, of diameter ≤ 3,
mapped conformally onto the closed disc B(s₀ + iT, r); on Ω_T, Im z = −(τ/2)log(T/2π) − (2σ₀ − 1) + O(1) < −2. On ∂Ω_T, by Lemma R and almost periodicity,
|F/T♯ − D_τ(s_eff − iT)| ≤ |F/T♯ − D_τ(s_eff)| + |D_τ(s_eff) − D_τ(s_eff − iT)| < 2m/3 < m ≤ |D_τ(s_eff − iT)|.
Rouché: F/T♯ has as many zeros in Ω_T as D_τ in B(s₀, r), at least one. T♯ is analytic and zero-free there, so the
zero is a zero of F. The formula for η is (1.2). Density: take a 2-separated subset of the relatively dense set.
(ii) Lemma D(d) with ε/2 gives |D_τ| ≥ m' > 0 on Re s ≥ σ⁺ + ε/2; Lemma R (a = σ⁺ + ε/2) gives |F/T♯| ≥ m'/2 for
|z| ≥ r₁. The limsup: upper bound from this and (1.2), with |Im g'(z)| = (1/4) log(|z|/4π) + O(1/|z|); lower bound
from (i) applied to zeros s₀ of D_τ with σ₀ > σ⁺ − ε. ∎

Corollary A1 (density statements). For every Y < ∞ and τ > 0, the proportion statement
"#{ρ : |Im ρ| > Y, |Re ρ| ≤ X} = o(X)" is false for H_{−τ}. PROVED (from (i)).

Not proved here (MEASURED / heuristic): the area density of zeros of H_{−τ} in the band |Im z| < (τ/2)L is 1/(4πτ)
per unit area (equivalently zeros of D_τ have density |σ|/(πτ) per unit t to the right of σ; this is the Jessen
formula with Jensen function ≈ σ²/τ, which matches the Gaussian-convolution growth e^{η²/4τ}). Consequently the
fraction of zeros in any fixed strip |Im z| ≤ Y is ≈ 2Y/(τL) → 0. σ⁺(τ) itself is OPEN (only σ⁺ ≤ σ₁).

## 3. Numerics (motherbox, ~/rh-push/b-escape-law, 8 cores, python-flint 0.9 / Arb)

Files (copied back here): `esc.py`, `check.py`, `check3.py`, `zeros.py`, `sig1.py`, `fill.py`, `*.json`, `r4.log`.

### 3.1 Lemma R, measured
G := F/T♯ from direct Gaussian convolution of ξ (Arb) against D_τ(s_eff) (direct Dirichlet series, or the
zeta-average form). `check.json`, `check3.json`:

| τ | x | η | Re s_eff | \|D_τ(s_eff)\| | \|G − D\|/\|D\| | method |
| --- | --- | --- | --- | --- | --- | --- |
| 0.25 | 1e+04 | 0 | 0.0825 | 1.109 | 4.7e-07 | double / zeta-average |
| 0.25 | 1e+04 | 0.7 | 0.4325 | 0.6064 | 6.5e-06 | double / zeta-average |
| 0.25 | 1e+04 | 1.5 | 0.8325 | 0.6148 | 6.8e-06 | double / zeta-average |
| 0.25 | 1e+04 | 3 | 1.5825 | 0.754 | 5.5e-06 | double / zeta-average |
| 0.25 | 1e+06 | 0 | -0.2053 | 36.29 | 2.4e-08 | double / zeta-average |
| 0.25 | 1e+06 | 0.7 | 0.1447 | 7.379 | 3.5e-08 | double / zeta-average |
| 0.25 | 1e+06 | 1.5 | 0.5447 | 2.715 | 9.6e-08 | double / zeta-average |
| 0.25 | 1e+06 | 3 | 1.2947 | 1.492 | 1.6e-07 | double / zeta-average |
| 0.25 | 1e+08 | 0 | -0.4931 | 114.5 | 3.1e-09 | double / zeta-average |
| 0.25 | 1e+08 | 0.7 | -0.1431 | 19.71 | 1.7e-09 | double / zeta-average |
| 0.25 | 1e+08 | 1.5 | 0.2569 | 6.921 | 3.5e-09 | double / zeta-average |
| 0.25 | 1e+08 | 3 | 1.0069 | 2.406 | 4.8e-09 | double / zeta-average |
| 1 | 1e+04 | 0 | -1.1698 | 1.064 | 1.3e-04 | double / zeta-average |
| 1 | 1e+04 | 0.7 | -0.8198 | 0.9607 | 8.7e-05 | double / zeta-average |
| 1 | 1e+04 | 1.5 | -0.4198 | 0.7367 | 1.2e-04 | double / zeta-average |
| 1 | 1e+04 | 3 | 0.3302 | 0.6067 | 1.6e-04 | double / zeta-average |
| 1 | 1e+06 | 0 | -2.3211 | 6877 | 2.0e-07 | double / zeta-average |
| 1 | 1e+06 | 0.7 | -1.9711 | 1113 | 8.9e-08 | double / zeta-average |
| 1 | 1e+06 | 1.5 | -1.5711 | 190.7 | 2.5e-07 | double / zeta-average |
| 1 | 1e+06 | 3 | -0.8211 | 13.66 | 9.0e-07 | double / zeta-average |
| 1 | 1e+08 | 0 | -3.4724 | 9.099e+06 | 5.3e-08 | 400-bit Arb / series |
| 1 | 1e+08 | 1.5 | -2.7224 | 3.127e+04 | 2.2e-08 | 400-bit Arb / series |
| 1 | 1e+08 | 3 | -1.9724 | 708.1 | 3.0e-08 | 400-bit Arb / series |
| 1 | 1e+10 | 0 | -4.6237 | 4.071e+10 | 1.9e-05 | 400-bit Arb / series |
| 1 | 1e+10 | 3 | -3.1237 | 2.977e+04 | 1.7e-04 | 400-bit Arb / series |
| 4 | 1e+04 | 2 | -5.1793 | 565.7 | 6.8e-04 | 400-bit Arb / series |
| 4 | 1e+06 | 0 | -10.7845 | 3.773e+13 | 1.8e-06 | 400-bit Arb / series |
| 4 | 1e+08 | 6 | -12.3897 | 4.087e+17 | 1.1e-07 | 400-bit Arb / series |

The two x = 1e10 rows are limited by the double-precision phase of the direct series at t = 5e9 (t·log n ≈ 1e11), not by the model.

Rows of `check.json` with τ = 1, x = 1e8 are void and omitted (as is an earlier pass `check2.py`): double-precision
evaluation on a non-saddle line cancels by e^{τL²/4} there (diagnosed, replaced by the 400-bit rows of `check3.json`).
The route-43 referee roots are zeros of the model: at (5040.39086, 1.41159), τ = 1: |D_1(s_eff)| = 2.8e-4;
at (192.93262, 3.58704), τ = 4: |D_4(s_eff)| = 1.8e-2 (L²/x = 0.039 there).

### 3.2 Zeros of H_{−τ} outside the strips, τ < 9/32
Method: ξ sampled on one line Im w = −κ (κ = saddle value of the box centre) with Arb zeta at 120 bits, trapezoid
step 0.1, F evaluated on a 0.02 grid in the box x ∈ [x₀, x₀+W], depth η ∈ [e₁, e₂]; zeros = grid cells with winding
number ±1, Newton-refined; the count is checked by the winding number of the box boundary; the deepest roots are
re-evaluated independently (160-bit Arb trapezoid on the horizontal line through the root, no contour shift) and
compared with a non-root control point 0.3 away. "pred" is the density law area/(4πτ) with reach (τ/2)L.

| τ | x₀ | W | depth box | L | (τ/2)L | zeros in box | boundary winding | pred | zeros with η > 1 | max η | max Re s_eff | independent \|G\| at roots | control |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.1 | 1e+10 | 60 | [0.5, 2] | 20.49 | 1.025 | 24 | 24 | 25.1 | 0 | 0.944 | 0.460 | 2e-16, 2e-16 | 0.12 |
| 0.1 | 1.3e+14 | 20 | [0.75, 2.75] | 29.97 | 1.498 | 12 | 12 | 11.9 | 6 | 1.467 | 0.484 | 1e-14, 1e-14 | 0.31 |
| 0.15 | 1.7e+11 | 30 | [0.75, 3] | 23.33 | 1.750 | 13 | 13 | 15.9 | 9 | 1.660 | 0.455 | 5e-16, 5e-16, 9e-16 | 0.19 |
| 0.2 | 5e+08 | 40 | [0.75, 3] | 17.50 | 1.750 | 15 | 15 | 15.9 | 13 | 1.613 | 0.432 | 5e-16, 4e-16, 1e-15 | 0.12 |
| 0.25 | 1e+06 | 60 | [0.75, 2.5] | 11.28 | 1.411 | 9 | 9 | 12.6 | 5 | 1.346 | 0.468 | 2e-16, 1e-15 | 0.22 |
| 0.25 | 1.51e+07 | 40 | [0.75, 3] | 14.00 | 1.750 | 13 | 13 | 12.7 | 7 | 1.718 | 0.484 | 1e-16, 6e-16, 2e-16 | 0.18 |
| 1 | 5e+03 | 50 | [1.05, 3] | 5.99 | 2.996 | 7 | 7 | 7.7 | 7 | 2.273 | 0.138 | 4e-16, 7e-16 | 0.11 |

Located zeros z = x − iη:
* τ = 0.1, x = 10000000030 + δ: (δ, η) = (-27.0776, 0.5498), (-26.2701, 0.6922), (-23.2150, 0.8788), (-21.0325, 0.6515), (-18.5133, 0.6569), (-13.9098, 0.6519), (-9.5653, 0.7627), (-8.6631, 0.8034), (-8.0403, 0.6054), (-6.5034, 0.6137), (-3.8588, 0.7792), (-2.0265, 0.9008), (2.3741, 0.5948), (3.9923, 0.6047), (6.0401, 0.9439), (6.8415, 0.5617), (9.7689, 0.6893), (16.7229, 0.7391), (19.1176, 0.5085), (22.5552, 0.5002), (23.8751, 0.5218), (25.4587, 0.5927), (27.1934, 0.7965), (29.3388, 0.8408)
* τ = 0.1, x = 130000000000010 + δ: (δ, η) = (-9.2671, 0.9576), (-6.9420, 1.2436), (-5.2732, 0.9914), (-3.6753, 0.7722), (-3.0778, 0.9307), (-0.9126, 1.1771), (0.3313, 1.2249), (2.5371, 0.8045), (4.0249, 1.1662), (7.6677, 1.4673), (9.8378, 1.4087), (9.9947, 0.8263)
* τ = 0.15, x = 170000000015 + δ: (δ, η) = (-14.1644, 0.8257), (-11.9798, 1.1079), (-11.4190, 1.4486), (-9.3313, 0.9883), (-7.2439, 1.1991), (-2.5879, 1.3001), (0.0502, 1.3768), (1.2517, 0.8543), (3.7509, 1.6597), (7.1256, 1.1842), (9.1761, 1.0256), (10.1285, 0.8130), (13.3821, 1.2712)
* τ = 0.2, x = 500000020 + δ: (δ, η) = (-16.5175, 1.1358), (-14.3485, 1.0891), (-13.9063, 1.6133), (-9.9271, 0.9112), (-8.9579, 1.0041), (-7.4217, 1.2371), (-4.9735, 1.0245), (-3.1301, 1.0882), (0.1940, 1.3143), (6.2675, 0.9765), (6.9343, 1.2743), (9.6348, 1.4659), (11.0210, 1.0375), (16.7125, 1.1319), (18.5943, 1.1808)
* τ = 0.25, x = 1000030 + δ: (δ, η) = (-23.7011, 1.3456), (-19.0160, 1.0665), (-9.5447, 0.9521), (1.8524, 1.1173), (10.7897, 0.7835), (13.0752, 1.0780), (15.1508, 0.8647), (20.9312, 1.2831), (22.6703, 0.8754)
* τ = 0.25, x = 15100020 + δ: (δ, η) = (-18.5099, 1.3252), (-13.8401, 1.5412), (-11.0439, 0.9494), (-10.1391, 0.8486), (-5.9241, 0.9372), (-4.4189, 1.2889), (-2.8285, 1.0426), (2.7082, 1.7177), (6.3153, 1.4024), (7.4130, 0.8063), (13.2264, 0.9096), (16.7780, 1.0258), (18.8779, 0.8781)
* τ = 1, x = 5025 + δ: (δ, η) = (-23.3532, 1.6351), (-16.0176, 1.8008), (-9.2272, 1.8351), (3.6879, 1.7067), (9.2815, 1.7318), (15.3909, 1.4116), (24.1011, 2.2731)

All listed zeros have mirror images at +η, so they are zeros of H_{−τ} with |Im z| = η. Every box contains zeros
with |Im z| > 3/4 (outside the QRH 7/8 strip); every box except (τ = 0.1, x = 1e10), where (τ/2)L = 1.02, contains
zeros with |Im z| > 1 (outside the critical strip): 6 at τ = 0.1 (x = 1.3e14), 9 at τ = 0.15, 13 at τ = 0.2,
5 + 7 at τ = 0.25. Totals: 93 zeros located against 101.8 from the density law (the law with a sharp cut at
(τ/2)L overcounts near the top edge). The τ = 1 row reproduces route 43's seven zeros in [5000, 5050], including
the referee root (5040.39086, 1.41159). Route 43's empty box (τ = 4, x ∈ [2000, 2010], y ∈ [1.05, 4]) is
consistent: the law predicts 0.6 zeros there.
A first pass of these runs converted Im log Γ (≈ 1e15 at x = 1.3e14) to double before exponentiating and lost the
phase at the two largest heights (independent check 2e-3 instead of 1e-14); the samples are now formed in Arb
(120 bits) and all boxes were rerun. Heights are handled as exact centre + double offset.

### 3.3 Upper bound σ₁(τ) for σ⁺(τ) (`sig1.json`)

| τ | 0.02 | 0.05 | 0.1 | 0.15 | 0.2 | 0.25 | 9/32 | 0.5 | 1 | 2 | 4 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| σ₁(τ) | 1.7147 | 1.6946 | 1.6626 | 1.6322 | 1.6031 | 1.5750 | 1.5579 | 1.4457 | 1.2211 | 0.8411 | 0.2103 | −0.8262 |
| 2σ₁ − 1 | 2.429 | 2.389 | 2.325 | 2.264 | 2.206 | 2.150 | 2.116 | 1.891 | 1.442 | 0.682 | −0.579 | −2.652 |

So zeros of H_{−τ} satisfy |Im ρ| ≤ (τ/2) log(|Re ρ|/4π) + 2σ₁(τ) − 1 + o(1) (PROVED given Lemma R), and reach
(τ/2) log(|Re ρ|/4π) + 2σ₀ − 1 for every zero σ₀ + it₀ of D_τ. Largest Re s_eff among the located zeros:
0.460 (τ = 0.1), 0.484 (τ = 0.1), 0.455 (τ = 0.15), 0.432 (τ = 0.2), 0.468 (τ = 0.25), 0.484 (τ = 0.25), 0.138 (τ = 1). Route 43's heuristic offset "−1" corresponds to σ⁺ = 0, which the located zeros already exceed.
All 86 zeros located at τ ≤ 0.25 have Re s_eff < 1/2 (deepest ≈ (τ/2)L − 0.03). Whether σ⁺(τ) ≤ 1/2 for small τ, or
zeros with Re s_eff ∈ (1/2, σ₁] occur at rare heights (as for a generic almost periodic series), is OPEN; the
theorem needs neither.

## 4. Consequences: which hypotheses can or cannot reach Λ = 0

Definitions as in route 43: κ(P) = sup{Λ(F) : F ∈ P}; survival τ_P(ξ) = sup{τ : H_{−s} ∈ P for s ∈ [0, τ]};
flow-critical at ξ means τ_P(ξ) = 0. Strip_Y = {all zeros in |Im z| ≤ Y}; β ∈ [1−θ, θ] is Strip_{2θ−1}.

C1 (binary class, now unconditional). PROVED from Theorem A. For every Y < ∞ and every τ > 0, H_{−τ} ∉ Strip_Y.
Hence τ_{Strip_Y}(ξ) = 0 for every Y for which ξ ∈ Strip_Y: the critical strip (Y = 1), ζ(1 + it) ≠ 0, classical
zero-free regions, QRH 7/8 (Y = 3/4, on the openai/math 003 theorem) and RH are all flow-critical at ξ. With
route 43's witness κ(Strip_Y) = Y²/2 > 0 (de Bruijn class without Φ > 0), the class "flow-critical at ξ and not
RH-strength" is non-empty. Route 43's table entries "0 if escape law" become 0. τ_QRH(ξ) = 0 replaces the Lean
bound ≤ 9/32.

C2 (density and proportion inputs). PROVED from Corollary A1: every statement "N(σ, T) = o(T) for some σ > 1/2"
(Bohr–Landau/Selberg/Ingham/Guth–Maynard type) is true for ξ and false for H_{−τ}, τ > 0: flow-critical, not
RH-strength. Positive-proportion-on-the-line statements: flow-critical on the measured density law (MEASURED).

C3 (survival and strength are independent). PROVED from Theorem A(ii). For c > 0 let
P_c = {limsup |Im ρ| / log|Re ρ| ≤ c}. Then H_{−τ} ∈ P_c iff τ ≤ 2c, so τ_{P_c}(ξ) = 2c exactly, while
κ(P_c) = ∞ (P_c contains Strip_Y for every Y). So (survival, κ) takes the values (0, Y²/2) on Strip_Y,
(2c, ∞) on P_c, (c − Λ, c) on {Λ ≤ c}: the only relation is route 43's survival ≤ κ. Binary flow-criticality carries
no information about κ.

C4 (stronger no-go for flow-stable hypotheses). PROVED from Theorem A. If P holds for H_{−τ₀} for one τ₀ > 0 (every
P that is flow-stable at ξ, every backward-closed "soft" class), then P does not imply, class-uniformly, that the
zeros lie in any horizontal strip, nor any o(X) density off a strip. Flow-stable hypotheses are therefore blind to
the Re s = 1 zero-free line (prime number theorem strength), not only to RH. The flow-blindness wall
(SL2: Λ ≥ 0 cannot be improved by flow-stable inputs) is the κ = 0 corner of this.

C5 (what the flow test measures). Compact-window strict statements are flow-stable (route 43 section 7, Hurwitz);
by Theorem A every height-uniform horizontal confinement of zeros, however weak, is destroyed for every τ > 0, at
depth ≈ (τ/2) log x. On zero-location statements, "flow-critical at ξ" = "uniform in height". The flow-blindness
wall and the verified-height wall are the same wall on this class. The test passes the PNT line and QRH alike and
so cannot rank arithmetic inputs.

C6 (answer for Λ = 0).
 * Cannot reach Λ = 0: (a) flow-stable hypotheses (survival > 0): κ ≥ Λ + survival, and by C4 not even a strip;
   (b) flow-critical hypotheses with κ > 0: every strip input β ≤ θ caps at (2θ − 1)²/2 (9/32 at 7/8, 1/2 at the
   critical strip; exact in the de Bruijn class without Φ > 0, ≤ in ξ-like classes), every density/proportion input
   adds nothing to the strip it is combined with (route 43 G3).
 * Can reach Λ = 0 only: hypotheses with κ(P) = 0. Flow-criticality is necessary for this (route 43 G1a) and, by
   C1–C3, nowhere near sufficient. No such hypothesis other than RH-equivalents is identified here.
 * Structural reason (Lemma D(e)): for every τ > 0 the Dirichlet model of H_{−τ} has non-multiplicative
   coefficients e^{−(τ/4) log² n}; backward flow removes the Euler product at once and leaves a generic almost
   periodic function whose zeros fill a band of logarithmic width. Any step of a proof that survives a small
   backward flow has not used multiplicativity.

## 5. DH control

Theorem A is a no-go/map result, not an RH argument, and it is Euler-blind by design: the proof uses (1) the
Gaussian convolution form, (2) Stirling for the Γ-factor, (3) an absolutely convergent Dirichlet series with
a_1 ≠ 0 in Re s > 1, (4) Hadamard and Bohr. No step uses Λ(n) ≥ 0, multiplicativity or Hecke structure. It holds
verbatim for the Davenport–Heilbronn function (replace b_n by a_n b_n, with the conductor-5 Γ-factor): the zeros of
its backward flow also escape every strip, and Strip_Y statements true for DH are flow-critical at ξ_DH too.
Consequence for the walls: flow-criticality cannot be used as a positive lever, since it does not separate ζ from
DH; the Euler product enters only through which statements are true at τ = 0, never through the flow.

## 6. Three weakest steps

1. Lemma R is proved with untracked constants (uniform Stirling for g'', Gaussian tail, choice κ₀ = max(2, 2σ−1)).
   It is supported by agreement at relative 1e-4 to 1e-9 on 28 points (error decreasing with x as predicted) but is not interval-certified or formalized,
   and has had no independent referee.
2. The Rouché transfer in Theorem A(i) and Lemma D(d) rely on classical Bohr theory (relative density of
   translation numbers, normal-family/Hurwitz argument) quoted, not re-derived; the conformal-map step is sketched.
3. The consequences C1–C6 use route 43's definitions and its witness values (κ(Strip_Y) = Y²/2 holds in the de Bruijn
   class without Φ > 0; QRH 7/8 rests on the unrefereed openai/math 003 Lean proof). The density law 1/(4πτ) and
   C2's proportion clause are MEASURED only; σ⁺(τ) is OPEN (only σ⁺ ≤ σ₁ and the located zeros bound it).

## 7. Next step

Referee Lemma R (it is a two-page Laplace estimate); then update route 43 (status of the CONDITIONAL line, table
entries "0 if escape law", nextStep (1)) and item 11 of the fifty-routes synthesis. Optional: Lean statement of
Lemma D(b) and the abstract corollary "∀ τ > 0, ¬Strip_Y(H_{−τ}) ⇒ survival = 0"; Jessen-function proof of the
1/(4πτ) density; σ⁺(τ) via the Bohr torus minimum.
