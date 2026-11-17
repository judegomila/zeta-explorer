# box-ly-search: search for a truncation scheme with the Lee-Yang property for zeta at every finite stage

Slug: box-ly-search. Date: 2026-11-17. Nothing committed or pushed. No RH claim, no zero-free region, no change to
any Lambda bound. Labels: CERTIFIED (Arb ball arithmetic: argument principle with zero-free enclosures on every
contour piece, Sturm chains with certified signs, or interval Newton), SCREENED (float64 on GPU, no error control),
MEASURED (high-precision or float computation without a certificate), CLASSICAL, ARGUED, OPEN.

## 0. Verdict

**No scheme separates zeta from every control at every finite stage.** Every scheme tested falls in one of three
cases:

1. zeta itself fails at a finite stage (FE-symmetrised Dirichlet truncations with every weight tested, including
   pole-corrected Riesz means of order <= 1.5 at the sizes reached; FE-symmetrised Euler truncations; half-line
   N-term theta-kernel transforms; Polya-Hejhal K-Bessel truncations from N = 3);
2. the scheme passes for zeta at all tested sizes, and every control also passes until the stage resolves the
   control's own off-line zeros (Jensen polynomials; pole-corrected Riesz means of order 2, where no zeta failure
   was found and Davenport-Heilbronn passes for N < 500);
3. the scheme is not formulable for the control (no Dirichlet series for the backward-heat family; no Euler product
   for Davenport-Heilbronn), which is not a separation.

The best candidate found during the run was the **pole-corrected Riesz mean of order 1** (section 3): in the strip
window it passed for zeta at every N from 2 to 5000 up to height 2*10^4, while Davenport-Heilbronn failed for every
N >= 38 at its off-line zero near height 85.7. Pushed in height it fails for zeta as well: certified off-axis zeros at
N = 31 (height 7968258), 32 (3083366), 33, 34, 35 (185053.9), 40, 50, 60, 75, 100, 150, 200. The reason is structural
(section 4): at heights large compared with N the finite stage only depends on the Bohr lift of the truncated
Dirichlet factor to the torus of prime phases, where zeta is the same object as every unimodular completely
multiplicative twist of it. The stage passes at large height exactly when the lift has no zero to the right of the
line; that holds for N <= 26 (measured) for zeta and for Davenport-Heilbronn alike, and fails for N >= 27
(N = 26..30 screened clean for zeta up to height 6*10^6 .. 10^7; a torus zero only guarantees zeros at some height).

Calibration items of the task, both met:
* Davenport-Heilbronn fails once the truncation resolves height about 86: Dirichlet truncations from N = 38
  (Riesz order 1; first bad block [85.63, 86.63]), Jensen polynomials at shift 0 from degree d = 20786 (certified
  non-real root; the tracked root pair is real for d <= 20785).
* Jensen polynomials of Xi: certified hyperbolic for every (d, n) tested (section 2).

## 1. Objects, windows, controls

Normalisation (library `lylib.py`, copied from the sibling lane `push/ap-box-experiment`): s = 1/2 + i z; an object is
an even function of z, real on the real axis; "pass" means no zero off the real z-axis in the window
|Im z| < Y, |Re z| <= T. For the Dirichlet-type objects Y = 0.49 (0.01 < Re s < 0.99, the critical strip without the
gamma/pole lines) unless stated; a second pass used the largest pole-free Y (1.9 for the zeta gamma factor, 1.4 for
conductor 5 and 4).

Schemes:

| code | object | size |
|---|---|---|
| jensen | J^{d,n}(X) = sum_j C(d,j) gamma(n+j) X^j, gamma(k) = k! c_{2k}, Xi_F(z) = sum c_{2k} (-z^2)^k | degree d, shift n |
| afe | G(s) D_N(s) + G(1-s) D_N(1-s), D_N = sum_{n<=N} w(n) a_n n^{-s} (N-rung twin-ladder truncation plus its reflection) | N, weight w |
| afep | afe with D_N replaced by D_N(s) - sum over poles beta of residue * Gamma(k+1) M^{beta-s} / ((beta-s)^{k+1} log^k M), M = N+1, for the Riesz weight of order k (the pole term of the Perron formula; D_N - correction -> the full Dirichlet series as N -> infinity) | N, k |
| euler | G(s) E_P(s) + G(1-s) E_P(1-s), E_P = product over p <= P of the local factors | P |
| thalf | 2 int_0^oo Phi_N(u) cos(zu) du, Phi_N = N-term theta kernel | N |
| polya | Polya-Hejhal cosh-symmetrised N-term kernel (K-Bessel) | N |
| dbn | 2 int_0^oo exp(lam u^2) Phi_N(u) cos(zu) du | N, lam |

Weights: sharp; riesz k = (1 - log n / log(N+1))^k for k = 0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8;
lin k = (1 - n/(N+1))^k; cos = cos^2((pi/2) log n / log(N+1)); gaus4 = exp(-4 (log n/log(N+1))^2);
selb = min(1, 2(1 - log n/log(N+1))).

Inputs: zeta; chi4 = L(s, chi_-4) (a second true L-function, used as a positive reference); controls dh
(Davenport-Heilbronn), tw2m / tw3m (completely multiplicative sign flip at 2 / at 3), tw2h (eps_2 = 1/2), liou
(eps_p = -1 for all p), ea:a = zeta(s+a) zeta(s-a) for a = 0.05, 0.25, 0.45, nr:q:c = xi(s)(2 cosh((s-1/2) log q) + c),
heat:lam (kernel times exp(lam u^2); Taylor-coefficient and kernel schemes only).

## 2. Jensen polynomials

CERTIFIED (Sturm chains in Arb): see the tables in section 7. Summary:

