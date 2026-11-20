# c8-ek-ff-reflected-rows-exact: hypothesis (E-K) over F_q[T] in exact arithmetic, and the compensated probe (12.5)

Internal working note, 2026-11-18/19. Slug `c8-ek-ff-reflected-rows-exact`. Kind: compute (heavy lane). One
same-agent check (`REFEREE.md`); no independent referee. Nothing committed, pushed or posted. Written: this directory
and `~/rh-push/c8-ek-ff-reflected-rows-exact/` on the compute server (through `rhrun`).

This note supplies **no statement about zeta** and no statement about zeros of any number-field L-function. It is a
function-field model computation in which the Riemann hypothesis for the targets is Weil's theorem. 7/8 (unrefereed)
stands; RH open. NO QED.

Labels: PROVED (argument given here; inputs named) / PROVED-rel X / EXACT (equality of exact integers, on the stated
number of cases) / MEASURED (ratios and logarithms of exact integers; no identity claimed) / ARGUED / NOT-RUN / OPEN.

## 0. Verdict

**Precise obstruction. In the model the row energy is the non-coherent part (at most about the diagonal) plus the
squared signal of the probe. (E-K) is therefore true for a Weil target exactly where the squared signal is below
the diagonal, and it is false for the same target where the dual length is long. It does not separate the target
from generic vectors. The score rule is not met; no headline change.**

1. **Object computed (neighbouring object; the assigned one is NOT-RUN).** The squarefree, sharp-degree marked rows
   B_m = R_{N,lam}(m; w) of the c7 transcription (section 2), unreflected. The reflected and completed rows of the
   manuscript (cube part L_0, factor alpha, smooth weights, excluded set S) were not built: **NOT-RUN**. The statistic
   Sum_m |B_m|^2 does not depend on the representation of the row (a reflection is an identity between the same
   numbers), so the reflection enters only through the predicted sizes; the completion changes the object and is not
   covered.
2. **Thresholds, bulk of the range (section 4.1, 4.2).** K-region = N - lam < d < N + lam (both the unreflected
   column count q^(N+lam) and the reflected dual length q^(2d+lam-N) exceed the number of rows q^d). Exponent
   a = log_q(||B||^2/||beta||^2)/d. For N >= 2, lam <= 6, d >= 3: a <= 1.05 in every configuration, for target a
   (65 at q = 7, largest a 1.010; 18 at q = 13) and target b (50 at q = 7). Three largest sizes of the family
   (n, n, n): energy/diagonal 1.085, 1.012, 0.998 at n = 3, 4, 5 (q = 7), fitted slope 0.979 (target a) and 1.006
   (target b); 1.015, 0.969, 1.000 at n = 2, 3, 4 (q = 13), slope 1.000. Hilbert-Schmidt (K-loss) slope of the
   family: 2; aligned vector: 1.90. By the rule: **(E-K) holds in the model there.**
3. **Thresholds, long marks (section 4.4).** Where the dual length r of the probe exceeds 3N the same targets
   exceed the diagonal: (N, lam, d) = (1, 8, 2), (1, 8, 4): energy/diagonal 7.96 and 14.6 for target b (a = 1.49,
   1.32); (2, 10, 2): 4.13 for target a (a = 1.33), a value predicted before the run from the coherent term
   (predicted 4.4 to 5.7; the other predictions of that run: section 4.4). These exponents are above 1.15 and far
   below the Hilbert-Schmidt exponent (4.5 and 5 there). By the rule: **(E-K) is false in the model there**,
   although RH holds for the target. The line r = 3N is the line h = 3 of the format, abscissa 1/2.
4. **Controls (section 7).** At the diagonal level wherever the targets are: random unimodular vector (r1), random
   non-multiplicative signs (n1), random completely multiplicative signs (th; the non-periodic class), the
   two-character sum (dh), the Moebius-twisted target (mn). Above the diagonal throughout: w = mu (energy/diagonal
   up to 250 at q = 7 and 348 at q = 13, the squared sixth-power count times a density, far below the
   Hilbert-Schmidt size) and the sign twist with a large Moebius sum (tb). At the Hilbert-Schmidt size: the aligned
   vector only (up to 2.8e7). The pre-registered expectation "a random unimodular vector must show the K-loss size"
   is false as stated: the mean over random phases of the row energy is exactly the diagonal (Lemma R, PROVED;
   forty seeds: 0.991 +- 0.009). In the long-mark configurations r1 stays at the diagonal (0.89 to 1.09) while the
   targets leave it.
5. **Structure (section 5; the result of this lane).** For every real weight computed,

       row energy / diagonal  =  n + B_coh,        B_coh = Sum_{k <= d/2} |J_k|^2 / (||c_k||^2 diagonal),

   where J_k is the probe value against the sextic Gauss-sum row c_k, |J_k| = wt_k q^d |S_cop(k)| is the Moebius sum
   of the row weight times the number of sixth-power dual frequencies, and n is the non-coherent part. B_coh is
   computed from exact integers. Measured: n lies between 0 and about 1.1 (q = 7, weights other than mu, 110 to 130
   configurations per weight with dual lengths <= 5: 5% and 95% points 0.26 to 0.34 and 1.02 to 1.09, median 0.95
   to 0.99); for w = mu the excess e - 1 is 0.96 (q = 7) and 0.92 (q = 13) times B_coh in the median. The
   inequality e >= B_coh at dual length 0 is PROVED-rel c7 Proposition 3 (Bessel). So in the model (E-K) for a
   vector is, to this accuracy, the bound B_coh << 1: a power saving q^(-r/6) for the Moebius sum of its own
   weight, which is the statement Proposition 2.1 would output from the same block. It is not an independent input.
6. **Compensated probe (section 6).** In the model the rescaled term of (12.5) equals in absolute value, as an
   identity of exact integers (40 of 40 blocks with dual length 0), pi(lam) wt q^d |S^base_cop(k - lam)|: the part of
   the marked signal carried by the moduli c divisible by the marked prime. Its size relative to the marked term is
   about q^(-lam) in the blocks that obey the signal law (0.18 to 0.23 at lam = 1, 0.024 to 0.025 at lam = 2,
   q = 7). **h > 1 survives the subtraction.** The low separation of the compensated probe contains the unchanged
   marked rows, so its low input still contains the squared signal.

ORDER-2 through (E-K): the escaping hypothesis of `c7-probe-format-h-cap` section 4 is, in the model, the conclusion
restated. At the vertex it was meant for (h = 4/3) it is true where RH is true; it fails exactly for the vectors
whose own Moebius sum is too large for the dual length, targets included.

