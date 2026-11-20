# s1-klein-annulus-energy: screening of four combinations of the elliptic / annulus model (2026-11-19)

Screening arm. Four proposed combinations of nodes of the idea graph were turned into finite computable statements, run for zeta, a Dirichlet L-function and the controls, and classified. Nothing here is a statement about the zeros of zeta beyond the heights sampled. Labels: PROVED (derived here or in the cited source), CLASSICAL, MEASURED (float64 unless "ball" is written; ball = python-flint ball arithmetic).

## 1. Verdict

No survivor. All four combinations are closed.

| # | combination | what separates the controls | class |
|---|---|---|---|
| 1 | annulus DtN operator x strip DtN phase identity | sign of three boundary functions on a window; negative only on windows that contain an off-line zero of the control; mode 0 is a zero count | closed: verified height in another form (window form) |
| 2 | Dirichlet energy fold x Gaussian damping x Li coefficients | first negative coefficient at n = c gamma^2/x0, c between 4.4 and 13.8, for the controlling off-line zero x0 + i gamma (x0 = beta - 1/2) | closed: verified height in another form (the known H^2 log H law, row P16) |
| 3 | Klein phase-transport certificate x reflection parity | nothing: the certificate is a theorem for every F; 0 violations in 2,386,080 samples; it fires for the controls at the same rate away from their off-line zeros; for zeta the firing fraction falls with height | closed: no separation |
| 4 | twistor map to S^4 x elliptic double cover x pair correlation | winding count of R_a (argument principle) and local spacing statistics; T-NR is not separated from zeta | closed: coordinate change, as expected |

## 2. Objects, controls, shared code

Chart: s = 1/2 + z, w = 1 - 1/s (lens L = 1; |w| < 1 is Re s > 1/2; w = 1 is s = infinity; the strip coordinate of the annulus is used only through the two boundary lines Re z = 0 and Re z = b). F is the completed function, F(-z) = F(z), real on the real axis.

| code | object | completed function | off-line zeros used |
|---|---|---|---|
| ZETA | zeta | s(s-1) pi^(-s/2) Gamma(s/2) zeta(s) | none to the heights sampled |
| LCHI3 | L(s, chi_-3) (positive comparison) | (3/pi)^((s+1)/2) Gamma((s+1)/2) L(s) | none found |
| DH | Davenport-Heilbronn | (5/pi)^(s/2) Gamma((s+1)/2) f(s) | battery table: 84 pairs below 2000; first x0 = 0.3085 at 85.699 |
| EA:1/8, EA:3/10 | zeta(s+a) zeta(s-a) | xi(s+a) xi(s-a) | every zero, x0 = a |
| TNR | zeta(s)(1 + 2.2 * 3^(1/2-s) + 3^(1-2s)) | 3^s xi(s) D(s) | x0 = 0.4036, ordinates (2k+1) pi/log 3 |
| HEAT:-0.5 | backward heat family, tau = -0.5 | F_tau(z) (quadrature of heatlib.py, 477 bits) | battery table: first x0 = 0.243 at 111.694 |

Not run, with the reason: the unimodular twist WT = zeta(s + i alpha) is a translate of zeta, so every statistic of combinations (1), (3), (4) is the zeta statistic at height t + alpha, and in (2) the zeros stay on |w| = 1 (ARGUED, not run). The random unimodular twists U-xx and the sign twists SGN-xx of the battery have no values in the strip (battery README, limit 1): none of the four statistics is formulable for them. HEAT was not run in the circle form of (2) (the quadrature is not usable at Re s of order 10^4); it is in the damped form of (2).

