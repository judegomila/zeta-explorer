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

**Precise obstruction. The pre-registered test returns "(E-K) holds in the model" for the target vectors, and it
returns the same for four of the five control classes. The row energy is, to the accuracy of the data, the diagonal
plus the squared signal of the probe. The score rule is not met; no headline change.**

1. **Object computed (neighbouring object; the assigned one is NOT-RUN).** The squarefree, sharp-degree marked rows
   B_m = R_{N,lam}(m; w) of the c7 transcription (section 2), unreflected. The reflected and completed rows of the
   manuscript (cube part L_0, factor alpha, smooth weights, excluded set S) were not built: **NOT-RUN**. The statistic
   Sum_m |B_m|^2 does not depend on the representation of the row (a reflection is an identity between the same
   numbers), so the reflection enters only through the predicted sizes; the completion changes the object and is not
   covered.
2. **Thresholds (section 4).** K-region = N - lam < d < N + lam (both the unreflected column count q^(N+lam) and
   the reflected dual length q^(2d+lam-N) exceed the number of rows q^d). Exponent a = log_q(||B||^2/||beta||^2)/d.
   Target a (q = 7): a <= 1.05 in every K-region configuration with d >= 3 (@@A7 configurations); q = 13: @@A13.
   Three largest sizes of the family (n, n, n): @@FAM. The Hilbert-Schmidt (K-loss) slope of that family is 2.
   By the rule: **(E-K) holds in the model** for the Weil targets.
3. **Controls (section 7).** At the diagonal level like the targets: random unimodular vector (r1), random
   non-multiplicative signs (n1), random completely multiplicative signs (th; the non-periodic class), the two-character
   sum (dh), and the Moebius-twisted target (mn). Above the diagonal: w = mu (excess up to @@MUMAX, bounded by the
   squared sixth-power count, far below the Hilbert-Schmidt size) and the sign twist with a large Moebius sum (tb).
   At the Hilbert-Schmidt size: the aligned vector only. The pre-registered expectation "a random unimodular vector
   must show the K-loss size" is false as stated: the mean over random phases of the row energy is exactly the
   diagonal (Lemma R, PROVED). The operator-norm size is attained by a vector aligned with one row (Lemma AL).
4. **Structure (section 5; the result of this lane).** For every real weight computed,

       row energy / diagonal  =  1 + B_coh + delta,     B_coh = Sum_{k <= d/2} |J_k|^2 / (||c_k||^2 diagonal),

   where J_k is the probe value against the sextic Gauss-sum row c_k and |J_k| = wt_k q^d |S_cop(k)| is the Moebius
   sum of the row weight times the number of sixth-power dual frequencies. B_coh is computed from exact integers;
   delta is small in the data (median of e - 1 - B_coh between @@DLO and @@DHI over the eight real weights at q = 7).
   The inequality e >= B_coh is PROVED-rel c7 Proposition 3 (Bessel). So in the model (E-K) for a vector is
   equivalent, to this accuracy, to a power-saving bound for the Moebius sum of its own weight of strength
   q^(-r/6) per unit of dual length r: the statement Proposition 2.1 would output from the same block. It holds
   for the Weil targets because RH holds for them. It is not an independent input.
5. **Compensated probe (section 6).** In the model the rescaled term of (12.5) equals, in absolute value and as an
   identity of exact integers (40 of 40 blocks with dual length 0), pi(lam) wt q^d |S^base_cop(k - lam)|: the part of
   the marked signal carried by the moduli c divisible by the marked prime. Its size relative to the marked term is
   q^(-lam) (1 + o(1)) in the blocks that obey the signal law (measured 0.18 to 0.23 at lam = 1, 0.024 to 0.025 at
   lam = 2, q = 7). **h > 1 survives the subtraction.** The low separation of the compensated probe contains the
   unchanged marked rows, so its low input still contains the squared signal (section 5 applies to the same rows).

ORDER-2 through (E-K): the escaping hypothesis of `c7-probe-format-h-cap` section 4 is true in the model and is a
restatement of the conclusion there; it does not separate the target from generic vectors, and it fails exactly for
the vectors whose own Moebius sum is large.

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
(iii) the two-sided comparison "energy = diagonal + coherent part" from exact Moebius sums, for ten weights;
(iv) Lemma R and the aligned vector, which fix what the controls can show; (v) the compensated probe.
No closed route is re-run.

