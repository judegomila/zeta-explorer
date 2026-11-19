# c6-probe61-thin-three-weights: the probe (6.1) itself for THIN, Liouville and 1, with the two norms of Proposition D

Date 2026-11-18. Slug `c6-probe61-thin-three-weights`. Kind: compute (heavy lane). Scope: this directory and
`~/rh-push/c6-probe61-thin-three-weights/` on the compute server. Not refereed. Nothing committed or pushed.
No statement about zeros of zeta is made. RH open. The 7/8 manuscript (`~/lean-deps/qrh-verify/paper.txt`, unrefereed;
its section, lemma and equation numbers are used below) is treated as text. NO QED.

Labels: PROVED / ARGUED (read from the manuscript's displayed formulas, not replayed line by line) / MEASURED (float64,
complete enumeration; two scales also in ball arithmetic) / MODEL (density approximation, checked against the exact
sum in the range) / HEURISTIC / OPEN.

## Verdict

Partial result. The pre-registered thresholds are not decided by the raw exponents, for a stated quantitative reason;
the probe was computed and a sharper measured statement replaces them.

1. **(6.1) was computed** (not NOT-RUN): I_w(Z^(1/2), Z^(1/2), Z) with S = {2, lambda}, for 14 sign weights, at 29
   scales Z = 2^10 .. 2^18 (quarter-octaves to 2^16, then 2^16.5, 2^17, 2^17.5, 2^18; 8.4 million rows m and
   4.04 million indices at the top scale), together with the two norms of the Cauchy-Schwarz step.
2. **Measured law (all 14 weights):** I_w = P_w + R_w, where P_w is the principal row u = 1 of the manuscript's
   Poisson series with the residue at w = 1 only and the sum over sixth-power frequencies kept exact (an explicit
   finite sum, linear in the weight, Lemma 2), and the remainder R_w has the size of an incoherent row sum,
   RP ~ Z^(-0.24), for every weight: rms of abs(R_w)/RP over the 29 scales is 0.70 to 1.10 (Liouville 1.39).
   Pooled coefficient r = sum Re(I conj P)/sum abs(P)^2: Liouville 1.000 +- 0.001; THIN b = 0.95, three random seeds
   1.002 +- 0.015, 0.986 +- 0.015, 0.994 +- 0.011; the greedy set 1.010 +- 0.010; the referee's non-multiplicative
   weight with large Mertens sum 1.001 +- 0.002.
3. **The probe is pre-asymptotic for Z <= 2^18, and up to about 2^32.** The exponent C(beta) = beta - 2/3 of
   Proposition 2.1 comes from the pole of zeta^S(6z), that is from counting the frequencies H = a^6. In (6.1) at
   X = Y = Z^(1/2) these have norm up to about (q_A/X)^(1/6) ~ Z^(1/12), and the first ideal a != 1 coprime to 6 has
   norm 7. In the range only a = 1 contributes; P_w then scales like Z^(beta - 3/4) (beta the abscissa of the
   singularity of 1/L(s, w)). For the Liouville weight the density model of P gives a local exponent falling from
   0.55 (Z = 2^10) to 0.28 (2^18), 0.25 (2^26), 0.233 (2^32), and reaching 1/3 only for Z >= 2^36 to 2^44.
   Consequently the manuscript's comparison quantity abs(I_w - c_S f_w) equals 1.1 to 1.3 times abs(c_S f_w) at
   every scale for every weight with a signal (P is about 2.2 c_S f in the range); this is not a property of any
   control.
4. **Pre-registered thresholds.** (a) Low estimate abs(I_eps) << Z^(1/4+epsilon): holds numerically throughout the
   range (abs(I_eps) <= 0.007 times the Cauchy-Schwarz value; fitted exponent 0.21 to 0.26 on the upper 15 scales,
   0.30 to 0.34 on all 29, the excess being the transient of item 3, also present for Liouville). Not decided in the
   asymptotic sense. (b) Condition (N), E_eps >= 2b - 5/6 = 1.0667: not seen; the exponent of sum abs(B_eps)^2
   equals that of weight 1 (1.036 +- 0.006 on all scales, 1.020 +- 0.006 on the upper half; ratio exponent
   (0.0 to 0.3) x 10^-3 +- 0.3 x 10^-3). Not decided asymptotically.
5. **Which half carries the periodicity input (R3 location): the low half, by the following chain.** The high
   half, in the form that can be measured (signal present with the predicted coefficient, remainder at the
   incoherent level), holds for THIN exactly as for weight 1, for Liouville and for non-multiplicative and null
   weights: nothing in it distinguishes a periodic weight. If the remainder stays below Z^(b - 2/3 - sigma) as
   Z -> infinity (measured exponent -0.24 for Z <= 2^18; OPEN beyond), Proposition D forces the low estimate, and
   with it the row bound (5.36), to fail for THIN with b > 11/12. The failure is asymptotic (exponent 1/30 at
   b = 0.95, beyond Z ~ 2^36) and cannot be observed by enumeration.

What is not established: the high comparison for I_eps as Z -> infinity (a bound for the remainder uniform in Z);
any direct observation of a violation of the low estimate or of (5.36).

---

## 0. Plan and reading

