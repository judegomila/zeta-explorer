# e1-nb-gram-period-transfer: Vasyunin Gram x Bettin-Conrey period function x Mayer transfer operator

Date: 2026-11-17. Nothing here proves or refutes RH. No zero-free region and no Lambda bound changes.
Labels: PROVED (argument written here, same-agent check only), CLASSICAL (cited, not re-derived), MEASURED
(float64, not interval-certified), OPEN. All runs local, single process, through `scripts/memcap.sh 8`, each
under 2 minutes. No ssh. Literature not searched: novelty of Theorem 1 is unchecked.

## Verdict

**Partial result plus a precise obstruction. The combination is killed as a route at the first decisive test.**

1. PROVED (Theorem 1): `1/(64 * 2^(Omega_N) * N^2) <= lam_min(G_N) <= (3 + log N)/(N-1)^2`, with
   `Omega_N = max_{d<=N} omega(d)`, so `lam_min(G_N) = N^(-2+o(1))`. This closes the open lemma
   `vasyunin-lammin-uniform-lower-bound` (an N-uniform bound `lam_min >= A_eps N^(-2-eps)` exists, with p = 2 sharp
   up to `N^(o(1))`). The measured exponent 1.918 is `N^-2` times a slowly growing factor between
   `2^(-Omega_N)` and `log N`. The proof is elementary (no period function, no transfer operator). The lower bound
   uses Moebius inversion of `f = 1 * a`.
2. MEASURED (decisive test, N <= 2000): lam_min follows the same law for zeta, L(s,chi) (chi mod 3, 4, two mod 5)
   and Davenport-Heilbronn: fitted exponents -1.913, -1.931, -1.929, -1.934, -1.933, **-1.928 (DH)**.
   `d_N^2 log N` is roughly constant for all six, DH included (0.14 to 0.18). The DH floor forced by its first
   off-line zero is `d^2 >= 8.4e-5`, reached only near `log N ~ 2000`. lam_min and d_N at N <= 2000 do not separate
   DH from an L-function.
3. PROVED (Lemma 2, 3): the Gram entry is a function on Farey edges: the non-elementary part of `G(h,k)` is
   `(pi/2hk) [c_0(x) - c_0(x')]` for the Farey pair `x = hbar/k`, `x' = x - 1/(hk)`. The recursion along the
   Euclidean algorithm is the Bettin-Conrey reciprocity unrolled; on rationals the three-term relation of the
   period function is an algebraic identity (oddness plus periodicity of c_0) and carries no information about
   zeros. No expression of G_N as a compression of a function of the Mayer operator was found (reasons in 3.3;
   non-existence not proved).
4. lam_min is a mean-value quantity: a lower bound on it controls the size of the optimal coefficients
   (`||a_opt||_2 <= 8 * 2^(Omega_N/2) * N`) and nothing about `d_N -> 0`. The stop is row P14 (rate = zero-free
   width) and row P15 (mean-value statements only), as expected.

## 0. Plan and relation to the map

Assigned: write G_N through the period function psi, prove the recursion along the Euclidean algorithm, look for
a transfer-operator form, then test lam_min and d_N on zeta, L(s,chi) and DH and decide the open lemma.
Nearest rows: P14 (`nyman-baez-duarte`: decay exponent of d_N equals zero-free width), P15
(`b-route-m-first-moment`: first moment, lam_max <= 18, "nothing about lam_min"), N1 (`n1-mayer-dirac`).
New relative to those rows: the two-sided lam_min bound; Gram matrices for L(s,chi) and DH with exact entries; the
Farey-edge form.

## 1. Setup (CLASSICAL)

`rho_h(u) = {u/h}`, `G(h,k) = int_0^inf {u/h}{u/k} du/u^2` (this is `gcd * I(h/g,k/g)/(hk)` of node
`vasyunin-gram`; `G(1,1) = log 2pi - gamma`). `G(h,k) = G(h/g, k/g)/g`. For `a in C^N`, `Q(a) = a* G a`,
`A(1) = sum a_n/n`, `f = 1 * a` (Dirichlet convolution, defined for all m >= 1). Since
`sum_n a_n floor(u/n) = sum_{m<=u} f(m)`:

    Phi(u) := sum_n a_n {u/n} = u A(1) - sum_{m<=u} f(m),     Q(a) = int_0^inf |Phi(u)|^2 du/u^2.        (1)

