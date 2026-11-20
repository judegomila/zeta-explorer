# Target A: the relative coupling norm of the theta bridge

Lane `g-coupling-norm`, 2026-11-16. Scope: `tmp/research-2026-11-16/push/g-coupling-norm/` only. Nothing
committed, pushed or posted. No RH claim, no new zero-free region, no change to any Lambda bound.
Labels: PROVED (argument given here), CLASSICAL, MEASURED (ball arithmetic, python-flint/Arb, unless
stated otherwise), ARGUED (heuristic), OPEN.

## Verdict

**Precise obstruction, with an exact law.** The statement `||T|| <= 1` for the bridge coupling
`T = D^{-1/2} B E^{-1/2}` on the full admissible space is RH itself, and so is the strict statement
`||T|| < 1` on every finite split. The norm is not a quantity that can be bounded away from 1:

1. `1 - ||T||^2` factors exactly into a node-geometry factor (a Blaschke product) times a Schur-parameter
   factor that lies in `[0, 1]` exactly when the form is nonnegative (Theorem 2). So the coupling of xi is
   never smaller than the Hardy-space coupling of the same nodes, which does not depend on the function.
2. `1 - ||T||^2` is a Christoffel function of the zero-counting measure (Theorem 3). On bounded real
   node sets it obeys explicit two-sided bounds (Theorem 4):
   `log(1 - rho_N^2) = 2 sum_j log|x_j - y| - 4 sum_{k <= N/2} log gamma_k + O(N)`,
   i.e. `exp(-2N log N + 2N log log N + O(N))`. Interval-verified through N = 100.
3. A uniform margin `rho <= q < 1` along a nested real family forces the family to be a Blaschke sequence,
   i.e. a family on which Pick positivity does not determine `xi'/xi` (Theorem 5).
4. Every statement above holds for the Davenport-Heilbronn function with its own zeros, up to the order
   where its sign fails. That order is 149 on both bounded families (interval-certified negative pivot;
   orders 2 to 148 certified positive). Nothing in the law uses the Euler product. No reparametrization (Klein fold, torus parameter r, annulus reference,
   bridge/Pick presentation) changes any singular value of T.

What is left is stated in section 7. It is RH in the form "an indefinite Christoffel function is
nonnegative", at a relative scale that is at most geometric in N on every determining family.

## 0. Plan and what is new

Object: the log-Pick kernel of the theta bridge (PR 54/56, zeta-view `logPick`),

    F(z) = xi(1/2+z),  L = F'/F,  K(x,y) = (L(x)+L(y))/(x+y),  x, y > 0,

split into a frozen node set X and live nodes Y, `Q = [[P_X, B^T],[B, P_Y]]`, `T = P_Y^{-1/2} B P_X^{-1/2}`.
This is the width-zero limit of the finite-width bridge kernel: with `R_a(u) = F(u-a)/F(u+a)` one has
`1 - R_a(u_i) conj R_a(u_j) = 2a (L(u_i) + conj L(u_j)) + O(a^2)` (PROVED, Taylor), and the bridge and Pick
presentations are diagonally congruent (PR 56 audit). For one live node y,

    1 - rho(X;y)^2 = Delta_X(y) / K(y,y),   Delta_X(y) = K(y,y) - k^T P_X^{-1} k   (Schur complement).

| Prior item | Overlap | New here |
|---|---|---|
| PR 56 section 8, numeric/AUDIT.md | `S >= 0 iff ||T|| <= 1`; congruence invariance; seven sample values of rho | exact factorization of `1-rho^2`; exact law in N; which node families allow a margin |
| eq48 (refereed) | residual target == Weil == RH; margin theta<1 false | used as input for the RH status; the margin statement is made quantitative (how fast, and why) |
| euler lane | DH positive through order 100; twin horizon table, fit `N* = 0.150 gamma^1.441` | closed-form bounds for the pivots it measured; mechanism for the horizon; its table reproduced from one trial vector |
| Atlas sections 2, 8 | Schur/positive-real reformulations at fixed width | not re-run; only the width-zero kernel is used |
| Walls | DH, flow-blindness, MV-CAP, verified height | the law is proved DH-blind; order N is a statement about zeros of index about N/5 to N/2 |

