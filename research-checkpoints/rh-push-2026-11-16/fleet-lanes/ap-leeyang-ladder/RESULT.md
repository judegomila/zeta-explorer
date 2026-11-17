# ap-leeyang-ladder: Lee-Yang through the twin ladder and stable polynomials

Date: 2026-11-17. Lane: decide whether the completed zeta function is a limit of stable
polynomials or of real-rooted finite twin-ladder truncations, whether the rung operators preserve
stability, and whether some truncation scheme is real-rooted for zeta at every finite stage while
the Davenport-Heilbronn control fails at a finite stage.

Nothing here proves or refutes RH. No bound moves. Labels: PROVED (argument in this note),
CLASSICAL (standard theorem, cited from memory, not re-read), MEASURED (float64 or mpmath, not
interval arithmetic), ARGUED, OPEN.

## 0. Verdict

**Precise obstruction, with one proved finite-stage Lee-Yang theorem.**

1. A scheme of the requested kind exists at every finite stage. For a ladder truncation with
   rung set "divisors of M" (primes `p | M`, depth `N_p`, `M = prod p^(N_p)`), the completed
   truncation `Phi_M = gamma E_M + (gamma E_M)^#` has **all** its zeros with
   `|t| >= 2 pi M (1 + O(M^-2))` on the critical line (Theorem A, PROVED modulo a classical
   Stirling bound). The proof is the Lee-Yang mechanism in the form used for stable polynomials:
   the Bohr lift of `E_M` is a product of one-variable polynomials with no zeros in the polydisc,
   so its reflection quotient is a rational inner function of the polydisc.
2. The Davenport-Heilbronn truncations fail at a finite stage: with primes `{2,3,7}` and depth 1
   the Bohr lift (a sum of two products) has zeros in the polydisc up to `sigma = 0.653`, and the
   truncation has 190 off-line zeros in the strip for `2 < t < 5002` and 24 in
   `[100000, 100500]`; the zeta truncation with the same primes has none (MEASURED, section 4).
3. The scheme does not reach xi. The inner-function factorisation is
   `Theta_M(s) = chi(s) * M^(s-1/2) * I_M(s)`, `I_M` inner. The factor `M^(s-1/2)` has modulus
   greater than 1 to the right of the line, and it is exactly the degree of the polynomial. The
   Lee-Yang regime is `M <= t/2pi`; a product ladder whose support contains every
   `n <= sqrt(t/2pi)` has `M >= lcm(1..sqrt(t/2pi)) = exp((1+o(1)) sqrt(t/2pi))`. The two
   conditions are compatible only for `t < 157` (Proposition E). At fixed height the zeros of
   `Phi_M` do not converge as `M` grows (PROVED from the prime number theorem), and inside the
   Lee-Yang regime they track zeta zeros no better than the gamma factor alone as height grows
   (MEASURED).
4. The control `E_a(s) = zeta(s+a) zeta(s-a)`, `0 < a < 1/2`, satisfies the hypotheses of
   Theorem A at every finite stage (its ladder truncations are stable products; measured: 0
   off-line zeros of 769 at height 1e5) while its own zeros are off the line. Hence **no argument
   that passes from finite-stage stability plus the functional equation to the limit can be
   valid**; the limit step must use the size normalisation of the local parameters. This is the
   structural reason the route stops, and it is wall 5.4 of the obstruction map (the l^1/l^2 gap of
   the prime chain) reached by a different method.
5. Rung operators: inserting a rung ladder at `p` multiplies `Theta` by `p^(N(s-1/2)) b_p`, with
   `b_p` a Blaschke product of degree `N` in `w_p = p^(1/2-s)`. This factor has mean log-modulus
   exactly 0 on every torus `0 < x < 1/2` and is not constant, so it exceeds 1 somewhere on each
   such torus (Theorem B, PROVED). The rung operator preserves stability of the Bohr piece and is
   not a contraction of the completed quotient on any open region.
6. Heat flow in Bohr variables is an Ising pair coupling between prime spins,
   `K_pq = 2c log p log q`. For `c >= 0` (ferromagnetic) all zeros of the heat-deformed ladder
   polynomial lie on the single line `Re s = c log M`; for `c < 0` (antiferromagnetic, the
   backward-heat control) the Lee-Yang hypothesis fails and zeros lie inside the polycircle
   (Proposition C; CLASSICAL identification with Polya-de Bruijn, MEASURED check).
7. No other tested scheme separates zeta from DH at a finite stage (table in section 5).

## 1. Plan and relation to the obstruction map

New relative to the map: (i) the completed function written as a two-product polynomial in Bohr
variables and the test of stability in the Borcea-Branden sense; (ii) the inner-function
factorisation `Theta = chi M^(s-1/2) I_M` with an exact height threshold `2 pi M` that is
measured to be sharp; (iii) Theorem B on rung operators; (iv) the Ising reading of the heat
cocycle with the zero line `Re s = c log M`; (v) the winding lemma that removes every
Riesz-projection (sharp theta cut) split for all functions at once; (vi) the observation that
`E_a` passes every finite stage.

