# r2-classgroup-homotopy: the D = -20 pencil between two Euler points

Internal working note, 2026-11-16. Not refereed. RH and GRH are open; nothing here changes a zero-free region or a
Lambda bound. Labels: PROVED (complete argument here, author-checked only), CLASSICAL (textbook or published, used as
stated), CERTIFIED (ball arithmetic, python-flint/Arb), MEASURED (floating point), ARGUED, OPEN.

## Verdict

**Precise obstruction, with a small set of proved identities.** The pencil
F_phi = cos(phi) A + sin(phi) B, A = Z_1+Z_2 = 2 zeta(s) L(s,chi_-20), B = Z_1-Z_2 = 2 L(s,chi_5) L(s,chi_-4), is governed by
one meromorphic function R = B/A:

* zeros of F_phi = level set {R = -cot(phi)}; the Euler points are the levels infinity and 0 (PROVED, Thm 1);
* R(s) = tanh(s log2 / 2) * prod_{p = 3,7 mod 20} tanh(s log p / 2)^2 = product over the non-principal prime ideals
  of Q(sqrt -5) of tanh(s log N(P) / 2) (PROVED, Thm 2);
* velocity: d gamma / d phi = -2 / (sin(2 phi) omega(gamma)), omega = Im(A'/A - B'/B)(1/2 + i gamma) (PROVED, Thm 3);
* collision angles are critical values of R on the line: cot(phi_c) = abs(R(t_c)) (PROVED, Thm 4);
* F_phi is zero-free on {Re s = sigma > 1 : B(sigma)/A(sigma) > min(abs(tan phi), abs(cot phi))}; the abscissa tends to 1
  linearly, sigma - 1 <= abs(phi) / kappa (1 + o(1)), kappa = (1/2) log((1+sqrt5)/2) = 0.2406 (PROVED, Thm 5).

Certified to height 2000 (3987 zeros of A, 3986 of B, 3091 critical points of R, all isolated in intervals of width
< 3e-13): 35 to 40 per cent of the zeros of each Euler point leave the line on each side; the rest transit to a zero
of the other Euler point without collision. No monotone or sign-definite quantity along phi was found; the sign of
the velocity alternates exactly with the index in the merged zero list (PROVED), which is forced by the level-set
structure and carries no arithmetic.

The expected stop holds in a sharper form than the panel wrote. The **typical** collision angle does not tend to 0
(median 0.05 to 0.08 rad at every height from 100 to 2000). The **first** collision angle phi_0(T) tends to 0 like a
power of T (MEASURED: phi_0 * n(T)^2 stays between 0.1 and 7.5, n(T) = number of colliding zeros below T; counts of
angles below eps scale like eps^(1/2)). The mechanism is not the Bombieri-Hejhal log-normal one. It is the absence
of repulsion between the zeros of the two factors of one Euler point: all 12 smallest angles are a zero of zeta next
to a zero of L(s,chi_-20) at distance delta, with phi_c of order delta^2. So "all zeros of F_phi below height T are
real and simple" holds on an open interval abs(phi) < phi_0(T) around the Euler point, and phi_0(2000) = 1.9e-8.
This is the verified-height wall in the phi variable, with a measured polynomial rate.

Item (5): three statements hold exactly at phi in {0, pi/2} and fail on the open interval, each for a reason that is
the Euler product (section 6). None of them is a statement on the critical line at finite height.

No RH claim. Lead strength for RH: low. The by-products (Thm 2, Thm 5, the delta^2 law) are elementary and may be
known; no literature search was done beyond the repo.

## 0. Plan, overlap, walls

New relative to the atlas and siblings: the phi-family itself is not in PR #27 `historical-routes.md`; round-3
`theta-collision` uses the Epstein kernel of Q_2 under heat flow (a different one-parameter family, no Euler end
points); `dh-separator` and `b-euler-detector` use test functionals. Ideation panel Angle 5 proposed this family and
predicted the stop "phi_c -> 0, verified-height wall". This note executes it, proves the reduction to one function R,
and corrects the predicted mechanism and rate.

