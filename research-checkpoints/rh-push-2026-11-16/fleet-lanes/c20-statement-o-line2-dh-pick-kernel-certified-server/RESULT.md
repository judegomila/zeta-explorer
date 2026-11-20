# c20-statement-o-line2-dh-pick-kernel-certified-server: certified conversion for Statement O line 2

Lane of campaign round 20, 2026-11-20. Kind: compute, heavy lane (server through `rhrun`). Scope: this
directory and `~/rh-push/c20-statement-o-line2-dh-pick-kernel-certified-server/` on the server. Nothing here is
a statement about zeros of zeta. One zero of the Davenport-Heilbronn function is enclosed (section 3.2); that
is a statement about a control function.

Labels: PROVED (argument written here), CLASSICAL, CERTIFIED (sign or enclosure of an Arb ball, python-flint
0.9.0), MEASURED (float64 or grid), OPEN.

## Verdict

Registered outcome reached: **line 2 holds relative to certified runs with two independent derivations**, with
three corrections of wording and one new statement.

1. **Kernel certificate (Part 1), CERTIFIED, second derivation.** The DH theta kernel is positive and strictly
   log-concave on u >= 0 and `u L'' - L' < 0` on u > 0. Independent code and a different enclosure method
   (Stirling-number form, mean-value form, tail from u >= 3). Uncertified subintervals: 0. A third variant
   (direct enclosures, 400 bits) also has 0. `L''''(0) = -1.97620088837176...` agrees with the source value.
2. **Pick orders (Part 2), CERTIFIED, third algorithm.** At confluent anchors a = 1 and a = 1/2 (the second
   is not in the sources) the DH Pick form has pivots d_1..d_148 > 0 and d_149 < 0. At a = 1 to order 256 the
   negative pivots are exactly d_149, d_150, d_218, d_219: orders 160 and 200 have 2 negative eigenvalues,
   order 256 has 4. zeta at the same anchors and node sets: all pivots positive to order 256. Negative
   comparisons fail at the registered orders (21, 101, 2). Every registered sign at confluent anchors matched.
   A second pass with a different build and `det` of leading minors gives the same signs at orders 147 to 151.
   On two nested sequences of distinct nodes (in [0.01, 0.5] and in [0.1, 10], 256 nodes each) DH is positive
   definite on the first 148 nodes and indefinite on the first 149, with the same negative pivots 149, 150,
   218, 219; zeta is positive on all 256 (section 2.3).
3. **Order-independent statement (Part 3).** It can be written, in the following form (Theorem C, PROVED here,
   no independent referee): for every order N and every bounded node range [0, beta] there is an ordinary
   Dirichlet series `D_Q = f_DH * prod_q (1 + sqrt(q) q^{-s})` with exact functional equation, positive even
   kernel, no Euler product, and every zero of DH (off-line zeros and zeros with Re s > 1 included), all of
   whose Pick matrices of order <= N with nodes in [0, beta] are positive definite. Certified instances:
   Q = {2, 3, 4, 9} passes order 256 at a = 1, and a 12-factor Q passes all 256 nested nodes in [0.01, 0.5],
   where DH fails at 149. A single function cannot do this for
   all N (Theorem B, CLASSICAL plus the enclosed zero). Two steps are missing for the full read class: node
   ranges reaching infinity, and log-concavity of the kernel of D_Q (MEASURED false for most Q).

Corrections of wording for line 2 (section 4): "DH passes orders 2 to 148" is a statement at the tested node
configurations (confluent anchors a = 1/10, 1/2, 1, 3 and two nested sequences), not over all node sets; the
Taylor-block figures are unchanged and were not re-run; the dependence on the number 148 can be replaced by
Theorem C on bounded node ranges.

No bound moves. The requirement score does not rise (flags in section 5).

## 0. Plan

Decisive first test: Part 1 (it could have refuted the kernel clause near u = 0). It passed in 0.05 s. Then
`GATE.md` registered nodes, precision, orders and predicted signs before any Pick run; two addenda were
written before the supplementary runs (the second after a registered guess failed; recorded there).

New relative to the map and the sources:

