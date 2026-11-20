# s6-heat-winding-rouche-reference-charts: screening of four combinations (Rouche tests with prime-built references)

Lane: screener, 2026-11-20. Verdict: 4 combinations tested, **0 survivors**.

Labels: PROVED (short argument here), CLASSICAL, MEASURED (float64 on the two-ladder approximant unless a precision is stated),
STRUCTURAL (follows from the definition of the control), NOT RUN. No claim about RH or Lambda. No bound moves.

Outcome in one paragraph. All four combinations ask whether a reference function built from primes (Euler factors p <= P of the
Riemann-Siegel main sum, or the main sum itself) is close enough to H_t to transfer the zero count. (1) At t = 0 the test is false
for zeta itself: the fraction of boxes [x, x+1] x [0.1809, 1] with sup |H_0/Q - 1| < 1 is below 1 at every height from 1e4 to 1e13
and decreases with height at a fixed prime cut-off (P = 1000: 0.9981 at 1e5, 0.9714 at 1e13; with the lower edge at y = 0.03:
0.70 down to 0.10). At t = 0.05 and 0.16 zeta passes in every box above 1e6 (1e5), and so do L(chi_-4), L(chi mod 5), the T-NR
function with q = 1000003 (which has 1.10 off-line zeros per box at t = 0; they have landed by t = 0.05), T-NR with q = 3 with its
own factor, Davenport-Heilbronn with the combination of its two Euler products, the sign twist and the unimodular twist; the
heights at which they start to pass are the heights at which the effective abscissa (1+y)/2 + (t/4) log(x/4 pi) reaches about 1.
(2) On charts of width 1 along Re s = 1/2 + d the certified fraction for zeta is 0.0002 (d = 0.02), 0.39 (d = 0.1) and 0.9960
(d = 0.25) at 1e13 with P = 1000; it is never 1 above 1e4. Davenport-Heilbronn reaches 0.970, and 0.9998 on the charts that
are not near one of its own off-line zeros. (3) With the reference B_0 (first term) zeta is the last function to satisfy the slice
bound (not on every box even at 1e13), Davenport-Heilbronn satisfies it from 1e12; with the reference B (full direct ladder) every
function, Davenport-Heilbronn and both twists included, satisfies it from the same height 1e7 to 1e9, where the direct ladder
moves to the right of 1. (4) The empirical threshold x0_F(t) is 0 for zeta, for zeta(s+0.1) zeta(s-0.1) (t >= 0.02, PROVED), for
T-NR with q = 1000003 (t >= 0.05) and for the backward heat control (t >= 0.1); for Davenport-Heilbronn and T-NR with q = 3 it lies in
the same brackets ((1e5, 1e6) at t = 0.16, (1e7, 1e8) at t = 0.126, (1e8, 1e10) at t = 0.10, above 1e13 at t = 0.05), that is
x0 = 4 pi exp(c/t) with c between 1.4 and 2.05 for both, against c = 5.3 to 5.8 in the explicit threshold for zeta.

## 0. Table

Columns X = start of the strip of boxes; "1" means every box. Full tables: `tables.md`.

| # | combination | statistic | sizes reached | zeta | L(chi_-4), L(chi mod 5) | controls | classification |
|---|---|---|---|---|---|---|---|
| 1 | exhaustive-winding-certificate + w2-certified-winding-ingredients + winding-barrier-above-tpt + winding-barrier-mesh-cost | margin 1 - sup over [x, x+1] x [y0, 1] of abs(f E_P - 1), f = H_t/B_0 (two-ladder approximant), E_P = prod_{p <= P} (1 - b_p p^(-s*)); fraction of boxes with positive margin; winding number of f on every box | X = 1e4, 1e5, 1e6, ..., 1e13; 262,142 boxes per X for zeta and L(chi) (8,128 at 1e4, 65,472 at 1e5), 131,071 for the controls; 16 heights y per box, 16 points per unit x; t in {0, 0.05, 0.16}; P in {1 (B_0), 2, 13, 97, 1000} | t = 0, y0 = 0.1809, P = 1000: 0.9897, 0.9981, 0.9978, 0.9963, 0.9935, 0.9899, 0.9861, 0.9817, 0.9762, 0.9714 (X = 1e4 .. 1e13): **premise false**. y0 = 0.03: 0.70 .. 0.10. t = 0.05, y0 = 0.1809: 1 for X >= 1e6 (smallest margin 0.108 .. 0.348). t = 0.16: 1 for X >= 1e5 (P >= 97) | within 0.003 of zeta at t = 0 (0.9695 and 0.9688 at 1e13); 1 from 1e5 at t = 0.05 | t = 0.05, y0 = 0.1809, P = 1000: T-NR q = 1000003 with the zeta-type factor: 1 at every X; T-NR q = 3 own factor: 0.93 .. 0.9995 (0.999 to 1 on boxes away from its unlanded pairs); DH with the combination reference 0.9795 .. 0.99992 (away from its zeros 0.9946 .. 0.99998), with formal a(p) factors 0.67 .. 0.92; sign twist and unimodular twist 0.79 .. 1 (1 at 1e13); heat (zeta at t - 0.1 = -0.05) 0.82 .. 0.017. t = 0.16: every control 1 from 1e5 (T-NR q = 3 own), 1e6 (DH combination, heat), 1e8 (twists), 1e10 (DH formal). t = 0: zeta(s+0.1) zeta(s-0.1) 0.22 .. 0.0000 (a zero in 99.9 % of the boxes at 1e13) | CLOSED. False for zeta at t = 0, with the cost growing in X; at t > 0 passed by T-NR q = 1000003, DH and the twists from the height where the effective abscissa reaches 1 |
| 2 | moving-reference-rouche-gluing + zero-channel-certificates + ht-corridor-window-census + log-phase-spiral-arg-zeta | charts of width 1 in Im s on Re s = 1/2 + d: sup abs(F - Q) against inf abs(Q), Q = prod_{p <= P}(1 - p^-s)^-1 (the common gamma factor divided out), F = RS main sum; fraction certified | Im s = 5e3 .. 5e12; 131,070 charts per X for zeta and L(chi) (4,032 at 1e4, 32,704 at 1e5), 65,535 for the controls; d in {0.02, 0.1, 0.25}; P in {1, 2, 13, 97, 1000}. Disk certificate at 14.1347 reproduced for tau = -0.05 .. 0.05 | d = 0.25: 1 at 1e4, then 0.9995 .. 0.9960; d = 0.1: 0.75 .. 0.39; d = 0.02: 0.11 .. 0.0002 (P = 1000). In P at 1e13, d = 0.25: 0.505, 0.523, 0.831, 0.955, 0.996. **Never 1 above 1e4.** Pointwise form abs(F/Q - 1) < 1 at d = 0.25, P >= 97: 1 at every X; at d = 0.1: 0.991 .. 0.981 | d = 0.25: 0.9980 / 0.9976 at 1e13 | d = 0.25, P = 1000 at 1e13: T-NR q = 1000003 0.9957 (own), 0.9888 (zeta-type); T-NR q = 3 0.869 (own), 0 (zeta-type); DH combination 0.970, and 0.9998 on charts away from its zero boxes; twists 0.995; zeta(s+0.1)zeta(s-0.1) 0.467. Pointwise form at d = 0.25: both T-NR functions 1 at every X; DH 0.99; twists 0.84 .. 1 | CLOSED. Zeta is not certified on every chart at any d <= 0.25; in the pointwise form at d = 0.25 it is, and so are both T-NR functions; DH's deficit sits at its own zeros (zero-resolved) |
| 3 | section47-winding-h6 + s-barrier-statement + slab-44-nonvanishing-target + sigma-b-abscissa-sensitivity | on the slice y* <= v <= 0.8645 of each box at t* = 0.1262875: (a) abs(f - 1) < 1 (reference B_0); (b) B != 0 and abs(A/B) < 1 (reference B = direct ladder); zeros of B and of f per box | X = 1e4 .. 1e13, 131,071 boxes per X (2.3e7 points per X for y* = 0.165); y* in {0.03, 0.04, 0.10, 0.165, 0.1809, 0.20, .., 0.80}; also t = 0.16 | (a) y* = 0.165: 0.44 .. 0.91, not 1 at 1e13 (largest sup 2.41). (b) y* = 0.165: 0.932, 0.967, 0.9924, 0.99969, then 1 from 1e8; y* = 0.03: 1 from 1e9. B has zeros in the slice at 1e4 .. 1e6 (0.020, 0.0064, 0.0006 per box) | (a) chi_-4: 1 at 1e13; chi mod 5: 0.94. (b) 1 from 1e7 | (a) DH: 1 from 1e12; T-NR q = 1000003: 1 from 1e6; T-NR q = 3: 0.50 at 1e13; twists: equal to zeta to 0.001 from 1e9; heat: 0.53. (b) DH: 0.9999 at 1e7, 1 from 1e8; twists: 1 from 1e8 / 1e9; heat (zeta at t = 0.0263): 0.997 at 1e13. No box where (b) holds and f has a zero | CLOSED. (a) is a size condition on the coefficients (DH passes before zeta). (b) holds for every function from the height where the direct ladder is right of 1; no unsound case |
| 4 | explicit-kkl-threshold + mem-kkl-x0 + exact-de-bruijn-evaluator-ceiling + dbn-window-freeze-theorem | x0_F(t) = largest x with a non-real zero of H_t, from winding numbers of f on [x, x+1] x [0.03, 1] | X = 1e4 .. 1e13 (t = 0, 0.05, 0.1263, 0.16); X = 1e4, 1e5, 1e6, 1e8, 1e10, 1e13 (t = 0.10, 0.20, 0.30, 0.50); pairs below x = 1e4 from lane s3 | no non-real zero at t >= 0.05 at any X (at t = 0 the approximant has 0.004 .. 0.00002 per box below 1e11: approximation error) | none at t >= 0.05 | DH: 0.031 .. 0.136 per box at t = 0; x0 in (1e5, 1e6) at t = 0.16, (1e7, 1e8) at 0.1263, (1e8, 1e10) at 0.10, above 1e13 at 0.05, below 1e4 at 0.20. T-NR q = 3: the same brackets. T-NR q = 1000003: 1.10 per box at t = 0, none at t >= 0.05. zeta(s+0.1)zeta(s-0.1): none for t >= 0.02 (PROVED). heat: none for t >= 0.1 (STRUCTURAL) | CLOSED. x0_F(t) is the landing of the control's own pairs; three controls with off-line zeros have x0 = 0 on t >= 0.1; the law 4 pi exp(c/t), c = 1.4 .. 2.05, is the same for DH and T-NR |