| input | largest sizes certified hyperbolic | first certified failure | reading |
|---|---|---|---|
| zeta | all n <= 300 for each of 72 degrees d = 2..316 (21672 Sturm counts); d = 512 at n = 0, 8, 64 | none | consistent with GORZ and with verified height (classical: all (d,n) with d <= about 9*10^24) |
| dh | all n <= 40 for each of 74 degrees d = 2..400; d = 512 at n = 0, 8 (Sturm) | d = 20786 at n = 0 (interval Newton certificate of a non-real root; also certified at d = 20787, 20796, 20994, 22865) | fails when the degree resolves the off-line zero at height 85.7 |
| nr:3:2.2 | d <= 13 at n = 0; every n = 1..30 for d <= 300; d = 512 at n = 8, 64 | d = 14 at n = 0, and every scanned d >= 14 at n = 0 | zeros at height pi/log 3 = 2.86, depth 0.404: (g/2b)^2 = 12.5 |
| nr:2:2.5 | d <= 5 at n = 0 | d = 6 at n = 0 (every scanned d >= 6); at d = 300 also n = 1 | zeros at height pi/log 2 = 4.53, depth 1.0 |
| ea:0.45 | d <= 222 for all n <= 30 | d = 265 at n = 0 (next scanned degree after 222; fails at 265, 316, 377, 420, n = 0 only) | (g/2b)^2 = 246 |
| ea:0.25, ea:0.05 | d <= 512 at n = 0, 8, 64 | none reached | predicted thresholds (g/2b)^2 = 799 and 19974 |
| heat:-1, -0.25, -0.05, +0.05 | d <= 32, 64, 128, 128 at n = 0, 8, 64 | none reached | coefficient cost limits the degree |
| tw2m | not formulable | | no functional equation, no even Taylor expansion |

Davenport-Heilbronn at shift 0 (`jensen_track.py`). Coefficients: m_k = 2 int_0^oo Phi_DH(u) u^{2k} du for k <= 3000
as Arb enclosures (certified quadrature of the 40-term kernel on [0,6] plus explicit radii for the two tails), and
the rigorous bound m_k <= 2.66 tau^{2k} e^{-2k} Gamma(3/4 + k/tau) (5/pi)^{3/4 + k/tau} for k > 3000. The root pair
of J^{d,0} attached to rho = 0.8085171825 + 85.6993484854 i was followed by Newton iteration at 1000 bits from
d = 10^7 (where X d / (rho - 1/2)^2 = 0.999996) down to the degree where it reaches the real axis:

* first degree with a non-real pair: d = 20786, root X = -0.35266367 + 1.577*10^-5 i. CERTIFIED non-hyperbolic:
  interval Newton on a disc of radius 8.4*10^-207 around the root, disjoint from the real axis.
* d = 20785: the tracked pair is real. MEASURED. This is not a certificate of hyperbolicity of J^{20785,0} (a Sturm
  chain at this degree needs about 6*10^5 bits and was not run), and "first failing degree = 20786" assumes no other
  off-line pair of the Davenport-Heilbronn function lands earlier (the next one, 0.6508 + 114.163 i, has
  (g/2b)^2 = 143000).
* the cone heuristic (g/2b)^2 = 19290 underestimates the threshold by 7.8 %.
* shift n >= 1: the pair is already real. MEASURED twice: the Newton continuation in n at d = 10^7 lands on a real
  root for n = 1, 2, 3, 8, 64, and the argument principle for F^(n)(w) = sum gamma(k+n) w^k / k! on the rectangle
  Re w in [-7700, -7000], Im w in [2, 150] counts 1 zero for n = 0 and 0 zeros for n = 1, 2, 3. One derivative
  removes the lowest off-line pair of the control. This is the GORZ direction: for each fixed d every function of
  this class is hyperbolic for large n.

Reading. A Jensen polynomial at (d, n) is a resolution statement: it fails for a control exactly when d exceeds the
cone threshold of that control's lowest surviving off-line pair, and below that threshold the control passes like
zeta. The scheme does not separate: zeta passes because its zeros are on the line up to verified height, which is the
verified-height wall.

Float64 pre-screen for Jensen polynomials (`jensen_gpu.py`, batched companion-matrix eigenvalues, all shifts
n <= nmax per degree): from d = 15 upward it flags every (d, n), including zeta at every shift, and every flag is
rejected by the Sturm count. The companion matrices are too ill-conditioned for float64 at these degrees. The exact
Sturm test was therefore used directly; it is fast enough (d = 512 in about 5 minutes).

## 3. FE-symmetrised Dirichlet and Euler truncations

Pipeline: `fscreen.py` (float64, cupy): for unit blocks of height, phase sums give the number of zeros with
0.02 < Im z < Y, the number with |Im z| < 0.02 and the sign changes on the axis; a block is bad when the first is
nonzero or the last two differ. `cert.py` (Arb): for a bad block the certified argument principle on the rectangle;
for clean ranges the certified zero count above the axis (= 0), the certified count in the band and the certified
sign changes, block by block. At height above 150 the certified object is F / exp(c), c a float constant near
Re log G, evaluated through log Gamma, so the working precision is about 350 bits at any height. Every bad block sent
to `cert.py` so far was confirmed as a certified off-axis zero (no screen false positive among the candidates
tested; counts in section 7).

Main findings (strip window Y = 0.49; N tested: 1..30, 40, 50, 75, 100, 150, 200, 300, 500, 1000, 2000, 5000, larger
where stated; T = 2000 unless stated; full table in section 7):

