# e1-cofinal-legendre-dual: cofinal limit of the Legendre LP duals

**Verdict: precise obstruction. No proof of RH. No bound changes.**

The combination (Legendre LP duality x Theorem RIG x Landau positivity with the pole removed) dies at its first
lemma. Limit points of optimal duals exist and are feasible at every scale, but every such limit has density zero and
ψ(t) = O(log t): the limit keeps none of the LP value ν₁(x) ≈ √x. With density normalised to 1 the sawtooth
discrepancy is forced to grow like log x, so no bounded-discrepancy limit exists. One pivot was taken (the cofinal
class with logarithmic discrepancy); it ends at a mean-square statement (MV-CAP) and at the pointwise Möbius sum of
the source's Step 7.

Grades: PROVED = complete argument here, checked by its author only, no referee. CLASSICAL. MEASURED = float64
HiGHS LP (feasibility about 1e-7), every constraint k ≤ x re-checked. ARGUED = mechanism stated, not written in full.

Sources read: `formalization/rh-attempts/2026-11-01-r3-legendre-dual-lp.md` (Lemmas 1.1, 1.3-1.5, 2.1, Theorems PZ,
RIG, S, E), `-r3-synthesis.md` section 4 item 1, graph nodes cofinal-legendre-dual, rig-continuum-sawtooth,
plant-suppressed-by-zeta-rho0, legendre-lcm-identity, legendre-lp-nu1, OBSTRUCTION_MAP rows P13, S2, T2 and the
control list.

---

## 1. Plan

Notation of the source. A dual point at x is (G, u, v): G = ψ_b on J_x nondecreasing, constraints
|T(k) + u/k + v log k/k| ≤ 1 for k ≤ x with T(k) = Σ_n G(⌊x/(kn)⌋), objective G(x) − v, optimum ν₁(x).
Put α = v/x, γ = (u + v log x)/x, Y = x/k. The constraint reads

  |T_b(Y) − αY log Y + γY| ≤ 1 at every Y = x/k,  and T_b(Y) = 𝒯(⌊Y⌋) for k > s.   (1)