Decisive first test (run first, locally, single thread): the energy of the target a against the aligned vector and
the weight mu at (N, lam, d) = (2, 2, 3), (3, 3, 2), (2, 2, 4) in exact integers. It showed the target at 0.68 to
1.05 times the diagonal, mu at 2.5 to 8.8 and the aligned vector at 53 to 518. The server runs sized the same
statement.

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

The kernel was rewritten three times for speed (prime character tables by powers of a generator; factorised phase
of g_3(1, P A'); diagonal without the table W). Each version reproduces the previous one as identical output lines
(`v1v2.log`: 155 + 112 + 261 + 180 lines, 0 differences), and the generator tables equal the resultant tables on
every prime compared (`ptcheck`: 217 primes of degree <= 5 at q = 7, 252 of degree <= 6 on the server, 819 of
degree <= 4 at q = 13; 0 differing). An independent python brute force from the definitions (norm-form resultant,
complex floats) agrees on 6 configurations (`referee_bf.log`).

## 3. Statistic, predictions, thresholds

    e      = sumnorm / diagsum                                   (1 = diagonal level)
    Enorm  = sumnorm / sumW2 = ||B||^2 / ||beta||^2
    a      = log_q(Enorm) / d                                    (exponent in Q = q^d)
    aK     = min(N + lam, 2d + lam - N) / d                      (smaller Hilbert-Schmidt level over the two representations)

(a) Hilbert-Schmidt / K-loss prediction: a = aK > 1 in the K-region N - lam < d < N + lam. (b) Diagonal: a = 1
(a <= 1 exactly at e = 1, since the diagonal counts only m prime to A). Thresholds as pre-registered: a <= 1.05:
(E-K) holds in the model; a >= 1.15 at the K-loss size: false; otherwise undecided. "Fitted exponent at the three
largest sizes": least-squares slope of log_q(Enorm) against d along a family of fixed shape.

**Lemma R (random phases) [PROVED].** Let T be any matrix and beta_A = b_A u_A with fixed b_A >= 0 and u_A
independent, uniform on the sixth roots of unity (or on the circle). Then E ||T beta||^2 = sum_A b_A^2 ||T e_A||^2.
For the row operator, ||T e_A||^2 = #{m : (m, A) = 1}: the mean energy is the diagonal exactly, in every
representation. Proof: E u_A conj(u_B) = 0 for A != B. QED. A random unimodular vector therefore sits at e = 1 up
to fluctuations and cannot show the K-loss; the pre-registered wording of that control is corrected here.

**Lemma AL (aligned vector) [PROVED].** For beta_A = conj(chi_A(m_0)) on the A prime to m_0 (same support and
moduli), ||T beta||^2 >= |B_{m_0}|^2 = (number of A in the support)^2, so e >= nsupp^2/diagsum, about q^(N+lam-d).
This is the Hilbert-Schmidt size of the unreflected representation, and it is the control that shows what an
operator-norm bound must allow.

## 4. Results: the row energy in the K-region

Weights (all with the same support and coefficient moduli up to the vanishing of the target at its conductor):
a, b: quadratic characters of conductor F = T^3 + 2 and T^3 + T + 1 (q = 7), T^3 + 2 and T^3 + 3 (q = 13; these two
are conjugate under T -> cT and give identical integers, so b is redundant at q = 13); dh = nu_a + nu_b;
n1: random +-1 (not multiplicative); th: random completely multiplicative +-1 (not periodic); tb: completely
multiplicative, eps(P) = -1 with probability q^(-deg P/10) (a sign twist whose Moebius sum is large); mn = mu nu_a;
mu; r1: random sixth roots of unity on A; al: aligned vector.

Runs: q = 7: all (N, lam, d) with 1 <= N <= 7, lam <= 6, d <= 8, d + lam > N, d + N + lam <= 12 (all ten weights)
and = 13 (six weights), plus the larger configurations of section 4.2. q = 13: d + N + lam <= 9 (ten weights), = 10
(six), plus larger ones. `summary.txt` has every table (T1 to T7); `results_q7.txt`, `results_q13.txt` have the
exact integers (@@NROWS lines).

### 4.1 All K-region configurations (table T2)

@@T2

Every configuration of the targets with a > 1.05 has N = 1 (q = 7, target b: five configurations, a <= 1.088,
e <= 2.03); they are the coherent term of section 5 for a row of length q (|M_1|^2/q^2 = 9/49 for target b).
For N >= 4: e in [0.983, 1.077] (a, q = 7, 14 configurations), [0.945, 1.110] (b), [0.990, 1.056] (a, q = 13);
the random unimodular vector has [0.905, 1.025] and [0.973, 1.027] on the same configurations.

### 4.2 Three largest sizes per family (table T1) and the largest configurations (table T7)

@@T1

### 4.3 Aligned vector (table T4) and single rows (table T5)

@@T4

Largest single row against the mean row (K-region, d >= 4): the median of max_m |B_m|^2 / mean is about 10 for the
targets and for the random unimodular vector alike (q = 7: 9.6 and 10.1), and above 1e4 for the aligned vector.

## 5. Structure: energy = diagonal + squared signal

c_k(m) = sum_{deg c = k} g_6(m, c) is the sextic Gauss-sum row (the additive factor of the probe), J_k = sum_m
c_k(m) B_m the probe, r = k + N + lam - 1 - d its dual length, S_cop(k) = sum_A mu(A) W(A) #{c : deg c = k,
(c, A) = 1}. `ffx sc` computes S_cop(k) exactly (it reproduces the S_cop values of the c7 block files on the
cases compared).

**Proposition C [PROVED-rel c7 Proposition 3 (|J_k|^2 = wt^2 q^(2d) S_cop(k)^2 at r = 0), the exact norms
||c_0||^2 = q^d, ||c_k||^2 = q^(d+2k)(1 - 1/q) for 1 <= k <= d/2, and their pairwise orthogonality].**

    e = ||B||^2/diagonal  >=  B_0 := sum_{k <= d/2, r(k) = 0} wt_k^2 q^(2d) S_cop(k)^2 / (||c_k||^2 q^(N+lam) diagsum),

wt_k^2 = 1 if 6 | k - N - lam and q otherwise. Hence a bound e <= C gives |S_cop(k)| <= (C ||c_k||^2 q^(N+lam)
diagsum)^(1/2) / (wt_k q^d): a bound for the Moebius sum of the weight. Proof: Bessel's inequality in the span of
the orthogonal c_k. QED.

**Measured law.** Put B_coh = the same sum over all k <= d/2 with |J_k| = wt(r, k) q^d |S_cop(k)|, wt the principal
part of Z_r in Theorem A of `r2-ff-tro6-complete`: for 6 | k - N - lam, wt = 1 (r = 0), q - 1 (1 <= r <= 5),
(q - 1)(1 + q + .. + q^floor((r-1)/6)) - [6 | r] q^(r/6) in general; otherwise wt = sqrt(q) q^(r/6) if 6 | r and 0
if not. This is exact at r = 0, the law tested by c7 for 1 <= r <= 5, and the same count applied for r >= 6
(marked * below; it ignores the coprimality of the sixth-power frequencies to c and A).

@@T6

- For w = mu the excess is the coherent part: e - 1 against B_coh is @@MUEX (configurations without *). With * the
  prediction is high by a constant factor (measured/predicted 0.72 to 0.79 at q = 7; (1 - 1/q)^2 = 0.73), i.e. the
  first staircase step of the sixth-power count (wt^2 from (q-1)^2 to q^3) is present in the row energy: e - 1
  rises from about 9 to 35-54 (q = 7) and from about 35 to 310-350 (q = 13) when a k with r = 6 enters.
- Where B_coh = 0 for every weight (no principal class among the k <= d/2: (N, lam, d) = (3, 6, 5), (6, 3, 5) at
  q = 7), every real weight is at the diagonal, mu included (e - 1 = -0.19 and -0.21).
- For the targets B_coh is small because |S_cop| is of square-root size (Weil), and e - 1 is small.
- For tb, B_coh and e - 1 are both of size 0.1 to 9 and track each other.
- delta = e - 1 - B_coh has median between -0.09 and -0.01 for the non-mu weights (the non-coherent part of the
  Gram form is slightly negative at these sizes) and no weight has a systematic positive remainder: configurations
  with delta > 0.5 number 0 to 4 per weight among 75 to 89, all with N <= 2 or with a starred k.

**Consequence [ARGUED from the measured law and the count wt ~ q^(r/6)].** With marks, S_cop(k) is about
- pi(lam) q^k M_N(nu) and diagsum about pi(lam) q^(N+d), so B_coh is about (wt^2/lam) |M_N(nu)|^2 q^(-2N) per
principal k. (E-K) at exponent 1 + eps is then the bound |M_N(nu)| << q^(N - r/6 + eps d) sqrt(lam) with
r up to N + lam - 1 - d/2: a power saving for the Moebius sum of the target equal to the sixth-power count. This
is the output of Proposition 2.1 for the same block (signal constant h = r/N). So:
(i) (E-K) is not weaker than the zero-free statement it would be used to prove (c7 Proposition 4, now with the
converse direction measured: no other large term was found in the energy);
(ii) for a Weil target the bound holds iff N/2 <= N - r/6, i.e. r <= 3N; with r = N + lam - 1 - d/2 this is
d >= 2 lam - 4N - 2. For lam > 2N + 1 and d below that line (E-K) would fail in F_q[T] although RH holds
(NOT-RUN: needs N + lam >= 3N + r with r >= 7; smallest case N = 1, lam = 10);
(iii) the vectors for which (E-K) fails are those with a large Moebius sum of their own weight (mu, tb), not the
vectors without an Euler product or without periodicity.

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
ARGUED for the sign]. This agrees with the format reading of (16.1): the multiplier eta(p) Q^x P*_p/P_p - Q^(-w)
loses the term Q^(-w) only. (ii) The low separation of (12.5) has, for the empty rescaled set, the completed
marked row B^emptyset_m, which is the row of sections 4 and 5; Cauchy-Schwarz on that summand is the same
inequality, and Proposition C applies to it unchanged. The low input of the compensated probe still contains the
squared signal [PROVED-rel Proposition C for the model rows; the rescaled summand adds a base row at Q/q_p^2].

