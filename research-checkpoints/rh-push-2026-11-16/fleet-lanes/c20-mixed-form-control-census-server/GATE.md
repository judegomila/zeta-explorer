# GATE (pre-registration) for c20-mixed-form-control-census-server

Written 2026-11-20 before any code of this lane was run. The only numbers computed beforehand are the two
constants sigma_1, sigma_2 below (integrals of the test function alone; no arithmetic data).
The paper lane `c20-u4-second-order-archimedean-mixed-form` had no directory when this was written, so the
object is defined here from the two sources the assignment names: Lemma Q2 of
`c19-u4-joint-prime-phase-quadratic-dp-zeros` and the reserve Lg - u of
`c18-tz-one-sided-bound-fe-reserve-bridge` (Theorem A in the corrected form V0 of
`c19-dp-zero-census-truncation-identity-server`). No statement about zeros of zeta is made by this lane.

## 1. Exact object

F a Dirichlet series with a_1 = 1; Lambda_F the coefficients of -F'/F; P an integer; u = log P;
C_a the truncated shift by a on L^2[0, u]; X multiplication by the variable s;
A = sum_{n < P} Lambda_F(n) n^(-1/2) C_(log n);  R = reserve (below);  B = R/2 - A.

    T1(h) = 2 Re <h, B h>                 = R norm(h)^2 - 2 Re <h, A h>             (first order, the form of N(theta))
    T2(h) = 2 Re <h, (B^2 + [X, A]) h>    = (R^2/2) norm(h)^2 - 2 R Re <h, A h> + 2 Re <h, A_2 h>      (the mixed form)
    A_2 = A^2 + [X, A] = sum_{n < P} Lambda_{2,F}(n) n^(-1/2) C_(log n),   Lambda_2 = Lambda log + Lambda * Lambda  (coefficients of F''/F).

