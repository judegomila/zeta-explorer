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