## 1. Requirement flags as stated before the runs; plan; relation to closed rows

Stated before the production runs (expectation, then confirmed by the data; the final table is section 8):

| flag | expectation before work |
|---|---|
| R1 | false: Sum_m \|B_m\|^2 is a quadratic form in the coefficient vector; no step uses an Euler product. It could become true only if the statistic separated the multiplicative targets from every control |
| R2 | false: a function-field model at fixed q and bounded degree; no statement about zeros |
| R3 | false unless (E-K) fails for every control; a random vector has energy equal to the diagonal in the mean, so this cannot happen |
| R4 | false: by the assignment no headline change; (E-K) is a hypothesis inside the 7/8 architecture |

Read: BRIEF to the end (rhrun rules, 2026-11-18 update); `c7-probe-format-h-cap/RESULT.md` (all; (E-K) is its
section 4); `c7-ff-order2-vertex-exact/RESULT.md`, `ffx.c`, `exact.py`, `analyze.py` (all); OBSTRUCTION_MAP rows Z15,
Z15b, Z15c, Z24, control THIN and the controls section; `r2-ff-tro6-complete/RESULT.md` section 3 (Theorem A,
Lemma R); manuscript `~/lean-deps/qrh-verify/paper.txt`: (6.1), (6.2), Proposition 5.1 (statement), (12.4), (12.5),
section 15.1, (16.1).

Known before: c7-ff measured rows of two Weil targets at the diagonal level for d >= N + lam (67 row vectors), the
weight mu above it, and proved the Bessel inequality (its Proposition 4). c7-probe named (E-K) in the range
Q P > Z and proved that every operator-norm estimate carries the K-loss (Lemma HS).

New here: (i) the range d < N + lam (fewer rows than columns), which is where an operator-norm bound must lose;
(ii) sizes N + lam up to 12 and dual lengths r >= 6 (first staircase step of the sixth-power count);
(iii) the two-sided comparison "energy = non-coherent part + coherent part" from exact Moebius sums, for eight
real weights, and the failure of (E-K) for Weil targets at long dual lengths;
(iv) Lemma R and the aligned vector, which fix what the controls can show; (v) the compensated probe.
No closed route is re-run.

Decisive first test (run first, locally, single thread, exact integers): target a at (N, lam, d) = (2, 2, 4) and
(3, 3, 2): energy/diagonal 1.049 and 0.683; aligned vector at (3, 3, 2) and (2, 2, 2): 518 and 14.2; weight mu at
(3, 1, 3): 4.6. The first value reproduces the c7 block file (4287153570 = 7^4 * 1785570). The server runs sized the
same statement.

## 2. First lemma: definition of B_m, the reflection, and the check against a c7 block file

Conventions are those of `c7-ff-order2-vertex-exact` section 2 (q = 1 mod 6 prime, R = F_q[T], chi_0 of order 6,
chi_A(x) = chi_0(Res(A, x)), g_3(1, A) = sum_{x mod A} chi_A(x)^2 e(x/A), G_2 = G(chi_0^2)).

