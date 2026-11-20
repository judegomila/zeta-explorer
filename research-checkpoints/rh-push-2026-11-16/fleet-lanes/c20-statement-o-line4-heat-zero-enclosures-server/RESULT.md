# c20-statement-o-line4-heat-zero-enclosures-server: certified zero enclosures for controls (Statement O lines 4, 12, 14, 15)

Date 2026-11-20. Kind: compute (certified conversions). Round 20. This lane makes no statement about zeros of zeta and
gives no requirement score. Every object below is a control (a function for which the target conclusion is false) or a
finite stage. Labels: PROVED (argument written here, one derivation, unrefereed), CLASSICAL (standard result, cited from
memory unless a proof is written), CERTIFIED (ball arithmetic, the proof obligations listed), MEASURED.

## 0. Verdict

| item | line of Statement O | registered outcome |
|---|---|---|
| A (required) | 4 (HEAT) | **enclosed.** Six off-axis zeros of H_{-tau}, tau = 1, 0.25 (two zeros), 0.2, 0.15, 0.1: winding number exactly 1 on a square of half-width 0.05 and on a square of half-width 1e-6; three runs each (128 bits; 256 bits; 256 bits with another integration line and strip width). zeta's own H_0 on the same squares: winding number 0. |
| B (optional) | 14 (SG) | **enclosed.** Real zero at 1/2 + b for b = 0.3 and b = 0.4: winding 1 on squares of half-width 0.05 and 1e-10, at 128 and 256 bits; zeta: 0. |
| C (optional) | 15 (NR-q) | **enclosed.** Zero at 0.857311316383781 + 3.564427956382738 i (c = 2.1) and at 0.753177034801772 + 3.564427956382738 i (c = 2.05): winding 1 on squares of half-width 0.05 and 1e-10, at 128 and 256 bits; zeta: 0. |
| D (optional) | 12 (U, stage pole counts) | **enclosed** on the box 0 < Re z < 4, 10 < Im z < 30: exact pole counts of the renormalised stage symbol S~, zeta phases P = 13, 19, 29, 37, 47: 32, 51, 71, 94, 130; control U_s0, P = 13, 19, 29, 37: 34, 52, 73, 96 (128 bits; 256-bit rerun for P <= 29 and for zeta phases at P = 37). Newton counts on file (labelled lower bounds there): 27, 46, 62, 83, 118 and 29, 47, 67, 88. Not run: U_s0 at P = 47; Re z >= 4. |

What a "certified" row means here: a finite computation in Arb ball arithmetic whose output implies the stated integer,
given (i) the lemmas of section 2 (written out; one derivation, by this lane), (ii) the correctness of Arb / python-flint
0.9.0 for the functions used (zeta, lgamma, digamma, polygamma, exp, erfc, arg, zeta_zero), (iii) this lane's code. It is
one derivation: the label of the located zeros can move from MEASURED to "certified, one derivation"; it is not a second
referee of the escape law F1 (Theorem A of `push/b-escape-law`), which this lane did not re-derive.

## 1. Plan

- Sources read: `push/BRIEF.md` (to the end), `campaign/CHECKPOINT_R20_INPUT.md` section 1 (lines 4, 12, 14, 15),
  `push/OBSTRUCTION_MAP.md` section 2 (rows HEAT, SG, NR-q), `push/b-escape-law/RESULT.md` and its `zeros.py`, `esc.py`,
  `zeros_tau*.json`, `push/c15-control-with-zeta-fe-classes-u1-u2/RESULT.md` (SG, NR-q), `push/c1-leeyang-krein-limit/`
  (`RESULT.md`, `stage_test.py`, Test 3).
