# c13-tnr-invariance-prefilter-noncone-census: RESULT

Round 13, kind combine (round-12 combinable 2). Date 2026-11-19. Local only: seven python runs through
`scripts/memcap.sh 8` (`.venv-arb/bin/python`; longest 15 minutes, all under 200 MB). The server was not used.
Nothing here is a statement about zeros of zeta. No requirement flag is claimed.

Labels: PROVED (argument given here) / CLASSICAL (recalled; source not opened in this lane) / MEASURED (mpmath or
exact rational arithmetic, not interval-certified unless exact) / ARGUED / OPEN.

## Verdict

Precise obstruction, with a proved pre-filter (Lemma P) and two proved inheritance lemmas (L, E).

1. **Lemma P (pre-filter; PROVED).** A device whose hypotheses are all linear identities or linear-class
   memberships (S1), cone conditions in a dilation-invariant convex cone on an object linear in F (S2), or
   conditions at primes other than p0 (S3) is passed by T-NR with c > 0. The step types outside the lemma are
   listed (X1 to X5).
2. **Decisive first test: passed.** Against the 37 device types: 14 carry a recorded T-NR verdict; 0
   disagreements. The 8 recorded passes are at steps of type S1 to S3. The 8 recorded failures are each at a step
   of type X1, X3, X4 or X5. Three restrictions of scope were needed to obtain this (log level is outside; c < 0
   is outside; mollified mean values are outside). 23 device types have no T-NR record by name.
3. **Lemma L (PROVED).** The weight sequence (p0^(-1/2), c, p0^(1/2)) of T-NR is totally positive exactly when
   c >= 2, i.e. exactly when the twin's extra zeros leave the line. By Cauchy-Binet, T-NR with c >= 2 inherits the
   sign of every minor of every order of a dilation matrix of zeta's kernel whose row nodes lie on one
   p0^2-lattice, provided zeta's minors with rows on that lattice have a constant sign (MEASURED at orders 2 to
   5, not proved). Tempered twins (abs(c) < 2) do not (MEASURED).
4. **Lemma E (PROVED).** The xi-kernel of E_a is the convolution of Phi e^(au) and Phi e^(-au); it inherits every
   Polya-frequency order of Phi (log-concavity included).
5. **Census.** Twelve inequality types not preserved by cone endomorphisms, each with the T-NR and E_a verdict at
   a named step (section 4). No entry fails both controls at a step that is an unconditional property of zeta,
   reads the functional equation, and is not passed by another control:
   - both fail, but the condition is a consequence of the target for zeta (Laguerre on the line; all-order
     criteria);
   - both fail, but the condition is the size of local parameters, empty for zeta, no functional equation
     (temperedness, tensor powers);
   - both fail in measurement at one entry (order-4 minors of the theta kernel with its constant term on generic
     nodes), where theta^w passes (200 of 200 for each of w = 2, 1/2) and zeta's sign is measured, not proved, and differs from the sign
     for primitive characters.
6. **Worked example (Edrei-Thoma).** Local total positivity holds for T-NR (c > 2) and E_a (exact arithmetic) and
   fails for the tempered twin, for L(s, chi) at chi(p) = -1 and for tempered degree-2 factors: it is ordered
   against the target.

## 1. Plan; what is new against the record

- Round-12 lesson 2 states the pre-filter in one sentence without a class of steps or a proof. This note gives the
  class, the proof, and the test against the device table.
- The E_a discriminator of `c12-univ-pointwise-control-wcone` (theta-normalised kernel with polar terms) is
  combined with the T-NR observations: section 4 lists, for each non-cone inequality type, which of the two
  controls fails and where.
- Already on file and only reproduced here: T-NR kernel is not log-concave (`h-tnr-geometric`, table line 71);
  Laguerre expression of the twin at the collision height (`h-local-sign-change`, F3); E*(i, 0.7) = -2.331
  (`c12-univ-pointwise-control-wcone`); Lambda_F(q^k) of the twin (`r3-tnr-control`).
- New here: Lemma P with its exclusions; Lemma L and its sharp threshold c >= 2; Lemma E; the sign table of
  dilation minors of orders 2 to 5; the exact Edrei-Thoma check.
- Answers to the three questions of map section 2: this lane has no attack. R1: not used. R2: none. R3: the
  subject of the lane; no candidate. R4: none. Allowed as combine without R4 under STRATEGY section 1.

## 2. The pre-filter

### 2.1 Objects

p0 prime, l = log p0, xi*(s) = pi^(-s/2) Gamma(s/2) zeta(s). For real symmetric weights w = (w_k), abs(k) <= N,
w_k = w_(-k), put m_w(s) = sum_k w_k p0^(k(s-1/2)). Then m_w(1-s) = m_w(s). T-NR is N = 1, w = (1, c, 1):
X(s) = xi*(s) m(s). In Dirichlet-polynomial form F = zeta D with D(s) = p0^(N(1/2-s)) m_w(s), D(1-s) = p0^(N(2s-1)) D(s)
(conductor p0^(2N)). Positive class W+: w_k >= 0, w_0 > 0. For N = 1 the zeros of m are at
Re s = 1/2 +- arccosh(abs(c)/2)/l, in the open strip iff 2 < abs(c) < p0^(1/2) + p0^(-1/2).