| item | source state | here |
|---|---|---|
| Part C of `c1-missing-controls` | one certificate, one referee | independent rerun, different method, 0 uncertified |
| DH confluent order 149 (P5, P7) | Levinson (`pick-induction`), Richards chain (`r2-pick-euler-entry`) at a = 1/10, 1, 3 | ball LDL^T of the jet Pick matrix; new anchor a = 1/2; full sign pattern to order 256 at a = 1; `det` cross-check |
| nested nodes (`euler/RESULT.md`) | positive to order 100, mpmath | ball LDL^T to order 256 (section 2.3) |
| "finite Pick orders are Euler-blind" | tied to the order reached (148) | Theorem C for every N on bounded node ranges; missing steps named |

Code: `part1_kernel.py`, `ref_part1.py`, `pick2.py`, `driver.py`, `ref_check.py`, `part3_checks.py`,
`part3_fpos.py`, `part3_kernel_shift.py`. The source scripts were not opened; definitions and reported
numbers were read from the RESULT files.

## 1. Part 1: the DH theta kernel (CERTIFIED)

Object: `k0 = (sqrt(10 - 2 sqrt 5) - 2)/(sqrt 5 - 1)`, `a = (1, k0, -k0, -1, 0)` mod 5,
`theta(x) = sum a(n) n exp(-pi n^2 x/5)`, `kappa(u) = e^{3u/4} theta(e^u)`, `L = log kappa`, `h = u L'' - L'`.

Method (own derivation). With D = d/du, `D^j e^{-y} = e^{-y} sum_k S(j,k) (-y)^k`, y = (pi/5) n^2 e^u, S the
Stirling numbers of the second kind. `theta_j = D^j theta` is a ball sum over n <= 30 plus a tail radius:
for n > 30 and x >= 1, `n |sum_k S(j,k)(-y)^k| e^{-y} <= n B_j e^{-y/2}` with `B_j = sum_k S(j,k)(2k/e)^k`
(from `y^k e^{-y/2} <= (2k/e)^k`), and `sum_{n>M} n e^{-b n^2} <= e^{-b M^2}/(2b)`, b = pi/10 (the summand
decreases for n >= 1.27). Radii: 2.6e-123 (j = 0) to 4.4e-120 (j = 5). Log-derivatives by
`g^(n) = (theta_{n+1} - sum_{k<n} C(n,k) g^(k) theta_{n-k})/theta`, `L' = 3/4 + g`, `L^(n+1) = g^(n)`. On an
interval I = [m - r, m + r]: `f(I) in f(m) + [-r, r] f'(I)`. 256 bits, python-flint 0.9.0, local, 0.05 s.

| region | certified on every subinterval | subintervals | min width | largest upper bounds | not certified |
|---|---|---|---|---|---|
| A = [0, 0.6] | theta > 0, L'' < 0, L'''' < 0 | 39 | 1/160 | L'' <= -0.6358, L'''' <= -1.6936 | none |
| B = [0.25, 3] | theta > 0, L'' < 0, h < 0 | 201 | 1/128 | L'' <= -0.6977, h <= -0.00955; theta >= 3.30e-6 | none |
| tail u >= 3 | theta > 0, L'' < 0, h < 0 | analytic | - | L'' <= -12.6201, h <= -25.9902 | none |

Step from region A to h (PROVED from the certificate and evenness): `L'(0) = L'''(0) = 0` and `L'''' < 0` on
[0, 0.6] give `L''' < 0` on (0, 0.6], and `h(u) = int_0^u s L'''(s) ds < 0` on (0, 0.6]. Regions A and B
overlap on [0.25, 0.6].

Tail (PROVED; constants are balls). For x >= X0 = e^3 write `theta = e^{-Cx}(1 + r)`, C = pi/5,
`r = sum_{n>=2} a(n) n e^{-C(n^2-1)x}`. Since `y^k e^{-y}` decreases for y >= k and `3 C X0 = 37.86 >= 2`,
`|D^j r| <= rho_j = sum_{n>=2} n sum_k S(j,k) y_n^k e^{-y_n}` at x = X0 (|a(n)| <= 1; n > 30 by the same tail
radius): rho_0 = 7.22e-17, rho_1 = 2.73e-15, rho_2 = 1.06e-13. With R = log(1 + r): `|R'| <= e1 =
rho_1/(1 - rho_0)`, `|R''| <= e2 = (rho_2(1 + rho_0) + rho_1^2)/(1 - rho_0)^2`. Then `L = 3u/4 - C e^u + R`,
`L'' <= -C X0 + e2 < 0` and `h = -(u - 1) C x - 3/4 + u R'' - R' <= -(u - 1)(C X0 - e2) - 3/4 + e2 + e1`,
which is decreasing in u and equals -25.99 at u = 3.

