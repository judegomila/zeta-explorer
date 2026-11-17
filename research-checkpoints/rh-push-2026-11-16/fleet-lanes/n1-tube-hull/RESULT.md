# n1-tube-hull: Bochner's tube theorem on multiple Dirichlet series with a reciprocal L-function

Internal working note, 2026-11-17. Slug `n1-tube-hull`. Nothing committed, pushed or posted. Not refereed.
Files: `hull.py` (exact rational arithmetic, python stdlib `fractions`; sympy is not installed on this machine, so
the group enumeration and the LP are done with exact fractions instead), `hull.log` (run through
`scripts/memcap.sh 8`, single process, under one second).

No statement about zeros of zeta is proved here. 7/8 (unrefereed sources) stands; RH open. NO QED.

Labels: PROVED (complete argument here) / PROVED-model (exact statement about the affine model, checked in
`hull.log`) / PROVED-rel MS (relative to the 7/8 manuscript `~/lean-deps/qrh-verify/paper.txt`) / CLASSICAL /
ARGUED / MODEL / OPEN.

**Verdict: precise obstruction; the idea is closed.** In every model the hull of the regions obtainable from
absolute convergence and functional equations returns the input abscissa: 1 with no input, theta with input
ZF(theta). The sextic test (first test, done first) gives hull value 1, not a value below 0.874886647. The
reason is one line: the reflection of the Moebius variable exists only in the chart where that variable is a
theta-row variable, and there it fixes x; in the chart where the reciprocal L(x, eta) is visible the Gauss sum has
been cancelled and x has no reflection. Any element of the formal group that moves x across the critical strip is
excluded unconditionally by Theorem T below together with the existence of zeros on the critical line.

---

## 0. Plan

Idea under test: A(s,w,z) = sum_d L(w,chi_d) L(z,chi_d)^(-1) d^(-s) has residue zeta(2w)P(w,z)/zeta(w+z) at s = 1.
If (s-1)A times a finite polar-clearing product is holomorphic on a tube over a convex base containing (1,u,v),
zeta has no zero with real part u+v, at every height. Bochner's theorem would supply the convex base from the
union of functional-equation images of the absolute region, with no estimate.

What is different from closed lanes: Z14, Z15 and `r3-method-limit` treat the 7/8 architecture as an exponent
system. Here the same objects are treated as holomorphy domains in C^3, and the question is whether convexity of
the domain (Bochner) gives more than convexity of the exponents. Section 6 item 1 of the map (effective order 2)
is not addressed.

Order of work: (1) sextic test with the manuscript's actual triple series; (2) Theorem T (why a tube cannot pass
the family supremum); (3) quadratic first lemma and the two-variable variant; (4) controls.

---

## 1. Theorem T: a convex tube transfers holomorphy to every Dirichlet coefficient [PROVED]

**Theorem T.** Let B be an open convex subset of R x R^k and f holomorphic on the tube over B in variables
(z, y), with polynomial growth in the imaginary parts on each vertical set {Re z = sigma, Re y in K}, K compact in
the slice B_sigma. Suppose that on an open set U = (sigma_0, inf) x N contained in B

  f(z, y) = sum_n c_n(y) lambda_n^(-z),   0 < lambda_1 < lambda_2 < ... discrete, absolutely convergent,

locally uniformly in y. Then every c_n continues holomorphically to the tube over pi(B), the projection of B
along the z-axis.

Proof. Take phi Schwartz on R with integral 1 and Fourier transform supported in (-delta, delta). For T with
T log(lambda_2/lambda_1) > delta put

  A(y; sigma) = integral f(sigma + it, y) lambda_1^(sigma + it) phi(t/T) dt / T.

For Re y in N and sigma > sigma_0, termwise integration gives A = sum_n c_n(y) (lambda_1/lambda_n)^sigma
phihat(T log(lambda_n/lambda_1)) = c_1(y) exactly, at finite T. For fixed sigma, A(.; sigma) is holomorphic on
the tube over the slice B_sigma (polynomial growth against Schwartz decay), and B_sigma is convex and contains N.
So A(.; sigma) is the continuation of c_1 to B_sigma. (1,0) is a recession direction of U, hence of the open
convex set B, so the slices increase with sigma and their union is pi(B). For c_n replace lambda_1 by lambda_n
and take delta below the gaps on both sides. QED