All numbers MEASURED unless marked.

## 1. Object, code, validation

### 1.1 Object

Polymath variables: z = x + iy, s = (1 + y - ix)/2, w = 1 - s. For a completed function Lam(s) = G(s) F(s) = eps conj-dual(1 - s),
F(s) = sum a(n) n^-s, alpha = G'/G, M_t = G exp((t/4) alpha^2), b_n = exp((t/4) log^2 n), N = floor(sqrt(q x/4 pi + t/16)):

    H_t  ~  M_t(s) sum_{n <= N} a(n) b_n n^(-s - (t/2) alpha(s))  +  eps M_t(w) sum_{n <= N} conj(a(n)) b_n n^(-w - (t/2) alpha(w))  =  B + A,
    f = H_t / M_t(s) = D + eps (M_t(w)/M_t(s)) R,   s* = s + (t/2) alpha(s),   Re s* = (1+y)/2 + (t/4) log(q x/4 pi) + O(1/x).

For zeta this is A + B of Polymath15 with B_0 = M_t(s); for a general gamma factor it is the same second-order saddle computation
term by term (E G(s + delta) n^(-s-delta), delta normal with variance t/2). The test object is this approximant; no Riemann-Siegel
correction term is included. References: E_P(s*) = prod_{p <= P}(1 - a(p) b_p p^(-s*)), statistic abs(f E_P - 1) ("H_t/Q - 1" with
Q = B_0/E_P).

Functions (file `rlib.py`).

| code | function | gamma factor, q | reference(s) | off-line zeros |
|---|---|---|---|---|
| ZETA | zeta | (s(s-1)/2) pi^(-s/2) Gamma(s/2), 1 | Euler factors p <= P | none known |
| CHI4, CHI5 | L(s, chi_-4); L(s, chi), chi mod 5 with chi(2) = i (root number computed) | (q/pi)^(s/2) Gamma((s+1)/2), 4 and 5 | own Euler factors | none known |
| DH | Davenport-Heilbronn = c1 L(chi) + c2 L(chibar), c1 = (1 - i kappa)/2 | conductor 5, odd | "c": c1/E^chi + c2/E^chibar (prime-built, can vanish); "a": formal factors (1 - a(p) b_p p^-s*) | 84 pairs with gamma < 2000 (table of lane s3) |
| TNR3, TNR1000003 | xi(s)(q^(s-1/2) + q^(1/2-s) + 2.2) | exact at every t by the identity of 1.2 | "o": own factor (the same combination applied to 1/E_P; carries the zeros); "z": zeta-type factor of the dominant piece (zero-free) | y = 0.8075, one per 11.44 in x (q = 3); y = 0.0642, one per 0.910 in x (q = 1000003) |
| EA | zeta(s + 0.1) zeta(s - 0.1), t = 0 only | product | product of the two Euler products | all zeros, y = 0.2 |
| HEAT | backward heat deformation: zeta's kernel started at time -0.1, so the control at time t is zeta at t - 0.1 | zeta's | zeta's at t - 0.1 | 0.04 .. 0.63 per box at t = 0 (measured below) |
| SGN, U | completely multiplicative random sign (+ at 2, 3, 5, 7, 11, - at 13) and random phase at primes | none: formal two-ladder sum with zeta's gamma factor and conj(a) on the reflected ladder | own Euler factors | the formal sum has 0.05 .. 0.33 zeros per box at t = 0 |

### 1.2 Two identities used (PROVED)

(i) Heat flow of a T-NR function. With lambda = log q and H_t the zeta family,

    H_t^TNR(z) = exp(lambda^2 t/4) [ e^(-i lambda z/2) H_t(z + i lambda t) + e^(i lambda z/2) H_t(z - i lambda t) ] + c H_t(z).

Proof: H_t(z) = E H_0(z + i sqrt(2t) N), and E e^(-aN) phi(N) = e^(a^2/2) E phi(N - a) with a = mu sqrt(2t), mu = -+ lambda/2,
applied to e^(i mu z) H_0(z). Consequence: for y > 0 the dominant piece is zeta's H_t at the height y + lambda t (for q = 1000003:
y + 0.69 at t = 0.05, y + 2.21 at t = 0.16). T-NR at time t > 0 is zeta further to the right plus two exponentially smaller pieces.
Checked against Gauss-Hermite integration of the completed function (1.4).

(ii) At t = 0 the statistic of T-NR with its own factor is zeta's: F/Q_own = zeta E_P. Measured: the fractions agree to the
fourth decimal at every X (0.9714 and 0.9714 at 1e13, y0 = 0.1809; 0.1017 and 0.1017 at y0 = 0.03).

(iii) Rouche form used throughout: if abs(f/Q - 1) < 1 on the boundary of a box, f and Q have the same number of zeros inside.
With Q = B_0/E_P and max_p b_p p^(-Re s*) < 1, Q is zero-free and f has no zero. With the "c" and "o" references Q can vanish and the
test transfers the count; where both windings were computed and the margin is positive they agree in 99.98 % to 100 % of the
boxes (the exceptions have a zero within one grid step of the box boundary).

### 1.3 Method

