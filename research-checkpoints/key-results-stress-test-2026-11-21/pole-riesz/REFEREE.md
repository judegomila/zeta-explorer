# pole-riesz: referee pass on the first reviewer's verdict (2026-11-20)

Claim as listed: "The pole of zeta forces Riesz-type truncations to fail."
First verdict: confirmed-weaker-statement, minor-variation, arbitrariness 3, importance 2.
Outcome: verdict stands. One correction to its wording (item 3), one literature addition (item 4), two extra controls (item 2).

## 1. What I re-ran (own code in referee/, all through memcap.sh 8, single process)

referee/ref_arb.py: third implementation, python-flint/Arb, not the lane's cert_zero.py and not the reviewer's mpmath script.
Analytic derivative of h(s) = A_N(s) + chi(s) A_N(1-s), complex interval Newton on a box of radius 1e-9, 400 bits.
The only inputs taken from the lane are the rational height T = 875729722967011/1024 and a starting point.

k = 2, zero of F_N/G, interval Newton N(B) inside B and h'(B) excludes 0 (unique simple zero in the box):

| N | Re s (mine, Arb) | Im s - T | first reviewer |
|---|---|---|---|
| 625 | 0.500000000000000 +/- 1e-20 | -0.0126835362450999 | 0.5 |
| 630 | 0.505375649469530 | -0.0119191285327320 | 0.50537564947 |
| 1000 | 0.537281751534178 | -0.0148313306961201 | 0.537281751534 |
| 1250 | 0.541482496857657 | -0.0162570044623358 | 0.541482496858, -0.0162570044623 |
| 1500 | 0.542565058777789 | -0.0173401499577709 | 0.542565058778 |
| 4000 | 0.512600679189441 | -0.0218306275017870 | 0.512600679189 |

