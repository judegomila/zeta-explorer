# c17-u6e-bost-connes-non-invariant-state-twin-ladder: RESULT

Date 2026-11-19. Round 17, kind: explore (cell U6 (e): Bost-Connes states outside the three classes of map row D8).
Scope: this directory, plus one line in `campaign/lanes.jsonl`. The compute server was not used (the first test
is a paper lemma; controls pass on paper, so the registered numerical test was not due). Nothing committed or
pushed. No statement about zeros of zeta is made. No independent referee has read this file (referees = 0).
Requirement flags: R1 = R2 = R3 = R4 = false.

Labels: PROVED (complete argument here) / CLASSICAL (standard, source named, not opened) / CHECKED (numeric
check of a displayed identity, `checks.py`, mpmath 30 digits, run through `scripts/memcap.sh 8`; not ball
arithmetic) / MEASURED (float64) / ARGUED / OPEN.

## 0. Verdict

**Precise obstruction. The cell closes at the first lemma for the three candidates of the assignment, and the
entry condition cannot be met by positivity of any state.** Five statements:

1. (Lemma G, PROVED) For every state omega on A = C*(Q/Z) x N^x and every invertible b in A,
   omega_b(x) = omega(b* x b)/omega(b* b) is a state with a unitarily equivalent GNS representation. T-NR is
   b = D^(1/2), finite DEL is b = prod_{p in S}(1 - lambda(p) mu_p), THIN and U are gauge automorphisms. So no
   state has "positivity not preserved under the D-twist": the entry condition of cell U6 (e), read as a
   condition on positivity, is empty. Only an exact relation satisfied by the state (not an inequality) can
   separate zeta from T-NR, and that is an identification (cell U3), not an inequality.
2. (Lemma E, PROVED) The states that satisfy the one exact relation carried by xi_s, namely
   omega(x mu_m*) = lambda(m) omega(x) for all x, m, are classified: lambda is completely multiplicative,
   abs(lambda) <= 1, and omega(mu_n x mu_m*) = conj(lambda(n)) lambda(m) nu(x) with nu a probability measure on
   Z^ satisfying nu(nE) = abs(lambda(n))^2 nu(E). For lambda(m) = m^-s they exist for every Re s > 0
   (s = beta/2 + it, nu a KMS_beta measure), as vector states of xi_s in l^2(N) for beta > 1 and as the vector
   state of the constant function in L^2(Z^, nu_beta) for beta <= 1. Read set on the algebraic Hecke algebra:
   n^-s, m^-conj(s) and nu(e(r)), which is L(beta, chi)/zeta(beta) at the real point beta = 2 Re s > 1, or the
   finitely many local factors f_beta(b) for beta <= 1 or the Galois-invariant measure. No value of an
   L-function at a point with non-zero ordinate, and none inside the strip.
3. (Lemma K, PROVED) For X in A the kernel K_X(w, s) = <xi_w, X xi_s> on Re w, Re s > 1/2 is
   sum c n^-conj(w) m^-s zeta(conj(w) + s; r), every argument with real part > 1; it is positive semidefinite
   iff X >= 0 in A. "Square-summable exactly for Re s > 1/2" does not put an argument in the strip: the state
   is quadratic in the vector and the argument is conj(w) + s.
