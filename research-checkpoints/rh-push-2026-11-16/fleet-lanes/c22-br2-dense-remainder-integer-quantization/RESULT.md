# c22-br2-dense-remainder-integer-quantization: RESULT

Date 2026-11-20. Round 22, kind: deepen. Scope: this directory only. Nothing committed or pushed.
Server: used through `rhrun` only, after `rhstatus` (units `c22dq-*`: one Arb batch on 5 cores, six float64
GPU-1 jobs on 1 core each, one Arb job on 1 core, two deeper float64 jobs on 1 core each; at most 7 cores and
GPU 1 only; all exited or stopped by the lane; section 3).
Local runs through `scripts/memcap.sh 8` (python3.14, mpmath).
No independent referee has read this file: the lane had no means to start a separate referee process.
`REFEREE.md` is the author's adversarial pass with a second implementation and says so; referees = 0.

**No statement about zeros of zeta is made.** Every result is about the family G = zeta/R_S,
R_S(s) = prod over q in S of (1 - alpha_q q^-s)/(1 - q^-s), abs(alpha_q) = q^(1/2), or about a hypothetical
twin in that family. Requirement flags: R1 = R2 = R3 = R4 = false (section 9). Score 0.

Labels: PROVED (complete argument in this file; author only) / CLASSICAL (recalled, not opened) /
MEASURED (ball arithmetic or float64, as stated) / ARGUED / OPEN.

Sources read: `BRIEF.md` to the end; `c21-br2-sparse-pole-lattice-natural-boundary-or-twin` RESULT.md
(Theorem W, Lemma P, control CYC, section 7) and REFEREE.md; `c21-br2-relative-product-pole-lattice-census-server`
RESULT.md (Lemma P0, P1) and `census.py`; `STRATEGY.md` item 75 and the lead BR text; `OBSTRUCTION_MAP.md` control
rows THIN, DEL, EA, HQ2 to HQ4. The label NWM does not occur in the map; no row was run under that name.
Estermann and Dahlquist were not opened; nothing below is claimed new relative to them (their theorems
concern products over all primes whose local zeros accumulate inside the region; here every local zero is
on the boundary line).

## 0. Verdict

**partial-result.** The dense remainder of regime (K) (sum over S of 1/log q infinite, sum over S of q^-eps
finite for every eps) is decided as "natural boundary, no twin" in three sub-cases (S = {prime nearest e^k}
with phases + or with periodic phases of non-zero B_2-mean; almost every phase assignment on any
super-sparse subfamily of any S) and stays OPEN for an arbitrary phase assignment; a necessary condition
for a finite-order twin is added.

1. (Lemma Q, PROVED: the assigned first lemma, in four forms.) If G is meromorphic near 1/2 + i t0 then on an
   interval of t: log abs R_S(1/2 + delta + it) = n_t log delta + c_t + O(delta) with n_t an integer, zero off a
   finite set; uniformly, the difference from the sum of the n_i log abs(delta + i(t - t_i)) is bounded; and
   the union of the local lattices, band-passed to frequencies between X and 2X, tends to finitely many atoms
   ("hole condition": at all but finitely many lattice points the other lattices have a deficit of exactly
   one point).
2. (Decisive first test, MEASURED on the server.) beta = 1, phases +, ball arithmetic to delta = 2^-60:
   at the 25 heights 2 pi a/b the value y delta 6 b^2/pi^2 is -1.000000 (six digits) from j = 40 on, so the
   "exponent" grows like 2^j (1.4e18 at j = 60 for b = 1); at 50 generic heights the local exponent has median
   -0.248 at j = 60; at six quadratic-irrational heights y - (1/4) log(1/delta) varies by 0.0002 to 0.19 over
   52 octaves; at pole points of single primes the local exponent has median 0.76. No tested height gives an
   integer. Random phases (float64, all three beta, 1e9 factors): the spread of y over heights follows
   sqrt(c_beta delta^(-1/beta)) within sampling error and pole points are not distinguishable from generic
   heights. Phases +, beta = 0.5 (float64, to 6.7e9 factors): y is negative at all 25 resonant limits
   2 pi a/sqrt b and grows by a factor 1.65 per octave; beta = 0.75: growing spread at all heights. CYC returns
   the integers -1 and 0 exactly. Quantization fails in every measured cell of the family.
3. (Theorem E2 with Lemma TR, PROVED relative to the prime-gap input.) For S = {prime nearest e^k} and
   periodic phases theta_k = 2 pi s_k/d with beta_2 = mean of B_2({s_r/d}) non-zero (for signs: mean sign
   different from -1/3): log abs N_1(delta + 2 pi i a/b) = -pi^2 beta_2/(b^2 delta) + O(log^2(1/delta)) on a dense set of
   rationals, hence no continuation across any point. A deterministic family with phases not all +.
   Lemma TR: for every beta <= 1 and every phase assignment, the product over the primes and the product
   with exact frequencies k^beta differ by O(log^(1 + 1/beta)(1/delta)) in log-modulus.
   Proposition E3: at s = 1/2 the expansion is -pi^2 beta_2/delta + e_0 log delta + c with an explicit rational e_0;
   for the signs +,-,- (beta_2 = 0) e_0 = 1/6 (measured 0.166), so that pattern gives no twin either.
4. (Theorem E, PROVED relative to two classical inputs.) For S = {prime nearest e^k} with phases +, and for
   any frequencies lambda_k = k + O(e^(-ck)): log abs N_1(delta + 2 pi i a/b) = -pi^2/(6 b^2 delta) + O(log^2(1/delta)),
   and log abs N_1(delta + it) = (1/4) log(1/delta) + O(1) when t/2 pi is irrational of bounded type and t is not
   a lattice point. Hence no meromorphic continuation across any point of Re s = 1/2. The exponent -1/4 comes
   from the modular invariance of abs(eta)^4 Im tau. The proof uses no property of primes beyond the size of
   lambda_k - k: it holds for the commensurable frequencies lambda_k = k.
5. (Theorem R, PROVED.) For every infinite S, every super-sparse infinite subset A of S and every assignment
   of phases on S minus A: the set of phase assignments on A for which G continues meromorphically across
   some point of the line is contained in a Lebesgue-null set of the torus of A. So a twin, if one exists
   for some phases, is destroyed by almost every change of the phases on any super-sparse subfamily, and
   independent uniform phases give a natural boundary almost surely (measurability CLASSICAL, not checked).
   This covers the rows "random phases" for every beta.
6. (Theorem T, PROVED relative to classical inputs; author only.) A twin of finite order with zeta's
   functional equation in regime (K) has an unbounded number of poles of G/zeta per unit length of the
   critical line; if S is in the dense remainder it also has an unbounded number of zeros of G/zeta per
   unit length. (The integers n_t of Lemma Q are unbounded in both directions along the line.) The step that
   uses distinct primes is Kronecker's theorem for log q; CYC leaves there.
7. (Proposition H, PROVED relative to one classical input: why the methods of round 21 stop.) For
   S = {prime nearest exp(k^beta)}, beta <= 1, the first harmonic sum over S of q^-z continues analytically to
   Re z > -c apart from z = 0, and so does every finite set of harmonics. In the dense remainder the boundary
   is produced by the infinite product structure of the local factors, not by the prime frequencies; for
   beta > 1 (class (W)) the spikes of a single lattice already produce it. Lemma P reads factor sizes,
   Theorem W reads the spikes of one lattice (isolated only when sum 1/log q converges), and a second-moment
   variant meets pair correlations it cannot resolve: none of them decides the dense case.
8. (Proposition PC, PROVED relative to Polya-Carlson.) For generalised primes of norms e^k and every sign
   pattern alpha = +-(norm)^(1/2): natural boundary. Integrality decides every sign pattern in this model;
   it does not transfer to primes near e^k.
9. OPEN: natural boundary for every phase assignment on a dense S. Exact missing lemma in section 7.

