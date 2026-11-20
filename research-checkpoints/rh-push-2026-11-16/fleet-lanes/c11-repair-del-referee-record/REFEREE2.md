# REFEREE2: c10-thin-deletion-zero-mode-control (second independent pass; lens: the lemma a later lane builds on)

Date 2026-11-19. Written by lane `c11-repair-del-referee-record`, which is neither the author of the DEL lane nor
its first referee. Target: `push/c10-thin-deletion-zero-mode-control/RESULT.md` sections 1 and 2 (Lemma 0 with the
repair E1 of `REFEREE.md`, Lemma 1, the tail bounds of 2.2), read as text. One local numeric run through
`scripts/memcap.sh 8` (`ref2_del.py`, output `ref2_del.json`, log `ref2_del.log`; numpy float64 and mpmath, own
code, no import from the lane; 2 s; largest allocation 20 MB). The server was not used. Three web pages were opened
for the cited theorems (section 4). Internal pass; nothing here has external review.

Labels: CONFIRMED (re-derived here) / CONFIRMED-rel X / MEASURED / NOT CONFIRMED / OPENED / RECALLED.

## Verdict

**The decisive statement holds as stated, relative to one cited theorem.** "For every b in (1/2, 1) there is a set
S of primes such that F(s) = prod over p not in S of (1 - p^-s)^-1 has Lambda_F >= 0 and its meromorphic
continuation to Re s > max(b - eta, b/2) has a simple zero at the real point b": CONFIRMED-rel S(theta) (a lower
bound of the right order for the number of primes in intervals [y, y + y^theta], one theta < 1, all large y).
Lemma 0 with the dyadic repair of the first referee: CONFIRMED-rel S(theta) (upper bound D <= 0 unconditional).
Lemma 1 (i) to (vi): CONFIRMED-rel S(theta). Tail bound for T (tau_X) and Tier 0: CONFIRMED, unconditional. Tier E
derivation: CONFIRMED-rel the two explicit bounds; its numerical width depends on which explicit bound is used
beyond 1.4e25 (C3 below). The half-density case gives a square-root branch point, not a zero: CONFIRMED (proof) and
MEASURED in a new direction (s -> b+).

S(theta) itself: the primary texts (Hoheisel 1930, Huxley 1972, Baker-Harman-Pintz 2001) were not opened. The
statement "the asymptotic pi(x) - pi(x - x^theta) ~ x^theta/log x holds for theta > 7/12 (Huxley 1972)" was read
in a second, independent secondary source (section 4). The control therefore keeps the label **"relative to
Huxley 1972 (statement confirmed in two secondary sources; primary text not opened)"**. It is not PROVED outright.

No statement about zeros of zeta. Flags set by this referee: R1 = R2 = R3 = R4 = false.

## 1. Re-derivation

**Greedy rule.** c_n = min(c_{n-1} + 1, floor L(p_n)), c_0 = 0, gives c_n = min(n, min_{k<=n}(floor L(p_k) + n - k))
by induction (floor L(p_n) is non-decreasing in n). L(2) = 0, so 2 is not in S and D(2) = 0. CONFIRMED.

