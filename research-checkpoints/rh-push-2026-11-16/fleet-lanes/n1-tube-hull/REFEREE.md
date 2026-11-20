# REFEREE: n1-tube-hull (adversarial, general)

Date 2026-11-17. Target: `RESULT.md` in this directory. Claimed verdict: precise-obstruction.
No file other than this one was written. No ssh. All numerics ran locally through
`scripts/memcap.sh 8` (single process, under 5 seconds, inline scripts, `.venv-arb/bin/python`).

**Referee verdict: the claimed verdict holds, with the corrections below.** Every PROVED and PROVED-model
statement was re-derived or recomputed independently and confirmed. No step assumes RH, none restates verified
height, and no zero-free abscissa is claimed. The errors found are of statement and attribution, not of
substance. The result is a negative result whose main theorem is elementary and of folklore type.

---

## 1. Theorem T: re-derived, confirmed [PROVED]

Checked step by step.

* Termwise integration: with absolute convergence locally uniform in y,
  integral (lambda_1/lambda_n)^(sigma+it) phi(t/T) dt/T = (lambda_1/lambda_n)^sigma phihat(T log(lambda_n/lambda_1)),
  which is 0 for n >= 2 once T log(lambda_2/lambda_1) >= delta, and phihat(0) = 1. So A = c_1 exactly. Correct.
  For general n the gaps on both sides are positive because the sequence is discrete. Correct.
* Holomorphy of A(.; sigma) on the tube over the slice B_sigma: needs the growth bound to be locally uniform in
  Im y as well as Im z. The hypothesis as worded ("polynomial growth in the imaginary parts") covers this.
* Recession: U = (sigma_0, inf) x N inside open convex B gives (1,0) as a recession direction of the closure and
  therefore of the open set B. Slices increase with sigma; each y in pi(B) lies in B_sigma for all large sigma,
  and such a slice is convex and contains N. Identity theorem on the connected slice. Correct.

Theorem T is correct as stated. It is the Bohr mean-value extraction of a Dirichlet coefficient made exact by a
band-limited weight. It is not presented as new, and it should not be: the principle that a multiple Dirichlet
series cannot be continued past a singularity of one of its coefficients is standard in that subject.

### 1.1 Gaps in the corollaries (statement level)

