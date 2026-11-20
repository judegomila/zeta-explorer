# s1-antibridge-cutoff-energy: screening of four combinations (antibridge x certificate / de-branges / theta / heat-flow)

Date 2026-11-19. Kind: screener (compute). Nothing here is a statement about the zeros of zeta beyond what is already known.
Labels: PROVED / CLASSICAL / MEASURED (ball = python-flint ball; float64 = screen) / OPEN.

## 0. Verdict

**Four combinations tested, no survivor.** Each of the four statistics is a weighted average, a pointwise value or a boundary
limit of one function, `W(x,t) = Re(F' conj F)(x+it)`, or a quadratic form over the right-half-plane zeros of `F + alpha F'`.
For an even real entire `F` of order one the sign of each is fixed by one classical identity (section 1): a negative value
occurs only inside the half-disk `(t - gamma)^2 + x^2 < d^2` of an off-line zero `d + i gamma`. Every control failed exactly
there and nowhere else, at every size reached: 1240 of 1240 negative samples of Davenport-Heilbronn (DH), 23,924 of 23,924 of
`zeta(s+a)zeta(s-a)`, 2,064 of 2,064 of T-NR, 251 of 251 of the backward heat function lie inside the half-disks. On the kernel
side the layer form becomes indefinite for a control exactly when the node spacing `delta` resolves the first off-line
ordinate (`pi/delta` just above it) and `x` is below the off-line distance `d`. The half-Gram statistic is a count of on-line
zeros per lattice cell; it is not flat in height (0.546 at 302 intervals, 0.405 over 1.0e7 intervals) and T-NR has zeta's
value identically.

