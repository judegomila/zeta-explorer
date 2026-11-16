# r2-lowpass-cone: referee of Theorem F, the cone K_0 of known positive tests, and the position of the order-149 DH vector

Date: 2026-11-16. Scope: `tmp/research-2026-11-16/push/r2-lowpass-cone/` only. Nothing committed or pushed.
Nothing here proves or refutes RH. Labels: PROVED (argument given here), CLASSICAL, MEASURED (mpmath / python-flint
numerics; Arb-certified where stated), OPEN.

Notation as in `eq48/RESULT.md`: `F(w) = xi(1/2+w)`, `L = F'/F`, centered zeros `rho = beta + i gamma`,
`Q_L(v) = sum_rho V(rho) V(-rho)` for real tests, `Phi(u) = L(sqrt u)/sqrt u = sum_rho 1/(u - rho^2)`,
`Theta(t) = sum_rho e^{rho^2 t}`.

## Verdict

**Precise obstruction, with five proved statements.**

1. Theorem F of `weil-onesided` is correct. Its positivity comes from neither theta-kernel positivity nor
   `Lambda(n) >= 0`. It comes from one fact about low zeros: the zero with the smallest `Re(-rho^2)` lies on the
   line, and off-line zeros start high enough. It holds for zeta and DH. **It fails for the Euler-product twin
   T-NR with `c > 2`** (Theorem 1; `Theta < 0` at explicit `t`; Theorem F product tests negative at order 5 to 12).
   So Theorem F is a low-height zero-location statement. Theorems B and C of `weil-onesided` also survive, with
   two small gaps noted.
2. On a fixed real node set `S` (order `N`) everything is linear in a vector `m in R^N`, and all known positive
   tests form two explicit cones: `K_F(S)` (Theorem F) and `K_Om(S)` (termwise zero location). `K_0(S) = K_F(S) + K_Om(S)`
   sits inside the Pick cone `C_Pick(S)` (Theorems 2, 3).
3. Extreme-ray test (Theorem 4, PROVED): an extreme ray of `C_Pick(S)` is a test whose transform has `K <= (N-1)/2`
   zeros `i tau_k` on the critical line. It lies in `K_0(S)` iff it is the single divided-difference ray, or all
   `tau_k` lie below the height `T` to which on-line zeros are assumed (minus a margin of at most `1.28 K`). A ray with
   one root above `T` is never in `K_0(S)`. The answer does not depend on the nodes. So the Pick constraints implied
   by `K_0` are exactly the ones that do not probe heights above `T`; the fraction is the fraction of root
   configurations below `T` (table in Section 4).
4. With the same height input `T = 100` that Theorem F uses, `K_F(S)` is contained in `K_Om(S)` for all orders
   `N < 88` (MEASURED, exact moment-cone test): at orders up to 40 Theorem F adds nothing to termwise zero location.
   With the minimal input `T = 20` it adds something from order 21.
5. The certified DH failure vector at order 149 (reproduced: `-7.93581794526e-480`) is outside `K_F(S)` and outside
   `K_F + K_Om_T` for every `T <= 937.8` (Arb-signed dual witnesses), and inside `K_Om_T` for `T >= 937.934`
   (MEASURED). On this vector zeta is positive (`+5.6445e-262`, Arb sign) because zeta's zeros below height 938 are
   on the line at heights where the test does not vanish. No Euler-specific margin is involved.

**Is `K_0` Euler-blind?** Every explicit element examined passes for DH. `K_F` holds for DH in full. The only
generator DH violates is the strip bound `|beta| <= 1/2` (DH has zeros with `Re s > 1`; existence is classical; none
below height 10^4 per `dh-separator`). At orders up to 40 on nodes in `[0.6, 6]`, `K_0(S)` is inside `C_Pick(S)`, and
DH is Pick-positive to order 148 (sibling measurement), so no element of `K_0(S)` fails for DH there. The Euler
product enters `K_0` only through the classical zero-free statements. `K_0` contains no information about zeros
above the height `T` used as input.

## 0. Plan: what is new against the atlas and the walls

The atlas (PR 27) and `eq48` identify the one-sided target with Weil positivity. `weil-onesided` adds Theorem F and
calls its cone Euler-blind. `dh-separator` adds order-1 complex tests. `pick-induction` certifies the DH failure at
order 149. Not in any of them: (i) the test of Theorem F on the Euler-product twin; (ii) a single linear coordinate
system in which the Pick cone, the Theorem F cone and the zero-location cone can be compared; (iii) the extreme-ray
classification; (iv) the position of the order-149 vector.

