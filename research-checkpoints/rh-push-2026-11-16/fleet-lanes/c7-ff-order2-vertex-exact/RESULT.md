# c7-ff-order2-vertex-exact: the order-2 vertex of the Proposition 2.1 format over F_q[T], in exact arithmetic

Internal working note, 2026-11-18. Slug `c7-ff-order2-vertex-exact`. Kind: compute (heavy lane). Not refereed.
Nothing committed, pushed or posted. Only this directory was written (plus `~/rh-push/c7-ff-order2-vertex-exact/`
on the compute server, through `rhrun`).

This note supplies **no statement about zeta** and no statement about zeros of any number-field L-function. It is a
function-field model computation. The Riemann hypothesis for the targets used here is Weil's theorem and is checked
exactly on the two L-polynomials (section 6, control C3). 7/8 (unrefereed) stands; RH open. NO QED.

Labels: PROVED (argument given here; inputs named) / PROVED-rel X / EXACT (identity between exact integers or exact
elements of Z[zeta_6q], checked on the stated number of cases) / MEASURED (real numbers computed from exact integers,
no identity claimed) / ARGUED / CITED / OPEN.

## 0. Verdict

**Precise obstruction, in two parts. Against the pre-registered thresholds: outcome B for the base probe (6.1);
undecided for the marked probe, whose structure is determined exactly.**

1. **Base probe (the transcription of (6.1), no prime marks): capped, independently of the truth.** The region
   lx < l = 0 is k > d (more Gauss-sum moduli than rows). There every block is a re-expression of blocks with
   k <= (d+1)/2: the vectors c_k satisfy c_k in span{c_i : i <= (d+1)/2} with coefficients independent of m
   (rationality F1 and the functional equation F2 of the sextic Gauss-sum series; EXACT for all m, d <= 6 at q = 7 and
   d <= 4 at q = 13, zero violations). In 4383 of the 4447 computed blocks with k > (d+1)/2 and J != 0 the normalised
   probe value equals that of a block with k <= (d+1)/2 to 9 digits; the other 64 are the two-term case k = 7, d = 6.
   For k <= (d+1)/2 the dual length is r <= N - (d+1)/2, so the signal constant is h = r/N <= 1 - M/2 < 1: the floor
   5/6 + M/12 of the ledger's polar branch, reproduced. No Weil bound enters this cap. Measured: for N >= 3 and
   d >= N the largest value of the statistic on the base probe is 0.96 (q = 7) and 0.82 (q = 13).
2. **Marked probe (the marked term of (12.5) without the rescaled term; this is the ledger region lx < l with l > 0):
   the vertex is real in the model, and its low input is the conclusion.** Three exact facts:
   (a) for dual length r = 0 the probe is, as an exact integer identity, a Moebius sum of the weight:
   |J|^2 = wt^2 q^(2d) S_cop(k)^2 (312 of 312 blocks, including non-multiplicative weights); for 1 <= r <= 5 the same
   law holds within 0.4% at d = 6 (30 blocks).
   (b) the row is the conjugate of the sextic Gauss-sum row twisted by mu times the target:
   R_N(m; mu) = kappa_N conj(c_N^sf(m)) exactly (43218 values of m, zero violations).
   (c) the low estimate "rows at the diagonal level" is true for the two Weil targets (67 row vectors with N >= 2,
   d >= 5: median |excess| 0.0015, maximum 0.067) and false for the control weight mu with coefficients of the same
   modulus (excess up to 5.25; 98% of the row energy lies in the span of the probes c_k).
   So in F_q[T], where RH holds, both halves of the format are true at h = 1 + l - M/2 > 1 (outcome-A type), but the
   flat row bound that the low side needs is, by Bessel's inequality and (a), a bound for the target's own Moebius
   sum of the strength that Proposition 2.1 would output, and it fails for a control that no modulus-only (sieve)
   estimate can tell from the target. The missing input is therefore not a Weil bound for an auxiliary family; it is
   target-sensitive cancellation of the same strength as the conclusion.
3. **The false input of the ledger region is identified.** The reduced system of `c5-target-fe-order2-ledger` fell
   below 1/2 at lx < l because its row input "optimal K + D" omits the coherent term of the row Gram matrix, which
   is the squared signal. With that term the Cauchy-Schwarz ratio saturates (largest statistic per (N, lam) 2.90 to
   2.99 for the mu control at N >= 3; no block exceeds 3), which is abscissa 1/2: no vertex below 1/2 exists.

By the pre-registered rule: h >= 1.5 at two successive degrees was not observed for either target (single blocks:
1.87 at N = 1 for target b, 1.76 at N = 2 for target a); h <= 1.1 at all degrees fails for the marked probe. The
finite-degree values are dominated by O(1/N) terms (the sixth-power count is constant for r <= 5), so the threshold
test is undecided for the marked probe. ORDER-2 through this vertex is closed as a route for the reason in 2, not
because the format is capped.

