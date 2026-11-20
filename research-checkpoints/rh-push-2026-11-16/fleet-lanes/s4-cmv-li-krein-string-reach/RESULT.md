# s4-cmv-li-krein-string-reach: screening of four CMV / Li / Krein-string / inverse-spectral combinations

Date: 2026-11-19/20. Screening arm of the 7-day campaign. Single agent, no referee pass. No RH claim, no change to any bound.
Labels: PROVED (argument given here), CLASSICAL, MEASURED (midpoint multiprecision or float64; every sign reported was
obtained at two working precisions unless a line says otherwise), ARGUED.

## 0. Verdict

Four combinations screened. Survivors: 0.

One law covers combinations 1, 2 and 3 (section 3): an off-line quadruple at height gamma is first seen by the
moment/Toeplitz/Hankel section of size

    N_det(gamma) = c x (number of on-line zeros with 0 < ordinate < gamma),   c = 3.4 to 3.6 for gamma >= 400

(c = 4.4 at gamma = 100, 3.63 at 401, 3.47 at 1001, 3.43 at 1500, still decreasing slowly), for the anchors a = 5, 20, 80
(gamma >> a) and for the centre anchor (Stieltjes string), for delta = 0.1, 0.25, 0.4, for planted pairs in xi at
gamma = 17.6 .. 1500, and for the real controls: DH (first off-line zero at 85.70, 43 on-line zeros below, detection at
148 to 152, c = 3.4 to 3.5) and the backward heat function tau = -0.5 (111.69, 33 on-line zeros below, detection at 123
to 125, c = 3.7). The same constant is the resolution of the unitary truncation: a CMV section of size N reproduces the
first 0.285 N to 0.29 N zeros to 1e-12, that is N = 3.4 to 3.5 times the number of zeros reproduced. The exponent 1.272
of the round-1 law is d log N(gamma)/d log gamma = 1 + 1/log(gamma/2 pi) at gamma = 30..80; it tends to 1 from above.
No anchor gives an exponent below 1 in the range gamma > a. A finite section of this family detects an off-line zero
exactly when it has resolved every zero below it.

| # | combination | statistic | sizes reached | zeta | L(chi) | controls | classification |
|---|---|---|---|---|---|---|---|
| 1 | CMV section from Taylor data at s = 1/2 + a; exact data and Euler-product data | first Levinson index with E_n <= 0 (section of size n+1 indefinite, abs(alpha_n) >= 1); number of eigen-angles of the unitary truncation within 1e-12 of pi - 2 atan(gamma_k/a) | exact data: N = 2400 (a = 20, 34000 bits), 4000 (a = 80, 46000 bits), 800 (a = 5, 30000 bits); Euler data: primes to 1e5 (a = 5, 20), 1e4 (a = 80), orders to 420 | positive at every size; zeros reproduced 20, 47, 104, 220, 456, 692 at N = 100, 200, 400, 800, 1600, 2400 (a = 20); 1170 at N = 4000 (a = 80) | chi_-4: positive to N = 1600, 463 zeros reproduced at 1600; chi_-3, chi_5: positive to 500 | DH 152 (a = 20), 149 (a = 5), 202 (a = 80); heat tau = -0.5: 125, 123, 151; T-NR 15, 5, 51; E_a 10..12, 6..8, 32..38; sign twist (Liouville) 2 or 7, 2, 8 or 28; random sign and unimodular twists 2, 2, 8. Euler-product data to P fail by truncation at index 25, 34, 43, 50 (a = 20; P = 1e2..1e5) | CLOSED. Real controls fail at 3.5 x (zeros below the off-line zero); twists fail through the missing functional equation at an order set by a alone; prime data to P support order about 0.25 a log P |
| 2 | reach law of the detector; Li-Weil matrix with displaced zeros | N_det(gamma, delta, a) for planted quadruples; exponent; first indefinite size of the Li form with the first K zeros moved | gamma = 17.6 .. 1500, delta = 0.1, 0.25, 0.4, a = 5, 20, 80, sizes as in row 1; Li form: N = 100, K = 1..200 | not applicable (planted pairs in xi) | not run | N_det/N(gamma) = 3.63, 3.54, 3.49, 3.47 at gamma = 401, 601, 801, 1001 (a = 20, delta = 0.1) and 3.45, 3.43 at 1300, 1500 (a = 80); local exponent 1.18..1.25 for gamma >= 300; a = 80: exponent 0.4..0.9 only for gamma < a, where N_det is larger than at a = 20. Li form: the repository matrix is positive semidefinite for every N by construction; the Toeplitz/Li form of xi turns at N = 7 (beta = 0.9), 7..8 (0.75), 8..9 (0.6) for every K >= 1 | CLOSED. Exponent is that of the zero-counting function; no exponent below 1 |
| 3 | Stieltjes (Krein) string of S(lambda) = L(w)/w at the centre | index of the first negative S-fraction coefficient against the number of on-line zeros below the off-line height; total length; coefficient distribution | exact data: 1599 coefficients (zeta), 399..499 (controls); float RKPW: 199999 coefficients from 1e6 zeros | all 1599 positive; total length 0.046209986230837942; coefficients decay like j^-1.2 (j < 100) to j^-1.8 (j about 1e5) | chi_-4, chi_5, chi_-3: all 399..499 positive | DH: first negative at 148 (43 zeros below), then 217, 351, 372: one pair of negative coefficients per off-line pair. Heat tau = -0.5: 123 (33 below). T-NR: 3. E_a: 6..7. Planted in xi: 125 at gamma = 100 (29 below), 732 at 401 (202 below) | CLOSED. Same law as rows 1 and 2 (ratio 3.4..3.7) |
| 4 | Wu-Sprung potential plus Gauss-Newton correction; Fourier lines of dV | amplitude of the lines at log n of dV, of the level residuals and of the zero list itself, against abs(Lambda_F(n)) | N = 600, 1000, 2000 ordinates (zeta), 2000 (chi_-4), 1800 (DH), 1400 (heat); grids of 9400 to 42900 points | zero-list spectrum: lines at prime powers only (composites 6, 10, 14, 15 at 0.02 to 0.2 of the background, primes at 1360 to 9800); residuals: also second-order lines at products p q; dV: lines at 2, 3, 4, 5 (N = 1000), at 2 only (N = 2000); ordinates reproduced to 6e-11 (N = 600), 4e-10 (N = 1000), 2e-6 (N = 2000, 30 iterations) | chi_-4: lines at odd prime powers only, none at 2, 4, 6, 10, 14; reproduced to 2e-12 (N = 2000) | DH (on-line list): lines at n = 4, 6, 9, 11, 14, 19, 26, 29, 31, 34, 41 (n = +-1 mod 5, composites included), none at 5. T-NR: its on-line list is zeta's list, so the output is identical to zeta's. Heat tau = -0.1 (on-line list): lines at prime powers, none at composites, line-to-background ratio 6 to 10 against 1360 to 9800 for zeta | CLOSED. Detects the absence of an Euler product, not the position of zeros; blind to T-NR by construction |

