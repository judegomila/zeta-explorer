# ap-leeyang-structural: Lee-Yang structure for Xi

Date: 2026-11-17. Lane: "positivity automatic from structure", Lee-Yang branch.

Verdict in one paragraph. No Lee-Yang theorem locates a zero of zeta. The route stops at three exact points, each proved or classical: (F1) the arithmetic part of Xi is a product of independent one-site systems with **zero** coupling, and the one ferromagnetic coupling the structure admits (a Curie-Weiss coupling of the total spin) is the de Bruijn-Newman time, which by Rodgers-Tao is at least 0, so Xi has no ferromagnetic margin; (F2) the independent product is an identity only on Re s > 1, and there the Lee-Yang conclusion is the classical "no zeros in Re s > 1"; (F3) evenness (the functional equation) is not a single-site property: every site is one-sided, and the Lee-Yang theorems assume single-site input that already has the property. On the decisive control: the Davenport-Heilbronn function differs from zeta by the absence of a product structure and by signed weights. The first has Lee-Yang content only in Re s > 1 (obstruction map rows L1, Q10, G10). The second also holds for every non-principal Dirichlet L-function and is absent for Epstein zeta functions of class number > 1, which have positive lattice-sum weights, the functional equation, and off-line zeros. No coupling "becomes antiferromagnetic" for DH. The route is closed at this level. What is new relative to the map: Proposition 1 (no complete-graph ferromagnet represents Xi, and the bound is sharp), the model-by-model failure table, and the measured fact that the symmetrised sum over n leaves the Lee-Yang class already at N = 2.

Labels: PROVED (derived here), CLASSICAL (standard theorem; statement recalled, source not re-read in this lane unless said), LITERATURE (specific paper, recalled or seen through a search summary only), MEASURED (floating-point numerics in this lane, not interval-certified), OPEN.

---

## 0. Plan, and what is new against the atlas and the map

Atlas (PR 27, section 3) records as unresolved: "ferromagnetic finite partition functions converging locally uniformly to the theta transform". PR 13 (`string-partition-function.js`, `prime-resonant-structure.js`) records "Lee-Yang restricts zeros in fugacity, not in temperature" and proposes a "thermal Lee-Yang theorem on the infinite torus". `ideation-panel` Angle 3 treats finite Euler products as Lee-Yang polynomials on the prime torus. `flow-euler-defect` identifies the heat time with a coupling between prime occupation numbers.

This lane does four things not in those sources.
1. States the Lee-Yang class with its closure operations and members (section 1) and places Phi in it exactly: Phi = (one archimedean profile) * (product over primes of one-sided geometric measures), with every factor zero-free in the strip (section 2).
2. Writes the Hamiltonian of five candidate models and decides ferromagnetism for each (section 3).
3. Proves Proposition 1: a finite ferromagnet whose pairs are all coupled has de Bruijn-Newman constant <= -m/2 < 0, so by Rodgers-Tao it cannot have Xi as its partition function; the same holds for limits with couplings bounded below. This is a necessary condition on the object the atlas lists as missing.
4. Runs the controls model by model (section 4) and the Euler-product question (section 5).

Rows of the obstruction map touched, and the difference:
- L1, Q10, G10 (local temperedness; chain l^1 threshold; passive cascade): section 5 arrives at the same wall (Re s > 1) from the Lee-Yang side. Not re-entered; cited as the stop.
- F2, F3 (heat cocycle; Lambda from a half-plane): section 5.3 reads de Bruijn's theorem as the Lee-Yang theorem for the Curie-Weiss coupling. Same inequality Lambda <= (2 theta - 1)^2/2; the addition is Proposition 1.
- G5, G4 (kernel-shape properties): section 4.3 adds two real-field inequalities (GHS-type third derivative, cumulant signs) and finds DH passes both. Same conclusion as G5.
- G16, G17 (Epstein classes with h > 1): used as a control for "a lattice sum is a partition function". Zeros taken from `h-hecke-channels` section 4, not recomputed.
- Ideation Angle 3 (finite Euler products as Lee-Yang polynomials): section 5.2 is the same object; the addition is the statement of what restricts to the diagonal.

Normalisation. Phi(u) = sum_{n>=1} (2 pi^2 n^4 e^{9u} - 3 pi n^2 e^{5u}) exp(-pi n^2 e^{4u}); Xi(z) = int Phi(u) e^{izu} du = xi(s)/4 with s = (1+iz)/2, xi(s) = (s(s-1)/2) pi^{-s/2} Gamma(s/2) zeta(s) (MEASURED to 15 digits at z = 0, 3, 14.1347; `checks.log`). Real z is the critical line; the strip 0 < Re s < 1 is |Im z| < 1. H_t(z) = int e^{t u^2} Phi(u) e^{izu} du; Lambda = inf{t : H_t has only real zeros}; 0 <= Lambda <= 0.2 (Rodgers-Tao; Platt-Trudgian). "Field" h means E[e^{hU}] = Xi(-ih), i.e. s = (1+h)/2: a real field is real s.