Read: BRIEF; OBSTRUCTION_MAP section 2 (control THIN), rows Z15, Z15b, Z18, items 21 and 22 of section 6;
STRATEGY.md section 4.0; `c4-thin-twist-control-78/RESULT.md` (Proposition D); `c5-thin-propd-dichotomy/RESULT.md`
and `REFEREE.md` (errors E1 to E5: the row moment is not the probe; the regression statistic was linear and could not
separate the halves); `c5-thin-walk-replay/EXCHANGE.md` (condition (N)); manuscript Sections 2, 4.1, 4.2, 6.1, 6.2,
7.1, 7.2, 10.1.

New relative to round 5: the object is the bilinear probe (6.1) itself with its additive factor A, not the row
mean square; the comparison term is computed exactly (Lemma 2), so the remainder is measured and not inferred.

Decisive first test: can (6.1) be evaluated and does it show the reciprocal of the target in row u = 1? Done first
at Z = 256, 1024, 2048 locally: yes (section 3.2). The lane continued to the server runs.

---

## 1. First lemma: (6.1) as an explicit finite sum, and its cost

Data. O = Z[omega], S = {2, lambda} (P_0 = 4), b* = 2 lambda = 2 + 4 omega, q_b* = 12. xi = xi_2 xi_lambda with
xi_2 the cubic character of (O/2)^x, xi_2(omega) = e(1/3), and xi_lambda the quadratic character of (O/lambda)^x.
tau = 12^(-1/2) sum_{d mod b*} xi(d) e(d/b*) = -i (computed; abs(tau) = 1). W_1 = bump on (1, 2),
W_0 = bump on (1, 1.25), bump(r) = exp(1 - 1/(1 - t^2)), t the affine coordinate of r on the interval.
Phi(t) = e^(t^2), V_G(y) = exp(-(log y)^2/4)/(2 sqrt pi). X = Y = Z^(1/2), Q = 12 Z.

Reading of the display. The text file prints alpha(cn^3) and G(cn^3) in the corrected row T_{m,s,eta} without bars.
The cancellation described in Section 7.2 ("gamma_2(c) = mu(c) alpha(c) G(c)/gamma_1(c)", "cancelled by the
inserted G(cn^3)") requires conj(alpha(A)) and conj(G(A)), with G(c) = conj(chi_c(4)) Gamma(c) (the identity
gamma_1 gamma_2 = mu alpha G of (4.7) holds on all 4.04 million table moduli to 4e-9 with this G and fails with
chi_c(4) Gamma(c)). The four variants were run (section 5): only (bar, bar) shows the reciprocal of the target.

**Lemma 1 [PROVED as a rearrangement of the finite sums of (6.1), given the reading above].** For a weight w on
indices A = c n^3 (c squarefree, c and n primary and coprime to 6) put

    B_{m,sigma,w}(Z) = sum_{c, n} gamma_2(c) conj(alpha(A)) w(A) conj(xi(A)) conj(chi_A(b*)) R(A, s_sigma) chi_A(m) conj(G(A))
                                   q_c^(-1/2) q_n^(-1) V(q_A/Z),
    TA_s[k] = (1/Y) W_1(q_s/Y) chi_s(b*) conj(xi(s)) (tau (12 X)^(1/2))^(-1) q_s^(-1) g_{chi_s}(s, k)        (k mod s),
    a_{m,sigma} = sum_{s in sigma} TA_s[-m] W_0(q_m/(12 q_s X)),

where sigma runs over the four square classes of s mod 4 (B depends on s only through R(A, s), a bicharacter of
square classes), and g_psi(c, k) = sum_{d mod c} psi(d) e(kd/c). Then

    I_w(X, Y, Z) = sum_{m coprime to 6} xi(m) sum_sigma a_{m,sigma} B_{m,sigma,w}(Z),

a finite sum: s over primary s coprime to 6 with Y < q_s < 2Y, m over 12 X q_s < q_m < 15 X q_s, and A over
q_A <= e^(u_1) Z once V_G is cut off at u = log(q_A/Z) <= u_1. Also A_{m,sigma,v=0}(Y) of (6.2) equals
Q^(1/2) sum_{s in sigma} TA_s[-m], and abs(I_w) <= sum_sigma norm(a_sigma) norm(B_sigma,w) =: CS_w.

Cut-off. V_G is multiplied by a C-infinity taper equal to 1 for u <= 3.5 and 0 for u >= 4 (as in round 5). This
replaces Phi by the Mellin transform of the tapered function on both sides of every comparison (the same V enters
P_w and f_w). Control with the taper on [5.5, 6] at Z = 2^10 .. 2^14: abs(delta I) <= 1.2e-3 (0.5 percent of
I_liou), and the remainder I - P moves by at most 1.8e-4, 2 to 4 percent of RP (`taper_cmp.log`).

Use of `rows.c`. The row enumeration (depth-first search over ideals, multiplicativity of chi_c(m) in m, six unit
multiples per pass, sign patterns for the weights) is that of round 5. New in `probe.c`: the fixed phases
conj(xi) conj(chi_.(b*)) conj(G) per index; accumulation by square class of c (for R(A, s_sigma) and for
G(cn^3) = G(c) Gamma(n) R(c, n)); rows restricted to m coprime to 6 in the window; the additive factor from
per-s tables of Gauss sums indexed by the Hermite normal form of sO; the symbol of a row prime at all table primes
by a vectorised double-precision modular power.

