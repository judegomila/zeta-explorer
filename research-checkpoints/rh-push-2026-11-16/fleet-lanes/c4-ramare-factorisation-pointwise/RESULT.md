# c4-ramare-factorisation-pointwise: does the Ramaré factorisation (Matomäki–Radziwiłł) reach beyond mean values?

Status: unrefereed. Labels: PROVED (derivation written here), CLASSICAL, RECALLED (literature statement quoted from memory,
source not opened in this lane), ARGUED, MEASURED, OPEN. No statement about zeros of zeta is claimed.

Verdict: **precise-obstruction**. All three tests are negative. The factorisation is a mean-value device on the line
Re s = 1 with a saving capped at a power of log; the three gaps are stated as exponents and as map rows in section 7.
Flags: R1 false, R2 false, R3 false, R4 false (section 6).

## 1. Plan

New against the map: no row covers the Matomäki–Radziwiłł method. Nearest rows: P27 (Alpoge–Furman chain, bandwidth one),
P29/Q9/Q18/Z17 (MV-CAP), P10/T2 (one-sided bound = target), round-3 lesson 5 (tail and rotation-invariant properties do
not reach chi = 1). Engine node: `af-rank-trace-inertia`.

Tests, in the order run:
1. Bandwidth beyond 1 in the Gabor/inertia chain: size of the averaged Hardy–Littlewood saving needed against the proved one.
2. Whether the factorisation gives a bound at every t in a window or only a measure bound for an exceptional set.
3. Whether a zero at beta < 1 is visible to log-averaged or pretentious statements.

Tool used in tests 1 and 2 (PROVED below, checked numerically): a single-scale explicit formula.

**Lemma D (single-scale explicit formula; CLASSICAL contour shift, written out).** Let w be smooth with support in
[1/2, 2], W(z) = int w(y) y^(z-1) dy (entire, O_k((1+|Im z|)^-k) on vertical strips). For X >= 2 and real t,

    P_X(t) := sum_n Lambda(n) w(n/X) n^(-1/2-it)
            = - sum_rho X^(rho-1/2-it) W(rho-1/2-it) + X^(1/2-it) W(1/2-it) + O(log(2+|t|)/X).