Rows 1 to 3 are "verified height in another form", with the conversion factor measured. Row 4 separates DH from zeta
without resolving its off-line zeros, and for a reason that uses all primes, but it passes T-NR identically and cannot see
any control that keeps prime-power support; it is a function of the on-line list alone (the explicit formula read as a
spectrum), so it carries no information on zeros that are not in the list.

## 1. Objects, formulas, code

Files (this directory): `core.py` (objects, Taylor data, moments, Levinson), `cmv.py` (one object, one anchor: Levinson,
planted-quadruple detection, eigen-angle counts), `trunc.py` (Euler-product and Dirichlet-series data), `post_trunc.py`,
`li_weil.py`, `hankel.py` (centre string by the quotient-difference algorithm), `rkpw.c` + `rkpw_post.py` (float string from
zeros), `ws.py` (Wu-Sprung + Gauss-Newton), `analyse.py` (collects `summary.json`, `analysis.txt`). Outputs: `out/`, `out3/`,
`out4/` (server), `loc/`, `loc4/` (Mac).

Objects (definitions of DH, E_a, T-NR re-typed from `push/s3-lacunary-pick-ghost-index/lib.py`, read as text). F(w) is the
completed function at s = 1/2 + w.

| code | object | first off-line zero (from the battery tables, read as text) |
|---|---|---|
| ZETA | xi(1/2 + w) = s(s-1) pi^(-s/2) Gamma(s/2) zeta(s) | none below the verified height |
| LCHI4, LCHI5, LCHI3 | completed L(s, chi) for chi_-4, the real even character mod 5, chi_-3 | none known (positive comparison) |
| DH | Davenport-Heilbronn, conductor 5 | delta = 0.3085 at 85.699; 43 on-line zeros below it |
| EA-1/8, 1/4, 1/2 | xi(1/2 + w + a') xi(1/2 + w - a') | delta = a' at every zeta ordinate, first 14.135 |
| TNR | xi times 3^s (1 + 2.2 * 3^(1/2 - s) + 3^(1 - 2s)) | delta = 0.4038 at 2.860 |
| HEAT-0.5, HEAT-0.1 | exp((tau/4) D^2) xi(1/2 + w), tau < 0 (equal to the Gaussian average of the battery; applied to the Taylor coefficients) | 0.2430 at 111.694 (33 on-line below); 0.0216 at 415.26 (211 below) |
| LIOU, LIOUX | sign twist eps(p) = -1: zeta(2s)/zeta(s) with pi^(-s/2) Gamma(s/2), without and with the factor s(s-1) | no functional equation |
| SGN-EUL, U-EUL | random completely multiplicative sign and unimodular twists (seeds 121000, 120000), Euler product only | no functional equation, no continuation on file |

The unimodular twist n^(-i alpha) (battery object WT) is zeta(s + i alpha): its Toeplitz sections at the anchor a are those of
xi at the anchor a + i alpha, all its zeros are on the line, so it is not a control for these tests (ARGUED, not run).

**Moments (PROVED; one-line computation).** With w = a(1+z)/(1-z) and L = F'/F = sum over zeros 1/(w - w_rho),

    Phi_a(z) = 4a L(a(1+z)/(1-z)) = c_0 + 2 sum_{k>=1} c_k z^k,
    c_k = sum_rho [4a^2/(a^2 - w_rho^2)] eta_rho^(-k),   eta_rho = (w_rho - a)/(w_rho + a),   c_0 = sum_rho 4a/(a - w_rho).

For w_rho = i gamma this is the atom at zeta_rho = (i gamma - a)/(i gamma + a) with mass 4a^2/(a^2 + gamma^2); the Toeplitz
matrix T_N = [c_(i-j)] is the Gram matrix of 1, z, .., z^(N-1) in L^2(nu_a). c_0 = 53.3239619119880 at a = 20 (round-1 value
53.323961912). The c_k are computed from the Taylor coefficients of F at w = a (Arb series) by
c_k = 2a sum_j l_j (2a)^j C(k-1, j-1); no zero enters.