Cost, stated before the server runs. Ideals m coprime to 6 with 12 Z < q_m < 30 Z: 0.302 x 18 Z = 5.4 Z passes
(32.6 Z rows m); indices: squarefree c up to 54.6 Z, 15.4 Z; cost 84 Z^2 inner steps per scale, independent of
the number of weights. From a timing run at Z = 2^14 (14 s on 16 cores, 9.2e7 steps per core-second): predicted
3900 s at Z = 2^18, 980 s at 2^17, about 2 hours for the grid. Actual: 2686 s, 732 s; all scales 5900 s of probe
time. Memory below 1 GB.

---

## 2. Second lemma: the principal row, and why the range is pre-asymptotic

**Lemma 2 [ARGUED from (7.1) to (7.5) and table (7.16) at u = 1, j = 0; MEASURED in section 4].** In the exact
Poisson series (7.5), the row u = 1 has a simple pole at w = 1 (the factor zeta^S(w)). Its residue, with the
sum over the frequencies H = a^6 and the index A kept as sums, is

    P_w(X, Y, Z) = W_1^(1) rho_S X^(1/2) sum_A sum_a c_w(A, a) q_A^(-1) V(q_A/Z) W_0~(X q_a^6/q_A),

rho_S = Res zeta_F^S = pi/(6 sqrt 3), W_0~ the planar Fourier transform of W_0(abs(x)^2), and c_w multiplicative
in (A, a) with local values (t = v_p(A), m = v_p(a), Q = q_p):
t = 0: 1 (m = 0), 1 - 1/Q (m >= 1); t = 6r + 1: -w(p) a_p^(2r) Q^(4r) (1 - 1/Q) (m = r), the same times (1 - 1/Q)
(m > r), 0 (m < r); t = 6r + 6: a_p^(2r+2) Q^(4r+4) (1 - 1/Q) (m = r + 1), times (1 - 1/Q) (m > r + 1), 0 otherwise;
all other t: 0; a_p^2 = conj(alpha(p))^6. On squarefree A = c:

    P_w = W_1^(1) rho_S X^(1/2) sum_{c} mu(c) w(c) phi(c) q_c^(-1) V(q_c/Z) sum_a phi(a) W_0~(X q_a^6/q_c) + (A divisible by a sixth power),

phi(a) = prod_{p | a} (1 - 1/q_p). P_w is linear in w and is defined for any weight on indices. The code includes
A = c d^6 for prime d (relative size at most q_d^(-2)).

Relation to the manuscript's signal [PROVED from the formula]. sum_a phi(a) W_0~(T q_a^6) has leading term
(rho_S M(1/6)/6) T^(-1/6) as T -> 0 (the pole of zeta^S(6z) at z = 1/6). Inserting it gives
c_S f_w(Z) of (2.3) and (10.1), c_S = W_1^(1) M(1/6) rho_S^2/6 = 0.0158322 for these tests,
f_w(Z) = kappa_0 Z^(1/6) sum_a h_w(a) q_a^(-5/6) V(q_a/Z), sum h_w(a) q_a^(-s) = H_w(s)/L^S(s, w)
= prod_p (1 - Q^(-2)) (1 - w(p)(1 - 1/Q) Q^(-s) - a_p^2 Q^(2-6s))/(1 - a_p^2 Q^(3-6s)).

**Lemma 3 (frequency count) [PROVED for the support statement; MODEL for the table].** The argument of W_0~ is
T q_a^6 with T = X/q_A >= e^(-4) Z^(-1/2). For a != 1 coprime to 6, q_a >= 7, so T q_a^6 >= 7^6 X/q_A; at q_A = Z this is
3680 (Z = 2^10), 230 (2^18), 3.6 (2^30), 0.9 (2^34). The envelope of W_0~ falls to 10 percent of W_0~(0) at
argument 18 and to 1 percent at 99 (`w0decay.log`). So for Z <= 2^18 the sum over a is its first term
W_0~(X/q_c) (the other terms are 2e-4 of P at Z = 2^18 in the model below), and

    P_w ~ W_0~(0) W_1^(1) rho_S Z^(1/4) sum_c mu(c) w(c) phi(c) q_c^(-1) V(q_c/Z)        (Z^(beta_w - 3/4) in size).

Density model for the Liouville weight (`pasym.py`: sum over squarefree c replaced by its density; it agrees with
the exact P_liou to 0.2 percent at Z = 2^10 and to 0.01 percent at 2^11 and 2^18):

| log2 Z | P_liou | a = 1 term | c_S f_liou | P/(c_S f) | local exponent of P |
|---|---|---|---|---|---|
| 10 | 0.0689 | 0.0689 | 0.0403 | 1.71 | 0.547 |
| 14 | 0.2318 | 0.2318 | 0.1016 | 2.28 | 0.359 |
| 18 | 0.5550 | 0.5549 | 0.2560 | 2.17 | 0.284 |
| 24 | 1.673 | 1.672 | 1.024 | 1.63 | 0.257 |
| 32 | 6.558 | 6.748 | 6.502 | 1.01 | 0.233 |
| 36 | 12.93 | 13.50 | 16.38 | 0.79 | 0.279 |
| 44 | 97.06 | 54.02 | 104.0 | 0.93 | 0.367 |
| 56 | 1670 | 432 | 1665 | 1.00 | 0.343 |
| 80 | 4.263e5 | 2.77e4 | 4.261e5 | 1.00 | 0.331 |

