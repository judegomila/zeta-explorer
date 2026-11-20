# c12-bost-connes-crossed-product-duality: positivity in the Bost-Connes algebra joined to the Fourier duality

Date 2026-11-19. Round 12, kind: explore (device design; candidate for CROSS-1, STRATEGY v3 section 4.0).
Scope: this directory only, plus one line in `campaign/lanes.jsonl`. The compute server was not used.
Nothing committed or pushed. No statement about zeros of zeta is made.
Requirement flags: R1 = R2 = R3 = R4 = false.

Labels: PROVED (complete elementary argument here) / CLASSICAL (standard; source named, not opened in this
lane) / CHECKED (arithmetic check of a displayed identity, `identity_checks.py`, mpmath 30 digits, run
through `scripts/memcap.sh 8`; no stage-B computation was run) / ARGUED / OPEN.

## Verdict

**Precise obstruction. The device is closed at stage A.** Two controls pass every step of the displayed
inequality, one of them inside the Bost-Connes algebra itself:

1. (Lemma T, PROVED, CHECKED) The T-NR twin with c > 2 is the functional x -> phi_beta(D x) on the same
   algebra A with density D = 1 + c sqrt(q) P_q + q P_{q^2}, P_n = mu_n mu_n^*. D lies in A, D >= 1,
   D commutes with the Hamiltonian. Its partition function is zeta(beta) phi_beta(D) =
   zeta(beta)(1 + c sqrt(q) q^-beta + q q^-2beta), the T-NR function. Positivity and the Poisson step
   hold for it exactly; the mu_n covariance holds exactly for n prime to q and with a bounded positive
   cocycle in C*(Q/Z) at q (the coefficients are multiplicative, not completely multiplicative, at q).
   T-NR is a bounded inner perturbation of the Bost-Connes dynamics. The one difference is local at the
   single prime q (map rows G21, L4: empty for zeta) and no inequality of the device uses it.
2. (Lemma E, PROVED at input level) E_a is the same device on A (x) A with the state
   KMS_{beta+a} (x) KMS_{beta-a} (vector form: xi_{f,lambda_1} (x) xi_{f,lambda_2}); every step holds.
   For a = 1/2 this is the partition function zeta(beta) zeta(beta - 1) of the GL_2 system of
   Connes-Marcolli (CLASSICAL, recalled, source not opened); the claim does not depend on that source.

Three lemmas say why no inequality of the device can separate zeta from these controls:

- (Lemma C, PROVED) Every sigma-invariant state on A (every KMS state, every beta > 0) factors through
  the conditional expectation onto C*(Q/Z) = C(Z^): phi(a*a) >= 0 is the positivity of a measure on Z^.
  For KMS_beta the measure is a product over primes of local measures, and phi_beta(x) for x in the
  algebraic Hecke algebra is an entire function of beta built from finitely many primes. Zeta does not occur
  in any value of phi_beta on A. The non-commutativity of mu_n and e(r) is not read by these states.
- (Lemma V, PROVED) For the non-invariant vector states that carry the Fourier duality
  (xi_{f,lambda} = sum_k f(lambda k) e_k), the Mellin transform in lambda of every matrix coefficient is
  a periodic zeta function sum_k e(rk) k^-s times an archimedean factor: the read set is {L(s, chi), all
  chi}, the split over Dirichlet characters returns, and the Poisson step is the functional equation of the
  Hurwitz/periodic zeta as an identity.
- (Lemma B, PROVED rel. zeta(sigma) < 0 on (0, 1), CLASSICAL) The positivity delivered by the device is
  Bochner positivity of t -> zeta(sigma + it) M F(sigma + it) on lines sigma > 1. It is false on every line
  0 < sigma < 1 because the value at t = 0 is negative. The pole at beta = 1 is the phase transition; for
  beta <= 1 the function zeta(beta + it)/zeta(beta) is replaced by the indicator of t = 0. No crossing.

