# ap-box-experiment: finite-stage Lee-Yang sweep (code for the box, local small-scale results)

Status labels: PROVED (elementary argument given here, not refereed), CERTIFIED (interval arithmetic, this lane's
code), MEASURED (float64), EXPECTED (extrapolation, not run). Nothing here was run on the compute server.

## 1. Plan

Line of attack (user's choice): find a structure in which "all zeros on a line" is automatic. This lane tests
the finite-stage version: a scheme S_N with S_N(zeta) Lee-Yang for every N and S_N(control) not Lee-Yang for
some N. If such a scheme exists, Hurwitz's theorem passes the property to the limit and the scheme is a candidate
structure; if every scheme fails for zeta at a finite stage or passes for a control at all stages, the scheme is
discarded with a number attached.

Deliverable of the lane: the experiment code, tested end to end locally at small sizes, with the exact command,
run time and memory per stage (README.md). The sweep itself is to be run on the box.

Relation to closed rows of OBSTRUCTION_MAP.md (none is re-entered as a proof route; they are measured as finite
stages, with controls):
* P17 (Jensen hyperbolicity is a function of verified height; DH, HEAT pass): here the degree at which each
  control first fails is measured with a certified Sturm count; P17 gives no such number for the controls.
* Q11 (coverage theorem, twist-blind) and Q13/S4 (chain with hard cap): the scheme `euler` and the Bohr lift are
  the finite stages of these rows. New: the exact torus stability criterion (Proposition 2) and certified zero
  counts of the univariate objects for zeta and four controls.
* F1/G7 (flow): scheme `dbn` is the heat-deformed kernel at finite truncation; used as the HEAT control.
* G14 (rung sum kappa = sum V_n g0): the N-rung truncation is the N-term theta kernel, i.e. schemes `thalf`
  (half line) and `afe` (full line plus reflection). The repo's prime-truncated twin ladder
  (`src/math/rh-attack.js`, S-matrix from the Euler product over p <= P) corresponds to scheme `euler`; its
  formulas were not ported line by line, and PR 13 was not fetched.

## 2. Work

### 2.1 Objects (s = 1/2 + iz; `lylib.make_object`, `lylib.taylor_even`, `bohr.py`)

| scheme | object at size N or P | inputs |
|---|---|---|
| `jensen` | J^{d,n}(X) = sum_j C(d,j) gamma(n+j) X^j, gamma(k) = k! c_{2k}, Lam(1/2+x) = sum c_j x^j | zeta, dh, ea:a, nr:q:c, heat:lam |
| `afe` | G(s) D_N(s) + G(1-s) D_N(1-s), D_N = sum_{n<=N} w_n a_n n^{-s}; weights sharp, (1 - log n/log(N+1))^k, k = 1, 2 (Riesz means) | zeta, dh, tw2m, tw2h, liou, ea:a |
| `euler` | G(s) E_P(s) + G(1-s) E_P(1-s), E_P = product of local factors, p <= P | zeta, tw2m, tw2h, liou, ea:a (dh: not formulable) |
| `thalf` | 2 int_0^oo Phi_N(u) cos(zu) du, Phi_N = N-term theta kernel (incomplete gamma closed form) | zeta, dh, tw2m, liou |
| `polya` | Polya-Hejhal kernel sum_{n<=N} a_n [2 pi^2 n^4 cosh(9u/2) - 3 pi n^2 cosh(5u/2)] exp(-2 pi n^2 cosh 2u) (K-Bessel closed form) | zeta, dh, tw2m, liou |
| `dbn` | 2 int_0^oo exp(lam u^2) Phi_N(u) cos(zu) du, certified quadrature; de Bruijn-Newman time 4 lam | zeta, dh; lam < 0 is the HEAT control |
| `bohr` | lift p^{-it} -> z_p of `euler` and of `afe` | zeta, dh, tw2m, tw2h, liou |

Inputs: dh = Davenport-Heilbronn (a_n mod 5 = 1, k, -k, -1, 0); tw2m: eps_2 = -1; tw2h: eps_2 = 1/2; liou:
eps_p = -1 for all p; ea:a = zeta(s+a) zeta(s-a); nr:q:c = xi(s)(2 cosh((s-1/2) log q) + c); heat:lam = zeta
kernel times exp(lam u^2). Beurling zeta is not implemented (no canonical coefficients).

Identity used for `afe` (PROVED, one line): int_R phi_n(u) e^{izu} du = (s(s-1)/2) pi^{-s/2} Gamma(s/2) n^{-s}
for phi_n(u) = (4 pi^2 n^4 e^{9u/2} - 6 pi n^2 e^{5u/2}) exp(-pi n^2 e^{2u}); so the full-line transform of the
N-term kernel is the gamma factor times the Dirichlet polynomial, and `afe` is its symmetrisation.

### 2.2 Tests

* Jensen: Sturm chain in Arb; every leading-coefficient sign separated from 0; precision 40 d + 256 bits, raised
  by 3/2 on failure. Heat inputs: c'_{2m}(2m)! = sum_j lam^j/j! c_{2(m+j)}(2(m+j))! with the tail enclosed from
  Phi(u) <= 1.72 exp(-2 pi u^2) on u >= 0 (checked against certified quadrature in `selftest.py`).
* Entire and meromorphic objects: certified argument-principle counts on rectangles plus certified sign changes.
  Segment enclosures are Taylor models from m point evaluations on a circle with the Cauchy remainder
  M (th^m/(1 - th^m) + th^K)/(1 - th); M from a wide-ball evaluation, or analytic (|K_nu(x)| <= K_{|Re nu|}(x)
  for `polya`; product of (1 - |eps_p| p^{-sigma})^{-1} for `euler`).
* Bohr lift: closed-form minimum over the torus for Euler lifts, and multi-start L-BFGS over the torus
  (structured starts z_p = +-1, 24 random starts) for both lifts; 200 random points per sigma.
* `selftest.py`: 16 of 16 checks pass (xi and Lambda_DH reproduced by `thalf` at large N to 1e-20; the DH
  off-line zero 0.8085171825 + 85.6993484854i; Taylor coefficients of four inputs; heat coefficients against
  quadrature; Sturm on known polynomials; window test returns 12 zeros for xi at T = 40 and FAIL with 12
  off-axis zeros for E_{0.25}).

### 2.3 Local results (435 tasks, single process, 8 GB cap; `results/local.jsonl`, `results/local-summary.md`)

Sizes are N (terms), P (largest prime) or d (degree). "high" = window 10 <= |Re z| <= T only.

| scheme (window) | zeta: sizes passing / first failing | controls: first failing size | status |
|---|---|---|---|
| `jensen` n = 0 (d <= 256) | passes all d <= 256 | nr:3:2.2 fails at d = 16 (14 real roots; 252 of 256 at d = 256). dh, ea:0.25, ea:0.05 pass all d <= 256. heat:-1, -0.25, 0.05 pass d <= 64; heat:-0.05 passes d <= 128 | CERTIFIED |
| `jensen` n = 8 | passes all d <= 256 | no control fails for d <= 256 (nr passes) | CERTIFIED |
| `afe` sharp (T = 60, Y = 1.25) | passes N = 1; fails N = 2 (off-axis zero with Re z in (3.75, 4.69)); high window: fails N = 3 (Re z in (31.1, 31.9)) | dh passes N <= 3, fails N = 4; tw2m, liou fail N = 2; tw2h fails N = 3; ea:0.25 fails N = 2 | CERTIFIED |
| `afe` riesz1 | passes N <= 4, fails N = 5 (Re z in (2.8, 3.75)); high window: passes all N <= 20 | dh passes all N <= 20 (full and high window); tw2m, tw2h pass the high window for N <= 20; liou fails N = 3 (high: 6); ea:0.25 fails N = 2 (high: 5) | CERTIFIED |
| `afe` riesz2 | passes N <= 10, fails N = 20; high window: passes N <= 20 | dh passes N <= 20; tw2m, tw2h, ea:0.25 pass the high window N <= 20; liou fails N = 6 (high: 20) | CERTIFIED |
| `euler` (T = 30, Y = 0.35) | passes P = 2, 3, 5, 7, 11, 13, 29; fails P = 17, 23, 47 (off-axis zero with Re z in (0.47, 0.94)); high window: passes all ten P <= 47 | tw2m fails P = 5 (high: 5); liou fails P = 3; tw2h fails P = 17; ea:0.25 fails P = 3 | CERTIFIED |
| `thalf` (Y = 4) | fails N = 1, 2, 3; lowest off-axis zero has Re z in (20.3, 21.1), (42.5, 43.8), (67.5, 68.8) | dh, tw2m, liou fail at N = 1 | CERTIFIED; Prop. 1 |
| `polya` (T = 40) | passes N = 1, 2, 3 (12 zeros, all real) | dh, tw2m, liou pass N = 1, 2, 3 | CERTIFIED |
| `dbn` N = 4, T = 62 | lam = 0.05: passes (28 zeros, all real) | zeta at lam = -1 (HEAT): fails, 4 off-axis zeros, lowest Re z in (32.9, 33.9); dh passes at lam = 0.05 (T = 62 is below its first off-line zero), fails at lam = -1 | CERTIFIED |
| `bohr` Euler lift | unstable at t = 14 for every P >= 2; stable near the line only for t > t_line(P): log10 t_line = 2.25, 3.56, 4.69, 5.71, 6.61, 7.47, 10.40, 13.43, 18.40 for P = 2, 3, 5, 7, 11, 13, 29, 47, 97 | tw2m, liou: identical numbers; tw2h (eps_2 = 1/2): smaller t_line (1.13 at P = 2) | Prop. 2 PROVED; numbers MEASURED |
| `bohr` Dirichlet lift | stable for N = 2; for N >= 3 the lifted D_N vanishes on the torus (log ratio < -9 at every sigma of the grid) | dh stable N <= 3; tw2m as zeta | MEASURED |

No scheme in the local run has the target pattern (zeta passes at every tested size, every formulable control
fails at some tested size). Two partial patterns:
1. `euler`, high window: zeta passes for all P <= 47 at 10 <= |Re z| <= 30 while tw2m, tw2h, liou, ea:0.25 fail at
   P <= 17. This is the finite stage of row Q13/S4: on the window the three zeta zeros 14.13, 21.02, 25.01 are
   known to be on the line, so the pass does not carry information beyond verified height; whether it persists
   for P up to 997 at T = 200 is the first question for the box run.
2. `afe` with Riesz weights, high window: zeta passes for N <= 20, and so do dh, tw2m, tw2h.

**Proposition 1 (PROVED).** For the zeta input and every N >= 1 the half-line truncation
F_N(z) = 2 int_0^oo Phi_N(u) cos(zu) du has finitely many real zeros and infinitely many non-real zeros.
Proof. Two integrations by parts give t^2 F_N(t) = -2 Phi_N'(0) - 2 int_0^oo Phi_N''(u) cos(tu) du, and the
integral tends to 0 (Riemann-Lebesgue). Phi'(0) = 0 for the full kernel, so Phi_N'(0) = -sum_{n>N} phi_n'(0),
with phi_n'(0) = e^{-pi n^2}(-8 pi^3 n^6 + 30 pi^2 n^4 - 15 pi n^2) < 0 for n >= 2; hence Phi_N'(0) > 0 and
F_N(t) < 0 for all large real t. F_N is even, entire of order 1 and not of the form P(z) e^{az} (it tends to 0
like t^{-2} on the real axis), so it has infinitely many zeros. The same argument applies to any kernel
truncation whose odd derivative at 0 is non-zero: the half-line scheme has the Lee-Yang property only for an
exactly even kernel. Measured onset of the first off-axis zero: about 4.2 (N+1)^2 + 3.

**Proposition 2 (PROVED; float check to 2e-15).** For a completely multiplicative input with |eps_p| <= 1, the
Bohr lift M = G(sigma+it) prod_p (1 - eps_p p^{-sigma} z_p)^{-1} + G(1-sigma-it) prod_p (1 - eps_p p^{sigma-1}
conj z_p)^{-1} satisfies |first term| > |second term| for all z on the torus iff
R(sigma,t) prod_{p<=P} (1 - |eps_p| p^{sigma-1})/(1 - |eps_p| p^{-sigma}) > 1, R = |G(sigma+it)/G(1-sigma+it)|,
for 1/2 < sigma < 1. (Each factor |1 - b conj z|/|1 - a z|, b = |eps| p^{sigma-1} > a = |eps| p^{-sigma}, is
monotone in Re(z sign eps) with minimum (1-b)/(1-a).) Consequences: the criterion depends on |eps_p| only, so
every sign twist has the same stability region as zeta; near sigma = 1/2 it reads Re psi(1/4 + it/2) - log pi >
2 sum_{p<=P} |eps_p| log p/(sqrt p - |eps_p|), i.e. t > t_line(P) with log t_line ~ 4 sqrt P; this is row Q11
restated on the torus. The multivariate Lee-Yang property therefore fails for zeta at every P >= 2 below
t_line(P), and holds above it for every sign twist. The implication "criterion fails => M has a zero" is
ARGUED (modulus crossing on a connected torus with P >= 2 free phases), not certified.

## 3. Controls (structural reason where the scheme sees one)

| control | where it fails in the local run | reason |
|---|---|---|
| DH | `afe` sharp at N = 4; `thalf` at N = 1; not formulable in `euler`. Passes `jensen` d <= 256, `polya` N <= 3, `afe` riesz N <= 20, `dbn` lam = 0.05 at T = 62 | its off-line zeros start at height 85.7; windows T <= 80 and degrees <= 256 do not reach them. EXPECTED from row P17: Jensen failure near d ~ (85.7/0.62)^2 ~ 2e4, above the box grid (d <= 2048) |
| HEAT (lam < 0) | `dbn` lam = -1: 4 off-axis zeros below height 62; `jensen` heat:-1 passes d <= 64 | backward flow moves zeros off the line (row F1); low-degree Jensen polynomials do not see it |
| TW- (tw2m, liou) | `euler` at P = 5 and 3; `afe` sharp at N = 2; Bohr lift: identical to zeta | no functional equation: the symmetrised object is not near a function with real zeros; on the torus the sign is invisible (Prop. 2) |
| TW+ (tw2h) | `euler` at P = 17; `afe` sharp N = 3; passes riesz high window | as TW-, with weaker local factor at 2 |
| E_a | `afe` sharp N = 2, `euler` P = 3; passes `jensen` d <= 256 | zeros at Im z = +-a from height 14.1; EXPECTED Jensen failure near d ~ (14.1/2a)^2 = 800 for a = 0.25 |
| T-NR | `jensen` n = 0 at d = 16; passes n = 8 for d <= 256 | off-line zeros at heights (2k+1) pi/log 3 with Im z = +-0.404, the lowest at height 2.86 |
| Beurling | not implemented | no canonical coefficient sequence |

Every pass or fail observed for zeta is explained by the location of low zeros or by the size of local factors.
No step in any scheme uses multiplicativity in a way that fails for the controls and holds for zeta at all sizes.

## 4. Verdict

Partial result. Delivered: tested code and exact command for the box sweep (975 tasks, estimated 100 to 180
core-hours, at most 72 GB resident by construction); local certified results for 435 tasks; Propositions 1, 2.
Not established: any scheme with the target pattern. Excluded locally as candidates: `thalf` (fails for zeta at
every N, Prop. 1), Bohr lifts (fail for zeta at every P >= 2 at low height, twist-blind, Prop. 2), `afe` with
sharp cutoff (fails for zeta at N = 2), `polya` (passes for all inputs at N <= 3; the n = 1 term dominates and
the coefficients beyond a_1 enter at relative size e^{-6 pi}). Open for the box: `euler` in a high window,
`afe` with Riesz weights in a high window, Jensen degrees 512 to 2048 for ea and nr, `dbn` at lam = -0.05 and
-0.25, `polya` for N up to 20.

## 5. Three weakest steps

1. The window verdicts are local: PASS means no off-axis zero with |Im z| <= Y and |Re z| <= T. `thalf` at
   Y = 1.25 returned PASS for N = 1, 2 because the zeros had left the window (2 and 14 zeros instead of 20 and
   42); the run was repeated at Y = 4. The same effect is possible for `afe`, `euler` (Y = 0.35 only, because of
   the poles on Re s = 0, 1) and `polya`; the zero count `n_tot` is stored for each task and must be compared
   with the Riemann-von Mangoldt count before a PASS is read as "Lee-Yang".
2. Run time and memory for the box are extrapolated from one machine and two sizes per scheme (Jensen: factor
   9.7 per doubling from d = 256, 512; memory 20 bytes x order x bits). The Jensen degree at which DH fails is
   expected near 2e4, outside the grid, so the Jensen stage will probably not show a DH failure; the per-task
   limits make a wrong estimate cost a `KILLED_TIME` or `KILLED_MEM` line, not a crash.
3. The Bohr-lift tests are float64 with a heuristic minimiser, and t_stab is not reliable above about 1e10
   (cancellation in log-gamma differences; t_line from the digamma formula is). Proposition 2's converse
   direction is argued, not certified. Propositions 1 and 2 have had no referee pass.
