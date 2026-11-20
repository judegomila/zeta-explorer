# s1-prime-tents-controls: screening of four prime-tent combinations against the controls

Date 2026-11-19. Screening arm. Four combinations tested, zero survivors. Labels: PROVED (elementary, written here), CLASSICAL, MEASURED (float accumulation, see section 7), RECONSTRUCTED (definition rebuilt from a one-line source).

## 1. Verdict

| # | combination (nodes) | statistic | sizes reached | zeta | comparison L-functions | controls | classification |
|---|---|---|---|---|---|---|---|
| 1 | prime-tent-rh-equivalence + vaughan-forcing-law | T88: 2 sum_{N<p<=2N}(p-N)log p + sum_{2N<p<=4N}(4N-p)log p <= 3N^2; m(N) = (3N^2 - tent)/N^(3/2) | N <= 2.49e12 (primes to 1e13), 4501 values of N, 128 per octave, all 2^k | no violation; m/B in [0.670, 1.441] for N >= 1e3 (B = 1.0098; RH floor 0.154 B) | chi_4, chi_3, chi_5: main term 0, m/B stays in a fixed band (largest 1.54) with no growth; the one-sided sign is not the right statement for them (both signs occur) | sign twist, THIN, DEL, U: cannot violate (Lemma 1); THIN m grows as N^0.400. T-NR q = 3: violated from N = 2. T-NR q = 1000003: violated only for 251030 <= N <= 982604. E_a: violates the size at every N (pole at 1.1). DH: leaves the on-line band at N about 1e6, as the explicit formula with its zeros predicts (rms 4e-4 B to 1.4e-2 B). HEAT: not defined | CLOSED: linear functional of the zeros; resolution at N = 2.5e12 is gamma <= 1.0e4 at beta = 1, 3e8 times below the verified height |
| 2 | zero-complete-rational-tents + two-tents-joint-zero-completeness | T91 (a = 17/9) on (81N, 289N]; T92 pair c = 124/123, m = 61, 62 on (M, c^153 M] | T91: N <= 3.45e10 (3710 values); T92: M <= 2.88e12 (4504 values each) | no violation of any of the three; m/B in [0.655, 1.453], [0.687, 1.593], [0.669, 1.612] | same as row 1 (bands up to 1.81 B) | same pattern as row 1; first failing N of either T92 sign: T-NR q = 3: M = 16 (first grid point); T-NR q = 1000003: M = 292130 (= q/c^153); sign twist, THIN, DEL: never | CLOSED: same functional with another multiplier; the pair removes blind spots of the multiplier, not the dependence on zero height |
| 3 | pascal-carry-ballot + robin-margin-mertens | lambda(N) = log(S_N/C_N)/N^(3/2); log(S_N/C_N) = E(N) - [15F(529N) - 38F(345N) + 23F(225N)] | N <= 1.88e10 (3613 values, all 10^k and 3^k); Robin: 1063 colossally abundant numbers, largest prime to 9.79e12 | lambda > 0 at every N; range [5938, 18751] (bias coefficient 11082); Robin nu in [0.751, 0.920], no violation | not defined for the ballot (the factorial side has no twist); T93 tent of chi: bands up to 3.4 B | twisted weight: sign twist, THIN, DEL never negative (Lemma 1); T-NR q = 3: negative from N = 1; T-NR q = 1000003: negative only for 1898 <= N <= 4419 | CLOSED: the ballot is the T93 tent plus -589.87 N + O(log N); nothing beyond row 2 |
| 4 | staged-strip-triangular-inequality + rm-gap-law-residual-oscillation | R(x) = sum_{p<=x}(x-p)log p - (x^2-1)/2 <= C x^(15/8); centred residual sign changes | x <= 1e13 (17 969 grid values, 512 per octave) | R(x) < 0 at every grid x >= 2: C = 0 suffices; R/x^(3/2) in [-0.897, -0.653]; Lambda-weighted centred residual: 181 sign changes, range [-0.0227, +0.0242] against the bound 0.0462 | chi_4: sup abs(R)/x^(15/8) decays (2.5e-6 in the last decade) | THIN (real zero 0.9 > 7/8): one-sided passes at every x; two-sided sup abs(R)/x^(15/8) grows as x^0.025 from x about 1e3 (0.72 to 1.24). T-NR q = 3, c = 2.2 (zeros Re 0.904): C grows from 0.20 to 0.41, as x^0.029, from the first decade. T-NR c = 2.02 (Re 0.629), E_a (Re 0.6), DH below height 2000 (max Re 0.8695): pass, and they are not RH | CLOSED: a strip statement; controls with zeros inside [1/8, 7/8] pass by design, growth appears only for zeros right of 7/8 and at rate x^(beta - 7/8) |

No survivor. For every control the size at which it separates is the size at which the explicit formula makes its own off-line zeros (or its non-tempered local factor, or its pole) visible, and three classes of controls (sign twists, thin twists and deletions, unimodular twists) provably cannot violate any of the four inequalities.

## 2. Common reduction (PROVED, elementary; explicit formula CLASSICAL)

For a coefficient sequence a(n) put F_a(x) = sum_{n<=x} a(n)(x - n). All four statistics are fixed linear combinations of F at dilated arguments:

- T88(N) = F(4N) - 3F(2N) + 2F(N), main term 3N^2.
- General tent with knots y < Ay < By: (A-1)F(By) - (B-1)F(Ay) + (B-A)F(y); weight (B-A)(p-y) on (y, Ay], (A-1)(By-p) on (Ay, By], zero below y. T91: y = 81N, A = 17/9, B = A^2, scaled to 9F(289N) - 26F(153N) + 17F(81N), main 127296 N^2. T93: y = 225N, A = 23/15, B = A^2, scaled to 15F(529N) - 38F(345N) + 23F(225N), main 419520 N^2.
- T92 (RECONSTRUCTED): y = M, A = c^m, B = c^153, c = 124/123, m = 61 or 62. The source is one line of `src/pages/OpenFrontierPage.jsx` (entry T92); no script was found. Check of the reconstruction: with K = 2 + gamma - log 4 pi = 0.0461914 the global-amplitude margin (2/3)Q(1/2) - K (sum of absolute coefficients at exponent 3/2) is -3.8e-5, +8.55e-5, +2.90e-5, -2.1e-4 for m = 60, 61, 62, 63: positive exactly for the two stated values. The same formula gives 0.155951 for T88 and 48.820170 for T91, the values printed in the source.
- Pascal ballot: with K_u = (u+1)^u/(u! rad(u!)), log K_u = u log(u+1) - log u! - theta(u), and sum_{A<=u<B} theta(u) = F(B) - F(A) for integers A < B. Hence log(S_N/C_N) = E(N) - [15F(529N) - 38F(345N) + 23F(225N)], E(N) = 15 sum_{345N<=u<529N} g(u) - 23 sum_{225N<=u<345N} g(u), g(u) = u log(u+1) - log u!. E(N) is evaluated in closed form (hyperfactorial, Barnes G, log-gamma; 90 digits); E(N) - 419520 N^2 = -589.87 N + o(N). The identity was checked against the direct definition at N = 1, 2 (14531.8848456286 and 42962.5175022302, agreement to all printed digits).