| scheme, weight | zeta | chi4 | dh | twists | ea | reading |
|---|---|---|---|---|---|---|
| afe sharp | fails from N = 3 | fails from N = 5 | fails from N = 6 | fail from N = 3 (tw2m, tw3m, liou), 5 (tw2h) | fails from N = 2 | sharp truncations fail for every input |
| afe lin1, lin2, cos, selb, gaus4 | fail from N = 7, 12, 20, 5, 75 | fail from N = 16, 40, 150, 12, 500 | fail from N = 11, 19, 40, 10, 100 | fail | fail | no weight in this family passes for zeta |
| afe riesz k (no pole term) | fails at low height from N = 14, 75, 500, 2000 for k = 1, 2, 3, 4 | passes at T = 2000 for every N, k >= 1 | fails from N = 38 (k = 1), 750 at height 85.6 and 550 at 239.6 (k = 2), 8000 (k = 3), > 10^5 (k = 4) | fail at low height like zeta | fail | the zeta failures are the uncorrected pole at s = 1 |
| **afep riesz 1** | **passes N = 2..5000 to T = 2*10^4 and N = 20, 26..30 to T = 6*10^6 or more; fails at larger height from N = 31** (section 4) | passes N <= 75 to 10^5; fails N = 100, 200, 500 above height 22394 | fails from N = 30 (height 19238), from N = 38 at 85.6 | tw2h passes (T = 2000); tw2m fails N >= 100 (height 2335); tw3m N = 150 | fails from N = 5 | best candidate; not Lee-Yang for zeta |
| afep riesz 2 | passes N = 2..10^4 (T = 2*10^4), N = 50..1000 to 4*10^6 .. 6*10^6 | passes N <= 2*10^4 (T = 2000..10^5) | fails from N = 500 | pass | fails from N = 21 | no zeta failure found; torus minimum not yet zero at N <= 2000 (section 4) |
| afep riesz 0.1, 0.25, 0.5, 0.75; 1.5 | fails from N = 3, 5, 7, 50; order 1.5: no failure, N <= 5000, T = 2000 | fails from N = 7, 8, 22, 50 | fails from N = 6, 9, 12, 22 | | | failure moves out continuously with the order |
| afep riesz 3, 4, 6, 8 | fail at low height (pole of order k at s = 1 next to the window) | pass | k = 3: fails from N = 8000; k >= 4: no failure to N = 10^5 (T = 400) | | | heavy smoothing delays resolution: the control is not resolved either |
| euler (P <= 9973) | fails for every P >= 2 | - | not formulable | fail (tw2h from P = 3) | fail | FE-symmetrised Euler truncations are not Lee-Yang for zeta |

Davenport-Heilbronn threshold in N at its zero near 85.7 (bad block [85.63, 86.63], SCREENED, T = 2000):
riesz 1: N = 38 (N = 31..37 clean); riesz 1.5: N in (100, 150]; riesz 2: N in (700, 750]; riesz 3: N in (9000, 30000];
riesz 4: none up to N = 10^5; gaus4: N in (75, 100]. At N = 50 (riesz 1) the object has its zero at
s = 0.7225 + 85.693 i, on the way to the true zero 0.8085 + 85.699 i (MEASURED, `locate.py`).

## 4. Why the pole-corrected Riesz mean fails for zeta: the torus criterion

Let B_N(sigma; theta) = sum_{n<=N} w(n) a_n n^{-sigma} exp(i sum_p v_p(n) theta_p) be the Bohr lift of the truncated
Dirichlet factor (one phase per prime p <= N).