**Definition (the object computed).** For N >= 0, lam >= 0, d >= 1 and a weight w on monic polynomials,

    B_m = R_{N,lam}(m; w) = sum_{P monic prime, deg P = lam} sum_{A' monic, deg A' = N, P A' squarefree}
                            g_3(1, P A') w(A') chi_{P A'}(m),          m monic, deg m = d

(lam = 0: no P). Coefficient vector beta_A = g_3(1, A) W(A)/|A|, W(A) = sum_{P | A} w(A/P), so |beta_A| = |W(A)|
|A|^(-1/2) and ||beta||^2 = q^(-(N+lam)) sum_A W(A)^2. With R(m) = G_2^(N+lam) (a + b zeta_6), a, b integers,
|R(m)|^2 = q^(N+lam) (a^2 + ab + b^2). The kernel `ffx en` returns the exact integers

    sumnorm = sum_m (a^2 + ab + b^2),   diagsum = sum_A W(A)^2 #{m : (m, A) = 1},   sumW2 = sum_A W(A)^2,

so that sum_m |B_m|^2 = q^(N+lam) sumnorm and the diagonal term of the row Gram form is q^(N+lam) diagsum.
Dictionary: Z = q^N (row length before marks), P = q^lam (mark), Q = q^d (number of rows), M = d/N, l = lam/N.
Range of (E-K), Q P > Z: d + lam > N.

**Manuscript object.** B_{m,sigma}(Z) of (6.1)/(6.2) with the completed series T(s, Psi) = L_0(s, Psi) D(s, Psi) of
Proposition 5.1: D is supported on squarefree n (coefficients gamma_2(n) conj alpha(n) Psi(n)), L_0 is the cube part
(coefficients conj alpha(b)^3 Psi(b)^3 q_b^(-3s+1/2)), and the marked version restricts to D | c n^3 (section 15.1).
The model keeps D with alpha = 1, sharp degree classes and no excluded set, and drops L_0. Squarefree A carry a
proportion 1 - O(1/q) of the diagonal mass of the completed row (the terms with b of degree j have diagonal share
about q^(-j); ARGUED, not computed).

**Reflection.** Proposition 5.1 of the manuscript is the functional equation of T(s, Psi) for Psi = Psi_0 prod
chi_p^(j_p): the row of length Z P with twist of conductor about Q P equals a dual sum of length (Q P)^2/(Z P),
exponent 2M + l - 1 in Z, that is 2d + lam - N here. Its model form for the completed rows was not derived or
verified: **NOT-RUN**. What is used below is only this: a reflection is an identity for each B_m, so Sum_m |B_m|^2
is the same number in both representations; the reflected representation changes the operator whose norm an
estimate would use (dual length q^(2d+lam-N) in place of q^(N+lam)), and Lemma HS of c7-probe bounds that norm
below by max(rows, columns). The exact reflection that is available in the model is the one for the weight mu
(c7 Proposition 2 and F2: the row is the conjugate of the squarefree coprime part of the sextic Gauss-sum row c_N,
and c_{d+1-k} is proportional to c_k); it has dual length d + 1 - N, not 2d - N, and is used in section 5 only
through c7's results.

**Check against the c7 block files (EXACT).** `verify_c7.py`: for every distinct (weight, N, lam) of
`../c7-ff-order2-vertex-exact/blocks_q7_d{2,3,4,5}.jsonl` and `blocks_q13_d{2,3}.jsonl` with N, lam <= 6 and
q^(d+N+lam) <= 1e9, the stored exact integer nr2 = ||R||^2 equals q^(N+lam) sumnorm, and for d >= N + lam the stored
excess over the diagonal equals sumnorm/diagsum - 1:

| file set | row vectors compared | nr2 mismatches | excess values compared | mismatches |
|---|---|---|---|---|
| q = 7, d = 2..5 | 629 | 0 | 277 | 0 |
| q = 13, d = 2, 3 | 96 | 0 | 27 | 0 |

The kernel was changed five times for speed after this check was first passed (prime character tables by powers
of a generator; direct resultants when the modulus is longer than m; factorised phase of g_3(1, P A'); diagonal
without the table W; irreducibility by distinct-degree factorisation). Each version reproduces the previous one as
identical output lines (`v1v2.log`: 155 + 112 + 261 + 180 + 20 lines, 0 differences; sources `ffx_v1.c` to
`ffx_v3.c` kept), the generator tables equal the resultant tables on every prime compared (`ptcheck`: 217 primes of
degree <= 5 at q = 7, 252 of degree <= 6 on the server, 819 of degree <= 4 at q = 13; 0 differing), and the two
irreducibility tests agree on all 134,456 polynomials of degree 5, 6 at q = 7 and 371,293 of degree 5 at q = 13.
The table above was produced while the kernel was being changed (versions two to four, called per configuration);
the versions agree line by line as stated. An independent python brute force from the definitions (norm-form resultant,
complex floats) agrees on 6 configurations (`referee_bf.log`).

## 3. Statistic, predictions, thresholds

    e      = sumnorm / diagsum                                   (1 = diagonal level)
    Enorm  = sumnorm / sumW2 = ||B||^2 / ||beta||^2
    a      = log_q(Enorm) / d                                    (exponent in Q = q^d)
    aK     = min(N + lam, 2d + lam - N) / d                      (smaller Hilbert-Schmidt level over the two representations)

(a) Hilbert-Schmidt / K-loss prediction: a = aK > 1 in the K-region N - lam < d < N + lam. (b) Diagonal: a = 1
(a <= 1 exactly at e = 1, since the diagonal counts only m prime to A). Thresholds as pre-registered: a <= 1.05:
(E-K) holds in the model; a >= 1.15 at the K-loss size: false; otherwise undecided. No real weight reaches the
K-loss size anywhere; exponents >= 1.15 are reported as "false at the threshold" with their distance to aK.
"Fitted exponent at the three largest sizes": least-squares slope of log_q(Enorm) against d along a family of
fixed shape.

**Lemma R (random phases) [PROVED].** Let T be any matrix and beta_A = b_A u_A with fixed b_A >= 0 and u_A
independent, uniform on the sixth roots of unity (or on the circle). Then E ||T beta||^2 = sum_A b_A^2 ||T e_A||^2.
For the row operator, ||T e_A||^2 = #{m : (m, A) = 1}: the mean energy is the diagonal exactly, in every
representation. Proof: E u_A conj(u_B) = 0 for A != B. QED. A random unimodular vector therefore sits at e = 1 up
to fluctuations and cannot show the K-loss; the pre-registered wording of that control is corrected here.

**Lemma AL (aligned vector) [PROVED].** For beta_A = conj(chi_A(m_0)) on the A prime to m_0 (same support and
moduli), ||T beta||^2 >= |B_{m_0}|^2 = (sum_A W(A))^2 >= nsupp^2 in units of q^(N+lam), so e >= nsupp^2/diagsum, about
q^(N+lam-d).
This is the Hilbert-Schmidt size of the unreflected representation, and it is the control that shows what an
operator-norm bound must allow.

## 4. Results: the row energy in the K-region

Weights (all with the same support and coefficient moduli up to the vanishing of the target at its conductor):
a, b: quadratic characters of conductor F = T^3 + 2 and T^3 + T + 1 (q = 7), T^3 + 2 and T^3 + 3 (q = 13; these two
are related by T -> cT with c^3 = 5 and give identical integers in every run, so b is redundant at q = 13); dh = nu_a + nu_b;
n1: random +-1 (not multiplicative); th: random completely multiplicative +-1 (not periodic); tb: completely
multiplicative, eps(P) = -1 with probability q^(-deg P/10) (a sign twist whose Moebius sum is large); mn = mu nu_a;
mu; r1: random sixth roots of unity on A; al: aligned vector.

Runs: q = 7: all (N, lam, d) with 1 <= N <= 7, lam <= 6, d <= 8, d + lam > N, d + N + lam <= 12 (all ten weights)
and = 13 (six weights), plus the larger configurations of section 4.2. q = 13: d + N + lam <= 9 (ten weights), = 10
(six), plus larger ones. `summary.txt` has every table (T1 to T9); `results_q7.txt`, `results_q13.txt` have the
exact integers; `results_q7_corner.txt`, `results_q7_corner2.txt` the long-mark runs. In all: 1773 energies over
189 configurations at q = 7 and 679 over 75 at q = 13.

### 4.1 K-region, N >= 2, lam <= 6, d >= 3 ("bulk"), and the rest

Counts of configurations by the exponent a; e = energy/diagonal as [min, median, max].

| weight | q = 7 bulk: n; a <= 1.05 / between / >= 1.15; e | q = 7, N = 1 or lam >= 7: same | q = 13 bulk | q = 13, N = 1 |
|---|---|---|---|---|
| a | 65; 65 / 0 / 0; [0.713, 1.01, 1.21] | 17; 14 / 3 / 0; [0.378, 1.07, 3.62] | 18; 18 / 0 / 0; [0.913, 0.996, 1.09] | 3; 3 / 0 / 0 |
| b | 50; 50 / 0 / 0; [0.677, 0.99, 1.11] | 16; 7 / 6 / 3; [0.533, 1.86, 14.6] | 11; 11 / 0 / 0 (conjugate of a) | 3; 3 / 0 / 0 |
| dh | 49; 49 / 0 / 0; [0.715, 0.999, 1.15] | 16; 13 / 2 / 1; [0.571, 0.922, 5.45] | 11; 11 / 0 / 0 | 3; 3 / 0 / 0 |
| n1 | 49; 49 / 0 / 0; [0.704, 0.994, 1.43] | 16; 6 / 7 / 3; [0.533, 1.97, 14.6] | 11; 11 / 0 / 0 | 3; 1 / 2 / 0 |
| th | 63; 63 / 0 / 0; [0.746, 1.00, 1.31] | 17; 12 / 5 / 0; [0.378, 1.07, 3.62] | 17; 17 / 0 / 0 | 3; 3 / 0 / 0 |
| mn | 50; 50 / 0 / 0; [0.563, 1.00, 1.22] | 16; 13 / 3 / 0; [0.378, 0.79, 3.62] | 11; 11 / 0 / 0 | 3; 3 / 0 / 0 |
| r1 | 63; 63 / 0 / 0; [0.828, 1.00, 1.13] | 17; 17 / 0 / 0; [0.951, 1.00, 1.08] | 18; 18 / 0 / 0; [0.964, 1.00, 1.03] | 3; 3 / 0 / 0 |
| tb | 62; 49 / 10 / 3; [0.598, 1.11, 6.4] | 17; 3 / 1 / 13; [0.233, 8.3, 69.5] | 16; 13 / 2 / 1 | 3; 1 / 2 / 0 |
| mu | 65; 12 / 5 / 48; [0.05, 8.16, 250] | 17; 3 / 1 / 13; [0.233, 8.3, 69.5] | 18; 4 / 2 / 12; [0.05, 17, 46.1] | 3; 1 / 1 / 1 |
| al | 65; 0 / 13 / 52; [2.26, 83, 5.4e6] | 17; 0 / 3 / 14 | 18; 0 / 1 / 17; [4.1, 54, 7.1e4] | 3; 0 / 1 / 2 |

For N >= 4 in the bulk: e in [0.885, 1.144] (target a, q = 7, 35 configurations), [0.990, 1.056] (q = 13, 6); the
random unimodular vector has [0.905, 1.029] and [0.973, 1.027] on the same sets. At N = 1 the weights a, th, mn give
identical integers, and so do b and n1: on seven linear polynomials the energy depends on the weight only through
its Moebius sums (same |M_1|).

### 4.2 Three largest sizes per family (table T1)

Slope = least-squares slope of log_q(Enorm) against d over the sizes listed. Hilbert-Schmidt slope of each family: 2.

| family, q | weight | sizes (N, lam, d) | e | exponent a | slope |
|---|---|---|---|---|---|
| (n, n, n), 7 | a | (3,3,3) (4,4,4) (5,5,5) | 1.085, 1.012, 0.998 | 0.990, 0.984, 0.986 | 0.979 |
| | b | same | 0.968, 1.012, 0.991 | 0.971, 0.984, 0.985 | 1.006 |
| | th | same | 0.927, 1.014, 0.991 | 0.963, 0.984, 0.985 | 1.018 |
| | r1 | same | 0.937, 0.970, 1.005 | 0.972, 0.983, 0.989 | 1.016 |
| | mu | same | 8.92, 6.55, 35.9 | 1.358, 1.228, 1.357 | 1.355 |
| | al | same | 77.0, 435, 2603 | 1.727, 1.767, 1.797 | 1.902 |
| (n, n, n+1), 7 | a | (3,3,4) (4,4,5) (5,5,6) | 1.045, 0.984, 1.011 | 0.988, 0.984, 0.989 | 0.992 |
| | r1 | same | 0.951, 0.990, 0.998 | 0.981, 0.988, 0.991 | 1.010 |
| | mu | same | 8.91, 6.70, 35.9 | 1.268, 1.185, 1.297 | 1.356 |
| | al | same | 12.0, 63.3, 373 | 1.306, 1.416, 1.498 | 1.881 |
| (n, n, n), 13 | a | (2,2,2) (3,3,3) (4,4,4) | 1.015, 0.969, 1.000 | 0.986, 0.986, 0.993 | 1.000 |
| | r1 | same | 0.938, 1.030, 0.976 | 0.976, 0.997, 0.992 | 1.008 |
| | mu | same | 0.247, 34.9, 26.6 | 0.715, 1.455, 1.314 | 1.913 |
| | al | same | 50.9, 522, 5472 | 1.754, 1.806, 1.833 | 1.913 |
| (n, n, n+1), 13 | a | (1,1,2) (2,2,3) (3,3,4) | 1.638, 0.994, 0.978 | 1.065, 0.988, 0.991 | 0.916 |

The slope of mu is not a growth law: its excess is the coherent part, which jumps with the residue class of
k - N - lam modulo 6 and with the dual length (section 5). Other families (shapes (n, n, n-1), (2j, j, 2j),
(j, 2j, 2j), (n, n-1, n-1)) are in `summary.txt` T1 and give the same picture; the largest further configurations
are (6, 3, 6), (3, 6, 6), (6, 5, 5), (6, 6, 4), (4, 4, 7), (5, 5, 6), (5, 5, 5) at q = 7 (target a: e - 1 =
+0.0016, +0.0164, +0.0339, -0.0038, +0.0031, +0.0106, -0.0016) and (3, 3, 6), (4, 4, 4) at q = 13 (-0.0004, +0.0003).

### 4.3 Aligned vector (table T4) and single rows (table T5)

Aligned vector, K-region: energy/diagonal divided by nsupp/q^d lies in [0.96, 1.18] on the 85 configurations with
nsupp/q^d > 50 at q = 7 and in [0.92, 1.10] on the 29 at q = 13 (all K-region configurations: [0.96, 2.06] and
[0.92, 1.37]). Largest values: 2.8e7 at (2, 10, 2) (q = 7), 1.1e7 at (4, 4, 1) (q = 13). This is the size an
operator-norm bound must allow (Lemma AL); no real weight comes within a factor 400 of it at the same configuration
once nsupp/q^d > 1e4 (38 configurations).

Largest single row against the mean row (K-region, d >= 4): the median of max_m |B_m|^2 / mean is about 10 for the
targets and for the random unimodular vector alike (q = 7: 9.6 and 10.1), and above 1e4 for the aligned vector.

### 4.4 Long marks (table T9)

rmax = N + lam - 1 - d + floor(d/2) is the largest dual length among the probes k <= d/2. q = 7.

| (N, lam, d) | rmax | a (target) | b (target) | th | r1 | mu | al |
|---|---|---|---|---|---|---|---|
| (1, 6, 2) | 5 | 0.625 | 1.60 | 0.625 | 0.952 | 6.49 | 3.3e3 |
| (1, 7, 2) | 6 | 1.58 | 7.49 | 1.58 | 1.09 | 37.1 | 2.0e4 |
| (1, 8, 2) | 7 | 1.78 | 7.96 | 1.78 | 0.999 | 38.9 | 1.2e5 |
| (1, 9, 2) | 8 | 0.020 | 0.017 | 0.020 | 0.997 | 0 | 7.5e5 |
| (1, 10, 2) | 9 | 0.0020 | 0.0017 | 0.0020 | 1.06 | 0.0003 | 4.7e6 |
| (1, 8, 3) | 6 | 1.68 | 6.86 | 1.68 | 1.08 | 32.7 | 1.7e4 |
| (1, 8, 4) | 6 | 3.62 | 14.6 | 3.62 | 1.01 | 69.5 | 2.5e3 |
| (2, 7, 4) | 6 | 1.26 | 1.00 | 3.31 | 1.01 | 32.5 | 2.4e3 |
| (2, 10, 2) | 10 | 4.13 | 1.55 | 11.3 | 0.888 | 173 | 2.8e7 |
| (3, 6, 4) | 6 | 0.974 | - | 0.899 | 1.00 | 36.8 | 2.7e3 |
| (6, 6, 3) | 9 | 0.885 | 1.011 | 1.016 | 0.930 | 245 | 5.4e6 |

- Whether a real weight is above the diagonal is decided by the residue class of k - N - lam modulo 6 and the dual
  length (which probes have sixth-power frequencies) and by the size of its Moebius sum, not by N + lam - d:
  at (1, 9, 2) and (1, 10, 2) no probe has a principal class, and every real weight, mu included, is far below the
  diagonal (the marked prime sum against a modulus of degree 2 nearly cancels), while r1 stays at 1.
- **Prediction test.** `prediction_corner.txt` was written before the unit for (2, 10, 2) and (1, 10, 2) was
  launched, from M_2(w) and the count wt = q^2 - 1 at dual length 9. Predicted / measured energy over diagonal:
  target a [4.4, 5.7] / 4.13 (below the interval by 6%); target b [1.35, 1.55] / 1.55; mu [170, 232] / 173;
  th [10.5, 14.1] / 11.3; r1 "1 within a few percent" / 0.888 (a miss: 49 rows only; the spread over seeds was
  not allowed for); (1, 10, 2): "no excess for any real weight" held, but "within 0.5 of the diagonal" did not:
  the energies are 0.0003 to 0.002 of the diagonal.
- For the Weil targets the excess appears when rmax > 3N and a principal class is present (N = 1: 1.6 to 2.0 for
  target b at rmax = 4, 5 and 7 to 15 at rmax = 6, 7; N = 2: 1.2 for target a at rmax = 6, 7 and 4.1 at rmax = 10),
  and not for rmax <= 3N at N >= 3. In ledger variables r/N = h: the hypothesis fails for the target where the vertex it
  would support lies beyond h = 3, abscissa 1/2.

## 5. Structure: energy = non-coherent part + squared signal

c_k(m) = sum_{deg c = k} g_6(m, c) is the sextic Gauss-sum row (the additive factor of the probe), J_k = sum_m
c_k(m) B_m the probe, r = k + N + lam - 1 - d its dual length, S_cop(k) = sum_A mu(A) W(A) #{c : deg c = k,
(c, A) = 1}. `ffx sc` computes S_cop(k) exactly; it reproduces the S_cop values stored in the c7 block files
(2286 values, 0 mismatches; `referee_sc.log`).

**Proposition C [PROVED-rel c7 Proposition 3 (|J_k|^2 = wt^2 q^(2d) S_cop(k)^2 at r = 0), the exact norms
||c_0||^2 = q^d, ||c_k||^2 = q^(d+2k)(1 - 1/q) for 1 <= k <= d/2 (c7, EXACT there), and their pairwise orthogonality].**

    e = ||B||^2/diagonal  >=  B_0 := sum_{k <= d/2, r(k) = 0} wt_k^2 q^(2d) S_cop(k)^2 / (||c_k||^2 q^(N+lam) diagsum),

wt_k^2 = 1 if 6 | k - N - lam and q otherwise. Hence a bound e <= C gives |S_cop(k)| <= (C ||c_k||^2 q^(N+lam)
diagsum)^(1/2) / (wt_k q^d): a bound for the Moebius sum of the weight. Proof: Bessel's inequality in the span of
the orthogonal c_k. QED.

**Measured law.** Put B_coh = the same sum over all k <= d/2 with |J_k| = wt(r, k) q^d |S_cop(k)|, wt the principal
part of Z_r in Theorem A of `r2-ff-tro6-complete`: for 6 | k - N - lam, wt = 1 (r = 0), q - 1 (1 <= r <= 5),
(q - 1)(1 + q + .. + q^floor((r-1)/6)) - [6 | r] q^(r/6) in general; otherwise wt = sqrt(q) q^(r/6) if 6 | r and 0
if not. This is exact at r = 0, the law tested by c7 for 1 <= r <= 5, and the same count applied for r >= 6
(marked *; it ignores the coprimality of the sixth-power frequencies to c and A). n := e - B_coh.

Non-coherent part n, configurations with lam >= 1, N >= 1, d >= 2, d + lam > N and no starred k (table T8):

| weight | q = 7: configs; min, 5%, median, 95%, max of n | q = 13: same |
|---|---|---|
| a | 130; 0.04, 0.34, 0.99, 1.09, 1.83 | 57; 0.04, 0.14, 0.96, 1.05, 1.61 |
| b | 110; 0.03, 0.26, 0.96, 1.02, 2.07 | 42; 0.04, 0.14, 0.95, 1.02, 1.61 |
| th | 130; 0.04, 0.28, 0.98, 1.04, 1.13 | 55; 0.03, 0.17, 1.00, 1.05, 1.06 |
| tb | 130; 0.00, 0.30, 0.95, 1.42, 7.57 | 54; 0.02, 0.09, 0.85, 1.01, 1.11 |
| mu | 130; -0.05, 0.06, 0.69, 1.42, 7.57 | 56; -0.35, 0.00, 0.60, 1.79, 3.5 |

(dh, n1, mn: as a, b; `summary.txt` T8.) For w = mu, on the configurations with B_coh >= 3: (e - 1)/B_coh has
median 0.96, range [0.77, 2.28] (q = 7, 54 unstarred configurations) and median 0.92, range [0.83, 1.07] (q = 13,
40); with an active term at r >= 6: median 0.75, range [0.62, 1.60] (q = 7, 28 configurations; (1 - 1/q)^2 = 0.73)
and 0.88 (q = 13, 1 configuration).

- The first staircase step of the sixth-power count is present in the row energy: for mu, e - 1 rises from 5 to 9
  (dual lengths <= 5, wt^2 = (q-1)^2 = 36) to 35 to 54 when a probe with r = 6 enters (wt^2 = q^3), and to 245 to
  250 at (6, 6, 3), (6, 6, 4) (r = 9 in the class 6 | k - N - lam, wt = q^2 - 1); at q = 13 from about 35 to
  310 to 350.
- Where B_coh = 0 for every weight (no principal class among the k <= d/2: (N, lam, d) = (3, 6, 5), (6, 3, 5),
  (1, 7, 3), (1, 9, 2), (1, 10, 2) at q = 7), every real weight is at or below the diagonal, mu included
  (e = 0.81, 0.79, 0.30, 0, 0.0003).
- n is at most about 1.1 in 95% of the configurations and can be far below 1 (rows much longer than the modulus:
  the marked prime sum cancels). No weight other than mu and tb has a configuration with n > 2.1 among the
  unstarred ones. With starred k the count is less accurate (n between -1.7 and 6.7 for the non-mu weights other
  than tb), largest deviation at (1, 8, 4).
- So the energy exceeds a fixed multiple of the diagonal only through B_coh, in the data.

**Consequence [ARGUED from the measured law and the count wt ~ q^(r/6)].** With marks, S_cop(k) is about
- pi(lam) q^k M_N(nu) and diagsum about pi(lam) q^(N+d), so B_coh is about (wt^2/lam) |M_N(nu)|^2 q^(-2N) per
principal k. (E-K) at exponent 1 + eps is then the bound |M_N(nu)| << q^(N - r/6 + eps d) sqrt(lam) with
r up to N + lam - 1 - d/2: a power saving for the Moebius sum of the target equal to the sixth-power count. This
is the output of Proposition 2.1 for the same block (signal constant h = r/N). So:
(i) (E-K) is not weaker than the zero-free statement it would be used to prove (c7 Proposition 4), and in the data
it is not stronger either: no other term above the diagonal was found in the energy;
(ii) for a Weil target, |M_N| about q^(N/2), the bound holds iff r <= 3N up to constants, i.e. h <= 3. Beyond that
line (E-K) fails in F_q[T] although RH holds. Section 4.4 shows the onset (N = 1, 2); the power growth in the
degree was not reached;
(iii) the vectors for which (E-K) fails are those with a Moebius sum too large for the dual length (mu, tb at all
lengths; the targets at long dual lengths), not the vectors without an Euler product or without periodicity.

## 6. Second question: the compensated probe (12.5)

**Transcription.** One slot. (12.5) is sum_p W(q_p/P) [ eta(p) I_{eta;p}(X, Y, Z q_p) - q_p^(-3/2) I_eta(X/q_p,
Y/q_p, Z) ]. With I = Q^(-1/2) sum_m A_m B_m, A_m = Y^(-1) sum_s q_s^(-1/2) g(s, m) (modulus 1 per term),
B_m with coefficients of modulus |A|^(-1/2), X = q^(d-k), Y = q^k, the model values are
I(k, N; d) = q^(-d/2 - 3k/2 - N) J(k, N, 0; d) and, with all primes of degree lam in the window,

    marked term   = q^(-d/2 - 3k/2 - N) q^(-lam) J_m,                 J_m = J(k, N, lam; d)
    rescaled term = q^(-d/2 - 3k/2 - N) pi(lam) q^(lam) J_b,          J_b = J(k - lam, N, 0; d - 2 lam)
    C = J_m - pi(lam) q^(2 lam) J_b                                   (common factor removed).

Both have the same dual length r = k + N + lam - 1 - d. `q2.py` computes J_m, J_b and C as exact elements of
Z[zeta_42] (c7's `exact.py`), for q = 7, d = 2..5, lam = 1, 2, N <= 5, weights a, b, n1, mu: 432 blocks.

**Lemma Q (counting) [PROVED].** For P not dividing A', #{c : deg c = k, (c, P A') = 1} = cop_k(A') - cop_{k-lam}(A').
Hence S^marked_cop(k) = - pi(lam) [S^base_cop(k) - S^base_cop(k - lam)] + corr, corr the terms with P | A'.
The marked Moebius sum is minus the number of marked primes times the base sum, plus the part from moduli c
divisible by the marked prime, plus corr.

**Results.**
- EXACT: in the 40 blocks with r = 0 and J_m != 0, |pi q^(2 lam) J_b|^2 S^marked_cop(k)^2 = |J_m|^2 (pi(lam)
  S^base_cop(k - lam))^2. The rescaled term is, in absolute value, the term pi(lam) wt q^d S^base_cop(k - lam) of
  Lemma Q: the scalar prime contribution of the marked term.
- The two terms differ by a unit that is not +-1: cos of the relative phase = +-0.6547 (lam = 1) and +-0.1429
  (lam = 2), i.e. +-sqrt(3/7) and its double-angle value 1/7. The model does not carry the unit normalisations of
  (6.1) (tau, xi, G(A), R(A, s)), so the subtraction is not aligned in the model as written. With the unit removed
  the subtraction S^marked(k) - pi S^base(k - lam) is closer to - pi S^base(k) than the opposite sign in 48 of 52
  blocks with r = 0: the compensated signal is then the base Moebius sum at the same k times the number of primes.
- MEASURED, blocks that obey the signal law (r = 0, or 1 <= r <= 5 with 6 | k - N - lam): rho = |rescaled|/|marked|
  is 0.18 to 0.23 at lam = 1 and 0.024 to 0.025 at lam = 2 (q^(-lam) = 0.143, 0.0204); |C|/|J_m| lies in
  [0.865, 1.166] (lam = 1) and [0.9967, 1.0039] (lam = 2) for either sign of the unit. The shift of the statistic
  h_up of c7 is at most (6/N) log_q(1 + rho): 0.47 at N = 1, lam = 1 and 0.012 at lam = 2.
- Region lx < l (k > d - lam): 111 blocks with J_m != 0; the rescaled term is exactly 0 in 56 (its own dual range
  is empty or its c-row vanishes) and rho <= 0.25 in 77. The 34 blocks with rho > 0.25 are blocks in which the
  marked term is not a signal (no principal class), except one.
- Not exercised: r >= 6, two or more slots, lam >= 3.

**Answers.** (i) h > 1 survives: the subtraction removes a part of relative size q^(-lam) of the marked signal
and leaves a signal of the same order, pi(lam) times the base Moebius sum [EXACT at r = 0 for the modulus;
ARGUED for the sign]. This agrees with a reading of (16.1), not derived here: the multiplier
eta(p) Q^x P*_p/P_p - Q^(-w) loses the term Q^(-w) only. (ii) The low separation of (12.5) has, for the empty rescaled set, the completed
marked row B^emptyset_m, which is the row of sections 4 and 5; Cauchy-Schwarz on that summand is the same
inequality, and Proposition C applies to it unchanged. The low input of the compensated probe still contains the
squared signal [PROVED-rel Proposition C for the model rows; the rescaled summand adds a base row at Q/q_p^2].

## 7. Controls

| control | what was run | outcome | named step |
|---|---|---|---|
| Moebius-twisted weight | mu; mn = mu nu_a | mu: e up to 250 (q = 7), 348 (q = 13); e - 1 = 0.96 B_coh in the median; mn: as the targets | Lemma G of the predecessors (g_3 g_6 = kappa q^N mu): the row of mu is the conjugate sextic row, its Moebius sum is the full count |
| random unimodular vector, same support | r1 | diagonal level in every configuration, long marks included (K-region, d >= 3: e in [0.83, 1.13] at q = 7, [0.96, 1.03] at q = 13); forty seeds at (3, 3, 3): mean 0.991, standard error 0.009; does not show the K-loss | Lemma R: the mean is the diagonal exactly; the pre-registered expectation was wrong |
| aligned vector (added) | al | e / (nsupp/q^d) in [0.92, 1.18] when nsupp/q^d > 50; up to 2.8e7 | Lemma AL: this is the operator-norm size |
| THIN-type, non-periodic | th (random multiplicative signs); tb (sign changes on a set of primes of density q^(-deg/10)) | th: as the targets (same counts in section 4.1; above the diagonal at long dual lengths when its Moebius sum is large, e.g. 11.3 at (2, 10, 2) with M_2 = -10); tb: above the diagonal with B_coh, e up to 69.5 | the Moebius sum of the weight; periodicity plays no role in the statistic |
| DH-type | dh = nu_a + nu_b | as the targets (bulk: e in [0.715, 1.15]; long marks up to 5.45) | none: both characters satisfy Weil's theorem here; the function field has no member with zeros off the line, so this control cannot fail in the model |
| sign-twisted primes | tb, th | as above | as above |
| backward heat, unimodular twist as a family, zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w | not run | - | no positivity or zero statement is made |

The score rule "raise only if (E-K) holds for theta and fails for every control vector" is not met: where (E-K)
holds for the targets it holds for r1, n1, th, dh, mn; where it fails for the targets it holds for r1.

## 8. Requirement flags (result of this lane)

| flag | value | evidence |
|---|---|---|
| R1 multiplicativity essential | false | the energy is a quadratic form; Lemma R, Lemma AL and Proposition C hold for arbitrary weights; non-multiplicative weights (n1, dh, r1) give the same outcome as the targets |
| R2 height-uniform, every window | false | no statement about zeros; fixed q, bounded degree |
| R3 controls fail structurally | false | five control classes pass (E-K) wherever the targets do; mu and tb fail through the size of their own Moebius sum; the random unimodular vector passes where the targets fail |
| R4 reaches the critical line | false | (E-K) in the model is the conclusion restated (section 5) and fails beyond h = 3 (section 4.4); no abscissa is changed |

## 9. Three weakest steps

1. **The object is a neighbour of the one assigned.** Unreflected, squarefree, sharp-degree rows with alpha = 1; no
   cube part, no smooth weights, no excluded set, no ray classes. The exact reflection of the completed rows in
   F_q[T] was not derived, so "reflected, completed" is NOT-RUN and the K-loss prediction is represented only by
   the two Hilbert-Schmidt levels. The energy is reflection-invariant, but the completion changes about a 1/q share
   of the diagonal mass and could carry its own coherent terms.
2. **The law e = n + B_coh with n at most about 1 is measured, not proved.** PROVED is only e >= B_0 (dual length
   0). The count for 1 <= r <= 5 is c7's law; for r >= 6 it is the principal part of Theorem A without the
   coprimality conditions and is high by a factor near (1 - 1/q)^(-2) in most cases and low by 1.6 at (1, 8, 4).
   No argument bounds n; that the energy exceeds the diagonal only through B_coh rests on 110 to 130 (q = 7) and
   42 to 57 (q = 13) configurations per weight with N + lam <= 12 and r <= 10. The statement "(E-K) fails for a
   Weil target beyond r = 3N" is seen at its onset only (N = 1 and N = 2, energies 4 to 15 times the diagonal,
   one of them predicted in advance); a growth law in the degree was not measured, and q = 13 has no long-mark
   run.
