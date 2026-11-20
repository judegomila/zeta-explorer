# c11-rs1-regular-rep-matrix-bridge: the regular-representation matrix Dirichlet series joined to the bridge square

Date 2026-11-19. Round 11, kind: explore (device design, read set RS-1). Scope: this directory only.
The compute server was not used. Nothing committed or pushed. No statement about zeros of zeta is made.
Requirement flags: R1 = R2 = R3 = R4 = false.

Labels: PROVED (complete argument here, elementary) / CLASSICAL / MEASURED (mpmath, 70 digits, not
interval-certified) / ARGUED / OPEN.

## Verdict

**Precise obstruction. The device is closed at stage A.** Three reasons, each a short lemma:

1. (Lemma S, PROVED) Every object built from M_q by the bridge recipe (completion, D, N, S_q = N/D, Hankel
   blocks, H_c) lies in C[G] (x) operators, G = (Z/q)^*, and C[G] is commutative: it is the direct sum over
   chi of the scalar bridge objects. The only data that do not decompose are the cone R_+^G and the delta
   basis. By finite Bochner duality a cone statement is one of two kinds: copositivity (form K) or positive
   definiteness in the character variable (form E).
2. (Lemma P, PROVED) The Perron vector 1 = sum_c delta_c lies in the cone and is the chi_0 eigenvector. Every
   form-K or form-E inequality for the bridge energy contains the scalar inequality H_c^zeta >= 0, which is RH
   (refereed square-root lane), as the slice v = 1. On that slice the cone constraint is empty. Form E is in
   addition false at q = 5 (MEASURED, two normalisations).
3. (Control table, PROVED at input level) The matrix lifts of E_a and T-NR keep every input the device reads:
   entrywise non-negative coefficients, matrix Euler product, Gauss-sum functional equation, periodic twists.
   Their Perron eigenvalue has zeros off the line. The class-reassignment lift of THIN and the lift of DEL
   keep entrywise positivity, permutation coefficients and complete matrix multiplicativity, and lose only
   the functional equation and periodicity. No displayed inequality has a step that uses the one input that
   separates the two groups (coefficient matrices are permutation matrices at every n, together with the
   functional equation).

First lemma (assignment): entrywise positivity of M_q **is the same input** as the non-negative coefficients
of the cyclotomic Dedekind zeta: both are the statement delta_c >= 0 on G read through character
orthogonality; the Dedekind zeta is the ray c = 1 (the trace), M_q is the full cone. It is linear at log
level, so it lies in the cone of row P25, and the product level is row P50. Positivity with the Euler product
alone is passed by DEL (and, in matrix form, by THIN, which it was not in scalar form). With the functional
equation added, DEL fails at that input, and E_a and T-NR take its place.

DH fails at a named matrix step, but the step is an identity, not an inequality: the DH weight vv^T does not
commute with the regular representation, so cross terms between chi and chi-bar survive (measured: they
carry the negative square). This does not raise R3: E_a and T-NR pass.

## 0. Plan; answers to the three questions before work

- New relative to the record: the matrix (regular-representation) form of the bridge square; whether the
  cone R_+^G gives a non-basis-independent inequality. Not on file in `engine/curated/devices.json`; no
  earlier lane on the regular representation in `push/` (one mention in `ap-squares-rallis`, other topic).
- Q1 (controls): section 4. Q2 (height): no inequality survives, so nothing to make uniform. Q3
  (multiplicativity): R(mn) = R(m)R(n) enters as "M_q lies in a commutative algebra and has a matrix Euler
  product"; in every displayed candidate this is used as an identity (diagonalisation), not inside an
  inequality.
- R4: no crossing. The cone property of M_q holds for coefficients and for kernels; in values it is lost at
  the pole s = 1 (section 1, item 4).

## 1. Setup (PROVED unless marked)

G = (Z/q)^*, phi = |G|, R(n) the permutation matrix of multiplication by n on C^G, (n, q) = 1.