(a) CLASSICAL (Bohr, Jessen; Kronecker for the independence of the log p). D_N(sigma + it) = B_N(sigma; -t log p),
and the points (t log p mod 2 pi)_p are dense in the torus. D_N has zeros with real part in an interval (s1, s2) at
arbitrarily large heights if and only if B_N has a zero with sigma in (s1, s2) somewhere on the torus (stated here
for transversal zeros; the density of such zeros per unit height is given by Jessen's formula).

(b) ARGUED. For fixed N and t -> infinity the pole term is O(t^{-(k+1)}) and |G(s)/G(1-s)| = (t/2 pi)^{sigma - 1/2}
(1 + O(1/t)). If D_N(s0) = 0 with Re s0 - 1/2 >= delta > 0, Rouche on a circle of radius r around s0 gives a zero of
F within r as soon as (t/2 pi)^delta r exceeds a constant depending on N: an off-line zero of the object. Conversely
if min |B_N| > 0 on the torus for all sigma in [1/2, s2] then F has no zero with 1/2 < Re s < s2 above some height
t0(N). So at large height: stage N passes iff the lift is zero-free to the right of the line.

(c) The lift does not see which torus point is arithmetic. B_N for zeta, evaluated at theta_p + arg eps_p, is B_N
for the twist by any unimodular completely multiplicative eps. At large height zeta and all its unimodular twists
(Liouville included) pass or fail the same stages. A finite stage can only use: the coefficients are completely
multiplicative, of modulus 1 at primes, and weighted by w. This is the Euler-blindness of finite stages in this
scheme family.

(d) MEASURED (`torus.py`, `torus2.py`: multi-start descent, float64; values are upper bounds for the minimum, a value
below 10^-8 is a zero found). Minimum of |B_N| over the torus and sigma in [0.5001, 0.99]:

| input, weight | first N with a torus zero | min at N = 26 / 30 / 100 |
|---|---|---|
| zeta, sharp | 3 | 0 / 0 / 0 |
| zeta, riesz 1 | 27 | 0.0080 / 0 / 0 |
| dh, riesz 1 | 27 | 0.0108 / 0 / 0 |
| chi4, riesz 1 | 50 (N = 40: 0.057) | 0.19 / 0.146 / 0 |
| zeta, riesz 2 | none found for N <= 2000 (0.0037 at N = 300; the descent stalls near 0.01 for N >= 400) | 0.35 / 0.33 / 0.148 |
| dh, riesz 2 | between 150 (0.0004) and 200 (0) | 0.48 / 0.44 / 0.098 |
| chi4, riesz 2 | between 1000 (6*10^-6) and 1500 (0) | 0.57 / 0.54 / 0.28 |
| zeta, riesz 3 / riesz 4 | none for N <= 100 | 0.52 / 0.50 / 0.34 and 0.64 / 0.62 / 0.47 |

For N <= 6 and riesz 1, sum_{n>=2} w(n) n^{-1/2} < 1, so the lift is zero-free by the triangle inequality (PROVED,
trivial); for 7 <= N <= 26 zero-freeness is MEASURED, not certified.

(e) The prediction "zeta fails at N >= 27 at some height" was then tested directly by scanning zeta at large height
(stages 5 and 6 of the screen, 10^6 units of height per task) and certifying the hits:

| N (afep riesz 1, zeta) | height scanned | bad blocks | lowest bad block | status |
|---|---|---|---|---|
| 20, 26, 27, 28 | 6*10^6 | 0 | - | SCREENED clean |
| 29, 30 | 7*10^6, 10^7 | 0 | - | SCREENED clean |
| 31 | 10^7 | 1 | 7968258.63 | CERTIFIED off-axis zero |
| 32 | 10^7 | 3 | 3083366.63 | CERTIFIED |
| 33 | 7*10^6 | 6 | 185053.63 | CERTIFIED |
| 34 | 7*10^6 | 8 | 185053.63 | CERTIFIED |
| 35 | 9*10^6 | 12+ | 185053.63 | CERTIFIED |
| 40 | 6*10^6 | 62 | 185053.63 | CERTIFIED |
| 50 | 6*10^6 | 258 | 57549.63 | CERTIFIED |
| 60 | 6*10^6 | 535 | 32154.63 | CERTIFIED |
| 75 | 6*10^6 | 953 | 32154.63 | CERTIFIED |
| 100 | 6*10^6 | 1164 | 40801.63 | CERTIFIED |
| 150 | 6*10^6 | 1352 | 57549.63 | CERTIFIED |
| 200 | 6*10^6 | 2452 | 104553.63 | CERTIFIED |
| 2000, 5000 | 10^5 | 1, 3 | 37501.63, 50515.63 | SCREENED |

At the first certified failure (N = 35) the truncated factor has a zero at s = 0.50886 + 185053.924 i and the object
has a zero at s = 0.54447 + 185053.937 i (MEASURED, `locate.py`; the certificate is the argument-principle count 1
on [185053.63, 185054.63] x [0.02, 0.49] in z). The same mechanism gives the early Davenport-Heilbronn failure at
N = 30 (object zero 0.5633 + 19239.555 i, factor zero 0.5152 + 19239.554 i): it is a torus zero, not the resolved
zero at 85.7. chi4 (a true L-function) fails in the same way at N = 100, 200 (CERTIFIED, 6 blocks).

Consequence. For this scheme family the map is: N below the torus threshold: every input with the same coefficient
sizes passes at large height, the Davenport-Heilbronn function included (screened clean for every N <= 29 to
T = 2000 and for N = 2, 3, 5, 10, 20 to 10^5). N above the threshold: zeta fails. Inside the tested windows zeta
passes and Davenport-Heilbronn fails only for N = 30 (height 19238) and for N >= 31 below the first zeta failure
height; that reflects where the two torus orbits first meet their zero sets, not a structural separation. For riesz 2 the
same criterion applies; the lift minimum decreases with N (0.33 at N = 30, 0.0037 at N = 300) and no zeta failure
was found up to N = 10^4, T = 2*10^4 and N <= 400, T = 4*10^6. Whether B_N for riesz k >= 2 acquires a zero for
zeta at some N is OPEN here; if it never does, the scheme would pass for zeta at every stage and large height, but
by (c) it would pass equally for every unimodular twist, and by section 3 it does not resolve Davenport-Heilbronn
until N = 750, so it still would not separate at every finite stage.

## 5. Kernel truncations (sibling pipeline, snapshot in `apx/`)

CERTIFIED by the sibling's Taylor-model winding test (section 7 for the list): thalf (half-line N-term theta
kernel) fails for zeta at every N tested (N = 1..4): lowest off-axis zero with Re z in (20.3, 21.2), (43.1, 44.6),
(67.0, 69.4), (103.1, 106.6), and for every control. Reason (ARGUED): the N-term kernel is not even in u, the half-line transform has a kink at
u = 0 and decays like z^-2, so it has finitely many real zeros. polya (Polya-Hejhal K-Bessel truncation), window
T = 200: N = 1, 2 pass for zeta, tw2m, liou and Davenport-Heilbronn (Polya's theorem covers N = 1 for any
single-term kernel); **zeta fails at N = 3 and N = 4** (off-axis zero with Re z in (187.5, 190.6)), tw2m and liou
fail at N = 3, 4 (near 128 and 119), while Davenport-Heilbronn passes N = 1..5. The N-term Polya objects do not
converge to the completed function, so the control's zero at 85.7 is never resolved; the scheme fails for zeta and
passes for the control. The dbn tasks did not finish before the units were stopped: not run.

## 6. Structural summary

| scheme | what a finite stage tests | zeta | control fails when | separation at every finite stage |
|---|---|---|---|---|
| Jensen (d, n) | zeros of F^(n) inside the cone |Im w| <= |w|/sqrt(d) (resolution) | passes (verified height) | d exceeds its cone threshold (dh: 20786 at n = 0; nr: 14; n >= 1 erases the lowest dh pair) | no: below threshold every control passes |
| afe / afep, all weights | at large height: zero-freeness of the Bohr lift right of the line, blind to prime phases; at low height and large N: convergence to the limit function | fails (sharp N >= 3; riesz 1 certified for N = 31..200, predicted for N >= 27); riesz 2 no failure found | N resolves its zeros (dh) or the lift vanishes (ea from N = 5: coefficient size n^a) | no |
| euler | same, with poles on Re s = 0, 1 | fails for every P | - | no |
| thalf | kink of the truncated kernel | fails for every N | - | no |
| polya | zeros of a different function (cosh-symmetrised kernel; no convergence to Xi) | fails at N = 3, 4 (T = 200) | dh passes N = 1..5 | no (reversed) |
| dbn | - | not run to completion | - | - |

