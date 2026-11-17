# n1-beurling-rigidity: Beurling systems with zeta's functional equation

Status: unrefereed. Labels: PROVED (argument given here), CLASSICAL (literature), MEASURED, OPEN.

## 0. Verdict

**Completeness theorem; there is no eighth control of this kind.** A Beurling system whose zeta function has zeta's gamma factor, a simple pole at 1 with residue 1 and the s -> 1-s symmetry is the primes (Theorem A, PROVED, elementary and self-contained). The proof uses neither uniform discreteness nor the semigroup structure: any generalized Dirichlet series sum m_n lambda_n^(-s) with this functional equation and all coefficients m_n >= the residue is residue times zeta. For arbitrary residue the same conclusion holds for Beurling systems (Theorem B, PROVED relative to Meyer's 1970 theorem, which was cited from memory and not re-read).

This is an identification statement of the same type as Hamburger's theorem. **It gives no zero-free bound and no information about any zero.**

Consequence for the input-level bookkeeping of OBSTRUCTION_MAP section 2: INT (ordinary Dirichlet series) is not an independent input once FE is present together with "coefficients >= residue"; FE + that positivity forces the support to be the integers. Row B (Beurling) cannot be upgraded to carry FE.

## 1. Plan and what is new

Question: is there a multiset P in (1, inf), with N the free commutative semigroup it generates (elements counted with multiplicity), such that zeta_P(s) = sum_{n in N} n^(-s) satisfies: Lambda_P(s) = pi^(-s/2) Gamma(s/2) zeta_P(s) = Lambda_P(1-s), with Lambda_P(s) + kappa/s + kappa/(1-s) entire and of finite order?

Relative to the atlas and the map: Hamburger (FE + INT) is known; L2 and P6 are identification statements using Euler factors or all-order positivity. New here: the integers are derived from FE plus positivity of the Dirichlet coefficients (not of Lambda(n)), with no Euler product used. Literature novelty not checked; the argument is the equality case of "abs(phi(t)) <= phi(0) for positive-definite phi", so it may be folklore (compare Cordoba 1989, Lev-Olevskii 2015).

## 2. Work

### 2.1 Set-up

(S1) CLASSICAL (Hecke; Bochner). With Theta(x) = sum_{n in N} e^(-pi n^2 x), the functional equation with the stated poles and finite order is equivalent to kappa + 2 Theta(x) = x^(-1/2) (kappa + 2 Theta(1/x)), x > 0. The mass at 0 equals the residue of zeta_P at 1.