The exponent 1/3 = C(1) and the equality P = c_S f are reached for Z >= 2^44; between 2^20 and 2^32 the local
exponent is 1/4 or less. For a weight with singularity at b the same structure gives b - 3/4 in that range
(0.20 for b = 0.95) and b - 2/3 beyond.

---

## 3. Computation

### 3.1 Weights (14, values +-1; `prep6.py`)

`one`; `liou` (Liouville function of K); `t95a`, `t95b`, `t95c` (THIN, b = 0.95: rational p = 1 mod 3 in S with
probability p^(b-1), one of the two prime ideals above p chosen at random, completely multiplicative; three seeds;
the density fixes the zero at b almost surely, as in round 5); `g95` (the greedy set of c4, known to be biased
mod 3); `t99`, `t97`, `t90` (random THIN, b = 0.99, 0.97, 0.90); `d50a`, `d50b` (half of the prime ideals flipped
at random: no singularity; nulls); `d75` (three quarters flipped: singularity of order 1/2 at 1); `nm50`
(non-multiplicative: Liouville on a random half of the indices, independent random signs on the other half; Mertens
sum half of Liouville's: the referee's control of round 5); `iid` (independent random signs).

### 3.2 Validation

* **Ball arithmetic (`arb_probe.py`, python-flint, 120 bits).** Independent of `probe.c` and of the decompositions
  in `prep6.py`: lattice loop over m, symbols by numpy modular powers, xi(A), chi_A(b*), G(A), R(A, s) evaluated on
  the element A = c n^3, Gauss sums from the definition per row, coefficients as acb balls replaced by exact
  integer midpoints (scale 2^-44, radius 2^-43) with exact integer index sums. Shared: the table of gamma_2 (used
  to pick the cube root of mu(c) alpha(c)) and the definition of the weights.
  Z = 1024 (27354 rows, 15904 indices): I_liou in 0.063012261 +- 1.4e-8 (float64: 0.0630122612036);
  I_t95a in (-0.005381007 +- 1.4e-8) + (-0.006755966 +- 1.4e-8) i (float64: -0.0053810070 - 0.0067559659 i);
  also `one`, `t95b`. Z = 256: six weights, radii below 7e-9. All float64 values lie in the balls; sum abs(a)^2
  agrees to 1e-15.
* **Server against local.** Z = 1024 and 2048 on the server (16 OpenMP threads, gcc, AVX-512) and on the Mac (one
  thread, clang): I agrees to 3e-16.
* **Structural check of the reading.** With (bar alpha, bar G): I_liou/P_liou = 0.96 at Z = 2048 and 1.000 +- 0.001
  pooled. This tests every normalisation in (6.1) at once (tau, xi, Xi, R, G, the Gauss sums, c_S), since any
  missing phase removes the reciprocal of the target from row u = 1.

### 3.3 Runs

Local: `scripts/memcap.sh 8`, single process; `prep6.py` + `probe` at Z = 256, 1024, 2048 (4 s), the four
variants, the taper control at Z = 256, `arb_probe.py` (27 s at Z = 1024), `pasym.py`, `w0decay.py`.
Server, through `rhrun` only (rhstatus checked before each launch; 16 cores each, one at a time):
`rh-c6p61-t-1118175149` (timing, 4 scales, 25 s), `rh-c6p61-A-1118175227` (12 GB cap, 27 scales Z <= 2^17,
31 minutes), `rh-c6p61-B-1118182402` (16 GB cap, Z = 185364 and 262144 from the extended table, 68 minutes),
`rh-c6p61-C-1118193239` (taper control, 2 minutes). One earlier unit `rh-c6p61-t-1118174110` exited at start
(script not yet copied; its failed state was reset). No GPU use. No unit of this lane is left running. The two
Gauss-sum tables of round 5 were copied from `~/rh-push/c5-thin-propd-dichotomy/data/` into this lane's server
directory, read, and the copies deleted afterwards; nothing else outside the lane directory was touched.

---

## 4. Results

Files: `analysis.log` (all tables), `fits.json` (fits and every record), `srv/` (raw outputs and side files).
Notation: F = c_S f_w; D = I - F; R = I - P; CS = sum_sigma norm(a_sigma) norm(B_sigma); RP = (sum_m
abs(sum_sigma xi(m) a_{m,sigma} B_{m,sigma})^2)^(1/2), the size of I if the rows had independent phases.

### 4.1 The two norms (weight 1) and the scale of the remainder

| Z | s-values | rows m | sum abs(a)^2 | norm(A_0)^2/(Q/Y) | norm(B_one)^2/Z | CS | RP |
|---|---|---|---|---|---|---|---|
| 1024 | 9 | 27354 | 9.568e-04 | 0.213 | 5.987 | 2.354 | 0.00713 |
| 4096 | 19 | 127872 | 5.067e-04 | 0.255 | 7.012 | 3.422 | 0.00536 |
| 16384 | 39 | 489732 | 2.405e-04 | 0.233 | 6.701 | 5.113 | 0.00367 |
| 65536 | 80 | 2116020 | 1.215e-04 | 0.254 | 7.253 | 7.576 | 0.00260 |
| 131072 | 108 | 4209780 | 8.572e-05 | 0.252 | 7.218 | 9.005 | 0.00220 |
| 262144 | 150 | 8394228 | 6.051e-05 | 0.250 | 7.197 | 10.677 | 0.00184 |