3. **Finite degrees and the exponent test.** d <= 8, and in the K-region d <= 7; an exponent difference of 0.05
   at d = 5 is a factor 1.6 (q = 7). The verdict "a <= 1.05" in the bulk is unambiguous only because e itself is
   within a few percent of 1 for N >= 4. The long-mark exponents (1.3 to 1.5) are computed at d = 2 to 4, where
   a factor 4 to 15 is all that separates them from 1; "false" there is a statement about a constant-factor
   excess that the coherent term explains, with the power law ARGUED. The prediction test had two misses out of
   six statements. The compensated probe was computed for one slot, d <= 5, lam <= 2, and its sign is not
   determined by the model.

## 10. Compute record

Server ([compute-server]), computations only through `~/rh-push/bin/rhrun`; `rhstatus` read before each launch; GPU
not used. Units of this lane (all named `rh-c8ek-*`; logs copied to `server_logs/`):

| unit | cores, memory limit | what | outcome |
|---|---|---|---|
| build-1118225852 | 16, 8 GB | first build | nothing ran: the source had been copied to the wrong place (a zsh expansion of the rsync target on the Mac; the stray local directory was removed) |
| build-1118225912 | 16, 8 GB | build + three timings | completed in seconds |
| build-1118230038 | 16, 20 GB | timing of (6, 3, 6) | stopped by me after about 5 minutes: the table build was the bottleneck; kernel rewritten |
| build-1118230536 | 16, 20 GB | generator-table check, timings | completed (72 s) |
| q7-1118230716, q13-1118230716 | 12 + 4, 16 + 8 GB | first production start | stopped by me after about 3 minutes (the job list contained pure-mark rows with marks of degree 7 to 9, far slower than planned); results moved to `old/`, list pruned |
| q7-1118231010 | 12, 16 GB | production, q = 7 | **killed by its memory limit** at the reference job (N, lam, d) = (6, 0, 7): the code announced 19.5 GB and my guard was set at 30 GB while the unit limit was 16 GB. The problem was reduced (two lam = 0 reference jobs dropped, guard set to 12 GB); the limit was not raised |
| q7-1118232049 | 12, 16 GB (8 cores, 10 GB for 22 minutes while the corner unit ran) | production, q = 7, remaining 13 jobs | completed 01:26 UTC, 2 h 06 min; longest job (6, 6, 4): 1575 s |
| q13-1118231017 | 4, 8 GB | production, q = 13 | completed, 2 h 07 min; longest job (4, 4, 4): 3503 s; one lam = 0 reference job refused by the guard (38 GB announced) |
| corner-1119003059 | 4, 14 GB | (2, 10, 2), (1, 10, 2), q = 7 | completed, 21 min; peak memory 9.9 GB (11.3 GB announced) |