Explicit formula for a tent with multiplier Q(s) = sum_j c_j k_j^(s+1) (prime-only weights; B = (2/3)Q(1/2) comes from the missing prime squares):

  main - tent = B N^(3/2) + sum_rho N^(rho+1) Q(rho)/(rho(rho+1)) + O(N^(4/3)).

So m(N) = B + sum_rho N^(rho-1/2) Q(rho)/(rho(rho+1)). A pair of off-line zeros beta +- i gamma enters with amplitude 2 N^(beta-1/2) abs(Q(rho))/abs(rho(rho+1)). It can change the sign of m only when N^(beta-1/2) is of order gamma^2/abs(Q). This is the size "explained by the height of the zero" for a statistic of this type; it is a power of gamma, not exp(gamma).

## 3. Lemma 1: sign twists cannot violate a one-sided tent inequality (PROVED)

If w >= 0 and abs(eps_p) <= 1 then sum_p eps_p w(p) log p <= sum_p w(p) log p. All kernels in rows 1 to 3 are non-negative, and (x - p) in row 4 is non-negative. Therefore at every N where zeta satisfies the inequality, so does every control obtained by multiplying the prime weights by numbers of modulus at most 1: TW+, TW- (any signs), the Liouville twist, THIN, DEL, and the real part of the unimodular twist U. The requirement in the assignment (the sign-twisted sums must violate the inequality early) cannot be met by any statistic of this form.

The computation confirms it and shows what the lemma hides. THIN-random (eps_p = -1 on a hash-defined set of density (1/2)p^(-0.1), +1 elsewhere; Dirichlet series with a zero-type singularity at s = 0.9, height 0) has m(N)/B rising from 45 at N = 1e3 to 2.5e5 at N = 2.5e12, slope 0.400 per decade in log scale (= b - 1/2), and never violates T88, T91, T92, T93 or the one-sided form of row 4. A real off-line zero contributes with one sign only; the equivalence "inequality eventually iff RH" for zeta uses the reflection rho -> 1 - rho-bar, that is, the functional equation, to produce both signs.

Hash sign twist with main term 0: m(N)/B fluctuates between -13.4 and +27.5 for N <= 2.5e12, consistent with a variance of 4 log N (the kernel has integral of w^2 equal to 4N^3); the two-sided bound abs(m) <= C fails by sqrt(log N), for a mean-square reason that has nothing to do with zeros, and the one-sided inequality with zeta's main term holds trivially.

## 4. Lemma 2: finite modification (PROVED) and the T-NR twin

T-NR: X(s) = xi(s)(q^(s-1/2) + c + q^(1/2-s)), c > 2, b = arccosh(c/2)/log q. Its logarithmic derivative has Lambda_NR(n) = Lambda(n) for n not a power of q and Lambda_NR(q^k) = log q (1 - (-1)^k (q^(k(1/2+b)) + q^(k(1/2-b)))). Zeros at Re s = 1/2 +- b, heights (2j+1) pi/log q.

- q = 3, c = 2.2 (b = 0.404, heights 2.86(2j+1)): every tent is violated at the first grid point and at about half of all grid points (2210 of 4501 for T88), amplitude growing as N^0.404 to 3e5 B. Reason: Lambda_NR(3^k) = 3^(0.904 k) log 3 at odd k; a non-tempered local factor. The zeros are at height 2.86, so no scale is gained against the height.
- q = 3, c = 2.02 (b = 0.129): same, amplitude N^0.129 (122 B at 2.5e12). In row 4 this control passes (zeros inside the strip).
- q = 1000003, c = 2.2 (b = 0.032, heights 0.227(2j+1)): identical to zeta on every tent whose support does not contain a power of q. Measured violation windows: T88 251030 <= N <= 982604; T91 3482 <= N <= 12164; T92 292130 <= M <= 987939; T93 and the Pascal ballot 1898 <= N <= 4419. Outside these windows (up to the next odd power q^3 = 1e18) it passes with zeta's margins or larger.

Consequence: a function with zeta's gamma factor, functional equation, pole and multiplicative coefficients, with zeros off the line at height 0.23, passes T88 at every N < q/4, and q is free. A finite range of any of the four tests does not see the modification of one Euler factor beyond its support. This is the finite-modification obstruction (OBSTRUCTION_MAP section 2, code FM) in the present setting.

## 5. Davenport-Heilbronn (MEASURED) and the resolution of the test

Lambda_DH(n) (the coefficients of -f'/f; not supported on prime powers; max abs(Lambda_DH(n))/log(n+1) = 14139 for n <= 6e8) was computed for all n <= 6e8 by Dirichlet inversion (checks: Lambda_DH(p) = a(p) log p; Lambda_DH(4); sum Lambda_DH(n) n^-3 against -f'/f(3): 15 digits). DH has no pole and no prime-square bias, so the tents have main term 0 and no sign statement; the statistic is the range of m(N) = -tent/N^(3/2).

The tents computed from these sums agree with the explicit formula evaluated on the battery zero table (`c12-control-battery-harness/tables/zeros_DH.json`: 1861 on-line zeros and 84 off-line pairs with height <= 2000, largest real part 0.8695 at height 240.4) to rms 4e-4 B at N about 1e3 and 1.4e-2 B at N about 1e8 (T88). The off-line part of the sum equals the on-line part in size at N about 1e6 (T88, T93) and 1e5 (T91) and exceeds it threefold at 1e8 (T88). The measured range of m/B grows from +-1.7 (N <= 1e5) to [-3.93, +3.64] (N in 1e7 to 1.5e8), exactly as the 84 pairs predict. By extrapolation of the same formula the ratio off-line/on-line is 82 at N = 1e12.