The property the controls violate, per scheme: none at unresolved stages. Davenport-Heilbronn violates nothing that
a finite stage of these schemes can see; it fails when the stage has converged far enough to contain its off-line
zero, and the same stage sizes are the ones where zeta's own finite-stage object has zeros off the line at larger
height. E_a fails early because of coefficient size (the lift vanishes for small N). The sign twists are not
controls for zero location in these schemes: their lift is the lift of zeta.

## 7. Tables

(generated by `make_table.py`, `make_height_table.py`, `make_jensen_table.py` from the result files in `results/box/`)

### 7.1 Jensen polynomials (CERTIFIED, Sturm)

| input | shift n | certified PASS (Sturm) degrees | first certified FAIL degree | other |
|---|---|---|---|---|
| dh | 0 | 4, 8, 16, 32, 64, 128, 256, 512 | - |  |
| dh | 8 | 4, 8, 16, 32, 64, 128, 256, 512 | - |  |
| dh | 64 | 4, 8, 16, 32, 64, 128, 256 | - |  |
| ea:0.05 | 0 | 4, 8, 16, 32, 64, 128, 256, 512 | - |  |
| ea:0.05 | 8 | 4, 8, 16, 32, 64, 128, 256, 512 | - |  |
| ea:0.05 | 64 | 4, 8, 16, 32, 64, 128, 256, 512 | - |  |
| ea:0.25 | 0 | 4, 8, 16, 32, 64, 128, 256, 512 | - |  |
| ea:0.25 | 8 | 4, 8, 16, 32, 64, 128, 256, 512 | - |  |
| ea:0.25 | 64 | 4, 8, 16, 32, 64, 128, 256, 512 | - |  |
| heat:-0.05 | 0 | 4, 8, 16, 32, 64, 128 | - |  |
| heat:-0.05 | 8 | 4, 8, 16, 32, 64, 128 | - |  |
| heat:-0.05 | 64 | 4, 8, 16, 32, 64, 128 | - |  |
| heat:-0.25 | 0 | 4, 8, 16, 32, 64 | - |  |
| heat:-0.25 | 8 | 4, 8, 16, 32, 64 | - |  |
| heat:-0.25 | 64 | 4, 8, 16, 32, 64 | - |  |
| heat:-1 | 0 | 4, 8, 16, 32 | - |  |
| heat:-1 | 8 | 4, 8, 16, 32 | - |  |
| heat:-1 | 64 | 4, 8, 16, 32 | - |  |
| heat:0.05 | 0 | 4, 8, 16, 32, 64, 128 | - |  |
| heat:0.05 | 8 | 4, 8, 16, 32, 64, 128 | - |  |
| heat:0.05 | 64 | 4, 8, 16, 32, 64, 128 | - |  |
| nr:3:2.2 | 0 | 4, 8 | 16 |  |
| nr:3:2.2 | 8 | 4, 8, 16, 32, 64, 128, 256, 512 | - |  |
| nr:3:2.2 | 64 | 4, 8, 16, 32, 64, 128, 256, 512 | - |  |
| tw2m | 0 | - | - | NOT_FORMULABLE |
| tw2m | 8 | - | - | NOT_FORMULABLE |
| tw2m | 64 | - | - | NOT_FORMULABLE |
| zeta | 0 | 4, 8, 16, 32, 64, 128, 256, 512 | - |  |
| zeta | 8 | 4, 8, 16, 32, 64, 128, 256, 512 | - |  |
| zeta | 64 | 4, 8, 16, 32, 64, 128, 256, 512 | - |  |

| input | degrees d scanned | shifts n scanned per d | degrees with a certified FAIL: d (failing shifts) | certified PASS for all scanned n: d range |
|---|---|---|---|---|
| dh | 2..400 (74 values) | 0..40 | none | 2..400 (74 values) |
| ea:0.45 | 2..420 (74 values) | 0..30 | 265 (n=0); 316 (n=0); 377 (n=0); 420 (n=0) | 2..222 (70 values) |
| nr:2:2.5 | 2..300 (72 values) | 0..30 | 6 (n=0); 7 (n=0); 8 (n=0); 9 (n=0); 10 (n=0); 11 (n=0) ... 300 (n=0,1) | 2..5 (4 values) |
| nr:3:2.2 | 2..300 (72 values) | 0..30 | 14 (n=0); 15 (n=0); 16 (n=0); 17 (n=0); 18 (n=0); 19 (n=0) ... 300 (n=0) | 2..13 (12 values) |
| zeta | 2..316 (72 values) | 0..300 | none | 2..316 (72 values) |

### 7.2 Large-height runs, Riesz order 1 (full table for all weights: `results/TABLE_height.md`)

Bad blocks are SCREENED; 'certified off-axis zero' lists blocks [x, x+1] x [0.02, 0.49] with certified zero count >= 1; 'certified PASS' is the total height of chunks with certified count 0 above the axis and certified band count = certified sign changes.

