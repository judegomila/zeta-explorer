# n3-pellikaan-weil-interval: the set of u for which Pellikaan's two-variable zeta has all zeros on the circle

Date: 2026-11-17. Internal work, no referee. All runs local, through `scripts/memcap.sh 8`, single process,
longest run 100 s. No ssh.

**Verdict: precise obstruction, with a proved genus-2 lemma.** RH is open. No statement about zeros of zeta.

- The first lemma as assigned is false in a finite number of cases and true otherwise: for genus 2 the set `I_C`
  is a closed interval whenever the class number `h >= 50`; for `h <= 49` exactly nine integer pairs `(N_1,h)`
  give two components (Lemma 2). Four of these occur for curves over F_3, F_5, F_7.
- `I_C` is explicit in `(N_1,h)`; the typical lower endpoint is a collision of two zeros on the circle at
  `u_- = q - (sqrt m_2 - sqrt m_1)^2`, `m_i = |1 - alpha_i|^2`, not a central zero.
- Decision output: the margin in `u` shrinks with `g`. Measured median log-length of the component containing `q`
  is `c_g q^{-g/2}` with `c_g = 3.9, 2.7, 1.7, 1.45, 1.2` for `g = 1..5`. In the sense of the assignment the loss
  of margin is arithmetic (it is set by the gaps between Frobenius angles and scales with the conductor `q^g`),
  not archimedean.
- Endpoints are exactly the degenerations of the two Hankel (Rosati trace) forms of the virtual Frobenius; the
  condition is an interval condition and does not use a point count. The point count enters only at `u = q`,
  where it is what places `q` inside `I_C`.

Labels: PROVED / CLASSICAL / MEASURED / ARGUED / OPEN.

---

## 1. Plan and relation to closed rows

Read: BRIEF.md (all notices), OBSTRUCTION_MAP.md rows T1-T3, `ap-hodge-index/RESULT.md`.

| Closed item | What it has | What this lane adds |
|---|---|---|
| T3 (`ff-transplant`) | "the separating step over F_q is existence of sections, not the Euler product" (argued) | a one-parameter family that keeps the class data and the functional equation and drops the Euler product; the exact set where the zeros stay on the circle |
| T2 | fake numerator `1 - 5T + 5T^2` | this fake is the genus-1 Pellikaan numerator with `h = 1` at `u = 5`, outside `I = (0,4]` (section 3) |
| `ap-hodge-index` | Weil form has one positive eigenvalue iff RH (restatement) | finite analogue: two Hankel forms; which one degenerates at each endpoint (section 6) |

## 2. Set-up

`C` a curve of genus `g` over F_q, `b_{n,k}` = number of divisor classes of degree `n` with `h^0 = k`,
`h` = class number.

    Z_C(T,u) = sum_n sum_k b_{n,k} (u^k - 1)/(u - 1) T^n = P_C(T,u) / ((1 - T)(1 - uT)).

CLASSICAL (Pellikaan 1996): `P_C` has degree `2g` in `T`; `P_C(T,u) = u^g T^{2g} P_C(1/(uT),u)`;
`P_C(T,q) = L_C(T)`; `P_C(1,u) = h`. The data are `b_{n,k}` for `n <= g-1` and `h`; Riemann-Roch gives
`b_{2g-2-n, k+g-1-n} = b_{n,k}`.

Write `P_C(T,u) = prod (1 - alpha_i T)(1 - (u/alpha_i) T)`, `t_i = alpha_i + u/alpha_i`,
`m_i = 1 + u - t_i` (equal to `|1 - alpha_i|^2` when `|alpha_i| = sqrt u`). All zeros lie on `|T| = u^{-1/2}`
iff all `t_i` are real in `[-2 sqrt u, 2 sqrt u]` iff all `m_i` are real in `[(sqrt u - 1)^2, (sqrt u + 1)^2]`.
`I_C` is the set of `u > 0` where this holds.

PROVED (symbolic, `msym.py`, generic `b_{n,k}`, `g = 2,3,4`): with `M_u(m) = prod (m - m_i)`,