What this changes for the lead BR: a second obstruction of the same kind (natural boundary, base-blind,
not R1) now exists on the dense side: for almost every phase assignment (fibrewise), and for the smooth
family at beta = 1 with phases + or periodic phases. With Lemma P0 (phases +, every infinite S) the twin
question in regime (K) with abs(alpha_q) = q^(1/2) is open only on a set of phase assignments that is null in
every super-sparse fibre, and no candidate is known in it.
Whether this meets the stopping rule ("a second refereed obstruction closes regime (K)") is for the planner
and needs an independent referee.

## 1. Plan and what is new against the record

Notation as in the c21 lane: z = s - 1/2 = delta + it; lambda_k = log q_k; alpha_k = q_k^(1/2) e^(i theta_k);
N_1(z) = prod over k of (1 - e^(i theta_k - lambda_k z)),  U(s) = prod over q in S of (1 - q^-s)^-1,
R_S(1/2 + z) = N_1(z) U(1/2 + z). U is analytic and zero-free in Re s > 0, so G = zeta/R_S continues across a
point of the line iff N_1 does. L_k = {(theta_k + 2 pi n)/lambda_k} is the zero lattice of factor k on Re z = 0.
N(x) = #{k: lambda_k <= x}. H = N_1'/N_1 = sum over k, m >= 1 of lambda_k e^(i m theta_k) e^(-m lambda_k z).
F(delta) = -sum over k of log(1 - e^(-lambda_k delta)),  L(delta) = sum over k of log(1 + e^(-lambda_k delta)).

On file: Theorem W (no continuation when sum (log q)^(-gamma) is finite for some gamma < 1, any phases),
Lemma P and its sharpness example CYC, Lemma P0 (phases +, any infinite S: not meromorphic at s = 1/2),
c20 Theorem C (a twin in regime (K) has no off-line zero beyond zeta's; a finite-order twin has a zero of
G/zeta on the line). Tried and not closed: the dense remainder with phases not all +.

New here: Lemma Q (d) (band-pass comb identity with the hole condition); Theorem E with the exponent -1/4;
Lemma TR and Theorem E2 (periodic phases, through the dilogarithm distribution relation);
Proposition PC (integer norms, all signs);
Theorem R; Theorem T (quantitative form of c20 Theorem C (c), and its mirror statement for poles of
G/zeta); Proposition H with the dichotomy at sum 1/lambda; the server measurements of section 3.

The planner's proof sketch ("nested intervals making t resonant with infinitely many lattices, the other
factors controlled by Weyl equidistribution") was examined first. In the smooth family the resonant limit
points exist and are explicit: t = 2 pi a/b^beta is the limit of pole points of the primes q_k with
k = b m^(1/beta) (offsets below e^(-c k^beta)). For beta = 1 the argument closes, through the eta function and
not through Weyl (Theorem E). For a general dense S the "other factors" are N(1/delta) in number, their sum
has fluctuation of order sqrt(N(1/delta)), far above the gain log(1/delta) of a resonant factor, and
equidistribution on a fixed short interval of t does not control their joint phases when the differences
lambda_j - lambda_k are small (section 7). The sketch is not completed in general.

## 2. Lemma Q (quantization)

**Lemma Q (PROVED).** Suppose N_1 (equivalently R_S, equivalently G) has a meromorphic continuation to a
disc D centred at i t0. Let J be a compact interval with iJ inside D, and t_1, ..., t_M the zeros and poles
of the continuation on iJ, with orders n_1, ..., n_M (positive for zeros).
(a) For every t in J: log abs N_1(delta + it) = n_t log delta + c_t + O_t(delta) as delta -> 0+, with n_t = n_i if
    t = t_i and n_t = 0 otherwise. The same holds for log abs R_S(1/2 + delta + it) with another c_t.
(b) There is C_J with abs(log abs N_1(delta + it) - sum over i of n_i log abs(delta + i(t - t_i))) <= C_J for all
    t in J and 0 < delta <= delta_0.
(c) delta H(delta + it) -> n_t for every t in J, and abs(delta H(delta + it)) <= C delta/dist(t, {t_i}) + C delta.
(d) Assume in addition N(x) <= C x^C. Let w be smooth with compact support in (0, infinity),
    w^(xi) = int w(v) e^(i v xi) dv, and
    Sigma_w(X; t) := (1/X) sum over k, m >= 1 of lambda_k w(m lambda_k/X) e^(i m (theta_k - lambda_k t))   (a finite sum).
    Then, exactly,  Sigma_w(X; t) = sum over k of sum over p in L_k of w^(X (p - t)),
    and, uniformly for t in a compact sub-interval of the interior of J,
    Sigma_w(X; t) = sum over i of n_i w^(X (t_i - t)) + O(1/X)   as X -> infinity.
    In particular (hole condition): for every lattice point p of a factor k in J that is not one of the t_i,
    sum over j != k of sum over p' in L_j of w^(X (p' - p)) -> -int w.

Proof. (a), (b): N_1 = g prod (z - i t_i)^(n_i) with g analytic and zero-free on a neighbourhood of iJ.
(c): H = sum n_i/(z - i t_i) + H_0 with H_0 analytic there.
(d), identity: Poisson summation in m, sum over m in Z of f(m) e^(i m phi) = sum over j of f^(phi + 2 pi j) with
f(x) = w(x lambda/X), f^(xi) = (X/lambda) w^(X xi/lambda); terms m <= 0 vanish because w is supported in (0, infinity);
(phi + 2 pi j)/lambda_k with phi = theta_k - lambda_k t runs over p - t, p in L_k.
(d), limit: with W_X(u) = int w(x) e^(u X x) dx (entire), Fourier inversion gives
w(mu/X)/X = (1/2 pi i) int over Re u = c of W_X(u) e^(-mu u) du, so
Sigma_w(X; t) = (1/2 pi i) int over Re u = c of H(it + u) W_X(u) du (c > 0; absolute convergence). Take c = 1/X;
then abs W_X(1/X + i tau) <= C_A (1 + X abs tau)^-A for every A. On abs tau <= h (h fixed with the box inside D):
a pole term n_i/(u - i s), s = t_i - t, contributes n_i W_X(i s) = n_i w^(X s) (close the contour to the left,
where W_X decays, w being supported in x > 0) up to O((X h)^(1-A)); H_0 contributes O(int abs W_X) = O(1/X).
On abs tau > h: abs H(it + 1/X + i tau) <= sum over k of lambda_k/(e^(lambda_k/X) - 1) <= C X^(C+2) (terms with lambda_k <= X are at
most X each; the others are at most 2 lambda_k e^(-lambda_k/X)),
against C_A int over abs tau > h of (X tau)^-A d tau. Choose A > C + 3. (The truncation of the pole terms to
abs tau <= h costs O((X h)^(1-A)/h).) QED

Remarks. (i) Form (a) is the assigned statement. Form (b) is the one used below: N_1 meromorphic near a
point implies that log abs N_1 is bounded on some half-neighbourhood {0 < delta < delta_0, t in I} (take I free
of the t_i). So: **if log abs N_1 is unbounded on every half-neighbourhood of every boundary point, the line
is a natural boundary** (statement U; sufficient, not necessary).
(ii) Form (d) is the comb reformulation asked for in section 7 of the c21 lane: the sum of all lattice combs,
band-passed, must be a finite set of atoms. Each lattice point carries a unit atom that the remaining
lattices have to remove. In CYC they do: p in L_k is the midpoint of a gap of every L_j, j > k, and the
deficits add to one (measured: exponent 0 at every zero point of a factor, section 3).

## 3. Decisive first test (server) and controls: MEASURED

Object: y(delta, t) = log abs N_1(delta + it), delta = 2^-j, for S_beta = {distinct primes nearest exp(k^beta)},
beta = 1, 0.75, 0.5, phases + (theta = 0) and "random" (theta_k = 2 pi u_k, u_k from a fixed 64-bit hash,
seed 1). Local exponent n_eff(j) = (y_j - y_(j-1))/(-log 2): the n of y = n log delta, read on one octave.
Heights (100 per cell, `common.py`): 50 constructed, 50 generic (uniform in (0.5, 12), fixed seed).
Constructed, phases +: 25 pole points 2 pi n/log q (q = 19, 53, 149, 401, 1097 for beta = 1; n = 1..5) and the
25 resonant limits 2 pi a/b^beta, b <= 8. Constructed, random phases: 50 pole points (theta_i + 2 pi n)/log q_i
of 10 primes.

