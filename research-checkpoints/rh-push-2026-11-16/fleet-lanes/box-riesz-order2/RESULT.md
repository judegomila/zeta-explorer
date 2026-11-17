# box-riesz-order2: the pole-corrected FE-symmetrised Riesz sections of order k are not real-rooted

Slug: box-riesz-order2. Date: 2026-11-17. Nothing committed or pushed. No RH claim, no zero-free region, no change to any
Lambda bound. Labels: PROVED (argument given here, classical ingredients named), CERTIFIED (python-flint/Arb ball
arithmetic: complex interval Newton, or certified signs), MEASURED (float64 / mpmath, no certificate), SCREENED
(float64 on GPU), CLASSICAL, OPEN.

## 0. Verdict

**Order 2 is closed: the candidate fails for zeta.** The order-2 section of zeta has zeros off the critical line.

* CERTIFIED: for N = 1250 the section F_N has a zero at s = 0.5414825 + 855204807584.9554 i (Re s - 1/2 >= 0.0414),
  and at the same height for every tested N from 630 to 4000 (section 3). Height 8.55 * 10^11 is below the verified
  height of RH: the zeros of xi are real there, the zeros of the section are not.
* CERTIFIED: the smallest stage with a failure found is N = 284 (zero with Re s - 1/2 >= 0.000411 at height about
  10^2989.5); also N = 292 (height about 10^6409.7) and N = 300 (height about 10^1007).
* MEASURED: N = 284 is the first stage whose Bohr lift has a zero to the right of the line (GPU search, 20000 starts
  per N: minimum of |lift| at sigma = 0.5001 decreases linearly to 2.07 * 10^-4 at N = 283 and is 0 from N = 284).

**General order: every integer order k >= 1 fails** (PROVED for all N >= N_0(k), N_0 not effective; section 2). The cause is
the pole of zeta at s = 1, seen through the torus: at the Liouville point of the torus (all prime phases equal to pi) the
limit function is zeta(2s)/zeta(s), which is negative on (1/2, 1) and vanishes at s = 1; its Riesz sections therefore
have a real zero in (1/2, 1), and by Kronecker the zeta section inherits it at some height. First stage with a real
zero at the Liouville point (CERTIFIED signs): N = 37, 292, 2184, 16238 for k = 1, 2, 3, 4 (MEASURED: 120461, 892552 for
k = 5, 6; ratio about e^2 per unit of k). Order 3 was also closed by a certified zero of the zeta section
(N = 5000 and N = 10000, heights about 10^86.7 and 10^82.7).

**Hurwitz analysis (section 4).** Of the two facts whose conjunction would prove RH,
(H1) "the sections converge to 2 xi locally uniformly" is TRUE (PROVED, rate k/log N, exact first-order term given), and
(H2) "every section is real-rooted" is FALSE (PROVED for N >= N_0(k); CERTIFIED instances). The failures sit at
heights far above 2 pi N (found: 8.55 * 10^11 for N = 630..4000), where the section is governed by the Bohr lift. What remains
true or open is real-rootedness of the stage-N section in the window |t| <= c N; there the section equals an explicit
differential expression in xi (for k = 1: xi times a positive elementary multiplier) plus a small remainder, so that
statement is RH up to height about N restated, not a torus property and not a new lever.

**Positivity (task item 2).** The Riesz weights of order k >= 1 do have a nonnegative kernel, and the average-of-translates
argument is valid, but only where the full lifted function exists on the whole torus and has a half-plane property:
sigma >= sigma_1 = 1.19 (sum over p of arcsin p^-sigma = pi/2). It cannot be extended into the strip: the lift has
zeros with 1/2 < sigma < 1 (PROVED, CERTIFIED).

## 1. Objects