1. M_q(s) = sum_{(n,q)=1} R(n) n^-s has entries (M_q)_{a,b} = Z_{a b^-1}(s), Z_c(s) = sum_{n = c mod q} n^-s
   = q^-s zeta(s, c/q). M_q = sum_chi L(s, chi) e_chi with e_chi the character idempotents; M_q =
   prod_p (1 - R(p) p^-s)^-1; log M_q has entries sum_{p^k = c} p^-ks / k >= 0.
2. Bochner form: Z_c(s) = (1/phi) sum_chi conj(chi(c)) L(s, chi) (checked at s = 1.7 + 3i, defect < 3e-31).
   Entrywise non-negativity of a convolution operator sum_chi T_chi e_chi is equivalent to: chi -> T_chi is a
   positive-definite function on the dual group.
3. Completion and functional equation. Sectors P_+- = (1 +- R(-1))/2. On the even sector (functions on
   G/{+-1}) the completed kernel is the theta vector Theta_c(x) = sum_{n = +-c mod q, n in Z} exp(-pi n^2 x/q)
   >= 0, and Theta(1/x) = sqrt(x) W Theta(x) + (class-0 terms), W_{c,d} = (2/sqrt q) cos(2 pi c d/q). In the
   character basis: Lambda(1 - s, chi-bar) = eps(chi)^-1 Lambda(s, chi), eps(chi) = tau(chi)/(i^a sqrt q);
   with C the inversion c -> c^-1 and E = sum eps(chi) e_chi (the finite Fourier kernel e(ab/q)/sqrt q on
   units after composing with C), C M^(1 - s) C = E^-1 M^(s) on primitive characters. **W has negative
   entries** (cos(2 pi cd/q) < 0 for some c, d): the functional equation does not preserve the cone. On the
   odd sector the kernel sum n exp(-pi n^2 x/q) over n = c is signed and P_- is not cone-preserving: the odd
   sector contains no non-zero cone vector.
4. Values left of 1. At q = 5 (MEASURED): Z_c(2) = (1.0507, 0.2910, 0.1454, 0.0920); Z_c(1.05) all positive;
   Z_c(0.95) = (-3.27, -3.80, -4.01, -4.13) all negative; Z_c(1/2) = (0.238, -0.151, -0.368, -0.526) mixed.
   The simple pole of the Perron eigenvalue flips the cone at s = 1; left of 1 the entries have no fixed sign.
   Entrywise positivity persists only on the coefficient side and the kernel side.
5. DH as a functional. f_DH(s) = sum_c w_c Z_c(s) with w = (1, kappa, -kappa, -1), kappa = 0.2840790438, that
   is f_DH = delta_1^T M_5 w (checked, defect 2e-71). w is odd: it is not in the cone, and it is not an
   eigenvector. Non-vanishing: f_DH(2) = 1.0000683378; f_DH(1/2 + 85i) = -0.6604 - 1.8809i; zero re-found at
   0.808517182457 + 85.6993484854i (abs f = 1e-72).

## 2. Stage A (i): the matrix bridge symbol and the candidate inequalities

F_q(z) = sum_chi F_chi(z) e_chi, F_chi(z) = eps(chi)^-1/2 Lambda(1/2 + z, chi) (xi for chi_0; real on the
imaginary axis; the square root of the root number is a choice and is not an element of the integral group
ring). D_q = F_q + alpha F_q', N_q = F_q - alpha F_q', S_q = D_q^-1 N_q = sum_chi S_chi e_chi, unitary on the
axis. On L^2(R) (x) C^G: Gamma_-(S_q) = Q S_q P = sum_chi Gamma_-^chi e_chi, H_c^(q) = sum_chi H_c^chi e_chi.

**Lemma S (PROVED).** Gamma_-(S_q) = 0 iff Gamma_-^chi = 0 for every chi iff GRH for every character mod q
(square-root lane, consequence 2, per character). Any statement invariant under unitary change of basis of
C^G is a statement about the multiset {S_chi}. A bilinear vanishing statement on the cone is basis-independent
because the cone spans C^G.

Candidates that are not basis-independent (the cone enters through a sign):

