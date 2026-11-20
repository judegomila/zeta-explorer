# s4-bridge-shift-ratio-prime-echo: screening of four bridge / echo-train / Pick / two-line combinations

Date 2026-11-20. Screening arm of the 7-day campaign. Single agent, no referee pass. No statement about the zeros of
zeta is made and no bound changes.
Labels: PROVED (argument written here), CLASSICAL, CERTIFIED (Arb ball arithmetic: every ball used has a definite
sign), MEASURED (float64, long double, or Arb midpoints), ARGUED.

## 0. Verdict

Four combinations screened. **Survivors: 0.**

| # | combination (nodes) | statistic | sizes reached | zeta | comparison L-function | controls | classification |
|---|---|---|---|---|---|---|---|
| 1 | prime-delay-domination-15-4 + prime-delay-domination + darlington-losslessness-s7 | D_P(x, t) = Re G(1/2+x+it) - Re sum_{p^m <= P} c(p^m)(log p) p^(-m(1/2+x+it)), sharp and Fejer cutoff; x*(t, P) on a 15-point grid x in [0.005, 0.5] | all prime powers to 1e9 at 36 864 heights (t from 1e2 to 1e10); to 1e7 at 1.18e6 heights; to 1e6 at 1.0e7 heights (GPU float64, re-checked in long double at 27 points) | Fejer: positive at every point (minimum 0.030). Sharp: negative at up to 44% of the heights, largest negative x = 0.1 at P = 1e9 (x* log P between 1.4 and 2.1) | L(chi_-4): the same as zeta in both forms | Sign twist, random unimodular twist, Liouville: same distribution as zeta for log P/log t < 0.6, failing fraction 0.30 at log P/log t = 4.5. E_a (1/4), T-NR q = 3: fail (x* to 0.15, 0.3). T-NR q = 1000003 (delta = 0.032): passes the Fejer form at every size. DH (all n to 1e7): train unbounded, negative outside the half-disks. Planted quadruple (zero-side model): seen from at most 14 units of height at P = 1e9. HEAT: no train. WT: translate, passes | CLOSED. Weil functional of one positive-definite test function (rows G8, P8); a control with a tempered train and off-line zeros passes; the twists separate only when P is of order t^0.6 |
| 2 | zero-packet-identity + shift-ratio-threshold + zv-bridge-understates-log-derivative | B_a = tanh(log abs X(w+a) - log abs X(w-a)); rho_a = [B_a/(2a)]/Re F'/F; a in {0.02, 0.1, 0.25}, 14 abscissae in (0, 0.5] | zeta: 6.44e6 grid points per a, Im w to 1e8 + 400 (Arb, 96 bits) | B_a > 0, Re F'/F > 0 everywhere (CERTIFIED); min rho_a = 0.200, 0.0100, 0.0017 = x^2/(x^2+a^2) at the smallest x | L(chi_-4) to 1400, L(chi_5) to 200: the same | DH (Im w to 2000, 84 pairs), E_a (1/4, 1/8), T-NR, HEAT-0.5, two planted pairs (at 1e6, 1e8): every negative value inside the disks of radius sqrt(delta^2 - a^2); outside: 0 of 871 920 grid points per a. LIOU: negative at 8 to 12% of the grid (poles on the line). WT: passes. Sign twists: no continuation | CLOSED. Negativity outside the disks is impossible for an even function of order one (Hadamard); restates G8, P8, G20 |
| 3 | blaschke-ghost-negative-square + ghost-zero-witness + l2-detection-modulus | first certified negative LDL pivot of the Pick matrix of R_a (a = 0.1), nodes with abs Im w <= H0; lead = gamma_off - H0 | H0 from 60 down to 0.15 (DH, E_a), 0.12 (T-NR); 2000-bit balls decide 125 to 250 nodes; 5000 to 6000 bits used to settle the rest; 4096-node meshes only in midpoint arithmetic (rejected: false negatives) | index 0 on every certified section (up to 421 nodes at 6000 bits) | L(chi_5): index 0 (up to 404 nodes) | DH ghost (85.70): lead 80.7 at 2000 bits, node count 149 +- 1, pivot 2^-1164 at H0 = 10. Same quadruple planted on zeta: lead >= 85.55, 101 nodes, 2^-898; planted on L(chi_5): lead 75.7, 166 nodes, 2^-1478. E_a, T-NR: equal to their planted pairs within one node and 1.5 bits. HEAT at 2000 bits: not completed | CLOSED. Control lead below the planted lead on zeta; cost = zero count to 1.5 gamma in nodes, distance in bits (verified height in another form) |
| 4 | fe-plus-reality-rigidity + phase-retrieval-zeta + lac-sens-displacement-bound | eps(P, gamma) = error of log abs of the Euler product on Re s = 1.25; delta_min = smallest swap displacement rejected; number of the 9 configurations compatible | primes to 1e9, gamma from 1e2 to 1e10 (512 heights per window); DH series to 1e7 terms | eps = 2.4e-8 to 1.0e-7 (gamma <= 1e9); planted swap rejected for delta above 0.4 to 1.1 eps, i.e. 1e-8 to 1e-7, with no decay in gamma | L(chi_-4): eps 3.0e-8, 3.7e-8 (gamma 1e2, 1e3) | DH: eps 1.9e-9; for each of its quadruples at 114.16, 166.48, 176.70 the upper-pair state is fixed (3 of 9 left, as for the planted swap) | CLOSED. Identifies the configuration of an existing quadruple given exact modulus on the line; treats DH and the planted swap alike (rows L2, P6); separation on a line right of 1 |

Known pattern to beat (separation only by resolving the off-line zeros, or only to the right of 1): not beaten.

- (1) has two forms. With the Fejer weight the statistic is a sum over zeros of a kernel with nonnegative real part
  (section 2.1): it is the Weil functional of one positive-definite test function, zeta's pass up to 1e10 follows from
  the verified height, and an off-line pair at distance d from the sample is seen only when P exceeds about
  (d^2 log P)^(1/delta). With the sharp cutoff the kernel is sign-indefinite and zeta itself has negative values at
  x up to about 2/log P. The sign twists and the random unimodular twist have the same distribution of the statistic
  as zeta when log P is small against log t and separate from it only as log P/log t grows.
- (2) negativity of the shift difference outside the disks is excluded for every even function of order one by the
  Hadamard product (section 3); the grid shows 0 such points for every control with a functional equation.
- (3) at 2000 bits the pair planted on zeta is certified from boxes down to half-height 0.15, the DH ghost only down
  to half-height 5; the control does not lead.
- (4) the second line identifies which Blaschke configuration is present once an off-line quadruple exists and the
  modulus on the critical line is known exactly; it treats DH and a planted swap in the same way and says nothing
  about whether a quadruple exists.

## 1. Objects, code, validation

Conventions: s = 1/2 + w, w = x + i t; X(w) = F(1/2 + w) is the completed function, even in w where a functional
equation holds. Objects (lib.py, copied from s3-lacunary-pick-ghost-index and extended; echo.py for the prime side):

| code | object | functional equation | off-line zeros used |
|---|---|---|---|
| ZETA | xi(s) | yes | none below the verified height |
| CHI4 / LCHI4, LCHI5 | completed L(s, chi_-4); real even character mod 5 | yes | none known (positive comparison) |
| DH | Davenport-Heilbronn, conductor 5 | yes | 84 pairs below 2000 (dh_zeros.json); first: delta = 0.3085 at 85.699 |
| EA (a_E = 1/4, 1/8) | xi(s + a_E) xi(s - a_E); coefficients Lambda(n)(n^a_E + n^-a_E) | yes | delta = a_E at every zeta ordinate |
| TNR3, TNR1000003 | xi(s) q^s (1 + 2.2 q^(1/2-s) + q^(1-2s)), q = 3 or 1000003 | yes | delta = arccosh(1.1)/log q at (2k+1) pi/log q (q = 3: 0.4038 at 2.8596 + 5.7192 k) |
| HEAT-0.5 | Gaussian deformation of xi, tau = -0.5 | yes | delta = 0.2430 at 111.694 (battery table) |
| LIOU | zeta(2s)/zeta(s) with the gamma factor of zeta (eps(p) = -1) | no | poles at the zeta zeros, zero at s = 1 |
| SGN | completely multiplicative eps(p) = +-1, sign = top bit of SplitMix64(p) | no | no continuation on file |
| U | completely multiplicative, c(p) = e(u_p), u_p uniform from the same hash | no | no continuation on file |
| WT | xi(s + i alpha), alpha = 1.2393 (unimodular twist n^(-i alpha), a translate) | s <-> 1 - s - 2 i alpha | none |
| PL:base:delta:gamma | base times the quadruple +-delta +- i gamma | yes | the planted quadruple |