Closed rows touched, and what differs:

- **Q10, Q11, Q13, S4** (prime chain as sections; coverage `Q*(t) = (log(t/2pi))^2/16`). Same
  wall. Those rows use the infinite-depth chain and the Cayley transform of `F'/F`; here the
  object is the polynomial ladder truncation, the tool is the polydisc inner function, and the
  threshold is `M <= t/2pi` (whole plane) or the product formula (1) (strip). The
  infinite-depth chain is strictly worse in this formulation: its quotient has poles on
  `Re s = 1` and off-line zeros at every height (section 3.1, remark 3).
- **G6, Q9** (`D = F + alpha F'`, Levinson). The logarithmic Riesz weight
  `sum n^-s alpha log(Y_alpha/n)` is the Bohr piece of `D`; the smooth-AFE split of section 3.4
  tends to it. Not re-entered; used only as the limit of a family.
- **P17** (Jensen), **G7** (de Bruijn time of DH), **G17** (cosine dominance / torus height `y`),
  **G14** (Hecke on the ladder: `V_p` is multiplication by `z_p`), **F2, G19** (heat cocycle):
  cited as closed; section 5 records how each appears as a truncation scheme.

Sibling `ap-leeyang-structural` was not read.

## 2. Objects

### 2.1 Finite twin-ladder objects in the repository and PR 13

- `src/math/twin-ladder.js`: rung `r_{p,m}(T) = p^(-m(1/2+iT))`, `m = 0..M`; thermodynamic
  weight `w(p,m;beta,P) = exp(-beta m log p - P (m log p)^2)`; **additive** ladder sum
  `Z_TL(T;beta,P) = sum_{p in S} sum_{m=0}^{M} w(p,m) r_{p,m}(T)`. The file states that this is
  not the Euler product.
- PR 13 `PASSIVE_DELAY_REALIZATION_v2.md`: finite Euler ratio
  `V_Q(s) = prod_{p<=Q} (1-p^(-s-h))/(1-p^(-s))`; `W_Q = 1/V_Q` realised as a cascade of
  lossless two-ports with through response `H_p(z) = c (1 - q0 z)/(1 - q1 z)`,
  `q0 = p^-sigma`, `q1 = p^(-sigma-h)`, `z = p^(-i t)`, contractive after the scalar
  `C_opt(Q) = prod (1+q1)/(1+q0)`.
- PR 13 `POISSON_OU_AND_PRIME_BEAT_CORRESPONDENCE_v2.md`: covariance
  `K_T(lambda,mu) = (1/2) cos(T(lambda-mu)) [e^(-x|lambda-mu|) - e^(-x(lambda+mu))]`, variance
  `V = sum_j q_j |B_j|^2 >= 0` for every finite set of frequencies (primes enter only through
  tap positions).
- Refereed lane identities (`h-hecke-torus-symmetry`): `V_p = p^(-1/2) T_(-2 log p)`,
  `kappa = sum_n V_n g0`, Fricke `J V_p J = V_p*`.

### 2.2 Bohr dictionary used here

`gamma(s) = pi^(-s/2) Gamma(s/2)`, `x = sigma - 1/2`. Variables `z_p = p^-s`,
`w_p = p^(1/2) z_p = p^(1/2-s)`; the critical line is the torus `|w_p| = 1`, and
`Re s > 1/2` is the open polydisc `|w_p| < 1` restricted to the curve `w_p = p^(1/2-s)`. The rung
shift `V_p` acts on Mellin transforms as multiplication by `z_p`; `sqrt(p) V_p` is `w_p`.
`s -> 1-s` is `w_p -> 1/w_p` (Fricke).

Ladder truncation with depths `N_p` (`M = prod p^(N_p)`):

    E_M(s) = prod_{p|M} sum_{k=0}^{N_p} p^(-ks) = sum_{n | M} n^-s = U(w),
    U(w) = prod_p e_p(w_p),  e_p(w) = sum_{k<=N_p} p^(-k/2) w^k.

Completed truncation and its quotient:

    A(s) = gamma(s) E_M(s),  A^#(s) = conj A(1 - conj s) = A(1-s),
    Phi_M = A + A^#,  Theta_M = A^# / A.

Two-product polynomial: with `g = gamma(s)/gamma(1-s)` and `U*(w) = w^N U(1/w)` (reflection,
`w^N = prod w_p^(N_p)`), `Phi_M = gamma(1-s) w^-N [ g w^N U(w) + U*(w) ]`. The zero set is that of
`N(g; w) = g w^N U(w) + U*(w)`, a sum of two products of one-variable polynomials. The DH
analogue has `U = c1 U_chi + c2 U_chibar`, itself a sum of two products.

## 3. Results

