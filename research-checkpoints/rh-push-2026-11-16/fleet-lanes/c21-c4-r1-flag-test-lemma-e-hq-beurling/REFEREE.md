# REFEREE (independent pass, lens: general): c21-c4-r1-flag-test-lemma-e-hq-beurling

Date: 2026-11-20. Written by a separate agent. The earlier content of this file (the lane's own second derivation,
same agent) is kept unchanged as the appendix below; it is not an independent pass and this section does not rely on it.

Outcome: **holds, with corrections E1 to E4.** Verdict precise-obstruction confirmed as a flag test. Nothing in the
result is a statement about zeros of zeta; RH is not assumed; no verified-height statement is used; no bound moves.
Flags set by this referee: R1 = false, R2 = false, R3 = false, R4 = false.

## 1. Steps re-derived (by hand, independently)

1. A exists for every F with f(1) = 1 and f polynomially bounded: F = 1 + X, abs(X) < 1 for Re s large,
   log F = sum (-1)^(k+1) X^k/k is an absolutely convergent Dirichlet series there. Confirmed. The sentences quoted
   from c4 RESULT section 2 (a) ("without an Euler product there is no A") and c4 REFEREE line 55 ("without it A
   does not exist") are in those files as quoted and are false as written.
2. l_f(6) = f(6) - f(2)f(3) (terms k = 1, 2 of the log series). For DH (1, xi, -xi, -1, 0): l(6) = 1 + xi^2,
   a_6 = -(1 + xi^2) = -1.0807009031493. Confirmed.
3. V6. With n = 6^k m, 6 not dividing m: F = zeta(s)(1 - 6^-s)/(1 + 6^-s); log F - log zeta = -2 sum_{k odd} 6^(-ks)/k;
   a_(6^k) = 2/k for k odd, 0 elsewhere; density sum_k (-1)^k 6^-k (5/6) = 5/7, error O(log x); f(6) - f(2)f(3) = -2.
   Theorem 1 of c4 for V6: theta = 0+, c = 5/7, the extra factor has zeros and poles only on Re s = 0, no real zero
   of F in (0, 1), sigma_0 = theta, and ord_F = ord_zeta on Re s > 0. Every step (a) to (d) of the c4 proof runs
   for V6 unchanged. Confirmed.
4. Lemma 1 (i). a_(p^k) = (1 - Re alpha_p^k)/k; the pigeonhole step for abs(alpha_p) > 1 is correct (also for
   rational phi/2 pi). Confirmed.
5. Lemma 1 (ii), instances. HQ1: a_q = -eps q^(1/2). HQ3: c_k = 2 cosh(kB log q) - 2 cosh(kA log q) > 0 for
   B > A > 0. HQ4: c_k = 2 cosh(kB log q) - (-1)^k 2 cosh(kA log q) > 0. Normalised T-NR: 1 + cu + u^2 =
   (1 - gu)(1 - u/g), g + 1/g = -c, a_(q^k) = (g^k + g^-k) q^(k/2)/k, negative at k = 1 iff c > 2. E_a:
   a_p = 1 - p^a - p^-a < 0. zeta(s+it)zeta(s-it): a_(p^k) = (1 - 2 cos(k t log p))/k, negative for some p, k.
   Confirmed for the listed instances. The general sentence is wrong: see E1.
6. Lemma 1 (iii) is the splitting of log F by support (prime powers / the rest); F_0 = exp(prime-power part) is
   multiplicative. Confirmed. P3: -log(1 - Y), Y = sum_{n>=2} n^-w, has positive coefficients; a_n > 0 at every
   n >= 2; partial sums sum_d g(d) floor(x/d) = (2 - zeta(2 - b)) x + O(x^b). Confirmed.
7. Theorem 1'. Re-derived in full. H is meromorphic on Re s > theta; real, analytic and non-zero at real points
   right of sigma_0 (H(1) = abs(c)^2); sigma_0 is well defined (real zeros are isolated, bounded since F -> 1, and
   cannot accumulate at the pole); the branch of -(1/2) log H on a simply connected neighbourhood of the ray
   continues A; Landau gives abscissa of A <= sigma_0; exp(-2A) = H on Re s > sigma_0. One line is missing in the
   RESULT and holds: theta >= 0 necessarily (S(x) is constant between integers while cx moves by c), so the real ray
   lies in (0, inf), where zeta is real and non-zero away from its pole. Confirmed. See E3 for its status.
8. Checks of Theorem 1' on T-NR normalised, c = -2.5, q = 2 (partial sums c' x + O(1), c' = 1.5 - 2.5/sqrt 2 != 0,
   zero at s = 3/2 = sigma_0 = abscissa of A) and c = +2.5 (zeros on Re s = 3/2 at odd multiples of pi i/log 2, no
   real zero, conclusion false, H(a) false at k = 1). Confirmed by hand.

