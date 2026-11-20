# c21-statement-o-line11-control-table-40-digits-server: Statement O line 11, per-control table of the cited identities in Arb balls

Date 2026-11-20. Kind: compute (certified conversion, W1). Round 21. This lane makes no statement about zeros of zeta,
has no R4 answer and gives no requirement score. Every object is an identity that holds for zeta and for controls
alike; the table records for which control each cited form holds. Labels: PROVED (argument written here, one
derivation), CLASSICAL (standard, cited from memory), CERTIFIED (Arb ball arithmetic; the obligations are listed),
MEASURED.

## 0. Verdict

**Outcome: line 11 can be relabelled "MEASURED-certified per cell" for the cells listed below, with one scope
correction.** Pre-registration: `PREREG.md` (written before the first table run).

1. **Every cell in the general (residue) form encloses 0 with radius below 1e-45**: rows P8 and P1 for zeta, DH, E_a,
   T-NR, HEAT (tau = 1 and tau = 0.25), the sign twist and the unimodular twist (16 cells); row EF for zeta, DH, E_a, T-NR
   (prime side against zero side) and pointwise for all six Dirichlet-series controls; row P45 for the same six.
2. **The cited symmetric form** (Q = Re L(z)/Re z = sum over rho of V(rho) conj V(-conj rho); rows P8, P1) **encloses 0
   for zeta, DH, E_a, T-NR**, the controls named in line 11 and in the starred cells of map row P8. For HEAT the symmetric
   form equals the general form by evenness and reality (PROVED, section 2.4), and only the general form was computed.
   The starred cells DH, E_a, NR of row P8 and NR of row P1 are therefore certified in the cited form on a finite
   rectangle; the starred HEAT cells in the general form plus a two-line symmetry argument.
3. **Scope correction (predicted in PREREG.md, confirmed): for the sign twist and the unimodular twist the cited
   symmetric form excludes 0.** P8: sign twist -3.31584 - 4.44401 i, unimodular twist -4.74623; P1: -2.69168 - 3.63981 i
   and -4.75356 (enclosure radii below 1e-48). The term responsible is Q_sym - Q_gen =
   [(L(z) + conj L(z)) - (L(conj z) - L(-z))]/(2 Re z): the sign twist has no functional equation (L is not odd); the
   unimodular twist is not real on the real axis (L(conj z) != conj L(z)). For both, the identity holds in the general
   form Q_gen (Lemma R). Line 11 does not name these two controls in its P1 and P8 clauses, so no named cell is
   wrong; the clause "Control. Every control for which the identity is formulable" needs the qualifier that the
   cited zero-side form V(rho) conj V(-conj rho) = Re L/Re z is formulable only for controls that are even and real
   (zeta, DH, E_a, T-NR, HEAT, and ZQ, SG, NR-q, HQ* by the same argument, not run), and that for TW and WT-type
   translates the identity is the general one. Map rows P1 and P8 list only symmetric controls in their control
   column and need no change.
4. **What "certified" means here.** Each cell is an exact identity on a finite rectangle R: the zeros inside R are
   enclosed one by one and their completeness is proved by a contour count; the zeros outside R enter through an
   enclosed contour integral C_R. The statement "the identity with the sum over all zeros holds for the control" is the
   limit C_R -> 0, which is CLASSICAL for zeta, DH, E_a, T-NR and is not proved here for HEAT. The cells are not
   evidence for or against any property of zeros: by Cauchy's theorem they must enclose 0 for any meromorphic function;
   what they check is the bookkeeping of each cited form (pole terms, signs, symmetric against general form, the
   Dirichlet-series side and its tails) on each control, and that each control is a non-trivial instance (off-line
   zeros inside R for DH, E_a, T-NR, HEAT).
5. Not converted: L2 (a membership lemma, no numerical sides), D3 (literature criteria), Q25 (pending), D7 (the same
   residue computation on a strip; not run). These parts of line 11 stay ARGUED.

One execution of one code base (python-flint 0.9.0 / Arb), one derivation of the lemmas. `REFEREE.md` is a
recomputation of cells by this lane with separate floating-point code (mpmath); it is not an independent referee.

## 1. Plan

- Read: `push/BRIEF.md` to the end; `STATEMENT_O_v5.md` line 11; map rows P1, P8, P45, L2, D3, D7 and section 2
  (controls) of `push/OBSTRUCTION_MAP.md`; `campaign/CHECKPOINT_R20_DECISION_SHEET.md` section 3 row 11;
  `push/dh-separator/RESULT.md` sections 1, 2 (definitions of Q, L, the pair formula);
  `push/c20-statement-o-line4-heat-zero-enclosures-server` (`heat_encl.py`, RESULT.md, REFEREE.md Part I);
  `push/c20-mixed-form-control-census-server/tailA.py`.
- Reuse. The HEAT evaluation is the c20 lane's trapezoid representation with its proved error bound (its file is copied
  unchanged as `heat_c20.py`). The enclosed-tail idea of the census lane's Theorem A is used in a different form: there the
  tail of the zero sum is bounded after regularisation; here the tail is enclosed as a contour integral (rows P8, P1,
  EF) or in closed form with a proved n-truncation (row P45). The census code itself (finite Dirichlet polynomials) is
  not used.