| Wall | Status here |
|---|---|
| DH control | Theorem F and all of `K_F` hold for DH. Section 6 lists which generator DH violates (strip bound only). |
| Flow-blindness | `K_F` is a statement about the heat trace; stable under the flow; no zero location follows. |
| MV-CAP | Not used. |
| Verified height | Theorem 4 is the verified-height wall in cone form: a test is covered iff it does not vanish on the line above `T`. |

## 1. Part 1: referee of `weil-onesided`

### 1.1 Theorem F (re-derived; CONFIRMED)

On-line pairs contribute `2 e^{-gamma^2 t}`. A quartet `{+-beta +- i gamma}` contributes
`4 e^{(beta^2-gamma^2)t} cos(2 beta gamma t)`. It is negative only if `t > pi/(4 beta gamma) > pi/(2 gamma)` (uses
`beta < 1/2`). For such `t` its size relative to `2 e^{-gamma_1^2 t}` is at most
`2 exp(-(gamma^2 - gamma_1^2 - 1/4) pi/(2 gamma))`, independent of `t`. With `gamma > 100`,
`(gamma_1^2 + 1/4)/gamma < 2.001`, and the sum over zeros above 100 is below `1e-60` by `N(T) <= T log T`. Each step
checked. Corollaries F1 to F3 follow; the exchange of sum and integral in F2 holds because
`sum_rho |e^{rho^2 t}| = O(t^{-1/2} log(1/t))` and `k(t) = O(t^{M-1})`.

### 1.2 Which property gives positivity (PROVED)

**Theorem 1.** Let `Z` be a multiset in a strip `|beta| <= b`, symmetric under `rho -> -rho` and `rho -> conj rho`,
with `sum |rho|^{-2} < inf`, and `Theta_Z(t) = sum_Z e^{rho^2 t}`.

(a) Suppose `Z` contains an on-line pair `+- i gamma_1` (or a real pair `+- delta`; put `gamma_1^2 := -delta^2`),
every off-line quartet has `gamma > T_0`, and
`sum over quartets of 2 exp(-(pi/(4b)) (gamma - (gamma_1^2 + b^2)/gamma)) < 1`. Then `Theta_Z(t) > 0` for all `t > 0`.

(b) Suppose `mu = min_Z Re(-rho^2)` is attained only at one off-line quartet `{+-beta_0 +- i gamma_0}`, `beta_0 gamma_0 != 0`.
Then `Theta_Z(t) < 0` for a sequence `t -> inf`.

*Proof.* (a) is the argument of 1.1 with `b` in place of `1/2`. (b): `e^{mu t} Theta_Z(t) = 4 cos(2 beta_0 gamma_0 t) + o(1)`,
because every other term is `O(e^{-(mu' - mu) t})` with `mu' > mu` the next value (the sum converges absolutely for
`t > 0`, and `|e^{rho^2 t}| e^{mu t} <= e^{-(mu'-mu)(t-1)} |e^{rho^2}| e^{mu}` for `t >= 1`). ∎

No Euler product, no functional equation beyond the symmetry of `Z`, and no sign of `Lambda(n)` enters. The
hypothesis in (a) is a statement about the first zero and about the absence of off-line zeros at low height. For
zeta it needs the zeros on the line up to height about 20, not 100. Theta-kernel positivity (positivity of the
Fourier kernel of xi) is not used and is not implied.

**Application to the twins.**

* DH: first zero `5.0942` on the line, first quartet at `85.70`, `beta <= 0.31` for the four quartets below 200.
  (a) applies (MEASURED inputs; zeros with larger `beta` at greater height do not affect the bound). Theorem F holds.
* T-NR, `F_c(s) = xi(s)(2 cosh((s-1/2) log q) + c)`, `2 < c < q^{1/2} + q^{-1/2}`: the cosh factor has zeros
  `+-delta + i (2k+1) pi/log q`, `delta = arccosh(c/2)/log q < 1/2`. The lowest height `pi/log q <= 4.54` is below
  `gamma_1 = 14.13`, so the minimum of `Re(-rho^2)` is at an off-line quartet. By (b) **Theorem F is false for T-NR
  with `c > 2`**, although T-NR has an Euler product, the gamma factor of zeta and a functional equation.