With the pole term removed the enclosures are identical to all 15 printed digits (confirms the reviewer's control (a)).
Note on N = 625: interval Newton gives a unique zero in the box with Re = 0.5 +/- 1e-20; that it is exactly on the line
follows from the symmetry s -> 1 - conj(s) plus uniqueness.

Liouville signs (own Omega sieve, Arb 200 bits), w_n = (1 - log n/log(N+1))^k:
k=1: f_36(1/2) = +0.00258608114494, f_37(1/2) = -0.00252652533613, f_37(0.99) = +0.3845
k=2: f_291 = +0.000251868752727, f_292 = -0.000208263943951, f_292(0.99) = +0.4084
k=3: f_2183 = +7.14829147658e-7, f_2184 = -4.58504038613e-5, f_2184(0.99) = +0.4204
k=4: f_16237 = +8.23237222019e-7, f_16238 = -4.20157894876e-6, f_16238(0.99) = +0.4275
Thresholds 37, 292, 2184, 16238 confirmed. (My "M = N" Arb rows printed nan: 0^k on a ball; redone in float below.)

Not re-run by me: N = 284/300 at heights 10^2989/10^1007, N = 292 at 10^6409.7, GPU multi-start, 439 sweep zeros,
DH lift, Lean build. Lean file inspected only: 420 lines, no sorry by grep; theorems are the classical
sum lambda(n) n^-s = zeta(2s)/zeta(s) (Re s > 1), limit 0 at s = 1, negativity on (1/2,1). Not the result.

## 2. Extra perturbations (referee/pert.py, float64)

(a) Cut convention M = N + c. First N with f(1/2) < 0:
    k=1: 38, 38, 37, 36 for c = 0, 0.5, 1, 2; k=2: 293, 293, 292, 291; k=3: 2185, 2184, 2184, 2183; k=4: 16239, 16238, 16238, 16237.
    The thresholds are convention-dependent at the +/-1 level; the phenomenon is not.
(b) Cesaro-type weights (1 - n/(N+1))^k (Turan's own smoothing class) at the Liouville point, N up to 2e6:
    value at sigma = 0.75, 0.9, 1.0, 1.1 for k = 1, N = 2e6: -0.7099, -0.1952, +0.0010, +0.1411; zeta(2s)/zeta(s) = -0.7591, -0.1996, 0, +0.1408.
    Negative at sigma = 0.9 from N = 1000 for k = 1, 2, 3. So non-logarithmic smoothing fails the same way; the section simply
    converges to zeta(2s)/zeta(s), which is negative on (1/2,1) and positive for sigma > 1.

## 3. Where I differ from the first reviewer

(i) "misattributes the cause" is too strong. The zero of zeta(2s)/zeta(s) at s = 1 IS the pole of zeta at s = 1, and the chi_4
control does not contradict this: the chi_4 torus (odd primes) contains the Liouville twist on odd n, whose series is
(1 + 2^-s) zeta(2s)/zeta(s), vanishing at s = 1 because zeta has a pole. So "pole of zeta" is a fair name for the mechanism.
What is wrong with the headline is different: (1) it reads as a property of zeta's own truncations, while the argument applies
to the truncation of every completely multiplicative unimodular series supported on almost all primes (entire L-functions
included), so having or lacking a pole in the function being truncated is irrelevant; (2) the pole-correction term P_N of the
section is immaterial (my Arb enclosures with and without it agree to 15 digits). The reviewer's facts are right; the
sentence "contradicted by the chi_4 control" is not.
(ii) "sketch level" for T2(a)/T3: I re-derived the leading term. Perron with zeta(2u)/zeta(u) ~ zeta(2)(u-1) and the kernel
k! M^w/(L^k w^(k+1)) gives residue at w = 0 equal to zeta(2)(k - omega)/L at s = 1 - omega/L. The remaining steps (classical
zero-free region for the contour, Hurwitz, Kronecker, Rouche with Stirling decay of G(1-s)/G(s)) are standard and I see no gap
in the outline; constants are not tracked and N_0(k) is not explicit. I would call this "proved in notes, unrefereed", routine
for a specialist, and it is unconditional because it works at sigma near 1 (at sigma = 1/2 eventual negativity would need
RH-type input; the lane only uses sigma = 1/2 for finite certified signs).
(iii) Independence of the first replay: the reviewer used own mpmath code but the lane's heights and starting points. That is
acceptable because a zero is self-certifying, but their winding number on 64 sample points is not rigorous. My Arb interval
Newton is rigorous given Arb and my derivative formula, and agrees to 12+ digits.

## 4. Literature (5 searches, general terms; a short search, not a survey)

Confirmed context: Turan 1948 and the 1959 Nachtrag (Acta Math. Hung. 10); Haselgrove 1958; Montgomery 1983 (zeros of partial
sums up to 1 + c loglog N/log N); Spira; Gonek-Montgomery 2013; Borwein-Ferguson-Mossinghoff 2008 (first negative of
sum lambda(n)/n); Mossinghoff-Trudgian; Humphries 2011 (L_alpha(x), negative bias).
Missed by the first reviewer:
- E. Alkan, "Variations on criteria of Polya and Turan for the Riemann hypothesis", J. Number Theory 2021: eventual negativity of
  L_alpha(x) = sum_{n<=x} lambda(n) n^-alpha for all alpha in (1/2,1) is equivalent to RH. This is the sharp-cut version of the
  sign the lane certifies; negativity of weighted Liouville sums in (1/2,1) is the expected state of affairs.
- arXiv 2608.27130, "On variants of Polya's conjecture" (listed Aug 2026; keywords Riesz mean, sign criterion; I saw only the
  search summary, not the paper): Riesz-type weighted Liouville sums with a sign criterion. Directly adjacent to T2(a).
- Duke-Nguyen (Cesaro means of completely multiplicative +/-1 functions).
Not found: the specific statement that FE-symmetrised log-Riesz sections of order k have zeros in 1/2 < sigma < 1 for all large N,
or the specific certified instances. Given Turan-Haselgrove-Montgomery and the two items above, I rate it a minor variation of
known material; I make no novelty claim.

## 5. Scores

Verification: confirmed-weaker-statement (agree). Certified instances reproduce in three independent implementations; the general
statement is an unrefereed notes-level proof; the headline says more than either.
Novelty: minor-variation (agree).
Arbitrariness: 3 (agree). Down-pressure: mechanism survives every weight tried, including Cesaro (mine). Up-pressure: the listed
numbers (37/292/2184/16238 shift with the cut convention, height 8.55e11 is an LLL find, "284 first" is uncertified), integer k,
and the headline framing.
Importance: 2 (agree). It closes an internal route (real-rooted sections + Hurwitz) that Turan-Haselgrove-Montgomery already
predict to fail; no constraint on zeta zeros or on Lambda. A specialist would shrug.
One-line: reviewer's line is accurate but the clause "so their real-rootedness cannot be used as a route to RH" should carry the
scope "for the instances certified; for all large N by an unrefereed argument".
