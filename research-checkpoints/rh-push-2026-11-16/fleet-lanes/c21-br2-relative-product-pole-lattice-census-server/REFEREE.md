# REFEREE (adversarial, lens: general): c21-br2-relative-product-pole-lattice-census-server

Date 2026-11-20. Independent pass on RESULT.md. This file replaces the author's self-rerun as the referee
record; the author's text is kept verbatim in Appendix B. Labels as in the lane.

## Outcome

holds = true for the claimed verdict (partial-result) with the corrections of section 4. Lemma P0 and
Lemma P1 were re-derived line by line and are correct. The measured rows that were rerun reproduce.
Nothing in the result is a statement about zeros of zeta; nothing assumes RH; nothing restates verified
height. Flags set by this referee: R1 = false, R2 = false, R3 = false, R4 = false (same as claimed).

## 1. Proofs re-derived

**P0.** Hypothesis: sum over S of q^-d finite for every d > 0 (taking d = 1/2: sum q^(-1/2) finite).
At s = 1/2 + d, d > 0, each factor of R_S is (1 - q^-d)/(1 - q^(-1/2-d)), numerator in (0,1), denominator
in [1 - q^(-1/2), 1). So 0 < R_S(1/2+d) <= C prod_{i<=M} (1 - q_i^-d) <= C prod (d log q_i), using
1 - e^-x <= x. C = prod 1/(1 - q^(-1/2)) finite. Zeros of the numerators 1 - q^(1/2-s) lie on Re s = 1/2
only and the product converges absolutely in Re s > 1/2, so R_S has no zero there and is not identically 0.
If R_S had a meromorphic continuation F to a disc about 1/2, F would not vanish identically on the disc
(identity theorem on the connected right half of the disc), so abs F(1/2+d) ~ c d^n for an integer n,
contradicting O(d^M) for M = abs(n) + 1. Confirmed. The step "zeta(1/2) != 0" is not needed: G meromorphic
on C gives R_S = zeta/G meromorphic on C directly.

**P1.** At s = 1/2 + d + i t_0, t_0 = 2 pi k/log p: p^(1/2-s) = p^-d, so the factor of p in 1/R_S has modulus
>= (1 - p^(-1/2))/(1 - p^-d) >= c/(d log p). Other denominators: abs(1 - q^-d e^(-i th)) <= 1 + q^-d and
log(1 + x) <= min(log 2, x), so sum log(1 + q^-d) <= log 2 #{q: log q <= 1/d} + sum_{log q > 1/d} e^(-d log q).
With ratio >= lambda eventually: the count is <= log(1/d)/log(lambda) + C_S, and the tail terms have
d log q >= 1, lambda, lambda^2, ..., so the tail sum is bounded. Numerators: abs(1 - q^-s) >= 1 - q^(-1/2),
product positive. Hence y >= (1 - log 2/log lambda) log(1/d) - C(p, S). Natural boundary: pole points
{2 pi k/log p} are dense because 2 pi/log p -> 0. A meromorphic continuation F to a disc D on the line has
finitely many poles in a smaller closed disc; at a pole point where F is analytic F equals the radial limit
0; at a pole point where F had a pole the radial limit would be infinite, which contradicts the limit 0, so
all pole points in the smaller disc are zeros of F; they accumulate in D; F = 0, contradiction with
R_S != 0 in Re s > 1/2. Confirmed.

**Numeric test of P1 (S0, new points).** min over j = 4..40 of y - 0.3069 log(1/d) at six pole points not
in the census list: -0.36, 0.35, 0.61, -1.58, 0.86, 0.94 (bounded below, as the lemma requires; OLS slopes
0.56 to 1.32, all positive).

## 2. Numerical rerun with different cases

Third implementation, written for this pass: Python `decimal` at 90 digits, own sine (argument reduction with
a Machin pi), own Miller-Rabin nearest-prime search, direct evaluation of
(1 - r)^2 + 4 r sin^2(t log q/2); no mpmath, no flint, no code from `census.py` or `referee.py`. Run locally
through scripts/memcap.sh (8 GB cap; 8 s and 92 s). For f(k) > 1500 the midpoint log q = f(k) is used
(the census uses the ball f(k) +- 0.08/f(k)^2). Script and outputs: /tmp/c21ref_scratch/ (ref2.py, ref3.py;
scratch, not part of the lane).