**Finite-rank detection formula (PROVED; validated).** For an added quadruple +-delta +- i gamma, with eta = eta(delta + i gamma)
and m = 4a^2/(a^2 - (delta + i gamma)^2), the perturbation of T_N is P_ij = m eta^(-i) eta^j + conj(m) conj(eta)^i conj(eta)^(-j)
plus the complex conjugate pair, so v* P v = 2 Re[m conj(p(1/conj eta)) p(eta)] + (conjugate point): the off-line pair acts
through the product of the values of p at the two reflected points eta and 1/conj(eta). In the orthonormal polynomials
phi_n of nu_a, T_N + P_N is indefinite for the first time at the first N with det(I + C G_N) < 0, where G_N is the 4 x 4
Gram matrix of the vectors (phi_n(point))_{n<N} at the four points and C is the block matrix of the m's. One Levinson run
gives the detection size for every planted configuration. Validation: 13 configurations (gamma = 17.6 .. 81.1,
delta = 0.1, 0.4, added and displaced) against Levinson on explicitly modified moments: identical sizes
(`val_planted.py`, `val_planted_direct.json`). The displaced rows reproduce the round-1 detector rows 12, 20, 33, 48 at
gamma_1, gamma_3, gamma_6, gamma_10 (delta = 0.1, a = 20); the fifth round-1 row (107 at gamma_20) is 85 here at two
precisions.

**Arithmetic.** Ball arithmetic certifies nothing here beyond order about 50: the radii of the Levinson recursion grow by
more than 36 bits per order while the quantity itself loses 3.5 to 10 bits per order. All runs use midpoint arithmetic
(radii dropped after each step) at a working precision of at least 1.5 times log2(1/E_N) for a = 5, 20 and 1.9 times for
a = 80, and are repeated at a second precision. Observed failure mode of insufficient precision: a spurious E_n <= 0 at
the n where log2(1/E_n) reaches 0.72 x precision (a = 20) or 0.59 x precision (a = 80); such stops are not reported as
negatives. Agreement between precisions: every planted detection size, every eigen-angle count and log2 E_N to 12 digits
(a = 20: 26000 and 20000 bits at N = 1600; a = 80: 14000 and 11000 bits up to 1497).

**Server and local shares.** Server (rhrun units s4-A, s4-A1..A4, s4-A1b, s4-A2b, s4-A2c, s4-A4b, s4-B, s4-R, s4-C, s4-C2..C5;
all stopped or ended): zeta a = 20 N = 2400; zeta a = 80 N = 4000; chi_-4 a = 20 N = 1600; exact controls at a = 20, 5 and
most of a = 80; Euler-product and Dirichlet data at a = 20 (P, X <= 1e5) and a = 80 (P <= 1e4, X <= 1e3); centre string of zeta with
1599 coefficients at 34000 and 48000 bits and controls with 499; RKPW with 1e6 zeros and 1e5 Jacobi pairs (x87 long
double); Wu-Sprung at N = 300 and 1000 (zeta), 1000 (chi_-4, DH) (GPU 1 for the Gram matrix, pool limit 10 GB; a server run at N = 2000
was stopped at iteration 11 of 30). Mac (through `scripts/memcap.sh 8`):
second-precision repeats, a = 5, planted centre strings, Euler data at a = 5 and a = 80 (P <= 1e4, X <= 1e4), Li-Weil form,
Wu-Sprung at N = 600 to 2000. Every control index in section 2.1 was obtained on both machines where both ran (identical).
Measured throughput of the server for this workload (single-thread GMP, load average 135 to 155 on 48 threads): one
tenth of the Mac per process (DH string, 499 coefficients: 667 s against 54 s). The sizes first planned for the server
(N = 3200 at 64000 bits at a = 20, N = 6400 at a = 80, primes to 1e7 at order 260, 1e4 ordinates) were started, measured and
cut to the sizes listed; section 7 lists what was not run. Three local runs exceeded the 20-minute guideline (Wu-Sprung
N = 2000: 36 min; DH list: 22 min; heat string: 26 min); two further local attempts (Euler data to 1e7; Wu-Sprung on 3000
chi_-4 ordinates) were stopped unfinished after 75 and 25 minutes. A mistyped rsync target created a directory inside this
lane's folder; it was removed.

## 2. Combination 1: CMV section from Taylor data, exact and prime-side

Finite consequence tested: if Taylor data at s = 1/2 + 20 carried information on zeros beyond those the section resolves,
some control would turn indefinite at an order well below (number of zeros below its first off-line zero), or zeta's
Euler-product data would stay positive beyond the order that the truncation error allows. Survival = either of these.

### 2.1 Exact data (MEASURED)

| object | a = 5 | a = 20 | a = 80 |
|---|---|---|---|
| ZETA | positive to N = 800 (log2 E = -8666) | positive to N = 2400 (log2 E = -22210) | positive to N = 4000 (log2 E = -25843) |
| LCHI4 | positive to 400 | positive to 1600 (log2 E = -12050; server and Mac) | positive to 400 |
| LCHI5, LCHI3 | positive to 500 | positive to 500 | positive to 400 |
| DH | 149 | 152 | 202 |
| HEAT-0.5 | 123 | 125 | 151 |
| HEAT-0.1 | not run | none up to 299 (its first off-line zero is at 415.26; expected index about 750) | not run |
| TNR | 5 | 15 | 51 |
| EA-1/8, 1/4, 1/2 | 8, 7, 6 | 12, 11, 10 | 38, 35, 32 |
| LIOU / LIOUX | 2 / 2 | 2 / 7 | 8 / 28 |