* T-NR with `c < -2`: zeros `+-delta + 2 pi i k/log q`, including the real pair `+-delta`. (a) applies. Theorem F
  holds, while real-node Pick positivity already fails at order 2.

### 1.3 Table (MEASURED, `p1.py`, `p1b.py`; own code, mpmath, 30 to 120 digits)

Reproduced case: `V = 1/((z+0.7)(z+1.3)(z+2.9))`.

| function | Pick form | zero sum | `Q / (first-zero term)` |
|---|---|---|---|
| zeta | 2.74878466354e-7 | 2.74878387776e-7 (150 zeros; tail estimate 8.0e-14) | 1.15469 |
| DH | 8.40550671277e-5 | 8.40550660896e-5 (zeros to 200) | 1.05538 |
| T-NR q=2, c=2.1 (delta 0.45434) | 2.51837804738e-4 | 2.51837804657e-4 | |
| T-NR q=2, c=-2.1 | 0.579501528002 | 0.579501528002 | |
| T-NR q=3, c=2.3 (delta 0.49253) | 1.93729384308e-3 | 1.93729384298e-3 | |

The zeta difference `7.9e-14` equals the tail estimate. The Pick forms use only `L`; the zero sums use only the zero
lists; agreement checks the T-NR zero description and the DH list.

| statement | zeta | DH | T-NR c>2 (q=2, c=2.1) | T-NR c<-2 (q=2, c=-2.1) |
|---|---|---|---|---|
| Euler product | yes | no | yes | yes |
| `Lambda >= 0` | yes | no | no (`Lambda_F(q^2)/log q = -3.82`) | no (`Lambda_F(q)/log q = -1.97`) |
| `Theta(t) > 0` for all `t` | true | true | **false**: `Theta(0.5) = -7.2e-5`, `Theta(0.763) = -7.3e-7` | true |
| Theorem F products `V = (z+a)^{-M}`, all `M` | positive | positive | **negative** from `M = 8` (`a = 0.6`), 9 (`a = 1`), 12 (`a = 3`) | positive |
| same, distinct Chebyshev nodes in `[0.6, 1.6]`, `M = 10, 12, 14` | 1.8e-23, 4.6e-28, 1.1e-32 | 8.8e-15, 1.2e-17, 1.6e-20 | -4.5e-14, -1.9e-16, -5.5e-19 | |
| real-node Pick positivity | true to 221 (sibling) | fails at 149 (certified) | fails at order <= 8 | fails at order 2 (det = -9.44 at nodes 0.55, 0.6) |
| `Re L(z) >= 0` on `Re z >= 1/2` (`dh-separator` Thm C) | true (PROVED there) | false (existence) | true (local factor min 0.116 on `Re z = 1/2`) | true |
| `Q <= A` on `v >= 0` (Theorem E) | true | false | false | false |

T-NR with `q = 3`, `c = 2.3`: `Theta < 0` at `t = 0.763, 1.0, 1.5, 3.0`; product tests negative from `M = 5` (`a = 0.6`),
6 (`a = 1`), 10 (`a = 3`).

Consequences. (i) "Euler-blind" is the wrong description of Theorem F: it is false for one Euler-product twin and
true for the twin without Euler product. Its truth is decided by where the lowest zeros are. (ii) Low-order real
Pick positivity is not blind to off-line zeros in general. It is blind to DH below order 149 because DH's off-line
zeros are high (85.7) and sit above 30 on-line zeros.

### 1.4 Theorems B and C of `weil-onesided` (re-checked)

* **(B1)** `Q_L = sum |V(rho)|^2 - (1/2) sum |V(rho) - V(-conj rho)|^2`. CONFIRMED: apply
  `a conj b + b conj a = |a|^2 + |b|^2 - |a-b|^2` to `a = V(rho)`, `b = V(-conj rho)` and average over the involution.
* **(B2)** `Q_L(v + n) = Q_L(v)` for Nyman–Beurling `n`. The transform formula and the vanishing at zeros are correct.
  Gap G1: `n` is not an exponential sum, so `Q_L(v+n)` is defined there by the zero-side sum. The statement is an
  identity for that extension. Equality with the arithmetic side for such `n` is not shown (not needed for the
  non-closability remark, which is conditional on RH and stated on the extended domain).
