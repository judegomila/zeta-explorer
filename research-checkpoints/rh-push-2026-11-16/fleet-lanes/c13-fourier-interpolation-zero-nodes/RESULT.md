# c13-fourier-interpolation-zero-nodes: Fourier interpolation with nodes at the zeros (device type new to the map)

Round 13, kind: explore, stage A. Date 2026-11-19. Local only: two runs through `scripts/memcap.sh 8`
(`checks.py`, `ref_check.py`; each under 2 minutes, planned arrays 24 MB). No server job was started; no ssh.
Labels: PROVED (in this note) / PROVED-rel (relative to a named statement of an opened source) / CLASSICAL /
MEASURED / ARGUED / OPEN. Nothing here is a statement about zeros of zeta and no bound moves.

Sources opened (text extraction of the arXiv PDFs, in `sources/`):
- BRS = Bondarenko, Radchenko, Seip, "Fourier interpolation with zeros of zeta and L-functions",
  arXiv:2005.02996v3. Read: sections 1, 2 (start), 4.1 to 4.4, 5.1 to 5.3. Not read line by line: sections 3, 6, 7
  (definition and estimates of the modular integrals); statements from them are PROVED-rel.
- RV = Radchenko, Viazovska, "Fourier interpolation on the real line", arXiv:1701.00265. Read: Theorems 1, 2 and
  the proof of Theorem 2.
Not opened (cited as "relative to"): Ramachandra-Sankaranarayanan (BRS reference [26]); Kulikov (BRS [20]);
Bochner (BRS [2], [3]); Knopp (BRS [15], [19]).

## 0. Verdict

**Precise obstruction. The device is closed at stage A: T-NR passes every step, and so do the window translate,
Davenport-Heilbronn and theta^w in a narrower function class. No requirement flag is claimed.**

1. First lemma (section 3). Construction (b) uses: an ordinary (or general) Dirichlet series, and a functional
   equation with gamma factor in one of three classes (Gamma_R(s), Gamma_R(s+1), Gamma_C(s)). It does not use the
   Euler product to build the kernel or the basis. The Euler product enters at two places only: (E1) the
   coefficients of 1/zeta are bounded, |mu(d)| <= 1, used in BRS Lemma 4.2 to place the edge of absolute
   convergence of the kernel at Re w = 1; (E2) the lower bound of Ramachandra-Sankaranarayanan for |zeta| on
   selected horizontal segments (BRS Lemma 4.3), used to choose the truncation heights T_k and to fix the function
   class H_1. BRS section 5.3.2 is titled "Dirichlet series without Euler products" and replaces (E2) by a
   Jensen bound, with a smaller function class. BRS section 5.3.3 states the construction for linear combinations
   of L-functions with the same functional equation (this contains DH) and for an L-function multiplied by
   r^(ns/2) P(r^-(s-1/2)) (with P(x) = 1 + c x + x^2 and r = q this is the T-NR twin). E_a is outside the three
   gamma classes: not verbatim, not decided here.
