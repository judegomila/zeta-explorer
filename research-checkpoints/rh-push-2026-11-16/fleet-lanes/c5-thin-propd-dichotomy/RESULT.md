# c5-thin-propd-dichotomy: which half of the 7/8 mechanism fails for the THIN control

Date 2026-11-18. Slug `c5-thin-propd-dichotomy`. Kind: compute (heavy lane). Scope: this directory and
`~/rh-push/c5-thin-propd-dichotomy/` on the compute server. Not refereed. Nothing committed or pushed.
No statement about zeros of zeta is made. RH open. The 7/8 manuscript (`~/lean-deps/qrh-verify/paper.txt`, unrefereed;
its section, lemma and equation numbers are used below) is treated as text. NO QED.

Labels: PROVED / CLASSICAL / ARGUED (read from the manuscript, not replayed) / MEASURED (float64, full enumeration of
rows; the two smallest scales also in ball arithmetic) / HEURISTIC / OPEN.

## Verdict

Partial result (MEASURED, with a HEURISTIC law that organises it). For the THIN control (eps completely
multiplicative, -1 on a regular set of prime ideals of exponent b, L(s, eps) = zeta_K(s) G(s), simple zero at b), the
half of the Proposition D dichotomy that fails is the **low estimate** (the row moment bound (5.36) obtained from the
row reflection, Proposition 5.1 / Lemma 5.8). The lattice-periodicity input sits in that half.

1. **What was measured.** The completed cubic theta row C_V(Z; m, w) of (5.30) for 14 weights w, all rows
   0 < N(m) <= Z, 18 scales for the manuscript's Gaussian test (Z = 2^10 .. 2^18.5, factor 362) and 23 scales for a
   compact test (Z = 2^10 .. 2^21, factor 2048; 7.6 million rows at the top scale).
2. **Weight 1 reproduces the known row size.** MS_one(Z) = sum_m |C|^2 has exponent 1.0018 +- 0.0005 (Gaussian test)
   and 1.0011 +- 0.0002 (compact test) in Z, and equals the diagonal sum to within 1.1 percent from Z = 2^12 on
   (within 2 standard errors below that).
3. **The mechanism is visible.** The rows of every non-periodic completely multiplicative weight contain one common
   component: C_w(m) = M_w(Z) u(m) + (generic part), with M_w(Z) = sum_c mu(c) w(c) q_c^(-1/2) V(q_c/Z) the
   Mertens-type sum of the weight and u(m) the same for all w. Its energy is kappa(Z) M_w(Z)^2, and kappa grows:
   exponent 0.177 +- 0.016 in Z (compact test), 0.182 +- 0.009 (Gaussian test); 0.13 to 0.20 in the collapse
   variable Z^2/M over 24 octaves; the count of sixth-power dual frequencies predicts 1/6. For the
   Liouville weight (b = 1) this term is 77 percent of the diagonal at Z = 2^21 (compact test) and 136 percent at
   Z = 2^18.5 (Gaussian test), and growth faster than the row bound is seen directly (exponent of MS_liou - D:
   1.177 +- 0.016 and 1.182 +- 0.009 against 7/6).
4. **THIN, b = 0.95.** Regression of the rows of eps on the coherent part of the Liouville rows gives
   rho = -0.1070 +- 0.0005 at Z = 2^21 against M_eps/M_liou = -0.1017; pooled over 21 scales
   r = rho M_liou/M_eps = 1.047 +- 0.003. The hypothesis "no coherent component" (high side false, low side true)
   has chi^2 = 124551 on 21 scales against 10.8 for the fitted constant. The coherent part of MS_eps has exponent
   1.077 +- 0.012 in Z (Gaussian test, 16 scales) and 1.087 +- 0.022 (compact test, 19 scales); asymptotic value
   under low-side failure 2b - 5/6 = 1.0667; the row bound allows 1 + epsilon. The exponent depends on the window
   through the staircase in kappa (range 1.045 to 1.113 over the windows tried). b = 0.90: 0.988 +- 0.014 and
   0.977 +- 0.019 (0.9667). The sign change at b = 11/12 is reproduced.
5. **The assigned statistic (exponent of MS_eps/MS_one) has no power at these scales.** It is +0.0005 +- 0.0003
   (b = 0.95, compact test) and +0.0012 +- 0.0007 (Gaussian test), which a literal reading would place on the
   high-side-failure value 0, 90 to 200 standard errors from 2(b - 11/12) = 0.0667. That reading is wrong: the
   coherent part is 0.9 percent (compact, Z = 2^21) to 1.8 percent (Gaussian, Z = 2^18.5) of MS_eps, its own
   contribution to the raw exponent is 0.0005 to 0.003, and the generic off-diagonal part (-0.1 to -0.9 percent of
   the diagonal, slowly varying) is of the same size. The coherent part reaches the size of the diagonal only for
   Z of order 10^30 or more.
6. **Controls.** Non-multiplicative sign sets of the same density (shuffled eps, i.i.d. signs) and a random
   multiplicative weight with half the primes flipped have no coherent component beyond their own small M_w.
   Random prime sets of the same density as the thin set have it with the same constant (the zero at b is a
   property of the density). With alpha in place of conj(alpha) in the row, the Liouville excess disappears.

What is not established: the manuscript's high comparison for I_eps (the probe (6.1) with its s-average and
corrections) was not computed; the persistence of kappa(Z) ~ Z^(1/6) and of the regression law beyond Z = 2^21 is
measured only inside the range; "(5.36) is false for eps" is therefore an extrapolation supported by the measured law,
not an observed excess over a Z^(1+epsilon) bound (for Liouville the growth is seen directly in the total).

---

## 0. Plan

Read: BRIEF; OBSTRUCTION_MAP section 2 (control THIN), rows Z15, Z18, item 22 of section 6;
`c4-thin-twist-control-78/RESULT.md` and `REFEREE.md`; manuscript Sections 5.1, 5.5, 6.1, 6.2, 7.1, 7.2 (statements).