Reading against the survivor criterion. DH separates at N about 1e6 to 1e7, far below exp(85.7) = 1.7e37. This is not a gain against the height: the first pair (0.8085, 85.70) alone reaches amplitude B at N about (gamma^2/abs(Q))^(1/(beta-1/2)), about 3e7 for T88, and the 84 pairs together reach it at 1e6. The separation is the sum over resolved zeros, term by term. A Riesz-weighted prime sum sees a zero at a power of its height.

The same computation for zeta gives the height the test itself verifies. Adding a hypothetical pair beta + i gamma (and its reflection) to the measured zeta margins by the explicit formula, the largest gamma for which T88 would show a violation on the grid N <= 2.49e12 is:

| beta | 0.55 | 0.6 | 0.7 | 0.75 | 0.8 | 0.9 | 1.0 |
|---|---|---|---|---|---|---|---|
| largest gamma detected | 14.1 | 24.4 | 123 | 258 | 493 | 2289 | 10012 |

(At N <= 2.5e10 the last entry was 3060: growth N^(1/4), as the formula requires.) The verified height of zeta is about 3e12. To see a zero at that height with beta = 1 the tent needs N of order 2.5e12 (3e8)^4, about 2e46; for beta = 0.75, N of order 1e94. Passing T88 to 2.5e12 is implied by the verified height many times over. This is the known pattern (finite tests restate verified height), here with an explicit and very unfavourable exchange rate.

## 6. Remaining controls

- E_a = zeta(s+a)zeta(s-a), a = 0.1 (run to primes 1e11): Lambda(n)(n^a + n^-a). Against zeta's main term it fails at every N (pole at 1 + a: the tent is of order N^2.1). Against its own main terms its prime-only m/B grows from 2.6 to 14.1 (N^0.1), with no violation of the one-sided sign, and its Lambda-weighted m/B grows as N^0.1 with both signs (zeros at Re 0.6, heights of the zeta zeros). It fails by size; in row 4 it passes.
- U = zeta(s + i) (run to 1e11): against its own main term N^(2-i) Q/((1-i)(2-i)) both parts of m/B stay in [-0.30, +0.30]. It has no off-line zeros; it is a positive comparison, not a failing control. Its real part satisfies every one-sided inequality by Lemma 1.
- Dirichlet L-functions chi_4, chi_3, chi_5 (real and quartic): main term 0. Lambda-weighted m/B bands for T88: [-1.17, 1.11], [-0.37, 0.45], [-0.86, 0.85], [-1.38, 1.54]; no growth over twelve decades. They behave like zeta in the two-sided sense. The one-sided sign does not hold for them: the Lambda-weighted tents take both signs at about half of the grid points, and the prime-only chi_4 tent (which has the same square bias B) is negative at 121 of 3649 points to 2.5e10, because the bias B does not dominate the zero sum of L(s, chi_4). The one-sided statement is special to conductor 1 with the constant K = 0.0462.
- HEAT (backward heat family): no Dirichlet series with a prime-supported logarithmic derivative; the statistics are not defined. Not run.
- Robin comparison (row 3): nu(x) = (1 - sigma(n)/(n e^gamma log log n)) sqrt(log n) log log n along 1063 colossally abundant numbers n with largest prime x <= 9.79e12 stays in [0.751, 0.920] (limit 2(sqrt 2 - 1) = 0.828 under RH, zero wave at most 0.046, slow 1/log log corrections); smallest margin e^gamma log log n - sigma(n)/n = 4.4e-7 in the last decade. Same structure as the tents: a prime-square bias against a zero wave of relative size K. It adds no separation.

## 7. Method and validation

- `sieve.c`: segmented odd-only sieve, 8 OpenMP threads, 125 044 intervals, 55 940 checkpoints; per prime logl (x87, 64-bit mantissa); sums of w(p) log p and w(p)(p - lo) log p per interval in long double, cumulated across intervals in binary128. Weights: 1, chi_4, chi_3, the four classes mod 5, hash sign, hash thin set, log(1 + 1/p); in the 1e11 run also p^(+-0.1), cos log p, sin log p. Run to 1e13: 8371 s wall, about 11 h CPU, under 0.2 GB; unit rh-s1pt-e13-1119182726.
- Checks: pi(10^k) exact for k = 7..13 (346 065 536 839 at 1e13); theta(1e10) = 9999939830.657757384 (literature 9999939830.657757); all 27 columns against a 30-digit brute force at 13 checkpoints to 3e5 (relative difference 2.3e-17); Pascal identity at N = 1, 2.
- Not interval arithmetic. A priori rounding bound for a cumulative sum: relative 1e-14 (7e4 primes per segment at 2^-64 each, binary128 above that); the margins are of relative size N^(-1/2) >= 6e-7 of the main term, and no reported sign is closer to zero than 0.5 B. A pass means: at every grid point. The grid has 128 values of N per octave (512 for row 4); integers between grid points were not tested.
- `dh.c`: Dirichlet inverse and convolution in float64 for n <= 6e8 (9.6 GB); `dh_analyze.py`: tents and explicit formula. `analyze.py`: all statistics from the checkpoint table (mpmath 45 digits for F - main, then float64). `mktables.py`: the tables below. Result files: `res_1e13.json` (main), `res_1e11x.json` (run with E_a and U), `res_dh.json`. Server logs in `logs/`.
- Server units started by this lane: rh-s1pt-val, -e11, -dh, -e13, -an11, -an11b, -an13, -an13b. All have exited; none is running.

## 8. Three weakest steps

1. T92 is reconstructed from a one-line description; the only check is that the global-amplitude margin is positive exactly for m = 61, 62 and that the same formula reproduces the printed constants of T88 and T91.
2. THIN, DEL and the sign twist are hash-random stand-ins with the stated densities, not the greedy-floor sets of the obstruction map; their analytic properties (singularity at s = b) are inferred from the density, not proved for the hash sets. The conclusions drawn from them rest on Lemma 1, which does not depend on the set.
3. The DH statements beyond N = 1.5e8 are explicit-formula evaluations over zeros of height <= 2000 only; the tail is not bounded. The resolution table for zeta is a linear-response computation (a pair added by the explicit formula), not a computation with an actual function having that pair.

