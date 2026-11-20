# REFEREE2: second, independent pass on Theorem A' of `c2-jinner-multidelay-lft/RESULT.md`

Date: 2026-11-18. Written in this lane's directory because the assignment does not allow a file in the reviewed lane.
Scope: Theorem A' (Section 4 of the reviewed note), facts F1-F3 as far as Theorem A' uses them, and the DH
(conductor 5) moment formula of Section 5. Lemma R, R', Theorem C and Proposition L were not re-derived here (first
referee only). No statement about zeros of zeta is made or supported.
Labels: PROVED (derived in this pass), CLASSICAL, MEASURED-BALL (python-flint ball arithmetic; what is and is not
inside the balls is stated), MEASURED (mpmath quadrature, not interval).
Files: `ref2_abel.py`, `ref2_abel_{author,zeta,dh}.log/.json`, `ref2_step3.py/.log/.json`, `ref2_lg.py/.log/.json`.
All runs local through `scripts/memcap.sh 8` (longest 167 s). The compute server was not used.

## Outcome

**Theorem A' holds.** Every step was re-derived; no step failed. The DH moment formula, labelled OUTLINE in the
reviewed note, is derived line by line below (Section 3) and agrees with the note's main term; its status is now
"PROVED, one derivation (this referee)". Proposition E then gives the DH sign as stated. Numerically the main term
and the second-order term were checked in ball arithmetic for zeta and for DH on an example with complex pairing
values: the remainder `S - M/(2 pi delta) - Sec` stays bounded and converges as `delta -> 0` while `S` grows to about
470. Five remarks are listed in Section 5; none changes the statement.

## 1. Theorem A', step by step

Setting: `h(z) = H((p^{-z})_p)`, `H` holomorphic on `B` with `Re H >= 0`; boundary measure of `Re h` on `Re z = 0`
equal to `pi sum r_j delta_{gamma_j}`, locally finite.

**F1 (used in steps 1, 2, 4). Holds.** For the restriction `H_N` to the first `N` variables the power series converges
absolutely on the polydisc and `|a_m| <= 2 Re a_1` (Caratheodory). The truncations `w^(N) -> w` in `c_0`, `H` is
continuous, and for `Re z > 1` dominated convergence (`sum m^{-sigma} < infinity`) gives `h(z) = sum a_m m^{-z}`.

**F2 (boundedness on `D^inf ∩ c_0`; used in steps 0 and 4). Holds, and by a shorter argument than the note fears.**
`B = D^inf ∩ c_0` is the open unit ball of `c_0` (a null sequence attains its supremum). `K_eps = {|w_p| <= p^{-eps}}`
is closed and totally bounded in `c_0` (tails are uniformly below `p^{-eps} -> 0`), hence compact, and
`K_eps` lies in `B` (`sup <= 2^{-eps} < 1`). `H` is continuous on `B`: if "holomorphic" means Frechet-holomorphic
this is immediate; if it means Gateaux-holomorphic, the Cayley transform `(H - 1)/(H + 1)` is Gateaux-holomorphic
and bounded by 1, hence continuous, and so is `H`. So `sup_{Re z >= eps} |h| <= max_{K_eps} |H| < infinity`. The
Hilbert-Bohr correspondence for `H^infinity` (weak step 1 of the note) is not needed. Consequence used later: `h` has
no linear term, and `h*(w) = conj h(conj w)` is bounded on `Re w >= eps`.

**F3. Holds.** Harnack on the slice `zeta -> H(zeta w/rho)`, `rho = sup |w_p|` (the slice stays in `B`):
`Re H(w) >= Re H(0) (1 - rho)/(1 + rho)`; at `rho = 2^{-1/2}` the factor is `3 - 2 sqrt 2`. For smaller `rho` the
bound improves, so it holds for every prime set.

**Reflection.** `h(z) = i b + sum_j r_j [1/(z - i gamma_j) + regulariser]` (Herglotz, atomic measure, no linear
term), so the residue at `i gamma_j` is `r_j` and `h(z) = -h*(-z)`. Holds.

