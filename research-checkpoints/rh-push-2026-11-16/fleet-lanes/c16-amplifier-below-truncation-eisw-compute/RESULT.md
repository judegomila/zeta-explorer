# c16-amplifier-below-truncation-eisw-compute: Hecke amplifier of length N above the truncation height T on the truncated Eisenstein series

Date: 2026-11-19. Kind: compute (attack), family 31, item "amplifiers with T < N (argued only)" of
`campaign/STRATEGY.md`. Nothing here proves or refutes RH. No statement about zeros of zeta is made. No zero-free
region and no Lambda bound changes.
Labels: PROVED (argument written here), CLASSICAL (recalled, not opened), MEASURED-ARB (python-flint balls, a ball
statement per cell), MEASURED (float64 quadrature or float64 optimisation), OPEN.
Pre-registration: `PREREG.md`, written before any amplified norm with T < N was computed in this lane.

## Verdict

**Precise obstruction; the open item of family 31 closes. One registered prediction failed (S2) and is reported
as failed; the failure is a constant bounded by a proved cap and is shared by the control EIS-w.**

1. Lemma U (PROVED): for every T > 0 and every m, `T_m Lambda^T f` is `lambda(m) f` minus pseudo-Eisenstein series
   of the two constant-term pieces cut at the heights `T d / a`, `ad = m`. In the pairing of two cuts at heights
   `h_i, h_j` the coset with lower-left entry c contributes exactly when `c^2 h_i h_j < 1`. The whole Gram matrix
   `<T_m Lambda^T f, T_n Lambda^T f>` is a finite sum of powers and incomplete beta values (formula (G) below), for
   every s with sigma != 1, zero or not. Checked against the definition (pointwise, 1e-14) and against direct
   two-dimensional quadrature over F (relative 1e-15 to 7e-14, cells up to (T, N) = (2, 16)).
2. S1, gain at zeros (MEASURED-ARB): `sup_x G(x) < N^delta` as a ball statement in all 132 cells of the registered
   grid at the 12 zeros (nine cells T in {1,2,4}, N in {2T, 8T, 32T}, plus (2,2), (4,4)); largest value
   `0.99192 N^delta` at (4, 128), zero 12. Extensions: 844 further rows (zeros 1 to 300 on three cells), 12 rows at
   (1, 128), 463 formal rows at delta in {0.01, 0.05, 0.1, 0.2}: every row below `N^delta`. The assignment's
   prediction for zeros holds. Relative to the regime T >= N of the c15 lane, the crossing terms change the optimal
   gain by a factor between 0.987 and 1.0094; the change decays with the height (below 0.2 per cent beyond zero 150).
   Not proved; see weakest step 1.
3. S1 at the control points (MEASURED-ARB): at EIS-w points (the same series off resonance) the bound `N^delta`
   is exceeded in 394 of 528 registered rows (up to 5.93 `N^delta`), in the regime T >= N as well (31 of 96 rows,
   where the proved bound is `MS(T)/MS(T/N)`). At zeros the gain never exceeds `N^delta`; at EIS-w points it does in most
   rows: there is no "gain beyond N^delta that EIS-w lacks". The comparator that does not read phi = 0, `R_gen = MS(T)/MS(T/N)`,
   bounds the optimal gain in every row where it is defined (438 rows at control points, 132 at zeros).
4. S2, device comparison (MEASURED, float64): the registered prediction `R2 <= 1` is **false** for T < N. With
   T < N the amplified inequality is stronger than the unamplified one as a lower bound for `abs(xi(2 - rho))^2`:
   `sup_x R2` between 1.04 and 1.44 at the 12 zeros for (T, N) = (1, 2), (1, 4), (2, 4), and between 1.07 and
   1.46 at (1, 8). For T >= N, `R2 = 1` exactly (PROVED, and reproduced to 1e-15).
   Proposition CAP (PROVED): for every s, T, N, x, `R2 <= M/L = 1/(1 - S/M)`, where S/M is the fraction of the
   truncated mass of f below y = 1 (measured 0.07 to 0.32 at the 12 zeros). The measured supremum reaches 0.9997 of
   the cap at a zero (cell (1, 8), zero 2) and 0.9999 at an EIS-w point. The same excess appears at the EIS-w
   points (sup R2 from 1.03 to 1.35 at the E midpoints, from 1.00 to 1.42 at the O points; same cap).
   So for T < N the amplified inequality is not implied by the unamplified one; it is implied up to the constant
   `M/L`, which is the loss of the unamplified device at the positivity step and is not the step that sets the
   exponent of the device (S4 and S5 of the c15 lane).
