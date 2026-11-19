# c9-eh-dual-r5-target-excess: is there a target-specific excess in the cancellation over non-principal rows (E-H)

Internal working note, 2026-11-18. Slug `c9-eh-dual-r5-target-excess`. Kind: deepen (round 9; predecessor
`c8-eh-nonprincipal-row-cancellation` and its REFEREE.md). Not refereed. Nothing committed, pushed or posted. Only
this directory was written (plus `~/rh-push/c9-eh-dual-r5-target-excess/` on the compute server).

All computations are in the function-field model F_q[T] of the predecessor (q = 7). No statement about zeros of zeta
or of any number-field L-function is made. 7/8 (unrefereed sources) stands; RH open. NO QED.

Labels: PROVED / PROVED-sketch (argument given, constants not computed, not refereed) / CLASSICAL / EXACT (identity
between exact integers) / MEASURED (real numbers computed from exact integers) / ARGUED / OPEN.

## 0. Verdict

**Absent. The pre-registered criterion for a target excess fails at every size (r = 3, 4, 5). Second same-kind
obstruction for (E-H); proposal: close (E-H) in the model with the wording of section 6. Lemma A is settled in
the model (range r < (k + N')/2); the number-field sub-step left is stated in section 2.3.**

1. **Decisive test (EXACT decomposition, MEASURED exponents).** One exact run at r = 5, q = 7, (k, N') = (6, 6),
   d = 6 (113,247 dual frequencies, 19,607 non-principal rows per block, five geometries, 39 weights; compute
   server through `rhrun`, 4 cores, 8 GB limit, peak 2.9 GB, 54 minutes for r = 5), with r = 4 (d = 7; 2800 rows) and r = 3
   (d = 8; 399 rows) at the same (k, N'). Totals agree with the m-side integers of `c7-ff-order2-vertex-exact` in
   14 of 14 available comparisons; the new code path reproduces a round-8 block in 11 of 11 weights, integer for
   integer. Statistic theta = log(T1/|NP|)/log U, mean over the four geometries with N >= 3:

   | size | target a | target b | Liouville twist lnu | random multiplicative (9 seeds) mean, sd | random non-multiplicative (8 seeds) mean, sd | aligned vector W = mu | E_a | E_b | S |
   |---|---|---|---|---|---|---|---|---|---|
   | r = 3, U = 399 | 0.263 | 0.391 | 0.478 | 0.335, 0.067 | 0.400, 0.102 | 0.069 | -0.137 | -0.009 | 0.102 |
   | r = 4, U = 2800 | 0.338 | 0.417 | 0.377 | 0.393, 0.048 | 0.417, 0.076 | 0.059 | -0.079 | +0.000 | 0.076 |
   | r = 5, U = 19,607 | 0.455 | 0.389 | 0.383 | 0.446, 0.051 | 0.371, 0.046 | 0.082 | +0.009 | -0.057 | 0.051 |

   E = theta(target) minus the larger of the two control class means; S = larger seed standard deviation. The
   rule (PREREG.md, written before the r = 3, 4, 5 runs) requires E > S at two sizes for both targets. It holds at no
   size for either target. The round-8 gap (0.5 against 0.28 to 0.44) is inside the spread over seeds
   (0.05 to 0.10 for the mean over four geometries; 0.04 to 0.19 for a single geometry).
2. **What the cancellation is (PROVED, linear algebra; MEASURED size).** NP is a linear functional of the weight:
   NP(W) = Sum_A W(A) K_NP(A) with K_NP independent of the target (Lemma D). For random signs
   E|NP|^2 = ||K_NP||^2. The targets sit at |NP|/||K_NP|| = 0.06 to 1.4, with ranks among 16 random seeds
   spread over the whole range (section 4.3). The cancellation exponent of a generic vector is 0.27 to 0.37 at
   r = 5. So the observed cancellation is a property of the row functional (quasi-orthogonality of the row kernels),
   the same for the target, for sign-twisted primes and for non-multiplicative weights. It is the norm-type saving,
   whose value in the model ledger is capped by Theorem K' of round 8.
3. **Lemma A in the dual decomposition (PROVED-sketch in the model for q large at fixed degrees; EXACT check).**
   For the aligned vector W = mu (reciprocal zeta/zeta(2s), pole at s = 1) the principal row is
   Princ = -(q - 1) Sum_{A squarefree, deg N'} phi(A) exactly (checked as integers), of size q^(k+N'+1), and every
   non-principal row is a coefficient of L(t, chi_u)/L(t^2, chi_u^2) times a coefficient of L(t, chi_u), of size
   q^((k+N')/2) by Weil. Hence |NP| <= T1 << q^(r+1+(k+N')/2) and NP is below Princ when r < (k + N')/2.
   Measured: T1/|Princ| <= 6.4e-4, 5.9e-3, 4.2e-2 at r = 3, 4, 5. In the number field the step left is a first
   moment of the sextic row family at the half line (section 2.3).
4. **Requirements.** No term was found for which multiplicativity is essential (R1 false) and no control fails
   (R3 false): the result is the opposite, a named term (NP) on which target and controls agree. R2, R4 false.
   Score unchanged; ceiling 2/3 (row Z24) not approached.

---

## 1. Plan; reading; relation to closed rows

Read: BRIEF to the end (compute rules, 2026-11-18 update); OBSTRUCTION_MAP rows Z15, Z15b, Z15c, Z24, Z26 and the
controls; RESULT and REFEREE of `c8-eh-nonprincipal-row-cancellation` (identity NP = I - I_1; errors E1 to E8);
`c7-probe-format-h-cap` section 1 (Lemma A) and section 4 (escapes).

Open item: the round-8 referee did not hold "circular" (it is necessity) and did not hold "control-blind" (in even
blocks at q = 7 the weights a, b, lnu, dh sat near theta = 0.5 against 0.28 to 0.44 for thin, rm, rma, n1, n2; one
seed each; not replicated at q = 13). Decide it.

Plan as executed: (i) Lemma D: the dual decomposition with the target isolated, and Lemma A in it; (ii) local
pre-check reproducing a round-8 block; (iii) pre-registration; (iv) exact runs at r = 3 (local), r = 4, 5 (server)
at (k, N') = (6, 6), a degree not covered in round 8 at r = 4, with seeded controls; (v) decision; (vi) no pivot
was needed: the test decided the item.

Not re-run: the LP systems, Theorem K', Lemma 1 of round 8 (confirmed by its referee).

## 2. First lemma: the dual decomposition with the target isolated; Lemma A in it

Conventions of round 8 section 3.1: q = 1 mod 6; chi_c(x) = chi_0(Res(c, x)); J = Sum_{deg m = d} c_k(m) R(m; W);
N' = N + lam; r = k + N' - 1 - d; W an integer function on squarefree monic A of degree N'. Theorem B (general
weight, round 8; totals confirmed by its referee by brute force):

    J = omega q^d G* J',   J' = Diag + Sum_u c_u,
    c_u = Sum over (gamma, g, e, z1), sixth-power-free part of y = z1 g^2 e^5 equal to u, of
          s_gamma mu(g) mu(e) q^(gamma - deg e) wt(z1) I_W(y; g),
    I_W(y; g) = Sum_{c1, deg k1} Sum_{A' squarefree, deg N1, (c1, A') = 1} mu(A') W(gA') chi_{c1}(y) conj chi_{A'}(y),

k1 = k - gamma, N1 = N' - gamma, g squarefree of degree gamma, e | g, deg z1 <= r' = r - 2 gamma + deg e.

### 2.1 Lemma D (target isolated) [PROVED; algebra]

Write a_n(y) = Sum_{c monic, deg c = n} chi_c(y) (the n-th coefficient of L(t, chi^(y)), chi^(y): c -> chi_c(y)) and
for squarefree A'

    a_n(y; A') = Sum_{h | A', (h, y) = 1, deg h <= n} mu(h) chi_h(y) a_{n - deg h}(y)

(the n-th coefficient of L(t, chi^(y)) with the Euler factors at the primes of A' removed). Then

    I_W(y; g) = Sum_{A' squarefree, deg N1} mu(A') W(gA') conj chi_{A'}(y) a_{k1}(y; A'),            (D1)

    c_u(W) = Sum_{A squarefree, deg N'} W(A) K_u(A),
    K_u(A) = Sum_{g | A} Sum_{(e, z1) -> u} s_gamma mu(g) mu(e) q^(gamma - deg e) wt(z1) mu(A/g) conj chi_{A/g}(y) a_{k1}(y; A/g),   (D2)

    NP(W) = Sum_A W(A) K_NP(A),   K_NP = Sum_{u != 1} K_u.                                             (D3)

Proof. Moebius inversion of the condition (c1, A') = 1: c1 = h c', A' = h A''; chi_{hc'}(y) = chi_h(y) chi_{c'}(y),
conj chi_{hA''}(y) = conj chi_h(y) conj chi_{A''}(y), and chi_h(y) conj chi_h(y) = 1 for (h, y) = 1, 0 otherwise.
Re-insert conj chi_{A''}(y) = conj chi_{A'}(y) chi_h(y). (D1) is the line of `dual.py` that forms the phase
chi_h(y) conj chi_{A'}(y) with weight mu(h) mu(A') W(gA') and convolves with a_{k1 - j}. (D2), (D3): collect by
A = gA'. No property of W is used.

Consequences.

- **The target enters every row linearly and only through W.** K_u and K_NP do not depend on the target. For
  independent random signs W, E|NP(W)|^2 = ||K_NP||_2^2 exactly (lam = 0; for marks the same with K pulled back to
  the base weight). "Cancellation over the non-principal rows for a generic vector" is the inequality
  ||Sum_u K_u|| < Sum_u ||K_u||: quasi-orthogonality of the row kernels, a property of the device.
- **The target-specific term of row u.** For W = eta completely multiplicative and unimodular, the h-expansion of
  (D1) gives, for each h, eta(h) mu(h) times the coefficient of degree N1 - deg h of the reciprocal

      1 / L^(ghy)(t, eta conj chi^(u))   (Euler factors at g h y removed),

  times a_{k1 - deg h}(y). So row u carries the twisted reciprocal 1/L(s, eta conj chi_u), row u = 1 carries
  1/L(s, eta) (this is I_1 of MS (10.5) in the model), and the target excess asked for in (E-H) is a statement
  about the family {1/L(s, eta conj chi_u)}_u summed with the fixed coefficients a_{k1}(y) and wt(z1).
- **Where multiplicativity would enter.** Only in the passage from Sum_{A'} mu(A') eta(A') conj chi_{A'}(y) to
  1/L(t, eta conj chi_u). The decomposition (D1) to (D3) holds for any W. A target excess would have to come from
  a relation between the reciprocals for different u (a correlation of 1/L(s, eta conj chi_u) with the row
  coefficients a_{k1}(y) across u). Section 4 finds none at r <= 5.

### 2.2 Lemma A in the dual decomposition, model statement [PROVED-sketch for q -> infinity at fixed (k, N', d); EXACT check at q = 7]

Aligned vector of Lemma A (`c7-probe-format-h-cap` section 1): eta' = eta eps, eps(P) = -conj eta(P), so
mu(A') eta'(A') = mu^2(A'); in the model this is the weight W = mu. For it:

(a) Principal row. u = 1 needs y = z1 g^2 e^5 to be a sixth power; g squarefree and e | g force g = e = 1, and for
r <= 5 only z1 = 1. So Princ(mu) = s_0 wt(1) #{(c1, A'): deg c1 = k, A' squarefree of degree N', (c1, A') = 1}.
For k >= N' and r >= 1: **Princ(mu) = s_0 (q - 1) Sum_{A' squarefree, deg N'} phi(A')**, of size
(q - 1) q^(k+N') (1 + O(1/q)). EXACT check at (k, N') = (6, 6): Sum phi = 10,357,516,512 and
Princ(mu) = -62,145,099,072 = -(q - 1) Sum phi in the r = 3, 4, 5 files (`lemmaA_check.log`). Diag(mu) = Princ(mu)/6
exactly there. This is the pole at s = 1 of zeta/zeta(2s).

(b) Non-principal rows. For u != 1 the character chi^(y) is non-principal of conductor dividing rad(y), so
L(t, chi^(y)) is a polynomial of degree < deg rad(y) with inverse roots of modulus q^(1/2) or 1 (Weil; CLASSICAL),
and |a_n(y)| <= binom(deg y, n) q^(n/2). With W = mu, (D1) is
mu(g) Sum_h mu(h) 1_{(h, gy) = 1} a_{k1 - deg h}(y) b_{N1 - deg h}(y; gh), where b_n is the coefficient of
L(t, conj chi^(y)) / L(t^2, (conj chi^(y))^2) with the factors at gh removed; |b_n| <= C q^(n/2) with C depending on
the degrees only (the denominator has its poles on |t| = q^(-1/4) or, if chi^2 is principal, none inside
|t| < q^(-1/2); the removed factors have poles on |t| = 1). Summing over the q^j values of h:
|I_mu(y; g)| <= C' q^((k1 + N1)/2). Summing over (gamma, g, e, z1) with the weights q^(gamma - deg e) (q - 1):

    T1(mu) = Sum_{u != 1} |c_u(mu)| <= C'' (q - 1) q^(r + (k + N')/2).

(c) Conclusion. |NP(mu)| / |Princ(mu)| <= T1(mu)/|Princ(mu)| <= C''' q^(r - (k+N')/2): **for r < (k + N')/2, that
is d > (k + N')/2 - 1, the non-principal rows of the aligned vector are below its principal row**, J'(mu) =
(7/6 + o(1)) Princ(mu), and a low estimate blind to the phases of the weight is at least the principal size:
B >= 1 in the format. This is the ARGUED step of Lemma A, in the model, with its range. Outside the range
(dual longer than the square root of the signal length) the termwise bound does not give it.

Check at q = 7, (k, N') = (6, 6), where (k + N')/2 = 6 (`extra.txt` (1)); maximum over the four geometries N >= 3:

| r | |NP(mu)|/|Princ(mu)| | T1(mu)/|Princ(mu)| | q^(r-6) |
|---|---|---|---|
| 3 | 4.9e-4 | 6.4e-4 | 2.9e-3 |
| 4 | 3.4e-3 | 5.9e-3 | 2.0e-2 |
| 5 | 2.7e-2 | 4.2e-2 | 1.4e-1 |

Also theta(mu) = 0.06 to 0.08: the rows of the aligned vector add with almost no cancellation (|NP|/T1 = 0.19 to
0.77), as a sum of coefficients of L-functions with coherent main parts should.

The constants C depend on the degrees (binomial factors); for fixed q and degrees tending to infinity the statement
is q^(o(degree)) weaker and is labelled ARGUED in that regime.

### 2.3 Lemma A in the number field: the exact sub-step left [OPEN; stated, not opened]

The same computation in MS (10.5) for eta' gives row u the Dirichlet series L(s, conj chi_u)/L(2s, conj chi_u^2)
times local factors, holomorphic on Re s > 1/2 unconditionally (as `c7-probe-format-h-cap` noted). The remaining
step is the size of the sum over rows:

    (A-rows)   Sum over sixth-power-free u != 1 with N(u) <= Z^h of |row_u(eta')|  <<  Z^(C(1) - delta),

where each row is a contour integral at Re s = 1/2 + eps of L(s, conj chi_u)/L(2s, conj chi_u^2) against the probe
kernel. It follows from a first-moment (mean Lindelof) bound for the sextic family,
Sum_{N(u) <= U} |L(1/2 + eps + it, chi_u)| << (U (1 + |t|))^(1+eps), in the range "number of rows times square root
of the signal length < signal length" (the model range r < (k + N')/2); with the convexity bound per row it
follows in a shorter range. Neither bound was derived from the sextic large sieve of the manuscript here, and the
bound for 1/L(2s, chi_u^2) at Re s = 1/2 + eps (edge of absolute convergence) is elementary. This is the only item
between Lemma A and PROVED-rel MS Lemma 7.1; it is a statement about the row family, not about the target.

## 3. Decisive test: design, code, validation

**Pre-registration** (`PREREG.md`, written after the pre-check and before the r = 3, 4, 5 runs were started). Blocks q = 7, (k, N') = (6, 6): even (6 | k - N'), complete row range d >= N'. Sizes
d = 7 (r = 4) and d = 6 (r = 5); r = 3 (d = 8) as an extra. Geometries (N, lam) = (6,0), (5,1), (4,2), (3,3),
(2,4); decision on N >= 3. Statistic theta = log(T1/|NP|)/log U. Rule: with
E = mean over geometries of theta(target) - max(class mean of rm, class mean of n) and S = max over the two classes
of the standard deviation over seeds of the geometry mean, the excess is REAL iff E > S at both sizes for both
targets a, b.

**Weights** (39): (a) targets a, b (quadratic characters of conductor T^3 + 2, T^3 + T + 1; the Moebius factor of
1/L is in the kernel); (b) lnu = mu nu_a; (c) rm:1..8 and the round-8 rm (random completely multiplicative signs;
the sign-twisted-primes control), rma:1..8 and rma (nu_a times such signs; unimodular twist of the target);
(d) n:1..8 and n1, n2 (random signs, not multiplicative), g:1..4 (random integers in {-3..3});
(e) aligned vector W = mu (section 2.2) and W = 1; also dh = nu_a + nu_b and thin as in round 8.

**Code.** `dual_c8.py` is a byte copy of round 8's `dual.py` (sieve, characters, weights). `dual5.py` evaluates the
same formula with all weights at once, the frequencies split over RH_WORKERS processes, seeded weights, and stores
every row value c_u in Z[zeta_6] for every weight (the `rows` field of the jsonl files). Arithmetic: integer
histograms; int64 below 2 x 10^13 before the multiplication by q^(gamma - deg e) wt, Python integers after.

**Validation.**
- `precheck.py` / `precheck.log` (local, `scripts/memcap.sh 8`, 14 s): block (k, N, lam, d) = (5, 3, 2, 5), r = 4:
  U, NP^2, Sum |c_u|^2, Princ^2, Diag, |J'|^2, |J|^2 and the frequency count identical to round 8 for 11 of 11
  weights.
- Exact |J|^2 against the m-side block files of `c7-ff-order2-vertex-exact` (different code path) for the new
  blocks: 14 of 14 identical, all at r = 5 (geometries (3,3), (2,4) at d = 6; weights a, b, mu, n1, n2, dh, t where
  that lane has them). The blocks at d = 7, 8 with k = 6 have no reference there.
- As in round 8 the comparison checks the sum over rows, not the assignment of terms to rows.

**Runs.** r = 3: local, single process, 2.9 minutes, below 1 GB. r = 4 and r = 5: compute server, one unit
`rh-c9-ehdual-1119015039` through `rhrun c9-ehdual 8 4` (planned memory printed: at most 4.8 GB for 4 workers;
peak 2.9 GB; about 4 CPU-hours; wall about 65 minutes; r = 5: 511 to 816 s per geometry). `rhstatus` was checked before
launch (slice at 12 of 150 GB). The unit ended by itself; no other unit was started; nothing was killed.

## 4. Results

Full tables: `an_r3.txt`, `an_r4.txt`, `an_r5.txt` (per block and weight), `extra.txt`.

### 4.1 Pre-registered decision [MEASURED from exact integers]

Mean of theta over the geometries (6,0), (5,1), (4,2), (3,3):

| class | r = 3 | r = 4 | r = 5 |
|---|---|---|---|
| target a | 0.263 | 0.338 | 0.455 |
| target b | 0.391 | 0.417 | 0.389 |
| lnu (Liouville twist of the target) | 0.478 | 0.377 | 0.383 |
| dh | 0.455 | 0.470 | 0.397 |
| thin | 0.189 | 0.406 | 0.334 |
| rm, 9 seeds: mean (sd; min, max) | 0.335 (0.067; 0.260, 0.490) | 0.393 (0.048; 0.331, 0.499) | 0.446 (0.051; 0.395, 0.564) |
| rma, 9 seeds | 0.316 (0.084) | 0.361 (0.077) | 0.387 (0.063) |
| n, 8 seeds | 0.400 (0.102; 0.266, 0.563) | 0.417 (0.076; 0.295, 0.522) | 0.371 (0.046; 0.310, 0.478) |
| g, 4 seeds | 0.400 (0.073) | 0.426 (0.051) | 0.376 (0.027) |
| W = mu (aligned) | 0.069 | 0.059 | 0.082 |
| W = 1 | 0.082 | 0.079 | 0.114 |
| E_a, E_b; S | -0.137, -0.009; 0.102 | -0.079, +0.000; 0.076 | +0.009, -0.057; 0.051 |

**E > S: false for a and for b at r = 3, 4, 5. Outcome: ABSENT.** Neither target is above every control seed at
any size. Restricting to the ledger region of round 8 (lam >= 1 and k + lam > d: (5,1), (4,2), (3,3) at r = 5;
(4,2), (3,3) at r = 4) does not change the outcome: per geometry at r = 5, theta_a = 0.301, 0.653, 0.489 and
theta_b = 0.498, 0.388, 0.352 against seed ranges [0.347, 0.470], [0.344, 0.663], [0.379, 0.921] (rm) and
[0.242, 0.478], [0.311, 0.725], [0.213, 0.419] (n).

No record with N >= 3 has NP = 0. The geometry (2,4) is degenerate, as assumed in the pre-registration: unrelated
weights give identical integers there (n:8 has the values of a, n:7 those of b), so NP depends on the weight
through very few linear statistics.

### 4.2 The round-8 lean, re-read

Round 8 (referee's recomputation, even blocks, one seed per control): 0.50 to 0.55 for a, b, lnu, dh against 0.28
to 0.44 for thin, rm, rma, n1, n2. With seeds, a single random multiplicative or random non-multiplicative weight
ranges over 0.19 to 0.92 in one geometry at r = 4, 5, and class means over four geometries have standard deviation
0.05 to 0.10. A difference of 0.1 to 0.2 between single weights is inside this spread. At r = 4 the legacy weights
n1, n2 (0.307, 0.383) are themselves at the low end of the n class (mean 0.417), which is what produced the gap.

### 4.3 Normalised size: the target against the norm of the functional [MEASURED]

By Lemma D, l2 := (mean over the 8 n-seeds of |NP|^2)^(1/2) estimates ||K_NP|| (relative accuracy about 25%).
R(w) = |NP(w)| / l2:

| r | (N, lam) | R(a) | R(b) | R(lnu) | 16 rm and n seeds: min, median, max | rank of R(a), R(b) among the 16 |
|---|---|---|---|---|---|---|
| 4 | (6,0) | 0.48 | 0.82 | 0.30 | 0.06, 0.75, 1.70 | 5, 10 |
| 4 | (5,1) | 0.44 | 0.61 | 0.40 | 0.05, 0.44, 1.67 | 8, 10 |
| 4 | (4,2) | 0.37 | 0.04 | 0.54 | 0.03, 0.31, 2.66 | 9, 2 |
| 4 | (3,3) | 0.63 | 1.19 | 0.67 | 0.02, 0.68, 1.75 | 7, 12 |
| 5 | (6,0) | 0.24 | 0.67 | 0.96 | 0.18, 0.49, 2.09 | 5, 11 |
| 5 | (5,1) | 0.45 | 0.14 | 0.13 | 0.10, 0.33, 2.06 | 11, 3 |
| 5 | (4,2) | 0.06 | 0.84 | 1.32 | 0.03, 0.73, 1.85 | 1, 9 |
| 5 | (3,3) | 0.11 | 0.42 | 0.30 | 0.00, 0.32, 1.72 | 1, 10 |

The targets are not closer to the kernel of K_NP than random vectors. Not hidden: at r = 5 target a is low in two
of four geometries (geometric mean of R(a) 0.16 against 0.25 for the rm class and 0.67 for the n class); target b
is not (0.43), and at r = 4 both are at the class values (0.47, 0.39 against 0.43, 0.46). This does not meet the
rule and is recorded as a non-significant lean of one target at one size.

Multiplicativity: the rm class has smaller rms |NP| than the n class at r = 5 (ratios 0.39, 0.26, 0.72, 0.27 over
the four geometries) but not at r = 3, 4 (0.45 to 1.21), and the rma class is larger than the n class in most
blocks (0.70 to 3.1). No consistent effect of multiplicativity; if the r = 5 ratio for rm were real it would be
shared by the sign-twisted-primes control and so could not serve R3.

### 4.4 Growth with r [MEASURED]

Per step of r (rows multiply by 7), geometries (6,0), (5,1), (4,2), (3,3): the trivial count T1 of a random weight
grows by 18.4 to 19.6 (r = 3 to 4) and 9.6 to 19.8 (4 to 5); ||K_NP|| (l2) by 5.6 to 10.9 and 6.1 to 9.2. The
generic exponent log(mean T1 / l2)/log U is 0.21 to 0.37 (r = 3), 0.30 to 0.35 (r = 4), 0.27 to 0.37 (r = 5) over
n-seeds: at or below the random-phase level 1/2, stable in r. The targets' |NP| grow by factors 0.9 to 12.9 (a)
and 0.4 to 131 (b) per step: geometric mean of the eight steps: a 3.9, b 7.9, l2 7.9 (b's 0.4 and 131 are one small value at r = 4,
(4,2)). Target b grows like the norm of the functional; target a grows more slowly over these two steps, which is
the lean of a at r = 5 recorded in 4.3.

## 5. Controls

| control | status in this lane |
|---|---|
| sign-twisted primes (rm, 9 seeds) | Same theta as the targets at every size (0.335, 0.393, 0.446 against a: 0.263, 0.338, 0.455; b: 0.391, 0.417, 0.389). The device does not separate it. |
| unimodular twist of the target (rma, 9 seeds; thin) | Same range (0.316 to 0.387; thin 0.19 to 0.41). Not separated. |
| non-multiplicative weights (n, g; 14 seeds) | Same range (0.371 to 0.426). Not separated. This is the Beurling-type / no-Euler-product control of the model. |
| aligned vector (Liouville type, pole at s = 1; W = mu) | theta = 0.06 to 0.08, |NP| far below Princ (section 2.2). This is Lemma A: a phase-blind low estimate has B >= 1. It is the only weight class that the row sum distinguishes, and it is distinguished by the pole, not by zeros. |
| Davenport-Heilbronn | dh = nu_a + nu_b is linear in the targets and, as the round-8 referee noted (E4), satisfies the model Riemann hypothesis; it is not an off-line control here. theta = 0.455, 0.470, 0.397. No off-line weight with a functional equation was constructed in the model. |
| backward heat, zeta(s+a) zeta(s-a), T-NR, phase-rotated transfer operator, theta^w | No analogue in this finite model; not tested. Since no positive mechanism is claimed, none is owed. |

## 6. Consequence for (E-H); proposed wording

Round 8 established (referee's surviving claim): NP = I - I_1; a bound for NP at level E is necessary and
sufficient, given the low estimate and the remainder of row 1, for the Prop. 2.1 output at B_E; termwise and norm
treatments give nothing below 5/6 in the model ledger; target-specific treatment undecided.

This lane adds: (i) NP is a fixed linear functional of the weight (Lemma D); (ii) at r = 3, 4, 5, with 399 to
19,607 rows and 8 to 9 seeds per control class, the targets show no cancellation beyond that of random
multiplicative and random non-multiplicative weights (pre-registered rule fails at every size); (iii) the
cancellation present is that of a generic vector, i.e. norm type, which round 8's Theorem K' caps at
1 - 1/r + lx/r + l(1/2 - 1/r) in the model ledger.

Proposed status (not applied to the map): **(E-H) closed in the model as a source of a target-specific input:
second obstruction of the same kind (round 8: necessity and norm cap; round 9: no target excess at r <= 5).** It
is not a theorem that no proof of (E-H) from the rows exists: the test is pre-asymptotic (q = 7, one (k, N'),
r <= 5 < 6 where the first non-constant principal frequency appears), and necessity (E1 of the referee) stands
unchanged. What would reopen it: a relation among the reciprocals 1/L(s, eta conj chi_u) across u (section 2.1,
third bullet) that is not a norm bound; none is known and the data give no sign of one.

Proposed map row (not applied): Z15d, replacing round 8's proposal: "(E-H): NP = I - I_1 (necessity; round-8
referee). NP is a linear functional of the weight with target-independent kernel. F_q[T], q = 7, (k, N') = (6, 6),
r = 3, 4, 5, exact: cancellation exponent of targets 0.26 to 0.46, of random multiplicative signs 0.34 to 0.45, of
random non-multiplicative signs 0.37 to 0.42 (seed sd 0.05 to 0.10): no target excess; aligned vector 0.06 to 0.08
with NP below Princ (Lemma A in the model, range r < (k+N')/2). Status: MEASURED; norm treatment capped (Theorem
K', model ledger); target-specific treatment: no evidence; controls rm, rma, n not separated."

## 7. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 (all primes together, multiplicativity essential) | false | Lemma D holds for arbitrary W; the only step where multiplicativity enters (row u carries 1/L(s, eta conj chi_u)) produced no measurable effect: random non-multiplicative weights have the same theta (4.1) and the same R (4.3). |
| R2 (height-uniform, every window) | false | Finite model blocks; no statement about zeros or heights. |
| R3 (fails for every control for a structural reason) | false | The opposite was measured: sign-twisted primes, unimodular twists and non-multiplicative weights are not separated from the targets by NP. Only the aligned vector is separated, by its pole. No named term inside the 7/8 architecture has R3. |
| R4 (reaches the critical line) | false | Nothing passes below the model ledger values; ceiling 2/3 (Z24) untouched. |

## 8. Three weakest steps

1. **Pre-asymptotic, one prime power, one (k, N').** q = 7, (k, N') = (6, 6), r <= 5 (for r <= 5 the only
   principal frequency is the constant). The seed spread shrinks with r (0.10, 0.08, 0.05) and E_a moves from
   -0.14 to +0.01; an excess smaller than about 0.05 in theta, or one that sets in at r >= 6 or at larger degree,
   is not excluded. Target a at r = 5 has R = 0.06 and 0.11 in two geometries (rank 1 of 16); with four
   geometries and two targets this is not significant, and it is not present for b. A run at r = 6 (d = 5 is the
   short range d < N'; a complete range needs (k, N') = (7, 7), d = 8, about 7 times the cost per frequency) would
   test it.
2. **Row assignment and the statistic.** Only totals are validated against an independent code path (14 of 14 here;
   round-8 referee's brute force for general W). T1 and U depend on the definition of a row (sixth-power-free part
   of the dual frequency). theta mixes |NP| with T1, which differs by weight; section 4.3 gives the normalisation
   that does not, with ||K_NP|| estimated from 8 seeds (about 25%).
3. **Lemma A.** In the model: constants depend on the degrees (binomial factors), so the statement is for q large
   at fixed degrees, checked exactly at q = 7 only for (6, 6); the Weil-bound step for the coefficients b_n with
   removed Euler factors is sketched, not written out. In the number field the sub-step (A-rows) of section 2.3 is
   open here. The off-line control (E4 of the round-8 referee) is still missing from the model.

## 9. Compute record and files

Local (Mac), every run through `scripts/memcap.sh 8`, interpreter `push/b-volterra-norm/venv/bin/python` (read
only): `precheck.py` (14 s), `dual5.py 7 6 6 8` (r = 3; 2.9 min), the Lemma A check (seconds), analysis scripts.
Server: one unit through `rhrun` (8 GB, 4 cores), see section 3; ended by itself; verified inactive.

- `PREREG.md`: pre-registration.
- `dual_c8.py` (byte copy of round 8 `dual.py`), `dual5.py`, `job.sh`, `precheck.py`, `precheck.log`.
- `r3_q7_k6.jsonl`, `r4_q7_k6.jsonl`, `r5_q7_k6.jsonl`: per block, exact row values for all weights and the
  round-8 statistics (62 MB for r = 5). `run_r3.log`, `server_run.log`.
- `analyse5.py`, `an_r3.txt`, `an_r4.txt`, `an_r5.txt`; `extra.py`, `extra.txt`; `lemmaA_check.log`.
- `lanes_line.json`.