Actions of the factor p0^(k(s-1/2)):
- theta kernel (M[f](s) = int f(x) x^(s/2) dx/x, psi(x) = sum_{n>=1} exp(-pi n^2 x), M[psi] = xi*):
  p0^(k(s-1/2)) xi*(s) = M[p0^(-k/2) psi(x p0^(-2k))]. So theta_w(x) = sum_k w_k p0^(-k/2) theta(x p0^(-2k)), a
  combination with non-negative coefficients of dilates of theta by powers of p0^2, and
  theta_w(1/x) = sqrt(x) theta_w(x).
- xi kernel (xi(1/2 + it) = int Phi(u) e^(itu) du, Phi even): Phi_w(u) = sum_k w_k Phi(u + k l). Checked:
  the cosine transform of Phi_w at t = 3.7 equals xi(1/2 + 3.7i)(c + 2 cos(3.7 l)) to 16 digits for three (p0, c).
- Dirichlet coefficients (D form): a_F = 1 * d, d supported on powers of p0, d >= 0 for w in W+.

### 2.2 Lemma P

A device is taken as a finite list of hypotheses H_1, ..., H_n on an object F together with an implication
"H_1(F) and ... and H_n(F) imply C(F)", C a zero-free statement for a region R, the implication being claimed for
every F for which the hypotheses are formulable. A hypothesis H is W-stable at p0 if H(F) implies H(m_w F) for all
w in a subset W of W+.

**Lemma P.** If every H_i is W-stable at p0, each H_i holds for zeta, and some m_w, w in W, has a zero in R, then
the implication is false. PROVED: m_w zeta satisfies every H_i and has a zero in R.

**Proposition S (stable step types; PROVED, each item in one line).**

- S1 (linear classes and identities). Let V be a linear space of functions with m_w V inside V and let H be
  "F in V" or an identity that is a theorem for every member of V. Then H is stable. Cases: meromorphic of order
  one with at most the simple pole at 1 (m_w is entire of exponential type); xi*(s) F-type functional equation
  with zeta's gamma factor (m_w is symmetric); F real on the real axis; multiplicative coefficients (D form:
  product of two multiplicative functions under Dirichlet convolution, the second supported on powers of p0);
  the explicit formula, the Hadamard product, residue and Poisson-Jensen identities (they hold with the zero set
  of m_w F).
- S2 (dilation-invariant cones). Let T be linear in F with T(p0^(k(s-1/2)) F) = U^k T(F), and K a convex cone with
  U K and U^-1 K inside K. Then "T(F) in K" is stable: T(m_w F) = sum_k w_k U^k T(F). Cases:
  (a) a(n) >= 0 (U = shift n -> p0 n with a positive factor);
  (b) theta kernel >= 0 including its constant term; xi kernel >= 0; complete monotonicity of the theta kernel
      (U = dilation by p0^2 times a positive constant; U = translation by l);
  (c) positive definiteness of t -> F(sigma + it) for sigma > 1 (follows from (a) by Bochner);
  (d) log-convexity of u -> K(e^u) for a positive kernel K: a sum of log-convex functions is log-convex
      (Cauchy-Schwarz), and translates of log-convex functions are log-convex. This is the order-2 minor
      condition det[K(x_i y_j)] >= 0;
  (e) positive semidefiniteness of a matrix that is linear in the kernel, on a node family invariant under the
      dilation;
  (f) an upper bound N(F) <= C for a seminorm N with abs-homogeneous behaviour N(p0^(k(s-1/2)) F) <= c_k N(F),
      when the step does not track the constant: growth and convexity bounds, mean values, large-sieve bounds.
- S3. Every condition on local factors at primes p != p0 (they are those of zeta), and every tail condition on
  the prime sequence.

**Exclusions (not stable; each is a place where T-NR can fail).**

- X1 (log level and size at p0). Lambda_F >= 0, positive definiteness of log F, and every form linear in F'/F
  (Pick, Weil, Li): multiplication by m_w acts by adding m_w'/m_w, whose coefficients at powers of p0 are
  -(alpha^k + beta^k) log p0 with alpha, beta < 0 real for c > 2, so they alternate in sign and grow
  ((3, 2.2): Lambda_F(3^k)/log 3 = 4.81, -7.52, 22.03, -53.59). Unimodular local parameter; bounded coefficients
  of 1/F (every mollifier); non-vanishing of a deleted Euler factor.
- X2 (exact covariance at p0). Complete multiplicativity (a(p0^2) != a(p0)^2), the Hecke eigen-relation at p0,
  the spherical local vector, permutation-matrix coefficient maps.
- X3 (target-level inputs). A zero-free input in a region containing zeros of m_w; an all-order criterion
  equivalent to RH; a certificate at low height (zeros of m start at height pi/l).
- X4 (identification). Conductor 1 together with integer frequencies (the Laurent form has frequencies
  log(n/p0); the D form has conductor p0^2); integrality or rationality of special values
  (zeta(1-k) D(1-k) contains sqrt(p0)).
- X5 (kernel conditions outside dilation-invariant convex cones). Unimodality (a convex cone, not
  translation-invariant); log-concavity and Polya-frequency order >= 2 of the xi kernel (not convex); Laguerre
  and Turan expressions; sign-regularity of order >= 3 of the theta kernel on generic nodes (a mixture of
  dilates is not a composition; see Lemma L for the lattice case); inequalities with a fixed constant in which
  the norm of m_w matters.
- c < 0 (weights not in W+): outside the lemma. Recorded example: for c < -2 the coefficient 1 + c sqrt(p0) is
  negative (`c12-bost-connes-crossed-product-duality`, row "T-NR, c < -2": fails).

Use: before stage A, type each hypothesis of the candidate as S1, S2, S3 or X1 to X5. If no X appears, T-NR
passes and the device is closed. If an X appears, that X is the step to quote in the T-NR row of the control
table; the lemma does not say that T-NR fails there.

