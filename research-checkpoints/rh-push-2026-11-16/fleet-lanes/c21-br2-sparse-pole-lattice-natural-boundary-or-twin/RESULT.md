# c21-br2-sparse-pole-lattice-natural-boundary-or-twin: RESULT

Date 2026-11-20. Round 21, kind: deepen. Scope: this directory only. Nothing committed or pushed.
Server: not used. The question was decided on paper for the class stated below; the assigned first test
(radial growth at 20 pole points, two sequences) ran locally through `scripts/memcap.sh 8` (python3.14,
mpmath at 70 digits, 64 s; float64 illustration 3 s; cross-checks 20 s). The large-scale census is the
sibling lane `c21-br2-relative-product-pole-lattice-census-server`; at the time of writing it had a
pre-registration (`PREREG.md`) and no result file, so the comparison below is with its pre-run analysis only.
No independent referee has read this file (`REFEREE.md` is the author's adversarial pass and says so;
referees = 0).

**No statement about zeros of zeta is made. Every result is a statement about the family
G = zeta times a relative Euler product over a sparse set of primes: it says that G does not continue across
the critical line, so G is not a twin. It locates no zero.** Requirement flags: R1 = R2 = R3 = R4 = false
(section 6).

Labels: PROVED (complete argument in this file; author only) / CLASSICAL (recalled, not opened) /
MEASURED (mpmath 70 digits or float64, as stated) / ARGUED / OPEN.

Sources read: `BRIEF.md` to the end; `STRATEGY.md` section 4.0 (lead BR, BR-0, BR-2, BR-3) and section 1 rows;
`c20-euler-shape-rigidity-infinite-modified-primes` RESULT.md (regimes, Theorem C) and REFEREE.md (author's
pass, independent pass E1 to E4, point P4); `OBSTRUCTION_MAP.md` section 2 rows THIN, DEL, B and the X2 / X3
neighbourhood; sibling `PREREG.md`.

## 0. Verdict

**BR-2 is decided as "natural boundary, no twin" for every set S with sum over q in S of (log q)^(-gamma)
finite for some gamma < 1 (Theorem W, PROVED, author only). It stays OPEN for the denser part of regime (K)
(sets with sum over S of 1/log q infinite and sum over S of q^(-eps) finite for every eps).** Registered
outcome: a natural-boundary row; score 0.

