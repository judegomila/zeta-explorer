# stack-quantum-gap: the Nehari gap for the anticausal Hankel block Gamma_- of S = N/D

Date 2026-11-16. Slug: stack-quantum-gap. Scope: this directory only. Follow-up to stack-combinator Plan 2.
Nothing here proves or refutes RH; no zero-free region, density bound or Lambda bound changes.
Labels: PROVED (argument given here, author-checked only), CLASSICAL, LANE (proved in a named lane),
MEASURED (floating point, not interval-certified), HEURISTIC, OPEN.

## Verdict

**The dichotomy is a theorem, the uniform gap is not, and the weaker norm does not avoid MV-CAP.**

1. **Quantum inequality (Theorem 1, PROVED, three lines, no Sarason step).** If `S = S_0/B` with `B` the
   Blaschke product of the poles `z_j` of `S` in `Re z > 0` and `S_0` inner, then for every `h` in `H^inf(Re z > 0)`
   and every `j`:
   `|S_0(z_j)| <= Poisson average at z_j of |S - h| <= ||S - h||_inf`.
   Hence `||Gamma_-|| = dist(S, H^inf) >= max_j |S_0(z_j)|`, with equality when there is one pole. The step (Q) of
   stack-combinator is correct. The norm class that suffices is a **Poisson-weighted L^1 average at the pole**,
   weaker than sup and weaker than BMO.
2. **No uniform gap (Theorem 3, PROVED for an explicit family in class (H)).** For
   `F(w) = cosh(Lam w)(w^2 - beta^2)` (on-line zeros of density `Lam/pi`, one off-line pair at distance `beta`)
   `||Gamma_-|| = alpha/((1+alpha Lam)^2 sqrt(beta^2 + a^2))`, `a = alpha/(1+alpha Lam)`, up to a relative error
   `O(e^{-2 Lam x})`. So `sup_alpha ||Gamma_-|| <= 1/(4 beta Lam)` when `beta Lam > sqrt 2`, attained at
   `alpha = 1/Lam`. The infimum of the nonzero values of `||Gamma_-||` over the class is 0. A statement
   "`Gamma_- = 0` or `||Gamma_-|| >= g(alpha)`" with `g` independent of the height is **false**.
3. **alpha -> infinity (Theorem 4, PROVED).** The quantum of a pole tends to 1 if the pole tends to a critical
   point of `f` on the axis with `f f'' > 0` (a Laguerre violation) and to 0 otherwise. In the sea model the
   threshold is exactly `beta Lam = sqrt 2`. The gap tends to 1 only for off-line zeros closer to the line than
   `sqrt 2/Lam = 2 sqrt 2/log(T/2 pi)`, i.e. those already visible as a positive minimum of `|f|` on the line.
4. **With the 7/8 input (`beta <= 3/8`).** Model gap `g(T) = sup_alpha q = 2/(3 Lam) = 4/(3 log(T/2 pi))` once
   `log(T/2 pi) > 7.54` (`T > 1.2e4`): 0.111 at `T = 1e6`, 0.050 at `3e12`, 0.030 at `1e20`. Without the input
   (`beta <= 1/2`) it is `1/(2 Lam)`; the 7/8 theorem improves the gap by the factor 4/3 and nothing else.
5. **Approximants (MEASURED).** `h = 0` has error exactly 1 at every point and in every norm. No candidate that is
   certified to lie in `H^inf` (truncated chain within the coverage bound, `S(z + 1/2)`, `S(z + 3/8)`, constants)
   has sup error below 1 on any window; apart from the constant 0 all have sup error 1.15 to 1.97. At `T = 1e6`, `beta = 3/8` the smallest
   Poisson-L^1 error over all positions, candidates and `alpha` is 6.9 times the quantum; over the worst position
   it is 8.4 to 17 times. At `T = 1e8` the figures are 11.9 and 12.3 to 24. The ratio grows with `beta Lam`.
6. **Route around MV-CAP: no (Proposition 6, PROVED).** Moving one pair of zeros off the line changes `S` on the
   axis by at most `16 max(beta, eps) + 8 alpha` in `L^1(dt)`, an absolute constant, while the Poisson average at
   the pole changes by the full quantum. Every norm that feeds the dichotomy (sup, BMO, Poisson-L^1, the Besov
   `B^{1/2}_2` norm of the Hilbert-Schmidt identity) therefore needs an error bound of absolute size `O(1/Lam)`
   on an `O(1)` window at every height. A mean value over `[T, 2T]` with relative error `T^{-delta}` cannot give
   it. In density form the criterion yields only `N_off(T) << T log^2 T`.
7. **Controls.** DH: the pole near `85.74i` has quantum 0.9407 (`alpha = 1`), 0.6614 (`alpha = 0.3`); a windowed
   Chebyshev optimisation over `H^inf` polynomials of degree up to 400 gives best error 0.929 and 0.637, above the
   floors 0.882 and 0.557 of the window theorem; the same optimisation for zeta gives 0.088. The gap is
   Euler-blind: Theorems 1-4 hold for DH, backward heat and every function in class (H).

Sharpest remaining statement: (QG) in section 8. It is RH above a height, with slack factor `1/(4 beta Lam)`
in a local `L^1` norm, and it requires an `h` whose boundary winding equals `-N_0` on every window.

## 0. Plan; what is new relative to the atlas, the walls and the lanes

- stack-combinator Plan 2 stated (Q) `||Gamma_-|| >= max_j |S_0(z_j)|` from a Sarason identification quoted from
  memory, for finite `kappa`, and left open: the windowed version, the lower bound L2a for the quantum, the
  candidate `h`, and the norm class. New here: a direct proof of (Q) that also gives the weaker norm (Theorem 1);
  the window version (Theorem 2); an exactly solvable family that fixes the size of the quantum and refutes a
  uniform gap (Theorem 3); the `alpha -> infinity` classification (Theorem 4); a proved lower bound for the
  quantum of a single off-line quartet (Lemma 5, a first case of L2a); the `L^1` insensitivity statement
  (Proposition 6); numerics for five classes of candidates on five height windows; a DH control by direct
  optimisation.
- Atlas: section 2 (shifted bridge) and section 5 (winding, Laguerre differences) are not re-run. Theorem 4
  connects to section 5 only by naming the regime (Laguerre violation on the line). Atlas section 11 remark
  "a uniform strictly positive scalar margin is not the right RH target" is consistent with Theorem 3.
- Walls. DH, backward heat: every theorem here holds for them (section 7). Sign twist: no symmetric zero side,
  so `Gamma_-` is not defined; the prime-side candidates of section 6 are twist-invariant in size and fail.
  MV-CAP: Proposition 6. Verified height: the only cases where the criterion is met (section 6.3) use values of
  `S` on the axis in the window.

## 1. Setting