---

## 1. The Lee-Yang class

**Definition (CLASSICAL; Newman 1974, Lieb-Sokal 1981).** A finite measure rho on R with int e^{b u^2} d|rho| < inf for all b has the *half-plane property* if int e^{hu} d rho(u) != 0 for Re h > 0. For even rho this is equivalent to: E_rho(z) = int e^{izu} d rho has only real zeros. Call the even positive members the class LY. RH is equivalent to Phi in LY (CLASSICAL: Polya; Phi is even, positive, with decay exp(-pi e^{4|u|})).

**Closure operations.**

| | Operation | Effect on E_rho | Source | Status |
|---|---|---|---|---|
| K1 | scaling u -> c u | z -> c z | trivial | PROVED |
| K2 | convolution (independent sum) | product | trivial | PROVED |
| K3 | weak limit with sup_N int e^{c|u|} d rho_N < inf for all c | locally uniform limit; Hurwitz | trivial | PROVED |
| K4 | multiply the density by psi(iu), psi in the Laguerre-Polya class: e^{b u^2} (b >= 0), cosh(a u), 1 + u^2/a^2 | psi(D) applied to E | Polya 1927 (universal factors); Hermite-Poulain; de Bruijn 1950 | CLASSICAL |
| K5 | strip contraction: zeros in abs(Im z) <= D gives zeros of e^{t u^2} rho in abs(Im z) <= sqrt(max(D^2 - 2t, 0)) | | de Bruijn 1950, Theorem 13 | CLASSICAL |
| K6 | ferromagnetic pair coupling: sites nu_i with the half-plane property, J_ij >= 0; then Z(h_1..h_N) = int exp(sum_{i<j} J_ij x_i x_j + sum h_i x_i) prod d nu_i != 0 when all Re h_i > 0; hence every statistic sum lam_i x_i, lam_i >= 0, is in LY when the sites are even | | Lee-Yang 1952 (spin 1/2); Newman 1974; Lieb-Sokal 1981 | CLASSICAL |
| K7 | block-spin limits: spin-s and the phi^4 site exp(-a x^4 - b x^2) are limits of ferromagnetic spin-1/2 blocks | | Griffiths 1969; Simon-Griffiths 1973 | CLASSICAL |
| K8 | two- and three-component versions (rotors) | | Dunlop-Newman 1975; Lieb-Sokal 1981 | CLASSICAL; not used (one real variable) |

**Operations that do not preserve the class.**
- Sums (mixtures). Example in section 2.3: adding the n = 2 term to the symmetrised n = 1 term creates off-line zeros. MEASURED.
- Multiplication by e^{-b u^2}, b > 0 (backward heat). Newman 1976 characterises the even measures for which it is preserved for every b: K x^{2m} exp(-alpha x^4 - beta x^2) prod_j (1 + x^2/a_j^2) e^{-x^2/a_j^2} dx (alpha > 0, or alpha = 0 and beta > 0; sum a_j^{-4} < inf), or K(delta_{x_0} + delta_{-x_0}). Call this class U (Lambda = -inf). LITERATURE (statement recalled).
- Opposite real fields on two independent parts: (e^{cu} rho) * (e^{-cu} rho) is even and positive and has zeros at Im z = +-c. PROVED (it is E_rho(z - ic) E_rho(z + ic)). This is the control E_a.
- Many-body (non-pair) ferromagnetic couplings: K6 is a pair-interaction theorem. CLASSICAL.

**Members.** delta_a + delta_{-a} (cos); uniform on [-a, a]; spin-s; Gaussian; (1 - u^2)^{lam - 1/2} on [-1, 1] (Bessel); exp(-a u^4 - b u^2), b real; exp(-u^{2n}) (Polya 1927); exp(-a cosh u), transform K_{iz}(a) (Polya 1927; Kac 1974 derived it from Lee-Yang as a limit of ferromagnets); Polya's two approximants of Phi, e.g. the kernel 2 pi^2 cosh(9u) exp(-2 pi cosh 4u) (Polya 1926); de Bruijn's class exp(-N(u)), N even, N' a locally uniform limit of polynomials with purely imaginary roots (de Bruijn 1950); the class U; e^{t u^2} Phi for t >= 0.2 (Platt-Trudgian with de Bruijn; a verified-height statement, not a structural one). All CLASSICAL or LITERATURE, recalled.