Entries are the first Levinson index n with E_n <= 0 (the section of size n + 1 is indefinite); each at two precisions.
They agree with the map: DH 153 at a = 20 (P5; index 152 here), T-NR 7..15, E_a 7..12.

Eigen-angles of the unitary truncation (last Verblunsky coefficient replaced by +1 or -1; a zero counts when the
para-orthogonal polynomial changes sign within 1e-12 of its angle; "prefix" = number of consecutive zeros from the first):

| N | 100 | 200 | 400 | 800 | 1600 | 2400 | 4000 |
|---|---|---|---|---|---|---|---|
| ZETA a = 20 | 20 | 47 | 104 | 220 | 456 | 692 | |
| ZETA a = 5 | 21 | 48 | 105 | 221 | | | |
| ZETA a = 80 | 10 | 39 | 97 | 215 | 452 | | 1170 |
| LCHI4 a = 20 | 20 | 48 | 107 | 224 | 463 | | |
| DH a = 20 (on-line zeros) | 20 | 34 at N = 150 | | | | | |

The prefix is 0.285 N at N = 1600, 0.288 N at N = 2400 and 0.2925 N at N = 4000 (at N = 2400 and 4000 only a window of
120 zeros around the boundary was tracked); no zero beyond the prefix is reproduced. The round-1 figures
(39 at N = 400, 55 at N = 800, law K = 1.44 N^0.554) are not reproduced: at N = 400 the section needs 2183 bits
(log2 E_399 = -2182.5) and the round-1 pipeline ran at 200 decimal digits (664 bits, reached near N = 170). At sufficient
precision the count is linear in N (round-1 at N = 50, 100: 11, 21; here 7, 20 with the 1e-12 sign-change criterion).

Cost in precision: log2(1/E_N) = 828, 2183, 5495, 13362, 22210 at N = 200, 400, 800, 1600, 2400 (a = 20); slope
10.4 bits per order at N = 1600 and growing like 1.76 log N. a = 80: 177, 743, 2462, 7138 at 200..1600. a = 5: 1614, 3767,
8666 at 200, 400, 800.

### 2.2 Prime-side data (MEASURED)

The log-derivative is the exact gamma-factor part plus the Euler product over p <= P (or the Dirichlet series over n <= X).
First Levinson index with E_n <= 0:

| data | a | 1e2 | 1e3 | 1e4 | 1e5 | exact object |
|---|---|---|---|---|---|---|
| zeta, Euler product p <= P | 5 | 5 | 7 | 9 | 10 | positive |
| zeta, Euler product | 20 | 25 | 34 | 43 | 50 | positive |
| zeta, Euler product | 80 | 124 | 167 | 205 | | positive |
| zeta, Dirichlet series n <= X | 20 | 25 | 34 | 42 | 50 | positive |
| chi_-4, Euler product | 20 | 33 | 43 | 52 | 61 | positive |
| chi_-4, Euler product | 80 | 148 | 197 | 239 | | positive |
| DH, Dirichlet series n <= X | 20 | 34 | 45 | 55 | 65 | 152 |
| DH, Dirichlet series | 80 | 152 | 201 | 202 | | 202 |
| random sign twist, pi^(-s/2) Gamma(s/2) | 5 / 20 / 80 | 2 / 2 / 8 | same | same | same | (Liouville: 2 / 2 / 8) |
| random sign twist, xi factor | 5 / 20 / 80 | 2 / 7 / 28 | same | same | same | (Liouville: 2 / 7 / 28) |
| random unimodular twist | 5 / 20 / 80 | 2 / 2 / 8 | same | same | same | |

Zeros reproduced to 1e-12 by the last positive section built from Euler-product data: a = 20: 1, 3, 5, 7 zeros for
P = 1e2, 1e3, 1e4, 1e5; a = 80: 15, 29, 40 zeros for P = 1e2, 1e3, 1e4.

Reading (ARGUED from the generating function). In the variable z a prime contributes log p * p^(-1/2-a) *
exp(-2a log p * z/(1-z)), whose z-coefficients are Laguerre polynomials L_k^(-1)(2a log p). They are of size p^(-1/2-a)
only while k is small against a log p, and reach the size p^(-1/2) of the critical line beyond the turning point
k = (a/2) log p. So the truncation at P is visible at order n_E(P) = c a log P; measured c = 0.17 to 0.34 (a = 5, 20, 80).
Order N therefore needs primes up to exp(N/(c a)). The row "DH, a = 80" shows the only way prime data enter: with 1e4
Dirichlet coefficients DH's section turns indefinite at its exact index 202, and zeta's Euler data to 1e4 stay positive
to 204. That difference appears at the order that resolves DH's zero at 85.70 (section 3), not before. With primes to
1e7 and a = 20 the supported order is about 60 to 65 (extrapolated; not run), below DH's 152: the test stated in the
task (primes to 1e7, orders 400..3200) is not defined past that order, because the data are then not positive for zeta
either.

Twists: the index (2, 7, 28 or 8) does not depend on P or on the twist; it is set by the completion and the anchor. These
objects have no functional equation, the function is not Hermite-Biehler for a structural reason (a zero or pole of
the completed function at w = +-1/2), and the test reads that at an order of about 0.1 a to 0.35 a. This is the known
"FE-odd error is seen at order 12" (map P5), not a reading of zeros.

Classification: CLOSED. zeta passes at every size; DH and the heat control fail only at the order that resolves their
first off-line zero; E_a and T-NR fail early because their off-line zeros are low; the twists fail through the functional
equation. No control fails early relative to its zeros.

## 3. Combination 2: reach law and the Li-Weil matrix