Rows of D, R, E_P on uniform grids (step 1/16 in x) at 16 heights y = 0.03, 0.04, 0.10, 0.165, 0.1809, 0.20, 0.28, 0.36, 0.44, 0.50,
0.60, 0.70, 0.80, 0.8645, 0.93, 1.0 over [X, X + 262144] (two chunks of 2^21 points; for X <= 1e7 shorter chunks), by a
type-1 nonuniform FFT over the frequencies (log n)/2 (kernel width 12, oversampling 2, relative error 2e-12). Phases (x_c/2) log p
mod 2 pi from 256-bit ball arithmetic at the chunk centre; gamma data (alpha(s), alpha(w), log M_t(w)/M_t(s)) as degree-11
polynomial fits of 256-bit values; the drift of Re s* over a chunk by a Taylor expansion to second order; changes of N inside a chunk
by adding the new terms from their window edge on. Euler products: p <= 13 directly, larger blocks through the logarithm series by
the same NUFFT. Per box (width 1, 17 points per level): max over the levels >= y0 of abs(f E_P - 1) (a lower bound for the supremum over
the box, attained on its boundary; so "margin <= 0" is decided, "margin > 0" is a grid statement), the winding number of f on the
box boundary (rows at step 1/16, sides at the 16 levels), and the largest phase step used.

### 1.4 Validation (MEASURED)

- Engine against an independent 256-bit evaluation of the same formula (`validate.py`, x = 1e6, 6 points, 3 heights, 12 function/time
  pairs including t = -0.1 and t = 0.5): largest relative difference 1.6e-8 (1e-10 at t = 0).
- Formula against the true heat-evolved completed function (Gauss-Hermite, 48 nodes, 256-bit Arb values of zeta and Hurwitz zeta) at x = 1e6:
  relative difference 0.028 (zeta, t = 0, y = 0.03), 0.0083 (t = 0.16), 0.00055 (t = 0.5), 0.029 (t = -0.1); 0.044 / 0.035 (chi mod 5 / DH, t = 0);
  T-NR q = 3: 0.028 / 0.019 / 0.0004 at t = 0 / 0.16 / 0.5; T-NR q = 1000003: 0.028 / 0.0027 / 1.6e-5 at t = 0 / 0.05 / 0.16 (this checks identity (i));
  zeta(s+0.1)zeta(s-0.1): 0.033. The differences are the size of the omitted Riemann-Siegel term and fall with height (table below).
- Zero counts: zeta(s+0.1)zeta(s-0.1) at 1e13: 571,634 zeros in 262,142 boxes = 2.1806 per unit x; the density (1/4 pi) log(x/4 pi) is 2.1806.
  T-NR q = 3: 0.08743 per box at 1e9 .. 1e13; 1/11.4384 = 0.08742. T-NR q = 1000003: 1.0994; log q/(4 pi) = 1.0994.
- Recheck of reported values against the true function (`recheck.py`, server, 160-bit Arb, Gauss-Hermite 40 nodes; boxes drawn at
  random; levels 0.03, 0.1809, 1.0; five points per box-level; P = 1000). "flips" = box-levels whose sign of 1 - max differs between
  engine and true function.

| function | X | t | box-levels compared | flips | largest difference of max abs(f E - 1) | largest abs(f_engine - f_true) | largest relative error of E_1000 | status |
|---|---|---|---|---|---|---|---|---|
| ZETA | 1e+06 | 0 | 120 | 3 | 0.62 | 0.048 | 1.3e-10 | complete |
| ZETA | 1e+06 | 0.05 | 90 | 0 | 0.14 | 0.032 | 9.8e-11 | complete |
| ZETA | 1e+06 | 0.16 | 90 | 2 | 0.019 | 0.014 | 2.5e-10 | complete |
| ZETA | 1e+08 | 0 | 120 | 0 | 0.022 | 0.015 | 1.4e-10 | complete |
| ZETA | 1e+08 | 0.16 | 60 | 0 | 0.0011 | 0.0012 | 8.4e-11 | complete |
| ZETA | 1e+10 | 0 | 90 | 0 | 0.023 | 0.0022 | 1.1e-10 | complete |
| ZETA | 1e+10 | 0.05 | 24 | 0 | 0.0011 | 0.00058 | 5.5e-11 | complete |
| ZETA | 1e+10 | 0.16 | 24 | 0 | 5.4e-05 | 3.2e-05 | 5.9e-11 | complete |
| ZETA | 1e+12 | 0 | 90 | 0 | 0.0072 | 0.00089 | 1.2e-10 | complete |
| ZETA | 1e+12 | 0.16 | 24 | 0 | 1e-06 | 1.6e-06 | 8.5e-11 | complete |
| ZETA | 1e+13 | 0 | 120 | 0 | 0.0051 | 0.00068 | 1.5e-10 | complete |
| ZETA | 1e+13 | 0.05 | 16 | 0 | 0.00018 | - | - | stopped before the end |
| ZETA | 1e+13 | 0.16 | 16 | 0 | 1e-06 | - | - | stopped before the end |
| DH | 1e+06 | 0 | 60 | 3 | 0.057 | 0.035 | 1.5e-10 | complete |
| DH | 1e+06 | 0.05 | 6 | 0 | 0.017 | 0.018 | 7.7e-11 | complete |
| DH | 1e+06 | 0.16 | 8 | 0 | 0.0062 | - | - | stopped before the end |
| DH | 1e+06 | 0.16 | 6 | 0 | 0.0062 | 0.0059 | 9.4e-11 | complete |
| DH | 1e+08 | 0 | 3 | 0 | 0.005 | - | - | stopped before the end |
| DH | 1e+08 | 0 | 2 | 0 | 0.0048 | - | - | stopped before the end |

  969 box-levels in all, 8 sign changes, all at X = 1e6 on the level y = 0.03 with both values between 0.95 and 1.02 (zeta 3 at t = 0
  and 2 at t = 0.16, DH 3 at t = 0; `recheck/`). L(chi_-4) at 1e10 and DH above 1e8: NOT RUN (Arb's Hurwitz zeta costs time linear in the height; two DH jobs and
  the two zeta jobs at 1e13 with t > 0 were stopped before the end and their finished box-levels are counted).

- Low heights with the true functions and the table of off-line DH zeros (`lowdh.py`, 96-bit Arb, x in [200, 3992], 3,792 boxes,
  t = 0): section 2.4.
- Disk certificate (`t2_disk.py`, 256-bit, tau = -0.05, -0.04, .., 0.05): abs F'(c) = 0.0013966 .. 0.0013688 (source: >= 0.0013827 at tau = 0;
  measured 0.0013827), sup abs F'' on the disk 0.002028 .. 0.002016 (source: <= 0.0021), residual abs F(c) + (r^2/2) sup abs F'' = 1.24e-4 .. 1.44e-4
  against the floor r abs F'(c) = 4.79e-4 .. 4.89e-4: one simple zero in the disk at each of the 11 values (grid in tau, not an interval
  certificate in tau).

## 2. Combination 1: relative-error winding certificate with a prime-built reference

**Finite consequence tested.** For each function, time t in {0, 0.05, 0.16}, lower edge y0 in {0.03, 0.1809} and cut-off P: the
fraction of boxes [x, x+1] x [y0, 1] with margin 1 - sup abs(f E_P - 1) > 0. Survival would need: zeta 1 at every X; L(chi) 1; each
control below 1 on boxes farther than 5 from each of its off-line zeros.

### 2.1 Zeta (premise)

Fraction of boxes with positive margin (`tables.md`, first table):

| t, y0, P | 1e4 | 1e5 | 1e6 | 1e7 | 1e8 | 1e9 | 1e10 | 1e11 | 1e12 | 1e13 |
|---|---|---|---|---|---|---|---|---|---|---|
| 0, 0.1809, B_0 | 0.359 | 0.348 | 0.341 | 0.335 | 0.335 | 0.331 | 0.330 | 0.329 | 0.330 | 0.329 |
| 0, 0.1809, 13 | 0.761 | 0.684 | 0.637 | 0.611 | 0.595 | 0.587 | 0.581 | 0.578 | 0.575 | 0.575 |
| 0, 0.1809, 97 | 0.958 | 0.944 | 0.916 | 0.883 | 0.852 | 0.829 | 0.810 | 0.798 | 0.790 | 0.785 |
| 0, 0.1809, 1000 | 0.9897 | 0.9981 | 0.9978 | 0.9963 | 0.9935 | 0.9899 | 0.9861 | 0.9817 | 0.9762 | 0.9714 |
| 0, 0.03, 1000 | 0.705 | 0.578 | 0.491 | 0.412 | 0.330 | 0.258 | 0.201 | 0.157 | 0.125 | 0.102 |
| 0.05, 0.1809, 97 | 0.9857 | 0.9936 | 0.9949 | 0.9979 | 0.9992 | 0.9998 | 0.9999 | 1.0000 | 1.0000 | 1 |
| 0.05, 0.1809, 1000 | 0.9835 | 0.9998 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 0.05, 0.03, 1000 | 0.689 | 0.568 | 0.615 | 0.694 | 0.718 | 0.729 | 0.775 | 0.847 | 0.913 | 0.958 |
| 0.16, 0.1809, 13 | 0.950 | 0.976 | 0.993 | 0.9989 | 1.0000 | 1 | 1 | 1 | 1 | 1 |
| 0.16, 0.1809, 97 | 0.9983 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 0.16, 0.03, 1000 | 0.638 | 0.598 | 0.865 | 0.967 | 0.982 | 0.993 | 0.9987 | 1.0000 | 1 | 1 |