## 9. Tables


**T88 tent on (N, 4N].** m(N) = (main - tent)/N^(3/2); bias coefficient B = 1.009812; RH floor from the global amplitude bound = 0.155951 (0.154 B). Columns in units of B.

| sequence | N reached | points | first N with m < 0 | last N with m < 0 | points with m < 0 | min m/B (N >= 1e3) | max m/B (N >= 1e3) | min, max m/B in the last full decade |
|---|---|---|---|---|---|---|---|---|
| zeta, primes only (the stated inequality) | 2.491e+12 | 4501 | None | None | 0 | 0.6703 | 1.441 | 1e11: 0.7094, 1.276 |
| zeta, Lambda-weighted | 2.491e+12 | 4501 | 6 | 2490698444732 | 2310 | -0.3402 | 0.3251 | 1e11: -0.2965, 0.2682 |
| L(s, chi_4) | 2.491e+12 | 4501 | 2 | 1686521092262 | 2263 | -1.166 | 1.112 | 1e11: -0.9833, 1.027 |
| L(s, chi_3) | 2.491e+12 | 4501 | 6 | 2247175594673 | 2259 | -0.3678 | 0.4473 | 1e11: -0.3379, 0.4473 |
| L(s, chi_5 real) | 2.491e+12 | 4501 | 13 | 1695678735018 | 2222 | -0.8638 | 0.8533 | 1e11: -0.508, 0.853 |
| L(s, chi_5 quartic), real part | 2.491e+12 | 4501 | 4 | 981323259959 | 2103 | -1.379 | 1.543 | 1e11: -1.142, 1.426 |
| sign twist (hash signs), main term 0 | 2.491e+12 | 4501 | 2 | 1081793670374 | 2035 | -13.45 | 27.45 | 1e11: -7.797, 22.83 |
| THIN-random b = 0.9 | 2.491e+12 | 4501 | None | None | 0 | 44.83 | 2.491e+05 | 1e11: 6.884e+04, 1.727e+05 |
| DEL-random b = 0.9 | 2.491e+12 | 4501 | None | None | 0 | 23.11 | 1.246e+05 | 1e11: 3.442e+04, 8.637e+04 |
| T-NR q = 3, c = 2.2 (zeros Re = 0.904) | 2.491e+12 | 4501 | 2 | 2490698444732 | 2210 | -2.793e+05 | 3.132e+05 | 1e11: -2.011e+05, 2.571e+05 |
| T-NR q = 3, c = 2.02 (zeros Re = 0.629) | 2.491e+12 | 4501 | 2 | 2490698444732 | 2154 | -104 | 122 | 1e11: -104, 100.4 |
| T-NR q = 1000003, c = 2.2 (zeros Re = 0.532) | 2.491e+12 | 4501 | 251030 | 982604 | 253 | -83.84 | 110.9 | 1e11: 0.7717, 110.9 |
| E_a, a = 0.1, own main term (run to 1e11) | 2.496e+10 | 3649 | None | None | 0 | 2.559 | 14.14 | 1e9: 6.706, 13.53 |
| zeta(s + i), own main term, real part (run to 1e11) | 2.496e+10 | 3649 | 3 | 24962830889 | 1826 | -0.3035 | 0.295 | 1e9: -0.1823, 0.2614 |
| DH, direct Lambda_DH sums (main 0) | 1.496e+08 | 2674 | n/a | n/a | n/a | -3.933 | 3.636 | 1e7: -3.933, 3.107 |

**T91 tent a = 17/9 on (81N, 289N].** m(N) = (main - tent)/N^(3/2); bias coefficient B = 4936.572; RH floor from the global amplitude bound = 48.8202 (0.00989 B). Columns in units of B.

| sequence | N reached | points | first N with m < 0 | last N with m < 0 | points with m < 0 | min m/B (N >= 1e3) | max m/B (N >= 1e3) | min, max m/B in the last full decade |
|---|---|---|---|---|---|---|---|---|
| zeta, primes only (the stated inequality) | 3.455e+10 | 3710 | None | None | 0 | 0.655 | 1.453 | 1e9: 0.655, 1.299 |
| zeta, Lambda-weighted | 3.455e+10 | 3710 | 1 | 33441893851 | 1859 | -0.3582 | 0.349 | 1e9: -0.3515, 0.2917 |
| L(s, chi_4) | 3.455e+10 | 3710 | 2 | 22522142119 | 1800 | -1.405 | 1.47 | 1e9: -1.15, 1.305 |
| L(s, chi_3) | 3.455e+10 | 3710 | 1 | 34546308350 | 1893 | -0.5916 | 0.5687 | 1e9: -0.3473, 0.5234 |
| L(s, chi_5 real) | 3.455e+10 | 3710 | 1 | 23140283686 | 1860 | -1.172 | 1.058 | 1e9: -0.8636, 0.9625 |
| L(s, chi_5 quartic), real part | 3.455e+10 | 3710 | 1 | 12893612680 | 1640 | -1.588 | 1.708 | 1e9: -1.319, 1.708 |
| sign twist (hash signs), main term 0 | 3.455e+10 | 3710 | 1 | 14446490411 | 1625 | -14.03 | 28.06 | 1e9: -8.721, 23.24 |
| THIN-random b = 0.9 | 3.455e+10 | 3710 | None | None | 0 | 236.5 | 2.536e+05 | 1e9: 6.149e+04, 1.544e+05 |
| DEL-random b = 0.9 | 3.455e+10 | 3710 | None | None | 0 | 118.8 | 1.268e+05 | 1e9: 3.074e+04, 7.721e+04 |
| T-NR q = 3, c = 2.2 (zeros Re = 0.904) | 3.455e+10 | 3710 | 1 | 34546308350 | 1831 | -3.229e+05 | 3.428e+05 | 1e9: -2.204e+05, 1.415e+05 |
| T-NR q = 3, c = 2.02 (zeros Re = 0.629) | 3.455e+10 | 3710 | 1 | 34546308350 | 1802 | -114.3 | 133.5 | 1e9: -114.3, 101.2 |
| T-NR q = 1000003, c = 2.2 (zeros Re = 0.532) | 3.455e+10 | 3710 | 3482 | 12164 | 233 | -91.81 | 121.3 | 1e9: 0.7134, 121.3 |
| E_a, a = 0.1, own main term (run to 1e11) | 3.444e+08 | 2857 | None | None | 0 | 3.122 | 14.45 | 1e7: 6.571, 13.33 |
| zeta(s + i), own main term, real part (run to 1e11) | 3.444e+08 | 2857 | 1 | 344367798 | 1449 | -0.2909 | 0.317 | 1e7: -0.2895, 0.2748 |
| DH, direct Lambda_DH sums (main 0) | 2.075e+06 | 1882 | n/a | n/a | n/a | -3.94 | 4.09 | 1e5: -3.054, 3.434 |