| # | combination (nodes) | statistic | sizes reached | zeta | L(s, chi_-4) | DH | zeta(s+1/4)zeta(s-1/4) | T-NR (q=3, c=2.2) | backward heat tau=-0.5 | classification |
|---|---|---|---|---|---|---|---|---|---|---|
| 1a | theta-layer-cancellation + cutoff-energy-kernel-hc + theta-fisher-degree9 | `I_c(x) = int 2a sinh(xa) Q(a) da`, c = (-2,9,-19,24,-19,9,-2), b_j = 0.15 j, x in [0.01, 2] (23 values), 256 bits | 7 nodes | > 0 for all x; I(0.25) = 1.6193669682e-3 (reference reproduced) | > 0; I(0.25) = 1.49e-4 | > 0; 3.17e-4 | > 0; 6.43e-6 | > 0; 6.13e-2 | > 0; 1.661e-3 | CLOSED: no control changes sign; the fixed vector has spacing 0.15, which cannot resolve t > 20.9 |
| 1b | same, layer family = Toeplitz sections `T_N = [M_x((j-k) delta)]` | first N with a negative pivot (Levinson, 512 to 4096 bits); sign of the symbol on [0, pi/delta] | N to 20,000; delta to 0.005 (t <= 628) | positive: delta = 0.15, 0.03 (x = 0.02, 0.1, 0.3, 1, 2), 0.005 (N = 19,999, pivot 2.5e-204) | positive: delta = 0.15, 0.03, 0.005 | negative iff delta <= 0.036 (pi/delta >= 87.3; first off-line ordinate 85.70) and x < 0.3085 = d: N* = 368 at delta = 0.03, x = 0.1 (form -9.6e-34) | negative iff delta <= 0.22 (pi/delta >= 14.28; first foot 14.13): N* = 77 | negative at delta = 1.0986 (pi/delta = 2.86 = first foot): N* = 6 | negative iff delta <= 0.0275 (pi/delta >= 114.2; first foot 111.69): N* = 591 | CLOSED: detection threshold = the first off-line ordinate; verified height in the Mellin variable |
| 2 | pulse-leakage-bound + bridge-multiplier-c0 | `ell(eps) = ||Q_1 C_0 f_eps||^2`, f_eps = regularised box in [0,1]; FFT side against the pole side `(1/2) sum w_j conj(w_k)/(p_j + conj p_k)` | zeta: S(it) to t = 5e6 (5e7 samples at dt = 0.1; 4e7 at dt = 0.05 to 2e6); controls to t = 500 .. 4000 | <= 1.0e-17 (eps = 0.3), <= 7.0e-12 (eps = 0.03) at window 503; falls about 100x per doubling of the window; no floor found | <= 8.5e-12 (eps = 0.3; window-limited) | limit 1.16e-4 = pole side (84 pairs below 2000); FFT/pole = 1.00008, 1.00006 (fine grid) | limit 9.90e-3; FFT/pole = 0.99988 | limit 0.132; FFT/pole = 0.99999 | limit 2.46e-4 (23 pairs below 500); FFT/pole = 0.970 (at the FFT floor) | CLOSED: leakage = the Blaschke (pole) term exactly; no excess |
| 3 | even-odd-boundary-energy + boundary-kernel-pa | `w_h(t) = (E_+ - E_-)/|F|^2 / theta'(t)^2 = Re(F'/F)(h+it)/(h theta'^2)`, h = a/2, a in {0.02, 0.1, 0.25} | zeta t <= 5e6 (2.0e8 points, GPU float64 + ball re-check); others ball, t <= 500 .. 1e4 | min 0.2125, 0.2121, 0.2096 at t = 3,345,824.525; no negative sample | min 0.3158, 0.3152, 0.3120 (t <= 1e4); none negative | first negative t = 85.45; first off-line ordinate 85.699 (d = 0.3085); 1239 / 1183 / 882 negative samples, all inside half-disks | first negative t = 13.90; first foot 14.135 (d = 0.25) | first negative t = 2.475; first foot 2.860 (d = 0.404) | first negative t = 111.50; first foot 111.694 (d = 0.243) | CLOSED: restates row G8 (shear half-disks) |
| 4a | axis-limit-laguerre | `lag = (h'^2 - h h'')/h^2`, normalised by `h'^2/h^2 + |h''/h|` and by `theta'^2` | as 3 | min 0.1987 (t = 3,296,377.7) and 0.2126 (t = 3,345,824.525); none negative | min 0.2876 and 0.3158; none negative | negative on 192 intervals below 4000, first [85.45, 85.95]; all 1240 samples within d of an off-line foot; all 84 tabulated pairs below 2000 seen | negative at 1516 of 1516 feet below 2000 | negative at 171 of 350 feet (the others are masked by a zeta zero) | negative at 23 of 23 feet below 500 | CLOSED: negative only within d of an off-line foot (identity (1.2)) |
| 4b | route-b-half-gram-interlacing | fraction of half-Gram intervals `theta in [(m+1/2) pi, (m+3/2) pi)` not containing exactly one zero | zeta 1.0016e7 intervals (t <= 5e6); chi_-4 12,348; DH 4,497 | 0.5464 (first 302; source: 167/302 = 0.553), 0.461 (t <= 1e4), 0.4053 (t <= 5e6; octiles 0.4156 -> 0.4016) | 0.528 (octiles 0.563 -> 0.517) | 0.593 (octiles 0.649 -> 0.565) | 1 (no on-line zero) | identical to zeta (same zeros, same theta) | not defined (no lattice) | CLOSED: a zero-count statistic without a threshold; T-NR passes identically; not flat in height |

Controls that are not formulable here: the sign-twisted prime series and the unimodular twist have no functional equation
`s <-> 1 - s`, so `F` is not even, `kappa` is not even, `S = N/D` is not unimodular on the axis and `h` is not real on the
line; none of the four statistics is defined for them (cell N in the notation of `stack-combinator/TABLE.md`).

## 1. The common reduction (why none of the four can separate)

Notation of PR 43 / PR 44 and the square-root lane: `F(z) = xi(1/2+z) = int kappa(u) e^{zu/2} du`, `kappa(u) = Phi(u/4)`,
`L = F'/F`, `W(x,t) = Re(F' conj F)(x+it) = |F|^2 Re L`, `D = F + alpha F'`, `N = F - alpha F'`, `S = N/D`. A control enters
through its own even real `F` and `kappa`.

**(1.1) Partial fractions (CLASSICAL).** `F` even, real, entire of order one, zeros `+-i gamma_k` (on the line) and quartets
`+-d_j +- i g_j` (off the line, `d_j > 0`):

    Re L(x+it) = sum_k x/(x^2 + (t-gamma_k)^2)  +  sum_j 2x (x^2 + (t-g_j)^2 - d_j^2) / (((x-d_j)^2 + (t-g_j)^2)((x+d_j)^2 + (t-g_j)^2)).