M = N + 1, L = log M, w_n = (1 - log n / L)^k.
D_N(s) = sum_{n<=N} w_n n^-s (Riesz section), P_N(s) = k! M^(1-s) / ((1-s)^(k+1) L^k) (pole term), A_N = D_N - P_N.
G(s) = s(s-1)/2 pi^(-s/2) Gamma(s/2), xi = G zeta, psi_G = G'/G.
F_N(s) = G(s) A_N(s) + G(1-s) A_N(1-s): the object "afep, zeta, riesz k" of `box-ly-search` (same formula as its
`cert.py`; cross-checked in section 3). "Real-rooted" = all zeros with 0.01 < Re s < 0.99 have Re s = 1/2.
Bohr lift: B_N(sigma; theta) = sum_{n<=N} w_n n^-sigma exp(i sum_p v_p(n) theta_p); D_N(sigma + it) = B_N(sigma; -t log p).
For a completely multiplicative unimodular eps, the section of the twist is B_N at theta_p = -t log p + arg eps_p.

## 2. Statements

**T1 (structure of a section). PROVED (Perron formula; convexity bound for zeta).** For integer k >= 1, s != 1 and
max(Re s, 0) < c < k - 1/2 + Re s,

  A_N(s) = sum_{j=0..k} C(k,j) zeta^(j)(s) / L^j + R_N(s),  R_N(s) = (k! / (2 pi i L^k)) int_{Re w = -c} zeta(s+w) M^w w^-(k+1) dw,

|R_N(s)| <= C(K, c) M^-c / L^k on compact sets K. (Residue at w = 0: (1 + D/L)^k zeta, D = d/ds; residue at w = 1 - s:
P_N.) Since G (D zeta) = (D - psi_G) xi,

  F_N(s) = [(1 + (D - psi_G)/L)^k xi](s) + [the same expression evaluated at 1 - s] + G(s) R_N(s) + G(1-s) R_N(1-s).

For k = 1 the xi' terms cancel:  F_N(s) = xi(s) (2 - (psi_G(s) + psi_G(1-s)) / L) + remainder.
For k = 2:  F_N = xi (2 - 2(p+q)/L + (p^2 + q^2 - p' - q')/L^2) - 2 (p - q) xi' / L^2 + 2 xi'' / L^2 + remainder,
p = psi_G(s), q = psi_G(1-s), p', q' the derivatives of psi_G at s and 1-s.
For every k:  F_N = 2 xi - (k/L)(psi_G(s) + psi_G(1-s)) xi + O_K(L^-2).
On the critical line psi_G(s) + psi_G(1-s) = log(t / 2 pi) + O(t^-2): the k = 1 multiplier is 2 - log(t/2pi)/L, positive
for t < 2 pi M^2. MEASURED (`conv_rate.py`, `ident.py`): the expansion of A_N holds with remainder 10^-5 .. 10^-15 for
N = 10^2 .. 10^6 at heights <= 100; for N = 30 the identities hold to relative error 10^-4 .. 10^-2 (k = 1) and
10^-8 .. 10^-4 (k = 2) for t <= 190 and break down beyond t = 2 pi M = 195 (relative error 0.08 at t = 250, > 1 at
t = 400), where the remainder becomes the dual sum of the approximate functional equation.

**T2 (the lift has zeros to the right of the line). PROVED for every integer k >= 1 and all N >= N_0(k).** Two mechanisms.

