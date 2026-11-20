# c10-thin-deletion-zero-mode-control: thin prime deletion as a zero-mode control with Lambda >= 0

Date 2026-11-18. Slug `c10-thin-deletion-zero-mode-control`. Kind: combine. Record lane A of the checkpoint.
Scope: this directory only. Not refereed. Nothing committed or pushed. The compute server was not used.
No statement about zeros of zeta is made. No requirement flag changes (R1 = R2 = R3 = R4 = false).

Labels: PROVED (complete argument here) / PROVED-rel X (complete given the cited statement X) / CLASSICAL /
OPENED (source text read today) / RECALLED (cited from memory) / MEASURED / ARGUED / OPEN.

## Verdict

Partial result (a control, not an attack).

1. **The control exists (Lemma 1, PROVED-rel S(theta), a classical theorem on primes in short intervals).** For
   every b in (1/2, 1) there is a set S of primes such that F(s) = prod over p not in S of (1 - p^-s)^-1 has
   Lambda_F >= 0, is meromorphic on Re s > max(b - eta, b/2) with one simple pole (s = 1), and equals
   zeta(s)(s - b) W(s) there with W analytic and non-vanishing. It has a simple zero at s = b.
2. **Correction to the assignment.** The counting function must be L(x) = int_2^x t^(b-1) dt/log t, without the
   factor 1/2. The factor 1/2 belongs to THIN (a sign flip removes each prime twice). With deletion at half
   density the factor is (s - b)^(1/2): F tends to 0 at b from the right, has a branch point there and no
   continuation across b. Measured exponents at b: 1.00004 and 0.99998 (density one), 0.499994 and 0.499863
   (density one half), for b = 0.9 and 0.75.
3. **Decisive test (b = 0.75 and 0.9, S built to 1e7, ball arithmetic).** The finite data cannot enclose the zero.
   Exact reasons: (a) every finite truncation of the product is positive at b and has no zero in Re s > 0, and the
   data S below 1e7 are compatible with completions that have no zero or a zero elsewhere; (b) for the set S as
   defined by the rule at all primes, a rigorous tail bound left of b needs an explicit power-saving bound for
   primes in short intervals at all x > 1e7, and explicit bounds of that strength are on record only up to about
   1.4e25. What the data do enclose, relative to two explicit bounds for pi(x) - li(x): the one-sided value
   W(b) = lim G(s)/(s - b), s -> b+, in [1.53707, 1.60736] (b = 0.9) and [1.87837, 1.95768] (b = 0.75), hence
   F'(b+) = zeta(b) W(b) in [-15.158, -14.494] and [-6.737, -6.464]. The lower ends of the W intervals use only
   D <= 0 and are unconditional. The location of the zero is exact (s = b) by Lemma 1, not by the numerics.
4. **Statement O.** Lines 1 and 5 are rewritten with DEL in place of the Beurling source (`STATEMENT_O.md`;
   unchanged original in `STATEMENT_O.c9-copy.md`). Both lines stay ARGUED (the control has no referee yet).
5. **Devices.** All 34 devices of `engine/curated/devices.json` are read against DEL in `DEVICE_READ.md`:
   DEL passes 14 (in full or on the part that does not read FE) and does not pass 20. The read sets of the 20 are
   FE at all heights, periodicity with unimodular parameters at every rational prime, an attached object, and
   finite-order positivity with zeta's archimedean side. No closed device is reopened.
6. **Two small lemmas for the record.** Lemma I (PROVED): a degree-one Euler product over the rational primes
   with unimodular local parameter at every prime and Lambda >= 0 is zeta. So THIN (GEOM without POS) and DEL (POS
   without GEOM on S) together leave only an identification. Lemma C (PROVED): for a deletion product, a zero on
   Re s = b at height tau != 0 comes with a real zero at b of at least the same order; DEL does not give an
   isolated non-real zero with POS.

---

## 0. Plan

Read: BRIEF; `c9-obstruction-record-statement/REFEREE.md` section 5 (the proposal) and `STATEMENT_O.md` lines 1,
5, 7; map section 2 (rows TW+, TW-, B, THIN, notes on U, input level, three questions);
`c4-thin-twist-control-78/RESULT.md` section 1 and `thinlib.py` (greedy floor rule); `engine/curated/devices.json`
and `controls.json`.