Files (all in this directory):
- `lines.py`: values of the arithmetic part A = F/g on the lines Re z in {0, 0.05, 0.1, 0.25, 0.5}, uniform grid dy = 0.005, ball arithmetic rounded to float64; L = F'/F, L', log|F| and the zero-safe Laguerre data on the axis by 8th-order stencils in y; gamma factors analytic. `heatlib.py` is copied from the battery.
- `analyse.py`: combinations (1), (3), (4) from the line data. `li.py`, `li_damped.py`: combination (2). `c4_fixed.py`: first statement of (4). `recheck_points.py`: ball rechecks. `summarise.py`: tables. `tests/`: validations.
- `run_server.sh`, `post.sh`, `rerun_v1.sh`, `post2.sh`: the server units. `out/`: json results, `out/SUMMARY.txt` (all rows), `out/li_summary.json`. `logs/`: unit logs. Line data (`data/*.npz`, 512 MB) and the circle arrays (`out/li_*.npz`) stay on the server in `~/rh-push/s1-klein-annulus-energy/`.

## 3. Validation (cases with known answers)

| check | result |
|---|---|
| L, L', log abs F from stencils against acb_series (zeta near 30, DH near 84, L(chi) near 50) | L to 4e-12, L' to 7e-10 relative, log abs F to 3e-14 (`tests/val_lines.py`) |
| -theta' and T_b against the recorded values of c5-device-table-extension (alpha = 0.2; zeta at y = 27, 28.3, 31.7 with b = 1/2; DH at 84.9, 85.7, 86.4 with b = 3/4) | T_b agrees to 12 digits, -theta' to 10 digits (`tests/val_c1.py`); ball: -theta'(85.7) = -7.795251181810898... for DH |
| identity W_h(t)/h = int omega_{a,h} C_a dr (source sec 5) | zeta near 30: deviation 3e-6 (a = 0.5) to 3e-4 (a = 0.05) at dy = 0.005, falling by 4 per halving of dy; polynomial control F = z^2 - delta^2 of source sec 7: integral 0.880000000000 against 0.880000000000 (`tests/val_c3.py`) |
| Li coefficients of zeta | lambda_1..5 = 0.02309571, 0.09234574, 0.20763892, 0.36879048, 0.57554271; lambda_300 = 519.7019656192 at two radii; ball (160 bits): lambda_1 = 0.023095708966121033814..., lambda_300 = 519.701965619249644844632... (the repo value 519.404466 of imp-2426 is the truncated sum over 10^6 zeros) |
| argument principle on the circle | c_0 = 4.0000 for DH at H = 5e4 (the pairs at 85.7 and 114.2 with conjugates), 10.0000 for TNR at H = 1000, 33.99 for EA:1/8 at H = 2e4 |

A defect found on the first pass and corrected: the abscissae were passed as float64, which has absolute rounding 1e-9 at height 1e7; the second-difference stencil amplifies it by 1/dy^2 and -theta' carried noise proportional to the height (6 digits at 1e6). Raising the precision of zeta to 128 bits changed nothing. `lines.py` version 2 forms y_j = y_0 + j dy exactly in ball arithmetic. Zeta at 1e5, 1e6, 1e7 (windows of 200 and 2000), DH [70,270] and TNR at 1e5 were recomputed (`*_exact`): minima of -theta' and u_b, all orders N*, all firing counts are unchanged; only the noise floor of D changed (section 4). The other datasets are version 1 (heights up to 1e5, noise below 1e-6 relative).

## 4. Combination (1): annulus DtN operator x strip DtN phase identity

Definitions. S = (1 - alpha L)/(1 + alpha L), L = F'/F, S(iy) = exp(i theta(y)), u_b(y) = -log|S(b + iy)|, T_b = sech^2 average of u_b (kernel (pi/(4b^2)) sech^2(pi d/(2b)), mass 1/b), D = -theta' - T_b. By the identity of the node (PROVED there), D(y) = sum over zeros of S in 0 < Re z < b of K(x_k, y - y_k) minus the same sum over poles of S, K > 0, integral of K(x, .) equal to 2 pi (1 - x/b). In Fourier modes the strip DtN map sends the trace u_b to kappa/sinh(kappa b) times its coefficient (1/b at kappa = 0): a positive multiplier. The DtN energy of the trace, (l/2) kappa coth(kappa b)|u_n|^2, is nonnegative for every function and carries no information (`low_modes` in the json).