| scheme | input | weight | N | height screened (float64) | bad blocks | lowest bad block | certified off-axis zero (Arb) at blocks x | certified PASS, total height covered |
|---|---|---|---|---|---|---|---|---|
| afe | chi4 | riesz1 | 2 | 1e+05 (to 1e+05) | 0 | none | - | 20001 |
| afe | chi4 | riesz1 | 3 | 1e+05 (to 1e+05) | 0 | none | - | 20001 |
| afe | chi4 | riesz1 | 5 | 1e+05 (to 1e+05) | 0 | none | - | 17250 |
| afe | chi4 | riesz1 | 10 | 1e+05 (to 1e+05) | 0 | none | - | 7500 |
| afe | chi4 | riesz1 | 20 | 1e+05 (to 1e+05) | 0 | none | - | 24250 |
| afe | chi4 | riesz1 | 30 | 1e+05 (to 1e+05) | 0 | none | - | 22500 |
| afe | chi4 | riesz1 | 50 | 4e+06 (to 4e+06) | 0 | none | - | - |
| afe | chi4 | riesz1 | 100 | 4e+06 (to 4e+06) | 60 | 22394.63 | 22394.63, 24729.63, 40938.63 | - |
| afe | chi4 | riesz1 | 200 | 4e+06 (to 4e+06) | 378 | 40938.63 | 40938.63, 67644.63, 74481.63 | - |
| afe | chi4 | riesz1 | 400 | 4e+06 (to 4e+06) | 2140 | 76289.63 | - | - |
| afe | chi4 | riesz1 | 500 | 1e+05 (to 1e+05) | 1 | 98490.63 | - | - |
| afe | chi4 | riesz1 | 1000 | 1e+05 (to 1e+05) | 0 | none | - | - |
| afe | chi4 | riesz1 | 2000 | 1e+05 (to 1e+05) | 0 | none | - | - |
| afe | chi4 | riesz1 | 5000 | 1e+05 (to 1e+05) | 0 | none | - | - |
| afe | chi4 | riesz1 | 10000 | 1e+05 (to 1e+05) | 2 | 53006.63 | - | - |
| afe | dh | riesz1 | 2 | 1e+05 (to 1e+05) | 0 | none | - | 12500 |
| afe | dh | riesz1 | 3 | 1e+05 (to 1e+05) | 0 | none | - | 7500 |
| afe | dh | riesz1 | 5 | 1e+05 (to 1e+05) | 0 | none | - | 3750 |
| afe | dh | riesz1 | 10 | 1e+05 (to 1e+05) | 0 | none | - | 750 |
| afe | dh | riesz1 | 20 | 1e+05 (to 1e+05) | 0 | none | - | 21500 |
| afe | dh | riesz1 | 30 | 1e+05 (to 1e+05) | 3 | 19238.63 | 19238.63, 92318.63 | - |
| afe | dh | riesz1 | 50 | 1e+05 (to 1e+05) | 188 | 85.63 | 85.63, 4237.63, 5587.63 | - |
| afe | dh | riesz1 | 100 | 1e+05 (to 1e+05) | 706 | 85.63 | 85.63, 113.63, 176.63 | - |
| afe | dh | riesz1 | 200 | 1e+05 (to 1e+05) | 1094 | 85.63 | 85.63, 113.63, 165.63 | - |
| afe | dh | riesz1 | 500 | 1e+05 (to 1e+05) | 1480 | 85.63 | 85.63, 113.63, 165.63 | - |
| afe | dh | riesz1 | 1000 | 1e+05 (to 1e+05) | 2107 | 85.63 | 85.63, 113.63, 165.63 | - |
| afe | dh | riesz1 | 2000 | 1e+05 (to 1e+05) | 3100 | 85.63 | 85.63, 113.63, 165.63 | - |
| afe | dh | riesz1 | 5000 | 1e+05 (to 1e+05) | 4920 | 85.63 | - | - |
| afe | dh | riesz1 | 10000 | 1e+05 (to 1e+05) | 6524 | 85.63 | - | - |
| afep | ea:0.05 | riesz1 | 2 | 2e+04 (to 2e+04) | 0 | none | - | 12250 |
| afep | ea:0.05 | riesz1 | 3 | 2e+04 (to 2e+04) | 0 | none | - | 7500 |
| afep | ea:0.05 | riesz1 | 5 | 2e+04 (to 2e+04) | 541 | 13.63 | 13.63, 48.63, 122.63 | - |
| afep | ea:0.05 | riesz1 | 10 | 2e+04 (to 2e+04) | 1176 | 13.63 | 13.63, 59.63, 75.63 | - |
| afep | ea:0.05 | riesz1 | 20 | 2e+04 (to 2e+04) | 1706 | 13.63 | 13.63, 20.63, 24.63 | - |
| afep | ea:0.05 | riesz1 | 30 | 2e+04 (to 2e+04) | 2039 | 13.63 | 13.63, 20.63, 32.63 | - |
| afep | ea:0.05 | riesz1 | 50 | 2e+04 (to 2e+04) | 2497 | 13.63 | 13.63, 20.63, 24.63 | - |
| afep | ea:0.05 | riesz1 | 100 | 2e+04 (to 2e+04) | 3038 | 13.63 | 13.63, 20.63, 24.63 | - |
| afep | ea:0.05 | riesz1 | 200 | 2e+04 (to 2e+04) | 3584 | 13.63 | 13.63, 20.63, 24.63 | - |
| afep | ea:0.05 | riesz1 | 500 | 2e+04 (to 2e+04) | 4325 | 13.63 | 13.63, 20.63, 24.63 | - |
| afep | ea:0.05 | riesz1 | 1000 | 2e+04 (to 2e+04) | 5226 | 13.63 | 13.63, 20.63, 24.63 | - |
| afep | ea:0.05 | riesz1 | 2000 | 2e+04 (to 2e+04) | 6066 | 13.63 | 13.63, 20.63, 24.63 | - |
| afep | ea:0.05 | riesz1 | 5000 | 2e+04 (to 2e+04) | 4107 | 13.63 | - | - |
| afep | ea:0.05 | riesz1 | 10000 | 2e+04 (to 2e+04) | 3799 | 13.63 | - | - |
| afep | tw2m | riesz1 | 2 | 2e+04 (to 2e+04) | 0 | none | - | 12500 |
| afep | tw2m | riesz1 | 3 | 2e+04 (to 2e+04) | 0 | none | - | 7500 |
| afep | tw2m | riesz1 | 5 | 2e+04 (to 2e+04) | 0 | none | - | 3750 |
| afep | tw2m | riesz1 | 10 | 2e+04 (to 2e+04) | 0 | none | - | 750 |
| afep | tw2m | riesz1 | 20 | 2e+04 (to 2e+04) | 0 | none | - | - |
| afep | tw2m | riesz1 | 30 | 2e+04 (to 2e+04) | 0 | none | - | - |
| afep | tw2m | riesz1 | 50 | 2e+04 (to 2e+04) | 0 | none | - | - |
| afep | tw2m | riesz1 | 100 | 2e+04 (to 2e+04) | 3 | 2335.63 | 2335.63, 4069.63, 5154.63 | - |
| afep | tw2m | riesz1 | 200 | 2e+04 (to 2e+04) | 7 | 4069.63 | 4069.63, 5154.63, 6423.63 | - |
| afep | tw2m | riesz1 | 500 | 2e+04 (to 2e+04) | 12 | 6607.63 | 6607.63, 8079.63, 8574.63 | - |
| afep | tw2m | riesz1 | 1000 | 2e+04 (to 2e+04) | 12 | 6607.63 | 6607.63, 7562.63, 8574.63 | - |
| afep | tw2m | riesz1 | 2000 | 2e+04 (to 2e+04) | 3 | 14524.63 | 14524.63, 15300.63, 18292.63 | - |
| afep | tw2m | riesz1 | 5000 | 2e+04 (to 2e+04) | 0 | none | - | - |
| afep | tw2m | riesz1 | 10000 | 2e+04 (to 2e+04) | 0 | none | - | - |
| afep | zeta | riesz1 | 2 | 1e+05 (to 1e+05) | 0 | none | - | 20001 |
| afep | zeta | riesz1 | 3 | 1e+05 (to 1e+05) | 0 | none | - | 20001 |
| afep | zeta | riesz1 | 5 | 1e+05 (to 1e+05) | 0 | none | - | 17250 |
| afep | zeta | riesz1 | 10 | 1e+05 (to 1e+05) | 0 | none | - | 7500 |
| afep | zeta | riesz1 | 20 | 1e+07 (to 1e+07) | 0 | none | - | 24252 |
| afep | zeta | riesz1 | 26 | 6e+06 (to 6e+06) | 0 | none | - | - |
| afep | zeta | riesz1 | 27 | 6e+06 (to 6e+06) | 0 | none | - | - |
| afep | zeta | riesz1 | 28 | 6e+06 (to 6e+06) | 0 | none | - | - |
| afep | zeta | riesz1 | 29 | 7e+06 (to 7e+06) | 0 | none | - | - |
| afep | zeta | riesz1 | 30 | 1e+07 (to 1e+07) | 0 | none | - | 22502 |
| afep | zeta | riesz1 | 31 | 1e+07 (to 1e+07) | 1 | 7968258.63 | 7968258.63 | 22250 |
| afep | zeta | riesz1 | 32 | 1e+07 (to 1e+07) | 3 | 3083366.63 | 3083366.63, 7968258.63 | 22250 |
| afep | zeta | riesz1 | 33 | 7e+06 (to 7e+06) | 6 | 185053.63 | 185053.63, 486392.63, 561348.63 | - |
| afep | zeta | riesz1 | 34 | 7e+06 (to 7e+06) | 8 | 185053.63 | 185053.63, 486392.63, 561348.63 (+1) | - |
| afep | zeta | riesz1 | 35 | 1e+07 (to 1e+07) | 18 | 185053.63 | 185053.63, 486392.63, 561348.63 (+15) | - |
| afep | zeta | riesz1 | 40 | 1e+07 (to 1e+07) | 80 | 185053.63 | 185053.63, 269183.63, 407071.63 (+25) | - |
| afep | zeta | riesz1 | 50 | 1e+07 (to 1e+07) | 367 | 57549.63 | 57549.63, 185053.63, 269183.63 (+27) | - |
| afep | zeta | riesz1 | 60 | 1e+07 (to 1e+07) | 855 | 32154.63 | 32154.63, 40801.63, 41867.63 (+27) | - |
| afep | zeta | riesz1 | 75 | 1e+07 (to 1e+07) | 1795 | 32154.63 | 32154.63, 37452.63, 40801.63 (+27) | - |
| afep | zeta | riesz1 | 100 | 1e+07 (to 1e+07) | 2527 | 40801.63 | 40801.63, 46626.63, 48179.63 (+27) | - |
| afep | zeta | riesz1 | 150 | 1e+07 (to 1e+07) | 2502 | 57549.63 | 57549.63, 71127.63, 72396.63 (+24) | - |
| afep | zeta | riesz1 | 200 | 1e+07 (to 1e+07) | 3188 | 104553.63 | 104553.63, 105731.63, 106361.63 (+24) | - |
| afep | zeta | riesz1 | 500 | 1e+05 (to 1e+05) | 0 | none | - | - |
| afep | zeta | riesz1 | 1000 | 1e+05 (to 1e+05) | 0 | none | - | - |
| afep | zeta | riesz1 | 2000 | 1e+05 (to 1e+05) | 1 | 37501.63 | - | - |
| afep | zeta | riesz1 | 5000 | 1e+05 (to 1e+05) | 3 | 50515.63 | - | - |
| afep | zeta | riesz1 | 10000 | 1e+05 (to 1e+05) | 1 | 75371.63 | - | - |