Not attempted: a proof of the sign. This lane measures and proves the size and structure of the quantity
whose sign is RH.

## 1. RH status of `||T|| <= 1` (Target A, first question)

**Theorem 1.** Let X, Y range over disjoint finite subsets of (0, inf).

(i) (PROVED from eq48 Theorem 2 and 3.) RH holds iff `rho(X;y) <= 1` for every finite X with `P_X`
positive definite and every `y`. This is condition (a) of eq48 verbatim, since
`rho(X;y)^2 = 1 - Delta_X(y)/K(y,y)` and `K(y,y) = L(y)/y > 0` unconditionally (each zero pair contributes
`Re 2/(y^2 - w^2) > 0` because `|Im w| > |Re w|`).

(ii) (PROVED from eq48 Theorem 3.) Under RH, `rho(X,Y) < 1` strictly for every finite split. Conversely,
`rho < 1` on every finite split implies RH by (i). So strictness on each finite subspace is equivalent to
RH. It is not an unconditional fact. Unconditionally it is known only where certified: all node sets of
order <= 5 (PR 48/50/54), and the specific nested sets certified in section 3.

(iii) (PROVED.) `sup rho = 1` over splits of any fixed size: `rho(X;y) -> 1` as `y -> x_1`, and
Theorem 2 gives `rho^2 >= 1 - B_X(y)^2` whenever the form is nonnegative. No bound `rho <= q < 1` holds.

(iv) (PROVED, linear algebra.) For several live nodes, the singular values of T are the cosines of the
principal angles between `span{K(.,x)}_X` and `span{K(.,y)}_Y`; `rho(X,Y) >= max_y rho(X;y)`. One live
node is enough for (i).

Cross-check (MEASURED, interval): PR 56's log-Pick row (nodes .15, .35, .7, 1.2, first two frozen)
gives `rho = 0.999999999966380480 +/- 7e-19`, `1 - rho^2 = 6.7239041e-11`. PR 56 reported
0.99999999996638 and 6.72390410e-11.

## 2. Structure theorems

Throughout, `b_x(y) = (y-x)/(y+x)` and `B_X(y) = prod_j b_{x_j}(y)`.

**Theorem 2 (Schur-Blaschke factorization; PROVED, interval-checked).** Let `X = (x_1..x_N)`, y real,
distinct, with positive pivots (`P_{X_k}` positive definite for k <= N). Define the Richards iterates
`L_0 = L`, `l_k = L_{k-1}(x_k)`,

    L_k(z) = l_k (z L_{k-1}(z) - x_k l_k) / (z l_k - x_k L_{k-1}(z)),
    phi_k = [(L_{k-1}(y) - l_k)/(L_{k-1}(y) + l_k)] / b_{x_k}(y).

Then

    1 - rho(X;y)^2 = prod_{k=1}^N  b_{x_k}(y)^2 (1 - phi_k^2) / (1 - b_{x_k}(y)^2 phi_k^2).

If the Pick matrix of `X u {y}` is positive semidefinite, every `phi_k^2 <= 1`, and

    1 - rho(X;y)^2 <= B_X(y)^2.

For N = 1: `rho^2 = (1 - b^2)/(1 - b^2 phi_1^2)`.

Proof. Put `phi = (L - l_1)/(L + l_1)`, `g = 1/(1-phi)`. Then
`K(z,w) = 2 l_1 g(z) g(w) (1 - phi(z)phi(w))/(z+w)`, `phi(x_1) = 0`. With
`1/(z+w) - 2x_1/((z+x_1)(w+x_1)) = b(z)b(w)/(z+w)` the Schur complement on x_1 is
`2 l_1 g(z)g(w) b(z)b(w) (1 - phi_1(z)phi_1(w))/(z+w)`, `phi_1 = phi/b`, and
`L_1 = l_1 (1+phi_1)/(1-phi_1)` is the stated Richards transform. So the reduced kernel is again of the
form `G(z)G(w)(L_1(z)+L_1(w))/(z+w)`. At `z = w = y` the ratio of reduced to original diagonal is
`b^2 (1-phi_1^2)/(1-b^2 phi_1^2)`. Iterate. For the inequality: each ratio `r_k` is a Schur-complement
ratio of a PSD matrix, so `0 <= r_k <= 1`; `r_k = b^2(1-phi^2)/(1-b^2 phi^2) <= 1` with `b^2 < 1` excludes
`phi^2 > 1/b^2`, hence `phi_k^2 <= 1` and `r_k <= b_k^2`. QED.

