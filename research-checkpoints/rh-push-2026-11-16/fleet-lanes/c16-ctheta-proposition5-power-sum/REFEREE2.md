# REFEREE2: c16-ctheta-proposition5-power-sum

Second independent referee (lane `c17-referee-r16-lemma-h-sources`, 2026-11-20). Own derivations; own code
(`push/c17-referee-r16-lemma-h-sources/code/indep.py`, numpy and mpmath, local, `scripts/memcap.sh 8`).
Nothing here is a statement about zeros of zeta. Labels: PROVED, CLASSICAL, MEASURED.

**Verdict: HOLDS (precise obstruction; four flags false), in the window form of the first referee's E1, with
one new correction to constants (N1) and the source status of Turan's theorem recorded in section 3.**

## 1. Main lemmas re-derived

- Theorem B. The transform of F_u on the real line is pi (1 - abs(xi)/u)_+; that of x -> F_u(x + ib) is
  pi (1 - abs(xi)/u)_+ e^(-b xi) (contour shift; F_u entire of exponential type u, O(x^-2)). Poisson summation
  with period d and the conjugate term give (B). PROVED. (B2): at v_1 = u/2 the minimum is
  -(L'/2)(cosh(b L'/2) - 1), and G >= -M gives b <= (4/L') sqrt(M/L') to leading order. Confirmed.
- Lemma T. Step 1: for one ordinate zeta,
  int F_u(tau - zeta) B(tau - t) e^(i v_0 (tau - t)) d tau = pi e^(i v_0 (zeta - t)) [(1 - v_0/u) B(zeta - t) + B_1(zeta - t)/u]
  when delta < v_0 < u - delta (the Fejer weight is linear on the support of bhat); the other half of the cosine
  gives the term of (T1). Step 2: u S_u - u_1 S_(u_1) = pi (u - u_1) T(v_0), and
  abs T <= (u + u_1)(M + D)/(pi (u - u_1)) = (2 - kappa)(M + D)/(pi kappa). Step 3: with z_j =
  exp((b_j - b_1 - i(gamma_j - t)) h), h = V/(2n), m = n, the theorem of section 3 gives nu in [n + 1, 2n], so
  v = nu h in (V/2, V], and abs T_big(v) >= e^(b_1 v) 2 (16 e)^(-n) min abs(partial sums). (T) follows. PROVED
  given the classical theorem.
- Lemma R. abs E <= u (cosh(ub) - 1) is immediate. Second bound: two integrations by parts with
  phi(0) = phi(u) = 0, phi'(0) = 0. The lane bounds int abs(phi'') by (2/u)(cosh(ub) - 1) + b sinh(ub); the exact
  value of the second part is (cosh(ub) - 1)/u, so abs E <= 8 (cosh(ub) - 1)/(u y^2) also holds (sharper).
  PROVED.

## 2. Checks

| check | result |
|---|---|
| rerun of the lane's `ref_checks.py` (copy) | stored values reproduced: (T2) 3.1e-31; Lemma R ratio 0.2564; Turan trials smallest ratio 10.87 |
| Theorem B, five (d, b, u, y) not used by the lane (0 to 4 harmonics; d from 0.5 to 2.9; b up to 0.49), rows of 800,001 pairs | differences 1.3e-7 to 2.9e-6, each below the tail scale 4 cosh(ub)/(u d^2 J) of the truncation |
| Lemma R, 400 random (u, b, y), mpmath quadrature | largest abs E/bound: 0.254 (lane's bound), 0.318 (the bound 8 (cosh(ub) - 1)/(u y^2)) |
| minimum of Re (sin w/w)^2 on abs w <= 1/2 | 0.91940 (at w = 1/2), so 2 x 0.9194/(2 pi) = 0.2927 >= 0.29 |
| Turan's inequality in the form of section 3: 60,000 trials (n = 2 to 6; m in {0, 1, n, 3n}; nodes on the circle, near roots of unity of order m + n + 1, and inside the disc; random and equal coefficients) | smallest ratio left/right 78.7; no counterexample |

## 3. Source check: Turan's second main theorem (generic search terms only)

Form used by the lane: 1 = abs z_1 >= ... >= abs z_n; for every integer m >= 0 there is nu in [m + 1, m + n] with
abs(sum b_j z_j^nu) >= 2 (n/(8e(m + n)))^n min_j abs(b_1 + ... + b_j).
Found: the encyclopedia article "Turan's method" (Wikipedia) states the second result with the nodes ordered
in decreasing absolute value and scaled to abs z_1 = 1, and the bound 2 (N/(8e(M + N)))^N times the minimum over
j of the modulus of the partial sums b_1 + ... + b_j; its references are Montgomery, Ten Lectures (1994), and
Turan, On a New Method of Analysis and its Applications (1984). This agrees with the lane's form in ordering,
normalisation, constant 8e and the partial-sum minimum. The article states the range M + 1 <= nu <= M + N in its
first result; the extracted text of the second result did not show the range. Status: the constant and the
form are confirmed against a secondary source that cites the two primary ones; the primary sources were not
opened by any pass (the Encyclopedia of Mathematics page was not reachable). Lemma T stays "PROVED given a
CLASSICAL theorem, form confirmed at secondary level".

## 4. Sentences false as written

1. (new, N1) The coefficient of the logarithmic term. From (T), b_1 <= (2/V)[n log(16e) + log(X/(0.29 delta))]
   with V = (1 - kappa) u - delta; for bounded M the bracket contains log log t and for M = C log^2 t it contains
   2 log log t. In the form "/(theta log gamma)" the coefficient is 2/(1 - kappa) and 4/(1 - kappa): larger
   than 2 and 4 for every kappa. So these sentences understate it:
   - Remark (ii): "A hypothesis with M = log^2 t changes it to 3 log log t" (bracket term: 2 log log t);
   - Remark (iii) and section 3, first bullet: "b <= (c + log log t + log(M + 1))/(theta log t)" (coefficient
     2/(1 - kappa), as in the header item 3, which has 4 at kappa = 1/2 and is correct);
   - section 3, last paragraph: "b <= (c_1 n + 3 log log gamma + c_2)/(theta log gamma)" (coefficient
     4/(1 - kappa) > 4).
   The header item 8 form "(c n + O(log log gamma))/(theta log gamma)" is correct. Nothing else changes.
2. (first referee E4 (b); confirmed) "Re B(z) >= 0.91 delta/(2 pi)" with "0.29 delta": 2 x 0.91/(2 pi) = 0.2897.
   The constant 0.29 holds because the true minimum is 0.9194.
3. (first referee E1; confirmed by the re-derivation of Theorem B) the header sentence "no bound follows" /
   "no region at all for rows of spacing below 2 pi/(theta log gamma)" is a window statement: a row with fixed
   spacing fails C(theta) at large height.
4. (first referee E4 (a)) Lemma T needs V > 2 delta.

## 5. Requirement flags

No change: R1 = R2 = R3 = R4 = false. No statement about zeros of zeta.

## 6. Not covered by this pass

The server tables of section 4 (clusters, rows, ball rows) were not rerun; the prime-side controls of section 5
were not rerun.
