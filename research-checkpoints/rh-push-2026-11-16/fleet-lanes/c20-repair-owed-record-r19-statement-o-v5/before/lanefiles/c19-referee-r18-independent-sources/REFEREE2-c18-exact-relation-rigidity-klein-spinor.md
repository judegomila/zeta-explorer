# REFEREE2 (second, independent) for c18-exact-relation-rigidity-klein-spinor/RESULT.md

Date 2026-11-20 (round 19, lane c19-referee-r18-independent-sources). Written from RESULT.md and `checks.py` as text; the first referee
file was opened after sections 1 to 3 were fixed. The lane makes no statement about zeros of zeta; neither does this file. (The
off-line zeros located below are zeros of the control HQ2, not of zeta.)

**Verdict: holds with corrections.** The control HQ2, Lemma Q and Proposition F hold as stated. Corrections are of wording (pole
order at k != 0; the convention under which ZQ, NR-q and the Proposition W twin "pass" multiplicativity; Proposition D (c)).
Flags: R1 false, R2 false, R3 false, R4 false.

## 1. Required checks on HQ2 = zeta(s)(1 + eps u^2/(1 - u)^4), u = q^(1/2 - s)

By hand:
- Functional equation. s -> 1 - s is u -> 1/u, and (1/u)^2/(1 - 1/u)^4 = u^2/(u - 1)^4. So m(s) = m(1 - s) exactly and
  zeta m has zeta's functional equation with the same gamma factor.
- Integer frequencies. u^2 (1 - u)^-4 = sum over k >= 2 of C(k+1, 3) u^k and u^k = q^(k/2) q^(-ks), convergent for Re s > 1/2.
  Frequencies k log q; product with zeta has frequencies log n.
- Multiplicativity. a(n) = f(v_q(n)), f(v) = 1 + eps sum over 2 <= j <= v of C(j+1, 3) q^(j/2), f(0) = f(1) = 1. For (m, n) = 1 one of
  v_q(m), v_q(n) is 0, so a(mn) = a(m) a(n). Not completely multiplicative (a(q^2) = 1 + eps q != a(q)^2 = 1).
- Coefficients >= 1: every term of f is >= 0 for eps > 0; a(n) = 1 unless q^2 divides n.
- Zeros of m: u/(1 - u)^2 = 1/(u + 1/u - 2) is real (and <= -1/4) on abs u = 1, and m = 0 needs u/(1 - u)^2 = +- i/sqrt(eps): no zero of m
  on the line for any eps > 0. With u = e^(-zL), L = log q: 4 sinh^2(zL/2) = -+ i sqrt(eps), z = (2/L) asinh((eps^(1/4)/2) e^(+- i pi/4))
  and negatives, plus periods 2 pi i/L.
- Pole at 1/2: 1 - u = (s - 1/2) L (1 + O(s - 1/2)), so m has a pole of order 4 at s = 1/2 with leading coefficient eps/L^4, and
  G has a pole of order exactly 4 there because zeta(1/2) != 0.

In ball arithmetic (`local/hq2_balls.py`, python-flint acb, 200 bits, local through `scripts/memcap.sh 8`):

| check | result |
|---|---|
| G(s) gam(s) - G(1 - s) gam(1 - s), 5 points each for (q, eps) = (2, 1e-2), (3, 1e-4), (101, 1e-6) | every residual ball contains 0; relative radius below 6e-58 |
| coefficients, exact in Q(sqrt q), n <= 4000, (q, eps) = (2, 1/100), (3, 1/10000), (5, 7/3) | minimum 1; a(n) = 1 unless q^2 divides n; 8,823 coprime pairs, 0 failures; not completely multiplicative; series at s = 9 against the closed form: 2e-30 to 6e-30 (tail scale 5e-27) |
| pole at 1/2 + 2 pi i k/log q, k = 0, 1, 2, q = 2 (eps = 1e-2) and q = 3 (eps = 1e-4): Laurent coefficients by a ball contour integral on a circle of radius 1/10 | coefficient of (s - s_0)^-4 equals eps zeta(s_0)/L^4 (difference ball contains 0; value -0.0632639714572681 at q = 2, k = 0) and is certified nonzero in 6 of 6; coefficients of order -5 and -6 are 0 within 2e-24; zeta(s_0) certified nonzero at the six points (abs 1.4604, 1.4690, 2.3239; 1.4604, 0.8540, 1.4219) |
| two off-line zeros for each of (2, 1e-2), (3, 1e-4), (101, 1e-6), (10007, 1e-8): s_0 = 1/2 + z_0 and conj(z_0) + 2 pi i/L | G(s_0) ball contains 0 (radius below 3e-56); Re s_0 - 1/2 certified positive: 0.32392522713068806, 0.06439042093011268, 0.00484529304999867, 0.00076767630764303; exactly one zero of G in the square of half-side Re(z_0)/4 about s_0 (argument principle by ball integration of zeta'/zeta + m'/m: 1.000000000000 +- 7e-13 in 8 of 8); zeta(s_0) certified nonzero; all eight inside the open strip |

The lane's table (offsets 0.32393, 0.064390, 0.0048453, 0.00076768; zeros 0.823925 + 0.321237 i, 0.564390 + 0.064337 i,
0.504845 + 0.004845 i, 0.500768 + 0.000768 i) is reproduced to all printed digits.