### 3.1 Theorem A (finite-stage Lee-Yang for ladder truncations)

**Lemma 1 (CLASSICAL, Rudin).** If a polynomial `U` of multidegree `N` has no zeros on the
closed unit polydisc, then `U*/U` is analytic on a neighbourhood of the closed polydisc, has
modulus 1 on the torus, and `|U*(w)| <= |U(w)|` on the closed polydisc. (Maximum principle on
the distinguished boundary.)

**Theorem A.** Let `E(s) = sum_{n | M} a_n n^-s` have real coefficients and Bohr lift `U(w)`
with no zeros on the closed unit polydisc. Then

    Theta(s) = [gamma(1-s)/gamma(s)] * M^(s-1/2) * I(s),   I(s) = U*(w)/U(w),  |I(s)| <= 1 for sigma >= 1/2.

Consequently `Phi = gamma E + (gamma E)^#` has no zero at any `s` with `sigma != 1/2` and
`|gamma(1-s)/gamma(s)| M^x < 1` (`x = sigma - 1/2 > 0`; the case `x < 0` by symmetry). With the
bound (G) below, every zero with `|t| >= 2 pi M e^(0.042/t^2)` lies on the critical line.

Proof. `E(1-s) = sum a_n n^(-1/2) prod w_p^(-alpha_p(n)) = w^-N U*(w) = M^(s-1/2) U*(w)`, since
`w^-N = prod p^(N_p (s-1/2))`. Lemma 1 gives `|I| <= 1` on `|w_p| <= 1`. At a zero of `Phi`
with `A(s) != 0` one has `Theta(s) = -1`, so `|Theta(s)| = 1`; `A(s) != 0` for `sigma >= 1/2`
because `U != 0` there. PROVED.

(G) `log|gamma(1/2+x+it)/gamma(1/2-x+it)| >= x [log(t/2pi) - 0.042/t^2]` for `x > 0`, `t >= 7`
(the Stirling value of the constant is 1/24 = 0.04167).
CLASSICAL (Stirling for `Re psi`); MEASURED on a grid `1e-4 <= x <= 400`, `7 <= t <= 1e3`:
the minimum of the left side over `x`, divided by `x`, minus `log(t/2pi)`, times `t^2`, is
`-0.0417` to `-0.0420` (`chi_check.json`; above `t = 1e4` the float64 check is dominated by
cancellation and is not informative).

For zeta ladders `e_p` has its zeros at `|z_p| = 1`, that is `|w_p| = sqrt p > 1`, so the
hypothesis holds for every `M`. It is a statement about each prime separately (roots of the
local factor outside the disc) plus the product structure; the conclusion uses all primes of the
truncation together.

Remarks.

1. *Sharpness of `2 pi M`* (MEASURED, `euler_hb_thresholds.json`, boxes `|sigma - 1/2| < W`
   containing the far-right zeros): `M = 4`: off-line zeros up to the window `[22,26]`,
   `2 pi M = 25.13`; `M = 6`: `[34,38]`, `37.70`; `M = 30`: `[172,182]`, `188.50`; `M = 36`:
   `[212,222]`, `226.19`. No off-line zero in any later window.
2. *Strip version* (PROVED given Hadamard's three-circles theorem in several variables,
   CLASSICAL). `psi(x) = log sup_torus |E(1 - conj s)/E(s)|` is convex in `x` with `psi(0) = 0`,
   so `psi(x)/x` is nondecreasing with limit `log M`. Zeros with `0 < |x| <= 1/2` occur only for
   `t <= t_strip = 2 pi exp(2 psi(1/2))`. Numerically the supremum is attained at phase 0 for
   each prime, giving

       t_strip(M) = 2 pi prod_p [ (N_p + 1)(1 - 1/p) / (1 - p^(-N_p-1)) ]^2.        (1)

   (MEASURED identification of the maximising phase; values in section 4.)
3. *Infinite depth is worse.* For `N_p = infinity` the dual factor `1/(1 - p^(s-1))` has poles
   on `Re s = 1`; near each pole `Theta` takes the value `-1`, so the truncation with full Euler
   factors has off-line zeros near `Re s = 1` at every height (ARGUED: Rouche sketch, not written out; the first run,
   `euler_hb_run1_nonadaptive.log`, is consistent but its rows with phase step above 1 are not
   reliable counts).
4. *Zero count.* On the line `arg A = theta(t) + arg E_M`. `M^(it) I(1/2+it)` has mean winding
   0 (winding of `U*/U` in the `w_p` direction is `N_p`, cancelled by `M^(it)`), so the number of
   zeros of `Phi_M` up to `T` is `theta(T)/pi + O(1)`, independent of `M`. MEASURED: 4523 to 4525
   on-line zeros in `2 < t < 5002` for every zeta truncation, 770 in `[100000,100500]`.