**Step (0). Holds.** `Re h(1 + iy) = sum_j r_j/(1 + (y - gamma_j)^2)` gives
`sum_{gamma_j in [T, T+1]} r_j <= (5/4) sup_y Re h(1 + iy)`, finite by F2 (the note's constant `2 pi` for the measure
is consistent). Heights `T_n` with `int |h(x + i T_n)| dx <= C` exist by averaging `1/|x + i(T - gamma_j)|` over
`T in [n, n+1]`. Orientation of the rectangle: sum of residues `= R - Lf + top + bottom`; the top side tends to 0 for
fixed `delta > 0`; the bottom side is `O(1)` uniformly in `delta <= 1` since `t_0` is not a pole height (on
`-c <= x < 0` use `h = -h*(-z)`). The pole of `zeta(1/2 + z)` at `z = 1/2` is outside `|x| <= c < 1/2`.

**Step (1). Holds.** Shift to `Re z = 2`: no pole with `t >= t_0 > 0`; `h` bounded on `Re z >= c` (F2), so the far
horizontal segment vanishes. The `k = 1` term is `a_1 e^{2 i delta - delta t_0}/(2 pi delta) = a_1/(2 pi delta) + O(1)`;
the terms `k >= 2` are bounded by `sum |d_k|/(2 pi log 2)`.

**Step (2). Holds.** `-Lf = (e^{-2 i delta}/2 pi) int_{t_0}^inf zeta(-3/2 + it) h*(2 - it) e^{-delta t} dt + O(1)`;
`zeta(5/2 - it) h*(2 - it) = sum_k e_k k^{it}`, `e_k = sum_{nm = k} n^{-5/2} conj(a_m) m^{-2}`, `sum |e_k| < infinity`;
sum and integral may be interchanged (absolute convergence: `|chi(-3/2 + it)| << t^2`, weight `e^{-delta t}`).

**Step (3), uniformity in `k`. Holds.** Recomputed: `chi - chi_+ = -(i/2 pi)(2 pi)^s e^{i pi s/2} Gamma(1 - s)`, of
size `<< t^2 e^{-pi t}` on `Re s = -3/2`, `t >= 0`; `|chi_+(-3/2 + it)| e^{-delta t} << t^2 e^{-(pi - delta)|t|}` for
`t <= 0`. Hence for every real `k > 0` (integrality not used here)

    | J_k - (1/2 pi) int_R chi_+(-3/2 + it) k^{it} e^{-delta t} dt |  <=  C(delta),
    C(delta) = (1/2 pi) [ int_{t_0}^inf |chi - chi_+| e^{-delta t} dt + int_{-inf}^{t_0} |chi_+| e^{-delta t} dt ],

and `C(delta)` does not contain `k` because `|k^{it}| = 1`. `C` is increasing as `delta` decreases and bounded for
`delta <= 1`. MEASURED (`ref2_step3.py`, `t_0 = 1`): `C(1) = 0.00497`, `C(0.3) = 0.00539`, `C(0.01) = 0.00598`; the
actual differences for `k = 1, 2, 5, 30, 1000` are `0.0048, 0.0038, 0.0028, 0.0017, 0.0010` at `delta = 0.01`, all
below `C`. The total error of step (3) is at most `C sum |e_k| = O(1)`.
Mellin-Barnes: with `u = 1 - s` the full-line integral is `(i Y/2 pi) k^{3/2} e^{3 i delta/2} e^{-Y}`,
`Y = 2 pi k e^{-i(pi/2 - delta)}`, `|arg Y| < pi/2`, and `i Y/(2 pi) = k e^{i delta}`: value
`k^{5/2} e^{5 i delta/2} exp(-2 pi k sin delta + 2 pi i k cos delta)`. This equals
`k^{5/2} e^{5 i delta/2} e^{2 pi i k} exp(-2 pi k eta)`, `eta = i(1 - e^{i delta})`; the factor `e^{2 pi i k}` is 1
exactly when `k` is an integer. Holds. (For conductor 5 the same computation at `k/5` is where `e(k/5)` appears.)