Finite consequences tested (if all zeros of F are on the line: u_b >= 0 since Re L >= 0 for Re z > 0, CLASSICAL; -theta' = 2 alpha (Xi'^2 - Xi Xi'')/(Xi^2 + alpha^2 Xi'^2) >= 0, Laguerre, CLASSICAL; D >= 0 since S has no poles in Re z > 0):
- for f in {-theta', u_b, D} on a window [T, T + l] with M = l/dy nodes, the N x N Toeplitz matrix of the Fourier coefficients of the node measure is positive semidefinite for every N. Since T_N = sum_j (f_j/M) v_j v_j^*, lambda_min(T_N) >= min_j f_j (PROVED, two lines), and lambda_min is nonincreasing in N. Statistic: N* = least N with lambda_min(T_N) < -tol * scale (tol 1e-6; 1e-5 for D), found by doubling and bisection up to N = 4096 (wavelength l/N = 0.05 for l = 200).
- Survival would need: zeta None at every height; each control negative at an order far below both the number of zeros in the window and l/(2 pi x0), or negative on windows that contain none of its off-line zeros.

alpha in {1, 0.2}, b in {0.05, 0.1, 0.25}. Sizes: zeta windows [10,210] and [T, T+200] for T = 1e3, 3e3, 5e3, 1e4, 1e5, 1e6, 1e7, and [T, T+2000] for T = 1e6, 1e7 (4546 zeros in the last); L(chi_-3) [10,210], [T, T+200] for T = 1e3, 1e4, 1e5, and [1e6, 1e6+20].

Results (MEASURED; full rows in `out/SUMMARY.txt`).

Zeta and L(chi): min of -theta' and of u_b positive in every window (zeta at 1e7, window of 2000: min -theta' = 0.870 (alpha = 1), 3.65 (alpha = 0.2); min u_b = 0.0428, 0.0816, 0.160 for b = 0.05, 0.1, 0.25; L(chi) at 1e6: min -theta' = 1.18, min u_b = 0.0579, 0.109, 0.204). Hence N* = None for both by the bound above. D >= -1.3e-5 on the unmasked nodes of the exact-abscissa runs, against a mean of -theta' between 9.7 and 14.3: this is the trapezoid floor described under "weakest steps", not a sign. Ball rechecks at the nodes of minimum in a window near 1e6 (zeta) and 1e3 (L(chi)): u_b = 0.07045591339, 0.13256270148, 0.22433849383 and -theta' = 1.43993308158 (zeta); 0.06507045603, 0.12774120290, 0.28476803160 and 1.30966980693 (L(chi)).

Controls (alpha = 1; the rows for alpha = 0.2 are in `out/SUMMARY.txt` and lie in the ranges quoted in section 8; zeros = smooth zero count of the window; N* for -theta' | u_b at b = 0.05, 0.1, 0.25 | D at the same b):

| control, window | zeros | off-line pairs (x0) | l/(2 pi x0max) | N*(-theta') | N*(u_b) | N*(D) |
|---|---|---|---|---|---|---|
| DH [122,158] | 27 | 0 | - | None | None, None, None | None, None, None |
| DH [70,270] | 154 | 5 (0.074..0.370) | 86 | 80 | 80, 127, 277 | 2, 4, 20 |
| DH [1000,1200] | 216 | 8 (0.086..0.355) | 90 | 119 | 156, 186, 347 | 5, 29, 69 |
| HEAT -0.5 [100,300] | 109 | 9 (0.178..0.414) | 77 | 52 | 67, 97, 194 | 2, 2, 5 |
| TNR [1e3,1e3+200] | 234 | 35 (0.404) | 79 | 208 | 204, 194, 294 | None, None, 139 |
| TNR [1e5,1e5+200] | 378 | 35 (0.404) | 79 | 627 | 598, 524, 372 | None, None, 626 |
| EA:1/8 [1e3,+200] | 329 | 164 (0.125) | 255 | 2 | 147, 845, None | 1, 1, 1 |
| EA:1/8 [1e5,+200] | 616 | 308 (0.125) | 255 | 1 | 184, 358, None | 1, 1, 1 |
| EA:3/10 [1e3,+200] | 329 | 164 (0.3) | 106 | 4 | 4, 55, 221 | 1, 1, 1 |
| EA:3/10 [1e5,+200] | 616 | 308 (0.3) | 106 | 2 | 8, 23, 212 | 1, 1, 1 |

Ball rechecks of single negative values: DH (alpha = 1) u_0.05(85.745) = -3.6964980288, -theta'(85.745) = -37.5759176569; EA:1/8 u_0.05(1008.045) = -0.3660385151, -theta'(1003.27) = -241.1431746713; EA:3/10 u_0.05(1005.52) = -3.2695884613; TNR u_0.25(1009.505) = -1.3734975223, -theta'(1003.72) = -4.5642997131 (`out/recheck_points.json`).

Reading.
1. The DH window [122,158], which contains no off-line zero (the nearest are at 114.16 and 166.48), passes all three tests at both alpha. The statistics are local: a control fails only where the window contains one of its off-line zeros.
2. For the controls with a minority of off-line zeros (DH, HEAT, TNR) the order at which -theta' or u_b turns negative is between 0.5 and 1.9 times the number of zeros in the window, and for TNR it grows with height (208 at 1e3, 627 at 1e5, against 234 and 378 zeros): the Fejer-type test function must isolate the off-line zero from its on-line neighbours. No control fails at an order below the one that resolves its off-line zero.
3. The low orders are zero counts. The mean of -theta' times l/(2 pi) is the number of on-line zeros in the window (zeta at 1e3: 5.173 * 200/(2 pi) = 164.7 against 164.4; DH [70,270]: 4.529 * 200/(2 pi) = 144.2 against 154.1 - 10). EA has no on-line zeros, its mean is 0.024 and -0.0007, and N* = 1 to 4. The mean of D is the Jensen count (2 pi/l)(sum over zeros of S of (1 - x_k/b) minus the same over poles); for zeta with alpha = 0.2 and b <= 0.1 on the window [10,210] it is 1e-12 in absolute value (S has no zero or pole in the strip, so -theta' = T_b there; the same holds for DH on [122,158]). A negative mean of D counts poles of S in the rectangle, which exist only next to zeros of F to the right of the line. Comparing a count on the line or in a rectangle with the count from the gamma factor is Turing's method.
4. b = 0.25 > x0 = 0.125 for EA:1/8: u_b >= 0 on the whole window, as the classical statement requires (zeros to the left of the line).

Classification: closed. Every separating statistic is a sign condition on a window that is violated only when the window contains an off-line zero, at a resolution set by the local zero spacing, or a zero count. This is verified height in another form.

## 5. Combination (2): energy fold x Gaussian damping x Li coefficients

With w = 1 - 1/s the disc coordinate of the chart is Li's variable: phi(w) = w d/dw log F = sum_{n>=1} lambda_n w^n, lambda_n = sum_rho [1 - (1 - 1/rho)^n]. On |w| = rho = 1 - 1/(2H) (in the s-plane the circle of radius about H through s = 1/2 + 1/(4H)), with w_k the images of the zeros of F:

c_n = rho^n (lambda_n + sum_{|w_k|<rho} w_k^(-n)) (n > 0), c_0 = #{|w_k| < rho}, c_(-n) = rho^(-n) sum_{|w_k|<rho} w_k^n (CLASSICAL: Laurent expansion and the argument principle).

The Laurent part with negative index vanishes exactly when no zero image lies inside the circle. The fold identity E(E_r) = 2 E(K) = 2 E(annulus) is an isometry statement and gives no inequality (source sec 5). "Energy split" computed: E_-/E_+ with E_+- = sum over n of |c_n|^2/|n|. An off-line zero x0 + i gamma has 1 - |w_k|^2 = 2 x0/|rho_k|^2, so it enters the circle when H > 1/(2(1 - |w_k|)) = about gamma^2/(2 x0), and its term in lambda_n has size |w_k|^(-n) = exp(n x0/gamma^2).

Statistic: first n with lambda_n < 0 against 1/(1 - |w_k|) = gamma^2/x0 of the controlling off-line zero. Sizes: FFT of N = 2^23 samples of F'/F on the circle for zeta and L(chi) (n <= 1e6), 2^22 for DH (n <= 1e6). The task asked for n = 1e5; DH needs n = 3.3e5, so 1e6 was run.

| object | circle(s) | n reached | first negative n | gamma^2/x0 of the controlling zero | ratio | zeros inside (c_0), E_-/E_+ on a larger circle |
|---|---|---|---|---|---|---|
| ZETA | H = 3e4, 5e4 | 1e6 | none; min lambda_n/n = 0.0230957 at n = 1; lambda_1e6 = 5777486.2297 (ball) | - | - | 0; 1e-31 |
| LCHI3 | H = 5e4 | 1e6 | none; lambda_1e6 = 6.32672e6 | - | - | 0; 1e-31 |
| DH | H = 7e3, 1e4 | 1e6 | 328997 at both radii; ball: lambda_328996 = +1385.3152185, lambda_328997 = -2379.9647066 | 23807 (0.8085 + 85.699 i) | 13.8 | H = 5e4: c_0 = 4.0000; 1.4e-9 |
| EA:1/8 | H = 500, 700 | 1e5 | 17856 at both radii; ball: lambda_17855 = +2564.7627184, lambda_17856 = -508.5002165 | 1601 (0.625 + 14.135 i) | 11.2 | H = 2e4: 33.99; 1.8e-7 |
| EA:3/10 | H = 300 | 5e4 | 6749 | 668 | 10.1 | - |
| TNR | H = 8 | 2000 | 109 | 21.8 (0.9036 + 2.860 i) | 5.0 | H = 1000: 10.0000; 1.8e-5 |

(The ball values are the discrete Fourier sums in 160-bit ball arithmetic; the aliasing term, of relative size below 1e-13 for these radii, is estimated and not enclosed.)

Damped form (the Gaussian of the node evaluated at the zeros): D_n(S) = sum_rho exp(-|rho - 1/2|^2/S^2)[1 - (1 - 1/rho)^n] from the battery zero tables below height 2000. On-line zeros contribute 2 h (1 - cos n theta) >= 0, so D_n(S) >= 0 for zeta by the formula; an off-line quartet contributes h [4 - 2 Re w^n - 2 Re w^(-n)].

| object | S | first negative n | gamma^2/x0 | ratio |
|---|---|---|---|---|
| DH | 50, 100, 200, 400 | 131906, 108204, 116290, 134065 | 23807 | 5.5, 4.5, 4.9, 5.6 |
| HEAT -0.5 (zeros below 500) | 25, 50, 100 | 997229, 340337, 225275 | 51350 (x0 = 0.243 at 111.69) | 19.4, 6.6, 4.4 |
| HEAT -0.1 | 400 | none to 4e6 | 2.27e6 (x0 = 0.140 at 564.4) | consistent |

Reading. In every case the first negative index is gamma^2/x0 times a logarithm of the size of the positive part (4.4 to 13.8). Damping lowers the logarithm (from 13.8 to 4.5 for DH) and does not change the scale gamma^2/x0. No control fails below gamma^2/x0. The negative-index coefficients are power sums of the zero images inside the circle: the argument principle on the disc of radius H, which reaches an off-line zero only when H > gamma^2/(2 x0). The energy split is 1e-9 to 1e-5 even with zeros inside.

Classification: closed. This is row P16 of the obstruction map (positivity for n up to about H^2 log H is a function of verified height H), now with the controls measured.

## 6. Combination (3): Klein phase-transport certificate x reflection parity

Source (PR 56, klein_phase_transport.md sec 5-6, PROVED there): U_a(t) = F(1/2 + a + it) = A_a e^(i theta_a), theta_a' = Re L(a + it), W = |F|^2 Re(F'/F); W_h(t)/h = int_0^inf omega_{a,h}(r) C_a(t,r) dr, C_a = A_a(t-r) A_a(t+r) sin(Delta_a)/(2ar); if 0 < mu <= theta_a' <= M on [t-R, t+R] and R <= pi/(4M) then W_h(t)/h >= (2 mu/(pi a)) int_0^R omega A A dr - int_R^inf omega A A/(2ar) dr. The h -> 0 limit of the left side is Xi'^2 - Xi Xi''.

Test: for t on a grid of step 0.05, for every R on the grid dy, with mu and M the exact running minimum and maximum of theta_a' on the nodes, the best certified bound cert(t) = max over admissible R of (main - tail); "fires" when cert > 0; "violation" when W_h(t)/h < cert. Pairs (a, h): (0.5, 0.25), (0.5, 0.1), (0.5, 0), (0.25, 0.1), (0.25, 0.05), (0.25, 0), (0.1, 0.05), (0.1, 0), (0.05, 0). Tail integrated to r = 12a. The inequality holds for every F with the two symmetries, so a violation is impossible when the code is right; the test of the controls is a check of the code and of whether firing avoids their off-line zeros.

Results (MEASURED). 2,386,080 samples (t, a, h) over all objects: 0 violations; the least relative slack (W_h/h - cert)/(|W_h/h| + |cert|) is 0.066. W_h < 0 at 45,390 control samples; the certificate fires at none of them. The identity deviates from the direct value by at most 1.1e-3 of int omega |C| for zeta and L(chi) (7e-3 for the controls at a = 0.05; second order in dy).

Fraction of t at which the certificate fires, h -> 0 (zeta; the windows of 2000 at 1e6 and 1e7 have 40,000 samples each and agree with the windows of 200):

| a | 10 | 1e3 | 1e4 | 1e5 | 1e6 | 1e7 |
|---|---|---|---|---|---|---|
| 0.5 | 0.385 | 0.087 | 0.0067 | 0 | 0 | 0 |
| 0.25 | 0.618 | 0.392 | 0.240 | 0.116 | 0.038 | 0.0081 |
| 0.1 | 0.821 | 0.680 | 0.579 | 0.488 | 0.413 | 0.339 |
| 0.05 | 0.905 | 0.821 | 0.750 | 0.686 | 0.630 | 0.576 |

L(chi_-3): a = 0.25: 0.501, 0.305, 0.168, 0.064, 0.020 at 10, 1e3, 1e4, 1e5, 1e6; a = 0.05: 0.865, 0.789, 0.719, 0.658, 0.590. Controls at the same heights fire at comparable rates: DH [1000,1200] 0.286, 0.605, 0.768 for a = 0.25, 0.1, 0.05 (zeta at 5e3, the height of equal zero density: 0.283, 0.607, 0.773); TNR at 1e5: 0.104, 0.484, 0.684 (zeta at 1e5: 0.116, 0.488, 0.686); HEAT [100,300]: 0.578, 0.773, 0.862; DH [122,158]: 0.428, 0.706, 0.840.

Reading. The certificate transports positivity of theta_a' on a piece of the line Re s = 1/2 + a of length about 24a to the single point 1/2 + h + it. It never fires at 100% of a window even for zeta, so it does not certify a zero-free rectangle; for fixed a its firing fraction falls with height, because M grows like (1/2) log t and R <= pi/(4M) shrinks while the tail weight does not. It does not distinguish zeta from the controls except that it is silent at the points where W_h < 0, which lie next to the off-line zeros.

Classification: closed. A local sufficient condition that is true for every F with the functional equation; no separation.

## 7. Combination (4): twistor map to S^4 x elliptic double cover x pair correlation

(a) Fixed locus. With Z = [1 : w : w^2 : eta] and R(w, eta) = (1/conj w, conj eta/conj w^2), the distance in S^4 between the image of a zero and the image of its reflection is 0 for on-line zeros (6e-16 for the first five zeta zeros) and equals 1.947 x0/gamma^2 for an off-line zero (DH pairs 1 to 8: ratio 1.94705 to 1.94709; r = 1.5). R does not commute with the quaternionic structure J up to a scalar (R J Z = (-Z3, Z0, -Z1, Z2), J R Z = (-Z1, Z2, -Z3, Z0)), so it does not descend to a map of S^4; the statement is about the curve only. It is the statement |w| = 1 in other coordinates, with the same factor x0/gamma^2 as in combination (2).

(b) Two-point function. R_a(1/2 + it) = F(1/2 - a + it)/F(1/2 + a + it) = exp(-2i theta_a(t)) is unimodular; X(t) in S^4 is the image of (w, eta) = (R_a, R_a sqrt(r^2 + r^-2 + 2 cos 2 phi)); G(tau) = mean of X(t).X(t + tau), tau in units of the mean turn spacing. G is a functional of the phase theta_a alone.

Results (MEASURED, a in {0.05, 0.1, 0.25}):
- Turns of R_a in the window = number of zeros with |Re z| < a. Deficit against the smooth zero count: zeta and L(chi) between -0.8 and 0.8 in every window (4545.8 turns against 4545.6 at 1e7); DH [70,270]: 10.13, 8.13, 4.11 for a = 0.05, 0.1, 0.25 = twice the number of off-line pairs with x0 > a (5, 4, 2); TNR: 70.0 to 70.2 = 2 x 35; HEAT: 18.5, 18.4, 12.3; EA with a < x0: every zero. This is the argument principle on the strip |Re z| < a.
- G at equal height: TNR against zeta at 1e5, a = 0.25, lags 0.05 to 4: 0.934, 0.736, 0.176, -0.002, 0.474, 0.389, 0.334 against 0.936, 0.740, 0.165, -0.021, 0.518, 0.407, 0.338. T-NR has the on-line zeros of zeta and is not separated (differences up to 0.04, inside the window-to-window scatter of 0.02 to 0.07 measured between zeta windows and between L(chi) at 1e3 and zeta at 3e3).
- DH [1000,1200] against zeta [5000,5200] (equal zero density): a = 0.05 within 0.03 at every lag; a = 0.25 within 0.02 up to lag 0.5, and 0.539, 0.500, 0.555 against 0.472, 0.377, 0.331 at lags 1, 2, 4. One window of 216 zeros; not significant against the scatter at lag 1, about 0.2 at lag 4. If real, it is a difference of local spacing statistics of the on-line zeros of DH.

Reading. The S^4 image adds nothing to the phase of R_a. What separates is the winding count (a zero count) and, possibly, spacing statistics, which have no pass/fail threshold, are shared by L(chi), and do not see T-NR or a translate.

Classification: closed, as expected: a coordinate change with no separation.

## 8. Table

Sizes: zeta to height 1e7 (windows of 200 and 2000, 4546 zeros in the largest), n = 1e6 in (2); L(chi_-3) to 1e6 (window of 20 at 1e6, 200 below), n = 1e6; controls at the heights of their off-line zeros.

| combination | statistic | zeta | L(chi_-3) | DH | EA (1/8, 3/10) | T-NR | heat -0.5 | unimodular translate | class |
|---|---|---|---|---|---|---|---|---|---|
| (1) DtN x strip identity | Toeplitz order N* of -theta', u_b, D on a window | pass to 1e7 (pointwise min > 0; D >= -1.3e-5) | pass to 1e6 | fails only on windows with an off-line zero: N* = 80..347 (-theta', u_b), 1..69 (D); passes [122,158] | N* = 1..4 (-theta'), 1 (D): zero count; u_b: 4..845, pass for b > x0 | N* = 194..708, growing with height | N* = 52..194; D: 2..16 | translate of zeta (not run) | closed: verified height, window form |
| (2) energy fold x damping x Li | first n with lambda_n < 0; damped D_n(S); negative-index power sums | none to n = 1e6 | none to n = 1e6 | 328997 = 13.8 gamma^2/x0; damped 108204..134065 | 17856, 6749 (11.2, 10.1 gamma^2/x0) | 109 (5.0 gamma^2/x0) | damped 225275..997229 (4.4..19.4 gamma^2/x0) | zeros stay on abs w = 1 (not run) | closed: verified height (P16) |
| (3) phase-transport certificate | firing fraction; violations | fires 0.905 -> 0.576 (a = 0.05), 0.618 -> 0.008 (a = 0.25) from 10 to 1e7; 0 violations | same trend to 1e6; 0 violations | 0 violations; fires as zeta at equal density; silent where W_h < 0 | 0 violations | 0 violations; fires as zeta | 0 violations | translate of zeta (not run) | closed: no separation |
| (4) twistor x double cover x pair correlation | distance to reflected image; turns of R_a; G(tau) | distance 0; deficit < 1 | deficit < 1; G within scatter | distance 1.947 x0/gamma^2; deficit = 2 x pairs with x0 > a | deficit = all zeros for a < x0 | deficit 70 = 2 x 35; G equal to zeta within scatter | deficit 12..18.5 | translate of zeta (not run) | closed: coordinate change |

## 9. Limits and the three weakest steps

1. The D statistic of (1) is computed by the trapezoid rule along Re z = b. A zero or pole of S within about 2 dy of the line gives an error of order (pi/(4b^2)) dy exp(-2 pi eps/dy); such nodes are flagged by the second difference of u_b and D is masked within 5b of them (0 to 40% of a window; listed per row). The unmasked floor is 1e-5 against means of 1 to 14. The zeta "pass" for D is therefore a statement about the unmasked nodes; the passes for -theta' and u_b are pointwise at every node.
2. Everything except the listed ball rechecks is a float64 screen: the Toeplitz eigenvalues, the firing counts, G. The Li coefficients come from a discrete Fourier sum; two radii and the ball sums agree, the aliasing term is estimated. The heat values come from a quadrature whose truncation error is not enclosed.
3. Coverage. Heat at one tau and one window, and not in the circle form of (2). L(chi) at 1e6 on a window of 20. The G comparisons of (4) use single windows of about 200 zeros. Sign twists and random unimodular twists are not formulable (no values in the strip); the translate WT is argued, not run. The GPU was not used: device 1 had 97.1 of 97.9 GB in use at launch; the Toeplitz eigenvalues ran on the CPU through the fallback in `analyse.py`.

## 10. Server use

Four units, all through rhrun, all finished or stopped (inactive at the end): rh-s1klein-1119183425 (stopped by me after 6 minutes to reorder stages), rh-s1klein-1119184004 (8 cores, 3 GB, 2 h 19 min), rh-s1post-1119205858 (5 GB, 10 min), rh-s1post2-1119211101 (5 GB, 28 min). The 12 GB allowance could not be used: the machine had 43 to 45 GB available at launch and rhrun requires mem + 40; the FFT sizes were reduced from 2^24 to 2^23 to fit (peak 1.5 GB). Local runs through scripts/memcap.sh 8.