5. By the letter of `PREREG.md` section 7 the clause "R2 > 1 at some zero" names a stage-A candidate. That clause
   was written without the EIS-w comparison and without the cap. With both, the effect is a bounded constant that
   the control shares. Under the assignment's criterion (gain beyond `N^delta` that EIS-w lacks) there is no
   candidate. This lane recommends no stage-A item.

Score 0. Flags: R1 false, R2 false, R3 false, R4 false (section 8).

## 0. Plan, sources, what is new against the record

Read: BRIEF (to the end); `c15-edge-argument-strip-width-hecke-amplified/RESULT.md` in full and the head of its
`REFEREE.md`; in the map, the definition of the control EIS-w and the titles of rows G26, G37 to G41 (the rows
themselves were read through the c15 text, not line by line); `campaign/STRATEGY.md` item 31 and the entry
"tried, not closed".

On file before this lane: for T >= N the amplified norm is `M(T) x*Kx`, gain at most `N^delta`, amplified
inequality implied by the unamplified one (c15, Proposition A). For T < N: a bound argued from the size of a cross
term, one float64 value (zero 1, N = 8, T = 1: 2.728), and the lower-bound side not computed.

New here: (a) the exact Gram matrix for every T and N with the crossing coset terms (Lemma U, formula (G));
(b) ball-certified gains on the registered grid and extensions; (c) the same quantities at EIS-w points computed
from the two-term constant term; (d) the lower-bound side for T < N (S2) with Proposition CAP.

Decisive first test: C1 to C3 (section 3), then the cell (1, 8) at zero 1, which reproduced the c15 values for
T >= N to 12 digits (2.70983084281, 5.45859584403) and gave 2.72784 at T = 1 (c15 float64: 2.7283).

## 1. Object

As in `PREREG.md` section 1. `f = E*(z, w)`, `w = s/2`, `s = sigma + it`, `nu = w - 1/2`, `delta = 1 - sigma`,
constant term `c0 = A y^w + B y^(1-w)`, `A = xi(s)`, `B = xi(2 - s)`, `lambda(m) = tau_nu(m)`.
`Lambda^h f = f - E(z | c0 1_(y>h))` for any h > 0; `v_m = T_m Lambda^T f`; `v = sum x_m v_m`; `lambda_x = sum x_m lambda(m)`.
At a zero `s = rho`: `A = 0`.

## 2. Lemma U and the closed form

**Lemma U (PROVED; the action of T_m on pseudo-Eisenstein series and the constant term of a pseudo-Eisenstein
series are CLASSICAL).**

(a) `T_m E(z | psi) = E(z | T_m psi)`, `(T_m psi)(y) = m^(-1/2) sum_(ad=m) d psi(ay/d)`. For
`psi = y^e 1_(y>T)` this is `sum_(ad=m) (a/d)^(e - 1/2) y^e 1_(y > Td/a)`. Hence for every T > 0:

    v_m = lambda(m) f - sum_(ad=m) [ (a/d)^nu E(z | A y^w 1_(y>Td/a)) + (a/d)^(-nu) E(z | B y^(1-w) 1_(y>Td/a)) ].     (U1)