- `prod m_i = h` for every `u` (this is `P_C(1,u) = h`);
- `sum m_i = N_1 + (g-1)(u+1)`, i.e. `sum t_i = 1 + u - N_1`;
- `dM_u/du` is divisible by `m`, so `dm_i/du = m_i W(m_i,u) / prod_{j != i} (m_i - m_j)` with `W` a polynomial
  of degree `g-2` in `m`. `g = 2`: `W = 1`. `g = 3`: `W = 2m - 2u - N_1 - b_{2,2}`.

Hyperelliptic input (CLASSICAL): for `n <= g-1` the classes with `h^0 = r+1` are `r g^1_2 + D'`, `D'` a rational
effective divisor of degree `n - 2r` containing no hyperelliptic fibre; their number `R_m` is obtained from the
effective-divisor counts `A_m` by `A_m = sum_j R_{m-2j} (q^{j+1}-1)/(q-1)`. So `P_C(T,u)` is determined by
`(N_1,...,N_g, q)`. Self-tests asserted for every tuple in `pell.py`: degree `2g`, `P_C(T,q) = L_C(T)`,
functional equation, `P_C(1,u) = h`.

## 3. Genus 1 (PROVED)

`P = 1 + (N - 1 - u)T + uT^2`, `m = N` constant. `I_C = [(sqrt N - 1)^2, (sqrt N + 1)^2]`. Upper endpoint:
zero at `T = +u^{-1/2}` (`Z_C(u^{-1/2},u) = 0`); lower endpoint: zero at `T = -u^{-1/2}`.

Integer `u` in `I_C`: `t = 1 + u - N` is an integer with `t^2 <= 4u`, so `phi^2 - t phi + u = 0` defines an
endomorphism `phi` of the complex torus `C / Z[phi]` (or multiplication by `+-sqrt u` when `t^2 = 4u`), of degree
`u`, with `#Fix(phi^n) = |1 - phi^n|^2`, and `Z_C(T,u) = exp(sum #Fix(phi^n) T^n / n)`. So for genus 1 every
integer point of `I_C` has an Euler product with non-negative integer exponents (orbits of `phi`), and the
endpoints are the cases `phi = +-sqrt u` where the Castelnuovo-Severi inequality for the graph of `phi` is an
equality. Outside `I_C` the same formula gives a hyperbolic integer matrix on the real 2-torus with no invariant
complex structure.

## 4. Genus 2 (Lemma 2, PROVED; the finite part by certified computation)

`b_{1,1} = N_1`, `b_{2,2} = 1`, `b_{2,1} = h - 1`, hence

    P_C = 1 + p_1 T + p_2 T^2 + u p_1 T^3 + u^2 T^4,   p_1 = N_1 - 1 - u,   p_2 = h - N_1 + (2 - N_1) u.

**(a)** `P_C(T,u)` depends only on `(N_1,h)`. Two genus-2 curves over different fields with the same `(N_1,h)`
have the same two-variable zeta. In the virtual point counts: `N_1' = N_1`, `N_2' = N_2 + 2(u - q)`.

**(b)** `m_1 <= m_2` are the roots of `m^2 - (N_1 + 1 + u) m + h`. With `r = sqrt m_2 >= h^{1/4}` as parameter,
`u = r^2 + h/r^2 - N_1 - 1` is increasing in `r`, and `u` is in `I_C` iff

1. `u >= u_d := 2 sqrt h - N_1 - 1` (discriminant; collision `m_1 = m_2`),
2. `psi(r) := r^2 - 2 sqrt h / r <= N_1 + 2` (this is `m_1 >= (sqrt u - 1)^2` on the side `sqrt u >= 1`; zero at `T = +u^{-1/2}`),
3. `chi(r) := r^2 + 2 sqrt h / r >= N_1 + 2` (the side `sqrt u <= 1`, active only when `m_1 < 1`),
4. `phi(r) := h/r^2 + 2r >= N_1 + 2` or `r <= 1` (this is `m_2 <= (sqrt u + 1)^2`; zero at `T = -u^{-1/2}`).

