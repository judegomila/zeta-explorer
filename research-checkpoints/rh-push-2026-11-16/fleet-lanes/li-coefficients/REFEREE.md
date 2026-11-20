# Referee report: li-coefficients/RESULT.md

Date 2026-11-16. Adversarial pass. Verdict: the structure and the numbers survive; one PROVED constant is stated wrong
(0.146), Theorem B has a small class-membership gap, and the "classical H^2" baseline is unconfirmed.
holds = false as literally stated, because of the 0.146 constant. All other PROVED steps were re-derived and confirmed.

## Re-derived and confirmed

* (1.1) phase/modulus of z_rho, bounds 1/gamma - 1/(3 gamma^3) <= phi <= 1/gamma, mirror zero = 1/conj(z). Confirmed by hand.
* (1.2) on-line pair 2(1 - cos n phi); quadruple 4(1 - cos) - 2(r^n + r^-n - 2) cos; r^n + r^-n - 2 = 4 sinh^2((n/2) log(1/r));
  log(1/r) <= (2beta-1)/(2 gamma^2). Confirmed by hand. Hence lambda_n >= Q_n - E_n with E_n as defined (4 sinh^2 per zero,
  8 per quadruple). New numeric cases (beta,gamma,n) = (0.6,31.7,5000), (0.875,1000,3e6), (0.51,14.2,41), (0.95,200,123457):
  identity to 15 digits, bound holds.
* Step 1. 2(1-cos x) >= x^2(1 - x^2/12), x = n phi <= 1, and (11/12)(1 - 1/(3 gamma^2))^2 >= 0.91660 for gamma >= 100:
  confirmed. Stieltjes main term n(log(n/2pi)+1)/(2pi): confirmed. The factor 2.05 is not justified in the text; the exact
  R-part is R*(n) + 2 n^2 int_n^inf R*(t) t^-3 dt = 2.039 R*(n) at n = 100, decreasing to 2.006 at 1e27. So 2.05 is valid.
* Step 2. Integration by parts gives exactly int g (F' + R*') + 2 g(H) R*(H). Confirmed.
* Step 3. E_up/n^2 increasing, Q_low/n^2 decreasing for n >= 100. Confirmed.
* n*: independent quadrature (substitution t = H w^-1/2, different nodes): L* = 38.084948, n* = 6.8561e26 (c = 1);
  L* = 38.393989, n* = 9.2156e26 (c = 3/4). Matches the table. Second test case H = 1e9: n* = 5.92e19 (c=1), 7.98e19 (c=3/4),
  ratio 1.348. The half-plane gain is 4/3 times a logarithmic correction, as claimed.
* Theorem B arithmetic: n_1 = (2 gamma_0^2/c) log(n log n)(1+o(1)) ~ (4/c) H^2 log H. Confirmed; 1.17e27 and 1.57e27 are consistent.
* Lemma C. P(z)P(1/z) expansion gives lambda_j + lambda_k - lambda_{j-k}; defect identity 4 Re(u conj v) = 2|u|^2 + 2|v|^2 - 2|u-v|^2
  with u - v = D. Confirmed by hand and on a random synthetic symmetric zero set (3 on-line pairs + 2 quadruples, N = 5): 15 digits.
* Lemma D. s = a + (2a-1) z/(1-z); L_n^{(-1)}(u) = -(u/n) L_{n-1}^{(1)}(u); binomial form. Confirmed by hand and at a = 4, n = 5, 6
  (agreement 7e-6 and 5e-5 relative, equal to the m < 3000 truncation error). Fejer asymptotic exponents correct.
  Base-a modulus: log(1/r_a) ~ (2beta-1)(2a-1)/(2 gamma^2), matching the prime-side threshold.

## Errors and gaps

