# REFEREE.md: c15-u5-window-count-threshold-translate-control

## Independent referee report (2026-11-19, lens: general)

Written by a separate agent that did not author RESULT.md. Own code, run in a scratch directory outside the lane
(mpmath 30 to 34 digits; one rerun of `contig.py` with a new seed; all through `scripts/memcap.sh 8`; no server use).
The same-session audit of the author is kept unchanged below this report.

**Outcome: the verdict (precise obstruction, outcome (a), no statement about zeros of zeta) HOLDS, with one correction to
the sharpness statement of Lemma 1 and three wording corrections. Flags: R1 false, R2 false, R3 false, R4 false.**

### Steps re-derived

1. Translate identity. With `u = t + alpha`: `conj zeta(1/2 + iu) = zeta(1/2 - iu) = e^(2i theta(u)) zeta(1/2 + iu)`, and
   `chi(1/2 + it) = e^(-2i theta(t))`, so `F - chi conj F = F (1 - e^(i Psi))`. CONFIRMED. Numerically at three new points
   (t = 20011.3, alpha = 0.7791; t = 54321.7, alpha = -1.234; t = 20011.3, alpha = -40022.1): `|lhs - rhs| <= 6e-26` at 30 digits.
2. Lemma 1 (a). `d Psi/d alpha = 2 theta'(t + alpha) > 0`, `d Psi/dt = log(1 + alpha/t) + O(alpha t^-3) > 0` for alpha > 0;
   the midpoint choice gives `|Psi - 2 pi| <= (Psi(b) - Psi(a))/2 <= alpha L/(2a)`. CONFIRMED to leading order.
3. Lemma 1 (b), as stated in section 2 (hypothesis `|alpha| <= a/2`). CONFIRMED to leading order.
4. Lemma 2, existence. With `Q = ceil(4 pi/min(eta, eps))` the Dirichlet step gives `2 pi/Q <= eta/2`; the condition
   `a >= (2.1/eta) Q^n (L + Q^n)` gives `alpha^2/(2a) + alpha L/a <= eta/2.1`; total `0.976 eta`. CONFIRMED. The size
   statement is a heuristic, labelled as such.
5. Lemma 4. Harmonic measure of the complement `(2/pi) arctan(2 delta/L) <= 4 delta/(pi L)`; D is bounded and analytic in
   `Re s > 1/2`; `B <= 2 A sqrt(N_D)`. CONFIRMED. It is the classical two-constants estimate, which the RESULT says; it is
   not presented as new.
6. Section 5 identity `F - chi conj F = +-(1/2) zeta(s + i alpha)(1 - e^(i Psi))` and `e^(i theta) F_+- = (Z(t) -+ Z(t + alpha))/2`
   up to `O(eta)`. CONFIRMED. `|a(4) - a(2)^2| = |1 - w|^2/4` (plus), `|1 - w||1 + 3w|/4` (minus), `w = 2^(-i alpha)`:
   0.0327, 0.0498, 0.0846 and 0.438, 0.563. CONFIRMED.

### Numeric checks rerun with different cases

- Span law at new (a, L): (3.3e7, 40), (2.5e5, 7), (7e9, 3000), (2e4, 1): sup defect over formula `pi L/(a log(a/2 pi))` =
  1.00000, 0.99998, 1.00000, 0.99995. CONFIRMED.
- Combination zeros re-solved (30 digits, winding number on a circle of radius 0.01, 48 points):
  plus sign, `0.621429640873306 + 1003003.29507648 i`, `|F| = 2.8e-26`, winding 1.0, `|zeta|` there 0.43;
  minus sign, `0.894706598618937 + 10084.7783526514 i`, `|F| = 3.5e-29`, winding 1.0;
  minus sign, `2.41904837689261 + 100330.928244123 i`, `|F| = 5.0e-29`, winding 1.0. CONFIRMED as instances.