Core requests of simultaneously active units never exceeded 16 (16; 12 + 4; 8 + 4 + 4). Memory limits requested at
one time: at most 24 GB, and 32 GB (10 + 8 + 14) while the corner unit ran. No unit ran longer than 2 h 07 min. No
unit of this lane is active now (`rhstatus` checked after the last job). Only my own units were stopped, each by
`systemctl --user stop <unit>`; the quota of one of my own units was changed with `systemctl --user set-property`.
Not through `rhrun`: five compilations (`gcc`, about 2 s each, `nice 19`) run directly over ssh. Data left on the
server: `~/rh-push/c8-ek-ff-reflected-rows-exact/` (740 KB: source, binaries, job lists, results).

Local (Mac): numerical runs through `scripts/memcap.sh 8` (verification against c7, compensated probe, Moebius
sums, long-mark configurations up to lam = 9, Lemma R seeds, brute-force check). Not through the wrapper, all mine:
the first timing calls and the kernel-version comparison batches of `ffx` (seconds each, below 0.1 GB), and one trial
of (1, 8, 2) (20 s, 0.14 GB announced). One local verification script was killed by pid and restarted after the
kernel was replaced under it; one local Moebius-sum run was killed by pid when its prime count turned out to take
half an hour, and the count was replaced by the exact formula.