Finite consequence tested: an exponent below 1 in N_det = A gamma^b for some anchor would mean that the order needed grows
more slowly than the number of zeros below gamma. Survival = b < 1 on a range gamma >> a.

### 3.1 Reach law (MEASURED; added quadruple at the midpoint between two consecutive zeta zeros)

Entries: first indefinite section size for delta = 0.1 / 0.25 / 0.4 ("-" = not run at that delta). Sources: a = 5 N = 800; a = 20
N = 1600 and 2400; a = 80 N = 1600 and 4000; centre: section 4.

| gamma | zeros below | a = 5 | a = 20 | a = 80 | centre (coefficient index) | N_det/zeros below at delta = 0.1 / 0.4 (a = 20; a = 80 beyond 1001) |
|---|---|---|---|---|---|---|
| 17.58 | 1 | 14 / 13 / 12 | 20 / 18 / 17 | 55 / 51 / 49 | 13 / 11 / 11 | 20.00 / 17.00 |
| 27.72 | 3 | 24 / 22 / 21 | 29 / 27 / 25 | 66 / 63 / 60 | 23 / 21 / 19 | 9.67 / 8.33 |
| 51.37 | 10 | 54 / 51 / 50 | 57 / 55 / 53 | 95 / 92 / 90 | 52 / 50 / 49 | 5.70 / 5.30 |
| 73.89 | 18 | 85 / 81 / 78 | 87 / 83 / 80 | 122 / 118 / 114 | 83 / 80 / 76 | 4.83 / 4.44 |
| 100.08 | 29 | 126 / 123 / 120 | 128 / 125 / 122 | 159 / 156 / 153 | 125 / 122 / 119 | 4.41 / 4.21 |
| 148.74 | 52 | 210 / 205 / 199 | 212 / 207 / 200 | 238 / 233 / 225 | 209 / 204 / 198 | 4.08 / 3.85 |
| 199.64 | 79 | 304 / 297 / 293 | 305 / 299 / 294 | 326 / 320 / 315 | 302 / 296 / 292 | 3.86 / 3.72 |
| 300.75 | 138 | 514 / 508 / 497 | 515 / 509 / 498 | 531 / 525 / 515 | 513 / 507 / 496 | 3.73 / 3.61 |
| 400.91 | 202 | 733 / 726 / 714 | 734 / 727 / 715 | 748 / 740 / 728 | 732 / 725 / 713 | 3.63 / 3.54 |
| 499.44 | 269 |  |  |  | 962 / - / 939 | 3.58 / 3.49 |
| 600.57 | 341 |  | 1208 / 1197 / 1183 | 1218 / 1207 / 1193 | 1206 / - / 1181 | 3.54 / 3.47 |
| 699.71 | 414 |  | 1460 / - / 1427 | 1469 / - / 1436 | 1459 / - / 1426 | 3.53 / 3.45 |
| 800.63 | 491 |  | 1716 / - / 1686 | 1724 / - / 1693 |  | 3.49 / 3.43 |
| 900.35 | 569 |  | 1987 / - / 1923 | 1994 / - / 1930 |  | 3.49 / 3.38 |
| 1000.57 | 649 |  | 2250 / - / 2219 | 2256 / - / 2226 |  | 3.47 / 3.42 |
| 1150.77 | 772 |  |  | 2664 / - / 2638 |  | 3.45 / 3.42 |
| 1299.95 | 897 |  |  | 3092 / - / 3042 |  | 3.45 / 3.39 |
| 1500.00 | 1069 |  |  | 3671 / - / 3573 |  | 3.43 / 3.34 |

Local exponents d log N_det/d log gamma between consecutive heights (a = 20, delta = 0.1): 0.82, 1.10, 1.16, 1.27, 1.27,
1.24, 1.28, 1.23, 1.23 up to gamma = 601 and 1.24, 1.20, 1.25, 1.18 between 601 and 1001; a = 80: 1.23, 1.19, 1.24, 1.17, 1.19, 1.22, 1.20
between 601 and 1500. Least-squares exponent on gamma = 601..1500 (a = 80): 1.203. The derivative of the counting
function, 1 + 1/log(gamma/2 pi), is 1.26 at gamma = 300, 1.20 at gamma = 1000 and 1.18 at gamma = 1500. The round-1 exponent 1.272 was fitted on
gamma = 14..77 and is the same function at low height.

Dependence on a. For gamma >> a the size is the same at a = 5, 20, 80 within 2 percent. For gamma < a it is larger at the
larger anchor (gamma = 17.6: 14 at a = 5, 20 at a = 20, 55 at a = 80; DH: 149, 152, 202), roughly N_det = 3.5 N(gamma) +
0.6 a. The exponents below 1 measured at a = 80 (0.40, 0.59, 0.69, 0.87 for gamma < 100) are this offset, not a gain.
Dependence on delta: 2 to 3 percent between delta = 0.1 and 0.4.

The same factor from the on-line side: the section of size N reproduces 0.285 N zeros (section 2.1), that is
N = 3.5 K. Detection of a pair at gamma and reproduction of the zeros up to gamma happen at the same size.

### 3.2 Li-Weil matrix (PROVED remark; MEASURED sizes)