**Step (4), the Mellin shift. Holds.** `e_k k^{5/2} = sum_{nm = k} conj(a_m) m^{1/2}`. The double sum
`sum_{n,m} conj(a_m) m^{1/2} e^{-2 pi n m eta}` converges absolutely (`Re eta = sin delta > 0`) and equals
`(1/2 pi i) int_{(3)} Gamma(w) (2 pi eta)^{-w} zeta(w) h*(w - 1/2) dw` (`|arg eta| = delta/2`; on `Re w = 3` the
Dirichlet series of `h*(w - 1/2)` converges absolutely by F1). In `1/2 + eps <= Re w <= 3`: `h*(w - 1/2)` is
holomorphic and bounded (F2), `zeta` has the single pole `w = 1`, `|Gamma(w)(2 pi eta)^{-w}| << |eta|^{-Re w}
|Im w|^{Re w - 1/2} e^{-(pi - delta)|Im w|/2}`. Residue at `w = 1`: `h*(1/2)/(2 pi eta)`; with the prefactor
`e^{i delta/2}` this is `conj h(1/2)/(4 pi sin(delta/2)) = conj h(1/2)/(2 pi delta) + O(delta)`. The integral on
`Re w = 1/2 + eps` is `O(delta^{-1/2-eps})` uniformly in `delta <= 1`. Holds.