Depth. The assignment asked for j <= 60 in ball arithmetic. For a dense set the number of factors with
lambda_k delta <= 40 is (40/delta)^(1/beta): 4.6e19 at j = 60 for beta = 1. A direct product was run to
j = 25 (beta = 1), 17 or 18 (beta = 0.75), 10 or 11 (beta = 0.5), that is 1e9 to 7e9 factors per cell. So:
- beta = 1, phases +: ball arithmetic to j = 60 through N_1(z) = E(z) prod over k <= 400 of
  (1 - e^(-lambda_k z))/(1 - e^(-kz)), E(z) = prod (1 - e^(-kz)) from the Dedekind eta function (Arb
  `modular_eta`, 512 bits). Radii below 1.1e-38 include a tail term that ASSUMES abs(log q_k - k) <= e^(-k/3)
  for k > 400 (true for large k by the classical prime-gap theorems, not explicit at k = 400; the primes
  for k <= 400 are certified below 300 bits and BPSW above). `arb_census.py eta`, `out/eta_b1_plus.json`.
- all six cells: float64 direct sums on GPU 1 (`gpu_census.py`; every k with lambda_k delta <= 40; lambda_k from the
  certified nearest prime while k^beta <= 36, k^beta above, the difference being below 1e-13). A float64 result
  is a screen. 72 cells were recomputed as ball products with the same frequency definition
  (`arb_census.py cross`): largest difference 3.5e-10 (table below).

### 3.1 beta = 1, phases +, ball arithmetic, j = 2..60 (`analyse_eta.py`, `analyse_eta.log`)

| Heights | Result |
|---|---|
| 25 rationals t = 2 pi a/b | y delta 6 b^2/pi^2 = -0.9995 to -0.99994 at j = 20; -1.000000 at j = 40 and j = 60, all 25. n_eff at j = 60: 1.368e18 (b = 1), 3.42e17 (b = 2), ..., 2.14e16 (b = 8) |
| 25 pole points of 19, 53, 149, 401, 1097 | y decreases; n_eff at j = 45: median 0.768 (21 of 25 rows between 0.5 and 0.9); at j = 60 median 0.760, range -3.99 to 6.11; mean exponent over j = 30..60: median 0.746 |
| 50 generic | n_eff at j = 60: median -0.248 (min -33.7, max 2.51); mean exponent over j = 30..60: median -0.2507; median of y: 1.59, 3.36, 4.94, 6.75, 8.58, 10.46 at j = 10, 20, ..., 60; excursions down to -46 |
| log abs rho at t = 2 pi (the correction to the eta function in Theorem E (a)) | 96.6, 387.5, 860.6 at j = 20, 40, 60, against log^2(1/delta)/2 = 96, 384, 865; half of that for b = 2 |
| 6 quadratic irrationals t/2 pi (`out/btype.json`) | y - (1/4) log(1/delta) over j = 8..60: golden mean 0.2275 to 0.2277; 1 + golden -0.0043 to -0.0039; sqrt 2 - 1: 0.268 to 0.288; sqrt 3 - 1: -0.076 to -0.018; sqrt 7 - 2: 0.275 to 0.463; (sqrt 13 - 1)/2: 0.780 to 0.841 |

Reading. Three behaviours, none an integer: -pi^2/(6 b^2 delta) at rationals (Theorem E (a)); exponent -1/4 at
heights of bounded type (Theorem E (b)); 3/4 = 1 - 1/4 at the pole point of a single prime (its own zero on
the -1/4 background; these points are not of bounded type provably, so this row is MEASURED only). The
excursions at generic heights are the approaches to rationals.

### 3.2 float64 census, all cells (`analyse_gpu.py`, `analyse_gpu.log`)

All depths listed are complete (every k with lambda_k delta <= 40). Run times 831 to 1325 s per cell, six cells
concurrently on GPU 1. "sd" is the standard deviation of y over the heights of the group. For random phases
the prediction is sd^2 = (1/2) sum over k of Li_2(e^(-2 lambda_k delta)) = Gamma(1 + 1/beta) zeta(2 + 1/beta) 2^(-1-1/beta) delta^(-1/beta)
(independent uniform phases; 0.3005/delta, 0.2621 delta^(-4/3), 0.2706 delta^-2).

| Cell | deepest j, factors | constructed heights | 50 generic heights | ball cross-check (12 cells each) |
|---|---|---|---|---|
| beta = 1, + | 25, 1.34e9 | 25 rationals: y delta = -1.64493 (b = 1; -pi^2/6 = -1.644934), -0.41123 (b = 2), ..., -0.02570 (b = 8) at j = 23, 24, 25; n_eff at j = 25 between 6.2e5 and 4.0e7. 25 pole points: n_eff median 0.76 at j = 23 and 25 (range -0.60 to 6.19 at j = 25) | n_eff median between -0.28 and -0.20 at every odd j from 9 to 25 (-0.25 at j = 25); y median 4.34, max 15.64, min -1.34 at j = 25 | 3.5e-10 |
| beta = 1, random | 25, 1.34e9 | 50 pole points: sd 3126, range -6780 to 5096; n_eff from -3482 to 4000 | sd 3704, range -7121 to 7312; predicted sd 3175 | 3.0e-10 |
| beta = 0.75, + | 17, 9.1e8 | 25 heights 2 pi a/b^0.75: sd 129, range -518 to 67 (sd 68 at j = 15); values of both signs, not monotone in j at single heights (a/b = 1/1: -50.7, -47.6, -43.1 at j = 15, 16, 17). 25 pole points: sd 36, median -26 | sd 41.9, range -148 to 112 (sd 26.5 at j = 15, 14.6 at j = 13); n_eff from -63 to 77 | 4.0e-11 |
| beta = 0.75, random | 17, 9.1e8 | sd 1423, range -3502 to 3165 | sd 1429; predicted sd 1343 | 1.0e-11 |
| beta = 0.5, + | 10, 1.68e9 | 25 heights 2 pi a/b^0.5: all negative at j = 10 (-44.1 to -3.5, median -11.2; median -4.3 at j = 8, -1.2 at j = 6); n_eff at j = 10 between 2.2 and 27.3, median 7.0. 25 pole points: median -4.0, n_eff median 1.24 | sd 3.5, median 0.42, range -8.5 to 8.4 (sd 2.8 at j = 8); n_eff median -0.22 | 3.6e-12 |
| beta = 0.5, random | 10, 1.68e9 | sd 524, range -1420 to 902 | sd 428; predicted sd 533 | 2.4e-12 |

Two deeper runs for phases + (`out/gpu_*_plus_deep.json`, `analyse_deep.log`; one further octave each):
beta = 0.5 at j = 11 (6.7e9 factors, 2422 s): the 25 heights 2 pi a/sqrt b have y between -72.7 and -7.4, median
-18.7 (y_11/y_10 between 1.43 and 2.21, median 1.65; all local exponents between 3.7 and 41); generic sd 3.95,
range -7.3 to 8.7. beta = 0.75 at j = 18 (2.3e9 factors needed, run stopped by its time limit at 3.4e9;
depths 16 and 17 agree with the first run to 2e-11): generic sd 53.9, range -201 to 154; heights
2 pi a/b^0.75: sd 180, range -732 to 57.

Reading.
- Random phases, all beta: y has the size sqrt(c_beta delta^(-1/beta)) at every kind of height (measured/predicted sd
  between 0.80 and 1.17 at the deepest j in the six groups); the term log delta of a pole point (17 at
  j = 25) is not visible. No height returns an integer exponent; the local exponent is of the size of the
  spread itself. This is the behaviour Theorem R proves to be non-continuable for almost every phase
  assignment.