Every on-line term is positive for `x > 0`. The term of an off-line pair is negative exactly in the open half-disk
`(t-g_j)^2 + x^2 < d_j^2`. Hence `Re L(x+it) < 0` implies that `x+it` lies in the half-disk of an off-line zero. (This is row
G8 of the map; it is used here as the filter.)

**(1.2) Axis limit (PROVED, zeta-view KLEIN-ANNULUS sec 7 with (1.1)).** With `h(t) = F(it)`:

    (h'^2 - h h'')/h^2 = lim_{x->0} Re L(x+it)/x = sum_k 1/(t-gamma_k)^2 + sum_j 2((t-g_j)^2 - d_j^2)/((t-g_j)^2 + d_j^2)^2,

negative only if `|t - g_j| < d_j` for some off-line pair.

**(1.3) Layer form (PROVED; PR 43 gram_twistor note; re-derived and checked to 75 digits).** With
`M_x(d) = int a e^{xa} kappa(a+d) kappa(a-d) da = int_0^inf 2a sinh(xa) kappa(a+d) kappa(a-d) da`,

    W(x,t) = int M_x(b) cos(tb) db,      sum_{j,k} c_j c_k M_x(b_j - b_k) = (1/2pi) int W(x,t) |c^(t)|^2 dt,   c^(t) = sum c_j e^{i t b_j}.

The node's integral `int_0^4 2a sinh(xa) Q(a) da` is the left side with `b_j = 0.15 j` (the cut at `a = 4` changes nothing at
this precision). For equally spaced nodes the matrix is Toeplitz with symbol `sigma(t) = (1/delta) sum_m W(x, t + 2 pi m/delta)`
on `|t| <= pi/delta`. A negative direction exists for some N iff `sigma` is negative somewhere, that is, iff an off-line
half-disk at height below `pi/delta` is not covered by its aliases. The individual layer `Q(a)` (negative at `a = 1/20` for
zeta) is a property of the kernel shape: it is `+3.86e-4` for chi_-4 and `+4.74e-4` for DH with the same `c`, and `-1.04e-4`
for the heat control.

**(1.4) Boundary energy (PROVED in the source; checked here to 1e-14 at 15 points, including two DH points of each sign).**
`E_+ - E_- = int omega_{a,h}(r) P_a(t-r, t+r) dr = W(h,t)/h` for `0 < h < a`. The statistic of combination 3 is the pointwise
value of `W`, so (1.1) applies verbatim.