Files: `RESULT.md`, `REFEREE.md`, `lanes_line.json`; `ffx.c` (c7 code + subcommands `en`, `sc`, `ptcheck`,
`irrcheck`); `genjobs.py`, `jobs*.txt`, `runjobs.sh`, `runlocal.sh`; `results_q7.txt`, `results_q13.txt`,
`results_q7_corner.txt`, `results_q7_corner2.txt` (exact integers); `sc_results.txt`, `run_sc.py`; `summarize.py`,
`summary.txt` (tables T1 to T9); `verify_c7.py` + logs; `v1v2.log`; `referee_bf.py` + log; `referee_sc.py` + log;
`lemmaR_seeds_*.txt`; `prediction_corner.txt`; `q2.py`, `q2_q7.jsonl`, `q2_q7_d5.jsonl`, `q2_summary.py`,
`q2_summary.txt`; `exact.py`, `c7_analyze.py` (copies from c7); `server_logs/`.

## 11. For the next allocation; proposed map row (not applied)

- (E-K) is decided in the model in the sense available: it is the bound B_coh << 1. It is true for Weil targets
  for dual lengths r <= 3N at the sizes reached (this covers the vertex h = 4/3 of `c7-probe-format-h-cap`), false
  for them beyond, generic (true for random vectors by Lemma R), and as an input to ORDER-2 circular in the same
  way as K + D (c5) and the unreflected marked rows (c7): it is the target's own Moebius bound with the sixth-power
  weight. The lane `c8-ek-theta-second-moment-formula` should aim at the coherent term: any evaluation of
  Sum_m |B_m|^2 beyond the approximate-functional-equation range must contain wt^2 |M(nu)|^2.