Walls: DH is an interior point of an analogous pencil (section 7). Verified height: section 5 is that wall, stated
in phi. MV-CAP and flow-blindness are not used; no mean value and no heat flow enters.

## 1. Setup (task item 1)

Q_1 = x^2+5y^2, Q_2 = 2x^2+2xy+3y^2, Z_j(s) = sum over (x,y) != 0 of Q_j^{-s}. K = Q(sqrt -5), h = 2, w = 2.

**S1 (CLASSICAL).** Z_1+Z_2 = w zeta_K(s) = 2 zeta(s) L(s,chi_-20). Z_1-Z_2 = w L_K(s,psi) = 2 L(s,chi_5) L(s,chi_-4),
psi the genus character (Kronecker factorisation for -20 = 5 * (-4)). Checked at s = 3 against truncated lattice sums:
agreement 1.5e-11 and 5.7e-12 (truncation error of the lattice sums).

**S2 (CLASSICAL).** Lambda_Q(s) = (sqrt20 / 2pi)^s Gamma(s) Z_Q(s) = Lambda_Q(1-s) for each form of discriminant -20.
So every real combination F_phi satisfies the same functional equation with sign +1. Equivalently both A and B have
completed form with factor (sqrt20/2pi)^s Gamma(s) by the duplication formula (conductors 1*20 = 5*4, one even and
one odd character in each product).

**S3 (PROVED).** The Dirichlet coefficients are real, so conj Lambda_phi(conj s) = Lambda_phi(s). With S2,
Lambda_phi(1/2+it) = Lambda_phi(1/2-it) = conj Lambda_phi(1/2+it): real on the line.

**S4 (PROVED).** F_0 = A and F_{pi/2} = B are Euler products. Conversely the coefficients of F_phi/2 are
f(1) = c+s, f(3) = f(7) = 2(c-s), f(21) = 4(c+s) (c = cos phi, s = sin phi; r_A(3)/2 = 2, r_B(3)/2 = -2, same at 7).
Multiplicativity needs f(3)f(7) = f(1)f(21), that is cs = 0. So F_phi has an Euler product only at phi = 0, pi/2
(mod pi).

**S5.** Z_1 = F_{pi/4}/sqrt2 and Z_2 = -F_{3pi/4}/sqrt2. The full parameter space is the circle phi mod pi. The side
(0, pi/2) contains Z_1; the side (pi/2, pi) contains Z_2. The task's interval [0, pi/2] is the Z_1 side; both sides
are treated.

## 2. Reduction to one function

Put R(s) = B(s)/A(s) = L(s,chi_5)L(s,chi_-4) / (zeta(s)L(s,chi_-20)). The gamma factors cancel: R = Lambda_B/Lambda_A.

**Theorem 1 (PROVED).** For phi not 0 mod pi, s is a zero of F_phi iff R(s) = -cot(phi), or A(s) = B(s) = 0.
R(1 - conj s) = conj R(s), so R is real or infinite on the critical line. The real zeros of the whole family are
the graph of the single real function t -> R(1/2+it): F_phi has a zero at 1/2+it iff R(1/2+it) = -cot(phi).
Off-line zeros of the family are the other components of the real locus Im R = 0.

Proof. F_phi = A (cos phi + sin phi R). Reality: S3 applied to Lambda_A and Lambda_B. QED

**Theorem 2 (PROVED).** For Re s > 1,

    R(s) = tanh(s log 2 / 2) * prod_{p = 3, 7 mod 20} tanh(s log p / 2)^2
         = prod over prime ideals P of K with psi(P) = -1 (the non-principal ones) of tanh(s log N(P) / 2),

and R'/R(s) = B'/B - A'/A = sum_n c(n) n^{-s}, c(n) = Lambda(n)(1 - chi_5(n))(1 - chi_-4(n)) >= 0.