4. (Lemma T, PROVED given the classical fact that zeta is analytic at 1 + i tau, tau != 0) For two eigenstates
   with s = beta/2 + it, s' = beta/2 + it', tau = t - t' != 0:
   norm(omega_s - omega_s') = 2 sqrt(1 - abs(zeta(beta + i tau))^2/zeta(beta)^2) for beta > 1 (vector states
   in l^2(N)), and norm(omega_s - omega_s') = 2 for every beta <= 1. The overlap that carries zeta(beta + i tau)
   right of 1 is identically zero for beta in (0, 1]: the infinite product of local overlaps diverges to 0
   (Kakutani dichotomy for product vectors). This proves, for the eigenstate class and without Takesaki
   duality, the sentence of c12 Lemma P that the second referee relabelled ARGUED ("zeta(beta + i tau)/zeta(beta)
   is replaced by the indicator of tau = 0"). The same holds for T-NR, DEL, THIN, U and E_a.
5. (Lemma S, PROVED; unboundedness CLASSICAL) For every state omega and a, b in A,
   sup_t abs(omega(a sigma_t(b))) <= norm(a) norm(b), so no two-point function of bounded elements is a
   constant multiple of t -> zeta(kappa + it) with kappa <= 1. For the unbounded elements a = sum n^-w mu_n and
   the KMS_beta state, the two-point functions are zeta(2 Re w - iz) and zeta(2 Re w + beta - iz), and the
   vectors exist exactly when the real argument exceeds 1 (the pole is the abscissa of a positive measure).

Outcome for the record: a sub-row D8 (vi) (section 7). The states of D8's "not covered" clause that remain are
weights on Connes' cokernel / Sonine side, where positivity is the Weil form (carrier nodes
`connes-twin-ladder-crosswalk`, `mem-semilocal-fourier-fs`: status on file "positivity RH-equivalent",
semilocal remainder D_S; not reopened).

## 1. Plan; what is new against the record; the four questions

- On file: row D8 closes sigma-invariant states, the dual-system state and Mellin families of archimedean
  vector states. c16 row U6 (e) names the first control (T-NR whenever the read is unchanged under
  phi -> phi(D .)/phi(D)) and the input (a non-invariant state read with the Fourier duality).
- New here: Lemma G (the twist acts on the whole state space, so the entry condition is about exact relations
  only); Lemma E (classification of the mu*-eigenstates for all beta > 0, including the representation on
  L^2(Z^, nu_beta) for beta <= 1); Lemma K; Lemma T (norm distance of eigenstates; Kakutani dichotomy at
  beta = 1); the decomposition phi_beta = mean over t of Omega_{beta/2 + it} (section 3.3).
- R1 (multiplicativity): the step mu_m* xi_s = m^-s xi_s holds iff the coefficient sequence is completely
  multiplicative. It is essential in exactly one statement: non-vanishing of the overlap right of 1 (Lemma T,
  beta > 1), which is the Euler-product proof of zeta != 0 for Re > 1. R2: nothing at height t inside the strip
  is read. R3: section 5. R4: Lemma T and Lemma S; no crossing.

## 2. Setup (as in c12; CLASSICAL: Bost-Connes 1995, not opened)

l^2(N), mu_n e_k = e_nk, e(r) e_k = exp(2 pi i r k) e_k, sigma_t(mu_n) = n^it mu_n, sigma_t(e(r)) = e(r).
Relations used: mu_n* mu_n = 1; mu_n* mu_m = mu_m' mu_n'* with m' = m/(m, n), n' = n/(m, n);
e(r) mu_n = mu_n e(n r); mu_n* e(r) = e(n r) mu_n*; mu_n x mu_n* = x(./n) 1_{n Z^} for x in C*(Q/Z) = C(Z^).
T-NR density: D = 1 + c sqrt(q) P_q + q P_{q^2} in C*(Q/Z), D e_k = a(k) e_k, sum a(k) k^-u = zeta(u)(1 +
c sqrt(q) q^-u + q q^-2u) (c12 Lemma T). xi_s = sum n^-s e_n, in l^2(N) iff Re s > 1/2.

## 3. First lemma: read sets of the three candidates

### 3.1 Lemma G (PROVED)

Let omega be a state on a unital C*-algebra A and b in A invertible. Then omega(b* b) > 0,
omega_b(x) = omega(b* x b)/omega(b* b) is a state, and x -> pi_omega(x) on H_omega with cyclic vector
pi_omega(b) Omega_omega is its GNS representation (cyclic because b is invertible). So omega -> omega_b is a
bijection of the state space onto itself that preserves purity, the folium and the type of the representation.
Proof: omega_b(a* a) = omega((ab)* (ab))/omega(b* b) >= 0; omega(b* b) >= omega(1)/norm(b^-1)^2. QED

Twins. T-NR: b = D^(1/2) (D >= 1 in C*(Q/Z)), and D xi_s = (1 + c sqrt(q) q^-s mu_q + q q^-2s mu_q^2) xi_s is
the vector with the T-NR coefficients (since P_q xi_s = q^-s mu_q xi_s). DEL with finite S:
b = prod_{p in S}(1 - p^-s mu_p), b xi_s = sum over n free of S of n^-s e_n. THIN, U: omega o alpha_chi (gauge
automorphism, c12 (1.3)). Consequence: "positivity of a state" is the same statement for zeta and for each of
these, for every state, sigma-invariant or not, at every beta. A candidate inequality must be of the form
"omega(X) >= 0 for every omega in a class C cut out by exact relations", with X not positive in A.

### 3.2 Candidate 1: vector states of xi_s on elements mixing mu_n and e(r)

For Re w, Re s > 1/2 (CHECKED N1: four cases against truncated vectors, differences <= 1e-12, tail bound 4e-8):

  <mu_n e(r) xi_w, mu_m e(r') xi_s> = m'^-conj(w) n'^-s zeta(conj(w) + s; n' r' - m' r),
  zeta(u; rho) = sum_k e(rho k) k^-u,   m' = m/(m, n), n' = n/(m, n).

Proof: mu_m* xi_s = m^-s xi_s (this is the multiplicativity step [M]: it holds iff n -> n^-s is completely
multiplicative), then the relations of section 2. QED

**Lemma K (PROVED).** (a) Every matrix coefficient <xi_w, X xi_s>, X in the algebraic Hecke algebra, is a
finite sum of terms c n^-conj(w) m^-s zeta(conj(w) + s; r) with Re(conj(w) + s) > 1. (b) The vectors xi_s,
Re s > 1/2, are total in l^2(N) (a Dirichlet series vanishing on an open set vanishes), so the kernel
K_X(w, s) is positive semidefinite iff X >= 0 on l^2(N), iff X >= 0 in A (the representation is faithful).
(c) Hence kernel positivity of the symbol of X is state-independent, and by Lemma G it is the same condition
for the kernels built from b xi_s, b invertible.

Under the identification l^2(N) = H^2 of Dirichlet series (e_k <-> k^-u; Hedenmalm-Lindqvist-Seip, CLASSICAL),
xi_s is the reproducing kernel zeta(u + conj(s)) at s, mu_n is multiplication by n^-u, and point evaluations
exist only for Re > 1/2: every value read is a value of zeta or of a periodic zeta function at real part > 1.

Stop rule of the assignment: every argument has real part > 1, and the form omega_s(a* a) is a square. Stop.

### 3.3 Lemma E (PROVED): the eigenstate class for every beta > 0

Call a state omega on A a mu*-eigenstate if omega(x mu_m*) = lambda(m) omega(x) for all x in A, m in N.

(a) lambda is completely multiplicative, abs(lambda(m)) <= 1, omega(mu_n x) = conj(lambda(n)) omega(x), and

  omega(mu_n x mu_m*) = conj(lambda(n)) lambda(m) nu(x),  x in C(Z^),  nu = omega restricted to C(Z^),
  nu(n E) = abs(lambda(n))^2 nu(E).

Proof: omega(mu_mn*) = omega(mu_n* mu_m*) = lambda(m) lambda(n); omega(mu_n x) = conj(omega(x* mu_n*)); the
scaling law from mu_n x mu_n* = x(./n) 1_{n Z^}.

(b) Existence for lambda(m) = m^-s, Re s = beta/2 > 0. Let nu be a probability measure on Z^ with
nu(n E) = n^-beta nu(E) (a KMS_beta measure: the product measure nu_beta of c12 section 2 for every beta > 0;
for beta > 1 also the atomic ones). On L^2(Z^, nu): e(r) acts by multiplication by x -> e(r x),
(V_n f)(x) = n^s f(x/n) 1_{n Z^}(x). Then V_n is an isometry (abs(n^s)^2 nu(n E) = nu(E)),
V_n* g(x) = n^-conj(s) g(n x), the relations of section 2 hold, and V_m* 1 = m^-conj(s) 1, so that
<V_n* 1, x V_m* 1> = n^-conj(s) m^-s nu(x) in the convention (first slot conjugate-linear) of 3.2. The vector state of the constant 1 is

  Omega_s(mu_n x mu_m*) = n^-conj(s) m^-s nu(x).

For beta > 1 and nu the atomic measure on N this is the vector state of xi_s; for nu = nu_beta, beta > 1, its
average over the Galois group. For beta <= 1 the measure is unique (nu_beta; at beta = 1 Haar measure) and
Omega_s is a state of the system in the region the assignment asks about; beta in (1/2, 1] is
Re s in (1/4, 1/2]. It is not sigma-invariant: Omega_s o sigma_u = Omega_{s - iu}.
CHECKED N2: Gram matrices of Omega_s on the 108 words mu_n e(a/18), n in {1, 2, 3, 4, 6, 9}, t = 0.9, are
positive semidefinite at beta = 0.55, 0.75, 1 (least eigenvalue between -3.4e-30 and -2.3e-30 at 30 digits,
largest 17.28, 9.85, 5.58; the matrices are rank-deficient, so the least eigenvalue is 0 to working precision).
CHECKED N2x: the word rule against l^2(N) at beta = 2 (difference 2.2e-4 inside the truncation bound 9e-4).

(c) Read set. Omega_s(x), x in the algebraic Hecke algebra, is a finite sum of n^-conj(s) m^-s nu(e(r)).
nu(e(a/b)) = f_beta(b) = b^-beta prod_{p | b}(1 - p^(beta-1))/(1 - p^-1) for nu_beta (finitely many primes, entire
in beta), or a combination of L(beta, chi)/zeta(beta) at the real point beta > 1 for the atomic measures. As
a function of t it is a trigonometric polynomial with frequencies log(n/m).

(d) Mean over t: the Bohr mean of Omega_{beta/2 + it} over t is the sigma-invariant state with
phi(mu_n x mu_m*) = delta_nm n^-beta nu(x), the KMS_beta state. So the eigenstates are a decomposition of each
KMS_beta state (type III_1 for beta <= 1) into non-invariant states indexed by the line Re s = beta/2. PROVED
(termwise). Not used below.

(e) Controls inside the class. DEL (finite S): lambda(p) = 0 on S, nu = nu_beta restricted to x_p in Z_p^* for
p in S (computed from b = 1 - p^-s mu_p: Omega(b* x b) = nu(x 1_{Z^ minus pZ^})); CHECKED N2, S = {3}, positive
semidefinite at the three beta. THIN, U: lambda(m) = eps(m) m^-s with the same nu. These are eigenstates:
the relation [M] does not separate them from zeta. T-NR: not an eigenstate (the coefficient is not completely
multiplicative at q); its twin is Omega_s conjugated by D^(1/2) (Lemma G); CHECKED N2: positive semidefinite at
the three beta, and Omega_s(D) = 1 + c sqrt(q) q^-beta + q q^-2beta to 4e-31 (q = 3, c = 2.05).

### 3.4 Candidate 2: two-point functions omega(a sigma_z(b))

**Lemma S (PROVED).** (a) For any state omega and a, b in A: abs(omega(a sigma_t(b))) <= norm(a) norm(b) for
all real t. For a, b in the algebraic Hecke algebra the function is a finite sum of (n/m)^it times values of
omega. (b) t -> zeta(kappa + it) is unbounded for every kappa <= 1 (CLASSICAL: Omega-theorems, Titchmarsh
chapter 8, recalled, not opened), so it is not a constant multiple of a two-point function of bounded elements in any state.
(c) Unbounded elements. For a = sum n^-w mu_n and the KMS_beta state phi_beta (any beta > 0), termwise:

  phi_beta(a* sigma_z(a)) = zeta(2 Re w - iz),   phi_beta(sigma_z(a) a*) = zeta(2 Re w + beta - iz),

and the vectors a Omega, a* Omega lie in the GNS space iff 2 Re w > 1, respectively 2 Re w + beta > 1. Each
function is the Laplace transform of a positive measure (sum n^-kappa delta_{log n}); its domain of
convergence ends at the real point where the argument is 1 (Landau, CLASSICAL), and Bochner positivity in t
holds exactly on the lines inside that domain. Lowering beta into (1/2, 1] moves the admissible w, not the
argument: the argument read is 2 Re w + beta + it with real part > 1.
(d) The normal state of Psi_w = a* Omega_beta on the type III_1 factor (beta <= 1, 2 Re w + beta > 1) is not
sigma-invariant and has, for (a, b) = 1,

  <Psi_w, mu_a e(r) mu_b* Psi_w>/norm(Psi_w)^2 = a^-(conj(w) + beta) b^-(w + beta) f_beta(den r):

zeta(2 Re w + beta) cancels against the norm; finitely many local factors remain. CHECKED N5 (beta = 0.75,
0.55; differences 2e-7 and 5e-7 inside the truncation bound 1.9e-5; the beta = 1 row of the file is
uninformative because f_1(5) = 0).

### 3.5 Candidate 3: states on the type III factor, beta in (1/2, 1]

Normal states of pi_beta(A)'' are vector states of the GNS space (standard form, CLASSICAL). Three families
were computed: the eigenstates Omega_s (3.3, not normal for the KMS representation; they live on
L^2(Z^, nu_beta)), the vectors Psi_w (3.4 (d)), and conjugates by invertible b (Lemma G). Their read sets are
finitely many local factors at real beta and Dirichlet monomials. The classification of all normal states is
not attempted (weakest step 1). Lemma T below shows what replaces the overlap function for beta <= 1.

## 4. Stage A: the one inequality with content, and why it does not cross

The only statement found in which [M] is used essentially:

  **(J)   norm(omega_s - omega_s') < 2,   s = beta/2 + it, s' = beta/2 + it',**

that is, the two eigenstates are not orthogonal. For beta > 1 it is abs(<xi_s, xi_s'>) > 0, i.e.
zeta(beta + i tau) != 0, tau = t - t'.

- **[M] (multiplicativity step).** xi_s is a joint eigenvector of all mu_m*, hence a product vector in
  l^2(N) = tensor product over p of l^2(p^N): xi_s = (x) xi_{s,p}, xi_{s,p} = sum_k p^-ks e_{p^k}. The overlap
  is the product of local overlaps F_p = (1 - p^-beta)/abs(1 - p^-(beta + i tau)), each in (0, 1].
- **[FE] (Fourier-duality step).** Not used by (J). The duality on e(r) is the functional equation of
  zeta(beta; r) in beta (beta <-> 1 - beta at tau = 0, c12 Lemma L), which relates Re s = beta/2 to
  1/2 - beta/2, not s to 1 - s. No displayed inequality uses both steps.

**Lemma T (PROVED given: zeta is analytic at 1 + i tau for tau != 0, CLASSICAL).**
Let omega, omega' be mu*-eigenstates with eigencharacters lambda, lambda', abs(lambda(p)), abs(lambda'(p)) < 1.
(a) For every finite set S of primes,
  norm(omega - omega') >= 2 sqrt(1 - prod_{p in S} F_p^2),
  F_p = sqrt((1 - abs(lambda(p))^2)(1 - abs(lambda'(p))^2))/abs(1 - conj(lambda(p)) lambda'(p)).
(b) For lambda(m) = m^-s, lambda'(m) = m^-s', Re s = Re s' = beta/2, tau != 0: prod over all p of F_p equals
  abs(zeta(beta + i tau))/zeta(beta) for beta > 1 and 0 for beta <= 1. Hence norm(omega - omega') = 2 for
  beta <= 1, and for beta > 1 the vector states of xi_s, xi_s' have
  norm(omega_s - omega_s') = 2 sqrt(1 - abs(zeta(beta + i tau))^2/zeta(beta)^2).

Proof. (a) Restrict to T_S = C*(mu_p : p in S), the closed span of mu_n mu_m* with n, m S-smooth; it acts
irreducibly on l^2(N_S) (tensor product of Toeplitz algebras, each containing the compact operators). On T_S
both states are vector states of unit vectors with overlap prod_{p in S} F_p (the values
conj(lambda(n)) lambda(m) are those of the vector sum lambda(n) e_n, and do not depend on nu). For vector
states in an irreducible representation the norm distance is 2 sqrt(1 - abs(overlap)^2) (Kaplansky density).
The norm on A dominates the norm on T_S. (b) With x = p^-beta, theta = tau log p:
F_p^-2 = 1 + 2x(1 - cos theta)/(1 - x)^2, so log F_p <= -(1/5) p^-beta (1 - cos(tau log p)). For beta <= 1,
sum_p p^-beta (1 - cos(tau log p)) >= sum_p p^-(1+eps)(1 - cos(tau log p)) = log zeta(1 + eps) -
Re log zeta(1 + eps + i tau) + O(1), which tends to infinity as eps -> 0 because zeta has a pole at 1 and is
finite at 1 + i tau. For beta > 1 the product converges absolutely to the Euler product. For beta > 1 the
representation of A on l^2(N) is irreducible, which gives equality. QED

MEASURED N3 (float64, primes to 1e7; a screen, the limit is proved): log of the partial product at P = 1e7 is
-293.9, -23.3 (beta = 0.55, 0.75; tau = 1), -233.2, -22.7 (tau = 14.1347); at beta = 1 it is -3.288 and -4.473
against the Mertens prediction log(abs(zeta(1 + i tau)) e^-gamma/log P) = -3.267 and -4.477; at beta = 1.5 it
is -0.73417 and -1.56829 against log(abs(zeta(beta + i tau))/zeta(beta)) = -0.73421 and -1.56832.

Reading. The quantity whose vanishing would be a zero of zeta on Re = beta is the overlap of two eigenstates.
Right of 1 it is non-zero by [M]. On (0, 1] it does not become small or sign-indefinite: it is identically 0
for every tau != 0, for zeta and for every control with an Euler-type product on a set of primes of full
logarithmic weight. A product-state overlap is either the convergent Euler product or 0; it has no third
regime in which it could read a zero. The "system exists for beta in (1/2, 1]" does not give R4: the states
exist there and the function of tau does not.

## 5. Control table

Steps: S = the functional is a state (positivity; proves every square); M = the eigen-relation
omega(x mu_m*) = lambda(m) omega(x) for all m; F = Poisson summation on e(r); (J>1) = statement (J) for
beta > 1; (J<=1) = the value norm = 2 for beta <= 1. "First fail" is the first step that fails.

| control | realisation | S | M | F | (J>1) | (J<=1) | first fail |
|---|---|---|---|---|---|---|---|
| T-NR, c > 2 | Omega_s conjugated by D^(1/2) (Lemma G); CHECKED N2 (q = 3, c = 2.05) | yes | no, at the one prime q (bounded cocycle; exact for (m, q) = 1) | yes (c12 C4e) | overlap = T-NR(beta + i tau)/T-NR(beta); non-zero for 2 < c < q^(1/2) + q^(-1/2); zero right of 1 for larger c (CHECKED N4: q = 3, c = 2.5, zero at 1.1309 + 2.8596 i) | same as zeta (the product over p != q is unchanged; MEASURED N3: -294.2, -23.6, -3.58) | M, local at q; no inequality of the lane reads it for the c in the strip |
| DEL, finite S | eigenstate, lambda(p) = 0 on S (3.3 (e)); CHECKED N2 | yes | **yes** | yes (Poisson reading, row D8) | holds | same (MEASURED N3) | **none** |
| DEL, thin infinite S | eigenstate, nu = product measure with Haar on Z_p^* at p in S | yes | yes | no | holds | same (the sum over p outside S still diverges) | F, not used by (J) |
| THIN | Omega_s o alpha_eps | yes | yes | no | identical overlap (abs(eps) = 1) | same | F, not used by (J) |
| U | Omega_s o alpha_chi | yes | yes | no | identical overlap | same | F, not used by (J) |
| DH | D_DH in C*(Q/Z) self-adjoint with eigenvalues 1, kappa, -kappa, -1, 0: not invertible, not positive | functional x -> <xi_s, D_DH x xi_s>: no; vector D_DH xi_s: yes, but its overlaps read sum a(k)^2 k^-u, not the DH function | no (a(6) != a(2) a(3)) | yes (period 5) | not formulable for the DH function | not formulable | S (functional) or M (vector) |
| E_a | A (x) A, xi_{s+a} (x) xi_{s-a} | yes | yes, in each factor | yes, in each factor | product of two overlaps, non-zero when both arguments exceed 1 | 0 as soon as one argument is <= 1 | **none** |
| ZQ | zeta m, m rational in s(1 - s): absolutely continuous coefficient mass off log N | no realisation on A (c16 row U6 (e)) | - | - | - | - | carrier (identification INT), not an inequality |
| NR-q | generalised prime q = 1 + sqrt 2 | no realisation on A | - | - | - | - | carrier |
| EIS-w | GL_2 system (Connes-Marcolli), product vector over p with two local parameters | yes (ARGUED) | yes (Hecke, ARGUED) | yes (ARGUED) | ARGUED: holds | ARGUED: 0 | none found (ARGUED; not written out) |
| BLS | scattering Blaschke control M_B: not a coefficient object on N | no realisation on A | - | - | - | - | carrier |
| backward heat | coefficient cocycle 2t log m log n: the vector is not a mu*-eigenvector and the kernel is not of the form <xi_w, x xi_s> | at x = 1 only | no | yes | not formulable | not formulable | M |
| sign twist | eps completely multiplicative on prime powers: gauge twin, as THIN | yes | yes | no | identical overlap | same | F, not used by (J) |

Controls passing every step that any inequality of the lane uses: DEL (finite S, every step), E_a (in its
tensor system), THIN / U / sign twist (every step used by (J)), T-NR for 2 < c < q^(1/2) + q^(-1/2). Stop rule
applies; the registered server test (form for zeta, T-NR c = 2.05, DEL at beta = 0.55, 0.75, 1) was due only if
no control passed on paper. Its small local version is N2 and the last three columns of N3; all three objects
give positive semidefinite forms and the same orthogonality.

Where (J>1) does separate: T-NR with c > q^(1/2) + q^(-1/2) has orthogonal twin vectors right of 1 (N4),
while every eigenstate pair is non-orthogonal there. This is the known statement "an Euler product does not
vanish right of 1", with the T-NR zero outside the strip. It gives no flag.

## 6. The pivot (one, on paper): an inequality on the eigenstate class for non-positive X

By Lemma G the only form left is: X = X* in the algebraic Hecke algebra, not positive, with
Omega_s(X) >= 0 for every eigenstate with lambda(m) = m^-s in a region of s (a Berezin-symbol inequality on
the diagonal; off the diagonal it is X >= 0 by Lemma K). By Lemma E (c),
Omega_s(X) = sum c n^-conj(s) m^-s nu_beta(e(r)): a trigonometric polynomial in t with coefficients that are
functions of beta = 2 Re s through finitely many local factors (beta <= 1) or through L(beta, chi)/zeta(beta) at
real beta > 1. No term depends on zeta or an L-function at a point with ordinate t. Such an inequality can
hold or fail; it cannot be a statement about zeros in the strip, and T-NR's failure of [M] at q changes
finitely many coefficients. Closed by the read set. Not pursued further; no second pivot.

## 7. Proposed map entry (not applied; this lane does not edit the map)

Row D8, add: "(vi) Non-invariant states (campaign round 17, cell U6 (e)). For every state omega and
invertible b in A, omega(b* . b)/omega(b* b) is a state with an equivalent GNS representation; T-NR
(b = D^(1/2)), finite DEL and the gauge twins are of this form, so positivity of a state never separates them
from zeta (Lemma G). The mu*-eigenstates omega(x mu_m*) = m^-s omega(x) exist for every Re s > 0, are
classified by a KMS_{2 Re s} measure on Z^, and read n^-s together with finitely many local factors, or
L(beta, chi)/zeta(beta) at real beta = 2 Re s > 1 (Lemma E). Kernels <xi_w, X xi_s> read zeta(conj(w) + s; r)
with real part > 1 and are positive iff X >= 0 (Lemma K). Two eigenstates on Re s = beta/2 are at norm
distance 2 sqrt(1 - abs(zeta(beta + i tau))^2/zeta(beta)^2) for beta > 1 and at distance 2 for beta <= 1
(Lemma T): this proves for this class the sentence of Lemma P relabelled ARGUED. Two-point functions of
bounded elements are bounded in t (Lemma S). Passing controls: DEL (finite S), E_a, THIN / U for the steps
used, T-NR inside the strip range of c. Not covered: weights on the cokernel of Connes' map (Weil form); a
classification of normal states of the type III_1 factor. PROVED (Lemmas G, E, K, T, S (a), (c), (d));
CLASSICAL inputs not opened; no independent referee."

Cell U6 (e) in STRATEGY section 4.0: proposed state "closed for positivity reads (Lemma G) and for the
eigenstate class (Lemmas E, T); residual = Weil-form weights, already rows P1, G21".

## 8. Requirement flags and evidence

- R1 false. [M] is essential only in (J) for beta > 1, a statement right of 1 that is the Euler-product
  non-vanishing; DEL, THIN and U satisfy [M] exactly. Every other inequality is a square.
- R2 false. No inequality at height t inside the strip; Lemma E (c): the dependence on t is a trigonometric
  polynomial.
- R3 false. DEL (finite S) and E_a pass every step; T-NR passes every step read by an inequality for c in
  the strip range (Lemma G, N2).
- R4 false. Lemma T: the overlap is identically 0 for beta <= 1; Lemma S: arguments stay right of 1. No limit
  in beta is proved because the limit object is the indicator of tau = 0.

## 9. Three weakest steps

1. Coverage. The classes examined are: all b-conjugates of any state (Lemma G), the mu*-eigenstates (Lemma E,
   complete for that relation), the vectors Psi_w, and two-point functions of bounded elements. A state defined
   by a different exact relation (not the eigen-relation, not KMS) is not excluded by a classification; for
   such a state Lemma G still says its positivity is shared with the twins, and the lane has no proof that
   every exact relation is either an identification or satisfied by DEL.
2. Lemma T (a) uses irreducibility of the tensor product of Toeplitz algebras on l^2(N_S) and the formula for
   the norm distance of vector states in an irreducible representation (both standard; stated, not opened).
   Equality in (b) for beta > 1 uses irreducibility of A on l^2(N). The claim "norm = 2" for beta <= 1 needs
   only the lower bound. Purity of Omega_s for beta <= 1 (ergodicity of N^x on (Z^, nu_beta)) is not proved
   and not used. No independent referee.
3. Numerics are mpmath at 30 digits and float64, not ball arithmetic; N2 tests positive semidefiniteness on one
   108-word family at one t (the statement is proved by the representation in 3.3 (b); the check guards the
   word rule and the formula for nu). The EIS-w, ZQ, NR-q and BLS rows are "no realisation" or ARGUED, not
   constructions. Bost-Connes 1995, Hedenmalm-Lindqvist-Seip 1997 and Titchmarsh were not opened.

## 10. Files

- `checks.py`, `checks.json`, `checks.log`: N1 (kernel formula), N2 (Gram matrices of eigenstates for zeta,
  DEL, T-NR at beta = 0.55, 0.75, 1), N2x (word rule in l^2(N)), N3 (partial overlaps, float64), N4 (T-NR local
  zero), N5 (vector Psi_w). Run: `scripts/memcap.sh 8 /opt/homebrew/opt/python@3.14/bin/python3.14 checks.py`
  (absolute paths in the script), exit 0.
- `lanes_line.json`: the line appended to `campaign/lanes.jsonl`.