Two normalisations of "the rescaled optimal dual b_x":
* τ = 1 (the LP's own): discrepancy 1, density α_x.
* density 1: b_x/α_x, discrepancy τ₁(x) = 1/α_x = x/v.

Steps: (i) first decisive test (LP on a doubling grid 10⁴ .. 6·10⁶); (ii) tightness and the structure of limit
points; (iii) if dead, one pivot.

New relative to the source and the atlas: the restriction rule (Lemma 1), the classification of limit points
(Theorem 2), the extension LPs ext(x; X) and cof(x; X), the Möbius profile of the optimum (Section 3.3), and the
control analogues with their coefficients (Section 6).

---

## 2. First decisive test (MEASURED)

`run_scan.py`, `analyse.py`; logs `scan.log`, `analysis.log`; optima in `out/opt_*.npz`. Planned memory printed per
run; peak RSS 0.53 GB at 2.56·10⁶ and under 1.3 GB at 6·10⁶ (cap 8 GB, `scripts/memcap.sh`).

| x | ν₁/√x | α = v/x | γ | v log x / x | τ₁ = x/v | τ₁/log x |
|---|---|---|---|---|---|---|
| 1·10⁴ | 1.0393 | 0.4425 | 0.8033 | 4.076 | 2.260 | 0.245 |
| 2·10⁴ | 0.9803 | 0.3311 | 0.6971 | 3.279 | 3.020 | 0.305 |
| 4·10⁴ | 0.9854 | 0.3025 | 0.6642 | 3.205 | 3.306 | 0.312 |
| 8·10⁴ | 0.9956 | 0.2947 | 0.6548 | 3.328 | 3.393 | 0.301 |
| 1.6·10⁵ | 0.9773 | 0.2867 | 0.6449 | 3.435 | 3.488 | 0.291 |
| 3.2·10⁵ | 1.0770 | 0.2688 | 0.6219 | 3.407 | 3.721 | 0.294 |
| 6.4·10⁵ | 1.0526 | 0.2330 | 0.5724 | 3.115 | 4.291 | 0.321 |
| 1.28·10⁶ | 1.0780 | 0.2287 | 0.5661 | 3.216 | 4.373 | 0.311 |
| 2.56·10⁶ | 1.0614 | 0.1993 | 0.5208 | 2.941 | 5.017 | 0.340 |
| 3·10⁶ | 1.0455 | 0.2056 | 0.5308 | 3.066 | 4.864 | 0.326 |
| 5.12·10⁶ | 1.0739 | 0.1958 | 0.5150 | 3.024 | 5.108 | 0.331 |
| 6·10⁶ | 1.0887 | 0.1941 | 0.5123 | 3.030 | 5.152 | 0.330 |

(ν₁ at 10⁶-class points agrees with the source: 1810.9088 at 3·10⁶.)

Reading.
* v log x / x is not a monotone drift. After the first point it stays in [2.94, 3.44] and moves both ways between
  consecutive doublings. The data fit "bounded with fluctuations of about ±0.2"; a slow decrease is not excluded.
  Section 3.1 proves it is at most 8 + o(1).
* α_x falls from 0.44 to 0.19; τ₁ = x/v rises from 2.26 to 5.15 and τ₁/log x stays in [0.25, 0.34]. In density-1
  normalisation the discrepancy grows like 0.3 log x.

Distance between the optimum at x and at 2x (three weak norms, `analysis.log` section C):

| x → 2x | τ=1: Σ_{j≤100} \|G_x(j) − G_2x(j)\|/j² | density 1: same norm (norm of ψ_x) | relative-scale profile: sup_{m≤32} \|E_x(m) − E_2x(m)\| | correlation of profiles |
|---|---|---|---|---|
| 1·10⁴ | 0.365 | 0.468 (2.32) | 0.208 | 0.974 |
| 8·10⁴ | 0.074 | 0.243 (1.88) | 0.198 | 0.981 |
| 6.4·10⁵ | 0.053 | 0.227 (1.63) | 0.120 | 0.987 |
| 1.28·10⁶ | 0.078 | 0.228 (1.62) | 0.085 | 0.995 |
| 2.56·10⁶ | 0.035 | 0.170 (1.48) | 0.088 | 0.995 |

E_x(m) := (G_x(⌊x/m⌋) − α_x x/m)/√(x/m) is the excess of the optimum at the relative scale x/m.

Decision.
* **Fixed t (vague topology), τ = 1:** convergence to the zero measure. G_x(1) = G_x(2) = G_x(3) = 0 at every x;
  G_x(5): 0.28 → 0.000; G_x(16): 4.60 → 1.3; G_x(100): 42.1 → 17.7. The fraction of G(x) on t ≤ √x falls from
  9·10⁻³ to 4·10⁻⁴. Theorem 2 proves this is forced.
* **Fixed t, density 1:** no convergence established; consecutive distances stay at 11-15% of the norm, with
  no decay from 8·10⁴ on, and the constraint it would satisfy is vacuous (τ₁ → ∞, Section 3.1).
* **Relative scale t = x/m:** the excess profile converges to a fixed shape (Section 3.3), and that shape is
  inconsistent between x and 2x. This is the "two distinct limit points" outcome in the only topology that
  retains the objective.

---

## 3. Work

### 3.1 Restriction rule and the density bound

**Lemma 1 (restriction; PROVED).** Let q ≥ 1 be an integer and (G, u, v) dual-feasible at X = qx. Then G restricted
to J_x ⊂ J_X with u' = (u + v log q)/q, v' = v/q is dual-feasible at x; (α, γ) is unchanged; its objective at x is
G(x) − v/q.

*Proof.* ⌊x/m⌋ = ⌊X/(qm)⌋, so J_x ⊂ J_X and T_x(k) = Σ_n G(⌊X/(qkn)⌋) = T_X(qk). Also
h_X(qk) = (u + v log(qk))/(qk) = (u' + v' log k)/k. The constraints at x are the constraints of X at the multiples
of q. ∎

Check (`check_restrict.py`): max_k |e_k| = 1.000000000 at x = 10⁴, 1.6·10⁵, 1.28·10⁶ for q = 2, 4, zero violations.

So the feasible sets form a projective system under restriction along any divisibility chain. A "cofinal dual" in
the LP's own normalisation is an element of its projective limit.

**Lemma 2 (density bound; PROVED, constants not optimised).** For every dual-feasible point at x,
α log x ≤ 8/(1 − 2δ) + o(1) for each fixed δ > 0, and γ ≤ 1/2 + α log 2.

*Proof.* Put φ(Y) = αY log Y − γY. For M ≤ x^{1/2−δ} the points Y = x/k with ⌊Y⌋ = M have spacing ≤ M²/x·(1+o(1))
and fill [M, M+1) up to o(1). By (1), |𝒯(M) − φ(Y)| ≤ 1 on them, so the oscillation of φ on [M, M+1] is ≤ 2 + o(1):
|α(log M + 1) − γ| ≤ 2 + o(1) + α/M. Subtract the cases M = ⌊x^{1/2−δ}⌋ and M = 1. For γ: G(1) = 𝒯(1) ≥ 0 and
𝒯(1) ≤ 1 + φ(Y) as Y → 2. ∎

Consequences.
* v log x / x ≤ 8 + o(1): the measured 2.9-4.1 is inside the proved range; α_x → 0 for every feasible sequence.
* **Density-1 normalisation has discrepancy τ₁(x) ≥ (1/8 − o(1)) log x.** For a single measure b on [1, ∞) with
  density a and |T_b(Y) − aY log Y − cY| ≤ τ(Y) at every real Y the same argument (all M) gives
  sup_{Y≤X} τ(Y) ≥ (a/4) log X − O(a). The cause is the integer sawtooth itself: T_b is constant on [M, M+1) and
  aY log Y is not.

### 3.2 Limit points in the τ = 1 normalisation

**Theorem 2 (PROVED).** Let x_i → ∞ and (G_i, u_i, v_i) be dual-feasible at x_i.
(a) (Tightness.) A subsequence has G_i(j) → G*(j) for every integer j ≥ 1, α_i → α*, γ_i → γ*.
(b) (Feasibility at every scale.) The limit b* (b*(j) = G*(j) − G*(j−1) ≥ 0) satisfies
  |T_{b*}(Y) − α*Y log Y + γ*Y| ≤ 1 for every real Y ≥ 1.
(c) α* = 0, γ* ∈ [−2, 0], and T_{b*}(M) = |γ*|M + ε_M with |ε_M| ≤ 1.
(d) ψ_{b*}(t) ≤ 3 log₂ t + 3. If γ* = 0 then b* = 0.
(e) B*(s) = Σ b*(n) n^{−s} converges in Re s > 0, B* = |γ*| + E(s)/ζ(s) with E(s) = Σ_n (ε_n − ε_{n−1}) n^{−s}
  convergent in Re s > 0, and E vanishes at every zero of ζ in 0 < Re s < 1 to at least its multiplicity.
(f) For every x, lim_{X→∞, x | X} ext(x; X) ≤ 3 log₂ x + 3, where
  ext(x; X) := max{G(x) − v x/X : (G, u, v) dual-feasible at X}.

*Proof.*
(a) Lemma 1.5 of the source gives |α| ≤ 35, |γ| ≤ 46. By (1), 0 ≤ G_i(j) ≤ 𝒯_i(j) ≤ 1 + 35(j+1)log(j+1) + 46(j+1)
once j ≤ s(x_i). Diagonal extraction.
(b) Fix a non-integer Y with M = ⌊Y⌋ and take k_i = ⌈x_i/Y⌉. Then x_i/k_i → Y, ⌊x_i/k_i⌋ = M and k_i > s(x_i)
for large i, and T(k_i) = 𝒯_i(M) = Σ_{m≤M} b_i(m)⌊M/m⌋ → T_{b*}(M) (source Lemma 1.4(i)). Pass to the limit in (1);
integers Y follow by right-continuity and the closed interval [M, M+1] by continuity of the smooth part.
(c) The oscillation of α*Y log Y − γ*Y on [M, M+1] is ≤ 2 for every M, so α* = 0 and |γ*| ≤ 2. Then
0 ≤ T_{b*}(M) ≤ 1 − γ*(M+1) for all M forces γ* ≤ 0.
(d) T(Y) − 2T(Y/2) = Σ_n (−1)^{n+1} ψ(Y/n) ≥ ψ(Y) − ψ(Y/2) (alternating sum of a nonincreasing sequence). By (b)
with α* = 0 the left side is ≤ (1 − γ*Y) − 2(−1 − γ*Y/2) = 3. Iterate. If γ* = 0 then b*(m)⌊M/m⌋ ≤ T_{b*}(M) ≤ 1
for all M, so b*(m) = 0.
(e) Convergence from (d). ζB* = Σ_n (1 ∗ b*)(n) n^{−s} and Σ_{n≤M} (1 ∗ b*)(n) = T_{b*}(M) = |γ*|M + ε_M. Since B* is
holomorphic in Re s > 0, E = ζ(B* − |γ*|) vanishes at the zeros.
(f) ext(x; X) is nonincreasing along a divisibility chain (Lemma 1) and the maximisers have a limit point as in
(a)-(b), whose objective at x is G*(x) − α*x = G*(x) ≤ 3 log₂ x + 3. ∎

The finite-x form of (d), ψ_b(Y) − ψ_b(Y/2) ≤ 3 + αY log 2 at Y = x/k, holds at every optimum computed
(`analysis.log` B: the left side minus the right side is ≤ −2.1 for all j ≤ √x/2).

**What this says about the proposal.**
* The first lemma is true in its literal form: {b_x} is tight and every limit point is feasible at every scale.
* Every limit point has density 0 and counting function O(log t). RIG applies with a = 0 and returns a function
  holomorphic in Re s > 0. There is no pole at 1 to remove, no pole at any zero, and the "tail" is not a 1/ζ Mellin
  integral with content: it is E/ζ with E vanishing on the zeros.
* At the optima γ_x > 0 at every x computed (0.51-0.80), and γ_x ≤ min_M [1/(M+1) + α_x log(M+1)] → 0. If γ_x ≥ 0
  persists (MEASURED, not proved) the limit of the optimal duals is b* = 0 by (d).
* The LP value ν₁(x) ≈ √x is carried by mass at t ≍ x that does not survive any limit at fixed t.

### 3.3 The relative-scale profile of the optimum, and why it is not cofinal

MEASURED (`analysis.log` D), excess of the optimum at x/m in units of √(x/m):

| x | m=1 | m=2 | m=3 | m=4 | m=6 | m=8 | m=16 |
|---|---|---|---|---|---|---|---|
| 1.6·10⁵ | +0.977 | −0.409 | −0.460 | −0.013 | +0.296 | −0.059 | +0.007 |
| 1.28·10⁶ | +1.078 | −0.465 | −0.465 | −0.041 | +0.287 | −0.053 | +0.071 |
| 2.56·10⁶ | +1.061 | −0.483 | −0.481 | −0.014 | +0.285 | −0.012 | +0.016 |
| 6·10⁶ | +1.089 | −0.502 | −0.465 | −0.017 | +0.232 | +0.003 | −0.023 |

The sign pattern is μ(m), and the sizes fit E(m) ≈ E(1)·√m·μ(m)/σ(m) (predicted 0.50, 0.46, 0, 0.22, 0 for
m = 2, 3, 4, 6, 8; ARGUED: with the head constraints active at e_k = μ(k), Möbius inversion gives excess
Σ_k μ(k)μ(mk) ∝ μ(m)·m/σ(m)·(1/m) at x/m).

Consequence (PROVED for the pattern, MEASURED that the optimum has it). A single measure b has one excess function
e(t) = ψ_b(t) − at. The optimum at x has e(x/2) ≈ −0.48√(x/2); the optimum at x/2 has e(x/2) ≈ +1.05√(x/2).
`check_restrict.py`: the optimum at 2x restricted to x has objective −0.312√x (x = 10⁴), −0.406√x (1.6·10⁵),
−0.483√x (1.28·10⁶), against ν₁(x) = +1.04, +0.98, +1.08 √x. The optimal duals are a family of x-dependent
Möbius-resonant configurations (T_b(x/k) − smooth ≈ μ(k)), and the resonance condition at x contradicts the one at
x/2 at every odd squarefree k. They are not sections of one object.

### 3.4 Price of extendability (MEASURED)

`run_ext.py` (logs `ext_1e4.log`, `ext_16e4.log`): ext(x; X), the best objective at x among points feasible at
X = 2^i x.

| x = 10⁴, X = | 10⁴ | 4·10⁴ | 1.6·10⁵ | 6.4·10⁵ | 2.56·10⁶ |
|---|---|---|---|---|---|
| ext/√x | 1.039 | 0.834 | 0.698 | 0.627 | 0.570 |
| ext·log X/√x | 9.57 | 8.83 | 8.36 | 8.39 | 8.42 |
| ext/(α√x) (excess at density 1) | 2.35 | 2.61 | 2.61 | 2.89 | 2.92 |

x = 1.6·10⁵: ext/√x = 0.977, 0.885, 0.824, 0.768, 0.722 at X/x = 1, 2, 4, 8, 16; ext·log X/√x = 11.7 → 10.6.

ext(x; X) decays like C/log X on the tested range (and to at most 3 log₂ x + 3 in the limit, Theorem 2(f)). In
density-1 units the excess at x does not fall (2.35 → 2.92 √x). The decay is the forced decay of α, nothing more.

---

## 4. Pivot (one): the cofinal class with logarithmic discrepancy

Since bounded discrepancy forces density zero, the only cofinal class that contains Λ is

  𝒞 = { b ≥ 0 on [1, ∞) : |r_b(Y)| ≤ κ(1 + log Y) for all Y ≥ 1 },  r_b(Y) := T_b(Y) − aY log Y − cY.

Λ ∈ 𝒞 with a = 1, c = −1, κ = 1.0000 (`lam_floor.py`, Y ≤ 3·10⁶; the maximum is at Y = 1). RIG applies to every
b ∈ 𝒞.

**Proposition 3 (PROVED / CLASSICAL).** For b ∈ 𝒞:
(a) e(x) := ψ_b(x) − ax = a·x[m(x) log x − (β(x) + 1)] + c·x·m(x) + Σ_{k≤x} μ(k) r_b(x/k), with m, β as in the source.
(b) B(s) = −aζ′/ζ(s) + (c + a) + E_b(s)/ζ(s), where E_b(s) = Σ_n δ(n) n^{−s}, δ = 1 ∗ b − a log − (c + a), has partial
  sums O(log Y), converges in Re s > 0 and satisfies |E_b(σ + it)| ≤ κ|s|(1/σ + 1/σ²).
(c) F(s) := ∫_1^∞ e(x) x^{−s−1} dx = B(s)/s − a/(s − 1) is holomorphic at every real s > 0.
(d) (Landau.) If e(x) ≤ Cx^θ for all large x, or e(x) ≥ −Cx^θ for all large x, then B is holomorphic in Re s > θ
  apart from s = 1. Equivalently: if B has a pole at a zero ρ with Re ρ > θ then e(x) = Ω_±(x^{θ}).

*Proof.* (a) ψ_b(x) = Σ_{k≤x} μ(k) T_b(x/k) and Σ_k μ(k)(x/k) log(x/k) = x[m(x) log x − β(x)]. (b) partial summation
on Σ_{n≤Y}(1 ∗ b)(n) = T_b(⌊Y⌋). (c) ζ has no zero on (0, 1) and the principal parts cancel at s = 1. (d) Landau's
theorem applied to Cx^θ ∓ e(x), using (c). ∎

**Landau's lemma gives no one-sided bound.** It converts an assumed one-sided bound on e into holomorphy of B. In
the direction needed (from the structure B = s[…]/ζ to an upper bound for e) it gives only Ω_± results. Removing
the pole at 1 does not change this: after the pole is removed the coefficient sequence b − a is not nonnegative, and
the abscissa of F is then decided by the complex zeros, which is the statement to be proved. The Theorem E floor
is not improved pointwise by this step.

**Proposition 4 (mean square; ARGUED).** Let Θ = sup Re ρ. For b ∈ 𝒞 and every σ > Θ,
∫_1^∞ |e(x)|² x^{−2σ−1} dx < ∞; hence (1/X)∫_X^{2X} |e|² ≪ X^{2σ}.

*Sketch.* By Plancherel the claim is F(σ + it) ∈ L²(dt). The terms with a and c are O(|t|^{−1+ε}). The remaining
term is R̂_b(s)/ζ(s), R̂_b the Mellin transform of r_b. On Re s = σ > Θ, 1/ζ ≪ |t|^ε (CLASSICAL in a zero-free
half-plane, by the argument of Titchmarsh 14.2). r_b is bounded by κ(1 + log Y) and equals a nondecreasing function
(here b ≥ 0 is used) minus a smooth one, so on each dyadic block it has variation O(Y log Y); this gives
r_b(e^w)e^{−σw} ∈ H^ε for σ > 1/2, which absorbs |t|^ε. Not written in full. ∎

Reading of the pivot.
* Proposition 4 would say that every cofinal dual has RH-size excess in mean square given Θ. At b = Λ it is the
  classical mean-square bound for ψ(x) − x. It is a mean-value statement and stops at MV-CAP: it certifies no
  single x.
* With monotonicity of ψ_b the mean square gives pointwise e(x) ≪ x^{(1+2Θ)/3+ε}, which is never better than
  Theorem S of the source (1/(2 − Θ)); equal at Θ = 1/2 and Θ = 1.
* Pointwise, e(x) is governed by Σ_{k≤x} μ(k) r_b(x/k) with one fixed r_b (Proposition 3(a)). This is the
  source's Step 7 with the x-dependence of the certificate removed. A fixed r_b cannot be Möbius-resonant at all
  x (Section 3.3), which is why the mean square is small; nothing here bounds it at a sparse sequence of x.

MEASURED (`run_cof.py`, logs `cof_*.log`): cof(x; X) = best excess at x, in units where the discrepancy bound at
scale Y is (1 + log Y)/(1 + log x), among points feasible at every Y = X/k.

| X/x | 1 | 4 | 16 | 64 | 256 |
|---|---|---|---|---|---|
| cof/√x, x = 10⁴ | 0.496 | 0.413 | 0.360 | 0.336 | 0.316 |
| cof/√x, x = 4·10⁴ | 0.475 | 0.430 | 0.375 | 0.348 | |
| cof/√x, x = 1.6·10⁵ | 0.450 | 0.395 | 0.356 | | |

At x = 10⁴, cof·(1 + log X)/√x = 5.06, 4.79, 4.67, 4.83, 4.98: the decay fits C/(1 + log X) to ±4% with no
plateau up to X/x = 256. The value of Λ in the same units is 0.013√x (x = 10⁴), 0.006√x (4·10⁴), 0.007√x
(1.6·10⁵) (`lam_floor.log`). So the cofinal supremum at x lies between 0.013√x and 0.316√x at x = 10⁴, and the data
do not decide where. Extendability lowers the LP value; whether it lowers the exponent is not measurable at
X ≤ 2.56·10⁶.

---

## 5. Where the three requirements stand

* All primes together: the LP and 𝒞 use the full integer sawtooth; yes.
* Uniform in height / every window: Theorem 2 and Proposition 3 hold at every x. Proposition 4 is a mean value and
  does not meet the requirement.
* Fails for the controls for a structural reason: Section 6. The only step that separates is membership of the
  true von Mangoldt point in the cone b ≥ 0 with logarithmic discrepancy. No step separates ζ from E_a.

End point, in the terms of the brief: the finite-x optima do not pass to a limit that retains the objective
(nothing passes from finite stages), and for a genuinely cofinal b the statement that remains is a pointwise
Möbius sum whose only proved control is the mean square.

---

## 6. Controls

Analogue for a coefficient sequence a(n) with a(1) = 1 and Dirichlet series f: sawtooth
T^a_b(Y) = Σ_n a(n) ψ_b(Y/n), smooth target = main term of Σ_{n≤Y} a(n) log n, true point
Λ_a = (a log) ∗ a^{−1} (coefficients of −f′/f), Legendre identity with a^{−1} in place of μ, RIG:
f(s)B(s) = s[polar part + R̂(s)]. `controls.py`, `controls.log` (n ≤ 4000).

| control | analogue built | Λ_a in the cone b ≥ 0? | failing step |
|---|---|---|---|
| ζ | — | yes (0 negative entries) | none (reference) |
| Davenport-Heilbronn, a(n) = (1, ξ, −ξ, −1, 0) mod 5, ξ = 0.28408 | yes, signed sawtooth, target 0 (f entire) | no: Λ_a(3) = −0.3121, Λ_a(4) = −1.4422, Λ_a(6) = +1.9364 (off prime powers); 21 negative entries for n ≤ 60; negative mass 4917 against positive 4936 for n ≤ 4000 | source Lemma 1.1(d): the true point is not dual-feasible. See below. |
| sign twist a = λ (Liouville), f = ζ(2s)/ζ(s) | yes | no: Λ_a(p) = −log p | same step. The sawtooth weights also lose sign, so Lemma 1 and Theorem 2(d) (alternating-sum inequality) fail. |
| E_a = ζ(s+a)ζ(s−a), a = 0.2, a(n) = n^{−a}σ_{2a}(n) | yes, positive weighted sawtooth, poles at 1 ± a | yes (0 negative entries; Λ_a = Λ(n)(n^a + n^{−a})) | **none.** Lemma 1, Theorem 2, Propositions 3-4 hold with ζ replaced by E_a and Θ by 1/2 + a. The chain contains no step that separates ζ from E_a; it returns the true larger exponent. |
| θ^w, w = 3, a(n) = r₃(n)/6 ≥ 0 | yes, positive weighted sawtooth | no: Λ_a(4) = −1.386, Λ_a(10) = −9.210, Λ_a(6) = +2.389; Σ_{n≤X} \|a^{−1}(n)\| ≍ X^{1.91} | Lemma 1.1(d), and the Legendre certificate a^{−1} has ℓ¹ norm X^{1.91} instead of X. |
| Beurling integers | yes: T_b(Y) = Σ_{n∈𝒩} ψ_b(Y/n) | yes (Λ_𝒩 ≥ 0 by construction) | source Lemma 1.1(d), second half: the discrepancy bound K(x) = O(log x) is Stirling for N(Y) = ⌊Y⌋. With N(Y) − Y = Ω(Y^θ), Λ_𝒩 has discrepancy ≫ Y^θ, is outside 𝒞, and RIG's R̂ is holomorphic only in Re s > θ. Lemma 2 and Theorem 2 still hold (ARGUED: they use only that T_b is a step function with gaps of length ≥ 1 infinitely often). |

**Davenport-Heilbronn in detail.** The analogue exists and its positive cone is trivial:

*Proposition 5 (PROVED given the measured input below).* Let b ≥ 0 with ψ_b of polynomial growth and
|T^{DH}_b(Y)| ≤ τ(Y) = O(Y^ε). Then f_{DH}(s)B(s) = sR̂(s) with R̂ holomorphic in Re s > 0, B is holomorphic at every
real s > 0 where f_{DH} ≠ 0, and by Landau B converges in Re s > β_ℝ, the largest real zero of f_{DH} (0 if none).
So ψ_b(x) ≪ x^{β_ℝ+ε}, and B is holomorphic at every complex zero of f_{DH} with real part > β_ℝ, including the
zeros in Re s > 1 and the off-line zeros in the strip.

Measured input: f_{DH}(σ) ∈ [0.665, 1.0001] on the grid σ = 0.02, 0.04, …, 2 (25 digits, not interval-certified);
no sign change, so β_ℝ = 0 on this evidence.

So for DH every nonnegative feasible system has ψ_b = O(x^ε) and carries none of the zeros; the true point Λ_{DH},
which carries them, is outside the cone because −f′/f has negative coefficients, which is the absence of an Euler
product. The step "ν₁ bounds ψ − x" (Lemma 1.1(d) with Proposition 1.2) is the one that uses Λ ≥ 0.
The same Landau argument gives the corresponding statement for θ³ and for the Liouville twist.

Backward heat, unimodular twist ζ(s + iτ), T-NR, phase-rotated transfer operator: the LP is a statement about one
real Dirichlet series with an integer sawtooth; the unimodular twist has complex Λ_a = Λ(n)n^{−iτ} (outside the cone,
same failing step as the sign twist). The backward heat family, T-NR and the transfer operator have no Dirichlet
coefficient sequence a(n) fixed by the control, so no analogue was built; not tested.

---

## 7. Verdict

**Precise obstruction.**

1. PROVED: every limit point of dual-feasible points (τ = 1) is feasible at every real scale, has α* = 0,
   ψ(t) ≤ 3 log₂ t + 3, and a Dirichlet transform holomorphic in Re s > 0. PROVED: density-1 normalisation forces
   discrepancy ≥ (1/8 − o(1)) log x. The cause is the unit steps of the integer sawtooth against Y log Y.
2. MEASURED: v log x/x stays in [2.94, 3.44] on 2·10⁴-6·10⁶ without monotone drift (proved ≤ 8 + o(1)). The optimum
   at fixed t tends to 0. Its excess at x/m follows μ(m)√m/σ(m) and is inconsistent between x and 2x (restricted
   objective −0.31 to −0.48 √x against +1.0 √x).
3. Pivot: for the cofinal class with logarithmic discrepancy, Landau gives Ω_± only; the mean square is RH-size
   given Θ (ARGUED); the pointwise bound is the Möbius sum Σ μ(k) r_b(x/k) for fixed r_b, open. Extendability
   lowers the value like 1/log X on the tested range and the exponent is undecided.
4. Controls: the separating step is Λ_a ≥ 0 with logarithmic discrepancy (fails for DH, sign twists, θ³,
   Beurling). E_a passes every step.

No statement about the location of zeros is obtained. The expected stop in the assignment ("the limit's tail is a
1/ζ Mellin integral") is reached in a stronger form: in the LP's normalisation the limit has no tail at all.

---

## 8. Three weakest steps

1. **Proposition 4 is ARGUED.** The bound 1/ζ ≪ |t|^ε right of Θ is quoted, and the fractional-Sobolev estimate
   for r_b is a sketch. Nothing else in this file depends on it.
2. **LP non-uniqueness and float arithmetic.** The optimum is a HiGHS vertex in float64; the fixed-t values G_x(j),
   the distances of Section 2 and the profile law μ(m)√m/σ(m) are properties of the vertex returned, and the
   optimal face was not explored. The statements that do not depend on the vertex are the objective values
   (ν₁, ext, cof) and Theorem 2. The sign γ_x > 0, used for "the limit of the optima is exactly 0", is measured.
3. **Range of the extension tests.** ext and cof are measured for X/x ≤ 256 and X ≤ 2.56·10⁶ only; the C/log X fit
   cannot distinguish a plateau at a positive multiple of √x from decay to a smaller power. In Section 6 the
   absence of real zeros of f_{DH} on (0, 2] is a grid evaluation, and the Beurling row is argued, not proved.

---

## Files

All in `tmp/research-2026-11-16/push/e1-cofinal-legendre-dual/`.
* `lplib.py`: the source's compact LP (`tmp/rha-legendre-dual-lp-compact.py`) with two added options: objective at
  a smaller scale, scale-dependent bound.
* `run_scan.py`, `scan.log`, `out/opt_*.npz`: optima on the grid. `analyse.py`, `analysis.log`, `out/analysis.json`.
* `check_restrict.py`: Lemma 1. `run_ext.py`, `ext_*.log`. `run_cof.py`, `cof_*.log`. `lam_floor.py`, `lam_floor.log`.
* `controls.py`, `controls.log`: Λ_a for ζ, DH, Liouville, E_a, θ³; DH on the real axis.
* The compute server was not used.