Beyond the theorem (sketch, consistent with the first referee's Section 2): `h*(w - 1/2)` has simple poles at
`w = 1/2 - i gamma_j` (all `j`, both signs) with residue `r_j`, and `h*(w - 1/2) = -h(1/2 - w)` is bounded on
`Re w <= 1/2 - eps`. Moving the line to `Re w = -1/2` (through heights chosen as in step (0), and past the pole of
`Gamma` at 0) gives

    S(delta) = (a_1 + conj h(1/2))/(2 pi delta) + Sec(delta) + O(1),
    Sec(delta) = e^{i delta/2} sum_j r_j Gamma(1/2 - i gamma_j) (2 pi eta)^{-1/2 + i gamma_j} zeta(1/2 - i gamma_j),

`Sec = O(delta^{-1/2})`. This expansion is what Section 4 below tests.

**Step (5). Holds.** `Re(a_1 + conj h(1/2)) >= (1 + 3 - 2 sqrt 2) Re a_1`.

**Theorem B' as a consumer of A'.** With every pole at a zero of `zeta(1/2 + z)` the left side vanishes for every
`delta`, so `a_1 + conj h(1/2) = 0`, hence `Re a_1 = 0`. The hypothesis of B' implies RH; the proof does not assume it.

## 2. What the infinite-P case does and does not cover (remark, no error)

For an infinite prime set the hypothesis "atomic, locally finite boundary measure" is restrictive: a separable sum
`sum_p c_p (1 + w_p)/(1 - w_p)` over infinitely many primes has poles `2 pi k/log p`, which are dense on the axis. No
non-constant member with infinitely many active primes and a locally finite atomic measure is exhibited in the note
or here. Theorem A' is correct as stated for any prime set; in Theorem B' the hypothesis is supplied by
`0 <= mu_h <= mu_{alpha L}`, and the conclusion is that the class is empty apart from constants. Whether the
infinite-P instance of A' has any non-constant example outside B' is not established. This does not affect the closure.

## 3. DH (conductor 5) moment formula, line by line (PROVED in this pass; one derivation)

`chi` mod 5, `chi(2) = i` (odd), `f = c_1 L(s, chi) + c_2 L(s, conj chi)`, `c_1 = (1 - i kappa)/2`, `c_2 = conj c_1`,
`f_m = c_1 chi(m) + c_2 conj chi(m)`, `f_1 = 1`.

(D1) Functional equation. For odd primitive `chi` mod `q`: `L(s, chi) = eps(chi) q^{1/2 - s} X_c(s) L(1 - s, conj chi)`,
`X_c(s) = 2 (2 pi)^{s-1} Gamma(1 - s) cos(pi s/2)`, `eps(chi) = tau(chi)/(i sqrt q)`, `eps(conj chi) = conj eps(chi)`
(CLASSICAL). `f(s) = 5^{1/2 - s} X_c(s) f(1 - s)` holds iff `eps(chi) c_1 = c_2`. MEASURED-BALL (`ref2_abel.py`):
`eps(chi) c_1 - c_2 = 0 +- 2e-29`; `f(s) - 5^{1/2-s} X_c(s) f(1 - s) = 0 +- 8e-28` at `s = 0.3 + 2.3333 i`.

(D2) Steps (0), (1) are unchanged (`f` is entire, `f_1 = 1`): `R = a_1/(2 pi delta) + O(1)`.

(D3) Step (2) with `f(-3/2 + it) = 5^{2 - it} X_c(-3/2 + it) f(5/2 - it)` and
`f(5/2 - it) h*(2 - it) = sum_k e'_k k^{it}`, `e'_k = sum_{nm = k} f_n n^{-5/2} conj(a_m) m^{-2}`.

(D4) Step (3). The dominant exponential of `cos(pi s/2)` for `t -> +infinity` is `e^{-i pi s/2}/2`, so
`X_{c,+}(s) = (2 pi)^{s-1} e^{-i pi s/2} Gamma(1 - s) = -i chi_+(s)`; the error bounds of step (3) are the same,
uniform in `k`. Then `5^{2 - it} X_{c,+} k^{it} = -25 i chi_+ (k/5)^{it}` and the real-`k` formula of step (3) at
`k/5` gives

    (1/2 pi) int_R 5^{2-it} X_{c,+}(-3/2 + it) k^{it} e^{-delta t} dt = -i 5^{-1/2} k^{5/2} e^{5 i delta/2} e(k/5) exp(-2 pi k eta/5),

`e(x) = e^{2 pi i x}`. So `-Lf = -i 5^{-1/2} e^{i delta/2} sum_{n,m} f_n e(nm/5) conj(a_m) m^{1/2} e^{-2 pi n m eta/5} + O(1)`.

(D5) Step (4). The double sum is `(1/2 pi i) int_{(3)} Gamma(w) (2 pi eta/5)^{-w} G(w) dw`,
`G(w) = sum_m conj(a_m) m^{1/2 - w} A_m(w)`, `A_m(w) = sum_n f_n e(nm/5) n^{-w}`. For `5 | m`: `A_m = f(w)`, entire.
For `(m, 5) = 1`: `e(a/5) = (1/4) sum_psi tau(conj psi) psi(a)` on `(a, 5) = 1`, so
`A_m(w) = (1/4) sum_psi tau(conj psi) psi(m) [c_1 L(w, psi chi) + c_2 L(w, psi conj chi)]`. Therefore

    G(w) = f(w) [h* - h*_{chi_0}](w - 1/2) + (1/4) sum_psi tau(conj psi) h*_psi(w - 1/2) [c_1 L(w, psi chi) + c_2 L(w, psi conj chi)],

`h*_psi(z) = sum_m conj(a_m) psi(m) m^{-z} = conj H((conj psi(p) p^{-conj z})_p)`. Each `h*_psi` is a Bohr lift of
`conj H` at a point of `K_eps` (`|psi(p)| <= 1`), hence holomorphic and bounded on `Re z >= eps` by F2. No uniform
convergence theorem for bounded Dirichlet series is needed (weak step 2 of the note): the pairing enters as the value
at `1/2` of these functions, not as a conditionally convergent series. In `Re w >= 1/2 + eps` the only pole is
`w = 1`, from `psi chi = chi_0` (`psi = conj chi`) and `psi conj chi = chi_0` (`psi = chi`), where
`L(w, chi_0) = zeta(w)(1 - 5^{-w})` has residue `4/5`:

    Res_{w=1} G = (1/5) [ c_1 tau(chi) h*_{conj chi}(1/2) + c_2 tau(conj chi) h*_chi(1/2) ].

(D6) Recombination. The main term of `-Lf` is
`(-i/sqrt 5) (5/(2 pi eta)) e^{i delta/2} Res G = (1/(2 pi delta)) [ eps(chi) c_1 h*_{conj chi}(1/2) + eps(conj chi) c_2 h*_chi(1/2) ] + O(delta)`,
using `-i tau(chi)/sqrt 5 = eps(chi)`, `-i tau(conj chi)/sqrt 5 = eps(conj chi)`. By (D1) `eps(chi) c_1 = c_2` and
`eps(conj chi) c_2 = c_1`. Result:

    sum_{gamma_j > t_0} r_j f(1/2 + i gamma_j) e^{-delta gamma_j}
        = ( a_1 + c_1 h*_chi(1/2) + c_2 h*_{conj chi}(1/2) )/(2 pi delta) + O(delta^{-1/2-eps}),

and `h*_chi(1/2) = conj H(w')`, `w'_p = conj chi(p) p^{-1/2}`; `h*_{conj chi}(1/2) = conj H(w'')`,
`w''_p = chi(p) p^{-1/2}`. This is the bracket of Section 5 of the note, for every prime set. For finite `P` it equals
`a_1 + sum_m f_m conj(a_m) m^{-1/2}`.

(D7) Proposition E. `sup |w'_p| <= 2^{-1/2}`, F3, `|1 + i kappa| = sqrt(1 + kappa^2)`: real part of the bracket
`>= (4 - 2 sqrt 2 sqrt(1 + kappa^2)) Re a_1 = 1.0597 Re a_1` (`kappa = 0.2840790438...` in ball arithmetic). An
imaginary constant in `H` cancels because `c_1 + c_2 = 1`. Holds.

Status of the consequences in the note: "the first-moment no-go holds for DH" now rests on a written derivation
(one author: this referee) plus the ball-arithmetic checks below. The first referee's correction 4 stands for `E_a`
(two gamma factors; step (3) does not give an exponential) and for general Dirichlet L-functions (not derived).

## 4. Numerical checks

### 4.1 Ball-arithmetic check of the lane's table entries (zeta and DH), `ref2_abel.py author`

`h = sum_{p in {2,3,7,11}} (1 + p^{-z})/(1 - p^{-z})`, `t_0 = 1`, poles `2 pi k/log p` up to height `45/delta_min`
(2195 poles). The sums are acb balls at 100 bits; the truncation tail is bounded separately with
`|F(1/2 + it)| <= t` for `t >= 100` (CLASSICAL convexity bounds, not re-derived): at most `2.7e-14`.

| function | `delta` | `2 pi delta * sum` (ball) | lane's value | predicted bracket |
|---|---|---|---|---|
| DH | 0.04 | 6.94134674210759 + 0.68009026486863 i (+- 5e-26) | 6.941 + 0.680 i | 7.65637153948424 |
| DH | 0.02 | 7.18956169887422 + 0.45346881789533 i (+- 5e-25) | 7.190 + 0.453 i | same |
| zeta | 0.04 | 10.30246347237356 + 0.15891259039326 i | 10.302 + 0.159 i | 17.63905332740768 |
| zeta | 0.02 | 12.22211728336060 + 0.09203701010399 i | 12.222 + 0.092 i | same |

The four DH and zeta entries of the lane's tables are certified as computed. The DH bracket computed from the Gauss
sums through (D5)-(D6) (no use of `eps c_1 = c_2`) is `7.656615...` at `delta = 0.04` and `7.656432...` at
`delta = 0.02`; the difference from `7.656372` is the factor `delta/(2 sin(delta/2))`, as it should be.
Remainder `D = S - M/(2 pi delta) - Sec`: DH `-2.6056 - 1.2281 i`, `-2.6580 - 1.2302 i`; zeta `4.7790 + 0.9747 i`,
`4.7874 + 0.9731 i` (for `delta = 0.04, 0.02`): stable while the main term doubles.

### 4.2 New example with complex pairing values, `ref2_abel.py zeta` and `dh`

`h = sum_p (1 + u_p p^{-z})/(1 - u_p p^{-z})`, `P = {2, 3, 7, 11}`, `u_p = e^{i phi_p}`,
`phi = (1.0, 2.0, 0.5, 4.0)`: poles `(phi_p + 2 pi k)/log p`, residue `2/log p`, no pole at 0; 17576 poles up to
height 18000; tail bound `1.7e-12` at the smallest `delta`. Brackets: zeta `M = 7.446835648 - 2.644517351 i`;
DH `M = 8.504948802 + 0.871971801 i`. `Sec` for DH is the sum over the four characters `psi` of the residues of
(D5) at the poles of `h*_psi(w - 1/2)` (truncated at `|Im w| <= 60`; the omitted terms are below `1e-35`, outside
the balls).

| `delta` | zeta: `2 pi delta S` | zeta: `D = S - M/(2 pi delta) - Sec` | DH: `2 pi delta S` | DH: `D` |
|---|---|---|---|---|
| 0.04 | 7.15088 - 2.43745 i | 0.82896 - 0.16086 i | 9.34641 + 1.74575 i | 0.74284 + 0.28827 i |
| 0.02 | 7.14790 - 2.44638 i | 0.83953 - 0.17291 i | 8.73501 + 1.58112 i | 0.73395 + 0.26516 i |
| 0.01 | 7.15088 - 2.31140 i | 0.84457 - 0.17881 i | 8.51776 + 1.30448 i | 0.72910 + 0.25373 i |
| 0.005 | 7.25312 - 2.24353 i | 0.84704 - 0.18172 i | 8.50484 + 1.06843 i | 0.72658 + 0.24805 i |
| 0.0025 | 7.37254 - 2.30032 i | 0.84825 - 0.18317 i | 8.52556 + 0.90684 i | 0.72530 + 0.24522 i |

Reading. With the main term alone the relative gap is between 0.5 and 14 percent, and for zeta it does not decrease
monotonically (4.6, 4.5, 5.6, 5.6, 4.5 percent; the `delta^{-1/2}` term oscillates): the first referee's correction 2 is confirmed. With `Sec` removed, `D` converges
(successive differences halve: `D = C + O(delta)`) while `S` grows to 469 (zeta) and 543 (DH). This tests, for zeta
and for DH: the main term with complex pairing values, the Gauss-sum recombination, the second-order residues, and
the `O(1)` size of everything else. It is a check on finite `P`; the infinite-P case rests on the proof.

### 4.3 Against the Landau-Gonek tables of `c2-euler-at-zeros-scale` (`ref2_lg.py`)

What the tables can and cannot test. The tables give `A_S = sum over zeta zeros of |zeta_S(1/2 + i gamma)|^2`: the
evaluated function is a Dirichlet polynomial in `m/n` and the poles are those of `zeta'/zeta`. Theorem A' is the
other pairing: zeta evaluated at the poles of a Dirichlet series `h`. Both are instances of one residue computation
with main term `(1/(2 pi delta)) sum_m F_m conj(g_m) m^{-1/2}` (`F` the evaluated series, `g` the series carrying
the poles): for A' this is `conj h(1/2)` (plus `a_1` from the right edge), for DH `sum f_m conj(a_m) m^{-1/2}`, for
Landau-Gonek `-Lambda(n)/sqrt n` and, summed over `S`-smooth pairs, `-2 c_P M_P`. The tables therefore test the
diagonal-pairing rule and its normalisation; they do not exercise steps (3)-(4) of Theorem A' (Mellin-Barnes
evaluation and Mellin shift), which Sections 4.1-4.2 test directly. No DH entry of `dhtab.txt` is used in this
check, and none is certified here (that needs certified DH zeros; the lane's DH zeros are float64).

Done, with zeros from `acb.zeta_zeros(1, 20000)` (rigorous isolation; heights to 18046.46) and ball sums:

- Table 1 rows reproduced: `T0 = 1e3` (2000 zeros from the first zero above 1000), `P = 10`:
  `Rref = 0.35947255349641` (table 0.3595); `P = 100`: `0.07050388362554` (table 0.0705). MEASURED-BALL.
- Abel-weighted Landau sums, the same weight as Theorem A': `2 pi delta sum_{gamma > 0} n^{i gamma} e^{-delta gamma}`
  against `-Lambda(n)/sqrt n`. The gap halves with `delta` for every `n` tested (2, 3, 4, 5, 6, 7, 8, 10), i.e. the
  error in the sum is `O(1)` at these `n`, the same shape as in Theorem A':

| `n` | `delta = 0.02` | 0.01 | 0.005 | 0.0025 | `-Lambda(n)/sqrt n` |
|---|---|---|---|---|---|
| 2 | -0.4200 | -0.4541 | -0.4719 | -0.4809 | -0.4901 |
| 3 | -0.5360 | -0.5836 | -0.6086 | -0.6213 | -0.6343 |
| 4 | -0.2352 | -0.2879 | -0.3164 | -0.3313 | -0.3466 |
| 6 | 0.1258 | 0.0697 | 0.0366 | 0.0187 | 0 |
| 10 | 0.1413 | 0.0846 | 0.0459 | 0.0239 | 0 |

- Abel-weighted table law: `A/(N_delta M_P)` against `1 - 2 c_P/L_delta`, `L_delta = 2 pi delta N_delta`
  (`3.590` at `delta = 0.0025`): `P = 2`: `0.645` against `0.614`; `P = 3`: `0.413` against `0.308`; `P = 10`:
  `0.208` against `-0.097`. These heights correspond to `x = (log P - gamma_E)/L` of `0.03, 0.15, 0.48`; the
  first-order law is stated in the tables for `x <= 0.25` and large `L`, and at `L = 3.6` the agreement is at the
  level of the neglected `O(1/L)` terms. Consistent, not a sharp test.

## 5. Remarks (none changes Theorem A')

1. F2 needs only continuity of `H` on the open unit ball of `c_0` and compactness of `K_eps`; the note's concern
   about the Hilbert-Bohr correspondence can be dropped.
2. The uniformity in `k` of step (3) has an explicit constant (`C(delta) < 0.006` for `t_0 = 1`, `delta <= 1`,
   MEASURED); it was checked in the note for four `k` only, and here for `k` up to 1000.
3. For infinite `P` no non-constant example of the hypothesis is known (Section 2). The headline "any prime set" is
   correct as a statement; its content for infinite `P` is the emptiness statement of Theorem B'.
4. The DH formula should be relabelled from OUTLINE to PROVED (one derivation, `REFEREE2.md` Section 3), with the
   remark that for infinite `P` the pairing is a value of a bounded holomorphic Bohr lift, not a series. If `5` is in
   `P` the extra term `f(w)[h* - h*_{chi_0}](w - 1/2)` is regular at `w = 1` and changes nothing.
5. The numerical agreement "1 to 3 percent" quoted in the note is example-dependent (first referee, correction 2);
   the quantitative statement that survives is "`S - M/(2 pi delta) - Sec` is bounded and converges".

## 6. Flags

R1 false (the first-moment sign holds for DH: no step uses multiplicativity). R2 false (an Abel mean and no-go
statements). R3 false. R4 false. Referee count for Theorem A': two (first referee `REFEREE.md`, this pass). No
statement about zeros of zeta.

## Addendum 2026-11-18: second reading of Section 3 (lane `c4-repair-map-engine-r3`)

A second reader went through (D1)-(D7) line by line (text check; arithmetic spot checks in `push/c4-repair-map-engine-r3/dh_reading_check.py`, log beside it). Result: (D1)-(D6) hold as written; the formula and the constant 1.0597 of (D7) hold. One citation in (D7) is incomplete: F3 as stated in Section 1 is the real-part Harnack bound, which does not bound `Re(c_1 z_1 + c_2 z_2)` for complex `c_1, c_2`. The input that gives the stated constant is the disc form on the same slice: for `Re H_0 >= 0`, `H_0(0) = alpha > 0`, the values at `sup |w_p| <= rho` lie in the disc of centre `alpha (1 + rho^2)/(1 - rho^2)` and radius `2 alpha rho/(1 - rho^2)`; at `rho = 2^{-1/2}` these are `3 alpha` and `2 sqrt 2 alpha`, and with `c_1 + c_2 = 1`, `|c_1| + |c_2| = sqrt(1 + kappa^2)` the bracket has real part at least `(1 + 3 - 2 sqrt 2 sqrt(1 + kappa^2)) alpha`. The bound is attained on the pair of discs (sampled minimum 0.059668 against 0.059659 for the term without `a_1`), so this argument cannot give more than 1.0597. Implicit and correct: polynomial growth of `L(w, psi chi)` on vertical lines in the Mellin shift of (D5). `REFEREE.md` Section 2 of this lane (the second derivation) already uses the disc form in D7 (centre 3, radius `2 sqrt 2`), so the point concerns the wording of (D7) here only. Status of the DH formula: PROVED, two derivations (this file, Section 3; `REFEREE.md`, Section 2) and this further reading; no third derivation was made.