Proof. R = L_K(s,psi)/zeta_K(s) = prod_P (1 - N(P)^{-s})/(1 - psi(P) N(P)^{-s}); factors with psi(P) = 1 cancel, and
(1-x)/(1+x) = tanh(s log N / 2) for x = N^{-s}. Non-principal primes: the prime above 2 (norm 2) and the two primes
above each p = 3, 7 mod 20. The second formula: Lambda_A(n) - Lambda_B(n) = Lambda(n)(1 + chi_-20 - chi_5 - chi_-4)(n).
QED. Check (MEASURED, product truncated at 1e8): s = 2+3i: 1.7334557774+0.5925511438i against 1.7334557778+0.5925511440i;
s = 3-7.7i: agreement 1e-13 (`euler.out`).

Reading. The Euler points are the two characters of the class group (the Hecke eigen-combinations). R is the ratio
of the two isotypic projections, and its Euler product runs over exactly the primes where the two characters differ.
The Euler product is a property of the pencil (of R), not of an interior member: an interior member is a level set of
R, the Euler points are its divisor.

**Theorem 3 (velocity; PROVED).** Let gamma(phi) be a simple zero of t -> Lambda_phi(1/2+it) with A B != 0 there. Then

    d gamma / d phi = -2 / ( sin(2 phi) * omega(gamma) ),
    omega(t) = d/dt log abs(R(1/2+it)) = Im( A'/A - B'/B )(1/2+it).

Proof. Differentiate R(1/2+i gamma(phi)) = -cot(phi): (dR/dt) gamma' = csc^2(phi). R is real on the line, so
dR/dt = R omega = -cot(phi) omega. Hence gamma' = -1/(sin phi cos phi omega). And omega = Re(i R'/R) = -Im(B'/B - A'/A).
QED

Forms of omega. (i) Formal Euler side: omega(t) "=" sum_n c(n) n^{-1/2} sin(t log n) with the nonnegative c(n) of
Thm 2, supported on odd powers of 2 and of p = 3,7 mod 20; convergent only for sigma > 1. (ii) Zero side (CLASSICAL
Hadamard, assuming the zeros of A and B are on the line): omega(t) = sum_{gamma_b} 1/(t-gamma_b)
- sum_{gamma_a} 1/(t-gamma_a) + 2t/(t^2+1/4), sums over all zeros paired gamma, -gamma. This is the field of unit
charges of opposite sign at the zeros of B and of A; the gamma factor has dropped out. Collisions are the
equilibrium points of this field.

Check (MEASURED, `velcheck.out`): six zeros on both sides, finite difference against the formula, agreement to 9
digits; for example phi = 0.4, gamma = 5.0793348319: 0.725880700 against 0.725880699, omega = -3.840873081 by both
expressions.

**Theorem 4 (structure; PROVED given simple, pairwise distinct real zeros of A and B on the range; that hypothesis is
CERTIFIED for 0 < t < 2000).** List the zeros of A B on the line as t_1 < t_2 < ..., each labelled a or b, and put
I_0 = [0, t_1), I_k = (t_k, t_{k+1}).

1. R has a simple pole at each a, a simple zero at each b, so its sign alternates: sign R on I_k is -(-1)^k
   (R(1/2) = -0.0631 < 0). Zeros of F_phi with phi in (0, pi/2) lie in the even intervals, with phi in (pi/2, pi) in
   the odd ones.
2. Each zero of A moves into its even neighbour interval for phi > 0 and into its odd neighbour for phi < 0. So the
   sign of d gamma/d phi at phi = 0+ alternates exactly along the merged list.
3. On an interval of type ab or ba the number of critical points of R is even; on aa or bb it is odd.
4. A zero starting at an a-end moves monotonically until the first critical point t_c of R; it leaves the line
   there, at the angle given by cot(phi_c) = abs(R(t_c)). If there is no critical point the zero reaches the b-end at
   phi = pi/2 ("transit"). For the Euler point B the same holds with tan in place of cot.