New relative to the map: the map has no control on file with Lambda >= 0, size and support normalisation, an
ordinary Dirichlet series, and a zero in (1/2, 1). E_a has POS and lacks SIZE; B is quoted from the literature and
was not opened; THIN lacks POS.

Decisive first test: build S, evaluate near b with rigorous tails, report an enclosure or state that none is
possible. Done first (section 2). It does not kill the lane: the lemma holds, and the test fixes what finite data
can certify.

## 1. Construction and proofs

Fix b in (1/2, 1). Primes p_1 < p_2 < ... Put

  L(x) = int_2^x t^(b-1) dt/log t = Ei(b log x) - Ei(b log 2),
  c_0 = 0, c_n = min(c_{n-1} + 1, floor(L(p_n))), S = {p_n : c_n = c_{n-1} + 1}.

Then pi_S(p_n) = c_n = n + min(0, min_{k<=n} (floor(L(p_k)) - k)). Put D(x) = pi_S(x) - L(x),
G(s) = prod_{p in S} (1 - p^-s), F(s) = zeta(s) G(s) = prod_{p not in S} (1 - p^-s)^-1 for Re s > 1.
The Dirichlet coefficients of F are a(n) = 1 if n has no prime factor in S, 0 otherwise (completely
multiplicative), and Lambda_F(p^k) = log p for p not in S, 0 for p in S.

**Input S(theta) [CLASSICAL; secondary source OPENED, primary texts not opened].** There are theta in (0, 1), c > 0
and y_0 with pi(y + y^theta) - pi(y) >= c y^theta/log y for all y >= y_0. Hoheisel 1930 (theta = 32999/33000),
Huxley 1972 (theta = 7/12, in the asymptotic form pi(x + x^theta) - pi(x) ~ x^theta/log x), Baker-Harman-Pintz 2001
(theta = 0.525); read today in the article "Prime gap" of Wikipedia, which states these three results. The lower
bound with the constant c for Baker-Harman-Pintz is RECALLED. Only the existence of one theta < 1 is used.

**Range form H(theta') [PROVED from S(theta)].** For every theta' in (theta, 1) there are c' > 0 and x_0 with
pi(x + h) - pi(x) >= c' h/log x for x >= x_0 and x^theta' <= h <= x. Proof: tile [x, x + h] from the left by
intervals [y, y + y^theta]; each has length at most (2x)^theta, so the tiles cover at least h - (2x)^theta >= h/2
when x is large, and each tile [y, y + y^theta] holds at least c y^theta/log y >= c y^theta/log(2x) primes. Then
c' = c/2 after absorbing log(2x)/log x. Put eta = 1 - theta'.

**Lemma 0 (discrepancy) [PROVED-rel S(theta); the upper bound PROVED outright].** -C x^(b-eta) <= D(x) <= 0 for
x >= 2.

Proof. Upper bound: c_n <= floor(L(p_n)) <= L(p_n) and L increases between primes. Lower bound: write
B(x, y) = (L(y) - L(x)) - (pi(y) - pi(x)). If the minimum in the formula for c_n is attained at k then, for
pi(y) = n, D(y) >= -1 - B(p_k, y) (the case "minimum 0" occurs for finitely many n, because L(x) < pi(x)
eventually). For 2 < x < y, L(y) - L(x) <= (y - x) x^(b-1)/log x. If y - x >= x^theta' and x >= x_1, where
x_1 >= x_0 and x_1^(b-1) <= c', then pi(y) - pi(x) >= c' (y - x)/log x >= L(y) - L(x) and B <= 0. If
y - x < x^theta' then B <= L(y) - L(x) <= x^(theta'+b-1). If p_k < x_1, split at x_1; the part below x_1 is O(1).

**Lemma 1 [PROVED-rel S(theta)].** Let sigma_1 = max(b - eta, b/2).

(i) P_S(s) = sum_{p in S} p^-s converges absolutely for Re s > b, and there
    P_S(s) = E_1((s - b) log 2) + A(s), A(s) = s int_2^inf D(x) x^(-s-1) dx, A analytic on Re s > b - eta.
(ii) G(s) = (s - b) W(s) for Re s > b, with
    W(s) = log 2 * e^gamma * exp(-Ein((s - b) log 2) - A(s) + T(s)),
    Ein(w) = int_0^w (1 - e^-t) dt/t (entire), T(s) = sum_{p in S} [log(1 - p^-s) + p^-s] (terms O(p^(-2 Re s)),
    analytic on Re s > b/2). W is analytic and has no zero on Re s > sigma_1.