- **(K) copositivity.** For every v in R_+^G and f in L^2(R):
  `<v (x) f, H_c^(q) (v (x) f)> = (1/phi) sum_chi |v^(chi)|^2 <f, H_c^chi f> >= 0.`      (K)
  The admissible weights w_chi = |v^(chi)|^2 are the Fourier transforms of autocorrelations of non-negative v;
  they satisfy w_chi <= w_chi0.
- **(E) entrywise positivity.** For every c in G: h(c) = (1/phi) sum_chi conj(chi(c)) H_c^chi >= 0 as a form
  on L^2(R); equivalently chi -> H_c^chi is positive definite on the dual group.
- **(Q) uniform in q.** max_c ||Gamma_-(s_q(c))|| = o(1/phi(q)) along a sequence of q, s_q(c) the entries of S_q.
- **(H) cone functionals.** For u, v in the cone the scalar function u^T M_q(s) v has no zero in a region.

**Lemma P (PROVED).** (K) at v = 1 is H_c^zeta >= 0 on all of L^2(R), which is RH. (E) summed over c gives
the same. So (K) and (E) each imply RH and each is implied by nothing weaker; (K) is implied by GRH mod q;
(E) is not implied by GRH (it also needs the Loewner order |<f, H^chi f>| <= <f, H^zeta f>).
On the slice v = 1 the vector 1 (x) f is unconstrained in f: the cone gives no restriction and no extra
structure, and the form is the scalar bridge form of the closed square-root lane.

**(E) is false at q = 5 (MEASURED).** Even sector, G/{+-1} = {1, 2}: (E) at c = 2 reads C^zeta - C^chi5 >= 0
for the spectral kernels C(t, s) = (alpha/pi)(f(t)f'(s) - f'(t)f(s))/(t - s). Ten nodes in [12, 28]: inertia
(6, 4) with F_chi0 = xi; (0, 10) with xi divided by s(s-1)/2. The statement also depends on the relative
scalar normalisation of the eigen-directions, which the cone does not fix once the pole factor is inserted.

**Lemma Q (PROVED).** sum_c s_q(c) = S_chi0 and sum_c ||Gamma_-(s_q(c)) f||^2 = (1/phi) sum_chi
||Gamma_-^chi f||^2. Hence (1/phi) ||Gamma_-^zeta|| <= max_c ||Gamma_-(s_q(c))|| and ||Gamma_-^zeta|| <=
phi max_c ||Gamma_-(s_q(c))||. The threshold o(1/phi(q)) in (Q) is exactly the trivial lower bound: (Q) is
equivalent to Gamma_-^zeta = 0 together with smallness of the other blocks. A weaker uniform entry bound
is an average over the family and says nothing about a fixed character (weight 1/phi(q); MV-CAP).

**(H) is false (MEASURED control inside the device).** The entry Z_1(s) = 5^-s zeta(s, 1/5) is the cone
functional delta_1^T M_5 delta_1. It has non-negative periodic coefficients and is a component of the
vector functional equation. Zeros off the line: 0.4503035238 + 46.6381867593i, 0.4214549267 + 58.4846856595i,
0.4078167692 + 53.5548107208i (abs value < 6e-30; 12 found below height 60). Zeros with Re s > 1 exist
for rational parameter other than 1/2, 1 (Davenport-Heilbronn 1936, CLASSICAL, not re-found here). Zero-free
statements belong to eigenvalues only; the cone does not select eigenvectors other than the Perron vector.

## 3. Stage A (ii): where multiplicativity, the functional equation and periodicity enter

| ingredient | matrix form | where it enters |
|---|---|---|
| multiplicativity | R(mn) = R(m)R(n); M_q in the commutative algebra C[G]; matrix Euler product | forming D_q^-1 N_q: inversion inside C[G]. Used as diagonalisation (identity) |
| periodicity | R(n) depends on n mod q; entries are progressions | the same step: it is what makes the coefficient matrices a representation of a finite group |
| functional equation | Poisson summation on cosets: Theta(1/x) = sqrt(x) W Theta(x); in the character basis E = sum eps(chi) e_chi | unitarity of S_q on the axis, per character; needs eps(chi)^1/2 |
| entrywise positivity | R(n) >= 0, kernels Theta_c >= 0 | coefficient and kernel side only; lost in values at s = 1; not preserved by W, P_-, h_+- = (1 +- alpha u/2) kappa_q |