Weight 1 reproduces the manuscript's two bounds: norm(A_0)^2 = 0.25 Q/Y (Lemma 6.2: << Q/Y), sum abs(B)^2 = 7.2 Z
on the rows of the probe (Lemma 5.8: Z^(1+epsilon); fitted exponent 1.035 +- 0.006 on all scales, 1.020 +- 0.006
on the upper half), CS = 0.42 to 0.47 times Z^(1/4) (exponent 0.286 +- 0.005, 0.263 +- 0.004). I_one itself is at
the level RP: abs(I_one) <= 0.0136 at all scales, exponent -0.08 +- 0.09 (all), -0.29 +- 0.15 (upper half);
abs(I_one)/CS between 9e-5 and 6e-3. RP has exponent -0.242 +- 0.004.

### 4.2 The three weights of the assignment and the controls (octave rows; all 29 scales in `analysis.log`)

| Z | I_liou | P_liou | F_liou | I_t95a | P_t95a | F_t95a | I_one | P_one |
|---|---|---|---|---|---|---|---|---|
| 1024 | +0.06301 | +0.06871 | +0.04031 | -0.00538-0.00676i | -0.00765 | -0.00393 | -0.00297 | -0.00349 |
| 4096 | +0.13775 | +0.13469 | +0.06399 | -0.01149-0.00390i | -0.01350 | -0.00637 | -0.00053 | -0.00428 |
| 16384 | +0.22945 | +0.23178 | +0.10148 | -0.02340+0.00047i | -0.02137 | -0.00952 | -0.00493 | -0.00374 |
| 65536 | +0.37141 | +0.36776 | +0.16088 | -0.03151-0.00199i | -0.03117 | -0.01393 | -0.00480 | -0.00271 |
| 131072 | +0.44856 | +0.45390 | +0.20265 | -0.03813+0.00017i | -0.03697 | -0.01683 | -0.00438 | -0.00209 |
| 185364 | +0.50214 | +0.50243 | +0.22748 | -0.03939-0.00070i | -0.04030 | -0.01849 | -0.00087 | -0.00188 |
| 262144 | +0.55674 | +0.55512 | +0.25536 | -0.04226-0.00022i | -0.04380 | -0.02032 | -0.00392 | -0.00165 |

Second and third THIN seeds at Z = 262144: I_t95b = -0.04217 + 0.00017i against P = -0.04246;
I_t95c = -0.06124 + 0.00122i against P = -0.05963. Non-multiplicative control: I_nm50 = +0.27696 + 0.00062i
against P = +0.27686. Nulls: I_d50a = +0.00080 + 0.00081i, I_iid = +0.00001 - 0.00169i (RP = 0.00184).

Fitted exponents in Z (least squares in log Z, standard error from the residual scatter; "all" = 29 scales,
"upper" = the 15 scales Z >= 2^13.75), pooled coefficient r_P of I on P, and remainder statistics:

| weight | abs(I) all | abs(I) upper | abs(I - F) all | abs(I - F) upper | abs(P) upper | abs(I - P) all | r_P (se) | rms abs(I - P)/RP | lag-1 corr. | exponent of norm(B_w)^2/norm(B_one)^2, upper, x 10^3 |
|---|---|---|---|---|---|---|---|---|---|---|
| one | -0.084 (0.090) | -0.293 (0.145) | -0.180 (0.110) | -0.243 (0.292) | -0.282 | -0.18 (0.10) | +1.266 (0.146) | 0.79 | -0.07 | 0 |
| liou | +0.383 (0.010) | +0.313 (0.005) | +0.436 (0.020) | +0.297 (0.009) | +0.320 | -0.11 (0.12) | +1.000 (0.001) | 1.39 | +0.21 | +36.88 (7.94) |
| t95a | +0.300 (0.017) | +0.228 (0.025) | +0.291 (0.030) | +0.190 (0.044) | +0.263 | -0.16 (0.07) | +1.002 (0.015) | 0.83 | +0.32 | +0.03 (0.26) |
| t95b | +0.344 (0.026) | +0.209 (0.017) | +0.376 (0.056) | +0.150 (0.029) | +0.272 | -0.19 (0.08) | +0.986 (0.015) | 1.00 | +0.45 | +0.27 (0.14) |
| t95c | +0.331 (0.017) | +0.260 (0.013) | +0.351 (0.029) | +0.239 (0.023) | +0.273 | -0.09 (0.07) | +0.994 (0.011) | 0.88 | +0.13 | +0.29 (0.14) |
| g95 | +0.374 (0.034) | +0.254 (0.013) | +0.369 (0.036) | +0.225 (0.021) | +0.279 | -0.27 (0.06) | +1.010 (0.010) | 0.96 | +0.24 | +0.62 (0.19) |
| t99 | +0.285 (0.070) | +0.292 (0.052) | +0.148 (0.069) | +0.269 (0.105) | +0.275 | -0.19 (0.06) | +0.936 (0.035) | 0.94 | +0.34 | +0.05 (0.13) |
| t97 | +0.354 (0.024) | +0.311 (0.015) | +0.366 (0.041) | +0.309 (0.030) | +0.298 | -0.15 (0.07) | +0.985 (0.018) | 0.70 | +0.40 | +0.36 (0.15) |
| t90 | +0.250 (0.028) | +0.254 (0.018) | +0.263 (0.076) | +0.254 (0.034) | +0.249 | -0.29 (0.08) | +1.020 (0.016) | 0.97 | +0.23 | +0.47 (0.14) |
| d50a | -0.295 (0.055) | -0.263 (0.123) | -0.298 (0.055) | -0.248 (0.137) | (small) | -0.31 (0.05) | +0.36 (0.49) | 0.76 | +0.17 | -0.25 (0.21) |
| d50b | -0.289 (0.063) | -0.075 (0.111) | -0.331 (0.067) | -0.145 (0.148) | (small) | -0.33 (0.07) | +0.66 (0.59) | 1.06 | +0.40 | -0.06 (0.20) |
| nm50 | +0.395 (0.012) | +0.312 (0.006) | +0.457 (0.025) | +0.293 (0.010) | +0.324 | -0.27 (0.08) | +1.001 (0.002) | 0.93 | +0.32 | +8.12 (1.91) |
| iid | -0.310 (0.053) | -0.317 (0.141) | -0.335 (0.058) | -0.287 (0.155) | (small) | -0.33 (0.09) | +0.71 (0.30) | 1.10 | +0.24 | +0.11 (0.13) |
| d75 | +0.326 (0.010) | +0.287 (0.007) | +0.365 (0.020) | +0.286 (0.013) | +0.282 | -0.28 (0.12) | +0.996 (0.003) | 0.97 | +0.08 | +3.80 (0.85) |