5. *Prior work.* The mechanism (a zero-free piece plus its reflection has zeros on the line where
   the gamma ratio dominates) is that of Spira's approximate-functional-equation functions
   (`N <= 2`, which are the products `1` and `1 + 2^-s`) and Gonek's finite Euler product model
   (2012). Recalled, not re-read; no novelty is claimed for Theorem A.

### 3.2 Theorem B (rung operators)

Inserting a ladder of depth `N` at a new prime `p` maps `U -> U e_p(w_p)`, `M -> M p^N`, and

    Theta -> Theta * p^(N(s-1/2)) * b_p(w_p),   b_p = e_p*/e_p,

where `b_p` is a Blaschke product of degree `N` whose zeros have modulus `p^(-1/2)` (reciprocals
of the roots of `e_p`).

**Theorem B.** (a) The class of polydisc-stable Bohr pieces is closed under rung insertion.
(b) For every `0 < x < 1/2` the mean of `log|p^(Nx) b_p|` over the circle `|w_p| = p^-x` is
exactly 0, and the function is not constant there; hence `sup |p^(Nx) b_p| > 1` on every such
circle. (c) Therefore a rung operator is a contraction of `Theta` on no torus `0 < x < 1/2`; on
the critical torus it is unimodular (lossless).

Proof. (a) Products of stable polynomials are stable. (b) Jensen's formula: for a Blaschke
product with zeros `a_j`, the circle mean of `log|b|` on `|w| = r` is `sum_j log max(r, |a_j|)`;
here `|a_j| = p^(-1/2) < r = p^-x`, so the mean is `N log r = -N x log p`. (c) follows. PROVED.

Reading: the level-raising operator is a stability preserver for the Bohr piece and is "lossless
on average, not passive" for the completed quotient; the excess is carried by the monomial
`p^(N(s-1/2))`, the degree. In Lee-Yang terms each local factor is a ratio of an inner function
to a monomial; a ferromagnetic factor would be inner. A local factor `e_p` gives an inner
`e_p(1/w)/e_p(w)` only for `e_p = 1`, because the reflection of a nonconstant polynomial has a
pole at `w = 0` (`sigma -> +infinity`).

The app's additive ladder: `sum_{p in S} 1/(1 - z_p)` has real part above `|S|/2` on the whole
polydisc `|z_p| < 1`, so it has no zeros for `sigma > 0` (PROVED, one line). It is a sum of
Caratheodory functions and is unrelated to the zeros of zeta. The log-type sum
`1 + sum_p z_p/(1-z_p)` has zeros on the critical torus as soon as `S` contains `{2,3,5}`
(disc arithmetic: reach `2.839 >= 2.75`; with `{2,3}`: `2.280 < 2.5`, measured minimum modulus
`0.2198`). `bohr_checks.json`.

### 3.3 Proposition C (heat flow = Ising coupling between prime spins)

The heat flow multiplies the coefficient of `n^-s` by `exp(c log^2 n)` (`c = t/4` in the brief's
normalisation). On the squarefree ladder (`N_p = 1`, spins `a_p in {0,1}`):

    U_c(z) = sum_{a} exp(c (sum_p a_p log p)^2) prod z_p^(a_p)
           = sum_a prod_p (z_p e^(c log^2 p))^(a_p) * prod_{p<q} exp(K_pq a_p a_q),  K_pq = 2 c log p log q.

This is a lattice-gas partition function with pair coupling `K_pq`; `c > 0` is ferromagnetic,
`c < 0` antiferromagnetic.

**Proposition C.** For `c >= 0`, `U_c(z) != 0` when all `|z_p| p^(c log M) < 1` or all `> 1`.
Equivalently every zero of the Dirichlet polynomial
`E_c(s) = sum_{n | M} mu(n)^2 e^(c log^2 n) n^-s` lies on the single line `Re s = c log M`. The
same holds for every depth.

Proof. Lee-Yang circle theorem in lattice-gas form (CLASSICAL) with the field shift
`(1/2) sum_{q != p} K_pq = c log p (log M - log p)`. Independent route:
`E_c = e^(c d^2/ds^2) E_0`, `E_0 = M^(-s/2) prod 2 cosh((s/2) log p)` has its zeros on
`Re s = 0`, and `e^(c D^2)[e^(-as) g](s) = e^(-as + c a^2) (e^(c D^2) g)(s - 2ca)` with
`a = (log M)/2`; the Polya-de Bruijn universal-factor theorem (CLASSICAL) keeps the zeros of
`g` on the imaginary axis for `c >= 0`. Both are classical; the identification is the content.

MEASURED (`bohr_checks.json`, primes 2..11): `c = 0.05, 0.2`: the diagonal specialisation has
all five roots on the unit circle to 1e-15 and `min|U_c|` inside the polycircle is positive;
`c = -0.05, -0.2`: zeros at relative radius `0.5, 0.9, 0.999` inside the polycircle (residual
1e-13 to 1e-16), diagonal root moduli `0.227 .. 4.41` and `0.032 .. 31.7`.