`d_N^2 = inf_a int_0^inf |1_{u>=1} - Phi(u)|^2 du/u^2 = 1 - b^T G^-1 b`, `b_h = (log h + 1 - gamma)/h`.

For a zero-mean q-periodic coefficient sequence c (L(s,chi), DH): `S(t) = sum_{n<=t} c(n)`,
`G_c(h,k) = int S(u/h) conj S(u/k) du/u^2`, `Phi(u) = sum_{m<=u} (c*a)(m)`, `b_h = L(1)/h`,
`d_N^2 = 1 - |L(1)|^2 e^T G^-1 e`, `e_h = 1/h`. Entries are computed exactly up to float64 by the jump-sum formula
(PROVED, section 4; checked against brute-force integration to 2e-6, the brute-force truncation error).

## 2. Theorem 1 (PROVED): lam_min(G_N) = N^(-2+o(1))

**Lower bound.** On `(m-1, m+1)` the function Phi of (1) is an affine function minus `f(m) 1_{u>=m}`. The squared
L^2(-1,1) distance from `1_{v>=0}` to affine functions is 1/8 (residual of `sgn(v)/2` after removing its
projection `3v/4`: `1/2 - 3/8`). Hence `int_{m-1}^{m+1} |Phi|^2 du/u^2 >= |f(m)|^2 / (8 (m+1)^2)`. The intervals
cover each point at most twice, so

    Q(a) >= (1/16) sum_{m>=1} |f(m)|^2/(m+1)^2.                                                       (2)

For n <= N, `a_n = sum_{d|n} mu(n/d) f(d)`. Cauchy-Schwarz: `|a_n|^2 <= 2^omega(n) sum_{d|n, n/d squarefree} |f(d)|^2`.
Summing over n = dk <= N with `2^omega(dk) <= 2^omega(d) 2^omega(k)` and `sum_{k<=x} 2^omega(k) <= sum_{k<=x} d(k) <= x(1+log x)`:

    ||a||^2 <= sum_{d<=N} |f(d)|^2 2^omega(d) (N/d)(1 + log(N/d)).                                    (3)

(2) and (3): `||a||^2 <= 16 W_N Q(a)`, `W_N = max_{d<=N} 2^omega(d) ((d+1)^2/d) N (1 + log(N/d))`. With
`(d+1)^2/d <= 4d` and `x(1+log(1/x)) <= 1` on (0,1]: `W_N <= 4 N^2 2^(Omega_N)`. So
`lam_min(G_N) >= 1/(16 W_N) >= 1/(64 * 2^(Omega_N) * N^2)`; `2^(Omega_N) = N^(O(1/log log N))`.

**Upper bound.** `a = delta_N - ((N-1)/N) delta_{N-1}`. With `i = floor(u/N)`, `j = floor(u/(N-1))`:
`Phi(u) = (j - i) - j/N`. For `u < N(N-1)`: `j - i = 1` exactly on `[(i+1)(N-1), (i+1)N)` (length i+1, |Phi| <= 1),
otherwise `j = i` and `Phi = -i/N`. Windows contribute at most `sum_{i<=N-2} 1/((i+1)(N-1)^2) <= (1+log N)/(N-1)^2`;
the rest of `u < N(N-1)` at most `sum_{i<N} (i/N)^2/(N i (i+1)) <= 1/N^2`; `u >= N(N-1)` at most `1/(N(N-1))`.
`||a||^2 >= 1`. So `lam_min(G_N) <= (3 + log N)/(N-1)^2`. QED.

MEASURED checks (`verify.log`): at N = 2000, `lam_min = 3.8156e-7`, `1/(16 W_N) = 9.76e-10` (ratio 391); (2) and
(3) hold on the bottom eigenvector, a random vector and a Liouville-type vector; the test vector has
`Q N^2/(||a||^2 log N) = 0.477, 0.478, 0.481, 0.483` at N = 50, 200, 800, 2000.