1. **Wrong constant (PROVED step, as stated, fails).** "Q_n >= 0.146 n log n" does not follow. Q_low(n)/(n log n) increases
   to the limit 0.9166/(2 pi) = 0.14588 < 0.146 and never reaches it: 0.1075 at n = 100, 0.1325 at 1e4, 0.1439 at 1e27.
   What is proved is Q_n >= Q_low(n), e.g. Q_n >= 0.143 n log n for n >= 1e26, or 0.1458 n log n - O(n). n* is unaffected
   (range2.py uses Q_low, not 0.146).
2. **Theorem B, class membership.** The twin must satisfy |R~(T)| <= R*(T). The text says "R changes by at most 2" but does not
   show zeta has that slack near H (Rosser gives none by itself; the published explicit S(T) bounds leave < 1 at this height).
   Fix: define the class with R* + 1 (the change is in fact at most 1); n* moves negligibly. Not a real obstruction.
3. **Theorem B is conditional.** "If RH fails the question is moot" does not give the bound n_1: a zeta counterexample to Li
   could sit at far larger n. An unconditional version is available and should replace it: take a synthetic on-line set with
   F(gamma_k) = k - 1/2 plus one quadruple; then Q_n <= sum min(4, n^2/gamma^2) = O(n log n) by counting alone and the same n_1 follows.
   The claim text labels this "PROVED under RH", which is accurate.
4. **DH statements are loose.** DH has zeros with Re s > 1, so sup beta_DH > 1 (not just >= 0.8085), and log f_DH has no
   convergent Dirichlet series for a near 1. "For one (every) a > 1" in Lemma D is false for DH; it needs a beyond the
   rightmost DH zero. The conclusion (Hankel positivity fails for DH since the 3^-s coefficient of -f'/f is negative) stands.
   The DH Li index ~3.3e5 is an estimate; no DH coefficient was computed.
5. **Baseline unconfirmed.** "Usual quoted range n <= H^2" is from memory. One search returned Coffey, math-ph/0507042,
   reported as inferring about the first 1e26 lambda_k nonnegative from 1e13 verified zeros (T ~ 2.4e12, T^2 ~ 6e24).
   If that reading is right, an H^2 log H-type range is already in the literature and the factor 76 is not new.
   I did not open the paper. No novelty claim should be attached to the range.
6. Density-estimate remark (section 3) uses a formula that is not derived. The conclusion is right for a simpler reason:
   density estimates do not exclude a single quadruple just above H.

## Controls

* RH: not assumed in Theorem A, Lemma C, Lemma D. Theorem B assumes RH and says so.
* Verified height: Theorem A is a verified-height corollary and the note says so. It gives no zero information.
* DH: Theorem A is Euler-blind and holds for DH with DH's own (H, theta, counting). That is consistent with it being a
  restatement of imported inputs; it is not a route to RH. Only the Hankel statement in Lemma D separates zeta from DH.

## Is the obstruction real

Yes. Within (H, theta, zero counting) the single-quadruple twin bounds the range by (4/c) H^2 log H; I found no way around.
Things that do not help: the classical zero-free region (changes c by ~1/(5.6 log H)), explicit density estimates,
using the full mass (n/2) log n in place of Q_low (moves L* by about log 3.4, i.e. n* by ~3%). Only larger H moves n*.

## Surviving claim

lambda_n >= Q_n - E_n exactly as defined; Q_n >= Q_low(n) (about 0.143 n log n near n*, constant below 0.1459);
lambda_n > 0 for n <= n*(H, theta) ~ (2/c) H^2 (log H + O(log log H)); evaluated (mpmath, two independent quadratures,
not interval-certified) n* = 6.856e26 (strip), 9.216e26 (theta = 7/8) at H = 3.0001753328e12; half-plane gain is 4/3 up to
log corrections; single-quadruple twin fails by (4/c) H^2 log H under RH (unconditional with a synthetic on-line set);
Lemma C and Lemma D identities. No positivity-preserving map to Li's coordinate: open.

Check scripts (not part of the deliverable): /tmp/ref-li/ref.py, /tmp/ref-li/nstar.py.