Consequences. (i) The backward-heat control fails for a named structural reason: its coupling is
antiferromagnetic and the Lee-Yang hypothesis `K >= 0` is violated. (ii) Forward heat moves the
zero line of the Bohr piece to the right at speed `log M` per unit `c`; for the completed
function the archimedean factor shifts as well (row F2) and that combined statement is not
derived here (OPEN, weakest step 3).

### 3.4 Theorem D (winding lemma; sharp theta cut)

**Lemma (PROVED).** Let `F = A + A^#` with `A` analytic and nonvanishing near a segment of the
critical line. If `|A^#/A| <= 1` immediately to the right of that segment, then `arg A(1/2+it)`
is nondecreasing there, and it increases by exactly `pi` between consecutive zeros of `F`.

Proof. `Theta = A^#/A` has modulus 1 on the line; `d/dsigma log|Theta| = d/dt arg Theta` by
Cauchy-Riemann, and `arg Theta = -2 arg A` on the line. Zeros of `F` are the points with
`arg A = pi/2 mod pi`.

**Theorem D (PROVED).** For the sharp theta cut (Riesz projection of the Fourier kernel onto
`u >= 0`),

    A(s) = sum_n pi^(-s/2) n^-s Gamma(s/2, pi n^2) - 1/(1-s),   A + A^# = pi^(-s/2) Gamma(s/2) zeta(s),

one has `A(1/2+it) = -i (1 - 2 psi(1))/t + O(t^-2)` (two integrations by parts in
`int_1^inf psi(x) x^(s/2-1) dx`), so `arg A -> -pi/2` and has bounded variation, while `F` has
infinitely many zeros on the line. By the lemma `|A^#/A| <= 1` fails on every interval between
two high zeros. The same asymptotics hold for the cut at any `y` (the equivalent polar-term
choices change `A` by an odd rational function). The argument uses only a nonzero boundary
value of the kernel at the cut and infinitely many zeros on the line, so it applies to the DH
theta kernel in the same way (ARGUED for DH: its boundary value was not computed). Hence a
Riesz-projection split cannot separate zeta from DH.

MEASURED (`splits.log`): for `8 <= t <= 60`, `arg A + pi/2` stays within `[-0.0136, 0.0001]`
while `2 Re A` reproduces the completed zeta function (relative error 1e-25 at `t = 8`, 1e-8 at
`t = 60` with seven terms).

General form: a Lee-Yang split must carry the full winding, `arg A(T) = pi N_F(T) + O(1)`. The
gamma factor does (`theta(t)`); any piece dominated by boundary terms does not.

### 3.5 Proposition E (no limit)

(a) PROVED (prime number theorem, partial summation). For fixed `t`,
`sum_{p<=P} p^(-1/2-it) = P^(1/2-it)/((1/2-it) log P) (1 + o(1))`, so
`arg E_P(1/2+it)` oscillates with amplitude tending to infinity as `P -> infinity` (prime
powers `k >= 2` contribute a convergent or logarithmically bounded term). The zeros of `Phi_P`
at fixed height, which are the solutions of `theta(t) + arg E_P = pi/2 mod pi`, do not converge.

(b) PROVED (arithmetic). A product ladder has support `{n : n | M}`. Support containing every
`n <= Y` forces `lcm(1..Y) | M`. The Lee-Yang regime `2 pi M <= t` with `Y = sqrt(t/2pi)`
requires `lcm(1..Y) <= Y^2`, true for `Y <= 4` (`1, 2, 6, 12`) and false for `Y >= 5`
(`60 > 25`). So "complete to AFE length and in the Lee-Yang regime" holds only for `t < 157`.

(c) MEASURED (`fidelity.json`). Distance from each zeta zero to the nearest zero of `Phi_M`, in
mean spacings, inside the Lee-Yang regime just above `2 pi M`:

| M | window | mean | max |
|---|---|---|---|
| 12 | [76, 157] | 0.095 | 0.234 |
| 30 | [189, 289] | 0.113 | 0.274 |
| 210 | [1320, 1380] | 0.160 | 0.477 |
| 2520 = lcm(1..10) | [15834, 15864] | 0.174 | 0.542 |
| 1 (gamma factor alone) | [76, 157] | 0.187 | 0.454 |

Independent point sets of equal density would give about 0.25. The truncation zeros tend to the
gamma-only baseline as height grows.

(d) OPEN. Non-product stable polynomials. Stability on the polydisc is much wider than
products. Whether there are polydisc-stable `U_t` with degree lattice `M <= t/2pi` approximating
the smoothed AFE sum at height `t` within the accuracy needed for Hurwitz is not decided here.
Against: the weighted partial sums themselves are unstable (for a random point of the critical
torus the logarithmic Riesz sum has standard deviation `(log Y)^(3/2)/sqrt 3` against mean
`log Y`), and a stable approximant accurate at every height is at least as strong as RH in that
window. ARGUED only.