## 2. Numeric rerun, different cases and a third method

Local, `scripts/memcap.sh 8`, about 5 s, below 20 MB; scripts kept outside the lane directory (`/tmp/ref-c21/`).

Exact rationals, N = 7776 = 6^5 (the lane stopped at 1296), log coefficients by the recursion
Omega(n) f(n) = sum_{d|n} Omega(d) l(d) f(n/d) (neither the lane's log n recursion nor its power-series method):

- V6: a_6 = 2, a_216 = 2/3, a_7776 = 2/5, every other a_n = 0, no negative value; max abs(S(n) - 5n/7) = 4.2857.
- V10, V12 (new cases, non-multiplicative): pass; a_g = 2, a_(g^3) = 2/3; c = (g - 1)/(g + 1).
- zeta: a = 0 identically (sanity).

mpmath, 30 digits, N = 2000:

| case (not in the lane's runs) | result | closed form |
|---|---|---|
| DH | a_6 = -1.0807009031493; 316 negative a_n on n <= 2000 | -(1 + xi^2), equal to 14 digits |
| period 5, (1, t, -t, -1, 0), t = 0.9 | a_6 = -1.81 | -(1 + t^2) |
| HQ1, q = 3, eps = 0.5 | a_3 = -0.86602540378444 | -eps sqrt 3 |
| T-NR normalised, q = 3, c = 3 / -3 | a_3 = -5.1961524227 (fails) / +5.1961524227 (0 negatives) | -c sqrt 3 |
| E_a, a = 0.35 | a_2 = -1.059144725216 | 1 - 2^a - 2^-a |
| P3, b = 0.3 | 0 negatives, min a_n = 0.00489; c = 2 - zeta(1.7) = -0.0542888; real zero of F at 1.0286472390 (right of 1); max abs(S(n) - cn)/n^b = 2.98; f(6) - f(2)f(3) = -0.5706; H = exp(-2A) at s = 9 to 1.6e-28 | as derived |

All agree with the RESULT's formulas. The controls named in the claim (DH, HQ1, T-NR, E_a) were run by this
referee; the lane claims no zeta-only mechanism, so there is no mechanism whose failure on controls needs checking.

## 3. Errors and corrections

E1 (wording of Lemma 1 (ii); does not affect the verdict). The sentence "This fails ... for a pole of the local
factor with a parameter of modulus > 1" is false as a general statement. Counterexample:
F = zeta(s)(1 - 3 * 2^-s)/(1 - 2 * 2^-s) is multiplicative, has a local pole with parameter 2, and satisfies H(a):
a_(2^k) = (3^k - 2^k)/k > 0 (exact check, n <= 7776: a_2 = 1, a_4 = 5/2, a_8 = 19/3, no negative value). The
sentence is true for the listed instances (HQ1 to HQ4, G_q, E_a), where the pole parameter is not dominated by a
zero parameter. It should read as a list of instances, not as a criterion.

E2 (count in clause 2; does not affect the verdict). "Eight multiplicative controls on file fail" overstates what
is on file unaltered. T-NR and NR-q on file have the factor q^(s-1/2) + c + q^(1/2-s); H(a) is not posable for
them (the RESULT says so in its table) and the failing objects are the lane's u-normalised versions. G_q is HQ1 at
one value of eps. Unaltered and distinct on file: HQ1, HQ2, HQ3, HQ4, E_a (five; six counting G_q). Clause 2 fails
with any of these counts. All of them fail by size (a local parameter of modulus > 1 in the n^-s normalisation),
which lies outside the hypothesis class of c4 Theorem 1; the RESULT states this under "narrow reading".

E3 (status of Theorem 1'). Theorem 1' is correct, but H(a) is the output of step (a) taken as a hypothesis, and
steps (b) to (d) are Landau's theorem. It is a restatement of c4 Theorem 1 with its hypothesis replaced by what
the proof uses; it is not a new theorem and should be recorded as "c4 Theorem 1, hypothesis weakened to H(a)".
The RESULT does not claim novelty; the record should not either.

E4 (scope of "members with real zeros in the strip"). The non-multiplicative member exhibited with a real zero in
the strip is P3 (b = 0.1, zero at 0.8286472390), which is not unimodular (f(n) = 1 - sum_{d|n, d>1} d^(b-1)).
The unimodular non-multiplicative member V6 has sigma_0 = theta and no extra zero in Re s > 0. A unimodular
non-multiplicative member with a real zero in the strip is THIN x V6, whose zero is the THIN zero of the c4 lane
(MEASURED there, not re-run here or by this referee). The headline sentence is correct for the class L; it should
not be read as a statement about unimodular members without that qualification.

Minor: the DH count "461 negative a_n" (n <= 3000) was not reproduced at that N (316 on n <= 2000, consistent).
The JSON label for the Lemma E stage N0 = 5 is wrong and corrected in the RESULT table, as the lane noted.

## 4. Decision on the flag under test

The decision does not depend on the reading of clause 2. V6 is unimodular, has c = 5/7 and theta = 0+, is not
multiplicative, satisfies step (a) exactly, and the c4 proof and conclusion hold for it. So step (a) of c4
Theorem 1 does not have multiplicativity as an essential input: multiplicativity is neither necessary (V6, V10,
V12, P1 to P3) nor sufficient (HQ1 to HQ4, E_a) for H(a). The R1 flag of `c4-helson-discrepancy-zerofree` is
rejected by this file. Whether the headline becomes 0 of 4 is for the learn step under its rule (a flag rejected
by a referee file is not counted); this referee did not edit the scoreboard.

## 5. Flags (this lane), set strictly

- R1 false: the result shows the tested step does not use multiplicativity; it establishes no step that does.
- R2 false: no every-window or height-uniform statement about zeta.
- R3 false: Theorem 1' holds for THIN, DEL, V6, P1, P3 and Beurling members relative to their own zeta function.
- R4 false: not attacked.

---

# Appendix: the lane's own second derivation (same agent; kept unchanged)

# REFEREE: c21-c4-r1-flag-test-lemma-e-hq-beurling

Date: 2026-11-20. Status of this file: second derivation by the same agent with different methods (no separate
agent was available to this lane). It is not an independent referee pass on this lane's new statements; it is the
second file on the R1 flag of `c4-helson-discrepancy-zerofree`, written by a lane other than that lane and its
referee. Outcome: **holds** (the flag is rejected; Lemma 1, Theorem 1' and the table re-derived).

## 1. Re-derivations

- Existence of A. For f(1) = 1 and polynomially bounded f, F = 1 + X with abs(X) < 1 for Re s large, and
  log F = sum (-1)^(k+1) X^k/k is a Dirichlet series. So A = log zeta - Re-part of log F exists for every such F.
  The statement "without an Euler product there is no A" is false. Confirmed by computing A for DH (a_6 =
  -1.0807009031 = -(f(6) - f(2)f(3)); coefficient of 6^-s in log(1 + X) is f(6) - f(2)f(3) by the k = 2 term).
- V6. sum_{n} (-1)^(v_6(n)) n^-s: write n = 6^k m with 6 not dividing m; the sum is
  (sum_k (-1)^k 6^(-ks)) zeta(s)(1 - 6^-s) = zeta(s)(1 - 6^-s)/(1 + 6^-s). log((1 + x)/(1 - x)) = 2 sum_{k odd} x^k/k.
  EXACT check with Fractions by the series method (not the recursion of `ha_test.py`): a_(6^k) = 2/k for k odd,
  all other a_n = 0, n <= 1296. Partial sums: sum over k of 2 (-1)^k floor(x/6^k) + floor(x) = (5/7) x + O(log x);
  EXACT max deviation 2.857 on n <= 1296. Not multiplicative: f(6) - f(2)f(3) = -2.
- Lemma 1 (i). abs(alpha) > 1: k with distance of k phi/2 pi to the integers below 1/6 occur infinitely often
  (pigeonhole), giving Re alpha^k >= r^k/2. Confirmed; instance alpha_3 = 1.2 e^(i pi/3): k = 5 gives
  (1 - 1.2^5/2)/5 = -0.048832, matching the run.
- Lemma 1 (ii) instances by hand: HQ1 -log(1 + eps u/(1-u)^2) = -eps u + O(u^2); HQ2 -eps u^2 + ...; HQ3 and HQ4
  log m = sum c_k u^k/k with c_k > 0; T-NR 1 + c u + u^2 = (1 - g u)(1 - u/g), g + 1/g = -c, -log = sum (g^k + g^-k) u^k/k,
  positive iff g > 0 iff c < -2; E_a: l(p) = p^a + p^-a > 1. All agree with the table.
- Theorem 1'. The only place the c4 proof used abs(chi) = 1 beyond the sign of a_n is convergence of A on
  Re s > 1 (to get H > 0 on the real ray right of 1). In the class L this is replaced by: H is real on the real
  ray, analytic and non-zero at real points that are not zeros of F (H(1) = abs(c)^2), and positive right of the
  abscissa of A, hence positive on the connected set (sigma_0, inf). Landau then applies as before. Checked on the
  T-NR member with c = -2.5 (abscissa of A = 3/2 = sigma_0; closed form against exp(-2A) at s = 2: 1.8e-30).
- P3. -log(1 - Y) with Y = zeta(w) - 1 = sum_{n>=2} n^-w: all coefficients positive. Partial sums:
  sum_d g(d) floor(x/d), g(d) = -d^(b-1): c x + O(x^b), c = 2 - zeta(2 - b). Zero of 2 - zeta(w) at
  w = 1.72864723899818361814; right of it abs(zeta(w) - 1) <= zeta(Re w) - 1 < 1.

## 2. Numeric rerun, different method and cases (`referee_check.py`, exact Fractions, N = 1296)

V6, V30, Liouville, deletion of p = 3: pass, with the closed-form coefficients. zeta - 2 * 6^-s: fails at 12, 18,
30 (a = -2). Rational DH-shaped periodic function (1, 1/4, -1/4, -1, 0): a_6 = -17/16 = -(f(6) - f(2)f(3)).
zeta^2: a_p = -1 at every prime. Closed forms against exp(-2A) at complex points: 2.6e-31 to 1.8e-30.

## 3. Errors and limits found

1. `ha_test.py` labels the Lemma E stage N0 = 5 "multiplicative_claimed: false"; the object is multiplicative
   (defect 5e-32). Corrected in the RESULT table; the JSON keeps the script's label.
2. The T-NR and NR-q rows concern the series normalised by u. For the un-normalised objects H(a) is not posable.
   The c20 instance (q = 2, c = 2.5) has its factor zeros on Re s = 3/2, outside the strip; the sign statement
   (fails for c > 2, passes for c < -2) is for all abs(c) > 2.
3. The findroot attempts for non-real zeros of 2 - zeta(w) returned one zero with Re w < 0 and three failures;
   nothing is claimed from them.
4. A draft count of "nine multiplicative controls" included the degree-2 unimodular product, which was added by this lane
   and is not a control on file under that name (E_a is). On file: eight.

## 4. Flags set by this file

For this lane: R1 false, R2 false, R3 false, R4 false. For `c4-helson-discrepancy-zerofree`: R1 rejected
(step (a) holds for the non-multiplicative unimodular V6 and fails for eight multiplicative controls on file);
R2, R3, R4 false as before. No statement about zeros of zeta.