First lemma (assignment): the element through which s <-> 1-s enters is not in A. In A the duality is
present prime by prime (Lemma L: the Fourier transform of the KMS_beta measure on Z_p is the KMS_{1-beta}
density times the local Tate gamma factor). The global functional equation needs an archimedean vector
f and the Poisson step [FE] below. The Weil form sits in A as one identity (Lemma W): the prime side of
the explicit formula is phi_{1/2}(H_g), H_g = sum_n Lambda(n) g(log n) P_n, where phi_{1/2} is the unique
KMS state at beta = 1/2; Weil's criterion is the upper bound phi_{1/2}(H_g) <= archimedean + polar terms
on g = h * h~, and H_g is not a positive element for such g. Every inequality found is one of: a
square that holds for the controls (K, D, I below), or this Weil bound (rows P1, G21; target).

DH fails first at positivity of its density (D_DH in C*(Q/Z) is self-adjoint with eigenvalue -1), not at
the mu_n step; the mu_n defect a(6) - a(2)a(3) = 1.0807 is an identity. R1 does not rise.

## 0. Plan; answers to the three questions before work

- New relative to the record: positivity in the non-commutative Hecke algebra A = C*(Q/Z) x N^x. Not in
  `engine/curated/devices.json`; no map row (round 10 set aside KMS states with the reason "read set
  beta > 1"; that reason is corrected in section 2: KMS states exist for every beta > 0, and their read
  set on A is finitely many local factors at real beta).
- Q1 (controls): section 5. Q2 (height): no inequality with content survives. Q3 (multiplicativity):
  mu_m mu_n = mu_{mn} enters as covariance of the functionals (an identity); the inequality itself is
  proved by positivity of the functional alone.
- R4: section 4 (Lemma B). No answer; the lane is stage A only.

## 1. Setup (CLASSICAL: Bost-Connes 1995; relations as in the assignment)

l^2(N), basis e_k. mu_n e_k = e_{nk}; e(r) e_k = exp(2 pi i r k) e_k, r in Q/Z; H e_k = log k e_k;
sigma_t = Ad e^{itH}: sigma_t(mu_n) = n^{it} mu_n, sigma_t(e(r)) = e(r).
Relations: mu_n^* mu_n = 1; mu_m mu_n = mu_{mn}; mu_m^* mu_n = mu_n mu_m^* for (m, n) = 1;
mu_n e(r) mu_n^* = (1/n) sum_{ns = r} e(s). In particular P_n := mu_n mu_n^* = (1/n) sum_{ns = 0} e(s) is
the projection on multiples of n and lies in C*(Q/Z).
Algebraic Hecke algebra A_Q: span of mu_n e(r) mu_m^*.

Three identities used below (PROVED, one line each):
- (1.1) H = sum_n Lambda(n) P_n on finite vectors (H e_k = sum_{n | k} Lambda(n) e_k = log k e_k).
- (1.2) A Dirichlet series sum a_k k^-s with bounded a is Tr(D e^{-sH}), D = diag(a_k). D is in C*(Q/Z)
  when a is periodic; D >= 0 iff a_k >= 0; a completely multiplicative iff mu_n^* D mu_n = a(n) D for all n.
- (1.3) Gauge action: for chi completely multiplicative unimodular, alpha_chi(mu_n) = chi(n) mu_n,
  alpha_chi(e(r)) = e(r) is an automorphism of A (the relations are invariant), implemented by
  U_chi = diag(chi(k)). chi(n) = n^{it} gives sigma_t.

## 2. Positivity inside A: sigma-invariant states

**Lemma C (PROVED).** Let E(mu_n x mu_m^*) = delta_{nm} mu_n x mu_n^* for x in C*(Q/Z) (the average of
sigma_t over t; its range is C*(Q/Z) = C(Z^) by the fourth relation). Every sigma-invariant state phi
satisfies phi = phi o E, so phi(a*a) = integral over Z^ of E(a*a) d nu_phi with nu_phi a probability
measure. Proof: phi(mu_n x mu_m^*) = (n/m)^{it} phi(mu_n x mu_m^*) for all t.

**KMS values (CLASSICAL; CHECKED).** The Galois-invariant KMS_beta state is, for every beta > 0,

  phi_beta(mu_n e(a/b) mu_m^*) = delta_{nm} n^-beta f_beta(b),
  f_beta(b) = b^-beta prod_{p | b} (1 - p^(beta-1))/(1 - p^-1),   (a, b) = 1.