The three structural inputs meet in the single step "S_q = D_q^-1 N_q is a unitary element of C[G] (x) L^infty".
That step is an identity. The cone, which is the only non-decomposing datum, is not preserved by any of the
maps of the bridge square: W (negative cosines), P_- (odd sector), the factor (1 - alpha u/2) (sign change
at u = 2/alpha), the pole factor s(s-1)/2. No inequality in which the cone and the functional equation act
in the same step was found; (K) and (E) are the two forms the cone can take (Lemma S) and both reduce to or
exceed RH on the Perron slice (Lemma P).

## 4. Stage A (iii): control table

Matrix lift of a scalar control with coefficients a(n): M_q^F(s) = sum a(n) R(n) n^-s, eigenvalues F(s, chi).
Inputs read by the device: [P] entrywise non-negative coefficients; [E] matrix Euler product; [FE] Gauss-sum
functional equation; [PER] periodic twists; [PERM] coefficient matrices are permutation matrices at every n
(the matrix form of unimodular degree-1 local factors). The candidate inequalities (K), (E), (Q) are the
conclusions; none has a proof step, so "first failing step" is the first input the control lacks.

| control | lift | [P] | [E] | [FE] | [PER] | [PERM] | first failing step |
|---|---|---|---|---|---|---|---|
| DEL | drop primes of a thin set S inside {p = 1 mod q} | yes | yes | no | no | no (0 at deleted n) | FE |
| THIN | class reassignment R(p) -> R(-p) on S (matrix form of the sign flip) | **yes** | yes | no | no | **yes** | FE |
| U | R(n) -> R(sigma(n) n), sigma completely multiplicative into G | yes | yes | no | no | yes | FE |
| DH | not a lift: weight vv^T, v = (1, kappa, -kappa, -1), in place of a weight in C[G] | n/a | no | yes | yes | n/a | commutation with R(n): cross terms chi, chi-bar (identity step) |
| E_a | M_q(s + a) M_q(s - a), coefficients sigma_2a(n) n^-a R(n) | yes | yes | yes | yes | no | **none of P, E, FE, PER**; only PERM |
| T-NR | M_q(s) (R(p0)^-1 p0^(s-1/2) + c + R(p0) p0^(1/2-s)), c > 2 | yes | yes | yes | yes | no at p0 | **none of P, E, FE, PER**; only PERM at one prime |
| EIS-w | not formulable on this device (no modular surface) | | | | | | not a handle |
| window translate | R(n) n^(-i alpha) | no (complex entries) | yes | window only | yes | unimodular monomial | P |
| interpolation twin | zeta + c L(chi_-4) L(chi_5): no Euler product; lift has entries of both signs | no | no | no | no | no | P and E |
| backward heat | kernel exp(tau u^2/16) kappa_q(u), tau < 0 | kernel yes | no fixed-gamma series | yes | no | no | E |
| sign twist | eps(n) R(n), eps = +-1 | no | yes | no | no | signed | P (but THIN row passes P) |

Checks (MEASURED, `ref_checks.py`): E_a lift, a = 0.2: coefficients sigma_0.4(n) n^-0.2 >= 1 for n <= 30;
Perron eigenvalue vanishes at 1/2 + a + i gamma_1 (abs 2e-31). T-NR lift, p0 = 2, c = 3: eigenvalue factors
vanish at 1.888484 + i(pi + arg chi(2))/log 2 (abs < 2e-30); for c in (2, 2.5) the same formula gives
Re s = 1/2 + arccosh(c/2)/log 2 inside the strip (c = 2.1: 0.954).