(S2) CLASSICAL. The identity continues to Re x > 0; derivatives in x at x = 1 give t^(2k) e^(-pi t^2), whose span is dense in even Schwartz functions. Since mu = kappa delta_0 + sum_{n in N} (delta_n + delta_{-n}) is even and tempered (Theta(x) <= C x^(-1/2) gives N(R) <= C' R), the identity is mu^ = mu as tempered distributions.

(S3) PROVED. Bohr coefficient formula. Let eta be smooth with compact support, psi = eta * eta~, psi(0) = 1, so psi^ = abs(eta^)^2 >= 0 and integral of psi^ is 1. Define the positive functionals M_R(f) = (1/R) integral psi^(x/R) f(x) dmu(x). Pairing mu^ = mu with psi(R(xi - t)) (supported in a shrinking neighbourhood of t, bounded by 1) and dominated convergence give, for every real t,

  mu({t}) = lim_{R -> inf} M_R(e^(-2 pi i t x)),  in particular  lim M_R(1) = mu({0}) = kappa.

### 2.2 Theorem A (kappa = 1; no semigroup, no uniform discreteness)

**Theorem A.** PROVED. Let mu be a positive, purely atomic, tempered measure on R with mu^ = mu, mu({0}) = kappa > 0, and every atom of mass >= kappa. Then mu = kappa sum_{k in Z} delta_k.

Proof.
(A1) By (S3) and positivity of M_R: mu({t}) = lim M_R(cos 2 pi t x) <= lim M_R(1) = kappa. With the hypothesis, every atom has mass exactly kappa.
(A2) Hence S = supp mu = {t : lim M_R(1 - cos 2 pi t x) = 0}.
(A3) S is a subgroup of R: 1 - cos(a+b) <= 2(1 - cos a) + 2(1 - cos b), and M_R is positive; 0 in S, S = -S.
(A4) S is locally finite (mu is a Radon measure with atoms of mass kappa) and not {0} (otherwise mu = kappa delta_0, whose transform is kappa dx). So S = cZ, mu = kappa III_{cZ}, mu^ = (kappa/c) III_{Z/c}; mu^ = mu forces c = 1. QED

**Corollary A.** PROVED (given S1, S2). If a Beurling system has the functional equation with residue kappa = 1, then mu = III_Z, so N is the positive integers each with multiplicity 1, and P is the set of rational primes (the generators of a free commutative semigroup are its irreducible elements). More generally: if 0 < lambda_1 < lambda_2 < ..., m_n >= kappa and sum m_n lambda_n^(-s) has zeta's functional equation with residue kappa, then lambda_n = n and m_n = kappa.

Residue below the least coefficient is impossible by (A1).

### 2.3 Theorem B (Beurling system, arbitrary residue)

(B1) PROVED. mu is translation bounded: for g(x) = e^(-pi x^2), integral g(x - t) dmu(x) = integral g(xi) e^(-2 pi i t xi) dmu(xi) <= integral g dmu. So multiplicities in N are bounded.

(B2) PROVED. Multiplicities are 1 and factorisation by value is unique. If two distinct exponent vectors a != b had the same value v, the k+1 vectors j a + (k-j) b, 0 <= j <= k, are distinct with value v^k, so the multiplicity of v^k is >= k+1, contradicting (B1). This is the only place the semigroup is used.

(B3) CLASSICAL, cited from memory, not re-read (Y. Meyer, Nombres de Pisot, nombres de Salem et analyse harmonique, LNM 117, 1970; statement as used by Kolountzakis-Lagarias and Lev-Olevskii): if a tempered measure has locally finite support, masses in a finite set, and its Fourier transform is a measure with abs(mu^)(-R,R) = O(R), then each level set of the mass function lies in the coset ring and is a finite union of cosets of lattices up to a finite set. Here the masses are {kappa, 1} and mu^ = mu, so the mass function is m = m_fin + sum_j w_j 1_{tau_j + c_j Z} with m_fin finitely supported.

(B4) PROVED given (B3). mu_fin^ is a trigonometric polynomial density and equals a purely atomic measure, so mu_fin = 0. Group the c_j into commensurability classes C with common period L_C; mu = sum_C mu_C, mu_C L_C-periodic. Cosets from different classes meet in at most one point, so off a finite set mu_C = mu there; by periodicity mu_C = sum_{i=1..q_C} III_{tau_i + L_C Z} with unit masses. Then mu_C^ = (1/L_C) sum_k a_C(k) delta_{k/L_C}, a_C(k) = sum_i e(-tau_i k / L_C), and the lattices Z/L_C of different classes meet only at 0. Hence a_C(k)/L_C = mu({k/L_C}) in {0, 1} for k != 0. Some a_C(k_0) != 0 with k_0 != 0 (else mu_C would be Lebesgue), so L_C = a_C(k_0) <= a_C(0) = q_C, i.e. the density d_C = q_C/L_C >= 1. Counting the atom at 0 two ways: kappa = sum_C d_C >= r (number of classes) and kappa = sum_C mu_C({0}) <= r. So d_C = 1 for all C, a_C(k_0) = q_C forces e(-tau_i k_0/L_C) = 1 for all i, {k : a_C(k) = q_C} = hZ, mu_C^ = III_{(h/L_C) Z}, mu_C = (L_C/h) III_{(L_C/h) Z}; unit masses give L_C = h, mu_C = III_Z for every class; distinct classes are incommensurable, so r = 1 and kappa = 1.

**Theorem B.** PROVED relative to (B3). A Beurling system with the functional equation and any residue kappa > 0 has kappa = 1 and is the primes.

### 2.4 Answers to the two assigned lemmas

First lemma (uniformly discrete => integers via Lev-Olevskii): true but the hypothesis is not needed. Positivity of mu and of mu^ = mu already gives translation boundedness (B1) and then, for kappa = 1, the group structure (A3). Kurasov-Sarnak measures have positive unit masses but their transforms are not positive and have atoms of modulus below the atom at 0; step (A1) with mu^ = mu is what excludes them.

Second lemma (D_a mu <= mu, positive-definiteness of mu - a^(-1) D_{1/a} mu): PROVED but weak. It gives, from abs(rho({1/a})) <= rho({0}) with rho = mu - a^(-1) D_{1/a} mu, only a >= 1 + 1/kappa for every a in N, a > 1 (so the least generator is >= 2 when kappa = 1), and lambda_min of the difference graph >= -(a-1). It is not needed for Theorem A. Multiplicativity enters the result only through (B2).

### 2.5 Infinitesimal rigidity

**Lemma T.** PROVED. Let l be any polynomially bounded real function on the positive integers (for a deformation of generators, l(n) = sum_p c_p v_p(n)/p). The first-order variation of III_Z under n -> n(1 + eps l(n)) is self-dual only if l = 0.
Proof. The variation is -omega', omega = sum_n n l(n) (delta_n - delta_{-n}). Self-duality reads 2 pi i xi omega^(xi) = omega'(xi). omega is supported on Z, so omega^ is 1-periodic; subtracting the identity from its translate by 1 gives omega^ = sum_n b_n delta'_n with b_n = (w(n+1) - w(n))/(2 pi i), w the odd extension of n l(n). Periodicity gives b_n = b; then xi omega^ = b sum (n delta'_n - delta_n) contains delta_n terms, which omega' does not, so b = 0, w constant, w(0) = 0, l = 0. QED

