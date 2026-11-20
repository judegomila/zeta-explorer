# REFEREE: support-rigidity/RESULT.md

Adversarial referee pass, 2026-11-16. Independent script (numpy + own digamma, zeros from
tmp/research-2026-11-16/pick/zeros_20000.json), not run.py. Scratch code in /tmp/ref-support-rigidity/chk.py.

**Outcome: holds = false in the strict sense (one PROVED item has a wrong constant, one "unconditional" sentence is
not established, the DH section misstates which steps transfer). The verdict "precise obstruction, nothing new on
zeros" survives, and the exponent conclusions (beta >= 0.975 via BHP, Theta >= 3/4) survive.**

## Step-by-step

| Step | Label in RESULT | Referee | Note |
|---|---|---|---|
| P1 | PROVED | confirmed | formal |
| P2 | CLASSICAL | confirmed | Hamburger |
| P3 | MEASURED + PROVED reason | confirmed, extended | recursion rerun to n <= 3000: Lambda_DH(n) != 0 exactly for prime powers p != 5 and for n composed only of primes = +-2 mod 5; 0 mismatches. Lambda_DH(6) = 1.9364, (12) = -0.7629, (14) = -2.8520, (21) = 3.2902 reproduced. |
| P4 | PROVED | confirmed | -G'/G coefficients 2cosh(d log n) Lambda(n); xi(s-d)xi(s+d) invariant under s -> 1-s; zeros at 1/2 +- d + i gamma. Caveat: G has poles at 1 +- d, so "support + simple pole at s = 1" already excludes G; "Lambda(n) <= log n" is one way to say this, "equivalently degree 1" is loose. |
| P5 | PROVED | confirmed | derivative of -(1/2)log(1-x^-2) is -1/(x^3-x); bounds correct. The summary line says "on-line mass"; the proof gives mass on "the remaining zeros", which need not be on-line. |
| P6 | PROVED given classical | confirmed | only for finitely many moved zeros |
| P7 | PROVED (first sentence) | confirmed | linear independence of distinct exponentials |
| P8 | PROVED | confirmed numerically | see below |
| P9 formula | PROVED | confirmed | ||b_0|| = 1, b^_0(0)^2 = 4/3, support of the cross part is exactly [log q, log q'], phi vanishes at the endpoints |
| P9 visibility threshold "g > 3 x^{3/2-beta} log x" | PROVED as necessary condition | **constant wrong** | see E1 |
| "in every actual window W = Q_inf > 0 is an unconditional explicit fact" | stated as fact | **not established** | see E2 |
| Section 6 "P5-P7 and P9 hold for DH" | stated | **false as written** | see E3 |

## Numeric reruns (different test cases)

Weil identity, zero side (20000 zeros, both signs) against Q_inf, windows mostly not in run.log:

| (q, q') | Q_inf | zero sum | diff |
|---|---|---|---|
| (23, 25) | 3.85689 | 3.85689 | 8e-13 |
| (47, 49) | 5.27512 | 5.27512 | 3e-10 |
| (113, 121) | 4.01451 | 4.01451 | 2e-11 |
| (89, 97) | 3.51551 | 3.51551 | 4e-13 |
| (2477, 2503) | 7.85182 | 7.85182 | 3e-7 (eta*T = 47 only) |
| (23, 29), contains 25, 27 | 1.47205 | 2.00609 | -0.53 (control: identity fails, as it must) |
| (24, 26), contains 25 | 3.94023 | 4.58231 | -0.64 (control) |

So P8/P9 are confirmed against actual zeros, and the check discriminates. run.log gives W/2 = 1.7582 at (89, 97);
the referee value is 1.75776. run.py is accurate to about 4e-4, not to the digits printed.

Threshold c* (same bump): 0.725 (x = 3e3), 0.810 (1e5), 1.080 (1e12), 1.208 (1e20). Consistent with run.log and
still rising; the leading-order limit from the P9 formula is 3/2 (solve (2/3) g / sqrt x = log x). RESULT quotes
0.75-1.03 as a range only, which is fine, but the range is not a constant.

## Errors

**E1 (P9 threshold constant; labelled PROVED).** Two slips, both in the direction that makes the stated necessary
condition too strong, hence false as a necessary condition.
(a) A zero at 1/2 + d + i gamma comes with its conjugate; gamma != 0, so the minimal off-line set is four zeros, not
two. The lower bound is -(16/3) eta x^d, not -(8/3) eta x^d.
(b) At the threshold g ~ x^{1-d}, log(1/eta) = log(4x/g) = d log x (1 + o(1)), not log x.
Correct necessary condition for one quartet in this two-cluster family: g > (3/2) d x^{1-d} log x (1 + o(1)).
The stated constant 3 is too large by the factor 2/d >= 4. Exponent statements are unaffected: BHP still gives
d >= 0.475, beta >= 0.975, and Theta >= 3/4.

**E2 (unconditional positivity).** W = Q_inf > 0 needs g < c*(x) sqrt(x) log x. Unconditionally only g <= x^{0.525} is
known, and with g = x^{0.525} the leading form 2 log(4x/g) - (2/3) g / sqrt(x) is negative once log x exceeds about
235 (referee: +11.8 at log x = 230, -193.7 at log x = 260). So positivity in every window is MEASURED for q <= 2e7
(extendable by published maximal-gap tables), and beyond that it is equivalent to a Cramér-strength gap bound, known
only under RH. The sentence should read "MEASURED to 2e7; for all x it is implied by RH and not known otherwise".
Related wording in the verdict paragraph: "in windows below the threshold [3 x^{3/2-beta} log x] ... positive" is
wrong for windows between c* sqrt(x) log x and x^{1-d} log x, where Q_inf < 0. This is the one place where RH is
used silently.

**E3 (DH control).** DH is entire. Its explicit formula has no h(+-i/2) term, conductor 5, and Re psi(3/4 + it/2)
(chi odd). Consequences:
* P5 does not transfer: in a support-free window the DH zero sum equals a small archimedean term, not 1 - eps. The
  "mass 1 forced by the pole" argument uses the pole of zeta at s = 1, not only the functional equation.
* P9 does not transfer as written: no pole term, so there is no Cramér threshold for DH at all. Q_inf^DH is positive
  for every narrow support-free window regardless of length (referee: Q_inf^DH = 8.197 on (56, 59)).
* "Longest run of zeros is 2" holds only for n <= 60. For n <= 3000 the longest run is 9 (1414..1422). The bound by
  prime gaps is correct and is what matters.
The conclusion of section 6 survives and is stronger than stated: the two-cluster test is silent on DH for a
structural reason (no pole), not because DH windows happen to be short. The one rigorous implication (Cramér) uses
the pole and the support; it is not available for DH in any form, which is consistent with DH having off-line zeros.

**E4 (scope of "off-line term is dominated").** P5 and the last paragraph of section 4 bound one quartet (or finitely
many). With infinitely many off-line zeros nothing bounds their total. RESULT's text mostly says this; the summary
claim "exceeding any off-line term" must be read as "any single off-line term".

## Hidden assumptions / restated height

No use of verified height. RH enters silently only at E2. The 7/8 half-plane is used once and labelled unrefereed.

## Is the obstruction real?

Yes, and it can be stated more sharply than RESULT does. On any test class cut out by phi(log p^k) = 0, W = Q_inf is
a number computable without zeros. A contradiction with an off-line zero cannot come out of such a class: the only
possible output is "Q_inf < 0 for an admissible test", which refutes RH. Proving RH needs W >= 0 on all tests, and a
class defined by closed vanishing conditions is not dense. So the angle can only produce statements of the form
"long gap => off-line zero", never an exclusion. This holds for every design, not only the two-cluster family, and
does not depend on E1.

Ways around that were not tried:
1. One-sided sampling instead of exact vanishing: phi(log p^k) >= 0 on prime powers gives W <= Q_inf using only
   Lambda >= 0. This uses the sign of Lambda (fails for DH: Lambda_DH(12) < 0) and enlarges the class from
   codimension-infinite to a cone. It still only yields refutation-type statements, but it is the natural place
   where the Euler product enters and RESULT's section 5 does not consider it.
2. The free-coefficient problem (S) is correctly left OPEN. Section 5's reduction to (star_min) is ARGUED only and
   was not checked here beyond dimension counting.

## Verdict

Surviving claim: no new result on zeros; P1-P8 and the P9 formula hold; the Weil identity on prime-power-free
two-cluster tests is confirmed numerically to 1e-10; the single-quartet visibility condition holds with corrected
constant (3/2) d x^{1-d} log x, giving beta >= 0.975 against BHP; the only rigorous implication is the classical
Cramér / CMS gap statement. Not surviving: the constant 3, unconditional positivity of W in all windows, and the
statement that P5/P9 hold verbatim for DH.