- beta = 1, phases +: the float64 rows repeat the ball rows of 3.1 on their range.
- beta = 0.5, phases +: the resonant limits t = 2 pi a/sqrt b (limits of pole points of the primes with index b m^2)
  separate from generic heights: y is negative at all 25 at j = 10 and j = 11, with every local exponent
  above 2.2 (j = 10) and 3.7 (j = 11), and the median goes -4.3, -6.5, -11.2, -18.7 at j = 8, 9, 10, 11 (a
  factor 1.65 per octave, about delta^(-0.7)); generic heights stay within +-9. The resonant factors alone would give -pi^2/(6 sqrt b delta)
  (-1684 at j = 10, b = 1); the measured -23.9 shows that the other factors return all but a lower-order
  part, as they return the fraction 1 - 1/b at beta = 1. The depth does not fix the exponent. Not a proof.
- beta = 0.75, phases +: the spread grows at generic heights as well (sd 14.6, 26.5, 41.9, 53.9 at j = 13, 15, 17,
  18; about delta^(-0.35)) and is three times larger on the heights 2 pi a/b^0.75, with both signs. Growth beyond
  every multiple of log(1/delta) is indicated at generic heights (53.9 against log(1/delta) = 12.5), not
  established.

### 3.3 Controls (ball arithmetic, j = 2..60; `out/cyc.json`, `out/thin.json`)

| Control | Predicted | Measured |
|---|---|---|
| CYC: prod (1 + w^(2^k)), w = 3^-z (75 factors) | 1/(1 - w): exponent -1 at w = 1, 0 elsewhere, including the zero points of every factor | n_eff = -1.000000 at the three points w = 1 (y = 41.4948 at j = 60); n_eff = 0.000000 at 15 zero points of factors k = 0, 1, 2, 5, 9 and at 3 generic points (y constant to 4 decimals from j = 30) |
| DEL (alpha = 0) on S_1, at s = 1/2 + delta + it | relative product absolutely convergent on the line: exponent 0 | y changes by less than 0.67 between j = 2 and j = 60 at 8 heights (pole, rational, generic); constant from j = 20 |
| THIN (alpha = -1) on S_1 | same | changes by less than 1.21; constant from j = 20 |
| CYC against Theorem R, T | CYC is one point of the phase torus (all theta = pi) with dependent norms | not in contradiction: Theorem R is an almost-every statement; Theorem T's Kronecker step fails for CYC (section 8) |

CYC returns integers; the family S_beta returns none.

## 4. Theorem E (beta = 1: near-integer frequencies, phases +)

**Theorem E (PROVED relative to CLASSICAL inputs (i), (ii)).** Let lambda_k = k + eps_k, k >= 1, with
abs eps_k <= C e^(-ck) for some c > 0, and N_1(z) = prod (1 - e^(-lambda_k z)).
(a) For integers a and b >= 1 with a/b in lowest terms (a = 0: b = 1): log abs N_1(delta + 2 pi i a/b) = -pi^2/(6 b^2 delta) + O_(a,b)(log^2(1/delta)).
(b) If x = t/2 pi is irrational with bounded partial quotients and t is in no lattice L_k:
    log abs N_1(delta + it) = (1/4) log(1/delta) + O_t(1). If such a t lies in exactly one L_k (not known to occur):
    -(3/4) log(1/delta) + O_t(1).
(c) N_1 has no meromorphic continuation to a neighbourhood of any point of Re z = 0; with any base
    meromorphic near the line in place of zeta, Re s = 1/2 is a natural boundary of the corresponding G.
The hypothesis holds for S_1 = {prime nearest e^k} with any c < 0.475 (input (ii)).

Inputs. (i) CLASSICAL: for eta(tau) = e^(pi i tau/12) prod (1 - e^(2 pi i k tau)), the function abs(eta(tau))^4 Im tau is
invariant under SL_2(Z); eta does not vanish in the upper half-plane. (ii) CLASSICAL: for large x there is a
prime in (x - x^0.525, x] (Baker-Harman-Pintz; any exponent below 1 suffices).