## 7. Controls

| control | what was run | outcome | named step |
|---|---|---|---|
| Moebius-twisted weight | mu; mn = mu nu_a | mu: e - 1 up to @@MUMAX, equal to B_coh within the accuracy stated; mn: diagonal level | Lemma G of the predecessors (g_3 g_6 = kappa q^N mu): the row of mu is the conjugate sextic row, its Moebius sum is the full count |
| random unimodular vector, same support | r1 | diagonal level (median e 0.997 at q = 7, 0.999 at q = 13); does not show the K-loss | Lemma R: the mean is the diagonal exactly; the pre-registered expectation was wrong |
| aligned vector (added) | al | e within about 10% of nsupp/q^d (table T4); up to 5.4e6 | Lemma AL: this is the operator-norm size |
| THIN-type, non-periodic | th (random multiplicative signs); tb (sign changes on a set of primes of density q^(-deg/10)) | th: diagonal level; tb: e - 1 = B_coh within the accuracy stated, up to 13.7 | the Moebius sum of the weight; periodicity plays no role in the statistic |
| DH-type | dh = nu_a + nu_b | diagonal level (median e 0.91; the two rows add, their cross term is small) | none: both characters satisfy Weil's theorem here; the function field has no member with zeros off the line, so this control cannot fail in the model |
| sign-twisted primes | tb, th | as above | as above |
| backward heat, unimodular twist as a family, zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w | not run | - | no positivity or zero statement is made |