**T92 tent c = 124/123, m = 61, knots (M, c^61 M, c^153 M].** m(N) = (main - tent)/N^(3/2); bias coefficient B = 0.5106125; RH floor from the global amplitude bound = 8.55494e-05 (0.000168 B). Columns in units of B.

| sequence | N reached | points | first N with m < 0 | last N with m < 0 | points with m < 0 | min m/B (N >= 1e3) | max m/B (N >= 1e3) | min, max m/B in the last full decade |
|---|---|---|---|---|---|---|---|---|
| zeta, primes only (the stated inequality) | 2.883e+12 | 4504 | None | None | 0 | 0.6867 | 1.593 | 1e11: 0.7248, 1.291 |
| zeta, Lambda-weighted | 2.883e+12 | 4504 | 16 | 2882834191270 | 2249 | -0.3238 | 0.3016 | 1e11: -0.2822, 0.2836 |
| L(s, chi_4) | 2.883e+12 | 4504 | 17 | 1973303496441 | 2255 | -1.394 | 1.408 | 1e11: -1.216, 1.213 |
| L(s, chi_3) | 2.883e+12 | 4504 | 16 | 2140281206460 | 2284 | -0.5917 | 0.5524 | 1e11: -0.5796, 0.5092 |
| L(s, chi_5 real) | 2.883e+12 | 4504 | 33 | 2060669106106 | 2186 | -1.224 | 1.209 | 1e11: -1.128, 1.057 |
| L(s, chi_5 quartic), real part | 2.883e+12 | 4504 | 16 | 2701457267892 | 2095 | -1.671 | 1.807 | 1e11: -1.31, 1.571 |
| sign twist (hash signs), main term 0 | 2.883e+12 | 4504 | 57 | 1258910186282 | 2028 | -13.93 | 28.75 | 1e11: -8.213, 22.2 |
| THIN-random b = 0.9 | 2.883e+12 | 4504 | None | None | 0 | 42.57 | 2.505e+05 | 1e11: 6.54e+04, 1.638e+05 |
| DEL-random b = 0.9 | 2.883e+12 | 4504 | None | None | 0 | 22.01 | 1.253e+05 | 1e11: 3.27e+04, 8.193e+04 |
| T-NR q = 3, c = 2.2 (zeros Re = 0.904) | 2.883e+12 | 4504 | 16 | 2882834191270 | 2219 | -2.865e+05 | 3.25e+05 | 1e11: -2.085e+05, 2.021e+05 |
| T-NR q = 3, c = 2.02 (zeros Re = 0.629) | 2.883e+12 | 4504 | 16 | 2882834191270 | 2164 | -107.8 | 126.4 | 1e11: -107.8, 95.58 |
| T-NR q = 1000003, c = 2.2 (zeros Re = 0.532) | 2.883e+12 | 4504 | 292130 | 987939 | 226 | -87.11 | 114.8 | 1e11: 0.7819, 114.8 |

**T92 tent m = 62.** m(N) = (main - tent)/N^(3/2); bias coefficient B = 0.5167903; RH floor from the global amplitude bound = 2.9039e-05 (5.62e-05 B). Columns in units of B.

| sequence | N reached | points | first N with m < 0 | last N with m < 0 | points with m < 0 | min m/B (N >= 1e3) | max m/B (N >= 1e3) | min, max m/B in the last full decade |
|---|---|---|---|---|---|---|---|---|
| zeta, primes only (the stated inequality) | 2.883e+12 | 4504 | None | None | 0 | 0.6685 | 1.612 | 1e11: 0.7386, 1.303 |
| zeta, Lambda-weighted | 2.883e+12 | 4504 | 16 | 2882834191270 | 2252 | -0.3419 | 0.3043 | 1e11: -0.2684, 0.2953 |
| L(s, chi_4) | 2.883e+12 | 4504 | 17 | 1962646519918 | 2245 | -1.415 | 1.374 | 1e11: -1.224, 1.208 |
| L(s, chi_3) | 2.883e+12 | 4504 | 16 | 2128722454038 | 2291 | -0.5991 | 0.5332 | 1e11: -0.5718, 0.5134 |
| L(s, chi_5 real) | 2.883e+12 | 4504 | 33 | 2049540304923 | 2192 | -1.227 | 1.197 | 1e11: -1.115, 1.038 |
| L(s, chi_5 quartic), real part | 2.883e+12 | 4504 | 16 | 2686867841211 | 2087 | -1.682 | 1.812 | 1e11: -1.315, 1.563 |
| sign twist (hash signs), main term 0 | 2.883e+12 | 4504 | 57 | 1258910186282 | 2034 | -13.94 | 28.68 | 1e11: -8.193, 22.3 |
| THIN-random b = 0.9 | 2.883e+12 | 4504 | None | None | 0 | 42.59 | 2.508e+05 | 1e11: 6.547e+04, 1.64e+05 |
| DEL-random b = 0.9 | 2.883e+12 | 4504 | None | None | 0 | 22.03 | 1.254e+05 | 1e11: 3.273e+04, 8.201e+04 |
| T-NR q = 3, c = 2.2 (zeros Re = 0.904) | 2.883e+12 | 4504 | 16 | 2882834191270 | 2217 | -2.89e+05 | 3.27e+05 | 1e11: -2.098e+05, 2.039e+05 |
| T-NR q = 3, c = 2.02 (zeros Re = 0.629) | 2.883e+12 | 4504 | 16 | 2882834191270 | 2166 | -108.5 | 127.2 | 1e11: -108.5, 96.18 |
| T-NR q = 1000003, c = 2.2 (zeros Re = 0.532) | 2.883e+12 | 4504 | 292130 | 987939 | 226 | -87.45 | 115.3 | 1e11: 0.7709, 115.3 |