Reading. Inputs {P, E, PERM} are passed by THIN and U; inputs {P, E, FE, PER} are passed by E_a and T-NR. A
device on M_q needs an inequality that uses PERM (every coefficient matrix is a permutation matrix) with FE
in one step. PERM is the statement SIZE/GEOM of the map's input-level note, now with positivity attached; the
matrix language adds no new way to use it, because on each eigen-direction a permutation matrix is the
unimodular number chi(n). (K), (E), (Q) do not use PERM.

Passing controls exist, so by the allocation rule the lane stops at stage A.

## 5. First lemma (assignment)

**Lemma 1 (PROVED).** (a) log det M_q(s) = phi sum_{p^k = 1 mod q} p^-ks / k: the non-negative coefficients
of the Dedekind zeta of Q(mu_q) (up to Euler factors at q) are the non-negativity of tr R(n) = phi 1_{n = 1},
that is of delta_1 on G. (b) Entrywise non-negativity of M_q follows from that of log M_q (commuting
exponential), which is delta_c >= 0 for every c. (c) Every non-negative function on G is a non-negative
combination of the delta_c, and delta_c = (1/phi) sum_chi conj(chi(c)) chi: the entry is a linear form in
log L(s, chi) with a non-negative function on the phase group, the class of row P25 with Dirichlet
companions. Its zeta part is the constant 1/phi (a_0 only, a_1 = 0): weaker than 3-4-1 for the purpose of
row P25. (d) At product level the entries are in the class of row P50.
So the input is the same (character orthogonality, 1837); M_q carries phi rays of the cone instead of one.
**Closure by DEL**: positivity and the Euler product hold for the DEL lift, so every use of entrywise
positivity that does not also use FE and PER is passed by DEL. New in matrix form: THIN also passes, since a
sign flip becomes a class reassignment and keeps the matrix entries non-negative.

## 6. Decisive first test at q = 5 (MEASURED; `q5_test.py`, `q5_test.json`, `q5_test.log`)

Run through `scripts/memcap.sh 8`, mpmath 70 digits, eigenvalue sign threshold 1e-45 after diagonal scaling.
Kernel C[f](t, s) = (1/pi)(f(t)f'(s) - f'(t)f(s))/(t - s) on 10 nodes; f_A, f_B the real-normalised odd
complex pair (chi(2) = +-i; phase theta = 0.2767871794; realness defect 6e-71); completed DH =
0.519783826016 (f_A + f_B) (constant checked at two heights).

| window | zeta | chi_5 | chi_A | chi_B | weight e_A + e_B (in C[G]): C_A + C_B | weight vv^T (DH): C_A + C_B + X | cross term X |
|---|---|---|---|---|---|---|---|
| 85.699 +- 2 (DH off-line zero) | (10,0) | (10,0) | (10,0) | (10,0) | (10,0) | **(9,1)** | (9,1) |
| 85.699 +- 1, 6 nodes | (6,0) | (6,0) | (6,0) | (6,0) | (6,0) | **(5,1)** | (5,1) |
| 100 +- 2 | (10,0) | (10,0) | (10,0) | (10,0) | (10,0) | (10,0) | (8,2) |
| 20 +- 8 | (10,0) | (10,0) | (10,0) | (10,0) | (10,0) | (10,0) | (9,1) |

Normalised negative eigenvalue of the DH form: -5.14 (10 nodes), -3.83 (6 nodes); of X alone: -11.1, -11.5.
The DH form differs from the commuting-weight form only by X = the symmetrised cross Wronskian of f_A, f_B.
Named matrix step where DH leaves the device: "the weight commutes with R(n), so the form is a sum over
characters". It is an identity (orthogonality of the e_chi), not an inequality, and X is indefinite in
every window, including windows where the DH form is positive.

Cone forms on the even sector, same nodes:

| window | (K) at v = delta_1: C_zeta + C_5 | (E) at c = 2: C_zeta - C_5 | same with xi/(s(s-1)/2) |
|---|---|---|---|
| 20 +- 8 | (10,0) | **(6,4)** | (0,10) |
| 85.699 +- 2 | (10,0) | (9,1), smallest eigenvalue -1.5e-15 relative (at rounding scale of the scaling, not decided) | (1,9) |
| 100 +- 2 | (10,0) | (10,0) | (1,9) |