The score rule "raise only if (E-K) holds for theta and fails for every control vector" is not met: (E-K) holds for
theta and for r1, n1, th, dh, mn.

## 8. Requirement flags (result of this lane)

| flag | value | evidence |
|---|---|---|
| R1 multiplicativity essential | false | the energy is a quadratic form; Lemma R, Lemma AL and Proposition C hold for arbitrary weights; non-multiplicative weights (n1, dh, r1) give the same outcome as the targets |
| R2 height-uniform, every window | false | no statement about zeros; fixed q, bounded degree |
| R3 controls fail structurally | false | five control classes pass (E-K) exactly as the targets do; the two that fail do so through the size of their own Moebius sum |
| R4 reaches the critical line | false | (E-K) in the model is the conclusion restated (section 5); no abscissa is changed |

## 9. Three weakest steps

1. **The object is a neighbour of the one assigned.** Unreflected, squarefree, sharp-degree rows with alpha = 1; no
   cube part, no smooth weights, no excluded set, no ray classes. The exact reflection of the completed rows in
   F_q[T] was not derived, so "reflected, completed" is NOT-RUN and the K-loss prediction is represented only by
   the two Hilbert-Schmidt levels. The energy is reflection-invariant, but the completion changes about a 1/q share
   of the diagonal mass and could carry its own coherent terms.