Unique for 0 < beta <= 1 (type III_1); for beta > 1 it is the average over Z^* of the type I states
zeta(beta)^-1 Tr(pi_alpha(x) e^{-beta H}). Checks: C1 (formula against the periodic zeta average,
beta = 1.5, 2, 3, b <= 30: 2e-31); C2 (covariance phi_beta(mu_n e(r) mu_n^*) = n^-beta phi_beta(e(r)) through
the fourth relation, beta = 0.3, 0.5, 1, 1.7: 1e-31); C3 (r -> f_beta(den r) positive definite on
(1/60)Z/Z: least eigenvalue 0.2566 at beta = 1/2, 1 at beta = 1, 0.0167 at beta = 2).

**Consequences (PROVED from the formula).**
(a) For x in A_Q, beta -> phi_beta(x) is entire and involves only the primes dividing the indices and
    denominators in x. Zeta occurs only as the normalisation Tr e^{-beta H}, and e^{-beta H}, e^{itH} are
    not in A.
(b) nu_beta is a product over p of the measures (1 - p^-beta) sum_k p^-k beta Haar(p^k Z_p^*) on Z_p.
    Positivity of phi_beta is local at each prime and holds for every beta > 0. Nothing changes at
    beta = 1/2.
(c) Sign: f_beta(b) > 0 for beta < 1; f_1(b) = 0 for b > 1; sign (-1)^omega(b) for beta > 1 (C3: least
    value -0.5 at beta = 2). The only transition is at the pole beta = 1.
(d) Inequality (K): phi_beta(a*a) >= 0, a in A_Q, reads finitely many primes. It is passed by zeta with any
    change of local factors at the other primes (finite modification, DEL with S away from those primes,
    T-NR at another q). R1 fails: not all primes together.

**Lemma L (local duality, PROVED).** On Q_p, the Fourier transform of the density of the p-part of
nu_beta, proportional to |x|^(beta-1) on Z_p, is b = p^k -> p^-k beta (1 - p^(beta-1))/(1 - p^-1) for k >= 1:
the homogeneous function abs(xi)^-beta on abs(xi) > 1. The density of nu_{1-beta} is the same
homogeneous function abs(x)^-beta on the complementary domain abs(x) <= 1; the ratio of the two
normalising constants is gamma_p = (1 - p^(beta-1))/(1 - p^-beta) (wording after the referee pass, item 2). This is the local functional
equation of Tate. The product of gamma_p over all p diverges for 0 < beta < 1; the global equation is
not a relation between phi_beta and phi_{1-beta} on A.

**Lemma W (Weil form in A, PROVED).** For g of compact support in (0, infinity), H_g := sum_n Lambda(n)
g(log n) P_n is in A (finite sum; by (1.1) it is the g-weighted Hamiltonian) and

  phi_{1/2}(H_g) = sum_n Lambda(n) n^(-1/2) g(log n),

the prime side of the explicit formula. Weil's criterion (map row P1) is: for g = h * h~,
phi_{1/2}(H_g + H_g^reflected) <= archimedean term + polar terms. H_g is not positive for such g, the
bound is an upper bound for a state value, and it uses from A only phi_{1/2}(P_n) = n^(-1/2) on the
commutative subalgebra generated by the P_n. It is the target, written in A. Controls: for DEL the same
identity holds with primes of S removed; no step of A distinguishes.

## 3. The dual system: inequality (D)

A x_sigma R is generated by A and u_t = e^{itH}. For beta > 1 the type I state extends:
phi^_beta(u_t) = zeta(beta - it)/zeta(beta).

**(D)** For g in L^1(R), a = integral g(t) u_t dt:
  phi^_beta(a*a) = zeta(beta)^-1 sum_k k^-beta |g^(log k)|^2 >= 0,   beta > 1.
This is Bochner positivity of t -> zeta(beta + it): coefficient positivity 1 >= 0 right of 1. With (1.2) it
holds for every D >= 0 (DEL, E_a, T-NR with c > 2, sign twist with eps >= 0).

