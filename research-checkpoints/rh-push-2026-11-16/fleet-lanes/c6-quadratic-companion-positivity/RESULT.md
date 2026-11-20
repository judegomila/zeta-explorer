# c6-quadratic-companion-positivity: degree-2 positive forms with automorphic companions (2026-11-18)

Slug `c6-quadratic-companion-positivity`. Explore slot, device node `map-open-9` (OBSTRUCTION_MAP section 6 item 9,
lead 22). Author check only, not refereed. No statement about zeros of zeta or of any L-function is proved here.
Labels: PROVED (argument written here) / CLASSICAL / MEASURED (numerics here) / ARGUED (not written line by line).

**Verdict: precise obstruction; lane closed at the first test; no pivot.** The class of degree-2 positive forms
splits into three types. (i) Log-level squares are linear in -L'/L and are row P25. (ii) Products of two log-level
forms have non-negative coefficients only when both factors are already admissible linear forms (Lemma Q).
(iii) Coefficient squares sum |b(n)|^2 n^{-s} are non-negative with no multiplicativity at all: they are invariant
under every unimodular twist of b, and they stay non-negative with Davenport-Heilbronn (DH) coefficients (exact,
n <= 10^4). Multiplicativity enters type (iii) only through the factorisation of the series into L-functions, and
that factorisation tests zeros only on Re s >= 1 (Edge Lemma), with a quantitative content equal to P25 plus O(1)
(Lemma H). The named control (DH with the same companions; round-4 lesson 7) passes every step whose conclusion
would reach left of Re s = 1. Per the assignment the lane stops here. No mean-value variant was launched.

Files: `test1.py`, `test1.log`, `test1.json` (8 s), `test2.py`, `test2.log`, `test2.json` (1 s). Both run locally as
`scripts/memcap.sh 8 .venv-arb/bin/python -I <file>` (python-flint + mpmath; peak memory under 100 MB). The compute
server was not used.

---

## 0. Plan; relation to closed rows

Read: BRIEF (all notices); OBSTRUCTION_MAP sections 2, 3 (rows P23, P24, P25, P46, P48), 6; `sym-power-positivity`
(Theorems A, B); `n2-landau-even-moment-family` (L1 to L3, duality answer); `ap-order-two` (verdict, sections 1-3);
generator candidates rank 2 (`M3-309f16`) and rank 3 (`M1-32660c`), both of which name `map-open-9` as the crossing
member and record no control result.

- P25 covers linear combinations of -L'/L(s + ik gamma, pi) with non-negative prime coefficients. It states
  "quadratic or mean-value positivity not covered". This lane covers the quadratic half.
- N-row of `n2-landau-even-moment-family`: even moments of a family give an every-member bound, but evaluating the
  family sum below the large-sieve point is equivalent to the conclusion. That is the density type (type T4 below)
  and is not repeated.
- Lesson 7 of round 4: a conclusion class closed under linear combination holds for DH. Used here as the criterion:
  for each form, is the non-negativity closed under linear combination of the underlying coefficient sequence b?

Steps planned: (1) classification lemma; (2) for each pointwise type, the Landau argument and its reach; (3) DH
substituted, first 10^4 coefficients exactly; (4) remaining controls. Steps 1 to 4 were done. Nothing further.

## 1. First lemma: classification of degree-2 positive forms

Setting. Pi = isobaric sum of pi_j |.|^{z_j} with multiplicities m_j > 0, pi_j in {1, f, sym^2 f, ...} unitary
cuspidal (f a holomorphic newform, so the Ramanujan bound holds: CLASSICAL, Deligne), z_j complex shifts (unitary
case: z_j = i t_j). A_p = the diagonal matrix of Satake parameters of Pi at p. lambda_Pi(n) = Dirichlet coefficients
of L(s, Pi); lambda_Pi(p^k) = h_k(A_p) (complete homogeneous symmetric polynomial).

Four ways to make a Dirichlet series quadratic in this data with non-negative coefficients:

| Type | Form | Why coefficients are >= 0 | Linear in | Conclusion type |
|---|---|---|---|---|
| Q1 log-level square | sum Lambda(n) abs(tr A_p^k)^2 n^{-s} = -(L'/L)(s, Pi x Pi~) | abs(.)^2 at each prime power | -L'/L of Rankin-Selberg factors | pointwise on sigma > 1; via Hadamard a region of shape c/log t |
| Q2 product of two log-level forms | D_w(s) D_w'(s), coefficients (Lambda c) * (Lambda c') | Lemma Q: only if c, c' >= 0 separately (up to a common sign) | bilinear in -L'/L | follows from the two linear inequalities |
| Q3 coefficient square | D_b(s) = sum abs(b(n))^2 n^{-s}; for b = lambda_Pi equal to L(s, Pi x Pi~) H(s) | abs(.)^2 at each n; no hypothesis on b | L-values (not logarithms), after factorisation | (a) Landau abscissa: a real singular point; (b) D_b(sigma) >= sum_{n<=N} abs(b(n))^2 n^{-sigma}, pointwise sigma > sigma_c; (c) Bochner: [D_b(sigma + i(t_j - t_l))] is positive semidefinite, pointwise on lines sigma > sigma_c |
| Q4 family square | sum over f in a family of abs(sum_n lambda_f(n) x_n)^2 (Petersson / Kuznetsov / large sieve) | square per member | the family average | density in the conductor aspect (MV-CAP; row of `n2-landau-even-moment-family`). Not launched. |

Examples. Q1: the classical 3 + 4 cos + cos 2 = (1/2) abs(1 + e^{i theta})^4 is
itself a square, so the classical argument is already of type Q1. Q1 in the conductor aspect with Pi = 1 + sym^2 f
is the Goldfeld-Hoffstein-Lieman argument (CLASSICAL) that removes real exceptional zeros of L(s, sym^2 f): there
the device does give more than the linear form, because the zero has multiplicity 2 against a simple pole. In the
t-aspect for zeta the multiplicity pattern is a cosine polynomial and P25 Theorem A applies. Q3 with
Pi = 1 + |.|^{i gamma}: b = sigma_{-i gamma}, D_b = zeta(s)^2 zeta(s + i gamma) zeta(s - i gamma)/zeta(2s)
(Ramanujan; CLASSICAL), the form in Ingham's proof of non-vanishing on Re s = 1. Identity checked to n <= 10^4 in
interval arithmetic at gamma = 14.1347... and 85.6993...: maximal midpoint difference below 1e-38 (MEASURED,
`test1.json` keys `C_zeta_Ramanujan_identity_*`).

**Q1 is P25. PROVED.** -(L'/L)(s, Pi x Pi~) = sum_{j,l} m_j m_l (-L'/L)(s + z_j + conj z_l, pi_j x pi_l~) is a
linear combination of the kind admitted in `sym-power-positivity` Theorem A (for the constituents that are
automorphic; for the others inequality (1) there cannot be written). Its zeta part is
abs(sum over the trivial constituents of m_j e^{-i t_j theta})^2. By Fejer-Riesz every non-negative cosine
polynomial is of this form, so Q1 restricted to zeta is exactly the classical cone, and with companions Theorem A
gives no larger value of the functional V.