(a) Liouville point theta = (pi, ..., pi): f_N(sigma) = sum w_n lambda(n) n^-sigma is real, f_N(sigma) -> 1 as
sigma -> +oo. Perron with zeta(2u)/zeta(u) (analytic for Re u >= 1 - eta(T_0), |Im u| <= T_0, and bounded by a power of
log on Re u = 1 + 1/L; contour Re(s+w) = 1 - eta/2 for |Im w| <= T_0/2, Re(s+w) = 1 + 1/L outside) gives, uniformly for
omega in compact sets, L f_N(1 - omega/L) = zeta(2)(k - omega) + O(1/T_0) + o(1). Hurwitz: f_N has a real zero
sigma_N = 1 - (k + o(1))/L, in (1/2, 1). This is the pole of zeta: zeta(2s)/zeta(s) vanishes at s = 1.
(b) Diagonal theta = -t_0 log p (zeta's own orbit at bounded height, where the pole term is not negligible): with
s = 1 + i t_0 - (k log L + omega)/L, T1 gives D_N(s) = zeta(1 + i t_0) + k! e^(-i t_0 L) e^omega / (-i t_0)^(k+1) + o(1)
uniformly on compact omega-sets; the limit has a simple zero at bounded omega, |limit| >= 0.63 |zeta(1 + i t_0)| on
the unit circle around it; Rouche: D_N has a zero with Re s = 1 - (k log L + O(1))/L, in (1/2, 1).

Finite-N data for T2:

| k | first N with f_N(1/2) < 0 at the Liouville point (CERTIFIED signs at N and N - 1; f_N(0.99) > 0) | first N with a lift zero at sigma = 0.5001 (SCREENED multi-start) | first N with a zero of D_N itself right of the line (MEASURED) |
|---|---|---|---|
| 1 | 37 | 27 (N = 26: min 0.00793; agrees with box-ly-search) | in (50, 60] |
| 1.5 | - | in (90, 100] | - |
| 2 | 292 | **284** (N = 283: min 2.07 * 10^-4; N = 262..283 all positive, linear decrease) | in (1500, 1800] |
| 3 | 2184 (real zero at sigma = 0.500035) | none at sigma = 0.5001 for N <= 2184 (4000 starts; min 0.0198, 0.0090, 0.0041, 0.0017, 0.00074, 0.00027, 0.000085 at N = 1800, 2000, 2100, 2150, 2170, 2180, 2184; linear in N, reaching 0 at N = 2186): the lift threshold coincides with the Liouville threshold 2184 within 2 | in (30000, 100000] |
| 4 | 16238 (real zero at sigma = 0.500003) | none at sigma = 0.5001 for N <= 16238 (600 starts; min 0.0123, 0.0066, 0.0039, 0.0024, 0.0013, 0.00083, 0.00032, 0.00013 at N = 14000, 15000, 15500, 15800, 16000, 16100, 16200, 16238; linear in N, reaching 0 at about 16265): coincides with the Liouville threshold within 0.2 % | - |
| 5, 6 | 120461, 892552 (MEASURED, float) | - | - |

MEASURED: f_N(1/2) < 0 for every N from the threshold to 3 * 10^6 for k = 1..6 (`liou.py`). CERTIFIED lift zeros (complex
interval Newton on the one-variable twisted Dirichlet polynomial with exact dyadic phases, `cert_torus.py`): k = 2 at
N = 284 (sigma = 0.500382), 290, 306, 499, 959 (sigma = 0.607266); k = 1 at N = 27.
MEASURED: the largest sigma on the zero set found by continuation equals the Liouville real zero within 0.002
(N = 959: 0.6073 against 0.6061). For k = 1 and 2 the lift acquires a zero at a non-real torus point slightly before
the Liouville point does (27 against 37, 284 against 292); for k = 3 and 4 the two thresholds coincide within the
resolution of the search.

**T3 (transfer to the section of zeta and of every unimodular twist). PROVED (Kronecker, Rouche, Stirling).** Let
B_N(sigma_0; theta_0) = 0 with sigma_0 > 1/2. Put f(s) = sum w_n e^(i v(n).theta_0) n^-s, choose r < sigma_0 - 1/2 with
f != 0 on |s - sigma_0| = r, m = min |f| there. For eps > 0 there are arbitrarily large T with
|e^(-iT log p) - e^(i theta_0,p)| < eps for all p <= N (log p linearly independent over Q); then on the circle
|D_N(s + iT) - f(s)| <= eps sum w_n Omega(n) n^-sigma < m/3, |P_N(s + iT)| <= k! M^(1/2) / ((T-1)^(k+1) L^k) < m/3, and
|G(1 - s - iT)/G(s + iT)| |A_N(1 - s - iT)| <= C_N (T/2pi)^-(sigma_0 - r - 1/2) < m/3 for T large. Hence
F_N/G has a zero within r of sigma_0 + iT: an off-line zero of F_N. The same holds for the pole-corrected section of
any unimodular completely multiplicative twist (shift theta_0 by arg eps_p; any pole term decays).

**Corollary.** For each integer k >= 1 and N >= N_0(k), F_N has infinitely many zeros off the critical line. For k = 2 the
conclusion is CERTIFIED at N = 284, 300 and 630..4000 (section 3); by T3 + the certified lift zeros it holds at
N = 284, 290, 306, 499, 959 and at every N with f_N(1/2) < 0 (certified at 292, 300, 959, 3000).

**T4 (what positivity gives). PROVED.** For k >= 1, x -> (1 - |x|/L)_+^k is even, convex and decreasing on x > 0, hence
(Polya) the Fourier transform of a nonnegative kernel K_L; for sigma > 1, B_N(sigma; theta) = int K_L(u)
Z(sigma; theta - u log p) du, Z = prod_p (1 - p^-sigma e^(i theta_p))^-1. Re Z > 0 on the whole torus exactly when
sum_p arcsin(p^-sigma) < pi/2, i.e. sigma > sigma_1 = 1.19; there Re B_N > 0 for every N. For sigma <= 1 the full lift is
not defined on the whole torus (at theta = 0 it has the pole; at the Liouville point its continuation vanishes at
sigma = 1), and by T2 no extension to 1/2 < sigma < 1 exists. The Fejer case k = 1 is included: nonnegativity of the
kernel does not protect the strip.

## 3. Certified zeros of the zeta sections

Method. (1) A lift zero (sigma*, theta*) (Liouville real zero, or continuation of the diagonal zero down in N, `cont.py`).
(2) Height by simultaneous inhomogeneous Diophantine approximation: lattice with rows 2 pi c_p e_p and
(c_p log p / 2^10)_p + kappa e_q, target (-theta*_p c_p)_p, weights c_p = |dB/d theta_p|; LLL with Kannan embedding in
exact integer arithmetic (`hsearch.py`); the weighted distance rho is the size of the perturbation of B. Primes with
pi c_p < rho / (4 sqrt(pi(N))) are left free (N = 959: 86 of 162 primes constrained at rho = 0.05). (3) Zero of D_N near
sigma* + iT in float64 from exact phases, then Newton for h = F_N / G(s) in Arb. (4) Certificate (`cert_zero.py`):
complex interval Newton: s_0 a point, Q the square of half-side r = 2^-40 around it, h'(Q) an Arb enclosure not
containing 0, |h(s_0)/h'(Q)| < r: exactly one zero of h in Q. Precision = bits of T + 400.

| k | N | height T (exact value q/1024, q in the result files) | certified zero: Re s | Re s - 1/2 >= | abs(G(1-s)/G(s)) | source |
|---|---|---|---|---|---|---|
| 2 | 1250 | 855204807584.9717 (q = 875729722967011) | 0.5414825, Im s = T - 0.0162570 | 0.0414 | 0.345 | box sweep 2 |
| 2 | 630, 635, ..., 700, 710, ..., 1250, 1300, 1400, 1500, 1600, 1800, 2000, 2500, 3000, 4000 | same T | 0.50538 (N = 630) .. 0.54257 (N = 1500) .. 0.51260 (N = 4000) | > 0 | 0.34 .. 0.72 | `nrange.py`; N = 625 and N = 5000: zero on the line |
| 2 | 1841 | 1190970979675.2 (1.19 * 10^12) | 0.51846 | 0.0184 | 0.619 | box sweep 4 (continuation seeds) |
| 2 | 959; 1329; 1129, 1329, 1564 | 1.039 * 10^14; 1.089 * 10^14; 7.912 * 10^14 | 0.5209; 0.5322; 0.5010 .. 0.5287 | 0.001 .. 0.032 | 0.37 .. 0.97 | box sweep 4 |
| 2 | 650 | 1.378 * 10^14 | 0.50913 | 0.0091 | 0.756 | box sweep 2 |
| 2 | 1129, 1250 | 3.761 * 10^13 | 0.51144, 0.51484 | 0.011 | 0.71 | box sweep 2 |
| 2 | 550, 600, 650, 692, 750, 815, 900, 959, 1129, 2550 | 4.7546 * 10^16 (q = 48686999780750483929 and neighbours) | 0.5095 .. 0.5390 | 0.0095 .. 0.039 | 0.24 .. 0.71 | box sweeps 1, 2 |
| 2 | 959 | 7.752 * 10^19 (q = 79380711440070368642620) | 0.5461042 | 0.0461 | 0.132 | local, continuation seed |
| 2 | 400, 450, 499 | 10^28.0, 10^28.2, 10^30.2 | 0.5170, 0.5041, 0.5238 | > 0.004 | 0.2 .. 0.77 | box sweep 1 |
| 2 | 300 | 10^1006.99 (1011-digit q) | 0.5031375 | 0.003137 | 7.0 * 10^-4 | `small_stage.py` |
| 2 | 292 | 10^6409.71 (6414-digit q, precision 21703 bits) | 0.5001229 | 0.000122 | 0.163 | `small_stage.py`, Liouville seed |
| 2 | **284** | 10^2989.455 (2993-digit q, precision 10341 bits) | 0.5004120 | 0.000411 | 0.0587 | `small_stage.py` |
| 3 | 5000 | 10^86.74 | 0.5250800 | 0.0250 | 0.0070 | box, Liouville seed |
| 3 | 10000 | 10^82.65 | 0.5408874 | 0.0408 | 4.5 * 10^-4 | box, Liouville seed |

Counts: box sweeps 1, 2, 3, 4 produced 2840 + 7776 + 3288 + 5084 candidate heights; 483 + 576 + 124 + 367 were sent to the
certificate; 256 + 145 + 7 + 31 are certified off-line zeros (the others converged to zeros on the line; the lists contain
repeats of the same zero reached from neighbouring targets). No height below 8.55 * 10^11 was found by the lattice
method; sweep 3 (tolerances 0.06 .. 0.12, N = 1050 .. 4000) returned the same minimum, and sweep 4 (targets on the
non-real branch of the zero set obtained by continuation) bottoms out at 1.19 * 10^12.

Cross-check against the previous lane (`xcheck.py`, imports `box-ly-search/cert.py` read-only): its object F for
(afep, zeta, riesz2, N = 959) evaluated at the two certified zeros (T = 4.75 * 10^16 and 7.75 * 10^19) gives
|F(s_0)| / |F(s_0 + 0.01)| < 10^-180 and winding number 1 on the circle of radius 0.004; the same for the zero at
8.55 * 10^11 (N = 1250), and ratio < 10^-195 for the N = 284 zero (there the circle of radius 0.004 also contains the
mirror zero and zeros on the line, so its winding number is not quoted). The argument-principle routine of that lane
(`rect_count`, float corners) was also tried at 8.55 * 10^11 on two rectangles (`xcheck2.py`) and stopped with "box budget
exhausted" both times: not resolved, no count obtained; the certificate is the interval Newton test above.

Height estimate. The lattice method approximates one chosen point of the zero set, so its heights are upper bounds
for the first failure. Calibration on order 1 (`hsearch.py` on k = 1): lattice heights 1.98 * 10^7 (N = 34) and
2.66 * 10^9 (N = 31), certified, against the first failures 185053.9 and 7968258 found by scanning in box-ly-search: a
factor 10^2 .. 10^2.5. For order 2 the first failure of the stages N = 630..4000 is therefore at most 8.55 * 10^11 and
plausibly near 10^9 .. 10^10; box-ly-search screened N = 50..1000 clean to 4 * 10^6 .. 6 * 10^6. A direct scan to 10^10 was
not run (about 10^14 float evaluations of a 1000-term sum; not needed for the decision). For N = 284..400 the margin
sigma* - 1/2 is below 0.03 and the required tolerance forces heights 10^28 and above.

## 4. Hurwitz analysis

Claim examined: "for one fixed k all sections F_N are real-rooted, and F_N -> 2 xi locally uniformly; Hurwitz then
gives RH."

(H1) Convergence. TRUE, PROVED (T1). F_N -> 2 xi locally uniformly on C minus {0, 1} (F_N has poles of order k at
s = 0, 1, the limit has none; Hurwitz applies on that domain since 2 xi is not identically 0). Rate: exactly 1/log N,

  F_N(s) - 2 xi(s) = -(k / log M)(psi_G(s) + psi_G(1-s)) xi(s) + O_K(log^-2 M).

The first-order term is a multiple of xi, so zeros move at second order; for k = 1 the section is xi times the
multiplier 2 - (psi_G(s) + psi_G(1-s))/L up to the Perron remainder. The convergence is not uniform in height: at
height t the remainder is small only for t below about 2 pi N (MEASURED, section 2), and the multiplier is far from 2
unless log t << log N.

(H2) Real-rootedness of every section. FALSE: PROVED for every integer k >= 1 and N >= N_0(k) (T2 + T3), CERTIFIED for
k = 2 at N = 284, 300, 400..4000 and for k = 3 at N = 5000, 10000 (k = 1: box-ly-search). So the two facts do not both
hold; the failing one is (H2), and the hypothetical proof has no content.

Where each part of (H2) lives. For a fixed stage N there are three ranges of height.

1. t below about 2 pi N. F_N = (differential expression in xi of order at most k with elementary coefficients) + small
   remainder. For k = 1: F_N = xi * (positive multiplier) + remainder. Real-rootedness here is the statement that the
   zeros of xi up to that height are real and far enough apart to survive the remainder. PROVED direction: if for
   some c > 0 and all large N the zeros of F_N with 0 < Re s < 1, |t| <= c N are on the line, then RH (Hurwitz with H1
   on each compact set). So this windowed statement is at least as hard as RH; it uses the actual zeros of zeta, is false
   for Davenport-Heilbronn as soon as 2 pi N exceeds 85.7 and the stage resolves that zero, and is not a torus property.
   For N up to the verified height it is true for zeta by verification (zeros simple and on the line), which is the
   verified-height wall.
2. t between about 2 pi N and the torus range. The remainder is the dual sum of the approximate functional equation
   with unbalanced lengths N and t/(2 pi N). MEASURED only: no failure for N <= 10^4 up to 2 * 10^4 (box-ly-search);
   failures at 8.55 * 10^11 for N = 630..4000 (here t/(2 pi N) is 3 * 10^7 .. 2 * 10^8).
3. t -> infinity. F_N/G(s) = D_N(s) + O((t/2pi)^-(sigma - 1/2)) to the right of the line. Real-rootedness at large height
   holds iff the lift B_N has no zero with sigma > 1/2 (T3 for "only if"; the "if" direction needs a positive lower bound
   for |B_N| on sigma >= 1/2 + delta and is not certified here). This is a property of the weights and of complete
   multiplicativity with unimodular values at primes; it is the same for zeta and for every unimodular twist.
   It holds for N <= 283 (MEASURED) and fails for N >= 284 (k = 2).

Location of the failures as N grows. PROVED from H1: for every T below the verified height (zeros of xi simple and
real) F_N is real-rooted in |t| <= T for N >= N_1(T), N_1 not effective here; so the failures of large stages lie above
any such T. That they leave every compact set as N -> infinity follows from RH together with simplicity of the zeros, and
conversely implies RH (Hurwitz); it is not a consequence of anything in this file.

So: (i) the finite-stage
property that is a torus property is false from N = 284; (ii) the finite-stage property that would imply RH in the
limit (range 1, window growing with N) is RH at finite height restated; (iii) nothing in between gives a statement
about zeros of zeta as N -> infinity.

## 5. Controls and interpretation (task item 3)

| input | lift | result |
|---|---|---|
| zeta, order 2 | zero right of the line from N = 284 (SCREENED), certified at 284 | section fails: CERTIFIED (section 3) |
| unimodular twist U (sign flip at 2, `tw2m` of box-ly-search; residue 1/3) | the same lift, theta_2 shifted by pi | CERTIFIED off-line zero of its section at N = 959, T = 3.16 * 10^23, Re s = 0.51794 (the same lift zero gives the zeta zero at T = 5.33 * 10^23, Re s = 0.51940; `ctrl_tw.py`) |
| Davenport-Heilbronn, order 2 | a different lift (coefficients not multiplicative): zero from N in (135, 140] (MEASURED, `dh_lift.py`, 400 starts: min 0.0105 at N = 135, zeros at 140, 145, 150..200); order 1: from N = 27 (N = 26: 0.0086) | fails at large height from N = 140 (by T3; not certified here); fails at low height from N = 500, at its zero near 85.7 from N in (700, 750] (box-ly-search) |
| L(s, chi_4) (true L-function, no pole) | zeta lift with the prime 2 deleted: zero from N in (370, 380] (SCREENED) | fails at large height from N = 380 (by T3; box-ly-search certified chi_4 failures for order 1) |
| backward heat family | no Dirichlet series: not formulable | - |

Reading. For order 2 and 140 <= N <= 283 the Davenport-Heilbronn section fails at large height and the zeta section is
not known to fail (lift minimum positive, MEASURED; low heights screened by box-ly-search). This is the only
separation, it uses only that the Davenport-Heilbronn coefficients are not completely multiplicative, it is shared by
every unimodular twist of zeta (Liouville included, which has no functional equation and zeros unrelated to zeta's),
and it ends at N = 284. Real-rootedness of Riesz sections at large height is a torus property, and it is false for
all sufficiently large stages. It implies nothing about zeros of zeta: by T1 the stage-N section only contains zeta's
zeros up to height about 2 pi N, and at N <= 283 that is height 1800.

The step that uses arithmetic: none in the failing direction. The lift zero comes from the pole of zeta at s = 1
(equivalently the zero of zeta(2s)/zeta(s) at s = 1, or sum 1/p = infinity): the Liouville point is in the closure of
every orbit. Having no pole does not help a true L-function: the torus of L(s, chi_4) (the zeta lift with the prime 2
deleted) contains the twist (1 - 2^-s) zeta(s) and its Liouville twist (1 + 2^-s) zeta(2s)/zeta(s), which vanishes at
s = 1. MEASURED/SCREENED: the prime-2-deleted order-2 lift has zeros at sigma = 0.5001 from N in (370, 380]
(min 0.0024 at N = 370; zeros at every N = 380..1500 tested), and the odd-n Liouville sum is negative at sigma = 1/2
from N = 375. (box-ly-search reported "between 1000 and 1500" for chi_4 from a descent that had not converged.)

## 6. What ran

Compute server (all through `~/rh-push/bin/rhrun` from `~/rh-push/box-riesz-order2/`; at most 14 cores requested at any
time: 2 + 10 + 2, then 2 + 12; memory requested 24 + 16 + 8 GB, used about 1 GB; GPU device 1 only, float64 screen,
5.9 GB of GPU memory at the sample taken). All units stopped or exited at the end (section 6.1).

| unit | cores | job | UTC | outcome |
|---|---|---|---|---|
| rh-bro2-gpu-1117105046, rh-bro2-hs-1117105046, rh-bro2-k3-1117105046 | 2, 10, 2 | first launch | 10:50:46 | exited at once: code had not arrived (see transfer note) |
| rh-bro2-gpu-1117105549 | 2 (GPU 1) | `jobG.sh`: `gpu_torus.py` multi-start lift search, k = 1 (N = 20..28), k = 2 (N = 262..292 each, and 100..260), k = 1.5, k = 3, then prime-2-deleted lift and k = 4 | 10:55:49 - 11:27 | ran to completion; section 2 table; MemoryPeak 1.14 GB (read while running); GPU 5.9 GB at the sample taken |
| rh-bro2-hs-1117105549, rh-bro2-k3-1117105549 | 10, 2 | height sweeps | 10:55 - 10:56 | stopped by a bug of mine (empty task list indexed); fixed |
| rh-bro2-dbg-1117105706 | 1 | 3 x 3 LLL and one candidate, version check | 10:57 | python-flint 0.9.0, same output as local |
| rh-bro2-hs-1117105644 | 10 | `hsweep.py` k = 2, 18 stages x 8 tolerances x 21 targets, then certificates | 10:56 - 10:58 | 2840 candidates, 256 certified off-line zeros |
| rh-bro2-k3-1117105736 | 2 | `hsweep.py` k = 3, N = 3000, 5000, 10000 | 10:57 - 11:00 | 2 certified off-line zeros |
| rh-bro2-hs2-1117110118 | 12 | `hsweep.py` k = 2, 12 stages x 8 tolerances x 81 targets | 11:01 - 11:02 | 7776 candidates, 145 certified, minimum height 8.55 * 10^11 |
| rh-bro2-hs3-1117110256 | 12 | `hsweep.py` k = 2, larger tolerances | 11:02 - 11:03 | same minimum height |
| rh-bro2-hs4-1117110834 | 12 | `hsweep.py` k = 2, continuation seeds, 10 stages x 7 tolerances x 81 targets | 11:08 - 11:09 | 5084 candidates, 31 certified, minimum height 1.19 * 10^12 |

Transfer note: my first two `rsync` commands wrote into a local directory instead of the box (zsh expanded `$H:r...`
as a history-style modifier, so the destination was not a remote path); the first launch therefore found no code.
Code and seeds were then copied with `tar` over ssh, results and logs came back the same way; the stray local copy
(inside this directory) was deleted. Only code, .npy seeds and .jsonl results were transferred. No computation was run
directly over ssh (status and log reads only).

Local (Mac, each through `scripts/memcap.sh` with a cap of 4 to 8 GB, single process except one 4-worker test):
`diag.py` (zeros of D_N), `cont.py`, `cont2.py` (continuation of the lift zero in N; reproduces the order-1 threshold
27 of box-ly-search), `liou.py`, `liou_zero.py`, `cert_liou.py`, `cert_torus.py`, `height.py`, `hsearch.py`,
`small_stage.py` (N = 300: 9 s; N = 284: 60 s), `cert_zero.py`, `nrange.py`, `ctrl_tw.py`, `dh_lift.py`, `conv_rate.py`,
`ident.py`, `xcheck.py`. Results: `results/*.jsonl`, `results/box/*.jsonl`, logs in `results/*.log`.

### 6.1 Final state of the units

Checked at 11:27:20 UTC: `systemctl --user list-units --all "rh-bro2-*"` lists no unit (all jobs exited by themselves;
no `systemctl stop` was needed; the five failed-state records of the early launches were cleared with
`systemctl --user reset-failed <my unit names>`). `rhstatus` shows no `bro2` unit; GPU 1 memory back to 4 MiB. No local
process of this lane is running. Logs copied to `results/box/logs/`.

## 7. Weakest steps

1. "N = 284 is the first failing stage for order 2" is MEASURED: for N <= 283 the lift minimum is a multi-start float
   result (20000 starts, smooth in N, same value from an independent continuation), not a certified lower bound on a
   61-dimensional torus; and for N <= 283 heights between 2 * 10^4 (or 4 * 10^6 for N = 50..283 as far as screened by
   box-ly-search) and the torus range are not covered by anything rigorous.
2. T2 is asymptotic: N_0(k) is not effective. The certified instances are k <= 4 at single N (signs) and the float
   check of the sign up to N = 3 * 10^6; the proofs of T1..T3 are written at the level of a careful sketch (contours and
   bounds named, constants not tracked), not formalised.
3. The first failure height for order 2 is not known: 8.55 * 10^11 is an upper bound from one lattice family;
   the description of the middle range of heights (range 2 of section 4) is measured, and the statement that the
   remainder is small exactly below 2 pi N rests on the approximate-functional-equation heuristic plus `ident.py` at
   N = 30.