Proof. E(z) := prod (1 - e^(-kz)) = e^(-pi i tau/12) eta(tau) with tau = iz/2 pi = x' + iy, x' = -t/2 pi, y = delta/2 pi.
rho(z) := N_1(z)/E(z) = prod rho_k, rho_k = (1 - e^(-lambda_k z))/(1 - e^(-kz)).
Elementary bound (*): for 0 <= r <= 1, abs(1 - r e^(i phi)) >= max(1 - r, (2/pi) min(dist(phi, 2 pi Z), pi/2)).
Also abs((1 - e^(-lambda_k z)) - (1 - e^(-kz))) <= 2 abs(eps_k z) when abs(eps_k z) <= 1.
(a) Take t = 2 pi a/b. tau = -a/b + iy maps under an element of SL_2(Z) with bottom row (b, a) to a point of
imaginary part 1/(b^2 y); by (i), log abs eta(tau) = -(1/2) log(b y) - pi/(12 b^2 y) + O(e^(-2 pi/(b^2 y))), so
log abs E(z) = -pi^2/(6 b^2 delta) + (1/2) log(2 pi/(b delta)) + O(delta).
Upper and lower bounds for log abs rho. If b does not divide k: dist(kt, 2 pi Z) >= 2 pi/b, so abs(1 - e^(-kz)) >= min(4/b, 1) >= 1/b by (*),
and abs(rho_k - 1) <= 2 b abs(eps_k z) and the sum over these k of abs log abs rho_k is bounded uniformly in delta
(finitely many k with 2 b abs(eps_k z) > 1/2 are bounded separately: numerator at most 2 and at least
min(lambda_k delta, 1)/2 or a positive constant, denominator between 1/b and 2; each contributes
O(log(1/delta))). If b divides k: the denominator is 1 - e^(-k delta) >= min(k delta, 1)/2 and the numerator is at
most 2 and at least 1 - e^(-lambda_k delta) >= min(lambda_k delta, 1)/2, so abs log abs rho_k <= log(8/delta) for the
k <= K_delta := (3/c) log(1/delta),
and abs(rho_k - 1) <= 4 abs(eps_k z)/min(k delta, 1) <= C' delta^2 e^(-c(k - K_delta)) for k > K_delta, with a bounded
sum. Total: abs log abs rho(delta + it) <= C log^2(1/delta).
(b) For p/q in lowest terms, abs(q x - p) >= kappa/q with kappa > 0 (bounded type). For every element of
SL_2(Z) with bottom row (q, -p): Im = y/((q x' - p)^2 + q^2 y^2) <= y/(kappa^2/q^2 + q^2 y^2) <= 1/(2 kappa). So the
representative of tau in the standard fundamental domain has imaginary part in [sqrt 3/2, 1/(2 kappa)], where
abs(eta)^4 Im is bounded above and below; by (i), log abs eta(tau) = -(1/4) log y + O(1) and
log abs E(z) = (1/4) log(1/delta) + O(1).
For rho: dist(kt, 2 pi Z) = 2 pi dist(kx, Z) >= 2 pi kappa/k, so abs(1 - e^(-kz)) >= 4 kappa/k by (*) and
abs(rho_k - 1) <= k abs(eps_k z)/(2 kappa), summable uniformly in delta. For the finitely many k where this exceeds
1/2: the denominator is between 4 kappa/k and 2; the numerator is at most 2 and, if t is not in L_k, at least
(2/pi) min(dist(lambda_k t, 2 pi Z), pi/2) > 0 by (*). So log abs rho = O(1). If t is in L_k for one k the numerator
of that factor is 1 - e^(-lambda_k delta), which adds log delta + O(1).
(c) A function meromorphic near i t and not identically zero satisfies abs log abs f(delta + it) <= n log(1/delta) + C
with an integer n and limit behaviour n log delta + c (Lemma Q (a)). (a) violates the bound at every rational
multiple of 2 pi (a = 0 included); (b) gives the non-integer exponent -1/4 on a dense uncountable set. N_1 is
zero-free in Re z > 0, so it is not identically zero. QED

Remarks. (i) Either of (a), (b) alone gives (c). (ii) The proof does not use that the q_k are distinct
primes, nor independence of the lambda_k: it holds for lambda_k = k exactly (the Euler function; frequencies
commensurable, norms e^k). In the dense regime independence is therefore not what separates natural
boundary from continuation; in the sparse regime it was (CYC against Theorem W). (iii) The same proof gives
the statement for phases theta_k = k vartheta (a shift of t by vartheta) and nothing for other phases.
(iv) For beta < 1 with phases + the lane has no proof of the boundary away from z = 0 (Lemma P0 covers
z = 0, which already excludes a twin); section 3.2 has the measurements.

### 4.1 Transfer lemma and periodic phases

**Lemma TR (transfer to the model with exact frequencies; PROVED relative to input (ii)).** Let 0 < beta <= 1,
lambda_k = k^beta + eps_k with abs eps_k <= C e^(-c k^beta) (true for S_beta up to finitely many indices), and let
c_k be arbitrary unimodular numbers. Put N(z) = prod (1 - c_k e^(-lambda_k z)), N_mod(z) = prod (1 - c_k e^(-k^beta z)).
Then for abs t <= T and 0 < delta <= 1/2:  abs(log abs N(delta + it) - log abs N_mod(delta + it)) <= C_T log^(1 + 1/beta)(1/delta),
uniformly in the phases.
Proof. For k^beta <= K_delta := (3/c) log(1/delta) (at most K_delta^(1/beta) indices): numerator and denominator of
rho_k = (1 - c_k e^(-lambda_k z))/(1 - c_k e^(-k^beta z)) are at most 2 and at least 1 - e^(-lambda delta) >= min(lambda delta, 1)/2, so
abs log abs rho_k <= log(8/delta). For larger k: abs(rho_k - 1) <= 4 abs(eps_k z)/min(k^beta delta, 1) <= C' delta^2 e^(-c(k^beta - K_delta)),
with a bounded sum. QED
Consequence (with Lemma Q (b)): if the product over the primes of S_beta with phases c_k continues
meromorphically across a point, then log abs N_mod is O(log^(1 + 1/beta)(1/delta)) on a half-neighbourhood. So any
growth of the exact-frequency model beyond a power of log(1/delta), at one point of every interval, gives
the natural boundary for the primes.

**Theorem E2 (periodic phases; PROVED relative to input (ii)).** Let lambda_k = k + O(e^(-ck)) (for instance
S_1), and theta_k = 2 pi s_k/d with integers s_k periodic in k of period M. Let
beta_2 := (1/M) sum over r mod M of B_2({s_r/d}),  B_2(x) = x^2 - x + 1/6.
Then for gcd(a, b) = 1, b = 1 mod d, gcd(b, M) = 1:
log abs N_1(delta + 2 pi i a/b) = -pi^2 beta_2/(b^2 delta) + O(log^2(1/delta)).
If beta_2 != 0, N_1 has no meromorphic continuation across any point of Re z = 0.
For signs (d = 2) with mean value m of the sign over a period: beta_2 = (1 + 3m)/24; the condition is m != -1/3.
Proof. By Lemma TR it suffices to treat N_mod = prod (1 - c_k e^(-kz)), c_k = e^(i theta_k). Let L = M b and
u_r = c_r e^(-2 pi i a r/b) (period L in r). sum over k of log abs(1 - u_k e^(-k delta)) = sum over r = 1..L of
sum over n >= 0 of g_r((r + nL) delta), g_r(x) = log abs(1 - u_r e^(-x)). If u_r != 1, g_r is smooth of bounded variation on
[0, infinity) and the inner sum is (1/(L delta)) int_0^inf g_r + O_L(1). If u_r = 1, g_r is increasing and the inner sum
lies between g_r(r delta) + (1/(L delta)) int over x > r delta of g_r and (1/(L delta)) int over x > r delta of g_r, which is
(1/(L delta)) int_0^inf g_r + O(log(1/delta)). And int_0^inf log abs(1 - u e^(-x)) dx = -Re Li_2(u) = -sum over n >= 1 of Re u^n/n^2.
So log abs N_mod = -(1/(L delta)) sum over n of n^-2 Re sum over r mod L of u_r^n + O_L(log(1/delta)). By the Chinese remainder
theorem (gcd(b, M) = 1) the inner sum is (sum over r mod M of c_r^n)(sum over r mod b of e^(-2 pi i n a r/b)), which is
L mu_n if b | n and 0 otherwise, mu_n the mean of c_r^n over a period. For n = b l, c_r^n = c_r^l because b = 1 mod d.
Hence the leading coefficient is -(1/b^2) sum over l of Re mu_l/l^2 = -(pi^2/b^2) beta_2
(sum over l >= 1 of cos(2 pi l x)/l^2 = pi^2 B_2({x})). The rationals a/b with b = 1 mod d and gcd(b, M) = 1 are dense. QED
Checks: phases +: beta_2 = 1/6, Theorem E (a). All signs minus: beta_2 = -1/12, log abs prod (1 + e^(-k delta)) = pi^2/(12 delta).
MEASURED (`periodic_check.py`, server, float64 direct sums with the certified primes for k <= 36; values of
y delta b^2/pi^2 at j = 20, to be compared with -beta_2):

| Pattern (period) | -beta_2 | a/b = 0/1 | 1/1 | 1/5 | 2/7 | 3/13 | 5/49 |
|---|---|---|---|---|---|---|---|
| + | -0.166667 | -0.166666 | -0.166657 | -0.166630 | -0.166612 | -0.166534 | -0.165284 |
| all minus | +0.083333 | +0.083333 | +0.083333 | +0.083332 | +0.083330 | +0.083330 | +0.083274 |
| +,- (2) | -0.041667 | -0.041667 | -0.041662 | -0.041649 | -0.041646 | -0.041638 | -0.041640 |
| +,+,- (3) | -0.083333 | -0.083333 | -0.083327 | -0.083313 | -0.083311 | -0.083306 | -0.083266 |
| cube roots 1, w, w^2 (3) | -0.018519 | -0.018519 | -0.018515 | not admissible | -0.018516 | -0.018552 | -0.019007 |
| fourth roots 1, i, i, -i (4) | -0.026042 | -0.026042 | -0.026039 | -0.026037 | not admissible | -0.026150 | -0.026852 |
| +,-,- (3): beta_2 = 0 | 0 | -0.0000004; y = -1.65, -2.11, -2.57 at j = 12, 16, 20 | y = 32.8 at j = 20 | y = 2.95 | y = 0.74 | y = -1.51 | y = -3.19 |

**Proposition E3 (central point for periodic phases; PROVED relative to the classical asymptotics of
(q^r; q^M)_infinity).** In the setting of Theorem E2, at t = 0:
log N_1(delta) = -pi^2 beta_2/delta + e_0 log delta + c + o(1),  e_0 = sum over r in {1, ..., M} with c_r = 1 of (1/2 - r/M).
So G is not meromorphic at s = 1/2 unless beta_2 = 0 and e_0 is an integer.
Proof. For the model: the classes with c_r != 1 give -(1/(M delta)) Re Li_2(c_r) + O(1) with a limit (Euler-Maclaurin,
smooth integrand); a class with c_r = 1 gives log (q^r; q^M)_infinity at q = e^-delta, which is
-pi^2/(6 M delta) + (1/2 - r/M) log(M delta) + log Gamma(r/M) - (1/2) log 2 pi + o(1) (CLASSICAL; Mellin transform
Gamma(w) zeta(w + 1) M^-w zeta(w, r/M), with zeta(0, x) = 1/2 - x). Transfer at t = 0 is exact in the limit: for
a class with c_r = 1 the quotient (1 - e^(-lambda_k delta))/(1 - e^(-k delta)) lies between 1 and lambda_k/k and tends to
lambda_k/k; for the other classes the quotients tend to 1 with summable deviations; so log abs rho(delta)
converges. QED
Example: signs +,-,- of period 3 (beta_2 = 0, the case not covered by Theorem E2): e_0 = 1/2 - 1/3 = 1/6.
Measured: y changes by -0.46 per four octaves in the table (prediction (1/6) 4 log 2 = 0.462). The exponent
1/6 is not an integer: no twin with this sign pattern on S_1. For signs of period 3 with beta_2 = 0, e_0 is
1/6, -1/6 or -1/2 according to the position of the + class; none is an integer.
This is a deterministic family of phase assignments on a dense set of primes, not all +, for which the
natural boundary is proved. The patterns with beta_2 = 0 (for signs: mean -1/3, for instance +,-,- of period 3)
are not covered at these rationals; other denominators were not examined; Proposition E3 above treats
them at the central point.

**Proposition PC (integer norms, every sign pattern; PROVED relative to the Polya-Carlson theorem,
CLASSICAL).** Let eps_k in {+1, -1} be arbitrary, k >= 1. Then prod over k >= 1 of (1 - eps_k e^(-kz)) has
Re z = 0 as a natural boundary. (Generalised primes of norms e^k, alpha = +-(norm)^(1/2), all signs.)
Proof. f(w) = prod (1 - eps_k w^k) has integer Taylor coefficients and converges in abs w < 1. By
Polya-Carlson a power series with integer coefficients and radius of convergence 1 is rational or has the
unit circle as natural boundary (radius above 1 would make it a polynomial, also rational). If f were
rational, zero-free and pole-free in abs w < 1, then -w f'/f = sum over m of c_m w^m with
c_m = sum over zeros and poles rho of (order) rho^-m, bounded in m because abs rho >= 1. But
c_m = sum over k | m of k eps_k^(m/k), and for a prime p: c_p = eps_1^p + p eps_p, abs c_p >= p - 1. QED
This is a deterministic statement for every sign pattern in a dense system, obtained from integrality.
It does not transfer to S_1 = {prime nearest e^k} with signs: the quotient of the two products has zeros
and poles dense on the line, and Polya-Carlson gives no rate. For S_1 with a non-trivial sign pattern the
natural boundary is OPEN. (Theorem R does not cover random signs: its Borel-Cantelli step needs a
continuous distribution of each phase; with two values the exceptional probabilities are not summable.)

## 5. Theorem R (almost every phase assignment)

Call a set A = {k_1 < k_2 < ...} of indices super-sparse if mu_i := lambda_(k_i) >= e^(i^2) for all i. Every
infinite S contains one. For theta in the torus T^A write N_A^theta(z) = prod over i of (1 - e^(i theta_i - mu_i z)).

**Lemma X (PROVED).** For almost every pair (theta, theta') in T^A x T^A (product Lebesgue measure; the
exceptional set is Borel), the function Xi(z) = N_A^theta(z)/N_A^theta'(z) has no meromorphic continuation to any
disc centred on Re z = 0.

Proof. Fix a rational interval I = (a, b). For each i with mu_i (b - a) > 2 pi let p_i = p_i(theta_i) be the
smallest point of L_i(theta_i) = {(theta_i + 2 pi n)/mu_i} above a; p_i is in I. Let phi'_l = theta'_l - mu_l p_i.
Given theta, the theta'_l are independent and uniform, so the probability that dist(phi'_l, 2 pi Z) < l^-2 is
l^-2/pi. By Borel-Cantelli, for almost every theta' this happens for finitely many l only; also almost
surely no phi'_l (l != i) is in 2 pi Z, theta'_i != theta_i, and the p_i are pairwise distinct. On this event,
at z = delta + i p_i, with n(delta) := #{l: mu_l delta < 1} <= sqrt(log(1/delta)):
- factor i: numerator 1 - e^(-mu_i delta) <= mu_i delta; denominator at least d_i := (2/pi) min(dist(theta'_i - theta_i, 2 pi Z), pi/2) > 0 by (*);
- l != i, mu_l delta < 1: numerator at most 2; denominator at least (2/pi) l^-2 for all but finitely many l and at
  least a positive constant for those (by (*)); product of the quotients at most C_i pi^n (n!)^2;
- l with mu_l delta >= 1: numerator at most 1 + e^(-mu_l delta), denominator at least 1 - e^(-mu_l delta); since
  mu_(l+1)/mu_l >= e^3, the sum of e^(-mu_l delta) over these l is at most sum over j >= 0 of e^(-e^(3j)) < 0.4; the product
  of the quotients is at most e^2.
So abs Xi(delta + i p_i) <= C_i' delta exp(sqrt(L) (log pi + log L)), L = log(1/delta), which tends to 0. If Xi were
meromorphic on a disc D, take a rational I with closure inside D: every p_i (i large) would be a zero of
the continuation (a meromorphic function with radial limit 0 at a point vanishes there), infinitely many
distinct zeros in a compact subset of D, so Xi = 0 identically; but Xi is zero-free in Re z > 0. The
exceptional set is a countable union over (I, i) of Borel null sets. QED

**Theorem R (PROVED).** Let S be an infinite set of primes with sum over S of q^-eps finite for every eps > 0,
A a super-sparse subset of the index set, and fix arbitrary phases on the complement of A. Then the set
B of theta_A in T^A for which N_1 (equivalently G = zeta/R_S) has a meromorphic continuation to some disc
centred on the critical line is contained in a Lebesgue-null set of T^A.

Proof. For a rational disc D let B_D be the set of theta_A for which N_1 continues to D. If theta_A and
theta'_A are both in B_D, the quotient of the two functions N_1 is Xi (the factors outside A are the same and
cancel in Re z > 0), meromorphic on D. So B_D x B_D is inside the null set Z of Lemma X. By Fubini the
sections Z_x = {x': (x, x') in Z} are null for all x outside a null set Q. If B_D is not inside Q, pick x in
B_D outside Q: B_D is inside Z_x. In both cases B_D is inside a null set; B is a countable union. QED

Consequences and limits.
- No measurability of B is used. For independent uniform phases on all of S, "natural boundary almost
  surely" follows if the set of continuable phase vectors is measurable for the product measure (it is the
  projection of a Borel set, hence universally measurable: CLASSICAL, not checked here).