### 2.3 Lemma L (lattice inheritance) and Lemma E

**Lemma L.** Let K be a function on (0, inf), k >= 1 and eps in {+1, -1}. Assume eps det[K(xi_r y_j)] >= 0 for all
xi_1 < ... < xi_k in the lattice x0 p0^(2Z) and all y_1 < ... < y_k. Let K_w(x) = sum_{abs(n)<=1} omega_n K(x p0^(2n))
with omega = (p0^(-1/2), c, p0^(1/2)) and c >= 2. Then eps det[K_w(x_i y_j)] >= 0 for all x_1 < ... < x_k in the
same lattice and all y_1 < ... < y_k.

Proof. With x_i = x0 p0^(2 a_i), K_w(x_i y_j) = sum_m omega_(m - a_i) K(x0 p0^(2m) y_j) = (W H)_(ij),
W_(i,m) = omega_(m - a_i), H_(m,j) = K(x0 p0^(2m) y_j). By Cauchy-Binet,
det[K_w(x_i y_j)] = sum over m_1 < ... < m_k of det W[i; m_r] det H[m_r; j]. The minors of H have sign eps by
hypothesis. W is a submatrix (increasing rows and columns) of the transposed Toeplitz matrix of the finite
sequence omega, which is totally positive iff omega_(-1) + omega_0 z + omega_1 z^2 has only real non-positive
zeros (Aissen-Schoenberg-Whitney-Edrei, CLASSICAL), i.e. iff c^2 >= 4 omega_(-1) omega_1 = 4. QED.

Checks. Identity at one node set (p0 = 2, c = 2.0506, rows a = (-1, 0, 2), three free columns): direct determinant
and Cauchy-Binet sum agree to 7.7e-81; 15 non-zero terms, all det W >= 0.354, all det H negative. Signs on 150
random lattice-row node sets per order (orders 3, 4, 5; reference signs of zeta -, -, +):

| object | order 3 | order 4 | order 5 |
|---|---|---|---|
| T-NR p0 = 2, c = 2.0506 | 150 agree | 150 | 150 |
| T-NR p0 = 3, c = 2.0785 | 150 | 150 | 150 |
| twin p0 = 2, c = 2 (double zeros on the line) | 150 | 150 | 150 |
| tempered twin p0 = 2, c = 1.4142 | 150 | 150 | 15 agree, 135 opposite |
| tempered twin p0 = 2, c = 0.5 | 139 / 11 | 64 / 86 | 150 |
| tempered twin p0 = 3, c = 0 | 118 / 32 | 64 / 86 | 150 |

So determinantal conditions on p0-aligned nodes hold for the twin exactly in the range where its zeros are off the
line, and can fail in the range where they are on it. The polynomial 1 + c z + z^2 is, after z = sqrt(p0) x, the
numerator 1 + c sqrt(p0) x + p0 x^2 of the local factor: Lemma L and the Edrei-Thoma example (section 5) are the
same criterion.

**Lemma E.** Let Phi_a be the kernel of xi(1/2 + a + it) xi(1/2 - a + it) = abs(xi(1/2 + a + it))^2 (real a).
Then Phi_a = (Phi e^(a u)) * (Phi e^(-a u)), and if det[Phi(u_i - v_j)] >= 0 for all increasing node sets of order k
then the same holds for Phi_a. Proof: xi(1/2 + a + it) = int Phi(u) e^(au) e^(itu) du; the factor
e^(+-a(u_i - v_j)) scales rows and columns by positive numbers; the basic composition formula for convolution
kernels. QED. Check: cosine transform of the numerical convolution at t = 3.7, a = 0.3: 0.13091264136 against
abs(xi(0.8 + 3.7i))^2 = 0.13091264136; log-concave and unimodal on the grid (largest second difference of the
logarithm -10.2).

## 3. Decisive first test: the 37 device types against the pre-filter

Reading rule. "Steps read" is my typing of the hypotheses named in the cited map rows and in
`push/c11-del-device-read-confirm/table_v2.md`. "Pre-filter": PASS = all typed steps are S1 to S3, so Lemma P
predicts that T-NR passes; "silent (X..)" = an excluded step is present. "Record" = the T-NR verdict on file
(map row, mechanism table `push/stack-combinator/TABLE.md`, or lane). Cells with a star in the record are
inferences of the recording lane. The 18 quoted phrases were checked to occur verbatim in the map (`ref_checks.json`).