Which control enters which combination. (1) needs Dirichlet coefficients: HEAT has none and is not applicable; WT is
the zeta train evaluated at t + alpha against a drift that differs by O(alpha/t), so it passes with zeta (PROVED, one
line) and is not run separately. (2), (3) need X on both sides of the line: SGN and U have no continuation and are not
applicable; LIOU and WT are run in (2). (4): section 5.

Validation (each run through scripts/memcap.sh 8 on the Mac):

- echo.py float sums against 30-digit mpmath sums over all prime powers up to 1e5 (val_echo.py): ZETA, SGN, U agree to
  3e-12; asymptotic digamma drift equals the exact one to 1e-16 at t = 1000.
- Limits: at x = 0.5, t = 5000.12, P = 1e5 the pole-corrected sharp train gives D = 3.8952 against the exact
  Re xi'/xi = 3.8868 (Arb); L(chi_-4): 4.4173 against 4.4186; LIOU: 3.1239 against 3.1319 (closed form
  G - zeta'/zeta(s) + 2 zeta'/zeta(2s)); TNR3: 4.5566 against 4.4052 (Arb, local train truncated at 3^10).
- Fejer statistic against its zero-side formula (val_fejer.py, P = 1e5, t = 1500.30 and 1500.67, zeros below 4000):
  agreement 2e-7 at x = 0.005 down to 1e-10 at x = 0.5 (section 2.1).
- DH coefficients (dh_train.py): train at Re s = 3 against Arb F'/F: 2.18394637245 both; DH(1.25 + it) from 1e5
  terms against Arb: 3e-7.
- GPU float64 against long double (63-bit mantissa, CPU, recheck.py), all prime powers, 3 abscissae, 18 points:
  run A (P = 1e9, 9 points, one per height): largest difference 4e-12 at t = 100, 2e-8 at 1e6, 5e-7 at 1e8, 4e-6 at 1e9, 9.7e-5 at 1e10; run B (P = 1e7, 18 points): the same sizes (1.2e-4 at 1e10). The float64 phase t log p loses t log p x 1.1e-16.
- c2_shift.py: E_a with a_E = 1/4 has no negative value of B_a at a = 0.25 (the threshold a >= Delta of node
  shift-ratio-threshold), and negative values at a = 0.02 and 0.1 only inside the disks; the simple-zero minimum
  x^2/(x^2 + a^2) of node zv-bridge-understates-log-derivative is reproduced by zeta at the smallest grid x
  (0.2000, 0.0101, 0.0018 for a = 0.02, 0.1, 0.25 at x = 0.01; model 0.2000, 0.0099, 0.0016).
- c3_lead.py: box (0.05, 2] x [-10, 10], a = 0.1 reproduces the s3 values: planted pair at 85.70 on zeta first negative
  pivot at n = 101, 2^-898.2; at 40: n = 35, 2^-210.8; DH: n = 149, 2^-1163.9; zeta: index 0.

## 2. Combination (1): prime-delay echo train against the gamma drift

Nodes: prime-delay-domination-15-4, prime-delay-domination (Conjecture 15.4, Re xi'/xi > 0 right of the line; map rows
G8, P8), darlington-losslessness-s7 (map row G10: the cascade is valid for Re s > 1 only).

Finite statement tested. E_P(s) = sum over n = p^m <= P of c(n) Lambda(n) n^-s; D_P(x, t) = Re G(s) - Re E_P(s) with G the
gamma drift of the completed function (zeta: 1/s + 1/(s-1) - (log pi)/2 + psi(s/2)/2). Two cutoffs: sharp, and Fejer
(weight 1 - log n/log P). No certified tail exists in the strip; the explicit pole term of the truncated sum
(P^(1-s)/(1-s) sharp, P^(1-s)/((1-s)^2 log P) Fejer) is added where the function has a pole ("+pole"). x*(t, P) =
smallest grid x such that D_P > 0 at every larger grid x; grid x in {0.005, 0.01, 0.015, 0.02, 0.03, 0.04, 0.06, 0.08,
0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5}. Survival would need: zeta's sup over t of x* tends to 0 with P at a rate that
does not depend on t, and each control keeps x* bounded below at t far from its off-line zeros for a reason other than
its zeros being resolved.

### 2.1 What the statistic is (PROVED / CLASSICAL)

Shifting the contour in (1/2 pi i) int -zeta'/zeta(s + w) K(w) dw, with K(w) = P^w/w (sharp) or P^w/(w^2 L) (Fejer),
L = log P, gives for Re s > 1/2 and zeta:

    D_sharp+pole(s) = sum_rho Re L k_1((rho - s) L) + O(P^(-5/2)/t),            k_1(u) = (e^u - 1)/u   = int_0^1 e^(uv) dv
    D_Fejer+pole(s) = sum_rho Re L k((rho - s) L)   + O(1/(t L)),                k(u)   = (e^u - 1 - u)/u^2 = int_0^1 (1 - v) e^(uv) dv

(sums over the nontrivial zeros, paired; the O-terms are the trivial zeros and 1/((s-1)^2 L)). The same holds for
every function with a functional equation, an Euler-type train and its own gamma drift.

Lemma (Fejer kernel). Re k(u) >= 0 for Re u <= 0. Proof: with u = -a + iy, a >= 0, Re k(u) is the cosine transform
at y of f(v) = (1 - v) e^(-av) on [0, 1] (0 beyond), which is nonnegative, decreasing and convex on [0, infinity):
f'' = e^(-av)(a^2 (1 - v) + 2a) >= 0 on [0, 1] and the slope jumps upward, from -e^(-a) to 0, at v = 1. Polya's
criterion gives a nonnegative transform. For a = 0 it is (1 - cos y)/y^2.

Consequences.

1. Every zero with Re rho <= 1/2 + x contributes a nonnegative term to D_Fejer(x, t). So D_Fejer >= -O(1/(t L)) at
   every x > 0 when the zeros are on the line (measured: positive, minimum 0.030): the statistic is the Weil functional of the positive-definite test function
   (1 - abs(u)/L)_+ e^(-x abs(u)) cos(tu). An off-line zero 1/2 + delta + i gamma contributes
   Re e^((delta - x) L + i(gamma - t) L)/((delta - x + i(gamma - t))^2 L): negative values of size
   P^(delta - x)/(L d^2) at distance d = abs(gamma - t). It is visible against the positive part (about (1/2) log t)
   only when d < P^((delta - x)/2)/sqrt(L log t) roughly: a lead d costs P of order (d^2 L log t)^(1/delta).
2. k_1 is the transform of the indicator of [0, 1] damped by e^(-av), which has a downward jump e^(-a) = P^(-x) at
   v = 1; Re k_1 changes sign. The sharp statistic is negative for zeta itself wherever P^(-x) times the oscillating
   sum over nearby zeros exceeds the positive part: x* = (log of that ratio)/log P. This is the c/log P of the task
   statement, with c the logarithm of a local ratio of zero sums (measured: largest negative x times log P between 1.4 and 2.1).
3. For zeta with t <= 1e10 and P <= 1e9 the pass of the Fejer form is implied by the verified height: zeros below
   3e12 are on the line, and the zeros above it, at distance d >= 2.9e12, contribute in total at most P^(1/2)/L times
   the sum of 1/d^2, about 2e-9.

### 2.2 Runs

Server, GPU 1, float64 (screen). Run A: all 50 850 235 prime powers up to 1e9, 4096 random t in [H, H + 1000] for each
H = 1e2, 1e3, ..., 1e10 (36 864 points), checkpoints P = 1e3, ..., 1e9. Run B: P up to 1e7, 131 072 points per height
(1 179 648 points). Run C: P up to 1e6, 1 114 112 points per height (10 027 008 points). DH: all n up to 1e7 (the
coefficients Lam_DH = (a log) * a^(-1) are supported on all integers), 2048 points for H = 1e2 .. 1e6.
Objects in each run: ZETA, CHI4, SGN, LIOU, U, EA (a_E = 1/4), TNR3, TNR1000003.

