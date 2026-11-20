# c12-univ-pointwise-control-wcone: control UNIV (joint universality) and the W-adapted cone cell

Date 2026-11-19. Round 12, kind: explore. Scope: this directory only. The compute server was not used.
Nothing committed or pushed. No statement about zeros of zeta is made.
Requirement flags: R1 = R2 = R3 = R4 = false.

Labels: PROVED (complete argument here) / PROVED-rel (complete given a cited theorem) / CLASSICAL / MEASURED
(mpmath 30 digits or 53-bit ball arithmetic, not interval-certified) / ARGUED / OPEN.

## Verdict

**Precise obstruction, two parts.**

(a) Control UNIV holds, relative to the joint universality theorem as stated in Matsumoto's survey
(arXiv:1407.4216, opened and read; Theorems 1, 2, 7, 10, 11, 20, 27, 30, 31). The primary texts (Voronin
1975/1977, Gonek's thesis 1979, Bagchi's thesis 1981, Kaczorowski-Kulas 2007, Nakamura-Pankowski) were not
opened. Statement: a closed condition on the values of finitely many Dirichlet L-functions (pairwise
non-equivalent characters) on a fixed compact window in 1/2 < Re s < 1, with constants independent of
height, that holds at all heights, holds for every tuple of non-vanishing analytic functions on the window.
For a continuous inequality in finitely many values and derivatives at finitely many points it holds for
every jet: it has no content. Applied to the 34 device rows: it decides one device in full (7,
recurrence-ergodicity), a value-side part of four (1, 4, 14, 25), restates two (12, 32) and is out of scope
for 27. UNIV is not effective: the sample at heights up to 8000 does not show the density (section 3).

(b) The cell left open by `c11-rs1-regular-rep-matrix-bridge` (a cone adapted to the functional-equation
matrix) is closed with a device row. For prime q the cone is K_F = {v >= 0, Fv >= 0} on even functions on
Z/q, F the finite cosine transform. (i) Its linear inequalities are the entrywise inequalities at x and at
1/x (Lemma C). (ii) At q = 5 its extreme rays are delta_0, 1 (each fixed by the dilations, exchanged by F)
and two F-fixed rays v_+, v_- (exchanged by the dilation by 2); the Dirichlet series of v_+- are
zeta(s)(1 + 5^(1/2 - s)) +- L(s, chi_5): non-negative periodic coefficients, non-negative kernel, zeta's
functional equation, no Euler product, zeros off the line (PROVED-rel Theorem 31; MEASURED:
0.779557204771 + 61.168516694058i and five more). (iii) The candidate inequality is false on the F-fixed
slice of the cone and, on the dilation-fixed vector, is the scalar statement with the cone inert. (iv) The
T-NR lift passes every input the candidate reads (kernel vector in K_F with the same F: MEASURED at q = 5);
the only input it lacks is "the coefficient matrix at p_0 is a cone automorphism", which no inequality of
the candidate consumes. The E_a lift fails one input: its theta-normalised kernel is negative
(E*(i, 0.7) = -2.33099381341482, two formulas).

## 0. Plan; what is new relative to the record

- Universality appears in the record as a remark in four lanes (`ideation-panel` line 191, `g-arithmetic-gain`
  PR 39 note, `c11-rs3` variant V3b, `c5-thin-propd` in another sense). It is not a control in
  `engine/curated/controls.json` and has no map row. New here: the statement as a filter with an exact scope,
  and its reading against the device table.