Consistency: `L'(0)`, `L'''(0)`, `L'''''(0)` are balls [+/- 6.1e-76], [+/- 3.6e-75], [+/- 1.1e-73];
`theta(1/x) - x^{3/2} theta(x)` contains 0 with radius below 3.8e-75 at x = 0.5, 0.25, 0.8;
`L''(0) = -0.638409737222...`, `L''''(0) = -1.976200888371769...` (source: -1.97620088837...).
Evenness itself is CLASSICAL (theta inversion) and is used, not certified.

Second pass (`ref_part1.py`): 400 bits, M = 50, start width 1/100, direct interval enclosures without the
mean-value form: A 72 subintervals, B 555 subintervals, min width 1/800, uncertified 0.

Comparison with the source certificate: source range [0, 2] by jets (7094 intervals) plus a tail from 2; here
[0, 3] (240 intervals) plus a tail from 3. Both conclude (P), (LC), (CS) on u >= 0. The two derivations share
the definition of the kernel and the evenness step and nothing else.

Files: `part1_kernel.json`, `ref_part1.json`.

## 2. Part 2: Pick matrices above order 148 (CERTIFIED)

Definitions as in `GATE.md`. `L = F'/F`; DH through the deflated Hurwitz series
`sum_r a(r)(zeta(s, r/5) - 1/(s-1))` (the pole terms cancel because sum a(r) = 0); zeta through
`W = (s-1) zeta(s)`, `L_xi = 1/s - (1/2) log pi + (1/2) psi(s/2) + W'/W`. Check values: `L_xi(1) =
0.04613592806046257536` (equal to the value in `r2-pick-euler-entry`), `L_DH(1) = 0.19275722396843547332`.
Confluent form: jets from `2a P[i][j] + P[i-1][j] + P[i][j-1] = l_i [j=0] + l_j [i=0]`. Decision: ball LDL^T
without pivoting; `d_k` = minor_k / minor_{k-1}; every pivot ball in every run excludes 0, so no precision
doubling was needed. With all pivots non-zero the number of negative pivots at order N is the number of
negative eigenvalues of the order-N form.

### 2.1 Confluent anchors (server unit `rh-c20pick-1120083208`, 8 cores, peak memory below 0.3 GB)

| run | function | anchor | order | bits | negative pivots | first negative pivot (ball) | registered | match |
|---|---|---|---|---|---|---|---|---|
| C1-DH | DH | 1 | 256 | 12000 | 149, 150, 218, 219 | d_149 = [-6.2332275226963398551e-569 +/- 4.09e-589] | 149, 150, 218, 219; 231..256 open | yes |
| C2-DH | DH | 1/2 | 200 | 12000 | 149, 150 | d_149 = [-7.5971677304627484390e-569 +/- 4.52e-589] | first at 149 | yes |
| C1-ZETA | zeta | 1 | 256 | 12000 | none | - (d_256 = 3.65e-1167) | none | yes |
| C2-ZETA | zeta | 1/2 | 200 | 12000 | none | - (d_200 = 4.46e-883) | none | yes |
| C1-Q30 | zeta + quartet (30, 0.3) | 1 | 60 | 12000 | 21, 22 | d_21 = [-3.7897201321387955326e-68 +/- 2.43e-88] | first at 21 | yes |
| C1-Q85 | zeta + quartet (85.6993, 0.3085) | 1 | 130 | 12000 | 101, 102 | d_101 = [-1.6264396276111499828e-406 +/- 1.53e-426] | first at 101 | yes |
| C1-REAL | zeta + real pair at 1/2 | 1 | 20 | 12000 | 2 | d_2 = [-1.1046802510145204889 +/- 1.59e-20] | first at 2 | yes |