(iii) F = zeta (s - b) W is meromorphic on Re s > sigma_1. Its only pole is simple, at s = 1, with residue
    G(1) = prod_{p in S} (1 - 1/p) > 0. Its zeros there are the zeros of zeta and a simple zero at s = b
    (zeta(b) < 0 on (0, 1); checked in balls on [1/2, 0.999]). For Re s > b, G is an absolutely convergent product
    without zeros, so right of b the zeros of F are exactly those of zeta.
(iv) Lambda_F >= 0, abs(Lambda_F(n)) <= log n, support on prime powers, coefficients a(n) in {0, 1}.
(v) sum_{n<=x} a(n) = G(1) x + O(x^(b+eps)).
(vi) sum_{n<=x} mu(n) a(n) is not O(x^(b-delta)) for any delta > 0.

Proof. (i) D(2) = 0 since L(2) = 0 and 2 is not in S. By Stieltjes integration
P_S(s) = int_2^inf x^-s dL + int_2^inf x^-s dD. The first integral is int_{log 2}^inf e^(-(s-b)u) du/u =
E_1((s - b) log 2). The second equals s int_2^inf D x^(-s-1) dx, absolutely convergent for Re s > b - eta by
Lemma 0. (ii) log G = -sum_{k>=1} P_S(ks)/k = -P_S(s) + T(s) and E_1(w) = -gamma - log w + Ein(w), so
exp(-E_1((s - b) log 2)) = (s - b) log 2 * e^gamma * exp(-Ein((s - b) log 2)); the right side is single valued.
(iii), (iv) follow. (v) a = 1 * g with g(d) = mu(d) on integers composed of primes of S and 0 otherwise;
sum abs(g(d)) d^-sigma = prod_{p in S} (1 + p^-sigma) is finite for sigma > b, hence
sum_{d<=x} abs(g(d)) = O(x^(b+eps)) and sum_{d>x} abs(g(d))/d = O(x^(b-1+eps)). (vi) 1/F = sum mu(n) a(n) n^-s has
a pole at b. QED

What is used about primes in short intervals, exactly: the range form H(theta') for one theta' < 1, i.e. a lower
bound of the right order for the NUMBER of primes in every interval [x, x + h], x^theta' <= h <= x, for large x.
A bound on prime gaps alone is not enough when b > 1 - theta' (a run of intervals each containing one prime has
too few primes to follow L).

**Lemma N (no periodicity) [PROVED].** The coefficient sequence a is not periodic to any modulus q (so a is not a
Dirichlet character and no twist of a by a character is periodic). Proof: S is infinite, so it contains a prime p
not dividing q. If a had period q then a(p + kq) = a(p) = 0 for all k >= 0, so every prime in the class p mod q
would lie in S. That class holds a proportion 1/phi(q) of the primes (Dirichlet), while S has relative density
zero among the primes (pi_S(x) <= L(x) = O(x^b/log x)). QED

**Lemma I (identification) [PROVED].** Let F = prod_p (1 - a(p) p^-s)^-1 with abs(a(p)) = 1 for every rational
prime p and Lambda_F >= 0. Then F = zeta. Proof: Lambda_F(p) = a(p) log p >= 0 and abs(a(p)) = 1 give a(p) = 1.
Consequence for the record: among degree-one Euler products over the rational primes without FE, a read set
containing POS and not GEOM is met by DEL, one containing GEOM and not POS by THIN, and one containing both by
zeta only (mode (I), no inequality).

**Lemma C (real zero dominates) [PROVED].** Let S be any set of primes, b the abscissa of P_S, G as above. If G
extends continuously to b + i tau with abs(G(sigma + i tau)) <= C (sigma - b)^m as sigma -> b+, then
G(sigma) <= C (sigma - b)^m. Proof: -log G(s) = sum c_n n^-s with c_n >= 0, so
-log abs(G(sigma + i tau)) = sum c_n n^-sigma cos(tau log n) <= -log G(sigma). So a deletion product with POS has
no zero at height tau on its boundary line without a real zero of at least the same order at b. Example with
orders (2, 1, 1) at b, b + i tau, b - i tau: density 2 t^(b-1) (1 + cos(tau log t))/log t with the same greedy
rule (ARGUED: same proof as Lemma 1; not built).

