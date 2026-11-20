# REFEREE: c10-thin-deletion-zero-mode-control (lens: general, adversarial)

Date 2026-11-18. Referee pass 1 of this lane. Only this file was written. The server was not used.
One local numeric run through `scripts/memcap.sh 8` (script kept outside the repo, /tmp/c10ref/chk.py; float64,
independent code, no reuse of `del_control.py`).

## Verdict

**Holds, with corrections E1 to E6 below.** The claimed verdict (partial result: a control, not an attack,
nothing about zeros of zeta) is confirmed. Lemma 1 is confirmed relative to the short-interval statement S(theta),
after a two-line repair of Lemma 0 (E1). Lemmas N, I, C are confirmed as stated in section 1; the summary wording
of Lemma C in the verdict list is too wide (E2). The Tier E derivation is confirmed step by step relative to the
two cited explicit bounds, which I did not open (E4).

Requirement flags, set by this referee: R1 = false, R2 = false, R3 = false, R4 = false. The lane contains no
argument about zeta; it adds a control.

## 1. Re-derivation of the PROVED steps

**Greedy rule.** floor(L(p_n)) is non-decreasing and c_{n-1} <= floor(L(p_{n-1})), so c_n is c_{n-1} or
c_{n-1} + 1, and c_n = n + min(0, min_{k<=n}(floor L(p_k) - k)). Confirmed. L(2) = 0, so 2 is not in S and
D(2) = 0. Confirmed.