`psi` and `chi` are increasing on `r >= h^{1/4}`, `phi` is convex with minimum `3 h^{1/3}` at `r = h^{1/3}`.

**(c)** Hence `I_C = J \ G`, with `J` a closed interval (conditions 1-3) and `G` one open interval (where
condition 4 fails). `I_C` has at most two components.

**(d)** A second component needs a point `r_b >= h^{1/3}` with `phi(r_b) = N_1 + 2 >= psi(r_b)`, and
`psi <= phi` iff `r^2 - 2r - sqrt h <= 0` iff `r <= 1 + sqrt(1 + sqrt h)`. `h^{1/3} > 1 + sqrt(1 + sqrt h)` for
`h >= 65`. So `I_C` is an interval for `h >= 65`.

**(e)** `h <= 80`: all integer pairs `0 <= N_1 <= 40`, `1 <= h <= 80` scanned with certified root isolation
(`g2_all.py`; for `N_1 > 40`, `h <= 80` the set is empty because `m_2 >= (N_1+1+u)/2` contradicts
`m_1 m_2 = h`, `m_1 >= (sqrt u-1)^2`, `m_2 <= (sqrt u+1)^2`). Result: 3280 pairs, 2546 with `I_C` empty, exactly
nine disconnected:

| `(N_1,h)` | `I_C` |
|---|---|
| (5,12) | [0.9282, 1] and [2.6813, 4.5687] |
| (6,16) | {1} and {5} |
| (6,17) | [1.2462, 1.2875] and [4.5596, 5.1529] |
| (6,18) | [1.4853, 1.6972] and [4, 5.3028] |
| (7,25) | [2, 2.25] and {6} |
| (7,26) | [2.1980, 2.7325] and [5.3917, 6.1258] |
| (8,36) | [3, 4] and {7} |
| (8,37) | [3.1655, 5.1624] and [5.7304, 7.1072] |
| (9,49) | [4, 6.25] and {8} |

Realised by curves: (5,12) over F_3; (6,16) over F_5 (`L = (1 - 5T^2)^2`, `I_C` contains `q = 5` as an isolated
point); (8,36) over F_3 and over F_7 (`L = (1+2T+3T^2)^2` at `u = 3`, `L = (1 - 7T^2)^2` at `u = 7`);
(9,49) over F_5.

**(f)** Endpoints of the component containing `q`. If `m_2(q) <= m_1(q)^2` (always for `q >= 9`), `q` lies on
the branch where `phi` decreases and the component is `[max(u_d, .), min(u(r_a), u(r_c))]`. Lower endpoint
`u_d`, a double zero on the circle away from the real axis, with

    q - u_d = (sqrt m_2 - sqrt m_1)^2   evaluated at u = q   (about (t_1 - t_2)^2 / 4q, at most about 4).

Upper endpoint: a zero at `T = +u^{-1/2}` (condition 2) or `T = -u^{-1/2}` (condition 4).

**(g)** Flow: `d log m_i / du = 1/(m_i - m_j)`. Increasing `u` repels the two `m_i` (they exit through the ends
of the window `[(sqrt u-1)^2, (sqrt u+1)^2]`), decreasing `u` attracts them (they collide at `u_d`). The window
has width `4 sqrt u` while the speed is `m_i/(m_2 - m_1)`, about `sqrt q`; this is why the margin in `u` is
`O(1)` for genus 2 against `O(sqrt q)` for genus 1.

## 5. First test (certified: integer polynomials, Arb root isolation, exact rational sample points)

Enumeration (`enum_curves.py`): all `y^2 = f(x)`, `f` squarefree of degree `2g+1` or `2g+2`, leading coefficient
1 or a fixed non-residue; `N_k` by evaluation over `F_{q^k}`. Check: `g=2`, `q=3` gives 1296 models
(`= 2(162+486)`), genus 1 gives exactly the Hasse range.

