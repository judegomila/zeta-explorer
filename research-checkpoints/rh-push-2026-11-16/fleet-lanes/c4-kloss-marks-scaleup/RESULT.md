# c4-kloss-marks-scaleup: infinity-to-one norm of the mark Gram matrix at 8 to 160 marks, Z up to 8.2e6

Internal working note, 2026-11-18. Slug `c4-kloss-marks-scaleup`. Heavy lane of round 4. Not refereed.
Nothing committed, pushed or posted. Scope: an ESTIMATE SYSTEM inside the 7/8 architecture (openai/math
manuscript and follow-ups, unrefereed). No statement about zeros of zeta is made. Ceiling if Conjecture WLS were
proved: model floor 31/36, not 1/2. RH open. NO QED.

Labels: PROVED / CLASSICAL / MEASURED / CERTIFIED (two-sided bound in ball arithmetic, under the stated error
model for the float64 build) / ARGUED / OPEN.

**Verdict: partial result.** The first test does not kill the idea.

1. CERTIFIED + MEASURED. At the model point (M, l) = (1, 1/3), natural slot [Z^l, 2Z^l], the ratio
   mu(G)/tr G (mu = infinity-to-one norm, sup over complex |a_p| <= 1) is

   | Z | marks n | rows R | certified bracket for mu/tr, manuscript row A' |
   |---|---|---|---|
   | 128000 | 10 | 29026 | [1.127349, 1.127349] |
   | 512000 | 15 | 116092 | [1.107968, 1.107968] |
   | 2048000 | 24 | 464316 | [1.129777, 1.129782] |
   | 8192000 | 33 | 1857315 | [1.108080, 1.108129] |

   Fitted exponent in Z: -0.002 +- 0.004 on the new points, -0.008 +- 0.005 with the n2 points from Z = 1000 on
   (the exponent of the mark count, which is the trivial bound, is +0.24 +- 0.02; the K-loss exponent is 1/3).
   The exponent is consistent with 0. The pole control (Kubota row) grows with exponent +0.37 +- 0.02 (Z >= 128000; +0.28 +- 0.02 from Z = 1000) in the same runs.