**Lemma P (phase transition, PROVED/CLASSICAL).** As beta -> 1+, zeta(beta + it)/zeta(beta) -> 0 for t != 0
and = 1 at t = 0 (C7: 0.748, 0.108, 0.0109, 0.00109 at t = 1, beta = 2, 1.1, 1.01, 1.001). For beta <= 1
the factor is of type III_1, sigma_t is outer for t != 0, and the dual weight gives
phi^(a*a) = integral phi_beta(x(t)* x(t)) dt for a = integral x(t) u_t dt (CLASSICAL, Takesaki duality;
not opened): the function of t carried by the state for beta > 1 is replaced by the indicator of t = 0.
No value zeta(beta + it), beta <= 1, is a value of a positive functional of the system.

## 4. The displayed inequality with both marked steps: (I)

For f in S(R) even, lambda > 0: xi_{f,lambda} := sum_{k >= 1} f(lambda k) e_k, F := |f|^2,
Omega_lambda(x) := <xi_{f,lambda}, x xi_{f,lambda}>.

  **(I)   Omega_lambda(a*a) = || a xi_{f,lambda} ||^2 >= 0   for all a in A, lambda > 0.**

- **[M] (multiplicativity step).** mu_n^* xi_{f,lambda} = xi_{f,n lambda}, hence
  Omega_{n lambda}(x) = Omega_lambda(mu_n x mu_n^*). Under the Mellin transform in lambda this is the KMS
  covariance Z_s(mu_n x mu_n^*) = n^-s Z_s(x), Z_s(x) := integral Omega_lambda(x) lambda^s d lambda/lambda.
- **[FE] (functional-equation step; Poisson summation on e(r)).** For r = a/b:
  sum_{k in Z} F(lambda k) e(rk) = lambda^-1 sum_{m in Z} F^((m - r)/lambda)   (C6: 2e-31).
  The right side is F^ summed over the class -a mod b at scale 1/(b lambda): the phase e(a/b) at scale
  lambda is exchanged with the class projection (1/b) sum_j e(j/b) e(-ja/b) at the dual scale. r = 0 is the
  theta inversion and gives s <-> 1-s for zeta(s) M F(s).

**Lemma V (read set, PROVED).** Omega_lambda(mu_n e(r) mu_m^*) = sum_k conj f(n lambda k) f(m lambda k) e(rk)
and, for Re s > 1,
  Z_s(mu_n e(r) mu_m^*) = [sum_k e(rk) k^-s] * integral conj f(nu) f(mu) u^s du/u.
The first factor is the periodic zeta function, a finite combination of L(s, chi) with Gauss sums and
Dirichlet polynomials. The non-commuting generators contribute a commutative product: (function of s from
C*(Q/Z)) times (archimedean Mellin factor from the dilations). The device reads {L(s, chi)} and nothing
else; DH is the value Z_s(D_DH) of the same functional on a non-positive element of C*(Q/Z).

**Status of (I).** (I) is a square. Neither [M] nor [FE] is used to prove it; they rewrite it. Applied to
a = sum c_r e(r), [FE] turns "F >= 0 on the orbit lambda N" into "F^ is positive definite on Z + (r - r')":
the two sides of Bochner's theorem. Kernel-side positivity with the functional equation: the class the map
records as held by DH's theta kernel, E_a and T-NR (section 2 of the map, DH and NR rows).

**Lemma B (no crossing, PROVED rel. zeta(sigma) < 0 on (0,1)).** Z_s(1) = zeta(s) M F(s), M F(sigma) > 0 for
sigma > 0. On a line sigma > 1, t -> Z_{sigma+it}(1) is positive definite (Mellin transform of the
positive function lambda -> Omega_lambda(1)). On a line 0 < sigma < 1 it is not: Z_sigma(1) < 0. The
obstruction is F^(0) = ||f||^2 > 0: the polar term lambda^-1 F^(0)/2 of Omega_lambda(1) cannot be removed
while F = |f|^2, that is while Omega is a positive functional on A. Removing it (F(0) = F^(0) = 0) leaves
the image of Connes' map E, where the only positive quantity is ||E f||^2 = integral |zeta(1/2 + it)|^2
|M f|^2 dt (a mean value, holds for DH), and the sign of the zeros enters only through the trace of the
scaling action on the cokernel, which is Weil's functional (CLASSICAL: Connes 1999; Connes-Consani-
Marcolli 2007; not opened. Repo record: Route I rows, semilocal trace identity with remainder).

