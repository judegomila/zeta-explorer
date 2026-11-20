# r2-lambda-tpos-floors: range-split floors, the probe LP at t > 0, and the domination condition for signed kernels

Date 2026-11-16. Follow-up to `push/lambda-from-halfplane/RESULT.md` and its `REFEREE.md`.
Labels: PROVED / CLASSICAL / MEASURED / HEURISTIC / OPEN. "PROVED (c.a.)" means computer-assisted with the arithmetic
stated next to it. Every Lambda value is conditional on the unrefereed half-plane Re s > 7/8, on Raymond's unrefereed
construction and on project certificates. The accepted bound is Lambda <= 0.2. RH is open. Nothing here gives zero
information.

## 0. Verdict

**Partial result.** Three proved statements, one measured table, one heuristic estimate.

1. **Theorem C (domination for signed kernels). PROVED.** For a finite signed probe measure w on heights h_i > y,
   pointwise domination on the whole strip 0 <= b <= y is equivalent to one inequality on the boundary line b = y:
   r_w(d) = 4y/(d^2+4y^2) - sum_i w_i K_{h_i}(d - x_i, y) >= 0 for all real d. The difference is an explicit positive
   kernel (the Poisson kernel of the strip). The certificate reads -y' >= sum_i w_i S(x*-x_i, h_i, t) + r_w(0).
   Necessary: sum w_i <= 1 and sum w_i h_i <= 2y. The 2-D Bernstein certification of kernel rows becomes a 1-D exact
   check; it reproduces all 13 catalogue rows and the project rows (section 3).
2. **Class ceiling. PROVED (as a statement about the information class).** Any certificate of this form whose floor
   functional also holds for the same-height lattice of density L/2pi gives -y' <= L coth(yL). Integrated from y0 = 3/4
   this is time log cosh(y0 L)/L^2 = 0.09622. F2 is at 0.11609. The whole class {floors on S at h > y} x {single-zero
   barrier} cannot go below about 0.096 at this X.
3. **Theorem A (range-split floor at t = 0). PROVED (c.a., complete lattice enumeration, double precision with slack).**
   For every x >= X - 8: S(x,h,0) >= L + (1/2) zeta'/zeta((1+h)/2) + Delta(h)/2 - 1e-9 with
   Delta(1.5) = 0.19944, Delta(1.5443) = 0.18389, Delta(1.6) = 0.16621, Delta(1.7) = 0.13874 (primes <= 139).
   Floor at h = 1.5443: 5.15058 (trivial) -> 5.24253 (+1.8%). 4 l/h = 13.579, so the number 13.34 is not a ceiling.
   The calibrated heuristic value at full depth is Delta about 1.0 (floor +0.5); the proved part is 18% of it and each
   further 4 primes costs a factor 20 in enumeration.
4. **Certified start rate at t = 0. PROVED (c.a.).** A three-pair positive probe measure with exact domination (Sturm
   chain over Q, no real root) and the triangle-inequality joint floor gives E >= 4.51620, plus the joint alignment
   deficit 0.020464/2: E >= 4.52643, equivalent rate 2E/y = 12.070 against F2's 11.008 (+9.7%). This is a statement at
   t = 0 only and moves no Lambda value by itself.
5. **Probe LP at t > 0. MEASURED on 50 cells, model floors (not certified).** Rate gain over the certified F2 rate:
   positive measures +10.6% to +14.8% (median +12.2%); signed measures +12.7% to +21.8% (median +16.4%). Against the
   same model evaluated on the F2 configuration: +6.4% and +10.0% (medians).