## 2. Lemma Q and Proposition F

Lemma Q. m meromorphic on C, m(s) = m(1 - s), m = sum b_k q^(-ks) with b_0 = 1 in some half-plane. Then m(s + 2 pi i/log q) - m(s) is
meromorphic and vanishes on a half-plane, so m is periodic and m = f(u) with f meromorphic on C minus 0; f is a power series near
u = 0 with f(0) = 1; f(u) = f(1/u) makes f analytic at infinity with value 1; poles are isolated and cannot accumulate at 0 or
infinity, so they are finitely many and f is rational; without poles f is constant = 1. **Holds.** Integrality of q is not used.
The proof uses no multiplicativity.

Proposition F. m = 1 + eps u/(1 - u)^2 = (1 + (eps - 2) u + u^2)/(1 - u)^2; with eps = c_q + 2 the roots satisfy u + 1/u = -c_q, so
u = -q^(+-1/4), that is s = 3/4 + i pi (2k + 1)/log q and s = 1/4 + i pi (2k + 1)/log q. Coefficients b_k = eps k q^(k/2) >= 0;
a(n) = 1 for q not dividing n; abs(m - 1) <= eps abs(u)/(1 - abs u)^2 with abs u <= q^(1/2 - sigma), which tends to 0 for sigma > 3/4.
**Holds.** Balls: G_q(3/4 + i pi/log q) and G_q(1/4 + i pi/log q) contain 0 (radius below 8e-59) for q = 11, 101, 10007, 1000003, with
zeta certified nonzero there; the bounds at sigma = 2, 1.01, 0.8 are 0.1266, 2.584, 8.090; 5.41e-3, 0.636, 2.445; 1.21e-5, 0.1124,
0.8697; 3.37e-8, 0.02936, 0.5507 (the lane's table to its printed digits).

TN1 = zeta(s)(1 + q^(3/4 - s)): local series (1 + alpha y)/(1 - y), coefficients 1 or 1 + q^(3/4), zeros on Re s = 3/4. Holds.

## 3. Corrections (sentence to use)

| # | Where | Status | Sentence to use |
|---|---|---|---|
| C1 | Verdict item 3, section 4, control line: "quadruple poles at 1/2 + 2 pi i k/log q" | true at k = 0; for other k it needs zeta != 0 there | "A pole of order 4 at s = 1/2, and at every point 1/2 + 2 pi i k/log q where zeta does not vanish (certified for q = 2, 3 at k = 0, 1, 2; in general the order is 4 minus the order of vanishing of zeta)." |
| C2 | "zeros at distance eps^(1/4)/(sqrt 2 log q) from the line for every eps > 0" | scope | "For every eps > 0 the factor m has no zero on the line; its zeros are at distance (2/log q) Re asinh((eps^(1/4)/2) e^(i pi/4)) = eps^(1/4)/(sqrt 2 log q)(1 + O(sqrt eps)) from it, inside the open strip when that distance is below 1/2." |
| C3 | Verdict item 1 and Proposition I row "N >= 0 deleted: ZQ (MULT on atoms)"; headline "multiplicativity excludes no twin with zeta's functional equation" (first referee E2; agreed after reading) | convention | "HQ2 is a twin with zeta's functional equation that is multiplicative in the ordinary sense. ZQ, NR-q and the Proposition W twin leave the class at integrality or support, before multiplicativity of integer coefficients is defined; they are multiplicative only on their atoms or on their own frequency semigroup." |
| C4 | Proposition D (c) (first referee E1; agreed after reading; not used by the verdict) | gap | "(a), (b) PROVED. Non-closedness of INT and MULT in T_strip is CLASSICAL on the right half-strip with a target that does not vanish on the whole half-strip (for example 1 + 2^-s/4 + 3^-s/4), and OPEN inside the functional-equation class." |
| C5 | Lemma Q, consequence "poles on the line pay for zeros off it" | wording | "Lemma Q gives equal numbers of zeros and poles of R on the u-sphere; it places neither. In HQ the poles are on the line by construction." |

Not checked by this pass: the classification table of section 2 beyond the rows for HQ, TN1 and DH; the cited sources (Hamburger,
Knopp 1994, Voronin, Lapidus-van Frankenhuijsen), which stay "as recalled".

## 4. Comparison with the first referee (opened after sections 1 to 3)

Same verdict. The re-derivations agree. The first referee used mpmath at 40 digits with `findroot` and `quad`; this pass gives ball
enclosures: functional equation, pole order with its leading coefficient at k = 0, 1, 2, and eight off-line zeros with a certified
count of one zero per square. C1 here is its E3 (found independently in the derivation: the order uses zeta(1/2) != 0). C3, C4, C5
are its E2, E1, E4; this referee did not find them before reading and agrees with them.

## 5. Flags

R1 false: HQ2 and the Proposition F members are multiplicative with zeta's functional equation and have off-line zeros.
R2 false. R3 false. R4 false: Proposition F is a negative statement. Referees on this lane after this file: 2, both hold with
corrections. PROVED labels broken: 0 for HQ2, Lemma Q, Proposition F, TN1; Proposition D (c) has the gap already counted by the
first referee.