### 7.3 Scheme x input table for the Dirichlet and Euler truncations

`results/TABLE_screen_cert.md` (249 rows: scheme, weight, input, window, N tested, height screened, largest N below the first failing N, first failing N with the height of its lowest bad block, certified PASS coverage, certified FAIL counts).

Totals of the exact tests (Arb): 1984 screened bad blocks tested, 1984 certified as containing an off-axis zero, 0 not confirmed; 4220 screened-clean chunks (total height 9.98*10^5) tested, 4220 certified PASS, 0 contradicted; 29 tasks with the selb weight ended with an error (the weight min(1, 2(1 - log n/log(N+1))) is not decided by interval arithmetic at its corner) and are not counted. Certified PASS ranges for zeta, afep riesz 1 and riesz 2, contiguous from height 0: N = 2, 3 to 20000; N = 5 to 17249; N = 10 to 7499; N = 20 to 2750; N = 30 to 1000; other N <= 25 to 250..750; in addition 22000 units of height in [2*10^4, 2*10^5] for each of N = 30, 31, 32 (riesz 1). 11530 screen tasks in total. The certification queue is resumable (`cert.py` skips finished keys); about 60000 PASS chunks remain unprocessed.


## 8. What ran on the compute server

All jobs were launched through `~/rh-push/bin/rhrun` from `~/rh-push/box-ly-search/` and stopped with
`systemctl --user stop <unit>` (each of my units by its own name; nothing else was touched). Core totals across my
units: at most 10 until 10:02 UTC, at most 16 after the limit was raised. CPU-side peak memory is the systemd
MemoryPeak read while the unit was alive; for units that had already exited it was not recorded (n/r); all were
single-GB or below (the largest observed: 1.02 GB). GPU memory (nvidia-smi samples): up to 26.6 GB on device 0 and
11.1 GB on device 1 (cupy pool limit 24 GB per job; float64 screens only). One listing command
(`sweep.py --list`, prints the task list, no computation) was run directly over ssh at 09:25; everything else went
through the wrapper. All units are stopped (checked: 0 active `rh-bls-*` units at 10:34:11 UTC).