`I_C` (`pell.py`): critical values are the positive roots in `s = sqrt u` of the `y`-discriminant (collision) and
of `G(+-2s, s^2)` (central zeros at `T = +-u^{-1/2}`); membership is decided at one rational point between
consecutive critical values; isolated points are tested exactly at rational `u`.

| g | q | tuples | single interval | lower endpoint: collision / central | upper endpoint: central / collision | median log-length | `q^{g/2}` x median | `q^{g/2}` x max |
|---|---|---|---|---|---|---|---|---|
| 1 | 3 | 7 | 7 | 0 / 7 | 7 / 0 | 2.061 | 3.57 | 6.11 |
| 1 | 5 | 9 | 9 | 0 / 9 | 9 / 0 | 1.734 | 3.88 | 7.88 |
| 1 | 7 | 11 | 11 | 0 / 11 | 11 / 0 | 1.478 | 3.91 | 6.97 |
| 2 | 3 | 50 | 48 | 48 / 2 | 50 / 0 | 0.847 | 2.54 | 5.98 |
| 2 | 5 | 115 | 113 | 114 / 1 | 115 / 0 | 0.532 | 2.66 | 5.77 |
| 2 | 7 | 192 | 191 | 191 / 1 | 192 / 0 | 0.383 | 2.68 | 5.18 |
| 3 | 3 | 297 | 296 | 231 / 66 | 243 / 54 | 0.359 | 1.86 | 4.61 |
| 3 | 5 | 1723 | 1723 | 1325 / 398 | 1101 / 622 | 0.157 | 1.75 | 4.14 |
| 3 | 7 | 1500 of 5231 (sample) | 1500 | 1159 / 341 | 841 / 659 | 0.0887 | 1.64 | 3.98 |
| 4 | 3 | 2462 | 2459 | 2440 / 22 | 1851 / 611 | 0.162 | 1.45 | 3.76 |
| 5 | 3 | 1500 of 25504 (sample) | 1500 | 1366 / 134 | 868 / 632 | 0.0769 | 1.20 | 2.78 |

"Log-length" is `log(u_+/u_-)` for the component of `I_C` containing `q`. `q` is in `I_C` for every tuple
(as it must be). Genus 3-5 rows are hyperelliptic curves only.

Position of `q` in the component (median `log(q/u_-)` | median `log(u_+/q)`): g=2: 0.316 | 0.427 (q=3),
0.190 | 0.242 (q=5), 0.140 | 0.169 (q=7); g=3: 0.129 | 0.178 (q=3), 0.060 | 0.069 (q=5), 0.034 | 0.040 (q=7);
g=4, q=3: 0.063 | 0.080; g=5, q=3: 0.031 | 0.036. `q` sits slightly below the middle. Tuples with zero margin
(`q` is an endpoint; repeated Frobenius eigenvalue or a zero at `+-q^{-1/2}`): 4/50, 8/115, 10/192 (g=2),
4/297, 28/1723 (g=3), 33/2462 (g=4). In 1+1 (g=2), 4 (g=3, q=5), 3 (g=3, q=7 sample), 1 (g=4), 1 (g=5 sample)
tuples `I_C`'s component is the single point `{q}`.

Shared families (genus 2, PROVED consequence of 4(a), listed from the data): 52 pairs `(N_1,h)` occur over two
of the fields F_3, F_5, F_7. In 51 of them both prime powers lie in one component of `I_C`, so the family joins
two Weil zeta functions with all zeros on the circle throughout; the exception is (8,36).

Closed-form check (`g2_closed.py`): the conditions of 4(b) reproduce the certified components for all 357
genus-2 tuples on a grid of step 0.01 (the one flagged tuple is (6,16), where the grid point `u = 5` is the
isolated member).

## 6. Endpoints and Hodge-index data

Let `p_k = sum_i t_i^k` (polynomials in `u` and the class data). `H_1 = [p_{i+j}]`,
`H_2 = [4u p_{i+j} - p_{i+j+2}]`, `0 <= i,j < g`.