2. **The law e = 1 + B_coh + delta is measured, not proved.** PROVED is only e >= B_0 (dual length 0). The count
   for 1 <= r <= 5 is c7's law, for r >= 6 it is the principal part of Theorem A without the coprimality
   conditions and is high by a factor near (1 - 1/q)^(-2). delta is not bounded by an argument; the statement
   "(E-K) is equivalent to the Moebius bound" rests on delta being small on 89 (q = 7) and 32 (q = 13)
   configurations per weight with N + lam <= 12 and r <= 9.
3. **Finite degrees and the exponent test.** d <= 8, and in the K-region d <= 7; an exponent difference of 0.05
   at d = 5 is a factor 1.6 (q = 7). The verdict "a <= 1.05" for the targets is unambiguous only because e itself
   is within a few percent of 1 for N >= 4; for N = 1 it is not (target b, a up to 1.088). The failure region of
   consequence (ii) (lam > 2N + 1) was not reached. The compensated probe was computed for one slot, d <= 5,
   lam <= 2, and its sign is not determined by the model.

## 10. Compute record

@@COMPUTE

## 11. For the next allocation; proposed map row (not applied)

- (E-K) is decided in the model: true for Weil targets at the sizes reached, generic (true for random vectors by
  Lemma R), and equivalent to the target's own Moebius bound with the sixth-power weight. As an input to ORDER-2
  it is circular in the same way as K + D (c5) and the unreflected marked rows (c7). The lane
  `c8-ek-theta-second-moment-formula` should aim at the coherent term: any evaluation of Sum_m |B_m|^2 beyond the
  approximate-functional-equation range must contain the term wt^2 |M(nu)|^2.
- The recalled sharpness of the cubic large sieve by theta-type vectors corresponds here to w = mu (the row is
  itself a Gauss-sum row); the probe vector differs from it by the target twist, and the energy sees the twist only
  through M_N(mu-twist) = sum mu nu.
- Not run and worth one bounded job if this branch is kept: the completed rows (cube part) for one target; the
  failure region lam > 2N + 1 of consequence (ii), which needs a different algorithm (N = 1, lam = 10).

| Z15d | (E-K): vector-specific mean square of marked rows, F_q[T], exact | Row energy over rows m of degree d, columns of degree N + lam, in the range N - lam < d < N + lam. Weil targets: energy/diagonal within a few percent of 1 for N >= 4 (q = 7, 13; N + lam <= 12), exponent <= 1.05 in all configurations with d >= 3. Same for random unimodular, random signs, random multiplicative signs, two-character sums (mean over random phases = diagonal exactly). Above the diagonal only for weights with a large Moebius sum (mu, sign twist): excess = sum_k wt_k^2 S_cop(k)^2 terms (Bessel part), with the first step of the sixth-power count visible at dual length 6. Aligned vector: Hilbert-Schmidt size. Compensated probe: rescaled term = part of the marked Moebius sum from c divisible by the marked prime, relative size q^(-lam); h > 1 survives; low input unchanged. | EXACT integers; PROVED (Lemma R, AL, Q, Proposition C rel c7 Prop. 3); law MEASURED; reflected completed rows NOT-RUN; same-agent check only | r1, n1, th, dh, mn pass as the target does; mu, tb fail through their Moebius sum; al shows the operator-norm size | `c8-ek-ff-reflected-rows-exact` |

No statement about zeta. No abscissa below 0.874886647 is proved.
