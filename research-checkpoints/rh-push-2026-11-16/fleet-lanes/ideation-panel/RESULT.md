# ideation-panel: twelve attack angles on the missing Euler-product input (2026-11-16)

Scope: `tmp/research-2026-11-16/push/ideation-panel/` only. Nothing committed, pushed or posted. This is an ideation
note, not an attack. No RH claim, no zero-free region, no Lambda bound. NO QED.

Labels: PROVED (argument written here, same-agent check only), CLASSICAL (standard, recalled), LITERATURE (recalled,
not re-read for this note), MEASURED (scripts here, mpmath/numpy, not interval-certified), ARGUED, OPEN.

Files: `a1_abel_liouville.py` / `a1.log`, `a2_heegner_cs.py` / `a2.log`, `a3_leeyang_gonek.py` / `a3.log`.

**Verdict.** Twelve angles are listed and ranked. None is in the atlas (PR #27), the three 2026-11-01 syntheses, the
fifty-routes list, or a sibling slug of this push (checked against the 58 sibling directories present at 13:40; overlaps
are flagged per angle). The top three got a first hour of work. Each of the three stops at a named point:

* Angle 1 gives a sign target with a measured reserve of 4.6e-9 relative size. One direction is proved. The target
  is RH plus simple zeros plus a mild bound, so it is not weaker than RH.
* Angle 2 gives a measured fact: the first 30 zeros of zeta(s)L(s,chi_{-163}) agree to within 1e-3 (the first 12 to
  1e-10) with zeros of a function whose zeros are proved to be on the line. The split is Euler-blind and its horizon
  is t ~ pi*sqrt(163) = 40.1.
* Angle 3 confirms a known wall: the step that puts zeros on the line (Hermite-Biehler) holds only for prime cutoffs
  P far below what the approximation step needs.

No angle supplies the missing input. Lead strength of the list as a whole: low.

---

## 0. Reading done, and a control battery used below

Read: BRIEF.md; atlas `refs/pr/27:research/rh/modules/historical-routes.md` (sections 1-12); the three
`rh-attempts/2026-11-01-*synthesis.md`; `zf-campaign-synthesis.md`; `sextic-theta-synthesis.md`;
`eq48/RESULT.md`; `pick/NEXT_STAGE.md`; `euler/RESULT.md`; `fifty-routes-2026-10-06.md`; the memory index;
`src/data/rh-landscape-dag.js` (node list only); the heads of 12 sibling RESULT.md files.

### 0.1 Three twins, not one (PROVED, elementary; the facts are folklore)

The brief's control is Davenport-Heilbronn (DH). DH tests one axiom. Two more twins test the other two.

| twin | Euler product | Lambda >= 0 / Ramanujan | functional equation | off-line zeros |
|---|---|---|---|---|
| T-DH: Davenport-Heilbronn | no | n/a | yes | yes |
| T-NR: F_c(s) = xi(s)(2cosh((s-1/2)log q) + c), 2 < abs(c) < q^{1/2}+q^{-1/2} | yes | no | yes | yes |
| T-B: Beurling system of Diamond-Montgomery-Vorhauer type (LITERATURE; sibling `sym-power-positivity` Thm B) | yes | yes | no | yes |

T-NR in detail. Put D(s) = 1 + c q^{1/2} q^{-s} + q^{1-2s} = (1 - alpha q^{-s})(1 - beta q^{-s}), alpha*beta = q,
alpha + beta = -c q^{1/2}. Then q^{s-1/2}D(s) = 2cosh((s-1/2)log q) + c is symmetric under s -> 1-s, so
zeta(s)D(s) has an Euler product (the factor at q is changed), a pole at 1, the gamma factor of zeta and a functional
equation of conductor q^2. For abs(c) > 2 the roots alpha, beta are real with abs(alpha) > q^{1/2} > abs(beta), and
the zeros of the cosh factor sit at Re s = 1/2 +- log_q(abs(alpha)/q^{1/2}), heights pi*k/log q. Its von Mangoldt
coefficients are Lambda_F(q^k) = (1 - alpha^k - beta^k) log q, negative at k = 2. So T-NR fails exactly
"Lambda >= 0" (equivalently the local Ramanujan bound abs(alpha) <= q^{1/2}).

Consequence used below: an argument that uses multiplicativity but neither Lambda >= 0 nor a local Ramanujan bound
is true for T-NR and so is wrong. An argument must fail on all three twins. Also, for test functions of support
below log q the Weil functional of F_c equals that of zeta plus 2 log q * (g*g~)(0) >= 0 (the factor contributes a
density term and prime-power terms at k log q only). So every certificate for zeta at support below log q also holds
for an Euler-product function with off-line zeros at height pi/log q.

### 0.2 Walls (from the brief) as they apply to the list

Each angle below states: the step where the Euler product is used, why DH fails there, which other twin it must
also exclude, and its expected stop against flow-blindness, MV-CAP and verified height.

---

## 1. Ranked list

Scores: P = plausibility (0-10) that the angle yields a new provable statement bearing on the missing input (not
that it proves RH), N = novelty against atlas + syntheses + fifty routes + sibling slugs. Rank by P*N.

| # | angle | P | N | P*N |
|---|---|---|---|---|
| 1 | Abel-summed Liouville sign with the prime-square reserve | 3 | 5 | 15 |
| 2 | Chowla-Selberg split at a class-number-one Heegner point | 2 | 6 | 12 |
| 3 | Finite Euler products as Lee-Yang / Hermite-Biehler structure functions | 2 | 5 | 10 |
| 4 | Level-one rigidity (Hamburger) as the Euler input | 1.5 | 6 | 9 |
| 5 | Class-group homotopy between two Euler points | 2 | 4 | 8 |
| 6 | Crystalline-measure classification with exponential dual growth | 1.5 | 5 | 7.5 |
| 7 | Strong recurrence (Bagchi) as a positive-density target | 1.5 | 5 | 7.5 |
| 8 | Imaginary powers zeta^{i kappa} and monodromy | 1 | 6 | 6 |
| 9 | Zeros as Satake parameters of Zagier's module | 1 | 5 | 5 |
| 10 | Bohr lift: rank one on the l^2 polydisc | 1 | 4 | 4 |
| 11 | Deligne-Rankin even moments past the diagonal in a conductor family | 1 | 4 | 4 |
| 12 | Riesz / Hardy-Littlewood entire function and Bernoulli arithmetic | 0.5 | 5 | 2.5 |

### Angle 1. Abel-summed Liouville sign with the prime-square reserve

* Object. L(q) = sum_{n>=1} lambda(n) q^n on 0 < q < 1 (lambda = Liouville). Target: L(q) < 0 for all q close to 1.
* Euler step. lambda is completely multiplicative, so sum lambda(n) n^{-s} = zeta(2s)/zeta(s). The pole of
  zeta(2s) at s = 1/2 comes from the p^2 terms of the Euler product and gives a main term exactly at the critical
  exponent. That is what turns an RH-type growth statement into a sign statement.
* Why DH fails. DH has no Dirichlet inverse with bounded coefficients; f(2s)/f(s) has poles at the DH zeros with
  Re s > 1, so the Abel sums of its coefficients change sign with amplitude x^beta, beta > 1. T-NR fails too: its
  inverse has poles at the off-line zeros of the cosh factor.
* Walls. Not a flow statement. It is an every-scale statement, so MV-CAP applies. Verified height shows up as:
  a zero at height gamma can flip the sign only for log x > pi*gamma/(2(beta-1/2)).
* Expected stop. Square-root cancellation in a smoothed Moebius sum (atlas closing item 1 in Moebius form).
* Work done: section 2.

### Angle 2. Chowla-Selberg split at a class-number-one Heegner point

* Object. For K = Q(sqrt(-163)), the completed zeta_K equals the Eisenstein series E*(z,s) at z = (1+sqrt(-163))/2.
  Its constant term a_0(y,s) = y^s xi*(2s) + y^{1-s} xi*(2s-1), y = sqrt(163)/2, has all zeros on Re s = 1/2
  (Lagarias-Suzuki 2006, Ki 2005; LITERATURE). The rest is a K-Bessel series of size e^{-2 pi y} at low height.
* Euler step. h(-163) = 1 makes one Epstein zeta equal to zeta(s)L(s,chi_{-163}). For h > 1 a single Epstein zeta
  is a DH-type function.
* Why DH fails. It does not fail inside the split: the split holds for every z. The Euler product is used only in
  identifying the point z. This is the weakness; see section 3.
* Walls. A statement about zeros below a horizon is a verified-height statement.
* Expected stop. Horizon t ~ 2 pi y; no Heegner point of class number one has larger y.
* Work done: section 3.

### Angle 3. Finite Euler products as Lee-Yang / Hermite-Biehler structure functions

* Object. E_P(s) = gamma(s) zeta_P(s), zeta_P = prod_{p<=P}(1-p^{-s})^{-1}, and A_P = E_P(s) + E_P(1-s).
  On the prime torus z_p = p^{-it}, A_P is the restriction of W(z,w) = Q(z) + w^2 Q~(z), Q(z) = prod(1 - p^{-1/2}z_p),
  which is a Lee-Yang polynomial in (z,w) (Lemma 3.1 below). Kurasov-Sarnak and Olevskii-Ulanovskii (LITERATURE)
  attach real-rooted exponential polynomials to such W. Gonek's finite-Euler-product model (LITERATURE) is this object
  with the nonlinear phase w = e^{-i theta(t)}.
* Euler step. Q is a product of one-variable factors with no zero in the closed polydisc. That is the Euler product
  together with p^{-1/2} < 1 (local Ramanujan).
* Why DH fails. The Bohr lift of DH is a sum of two such products and vanishes inside the polydisc (DH has zeros
  with Re s > 1). T-NR fails because its factor at q has a zero inside the disc.
* Walls. A_P at fixed P is a model, not xi. The passage P -> infinity at fixed height is the content.
* Expected stop. zeta_P approximates zeta near the line only for P below about (log t)^2 unconditionally in the
  Hermite-Biehler window, and the approximation near the line is RH-strength (Gonek).
* Work done: section 4.

### Angle 4. Level-one rigidity (Hamburger) as the Euler input

* Idea. Hamburger's theorem (CLASSICAL): an ordinary Dirichlet series with the functional equation of zeta
  (conductor 1) is a multiple of zeta. Kaczorowski-Perelli (LITERATURE): degree-1 extended Selberg class elements are
  Dirichlet-polynomial combinations of Dirichlet L-functions. So every twin of section 0.1 lives at conductor > 1.
  At conductor 1 the Euler product is a consequence of two facts: integer frequencies (theta(tau+2) = theta(tau))
  and inversion. An argument that uses both, on the upper half-plane and not only on the imaginary axis, excludes
  all twins by a theorem instead of by a hand check.
* Euler step. dim M_{1/2}(Gamma_theta) = 1, so theta is a Hecke eigenform.
* Why DH fails. DH corresponds to a non-eigen vector in a 2-dimensional space at level 5. T-NR is an oldform
  combination theta(tau) + c_1 theta(q^2 tau) + c_2 theta(q^4 tau).
* Walls. The heat deformation e^{t u^2}Phi is not modular, so flow-blindness does not apply formally.
* First test. Find one inequality for xi that uses the translation tau -> tau + 2 (for example through a
  Rankin-Selberg integral of abs(theta)^2 y^{1/2} over Gamma_theta\H). First computation (ARGUED, not written out):
  the unfolding gives zeta(2s-1), whose critical line is Re s = 3/4, not the unitary axis Re s = 1/2 of the
  spectral expansion. So the zeros are non-tempered data in that expansion.
* Expected stop. The Mellin transform reads theta only on one geodesic. Two-dimensional information enters through
  Hecke operators or periods, which leads back to Angle 2 or to atlas-type equivariant dictionaries (round 2,
  Theorem 4.13: exactly equivariant structure sees only poles).

### Angle 5. Class-group homotopy between two Euler points

* Idea. For D = -20 the two reduced forms Q_1 = x^2+5y^2, Q_2 = 2x^2+2xy+3y^2 give
  Z_1 + Z_2 = 2 zeta(s)L(s,chi_{-20}) and Z_1 - Z_2 = 2 L(s,chi_5)L(s,chi_{-4}) (genus theory, CLASSICAL).
  F_phi = cos(phi)(Z_1+Z_2) + sin(phi)(Z_1-Z_2) has one functional equation for all phi, is real on the line, is an
  Euler product at phi = 0 and phi = pi/2, and is a single Epstein zeta (DH-type, off-line zeros) at phi = pi/4.
  Zeros leave and rejoin the line only by collisions. This is a compact, arithmetic, one-parameter analogue of the
  de Bruijn-Newman deformation with Euler products at both ends.
* Euler step. The trivial and genus characters of the class group are the two isotypic projections with Euler
  products. The Euler product is the statement phi in {0, pi/2}.
* Why DH fails. DH is an interior point of such a segment.
* First test. Track collision angles phi_c(gamma) for the first 200 zeros; fit phi_c against gamma. A monotone
  quantity along phi would be new. Overlap check: `dh-separator` and `b-euler-detector` separate zeta from DH with
  test functionals, and round-3 theta collision uses the Epstein kernel of Q_2 for a heat-flow collision. None
  tracks the phi-family.
* Expected stop. phi_c(gamma) -> 0 as gamma grows (Bombieri-Hejhal type results give 100 per cent of zeros on the
  line for such combinations, with off-line zeros at every height scale), so the Euler points are limits of
  non-Euler points with all zeros real below any fixed height: verified-height wall in the phi variable.

### Angle 6. Crystalline-measure classification with exponential dual growth

* Idea. Olevskii-Ulanovskii and Kurasov-Sarnak (LITERATURE): a Fourier quasicrystal with positive integer masses is
  the zero set of a real-rooted exponential polynomial. Under RH the zero measure of xi satisfies a summation formula
  with dual support {+- log p^k} and dual masses of size e^{u/2}, outside the tempered class of those theorems.
  Target: a classification theorem for positive-integer-mass measures in a strip whose dual is supported on the
  semigroup generated by a Q-linearly independent set, with dual masses supported on the coordinate axes
  (prime powers) and bounded by e^{u/2}.
* Euler step. Dual masses vanish off the coordinate axes of the lattice Z^{(primes)}. For a general Lee-Yang
  polynomial they fill the cone.
* Why DH fails. Lambda_DH(n) is nonzero off prime powers and grows like n^{sigma*} with sigma* > 1.
* Walls. Sibling `support-rigidity` shows vanishing of Lambda off prime powers alone gives only Cramer-type
  information. This angle adds integrality and positivity of the zero-side masses; that part is not covered there.
* Expected stop. The archimedean term is absolutely continuous, so the measure is not crystalline. Planted-zero
  twins (entire, zeros moved, no Dirichlet series) satisfy a formula with the same support only approximately; the
  classification would have to use exact support.

### Angle 7. Strong recurrence (Bagchi) as a positive-density target

* Idea. Bagchi (LITERATURE): RH holds iff for every compact K in 1/2 < Re s < 1 and every eps > 0 the set of tau with
  max_K abs(zeta(s+i tau) - zeta(s)) < eps has positive lower density. This is a positive-density statement, so
  MV-CAP ("mean values cannot certify every-window statements") is not an obstruction in principle.
* Euler step. Two places: Kronecker's theorem on the independent frequencies log p, and the density theorem
  N(sigma,T) = o(T), whose proof uses a mollifier with bounded coefficients mu(n).
* Why DH fails. DH is strongly recurrent (joint universality of L(chi), L(chi-bar)) and has >> T zeros in the strip.
  The equivalence with RH breaks at the density theorem. T-NR: recurrence fails near the real zeros of the factor.
* First test. On the Bohr set where p^{i tau} is near 1 for p <= y, zeta(s+i tau) is near zeta_y(s) times a factor
  of bounded variance (ARGUED). zeta_y does not converge to zeta in the strip, so the Bohr set must be centred at a
  twisted point; such a point exists iff log zeta is analytic on K (Bagchi's denseness lemma).
* Expected stop. Circular at the denseness lemma: the centre of the Bohr set exists iff zeta has no zero on K.

### Angle 8. Imaginary powers zeta^{i kappa} and monodromy

* Idea. For real kappa, zeta(s)^{i kappa} has multiplicative coefficients d_{i kappa}(n) with
  abs(d_{i kappa}(p)) = kappa, and sum abs(d_{i kappa}(n))^2 n^{-2 sigma} converges for sigma > 1/2. Near a zero the
  modulus exp(-kappa arg zeta) stays bounded, and the monodromy is multiplication by e^{-2 pi kappa}. RH holds iff
  zeta^{i kappa} is single-valued on Re s > 1/2 minus the cut from the pole.
* Euler step. Complex powers with coefficient bounds exist only for Euler products.
* Why DH fails. No power of DH has multiplicative coefficients; its zeros in Re s > 1 already give monodromy there.
* Expected stop (ARGUED). Mean-square statements for zeta^{i kappa} hold unconditionally because zeros to the right
  of sigma have density o(T) and the modulus is at most T^{O(kappa)}. So mean values cannot see the monodromy:
  MV-CAP. A pointwise single-valuedness statement is RH.

### Angle 9. Zeros as Satake parameters of Zagier's module

* Idea. Zagier 1981 (LITERATURE): each zero rho gives a (g,K)-module V_rho of automorphic functions with Casimir
  eigenvalue rho(1-rho); unitarity would give RH. Add the Hecke algebra: T_p acts on V_rho by
  p^{rho-1/2} + p^{1/2-rho}, which is real (and equals 2cos(gamma log p), in [-2,2]) iff rho is on the line. So RH
  is temperedness at every p of the Hecke module of zeros, and an off-line quartet gives a Hermitian pairing between
  V_rho and V_{1-conj(rho)} of indefinite signature.
* Euler step. V_rho is a Hecke eigenmodule.
* Why DH fails. The level-5 analogue built from a combination of two Eisenstein series is not a Hecke eigenmodule.
* Expected stop. Positivity of the invariant form on the zero module is the Weil form in automorphic coordinates.
  Round-2 modular tower Theorem 4.13 (Hecke-equivariant dictionaries see only poles) applies unless the form is
  defined without reference to the zeros.

### Angle 10. Bohr lift: rank one on the l^2 polydisc

* Idea. For Re s > 1/2 the point z(s) = (p^{-s})_p is in l^2. zeta(s) = N(z(s)) exp(P(s)), where
  N(z) = prod (1-z_p)^{-1}e^{-z_p} is analytic and zero-free on the l^2 polydisc and P(s) = sum_p p^{-s}.
  So the zeros of zeta in the strip are exactly the logarithmic singularities of the continuation of the linear
  functional z -> sum z_p along the curve z(s) (CLASSICAL).
* Euler step. The Bohr lift of zeta is a rank-one tensor (a product of one-variable functions).
* Why DH fails. The Bohr lift of DH has rank two and vanishes inside the l^1 polydisc.
* Expected stop. Continuation of the prime zeta function along one curve is a pointwise statement at one torus
  point (the identity), while the Hardy-space theory of Dirichlet series (Hedenmalm-Lindqvist-Seip, Nikolski)
  controls almost every torus point. Sibling `nyman-baez-duarte` covers the cyclicity form.

### Angle 11. Deligne-Rankin even moments past the diagonal in a conductor family

* Idea. Deligne's Weil I bounds Frobenius eigenvalues by positivity of even tensor powers in a family, with an
  a priori bound that does not degrade with the power k. Number-field form: for characters mod q,
  sum_chi abs(sum_{n<=x} Lambda(n)chi(n)n^{-1/2})^{2k} is a count of congruences among prime k-tuples. For x^k < q it
  is diagonal and gives sup_chi <= x^{1/2}(log q / log x)^{1/2} log x (PROVED by the diagonal count, a few lines),
  which is the trivial bound.
* Euler step. Positivity of Lambda and orthogonality of characters. The analogue of the Kuenneth step would be a
  pointwise square of the prime-side distribution, which is delta^2 and does not exist.
* Why DH fails. DH is not a member of a character family.
* Expected stop. For x^k > q the off-diagonal terms are prime k-tuple correlations in residue classes.
  Sibling `ff-transplant` treats the function-field side; this angle is the family-moment form only.

### Angle 12. Riesz / Hardy-Littlewood entire function and Bernoulli arithmetic

* Idea. Riesz 1916 (LITERATURE): RH iff R(x) = sum_{k>=1} (-1)^{k+1} x^k / ((k-1)! zeta(2k)) << x^{1/4+eps}.
  The Taylor coefficients are rational multiples of pi^{-2k}/B_{2k}, so von Staudt-Clausen and Kummer congruences
  describe them p-adically. Target: use the p-adic structure of 1/B_{2k} to control growth on the positive axis.
* Euler step. 1/zeta(2k) = sum mu(n) n^{-2k}, and the Euler factor at p is what is removed in Kummer's congruences.
* Why DH fails. DH values at integers are combinations of two generalized Bernoulli numbers with an irrational
  coefficient; the Dirichlet inverse is unbounded.
* Expected stop. No known mechanism turns p-adic congruences of Taylor coefficients into archimedean growth on a ray.

---

## 2. Angle 1: first hour

Notation. M(q) = sum mu(n) q^n, L(q) = sum lambda(n) q^n, vartheta(u) = sum_{k in Z} e^{-k^2 u},
c = sqrt(pi)/(2 zeta(1/2)) = -0.6068573898.

**Lemma 1.1 (PROVED).** For 0 < q < 1: L(q) = sum_{k>=1} M(q^{k^2}), and
L(e^{-y}) = (1/2) sum_{m>=1} mu(m) (vartheta(my) - 1).
Proof. lambda = mu * 1_square, and all double series converge absolutely. Checked numerically to 1e-13 (`a1.log`).

**Proposition 1.2 (PROVED; Landau's theorem for one-signed Mellin integrals plus a standard boundary lemma).**
Suppose L(e^{-y}) <= 0 for 0 < y < y_0. Then
(i) zeta(s) != 0 for Re s > 1/2;
(ii) every zero on the line is simple;
(iii) abs(Gamma(rho) zeta(2 rho) / zeta'(rho)) <= abs(c) for every zero rho.
Proof. For Re s > 1, int_0^infty L(e^{-y}) y^{s-1} dy = G(s) := Gamma(s) zeta(2s)/zeta(s). The part over
(y_0, infinity) is entire. G is analytic at every real s > 1/2 (zeta has no zero on (1/2,1), and G(1) = 0) and has a
simple pole at s = 1/2 with residue c. By Landau the integral over (0,y_0) converges for Re s > 1/2, so G is analytic
there; Gamma(s)zeta(2s) has no zero in Re s > 1/2, which gives (i). For f = -L(e^{-y}) >= 0 one has
abs(F(sigma+it)) <= F(sigma) ~ abs(c)/(sigma-1/2), so each boundary singularity is at most a simple pole with residue
of modulus at most abs(c). That gives (ii) and (iii).

**Statement 1.3 (ARGUED, standard contour shift; needs Titchmarsh 9.7 for the horizontal lines).** If RH holds, all
zeros are simple, and the bracketed sum S = sum_rho abs(Gamma(rho)zeta(2rho)/zeta'(rho)) is below abs(c), then
L(e^{-y}) = c y^{-1/2} + 1 + sum_rho Gamma(rho)zeta(2rho)/zeta'(rho) y^{-rho} + O(y^2) and L(e^{-y}) < 0 for small y.

So the target "L(q) < 0 near q = 1" is equivalent to RH + simple zeros + (S-type bound). It is stronger than RH.
The same genre is classical (Hardy-Littlewood 1916/1918 on Abel-summed Moebius and Chebyshev-bias sums; LITERATURE).
What is recorded here for the program is the size of the reserve.

**Measurements (`a1.log`, MEASURED).**

| x = 1/y | L/sqrt(x) | L - c sqrt(x) | M(e^{-1/x}) |
|---|---|---|---|
| 10 | -0.291456 | 0.997387 | -1.170489 |
| 1e3 | -0.575235 | 1.000000 | -1.988111 |
| 1e5 | -0.603695 | 0.999999 | -1.999880 |
| 3e5 | -0.605032 | 1.000002 | -1.999959 |

* L(e^{-1/x}) has exactly one sign change for 0.2 <= x <= 3e5, between x = 2.49 and 2.61.
* Zero-term sizes abs(Gamma(rho)zeta(2rho)/zeta'(rho)) for the first three zeros: 1.40e-9, 8.4e-15, 8.5e-18.
  Relative reserve under RH: oscillation / main term = 4.6e-9.
* By contrast M(q) -> -2 is not a stable sign: the first-zero term 2*7.2e-10*x^{1/2} exceeds 2 for x > 1.9e18.
  (That M takes positive values near q = 1 is unconditional by the same Landau argument, CLASSICAL.)
* A zero at beta + i*gamma with gamma = 3e12 can flip the sign of L only for log x > 1.26e13 (beta = 0.874887),
  1.89e13 (beta = 0.75), 4.7e14 (beta = 0.51).

**Relation to eq48.** eq48's referee note: on finite exponential tests any margin theta < 1 is false. Here the truth
(under RH and simplicity) sits at relative distance 1 - 4.6e-9 from the boundary of the sign condition. The reserve
exists because the Abel kernel has Mellin transform Gamma(s), which damps a zero at height gamma by e^{-pi gamma/2}.

**Stop (ARGUED).** By Lemma 1.1 the sign condition is abs(M(e^{-u}) + 2) <= theta u^{-1/2} with theta of order
0.3, on all scales. The trivial bound is 1/u, and any bound u^{-a} with a < 1 is a zero-free half-plane. So the
reserve is a constant-factor reserve at the square-root exponent and gives no exponent. This is atlas closing item 1
in Moebius form.

## 3. Angle 2: first hour

Setup (CLASSICAL, Chowla-Selberg / Bateman-Grosswald). Q = x^2 + xy + 41y^2, k = sqrt(163)/2,
xi*(w) = pi^{-w/2}Gamma(w/2)zeta(w), and
Lambda(s) := (k/pi)^s Gamma(s) * 2 zeta(s)L(s,chi_{-163}) = main(s) + rem(s),
main(s) = 2[k^s xi*(2s) + k^{1-s} xi*(2s-1)],
rem(s) = 8 k^{1/2} sum_{n>=1} (-1)^n n^{s-1/2} sigma_{1-2s}(n) K_{s-1/2}(2 pi k n).

**Measurements (`a2.log`, MEASURED, 30 digits).**

* Identity: abs(Lambda - main - rem)/abs(Lambda) <= 1.7e-30 at four test points.
* abs(rem/main) on the line: 1.0e-17 (t = 1), 2.4e-12 (t = 10), 3.2e-7 (t = 20), 7.0e-3 (t = 30), 0.76 (t = 35),
  above 1 from t = 38. Predicted transition 2 pi k = 40.1.
* Zeros on the line up to t = 45: main has 52, Lambda has 52. Differences: 3.6e-18 at the first zero, below 1e-10
  through the 12th (which is zeta's first zero: main 14.134725141822, true 14.134725141735), below 1e-3 through the
  31st (t = 30.4), 0.1 to 0.3 for t between 38 and 45.
* Hermite-Biehler margin of the main term, log abs(E(s)/E(1-conj s)) with E = k^s xi*(2s): positive at every grid
  point (0.18 to 3.2), consistent with Lagarias-Suzuki.

**What this shows.** Below t ~ 30 the zeros of zeta(s)L(s,chi_{-163}) are perturbations of size at most 1e-3 of
zeros of a function proved to lie on the line, and the proof for that function uses only zeta(w) != 0 for
Re w > 1. A Rouche argument with an explicit bound on rem would certify these zeros on the line with no zero
computation (Stark 1967 proves the range abs(t) < 2k for Epstein zeta functions with large k; LITERATURE).

**Stop.** (a) The split holds for every point z in the upper half-plane, including points whose Epstein zeta has
no Euler product, so it is Euler-blind; the Euler product enters only through h(-163) = 1. (b) The horizon is
2 pi k = pi sqrt(D). 163 is the largest class-number-one discriminant. For h > 1 the Dedekind zeta is a sum over
classes, and the non-principal classes have small y; by equidistribution of Heegner points the average carries no
main term. (c) Orders of conductor f have principal forms with y = f k, but h(O_f) > 1, so a single form is again
DH-type. Verdict for this angle: a verified-height statement with horizon 40. Closed as a route; the measured
table is kept as a calibration of how a proved-on-the-line main term and a DH-blind remainder trade off.

## 4. Angle 3: first hour

**Lemma 3.1 (PROVED).** Let Q be a polynomial in z = (z_1..z_k) with no zero in the closed unit polydisc, of
multidegree d, and Q~(z) = z^d conj(Q(1/conj z)). Then W(z,w) = Q(z) + w^2 Q~(z) has no zero with all
abs(z_j) < 1 and abs(w) < 1, and none with all abs(z_j) > 1 and abs(w) > 1.
Proof. Q~/Q is analytic on the polydisc and unimodular on the torus, so abs(Q~/Q) <= 1 inside, with strict
inequality in the open polydisc unless constant. A zero of W has abs(w)^2 = abs(Q/Q~) >= 1 for z inside. The
exterior case follows from the symmetry (z,w) -> (1/conj z, 1/conj w).
For Q = prod_{p<=P}(1 - p^{-1/2} z_p): Q~/Q is a product of Blaschke factors. Along z_p = e^{-it log p},
w = e^{-i l t} with l > 0, the zeros in t of W are real (Hermite-Biehler form of the same inequality).

**Lemma 3.2 (PROVED, arithmetic).** The Bohr lift D_N(z) = sum_{n<=N} n^{-1/2} z^{(n)} of the Riemann-Siegel main
sum is not zero-free on the polydisc for N >= 3: D_N(0) = 1 and D_3(-1,-1) = 1 - 2^{-1/2} - 3^{-1/2} = -0.2845.
So the Riemann-Siegel sum does not give a Lee-Yang polynomial; the finite Euler product does.

**Measurements (`a3.log`, MEASURED).** Model Z_P(t) = 2Re(e^{i theta(t)} zeta_P(1/2+it)) on 10 <= t <= 200
(79 zeta zeros, mean spacing 2.41).

| P | model zeros | mean abs(shift) | max abs(shift) | min HB margin on sigma in {0.52,0.6,0.75,1} |
|---|---|---|---|---|
| 2 | 79 | 0.247 | 0.592 | not computed |
| 10 | 79 | 0.099 | 0.363 | -3.6 |
| 100 | 79 | 0.030 | 0.107 | -9.7 |
| 1000 | 79 | 0.015 | 0.045 | -23.8 |
| 10000 | 79 | 0.011 | 0.035 | -90.7 |

The real zeros of the model converge to the zeta zeros as P grows (shift 0.011 at P = 10^4), and the count is
exact at every P. The Hermite-Biehler inequality abs(E_P(s)) > abs(E_P(1-conj s)) fails at every P >= 10 somewhere
in 1/2 < sigma <= 1 (worst at sigma = 1), and the phase theta(t) + arg zeta_P(1/2+it) is not monotone (minimum
slope -1.1 to -9.4). So on this range nothing proves that the model has no further zeros off the line.

**Stop.** The two requirements pull in opposite directions. Hermite-Biehler needs
(t/2 pi)^{sigma-1/2} > abs(zeta_P(1-conj s)/zeta_P(s)), which can fail by a factor exp(c (sigma-1/2) P^{1/2}), so it
needs P below about (log t)^2. Accuracy near the line needs P large, and for zeta_P to approximate zeta at distance
1/log P from the line is RH-strength (Gonek; LITERATURE). The measured convergence of real zeros at P up to 10^4 is
outside the provable window. This is the round-1 operator attempt's wall (a pointwise bound on the large-prime
part) in structure-function form. No new statement.

---

## 5. DH control summary

| angle | step using the Euler product | DH | T-NR | status |
|---|---|---|---|---|
| 1 | lambda completely multiplicative; pole of zeta(2s) at 1/2 | no bounded inverse; poles in Re s > 1 | poles from the cosh factor | excluded (PROVED for the target, since target implies RH-type zero-freeness) |
| 2 | h(-163) = 1 | split is DH-blind | n/a | not excluded inside the split |
| 3 | Q zero-free on the closed polydisc | rank two, zeros inside | factor at q vanishes inside | excluded at fixed P; limit step open |
| 4-12 | as stated per angle | as stated | as stated | untested |

## 6. Verdict

Ranked list delivered. First-hour results: one proved one-directional proposition of classical type with a measured
reserve (Angle 1), one measured Euler-blind split with horizon 40 (Angle 2), one confirmation of a known wall
(Angle 3). No angle yields the missing input. Suggested order for any follow-up: Angle 5 (cheap numerics, new
observable), Angle 4 (needs one concrete two-dimensional inequality before any work is justified), Angle 6
(literature check on exponential-growth quasicrystals first).

## 7. Three weakest steps of this note

1. Novelty is judged against the files read, not against the literature. Angles 1, 3, 7, 9, 10, 12 restate
   classical criteria; their literature attributions are recalled, not re-read, and may be imprecise in detail
   (in particular the exact statements of Bagchi, Lagarias-Suzuki, Stark, Gonek, Kaczorowski-Perelli).
2. Statement 1.3 (the converse direction for Angle 1) and the support-below-log-q claim for T-NR in section 0.1 are
   argued, not written out. Proposition 1.2 relies on the boundary lemma for one-signed Mellin integrals, stated
   from memory.
3. The P and N scores are single-agent judgments with no referee. The measured tables are double precision or
   20-30 digit mpmath without interval certification; the Angle 3 Hermite-Biehler minima are on a coarse grid.