## 1. Plan, reading, relation to closed rows

Read: BRIEF to the end (rhrun rules, 2026-11-18 update); STRATEGY 4.0; OBSTRUCTION_MAP rows Z11, Z14, Z15, Z16, Z21
and controls; `c5-target-fe-order2-ledger` (RESULT; Lemma U; the h > 1 vertices at lx < l); `r3-method-limit`
(estimate system, Theorem 1 and 3); `r2-ff-tro6-complete` (Theorems A, B, C, U, Lemma R, Lemma G; code `ff.py` read
as text); `tro6-functionfield` (F1, F2, F3); `n3-ff-cubic-sieve-rational-deflation` (file list only);
`ff-transplant` (file list only); manuscript `~/lean-deps/qrh-verify/paper.txt` Proposition 2.1, section 6.1,
(6.1), (6.2), (12.5).

New against those: (i) exact arithmetic (the predecessors are float64, relative error 1e-13); (ii) the region k > d
and its reduction; (iii) prime marks in the function-field model; (iv) row norms against the exact diagonal and the
mu control; (v) the identification of the row with the twisted conjugate Gauss-sum row. No closed route is re-run:
the F_q[T] lanes computed TRO6-type savings, not the signal constant of the format.

Decisive first test (run first, locally): the block table at q = 7, d = 2 (section 5.1). It showed the period 6 and
the functional-equation pairs in k immediately, and that d = 2 is too small to separate a target from a random row
family. Everything after that was sized on the server.

## 2. Definition of the object (fixed before the first run)

q = 1 mod 6 prime, R = F_q[T]. Conventions are those of `r2-ff-tro6-complete` section 2: chi_0 the character of
F_q^* of order 6 with chi_0(g) = zeta_6 for the least primitive root g; psi(a) = zeta_q^a; e(f) = psi(coefficient of
T^-1 of f); for monic c, chi_c(x) = chi_0(Res(c, x)); g_6(m, c) = sum_{x mod c} chi_c(x) e(mx/c);
g_3(1, A) = sum_{x mod A} chi_A(x)^2 e(x/A).

| manuscript | function-field object | scale |
|---|---|---|
| additive factor A_{m,sigma,v}(Y) of (6.2): sum over s of q_s^(-1/2) g_{chi_s}(s, -m) | c_k(m) = sum_{c monic, deg c = k} g_6(m, c) | Y = q^k |
| row B_{m,sigma}(Z) of (6.1), coefficients gamma_2(c) alpha(cn^3) nu(cn^3) chi_{cn^3}(m) ((5.30)) | R_N(m; nu) = sum_{A monic squarefree, deg A = N} g_3(1, A) nu(A) chi_A(m) | Z = q^N |
| probe (6.1) in the separated form (6.2), I = Q^(-1/2) sum_m A_m B_m | J(k, N; d; nu) = sum_{m monic, deg m = d} c_k(m) R_N(m; nu) | Q = XY = q^d, X = q^(d-k) |
| marked term eta(p) I_{eta;p}(X, Y, Z q_p) of (12.5), no rescaled term | R_{N,lam}(m; nu) = sum_{P monic prime, deg P = lam} sum_{A' squarefree, deg A' = N, P does not divide A'} g_3(1, PA') nu(A') chi_{PA'}(m) | P = q^lam |
| target eta, zeros of L(s, eta) | nu(A) = chi_0^3(Res(F, A)), F monic irreducible cubic: a quadratic Dirichlet character of conductor F, L(u, nu) = 1 + a_1 u + q u^2 | |