- Part (b): the cell named in weakest step 1 of the c11 lane ("a cone other than R_+^G, for example one
  adapted to W, is not covered").
- Q1 (controls): section 6. Q2 (height): UNIV is the statement that a height-uniform local inequality in the
  open strip carries no arithmetic. Q3 (multiplicativity): in part (b) the dilations enter as cone
  automorphisms; no inequality uses that property.

## 1. Source (opened)

K. Matsumoto, "A survey on the theory of universality for zeta and L-functions", arXiv:1407.4216 (PDF text
extracted locally and read). D(a, b) = {a < Re s < b}; H^c(K) = continuous on K, holomorphic in the interior;
H_0^c(K) = those without zeros on K. Statements used, as printed there:

- Theorem 1 (Voronin): K compact in D(1/2, 1) with connected complement, f in H_0^c(K), eps > 0: the set of
  tau in [0, T] with sup_K abs(zeta(s + i tau) - f(s)) < eps has positive lower density.
- Theorem 2 (Voronin): for 1/2 < sigma <= 1 the set {(zeta, zeta', ..., zeta^(m-1))(sigma + i tau)} is dense in C^m.
- Theorem 7 (Voronin, Gonek, Bagchi): for pairwise non-equivalent Dirichlet characters chi_1..chi_r, compacts
  K_j with connected complements and f_j in H_0^c(K_j), the set of tau with sup_{K_j} abs(L(s + i tau, chi_j) - f_j(s)) < eps
  for all j has positive lower density.
- Theorem 10 (Bagchi, Gonek): the same for zeta(s, alpha), alpha rational other than 1/2, 1, or transcendental,
  with f in H^c(K) (zeros allowed). Theorem 11: such a function has at least CT zeros in sigma_1 <= Re s <= sigma_2, 0 <= Im s <= T,
  for every 1/2 < sigma_1 < sigma_2 < 1 (Rouche).
- Theorem 20 (Bagchi): RH holds iff zeta approximates itself in the sense of Theorem 1 on D(1/2, 1).
- Theorem 27 (Bagchi, Gonek, Eminyan): for prime q -> infinity, a positive proportion of chi mod q has
  sup_K abs(L(s, chi) - f(s)) < eps (chi-aspect, no height translate).
- Theorem 30 (Gonek; Kaczorowski-Kulas): Theorem 7 with one K, jointly with max_{p <= z} ||tau log p/(2 pi) - theta_p|| < eps
  (the printed statement does not repeat "connected complement"; it is assumed here).
- Theorem 31 (Nakamura-Pankowski): if P_1..P_r (r >= 2) are Dirichlet series absolutely convergent in Re s > 1/2,
  not identically zero, at least two of them non-vanishing in D(1/2, 1), and L_1..L_r satisfy Theorem 30, then
  sum P_j L_j has the property of Theorem 10 in D(1/2, 1), hence at least CT zeros in every sub-strip.

Status of everything below that uses these: PROVED-rel the survey's statements.

## 2. Control UNIV (part a)

Setting: chi_1..chi_m pairwise non-equivalent (the trivial character allowed: zeta), K compact in D(1/2, 1)
with connected complement, L_tau = (L(. + i tau, chi_j))_j in C(K)^m.

**Lemma U1 (closed conditions; PROVED-rel Theorem 7).** Let C be a closed subset of C(K)^m (sup norm). If
L_tau lies in C for all tau outside a set E of upper density zero (for instance for all tau >= T_0), then
C contains H_0^c(K)^m.
Proof. For f in H_0^c(K)^m and eps > 0 the set A of tau with ||L_tau - f|| < eps has lower density d > 0, so
A \ E has lower density d and is not empty. Take tau_eps in it; L_{tau_eps} is in C and tends to f; C is closed.

**Corollary U2 (pointwise inequalities have no content; PROVED-rel).** Let s_1..s_n be points of D(1/2, 1)
(fixed offsets), k >= 0, and Q a continuous real function on C^(m n (k+1)). If
Q((L^(l)(s_i + i tau, chi_j))_{i,j,l}) >= 0 for all tau outside a set of upper density zero, then Q >= 0 on
all of C^(m n (k+1)).
Proof. K = union of disjoint closed discs of radius r around the s_i (connected complement). A jet with
non-zero leading entries at every (i, j) is the jet of f_j = exp(polynomial) on each disc, an element of
H_0^c(K)^m (the discs are disjoint, so the choices are independent). By Cauchy's estimate, sup-norm distance
eps on K gives jet distance at most k! eps/r^k at the centres. Lemma U1 applied to the closed condition
"Q of the jet at the centres >= 0" gives Q >= 0 at such jets; they are dense and Q is continuous.
For m = n = 1 this is Theorem 2. If Q is defined and continuous only where the values are non-zero
(log, L'/L, 1/L), the conclusion is Q >= 0 at every jet with non-zero values; in the variables of log L every
jet is allowed, so an inequality in (L'/L)^(l) is again without content.

**Corollary U3 (window conditions: three classes; PROVED-rel).** A closed condition C on the window K, asked
at all heights, is of exactly one kind:
- T: C contains every tuple of H^c(K)^m. No content.
- N: C contains H_0^c(K)^m and not all of H^c(K)^m. Then C holds at every height tau at which no L(., chi_j) has a
  zero in K + i tau (because L_tau is then in H_0^c(K)^m). It can fail only in a window that contains a zero. A
  proof of C at all heights is a proof of a statement about zeros in those windows; no part of it can be
  "an inequality stronger than non-vanishing". Examples: no zero in K; at most k zeros in the interior
  (Hurwitz; closed once the zero function is added); log abs f(c) minus the circle mean of log abs f >= 0 (Jensen: equality iff no zero in the disc).
- F: C excludes some f in H_0^c(K)^m. Then C fails for L_tau on a set of tau of positive lower density.
So: every inequality of this type that holds at all heights is implied by non-vanishing in the window alone,
with no arithmetic.

**Corollary U4 (with finitely many prime phases; PROVED-rel Theorem 30).** The same three classes for closed
conditions on (L_tau, (p^(-i tau))_{p <= z}) in C(K)^m x T^(pi(z)), with class N meaning "contains
H_0^c(K)^m x T^(pi(z))". Finite Euler stages and finitely modified Euler factors at the same height are covered.

**Corollary U5 (linear combinations; PROVED-rel Theorems 10, 11, 31).** sum_j P_j(s) L(s, chi_j) with at least
two non-vanishing Dirichlet-polynomial coefficients has at least CT zeros in every sub-strip of
1/2 < Re s < 1. This covers Davenport-Heilbronn-type functions, Hurwitz entries Z_c = q^-s zeta(s, c/q)
(c/q not 1/2, 1), and the functions D_+- of section 5.

### What UNIV does not cover (exact list)

1. Re s <= 1/2. On the critical line there is no theorem of this form. Left of it the functional equation
   moves the statement to 1 - conj s with a factor of size (q t/2 pi)^(1/2 - sigma), which depends on height.
2. Re s > 1: the value set on a line is bounded; the corresponding statement is Kronecker-Weyl on the prime
   torus, which is control U (every unimodular completely multiplicative twist; row Q21). At sigma = 1,
   Theorem 2 gives density of jets for zeta only.
3. Statements non-local in height: heights t and 2t together (3-4-1), t and 0, positive-definiteness in t,
   mean values, sums over zeros, anything with offsets that grow with t. (Fixed bounded offsets are covered.)
4. Families with m growing with T; the conductor aspect. (Theorem 27 is a chi-aspect statement for a positive
   proportion of characters at a fixed window; it is not used here.)
5. Inequalities that use s and 1 - conj s together, or the completed function: by the functional equation
   these are conditions on L(s, chi) with coefficients depending on height through the gamma factor, so the
   condition is not fixed. The lower density in Theorem 7 depends on the target and is not uniform.
6. Constants or regions that depend on height: convexity and growth bounds, regions 1 - sigma << (log t)^-A.
7. Conditions that are not closed in sup norm on a compact window (they are covered only through their closure).
8. Existence statements ("in every interval of length H(T) there is a height where ...") and any statement on a
   set of heights of density zero. UNIV refutes only "at all heights" (or outside density zero).
9. Companions that are not Dirichlet L-functions (survey Theorem 9: partial ranges for GL(2) pairs).
10. Accessible heights. The theorem is not effective in a usable way (section 3): a class-F inequality can hold
    at every computed height.

Use as a control. UNIV is not a function with zeros off the line. It is the family of all non-vanishing
analytic tuples on a window, each of which is a limit of height translates of the L-functions themselves.
A step of an argument that is of the type above and is claimed to use arithmetic is of class T (empty), N
(equal in content to a zero statement in the same window: circular unless proved by another route) or F
(false). It adds nothing to R3 for a mechanism whose separating step is out of scope.

## 3. Decisive first test, part (a): the 34 device rows

Full table: `DEVICE_READ_UNIV.md`. Counts: C 1 (device 7), Cp 4 (devices 1, 4, 14, 25), R 2 (devices 12, 32),
N 27 (FE 8, COEF 5, OBJ 6, COND 3, AVG 2, KER 1, HT 1, ID 1). All cells ARGUED from the V2 table, devices.json
and fifteen map rows; no device lane was reopened.

- Device 7 (row P39): the amplifier hypothesis is self-recurrence of zeta, which is RH by Theorem 20. Same
  finding as the row, from the classical theorem.
- Devices 1 and 14 (row P29 part): raw positive-definiteness of log zeta(sigma + iu) on a line in the strip is
  of class F (it needs a bound uniform in u). The lane had this from an Omega-theorem.
- Device 4 (node part): a Harnack constant independent of height needs a one-sided bound for log abs zeta in
  the strip: class F.
- Device 25: linear inequalities in Re L'/L(s, chi_j) at one height in the open strip with a fixed constant:
  class F. The row itself lives on Re s >= 1 and is not touched.
- The three devices with no passing control on file (26: the 7/8 mechanism; 34; 9) are out of scope. A
  zero-free half-plane is a class-N statement; UNIV is consistent with it.

Measured illustration (`univ_density.py`, `univ_density.log`, `univ_density.json`; 39951 samples of
(zeta, L(chi_2), L(chi_3), L(chi_5)) mod 5 at s = 0.75 + it, 10 <= t <= 8000, step 0.2, 53-bit balls; 384 s):

| T | sign patterns of (Re, Im) seen, of 256 | sign patterns of (Re Z_c), of 16 | least sup-distance to four targets in C^4 | abs(L(chi_5))/abs(zeta): min, max |
|---|---|---|---|---|
| 1000 | 46 | 8 | 1.18, 1.21, 1.56, 2.01 | 0.0427, 25.3 |
| 4000 | 54 | 8 | 1.18, 1.17, 1.55, 1.81 | 0.0306, 33.1 |
| 8000 | 58 | 8 | 1.15, 1.17, 1.52, 1.81 | 0.0306, 35.7 |

The sample does not show density: 58 of 256 sign patterns, and no target with entries of modulus about 1 is
approached within 0.9. The only thing read from it: the ratio abs(L(chi_5))/abs(zeta) already ranges over three
orders of magnitude, so a domination with a fixed constant fails at these heights. Consequence for the
campaign: a class-F verdict from UNIV cannot be cross-checked by computation at accessible heights, and a
device inequality that survives computation is not thereby safe from it.

## 4. Part (b): the W-adapted cone. Setup (PROVED unless marked)

q an odd prime. V = real even functions on Z/q (dimension (q+1)/2). F v(d) = q^(-1/2) sum_c v(c) cos(2 pi c d/q):
symmetric, F^2 = 1 on V. Dilations R(n) v(c) = v(n^-1 c), n in G = (Z/q)^*: permutation matrices fixing
delta_0, and F R(n) = R(n^-1) F. Kernel vector Theta(x)(c) = sum_{n = c mod q, n in Z} exp(-pi n^2 x/q).

1. Poisson: Theta(x) = x^(-1/2) F Theta(1/x), exactly, class 0 included (MEASURED defect 4e-31 at q = 5). This is
   the matrix W of the c11 lane with its "class-0 terms" absorbed.
2. Cone adapted to F: K_F = {v in V: v >= 0, F v >= 0} (non-negative and positive-definite). F K_F = K_F,
   R(n) K_F = K_F, Theta(x) in K_F for all x. The algebra generated by R(G) and F is a quotient of the group
   algebra of G x| Z/2 (inversion): blocks of size 1 for real characters and size 2 for pairs {chi, conj chi}.
   F-eigenvectors inside a 2-block are the Davenport-Heilbronn-type combinations.
3. For v in V put D_v(s) = sum_{n >= 1} v(n) n^-s. Then D_{delta_0} = q^-s zeta(s), D_1 = zeta(s), and
   F v = v gives (q/pi)^(s/2) Gamma(s/2) D_v(s) invariant under s -> 1 - s (up to the polar terms).

**Lemma C (linear level; PROVED).** K_F^* = R_+^V + F R_+^V. Every linear functional non-negative on K_F is
<a, .> + <b, F .> with a, b >= 0, and on the kernel it reads <a, Theta(x)> + x^(-1/2) <b, Theta(1/x)>. The linear
inequalities of the adapted cone are the entrywise inequalities at x and at 1/x: nothing beyond R_+.
Proof. R_+^V is self-dual, F is orthogonal on V, the cones are polyhedral.

**Lemma P' (copositive level; PROVED).** (i) Every pointed convex cone invariant under all R(n) contains a
non-zero vector fixed by all R(n) (average a non-zero element over G). (ii) A non-negative non-zero v with
R(n) v = chi(n) v for all n has chi = chi_0. So a dilation-invariant cone meets the eigenvectors of the dilations
only in the trivial-character slice, and a copositive form over such a cone contains the scalar zeta inequality
on that slice with the cone inert. This extends Lemma P of the c11 lane from R_+^G to every invariant cone.

**Lemma X (extreme rays at q = 5; COMPUTED by enumeration of facet pairs at 30 digits; the F-fixed and exchange identities PROVED by hand with cos 72 = (sqrt5 - 1)/4).** In coordinates (v(0), v(+-1), v(+-2)):
K_F has four extreme rays: delta_0 = (1, 0, 0); 1 = (1, 1, 1); v_+ = (1 + sqrt5, 2, 0); v_- = (1 + sqrt5, 0, 2).
F exchanges delta_0 and 1 (up to scale) and fixes v_+ and v_-; R(2) fixes delta_0 and 1 and exchanges v_+, v_-;
v_+ + v_- = 2 (1 + sqrt5 delta_0). The F-fixed part of K_F is the cone on v_+, v_-:
v_b = (1 + sqrt5 delta_0) + b (delta_{+-1} - delta_{+-2}), abs(b) <= 1, with
`D_b(s) = zeta(s)(1 + 5^(1/2 - s)) + b L(s, chi_5).`
(MEASURED: F v_b = v_b to 1e-30; completed D_b invariant under s -> 1 - s to 1e-30; series against closed form 2e-11.)

**Lemma Z (the F-fixed extreme rays are controls; PROVED-rel Theorem 31, and MEASURED).** For b != 0, D_b has at
least CT zeros in every sub-strip of 1/2 < Re s < 1 (P_1 = 1 + 5^(1/2 - s) has no zero in Re s > 1/2, P_2 = b).
Zeros found below height 120 with 1/2 < Re s < 1 (abs D < 3e-30):
b = 1: 0.779557204771 + 61.168516694058i, 0.641757318463 + 75.399476729498i, 0.808645316598 + 110.622674033680i;
b = -1: 0.848947441956 + 23.704150225033i, 0.824471766875 + 57.108111490387i, 0.909415257270 + 85.651691851739i.
D_+-1 has non-negative periodic coefficients (1 + sqrt5, 2, 0 by class), a non-negative kernel <v, Theta(x)>, the
gamma factor, conductor and functional equation of zeta(s)(1 + 5^(1/2 - s)), and lies on an extreme ray of the
adapted cone. It lacks the Euler product (it is not a dilation eigenvector).

## 5. The candidate and its test

**Candidate (CW).** Cone K_F. Inputs: [P] Theta(x) in R_+^V; [FE] Theta(x) = x^(-1/2) F Theta(1/x); [K] Theta(x) in K_F;
[END] every coefficient matrix maps K_F into K_F; [AUT] every coefficient matrix is an automorphism of K_F
(this is where PERM and W are read in one step: R(n) permutes the delta rays and F R(n) F = R(n^-1) permutes
the F delta rays). Inequality: for every F-fixed v in K_F the bridge energy of the completed D_v is
non-negative. It is read here through its consequence: D_v has no zero with Re s > 1/2 (for the trivial
slice this is the refereed equivalence of the square-root lane; for other v only the consequence is used,
and the consequence is what is tested).

Tests, in the order of the assignment.

1. UNIV. (a) Value side: for 1/2 < sigma < 1 the vectors (L(sigma + it, chi))_{chi mod q} are dense in C^(q-1)
   (Theorem 7 with K a point), so the matrices M_q(sigma + it) are dense in C[G] and the value vectors
   (Z_c(sigma + it))_c are dense in C^G. No proper closed cone of C^G or of its real or imaginary part contains
   the value vectors at all heights; the same for any closed condition on M_q(s) at one point. A value-side
   cone statement does not exist in the open strip. (b) The inequality of (CW) at the extreme rays v_+- is
   false (Lemma Z). So (CW) is false as a statement about the F-fixed slice of the cone. On the one F-fixed
   vector fixed by the dilations, 1 + sqrt q delta_0, it is the scalar statement for
   zeta(s)(1 + q^(1/2 - s)); there the cone is inert (Lemma P'), and the vector is the midpoint of the segment
   [v_-, v_+], not an extreme ray: the cone does not single it out; the dilation symmetry does.
2. T-NR lift, p_0 = 2, c = 3, q = 5: Theta_NR(x) = p_0^(-1/2) R(p_0)^-1 Theta(x/p_0^2) + c Theta(x) + p_0^(1/2) R(p_0) Theta(x p_0^2).
   [P] yes (least entry 0.444 on four x); [FE] yes with the same F (PROVED from F R = R^-1 F; MEASURED defect
   1.6e-30); [K] yes; [END] yes (non-negative combinations of dilations); [AUT] no, at multiples of p_0 only.
   Conclusion false: zeros of the trivial slice at Re s = 1/2 +- arccosh(c/2)/log p_0 (1.888 for c = 3; inside
   the strip for 2 < c < 2.5). No inequality in (CW) or in Lemma C consumes [AUT]: an inequality over a cone is
   preserved by every endomorphism of the cone. **T-NR passes every step.**
3. E_a lift. Coefficient matrices sigma_2a(n) n^-a R(n) are positive multiples of dilations: [END] and [AUT]
   yes (a cone does not see the scalar). [FE] with its own matrix (eps(chi)^2 in the character basis; not
   computed in the delta basis). [P] at the coefficient level yes. [K] **no**: the theta-normalised kernel of
   the trivial slice is E*(iy, 1/2 + a) = xi(1 + 2a) y^(1/2 + a) + xi(2a) y^(1/2 - a) + 4 sqrt(y) sum n^-a sigma_2a(n) K_a(2 pi n y),
   and E*(i, 0.7) = -2.33099381341482 (Fourier expansion and 2 pi^-s Gamma(s) zeta(s) L(s, chi_-4) agree to 15
   digits); negative for 1/4 <= y <= 4, positive at y = 8. The non-constant part is positive (0.0037 at y = 1);
   the sign comes from the constant term xi(2a) < 0, that is from the two poles at 1 +- a. This is the SIZE
   input of the map's input-level note, read through the polar terms of the kernel. In the xi-normalisation
   (poles removed) the kernel of E_a is a convolution of two positive kernels and is positive, so the failure
   is at the polar terms only. E_a fails (CW) at input [K]; it passes [AUT].
4. DH-type: v_+- above. Pass [P], [FE], [K]; not lifts (no coefficient matrices in C[G]); conclusion false.
5. THIN, U, DEL lifts: no [FE] (as in the c11 table).

| control | [P] | [FE] with F | [K] | [END] | [AUT] | conclusion |
|---|---|---|---|---|---|---|
| T-NR lift | yes | yes | yes | yes | no at p_0 | false |
| E_a lift | coefficients yes; theta kernel no | own matrix | **no** (E*(i, 0.7) < 0) | yes | yes | false |
| v_+-, D_+-1 | yes | yes | yes (extreme rays) | not a lift | not a lift | false (measured zeros) |
| THIN, U, DEL lifts | yes | no | no | yes | THIN, U yes; DEL no | false |
| UNIV | value side: no proper closed cone holds at all heights; kernel side: out of scope | | | | | (CW) false on the F-fixed slice |

Reading. The inputs {[K] with polar terms, [AUT] at every prime} are missed by each lift at a named place
(E_a at [K], T-NR at [AUT]). This is the input-level statement {FE, SIZE, GEOM} of the map in cone language and
is not an inequality. What an inequality over the cone can consume is [P], [FE], [K], [END]; T-NR has all four.
Three ways to consume [AUT] were examined: (1) projective contraction (Birkhoff-Hopf; the theorem was not
opened): automorphisms are isometries of the Hilbert metric, strict endomorphisms contract; for
T_x = sum_{(n,q)=1} exp(-pi n^2 x/q) R(n) on K_F the top eigenvalue has two independent eigenvectors in the cone
(delta_0 and 1), so the projective diameter is infinite and the bound is the trivial abs(theta_chi(x)) <= theta_chi0(x)
(PROVED); in any case its conclusion bounds the non-trivial characters by the trivial one and says nothing
on the trivial slice. (2) Extremality: the F-fixed extreme rays are v_+-, not the Euler vector (Lemma X).
(3) Symmetry: H(v_+) + H(v_-) = 2 H(v_0) + 2 H(w) for a quadratic form H, v_+- = v_0 +- w; this is the c11
identity C_zeta = average - C_chi5 and has no sign (form (E) of that lane failed at q = 5).

Since UNIV refutes the cone-wide form and the T-NR lift passes every step of the restricted form, the cell
is closed (section 7 row).

## 6. Controls: where each fails or passes

| control | part (a): UNIV lemma | part (b): candidate (CW) |
|---|---|---|
| DH | Corollary U5: DH itself has at least CT zeros in every sub-strip (two jointly universal L-functions) | odd sector: not in K_F; its even analogue v_+- passes [P], [FE], [K] |
| backward heat | no ordinary Dirichlet series: Theorem 7 not available; not tested | not formulable (no coefficient matrices) |
| sign twists, THIN, U, DEL | U at Re s > 1 is the Kronecker form of UNIV; in the strip no universality statement for these twists was looked up; not tested | fail [FE] |
| zeta(s+a) zeta(s-a) | translates of zeta at two abscissae: joint statement not in the survey; not used | fails [K] (measured), passes [AUT] |
| T-NR | finite modification: covered by Corollary U4 | passes every step |
| Beurling | Theorem 20 has a Beurling form (R. Steuding, cited in the survey, not opened) | not formulable (no Z/q) |
| phase-rotated transfer operator, theta^w | not Dirichlet L-functions: out of scope | not formulable |

No structural failure for every control is obtained in either part: R3 false.

## 7. Verdict, flags, proposed rows

- Verdict: precise obstruction. Part (a) is a control (record item). Part (b) closes the cell.
- R1 false: no inequality uses multiplicativity; [AUT] is an input that nothing consumes.
- R2 false: no inequality survives; UNIV itself says that a height-uniform local inequality in the open strip
  has no arithmetic content.
- R3 false: T-NR passes every step of (CW); UNIV refutes its cone-wide form.
- R4 false: nothing crosses; no one-sided bound right of the line was proved.
- Pivot: not used. The adjacent idea (consume [AUT] through projective contraction) is recorded in section 5
  as void, without a second lane.

Proposed control entry: `controls_UNIV_proposed.json` (this directory; `engine/curated/controls.json` not edited).

Proposed map rows (for the record lane; the map is not edited here):

| Device | Finding | Status | Controls | Lane |
|---|---|---|---|---|
| Height-uniform pointwise or windowed inequality in values of finitely many Dirichlet L-functions in 1/2 < Re s < 1 (filter UNIV) | A closed condition on a fixed compact window holding at all heights holds for every non-vanishing analytic tuple; a continuous inequality in finitely many values and derivatives at fixed offsets holds for every jet. Three classes T, N, F. Not covered: Re s <= 1/2, Re s > 1 (there: control U), non-local in height, growing families, s with 1 - conj s, height-dependent constants, accessible heights. Against the 34 devices: 1 closed (7), 4 in part (1, 4, 14, 25), 2 restated (12, 32), 27 out of scope. | PROVED-rel joint universality (survey statement opened; primary texts not opened); device cells ARGUED | the family of non-vanishing tuples, realised by height translates of the L-functions | `c12-univ-pointwise-control-wcone` |
| Cone adapted to the functional-equation matrix: K_F = {v >= 0, Fv >= 0} on even functions on Z/q, with the dilations as cone automorphisms (cell left open by the regular-representation row) | Linear inequalities of K_F are the entrywise ones at x and 1/x. Every dilation-invariant pointed cone meets the dilation eigenvectors only in the trivial slice. At q = 5 the F-fixed extreme rays give zeta(s)(1 + 5^(1/2-s)) +- L(s, chi_5): positive kernel, zeta's functional equation, zeros off the line (0.7796 + 61.1685i and five more below 120). T-NR lift: kernel in K_F with the same F, coefficient matrices cone endomorphisms. E_a lift: theta-normalised kernel negative (E*(i, 0.7) = -2.331). Automorphism at every prime is an input no cone inequality consumes; projective contraction is void (two Perron vectors). No value-side cone in the open strip (UNIV). | PROVED (Lemmas C, P'); COMPUTED (Lemma X); PROVED-rel (Lemma Z); kernels and zeros MEASURED | T-NR lift passes every step; DH-type extreme rays pass P, FE, K; E_a fails at the polar terms of the kernel; THIN, U, DEL fail at FE | `c12-univ-pointwise-control-wcone` |

Device row for `engine/curated/devices.json` (proposal): id `w-adapted-cone`, state closed, name "Cone adapted
to the functional-equation matrix (non-negative and positive-definite functions on Z/q) with dilations as
automorphisms", evidence: this lane, section 5 table.

## 8. Three weakest steps

1. UNIV rests on theorems read in a survey, not in the primary texts; Theorem 30 is used with "connected
   complement" assumed; Lemma Z and Corollary U5 rest on Theorem 31 (Nakamura-Pankowski), also read only in the
   survey. The device codes are ARGUED from one-line readings; the Cp cell of device 4 rests on node
   descriptions that were not opened, and the code C of device 7 is a restatement of the row's own finding.
2. UNIV cannot be checked numerically at accessible heights (58 of 256 sign patterns up to 8000). A class-F
   verdict is a theorem about a set of heights of positive lower density that is not located. For statements
   with any height dependence (items 5, 6 of the list) UNIV gives nothing, and most device steps are of that kind.
3. Part (b) classifies linear and copositive statements over dilation-invariant cones and tests one candidate.
   Not covered: non-polyhedral F-invariant cones not containing K_F's extreme rays, non-convex conditions, a
   statement using several cones. Lemma X is for q = 5 only (for larger q the F-fixed extreme rays were not
   listed). The T-NR check is at q = 5, p_0 = 2, c = 3, four values of x; the E_a kernel was computed at level 1
   (trivial slice) only, and its functional-equation matrix was not computed. The Birkhoff-Hopf statement is
   quoted from memory. The lower density constant in every use of universality is not known.

## Files

- `tmp/research-2026-11-16/push/c12-univ-pointwise-control-wcone/RESULT.md`
- `tmp/research-2026-11-16/push/c12-univ-pointwise-control-wcone/REFEREE.md`
- `tmp/research-2026-11-16/push/c12-univ-pointwise-control-wcone/DEVICE_READ_UNIV.md`
- `tmp/research-2026-11-16/push/c12-univ-pointwise-control-wcone/controls_UNIV_proposed.json`
- `tmp/research-2026-11-16/push/c12-univ-pointwise-control-wcone/lanes.jsonl`
- `tmp/research-2026-11-16/push/c12-univ-pointwise-control-wcone/wcone_checks.py`, `wcone_checks.json`, `wcone_checks.log` (run: `scripts/memcap.sh 8 .venv-arb/bin/python -u <path>`, 7.7 min)
- `tmp/research-2026-11-16/push/c12-univ-pointwise-control-wcone/univ_density.py`, `univ_density.json`, `univ_density.log` (same wrapper, 6.4 min)