New relative to the map: c4 proved that the low estimate and the high comparison cannot both hold for the eps-probe
(Proposition D) and left open which fails. This lane measures the row moment that the low estimate bounds.

Decisive first test (as assigned): mean square over m of the row with weight eps (b = 0.95, 0.90) against weight 1 at
four or more scales spanning a factor of at least 64; failure of the low estimate predicts growth Z^(2(b - 11/12))
of the ratio. Outcome: computed at 18 and 23 scales; the ratio exponent is zero within 0.0012 +- 0.0007; section 3.2 shows
that this statistic cannot separate the two cases below Z ~ 10^30. Pivot (one, as allowed): from the total mean
square to the component of the rows that carries the Proposition D growth (sections 1.3, 3.3, 3.4). That test
decides.

Tools: `tmp/sextic` (zomega.py, alib.py, build_table.py, gauss6.c) copied into `sextic/`; new code `prep.py`,
`rows.c`, `verify_arb.py`, `analyze.py`, `analyze2.py`, `collapse.py`, `thin_check.py`.

---

## 1. First lemma: the row with a weight, the two predictions, the coherent term

### 1.1 The row

O = Z[omega], S = {2, lambda}, lambda = 1 + 2 omega. c runs over squarefree primary elements prime to 6, n over
primary elements prime to 2, q_a = N(a), alpha(a) = a/|a|, chi_a = sextic symbol (zero at non-units), gamma_2 the
normalised cubic Gauss sum (gamma_2(c)^3 = mu(c) alpha(c), (4.7); checked on 282269 moduli to 7e-9). For a weight w
on indices A = c n^3 and a test V,

    C_V(Z; m, w) = sum_{c, n} gamma_2(c) conj(alpha(c n^3)) w(c n^3) chi_{c n^3}(m) q_c^(-1/2) q_n^(-1) V(q_c q_n^3 / Z)      (1)

This is (5.30) with nu = w. (The text file shows alpha(cn^3); the factors D(s, Psi), L_0(s, Psi) of Proposition 5.1
carry conj(alpha), and the product T = L_0 D forces the conjugate in (5.30). Section 3.5 gives a numerical control.)
Mellin form (5.31): C_V = (1/2 pi i) int V^(s - 1/2) Z^(s - 1/2) T(s, w chi_.(m)) ds,
T = L_0 D, D = sum_c gamma_2(c) conj(alpha(c)) w(c) chi_c(m) q_c^(-s),
L_0 = sum_n conj(alpha(n))^3 w(n)^3 chi_n(m)^3 q_n^(-3s + 1/2). In the probe, B_{m,sigma}(Z) is a fixed finite
combination of such rows with V = V_G, V_G(y) = exp(-(log y)^2/4)/(2 sqrt(pi)) (Section 6.1).

### 1.2 The two predictions

(a) **w = 1, or any finite-ray character [ARGUED from the manuscript].** phi(x) = chi_x(lambda)^2 w(x) is L-periodic,
T is entire and has the reflection of Proposition 5.1, and Lemma 5.8 at M = N = 1 gives

    MS_w(Z) := sum_{0 < q_m <= C Z} |C_V(Z; m, w)|^2 << Z^(1 + epsilon).                                              (2)

(b) **w = eps_K (THIN, split variant of c4; zero of L(s, eps) at b).** eps is not periodic (Lemma N of c4), no L
exists, T(s, eps chi_.(m)) is given only for Re s > 1 and the reflection is unavailable. Proposition D of c4: the low
estimate I_eps << Z^(1/4 + epsilon) and the high comparison I_eps = f_eps + O(Z^(C(b) - sigma)), f_eps not
O(Z^(b - 2/3 - delta)), are not both true when b > 11/12. The low estimate is Cauchy-Schwarz,
|I| <= Q^(-1/2) ||A|| ||B||, with ||A||^2 << Q/Y unconditional (Lemma 6.2, any weight) and ||B||^2 = MS. So:

* **Low side fails (high comparison true):** MS_eps(Z) is not O(Z^(1 + 2(b - 11/12) - delta)): growth
  Z^(2(b - 11/12)) relative to weight 1. b = 0.95: +0.0667. b = 0.90: no constraint (-0.0333). b = 1 (Liouville
  weight, pole of zeta_K(x)/zeta_K(2x) at 1): +0.1667.
* **High side fails (low estimate true for eps):** MS_eps << Z^(1 + epsilon), ratio exponent 0, and the pairing with
  the manuscript's test vector does not see the zero at b.

### 1.3 The coherent term [HEURISTIC derivation; MEASURED in section 3]

Expand |C|^2 over pairs (c, c') and apply Poisson summation in m to sum_m chi_c(m) conj(chi_c'(m)) (modulus cc' of
norm about Z^2, rows of norm up to M). The dual frequencies H have norm up to about Z^2/M, and the pair term is

    (M/(q_c q_c')) [gamma_2(c) conj(alpha(c)) gamma_1(c) w(c)] conj[same at c'] conj(chi_c(H)) chi_c'(H) (ray signs) W~(M q_H/(q_c q_c')).

By (4.7), gamma_1(c) gamma_2(c) conj(alpha(c)) = mu(c) G(c), with G(c) = chi_c(4) gamma_3(c) a function of a finite
ray class. On the frequencies H = h_0 a^6 (h_0 a fixed S-unit that cancels the ray function, a any ideal generator)
the character chi_c(H) no longer depends on c beyond a ray class, and the double sum is a square:

    MS_w(M, Z) = D(M, Z) + (M/Z) M_w(Z)^2 N(Z^2/M) + (generic),     M_w(Z) = sum_c mu(c) w(c) q_c^(-1/2) V(q_c/Z),      (3)

D the diagonal (the same for all unimodular w), N(Y) the weighted number of frequencies h_0 a^6 of norm up to about
Y, N(Y) ~ Y^(1/6) on average (a staircase: one step per ideal a). At M = Z: coherent term kappa(Z) M_w(Z)^2 with
kappa ~ Z^(1/6).