`F(z) = xi(1/2+z)` or any `F` in class (H) of sq-krein-index; `L = F'/F`; `alpha > 0`;
`S = (1 - alpha L)/(1 + alpha L)`; `|S(it)| = 1`. Poles of `S` in `Re z > 0`: `z_j = x_j + i y_j`, the solutions of
`1 + alpha L = 0`; `kappa` of them (LANE, sq-krein-index Theorem B: `kappa` = number of distinct zeros of `F` in
`Re z > 0`). Residue `r_j = 2/(alpha L'(z_j))` (LANE, sq-hankel-traces Theorem 1(b)).
`b_w(z) = (z - w)/(z + conj w)`, `B = prod_j b_{z_j}`, `S_0 = S B`. `P_z(t) = (x/pi)/((t - y)^2 + x^2)` is the
Poisson kernel of `Re z > 0` at `z = x + iy`; `P[u](z) = int u(t) P_z(t) dt`.
`Gamma_- = Q S P`, and `||Gamma_-|| = dist_{L^inf(iR)}(S, H^inf(Re z > 0))` (CLASSICAL, Nehari).

Hypothesis (F): `B` converges and `S_0` is in `H^inf(Re z > 0)` with `|S_0| <= 1`. LANE for `kappa < infinity`
(sq-krein-index Theorem B(ii)). For `kappa = infinity` with zeros in a strip and `N(T+1) - N(T) = O(log T)` the
Blaschke condition `sum x_j/(1+|z_j|^2) < infinity` holds because the poles lie in the same strip with the same
counting bound, and `|S_0| <= 1` follows from `|S| <= 1` right of the strip, `|S_0| = 1` on the axis and
Phragmen-Lindelof in the strip on rectangles with horizontal sides between zeros of `D` (CLASSICAL minimum
modulus). This last step is not written out here; it is weakest step 1.