Smallest margin over the boxes, P = 1000, y0 = 0.1809: t = 0: -0.60, -0.54, -0.58, -0.49, -0.58, -0.62, -0.74, -1.22, -0.99, -1.15;
t = 0.05: -0.74, -0.16, 0.108, 0.162, 0.268, 0.262, 0.278, 0.290, 0.347, 0.348; t = 0.16 (P = 97): -0.21, 0.084, 0.157, 0.151, 0.212, 0.307,
0.465, 0.629, 0.763, 0.824.

Reading.
1. t = 0: the premise is false at both sizes asked (and at all ten). At a fixed cut-off the certified fraction falls with height;
   more primes raise it (0.33, 0.57, 0.78, 0.97 for P = 1, 13, 97, 1000 at 1e13) without reaching 1. At P = 1000 > N (X <= 1e7) the
   reference contains primes that the main sum does not; the columns 1e4 and 1e5 for P = 1000 are affected by this.
   Zeta has no zero in any of these boxes (winding numbers 0 at X >= 1e11; 0.004 .. 0.00002 zeros per box of the approximant below, an
   effect of the omitted correction term, 2.4). The failure is not a zero. At y0 = 0.03 the lower edge is 0.015 (in s) from the
   on-line zeros: abs(f E_P) is small there and the margin cannot exceed about abs(f E_P); at this height the statistic reads the
   on-line zeros.
2. t > 0: zeta passes on every box from 1e6 (t = 0.05, P = 1000) or 1e5 (t = 0.16, P >= 97) at y0 = 0.1809. Re s* on the lower edge is
   0.59 + (t/4) log(x/4 pi): 1.04 at (t, X) = (0.16, 1e6), 0.87 at (0.05, 1e13), 1.69 at (0.16, 1e13). The margin increases with X:
   the test becomes the coefficient-side statement to the right of the effective 1-line.
3. Panel count. Median over the certified boxes of sup abs(d(f E_P)/dx)/margin on the lower edge (panels per unit x), P = 1000, at
   X = 1e4, 1e7, 1e10, 1e13: t = 0, y0 = 0.03: 30, 49, 73, 92; y0 = 0.1809: 3.3, 4.2, 5.3, 6.0; t = 0.16, y0 = 0.03: 30, 40, 31, 27;
   y0 = 0.1809: 3.7, 3.0, 1.9, 1.2. The density of zeros per unit x, rho/2 = (1/4 pi) log(x/2 pi), is 0.59, 1.14, 1.69, 2.24. At t = 0
   the panel count is 41 to 51 times rho/2 at y0 = 0.03 and 2.7 to 5.6 times at y0 = 0.1809; at t = 0.16 it decreases.

### 2.2 L(chi)

chi_-4 and chi mod 5 follow zeta within 0.003 at t = 0, y0 = 0.1809, P = 1000 (0.9695 and 0.9688 at 1e13) and are 1 from 1e5 at
t = 0.05 and at every X at t = 0.16. The positive comparison behaves like zeta, including the failure at t = 0.

### 2.3 Controls

Fraction of boxes with positive margin, y0 = 0.1809, P = 1000:

| control, reference | t | 1e4 | 1e5 | 1e6 | 1e7 | 1e8 | 1e9 | 1e10 | 1e11 | 1e12 | 1e13 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| zeta(s+0.1)zeta(s-0.1) | 0 | 0.224 | 0.135 | 0.070 | 0.031 | 0.011 | 0.0036 | 0.0008 | 0.0002 | 0.0001 | 0.0000 |
| T-NR 1000003, own | 0 | 0.9897 | 0.9981 | 0.9978 | 0.9965 | 0.9933 | 0.9901 | 0.9861 | 0.9812 | 0.9757 | 0.9714 |
| T-NR 1000003, zeta-type | 0 | 0.520 | 0.482 | 0.460 | 0.447 | 0.447 | 0.447 | 0.450 | 0.454 | 0.458 | 0.458 |
| T-NR 1000003, zeta-type | 0.05 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| T-NR 1000003, own | 0.05 | 0.945 | 0.995 | 0.9999 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| T-NR 3, own | 0 | 0.9897 | 0.9981 | 0.9979 | 0.9965 | 0.9933 | 0.9901 | 0.9861 | 0.9812 | 0.9757 | 0.9715 |
| T-NR 3, zeta-type | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| T-NR 3, own | 0.05 | 0.959 | 0.949 | 0.947 | 0.947 | 0.942 | 0.934 | 0.930 | 0.952 | 0.990 | 0.9995 |
| T-NR 3, own | 0.16 | 0.978 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| T-NR 3, zeta-type | 0.16 | 0.046 | 0.099 | 0.154 | 0.223 | 0.306 | 0.411 | 0.550 | 0.767 | 0.991 | 1 |
| DH, combination | 0 | 0.943 | 0.937 | 0.929 | 0.921 | 0.914 | 0.907 | 0.901 | 0.897 | 0.892 | 0.889 |
| DH, formal a(p) | 0 | 0.560 | 0.534 | 0.518 | 0.505 | 0.495 | 0.490 | 0.484 | 0.481 | 0.478 | 0.477 |
| DH, combination | 0.05 | 0.965 | 0.975 | 0.980 | 0.984 | 0.989 | 0.994 | 0.997 | 0.9990 | 0.9997 | 0.9999 |
| DH, formal a(p) | 0.05 | 0.628 | 0.643 | 0.670 | 0.706 | 0.747 | 0.788 | 0.826 | 0.863 | 0.896 | 0.922 |
| DH, combination | 0.16 | 0.988 | 0.9997 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| DH, formal a(p) | 0.16 | 0.760 | 0.823 | 0.887 | 0.946 | 0.987 | 0.9995 | 1 | 1 | 1 | 1 |
| sign twist | 0 | 0.436 | 0.493 | 0.576 | 0.657 | 0.691 | 0.709 | 0.720 | 0.737 | 0.750 | 0.773 |
| sign twist | 0.05 | 0.501 | 0.643 | 0.794 | 0.910 | 0.961 | 0.987 | 0.998 | 0.9998 | 0.9999 | 1 |
| sign twist | 0.16 | 0.661 | 0.913 | 0.9935 | 0.9999 | 1 | 1 | 1 | 1 | 1 | 1 |
| unimodular twist | 0.05 | 0.474 | 0.639 | 0.792 | 0.910 | 0.960 | 0.988 | 0.998 | 0.9996 | 1.0000 | 1 |
| heat (zeta at -0.1) | 0 | 0.890 | 0.721 | 0.489 | 0.250 | 0.097 | 0.030 | 0.007 | 0.001 | 0.0000 | 0 |
| heat (zeta at -0.05) | 0.05 | 0.962 | 0.916 | 0.816 | 0.656 | 0.470 | 0.300 | 0.173 | 0.088 | 0.041 | 0.017 |
| heat (zeta at 0.06) | 0.16 | 0.982 | 0.9999 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |

The same fraction on boxes farther than 5 from every box in which f has non-zero winding (y >= 0.03): DH combination at t = 0:
0.967, 0.974, 0.977, 0.979, 0.982, 0.982, 0.983, 0.987, 0.986, 0.986 (zeta, all boxes: 0.990 .. 0.971); DH combination at t = 0.05:
0.978 .. 0.99998; DH formal at t = 0: 0.66 .. 0.76; sign twist at t = 0: 0.54, 0.69, 0.85, 0.974, 0.992, 0.992, 0.994, 0.991, 0.989, 0.994;
T-NR q = 3 own at t = 0: 1 at every X where such boxes exist (2 to 63 boxes). In boxes that contain a zero of f: T-NR q = 3 with its own factor is certified
in 97 % to 99.6 % of them (the reference has the same zero); DH with the combination in 8 % to 17 %; zeta(s+0.1)zeta(s-0.1) in none.

Reading, control by control (onset compared with the height of the off-line zeros).
- **T-NR q = 1000003.** Off-line pairs at y = 0.0642, 1.10 per box, at every height. At t = 0 with its own factor its statistic is
  zeta's (1.2 (ii)). At t = 0.05 its pairs have landed (no winding at any X) and it passes with the zero-free zeta-type reference
  on every box at every X from 1e4, earlier than zeta (zeta: 0.9835 at 1e4, 1 from 1e6), because by 1.2 (i) it is zeta at the height
  y + 0.69. A function with off-line zeros in every box at t = 0 passes the test at t = 0.05 at all sizes.
- **T-NR q = 3.** Pairs at y = 0.8075. With its own factor (which vanishes at the pairs) it has zeta's fractions at t = 0 and is
  certified in the boxes that contain its zeros. With the zero-free zeta-type factor it fails in every box at t = 0, where the
  farthest box is 5.7 from a pair: the middle term 2.2 sqrt(3) 3^-s has modulus 3.81 x 3^(-0.59) = 1.99 on the lower edge. The
  failure is the size of a(3) and a(9). At t = 0.16 it is 1 at 1e13, with the same coefficients, because Re s* = 1.69.
- **Davenport-Heilbronn.** First off-line zero at gamma = 85.7; 0.031 .. 0.136 zeros per box with y >= 0.03 on the range. With the
  combination reference it is certified in 0.89 to 0.94 of all boxes and 0.967 to 0.986 of the far boxes at t = 0, where zeta has
  0.990 to 0.971: from 1e11 DH is certified more often than zeta. At t = 0.16 it is 1 from 1e6, where it has no zeros left (section 5).
  With the formal factors (1 - a(p) b_p p^-s*) it fails in 24 % to 34 % of the far boxes at t = 0 and passes from 1e10 at t = 0.16: the formal
  product is not the function (a(4) = -1, a(2)^2 = 0.081), a property of a(n), n <= 9 (the same reading as lane s3, row 3).
- **Sign twist, unimodular twist.** The formal two-ladder sum has no functional equation and has zeros of its own near the real
  axis (0.05 .. 0.33 per box at t = 0, section 5). On boxes away from them it is certified in 0.99 at t = 0 from 1e8 (zeta 0.97 .. 0.99), and
  on all boxes it is 1 at t = 0.05 at 1e13 and from 1e8 at t = 0.16. For the direct ladder alone the twist is a translation on the
  torus of prime phases (PROVED in lane s3); the difference from zeta at low X is the reflected ladder.
- **zeta(s+0.1) zeta(s-0.1).** Every box contains zeros (0.56 .. 2.18 per box); certified fraction 0.22 .. 0.0000. Resolved zeros.
- **Heat.** At t = 0 and 0.05 (zeta at -0.1 and -0.05) it fails increasingly with height; it has 0.04 .. 0.63 and 0.02 .. 0.75 zeros per
  box there (escape of the zeros under the backward flow, lane s3 test 1) and Re s* = 0.59 - 0.025 log(x/4 pi) falls below 1/2. At t = 0.16 (zeta at
  0.06) it passes from 1e6.

### 2.4 Low heights with the true functions and the table of off-line zeros

True values (96-bit Arb), t = 0, x in [200, 3992] (gamma up to 1996), 3,792 boxes, of which 2,893 are farther than 5 from twice the
ordinate of each of the 84 off-line DH zeros and 83 contain one; y0 = 0.1809, P = 1000:

| function, reference | all boxes | far boxes | boxes with an off-line zero abscissa |
|---|---|---|---|
| zeta, Euler | 1 (3792 of 3792) | 1 | - |
| zeta, B_0 | 0.388 | 0.331 | - |
| DH, combination | 0.958 | 0.963 (108 failures) | 0.506 |
| DH, formal a(p) | 0.593 | 0.676 | 0.024 |
| DH, B_0 | 0.463 | 0.535 | 0.012 |

At y0 = 0.03: zeta 0.893, DH combination 0.772 (far 0.766), DH formal 0.298. At t = 0.16 with the true H_t (server, x in [200, 1400], 1,200 boxes, 18 with an off-line abscissa, levels 0.03, 0.1809, 1.0): DH combination 0.975 of all
boxes and 0.984 of the 1,002 far boxes; DH formal 0.718 and 0.764; zeta at t = 0.16 at these heights was not run.

Here P = 1000 exceeds half the height in most of the range and zeta passes in every box; DH with the combination fails in 3.7 % of the
far boxes. In the 108 failing far boxes (median distance 25 from the nearest off-line abscissa) the residual sup abs(F - Q) on the
lower edge has median 0.33 (0.28 in the passing boxes) and min abs(Q) has median 0.11 (0.66 in the passing boxes): the reference, a
sum of two zero-free products, is small there. This is the one place in the lane where a control fails away from its own off-line
zeros while zeta passes on every box. It does not persist: at X >= 1e6, where P = 1000 is below N, zeta fails in 0.2 % to 2.9 % of
the boxes and DH in 1.4 % to 2.3 % of its far boxes (2.3); and the property used is that the DH reference is a two-term combination
(its Dirichlet coefficients), not a property of zeros.

**Class: CLOSED.** The object enters through its zeros at t = 0 near the line (the margin at y0 = 0.03 is limited by the on-line
zeros 0.03 below the edge) and through its coefficients at t > 0. Zeta fails the premise at t = 0 at every height; at t > 0 the test
is passed by T-NR q = 1000003 at all sizes, by DH and by the twists from the heights where Re s* reaches 1. The controls that fail at
t > 0 fail by resolved zeros (T-NR q = 3 at t = 0.05, heat) or by the non-multiplicativity of a(n) with a formal reference.

## 3. Combination 2: chart cover with local Euler references

**Finite consequence tested.** t = 0. On each chart {Re s = 1/2 + d, Im s in [T, T + 1]} (33 points): residual sup abs(F - Q) and
floor inf abs(Q), Q = 1/E_P(s) (the gamma factor is common to F and Q and is divided out; with the "c" and "o" references for DH
and T-NR). Certified = residual < floor. Also the weaker pointwise form abs(F/Q - 1) < 1 at every chart point. Survival would need:
zeta 1 at d and heights reached; a control below zeta on charts with no zero of its own nearby.

Disk certificate at 14.1347: reproduced (1.4).

Zeta, fraction of certified charts (131,070 charts per X; 4,032 at 1e4, 32,704 at 1e5):

| d, P | 1e4 | 1e5 | 1e6 | 1e7 | 1e8 | 1e9 | 1e10 | 1e11 | 1e12 | 1e13 |
|---|---|---|---|---|---|---|---|---|---|---|
| 0.25, B_0 | 0.510 | 0.503 | 0.504 | 0.504 | 0.504 | 0.505 | 0.504 | 0.504 | 0.505 | 0.505 |
| 0.25, 2 | 0.521 | 0.518 | 0.520 | 0.520 | 0.520 | 0.522 | 0.522 | 0.522 | 0.521 | 0.523 |
| 0.25, 13 | 0.863 | 0.841 | 0.833 | 0.832 | 0.831 | 0.831 | 0.830 | 0.830 | 0.831 | 0.831 |
| 0.25, 97 | 0.989 | 0.976 | 0.965 | 0.959 | 0.955 | 0.954 | 0.955 | 0.954 | 0.954 | 0.955 |
| 0.25, 1000 | 1 | 0.9995 | 0.9990 | 0.9981 | 0.9974 | 0.9970 | 0.9966 | 0.9965 | 0.9960 | 0.9960 |
| 0.1, 1000 | 0.751 | 0.687 | 0.585 | 0.501 | 0.445 | 0.414 | 0.396 | 0.389 | 0.386 | 0.388 |
| 0.1, 97 | 0.549 | 0.392 | 0.305 | 0.274 | 0.265 | 0.260 | 0.257 | 0.255 | 0.254 | 0.254 |
| 0.02, 1000 | 0.113 | 0.072 | 0.018 | 0.0037 | 0.0013 | 0.0008 | 0.0005 | 0.0003 | 0.0002 | 0.0002 |