Reading for the three target orders at a = 1: order 160: indefinite, 2 negative eigenvalues; order 200:
indefinite, 2; order 256: indefinite, 4. At a = 1/2: orders 160 and 200 indefinite, 2 each. The last positive
order is 148 at both anchors (d_148 = 7.595e-564 at a = 1, 8.689e-564 at a = 1/2). Lowest relative accuracy
of a pivot ball: 8043 bits of 12000.

### 2.2 Second pass on the order-149 sign (`ref_check.py`, unit `rh-c20ref-1120083601`, 16000 bits)

Different build (complex `acb_series`, non-deflated Hurwitz, closed binomial formula for the jets instead of
the recurrence) and different decision (flint `arb_mat.det` of leading minors):

| order | 147 | 148 | 149 | 150 | 151 |
|---|---|---|---|---|---|
| sign of the leading minor | + | + | - | + | + |
| ball | 8.858e-37890 | 6.728e-38453 | -4.194e-39021 | 1.569e-39592 | 2.330e-40167 |

minor_149/minor_148 = -6.233e-569, equal to d_149 of C1-DH to the printed digits. The pattern +, +, -, +, +
is the pattern of two consecutive negative pivots at 149 and 150.

### 2.3 Distinct nested nodes

Nodes `x_k = exp(log lo + v_k (log hi - log lo))`, v_k the base-2 van der Corput sequence, k = 1..256, in
sequence order; 10000 bits.

| run | function | node range | order | negative pivots | first negative pivot (ball) | registered | match |
|---|---|---|---|---|---|---|---|
| C3-DH | DH | [0.01, 0.5] | 256 | 149, 150, 218, 219 | d_149 = [-1.8183011061232641280e-895 +/- 2.80e-915] | d_1..d_100 > 0; first negative in [149, 200] (guess) | yes |
| C3-ZETA | zeta | [0.01, 0.5] | 256 | none | - (d_256 = 6.05e-1846) | none | yes |
| C3-Q30 | zeta + quartet (30, 0.3) | [0.01, 0.5] | 60 | 21, 22 | d_21 = [-3.4864344881656291041e-112 +/- 1.06e-133] | first in [10, 25] | yes |
| C4-DH | DH | [0.1, 10] | 256 | 149, 150, 218, 219 | d_149 = [-9.2011497379467474792e-525 +/- 3.34e-545] | first negative in [149, 256] (guess) | yes |
| C4-ZETA | zeta | [0.1, 10] | 256 | none | - (d_256 = 8.56e-1246) | none | yes |
| X3-DHE64 | DH * B_c^64 (section 3.3) | [0.01, 0.5] | 256 | 219, 220 | d_219 = [-5.4289049033719163359e-1167 +/- 1.21e-1188] | none (guess) | no |
| X3-Q3 | DH * 12 factors (section 3.3) | [0.01, 0.5] | 256 | none | - (d_256 = 1.82e-1276) | none (guess) | yes |

C3-DH and C4-DH were run twice with identical output (server unit `rh-c20pick-1120083208`; Mac under
`scripts/memcap.sh 8`, files in `local/`). Lowest relative accuracy of a pivot ball: 3605 bits of 10000
(C3-ZETA).

Reading. On both nested sequences DH is positive definite on the first 148 nodes and indefinite on the first
149 (CERTIFIED). The source figure "positive to order 100 on nested nodes in [0.01, 0.5]" (measured) is
confirmed and extended to 148, and the nested sequence fails at 149. The set of negative pivots is the same
on the two nested sequences and at the confluent anchors a = 1 and a = 1/2: {149, 150, 218, 219} for DH,
{21, 22} for the quartet at height 30, {219, 220} for DH * B_c^64. This is an observation on the
configurations run (CERTIFIED there, no proof that it holds for other node sets; `pick-induction` reports
later first failures at confluent anchors a >= 10).

### 2.4 What Part 2 does and does not establish

- CERTIFIED: at a = 1 and a = 1/2 the DH confluent Pick form is positive definite at every order <= 148 and
  indefinite at 149. With the sources this is three algorithms (Levinson, Richards chain, LDL^T; plus `det`)
  and five anchors (0.01 measured; 1/10, 1/2, 1, 3 certified).