- Decisive first test: item A at tau = 1 (zero recorded at x = 5001.6468, eta = 1.6351). First attempt
  (Arb's adaptive `acb.integral` on the kernel integral, crude tail bound xi((1+abs y0)/2)/8) did not finish a single
  evaluation in several minutes and its tail bound would have needed abs(t - x) > 600 at x = 1e6. Replaced by the
  trapezoid rule with a proved error bound (Lemma Q) and an envelope with the true exponential decay (Lemma T): one
  run takes seconds.
- Server use: all runs through `rhrun` (python-flint is not installed on the Mac). Units and logs: section 9. Largest
  allocation in any run: 3523 complex balls (item A), 3 lists of 32768 balls per worker (item D, P = 47). Planned
  precision and allocation are printed at the start of each run (`PLAN:` lines in the logs).

## 2. Item A: the function, the lemmas, the certificate

### 2.1 The function

As in `push/b-escape-law` section 1: H_t(z) = int_0^inf e^{t u^2} Phi(u) cos(zu) du, H_0(z) = xi(1/2 + iz/2)/8,
F := H_{-tau} with tau > 0, and (1.1) there:

    F(z) = int_R H_0(z - u) G_tau(u) du,    G_tau(u) = (4 pi tau)^(-1/2) exp(-u^2/(4 tau)).                 (A0)

In the variable z the critical line of zeta is the real axis; Im z = -eta corresponds to Re s = (1 + eta)/2 under
s = (1 + iz)/2. The map row HEAT writes the same family as "kernel e^{tau u^2/16} kappa, tau < 0"; this lane certifies
zeros of the function (A0) and did not recheck the change of variables between the two parametrisations.
Notation: J_0(w) = (1/16) s (s-1) pi^(-s/2) Gamma(s/2) at s = (1 + iw)/2, so H_0(w) = J_0(w) zeta(s).

### 2.2 Lemmas (tail bound and quadrature error; paper work)

**P1 (CLASSICAL).** For real x, y: abs H_0(x + iy) <= H_0(iy) = xi((1 + abs y)/2)/8.
Proof. H_0(z) = int_0^inf Phi(u) cos(zu) du with Phi > 0 (Polya), and abs cos((x+iy)u)^2 = cos^2(xu) + sinh^2(yu)
<= cosh^2(yu). H_0(iy) = xi((1 - y)/2)/8 = xi((1 + y)/2)/8 by the functional equation. ∎

**P2 (CLASSICAL, proof written).** For 0 < a <= 1 and real b: abs Gamma(a + ib)^2 <= Gamma(a)^2 (pi b)/sinh(pi b).
Proof. abs(Gamma(a+ib)/Gamma(a))^2 = prod_{k>=0} (1 + b^2/(a+k)^2)^(-1) (Weierstrass product). Since a + k <= k + 1,
each factor is at most (1 + b^2/(k+1)^2)^(-1), and prod_{k>=1} (1 + b^2/k^2)^(-1) = (pi b)/sinh(pi b). ∎

**Lemma T (envelope; PROVED).** Let y < -1 with sigma := (1 - y)/2 in (1, 2]. For all real t,

    abs H_0(t + iy) <= M_sigma(abs t) := zeta(sigma) (1/16) (sigma + abs(t)/2)^2 pi^(-sigma/2) Gamma(sigma/2) sqrt( (pi abs(t)/4) / sinh(pi abs(t)/4) ),

M_sigma(t) is decreasing in t for t >= 7, and abs H_0(t + iy) <= B_sigma := xi(sigma)/8 for all real t.
Proof. s = (1 + i(t + iy))/2 = sigma + it/2, so abs zeta(s) <= zeta(sigma) (sigma > 1), abs s and abs(s-1) are at most
sigma + abs(t)/2, abs pi^(-s/2) = pi^(-sigma/2), and P2 with a = sigma/2 in (1/2, 1], b = t/4 bounds the Gamma factor.
Monotonicity: d/dt log M_sigma = 1/(sigma + t/2) + 1/(2t) - (pi/8) coth(pi t/4) <= 2/t + 1/(2t) - pi/8 < 0 for
t > 20/pi = 6.37. The last bound is P1. ∎
Uniform version used by the code: for 1 < smin <= sigma <= smax <= 2, M_sigma(t) <= zeta(smin) (1/16) (smax + t/2)^2
pi^(-smin/2) Gamma(smin/2) sqrt(...), because zeta is decreasing on (1, inf) and Gamma is decreasing on (0, 1.46);
likewise B_sigma <= (1/16) smax (smax - 1) pi^(-smin/2) Gamma(smin/2) zeta(smin).

**Lemma S (shift of the line; PROVED).** For every real y0 and complex z:
F(z) = int_R H_0(t + i y0) G_tau(z - t - i y0) dt.
Proof. (A0) is the integral of the entire function w -> H_0(w) G_tau(z - w) over the line Im w = Im z. On the closed
strip between Im w = Im z and Im w = y0, abs H_0 is bounded (P1) and
abs G_tau(z - w) = (4 pi tau)^(-1/2) exp(-((Re(z-w))^2 - (Im(z-w))^2)/(4 tau)) tends to 0 uniformly as abs Re w -> inf.
Cauchy's theorem on rectangles gives the claim. ∎

**Lemma Q (trapezoid rule; CLASSICAL, proof sketch written).** Let f be analytic in abs Im t < a, with f -> 0
uniformly in the strip as abs Re t -> inf, and int_R abs f(t + ic) dt <= M for all abs c < a. Then for every h > 0 and
every real offset t_0:  abs( h sum_{j in Z} f(t_0 + jh) - int_R f ) <= 2M/(e^{2 pi a/h} - 1).
(Trefethen and Weideman, SIAM Review 56 (2014), Theorem 5.1; recalled, not opened.) Sketch: by Poisson summation the
difference is sum_{m != 0} e^{2 pi i m t_0/h} fhat(2 pi m/h) with fhat(omega) = int f(t) e^{-i omega t} dt; shifting
the line to Im t = -+a' (a' < a) gives abs fhat(omega) <= M e^{-a' abs omega}; sum the geometric series, let a' -> a.

**Application (PROVED given the above).** Fix y0 < -1, sigma0 = (1 - y0)/2, a > 0 with 1 < sigma0 - a/2 and
sigma0 + a/2 <= 2, a centre XC > 8 (an integer here), and a set of z with abs(Re z - XC) <= dmax,
abs(Im z - y0) <= bmax. Put f_z(t) = H_0(t + i y0) G_tau(z - t - i y0), entire in t. For abs c <= a the line
Im w = y0 + c has sigma in [sigma0 - a/2, sigma0 + a/2], so by Lemma T

    int_R abs f_z(t + ic) dt <= e^{(bmax + a)^2/(4 tau)} int_R Mbar(abs t) g(t - Re z) dt,   g(v) = (4 pi tau)^(-1/2) e^{-v^2/(4 tau)},

with Mbar the uniform envelope. The right side is bounded by cutting R into: unit layers [XC + j, XC + j + 1],
-K <= j < K (K = ceil(dmax) + 1; Gaussian mass <= 1 each, Mbar <= Mbar(XC + j) by monotonicity); t >= XC + K
(Mbar <= Mbar(XC + K), mass <= erfc((K - dmax)/(2 sqrt tau))/2); unit layers [XC - K - j - 1, XC - K - j], 0 <= j < JL
(Mbar <= Mbar(left end), mass <= erfc((K + j - dmax)/(2 sqrt tau))/2); 8 <= t <= XC - K - JL (Mbar <= Mbar(8), mass
<= erfc((K + JL - dmax)/(2 sqrt tau))/2); t <= 8, negative t included (abs H_0 <= Bbar, mass <=
erfc((XC - 8 - dmax)/(2 sqrt tau))/2). This sum is M_a, and eps_trap := 2 M_a/(e^{2 pi a/h} - 1) (Lemma Q).
Dropped nodes abs(t_j - XC) > U = nh: the same layer sum with sigma = sigma0, starting at U, with dmax replaced by
dmax + h (for a decreasing g, h sum over nodes beyond a point is at most the integral from one step before it) and
the factor e^{bmax^2/(4 tau)}: this is eps_tail. Hence, for all z in the set,

    abs( F(z) - h sum_{abs j <= n} H_0(XC + jh + i y0) G_tau(z - XC - jh - i y0) ) <= eps_trap + eps_tail.          (A1)

The layers on the left are needed because abs H_0 grows like e^{pi d/8} at distance d to the left; JL is chosen so
that the remaining crude piece is negligible; whatever JL is, (A1) is a valid bound (the code evaluates it).
All quantities are multiplied by e^{-REF}, REF a fixed double near log abs J_0(XC + i y0) (REF = -1968.99 at
x = 5002 and -6.68e10 at x = 1.7e11); zeros are unchanged.

**Lemma W (winding number from enclosures; PROVED).** Let z_0, ..., z_m = z_0 be consecutive points of a closed
polygon and let E_k be a closed axis-parallel box with F([z_k, z_{k+1}]) in E_k and 0 not in E_k. Then F has no zero
on the polygon and its winding number is (1/2 pi) sum_k Arg(F(z_{k+1})/F(z_k)) with the principal Arg.
Proof. E_k is convex and does not contain 0, so it lies in an open half-plane bounded by a line through 0; a
continuous branch of arg on E_k has oscillation < pi, so the change of arg F along the segment lies in (-pi, pi) and
is congruent to Arg(F(z_{k+1})/F(z_k)) modulo 2 pi, hence equal to it. ∎
The code computes each Arg in ball arithmetic from tight enclosures of F(z_k); the sum divided by 2 pi is a ball that
must contain exactly one integer (`unique_fmpz`). Segment enclosures use the mean-value form
S(m) + S'(box)(box - m) for the trapezoid sum S (entire in z; valid because the box enclosure of S' is convex), plus
the error box of (A1). F is entire, so winding number 1 on a square means exactly one zero inside, and it is simple.