Interval check: `check_product.py` (N = 5, 6; xi and DH; families A, B, C): product and LDL pivot overlap
to 12 digits. The inequality `pivot <= B_X(y)^2` holds at all 554 certified pivots of section 3.

Meaning. `B_X(y)^2` is the value of `1 - rho^2` for the Szego kernel `1/(x+y)` (Hardy space, `L` =
constant). It depends on the nodes only and is invariant under the conformal automorphisms of the
half-plane. The function enters only through the Schur parameters `phi_k(y)`. RH is the statement
`|phi_k(y)| <= 1` for all k, all nodes. For xi on bounded nodes the `phi_k` are within 1e-2 to 1e-5 of
+-1 with alternating sign (`check_product.json`); that is what makes the coupling so close to 1.

**Theorem 3 (Christoffel form; PROVED from eq48 Theorem 1 plus partial fractions).** For
`v = delta_y - sum c_j delta_{x_j}` put `V(z) = 1/(z+y) - sum c_j/(z+x_j) = prod_j(x_j - y) q(z) / ((z+y) prod_j (z+x_j))`.
The map `c -> q` is a bijection onto polynomials of degree <= N with `q(-y) = 1`. With W the zero set of F,

    Q(v) = sum_{w in W} V(w) V(-w)
         = prod_j (x_j - y)^2  sum_{w in W}  q(w) q(-w) / ((y^2 - w^2) prod_j (x_j^2 - w^2)),

and if `P_X` is positive definite, `Delta_X(y) = min_q Q`. Under RH, `w = i gamma` and

    1 - rho(X;y)^2 = (y/L(y)) prod_j (x_j - y)^2  lambda_N(mu_{X,y}; -y),
    mu_{X,y} = sum_gamma delta_{i gamma} / ((y^2+gamma^2) prod_j (x_j^2+gamma^2)),

where `lambda_N(mu; zeta) = min { int |q|^2 dmu : deg q <= N, q(zeta) = 1 }` is the Christoffel function.
Without RH the same formula holds with the indefinite form `q(w) q(-w)` on off-line quartets.

**Theorem 4 (two-sided bounds; PROVED under RH; interval-checked).** Let `gamma_1 < gamma_2 < ...` be the
positive ordinates, `m = floor(N/2)`, `M = floor(N/2) + 1`, and
`tau_m(y) = 1 - (y/L(y)) sum_{k<=m} 2/(gamma_k^2 + y^2)` in (0,1). Then

    1 - rho(X;y)^2 <= tau_m(y) prod_j (x_j - y)^2 / prod_{k<=m} (y^2 + gamma_k^2)^2,

    1 - rho(X;y)^2 >= (y/L(y)) prod_j (x_j - y)^2 /
                      [ prod_{k<=M} (y^2+gamma_k^2)^2  sum_{k<=M} prod_j (x_j^2+gamma_k^2) / (2 gamma_k^2 prod_{l<=M, l != k} (gamma_l^2-gamma_k^2)^2) ].

Proof. Upper: take `q = prod_{k<=m} (z^2+gamma_k^2)/(y^2+gamma_k^2)`. It vanishes at the first m pairs.
For `gamma > gamma_m`, `prod_k (gamma^2-gamma_k^2)^2 <= gamma^{4m} <= prod_j (x_j^2+gamma^2)` since
`N >= 2m`, so each remaining term is at most `prod_k (y^2+gamma_k^2)^{-2}/(y^2+gamma^2)`, and
`sum_{|gamma|>gamma_m} 1/(y^2+gamma^2) = (L(y)/y) tau_m`. Lower: with
`omega(z) = (z+y) prod_{k<=M}(z^2+gamma_k^2)` and `deg q <= N <= 2M-1`, the divided-difference relation
`sum_{omega(p)=0} q(p)/omega'(p) = 0` gives
`1/omega'(-y) = - sum_{+-,k} q(+-i gamma_k)/omega'(+-i gamma_k)`. Cauchy-Schwarz against `mu` and dropping
the nonnegative terms `gamma > gamma_M` gives the bound. QED.