## 5. Control table for (I)

Steps: S = the functional is positive on a Bost-Connes-type algebra (this alone proves the inequality);
M = covariance under mu_n; F = Poisson step. "First fail" names the first step that fails.

| control | realisation in the device | S | M | F | first fail | inequality (I) |
|---|---|---|---|---|---|---|
| DEL | density D_S = prod_{p in S}(1 - P_p), a projection in A'' (in A for finite S) | yes | yes (a(p) = 0 on S) | no: no Poisson formula for integers free of primes of S | F | holds |
| THIN | gauge unitary U_eps, vector U_eps xi (1.3) | yes | yes (phase eps(n)) | no | F | holds |
| U | gauge unitary U_chi | yes | yes | no | F | holds |
| DH | D_DH = diag(1, kappa, -kappa, -1, 0 mod 5) in C*(Q/Z), self-adjoint | **no**: eigenvalue -1 (C5) | no: a(6) - a(2)a(3) = 1.0807 (identity) | yes (period 5) | S (sign of the density, not the mu_n step) | fails |
| E_a | A (x) A, xi_{f,l1} (x) xi_{f,l2}, weight (l1/l2)^a; state KMS_{beta+a} (x) KMS_{beta-a} | yes | yes (each factor) | yes (each factor) | **none** | holds |
| T-NR, c > 2 | density D = 1 + c sqrt(q) P_q + q P_{q^2} in A, D >= 1 | yes | exact for (n, q) = 1; at n = q with the bounded positive cocycle mu_q^* D mu_q D^-1 in C*(Q/Z) (multiplicative, not completely multiplicative, at the one prime q) | yes: G(l) = (q l)^-1 G(1/(q^2 l)) (C4e: 4e-30) | **none** among steps used by (I); exact covariance fails at the single prime q (local, map row L4) | holds |
| T-NR, c < -2 | same D, eigenvalue 1 + c sqrt(q) < 0 | no | yes | yes | S | fails |
| EIS-w | GL_2 system (Q-lattices of rank 2); vector sum F(lambda abs(mz + n)); 2-dimensional Poisson | yes | yes (Hecke) | yes | **none** (ARGUED; no step reads phi(w')) | holds |
| window translate | f replaced by f(x) abs(x)^(-i alpha), f vanishing near 0: a member of the device family | yes | yes | yes (shifted symmetry) | **none** | holds |
| interpolation twin | density 1 + c b(n), b(p) = chi_-4(p) + chi_5(p), b(3) = -2, b(21) = 4, b(3*7*23) = -8 | no (unbounded, both signs) | no | no | S | fails |
| backward heat | kernel e^{tau u^2/16} kappa: not of the form Omega^f_lambda(1) for any f | yes at x = 1 only | no (cocycle 2t log m log n) | yes (even) | M | not formulable on A |
| sign twist | eps >= 0: multiplicative density; signed: gauge unitary | yes | yes | no | F | holds |

Controls passing every step exactly: E_a (in its tensor system), window translate (inside the family; it
has no known off-line zero and tests only window-local use of the functional equation), EIS-w (argued).
T-NR (c > 2) passes every step that (I) uses, inside A itself. Stop rule applies.
For (K): passed by every control that changes local factors only at primes outside the support of a.
For (D): passed by every control with non-negative coefficients.

**Lemma T (PROVED; CHECKED C4).** D = 1 + c sqrt(q) P_q + q P_{q^2} has D e_k = a(k) e_k, a(k) = 1 +
c sqrt(q)[q | k] + q[q^2 | k], and sum a(k) k^-s = zeta(s)(1 + c sqrt(q) q^-s + q q^-2s) = q^(1/2 - s)
zeta(s)(2 cosh((s - 1/2) log q) + c) (C4a: 1e-20 at s = 8). phi_beta(D) = 1 + c sqrt(q) q^-beta + q q^-2beta
for every beta > 0, an entire function of beta with zeros at beta = 1/2 +- arccosh(c/2)/log q + i pi
(2j+1)/log q (q = 3, c = 2.1: zero at 0.786657 + 2.859601 i, |F| = 3e-32; |F| = 0.033 at distance 0.1).
omega_D = phi_beta(D .)/phi_beta(D) is a state on A, KMS at inverse temperature beta for
sigma'_t = Ad(D^(-it/beta)) o sigma_t (D is in the centraliser of phi_beta). A value of the continued KMS
functional on a positive element of A vanishes at complex beta off the line: positivity in A at real beta
carries no information on zeros of beta -> zeta(beta) phi_beta(x).

**Lemma E.** zeta(s + a) zeta(s - a) = Tr(e^{-(s+a)H} (x) e^{-(s-a)H}) on l^2(N) (x) l^2(N). Each factor
has its own relations, KMS states and Poisson step. PROVED at the level of the three marked steps.
GL_2 system (Connes-Marcolli 2004): partition function zeta(beta) zeta(beta - 1), symmetry beta <-> 2 - beta,
zeros on Re beta = 1/2 and 3/2, off the symmetry line Re beta = 1 (CLASSICAL, recalled).

## 6. Requirement flags and evidence

- R1 false. (K) reads finitely many primes. (D) and (I) are proved by positivity of the functional;
  [M] is a covariance identity. DH fails at the sign of its density.
- R2 false. No inequality with content at height t; (D), (I) are Bochner statements on lines sigma > 1.
- R3 false. E_a passes every step (Lemma E); T-NR (c > 2) passes every step used by an inequality
  (Lemma T); window translate is inside the family.
- R4 false. Lemma B: positivity is lost at the pole; Lemma P: the state family changes type at beta = 1.

## 7. Adjacent idea (the one pivot, on paper)

Candidate: use an operator inequality in A'' instead of a state: find X >= H_g (g = h * h~) with
phi_{1/2}(X) equal to the archimedean and polar terms. For diagonal X this is a pointwise bound on Z^
for the function x -> sum_{n | x} Lambda(n) g(log n), integrated against nu_{1/2}. nu_{1/2} is a product
measure carried by points with infinitely many prime factors; the same construction with nu replaced by
the product measure of DEL or of T-NR (Lemma T) has the same pointwise order relations, and the
archimedean side is the only place where the function is identified. This is Lemma W again: the Weil
bound with no new inequality. Not pursued. A principle for the engine follows from Lemma T: **a device
whose read set is invariant under bounded inner perturbations of the Bost-Connes dynamics by positive
elements of C*(Q/Z) is passed by T-NR**; this covers KMS structure, type, symmetry group, and every
positivity statement for sigma-invariant states.

## 8. Three weakest steps

1. Coverage. "Any state built with the duality" is examined for three classes only: sigma-invariant
   states (Lemma C), the dual-system extension (D), and the vector states xi_{f,lambda} with their Mellin
   families (I). States not of these forms (for example non-factorisable Schwartz-Bruhat vectors, which
   are finite sums of factorisable ones, or weights on the type II_infinity dual at beta <= 1 other
   than the dual weight) are covered only by Lemma V's read set, not by a classification.
2. Sources. Bost-Connes uniqueness and type for beta <= 1, Takesaki duality for the dual weight,
   Connes' trace formula and the GL_2 system are recalled, not opened. The KMS formula is checked
   numerically (C1 to C3) for covariance and positive definiteness on (1/60)Z/Z, not re-proved. Lemmas C,
   V, T, B do not depend on the unopened sources; Lemma P's statement for beta <= 1 and the EIS-w row do.
3. EIS-w and E_a rows. The realisation of E_a on A (x) A is a product of two copies and not a single
   Bost-Connes system; "passes every step" means each marked step holds in each factor. The EIS-w row is
   argued from the form of the GL_2 system and was not written out.

## 9. Files

- `identity_checks.py`, `identity_checks.json`, `identity_checks.log`: checks C1 to C7.
- `MAP_ROW.md`: proposed closed device row and control note for `OBSTRUCTION_MAP.md` (not entered).
- `engine_device_proposal.json`: proposed entry for `engine/curated/devices.json` (not entered).
- `REFEREE.md`: adversarial pass (author; not independent).
- `lanes_line.json`: the line appended to `campaign/lanes.jsonl`.