CLASSICAL (Hermite): for distinct `t_i`, all `t_i` real in `(-2 sqrt u, 2 sqrt u)` iff `H_1 > 0` and `H_2 > 0`.
MEASURED: 1020/1020 exact agreements at random rational `u` (`controls.py`; 427 failures had `H_1 > 0` and `H_2`
not; none had `H_2 > 0` without `H_1 > 0`).

Dictionary (CLASSICAL at `u = q`): with `phi` the Frobenius correspondence and `phi'` its transpose,
`y = phi + phi'`, the forms are the Rosati trace form `Tr(x x')` on the symmetric elements `R[y]` (`H_1`) and on
the antisymmetric elements `(phi - phi') R[y]` (`H_2`, since `-(phi - phi')^2 = 4q - y^2`). Their positivity is
the Hodge index theorem on `C x C` applied to combinations of the graphs of Frobenius powers.

- Collision endpoint: `det H_1 = 0`. Extremal class: `v(y) = prod over distinct t_k of (y - t_k)` (degree `g-1`),
  a symmetric class with self-pairing zero. Genus 2: `Gamma + Gamma' - t* Delta` modulo fibres.
- Central endpoint: `det H_2 = 0`. Extremal class: `(phi - phi') prod_{k != k*} (y - t_k)`, antisymmetric. Genus 1:
  `Gamma - Gamma'`, the Castelnuovo-Severi equality case `phi = +-sqrt u`.

For integer `u` in `I_C` and squarefree `P_C(.,u)` the CM construction (CLASSICAL, Shimura-Taniyama) gives a
complex abelian variety of dimension `g` with an endomorphism `phi`, `phi phi' = u`, with this characteristic
polynomial; for prime-power `u` Honda-Tate gives one over F_u up to a power. So on integer points "zeros on the
circle" is equivalent to "is the characteristic polynomial of a polarised endomorphism". This is an equivalence
found after the fact; it supplies no source of positivity at `u != q`.

Does the failing step use the point count? No. For `u != q` there is no surface, no Frobenius and no point
count, and the zeros stay on the circle on a set with non-empty interior for all but a few tuples. Leaving the
circle is the sign change of `det H_1` or `det H_2`, an interval condition on polynomials in `u`. The point count
enters once: at `u = q` the numbers `p_k` are intersection numbers of actual divisors `Gamma_n` on `C x C`
(`Gamma_n . Delta = N_n`, `deg Frob^n = q^n`), and that is what proves `q` is in `I_C`.

## 7. Decision output

MEASURED: the log-length of the component containing `q` is `c_g q^{-g/2}`, `c_g = 3.9, 2.7, 1.7, 1.45, 1.2`
(`g = 1..5`), and the maximum over all curves obeys the same law with constants 7.9, 6.0, 4.6, 3.8, 2.8. The
ratio between consecutive genera at `q = 3` is 2.43, 2.36, 2.22, 2.11.

ARGUED: `dm_i/du = m_i W / prod_{j != i}(m_i - m_j)` with `W` of size `q^{g-2}`, `m_i` of size `q`, differences
of size `sqrt q`: speed about `q^{(g-1)/2}`, distance to the next collision or to the window edge at most
`4 sqrt q`, so the margin in `u` is about `q^{1-g/2}` and in `log u` about `q^{-g/2}`, the inverse square root
of the conductor `q^g`. Not proved for general `g`.

The margin shrinks with `g`, geometrically. In the assignment's terms the loss of margin is arithmetic. For an
object with infinitely many zeros the analogue is zero margin: the point `u = q` is a boundary or isolated point
of the on-circle set in the limit. This matches the known status of the heat-flow parameter for zeta
(the de Bruijn-Newman constant is `>= 0`), and it means the `u`-family cannot supply an open condition around
the arithmetic point.

## 8. Controls

