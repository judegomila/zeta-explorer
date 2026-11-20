# c22-no-stage-objects-axis-support-weyl-independence-prefilter: RESULT

Date 2026-11-20. Round 22, kind: combine (paper filter; no construction). Scope: this directory only.
Server: not used (the decisive test is a paper test; one sanity script ran locally through
`scripts/memcap.sh 8`, python3.14, mpmath 30 digits, under 1 MB, about 1 minute: `checks.py`, `checks.log`,
`checks.json`). Nothing committed or pushed. No independent referee has read this file: `REFEREE.md` is the
author's adversarial pass and says so (referees = 0), so no flag is entered.

**No statement about zeros of zeta is made. Both candidate object classes fail the filter. Passing objects
for round 23: none.** Requirement flags, both objects: R1 = R2 = R3 = R4 = false (section 7).

Labels: PROVED (complete argument here; author only) / PROVED-rel (relative to a named row or theorem on
file) / CLASSICAL-rel (literature recalled from memory, not opened: every use is "relative to") / MEASURED /
ARGUED / OPEN.

Sources read: `BRIEF.md` to the end; `c21-twin-screen-ts/TWIN_SCREEN.md` sections 2, 3, 6;
`ideation-panel/RESULT.md` section 0.1 and angles 6, 7; `n1-beurling-rigidity/RESULT.md`;
`c21-br2-sparse-pole-lattice-natural-boundary-or-twin/RESULT.md` (Lemma P, CYC, Theorem W);
`c21-br0-br3-hamburger-finite-poles-regime3/RESULT.md` (Theorem H, H', NWM); `OBSTRUCTION_MAP.md` section 2
(controls and notes) and rows L2, P6, P24, P39, P54, P57, Q21; `c21-c4-r1-flag-test-lemma-e-hq-beurling`
(definition of V6 and THIN x V6); ROUND_LOG round-21 lessons.

## 0. Verdict

1. **Object (A), axis support.** With zeta's exact archimedean term the hypothesis gives the functional
   equation, and Theorem H (Hamburger, on file) returns G = zeta. The proof reads "dual support inside
   log N", not "on the axes": multiplicativity is not used (Lemma A1). With the archimedean term unknown,
   three named classes cover what is on file, and none gives an object that passes (Lemma A2):
   - gamma factors of Selberg type: the object is the Selberg class. Degree below 2 is an identification
     relative to Kaczorowski-Perelli, in which the analytic step holds without an Euler product and axis
     support only selects inside a finite-dimensional space; degree 2 and above is an open identification
     whose members include functions for which the zero statement is the target. Kind I.
   - zeta's term plus densities of exponential type below 1/2: ZQ is a member with zeros off the line. The
     conclusion "support on the line" is false; kind F.
   - zeta's term plus tempered densities: the hypothesis for a member is equivalent to the conclusion for
     that member (for zeta: psi(x) - x = O(x^(1/2+eps))). Kind T.
   In finite dimension axis support forces a product of single-frequency factors, whose zero set is a
   finite union of vertical progressions on the lines where local parameters have critical size
   (Lemma A3). Under the mass bound abs(alpha_p) <= 1 every finite stage has empty zero measure in
   Re s > 0. Three things could replace the product at infinitely many primes, and each is a closed row:
   the zero hypersurface on the infinite torus (does not exist: P39), the entire function with spectral
   support (converse theorem: identification), positive-definiteness of the dual (Weil positivity: target).
2. **Object (B), Weyl independence.** The step of Theorem W is equidistribution of the multiples
   n log q_j against the lattices (log q_k) Z. It acts on multiples. Under the mass bound of zeta the
   multiples k >= 2 of all primes together carry an absolutely convergent series in Re s > 1/2 (Lemma B1),
   so every zero of G in the open right half of the strip is carried by the first points log p of the axes,
   where each axis contributes one point and there is no sequence for Weyl's theorem to act on. The step
   acts only when local parameters have size p^(1/2), which is the relative setting of BR-2. The other way
   independence can act is in the height variable (Kronecker, or a lattice of heights). Statements of that
   kind not relative to zeta exist (Putnam's theorem: no infinite vertical arithmetic progression of zeros;
   it is the joint use of axis support and independence, Lemma B2), but every conclusion reached through an
   average over heights is unchanged by a finite modification of the divisor: ZQ and SG pass (Lemma B3).
   To read one off-line zero the step needs the amplifier of row P39, which is closed. So (B) is not
   only Bagchi-type recurrence on file; the remaining member (Putnam type) is kind F.
3. **Link between (A) and (B).** "Axis" is defined only when the frequencies are independent over Q: CYC is
   at once a product over infinitely many axes and a single-axis factor (prod (1 + w^(2^k)) = 1/(1 - w)).
   Independence is the well-definedness clause of axis support, not a second input.
4. R1 test: (A) fails because the classification holds with the axis clause deleted (exact term) or
   because the selection step reads the size bound jointly and T-NR, multiplicative, fails it there
   (Selberg type). (B) fails because V6 and THIN x V6 pass the marked step with a bounded off-axis term.

Registered outcome: precise obstruction; score 0; no first lemma for round 23 from this lane.

## 1. Plan and what is new against the record

Plan as assigned: for each object, state it, decide the first lemma, run the TS section-6 conditions, the
R1 test, then the controls, then R1 to R4.

On file before this lane: angle 6 of the ideation panel (target stated, expected stop "the archimedean term
is absolutely continuous; exact support needed"); Theorem H and BR-3 as an identification; Theorem W and
CYC; n1 Theorem A (coefficient measure, positivity, no multiplicativity); TS-1.
New against the record: Lemma A1 (the exact-term form of angle 6 is BR-3 again and does not read the axes);
the three-class decision of Lemma A2 with a named member or equivalence in each; Lemma A3 with the
empty-stage reading; Lemma B1 (where the Weyl step can act under zeta's mass bound); the identification of
Putnam's theorem as the non-relative statement in which axis support and independence act jointly (B2) and
its closure by finite-modification invariance (B3); the remark that CYC makes "axis" undefined.
Nothing is claimed new against the literature. Kurasov-Sarnak, Olevskii-Ulanovskii, Kaczorowski-Perelli,
Putnam, van Frankenhuijsen, Meyer were not opened; every statement that uses them is "relative to".

Notation. gam(s) = pi^(-s/2) Gamma(s/2). A member G has log derivative
L_G(s) = -G'/G(s) = sum over n of Lambda_G(n) n^-s in Re s > 1. Axis support: Lambda_G(n) = 0 unless n is a
prime power. Mass bound: abs(Lambda_G(p^k)) <= log p (the size for one local parameter with
abs(alpha_p) <= 1). Tests g on R, transform g^(rho) = integral of g(u) e^((rho - 1/2) u) du. In this
normalisation the dual atom at +-k log p has mass Lambda_G(p^k) p^(-k/2).

## 2. Object (A): axis support

### 2.1 Statement

(A0) mu = sum of m_rho delta_rho is a measure with positive integer masses on the closed strip
0 <= Re rho <= 1, with sum of m_rho abs(rho)^-2 finite, and for every test g in the Weil class (not only
even ones)

  sum over rho of m_rho g^(rho) = g^(0) + g^(1) + W(g) - sum over n >= 2 of c(n) n^(-1/2) (g(log n) + g(-log n)),

with W the archimedean functional. Clauses: (ax) c(n) = 0 off prime powers; (mb) abs(c(p^k)) <= log p;
(arch) W in a named class. Target of angle 6: classify the pairs (mu, c).

### 2.2 Lemma A1: the exact archimedean term (first lemma, decided)

**Lemma A1 (PROVED-rel Theorem H of `c21-br0-br3`; the reduction to it is ARGUED, standard).** Let (A0)
hold with W = W_zeta, the archimedean functional of zeta, and let sum of abs(c(n)) n^-sigma be finite for
sigma > 1. Then c = Lambda and mu is the zero measure of zeta. Clauses (ax) and (mb) are not used beyond
absolute convergence.

Reduction. (i) The test g(u) = e^(-(s - 1/2) u) on u > 0 (Re s > 1) has g^(rho) = 1/(s - rho); the formula
reads sum of m_rho/(s - rho) = d/ds log[s (s - 1) gam(s) G(s)] + const, G = exp(sum of c(n) n^-s/log n). With
sum m_rho abs(rho)^-2 finite the left side is the log derivative of a canonical product of genus at most 1,
so Lam(s) = gam(s) G(s) is meromorphic on C of finite order with poles at 0 and 1 only, and G is an ordinary
Dirichlet series with a_1 = 1, absolutely convergent in Re s > 1. (ii) The mirrored test on u < 0 gives the
same Dirichlet series for -Lam'/Lam(1 - s). Hence Lam(s) = C Lam(1 - s), C^2 = 1. (iii) Theorem H (finite
order, finitely many poles, integer frequencies, the functional equation; with C = -1 its steps give the
same period relation, a_n = a_(n+1), hence G = zeta and C = 1). QED

What is read: dual support inside log N (any integers, the whole cone of Z^(primes) allowed), the two-sided
form of the formula, positivity of the masses (the pole clause), genus. Not read: the axes, the mass bound
at a single prime. This is BR-3 of round 21 in the notation of angle 6; class U3; score 0.

Remark (even tests only). If the formula is assumed for even g only, it sees the reflected average of mu,
and (i), (ii) give a functional equation for G^2 with gamma factor gam(s)^2. Identification of G^2 then
needs a converse theorem of degree 2 at conductor 1 (Maass type, CLASSICAL-rel, not checked). It is again
an identification. Not used below.

### 2.3 Lemma A2: the archimedean term unknown within a named class

**Lemma A2.** For the three classes below the object (A0) + (ax) + (mb) + (arch) is, respectively, an
identification, false, or equivalent to its own conclusion.

(N1) W in the class of log derivatives of gamma factors of Selberg type (products of Gamma(lambda_j s + mu_j)
with a conductor). (A0) with the conjugate-symmetric dual gives the functional equation of that type by the
reduction of A1; (ax) with (mb) is the Euler-product axiom with exponent theta = 0 and gives
abs(a_n) <= 1. So the object is the Selberg class with a stronger size axiom. PROVED-rel the reduction.
- Degree below 2: CLASSICAL-rel (Kaczorowski-Perelli 1999, 2011; Richert; Conrey-Ghosh; recalled). The
  members are zeta and L(s + i theta, chi), chi primitive. The structure theorem holds in the extended
  class without Euler product (degree-1 members are combinations of Dirichlet L-functions of one conductor
  and parity with Dirichlet-polynomial coefficients; DH is one). Axis support acts once, as a selection in
  that finite-dimensional space (row L2 of the map states the same). At DH's own gamma factor (conductor 5,
  odd, self-dual form) the selection leaves no member. The conclusion names functions; for
  L(s + i theta, chi) the zero statement is not known. Kind I.
- Degree 2 and above: OPEN in the literature (classification of the Selberg class). Any answer is a list
  of functions that contains automorphic L-functions, for which the zero statement is the target. Kind I,
  with the target left over.

(N2) W = W_zeta + D, D an even smooth density with abs(D(u)) <= C e^(eta abs(u)), eta < 1/2. PROVED-rel the
ZQ row (two referee files on file): ZQ has zeta's functional equation, positive integer zero masses,
exactly zeta's atoms on the axes, and its coefficient measure is Lambda plus the density
-4 x^(-1/2) cos(gbar log x)(cosh(eta log x) - cos(d log x)) dx, which in the variable u is
-4 cos(gbar u)(cosh(eta u) - cos(d u)) du. Moving this density to the archimedean side puts ZQ in the class.
It has a quartet off the line. So "supp mu on the line" is false in (N2), and the members with zeta's atoms
include every finite symmetric modification of zeta's zero set: no finite list. Kind F. The split of an
explicit formula into "zeros" and "archimedean term" is bookkeeping: a finite set of zeros can be carried
on either side. A class of archimedean terms excludes ZQ only if it excludes exponents in the strip.

(N3) W = W_zeta + D, D tempered. ZQ with eta > 0 is excluded; ZQ-type members with the two pairs moved
along the line are included, so (N3) is not an identification. For a member with atoms c, "supp mu on the
line" holds if and only if the prime-side distribution (atoms minus the pole terms 2 cosh(u/2)) is tempered
(ARGUED: pair with Schwartz tests; exponents off the line are not continuous for that topology; for zeta
this is the classical equivalence with psi(x) - x = O(x^(1/2+eps)), CLASSICAL-rel). The hypothesis that
would have to be verified for zeta is the target. Kind T. This is the form in which angle 6 placed the
Kurasov-Sarnak and Olevskii-Ulanovskii theorems: in those theorems the support on the real line is a
hypothesis and the conclusion is a structure statement.

Not covered by A2: a class of archimedean terms that is none of these. The census is of named classes, not
a proof of exhaustion (weakest step 3). Two further variants were tested and fail:
- no functional equation, archimedean term = dual of an arbitrary divisor outside the open strip:
  zeta(s) zeta(2s) (and the Liouville series zeta(2s)/zeta(s), control TW-) has axis support, local
  parameters 1, 1, -1 of modulus 1, finite order, two poles, and zeros on Re s = 1/4 (relative to nothing:
  zeros of zeta(2s) are at rho/2). So the symmetry of the strip divisor has to be in the hypothesis, and
  then the class contains the Selberg class and the conclusion is the target for it.
- a quantitative form (defect in one clause forces zeros near the line): row P57, target-level
  (Proposition TL on file).

### 2.4 Lemma A3: finite dimension, and what replaces it

**Lemma A3 (PROVED, elementary).** Let l_1, ..., l_n > 0 be linearly independent over Q and P a polynomial
in n variables with P(0) != 0, F(z) = P(e^(-l_1 z), ..., e^(-l_n z)), and log P = sum a_k w^k near w = 0, so that
F'/F is a Dirichlet series for Re z large. The dual of the zero measure of F (all zeros in C) has atoms at
k.l, k in N^n, with masses (k.l) a_k. Independence makes k -> k.l injective, so the dual is
supported on the axes if and only if log P = sum_j f_j(w_j), if and only if P = P(0) prod_j P_j(w_j) with P_j
univariate. Then F = P(0) prod over j, i of (1 - alpha_(j,i) e^(-l_j z)) and its zeros are the progressions
z = (log alpha_(j,i) + 2 pi i m)/l_j on the lines Re z = log abs(alpha_(j,i))/l_j. QED
(Checked on three factors, `checks.log`, residual 1e-15.)

Reading. (a) A zero on a given line needs a local parameter of the critical size for that line. In the
normalisation of the critical line this is abs(alpha_p) = p^(1/2): the family of BR-2, Theorem C and CYC,
the T1 and boundary twins of Lemma TS-1. (b) Under (mb) every finite stage has all its zeros on Re s = 0 or
left of it: the zero measure of every stage in Re s > 0 is empty. Object (A) has no finite stage in the
strongest sense, and a classification argument run through stages classifies the empty measure (the TS
condition "not the existence of zero-free stages" is the relevant clause). (c) Without independence the
notion fails: CYC (frequencies 2^k l_0, alpha = -1 in the normalisation of the line) is a product over
infinitely many "axes" and equals the single-frequency factor 1/(1 - w).

What replaces the product at infinitely many primes. Three candidates; each is a row on file.

| Replacement | Mechanism it would carry over | State |
|---|---|---|
| zero hypersurface of the Bohr lift on the infinite torus, cut by the Kronecker line (Kurasov-Sarnak) | measure = intersection of a codimension-1 set with an equidistributed line | no object: for Re s > 1/2 the lift is almost surely non-zero and the line is Haar-null; an off-line zero is carried by the tail beyond every finite prime set (P39, PROVED on file) |
| entire function with the measure as zero set and its spectrum inside a named set (Olevskii-Ulanovskii) | growth + spectrum determine the function | converse theorem: Theorem H at conductor 1, Kaczorowski-Perelli in degree below 2; identification (A1, A2 N1) |
| positive-definiteness of the dual of a positive measure (Bochner; the step (A1) of n1 Theorem A; Meyer) | positive masses on R give a positive-definite dual; equality cases give groups | for a measure in the strip the dual is positive-definite iff the support is on the line: Weil positivity (map section 3.1; target) |

### 2.5 TS section-6 conditions for (A)

| Condition | (A) |
|---|---|
| reads no finite stage, or a clause on every local factor at once | yes (A3 (b)); (mb) is the per-prime size clause that excludes T1 twins, as TS-1 predicts |
| not a form of degree <= 2 on window vectors | yes (no window) |
| property not additive in log F on a compact parameter set; not existence of zero-free stages | (ax) is a linear condition on the coefficients of log F and (mb) a convex size condition on them; stages are zero-free in Re s > 0 for every member. Fails as a launch condition for any argument through stages |
| none of the kinds M, I, T, F, R, V, X, S | fails: I (exact term; N1), F (N2, by ZQ), T (N3) |

(A) is stopped at the fourth condition in every version on file.

### 2.6 R1 test and controls for (A)

Marked step: the place where (ax) is used.
- Exact term (A1): (ax) is not used. V6 and THIN x V6 leave at the functional equation, not at the marked
  step; the theorem is true for every ordinary Dirichlet series. R1 not met.
- N1, degree 1: marked step = "a member of the extended degree-1 space with (ax) and (mb) is one
  L(s + i theta, chi)". Non-multiplicative DH fails it (first off-axis coefficient at n = 6). V6 and
  THIN x V6 fail the clause (ax) itself (Lambda at odd powers of 6 is -2 log 6) but do not reach the step:
  they have no functional equation. T-NR is in the extended degree-1 space (zeta times a Dirichlet
  polynomial, conductor q^2), satisfies (ax), and is rejected at the same step only by (mb)
  (Lambda(q^k) = (1 - alpha^k - beta^k) log q, abs(alpha) > q^(1/2)). A multiplicative control fails the
  marked step; by the version-6 rule the flag is not entered. HQ1 to HQ4 and E_a do not fail (ax); they
  leave at other clauses (table).

| Control | Clause of (A0)+(ax)+(mb)+(arch) that fails | Kind of clause |
|---|---|---|
| DH | (ax): off-axis mass at 6; and W is the conductor-5 odd term | multiplicativity (and class) |
| backward heat | dual of the zero measure is not atomic on log N (coefficient cocycle; no fixed-frequency Dirichlet series) | integrality |
| sign twist (TW+, TW-, THIN, DEL) | (A0): no functional equation; THIN and DEL continue only to Re s > max(b - eta, b/3 or b/2), so no zero measure with a two-sided formula. (ax), (mb) hold | continuation |
| unimodular twist U, WT | U: (A0), no continuation in general. WT = zeta(s + i alpha): satisfies every clause once the pole terms are moved to -i alpha, 1 - i alpha; its zeros are translates of zeta's, so it is not a control for (A) | continuation; none for WT |
| E_a | (mb): masses (p^(ka) + p^(-ka)) log p; poles at 1 +- a | size |
| T-NR | (mb) at the one prime q | size at one prime |
| HQ1 to HQ4 | positivity of m_rho (pole lattices); and (mb) (HQ1, HQ2 at exponent 1/2 exactly; HQ3, HQ4 above) | pole clause; size |
| ZQ, SG | exact term: the added absolutely continuous density (integrality of the dual). In N2 both are members (SG: density -2 (cosh(b u) - cos(g1 u)), exponent b < 1/2) | none in N2 |
| NR-q | dual atoms at log n + j log q, off log N | integrality |
| CYC | axes undefined (dependent frequencies); as a Beurling-type object it has no functional equation | independence |
| NWM | dual has an absolutely continuous part of exponential growth above 1/2; infinite order (genus clause) | class of W; genus |
| Beurling | n1 Theorems A, B: no member with the functional equation | continuation |
| phase-rotated transfer operator, theta^w | not Dirichlet series with a two-sided formula; not formulable | - |

No control fails for a reason that is both multiplicative and not a size clause, and ZQ passes N2.

## 3. Object (B): Weyl independence

### 3.1 Where the step acts

Theorem W, step 4 (a): for j != k the numbers n log q_j / log q_k, n = 1, 2, ..., are equidistributed
modulo 1, so a positive proportion of the multiples n log q_j lie far from every lattice (log q_k) Z. The
sequence in n is the sequence of multiples of one frequency.

**Lemma B1 (PROVED, one line).** Let G satisfy (ax) and (mb). Then
L_G(s) = sum over p of Lambda_G(p) p^-s + R_G(s), with
abs(R_G(s)) <= sum over p of (log p) p^(-2 sigma)/(1 - p^(-sigma)), finite for sigma > 1/2.
So R_G, the part of the dual on the multiples k >= 2, is analytic and bounded in every half-plane
Re s >= 1/2 + eps, and every zero or pole of G in Re s > 1/2 is a singularity of the first-point series
sum Lambda_G(p) p^-s. QED
(MEASURED for zeta, `checks.log`: mass per unit of u = log n in the normalisation of the line: first points
8.45, 25.6, 69.9, 192.6 at u = 4, 6, 8, 10, against the pole term 9.59, 26.1, 70.8, 192.6; multiples k >= 2:
0.63, 0.52, 0.61, 0.60. Partial sums of the majorant of R to 6e4: 4.75, 3.64, 1.83 at sigma = 0.55, 0.6, 0.75.)

Reading. On the first points each axis contributes the single frequency log p. There is no lattice on an
axis for the equidistribution to compare with another lattice. The Weyl step of Theorem W needs all
multiples of one frequency to carry masses of the same size in the normalisation of the line, which is
abs(alpha_q) = q^(1/2): the relative products of BR-2. For zeta's size the same step proves statements on
Re s = 0 (remark (iii) of the BR-2 lane, beta = 0), a line where the product has no relation to the zeros
in the strip. So in the frequency variable there is no statement not relative to zeta, in Re s > 1/2, in
which the step acts. PROVED as stated (the claim is about where the masses are, not about all possible
arguments).

### 3.2 The height variable: the non-relative statement, named

Independence also acts on heights: (t log p/2 pi) modulo 1 over finitely many p (Kronecker-Weyl), or a
lattice of heights t = n d against the frequencies.

**Lemma B2 (lattice projection; PROVED for Re s > 1, elementary).** Let L_G be absolutely convergent at s,
d > 0, x = e^(2 pi/d), phi_N(n) = e^(-pi n^2/N^2). Then
(1/N) sum over n of phi_N(n) L_G(s + i n d) = sum over m of Lambda_G(m) m^-s sum over k of e^(-pi N^2 (log m/log x - k)^2)
and the limit N -> infinity is M_d[L_G](s) = sum over m in {x, x^2, x^3, ...} of Lambda_G(m) m^-s. If G has axis
support, unique factorisation gives: the powers of x contain prime powers of at most one prime p, and they
are p^(j_0 i), i >= 1, for one j_0. So M_d[L_G] is a sub-series of one local factor, and it is 0 unless x is a
rational power of a prime. QED
(MEASURED, s = 3 + 0.3i, N = 4, 16, 64: both sides agree to 4e-13 .. 6e-11 for x = 2, 4, 6, e; values at
N = 64: x = 2: 0.0959085 - 0.0232007i against the limit 0.0959085 - 0.0232000i; x = 4 (j_0 = 2):
0.0100220 - 0.0045035i against 0.0100220 - 0.0045031i; x = 6 and x = e: 1.6e-6 and 6e-8 in real part,
limit 0.)

This is the statement in which axis support and independence act jointly, with no reference function:
"a lattice of heights meets the axes in at most one axis". Its known consequence across the line is
Putnam's theorem (CLASSICAL-rel; Putnam 1954, van Frankenhuijsen 2005 for finite lengths; recalled, not
opened): the zeros of zeta contain no infinite vertical arithmetic progression. The br0 lane used it for
the pole lattices of HQ1, HQ2. In the terms of (A): at finitely many frequencies axis support makes the
zero set a union of progressions (A3); at infinitely many independent ones under the mass bound it leaves
no progression at all. The periodic part of the divisor of a member in Re s > 0 is the divisor of single
local factors (zeta: none; T-NR, HQ: the lattices of the factor at q; CYC: the lattices are commensurable
and the local terms add and cancel).

