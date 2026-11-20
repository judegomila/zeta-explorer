# PREFILTER: T-NR invariance test and non-cone census (hand-off to `c13-noncone-kernel-separator-search`)

Lane `c13-tnr-invariance-prefilter-noncone-census`, 2026-11-19. Nothing here is a statement about zeros of zeta.
Labels: PROVED (argument in RESULT.md of this lane) / CLASSICAL (recalled, source not opened) / MEASURED / ARGUED.
Numbers: `census_checks.json`, `dilation_minors.json`, `lattice_check.json`, `ref_checks.json` (local, `scripts/memcap.sh 8`).

## 1. The pre-filter (use before stage A)

Objects. p0 prime, l = log p0. T-NR in Laurent form: X(s) = xi*(s) m(s), m(s) = p0^(s-1/2) + c + p0^(1/2-s);
Dirichlet-polynomial form F = zeta D, D(s) = 1 + c p0^(1/2-s) + p0^(1-2s). Positive class: c > 0 (weights
(1, c, 1) >= 0). Off-line zeros in the strip: 2 < c < p0^(1/2) + p0^(-1/2).

**Lemma P (PROVED, elementary).** If every hypothesis a device reads is of one of the types S1 to S3 below, then
T-NR with c > 0 satisfies every hypothesis that zeta satisfies, so the device cannot conclude a zero-free statement
in a region containing a zero of m.

- S1. A linear identity, or membership in a linear class V with mV inside V: meromorphic of order one with the
  single pole; zeta's gamma factor and s <-> 1-s (Laurent form; conductor p0^2 in the D form); multiplicative
  coefficients; explicit formula, Hadamard product, residue and Poisson-Jensen identities.
- S2. A cone condition: T(F) in a convex cone K, where T is linear in F (or in its kernel) and the factor
  p0^(k(s-1/2)) acts on T(F) by an operator U^k with U K inside K and U^-1 K inside K. Cases: coefficients
  a(n) >= 0; theta-kernel >= 0 with the polar terms; xi-kernel >= 0; complete monotonicity; positive definiteness
  of t -> F(sigma + it), sigma > 1; log-convexity of u -> K(e^u) (log-convex functions form a translation-invariant
  convex cone); positive semidefiniteness of matrices linear in the kernel on node sets invariant under the
  dilation; upper bounds for a seminorm with constants not tracked (growth, mean values, large-sieve bounds).
- S3. Any condition on the local factors at primes p != p0, and any tail condition on the prime sequence.

Not covered (a device must contain one of these for T-NR to fail; the name is the step to quote in stage A):