- Decisive first test: zeta and the sign twist, all rows (unit `rh-c21z-1120102950`). It exposed two errors of mine
  before any table run was kept: constants created at 53-bit default precision (non-dyadic inputs), fixed by making
  every parameter an exact dyadic number; and a wide enclosure of Arb's incomplete gamma at large argument, fixed by a
  second evaluation route. The P45 cell of that first run did not enclose 0 (1e8 on a scale of 6e22): the cause was an
  edge passed as the decimal -31.7 in one place and as the double nearest to it in another, not the identity. The kept
  runs use dyadic edges.
- Server: all runs through `rhrun` after `rhstatus` (python-flint is not installed on the Mac). At most 8 cores in
  use at any time, memory caps 2 to 10 GB (resident use below 1 GB). The kept runs took at most 39 minutes each; one
  HEAT run was stopped by this lane after 2.2 hours and replaced (section 10). Units: section 10.
- Deviations from PREREG.md: a = 5/16 instead of 0.3 and c = 17/8 instead of 2.1 (exact dyadic parameters; with
  c = 17/8 the zeros of the T-NR factor are at Re s = 1/2 +- 0.50745, just outside the critical strip); rate heights
  and edges rounded to dyadic numbers; DH evaluated through its functional equation left of Re s = -2 on the wide
  rectangle; HEAT evaluated in the upper half w-plane through F(w) = conj F(conj w); the T-NR wide rectangle starts at
  Im z = 8 (the side at Im z = 1.5 did not reach a finite enclosure within the evaluation limit).

## 2. The tested forms, with proofs of the steps that are not ball arithmetic

Notation. s = 1/2 + z. For a control, D is the Dirichlet-series function (uncompleted), F = G D the completed function
(G the gamma factor; F entire where a completion exists), L = F'/F, Lambda_D(n) the coefficients of -D'/D. All sums over
"zeros" are over the divisor of F (or D) with multiplicity; a pole counts with negative multiplicity.

### 2.1 Rows P8, P1 (map rows P8, P1; `dh-separator` section 1, `eq48` Theorem 1)

For rates z_1..z_n with Re z_j > 0 and coefficients b_j let V(s) = sum_j b_j/(s + z_j), V#(s) = conj V(-conj s)
= sum_j conj(b_j)/(conj(z_j) - s), h = V V# (a rational function, poles at -z_i and conj z_j). Partial fractions:

    1/((s + z_i)(conj z_j - s)) = [1/(s + z_i) + 1/(conj z_j - s)]/(z_i + conj z_j).

**Lemma R (residue form; PROVED, Cauchy).** Let R be a closed rectangle containing every -z_i and conj z_j in its
interior, with no zero or pole of F on its boundary. Then

    (1/2 pi i) contour integral over the boundary of R of h L  =  W_R - Q_gen,
    W_R = sum over the divisor of F in R of m_rho V(rho) conj V(-conj rho),
    Q_gen = sum_{i,j} b_i conj(b_j) (L(conj z_j) - L(-z_i))/(z_i + conj z_j).

Proof. Residues of h L: m_rho h(rho) at each divisor point; at s = -z_i the residue of h is
sum_j b_i conj(b_j)/(z_i + conj z_j), at s = conj z_j it is -sum_i b_i conj(b_j)/(z_i + conj z_j). ∎

The cited form of rows P1 and P8 is Q_sym = sum_{i,j} b_i conj(b_j) (L(z_i) + conj L(z_j))/(z_i + conj z_j)
(order 1: Q_sym = Re L(z)/Re z). **Q_sym = Q_gen when F is even and real on the real axis** (then L(-z) = -L(z),
L(conj z) = conj L(z)); for a control without one of the two symmetries the two differ in general, and Lemma R shows
that the zero-side sum of the cited identity equals Q_gen, not Q_sym.

Cells. cell_gen = Q_gen - W_R + C_R and cell_sym = Q_sym - W_R + C_R, with C_R the contour integral of Lemma R. C_R is
the contribution of the divisor outside R: for a function of order 1 with a Hadamard product the full identity is the
limit C_R -> 0 along rectangles (CLASSICAL for zeta, DH, E_a, T-NR; not proved here for HEAT; see section 6).
The third P8 cell compares W_R with the pair formula of row P8 over the zeros in R,
W_pair = sum m_rho (x - Re rho)/(x abs(z - conj rho)^2): the two agree when the zero list in R is symmetric under
rho -> -conj rho (the pairing by the functional equation).

Rates are placed at z_j = x_j - i tau_j so that the poles of h (heights +tau_j) lie in a rectangle in the upper
half-plane; by reality this is the same test as rates at height +tau_j with a rectangle in the lower half-plane.

### 2.2 Row EF (prime side of the order-1 test)