No information as Re z -> infinity is used, and no Euler product. Growth: for a hull produced by Bochner's
theorem, polynomial growth on the original connected tube passes to the hull because the envelope of holomorphy
preserves the range of a holomorphic function (apply to f divided by a power of a linear form that is bounded
away from 0 on the tube) [CLASSICAL, ARGUED here, not written out].

**Corollary T1 (the tube cannot pass the supremum of the family zeros) [PROVED from T].** If one coefficient
c_n(y) has a pole on {l(y) = rho}, l real-linear, then pi(B) contains no point with l = Re rho. For a family
series sum_d L(w,chi_d) L(z,chi_d)^(-1) d^(-s) the coefficient d = 1 is zeta(w)/zeta(z): every convex holomorphy
tube that meets the absolute region lies in Re z > Theta, Theta = sup of real parts of zeros of the target. With
every coefficient: it lies above the supremum over the whole family. A finite clearing product does not change
this unless it vanishes on z = rho for the infinitely many rho of a given real part, which is circular.

**Corollary T2 (no second chamber) [PROVED from T + CLASSICAL: zeros on the critical line exist].** A connected
tube domain, with the growth hypothesis, cannot contain the absolute region together with a z-recessive region
on the other side of the slab {Re l in (0,1)}: its hull would carry c_n across l = 1/2 where c_n has poles.
So the images of the absolute region under a reflection of the reciprocal variable are never part of one
connected holomorphy tube. This holds under RH as well.

---

## 2. First test (decisive): the sextic probe series

### 2.1 The object [PROVED-rel MS (6.1), (7.3)-(7.5), (7.13)]

The manuscript's probe I_eta(X,Y,Z) has the triple Mellin transform

  Phi(x,w,z) = sum_H q_H^(-z) c_H(x,w),   H = u a^6,
  sum over a:  F_{eta,u}(x,w,z) = zeta_F(6z) L(w, chi_u) / L(x, eta chi_u) * H_{eta,u}(x,w,z).

This is the series of the idea with sextic rows: numerator L(w, chi_u), reciprocal L(x, eta chi_u), row variable
z. The reciprocal variable is x; the target zeros sit in the coefficient u = 1. From MS (7.8), (7.16) at H = 1:

  c_1(x,w) = prod_p [ 1/(1 - Q^(-w)) - eta(p) Q^(-x) ]
           = zeta(w) L(x+w, eta) / ( L(x, eta) L(2x+2w, eta^2) ) * E(x,w),

E absolutely convergent and nonvanishing for 2x + w > 1, x >= 1/2, w >= 1/2 once the excluded set S contains
the small primes [PROVED-rel MS table (7.16); the factorisation is elementary]. So c_1 has a pole at every zero
of L(x, eta) with real part >= 1/2, for generic w.

The same Phi has the original ("low") representation: sum over the Gauss modulus s (sextic Gauss sums
g(s, -m)), the row m, and the completed cubic theta row T_{m,s,eta}(t) in the index A = c n^3.

### 2.2 Coordinates and reflections [MODEL built from MS Prop. 5.1, (6.1), section 7.1]

Low Dirichlet variables: t (exponent of q_A, centre 0, absolute for t > 1/2); v (exponent of q_m, centre 1/2);
sigma_s (exponent of q_s for normalised Gauss sums, centre 1/2). Matching the weight
X^(1/2-z) Z^(x+z-1) Y^(w-1) of MS (7.5):

  t = x + z - 1,   v = 1 - z,   sigma_s = w + z - 1/2.

Centred: T = t, S = sigma_s - 1/2, V = v - 1/2, and X := x - 1/2 = T + V, W := w - 1/2 = S + V, z - 1/2 = -V.

| name | source | map (centred, linear) |
|---|---|---|
| K6 | functional equation of the sextic Kubota series in s at index m (conductor q_m) [CLASSICAL form, MODEL here] | S -> -S, V -> V + S |
| Theta3 | completed cubic reflection, MS Prop. 5.1: V(q_A/X) <-> V#(q_mu X / q_c^2), c = c_F r, r = active primes of m [PROVED-rel MS] | T -> -T, V -> V + 2T |
| Pm | Poisson summation in m modulo s b* A, MS section 7.1 [PROVED-rel MS] | V -> -V, T -> T + V, S -> S + V |