- Free-prime family, new seed (T = 1e5, seed 7, K up to 64, `contig.py` unchanged): rank at 1e-5 = 24, 26, 27, 29, 32, 38, 48
  (identical to the table); scores 2.4e-7, 1.4e-10, 5.1e-10, 4.7e-9, 5.9e-8, 1.5e-7, 8.3e-6 for K = 1 .. 64, so the largest
  K passed is 32 (off-grid 7.5e-7), inside the reported range 16 to 32. K = 1 passes on the design grid only (off-grid
  1.1e-5), which matches the caveat in section 4. Distance to translates 0.45 to 0.81. Non-multiplicative score 6e-11 to
  1.2e-10. CONFIRMED (same model, same search; this is a reproduction, not a certificate).
- Controls run here: zeta in the same rows 1.7e-10 to 2.9e-10; Davenport-Heilbronn window defect 0.81 to 1.24 at K = 1 .. 64,
  multiplicativity defects 1.0807, 1.0807. CONFIRMED. No zeta-only mechanism is claimed in the RESULT, so there is no
  mechanism to test against the remaining controls; the statement that they are not formulable in this test is accepted
  as a scope statement.

### Errors and corrections

E1 (substantive, sharpness of Lemma 1). The verdict (item 1), the claim line and the proposed map row say the defect
`pi L/(T log(T/2 pi))` is "sharp" and that "no translate other than the near-identity ones does better". That is false
without the hypothesis `|alpha| <= a/2` that Lemma 1 (b) carries. For `alpha = -2c`, c near the midpoint of the span,
`d Psi/dt = log|(t + alpha)/t|` vanishes at `t = c`, so Psi is stationary inside the span and varies by `(t - c)^2/c`. After
tuning c (period `pi/log(c/2 pi)`) the relative defect on a span of length L is `L^2/(8T)(1 + o(1))`, smaller than
`pi L/(T log(T/2 pi))` whenever `L < 8 pi/log(T/2 pi)` (about 3.4, 2.6, 2.1 at T = 1e4, 1e5, 1e6). This is the reflected
function `zeta(1/2 + i(t - 2c)) = conj zeta(1/2 + i(2c - t))`; it is a height translate and has a unimodular Euler product.
Measured here (34 digits; the last line from zeta values directly):

| T | L | reflection translate | k = 1 translate |
|---|---|---|---|
| 1e4 | 1 | 1.481e-5 | 4.261e-5 |
| 1e4 | 2 | 6.25e-5 | 8.52e-5 |
| 1e5 | 1 | 1.87e-6 | 3.25e-6 |
| 1e6 | 1 | 1.35e-7 | 2.62e-7 |
| 1e6 | 2 | 5.46e-7 | 5.25e-7 |
| 1e6 | 3 | 1.23e-6 | 7.87e-7 |
| 1e4 | 1, from `|F - chi conj F|/|F|` at 9 points | 1.4814e-5 | 4.2608e-5 |

Consequence: `K_tr(T, eta) = max(eta T log(T/2 pi)/pi, sqrt(8 eta T))(1 + o(1))` over all real alpha; the second term
matters only when the first is below about 2.7, that is for K at most 2. Example where the table rule gives the wrong
count: T = 1e4, eta = 2e-5: the k = 1 translate fails K = 1 (4.26e-5), the reflection passes K = 1 (1.48e-5). The entries
of the section 3 table at eta = 1e-6 (0, 0, 3) are unchanged (reflection: 1.48e-5, 1.87e-6 at L = 1 for T = 1e4, 1e5; K = 2
at T = 1e6), and the asymptotic law, the `T^a` statement and the crossover with `sqrt(T)/log T` are unchanged. The search
of `translate_k.py` (k = +-1, +-2, +-3) could not see this family. Required change: state the converse for `|alpha| <= T/2`
only, or add the reflection branch; drop "sharp" for spans shorter than `8 pi/log(T/2 pi)`.
The correction moves the obstruction in the same direction (one more passing control at small K).

E2 (wording, section 5 and verdict item 3). `F_- = (zeta(s) - zeta(s + i alpha))/2` has `a(1) = 0`. Its zeros at
Re s = 2.419, 1.191, 1.045, 1.008 lie in the half-plane of absolute convergence and exist because the constant term
cancels; a reader that checks `a(1) = 1` removes `F_-` before any multiplicativity test. The comparison with
Davenport-Heilbronn applies to `F_+` (`a(1) = 1`), for which the evidence is one off-line zero at T = 1e6 and none found at
T = 1e4 and 1e5. The statement "has off-line zeros in the span" is correct as instances; for the normalised function it
rests on a single instance.