It is not Bagchi-type recurrence: it is an exact resonance statement, not a density statement about
returns. It is a statement about zeros of zeta only in the sense of the cited classical theorem; nothing
is added to it here.

### 3.3 Lemma B3: why it does not pass

**Lemma B3 (finite-modification invariance; PROVED, elementary).** Let m be a rational function with
m -> 1 at infinity (ZQ and SG: m is rational in s(1 - s) of degree 0, so m'/m = O(abs(s)^-3)). Then
L_(zeta m) - L_zeta = -m'/m tends to 0 along every vertical line, uniformly on strips, and for every d and
every s off the poles, (1/N) sum of phi_N(n) (m'/m)(s + i n d) -> 0. Hence M_d, and every functional of a
member defined as a limit of averages over heights of window functionals that are continuous in the log
derivative (or in G on windows where G is bounded away from 0), takes the same value on zeta m and on
zeta. QED

Consequences.
- Any conclusion obtained from equidistribution in the height variable (a positive proportion of heights,
  a density, a limsup along a lattice of heights, the periodic part of the divisor) holds for ZQ and SG if
  it holds for zeta. ZQ has a quartet off the line, SG a real zero. Kind F.
- To read one off-line zero such a step must first turn it into an event of positive density in height.
  That is the amplifier of row P39 (closed: the recurrence hypothesis is as strong as the zero-free
  statement), with P54 (UNIV) for height-uniform window inequalities and Q21 for stage statements
  (rotation invariance: every unimodular twist passes).
- Theorem W itself reaches its contradiction by this pattern (a positive proportion of n contradicts a
  bound that must hold for all large n); the hypothesis it refutes is global (meromorphy near a point with
  dense lattices), and a finite set of off-line zeros is no such hypothesis.

Census of the statements on file in which independence of the log p is the working step:

| Statement | Variable in which Weyl or Kronecker acts | Relative to zeta? | Closing kind |
|---|---|---|---|
| Theorem W, Lemma P (BR-2) | multiples of a frequency | yes (relative product; base-blind) | natural-boundary row; B1 confines it to parameters of size p^(1/2) |
| Bohr / Bagchi recurrence, universality (P39, P54, angle 7) | height | no | T (P39), UNIV (P54) |
| rotation invariance of Euler stages (Q21, K1 of TS) | height at a finite stage | no | F (U passes) |
| mean-value diagonals (log m != log n) | height average | no | M (MV-CAP) |
| n1 step (B2): bounded multiplicity gives unique factorisation | none (exact) | no | I |
| Putnam type (B2 here; used in br0 section 3) | lattice of heights, exact resonance | no | F by B3 (ZQ, SG pass) |

So the alternative posed in the assignment is answered as: not every statement on file is Bagchi-type;
there is one non-relative statement of another type (Putnam type), and it is closed by B3.

### 3.4 TS section-6 conditions, R1 test and controls for (B)

| Condition | (B) |
|---|---|
| reads no finite stage, or every local factor at once | yes for the Putnam-type statement (all d, all axes); the Kronecker forms read finite stages (Q21) |
| not a form of degree <= 2 on window vectors | yes (linear in L_G) |
| not additive in log F on a compact set; not zero-free stages | fails: M_d is linear in log F |
| none of M, I, T, F, R, V, X, S | fails: F (B3); the identity B2 itself is I (an explicit formula with a comb test) |

R1 test. Marked step: "the powers of x meet the support of Lambda_G in one axis".
- V6 = zeta(s)(1 - 6^-s)/(1 + 6^-s): Lambda_V6 = Lambda - 2 log 6 on odd powers of 6. For x = 6 the lattice
  meets no axis and meets the off-axis support; M_d[L_V6] = -2 log 6 . 6^-s/(1 - 6^(-2s)), bounded by 1.76 in
  Re s >= 1/2 and analytic in Re s > 0 (MEASURED at s = 3 + 0.3i, N = 64: -0.014249 + 0.008492i against
  -0.014251 + 0.008495i). The literal clause fails, but everything the argument takes from the step (one
  bounded term per lattice, with singularities on Re s = 0) holds. V6 passes the step in the sense of the
  test. THIN x V6: the same with the sign of S; passes.
- HQ1 to HQ4, E_a: multiplicative; the step holds and M_d returns their local lattices (HQ) or a term with
  singularities on Re s = +-a, left of 1/2 (E_a). They do not fail the step.
The step reads sparsity and size of the support of Lambda_G on each geometric progression, which V6 has.
R1 not met.

| Control | Marked step | Conclusion "no infinite progression in Re s >= 1/2 beyond local factors" | Named hypothesis that fails, if any |
|---|---|---|---|
| DH | fails: powers of x = m^(1/r) meet the support at composite m; Lambda_DH is not bounded by log n (the series for L_DH has abscissa of absolute convergence about 1.12, the supremum of the real parts of its zeros) | not decided here; not known to fail | axis support and size |
| backward heat | not formulable (no Dirichlet series in a fixed frequency set) | - | integrality |
| sign twist (THIN, DEL, TW-) | holds verbatim in Re s > 1 | THIN, DEL: true in their half-plane of continuation, and they have a zero off the line | none: pass (kind F) |
| unimodular twist U, WT | holds | WT: true, as for zeta | none: pass |
| T-NR | holds | returns the zero lattice of the factor at q (off the line): detected | size at q (TS-1, T1) |
| HQ1 to HQ4 | holds | returns the pole lattices: detected | pole clause |
| E_a | holds | true (relative to Putnam for zeta) and zeros off the line | none: pass |
| CYC | fails: all lattices commensurable, the local terms add and cancel | false: no singularity at all | independence |
| NWM | not formulable for the factor 1 + R (continuous density) | not decided | integrality |
| ZQ, SG | holds (same atoms) | true, with zeros off the line | none: pass (B3) |

THIN, DEL, WT, E_a, ZQ, SG pass. R3 not met.

## 4. Pivot (one, as allowed): the first-point measure

Strongest adjacent object found: by B1 the strip singularities live in the first-point series
P_G(s) = sum Lambda_G(p) p^-s, whose dual sits on the set {log p}, linearly independent over Q. Question
asked: does independence of the support constrain which such measures have a meromorphic continuation to
Re s > 1/2 with integer residues?
Decided negatively on paper. Independence gives the torus action c(p) -> e^(i theta_p) c(p) on such measures
and, through Kronecker, sup over t of abs(sum c(p) p^(-sigma - it)) = sum abs(c(p)) p^-sigma (Bohr;
CLASSICAL-rel): the series is unbounded on every line sigma <= 1 whenever it diverges absolutely there, for
every member. The continuation clause is not invariant under the torus action (control U), and no
statement on file uses independence to restrict it; the first-point measure of THIN and DEL has the same
support and size and continues with a zero at b. No object. Stopped here; no second pivot.

## 5. What goes to round 23

Passing objects: none. First lemmas: none.

Two pre-filter lines for the launch check (both follow from lemmas above, each PROVED, elementary; to be
entered only after an independent referee):
1. (from B3) A step whose output is an average, density or limsup over heights, or the periodic part of a
   divisor, is passed by ZQ and SG. Name the amplifier or do not launch.
2. (from A2, N2) A class defined by a condition on the archimedean side of an explicit formula must
   exclude exponents in the open strip from that side, or ZQ is a member. If it does exclude them and
   keeps the functional equation of zeta exactly, Lemma A1 applies and the class is {zeta} without reading
   the axes.

Open items of identification type touched by this lane (each scores 0 either way): the even-test form of
A1 (degree-2 converse theorem at conductor 1); BR-3' of the br0 lane; classification of the Selberg class in
degree 2 and above.

## 6. What this does and does not give

- Gives: the decision that angle 6 with the exact archimedean term is Theorem H; a named member or
  equivalence for each relaxation on file; the place where the Weyl step can act (B1); the Putnam-type
  statement as the joint use of both clauses, and its closing lemma (B3).
- Does not give: any inequality, zero-free region, or statement about a zero of zeta; any proof that no
  other class of archimedean terms or other use of independence exists.

## 7. Requirement flags, with evidence

| Flag | (A) axis support | (B) Weyl independence |
|---|---|---|
| R1 multiplicativity essential | false. Exact term: the axes are not read (A1). Selberg type: the analytic theorem holds without Euler product; at the selection step T-NR (multiplicative) fails through the size bound (2.6) | false. V6 and THIN x V6 pass the marked step (3.4); in Theorem W the input is independence of a sparse set of norms, which Beurling systems share (already recorded by that lane) |
| R2 height-uniform, every window | false. Identification or target; no window statement | false. B2 holds for every d and every line but its consequence is about infinite progressions; B3: it cannot separate two divisors that differ in a bounded window |
| R3 every control fails structurally | false. ZQ passes N2; WT passes N1; other controls leave at size, pole or continuation clauses (2.6) | false. THIN, DEL, WT, E_a, ZQ, SG pass (3.4) |
| R4 reaches the line | false. The zero measure and its two-sided formula are the continuation; A3 (b): stages carry no zero in Re s > 0 | false. B1: the part of the dual on which the Weyl step acts is absolutely convergent data in Re s > 1/2; B2 is proved in Re s > 1 only, its crossing is the cited theorem for progressions |

About zeros of zeta: no. Referees: 0.

## 8. Three weakest steps

1. Literature recalled, not opened: Kaczorowski-Perelli (structure in degree below 2, including the form of
   the extended degree-1 space and that T-NR lies in it), Putnam and van Frankenhuijsen (progressions),
   Kurasov-Sarnak and Olevskii-Ulanovskii (support on R as hypothesis), Bohr's equality for independent
   frequencies, the degree-2 converse theorem in the remark to A1. Every use is marked "rel"; if the
   degree-1 structure theorem has a different form, item N1 of A2 and the T-NR line of the R1 test change,
   not the verdict (N1 remains an identification by citation or an open one).
2. Lemma A1, reduction: the passage from the summation formula to a meromorphic G of finite order assumes
   the formula for one-sided resolvent tests and the convergence clause sum m_rho abs(rho)^-2 finite, and
   uses Theorem H with constant C = -1 by rerunning its steps in one sentence. Theorem H itself has only its
   author's proof on file. The even-test version is not proved here.
3. Exhaustiveness. A2 decides three named classes and two variants; section 2.4 and the census of 3.3 list
   the replacements and statements on file or found by the author. None of this proves that no fourth
   class, replacement or use of independence exists. In N3 the equivalence "tempered prime-side
   distribution iff support on the line" is ARGUED for general members and classical only for zeta. Lemma
   B3 covers functionals continuous in the log derivative on windows; a functional that is not of
   average-over-heights type is outside it.

## 9. Files

`RESULT.md`, `REFEREE.md` (author's adversarial pass; not independent), `lanes.jsonl`, `checks.py`,
`checks.log`, `checks.json`.