Ledger variables: lx = (d - k)/N, ly = k/N, M = d/N, l = lam/N, N' = N + lam, dual length r = k + N' - 1 - d, and
h = r/N = 1 - lx + l - 1/N (the ledger's h = 1 - lx + l). The ledger region lx < l is k + lam > d. For the base
probe (lam = 0) it is k > d.

Targets: "a": F = T^3 + 2; "b": F = T^3 + T + 1 (q = 7); "a" at q = 13: F = T^3 + 2. All three are irreducible.

Not transcribed (deviations from (6.1); weakest step 1): the smooth weights W_0, W_1, Phi (sharp degree classes are
used), the excluded set S with xi, tau, Xi, the ray classes sigma and the correction G, the factor alpha and the
cube part of A = c n^3 (squarefree A only), the integral over v. The manuscript uses the marked term only together
with its rescaled term and only for lx >= l; the uncompensated marked term is the object that the ledger region
lx < l refers to.

## 3. Statistic and thresholds

For a block put L = ||c_k|| ||R||, the product of the l^2 norms over monic m of degree d. In Proposition 2.1 the
abscissa certified from a low bound |J| <= B and a signal of size q^(beta N) times constants is
sigma_0 = beta + (log_q B - log_q |signal|)/N. The best low bound that Cauchy-Schwarz on (6.2) can give is B = L.
With beta = 1/2 (true here) and signal = J:

    h_up(block) := 6 (1 - sigma_0) = 3 + (6/N) log_q( |J| / (||c_k|| ||R||) )  <= 3.

h_up is an upper bound for the signal constant that a norm-type low estimate can realise from that block; it equals
the realised constant when J is the signal (section 5.3 tests this) and when the proved low bound is L.

Fitted exponents (the statistic named in the assignment): slope in N of log_q(|J|/L) on blocks of fixed type, and
the row norm against its exact diagonal value, ||R||^2 / (q^d D), D = sum_A |w(A)|^2 q^(N') phi(A)/|A| (exact
rational, from the factor-degree patterns of all squarefree A).

Thresholds (pre-registered): h >= 1.5 at two successive degrees: outcome A; h <= 1.1 at all degrees: outcome B;
otherwise undecided. Degree means N.

Added after the first test and stated here as such: (i) blocks with d < N are not counted, because there the random
row control reaches the same values (null level 3 - 3d/N; table T5 in `summary.txt`); (ii) a marked block is counted
only if J obeys the signal law of section 5.3 within 25%.

## 4. Work

### 4.1 Code and exactness

`ffx.c` (C, OpenMP; integers only). Every output is an integer histogram: for each m the number of terms with phase
zeta_6^a, per monomial type in the Gauss sums G_j = G(chi_0^j). Closed forms used (each PROVED by the classical
argument named, and validated exactly, section 4.2):
* squarefree c: g_j(1, c) = chi_0^3(disc c) chi_0^j(Res(c, c')) G_j^(deg c) (residue form of e, Hasse-Davenport,
  Pellet-Stickelberger; this is Lemma G's ingredient);
* gcd(m, c) = 1: g_6(m, c) = conj(chi_c(m)) g_6(1, c), zero unless c is squarefree;
* prime powers P^j with v = v_P(m) >= 1: phi(P^j) if j <= v and 6 | j; -|P|^(j-1) if j = v + 1 and 6 | j;
  |P|^(j-1) conj(chi_P(m/P^v))^j g_j(1, P) if j = v + 1 and 6 does not divide j; zero otherwise;
* twisted multiplicativity g_6(m, c_1 c_2) = chi_{c_1}(c_2) chi_{c_2}(c_1) g_6(m, c_1) g_6(m, c_2).
`exact.py`: Z[zeta_6q] as integer polynomials modulo the cyclotomic polynomial (own code; no library); equality is
equality of reduced integer vectors; real numbers (logarithms) are evaluated from exact integers at 70 digits.
`analyze.py`, `analyze_fast.py`: J, ||c_k||^2, ||R||^2 as exact elements; `analyze_fast.py` sums over m in int64
chunks whose size is chosen from an a-priori bound below 2^62 and adds chunks as Python integers; it reproduces
the 1773 triples (|J|^2, ||c||^2, ||R||^2) of `analyze.py` at d = 5 as identical integers.
`summary.py` -> `summary.txt` (all tables). `blocks_q*_d*.jsonl`: 14077 blocks with exact integers as strings.

No float64 or GPU number enters any statement below. The GPU was not used.

### 4.2 Validation (EXACT)

* `validate.py` / `validate.log`: closed forms against the definitions (brute-force sums over x mod c, exact
  histograms over zeta_6^a zeta_q^b): 2094 values (q = 7: all m with d <= 3 and k <= 4 as listed, rows with marks
  and all weight modes; q = 13: d <= 2), including non-squarefree c and gcd(m, c) > 1. Mismatches: 0.
* `cmpbig.sh` / `cmpbig.log`: the large-degree kernels (`ckbig`, `rowbig`: tables modulo the small modulus) against
  the validated kernels on 17 cases: identical. (A sign error in `rowbig` was found by this check and fixed before
  any production run.)
* `weil.py` / `weil.log`: L(u, nu) = 1 - u + 7u^2 (a), 1 + 3u + 7u^2 (b), 1 + 5u + 13u^2 (a, q = 13);
  a_1^2 - 4q = -27, -19, -27 < 0, so both inverse roots have modulus sqrt(q) exactly.

### 4.3 Runs

q = 7: d = 1..6 with all k up to 10, 10, 10, 9, 8, 7; d = 7, 8 with k <= 4; rows N <= 8 (lam = 0) and marks
lam = 1..6 with N' <= 8 or 9; weights: targets a, b; controls r1, r2 (random unimodular rows), n1, n2
(non-multiplicative random +-1 target), dh (nu_a + nu_b), mu (w = mu), t (trivial character). q = 13: d = 1..4,
k <= 8, 8, 6, 6, rows N' <= 6 (d = 4 rows incomplete: the unit was stopped to stay inside the core cap).
Largest single jobs: c_k at (d, k) = (5, 8) and (6, 7): 7^13 pairs (m, c) each; rows at d = 8 with 5.7e6 values of m.

## 5. Results

### 5.1 F1 and F2 (EXACT), and the reduction of the region k > d

psi(m, u) := sum_k c_k(m) u^k.

**F1 [EXACT here; CITED in general: Hoffstein 1992, Patterson 2007].** p*_k(m) := c_k(m) - (q - 1) q^6
sum_{j>=1} q^(6(j-1)) c_{k-6j}(m) vanishes for every k >= d + 2. Checked for every monic m: q = 7, d = 1..5 with
k up to 10, 10, 10, 9, 8 (45,675 pairs (m, k)); q = 13, d = 1..4 (33,878 pairs). Violations: 0. Consequence
(algebra): c_{k+6} = q^7 c_k for k >= d + 2.

**F2, span form [EXACT].** For each pair (k, d + 1 - k) with k <= (d+1)/2, either c_{d+1-k}(m) = lambda c_k(m) or
p*_{d+1-k}(m) = lambda p*_k(m) holds for all m with lambda independent of m. Checked for all m: q = 7, d = 1..6
(every pair; 0 pairs fail both forms), q = 13, d = 1..4. For d <= 5 both forms hold. At d = 6 the pair (1, 6) holds
only in the c form and the pair (0, 7) only in the p* form (117,600 violations of the other form in each case), so
the statement "p*_{d+1-k} = lambda(d, k) p*_k for all k" of `tro6-functionfield` (measured there for d <= 4) is
not the general form of the functional equation; also |lambda(5, 0)| = q^7, not q^(6.5). In every case the higher
member lies in the span of {c_i : i <= (d+1)/2} with coefficients independent of m, which is what is used below.
Also EXACT: c_k = 0 identically at k = (d+1)/2 for d = 1, 3, 5.

**Proposition 1 [PROVED-rel F1 and F2 (span form)].** For every k there are constants alpha_{k,i}, independent of
m, with c_k = sum_{i <= (d+1)/2} alpha_{k,i} c_i. Hence for every row vector R,
J(k) = sum_i alpha_{k,i} J(i). If the indices i that occur are <= d/2, the c_i are pairwise orthogonal (complete
orthogonality of the distinct reduced fractions x/c, deg(c c') <= d), so ||c_k||^2 = sum |alpha_{k,i}|^2 ||c_i||^2
and, with rho(k) = |J(k)| / (||c_k|| ||R||),

    rho(k) <= sqrt(n_k) max_i rho(i),   i.e.   h_up(k) <= max_i h_up(i) + (3/N) log_q n_k,

n_k the number of indices that occur (n_k = 1 for d <= 5; n_k <= 2 for d <= 17).
Proof. For k >= d + 2, F1 gives c_k as a combination of c_{k-6j}; iterate until all indices are <= d + 1; apply F2
to the indices above (d+1)/2. The inequality is Cauchy-Schwarz in the n_k terms. QED

**Measured consequence [EXACT integers, compared to 9 digits].** Among all 14077 blocks, 4447 have k > (d+1)/2 and
J != 0. In 4383 of them rho(k) equals rho(i) for some block with i <= (d+1)/2 and the same row; the other 64 are
k = 7 at d = 6 (c_7 = lambda + (q-1) q^6 c_1, two terms).

**Corollary (base probe) [PROVED-rel F1, F2, and Theorem A of `r2-ff-tro6-complete`].** For lam = 0 the region
lx < l is k > d, and there J(k) is a combination of the J(i), i <= (d+1)/2, whose dual lengths are
r_i = i + N - 1 - d <= N - (d+1)/2. For r_i < 0 the probe is zero off the diagonal i = N' (EXACT: all 959 such
blocks at d >= 4 with structured weights, lam >= 0, have J = 0; so do all 105 with random rows). So the frequency range of the base probe never exceeds N - (d+1)/2, the
nominal constant is h <= 1 - M/2 - 1/(2N) < 1, and the abscissa of the format is >= 5/6 + M/12: this is the
ledger's bound B_low >= 5/6 + M/12 - l/6 at l = 0, now as a property of the probe and not of an estimate. Nothing
in the argument uses the location of the zeros of L(u, nu).

Base probe, statistic h_up (targets a, b; all k; table T3 of `summary.txt`):

| | blocks with d >= N | maximum | maximum over N >= 3 |
|---|---|---|---|
| q = 7 | 105 | 1.24 at (N, d) = (2, 2), r = 0 | 0.96 at (N, d) = (4, 4), target b |
| q = 13 | 20 | 1.49 at (N, d) = (2, 2), r = 0 | 0.82 at (N, d) = (4, 4) |

The two values above 1.1 are at N = 2, d = 2 with dual length 0, where the nominal constant is 0; they are the
finite-size term (6/N) log_q(sqrt(q) |M_2| / q) and the random-row control exceeds them there (1.98).

### 5.2 The row is a twisted conjugate Gauss-sum row

**Proposition 2 [PROVED; inputs: Lemma G of `tro6-functionfield` (g_6(1, A) g_3(1, A) = kappa_N q^N mu(A),
|kappa_N| = 1) and |g_6(1, A)|^2 = q^N].** For squarefree A, g_3(1, A) = kappa_N mu(A) conj(g_6(1, A)), so

    R_N(m; nu) = kappa_N conj( sum_{A squarefree, (A, m) = 1} g_6(m, A) conj(mu(A) nu(A)) ).

For nu = mu the row is kappa_N times the conjugate of the squarefree, coprime part of c_N(m).
EXACT check (`mucheck.py`, `mucheck.log`): d = 4, N = 1..4 and d = 5, N = 2, 4: 43,218 values of m, 0 violations,
|kappa_N|^2 = 1.

So the probe J = sum_m c_k(m) R(m) is the Hermitian pairing of the sextic row c_k with the (mu nu)-twist of the
sextic row c_N: it measures the correlation of nu with mu on squarefree A.

### 5.3 Signal law

S_cop(k) := sum over squarefree A of mu(A) w(A) #{c monic, deg c = k, (c, A) = 1}, w the row weight
(w(A) = nu(A), or sum over prime P | A of degree lam of nu(A/P)). It is computed exactly from the factor-degree
patterns of all squarefree A (`ffx wsum`).

**Proposition 3 [PROVED-rel Theorem A, Lemma R, Lemma G of the predecessors; EXACT check].** If r = 0 and k != N',
then |J|^2 = wt^2 q^(2d) S_cop(k)^2 with wt = 1 if 6 | k - N' and wt = sqrt(q) otherwise.
Proof. For gcd(c, A) = 1, Theorem A gives S(c, A; d) = phase q^(d-N') g_6(1, A) Z_0 with
Z_0 = sum_{a in F_q^*} psi(a) chi_0(a)^(k-N'), independent of (c, A); Lemma G turns w(A) g_3(1, A) g_6(1, A) into
kappa q^(N') mu(A) w(A). For gcd(c, A) != 1, Lemma R reduces to S(c_1, A'; d - deg e) with dual length
r - 2 gamma + deg e < 0, which is zero unless c_1 = A' = 1, that is k = N'. QED
EXACT: equality of the two integers in 290 of 290 blocks at q = 7 (d = 4..8; weights a, b, n1, n2, dh, mu, t) and
22 of 22 at q = 13 (d = 4; weights a, n1). For k = N' and r = 0 (d odd, k = (d+1)/2) J = 0 because c_k = 0. For the
random unimodular rows r1, r2 the identity fails in all 62 blocks, as it must (Lemma G is lost).

For 1 <= r <= 5 and 6 | k - N' the principal (sixth-power) frequencies are the constants and give the same formula
with wt = q - 1. MEASURED ratio |J| / ((q-1) q^d |S_cop(k)|), structured weights, k <= (d+1)/2: d = 4: 0.68 to 8.80 (40 blocks);
d = 5: 0.67 to 4.07 (35 blocks); d = 6: 0.9985 to 1.0033 (30 blocks); d = 7: 1.0002 (1 block).
The deviation is the non-principal and coupling part; it shrinks as d grows. For 1 <= r <= 5 and 6 not dividing
k - N' there is no principal weight: J = 0 exactly in 454 of 673 blocks at d >= 4 and |J|/L <= q^(-1.03) in the rest.

Slope in N (table T8): log_q(|J|/L) = a + b N on target blocks with r = 0, d >= 4: b = -0.506 (lam = 0, 8 blocks),
-0.350 (lam = 1, 12), -0.503 (lam = 2, 19), -0.522 (lam = 3, 22), -0.580 (lam = 4, 20), -0.683 (lam = 5, 11; N = 1, 2
only); lam = 6 has 4 blocks and is not fitted. The value given by
Weil's bound for M_N is -1/2: at fixed dual length the fitted constant is 3 + 6b = 0 within the scatter of
|M_N| q^(-N/2) (0.14 to 1.2 for N <= 8, `weil.log`). No block shows a signal exponent above the count of
sixth-power frequencies.

**What this gives for h [PROVED-rel Theorem A for the count; ARGUED for the non-principal part].** The signal
constant of a block is (6/N) log_q of the number of sixth-power dual frequencies, q^(r/6 + O(1)), so h = r/N. With
Proposition 1, r <= N' - (d+1)/2, hence h <= 1 + l - M/2. With marks longer than half the row range (l > M/2) this
is above 1; it reaches 3 (abscissa 1/2) at 2l - M = 4, the value at which `r3-method-limit` Theorem 3 places 1/2
with the polar term kept. The staircase q^(ceil(r/6)) has its first step at r = 7, which needs N' >= 8 + (d+1)/2;
with d >= N' that is d >= 17, out of reach of exact enumeration. Only the weights 1, sqrt(q), q - 1 were exercised.

### 5.4 The low side: row norms against the exact diagonal

excess := ||R||^2 / (q^d D) - 1 for d >= N' (then q^d D is the exact diagonal contribution).

| weight | row vectors | excess: minimum / median / maximum |
|---|---|---|
| targets a, b with N >= 2, d >= 5 | 67 | median of absolute value 0.0015; maximum absolute value 0.067 at (N, lam, d) = (2, 2, 6) |
| n1, n2 (non-multiplicative +-1) | 66, 49 | -0.21 / 0.000 / 0.17 |
| r1 (random unimodular rows) | 49 | -0.29 / 0.000 / 0.08 |
| dh (nu_a + nu_b) | 49 | -0.42 / -0.005 / 0.11 |
| pure marks (N = 0, lam = 1..6; weight 1 on primes) | 24 | exactly 0 in the 14 with d >= 2 lam (complete orthogonality); for lam <= d < 2 lam: 1.00 to 1.97 in 8, and -0.32, -0.25 at (lam, d) = (3, 5), (4, 7) |
| mu, d >= 5 | 50 | -0.87 / 1.20 / 5.23; above 0.5 in 27 |

For the mu control the Bessel sum sum_{k <= d/2} |J_k|^2 / ||c_k||^2 over the pairwise orthogonal c_k accounts for
98% of the whole row energy at (N, lam, d) = (4, 0, 4), (3, 0, 4), (4, 0, 5), and 72% to 91% in the marked cases
listed in table T7; its largest statistic per (N, lam) is 2.90 to 2.99 for N >= 3 (table T9), and no block of any
weight exceeds 3. The negative
excess -0.87 at (N, lam, d) = (3, 0, 5) is Proposition 2 with c_3 = 0 at d = 5.

**Proposition 4 (the low estimate contains the conclusion) [PROVED; inputs: Proposition 3, exact
||c_k||^2 = q^(d+2k) (1 - 1/q) for 1 <= k <= d/2].** In a block with r = 0, k != N', k <= d/2:

    ||R||^2 >= |J|^2 / ||c_k||^2 = wt^2 q^d S_cop(k)^2 / ( q^(2k) (1 - 1/q) ).

So a bound ||R||^2 <= C q^d D gives |S_cop(k)| q^(-k) <= sqrt(C (1 - 1/q) D) / wt: a bound for the Moebius sum of
the (marked) target. For general r the same holds with wt the sixth-power count q^(r/6 + O(1)), up to the
non-principal part. This is the bound that Proposition 2.1 extracts from the same block. Hence a proof of the
diagonal-level row bound in the range N' <= d < 2N' is not weaker than the zero-free statement the vertex would
give, and by section 5.4 it is false for w = mu, whose row coefficients g_3(1, A) w(A) have the same absolute
values as the target's. No estimate that depends only on the moduli of the row coefficients (large sieve of any
order, duality, positivity) can prove it.

Remark. The same Bessel step holds in the proved range of the manuscript; there the row bound is obtained from the
reflection (Proposition 5.1), which uses periodicity of the target twist and is not available to mu. In the range
needed here, M < 2 + 2l with l > M/2, the reflected branch carries the K-loss M + l - 1 > 0
(`c5-target-fe-order2-ledger`, statement (R)). So the open input is a target-sensitive mean square for unreflected
marked rows; in F_q[T] it is true, and the proof route there is Weil's theorem for L(u, nu) itself (coherent term)
together with square-root bounds for its sextic twists (off-diagonal part) [ARGUED: the dual form of the row Gram
matrix was not derived as an exact identity here].

### 5.5 Marked probe, statistic h_up

Blocks that obey the signal law (r = 0 exact, or 1 <= r <= 5 within 25%), d >= 4, k <= (d+1)/2, lam >= 1
(table T9; the count is of blocks):

| target | N = 1 | N = 2 | N = 3 | N = 4 |
|---|---|---|---|---|
| a: maximum (blocks, number >= 1.5) | -0.45 (16, 0) | 1.76 (21, 1) | 1.03 (20, 0) | 0.79 (7, 0) |
| b: maximum (blocks, number >= 1.5) | 1.87 (13, 5) | 0.28 (17, 0) | 1.18 (18, 0) | 1.31 (8, 0) |
| n1 (control): maximum | 1.87 | 0.09 | 2.12 | 0.14 |
| mu (control): maximum | 2.73 | 2.91 | 2.99 | 2.99 |

The values follow |M_N| q^(-N/2) of each target (a: 0.378, 0.857, 0.702, 0.592; b: 1.134, 0.286, 0.810, 1.204 for
N = 1..4) and the constant (6/N) log_q(wt / sqrt(number of marked primes)). No target has two successive degrees
at or above 1.5. The non-multiplicative control n1 has the same range as the targets: by Proposition 3 the probe
value is the Moebius-weighted sum of whatever weight is used, and a random +-1 weight has square-root size.

## 6. Controls

* **C1, random unimodular row family (r1, r2).** Coefficient g_3(1, A) w(A) replaced by G_2^(N') zeta_6^(hash(A)).
  Rows at the diagonal level (excess within 0.08 above); the signal identity of Proposition 3 fails in 62 of 62
  r = 0 blocks; h_up equals the null level 3 - 3d/N within scatter (T5). Named step that fails: Lemma G (the
  product of the cubic and the sextic Gauss sum is mu times a unit).
* **C2, non-multiplicative target (n1, n2: random +-1; dh: nu_a + nu_b).** Proposition 3 holds exactly (it does not
  use multiplicativity of the weight). What fails is only the identification of sum mu(A) w(A) with a coefficient
  of 1/L: for dh the probe is J_a + J_b, the sum of the two signals, and Proposition 2.1 continues 1/L(u, nu_a) and
  1/L(u, nu_b) separately, not the reciprocal of L_a + L_b (the Davenport-Heilbronn mechanism; step: the Euler
  product in the reciprocal, manuscript Lemma 7.1).
* **C3, exact check that the low estimate holds as Weil predicts.** L-polynomials exact (section 4.2); rows of the
  two targets at the diagonal level (section 5.4); slope -1/2 (section 5.3). The low estimate fails for the weight
  mu (the analogue of a target with |M_N| of trivial size) and for pure marks.
* Sign-twisted primes: the weight mu is the function-field form of the twist that makes the Moebius sum trivial;
  it is the control of Proposition 4. Backward heat, unimodular twist, zeta(s+a)zeta(s-a), T-NR, Beurling,
  phase-rotated transfer operator, theta^w: not run; no positivity or zero statement is made that they could test.
* NOT-RUN (neighbouring objects, recorded as required): the compensated probe (12.5) with its rescaled term; the
  completed rows with the cube part and alpha; the first staircase step r = 7; targets of conductor degree other
  than 3; q = 13 rows at d = 4 beyond N' = 5.

## 7. Requirement flags (for this lane's result)

| flag | value | evidence |
|---|---|---|
| R1 multiplicativity essential | false | Propositions 1 to 4 hold for arbitrary row weights; Proposition 3 is exact for the non-multiplicative controls. The Euler product enters only in reading sum mu(A) nu(A) as a coefficient of 1/L, which this lane does not use for any conclusion |
| R2 height-uniform, every window | false | no statement about zeros; a function-field model at fixed q and bounded degree |
| R3 controls fail structurally | false | no conclusion for a control to fail. Recorded steps: random rows fail at Lemma G (EXACT, 62 of 62); mu fails the low estimate (MEASURED, excess up to 5.25); dh fails at the reciprocal Euler product (ARGUED). Not all nine controls were run |
| R4 reaches the critical line | false | in the model the marked vertex reaches h = 3 only with a low input that is the conclusion (Proposition 4); the base probe is capped at h < 1 |

## 8. Three weakest steps

1. **Transcription.** The model is the block model of the two F_q[T] predecessor lanes: squarefree A, sharp degree
   classes, no excluded set, ray classes, alpha or cube part, and the marked term without its rescaled term (which
   the manuscript never uses alone). The statistic h_up identifies the format's low estimate with Cauchy-Schwarz on
   (6.2). A low estimate that is not a norm bound (cancellation in the sum over m beyond the two norms) is outside
   Proposition 4; `r3-method-limit` section 4(a) lists that as a separate requirement.
2. **Asymptotics rest on cited and argued parts.** F1 is exact here only for k <= 10 and is CITED beyond; the span
   form of F2 is exact only for d <= 6 and its general form is not identified (the predecessor's formulation fails
   at d = 6). The law h = r/N uses Theorem A's count of sixth-power frequencies, of which only r <= 5 was exercised
   numerically; the bound on the non-principal part for r >= 1 is MEASURED (it reaches 0.1% only at d = 6) and
   otherwise rests on Theorem C of `r2-ff-tro6-complete` (Weil). Proposition 1's inequality assumes the indices
   that occur are <= d/2.
3. **Finite degrees.** N <= 4 for marked rows, N <= 8 for unmarked, d <= 8, two targets of conductor degree 3 at
   q = 7 and one at q = 13 with fewer blocks. The pre-registered thresholds cannot be decided at these degrees:
   h_up carries a term of size 3/N to 6/N that follows |M_N| of the individual target. "Rows at the diagonal level
   for Weil targets" is a measurement on 67 row vectors, not a theorem here; that it follows from Weil for all
   degrees is ARGUED. Proposition 4 shows the row bound implies the Moebius bound; the converse (that nothing weaker
   than the conclusion suffices for the row bound) is supported by the mu control, not proved.

## 9. Compute record

Server ([compute-server]), only through `~/rh-push/bin/rhrun`, GPU not used, `rhstatus` checked before each launch.
15 units named `rh-c7ff*`; core requests 8 + 8, then 8 + 6 + 2, 14 + 2, 16, 14 + 1. For about ten minutes the
requests summed to 18 (8 + 8 + 2), above the 16-core cap of this lane; I stopped the 2-core unit when I noticed.
Memory requests 4 to 28 GB; the largest allocation announced by the code before it was made was 13.93 GB
(tables of chi_c(m) for d = 6, 7^12 bytes). Longest completed job 440 s; no unit ran longer than about 40 minutes. Units
stopped by me before completion (to stay inside the core cap or because a job was slower than planned): c7ffW (first
copy), c7ffA, c7ffD, c7ffE, c7ffD2, c7ffD3, c7ffD4, c7ffD5; only my own units were touched, each by
`systemctl --user stop <unit>`. No unit of this lane is active now. One unit (c7ffE) was launched with an 8 GB
limit for a job that announced 13.9 GB; it was stopped by me when noticed and rerun under a 28 GB request. Data
left on the server: `~/rh-push/c7-ff-order2-vertex-exact/cache/` (7.4 GB of integer histograms).

Local (Mac): runs through `scripts/memcap.sh 8`, with two exceptions, both mine: the first timing runs of `ffx`
(a few MB), and one test command that would have allocated 13.8 GB; that process was killed by pid at 1.1 GB.
A download of the d = 7, 8 histograms was stopped when free disk fell to 6.8 GB; those files were deleted locally
and the d = 7, 8 analysis was run on the server. Local cache files above 2 MB were removed; `cache/` and the binary
are in `.gitignore`.

Files: `RESULT.md`; `ffx.c`; `exact.py`, `analyze.py`, `analyze_fast.py`, `summary.py`, `view.py`, `tables.py`;
`validate.py` + `validate.log`; `cmpbig.sh` + `cmpbig.log`; `weil.py` + `weil.log`; `mucheck.py` + `mucheck.log`;
`summary.txt` (tables T1 to T9); `blocks_q{7,13}_d*.jsonl`, `checks_q{7,13}_d*.json`; `gen.sh`, `jobs*.txt`.

## 10. For the next allocation

* ORDER-2 through uncompensated prime marks with unreflected rows: closed as a route (Proposition 4 and the mu
  control). The vertex family of the ledger with h > 1 at lx < l is this one: the abscissa 5/6 + M/12 - l/6 is
  reproduced, and its row input needs the conclusion.
* The input that would have to be named for any reopening: a mean-square bound at the diagonal level for the
  unreflected marked rows in N' <= d < 2N' that is false for the mu-twisted weight. A sieve cannot supply it.
* The compensated probe was not computed. In it the rescaled term removes the scalar prime contribution, which is
  the coherent term found here; whether anything with h > 1 survives the subtraction is the one neighbouring
  question this lane leaves (the manuscript's geometry lx >= l says no).
* Correction for `tro6-functionfield` F2: the functional equation in the form p*_{d+1-k} = lambda p*_k fails at
  d = 6 (pair (1, 6)); the c form holds there. The span statement holds in all computed cases.

Proposed map row (not applied):

| Z15c | Order-2 vertex over F_q[T], exact | Base probe: c_k in span{c_i, i <= (d+1)/2} (F1, F2 exact to d = 6), so k > d is a re-expression and h <= 1 - M/2. Marked uncompensated probe: probe = Moebius sum of the weight (exact at r = 0); row = conjugate (mu nu)-twisted sextic row; h = 1 + l - M/2 holds where RH holds, but the diagonal-level row bound implies the Moebius bound (Bessel) and fails for w = mu (excess up to 5.25). Ledger's sub-1/2 vertices: missing coherent term | EXACT (identities), PROVED (Props 1 to 4 relative to predecessors' Theorem A, Lemmas G, R), MEASURED (row norms, d <= 8) | random rows fail at Lemma G; mu fails the low estimate; dh: sum of signals | `c7-ff-order2-vertex-exact` |

No statement about zeta. No abscissa below 0.874886647 is proved.