**T93 tent a = 23/15 on (225N, 529N].** m(N) = (main - tent)/N^(3/2); bias coefficient B = 11081.71; RH floor from the global amplitude bound = -12182 (-1.1 B). Columns in units of B.

| sequence | N reached | points | first N with m < 0 | last N with m < 0 | points with m < 0 | min m/B (N >= 1e3) | max m/B (N >= 1e3) | min, max m/B in the last full decade |
|---|---|---|---|---|---|---|---|---|
| zeta, primes only (the stated inequality) | 1.884e+10 | 3613 | None | None | 0 | 0.5358 | 1.482 | 1e9: 0.6196, 1.419 |
| zeta, Lambda-weighted | 1.884e+10 | 3613 | 1 | 18836508195 | 1827 | -0.473 | 0.4213 | 1e9: -0.3855, 0.4113 |
| L(s, chi_4) | 1.884e+10 | 3613 | 1 | 18836508195 | 1820 | -2.825 | 3.136 | 1e9: -2.744, 3.068 |
| L(s, chi_3) | 1.884e+10 | 3613 | 1 | 17651386999 | 1839 | -2.048 | 2.076 | 1e9: -1.636, 1.745 |
| L(s, chi_5 real) | 1.884e+10 | 3613 | 3 | 18836508195 | 1799 | -3.009 | 2.956 | 1e9: -2.635, 2.697 |
| L(s, chi_5 quartic), real part | 1.884e+10 | 3613 | 2 | 18836508195 | 1615 | -3.326 | 3.39 | 1e9: -2.416, 3.39 |
| sign twist (hash signs), main term 0 | 1.884e+10 | 3613 | 2 | 6552394164 | 1473 | -18.14 | 33.76 | 1e9: -15.86, 30.06 |
| THIN-random b = 0.9 | 1.884e+10 | 3613 | None | None | 0 | 327.9 | 2.707e+05 | 1e9: 8.365e+04, 2.101e+05 |
| DEL-random b = 0.9 | 1.884e+10 | 3613 | None | None | 0 | 164.5 | 1.353e+05 | 1e9: 4.183e+04, 1.05e+05 |
| T-NR q = 3, c = 2.2 (zeros Re = 0.904) | 1.884e+10 | 3613 | 1 | 18836508195 | 1375 | -5.905e+05 | 5.159e+05 | 1e9: -3.314e+05, 5.159e+05 |
| T-NR q = 3, c = 2.02 (zeros Re = 0.629) | 1.884e+10 | 3613 | 1 | 18836508195 | 1343 | -172.2 | 200.3 | 1e9: -172.2, 200.3 |
| T-NR q = 1000003, c = 2.2 (zeros Re = 0.532) | 1.884e+10 | 3613 | 1898 | 4419 | 158 | -139.4 | 181.9 | 1e9: 0.6196, 181.9 |
| E_a, a = 0.1, own main term (run to 1e11) | 1.888e+08 | 2757 | None | None | 0 | 3.063 | 15.36 | 1e7: 6.343, 15.05 |
| zeta(s + i), own main term, real part (run to 1e11) | 1.888e+08 | 2757 | 1 | 160479358 | 1383 | -0.4107 | 0.3892 | 1e7: -0.3968, 0.3457 |
| DH, direct Lambda_DH sums (main 0) | 1.131e+06 | 1776 | n/a | n/a | n/a | -5.579 | 6.793 | 1e5: -5.579, 6.793 |

**T88, dyadic N = 2^k (zeta, primes only), m/B:**

10: 1.358, 11: 1.209, 12: 1.092, 13: 1.313, 14: 0.871, 15: 1.329, 16: 0.970, 17: 1.187, 18: 0.983, 19: 1.114, 20: 1.057, 21: 1.056, 22: 1.169, 23: 0.766, 24: 1.339, 25: 0.838, 26: 1.075, 27: 1.053, 28: 1.028, 29: 1.027, 30: 0.965, 31: 1.115, 32: 0.836, 33: 1.217, 34: 0.929, 35: 0.981, 36: 1.039, 37: 0.997, 38: 1.075, 39: 0.787, 40: 1.302, 41: 0.794

**T88 distribution per decade (zeta, primes only), m/B: min, 5%, median, 95%, max**

| decade of N | points | min | 5% | median | 95% | max |
|---|---|---|---|---|---|---|
| 1e0 | 8 | 0.9585 | 0.9941 | 1.304 | 1.643 | 1.661 |
| 1e1 | 90 | 0.8329 | 0.981 | 1.376 | 1.831 | 1.912 |
| 1e2 | 397 | 0.8797 | 0.9343 | 1.256 | 1.605 | 1.708 |
| 1e3 | 426 | 0.8804 | 0.9601 | 1.195 | 1.412 | 1.441 |
| 1e4 | 427 | 0.8652 | 0.9167 | 1.093 | 1.332 | 1.424 |
| 1e5 | 426 | 0.7616 | 0.8555 | 1.09 | 1.287 | 1.365 |
| 1e6 | 426 | 0.7278 | 0.8299 | 1.059 | 1.286 | 1.324 |
| 1e7 | 426 | 0.7722 | 0.8215 | 1.022 | 1.251 | 1.361 |
| 1e8 | 426 | 0.7409 | 0.7926 | 1.018 | 1.249 | 1.314 |
| 1e9 | 427 | 0.7323 | 0.82 | 0.9885 | 1.232 | 1.288 |
| 1e10 | 426 | 0.6703 | 0.7804 | 0.9986 | 1.232 | 1.271 |
| 1e11 | 426 | 0.7094 | 0.7802 | 1.011 | 1.212 | 1.276 |
| 1e12 | 170 | 0.7857 | 0.8148 | 0.987 | 1.249 | 1.314 |

**Resolution of T88 (Nmax = 2.491e+12): hypothetical off-line pair beta + i gamma added by the explicit formula**