| Check | RESULT.md | This rerun |
|---|---|---|
| S1 prime list (first 8) | 3, 5, 17, 89, 1619, 195341, 528491303, 240911788282559 | same |
| S1, t = 0, y at j = 4, 10, ..., 40 | 8.797, 51.03, 128.06, 239.68, 385.89, 566.70, 782.10 | 8.79702, 51.02951, 128.05600, 239.67867, 385.89402, 566.70198, 782.10256 |
| S1, t = 0, beta_OLS | 31.00 | 30.99595 |
| S1 main term at j = 40 | "about 783" | 782.537 (56 primes with log q <= 2^40) |
| MINUS on S1, t = 0 | slope -1.3888, y = -40.17 | -1.388816, -40.173660 |
| Author's cell (S1, q = 5, k = 3): y at j = 40, beta_OLS | 23.2799832366257, 0.9213387734580775 | 23.279983236625438963, 0.921338773458067597 |
| S2: q_3 and log q_3 | 27.000000000013536 | 532048240609, 27.000000000013535207 |
| S2, pole point of 2971, k = 1 (census point) | 1.87 | 1.872268057905 |

New cases (k not in the census list {1,2,3,5,8,13,21}):

| Point | beta_OLS (j = 4..40) | upper-half slope | y at j = 40 | DEL control, same point: beta_OLS, y at j = 40 |
|---|---|---|---|---|
| S1, q = 17, k = 4 | 0.987 | 1.288 | 25.26 | 0.00017, 0.386 |
| S1, q = 89, k = 7 | 0.827 | 0.881 | 21.80 | 0.00068, 0.710 |
| S1, q = 5, k = 34 | 0.701 | 1.169 | 20.58 | -0.00118, -0.769 |
| S1, q = 1619, k = 55 | 0.701 | 0.782 | 21.17 | -0.00109, -0.835 |
| S1, q = 3, k = 10 | 1.037 | 1.031 | 27.67 | -0.00092, -0.682 |
| S1, q = 528491303, k = 6 | 0.637 | 0.794 | 16.40 | 0.00056, 0.615 |
| S2, q = 2971, k = 4 | 1.571 | | 25.71 | |
| S2, q = 3, k = 4 | 0.270 | | 35.32 | |
| S2, q = 532048240609, k = 4 | 231.2 | | 9518.5 | |

Reading: the S1 claim (beta > 0 at pole points) holds at six further points, all inside the reported range
0.548 to 1.930; the DEL control at the same points has slope 0 to three decimals and bounded y, as
registered. The S2 resonant prime (k = 3, log q within 1.4e-11 of 27) reproduces a slope in the reported
range 199 to 331; the two non-resonant S2 primes give small slopes of either order, consistent with the
reported mixed behaviour. Counts read from the lane's own files: `summary_out3.json` S1 56/0, S0 56/0,
S2 48/8 with 0 non-finite; per-prime S2 list gives 4 + 4 negative at primes 3 and 2971 (matches "8 of 56").
`out/S2.json` in the local directory is the v1 file (7 positive, 8 negative, 42 non-finite); the v3 point
files are on the server only, so the 48/8 count was checked against the summary, not against point files.

Not rerun: S3, S4, RAND rows, the 10^4 generic rows, the zero-ordinate rows, THIN, HQ1.

## 3. Controls and scope checks

- No zeta-only mechanism is claimed, so no control run is required for a mechanism. The DEL control was run
  at the new S1 points (table above); MINUS at t = 0 was rerun. Both behave as registered.
- P0 is not specific to zeta. The base function enters only through "G meromorphic implies zeta/G
  meromorphic". The same lemma holds with Davenport-Heilbronn, a Beurling zeta or any meromorphic base.
  The result says this (flag R1 not established, "Nothing about zeta is derived"). Agreed.
- RH is not assumed anywhere. The zero ordinates below 1000 are used as test heights only (649 = N(1000),
  correct); no claim is made at them.