1. (Lemma P, PROVED; the planner's first lemma, corrected.) At a pole point of p the modulus of G/zeta is at
   least c_S exp(-L_S(delta))/(delta log p), with L_S(delta) = sum over q in S, q != p, of log(1 + q^(-delta)).
   If N_S(x) <= kappa log log x + C for all x with kappa log 2 < 1, then abs(G/zeta) >= c delta^(-(1 - kappa log 2))
   /log p at every pole point, uniformly in the index of the pole, and Re s = 1/2 is a natural boundary of G.
   This covers log q_(k+1)/log q_k >= a > 2 eventually (the sequence log q_k = e^k: exponent 1 - log 2 = 0.307).
   It does not cover log q_k = k^3 (L_S(delta)/log(1/delta) is 62 at delta = 1e-10) or ratio a <= 2.
2. (Sharpness of Lemma P, PROVED by example.) For frequencies lambda_k = 2^k lambda_0 and alpha = -q^(1/2) the
   product telescopes: prod over k >= 0 of (1 + w^(2^k)) = 1/(1 - w). The object has the same lattice geometry
   (pole lattices of all the factors dense on the line), sits exactly at the threshold kappa log 2 = 1, and is
   meromorphic across the line. So no argument that reads only the sizes of the factors can pass ratio 2, and
   any theorem beyond the threshold must use that the frequencies are logarithms of distinct primes. This
   object (label CYC) is a Beurling-type control: generalised primes of norms Q^(2^k).
3. (Theorem W, PROVED.) Let S be an infinite set of primes with sum over S of (log q)^(-gamma) finite for
   some gamma < 1, and abs(alpha_q) = q^(1/2) on S (any phases), alpha_p = 1 off S. Then G has no meromorphic
   continuation to any neighbourhood of any point of Re s = 1/2. The proof tests the logarithmic derivative
   against a window on the line at the frequencies n log q_(k0); a meromorphic continuation bounds the result,
   while the product gives a spike of height log q_(k0) times the window mass unless other spikes cancel it;
   Weyl equidistribution of n log q_(k0)/log q_k modulo 1 (irrational because q_(k0)^a = q_k^b is impossible)
   shows that a positive proportion of n have no cancelling spike. Covers log q_k = e^k, e^(k/2), k^3, k^2,
   k^(1.5), every k^beta with beta > 1. The step fails for CYC exactly where irrationality is used.
4. (Twin.) A twin must be meromorphic on C (it must carry zeta's functional equation). In the class of
   Theorem W there is none. In the open remainder of regime (K) a twin is not excluded by this lane; the
   lane found no candidate and section 5 states why the present method stops there.
5. (First test, MEASURED.) log q_k = e^k: all 40 pole-point rows have radial slope between 0.74 and 1.24
   (lower bound of Lemma P: 0.307); generic points have slope between -0.28 and 0.18. log q_k = k^3: slopes at
   pole points have both signs (6 of 40 rows at or below 0 on the last five decades), generic points reach
   log abs(G/zeta) = -95 and +50 at delta = 1e-11: the pole term log(1/delta) = 25 is smaller than the
   fluctuation of the other factors, as the corrected lemma predicts. Lemma P's inequality holds in all 120
   pole rows (largest value of bound minus measured: -0.196).

## 1. Plan and what is new against the record

Object (BR-2): G(s) = zeta(s) m(s), m(s) = prod over q in S of (1 - q^-s)/(1 - alpha_q q^-s),
alpha_q = q^(1/2) e^(i theta_q). On file: Theorem C of the c20 lane (a twin in regime (K) has no off-line zero
beyond zeta's; a finite-order twin has a zero of G/zeta on the line) and the sentence "natural boundary
expected; not proved" (its referee point P4, which notes that Fabry-type gap theorems do not apply as stated).
The sibling's pre-run analysis has P0 (alpha = +q^(1/2): not meromorphic at the single point s = 1/2) and P1
(Lemma P for ratio > 2). New here: the exact form and sharpness of the pole-point lemma (the telescoping
example at ratio exactly 2), and Theorem W, which removes the ratio condition and the dependence on phases and
reaches every polynomially sparse set. Nothing here is claimed new against the literature on natural
boundaries of Euler products (Estermann, Dahlquist and later work treat products over all primes with local
zeros inside the region of convergence; that literature was not opened).

Notation. z = s - 1/2 = delta + iy; lambda_k = log q_k (q_1 < q_2 < ... the primes of S);
N(s) = 1/m(s) = N_1(z) U(s), with
N_1(z) = prod over k of (1 - e^(i theta_k - lambda_k z)),  U(s) = prod over q in S of (1 - q^-s)^-1.
Under sum over S of q^-eps finite for every eps > 0: U is analytic and zero-free in Re s > 0, and N_1 is
analytic and zero-free in Re z > 0 (absolutely convergent product, no vanishing factor). G continues
meromorphically across a point of the line iff N_1 does. The zeros of the factor k of N_1 are the lattice
z = i (theta_k + 2 pi n)/lambda_k, n in Z (the local pole lattice of G at q_k).

## 2. Lemma P (pole-point lower bound) and its threshold

**Lemma P (PROVED).** Let p = q_j in S, n in Z, t = (theta_j + 2 pi n)/lambda_j, s = 1/2 + delta + it, delta > 0.
Then
abs(m(s)) >= c_S exp(-L_j(delta)) / (1 - p^(-delta)) >= c_S exp(-L_j(delta)) / (delta log p),
c_S = prod over q in S of (1 - q^(-1/2)) > 0,  L_j(delta) = sum over k != j of log(1 + e^(-lambda_k delta)).
If N_S(x) = #{q in S, q <= x} <= kappa log log x + C_0 for all x >= 3, then
L_j(delta) <= kappa log 2 log(1/delta) + C_1 for 0 < delta <= 1, with C_1 = C_0 log 2 + 0.2 kappa. Hence for
kappa log 2 < 1: abs(m(1/2 + delta + it)) >= c delta^(-(1 - kappa log 2))/log p for every pole point, with c
independent of p and n.

Proof. The factor at p has alpha_p p^-s = p^(-delta) exactly, so its denominator is 1 - p^(-delta) <= delta log p
and its numerator is at least 1 - p^(-1/2). For q != p: abs(1 - q^-s) >= 1 - q^(-1/2) and
abs(1 - alpha_q q^-s) <= 1 + q^(-delta). Multiply. For the bound on L: with N(x) the counting function of the
lambda_k, L(delta) = int_0^inf log(1 + e^(-delta x)) dN(x) = delta int_0^inf N(x)/(e^(delta x) + 1) dx
<= int_0^inf (kappa log^+(u/delta) + C_0)/(e^u + 1) du <= (kappa log(1/delta) + C_0) log 2
+ kappa int_1^inf log u/(e^u + 1) du, and the last integral is below 0.2 (it is at most int_1^inf e^-u log u du = 0.2194). (The exact constant for
N(x) = kappa log x is -kappa (log 2)^2/2, from int_0^inf log u/(e^u + 1) du = -(log 2)^2/2; checked
numerically in `ref_check.log`.) QED

Corrections to the planner's sketch. (i) "The rest are 1 + O(q^-delta) with summable logs" is false as a
uniform statement: sum over q with delta log q > 1 of q^-delta is bounded in delta only for lacunary log q;
for log q_k = k^3 it is 0.09 delta^(-1/3). The correct object is L(delta) as a whole. (ii) With the hypothesis
stated for all x (not only at x = e^(1/delta)) the planner's condition N_S(e^(1/delta)) log 2 <= (1 - c) log(1/delta)
is the right one, constant included: the head count overestimates (log(1 + e^-x) < log 2) by what the tail
adds. (iii) Zeta's own factor: G = zeta m and zeta(1/2 + it) vanishes on a discrete set, so the pole points with
zeta(1/2 + it) != 0 are still dense and abs(G) -> infinity radially at each of them. (iv) Uniformity in the
pole index n: holds, the bound does not see n.

**Corollary P1 (PROVED).** If N_S(x) <= kappa log log x + C_0 with kappa < 1/log 2 = 1.4427 (in particular if
lambda_(k+1)/lambda_k >= a > 2 from some k on, where kappa = 1/log a), then Re s = 1/2 is a natural boundary of
G: G has no meromorphic continuation to any disc centred on the line.
Proof. In such a disc D the poles of a continuation are isolated. The pole points with zeta != 0 are dense
in D intersect the line and abs(G) -> infinity along the horizontal ray into each; so each is a pole.
Contradiction. QED

**Threshold and its sharpness (PROVED by example).** The bound of Lemma P stops giving growth when
limsup L(delta)/log(1/delta) >= 1, that is at kappa = 1/log 2, lacunary ratio a = 2. This is not a defect of
the proof. Take real numbers lambda_k = 2^k lambda_0 (k >= 0) and theta_k = pi. With w = e^(-lambda_0 z):
N_1(z) = prod over k >= 0 of (1 + w^(2^k)) = 1/(1 - w)   (abs w < 1; finite stages (1 - w^(2^(K+1)))/(1 - w)).
Every factor has its zero lattice on Re z = 0, the union is dense, kappa log 2 = 1 exactly, and
m = 1/N_1 times the numerator product is bounded at every pole point (measured slope 0.000 in all 20 rows,
section 4). The lattice points of factor k are zeros of that factor and regular non-zero points of the whole
product: the zero is cancelled by the divergence of the remaining factors. As a Beurling-type object: the
generalised primes of norms q_k = Q^(2^k), with alpha_q = -q^(1/2). The norms are multiplicatively dependent.
For the lambda_k = log of distinct rational primes this dependence is impossible, and section 3 uses exactly
that.

Sets between the threshold and Theorem W (for example log q_k = e^(k/2), ratio 1.65, kappa log 2 = 1.386):
Lemma P gives nothing; Theorem W applies.

## 3. Theorem W (natural boundary for polynomially sparse sets)

**Theorem W (PROVED; author only).** Let lambda_1 < lambda_2 < ... be the logarithms of the primes of an
infinite set S with
(W)  sum over k of lambda_k^(-gamma) finite for some gamma in (0, 1),
and let theta_k be arbitrary real numbers. Then N_1(z) = prod over k of (1 - e^(i theta_k - lambda_k z)) has no
meromorphic continuation to any disc centred on a point of Re z = 0. Consequently
G(s) = zeta(s) prod over q in S of (1 - q^-s)/(1 - alpha_q q^-s), abs(alpha_q) = q^(1/2), has Re s = 1/2 as a
natural boundary (for meromorphic continuation), and no function meromorphic on C agrees with G on Re s > 1.

The only arithmetic input: for k != j the ratio lambda_j/lambda_k is irrational (q_j^a = q_k^b with integers
a, b >= 1 contradicts unique factorisation).

Proof. Write H = N_1'/N_1. For Re z > 0, absolutely convergent:
H(z) = sum over k of lambda_k/(e^(lambda_k z - i theta_k) - 1) = sum over k, n >= 1 of lambda_k e^(i n theta_k) e^(-n lambda_k z).
Suppose N_1 is meromorphic in a disc D centred at i y_c. Fix h > 0 with [y_c - h, y_c + h] inside D, an
integer A >= (1 + gamma)/(1 - gamma) + 2, and a window T(y) = b((y - y_c)/h), b >= 0 of class C^A supported
in [-1, 1] with integral 1. Then T^(xi) := int T(y) e^(i xi y) dy satisfies T^(0) = h and
abs(T^(xi)) <= C_A h (1 + h abs(xi))^(-A).

Step 0 (discarding finitely many primes). Removing the factors k <= K_0 divides N_1 by a finite product of
entire functions, so the tail is also meromorphic in D. Drop the prime 2 if it is in S, so that
lambda_k >= 1 for all k. Let Z := sum over all k of lambda_k^(-gamma) (finite by (W); fixed once and for all).
Since the lambda_k increase, k lambda_k^(-gamma) -> 0, so the counting function satisfies N(Y) = o(Y^gamma). Set W_k := (1/h)(8 C_A Z lambda_k^(1+gamma))^(1/A). By the choice of A,
W_k/lambda_k <= C_2 h^-1 lambda_k^(-gamma) with C_2 = (8 C_A Z)^(1/A). Choose K_0 = K_0(h) so that
(0)  sum over k > K_0 of 2 W_k/lambda_k <= 1/4   (the terms are at most 2 C_2 h^-1 lambda_k^(-gamma), a convergent series).
From here N_1 denotes the tail product over k > K_0 and all sums over k run over k > K_0.

Step 1 (the meromorphic side). H is meromorphic in D and analytic in Re z > 0; on the compact set
{0 <= Re z <= delta_0, abs(y - y_c) <= h} its poles are finitely many points i y_1, ..., i y_M of the line,
simple, with integer residues r_i (orders of N_1). So H = sum r_i/(z - i y_i) + H_0 with H_0 analytic near
that set. For omega > 0 put
I(omega, delta) = int T(y) H(delta + iy) e^(i omega y) dy.
As delta -> 0+: the H_0 part tends to int T(y) H_0(iy) e^(i omega y) dy = O(omega^-1) (one integration by parts);
for a pole, int T(y) e^(i omega y)/(delta + i(y - y_i)) dy = int_0^inf e^(-delta u) e^(i u y_i) T^(omega - u) du
-> e^(i omega y_i) (2 pi T(y_i) - int_omega^inf T^(v) e^(-i v y_i) dv). Hence
(1)  limsup over omega -> +infinity of abs(I(omega, 0+)) <= B := 2 pi sum over i of abs(r_i) T(y_i) < infinity.
(The pole kernel was checked numerically, `ref_check.log` item 3.)

Step 2 (the product side). Term by term, I(omega, delta) = sum over k, n of lambda_k e^(i n theta_k)
e^(-n lambda_k delta) T^(omega - n lambda_k). The sum over the terms with n lambda_k > 2 omega is dominated by
C sum over k of lambda_k^(1-A) h^(1-A), finite by (W) and A - 1 >= gamma; the other terms are finitely many. So
(2)  I(omega, 0+) = sum over k, n >= 1 of lambda_k e^(i n theta_k) T^(omega - n lambda_k)   ("spikes" of height
     lambda_k h at the multiples of lambda_k, of width 1/h).
(Identity (2) at delta = 0.05 was checked against direct quadrature, `ref_check.log` item 2.)

Step 3 (one spike that nothing cancels). Fix k_0 > K_0 with lambda_(k0) h >= 8 (B + 1) and
lambda_(k0) >= 8 R, R := C_A' h^(-A) sum over k of lambda_k^(1-A) (C_A' is the constant in (4) below). Take
omega = n lambda_(k0). The term (k_0, n) of (2) is lambda_(k0) e^(i n theta_(k0)) h. Let
E_n = sum over (k, m) != (k_0, n) of lambda_k abs(T^(n lambda_(k0) - m lambda_k)).
For k != k_0 let d_(n,k) be the distance from n lambda_(k0) to the lattice lambda_k Z. Splitting the sum over m
into the nearest lattice point and the others (which are at distance >= lambda_k (j - 1/2), j >= 1):
(4)  lambda_k sum over m of abs(T^(n lambda_(k0) - m lambda_k)) <= C_A h lambda_k (1 + h d_(n,k))^(-A)
     + C_A' h^(1-A) lambda_k^(1-A),
and the same bound without the first term holds for k = k_0, m != n. Call n "k-bad" if d_(n,k) < W_k. If n is
not k-bad then C_A h lambda_k (h W_k)^(-A) = h lambda_k^(-gamma)/(8 Z) <= h lambda_(k0) lambda_k^(-gamma)/(8 Z). So for
n not k-bad for any k != k_0:
(5)  E_n <= h lambda_(k0)/8 + h R <= h lambda_(k0)/4,   hence abs(I(n lambda_(k0), 0+)) >= (3/4) h lambda_(k0) >= 6 (B + 1).

Step 4 (counting bad n in [X, 2X]). Choose K_1 > k_0 with lambda_(k0) sum over k > K_1 of 1/lambda_k <= 1/8
(possible: gamma < 1 and lambda_k >= 1).
(a) K_0 < k <= K_1, k != k_0: n is k-bad iff the distance of n lambda_(k0)/lambda_k to the nearest integer is
below W_k/lambda_k (< 1/8 by (0)). The ratio lambda_(k0)/lambda_k is irrational, so by Weyl's theorem
(CLASSICAL) the number of such n in [X, 2X] is X (2 W_k/lambda_k + o(1)) as X -> infinity. These are finitely
many k.
(b) k > K_1. A k-bad n lies within W_k of a point m lambda_k, m >= 1. Since W_k <= lambda_k/8, such a point
exists below 2 X lambda_(k0) + W_k only if lambda_k <= 3 X lambda_(k0) =: Y; the number of lattice points in
range is at most (X lambda_(k0) + 2 W_k)/lambda_k + 1, and each has at most 2 W_k/lambda_(k0) + 1 integers n
within W_k. The number of k-bad n is therefore at most
2 X W_k/lambda_k + X lambda_(k0)/lambda_k + 4 W_k^2/(lambda_k lambda_(k0)) + 2 W_k/lambda_k + 2 W_k/lambda_(k0) + 1.
Summed over K_1 < k, lambda_k <= Y: the first two terms give at most X sum 2 W_k/lambda_k + X/8; the last four
are at most C N(Y)(1 + Y^(1-gamma)) = o(Y) = o(X), because W_k <= C_2 lambda_k^(1-gamma)/h and N(Y) = o(Y^gamma).
(c) Total, using (0) for the union of (a) and the first term of (b): at most X (1/4 + 1/8 + o(1)) < X/2 for
large X. So for every large X more than X/2 integers n in [X, 2X] are not k-bad for any k, and (5) holds for
them.

Step 5. (5) along these n contradicts (1). QED

Remarks.
(i) Phases and windows are arbitrary; no pole point is singled out; the statement is local at every point of
the line. Condition (W) holds iff, roughly, N_S(x) <= (log x)^gamma: it covers log q_k = e^k, e^(k/2), k^3, k^2,
k^(1.5) and every k^beta, beta > 1.
(ii) Where the proof stops: step 4 (b) needs sum 1/lambda_k finite. If sum over S of 1/log q diverges
(N_S(x) of order log x or more, still inside regime (K) as long as N_S(x) = x^(o(1))), then every frequency
window of width 1/h contains spikes of total height comparable to or larger than the one tested, for all
large n, and no single spike is isolated. A second-moment version (mean square of (2) over omega in [V, 2V]
against the bound O(V) from (1)) would need the cross terms between the lattices with lambda_k of order V,
where equidistribution has no time to act. OPEN.
(iii) Same statement on another line: if abs(alpha_q) = q^beta on S with beta > 0, the proof gives the natural
boundary Re s = beta of the relative product. For beta = 0 (sparse sign flips or deletions, U absent) it
gives the natural boundary Re s = 0 of prod over S of (1 - e^(i theta_q) q^-s).
(iv) The base is irrelevant: zeta may be replaced by any function meromorphic near the line (DH, a Beurling
zeta). The theorem is about the relative product.
(v) Why CYC is not a counterexample: with lambda_k = 2^k lambda_0 the ratio lambda_(k0)/lambda_k is rational, the
multiples n lambda_(k0) coincide exactly with multiples of every lambda_k, k < k_0, step 4 (a) fails for every
n, and in (2) the spikes cancel: sum over k of lambda_k sum over n of (-1)^n T^(omega - n lambda_k)
= -lambda_0 sum over n of T^(omega - n lambda_0) (checked numerically to 6e-6 against terms of size 140,
`ref_check.log` item 1). Measured (section 4): for CYC no n is good.

## 4. First test and controls (MEASURED)

`radial.py`, `radial.log`, `radial.json`: y(delta, t) = log abs(m(1/2 + delta + it)) at delta = 10^-j.
log q_k: primes found by search (Miller-Rabin, 20 bases) while the target exponent is at most 150
(e^k: 17, 1619, 528491329, a 24-digit and a 65-digit prime; k^3: 2, 2999, 532048240609, a 28-digit and a
55-digit prime), the target value itself above (the nearest prime changes log q by less than 1e-26 there,
far below the resolution delta log q of every row). Phases: theta = 0 (alpha = +q^(1/2)) and a rotation
theta_k = 2 pi frac(k (sqrt 5 - 1)/2). Pole points: primes q_1..q_5, index n in {1, 2, 3, 5} (20 points);
5 generic t in (0, 100) from a fixed seed. Slope = (y(last) - y(middle))/log(delta_middle/delta_last).
All values non-zero and finite (no object is identically zero on the sample).

| Set, phases | delta range | factors | L(delta)/log(1/delta) at the last delta | slope at 20 pole points (min / median / max) | slope at 5 generic points | max of (Lemma P bound - y) |
|---|---|---|---|---|---|---|
| e^k, theta = 0 | 1e-1..1e-30 | 74 | 0.685 | 0.792 / 0.933 / 1.144 | -0.275 .. 0.045 | -0.409 |
| e^k, rotation | 1e-1..1e-30 | 74 | 0.685 | 0.742 / 1.008 / 1.238 | -0.093 .. 0.182 | -0.196 |
| k^3, theta = 0 | 1e-1..1e-11 | 25712 | 121.6 | -3.44 / 251.7 / 543.8 (2 negative) | -2.26 .. 4.02 | -0.319 |
| k^3, rotation | 1e-1..1e-11 | 25712 | 121.6 | -3.50 / 2.80 / 12.50 (4 negative) | -7.78 .. -3.05 | -0.491 |
| e^(k/2), rotation | 1e-1..1e-30 | 148 | 1.373 | 0.677 / 0.993 / 1.379 | -0.114 .. 0.481 | -1.252 |
| CYC (2^(k-1) log 3, theta = pi) | 1e-1..1e-30 | 107 | 0.9986 | 0.000 in all 20 rows (y between -1.04 and 1.14) | 0.000 | -1.317 |

Reading. e^k: the lemma's exponent 0.307 is a lower bound; the measured exponent is near 1, the single pole
term, with the fluctuation of the other factors (variance pi^2/12 per factor with delta log q < 1; about 69
such factors) visible as the spread. e^(k/2): Lemma P does not apply (kappa log 2 = 1.386 > 1) and the measured
slopes are still near 1 at all 20 points; Theorem W covers the set. k^3: at delta = 1e-11 about 4600 factors
have delta log q < 1, the fluctuation scale is 0.9 sqrt(4600) = 61 against log(1/delta) = 25; slopes at pole
points have both signs and y at generic points runs from -95 to +50. The pole term is not visible in radial
growth; this is the regime where the planner's lemma fails and the Fourier test of Theorem W is needed. The
very large slopes for k^3, theta = 0 at the pole points of q_3, q_4, q_5 are a feature of this set at these
depths: log q_k is within e^(-0.4 k^3) of the integer k^3, so for k a multiple of j the lattice of q_k contains
the lattice of q_j up to an offset far below delta, and the point is a near-common pole of many factors
(log q_3 = 27 + 1.35e-11; the offsets separate only for delta below about 1e-13 times the pole index). CYC: bounded at its pole points, as
the identity says.

Counting step of Theorem W (`isolation.py`, float64, window b = (4/3) cos^4(pi u/2), illustration only):
fraction of n <= 2000 with E_n < lambda_(k0) h/2.

| Frequencies | k_0 (lambda_(k0)), h | good fraction | median E_n/(lambda_(k0) h) |
|---|---|---|---|
| e^k | 5 (148), 1 | 0.896 | 0.206 |
| e^k | 7 (1097), 0.25 | 0.952 | 0.142 |
| e^(k/2) | 10 (148), 1 | 0.504 | 0.498 |
| e^(k/2), first 4 dropped | 14 (1097), 0.25 | 0.828 | 0.238 |
| k^3 + sqrt 2 sin(k^2) (non-integer model) | 6 (215), 1 | 0.797 | 0.183 |
| k^3 (integer model) | 7 (343), 1 | 0.732 | 0.124 |
| k^3, first 2 dropped | 11 (1331), 0.25 | 0.661 | 0.222 |
| k^2, first 3 dropped | 20 (400), 1 | 0.308 | 2.11 |
| k^(1.5), first 8 dropped | 60 (465), 1 | 0.005 | 32.4 |
| CYC 2^(k-1) log 3 | 6 (35.2), 1 | 0.000 | 2.48 |
| CYC | 9 (281), 0.25 | 0.000 | 2.47 |

The good fraction is positive in the classes of Theorem W at these sizes except k^(1.5), where the constants
of the proof (K_0, k_0) are beyond the size run; the theorem is asymptotic there and the table is not evidence
for it. CYC has no good n, in agreement with remark (v).

Comparison with the sibling lane: its pre-run items P0 (single point s = 1/2 for alpha = +q^(1/2)) and P1
(ratio > 2) agree with Lemma P; its expectation P2 (mixed signs at pole points of k^3) agrees with the k^3
rows above. Its result file did not exist when this was written; its sets S1 (e^(k/2)), S2 (k^3), S3 (k^2),
S4 (k^(1.5)) are all inside Theorem W, so its threshold outcome "twin candidate subclass" cannot occur for
them if Theorem W holds. Its MINUS row (alpha = -q^(1/2) at t = 0) is the neighbour of CYC.

## 5. Controls

The statement tested: "G has Re s = 1/2 as a natural boundary" under the hypotheses of Theorem W.

| Control | In the hypothesis class? | Conclusion for it | Step of the proof at which it leaves |
|---|---|---|---|
| Theorem C product of c20 (the object itself) | yes | natural boundary; Theorem C (b), (c) are vacuous in class (W): there is no meromorphic twin to speak of | none |
| CYC (frequencies 2^k lambda_0, alpha = -q^(1/2); Beurling-type, new) | all hypotheses except multiplicative independence of the norms | false: 1/N_1 = 1 - w is entire | step 4 (a), Weyl: lambda_(k0)/lambda_k rational; the spikes cancel exactly |
| HQ1 (one prime, non-geometric factor with zeros and poles on the line) | no: S finite | false: meromorphic | step 3: no k_0 beyond K_0; (1) and (2) agree by Poisson summation on one lattice |
| DEL (alpha = 0 on a set of exponent b in (1/2, 1)) | no: abs(alpha_q) != q^(1/2); S not sparse (sum 1/log q infinite) | false at 1/2: continuation zeta(s)(s - b)W(s) (map row) | hypothesis on abs(alpha); its lattices are on Re s = 0 and its singular behaviour at Re s = b comes from the density of S, not from lattices |
| THIN (alpha = -1 on such a set) | no: same | false at 1/2 | same |
| sparse DEL / THIN (S in class (W)) | no: beta = 0 | product absolutely convergent and non-zero on Re s > 0, so analytic across 1/2; natural boundary at Re s = 0 by remark (iii) | hypothesis on abs(alpha) |
| DH, backward heat, zeta(s+a)zeta(s-a), T-NR, theta^w | not Euler products of this shape | not applicable; as bases they change nothing (remark (iv)) | none: the theorem is base-blind |

Not identically zero: every product above is zero-free in its half-plane of convergence; measured values in
section 4 are finite and non-zero.

R3 is not met: one control (CYC) fails at a named structural step, the others are outside the hypothesis
class rather than failing a step, and the theorem holds over any base.

## 6. Requirement flags

- R1 false. Unique factorisation enters once (irrationality of log q_j/log q_k, step 4 (a)), and CYC shows
  the theorem is false without it. This is multiplicative independence of the norms of a sparse set, not
  multiplicativity of zeta's coefficients over all primes; Beurling systems with independent norms pass
  unchanged. Not counted as R1.
- R2 false. The conclusion is local at every point of the line (every window), but it is a statement about
  non-continuation of G, not a height-uniform statement about zeta.
- R3 false (section 5).
- R4 false. The lane addresses R4 in the relative form of the lead BR and answers it negatively in class (W):
  the relative product does not reach the line, so there is no object on the line to compare with zeta.

## 7. What the result changes for the lead BR

- Regime (K), family abs(alpha_p) = p^(1/2) on S: no twin when sum over S of (log q)^(-gamma) is finite for
  some gamma < 1. The existence question of c20 (regime 2) is closed there as a natural-boundary row.
- Open remainder of BR-2: sets with N_S(x) at least of order log x (up to x^(o(1))). Exact missing lemma: for
  such S, a lower bound for int over [V, 2V] of abs(sum over k, n of lambda_k e^(i n theta_k) T^(omega - n lambda_k))^2
  d omega that is not O(V); equivalently, that the compensated sum of the Dirac combs of the lattices is not,
  on any window, a finite sum of atoms plus a smooth function.
- The telescoping control CYC should be entered in the control list as a Beurling-type member: dense local
  pole lattices on a line do not by themselves obstruct continuation; multiplicative independence does.
- Nothing here bears on BR-3 (regime 3) or on zeros of zeta.

## 8. Three weakest steps

1. Step 4 of Theorem W (the counting of bad n): the bookkeeping of the three ranges of k, the use of Weyl's
   theorem for finitely many k with the crude count for the rest, and the order of the choices
   (h, A, K_0, B, k_0, K_1, X). A referee should recheck that B is fixed before k_0 and that every o(X) is for
   fixed k_0. No independent referee has read it.
2. Step 1: the decomposition of H near the line assumes only that N_1 is meromorphic in D; the limit of the
   pole kernel and the bound (1) were derived by hand and checked numerically at one window. If one wants the
   statement for continuation in a weaker sense (for example continuous boundary values on an arc), the
   argument does not apply as written.
3. Scope. The theorem is proved for abs(alpha_q) = q^(1/2) exactly and alpha_p = 1 elsewhere. Regime (K) of the
   c20 lane is wider (any alpha_p with sum abs(1 - alpha_p) p^-sigma finite for sigma > 1/2 and infinite at 1/2,
   including sets with sum over S of 1/log q infinite and parameters of modulus below p^(1/2)); for those the
   existence of a twin remains OPEN. The numerics are sanity checks on finite ranges; none of them is a proof
   input, and the k^(1.5) row of the isolation table does not show the mechanism at the size run.

## 9. Files

`RESULT.md`, `REFEREE.md`, `lanes.jsonl`, `MAP_ROW.md`; `radial.py`, `radial.log`, `radial.json`; `ref_cells.py`, `ref_cells.log`;
`isolation.py`, `isolation.log`, `isolation.json`; `ref_check.py`, `ref_check.log`.