**(1.5) Leakage (PROVED: residue computation; the Blaschke structure is row G6; checked on a synthetic multiplier and on three
controls).** Convention `f^(t) = int f(u) e^{itu/2} du`. If `f` is supported in `(-inf, c]` then `phi(z) = e^{-zc/2} f^(z)` is in
the Hardy space of `Re z > 0`. `S = D(-z)/D(z)` is unimodular on the axis and bounded at infinity, with poles in `Re z > 0` at
the zeros `p_j` of `D = F(1 + alpha L)` there. The anticausal part of `S phi` is the sum of its principal parts, so

    ||Q_c C_0 f||^2 = (1/2) sum_{j,k} w_j conj(w_k)/(p_j + conj p_k),      w_j = Res_{p_j} S * phi(p_j),   Res_{p_j} S = 2/(alpha L'(p_j)).

If `F` has no off-line zero then `Re L > 0` in `Re z > 0`, `D` has no zero there and the leakage is 0 for every such `f`.
An off-line pair `+-d + i g` contributes one pole (index count of row G6), near `i g + (1 + alpha l) d^2 / (2 alpha)` for
small `d` (`l` = regular part of `L` at the foot; two-pole model, used as the Newton start). Example: the DH pair
`0.3085 + 85.699 i` gives `p = 0.0515 + 85.743 i`, `|Res| = 0.0969`; the pair `0.0744 + 166.479 i` gives `Re p = 0.0028`. The
leakage of the box pulse is of size `2 Re p |phi(p)|^2 <= 32 Re p / g^2` per pair: it is the
Blaschke mass of the off-line zeros seen through the pulse, with no additional term.

Consequence for zeta (CLASSICAL input: zeros on the line for `|t| <= 3e12`): each of `W(x,t) >= 0`, `lag(t) >= 0`,
`w_h(t) >= 0` holds for `|t| <= 3e12 - 1/2` by (1.1), (1.2), because a negative pair term needs `|t - g| < d < 1/2`. The runs
below confirm this to `5e6` and add nothing to it. An off-line pair of zeta above `3e12` would change the pulse leakage by an
amount of order `Re p * 32 / g^2 <= 1e-23` (compare row P22: 7.1e-25), and would be invisible to the layer forms unless
`delta < pi / 3e12` and the arithmetic carried more than `0.68 * 3e12` digits (`|F|^2 ~ e^{-pi t/2}`).

## 2. Combination 1: negative theta layer / cutoff-energy kernel / degree-9 certificate

Finite consequence. (a) `I_c(x) > 0` on `0 < x <= 2` for the fixed 7-vector and each `F`. (b) For the layer family
`T_N(delta, x) = [M_x((j-k) delta)]_{j,k<N}`: positive definite for all N for zeta; for a control, a negative pivot at some
`(N, delta, x)`. Survival would need a control to turn negative at a `delta` much coarser than `pi/gamma_1` (first off-line
ordinate) or at an `x` unrelated to `d`.

Code: `flib.py` (kernels on a grid, trapezoid rule, error `exp(-pi^2/eta)`), `kernel.py`. Validation: `Q(1/20) =
-0.000908036036923` and `I_c(0.25) = +0.001619366968247` (both reference values reproduced to all printed digits);
`sum_k M_x(k eta) cos(k eta t)` against the closed form `W(x,t)`: relative difference 5e-75 (zeta), 2e-74 (chi_-4), 1.3e-73 (DH);
kernel transform against the closed form: ratio 1 to 50 digits for zeta, chi_-4, DH, `E_a`, T-NR; heat quadrature at the
battery's zero `0.24296 + 111.694 i`: `|F/F'| = 1.3e-30`.

(a) Fixed vector (local, 256 bits; `out/fixed_*.json`). `I_c(x) > 0` at all 23 values of x for all six objects; the 7-node
section is positive definite for all six at every x (smallest pivot: zeta 2.9e-6, DH 1.4e-6, E_a 3.4e-8). No control changes
sign. Reason: the vector has `c^(0) = 0` and spacing 0.15; its spectral weight sits at `t <= 20.9`, while the first negative
half-disks of DH and heat sit at 85.7 and 111.7.

(b) Layer family (server, `out/lev_*.json`; MEASURED, multiprecision midpoints, negative sections re-checked by a direct
quadratic form at 256 more bits with a ball that excludes 0):

| object | x | delta (pi/delta) | sign of the symbol on [0, pi/delta] (step 0.02) | first negative N (span N delta) | value of the form |
|---|---|---|---|---|---|
| zeta | 0.1 | 0.15 (20.9), 0.03 (104.7), 0.005 (628.3; 4096 bits) | positive | none to N = 19,999 (0.005); converged at 3751 (0.03) | - |
| zeta | 0.02, 0.3, 1, 2 | 0.03 | positive | none (converged) | - |
| chi_-4 | 0.1 | 0.15, 0.03, 0.005 | positive | none to N = 19,999 (0.005) | - |
| DH | 0.1 | 0.15, 0.08, 0.05, 0.04, 0.0375 (83.8), 0.0368 (85.4), 0.0364 (86.3) | positive | none to N = 9,999 | - |
| DH | 0.1 | 0.036 (87.3) | negative on [85.45, 85.93] | 378 (13.6) | -1.1e-26 |
| DH | 0.1 | 0.035, 0.03, 0.02 | negative on [85.44, 85.96] (and [114.06, 114.26] at 0.02) | 353, 368, 501 (12.4, 11.0, 10.0) | -9.6e-34 at 0.03 (r_0 = 3.0e-2) |
| DH | 0.02, 0.2, 0.3 | 0.03 | negative on [85.42, 85.98], [85.50, 85.90], [85.64, 85.76] | 349, 462, 1550 | -9.5e-36, -7.1e-34, -2.0e-33 |
| DH | 0.32, 0.5 | 0.03 | positive | none | - (x > d = 0.3085) |
| E_a, a = 1/4 | 0.1 | 0.4, 0.25 (12.6) | positive | none | - |
| E_a | 0.1 | 0.22 (14.28), 0.2, 0.15, 0.1 | negative on [14.02, 14.28], [13.93, 14.33], ... | 77, 76, 89, 121 | -9.8e-5 at 0.22, -1.9e-9 at 0.15 |
| T-NR | 0.1 | 2.197 (1.43), 0.732 (4.29) | positive | none | - |
| T-NR | 0.1 | 1.0986 (2.86), 0.439, 0.146 | negative on [2.50, 2.86], [2.50, 3.22], ... | 6, 15, 40 | -9.6e-2, -2.1e-2, -2.6e-4 |
| heat -0.5 | 0.1 | 0.05, 0.03, 0.0285 (110.2), 0.028 (112.2) | positive | none | - |
| heat -0.5 | 0.1 | 0.0275 (114.2), 0.025, 0.02 | negative on [111.48, 111.90] (and [150.54, 150.86] at 0.02) | 591, 596, 698 | -1.3e-32 at 0.0275, -1.0e-36 at 0.025 |

The negative set of the symbol is the half-disk section `|t - gamma| < sqrt(d^2 - x^2)` of the control (DH: 85.699 +- 0.29 at
x = 0.1; none for x > d). Two cells show aliasing: DH at `pi/delta = 86.3` and T-NR at 4.29 contain the half-disk but the
alias `2 pi/delta - t` adds a larger positive value. For DH the form at the monic predictor is -9.6e-34 against
`r_0 = M_x(0) = 3.0e-2`; it is below float64 resolution. Classification: closed. The control fails when, and only when, the sample spacing resolves its first
off-line ordinate and `x < d`; this is verified height in the Mellin variable, with a digit cost of `0.68 t`.
Not run: zeta at `delta = 0.002` (9216 bits; the symbol scan alone was estimated at 2.9 hours) was stopped.

## 3. Combination 2: pulse leakage and the bridge multiplier

Finite consequence. `ell(eps) = ||Q_1 C_0 f_eps||^2` with `f_eps = 1_[0,1-3eps] * (1_[0,eps]/eps)^{*3}` (supported in [0,1],
`f_eps -> 1_[0,1]`), `alpha = 1`. Zeta: `ell(eps) = 0` for every eps (given the verified height, up to about 1e-23). Control: by
(1.5) `ell` equals the pole sum. Survival would need a control whose measured `ell` exceeds its pole sum.

Code: `leak.py`. FFT side: `S(it)` on a uniform grid (ball values from `linescan.py`; for zeta above t = 1e4 float64
Riemann-Siegel values from `gpuline.py`, which agree with the ball values on 100 <= t <= 1e4 to 1.0e-5 rms, 1.5e-4 max above
t = 1000), one real FFT per eps. Pole side: Newton for `1 + alpha L = 0` from the two-pole model at each tabulated off-line
zero (zero tables of `c12-control-battery-harness`), residues `2/(alpha L')`. Validation on a known answer: synthetic `S` with
two pole pairs and a causal factor, FFT/pole = 0.999996, 0.999993, 1.000004 at eps = 0.1, 0.05, 0.02; causal factor alone:
6e-20.

| object | grid | eps | FFT side | pole side | ratio | note |
|---|---|---|---|---|---|---|
| zeta | ball, t <= 1e4, dt 0.025 (window 503) | 0.3, 0.2, 0.1, 0.05, 0.03 | 1.0e-17, 7.4e-17, 8.6e-15, 6.3e-13, 7.0e-12 | 0 | - | energy check exact to 1e-16 |
| zeta | t <= 2e6, dt 0.05 (window 251) | 0.3, 0.1, 0.03, 0.01, 0.003, 3e-4 | 6.6e-15, 3.3e-12, 5.4e-9, 1.5e-7, 1.4e-6, 2.9e-6 | 0 | - | window-limited (see below) |
| zeta | t <= 5e6, dt 0.1 (window 126) | 0.3, 0.1, 0.03, 0.01, 1e-4 | 6.4e-13, 3.2e-10, 3.1e-7, 4.6e-6, 2.8e-5 | 0 | - | window-limited |
| chi_-4 | ball, t <= 1e4, dt 0.05 | 0.3, 0.2, 0.1 | 8.5e-12, 8.7e-12, 4.6e-9 | 0 | - | window-limited |
| E_a | ball, t <= 2000, dt 0.025 | 0.3, 0.2 | 2.21794e-4, 3.40622e-3 | 2.21820e-4, 3.40663e-3 | 0.99988, 0.99988 | 1509 poles; limit eps -> 0 of the pole side: 9.90e-3 |
| T-NR | ball, t <= 2000, dt 0.025 | 0.3, 0.2 | 2.13074e-3, 3.38574e-2 | 2.13077e-3, 3.38577e-2 | 0.99999, 0.99999 | 350 poles; limit 0.132 |
| heat -0.5 | ball, t <= 500, dt 0.05 | 0.3 | 1.92e-11 | 1.98e-11 | 0.970 | 23 poles; at the FFT floor (1e-11); limit 2.46e-4 |
| DH | ball, t <= 1500, dt 0.005 (window 2513) | 0.3, 0.2 | 1.41931e-12, 1.00842e-8 | 1.41920e-12, 1.00836e-8 | 1.00008, 1.00006 | 50 poles below 1500; limit eps -> 0 of the pole side: 1.13e-4 (1.16e-4 with the 84 poles below 2000), of which 5.4e-5 from the pair at 85.7 |
| DH | ball, t <= 4000, dt 0.05 | 0.3, 0.2, 0.1 | 4.7e-11, 6.4e-8, 2.3e-6 | 1.4e-12, 1.0e-8, 2.9e-7 | 33, 6.3, 7.6 | NOT a valid comparison: grid does not resolve the poles (Re p down to 0.0028) |

Reading. (i) For the three controls whose poles are resolved by the grid the FFT leakage equals the pole sum to 1e-4 or
better: the limit is the Blaschke term and nothing else. (ii) The regularised pulse sees a pole at height g only when
`eps <~ 4/g` (`|phi_eps(p)|^2` carries `(4/(eps g))^6`): DH at eps = 0.3 has leakage 1.4e-12, at eps = 0 it has 1.16e-4. The
pulse scale at which a control departs from zeta is the height of its first off-line zero. (iii) The FFT side for zeta is
limited by the periodic window `4 pi/dt`, not by the function: `S` is all-pass with group delay `4 alpha |h''/h|` at the local
extrema of `h`, unbounded along the line, so the output has a long tail at negative u that wraps into `u > 1`. At fixed eps
the measured number falls by about 100 per doubling of the window (eps = 0.3: 6.4e-13, 6.6e-15, 1.0e-17 at windows 126, 251,
503; eps = 0.03: 3.1e-7, 5.4e-9, 7.0e-12). No positive floor is seen; the numbers are upper bounds. The eps -> 0 sequence for
zeta is therefore resolved only to eps = 0.03 (7.0e-12); below that the entries are window artefacts and are reported as such.
(iv) The conjugate multiplier `conj S` (anticausal) on the same pulse gives 3.5e-3 of 1.8e-2 input energy at eps = 0.3, so the
test has power where causality fails.

Classification: closed. Leakage is the Krein/Blaschke index term of row G6 evaluated on one vector; a control's leakage is
its off-line zeros' mass at the pulse scale, exactly.

## 4. Combinations 3 and 4: boundary energy, Laguerre form, half-Gram lattice

Finite consequences. (3) `w_h(t) >= 0` for all t and `h = a/2`, `a in {0.02, 0.1, 0.25}`. (4a) `lag(t) >= 0` for all t. (4b)
the failure fraction of the half-Gram lattice. Survival would need a control with a negative value at a point outside every
half-disk of (1.1), or a threshold in (4b) that zeta meets and a control with on-line zeros of zeta's density misses.

Code. `gpuline.py`: zeta on the GPU, `Z(t - ih) = e^{i theta} A(-h) + e^{-i theta} conj A(h) + R`, Riemann-Siegel main sums
as one complex matrix product per block (50,000 ordinates x up to 892 terms), remainder terms C0 and C1 continued to complex
argument, analytic derivatives; zeros by sign changes with a cubic Hermite root and a close-pair rule; 2.0e8 ordinates
(dt = 0.025) in 1071 s. `linescan.py` + `analyze.py`: ball values of `F'/F` and `F''/F` (128 bits; heat by quadrature at up to
about 820 bits). Validation: `F'/F` from the GPU formulas against balls: relative error 1.7e-5 (t = 200), 4.2e-6 (3e3), 7.7e-8 (5e4),
3.9e-9 (1e6); identity (1.4) by direct quadrature: 1e-14; zero count 100 <= t <= 3000: 2440 = `zeta_nzeros` difference; first
Gram failure at [280.80, 282.45] (Titchmarsh's g_125, g_126); first half-Gram violation [20.654, 25.492] (the source's
interval). The census of the source (167 of 302 half-Gram, 16 of 302 Gram) is reproduced as 165 and 14 of 302 with intervals
indexed from `theta = pi/2` and `theta = 0`; the source's index convention is not on file, the difference is two intervals.
Approximate functional equation sums without a remainder term were tried for chi_-4 and DH and rejected: they miss 1% of the
zeros and produce false negative Laguerre samples (87 at t <= 3000 for chi_-4). chi_-4 and DH are therefore ball scans only.

| object | height | on-line zeros | w_h minimum (h = 0.01, 0.05, 0.125) | Laguerre: normalised min, theta'^2-normalised min | negative samples (lag; w_h) | inside a half-disk | first negative t / first off-line ordinate (d) | half-Gram, Gram failure fraction |
|---|---|---|---|---|---|---|---|---|
| zeta (float64 + ball re-check) | 100 .. 5e6 | 10,016,439 counted; exact 10,016,445 | 0.21255, 0.21209, 0.20964 at 3,345,824.525 | 0.19867 at 3,296,377.7; 0.21256 at 3,345,824.525 | 0; 0, 0, 0 | - | none | 0.4053, 0.2492 |
| zeta (ball) | 0 .. 1e4 | 10,142 | 0.2959, 0.2955, 0.2935 at 8647.15 | 0.1732 at 10.8; 0.2959 at 8647.15 | 0; 0, 0, 0 | - | none | 0.4611, 0.1615 |
| chi_-4 (ball) | 0 .. 1e4 | 12,349 | 0.3158, 0.3152, 0.3120 at 9908.45 | 0.2876 at 6786.75; 0.3158 | 0; 0, 0, 0 | - | none | 0.5277, 0.0897 |
| DH (ball) | 0 .. 4000 | 4,110 (lattice count 4,499) | negative | -1.0; -556 | 1240; 1239, 1183, 882 | 1240 of 1240; all | 85.45 / 85.699 (0.3085) | 0.5928, 0.1278 |
| E_a, a = 1/4 (ball) | 0 .. 2000 | 0 | negative | -1.0 | 23,924; 23,906, 23,460, 20,794 | all | 13.90 / 14.135 (0.25) | 1 |
| T-NR (ball) | 0 .. 2000 | 1,517 | negative | -1.0 | 2,064; 2,064, 2,101, 2,299 | all | 2.475 / 2.860 (0.4038) | 0.4937, 0.1043 (zeta's values at this height) |
| heat -0.5 (ball) | 0 .. 500 | 223 | negative | -1.0 | 251; 251, 248, 222 | all | 111.50 / 111.694 (0.2430) | not defined |

Re-check of the float64 extremes with balls (`out/recheck_ZETA.json`): the four smallest normalised Laguerre values, the four
smallest `theta'^2`-normalised values and the three smallest `w_h` for each h agree with the ball values to between 8 and 10
digits (for example 0.19866888834 against 0.19866888629; 0.21256473800 against 0.21256473801). The float64 zero count is 6
short of the exact count 10,016,445 (three close pairs not resolved by the pair rule, or end effects); this changes the
interval fractions by less than 1e-6.

DH detail. Below 2000 all 84 tabulated off-line pairs are seen by the Laguerre form and by `w_0.01`; `w_0.05` sees the 80
pairs with `d > 0.05`, `w_0.125` the 61 pairs with `d > 0.125`. Between 2000 and 4000, 108 further off-line zeros were located
by Newton from the negative intervals; no negative sample is left unexplained. T-NR: 179 of 350 feet show no negative sample
because a zeta zero within about 0.3 of the foot contributes a larger positive term; the off-line pair is then invisible to
the pointwise forms. The minimum of the zeta statistic decreases slowly with height (0.349 below 1.35e3, 0.276 near 1.5e4,
0.240 near 1.4e5, 0.224 near 7.5e5, 0.2125 at 3.3e6): it is `8/(pi^2 g^2)` at the centre of the largest normalised gap g and
follows the growth of g. It has no sign content.

Half-Gram. The fraction is not flat in height: zeta 0.546 (302 intervals), 0.461 (1e4), 0.4156 in the first octile of the
1.0e7 intervals and 0.4016 in the last. The Gram failure fraction rises (0.046, 0.162, 0.233 -> 0.2555). Both move towards a
common limit as the lattice decorrelates from the zeros. chi_-4 (0.528 at 12,348 intervals) and DH (0.593 at 4,497) are in the
same range at their heights; DH is higher by its empty intervals (1527 empty against 1139 double) because 8% of its zeros are
off the line. The statistic has no threshold that zeta meets; T-NR, which has an off-line quartet at every `(2k+1) pi/log 3`,
has zeta's on-line zeros and zeta's theta and therefore zeta's fraction exactly. E_a has no on-line zero and fails in every
interval, which is its off-line zeros counted.

Classification: closed (3 and 4a by (1.1), (1.2) = row G8; 4b is a zero count).

## 5. Survivors

None. For each combination the reason is an identity, not the size reached:

1. layer forms: `(1/2pi) int W |c^|^2 dt`; a control is detected iff `pi/delta` exceeds its first off-line ordinate and `x < d`;
2. leakage: the pole (Blaschke) sum of the off-line zeros; FFT/pole = 1 to 1e-4 on the resolved controls;
3. boundary energy: the pointwise value `W(h,t)/h`; negative only in the half-disks;
4. Laguerre: the limit `x -> 0` of the same; half-Gram: a count of on-line zeros.

All four use every prime only through `F`; none uses multiplicativity; all are flow-stable in the sense of row G22 (the heat
control keeps kernel positivity and fails only at its own off-line zeros).

## 6. Sizes and compute

Server (through `rhrun`, units `rh-s1ab*`, all stopped): GPU 1 float64 scan of zeta, 2.0e8 ordinates to t = 5e6 (1.0016e7
zeros), 18 min, cupy pool limit 8 GB (the card had 12 GB free); ball line scans, 5 to 7 cores: zeta to 1e4 (4.0e5 points),
chi_-4 to 1e4, DH to 4000 and to 1500 on a fine grid, E_a and T-NR to 2000, heat to 500; Levinson runs to 4096 bits, 1 core;
real FFTs of length 8e7 and 1e8, memory request 6 GB. Local (through `scripts/memcap.sh 8`): validation and the fixed-vector scan.
One unit was killed by its 6 GB memory limit (FFT at 5e7 complex samples); the code was changed to apply the pulse factor in
place and re-run at the same limit. Planned larger sizes that were cut for time: chi_-4 and DH to 2e4 (set to 1e4 and 4000),
zeta at `delta = 0.002`.

## 7. Weakest steps

1. The kernel-side numbers are multiprecision midpoints with a trapezoid rule whose truncation error is modelled, not enclosed;
   only the negative quadratic forms carry a ball, and that ball does not include the quadrature error of the entries.
2. The zeta leakage below eps = 0.03 is window-limited; "leakage -> 0" for zeta is supported by the scaling with the window
   and by identity (1.5), not by a converged FFT sequence. The DH FFT comparison rests on one fine grid to t = 1500.
3. Off-line zero tables for DH and heat are the battery's (MEASURED, not interval certificates); "inside a half-disk" for DH
   above 2000 uses zeros located here by Newton from the negative intervals, which makes that part of the check circular in
   form (a located zero within d of the sample), though each located zero is a ball-verified root.

## 8. Files

`flib.py` (objects, kernels), `kernel.py` (combination 1), `linescan.py`, `analyze.py`, `gpuline.py`, `recheck.py`
(combinations 3, 4), `leak.py` (combination 2), `mk_rs.py`, `rs_cheb.json`, `t_flib.py`, `t_gpu.py`, `t_gpu2.py`,
`t_identity.py` (validation), `run_*.sh` (server jobs), `data/` (zero tables copied from `c12-control-battery-harness`),
`out/` (`fixed_*.json`, `lev_*.json`, `an_*.json`, `leak_*.json`, `gpu_ZETA.json`, `recheck_ZETA.json`,
`identity_check_boundary_energy.json`). Server copy: `~/rh-push/s1-antibridge-cutoff-energy/` (also holds the `.npz` scans
and the 0.8 GB phase array of `S`).