Consequences of (3), if it holds:
* w = eps with a zero at b: M_eps(Z) ~ c_b Z^(b - 1/2) (c4 Theorem 1(v) gives the Omega-statement; measured there
  and here), so the coherent term is Z^(2b - 5/6) = Z^(1 + 2(b - 11/12)). This is the Proposition D rate, located in
  the row moment. It exceeds (2) exactly when b > 11/12.
* w a finite-ray character: (2) and (3) give M_w(Z) << Z^(5/12 + epsilon), that is, 1/L(s, w) has no pole in
  Re s > 11/12. In this form Part I of the manuscript reads: the row reflection bounds the row moment, and the row
  moment contains the Mertens sum of the target with weight Z^(1/6). (The manuscript does not argue this way; it
  uses the bilinear probe (6.1), in which the extraction of the frequencies a^6 is exact. (3) is the same
  bookkeeping for the quadratic form and is not proved here.)
* In (3) the two halves of the dichotomy are separated at finite Z: under high-side failure the rows of eps have
  no component along the common profile u; under low-side failure they have it with amplitude M_eps(Z).

Test implied by (3): with a reference weight v that has a large Mertens sum (Liouville),

    rho_w := Re(X_wv - Dx_wv) / (X_vv - Dx_vv),     X_wv = sum_m C_w(m) conj(C_v(m)),  Dx = cross diagonal,              (4)

and (3) predicts rho_w = M_w(Z)/M_v(Z); absence of the coherent component gives rho_w = 0.

---

## 2. Computation

**Rows.** All m in O with 0 < N(m) <= Z (sharp cutoff, C_m = 1), 3.63 Z rows. Tests: G: V_G times a C-infinity
taper equal to 1 for u = log(q_c q_n^3/Z) <= 3.5 and to 0 for u >= 4 (the taper changes V_G where V_G <= 0.013;
it makes the index set finite: q_c q_n^3 <= 54.6 Z); C: V = exp(1 - 1/(1 - (u/1.5)^2)) on |u| < 1.5. Both are
admissible in Lemma 5.8. Scales: half-octaves; G: Z = 2^10 .. 2^17 from the existing table of Gauss sums to norm
10^7 and Z = 2^17.5, 2^18, 2^18.5 from a table extended to norm 2.03e7 (311,000 further split primes by `gauss6.c`;
gamma_2(c)^3 = mu(c) alpha(c) holds to 8.7e-9 on all 5,729,897 moduli of the extended table); C: Z = 2^10 .. 2^21 (half-octaves to 2^18, then 2^18.5, 2^19, 2^19.5, 2^20, 2^20.5, 2^21).

**Weights (14, all with values +-1; `prep.py`).**
* `one`: 1.
* `e99, e97, e95, e90, e60`: THIN, split variant of c4: greedy floor rule on the rational primes p = 1 (mod 3) with
  L(x) = (1/2) int_2^x t^(b-1) dt/log t, one prime ideal above each selected p (the primary generator a + b omega
  with b > 0); completely multiplicative. Discrepancy pi_S - L over p <= 10^7 (`thin_check.json`): within [-1.0, 0]
  (b = 0.6), [-2.3, 0] (0.90), [-4.5, 0] (0.95), [-7.7, 0] (0.97), [-16.9, 0] (0.99).
* `rm95a, rm95b, rm90`: random prime sets of the same density (p in S with probability p^(b-1), random choice of
  the ideal), completely multiplicative. The density alone fixes the zero at b (P_S = (1/2) E_1 + analytic for
  Re s > b/2 almost surely), so these are further instances of the control, not nulls.
* `liou`: Liouville function of K. `d75`, `d50`: completely multiplicative, -1 on a random set of prime ideals of
  constant density 0.75, 0.50 (1/L has a singularity of order 2 delta - 1 at s = 1: 1/2 for d75, none for d50).
* `iid`: independent random signs on the indices (not multiplicative). `shuf95`: the values of e95 permuted within
  blocks of 64 consecutive norms (same density of -1, multiplicativity destroyed).

**Code.** `prep.py` builds the index set and coefficients from the squarefree table (gamma_2 from `gauss6.c`
period sums); `rows.c` enumerates ideals by depth-first search over prime factorisations, uses multiplicativity of
chi_c(m) in m (one modular exponentiation per table prime and leading row prime), accumulates the 6 unit multiples
of each generator from one pass, and writes, per stratum (norm shell of m, size of the powerful part, divisibility
by lambda and 2): counts, sum |C_w|^2, sum |C_w|^4, the 14 x 14 matrix sum C_w conj(C_v), the exact diagonal and
cross diagonals (Walsh transform over sign patterns), and squared row residuals for the errors.

**Arithmetic and validation.** float64. `verify_arb.py` recomputes Z = 1024 and Z = 2048 (test G, 3696 and 7446 rows,
all 14 weights) independently of `rows.c` (lattice enumeration of m, symbols from `alib.py`/`zomega.py`) in ball
arithmetic: each coefficient is an acb ball (100 bits; gamma_2(c) = the cube root of mu(c) alpha(c) nearest the
float64 table value, max distance 2.1e-9 against root separation sqrt 3), replaced by an exact integer midpoint
(scale 2^-44) with radius 2^-43; index sums are exact int64 sums; classes are combined in acb. Result: max
|C(rows.c) - ball midpoint| = 4.5e-10 over all rows and weights; every MS_w enclosed with radius <= 7e-5 and
containing the float64 value (differences <= 6e-8); rho_w enclosed with radius < 1e-6. Examples (Z = 1024 / 2048):
MS_one = [207.64840 +- 8e-6] / [416.4416 +- 4e-5], MS_e95 = [204.80288 +- 6e-6] / [415.8430 +- 7e-5],
MS_liou = [243.15060 +- 6e-6] / [553.4498 +- 6e-5]; rho_e95 = [-0.157807 +- 5e-7] / [-0.135385 +- 3e-7],
rho_e90 = [-0.184417 +- 2e-7] / [-0.203987 +- 3e-7]. Two-point exponents between these scales (`arb_two_point.log`):
MS_one 1.003971(1), MS_e95/MS_one 0.017832(1), MS_e90/MS_one 0.001628(1), MS_liou/MS_one 0.182631(1). (These are
enclosures of deterministic numbers; their row fluctuation at these scales is about 0.03, see the error model.)
The OpenMP run on the server and the single-thread local run agree at the scales run twice.