**Run A (primes to 1e9; 4096 points per height).** Cells: fraction of the sampled t with D <= 0 at some grid x; in
brackets the largest grid x with D <= 0 over the sample (sup of x* is the next grid value). Full set of 16 tables:
out/tablesA.md; runs B and C: out/tablesB.md, out/tablesC.md.

**ZETA:sharp+pole**

| height \ P | 1000 | 100000 | 1e+07 | 1e+09 |
|---|---|---|---|---|
| 100 | 0.3188 [0.2] | 0.3943 [0.15] | 0.4309 [0.1] | 0.4414 [0.1] |
| 1000 | 0.2712 [0.2] | 0.3738 [0.15] | 0.3972 [0.1] | 0.4197 [0.1] |
| 10000 | 0.1631 [0.2] | 0.3049 [0.1] | 0.3794 [0.1] | 0.3904 [0.1] |
| 100000 | 0.0813 [0.15] | 0.2456 [0.1] | 0.3323 [0.1] | 0.3599 [0.08] |
| 1e+06 | 0.0413 [0.1] | 0.1719 [0.1] | 0.2803 [0.08] | 0.3359 [0.08] |
| 1e+07 | 0.0137 [0.1] | 0.1084 [0.1] | 0.2249 [0.08] | 0.2844 [0.06] |
| 1e+08 | 0.0103 [0.06] | 0.0801 [0.1] | 0.1736 [0.08] | 0.2444 [0.06] |
| 1e+09 | 0.0017 [0.06] | 0.0510 [0.08] | 0.1345 [0.08] | 0.2161 [0.06] |
| 1e+10 | 2.4e-04 [0.02] | 0.0288 [0.08] | 0.0928 [0.06] | 0.1548 [0.06] |

**ZETA:fejer+pole**

| height \ P | 1000 | 100000 | 1e+07 | 1e+09 |
|---|---|---|---|---|
| 100 | 0 | 0 | 0 | 0 |
| 1000 | 0 | 0 | 0 | 0 |
| 10000 | 0 | 0 | 0 | 0 |
| 100000 | 0 | 0 | 0 | 0 |
| 1e+06 | 0 | 0 | 0 | 0 |
| 1e+07 | 0 | 0 | 0 | 0 |
| 1e+08 | 0 | 0 | 0 | 0 |
| 1e+09 | 0 | 0 | 0 | 0 |
| 1e+10 | 0 | 0 | 0 | 0 |

**SGN:sharp**

| height \ P | 1000 | 100000 | 1e+07 | 1e+09 |
|---|---|---|---|---|
| 100 | 0.2534 [0.5] | 0.3503 [0.5] | 0.4114 [0.5] | 0.4404 [0.5] |
| 1000 | 0.2119 [0.4] | 0.3140 [0.4] | 0.3743 [0.4] | 0.4089 [0.4] |
| 10000 | 0.1233 [0.3] | 0.2524 [0.3] | 0.3140 [0.3] | 0.3459 [0.3] |
| 100000 | 0.0759 [0.15] | 0.1799 [0.2] | 0.2654 [0.2] | 0.3015 [0.2] |
| 1e+06 | 0.0374 [0.15] | 0.1331 [0.15] | 0.2239 [0.15] | 0.2852 [0.15] |
| 1e+07 | 0.0183 [0.1] | 0.1021 [0.2] | 0.1802 [0.2] | 0.2275 [0.2] |
| 1e+08 | 0.0073 [0.08] | 0.0684 [0.1] | 0.1458 [0.15] | 0.1924 [0.15] |
| 1e+09 | 0.0039 [0.04] | 0.0393 [0.1] | 0.1001 [0.1] | 0.1584 [0.1] |
| 1e+10 | 0.0022 [0.04] | 0.0310 [0.08] | 0.0876 [0.1] | 0.1411 [0.1] |

**SGN:fejer**

| height \ P | 1000 | 100000 | 1e+07 | 1e+09 |
|---|---|---|---|---|
| 100 | 0.0544 [0.3] | 0.1687 [0.4] | 0.2517 [0.5] | 0.3030 [0.5] |
| 1000 | 0.0210 [0.25] | 0.1133 [0.3] | 0.1909 [0.4] | 0.2566 [0.4] |
| 10000 | 0.0034 [0.1] | 0.0527 [0.2] | 0.1213 [0.25] | 0.1758 [0.25] |
| 100000 | 0 | 0.0156 [0.08] | 0.0525 [0.1] | 0.1062 [0.15] |
| 1e+06 | 0 | 0.0022 [0.04] | 0.0312 [0.08] | 0.0757 [0.1] |
| 1e+07 | 0 | 0.0020 [0.06] | 0.0146 [0.1] | 0.0386 [0.15] |
| 1e+08 | 0 | 0 | 0.0037 [0.06] | 0.0210 [0.1] |
| 1e+09 | 0 | 0 | 7.3e-04 [0.02] | 0.0083 [0.04] |
| 1e+10 | 0 | 0 | 2.4e-04 [0.015] | 0.0039 [0.04] |

**U:fejer**

| height \ P | 1000 | 100000 | 1e+07 | 1e+09 |
|---|---|---|---|---|
| 100 | 0.0474 [0.3] | 0.1494 [0.4] | 0.2373 [0.4] | 0.2886 [0.4] |
| 1000 | 0.0222 [0.15] | 0.1091 [0.25] | 0.1890 [0.3] | 0.2542 [0.3] |
| 10000 | 0.0034 [0.08] | 0.0464 [0.15] | 0.1118 [0.2] | 0.1667 [0.25] |
| 100000 | 2.4e-04 [0.015] | 0.0146 [0.1] | 0.0679 [0.15] | 0.1155 [0.2] |
| 1e+06 | 0 | 0.0049 [0.06] | 0.0249 [0.1] | 0.0635 [0.1] |
| 1e+07 | 0 | 7.3e-04 [0.03] | 0.0100 [0.06] | 0.0330 [0.1] |
| 1e+08 | 0 | 0 | 0.0020 [0.04] | 0.0183 [0.06] |
| 1e+09 | 0 | 0 | 0.0012 [0.03] | 0.0076 [0.04] |
| 1e+10 | 0 | 0 | 2.4e-04 [0.005] | 0.0032 [0.04] |

**LIOU:fejer+pole**

| height \ P | 1000 | 100000 | 1e+07 | 1e+09 |
|---|---|---|---|---|
| 100 | 0.0518 [0.4] | 0.1892 [0.4] | 0.2148 [0.5] | 0.2046 [0.5] |
| 1000 | 0.0198 [0.2] | 0.1284 [0.3] | 0.2290 [0.3] | 0.2258 [0.3] |
| 10000 | 0.0024 [0.1] | 0.0371 [0.2] | 0.1499 [0.2] | 0.2217 [0.25] |
| 100000 | 0 | 0.0188 [0.15] | 0.0408 [0.2] | 0.1392 [0.2] |
| 1e+06 | 0 | 0.0027 [0.04] | 0.0271 [0.1] | 0.0464 [0.1] |
| 1e+07 | 0 | 7.3e-04 [0.02] | 0.0149 [0.08] | 0.0327 [0.1] |
| 1e+08 | 0 | 2.4e-04 [0.02] | 0.0034 [0.08] | 0.0212 [0.1] |
| 1e+09 | 0 | 0 | 2.4e-04 [0.005] | 0.0076 [0.03] |
| 1e+10 | 0 | 0 | 0 | 0.0017 [0.03] |

**EA:fejer+pole**

| height \ P | 1000 | 100000 | 1e+07 | 1e+09 |
|---|---|---|---|---|
| 100 | 0.1343 [0.08] | 0.3870 [0.1] | 0.4844 [0.15] | 0.5146 [0.15] |
| 1000 | 0.0752 [0.08] | 0.3821 [0.1] | 0.4578 [0.15] | 0.5115 [0.15] |
| 10000 | 0.0227 [0.04] | 0.3162 [0.1] | 0.4680 [0.15] | 0.5120 [0.15] |
| 100000 | 0.0024 [0.03] | 0.2378 [0.1] | 0.4438 [0.15] | 0.5042 [0.15] |
| 1e+06 | 2.4e-04 [0.015] | 0.1672 [0.1] | 0.3948 [0.15] | 0.4944 [0.15] |
| 1e+07 | 0 | 0.0991 [0.1] | 0.3474 [0.15] | 0.4712 [0.15] |
| 1e+08 | 0 | 0.0684 [0.08] | 0.3091 [0.15] | 0.4402 [0.15] |
| 1e+09 | 0 | 0.0437 [0.1] | 0.2654 [0.1] | 0.4158 [0.15] |
| 1e+10 | 0 | 0.0208 [0.08] | 0.2207 [0.1] | 0.3977 [0.15] |

