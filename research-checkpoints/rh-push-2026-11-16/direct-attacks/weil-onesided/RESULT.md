# One-sided Weil form: Euler-product structure, Nyman–Beurling link, low-pass cone

Slug: weil-onesided. Date: 2026-11-16. Scope: `tmp/research-2026-11-16/push/weil-onesided/` only.
Nothing here proves or refutes RH. Labels: PROVED (argument given here), CLASSICAL, MEASURED (mpmath/numpy,
not interval-certified), CONJECTURE, OPEN.

Notation (as in `eq48/RESULT.md`): `F(w) = xi(1/2+w)`, `L = F'/F`, centered zeros `rho = beta + i gamma`
(`|beta| < 1/2`), tests `v(t) = sum_j b_j e^{-x_j t}` on `t >= 0` with rates `x_j > 1/2`,
`V(z) = sum_j b_j/(z+x_j)`, `e_x(t) = e^{-xt}`,

    Q_L(v) = sum_{i,j} b_i conj(b_j) (L(x_i)+L(x_j))/(x_i+x_j) = sum_rho V(rho) conj V(-conj rho).

For real `v`: `Q_L(v) = sum_rho H(rho)` with `H(w) = V(w) V(-w)`.

## Verdict

**Precise obstruction, plus four proved statements.** No Euler-product sum-of-squares for `Q_L` exists in
`L^2(0,inf)`: the form vanishes identically on the Nyman–Beurling functions (Theorem B), which under RH are
`L^2`-dense, so `Q_L` is not closable there. What is proved:

1. **Theorem A (operator and Euler-local form).** `Q_L(v) = 2 Re <L(D) v, v>` with `D = -d/dt`; the prime term is
   `sum_p log p (||w_p||_p^2 - ||v||^2)`, where `w_p = (1 - p^{-1/2} S_{log p})^{-1} v` is the local Euler factor
   applied to `v`. Exact; no sign follows.
2. **Theorem B (sum of squares with defect, radical).** `Q_L(v) = sum_rho |V(rho)|^2 - (1/2) sum_rho |V(rho) - V(-conj rho)|^2`,
   and `Q_L(v + n) = Q_L(v)` for every one-sided Nyman–Beurling function `n`.
