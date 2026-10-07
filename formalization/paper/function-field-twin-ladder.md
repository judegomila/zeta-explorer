# The twin ladder for curves over finite fields (Route 27)

Date: 2026-10-06. Branch `editorial-redesign`. Internal working note, reviewed only by internal referees.

Scripts and outputs:
- `tmp/routes-b1-r27-ffladder.py` produces `tmp/routes-b1-r27-results.json` and the log `tmp/routes-b1-r27-ffladder.log`. Runtime is 16 s.
- `tmp/routes-b1-r27-ghost-eps.py` produces `tmp/routes-b1-r27-ghost-eps.json`.
- `tmp/routes-b1-r27-onesided.py` produces `tmp/routes-b1-r27-onesided.json`.

Interpreter: `/opt/homebrew/bin/python3` with numpy 2.4 and mpmath 1.4. The `/tmp/s145venv` and `/tmp/rhvenv` venvs could not be used. Their package `__init__.py` files and `pyvenv.cfg` are missing, so `flint` and `sympy` fail to import. All exact steps below therefore use Python integers and `fractions.Fraction`. No Arb ball arithmetic was used.

Labels used throughout:
- **[P]** means proved in this note. These are short standard arguments, written out in full.
- **[E]** means an exact-arithmetic computation using integer and rational arithmetic only. These results are decision procedures, not floating-point estimates.
- **[M]** means measured, in floating point (mpmath at 40–50 digits, or numpy).
- **[L]** means cited from the literature and not re-derived here.

Project status context: PT Λ ≤ 0.2 is the accepted benchmark. RH is open. Nothing in this note bears on Λ or claims progress on RH for ζ.

---

## 0. Summary