**TNR3:fejer+pole**

| height \ P | 1000 | 100000 | 1e+07 | 1e+09 |
|---|---|---|---|---|
| 100 | 0.0730 [0.15] | 0.2986 [0.25] | 0.4543 [0.3] | 0.5208 [0.3] |
| 1000 | 0.0356 [0.1] | 0.2537 [0.25] | 0.4456 [0.3] | 0.4985 [0.3] |
| 10000 | 0.0139 [0.1] | 0.2031 [0.2] | 0.4226 [0.25] | 0.4983 [0.3] |
| 100000 | 0.0027 [0.03] | 0.1562 [0.15] | 0.3928 [0.25] | 0.4932 [0.3] |
| 1e+06 | 2.4e-04 [0.015] | 0.1382 [0.15] | 0.3569 [0.25] | 0.4871 [0.3] |
| 1e+07 | 0 | 0.1077 [0.15] | 0.3318 [0.25] | 0.4824 [0.25] |
| 1e+08 | 0 | 0.0991 [0.15] | 0.2957 [0.2] | 0.4822 [0.25] |
| 1e+09 | 0 | 0.0901 [0.15] | 0.2708 [0.2] | 0.4722 [0.25] |
| 1e+10 | 0 | 0.0894 [0.1] | 0.2371 [0.2] | 0.4548 [0.25] |

**TNR1000003:sharp+pole**

| height \ P | 1000 | 100000 | 1e+07 | 1e+09 |
|---|---|---|---|---|
| 100 | 0 | 0 | 0.2949 [0.06] | 0.2966 [0.06] |
| 1000 | 0 | 0 | 0.2935 [0.06] | 0.2944 [0.06] |
| 10000 | 0 | 0 | 0.2715 [0.06] | 0.2722 [0.06] |
| 100000 | 0 | 0 | 0.2537 [0.06] | 0.2510 [0.06] |
| 1e+06 | 0 | 0 | 0.2346 [0.06] | 0.2292 [0.06] |
| 1e+07 | 0 | 0 | 0.2058 [0.06] | 0.2039 [0.06] |
| 1e+08 | 0 | 0 | 0.2007 [0.06] | 0.1873 [0.06] |
| 1e+09 | 0 | 0 | 0.1743 [0.04] | 0.1675 [0.04] |
| 1e+10 | 0 | 0 | 0.1519 [0.04] | 0.1577 [0.04] |

Not printed (out/tablesA.md): CHI4:fejer and TNR1000003:fejer+pole are 0 in every cell; CHI4:sharp follows ZETA:sharp+pole
(0.43 [0.1] at height 100, 0.15 [0.06] at height 1e10, P = 1e9); U:sharp and LIOU:sharp+pole follow SGN:sharp;
EA:sharp+pole and TNR3:sharp+pole are between 0.33 and 0.53 for P >= 1e5 with largest negative x = 0.25 to 0.4.

**Run C (primes to 1e6; 1 114 112 points per height, 1.0e7 in all).**

**ZETA:sharp+pole**

| height \ P | 1000 | 10000 | 100000 | 1e+06 |
|---|---|---|---|---|
| 100 | 0.3162 [0.25] | 0.3694 [0.2] | 0.3966 [0.15] | 0.4127 [0.15] |
| 1000 | 0.2606 [0.2] | 0.3357 [0.15] | 0.3699 [0.15] | 0.3912 [0.15] |
| 10000 | 0.1614 [0.2] | 0.2587 [0.15] | 0.3123 [0.1] | 0.3446 [0.1] |
| 100000 | 0.0795 [0.15] | 0.1680 [0.15] | 0.2379 [0.1] | 0.2875 [0.1] |
| 1e+06 | 0.0371 [0.15] | 0.1023 [0.1] | 0.1675 [0.1] | 0.2324 [0.1] |
| 1e+07 | 0.0157 [0.1] | 0.0609 [0.1] | 0.1138 [0.1] | 0.1698 [0.1] |
| 1e+08 | 0.0075 [0.1] | 0.0312 [0.1] | 0.0739 [0.1] | 0.1227 [0.1] |
| 1e+09 | 0.0021 [0.06] | 0.0181 [0.1] | 0.0479 [0.08] | 0.0873 [0.08] |
| 1e+10 | 5.3e-04 [0.02] | 0.0082 [0.06] | 0.0292 [0.08] | 0.0633 [0.08] |

**SGN:fejer**

| height \ P | 1000 | 10000 | 100000 | 1e+06 |
|---|---|---|---|---|
| 100 | 0.0526 [0.3] | 0.1086 [0.4] | 0.1643 [0.4] | 0.2068 [0.4] |
| 1000 | 0.0197 [0.3] | 0.0641 [0.3] | 0.1100 [0.3] | 0.1524 [0.4] |
| 10000 | 0.0024 [0.1] | 0.0173 [0.2] | 0.0486 [0.2] | 0.0822 [0.25] |
| 100000 | 0 | 0.0032 [0.08] | 0.0151 [0.1] | 0.0355 [0.1] |
| 1e+06 | 0 | 2.1e-04 [0.015] | 0.0031 [0.06] | 0.0119 [0.08] |
| 1e+07 | 0 | 2.6e-04 [0.02] | 0.0011 [0.06] | 0.0046 [0.1] |
| 1e+08 | 0 | 0 | 0 | 0.0010 [0.04] |
| 1e+09 | 0 | 0 | 0 | 1.1e-04 [0.01] |
| 1e+10 | 0 | 0 | 0 | 0 |

In run C, ZETA:fejer+pole and CHI4:fejer are 0 in all 36 cells (1.0e7 points, 15 abscissae, 4 checkpoints each). Minimum of
D_Fejer+pole for zeta over every sample: 0.0410 (run C), 0.0324 (run B), 0.0304 (run A); for L(chi_-4): 0.0775,
0.0692, 0.0734.

**DH (all n up to 1e7; 2048 points per height).** Lam_DH is unbounded: max abs Lam_DH(n) over n <= N = 5.9, 18.5, 74.9,
349, 2098, 13984 for N = 1e2, ..., 1e7, and sqrt(sum Lam_DH(n)^2/n) = 3.4, 6.2, 10.3, 17.6, 33.0, 67.2
(for zeta this is about (log N)/sqrt 2 = 11.4 at 1e7).

| height | sharp N = 1e3 | 1e5 | 1e7 | Fejer N = 1e3 | 1e5 | 1e7 | rms of the sharp train at x = 0.005, N = 1e3, 1e5, 1e7 |
|---|---|---|---|---|---|---|---|
| 100 | 0.2715 [0.3] | 0.3521 [0.3] | 0.4150 [0.3] | 0.0063 [0.1] | 0.0278 [0.2] | 0.0469 [0.25] | 4.4, 11.4, 42.8 |
| 1000 | 0.1860 [0.3] | 0.3345 [0.3] | 0.4053 [0.3] | 0.0044 [0.08] | 0.0273 [0.2] | 0.0488 [0.25] | 4.5, 11.3, 42.2 |
| 10000 | 0.1309 [0.2] | 0.2861 [0.3] | 0.3608 [0.3] | 0.0020 [0.02] | 0.0234 [0.15] | 0.0430 [0.2] | 4.2, 11.4, 34.9 |
| 100000 | 0.0840 [0.2] | 0.2476 [0.25] | 0.3452 [0.25] | 0 | 0.0103 [0.1] | 0.0386 [0.15] | 4.4, 11.2, 41.2 |
| 1e+06 | 0.0474 [0.2] | 0.1694 [0.25] | 0.3013 [0.3] | 0 | 0.0107 [0.1] | 0.0254 [0.15] | 4.2, 10.8, 36.4 |

DH away from its zeros (c1_dh_far.py; 256 sample heights x 15 abscissae in [100, 216] and in [1001, 1113]; zero table
to 2000): the exact Re F'/F (Arb) is negative at 20 and 48 of the 3840 points, all inside the half-disks of the
off-line zeros. The truncated train is negative at 620, 732, 878 points (N = 1e3, 1e5, 1e7) in the first window and
380, 580, 903 in the second, of which 870 and 893 lie outside every half-disk at N = 1e7; its sign agrees with the
exact sign at 83%, 80%, 77% of the points (first window) as N grows. The Fejer train is negative at 3, 13, 30 points
of the first window, all outside the half-disks.