**E1 (Corollary T1, wording "meets").** T requires B to contain a set (sigma_0, inf) x N. T1 says "every convex
holomorphy tube that meets the absolute region". A bounded convex base that meets the absolute region does not
satisfy the hypothesis of T. To cover it one must take the union with the absolute region, apply Bochner, and
transfer growth to the hull. That transfer is labelled ARGUED in the result (section 1, last paragraph; weakest
step 2). So T1 is PROVED only for tubes that contain a Dirichlet-recessive piece of the absolute region, and is
PROVED-modulo-ARGUED-growth-transfer in the form stated. I checked the growth-transfer sketch: it works if one
divides by a product of affine forms with positive real part on the base (one per variable, not "a linear
form"), exhausts the base by slightly smaller bases on which f is polynomially bounded, and uses that an affine
form positive on the base stays positive on the convex hull. It is routine but it is not written.

**E2 (growth hypothesis dropped).** T1 and the summary sentence "excluded unconditionally by Theorem T" omit the
polynomial-growth hypothesis. T2 states it. The exclusion is conditional on polynomial vertical growth of the
continued function. For functions obtained from functional equations and Phragmen-Lindelof this holds, so the
application is not affected, but "unconditionally" is too strong as written. I tried to build a counterexample
to T without growth (f = 1/(y + 2^(-z)), c_1 = 1/y) and it fails to be one: the base {eta > 2^(-sigma)} is
convex and its projection excludes 0, consistent with T. Whether T holds without growth is not settled here.

**E3 (clearing products, T1 last sentence).** The claim "a finite clearing product does not change this" is
correct but not proved in the text. The clearing factor may depend on the Dirichlet variable (for instance
(s-1)), and then f times the factor is not a Dirichlet series. Repair, checked: write A = f/P; for fixed y the
zeros of P in the Dirichlet variable are finitely many; by the recession property one may take sigma larger
than all of them over a compact path in the base, so the average A(.; sigma) is defined and holomorphic off the
finitely many complex hyperplanes of P that do not involve the Dirichlet variable. Hence c_1 is meromorphic on
the tube over pi(B) with poles on finitely many complex hyperplanes only, which contradicts infinitely many
polar hyperplanes z = rho. This should be written into the proof.

**E4 (section 3.2, attribution).** "No non-circular second chamber [PROVED from T2 given the polar divisor]" is
argued from poles 2w = rho of Z(s,w) itself, in the variable w, which is the Dirichlet variable of the d-sum;
T2 as stated concerns singularities of coefficients, and the result notes "residue nonvanishing not checked".
The statement is true and can be proved from T with no residue check: expand in n instead,
Z(s,w) = sum_n n^(-s) sum_d chi_d(n) d^(-w); the n = 1 coefficient is the sum over fundamental discriminants of
d^(-w), which is zeta(w)/zeta(2w) up to finitely many local factors and has a pole at every 2w = rho. With s as
the Dirichlet variable T applies directly. The conclusion stands; the cited route is not the one that proves it.

**Remark (T2 needs less than stated).** The second region need not be recessive in the Dirichlet variable. The
hull of the union with the absolute region is convex, contains the recessive absolute region, and its
projection contains a point with l = 1/2. That is enough.

---

## 2. Lemma 1 (quadratic row): re-derived, confirmed [PROVED-model]

By hand: alpha fixes F1 and swaps F2, F3; beta swaps F1, F2 and fixes F3. F1, F2, F3 are affinely independent,
so the action on them is faithful and <alpha, beta> embeds in S3; alpha, beta are involutions with product of
order 3, so the order is 6. Direction of the inequality checked: for p = g(q), q in R(theta),
F_i(p) = F_pi(i)(q) > theta. So every image lies in C_theta. Correct.

Infinite group with gamma: the result's log shows only "order of beta*gamma = None" for exponents below 60 and
an enumeration cap, which is evidence, not proof. Independent proof: in centred coordinates beta*gamma has
characteristic polynomial x^3 + 2x^2 - 2x - 1 with eigenvalues 1, -0.381966, -2.618034. An eigenvalue of
modulus greater than 1 gives infinite order. Confirmed. <alpha, gamma> has order 4 (they commute). Confirmed.

Different numeric case (independent float basis-enumeration LP, right-multiplication closure, matrices checked
against the uncentred maps at random rational points):

| theta | slice s | min Re(w+z) on hull | predicted theta + 1 - s |
|---|---|---|---|
| 3/4 | 1 | 0.75 | 0.75 |
| 3/4 | 3/2 | 0.25 | 0.25 |
| 3/4 | 3/4 | 1.0 | 1.0 |
| 3/4 | 2 | -0.25 | -0.25 |
| 3/5 | 1 | 0.6 | 0.6 |
| 3/5 | 1/4 | 1.35 | 1.35 |

The F3 bound is attained on every slice tried. Lemma 1 and its sharpness are confirmed.

---

## 3. Sextic test: recomputed, confirmed [PROVED-model]; one strengthening found

Independent recomputation: K6, Theta3, Pm are involutions; orders K6 Pm = 3, Theta3 Pm = 4, K6 Theta3 = 2;
closure has 48 elements. A group generated by three involutions with these product orders is a quotient of the
Coxeter group B3 of order 48, so it is B3. X o Theta3 = X. The orbit of X is {T, T+V, T+S+V} and negatives,
8 elements each. Slice (w,z) = (1,1/6), theta = 1: x_min = 7/5, reproduced. New cases: theta = 3/4 gives
x_min = 3/4; theta = 3/5 gives 3/5; slice (1, 1/4) at theta = 1 gives 27/20; slice (3/2, 2/5) gives 23/20.

Coordinates checked against the manuscript text (`~/lean-deps/qrh-verify/paper.txt`): the weight
X^(1/2-z) Z^(x+z-1) Y^(w-1) before (7.5), x = t + 1 - z, and (7.13) are as quoted. The formula for c_1 follows
from Lemma 7.1 at j = 0, rho = 1, with V and R set to 0: P_p = 1/(1 - Q^(-w)) - eta(p) Q^(-x). The factorisation
into zeta(w) L(x+w, eta) / (L(x, eta) L(2x+2w, eta^2)) times a product convergent for 2x + w > 1 is correct
(1 - D + DW = (1 - D)(1 + DW)(1 + O(D^2 W))). This assumes R carries a factor V, which is what the
manuscript's description of R states; I did not trace the definition of R further.

**E5 (the LP table of 2.5 has no content beyond Fact B).** The infimum of a linear functional on a convex hull
equals its infimum on the generating set. With no slice constraint, "hull x_min = input theta" is therefore
the statement that X o g is one of T, T+V, T+S+V on each admitted image, with theta inserted by hand in the two
charts where X o g = T. The row "output = input" is an identity of the construction, not a computation. Only
the sliced values (7/5 and the like) are computations. The table should not be read as six independent
confirmations.

**Strengthening (removes most of weakest step 1).** 24 of the 48 elements have X o g in {T, T+V, T+S+V}, not
only the 8 called legitimate. Adding the other 16 to the hull at theta = 1 leaves x_min = 1 (recomputed).
So the ARGUED classification of section 2.4 is not needed among those 24: whichever of them are regions of
holomorphy, the hull bound is the same. The classification matters only for the 24 elements with a negative
member, and those are excluded by T2 (given growth), not by the argument about periodicity of the m-coefficients.
Adding the single image Pm Theta3 makes the LP unbounded below (recomputed), so the whole obstruction rests on
T2 for that half, as the result says.

**E6 (Part 3, "finite only for a = 1, 2").** The log shows an enumeration cap for a = 3, 4, which is not a
proof of infinitude. Independent check: at a = 4, Theta_a Pm has trace 3 and infinite order; at a = 3 the
element K T P K T P is unipotent and not the identity, hence of infinite order. The claim is true; the log
did not establish it.

**Observation, not an error.** At the manuscript's principal residue point (w,z) = (1,1/6) the model hull
gives x_min = 7/5 with no input and about 1.27 with input 3/4. The manuscript's own region (7.15) reaches
x_r >= 7/8 there for the correction product. So the model hull is much smaller than the region the 7/8 method
actually uses, in line with the result's weakest step 3: the estimate-supplied base was not put through the
LP, and "Bochner adds nothing to the 7/8 method" is ARGUED only. The headline "no value below 0.874886647"
is a statement about absolute-convergence bases and their functional-equation images, nothing more.

---

## 4. Controls, run by the referee

The result claims no zeta-only mechanism (it claims the hull is blind to multiplicativity), so the controls
are consistency checks.

* **Davenport-Heilbronn.** Confirmed numerically that the DH function
  5^(-s) [zeta(s,1/5) + kappa zeta(s,2/5) - kappa zeta(s,3/5) - zeta(s,4/5)] has a zero at
  0.808517182457 + 85.6993484854 i (|f| = 2e-30 at 30 digits). So the d = 1 coefficient 1/f(z) of the DH family
  has a pole off the line and T1 confines a tube accordingly. The residue computation for the quadratic family
  was re-derived for zeta: the diagonal nm = square with m squarefree gives zeta(2w)/zeta(w+z); for
  non-multiplicative inverse coefficients the sum does not factor. The figure 1.12 for the supremum of DH zeros
  is not load-bearing; a rough Kronecker count with real phases over primes congruent to 2, 3 mod 5 is
  consistent with a value near it, but I did not verify it and the result gives no source. Mark it MEASURED or
  cite it.
* **Sign twist.** Agreed: neither <alpha, beta> nor the admitted sextic images use a reflection of the
  reciprocal variable, so the argument is identical for the twist. Consistent with output = input.
* **Backward heat.** Not formulable for a family Dirichlet series. Agreed.
* **zeta(s+a) zeta(s-a).** Shift by a in the theta-parametrised LP: consistent with the theta = 3/4, 3/5 rows
  above (output tracks input linearly).

No step uses RH. No step restates verified height. T2 uses only the classical existence of zeros on the
critical line.

---

## 5. Summary of errors

| id | where | kind | effect on verdict |
|---|---|---|---|
| E1 | T1 "meets the absolute region" | hypothesis of T not met for bounded bases; needs the ARGUED growth transfer | label T1 PROVED only for tubes containing a recessive piece |
| E2 | T1, summary "unconditionally" | polynomial-growth hypothesis omitted | wording |
| E3 | T1 clearing product | correct, proof missing (given above) | none |
| E4 | 3.2 "PROVED from T2" | wrong route cited; correct proof via the n = 1 coefficient | none |
| E5 | 2.5 LP table | unsliced rows are tautological | presentation |
| E6 | Part 1 beta*gamma, Part 3 a = 3, 4 | infinitude shown by cap only; proved here by eigenvalue / unipotent element | none |

## 6. What survives

1. Theorem T as stated (with polynomial growth and a recessive piece of the absolute region in the base).
2. T1 and T2 for tubes containing a recessive piece of the absolute region and with polynomial growth,
   including finite clearing products (argument in E3). For general bases: modulo the unwritten growth transfer.
3. Lemma 1 with sharpness; <alpha, beta> of order 6; the group with gamma infinite (now proved).
4. The sextic model: B3 of order 48, Theta3 fixes x, orbit of X of size 6. The hull bound x >= 1 (or theta
   with ZF(theta) input) holds over all 24 images with X o g nonnegative, so it does not depend on the ARGUED
   list of 8. Exclusion of the other 24 is by T2.
5. Not established: that the Bochner hull of the manuscript's estimate-supplied region adds nothing (ARGUED in
   the result and stated as such); the model status of K6, Pm, Theta3 as actual functional equations of the
   triple series (stated as MODEL in the result).

The result is a correct negative statement. It supplies no mechanism toward a zero-free region and does not
claim one. Its content beyond folklore is the specific bookkeeping: the theta reflection fixes the Moebius
variable, and the only group elements that move it are those excluded by coefficient singularities.