* **Lemma C1.** CONFIRMED. First part: `zeta(s) A(s)(s-1)/(s^2 (s - rho_s))` is entire in `Re s >= 1/2`, decays like
  `|s|^{-7/4+eps}` on the line and `|s|^{-2}` far right. Second part: `zeta(1-s) A(s) e^{Lam s} s/((s-1)^2 (s-rho_s))`
  is analytic to the left, bounded factor because `theta e^{Lam} >= 1`. Gap G2 (cosmetic): the exponent should read
  `-2 + 1/4 + eps`.
* **Lemma C2.** CONFIRMED (residue `-F(rho_s)` from the first part; second part `O(e^{-Lam delta})` on
  `Re s = 1/2 - delta`, where `1/chi` is analytic and `|1/chi| ~ |t/2 pi|^{-delta}`).
* **Lemma C3 and Theorem C.** CONFIRMED: `|Psi|^2 = |1 - e^{i theta(t)}|^2/(t-gamma)^2`, mean `Lam + O(log Lam)`;
  Cauchy–Schwarz against the Gram matrix. The off-line constant `c_rho = 2 beta |rho_s - 1|^2/|rho_s|^2` is right.

## 2. Linear coordinates on a node set (PROVED)

Fix `S = {a_1 < ... < a_N}` in `(1/2, inf)`, `u_j = a_j^2`. For real `b` put `m_j = 2 a_j b_j V(a_j)`.

**Lemma 2.1.** `V(w)V(-w) = sum_j m_j/(u_j - w^2) =: H_m(w)` and `Q_L(v) = sum_j m_j Phi(u_j) =: l(m) = sum_rho H_m(rho)`.

*Proof.* `V(w)V(-w)` is even, `O(w^{-2})`, with simple poles at `+-a_j` and residue `-b_j V(a_j)` at `w = a_j`. ∎

So the Pick matrix `P_S` enters only through the `N` numbers `Phi(u_j)`, and each real test is a vector `m in R^N`.

**Lemma 2.2 (Pick cone).** `{ m(b) : b in R^N } = C_Pick(S) := { m : H_m(i tau) >= 0 for all real tau }`. It is a
closed convex cone. `P_S >= 0` iff `l >= 0` on `C_Pick(S)`.

*Proof.* `H_{m(b)}(i tau) = |V(i tau)|^2`. Conversely `H_m(i tau) = p(tau^2)/prod(u_j + tau^2)` with `deg p <= N-1`
and `p >= 0` on `[0, inf)`. Then `p(s) = A(s)^2 + s B(s)^2` (CLASSICAL, Pólya–Szegő), so
`p(tau^2) = |A(tau^2) + i tau B(tau^2)|^2 = |g(i tau)|^2` with `g(w) = A(-w^2) + w B(-w^2)` real of degree `<= N-1`,
and `V = g/prod(w + a_j)` has real `b`. ∎

Extreme rays of `C_Pick(S)` (CLASSICAL, Karlin–Studden): `p(s) = c s^e prod_{k<=K} (s - tau_k^2)^2`, `e in {0,1}`,
`2K + e <= N-1`. In test terms `V(w) = w^e prod (w^2 + tau_k^2)/prod (w + a_j)`: the test vanishes at `K` points of
the critical line.

## 3. The cones of known positive tests (PROVED)

**Theorem 2 (Theorem F cone).** `K_F(S) := { m : E_m(t) := sum_j m_j e^{-u_j t} >= 0 for all t > 0 }`. Then `l(m) = int_0^inf Theta(t) E_m(t) dt >= 0`
on `K_F(S)`, and `K_F(S)` is the whole set of consequences of `Theta > 0` on the node space (`H_m = int E_m e^{w^2 t} dt`,
so `m` is the Gaussian mixture with density `E_m`; the dual cone is the closed conic hull of the curve
`e(t) = (e^{-u_j t})_j`). `K_F(S)` is inside `C_Pick(S)`. Theorem F products are the ray `p = const`.

**Theorem 3 (zero-location cone).** Let `Om` be a closed set, symmetric under `rho -> -rho` and conjugation, that
contains all centered zeros. Put `K_Om(S) := { m : Re H_m(rho) >= 0 for all rho in Om }`. Then `l >= 0` on `K_Om(S)`.
It is the largest cone with this property that depends on `Om` alone: if `m` is not in `K_Om(S)`, one quartet in
`Om` gives a negative sum.

*Proof.* `l(m) = sum_rho H_m(rho) = sum_rho Re H_m(rho)`. ∎