**Lemma 0.** D <= 0: c_n <= floor L(p_n) <= L(p_n) <= L(x) for x >= p_n. CONFIRMED, unconditional.
Lower bound. If the minimum is attained at k >= 1 then for pi(y) = n: D(y) = c_n - L(y) >= L(p_k) - 1 + (n - k)
- L(y) = -1 - B(p_k, y) with B(x, y) = (L(y) - L(x)) - (pi(y) - pi(x)). The case c_n = n needs n <= L(p_n),
which holds for finitely many n (L(x) = O(x^b/log x)). So the lemma reduces to: B(x, y) <= C max(1, y^(b-eta))
for all 2 <= x < y. Used: (a) L(y) - L(x) <= (y - x) x^(b-1)/log x (integrand decreasing for t > 1); (b)
H(theta'): pi(x + h) - pi(x) >= c' h/log x for x^theta' <= h <= x, x >= x_0. For x >= x_1 (x_1^(b-1) <= c') and
x^theta' <= y - x <= x: B <= 0. For y - x < x^theta': B <= x^(theta'+b-1) = x^(b-eta). For y > 2x the first
referee's split at 2x, 4x, ..., 2^j x <= y < 2^(j+1) x is needed and is correct: B is additive, each full piece
[z, 2z] has B <= 0 (h = z), the last piece [z, y] with z = 2^j x has length < z, so it is one of the two cases
above with z <= y. For x < x_1 split at x_1; B(x, x_1) <= L(x_1) = O(1). CONFIRMED-rel S(theta).

**H(theta') from S(theta).** Tiling [x, x + h] from the left by intervals [y, y + y^theta], y in [x, 2x]: each
tile has length at most (2x)^theta and at least c y^theta/log y >= c y^theta/log(2x) primes; the tiles cover all
but at most (2x)^theta <= h/2 of the interval when x^(theta'-theta) >= 2^(1+theta). CONFIRMED.
Orientation remark (new, harmless): the sources state the theorem for intervals ending at x, (x - x^theta, x].
S(theta) in the lane's form (interval starting at y) follows with any theta_1 in (7/12, theta): for x = y + y^theta
and y large, x^theta_1 <= y^theta, so (x - x^theta_1, x] lies in (y, y + y^theta].

**What the lemma needs is weaker than S(theta) (new remark).** In the case y - x >= x^theta' the proof uses only
pi(y) - pi(x) >= (y - x) x^(b-1)/log x, a proportion x^(b-1) of the expected count, not a fixed proportion c'.
Any theorem giving pi(x + h) - pi(x) >= h x^(-delta) for h >= x^theta', with delta <= 1 - b, suffices. This is
still a short-interval theorem of Hoheisel type (no elementary route is known to me), so the label does not change.

**Lemma 1.** (i) sum_{p in S} p^-s = int_2^inf x^-s dL + int_2^inf x^-s dD. First integral, u = log x:
int_{log 2}^inf e^(-(s-b)u) du/u = E_1((s - b) log 2), Re s > b. Second: boundary terms vanish (D(2) = 0;
D x^-s -> 0 for Re s > b - eta), leaving A(s) = s int_2^inf D x^(-s-1) dx, analytic on Re s > b - eta by Lemma 0.
(ii) log G = sum_{p in S} log(1 - p^-s) = -P_S + T; T converges locally uniformly on Re s > b/2 because
sum_{p in S} p^(-2 sigma) < inf for 2 sigma > b (abs(p^-s) < 1 there, so each logarithm is defined);
exp(-E_1(w)) = e^gamma w exp(-Ein(w)). So G = (s - b) W on Re s > b with W = log 2 e^gamma exp(-Ein - A + T),
an exponential of a function analytic on Re s > sigma_1 = max(b - eta, b/2): W has no zero there. (iii) F =
zeta G on Re s > 1 continues to zeta(s)(s - b) W(s) on Re s > sigma_1; zeta(b) is finite and non-zero for real
b in (0, 1) (classical: (1 - 2^(1-s)) zeta(s) = eta(s) > 0 there), W(b) != 0, so the zero at b is simple. The
only pole is at 1, residue G(1) > 0. (iv) Lambda_F(p^k) = log p for p not in S and 0 for p in S, by the Euler
product. (v) a = 1 * g, g supported on integers composed of primes of S, sum abs(g(d)) d^-sigma < inf for
sigma > b. (vi) 1/F = sum mu(n) a(n) n^-s has a pole at b. All CONFIRMED-rel S(theta) ((iv) unconditional).

Consistency with Landau's theorem (checked because Lambda_F >= 0 is the point of the control): log F has
non-negative coefficients and its first real singularity is at 1 (the pole of F), which is the abscissa of
convergence; the zero at b < 1 lies left of it. -F'/F has residue +1 at s = 1 and -1 at s = b. No contradiction.

**Tail bounds (2.2).** For real u > b: sum_{p in S, p > X} p^-u = m E_1((u - b) log X) - D(X) X^-u + u int_X^inf
D x^(-u-1) dx <= m E_1((u - b) log X) - D(X) X^-u, using D <= 0 only. For 0 < t < 1: 0 >= log(1 - t) + t >=
-t^2/(2(1 - t)). Hence T_X - tau_X <= T <= T_X with the lane's tau_X. Tier 0: R_X(s) <= 0 for real s > b.
CONFIRMED, unconditional given the built set.
Tier E. c_n = c_N + (n - N) when the minimising index lies below X (N = pi(X)), else D(y) >= -1 - B(p_k, y); so
D(y) >= min(D(X), -1) - sup_{X<=x<=y} B(x, y)^+. With M = li(y) - li(x): B <= x^(b-1) M and B <= x^(b-1) M - M +
2 e(y); the combination with weights 1 - x^(b-1) and x^(b-1) is exactly 2 e(y) x^(b-1). Near case x >= y/2:
2^(2-b) e(y) y^(b-1). Far case x < y/2: M >= y/(2 log y), B < 0 when 4 e(y) log y/y < 1 - X^(b-1). J_1 and J_2
are the exact integrals (J_2 recomputed by quadrature: 0.0227218, equal to the closed form to 16 digits).
One step the lane leaves implicit: e must be a single non-decreasing majorant across the junction Y = 1.4e25
(e(x) <= e(y) is used for x <= Y < y). It is: the first bound at Y is 8.6e12 and the second at Y is 9.3e21
(`ref2_del.json`, field `majorant_monotone_at_Y`). CONFIRMED-rel the two cited bounds.

**Lemma C, Lemma I, Lemma N.** Read; agree with the first referee, including its correction E2 (Lemma C is a
statement about zeros of the deleted factor G, not of F).

## 2. Numeric run: new cases b = 0.6 and b = 0.85, X = 2e7 (MEASURED, float64; not a certificate)

Floor decisions: float64 Ei series; every prime with L(p) within 1e-6 of an integer was re-decided with mpmath at
40 digits (2 or 3 primes per case). D <= 0 asserted at every prime.

| case | size of S | first elements | inf D on [2, 2e7] | exponent of G_X(b) against log X (1e5 to 2e7) | W_X(b) at 1e5 / 1e6 / 1e7 / 2e7 |
|---|---|---|---|---|---|
| b = 0.6, density 1 | 2,690 | 5, 7, 13, 23, 31, 47 | -1.638 | 0.999977 | 1.589136 / 1.589658 / 1.589791 / 1.589807 |
| b = 0.6, density 1/2 | 1,345 | 7, 23, 47, 97, 163, 251 | -1.182 | 0.500676 | 1.437188 / 1.437694 / 1.437821 / 1.437836 |
| b = 0.85, density 1 | 121,731 | 5, 7, 11, 13, 17, 19 | -2.360 | 1.000015 | 2.088969 / 2.089028 / 2.089036 / 2.089037 |
| b = 0.85, density 1/2 | 60,865 | 5, 11, 19, 29, 41, 53 | -1.512 | 0.499970 | 1.406509 / 1.406546 / 1.406551 / 1.406551 |

**(a) The object is not identically zero and is not zeta.** a(1) = 1. G(2) in [0.9312050959, 0.9312050960]
(b = 0.6) and [0.9150300225, 0.9150300228] (b = 0.85); the residue G(1) in [0.527499, 0.527582] and
[0.276654, 0.283435] (lower ends from D <= 0 only). So F(2) = zeta(2) G(2) is positive and differs from zeta(2)
by 7% and 8.5%. S is non-empty and its size follows L (2,690 against L(2e7) = 2,690.8; 121,731 against 121,731.7).
W_X(b) is positive, increases with X and stabilises (consistent with R_X <= 0).

**(b) Density one half gives a branch point, tested in the s-direction (the lane and the first referee tested the
X-direction only).** G(b + d) = G_X(b + d) exp(-m E_1(d log X)) up to a relative error below 1e-4 (dropped terms:
abs(D(X)) X^-s, R_X, T - T_X).

| d = s - b | 0.2 | 0.1 | 0.05 | 0.025 | 0.0125 |
|---|---|---|---|---|---|
| b = 0.6, density 1: G/d | 1.5042 | 1.5729 | 1.5907 | 1.5931 | 1.5922 |
| local exponent d log G/d log d | 0.810 | 0.936 | 0.984 | 0.998 | 1.001 |
| b = 0.6, density 1/2: G/d | 2.999 | 4.418 | 6.353 | 9.045 | 12.83 |
| G/d^(1/2) | 1.3412 | 1.3971 | 1.4205 | 1.4302 | 1.4343 |
| local exponent | 0.366 | 0.441 | 0.476 | 0.490 | 0.496 |
| b = 0.85, density 1: G/d | 1.7620 | 1.9278 | 2.0103 | 2.0504 | 2.0699 |
| local exponent | 0.730 | 0.870 | 0.940 | 0.972 | 0.986 |
| b = 0.85, density 1/2: G/d^(1/2) | 1.2926 | 1.3510 | 1.3795 | 1.3933 | 1.4000 |
| local exponent | 0.370 | 0.436 | 0.470 | 0.486 | 0.493 |

At density one G/d tends to W(b) (1.5898, 2.0890 from the X-direction). At density one half G/d grows like
d^(-1/2) and G/d^(1/2) tends to the X-direction value (1.4378, 1.4066): G = ((s - b) log 2 e^gamma)^(1/2)
exp(...), an algebraic branch point of order two at b. No zero of an analytic function at b in that case.

**(c) Continuation left of b (new; MEASURED, and conditional on D staying bounded beyond X).** The formula for
W_X(s) is entire in s; it converges to W(s) for Re s > b - eta exactly when the dropped tail
s int_X^inf D x^(-s-1) dx tends to 0. Values at X = 1e5 / 1e6 / 1e7 / 2e7:

| point | b = 0.6, density 1 | b = 0.85, density 1 |
|---|---|---|
| s = b - 0.05 | 1.560639 / 1.561376 / 1.561586 / 1.561612 | 2.159324 / 2.159422 / 2.159436 / 2.159437 |
| s = b - 0.1 | 1.492948 / 1.493679 / 1.493888 / 1.493914 | 2.214781 / 2.214925 / 2.214948 / 2.214950 |
| s = b - 0.05 + 2i | -0.200614 - 0.654175i / ... / -0.200056 - 0.653998i | -0.198279 - 0.522697i / ... / -0.198277 - 0.522628i |

The values stabilise at the rate X^(-Re s) expected for bounded D. With them the continued function
zeta(s)(s - b) W_X(s) is +0.1311 at b - 0.05 and -0.1834 at b + 0.05 (b = 0.6), +0.4791 and -0.9479 (b = 0.85):
a sign change across b. This is a display of the lemma, not a proof of it: the data below 2e7 do not control D
beyond 2e7 (the lane's 2.4 (a), (b) are correct).

**(d) Discrepancy.** inf D by range is between -2.4 and -1.0 in all four cases and does not grow with x up to 2e7;
Lemma 0 allows growth like x^(b-eta).

## 3. Corrections and remarks (C1 to C6)

- **C1 (label).** "PROVED-rel S(theta), a classical theorem" is correct as a relative statement. Under the
  campaign rule ("a source that cannot be opened is cited as relative to the source") the control is "relative to
  Huxley 1972", with the statement read in two secondary sources. Baker-Harman-Pintz with a counting constant
  (RECALLED in the lane) could not be confirmed from the pages I opened: the introduction of arXiv:2308.04458v8
  gives the exponent 0.525 only as an existence statement ("showed theta >= 0.525"). Use Huxley (asymptotic for
  theta > 7/12), which gives eta up to 5/12 - eps. Hoheisel's exponent is 1 - 1/33000 (asymptotic form).
- **C2 (orientation of the interval).** See section 1; one sentence to add to the lane.
- **C3 (Tier E width depends on the explicit bound beyond 1.4e25).** With Trudgian's Theorem 2 as quoted, J_2 =
  0.02272 and the relative width of the enclosure of W(b) is about 4%. With the bound abs(pi(x) - Li(x)) <=
  9.2211 x sqrt(log x) exp(-0.8476 sqrt(log x)), x >= 2 (Fiori-Kadiri-Swidinsky, arXiv:2206.12557; form confirmed
  by a search result quoting the abstract, paper not opened) the same derivation gives J_2 = 2.705 and an upper
  end 73 to 165 times the lower end (`ref2_del.json`, fields `W_b_in_FKS`). I could not confirm Trudgian's
  Theorem 2 from the arXiv abstract page of 1401.2689 (the abstract names only the bound for theta(x) - x); the
  first referee recalls that it has been superseded. So: the Tier E upper ends for W(b) and the lower ends for
  F'(b+) are "relative to Trudgian 2016 Theorem 2 as printed"; the Tier 0 ends (W(b) >= 1.53707, 1.87837) are
  unconditional. Buthe's range condition 4.92 sqrt(x/log x) <= T was read in the abstract of arXiv:1410.7015
  (OPENED); the height 3e12 is RECALLED. None of this touches Lemma 1.
- **C4 (unconditional fallback, new).** Without any short-interval theorem, the prime number theorem with the
  classical error term gives pi(x + h) - pi(x) ~ h/log x for h >= x exp(-c sqrt(log x)), and the proof of Lemma 0
  then gives abs(D(x)) <= C x^b exp(-c' sqrt(log x)). That is enough for: A(s) continuous on Re s >= b, and
  G(s)/(s - b) -> W(b) != 0 as s -> b from the right in any Stolz angle, with Lambda_F >= 0. So "F tends to 0 at
  b from the right like (s - b)" holds relative to the classical prime number theorem alone; the continuation
  past b and the word "zero" need S(theta). ARGUED here (same proof with a different error function; not written
  out). Useful if a reader rejects the secondary sourcing.
- **C5 (scope of "covers every degree-one read set without FE or periodicity").** Agree with the first referee:
  DEL and THIN are the two extreme values of the local parameter on S (0 and -1). Read sets that use
  0 < abs(a(p)) < 1 on a thin set, or both POS and GEOM at every rational prime (Lemma I: zeta only), are not
  covered by either. The record should say "read sets described by POS without GEOM (DEL) or GEOM without POS
  (THIN)".
- **C6 (novelty).** A standard construction (a sub-semigroup of the integers with a prescribed thin set of
  missing primes); written out and checked here, not new.

## 4. Sources opened by this referee (2026-11-19)

| source | what was read | used for |
|---|---|---|
| arXiv:2308.04458v8 (R. Li, "The number of primes in short intervals and numerical calculations for Harman's sieve"), HTML, introduction | "Hoheisel ... 1930 with theta >= 1 - 1/33000"; "Huxley proved in 1972 that the above asymptotic formula holds when theta > 7/12 by his zero density estimate"; Baker-Harman-Pintz "showed theta >= 0.525" | S(theta): second secondary source for Huxley's asymptotic |
| arXiv:1410.7015 (Buthe), abstract page | Schoenfeld's bound holds while 4.92 sqrt(x/log x) <= T | Tier E input (E1), range condition |
| arXiv:1401.2689 (Trudgian), abstract page | title, abstract (bound for theta(x) - x; the pi(x) bound is not in the abstract) | Tier E input (E2): NOT CONFIRMED from this page |
| search result for arXiv:2206.12557 (Fiori-Kadiri-Swidinsky) | the form 9.2211 x sqrt(log x) exp(-0.8476 sqrt(log x)), x >= 2 | sensitivity in C3 |

Not opened: Huxley 1972 (Invent. Math. 15), Hoheisel 1930, Baker-Harman-Pintz 2001 (closed access).

## 5. What survives, with the count of referee files

1. DEL_b: Lambda_F >= 0, coefficients 0 or 1 (completely multiplicative), simple pole at 1, continuation to
   Re s > max(b - eta, b/2), F = zeta(s)(s - b) W(s) with W non-vanishing, simple real zero at any b in (1/2, 1).
   Two referee files (`c10-thin-deletion-zero-mode-control/REFEREE.md`; this file). Relative to Huxley 1972.
2. Density one half: branch point of order two. Two referee files; measured in two directions.
3. Finite data do not enclose the zero. Tier 0 bounds unconditional; Tier E relative to the printed explicit bound.
4. Lemmas N, I, C (C for the deleted factor G).

## 6. Flags

| flag | value | reason |
|---|---|---|
| R1 | false | no argument about zeta; a control |
| R2 | false | no conclusion in windows |
| R3 | false | no device; the lane adds a control |
| R4 | false | no step toward the critical line |

holds = true (C1 to C6 are label and wording corrections). aboutZeros = false.