**Error model.** The enumeration is complete, so there is no sampling error; the quoted standard errors treat the
row contributions as independent mean-zero fluctuations about the diagonal: se(MS_w)^2 = sum_m (|C_w(m)|^2 - D_m)^2,
and correspondingly for cross moments. Check: the null weights `iid`, `shuf95`, `d50` have MS_w/D - 1 within
about 2 se of zero at the top scales (tables in 3.2). Exponents: weighted least squares in log Z, errors scaled by
sqrt(chi^2/dof) when that exceeds 1.

**Runs.** Local: `scripts/memcap.sh 8`, single process, each under 1 minute (Z <= 2^14, the ball check, a
conj(alpha) control). Server: through `rhrun` only, units `rh-c5thin-A-1118152149` (16 cores, 24 GB cap, 56 minutes;
G to 2^17 and all C scales), `rh-c5thin-B-1118161750` (16 cores, 32 GB cap, 35 minutes; gauss6 extension to norm
2.03e7, table, three more G scales) and `rh-c5thin-chk-1118165325` (1 core, seconds; identity check on the extended
table). Three earlier `rh-c5thin-A-*` units ended at start (missing files; missing /usr/bin/time) or were stopped by
this lane when the code changed. Peak resident memory about 0.5 GB. No GPU use. No unit of this lane is left running.
Units `rh-b7-*` and `rh-c5tha-*` were not touched. Top-scale wall times at 16 threads: 1482 s (C, Z = 2^21),
629 s (G, Z = 370728).

---

## 3. Results

Files: `out_G_ms.log`, `out_C_ms.log` (mean squares), `out_G_reg.log`, `out_C_reg.log` (regressions),
`out_G_collapse.log`, `out_C_collapse.log`, and the `.json` versions; aggregates in `srv/`.

### 3.1 Weight 1: the known row size

| test | scales | MS_one/Z at the top scale | diagonal D/Z | exponent of MS_one in Z | MS_one/D - 1 (range over scales >= 2^13) |
|---|---|---|---|---|---|
| G | 18, 2^10..2^18.5 | 0.2030 | 0.2040 | 1.0018 +- 0.0005 | -1.1 to -0.25 percent |
| C | 23, 2^10..2^21 | 1.5057 | 1.5094 | 1.0011 +- 0.0002 | -1.0 to +0.1 percent |

The row bound (2) is reproduced at the level of the diagonal. On rows with non-trivial powerful part MS_one is
below the diagonal by 14 percent at Z = 2^10 and 2 percent at 2^17 (test G, first 15 scales); on squarefree rows within 0.5 percent
from 2^14 on.

### 3.2 The assigned statistic: exponent of MS_w/MS_one

MS_w/D - 1 in percent (se), all rows.

Test C:

| Z | one | e99 | e97 | e95 | e90 | e60 | rm95a | rm95b | rm90 | liou | d75 | d50 | iid | shuf95 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2^12 | -0.17(0.82) | -1.70 | -1.32 | -1.07 | +0.20 | +0.36 | +0.51 | +0.09 | +0.80 | +21.98(1.20) | +2.55 | -0.49 | +1.46 | -1.09 |
| 2^16 | -0.79(0.20) | -0.53 | -0.18 | +0.15 | +0.67 | -0.27 | +0.20 | -0.12 | -0.12 | +45.78(0.40) | +5.17 | -0.05 | -0.37 | -0.03 |
| 2^18 | -0.36(0.10) | -0.49 | -0.08 | +0.21 | +0.54 | -0.11 | +0.09 | +0.24 | +0.07 | +47.09(0.24) | +4.54 | +0.01 | -0.02 | +0.11 |
| 2^20 | -0.16(0.05) | -0.34 | +0.02 | +0.36 | +0.69 | -0.06 | +0.13 | +0.13 | +0.06 | +61.15(0.15) | +5.60 | -0.10 | -0.03 | -0.05 |
| 2^21 | -0.24(0.04) | -0.28 | +0.17 | +0.54 | +0.85 | -0.11 | +0.18 | +0.19 | +0.10 | +76.68(0.12) | +6.76 | +0.00 | -0.04 | +0.02 |

(se of the thin columns equals that of `one` at each scale to within 5 percent.)

Test G:

| Z | one | e99 | e97 | e95 | e90 | e60 | rm95a | rm95b | rm90 | liou | d75 | d50 | iid | shuf95 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2^10 | +0.41(1.68) | -2.39 | -0.63 | -0.97 | +1.15 | -1.22 | -0.71 | -0.40 | +2.68 | +17.57(2.97) | +0.92 | -0.44 | +0.13 | +1.93 |
| 2^14 | -0.68(0.41) | -1.58 | -0.42 | +0.67 | +1.87 | +0.10 | +0.87 | +0.34 | +0.87 | +78.49(1.23) | +9.68 | +0.21 | +0.35 | +0.56 |
| 2^17 | -0.51(0.14) | -0.67 | +0.31 | +0.91 | +1.99 | -0.07 | +0.41 | +0.36 | +0.08 | +114.28(0.62) | +12.04 | -0.13 | -0.10 | +0.11 |
| 2^18.5 | -0.48(0.09) | -0.58 | +0.29 | +1.15 | +2.05 | -0.17 | +0.32 | +0.50 | +0.19 | +135.92(0.45) | +13.36 | +0.02 | +0.00 | +0.11 |

Exponent of MS_w/MS_one in Z:

| weight | b | test G (18 scales) | test C (23 scales) | asymptotic value under low-side failure, 2(b - 11/12) | contribution of the measured coherent part (3.4): test G / test C |
|---|---|---|---|---|---|
| e99 | 0.99 | +0.0020 +- 0.0007 | +0.0005 +- 0.0004 | +0.1467 | +0.0002 / +0.0001 |
| e97 | 0.97 | +0.0011 +- 0.0007 | +0.0005 +- 0.0004 | +0.1067 | +0.0014 / +0.0004 |
| e95 | 0.95 | +0.0012 +- 0.0007 | +0.0005 +- 0.0003 | +0.0667 | +0.0026 / +0.0005 |
| e90 | 0.90 | -0.0004 +- 0.0007 | -0.0000 +- 0.0004 | -0.0333 | +0.0039 / +0.0002 |
| e60 | 0.60 | -0.0011 +- 0.0005 | -0.0008 +- 0.0002 | -0.6333 | -0.0005 / -0.0007 |
| rm95a | 0.95 | -0.0017 +- 0.0007 | -0.0006 +- 0.0003 | +0.0667 | +0.0011 / +0.0001 |
| rm95b | 0.95 | +0.0000 +- 0.0007 | -0.0005 +- 0.0003 | +0.0667 | +0.0009 / +0.0002 |
| liou | 1 | +0.093 +- 0.003 | +0.060 +- 0.006 | +0.1667 | (the term itself) |
| d75 | - | +0.0112 +- 0.0012 | +0.0058 +- 0.0010 | - | |
| d50, iid, shuf95 | - | -0.0009, -0.0021, -0.0015 (+- 0.0007) | -0.0007, -0.0009, -0.0008 (+- 0.0003) | - | |

Reading. For the Liouville weight the raw statistic already separates the two cases (the ratio grows; the fit by a
single power is poor, chi^2/dof 6090/21 in test C, because the growth is a staircase, section 3.3). For the thin
weights it does not: the exponents are zero to within 0.002, but the last column shows that low-side failure also
predicts values below 0.004 at these scales, because the coherent part is below 3 percent of MS_w there
(b = 0.95: 0.88 percent at Z = 2^21 in test C, 1.8 percent at Z = 2^18.5 in test G). The measured raw exponents
are not equal to the last column either (e90, test G: -0.0004 +- 0.0007 against +0.0039): the generic off-diagonal
part of MS_w, which is -0.1 to -0.9 percent of D for these weights and drifts slowly, is of the same size as the
variation of the coherent part. With the asymptotic exponent 0.0667 the coherent part reaches the size of the
diagonal at Z ~ 2^21 * 114^15 ~ 10^37; with the measured local exponent 0.087, at Z ~ 10^30. The assigned
statistic is therefore undecided, for a stated quantitative reason, and the decision is made on the component
(3.4).

### 3.3 Liouville and d75: the coherent term and its growth

kappa(Z) = (MS_w - D)/M_w(Z)^2:

| Z | test G: kappa_liou | kappa_d75 | test C: kappa_liou | kappa_d75 |
|---|---|---|---|---|
| 2^10 | 0.285(0.048) | 0.09(0.16) | -0.03(0.10) | -0.37(0.43) |
| 2^12 | 0.789(0.031) | 0.63(0.10) | 1.170(0.064) | 0.80(0.26) |
| 2^14 | 1.282(0.020) | 1.227(0.060) | 2.094(0.036) | 1.79(0.17) |
| 2^16 | 1.684(0.013) | 1.640(0.035) | 2.424(0.021) | 2.267(0.096) |
| 2^17 | 1.871(0.010) | 1.814(0.027) | 2.436 | 2.24 |
| 2^18 | 2.096(0.008) | 2.042(0.020) | 2.489(0.013) | 2.212(0.054) |
| 2^18.5 | 2.225(0.007) | 2.173(0.018) | 2.565 | 2.33 |
| 2^20 | | | 3.236(0.008) | 3.021(0.030) |
| 2^21 | | | 4.058(0.006) | 3.823(0.023) |

* Universality: the two weights (independent prime sets, Mertens sums differing by a factor 3) give the same kappa
  within 3 to 10 percent from 2^14 on. Regressing d75 on liou: r = 1.028 +- 0.002 (test C), 1.052 +- 0.003 (test G).
* Growth: exponent of kappa_liou in Z: +0.177 +- 0.016 (test C, Z >= 2^11), +0.182 +- 0.009 (test G, all 18
  scales), +0.163 +- 0.002 (test G, upper 9 scales). Exponent of MS_liou - D: 1.177 +- 0.016 (test C),
  1.182 +- 0.009 (test G); value 7/6 under (3).
* Staircase (test C, where the kernel is narrow): kappa is flat at 2.42 to 2.49 for Z = 2^16 .. 2^18 and then rises
  to 4.06 at 2^21. This is the form (3) predicts (one step per ideal a).
* Collapse in the row cutoff (`collapse.py`): for all pairs (Z, M = 2^k <= Z), nu = (MS_liou - D)(M, Z) Z/(M M_liou^2)
  as a function of Y = Z^2/M rises from 0.6 (Y ~ 2^11) to 13.6 +- 1.0 (Y ~ 2^35), test C; fitted exponent in Y:
  0.195 +- 0.005 (Y >= 2^12), 0.187 +- 0.007 (Y >= 2^20); test G: 0.148 +- 0.004, 0.133 +- 0.008. The collapse is
  not exact (chi^2 within bins is large): nu is not a function of Y alone at the 10 percent level.

So (3) holds in the measured range with N(Y) growing at a rate between Y^0.13 and Y^0.20; the sixth-power count
is 1/6. For the Liouville weight MS grows faster than Z throughout the measured range (total exponent 1.096 +- 0.003
in test G, with a poor single-power fit; off-diagonal part 1.18).

### 3.4 THIN: the component test

rho_w of (4), reference liou, all rows (se) / prediction M_w/M_liou:

Test C:

| Z | e99 | e97 | e95 | e90 | rm95a | rm95b | rm90 | d50 | iid | shuf95 | one |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 2^12 | -0.025(0.029)/-0.031 | -0.076/-0.090 | -0.132(0.031)/-0.137 | -0.203/-0.217 | -0.075/-0.091 | -0.085/-0.087 | -0.106/-0.093 | +0.059/+0.020 | +0.007/+0.010 | +0.002/-0.004 | +0.007/-0.023 |
| 2^16 | -0.0366(0.0039)/-0.0312 | -0.0896/-0.0829 | -0.1301(0.0041)/-0.1207 | -0.1802/-0.1667 | -0.0795/-0.0733 | -0.0752/-0.0712 | -0.0740/-0.0670 | -0.0023/-0.0015 | -0.0076/-0.0016 | -0.0009/-0.0048 | -0.0097/-0.0019 |
| 2^18 | -0.0327(0.0019)/-0.0307 | -0.0828/-0.0796 | -0.1176(0.0020)/-0.1127 | -0.1554/-0.1453 | -0.0749/-0.0692 | -0.0723/-0.0674 | -0.0661/-0.0611 | -0.0054/-0.0013 | -0.0079/-0.0056 | -0.0102/-0.0085 | -0.0013/-0.0006 |
| 2^20 | -0.0322(0.0008)/-0.0303 | -0.0799/-0.0764 | -0.1095(0.0008)/-0.1052 | -0.1341/-0.1266 | -0.0699/-0.0660 | -0.0691/-0.0638 | -0.0572/-0.0525 | -0.0022/-0.0007 | -0.0007/-0.0012 | -0.0062/-0.0053 | +0.0003/-0.0002 |
| 2^21 | -0.0318(0.0005)/-0.0301 | -0.0789/-0.0749 | -0.1070(0.0005)/-0.1017 | -0.1252/-0.1181 | -0.0686/-0.0636 | -0.0667/-0.0616 | -0.0541/-0.0488 | -0.0012/-0.0007 | -0.0003/-0.0011 | -0.0050/-0.0048 | -0.0000/-0.0001 |

Pooled r_w = rho_w M_liou/M_w (weighted mean; r = 1: coherent component with the Liouville constant; r = 0: absent)
and the exponent in Z of the coherent part Ecoh_w = rho_w^2 (MS_liou - D):

| weight | b | test C (21 scales, Z >= 2^11): r | chi^2(r = 0) / chi^2(fit) | exponent of Ecoh (se scaled) | 2b - 5/6 | test G (18 scales): r | chi^2(r = 0) / chi^2(fit) | exponent of Ecoh |
|---|---|---|---|---|---|---|---|---|
| e99 | 0.99 | 1.063 +- 0.009 | 12992 / 10.5 | 1.136 +- 0.032 | 1.1467 | 1.057 +- 0.014 | 6015 / 8.4 | 1.088 +- 0.034 |
| e97 | 0.97 | 1.049 +- 0.004 | 72734 / 13.0 | 1.123 +- 0.025 | 1.1067 | 1.063 +- 0.006 | 33087 / 12.1 | 1.085 +- 0.014 |
| e95 | 0.95 | 1.047 +- 0.003 | 124551 / 10.8 | 1.087 +- 0.022 | 1.0667 | 1.077 +- 0.005 | 55381 / 5.8 | 1.077 +- 0.012 |
| rm95a | 0.95 | 1.070 +- 0.005 | 57160 / 10.8 | 1.098 +- 0.025 | 1.0667 | 1.112 +- 0.007 | 28332 / 4.1 | 1.072 +- 0.015 |
| rm95b | 0.95 | 1.078 +- 0.005 | 54781 / 8.2 | 1.109 +- 0.019 | 1.0667 | 1.109 +- 0.007 | 26915 / 3.4 | 1.100 +- 0.015 |
| e90 | 0.90 | 1.059 +- 0.003 | 169367 / 11.2 | 0.977 +- 0.019 | 0.9667 | 1.119 +- 0.004 | 78142 / 13.7 | 0.988 +- 0.014 |
| rm90 | 0.90 | 1.096 +- 0.006 | 39477 / 11.3 | 0.994 +- 0.020 | 0.9667 | 1.155 +- 0.008 | 23091 / 6.9 | 1.018 +- 0.016 |
| e60 | 0.60 | 1.123 +- 0.013 | 7203 / 29.4 | 0.331 +- 0.026 | 0.3667 | 1.426 +- 0.013 | 13129 / 122 | 0.498 +- 0.040 |
| liou | 1 | reference | | 1.177 +- 0.016 | 1.1667 | reference | | 1.182 +- 0.009 |
| d75 | - | 1.028 +- 0.002 | 432822 / 2.1 | | | 1.052 +- 0.003 | 133702 / 5.3 | |
| shuf95 | - | 1.08 +- 0.05 (M small) | 454 / 15 | | | 1.00 +- 0.07 | 224 / 15 | |
| iid | - | 1.13 +- 0.13 (M small) | 101 / 23 | | | 1.31 +- 0.16 | 81 / 13 | |
| d50 | - | 2.4 +- 0.3 (M small) | 66 / 9 | | | 2.2 +- 0.4 | 42 / 7 | |
| one | - | 1.4 +- 0.4 (M small) | 45 / 31 | | | 1.35 +- 0.22 | 97 / 59 | |

(Exponent fits use the scales where |rho_w| > 3 se: 13 to 20 scales depending on the weight. At the top G scale,
Z = 370728: rho_e95 = -0.1153(0.0009) against M_e95/M_liou = -0.1070; rho_e90 = -0.1470(0.0010) against -0.1314;
rho_e97 = -0.0818(0.0008) against -0.0771; rho_e99 = -0.0317(0.0007) against -0.0304.)

Further checks.
* Reference d75 instead of liou (test C): r = 1.162 +- 0.009 (e95), 1.177 +- 0.008 (e90), 1.158 +- 0.011 (e97);
  exponent of Ecoh 1.056 +- 0.032 (e95), 0.962 +- 0.025 (e90).
* Squarefree rows only (test C, reference liou): r = 1.035 +- 0.004 (e95), 1.051 +- 0.004 (e90); exponent of Ecoh
  1.084 +- 0.032 (e95), 0.961 +- 0.027 (e90).