Readings.
* **Remainder.** For all 14 weights the remainder I - P is of the size RP (rms ratio 0.70 to 1.10; Liouville 1.39,
  with two excursions, 4.3 RP at Z = 11585 and 2.5 RP at Z = 131072, not explained), and decays (exponent between
  -0.09 and -0.33, standard errors 0.05 to 0.12; RP: -0.242 +- 0.004). chi^2 of I = P with RP as the standard
  deviation per component: 28 to 70 on 58 degrees of freedom (Liouville 112); chi^2 of I = 0: 4194 to 8373 for the
  three THIN seeds, 32 to 75 for the nulls. THIN remainders are not larger than those of the nulls.
* **Signal.** The coefficient of P is 1 within 1.5 percent for THIN b = 0.95 (three seeds and the greedy set),
  within 0.1 percent for Liouville, 0.2 percent for the non-multiplicative control. At Z = 2^18 the THIN signal is
  23 to 32 times RP.
* **abs(I - F)/abs(F)** is 1.1 to 1.3 at the upper scales for liou, nm50, d75 and the THIN weights (1.18, 1.18,
  1.08 to 1.21 at Z = 2^18): the literal comparison (2.5) is not yet in its asymptotic regime for any weight
  (Lemma 3). Its fitted exponent equals that of F and P within errors.
* **Ordering in b** (upper-half exponent of abs(P)): 0.249 (b = 0.90), 0.263 to 0.273 (0.95), 0.298 (0.97),
  0.275 (0.99, small amplitude), 0.320 (Liouville); differences follow b with the common transient of Lemma 3.
* **Row norms.** sum abs(B_w)^2 on the rows of the probe (m coprime to 6, 12 Z < q_m < 30 Z): THIN equals weight 1
  to within 0.06 percent at Z = 2^18 with ratio exponent below 7e-4. Liouville is **below** weight 1 (ratio
  0.983 at 2^10, minimum 0.838 at 2^15, 0.974 at 2^18); nm50 and d75 follow with the squares of their Mertens
  ratios (0.975, 0.988 at 2^17). The coherent component found in round 5 on the rows q_m <= Z enters the
  probe's row set with a negative sign in this range and is not monotone. No growth of sum abs(B)^2 beyond that of
  weight 1 is visible for any thin weight.
* **Distance from the Cauchy-Schwarz bound.** abs(I)/CS at Z = 2^18: 0.053 (liou), 0.0040 to 0.0062 (THIN 0.95),
  0.0004 (one), 0.0001 to 0.0002 (nulls). For Liouville the ratio grows from 0.027 to 0.053 (upper-half exponent
  +0.031 +- 0.006); for THIN it is flat (-0.05 to 0.00, standard errors 0.02).

### 4.3 The pre-registered statistics and thresholds

| statistic | value | threshold | outcome |
|---|---|---|---|
| exponent of abs(I_eps), b = 0.95, three seeds | 0.300 +- 0.017, 0.344 +- 0.026, 0.331 +- 0.017 (all); 0.228 +- 0.025, 0.209 +- 0.017, 0.260 +- 0.013 (upper) | 1/4 + epsilon | holds on the upper half; the all-scale values exceed 1/4 through the transient of Lemma 3 (Liouville: 0.383, 0.313; model 0.55 falling to 0.28). In size abs(I_eps) <= 0.007 CS. Not an asymptotic decision. |
| exponent of abs(I_liou) | 0.383 +- 0.010 (all), 0.313 +- 0.005 (upper) | 1/4 + epsilon; asymptotic value 1/3 | above 1/4 in the range, but the model puts the local exponent at 1/4 or below for 2^20 <= Z <= 2^32. No violation of the bound in size. |
| exponent of abs(I_one) | -0.08 +- 0.09, -0.29 +- 0.15 | 1/4 + epsilon | holds |
| exponent of abs(I - c_S f) (high-comparison quantity), eps / liou / one | 0.29 to 0.38 (all), 0.15 to 0.24 (upper) / 0.436, 0.297 / -0.18 | below C(b) = 0.2833 for eps, 1/3 for liou | not interpretable in the range: abs(I - c_S f) = 1.1 to 1.3 abs(c_S f) for every weight with a signal (item 3 of the verdict) |
| E_eps = exponent of sum abs(B_eps)^2 | 1.036 +- 0.006 (all), 1.020 +- 0.006 (upper); minus E_one: (0.0 to 0.8) x 10^-3 | condition (N): >= 2b - 5/6 = 1.0667 | not seen in the range |