Absolute regions: R_+ = {T, S, V > 1/2} (low series), Pm(R_+) = {x > 1, w > 1, z > 1} (high series).

### 2.3 The group [PROVED-model, `hull.log` Part 2]

<K6, Theta3, Pm> is finite of order 48, Coxeter type B3 (orders: K6 Pm = 3, Theta3 Pm = 4, K6 Theta3 = 2). So
the reflection of the Moebius variable does give a finite reflection group in three variables, and the formal
hull of the 48 images of R_+ is R^3 (the 144 ray images sum to 0). Taken at face value this would make Phi
meromorphic on C^3 with finitely many polar hyperplanes, and by Theorem T the coefficient c_1(x,w) would be
holomorphic for all x: false. So the formal hull is not a holomorphy domain; the next two facts say where it
breaks.

**Fact A [PROVED-model; uses only the exponent 2 in MS Prop. 5.1].** X o Theta3 = X. The theta reflection fixes
x = t + v: the dual length q_m^2 / X shifts v by exactly 2t.

**Fact B [PROVED-model].** The orbit of the functional X under the 48 elements has six members:
T, T+V, T+S+V (24 elements) and their negatives (24 elements). Every element with a negative member contains
the word Pm Theta3 (shortest: Pm Theta3, Pm Theta3 K6, Theta3 Pm Theta3, Pm Theta3 Pm). The subgroup
<K6, Pm> (order 6) and the cosets Theta3 {e, K6} have X o g in {T, T+V, T+S+V}.

### 2.4 Which images are regions of holomorphy [ARGUED]

* <K6, Pm> R_+ (6 images): K6 keeps the Gauss-sum shape of the s-sum, so Poisson in m still applies; these are the
  images of the quadratic-type family structure (numerator reflection w -> 1 - w included, as Pm K6 Pm).
* Theta3 R_+ and Theta3 K6 R_+: MS Prop. 5.1 at fixed m; K6 and Theta3 act on different sums and commute.
* Pm after Theta3 is not available: after the reflection the m-dependence is the scalar zeta of MS (5.3), a
  product over the primes of m of Gauss sums omega_{p,j} with pair phases chi_p(sigma_p)^(-2), together with
  characters B_p of the dual index mu. The m-coefficients are no longer periodic modulo s b* A, so the Poisson
  step of MS 7.1 does not apply. Whatever functional equation that m-series has, Corollary T2 forbids its
  image from joining the high region across 0 < x < 1.
* Theta3 after Pm is not available: after Poisson the A-sum has coefficient gamma_2(c) times the Gauss sum
  produced by Poisson; by MS (4.7), gamma_2(c) = mu(c) alpha(c) G(c) / gamma_1(c), the two Gauss sums cancel and
  the A-sum is the Moebius sum sum_c mu(c) eta(c) chi_c(H) q_c^(-x) = 1/L(x, eta chi_H). There is no theta row
  left to reflect. This is the absorption identity read in the other direction.

So the legitimate set is the 8 images above, and on each X o g is one of T, T+V, T+S+V, all > 1/2 on R_+.

### 2.5 Exact LP [PROVED-model, `hull.log` Part 2]

Minimal x on the closed hull of the 8 legitimate images, with the chart where x is the Moebius variable started
at x > theta (input ZF(theta) for the row family, with the standard bound for 1/L to the right of theta):

| input theta | 1 | 7/8 | 0.874886647 | 13/15 | 5/6 | 1/2 |
|---|---|---|---|---|---|---|
| hull x_min | 1 | 7/8 | 0.874886647 | 13/15 | 5/6 | 1/2 |

Output = input in every row (exact rationals, dual certificate verified). With no input the value is 1: trivial.
Slices with no input: at w = 1, x_min = 1; at the principal residue point (w, z) = (1, 1/6), x_min = 7/5.
Full formal group: min x = -infinity (excluded by section 2.3).