## 4. Numerics

All runs through `scripts/memcap.sh 8`, single process, each under 20 minutes (two runs were
stopped by this lane at the limit and are noted). Zero counts: argument principle on the box
`|sigma - 1/2| < W`, `T_j < t < T_(j+1)`, adaptive edge sampling (phase step at most 0.4);
on-line zeros by sign changes of `Re(e^(i arg gamma) E)`; off-line = total - on-line; a window
with nonzero difference is recounted with an 80 times finer grid. Winding numbers were integers
to 1e-4 in every row. Float64; not certified.

### 4.1 Zeta ladder truncations, strip `0 < sigma < 1`

| primes <= P, depth N | M | t_strip from (1) | range | on-line | off-line | last window with off-line zeros |
|---|---|---|---|---|---|---|
| 5, 1 | 30 | 69.8 | [2, 202] | 80 | 0 | none |
| 7, 1 | 210 | 213.8 | [2, 5002] | 4523 | 0 | none |
| 11, 1 | 2310 | 718.5 | [2, 802] | 492 | 8 | [62, 82] |
| 13, 1 | 30030 | 2477.7 | [2, 2602] | 2082 | 18 | [302, 352] |
| 5, 2 | 900 | 466.1 | [2, 602] | 342 | 2 | [42, 62] |
| 5, 4 | 810000 | 7500.5 | [2, 8002] | 7833 | 40 | [2302, 2402] |
| 11, 2 | 5.3e6 | 23083 | [2, 5002] | 4525 | 116 | [3752, 4002] |
| 23, 1 | 2.2e8 | 117173 | [2, 5002] | 4523 | 494 | all 20 windows |
| 11, 4 | 2.8e13 | 2.84e6 | [2, 5002] | 4525 | 1140 | all 20 windows |
| 23, 2 | 5.0e16 | 9.38e7 | [2, 5002] | 4524 | 3244 | all 20 windows |
| 7, 1 | 210 | 213.8 | [100000, 100500] | 770 | 0 | none |
| 5, 2 | 900 | 466.1 | [100000, 100500] | 770 | 0 | none |

Every off-line zero lies below `t_strip`. The bound is not attained in these ranges because an
off-line zero below `t_strip` needs simultaneous phase alignment at all primes. Below the
threshold the number of off-line zeros in a fixed range grows with both `P` and `N`.

### 4.2 Davenport-Heilbronn ladder truncations, strip

`A = (5/pi)^(s/2) Gamma((s+1)/2) [c1 prod_p sum_k (chi(p) p^-s)^k + c2 prod_p sum_k (conj chi(p) p^-s)^k]`,
`c1 = (1 - i kappa)/2`. Control validated: functional equation to 3.7e-26, off-line zero at
`0.8085171825 + 85.6993484854 i`. The gamma ratio is `(5t/2pi)^x`, so a stable piece would force
all zeros with `t >= 2 pi M/5` onto the line.

| primes <= P (p != 5), depth N | sup sigma with a zero of the Bohr piece | range | total | off-line | windows with off-line zeros |
|---|---|---|---|---|---|
| 2, 1 | none (min modulus 0.799 on the critical torus) | [2, 5002] | 5803 | 0 | 0 of 20 |
| 3, 1 | none (0.227; stability proved below) | [2, 5002] | 5803 | 0 | 0 of 20 |
| 3, 4 | 0.5040 | [2, 5002] | 5803 | 16 | 8 of 20 |
| 7, 1 | 0.6527 | [2, 5002] | 5803 | 190 | 20 of 20 |
| 7, 2 | not run | [2, 5002] | 5803 | 376 | 20 of 20 |
| 7, 4 | 0.6827 | [2, 5002] | 5813 | 300 | 20 of 20 |
| 13, 1 | 0.7695 | [2, 5002] | 5805 | 282 | 20 of 20 |
| 13, 4 | 0.7747 | [2, 5002] | 6543 | 1072 | 20 of 20 |
| 23, 1 | not run | [2, 5002] | 5857 | 452 | 20 of 20 |
| 7, 1 | 0.6527 | [100000, 100500] | 898 | 24 | 2 of 2 |
| 7, 2 | not run | [100000, 100500] | 898 | 38 | 2 of 2 |

`P = 3, N = 1` (PROVED): `U = 1 + z_2 z_3 + kappa (z_2 - z_3)`; on the polydisc
`|1 + z_2 z_3| >= 0.592 > kappa * 1.284 = 0.365`, so Theorem A applies and the 0 off-line count
is forced. First unstable stage in depth 1: `P = 7`. Structural reason: a zero of
`c1 U_chi + c2 U_chibar` is a solution of `prod_p e_p(conj chi(p) z_p)/e_p(chi(p) z_p) = -c1/c2`,
a unimodular target with argument `pi + 2 arctan kappa`; primes 2 and 3 give at most `130.5`
degrees of the `148.3` needed, and prime 7 supplies the rest. Bisection accuracy of the sup
abscissa: 4e-4.