- CERTIFIED: the same pair (148, 149) on the first nodes of two nested sequences of distinct nodes.
- Not established: positivity of DH Pick matrices of any order N >= 2 over all node sets. No file read by this
  lane contains a certificate over a continuum of node configurations for DH. "DH passes orders 2 to 148"
  should carry the node configurations.
- The registered targets 160, 200, 256 are orders at which DH fails at confluent anchors; they do not extend
  the passing range. The passing range is extended by a different function (section 3.3).

## 3. Part 3: an order-independent form of "finite Pick orders are Euler-blind"

Notation. `F` even entire, real on R, of order 1, F > 0 on the node set; `L_F = F'/F`;
`K_F(x,y) = (L_F(x) + L_F(y))/(x + y)`. For a node configuration x = (x_1..x_N) in [0, beta]^N let `M_F(x)` be
the matrix of bivariate divided differences `M[i][j] = K_F[x_1..x_i; x_1..x_j]`. For distinct nodes
`M_F = T K_F(X) T^t` with T lower triangular and invertible, so M_F and the Pick matrix have the same
inertia; M_F is continuous on [0, beta]^N when K_F is analytic near [0, beta]^2 (Hermite-Genocchi); at
x = (a, .., a) it is the jet matrix of section 2. "Order N positive on [0, beta]" means M_F(x) positive
definite for every x in [0, beta]^N; it contains all distinct-node and all confluent Pick matrices of order
<= N with nodes in [0, beta].

### 3.1 Lemmas (PROVED)

**Lemma 1 (additivity).** `K_{F G} = K_F + K_G`, `M_{F G} = M_F + M_G`. (L is a logarithmic derivative.)

**Lemma 2 (the factors).** For an integer q >= 2 let `B_q(s) = 1 + sqrt(q) q^{-s}` and
`E_q(z) = q^{z/2} + q^{-z/2}`. Then
(a) `q^{s/2} B_q(s) = q^{s/2} + q^{(1-s)/2}` is invariant under s -> 1 - s and equals `q^{1/4} E_q(z)` at
s = 1/2 + z;
(b) the zeros of B_q are `1/2 + i pi (2k+1)/log q`, k in Z: all on the line, infinitely many;
(c) `L_{E_q}(z) = (log q / 2) tanh(z log q / 2) = sum_{gamma > 0} 2z/(z^2 + gamma^2)` over the positive
ordinates, and `K_{E_q}(x,y) = sum_gamma 2 Re[1/((x - i gamma)(y + i gamma))]`, positive semidefinite;
(d) for every real configuration x of N nodes, `M_{E_q}(x) = sum_gamma 2 Re[v_gamma v_gamma^*]` with
`v_gamma[i] = (-1)^{i-1}/prod_{l<=i}(x_l - i gamma)`, and it is positive definite.
Proof of (d): if `c^t M c = 0` for real c then `sum_i c_i v_gamma[i] = 0` for every gamma. Multiplying by
`prod_{l<=N}(x_l - p)` gives a polynomial in p of degree <= N - 1, `sum_i c_i (-1)^{i-1} prod_{l>i}(x_l - p)`,
with infinitely many zeros p = i gamma, so it vanishes identically; its terms have distinct degrees N - i, so
c = 0.
The same holds for `B_c(s) = 1 + c sqrt2 2^{-s} + c sqrt3 3^{-s} + sqrt6 6^{-s}`, 0 <= c < 1 (not
multiplicative for c > 0: b(6) - b(2)b(3) = (1 - c^2) sqrt 6): with X = sqrt2 2^{-s}, Y = sqrt3 3^{-s} a zero
has Y = -(1 + cX)/(X + c), and `|Y|^2 - 1 = (1 - c^2)(1 - |X|^2)/|X + c|^2`, so |Y| > 1 iff |X| < 1, while
|X| < 1 iff Re s > 1/2 iff |Y| < 1; hence |X| = |Y| = 1. CERTIFIED check for c = 1/2: 17 sign changes on the
line for 0 < t < 60.013 and an argument-principle count of 17 on the rectangle -3 <= Re s <= 4
(`part3_checks.json`).