Local quantum and quantum of a pole:

    q_j^loc := |r_j|/(2 x_j) = 1/(alpha x_j |L'(z_j)|),      q_j := |S_0(z_j)| = q_j^loc * prod_{k != j} |b_{z_k}(z_j)|.

(`S_0(z_j) = r_j * lim (z - z_j)^{-1} B(z)`, and `b_{z_j}(z)/(z - z_j) -> 1/(2 x_j)`.)

## 2. Theorem 1: the quantum inequality (PROVED)

**Theorem 1.** Assume (F). For every `h` in `H^inf(Re z > 0)`, every pole `z_j`, and every `a > 0`:

    (i)   q_j <= P[|S - h|](z_j) <= ||S - h||_{L^inf(iR)};
    (ii)  4 a x_j q_j/(a + x_j)^2 <= P[|S - h|](a + i y_j).

Consequently `||Gamma_-|| = dist(S, H^inf) >= sup_j q_j`. If `kappa = 1`, `||Gamma_-|| = q_1 = q_1^loc`.

*Proof.* (i) `Phi := S_0 - B h` is in `H^inf`, so `Phi(z_j) = P[Phi](z_j)`. `B(z_j) = 0` gives
`Phi(z_j) = S_0(z_j)`. On the axis `|B| = 1` a.e., so `|Phi| = |B||S - h| = |S - h|`. Hence
`|S_0(z_j)| <= P[|S - h|](z_j)`.
(ii) Put `g_0(z) = (a/pi)/(z - i y_j + a)^2`, analytic in `Re z > -a`, `O(|z|^{-2})`, with
`|g_0(it)| = P_{a+iy_j}(t)`. The function `Psi := (S_0 - B h) g_0/b_{z_j}` is analytic in `Re z > 0` except for a
simple pole at `z_j` with residue `2 x_j S_0(z_j) g_0(z_j)` (`1/b_{z_j} = (z + conj z_j)/(z - z_j)`), and it is
bounded by `C|z|^{-2}` away from `z_j`. Closing the contour to the right,
`int Psi(it) dt = -2 pi * 2 x_j S_0(z_j) g_0(z_j)`. On the axis `|Psi| = |S - h| P_{a+iy_j}`, and
`|g_0(z_j)| = (a/pi)/(a + x_j)^2`. Hence `4 a x_j q_j/(a + x_j)^2 <= P[|S - h|](a + i y_j)`. (At `a = x_j` this is (i).)

*Consequences.* Nehari gives `dist = ||Gamma_-||`; (i) gives the bound. For `kappa = 1` the model space of `B`
is one-dimensional and the Hankel operator has rank one with singular value `|r_1|/(2 x_1)` (LANE,
sq-hankel-traces Theorem 1(d)); so equality. For `kappa >= 2` the inequality can be strict: MEASURED below,
norm 0.7565 against `max_j q_j = 0.3130`. QED.

Remarks.
(a) No Sarason or commutant-lifting step is needed, and `kappa = infinity` is allowed under (F).
(b) The inequality is an every-`h` statement at one point `z_j`. It needs `|S - h|` only through one Poisson
average, of width `x_j <= beta_max`. This is the exact norm class: **`L^1` against the Poisson kernel of the pole.**
(c) `h` may be any function in the Smirnov class `N^+` with `P[|S - h|]` finite; boundedness is not used.

**Theorem 2 (window version; PROVED).** Assume (F), `h` in `H^inf` with `|h| <= M`, `I` an interval of the axis,
`omega_j = int_I P_{z_j}` its harmonic measure at `z_j`. Then

    q_j <= omega_j sup_I |S - h| + (1 + M)(1 - omega_j),      and      q_j <= int_I |S - h| P_{z_j} + (1 + M)(1 - omega_j).

*Proof.* Split the Poisson integral of Theorem 1(i) over `I` and its complement; `|S - h| <= 1 + M`. QED.

Without the bound `M` the window problem has no gap: bounded analytic functions restricted to a compact
interval are dense in the continuous functions, so `inf_h sup_I |S - h| = 0` for every `S`. A window statement
needs the global bound on `h`. This answers the question the combinator left open.

MEASURED (`toy.py`, `toy.log`; rational `F` = on-line zeros at `+- i d(k+1/2)`, `k < K`, plus off-line zeros;
Hankel matrix from the Fourier coefficients of the symbol on the circle, 1200 x 1200, SVD):

| Model | `alpha` | poles | `q^loc` | `q = \|S_0(z_j)\|` | `\|\|Gamma_-\|\|` by SVD |
|---|---|---|---|---|---|
| real pair `beta = 0.3`, `d = 1`, `K = 6` | 0.7 | 0.093184 | 0.72621377 | 0.72621377 | 0.72621377 |
| same, `d = 0.5`, `K = 12` | 0.7 | 0.182501 | 0.121843 | 0.121843 | 0.121843 |
| same, `d = 0.25`, `K = 24` | 0.7 | 0.235407 | 0.0249937 | 0.0249937 | 0.0249937 |
| same, `d = 0.25`, `K = 24` | 0.08 | 0.262209 | 0.0677325 | 0.0677325 | 0.0677325 |
| quartet `0.3 + 1.1i`, `d = 1`, `K = 6` | 0.7 | `0.099067 +- 1.083962i` | 0.68194 | 0.67911 | 0.69035, 0.66805 |
| quartet `0.3 + 0.2i`, `d = 1`, `K = 6` | 0.7 | `0.138844 +- 0.138237i` | 0.44362 | 0.31300 | 0.75655, 0.12949 |
| two quartets | 0.7 | 4 poles | 0.520, 0.526 | 0.512, 0.521 | 0.545, 0.517, 0.513, 0.491 |

Best approximation by Lawson iteration over analytic polynomials of degree `K` on the circle (first model,
quantum 0.726214):

| `K` | `min sup \|S - h\|` | Poisson-L^1 of `\|S - h\|` at the pole |
|---|---|---|
| 10 | 1.000000 | 1.000000 |
| 40 | 0.782660 | 0.744953 |
| 80 | 0.733491 | 0.728302 |
| 160 | 0.728547 | 0.726507 |

Both columns decrease to the quantum and stay above it. Fixed candidates in the same model:
`h = 0`: sup 1, Poisson-L^1 1. `h = S(z + 0.5)`: 1.725, 1.358. `h = S(z + 0.31)` (pole-free): 1.973, 1.441.
`h = S(z + 0.05)`, which is not in `H^inf`: 1.766, 0.733 (above the floor although the function is outside the
class; the inequality is not violated by it).

## 3. Theorem 3: the size of the quantum; no uniform gap (PROVED for the family)

**Sea model.** `F_Lam(w) = cosh(Lam w)(w^2 - beta^2)`, `Lam > 0`, `0 < beta`. It is even, real, entire of order
one: class (H). Zeros: `+- i (pi/Lam)(k + 1/2)` on the axis (spacing `pi/Lam`, the spacing of zeta zeros at
height `T` when `Lam = (1/2) log(T/2 pi)`) and the pair `+- beta`. `kappa = 1`.

    L(w) = Lam tanh(Lam w) + 2w/(w^2 - beta^2),      L'(w) = Lam^2 sech^2(Lam w) - 2(w^2 + beta^2)/(w^2 - beta^2)^2.

The pole is the root `x` in `(0, beta)` of `1 + alpha L(x) = 0` (one root: `kappa = 1` and the pole set is
conjugation-symmetric), and by Theorem 1

    ||Gamma_-|| = q(alpha, beta, Lam) = 1/(alpha x |L'(x)|)       exactly.

**Theorem 3.**
(a) Replace `tanh` by 1 and `sech` by 0 (relative error `O(e^{-2 Lam x})`). Then with `a := alpha/(1 + alpha Lam)`:
`x = sqrt(a^2 + beta^2) - a` and

    q_mf(alpha, beta, Lam) = alpha / ( (1 + alpha Lam)^2 sqrt(beta^2 + a^2) ) <= alpha/(beta (1 + alpha Lam)^2) <= 1/(4 beta Lam).

The presence of the on-line zeros replaces `alpha` by the effective value `a < 1/Lam` and multiplies the
isolated-pair value `a/sqrt(a^2 + beta^2)` of sq-hankel-traces Theorem 1(e) by `a/alpha = 1/(1 + alpha Lam)`.
(b) For fixed `alpha` and `beta`, `q -> 0` as `Lam -> infinity`, like `1/(alpha beta Lam^2)`.
(c) `sup_alpha q_mf = (1 + o(1))/(4 beta Lam)` as `beta Lam -> infinity`, at `alpha Lam = 1 + o(1)`.

*Proof.* (a) The pole equation becomes `w^2 - beta^2 + 2 a w = 0`. `L' = -2(x^2+beta^2)/(x^2-beta^2)^2`,
`beta^2 - x^2 = 2 a x`, `x^2 + beta^2 = 2 x sqrt(a^2+beta^2)`, so `x|L'| = sqrt(a^2+beta^2)/a^2` and
`q = a^2/(alpha sqrt(a^2 + beta^2))`. The last inequality is `4 alpha Lam <= (1 + alpha Lam)^2`. (b), (c) follow. QED.

MEASURED (`toy.log` sections A, A2): exact root against `q_mf`.

| `beta` | `Lam` | `alpha` | `x` | `q` exact | `q_mf` | ratio |
|---|---|---|---|---|---|---|
| 0.375 | 10 | 0.1 | 0.328258 | 6.634762e-2 | 6.608186e-2 | 1.004022 |
| 0.375 | 30 | 1/30 | 0.358704 | 2.220031e-2 | 2.220031e-2 | 1.000000 |
| 0.375 | 30 | 100 | 0.343155 | 2.949368e-5 | 2.949367e-5 | 1.000000 |
| 0.375 | 100 | 0.01 | 0.370033 | 6.666074e-3 | 6.666074e-3 | 1.000000 |
| 0.1 | 100 | 1 | 0.090588 | 9.755263e-4 | 9.755262e-4 | 1.000000 |
| 0.375 | 1 | 1 | 0.072582 | 0.922735 | 0.400000 | 2.31 (low density: mean field not valid) |

| `beta` | `Lam` | `sup_alpha q` (exact root, grid in `alpha`) | at `alpha Lam` | `1/(4 beta Lam)` |
|---|---|---|---|---|
| 0.5 | 13.45 | 3.707302e-2 | 0.997 | 3.717472e-2 |
| 0.375 | 13.45 | 4.934052e-2 | 0.986 | 4.956629e-2 |
| 0.375 | 30 | 2.220021e-2 | 0.993 | 2.222222e-2 |
| 0.375 | 100 | 6.666074e-3 | 1.000 | 6.666667e-3 |
| 0.375 | 1000 | 6.666661e-4 | 1.000 | 6.666667e-4 |
| 0.1 | 13.45 | 1.000000 | `alpha -> infinity` | (regime of Theorem 4) |
| 0.375 | 3 | 1.000000 | `alpha -> infinity` | (regime of Theorem 4) |

(`Lam = 13.45` is `(1/2) log(T/2 pi)` at `T = 3e12`.)

**Corollary (refutation of the uniform dichotomy).** For every `alpha > 0` and `eps > 0` there is `F` in class (H)
with all zeros in `|Re| <= 3/8`, `Gamma_- != 0` and `||Gamma_-|| < eps`. So `g(alpha) := inf { ||Gamma_-|| : F in (H), Gamma_- != 0 } = 0`
for every `alpha`, and also `inf_F sup_alpha ||Gamma_-|| = 0`. A gap exists only relative to the local density of
on-line zeros, and it is of size `1/(4 beta Lam)`: with `Lam = (1/2) log(T/2 pi)`, `g(T) = 1/(2 beta log(T/2 pi))`.

**Lemma 5 (a first case of the combinator's L2a; PROVED).** Let `F` in (H) have exactly one off-line quartet
`+- beta +- i gamma_0` (or one real pair) and write `L = L_1 + p`, `p(w) = 1/(w - beta) + 1/(w + beta)`,
`w = z - i gamma_0`, so `Re L_1 >= 0` on `Re z >= 0`. For the pole `z_1 = i gamma_0 + w_1` with `Re w_1 = x_1`:

    q_1^loc >= 1 / ( alpha beta ( 1/alpha + 1/beta + |L_1(z_1)| )^2 - 1 ).

*Proof.* `|L_1'(z_1)| <= sum_rho m_rho/|z_1 - rho|^2 = Re L_1(z_1)/x_1` (every zero in `L_1` is on the axis, or is
the conjugate pair, for which the same identity holds with `<=` when `x_1 < beta`; the conjugate pair is at
distance `>= 2 gamma_0` and is absorbed). The real part of the pole equation is
`Re L_1(z_1) = -1/alpha + (beta - x_1)/|w_1 - beta|^2 - (beta + x_1)/|w_1 + beta|^2`. So

    alpha x_1 |L'(z_1)| <= alpha Re L_1 + alpha x_1 (|w_1-beta|^{-2} + |w_1+beta|^{-2}) = -1 + alpha beta (|w_1-beta|^{-2} - |w_1+beta|^{-2}) <= alpha beta/|w_1 - beta|^2 - 1.

The pole equation also gives `1/|w_1 - beta| <= 1/alpha + |L_1(z_1)| + 1/|w_1 + beta| <= 1/alpha + |L_1(z_1)| + 1/beta`. QED.

In the sea model `|L_1| <= Lam` and at `alpha = 1/Lam` the bound is `1/(4 beta Lam + 3 + 1/(beta Lam))`,
against the exact `1/(4 beta Lam)(1 + o(1))`: the lemma is sharp to leading order. Checked: `beta = 0.375`,
`Lam = 30`: bound 0.02079, exact 0.02220; `Lam = 10`, `alpha = 0.1`: bound 0.0547, exact 0.0663.
What stays OPEN in L2a: several off-line zeros near one another (the Blaschke factors and `L_1` then contain
off-line terms), and an unconditional bound for `|L_1(z_1)|` when `x_1` is small. For zeta, `|L_1(x + iy)| <= C log T / x`
unconditionally, which gives `q >= c beta x_1^2/log T` at `alpha = 1/log T`: positive, explicit, not uniform.

## 4. Theorem 4: alpha -> infinity, and reconciliation with eq48 Theorem 4

**Theorem 4 (PROVED).** Let `z_j(alpha)` be a pole branch that converges to a finite point `z*` as
`alpha -> infinity`. Then `z*` is a zero of `L` in `Re z >= 0` (a critical point of `F`).
(a) If `z* = i t_0` is on the axis, then `f'(t_0) = 0`, `f(t_0) f''(t_0) > 0`, `x_j = (1 + o(1))/(alpha |L'(i t_0)|)`
and `q_j^loc -> 1`.
(b) If `Re z* > 0` and `L'(z*) != 0`, then `q_j^loc = (1 + o(1))/(alpha Re z* |L'(z*)|) -> 0`.
(c) Sea model: (a) holds iff `beta Lam <= sqrt 2`; otherwise (b).

*Proof.* `1 + alpha L(z_j) = 0` forces `L(z_j) -> 0`. (a) On the axis `L(it) = -i f'(t)/f(t)`, so `f'(t_0) = 0`, and
`L'(i t_0) = F''/F - (F'/F)^2 = -f''(t_0)/f(t_0)`, real. `z_j = i t_0 - 1/(alpha L'(i t_0)) + O(alpha^{-2})` lies in
`Re z > 0` iff `L'(i t_0) < 0` iff `f f'' > 0`. Then `alpha x_j |L'(z_j)| -> 1`. (b) direct. (c) `L(x) < 0` on
`(0, beta)` when `beta Lam <= sqrt 2`, since `Lam tanh(Lam x) <= Lam^2 x <= 2x/beta^2 < 2x/(beta^2 - x^2)`; then the
root tends to 0. If `beta Lam > sqrt 2`, `L > 0` near 0 and `L -> -infinity` at `beta`: interior zero. QED.

MEASURED (`toy.log` section D, `Lam = 10`):

| `beta Lam` | `q` at `alpha Lam = 1e2` | `1e4` | `1e6` | `1e8` |
|---|---|---|---|---|
| 1.0 | 0.9995338 | 1.0000000 | 1.0000000 | 1.0000000 |
| 1.4 | 0.4496540 | 0.9980007 | 0.9999998 | 1.0000000 |
| 1.43 | 0.2372481 | 1.3096e-2 | 1.3811e-4 | 1.3819e-6 |
| 2.0 | 8.4761e-3 | 8.8217e-5 | 8.8253e-7 | 8.8253e-9 |

Answer to "take alpha large: does the gap tend to 1, so that any error below 1 suffices": **only in the
Laguerre regime.** An off-line pair within `sqrt 2/Lam` of the line (sea model; for zeta `2 sqrt 2/log(T/2 pi)`,
0.105 at `T = 3e12`) produces a positive local minimum of `|f|` on the line, the pole tends to that point and the
quantum tends to 1. A pair farther out produces no such minimum; the pole tends to an interior critical point of
`F` and the quantum tends to 0 like `1/alpha`. In the first regime the off-line pair is detected by the sign of
`f f''` at a critical point, which is a pointwise computation on the line (verified-height information). The
four DH off-line zeros to height 200 are all in the first regime (`beta Lam` = 0.65, 0.34, 0.18, 0.55; section 7).

**Reconciliation with eq48 Theorem 4 (PROVED there: no margin for the Weil form).** The two statements are about
opposite ends of one spectrum. With `M_c = Q - S* Q S` (LANE), `H_c = A* M_c A`, the spectrum of `M_c` lies in
`[-1, 1]`, 0 is an eigenvalue of infinite multiplicity (LANE, sq-krein-index), and

    inf spec(M_c) = -||Gamma_-||    (M_c is a difference of two orthogonal projections, CLASSICAL; for one pair the
                                     eigenvalue is -alpha/sqrt(alpha^2+beta^2), LANE sq-krein-index).

- eq48 Theorem 4 says: `inf_v Q_L(v)/E_gamma(v) = 0` whether or not RH holds. This is the statement that 0 is in
  the spectrum (the positive part has no gap above 0). A margin `Q_L >= theta E_gamma`, `theta > 0`, is a
  coercivity statement and is false.
- Theorem 1 says: `inf spec(M_c)` is either `>= 0` or `<= -max_j q_j`. This is a gap **below** 0 in the set of
  possible values of the bottom of the spectrum. It is not a coercivity statement.

So RH follows from the one-sided bound `M_c >= -(q - eps)` (equivalently `Q_L(v) >= -(q - eps)||A v||^2` in the
normalisation of the lane), and never from `M_c >= theta > 0`, which is false. The trivial bound is `M_c >= -1`.
The gap replaces "no negative part" by "negative part smaller than `q`", a slack factor `q` against the trivial
bound. This is the bounded, normalised form of cc-latest Theorem B and ff-transplant Proposition S (any finite
one-sided lower bound suffices). The slack is real, but by Theorem 3 its size is `1/(4 beta Lam)`, not a constant.

## 5. The norm class, and why it does not avoid MV-CAP

Four norms feed the dichotomy. All PROVED or CLASSICAL.

| Norm of `S - h` | Statement | Quantifier |
|---|---|---|
| `L^inf(iR)` | `q_j <= \|\|Gamma_-\|\| = inf_h \|\|S - h\|\|_inf` (Nehari) | every point |
| BMO | `\|\|Gamma_-\|\| <= C dist_BMO(S, BMOA)` (Nehari + Fefferman; `C` absolute, not computed) | every interval, every scale |
| Poisson-`L^1` at the pole | `q_j <= P[\|S - h\|](z_j)` (Theorem 1) | one average of width `x_j`, at every candidate position |
| Besov `B^{1/2}_2` | `\|\|Gamma_-\|\| <= \|\|Gamma_-\|\|_HS = \|\|P_-(S - h)\|\|_{H^{1/2}} <= \|\|S - h\|\|_{H^{1/2}(R)}` (sq-hankel-traces Thm 2) | global quadratic |

The weakest sufficient hypothesis is the third:

    (C)  for every x in (0, beta_max] and every y >= T_0:   P[|S - h|](x + iy) < q_*(x, y),

where `q_*` is any proved lower bound for the quantum of a pole at `x + iy`. Under (F), (C) implies no pole of
`S`, hence no zero of `F`, in `{Re z > 0, Im z >= T_0}`. Under RH, `h = S` satisfies (C) with left side 0. So
(C) is equivalent to RH above `T_0` (given a valid `q_*`), and it is an `L^1`-average statement with slack.

**Proposition 6 (L^1 insensitivity; PROVED).** Let `F_0` in (H) and let `F_1` be obtained from `F_0` by replacing
one conjugation-closed set of on-line zeros `+- i(gamma_0 +- eps)` by the off-line quartet `+- beta + i gamma_0`
and its conjugate. Then for every `alpha`:

    int_R |S_1(it) - S_0(it)| dt <= 16 max(beta, eps) + 8 alpha.

*Proof.* On the axis `Re(1 + alpha L_k) = 1`, so `|1 + alpha L_k| >= 1` and
`|S_1 - S_0| = 2 alpha |L_1 - L_0|/(|1+alpha L_0||1+alpha L_1|) <= min(2, 2 alpha |L_1 - L_0|)`.
With `w = i(t - gamma_0)`: `L_1 - L_0 = 2w/(w^2 - beta^2) - 2w/(w^2 + eps^2)`, of modulus
`2(beta^2 + eps^2)|w|/(|w^2 - beta^2||w^2 + eps^2|) <= 8 m^2/|t - gamma_0|^3` for `|t - gamma_0| >= 2m`,
`m = max(beta, eps)`. Near each height: `int_{|t-gamma_0| < 2m} 2 dt = 8m` and `2 alpha * 8 m^2 * 2 int_{2m}^inf tau^{-3} d tau = 4 alpha`.
Two heights `+- gamma_0`: `16 m + 8 alpha`. QED.

Consequence. Take `F_0` with all zeros on the line and `h = S_0` in `H^inf`. Then `S_1` has a pole of quantum
`q` and yet `||S_1 - h||_{L^1(dt)} <= 16 max(beta, eps) + 8 alpha`. The total `L^1` mass that separates "one off-line
quartet" from "none" is an absolute constant, independent of the height and of the length of any window that
contains it. By Theorem 1(i) that mass is concentrated within `O(x_j)` of the pole height, where it is at least
`pi x_j q_j` in the sense of the Poisson average. So:

- Any sufficient criterion in terms of `|S - h|` must bound a local average on windows of length `O(1)`, at
  every height, by an absolute quantity of size `q ~ 1/(4 beta Lam)`.
- A mean value `int_T^{2T} |S - h|^p dt = c T (1 + O(T^{-delta}))` leaves room for `>> T^{1 - delta}` poles.
  The weaker norm changes sup into a local average. It does not change "every window" into "most windows".
  This is MV-CAP for this formulation, proved.

Density form (HEURISTIC in the constant, PROVED in shape). Summing Theorem 1(i) over the poles with
`y_j` in `[T, 2T]`, using that at most `C log T` poles lie in a unit window:

    sum_j x_j q_j <= int |S - h|(t) sum_j x_j P_{z_j}(t) dt <= C log T * int_{T-1}^{2T+1} |S - h| dt + (tail).     (5.2)

(`x_j P_{z_j}(t) = (1/pi) x_j^2/((t-y_j)^2 + x_j^2) <= (1/pi) min(1, b^2/(t-y_j)^2)`; the tail uses `|h| <= M`.)

With `x_j q_j ~ 1/(4 Lam)` at `alpha = 1/Lam`, `N_off(T, 2T) << log^2 T * int_T^{2T}|S - h|`. Every certified
candidate has mean error of order 1 at that `alpha` (section 6), which gives `N_off << T log^2 T`, weaker than the
trivial bound. For large `alpha` the mean error falls like `log(alpha Lam)/(alpha Lam)` and the weight
`x_j q_j` like `1/(alpha Lam^2)`; the result is again `T Lam^2 log(alpha Lam)`. A density theorem from (5.2) needs
mean error `o(1/log T)`, i.e. an approximant that follows `S` through every zero.

**Winding lemma (PROVED).** If `sup_{t in [T_1, T_2]} |S(it) - h(it)| < 1`, then
`|Delta arg h - Delta arg S| < pi` on `[T_1, T_2]`, and `Delta arg S = -2 pi N_0([T_1, T_2]) + O(1)` (LANE,
sq-krein-index: the axis winding of `S` is `-N_0` up to an error of modulus < 1 turn). So an `h` that beats the
trivial error 1 in sup norm on every window has boundary winding `-N_0` on every window to within one turn: it
encodes the number of critical-line zeros in every `O(1)` window exactly. *Proof.* `h = S(1 + (h - S)/S)` and
`|(h - S)/S| < 1`. QED.

## 6. The approximation problem (MEASURED)

`zeta_approx.py`, `zeta_approx.log`, `zeta_approx.json`: zeta, windows `[100,140]`, `[1e3, 1e3+20]`,
`[1e4, 1e4+20]`, `[1e5, 1e5+20]`, `[1e6, 1e6+20]`, grid step 0.01, mpmath 20 digits; `alpha` in
`{1/Lam, 1, 10}`, `Lam = (1/2) log(T/2 pi)`. `ratio.py`, `ratio.log`: windows at `1e4`, `1e6`, `1e8`, step 0.002.

Candidates and their class:

| `h` | Definition | In `H^inf(Re z > 0)`? |
|---|---|---|
| 0, -1 | constants | yes |
| chain `Q` | `(1 - alpha L_Q)/(1 + alpha L_Q)`, `L_Q = G - sum_{p <= Q} log p/(p^s - 1)` | yes above `t_0` for `D(Q) <= R(t_0)` (LANE, coverage theorem): `Q` = 1, 2, 4, 6, 10 at `T` = 1e2 .. 1e6. Not certified for `Q` = 100, 1e4 |
| `S(z + sigma)` | shift | `sigma = 1/2`: yes (CLASSICAL). `sigma = 3/8`: yes given the 7/8 theorem. `sigma` = 0.1, 0.02: only under a zero-free hypothesis |
| mollified chain | `L = G - sum_{n <= 1000} Lambda(n)(1 - log n/log 1000) n^{-s}` | not certified |
| Cayley partial sums | `-1 + 2 sum_{m <= M} alpha^m P_N^m/(1 + alpha G)^{m+1}`, `N = 1000` | yes if `1 + alpha G` has no zero in `Re z > 0` (not checked) |
| Nyman-Beurling type | `L = G + zeta'(s) M_100(s)`, `M_N = sum mu(n)(1 - log n/log N) n^{-s}` | not certified |

### 6.1 Sup norm, mean, winding

Columns: `sup |S - h|` on the grid; mean of `|S - h|`; winding of `h` against winding of `S` (turns) over the
window. `alpha = 1/Lam` (the value that maximises the quantum).

| `T` | `Lam` | `h` | sup | mean | wind `h` / wind `S` |
|---|---|---|---|---|---|
| 1e4 | 3.687 | chain `Q = 4` (certified) | 1.277 | 0.985 | -2.8 / -23.8 |
| 1e4 | | `S(z + 1/2)` | 1.240 | 0.934 | -2.9 / -23.8 |
| 1e4 | | `S(z + 3/8)` | 1.260 | 0.890 | -8.9 / -23.8 |
| 1e4 | | mollified chain | 1.360 | 0.853 | -7.9 / -23.8 |
| 1e4 | | chain `Q = 1e4` | 21.4 | 0.977 | -16.9 / -23.8 |
| 1e4 | | NB type | 19.4 | 1.316 | -13.9 / -23.8 |
| 1e4 | | Cayley `M = 3` | 2.541 | 0.911 | -14.9 / -23.8 |
| 1e4 | | `S(z + 0.02)` (needs zero-free `Re s > 0.52`) | 0.756 | 0.136 | -23.8 / -23.8 |
| 1e6 | 5.989 | chain `Q = 10` (certified) | 1.262 | 0.974 | -5.0 / -37.4 |
| 1e6 | | `S(z + 1/2)` | 1.151 | 0.972 | -3.1 / -37.4 |
| 1e6 | | `S(z + 3/8)` | 1.173 | 0.951 | -4.2 / -37.4 |
| 1e6 | | mollified chain | 1.240 | 0.943 | -7.2 / -37.4 |
| 1e6 | | chain `Q = 1e4` | 7.71 | 0.877 | -18.6 / -37.4 |
| 1e6 | | NB type | 44.2 | 1.235 | -22.8 / -37.4 |
| 1e6 | | Cayley `M = 3` / `M = 10` | 1.480 / 1.481 | 0.802 / 0.819 | -16.5 / -37.4 |
| 1e6 | | `S(z + 0.02)` | 0.744 | 0.205 | -37.4 / -37.4 |

At `alpha = 1` and `T >= 1e4` the certified candidates have sup 1.66 to 1.77 and mean 0.57 to 0.72; at
`alpha = 10`, sup 1.88 to 1.97 and mean 0.11 to 0.27 over all windows (`zeta_approx.log`). Reading:

- No certified candidate has sup error below the trivial value 1 on any window. Every certified candidate has
  a winding deficit of 15 to 34 turns per window; by the winding lemma its sup error is at least 1.
- The only candidate with the right winding and sup error below 1 is `S(z + sigma)` with `sigma` below the zero
  spacing. It is in `H^inf` iff `zeta` has no zeros in `Re s > 1/2 + sigma`, and its error at an on-line zero is
  `2 sigma/(sigma + alpha)` in the isolated-zero approximation. With `alpha = 1/Lam` and the gap `1/(4 beta Lam)`
  the requirement `2 sigma/(sigma + alpha) < 1/(4 beta Lam)` is `sigma < 1/(8 beta Lam^2)`: to exclude zeros at
  distance `beta` this route needs zero-freeness beyond distance `1/(2 beta log^2 T)`. The shift does not
  bootstrap: it returns a hypothesis stronger than its conclusion for every `beta > 1/(sqrt 2 log T)`.
- Uncertified prime-side candidates with more terms (chain `Q = 1e4`, NB type, Cayley sums) pick up part of the
  winding (up to half) and pay with sup errors from 2 to 100: the partial sums are not bounded on the axis.
  The Cayley partial sums blow up on the axis at `T = 100` (sup 773 to 2.6e4 at `M = 10`) and stalls at mean error
  0.8 at `T = 1e6`. This is the expected behaviour of a series that converges only for `Re z > sigma_0 > 1/2`.
- For large `alpha` the mean error is small for a trivial reason: `S = -1 + 2/(1 + alpha L)` is within
  `O(1/(alpha |L|))` of `-1` except in a neighbourhood of width `1/(alpha Lam^2)` of each critical point of `f`,
  where it makes a full turn. The constant `h = -1` has mean error `~ (4/pi) log(alpha Lam)/(alpha Lam)`.
  The quantum of a pole outside the Laguerre regime falls faster, like `1/(alpha beta Lam^2)` (Theorem 3(b)).
  (At `alpha = 10` the grid step 0.01 undersamples these turns; the windings printed for `alpha = 10` in
  `zeta_approx.log` are not reliable. `ratio.py` uses step 0.002.)

### 6.2 Poisson-L^1 error against the quantum

For a hypothetical off-line pair at distance `beta`, with local density `Lam`, the sea model gives the pole depth
`x` and quantum `q` (exact root). The table gives the Poisson-`L^1` average of `|S - h|` at depth `x`: its
minimum and maximum over the position `y` in the middle third of the window, minimised over the five certified
candidates (`0`, `-1`, certified chain, `S(z+1/2)`, `S(z+3/8)`), divided by `q`. The criterion (C) at a position
needs the ratio `< 1`. To exclude a pole anywhere in the window the max column must be `< 1`.

Window `[1e6, 1e6+12]`, `Lam = 5.989`:

| `alpha Lam` | `beta` | `beta Lam` | `x` | `q` | min over `y` / `q` | max over `y` / `q` |
|---|---|---|---|---|---|---|
| 0.3 | 0.375 | 2.25 | 0.338 | 0.0801 | 8.29 | 10.04 |
| 1 | 0.375 | 2.25 | 0.299 | 0.1172 | 8.01 | 8.41 |
| 3 | 0.375 | 2.25 | 0.265 | 0.0954 | 7.30 | 9.03 |
| 10 | 0.375 | 2.25 | 0.243 | 0.0463 | 6.91 | 11.33 |
| 100 | 0.375 | 2.25 | 0.232 | 0.00590 | 9.17 | 17.27 |
| 1 | 0.2 | 1.20 | 0.122 | 0.322 | 2.77 | 3.10 |
| 10 | 0.2 | 1.20 | 0.0365 | 0.779 | 0.15 | 1.28 |
| 100 | 0.2 | 1.20 | 0.0042 | 0.996 | 0.003 | 1.004 |
| 100 | 0.05 | 0.30 | 0.00008 | 1.000 | 0.000 | 1.000 |

Window `[1e4, 1e4+12]`, `Lam = 3.687`:

| `alpha Lam` | `beta` | `beta Lam` | `x` | `q` | min over `y` / `q` | max over `y` / `q` |
|---|---|---|---|---|---|---|
| 1 | 0.375 | 1.38 | 0.249 | 0.248 | 3.20 | 3.86 |
| 10 | 0.375 | 1.38 | 0.120 | 0.374 | 0.50 | 2.15 |
| 100 | 0.375 | 1.38 | 0.0408 | 0.623 | 0.021 | **0.704** |
| 100 | 0.2 | 0.74 | 0.0010 | 1.000 | 0.000 | 1.000 |


### 6.3 Reading of 6.2

- Outside the Laguerre regime (`beta Lam > sqrt 2`; all rows with `beta = 0.375` at `T = 1e6` and `1e8`) every
  certified candidate fails at every position, by a factor 6.9 to 17 at `1e6` and 11.9 to 24 at `1e8`.
- Inside the Laguerre regime (`beta Lam < sqrt 2`) with `alpha` large, the constant `h = -1` meets the criterion
  at most positions (min column `<< 1`): where `S` stays near `-1` on the axis, no pole of depth `x` and quantum
  near 1 can sit below. At the positions where `S` makes its turn (one per gap between zeros of `f`) the
  average is near 2 and the criterion fails with ratio 1.00 to 1.3. One row passes at every sampled position:
  `T = 1e4`, `beta = 0.375`, `alpha Lam = 100`, ratio 0.704, with `h = S(z + 3/8)` or `h = -1`.
- That row is not arithmetic. `h = -1` contains no information; all the information is in the values of `S` on
  the axis in the window, i.e. in `f'/f` on the critical line at a height where the zeros are verified. It is
  the Laguerre test in Poisson-averaged form. It also rests on the sea-model value of `q`, not on a proved
  `q_*` for the actual zero configuration. The regime ends at `beta Lam = sqrt 2`: for `beta = 3/8`, at
  `T = 2 pi e^{7.54} ~ 1.2e4`. Above that height the criterion is not met by any candidate tested.

So the approximation problem has slack, as the angle anticipated, but the slack is `1/(4 beta Lam)`, and the
candidates miss it by `~ 4 beta Lam`, because their error is of order 1: they do not follow `S` through its
`N_0` turns. The only functions that do are `S` itself and its small shifts, whose membership in `H^inf` is the
conclusion.

### 6.4 Window `[1e8, 1e8+8]`, `Lam = 8.291`, certified chain `Q = 16`

| `alpha Lam` | `beta` | `beta Lam` | `x` | `q` | min over `y` / `q` | max over `y` / `q` |
|---|---|---|---|---|---|---|
| 0.3 | 0.375 | 3.11 | 0.348 | 0.0571 | 12.77 | 13.98 |
| 1 | 0.375 | 3.11 | 0.319 | 0.0805 | 11.98 | 12.26 |
| 3 | 0.375 | 3.11 | 0.295 | 0.0607 | 11.92 | 13.45 |
| 10 | 0.375 | 3.11 | 0.280 | 0.0270 | 12.44 | 15.95 |
| 100 | 0.375 | 3.11 | 0.272 | 0.00323 | 17.35 | 24.10 |
| 1 | 0.2 | 1.66 | 0.145 | 0.182 | 5.21 | 5.49 |
| 100 | 0.2 | 1.66 | 0.083 | 0.0237 | 1.40 | 6.43 |
| 100 | 0.1 | 0.83 | 0.0006 | 1.000 | 0.001 | 1.000 |

Best ratio for `beta = 3/8` over `alpha` and candidates: 3.2 at `T = 1e4` (`beta Lam = 1.38`, excluding the
Laguerre-regime rows), 6.9 at `1e6` (2.25), 11.9 at `1e8` (3.11). The growth is faster than linear in `beta Lam`
over this range. At `beta = 0.2` the pair leaves the Laguerre regime between `1e6` and `1e8` and the ratio
passes from 0.15 to 1.4.

## 7. Controls

**Davenport-Heilbronn** (`dh.py`, `dh.log`; mpmath 20 digits; poles by damped Newton).

Poles of `S_DH` near the four off-line zeros to height 200 and their local quanta:

| zero | `beta` | `beta Lam_DH` | `alpha = 0.01` | 0.1 | 0.3 | 1 | 10 | 1000 |
|---|---|---|---|---|---|---|---|---|
| `0.808517 + 85.699348i` | 0.3085 | 0.651 | 0.03223 | 0.29692 | 0.66137 | 0.94073 | 0.99933 | 1.00000 |
| `0.650830 + 114.163343i` | 0.1508 | 0.340 | 0.06598 | 0.54680 | 0.88948 | 0.98829 | 0.99988 | 1.00000 |
| `0.574356 + 166.479306i` | 0.0744 | 0.182 | 0.13310 | 0.80028 | 0.97009 | 0.99719 | 0.99997 | 1.00000 |

| `0.724258 + 176.702461i` | 0.2243 | 0.555 | 0.04431 | 0.39340 | 0.77575 | 0.96997 | 0.99968 | 1.00000 |

(`Lam_DH = (1/2) log(5T/2 pi)`.) All are in the Laguerre regime; the quanta follow the
isolated-pair value `alpha/sqrt(alpha^2 + beta^2)` to within 5 percent and tend to 1 (Theorem 4(a)). The Blaschke
factor over the other seven known poles is `1 - 2e-6` (`alpha = 1`) and `1 - 1.7e-5` (`alpha = 0.3`), so
`q = q^loc` to five digits; the tail over poles above height 200 is not computed (weakest step 3).

Best approximation, windowed. `I' = [80.72, 90.72]`; minimise `max( sup_{I'} |S - h|, lam * sup_{outside} |h| )`
over polynomials of degree `< K` in `((z - i y_0) - a)/((z - i y_0) + a)`, `a = 5` (these are in `H^inf`), by
Lawson iteration on 4096 nodes. Theorem 2 gives the floor
`(q - (1 - omega))/(omega + (1 - omega)/lam)` for the objective when a pole of quantum `q` and harmonic measure
`omega` is present.

| function | `alpha` | `lam` | floor (Thm 2) | `K = 50` | 100 | 200 | 400 |
|---|---|---|---|---|---|---|---|
| DH | 1 | 0.1 | 0.882 | 0.9310 | 0.9292 | 0.9289 | 0.9289 |
| zeta | 1 | 0.1 | none | 0.0905 | 0.0896 | 0.0888 | 0.0879 |
| DH | 1 | 0.3 | 0.920 | 0.9365 | 0.9353 | 0.9351 | 0.9351 |
| zeta | 1 | 0.3 | none | 0.2276 | 0.2246 | 0.2223 | 0.2203 |
| DH | 0.3 | 0.1 | 0.557 | 0.6389 | 0.6380 | 0.6376 | 0.6374 |
| zeta | 0.3 | 0.1 | none | 0.0913 | 0.0897 | 0.0892 | 0.0882 |
| DH | 0.3 | 0.3 | 0.619 | 0.6517 | 0.6509 | 0.6507 | 0.6505 |
| zeta | 0.3 | 0.3 | none | 0.2283 | 0.2258 | 0.2223 | 0.2169 |

The DH optimum converges to a value between the floor and the quantum (0.929 against 0.882 and 0.9407; 0.637
against 0.557 and 0.6614) and does not move with `K`. The zeta optimum is at the level `lam` set by the penalty
on `|h|` outside the window (`h` close to `S`, of modulus about 1), i.e. no floor. The necessary inequality of
Theorem 2 holds in every row (`dh.log`, last column). Fixed candidates at the DH pole, `alpha = 1`, Poisson-`L^1`
over `I'`: `h = 0`: 0.9934 (the harmonic measure of `I'`); `h = S_DH(z + 0.7)`, which is in `H^inf`: 1.132;
`h = S_DH(z + 0.3)`: 1.263; all above the quantum 0.9407. The best approximation error for DH is `>=` the gap, as
required; the separation DH/zeta in this test is a factor 10.6 (`alpha = 1`, `lam = 0.1`).

**What the control shows about the mechanism.** Theorems 1 to 4, Lemma 5 and Proposition 6 use only class (H)
(functional equation, order one). They hold for DH, for every backward-heat `F_tau`, for the sea model and for
`E_a`. None uses the Euler product. For DH the conclusion `Gamma_- = 0` is false and the theorems say so
quantitatively. A proof of RH by this route would use the Euler product in one place only: the construction of
`h`. Section 6 shows that the constructions available from the prime side (which are invariant under sign twists
in their size bounds) do not produce the winding.

| Step | DH | backward heat | sign twist |
|---|---|---|---|
| Theorem 1, 2 (quantum inequality) | holds; `kappa = infinity` needs (F) | holds | no `Gamma_-` (no functional equation) |
| Theorem 3, Lemma 5 (size of quantum) | holds (measured: isolated-pair regime at heights <= 200) | holds | n/a |
| Theorem 4 (`alpha -> infinity`) | holds; all four known zeros in case (a) | holds | n/a |
| Proposition 6 (`L^1` insensitivity) | holds | holds | n/a |
| certified `h` with error `< q` | impossible (Theorem 1); measured best 0.929 | impossible when `tau < 0` produces a pole | chain candidates exist with the same bounds, and no `S` to approximate |

## 8. Sharpest remaining statement

(QG) There are `T_0`, a function `alpha(T) > 0` and `h` in `H^inf(Re z > 0)` such that for every `y >= T_0` and
every `x` in `(0, 3/8]`:

    int |S_{alpha(y)}(it) - h(it)| P_{x+iy}(t) dt < q_*(x, y),

with `q_*` a proved lower bound for the quantum of a pole of `S` at `x + iy` among all configurations allowed by
the unconditional zero count and the 7/8 theorem. (For height-dependent `alpha` the statement is applied on
windows with Theorem 2.) Status of the parts:

- (QG) implies no zeros of zeta with `Re s > 1/2`, `Im s >= T_0`: PROVED (Theorem 1, 2) given (F) and `q_*`.
- RH implies (QG) with `h = S`: PROVED.
- `q_*`: PROVED for one off-line quartet among on-line zeros (Lemma 5), value `~ 1/(4 beta Lam)` at
  `alpha = 1/Lam`; OPEN for clusters of off-line zeros.
- `h`: OPEN. Necessary (winding lemma): on every window where the sup error is below 1, `h` has boundary
  winding `-N_0` to within one turn. Necessary (Proposition 6): the error bound is local and absolute.
- The slack: a factor `q_* ~ 4/(3 log(T/2 pi))` against the trivial error 1 of `h = 0`, in an `L^1` norm on
  windows of length `<= 3/8`. This is the only formulation in the campaign with a margin, and the margin is
  logarithmically small, local, and required at every height.

The statement that would be new arithmetic: an `H^inf` function built from primes whose values on the critical
line track `(f - i alpha f')/(f + i alpha f')` to within `c/log T` in local `L^1` mean at every height. For
comparison, the Riemann-Siegel formula gives `f` on the line to that accuracy from `sqrt(T/2 pi)` terms, but
through the functional equation: the resulting expression is not the boundary value of a bounded analytic
function in `Re z > 0` unless `S` itself is.

## 9. Three weakest steps

1. Hypothesis (F) for `kappa = infinity` (convergent Blaschke product and `|S_0| <= 1` by Phragmen-Lindelof) is
   sketched, not written. It is needed only to state Theorem 1 for DH globally; the finite-`kappa` case is from
   sq-krein-index, and the DH numerics use the first eight poles. The density form (5.2) is given in shape only
   (constant and tail not worked out). Theorem 4 assumes the pole branch converges.
2. The size of the quantum for zeta is taken from the sea model (equally spaced on-line zeros, one off-line
   pair). Lemma 5 proves the same order for one quartet in any configuration in terms of `|L_1(z_1)|`, but a
   uniform `q_*` over all configurations allowed unconditionally (clusters of off-line zeros, small gaps) is
   OPEN and could be smaller. All ratios in section 6.2 use the sea-model `q`.
3. Numerics: floating point, finite grids (step 0.01 and 0.002), windows of length 8 to 40 at heights up to 1e8;
   sup norms on a grid are lower bounds; Lawson iteration gives an upper bound for the optimum in a finite
   basis, so the DH rows show consistency with the floor, not a certified lower bound; the DH Blaschke tail
   above height 200 is not included; the constant `C` in the BMO row and in Proposition 6 is not computed.

## Files

- `tmp/research-2026-11-16/push/stack-quantum-gap/RESULT.md`
- `toy.py`, `toy.log`: sea model, rational models, Hankel SVD, Lawson, `alpha -> infinity`.
- `common.py`, `zeta_approx.py`, `zeta_approx.log`, `zeta_approx.json`: candidates on five windows.
- `ratio.py`, `ratio.log`: Poisson-`L^1` error against the quantum.
- `dh.py`, `dh.log`: DH poles, quanta, windowed best approximation for DH and zeta.
- Remote copies: `[compute-server]:~/rh-push/stack-quantum-gap/`.