Standard errors come from the scatter of the fit. Adjacent scales share rows, s-values and index terms; the
lag-1 correlation of the normalised remainders is 0.1 to 0.45, so the effective number of scales is smaller than
29 and the quoted errors are optimistic by a factor up to about 1.6.

---

## 5. Controls

| control | expectation | outcome |
|---|---|---|
| w = 1 | manuscript's sizes: norm(A)^2 << Q/Y, sum abs(B)^2 << Z^(1+epsilon), abs(I) << Z^(1/4+epsilon); no signal | 0.25 Q/Y; 7.2 Z (exponent 1.02 to 1.035); abs(I_one) at the level RP ~ Z^(-0.24), 4e-4 of CS at 2^18 |
| non-multiplicative sign weight with large Mertens sum (`nm50`, referee's control) | if the signal is a linear functional of the weight: I = P with the same law | r_P = 1.001 +- 0.002; remainder rms 0.93 RP. The principal term does not require a multiplicative weight |
| second and third random THIN seeds (`t95b`, `t95c`) | same law | r_P = 0.986 +- 0.015, 0.994 +- 0.011; remainders 1.00, 0.88 RP |
| greedy THIN set (`g95`, biased mod 3) | possibly extra terms in unit rows | r_P = 1.010 +- 0.010, remainder 0.96 RP: no visible difference from the random sets |
| nulls (`d50a`, `d50b`, `iid`) | no signal, abs(I) ~ RP | chi^2(I = 0) = 32, 66, 75 on 58; exponents of abs(I): -0.30, -0.29, -0.31 |
| THIN at b = 0.90, 0.97, 0.99 | same law, amplitude ordered in b | r_P = 1.020 +- 0.016, 0.985 +- 0.018, 0.936 +- 0.035 |
| conjugation variants at Z = 2048 (`variants_2048.log`) | only the reading with conj(alpha), conj(G) contains the reciprocal of the target | I_liou = 0.0941 (bar, bar; P = 0.0982) against 0.0075, -0.0053, 0.0015 for the other three |
| taper of V_G moved from [3.5, 4] to [5.5, 6], Z = 2^10 .. 2^14 | no effect on the remainder | abs(delta(I - P)) <= 1.8e-4 |
| ball arithmetic at two (weight, Z) points | float64 inside the enclosure | (liou, 1024), (t95a, 1024): radii 1.4e-8; also 8 further points |

The campaign controls (DH, backward heat, sign twist, unimodular twist, zeta(s+a) zeta(s-a), T-NR, Beurling,
phase-rotated transfer operator, theta^w) do not apply: no statement about zeros of zeta is made. THIN and the
Liouville weight are members of the classes TW- and U.

---

## 6. Outcome for Proposition D and the R3 location

1. **High half, measured form.** I_w = P_w + O(RP) holds for THIN with the same remainder as for the periodic
   weight 1, the nulls, and a non-multiplicative weight. The decomposition is linear in w; multiplicativity of the
   weight is used only to identify P_w with the reciprocal 1/L(s, w) (Lemma 7.1), and periodicity is used nowhere
   in what was measured. [MEASURED, Z <= 2^18.]
2. **What the high comparison of the manuscript needs beyond this.** A bound abs(R_eps) << Z^(b - 2/3 - sigma) for
   Z -> infinity. The manuscript proves the analogous bound for Hecke characters through Lemmas 4.8, 8.1, 17.5
   (c4, section 3.1), which are not available for eps. Measured: abs(R_eps) ~ RP ~ Z^(-0.24), a margin of 0.52 in
   the exponent, in a range where the rows u != 1 that contribute have norm up to about Z^(1/2). [OPEN.]
3. **Low half.** In the range the low estimate holds for every weight, with a factor 19 (Liouville) and 160 to
   250 (THIN) between abs(I) and the Cauchy-Schwarz value, and the row norm of THIN equals that of weight 1. Its failure for THIN is forced only through
   Proposition D once item 2 is granted, and only asymptotically: the principal term reaches Z^(b - 2/3) for
   Z >= 2^36 and exceeds Z^(1/4) by the exponent b - 11/12 = 1/30.
4. **Location.** The periodicity input is in the low half (the row bound (5.36) behind Proposition 6.3). This is
   the conclusion of round 5, now with the probe measured (the referee's objection E1 there: the row moment does
   not decide which statement about I_eps fails). It remains conditional on item 2.
5. **Correction to the picture of round 5.** The growth of the row moment relative to weight 1 is not present in
   the probe's own row set in this range, even for Liouville (ratio below 1). Condition (N) cannot be tested on
   those rows below Z ~ 2^36.

### Round-7 deepen items

* **LIOU-HIGH (paper proof, decidable).** Prove the high comparison for the Liouville weight inside the
  manuscript's framework: L(x, liou chi_u) = L(2x, chi_u^2)/L(x, chi_u), so 1/L(x, liou chi_u) =
  L(x, chi_u)/L(2x, chi_u^2) is holomorphic for Re x > 1/2 and needs no zero detector; the rows u != 1 are bounded
  by moments of L(x, chi_u) over the sextic family (Lemma 9.1) and convexity. Outcome: I_liou = c_S f_liou +
  O(Z^(1/3 - sigma)), f_liou of exact order Z^(1/3), hence the low estimate and the row bound (5.36) are false for
  a completely multiplicative unimodular non-periodic weight. That turns "periodicity is necessary for (5.36)"
  into a theorem relative to the manuscript's identities (7.5), (7.13). The numerical law of this lane
  (r = 1.000 +- 0.001) is the check of every constant in that proof.
* **THIN-HIGH.** The same for the class-regular THIN of `c5-thin-walk-replay` Theorem 2: the only new input is a
  bound for sum_{p in S} chi_u(p) q_p^(-x) on Re x = b + delta, on average over u, which Lemma 9.1 supplies for
  arbitrary coefficients. Outcome: Proposition D resolved for THIN (low half false) as a theorem, or the first
  row range in which the remainder is not controlled.
* **Sign of the coherent term on masked rows.** Derive the coefficient of M_w^2 in sum abs(B_w)^2 over the rows of
  the probe (m coprime to 6, annulus); measured negative (-16 percent at Z = 2^15 for Liouville) against positive
  on the ball q_m <= Z (round 5). Decides whether condition (N) is to be read on the full ball only.
* No compute lane at larger Z: the regime starts at Z ~ 2^36 and the cost is 84 Z^2.

---

## 7. Requirement flags

This lane measures a control against the 7/8 architecture; it is not an attack on a zero statement. All four flags
are false in the structured result.

* R1 (multiplicativity essential): not established. Measured in the opposite direction for the high half: the
  principal term is a linear functional of the weight and is present with coefficient 1.001 +- 0.002 for a
  non-multiplicative weight.
* R2 (height-uniform, every window): not applicable.
* R3 (every control fails at a named step): one control (THIN) examined; the failing step is located in the low
  half conditionally on an unproved remainder bound (section 6, item 2). Other controls not rerun.
* R4 (reaches the critical line): none. The lane adds a quantitative fact about the present mechanism: at
  X = Y = Z^(1/2) its signal exponent beta - 2/3 is attained only for Z >= 2^36.

---

## 8. Three weakest steps

1. **Extrapolation of the remainder.** "The high half holds for THIN" is measured for Z <= 2^18, where one
   sixth-power frequency contributes and the rows u != 1 have small norm. The asymptotic statement needs a bound
   for the remainder that the manuscript obtains from Hecke-character lemmas not available for eps. The location
   of the periodicity input in the low half is therefore conditional. RP as the scale of the remainder is
   empirical (rms 0.70 to 1.10 across weights); the two Liouville excursions (4.3 and 2.5 RP) are unexplained.
2. **Reading and reduction of (6.1).** The bars on alpha and G are chosen by the cancellation of Section 7.2 and
   by the variant test, not read from a typeset source. S = {2, lambda} with P_0 = 4 (the manuscript takes P_0
   large so that (2.2) holds; H_w is used here as computed). V_G is tapered at u in [3.5, 4]. W_0, W_1 are one
   choice. Lemma 2 is read from table (7.16) and (7.1) to (7.5), not re-derived; indices divisible by a sixth power
   are included only for prime sixth powers. Its agreement with I (0.1 percent for Liouville) supports all of
   these jointly, not separately.
3. **Statistics and arithmetic.** Exponent fits are over at most a factor 256 in Z on quantities with a known
   transient; the scales are correlated (lag-1 0.1 to 0.45), so standard errors are optimistic by up to 1.6.
   float64 throughout except the ball checks at Z = 256 and 1024, which take the branch of gamma_2 from the float64
   table. The THIN sets are random with density p^(b-1) (zero at b almost surely), not the class-regular
   construction for which the continuation theorem is proved; the density model of Lemma 3 is for Liouville only.

---

## Files

`RESULT.md`; code `prep6.py` (input, signal f_w, principal term P_w), `probe.c`, `arb_probe.py`, `analyze6.py`,
`show.py`, `pasym.py`, `w0decay.py`, `taper_cmp.py`, `variant_show.py`, `run_srv.sh`; outputs `analysis.log`,
`fits.json`, `arb_1024.{json,log}`, `arb_256.{json,log}`, `pasym.{json,log}`, `w0decay.log`, `taper_cmp.log`,
`variants_2048.log`; `srv/out_G_<Z>.txt` and `srv/in_G_<Z>.bin.side.json` (29 scales), `srv/*_U6_*` (taper
control); `srv_logs/` (the four server logs); `data/` (local runs at Z = 256, 1024, 2048).

Reproduce the tables: `python analyze6.py srv G --json fits.json`; one scale:
`python prep6.py <table.npz> <Z> in.bin && ./probe in.bin out.txt`.