With `Om_T := i R ∪ { |beta| <= 1/2 - eta(gamma), |gamma| >= T }` (`eta` the de la Vallée-Poussin or
Vinogradov–Korobov width; `T` a height below which all zeros are on the line): `K_{Om_T}(S)` is inside `C_Pick(S)`.

Relation to the `dh-separator` generators:

* Order-1 complex tests `e^{-zt}` have `H_z(w) = 1/((z+w)(conj z - w))`. On a real node set they appear only for real
  `z = a_j`, i.e. `m = e_j`, which is in `K_F(S)`.
* **Lemma 3.1.** `F_c(S) = { m : sum_j (m_j/a_j) Re 1/(a_j - c - i tau) >= 0 for all tau }`, and `F_c(S)` is inside
  `K_{|beta| <= c}(S)`.
  *Proof.* By `dh-separator` Theorem B, `r in F_c` with rates `a_i` corresponds to `v` with rates `x_i = a_i - c`, and
  `Q(r) = sum_j m_j Phi(u_j)` with `m_j = 2 a_j b_j V_v(x_j)`. The vector `n_j = m_j x_j/a_j` ranges over
  `C_Pick` of the nodes `x`, which is the stated condition. The function `P(rho) = sum_j (m_j/a_j) Re 1/(a_j - rho)` is
  harmonic in `Re rho < a_1`, tends to 0 at infinity and is `>= 0` on `Re rho = c`, hence on `Re rho <= c`. And
  `2 Re H_m(rho) = P(rho) + P(-rho)`. ∎
* Half-plane generators `Re z > c` are Poisson averages of those on `Re z = c` for zero sets in `|beta| < c`, so they
  add nothing to `F_c`.

So all listed generators are inside `K_0(S) := K_F(S) + K_{Om_T}(S)`, and `K_0(S)` is inside `C_Pick(S)`.

## 4. Part 2: extreme-ray test (PROVED) and numbers (MEASURED)

**Theorem 4.** Let `m` span an extreme ray of `C_Pick(S)` with roots `tau_1, ..., tau_K` (Section 2), `N >= 3`.

(i) `m in K_0(S)` iff `m in K_F(S)` or `m in K_{Om_T}(S)`.
(ii) `m in K_F(S)` iff `p` is constant (the divided-difference ray of Corollary F2).
(iii) If some `tau_k >= T`, then `m` is not in `K_{Om_T}(S)`.
(iv) If all `tau_k <= T - 4K/pi - 0.01` and `N <= 1.5 T`, then `m in K_{Om_T}(S)`.

*Proof.* (i) `K_F` and `K_{Om_T}` are inside `C_Pick`; a decomposition `m = m_1 + m_2` of an extreme vector has both
parts proportional to `m`. (ii) If `E_m >= 0` and `m != 0`, then `H_m(i tau) = int E_m e^{-tau^2 t} dt > 0` for every
`tau`, so `p` has no root in `[0, inf)`; the only extreme `p` without such a root is a constant. (iii) Let `tau_1 >= T`
have multiplicity `r` among the roots. For small `beta > 0` choose `gamma > T` near `tau_1` with
`arg(tau_1^2 + rho^2) = pi/(2r)` (possible: the imaginary part `2 beta gamma` is positive and the real part
`tau_1^2 - gamma^2 + beta^2` takes both signs). Then `(tau_1^2 + rho^2)^{2r}` is a negative real number. As
`beta -> 0` the other factors of `H_m(rho)` have argument tending to 0 mod `2 pi`. So `Re H_m(rho) < 0`, and `rho` is
in `Om_T`. (iv) For `gamma >= T`, `0 < beta <= 1/2`, `tau <= gamma - d`:
`arg (tau^2 + rho^2)^2 = -2 arctan(2 beta gamma/(gamma^2 - tau^2 - beta^2))` mod `2 pi`, and
`2 beta gamma/(gamma^2 - tau^2 - beta^2) <= 1/(d - 1/(4T))`. The denominator contributes
`sum_j arctan(2 beta gamma/(u_j + gamma^2 - beta^2))` in `[0, N/T]`. So `arg H_m(rho)` lies in
`[-2K/(d - 0.0025), N/T]`, inside `[-pi/2, pi/2]` under the stated bounds. ∎

Reading. A test in the Pick cone is covered by the known positive cones iff it does not vanish on the critical
line at or above `T`. The statement is independent of the node set and of the order. The Theorem F cone covers one
extreme ray per node set. With `T = 3e12` (verified height) the uncovered rays are those with a transform zero
above about `3e12 - 51` at order 40.