The repository matrix M_N (`src/math/weil-breaking-point.js`, read as text) adds, for a zero moved to beta + i gamma, the
matrix [Re((1 - w^i) conj(1 - w^j))], the Gram matrix of the real 2-vectors (Re, Im)(1 - w^i). M_N is then a sum of Gram
matrices and is positive semidefinite for every N, K and beta: the recorded "PSD at N = 30 with 200 zeros at beta = 0.9"
holds by construction and there is no N at which that matrix turns. The Hermitian form attached to xi at the anchor
s = 1 is the Toeplitz matrix at a = 1/2 (congruent to the Li matrix [sum_rho (1 - z_rho^i)(1 - conj z_rho^j)] by
1 - z^j = (1 - z)(1 + .. + z^(j-1)); c_0 = 2 xi'/xi(1) = 0.0461914179322421 = 2 lambda_1). With the first K zeros moved
(`li_weil.py`, N = 100, 5000 bits; base form positive to 99, log2 E = -1336):

| beta | FE-symmetric pair (beta, 1 - beta), K = 1, 2 | K = 5..200 | zero moved without its partner, every K |
|---|---|---|---|
| 0.6 | 8 | 9 | 2 |
| 0.75 | 7 | 8 | 2 |
| 0.9 | 7 | 7 | 2 |

Entries: first indefinite section size. The form turns at N = 7 to 9, set by the first zero alone.

Classification: CLOSED. The exponent is that of N(gamma); it is above 1 at every anchor for gamma > a.

## 4. Combination 3: Krein / Stieltjes string at the centre

Definitions. F even, L = F'/F, lambda = -w^2: S(lambda) = L(w)/w = sum over pairs 2/(x_rho - lambda), x_rho = -w_rho^2
(= gamma^2 on the line), S(lambda) = sum s_n lambda^n, s_n = sum 2 x_rho^-(n+1). S-fraction
S = s_0/(1 - q_1 lambda/(1 - e_1 lambda/(1 - q_2 lambda/..))). All coefficients (q_1, e_1, q_2, ..) are positive iff both
Hankel families [s_(i+j)], [s_(i+j+1)] are positive definite (CLASSICAL, Stieltjes); the coefficients are the masses and
lengths of the string up to the positive factors of the Stieltjes correspondence, so the sign pattern is the one of the
node. Coefficient j uses s_0..s_j. Computation: quotient-difference algorithm on the s_n from the Taylor data at w = 0,
midpoint arithmetic, two precisions.

Total length (MEASURED, exact data): s_0 = xi''/xi at the centre = 0.04620998623083794157786762 (node: 0.0462099862308).
From 1e6 zeros alone: 0.0462033751 (the missing tail 2 sum_{gamma > 6.0e5} gamma^-2 is 6.6e-6).

| object | coefficients computed | first negative j | all negative j (head) | on-line zeros below the first off-line zero | ratio |
|---|---|---|---|---|---|
| ZETA | 1599 (34000 and 48000 bits, server; 40000 bits, Mac) | none | | | |
| LCHI4, LCHI5, LCHI3 | 499, 399, 399 | none | | | |
| DH | 499 | 148 | 148, 150; 217, 219; 351, 353; 372, 374 | 43 | 3.44 |
| HEAT-0.5 | 399 | 123 | 123, 125; 189, 191; 219, 221; 248, 250; 311, 313; 336, 338 | 33 | 3.73 |
| TNR | 499 | 3 | 3, 5; 9, 11; 15, 17; .. (70 in all) | 0 | |
| EA-1/8, 1/4, 1/2 | 499 | 7, 7, 6 | pairs from 7 (148, 150, 152 in all) | 0 | |
| xi + planted quadruple, delta = 0.1 | 799 | 13, 23, 52, 83, 125, 209, 302, 513, 732 at gamma = 17.6, 27.7, 51.4, 73.9, 100.1, 148.7, 199.6, 300.7, 400.9 | exactly two each (j, j + 2) | 1, 3, 10, 18, 29, 52, 79, 138, 202 | 3.62 at 400.9 |
| same, delta = 0.4 | 799 | 11, 19, 49, 76, 119, 198, 292, 496, 713 | two each | same | 3.53 at 400.9 |
| same, gamma = 499.4, 600.6, 699.7 (run with 1599 coefficients) | 1599 | delta = 0.1: 962, 1206, 1459; delta = 0.4: 939, 1181, 1426 | two each | 269, 341, 414 | 3.58, 3.54, 3.52 |

Each off-line pair gives exactly two negative coefficients, as the node states. DH's four pairs below 180 (85.70, 114.16,
166.48, 176.70) give negatives at 148, 217, 351, 372: every one sits at 3.4 to 3.6 times the number of zeros below it. The
centre anchor gives the same sizes as the anchors a = 5 and 20 (planted pair at 400.9: 732 here, 733 at a = 5, 734 at
a = 20).

Coefficient distribution from zeros (MEASURED, float; consumes the zeros). RKPW algorithm (Gragg-Harrod), x87 long double,
measure with atoms 1/gamma_k^2 and weights 2/gamma_k^2 for the first 1e6 zeros (Odlyzko table, 4e-9 accuracy, read as
text), truncated to 1e5 Jacobi pairs = 199999 S-fraction coefficients:
- all 199999 positive (this is forced: the input is a positive measure);
- sizes 1.61e-3, 2.27e-3, 1.23e-3 (j = 1, 2, 3), 4.85e-4 (10), 2.68e-5 (100), 8.69e-7 (1e3), 1.97e-8 (1e4), 3.34e-10 (1e5);
  local log-log slopes -1.22 (10..100), -1.50 (100..1e3), -1.66 (1e3..1e4), -1.74 (1e4..1e5), -1.79 (1e5..2e5);
- against the exact coefficients (all zeros): relative difference 1.4e-4 at j = 1, 3.1e-4 at j = 100, 7.3e-4 at j = 400;
- dependence on the number of zeros used (5e5 against 1e6): 1.0e-4 at j = 10, 1.6e-3 at j = 1e3, 8.9e-3 at j = 1e4,
  8.2e-2 at j = 1e5; the segments beyond about 1e4 are not determined by 1e6 zeros to better than a few percent;