| # | device type | steps read (type) | pre-filter | record for T-NR | compare |
|---|---|---|---|---|---|
| 1 | mean-value-convexity | mean values, convexity (S2f, S1); mollified density estimate (X1: coefficients of 1/F); positive definiteness of log F (X1) | PASS for plain mean values; silent (X1) for the other two | TABLE row 25, density N(sigma, T) = o(T): F*; TABLE row 30, log zeta positive definite: F* | agree: both failures at X1 |
| 2 | exact-uniqueness | identification (X4); Theorem R, zero tolerance per prime weight (X1) | silent | TABLE row 19 (Theorem R): F | agree |
| 3 | residue-explicit-formula | identities (S1) | PASS | P1: identity holds, NR*; P8: NR* (identity holds) | agree |
| 4 | positive-kernel-transport | finite Pick and Richards orders (linear in F'/F: X1; low height: X3); seam invariants (S1) | silent for Pick; PASS for identities | G21: first negative nested Pick order 4 | agree: failure at X1 |
| 5 | maximum-principle | zero-free statement as input (X3) | silent | none by name | no record |
| 6 | dual-measure-compactness | cone step Lambda_F >= 0 (X1); logarithmic discrepancy | silent | none (E_a passes) | no record; predicted failure at Lambda_F >= 0 |
| 7 | recurrence-ergodicity | stages never vanish (X1: the stage factor at p0 vanishes in the strip); density estimate (X1) | silent | none | no record |
| 8 | euler-fe-phase-at-height | functional-equation phase (S1); exact local factor at every prime (X2) | silent | P40: NR not run | no record |
| 9 | selberg-operator | no device step (the companion does not exist in the needed form) | not applicable | none | - |
| 10 | monotone-flow-functional | flow identities for every even kernel (S1); anchor in Re s > 1 (holds for c in the strip range); Lambda >= 0 at the anchor (X1) | PASS for the flow steps | none | no record |
| 11 | geometric-positivity | no object on file | not applicable | none | - |
| 12 | stage-limit | stage stability on the polydisc (X1 at p0); semicontinuity (S1) | silent | none (Q21 names TW, EA) | no record |
| 13 | section-extraction | lossless stub at p0 (X1); no-go Lemma R from gamma growth (S1) | PASS for Lemma R | Q22: Lemma R holds for NR | agree |
| 14 | test-restriction-commutator | orthogonalisation, function-independent (S1); sign of the Weil form (X3) | PASS for the restriction; silent for the sign | P35: sign unchanged by the restriction (measured); G25: negative directions for T-NR | agree on both |
| 15 | finite-support-positivity | prime-side positivity with zero tolerance in each prime weight (X1) | silent | TABLE row 19: F; row 27 (uses Lambda >= 0): F* | agree |
| 16 | hecke-compression-lax-phillips | Hecke action on the modular surface (X2: T-NR is not a T_p0 eigenfunction) | silent | none | no record |
| 17 | hecke-correspondence-recurrence | joint Hecke eigen-relation (X2) | silent | none (EIS-w passes) | no record |
| 18 | helson-discrepancy | class of completely multiplicative unimodular functions (X1, X2) | outside the class | none | - |
| 19 | twisted-discrepancy | same class | outside the class | none | - |
| 20 | frequency-only | coefficient-blind (S1) | PASS | devices.json: "every Dirichlet-series control passes" (T-NR not named) | agree (generic record) |
| 21 | padic-special-values | values at non-positive integers, integrality (X4) | silent | none | no record |
| 22 | tensor-squeeze | size of local parameters (X1) | silent | D4: kills NR at the holomorphy step | agree |
| 23 | strip-dtn-identity | identity (S1) | PASS | D7: NR argued (identity holds) | agree |
| 24 | sum-product-vinogradov | additive step, a bound linear in F (S2f); 3-4-1 (X1) | silent for 3-4-1 | none | no record |
| 25 | quadratic-positivity-companions | log-level squares (X1); coefficient squares (S2) | PASS for coefficient squares | none for the device (Q28: T-NR lift passes P at product level) | no record |
| 26 | coherent-set-large-sieve (floored) | reflection, Cauchy-Schwarz, large sieves, linear in a bounded weight (S1, S2f); abs(eta(p)) = 1 in Section 2 and Lemma 7.1 (X1) | PASS for every step except size at p0 | Z18 and `r3-tnr-control`: fails at the size condition and only there; bounded-weight feeding passes every step (ARGUED); TABLE row 50: F* | agree on both |
| 27 | effective-order-two | closure rows coefficient-blind (S1) | PASS | none by name (Z22: arbitrary bounded coefficients pass) | no record |
| 28 | laurent-shell-gamma-section | first-moment identity (S1) | PASS | none | no record |
| 29 | function-field-order2-vertex | model in F_q[T] | not applicable | none | - |
| 30 | vector-specific-row-mean-square | row mean square (S2f); hypothesis of zero-free type for the twist family (X3) | silent | none | no record |
| 31 | nonprincipal-row-cancellation | Lemma D, linear in the weight (S1) | PASS | none by name | no record |
| 32 | positive-term-sum-rule | Jensen and Littlewood identities (S1); unimodular chain (X1 at p0) | PASS for the identities | Q27: FM passes every step; T-NR not run | no record for T-NR |
| 33 | single-row-bridge | identity (S1) | PASS | none | no record |
| 34 | landau-siegel-mechanism | Frobenius congruences of real characters | not formulable | Z29: not run | - |
| 35 | twist-modulus-reciprocity | reciprocity identity at twists prime to p0 (S1, S3) | PASS | Z34: passes every step that holds for zeta with twists prime to p | agree |
| 36 | regular-rep-matrix-bridge | entrywise cone (S2a), functional equation (S1), periodicity; PERM (X2) is not consumed by any displayed form | PASS | Q28: T-NR lift passes P (product level), E, the functional equation, PER; fails only PERM | agree |
| 37 | de-branges-positivity-family | shift positivity of Hermite-Biehler type (X5), which implies a zero-free statement (X3) | silent | P53: fails at the zero-free conclusion | agree |

Counts. Device types with a T-NR record: 14 (1, 2, 3, 4, 13, 14, 15, 20, 22, 23, 26, 35, 36, 37). Recorded passes
8 (3, 13, 14 restriction, 20, 23, 26 other steps, 35, 36): all predicted PASS. Recorded failures 8 (1, 2, 4,
14 sign, 15, 22, 26 size, 37): each at an excluded step. **Disagreements: 0.** No T-NR record by name: 23, of which 6 are not applicable or outside the class
(9, 11, 18, 19, 29, 34). Predicted PASS without a record: 10, 27, 28, 31, 32, 33 (identity parts).

Rows of the map outside the 37 device types: P11 low-pass cone, fails for NR with c > 2 (X3, a low-height
statement); L1 and L4 local temperedness, kill NR (X1); D3 corona criteria hold for NR (S1); G32 central-value
squares, T-NR passes (S2); P52 weight-1 positivity, T-NR passes as a Hecke polynomial at q (S2). All consistent.

Round-12 lanes: Bost-Connes, T-NR with c > 2 passes every step used (density D >= 1: S2a), c < -2 fails
(outside W+); W-adapted cone, T-NR lift passes (S2); X_0(4) oval, the device's own twin has
c = -(q^(3/2) + q^(1/2)) < 0 and is recorded as passing by a separate argument (theta decreasing). That twin is
outside Lemma P. It is not a disagreement (the lemma is a sufficient condition), and it shows the lemma does not
decide negative c.

Points where the first typing would have produced a disagreement, and the restriction that removes it:

1. Device 4 is named "positive-kernel transport" and T-NR fails its Pick orders (order 4). The Pick kernel is
   linear in F'/F, not in F. Lemma P is restricted to objects linear in F or in its kernel (X1).
2. Device 1: the mechanism table records the density theorem ("FE + size, mean square of zeta M") as F* for T-NR,
   while plain mean values are stable. The mollifier M has the coefficients of 1/F, unbounded at powers of p0
   (X1). Mean-value devices are split accordingly.
3. Negative c (round-12 lanes 1 and 4): excluded from the lemma.

Pending proposals (devices.json, 9 entries):

| pending entry | typing | pre-filter |
|---|---|---|
| RS-1 (functional equation with periodicity of twists) | the two lanes run (devices 35, 36) are S1 to S3 | PASS in both lanes run; an RS-1 candidate must add a step of type X1 or X2 |
| RS-2 (attached object with non-algebraic positivity) | no candidate; an object defined from the local components at every prime reads X1 or X2 | undecided (no hypothesis list) |
| RS-3 (gamma side with Euler product in one positivity step) | lane run (device 37): X5 and X3 | silent |
| density quadratic forms with companions | mean values (S2f); log-level squares (X1) | PASS for coefficient-level forms |
| global Whittaker constants on the double cover of GL(3) | local data at every prime (X2) | silent |
| rank >= 2 compact-at-infinity squares without a Hecke rule | modulus squares (S2) | PASS |
| model vertices 1 < h <= 3 in the order-2 ledger | same reads as device 26 | PASS except the size step |
| Lax-Phillips Hecke norms outside weighted L2 | Hecke action on the surface (X2) | silent |
| non-locality step 4 of the Rouche lane | functional equation (S1) with the exact stage at every prime (X2) | silent |

Outcome of the test: the idea is not killed. The pre-filter is consistent with every recorded verdict and can be
used as a first screen. No pivot is taken.

## 4. Census of inequality types not preserved by cone endomorphisms

Parameters: T-NR (p0, c) = (2, 2.0506) and (3, 2.0785), both in the strip range (c sqrt(p0) = 29/10 and 18/5,
rational, so local sequences are exact); E_a with a = 0.1, 0.2, 0.3, 0.45 as stated. "zeta" = status of the
condition for zeta. "FE" = whether the condition is on the completed function or its kernels (this is weaker than using
s <-> 1-s inside the inequality; no entry does the latter except the identities N6b).

| # | inequality type; instance | zeta | FE | T-NR, named step | E_a, named step | reading |
|---|---|---|---|---|---|---|
| N1 | total positivity, local: Euler-factor sequence (a(p^k))_k totally positive at every p (Edrei-Thoma) | holds (sequence 1, 1, 1, ...) | no | PASSES (PROVED: numerator has two negative real zeros; exact: 0 negative of 4861 minors) | PASSES (PROVED: poles p^(+-a) > 0; exact) | passes both; fails tempered objects (section 5) |
| N2 | total positivity of the multiplier weights; minors on p0^2-lattice row nodes | not a condition on zeta | yes | PASSES (Lemma L, PROVED; 150 of 150) | see N4 | T-NR cannot fail aligned-node minors |
| N3 | Polya-frequency order k of the xi kernel: det[Phi(u_i - v_j)] >= 0; k = 2 is log-concavity | k = 2 holds (CLASSICAL, Csordas-Varga; grid check: largest second difference of log Phi is -18.7 on [0, 1.6]); k >= 3 not known here | yes (evenness) | FAILS at k = 2: Phi_NR not log-concave (second difference of the logarithm +29.4 at u = 0.405, p0 = 2; +157 at u = 0.575, p0 = 3; midpoint defect -0.456 and -2.58). Step: a sum of translates by +-l of a log-concave function is not log-concave (X5) | PASSES every k that zeta passes (Lemma E, PROVED) | fails T-NR only; DH and HEAT pass k = 2 (map, DH row; HEAT multiplies by a log-concave Gaussian) |
| N4a | theta kernel with constant term, order 1: K >= 0 | holds (PROVED, theta >= 1) | yes | PASSES (S2b, PROVED) | FAILS: E*(iy, 1/2 + a) < 0 on (1/y*, y*), y* = 7.25, 7.94, 9.62, 14.89 for a = 0.1, 0.2, 0.3, 0.4; E*(i, 0.7) = -2.3310. Step: polar coefficient xi*(2a) < 0 | fails E_a only (the round-12 discriminator); note the kernel is positive outside (1/y*, y*), not negative everywhere |
| N4b | same kernel, order 2: det[K(x_i y_j)] >= 0 (log-convexity of u -> K(e^u)) | MEASURED: 200 of 200 node sets in each of four boxes; not proved here | yes | PASSES (S2d, PROVED from the zeta row; 200 of 200) | FAILS: sign - (60 of 60 in three boxes) | fails E_a only; also fails for theta - 1, primitive characters, DH (no constant term) |
| N4c | same kernel, order 3, generic nodes: sign - | MEASURED: 200 of 200, four boxes | yes | FAILS: 8 to 82 of 200 node sets have sign + in boxes abs(log) <= 1, 1.6, 2.5 (p0 = 2: 52, 36, 8; p0 = 3: 37, 82, 51); in the box 0.5: 7 and 0. Step: mixture of dilates off the p0^2-lattice (X5; Lemma L does not apply) | PASSES: sign - (60 of 60, three boxes) | fails T-NR only |
| N4d | same kernel, order 4, generic nodes: sign - | MEASURED: 200 of 200, four boxes | yes | FAILS in boxes >= 1.6: 76 and 39 of 200 positive (p0 = 2), 12 and 72 (p0 = 3); passes in boxes 0.5 and 1 (0 to 2 of 200) | FAILS: sign + (60 of 60, three boxes) | **fails both in measurement**; theta^2 and theta^(1/2) pass (100 of 100 in each of the boxes 1 and 1.6); primitive characters do not share zeta's sign |
| N5a | hyperbolicity, order 2 on the line: Laguerre expression -(log Xi)''(t) >= 0 for real t | consequence of RH; not known at all heights (map rows D7, P40) | yes | FAILS at t = pi/l: -18.935 (p0 = 2), -30.717 (p0 = 3); closed form L_zeta(t) - 2 l^2/(c - 2) | FAILS at t = gamma_1: -49.865 (a = 0.2; -2/a^2 = -50), -22.087 (a = 0.3) | both fail, at the target level: every function with an off-line zero pair close to the line fails it; not an input |
| N5b | hyperbolicity at the origin: Turan inequalities for the Taylor coefficients of Xi, k = 1..10 | holds (CLASSICAL, Csordas-Norfolk-Varga; measured ratios 0.070 to 0.028) | yes | PASSES (measured: all ten ratios positive, between 0.051 and 0.230 at p0 = 2 and between 0.061 and 0.309 at p0 = 3) | PASSES (measured 0.035 to 0.020 for a = 0.2, 0.3, 0.45) | passes both |
| N5c, N6a | stability of the local polynomial; unitarity abs(alpha_p) = 1; Hecke eigenvalue in [-2, 2] | empty for zeta (parameter 1) | no | FAILS at p0 (alpha, beta real, abs != sqrt(p0)) | FAILS at every p (p^(+-a)) | both fail; map rows L1, L4: with any flow-sensitive row this gives only Re s > 1 |
| N6b | norm equalities from the functional equation: abs(S) = 1 on the axis, phi(s) phi(1-s) = 1, Plancherel | identities | yes | PASSES (S1) | PASSES (S1) | identities; no sign |
| N7 | entropy: (a) positive entropy of Hecke-recurrent limit measures (row G31); (b) entropy-power and log-Sobolev inequalities for the density Phi; (c) log-convexity in beta of the partition function | (a) holds; (b) entropy power holds for every density, Bakry-Emery needs N3; (c) holds | (a) yes; (b) yes; (c) no | (a) not an eigenfunction at p0: X2, a formulability failure; (b) fails only through N3; (c) PASSES (S2a) | (a) PASSES as E(., 1/2 + a) is a joint eigenfunction (ARGUED from the EIS-w record, real parameter not run); (b) PASSES; (c) PASSES | no entry fails both |
| N8 | tensor-power size (Landau on Sym^m x Sym^m; row D4) | empty | no | FAILS at the holomorphy step (record) | FAILS at the holomorphy step (record) | both fail; output is the size of local parameters only; U, THIN, sign twists pass |
| N9 | log-level cone (boundary case: a cone that the multiplication does not preserve): Lambda_F >= 0, log F positive definite, 3-4-1 | holds | no | FAILS: Lambda_F(9)/log 3 = -7.52 at (3, 2.2) | PASSES | fails T-NR only |
| N10 | unimodality of the xi kernel (even, decreasing on u > 0): a convex cone, not translation-invariant | holds (CLASSICAL; grid) | yes | FAILS: increasing from u = 0.44 (p0 = 2), 0.58 (p0 = 3); f(0), f(l/2), f(l) = 1.837, 0.814, 0.899 | PASSES (Lemma E with k = 2 and evenness) | fails T-NR only |

Sign table of dilation minors (MEASURED; `dilation_minors.json`, `dilation_minors_ea.json`,
`dilation_minors_ctl.json`; entries "p/n" = node sets with positive / negative determinant, summed over the boxes
listed; 120 digits, 700 digits in the box 2.5, 60 digits for E_a; the smallest abs(det)/Hadamard bound in any cell
is 1e-233 at 700 digits (box 2.5), 1e-45 at 120 digits and 1e-32 at 60 digits, each above the working precision floor):

| kernel | boxes | order 2 | order 3 | order 4 | order 5 |
|---|---|---|---|---|---|
| theta (zeta) | 0.5, 1, 1.6, 2.5 | 800/0 | 0/800 | 0/800 | 800/0 |
| theta - 1 | same | 0/800 | 0/800 | 800/0 | 800/0 |
| T-NR (2, 2.0506) | same | 800/0 | 103/697 | 117/683 | 709/91 |
| T-NR (3, 2.0785) | same | 800/0 | 170/630 | 84/716 | 674/126 |
| tempered twin (2, 1.4142) | same | 800/0 | 127/673 | 130/670 | 705/95 |
| chi_5 (even, real) | same | 0/800 | 0/800 | 640/160 | 663/137 |
| chi_8 (even, real) | same | 0/800 | 0/800 | 592/208 | 663/137 |
| chi_13 (even, real) | same | 297/503 | 156/644 | 742/58 | 431/369 |
| DH (odd pair mod 5) | same | 0/800 | 269/531 | 698/102 | 697/103 |
| E_a, a = 0.1, 0.2, 0.3 | 0.5, 1, 1.6 | 0/540 | 0/540 | 540/0 | 540/0 |
| theta^2, theta^(1/2) | 1, 1.6 | 400/0 | 0/400 | 0/400 | 397/3 |
| finite deletions (3 kernels), Liouville twist, constant term kept | 1, 1.6 | 725/75 | 5/795 | 68/732 | 778/22 |

Reading of the census.

1. **No entry meets the condition for a score change.** The entries failing both controls are N5a (target level),
   N5c / N6a / N8 (size of local parameters, empty for zeta, no functional equation; rows L1, L4, D4 already on
   file) and N4d. N4d is a measured sign on random nodes; zeta's sign is not proved; theta^w passes it on every
   node set tried, the deletion and sign-twist kernels on 81 to 100 of 100; and the sign for zeta differs from the
   sign for the primitive characters (it follows the constant term of theta). It is not R3 at stage A.
2. **The two controls are separated by complementary kernels.** Translation-type determinantal conditions on the
   xi kernel cannot fail E_a (Lemma E) and fail T-NR at order 2. Conditions of order 1 and 2 on the theta kernel
   with its constant term cannot fail T-NR (S2b, S2d) and fail E_a. A single inequality that fails both must be
   of order >= 3 in the theta kernel on nodes not aligned with p0, or must mix the two kernels.
3. **The conjunction {Phi log-concave, theta kernel with constant term >= 0} excludes both controls with two
   unconditional properties of zeta that read the completed function.** It is an input set, not an inequality.
   DH has both properties (map, DH row: positive theta kernel, strictly log-concave; no polar term), and so does
   backward heat. In the map's input-level language the first item is a reading of GEOM at p0 through the kernel
   and the second a reading of SIZE through the poles. No device on file consumes either together with the Euler
   product.
4. **Total positivity is ordered against the target at a single prime.** Local sequences (N1) and weight sequences
   (N2) are totally positive for real non-tempered parameters and not for tempered ones. Determinantal conditions
   of Edrei-Thoma type at one prime select positive real Satake parameters.
5. **All-order sign-regularity is not available.** u -> theta(e^u) - 1 has bilateral Laplace transform
   Gamma(-s) pi^s zeta(-2s); by Schoenberg's theorem (CLASSICAL) it is a Polya frequency function of infinite order
   iff the reciprocal is entire with real zeros only, which fails at the non-trivial zeros of zeta(-2s). The
   pattern in the theta - 1 row therefore breaks at some finite order (ARGUED from the theorem; the order was not
   located; orders <= 5 hold on 800 node sets). A device asking for all orders asks for a false statement; a
   device asking for a finite order asks for a kernel-shape fact.

## 5. Worked example: total positivity of local Euler-factor sequences (Edrei-Thoma)

Statement (CLASSICAL: Aissen-Schoenberg-Whitney-Edrei; Thoma for the characters of the infinite symmetric group).
A sequence a_0 = 1, a_1, ... is totally positive (all minors of the matrix (a_(i-j)) are >= 0) iff
sum a_k x^k = e^(gamma x) prod (1 + alpha_i x)/prod (1 - beta_j x) with gamma, alpha_i, beta_j >= 0, summable.

- zeta at p: 1/(1 - x). Totally positive.
- T-NR at p0, c > 2: (1 + c sqrt(p0) x + p0 x^2)/(1 - x) = (1 + abs(alpha) x)(1 + abs(beta) x)/(1 - x), with
  abs(alpha) + abs(beta) = c sqrt(p0), abs(alpha) abs(beta) = p0, both real and positive (discriminant p0 (c^2 - 4) > 0). Totally positive (PROVED from the criterion).
- E_a at p: 1/((1 - p^a x)(1 - p^(-a) x)), p^(+-a) > 0. Totally positive (PROVED).

Exact check (rational arithmetic): every minor of the 8 x 8 Toeplitz section that is not structurally zero (4861)
and the contiguous minors of orders 1 to 6 at 40 shifts (240); second pass with sympy on 1500 random minors of a
14 x 14 section.

| sequence | 8 x 8 section: negative minors | first negative | contiguous: negative | second pass |
|---|---|---|---|---|
| zeta, 1/(1-x) | 0 | - | 0 | - |
| T-NR p0 = 2, c sqrt 2 = 29/10 (c = 2.0506): 1, 39/10, 59/10, 59/10, ... | 0 (4333 positive) | - | 0 | 0 of 1500; roots -0.885, -0.565 |
| T-NR p0 = 3, c sqrt 3 = 18/5 (c = 2.0785): 1, 23/5, 38/5, ... | 0 | - | 0 | 0 of 1500; roots -0.763, -0.437 |
| T-NR p0 = 5, c sqrt 5 = 23/5 (second pass only) | - | - | - | 0 of 1500 |
| E_a, p = 3, p^a = 3/2 (a = 0.36907): 1, 13/6, 133/36, ... | 0 (3280 positive) | - | 0 | 0 of 1500 |
| tempered twin p0 = 2, c = 1.4142: 1, 3, 5, 5, ... | 84 | order 4, rows 1..4, columns 0..3, value -4 | 3 | 1 of 1500 (order 7) |
| T-NR p0 = 2, c = -2.0506: 1, -19/10, 1/10, ... | 2041 | order 1 (-19/10) | 3 | - |
| L(s, chi), chi(p) = -1: 1/(1 + x) | 771 | order 1 | 20 | - |
| tempered degree 2, trace 1: 1/(1 - x + x^2) | 258 | order 1 (a_3 = -1) | 13 | - |
| tempered degree 2, trace 19/10 | 0 in the 8 x 8 section | - | 20; first at order 1, a_9 = -0.109 | - |

The T-NR object is not identically zero and is the twin (`census_checks.json`, block a): p0 = 2, c = 2.0506:
F(2) = 3.0431, F(1/2 + 3i) = -0.3535 - 0.4596i, relative defect of the functional equation at 0.3 + 2i: 1.5e-31,
zero at 0.823877 + 4.532360i with abs(F) = 1.2e-31 and abs(zeta) = 0.710 there. p0 = 3, c = 2.0785: F(2) = 2.3638,
defect 1.4e-31, zero at 0.754140 + 2.859601i with abs(F) = 3.0e-32, abs(zeta) = 0.587.

Verdict of the example. Both controls pass, as registered by the planner. The condition fails for the tempered
twin and for every tempered factor with a non-real or negative parameter, so it holds on the controls and fails on
functions expected to satisfy the Riemann hypothesis. It reads neither unimodularity nor the functional equation.
Closed as a device.

## 6. Controls

This lane proposes no argument about zeta; the control question applies to the census entries.

| control | where it stands |
|---|---|
| T-NR | subject of Lemma P and Lemma L; fails N3, N4c, N4d, N5a, N5c, N8, N9, N10; passes N1, N2, N4a, N4b, N5b, N6b |
| E_a | subject of Lemma E; fails N4a, N4b, N4d, N5a, N5c, N8; passes N1, N3, N4c, N5b, N6b, N9, N10 |
| Davenport-Heilbronn | passes N3 at k = 2 and kernel positivity (map row); its dilation minors have sign - at order 2 and mixed signs above; not run on the other entries |
| backward heat | passes N3 at k = 2 (Gaussian factor is log-concave); not run on N4 (the theta-normalised kernel of the family is defined in `c13-noncone-kernel-separator-search`) |
| theta^w | passes N4b, N4c, N4d (200 of 200 for each of w = 2, 1/2) |
| sign twists, deletions (constant term kept) | pass N4c on 95 to 100 of 100; N4b and N4d on 74 to 100 |
| unimodular twist, Beurling, phase-rotated transfer operator, zeta(s+a)zeta(s-a) with other a | not run |

## 7. Requirement flags

- R1 (multiplicativity essential): **false**. No argument about zeta. Lemma P uses multiplicativity only to say
  that T-NR keeps it.
- R2 (height-uniform, every window): **false**. No statement at height.
- R3 (every control fails at a structural step): **false**. No census entry fails all controls: N4d, the only
  single inequality that fails both T-NR and E_a without being target-level or a size condition, is passed by
  theta^w, is measured only, and its sign for zeta is not shared by primitive characters.
- R4 (reaches the critical line): **false**. Nothing crosses.

## 8. Three weakest steps

1. The device table rests on my typing of hypotheses from row texts. Only 14 of 37 device types carry a T-NR
   record, 8 of the 16 recorded cells are inferences of the recording lane (starred or "argued": TABLE rows 25, 27, 30,
   50; P1; P8; D7; the bounded-weight feeding of device 26), and device 20 is a generic record. "0 disagreements" means consistency with those 14, obtained after three scope
   restrictions were written into the lemma; it is not a replay of any device against T-NR.
2. The dilation-minor signs (N4b, N4c, N4d and the sign table) are measured on random node sets at high precision,
   not proved, and the boxes are small (abs(log) <= 2.5). The explanation by the constant term is argued. E_a was
   sampled on 60 node sets per cell. A proof of zeta's pattern at orders 2 to 5, or its failure on other node
   sets, would change N4.
3. Lemma P is a sufficient condition whose use depends on typing each step correctly; the boundary between S2f
   (bounds with untracked constants) and X5 (fixed constants), and between "linear in F" and "linear in log F",
   is where a mistyping would occur. Classical inputs (Aissen-Schoenberg-Whitney-Edrei, Schoenberg, Csordas-Varga,
   Csordas-Norfolk-Varga) are recalled, not opened. The second pass in REFEREE.md is by the
   lane author with separate code; no independent referee has read this file.

## 9. Files

`RESULT.md`, `PREFILTER.md` (hand-off to `c13-noncone-kernel-separator-search`), `REFEREE.md`, `lanes.jsonl`;
`census_checks.py/.json/.log` (object, Edrei-Thoma, kernels, Laguerre, Turan), `dilation_minors.py/.json/.log`,
`dilation_minors_ea.py/.json/.log`, `dilation_minors_ctl.py/.json/.log` (sign tables), `lattice_check.py/.json/.log`
(Lemma L, sign change of the E_a kernel), `ref_checks.py/.json/.log` (second pass).