Remarks. A zero of integer order m at b: use m L (needs m x^(b-1) < c' eventually, true). Non-integer m gives a
branch point (item 2 of the verdict). The construction is the one proposed in section 5 of the c9 referee file,
with these changes: region Re s > max(b - eta, b/2) confirmed; the counting form of the short-interval input
stated; the Beurling reading separated from the reading over the integers (GEOM fails on S in the second).

## 2. Decisive test (local, `scripts/memcap.sh 8`, python-flint 0.9.0 arb/acb at 128 bits)

Files: `del_control.py`, logs `run_b*_m*.log`, outputs `del_b{0.9,0.75}_m{1,0.5}_X1e+07.json`. Largest allocation
10 MB (sieve). Four runs, about 40 s each. floor(L(p)) was decided in balls at 64 bits for every prime below 1e7
(no undecided case; p = 2 is exact, L(2) = 0).

### 2.1 The set

| b | density | primes below 1e7 | size of S | D at primes | inf of D over all x <= 1e7 | first elements |
|---|---|---|---|---|---|---|
| 0.9 | 1 | 664,579 | 148,727 | [-2.415, 0] | -3.415 | see `controls.json` |
| 0.75 | 1 | 664,579 | 16,210 | [-1.000, 0] | -1.943 | 5, 7, 11, 13, 19, 29, 37, 41, 53, 67 |
| 0.9 | 1/2 | 664,579 | 74,363 | [-1.000, 0] | -1.958 | |
| 0.75 | 1/2 | 664,579 | 8,105 | [-1.000, 0] | -1.364 | |

At density one and b = 0.9 the discrepancy leaves [-1, 0]: a prime gap of length g near x costs
g x^(b-1)/log x. SHA-256 digests of the two density-one sets are in `controls.json`.

### 2.2 The evaluation formula and its tails

For X = 1e7 and real s >= b (complex s for the display in 2.5):

  A(s) = A_X(s) + R_X(s),
  A_X(s) = sum_{p in S, p <= X} p^-s - [log(log X/log 2) - Ein((s - b) log X) + Ein((s - b) log 2)] - D(X) X^-s,
  R_X(s) = s int_X^inf D(x) x^(-s-1) dx,
  T(s) in [T_X(s) - tau_X, T_X(s)], tau_X = [-D(X) X^(-2s) + E_1((2s - b) log X)]/(2 (1 - X^-s)).

The bound tau_X uses only D <= 0 (PROVED): sum_{p in S, p > X} p^-u <= -D(X) X^-u + E_1((u - b) log X) for
u > b. Ein is summed as a power series with a geometric tail bound. A_X and T_X are sums over the 148,727 (or
16,210) primes of S in balls.

Tiers for R_X:

- **Tier 0 (PROVED).** D <= 0, so R_X(s) <= 0 for real s > b and G(s) >= (s - b) W_X(s), with W_X the formula
  with R_X dropped and T at its lower end.
- **Tier E (PROVED-rel two explicit bounds).** Inputs: (E1) abs(pi(x) - li(x)) <= sqrt(x) log x/(8 pi) for
  2657 < x <= Y = 1.4e25: Buthe, "Estimating pi(x) and related functions under partial RH assumptions"
  (arXiv:1410.7015v4, page 1 OPENED: the bound holds while 4.92 sqrt(x/log x) <= T, T a height to which the
  zeros have been verified; Y needs T >= 2.42e12, and the verification height 3e12 of Platt-Trudgian 2021 is
  RECALLED). (E2) abs(pi(x) - li(x)) <= 0.2795 x (log x)^(-3/4) exp(-sqrt(log x/6.455)) for x >= 229: Trudgian,
  "Updating the error term in the prime number theorem" (arXiv:1401.2689v2, Theorem 2, OPENED). (E1) uses a
  numerical verification as input; this lane makes no statement about zeros of zeta.
  Derivation (this lane, one pass). With e(y) the bound and N = pi(X): for y > X,
  D(y) >= min(D(X), -1) - sup_{X <= x <= y} B(x, y)^+. From B <= x^(b-1) M and B <= x^(b-1) M - M + 2 e(y),
  M = li(y) - li(x), the convex combination with weights 1 - x^(b-1) and x^(b-1) gives B <= 2 e(y) x^(b-1); for
  x >= y/2 this is at most 2^(2-b) e(y) y^(b-1); for X <= x < y/2, B <= 2 e(y) - (1 - X^(b-1)) y/(2 log y) < 0
  (conditions checked: 0.0632 <= 5.03 and 0.1543 <= 0.800 at b = 0.9; 0.0632 <= 6.17 and 0.1543 <= 0.982 at
  b = 0.75; both left sides decrease in y). D(X) = -0.4229 and -0.4285 >= -1. Hence
  abs(D(y)) <= 1 + 2^(2-b) e(y) y^(b-1) for y >= X and, for real s >= b,
  0 >= R_X(s) >= -[X^-s + s 2^(2-b) (J_1 + J_2)], J_1 = [(log X + 2)/sqrt X - (log Y + 2)/sqrt Y]/(4 pi) =
  4.559e-4, J_2 = 0.2795 * 2 * 6.455^(1/4) * Gamma(1/2, sqrt(log Y/6.455)) = 0.022722.
  Bound on abs(R_X(b)): 0.04471 (b = 0.9), 0.04135 (b = 0.75). It is dominated by J_2, the range beyond 1.4e25.
- **Tier M (hypothesis, not proved, display only).** D(x) >= -4 for all x > 1e7. Then
  abs(R_X(s)) <= 4 abs(s) X^(-Re s)/Re s in any half-plane Re s > 0.

### 2.3 Results at s = b

| b | W_X(b), X = 1e5 | 1e6 | 1e7 | Tier 0: W(b) >= | Tier E: W(b) in | Tier E: F'(b+) = zeta(b) W(b) in | Tier M: W(b) in |
|---|---|---|---|---|---|---|---|
| 0.9 | 1.537035 | 1.537066 | 1.5370699 | 1.5370698 | [1.5370698, 1.6073594] | [-15.1576, -14.4947] | [1.5370667, 1.5370730] |
| 0.75 | 1.878207 | 1.878347 | 1.8783713 | 1.8783711 | [1.8783711, 1.9576710] | [-6.7370, -6.4640] | [1.8783288, 1.8784139] |

zeta(0.9) = -9.4301140, zeta(0.75) = -3.4412854. The Tier E interval has relative width 4.6% and 4.2%.
Under Tier E: G(s) <= (s - b) W_hi(s) -> 0 as s -> b+, with a non-zero finite one-sided derivative.

### 2.4 Why the finite data cannot enclose the zero

(a) G_X(b) = prod_{p in S, p <= 1e7} (1 - p^-b) = 0.053542 (b = 0.9) and 0.065432 (b = 0.75): positive. Every
finite truncation is a finite product of factors without zeros in Re s > 0. The zero belongs to the infinite set:
G_X(b) log X e^gamma -> W(b). A list of S below 1e7 does not determine whether the completed product has a zero.
(b) For S defined by the rule at all primes, an enclosure of F in a disc around b (or at one real point left of
b) needs a bound on R_X(s) for Re s < b, i.e. abs(D(x)) <= C x^(b-eta) with explicit C, eta for ALL x > 1e7. Up
to 1.4e25 the bound (E1) gives exponent b - 1/2 with explicit constant. Beyond it the explicit bound on record
(E2) saves less than any power, and int e(x) x^(b-2-s) dx diverges for every real s < b. An explicit form of a
Hoheisel-type theorem valid from 1.4e25 on would close this; none is on file here.
(c) From the right the test "sign change" is not available: F < 0 on (b, 1) and the continuation left of b is
the object in question.

So the answer to the test is: no enclosure of the zero from finite data; enclosure of the one-sided limit and
derivative at b (Tier E); a proved location (s = b exactly) from Lemma 1 relative to S(theta).

### 2.5 Checks of the formula

- Algebra (E_1 = -gamma - log + Ein, constants, signs): at s = b + 0.1 the direct product with tail
  (arb E_1) and the factored formula (Ein series) give the same interval: [0.145043, 0.152431] (b = 0.9; this
  is the residue G(1)) and [0.177468, 0.185982] (b = 0.75).
- Residue at 1 from D <= 0 only: G(1) in [0.14504, 0.15788] (b = 0.9), [0.39601, 0.39746] (b = 0.75);
  count of n <= 20000 with a(n) = 1, divided by 20000: 0.1443 and 0.3956.
- Tier M display on the circle abs(s - b) = 0.05 (16 points): abs(W) in [1.4955, 1.5726] and arg W in
  [-0.0257, 0.0257] (b = 0.9); abs(W) in [1.8312, 1.9104], arg W in [-0.0232, 0.0232] (b = 0.75); error of
  log W at most 5.2e-5. Under the hypothesis W has no zero on the disc and F has exactly the zero s = b there.
  This is a display under an unproved hypothesis, not a certificate.

## 3. Controls on the control (`controls.py`, `controls.json`)

| check | result |
|---|---|
| positivity kept | Lambda_F(n) = Lambda(n) for prime powers of primes outside S, 0 otherwise: minimum coefficient 0 (by construction). -F'/F at s = 3 from sum Lambda_F(n) n^-3, n <= 20000, against the Euler form over the same primes: 0.0995320 / 0.0995320 (b = 0.9), 0.1424190 / 0.1424190 (b = 0.75). a(n) in {0, 1}; a(mn) = a(m) a(n) for m, n <= 140 |
| no zero introduced for the undeleted product | S empty gives G = 1, F = zeta. zeta < 0 on [0.5, 0.999] in 4000 balls (largest upper end -1.46). The factor (s - b) arises only through the E_1 term of a set that follows L |
| finite stages | G_X(b) > 0 at X = 1e5, 1e6, 1e7; no zero at any finite stage |
| half density (the literal assignment) | exponent of G_X(b) against log X: 0.499994 (b = 0.9), 0.499863 (b = 0.75): square-root branch, not a zero |
| density one | exponent 1.000035 (b = 0.9), 0.999982 (b = 0.75) |
| relative density of S among primes at 1e7 | 0.2238 (b = 0.9), 0.0244 (b = 0.75); tends to 0 like x^(b-1)/b |

Comparison with THIN and U.

| | DEL_b | THIN_b | U |
|---|---|---|---|
| definition | delete the primes of S, density t^(b-1)/log t | flip the sign at S, density (1/2) t^(b-1)/log t | unimodular completely multiplicative twist |
| member of | TW+ (eps in {0, 1}); Beurling systems | TW-, U | U |
| POS | yes | no | no |
| GEOM at every rational prime | no (0 on S); yes at its own primes | yes | yes |
| INT, SIZE0, SUPP, EP, pole at 1 | yes | yes | yes (pole only for n^(-i alpha) translates) |
| coefficients | 0 or 1, completely multiplicative | +1 or -1, completely multiplicative | unimodular |
| continuation | Re s > max(b - eta, b/2) | Re s > max(b - eta, b/3) | not in general |
| zero | simple, real, at b; non-real only with a real one of at least the same order (Lemma C) | simple at b; at b + i tau after the twist n^(-i tau) | none known in general |
| FE, PER | no | no | no |
| proved relative to | S(theta) | the same statement | (stage level only) |

## 4. Statement O, lines 1 and 5

`STATEMENT_O.md` in this directory is the c9 file with lines 1 and 5 replaced and one revision paragraph in the
header; `STATEMENT_O.c9-copy.md` is the unchanged original.

- Line 1: DEL_b is named as the member of TW+ with a zero in (1/2, 1); mode (Z) for the read set {POS, SUPP,
  SIZE0, EP, INT, pole, continuation}, floor "nothing below 1", for real zeros; Lemma C and Lemma I state the two
  limits. B is removed from the line.
- Line 5: DEL_b replaces B. The title drops "or the integers" (DEL is over the integers). The debt "open the
  Beurling source" is replaced by a referee on Lemma 1 and the primary text of one short-interval theorem (shared
  with line 7). The line states what DEL does not reproduce: counting error below the zero, zeros at non-zero
  height off zeta's set.