- **DH analogue 1 (linear combination, same functional equation).** Midpoints of two genuine genus-2 numerators
  over the same F_q have a zero off the circle in 73/1225 (q=3), 458/6555 (q=5), 1343/18336 (q=7) pairs
  (the upper boundary `a_2 <= a_1^2/4 + 2q` of the Weil region is not concave). Integer example over F_3:
  `(a_1,a_2) = (3,7)` and `(-3,7)` average to `1 + 7T^2 + 9T^4`, `T^2 = (-7 +- sqrt 13)/18`, not of modulus 1/3: zeros off
  the circle. In genus 1 the Weil region is an interval and convex combinations stay on the circle.
- **DH analogue 2 (class data without sections).** Formal genus-2 data `(N_1,h)` with `0 <= N_1 <= h <= 80`,
  `N_1 <= 40`: the numerator has the functional equation and the Riemann-Roch symmetry for every `u`, and
  `I_C` is empty in 1769 of 2500 cases (`g2_formal.py`). Genus 1: `h = N = 1` gives `I = (0,4]`, and the T2 fake
  `1 - 5T + 5T^2` is this numerator at `u = 5`. So functional equation plus Riemann-Roch numerics do not give a
  non-empty `I_C`, and Euler product plus functional equation plus rationality (the T2 fake) do not give
  membership.
- **Heat flow.** Genus 2: in the coordinate `m` the `u`-flow is the two-body law `d log m_i/du = 1/(m_i - m_j)`,
  repulsive for increasing `u`, the same form as the heat-flow zero dynamics. It differs in three ways: the
  centre of the functional equation moves (`|T| = u^{-1/2}`), `prod m_i = h` is conserved, and the zeros are
  confined to a window, so increasing `u` also ends in an exit (through `T = +-u^{-1/2}`). For `g >= 3` the
  numerator `W` is not a sum of pair terms (`g = 3`: `2m - 2u - N_1 - b_{2,2}` against `3m - N_1 - 2u - 2`).
  So `u` is not the heat axis, but in genus 2 it has the same local collision mechanism.
- **Sign twist.** The twist keeps an Euler product and loses the functional equation. The `u`-family does the
  opposite: functional equation for all `u`, Euler product with non-negative integer exponents only at special
  `u` (in genus 1: all integers of `I_C`).

## 9. Kill criteria

- "`I_C` not an interval": occurs for nine pairs `(N_1,h)`, all with `h <= 49`, four realised by curves in the
  test range; an interval for all `h >= 50` in genus 2. For `g = 3,4,5` over F_3, F_5, F_7: 1 of 297 and 3 of
  2462 tuples have two components, none in the other rows. The lemma is corrected, not killed.
- "No relation between endpoints and Hodge-index data": the relation is exact (section 6).
- The idea as a route is closed by section 7: the margin around `u = q` goes to zero with the conductor.

No pivot taken.

## 10. Three weakest steps

1. The scaling law `q^{-g/2}` is measured for `g <= 5`, `q <= 7`, hyperelliptic curves only for `g >= 3`, with
   random samples of tuples in two rows; the derivation in section 7 is a size heuristic (no control of
   cancellation in `W`), and medians are over distinct tuples, not weighted by curves.
2. The hyperelliptic formula for `b_{n,k}` (`n <= g-1`) is taken from the classical description of special
   divisors and was not checked by an independent Riemann-Roch computation; the asserted self-tests
   (`P(T,q) = L`, functional equation, `P(1,u) = h`) do not test the split of classes by `h^0` on their own.
   Genus 2 does not depend on it.
3. Isolated points of `I_C` are certified only at rational `u`; for `g >= 3` a critical value that is a multiple
   root or a coincidence of two events at irrational `u` would be reported as "undetermined" (count 0 in all
   `g >= 3` rows after excluding simple single events, which cannot give isolated members). The transfer from
   "finite `g`, margin `q^{-g/2}`" to "zeta has zero margin" is an analogy, not a statement about zeta.

## Files

`enum_curves.py` (enumeration), `pell.py` (numerator, `I_C`), `run_table.py` (tables), `g2_all.py`,
`g2_closed.py`, `g2_formal.py`, `msym.py`, `controls.py`; data `enum_q*_g*.json`, `IC_q*_g*.json`; logs
`table_*.log`.