Proof. sum_n Lambda(n) n^(-s) w(n/X) = (1/2 pi i) int_(2) (-zeta'/zeta)(s+z) X^z W(z) dz (Mellin inversion). Move the
line to Re(s+z) = -1/2: residues -X^(rho-s) W(rho-s) at zeros, X^(1-s) W(1-s) at the pole; on the new line
|X^z| = 1/X and zeta'/zeta << log. W has no pole at 0, so there is no zeta'/zeta(s) term. ∎

Check (MEASURED, `detector.py`, `detector.json`): for zeta, X = 500 and 2000, t = 40, 60, 77.1448, 90, prime side
against the zero side with 120 zeros: agreement 2.7e-7 to 8.2e-7 (quadrature error of W).

Consequences used below.
- (D1) A zero rho = 1/2 + eta + i gamma contributes X^eta W(eta + i(gamma - t)) on |t - gamma| << 1; the zeros on the
  line contribute at most C log(2+|t|) in total at each t.
- (D2) Mean value theorem (CLASSICAL, Montgomery–Vaughan): int_T^2T |P_X(t)|^2 dt = sum_n Lambda(n)^2 w(n/X)^2 n^-1
  (T + O(n)) = (T + O(X)) (log X) (int w^2 dy/y + o(1)). With (D1) this is the form factor: under RH the zero side is
  T log T times F(alpha), alpha = log X/log T, and (D2) is F(alpha) = alpha for alpha <= 1.
- (D3) (DERIVED, unrefereed, by-product, not counted.) Let R be the number of zeros in T < gamma < 2T with
  beta >= 1/2 + eta that are the only off-line zero within distance T^eps. For X <= T with X^eta >= C log T, (D1) gives
  int over |t-gamma| <= 1 of |P_X|^2 >> X^(2 eta), and (D2) gives R X^(2 eta) << T log T. At X = T: R << T^(1 - 2 eta) log T,
  the density-hypothesis exponent 2(1 - sigma), for isolated off-line zeros only. For clusters the sum
  sum_j X^(rho_j - s) W(rho_j - s) is an exponential polynomial in log X with up to c log T frequencies in a unit box and
  can be smaller than its largest term by a factor exp(-c K), K the cluster size (Turán's power-sum bound is the best
  general lower bound); this is the reason (D2) does not give a density theorem. It is a mean-value statement (MV-CAP).

## 2. Test 1: bandwidth 1 < alpha < 2 and averaged Hardy–Littlewood

Setting (row P27, `b-alpoge-furman` Proposition 2): bandwidth lambda > 1 beats 2/3 iff
int_1^lambda (lambda - alpha) F(alpha) d alpha < (lambda-1)(2 lambda-1)/3; a bound F <= C on [1, lambda] suffices.
Prime-side form (Goldston–Montgomery dictionary, CLASSICAL under RH; unconditionally via (D2) with X = T^alpha):
X = T^alpha, H = X/T = X^(1-1/alpha), V(X,H) = int_X^2X (psi(x+H) - psi(x) - H)^2 dx, and F(alpha) <= C corresponds to
V(X,H) <= C' H X log T.

Derivation of the needed saving. Expand the square:

    V = H sum Lambda(n)^2 + 2 sum_{0<h<=H} (H-h) sum_{X<n<=2X} Lambda(n) Lambda(n+h) - H^2 X + (lower order)
      = H X log X + 2 X sum_{h<=H} (H-h) S(h) - H^2 X + 2 sum_{h<=H} (H-h) E(h),

with S(h) the singular series and E(h) = sum_{X<n<=2X} Lambda(n) Lambda(n+h) - S(h) X. Using
sum_{h<=H} (H-h) S(h) = H^2/2 - (H/2) log H + O(H^(1/2+eps)) (CLASSICAL),

    V = H X (log(X/H) + O(1)) + 2 sum_{h<=H} (H-h) E(h),      log(X/H) = log T.

So F(alpha) <= C is the statement

    | (1/H) sum_{h<=H} (1 - h/H) E(h) |  <=  ((C-1)/2 + o(1)) X log T / H  =  c X^(1/alpha) log X.        (N1)

Trivial bound (sieve, E(h) << S(h) X): left side << X. **Needed saving over trivial: a factor H/log X = X^(1-1/alpha)/log X,
that is a power of X with exponent 1 - 1/alpha in (0, 1/2) for 1 < alpha < 2** (in T: T^(alpha-1)).
- With absolute values inside the h-sum, (N1) asks mean |E(h)| << X^(1/alpha): consistent with square-root error
  terms in Hardy–Littlewood exactly for alpha <= 2. This is why the range is (1, 2); beyond 2 sign cancellation in h is needed.
- Proved (RECALLED: Matomäki–Radziwiłł–Tao, correlations of von Mangoldt, long shift ranges; Mikawa before them):
  sum_{h<=H} |E(h)| <<_A H X (log X)^-A for H >= X^(8/33+eps). Saving exponent 0 (powers of log), and the range
  H >= X^(8/33) is alpha >= 33/25 = 1.32.
- **Gap as an exponent: needed 1 - 1/alpha, proved 0.** On the proved range of H (alpha >= 1.32) the needed exponent
  is at least 8/33 = 0.2424. For 1 < alpha < 1.32 no averaged asymptotic is proved at all; the needed exponent there
  is in (0, 0.2424). For H = (log X)^B (alpha = 1 + B log log X/log X) the need drops to a log-power saving on
  h <= (log X)^B, not proved for Lambda either (the short-shift results are for divisor functions), and the gain in
  bandwidth is O(log log T/log T): a proportion gain tending to 0.
- The saving in the proved result does not come from the factorisation. Lambda is supported on prime powers, which have
  no factor p in [P, Q] with cofactor: Ramaré's identity is not available for Lambda. The proved result uses
  Heath-Brown's identity, factorises the Type II part, and takes its log-power saving from Siegel–Walfisz/Vinogradov
  pointwise bounds on the line Re s = 1.
- Ceiling of the factorisation where it is available (f = lambda, mu) (ARGUED): the identity covers integers with a
  prime factor in [P, Q]; the rest have density prod_{P<=p<=Q}(1 - 1/p), of order log P/log Q >= c/log X, and are
  bounded by their number. So the saving of the method is at most one power of log X, whatever the mean-value input.
- Zero-side reading of (N1) (ARGUED from (D1)-(D2), isolated zeros only): at X = T^alpha one off-line zero at
  1/2 + eta, gamma ~ T, costs T^(2 alpha eta) against a budget C T log T. So F(alpha) <= C excludes isolated zeros with
  beta > 1/2 + 1/(2 alpha) + o(1) near height T: beta > 3/4 at alpha = 2, beta > 7/8 at alpha = 4/3. For lambda > 4/3 the input
  (N1) is therefore stronger than the 7/8 theorem on isolated zeros, and for every alpha > 1 it asks
  N(sigma, T) << T^(1 - alpha(2 sigma - 1)) on isolated zeros, beyond the density-hypothesis exponent (alpha = 1).
  The same count explains the `b-alpoge-furman` line "a half-plane gives variance short by x^(2 Theta - 1)".

Result of test 1: (N1) is a power-saving averaged Hardy–Littlewood statement; the method family gives log powers, for
Lambda only through non-factorisation inputs, and (N1) itself is of zero-free strength. The inertia chain is not
extended past bandwidth one. Even with (N1) the output is a proportion (P27 item 2).

## 3. Test 2: every t in a window, or an exceptional set?

Structure of the method (RECALLED, Matomäki–Radziwiłł 2016, sections 3-8), in the normalisation Re s = 1,
F(s) = sum_{X<n<=2X} f(n) n^-s:
1. Parseval: (1/X) int |(1/h) sum_{x<n<=x+h} f(n) - mean|^2 dx << int_{T_0}^{X/h} |F(1+it)|^2 dt + tail. The object is a
   mean square from the first step.
2. Ramaré: F = sum_v Q_v R_v + (unfactorised part), Q_v(s) = sum_{p in I_v} f(p) p^-s over short prime ranges.
3. Split of the t-range: T_j = set where the scale-j prime polynomial is below P_j^(-alpha_j) and the earlier ones are not;
   U = set where all are large.
4. On T_j: pointwise smallness of Q_v on that set, then the mean value theorem for R_v (moments to pass between scales).
5. On U: a large-values count for prime polynomials gives |U| << T^(1/2 - eps); then the Halász–Montgomery inequality
   sum_{t in U} |A(1+it)|^2 << (N + |U| T^(1/2)) (log) sum |a_n|^2/n^2; then the only pointwise input, Halász's bound
   sup_t |F(1+it)|, which for lambda rests on the Vinogradov–Korobov bound for sum_p p^(-1-it) (the classical zero-free region).

Answers.
- **The factorisation gives no bound at every t.** Its outputs are steps 4 and 5: mean values on T_j and on U. The one
  sup bound (Halász) is imported from the classical zero-free region on Re s = 1; it is not produced by the factorisation
  and has saving (log)^-c.
- **Exceptional-set exponent (PROVED in the form below; MR Lemma 8 RECALLED).** For P(s) = sum_{P<p<=2P} a_p p^-s,
  |a_p| <= 1, the number R of 1-separated t in [-T, T] with |P(1+it)| >= P^-a satisfies R << T^(2a + o(1)) P^(2a)
  for P >= exp((log T)^(1/2+eps))-type ranges. Derivation: take k = ceil(log T/log P); P^k has length P^k in [T, TP]
  and mean value sum |b_n|^2/n^2 <= k! (sum_p 1/p^2)^k <= k! (P log P)^-k; the discrete mean value theorem gives
  R P^(-2ak) << (T + P^k) (log T) k! (P log P)^-k, so R << T^(2a) P^(2a) exp(k log k - k log log P) log T.
  MR use a < 1/4: exponent 1/2 - eps, the size the Halász–Montgomery step can absorb.
- **What exponent would exclude a zero.** By Lemma D on the line Re s = 1 (divide by X^(1/2)): an isolated zero at
  beta + i gamma forces |sum Lambda(n) w(n/X) n^(-1-i gamma)| >= c X^(-(1-beta)) at every scale X with
  X^(beta-1/2) >= C log T. So gamma lies in the large-value set at threshold a = 1 - beta at every scale. The count
  available at that threshold is T^(2(1-beta)): the density-hypothesis exponent, and by (D3) it is reached only at the
  single scale X = T and only for isolated zeros. **Excluding the zero needs a count below 1: exponent <= 0 at
  a = 1 - sigma. Available: 2(1 - sigma). Gap: 2(1 - sigma), equal to 1 at sigma = 1/2 and 1/4 at sigma = 7/8.**
- The exponent 2a cannot be lowered inside the class "coefficients bounded by 1 on primes" (ARGUED): at P = T take
  R well-spaced points t_j and a_p = R^(-1/2) sum_j eps_j p^(i t_j); then |P(1 + i t_j)| is about R^(-1/2)/log P for each j, so
  R = P^(2a - o(1)) large values occur. A zero count below this needs a property of the coefficients beyond size and
  beyond membership in the multiplicative class.
- MR's threshold a < 1/4 corresponds to beta > 3/4: a zero with beta <= 3/4 does not put gamma in MR's exceptional set U.
  The theorem is unconditional and its proof is the same whether or not such a zero exists.

Result of test 2: measure bounds only. This is MV-CAP in the Re s = 1 normalisation.

Control measurement for Lemma D on a function with an off-line zero (MEASURED, `detector.json`): Davenport–Heilbronn,
log-derivative coefficients Lambda_F(n) by the divisor recursion to n = 7e4, zero 0.8085171825 + 85.6993484854i
(eta = 0.3085). |P_X(gamma)| = 3.21, 3.51, 5.21, 7.66 at X = 1e3, 3e3, 1e4, 3e4, against X^eta |W(eta)| = 2.60, 3.65, 5.29,
7.43; median of |P_X(t)| at distance > 2.5 from gamma: 1.66, 1.63, 2.16, 3.58 (the background grows because
max |Lambda_F(n)|/log n = 27.2 for n <= 7e4: DH fails the size hypothesis of (D2)). Fitted slope 0.264 over this range
against eta = 0.3085; the difference is within the background.

## 4. Test 3: can a zero at beta < 1 be seen by log-averaged or pretentious statements?

No, in three forms.

**Proposition 3a (PROVED-rel classical facts).** For |t| <= x,
D(1, n^(it); x)^2 = sum_{p<=x} (1 - Re p^(-it))/p = log log x - log |zeta(1 + 1/log x + it)| + O(1) (CLASSICAL). For a
zero rho = beta + i gamma with beta < 1 fixed, the local factorisation log |zeta(s)| = sum_{|rho - s| <= 1} log |s - rho| + O(log t)
gives a contribution log |1 + 1/log x - beta + i(t - gamma)|, bounded by |log(1 - beta)| + O(1) uniformly in x. Hence a
pretentious distance changes by O_beta(1) between a world with the zero and one without it; it diverges only for a zero
on Re s = 1. Every bound of Halász type is a function of M = min_t D^2 in [0, 2 log log x + O(1)], so it is at least
(log x)^(-2-o(1)) and changes by a constant factor.

**Proposition 3b (PROVED, sizes).** The term of a zero rho in a short sum is c_rho ((x+H)^rho - x^rho)/rho, of relative
size at most |c_rho| x^(beta-1) against H. In a logarithmic average int_1^x y^(rho-1) dy/y = O(1/|rho - 1|) against the
normalisation log x: relative size 1/log x. Every statement in the family (Matomäki–Radziwiłł short intervals, averaged
Chowla and Hardy–Littlewood, Tao's logarithmic two-point Chowla, entropy decrement) has error tolerance at least
(log x)^-A or o(1). A term of relative size x^(beta-1) is below every such tolerance. These statements are theorems; they
hold in both worlds.

**Proposition 3c (PROVED; tail type in the sense of round-3 lesson 5).** Let f be 1-bounded multiplicative and f' equal to
f except at a finite set S of primes. Then |D(f, g; x)^2 - D(f', g; x)^2| <= 2 sum_{p in S} 1/p for every g and x, so
"non-pretentious" (min over |t| <= x of D(f, n^(it) chi; x) -> infinity) and the quantity M(f; x) up to O(1) are invariant
under finite modification. For the rotation f -> f n^(i a): D(f n^(i a), n^(it)) = D(f, n^(i(t-a))), so the hypothesis
(a minimum over t) is rotation-invariant up to a shift of the t-range. The hypotheses of the three theorem families are
functions of M(f; x) only, and the conclusions hold uniformly on the class. They are therefore tail-measurable up to O(1)
and rotation-invariant; by lesson 5 they do not select chi = 1 and do not read the functional equation.

Converse remark (CLASSICAL): the same statements with a power saving are zero statements; for example
int_X^2X |sum_{x<n<=x+H} lambda(n)|^2 dx << H X^(1+eps) for all H <= X is equivalent to RH. Section 2 shows the method's
saving is capped at a power of log.

## 5. Controls

| Control | Outcome for the factorisation method | Step |
|---|---|---|
| DH | **Passes.** Its coefficients are c chi + conj(c) conj(chi), chi mod 5: two completely multiplicative, non-pretentious functions. The method's conclusions are linear (short-interval means) or sesquilinear with two different functions allowed (averaged Elliott form, RECALLED), so they hold for the DH coefficient sequence. "Not multiplicative, factorisation unavailable" is false at the level of conclusions. At log-derivative level DH fails the size hypothesis (max abs(Lambda_F)/log n = 27.2 to 7e4, MEASURED), not multiplicativity | none |
| Liouville twist (TW-) | Passes: the theorems are stated for lambda; its series zeta(2s)/zeta(s) has zeros at rho/2 and poles at rho | none |
| TW+ (0 <= eps_p <= 1) | Passes (1-bounded multiplicative; pretentious case included after subtracting the mean) | none |
| U, WT (unimodular twist n^(i a)) | Passes: hypothesis is a minimum over t (Proposition 3c) | none |
| FM (finite modification, bounded coefficients) | Passes (Proposition 3c) | none |
| E_a | Fails at size: coefficients sigma_{2a}(n) n^(-a) >= n^a are not 1-bounded | SIZE, not multiplicativity |
| Beurling | Ramaré's identity is formal on any free commutative semigroup, so the factorisation is available; the mean value theorem needs the spacing of the integers (off-diagonal terms) and is not available | INT (ARGUED, not run) |
| HEAT, T-NR, theta^w, phase-rotated transfer operator | Not formulable: no multiplicative coefficient sequence on the integers | not a quantitative handle |

No control with an Euler-type coefficient sequence of size 1 is separated from zeta. R3 is not met, and DH is not
separated either.

## 6. Requirement flags

- **R1 (multiplicativity essential): false.** Multiplicativity is essential to the proofs in the family (f(pm) = f(p) f(m)
  in Ramaré's identity), and it is used for primes in sparse ranges [P_j, Q_j] only, not for all primes jointly. The
  conclusions are closed under linear combination and hold for the DH coefficients (section 5), so no statement produced
  here uses multiplicativity in a way that separates Euler products from their linear combinations.
- **R2 (height-uniform, every window): false.** Every output is a mean square over t or over x (section 3, steps 1, 4, 5).
  The exceptional-set exponent is 2a against the 0 needed.
- **R3 (fails for every control at a structural step): false.** DH, Liouville, TW+, U/WT and FM pass (section 5).
- **R4 (reaches the critical line): false.** All statements live on Re s = 1 (Proposition 3a), with tolerance at least
  (log x)^-A against a zero term of size x^(beta-1) (Proposition 3b).

Score condition of the assignment ("an every-window or one-sided statement not equivalent to P10/T2"): not met by any step.

## 7. The three gaps as map rows

| ID (proposed) | Route | Obstruction | Status | Control | Lane |
|---|---|---|---|---|---|
| P27a | Bandwidth 1 < alpha < 2 in the Gabor/inertia chain through averaged Hardy–Littlewood | F(alpha) <= C is abs((1/H) sum_{h<=H} (1 - h/H) E(h)) << X^(1/alpha) log X with H = X^(1-1/alpha): a saving of X^(1-1/alpha)/log X over the sieve bound. Proved: (log X)^-A, for H >= X^(8/33) only (alpha >= 1.32). Gap in the exponent: 1 - 1/alpha against 0. Ramaré's identity is unavailable for Lambda; where it is available its saving is at most log P/log Q >= c/log X. On isolated zeros the input excludes beta > 1/2 + 1/(2 alpha) (beyond 7/8 for alpha > 4/3). Output would still be a proportion | derivation PROVED; proved range RECALLED; zero-side reading ARGUED | DH passes the method's conclusions by linearity | `c4-ramare-factorisation-pointwise` |
| MV-CAP row (new, P-series) | Ramaré factorisation of Dirichlet polynomials (Matomäki–Radziwiłł; averaged Chowla/Hardy–Littlewood; entropy decrement) as a pointwise input | Outputs are mean squares on Re s = 1. Large-value count for a prime polynomial at threshold P^-a: T^(2a + o(1)), used at a < 1/4. An isolated zero at sigma sits at threshold a = 1 - sigma at every scale (single-scale explicit formula, checked to 8e-7 for zeta and on the DH zero at 0.8085 + 85.699i); exclusion needs exponent <= 0, available 2(1 - sigma). The only sup bound in the method is Halász plus Vinogradov–Korobov (classical region) | PROVED (count, Lemma D); method structure RECALLED; MEASURED checks | DH, Liouville, TW+, U/WT, FM all pass | same |
| Tail row (new) | Pretentious and log-averaged statements as detectors of a zero with beta < 1 | D(1, n^(it); x)^2 = log log x - log abs(zeta(1 + 1/log x + it)) + O(1) moves by O_beta(1) for a zero with beta < 1; zero terms have relative size x^(beta-1) (1/log x in log averages) against tolerances >= (log x)^-A; hypotheses are invariant under finite modification up to 2 sum_{p in S} 1/p and under n^(i a) rotation. Tail type in the sense of round-3 lesson 5 | PROVED-rel classical formulas | FM, U/WT, Liouville pass | same |

By-product for a referee, not a map row until read: (D3), the count R << T^(2 - 2 sigma) log T for off-line zeros that are
isolated within T^eps, from Lemma D at X = T and the mean value theorem; and the statement that the failure for clusters
is a Turán-type cancellation with loss exp(-cK). If it holds it locates the density-hypothesis difficulty in clusters of
off-line zeros; it is a density statement and does not change any flag.

## 8. Pivot

Not taken as a separate attack. The strongest adjacent object is Lemma D with X = T (section 1, D3): it is the one place
in this lane where a zero is detected at a single freely chosen scale. It ends in the mean value theorem (MV-CAP) and its
obstruction for clusters is cancellation among residues, for which the only general tool is Turán's power-sum method.
It has no multiplicative step beyond Lambda(n) <= log n and prime-power support, so TW+ and TW- pass it.

## 9. Three weakest steps

1. Literature statements are RECALLED, not opened: the 8/33 range and (log X)^-A saving for averaged Hardy–Littlewood, the
   form of MR Lemma 8 and of the split T_j/U, the two-function averaged Elliott statement used for the DH control, and
   the exact normalisation of the Alpoge–Furman form factor (taken from `b-alpoge-furman` Proposition 2).
2. The zero-side reading of (N1) and by-product (D3) treat isolated off-line zeros only; the cluster case is argued from
   Turán's bound, not proved, and (D3) has not been compared with the density literature. The cross term with on-line
   zeros uses the pointwise bound C log T, which is CLASSICAL.
3. The method ceiling "saving at most log P/log Q" and the sharpness of the exponent 2a (random-combination construction)
   are ARGUED. The Beurling row (failure at the mean value theorem) was not run. The DH measurement has a background of
   the same order as the peak at X <= 3e3 and a fitted slope 0.264 against 0.3085.

## Files

- `detector.py`, `detector.json`: checks of Lemma D (zeta, 8 cells) and the DH off-line zero (4 scales). Local run through
  `scripts/memcap.sh 8`, under 10 MB. The compute server was not used.