OPEN: the exact power of log N. Measured `lam_min N^2` rises 0.96 -> 1.53 and `lam_min N^2/log N` falls
0.30 -> 0.20 over N = 25..2000.

**Extension.** For c completely multiplicative with |c| <= 1 (L(s,chi)) the same proof gives the same two bounds
up to constants (inverse `mu c`; upper bound from `delta_N - delta_{N-1}`). For general c with c(1) = 1 the lower
bound needs the Dirichlet inverse of c, and the method gives a weaker exponent when the inverse grows. For DH
the inverse grows (MEASURED: max |c^-1(n)| = 1.2, 4.3, 11.6, 52, 267 for n <= 10, 1e2, 1e3, 1e4, 1e5; CLASSICAL
reason: DH has zeros in Re s > 1), so the proof of the lower bound does not transfer to DH. The upper bound
transfers.

## 3. Period function, Euclidean recursion, transfer operator

**3.1 Lemma 2 (PROVED from CLASSICAL Vasyunin/BBLS; checked to 1.5e-13 at 9 pairs up to (1999,2000)).**
For coprime h,k let `h hbar = 1 (mod k)`, `k kbar = 1 (mod h)`, `c_0(h/k) = -sum_{m<k} (m/k) cot(pi m h/k)`,
`L = log 2pi - gamma`. BBLS: `V(h,k) = -c_0(hbar/k)`. Since `hbar/k + kbar/h = 1/(hk) (mod 1)` and c_0 is odd and
1-periodic:

    G(h,k) = (L/2)(1/h + 1/k) + ((k-h)/(2hk)) log(h/k) + (pi/(2hk)) [ c_0(x) - c_0(x') ],
    x = hbar/k,  x' = x - 1/(hk)  (denominator h; x, x' are Farey neighbours).

So G restricted to coprime pairs is a function on edges of the Farey tessellation (bottom rows (h,k) of SL_2(Z)),
and the full matrix follows from `G(h,k) = G(h/g,k/g)/g`. Multiplicativity enters through the gcd only.

**3.2 Lemma 3 (PROVED; checked to 1.1e-13).** With `g(h/k) := c_0(h/k) + (k/h) c_0(k/h) - 1/(pi h)`
(Bettin-Conrey: `g = (i/2) psi_0`, psi_0 analytic on C minus the negative reals; CLASSICAL) and Euclidean
remainders `r_-1 = k, r_0 = h, r_{j+1} = r_{j-1} mod r_j`:

    c_0(r_0/r_-1) = sum_{j>=0} (-1)^j (r_-1/r_{j-1}) [ 1/(pi r_j) + g(r_j/r_{j-1}) ].

Applied to x and x' in Lemma 2 this is the exact recursion of the Gram entry along the Euclidean algorithm
(O(log) terms; the two continued fractions are those of hbar/k and kbar/h, i.e. the reversed expansions of h/k
and k/h). On rationals, `g(z) - g(z+1) - (z+1)^-1 g(z/(z+1)) = 0` follows from `c_0(1-x) = -c_0(x)` and
periodicity alone (two-line algebra; MEASURED residual 3e-8 from float cancellation at denominators ~1200). The
arithmetic content of Bettin-Conrey is the analytic continuation of g off the rationals, not the relation.
Note: `g(2/5) = -0.239480`; the graph-node value 0.080325 is `|c_0(2/5)|` (= `|g(2/5) + 1/(2pi)|`), a
different normalisation.

**3.3 Transfer operator.** CLASSICAL (Bettin-Conrey, not rechecked here): psi_0 is, up to an elementary term,
the inverse Mellin transform of `zeta(s) zeta(1-s)/sin(pi s)` on Re s = 1/2. CLASSICAL (Mellin-Plancherel):
`G(h,k) = (hk)^(-1/2) (1/2pi) int |zeta(1/2+it)|^2 (k/h)^(it) dt/(1/4+t^2)`. So psi_0 and the Gram kernel are two
Fourier transforms of the same positive density `|zeta(1/2+it)|^2`, with multipliers `1/cosh(pi t)` and
`1/(1/4+t^2)`. Positivity of G_N is positivity of that density; the Farey/Euclid recursion is a second way to
compute the same numbers. No expression of G_N as a compression of a function of the Mayer operator L_s was
found. Three reasons it is not expected: (i) the three-term relation here has weight 1, i.e. s = 1/2, where
L_s has its pole and psi_0 (log singularity at 0) is outside the space on which L_s is nuclear; (ii) the Gram
uses the single weight s = 1/2 for every N, while zeros enter the Mayer determinant through the weight
parameter (s = rho/2); in G_N they enter only through the limit N -> inf in the dilation variable; (iii) by
3.2 the relation is an identity on the index set. This is an obstruction statement, not a non-existence proof.

## 4. Decisive test (MEASURED; `gram.c`, `analyse.py`, `analyse_2000.log`)

Entries: zeta by Vasyunin's closed form; periodic zero-mean c by
`G_c(a,b) = T(a,b) + conj T(b,a)`, `T(a,b) = (C - mu log a)/a`, `w(r) = c(r) conj S~(ra/b)` (r mod M = qb),
`mu = mean of w`, `C = -(1/M) sum_r w(r)(log M + digamma(r/M))`, S~ = S averaged at jumps (Abel summation of the
jumps of the piecewise-constant integrand). DH coefficients mod 5: (1, kappa, -kappa, -1, 0),
`kappa = (sqrt(10-2 sqrt 5) - 2)/(sqrt 5 - 1)`.

| family | fit lam_min ~ A N^-p (N = 200..2000) | lam_min N^2 at 2000 | d_N^2 at 2000 | d_N^2 log N at 400, 1000, 2000 |
|---|---|---|---|---|
| zeta | 0.790 N^-1.913 | 1.526 | 6.114e-3 | 0.0462, 0.0453, 0.0465 |
| chi mod 3 | 0.829 N^-1.931 | 1.404 | 1.326e-2 | 0.0986, 0.0960, 0.1008 |
| chi mod 4 | 0.753 N^-1.929 | 1.287 | 1.668e-2 | 0.1280, 0.1343, 0.1268 |
| chi mod 5 (order 4) | 0.944 N^-1.934 | 1.568 | 2.223e-2 | 0.1628, 0.1644, 0.1690 |
| chi mod 5 (real) | 0.933 N^-1.933 | 1.554 | 1.794e-2 | 0.1472, 0.1361, 0.1364 |
| Davenport-Heilbronn | 0.711 N^-1.928 | 1.232 | 2.308e-2 | 0.1698, 0.1669, 0.1755 |

zeta: `d_N^2 log N` agrees with the CLASSICAL constant `2 + gamma - log 4pi = 0.04619`; the earlier fit
`0.8187 N^-1.918` is reproduced (0.790 N^-1.913 on a different N range). Fitting `lam_min/log N` gives exponents
-2.07 to -2.09 for all six. Bottom eigenvectors sit at n near N (zeta: 77% of mass on n > N/2; DH: 99.9%),
as in the test vector of Theorem 1.

DH: `d_N >= sqrt(2 beta - 1)/|rho|` for a zero with beta > 1/2 (reproducing kernel of H^2(Re s > 1/2);
CLASSICAL). For rho = 0.808517 + 85.699348i: `d^2 >= 8.4e-5`. Measured `d_N^2 = 2.3e-2` at N = 2000, decaying
like `0.17/log N`; the floor is reached near `log N ~ 2000`. A finite-N computation does not see it (same
conclusion as Prop. E of `nyman-baez-duarte`).

**Decision.** (a) The open lemma `lam_min(G_N) >= A N^-p` is settled by Theorem 1 with p = 2 + eps, not by the
recursion. (b) No upper bound on d_N was obtained that avoids 1/zeta: by (1), d_N small requires `1 * a` close to
`delta_1` in partial sums with `A(1)` close to 0, which is the statement about `a ~ mu` (row P14).
(c) lam_min has the same law for DH; it is determined by the weight `1/|s|^2` and the mean square of the
function on the line. A lower bound on lam_min gives `||a_opt||^2 <= Q(a_opt)/lam_min <= 64 * 2^(Omega_N) N^2` and
nothing else.

## 5. Controls and the three requirements

- All primes together: G_N uses gcd structure for all n <= N; Theorem 1 uses Moebius inversion. Met in form.
- Uniform in height: d_N -> 0 is one global statement. Met in form. Theorem 1 is uniform in N but is not a
  statement about zeros.
- Fails for controls for a structural reason: **not met.**
  - Davenport-Heilbronn: a Gram matrix exists (periodic coefficients, functional equation), is positive definite,
    has the same lam_min law (MEASURED) and a Farey/period structure (cotangent sums twisted mod 5; not worked
    out). The only step that fails for DH is Moebius inversion with bounded inverse in the lower bound of
    Theorem 1, and the conclusion of that step still holds numerically for DH. The quantity that differs
    (d_inf > 0) is invisible at finite N.
  - E_a = zeta(s+a) zeta(s-a): coefficients `n^-a sigma_2a(n)` are multiplicative with divisor-bounded inverse, the
    functional equation holds, the Gram matrix exists; an analogue of (1), (2) and Theorem 1 is expected (two polar
    terms instead of one; not written out). d_N stays
    bounded below because of the zeros at Re s = 1/2 + a. Not computed. Nothing in the Gram structure excludes
    E_a: row P14 again.
  - Sign twists (eps completely multiplicative, no functional equation): `Phi` and `Q` are defined in
    `L^2(u^(-1-2 sigma) du)` only where the Dirichlet series converges in mean square; without continuation to
    Re s = 1/2 there is no Gram matrix on the critical line. The step that fails is Mellin-Plancherel on
    Re s = 1/2, i.e. the criterion cannot be stated. Where it can be stated (sigma > 1) every inequality of
    Theorem 1 holds for the twist.
  - Backward heat, theta^w, T-NR, Beurling: no dilation-Gram of this form (no Dirichlet series over integers
    with gcd structure); not applicable rather than failing.
  - Phase-rotated transfer operator: the three-term relation with a phase has no solution of the form
    `c_0|(1 - S)` with c_0 odd and periodic (3.2 uses exactly those two properties), so there is no Farey-edge
    Gram attached to it. That is a structural difference, but it concerns only the recursion, which carries no
    zero information.

## 6. Verdict

Partial result: Theorem 1 (two-sided bound, `lam_min(G_N) = N^(-2+o(1))`) and Lemmas 2, 3 (Farey-edge form and
Euclidean recursion). Obstruction: lam_min and the period-function recursion are blind to the Euler product at
every finite N (DH has the same law); d_N -> 0 remains equivalent to RH with rate equal to zero-free width
(P14). No pivot taken: the adjacent idea (use (1) to bound d_N by a sieve-type choice of a) is the classical
Baez-Duarte form and returns to 1/zeta.

Suggested map rows: P14a "lam_min(G_N) = N^(-2+o(1)), PROVED, same law MEASURED for DH"; update node
`vasyunin-lammin-uniform-lower-bound` from open to proved (unrefereed); node `cotangent-reciprocity-period-function`:
three-term relation on rationals is algebraic.

## 7. Three weakest steps

1. Theorem 1 has same-agent checking only and its novelty is unchecked (Baez-Duarte, Balazard, de Roton,
   Bettin-Conrey-Farmer on the Gram matrix are the places to look). The constant-level steps are (2) (factor 1/16)
   and (3) (`sum_{k<=x} 2^omega(k) <= x(1+log x)`); the numerical margin at N = 2000 is a factor 391, which does not
   test sharpness.
2. Section 3.3 is an argument that no transfer-operator compression is expected, not a proof that none exists;
   the Mellin form of psi_0 is cited from Bettin-Conrey and was not recomputed; the DH and E_a period structures
   were not worked out.
3. Numerics are float64. Exponent fits over N = 200..2000 cannot distinguish `N^-2 (log N)^c` for c in [0,1]; the DH
   floor statement uses one off-line zero quoted to 6 digits; the E_a Gram was not computed.

## Files

`gram.c` (Gram tables; `./gram N mode out.bin`, modes 0..5), `validate.py` (entries vs brute-force integration),
`analyse.py` / `analyse_2000.log` (lam_min, d_N), `verify.py` / `verify.log` (Lemma 2, 3, Theorem 1 checks, DH
inverse growth), `gram_run.log`. The .bin tables (64 MB each) were deleted; regenerating all six takes 90 s.