**Sign twist against zeta at the same (height, P)** (total-variation distance between the histograms of x*; for the
Fejer form this equals the failing fraction of the twist, zeta's being 0). Run A:

| height | log P/log t at P = 1e3, 1e5, 1e7, 1e9 | TV sharp | TV Fejer |
|---|---|---|---|
| 100 | 1.5, 2.5, 3.5, 4.5 | 0.135, 0.197, 0.229, 0.270 | 0.054, 0.169, 0.252, 0.303 |
| 1e4 | 0.75, 1.25, 1.75, 2.25 | 0.047, 0.112, 0.184, 0.212 | 0.003, 0.053, 0.121, 0.176 |
| 1e6 | 0.5, 0.83, 1.17, 1.5 | 0.009, 0.050, 0.104, 0.137 | 0.000, 0.002, 0.031, 0.076 |
| 1e8 | 0.37, 0.62, 0.88, 1.12 | 0.004, 0.013, 0.042, 0.095 | 0.000, 0.000, 0.004, 0.021 |
| 1e10 | 0.30, 0.50, 0.70, 0.90 | 0.002, 0.004, 0.015, 0.031 | 0.000, 0.000, 0.000, 0.004 |

First P at which the sign twist has any negative Fejer value (run C, 1.1e6 points per height): 1e4 at heights 1e6 and
1e7, 1e6 at heights 1e8 and 1e9, none up to 1e6 at height 1e10 (run B, 131 072 points: 1e7 at height 1e10, fraction
3e-4). In every case log P/log t is between 0.57 and 0.75.

**Zero-side model of an off-line quadruple** (c1_planted.py: the four kernel terms of section 2.1 added to zeta's
measured D_Fejer; the pair is placed at distance d beyond the last sample of the 512-point window). Largest d at which
some sample is still negative; in brackets P^((delta - x_min)/2)/sqrt(L median D_Fejer):

| height | delta = 0.3085: P = 1e3 | 1e5 | 1e7 | 1e9 | delta = 0.1: P = 1e9 | delta = 0.03: P = 1e9 |
|---|---|---|---|---|---|---|
| 100 | 0.89 (0.97) | 2.8 (2.7) | 5.0 (5.0) | 14.1 (10.6) | 1.0 (1.2) | not seen |
| 1e4 | not seen | 0.56 (0.88) | 2.8 (1.8) | 6.3 (4.4) | 0.56 (0.51) | not seen |
| 1e6 | not seen | 0.50 (0.69) | 1.1 (1.1) | 2.8 (2.2) | 0.25 (0.25) | not seen |
| 1e8 | not seen | 0.13 (0.59) | 0.71 (0.99) | 1.8 (1.7) | not seen | not seen |
| 1e10 | not seen | not seen | 0.71 (0.88) | 1.0 (1.5) | not seen | not seen |

("not seen": no negative sample even at d = 0.05, the smallest distance tried.)

### 2.3 Reading

- Zeta, Fejer form: no nonpositive value at any of 1.0e7 + 1.2e6 + 3.7e4 points, any abscissa, any P up to 1e9
  (minimum 0.030). By section 2.1 this is implied by the verified height. L(chi_-4): the same.
- Zeta, sharp form: negative at 44% of the heights near 100 with P = 1e9, and the fraction grows with P at every
  height. The largest negative abscissa falls from 0.2 (P = 1e3) to 0.1 (P = 1e7, 1e9) at height 100, i.e.
  x* log P between 1.4 and 2.1; at height 1e10 it is 0.02 at P = 1e3 and 0.06 to 0.08 for P >= 1e5 (the train is
  smaller than the drift until log P is comparable to log t). "x* -> 0 like c/log P uniformly in t" holds only in the
  sense sup x* <= about 2/log P, the rate being that of the cutoff (consequence 2), and zeta does not pass at a
  fixed x.
- Sign twist, random unimodular twist, Liouville: under either cutoff their statistic coincides in distribution with
  zeta's while log P/log t is below about 0.55 (sharp form: TV at most 0.01; Fejer form: no negative value in 1.1e6
  points per height) and separates as log P/log t grows (TV 0.30 at ratio 4.5). The twists therefore fail at height t only with
  P of order t^0.6 or more. The Riemann-Siegel evaluation that verifies zeros at height t uses t^0.5 terms. The twists
  are not caught at a size smaller than the one that resolves zeros at that height; they fail because G is not their
  gamma drift (no functional equation), which the test can see only once the train feels the zeros of the function it
  is compared with.
- E_a and T-NR with q = 3: fail at every height once P^(delta - x) is large (x* up to 0.15 and 0.3 against delta =
  0.25 and 0.404), in agreement with the lead law: their off-line zeros lie within one mean spacing of every t. The
  cause is the size of the coefficients at the abscissa x < delta (Lambda(n) n^(a_E), alpha^m with abs alpha = 1.56), the
  non-tempered local factor of the map.
- T-NR with q = 1000003 has off-line zeros with delta = 0.0321 at spacing 0.455 along the whole line. Under the Fejer
  cutoff it passes at every height and every P up to 1e9 (0 negative values): P^(delta - x) <= 1.75 is far below
  L d^2 times the drift. Under the sharp cutoff it has fewer negative values than zeta (0.30 against 0.44 at height
  100; largest negative x 0.06 against 0.1) because its drift is larger by log q. A control with off-line zeros
  passes: the survival condition fails on this row alone.
- DH: the train of F'/F has unbounded coefficients (zeros to the right of 1) and does not converge to F'/F anywhere
  in 0 < x <= 1/2: its sign disagrees with the exact one at a growing share of the points and it is negative outside
  the half-disks. This is the "separation to the right of 1" of the known pattern, read at x <= 1/2.
- A quadruple with delta = 0.3085 is seen by the Fejer statistic from at most 14 units of height with all primes to
  1e9 (1 to 3 units above height 1e6); with delta = 0.03 it is not seen at distance 0.05. The measured leads follow
  P^((delta - x)/2)/sqrt(L D) within a factor 2.

Classification: CLOSED. Rows G8/P8 (positivity region = zero-free region; a control fails only inside the half-disks
of its off-line zeros) in explicit-formula form, plus row G10 (no convergence of the train in the strip without the
functional equation). What is new against the map: the Polya positivity of the Fejer kernel and the lead law
d ~ P^((delta - x)/2); the measured c = 1.7 of the sharp form; the measured coincidence of zeta and the twists at
log P << log t.

## 3. Combination (2): shift difference against the logarithmic derivative

Nodes: zero-packet-identity, shift-ratio-threshold (atlas section 2; closed by G8, P8, G20, P19),
zv-bridge-understates-log-derivative.