**Lemma Q (Q2 reduces to linear). PROVED for zeta shifts; with companions PROVED-rel joint density of
(Satake angle, gamma log p mod 2 pi) over primes (CLASSICAL: Sato-Tate with non-vanishing of the symmetric-power
L-functions on Re s = 1).** Let c, c' be the continuous functions on the parameter space X (the torus of phases,
times the Sato-Tate interval) with c(p) = c(x_p), c'(p) = c'(x_p), and suppose {x_p} is dense in X. If
(Lambda c) * (Lambda c') has non-negative coefficients at n = pq for all primes p != q, then c >= 0 and c' >= 0 on
X, or c <= 0 and c' <= 0 on X, or one of them vanishes on X.
Proof. The coefficient at pq is log p log q (c(x_p) c'(x_q) + c'(x_p) c(x_q)). By density and continuity,
B(x, y) := c(x) c'(y) + c'(x) c(y) >= 0 for all x, y in X (the diagonal is a limit of off-diagonal pairs). Suppose
c(x_0) < 0. From B(x_0, x_0) >= 0, c'(x_0) <= 0. If c'(x_0) < 0 and c(y) > 0 for some y, then c'(y) >= 0 from
B(y, y) >= 0 and B(x_0, y) = c(x_0) c'(y) + c'(x_0) c(y) < 0: contradiction; so c <= 0 on X, and the same argument
with the roles exchanged gives c' <= 0. If c'(x_0) = 0, then B(x_0, y) = c(x_0) c'(y) >= 0 gives c' <= 0 on X; if
c' is not identically zero pick z with c'(z) < 0 and apply the first case with (c', z) in place of (c, x_0). QED
Consequence: a product (or a square) of two log-derivative combinations with non-negative coefficients is a product
of two admissible linear forms of P25, and the inequality D_w D_w' >= 0 follows from D_w >= 0 and D_w' >= 0.

**Q3: the coefficient-square class.** Three statements.

**Lemma U (invariance). PROVED, one line.** For any b and any u with abs(u(n)) = 1 (multiplicative or not),
D_{ub} = D_b. Hence every conclusion drawn from the coefficients of D_b alone holds for all unimodular twists of b:
completely multiplicative sign twists (Liouville, THIN), n^{-i alpha}, and non-multiplicative phases. The
non-negativity of D_b uses no property of b.

**Lemma H (Q3 = Q1 up to a bounded factor). PROVED.** Let Pi be as above with unitary shifts and degree
d = sum m_j deg pi_j (integer multiplicities). Then D_{lambda_Pi}(s) = L(s, Pi x Pi~) H(s),
H = prod_p H_p, and abs(log H_p(sigma)) <= C_d p^{-2 sigma} for sigma >= 1, uniformly in the shifts.
Proof. With x = p^{-sigma} <= 1/2 and unitary eigenvalues alpha_1..alpha_d: S_p(x) = sum_k abs(h_k(alpha))^2 x^k
= 1 + abs(h_1)^2 x + O_d(x^2), since abs(h_k) <= binom(d+k-1, k). R_p(x) = prod_{j,l} (1 - alpha_j conj(alpha_l) x)^{-1}
= 1 + abs(h_1)^2 x + O_d(x^2). S_p >= 1 and (1+x)^{-d^2} <= R_p <= (1-x)^{-d^2}, so H_p = S_p/R_p lies in
[2^{-d^2}, C_d] and H_p - 1 = O_d(x^2). QED
For d = 2 the factor is exact: H(s) = 1/zeta(2s) (divisor case and sum lambda_f(n)^2 n^{-s} = zeta(s) L(s, sym^2 f)/zeta(2s)).
MEASURED for Pi = 1 + Delta |.|^{i gamma} (d = 3) at sigma = 1, first 25 primes, two values of gamma:
max p^2 abs(log H_p(1)) = 5.54 and 4.50; sum over the 25 primes -0.654 and -0.872 (`test2.json` keys `G5_*`).
Consequence: log D_b(sigma) = sum_{j,l} m_j m_l log abs(L(sigma + i(t_j - t_l), pi_j x pi_l~)) + O_d(1). Against a
cost of order log gamma this is the Q1 inequality in its (weaker) logarithmic form. The derivative -D_b'/D_b is not
sign-definite: the p^2 logarithmic coefficient of sum lambda_Delta(n)^2 n^{-s} is negative at 11 of the 25 primes
p <= 100 (p = 11, 17, 19, 29, 47, 59, 61, 67, 79, 83, 97; MEASURED, `test2.json` key `G3_*`). So Q3 is a different
cone from Q1 at the level of coefficients, and the same inequality up to O(1) at the level of conclusions.
The lower bound (b), D_b(sigma) >= sum_{n<=N} abs(b(n))^2 n^{-sigma}, adds nothing usable: evaluating the partial sum
from below requires a lower bound for sum_{p<=N} Re(p^{-i gamma}) p^{-sigma}, which is the quantity the inequality
is meant to control (ARGUED).

**Edge Lemma (reach of the Landau argument in class Q3). PROVED rel CLASSICAL non-vanishing on Re s = 1 (zeta;
Jacquet-Shalika and Shahidi for the Rankin-Selberg factors).** Let the shifts z_j be arbitrary complex numbers and
m = min_j Re z_j. Then D_{lambda_Pi}(s) = prod_{j,l} L(s + z_j + conj z_l, pi_j x pi_l~)^{m_j m_l} H(s) has abscissa
of convergence exactly s_0 = 1 - 2m, for every configuration of zeros of the factors in Re s < 1.
Proof. The factor (j, l) converges absolutely for Re s > 1 - Re z_j - Re z_l <= s_0, with equality only when both
indices attain the minimum; H converges absolutely for Re s > s_0 - 1/2 and H(s_0) > 0. A diagonal pair j = l at
the minimum contributes a pole at s_0. At s = s_0 every factor is evaluated at a point of real part
1 + (Re z_j - m) + (Re z_l - m) >= 1, where it does not vanish. So the pole at s_0 is not cancelled and Landau's
theorem returns s_0, which is the abscissa of absolute convergence. QED
Consequence: in class Q3 a zero can cancel the leading pole only if it lies on Re s >= 1. Ingham's argument is the
case of equality (a zero at 1 + i gamma against the double pole). Non-unitary shifts (the zeta(s+a) zeta(s-a)
shape) move s_0 to the right by 2 abs(a) and do not move the evaluation points into the strip. The Landau device
on a coefficient square therefore gives no statement in Re s < 1. This is the R4 wall in its simplest form: the
positivity lives on the half-plane of convergence, and the half-plane of convergence ends at the pole.

Summary of conclusion types. Pointwise on a line: Q1 (sigma > 1, then region c/log t by P25), Q3(b), Q3(c) (lines
right of the pole), Q3(a) (the line Re s = 1, qualitative). Density: Q4.

## 2. First decisive test

Question 1: for each form with a pointwise conclusion, does the Landau argument give a zero-free statement beyond
the classical region? **No.** Q1: P25 Theorem A (shape and constant unchanged). Q2: Lemma Q. Q3(a): Edge Lemma
(reach Re s >= 1). Q3(b): Lemma H (Q1 in logarithmic form plus O(1)). Q3(c): a statement about values on lines
right of the pole; it contains abs(D_b(sigma + it)) <= D_b(sigma) and makes no reference to zeros.

Question 2: with DH in place of zeta, are the coefficients non-negative? DH: f = sum a(n) n^{-s},
a(n) = 1, kappa, -kappa, -1, 0 for n = 1, 2, 3, 4, 0 mod 5, kappa = (sqrt(10 - 2 sqrt 5) - 2)/(sqrt 5 - 1)
= 0.2840790438..., minimal polynomial x^4 + 2x^3 - 6x^2 - 2x + 1 (from (kappa(sqrt5 - 1) + 2)^2 = 10 - 2 sqrt5;
irreducible: no root +-1, and a split into quadratics needs roots of t^2 - 2t - 4). Unshifted forms are computed
exactly in Z[kappa]; shifted forms in interval arithmetic (mpmath iv, 40 digits; flint arb, 600 bits), with every
sign certified (no interval contains 0). All n <= 10^4. MEASURED.

| Form | zeta | DH in the zeta slots |
|---|---|---|
| product f^2 (exact) | d(n) > 0 | 4000 negative, 2000 zero; first negative n = 3 (value -2 kappa) |
| product f^4, the Ingham form at gamma = 0 (exact) | d_4(n) > 0 | 4000 negative; first n = 3 (-4 kappa) |
| product f^2 f(s + i gamma) f(s - i gamma), gamma = 14.134725... | 0 negative of 10^4 | 3970 negative; first n = 3 |
| same, gamma = 85.6993484854 (ordinate of DH's off-line zero) | 0 negative | 3995 negative; first n = 3 |
| L(s, Pi x Pi~), Pi = 1 + Delta |.|^{i gamma}, both gamma | 0 negative | f in both zeta slots: 4993 and 4994 negative; first n = 3 |
| coefficient square abs(a(n))^2 (exact) | 1 | 0 negative (2000 zero: n = 0 mod 5) |
| coefficient square abs((a*a)(n))^2 (exact) | d(n)^2 | 0 negative |
| coefficient square abs((a * a n^{-i gamma})(n))^2 | abs(sigma_{i gamma})^2 | 0 negative (a square) |

Reading.

1. In the product forms DH fails at n = 3, a prime, because a(3) = -kappa < 0: the coefficient at a prime p of
   f^2 f(s + i gamma) f(s - i gamma) is 2 a(p)(1 + cos(gamma log p)). This is the sign of one coefficient. It is
   the property TW+ and Beurling systems keep. It is not a multiplicative step. These product forms are Q1 forms
   for zeta (their logarithm is the admissible form), so this line of the table is P25 with the control cell of P25.
2. In the coefficient-square forms DH passes: non-negative for every n, with no computation needed. Exact identity
   (checked for all n <= 10^4): a(n)^2 = ((1 + kappa^2)/2) chi_0(n) + ((1 - kappa^2)/2) (n/5), so
   sum a(n)^2 n^{-s} = ((1 + kappa^2)/2)(1 - 5^{-s}) zeta(s) + ((1 - kappa^2)/2) L(s, (./5)):
   a linear combination of two L-functions with non-negative coefficients, a simple pole at s = 1 with residue
   (2/5)(1 + kappa^2) > 0, abscissa 1, and all of Q3(a), (b), (c) valid. This is lesson 7 in closed form: the
   class {b : sum abs(b(n))^2 n^{-s} has non-negative coefficients} is all sequences.
   The same holds with automorphic companions: for any cusp form g (eigenform or not) the Rankin-Selberg integral
   of abs(g)^2 against the Eisenstein series continues sum abs(a_g(n))^2 n^{-s-k+1} with a simple pole at s = 1 of
   residue proportional to the Petersson norm and with poles only at the zeros of zeta(2s) (CLASSICAL, Rankin).
   Example of a non-eigenform: Delta^2 (weight 24), coefficients 0, 1, -48, ..., c(6) = 143820 (computed).
3. What DH lacks in class Q3 is the factorisation: abs(b)^2 is not multiplicative. Exact defects at (2, 3):
   abs(a)^2: value 1 at n = 6 against 0.006513 = kappa^4; abs(a*a)^2: 3.3804 against 0.1042;
   abs(a * a n^{-i gamma})^2 at gamma = 14.13: 4.6051 against 2.87e-5. So D_b for DH is not
   f^2 f f / (a function analytic near Re s = 1), and Ingham's deduction cannot be written. That is a multiplicative
   step at which DH and every non-multiplicative control fail. By the Edge Lemma the deduction it supports is
   non-vanishing on Re s = 1 (CLASSICAL, 1930) and nothing to the left.

Decision. The pointwise conclusions that could reach the strip (Q3(a) extended, Q3(b), Q3(c)) either do not
exist (Edge Lemma) or hold for DH (reading 2). The control passes every planned step. Stop.

## 3. Further controls

| Control | Q1 / Q2 (log level) | Q3 coefficient square | Step named |
|---|---|---|---|
| DH | fails: a(3) < 0 (sign of a prime coefficient) | positivity, abscissa, Bochner all hold (exact identity above); factorisation fails (defect at (2,3)) | passes everything left of the factorisation; the factorisation reaches Re s = 1 only |
| TW- sign twist, THIN (eps completely multiplicative, +-1) | product forms of F_eps have coefficients eps(n) (abs(sigma)^2 * 1_sq)(n): negative where eps(n) = -1 | identical series: D_{eps b} = D_b (Lemma U) | Q3 cannot distinguish zeta from THIN, which has a real zero b in (1/2, 1) |
| TW+ (0 <= eps <= 1) | positivity kept | kept | passes (P25 control cell) |
| U (unimodular completely multiplicative) | abs(tr)^2 forms kept when the twist is applied to Pi as a whole; lost when applied to one constituent | identical series (Lemma U) | passes |
| zeta(s+a) zeta(s-a) | P25 control EA | it is the member Pi = |.|^a + |.|^{-a} of the class: D_b = zeta(s-2a) zeta(s)^2 zeta(s+2a)/zeta(2s), abscissa 1 + 2a (Edge Lemma) | passes: the form is positive and consistent while the function has zeros at Re s = 1/2 +- a |
| Beurling | P25 Theorem B | all of Q3 holds on generalised integers | passes |
| T-NR | one local factor changed | abs(b)^2 >= 0 kept; H changes at one prime | passes |
| Bochner on DH itself (not its square) | - | abs(f(2 + it)) <= f(2) fails: f(2) = 1.00007, abs(f(2 + 38.40 i)) = 1.11964 (10^4 terms, tail < 1.0001e-4) (MEASURED) | fails by coefficient signs, a non-multiplicative reason |
| interpolation twin, backward heat, theta^w, phase-rotated transfer operator | not ordinary Dirichlet series with the coefficient structure the forms need | forms not defined | not applicable; no claim |

No control fails at a multiplicative step that leads into the strip. The one multiplicative step (factorisation of
D_b) separates zeta from DH and is blind to U, TW-, THIN and zeta(s+a) zeta(s-a).

## 4. Requirement flags

- **R1 (multiplicativity essential): not established.** Non-negativity in Q3 needs no multiplicativity (Lemma U,
  DH table). Non-negativity in Q1 is abs(.)^2 at each prime power: it uses the Euler product only to make -L'/L a
  prime sum, as in P25. The factorisation step is multiplicative, and its reach is Re s >= 1 (Edge Lemma).
- **R2 (height-uniform, every window): not established** for anything new. The classical outputs (non-vanishing on
  Re s = 1; region c/log t) are uniform; nothing here goes beyond them.
- **R3 (every control fails at a named structural step): not established.** DH passes Q3; THIN, U, TW+, Beurling,
  T-NR and zeta(s+a) zeta(s-a) pass or are indistinguishable from zeta.
- **R4 (reaches the critical line): not established and shown not reachable by this device.** Edge Lemma.

## 5. Proposed map row (not applied; `push/OBSTRUCTION_MAP.md` not edited)

> | P50 (next free id) | Degree-2 positive forms with automorphic companions: log-level squares, products of log-level forms, coefficient squares sum abs(b(n))^2 n^-s (Ingham / Rankin-Selberg), pointwise outputs | Log-level squares are linear in -L'/L (row P25; Fejer-Riesz: the zeta part is the classical cone). A product of two log-level forms has non-negative coefficients only if both factors are admissible linear forms. A coefficient square is non-negative for every sequence b and invariant under every unimodular twist of b; with DH coefficients it stays non-negative (exact, n <= 10^4: sum a(n)^2 n^-s = ((1+kappa^2)/2)(1-5^-s) zeta(s) + ((1-kappa^2)/2) L(s,(./5))). For b = lambda_Pi it equals L(s, Pi x Pi~) H(s) with log H = O_d(1) on sigma >= 1, and its abscissa is 1 - 2 min Re z_j for every zero configuration: the leading pole is met only by factors evaluated on Re s >= 1. Landau on a coefficient square reaches Re s = 1 and no further. Density (family) outputs not run: MV-CAP and the row of `n2-landau-even-moment-family`. | PROVED (Lemmas Q, U, H, Edge; rel classical non-vanishing on Re s = 1 and, for Lemma Q with companions, Sato-Tate density); coefficients MEASURED exactly; unrefereed | DH (passes the coefficient-square class), U, TW-, THIN (identical series), EA (member of the class) | `c6-quadratic-companion-positivity` |

> Section 6 item 9, replace by: closed for pointwise outputs (`c6-quadratic-companion-positivity`, unrefereed); the
> density half is MV-CAP plus the even-moment row. Not covered: positivity of non-Dirichlet quadratic objects
> (periods, triple products, theta lifts), which are other rows (ap-squares-rallis, e1 lanes).

Engine node proposals: `map-open-9` status closed-pointwise; new proved nodes `coefficient-square-unimodular-invariance`
(Lemma U), `coefficient-square-edge-lemma`, `log-product-reduces-to-linear` (Lemma Q); generator candidates
`M3-309f16` and `M1-32660c` lose their crossing member.

## 6. Three weakest steps

1. **Lemma Q with companions** rests on joint density of (Satake angle of f at p, gamma log p mod 2 pi) over primes.
   For zeta shifts alone density of gamma log p mod 2 pi is elementary (log p_{n+1} - log p_n -> 0). For several
   forms or for constituents not known automorphic the density statement was cited, not derived; it also uses only
   coefficients at n = pq and assumes the parameter functions c, c' are continuous (true for finite combinations).
2. **The classification is of four named constructions, not of all "degree-2" objects.** Not covered: forms that are
   quadratic in L-values at different points with weights not of Gram type; Dirichlet series whose coefficients are
   non-negative for an arithmetic reason other than a square (for example counts of representations); non-unitary
   Pi with real multiplicities in Lemma H (stated for integer multiplicities and unitary shifts; the Edge Lemma
   covers complex shifts but uses H(s_0) > 0 and absolute convergence of H near s_0, which was checked from the
   local expansion and not written for non-tempered constituents such as Maass forms, where the Ramanujan bound is
   not available).
3. **"Adds nothing usable" for the partial-sum lower bound Q3(b)** is ARGUED, not proved: no theorem here excludes a
   lower bound for sum_{n<=N} abs(b(n))^2 n^{-sigma} obtained from sieve weights rather than from prime phases. By
   Lemma U any such bound depends only on abs(b) and so holds for THIN-twisted b as well, which limits what it can
   say about zeros of L(s, b), but the limit on what it can say through the factorisation of D_b was not written.
   The numerics are certified signs for n <= 10^4 at two values of gamma only; the statements they support
   (reading 1 and 2) are also proved for all n by the displayed formulas.