**Result of the first test.** Hull value 1 (trivial) from absolute regions; theta from ZF(theta). Not below
0.874886647, and 7/8 is reproduced only when it is put in. Comparison with 13/15 and 5/6: those are floors of
the estimate system; the hull has no floor of its own and no gain of its own. By the task's criterion the idea
is closed.

### 2.6 Why, and how this sits beside the 7/8 method [ARGUED]

A bound I(X,Y,Z) << X^a Y^b Z^c is holomorphy of the triple Mellin transform on a half-space tube, and the set
of valid exponent triples is convex (geometric means of bounds). So a base defined by power bounds is already
convex: Bochner's theorem on it is the interpolation that the exponent LPs of Z15 already perform. The only
possible extra is from functional-equation images of the estimate region, and by Facts A and B no available
image changes x. The 7/8 theorem does not come from a tube that contains x = rho for the whole u-sum: the
manuscript moves contours term by term in u and compares one residue with an L^2 estimate. Theorem T shows this
cannot be replaced by holomorphy of the full series, since the full series is singular wherever any row twist
has a zero.

Other dual exponents [PROVED-model, Part 3]: with T -> -T, V -> V + aT the group is finite only for a = 1
(order 24, type A3) and a = 2 (order 48); a = 3, 4 (quartic, cubic rows) give more than 2000 elements. X is
fixed by the reflection only at a = 2. For a = 1, X o Theta = V, still a nonnegative member; the Pm Theta
obstruction is the same.

---

## 3. First lemma: the quadratic row A(s,w,z) [PROVED-model; analytic reading CLASSICAL/MODEL]

Maps (uncentred): alpha: (s,w,z) -> (s+w-1/2, 1-w, z); beta: (s,w,z) -> (1-s, w+s-1/2, z+s-1/2) (conductor nm
of the d-sum); gamma: (s,w,z) -> (s-z+1/2, w, 1-z) (functional equation of 1/L(z,chi_d); it maps Re z > 1 to
Re z < 0).

Group facts (`hull.log` Part 1): <alpha, beta> has order 6 (S3). <alpha, gamma> has order 4. beta gamma has
infinite order, so <alpha, beta, gamma> is infinite. The "12 elements" are therefore the 6 elements of
<alpha, beta> and their composites with gamma (two chambers), not a group of order 12. The group of order 12
(dihedral) belongs to the two-variable series with the swap s <-> w (section 3.2).

**Lemma 1.** Put F1 = z, F2 = z+s-1/2, F3 = z+s+w-1. Every element of <alpha, beta> permutes {F1, F2, F3}
(all 6 listed in the log). On R(theta) = {Re s > 1, Re w > 1, Re z > theta}: F1 > theta, F2 > theta + 1/2,
F3 > theta + 1. Hence every image g R(theta) lies in the convex set C_theta = {F1, F2, F3 > theta}, and so does
the hull. At s = 1, F3 = w + z: the hull lies in Re(w+z) > theta. With theta = 1: Re(w+z) > 1. QED

Exact LP on the 6 images, slice s = 1: min Re(w+z) = 1, 7/8, 1/2 for theta = 1, 7/8, 1/2, attained on the closed
hull. So the bound is sharp and output = input. The 6 composites with gamma all have F3 unbounded below; by
Corollary T2 they are not connected to the first chamber.

Consistency: the polar hyperplane w + z = rho at s = 1 is the trace of F3 = rho, the image of the coefficient
singularity z = rho under beta alpha. The residue carries no information that the d = 1 coefficient does not
already carry.

### 3.2 Two-variable variant Z(s,w) = sum_d L(s,chi_d) d^(-w)

* All d with correction factors: <alpha, swap> is dihedral of order 12 [PROVED-model; CLASSICAL
  Diaconu-Goldfeld-Hoffstein, recalled]; the hull of the 12 images is R^2; no zero of zeta is a polar divisor,
  so there is nothing to conclude.
* Fundamental discriminants: the sieve sum_a mu(a) a^(-2w) puts zeros into the polar set through 2w = rho and its
  alpha-image 2w + 2s - 1 = rho [ARGUED; residue nonvanishing not checked]. The chamber of the absolute region
  is {Re w > Theta/2, Re(s+w) > (1+Theta)/2}, an intersection of half-planes.