- X1. Log level: Lambda_F >= 0, positive definiteness of log F, Pick or Weil forms (linear in F'/F): multiplication
  by m is a translation by m'/m, not a cone map. Size at p0: unimodular local parameter, bounded coefficients of
  1/F (mollifiers), deleted-factor non-vanishing.
- X2. Exact covariance at p0: complete multiplicativity, the Hecke eigen-relation at p0, the spherical vector,
  "every coefficient matrix is a permutation matrix".
- X3. An input that is a zero-location statement, an all-order criterion equivalent to RH, or a certificate at
  low height (the zeros of m start at height pi/log p0).
- X4. Identification: conductor 1 together with integer frequencies (Hamburger), integrality of special values.
- X5. Kernel conditions in a set that is not a dilation-invariant convex cone: unimodality, log-concavity,
  Polya-frequency order >= 2 of the xi-kernel, hyperbolicity (Laguerre, Turan), sign-regularity of order >= 3 on
  generic nodes, equalities with a fixed constant.
- c < 0 is outside the lemma (weights not positive).

Check against the record (37 device types, 9 pending): 14 device types carry a recorded T-NR verdict (8 recorded
passes and 8 recorded failures, two device types having one of each at different steps). 0 disagreements: every
recorded pass is at steps of type S1 to S3, every recorded failure at a step of type X1, X3, X4 or X5. 23 device
types have no T-NR record by name. Table in RESULT.md section 3.

## 2. Predictions for the registered dictionary (minors of dilation matrices, Turan-type expressions)

Notation of this lane: K(x) = theta(x) = sum over n in Z of exp(-pi n^2 x), matrices [K(x_i y_j)], x and y increasing.
(Your Kpol(u) = e^(u/2) theta(e^(2u)) differs by a diagonal scaling of rows and columns and by u -> 2u: signs of
minors of [Kpol(u_i + v_j)] are the same.)

| object | order 1 | order 2 | order 3 | order 4 | order 5 | status |
|---|---|---|---|---|---|---|
| zeta, theta with the polar term | + | + | - | - | + | MEASURED: 200 of 200 random node sets per order in each of four boxes abs(log x), abs(log y) <= 0.5, 1, 1.6, 2.5 (120 digits; 700 digits for 2.5) |
| theta - 1 (polar term dropped) | + | - | - | + | + | MEASURED, same sample; this is the pattern (-1)^(k(k-1)/2) of a Polya frequency function |
| T-NR, c > 2, generic nodes | + | + (PROVED from the zeta row: cone) | mixed: 8 to 82 of 200 positive in boxes >= 1 | mixed in boxes >= 1.6 (12 to 76 of 200 positive) | mixed | MEASURED |
| T-NR, c >= 2, row nodes on one p0^2-lattice, columns free | + | + | - | - | + | PROVED from the zeta row (Lemma L, Cauchy-Binet); MEASURED 150 of 150 per order |
| tempered twin, abs(c) < 2 (zeros on the line if zeta's are) | + | + | mixed | mixed | mixed | MEASURED; Lemma L does not apply (weights not totally positive) |
| even real primitive chi (5, 8) | sign of chi | - | - | mixed | mixed | MEASURED; no polar term |
| E_a, a = 0.1, 0.2, 0.3 | - on (1/y*, y*), + outside; y* = 7.25, 7.94, 9.62 | - | - | + | + | MEASURED: 60 of 60 per order in boxes 0.5, 1, 1.6 (60 digits). Same pattern as theta - 1 |
| DH (odd pair mod 5) | + near 1 | - (200 of 200) | mixed | mixed | mixed | MEASURED |
| theta^2, theta^(1/2) | + | + | - | - | + (97 to 100 of 100) | MEASURED, 100 node sets, boxes 1 and 1.6 |
| finite deletions (n odd; n prime to 3; n = 2^a 3^b), Liouville twist, constant term kept | + | mostly + (74 to 100 of 100) | - (95 to 100 of 100) | mostly - (81 to 100 of 100) | mostly + | MEASURED |

Reading, for the search:

1. The sign pattern of low-order dilation minors follows the constant (polar) term of the theta kernel: kernels
   with no constant term (theta - 1, primitive characters at order 2 and 3, DH at order 2) and E_a have the
   Polya-frequency pattern (-1)^(k(k-1)/2) where the sign is constant; zeta has that pattern shifted by one order,
   (-1)^((k-1)(k-2)/2). ARGUED for zeta against theta - 1 (bordered determinant with the rank-one constant);
   MEASURED otherwise. A functional that separates E_a from zeta through these signs (orders 1, 2, 4) reads the
   polar part, which is the SIZE item of the map (poles at 1 +- a against one pole at 1).
2. Consequence for the registered positive sets: zeta and the primitive characters have opposite signs at order 2
   and different behaviour at order 4 (constant term against none). Under P2 (zeta and all primitive characters)
   no functional of this kind is expected to have one sign on the positives. Under P0 = {zeta}: order 2 separates
   E_a and DH but not T-NR (cone, PROVED), theta^w or deletions; order 3 on generic nodes separates T-NR but not
   E_a; order 4 on generic nodes in boxes >= 1.6 separates T-NR and E_a but not theta^w (100 of 100 with zeta's
   sign). Expected outcome: no survivor against all nine classes; theta^w is the passing control for every order
   tried here.
3. T-NR passes every minor condition whose row nodes lie on a p0^2-lattice, exactly when c >= 2 (weights
   (p0^(-1/2), c, p0^(1/2)) totally positive iff 1 + c z + z^2 has real zeros). A dictionary entry with
   lattice-aligned nodes at p0 cannot fail T-NR; tempered twins fail it. Use generic nodes, or nodes on a lattice of
   a different prime, when T-NR is the control.
4. The xi-kernel (your K3): Polya-frequency order k (minors of [K3(u_i - v_j)] >= 0). E_a inherits every order that
   zeta has (PROVED: the kernel of E_a is the convolution of K3 e^(au) and K3 e^(-au); Cauchy-Binet). T-NR fails at
   order 2 (not log-concave: second difference of log up to +29 at p0 = 2, +157 at p0 = 3; not unimodal). So K3
   minors of translation type cannot fail E_a, and theta-polar minors of order <= 2 cannot fail T-NR.
5. Turan inequalities at the origin (Taylor coefficients of Xi): zeta, T-NR (three parameter sets) and E_a
   (a = 0.2, 0.3, 0.45) all pass for k = 1..10 (MEASURED). The Laguerre expression on the line fails for T-NR at
   t = pi/log p0 (-18.9 at p0 = 2, -30.7 at p0 = 3) and for E_a at t = gamma_1 (-49.9 at a = 0.2), but it is a
   consequence of the target for zeta, not an input.
6. All-order sign-regularity is not available as a hypothesis: u -> theta(e^u) - 1 is a Polya frequency function
   of infinite order iff pi^s/(Gamma(s) zeta(2s)) is entire with real zeros (Schoenberg, CLASSICAL), which is
   false. The pattern in the zeta row must break at some finite order; that order was not located (orders <= 5 hold).
7. Local total positivity of Euler-factor sequences (Edrei-Thoma) cannot be a separator: T-NR with c > 2 and E_a
   pass (exact arithmetic: 4861 minors of the 8 x 8 section and 240 contiguous minors each, none negative), while
   the tempered twin (order 4), L(s, chi) at chi(p) = -1 (order 1) and tempered degree-2 factors fail.

Registered prediction of this lane for your run: no survivor under P2; under P0 a functional built from minors of
order 3 or 4 on generic nodes may meet T-NR and E_a but is expected to fail the requirement at theta^w (and less
clearly at the deletion and sign-twist members, which keep the constant term).