Median residual and floor at P = 1000, X = 1e13: d = 0.25: 0.114 against 0.643 (source toy values: 0.22 against 0.71);
d = 0.1: 0.658 against 0.508; d = 0.02: 2.42 against 0.409. The 99th percentile of the residual at d = 0.25 is 0.70, above the
median floor.

Pointwise form abs(F/Q - 1) < 1 at every point of the chart (the Rouche inequality itself, without separating sup and inf). At d = 0.25
it holds on **every chart at every X from 1e4 to 1e13** for zeta with P = 97 and P = 1000 (4.2e6 points per X), and for L(chi_-4),
L(chi mod 5); with P = 13 on 0.9985 .. 0.9871. At d = 0.1, P = 1000: 0.9913, 0.9985, 0.9991, 0.9981, 0.9966, 0.9944, 0.9918, 0.9887, 0.9853,
0.9808 (false, decreasing). The controls in the pointwise form at d = 0.25, P = 1000: T-NR q = 1000003 with its own factor and with
the zeta-type factor: every chart at every X; T-NR q = 3 with its own factor: every chart at every X (its zeros are at Re s = 0.904, to
the right of the chart line); zeta(s+0.1)zeta(s-0.1): 0.998 .. 1; DH combination 0.989 .. 0.991, DH formal 0.75 .. 0.77; twists
0.84 (1e4), 0.95 (1e6), 0.9992 (1e10), 1 (1e13). So the one form in which zeta passes at every size reached is passed identically by both
T-NR functions. On Re s = 3/4 the statistic zeta E_P - 1 = sum over n > 1 without prime factor <= P of n^-s has root mean square
0.21 (P = 97) and 0.10 (P = 1000); values of modulus 1 are five and ten standard deviations out and are not reached in 4e7 points, while
the Omega-results for zeta at fixed sigma < 1 (CLASSICAL) make abs(zeta E_P) unbounded on the line, so the inequality fails at
heights not reached.

Controls at d = 0.25, P = 1000 (all charts / charts farther than 5 boxes from a box with non-zero winding):

| control, reference | 1e4 | 1e6 | 1e8 | 1e10 | 1e13 | far charts at 1e6, 1e10, 1e13 |
|---|---|---|---|---|---|---|
| L(chi_-4) | 0.9998 | 0.9995 | 0.9989 | 0.9984 | 0.9980 | same |
| L(chi mod 5) | 1 | 0.9994 | 0.9985 | 0.9981 | 0.9976 | same |
| T-NR 1000003, own | 0.9993 | 0.9989 | 0.9970 | 0.9962 | 0.9957 | none exist |
| T-NR 1000003, zeta-type | 0.9948 | 0.9939 | 0.9896 | 0.9887 | 0.9888 | none exist |
| T-NR 3, own | 0.856 | 0.873 | 0.865 | 0.870 | 0.869 | 0.80, -, - |
| T-NR 3, zeta-type | 0 | 0 | 0 | 0 | 0 | 0 |
| DH, combination | 0.977 | 0.973 | 0.971 | 0.971 | 0.970 | 0.9954, 0.9996, 0.9998 |
| DH, formal a(p) | 0.615 | 0.614 | 0.618 | 0.614 | 0.616 | 0.74, 0.88, 0.91 |
| sign twist | 0.600 | 0.839 | 0.960 | 0.989 | 0.995 | 0.968, 1, 1 |
| unimodular twist | 0.568 | 0.838 | 0.960 | 0.989 | 0.996 | similar |
| zeta(s+0.1)zeta(s-0.1) | 0.600 | 0.520 | 0.464 | 0.458 | 0.467 | none exist |

Reading.
1. Zeta is not certified on every chart at any d <= 0.25 above 1e4, and the fraction decreases slowly with height at a fixed cut-off.
   At d = 0.02 and 0.1 the chart is 0.02 and 0.1 from the on-line zeros and the reference (zero-free) cannot be within abs(Q) of F
   near them: the statistic reads the on-line zeros. At d = 0.25 it reads the tail of the Euler product: the fraction rises with
   P as 0.50, 0.52, 0.83, 0.955, 0.996.
2. T-NR q = 1000003 with its own factor equals zeta (0.9957 against 0.9960 at 1e13) although it has an off-line zero at
   Re s = 0.532 in every chart column; with the zeta-type reference it loses 0.007.
3. DH with the combination reference: 0.970 overall and 0.9998 on the charts away from its zero boxes, above zeta's 0.9960. The
   deficit is located at its own off-line zeros: the fail criterion of the task (below zeta where it has no zero in the chart) is
   not met.
4. The twists reach zeta's value from below as the reflected ladder decays; away from the zeros of the formal sum they are at 1.

**Class: CLOSED.** The object enters through its zeros (d <= 0.1) and through the truncation of the Euler product (d = 0.25). The
premise fails for zeta; no control drops below zeta away from its own zeros.

## 4. Combination 3: side condition B != 0 and the slice bound

**Source.** Rows of imp-95046 / imp-95047: (t*, y*) = (10103/80000, 33/200) = (0.1262875, 0.165), slice x >= X + 1,
y* <= v <= sqrt(1 - 2 t*) = 0.8645; the 0.14 row has Re s_B = (1 + 0.1809)/2 = 0.59045. In the section 4.7 chain the winding of
H_t0/B_t0 is 0 and B_t0 != 0 is a side condition.

**Finite consequence tested.** Per box and per y* (levels y* .. 0.8645): (a) sup abs(f - 1) < 1 with f = H_t*/B_0, B_0 the n = 1 term;
(b) B != 0 and sup abs(A/B) < 1 with B the full direct ladder; winding numbers of B and of f. Statistic: the smallest X from which
the bound holds on every box. 2.1e6 points per level per X; with 11 levels in the slice for y* = 0.165 this is 2.3e7 points per X
(the task asked 1e7 per decade), placed in [X, X + 131072], not spread over the decade.

(a) Reference B_0, fraction of boxes on which the bound holds, y* = 0.165:

| function | 1e4 | 1e6 | 1e8 | 1e10 | 1e12 | 1e13 | largest sup at 1e13 |
|---|---|---|---|---|---|---|---|
| zeta | 0.444 | 0.534 | 0.657 | 0.775 | 0.871 | 0.911 | 2.41 |
| L(chi_-4) | 0.561 | 0.702 | 0.859 | 0.970 | 0.9997 | 1 | 0.93 |
| L(chi mod 5) | 0.488 | 0.593 | 0.716 | 0.824 | 0.907 | 0.942 | 1.80 |
| DH | 0.592 | 0.759 | 0.910 | 0.989 | 1 | 1 | 0.80 |
| T-NR 3 | 0.013 | 0.084 | 0.178 | 0.289 | 0.424 | 0.499 | 4.98 |
| T-NR 1000003 | 0.992 | 1 | 1 | 1 | 1 | 1 | 0.45 |
| sign twist | 0.389 | 0.506 | 0.653 | 0.776 | 0.871 | 0.911 | 2.47 |
| unimodular twist | 0.361 | 0.506 | 0.653 | 0.775 | 0.871 | 0.911 | 2.23 |
| heat (zeta at 0.0263) | 0.365 | 0.377 | 0.411 | 0.457 | 0.508 | 0.532 | 28.5 |

(b) Reference B, fraction of boxes with B != 0 on the grid and abs(A/B) < 1 on the slice:

| function | y* | 1e4 | 1e5 | 1e6 | 1e7 | 1e8 | 1e9 | 1e10 .. 1e13 |
|---|---|---|---|---|---|---|---|---|
| zeta | 0.165 | 0.932 | 0.967 | 0.9924 | 0.99969 | 1 | 1 | 1 |
| zeta | 0.03 | 0.924 | 0.957 | 0.9859 | 0.99873 | 0.99998 | 1 | 1 |
| L(chi_-4) | 0.165 | 0.981 | 0.9964 | 0.99989 | 1 | 1 | 1 | 1 |
| DH | 0.165 | 0.970 | 0.987 | 0.9971 | 0.99989 | 1 | 1 | 1 |
| DH | 0.03 | 0.964 | 0.981 | 0.9939 | 0.99931 | 1 | 1 | 1 |
| sign twist | 0.165 | 0.937 | 0.971 | 0.9944 | 0.99960 | 1 | 1 | 1 |
| unimodular twist | 0.165 | 0.933 | 0.970 | 0.9941 | 0.99961 | 0.99999 | 1 | 1 |
| heat (zeta at 0.0263) | 0.165 | 0.865 | 0.850 | 0.847 | 0.858 | 0.884 | 0.915 | 0.949, 0.975, 0.991, 0.997 |

Zeros of B per box in [0.165, 0.8645]: zeta 0.020, 0.0064, 0.0006 at 1e4, 1e5, 1e6 and none from 1e7; DH 0.0094, 0.0031, 0.0003, none
from 1e7; twists as zeta; heat 0.053 .. 0.00014 (still present at 1e13). Boxes on which (b) holds and f has a zero: none for any
function at any X. Boxes on which (b) holds and B has a zero: none. At t = 0.16 the pattern is the same one decade earlier.

Reading.
1. (a) is a size condition: sup abs(f - 1) is governed by sum_{n >= 2} abs(a(n)) b_n n^(-Re s*). DH (mean abs(a) = 0.51) satisfies
   it on every box from 1e12, chi_-4 at 1e13, zeta (abs(a) = 1) not at 1e13, T-NR q = 3 (abs(a) up to 7.8) on half the boxes.
   The order is the order of the coefficient sizes; the positive comparisons and DH are on the same side and zeta is behind them.
2. (b) holds on every box from 1e8 for zeta (y* = 0.165), 1e7 for L(chi), 1e8 for DH and the sign twist, 1e9 for the unimodular
   twist, and not by 1e13 for the heat control. Re s* = 0.5825 + 0.0316 log(q x/4 pi) equals 1 at x = 6.9e6 (q = 1) and 1.4e6
   (q = 5): the threshold is the height at which the direct ladder is to the right of 1, for every function alike. In y*:
   one decade later at y* = 0.03 than at y* = 0.165.
3. Below the threshold (b) fails for zeta in 0.03 % to 7 % of the boxes although H_t* has no zero there; in part because B itself
   has zeros in the slice (0.02 per box at 1e4). The side condition is a real condition at X <= 1e6.
4. DH at 1e7 has non-real zeros of H_t* in 2 or 3 boxes of 131,071 (section 5) and fails (b) in about 14 boxes; none of the boxes on which (b)
   holds contains a zero. The test is sound for the non-Euler data, as Rouche's theorem requires (1.2 (iii)), and it fails for DH
   mostly for a reason other than a zero in the slice, exactly as it does for zeta.

**Class: CLOSED.** The object enters through the moduli of its coefficients (a) and through the direct ladder to the right of 1
(b). No control is certified where it has zeros; no control is separated from zeta.

## 5. Combination 4: the threshold x0(t)

**Source.** Route 20: for t in [t_lo, 1/2], zeros of H_t with Re z >= x0(t_lo) + 0.47 are real and simple, x0 = 4.065e13 (t >= 0.20),
1.502e17 (0.15), 1.461e24 (0.10), x0 about 4 pi exp(c/t) with c = 5.3 to 5.8, conditional on Polymath15 Theorem 1.3.

**Finite consequence tested.** x0_F(t) = largest x at which H_t^F has a non-real zero, bracketed by the largest X whose strip has a
box with non-zero winding of f on [x, x+1] x [0.03, 1] and the next X without one. Survival would need a control whose x0_F(t) is
not explained by the landing of its own pairs.

Zeros of f per box, y in [0.03, 1] (`tables.md`):

| function | t | 1e4 | 1e5 | 1e6 | 1e7 | 1e8 | 1e9 | 1e10 | 1e11 | 1e12 | 1e13 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| zeta | 0 | 0.0039 | 0.0022 | 0.0016 | 0.0009 | 0.0004 | 0.0001 | 0.00002 | 0 | 0 | 0 |
| zeta | 0.05 .. 0.5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| DH | 0 | 0.031 | 0.044 | 0.055 | 0.067 | 0.078 | 0.090 | 0.102 | 0.114 | 0.127 | 0.136 |
| DH | 0.05 | 0.0177 | 0.0174 | 0.0164 | 0.0135 | 0.0107 | 0.0081 | 0.0051 | 0.0028 | 0.0015 | 0.0006 |
| DH | 0.10 | 0.0070 | 0.0042 | 0.0020 | | 0.00003 | | 0 | | | 0 |
| DH | 0.1263 | 0.0033 | 0.0011 | 0.0002 | 0.00002 | 0 | 0 | 0 | 0 | 0 | 0 |
| DH | 0.16 | 0.0011 | 0.00009 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| DH | 0.20, 0.30, 0.50 | 0 | 0 | 0 | | 0 | | 0 | | | 0 |
| T-NR 3 | 0 | 0.0913 | 0.0896 | 0.0890 | 0.0883 | 0.0877 | 0.0876 | 0.0874 | 0.0874 | 0.0874 | 0.0874 |
| T-NR 3 | 0.05 | 0.0874 | 0.0874 | 0.0874 | 0.0874 | 0.0874 | 0.0874 | 0.0873 | 0.0853 | 0.0748 | 0.0453 |
| T-NR 3 | 0.10 | 0.0807 | 0.0698 | 0.0453 | | 0.0011 | | 0 | | | 0 |
| T-NR 3 | 0.1263 | 0.0576 | 0.0255 | 0.0036 | 0.00003 | 0 | 0 | 0 | 0 | 0 | 0 |
| T-NR 3 | 0.16 | 0.0162 | 0.0005 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| T-NR 3 | 0.20, 0.30, 0.50 | 0 | 0 | 0 | | 0 | | 0 | | | 0 |
| T-NR 1000003 | 0 | 1.103 | 1.102 | 1.101 | 1.100 | 1.100 | 1.100 | 1.099 | 1.099 | 1.099 | 1.099 |
| T-NR 1000003 | 0.05, 0.1263, 0.16 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| zeta(s+0.1)zeta(s-0.1) | 0 | 0.557 | 0.737 | 0.908 | 1.082 | 1.265 | 1.448 | 1.631 | 1.814 | 1.997 | 2.181 |
| heat (zeta at t - 0.1) | 0 | 0.043 | 0.109 | 0.191 | 0.288 | 0.385 | 0.479 | 0.563 | 0.620 | 0.641 | 0.635 |
| heat | 0.05 | 0.018 | 0.051 | 0.101 | 0.176 | 0.266 | 0.363 | 0.460 | 0.558 | 0.654 | 0.747 |
| heat | 0.1263, 0.16, 0.2 .. 0.6 | 0 (0.0002 at 1e4, t = 0.1263) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| sign twist (formal) | 0 | 0.048 | 0.086 | 0.113 | 0.144 | 0.174 | 0.204 | 0.238 | 0.270 | 0.304 | 0.333 |
| sign twist (formal) | 0.16 | 0.0090 | 0.0040 | 0.0004 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

(Blank: not run. Winding counts that used a phase step above 2.6: at most 0.8 % of the boxes for every row except T-NR q = 1000003
at t = 0 (3.9 %; the zeros sit 0.034 above the lower edge), the heat rows at t = 0 and 0.05 (3.1 %, 2.4 %) and the twists at t = 0 (1.5 %).
The brackets below come from strips of length 1.3e5 at each X, not from the whole decade.)

Brackets for x0_F(t) and c = t log(x0/4 pi):