| unit | cores | job | wall time (UTC) | peak memory |
|---|---|---|---|---|
| rh-bls-screen-smoke-1117082837 | 2 | GPU screen smoke test | 08:28:37-08:28:40 | n/r |
| rh-bls-screen-main-1117082846 | 2 | GPU 0: afe 10 weights x 9 inputs x 41 N, two windows, T = 2000; euler | 08:28-08:55 | n/r; GPU 26.6 GB |
| rh-bls-jensen-sturm-1117082856 | 4 | sibling sweep, Jensen Sturm grid (stopped at d = 1024) | 08:28-08:56 | 0.75 GB |
| rh-bls-kernel-1117082856, rh-bls-kernel1-1117083558 | 3, 1 | first kernel sweep with the old library (stopped, superseded) | 08:28-08:36 | n/r |
| rh-bls-jtrack-1117083338 | 1 | Jensen tracker, stopped and relaunched with 4 cores | 08:33-08:56 | n/r |
| rh-bls-cert1-1117083558 / -1117083607, cert2-1117084547, cert3-1117090053, cert4-1117091436 | 2 | Arb certification queue (restarted to reprioritise) | 08:36-10:00 | 0.05 GB |
| rh-bls-screen-s2-1117083622 | 1 | GPU 1: afep, riesz 6 and 8, N = 10^4, 2*10^4 | 08:36-08:45 | n/r |
| rh-bls-screen-s3-1117084515 | 1 | GPU 1: T = 2*10^4 and 10^5 (stopped 3 tasks before the end) | 08:45-09:43 | 0.68 GB; GPU 11 GB |
| rh-bls-jmap-a-1117085511 | 2 | certified Jensen map, zeta | 08:55-09:39 | 0.31 GB |
| rh-bls-jtrack4-1117085626 | 4 | DH Jensen moments and tracker (n = 0) | 08:56-09:31 | n/r |
| rh-bls-screen-s4-1117085626 | 1 | GPU 0: fractional orders, DH thresholds | 08:56-09:00 | n/r |
| rh-bls-screen-s5-1117090016 | 1 | GPU 0: zeta at height up to 10^7, then rest of stage 4 | 09:00-10:34 | 0.65 GB |
| rh-bls-jtrackn-1117093104 | 1 | DH Jensen tracker, shifts 1..3 | 09:31:04-09:31:09 | n/r |
| rh-bls-apx-kernel-1117093104 | 2 | sibling pipeline snapshot: thalf, polya, dbn | 09:31-10:34 | 0.10 GB |
| rh-bls-cert5-1117093205 | 2 | Arb certification, heights 2*10^4 .. 2*10^5 | 09:32-10:34 | 0.03 GB |
| rh-bls-jmap-b-1117093956 | 2 | certified Jensen maps, controls | 09:39-10:34 | 1.02 GB |
| rh-bls-screen-s6-1117094316 | 1 | GPU 1: zeta N = 26..34 to 10^7, riesz 2 N = 300..1000 | 09:43-10:34 | 0.65 GB |
| rh-bls-cert6-1117100041 | 2 | Arb certification queue | 10:00-10:34 | 0.04 GB |
| rh-bls-cert7-1117100248 | 6 | Arb certification queue (reverse order) | 10:02-10:34 | 0.06 GB |

Local runs (Mac): code tests and the torus minimisations, each through `scripts/memcap.sh` with a cap of 4 or 8 GB.

Files: code in this directory (`fscreen.py`, `screen_run.py`, `cert.py`, `gen_cert*.py`, `jensen_track.py`,
`jensen_map.py`, `jensen_gpu.py`, `torus.py`, `torus2.py`, `dzeros.py`, `locate.py`, `shift_check.py`, `make_*.py`;
`lylib.py`, `sweep.py`, `bohr.py`, `selftest.py` are the sibling's files as of 00:18, `apx/` its files as of 00:42);
results in `results/box/` (JSON lines, logs in `results/box/logs/`), torus results in `results/torus*.jsonl`.

## 9. Weakest steps

1. Section 4(b) is an argument, not a proof with constants; the equivalence "passes at large height iff the lift is
   zero-free" is supported by the certified failures at N >= 35 and by clean screens for N <= 30, but the clean
   screens are float64 and finite in height, and the torus minima for 7 <= N <= 26 are descent results, not
   certified lower bounds.
2. SCREENED cells are float64 phase sums. Every bad block that was sent to the Arb test was confirmed, but clean
   blocks were certified only on the ranges listed in section 7; a zero pair closer than 0.02 to the axis inside a
   block with an odd configuration could be missed by the screen and only the certified ranges exclude it.
3. Jensen for Davenport-Heilbronn: the failure at d = 20786 is certified; hyperbolicity at d = 20785 is not (tracked
   pair only), and degrees between 513 and 20785 were not tested by a full real-root count.