Unconditional variant of the upper bound (ARGUED, two-line estimate, not interval-checked): if only
`P_X` positive definite is assumed and the m killed zeros are on the line (true for m <= 1e13), the same
bound holds with a factor `1 + O(1/H)`, H the verified height, because the Schur complement is at most
the trial value and off-line terms are bounded in absolute value.

Asymptotic form. With `gamma_k ~ 2 pi k / log k`:
`-4 sum_{k<=N/2} log gamma_k = -2N log N + 2N log log N + O(N)`. For nodes in a fixed compact set,

    log(1 - rho_N^2) = -2N log N + 2N log log N + O(N).

The upper bound in this form is PROVED under RH. The matching lower bound needs
`prod_{l != k}|gamma_l^2 - gamma_k^2| >= gamma_k^{2M} e^{-O(M)}` (zero-gap control); MEASURED: the gap
between pivot and either bound is at most 0.58 decades per node (upper) and 0.27 (lower) for N <= 100.

**Theorem 5 (a margin forces a non-determining family; PROVED).** Let `(x_j)` be a real nested sequence
with all Pick matrices PSD and `rho(X_{N-1}; x_N) <= q < 1` for all N. Then every dyadic shell
`[2^i, 2^{i+1})` contains at most `1 + (9/8) log(1/(1-q^2))` nodes, and `sum_j x_j/(1+x_j^2) < inf`
(Blaschke condition).

Proof. By Theorem 2, `prod_{j<N} b_{x_j}(x_N)^2 >= 1 - q^2`, so
`sum_{j<N} 4 x_j x_N/(x_j+x_N)^2 <= log(1/(1-q^2))`. Two nodes in one dyadic shell give a term >= 8/9.
QED.

Consequence. On a Blaschke sequence, Pick positivity of L follows from the existence of any positive-real
interpolant; Pick's uniqueness argument (eq48 (a'), euler (1.2)) does not apply. Every family for which
finite positivity is known to imply RH has `inf_N (1 - rho_N^2) = 0`, at least at the Hardy rate.

**Invariances (PROVED).** (a) Block-diagonal congruence `(S_X, S_Y)` leaves all singular values of T
unchanged (PR 56 section 8). This covers the Klein fold, the doubled cover, diagonal normalization, the
bridge/Pick presentations and the choice of annulus chart. (b) The torus parameter r does not enter K at
fixed spectral nodes; it can only select nodes. By Theorems 2, 4, 5 node selection changes the law only
through `prod (x_j-y)^2` and `prod (x_j^2+gamma^2)`, never below the Hardy value, and with a margin only on
Blaschke families. (c) Not invariant: mixing frozen and live coordinates (a different split), changing
the node set, changing the width a or heat time (a different kernel).

## 3. Measured law (interval arithmetic; motherbox CPU)