- Not changed: lines 2 to 4, 6 to 12; section C rows 1b and 2a still cite B and should read "DEL (zero)" once
  the lemma has a referee; the corrections E1 to E7 of the c9 referee (other lane).
- Proposed map text (not applied): section 2 row "DEL | thin prime deletion: F = prod over p not in S, pi_S(x) =
  int_2^x t^(b-1) dt/log t + O(x^(b-eta)) | EP, POS, SIZE0, SUPP, INT, simple pole at 1, continuation to
  Re s > max(b - eta, b/2), simple real zero at any b in (1/2, 1); right of b its zeros are zeta's | FE; PER; GEOM
  on S; non-real zeros off zeta's set | kills prime positivity + size + support + pole + integers without FE.
  PROVED-rel S(theta); zero referees."

## 5. Devices

Full table: `DEVICE_READ.md` (34 rows, generated by `mk_device_read.py`, which asserts that every device id is
covered). Every cell is ARGUED from the recorded read set; no device lane was re-run.

- Passes (14): mean-value-convexity, positive-kernel-transport (transport part), dual-measure-compactness,
  recurrence-ergodicity, stage-limit, section-extraction (chain part), test-restriction-commutator (log F part),
  twisted-discrepancy (general form), frequency-only, tensor-squeeze, sum-product-vinogradov,
  quadratic-positivity-companions, laurent-shell-gamma-section (chain part), positive-term-sum-rule.