Diagonal ratio C_5/C_zeta: 2.8e-5 to 5.8e-3 at height 20, about 1e-6 at 86, 1e-7 at 100: with the factor
s(s-1)/2 the zeta kernel dominates by size at height, and (E) is decided by normalisation there; at height
20 it fails outright.

## 7. Verdict and flags

- Verdict: precise obstruction; device closed at stage A. Row for the map (proposed, section 8).
- R1 false: multiplicativity enters as diagonalisation of a commutative algebra (identity).
- R2 false: no inequality; (Q) uniform in q is a restatement (Lemma Q).
- R3 false: E_a and T-NR lifts pass every input the candidates read; DH fails at an identity step.
- R4 false: entrywise positivity of values is lost at s = 1 (measured sign flip); the cone is not preserved
  by the functional-equation matrix W.
- One pivot (allowed): to the strongest adjacent idea, form (E) (positive definiteness in the character
  variable, the only cone statement not implied by GRH). Outcome: false at q = 5 as measured; no second pivot.

## 8. Proposed map row and device record (for the record lane; this lane does not edit the map)

| Device | Finding | Status | Controls | Lane |
|---|---|---|---|---|
| Regular-representation matrix series M_q with the bridge square; cone R_+^G | All bridge objects lie in commutative C[G]: direct sum over characters. Cone statements are copositivity (K) or positive definiteness in chi (E). Both contain the scalar zeta bridge inequality (RH) on the Perron slice v = 1, where the cone constraint is empty. (E) fails at q = 5 on 10 nodes in [12, 28]. Uniform-in-q entry bound at threshold o(1/phi) is a restatement. Cone functionals include Hurwitz entries with off-line zeros. Entrywise positivity is the P25/P50 input (character orthogonality); values lose the cone at s = 1; the functional-equation matrix W has negative entries. | PROVED (Lemmas S, P, Q, 1; elementary); kernels MEASURED | E_a and T-NR lifts pass P, E, FE, PER; THIN (class reassignment), U, DEL pass P, E, PERM; DH leaves at an identity step (weight not in C[G]) | `c11-rs1-regular-rep-matrix-bridge` |

Read-set note for RS-1: periodicity in the conductor aspect, when carried by a finite abelian group
representation, decomposes with the functional equation character by character; a candidate for CROSS-1
needs a non-commutative or non-decomposing carrier, or an inequality that reads PERM.

## 9. Three weakest steps

1. The closure is "no mechanism", not a no-go theorem: Lemma S classifies cone statements about one
   C[G]-valued operator (forms K and E). A statement mixing several bridge objects with different cones, or
   a cone other than R_+^G (for example one adapted to W), is not covered.
2. "(K) is strictly weaker than GRH mod q" and "(K) at v = delta_1 does not force each H^chi >= 0" are ARGUED
   only (Leech-type factorisation with a non-diagonal contraction is not excluded); neither is used in the
   verdict, which needs only that (K) contains RH at v = 1.
3. Numerics are 70-digit floating point on 6 to 10 nodes with a fixed threshold; the (E) entry at height 86
   sits at the rounding scale and is reported as undecided. The Hurwitz zeros found have Re s < 1/2; zeros of
   the entry with Re s > 1 are quoted from the literature, not re-found. The THIN and DEL lifts need the
   thin set inside one residue class (a short-interval prime theorem in progressions; cited, not opened).

## Files

- `tmp/research-2026-11-16/push/c11-rs1-regular-rep-matrix-bridge/RESULT.md`
- `tmp/research-2026-11-16/push/c11-rs1-regular-rep-matrix-bridge/REFEREE.md`
- `tmp/research-2026-11-16/push/c11-rs1-regular-rep-matrix-bridge/q5_test.py`, `q5_test.json`, `q5_test.log`
- `tmp/research-2026-11-16/push/c11-rs1-regular-rep-matrix-bridge/ref_checks.py`, `ref_checks.log`