| beta | largest gamma that produces a violation on the grid | smallest gamma that produces none |
|---|---|---|
| 0.55 | 14.15 | 7.682 |
| 0.6 | 24.38 | 8.935 |
| 0.7 | 122.6 | 45.19 |
| 0.75 | 257.9 | 99.79 |
| 0.8 | 492.6 | 217.7 |
| 0.9 | 2289 | 580 |
| 1.0 | 1.001e+04 | 4904 |

**Pascal/carry ballot, lambda(N) = log(S_N/C_N)/N^(3/2)**

| sequence | points | first N with lambda < 0 | points with lambda < 0 | min, max per decade of N |
|---|---|---|---|---|
| zeta:theta | 3613 | None | 0 | 1e0: 9259, 1.875e+04; 1e2: 6872, 1.704e+04; 1e4: 6644, 1.641e+04; 1e6: 6255, 1.605e+04; 1e8: 5938, 1.566e+04; 1e10: 7379, 1.317e+04 |
| thin:theta | 3613 | None | 0 | 1e0: 1.141e+05, 5.366e+05; 1e2: 1.505e+06, 3.63e+06; 1e4: 9.114e+06, 2.335e+07; 1e6: 5.85e+07, 1.467e+08; 1e8: 3.69e+08, 9.253e+08; 1e10: 2.328e+09, 3e+09 |
| del:theta | 3613 | None | 0 | 1e0: 6.434e+04, 2.757e+05; 1e2: 7.59e+05, 1.821e+06; 1e4: 4.563e+06, 1.168e+07; 1e6: 2.926e+07, 7.336e+07; 1e8: 1.845e+08, 4.627e+08; 1e10: 1.164e+09, 1.5e+09 |
| TNR_q3_c2.2:theta | 3613 | 1 | 1375 | 1e0: -1.145e+06, 7.597e+05; 1e2: -7.368e+06, 4.762e+06; 1e4: -4.366e+07, 4.07e+07; 1e6: -2.565e+08, 3.94e+08; 1e8: -1.518e+09, 2.362e+09; 1e10: -6.544e+09, 1.199e+09 |
| TNR_q3_c2.02:theta | 3613 | 1 | 1343 | 1e0: -1.461e+05, 1.582e+05; 1e2: -2.664e+05, 2.579e+05; 1e4: -4.645e+05, 4.243e+05; 1e6: -8.128e+05, 9.449e+05; 1e8: -1.445e+06, 1.685e+06; 1e10: -1.861e+06, 4.731e+05 |
| TNR_q1000003_c2.2:theta | 3613 | 1898 | 158 | 1e0: 9259, 1.875e+04; 1e2: 6872, 1.704e+04; 1e4: 6644, 1.641e+04; 1e6: 6255, 1.605e+04; 1e8: 5938, 1.566e+04; 1e10: 7379, 1.317e+04 |

Powers of 10: N=1e0: 14531.9, N=1e1: 10626.6, N=1e2: 12766.9, N=1e3: 12135.8, N=1e4: 12961.4, N=1e5: 14936.2, N=1e6: 11389.5, N=1e7: 8202.87, N=1e8: 12164, N=1e9: 14653.9, N=1e10: 9518.22

Powers of 3 (last six): 3^16: 9710.29, 3^17: 11697.6, 3^18: 12423.3, 3^19: 9504.78, 3^20: 12266.7, 3^21: 12256.6

**Robin comparison** (nu(x) = (1 - sigma(n)/(n e^gamma loglog n)) sqrt(log n) loglog n, n = colossally abundant number of parameter eps = log(1+1/x)/log x; RH (Robin 1984): nu -> 2(sqrt2-1)=0.8284 with zero wave |.| <= 0.0462 and O(1/loglog n) relative corrections)

| decade of largest prime x | points | min nu | max nu | min of e^gamma loglog n - sigma(n)/n |
|---|---|---|---|---|
| 1e3 | 107 | 0.8353 | 0.9197 | 0.01515 |
| 1e4 | 106 | 0.8135 | 0.8642 | 0.004676 |
| 1e5 | 106 | 0.7848 | 0.8383 | 0.001412 |
| 1e6 | 107 | 0.7729 | 0.8191 | 0.0004399 |
| 1e7 | 106 | 0.7586 | 0.8038 | 0.0001415 |
| 1e8 | 106 | 0.7555 | 0.7978 | 4.492e-05 |
| 1e9 | 107 | 0.7593 | 0.7978 | 1.377e-05 |
| 1e10 | 106 | 0.7601 | 0.7951 | 4.368e-06 |
| 1e11 | 106 | 0.751 | 0.7979 | 1.382e-06 |
| 1e12 | 106 | 0.7583 | 0.7974 | 4.402e-07 |

**Triangular inequality (4): R(x) = F(x) - main(x); columns: sup of R/x^(15/8) over the decade (one-sided), sup |R|/x^(15/8) (two-sided)**