**Necessary conditions for membership (Newman 1975).** rho in LY implies E[e^{hU}] = prod (1 + h^2/g_k^2) times a Gaussian factor, so (-1)^{n-1} u_{2n} >= 0 for every even cumulant. CLASSICAL. For Phi these hold for all n by verified height (the first zero dominates); they are low-height statements of the type of rows P11 and P16. MEASURED here for n <= 6, for zeta and for DH (section 4.3).

---

## 2. What Phi is made of

### 2.1 The exact decomposition (PROVED)

Let phi(u) = (2 pi^2 e^{9u} - 3 pi e^{5u}) exp(-pi e^{4u}). Then the n-th term of Phi is n^{-1/2} phi(u + (log n)/2), so

    Phi = phi * mu,   mu = sum_{n>=1} n^{-1/2} delta_{-(log n)/2},   mu = *_p mu_p,   mu_p = sum_{k>=0} p^{-k/2} delta_{-(k log p)/2},

where the convolution over primes is formal (total mass sum n^{-1/2} diverges) and the identity Phi = phi * mu is an absolutely convergent sum for each u. On transforms, for Re s > 1,

    Xi(z) = phi^(z) prod_p (1 - p^{-s})^{-1},   phi^(z) = (1/4) (s(s-1)/2) pi^{-s/2} Gamma(s/2),   s = (1+iz)/2.

(MEASURED check of the closed form of phi^ at two complex z to 12 digits.)

Consequences, all PROVED by inspection:
- (a) The single term is not a Polya-type kernel. phi is not even, and it is negative for e^{4u} < 3/(2 pi) (phi(-0.3) = -0.3014). Its transform has exactly one zero, at s = 1 (z = -i), and no zero in the open strip or on the line: s Gamma(s/2) = 2 Gamma(1 + s/2) does not vanish at s = 0. The statement in the task that "each term is a Polya-type kernel" holds only after the replacement e^{9u} -> cosh 9u, exp(-pi e^{4u}) -> exp(-2 pi cosh 4u), which is Polya's approximant and is a different function.
- (b) Each mu_p is a positive measure on a half-line lattice; its transform (1 - p^{-s})^{-1} has no zeros anywhere and poles on Re s = 0. Each prime site has the half-plane property on Re s > 0 trivially.
- (c) In the field variable h = 2s - 1, "the formal measure mu has the half-plane property, after removal of the pole" is the statement zeta(s) != 0 for Re s > 1/2. RH is the half-plane property of the arithmetic part alone; the archimedean factor contributes no zero in Re s > 1/2 except the one cancelling the pole.
- (d) Evenness of Phi is not a property of any factor. It is the theta functional equation (Poisson summation) for the whole sum. Every factor is one-sided.

So Xi is the transform of the law of U = A + sum_p X_p with independent summands: A with (signed) density phi, and X_p = -(log p)/2 times a geometric variable of ratio p^{-1/2}. There is no interaction term. Statistical-mechanics reading: free primon gas (Julia; Spector; Bakas-Bowick) at inverse temperature 1/2, below its Hagedorn point beta = 1, convolved with one archimedean degree of freedom.

### 2.2 A second exact structure: total positivity in the additive variable (LITERATURE + PROVED remark)