Nested families: A = van der Corput in log x on [0.01, 0.5] (the euler lane's family); B = same on
[0.6, 4] (rates > 1/2, absolutely convergent prime side); C = `x_j = 0.6 + 3(j-1)` (spread). Split: first
N-1 nodes frozen, node N live. `L` from Arb (`zeta` jets, Hurwitz jets for DH), 9000 bits (A, B),
6000 bits (C); LDL in ball arithmetic. Every pivot below is a certified enclosure with relative radius
< 1e-8, and all are positive: the Pick matrices of these node sets are positive definite, hence
`rho < 1` on these splits unconditionally (given Arb). Scripts: `lib.py`, `run_pivots.py`.

xi, `log10(1 - rho_N^2)` with the Theorem 4 bounds and the Hardy value `log10 B_X(y)^2`:

| order N | A: pivot | A: upper / lower | A: Hardy | B: pivot | B: upper / lower | B: Hardy | C: pivot | C: Hardy |
|---|---|---|---|---|---|---|---|---|
| 5 | -20.41 | -19.15 / -21.87 | -3.14 | -12.51 | -11.24 / -13.97 | -5.36 | -5.45 | -3.34 |
| 10 | -52.91 | -47.14 / -54.84 | -7.89 | -32.98 | -27.20 / -34.91 | -12.98 | -11.33 | -9.02 |
| 20 | -117.13 | -108.28 / -120.91 | -15.12 | -73.48 | -64.61 / -77.27 | -24.98 | -23.02 | -20.74 |
| 40 | -250.01 | -235.48 / -257.68 | -27.72 | -159.09 | -144.55 / -166.77 | -46.74 | -46.63 | -44.51 |
| 60 | -390.07 | -370.12 / -401.58 | -51.06 | -258.38 | -238.42 / -269.90 | -82.66 | -70.43 | -68.41 |
| 80 | -528.77 | -503.60 / -544.07 | -51.10 | -343.41 | -318.22 / -358.71 | -88.28 | -94.28 | -92.37 |
| 100 | -682.60 | -652.24 / -701.63 | -80.38 | -456.30 | -425.93 / -475.33 | -130.86 | | |

(Order N means N-1 frozen nodes. A at N = 100 is `2.5385641e-683 +/- 4.2e-691`; the euler lane's mpmath
value is 2.54e-683.) Both bounds of Theorem 4 hold as interval inequalities at all 277 xi pivots.

Findings.

* Bounded nodes (A, B): superexponential approach to 1, as Theorem 4 states. The Hardy value is larger by
  hundreds of decades. The whole excess is the product of the factors `(1-phi_k^2)/(1-b_k^2 phi_k^2)`.
* Spread nodes (C): `1 - rho_N^2 = D_N B_X(y)^2` with `D_N` between `10^-2.31` and `10^-1.57` for all
  N <= 80. The law is the Hardy law, geometric, about -1.19 decades per node, times a bounded factor.
  (ARGUED: C is not a Blaschke sequence, so positivity on C for all N should still be equivalent to RH,
  provided `L` is of bounded type in the half-plane; this was not checked.)
* Half/half splits (family B, charpoly roots in Arb): `log10(1-rho^2)` = -9.4, -23.2, -41.1, -56.3,
  -74.2, -86.7 at N = 4, 8, ..., 24. Same regime.
* Double precision: the float LDL pivot is wrong by more than 50% or non-positive from order 4 (A),
  6 (B), 12 (C). GPU float linear algebra uses the same arithmetic and cannot resolve this quantity at
  any useful size, so GPU 1 was not used. All numbers are from ball arithmetic on CPU.

## 4. Near-extremal vectors and the height horizon (MEASURED)

`extremal.py` solves `c = P_X^{-1} k` in Arb, forms `V`, and evaluates the share
`e_k = 2|V(i gamma_k)|^2 / Delta` of the Schur complement carried by zero k (Theorem 3 under RH; the first
400 zeros carry 0.90 to 0.99 of the total, the rest is the slowly decaying tail).

* The numerator polynomial `q` of the extremal vector has roots locked on the lowest zeros. Family B,
  16 frozen nodes: roots at `14.13473 i`, `21.0220 i`, `25.013 i`, then `30.87`, `37.17`, `49.68`, `82.2`, `270.3`
  (real parts 0 to 5.5), against zeros 14.134725, 21.022040, 25.010858, 30.4249, 32.9351, ...
* Shares with 40 frozen nodes (family B): `e_1 = 10^-49.3`, `e_2 = 10^-33.6`, ..., `e_9 = 10^-2.8`; the largest
  share is zero 12 (0.22). Over 8 to 96 frozen nodes (family A) the peak sits at index about N/3.4 and zeros of index
  below about N/5.5 carry less than 1e-6.
* So the order-N coupling statement is a statement about zeros of index roughly N/5 to N/2 and the tail.
  The vectors that bring `||T||` to 1 are the ones whose rational transform is blind to the lowest zeros.

Horizon. Moving zero pair k off the line by delta changes `Q(v)` on the same vector by the exact amount
computed in `extremal.py` (to first order `-4 delta^2 |V'(i gamma_k)|^2`). The first order at which xi's
own extremal vector makes the twin's form negative (delta = 0.3, family A):

| zero index k | 1 | 2 | 3 | 5 | 8 | 12 | 20 |
|---|---|---|---|---|---|---|---|
| this lane (one trial vector, upper bound for N*) | 7 | 12 | 15 | 24 | 35 | 50 | 81 |
| euler lane (first indefinite order N*) | 7 | 12 | 15 | 24 | 34 | 49 | 81 |

The twin fails as soon as a root of `q` has locked onto the moved zero. This replaces the power-law fit by
a mechanism: `N* ~ c x (index of the zero)`, with c near 4 in this table (81/20 = 4.05) and 3.4 to 3.5
for the two DH quartets of section 5; so `N*(gamma)` grows like `gamma log gamma`, not like a power
(ARGUED; an equal-spacing heuristic for when the locked root outweighs the tail gives c between 3.3
and 4).

## 5. Davenport-Heilbronn control

DH completion `Lambda(s) = (5/pi)^{s/2} Gamma((s+1)/2) f(s)`, Hurwitz form of f, kappa recomputed at
working precision (the euler lane's precision trap). Same families, same code path.

| order N | A: pivot (DH) | A: pivot (xi) | B: pivot (DH) | B: pivot (xi) | C: pivot (DH) | C: Hardy |
|---|---|---|---|---|---|---|
| 5 | -17.0 | -20.4 | -9.3 | -12.5 | -3.87 | -3.34 |
| 20 | -104.9 | -117.1 | -61.3 | -73.5 | -21.18 | -20.74 |
| 60 | -359.4 | -390.1 | -227.8 | -258.4 | -68.76 | -68.41 |
| 100 | -636.0 | -682.6 | -409.8 | -456.3 | | |

* DH is positive definite at every order in this table: A and B through N = 100 (in fact 148, below),
  C through N = 80 (interval). So `rho < 1` on all these splits for DH too.
* Theorems 2, 3 (indefinite form), and the upper bound of Theorem 4 with DH's own ordinates
  (5.0942, 8.9399, 12.1335, ...; 43 on-line ordinates below the first off-line zero at height 85.70) apply
  verbatim below the failing order. The DH pivots follow the same formula; the difference from xi is the lower ordinates.
  `pivot <= B_X(y)^2` holds at all 277 DH pivots.
* DH extremal vectors have the same structure: roots of q at `5.094160 i`, `8.9399 i`, `12.1338 i`
  (16 frozen nodes), peak share at zero 6.
* The step that fails for DH is the sign, and it fails late. `run_long.py` (L values at 14000 bits for A,
  12000 bits for B, LDL in ball arithmetic) carries both bounded families to order 260:

  | family | first non-positive pivot | value (certified enclosure) | all non-positive pivots to order 260 |
  |---|---|---|---|
  | A, [0.01, 0.5] | order 149 | `-9.2733573e-895 +/- 2.8e-903` | 149, 150, 218, 219 |
  | B, [0.6, 4] | order 149 | `-7.1640611e-618 +/- 4.3e-626` | 149, 150, 218, 219 |

  Orders 2 to 148 are certified positive in both families. So the 148-node DH Pick matrices are positive
  definite and the 149-node ones are indefinite (MEASURED, interval; the DH functional equation was
  checked in the same code to `|Lambda(s)/Lambda(1-s) - 1| < 4e-4210`). This answers the euler lane's
  question Q on these two families: every Pick statement of order <= 148 on them is true for DH.
* The two pairs of negative pivots match the two lowest off-line DH quartets: height 85.70 (43 on-line
  ordinates below it, index 44) and height 114.16 (literature value; 61 below, index 62). Ratios: 149/44 = 3.39,
  218/62 = 3.52. The failing order is the same in A and B: it is set by the index of the zero, not by
  the node interval. Before the runs the section 4 rule (4 x index) predicted 176; the measured constant
  for DH is 3.4 to 3.5, inside the heuristic range 3.3 to 4.

Conclusion of the control: the growth law of `||T||`, the extremal vectors, the Hardy ceiling and the
margin obstruction are all independent of the Euler product. They use the functional equation
(evenness of F), order-one Hadamard factorization, and the zero ordinates.

## 6. Does a reparametrization change the law?

No, for any family that determines RH.

* Klein fold, cover doubling, annulus chart, bridge versus Pick presentation: block-diagonal congruences.
  All singular values of T are unchanged (PROVED, PR 56; the factorization of Theorem 2 is expressed in
  congruence-invariant quantities).
* Torus parameter r, annulus reference `sech(kappa_n b)`: these do not enter K at fixed spectral nodes.
  A reference operator with coupling `rho_ref` and comparison error `beta` proves positivity only if
  `beta <= 1 - rho` in the normalized form; by Theorem 4 that needs relative accuracy
  `exp(-2N log N)` on bounded nodes and `B_X(y)^2 x 10^-2` on spread nodes.
* Node placement is the only real freedom. Spreading nodes (family C) changes the law from
  superexponential to geometric, with a bounded Schur-parameter factor. It cannot do better than
  geometric on a non-Blaschke family, and a uniform margin exists only on Blaschke families (Theorem 5).
* Complex nodes at height T (the zeta-view bridge views) follow the same Theorem 3 with zeros ordered by
  distance from the nodes; not measured here beyond the PR 56 cross-check.

## 7. What is left (sharpest correct statement)

RH is equivalent to each of:

* `|phi_k(y)| <= 1` for every Richards/Schur iterate at every real node configuration (Theorem 2);
* nonnegativity, for every N, every real X, y, of the indefinite Christoffel function
  `min_q sum_{w in W} q(w) q(-w) / ((y^2-w^2) prod_j (x_j^2-w^2))`, `deg q <= N`, `q(-y) = 1` (Theorem 3).

The quantity whose sign is needed has relative size at most `B_X(y)^2` and, on bounded nodes, exactly
`prod (x_j-y)^2 / prod_{k<=N/2} gamma_k^4` up to `e^{O(N)}`. It is carried by zeros of index about N/5 to
N/2. Hence:

* no norm estimate `||T|| <= 1 - eps(N)` with `eps(N)` above the Theorem 4 upper bound is true;
* any comparison or perturbation argument must be exact to that relative scale, at every order;
* at each finite order the statement is determined by finitely many low zeros plus a tail bound, so it is
  a verified-height statement, and it is DH-blind through order 148 on the bounded families (measured:
  first failure at order 149, about 3.4 times the index of the first off-line DH zero).

The Euler product would have to enter as a proof that the Schur parameters stay in the unit interval at
all orders simultaneously. Nothing in the coupling-norm formulation isolates it.

## 8. Three weakest steps

1. The `O(N)` in the asymptotic law is proved only on the upper side; the lower side is MEASURED to
   N = 100 and needs zero-gap control to be a theorem.
2. "Positivity on a non-Blaschke discrete family (family C) is equivalent to RH" is ARGUED (bounded-type
   property of `xi'/xi` not checked). Theorem 5 itself does not depend on it.
3. The horizon rule `N* ~ c x index` (c between 3.4 and 4) is read off nine data points plus a
   heuristic, and my pre-run prediction for DH (176) was 18% high; the trial-vector computation gives
   only an upper bound for N*. The DH failure order 149 is certified only for the two nested families
   run here, not as a minimum over all 149-node sets. The unconditional variant of the Theorem 4 upper bound
   was not interval-checked.

## Files

`lib.py` (Arb evaluation of `xi'/xi` and the DH log-derivative, nodes, LDL), `run_pivots.py`,
`run_long.py`, `extremal.py`, `checks.py`, `check_product.py`, `dh_zeros.py`; outputs in `data/`
(`piv_*.json`, `ext_*.json`, `checks.json`, `check_product.json`, `dh_zeros.json`, `long_*.json`).
Remote working directory: `~/rh-push/g-coupling-norm/` on the motherbox (CPU only, at most 7 processes).