5. The number of real zeros of F_phi in an interval equals the number of solutions of abs(R) = abs(cot phi) there,
   read off from the critical values.

Proof. 1: simple zeros and poles. 2 and 5: Thm 1. 3: abs(R) goes from infinity to 0 (even number of turning points)
or returns to the same end value (odd). 4: Thm 3; the velocity is finite and of constant sign while omega != 0. QED

## 3. Certified computation (task item 2)

Scripts: `lib.py` (jets of Z_A = e^{i theta} A, Z_B = e^{i theta} B, one common theta), `stage1.py` (root isolation),
`stage2.py` (argument principle), `stage3.py` (assembly), `stage5.py` (off-line tracking). Arb, 128 bits.

Method of `stage1.py`. On each panel of width 0.04: Taylor models of order 16 for Z_A, Z_B and two derivatives
(coefficients at the midpoint, Lagrange remainder from the jet on the whole panel as a ball). Roots of Z_A, Z_B and
W = Z_A Z_B' - Z_A' Z_B (= Z_A^2 dR/dt) are isolated by interval bisection: a subinterval is discarded when the
enclosure excludes 0; it is accepted as containing exactly one root when the derivative enclosure excludes 0 and the
end signs differ. Each root is then refined by bisection on directly evaluated signs. No unresolved subinterval
occurred on (0, 2000] (the only flag is t = 0, where the odd function W vanishes identically by symmetry).
Heights 0 to 264 ran locally, 264 to 2000 on the motherbox (8 processes).

Results (`stage3.out`), all CERTIFIED:

| quantity | value |
|---|---|
| zeros of A in (0, 2000) | 3987 |
| zeros of B in (0, 2000) | 3986 |
| critical points of R in (0, 2000) | 3091 |
| largest enclosure width | 2.3e-13 |
| smallest gap between consecutive zeros of A B | 2.445e-5 (zeta zero 1505.261530, L(chi_-20) zero 1505.261554) |
| sign alternation of R (Thm 4.1) | holds on all 7973 intervals |
| interval types | aa with 1 critical point: 1460; bb with 1: 1459; ab with 0: 4967; ab with 2: 86 |
| parity rule (Thm 4.3) | holds on every interval |

Completeness of the zero lists, independent check by the argument principle (`stage2.py`: rigorous continuous
argument along the segment from 8+iT to 1/2+iT with mean-value enclosures; `s2_*.log`): N_A(T) = 105, 253, 357, 1774
and N_B(T) = 104, 251, 356, 1772 at T = 100.01, 200.01, 264.01, 1000.01, equal to the numbers of isolated real zeros.
So all zeros of the four L-functions below 1000 are on the line and simple (known; here it certifies the lists).
The counts at 2000.01 did not finish and are not claimed; above 1000 the real-zero lists are complete (interval
method) but "no off-line zeros of A, B" between 1000 and 2000 rests on the literature.

Tables: `table_A_zeros.txt` (3987 rows; the first 200 zeros of A end at gamma_200 = 165.537069) and
`table_B_zeros.txt`. Columns: index, gamma, fate on the Z_1 side, fate on the Z_2 side. First rows:

```
   n     gamma     | Z_1 side, phi in (0, pi/2)                 | Z_2 side, phi in (-pi/2, 0)
   1    2.358935   | leaves at 1.507796 (t_c=0, |R|=0.063083)   | leaves at 0.262680 (t_c=3.580433, |R|=3.719)
   2    4.675508   | transit -> b zero 6.020949                 | leaves at 0.262680 (t_c=3.580433)
   3    7.429110   | transit -> b zero 6.648453                 | leaves at 0.356518 (t_c=8.075998, |R|=2.6851)
   4    8.804527   | transit -> b zero 9.831444                 | leaves at 0.356518
   7   14.134725   | transit -> b zero 12.988098                | leaves at 0.002337 (t_c=14.234134, |R|=427.88)
   8   14.336169   | leaves at 0.139412 (t_c=15.238964)         | leaves at 0.002337
  21   30.424876   | leaves at 0.017852 (t_c=30.572095)         | transit -> b zero 29.707909
```