### 4.3 Control `E_a`, `a = 0.3`

Truncation `E_M(s+a) E_M(s-a)` with gamma factor `gamma(s+a) gamma(s-a)`; local polynomial
`e_p(p^-a z) e_p(p^a z)` has zeros at `|z| = p^(-a)`, `p^a`, outside `|z| <= p^(-1/2)`: stable.

| P, N | box | range | total | off-line | last window with off-line zeros |
|---|---|---|---|---|---|
| 5, 1 | strip | [2, 1002] | 1317 | 10 | [2, 52] |
| 5, 1 | W = 40 | [2, 402] | 521 | 110 | [162, 182] (2 pi M = 188.5) |
| 5, 2 | strip | [100000, 100250] | 769 | 0 | none |

`E_a` passes the finite-stage theorem.

## 5. Scheme table (question 3)

"Finite stage" means a fixed truncation parameter. DH column: the same construction for the
Davenport-Heilbronn function.

| Scheme | Zeta | DH | Separates at a finite stage? | Why it does not reach xi |
|---|---|---|---|---|
| Ladder-native product truncation `Phi_M` (Theorem A) | all zeros with `t >= 2 pi M` on the line, every `M` (PROVED); off-line zeros below, count growing with `P`, `N` | off-line zeros at every height from `P = 7` (MEASURED); on the line for `P <= 3`, `N = 1` | **yes** | regime `M <= t/2pi` excludes AFE-complete support for `t >= 157`; no limit (Prop. E); `E_a` passes |
| Same with full Euler factors (`N = infinity`) | off-line zeros near `Re s = 1` at every height (PROVED) | same | no | quotient has poles on `Re s = 1` |
| Additive ladder (app `Z_TL`) | zero-free in `sigma > 0` (PROVED) | n/a | no | not related to zeta zeros |
| Sharp theta cut / Riesz projection (Theorem D) | dominance fails (PROVED) | fails (ARGUED, same proof) | no | piece has no winding |
| Smooth AFE split `A_lam = (1/2 pi i) int xi(s+w) e^(lam^2 w^2) dw/w` | boundary phase monotone on `[10,125]` for `lam = 1, 2, 4, 8`; fails for `lam = 0.5` at `t = 111.56` (near the pair 111.03, 111.87) | fails for every `lam`, at `t = 85.4..85.6` and `114.0..114.1` (its off-line zeros); `lam = 0.5` also at 40.5, 103.4, 117.5 | only at the heights of DH's known off-line zeros | not a finite truncation; `lam -> infinity` is `F + alpha F'` (rows G6, Q9, RH-equivalent); fixed `lam` already fails for zeta at one height |
| Jensen polynomials, shift 0 | hyperbolic for `d <= 16` (MEASURED) | hyperbolic for `d <= 8` (MEASURED) | no in the tested range | row P17: a function of verified height |
| de Bruijn-smoothed `H_tau` | real-rooted for `tau >= Lambda`, `Lambda <= 0.2` | real-rooted for `tau > 0.1765` (row G7, measured there; not re-run) | no | row F1/F3: no converse from `Lambda` to zeros |
| Heat-deformed ladder `E_c` (Prop. C) | zeros on `Re s = c log M` for `c >= 0` | not multiplicative; not run | not tested | statement is about the Bohr piece, not the completed function |
| Torus-height family `y^s A + y^(1-s) A^#` | on the line for `t >= 2 pi M / y^2` (Theorem A with `M -> M/y^2`) | fails as above | same as row 1 | xi is `y = 1`; this is the cosine-dominance row G17 |

Smooth-AFE and sharp-cut numbers are in `splits.log` (the run was stopped at the time limit
during its last step, so `splits.json` was not written). The monotonicity test is a necessary
condition for dominance only.

## 6. Controls

| Control | Step of Theorem A that fails | Type of failure |
|---|---|---|
| DH | stability of the Bohr piece: a sum of two products has zeros in the polydisc from `P = 7` (sup sigma 0.653) | structural, at a finite stage; MEASURED with a proved stable case at `P = 3` |
| Backward heat | product structure: coefficients `e^(c log^2 n)` are an Ising coupling `K_pq = 2c log p log q`, antiferromagnetic for `c < 0`; Lee-Yang needs `K >= 0` | structural (Prop. C); the completed backward-heat truncation itself was not run |
| T-NR | local factor at `q`: `w + 1/w + c` has a root inside `|w| < 1` for `|c| > 2` | structural, single prime (not run numerically) |
| `E_a`, `a > 1/2` | local roots at `|z| = p^-a < p^(-1/2)` | structural (size) |
| `E_a`, `a < 1/2` | **none**: truncations are stable and Theorem A holds (MEASURED) | passes every finite stage; its zeros are off the line |
| Sign twist `eps_p`, Beurling | **none**: `prod (1 - eps_p z_p)^-1` truncations are stable; the symmetrised truncation has its zeros on the line above `2 pi M` | passes every finite stage; the twisted function has no functional equation, so the symmetrised truncation is not a truncation of it |

