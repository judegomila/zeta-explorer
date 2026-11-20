# n4-kunneth-multiple-euler: k-fold additive convolution of zeros and the multiple Euler product

Verdict: **precise obstruction; lane closed by the first test.** The abscissa of absolute convergence of the k-fold Euler series is k (defect k/2, i.e. 1/2 per factor, the trivial bound Theta <= 1). Removing the pole terms does not lower it and removes the positivity that Deligne's mechanism needs. No statement about zeros of zeta is claimed.

Files: `double_euler.py`, `double_euler.log`, `double_euler.json` (first test, 12 s, run through `scripts/memcap.sh 8`); `residue_check.py`, `residue_check.log` (control that refuted one of my own intermediate claims).

Notation: N, M run over prime powers, Lambda the von Mangoldt function, kappa(M) = Lambda(M)/log M, L(w) = -zeta'/zeta(w), E(x) = psi(x) - x, L_0(w) = L(w) - 1/(w-1) = int_1^inf x^{-w} dE(x), Theta = sup Re rho.

## 1. Plan and what is new against the map

The idea (Kurokawa's programme, stated in Akatsuka, RIMS Kokyuroku 1806 (2012), section 1): zeta^{(x)k} has zeros at rho_1 + ... + rho_k (all Im > 0), in particular at k rho; a zero-free half-plane Re s > B_k gives Theta <= B_k / k; if B_k <= k/2 + C for infinitely many k then RH. Rows P25, Q10, T2 of the map do not treat this object. T2 notes that the multiplicity step of Stepanov needs f(s)^k = f(ks); the additive tensor power is the characteristic-0 replacement for that step.

Order of work: (a) abscissa for k = 2 by hand, (b) numerical growth test, (c) Deligne's mechanism, (d) controls.

## 2. Work

### 2.1 Lemma K1 (the implication) - PROVED, elementary, content-free

Let Z_k(s) be the regularised product over (rho_1,...,rho_k), all Im > 0, of (s - rho_1 - ... - rho_k) (pure part, no pole or trivial-zero factors). By the regularised-product theorem (Illusie; quoted as Prop. 1.2 in Akatsuka's survey) Z_k vanishes at k rho for every zero rho with Im rho > 0. Zeros with Im > 0 are symmetric under rho -> 1 - conj(rho), so sup Re over them is Theta >= 1/2. Hence: if Z_k is zero-free in Re s > B_k, then Theta <= B_k / k; if B_k <= k/2 + C for infinitely many k, then Theta = 1/2.

The function that must be zero-free is Z_k itself. "Absolute convergence of the Euler product" gives this only if every term of the expression for log Z_k converges to a holomorphic function there. Section 2.3 shows the prime-pair series is not the whole expression and does not carry the zeros.

### 2.2 The denominators are divided differences (Lemma K2 is not needed) - PROVED, checked to 1e-13

For u = log N, v = log M and a = s - 2:

  [N^{-a} - M^{-a}] / (log N - log M) = -a int_0^1 N^{-a th} M^{-a(1-th)} d th.

Hence for every finite cutoff X, with Psi_X(w) = sum_{N<=X} Lambda(N) N^{-w}:

  sum_{N,M<=X} Lambda(N) Lambda(M) (NM)^{-1} [N^{-(s-2)} - M^{-(s-2)}]/(log N - log M)  =  - int_1^{s-1} Psi_X(w) Psi_X(s-w) dw

(diagonal N = M read as the limit; straight segment). The symmetrised prime-pair series is the convolution of L with itself along the segment from 1 to s-1. Numerical check of the O(n^2) double sum against the 1-D integral: relative error <= 1.4e-13 at all seven s and seven cutoffs (`double_euler.log`).

Consequences.
- The small denominators m log p - n log q cancel after symmetrisation. The spacing |N - M| >= 1 is never used; the lower bound of K2 gives 1/|log N - log M| <= max(N, M), which is exactly the factor that turns N^{-s} into N^{-(s-1)} and gives abscissa 2. K2 is true and yields only the trivial bound.
- General k (Hermite-Genocchi): sum_j N_j^{-(s-k)} / prod_{i != j}(log N_j - log N_i) is the (k-1)-th divided difference of u -> e^{-(s-k)u}, equal to (-(s-k))^{k-1} int over the simplex of prod_j N_j^{-(s-k) th_j}. The k-fold series is the convolution of k copies of L over the simplex w_1 + ... + w_k = s, Re w_j >= 1.
- Relation to Akatsuka's first sum G(s) = sum_{N != M} Lambda(N) kappa(M) N^{-(s-1)} M^{-1} / (log N - log M): writing log N = (log N - log M) + log M, G'(s) = -[L(s-1) log zeta(1+eps) - (1/2) int_{1+eps}^{s-1} L(w) L(s+eps-w) dw + diagonal] in the limit eps -> 0 (each bracketed term diverges like log log; the combination is finite). ARGUED (formal regularisation, not written out).

### 2.3 Test (a): abscissa for k = 2 is 2 - CLASSICAL, lower bound re-proved

Source read: Akatsuka's survey, Theorem 2 (= Akatsuka, Commun. Number Theory Phys. 2009, Thm 1.3): for Re s > 2,

  (zeta (x) zeta)(s) = exp( (1/pi i) sum_{p,m} sum_{q^n != p^m} p^{-m(s-1)} q^{-n} log p / (n (m log p - n log q))
   - (1/pi i) sum p^{-ms} q^{-n} log p / (n (m log p + n log q)) + (1/pi i) int_0^1 (zeta'/zeta)(s-u) log|zeta(u)| du ) * zeta(s-1)^{-1} R(s).

Remark 2.2 there: the first sum and the integral converge absolutely exactly for Re s > 2; "it is impossible to improve the convergent domain", since first sum ~ (1/2 pi i)(log(s-2))^2 and the integral ~ -(1/2 pi i)(log(s-2))^2 as s -> 2. Koyama-Kurokawa's own double Euler product (their [KK2]) carries an extra parameter; in the notation of 2.2 this is the anchor c of the segment [c, s-c], and absolute convergence needs c > 1 and Re(s - c) > 1.

Hand derivation of the lower bound (PROVED). For Re s = sigma < 2, a = s - 2, and v <= log 2 < u/2: |D_s(u,v)| >= (e^{(2-sigma)u} - e^{(2-sigma)u/2})/u >= e^{(2-sigma)u}/(2u) for large u. So the total variation of the pair series is at least const * sum_N Lambda(N) N^{1-sigma}/log N = infinity, with partial sums >= c X^{2-sigma}/log X. The divergence comes from pairs with M << N (far off-diagonal), not from near-coincidences. For general k the same bound on the divided difference (mass of the simplex within 1/((k-sigma) u_1) of the vertex) gives partial sums >= c X^{k-sigma}/(log X)^{k-1}: **sigma_k >= k**. PROVED for the total variation of the k-fold series in the form of 2.2; convergence for Re s > k is Akatsuka for k = 2 and ARGUED for k > 2.

Pure part. Replace d psi by dE = d psi - dx in both variables: P(s) = - int_1^{s-1} L_0(w) L_0(s-w) dw.
- Total variation: |dE| = d psi + dx. The lower bound above used only the mass of |dE| on [1,2) and of d psi at N. **The abscissa of absolute convergence of the pure part is also 2** (k in general). PROVED.
- Conditional convergence: the box-truncated sums converge to P(s) locally uniformly on Re s > 1 + Theta (classical: int_1^X x^{-w} dE converges locally uniformly on Re w > Theta, and the segment stays in Re w >= min(1, Re s - 1)). With anchor c in (Theta, 1] the region is Re s > c + Theta, down to 2 Theta. Unconditionally only c = 1 is available. So the answer to "2 or 3/2": **2 for absolute convergence; 1 + Theta for conditional convergence of the pure series anchored at 1, which is 3/2 if and only if RH.** Both are restatements: the first is the pole, the second is Theta.
- The pair series does not carry the zeros rho_1 + rho_2. For a rational model L_0(w) = -sum 1/(w - rho), the segment convolution has numerator Log(s-c-rho_1) - Log(c-rho_1) + Log(s-c-rho_2) - Log(c-rho_2) over (s - rho_1 - rho_2); at s = rho_1 + rho_2 the path of s - w - rho_2 is the negative of the path of w - rho_1, the two logarithm increments cancel, and the point is regular for every sign pattern of Im rho_1, Im rho_2. PROVED (two lines), and MEASURED: residues 0 within quadrature error in `residue_check.log`. I had first claimed the opposite (residue 1, -1, 0 reproducing Kurokawa's multiplicity rule); the check refuted it. On its principal sheet the pair series has only logarithmic branch points at c + rho. The zeros of zeta (x) zeta come from the non-Dirichlet term (Akatsuka's integral and R(s); in the Cramer picture, the square of the continuous Hilbert-transform part of V(t) = sum e^{rho t}). So convergence of the prime-pair series alone, at any abscissa, would not give a zero-free half-plane for Z_2.

### 2.4 Test (b): numerics, prime powers up to 1e5 (9700 terms, 9.4e7 pairs) - MEASURED

Local exponents d log|S| / d log X between cutoffs 10^2, 10^2.5, ..., 10^5.

| series | Re s | value at 1e5 | local exponents (last three) | prediction |
|---|---|---|---|---|
| Akatsuka first sum, signed | 1.6 | 126.4 | 0.362, 0.351, 0.350 | 0.4 - 1/log X |
| same, absolute | 1.6 | 601.2 | 0.414, 0.399, 0.399 | 0.4 |
| signed | 1.8 | 21.19 | 0.209, 0.193, 0.185 | 0.2 - 1/log X |
| absolute | 1.8 | 112.2 | 0.247, 0.230, 0.222 | 0.2 |
| signed | 2.0 | 4.326 | 0.092, 0.076, 0.065 | 0 (logarithmic) |
| absolute | 2.0 | 28.99 | 0.125, 0.106, 0.094 | 0 (logarithmic) |
| signed | 2.2 (control) | 0.977 | 0.003, -0.005, -0.010 | convergent |
| symmetrised (2.2), absolute | 1.6 | 878.9 | 0.522, 0.491, 0.476 | 0.4 + log factors |
| symmetrised, absolute | 1.8 | 91.0 | 0.372, 0.338, 0.317 | 0.2 + log factors |
| symmetrised, absolute | 2 + 5i | 108.7 | 0.168, 0.143, 0.126 | logarithmic |

Partial sums grow like a power of the cutoff for Re s < 2, with exponent near 2 - Re s (the exponents are still drifting at 1e5 because of the 1/log X and log log X factors). By the rule in the assignment the defect is k/2: lane closed.

Pure part P(X) (dE x dE, box cutoff) against the analytic value -int_1^{s-1} L_0 L_0 (mpmath):

| s | P(1e4), P(10^4.5), P(1e5) | analytic |
|---|---|---|
| 1.6 | 0.1448, 0.1632, 0.1468 | 0.152407 |
| 1.8 | 0.07015, 0.07238, 0.07068 | 0.071182 |
| 2 + 5i | -1.12559-0.19855i, -1.12577-0.19872i, -1.12577-0.19862i | -1.125740-0.198635i |
| 2.5 | -0.14225, -0.14256, -0.14237 | -0.142416 |
| 1.3 (below 3/2) | 0.173, 0.543, 0.121 | no convergence |

The pure series converges conditionally at 1.6 and 1.8 (rate about X^{-(sigma - 3/2)}) and does not settle at 1.3, consistent with abscissa 1 + Theta = 3/2 at the heights sampled. This convergence is the cancellation in psi(x) - x, i.e. the zero-free information itself; its absolute sum is the top block of the table.

### 2.5 Deligne's mechanism: is there an analogue after the pole terms are removed? - NO (PROVED for the stated forms)

Deligne (Weil I): the L-function of F^{(x)2k} over a base curve has non-negative coefficients; its poles are located exactly by invariant theory (coinvariants in H^2_c of the base); Landau gives convergence of each local factor up to the first real pole, so |alpha|^{2k} <= q^{k w + 1}. Three features, and their fate here:

1. *Positivity.* For real s the terms of the full pair series all have one sign (Lambda(N) Lambda(M) >= 0 times a divided difference of a monotone exponential). Landau applies to the full object and gives: abscissa = first real singularity = k, the pole (x) ... (x) pole point. Output: Theta <= 1.
2. *The pole enters k times.* In Deligne's setting the tensor power is multiplicative in the local Frobenius parameters over a base, and the H^2 of the base enters once: defect 1 for every k. In the additive tensor power of zeta the pole at 1 is one of the "eigenvalues" being added, so pole (x) ... (x) pole sits at k and zero (x) ... (x) zero at k Theta: defect k(1 - Theta), which is k/2 under RH.
3. *After removing the pole terms* the measure is dE^{(x)k}, signed. Landau's theorem has no hypothesis to work with, and the total-variation abscissa is still k (2.3).

Deligne's mechanism bounds local parameters of a sheaf, not zeros. For zeta the local parameters are 1 (row P25: Sym^m companions change nothing; row 5.5: local conditions are empty). Zeros of a curve's zeta become local parameters only when the curve is a fibre of a family over a base. No such base is known over Q; this is the "no sections" entry of row T2.

### 2.6 Why the function-field case behaves differently (PROVED, elementary)

Kunneth product of the pure part of a curve: coefficients E_n^k, E_n = sum_i alpha_i^n = q^n + 1 - N_n. The series is a power series in T = q^{-s}; absolute convergence equals convergence, so sigma_k / k = max_i log_q |alpha_i|. Measured: 0.5 for 1 - 2T + 5T^2 (genuine), 0.799 for the fake 1 - 5T + 5T^2. For a genuine curve sigma_k = k/2 with C = 0. This is possible because all frequencies lie on the lattice (log q) Z, so the point count of degree n and the pole term q^n are combined into one coefficient E_n before absolute values are taken. Over Z the frequencies log N are distinct for distinct N; the pole term is the continuous measure dx; no term-by-term grouping exists, and grouping in blocks [x, x + H] with |E(x+H) - E(x)| <= H^{1-delta} is a short-interval prime number theorem with power saving, equivalent to a zero-free strip. The full (pole-included) product over F_q has abscissa k as well, also where RH is a theorem: sigma_k measures the pole.

## 3. Controls

| Control | Outcome | Step |
|---|---|---|
| DH | Identity 2.2 holds verbatim (uses only the Dirichlet-series form of -F'/F). -F'/F is not supported on prime powers and converges absolutely only in a zero-free half-plane, so sigma_k >= 1.1204 k. No step separates DH from zeta: for both, K1's hypothesis is false. | hypothesis of K1 |
| TW+, TW-, Beurling | Sizes identical, so sigma_k = k for all. K2 (integer spacing) was expected to be the separating step; by 2.2 the denominators cancel without it, so it separates nothing. | none |
| E_a | L converges absolutely for Re w > 1 + a: sigma_k = k(1 + a), zeros at k(1/2 + a); C = k/2 + ka. Same defect k/2 measured from the zeros. | hypothesis of K1 |
| backward heat | No Dirichlet series: not formulable. Not a quantitative handle. | - |
| function-field fake 1 - 5T + 5T^2 | pure sigma_k / k = 0.799 > 1/2, hypothesis false, as required. Genuine curve: 0.5. The mechanism that makes the genuine case work (lattice frequencies) is absent over Z. | 2.6 |
| own intermediate claim (residue rule for the segment convolution) | refuted by `residue_check.py`; corrected in 2.3 | - |

Three questions of the map. Q1: no step fails for DH that does not also fail for zeta. Q2: the conclusion would be height-uniform, but the hypothesis is false. Q3: multiplicativity enters only through the prime-power support of Lambda; the sign twists pass every step.

## 4. Row for the obstruction map

| Route | Obstruction | Status | Controls |
|---|---|---|---|
| Kurokawa/Kunneth k-fold additive tensor power with multiple Euler product (Deligne Weil I transplant) | Symmetrised prime-tuple series = convolution of k copies of -zeta'/zeta over the simplex w_1+...+w_k = s, Re w_j >= 1; denominators m log p - n log q are divided differences. Abscissa of absolute convergence is k, also for the pure part (total variation of d(psi - x)); conditional abscissa of the pure pair series is 1 + Theta; the pair series is regular at rho_1 + rho_2 on its principal sheet. Deligne's positivity + Landau returns the pole (x) pole point s = k, i.e. Theta <= 1. Over F_q the pure abscissa is k/2 only because frequencies lie on a lattice. | PROVED (k = 2 lower bound, identity, model regularity); CLASSICAL (Akatsuka 2009 for Re s > 2 and the (log(s-2))^2 singularity); MEASURED (growth exponents); ARGUED (convergence for Re s > k, k > 2) | DH, TW, B, E_a pass every step; fake curve fails at lattice grouping only |

## 5. Pivot

One adjacent idea was examined and not pursued: replace absolute convergence by square-summability on the Bohr torus for the k-fold pure series. Its threshold is k/2, but this is row Q10 and wall 5.4 (mean-square threshold; RH is the largest-value statement). No new lane is proposed.

## 6. Three weakest steps

1. The relation between Akatsuka's first sum (weights Lambda(N) kappa(M), unsymmetrised) and the segment convolution (2.2, last bullet) is a formal regularisation; I did not write the eps -> 0 limit as a proof. The abscissa statements do not depend on it (the lower bound in 2.3 applies to either form, and the numerics were run on both).
2. sigma_k = k for k > 2: the lower bound is proved for the k-fold series in the divided-difference form; I did not read a source giving a k-fold Euler product for zeta^{(x)k}, so "the" k-fold Euler product is my form, and convergence for Re s > k in a log normalisation is argued, not proved.
3. The statement that the zeros rho_1 + rho_2 come only from the non-Dirichlet term is proved for rational models and read off Akatsuka's formula for zeta; I did not analyse the continuation of Akatsuka's integral term and R(s) to the left of Re s = 2, and Akatsuka's theorem is quoted from the survey, not from the 2009 paper.

Sources: Akatsuka, "Double zeta functions constructed by absolute tensor products", RIMS Kokyuroku 1806 (2012) 22-36, https://www.kurims.kyoto-u.ac.jp/~kyodo/kokyuroku/contents/pdf/1806-04.pdf ; Koyama-Kurokawa, Compositio Math. 140 (2004), https://www.cambridge.org/core/journals/compositio-mathematica/article/multiple-zeta-functions-the-double-sine-function-and-the-signed-double-poisson-summation-formula/73DC42B5335AFBD8E7B89ACF6B8FED4F