Row 1, Z_1 side: the zero collides with its mirror image -gamma_1 at t = 0 when cot(phi) = abs(R(1/2)) = 0.0631 and
then moves along the real axis: for phi in (1.5078, pi/2) F_phi has real zeros sigma, 1-sigma in (0,1) (PROVED from
Thm 1: R is continuous on (1/2,1) with R(1/2) = -0.0631 and R(1-) = 0; a Siegel-zero-type pair for a non-Euler member). Row 7: the first zero of zeta and
the zero 14.336 of L(chi_-20) collide at phi = -0.0023.

Rejoining (MEASURED, `stage5.out`, `stage5_tracks.json`): each pair leaving below height 200 was followed along
Im R = 0 by the ODE ds/du = R/R', u = log abs(R). Z_1 side: 42 pairs, all rejoin the line at a bb critical point
(median leaving angle 0.055, median rejoining angle 1.443; largest real part reached 0.955). Z_2 side: 34 rejoin, 22
escape to Re s = +infinity as phi -> 3pi/4, where R -> 1; these are the zeros that Z_2 = 2*2^{-s} + ... loses
(N_{Z_2}(T) is smaller by T log2/pi: 83 against 105 at T = 100). Rejoining angles are the certified bb critical
values; the pairing leave -> rejoin is measured (three matches have endpoint error above 0.05 in t).

Zero counts at grid angles (real: CERTIFIED from Thm 4.5; total: CERTIFIED argument principle; the difference is the
number of off-line zeros and is even in every case):

| T | phi | real | total | off-line pairs |
|---|---|---|---|---|
| 200.01 | pi/16 | 197 | 253 | 28 |
| 200.01 | pi/4 (Z_1) | 183 | 253 | 35 |
| 200.01 | 7pi/16 | 201 | 253 | 26 |
| 200.01 | 11pi/16 | 153 | 253 | 50 |
| 200.01 | 3pi/4 (Z_2) | 149 | 209 | 30 |
| 200.01 | 15pi/16 | 171 | 253 | 41 |
| 1000.01 | pi/16 | 1360 | 1774 | 207 |
| 1000.01 | pi/4 (Z_1) | 1288 | 1774 | 243 |
| 1000.01 | 7pi/16 | 1367 | 1773 | 203 |
| 1000.01 | 3pi/4 (Z_2) | 1160 | 1554 | 197 |
| 1000.01 | 15pi/16 | 1244 | 1774 | 265 |

Full grid (15 angles, 4 heights) in `stage3.out`. For pi/2 < phi < 3pi/4 the completed function has two real zeros
sigma_phi > 1 and 1 - sigma_phi (R(sigma_phi) = abs(cot phi)); the contour count is corrected by 1 for them.
Cross-check: of the 42 tracked Z_1-side pairs, 35 are off the line at phi = pi/4, equal to the certified count.
The off-line fraction of Z_1 is 25, 28, 28, 27.4 per cent at T = 100, 200, 264, 1000: no visible approach to the
Bombieri-Hejhal limit 0 in this range.

## 4. Search for a monotone or sign-definite quantity (task item 3)

* Velocity sign: alternates exactly (Thm 4.2). This is a consequence of simple zeros and poles of R and holds for any
  pencil of two real functions with simple distinct zeros. No arithmetic content.
* omega: sign-definite on an interval iff the interval is of type ab without critical points. 37 per cent of
  intervals are aa or bb. The zeros of A and B do not interlace, as expected for independent L-functions.
* Number of real zeros as a function of phi: not monotone (pairs leave near the A end and rejoin near the B end).
* Euler side: the coefficients c(n) of R'/R are nonnegative. This gives Thm 5 in sigma > 1 and the classical 3-4-1
  statement (no zero of A on sigma = 1). On the critical line the series does not converge and the positivity gives
  no sign for omega: omega changes sign 3091 times below 2000.