- Does not pass (20), by read set: FE at all heights; PER with unimodular parameters at every rational prime (the
  7/8 architecture and the Landau-Siegel mechanism); an attached object (group, surface, geometry, model, values
  at s <= 0); finite-order positivity with zeta's archimedean side (FAIL by Theorem R; DH passes it).
- For the planner: the candidate read sets are the two already known ({FE at all heights}, {PER in the conductor
  aspect with GEOM}); DEL adds no third. A device that reads POS and GEOM together without FE or PER reads an
  identification (Lemma I).
- Stage-limit: DEL is a written example for row Q19. Each stage of DEL is zeta's stage with z_p = 0 for p in S,
  so every stage property is inherited, and the limit has a zero at b.

## 6. Inputs the control lacks

1. The functional equation: none of any type. No gamma factor, no completed function; continuation is known only
   to Re s > max(b - eta, b/2).
2. Periodic twists: a is not periodic (Lemma N). For a Dirichlet character chi the twist is
   L(s, chi) prod_{p in S} (1 - chi(p) p^-s); its continuation past b needs S to be regular in residue classes
   with a power saving, which the rule above does not give. A per-class greedy rule, as in `c5-thin-walk-replay`
   Theorem 2 for THIN, would give it relative to a short-interval theorem in progressions. Not written here: OPEN.