* rho_w does not depend on the row cutoff: for Z = 370728 (test C), rows N(m) < 2^k, k = 12 .. 19:
  rho_e95 = -0.123(9), -0.121(7), -0.118(5), -0.120(4), -0.118(3), -0.115(3), -0.114(2), -0.114(2).
* Window dependence of the exponent (the staircase in kappa enters every Ecoh): e95, test C without the top scale:
  1.045 +- 0.021; with it: 1.087 +- 0.022; test G, first 15 scales: 1.113 +- 0.022; all 18: 1.077 +- 0.012. A fair
  summary for b = 0.95 is **1.08 +- 0.02 (statistical, scaled) +- 0.03 (window)**; for b = 0.90,
  0.98 +- 0.02 +- 0.04 (windows: 0.943, 0.977, 0.988, 1.034).
* M_w(Z)^2 itself has local exponent 0.905 (e95), 0.805 (e90), 0.944 (e97), 0.987 (e99), 1.000 (liou) in the upper
  half of the G scales: 2b - 1 in each case.
* r exceeds 1 by 3 to 16 percent for all multiplicative weights (and by more for e60, whose M_w is far from a power
  law). M_w with the profile V(q_c/Z) q_c^(-1/2) is a proxy for the exact coefficient in (3) (which has the kernel
  W~ and ray-class factors), and the generic parts of two correlated weights have a non-zero cross moment at the
  level of 0.1 to 1.4 percent of D (MS_w - D - rho_w^2 (MS_liou - D) is -0.8 percent of D for d75 and -0.4 to -0.1
  percent for the thin weights at Z = 2^21, test C).

Decision statistic. H_high ("high side fails": no coherent component, r = 0) against H_low ("low side fails":
component with amplitude M_eps, r near 1 and Ecoh ~ Z^(2b - 5/6)):
* b = 0.95 (e95): r = 1.047 +- 0.003 (test C), 1.077 +- 0.005 (test G); H_high is excluded at more than 200
  standard errors in each test, and for the two random instances rm95a, rm95b at more than 150.
* The exponent of the coherent part exceeds 1 (the row bound) for b = 0.95: +0.077 +- 0.012 (test G), 6 standard
  errors; +0.087 +- 0.022 (test C), 4 standard errors; +0.045 +- 0.021 in the least favourable window (2 standard
  errors). For b = 0.90 it is below 1 or compatible with 1 (-0.012 +- 0.014, -0.023 +- 0.019), as the threshold
  11/12 requires. Ordered in b (test C): 0.33 (0.60), 0.98 (0.90), 1.09 (0.95), 1.12 (0.97), 1.14 (0.99),
  1.18 (Liouville) against 0.37, 0.97, 1.07, 1.11, 1.15, 1.17.
* By the criterion of the assignment (separation at three standard errors): the presence of the component separates
  the two halves at far more than three standard errors; the excess of its exponent over 1 for b = 0.95 does so in
  three of the four windows tried and at two standard errors in the fourth.

### 3.5 Controls

| control | expectation | outcome |
|---|---|---|
| weight 1 | row size Z^(1 + epsilon); no coherent component (1/zeta_K regular, M_one -> 0) | MS exponent 1.0011 +- 0.0002; MS_one/D - 1 = -0.24(0.04) percent at 2^21; rho_one = -0.0000(0.0004) |
| random sign set of the same density, not multiplicative (`shuf95`; also `iid`) | diagonal only | MS/D - 1 = +0.02(0.04), -0.04(0.04) percent at 2^21; rho = -0.0050(0.0004), -0.0003(0.0004), equal to their M_w/M_liou = -0.0048, -0.0011 |
| random multiplicative prime set of the same density (`rm95a`, `rm95b`, `rm90`) | same zero at b, same component | r = 1.070, 1.078, 1.096; exponents 1.098, 1.109, 0.994 |
| Liouville | pole at 1: coherent term ~ Z^(7/6), growth beyond the row bound visible in the total | MS_liou/D - 1 = 77 percent at 2^21 (C), 136 percent at 2^18.5 (G); exponent of MS_liou - D 1.177 +- 0.016, 1.182 +- 0.009 |
| half of the primes flipped at random (`d50`) | multiplicative, no singularity of 1/L: no component | MS/D - 1 = 0.00(0.04) percent; rho = -0.0012(0.0004) (M_w/M_liou = -0.0007) |
| eps with b = 0.6 | component present with small, slowly growing M_w; far below the row bound | r = 1.12 (C), 1.43 (G); Ecoh exponent 0.33 +- 0.03 (C), 0.50 +- 0.04 (G) against 0.37; coherent part 0.02 percent of MS at 2^21 (C) |
| alpha in place of conj(alpha) in (1) (test G, Z = 2^10, 2^12, 2^14; `data_plain/`) | the identity gamma_1 gamma_2 conj(alpha) = mu G is lost; no coherent term | MS_liou/D - 1 = -1.5(1.6), -4.6(0.8), -3.5(0.4) percent (against +17.6, +48.3, +78.5 with conj(alpha)) |

The campaign controls (DH, backward heat, sign twist, unimodular twist, zeta(s+a)zeta(s-a), T-NR, Beurling,
phase-rotated transfer operator, theta^w) do not apply: no statement about zeros of zeta is made. THIN is itself the
control under test; the Liouville weight is a second member of the classes TW- and U with a located singularity
(pole of 1/L at 1) for which the growth beyond the row bound is seen in the measured range.

---

## 4. Which half carries the lattice-periodicity input

* **Low half (row reflection): carries it.** The bound (2) is what periodicity buys: for a finite-ray weight the
  completed row is a twisted theta row with a reflection, and (2) forces kappa(Z) M_w(Z)^2 << Z^(1 + epsilon). For a
  completely multiplicative unimodular weight that is not periodic there is no such constraint: the term
  kappa(Z) M_w(Z)^2 is present with the amplitude set by the weight's own Mertens sum (MEASURED for THIN at five
  values of b, three random instances, Liouville, d75).