Statistic. B_a(w) = (abs X(w+a)^2 - abs X(w-a)^2)/(abs X(w+a)^2 + abs X(w-a)^2) = tanh(log abs X(w+a) - log abs X(w-a));
rho_a(w) = [B_a(w)/(2a)]/Re(F'/F)(w). In the simple-zero model B_a/(2a) = x/(x^2 + a^2) and Re F'/F = 1/x (the node's
numbers 17.243 and 0.772 at x = 0.05 are x/(x^2 + a^2) with the other zeros added). Grid: Re w in {0.01, 0.02, 0.03,
0.05, 0.07, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5}, a in {0.02, 0.1, 0.25}, Arb at 96 bits (128 for HEAT);
the largest ball radius of any log-modulus difference or logarithmic derivative is listed.

What is proved before computing (CLASSICAL, Hadamard + the packet identity of the node). For X even of order one,
abs X(w+a)^2/abs X(w-a)^2 is the product over the zeros, grouped in packets, of factors that are > 1 for an on-line pair
(Re w > 0) and < 1 for an off-line quadruple only inside the disk of radius sqrt(delta^2 - a^2) about i gamma. A
product is < 1 only if some factor is < 1. Hence B_a(w) < 0 implies that w lies in one of the disks: negativity
outside the disks cannot occur for any control with a functional equation, whatever its coefficients. The survival
condition of the task cannot be met by DH, HEAT, E_a or T-NR. The same argument gives Re F'/F < 0 only inside the
half-disks of radius delta (row G8).

| object | heights (Im w) | grid points per a | max ball radius | Re F'/F <= 0 (outside half-disks) | B_a <= 0 at a = 0.02 (outside disks; inside, of points in disks) | a = 0.1 | a = 0.25 | min rho_a (a = 0.02, 0.1, 0.25) | min B_a/(2a) |
|---|---|---|---|---|---|---|---|---|---|
| ZETA | 100..2100 | 1 400 000 | 6e-23 | 0 | 0 | 0 | 0 | 0.200, 0.00998, 0.00167 | 0.0095, 0.0095, 0.0094 |
| ZETA | 1000..3000 | 1 400 000 | 8e-23 | 0 | 0 | 0 | 0 | 0.200, 0.0101, 0.00177 | 0.0238, 0.0237, 0.0232 |
| ZETA | 1e4..1.2e4 | 1 400 000 | 4e-22 | 0 | 0 | 0 | 0 | 0.200, 0.0102, 0.00188 | 0.0404, 0.0402, 0.0391 |
| ZETA | 1e5..1.02e5 | 1 400 000 | 2e-21 | 0 | 0 | 0 | 0 | 0.200, 0.0103, 0.00202 | 0.0648, 0.0642, 0.0614 |
| ZETA | 1e6..1e6+400 | 280 000 | 1e-20 | 0 | 0 | 0 | 0 | 0.200, 0.0106, 0.00227 | 0.0941, 0.0930, 0.0877 |
| ZETA | 1e7..1e7+400 | 280 000 | 1e-19 | 0 | 0 | 0 | 0 | 0.200, 0.0110, 0.00258 | 0.145, 0.141, 0.127 |
| ZETA | 1e8..1e8+400 | 280 000 | 1e-18 | 0 | 0 | 0 | 0 | 0.200, 0.0112, 0.00281 | 0.167, 0.163, 0.147 |
| LCHI4 | 100..500 | 280 000 | 3e-23 | 0 | 0 | 0 | 0 | 0.200, 0.0101, 0.00173 | 0.0230, 0.0229, 0.0224 |
| LCHI4 | 1000..1400 | 280 000 | 3e-23 | 0 | 0 | 0 | 0 | 0.200, 0.0102, 0.00186 | 0.0410, 0.0407, 0.0395 |
| LCHI5 | 100..200 | 70 000 | 1e-22 | 0 | 0 | 0 | 0 | 0.200, 0.0100, 0.00174 | 0.0224, 0.0223, 0.0218 |
| WT (translate) | 0.5..1000.5 | 280 000 | 5e-20 | 0 | 0 | 0 | 0 | 0.200, 0.00999, 0.00168 | 0.00047 (all a) |
| DH | 0.5..2000.5 | 560 000 | 1e-20 | 3949 (0) | 3906 (0; 3906 of 4588) | 3110 (0; 3110 of 3706) | 826 (0; 826 of 1076) | -86, -735, -2380 | -24.9, -5.0, -2.0 |
| E_a, a_E = 1/4 | 0.5..400.5 | 112 000 | 2e-20 | 12766 (0) | 12718 (0; 12718 of 14613) | 11275 (0; 11275 of 13048) | 0 (no disk) | -33.5, -878, -4760 | -15.8, -5.0, +0.00093 |
| E_a, a_E = 1/8 | 0.5..400.5 | 112 000 | 7e-24 | 5108 (0) | 5016 (0; 5016 of 5220) | 2230 (0; 2230 of 2391) | 0 (no disk) | -417, -4290, -5100 | -24.1, -4.86, +0.00093 |
| T-NR q = 3 | 0.5..200.5 | 56 000 | 2e-21 | 2589 (0) | 2577 (0; 2577 of 5537) | 2452 (0; 2452 of 5241) | 1900 (0; 1900 of 3773) | -7.8, -202, -1160 | -15.0, -4.99, -2.0 |
| HEAT-0.5 | 105..119 | 3 920 | 2e-32 | 66 (0) | 66 (0; 66 of 66) | 61 (0; 61 of 64) | 0 (no disk) | +0.183, -1.13, -8.11 | -17.8, -4.94, +0.0085 |
| zeta + pair (0.3, 1e6 + 0.3) | 999990..1000010 | 14 000 | 1e-2 (at the planted zero) | 29 (0) | 29 (0; 29 of 239) | 47 (0; 47 of 224) | 32 (0; 32 of 101) | +0.188, -20.1, -108 | -13.4, -5.0, -2.0 |
| zeta + pair (0.05, 1e8 + 0.2) | 1e8 - 2..1e8 + 2 | 14 000 | 1e-4 (at the planted zero) | 63 (0) | 56 (0; 56 of 61) | 0 (no disk) | 0 (no disk) | -3.4, -15.1, -4.1 | -25.0, +0.349, +0.264 |
| LIOU (no functional equation) | 5..205 | 56 000 | 3e-23 | 6845 | 6810 | 5905 | 4324 | -22, -217, -402 | -25.0, -5.0, -2.0 |

Zeta total: 6 440 000 grid points per value of a, heights to 1e8 + 400; the smallest abs(log abs X(w+a) - log abs X(w-a))
is 3.8e-4, against ball radii below 2e-18: every sign in the zeta, L-function and WT rows is CERTIFIED. The zeta
windows were computed on the Mac (100 000 heights each up to 1e5, 20 000 each at 1e6, 1e7, 1e8), the other rows on the
server. Not every point of a disk is negative (the on-line zeros push the product up), which is why "inside" is
smaller than "points in disks".

Reading.

- Zeta and the L-functions: B_a > 0 and Re F'/F > 0 at every grid point; min rho_a equals the simple-zero value
  x^2/(x^2 + a^2) at the smallest grid x (0.2, 0.01, 0.0016): the ratio has no positive lower bound as Re w -> 0, and
  no upper structure beyond the model.
- Controls with a functional equation: every negative value of B_a lies inside a disk of the packet identity (column
  "outside" = 0 in every row), and every negative value of Re F'/F inside a half-disk of radius delta. With
  a >= delta the control passes (E_a at a = 0.25; the pair at 1e8 with delta = 0.05 at a = 0.1 and 0.25): the
  threshold of node shift-ratio-threshold.
- rho_a < 0 occurs in the annulus between the two radii (bridge positive, logarithmic derivative negative): the
  "understating" of node zv-bridge-understates-log-derivative. It adds no region outside the half-disks.
- LIOU (no functional equation): negative at 8% to 12% of the grid, none of it tied to a disk, because its singularities on the critical
  line are poles. This is the sign of the order of vanishing on the line, a statement about the function, present at the
  first grid point.
- WT is a translate of xi and passes.

Classification: CLOSED (restatement, rows G8, P8, G20). Zeta passes because its zeros below the heights tested are on
the line; each control fails exactly on the disks of its own off-line zeros.

## 4. Combination (3): Pick Gram of R_a with nodes below H0; lead at first detection

Nodes: blaschke-ghost-negative-square, ghost-zero-witness, l2-detection-modulus (map rows G6, Q6).

Statistic. Nested nodes w_1, w_2, ... with abs(Im w) <= H0; Pick matrix [(1 - R_i conj R_j)/(w_i + conj w_j)], R_a(w) =
X(w-a)/X(w+a), a = 0.1; LDL pivots by the displacement recursion in Arb ball arithmetic. Detection = a pivot ball
strictly negative. lead = gamma_off - H0 for the smallest H0 with a detection at 2000 bits. Survival would need the
lead of the control to exceed the lead of a quadruple planted at the same (delta, gamma) on zeta.

Meshes: "box" = Halton(2,3) points of [0.05, 2] x [-H0, H0]; "geo" = lattice x_j = 0.05 * 1.6^j (j < 16, up to 57.6)
times 256 heights in [-H0, H0], 4096 nodes.

Size reached, and a correction to the planned size. At 2000 bits the ball recursion decides 125 to 250 nodes (the
pivots fall by about 6 to 16 bits per node and the radii grow with them); the remaining nodes of a 4096-node mesh cannot be
decided at that precision. A midpoint version (radii discarded, stop at the rounding floor 2^-1900) was run on all
4096-node meshes; it produced negative pivots for zeta itself and for L(chi_5) (geo mesh: zeta H0 = 60 at n = 321,
2^-1833; H0 = 40, ten negative pivots from n = 285; L(chi_5) H0 = 10 at n = 256, 2^-894, and H0 = 60 at n = 383,
2^-1348). Ball runs at 5000 to 6000 bits certify index 0 where they were made (zeta geo H0 = 40: 369 pivots positive;
L(chi_5) geo H0 = 10: 256 positive, H0 = 60: 404 positive). The midpoint numbers are therefore not used; every entry
below is CERTIFIED unless marked.

Box mesh, ghost of DH at 85.699 (delta = 0.3085) against the same quadruple planted on zeta and on L(chi_5). Entry:
node count n at the first negative pivot, log2 of that pivot relative to the diagonal; "u(n)" = no negative pivot among
the n pivots decided at 2000 bits.

| H0 | DH | planted on zeta | planted on L(chi_5) | zeta | L(chi_5) |
|---|---|---|---|---|---|
| 60 | 135, -204.6 | 91, -353.0 | 150, -468.3 | u(209) | u(251) |
| 40 | 144, -449.8 | 97, -513.5 | 160, -744.3 | u(193) | u(224) |
| 20 | 148, -992.2 | 100, -734.5 | 165, -985.8 | u(174) | u(196) |
| 10 | 149, -1163.9 | 101, -898.2 | 166, -1478.0 | u(159) | u(175) |
| 5 | 150, -1530.0 | 101, -1078.5 | u(160) | u(147) | u(161) |
| 2.5 | u(149); at 6000 bits: 150, -1772.6 | 101, -1239.1 | u(149) | u(136) | u(149) |
| 1.25 | u(142) | 101, -1373.2 | u(141) | u(130) | u(141) |
| 0.6 | u(138); at 6000 bits: 150, -2127.2 | 101, -1478.6 | u(138) | u(127) | u(138) |
| 0.3 | u(136) | 101, -1542.6 | u(135) | u(125) | u(136) |
| 0.15 | u(136) | 101, -1579.7 | u(135) | u(125) | u(135) |

Lead at 2000 bits: DH 85.70 - 5 = 80.7; planted on zeta 85.70 - 0.15 = 85.55 (smallest box run); planted on L(chi_5)
85.70 - 10 = 75.7. At 6000 bits zeta has index 0 on 421, 364, 340 nodes for H0 = 10, 2.5, 0.6. Geo mesh (5000 bits):
DH H0 = 10: n = 151, 2^-1081.8; planted on zeta H0 = 20: n = 101, 2^-536.0.

Other controls (box mesh, 2000 bits, CERTIFIED):

| control (ghost) | H0 | control: n, log2 pivot | planted on zeta at the same place: n, log2 pivot |
|---|---|---|---|
| E_a, a_E = 1/4 (14.1347, delta 0.25) | 10 | 7, -32.4 | 7, -33.8 |
| | 2.5 | 8, -51.0 | 8, -52.0 |
| | 0.6 | 8, -68.3 | 8, -69.2 |
| | 0.15 | 8, -74.6 | 8, -75.6 |
| T-NR q = 3 (2.8596, delta 0.4038) | 2 | 4, -11.6 | 3, -10.4 |
| | 0.5 | 4, -17.3 | 4, -16.6 |
| | 0.12 | 4, -18.4 | 4, -17.8 |

HEAT-0.5 (ghost at 111.694, delta 0.2430): the planted pair on zeta, box H0 = 40: n = 138, 2^-704.4 (midpoint mode,
equal to the s3 value n = 138). The HEAT values at 2000 bits were not completed (unit stopped after 34 minutes of this run under
a server load above 120; one value needs a 950-node quadrature of xi at 2064 bits). The s3 run of the same box gives
HEAT n = 121, 2^-711.

Reading.

- The lead is not the binding quantity. From a box of half-height 0.15 next to the real axis the planted pair at
  85.70 is certified at 2000 bits; with 6000 bits DH is certified from half-height 0.6. Detection from far below is
  analytic continuation paid in bits: the first negative pivot falls from 2^-205 (H0 = 60) to 2^-2127 (H0 = 0.6) for
  DH and from 2^-353 to 2^-1580 for the planted pair.
- The node count at detection does not depend on H0 (DH 149 +- 1 for H0 <= 20, planted 101, planted on L(chi_5) 166):
  the counting law of s3 (n* = number of zeros of the function up to about 1.5 to 1.8 times the ghost height). DH has
  149 zeros below 128 = 1.49 x 85.70.
- Control against planted pair. Against the pair planted on zeta the control needs 44 to 49 more nodes at every H0,
  and 260 to 650 more bits for H0 <= 20 (at H0 = 40 and 60 it needs 64 and 148 fewer bits). Against the pair planted
  on L(chi_5), which has the conductor of DH, the control needs 15 to 17 fewer nodes and 264 to 314 fewer bits at
  H0 = 60, 40, 10, and the same precision at H0 = 20 (992 against 986 bits). The order zeta + quadruple < DH <
  L(chi_5) + quadruple is the order of the zero counts below about 1.5 gamma (s3 counting law), not a property of the
  origin of the ghost. E_a and T-NR equal their planted pairs to within one node and 1.5 bits.
- Survival condition (control lead > planted lead on zeta): not met, 80.7 against at least 85.55.

Classification: CLOSED. Verified height in another form: detection needs as many nodes as the function has zeros up
to about 1.5 gamma, and bits proportional to the distance.

## 5. Combination (4): two-line data and the nine Blaschke configurations

Nodes: fe-plus-reality-rigidity, phase-retrieval-zeta (rows L2, P6: exact-uniqueness devices, closed),
lac-sens-displacement-bound.

Setting. For a quadruple {1/2 +- delta +- i gamma} each conjugate pair can be in the state (left, right) [the
functional-equation state], (right, right) or (left, left); the 9 combinations have the same modulus on Re s = 1/2
(Blaschke factors of the half-plane are unimodular on the line). On Re s = sigma_2 = 1.25, u = sigma_2 - 1/2 = 0.75, the
state (right, right) of the upper pair multiplies the modulus by abs(s - rho)/abs(s - rho') with
rho = 1/2 + delta + i gamma, rho' = 1/2 - delta + i gamma:

    log factor(t) = (1/2) log(((u - delta)^2 + (t - gamma)^2)/((u + delta)^2 + (t - gamma)^2)),   peak -log((u + delta)/(u - delta)) at t = gamma.

So the second-line modulus separates the three states of the upper pair at first order in delta, with no decay in
gamma: the peak is 2 delta/u + O(delta^3). (PROVED, one line.) A flip of the conjugate pair alone has u replaced by
(u^2 + 4 gamma^2)/u in the window near +gamma (decay 1/gamma^2, the analogue of the 2.914 delta^2/gamma^3 of the node, which
is the second-order sensitivity of far real nodes); it is seen at first order in the mirror window, where the data are
the conjugates.

Finite statement tested. Second-line data = log abs of the Euler product over prime powers <= P (zeta, L(chi_-4)), or
the Dirichlet series to N terms (DH). eps(P, gamma) = sup over the sampled window of the error against the exact
function (Arb). A tester with tolerance 2 eps accepts a configuration when sup abs(model - data) <= 2 eps.
delta_min = smallest displacement at which every wrong state of the upper pair is rejected: between u tanh(eps/2) and
u tanh(3 eps/2), i.e. 0.375 eps to 1.125 eps. Controls: DH with its own quadruples; zeta with a planted swap (the
planted factor is applied exactly; the data error is the measured Euler-product error).

Second-line error of the truncated Euler product of zeta (512 sample heights in a window of about 125 above H;
float64 GPU sums against Arb; "tail" = with the term E_1((s - 1) log P) added):

| H | P = 1e3 | 1e5 | 1e7 | 1e9 | 1e9 with tail | delta_min interval at P = 1e9 | configurations compatible at delta = 1e-8, 1e-7, 1e-2 (planted at gamma) |
|---|---|---|---|---|---|---|---|
| 1e2 | 2.3e-3 | 6.7e-5 | 1.1e-5 | 2.6e-6 | 2.4e-8 | [8.8e-9, 2.7e-8] | 9, 3, 1 (gamma = 161.0) |
| 1e3 | 2.8e-3 | 5.7e-5 | 1.8e-6 | 2.8e-7 | 2.8e-8 | [1.0e-8, 3.2e-8] | 9, 3, 3 (gamma = 1063.8) |
| 1e4 | 3.1e-3 | 4.7e-5 | 1.6e-6 | 6.2e-8 | 3.6e-8 | [1.4e-8, 4.1e-8] | 9, 3, 3 |
| 1e5 | 3.4e-3 | 7.6e-5 | 1.9e-6 | 4.0e-8 | 3.8e-8 | [1.4e-8, 4.3e-8] | 9, 3, 3 |
| 1e6 | 3.4e-3 | 7.1e-5 | 1.8e-6 | 4.9e-8 | 4.9e-8 | [1.8e-8, 5.5e-8] | 9, 3, 3 |
| 1e7 | 3.6e-3 | 8.2e-5 | 2.6e-6 | 4.5e-8 | 4.5e-8 | [1.7e-8, 5.1e-8] | 9, 3, 3 |
| 1e8 | 4.1e-3 | 7.9e-5 | 2.3e-6 | 5.5e-8 | 5.5e-8 | [2.1e-8, 6.2e-8] | 9, 3, 3 |
| 1e9 | 2.9e-3 | 1.1e-4 | 2.8e-6 | 1.0e-7 | 1.0e-7 | [3.8e-8, 1.1e-7] | 9, 3, 3 |
| 1e10 | 3.7e-3 | 8.8e-5 | 2.5e-6 | 8.8e-7 | 8.8e-7 | [3.3e-7, 9.9e-7] | 9, 9, 3 |

(The value at H = 1e10, P = 1e9 is the float64 phase error of the sum, not the truncation: section 7.) The 3
configurations left are the true one and the two flips of the conjugate pair; at gamma = 161 these two are rejected as
well for delta >= 0.01 because the conjugate pair is only 322 away. L(chi_-4) at H = 1e2, 1e3: 3.0e-8, 3.7e-8 at
P = 1e9. Absolute tail bound 1.255 (sigma/(sigma-1)) P^(1-sigma)/log P: 1.7e-3 at P = 1e9.

DH, Dirichlet series to N terms on Re s = 1.25 against Arb (256 sample heights in [100, 216]): eps = 6.7e-7, 3.6e-8,
1.9e-9 for N = 1e5, 1e6, 1e7 (the same within a factor 3 near heights 1e4, 1e5, 1e6). Its quadruples in the window:

| delta | gamma | peak of the log factor, log((u + delta)/(u - delta)) | configurations compatible of 9 |
|---|---|---|---|
| 0.1508 | 114.163 | 0.408 | 3 |
| 0.0744 | 166.479 | 0.199 | 3 |
| 0.2243 | 176.702 | 0.617 | 3 |

Reading.

- The Euler product on Re s = 1.25 is far more accurate than its absolute tail bound (the tail over primes is an
  oscillating sum): sup error 4e-8 to 1e-7 for P = 1e9 at heights 1e4 to 1e9 against the bound 1.7e-3; the error is of the size (sum over p > P of p^(-2.5))^(1/2), about 2e-8.
- A planted swap is rejected for delta above about eps and not below: the 6 configurations that change the upper
  pair are rejected at the delta shown, the 2 that flip only the conjugate pair are not rejected from the window near
  +gamma (they are rejected in the mirror window).
- DH behaves in the same way with its own series: for each of its quadruples in the window, 3 of 9 configurations
  remain (the true one and the two conjugate-only flips), with eps = 5.6e-7 from 1e5 terms.
- What the test decides: given that a quadruple exists and that the modulus on the critical line is known exactly, it
  names the configuration. For zeta below the verified height there is no quadruple and the test is empty. Exact
  knowledge of the modulus on Re s = 1/2 already contains the position of every zero on that line. If the first-line
  data are dropped, the second-line modulus to accuracy eps does not locate zeros: s3-truncated-euler-strip row 4
  measured that moving neighbouring on-line zeros compensates a planted quartet to 4.5e-7 at height 1e12 on
  sigma = 2 (not repeated here).

Classification: CLOSED. It identifies the function (rows L2, P6) and treats zeta with a planted swap and DH alike; the
separation it uses lives on a line to the right of 1.

## 6. Why no row is a survivor

| # | zeta passes at every size | every control fails early or for a zero-independent reason | uses all primes | missing |
|---|---|---|---|---|
| 1 Fejer | yes (implied by the verified height, section 2.1) | E_a, T-NR, DH: by the size of their coefficients or their local zeros; sign and unimodular twists: only once log P is comparable to log t; a pair at distance d: only for P above (d^2 L)^(1/delta) | yes | a control with a functional equation, tempered Euler product and off-line zeros far from t fails only at that P; HEAT has no train |
| 1 sharp | no: zeta is negative at x <= 1.7/log P | as above | yes | zeta itself does not pass at fixed x; the rate c/log P is a property of the cutoff |
| 2 | yes | fails only inside the disks (proved for every even order-one function) | no primes | negativity outside the disks is impossible |
| 3 | yes (index 0 on all certified sections) | control detected with more bits than the planted pair on zeta | no primes | lead of the control below the lead of the planted pair |
| 4 | empty for zeta | DH and planted swap treated alike | second line only | reads the configuration, not the existence, of a quadruple |

## 7. Not done, weakest steps

- Combination (1) asked for 1e7 values of t at P up to 1e9. Reached: 3.7e4 points at P = 1e9, 1.2e6 at P = 1e7,
  1.0e7 at P = 1e6. The full product (5e14 phase evaluations) needs about 14 days of the shared GPU at the measured
  rate of 4e8 per second.
- Combination (2): zeta windows of 100 000 heights up to height 1e5 and 20 000 at 1e6, 1e7, 1e8 (planned: 100 000
  each). They were run on the Mac: on the server the same job received about one core in total at a load average
  above 120 on 40 cores, and was stopped. L(chi_-4) at heights 100 and 1000 only (Hurwitz evaluation at 1e4 and above
  was too slow).
- Combination (3): 4096-node meshes are not decidable at 2000 bits; HEAT at 2000 bits not completed.
- Weakest steps. (i) The lemma of section 2.1 is proved for the kernel; the statement "D_Fejer > 0 for zeta" also
  needs the O(1/(t L)) archimedean remainder to be smaller than the zero sum, which is measured (minimum of D_Fejer
  over all samples in section 2.2) and not bounded here for x -> 0. (ii) The lead law d ~ P^((delta-x)/2) is checked on
  the zero-side model of a planted quadruple and on E_a, T-NR; no function with a tempered Euler product and off-line
  zeros exists to test it directly. (iii) All prime sums at P >= 1e7 are float64 (phase error up to 1e-4 at t = 1e10,
  measured against long double); the sign counts are a screen, and only the Arb values of sections 3 to 5 are
  certified.

## 8. Files

Code: lib.py (objects, Schur recursion; from s3-lacunary-pick-ghost-index, plus LIOU, WT), echo.py, dh_train.py,
c1_an.py, c1_planted.py, c1_dh_far.py, mk_tables.py, recheck.py, recheck2.py, val_echo.py, val_fejer.py (combination 1);
c2_shift.py, c2_an.py (2); c3_lead.py, c3_tab.py (3); c4_an.py (4); run_*.sh (server units).
Data: out/ (server results: echoA_1e9, echoB_1e7, echoC2_1e6 with summaries and raw samples; dh_1e7*; c2_*.npz and
c2_summary.json; c3.jsonl (midpoint mode, not used), c3_ball.jsonl, c3_ball_2000.jsonl, c3_ball_geo.jsonl; c4.json;
planted_A.json; recheckA.json, recheckB.json; tablesA.md, tablesB.md, tablesC.md), out_local/ (Mac validation runs and the
zeta windows of combination 2: c2_ZETA_*.npz, c2_summary.json), dh_zeros.json (copied from s3).
Server lane directory: ~/rh-push/s4-bridge-shift-ratio-prime-echo/ (units rh-s4e-*, all stopped or finished).
Resources: GPU 1, pool limit 20 GB per job, at most two GPU jobs at a time; CPU units with 1 to 8 workers, each below
4 GB resident. Between 04:10 and 05:06 UTC the CPU quotas of this lane's units added up to more than the 8 cores of
the assignment (two 8-worker units and the GPU feeders); the measured use was 1 to 3 cores because of the server load.
Units stopped by hand before completion: rh-s4e-c2 (at L(chi_-4), height 1e4), rh-s4e-c2b, rh-s4e-c2c (zeta windows,
moved to the Mac), rh-s4e-c3 (during HEAT), rh-s4e-c3b (8000-bit pass, superseded by the 6000-bit runs), rh-s4e-echo
(after run A; its run C was replaced by the parallel unit rh-s4e-echoC).