(b) The constant term of `E(z | psi)` is `psi(y) + sum_(c>=1) phi_E(c) int_R psi(y/(c^2(x^2+y^2))) dx`
(`phi_E` Euler's function: the cosets with lower-left entry c are d mod c, (c, d) = 1). If psi is supported in
`y > h`, the term c is supported in `y < 1/(c^2 h)`: the horodisc `{Im g z > h}` has its top at `1/(c^2 h)`.

(c) Crossing rule. For `psi_1 = y^a 1_(y>h_j)`, `psi_2 = y^b 1_(y>h_i)` and the term c, with `u = Im g z` as a
coordinate in place of x (`dx = sqrt(y u) / (c u^2 sqrt(1 - c^2 u y)) du` summed over the two signs of x):

    I(c; h_i, h_j; a, bbar) = (1/c) int int over {y > h_i, u > h_j, c^2 u y < 1} y^(bbar-3/2) u^(a-3/2) (1 - c^2 u y)^(-1/2) du dy
                            = c^(-2a)/(bbar - a) * [ (c^2 h_j)^(a-bbar) Bq(bbar - 1/2) - h_i^(bbar-a) Bq(a - 1/2) ],        (U2)
    Bq(e) = int_q^1 t^(e-1) (1-t)^(-1/2) dt = 2 sqrt(1-q) 2F1(1/2, 1-e; 3/2; 1-q),   q = c^2 h_i h_j.

The region is empty unless `c^2 h_i h_j < 1`. So the coset c crosses the pair of truncation lines `(h_i, h_j)` iff
`c^2 h_i h_j < 1`. Consequences for `v_m`, `v_n` (smallest product of heights `T^2/(mn)`):
- `<v_m, Lambda^T f>` has no crossing term iff `m <= T^2` (the form in the assignment);
- `||v_m||^2` has none iff `m <= T`;
- the Gram matrix for `m, n <= N` has none iff `N <= T` (c15, Proposition A);
- for `mn > T^2` the cosets `c < sqrt(mn)/T` contribute.

(d) Closed form. Let `H = max(TN, N/T)`, `g = Lambda^H f` (classical truncation). Then `v_m = lambda(m) g + E(Phi_m)`
with `Phi_m = -sum_(ad=m) [(a/d)^nu A y^w + (a/d)^(-nu) B y^(1-w)] 1_(Td/a < y <= H)`, and

    <v_m, v_n> = lambda(m) conj(lambda(n)) MS(H) + lambda(m) <g, E(Phi_n)> + conj(lambda(n)) conj(<g, E(Phi_m)>) + <E(Phi_m), E(Phi_n)>,   (G)
    <g, E(Phi)> = int_0^H c0 conj(Phi) dy/y^2,
    <E(Phi_m), E(Phi_n)> = int Phi_m conj(Phi_n) dy/y^2 + sum over pieces and over c of phi_E(c) I(c; .),
    MS(H) = (|A|^2 H^(2 Re w - 1) - |B|^2 H^(1 - 2 Re w))/(2 Re w - 1) + Im(A conj(B) H^(2i Im w))/Im w.

Proof of the middle line: unfold `E(Phi)`; the constant term of g equals `c0` on `1/H < y <= H` by (b), and `Phi`
is supported in `[T/N, H]` with `T/N >= 1/H`. The upper cut-off H does not enter the crossing terms because
`c^2 H h >= 1` for every height h. The value of (G) does not depend on H (check C4).

Implementation: `amp.py` (arb, 400 bits; `acb.hypgeom_2f1`), heights as exact rationals, zeros from
`acb.zeta_zero` with A set to 0 exactly.

## 3. Checks (registered C1 to C6)

| check | result |
|---|---|
| C1, `M = L + S` at T = 1, Maass-Selberg against quadrature (`checks_C1.log`) | first 5 zeros and 3 off-line points (delta 0.2, 0.1, 0.05): relative defect between 0 and 1.0e-15 (target 1e-10). Values at the zeros agree with the c15 table (M = 1.77754, 3.22600, 4.42347, 4.02248, 4.41820) |
| C2, (U1) pointwise from the definition of `T_m` (`checks_C2.log`) | 27 cases (T in {1, 1.5, 2, 4}, m up to 30, all with m > T^2; zeros 1 and 4, one off-line point), 6 points each: largest difference 6.3e-14 at size 2 to 6. Registered target 1e-20 was not attainable in float64; deviation recorded |
| C3, (G) against two-dimensional quadrature over F (`checks_C3*.json`) | zero 1 and the off-line point (0.9, gamma_1): (T, N) = (1, 2), (1, 3), (1, 4): 5e-16 to 4e-15; (1, 8): 2.7e-14; (2, 16): 6.4e-14 (largest relative entry error of the Gram matrix; up to 4768 crossing terms) |
| C4, independence of H (`t_amp.py`) | H and 3H agree to 1e-122 (400 bits) |
| C5, regime T >= N | zero 1: N = 8: 2.70983084281; N = 32: 5.45859584403 (c15: 2.7098, 5.4586). Cells (2, 2), (4, 4): `G_opt < N^delta` at the 12 zeros. At (2, 2) the value is `(1 + sqrt 2)/2` at every zero (0.853553 `N^delta`) |
| C6, incomplete beta by 2F1 against `acb.integral` | 5 values: differences below 1e-116 (5 run, 20 registered) |

The quadrature code (`direct.py`) uses the Fourier expansion with K-Bessel values from arb, explicit coset sums,
tanh-sinh panels in y split at every height, horodisc top and pairwise intersection of the discontinuity circles,
and Gauss-Legendre pieces in x between the discontinuities. It uses no Maass-Selberg relation, no unfolding and
no incomplete beta. A first version had a wrong endpoint formula in the tanh-sinh rule (errors of 50 per cent); it
was found by C3 before any grid run and fixed.

## 4. S1: the gain

`G(x) = |lambda_x|^2 ||Lambda^T f||^2 / ||A_x Lambda^T f||^2`; `G_opt = sup_x G = MS(T) lambda^* (P^T)^(-1) lambda`.
Every number below is an arb ball; "certain" means the ball lies on one side of 1. Largest relative radius in the
registered grid: 3.7e-85. Server unit `rh-c16amp-grid-1119212532`, 660 rows, `grid.jsonl`, table `grid_table.md`.

### 4.1 Zeros (delta = 1/2), 12 zeros per cell

| T | N | min G_opt/N^delta | max G_opt/N^delta | cells certain < 1 | largest named family / N^delta | G_opt(T) / G_opt(T >= N), range |
|---|---|---|---|---|---|---|
| 1 | 2 | 0.844121 | 0.858647 | 12/12 | 0.8578 | 0.9889 to 1.0060 |
| 1 | 8 | 0.898741 | 0.969039 | 12/12 | 0.8938 | 0.9896 to 1.0066 |
| 1 | 32 | 0.972126 | 0.990042 | 12/12 | 0.8561 | 1.0007 to 1.0074 |
| 2 | 4 | 0.810118 | 0.932157 | 12/12 | 0.8878 | 0.9869 to 1.0017 |
| 2 | 16 | 0.954827 | 0.965748 | 12/12 | 0.8646 | 0.9965 to 1.0010 |
| 2 | 64 | 0.972309 | 0.989639 | 12/12 | 0.8305 | 1.0007 to 1.0073 |
| 4 | 8 | 0.900624 | 0.967123 | 12/12 | 0.8758 | 0.9976 to 1.0008 |
| 4 | 32 | 0.967449 | 0.989402 | 12/12 | 0.8603 | 1.0001 to 1.0026 |
| 4 | 128 | 0.973839 | 0.991924 | 12/12 | 0.8300 | 1.0011 to 1.0085 |
| 2 | 2 (T >= N) | 0.853553 | 0.853553 | 12/12 | 0.8515 | 1 |
| 4 | 4 (T >= N) | 0.809098 | 0.932983 | 12/12 | 0.8864 | 1 |

Named families over all zero cells: HECKE at most 0.894 `N^delta`, SELBERG 0.724, PRIMES 0.825, best of the 24
RANDOM 0.858. No family value above `G_opt` (as it must be) and none above `N^delta`.

Registered prediction P-A at zeros: holds in every cell. The author's expected range [0.90, 1.00] was wrong at the
lower end (values down to 0.81 at N = 2, 4).

### 4.2 Extensions at zeros (not in the registered grid; same code)

| run | rows | result |
|---|---|---|
| zeros 1 to 300, cells (1, 8), (1, 32), (2, 16) (`grid_extz.jsonl`, unit `rh-c16amp-extz-1119214756`) | 844 rows with a certified value, 56 zero rows failed ("singular matrix in solve" at 400 bits, all at zeros 272 to 300; not rerun; the same 56 midpoints failed in the E rows) | all 844 certain < 1; largest 0.99212 (cell (1, 32), zero 28). `abs(G_opt(T)/G_opt(T >= N) - 1)`: at most 1.05e-2 for zeros 1 to 12, 2.7e-3 for 13 to 50, 1.5e-3 for 51 to 150, 4.2e-4 for 151 to 300 |
| (1, 128), zeros 1 to 12, 500 bits (`grid_extn.jsonl`, unit `rh-c16amp-extn-1119214756`) | 12 | 0.97477 to 0.99236, all certain < 1; ratio to T >= N from 1.0015 to 1.0094 |
| formal rows: the point `1 - delta + i gamma_k` with A set to 0, delta in {0.01, 0.05, 0.1, 0.2}, k = 1..12, the nine cells, and 31 rows of the cell (1, 128) (`grid_formal.jsonl`, unit `rh-c16amp-formal-1119220025`, stopped by this lane before the last 17 rows of (1, 128)) | 463 | all certain < 1; largest 0.999836 (delta = 0.01, (4, 128), k = 12). `1 - G_opt/N^delta` is close to proportional to delta (1.6e-4, 8.2e-4, 1.6e-3, 3.3e-3 at delta = 0.01, 0.05, 0.1, 0.2 in that cell). Ratio to T >= N between 0.9957 and 1.0037 |

The formal rows are not norms of an existing function: they are the values that formula (G) takes under the
hypothesis that the point is a zero (the gain does not contain B). They are the rows relevant to the device, which
works at a hypothetical zero with small delta. They are labelled formal and are not used as a check of anything.

Trend in N at zero 1, T = 1: `1 - G_opt/N^delta` = 0.0356, 0.0279, 0.0252 at N = 8, 32, 128; the factor over the
regime T >= N is 1.0066, 1.0074, 1.0094. The margin shrinks slowly and the crossing gain grows slowly; whether the
value stays below `N^delta` for all N is OPEN (weakest step 1). The (1, 512) probe is reported in section 4.4.

### 4.3 Control points: EIS-w

(E) `s = 1/2 + it`, t the 11 midpoints of consecutive zeros and t = 10; (O) `s = 1 - delta + i gamma_k`,
delta in {0.05, 0.1, 0.2}. Both are the series `E(z, w')`, `Re w'` in (1/2, 1), `phi(w') != 0`: control EIS-w.
Every quantity is computed from the two-term formulas.

| kind | regime | rows | rows with G_opt certain > N^delta | range of G_opt/N^delta |
|---|---|---|---|---|
| O | T < N | 324 | 273 | 0.885 to 1.600 |
| O | T >= N | 72 | 24 | 0.898 to 1.076 |
| E | T < N | 108 | 90 | 0.777 to 5.930 |
| E | T >= N | 24 | 7 | 0.785 to 1.145 |

No row is undecided. `G_opt <= R_gen = MS(T)/MS(T/N)` in each of the 438 control rows where `MS(T/N) > 0`
(largest `G_opt/R_gen`: 0.921 at O, 0.796 at E; at 90 E rows the formal `MS(T/N)` is negative and the comparator
is undefined). For T >= N this is the proved bound (the vector equals `lambda_x f` on `F` below `y = T/N`, valid
for every s); for T < N it is MEASURED-ARB. Extension: 841 E rows at midpoints 1 to 299 on three cells: 343
certain above `N^delta`, 498 certain below.

Reading. The registered prediction "EIS-w passes the bound `N^delta`" is false as stated (as the author's own
registered expectation said): off resonance the term `A y^w` lowers the truncated mass at low heights and the gain
exceeds `N^delta`, by large factors where `MS(1)` is small. The statement that holds at zeros and at EIS-w points
alike, wherever the comparator is defined, is `G_opt <= MS(T)/MS(T/N)`; at a zero its right side is `N^delta`.
The bound on the gain reads `phi = 0` only through the value of that comparator: zeros stay below `N^delta`,
control points can exceed it.

### 4.4 Probe (1, 512): not completed

Unit `rh-c16amp-n512-1119220012` (zeros 1 to 3, 400 bits, 3 workers) had produced no row after 50 minutes
(1 h 44 min of CPU; the server load average was above 170 at that time) and was stopped by this lane.
`grid_n512.jsonl` is empty. The largest N with data at T = 1 is 128.

## 5. S2: is the amplified inequality implied by the unamplified one?

Uniform formulation (it equals `PREREG.md` section 3 at a zero, with `kappa = B'/B`). Write `f = Nc + c0`, `Nc` the
non-constant part (it does not contain A, B). Replace `c0` by `kappa c0`, `kappa` an unknown complex number, true
value 1. Then `v_kappa = lambda_x Nc + kappa g_x`, `g_x = v - lambda_x Nc`. On the strip `Sigma = {|x| <= 1/2, y > 1}`:

    unamplified device (T = 1):  |kappa|^2 M >= L,                      M = MS(1),  L = ||Nc||^2 on Sigma;
    amplified device:            |kappa|^2 q >= |lambda_x|^2 L + 2 Re(lambda_x conj(kappa) c_x) + |kappa|^2 p_x,
                                 q = ||v||^2 (formula (G)),  p_x = ||g_x||^2 on Sigma,  c_x = <Nc, g_x> on Sigma.

Each excludes a set of kappa around 0. `r_0^2 = L/M`; `r_x` = the radius of the largest disc about 0 excluded by
the amplified inequality (worst phase); `r_x^true` = the excluded length along the ray of the true kappa.
`R2 = r_x^2/r_0^2` (registered), `R2true = (r_x^true)^2/r_0^2` (added after registration).

**Proposition T (PROVED).** For T >= N: `c_x = 0`, `q - p_x = |lambda_x|^2 M`, `R2 = R2true = 1` for every x.
Proof: all heights are at least 1, so `v = lambda_x f` on F below `y = 1`, and on Sigma `g_x` is a function of y
alone, orthogonal to `Nc`. Hence `q = |lambda_x|^2 S + |lambda_x|^2 L + p_x` and `S + L = M`. With the full
constant-term energy kept on the lower side, the amplified inequality for T >= N is the unamplified one multiplied
by `|lambda_x|^2` (c15, relation (6), kept only part of that energy, which is why its bracket exceeded 1).

**Proposition CAP (PROVED).** For every s, T >= 1, N and x with `lambda_x != 0`: `R2 <= R2true <= M/L = 1/(1 - S/M)`,
`S = ||f||^2 on F below y = 1` (for T = 1).
Proof: at `kappa = 1` the amplified inequality is true, because Sigma lies in F and `q - ||v||^2_Sigma` is the mass
of v on `F` below `y = 1`, which is non-negative. So the true kappa is never excluded: `r_x^true <= 1`. The
worst-phase polynomial dominates the true-phase one, so `r_x <= r_x^true`. Divide by `r_0^2 = L/M`.

MEASURED (float64; `s2.py`, unit `rh-c16amp-s2-1119212827`; strip Gram by the quadrature of section 3; check
`abs(L_quad - L)/L` at most 3.6e-12; sup over x by BFGS or Nelder-Mead from the named families and 40 random
starts, so each `sup` is a lower bound of the true supremum). Table produced by `analyse_s2.py` from `s2.jsonl` (117 rows): `s2_table.md`.

Summary (12 zeros; 11 E midpoints; 12 O points at delta = 0.1; full table `s2_table.md`). The cells (1, 8) at E and O
points and (2, 8) were registered "as time allows" and were not completed (about 15 minutes per row; the unit was
stopped by this lane after the 12 zero rows of (1, 8)):

| T | N | kind | sup R2: min, max | points with sup R2 > 1.001 | sup R2true: max | cap M/L: min, max | max (sup R2true - 1)/(cap - 1) |
|---|---|---|---|---|---|---|---|
| 1 | 2 | Z | 1.0368, 1.1592 | 12/12 | 1.3884 | 1.0776, 1.4708 | 0.825 |
| 1 | 2 | E | 1.0304, 1.2821 | 11/11 | 1.2821 | 1.0563, 1.3771 | 0.997 |
| 1 | 2 | O | 1.0000, 1.0587 | 10/12 | 1.3437 | 1.0514, 1.4359 | 0.788 |
| 1 | 4 | Z | 1.0410, 1.4365 | 12/12 | 1.4446 | 1.0776, 1.4708 | 0.973 |
| 1 | 4 | E | 1.0430, 1.3093 | 11/11 | 1.3106 | 1.0563, 1.3771 | 0.999 |
| 1 | 4 | O | 1.0142, 1.4196 | 12/12 | 1.4201 | 1.0514, 1.4359 | 0.996 |
| 1 | 8 | Z | 1.0715, 1.4635 | 12/12 | 1.4657 | 1.0776, 1.4708 | 0.998 |
| 2 | 4 | Z | 1.0464, 1.2622 | 12/12 | 1.4295 | 1.0776, 1.4708 | 0.912 |
| 2 | 4 | E | 1.0421, 1.3454 | 11/11 | 1.3517 | 1.0563, 1.3771 | 0.993 |
| 2 | 4 | O | 1.0047, 1.3799 | 12/12 | 1.3956 | 1.0514, 1.4359 | 0.931 |

No row has `sup R2true` above the cap. `S/M` at zeros 1 to 12: 0.320, 0.185, 0.259, 0.072, 0.136, 0.084, 0.165,
0.100, 0.079, 0.141, 0.114, 0.082. The named HECKE amplifier alone gives `R2` between 0.826 and 1.152 at zeros.
Code check: (2, 2) at zero 1 and at an E point gives `R2 = 1.0000000000000002` for every x tried.

Reading. For T < N the vectors `v_m` are no longer multiples of f below `y = 1`, and a combination can have less
mass there than f has. The amplified inequality is then closer to an identity than the unamplified one. The gain
is a constant, at most `M/L`, set by the loss `S/M` of the device at its positivity step S2. In the device of the
c15 lane the exponent is set by S4 (the sieve lower bound for the divisor-type mean, far below the true size of L)
and S5 (the bound on `zeta'`); neither is affected. The control EIS-w shows the same excess under the same cap (E midpoints: sup R2 from 1.03 to 1.35;
O points: 1.00 to 1.42), so the excess does not read `phi = 0`.

## 6. Answer to the assignment's question

- "For N above T, is the amplified device inequality still implied by the unamplified one?" On the upper side
  (the gain): yes in every measured cell, `G_opt < N^delta` at zeros (MEASURED-ARB, not proved). On the lower side:
  no; it can be stronger by a constant factor, at most `M/L = 1/(1 - S/M)` (PROVED cap; MEASURED excess up to 1.46
  at zero 1).
- "Does the off-resonance control EIS-w pass it?" EIS-w exceeds the bound `N^delta` in most rows, obeys the comparator `MS(T)/MS(T/N)` that zeros obey, and shows the same lower-side excess under the
  same cap. Nothing measured here is present at zeros and absent at EIS-w in the direction that would help.

## 7. Controls

| control | outcome | step |
|---|---|---|
| EIS-w (E and O points; run, 528 registered rows, 841 extension rows, 69 S2 rows) | Lemma U and formula (G) hold verbatim with the two-term constant term; gain exceeds `N^delta` in 394 of 528 rows; `G_opt <= MS(T)/MS(T/N)` where defined; S2 excess present, cap holds | passes every step; the only place `phi = 0` enters is the value of the comparator |
| BLS (Blaschke factor on the scattering coefficient) | not run. The crossing terms `phi_E(c) I(c; .)` are the group; in spectral form they are the terms with `phi` on the unitary line (c15, relation (e)). For BLS the Gram matrix would be defined by that form; expected to pass as in c15 | not run |
| T-NR, E_a | not run in this lane; c15: pass with a true conclusion | not run |
| DH, sign twists, U, THIN, backward heat, theta^w, phase-rotated transfer operator, Beurling | not formulable (no Hecke eigen-object with this constant term; c15, step S0) | S0 |

R3 is not established: one control was run and it passes.

## 8. Requirement flags

| requirement | flag | evidence |
|---|---|---|
| R1 (all primes together, multiplicativity essential) | false | The amplifier, which carries the joint eigen-relation, changes constants only: gain below `N^delta` in every zero cell; lower-side excess bounded by `M/L`. Formula (G) uses the Hecke relation only to move truncation heights |
| R2 (height-uniform, every window) | false | No conclusion is drawn. The crossing effect decays with the height; the cap `M/L` is measured at 12 zeros only |
| R3 (fails for every control for a structural reason) | false | EIS-w passes every step and shares every measured effect; BLS, T-NR, E_a not run; eight controls not formulable |
| R4 (reaches the critical line) | false | The device is the edge device of c15; nothing here changes its range `delta < (log log gamma + C)/log gamma` |

## 9. Proposed map row (this lane does not edit the map)

| id | device | outcome | status | controls | source |
|---|---|---|---|---|---|
| G42 (proposed; extends the c15 row of family 31) | Hecke amplifier `sum_(m<=N) x_m T_m` on the truncated Eisenstein series `Lambda^T E*(z, rho/2)` with N above the truncation height T (item "T < N, argued only") | On the truncated series `T_m` is `lambda(m) f` minus pseudo-Eisenstein series cut at the heights `Td/a`; the coset c enters the pairing of the cuts `h_i, h_j` iff `c^2 h_i h_j < 1`; the Gram matrix is a finite sum of powers and incomplete beta values. Optimal gain below `N^delta` in all 132 registered zero cells (T in {1,2,4}, N up to 32T; largest 0.9919 `N^delta`), in 844 rows at zeros 1 to 300, and in 463 formal rows with delta down to 0.01 (largest 0.99984); crossing terms change the optimal gain by a factor in [0.987, 1.0094] against the regime T >= N. Lower side: for T >= N the amplified inequality equals the unamplified one; for T < N it is stronger by a constant (measured up to 1.46), bounded by `M/L = 1/(1 - S/M)`, S/M the mass fraction below y = 1 (0.07 to 0.32 at 12 zeros). Not covered: a proof of `G_opt <= N^delta` for T < N; N above 128 at T = 1; uniformity of `M/L` in the height and at hypothetical zeros with small delta | Lemma U, Proposition T, Proposition CAP PROVED; gains MEASURED-ARB (balls); lower side MEASURED (float64, N <= 8 at zeros, N <= 4 at control points); one same-agent second pass, no independent referee | EIS-w run: exceeds `N^delta` (394 of 528 rows), obeys `MS(T)/MS(T/N)`, shares the lower-side excess under the same cap; BLS, T-NR, E_a not run | `c16-amplifier-below-truncation-eisw-compute` |

## 10. Three weakest steps

1. `G_opt <= N^delta` for T < N at a zero is measured, not proved. The pairing `<Lambda^h f, E(Phi')>` that vanishes
   for `h >= 1` (and gives the proof for T >= N) does not vanish for `h < 1`, and the crossing terms have no sign.
   At zero 1 and T = 1 the margin is 0.036, 0.028, 0.025 at N = 8, 32, 128 while the factor over the regime
   T >= N grows (1.0066, 1.0074, 1.0094). A crossing above `N^delta` at larger N and low height is not excluded.
   It would be a factor `1 + O(1/gamma)` and would not change the closure, but the row must say "measured up to
   N = 128" and not "at most `N^delta`".
2. S2 is one formalisation of "implied by" (unknown scale kappa on the constant term, strip `y > 1`, worst phase).
   Its registered prediction failed. The sup over x is a local float64 optimisation (a lower bound of the sup);
   complete cells have N <= 8 at zeros and N <= 4 at control points; quadrature error is controlled only through the consistency checks named above.
   Proposition CAP is proved, but the size of `M/L` is measured at 12 zeros of real part 1/2 only; whether `S/M`
   stays away from 1 at large height or at a hypothetical zero with small delta was not examined.
3. No independent referee (no agent-launch tool in this session): `REFEREE.md` is a same-agent second pass with a
   separate code path. 56 extension rows failed at 400 bits and were not rerun; the (1, 512) probe did not finish. BLS, T-NR and E_a were not run on
   the crossing terms. The registered targets of C2 (1e-20) and C6 (20 values) were not met as written (1e-14 in
   float64; 5 values). During the run this lane used up to 12 cores on the server for about half an hour, above
   the 8 of the assignment.

## 11. Files and server units

`PREREG.md`, `RESULT.md`, `REFEREE.md`, `lane_line.json`; code `amp.py` (closed form, arb), `direct.py` (direct
evaluation and quadrature), `checks.py`, `run_grid.py`, `s2.py`, `ref_checks.py`, `analyse.py`, `analyse_s2.py`,
`analyse_ext.py`, `t_amp.py`; data `grid.jsonl` (660 rows), `grid_table.md`, `grid_extz.jsonl`, `grid_extn.jsonl`,
`grid_formal.jsonl`, `grid_n512.jsonl` (empty), `s2.jsonl`, `s2_table.md`, `ref_u2.py`, `ref_u2.json`, `checks_C1.log`, `checks_C2.log`, `checks_C3.log`,
`checks_C3_T1_N8.json`, `checks_C3_T2_N16.json`, `ref_checks_small.json`.
Server units (all started through `rhrun`; none is running: checked with `systemctl --user list-units` at the end): `rh-c16amp-grid-1119212532` (8 cores),
`rh-c16amp-s2-1119212827` (4), `rh-c16amp-extz-1119214756` (4), `rh-c16amp-extn-1119214756` (4; stopped by this
lane after the 12 rows at N = 128), `rh-c16amp-n512-1119220012` (3; stopped, no row), `rh-c16amp-formal-1119220025` (4; stopped after 463 rows).
`rh-c16amp-s2-1119212827` was stopped after 117 rows.
Local runs through `scripts/memcap.sh 8`.