- The theorem holds over any base and for any generalised primes (no independence is used: the free
  phases supply it). CYC is a point of the exceptional null set.
- A deterministic phase assignment is a single point; the theorem says nothing about it. In particular it
  says nothing for phases + (Lemma P0 covers that case at s = 1/2) or for theta_k = -lambda_k t (phases + seen
  from height t).
- Remark (ARGUED): with Theorem W extended to quotients (coefficients lambda_k (e^(i m theta_k) - e^(i m theta'_k)); its
  proof needs a positive proportion of m with abs(1 - e^(i m Delta)) >= 1, which holds for Delta/2 pi irrational),
  one would get for every theta: N^theta and N^theta' cannot both continue when they differ exactly on a set of
  class (W) with irrational differences. Not written out.

## 6. Theorem T (finite-order twin: the integers of Lemma Q are unbounded)

Setting. A twin in regime (K): G = zeta/R_S on Re s > 1/2 extends to a meromorphic function on C of finite
order (a quotient of entire functions of finite order) with zeta's functional equation in either form
R_S(s) = R_S(1 - s) or R_S(s) = eta_0 conj(R_S(1 - conj s)), abs eta_0 = 1. Then N_1 = R_S/U is meromorphic in
abs(Re z) < 1/2, and by the functional equation N_1(z) = N_1(-z) U(1/2 - z)/U(1/2 + z) (or its conjugate
form) it is analytic and zero-free off Re z = 0. Zeros of N_1 on the line are the poles of G/zeta there,
poles of N_1 are the zeros of G/zeta there.

**Theorem T (PROVED relative to the CLASSICAL inputs named in the proof; author only).** In this setting:
(i) for every m there is a segment of length 1 of the critical line on which G/zeta has more than m poles
    (with multiplicity);
(ii) if limsup of N(x)/log x is infinite (in particular if sum over S of 1/log q diverges), then for every m
    there is a segment of length 1 on which G/zeta has more than m zeros.

Proof. Fix 0 < d < 1/2. On Re z = d: prod (1 - e^(-lambda_k d)) <= abs N_1 <= prod (1 + e^(-lambda_k d)),
uniformly in Im z. On Re z = -d the functional equation gives the same with constants from U(1/2 +- z),
which is bounded above and below on abs(Re z) <= d (sum over S of q^(-1/2+d) finite). So c_1 <= abs N_1 <= C_1 on
both edges.
phi(w) := tan(pi w/(4d)) maps the strip abs(Re w) < d onto the unit disc, phi(0) = 0, abs phi = 1 on the edges,
abs phi(u + iv) >= tan(pi abs u/(4d)), and 1 - abs phi(u + iv)^2 <= 4 e^(-pi abs v/(2d)).
(i) Suppose every unit segment carries at most m zeros of N_1. Then B(z) = prod over zeros i a of phi(z - i a)
converges, abs B <= 1, abs B = 1 on the edges, and g = B/N_1 is analytic in the strip with abs g <= 1/c_1 on the
edges. g is of finite order in the strip (g = B G U/zeta; CLASSICAL: on suitable horizontal segments
Im z = Y_n, Y_(n+1) - Y_n <= 1, abs(1/zeta) and abs G are at most exp(Y_n^A), by the standard lower bound for zeta
between zeros and the Boutroux-Cartan minimum-modulus bound for the denominator of G; the maximum principle
on rectangles carries the bound inside). Phragmen-Lindelof in the strip (CLASSICAL): abs g <= 1/c_1 inside. So
abs N_1(delta + iy) >= c_1 abs B(delta + iy) >= c_2 (pi delta/(4d))^(3m) for all y and 0 < delta < d (at most 3m zeros
within distance 1 of y; the others contribute a convergent product bounded below).
Kronecker step: the lambda_k = log q_k are linearly independent over Q (unique factorisation), so for every K
and eps there are arbitrarily large y with dist(theta_k - lambda_k y, 2 pi Z) < eps for all k <= K (CLASSICAL).
Hence inf over y of abs N_1(delta + iy) <= prod over k <= K of (1 - e^(-lambda_k delta) + eps) times prod over k > K of (1 + e^(-lambda_k delta));
the second product tends to 1 as K grows (delta fixed), so the infimum is at most e^(-F(delta)) <= prod over k <= 3m + 1 of (lambda_k delta) = C delta^(3m+1). Contradiction as delta -> 0.
(ii) Symmetric: if every unit segment carries at most m poles of N_1, then N_1 B' (B' the product over
poles) is bounded by C_1, so abs N_1(delta + iy) <= C delta^(-3m); Kronecker with target phases pi gives
sup over y of abs N_1(delta + iy) >= e^(L(delta)) (1 - o(1)), and L(delta) >= log(1 + 1/e) N(1/delta). Contradiction along a
sequence delta -> 0 with N(1/delta)/log(1/delta) -> infinity. (If N(x) <= C log x for all x then lambda_k >= e^(k/C) and
sum 1/lambda_k converges; so divergence of sum 1/lambda_k gives the hypothesis.) QED

Remarks. (i) c20 Theorem C (c) is the case "at least one zero of G/zeta on the line"; Theorem T gives
unbounded local counts, and the mirror statement for poles of G/zeta, which holds for every infinite S.
(ii) Theorem T does not exclude a twin: zeta has of the order of log t zeros per unit length at height t,
and a twin with as many zeros of its own can meet both conditions. Counting heights does not help either:
the heights where K phases align are of size exp(c K log(1/eps)), where log t exceeds K. The lane tried this
route to a contradiction and it does not give one.
(iii) Poles of G/zeta on the line are poles of G or zeros of zeta at which G vanishes to lower order. If the
twin is required to have no pole on the line, (i) says that it omits, or meets with lower multiplicity,
more than m critical zeros of zeta on some unit segment, for every m. This is a statement about the
hypothetical G; it is consistent with every known fact about zeta and implies nothing about its zeros.
(iv) CYC: N_1 = 1/(1 - w) has one pole per period and no zero; both conclusions fail for it. For (i) the
Kronecker step fails (inf over y of abs N_1 = 1/(1 + e^(-lambda_0 delta)), not e^(-F(delta))): the norms are dependent.
For (ii) the density hypothesis fails (L(delta) = log(1/delta) + O(1), the threshold).

## 7. Why the dense remainder is not closed: Proposition H and the missing lemma

**Proposition H (PROVED relative to one CLASSICAL input).** Let S_beta = {primes nearest exp(k^beta)}, 0 < beta <= 1,
and P_n(z) = sum over q in S_beta of q^(-nz) (the n-th harmonic; log N_1 = -sum over n of P_n(z)/n for phases +).
Then P_1(z) - Gamma(1 + 1/beta) z^(-1/beta) (beta < 1), respectively P_1(z) - 1/(e^z - 1) (beta = 1), is analytic in
Re z > -c, for every c < 0.475 (up to the finitely many terms changed by coincidences of nearest primes at
small k, which are entire). P_n(z) = P_1(nz) has the same property in Re z > -c/n. So every finite sum of
harmonics continues analytically across Re z = 0 except at z = 0 (beta < 1) or at 2 pi i Z/n (beta = 1).

Proof. Sigma_beta(z) := sum over k >= 1 of e^(-k^beta z) = Gamma(1 + 1/beta) z^(-1/beta) + sum over j >= 0 of zeta(-beta j)(-z)^j/j!
for beta < 1, the series being entire (CLASSICAL: Mellin-Barnes with Gamma(s) zeta(beta s) z^-s; abs zeta(-beta j)/j!
decays faster than any geometric sequence when beta < 1). Checked numerically at five points to 1e-23 or
better (`first_harmonic_check.log`), including the values of the continuation at Re z = 0 and Re z = -0.2.
P_1 - Sigma_beta = sum over k of e^(-k^beta z)(e^(-eps_k z) - 1) with abs eps_k <= C e^(-0.475 k^beta) (input (ii) of Theorem
E), locally uniformly convergent in Re z > -0.475. QED

What it shows.
1. The dichotomy of Theorem W is sharp for first-harmonic methods. If sum 1/lambda_k converges (beta > 1), the
   spikes of one lattice at n lambda_k are isolated for most n and Theorem W applies. If it diverges, the
   number of spikes m lambda_j per unit frequency near omega is sum over lambda_j <= omega of 1/lambda_j, unbounded,
   and a smooth arrangement of the lambda_k cancels every finite set of harmonics to all orders: the
   windowed transform of H restricted to harmonics n <= M tends to 0 faster than any power of omega.
2. Hence in the dense remainder the natural boundary (where proved: Theorem E) is produced by the product
   over all harmonics, that is by the shape (1 - alpha q^-s)^-1 of the local factor, not by the frequencies
   log q. A proof for all phases must read infinitely many harmonics jointly.
3. The three methods on file fail at named points. Size (Lemma P): L(delta) is of order N(1/delta), far above
   log(1/delta). Isolation (Theorem W, step 4 (b)): needs sum 1/lambda_k finite. Second moment over a window of
   length h: the diagonal is h Lambda(X)/X (Lambda(X) = sum of lambda_k <= X), unbounded, but the pairs of
   frequencies (m lambda_k, m' lambda_j) closer than 1/h carry total absolute weight larger than the diagonal by
   a factor of order N(X)/h^2 (ARGUED: count of near-coincidences), and the form is positive semi-definite, so only an estimate of the pair
   correlation of {m lambda_k} at scale 1/h with the phases e^(i(m theta_k - m' theta_j)) decides; for adversarial
   phases there is no input. Theorem R replaces that input by Fubini; Theorem E by modularity.
4. Global hypotheses do not help by counting (Theorem T, remark (ii)).

5. Real parameters at the central point (ARGUED; inversion conditions not checked). For alpha_q = +-q^(1/2)
   let S_+, S_- be the two sign classes and D_+-(w) = sum over S_+- of (log q)^-w. On the real ray,
   log N_1(delta) = -F_+(delta) + L_-(delta), with Mellin transform Gamma(w) zeta(w + 1) D(w),
   D(w) := (1 - 2^-w) D_-(w) - D_+(w). Radial quantization at s = 1/2 (log N_1(delta) = n log delta + a power
   series) requires that Gamma(w) zeta(w + 1) D(w) continue meromorphically to C with poles only at
   w = 0, -1, -2, ... (so D is analytic in Re w > -1 apart from possible poles at the points rho - 1), and then
   n = -D(0). With finitely many minus signs D_+ has a real singularity (Landau), which is P0. In
   general the condition says N_+(x) = N_-(x) - N_-(x/2) to all polynomial orders, in the Mellin sense. CYC has
   D(w) = lambda_0^-w, n = -1. The condition can be met by distinct primes (all signs minus, q_(k+1) the
   prime nearest q_k^2: the two series telescope up to terms of size e^(-c lambda_k)), and that set is in class
   (W), where Theorem W gives a natural boundary. So this necessary condition at one height can be met by a
   set with a natural boundary (the converse direction, from D to radial quantization, was not examined);
   a proof must use an interval of heights.

**Exact missing lemma (OPEN).** For every infinite set S of primes with sum 1/log q infinite and
sum q^-eps finite, and every theta: log abs N_1^theta is unbounded on every half-neighbourhood
{0 < delta < delta_0, t in I} (statement U of section 2). Equivalent target in comb form: for every interval I
there are infinitely many lattice points p in I at which the hole condition of Lemma Q (d) fails.
Known: for almost every theta in every super-sparse fibre (Theorem R); for theta = 0 at t = 0, every S (P0);
for S_1 with theta = 0, every I (Theorem E); for S_1 with periodic phases of non-zero beta_2 (Theorem E2); for the integer-norm model lambda_k = k with every sign pattern
(Proposition PC). Not known for a deterministic phase assignment outside these (and their height shifts); first open cases:
S_1 with periodic phases having beta_2 = 0 and e_0 an integer (none of period 3 with signs; not searched
further), S_1 with a non-periodic sign pattern, S_beta with beta < 1 (by
Lemma TR it is enough to show growth beyond a power of log(1/delta) for the exact model prod (1 - c_k e^(-k^beta z))). No twin candidate was found; the lane has no construction that passes Lemma Q (d)
on any interval.

## 8. Controls

Statements tested: (E) Theorem E; (R) Theorem R; (T) Theorem T.

| Control | In the hypothesis class? | Conclusion for it | Step at which it leaves |
|---|---|---|---|
| The family itself, beta = 1, phases + | yes (E) | natural boundary, exponents -pi^2/(6 b^2 delta), -1/4 | none |
| CYC (norms Q^(2^k), alpha = -q^(1/2)) | (E): no (frequencies 2^k lambda_0, not k + small). (R): yes, as one point of the torus. (T): all hypotheses except independence of the norms and the density hypothesis | meromorphic, integers -1 and 0 (measured exactly) | (R): none, it lies in the null set. (T) (i): Kronecker step, the only place where distinct primes are used. (T) (ii): density hypothesis |
| lambda_k = k exactly (Euler function; dependent norms e^k) | (E): yes | natural boundary | none: Theorem E does not use distinct primes |
| S_1 with periodic phases, beta_2 != 0 (E2) | yes (E2) | natural boundary; measured coefficient in section 4.1 | none |
| S_1 with signs +,-,- (beta_2 = 0) | (E2): no. (E3): yes | not meromorphic at s = 1/2 (exponent 1/6); natural boundary away from the centre not decided | (E2): hypothesis beta_2 != 0 |
| lambda_k = k exactly with any signs (Proposition PC) | not in (E) for non-trivial signs | natural boundary for every sign pattern (Polya-Carlson) | none; a dense system with dependent norms where no sign pattern gives a twin, against CYC (sparse, dependent, one sign pattern gives a twin) |
| DEL, THIN on S_beta (abs alpha = 1 or 0) | no: abs alpha_q != q^(1/2) | relative product absolutely convergent on Re s = 1/2; exponent 0 (measured) | hypothesis on abs alpha |
| DEL, THIN of the map (sets of exponent b in (1/2, 1)) | no: not in regime (K) | continuation zeta(s)(s - b)W(s) (map rows) | hypothesis on S |
| HQ1 to HQ4 (one prime, non-geometric factor) | no: S finite, factor not geometric | meromorphic twins of the map | hypothesis; Lemma Q holds for them with finitely many lattices |
| E_a = zeta(s+a) zeta(s-a) | no: alpha_p = p^a on all primes, regime 3 | meromorphic | hypothesis on S (sum q^-eps finite fails) |
| DH, backward heat, T-NR, theta^w | not relative Euler products | not applicable; as bases they change nothing (all three theorems are base-blind in their natural-boundary part) | none |
| V6, THIN x V6 | not run | the assignment's score condition needs a step that reads the functional equation and the local shape jointly; Theorem T is the only statement here that reads both, and it is a necessary condition for a twin, not a statement that fails for V6 | not evaluated |

Not identically zero: every product is zero-free in Re z > 0; all measured values are finite.
R3 is not met: CYC leaves at a named step for Theorem T only; the other controls are outside the
hypothesis classes; the natural-boundary statements hold over any base.

## 9. Requirement flags

- R1 false. Theorem E uses no arithmetic of primes (it holds for lambda_k = k). Theorem R uses none (free
  phases). Theorem T uses linear independence of log q over Q (Kronecker step); Beurling systems with
  independent norms pass unchanged, and nothing reads multiplicativity of zeta's coefficients over all
  primes. Not counted as R1, as in the c21 lane.
- R2 false. Theorems E and R are local at every point of the line (every window); Theorem T is uniform in
  height. All are statements about G/zeta for a relative product or a hypothetical twin, not about zeta.
- R3 false (section 8).
- R4 false. In relative form the lane answers "the relative product does not reach the line" for S_1 with
  phases + and for almost every phase assignment; for an arbitrary phase assignment on a dense S the
  question is open.

## 10. Three weakest steps

1. Theorem T: the finite-order bound for g = B G U/zeta inside the strip and the Phragmen-Lindelof step are
   quoted, not written out; the definition of "twin of finite order" (finite order of G as a meromorphic
   function, functional equation exactly zeta's) is the lane's reading of the c20 setting. No independent
   referee has read sections 4 to 6.
2. Theorem R is an almost-every statement in super-sparse fibres. It gives no information about any
   explicitly given phase assignment, so it does not close regime (K) in the sense "for all phases"; whether
   it meets the campaign's stopping rule is a planner decision. The almost-sure corollary for independent
   phases rests on a measurability statement that was not checked.
3. Measurements. The j <= 60 ball results exist only for beta = 1 with phases + and rest on an unproved
   explicit prime-gap assumption for k > 400 (the theorem does not). For beta = 0.75 and 0.5 the float64
   depths are shallow: growth beyond every power of log(1/delta) is indicated at the resonant heights for
   beta = 0.5 and at generic heights for beta = 0.75, and is not established; by Lemma TR a proof for the exact
   model would transfer.
   Pole points for phases + at beta = 1 are not known to be of bounded type; the exponent 3/4 there is
   measured only.

## 11. Files

`RESULT.md`, `REFEREE.md`, `lanes.jsonl`; `common.py`, `arb_census.py`, `gpu_census.py`, `run_all.sh`,
`gpu_batch.sh` (first GPU launch, stopped by the lane and replaced by six direct launches); `analyse_eta.py`,
`analyse_eta.log`, `analyse_gpu.py`, `analyse_gpu.log`, `analyse_deep.py`, `analyse_deep.log`; `first_harmonic_check.py`, `.log`; `referee_check.py`,
`.log`; `periodic_check.py`, `.log`, `out/periodic_check.json`; `out/eta_b1_plus.json`, `out/btype.json`, `out/cyc.json`, `out/thin.json`, `out/cross.json`,
`out/gpu_b{100,075,050}_{plus,rand}.json`, `out/gpu_b{075,050}_plus_deep.json`. Server copies under `~/rh-push/c22-br2-dense-remainder-integer-quantization/`.