**Strictly larger than each generator?** Yes for `K_{Om_T}` against `K_F` at every `N >= 3` (any ray with a root below
`T - 1.28K`). For `K_F` against `K_{Om_T}` it depends on `T` and `N`; see the next table.

MEASURED (`p2.py`, `p2b.py`, `p2c.py`; `p2.py` was stopped after `N = 31` and its remaining blocks were run as `p2b.py`, `p2c.py`). Nodes with `u_j` equally spaced in `[0.36, 36]` (`a_j` in `[0.6, 6]`), `T = 100`,
membership in `K_{Om_T}` by evaluating `arg H` on a grid of `rho` (7 values of `beta`, heights near `T` and near every
root above `T - 60`).

Roots log-uniform on `[1, 1e4]` (400 samples per row; 200 at `N = 40`):

| N | K | fraction in `K_0(S)` | fraction with all roots `< T` | members with a root `> T` |
|---|---|---|---|---|
| 3 | 1 | 0.5175 | 0.5175 | 0 |
| 5 | 2 | 0.255 | 0.255 | 0 |
| 9 | 4 | 0.0575 | 0.0575 | 0 |
| 15 | 7 | 0.0075 | 0.0075 | 0 |
| 21, 31, 40 | 10, 15, 19 | 0 | 0 (expected `2^{-K}`) | 0 |

Roots uniform on `[1, T]`: member fraction 0.975 (`N = 9`), 0.945 (`N = 21`), 0.835 (`N = 40`); no violation of (iv).
Largest `tau_max` with membership for a cluster of `K` roots at spacing 0.5: `T - tau_max = 0.49, 1.78, 3.88, 6.40`
for `K = 1, 4, 10, 19` (proved sufficient margin: `1.28 K`).

The fraction is therefore a property of the sampling measure on root heights, not of the cone geometry: it equals
the probability that all `K` roots fall below `T`, up to the margin.

**Is `K_F(S)` inside `K_{Om_T}(S)`?** Equivalent (bipolar theorem) to: for each `rho` in `Om_T` the vector
`q(rho) = (Re 1/(u_j - rho^2))_j` lies in the moment cone of `e(t)`. For equally spaced `u_j` this is a truncated
Hausdorff moment problem, decided by two Hankel matrices (Arb, 3000 bits, certified pivot signs).

| gamma | beta = 0.5 | beta = 0.25 | beta = 0.1 | `pi gamma/(4 beta)` at beta = 0.5 |
|---|---|---|---|---|
| 15 | 17 | 31 | 72 | 23.6 |
| 20 | 21 | 39 | 92 | 31.4 |
| 30 | 29 | 55 | 132 | 47.1 |
| 50 | 46 | 88 | > 211 | 78.5 |
| 100 | 88 | 172 | > 187 | 157.1 |

Entry: first order `N` at which `q(beta + i gamma)` leaves the moment cone. So with `T = 100`, `K_F(S)` is inside
`K_{Om_T}(S)` for `N <= 87` on these nodes (MEASURED at the worst corner `beta = 1/2`, `gamma = T`; monotone in both
on the grid), and `K_0(S) = K_{Om_T}(S)` for all orders up to 40. With `T = 20`, `K_F(S)` is not inside `K_{Om_T}(S)`
from `N = 21`. Theorem F is new information over termwise zero location only when the order exceeds about `0.9 T`.

## 5. Part 3: the certified DH failure vector at order 149

`getw.py` recomputes the `pick-induction` vector (`a = 1`, order 149, 12000 bits):
`w^T T_149 w = [-7.93581794525671e-480 +/- 4.6e-495]` for DH (matches `cert.py`), and
`[+5.64453809381490e-262 +/- 3.1e-277]` for zeta with the same `w`.

**Lemma 5.1 (PROVED).** With `W(x) = sum_k w_k x^k`, `zeta(z) = (z-a)/(z+a)`, `V(z) = W(zeta(z))/(z+a)`:
`w^T T_N w = a sum_rho H(rho)`, `H(z) = V(z)V(-z) = W(zeta) W(1/zeta)/(a^2 - z^2)`.