* Critical values: log abs(R) at aa minima has mean 3.1 and standard deviation 2.5 on [1000, 2000]; at bb maxima
  -3.2 and 2.9 (MEASURED). Symmetric, no drift.

Result: none found. Every quantity examined is either forced by the level-set structure (no arithmetic) or changes
sign.

## 5. The stop: collision angles against height (task item 4)

MEASURED on certified data (`stage3.out`).

Typical angles do not decay. Zeros of A, Z_1 side: 35 per cent collide (1407 of 3987), 65 per cent transit. Median
collision angle 0.052, 0.052, 0.070, 0.080, 0.076 at T = 100, 200, 500, 1000, 2000; 10 per cent quantile 0.023,
0.007, 0.006, 0.003, 0.003. Z_2 side: 40 per cent collide, median 0.062 to 0.051.

The first collision angle decays like a power:

| T | n(T) colliding zeros of A | phi_0(T) | phi_0 n^2 |
|---|---|---|---|
| 25 | 12 | 2.34e-3 | 0.34 |
| 100 | 81 | 1.07e-4 | 0.70 |
| 400 | 467 | 2.67e-6 | 0.58 |
| 1200 | 1665 | 2.67e-6 | 7.4 |
| 2000 | 3007 | 1.95e-8 | 0.18 |

Number of collision angles below eps for eps = 1e-1, ..., 1e-5: A on the Z_2 side 982, 392, 132, 40, 6; B on the Z_2
side 978, 406, 140, 40, 16. Ratio per decade 2.4 to 3.5; the law P(angle < eps) ~ eps^(1/2) predicts 3.16.