At a rate with Re z = 11.5 (Re s = 12): L(z) = G'/G(s) + D'/D(s) and -D'/D(s) = sum_n Lambda_D(n) n^-s, truncated at N.

**Lemma M (majorant; PROVED).** If D(s) = 1 + sum_{n>=2} a_n n^-s with abs(a_n) <= 1, then for sigma >= 2 and N >= 1
sum_{n>N} abs(Lambda_D(n)) n^-sigma <= M_2 N^-(sigma-2), M_2 = (-zeta'(2))/(2 - zeta(2)) = 2.64...
Proof. -D'/D = (sum a_n log n n^-s) sum_{k>=0} (-(D - 1))^k; coefficientwise abs(Lambda_D(n)) <= m(n), where
sum m(n) n^-s = (-zeta'(s))/(1 - (zeta(s) - 1)), convergent at s = 2 because zeta(2) - 1 < 1. For n > N,
n^-sigma <= N^-(sigma-2) n^-2. ∎
Lemma M covers zeta, DH (coefficients 1, kappa, -kappa, -1, 0 by residue mod 5, kappa = 0.2841), the sign twist
(a_n = lambda(n)) and the unimodular twist (a_n = n^(-i alpha)). E_a: Lambda_E(n) = Lambda(n)(n^a + n^-a), so
abs(Lambda_E(n)) <= 2 n^a Lambda(n) and the tail is at most 2 M_2 N^-(sigma-a-2) (using -zeta'/zeta(2) <= M_2).
T-NR: D = zeta K, K(s) = q^w + c + q^-w = q^w (1 + r u)(1 + u/r), w = s - 1/2, u = q^-w, r + 1/r = c, so
-K'/K = -log q + log q sum_{k>=1} (-1)^(k-1) (r^k + r^-k) q^(k/2) (q^k)^-s: Lambda_NR(1) = -log q,
Lambda_NR(q^k) = Lambda(q^k) + log q (-1)^(k-1)(r^k + r^-k) q^(k/2), and the tail is at most
M_2 N^-(sigma-2) + 2 log q rho^(K_0+1)/(1 - rho), rho = r q^(1/2-sigma), K_0 = floor(log_q N).
For DH the coefficients Lambda_DH(n) are computed by the convolution recursion Lambda_D = (a log) * a^(-1).

Cells. cell_prime = Re[G'/G(s) - sum_{n<=N} Lambda_D(n) n^-s]/x (with the tail as a ball) - W_R + C_R on a wide rectangle
(abs(Re z) <= 12.5), for the controls with the symmetric form (zeta, DH, E_a, T-NR). For every Dirichlet-series
control: the pointwise cell D'/D(s) + sum_{n<=N} Lambda_D(n) n^-s (jets of Arb's zeta against the prime sum).

### 2.3 Row P45 (Fejer weight; kernel Y^w/(w^2 log Y))

Let k(u) = Y^(u-s)/((u-s)^2 log Y), R = [sigma_L, sigma_R] x [T_1, T_2] with s in the interior, sigma_R = 24 in the
half-plane of absolute convergence, no divisor point of D on the boundary. Cauchy:

    (1/2 pi i) contour integral over the boundary of R of (-D'/D) k = Res,
    Res = -D'/D(s) - (D'/D)'(s)/log Y - sum over the divisor of D in R of m_d k(d)

(double pole of k at u = s; residue -m_d of -D'/D at a divisor point). On the right side the Dirichlet series
converges absolutely and uniformly, so the side integral is sum_n Lambda_D(n) n^-s J_n,
J_n = (1/(2 pi i log Y)) int_{c+iT_1'}^{c+iT_2'} e^(lambda_n w) w^-2 dw, lambda_n = log(Y/n), c = sigma_R - Re s,
T_j' = T_j - Im s. The full vertical line gives the Fejer weight (CLASSICAL Perron formula for the kernel w^-2):
J_n + U_n = (1 - log n/log Y)_+, where U_n is the sum of the two tails.

**Lemma U (closed form of the tails; PROVED, and checked by balls).** For lambda != 0 and T_1' < 0 < T_2',
U_n = lambda [Gamma(-1, -lambda(c + iT_1')) - Gamma(-1, -lambda(c + iT_2'))]/(2 pi i log Y), principal branch.
Proof. With v = -lambda w, int e^(lambda w) w^-2 dw = -lambda int e^-v v^-2 dv. The image of each tail is a vertical
ray in the v-plane starting at v_0 = -lambda(c + iT') and going away from the real axis; it does not meet the cut
(-inf, 0]. Rotating the far end of the ray to +inf through the quadrant where Re v is bounded below costs nothing
(the integrand is O(abs(v)^-2) there), so the integral along the ray is Gamma(-1, v_0). The two tails have opposite
orientation. ∎ Ball check: J_n (by rigorous quadrature) + U_n - weight encloses 0 for n = 1, 2, 29, 31, 500 in each run
(last column of Table 4). Y = 30.5 is not an integer, so lambda_n != 0.

Hence S_Y(s) := sum_{n<Y} Lambda_D(n)(1 - log n/log Y) n^-s = (right side) + TU, TU = sum_n Lambda_D(n) n^-s U_n, and

    cell_P45 = S_Y - TU + C3 - Res,   C3 = (1/2 pi i)(bottom + top + left side integrals).

Truncation of TU at N: abs(U_n) <= (Y/n)^c/(2 c log Y) (each tail of int dt/(c^2 + t^2) is at most pi/(2c)), so
abs(sum_{n>N}) <= Y^c/(2 c log Y) sum_{n>N} abs(Lambda_D(n)) n^-sigma_R, bounded by Lemma M and its variants.
Gamma(-1, v) is evaluated by two Arb routes (acb.gamma_upper; e^-v U(2, 2, v)) and the tighter ball is used.
Because Y^c is about 7.6e34, this row is run at 400 bits.

Relation to the text of map row P45. The row states F_Y'(t) = 2 log Y sum Re kappa((rho - s) log Y) - (pole term) + O(1/t),
"the classical explicit formula with kernel Y^z/(z^2 log Y)". The cell is that explicit formula in its exact form on a
rectangle (zeros in R listed, the rest enclosed in C3); the O(1/t) rewriting with kappa is not what is certified.

### 2.4 Zeros, counts, integrals

- Zeros of each factor in R: Newton iteration from a grid (128 bits), then at full precision the interval Newton test
  N(B) = m - phi(m)/phi'(B) subset of B, which proves a unique simple zero of phi in the ball B; N(B) is the enclosure used
  (radius below 1e-60 in every case).
- Completeness: for each factor phi the integral (1/2 pi i) of phi'/phi over the boundary of R is enclosed and contains
  exactly one integer; it must equal (zeros certified) - (poles of phi in R, known exactly).
- Contour integrals: `acb.integral` (Arb's rigorous adaptive Gauss-Legendre; the integrands are meromorphic: series
  jets of the Riemann and Hurwitz zeta functions, digamma, exponentials, rational functions; a ball meeting a pole
  returns a non-finite value, which forces bisection). Sides are split into pieces of length at most 2.
- Edges of rectangles, rates, a = 5/16, c = 17/8, alpha = 1, Y = 61/2 and the order-2 coefficients b = (1, -3/4 + i/2)
  are exact dyadic numbers; derived constants (kappa of DH, r of T-NR, logarithms) are recomputed at the working precision.
- DH: f(s) = 5^-s sum_{a=1..4} c_a zeta(s, a/5), (c_a) = (1, kappa, -kappa, -1), by Arb's Hurwitz zeta, for Re s >= -2
  (every contour of rows P8, P1, P45). On the wide rectangle of row EF the part Re s < -2 is evaluated through the
  functional equation Lambda_DH(s) = Lambda_DH(1 - s) (CLASSICAL): the direct Hurwitz evaluation has unusable
  enclosures on wide balls there (a first run did not terminate on that side and was stopped). The two forms were
  compared in balls at four points (Re s = -3/2, -3, -12, 1/4): differences enclose 0 (`fecheck.py`).
- HEAT: F = H_{-tau} in the variable w of `c20-statement-o-line4-heat-zero-enclosures-server` (real axis = critical
  line), z = i w/2. Values by that lane's trapezoid sum with its proved error eps (its Lemmas S, T, Q, refereed there),
  uniform on a box in w; the derivative of the sum with error eps/r by Cauchy's estimate on the box enlarged by
  r = 1/4. Outside the validity box the evaluation returns a non-finite ball. Q_sym needs L at the rates themselves,
  which lie at height -tau, far from the stored samples; it is not computed. F is even and real on the real axis
  (H_0 is, and the Gaussian is even and real), so Q_sym = Q_gen for HEAT by section 2.1 (PROVED; not a cell).

## 3. Tables (kept runs: `out_main.json`, `out_heat.json`; 256 bits for rows P8, P1, EF, 400 bits for row P45)

### Table 1. Rows P8 (order 1) and P1 (order 2): enclosure of Q - W_R + C_R

| control | rectangle (X; Im range) | zeros certified / contour count, per factor | P8 Q_gen | P8 cell (general form) | P8 cell (cited symmetric form) | P8 W_R - pair formula | P1 cell (general) | P1 cell (cited symmetric) |
|---|---|---|---|---|---|---|---|---|
| zeta | 2; [9.5, 45.5] | zeta(u): 8 / 8 | 5.111222984 +0i | 0 +- 6.5e-49 | 0 +- 6.5e-49 | 0 +- 3.2e-74 | 0 +- 1.5e-48 | 0 +- 1.5e-48 |
| DH | 2; [84.375, 87.0] | f(u): 2 / 2 | 30.1057822 +0i | 0 +- 2.6e-48 | 0 +- 2.6e-48 | 0 +- 3.7e-72 | 0 +- 2.8e-48 | 0 +- 2.8e-48 |
| E_a, a = 5/16 | 2; [9.5, 35.5] | zeta(u+a): 5 / 5; zeta(u-a): 5 / 5 | 6.299787861 +0i | 0 +- 9.3e-49 | 0 +- 9.3e-49 | 0 +- 3.2e-74 | 0 +- 2.1e-48 | 0 +- 2.1e-48 |
| T-NR, q = 2, c = 17/8 | 2; [1.5, 20.5] | zeta(u): 1 / 1; K(u): 4 / 4 | -10.39936606 +0i | 0 +- 6.5e-49 | 0 +- 6.5e-49 | 0 +- 1.3e-73 | 0 +- 1.2e-48 | 0 +- 1.2e-48 |
| HEAT, tau = 1 | 1.15625; [2499.875, 2501.140625] | H_-tau: 2 / 2 | -0.4897622353 +0i | 0 +- 4.9e-49 | not computed (see text) | 0 +- 2.2e-67 | 0 +- 4.7e-49 | not computed (see text) |
| HEAT, tau = 0.25 | 0.8125; [500009.28125, 500011.171875] | H_-tau: 3 / 3 | -3.568368865 +0i | 0 +- 2.3e-48 | not computed (see text) | 0 +- 4.3e-49 | 0 +- 2.5e-48 | not computed (see text) |
| sign twist (Liouville) | 2; [4.5, 15.8125] | zeta(2u): 4 / 4; zeta(u): 1 / 1 | 5.580327004 +4.444005739i | 0 +- 8.8e-49 | **excludes 0**: -3.31584 -4.44401i (+- 8.8e-49) | **excludes 0**: 1.34306 +4.37899i (+- 1.9e-74) | 0 +- 7.6e-49 | **excludes 0**: -2.69168 -3.63981i (+- 7.6e-49) |
| unimodular twist, alpha = 1 | 2; [9.5, 45.5] | zeta(u+i alpha): 8 / 8 | 5.111222984 +0i | 0 +- 6.1e-49 | **excludes 0**: -4.74623 +6.52346e-77i (+- 6.1e-49) | 0 +- 3.2e-74 | 0 +- 8.8e-49 | **excludes 0**: -4.75356 +6.53063e-77i (+- 8.8e-49) |

### Table 2. Sizes in rows P8, P1 (so that no cell is 0 = 0)

| control | rate z1 | abs D at the rates (lower bound) | P8: abs W_R | P8: abs C_R | P1: abs W_R | P1: abs C_R | P1 Q_gen |
|---|---|---|---|---|---|---|---|
| zeta | 0.375 - 14.375i | 0.309, 0.673 | 5.08405 | 0.0271685 | 5.36901 | 0.00880992 | 5.377824694 +0i |
| DH | 0.375 - 85.75i | 0.102, 0.772 | 29.2593 | 0.84649 | 15.7149 | 0.204061 | 15.91899731 +0i |
| E_a, a = 5/16 | 0.375 - 14.375i | 0.0877, 0.436 | 6.23652 | 0.0632633 | 6.74961 | 0.0215387 | 6.771144295 +0i |
| T-NR, q = 2, c = 17/8 | 0.375 - 4.625i | 0.0508, 0.237 | 10.495 | 0.0956267 | 8.61383 | 0.0438962 | -8.569929808 +0i |
| HEAT, tau = 1 | 0.375 - 2500.921875i | 0.064, 0.097 | 3.52033 | 3.03057 | 1.88094 | 1.04142 | 2.922359341 +0i |
| HEAT, tau = 0.25 | 0.375 - 500010.328125i | 0.00766, 0.0349 | 6.923 | 3.35463 | 9.55032 | 1.31483 | 10.86514574 +0i |
| sign twist (Liouville) | 0.375 - 7.25i | 0.59, 0.72 | 7.02237 | 0.11144 | 5.79292 | 0.0370493 | 4.554091748 +3.639810189i |
| unimodular twist, alpha = 1 | 0.375 - 13.375i | 1, 1.19 | 5.08405 | 0.0271685 | 5.36901 | 0.00880992 | 5.377824694 +0i |

### Table 3. Row EF: prime side of Q(e^(-zt)) at Re z = 11.5 against the zero side on the wide rectangle

| control | z3 | N | proved tail bound | abs prime sum | Q from the prime side | cell (prime side - W_R + C_R) | cell (cited symmetric form, jets) | cell pointwise D'/D + sum | zero list complete |
|---|---|---|---|---|---|---|---|---|---|
| zeta | 11.5 - 20.25i | 65536 | 1.8e-48 | 0.000168526 | 0.0601784742821 +0i | 0 +- 3.2e-49 | 0 +- 1.6e-49 | 0 +- 1.8e-48 | True |
| DH | 11.5 - 85.875i | 65536 | 1.8e-48 | 4.87265e-05 | 0.184095551487 +0i | 0 +- 1.0e-48 | 0 +- 8.7e-49 | 0 +- 1.8e-48 | True |
| E_a, a = 5/16 | 11.5 - 20.25i | 65536 | 1.2e-46 | 0.000344941 | 0.120358561199 +0i | 0 +- 1.0e-47 | 0 +- 6.2e-50 | 0 +- 1.2e-46 | True |
| T-NR, q = 2, c = 17/8 | 11.5 - 9.25i | 65536 | 1.8e-48 | 0.692477 | 0.105372642153 +0i | 0 +- 5.9e-49 | 0 +- 4.3e-49 | 0 +- 1.8e-48 | True |
| HEAT, tau = 1 | | | | | not formulable (no ordinary Dirichlet series) | n/f | n/f | n/f | |
| HEAT, tau = 0.25 | | | | | not formulable (no ordinary Dirichlet series) | n/f | n/f | n/f | |
| sign twist (Liouville) | 11.5 - 8.25i | 65536 | 1.8e-48 | 0.000167168 | not formulable in the symmetric form | n/f | n/f | 0 +- 1.8e-48 | |
| unimodular twist, alpha = 1 | 11.5 - 20.25i | 65536 | 1.8e-48 | 0.000169371 | not formulable in the symmetric form | n/f | n/f | 0 +- 1.8e-48 | |

### Table 4. Row P45: Fejer kernel Y^w/(w^2 log Y), Y = 30.5, cell S_Y - TU + C3 - Res

| control | s | rectangle Im range (Re from -1/2 to 24) | divisor points in R (zeros certified / poles, per factor; contour count) | N | proved tail bound | S_Y | abs TU | divisor sum | cell | tail closed form self-test (worst radius) |
|---|---|---|---|---|---|---|---|---|---|---|
| zeta | 0.5 + 20i | [-31.6875, 31.6875] | zeta(u): 8 / 1; 7 | 4096 | 4.2e-47 | -0.00099700754521 -1.03255278676i | 6.10457e+22 -1.81981e+22i | 0.266544314484 +0.120984267722i | 0 +- 4.3e-47 | all enclose 0, 2.4e-49 |
| DH | 0.5 + 85i | [82.5, 88.5] | f(u): 4 / 0; 4 | 4096 | 4.2e-47 | -0.239385952323 -1.87024287547i | -2.7881e+22 +4.85421e+22i | 1.38918714699 -0.0609388196977i | 0 +- 4.3e-47 | all enclose 0, 1.1e-62 |
| E_a, a = 5/16 | 0.5 + 20i | [-31.6875, 31.6875] | zeta(u+a): 8 / 1; 7; zeta(u-a): 8 / 1; 7 | 8192 | 3.4e-52 | 0.13566768651 -2.31709258725i | 1.24967e+23 -3.72538e+22i | 0.532010320497 +0.663498866246i | 0 +- 4.9e-49 | all enclose 0, 2.4e-49 |
| T-NR, q = 2, c = 17/8 | 0.5 + 10i | [-20.5, 20.5] | zeta(u): 2 / 1; 1; K(u): 8 / 0; 8 | 4096 | 4.2e-47 | 0.351974720183 -0.202258817877i | -4.24597e+28 +8.3921e+29i | -0.210079379317 -0.0261529267443i | 0 +- 4.3e-47 | all enclose 0, 8.9e-62 |
| HEAT, tau = 1 | | | | | | not formulable (no ordinary Dirichlet series) | | | n/f | |
| HEAT, tau = 0.25 | | | | | | not formulable (no ordinary Dirichlet series) | | | n/f | |
| sign twist (Liouville) | 0.5 + 5i | [-9.5, 9.5] | zeta(2u): 2 / 1; 1; zeta(u): 0 / 1; -1 | 4096 | 4.2e-47 | 0.417211442116 -0.137664001027i | 2.10897e+22 +1.2847e+22i | -0.0266006556931 -0.0676079081034i | 0 +- 4.3e-47 | all enclose 0, 5.0e-62 |
| unimodular twist, alpha = 1 | 0.5 + 19i | [-32.6875, 30.6875] | zeta(u+i alpha): 8 / 1; 7 | 4096 | 4.2e-47 | -0.00099700754521 -1.03255278676i | 6.10457e+22 -1.81981e+22i | 0.266544314484 +0.120984267722i | 0 +- 4.3e-47 | all enclose 0, 2.4e-49 |

Reading the tables. "0 +- r" means the enclosure of the cell contains 0 and has radius r (maximum over real and
imaginary part). In Table 1 the T-NR and HEAT rates lie inside the lens of an off-line pair, and Q is negative there
(-10.399 for T-NR, -0.4898 and -3.568 for HEAT), as row P8 says it must be for a control with off-line zeros; for DH
the rate (0.375 - 85.75 i) is outside the lens of the pair at 0.3085 + 85.6993 i (x = 0.375 > delta = 0.3085) and Q is
positive. The unimodular twist is zeta translated by i: its rectangles and rates were chosen as translates of zeta's,
so its general-form cells repeat zeta's numbers (same W_R, C_R); the only new content of that row is the symmetric-form
cell. For the sign twist the cell "W_R - pair formula" also excludes 0: its divisor in R (zeros at Re z = -1/4, a pole
on Re z = 0) is not symmetric under rho -> -conj rho, so the pair formula of row P8 is not its zero side; and its Q_gen
is not real (5.5803 + 4.4440 i). In Table 3 the wide rectangle of T-NR is [-12.5, 12.5] x [8, 20.5] (one zero of zeta,
two of the factor; counts 1 and 2), the others are the Table 1 ranges widened to abs(Re z) <= 12.5; the column
"zero list complete" is the contour count on the wide rectangle. In Table 4 the entry "8 / 1; 7" reads: 8 zeros
certified, 1 pole inside, contour count 7 = 8 - 1. Imaginary parts printed as +0i are balls containing 0.

## 4. Non-triviality of each control (PREREG requirement)

| control | not identically zero | zeros inside R used by the cells |
|---|---|---|
| zeta | abs zeta at the rates >= 0.31 | 8 on the line, heights 14.13 to 43.33 |
| DH | abs f at the rates >= 0.10 | the off-line pair +-0.308517182456637 + 85.699348485377592 i (certified; both partners found separately by direct Hurwitz evaluation) ; 4 zeros in the P45 rectangle |
| E_a | abs D >= 0.088 | 5 + 5 zeros at Re z = -5/16 and +5/16 |
| T-NR | abs D >= 0.051 | zeta's zero at 14.13 and four zeros of the factor at +-0.507449788 + 4.532360 i, +-0.507449788 + 13.597080 i |
| HEAT, tau = 1 | abs F (scaled) >= 0.064 | the off-line pair +-0.817574037648 + 2500.823423924555 i (Re s = 1/2 +- 0.8176; the zero of the c20 lane) and no other zero in R |
| HEAT, tau = 0.25 | abs F (scaled) >= 0.0077 | the pair +-0.476041185927 + 500010.227631072 i and one zero on the line at height 500009.919881248 |
| sign twist | abs D >= 0.59 | 4 zeros at Re z = -1/4 (zeros of zeta(2s)) and 1 pole at 14.13 i (zero of zeta(s)); in row P45 also the pole at s = 1/2 and the zero at s = 1 |
| unimodular twist | abs D >= 1.0 | zeta's 8 zeros translated by -i |

For every factor and every rectangle the contour count equals the number of certified zeros minus the known poles
(columns of Tables 1 and 4; all complete). No rate and no point s is a zero: the lower bounds of abs D above are
enclosures. No formula was evaluated at a zero or at a hypothetical zero position.

## 5. Controls: what this lane says about the three requirements

This lane is a table of controls; it is not an attack and has no step at which a control is meant to fail. Its content
for the filter is the confirmation, with enclosures, of the sentence of line 11: the identities of the read class
(I) hold for each control with its own zeros and coefficients, so no step of class (I) separates zeta from a control,
and each identity's sign reads the zeros (Q < 0 at rates inside a lens for T-NR and HEAT, Table 1). The one added
fact is structural: the cited symmetric zero-side form needs evenness and reality, and fails for controls lacking
either (sign twist, unimodular twist), for which the general form holds. That is not a separation of zeta from the
controls with zeta's functional equation (DH, E_a, T-NR, HEAT pass verbatim).

## 6. What is and is not established

- CERTIFIED (Arb; one execution): every enclosure in Tables 1 to 4, the zero enclosures and the contour counts, given
  (i) Lemmas R, M, U and the residue bookkeeping of section 2 (PROVED here, one derivation), (ii) correctness of
  python-flint 0.9.0 / Arb for acb.integral, zeta and Hurwitz zeta series, digamma, gamma, exp, gamma_upper, hypgeom_u,
  (iii) this lane's code, (iv) for HEAT, Lemmas S, T, Q of the c20 lane (refereed there, Part I of its REFEREE.md) and
  the Cauchy estimate for the derivative, (v) for DH on the wide rectangle, its functional equation (CLASSICAL;
  checked in balls at four points), (vi) for HEAT in the upper half-plane, reality of F on the real axis (PROVED).
- CLASSICAL, not certified: C_R -> 0 along rectangles (the identities with all zeros) for zeta, DH, E_a, T-NR; the
  Perron formula for the kernel w^-2 (used only through J_n + U_n = weight, which is checked in balls for five n per
  control).
- Not established: C_R -> 0 for HEAT (order and growth of H_{-tau}'/H_{-tau} on contours not examined here); the
  form of row P45 with kappa and the O(1/t) term; anything at other rates, heights, Y, a, c, alpha, tau; the parts of
  line 11 on L2, D3, D7, Q25.
- Sizes of the enclosed remainders C_R (zeros outside R), for the record: zeta 0.027, DH 0.85, E_a 0.063, T-NR 0.096,
  HEAT 3.03 and 3.35 (small rectangles), sign twist 0.11 (row P8, Table 2). They are not small: the cells certify the
  finite-rectangle identity, not a truncated infinite sum.

## 7. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 (all primes together, multiplicativity essential) | false | the identities hold for DH (no Euler product; Lambda_DH(6) = 1.936, Lambda_DH(3) = -0.312) and for the sign twist verbatim in the general form; nothing here uses multiplicativity |
| R2 (uniform in height, every window) | false | finite rectangles at fixed heights; no uniform statement |
| R3 (fails for every control at a structural step) | false | the opposite is certified: each identity holds for each control; the symmetric form fails only for controls without evenness or reality, which is not a separation from DH, E_a, T-NR, HEAT |
| R4 (passes to the critical line) | false | no such step; identities of class (I) carry no inequality |

## 8. Three weakest steps

1. **The cells are finite-rectangle residue identities.** They must hold for any meromorphic function, so "encloses 0"
   certifies the bookkeeping of each cited form on each control and the completeness of the zero lists, not the
   identity with the sum over all zeros. That passage (C_R -> 0) is CLASSICAL for four controls and unproved here for
   HEAT; the remainders C_R are of size 0.03 to 3.4. A reader who wants "the explicit formula holds for HEAT with all
   its zeros" as a certified statement does not get it from this lane.
2. **Shared inputs inside some cells.** DH on the wide rectangle (row EF) uses the functional equation left of
   Re s = -2, so that cell does not test the functional equation (the narrow P8 and P1 cells do: they use direct
   Hurwitz evaluation on the whole contour and both partners of the off-line pair were certified separately). HEAT in
   the upper half-plane is evaluated by reflection, so the partner zero and the pair-formula cell of HEAT are symmetric
   by construction; Q_sym for HEAT is not computed. The unimodular-twist cells are translates of zeta's cells.
3. **One execution, one code base, one parameter set per control.** No second run at another precision, rectangle,
   rate or Y. The referee file is by the same lane (mpmath floating point: three cells recomputed in full, the DH
   P8 cell only in its pointwise parts because the full mpmath contour for DH was stopped after 105 minutes). Lemma U (closed form of the tails by Gamma(-1, v), branch argument) is one derivation; it is
   backed by the ball self-test J_n + U_n = weight at five n per control and by the mpmath recomputation of the zeta
   P45 cell, not by a second proof.

## 9. Proposed text for the Label bullet of line 11 (for the record lane; this lane does not edit Statement O)

"MEASURED-certified per cell (lane `c21-statement-o-line11-control-table-40-digits-server`, Arb balls, one execution):
on finite rectangles, with the zeros inside enclosed and counted and the remainder enclosed, the cited forms of P8
(order 1) and P1 (order 2) enclose 0 for zeta, DH, E_a, T-NR (radius below 1e-47) and, in the general residue form,
for HEAT (tau = 1, 0.25); the prime side of the order-1 test (zeta, DH, E_a, T-NR) and the Fejer-kernel formula of P45
(zeta, DH, E_a, T-NR, sign twist, unimodular twist) enclose 0 (radius below 1e-45). Scope: the zero-side form
V(rho) conj V(-conj rho) = Re L/Re z requires F even and real; for the sign twist and the unimodular twist it fails
(differences -3.32 - 4.44 i and -4.75 at the tested rates) and the general form (L(conj z) - L(-z))/(2 Re z) holds.
ARGUED as before: the passage to all zeros for HEAT, and the clauses on L2, D7, Q25."

## 10. Files and units

- `PREREG.md`; `table11.py` (all rows); `heat_c20.py`, `cfg_t1_first_A.json`, `cfg_t0p25_strip_A.json` (copied from the
  c20 lane); `fecheck.py` (DH functional equation in balls); `diag.py`; `build_tables.py`, `tables.md`;
  `out_main.json` (zeta, DH, E_a, T-NR, sign twist, unimodular twist: every number of Tables 1 to 4 at 45 digits, zero
  enclosures, counts), `out_heat.json` (HEAT); `referee.py`, `referee_A2.py`, `referee_*.json`, `REFEREE.md`; `lanes.jsonl`; `units.txt`.
- Server units (all started through `rhrun`; logs in `~/rh-push/logs/<unit>.log` on the server):
  `rh-c21probe-1120102157` (API probe), `rh-c21z-1120102950` (first test, zeta and sign twist; superseded),
  `rh-c21diag-1120104308`, `rh-c21diag-1120104342` (incomplete gamma), `rh-c21heat-1120104514` and
  `rh-c21heatB-1120111410` (HEAT without reflection; stopped by this lane, too slow), `rh-c21main-1120111237` (narrow
  and P45 integrals of the six Dirichlet-series controls; stopped by this lane when the DH wide side did not
  terminate; its saved integrals are the ones used), `rh-c21fe-1120120450`, `rh-c21wide-1120121131` (wide integrals;
  ended with a non-finite T-NR side), `rh-c21wide2-1120124410` (T-NR wide rectangle from Im z = 8; final assembly),
  `rh-c21asm-1120125149`, `rh-c21asm-1120125656` (assembly only), `rh-c21heatC-1120132713` (HEAT, kept run, 39 min),
  `rh-c21refA-1120125247` (stopped by this lane after 105 min), `rh-c21refB-1120125345`, `rh-c21refC-1120125509`,
  `rh-c21refD-1120135359`, `rh-c21refA2-1120141702` (referee). Logs copied to `logs/`.
  No unit of this lane is left running. No process was stopped by name; only this lane's own units were stopped, by
  exact unit name.