E3 (wording, section 5 against section 1). Section 1 defines the window test with a relative tolerance
`|F - chi conj F| <= eta |F|`. The combination satisfies only the absolute bound `(eta_span/2)|zeta(s + i alpha)|`; near
each zero of F on the line the relative defect is unbounded, so `F_+-` does not pass the test of section 1 at tolerance
`eta_span` at every point. The RESULT says "absolute defect" where it states the identity, but the sentence "passed by it
at every K below K_tr" is true only for an absolute version of the test.

E4 (scope of "closed", section 7). Every translate has all its zeros on the line. The translate family is a control for
identification by the window functional equation; it is not a control for a device whose conclusion is about the location
of zeros. For such devices the only passing controls with an off-line zero in this lane are the float64 free-prime
survivors (a zero of the finite model function `A_1[a]`, no certificate) and `F_+` (which fails the Euler data and E3).
"Class U5 is therefore closed" is established for identification-type conclusions; for zero-location conclusions it is
MEASURED in a finite model only.

Minor. (i) "from T about 1e8" for eta = 1e-6: the table has 533 against 543 at T = 1e8, so the crossing is just above 1e8.
(ii) The predicted crossover `(P - e - 24)/0.36` (about 480 at T = 1e6) is not supported at the upper end: K = 256 already
gives 2.0e-6 for the single seed run, with rank 111 of 206. (iii) `N = 3.2 sqrt(T/2 pi)` is a property of the test design;
the crossover `7 sqrt(T)/log T` is a property of that truncation and not of Dirichlet series with infinitely many primes.

### Checks on the campaign rules

- RH is not assumed anywhere. Verified height is not used or restated. Lemma 4 is the two-constants theorem and is
  labelled classical in substance; Lemma 1 is an elementary computation with the Riemann-Siegel theta function; neither
  is presented as a new theorem about zeta.
- No statement about zeros of zeta is made. The zeros reported are zeros of control functions.

### Requirement flags (set by this referee)

- R1 false: nothing proved uses multiplicativity; Lemma 1 and Lemma 4 hold without it.
- R2 false: no height-uniform every-window conclusion about zeta; the uniform statements are the obstruction itself.
- R3 false: the translate, the reflection translate, the free-prime family below its crossover and the non-multiplicative
  sequences pass; no step separates zeta from them.
- R4 false: finite windows, finite model, explicit controls.

### Surviving claim

No statement about zeros of zeta. For windows inside one span `[T, T + L]` the translate `zeta(s + i alpha)`,
`alpha ~ 2 pi/log(T/2 pi)`, has relative functional-equation defect `pi L/(T log(T/2 pi))(1 + o(1))` on the whole span
(proved to leading order; ratio 0.99995 to 1.004 measured, including four new cases here) and is optimal among translates
with `|alpha| <= T/2`; the reflection translate `alpha ~ -2T` has defect `L^2/(8T)` and is better for
`L < 8 pi/log(T/2 pi)`. The number of contiguous unit windows passed at tolerance eta is
`max(eta T log(T/2 pi)/pi, sqrt(8 eta T))` to leading order: above `T^a` for every `a < 1` at fixed eta; 0, 0, 3 at
T = 1e4, 1e5, 1e6 for eta = 1e-6. Free-prime unimodular Euler products with an off-line zero of the finite model (float64
search, no certificate): conditions `24 + 0.36 K`; largest K passed 0; 16 to 32 (32 for a fourth seed here); 128, with
2.0e-6 at 256 for one seed; K = 512 not run. `(zeta(s) + zeta(s + i alpha))/2` (normalised, `a(1) = 1`): same absolute
defect, not multiplicative, one off-line zero found at T = 1e6; `(zeta(s) - zeta(s + i alpha))/2` has `a(1) = 0`.
No rigidity inequality found.

---

## Same-session audit by the author (unchanged below)


Status: **same-session audit, not an independent referee.** This lane had no means to start a second agent. The audit below
was written by the author of RESULT.md with separate code (`audit.py`) and a line-by-line recheck of the tables against the
logs. An independent referee is owed; the lanes record carries `referees: 0`.

## Checks run