2. MEASURED, new. The ratio is not the independent-vector value (1 + sqrt(n/R))^2 that n2 reported. It carries a
   coherent, Z-independent rank-one term. For A' the unit-diagonal Gram matrix is, to within sampling noise,

       Gn[p, p'] = On[p, p'] + noise,   On[p, p'] = sum_{c : p, p' | c} |b_c|^2 / sqrt(D_p D_p') ~ (N(p) N(p'))^{-1/2},

   the contribution of the columns divisible by both marks (the terms c = c' of the opened square). Regression
   coefficient of Re Gn on On: 0.92 to 1.05 (mean 0.985) over 40 nested slots; after subtracting On the largest
   eigenvalue is 0.990 to 1.002 times (1 + sqrt(n/R))^2. So for the tested matrices

       mu(G)/tr G  =  lambda_max(On) (1 + O(sqrt(n/R)))  ~  1 + sum_{p in slot} 1/N(p)  ~  1 + log 2 / (l log Z)

   for a dyadic slot: bounded, tending to 1 like 1/log Z; for a slot of bounded logarithmic width w it is
   1 + log(1 + w/(l log Z)); for all primes up to P it is log log P. No power of Z.
3. PROVED, elementary (Lemma O, section 5): a* G a = Q(b d_a) with d_a(c) = sum_{p | c} a_p, where Q is the
   unmarked row form; the principal part G^d (terms c = c') is entrywise non-negative, its infinity-to-one norm
   is attained at a = (1, ..., 1) and equals sum_c |b_c|^2 r(c) omega_P(c)^2. The K-loss question is therefore
   exactly: is the off-principal part G^o of the unmarked row form, on coefficients b d_a, of the size of
   independent vectors. That is measured here (item 2) and not proved.
4. Controls. Random unimodular coefficient per COLUMN (same value for every mark dividing the column):
   identical to A' (regression 0.97, largest eigenvalue within 1.5%). Random phase per (mark, cofactor) pair, the
   control used by n1 and n2: no overlap term (regression -0.02); it is not a control for the overlap.
   Quadratic character with the manuscript coefficients: identical to A'. Kubota row without twist (pole) and
   quadratic character with coefficient 1: grow with exponents +0.37 +- 0.02 (Z >= 128000; +0.28 +- 0.02 from Z = 1000) and +0.32 +- 0.01. So the flatness is again
   not specific to the manuscript coefficients (as referee E1 of n2 found), and the growth controls show the
   functional detects growth at these sizes.
5. One unexplained arithmetic term: the Kubota row with the angular factor and no quadratic twist (K4a) has
   regression coefficient 0.42 to 0.59 (mean 0.50) on On, stable in Z and n, while its per-column random control
   has 0.98. A structured term of the size of the overlap and of opposite sign is present there. It lowers the
   norm. Not explained (section 6.4).

Requirement flags (section 8): R1 no, R2 no, R3 no, R4 no. This lane does not change the headline score.

---

## 1. Plan

Read: BRIEF (all notices, 2026-11-18 update), OBSTRUCTION_MAP row Z15, section 2 (controls), section 6 item 3,
`n1-maass-selberg-norm/RESULT.md` and `REFEREE.md`, `n2-kloss-sdp-certificate/RESULT.md`, `REFEREE.md`, `gram.py`,
`sdp.py`, `e2-ms-slot-capacity/RESULT.md`.

Question: K-loss removal at the model point is sup_{|a_p| <= 1} a* G a << Z^eps tr G for the mark Gram matrix G.
n2 measured this through the SDP relaxation and found it flat, but at (M, l) = (1, 1/3) on 4 to 6 marks
(referee E2: "close to nil"), because the build stored the cofactor-by-row character matrix (2 GB at Z = 32000).

New relative to n1, n2: (a) a build that never stores that matrix (C kernel, exact integer characters,
OpenMP + AVX-512), which reaches Z = 8.192e6 = 256 times the previous largest Z at the model point, 10 to 33 marks
in the natural slot and up to 160 marks in widened slots; (b) two-sided certified values (dual certificate checked
in ball arithmetic, explicit unimodular vector and explicit sign vector) instead of float64 gaps;
(c) a per-column random control and a quadratic-character control; (d) the identification of the structured
part of G (overlap term) and its separation from the noise part.

Decisive first test: Z = 128000 with 41 marks. Outcome: ratio 1.32 for A' against 1.06 for the n2 random control
(not killed: bounded; but not the n2 picture either). Followed up in sections 4 and 5.

## 2. Definition of G (identical to n2; cube completion omitted as in the source lanes)

Z[omega]. Rows: primary m coprime to 2, Z^M/4 < q_m <= Z^M (R rows). Columns: squarefree primary c coprime to 2.
b_c = gamma_2(c) conj-alpha(c) q_c^{-1/2} W(q_c/X), X = Z^{1+l}, W the lane's bump on [0.2, 1]. Marks: primes p with
Z^l <= N(p) <= cs Z^l (cs = 2: the natural slot of n1, n2; larger cs or "first n primes of norm >= Z^l" for the
widened slots; the sub-matrix on the marks of the natural slot is the natural-slot matrix exactly, because
x_p does not depend on the other marks).

    x_p(m) = sum_{c : p | c} b_c chi_c(m)   (chi_c the sextic symbol; 0 if (m, c) != 1),     G = (x_p . conj x_p').

The source lanes n1, n2 and e2 all state "cube completion omitted, n = b = 1"; there is no cube completion in
the source to reproduce, and none is implemented here. This is a model reduction (weakest step 1).

Variants (coefficient system; character power k in chi6^k):

| name | coefficient | k | role |
|---|---|---|---|
| A' (Ap) | gamma_2 conj-alpha | 1 | manuscript row |
| K | gamma_2 | 4 | Kubota row, theta pole in the marked direction: growth control |
| R | random phase per (mark, cofactor) | 1 | the n1/n2 random control |
| Rc, Rc4, QRc | random phase per column c, shared by all marks dividing c | 1, 4, 3 | generic control with the column structure kept |
| K4a | gamma_2 conj-alpha | 4 | referee n2 E1 |
| A | gamma_2 | 1 | referee n2 E1 |
| Q | gamma_2 conj-alpha | 3 | cubic part of the character removed (quadratic character) |
| QR | random per pair | 3 | |
| Q0 | 1 | 3 | quadratic character sum: second growth control |
| T6 | 1 | 1 | |

## 3. Method

### 3.1 Build (`klib.c`, `scale.py`) [exact characters; float64 sums]
- Sextic classes: chi_q(m) for a split prime q of norm p is the class j of x^((p-1)/6) = (-r)^j, x = u + v r mod p.
  All residues are below 2^23, products below 2^46, so the modular arithmetic in doubles (product, floor of the
  quotient, fused remainder) is exact; 8 rows per AVX-512 vector. Inert primes: exact integer pair arithmetic
  (numpy int64, as in `gram.py`). The kernel counts class values that match none of the six roots: 0 in every run.
- For each block of 32 rows the classes modulo all primes of norm <= Z are computed, summed over the prime
  factors of each cofactor c' (exponent of chi_c'(m)), and the weight row W[c', .] is added to one of six
  accumulators per row. x_p(m) = chi_p(m)^k sum_j zeta_6^{kj} acc_j. G is accumulated over rows. Nothing of size
  cofactors x rows is stored. Largest planned allocation: 9.7 GB (Z = 8.192e6), printed before allocation.
- Cubic Gauss sums of split primes: direct sum over a primitive root orbit, half range (x and -x are in the same
  cubic class), computed for one prime of each conjugate pair and conjugated (n2 Lemma 2). max ||g| - 1| =
  1.4e-14, 3.3e-14, 6.7e-14, 1.7e-13 at Z = 128000, 512000, 2.048e6, 8.192e6. Inert primes: normalised sum 1
  (order 3 divides q + 1; checked by direct summation for q <= 200). gamma_2(c') by twisted multiplicativity as in
  `gram.py`.
- Check [MEASURED]: the new build reproduces the stored n2 matrices G_Ap, G_K and G_R (same seed) at
  (Z, M, l) = (32000, 1, 1/3), (8000, 1, 1/2), (4000, 3/4, 3/4) with maximal relative entry difference 4e-15.
  Reordering the cofactors changes entries by at most 1e-15.
  The runs at Z <= 2.048e6 used the first (compiler-vectorised) symbol kernel, the run at Z = 8.192e6 the AVX-512
  intrinsics kernel (`klib.c` as stored); both were checked against the same n2 reference matrices (`build_test.sh`,
  `test3.sh`; logs in `server_logs/`).

Runs (compute server, through `rhrun` only, 16 cores, at most 28 GB requested; 7.8 GB resident observed at Z = 8.192e6, planned 9.7 GB):

| Z | rows R | cofactors | marks built | systems | kernel time |
|---|---|---|---|---|---|
| 128000 | 29026 | 34793 | 41 (10 natural), 160 | 4 + 1, 2 | 2.7 s + 1.5 s, 4.9 s |
| 512000 | 116092 | 136982 | 40 (15 natural), 121 | 4 + 1, 2 | 49 s + 20 s, 67 s |
| 2048000 | 464316 | 541135 | 49 (24 natural) | 4 + 1 | 821 s + 376 s |
| 8192000 | 1857315 | 2080999 | 33 (all natural) | 2 (A', Rc; variants K4a, Q, QRc) | 4457 s |

### 3.2 Stage 1, screen [float64]
`cert.py`: Burer-Monteiro primal for SDP(G) = max{tr(GX): X >= 0, X_pp <= 1} (n2's iteration), dual candidate
D_p = Re (G V V*)_pp, randomised rounding plus phase ascent for a unimodular vector, and 1-flip local search from
400 starts for a sign vector.

### 3.3 Stage 2, verdict [ball arithmetic, python-flint arb, 200 bits]
- Error model for the build. Every coefficient (Gauss sum products, weights, phases) has relative error at most
  1e-11 (a priori: a Gauss sum is a sum of p/2 cosines, error at most 2.2e-15 sqrt(p) <= 6.3e-12 for p <= 8.2e6;
  measured ||g| - 1| <= 1.7e-13). An accumulator is a float64 sum of at most C terms. So
  |delta x_p(m)| <= (1e-11 + (C + 16) u) S_p, S_p = sum_c' |W[p, c']|, u = 2^-53, and
  |delta G[p, p']| <= eta[p, p'] := 1.01 (sqrt(R G_pp) e_p' + sqrt(R G_p'p') e_p + R e_p e_p') + 4 (R + 16) u sqrt(G_pp G_p'p').
  Relative size of eta: at most 1.2e-5 (Z = 8.192e6; at most 2e-6 for Z <= 2.048e6) of lambda_max(G). This is an a priori floating-point model, not an
  interval evaluation of the build; the character values are exact integers.
- Upper bound. t = 1.000001 ||eta||_F >= spectral norm of the error. LDL* factorisation of D + delta - G_mid in
  acb with exact midpoints; all pivots certified positive. Then D + delta + t - G_true >= 0 for every G_true in
  the ball, so mu(G_true) <= SDP(G_true) <= tr(D + delta + t) (weak duality, n2 Lemma 1).
- Lower bounds. a* G a evaluated in arb over the ball for a = exp(i theta_p) (exact unit modulus) and for an
  explicit sign vector. The vectors and the dual D are stored in `cert_*.json`.
- All 305 certificates succeeded. Bracket widths (upper minus unimodular lower, relative): 1e-8 to 8e-6 for
  A', Rc, Rc4, K, K4a, A, Q, QRc, Q0, T6 at Z <= 2.048e6 and 4e-5 at Z = 8.192e6 (larger eta); up to 3e-3 for the per-pair random controls R and QR (there the SDP is not rank one, so the gap is
  the integrality gap, allowed up to 4/pi).

## 4. Results

Full output: `analysis.txt` (brackets for every variant and slot; fits), `cert_log.txt`, `overlap_log.txt`,
`overlap_wide_log.txt`. MP = (1 + sqrt(n/R))^2.

### 4.1 Natural slot, (M, l) = (1, 1/3) [Z <= 32000: n2 float64 SDP; Z >= 128000: certified upper end of the bracket]

```
== natural slot [Z^l, 2 Z^l], (M, l) = (1, 1/3): SDP/tr (n2 float64 for Z <= 32000; certified upper bound for Z >= 128000)
       Z    n        R      Ap       R(pair)   K        MP
    1000    4      226  1.1468   1.1336      1.951  1.2838
    2000    5      454  1.2850   1.0936      2.476  1.2209
    4000    5      904  1.1412   1.0653      2.556  1.1543
    8000    5     1813  1.1458   1.0621      2.739  1.1078
   16000    6     3625  1.1393   1.0353      3.397  1.0830
   32000    6     7249  1.0750   1.0363      3.554  1.0584
  128000   10    29026  1.1273   1.0292      6.309  1.0375   Rc=1.1109 K4a=1.0567 Q=1.1131
  512000   15   116092  1.1080   1.0169     10.149  1.0229   Rc=1.1117 K4a=1.0611 Q=1.1164
 2048000   24   464316  1.1298   1.0109     17.638  1.0144   Rc=1.1252 K4a=1.0570 Q=1.1295
 8192000   33  1857315  1.1081   nan        nan  1.0084   Rc=1.1086 K4a=1.0597 Q=1.1080
```

Fitted exponents e in ratio ~ Z^e (least squares in log-log, +- one standard error):

```
== fitted exponent e in (mu/tr upper bound) ~ Z^e, natural slot; +- one standard error
  Ap   all Z (10 points, Z=1000..8192000): e = -0.0078 +- 0.0047
  Ap   Z >= 8000 (7 points): e = -0.0019 +- 0.0037
  Ap   Z >= 128000 (4 points): e = -0.0023 +- 0.0039
  Rc   all Z (4 points, Z=128000..8192000): e = +0.0004 +- 0.0026
  Rc   Z >= 128000 (4 points): e = +0.0004 +- 0.0026
  R    all Z (9 points, Z=1000..2048000): e = -0.0129 +- 0.0024
  R    Z >= 8000 (6 points): e = -0.0075 +- 0.0016
  R    Z >= 128000 (3 points): e = -0.0065 +- 0.0013
  K4a  all Z (4 points, Z=128000..8192000): e = +0.0003 +- 0.0008
  K4a  Z >= 128000 (4 points): e = +0.0003 +- 0.0008
  Q    all Z (4 points, Z=128000..8192000): e = -0.0001 +- 0.0032
  Q    Z >= 128000 (4 points): e = -0.0001 +- 0.0032
  K    all Z (9 points, Z=1000..2048000): e = +0.2820 +- 0.0214
  K    Z >= 8000 (6 points): e = +0.3385 +- 0.0186
  K    Z >= 128000 (3 points): e = +0.3708 +- 0.0161
  Q0   all Z (3 points, Z=128000..2048000): e = +0.3151 +- 0.0110
  Q0   Z >= 128000 (3 points): e = +0.3151 +- 0.0110
  number of marks n: e = +0.2386 +- 0.0175   (trivial bound mu/tr <= n);  K-loss exponent M + l - 1 = 0.3333
```

### 4.2 Fixed number of marks (first n primes of norm >= Z^l), certified upper ends

```
== fixed number of marks (first n primes of norm >= Z^l): exponent in Z, and exponent in n at fixed Z
  Ap   n= 8: 1.1026 1.0598 1.0464 1.0312   e_Z = -0.0154 +- 0.0032
  Ap   n=12: 1.1456 1.0901 1.0711 1.0455   e_Z = -0.0210 +- 0.0035
  Ap   n=16: 1.1729 1.1140 1.0921 1.0589   e_Z = -0.0236 +- 0.0032
  Ap   n=24: 1.2267 1.1541 1.1298 1.0849   e_Z = -0.0281 +- 0.0038
  Ap   n=32: 1.2797 1.1888 1.1580 1.1055   e_Z = -0.0336 +- 0.0046
  Ap   Z=128000: e_n = +0.1054 +- 0.0063
  Ap   Z=512000: e_n = +0.0826 +- 0.0037
  Ap   Z=2048000: e_n = +0.0737 +- 0.0037
  Ap   Z=8192000: e_n = +0.0506 +- 0.0040
  Rc   n= 8: 1.0919 1.0656 1.0476 1.0302   e_Z = -0.0138 +- 0.0009
  Rc   n=12: 1.1238 1.0945 1.0692 1.0455   e_Z = -0.0173 +- 0.0005
  Rc   n=16: 1.1667 1.1177 1.0898 1.0591   e_Z = -0.0228 +- 0.0020
  Rc   n=24: 1.2265 1.1605 1.1252 1.0841   e_Z = -0.0289 +- 0.0026
  Rc   n=32: 1.2701 1.1942 1.1554 1.1061   e_Z = -0.0323 +- 0.0029
  Rc   Z=128000: e_n = +0.1121 +- 0.0068
  Rc   Z=512000: e_n = +0.0825 +- 0.0043
  Rc   Z=2048000: e_n = +0.0710 +- 0.0047
  Rc   Z=8192000: e_n = +0.0513 +- 0.0038
  R    n= 8: 1.0239 1.0108 1.0055   e_Z = -0.0065 +- 0.0016
  R    n=12: 1.0306 1.0152 1.0072   e_Z = -0.0083 +- 0.0015
  R    n=16: 1.0374 1.0179 1.0083   e_Z = -0.0103 +- 0.0020
  R    n=24: 1.0471 1.0242 1.0109   e_Z = -0.0127 +- 0.0019
  R    n=32: 1.0550 1.0272 1.0127   e_Z = -0.0147 +- 0.0026
  R    Z=128000: e_n = +0.0218 +- 0.0011
  R    Z=512000: e_n = +0.0119 +- 0.0006
  R    Z=2048000: e_n = +0.0052 +- 0.0004
  K4a  n= 8: 1.0484 1.0386 1.0249 1.0183   e_Z = -0.0073 +- 0.0006
  K4a  n=12: 1.0700 1.0504 1.0342 1.0255   e_Z = -0.0103 +- 0.0012
  K4a  n=16: 1.0843 1.0639 1.0417 1.0329   e_Z = -0.0120 +- 0.0014
  K4a  n=24: 1.1055 1.0846 1.0570 1.0457   e_Z = -0.0139 +- 0.0015
  K4a  n=32: 1.1279 1.1021 1.0672 1.0581   e_Z = -0.0162 +- 0.0024
  K4a  Z=128000: e_n = +0.0515 +- 0.0021
  K4a  Z=512000: e_n = +0.0433 +- 0.0031
  K4a  Z=2048000: e_n = +0.0295 +- 0.0018
  K4a  Z=8192000: e_n = +0.0276 +- 0.0025
  K    n= 8: 5.2536 5.8223 6.4241   e_Z = +0.0725 +- 0.0009
  K    n=12: 7.3389 8.3497 9.3961   e_Z = +0.0891 +- 0.0023
  K    n=16: 9.2528 10.7332 12.2433   e_Z = +0.1010 +- 0.0035
  K    n=24: 12.5757 15.0534 17.6383   e_Z = +0.1220 +- 0.0044
  K    n=32: 15.5100 18.8971 22.4775   e_Z = +0.1338 +- 0.0050
  K    Z=128000: e_n = +0.7806 +- 0.0116
  K    Z=512000: e_n = +0.8500 +- 0.0111
  K    Z=2048000: e_n = +0.9050 +- 0.0097
```

At fixed n the ratio decreases with Z (the same n marks have larger norms, since Z^l grows); at fixed Z it grows
with n with exponent 0.05 to 0.11 for A' and Rc (decreasing in Z), 0.005 to 0.02 for R, 0.78 to 0.91 for K.

### 4.3 Widened slots [CERTIFIED brackets, width <= 3e-6]

| Z | n | norms | A' | Rc | K4a | MP | lambda_max(On) |
|---|---|---|---|---|---|---|---|
| 128000 | 48 | 61..307 | 1.3468 | 1.3305 | 1.1583 | 1.083 | |
| 128000 | 80 | 61..499 | 1.4226 | 1.4152 | 1.1935 | 1.108 | |
| 128000 | 120 | 61..757 | 1.4850 | 1.4773 | 1.2278 | 1.133 | |
| 128000 | 160 | 61..1039 | 1.5280 | 1.5277 | 1.2480 | 1.154 | 1.532 |
| 512000 | 48 | 97..349 | 1.2428 | 1.2442 | 1.1240 | 1.041 | |
| 512000 | 80 | 97..571 | 1.3121 | 1.3190 | 1.1585 | 1.053 | |
| 512000 | 121 | 97..823 | 1.3752 | 1.3801 | 1.1892 | 1.066 | 1.382 |

n2's numerical statement "the largest eigenvalue of the unit-diagonal Gram is at most 1.06 (1 + sqrt(n/R))^2 for
A'" (its sections 5.4, 6.1) fails here: 1.536 against 1.154 at Z = 128000, n = 160 (ratio 1.33), 1.378 against
1.066 at Z = 512000, n = 121 (ratio 1.29). It held in n2's runs because the slot there was dyadic with few marks
at l <= 1/2, or had n/R large enough for the noise part to dominate.

## 5. The overlap term

### 5.1 Lemma O [PROVED, elementary]
Let P be the mark set, d_a(c) = sum_{p in P, p | c} a_p, omega_P(c) = #{p in P : p | c}, and
Q(beta) = sum_m |sum_c beta_c chi_c(m)|^2 the unmarked row form.
(i) a* G a = Q(b d_a) for every a. Hence mu(G) = sup_{|a_p| <= 1} Q(b d_a), with |d_a(c)| <= omega_P(c).
(ii) G = G^d + G^o, G^d[p, p'] = sum_{c : p | c, p' | c} |b_c|^2 r(c), r(c) = #{m : (m, c) = 1} (the terms
     c = c'), G^o the terms c != c'. G^d is positive semidefinite and entrywise non-negative,
     mu(G^d) = 1^T G^d 1 = sum_c |b_c|^2 r(c) omega_P(c)^2,   tr G^d = sum_c |b_c|^2 r(c) omega_P(c).
(iii) If Q(beta) <= Delta sum_c |beta_c|^2 for all beta supported on the columns, then
     mu(G) <= Delta sum_c |b_c|^2 omega_P(c)^2.
Proof. (i) sum_p a_p x_p(m) = sum_c b_c chi_c(m) sum_{p | c} a_p. (ii) G^d is the Gram matrix of the vectors
(b_c 1_{p | c} 1_{(m,c)=1})_{(m,c)}; for |a_p| <= 1, a* G^d a <= sum |a_p| |a_p'| G^d[p,p'] <= 1^T G^d 1, with
equality at a = 1. (iii) from (i). QED

Consequence. mu(G^d)/tr G^d is the weighted mean of omega_P^2 over the mean of omega_P. With
Ov[p, p'] = sum_{c : p, p' | c} |b_c|^2 (computed exactly from the weights by `scale.py`; Ov[p, p] = D_p) and
On = Ov / sqrt(D_p D_p'): On[p, p'] = (N(p) N(p'))^{-1/2} (1 + o(1)) for p != p' (the sum over the remaining
cofactor is scale invariant; ARGUED; measured (lambda_max(On) - 1) / sum_p 1/N(p) = 0.88, 0.92, 0.95, 0.97 at the
four natural slots), so

    mu(G^d)/tr G^d ~ 1 + sum_{p in P} 1/N(p),      = 1 + log(log 2P/log P) + o(1) for P = all primes of norm in [P, 2P].

This is the mean of the number of slot primes dividing a column that has one. It is the term that n2 section 6.2
called "present and harmless". It is harmless for the exponent. It is the whole structured part of the measured
ratio (5.2), and it is not small at these sizes: 1.11 to 1.13 in the natural slot against MP = 1.01 to 1.04.

### 5.2 Measured decomposition [MEASURED]
`overlap.py`: kappa = regression coefficient of the off-diagonal entries of Re Gn on those of On;
residual = Gn - On + I.

```
== overlap model Gn = On + noise (overlap_*.json): per variant, range over all files and nested slots with n >= 8
  Ap   (40 cases): kappa in [+0.924, +1.047] mean +0.985;  lam_max(Gn)/lam_max(On) in [0.993, 1.010];  lam_max(Gn - On + I)/MP in [0.990, 1.002];  residual rms*sqrt(R) in [0.93, 1.28]
  Rc   (40 cases): kappa in [+0.880, +1.012] mean +0.971;  lam_max(Gn)/lam_max(On) in [0.987, 1.002];  lam_max(Gn - On + I)/MP in [0.988, 1.000];  residual rms*sqrt(R) in [0.86, 1.09]
  K4a  (40 cases): kappa in [+0.424, +0.590] mean +0.498;  lam_max(Gn)/lam_max(On) in [0.824, 0.988];  lam_max(Gn - On + I)/MP in [0.993, 1.004];  residual rms*sqrt(R) in [0.82, 1.47]
  Q    (40 cases): kappa in [+0.878, +1.073] mean +0.989;  lam_max(Gn)/lam_max(On) in [0.988, 1.005];  lam_max(Gn - On + I)/MP in [0.994, 1.038];  residual rms*sqrt(R) in [1.05, 1.32]
  QRc  (40 cases): kappa in [+0.968, +1.081] mean +1.007;  lam_max(Gn)/lam_max(On) in [0.997, 1.013];  lam_max(Gn - On + I)/MP in [0.993, 1.113];  residual rms*sqrt(R) in [1.05, 1.20]
  R    (20 cases): kappa in [-0.133, +0.035] mean -0.021;  lam_max(Gn)/lam_max(On) in [0.816, 0.960];  lam_max(Gn - On + I)/MP in [1.002, 1.006];  residual rms*sqrt(R) in [0.99, 1.11]
  Rc4  (20 cases): kappa in [+0.889, +1.010] mean +0.977;  lam_max(Gn)/lam_max(On) in [0.993, 1.003];  lam_max(Gn - On + I)/MP in [0.987, 0.999];  residual rms*sqrt(R) in [0.89, 1.07]
  A    (20 cases): kappa in [+1.071, +1.303] mean +1.152;  lam_max(Gn)/lam_max(On) in [1.004, 1.044];  lam_max(Gn - On + I)/MP in [0.998, 1.018];  residual rms*sqrt(R) in [0.95, 1.19]
  QR   (20 cases): kappa in [-0.059, +0.055] mean -0.008;  lam_max(Gn)/lam_max(On) in [0.830, 0.959];  lam_max(Gn - On + I)/MP in [0.999, 1.019];  residual rms*sqrt(R) in [0.92, 1.17]
  T6   (20 cases): kappa in [+0.296, +40.346] mean +13.143;  lam_max(Gn)/lam_max(On) in [0.881, 10.432];  lam_max(Gn - On + I)/MP in [0.999, 12.428];  residual rms*sqrt(R) in [0.97, 5.53]
```

Same marks at two values of Z (33 marks of norm 97 to 271, the common part of the two runs): lambda_max(Gn) =
1.2034 at Z = 128000 and 1.1938 at Z = 512000 for A', while the per-pair random control falls from 1.063 to 1.031.
The coherent term does not depend on Z; the noise term decays like sqrt(n/R).

Natural slot:

```
== natural slot: overlap prediction
  Z=  128000 n= 10: lam_max(Gn)=1.1287  lam_max(On)=1.1201  1+sum 1/N(p)=1.1360  1+log(log 2P/log P)=1.1628  MP=1.0375  residual lam/MP=0.9933 kappa=1.047
  Z=  512000 n= 15: lam_max(Gn)=1.1087  lam_max(On)=1.1129  1+sum 1/N(p)=1.1228  1+log(log 2P/log P)=1.1468  MP=1.0229  residual lam/MP=1.0016 kappa=0.954
  Z= 2048000 n= 24: lam_max(Gn)=1.1300  lam_max(On)=1.1287  1+sum 1/N(p)=1.1353  1+log(log 2P/log P)=1.1337  MP=1.0144  residual lam/MP=0.9995 kappa=1.006
  Z= 8192000 n= 33: lam_max(Gn)=1.1082  lam_max(On)=1.1085  1+sum 1/N(p)=1.1123  1+log(log 2P/log P)=1.1228  MP=1.0084  residual lam/MP=0.9990 kappa=0.996
```

Prediction written before the Z = 8.192e6 run finished: lambda_max(On) about 1.106 (1 + sum 1/N(p) = 1.112 for
the 33 marks of norm 211 to 397), ratio 1.10 to 1.11. Outcome: lambda_max(On) = 1.1085, lambda_max(Gn) = 1.1082 for A', certified ratio in [1.108080, 1.108129];
kappa = 0.996, residual 0.999 MP.

### 5.3 Reading for Conjecture WLS
- WLS of n2 section 6.1 has diagonal weights, sum_p |a_p|^2 D_p. For a dyadic slot it is not contradicted: the
  constant must be at least lambda_max(On) = 1 + log 2/(l log Z) (1 + o(1)), which is bounded. For a union of
  slots or a wide slot the diagonal form loses log log; the form the data support with constant 1.00 is the
  one with the coefficient d_a kept:

      (WLS-d)   sum_m |sum_p a_p x_p(m)|^2  <=  C_eps Z^eps (Z^M + Z^l) sum_c |b_c|^2 |d_a(c)|^2 .

  Measured: Gn - On + I has largest eigenvalue 0.990 to 1.002 times (1 + sqrt(n/R))^2 for A' in all 40 nested
  slots with 8 <= n <= 160, so G <= D^{1/2} (On + (1.002 MP - 1) I) D^{1/2} in these cases (D = diag G).
  WLS-d is the unmarked large sieve Q(beta) <= C (rows + ...) ||beta||^2 restricted to beta = b d_a (Lemma O (iii)
  with the conjectured Delta). It is OPEN; the obstruction of n2 section 7 is unchanged (the off-principal part
  is a difference of two dual sums each larger than the claimed bound by Z^{1+l-M}).
- For the model: K-loss removal needs only the exponent. Evidence at the model point now rests on 10 to 33 marks
  in the natural slot and Z up to 8.192e6, with the ratio explained to within 1% by a term that is provably
  bounded in a dyadic slot. This supports Conjecture WLS at (1, 1/3), hence the conditional model value 31/36.
  13/15 remains the value relative to proved inputs. 7/8 (unrefereed) is untouched.

## 6. Controls

6.1 Campaign controls (Davenport-Heilbronn, backward heat, sign-twisted primes, unimodular twist,
zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w): not applicable; the lane makes no
statement about zeros, no positivity statement and no statement about zeta. Nothing to run them against. Section 2
of the map classifies this object as an estimate system inside the 7/8 method (S1), whose distinction from the
controls lies on the signal side, which this lane does not touch.

6.2 Coefficient controls asked for in the assignment.
- Random unimodular phases in place of the cubic Gauss-sum coefficient, one per column (Rc): same ratio as A'
  within 1.5% in every slot, kappa 0.88 to 1.01. The flatness and the overlap term are properties of the column
  structure 1_{p | c} and of the characters as an almost orthogonal system, not of the theta coefficients.
- Random phase per (mark, cofactor) pair (R, the n1/n2 control): kappa = -0.02; ratio equal to MP within 1%.
  This control gives the two views of a column p p' c'' independent phases, so it deletes the overlap. It
  understates the true ratio and should not be used as the reference.
- Quadratic character in place of the sextic one, manuscript coefficients (Q): same as A' (kappa 0.98).
  Quadratic character with random column coefficients (QRc): same, with a slightly larger residual (up to 1.11 MP
  at 160 marks). Quadratic character with coefficient 1 (Q0): grows, ratio 9.5, 14.3, 22.8 at the natural
  slot for Z = 128000, 512000, 2.048e6 (exponent +0.32 +- 0.01), close to n: all mark vectors parallel.
- Kubota row without twist (K): 6.31, 10.15, 17.64 at the natural slot (n = 10, 15, 24), exponent +0.37 +- 0.02 (Z >= 128000; +0.28 +- 0.02 from Z = 1000)
  against the exponent +0.24 +- 0.02 of n. The functional sees growth when a pole is present.
- T6 (coefficient 1, sextic character): natural-slot ratio 5.13 at Z = 128000 (n = 10), 1.067 at Z = 512000
  (n = 15), 1.043 at Z = 2.048e6 (n = 24). Erratic in Z; not interpreted, not used.

6.3 So no control separates the manuscript row from a generic coefficient system (same conclusion as referee E1
of n2, now with the per-column control and at 10 to 160 marks). The only systems that fail are those with a
pole in the marked direction.

6.4 The K4a term [MEASURED, unexplained]. For gamma_2 conj-alpha with chi6^4 (Kubota row with angular factor)
kappa = 0.42 to 0.59 in all 40 nested slots (0.46, 0.53, 0.44, 0.55 at the four natural slots), while Rc4 (same character,
random column coefficients) has 0.89 to 1.01. So in K4a there is a structured contribution from pairs c != c' of
size about -0.5 On. A candidate source is the dual (reflected) side of the Kubota series, where Gauss-sum
coefficients of distinct columns correlate with the Gauss sums of the character pair; this was not derived.
For the system A (gamma_2, chi6, no alpha) kappa = 1.07 to 1.30 (1.30, 1.09, 1.13 at the natural slots), a
smaller term of the opposite sign. For A'
kappa = 0.92 to 1.05: no such term at the 5% level. These terms have the size (N(p)N(p'))^{-1/2} of the overlap
and are Z-independent in the range tested; they do not change exponents.

## 7. Verdict

Partial result. Certified two-sided values of the infinity-to-one norm of the mark Gram matrix at the model
point for 10, 15, 24 and 33 marks (Z = 128000 to 8.192e6) and for nested and widened slots up to 160 marks;
ratio to the trace between 1.05 and 1.53 in all of them, exponent in Z consistent with 0 in the natural slot;
the structured part identified as the overlap term of Lemma O (bounded in a dyadic slot, log log over all
primes), the rest at the independent-vector size. This supports Conjecture WLS at the model end point
(conditional value 31/36) and corrects two statements of n2 (the 1.06 MP constant; the per-pair random control
as reference). Nothing is proved about exponents beyond Lemma O. No abscissa moves. RH open.

## 8. Requirement flags

- **R1 (all primes together, multiplicativity essential): not established.** Twisted multiplicativity is used
  to build G, but the measured property holds equally for random column coefficients (Rc) and for a quadratic
  character (Q). Evidence: sections 5.2, 6.2.
- **R2 (height-uniform, every window): not established.** No statement in the height aspect is made; the object
  is a finite Gram matrix of an estimate system.
- **R3 (fails for every control for a structural reason): not established.** The campaign controls do not apply
  (6.1); among coefficient controls the generic system passes exactly as the manuscript row does (6.3).
- **R4 (reaches the critical line): not established.** The ceiling of the system this lane informs is the
  model floor 31/36 (map row Z15).

## 9. Three weakest steps

1. Model reductions are those of n1 and n2: no cube completion, one slot, sharp squarefree columns, no cusp
   sectors, ray characters or compensation, M = 1 only. A loss carried by any of these is invisible. In
   particular Lemma O shows that with several slots the coefficient is a product of d-functions, and the
   principal term becomes a product of factors 1 + sum 1/N(p); that product over many slots was not built.
2. The certificates enclose the infinity-to-one norm of each computed matrix under an a priori float64 error
   model for the build (exact characters; Gauss sums, weights and sums in float64), not under interval
   arithmetic for the build. The exponent fit in the natural slot rests on 4 new points (10 with n2's), and
   the predicted behaviour 1 + log 2/(l log Z) is too slow to be distinguished from a constant in this range;
   "exponent consistent with 0" is the supported statement, not the 1/log decay.
3. "G^o is of independent-vector size" is the content of WLS and is only measured. The same measurement is
   passed by random column coefficients, so it does not locate the arithmetic input a proof would use; and the
   K4a term (6.4) shows that a neighbouring arithmetic system does carry a structured off-principal term of the
   size of the overlap. Its absence for A' is established only to about 5% of On.

## 10. Files

`klib.c` (kernels), `scale.py` (driver), `cert.py` (SDP screen and ball-arithmetic certificates), `overlap.py`,
`analyse.py`, `look.py`, `look2.py` (inspection), `build_test.sh`, `test3.sh` (validation against n2),
`g_Z*.npz` (full system set), `x_Z*.npz` (per-column random controls, overlap matrix), `w_Z*.npz` (widened
slots), `t*_Z*.npz` (validation), `cert_*.json` (brackets, dual weights, vectors), `overlap_*.json`,
`analysis.txt`, `cert_log.txt`, `overlap_log.txt`, `overlap_wide_log.txt`, `server_logs/`.