| sequence | best one-sided C over x >= 2 (argmax x) | 1e3 | 1e5 | 1e7 | 1e9 | 1e11 | 1e12 |
|---|---|---|---|---|---|---|---|
| zeta, primes only | -8.93e-06 (x = 9.99e+12) | -0.0265 ; 0.067 | -0.00415 ; 0.0104 | -0.000715 ; 0.00171 | -0.00012 ; 0.000297 | -2.11e-05 ; 5.03e-05 | -8.93e-06 ; 2.11e-05 |
| zeta, Lambda-weighted | 0.000143 (x = 1.65e+05) | -0.000325 ; 0.0052 | 0.000143 ; 0.000224 | 3.58e-05 ; 3.58e-05 | 7.45e-06 ; 7.45e-06 | 1.77e-06 ; 1.77e-06 | 4.77e-07 ; 4.9e-07 |
| L(s, chi_4) | 0.00603 (x = 487) | 0.00498 ; 0.00498 | 0.000863 ; 0.000923 | 0.000161 ; 0.000194 | 3.9e-05 ; 3.9e-05 | 3.4e-06 ; 5.37e-06 | 2.51e-06 ; 2.51e-06 |
| sign twist, main 0 | 0.267 (x = 13) | 0.0631 ; 0.0631 | 0.00312 ; 0.0127 | -0.000467 ; 0.00513 | 0.00113 ; 0.00113 | 8.12e-05 ; 0.000169 | -7.69e-05 ; 0.000172 |
| THIN-random b = 0.9 | -0.409 (x = 2) | -0.616 ; 0.723 | -0.772 ; 0.817 | -0.862 ; 0.923 | -0.981 ; 1.04 | -1.1 ; 1.17 | -1.17 ; 1.24 |
| DEL-random b = 0.9 | -0.336 (x = 791) | -0.342 ; 0.375 | -0.391 ; 0.411 | -0.432 ; 0.462 | -0.491 ; 0.52 | -0.551 ; 0.583 | -0.583 ; 0.618 |
| T-NR q = 3, c = 2.2 | 0.406 (x = 2.21e+12) | 0.23 ; 0.23 | 0.261 ; 0.261 | 0.296 ; 0.302 | 0.336 ; 0.347 | 0.381 ; 0.394 | 0.406 ; 0.419 |
| T-NR q = 3, c = 2.02 | 0.146 (x = 9) | 0.0268 ; 0.0374 | 0.00846 ; 0.0113 | 0.0028 ; 0.00368 | 0.000944 ; 0.00124 | 0.000319 ; 0.000319 | 0.000185 ; 0.000185 |
| T-NR q = 1000003, c = 2.2 | 0.0468 (x = 2.18e+06) | -0.000325 ; 0.0052 | 0.000143 ; 0.000224 | 0.0205 ; 0.0205 | 0.0004 ; 0.0004 | 8.65e-06 ; 8.65e-06 | 1.04e-06 ; 0.000339 |
| E_a a = 0.1 (to 1e11) | 0.000614 (x = 6.43e+04) | -0.000288 ; 0.0109 | 0.000597 ; 0.000809 | 0.00021 ; 0.00021 | 6.13e-05 ; 6.13e-05 | - | - |
| DH direct (to 6e8), two-sided only | - | 0.00638 | 0.00165 | 0.000346 | nan | nan | nan |

Centred residual r(x) = (psi_1(x) - x^2/2 + x log 2pi - zeta'/zeta(-1))/x^(3/2): sign changes on the grid: 181 in total, 125 up to 4.93e8; per decade [[0, 3], [1, 17], [2, 14], [3, 17], [4, 14], [5, 16], [6, 18], [7, 17], [8, 14], [9, 11], [10, 12], [11, 14], [12, 14], [13, 0]]; range for x >= 1e3: [-0.02274, 0.02423] (bound 0.04619).
Primes-only residual R(x)/x^(3/2) for x >= 1e3: [-0.8967, -0.6532]; sign changes of R: 0.

**DH: direct sums against the explicit formula with the zero table (height <= 2000)**


T88 (units of B): first decade where the off-line part exceeds the on-line part: 1e6 (3x: 1e8)

| decade of N | points | direct min | direct max | rms(explicit formula - direct) | max on-line part | max off-line part |
|---|---|---|---|---|---|---|
| 1e1 | 70 | -1.34 | 1.54 | 0.0019 | 1.54 | 0.0471 |
| 1e2 | 397 | -1.69 | 1.67 | 0.00044 | 1.66 | 0.0723 |
| 1e3 | 426 | -1.47 | 1.38 | 0.00038 | 1.44 | 0.155 |
| 1e4 | 427 | -1.68 | 1.67 | 0.00076 | 1.49 | 0.294 |
| 1e5 | 426 | -1.84 | 1.97 | 0.0017 | 1.61 | 0.677 |
| 1e6 | 426 | -2.17 | 2.12 | 0.0038 | 1.41 | 1.42 |
| 1e7 | 426 | -3.93 | 3.11 | 0.0091 | 1.56 | 2.77 |
| 1e8 | 76 | -3.11 | 3.64 | 0.014 | 0.954 | 3.03 |

Explicit-formula extrapolation, max |off-line part| / max |on-line part| per decade: 1e2: 0.0482, 1e4: 0.207, 1e6: 1.02, 1e8: 3.55, 1e10: 16.5, 1e12: 82.4, 1e14: 327, 1e16: 1.74e+03

T91 (units of B): first decade where the off-line part exceeds the on-line part: 1e5 (3x: 1e7)

| decade of N | points | direct min | direct max | rms(explicit formula - direct) | max on-line part | max off-line part |
|---|---|---|---|---|---|---|
| 1e1 | 70 | -1.72 | 1.35 | 0.0006 | 1.63 | 0.118 |
| 1e2 | 397 | -1.92 | 2.09 | 0.00073 | 1.96 | 0.252 |
| 1e3 | 426 | -2.35 | 2.3 | 0.0013 | 1.89 | 0.516 |
| 1e4 | 427 | -2.4 | 2.51 | 0.0029 | 1.7 | 1.13 |
| 1e5 | 426 | -3.05 | 3.43 | 0.0065 | 1.67 | 2.26 |
| 1e6 | 136 | -3.94 | 4.09 | 0.011 | 1.87 | 2.94 |

Explicit-formula extrapolation, max |off-line part| / max |on-line part| per decade: 1e2: 0.131, 1e4: 0.66, 1e6: 2.72, 1e8: 11.5, 1e10: 61.6, 1e12: 249, 1e14: 1.27e+03, 1e16: 6.35e+03

T93 (units of B): first decade where the off-line part exceeds the on-line part: 1e6 (3x: 1e7)

| decade of N | points | direct min | direct max | rms(explicit formula - direct) | max on-line part | max off-line part |
|---|---|---|---|---|---|---|
| 1e1 | 70 | -2.78 | 3.81 | 0.00081 | 3.78 | 0.176 |
| 1e2 | 398 | -3.81 | 3.52 | 0.0013 | 3.64 | 0.367 |
| 1e3 | 427 | -3.76 | 4.33 | 0.0027 | 3.86 | 0.758 |
| 1e4 | 429 | -4.36 | 4.4 | 0.0059 | 3.6 | 1.62 |
| 1e5 | 428 | -5.58 | 6.79 | 0.013 | 3.81 | 3.67 |
| 1e6 | 24 | -0.597 | 6.54 | 0.019 | 3.41 | 3.6 |

Explicit-formula extrapolation, max |off-line part| / max |on-line part| per decade: 1e2: 0.0951, 1e4: 0.449, 1e6: 2.12, 1e8: 11.1, 1e10: 48.5, 1e12: 241, 1e14: 1.36e+03, 1e16: 7.26e+03