6. **Lambda estimate. HEURISTIC.** If the measured gains were certified on every cell: 0.1102 (positive), 0.1085
   (signed). Conservative variant (gain against the model's own F2 value): 0.1125 and 0.1108. Not claims.

## 1. Plan: what is new against the atlas, the walls and the predecessor

- Atlas section 12 (Newman Lambda): this is an upper-bound computation on Lambda, not an RH route.
- Predecessor P4 (13.34 "ceiling") was refuted by its referee as a statement about valid floors. Here the referee's
  three proposals are carried out: range-split floors (section 2), the t > 0 LP (section 4), and the worst-case
  configuration analysis (section 3, which also answers the referee's item 3: the same-height cluster is the extremal
  configuration and gives a sharp ceiling).
- New: Theorem C and its corollaries; the lattice-enumeration alignment bound; an exact t = 0 certificate; the 50-cell
  t > 0 measurement.
- Walls. DH: section 6. Flow-blindness and MV-CAP do not apply (every-x statements from absolute values and from a
  Diophantine enumeration, no mean values; positive-time output). Verified height enters only through Raymond's (W).

Notation as in the paper: K_h(d,b) = (h-b)/(d^2+(h-b)^2) + (h+b)/(d^2+(h+b)^2); S(x,h,t) = sum over pairs of
K_h(x-x_j,b_j); for the top zero x*+iy: q' = -2 - 4y sum' K_y(d_j,b_j), so y' = -1/y - 2 sum' K_y. X = 6000000185827,
L = (1/4) log(X/4pi) = 6.72294. E denotes the certified pull beyond de Bruijn: -y' >= 1/y + E; for a rate c of the
paper, E = c y/2.

## 2. (a) Range-split floor at t = 0

**Setting. CLASSICAL.** S(x,h,0) = (1/2) Re xi'/xi(sigma + ix/2), sigma = (1+h)/2 > 1, and
Re xi'/xi(s) = Re[1/s + 1/(s-1)] - (1/2) log pi + (1/2) Re psi(s/2) + Re zeta'/zeta(s) >= (1/2) log(x/4pi) - 1e-20
+ Re zeta'/zeta(s) for x >= 1e12. With gamma = x/2 and a_p = log p * p^{-sigma}:

  -Re zeta'/zeta(sigma + i gamma) = sum_n Lambda(n) n^{-sigma} cos(gamma log n)
      <= -zeta'/zeta(sigma) - Def_k(gamma),   Def_k(gamma) = sum_{i<=k} a_{p_i} (1 - cos(gamma log p_i)).

(Drop the nonnegative deficits of prime powers and of primes > p_k. This is the tail bound: triangle inequality.)

**Lemma A1 (alignment as a lattice problem). PROVED.** Put alpha_i = log p_i/2pi, ||u|| = distance to Z,
Q(gamma) = sum_i 8 a_i ||gamma alpha_i||^2. Since 1 - cos(2 pi u) >= 8 ||u||^2, Def_k >= Q. Fix eta > 0 and let j be
the nearest integer to gamma/eta. Then sqrt(Q(gamma)) >= sqrt(Q(j eta)) - sqrt(E_eta), E_eta = 2 eta^2 sum a_i alpha_i^2
(triangle inequality in the weighted l^2 norm; ||.|| is 1-Lipschitz). The integers j with j eta <= G1 and
Q(j eta) <= B are lattice points of norm^2 <= B(1+1/k) in the lattice spanned by
(eta alpha_1 s_1, ..., eta alpha_k s_k, kappa) and s_i e_i, s_i = sqrt(8 a_i), kappa = sqrt(B/k) eta/G1. Hence for
every gamma in [G0, G1]:

  Def_k(gamma) >= Delta := min( (sqrt(B) - sqrt(E_eta))^2 ,  min over listed j of [ f(j eta) - |f'(j eta)| eta/2 - C2 eta^2/8 ] ),

f = Def_k, C2 = sum a_i log^2 p_i (second-order Taylor bound on |theta| <= eta/2). The list is every lattice point in
the ball with j eta in [G0 - eta, G1 + eta].

**Theorem A. PROVED (c.a.).** Let G0 = (X-8)/2, G1 = (eX+8)/2, eta = 1/256. For h in the table and every x >= X - 8,

  S(x,h,0) >= L(X-8) + (1/2) zeta'/zeta((1+h)/2) + min(Delta_k(h)/2, 1/4) - 1e-9.

Proof: for x <= eX + 8 use Lemma A1; for x > eX the term (1/4) log(x/4pi) exceeds L(X) by at least 1/4 and the
trivial bound is used. Delta_k(h) <= 1/2 in all rows, so the minimum is Delta_k/2.

| h | -zeta'/zeta(sigma) | trivial floor | Delta, k=30 (p<=113) | Delta, k=34 (p<=139) | floor, k=34 | gain | 4 l/h trivial -> new |
|---|---|---|---|---|---|---|---|
| 1.5 | 3.466654 | 4.989612 | 0.179436 | 0.199442 | 5.089333 | +0.0997 (2.00%) | 13.306 -> 13.572 |
| 1.5443 | 3.144715 | 5.150581 | 0.165342 | 0.183890 | 5.242526 | +0.0919 (1.79%) | 13.341 -> 13.579 |
| 1.6 | 2.808094 | 5.318892 | 0.148538 | 0.166215 | 5.401999 | +0.0831 (1.56%) | 13.297 -> 13.505 |
| 1.7 | 2.339808 | 5.553035 | 0.121562 | 0.138736 | 5.622403 | +0.0694 (1.25%) | 13.066 -> 13.229 |

Arithmetic (`align2.py`, `enum2.c`): basis scaled by 2^140 and rounded to integers, exact LLL (python-flint),
Gram-Schmidt in 80-digit mpmath rounded to double, complete Fincke-Pohst enumeration in double with relative radius
slack 1e-7, phases j eta alpha_i mod 1 in 128-bit fixed point. In every row the listed minimum is below the ball
bound, so Delta is the minimum of Def_k over the range up to the eta-discretisation (k=34: 8.3e9 to 1.0e10 nodes,
1.03e9 points in range, 14 min each on the motherbox; k=30 reproduced locally and remotely; k=26 gives the same
value on both machines). Not interval-certified: the enumeration is in double precision.

**Joint version. PROVED (c.a.).** For a symmetric probe measure the same lemma holds with
a_p = log p * p^{-1/2} |what(p)|, what(p) = sum_i w_i p^{-h_i/2} cos((x_i/2) log p), and target phase pi for the primes
with what(p) < 0 (closest-vector enumeration, `align_joint.py`). For the measure of section 5: Delta_w = 0.014937
(k=30), 0.020464 (k=34).

**How far this is from the true floor. HEURISTIC, calibrated.** Independent-uniform-phase large deviations at 1e13
cells (`ld_heur.py`, `ld_joint.py`) predict the k=30 minima 0.159 / 0.147 / 0.133 / 0.111 against the enumerated
0.179 / 0.165 / 0.149 / 0.122 (model low by 10-12%). With all primes the same model gives Delta = 1.18 / 1.01 / 0.82 /
0.58 for h = 1.5 / 1.5443 / 1.6 / 1.7 (floor gains 0.59 / 0.50 / 0.41 / 0.29) and 0.27 for the optimised joint
measure. The referee's sampled window (-1.58 at sigma = 1.27 over 1e4) is consistent.

**Obstruction for the remaining 80%. Precise.** (i) Enumeration: Delta_k is exact but the number of lattice points
within the needed radius grows by about 20 per 4 primes (4e8 nodes at k=30, 9e9 at k=34); k = 46 is about 1e14 nodes.
(ii) Moments: bounding the tail sum_{P<p<=Q} by a 2m-th moment plus a union bound over the ~1e16 Lipschitz cells of
the range needs m about 37 for Gaussian-size bounds, while Montgomery-Vaughan requires Q^m <= 1e13, i.e. Q <= 2.2
(HEURISTIC order count); with m = 4, Q = 1778 the moment bound for 146 < p <= 1778 is 6.0 against the trivial 0.47.
(iii) Direct verification over gamma in [3e12, 8e12] at step 0.1 is 5e13 evaluations of zeta'/zeta. So an every-gamma
bound on the prime tail in a range of this length is available only from Diophantine enumeration at small depth.

## 3. (c) Domination for signed kernels

**Theorem C. PROVED.** Let y > 0 and w = sum w_i delta_{(x_i,h_i)} a finite signed measure with all h_i > y. Put
D(d,b) = 2 K_y(d,b) - sum_i w_i K_{h_i}(d-x_i,b) and r_w(d) = 4y/(d^2+4y^2) - sum_i w_i K_{h_i}(d-x_i,y). Then for
0 <= b < y

  D(d,b) = P_b(d) + (1/2pi) (P_b * r_w)(d),   P_b(d) = (2pi/y) cos(pi b/2y) cosh(pi d/2y) / (cosh(pi d/y) + cos(pi b/y)) > 0,

and D(d,y) = r_w(d) for d != 0. Hence D >= 0 on {0 <= b <= y} minus (0,y) if and only if r_w >= 0 on R.

Proof. Fourier transform in d: (a/(d^2+a^2))^ = pi e^{-a|xi|}, so K_h(.,b)^ = 2pi e^{-h|xi|} cosh(b xi) for |b| < h,
D^ = 2pi cosh(b xi) [2 e^{-y|xi|} - w^(xi)] with w^(xi) = sum w_i e^{-h_i|xi|} e^{-i x_i xi}, and
r_w^ = 2pi [e^{-2y|xi|} - cosh(y xi) w^(xi)]. Since 1 + e^{-2y|xi|} = 2 e^{-y|xi|} cosh(y xi),
1 + r_w^/2pi = cosh(y xi) [2 e^{-y|xi|} - w^], so D^ = (2pi cosh(b xi)/cosh(y xi)) (1 + r_w^/2pi), and
2pi cosh(b xi)/cosh(y xi) is the transform of P_b (CLASSICAL). The converse is continuity as b -> y. (Equivalently:
D is harmonic in the strip and P_b is its Poisson kernel; the boundary values are 2pi delta + r_w.) Numerical check
of the identity for a random signed measure: max error 3.7e-10 (`check_c.py`).

**Corollary C1 (certificate). PROVED.** Let x*+iy be a simple zero of H_t of maximal height, w symmetric in x with
r_w >= 0. Summing D over the other pairs, with sum_i w_i K_{h_i}(-x_i,y) = 1/y - r_w(0) for the own pair,

  -y' >= sum_i w_i S(x*-x_i, h_i, t) + r_w(0).

Raymond's Lemma (AF 11.1) is the case of two points with w = lambda y/h.

**Corollary C2 (necessary conditions). PROVED.** Integrating r_w >= 0: sum w_i <= 1. Letting d -> infinity:
sum w_i h_i <= 2y. For positive measures W <= min(1, 2y/h_min); for signed measures W <= 1 with the first-moment
condition on the net measure. The predecessor's P3 (lambda <= 2) is the second condition.

**Corollary C3 (extremal signed measure). PROVED.** w* = sum_{k>=0} 2 (-1)^k delta_{(0,(2k+3)y)} (Abel-summed) has
r_{w*} = 0 identically and D = P_b exactly: 2 K_y(d,b) = sum_k 2(-1)^k K_{(2k+3)y}(d,b) + P_b(d). Checked numerically
to 5e-6 (`check_c.py`). It has W = 1 and gives -y' >= L - sum_n Lambda(n) n^{-(1+3y)/2}/(1+n^{-y}) at t = 0 (needs
y > 1/3); at y = 3/4 this is 5.839 against F2's 5.461, the certified 5.860 of section 5 and the signed LP value 5.99 of section 4.

**Corollary C4 (kernel rows by a 1-D computation). MEASURED.** By scaling, the largest lambda for a two-point row
(r, rho) is inf_{v<=rho} inf_d [4v/(d^2+4v^2)] / [v (K_1(d+r,v) + K_1(d-r,v))/2]. All 13 rows of Raymond's catalogue
satisfy lambda <= lambda*; the project rows are tight: (3/5, 161/400): lambda = 1.9826, lambda* = 1.98283;
(27/40, 1/5): 1.96, 1.96436; (3/5, 81/400): 1.9958, 1.99608 (`kernel_rows_check.py`, float grid).

**Proposition C5 (class ceiling). PROVED.** Let Z_a be the configuration of pairs (ja, +-y), j in Z, and L_c = 2pi/a.
For the zero at j = 0: -y' = L_c coth(y L_c). So for every w with r_w >= 0 and every lower bound ell_w for
sum_i w_i S(.) that also holds on Z_a: ell_w + r_w(0) <= L_c coth(y L_c). On Z_a,
S(x,h) >= (L_c/2)[tanh(L_c(h-y)/2) + tanh(L_c(h+y)/2)] >= 6.48 for L_c = L and h - y >= 0.6, which exceeds every
floor used by F2 (<= 6.12 in the sample, with h - y >= 0.8). So positive-measure chains with such floors satisfy -y' <= L coth(yL): E <= L coth(yL) - 1/y
(5.39 at y = 3/4, 2.04 at y = 0.144). The ODE y' = -L coth(yL) from y0 = 3/4 reaches 0 at log cosh(y0 L)/L^2 = 0.09622.
This replaces the predecessor's mean-field benchmark (35.9, time 0.0425), which no certificate of this form can
approach: the same-height lattice has the same S at every h > y and half the pull.

## 4. (b) The probe LP at t > 0

**Setup.** Maximise over w (positive, or signed with W >= 0): F(w) + r_w(0), subject to r_w(d) >= 0 (Theorem C, a
1-D constraint) where F(w) is a lower bound for sum_i w_i S(x*-x_i, h_i, t) valid for all x* >= X.

**Floor functional at t > 0, and what is missing.** With N = 690988 = floor(sqrt(X/4pi)),
D_t(n) = exp(-(t/4) log n (2 log N - log n)), the Polymath effective main term at x = X is
B_t(x+ih) = M * sum_{n<=N} D_t(n) n^{-(1+h)/2 - i gamma} and S = L(x) + d/dy log|sum| + corrections. Writing
-P'/P = sum Lam_t(n) n^{-s} for the formal log-derivative of P(s) = sum_{n<=N} D_t(n) n^{-s}:

  sum_i w_i S_i >= L W - (1/2) sum_n |Lam_t(n)| n^{-1/2} |sum_i w_i n^{-h_i/2} cos((x_i/2) log n)| - corrections.

This is linear in w, so signed measures need no separate upper bound on S: the two-sided bound
|S - L(x)| <= (1/2) sum |Lam_t(n)| n^{-(1+h)/2} + corrections is the same triangle inequality. An x-uniform upper
bound on S itself does not exist (S ~ L(x) grows), which is why W >= 0 is required. Missing for a certificate:
- (M1) Lam_t(n) >= 0, or a majorant. At t = 0 this is Lambda(n) >= 0. For t > 0, b_n = exp((t/4) log^2 n) is not
  multiplicative. MEASURED: Lam_t(n) > 0 for all 2 <= n <= 690988 at the 49 sampled t > 0 (minimum 5.0e-10). OPEN
  in general (the one-prime case follows from Kaluza's theorem on log-convex sequences; the multi-prime case is a
  positivity statement for a ferromagnetic pair interaction on exponent vectors and was not proved here).
- (M2) Terms beyond N: the reflected sum and the Riemann-Siegel remainder have non-integer frequencies. Raymond's
  cone lemma handles them for one probe pair with exception debits; no version exists for the weights |what(n)|.
- (M3) Uniformity in x beyond X (his six frequency ranges and activation terms) and in t over a cell.
- (M4) Certified r_w >= 0 for the chosen w: now a Sturm computation (section 5 does one).

**Model used for the measurement. HEURISTIC.** x = X; n <= 400 jointly as above; the rest per probe by
Tail_i = B_i/(1+A_i) - sum_{n<=400} Lam_t(n) n^{-(1+h_i)/2}, where B/(1+A) is the real-point value of -F'/F including
the reflected sum (the value Raymond's cone bound certifies up to debits). Calibration against the certified F2 floor
at the same (h, r): model minus certified = 0.021 to 0.336 (median 0.232); on the cells where F2 uses its best
(structured / Theorem MP) floors the difference is 0.02-0.05. At t = 0 the model is 0.011 above the exact zeta value
at h = 1.88 (reflected sum in place of the true tail).

**Measurement. MEASURED (`lp_tpos.py`, `lp50.json`, 50 substeps k = 0, 1213, ..., 59438).** Probe grid: 15 heights
from 0.7 h_F2 to 8 h_F2 times 16 offsets in [0, 3 h_F2]; r_w >= 0 on 545 points, rechecked on 8200 points (worst
relative violation 3e-4, values reduced by twice that). E in units of -y' beyond 1/y.

| k | t | y | h_F2 | E F2 (certified) | E model, F2 config | E LP positive | E LP signed | ceiling C5 | pos/F2 | signed/F2 | ceiling/F2 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.00000 | 0.7500 | 1.880 | 4.128 | 4.295 | 4.567 | 4.652 | 5.390 | 1.106 | 1.127 | 1.306 |
| 6065 | 0.01185 | 0.6855 | 1.760 | 3.965 | 4.145 | 4.404 | 4.496 | 5.266 | 1.111 | 1.134 | 1.328 |
| 12130 | 0.02369 | 0.6215 | 1.640 | 3.778 | 3.979 | 4.214 | 4.326 | 5.117 | 1.115 | 1.145 | 1.354 |
| 18195 | 0.03554 | 0.5578 | 1.520 | 3.571 | 3.794 | 4.000 | 4.128 | 4.938 | 1.120 | 1.156 | 1.383 |
| 24260 | 0.04738 | 0.4944 | 1.425 | 3.335 | 3.548 | 3.757 | 3.892 | 4.718 | 1.127 | 1.167 | 1.415 |
| 30326 | 0.05923 | 0.4307 | 1.315 | 3.073 | 3.289 | 3.483 | 3.611 | 4.442 | 1.133 | 1.175 | 1.445 |
| 36391 | 0.07108 | 0.3658 | 1.222 | 2.828 | 2.841 | 3.151 | 3.282 | 4.088 | 1.114 | 1.161 | 1.446 |
| 42456 | 0.08292 | 0.2989 | 1.135 | 2.408 | 2.552 | 2.745 | 2.873 | 3.624 | 1.140 | 1.193 | 1.505 |
| 48521 | 0.09477 | 0.2278 | 1.060 | 1.959 | 1.977 | 2.230 | 2.345 | 2.993 | 1.138 | 1.197 | 1.528 |
| 54586 | 0.10661 | 0.1439 | 0.980 | 1.339 | 1.352 | 1.499 | 1.585 | 2.044 | 1.120 | 1.184 | 1.527 |
| 58225 | 0.11372 | 0.0696 | 0.950 | 0.659 | 0.684 | 0.752 | 0.800 | 1.034 | 1.141 | 1.213 | 1.569 |

All 50 cells (ratio to the certified F2 value): model on the F2 configuration 1.004-1.074 (median 1.052); LP positive,
heights >= h_F2: 1.023-1.064 (1.046); LP positive, free heights: 1.106-1.148 (1.122); LP signed, |w_i| <= 3:
1.127-1.218 (1.164); |w_i| <= 50: the same to 1e-3. Ratio to the model's F2 value (medians): 1.064 positive, 1.100
signed. Positive optima put most weight on one pair at 0.76-0.83 h_F2 with offset 0.6 h_F2 and a second pair nearby;
these heights are below the producer's moment-cap limit (0.86), so the positive gain is an extrapolation of the model.
Signed optima add alternating weights at 4-8 h_F2 with total variation about 170; their gain over positive measures
is 2% at t = 0 and 6% at the end.

Reading: F2 is within 31%-57% of the class ceiling C5 everywhere. Of that, the LP recovers about 12 points with
positive measures and 16 with signed ones (model). The remaining gap to C5 is the arithmetic penalty
(1/2) sum |Lam_t(n)| |what(n)|, not the kernels.

## 5. Certified statement at t = 0

Configuration (`t0_config.json`), y^2 = 5625001/10^7, w_i = y omega_i on the pairs (h_i, +-x_i):
(13/8, 5/8, 939253/10^6), (8/5, 5/4, 132559/500000), (31/20, 35/16, 28189/10^6).

- Domination: r_w/y is a rational function over Q; its numerator has degree 24, positive leading coefficient, is
  squarefree, positive at 0, and its Sturm chain (length 25, exact rationals) counts 0 real roots. PROVED (c.a., exact).
  sum omega_i h_i = 1.99417 <= 2; W = 0.92442; r_w(0) = 0.37499.
- Value: E = sum w_i (L(X-8) - own_i) - (1/2) sum_{n<=3000} Lambda(n) n^{-1/2} |what(n)| - (1/2) sum w_i tail_i - 1e-9
  = 4.516197, tails from zeta'/zeta in 40-digit mpmath (`t0_cert.py`). PROVED (c.a., multiprecision, not interval).
- Alignment: + Delta_w/2 = 0.010232 on [X, eX]; beyond eX the term L(x) W adds at least 0.231. PROVED (c.a., section 2).

Result: at t = 0, a simple top zero at height sqrt(q0) with x* >= X has -y' >= 1/y + 4.52643, i.e. q' <= -2 - c q
with c = 12.0705. F2's first substep has c = 11.0076. The single-probe "ceiling" 13.34 of the predecessor is not
involved; by C5 the ceiling at this y is c = 2(L coth(yL) - 1/y)/y = 14.37.

## 6. Estimate of Lambda (every step labelled)

Float replay of the 59439 F2 rates with each rate multiplied by the per-cell factor interpolated in k
(`lambda_est.py`; control with factor 1 reproduces 0.116091489).

| scenario | factors | value |
|---|---|---|
| F2 (certified, conditional) | 1 | 0.116091 |
| model floor on the F2 configuration | 1.004-1.074 | 0.11372 |
| LP positive, free heights | 1.106-1.148 | 0.11019 |
| LP signed | 1.127-1.218 | 0.10852 |
| LP positive, gain taken against the model's F2 value | 1.051-1.128 | 0.11250 |
| LP signed, gain taken against the model's F2 value | 1.083-1.187 | 0.11081 |
| class ceiling C5, per-cell ratio | 1.306-1.574 | 0.09929 |
| class ceiling C5, closed form | | 0.09622 |

Heuristic steps: (H1) model floors at t > 0 are not certified (M1-M3); (H2) heights below the certified range for the
positive optimum; (H3) factors measured at the F2 pairs (t, y) and applied by substep index, the path is not
re-optimised (a faster path reaches lower y earlier, where factors are slightly larger); (H4) caps and cell
uniformity ignored; (H5) 50 samples, linear interpolation; (H6) domination on a grid with a fine recheck, not Sturm,
except at t = 0. Proved content inside the estimate: Theorem C, and the t = 0 point. The alignment floor of section 2
is not used in the estimate; at full heuristic depth it would add about 3% to E at t = 0 (0.27/2 on 4.52).

## 7. Davenport-Heilbronn control

- Theorem A and section 5 use the Euler product twice. (i) -zeta'/zeta = sum Lambda(n) n^{-s} with Lambda(n) >= 0
  supported on prime powers; the triangle inequality and the sign of every deficit term a_p (1 - cos) need
  a_p >= 0. (ii) The alignment lemma is a statement about the vector (gamma log p)_p mod 2pi; its content is the
  Q-linear independence of the log p (unique factorisation), entered through the lattice. For the DH function the
  logarithmic derivative has poles in sigma > 1, there is no such Dirichlet series, and S has no positive floor at
  these heights. Both parts fail.
- (M1) at t > 0, Lam_t(n) >= 0, starts from the coefficients of zeta being 1 (completely multiplicative).
- Theorem C, C1-C5 are statements about kernels and configurations and hold for any function; they give no zero
  information. C5 is an obstruction, valid for DH as well.
- (H1) of the paper (the half-plane) fails for DH.

## 8. Three weakest steps

1. The t > 0 gains rest on a model floor. Its three unproved ingredients are named (M1-M3). The model is above the
   certified F2 floors by 0.02-0.34 at the same configuration, which is the same size as the gains measured; the
   conservative row of section 6 removes that part and leaves 0.1125 / 0.1108.
2. Theorem A's constants come from a double-precision enumeration (exact LLL, slack 1e-7, two machines agree at
   k = 26 and k = 30). No interval certificate and no second implementation. The inequality itself (Lemma A1) is
   elementary. The gain is small: 1.2-2.0% of the floor for one probe, 0.2% of E for the optimised joint measure.
3. Proposition C5 is a ceiling for certificates whose floor functional also holds on the same-height lattice. That
   is true for positive measures with the floors in use; for signed measures with arithmetic two-sided bounds it is
   an assumption about the information used (the lattice has constant S, the true S fluctuates), so 0.0962 is a
   class ceiling, not a theorem about every conceivable use of S.

## 9. Next step

Certify the positive three-pair family along the path: (M1) positivity of Lam_t (or Raymond's cone debit with
weights |what(n)|), then Sturm-certified r_w >= 0 per cell (Theorem C makes this exact and cheap). Expected value
0.1102-0.1125 (HEURISTIC). The lattice alignment and the signed measures add about 3% and 4% in rate and can wait.
No route below 0.096 exists inside this class.

## Files (all under tmp/research-2026-11-16/push/r2-lambda-tpos-floors/)

- `align2.py`, `enum2.c`, `align_joint.py`: lattice enumeration; outputs `a30_*.json`, `a34_*.json`, `j30.json`, `j34.json`.
- `ld_heur.py`, `ld_joint.py`: large-deviation heuristics and calibration.
- `check_c.py`, `kernel_rows_check.py`: Theorem C identity, ladder, kernel-row consistency.
- `t0_lp.py`, `t0_config.json`, `t0_cert.py`, `t0_cert.json`: t = 0 configuration and certificate.
- `sample_cells.py`, `cells50.json`, `lp_tpos.py`, `lp50.json`, `summarize.py`, `gain_ratios.json`: 50-cell LP.
- `lambda_est.py`, `lambda_est.json`, `f2_path.json`: replay estimate.
- `align.py`, `enum.c`: first version of the enumerator (superseded).