- trace: sum of the 199999 coefficients = 0.0230786; the trace of the full Jacobi matrix is sum 1/gamma^2 = s_0/2 =
  0.0231017 (PROVED: trace of the Jacobi matrix of an atomic measure = sum of the atoms). The first 1e5 pairs carry
  99.90 percent of it. This is the only content found for the node mean-time-compression-trace-class in this setting: a
  trace identity, which holds for every control with its own zeros.

Classification: CLOSED. The index of the first negative segment is 3.4 to 3.7 times the number of on-line zeros below the
off-line height for DH, heat and planted pairs; T-NR and E_a fail at j <= 7 because their off-line zeros are the lowest
zeros. A survivor needed an index much smaller than the count.

## 5. Combination 4: Wu-Sprung potential plus Gauss-Newton correction

Setup. Half line x > 0, wall at 0, -psi'' + V psi, second-order differences. V_WS from
x(V) = (2/pi)[sqrt(V - V0) log(V0/(c e^2)) + sqrt(V) log((sqrt V + sqrt(V - V0))/(sqrt V - sqrt(V - V0)))], c = 2 pi/q,
V0 = 3.10073 pi/q (q = 1 is Wu-Sprung on the half line; q = conductor for the comparison lists). Gauss-Newton with
dE_n/dV_i = psi_n(x_i)^2 and the minimum-norm step on the Gram matrix (eigen-directions below a relative cut-off dropped).
Statistics: (a) R(tau) = sum_n r_n w(gamma_n) exp(-i tau gamma_n) for the level residuals r_n = gamma_n - E_n(V_WS), the
linear input of the correction; (b) G(tau) = h sum_i dV(x_i) w(u_i) exp(-i tau u_i) with u = V_WS(x). First-order WKB:
dV(u) x'(u) is the Abel transform of the count fluctuation, so a term sin(E log n) in the count gives a line at
tau = log n in both, with amplitudes proportional to abs(Lambda_F(n))/(sqrt(n) log n) in (a) and
abs(Lambda_F(n))/sqrt(n log n) in (b). Measured: the lines of G sit at tau = log n + c (log n)^3 with c = 0.017
(a dispersion effect of the oscillating part of psi^2; not predicted by first-order WKB); the lines of R sit at log n.

| list | N | grid points | Gauss-Newton: iterations, final max residual | zero list D: lines at 2, 3, 5, 7 / at 6, 10, 14, 15 (multiples of the background) | residuals R: same | correction G: same; lines above 5 x background |
|---|---|---|---|---|---|---|
| zeta | 600 | 18009 | 9, 6.7e-11 | not computed | lines above 5: 2, 3, 5, 7, 11, 13 | lines above 5: 2, 3, 4, 5 |
| zeta | 1000 | 29283 | 16, 3.7e-10 | 1360, 1764, 1988, 2033 / 0.03, 0.13, 0.21, 0.07 | 20.9, 16.7, 12.4, 10.2 / 4.7, 4.8, 4.7, 4.9 | 9.0, 7.9, 5.8, 4.3 / 2.9, 1.7, 1.5, 1.6; lines 2, 3, 4, 5 |
| zeta | 2000 | 42872 | 30, 2.0e-6 | 6569, 8512, 9638, 9814 / 0.02, 0.06, 0.16, 0.08 | 38.3, 33.5, 28.5, 25.7 / 7.1, 7.1, 7.0, 7.0 | 10.0, 0.3, 1.0, 1.8 / 1.2, 1.8, 1.0, 1.1; line 2 only |
| L(chi_-4), q = 4 | 2000 | 28145 | 17, 2.0e-12 | 0.0, 8723, 9912, 10142 / 0.03, 0.15, 0.31, 0.08 | 0.06, 69.1, 69.2, 67.8 / 0.4, 0.4, 0.4, 7.6 | 0.45, 9.6, 8.2, 6.6 / 0.6, 0.5, 0.95, 2.0; lines 3, 5, 7 |
| DH, on-line list, q = 5 | 1800 | 41277 | 30, 1.1e-2 (not converged) | 2.6, 2.3, 0.8, 1.5 / 3.95, 0.99, 3.96, 0.68; also 5.6 (4), 5.5 (9), 7.2 (11), 5.4 (26) | 2.6, 2.3, 0.8, 1.5 / 3.5, 1.2, 3.4, 0.6 | no line above 2 |
| heat tau = -0.1, on-line list | 1400 | 31989 | 30, 0.24 (not converged) | 6.0, 8.3, 10.3, 10.2 / 1.0, 1.0, 0.7, 0.7 | 4.8, 6.9, 8.7, 8.2 / 0.9, 1.1, 0.8, 0.6 | no line above 2 |
| T-NR | | | | identical to the zeta rows (same list) | identical | identical |
| zeta (server, GPU Gram) | 300; 1000 | 7054; 29283 | 8, 4.6e-12; 16, 3.6e-10 (norm of dV equal to the Mac run to 9 digits) | | lines above 5: 2, 3, 5, 7 (N = 300) | lines above 5: 2, 3 (N = 300); 2, 3, 4, 5 (N = 1000) |
| L(chi_-4) (server) | 1000 | 21563 | 17, 1.8e-11 | | lines above 5: odd n only (3, 5, 7, 9, 11, 13, 15, 17, ..) | lines above 5: 3, 5, 7, 11 |
| DH, on-line list (server) | 1000 | 22919 | 30, 6.5e-03 (not converged) | | lines above 5: 11, 19, 29 | none |