First test (MEASURED; scripts `rigidity_svd.py`, `nullvec_check.py`; all runs via scripts/memcap.sh 8, a few MB, seconds each; mpmath 30 digits, repeated at 60):

| Run | Smallest singular value (rows normalised to unit norm) |
|---|---|
| 15 primes, 400 points, x in [0.2, 5] as assigned | 2.07e-8 (raw matrix: 9.9e-610) |
| 15 primes, x log-spaced in [1/(4*47^2), 1] | 1.82e-5 |
| 30 primes, x log-spaced in [1/(4*113^2), 1] | 1.957e-12 (identical to 8 digits at 30 and 60 digits) |

Reading. The assigned window [0.2, 5] cannot see primes >= 11: the row of p has size e^(-pi p^2 / 5), below 1e-30 for p >= 11 and 1e-601 for p = 47, so the raw test is void and the row-normalised one measures only the sampling. With an adapted window the matrix has full rank far above rounding (1.96e-12 against 1e-30 and 1e-60), but the smallest singular value falls by about a factor 0.3 per added prime. The near-null vector lives on primes 61 to 113 with alternating signs; its combination stays at relative size 4e-11 to 2e-9 on x in [1e-7, 1e-5], outside the sample. This is the conditioning of a family of near-dilates f_p(x) ~ -(2 pi/p) G(p^2 x) of one smooth function, not a tangent fake: Lemma T excludes an exact one, and Theorem A excludes a fake at any distance. No Newton iteration was run, because by Theorem A it has no limit. What the decay does show: self-duality tested to 1e-12 on a finite x-window does not determine the primes up to 113; the rigidity is exact, not quantitatively stable in that norm.

## 3. Controls