Mechanism (ARGUED, consistent with the data). Near two zeros gamma, gamma' of A at distance delta,
Z_A ~ c (t-gamma)(t-gamma') and the pair leaves at tan(phi_c) ~ c delta^2 / (4 abs(Z_B)). The two zeros can be one of
zeta and one of L(chi_-20), which do not repel (independent zero sets, expected); the gap density is then positive
at 0 and P(delta < d) ~ d, hence P(phi_c < eps) ~ eps^(1/2) and phi_0(T) ~ n(T)^{-2}, about (T log T)^{-2}. All 12
smallest angles of A-zeros are such mixed pairs (`stage3.out`); the record is the pair at 1505.2615 with
delta = 2.4e-5 and phi_c = 1.9e-8.

Comparison with Bombieri-Hejhal. Their mechanism (log abs(A/B) has variance of order loglog T, so one term dominates
and the zeros follow the dominant term) predicts the bimodal picture: angles near 0 for the dominated Euler point and
near pi/2 for the dominant one, at rate exp(-c sqrt(loglog T)). The tracked pairs show that shape (leave near 0,
rejoin near pi/2), but sqrt(2 loglog T) only moves from 1.8 to 2.0 between T = 200 and 2000, and the off-line
fraction is flat. The decay of phi_0(T) in this range is entirely the delta^2 law, which the panel's expected stop
did not include.

Consequence (the wall). For every T, the set of phi near 0 for which all zeros of F_phi below T are real and simple
is an open interval containing (-phi_0^-(T), phi_0^+(T)), and it shrinks to {0}: phi_0(2000) = 1.9e-8. For every
phi outside {0, pi/2} off-line zeros exist (CLASSICAL, section 6). A finite-height statement about real zeros that is
stable under small perturbation of the function cannot separate the Euler point from its neighbours. Conversely, the
Euler point's zeros at finite height are limits of level sets R = c with abs(c) -> infinity, which are real for a
reason that has nothing to do with phi = 0 being special.

## 6. Statements true exactly at the Euler points (task item 5)

**Theorem 5 (PROVED).** For sigma > 1 put R(sigma) = B(sigma)/A(sigma) in (0,1) (increasing from 0 to 1) and
G(sigma) = 2 arctan(2^-sigma) + 4 sum_{p = 3,7 mod 20} arctan(p^-sigma).

1. R(sigma) <= abs(R(s)) <= 1/R(sigma) for Re s = sigma. Hence F_phi(s) != 0 whenever
   R(sigma) > min(abs(tan phi), abs(cot phi)). As sigma -> 1+, R(sigma) = kappa (sigma - 1)(1 + O(sigma-1)) with
   kappa = L(1,chi_5)L(1,chi_-4)/L(1,chi_-20) = (1/2) log((1+sqrt5)/2) = 0.240606. So the zero-free abscissa of F_phi
   is at most 1 + abs(phi)/kappa (1 + o(1)) near phi = 0, and the same near pi/2.
2. abs(arg R(s)) <= G(sigma) for the branch that tends to 0 as sigma -> infinity. For phi in (0, pi/2) a zero needs
   R < 0, so F_phi(s) != 0 for sigma > sigma_pi, where G(sigma_pi) = pi. Numerically sigma_pi = 1.134 (MEASURED, tail
   by prime density); 1.130 < sigma_pi < 1.25 with the crude tail bound 4 X^{1-sigma}/(sigma-1) at X = 1e8 (double
   precision sums, not interval arithmetic). In particular Z_1(s) = sum (x^2+5y^2)^{-s} has no zero in Re s >= 1.25.
3. Z_2(s) has no zero in sigma > sigma_tan = 2.1668, where tan(U(sigma)) = 2^-sigma,
   U = 2 sum_{p = 3,7 mod 20} artanh(p^-sigma).

Proof. log R = -2 artanh(w_2) - 4 sum artanh(w_p), w_p = p^{-s}. For abs(w) = r < 1: abs(Re 2 artanh w) <= 2 artanh r and
abs(Im 2 artanh w) <= 2 arctan r (the image of the circle under (1+w)/(1-w) is the circle with diameter
[(1-r)/(1+r), (1+r)/(1-r)]). Summing gives abs(log abs(R(s))) <= -log R(sigma) and item 2. Item 1 then follows from
Thm 1. Item 3: R = 1 gives w_2 = -tanh(u), u = 2 sum artanh(w_p), abs(u) <= U, and abs(tanh u) <= tan abs(u) for
abs(u) < pi/2; so 2^-sigma <= tan U(sigma), false for sigma > sigma_tan. QED

Remarks (ARGUED, Bohr's method, not written out). The real configuration w_2 = -2^-sigma, w_p = +p^-sigma solves
R = 1 at sigma*_real = 2.1070 (tanh U = 2^-sigma), so zeros of Z_2 should approach real part 2.107. The zero
2.079414 + 7.628868i of Z_2 (MEASURED; it is the zero quoted in the round-3 note) is below that, as it must be.

The three statements.

1. *Non-vanishing in Re s > 1.* True at the Euler points (Euler product). False at every other phi: CLASSICAL for
   Z_1, Z_2 (Davenport-Heilbronn 1936); for general phi it follows from Bohr's value-distribution argument applied to
   Thm 2, since sum_{p = 3,7 mod 20} p^-sigma diverges at 1 (ARGUED here; LITERATURE: Booker-Thorne, Righetti,
   hypotheses not checked). Thm 5 makes the failure quantitative and continuous: the abscissa is 1 + O(abs(phi)).
2. *Density.* At the Euler points N(sigma, T) = o(T) for each sigma > 1/2 (CLASSICAL, mollifier with the Dirichlet
   inverse). At interior points the number of zeros with 1/2 < sigma_1 < Re s < sigma_2 < 1 is >> T (CLASSICAL, joint
   universality of the four L-functions; Bombieri-Hejhal, Lee for Epstein zeta). The Euler step is the existence of
   a Dirichlet inverse with bounded coefficients.
3. *Divisor against level set.* At the Euler points the zero set is the divisor of the Euler product R; at interior
   points it is a level set R = c with c finite and nonzero. log R is a Dirichlet series over prime powers with
   nonnegative coefficients; "R(s) = c" has no such description.

Precise obstruction. Each of 1 to 3 separates the Euler points only through information at infinite height or in
sigma > 1/2 strictly: in 1 the separating zeros of F_phi sit at real part up to 1 + abs(phi)/kappa and at heights where
the phases 2^{-it}, p^{-it} align (not seen below 2000 for small phi); in 2 the constant in ">> T" tends to 0 as
phi -> 0; in 3 the level sets R = c converge to the divisor locally uniformly as c -> infinity. On the critical line
below any fixed height, section 5 shows that the Euler point is an interior point of the set of parameters with only
real simple zeros. An argument for GRH(A) that works with on-line data of finite height, or with any property that
is open in phi, also proves the false statement for small phi != 0.

## 7. DH control and the other twins

* DH. f = e^{i a} L(s,chi) + e^{-i a} L(s,chi-bar) (chi mod 5 complex) is a point of the pencil spanned by Re and Im
  parts; its ratio function L(chi)/L(chi-bar) is unimodular on the line and no member of that pencil is an Euler
  product over Q with real coefficients. In the present pencil the role of DH is played by every interior phi, in
  particular Z_1 and Z_2. Every theorem of sections 2 and 3 holds for all phi; none separates. The statements of
  section 6 are the ones that fail in the interior, and the step that uses the Euler product is named there
  (non-negativity of c(n) for Thm 5; Dirichlet inverse for the density statement).
* T-NR (Euler product without Ramanujan) and T-B (Beurling): not members of this pencil; not tested.
* Nothing in this note would fail for a pencil between two Euler products that violate GRH: Thms 1 to 4 are
  structural. That is the reason the angle gives no route to RH.

## 8. Three weakest steps

1. Literature status. Thm 2 (tanh product), Thm 5 (abscissa 1 + abs(phi)/kappa, sigma_pi, sigma_tan) and the delta^2
   law were derived here and not searched in the literature; they are elementary and may be known. The interior
   failure in statement 1 for general phi is argued by Bohr's method, not written out, and the cited papers'
   hypotheses were not checked.
2. Certification scope. Root isolation is by Arb Taylor models and was not cross-validated by a second
   implementation; completeness against off-line zeros of A, B is certified only to T = 1000 (counts at 2000 did not
   finish). The constants sigma_pi, sigma_tan, sigma*_real are double-precision prime sums. The leave -> rejoin
   pairing is ODE tracking without error control.
3. The rate. phi_0(T) ~ n(T)^{-2} rests on 7 record values and on small-count tails (2 to 16 events below 1e-5); the
   eps^(1/2) law is supported over three decades only. Independence of the zeros of zeta and L(chi_-20) is assumed
   for the explanation, not proved. The Bombieri-Hejhal regime (loglog T large) is out of reach of any computation.

## 9. Files

`lib.py`, `stage1.py`, `stage2.py`, `stage3.py`, `stage5.py`, `euler2.py`, `velcheck.py`, `gcheck.py`, `s2z2.py`;
data `s1/c_*.json` (certified root enclosures by chunk), `stage3_table.json`, `table_A_zeros.txt`,
`table_B_zeros.txt`, `stage5_tracks.json`; logs `stage3.out`, `stage5.out`, `euler.out`, `velcheck.out`, `s2_*.log`.
Environment: python 3.12 venv with python-flint 0.9.0, mpmath, numpy, scipy (venv removed after the run; recreate
with `python3 -m venv venv && venv/bin/pip install python-flint mpmath numpy scipy`). Note: `ctx.cap` must be raised
above the jet length (default 10 silently truncates series; `lib.py` sets 64 and asserts lengths).
Motherbox copy: `~/rh-push/r2-classgroup-homotopy/`.