3. **Theorem C (exact link to Nyman–Beurling / Báez-Duarte; generalizes Burnol's lower bound to every target).**
   With `d_Lam(v)` the `L^2` distance from `v` to the span of the dilates `{theta/y}`, `e^{-Lam} <= theta <= 1`:

       liminf_{Lam -> inf} Lam d_Lam(v)^2 >= sum over distinct on-line zeros |V(rho)|^2,

   unconditionally. Under RH with simple zeros the right side is `Q_L(v)`. For `v = e_{1/2}` (the indicator of
   `(0,1)`) it is `2 + gamma - log 4 pi`, Burnol's constant. So `Q_L` is not a squared distance; it is the
   coefficient of `1/Lam` in the squared distance (lower bound proved, equality conjectured; equality for `e_{1/2}`
   is Bettin–Conrey–Farmer under RH plus a zero-spacing hypothesis). If some zero with `beta > 0` has
   `V(rho) != 0`, then `Lam d_Lam(v)^2 -> inf`.
4. **Theorem F (low-pass cone, unconditional, all orders).** `Theta(t) = sum_rho e^{rho^2 t} > 0` for all `t > 0`.
   Equivalently `Phi(u) = L(sqrt u)/sqrt u` is completely monotone on `(1/4, inf)`. Consequences: `Q_L(v) > 0`
   for every `v = e_{a_1} * ... * e_{a_M}` (`V = prod 1/(z+a_j)`, all `a_j > 1/2`, any `M`); for every finite node
   set `S` the Pick matrix `P_S` is positive on the divided-difference vector `b_j = prod_{k != j} (a_k - a_j)^{-1}`;
   Weil's functional is positive on every positive scale mixture of centered Gaussians. Input used: the zeros with
   `|gamma| <= 100` are on the line, and `|beta| < 1/2`. This cone has members of every Pick order and needs
   verified height only up to 100. **It is Euler-blind:** the same proof and the same numbers hold for DH.
5. **Theorem E (where `Lambda(n) >= 0` acts).** On pointwise nonnegative tests `v >= 0`, `Q_L(v) <= A(v)`, where
   `A` is the archimedean-plus-pole form. This uses `Lambda(n) >= 0`. It fails for DH (measured). It is an **upper**
   bound on the zero-side form; RH needs a lower bound on signed tests. It is the quadratic form of the mechanism
   behind the classical zero-free region.

So on one-sided tests the two available unconditional inequalities are: a lower bound on the low-pass cone
(no Euler product), and an upper bound on the nonnegative cone (Euler product). They do not combine into a
lower bound on any test that resolves a single high zero.

## 0. Plan and what is new relative to the atlas and the walls

Atlas (`refs/pr/27`, `historical-routes.md`) sections 9 and 11 cover arithmetic positivity and the gamma-bulk /
Suzuki scalar reserve for whole-line supported tests. `eq48/RESULT.md` identifies the residual target with the
one-sided Weil form. Round-3 synthesis lists a Heegner Nyman–Beurling span (H4', H5b) as a failed attempt. None of
them contains: the operator/Euler-local form of the one-sided prime term; the statement that Nyman–Beurling
functions lie in the radical of the one-sided form; a Burnol-type lower bound for arbitrary targets tied to `Q_L`;
or the complete monotonicity statement of Theorem F.

| Wall | How it shows up here |
|---|---|
| DH control | Theorems A (form), B, C, F hold verbatim for DH (Section 6). Only Theorem E uses `Lambda >= 0`, and it bounds `Q_L` from above. |
| Flow-blindness | Theorem F is a statement about `Theta(t)`, the heat trace over zeros; it is stable under the flow and gives no zero location. |
| MV-CAP | Theorem C is a mean-square (distance) statement; it bounds the on-line part from one side only. |
| Verified height | Theorem F uses height 100. It does not restate verified height `3e12`, and it does not strengthen with it. |

## 1. Theorem A: operator form and Euler-local form (PROVED)

Let `S_l v(t) = v(t+l)` (`l >= 0`) be the backward shift on `L^2(0,inf)`. `S_l e_x = e^{-xl} e_x`, `||S_l|| = 1`,
`S_l S_l^* = 1`, and `||S_l w||^2 = int_l^inf |w|^2`. Write `D = -d/dt`, so `S_l = e^{-lD}` and `D e_x = x e_x`.
For a function `f` analytic on `(1/2, inf)` define `f(D)` on the span of the `e_x` by `f(D) e_x = f(x) e_x`.
Since `<e_{x_i}, e_{x_j}> = 1/(x_i + x_j)`:

    Q_L(v) = 2 Re <L(D) v, v>.                                                   (A1)

With `s = 1/2 + x`: `L(x) = 1/s + 1/(s-1) - (log pi)/2 + psi(s/2)/2 - sum_n Lambda(n) n^{-s}`. Hence
`L(D) = Arch(D) - T`, with

    T = sum_n Lambda(n) n^{-1/2} S_{log n} = sum_p log p * U_p (1 - U_p)^{-1},   U_p = p^{-1/2} S_{log p}.

`||U_p|| = p^{-1/2} < 1`, so each local factor `(1 - U_p)^{-1} = sum_k U_p^k` is a bounded operator on `L^2(0,inf)`.
The sum over `p` converges on tests with rates `> 1/2`. For any contraction `U` with `||U|| < 1`,

    U(1-U)^{-1} + (1-U^*)^{-1} U^* = (1-U^*)^{-1} (1 - U^* U) (1-U)^{-1} - 1.

(Check: `(1-U^*)U + U^*(1-U) = 1 - U^*U - (1-U^*)(1-U)`.) So with `w_p = (1-U_p)^{-1} v = sum_k p^{-k/2} v(. + k log p)`:

    2 Re <T v, v> = sum_p log p ( ||w_p||^2 - p^{-1} int_{log p}^inf |w_p|^2 - ||v||^2 )
                  = sum_p log p ( int_0^{log p} |w_p|^2 + (1 - 1/p) int_{log p}^inf |w_p|^2 - ||v||^2 ).      (A2)

`w_p` is the local Euler factor at `p` applied to `v`. The pole term is `2 Re <(D - 1/2)^{-1} v, v>` with
`(D-1/2)^{-1} = int_0^inf e^{l/2} S_l dl` (positive density), and the gamma term is
`- int_0^inf e^{-l/2}/(1 - e^{-2l}) (S_l - 1) dl` up to the constant in `eq48` (negative density on shifts,
compensated). So

    L(D) = c + int_0^inf (S_l - [compensator]) d mu(l),   mu = (e^{l/2} + e^{-l/2}) dl - e^{-l/2}/(1-e^{-2l}) dl - sum_n Lambda(n) n^{-1/2} delta_{log n},

which is the explicit formula written as a superposition of backward shifts.

What the Euler product gives in this form:

* `Lambda(n) >= 0` makes `T` positivity-preserving: `v >= 0` implies `T v >= 0`, and `|<T v, v>| <= <T |v|, |v|>`.
* The per-prime bracket in (A2) has no sign (it is `2 Re <U(1-U)^{-1} v, v>`; numerically negative for
  `p = 3, 5, 7, 101` and positive for `p = 2` on the test in `c1_identities.py`).

MEASURED (`c1_identities.py`, 40 digits): (A2) per prime agrees to `5e-41`; (A1) agrees with the Pick form to all
digits.

## 2. Theorem B: sum of squares with defect; the Nyman–Beurling radical (PROVED)

**(B1)** For every `v` in the class, using `a conj(b) + b conj(a) = |a|^2 + |b|^2 - |a-b|^2` on the pair
`rho, -conj rho`:

    Q_L(v) = sum_rho |V(rho)|^2 - (1/2) sum_rho |V(rho) - V(-conj rho)|^2.          (B1)

Both sums converge absolutely (`|V(rho)| <= B/|gamma|`). The second sum runs over off-line zeros only, and
`|V(rho) - V(-conj rho)| = |int_{-beta}^{beta} V'(sigma + i gamma) d sigma|`. So `Q_L = ||R v||^2 - (1/2)||Delta v||^2`
with `R` = evaluation at all zeros and `Delta` = difference across the reflection `rho -> -conj rho`. RH is
`Delta = 0`.

**(B2)** Let `n(y) = sum_theta c_theta {theta/y}`, finite sum, `0 < theta <= 1`, `sum c_theta theta = 0`. Then `n`
vanishes on `y > 1`, and for `0 < Re s < 1`

    int_0^1 n(y) y^{s-1} dy = - zeta(s) A(s)/s,   A(s) = sum c_theta theta^s.       (CLASSICAL)

In the variable `u = -log y`, `g_n(u) = n(e^{-u}) e^{-u/2}` is a one-sided test with Laplace transform
`N(z) = -zeta(1/2+z) A(1/2+z)/(1/2+z)`, analytic on `Re z > -1/2`, which contains every centered zero. `N` vanishes
at every zero to the order of the zero. Therefore every term of the zero-side bilinear form
`sum_rho V(rho) conj N(-conj rho)` and of `sum_rho N(rho) conj N(-conj rho)` is zero:

    Q_L(v + n) = Q_L(v)   for all v in the class and all such n.                   (B2)

Consequence. Under RH the functions `n` are dense in `L^2(0,1)` (Nyman–Beurling). Then every `v` is an `L^2`-limit
of functions `n_k` with `Q_L = 0`; the differences `v - n_k` tend to 0 in `L^2`, have `Q_L(n_k - n_l) = 0`, and
`Q_L(v - n_k) = Q_L(v) > 0`. So `Q_L`, on the domain (exponential sums) + (Nyman–Beurling functions), is not a
closable form on `L^2(0,inf)`, and on that domain there is no `L^2`-closable operator `A` with
`Q_L(v) = ||A v||^2`. (Non-closability on the exponential sums alone is not proved here.) Any sum-of-squares representation has to factor
through the restriction to the zeros (under RH it is `R`). This is the precise obstruction to item (2) of the
brief. The mollifier enters through Theorem C instead.

## 3. Theorem C: `Q_L` and the Nyman–Beurling distance (PROVED lower bound; CONJECTURE equality)

Setting. `phi_v(y) = y^{-1/2} v(-log y)` on `(0,1)`, zero on `y >= 1`. Its Mellin transform is
`F(s) = V(s - 1/2)`. `phi_v` for `v = e_{1/2}` is the indicator of `(0,1)`. Let

    NB_Lam = span{ y -> {theta/y} : e^{-Lam} <= theta <= 1 }  in L^2((0,inf), dy),
    d_Lam(v) = dist(phi_v, NB_Lam).

The Báez-Duarte span (`theta = 1/k`, `k <= N`) is contained in `NB_{log N}`. By Plancherel on `Re s = 1/2`,
`d_Lam(v)^2 = inf_A (1/2 pi) int |F(s) + zeta(s) A(s)/s|^2 dt`, over `A(s) = sum c_theta theta^s`.

**Dual vector.** Fix a zero `rho_s = 1/2 + i gamma` of zeta (centered `rho = i gamma`). Let
`chi(s) = pi^{s-1/2} Gamma((1-s)/2)/Gamma(s/2)` (so `zeta(s) = chi(s) zeta(1-s)`), `p(s) = (s-1)/s`,
`q(s) = s^2/(s-1)^2`, and

    Psi(s) = [ p(s)/p(rho_s) - e^{Lam (s - rho_s)} chi(rho_s) q(s) / (chi(s) q(rho_s)) ] / (s - rho_s),
    l(G) = (1/2 pi i) int_{Re s = 1/2} G(s) Psi(s) ds.

On `Re s = 1/2`: `|p| = |q| = |chi| = 1`, the bracket vanishes at `rho_s`, so `Psi` is continuous and
`|Psi(1/2+it)| <= 2/|t - gamma|`. `Psi` is in `L^2` of the line.

**Lemma C1 (annihilation; uses only the functional equation).** `l(zeta A/s) = 0` for every finite
`A(s) = sum c_theta theta^s` with all `theta` in `[e^{-Lam}, 1]`.

*Proof.* `G Psi` is analytic near `rho_s`; move the contour to pass to the left of `rho_s` and split the bracket.
First part: `zeta(s) A(s) (s-1) / (s^2 (s - rho_s) p(rho_s))`. It is analytic for `Re s >= 1/2` to the right of
the contour: the pole of zeta at 1 is cancelled by `s - 1`, and `zeta(rho_s) = 0` cancels `s - rho_s`. `|A| <= sum |c_theta|`
for `Re s >= 0` since `theta <= 1`. The integrand is `O(|s|^{-2+1/4})` in vertical strips and `O(|s|^{-2})` for
`Re s >= 2`. Moving the line to `Re s = R -> inf` gives 0.
Second part: `zeta(s)/chi(s) = zeta(1-s)`, so the integrand is
`const * zeta(1-s) * [A(s) e^{Lam s}] * s / ((s-1)^2 (s - rho_s))`. To the left of the contour: the pole of
`zeta(1-s)` at `s = 0` is cancelled by the factor `s`; `zeta(1 - rho_s) = 0` cancels `s - rho_s`;
`|A(s) e^{Lam s}| = |sum c_theta (theta e^{Lam})^s| <= sum |c_theta|` for `Re s <= 0` since `theta e^{Lam} >= 1`.
The integrand is `O(|s|^{-2+1/4})` in strips and `O(|s|^{-2})` for `Re s <= -1`. Moving the line to
`Re s = -R -> -inf` gives 0. ∎

By continuity (`Psi` in `L^2`), `l` vanishes on the closure of `NB_Lam`. No condition `A(1) = 0` is needed.

**Lemma C2 (value on the target).** Let `F` be analytic on `Re s > 1/2 - delta_0`, `|F(s)| <= B/|s|` there
(true for `F = V(s-1/2)` with `delta_0 = min x_j - 1/2`; for `e_{1/2}` take any `delta_0 < 1/2`). Then for
`0 < delta < min(delta_0, 1/2)`: `l(F) = -F(rho_s) + O_delta(e^{-Lam delta})`.

*Proof.* Same contour. First part: close to the right; the only pole enclosed is `s = rho_s`, clockwise, giving
`-F(rho_s)`. Second part: move left to `Re s = 1/2 - delta`; no pole is crossed (`1/chi` is analytic for
`Re s > 0`, and `|1/chi(s)| ~ |t/2 pi|^{-delta}`), and `|e^{Lam(s - rho_s)}| = e^{-Lam delta}`. ∎

**Lemma C3 (norm and Gram).** `(1/2 pi) int |Psi(1/2+it)|^2 dt = Lam + O(log Lam)`. For two distinct on-line
zeros the cross term `(1/2 pi) int Psi_j conj(Psi_k) dt` is `O(log Lam)`.

*Proof.* On the line, `|Psi|^2 = (2 - 2 cos theta(t))/(t-gamma)^2` with `theta(t) = Lam (t - gamma) + eta(t)`,
`eta` smooth, `eta(gamma) = 0`, `|eta'| <= M` on `|t - gamma| <= 1`. `int (2 - 2cos(Lam tau))/tau^2 d tau = 2 pi Lam`.
`|cos(Lam tau + eta) - cos(Lam tau)| <= |eta| min(1, Lam |tau|) + eta^2/2`, so the difference contributes at
most `int_{|tau|<=1} (2M min(1, Lam|tau|)/|tau| + M^2) d tau + int_{|tau|>1} 4/tau^2 = O(log Lam)`. Cross term:
`|Psi_j| <= min(Lam + M, 2/|t - gamma_j|)`, which gives `O(log Lam)`. ∎

**Theorem C.** For `F` as in Lemma C2 and any finite set `Z` of distinct on-line zeros,

    d_Lam(v)^2 >= ( sum_{rho in Z} |V(rho)|^2 ) / Lam * (1 + O_Z(log Lam / Lam)).

Hence `liminf Lam d_Lam(v)^2 >= sum over distinct on-line zeros |V(rho)|^2`. If a zero with `beta > 0` has
`V(rho) != 0`, then `liminf d_Lam(v)^2 >= c_rho |V(rho)|^2 > 0` with `c_rho = 2 beta |rho_s - 1|^2/|rho_s|^2`
(the classical Nyman–Beurling direction), so `Lam d_Lam(v)^2 -> inf`.

*Proof.* For `n` in `NB_Lam` and coefficients `a_j`: `sum_j conj(a_j) l_j(F) = sum_j conj(a_j) l_j(F - n)`, so by
Cauchy–Schwarz `|sum conj(a_j) l_j(F)|^2 <= ||phi_v - n||^2 * a^* Gram a`, with `Gram = Lam I + O(log Lam)`.
Optimize over `a`. The off-line statement: for `Re rho_s = 1/2 + beta` the same `Psi` gives `l(F) -> -F(rho_s)`,
and `(1/2 pi) int |Psi|^2 -> 1/(2 beta |p(rho_s)|^2)` (the exponential term is `O(e^{-Lam beta})` on the line). ∎

**Corollary C4.** (i) RH and simple zeros imply `liminf Lam d_Lam(v)^2 >= Q_L(v) > 0` for all `v != 0` in the
class. (ii) `Q_L(e_{1/2}) = sum_rho 1/(rho_s (1 - rho_s)) = 2 + gamma - log 4 pi = 0.0461914...`, so for the
indicator target this is Burnol's lower bound (Adv. Math. 2002, there with multiplicities `m^2`; the vector here
gives `m^0`, i.e. distinct zeros, which is weaker when a multiple zero exists). (iii) Unconditionally,

    Q_L(v) = sum_{on-line} m_rho |V(rho)|^2 + sum_{off-line quartets} 4 Re[ V(rho) conj V(-conj rho) ],

and Theorem C bounds only `sum_{on-line, distinct} |V(rho)|^2` (from above, by `liminf Lam d_Lam(v)^2`). The
off-line part is not controlled, so Theorem C carries no sign information on `Q_L`.

**Conjecture C5.** `lim Lam d_Lam(v)^2 = sum_rho m_rho^2 |V(rho)|^2` (under RH) for every `v` in the class.
For `v = e_{1/2}` and integer dilations this is the Báez-Duarte–Balazard–Landreau–Saias conjecture, proved by
Bettin–Conrey–Farmer under RH and a bound on `sum 1/|zeta'(rho)|^2`.

Remark (integer dilations are not enough for other targets; PROVED). Every element of
`span{ {1/(ky)} : k in N }` is `C/y` minus a step function with jumps in `{1/m}`; this set is a closed proper
subspace. So for `x != 1/2` the Báez-Duarte distance of `e_x` tends to a positive limit (MEASURED:
`c4_nb_distance.py`, `d_N^2 = 0.0313` for `x = 3` at `N = 400`, flat). Real dilations are needed, as in `NB_Lam`.

MEASURED.
* `c2_burnol_functional.py`: with `Lam = log 6`, five dilations `theta in {1, 1/2, 0.37, 1/5, 1/6}` and no
  condition `A(1) = 0`: `l(zeta A/s) = 3e-6` (truncation level; `||G|| = 1.23`). `l(F) -> -F(rho)`: Section 7.
* `c4b_nb_distance_real_dilations.py`: dilations `theta = a/q`, `a = 1..q` (a subset of `NB_{log q}`), Gram matrix
  from Vasyunin's formula (validated against direct integration to `2e-8`). Ratio `d_q^2 log q / Q_L(v)`:

| target | q=100 | q=400 | q=1500 | Q_L |
|---|---|---|---|---|
| `e_{1/2}` | 1.365 | 1.298 | 1.184 | 4.619e-2 |
| `e_3` | 1.270 | 1.261 | 1.166 | 4.556e-2 |
| `e_20` | 1.094 | 1.135 | 1.096 | 3.333e-2 |
| `e_1 - 2 e_2` | 1.299 | 1.264 | 1.168 | 4.584e-2 |
| `e_1 - e_2` | 19.5 | 4.28 | 1.64 | 7.293e-5 |
| `e_1 - 2e_2 + e_3` (x 1/2) | 752 | 145 | 24.8 | 2.707e-7 |
| `e_{0.6} - e_{0.9}` | 149 | 19.9 | 4.94 | 6.661e-6 |

  Every ratio is above 1 (as Theorem C requires, since the computed zeros are simple and on the line) and decreases
  with `q`. The targets whose `Q_L` is `1e-5 .. 1e-7` have distances that fall by orders of magnitude towards
  `Q_L/log q`. This supports C5 at the level of scaling; it does not determine the limit.

## 4. Theorem F: the low-pass cone (PROVED, unconditional)

Input (CLASSICAL): (i) `|beta| < 1/2` for every centered zero; (ii) every zero with `|gamma| <= 100` is on the
line, and the first has `gamma_1 = 14.1347...`; (iii) `N(T) <= T log T` for `T >= 2`.

**Theorem F.** For every `t > 0`,

    Theta(t) := sum_rho e^{rho^2 t} >= 2 e^{-gamma_1^2 t} (1 - 1e-60) > 0.

*Proof.* The series converges absolutely for `t > 0`. On-line pairs contribute `2 e^{-gamma^2 t} > 0`. An off-line
quartet `{+-beta +- i gamma}` contributes `4 e^{(beta^2 - gamma^2) t} cos(2 beta gamma t)`. This is negative only
if `2 beta gamma t > pi/2`, hence only if `t > pi/(2 gamma)`. In that case

    4 e^{(beta^2-gamma^2)t} / (2 e^{-gamma_1^2 t}) <= 2 exp(-(gamma^2 - gamma_1^2 - 1/4) t) <= 2 exp(-(pi/2)(gamma - (gamma_1^2 + 1/4)/gamma)).

The bound does not depend on `t`. Off-line quartets have `gamma > 100`, so the total negative part is at most
`2 e^{-gamma_1^2 t}` times `sum_{gamma > 100} 2 exp(-(pi/2)(gamma - 2.01))`, and by (iii) and partial summation
this sum is below `pi int_{100}^inf T log T e^{-(pi/2)(T - 2.01)} dT < 1e-60`. ∎

**Corollary F1 (complete monotonicity).** `Phi(u) := L(sqrt u)/sqrt u = sum_rho 1/(u - rho^2) = int_0^inf e^{-ut} Theta(t) dt`
for `u > 1/4`. So `(-1)^n Phi^{(n)}(u) > 0` for all `n >= 0`, `u > 1/4`: `Phi` is completely monotone. In Pick
terms `Phi(a^2) = K(a,a)`.

**Corollary F2 (all-order tests with positive form).** Let `a_1, ..., a_M > 1/2` (repetitions allowed) and
`v = e_{a_1} * ... * e_{a_M}` (convolution on the half-line), `V(z) = prod_j 1/(z + a_j)`. Then

    Q_L(v) = sum_rho prod_j 1/(a_j^2 - rho^2) = int_0^inf Theta(t) k(t) dt > 0,

where `k >= 0` is the convolution of the densities `e^{-a_j^2 t}`. More precisely
`Q_L(v) >= (1 - 1e-60) * 2 |V(i gamma_1)|^2`. For distinct `a_j`, `v = sum_j b_j e_{a_j}` with
`b_j = prod_{k != j} (a_k - a_j)^{-1}`, so: **for every finite node set `S` in `(1/2, inf)` the Pick matrix
satisfies `b_S^T P_S b_S > 0` on the divided-difference vector `b_S`.** These `v` are exactly the elements of the
`M`-dimensional test space with `v(0) = v'(0) = ... = v^{(M-2)}(0) = 0`.

**Corollary F3 (Hankel family and Gaussian mixtures).** For `u_i > 1/8` and real `c_i`:
`sum_{i,j} c_i c_j Phi(u_i + u_j) = int Theta(t) (sum c_i e^{-u_i t})^2 dt >= 0`. For every positive measure `kappa`
on `(0, inf)` with `int e^{t/4} d kappa < inf`, the even test `h` with transform `H(w) = int e^{w^2 t} d kappa(t)`
(a positive scale mixture of centered Gaussians) has Weil functional `sum_rho H(rho) = int Theta d kappa > 0`.

Status of this cone:

* It is convex in `H` and contains tests of every Pick order `M`. It is not a consequence of any fixed finite
  Pick order.
* It uses verified height only up to 100 (the proof works with any height above about 20). Verified height `3e12`
  adds nothing to it.
* It gives no zero-location information: `Theta(t)` is dominated by the first zero for every `t` at which an
  off-line quartet could be negative. These tests are low-pass; none isolates a zero at height `gamma` from the
  lower ones.
* It is Euler-blind (Section 6). I did not find it in the atlas. The Gaussian case is likely known to
  specialists; I do not claim novelty beyond the formulation and the Pick/divided-difference corollary.

MEASURED (`c1_identities.py`): for random node sets with `M = 2 .. 40` in ranges from `[0.51, 2]` to `[5, 60]`,
the Pick double divided difference (up to 500 digits) equals the zero sum over 200 zeros to relative `1e-22` or
better for `M >= 8`, and `Q_L / (2|V(i gamma_1)|^2)` is between 1.0000 and 1.49.

## 5. Theorem E: the inequality that uses `Lambda(n) >= 0` (PROVED; wrong direction for RH)

Write `Q_L(v) = A(v) - 2 Re <T v, v>`, `A(v) = 2 Re <Arch(D) v, v>` (pole plus gamma; `E_gamma + pole - 2 c_0 ||v||^2`
in `eq48`). If `v >= 0` pointwise on `[0, inf)`, then `<T v, v> = sum_n Lambda(n) n^{-1/2} C_v(log n) >= 0`
because `C_v >= 0` and `Lambda >= 0`. Hence

    Q_L(v) <= A(v)          for all pointwise nonnegative v in the class,              (E1)
    Q_L(v) >= A(v) - 2 <T|v|, |v|>     for all v (|v| need not be an exponential sum).  (E2)

(E1) with Theorem F: for `v = e_{a_1} * ... * e_{a_M}` (which is `>= 0`): `0 < Q_L(v) <= A(v)`.
(E1) is the quadratic counterpart of `-zeta'/zeta(sigma) > 0`, the input of the classical zero-free region
(nonnegative trigonometric weight times a decaying exponential). It bounds the zero-side form from above.
RH needs `Q_L >= 0` on signed tests, where `<T v, v>` has no sign and (E2) loses the cancellation in `C_v`.

## 6. DH control

DH: `f = ((1 - i kappa)/2) L(s, chi) + ((1 + i kappa)/2) L(s, conj chi)`, `chi` mod 5, as in `euler/dh.py`.
`L_DH(x) = (1/2) log(5/pi) + (1/2) psi((s+1)/2) + f'/f(s)`, `s = 1/2 + x`.

MEASURED (`c3_dh.py`, `c6_dh_more.py`, `c5_dh_prime_sign.py`).

1. Zero list to height 200: 122 on-line zeros (sign changes of `Lambda_DH(1/2+it)`, grid 0.02, python-flint),
   first at `5.0942`; four off-line zeros with `Re s > 1/2` at `0.808517+85.699348i`, `0.650830+114.163343i`,
   `0.574356+166.479306i`, `0.724258+176.702461i`. Count `122 + 8 = 130`; main term of `N(200)` is `129.5`.
2. Completeness: on a four-rate test with `V ~ z^{-4}`, the Pick form with `L_DH` is `1.26505678993e-6` and the
   zero sum over this list is `1.26505678991e-6` (relative difference `1.4e-11`).
3. Theorem F for DH: PF tests with `M = 2, 6, 12, 20` and nodes in `[1.6, 40]` have `Q_DH > 0` and
   `Q_DH/(2|V(i gamma_1)|^2) = 1.263, 1.0070, 1.00018, 1.0057`. Heat trace: `Theta_DH(t) e^{gamma_1^2 t}` has
   on-line part `92.2, 20.8, 4.32, 2.01` and off-line quartet part `3.44, 2.7e-3, 5.7e-32, 3e-318` at
   `t = 1e-4, 1e-3, 1e-2, 1e-1`; the quartet part is negative only where it is below `1e-90`.
4. A negative one-sided test for DH. `V(z) = W(z) (z+2)^{-M}`, `W(z) = prod (z^2 + gamma_k^2)` over the 122
   on-line ordinates below 200 (degree 244; `W` is defined with the exact ordinates, so those terms vanish
   identically; the remaining terms are evaluated with 25-digit zeros). Smallest `M` with a negative sum and a tail
   bound below a tenth of it: `M = 247`, with

       Q_DH(v) / |V(w_0) V(-conj w_0)| = -0.776   (first quartet -0.776; other quartets < 2e-54; zeros above 200 <= 5e-4, envelope bound).

   At `M = 438` the ratio is `-3.999998` (the extreme value `-4`). So DH violates the one-sided target with a
   single confluent node `a = 2` at order 247. In (B1) on this test (normalized):
   `sum |V(rho)|^2 = 4.0034`, `(1/2) sum |V(rho) - V(-conj rho)|^2 = 4.7798`, difference `-0.7763`.


Which step breaks, per form:

| Form | DH status | Step that uses the Euler product |
|---|---|---|
| (A1) `Q = 2 Re <L(D) v, v>` | holds | none |
| (A2) local Euler factors | no analogue: `-f'/f = sum lam(n) n^{-s}` with signed `lam(n)` on all `n` coprime to 5 (`lam(2..9) = 0.197, -0.312, -1.442, 0, 1.936, 0.553, 0.016, -2.286`); `T` is not a sum of local resolvents and is not positivity-preserving | Euler product |
| (B1) squares with defect | holds; the defect term is nonzero and wins on the test of item 4 | none |
| (B2), Theorem C | hold with `f` in place of zeta (Lemma C1 uses only the functional equation and bounded `A`) | none |
| Theorem F | holds, with strip half-width `b` in place of `1/2` and nodes `> b` (MEASURED inputs: first DH zero `5.094` on the line, first off-line quartet at height `85.70`; the bound `exp(-(pi/(4b))(gamma - (gamma_1^2+b^2)/gamma))` is below `1e-19` for `b = 1.5`) | none |
| (E1) `Q <= A` on `v >= 0` | **fails**: `-f'/f(s) < 0` for real `s <= 2.5` (table below), so already `v = e_x`, `x <= 2`, violates it | `Lambda(n) >= 0` |

`-zeta'/zeta(s)` vs `-f'/f(s)` at `s = 1/2 + x` (`c5_dh_prime_sign.py`):

| x | 0.6 | 1.0 | 1.5 | 2.0 | 3.0 | 5.0 |
|---|---|---|---|---|---|---|
| zeta | 9.441 | 1.505 | 0.570 | 0.289 | 0.100 | 0.0186 |
| DH | -0.1335 | -0.0741 | -0.0326 | -0.0115 | 0.0029 | 0.0030 |

So the single place where zeta and DH separate in this note is the sign of the prime term on nonnegative tests,
and that inequality points away from RH.

## 7. Numerical record

* `c1_identities.py`: (A2) per prime to `5e-41`; PF tests for zeta (Section 4).
* `c2_burnol_functional.py`, `c2b_lF.py`: `l(zeta A/s) = (3.0e-6, -1.9e-6)` with the decaying variant (`k = 2`,
  `|t| <= 150`) and `(4.4e-4, -0.7e-4)` with the proof vector (`k = 0`, `|t| <= 400`, integrand `~ t^{-7/4}`, so
  this is truncation size); `||G|| = 1.23`. `l(F) + F(rho)` for `F = V(s - 1/2)`, rates `(0.8, 1.7)`,
  `|F(rho)| = 0.105`: `(7.7e-3, -1.4e-2)` at `Lam = 2`; `(-1.19e-3, 8.5e-5)` at `Lam = 10, 20, 40`. The constant
  `-1.19e-3` equals the truncated tail of the non-oscillating part, `-(sum b) * 2/400/(2 pi) = 1.19e-3` in modulus,
  so the limit is `-F(rho)` to the accuracy of the quadrature.
* Same script: control with one dilation `theta = 1/9 < e^{-Lam}`: `l = (-0.158, 0.182)`, not zero, as expected.
  Norm of the proof vector at the first zero: `(1/2 pi) int |Psi|^2 = Lam + 0.8255` at `Lam = 5, 20, 80`
  (tail `|t - gamma| > 40` replaced by its mean), consistent with Lemma C3 (the measured error term is `O(1)`).
* `c3_dh.py`, `c6_dh_more.py`, `c5_dh_prime_sign.py`: Section 6.
* `c4_nb_distance.py`, `c4b_nb_distance_real_dilations.py`: Section 3.

All runs: single process, under 1 GB, each under 10 minutes.

Scripts (all in this directory; run with `.venv-arb/bin/python -I`): `c1_identities.py`, `c2_burnol_functional.py`,
`c2b_lF.py`, `c3_dh.py`, `c4_nb_distance.py`, `c4b_nb_distance_real_dilations.py`, `c5_dh_prime_sign.py`, `c6_dh_more.py`.
Data: `dh_zeros_200.json`.

## 8. What remains open

* Equality in Theorem C (Conjecture C5) for general targets, even under RH.
* Any lower bound for `Q_L` on a test that is not low-pass. By Theorem B and Theorem C such a bound cannot come
  from an `L^2`-closable square. By Section 6 it has to use the Euler product in a way other than
  `Lambda(n) >= 0` on nonnegative tests.
* Whether (A2) can be combined across primes (it is exact per prime; the brackets have no sign).

## 9. Three weakest steps

1. **Lemma C3 / Theorem C error terms.** The `O(log Lam)` Gram bound is proved by the direct estimate above; the
   constant depends on the chosen finite set `Z` (through `eta'` near each `gamma_j` and the gaps). The liminf
   statement is unaffected. The claim about multiplicity (distinct zeros only) is deliberately weak. The numeric
   check of Lemma C1 used an auxiliary decaying variant of `p, q` (`k = 2`) for a small truncation error; the
   `k = 0` vector is the one in the proof.
2. **Theorem F input (ii)–(iii).** The constant `1 - 1e-60` uses on-line zeros to height 100 and the crude count
   `N(T) <= T log T`. Both are classical; I did not re-verify the height-100 statement here. The DH version relies
   on a measured zero list (sign changes on a grid of step 0.02 plus four off-line zeros from Spira's list,
   cross-checked by the Pick-vs-zero-sum identity), not a certified one.
3. **Conjecture C5 and the measured ratios.** Ratios `1.1 .. 25` at `q = 1500` are far from 1 for the small-`Q_L`
   targets. The grid `theta = a/q` is a subset of `NB_{log q}`, and double precision limits `d^2` below about `1e-7`.
   The table supports the direction and scaling of Theorem C, not the constant of C5.