| Control | Step that fails |
|---|---|
| DH | Not a positive measure (signed coefficients), odd gamma factor, conductor 5: (S3) holds but (A1) needs M_R positive. No pole, so kappa = 0 and (A1) would force mu = 0. |
| HEAT (tau < 0) | Not a Dirichlet series for any fixed frequencies: mu is not purely atomic; (A2) has no atoms to work with. |
| TW+, TW- | No functional equation: mu^ != mu, (S1) fails. |
| E_a | Gamma factor Gamma((s+a)/2) Gamma((s-a)/2): not a self-dual measure on R; coefficients sigma-type, not >= residue. |
| NR type | Atoms smaller than the atom at 0: (A1) gives no equality. Explicit instance (MEASURED, `fake_control.py`): mu = 4 III_{2Z} + 2 III_{Z/2} + 4 III_{4Z} + III_{Z/4} is positive, self-dual, with positive integer masses (theta defect < 4e-30), mass 11 at 0 and least atom 1 at t = 1/4; its Dirichlet series is [4(2^(-s) + 2^(s-1)) + 4(4^(-s) + 4^(s-1))] zeta(s), with a zero at 1.26554813441 + 4.53236014183 i. It is a change of local factor at the prime 2, i.e. inside the existing NR row, not a new control. It shows the hypothesis "every atom >= atom at 0" in Theorem A cannot be replaced by "integer masses". It is not a Beurling system (atoms below 1). |
| B (Beurling) | No functional equation: (S1) fails. Theorems A and B say this cannot be repaired. |
| Kurasov-Sarnak | mu^ is not positive and not equal to mu; (A1) fails. |

Three questions of the map. Q1: table above. Q2: not applicable; the statement identifies a function and has no height variable. Q3: multiplicativity is used only in (B2) (bounded multiplicity => unique factorisation) and not at all in Theorem A; positivity of the Dirichlet coefficients, not of Lambda(n), carries the proof.

## 4. What this does and does not give

- Gives: no Beurling control with FE exists; zeta is isolated among positive unit-mass self-dual measures, exactly and to first order (Lemma T). Any argument for RH that uses FE and Lambda >= 0 with unit-mass support cannot be tested on a non-integer system, because none exists.
- Does not give: any inequality, any zero-free region, any statement uniform in height. The theorem identifies zeta; like Hamburger's theorem, L2 and P6, it does not locate zeros.
- The measured decay in 2.5 says a quantitative (stability) version would need a norm stronger than theta samples on a bounded window. Not pursued; no route from a stability constant to zeros is known.

## 5. Three weakest steps

1. (B3) Meyer's theorem is quoted from memory; one attempt to fetch a source returned no statement. Theorem B (residue != 1) depends on it and on the coset-ring reduction to "finite set plus finitely many lattice cosets" in dimension 1. Theorem A and Corollary A do not depend on it.
2. (S1)-(S2): the passage from the functional equation to mu^ = mu assumes finite order (or polynomial bounds in vertical strips) and the stated polar part; density of Gaussians in even Schwartz functions is quoted, not proved here. Without a growth hypothesis the equivalence is not claimed.
3. Novelty: no literature search beyond two look-ups was done. Theorem A is short and may be known (Cordoba-type results on Dirac combs). The numerical test in 2.5 is not evidence for rigidity on its own: its smallest singular value decays geometrically with the number of primes, and only Lemma T and Theorem A carry the conclusion.

## 6. Files

- `rigidity_svd.py`, `svd_literal_15_dps30.json`, `svd_adapted_15_dps30.json`, `svd_adapted_30_dps30.json`
- `nullvec_check.py`, `nullvec_dps30.log`, `nullvec_dps60.log`
- `fake_control.py`, `fake_control.log`

Sources consulted: [Kolountzakis, Fourier pairs of discrete support with little structure](https://arxiv.org/pdf/1502.06283); [Lev-Olevskii, Quasicrystals with discrete support and spectrum](https://arxiv.org/abs/1501.00085).