- Dusart interval (recalled in PREREG, not opened): the statement "a prime in (x, x + x/(25 log^2 x)] for
  x >= 396738" matches this referee's recollection of Dusart 2010; also not opened here. The half-width
  0.08/f^2 covers the nearest prime on either side with a factor 2 to spare. P0 and P1 do not use it.
- Evaluation kernel (`census.py` v3) read in full: factor formula, pole-index override, t = 0 branch, MINUS
  and THIN branches, tail bound (integral comparison for convex f, factor 2.04 against 2 r) and the
  separate lower/upper products are correct. No error found.

## 4. Errors and corrections (none changes the verdict)

1. Novelty wording. P0 and P1 are instances of the classical natural-boundary mechanism for Euler products
   whose local zeros accumulate on a line (Estermann 1928; Dahlquist 1952). They are correct and adequate
   for the question c20 left open in this exact family, but they should be recorded as "elementary, by the
   classical accumulation argument", not as new theorems. RESULT.md labels them "elementary"; section 1
   "What is new" should carry the attribution.
2. Meaning of "no twin". P0 excludes G meromorphic in a neighbourhood of s = 1/2 (the definition of twin in
   c20 Theorem C: G meromorphic on C). It does not exclude a weaker object with boundary values on the line
   only (c20 Theorem A is stated with boundary values). For S0 Lemma P1 excludes continuation across every
   arc; for S1 to S4 non-existence of boundary values is MEASURED only. The sentence "This settles the
   existence question of c20 regime (K) for the exact family" is correct only with "twin = meromorphic".
3. P1 applied to S0. The ratio log q_(k+1)/log q_k of S0 equals e only up to the nearest-prime offset, so
   the lemma as stated gives every lambda < e. The exponent 0.307 is still correct by counting directly:
   #{q in S0: log q <= 1/d} = log(1/d) + O(1).
4. Remark after P0 (ARGUED). The hypothesis "N_S(X) - N_S(X^(1/A)) -> infinity" does not give the decay as
   written: primes with d log q of order 1 contribute factors bounded by a constant below 1, not by a power
   of d. The argument works with the window (X^(1/A), X^(1/2)]: there each numerator is <= eta_q + d log q
   <= 2 d^(1/2), so M primes in the window give O(d^(M/2)). The remark does not cover lacunary sets
   (S0: N_S(X) - N_S(X^(1/A)) = log A, bounded). It stays ARGUED and is not part of the PROVED claim.
5. Section 5, last sentence: "The RAND rows show that the S1 behaviour depends on the counting function
   only" is a reading of two seeds; it is MEASURED on two seeds, not shown.
6. Section 4(a): "57 of 57" for S1 counts t = 0 together with the 56 points t != 0. At t = 0 the positive
   slope is forced by P0 for every set; the informative count is 56 of 56.
7. PREREG precedence was checked by file times only (PREREG.md 02:21, first census code 02:45, results
   03:33). The P2 expectation that prediction (a) fails for S2 is present in PREREG.md.

## 5. Requirement flags (set strictly by this referee)

- R1 false. The lemmas use one local factor shape at infinitely many primes and positivity on the real axis;
  the base function plays no role and multiplicativity of zeta is not used.
- R2 false. P0 is at one point; P1 is at a dense set of heights for sets with ratio > 2. No statement
  uniform in height about zeta.
- R3 false. The lane is a census of a deformation family. No attack is tested against the control list; the
  lemmas hold with any meromorphic base, including the Davenport-Heilbronn function.
- R4 false. Nothing passes to the critical line for zeta; the result is that this relative product does
  not continue across the line.

## 6. What survives

PROVED (elementary, classical mechanism, confirmed by this referee): for alpha_p = +p^(1/2) on an infinite S
with sum over S of q^-d finite for all d > 0, R_S(1/2 + d) = O_M(d^M) for every M, so zeta/R_S is not
meromorphic at s = 1/2; for log q_(k+1)/log q_k >= lambda > 2 eventually, R_S tends to 0 radially at a dense
set of points of the line and the line is a natural boundary of R_S. MEASURED (reproduced in part by a third
implementation): S1 slope positive at all tested pole points, S2 mixed at non-resonant primes with large
finite-range slopes at primes whose logarithm is near an integer; DEL and MINUS controls as registered.
OPEN: regime (K) with phases, with abs(alpha_p) < p^(1/2), or with non-geometric local factors; existence of
boundary values for S1 to S4. No statement about zeros of zeta.