| t | DH | T-NR q = 3 | c (both) | explicit threshold for zeta (source) |
|---|---|---|---|---|
| 0.05 | above 1e13 | above 1e13 | above 1.37 | |
| 0.10 | (1e8, 1e10) | (1e8, 1e10) | 1.59 .. 2.05 | 1.461e24 (c = 5.3) |
| 0.1263 | (1e7, 1e8) | (1e7, 1e8) | 1.72 .. 2.01 | |
| 0.16 | (1e5, 1e6) | (1e5, 1e6) | 1.44 .. 1.81 | 1.502e17 at 0.15 (c = 5.6) |
| 0.20 | (480, 1e4) (lane s3: a pair at x = 480 lands at 0.2306) | (5.7, 1e4) (lane s3: lowest pair lands at 0.3135) | below 1.34 | 4.065e13 (c = 5.8) |
| 0.30, 0.50 | below 1e4 | below 1e4 | | |

Reading.
1. x0_F(t) is, by definition, the position of the last pair of F that has not landed. Three controls with off-line zeros at
   t = 0 have x0_F(t) = 0 on the whole range t in [0.10, 0.50], as zeta does: zeta(s+0.1)zeta(s-0.1) (every pair has y = 0.2 and lands
   by t = y^2/2 = 0.02: PROVED bound (y^2)' <= -2, lane s3), T-NR q = 1000003 (y = 0.0642, landed by 0.0021; measured: none at
   t = 0.05), heat (zeta at t - 0.1 >= 0). The test cannot separate them from zeta at any size.
2. DH (conductor 5, no Euler product, pairs with y up to 0.74 in the table) and T-NR q = 3 (zeta times one modified factor, all
   pairs at y = 0.8075) have the same brackets at every t. The landing time of a pair of height y0 at abscissa x is about
   c/log(x/4 pi) with c between 1.4 and 2.05, of the size 2 y0 (lane s3 measured t* (y0^2/2)^-1 falling from 0.96 to 0.25 .. 0.43 between
   x = 5.7 and 1e5 for T-NR; heuristically the real zeros, of density (1/4 pi) log(x/4 pi), pull the pair down at a speed proportional to that density). The law
   depends on y0 and on the density of real zeros, that is on the gamma factor; primes do not enter.
3. For zeta the measured value is 0 at every t >= 0.05 and the explicit thresholds are 4e13 to 1.5e24: the distance between them
   is verified height (no pair exists up to 3e12) on one side and the cost of the coefficient-side certificate on the other
   (c = 5.3 .. 5.8 against 1.4 .. 2.05 for functions that do have pairs of height 0.8).

**Class: CLOSED.** The object enters through its off-line zeros and the gamma factor. No x0_F(t) is set by anything other than
the landing of the control's own pairs.

Not done as specified in the task: the direct evaluation "with (pi/(8 ln 10)) x digits, x to 2e4" was not repeated (lane s3
tracked 101 pairs of the controls by Newton in Arb for x up to 1e5; its landing times are used above for x < 1e4); "non-simple
events" of zeta were not searched (the statistic used is the winding number in y >= 0.03).

## 6. Not run, limits

- The object is the two-ladder approximant. Its distance from the true H_t/B_0 at t = 0 is 0.048 at 1e6, 0.015 at 1e8, 0.002 at
  1e10, 0.0007 at 1e13 (1.4), and it has spurious zeros with y >= 0.03 at t = 0 below 1e11 (0.4 % of the boxes at 1e4). For DH,
  L(chi), T-NR at t > 0 and the heat control the approximant was validated against the true function at x = 1e6 only (and DH at
  low heights with the true function, 2.4).
- "margin > 0" is a statement on a grid (17 points x up to 16 levels per box), not an enclosure; values within 0.02 of 0 at X = 1e6
  can change sign against the true function (3 of 120 rechecked box-levels at t = 0, 2 of 90 at t = 0.16; none at X >= 1e8).
- Controls: 131,071 boxes per X (the first of the two chunks) instead of 262,142; the groups for tests 3 and 4 likewise. The times
  t = 0.10, 0.20, 0.30, 0.50 only at X = 1e4, 1e5, 1e6, 1e8, 1e10, 1e13. zeta(s+a)zeta(s-a) only at t = 0 (degree 2: no ladder of
  length sqrt x at t > 0).
- Twisted reference with both ladders (a reference that itself has the on-line zeros) was not tested; all references of zeta
  are zero-free.
- Sign and unimodular twists are formal two-ladder sums (they have no functional equation); the Dirichlet series of the twist
  itself, which for a random completely multiplicative twist converges and has an Euler product for Re s > 1/2, was not evaluated.
- T-NR q = 1000003 with its own factor at t = 0.16 shows 0.978 .. 1 below 1e11: one of the three pieces of that reference is an
  Euler product at the height y - 2.21, where its factors exceed 1 in modulus; the zeta-type reference does not have this defect.
- GPU: not used. A float64 GPU test of the same code ran 60 times slower than the CPU on the shared card and was stopped.

## 7. Where things ran

The assignment asked for the compute server. At launch time the wrapper refused every unit ("only 39 GB available on the
machine"; load average 105 to 128 on 48 cores, sibling lanes). The work was therefore split: (a) Mac, each piece a single process under
`scripts/memcap.sh 8`, at most 8 pieces at a time, each under 20 minutes, peak resident memory 1.4 GB per process: X = 1e4 and 1e5
(all groups) and, for X = 1e6 .. 1e13, the groups of tests 1 and 2 (zeta, L(chi), all controls at t in {0, 0.05, 0.16}, heat times);
(b) server through `rhrun`, once it accepted units: the groups of tests 3 and 4 for all X (units rh-s6hw-qA, rh-s6hw-qB: 2 cores
and 4 GB each), the rechecks in ball arithmetic and the low-height run at t = 0.16 (rh-s6hw-rc, rh-s6hw-rc2, rh-s6hw-rc3: quotas 3, 7 and 4 cores,
7, 8 and 5 GB), the summary (rh-s6hw-sum). At most 8 processes of this lane ran on the server at any time (for ten minutes the
quotas of rh-s6hw-rc2 and rh-s6hw-rc3 added up to 11 cores, with 7 processes running); measured memory of
the units 1.2 to 2.6 GB each. Two test units (rh-s6hw-tg, GPU; rh-s6hw-tc) at the start; rh-s6hw-tg, the first rh-s6hw-q,
rh-s6hw-rc, rh-s6hw-rc2 and rh-s6hw-rc3 (slow Hurwitz and height-1e13 jobs) were stopped by this lane with `systemctl --user stop`. One local helper shell of this lane was
stopped by process id. No unit of this lane is left running (checked at the end). The server's
per-box arrays (2.6 GB) and the Mac's (11 GB) were deleted after the summaries were written.

## 8. Three weakest steps

1. Everything at X >= 1e6 is measured on the approximant in float64 on a grid; the rechecks in ball arithmetic cover 969
   box-levels, not the population. The classification does not depend on any value within the recheck error of a threshold, but the
   "1" entries are "every sampled box", not certificates.
2. "Far from the off-line zeros" at X >= 1e6 uses the zeros found by the winding numbers of the approximant in y >= 0.03; zeros
   with 0 < y < 0.03 are not seen and are treated as absent. The independent table of DH zeros is used only below x = 4000.
3. The landing law of section 5 (c between 1.4 and 2.05 for DH and T-NR) rests on decade brackets in X and seven values of t, and for
   DH on the assumption that its highest pairs at each height have y near 0.8; it is a by-product, not a fitted law.

## Files

`rlib.py` (engine), `run.py` (rows to per-box statistics), `summarize.py`, `mk_tables.py`, `tables.md` (all tables), `sum_Xlow.json`,
`sum_Xlocal.json`, `sum_Xserver.json` (summaries), `validate.py`, `validate_1e+06.json`, `recheck.py`, `recheck/` (json per case),
`recheck_collect.py`, `lowdh.py`, `lowdh_an.py`, `lowdh_summary.json`, `out_lowdh/` (true values at low height), `t2_disk.py`, `t2_disk.json`, `jobs*.txt`, `runjob.sh`, `run_server.sh`,
`run_recheck*.sh`, `logs/`. The per-box arrays (11 GB on the Mac, 2.6 GB on the server) are not kept; `run.py` regenerates them.