**Range form H(theta').** The tiling argument is correct for x^theta' <= h <= x: tile start points lie in
[x, 2x], tile lengths are at most (2x)^theta, the uncovered part is at most (2x)^theta <= h/2 for large x.
Confirmed.

**Lemma 0.** Upper bound D <= 0: confirmed. Reduction D(y) >= -1 - B(p_k, y): confirmed (floor costs 1; the
case "minimum 0" means every prime up to p_n is in S, which stops once L < pi). L(y) - L(x) <=
(y - x) x^(b-1)/log x: confirmed (t^(b-1)/log t decreases for t > 1).
**Gap (E1).** The step "if y - x >= x^theta' and x >= x_1 then pi(y) - pi(x) >= c'(y - x)/log x" is covered by
H(theta') only for y - x <= x. Here x = p_k is fixed by the minimum and y is arbitrary, so y > 2x occurs, and
for y > x^(1/c') the displayed inequality is false as written (pi(y) - pi(x) ~ y/log y). Repair: B is additive,
B(x, y) = B(x, z) + B(z, y). Split [x, y] at 2x, 4x, ..., 2^j x <= y < 2^(j+1) x. Each full piece [z, 2z] has
B <= 0 by the stated argument (h = z). The last piece [2^j x, y] has B <= 0 if its length is at least
(2^j x)^theta', and B <= (2^j x)^(theta'+b-1) <= max(1, y^(b-eta)) otherwise. The conclusion
-C x^(b-eta) <= D(x) <= 0 stands. With this repair Lemma 0 is confirmed relative to S(theta).

**Lemma 1.**
(i) int_2^inf x^-s dL = int_{log 2}^inf e^(-(s-b)u) du/u = E_1((s - b) log 2); the D part by parts with
D(2) = 0. Confirmed.
(ii) log G = -P_S + T with T = sum_{p in S}[log(1 - p^-s) + p^-s], locally uniformly convergent for
Re s > b/2 because sum_{p in S} p^(-2 sigma) converges for 2 sigma > b; exp(-E_1(w)) = e^gamma w exp(-Ein(w)).
Confirmed. W is an exponential of an analytic function on Re s > max(b - eta, b/2): no zero. Confirmed.
(iii) Simple zero at b needs zeta(b) finite and non-zero and W(b) non-zero: confirmed. Pole and residue
confirmed. The sentence "its zeros there are the zeros of zeta and a simple zero at b" is correct and includes
any zeros of zeta in the strip max(b - eta, b/2) < Re s < 1.
(iv) Confirmed by construction. (v) Confirmed (a = 1 * g, standard). (vi) Confirmed (1/F = sum mu(n) a(n) n^-s
has a pole at b).

**Lemma N.** Confirmed (a(q') = 0 for a prime q' iff q' in S; Dirichlet against relative density zero).
**Lemma I.** Confirmed; it is a one-line observation.
**Lemma C.** Confirmed as stated in section 1: for sigma > b, abs(G(sigma + i tau)) >= G(sigma) because the
coefficients of -log G are non-negative. Numeric spot check below.

**Evaluation formulas (2.2).** A_X: re-derived by parts; the bracket equals E_1((s-b) log 2) -
E_1((s-b) log X). Confirmed. Tail of T from D <= 0 only: confirmed (abs(log(1 - t) + t) <= t^2/(2(1 - t)), sign
of T - T_X is non-positive). Tier 0 (R_X <= 0 for real s > b): confirmed.

**Tier E derivation.** D(y) >= min(D(X), -1) - sup_{X<=x<=y} B(x, y)^+ : confirmed (both cases of the position
of the minimising index). B <= x^(b-1) M and B <= x^(b-1) M - M + 2e(y); the convex combination with weights
1 - x^(b-1), x^(b-1) gives exactly 2 e(y) x^(b-1): confirmed by expansion. Near case x >= y/2: factor 2^(2-b)
confirmed. Far case: M >= y/(2 log y), condition 4 e(y) log y/y < 1 - X^(b-1); I recomputed both conditions by
hand: 0.0632 against 5.03 and 6.17 (Buthe form at y = 2X), 0.154 against 0.800 and 0.982 (Trudgian form at
y = Y); both left sides decrease. Confirmed. J_1 is the exact integral of sqrt(y) log y/(8 pi) y^-2 over [X, Y]
(4.559e-4 recomputed by hand); J_2 by the substitution v = sqrt(u/6.455) is 0.2795 * 2 * 6.455^(1/4) *
Gamma(1/2, v_0): confirmed. Bound 0.04135 at b = 0.75 recomputed by hand. The use of y^(b-1-s-1) <= y^-2 needs
s >= b: stated. The existence of the one-sided limit W(b) follows from the Tier E majorant (dominated
convergence) and does not need S(theta). Confirmed relative to (E1), (E2) of the result.

## 2. Numeric rerun with a different case

Independent float64 code (numpy sieve, Ei by power series, greedy rule, the formula of 2.2), new case b = 0.8,
X = 3e6, and a replay of b = 0.75, X = 1e7.

| case | size of S | first elements | inf D | W_X(b) at 1e5 / 1e6 / top | exponent |
|---|---|---|---|---|---|
| b = 0.8, density 1, X = 3e6 | 14,055 | 5, 7, 11, 13, 17, 23, 29, 37, 41, 53 | -2.057 | 1.980748 / 1.980834 / 1.980844 | 0.999988 |
| b = 0.8, density 1/2, X = 3e6 | 7,027 | 5, 11, 23, 37, 53 | -1.309 | 1.379009 / 1.379068 / 1.379075 (prefactor to the power 1/2) | 0.500084 |
| b = 0.75, density 1, X = 1e7 (replay) | 16,210 | 5, 7, 11, 13, 19, 29, 37, 41, 53, 67 | -1.9426 | 1.8782156 / 1.8783483 / 1.8783716 | 0.9999820 |

The replay agrees with the lane (size 16,210; D(X) = -0.42854; W_X = 1.87837; exponent 0.999982; G_X(b) =
0.065432). The new case shows the same behaviour: W_X(b) increases with X and stabilises (consistent with
R_X <= 0), exponent one at density one and one half at density one half. Floor decisions in my run are float64;
the smallest distance of L(p) to an integer was 1.7e-6 (b = 0.8) and 2.4e-8 (b = 0.75), far above the float
error, and the set sizes agree with the ball run.

Lemma C spot check (b = 0.8, G_X, tau = 1, 3.7, 14.134725, sigma = 0.81 and 1.0): abs(G_X(sigma + i tau)) =
1.666, 0.820, 1.547 and 1.427, 0.850, 1.366 against G_X(sigma) = 0.0856 and 0.3455. The inequality holds in all
six cases.

Device table count: 7 + 1 + 2 + 4 = 14 rows whose first code is P, and 12 + 4 + 2 + 1 + 1 = 20 rows whose first
code is NF or FAIL. The stated 14 / 20 matches the table. The cells themselves are ARGUED and were not checked
here beyond row 1 (G and 1/G bounded on Re s >= b + delta: correct).

## 3. Controls, RH, verified height, novelty

- No zeta-only mechanism is claimed, so there is no control run to make against an attack. The lane is itself a
  control. Its own checks (finite stages positive, half density gives a branch, empty S gives zeta) are consistent
  with my rerun.
- Nothing assumes RH. Tier E uses Buthe's bound, whose range depends on a numerical verification height. This is
  disclosed, it enters only the numerical enclosure of the constant W(b), and no statement about zeros of zeta is
  drawn from it. Lemma 1 does not use it.
- Novelty: the lane does not present Lemma 1 as a new theorem; it states "new relative to the map". That is the
  correct level. Prescribing a zero by a thin set of deleted primes with regular counting function is a standard
  Beurling-type construction (the sub-semigroup of the integers generated by the primes outside S). The record
  should say "standard construction, written out here", not more.

## 4. Errors and corrections

- **E1 (gap, repaired above).** Lemma 0, lower bound: the case y - x > x is outside H(theta') and the displayed
  inequality with 1/log x fails for y > x^(1/c'). Use additivity of B and a dyadic split. Conclusion unchanged.
- **E2 (wording too wide).** Verdict item 6 and the comparison table say that for a deletion product a zero on
  Re s = b at height tau != 0 comes with a real zero at b. Lemma C proves this for zeros of G only. F = zeta G
  also vanishes at any zero of zeta on Re s = b, and no unconditional theorem excludes such zeros for b in
  (1/2, 1). Correct text: "a zero of the deleted factor G". Section 6 item 6 already has the right form.
- **E3 (wording).** Verdict item 2, "no continuation across b" at half density: F = zeta (s - b)^(1/2) W_half
  continues analytically along every path avoiding b in Re s > sigma_1; what fails is a single-valued continuation
  to a punctured neighbourhood of b. "Branch point of order two at b" is the exact statement.
- **E4 (citations not confirmed by this referee).** (a) Huxley 1972 gives the asymptotic for every theta > 7/12,
  not at theta = 7/12; harmless, since only one theta < 1 is used. (b) I did not open Buthe (arXiv:1410.7015) or
  Trudgian (arXiv:1401.2689). The forms quoted match my recollection of both. Trudgian's bound has been
  superseded (Platt-Trudgian 2021; Johnston-Yang 2023); a second reader should confirm that the 2016 Theorem 2
  stands as printed or replace it by the later bound. Only J_2, that is the width of the Tier E interval,
  depends on it. (c) The Platt-Trudgian height 3e12 is RECALLED in the lane and in this file.
- **E5 (scope of a sentence).** 2.4(b), "an explicit form of a Hoheisel-type theorem ... none is on file here":
  correct as a statement about the repo. Explicit short-interval results exist in the literature in the form
  "at least one prime" (for very large x); the lemma needs the counting form, so they would not close 2.4(b) as
  they stand. The sentence should keep the words "on file here".
- **E6 (record hygiene).** `STATEMENT_O.md` differs from the c9 copy in eleven hunks: the header paragraph, the
  control list (old line 21), and the blocks of lines 1 and 5. The control-list edit is not mentioned in section
  4 of the result. Also the c9 file `c9-obstruction-record-statement/STATEMENT_O.md` was changed by another lane
  (22:22, after the copy at 22:17), so the rewritten lines 1 and 5 must be merged into the current c9 text, not
  substituted for the whole file.
- **Not an error, for the record.** The lane's `lanes_line.json` "lesson" says THIN and DEL "cover every
  degree-one Euler-product read set without FE or periodicity". Lemma I supports only the narrower statement in
  section 1 (read sets described by the two codes POS and GEOM). Local parameters with 0 < abs(a(p)) < 1 are not
  covered by either control. Keep the section 1 wording.
- **Loose check.** 2.5: the count ratio 0.1443 (b = 0.9, N = 20000) lies below the interval [0.14504, 0.15788]
  for G(1). This is not a contradiction (the error term is O(N^(b-1+eps)), about 0.37 at this N), but the check
  has no discriminating power at b = 0.9.

## 5. What survives

1. Lemma 1 with the repaired Lemma 0, relative to S(theta) (one theta < 1, counting form): DEL_b has
   Lambda_F >= 0, coefficients 0 or 1, a simple pole at 1, continuation to Re s > max(b - eta, b/2), and
   F = zeta (s - b) W with W non-vanishing there. One referee (this file).
2. The correction of the assignment: density one gives a simple zero; density one half gives a square-root
   branch point. Confirmed by proof (exponent m in exp(-m E_1)) and by an independent run at b = 0.8.
3. Lemma N, Lemma I, Lemma C (for G).
4. Tier 0 lower bounds for W(b) (from D <= 0 and the built set). Tier E enclosures of W(b) and F'(b+) relative
   to the two cited explicit bounds; derivation confirmed, sources not opened by this referee.
5. The statement that finite data do not enclose the zero.
6. The device table as an ARGUED read; count 14 / 20 confirmed against the table.

## 6. Flags

| flag | value | reason |
|---|---|---|
| R1 | false | no argument about zeta |
| R2 | false | no conclusion in windows or uniform in height |
| R3 | false | no device that fails for controls; the lane adds a control |
| R4 | false | no passage to the critical line |

holds = true (with E1 to E6). aboutZeros = false.