1. **Construction.** For a curve C/F_q of genus g, every object of the repo's twin ladder has an exact finite-dimensional counterpart:
   - the direct ladder (Euler product over closed points);
   - the dual ladder and the lossless bridge χ_C(s) = q^{(g−1)(1−2s)};
   - the shifted ratio R_a;
   - the Pick/de Branges kernel K_a;
   - the prime-delay domination statement (Re X'/X > 0);
   - the twin-ladder Weil form Q_TL;
   - the passive-system realization;
   - the heat flow, which gives a de Bruijn–Newman constant Λ_C.

   Specific facts:
   - R_a is a finite Blaschke product of degree 2g.
   - K_a has inertia (2g − ν_a, ν_a), where ν_a = #{zeros with Re λ > a}.
   - Q_TL is a Toeplitz form of rank 2g.
   - The three §18 approaches (passivity, prime-delay domination, Weil/Pontryagin index) are literally one statement: the Carathéodory–Toeplitz theorem applied to the sequence S_n = q^{−n/2} Σ α_i^n.

2. **The ladder property that encodes Weil's proof.** This is the main identity of the note [P, checked E]. Let Γ_j be the graph of F^j on C×C, and let P_j = Γ_j − H − q^j V be its primitive part. Then

   G_jk := q^j + q^k − Γ_j·Γ_k = −P_j·P_k = q^{(j+k)/2} S_{k−j}.

   So **the twin-ladder Weil form is minus the intersection form on primitive Frobenius-graph classes.** The Hodge index theorem (Castelnuovo–Severi, equivalently positivity of the Rosati involution) is exactly the statement Q_TL ≥ 0.

   In the language of §18, Approach III asks for an operator B with Q_TL[h] = ‖Bh‖² that is built without assuming RH. For curves that operator exists: B(c) = Σ_j c_j q^{−j/2} P_j ∈ NS(C×C)_prim ⊗ R, with norm −(intersection product). Its positivity is proved by Riemann–Roch on the surface C×C.

3. **Ladder data alone do not imply RH, even over F_q** [E]. The search found FE-compatible integer Weil-type polynomials that violate RH:
   - 17 with q = 3, g = 2;
   - 198 with q = 5, g = 2;
   - g = 1 examples (q = 5, a = 5; q = 7, a = −6).

   Each one has all of the following:
   - an exact Euler product with **non-negative integral closed-point counts** (checked exactly for d ≤ 60);
   - an exact functional equation with a lossless bridge;
   - rationality.

   None of them is the zeta function of a curve. The input that excludes them is geometric: realizability of the rung data as intersection numbers on a projective surface.

4. **Analogues for Q.** Present: the direct ladder, the bridge (Tate/Poisson), the explicit formula (Lefschetz ↔ Weil), and the Weil criterion as an equivalence. Absent:
   - (O1) finite genus; for ζ, S_0 = #zeros = ∞;
   - (O2) a lattice of delays; log p are Q-linearly independent, so there is no single Frobenius, no constant-field tower and no Adams operations;
   - (O3) a surface Spec Z × Spec Z with a Hodge index theorem;
   - (O4) a characteristic-0 analogue of the Stepanov derivative trick.

   The Q-analogue of the Hasse–Weil bound, ψ_h(x) = x + O_h(√x), is equivalent to RH.

5. **Quantitative facts that transfer to how the repo reads its own detectors.**
   - The function-field Λ_C is strictly negative for generic curves [M]. For elliptic curves it has the closed form Λ_E = 4 log(|a|/2√q)/(log q)² [P]. RH for one curve is therefore an open condition. ζ, by contrast, sits on the boundary (Λ ≥ 0, Rodgers–Tao).
   - A ghost at distance ε from the line enters the Weil form at **second order**: λ_min(T_{2g}) ≈ −C ε² [M].
   - Weil positivity restricted to delays shorter than about (2g − 1) log q, which is roughly log of the conductor, is satisfied by RH-violating Euler products [E].

---

## 1. Setup

Let C/F_q be a smooth projective geometrically irreducible curve of genus g. Write N_n = #C(F_{q^n}) and let a_d be the number of closed points of degree d, so that N_n = Σ_{d|n} d·a_d. Then

- Z(C,T) = ∏_x (1 − T^{deg x})^{−1} = exp(Σ_n N_n T^n/n) = P(T)/((1 − T)(1 − qT)),
- P(T) = ∏_{i=1}^{2g} (1 − α_i T) ∈ Z[T],
- ζ_C(s) = Z(C, q^{−s}).

The functional equation P(T) = q^g T^{2g} P(1/(qT)) [L, Weil] makes the multiset {α_i} closed under α ↦ q/α and under complex conjugation. Normalize β_i = α_i/√q. The Riemann hypothesis for C is |β_i| = 1 for all i. Weil proved it in 1948 [L].

**Real Weil polynomial.** Set u = 1/T + qT. Then P(T)/T^g = h(u), where

h(u) = c_g + Σ_{i=1}^{g} c_{g−i} D_i(u),

with D_0 = 2, D_1 = u, D_{i+1} = u D_i − q D_{i−1}, and c_k the coefficients of P. RH for C is equivalent to: all g roots t_j of h are real and satisfy t_j² ≤ 4q [P, elementary]. For each curve below this was decided exactly [E]:
- Yun squarefree decomposition;
- a Sturm count of real roots;
- a Sturm count of roots of R(v) = h(√v)h(−√v) in (4q, ∞).

---

## 2. The three ladder pieces

### 2.1 Direct ladder

The rungs are the closed points x, each with transfer factor (1 − q^{−s·deg x})^{−1}. The logarithmic derivative is the prime-delay echo train

−ζ_C'/ζ_C(s) = Σ_x Σ_{m≥1} (deg x · log q) q^{−s·m·deg x}.

The delays m·deg(x)·log q all lie on the lattice Z·log q. The ladder is therefore periodic in t with period 2π/log q, and its rung sums are integers (point counts). For ζ the delays m log p are Q-linearly independent. This is the first structural difference, and it is the root of obstruction (O2).

**Check [M].** ∏_{d≤60}(1 − T^d)^{−a_d} reproduces P(T)/((1 − T)(1 − qT)) at T = 0.4 e^{0.7i}/q to a relative error of 1.2·10⁻²⁶ for every curve. This equals the truncation tail.

A precision note: with log(1 − T^d) the check plateaued at 10⁻¹⁷, which was a cancellation artifact. Using log1p removed it.

### 2.2 Dual ladder and bridge

ζ_C(s) = χ_C(s) ζ_C(1 − s) with χ_C(s) = q^{(g−1)(1−2s)}. On Re s = 1/2, |χ_C| = 1, so the bridge is lossless. The bridge is elementary because there is no archimedean place. The part played by the Gamma factor for ζ is taken by the genus term (2g − 2 = deg K_C) and by the two pole factors (1 − T), (1 − qT), which are the H⁰ and H² contributions.

**Check [M].** The functional-equation relative error is ≤ 8·10⁻⁴¹ at three off-line points for every curve and every fake. The bridge modulus on the line is 1 to 40 digits.

### 2.3 Completed function X_C

Put w = s − 1/2 and z = q^{−w}. Then

X_C(w) := q^{gs} P(q^{−s}) = Σ_{j=−g}^{g} b_j z^j, with b_j = c_{g+j} q^{−(g+j)/2} and b_{−j} = b_j.

X_C is pole-free and even in w. It is real on the imaginary axis, where it is a cosine polynomial in θ = t log q. The half-plane Re w > 0 maps to the disc |z| < 1, and a zero λ of X_C corresponds to z = 1/β_i.

---

## 3. The §18 objects for curves

These are the objects of `src/data/three-attacks-section.js` and of the v52 paper §18.

### 3.1 R_a is a finite Blaschke product [P]

R_a(w) := X_C(w − a)/X_C(w + a). In the disc variable this is R_a(z) = X(q^a z)/X(q^{−a} z) = q^{−2ag} ∏_i (1 − β_i q^a z)/(1 − β_i q^{−a} z).

Assume RH, so |β_i| = 1. Then 1 − β_i q^a z = −β_i q^a (z − β̄_i q^{−a}), and ∏ β_i = 1 (the leading coefficient of P is q^g). Hence

**R_a(z) = ∏_{i=1}^{2g} b_{r_i}(z), where b_r(z) = (z − r)/(1 − r̄ z) and r_i = β̄_i q^{−a}.**

Without RH, every β_i with |β_i| > q^a contributes a pole inside the disc. Those factors are the inverse-Blaschke ghosts B_a^+ of §18.

**Check [M].** The identity holds to about 10⁻⁴¹ at a = 0.05 and a = 0.25 for every curve.

### 3.2 Pick kernel: exact negative index [P, M]

K_a(z,w) = (1 − R_a(z) R̄_a(w))/(1 − z w̄). R_a is rational of degree 2g, unimodular on |z| = 1, and has ν_a poles in the disc. By the finite-dimensional Krein–Langer theory [L], K_a then has exactly 2g − ν_a positive squares and ν_a negative squares, where ν_a = #{i : |β_i| > q^a}.

This is Theorem 18.3 (the finite-window ghost-index test) in exact, finite form. The window is the whole period strip, and the number of negative squares equals the ghost count.

**Check [M]** (24 sample points, eigenvalues at mpmath 40 digits):

| object | a = 0.02 | 0.1 | 0.3 | 0.6 | predicted ν_a |
|---|---|---|---|---|---|
| all 11 curves | (2g, 0) | (2g, 0) | (2g, 0) | (2g, 0) | 0 |
| fake g=1, q=5, a=+5 (ghost Re λ = 0.299) | (1,1) | (1,1) | (2,0) | (2,0) | 1,1,0,0 |
| fake g=2, q=5, mildest (Re λ = 0.101) | (3,1) | (3,1) | (4,0) | (4,0) | 1,1,0,0 |
| fake g=2, q=5, quadruple (Re λ = 0.120 ×2) | (2,2) | (2,2) | (4,0) | (4,0) | 2,2,0,0 |

The measured inertia matches the prediction in every case.

### 3.3 Prime-delay domination equals the Carathéodory property [P]

d/dw log X_C = (log q/2) Σ_i (1 + β_i z)/(1 − β_i z), and

Re[(1 + βz)/(1 − βz)] = (1 − |βz|²)/|1 − βz|².

So Re X'/X > 0 on Re w > 0 holds for all z with |z| < 1 if and only if every |β_i| ≤ 1. By the functional equation, that is equivalent to RH. This is Conjecture 18.2 for curves. Expanding in z gives

X'/X = log q · [ g + Σ_n (q^{n/2} + q^{−n/2}) z^n ] − log q · Σ_n q^{−n/2} N_n z^n.

The first bracket is the "G_∞" term (genus and poles). The second sum is the prime-delay echo train, Σ_x Σ_m (deg x · log q) q^{−m·deg x/2} z^{m·deg x}.

So X'/X is a Carathéodory function whose Herglotz measure is (log q/2) Σ_i δ_{θ_i}. By the Carathéodory–Toeplitz theorem, the Carathéodory property is equivalent to positive semidefiniteness of the Toeplitz matrices [S_{j−k}].

**Approaches II and III are therefore the same statement.**

**Check [M]:** the minimum of Re d log X/dw over |z| ∈ {0.3, 0.6, 0.9, 0.97}, with 720 angles each:
- curves: between 0.029 and 0.19, always positive;
- fakes: between −1.5 and −1.85·10³, always negative.

### 3.4 Weil form and its exact negative index [P, E]

Write S_n = q^{−n/2} Σ_i α_i^n. Then S_n = S_{−n} is real, S_0 = 2g, and

S_n = q^{n/2} + q^{−n/2} − q^{−n/2} N_n,

which is the explicit formula, equivalently the Lefschetz trace formula. For finitely supported c ∈ C^Z,

Q_TL[c] := Σ_{j,k} c_j c̄_k S_{j−k} = Σ_i |Σ_j c_j β_i^j|²   (under RH).

**Proposition (exact ghost index) [P].** Let ν be the number of distinct pairs {β, 1/β̄} with |β| ≠ 1. For every N ≥ #(distinct β_i), and in particular for N ≥ 2g, the N×N Toeplitz matrix T_N = [S_{j−k}] has exactly ν negative eigenvalues.

*Proof.* Write T_N = Σ_i ū_{σ(i)} u_iᵀ, where (u_i)_k = β_i^k and σ is the involution β ↦ 1/β̄. The multiset is closed under σ by the functional equation and conjugation. As a Hermitian form, x* T_N x = Σ_{i fixed by σ} |u_iᵀx|² + Σ_{σ-pairs} 2 Re(conj(u_{σ(i)}ᵀx) · u_iᵀx). The vectors u_i for distinct β_i are linearly independent (Vandermonde). Each 2-cycle therefore contributes signature (1,1), and each fixed point contributes (1,0). ∎

**Corollary.** RH for C is equivalent to T_{2g} ⪰ 0. This is a finite test with delays ≤ (2g − 1) log q. Every FE-compatible violation is detected at some N ≤ 2g.

**Check [E]** (exact integer Gram matrix, §4.2; minimal detecting size N_det):

| fake | Hodge-Gram inertia (n₊, n₋, n₀), M = 2g+2 | N_det | first n with S_n² > 4g² (Hasse fails at level n) |
|---|---|---|---|
| g=1 q=5 P = 1−5T+5T² | (1, 1, 2) | 2 | 1 |
| g=1 q=7 P = 1+6T+7T² | (1, 1, 2) | 2 | 1 |
| g=2 q=3 P = 1−T−3T²−3T³+9T⁴ | (3, 1, 2) | 4 | 5 |
| g=2 q=3 P = 1−T+7T²−3T³+9T⁴ | (2, 2, 2) | 3 | 2 |
| g=2 q=5 P = 1−T−6T²−5T³+25T⁴ | (3, 1, 2) | 4 | 5 |
| g=2 q=5 P = 1−T+11T²−5T³+25T⁴ | (2, 2, 2) | 3 | 2 |

For the mildest g = 2 fakes the full Toeplitz test detects the ghost at size 4 (delay 3 log q). The single-level Hasse/Castelnuovo test |S_n| ≤ 2g, which is a 2×2 minor, first fails at n = 5. T_1, T_2 and T_3 are positive semidefinite for these fakes.

This gives the following. **Weil positivity restricted to delays ≤ 2 log q holds for an RH-violating Euler product.** Weil positivity with restricted support carries RH information only once the support reaches the scale (2g − 1) log q. That scale is comparable to log(conductor) = (2g − 2) log q. This matches the repo's detector uncertainty principle for ζ, where the support needed grows like log γ (route H of the 2026-09-23 sweep).

**Second-order sensitivity [M]** (`tmp/routes-b1-r27-ghost-eps.json`). Take a ghost pair β = e^{±ε} added to on-circle spectra. Then λ_min(T_{2g}) / ε² converges as ε → 0, with exactly one negative eigenvalue:

| g | ε = 10⁻¹ | 10⁻³ | 10⁻⁶ |
|---|---|---|---|
| 2 | −0.1656 | −0.1586 | −0.1586 |
| 3 | −0.5162 | −0.4701 | −0.4701 |
| 4 | −0.8772 | −0.7297 | −0.7297 |

A zero displaced by ε from the critical line shows up in Weil positivity only at order ε². The JSON field `detection_size_random_ghosts` records a floating-point experiment on random spectra with ε ∈ [10⁻³, 10^{−0.5}], 200 trials per g. With a relative eigenvalue threshold of 10⁻¹⁰, the ghost is not flagged by N = 2g in 1% (g = 2) to 13.5% (g = 5) of trials, and is still not flagged at N = 2g + 2 in 0–5.5% of trials. These misses are threshold artifacts of the ε² scaling, not counterexamples to the exact Proposition.

### 3.5 Passive realization: R_a is the determinant of a characteristic function [P]

Let U be the operator q^{−1/2}·Frob acting on H¹(C) (ℓ-adic, or any 2g-dimensional model with eigenvalues β_i), and let r = q^{−a}. Suppose U is unitary for some positive inner product. The Sz.-Nagy–Foias characteristic function of the contraction A = rU is

Θ_A(z) = −A + z D_{A*}(I − zA*)^{−1} D_A = (z − rU)(I − z r U*)^{−1}.

Hence det Θ_{rU}(z) = ∏_i (z − rβ_i)/(1 − rβ̄_i z) = R_a(z), because the multiset {β_i} is closed under conjugation. So the twin-ladder ratio is the transfer function (determinant) of a finite-dimensional passive system: state space H¹(C), main operator q^{−a}U.

- **Passivity** (Conjecture 18.1) holds exactly when U is unitary for a positive Hermitian form. That positive form is the polarization (Rosati).
- **The functional equation** holds exactly when U is symplectic for the cup-product pairing (Poincaré duality). The associated Hermitian form i·ω(x, ȳ) has signature (g, g), so it is a Krein form.

FE alone therefore gives a Pontryagin/Krein realization, where ghosts are isotropic pairs. RH is the extra statement that the symplectic Frobenius lies in a compact form, which is USp(2g) [L, Katz–Sarnak].

**Check [M].** With H = (VV*)^{−1}, where V is the eigenvector Vandermonde matrix, the residual ‖U*HU − H‖/‖H‖ is ≤ 5·10⁻⁴¹ for all curves with distinct eigenvalues. For the fakes it is between 0.12 and 0.28.

### 3.6 Heat flow and the function-field de Bruijn–Newman constant [P, M]

With the repo's normalization X(w) = 8∫Φ(u) cosh(2wu) du, the rung at k·log q sits at u_k = k log q/2. The heat flow e^{tu²} acts on the cosine polynomial as

H_t(θ) = b_0 + 2 Σ_{k=1}^{g} b_k e^{t(k log q)²/4} cos kθ.

Write H_t as a polynomial in x = cos θ. Define Λ_C = inf{t : H_t has only real zeros}. Pólya's theorem (e^{−τD²} preserves the Laguerre–Pólya class [L]) makes the set of such t an interval [Λ_C, ∞). RH for C is equivalent to Λ_C ≤ 0.

- **Elliptic closed form [P].** H_t(θ) = 2e^{t(log q)²/4} cos θ − a/√q, so **Λ_E = 4 log(|a|/(2√q)) / (log q)²**. This equals −∞ when a = 0. The bisection reproduces it, for example τ = log(3/(2√5)) = −0.39925 for E/F_5.
- **Curves [M]** (Λ_C in ξ-normalization):

  | curve | g | Λ_C |
  |---|---|---|
  | E: y²=x³+x+1/F₅ | 1 | −0.6165 |
  | E: y²=x³+x+1/F₇ | 1 | −0.5995 |
  | E: y²=x³+x+1/F₁₃ | 1 | −0.3583 |
  | E: y²=x³+2x+1/F₁₁ | 1 | −0.3519 |
  | E: y²=x³−x/F₃ (supersingular, a=0) | 1 | −∞ |
  | E: y²=x³−x/F₉ (maximal, a=−6=−2√9) | 1 | 0 (exact; double zero) |
  | C2: y²=x⁵+x²+1/F₃ | 2 | −0.1691 |
  | C2: y²=x⁵−x+1/F₅ | 2 | −0.0851 |
  | C2: y²=x⁶+x+1/F₇ | 2 | −0.1262 |
  | C3: y²=x⁷+x+1/F₃ | 3 | −0.2023 |
  | C3: y²=x⁷−x+2/F₅ | 3 | −0.0891 |
  | fakes | 1–2 | +0.020 to +0.172 |

- **Family [E point counts, then P formula].** For every prime p ≤ 97, every a with |a| ≤ 2√p occurs as an a_p over F_p; the counts confirm Deuring for these p. Hence sup_{E/F_p} Λ_E = 4 log(⌊2√p⌋/(2√p))/(log p)². Values: −0.172 (p=5), −0.018 (p=13), −0.0011 (p=73), −0.0069 (p=97). This tends to 0 along primes with 2√p close to an integer. Newman's conjecture fails for a single curve (Λ_C < 0) and holds in the family sense (sup = 0); compare Andrade–Chang–Miller [L, not re-verified].

**Reading.** For a curve with simple zeros away from θ ∈ {0, π}, RH is an open condition on the 2g-dimensional coefficient vector. ζ has Λ ≥ 0 (Rodgers–Tao) and sits on the boundary. The repo's flow-blindness no-go (`formalization/paper/flow-blindness-no-go.tex`) and the NS-RIGID dichotomy rely on that boundary position. Over F_q there is no such no-go for a single curve. The absence is not evidence that soft methods prove RH over F_q: soft methods give no reason for Λ_C ≤ 0 in the first place, as the fakes with Λ > 0 show.

---

## 4. Which ladder property each proof ingredient supplies

### 4.1 Frobenius as an operator (Lefschetz)

**Ladder statement.** The rung sums are traces of the powers of one operator: S_n = Tr(U^n | H¹), and N_n = Σ_i (−1)^i Tr(F^n | H^i). Equivalently:
- the ladder delays lie on a lattice;
- the Toeplitz form has finite rank 2g;
- R_a is a finite Blaschke product;
- the zeta function is the characteristic polynomial of a transfer matrix.

**Role in the proof.** This supplies the space on which positivity is to be proved. On its own it gives the functional equation (Poincaré duality makes U symplectic, §3.5), not RH. The repo's frozen-ladder observation (imp-3932: frozen ladder dimension bounded by the zero count) is the Q-shadow of this fact. Over F_q the frozen ladder is exactly H¹, of dimension 2g.

### 4.2 Positivity of the intersection form (Hodge index, Castelnuovo–Severi, Rosati)

**Identity [P].** On C×C let H = C×{pt} and V = {pt}×C, so H² = V² = 0 and H·V = 1. Let Γ_j be the graph of F^j, with Γ_0 = Δ. Then:
- Γ_j·V = 1 and Γ_j·H = q^j;
- Γ_j² = q^j(2 − 2g) (adjunction, deg F^j = q^j);
- for j < k, Γ_j·Γ_k = q^j N_{k−j} (transversal, since dF = 0).

The primitive part P_j = Γ_j − H − q^j V satisfies P_j·H = P_j·V = 0, and a direct expansion gives

P_j·P_k = Γ_j·Γ_k − q^j − q^k = −q^{(j+k)/2} S_{k−j}   (j ≠ k),   P_j² = −2g q^j = −q^j S_0.

So **G_jk := q^j + q^k − Γ_j·Γ_k = q^{(j+k)/2} [S_{j−k}]_{jk}**. In words:
- the twin-ladder Weil form is minus the intersection form on primitive Frobenius-graph classes;
- subtracting H and V is exactly subtracting the pole terms q^{±n/2} from the explicit formula;
- the n = 0 entry S_0 = 2g = −(Δ² − 2) is the Euler-characteristic, or self-intersection-of-the-diagonal, term that plays the role of the archimedean term A_∞ in Q_TL.

The Hodge index theorem says NS(C×C) has signature (1, ρ − 1). Since ⟨H, V⟩ already carries the one positive direction, its orthogonal complement is negative definite. Hence G ⪰ 0, so Q_TL ≥ 0, so RH.
- *Castelnuovo–Severi, the 2×2 case.* For D = mΔ + nΓ_F, the inequality D² ≤ 2(D·H)(D·V) is exactly positive semidefiniteness of [[S_0, S_1], [S_1, S_0]] (after rescaling n → n/√q). This is Weil's |N_1 − q − 1| ≤ 2g√q. Applied to Γ_{F^n} it gives |S_n| ≤ 2g for all n. The radius argument then gives |β_i| ≤ 1, and the functional equation gives |β_i| = 1.
- *Rosati form.* For u = Σ_j c_j U^j ∈ End(J) ⊗ C, Tr(u u†) = Σ_{j,k} c_j c̄_k Tr(U^{j−k}) = Q_TL[c], because U† = U^{−1} under the Rosati involution (F'F = q). Positivity of the Rosati involution, which comes from the ample class, gives Q_TL ≥ 0.

**Check [E].** For every curve the integer Gram matrix G (size M = 2g + 2, entries built from point counts) has exact inertia (2g, 0, 2). For the maximal curve over F₉, where F = [−3] and Q[F] is one-dimensional, the inertia is (1, 0, 3). The relation G = D·Toep(S)·D holds to about 10⁻⁴⁰ [M]. The point counts N_1..N_{g+2} were computed by direct enumeration over F_{p^n}. For the maximal curve only N_1 and N_2 were counted, over F₉ and F₈₁. The first g of them determine P. The remaining one or two match the values predicted from P exactly, which cross-checks the whole pipeline. Gram entries with k − j > g+2 use N_n predicted from P (rationality, a theorem).

**Approach III.** The blocker in `three-attacks-section.js` is: "Build B such that Q_TL[h] = ‖Bh‖² for every admissible coherent shell h, constructed without using RH." For curves, B: c ↦ Σ_j c_j q^{−j/2} P_j is that operator. The target is NS(C×C)_prim ⊗ R with the negated intersection form. Realizability as a Gram matrix is trivial for any positive-semidefinite kernel (GNS), so it is not the content. **The content is that the target space and its positivity are constructed independently of the zeros, as divisor classes on a projective surface, with positivity proved by Riemann–Roch.** In the Hodge index proof, D² > 0 implies that ±nD is effective for large n, which is incompatible with D·H = 0.

### 4.3 Bombieri–Stepanov counting

**Ladder statement.** A one-sided rung bound at every level: N_n ≤ q^n + 1 + C_g q^{n/2} for all n. It is proved with an auxiliary function on C that vanishes to high order at the F_{q^n}-points. The two ingredients are Riemann–Roch dimension counts on C and the fact that x ↦ x^q has derivative 0. The lower bound comes from a separate step: applying the upper bound to a Galois cover and its twists and averaging over the group [L, Bombieri 1973].

**The one-sided bound alone does not exclude a real positive ghost [E].** Excesses over n ≤ 200, normalized by 2g q^{n/2} (`tmp/routes-b1-r27-onesided.json`):

| object | sup (N_n − q^n − 1)/(2g q^{n/2}) | sup (q^n + 1 − N_n)/(2g q^{n/2}) |
|---|---|---|
| all curves | ≤ 1 | ≤ 1 |
| fake g=1 q=5 (β = +1.618) | **−1.118** | 3.1·10⁴¹ |
| fake g=2 q=3 mildest (real positive ghost) | **−0.144** | 5.1·10¹⁷ |
| fake g=2 q=5 mildest (real positive ghost) | **−0.112** | 3.1·10¹³ |
| fake g=1 q=7 (β negative) | 8.7·10⁴³ | 1.4·10⁴⁴ |
| fakes with complex ghosts | ~10¹⁶–10²¹ | ~10¹⁶–10²¹ |

A real ghost β > 1 satisfies the Stepanov-side bound with C = 0. It is excluded only by the lower bound, which needs the cover/twist averaging, a positivity input. The same structure appears over Q: one-sided or positivity information (Landau-type arguments, sieve upper bounds) does not exclude a real exceptional zero. Function-field real ghosts are the counterpart of Landau–Siegel zeros.

### 4.4 Constant-field tower (all n at once)

Weil's and Bombieri's arguments both use every level F_{q^n}. A bound on a single rung |S_n| for all n implies RH via the radius of convergence of Σ S_n z^n. On the ladder, base change to F_{q^n} is decimation of the lattice, β ↦ β^n (an Adams operation). It exists because the delays lie on Z·log q.

---

## 5. Explicit examples

Exact data; N columns are direct counts.

| curve | g | N_1, N_2, … (direct) | P(T) | h(u) | closed points a_1..a_5 |
|---|---|---|---|---|---|
| y²=x³+x+1 / F₅ | 1 | 9, 27, 108 | 1+3T+5T² | u+3 | 9, 9, 33, 162, 612 |
| y²=x³+x+1 / F₇ | 1 | 5, 55, 380 | 1−3T+7T² | u−3 | 5, 25, 125, 605, 3354 |
| y²=x³+2x+1 / F₁₁ | 1 | 16, 128, 1264 | 1+4T+11T² | u+4 | 16, 56, 416, 3680, 32192 |
| y²=x³+x+1 / F₁₃ | 1 | 18, 180, 2106 | 1+4T+13T² | u+4 | 18, 81, 696, 7155, 74304 |
| y²=x³−x / F₃ | 1 | 4, 16, 28 | 1+3T² | u | 4, 6, 8, 12, 48 |
| y²=x³−x / F₉ | 1 | 16, 64 | 1+6T+9T² = (1+3T)² | u+6 | 16, 24, 256, 1584, 11904 |
| y²=x⁵+x²+1 / F₃ | 2 | 6, 18, 18, 78 | 1+2T+6T²+6T³+9T⁴ | u²+2u | 6, 6, 4, 15, 48 |
| y²=x⁵−x+1 / F₅ | 2 | 11, 31, 101, 651 | 1+5T+15T²+25T³+25T⁴ | u²+5u+5 | 11, 10, 30, 155, 623 |
| y²=x⁶+x+1 / F₇ | 2 | 9, 67, 339, 2443 | 1+T+9T²+7T³+49T⁴ | u²+u−5 | 9, 29, 110, 594, 3327 |
| y²=x⁷+x+1 / F₃ | 3 | 4, 10, 46, 82, 244 | 1+6T³+27T⁶ | u³−9u+6 | 4, 3, 14, 18, 48 |
| y²=x⁷−x+2 / F₅ | 3 | 3, 35, 129, 683, 3183 | 1−3T+9T²−17T³+45T⁴−75T⁵+125T⁶ | u³−3u²−6u+13 | 3, 16, 42, 162, 636 |

For every curve the following were verified:
- [E] RH decided exactly by Sturm: all t_j are real with t_j² ≤ 4q.
- [E] Exact Hasse–Weil at every level n ≤ 400: S_n² ≤ 4g² for integer s_n = q^{n/2}S_n, checked as s_n² ≤ 4g²qⁿ.
- [E] Hodge Gram inertia (2g, 0, 2), or (1, 0, 3) for the maximal curve.
- [E] Closed-point counts are integral and non-negative for d ≤ 60.
- [M] |β_i| = 1 to 25 printed digits.
- [M] Pick inertia (2g, 0) at every a.
- [M] The Carathéodory minimum is positive.

---

## 6. What the ladder data do not force

**Fakes [E].** g = 2 integer polynomials P = 1 + c₁T + c₂T² + qc₁T³ + q²T⁴ with |c₁| ≤ 2q and |c₂| ≤ 6q, and g = 1 polynomials with |a| > 2√q, were filtered by:
- (i) the functional equation (built in);
- (ii) closed-point counts a_d = (1/d)Σ μ(d/e)N_e integral and non-negative for all d ≤ 60 (exact);
- (iii) RH false (exact Sturm decision).

For d > 60, non-negativity follows from the elementary bound d·a_d ≥ N_d − Σ_{e|d, e≤d/2} N_e. Here N_e = q^e + 1 − Σα_i^e and max|α_i| ≤ q^{0.8} for all listed fakes, so the q^d term dominates. This step is stated, not machine-checked.

Survivors: 17 for q = 3 and 198 for q = 5 (g = 2), plus the g = 1 examples. Each is an exact Euler product over a set of "closed points" with the right counts in every degree, with a functional equation, a lossless bridge, rationality, Λ > 0, and ghost index ν ∈ {1, 2}. None is the zeta function of a curve. The g = 1 cases violate Hasse at n = 1, and the g = 2 cases violate the Hodge-index Gram positivity. The data that separate them from curves are not ladder axioms. They are realizability of N_n as fixed-point counts of the powers of one morphism on a curve, together with the intersection theory of C×C.

This is the function-field form of the repo's earlier lessons:
- route C, where FE-compatible sign choices rebuild Davenport–Heilbronn off-line zeros;
- NS-RIGID (imp-95530), where every input expressible in the native span is either soft or RH itself.

Over F_q, "Euler product + FE + integrality" is still soft in that sense. The non-soft input is the surface.

---

## 7. Dictionary

| Function field C/F_q | Twin-ladder object | Q (ζ) | Analogue for Q? |
|---|---|---|---|
| closed points x, deg x | direct-ladder rungs, delay m·deg x·log q ∈ Z log q | primes p, delay m log p (Q-independent) | rungs yes; lattice **no** (O2) |
| Euler product = Z(C,T) | direct ladder | Euler product | yes |
| P(T)=det(1−TF\|H¹), finite degree 2g | frozen ladder = finite transfer matrix | ξ has infinitely many zeros | **no** (O1) |
| FE from Poincaré duality; χ_C = q^{(g−1)(1−2s)} | lossless bridge, \|χ\|=1 on line | χ(s) with Gamma factor (Tate/Poisson) | yes |
| U symplectic (cup product) | Krein realization, ghosts isotropic | FE gives a Krein/Pontryagin form (§18) | yes (indefinite only) |
| Lefschetz N_n = Σ(−1)^i Tr F^n\|H^i | explicit formula S_n = q^{n/2}+q^{−n/2}−q^{−n/2}N_n | Weil explicit formula | yes |
| pole terms (H⁰, H²) = classes H, V | G_∞ pole part; projection to primitive | 1/s, 1/(s−1) terms | yes |
| 2g−2 = −Δ²+…; S_0 = 2g | A_∞ / genus term | archimedean distribution; S_0 = ∞ | **regularized only** (O1) |
| Pick kernel K_a, inertia (2g−ν_a, ν_a) | Theorem 18.3 (ghost index) | K_a on de Branges space | statement yes; finite rank **no** |
| R_a = finite Blaschke product | Schur ratio | infinite Blaschke × Gamma ratio | partial |
| X'/X Carathéodory | Conj 18.2 (prime-delay domination) | Re ξ'/ξ > 0 on Re > ½ (RH-equivalent) | statement yes |
| T_{2g}[S] ⪰ 0, finite test | Q_TL ≥ 0, Conj 18.4 | Weil criterion (all supports) | equivalence yes; finiteness **no** |
| G = −(P_j·P_k) on NS(C×C)_prim | **B with Q_TL = ‖Bh‖²** | no surface Spec Z × Spec Z | **no** (O3) |
| Hodge index / Castelnuovo–Severi / Rosati | proof of Q_TL ≥ 0 | (none known; Connes–Consani program) | **no** (O3) |
| Bombieri–Stepanov one-sided count | one-sided rung bound | ψ(x) ≤ x + C√x would need RH-type input; derivative trick has no char-0 form | **no** (O4) |
| constant-field tower F_{q^n} | lattice decimation β ↦ β^n | ζ(ns) is not a base change | **no** (O2) |
| Hasse–Weil \|N_n−q^n−1\| ≤ 2g q^{n/2} | \|S_n\| ≤ S_0 | ψ_h(x) = x + O_h(√x) | equivalent to RH |
| Λ_C < 0 generically; Λ_E = 4log(\|a\|/2√q)/log²q | heat flow | 0 ≤ Λ ≤ 0.2 (Rodgers–Tao; PT) | boundary vs interior |
| real ghost β>1 passes one-sided bound | real pole of R_a | Landau–Siegel zero | same structure |
| detection support ≤ (2g−1) log q ~ log conductor | finite-support Euler detector | support ~ log(γ/2π) (route H) | same scaling |

---

## 8. Attempting the lift, and where it stops

To repeat Weil's proof for ζ one needs four things:

1. **A space carrying "Frobenius-graph" classes Γ_x for x ∈ R_+^*.** These would be graphs of the scaling action, with Γ_x·Γ_y equal to the Weil distribution at log(y/x) after removing pole and archimedean parts. The explicit formula supplies the numbers. Connes' trace formula and the Connes–Consani arithmetic and scaling sites [L] supply candidate spaces. The repo's Route I semilocal identity for S = {∞, 2} (Tr(ϑ(f)PP̂_SP) = W_∞ + W_2 + D_S, memory note) is the closest object computed in-repo. Its remainder D_S is 96.7–99.7% of the trace on the pole-free minimizer, so it is not yet a positive intersection form.

2. **A primitive projection.** This is available: subtract the pole terms. Over F_q it is the projection off ⟨H, V⟩.

3. **A positivity theorem on primitive classes proved independently of the zeros** (a Hodge index theorem). Over F_q this follows from Riemann–Roch on C×C. Over Q, arithmetic Riemann–Roch exists for Spec Z̄ (Arakelov, Gillet–Soulé; Connes–Consani's Riemann–Roch for Spec Z [L]), which is the analogue of Riemann–Roch on C. The arithmetic Hodge index theorem (Faltings, Hriljac [L]) applies to arithmetic surfaces X → Spec Z, the analogue of a surface fibred over a curve, not of C×C. No product "Spec Z × Spec Z" with an intersection theory is known. **This is the obstruction (O3), and it is exactly the Approach III blocker.**

4. **Finiteness or regularization.** Over F_q, S_0 = 2g < ∞. The tower argument and the finite Toeplitz test need this. Over Q, S_0 = ∞, and the primitive space would be infinite-dimensional, with the archimedean term acting as the regularized self-intersection of the diagonal (O1). The F_q computations show what regularization costs. Support-limited positivity is satisfied by fakes (§3.4), and a ghost at distance ε contributes at order ε², so any inequality-based regularization has to resolve ε² at support ~ log(conductor). This is consistent with the repo's measured loss of 5–6 digits for every inequality route (2026-09-23 sweep).

**Verdict on Route 27.**
- The function-field twin ladder is built exactly, with exact computations for 11 curves (g = 1, 2, 3) and 6 analysed fakes, drawn from a census of 215 g = 2 fakes plus the g = 1 cases.
- The ladder property that encodes the Weil-conjecture proof is identified exactly. It is the identity Q_TL = −(intersection form on primitive Frobenius-graph classes), and positivity of that form is the Hodge index theorem.
- In repo terms, Weil's proof is Approach III with B constructed geometrically. Approaches I and II reduce to the same statement through the Sz.-Nagy–Foias determinant and the Carathéodory–Toeplitz theorem.
- The lift to Q fails at (O3): there is no surface and no Hodge index theorem. It also needs a regularization of (O1) that the F_q computations show to be second-order sensitive.
- No result about ζ is claimed. RH remains open.

## References (cited, not re-verified in this note)

- A. Weil, *Sur les courbes algébriques et les variétés qui s'en déduisent* (1948).
- A. Mattuck, J. Tate (1958); A. Grothendieck (1958): Hodge index proofs of RH for curves.
- S. A. Stepanov (1969); E. Bombieri, Séminaire Bourbaki 430 (1973).
- P. Deligne, *La conjecture de Weil I* (1974).
- N. Katz, P. Sarnak, *Random matrices, Frobenius eigenvalues and monodromy* (1999).
- M. G. Krein, H. Langer: generalized Schur class; B. Sz.-Nagy, C. Foias: characteristic functions.
- G. Pólya: Laguerre–Pólya class and e^{−τD²}. N. G. de Bruijn (1950); B. Rodgers, T. Tao (2020): Λ ≥ 0. D. Platt, T. Trudgian: Λ ≤ 0.2.
- J. Andrade, A. Chang, S. J. Miller: Newman's conjecture in function fields.
- A. Connes, *An essay on the Riemann hypothesis* (2016); A. Connes, C. Consani: arithmetic site, scaling site, Weil positivity at the archimedean place, Riemann–Roch for Spec Z.
- G. Faltings (1984), P. Hriljac (1985): arithmetic Hodge index.