Biane-Pitman-Yor (2001): 2 xi(s) = E[Y^s] with Y = sqrt(pi S_2 / 2), S_2 = (2/pi^2) sum_{n>=1} (e_n + e'_n)/n^2, e_n, e'_n independent standard exponentials; E exp(-L S_2) = (sqrt(2L)/sinh sqrt(2L))^2 = prod_n (1 + 2L/(pi^2 n^2))^{-2}. So Phi(u) du is the law of U = (1/4) log(pi S_2/2) up to the constant xi(1/2)-normalisation, and the sum over n is an independent sum in the variable y = e^{4u}. By Schoenberg's theorem the density of S_2 is a Polya frequency function of infinite order, because its Laplace transform is the reciprocal of a Laguerre-Polya function with zeros at -pi^2 n^2/2 (the spectrum of the circle Laplacian). This is a positivity that is automatic from structure: independence over n in the additive scale variable.

It does not transfer to the Mellin variable. Control (MEASURED, `extra.log`): the density 3 e^{-y}(1 - e^{-y})^2 of e_1 + e_2/2 + e_3/3 is PF_infinity for the same reason, and its Mellin transform is 3 Gamma(s)(1 - 2^{1-s} + 3^{-s}), whose zeros are not on one vertical line (real parts from 0.550 to 1.364 among the eight found below height 80; section 6). Two exponentials always give a line (zeros of 1 - (a/b)^s); three do not. The property "the field couples to log of a sum of independent site variables" is outside K1-K8.

### 2.3 The sum over n, symmetrised (MEASURED)

The kernel Phi_N(u) = sum_{n<=N} n^{-1/2} [phi(u + (log n)/2) + phi(-u + (log n)/2)] is even, and its transform is (s(s-1)/8) g_N(s), g_N(s) = G(s) D_N(s) + G(1-s) D_N(1-s), G(s) = pi^{-s/2} Gamma(s/2), D_N(s) = sum_{n<=N} n^{-s}. Zeros in the box 1/2 - 4 < Re s < 1/2 + 4, 1 < t < 200 counted by winding (41,400 contour points, largest phase step 0.04) against sign changes on the line (step 0.002): table in section 6. N = 1: 79 zeros, all on the line. N = 2: one off-line pair, at 1.4736 + 4.2593i and its reflection. N = 3: six off-line pairs, the highest at 0.8114 + 168.0391i. N = 10: 38 off-line zeros. The count of off-line zeros grows with N in this window.

So the symmetrised one-term kernel (a signed measure) has the property in this window and adding the second lattice term destroys it. This is the concrete form of "sums do not preserve the class". Related literature, recalled only: Spira (1966-68) on zeros of approximate functional equations; Hejhal (1990) on finite sums of Polya-type cosh terms, where by secondary sources almost all zeros are real and the finite sums do not converge to Xi. Neither was re-read.

---

## 3. Candidate models

For each: variables, Hamiltonian, the variable conjugate to z, ferromagnetic or not in the sense of K6.

| | Model | Configuration and weight | What z couples to | Pair couplings | Verdict |
|---|---|---|---|---|---|
| M1 | Free primon gas + archimedean site | occupation numbers k_p >= 0; energy E = sum k_p log p; weight n^{-1/2} per state n = prod p^{k_p}; one real variable A with density phi; U = A - E/2 | U, i.e. the energy. A field on the energy is the temperature: s = (1+h)/2 | none (J = 0) | Trivially ferromagnetic. Sites one-sided, a-priori product divergent for Re s <= 1. K6 output: no zeros in Re s > 1. PROVED |
| M2 | Primon gas with Curie-Weiss coupling (the heat flow) | same variables, extra weight exp(t U^2) = exp(t (A + sum_p X_p)^2): coupling 2t x_i x_j between every pair of sites, self-terms t x_i^2 | U | J_ij = 2t for all pairs | Ferromagnetic iff t >= 0. Partition function H_t. Real zeros iff t >= Lambda, and 0 <= Lambda. At t = 0 this is M1. For t > 0 the sum over n diverges termwise (`flow-euler-defect` O3); H_t exists through Phi only. PROVED / CLASSICAL |
| M3 | Rotor (Villain) site: theta(y) = Tr exp(-y pi n^2), n in Z | one integer n, energy pi n^2, inverse temperature y = e^{4u} | log of the temperature, integrated over all temperatures: Xi is a Mellin transform in y, not a partition function at fixed y | none; one site | Not of Lee-Yang form: z is not a field on a spin. Positivity of lattice weights does not separate (Epstein control, section 4.2). PROVED (as a statement about form) |
| M4 | Knauf's number-theoretical spin chain | 2^k spin configurations sigma, energy log h_k(sigma) (Farey denominators); Z_k(s) -> zeta(s-1)/zeta(s) = sum phi(n) n^{-s} for Re s > 2 | inverse temperature s | many-body, all of ferromagnetic sign (Knauf 1993) | Ferromagnetic, but (i) the variable is temperature, (ii) the couplings are many-body, so K6 does not apply (stated by Knauf), (iii) zeros of zeta are poles of Z. LITERATURE (abstract-level; not re-read) |
| M5 | Biane-Pitman-Yor site model | independent weights w_n ~ Gamma(2) at sites n; Z_w = sum w_n/n^2; U = (1/4) log Z_w + const | log Z_w: z is a complex replica number, Xi = E[Z_w^{s/2}] | none among sites; for integer replica number k the replicas attract on coincident sites (E[w^m] = (m+1)! > 2^m) | Independent and totally positive in y (section 2.2); no theorem in the replica number. Three-exponential control fails. PROVED remark + LITERATURE |
| M6 | Coulomb / log gas of zeros | zeros as charges under the flow | — | — | Not a Lee-Yang model for Xi; closed rows P31, G7. Not re-entered |

Result. Only M2 has pair couplings acting on the variable that z is conjugate to, and its coupling constant at the function Xi is t = 0.

---

## 4. Results

### 4.1 Proposition 1: no complete-graph ferromagnet (PROVED relative to K6, Newman 1976, Rodgers-Tao)

For a measure rho with all Gaussian moments write Lambda(rho) = inf{t in R : int e^{t u^2} e^{izu} d rho(u) has only real zeros}. By K4 the set of such t is an up-set.

**Proposition 1.** Let nu_1, ..., nu_N (N >= 2) be even positive measures in the class U of section 1 (Ising, Gaussian-times-phi^4, and the others in Newman's list), J_ij >= 0, lam_i > 0, and let rho_S be the law of S = sum lam_i x_i under exp(sum_{i<j} J_ij x_i x_j) prod d nu_i. Put m = min_{i<j} J_ij/(lam_i lam_j). Then

    Lambda(rho_S) <= -m/2.

Proof. For 0 <= b <= m/2, e^{-b S^2} = exp(-b sum lam_i^2 x_i^2 - 2b sum_{i<j} lam_i lam_j x_i x_j). So e^{-b s^2} rho_S(ds) is the law of S for the sites e^{-b lam_i^2 x^2} nu_i, which are in LY because nu_i is in U, with couplings J_ij - 2b lam_i lam_j >= 0. By K6 its transform has only real zeros. QED.

**Sharpness (PROVED for N = 2, 3 by hand; MEASURED for N = 4, 6, 8, section 6).** For N Ising spins with J_ij = J and lam_i = 1 the weight is exp((J/2 - b) S^2) up to a constant, and the threshold is b* = J/2 exactly: Lambda = -J/2. For N = 2: 2 e^{J - 4b} cos 2z + 2 e^{-J} has real zeros iff b <= J/2. For N = 3: the transform is 2 cos z [e^{3J - 9b}(4 cos^2 z - 3) + 3 e^{-J - b}], real zeros iff b <= J/2.

**Corollary 1 (PROVED relative to Rodgers-Tao, Lambda(Phi) >= 0).**
(a) Phi is not the law of a linear statistic of a finite ferromagnet with sites in U in which every pair is coupled (m > 0).
(b) If rho_N -> Phi weakly with sup_N int e^{c|u|} d rho_N < inf for every c, each rho_N as in Proposition 1 with constant m_N, then liminf m_N = 0. (If m_N >= m > 0 along a subsequence, then e^{-(m/2) u^2} rho_N -> e^{-(m/2) u^2} Phi with locally uniform convergence of transforms, and Hurwitz gives Lambda(Phi) <= -m/2 < 0.)
(c) Equivalent form: Phi is not e^{b u^2} Psi with b > 0 and Psi in LY. The total spin of Xi carries no Curie-Weiss self-coupling.

Reading. The object the atlas lists as missing (ferromagnetic finite partition functions converging to the theta transform) cannot be of mean-field type with couplings bounded below. This matches the zero statistics: a measure with Lambda < 0 has zeros that are locally equally spaced (the mechanism of the Rodgers-Tao proof), while zeta's are not. Proposition 1 does not exclude sparse, hierarchical or vanishing-coupling ferromagnets (for an independent sum, e.g. two free Ising spins, Lambda = 0 because of a double zero). Whether Phi is a limit of such systems is OPEN and is equivalent to RH only in the trivial direction (if it is, RH holds).

Controls on Proposition 1. HEAT: e^{tau u^2/16}-type kernels with tau < 0 are M2 at negative coupling, excluded for the structural reason "antiferromagnetic Curie-Weiss term"; with tau > 0 large enough they are allowed and do have real zeros. DH: Lambda_DH > 0 (it has non-real zeros), so no ferromagnetic representation of any kind exists; nothing to separate.

### 4.2 The decisive control: what changes for Davenport-Heilbronn

DH: f(s) = sum a(n) n^{-s}, a periodic mod 5 with values 1, kap, -kap, -1, 0, kap = 0.28407904384; completed with (5/pi)^{s/2} Gamma((s+1)/2) (functional equation checked to 8.5e-31; |f| = 6.1e-11 at the stored off-line zero 0.8085171825 + 85.6993484854i; `checks.log`).

Model by model.
- M1/M2 (primon gas). zeta: mu is a positive measure and an infinite convolution over primes. DH: mu_DH = sum a(n) n^{-1/2} delta is signed and is not a convolution over primes; it is a complex combination of two such products (characters chi, chi-bar mod 5, each a primon gas with complex fugacities chi(p) of modulus 1). **No coupling changes sign.** The difference is that DH is a superposition of two independent systems with complex weights, and a superposition is the operation "sum" that leaves the class (section 1). The half-plane property for DH already fails inside the region of convergence (zeros with Re s > 1). This separation is real and it is the content of rows L1, Q10, G10; its Lee-Yang output is Re s > 1 only.
- M3 (lattice sum). The DH kernel is sum a(n) n exp(-pi n^2 y/5): the same one-integer rotor with weights a(n) of both signs, equivalently a complex combination of flux-twisted sectors. The same is true, with weights chi(n), for each primitive L(s, chi) mod 5, for which the Riemann hypothesis is expected. In the other direction, the Epstein zeta function of x^2 + 9y^2 or 2x^2 + 2xy + 5y^2 is the Mellin transform of a genuine two-integer Gaussian lattice sum with non-negative weights r_Q(n) and the functional equation, and has off-line zeros (0.865091 + 20.647342i; 1.361834 + 10.405933i; MEASURED in `h-hecke-channels` section 4). The sign of the cross coupling b in Q = a m^2 + b m n + c n^2 is a gauge choice (n -> -n). So in M3 "positive weights" is neither necessary nor sufficient, and "sign of a coupling" is not defined.
- M4 (Knauf chain). Twisting by a(n) gives signed Boltzmann weights. Twisting by any non-principal chi does the same. The separator is "principal character", not "Euler product".
- M5. The DH kernel in y has a Laplace transform sum a(n) n/(L + pi n^2/5) with residues of both signs; it is not the reciprocal of an entire function, so the density is not PF_infinity. Again the same holds for L(s, chi).

**Answer to the control question.** In the Lee-Yang language the Davenport-Heilbronn kernel does not acquire an antiferromagnetic coupling and its "single-site measure" does not leave the class in a way that zeta's stays in it. The structural differences that do exist are (i) no independent-product structure, with content only where the product converges, and (ii) non-positive weights, shared with functions expected to satisfy RH and absent in Epstein controls that violate it. By the rule stated in the task, the route is closed.

### 4.3 Real-field inequalities do not separate (MEASURED; consistent with row G5)

Statements about a real field h are statements on the real s-axis.
- GHS-type inequality d^3/dh^3 log E[e^{hU}] <= 0 for h >= 0, i.e. (log xi)'''(sigma) <= 0 for sigma >= 1/2. zeta: holds on sigma in (0.5, 30.5] (step 0.25; maximum -1.1e-4 at 0.75) and at sigma = 60, 200. Expected from Newman 1991 (V' convex for Phi = e^{-V}) with Ellis-Monroe-Newman 1976; not re-derived. DH: holds on the same grid (maximum -5.4e-4 at 30.5; completed function positive on the real axis, minimum 1.143).
- Cumulant signs (-1)^{n-1} u_{2n} > 0, n = 1..6: hold for zeta (sum over zero pairs of (2 gamma)^{-2n}: 5.776e-3, 2.323e-6, 2.253e-9, ...) and for DH (2.452e-2, 1.093e-4, 9.327e-7, ...).

Both are necessary conditions for a Griffiths-Simon ferromagnetic representation and both are passed by DH, which has zeros off the line. Correlation inequalities at a real field see the low zeros and the Gamma factor only.

---

## 5. The Euler product as independent systems

### 5.1 What is true (PROVED)

The Euler product does exhibit the arithmetic part of Xi as independent systems, one per prime, each with the half-plane property (2.1(b)). K2 then gives: the product has the half-plane property wherever it converges. Convergence of prod_p (1 - p^{-s})^{-1} is exactly Re s > 1. Lee-Yang output: zeta(s) != 0 for Re s > 1.

They are **not coupled through the archimedean factor**. The archimedean factor is one more independent summand A (a convolution factor phi), not an interaction: there is no term x_p x_q or x_p A in the Hamiltonian at t = 0. What ties the primes to the archimedean factor is the functional equation, which in this language is the evenness of the law of the total U. Evenness of a sum of independent one-sided variables is a global identity (Poisson summation); it is not produced by, and is not an input of, K1-K8.

### 5.2 The infinite torus (PROVED; same object as ideation Angle 3 and PR 13's T^infinity)

Give each prime its own field: Z(x_2, x_3, x_5, ...) = prod_p (1 - x_p)^{-1}. Z is non-vanishing on the whole open polydisc |x_p| < 1 and its singular set is {some x_p = 1}: a multivariate Lee-Yang statement that is true, uses each prime separately, and is the temperedness statement of row L1. zeta(s) is the restriction to the one-parameter subgroup x_p = p^{-s}. That restriction is an identity only where the infinite product converges, sum_p p^{-sigma} < inf, i.e. sigma > 1; on 1/2 < sigma <= 1 the point (p^{-s}) lies in l^2 and not in l^1 (row Q10). Over a function field all log N(P) are multiples of log q, the torus is one circle, and the product is a polynomial in one fugacity; over Q the logs of primes are independent and the diagonal is a dense line in an infinite torus. The "thermal Lee-Yang theorem on T^infinity" of PR 13 is therefore: true and elementary in the polydisc, and silent on the diagonal past l^1.

Renormalised limits. By K3, RH would follow from zero-free analytic c_P(s) with zeta_P(s)/c_P(s) -> zeta(s) locally uniformly on Re s > 1/2. Unconditionally c_P = zeta_P/zeta is the only known choice (the zeta function of the P-rough integers), so the statement is a restatement. OPEN, no progress.

### 5.3 The only coupling: de Bruijn's theorem as a Lee-Yang theorem (CLASSICAL, reread)

In M2 the Euler product enters as the strip width: independence gives no zeros for Re s > theta (theta = 1 classically, 7/8 from the 2026 half-plane), i.e. zeros in |Im z| <= D with D = 2 theta - 1. K5 then says the Curie-Weiss coupling t >= D^2/2 makes all zeros real: Lambda <= (2 theta - 1)^2/2, which is 1/2 and 9/32 (row F3). This is the complete Lee-Yang-type theorem that uses all primes at once and is uniform in height. Its controls: backward heat fails as negative coupling; DH passes the de Bruijn step with its own D = 1.2407 (K5 is Euler-blind) and differs only in D; E_a passes too: independence alone gives D = 1 + 2a for it, and its true strip is D = 2a > 0, so for E_a the collapse needs a positive coupling. The gap between t = 0 and t = Lambda is RH, and Proposition 1 shows there is no room on the other side.

### 5.4 The seven controls in this language

| Control | Lee-Yang structure it keeps | Named structural failure |
|---|---|---|
| DH | functional equation (even total law); positive even kernel (measured elsewhere) | not a product of independent sites: a complex superposition of two; half-plane property fails already in Re s > 1 |
| HEAT (tau < 0) | independent sites; evenness | Curie-Weiss coupling of negative sign (antiferromagnetic), M2 with t < 0 |
| TW+, TW- | independent one-sided sites, each zero-free | total law not even (no functional equation); TW- also has signed site measures |
| E_a | independent positive sites; even positive total law | two independent copies in opposite real fields +-2a (section 1, non-closure); equivalently site poles off |x_p| = 1 |
| NR | independent sites, evenness, zeta's archimedean site | the site at q has partition function 2 cosh((s - 1/2) log q) + c with zeros off the line: a single-site measure outside the class |
| B (Beurling) | independent positive tempered sites, pole | total law not even; energies not log of integers |

Every control fails for a reason that has a name in the Lee-Yang language. That is the positive part of the lane. The negative part: the list of properties that survives all seven (independent positive tempered sites at energies log p, the standard archimedean site, even total law) characterises zeta itself (Hamburger; map section 2 note on FE + INT), and no theorem among K1-K8 takes that list as hypothesis: K6 needs couplings J >= 0 acting on a convergent a-priori product of sites that already have the property, and here J = 0 exactly, the product diverges on the strip, and the sites are one-sided.

### 5.5 The three requirements

- All primes together: met by M1, M2 and 5.2.
- Every height, every window: Lee-Yang conclusions are global; met.
- Fails for the controls for a named reason: met as a naming (5.4). Not met as a proof: the step that would have to use the surviving list is absent.

---

## 6. Numerics

All runs through `scripts/memcap.sh 8`, single process, mpmath 1.4.1 (interpreter of `push/b-volterra-norm/venv`, read only), scalar memory. Files: `checks.py`/`checks.log`, `partial_sums.py`/`partial_sums.log`, `extra.py`/`extra.log`. Floating point, 20-30 digits; nothing is interval-certified. A first version of `extra.py` used unconstrained root-finding, stalled, and was stopped at the 20-minute limit; the results below are from the rewritten version with box-confined Newton steps (about one minute).

**Symmetrised partial sums g_N**, box |Re s - 1/2| < 4, 1 < t < 200.

| N | zeros in box (winding) | largest phase step | sign changes on the line | off-line zeros |
|---|---|---|---|---|
| 1 | 79 | 0.040 | 79 | 0 |
| 2 | 81 | 0.017 | 79 | 2 |
| 3 | 83 | 0.017 | 71 | 12 |
| 4 | 85 | 0.017 | 71 | 14 |
| 5 | 87 | 0.021 | 67 | 20 |
| 10 | 95 | 0.025 | 57 | 38 |

Located off-line zeros with Re s > 1/2 (box-confined Newton, `extra.log`); the counts match the winding deficit for N = 2 (1 pair) and N = 3 (6 pairs).
- N = 2: 1.47359593308 + 4.2592838852i.
- N = 3: 0.680125912636 + 3.43740545745i; 2.5617199358 + 8.02089232276i; 1.40317016168 + 31.8003442424i; 0.833384749745 + 48.8821050739i; 0.994259770389 + 140.450518207i; 0.811445852351 + 168.039110713i.

For N = 2 the one off-line pair is at low height (t = 4.26); for N >= 3 off-line zeros occur throughout the window. N = 4, 5, 10 were counted, not located.

**PF_infinity control** (section 2.2).

Zeros of D(s) = 1 - 2^{1-s} + 3^{-s} with 0.5 < t < 80: 8 found, real parts between 0.5504885071 and 1.364273989. First six: 1.33973750821 + 8.91372435115i; 0.936219932001 + 18.6324632337i; 1.12480348364 + 26.7730277905i; 1.27441198759 + 36.5377557256i; 0.550488507149 + 44.8200421747i; 1.36427398911 + 54.3708220816i. The search is not a complete count; it shows only that the zeros are not on one vertical line.

**Complete-graph Ising thresholds** (Proposition 1 sharpness).

Weight exp((J/2 - b) S^2) on S = sum of N Ising spins; transform as a polynomial in w = e^{2iz}; reported: max over roots of | |w| - 1 | (0 means all zeros real).

| N | c = J/2 - b = 0.2 | 0.02 | 0.002 | -0.002 | -0.02 | -0.2 |
|---|---|---|---|---|---|---|
| 2 | 0 | 0 | 0 | 0.135 | 0.5 | 3.21 |
| 3 | 0 | 0 | 0 | 0.245 | 1.03 | 12.8 |
| 4 | 0 | 0 | 0 | 0.345 | 1.61 | 39.5 |
| 6 | 0 | 0 | 8.5e-22 | 0.525 | 2.98 | 297 |
| 8 | 0 | 0 | 0 | 0.694 | 4.72 | 1.95e3 |

The threshold is at c = 0, i.e. b = J/2, in every row: the bound of Proposition 1 is attained.

---

## 7. Verdict

**Precise obstruction; route closed at this level.** Established:

1. (PROVED) Phi = phi * (*_p mu_p): one signed archimedean profile and independent one-sided prime sites, every factor zero-free in the strip; RH is the half-plane property of the arithmetic factor alone.
2. (PROVED rel. Lieb-Sokal/Newman, Newman 1976, Rodgers-Tao) Proposition 1 and Corollary 1: Lambda <= -m/2 for complete-graph ferromagnets with sites in U, sharp for Ising; hence Xi is not such a system, nor a limit of such systems with couplings bounded below.
3. (CLASSICAL, reread) The Lee-Yang theorem that the structure supports is de Bruijn's: independent primes give the strip, the Curie-Weiss coupling t >= (2 theta - 1)^2/2 gives real zeros. At t = 0 the coupling vanishes.
4. (PROVED as form; controls MEASURED/cited) In none of the five models does DH differ from zeta by the sign of a coupling. Positivity of lattice weights is passed by Epstein classes with off-line zeros and failed by Dirichlet L-functions.
5. (MEASURED) The symmetrised sum over n leaves the class at N = 2; real-field inequalities (GHS-type, cumulant signs) are passed by DH.

Not established: that no ferromagnetic representation of Xi exists. Sparse or vanishing-coupling ferromagnets and non-pair structures are not excluded; no candidate was found.

One adjacent idea, not pursued (the lane did not die in a way that leaves a stronger neighbour): the Polya-frequency structure of section 2.2 is a positivity automatic from the product over n, in the additive variable. A route would need a theorem carrying total positivity in y to the Mellin variable using the specific spectrum n^2; the three-exponential control shows it cannot be a general theorem about PF_infinity densities.

---

## 8. Three weakest steps

1. **Literature recalled, not re-read.** The hypotheses of Lieb-Sokal's theorem (decay class, positivity, whether Gaussian sites need separate treatment), Newman's 1976 classification of the class U, Knauf's ferromagnetism and his remark on many-body couplings, Hejhal 1990, Spira, Biane-Pitman-Yor and Kac 1974 are stated from memory or from search summaries. Proposition 1 is exact for Ising sites (where e^{-b x^2} is a constant on the support and only the spin-1/2 Lee-Yang theorem is needed); for other sites it depends on the recalled statements.
2. **Proposition 1 is narrow.** It excludes only ferromagnets in which every pair is coupled, with sites in U. It says nothing about nearest-neighbour, hierarchical or long-range decaying couplings, where e^{-b S^2} creates negative couplings and K6 no longer applies. "Xi has no Curie-Weiss component" is proved; "Xi is not a ferromagnet" is not.
3. **The model list is not exhaustive, and the numerics are floating-point.** Five models were examined; a model in which z couples to a spin through pair interactions other than M2 was not found, and its non-existence is not proved. Zero counts of g_N rest on winding numbers with phase steps <= 0.04 and sign changes at step 0.002 (a close pair on the line would be miscounted as off-line by this method; the located off-line zeros are the check). The Epstein off-line zeros are taken from `h-hecke-channels` and were not recomputed. DH kernel positivity is taken from the map (grid check there).