1. Translate identity (Lemma 1, first line). `|F - chi conj F|/|F|` with `F = zeta(s + i alpha)` from `mpmath.zeta` and
   `chi` from the gamma factor, against `2 |sin(Psi/2)|` from `siegeltheta`, 48 digits, four (T, alpha) pairs, three points
   each: largest difference 6.0e-43. HOLDS.
2. Lemma 1 (a), (b): re-derived. (b) uses `|log(1 + alpha/t)| >= |alpha|/(t + |alpha|)` for either sign of alpha and
   the continuity of Psi on a covered span; it does not apply to windows with gaps, as stated. Measured `K_max` against the
   formula: 1.000 to 1.004 for eta <= 1e-3 (18 cases), 1.01 to 1.04 at eta = 1e-2. HOLDS to leading order; the `o(1)` terms
   are not explicit. WEAKENED TO: "PROVED to leading order".
3. Lemma 2 existence: the Dirichlet step is that of round-3 Lemma B with the primes added to the list of numbers; rechecked
   the two halves of the tolerance. HOLDS. Size statement: 36 hits, ratio measured/heuristic 0.116 to 3.59. One table entry
   (heuristic at T = 1e6, P = 7) was wrong in the first draft (3.7e5 for 5.1e5) and is corrected. MEASURED only.
4. Lemma 4: harmonic measure of an interval of length L seen from distance delta above its centre is
   `(2/pi) arctan(L/(2 delta))`; complement at most `4 delta/(pi L)`. HOLDS. It is an identification statement; the RESULT
   says so.
5. Off-line zeros of the combinations: five zeros re-solved at 48 digits, `|F| <= 2.4e-44`, winding number 1.0 on a circle
   of radius 0.01 (64 points). HOLDS as instances. No density statement is made.
6. Free-prime survivors: four survivors rebuilt from the saved phases with a different construction of `a(n)` (smallest
   prime factor recursion) and evaluated at 24 random (t, X) points and at s0: 1.2e-6 (T = 1e5, seed 0, K = 16),
   3.7e-8 (1e5, seed 1, K = 32), 4.4e-9 (1e6, seed 1, K = 128), 5.1e-7 (1e6, seed 0, K = 64); zeta at the same points
   1.5e-10 to 3.4e-9; `|F(s0)|` 3e-16 to 9e-10 where `|zeta(s0)|` is 0.41 to 2.05. The first value is above 1e-6 at random
   points (2.5e-7 on the design grid, 7.8e-7 at the off-grid points of the run): the entry "16" for T = 1e5, seed 0 is
   marginal. HOLDS with that caveat.
7. First draft claimed off-grid agreement within a factor 7; the records show 14 passing rows whose off-grid defect is
   above 1e-6 (1.1e-6 to 8.1e-6). The note in section 4 was rewritten before this file was closed. CORRECTED.
8. Tables of sections 3, 4, 5 compared entry by entry with `translate_k.log`, `contig_T*_s*.jsonl`, `combo*.log`,
   `log_hom_*`: no other discrepancy found. One constant corrected (non-multiplicative predicted crossover at T = 1e4:
   680, not 660).

## Statements that stay unverified

- The rank law `24 + 0.36 K` and its independence of T: three heights, one test design (R = 2, 13 values of X).
- Every "not found" entry (T = 1e4 all K; T = 1e5, K >= 64; frozen primes p <= 13 and p <= 20 at seed 0): local search,
  no certificate.
- The size of `G - chi conj G` for the literal interpolation twin: argued, not computed.
- The heuristic count for separated windows (quoted from round 3).

## Verdict of the audit

Precise obstruction as stated. No claim about zeros of zeta. Flags R1 to R4 false. The proposed map row should be applied
only after an independent referee has re-run `audit.py` or its equivalent.

## Added after the server run

The server unit `rh-c15u5-1119182039` (4 cores, 8 GB) reproduced seed 0 at T = 1e6 for K = 1 .. 128 (scores 2.7e-9 to
2.4e-8, different solutions from the local run) and gave 2.0e-6 at K = 256 (rank 111 of 206; off-grid 8.2e-7). It ended
during K = 512 without output; the cause was not determined (the planned peak for that case was close to the 8 GB limit).
The K = 512 case is recorded as not run. The limit was not raised and the job was not relaunched.