Correlation of the line amplitudes (n <= 60) with the predicted shape abs(Lambda_F(n))/sqrt(n): zero list 1.000 (zeta, both N),
1.000 (chi_-4), 0.994 (heat), 0.868 (DH, with Lambda_DH). Residuals: 0.87, 0.96 (zeta), 0.92 (chi_-4). Correction dV: 0.69
(zeta, N = 1000), 0.29 (zeta, N = 2000), 0.86 (chi_-4), 0.19 (DH), 0.06 (heat).

Three observations (MEASURED).
1. The exactly linear statistic D shows the multiplicative pattern to the resolution of the window: for zeta the
   amplitude at 6, 10, 14, 15 is 0.02 to 0.2 of the background while the prime lines are 1400 to 9800 times the
   background; for chi_-4 the line at 2 is absent and the odd prime powers are present.
2. The residuals r_n carry second-order lines at products n = p q (6, 10, 14, 15, 21, 22, 26 at 4.7 to 7 times the
   background for zeta), because the levels are the inverse function of the count. The correction dV inherits this and,
   in addition, its lines are displaced to log n + c (log n)^3 and sink into the oscillating part of the minimum-norm
   solution as N grows (norm of dV: 87, 127, 258 in L2 for N = 600, 1000, 2000; four lines above 5 x background at
   N = 1000, one at N = 2000). "Lines of dV at log p with amplitudes log p/sqrt p" holds for the first few primes only.
3. For the two lists with missing (off-line) zeros, DH and heat, the background of D is higher by a factor of several
   hundred to a thousand relative to the lines. The floor measures the zeros absent from the list: it is a zero count (Turing's method
   in another form), not a new test.

T-NR. Its zeros are zeta's zeros (all on the line) and the zeros of the local factor (all off the line, delta = 0.4038).
Its on-line list is zeta's list, so every quantity above is identical to the zeta row (PROVED: same input). The test
cannot register T-NR. The same holds for any control whose off-line zeros are added to an unchanged on-line list.

DH. The on-line list (1861 ordinates below 2000; the 84 off-line pairs are absent from the list) gives lines at
n = 4, 6, 9, 11, 14, 19, 26, 29, 31, 34, 41 in the residual list at N = 600 and N = 1800: the support of Lambda_DH (n = +-1
mod 5 dominant; 6, 14, 26, 34 are not prime powers), and no line at 5. This is a failure of the multiplicative pattern,
and it does not use the off-line zeros. It is the statement "DH has no Euler product" read from the explicit formula;
the hypothesis, not the conclusion.

Classification: CLOSED. The statistic is linear in the list of ordinates supplied. It distinguishes lists by their prime
side and is blind to zeros that are not in the list.

## 6. Why nothing here is a survivor

- Rows 1 to 3: the size at which a control fails equals 3.4 to 3.7 times the number of its on-line zeros below its first
  off-line zero, at every anchor, for DH, heat, planted pairs. That is the size at which the same section reproduces all
  those zeros to 1e-12. The test is a zero-resolving computation with a fixed overhead factor; it is verified height in
  another form, and its cost is higher (order 3.5 N(gamma), precision 10 or more bits per order and growing).
- Prime-side input does not shorten it: prime data to P support order c a log P, and the order needed is still
  3.5 N(gamma) + 0.6 a.
- The twists fail early but for the functional equation, at an order fixed by the anchor.
- Row 4 separates DH for a reason independent of its zeros, and passes T-NR identically.

## 7. Not run, and weakest steps

Not run (stated, not tested):
1. Primes to 1e7 at 4000 bits and orders 400..3200 from Euler data: the data are not positive past order about 50 to 65 at
   a = 20 for zeta itself (section 2.2); run to 1e5 (a = 5, 20) and 1e4 (a = 80).
2. Exact sections beyond N = 2400 (a = 20) and N = 4000 (a = 80) (task: 3200 at a = 20): server throughput; N = 3200 at
   a = 20 needs about 50000 bits and was estimated at more than 20 hours on the server.
3. Planted pairs at gamma = 1e4 and 1e5: by the law they need N = 3.6e4 and 4.8e5 with more than 5e5 and 1e7 bits.
4. Wu-Sprung beyond N = 2000 ordinates (task: 1e3..3e4): the selected-eigenvector solver (LAPACK stebz + stein through
   scipy) costs O(M N^2) and took 925 s per iteration at N = 3000 on the server; the alternative driver (stemr) allocates an
   M x M array. Two server units ended at their memory limit for that reason and one Mac run reached 27 GB resident for
   about two seconds before `memcap.sh` stopped it; the driver was reverted. No GPU dense eigen-solve was run; the GPU was
   used for the Gram matrix only.
5. Heat tau = -0.1 beyond order 299 (first off-line zero at 415.26; expected index about 750).
6. Sign and unimodular twists in combinations 3 and 4: no continuation to the centre and no zero list.
7. A Dirichlet L-function in combination 2 (planted pairs were put in xi only).

Weakest steps:
1. No certification: all signs are midpoint multiprecision at two precisions. The DH index at a = 20 agrees with the
   Arb-certified order 153 of the map (P5); nothing else here is certified.
2. The constant 3.4 to 3.6 is measured for gamma <= 1500; its slow decrease (3.63 at 401, 3.47 at 1001, 3.43 at 1500) is not fitted and
   no limit is claimed. The statement "detection size = resolution size" is measured, not proved.
3. The Laguerre reading of the prime-side truncation (n_E = c a log P) is argued and checked at three anchors and four
   values of P only; c varies from 0.17 to 0.34.