3. GEOM at the primes of S (local parameter 0), in the reading over the integers.
4. Growth: no bound for W in vertical strips left of b; the counting error exponent is proved only as b + eps.
5. Values at s <= 0; a kernel; a geometric or spectral object.
6. Zeros at non-zero height other than zeta's (Lemma C limits what POS allows).

## 7. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 | false | no argument about zeta; a control and a table |
| R2 | false | no conclusion about zeros in windows |
| R3 | false | no device; a control is added to the list |
| R4 | false | no step toward the critical line |

No flag rises. aboutZeros = false.

## 8. Three weakest steps

1. **Lemma 1 rests on S(theta) read in a secondary source.** The primary texts (Hoheisel, Huxley,
   Baker-Harman-Pintz) were not opened; the tiling step from the single-length form to the range form and the
   requirement x^(b-1) <= c' are short but have had no second reader. The lemma has zero referees.
2. **Tier E.** The enclosure of W(b) and F'(b+) depends on the derivation abs(D(y)) <= 1 + 2^(2-b) e(y) y^(b-1)
   (one pass), on Buthe's theorem with a recalled verification height, and on Trudgian's Theorem 2. It encloses a
   one-sided limit only, with relative width about 4.5%; it does not enclose a zero of an analytic function.
   The Tier M display rests on an unproved hypothesis.
3. **The device table.** 34 cells argued from recorded read sets; no device lane was re-run against DEL; the 7/8
   cells were not replayed against the manuscript; "passes right of b" cells rely on F = zeta G with G bounded,
   and nothing is known about W left of b.

## Files

`RESULT.md`, `STATEMENT_O.md`, `STATEMENT_O.c9-copy.md`, `DEVICE_READ.md`, `mk_device_read.py`, `del_control.py`,
`controls.py`, `controls.json`, `del_b0.9_m1_X1e+07.json`, `del_b0.75_m1_X1e+07.json`,
`del_b0.9_m0.5_X1e+07.json`, `del_b0.75_m0.5_X1e+07.json`, `run_b*_m*.log`, `controls.log`, `lanes_line.json`.