B^2 + [X, A] is the image of E''/E, E = e^(i vartheta) F (Hardy phase, vartheta' = R/2 taken constant in the
window), under the homomorphism n^(-s) -> n^(-1/2) C_(log n). Zero side (Lemma Q2 with Theorem A, to be
checked in Part 1b, not assumed):

    T2(h) = ((R - u)^2 / 2) norm(h)^2 + sum over zeros beta of D_P of [ (R + D_P''(beta)/D_P'(beta)) x pair form at beta ],
    R + D_P''(beta)/D_P'(beta) = (R - u) + 2 sum_{beta' != beta} 1/(beta - beta').

Test vectors: h_x(s) = sin^4(pi s/u) e^(i x s), x = t_w + tau. With c(xi) = autocorrelation of sin^4(pi s/u)
(closed form, a sum of terms (alpha + beta xi) e^(i nu xi)), c0 = c(0) = 35u/128:

    S1(x) = sum_{n<P} Lambda_F(n) n^(-1/2 - ix) c(log n),   S2(x) = sum_{n<P} Lambda_{2,F}(n) n^(-1/2 - ix) c(log n),
    T1(x)/c0 = R - 2 Re S1/c0,     T2(x)/c0 = R^2/2 - 2 R Re S1/c0 + 2 Re S2/c0.

Reserve: R = Lg = log(t_w/2 pi) for every class with zeta's functional equation or none (zeta, DEL, HQ2, HQ3,
HQ4, ZQ, sign chains, Liouville, T-NR); R = 2 Lg for E_a (own configuration, degree 2); R = log(5 t_w/2 pi)
for DH (own conductor). R is evaluated at the window centre t_w and held constant in the window.
Variant reported for sensitivity only (xi convention instead of the Hardy phase): T2xi = T2 - (pi d)^2 c0/8 + pi d Im S1... not used for any decision.

Cells: t in {1e4, 1e6, 1e8} (1e10 if time allows), theta' in {0.5, 0.7, 0.85, 0.95},
P = floor((t/2 pi)^theta') (the convention of the c19 census). Windows: t_w = t + 200 w, w = 0..23, tau in
[-40, 40] on a grid of step 0.02 (4001 points). Every object is evaluated on the same 24 windows.

Classes (parameters fixed here):
- zeta.
- E_a: zeta(s+a) zeta(s-a), a = 0.1: Lambda(n)(n^a + n^-a), R = 2 Lg.
- DEL: thin prime deletion, b = 0.75, greedy floor rule of the map row (prime p deleted when the counter is below floor(Ei(b log p) - Ei(b log 2))): Lambda on powers of the primes kept.
- HQ2: zeta(s)(1 + eps v^2/(1 - v)^4), v = q^(1/2 - s), q = 2, eps = 0.01.
- HQ3: zeta(s)(1 - alpha v + v^2)/(1 - beta v + v^2), q = 2, a = 0.1, b = 0.2.  HQ4: the same with + alpha v.
- ZQ: zeta's log-coefficient measure plus the density of the exchange (two adjacent zeta ordinates g1, g2 nearest the window centre removed, zeros at 1/2 +- eta + i (g1+g2)/2 added; the mirror images at negative height are omitted, their contribution to a window at height t is below t^-4); eta = 0.01 and eta = 0.1; Laplace-truncated at u.
- sign chains: completely multiplicative eps(p) = +-1, 24 seeds (numpy default_rng(121000 + j), the c19 seeding), every seed on all 24 windows.
- Liouville: eps(p) = -1.
- T-NR: zeta(s)(1 + c v + v^2), q = 3, c = 2.2.
- DH: Davenport-Heilbronn (period 5), Lambda_DH from the recursion a(n) log n = sum_{d | n} Lambda(d) a(n/d).
Seeded class: sign chains (24 seeds). Extra seeded class added here: 24 Haar unimodular chains (rng 770000 + j) as the reference ensemble for sizes.

## 2. Statistic and threshold

m(F, cell, w) = min over the tau grid of T2(x)/(c0 Lg^2)   (normalised by zeta's Lg in every class).
PASS(F, cell): m >= 0 in all 24 windows. FAIL(F, cell): for at least one grid point the sign of T2 is negative
and is confirmed in ball arithmetic (python-flint, direct sum over n < P with exact coefficients; prec 128,
a sample rerun at 256). Also recorded: fraction of grid points with T2 < 0, the same for T1, the quantiles of
T2/(c0 Lg^2), and the four parts below. A cell where the ball does not exclude 0, or where the ball stage was
not run, is UNDECIDED and is listed.

Float stage (screen only): long-double phases at the window centre, moments in bins of width 1/64 in log n
(14 Taylor moments), A^2 by convolution of the binned moments. Controls on the computation: (i) each control
differs from zeta: max over the grid of abs(S1_F - S1_zeta)/c0 is printed and must exceed 1e-6 (not identically
zero difference; for DEL the number of deleted primes below P is printed, and a cell with none is marked
"DEL = zeta at this stage"); (ii) float value against ball value at every ball point; (iii) prec 128 against
256 on at least 8 points; (iv) ball radii reported; (v) Part 1b checks the zero-side formula for T2.

## 3. Decomposition and predictions (registered)

T2/c0 = Q0 + Q1 + Q2a + Q2b,  Q0 = R^2/2,  Q1 = -2 R Re S1/c0,  Q2a = 2 Re S_log/c0 (the commutator [X, A]:
Lambda log),  Q2b = 2 Re S_conv/c0 (A^2: Lambda * Lambda).
With sigma_1 = (2 int_0^1 y chat(y)^2 dy)^(1/2) = 0.2070 and sigma_2 = ((8/3) int_0^1 y^3 chat^2)^(1/2) = 0.0486
(chat = autocorrelation of sin^4 on [0, 1], normalised):
- P-1. For zeta, sign chains, Haar chains, Liouville, DEL: over a window, Q1 has mean within 0.1 R u of 0 and
  standard deviation sigma_1 R u (1 +- 0.2); Q2a + Q2b has standard deviation sigma_2 u^2 (1 +- 0.3).
  Split of the second-order variance: Q2a carries 3/4, Q2b 1/4, each within a factor 1.5 (diagonal count).
- P-2 (the decisive prediction). T2/(c0 Lg^2) = 1/2 - theta' sigma_1 z_1 + theta'^2 sigma_2 z_2 with z of unit
  variance, so T2 < 0 needs about 2.4/theta' standard deviations of the first-order sum. Predicted: **zeta FAILS
  at theta' = 0.95 and 0.85 at every height (negative grid fraction between 1e-3 and 3e-2 at 0.95), has no negative grid
  point at theta' = 0.5, and is marginal at 0.7; sign chains and Haar chains show the same fractions within a factor 3.**
  That is: T2 >= 0 is predicted NOT to be an inequality for zeta, and where it holds in the sample it is a
  large-deviation event shared by the chains.
- P-3. DEL: within 0.05 of zeta in m at every cell (few primes deleted). HQ2, HQ3, HQ4: differ from zeta by the
  local factor at 2 only; same PASS/FAIL pattern as zeta. ZQ: abs(m_ZQ - m_zeta) below 0.05 for eta = 0.01, and
  for eta = 0.1 a visible change only in the window that contains the exchanged pair.
- P-4. E_a (R = 2 Lg): FAILS at theta' >= 0.7 by size (coefficients n^a); T-NR fails by size at theta' >= 0.7
  (Lambda_T(3^j) 3^(-j/2) grows like (1.5)^j); DH passes or fails as a Haar chain with reserve log(5t/2 pi).
- P-5. Liouville: as a sign chain.

## 4. Registered outcomes

(a) E_a or DEL passes at every cell where zeta passes: the U4 residual "second-order mixed form with the
    reserve" is closed as MEASURED.
(b) zeta passes at every cell with min m not shrinking in height, and every control fails at a size not
    explained by resolving its zeros: survivor, no score, proof lane next round.
(c) undecided cells are listed.
(d) (added here) zeta itself FAILS at a cell with a ball-confirmed negative value: T2 >= 0 is not an inequality
    for zeta at that theta'; the form is dead there as a one-sided statement, for every class, and the census
    is reported as a comparison of failure fractions only.
Decisive first test: zeta at t = 1e4, all four theta', float stage then ball stage. If (d) occurs at
theta' >= 0.85 and zeta has no negative point at 0.5: the question that remains is whether the PASS at low
theta' separates zeta from anything; that is answered by the full census (chains, DEL, E_a at the same cells),
which is then run once at the registered size and not extended.
One pivot allowed (registered now, used only under (d)): the conditional form "T2 >= 0 on the set where
T1 >= kappa c0 Lg", reported as the least kappa(F, cell) for which it holds on the grid, i.e. kappa = max of
T1/(c0 Lg) over grid points with T2 < 0. For every class with R = Lg, T2 = R T1 - c0 (R^2/2 - 2 Re S2/c0), so
kappa measures the largest second-order excursion 1/2 - 2 Re S2/(c0 R^2) reached where T2 < 0. Survivor rule for the
pivot: kappa(zeta) below the 24-seed minimum of kappa over sign chains at every cell of two heights, and DEL
and both ZQ not sharing it. Prediction: no separation (kappa is set by the size of S2, which is a mean-value
quantity).

## 5. Part 1 (Theorem A, enclosed limit) and Part 1b

Part 1. Series: zeta at P = 12, 20, 30; N5 = (1, 1, -1, 2, 0.5); N12; DH12 (the six of c19 Run A). Zero lists
certified as in c19 `runA.py` (winding numbers, interval Newton) for abs(Im beta) < T, T = 800 ... 12800.
Tail lemma to be used (statement registered; proof in RESULT): with q(xi) = 2 Re <h, C_xi h>, q^(k)(u) = 0 for
k <= 8, Phi(beta) = <h, kappa_beta h> = int_0^u q(xi) e^(w xi) d xi, w = beta - 1/2,

    Phi(beta) = sum_{k=0}^{5} (-1)^(k+1) q^(k)(0) w^-(k+1) + rho(beta),   abs(rho(beta)) <= K6 abs(w)^-6,
    K6 = max(1, P^(sigma_R - 1/2)) u sup abs(q^(6)),

and sum over all zeros of w^-(k+1) is -(l_0 + u/2) for k = 0 and -l_k for k >= 1, l_k the Taylor coefficients of
D_P'/D_P at 1/2 (from the partial-fraction expansion with constant -u/2, CLASSICAL). With the CLASSICAL count
bound abs(n(y1, y2) - u (y2 - y1)/2 pi) <= P - 1 (zeros of an exponential sum with at most P terms in a
horizontal strip), the tail beyond T is at most K6 (12/5)(u T/2 pi + P - 1) T^-6. Registered check:
abs(lhs - rhs_T) <= tail bound, for all six series, tau in {0, 7.3}, every T; the enclosure of
lim_T sum_{abs(Im beta) < T} <h, kappa_beta h> is reported with its width. Prediction: holds at every row;
width below 1e-9 norm(h)^2 at T = 6400.
Part 1b. Second order, same zero lists: S2 = sum_{abs(Im beta) < T} r_beta [G(beta) + C(0)/w - C'(0)/w^2]
+ C(0) (D''/D(1/2) - u^2/4) - C'(0) (D''/D)'(1/2) + O(T^-2), r_beta = D''(beta)/D'(beta),
G(beta) = int_0^u C(xi) e^(w xi) d xi, C(xi) = <h, C_xi h>. Prediction: defect decays as T^-2 (ratio 4 +- 1 per
doubling) for all six series, including the non-multiplicative ones. If the constant -u^2/4 is wrong the defect
tends to a non-zero constant times C(0); that outcome is reported as found.

## 6. Size

Server through rhrun only: 8 cores, 12 GB per unit, GPU not used (the float stage is a binned sum; nothing here
is GPU-shaped). Largest allocation: sieve to P = 6.9e6 (t = 1e8, theta' = 0.95), under 0.5 GB per worker;
t = 1e10 only for theta' with P <= 7e7 and only if the main census is finished. Units stopped at the end.