### 2.3 What is computed

For each zero recorded by `push/b-escape-law/zeros_tau*.json`: Newton polish in ball midpoints (not rigorous, only to
choose the centre), centre rounded to a decimal, then squares of half-width 0.05 and 1e-6 around it, 16 segments per
side, refined by bisection if an enclosure contains 0 (0 to 4 rounds were needed; section 3). Samples of H_0 on the line
Im w = y0 are computed once per run in Arb (zeta by Arb's `acb.zeta`; heights Im s up to 8.5e10) and reused for every z.
Run A: y0 = -1.6, a = 0.5 (sigma in [1.05, 1.55]). Run B: y0 = -1.8, a = 0.6 (sigma in [1.1, 1.7]), other nodes,
other step. The 256-bit runs double the precision and more than double the node count.
"Strictly off the critical line": in the variable z the line is Im z = 0. The half-width 1e-6 squares put three zeros
at Im z < -1.34 (Re s > 1.17: outside the closed critical strip; tau = 1, 0.25, 0.2) and three at
-0.989 < Im z < -0.943 (0.971 < Re s < 0.995: inside the strip; tau = 0.25, 0.15, 0.1). Every half-width 0.05 square
lies in Im z <= -0.893.
By the symmetries of F the zeros come in quadruples +-rho, +-conj(rho).

## 3. Item A: table of squares, precisions and winding numbers

Columns: tau; run = (y0, a, bits); centre of the square (x = Re z, Im z = -eta), exact decimals; half-width; number of
trapezoid nodes; eps = eps_trap + eps_tail of (A1) in the scaled units; lower bound for abs F on the contour from the segment
enclosures (scaled units; for comparison the samples have max modulus 3e2 to 2e5); number of segments after refinement;
winding number of F; winding number of H_0 (zeta) on the same square. Every winding number is the unique integer in a ball
of radius below 1e-13.

| tau | run (y0, a, bits) | square centre x | centre Im z | half-width | nodes | eps_trap+eps_tail (scaled) | min abs F on segments (scaled, lower) | segments | winding F | winding H_0 |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | -1.6, 0.5, 128 | 5001.646847849 | -1.635148075 | 0.05 | 1715 | 1.85e-33 | 7.618e-03 | 64 | 1 | 0 |
| 1 | -1.6, 0.5, 128 | 5001.646847849111 | -1.635148075297 | 0.000001 | 1715 | 1.81e-33 | 1.626e-07 | 64 | 1 | 0 |
| 1 | -1.6, 0.5, 256 | 5001.646847849 | -1.635148075 | 0.05 | 3523 | 5.29e-72 | 7.618e-03 | 64 | 1 | 0 |
| 1 | -1.6, 0.5, 256 | 5001.646847849111 | -1.635148075297 | 0.000001 | 3523 | 5.18e-72 | 1.626e-07 | 64 | 1 | 0 |
| 1 | -1.8, 0.6, 256 | 5001.646847849 | -1.635148075 | 0.05 | 2935 | 2.15e-72 | 5.643e-03 | 64 | 1 | 0 |
| 1 | -1.8, 0.6, 256 | 5001.646847849111 | -1.635148075297 | 0.000001 | 2935 | 2.10e-72 | 1.206e-07 | 64 | 1 | 0 |
| 0.25 | -1.6, 0.5, 128 | 1000006.298867791 | -1.345582920 | 0.05 | 859 | 1.67e-32 | 1.464e-03 | 64 | 1 | 0 |
| 0.25 | -1.6, 0.5, 128 | 1000006.298867790512 | -1.345582919615 | 0.000001 | 859 | 1.55e-32 | 3.320e-08 | 64 | 1 | 0 |
| 0.25 | -1.6, 0.5, 256 | 1000006.298867791 | -1.345582920 | 0.05 | 1763 | 4.79e-71 | 1.464e-03 | 64 | 1 | 0 |
| 0.25 | -1.6, 0.5, 256 | 1000006.298867790512 | -1.345582919615 | 0.000001 | 1763 | 4.42e-71 | 3.320e-08 | 64 | 1 | 0 |
| 0.25 | -1.8, 0.6, 256 | 1000006.298867791 | -1.345582920 | 0.05 | 1469 | 2.40e-71 | 7.962e-04 | 64 | 1 | 0 |
| 0.25 | -1.8, 0.6, 256 | 1000006.298867790512 | -1.345582919615 | 0.000001 | 1469 | 2.15e-71 | 1.889e-08 | 64 | 1 | 0 |
| 0.25 | -1.6, 0.5, 128 | 1000020.455262145 | -0.952082372 | 0.05 | 859 | 3.70e-32 | 1.074e-03 | 64 | 1 | 0 |
| 0.25 | -1.6, 0.5, 128 | 1000020.455262144711 | -0.952082371855 | 0.000001 | 859 | 3.28e-32 | 2.583e-08 | 64 | 1 | 0 |
| 0.25 | -1.6, 0.5, 256 | 1000020.455262145 | -0.952082372 | 0.05 | 1763 | 1.06e-70 | 1.074e-03 | 64 | 1 | 0 |
| 0.25 | -1.6, 0.5, 256 | 1000020.455262144711 | -0.952082371855 | 0.000001 | 1763 | 9.39e-71 | 2.583e-08 | 64 | 1 | 0 |
| 0.25 | -1.8, 0.6, 256 | 1000020.455262145 | -0.952082372 | 0.05 | 1469 | 6.72e-71 | 4.725e-04 | 64 | 1 | 0 |
| 0.25 | -1.8, 0.6, 256 | 1000020.455262144711 | -0.952082371855 | 0.000001 | 1469 | 5.79e-71 | 1.470e-08 | 64 | 1 | 0 |
| 0.2 | -1.6, 0.5, 128 | 500000006.093668598 | -1.613315187 | 0.05 | 859 | 1.14e-31 | 2.061e-04 | 64 | 1 | 0 |
| 0.2 | -1.6, 0.5, 128 | 500000006.09366859846 | -1.613315187479 | 0.000001 | 859 | 1.07e-31 | 6.060e-09 | 64 | 1 | 0 |
| 0.2 | -1.6, 0.5, 256 | 500000006.093668598 | -1.613315187 | 0.05 | 1763 | 3.26e-70 | 2.061e-04 | 64 | 1 | 0 |
| 0.2 | -1.6, 0.5, 256 | 500000006.09366859846 | -1.613315187479 | 0.000001 | 1763 | 3.05e-70 | 6.060e-09 | 64 | 1 | 0 |
| 0.2 | -1.8, 0.6, 256 | 500000006.093668598 | -1.613315187 | 0.05 | 1469 | 1.09e-70 | 6.046e-05 | 64 | 1 | 0 |
| 0.2 | -1.8, 0.6, 256 | 500000006.09366859846 | -1.613315187479 | 0.000001 | 1469 | 9.85e-71 | 2.526e-09 | 64 | 1 | 0 |
| 0.15 | -1.6, 0.5, 128 | 170000000005.668660984 | -0.988266202 | 0.05 | 859 | 5.59e-30 | 5.117e-07 | 256 | 1 | 0 |
| 0.15 | -1.6, 0.5, 128 | 170000000005.668660983785 | -0.988266202129 | 0.000001 | 859 | 4.63e-30 | 4.270e-10 | 64 | 1 | 0 |
| 0.15 | -1.6, 0.5, 256 | 170000000005.668660984 | -0.988266202 | 0.05 | 1763 | 1.60e-68 | 5.226e-07 | 256 | 1 | 0 |
| 0.15 | -1.6, 0.5, 256 | 170000000005.668660983785 | -0.988266202129 | 0.000001 | 1763 | 1.32e-68 | 4.270e-10 | 64 | 1 | 0 |
| 0.15 | -1.8, 0.6, 256 | 170000000005.668660984 | -0.988266202 | 0.05 | 1469 | 9.20e-69 | 5.426e-10 | 740 | 1 | 0 |
| 0.15 | -1.8, 0.6, 256 | 170000000005.668660983785 | -0.988266202129 | 0.000001 | 1469 | 7.24e-69 | 1.329e-10 | 64 | 1 | 0 |
| 0.1 | -1.6, 0.5, 128 | 10000000036.04010022 | -0.943907673 | 0.05 | 859 | 8.30e-30 | 3.938e-07 | 221 | 1 | 0 |
| 0.1 | -1.6, 0.5, 128 | 10000000036.040100219673 | -0.943907672963 | 0.000001 | 859 | 6.18e-30 | 1.369e-09 | 64 | 1 | 0 |
| 0.1 | -1.6, 0.5, 256 | 10000000036.04010022 | -0.943907673 | 0.05 | 1763 | 2.37e-68 | 2.868e-07 | 221 | 1 | 0 |
| 0.1 | -1.6, 0.5, 256 | 10000000036.040100219673 | -0.943907672963 | 0.000001 | 1763 | 1.77e-68 | 1.369e-09 | 64 | 1 | 0 |
| 0.1 | -1.8, 0.6, 256 | 10000000036.04010022 | -0.943907673 | 0.05 | 1469 | 3.24e-68 | 1.009e-08 | 736 | 1 | 0 |
| 0.1 | -1.8, 0.6, 256 | 10000000036.040100219673 | -0.943907672963 | 0.000001 | 1469 | 2.24e-68 | 4.908e-10 | 64 | 1 | 0 |

Enclosures in the variable z (and s = (1 + iz)/2), from the half-width 1e-6 squares; each contains exactly one zero of H_{-tau}, simple:

| tau | Re z | Im z | Re s = (1 - Im z)/2 | Im s = Re z / 2 | recorded by b-escape-law (x - XC, eta), XC the integer nearest to x |
|---|---|---|---|---|---|
| 1 | 5001.646847849111 +- 1e-6 | -1.635148075297 +- 1e-6 | 1.3175740 | 2500.8234 | (-0.353152151, 1.635148075) |
| 0.25 | 1000006.298867790512 +- 1e-6 | -1.345582919615 +- 1e-6 | 1.1727915 | 500003.1494 | (0.298867791, 1.345582920) |
| 0.25 | 1000020.455262144711 +- 1e-6 | -0.952082371855 +- 1e-6 | 0.9760412 | 500010.2276 | (0.455262145, 0.952082372) |
| 0.2 | 500000006.09366859846 +- 1e-6 | -1.613315187479 +- 1e-6 | 1.3066576 | 250000003.0468 | (0.093668598, 1.613315187) |
| 0.15 | 170000000005.668660983785 +- 1e-6 | -0.988266202129 +- 1e-6 | 0.9941331 | 85000000002.8343 | (-0.331339016, 0.988266202) |
| 0.1 | 10000000036.040100219673 +- 1e-6 | -0.943907672963 +- 1e-6 | 0.9719538 | 5000000018.0201 | (0.040100220, 0.943907673) |

36 certified squares in 18 runs; all windings 1 for F and 0 for H_0; at most 4 bisection rounds (only on half-width 0.05 squares at
tau = 0.15 and 0.1, where the line Im w = y0 is far from the saddle line and the terms of the sum cancel to about 1e-4 of their
size); total wall time of the 18 runs 1806 s on at most 8 cores (samples) and 1 core (the rest).

Proof obligations discharged by the run, per square: (a) every vertex enclosure and every segment enclosure excludes
0 (so F is not identically zero on the contour and has no zero on it); (b) the ball for the winding number contains
exactly one integer; (c) eps_trap + eps_tail is evaluated in balls and added to every enclosure as a box.

## 4. Items B and C: SG and NR-q

Definitions as in `push/c15-control-with-zeta-fe-classes-u1-u2/RESULT.md` (section on companions):

    SG_b(s)  = zeta(s) ((s - 1/2)^2 - b^2) / ((s - 1/2)^2 + g1^2)      (m = (t^2 + b^2)/(t^2 - g1^2), s = 1/2 + it),
    NRq_c(s) = zeta(s) (q^(s-1/2) + c + q^(1/2-s)),   q = 1 + sqrt 2.

g1 is the first zeta ordinate; it enters as the ball returned by Arb's `acb.zeta_zero(1)`
(14.13472514173469379045725198356247027078 +- 4.3e-39), so every enclosure holds for the true g1. The zeros are
known in closed form: s = 1/2 + b for SG (zeta(1/2 + b) is finite and non-zero for 0 < b < 1/2), and
s = 1/2 + (log w + i pi)/log q, w = (c + sqrt(c^2 - 4))/2, for NR-q. The certificate adds: exactly one zero, simple,
in each square, by direct ball evaluation on 64 segments (Lemma W; no quadrature).

| control | parameter | square centre (Re s, Im s) | half-width | bits | segments | lower bound abs G on contour | winding G | winding zeta |
|---|---|---|---|---|---|---|---|---|
| SG | b = 0.3 | (0.800000, 0.000000) | 0.05 | 128 | 64 | 3.875e-04 | 1 | 0 |
| SG | b = 0.3 | (0.80000000000000, 0.00000000000000) | 0.0000000001 | 128 | 64 | 1.332e-12 | 1 | 0 |
| SG | b = 0.4 | (0.900000, 0.000000) | 0.05 | 128 | 64 | 9.146e-04 | 1 | 0 |
| SG | b = 0.4 | (0.90000000000000, 0.00000000000000) | 0.0000000001 | 128 | 64 | 3.773e-12 | 1 | 0 |
| NR-q | c = 2.1 | (0.857311, 3.564428) | 0.05 | 128 | 64 | 1.348e-02 | 1 | 0 |
| NR-q | c = 2.1 | (0.85731131638378, 3.56442795638274) | 0.0000000001 | 128 | 64 | 3.548e-11 | 1 | 0 |
| NR-q | c = 2.05 | (0.753177, 3.564428) | 0.05 | 128 | 64 | 8.068e-03 | 1 | 0 |
| NR-q | c = 2.05 | (0.75317703480177, 3.56442795638274) | 0.0000000001 | 128 | 64 | 2.414e-11 | 1 | 0 |
| SG | b = 0.3 | (0.800000, 0.000000) | 0.05 | 256 | 64 | 3.757e-04 | 1 | 0 |
| SG | b = 0.3 | (0.80000000000000, 0.00000000000000) | 0.0000000001 | 256 | 64 | 1.332e-12 | 1 | 0 |
| SG | b = 0.4 | (0.900000, 0.000000) | 0.05 | 256 | 64 | 8.996e-04 | 1 | 0 |
| SG | b = 0.4 | (0.90000000000000, 0.00000000000000) | 0.0000000001 | 256 | 64 | 3.773e-12 | 1 | 0 |
| NR-q | c = 2.1 | (0.857311, 3.564428) | 0.05 | 256 | 64 | 1.278e-02 | 1 | 0 |
| NR-q | c = 2.1 | (0.85731131638378, 3.56442795638274) | 0.0000000001 | 256 | 64 | 3.548e-11 | 1 | 0 |
| NR-q | c = 2.05 | (0.753177, 3.564428) | 0.05 | 256 | 64 | 7.409e-03 | 1 | 0 |
| NR-q | c = 2.05 | (0.75317703480177, 3.56442795638274) | 0.0000000001 | 256 | 64 | 2.414e-11 | 1 | 0 |

Closed-form zeros (Arb, 256 bits): NR-q c = 2.1: 0.857311316383780998955007636460 + 3.56442795638273822354882690595 i (recorded: 0.857311 + 3.564428 i);
c = 2.05: 0.753177034801772327886706734832 + 3.56442795638273822354882690595 i. SG: 0.8 and 0.9 exactly.
A first choice b = 0.45 was dropped: its half-width 0.05 square touches the pole of zeta at s = 1.

## 5. Item D: pole counts of the renormalised stages (line 12)

Object (Test 3 of `push/c1-leeyang-krein-limit`, alpha = 1): the Curie-Weiss stage D(s) = sum over squarefree n | M of
a(n) exp(l_n^2/(2L) - s l_n) (M the product of the primes up to P, L = log M, l_n = log n), s = 1/2 + z,
L~ = A + D'/D + r with A = 1/s + 1/(s-1) - (1/2) log pi + (1/2) psi(s/2) and r the logarithmic derivative of the
renormaliser (zeta phases: a = 1, r = -P^(1-s)/(s-1); control U_s0, s0 = 3/4 + 20i: a(p) = p^(20i) e^(+-i phi_p),
r = +P^(s0-s)/(s-s0)), S~ = (1 - L~)/(1 + L~). The source lane counted poles of S~ in Re z > 0, 10 < Im z < 30 by
Newton iteration from the stage zeros and labelled the counts lower bounds.

Certificate. Poles of S~ at points with D != 0 are the zeros of N := (1 + A + r) D + D' (zeta phases), resp.
N := (s - s0)[(1 + A) D + D'] + P^(s0-s) D (U_s0; the pole of r at s0 is cleared and N(s0) = D(s0)); at such a zero
1 - L~ = 2, so it is a pole of S~ of the same multiplicity. N is analytic on the boxes (poles of A at s = 0, 1 and of
psi(s/2) are outside). Three argument-principle counts (Lemma W on adaptive dyadic bisections of the four sides;
enclosures = direct ball evaluation intersected with the mean-value form; A uses Arb's digamma, not the asymptotic
series of the source code):

    n1 = zeros of N in (0, 4) x (10, 30),   n2 = zeros of N in (1/64, 4) x (10, 30),   n3 = zeros of D in (1/64, 4) x (10, 30).

If n1 = n2 and n3 = 0, then N has no zero with 0 < Re z <= 1/64 in the window, D has none with Re z >= 1/64, and S~ has
exactly n1 poles (with multiplicity) in the box 0 < Re z < 4, 10 < Im z < 30. Not covered: Re z >= 4 (the source lane
found no pole with Re z > 0.56) and the lines Im z = 10, 30 themselves (N is certified non-zero on them).

| phases | P | terms | bits | n1 | n2 | n3 | certified poles in the box | Newton count on file | stage zeros in window (on file) | leaves (n1 contour) | wall s |
|---|---|---|---|---|---|---|---|---|---|---|---|
| zeta | 13 | 64 | 128 | 32 | 32 | 0 | 32 | 27 | 32 | 1062 | 2 |
| zeta | 13 | 64 | 256 | 32 | 32 | 0 | 32 | 27 | 32 | 1108 | 5 |
| zeta | 19 | 256 | 128 | 51 | 51 | 0 | 51 | 46 | 50 | 1811 | 14 |
| zeta | 19 | 256 | 256 | 51 | 51 | 0 | 51 | 46 | 50 | 1840 | 24 |
| zeta | 29 | 1024 | 128 | 71 | 71 | 0 | 71 | 62 | 71 | 2788 | 64 |
| zeta | 29 | 1024 | 256 | 71 | 71 | 0 | 71 | 62 | 71 | 2807 | 98 |
| zeta | 37 | 4096 | 128 | 94 | 94 | 0 | 94 | 83 | 94 | 4333 | 397 |
| zeta | 37 | 4096 | 256 | 94 | 94 | 0 | 94 | 83 | 94 | 4360 | 608 |
| zeta | 47 | 32768 | 128 | 130 | 130 | 0 | 130 | 118 | 130 | 7152 | 2414 |
| U_s0 | 13 | 64 | 128 | 34 | 34 | 0 | 34 | 29 | 33 | 1156 | 2 |
| U_s0 | 13 | 64 | 256 | 34 | 34 | 0 | 34 | 29 | 33 | 1215 | 5 |
| U_s0 | 19 | 256 | 128 | 52 | 52 | 0 | 52 | 47 | 51 | 2013 | 8 |
| U_s0 | 19 | 256 | 256 | 52 | 52 | 0 | 52 | 47 | 51 | 2041 | 20 |
| U_s0 | 29 | 1024 | 128 | 73 | 73 | 0 | 73 | 67 | 72 | 3271 | 95 |
| U_s0 | 29 | 1024 | 256 | 73 | 73 | 0 | 73 | 67 | 72 | 3302 | 118 |
| U_s0 | 37 | 4096 | 128 | 96 | 96 | 0 | 96 | 88 | 94 | 4978 | 406 |

Outcome: **enclosed** (exact integers) for the rows listed; 128-bit and 256-bit runs agree wherever both exist.
P = 47 (32768 terms): certified for the zeta phases at 128 bits (row above); U_s0 at P = 47 and the 256-bit rerun at P = 47 were not run (time).
Reading (MEASURED relation between certified integers, no proof of a law): the certified count is 5 to 12 larger than
the Newton count on file in every row, so the Newton counts were lower bounds as the source lane said; the certified
count is within 2 of the number of stage zeros in the window in every row (zeta phases: 32/32, 51/50, 71/71, 94/94, 130/130;
U_s0: 34/33, 52/51, 73/72, 96/94). The source lane's statement "about one pole in Re z > 0 per stage zero, same for
zeta phases and for the control U_s0" is consistent with these integers; the control U_s0 has 1 or 2 more poles than
the zeta phases at every P <= 37. The derivative formulas used by the mean-value enclosures were checked against a central
difference at one point per row (relative difference below 1e-21).

## 6. Controls on the computation

| control required by the assignment | how it was met |
|---|---|
| every object checked not identically zero on the contour | every vertex and segment enclosure excludes 0 (stronger: no zero on the contour); lower bounds for abs F on the contour are in the tables |
| each enclosure rerun at doubled precision | items A, B, C: 128 and 256 bits, all squares, same integers; item A also at 256 bits with a different integration line and strip width (run B); item D: 128 and 256 bits for P <= 29 and for the zeta phases at P = 37; 128 bits only for U_s0 at P = 37 and the zeta phases at P = 47 |
| zeta itself on the same rectangles | item A: H_0(z) = xi((1+iz)/2)/8 on the same squares, winding 0 in every run; items B, C: zeta(s) on the same squares, winding 0. Item D has no zeta analogue (finite stages); the stage control there is U_s0 |
| planned precision and allocation printed before the run | `PLAN:` line at the head of every log |

Independent check (not rigorous, different code path, mpmath only, unshifted line): `referee_check.py`, three zeros;
see REFEREE.md.

What the controls of the campaign (Davenport-Heilbronn and the rest) would mean here: nothing. This lane contains no
argument towards the target; it certifies properties of three controls and of one stage family. The requirement
flags are therefore all false by construction.

## 7. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 (multiplicativity used essentially) | false | no attack; nothing here uses the Euler product (the zeta samples are numerical input) |
| R2 (height-uniform, every window) | false | finitely many squares at six heights; nothing uniform |
| R3 (fails for every control for a structural reason) | false | not applicable: the objects certified are themselves controls |
| R4 (reaches the critical line) | false | not applicable; no statement about zeta |

No requirement score is claimed. No statement about zeros of zeta is made: the only facts about zeta used or produced
are "H_0 has no zero in these squares" and the Arb enclosure of g1.

Note on the squares that meet the strip (tau = 0.25 second zero, tau = 0.15, tau = 0.1): they lie in
0.94 <= Re s <= 1.03 at heights Im s near 5.0e5, 8.5e10 and 5.0e9. The zero count 0 for H_0 there is implied by the
verified height of RH (all zeros below 3e12 are on the line); the run reproduces it and adds nothing.

## 8. Three weakest steps

1. One derivation. Lemmas T, S, Q-application and W, the code and the choice of parameters are by this lane; the
   in-lane referee pass (REFEREE.md) is by the same agent with a different numerical code path, not an independent
   referee. Lemma Q is quoted from memory (Trefethen-Weideman 2014, Theorem 5.1) with a proof sketch; the
   Poisson-summation step was not written in full.
2. Trust in Arb for zeta at large height. The samples are `acb.zeta` at Im s up to 8.5e10 (Riemann-Siegel inside
   Arb, with its own rigorous remainder). The certificate is exactly as reliable as that routine; the mpmath
   cross-check covers only tau = 1 (height 2.5e3) and tau = 0.25 (height 5e5). At x = 1.7e11 the 128-bit run loses
   about 36 bits to the size of the exponent (sample radius 1e-22); the 256-bit runs do not depend on this.
3. Scope of what is certified. Item A certifies zeros of the function (A0) of `b-escape-law`; the identification of
   (A0) with the map's "kernel e^{tau u^2/16} kappa, tau < 0" was not rechecked, and the escape law itself (Theorem
   A there, the statement Statement O line 4 leans on) is not touched: six certified zeros off the axis show that
   H_{-tau} violates the strip conclusion at those tau, not that zeros leave every strip. Item D certifies counts on
   the box 0 < Re z < 4 only (the half-plane Re z >= 4 is not covered), for a function N written by this lane from
   the code of the source lane, with exact digamma in place of the asymptotic series used there.

## 9. Files

- `heat_encl.py` (item A), `cfg_*_A.json`, `cfg_*_B.json`, `jobs.txt`, `run_all.sh`, `run_rest.sh`, outputs
  `out_<tag>_{A_p128,A_p256,B_p256}.json`; `table.py` prints the table of section 3.
- `ctrl_bc.py` (items B, C), outputs `out_bc_p128.json`, `out_bc_p256.json`.
- `stage_poles.py` (item D), outputs `out_stage_p128.json`, `out_stage_p256.json`;
  `out_stage_v1_delta1024_p128.json` is the first version (direct enclosures, delta = 2^-10; P = 13, 19 only).
- `referee_check.py`, `referee_*.json`; `REFEREE.md`; `lanes.jsonl` (one line); `logs/` (server logs of every unit).
- Server units (all started through `rhrun`; all finished or stopped by this lane; none left running): the 20 log files in `logs/` are named by unit. Stopped early by this lane: the first design (`rh-c20-heat-t1-p128-1120082924`), two mis-configured starts, `rh-c20-heat-all-1120083601` and `-1120084237` (superseded code; completed tags kept only from the final code), `rh-c20-stageD-p128-1120083857` (first version), three slow mpmath referee units.