- The recalled sharpness of the cubic large sieve by theta-type vectors corresponds here to w = mu (the row is
  itself a Gauss-sum row); the probe vector differs from it by the target twist, and the energy sees the twist only
  through sum mu nu.
- The pre-registered control "random unimodular vector shows the K-loss" should be replaced by the aligned vector
  in any later test of an operator-norm prediction.
- Not run, one bounded job each if this branch is kept: the completed rows (cube part) for one target; a second
  point on the line r > 3N at N = 2 or 3 to see growth in the degree (needs N + lam >= 15: a different
  algorithm); the long-mark onset at q = 13.

| Z15d | (E-K): vector-specific mean square of marked rows, F_q[T], exact integers | Rows m of degree d, columns of degree N + lam, range N - lam < d < N + lam. Energy/diagonal = n + B_coh, n at most about 1.1 (measured), B_coh = sum over probes k <= d/2 of wt_k^2 S_cop(k)^2 terms (squared signal; Bessel inequality proved at dual length 0). Weil targets: within a few percent of the diagonal for N >= 4, exponent <= 1.05 in all configurations with N >= 2, lam <= 6, d >= 3 (q = 7, 13; N + lam <= 12); above the diagonal by factors 4 to 15 when the dual length exceeds 3N (N = 1, 2; one case predicted in advance): (E-K) fails for the target beyond h = 3. Random unimodular, random signs, random multiplicative signs, two-character sums: as the targets (mean over random phases = diagonal exactly). mu and a sign twist with large Moebius sum: above the diagonal by B_coh at all lengths, with the first steps of the sixth-power count visible at dual lengths 6 and 9. Aligned vector: Hilbert-Schmidt size. Compensated probe: rescaled term = part of the marked Moebius sum from c divisible by the marked prime, relative size q^(-lam); h > 1 survives; low input unchanged. | EXACT integers; PROVED (Lemma R, AL, Q; Proposition C rel c7 Prop. 3); law MEASURED; reflected completed rows NOT-RUN; same-agent check only | r1, n1, th, dh, mn pass where the target passes; r1 passes where the target fails; mu, tb fail through their Moebius sum; al shows the operator-norm size | `c8-ek-ff-reflected-rows-exact` |

No statement about zeta. No abscissa below 0.874886647 is proved.