Theorem A is a true statement about truncations, so the last two rows are not counterexamples
to it. They show where an attempted proof of RH along this route must fail: the passage to the
limit. `E_a` has the functional equation, an Euler product, positive `Lambda` and stable local
factors, and satisfies every finite-stage statement of this note.

## 7. The three requirements

1. *All primes together.* Theorem A uses every prime of the truncation jointly, through the
   product, and the hypothesis is checked one prime at a time. In the limit it uses none: the
   regime `M <= t/2pi` keeps `O(log t)` primes.
2. *Every height, every window.* The conclusion is uniform above `2 pi M` for fixed `M`. It is
   not uniform in `M`, and `M` must grow like `exp(sqrt(t/2pi))` for completeness.
3. *Fails for the controls for a named structural reason.* DH, backward heat, T-NR, `E_a` with
   `a > 1/2`: yes (section 6). `E_a` with `a < 1/2`, sign twists, Beurling: the finite-stage
   theorem holds for them; the missing limit step is the only place they can be excluded, and
   nothing in this lane does that.

## 8. Precise obstruction

In stable-polynomial language the completed function at truncation level `M` has quotient

    Theta_M = chi * M^(s-1/2) * I_M,   I_M inner,  log|chi| = -x log(t/2pi) + O(x/t^2).

Lee-Yang needs `Theta_M` to be bounded by 1 on `Re s > 1/2`. The inner factor is automatic from
multiplicativity plus local stability. The monomial `M^(s-1/2)` is the reflection of a
polynomial of degree `M` and cannot be removed: by Theorem B each rung adds a factor of mean
log-modulus 0 that is not constant. The gamma factor pays for it only when `t/2pi >= M`. A
faithful truncation at height `t` needs `log M` of order `sqrt(t)`, against the available
`log(t/2pi)`. The deficit is a largest-value statement on the Bohr torus (the supremum of
`log|E_M(1 - conj s)/E_M(s)|` over independent prime phases), and at the actual point
`w_p = p^(1/2-s)` it is the size of `Re sum_p p^(-1/2-it)`-type sums, which is wall 5.4. The
route supplies a new formulation of that wall and no way through it.

## 9. Three weakest steps

1. **Bound (G) and the exact threshold.** Theorem A is proved as an inequality between
   `|gamma(1-s)/gamma(s)|` and `M^x`; the form `t >= 2 pi M e^(0.042/t^2)` rests on a Stirling
   bound checked on a float64 grid for `t <= 1e3`, not proved here with explicit constants. The
   sharpness claim and the closed form (1) for `t_strip` are measured on four and ten cases.
2. **All zero counts are float64 argument-principle counts.** Off-line counts are differences of
   two counts; a missed close pair on the line would be reported as two off-line zeros. The
   recount at 80 times finer sampling reduces this and does not certify it. The DH separation at
   `P = 7` is supported independently by the polydisc zero search (sup sigma 0.6527), which is a
   Nelder-Mead minimisation to residual 1e-13, also uncertified.
3. **Proposition C concerns the Bohr piece only, and Proposition E(d) is open.** The heat flow
   also shifts the archimedean factor term by term (row F2); the statement "forward heat is
   ferromagnetic" is proved for the Dirichlet polynomial `E_c` and not for the completed
   deformed truncation. The exclusion of non-product stable approximants is argued from a
   variance heuristic, not proved; if such approximants exist with `M <= t/2pi`, the obstruction
   of section 8 would not apply to them.

Also unverified: the attributions to Spira and Gonek (recalled); the DH de Bruijn time 0.1765
(taken from row G7); Jensen degrees above 16 (zeta) and 8 (DH) were not computed.

## 10. Files

All under `tmp/research-2026-11-16/push/ap-leeyang-ladder/`.

- `euler_hb.py`: zero counts for zeta, DH and `E_a` ladder truncations. Outputs
  `euler_hb_thresholds.json`, `euler_hb_growth.json`, `euler_hb_sep.json`, `euler_hb_ea.json`;
  `euler_hb_run1_nonadaptive.log` is the first, non-adaptive run (stopped; rows with phase step
  above 1 unreliable).
- `bohr_checks.py`, `bohr_checks.json`, `bohr_checks.log`: polydisc zero search for the DH piece,
  additive ladder, inner bound `psi(x)/(x log M) <= 0.902` on tested `x`, heat-Ising checks.
- `splits.py`, `splits.log`: smooth-AFE and sharp-cut splits, Jensen for zeta.
- `jensen_dh.py`, `jensen_dh.json`; `chi_check.py`, `chi_check.json`; `fidelity.py`,
  `fidelity.json`; `cfg_main.json` (configuration of the stopped first run).