*Proof.* The Pick kernel is `K(x,y) = (L(x)+L(y))/(x+y) = sum_rho 1/((x+rho)(y-rho))` (symmetric sum). With
`x = a(1+zeta)/(1-zeta)`, `y = a(1+omega)/(1-omega)`: `1 - zeta omega = 2a(x+y)/((x+a)(y+a))`, so
`2 sum_{i,j} c_{|i-j|} zeta^i omega^j = (G(zeta)+G(omega))/(1 - zeta omega) = K(x,y)(x+a)(y+a)/(2a)`. Also
`(x+a)/(x+rho) = (2a/(a+rho)) sum_i zeta(rho)^i zeta^i` and `(y+a)/(y-rho) = (2a/(a-rho)) sum_j zeta(rho)^{-j} omega^j`.
Comparing coefficients, `c_{|i-j|} = a sum_rho zeta(rho)^{i-j}/(a^2 - rho^2)`; sum against `w_i w_j`. ∎
Check (`p3c.py`): zeta, `W = (1-x)^3`: `w^T T_4 w = 8.32427809e-8`, zero sum over 40 zeros
`8.32427607e-8`, difference equal to the tail.

The node is confluent (149 nodes merged at `a = 1`). The cones are read on `H` directly: `K_F` is "`H` is the
Laplace transform in `-w^2` of a nonnegative function", `K_Om` is "`Re H >= 0` on `Om`", and the dual elements are the
functionals `H -> sum over a symmetric configuration`. Theorems 2 and 3 hold verbatim in this form.

MEASURED position (`p3.py`, `p3b.py`, `p3c.py`, `p3d.py`; 600 digits or Arb 2600 bits):

* `H` vanishes to high order of smallness at the DH on-line zeros: at `beta = 0.01` the sign map has negative points
  at `14.40, 19.30, 22.15, 23.35, 26.10, 30.15, 33.70, 37.45, ...`, which are DH on-line ordinates. The test removes
  the on-line mass below 200.
* At the DH quartet `0.3085 + 85.699 i`: `cos(arg H) = -0.9486`, `4 Re H = -1.4403e-478`. The certified total
  `-7.94e-480` is 5.5% of that term; the remaining DH zeros cancel 94.5% of it.
* `Re H(beta + i gamma) < 0` on about 70 height intervals for `beta = 0.3 .. 0.5` (one lens per near-axis zero of `V`).
  The highest are at `204, 223, 246, 275, 311, 359, 424, 518, 667, 937.5`. Supremum of `gamma` with
  `Re H(1/2 + i gamma) < 0`: `937.9336778`. Above 945, `cos(arg H) >= 0.9915` on the `beta` grid, tending to 1
  (checked at `1e3, 2e3, 1e4, 1e6, 3e12`; scan to `6e4`).

**Proposition 5.2 (Arb-signed).** The DH failure vector `m` is not in `K_F + K_{Om_T}` for any `T <= 937.8`.

*Proof.* Take `d = q(0.45 + 937.8 i) + q(937.3 i)` (one quartet plus one on-line pair). `beta = 0.45` is inside the
strip left by the explicit de la Vallée-Poussin region at this height (`1/2 - 1/(5.56 log 938) = 0.474`), so `d` is
in the dual of `K_{Om_T}` for `T <= 937.8`. `d` is in the dual of `K_F`: its heat trace
`2e^{-tau^2 t} + 4 e^{(beta^2-gamma^2)t} cos(2 beta gamma t)` is positive by Theorem 1(a) (ratio bound
`2 exp(-(gamma^2 - tau^2 - beta^2) pi/(4 beta gamma)) = 0.349 < 1`). And `<m, d> = [-2.2562e-489 +/- 2.8e-497] < 0`. ∎

Other witnesses (`p3d.py`, `p3e.py`): quartet `0.5 + 937.9 i`, pair `937.5 i`: `-2.57e-490` (full strip, `T <= 937.9`);
quartet `0.45 + 101.9 i`, pair `101.5 i`: `-3.70e-481`. In particular `m` is not in `K_F`.

Supremum of `gamma` with `Re H(beta + i gamma) < 0`: `937.9337` (`beta = 0.5`), `937.9041` (`beta = 0.474`), `937.8763`
(`beta = 0.45`), `937.6789` (`beta = 0.3`). So `m in K_{Om_T}` for `T >= 937.934` with the full strip and for
`T >= 937.905` with the de la Vallée-Poussin width (MEASURED on the grid; not a certified enclosure of all lenses).