**Lemma 3 (f_DH on the real axis).** `f_DH(s) > 0` for every real s > 0. Proof: the series converges for
s > 0 when grouped in blocks of five (the coefficients have period 5 and sum 0), and each block is
`[g(1/5) - g(4/5)] + k0 [g(2/5) - g(3/5)]` times 5^{-s} with `g(t) = (n + t)^{-s}` decreasing and k0 > 0.
So F_DH > 0 on [0, infinity) and K_DH is analytic near [0, beta]^2 for every beta (at the corner (0,0) because
L is odd). Ball sweep on [1/2, 2] away from s = 1: lower bound 0.110 (`part3_fpos.json`).

### 3.2 Theorem B: no single function with an off-line zero passes every order (CLASSICAL + CERTIFIED zero)

If F has a zero w with Re w > 0 then L_F has a pole in the right half-plane, L_F is not positive-real, and by
Pick-Nevanlinna interpolation on a set with an accumulation point some finite Pick matrix on any interval of
(0, infinity) is not positive semidefinite (`euler/RESULT.md` (1.2); refereed form in
`r2-pick-euler-entry` 1.2 step 1). For DH: interval Newton on the box of half-width 1e-20 about
`0.80851718245663738555 + 85.69934848537759217193 i` maps the box into itself (image radius below 1.5e-88;
with `H = 5^s f_DH`, the enclosure of H' on the box is 4.0579 - 2.1950 i +/- 5e-15 and excludes 0), so f_DH has exactly one zero in
that box, with Re s - 1/2 >= 0.3085171824 (CERTIFIED, `part3_checks.json`; third derivation after the two
referee passes cited in line 2). Consequence: the set of orders DH passes on any interval is finite. An
order-independent blindness statement therefore has to be about a family; the order at which a given member
fails is a property of its zero set (section 2: 149 for DH at small anchors).

### 3.3 Theorem C: blindness at every order on bounded node ranges (PROVED; no independent referee)

Let Q be a finite multiset of integers of the form 2^i 3^j >= 2 and
`D_Q(s) = f_DH(s) prod_{q in Q} B_q(s)`.

1. D_Q is an ordinary Dirichlet series with real coefficients d = a * beta, beta supported on 3-smooth
   integers, beta(1) = 1.
2. `(5 prod q / pi)^{s/2} Gamma((s+1)/2) D_Q(s)` is invariant under s -> 1 - s; at s = 1/2 + z it is a
   positive constant times `F_DH(z) prod E_q(z)` (Lemma 2 (a)).
3. D_Q has no Euler product: d(n) = a(n) for n prime to 6, and `d(91) - d(7) d(13) = a(1) - a(2)a(3) =
   1 + k0^2 = 1.0807009...`.
4. The zeros of D_Q are the zeros of f_DH (all of them, including the enclosed zero of 3.2 and the zeros with
   Re s > 1) and zeros on the line.
5. Its kernel is `sum over sign choices of kappa(u + sum_q (+/-) log q)`: positive and even (Part 1 for
   kappa > 0).
6. `K_{D_Q} = K_DH + sum_q K_{E_q}` and `M_{D_Q} = M_DH + sum_q M_{E_q}` (Lemma 1), so at every node
   configuration the Pick matrix of D_Q dominates that of DH: adding factors never creates a failure.
7. **For every N >= 1 and beta > 0 there is Q such that order N is positive on [0, beta] for D_Q.**
   Proof: by Lemma 3, x -> M_DH(x) is continuous on the compact set [0, beta]^N, so
   `A = sup_x ||M_DH(x)||` is finite. By Lemma 2 (d), x -> lambda_min(M_{E_2}(x)) is continuous and positive
   on [0, beta]^N, so its infimum mu is positive. Take Q = m copies of 2 with m > A/mu. Then
   `M_{D_Q}(x) >= (m mu - A) I > 0` on [0, beta]^N. Orders below N are leading principal blocks.

The same proof with xi in place of F_DH needs no size condition (Theorem A): `K_{xi E} = K_xi + K_E >= K_xi`
at every order and every node set in (0, infinity), so every finite Pick statement true for zeta is true for
`zeta(s) B_c(s)`, a Dirichlet series with functional equation and non-multiplicative coefficients (c = 1/2:
certified positive to order 64 at a = 1, run S-GT). Theorem A needs no compactness; its function has the
zeros of zeta and zeros on the line, so it is a statement about what Pick positivity requires, not a control
with off-line zeros.

Statement for line 2 in order-independent form: **for every N and every bounded node range, the class
{exact functional equation, ordinary Dirichlet series, positive even kernel, all Pick matrices of order <= N
on that range positive definite} contains a function without Euler product whose zeros include
0.8085171825 + 85.6993484854 i and zeros with Re s > 1.** The control depends on N (by Theorem B it must).

Certified instances (confluent anchor a = 1, order 256, 12000 bits; units `rh-c20dhe-1120083424`,
`rh-c20q-1120083900`):

| function | first negative pivot | registered guess | match |
|---|---|---|---|
| DH | 149 | 149 | yes |
| DH * B_c, c = 1/2 (one factor, conductor 30) | 210 | 150 to 200 | no (later than guessed) |
| DH * B_c^8 | 217 | later than m = 1, or none | yes |
| DH * B_c^64 | 219 | none | **no** |
| DH * B_c^4096 | 221 | none | **no** |
| DH * B_2 B_3 B_4 B_9 (conductor 1080) | none to 256 | above 221 or none | yes |
| DH * prod of 12 factors (q = 2, 3, 4, 6, 8, 9, 12, 16, 18, 24, 27, 32) | none to 256 | none | yes |
| DH * prod of 21 factors (3-smooth q <= 128) | none to 256 | none | yes |

On the nested nodes in [0.01, 0.5] (10000 bits): DH * B_c^64 fails first at 219 (registered guess: none;
**no**); DH * the 12-factor product is positive on all 256 nodes (registered: none; yes).

The first failure order is non-decreasing along m = 0, 1, 8, 64, 4096 (149, 210, 217, 219, 221), as item 6
requires. Powers of one factor repeat the same ordinates, so the m of item 7 grows very fast with N; factors
with different q add new ordinates and reach order 256 with four factors. The existence proof (item 7) and
the certified instances use different members of the family; both are covered by items 1 to 6.

### 3.4 Missing steps (OPEN)

(a) **Unbounded node range.** Item 7 uses compactness of [0, beta]^N. For nodes tending to infinity the
    margin mu(N, beta) of M_{E_q} and the size of M_DH are not compared. What is known: for large x,
    `L_{E_q}(x) -> (log q)/2` and K_{E_q} tends to a Cauchy kernel; the Gamma part of L_DH,
    `c_0 + (1/2) psi(3/4 + z/2)`, has real part >= c_0 + (1/2) psi(3/4) = -0.311 on Re z > 0, so adding a
    constant >= 0.311 makes it positive-real; the term f'/f(1/2 + z) is analytic only for
    Re z > 0.6204 (zeros of DH with Re s up to 1.1203625) and is not controlled by a constant near the
    imaginary axis. A uniform statement on (0, infinity) needs a bound on the divided differences of
    f'/f(1/2 + x) against lambda_min(M_E) as nodes grow. Not attempted.
(b) **Log-concavity of the kernel.** The kernel of D_Q is a sum of translates of kappa. MEASURED (float64
    grid, `part3_kernel_shift.json`): log-concave for Q = {2} and {2, 2}; not log-concave for {3}, {4}, {6},
    {2, 3}, {2, 3, 4, 9}, {2}^4, {2}^8, {2}^12. So D_Q satisfies "positive even kernel" and, for most Q, not
    the clauses (LC), (CS) of Part 1. A family keeping (LC) at every N is not known to this lane.
(c) **All node sets for DH itself** (section 2.4): not needed for Theorem C, needed for the sentence "DH
    passes order N" without qualification.

## 4. Controls

This lane is a control statement, not an attack. The comparisons registered in `GATE.md`:

| comparison | role | result |
|---|---|---|
| zeta at the same anchors and nodes | positive | all pivots positive to order 256 (a = 1), 200 (a = 1/2), 256 on both nested sets (CERTIFIED) |
| zeta + quartet at (30, 0.3) | negative, zero inside the height range | fails at 21 (confluent) and 21 (nested), as registered |
| zeta + quartet at DH's zero (85.6993, 0.3085) | negative | fails at 101, as registered (source: 101) |
| zeta + real pair at z = 1/2 | negative, zero inside the node range | fails at order 2, as registered |
| E alone (c = 1/2) | positive (Lemma 2) | positive to order 64 (CERTIFIED, run S-EONLY) |

Named failures F1 to F5 of `GATE.md`: none occurred. Two registered guesses in Addendum 1 were wrong
(X-DHE64 and X-DHE4096 are not positive at order 256); they concern the size of m, not a registered sign of
line 2, and are recorded in Addendum 2 and in section 3.3.

Reading for the control battery: Theorem C is a statement about the DH control only. It does not change the
status of HEAT, TW, U, E_a, T-NR, B, phase-rotated transfer operator or theta^w for any device.

Proposed wording for line 2 (a new version of Statement O is the checkpoint's decision; no label is changed
here):
- KER: "(Arb certificate, `c1-missing-controls` Part C; independent rerun `c20-...` Part 1, 0 uncertified)".
- Finite Pick positivity: "at confluent anchors a = 1/10, 1/2, 1, 3 and on two nested node sequences:
  positive definite at orders <= 148, indefinite at 149 (three algorithms). Not certified over all node sets. For every N and bounded node range
  the family D_Q of `c20-...` Theorem C passes order N and keeps the zeros of DH (proved, zero referees)."
- Owed after this lane: an independent referee on Theorem C and Lemmas 2, 3; steps (a), (b) of 3.4.

## 5. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 multiplicativity essential | false | No step uses an Euler product. Theorems A and C show the opposite for the Pick ladder: positivity at any fixed order is kept or created by multiplying with a non-multiplicative factor. |
| R2 height-uniform, every window | false | Finite orders and bounded node ranges only; step 3.4 (a) is open. |
| R3 fails for every control | false | Not an attack. The lane strengthens one control (DH family). |
| R4 reaches the critical line | false | Finite stages only. Theorem C says each finite stage on a bounded range is passed by a function with zeros off the line. |

About zeros of zeta: no.

## 6. Three weakest steps

1. **Theorem C has no independent referee, and its range is bounded.** The proof is elementary (additivity,
   Lemma 2 (d), compactness), but the continuity of the divided-difference matrix up to the corner x = 0 and
   to confluent configurations is quoted (Hermite-Genocchi), not written out, and the statement stops at
   bounded node ranges (3.4 (a)). `REFEREE.md` in this directory is a second pass by the same agent.
2. **Kernel clause for the family.** D_Q keeps "positive even kernel" and loses log-concavity for most Q
   (MEASURED, float64 grid, not certified in either direction). If line 2's read class is taken with (LC) and
   (CS), Theorem C covers it only for the members where log-concavity holds, and those are measured, few and
   not enough for large N.
3. **"DH passes orders 2 to 148" is configuration-wise.** Certified at four confluent anchors and on two
   nested sequences; nothing over all node sets. The failing order was 149 on every configuration run here;
   that is an observation, not a bound on other node sets. Evenness of kappa and the Pick-Nevanlinna step are CLASSICAL inputs used without re-derivation, and
   the two Part 1 derivations share the kernel definition read from the source.

## 7. Server and files

Units (all through `rhrun`, all finished and inactive; `rhstatus` read before the first and the fourth launch, rh.slice
at 39 to 40 GB; the second and third launches followed within four minutes without a new reading): `rh-c20pick-1120083208` (8 cores, 12 GB limit, peak 0.3 GB), `rh-c20dhe-1120083424` (5 cores),
`rh-c20ref-1120083601` (2 cores), `rh-c20q-1120083900` (4 cores). GPU not used (ball arithmetic).
The server was heavily loaded (load average 86 to 116 on 48 cores); the DH node evaluations took 940 to 990 s
there against 285 s on the Mac, so C3-DH, C4-DH and X3-Q3 were also run locally (identical output).

Files: `GATE.md`, `RESULT.md`, `REFEREE.md`, `lanes.jsonl`, `part1_kernel.{py,json}`, `ref_part1.{py,json}`,
`pick2.py`, `driver.py`, `ref_check.py` (output `server/ref_check.json`), `part3_checks.{py,json}`, `part3_fpos.{py,json}`,
`part3_kernel_shift.{py,json}`, `server/` (run JSON and logs copied from the server), `local/` (runs made on
the Mac under `scripts/memcap.sh 8`).