2. Structure (section 4, PROVED-rel BRS (4.2), (4.6), (4.7)). The kernel is
   H(w,s) = (F*(s)/F*(w)) x A_k(w,s), where A_k is a target-independent Dirichlet series (the modular integral of
   the theta group; unique by Bochner's converse theorem, BRS Remark after (4.2)). All interpolation bases of the
   class form one orbit under multiplication of the kernel by G(s)/G(w), G(1-s) = G(s). The target enters by
   division only.
3. Decisive test (section 5). A node set with off-line zeros changes neither the sign pattern nor the decay of
   the basis functions in the variable z: for T-NR, U_m^NR(z) = P(1/2+iz) x (finite combination of zeta's U_n)
   and V_rho^NR(z) = (P(1/2+iz)/P(rho)) V_rho(z), with |c|-2 <= |P(1/2+iz)| <= |c|+2 and P of one sign on the
   real axis (PROVED-rel). It changes one thing: the growth in the frequency index n of the partial sums
   A(x;s) = sum_{n<=x} h_n(s). Their exponent is at least theta/2, theta = sup Re rho (PROVED-rel), against the
   exponent 1/2 that the Euler product gives through |mu| <= 1. An off-line zero at beta < 1 needs exponent
   beta/2 < 1/2. There is no contradiction. The one displayed inequality that is not an identity is

       |A(x;s)| <= C(s) sqrt(x) log x      (BRS Lemma 4.2; the step sum_{d<=sqrt x} |mu(d)|/d <= log x + 1)   (I-1)

   It reads unimodular local parameters at every prime, it fails for E_a (exponent (1+a)/2) and for DH (inverse
   coefficients unbounded, 1/F not absolutely convergent at Re w = 1), and T-NR satisfies its conclusion
   (1/P converges absolutely for Re w > 1/2 + a, a < 1/2). Its conclusion is the half-plane Re w > 1. The
   statement with exponent 1/4 + eps is equivalent to RH (restatement of Littlewood type).
4. Side (a), Radchenko-Viazovska. The samples (f(sqrt n), f^(sqrt n)) of an even Schwartz function satisfy
   exactly one linear relation, Poisson summation (RV Theorem 2). In the BRS frame it is the specialisation
   s = 0 of the kernel (BRS (4.4): A^+_(1/2)(w,0) = -2 pi^-w Gamma(w) zeta(2w)); at weight l/2 it is r_l
   (BRS (4.4), l = 1, 2, 3), which for real weight w/2 is the radial Poisson relation of theta^w (relation
   checked to 1e-30 at w = 0.8, 1.3, 4). The relation functional is unique because the space of holomorphic
   forms is one-dimensional; its Hecke covariance at every prime is a consequence of that dimension count, an
   identity.

Device row for the map: section 9.

## 1. Plan, and what is new against the map

Keyword check by the round-13 planner: 0 map rows, 0 lane files for Fourier interpolation. Nearest rows:
G-rows of the h-klein-fricke family and `c12-x04-oval-hecke-fricke-loading` (theta on X_0(4), Hecke covariance
collapses to dilations on a Fricke-fixed vector), `n3-theta-power-departure-law` (theta^w passes Hecke-Hamburger
uniqueness), D5 (interpolation twin), and the positivity rows of section 3.1 (explicit formula with Lambda >= 0).

Three questions of map section 2, answered before work:
- Q1 (controls): section 6. T-NR is run first (invariance pre-filter of round 12, lesson 2).
- Q2 (height): the formula (1.2) is one identity for all z in the strip; nothing in it is window-local.
  The only height-dependent input is (E2), which selects one height per window [T, T + T^(1/3)].
- Q3 (multiplicativity): (E1) and (E2) above. Both act on or right of Re w = 1 (E1), or between zeros (E2).
- R4: no crossing step was found; the lane is stage A only.

## 2. The construction in the notation used below (PROVED-rel BRS sections 4.2, 4.3)

zeta*(s) = Gamma_R(s) zeta(s). A^(+-)_(1/2)(w,s) = pi^-w Gamma(w) sum_n alpha^(+-)_n(s) n^-w is a Dirichlet series
in w with A(1/2 - w, s) = +-A(w,s), simple poles at w = s and w = 1/2 - s, built from modular integrals of
weight 1/2 for the theta group. The kernels are

    H_(+-)(w,s) = (zeta*(s)/2) A^(+-)_(1/2)(w/2, s/2) / zeta*(w) = sum_n h_n^(+-)(s) n^(-w/2),           (BRS 4.6)
    h_n^(+-)(s) = (zeta*(s)/2) sum_{d^2 | n} mu(d) alpha^(+-)_(n/d^2)(s/2),                              (BRS 4.7)
    H_(+-)(1-w,s) = +-H_(+-)(w,s),   H_(+-)(w,1-s) = -+H_(+-)(w,s),                                      (BRS 4.8)

with poles in w at w = s, 1 - s (residues 1, -+1) and at the zeros rho of zeta. U_n(z) is h_n(1/2 + iz) up to the
factor 2 pi n^(-1/4); V_(rho,j)(z) are the Laurent coefficients of H at w = rho. Theorem 1.1: for even f analytic
in |Im z| < 1/2 + eps with the stated integrability,

    f(z) = sum_n f^(log n / 4 pi) U_n(z) + lim_k sum_{0 < gamma <= T_k} sum_j f^(j)((rho - 1/2)/i) V_(rho,j)(z),   (BRS 1.2)

with U_n vanishing at all nodes, U_n^ = delta on the frequencies, and the dual statements for V (BRS 1.3). The
theorem is unconditional: the nodes (rho - 1/2)/i are complex if rho is off the line, and the hypothesis on f
(analytic in the strip) is there to allow that. The proof integrates f((w - 1/2)/i) H(w, 1/2 + iz) over
Re w = c and Re w = 1 - c, c > 1, folds the left line by (4.8), expands the Dirichlet series (gives the frequency
sum) and collects residues (gives f(z) and the node sum).

## 3. First lemma: hypotheses of construction (b)

**Lemma 1 (PROVED-rel BRS; each item is a read of the proof).** The proof of (1.2) and (1.3) uses the following
properties of the target F and no others.

| # | property of F | where | Euler product? |
|---|---|---|---|
| H1 | F*(s) = r^(s/2) Gamma(s) F(s) with gamma factor Gamma_R(s), Gamma_R(s+1) or Gamma_C(s), F*(k-s) = +-F*(s) | (4.8), (5.5): symmetry of the kernel in w and in s; choice of the weight of A_k | no |
| H2 | 1/F(w) is a Dirichlet series over frequencies closed under multiplication with n^(-w/2), absolutely convergent on the edge Re w = c | (4.6), (4.7), (4.14): the frequency side | only the value of c: |mu| <= 1 gives c = 1 + eps (E1) |
| H3 | partial sums of h_n: A(x) << x^(1/2 + eps) | Lemma 4.2, (4.12) | yes, through |mu(d)| <= 1 (E1) |
| H4 | min over t in [T, T + T^(1/3)] of max over 1/2 <= sigma <= 2 of |F(sigma + it)|^-1 <= exp(c (log log T)^2) | Lemma 4.3; choice of T_k; error term E(s,T) | yes (E2), relative to Ramachandra-Sankaranarayanan Theorem 2, not opened |
| H5 | polynomial growth of F* / convexity or subconvexity in the strip | E(s,T), proof of Theorem 5.1 | no |

BRS states the dependence itself: "the deduction of the Riemann-Weil formula starts from the Euler product
representation of zeta(s), while formula (1.2) is tied to the Dirichlet series representation of zeta(s)"
(section 1); "since the denominator of (5.10) in general can not be represented as an Euler product, the
techniques from [26] must be abandoned ... The bound in (5.11) is our replacement for Lemma 4.3, and,
consequently, we need to require that functions decay accordingly" (section 5.3.2).

**Does it hold verbatim for the three named controls?**

- **T-NR: yes (PROVED-rel BRS 5.3.3 and Lemma M below; one step ARGUED).** BRS 5.3.3: "we may, for an arbitrary
  polynomial P of degree n, multiply for example a Dirichlet L-function by r^(ns/2) P(r^-(s-1/2)) with r > 1 an
  integer and P(0) != 0 ... any complex arithmetic progression with common difference 2 pi / log r may be
  adjoined to a given multi-set Lambda ... both the negative and positive part of the sequence Lambda* are
  pushed away by log r/(4 pi) [per degree] from the origin." With r = q, P(x) = 1 + c x + x^2:
  q^s P(q^-(s-1/2)) = q^(1/2) (2 cosh((s - 1/2) log q) + c), the T-NR factor. H1 holds with zeta's gamma factor
  (P is symmetric). H2 holds with the same edge c = 1 + eps, because 1/P(w) converges absolutely for
  Re w > 1/2 + a and a < 1/2 (checks K2). H3 holds with the same exponent. H5 holds. H4: P is bounded below by
  |c| - 2 on the horizontal lines Im w = 2 pi k / log q (c > 2) or (2k+1) pi / log q (c < -2) (K2: minimum 4.05
  to 4.2 on -1 <= u <= 2 at the tested parameters; this is |c| + 2 at u = 1/2 and larger elsewhere); the height
  given by Lemma 4.3 must in addition stay at distance at least T^-A from the zero heights of P, which the
  statement of Lemma 4.3 as quoted (a minimum over the window) does not give. With the Jensen form (5.11) the
  selection is available for zeta x P as for any function of finite order, and the function class shrinks as in
  5.3.2. This is weakest step 1. The verdict of stage A does not depend on which of the two classes holds.
- **DH: yes in the narrower class of BRS 5.3.2 (PROVED-rel BRS 5.3.3, stated there without proof).**
  DH = ((1 - i kappa) L(s,chi) + (1 + i kappa) L(s,chi-bar))/2, chi odd mod 5: F*(s) = 5^(s/2) Gamma_R(s+1) F(s)
  satisfies F*(1-s) = F*(s) (referee check R1: relative defect 1e-30 at three points). The kernel is that of BRS
  Theorem 5.2, H_delta(w,s) = F*(s) A^delta_(3/2)((w+1)/2, (s+1)/2) / (2 F*(w)). H2: the edge of A_(3/2) is
  Re w = 2 (BRS 5.2), and 1/F converges absolutely at Re w = 2 (PROVED: sum_{n>=2} |a(n)| n^-2 <= zeta(2) - 1 =
  0.645 < 1, Neumann series, so sum |b(n)| n^-2 <= 2.82; measured 1.29101 at N = 1e6, K1). The strip of
  Theorem 5.2, |Im z| < 3/2 + eps, contains all zeros of DH, those with Re rho in (1, 1.1204) included. H3 in the
  form |b(d)| <= 1 fails (max |b(n)| = 1421 at n = 825552; the product defect a(6) - a(2)a(3) = 1.0807), and is
  not needed at the edge 2. H4 is not available (no Euler product); (5.11) replaces it. First step that is not
  verbatim: H4. The basis functions exist, vanish at the nodes (factor F*(s)) and include V_rho for the off-line
  zeros 0.8085171825 + 85.6993484854i and its images.
- **E_a: not verbatim; not decided (OPEN).** The gamma factor Gamma_R(s+a) Gamma_R(s-a) is in none of the three
  classes; BRS 5.3.3 ("more complicated gamma factors") covers powers of unshifted Gamma_R, Gamma_C only, and
  there "the resulting functions U_n and V_(rho,j) will no longer form a basis". A kernel would need an
  abundance principle for weight-0 Maass-type Dirichlet series with spectral parameter a, which is not in the
  source. One fact is available (ARGUED, from the non-even form of Theorem 1.1, which BRS state "extends
  painlessly"): applying (1.2) to z -> f(z + ia) shows that the zeros of zeta(s + a) alone, with the full
  frequency set {+-log n/(4 pi)} and weights n^(-+a/2), already determine f. The node set of E_a is twice that,
  so with the same frequency set it is redundant; a basis for E_a must use a thinner frequency set (the degree-2
  pattern {log n/(2 pi)} of BRS 5.3.1). E_a fails at H1, a statement about the gamma class and not an
  inequality; and it fails (I-1) quantitatively (section 5).

## 4. Structure lemmas

**Lemma M (multiplier orbit; PROVED from (4.6) to (4.8), given the zeta kernel).** Let G be meromorphic with
G(1-s) = G(s), and let 1/G(w) = sum_j g_j lambda_j^(-w/2) converge absolutely for Re w > sigma_G, with
lambda_j n in a discrete set for all j, n. Put H^G(w,s) = H(w,s) G(s)/G(w). Then: (i) H^G(1-w,s) = +-H^G(w,s)
and H^G(w,1-s) = -+H^G(w,s); (ii) H^G is a general Dirichlet series in w, absolutely convergent for
Re w > max(1, sigma_G), with coefficients h^G_m(s) = G(s) sum_{lambda_j n = m} g_j h_n(s); (iii) its poles in w
are w = s and w = 1 - s with residues 1 and -+1, the zeros of zeta, and the zeros of G; (iv) h^G_m(s) vanishes at
the zeros of zeta* G to their order. Proof: G(s)/G(w) is 1 at w = s, symmetric in each variable, and the product
of two absolutely convergent Dirichlet series is one. QED. The same holds for the kernels of BRS Theorems 5.1,
5.2 in place of zeta's.

Consequence. The kernel of a target F in the gamma class of zeta is H^F = (F*(s)/F*(w)) x (A/2), and
H^F = H^zeta x G(s)/G(w) with G = F*/zeta*. The second factor A is the same for every target. By the Remark
after BRS (4.2) (Bochner's converse theorem; PROVED-rel, sources [2], [3] not opened) any Dirichlet series psi
with Psi(k - w) = +-Psi(w) and finitely many poles is L_f plus a finite combination of derivatives of
A_k(w, s_j), f in M_k(Gamma_theta, +-): A_k is determined by its functional equation and its poles. So the
device is: (universal object attached to the gamma class and the pole) divided by (the target). In the terms of
round-11 Lemma J and round-12 lesson 1 it is an identification: the content specific to zeta is the sequence of
coefficients of 1/zeta, read linearly.

**Lemma T (T-NR basis; PROVED-rel BRS (1.3), with the normalisation U_n = 2 pi n^(-1/4) h_n(1/2 + iz)).**
P(w) = 2 cosh((w - 1/2) log q) + c, |c| > 2, a = arccosh(|c|/2)/log q < 1/2. Then
1/P(w) = sum_{j>=0} g_j q^(-(j+1)(w-1/2)), g_0 = 1, g_1 = -c, g_j = -c g_(j-1) - g_(j-2), absolutely convergent
for Re w > 1/2 + a. With m in q^2 N:

    U^NR_m(z) = P(1/2 + iz) sum_{j >= 0, q^(2(j+1)) | m} g_j U_(m / q^(2(j+1)))(z),      P(1/2 + iz) = 2 cos(z log q) + c,
    V^NR_rho(z) = (P(1/2 + iz) / P(rho)) V_rho(z)        (rho a simple zero of zeta, P(rho) != 0),
    V^NR_varpi(z) = P(1/2 + iz) H(varpi, 1/2 + iz) / P'(varpi)        (varpi a zero of P).

The frequency set is {+-log m/(4 pi): m in q^2 N} (lowest frequency log q/(2 pi) instead of 0), the node set is
the zeros of zeta together with the two progressions 1/2 +- a + i(h_0 + 2 pi k/log q). Biorthogonality on the
new frequency set: multiplication by q^(+-iz) shifts the Fourier variable by +-log(q^2)/(4 pi), so
U^NR_m^(log m'/(4 pi)) = sum_j g_j [delta(n_j, m'/q^2) + c delta(n_j, m') + delta(n_j, m' q^2)], n_j = m/q^(2(j+1)),
which is the coefficient form of P x (1/P) = 1 and equals delta(m, m') for m, m' in q^2 N (referee check R2:
deviation 0 on a 12 x 12 block for four parameter pairs). The powers q^((j+1)/2) from q^(-(j+1)(w-1/2)) cancel
against the normalisation n^(-1/4).

**Proposition G (growth in the frequency index).** Let theta = sup Re rho and A(x;s) = sum_{n<=x} h_n(s).
(i) (PROVED-rel BRS Lemma 4.2) for 1/2 <= Re s < 1: A(x;s) << sqrt(x) log x. (ii) (PROVED-rel (1.3)) for every z
outside a discrete set, limsup log|A(x; 1/2+iz)|/log x >= theta/2: if A(x) << x^kappa the series for H converges
and is analytic in Re w > 2 kappa, and H(., 1/2 + iz) has a pole at every rho because V_(rho,j) are non-zero
entire functions (V^(j)_(rho,j)((rho-1/2)/i) = 1). (iii) (ARGUED: Perron's formula with 1/zeta(w) << |w|^eps in
Re w >= theta + delta and BRS (4.11)) the limsup equals theta/2. Hence "A(x;s) << x^(1/4 + eps) for all s" is
equivalent to RH, in the same way as M(x) << x^(1/2 + eps).

## 5. The decisive first test

Question: does a node set with off-line zeros change the growth or the sign of the basis functions in a way
that contradicts a property forced by the Euler product at every prime?

Paper answer (PROVED-rel, Lemma T and Proposition G):

1. In the variable z (decay, sign on the real axis): no change. Theorem 1.1 is unconditional and its basis
   functions are rapidly decaying whatever the position of the zeros. Adjoining the off-line progressions of
   T-NR multiplies every V_rho by the real function P(1/2 + iz)/P(rho), which has one sign on the real axis and
   modulus between (|c| - 2)/|P(rho)| and (|c| + 2)/|P(rho)|, and replaces U_m by the same factor times a finite
   combination of zeta's U_n. Real zeros of U_n: the real ordinates gamma (factor zeta*(1/2 + iz)) and the real
   zeros of the entire cofactor; an off-line node removes a sign change and adds nothing that the construction
   reads.
2. In the frequency index n: the exponent of A(x;s) moves from 1/4 (all zeros on the line) to beta/2 for a
   zero at Re rho = beta. The Euler product forces exponent at most 1/2, through |mu(d)| <= 1 at every prime
   jointly. beta/2 < 1/2 for every beta < 1. The inequality (I-1) and an off-line zero are compatible.
3. Hecke covariance of theta at every prime: it is the statement 1/zeta(2w) = sum mu(d) d^(-2w), which enters
   (4.7) as a linear convolution. No inequality in the construction consumes more than the size bound
   |mu(d)| <= 1. The kernel factor A, where the theta group acts, does not depend on the target.

4. Density (BRS section 2.4, Kulikov's inequality N_Lambda(T) + N_Lambda*(W) >= 4WT - C log^(2+eta)(4WT),
   PROVED-rel, source [20] not opened): it reads the counting function N(T) with multiplicity and is blind to
   the real parts of the nodes. For T-NR the added (T/pi) x 2 log q nodes are balanced by the removed
   frequencies below log q/(2 pi) (BRS 5.3.4).

So there is one displayed inequality that is not an identity, (I-1). It separates zeta from E_a and DH. It does
not separate zeta from T-NR, and its conclusion is confined to Re w > 1.

Numerics (section 8) confirm the inputs of this answer for the controls; they do not replace it. Stage B
(computing alpha_n(s) and the functions U_n, V_rho themselves) was not run: stage A has passing controls.

## 6. Stage A

### 6.1 Candidate inequality and marked steps

    (I-1)   |sum_{n <= x} h_n(s)| <= (|zeta*(s)|/2) sum_{d <= sqrt x} |mu(d)| |sum_{n <= x/d^2} alpha_n(s/2)|
                                   << sqrt(x) sum_{d <= sqrt x} 1/d <= sqrt(x) (1 + log x),      1/2 <= Re s < 1.

- Multiplicativity step [M]: |mu(d)| <= 1 for all d, i.e. every local factor of 1/zeta is 1 - p^-w with a
  unimodular parameter, at all primes jointly. This is the size reading (SIZE/GEOM of the map), not covariance.
- Functional-equation step [FE]: (4.8), used to fold the line Re w = 1 - c onto Re w = c; and BRS Proposition
  6.5 for sum_{n<=y} alpha_n << sqrt(y), which belongs to the kernel A and not to the target.
- [M] and [FE] are not used in one inequality: [FE] is an identity of the kernel, [M] bounds a convolution.
- Second inequality, (I-2) = H4 (Lemma 4.3), [M] relative to the unopened source. It selects heights between
  zeros and controls the truncation; it is not a statement about where zeros are.
- Everything else, (1.2), (1.3), the values W U_n and W V_rho of section 7, is an identity.

### 6.2 Control table

Steps: S0 = H1 (the kernel is defined and symmetric); S1 = H2 + H3 (edge and partial sums, the inequality
(I-1)); S2 = H4 (I-2); S3 = contour identity (1.2), (1.3); C = the conclusion of (I-1) (absolute convergence
of the kernel in Re w > 1, exponent 1/2). T-NR is listed first (pre-filter).

| control | S0 | S1 / (I-1) | S2 / (I-2) | S3 | first failing step; reason | status |
|---|---|---|---|---|---|---|
| T-NR, any q, 2 < abs(c) < 2 cosh(log q / 2) | holds (P symmetric, zeta's gamma factor) | holds: 1/P absolutely convergent for Re w > 1/2 + a < 1; same exponent 1/2 | holds on the lines where P >= abs(c) - 2; joint selection with Lemma 4.3 ARGUED, Jensen form available | holds (Lemma T) | **none: passes every step.** Nodes off the line at Re = 1/2 +- a; frequency set starts at log q/(2 pi) | PROVED-rel BRS 5.3.3, Lemma M, Lemma T; K2, R2 |
| DH | holds (class of BRS Theorem 5.2) | (I-1) with exponent 1/2 fails: abs(b(n)) unbounded, 1/F not absolutely convergent on Re w = 1 (zeros to Re = 1.1204). Not needed: the edge of A_(3/2) is Re w = 2, where sum abs(b(n)) n^-2 <= 2.82 | not available; replaced by (5.11), smaller function class | holds in that class | S1 as an inequality, S2 as a theorem; neither stops the construction. Reason: no Euler product | PROVED-rel BRS 5.3.2, 5.3.3 (sketch in source); K1, R1 |
| E_a | not defined: gamma factor Gamma_R(s+a) Gamma_R(s-a) outside the three classes | fails: abs(b(n)) of size n^a, 1/E_a absolutely convergent only for Re w > 1 + a (K3) | not examined | not examined | S0 (gamma class; not formulable, which is not a quantitative handle) and (I-1) (SIZE) | OPEN at S0; (I-1) PROVED |
| theta^w, real w | holds: BRS (5.10) at s_0 = 0 is the family A_k(w/2, 0), k = w/2, the Mellin transform of theta^w (BRS (4.4) for w = 1, 2, 3; real k allowed in BRS section 3) | no bounded inverse (not multiplicative unless w in {1,2,4,8}; defect at m = 6: -0.219 at w = 1.3, 4/3 at w = 3); edge further right | (5.11) only | holds in the class of 5.3.2 | S1, S2 as for DH; construction passes | PROVED-rel BRS 5.3.2 for the family; identification of s_0 = 0 with theta^w ARGUED for non-integer w; K4 |
| WT, zeta(s + i alpha) | symmetric about 1/2 - i alpha, not 1/2 | holds (coefficients mu(d) d^(-i alpha), modulus 1) | holds (translate of Lemma 4.3) | holds: the formula for zeta applied to z -> f(z - alpha) | none as a translate; the device has no step that reads the centre of symmetry beyond S0 | ARGUED (uses the non-even form of Theorem 1.1) |
| U (unimodular completely multiplicative, no FE) | fails: no functional equation, the left line Re w = 1 - c is not a Dirichlet series in w | holds: abs(mu(d) chi(d)) <= 1 | open for general chi | not formulable | S0; lacks FE | PROVED (definition) |
| THIN | fails (no FE) | holds (inverse mu(d) eps(d)) | n/a | n/a | S0 | same |
| DEL | fails (no FE) | holds (inverse mu on integers free of primes of S) | n/a | n/a | S0 | same |
| sign twist TW+-, Liouville | fails (no FE; Liouville: zeta(2s)/zeta(s) has no gamma-symmetric form) | holds when eps is completely multiplicative of modulus <= 1 | n/a | n/a | S0 | same |
| EIS-w, zeta(s + w' - 1/2) zeta(s - w' + 1/2) | as E_a with complex shift: gamma class not covered | fails in size when Re w' != 1/2 | n/a | n/a | S0 | OPEN at S0 |
| interpolation twin | fails (no FE) | no bounded inverse | n/a | n/a | S0 | PROVED (definition) |
| backward heat | fails: not a Dirichlet series with fixed frequencies; the family H(w,s) has no expansion in n^(-w/2) | n/a | n/a | n/a | S0 | PROVED (definition; map row HEAT) |
| Beurling; phase-rotated transfer operator | fail: no functional equation of the three classes (Beurling: no integers, so the frequency set is not closed under the product with n^(-w/2)) | n/a | n/a | n/a | S0 | not formulable |
| UNIV | not in scope: the device contains no pointwise inequality among L-values at every height; (I-2) is an existence statement in each window | | | | | - |

Reading. Controls without a functional equation stop at S0 and satisfy [M]; controls with the functional
equation (T-NR, DH, theta^w, WT) pass the construction, and of these T-NR and WT pass (I-1) as well. No control
is stopped by a step that uses [M] and [FE] in one inequality, because the device has no such step. By the
stage-A rule the lane stops here.

T-NR invariance pre-filter (round-12 lesson 2), stated for this device: the kernel, the basis and the
conclusion of (I-1) are covariant under F -> F x G for every symmetric G with 1/G absolutely convergent in
Re w > 1 (Lemma M). Multiplication by a positive Dirichlet polynomial at one prime with zeros in the open strip
is such a G. The device is passed by the pre-filter, hence by T-NR.

## 7. Pivot (one): the Weil functional in the interpolation basis

Adjacent idea examined: BRS section 4.4 gives the coordinates of the Weil functional W (left side of the
explicit formula) in the basis: W U_n = Lambda(m)/(pi sqrt m) for n = m^2 and 0 otherwise, W V_(rho,0) = 2,
W V_(rho,j) = 0 for j > 0. Candidate: use W U_n >= 0 for all n, a positivity carried by the Euler product, as
the inequality.

Result: closed by existing rows. (i) The values are obtained from the explicit formula itself (BRS: "It would be
interesting to know whether these curious properties of the basis functions could be obtained without resorting
to the Riemann-Weil formula"), so the statement is the explicit formula in coordinates: an identity.
(ii) W U_n >= 0 is Lambda >= 0 with prime-power support. With the functional equation this is the read set of
the positivity rows of map section 3.1, which three lanes proved insufficient (pick-induction Theorem R,
g-channel-geometry Theorem C, sq-causal-cascade Theorem 3). (iii) For T-NR the coordinates are those of -F'/F,
with entries -log q (alpha^j + alpha^-j) q^(j/2) at the powers of q: positivity fails at the single prime q and
nothing else changes. That is a named failing step, and it is the known one (map row NR: "lacks Lambda >= 0 and
temperedness at q"). The interpolation basis adds a coordinate system and no inequality. Weil positivity
W(g * g~) >= 0 written in these coordinates is the same quadratic form.

No second pivot.

## 8. Numerics (local, `scripts/memcap.sh 8 .venv-arb/bin/python`, float64 and mpmath 30 digits; MEASURED)

`checks.py` -> `checks.json`, `checks.log`.

- K1, DH inverse b = a^(-1) to N = 1e6: F(3) x F^-1(3) = 1 - 3e-16; a(6) - a(2)a(3) = 1.0807; max abs(b(n))
  = 1421.2 at n = 825552; dyadic maxima grow. sum abs(b(n)) n^-sigma to 1e3, 1e4, 1e5, 1e6: sigma = 1:
  5.41, 8.08, 11.62, 16.31; sigma = 1.1204: 3.74, 4.75, 5.76, 6.78 (about +1.02 per decade); sigma = 1.3: 2.474,
  2.712, 2.871, 2.977; sigma = 2: 1.28987, 1.29087, 1.29100, 1.29101. Reference: max abs(mu) = 1.
- K2, T-NR at (q, c) = (2, 2.05), (2, -2.05), (3, 2.2), (5, 2.2), (5, -2.2): a = 0.3219, 0.3219, 0.4038, 0.2756,
  0.2756 (all < 1/2); growth rate of g_j equals q^a; series x P - 1, symmetry of G(s)/G(w) in w and in s: below
  2e-15 at three (w, s) pairs with Re w > 1; P on the critical line stays in [c - 2, c + 2]; on the good
  horizontal lines min abs(P) over -1 <= u <= 2 is abs(c) + 2.
- K3, E_a at a = 0.1, 0.3: b(2) = -(2^a + 2^-a); sum abs(b(n)) n^-sigma to 1e3, 2e4, 2e5 at sigma = 1 + a - 0.05:
  16.0, 26.2, 35.5 and 10.8, 16.2, 21.0 (growing); at sigma = 1 + a + 0.05: 11.2, 15.6, 18.7 and 7.9, 10.2, 11.8.
- K4, theta^w: theta(t)^w = t^(-w/2) theta(1/t)^w with the binomial coefficients c_w(m), m <= 400, at
  w = 1, 1.3, 4, 0.8 and t = 0.7, 1.6: differences below 1.2e-30. Multiplicativity defect
  c(6)/c(1) - c(2)c(3)/c(1)^2: 0 at w = 1, 2, 4, 8; -0.2195 at w = 1.3; 4/3 at w = 3.

`ref_check.py` -> `ref_check.json`, `ref_check.log` (independent code, see REFEREE.md): DH functional equation
in the class of Theorem 5.2 to 1e-30; DH inverse by the divisor definition agrees with K1; Lemma T
biorthogonality transfer exact on a 12 x 12 block; quoted passages present in the source text.

Not run: the modular integrals alpha_n(s) and the functions U_n, V_rho themselves (stage B).

## 9. Device row (proposed; map section 3.2 or 3.9) and engine entry

| ID | Route / mechanism | First obstruction | Control that kills it | Status | Source |
|---|---|---|---|---|---|
| (new) | Fourier interpolation with nodes at the zeros and frequencies log n/(4 pi) (Bondarenko-Radchenko-Seip), with the Radchenko-Viazovska pair (sqrt n, sqrt n) as the case s = 0 | The kernel is (F*(s)/F*(w)) x A_k(w,s) with A_k a target-independent Dirichlet series of the theta group, unique by Bochner's converse theorem; the bases form one orbit under symmetric multipliers G(s)/G(w). The target enters by division. The Euler product is read twice: abs(mu) <= 1 (edge Re w = 1 and partial sums x^(1/2+eps), inequality (I-1)) and the horizontal lower bound of Ramachandra-Sankaranarayanan (function class). Off-line nodes change no sign or decay of the basis functions in z; they move the exponent of the partial sums in n from 1/4 to beta/2 < 1/2. Exponent 1/4 + eps for all s is equivalent to RH | T-NR passes every step (source section 5.3.3; Lemma T gives its basis from zeta's). WT passes as a translate. DH and theta^w pass in the smaller class of source section 5.3.2. E_a: gamma class not covered (open), fails (I-1) in size. Controls without FE stop at the definition of the kernel | PROVED-rel BRS (sections 3, 6 not re-derived); T-NR height selection ARGUED; E_a OPEN at S0 | `push/c13-fourier-interpolation-zero-nodes/RESULT.md` |

Engine proposal: `engine_device_proposal.json` (state closed; controls T-NR, WT, DH, theta^w).

## 10. Requirement flags

- R1 (multiplicativity essential): **false**. (I-1) reads abs(mu(d)) <= 1 at all primes jointly, but T-NR
  reaches the same conclusion without it and DH does not need it (edge 2). Evidence: section 6.2, K1, K2.
- R2 (height-uniform, every window): **false**. (1.2) is an identity valid for all z, which is a restatement and
  not a conclusion; (I-2) holds at one selected height per window. Evidence: section 3, H4.
- R3 (every control fails at a named structural step): **false**. T-NR and WT pass every step; DH and theta^w
  pass the construction. Evidence: section 6.2.
- R4 (reaches the critical line): **false**. The conclusion of (I-1) is the half-plane Re w > 1; the exponent
  needed inside the strip is the restatement of Proposition G. Evidence: section 5 item 2.

## 11. Three weakest steps

1. T-NR and H4. The claim "T-NR passes every step in the class H_1" needs a truncation height that is good for
   zeta in the sense of Lemma 4.3 and at distance >= T^-A from the zero heights of P. Lemma 4.3 as quoted gives
   one height per window, and its source was not opened. With the Jensen bound (5.11) the selection holds and
   the function class is that of 5.3.2. BRS 5.3.3 asserts the T-NR case in one sentence without proof. The
   kernel properties and the basis (Lemmas M, T) do not depend on this.
2. Sections 3 and 6 of BRS were not re-derived. Everything about A_k (functional equation, poles, the bound
   sum_{n<=y} alpha_n << sqrt y, the uniqueness Remark, real weights) is PROVED-rel. The identification of
   theta^w for non-integer w with the member s_0 = 0 of the family (5.10) rests on BRS (4.4) for l = 1, 2, 3 and
   on the statement that the definitions hold for real k; it was checked only at the level of the theta
   relation (K4). No basis function was computed.
3. E_a. Its status at S0 is open: no kernel was constructed and none was excluded. The redundancy remark
   (zeros of zeta(s + a) alone already determine f with the full frequency set) uses the non-even form of
   Theorem 1.1, which BRS state without proof. Proposition G (iii) (the exponent equals theta/2) is argued by
   Perron's formula and not written out; only the lower bound (ii) is used in the verdict.

## 12. Files

`RESULT.md`, `REFEREE.md`, `checks.py`, `checks.json`, `checks.log`, `ref_check.py`, `ref_check.json`,
`ref_check.log`, `lanes.jsonl`, `engine_device_proposal.json`, `sources/` (brs.pdf, rv.pdf and text extractions;
downloaded from arxiv.org, read as text only).