| generator | DH vector inside? | margin |
|---|---|---|
| `K_F` (Theorem F, Gaussian mixtures) | no | dual witness value `-2.26e-489` (Proposition 5.2; quartet term plus on-line pair term, unnormalized) |
| strip cone `K_{|beta| <= 1/2}`, `F_{1/2}`, order-1 half-plane tests | no | `cos(arg H) = -1` attained (maximal violation) at about 70 heights |
| `K_F + K_{Om_T}`, `T = 100` (input of Theorem F) | no | 10 lenses between 101 and 938 |
| `K_{Om_T}`, `T >= 937.934` | yes (MEASURED) | height margin `T - 937.93` |

**Size of the Euler-specific part: zero.** The positivity of zeta on this vector follows from one input: zeta has no
off-line zero below height 937.94. That is verified height (CLASSICAL numerics), not an Euler-product argument.
Equivalently: the order-149 vector separates DH from zeta because DH has an off-line zero at 85.7 inside a lens of
the test and zeta has none below 938. The zeta value `5.6e-262` exceeds the DH scale `1e-478` by 216 orders because
zeta's on-line zeros are not at the DH ordinates where the test vanishes.

## 6. DH control and the statement on Euler-blindness

| generator of `K_0` | input | DH | T-NR c>2 |
|---|---|---|---|
| `K_F` | lowest zero on the line; off-line zeros above about 20 | holds | fails |
| strip `|beta| <= 1/2` (and the classical region) | Euler product: non-vanishing on `Re s >= 1`, `3-4-1` with `Lambda >= 0` | fails by existence (zeros with `Re s > 1`; none below 10^4) | strip holds; the low-height rectangle fails (zero at height 4.53) |
| on-line below `T` | verified height | fails from `T > 85.7` | fails from `T > 4.53` |

* No element of `K_0(S)` at order `<= 40` on nodes in `[0.6, 6]` fails for DH: `K_0(S)` is inside `C_Pick(S)` (PROVED), and
  DH Pick positivity to order 148 is the sibling's measurement (confluent nodes; nested nodes to 100).
* At order 149 the certified failure vector is outside `K_0` unless `K_0` is given verified height 938.
* The elements of `K_0` that must fail for DH (by `dh-separator`) are tests seeing a DH zero with `Re s > 1`. They
  exist; no explicit one is known.

So `K_0` is Euler-blind on every explicit element available, and its dependence on the Euler product is exactly
the classical zero-free region. It contains no test that vanishes on the line above the input height. A proof of
`l >= 0` on one extreme ray with a root above verified height would be new information; nothing here supplies it.

## 7. Verdict and the three weakest steps

Verdict: precise obstruction. Theorem F is correct and is a low-height zero-location statement (false for the
Euler-product twin T-NR). The cone of known positive tests on real nodes is `K_F + K_Om`, and it meets the extreme
rays of the Pick cone exactly in the tests that do not vanish on the line above the input height.

1. **Theorem 4(iii) for repeated roots and the grid tests.** (iii) is proved by a limit `beta -> 0`; (iv) has a
   conservative margin. The measured membership tests (Section 4 table, `T* = 937.934` in Section 5) are grid
   evaluations of `arg H`, not certified enclosures. The non-membership statements in Proposition 5.2 are
   Arb-signed.
2. **`K_F` inside `K_Om` for `N <= 87`.** Tested at 15 pairs `(beta, gamma)` on one node family (equally spaced `u_j`).
   Monotonicity in `beta` and `gamma` is observed, not proved; other node families were not tested.
3. **DH inputs.** Theorem F for DH and the T-NR/DH table rely on the measured DH zero list to height 200 from
   `weil-onesided` (validated here by the Pick-versus-zero-sum identity to 1e-8 relative) and on the sibling
   Pick-positivity measurements to order 148. The zero-side identity for the order-149 vector was checked only on
   the quartet terms and on a low-order analogue; the on-line sum needs DH zeros to more than 200 digits and was
   not recomputed.

## 8. Files

`p1.py`, `p1b.py` (Part 1); `p2.py`, `p2b.py`, `p2c.py`, `p2.log`, `p2b.log`, `p2c.log` (Part 2); `getw.py`, `w149.json`,
`p3.py`, `p3b.py`, `p3c.py`, `p3d.py`, `p3e.py`, `p3*.log`, `signmap149.json` (Part 3; `p3.py` and `p3b.py` were stopped before their last blocks, the inverse-Laplace sign count and the scans at `beta = 0.1, 0.02` above 400, which are not used). Run with `.venv-arb/bin/python -I`.
All runs single process, under 1 GB, each under 20 minutes.