## Appendix B: the author's self-rerun (verbatim, previously the content of this file)

### Author rerun: c21-br2-relative-product-pole-lattice-census-server

Kind: independent rerun of three cells with a second implementation (`referee.py`: mpmath at 70 digits,
direct complex product prod (1 - q^-s)/(1 - q^(1/2-s)), its own Miller-Rabin prime search, its own
truncation at delta log q <= 95, zero ordinate from mpmath.zetazero computed in the script; no code shared
with `census.py`). Run on the server through rhrun (unit c21cref, 1 core); output `referee_out.json`.
Same author as the lane: this checks the numbers, it is not an adversarial pass on Lemmas P0, P1.
For log q with f(k) > 1500 the referee uses the midpoint f(k) (point value); the census uses the ball
f(k) +- 0.08/f(k)^2, so agreement inside the census radius is the test.

| Cell | Quantity | Census v1 (mid +- rad) | Census v3 (mid +- rad) | Referee | Inside both enclosures |
|---|---|---|---|---|---|
| S1, pole point of q = 5, k = 3 (t = 11.711887594987028) | y at j = 4 | 1.1102263631223273 +- 1e-35 | 1.1102263631223273 +- 1e-35 | 1.1102263631223272296 | yes |
| | y at j = 22 | 12.695391369824376 +- 2.5e-7 | 12.695391369823447 +- 5.1e-7 | 12.695391369823186815 | yes |
| | y at j = 40 | 23.279983236626627 +- 2.5e-7 | 23.2799832366257 +- 5.1e-7 | 23.279983236625438963 | yes |
| | beta_OLS | 0.9213387734581172 +- 2.0e-8 | 0.9213387734580775 +- 4.0e-8 | 0.92133877345806759697 | yes |
| S2, generic point g0 (t = 584.9191872754411) | y at j = 4 | -0.790788938341865 +- 1e-35 | same | -0.79078893834186506221 | yes |
| | y at j = 22 | -0.5681598673481969 +- 4.4e-5 | same mid +- 8.7e-5 | -0.56815986969315300355 | yes |
| | y at j = 40 | 2.063983645201366 +- 4.4e-5 | same mid +- 8.7e-5 | 2.0639836444026516964 | yes |
| | beta_OLS | 0.6782853634260614 +- 3.2e-6 | 0.67828536355614 +- 6.4e-6 | 0.67828536381194951386 | yes |
| S1, first zero ordinate (t = 14.134725141734694) | y at j = 4 | -1.2033738454771923 +- 1.9e-24 | same +- 3.8e-24 | -1.2033738454771922224 | yes |
| | y at j = 22 | 4.220512458636695 +- 9.5e-6 | same mid +- 1.4e-5 | 4.2205124606244475965 | yes |
| | y at j = 40 | 7.399479466302908 +- 9.5e-6 | 7.399479466575628 +- 1.4e-5 | 7.3994794665574101692 | yes |
| | beta_OLS | 0.5873652086431681 +- 6.0e-7 | 0.5873652087659277 +- 8.8e-7 | 0.58736520876866109298 | yes |

Largest difference census (v1) minus referee: 2.3e-9 (S2 g0, j = 22), against a radius of 4.4e-5.
Prime lists agree: S1 3, 5, 17, 89, 1619, 195341, 528491303, 240911788282559; S2 3, 2971, 532048240609,
6235149080811616882909238689 (the referee prints the fifth and sixth as 1.935576042035723e+54 and
6.421080152185614e+93).

Not checked by this rerun: S3, S4 and the RAND rows (single implementation); the Dusart interval; the
proofs of P0 and P1 (elementary; each step is written out in RESULT.md section 2 for a later referee);
finding N1 beyond the per-prime table.

Outcome: the three cells hold. The v1 to v3 kernel changes did not move any finite cell outside its
enclosure.