* **No non-circular second chamber [PROVED from T2 given the polar divisor].** Every component of the
  complement of the forbidden slabs is convex, so Bochner's theorem gives nothing inside one. Two components
  cannot lie in one connected holomorphy tube, because the line Re(2w) = 1/2 carries zeros unconditionally.
  A region reaching into a slab to depth theta is known only with ZF(theta) as input.

---

## 4. Controls

| control | outcome | step |
|---|---|---|
| DH | Not formulable past the first step. Twisting commutes with Dirichlet inversion, so the coefficient d = 1 is 1/f(z) and Corollary T1 confines the tube to Re z > 1.12 (sup of DH zeros). The residue at s = 1 is zeta(2w) sum_m b(m) sf(m)^(-w) m^(-z) with b the non-multiplicative inverse coefficients: it has no factor 1/f(w+z). The step that uses the Euler product is the evaluation of the diagonal nm = square (quadratic), and the scalar Euler identity MS (7.13) (sextic). | residue identity |
| sign twist (Euler product, no functional equation) | Identical to zeta: <alpha, beta> and <K6, Pm, Theta3 in its chart> never use a reflection of the reciprocal variable. The argument does not separate zeta from the twist, in agreement with output = input. | none (no z-reflection is used for zeta either) |
| E_a = zeta(s+a) zeta(s-a) | Coefficient d = 1 is singular up to Re z = Theta + a; Lemma 1 gives C_{Theta+a}; LP output shifts by a. | shift verified by the theta-parametrised LP |
| backward heat | Not applicable: no ordinary Dirichlet series in the family variable. | not formulable |
| family supremum | Corollary T1: the tube cannot pass the supremum of the real parts of zeros of the family, target included. | Theorem T |

Height uniformity (Q2): a tube statement is uniform in height by construction. The price is that its base must
avoid the real part of every zero of every coefficient, which is the conclusion.
Multiplicativity (Q3): it enters at the residue identity and at the cancellation gamma_2 gamma_1 -> mu; the hull
computation is blind to it.

---

## 5. Pivot

None taken. The strongest adjacent statement found is negative and is recorded as Corollary T2: any proposed
reflection of the reciprocal variable (in particular Poisson in m applied to the theta-dual of MS Prop. 5.1)
cannot have an image joined to the high region by a tube with polynomial growth. A positive use would need the
m-series of the theta-dual explicitly; its coefficients are products of sextic and quadratic Gauss sums at the
primes of m (MS (5.3)), a Kubota-type series whose functional equation was not derived here [OPEN].

---

## 6. Three weakest steps

1. **The sextic group is a model.** K6 and Pm are entered through conductor exponents (q_m; q_s q_A) and Theta3
   through the dual length of MS Prop. 5.1, for rows m of squarefree type; cusps, gamma factors, non-squarefree
   indices and the finite families of terms are ignored. The classification of the 8 legitimate images
   (section 2.4) is argued from the shape of the coefficients, not proved; in particular "K6 then Pm" is taken to
   be valid without checking the dual sextic series.
2. **Hypotheses of Theorem T in use.** Polynomial vertical growth on a Bochner hull is asserted by the
   range-preservation argument and not written out. The pole of the norm-1 coefficient assumes the unit rows do
   not cancel it and that E(x,w) and zeta(w) L(x+w, eta) do not vanish at the point used (generic w).
3. **Estimate-supplied bases were not computed.** Section 2.6 argues that power bounds give convex bases and
   that available images fix x, but the manuscript's actual low-estimate region and its K6 images were not put
   through the LP. The statement "Bochner adds nothing to the 7/8 method" is ARGUED, not PROVED. The polar set of
   the fundamental-discriminant series in section 3.2 is also argued only.

## 7. Verdict

Precise obstruction. PROVED: Theorem T and Corollaries T1, T2; Lemma 1 (hull of the 6 images lies in
Re(w+z) > 1 at s = 1, sharp). PROVED-model: the sextic reflection group has order 48, the theta reflection fixes
x, and the exact LP over the legitimate images returns the input abscissa (1 with no input). No hull value
below 0.874886647. No abscissa below 0.874886647 is proved. 7/8 (unrefereed) stands; RH open.