* **High half: no periodicity needed, in the form tested.** The extraction of the reciprocal of the target from the
  rows (the coherent component with coefficient M_w) works for eps as it does for Liouville and d75, with the same
  profile u and the same constant to 3 to 12 percent. This is the quadratic-form version of the statement that the
  probe sees the zero at b. The manuscript's own high comparison uses L(s, eta chi_u) through Lemmas 4.8, 8.1, 17.5
  (c4, section 3.1), which are stated for Hecke characters; whether the comparison for I_eps holds with the
  manuscript's error term was not computed. The measured law says the signal is there.
* **Restated for R3.** In the 7/8 architecture the arithmetic input splits as: multiplicativity produces the signal
  (the coherent term is M_w, a sum of mu(c) w(c); non-multiplicative sign sets of the same density have none);
  periodicity bounds the rows that contain it. THIN has the first and lacks the second; the bound is what fails.

---

## 5. Requirement flags

This lane decides a property of a control for the 7/8 architecture; it is not an attack on a zero statement. All
four flags are false in the structured result.

* R1 (multiplicativity essential): not established as a theorem. Evidence in the direction of the requirement
  (MEASURED): the coherent component exists for completely multiplicative weights with amplitude M_w and is absent
  for `shuf95` and `iid` at the same density.
* R2 (height-uniform, every window): not applicable; no zero statement.
* R3 (every control fails at a named step): sharpened for THIN only: the failing step is the row moment bound
  (5.36) (Lemma 5.8, from Proposition 5.1), not the high comparison (MEASURED within Z <= 2^21, extrapolated
  beyond). Other controls were not rerun.
* R4 (reaches the critical line): none, as assigned.

---

## 6. Three weakest steps

1. **The decision is on a derived statistic, and the law behind it is heuristic.** (3) is a Poisson bookkeeping
   argument, not a proof; the identification of the regression coefficient with the manuscript's high comparison
   for I_eps (probe (6.1) with the s-average, Xi, R, G corrections, S containing all primes up to P_0) was not
   made by computation. The measured statement is: the rows of eps contain the component u with amplitude
   1.05 M_eps. That H_high implies r = 0 rests on (3).
2. **No violation of the row bound is observed for THIN.** At Z = 2^21 the coherent part is 0.88 percent of MS_eps
   (b = 0.95) and the raw exponent is zero within 0.0004. "The low estimate fails for eps" requires the law to
   persist to Z ~ 10^30: kappa ~ Z^(1/6) (measured exponents between 0.13 and 0.20 depending on test and window,
   with a staircase), M_eps(Z) ~ Z^(b - 1/2) (measured 0.905/2 for b = 0.95 up to 10^7; unconditional only as an
   Omega-statement), and no cancelling term (the generic off-diagonal part is measured at -0.4 to -0.1 percent of D
   for the thin weights and is not modelled). The exponent 1.08 for b = 0.95 carries a window uncertainty of 0.03,
   so its excess over 1 is between 2 and 6 standard errors depending on the window.
3. **Model and arithmetic choices.** S = {2, lambda} instead of the manuscript's S; sharp row cutoff N(m) <= Z;
   taper of V_G at u in [3.5, 4]; conj(alpha) read from the structure of Proposition 5.1 (supported by the
   alpha control); standard errors from an independence model for rows; M_w defined with V(q_c/Z) q_c^(-1/2) and
   n = 1 only, which is why r is 1.03 to 1.16 and not 1 (1.43 for b = 0.6 in test G). float64 throughout; ball arithmetic covers Z = 1024 and
   2048 only and takes the branch of gamma_2 from the float64 table and the identity gamma_2^3 = mu alpha from
   the manuscript ((4.7), checked numerically). The thin sets are the split variant, for which c4's continuation
   theorem needs a short-interval theorem in the progression 1 mod 3 (recalled there, not re-read here).

---

## 7. Follow-up

Most valuable next step: compute the manuscript's probe I_w(Z^(1/2), Z^(1/2), Z) itself (definition (6.1), S = {2,
lambda}) for w = eps (b = 0.95), Liouville and 1 at Z = 2^10 .. 2^18, together with ||A|| and ||B||, and compare
|I_w| with Q^(-1/2) ||A|| ||B|| and with c M_w(Z) Z^(-1/2 + 1/3). That replaces weakest step 1 by a direct
measurement of both sides of Proposition D. The row code here supplies B; A needs Gauss sums g_{chi_s}(s, -m) for
q_s ~ Z^(1/2) (FFT over O/s) and the corrections Xi, R, G.

Second: prove (3) for the Liouville weight (all L-functions involved are Hecke), which would make "a non-periodic
completely multiplicative unimodular weight violates (5.36)" a theorem relative to standard bounds.

## Files

`RESULT.md`; code `prep.py`, `rows.c`, `verify_arb.py`, `analyze.py`, `analyze2.py`, `collapse.py`,
`thin_check.py`, `check_ext.py`, `run_A.sh`, `run_B.sh`, `sextic/` (copied tools); outputs
`out_{G,C}_{ms,reg,collapse}.{log,json}`, `arb_G_1024.{json,log}`, `arb_G_2048.{json,log}`,
`arb_two_point.{json,log}`, `thin_check.json`; aggregates `srv/agg_{G,C}_<Z>.bin.gz` (41 files, read directly by
the analysis scripts) with side files `srv/in_{G,C}_<Z>.bin.side.json`; `data/` (small table and raw rows for the
ball check), `data_plain/` (alpha control). The extended Gauss-sum table (norm 2.03e7) is on the server only, in
`~/rh-push/c5-thin-propd-dichotomy/data/` (`split_ext_*.bin`, `sf_ext.npz`).

Reproduce the tables: `python analyze.py G <scales> --dir srv`, `python analyze2.py G <scales> --dir srv`,
`python collapse.py G <scales> --dir srv`; for test C add `--zmin 2048` to `analyze2.py`.
