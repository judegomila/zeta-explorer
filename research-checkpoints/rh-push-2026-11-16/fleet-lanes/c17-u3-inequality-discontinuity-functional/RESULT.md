# c17-u3-inequality-discontinuity-functional: RESULT

Round 17, kind: combine. Cell: U3 read as an inequality; R4 targeted in the quantitative form. Date 2026-11-20.
Sources read: Theorem P and Proposition T (`push/c16-pos-fe-u2-positivity-rigidity/RESULT.md`; its three
referee files were read for their step tables and verdicts: Theorem P and Proposition T hold in all three), Lemma QA and Proposition M (`push/c16-qa-filter-silent-cells-geometric-nodes/RESULT.md`), control
ZQ, companions SG, NR-q, Lemmas A, L, D (`push/c15-control-with-zeta-fe-classes-u1-u2/RESULT.md`), map section 2
(controls) and rows NR, P56, O1.

Nothing in this file is a statement about zeros of zeta. Verdict: **precise obstruction**. The question of the
assignment is decided in the negative in each of its three relaxation directions, and the displayed inequality
that the score rule asks for does not exist in the form asked: NR-q cannot fail through multiplicativity,
because NR-q is multiplicative on its own frequency semigroup (section 5). Score 0 by the registered rule.
Labels: PROVED (argument in this file), CLASSICAL (cited as recalled, not opened), MEASURED (float64 on the
compute server, or mpmath locally; a screen, not a certificate), ARGUED, OPEN.

## 0. Outcome

1. **First lemma (PROVED, section 2).** In the proof of Theorem P the absolutely continuous defect enters at
   Step 6 and nowhere else in an essential way. For a signed member N = (atoms on the integers) + F(x) dx with
   exact functional equation the trace identity (T) still holds and the limit phi -> indicator gives the exact
   defect term

       integral over [1, inf) of sinc(x)^2 F(x) dx = 0,   i.e.   int sinc^2 F^+ = int sinc^2 F^-  =: tau(N).

   For ZQ, F(x) = sum over n <= x of M(x/n)/n with M(y) = sum over the four removed zeros rho_j of c_j y^(rho_j - 1),
   c_j the residue of m at rho_j, abs(c_j) = (eta^2 + d^2)/(2d) (1 + O(1/gbar)). If N^- <= eps' dx then
   tau(N) <= kappa_0 eps', kappa_0 = int over [1, inf) of sinc^2 = 0.0485883. Step 6 is therefore Lipschitz in the
   defect; it has no square root. MEASURED on 8 ZQ members: abs(int sinc^2 F) <= 1.2e-8 (inside the tail bound)
   against int sinc^2 abs(F) between 3.9e-3 and 1.07e-2.
2. **Where the square root comes from (PROVED, section 3).** Not from the coefficient side. For real
   coefficients the completed function is real on the critical line, so an off-line zero is born at a double
   zero; the distance eta is the square root of the change of the function on the line. This uses the functional
   equation and reality only. The law defect ~ eta^2 + d^2 of ZQ is this fact.
3. **The functional (section 3).** Phi_1(N) = (int sinc^2 d abs(N_off))^(1/2), N_off the part of N off the
   integers, has Phi_1(r zeta) = 0 and Phi_1 >= 0.077 sqrt(eps) on the 8 measured ZQ members (ARGUED for the
   family with eta <= 1/4; MEASURED 0.077 to 0.086). It is one-sided (identically 0) on every N supported on the
   integers, with or without multiplicativity. So the one-sidedness is carried by integrality alone. The
   zero-distance functional Phi_2 is not >= c sqrt(eps) on the whole ZQ family (ratio 0.025 at eta = 0.02,
   d = 0.42); it is on the subfamily d <= eta.
4. **The hypothesis "integers with multiplicative weights", relaxed, does not make the zero distance one-sided
   in a non-target way (sections 4, 6).**
   - Frequencies within delta of log n (**Proposition W, PROVED**): for every delta > 0 and every b in (0, 1/2)
     the member zeta(s)(q^(s-1/2) + c + q^(1/2-s))/(2 + c), q = 1 + delta, c = q^b + q^(-b), has zeta's functional
     equation exactly, the pole at 1 only, a non-negative coefficient measure with all atoms within delta of the
     integers in the logarithmic scale and the same total weight in every cluster, a generalised Euler product,
     and zeros on Re s = 1/2 +- b, the first at height pi/log(1 + delta). The reach is the full 1/2 for every
     delta; inside a window abs(t) <= T it needs delta >= pi/T about.
   - Weights multiplicative up to delta, integer frequencies, exact functional equation: the class is {r zeta}
     by Hamburger's theorem (RELATIVE to Statement O), so the relaxation is empty and "zeros within f(delta)" is
     the statement about zeta itself.
   - Functional equation up to delta, integer frequencies (the decisive test, MEASURED): section 6.
5. **Decisive test (server, N on integers up to 300, 1000 and 4000; section 6).** In the model of section 6.1
   the smallest functional-equation defect that allows a quartet at distance eta from the line next to a pair
   of zeros of zeta with half gap d is, for the multiplicative class,
   delta_min = delta_0(pair) + kappa eta^2 for eta <= 0.2, kappa between 0.24 and 0.51, delta_0 between 0.054
   (pair 34, 35; d = 0.42) and 0.26 (pair 13, 14; d = 0.74): the ZQ law eta^2 + d^2 again, now inside integer
   support. The multiplicative values at X = 300, 1000 and (18 cells) 4000 agree within 1.2 per cent. The unconstrained
   relaxation (LP solved at X = 300; at X = 4000 it did not finish and only a bracket is on file) is lower by a
   factor between 1.003 and 1.40 (at most 1.23 in all cells but one). At delta = 1e-2, 1e-3, 1e-4 no off-line
   zero is reachable below height 125 in either class: the largest achievable distance is 0 in both columns
   (smallest feasible defect 0.047). Multiplicativity on coprime pairs changes a constant and does not change
   the law. The test does not separate the two classes.
6. **Second lemma (PROVED, section 5).** For T-NR in symmetric form and for NR-q at every lift value z, the
   off-line zeros are exactly the zeros of the one added local factor: Re s = 1/2 +- b with q^b the modulus of
   the local root divided by q^(1/2). A bound abs(alpha) <= q^(1/2 + delta) gives zeros within f(delta) = delta of
   the line, with equality, and that is the location of the local factor's own zeros and nothing more.
   The exponent form of the bound is needed: in Proposition W the local root exceeds q^(1/2) by the factor
   q^b = 1 + b delta + ..., which tends to 1 while b stays fixed.
7. **Target level.** Any inequality "zeros of G within f(defect) of the line, f(0) = 0" on a class that contains
   zeta at defect 0 is the Riemann hypothesis at defect 0 (one line; c16 section 5 has the same remark for the
   positivity margin). All three relaxed classes contain zeta at defect 0. So the U3 inequality is target-level
   in every direction; what can be proved without the target is the stability part (zeros of G near zeros of
   zeta), which reads integrality and not multiplicativity.

## 1. Plan

What is new against the atlas and the walls: no attack on zeta. The lane takes the identification theorem of
round 16 (Theorem P), asks for its quantitative form, and tests on the server whether multiplicativity enters.
Plan as assigned: (a) first lemma; (b) second lemma; (c) the functional Phi; (d) decisive test; (e) controls.
The decisive test was started first; the lemmas were written while it ran. One modelling decision had to be
made before the test could be posed (what "a zero" means for a finite coefficient vector with a defective
functional equation); it is stated in 6.1 and is the first of the weakest steps.

## 2. First lemma: the defect term in the sinc^2 Poisson proof

Setting of Proposition T of the Theorem P lane: G(s) = int over [1, inf) of x^(-s) dN(x), N signed, abs(N) with a
convergent transform for Re s > 1, (s - 1) G(s) entire of finite order, zeta's functional equation exact.
Steps 2 to 5 of the proof (abscissa, growth, theta relation, self-duality of mu = (r/2) delta_0 + (N + N
reflected)/2) use N >= 0 only for Tonelli. Step 6 pairs mu with f = phi * phi(-.) and its transform
abs(phihat)^2:

    (T)   int abs(phihat)^2 dN = (r/2) (norm(phi)^2 - (int phi)^2),   phi supported in (-1/2, 1/2).

**Lemma S6 (PROVED given Proposition T).** Write N = N_Z + N_off, N_Z the restriction to the positive integers.
Then int sinc^2 dN_off = 0. If N_off = F(x) dx, the exact defect term of Step 6 is

    tau(N) := int_1^inf sinc(x)^2 F^-(x) dx = int_1^inf sinc(x)^2 F^+(x) dx,

and Step 6 reads "the off-integer positive mass in the weight sinc^2 equals tau(N)" in place of "equals 0".
If F >= -eps' then tau(N) <= kappa_0 eps', kappa_0 = int_1^inf sinc^2 = 1/2 - int_0^1 sinc^2 = 0.0485883.

Proof. phi_k -> indicator of [-1/2, 1/2] as in Proposition T (dominated convergence): the right side of (T)
tends to 0, the left to int sinc^2 dN; sinc vanishes at the positive integers. QED

From the defect of the logarithm to F. If nu = Lambda + D(x) dx (the form of ZQ) then G = zeta m,
m(s) = 1 + int_1^inf x^(-s) M(x) dx, and F(x) = sum over n <= x of M(x/n)/n. To first order M = D/log x. For ZQ
exactly M(y) = sum_j c_j y^(rho_j - 1) over the four poles rho_j = 1/2 +- i g_1, 1/2 +- i g_2 of m, with
c_j = Res m at rho_j. From the closed form of m (c15 section 4):
c(1/2 + i g_1) = (eta^2 + d^2)(2 g_1^2 + 2 gbar^2 + eta^2 - d^2) / ((-2 i g_1)(g_1^2 - g_2^2)), so
abs(c_j) = (eta^2 + d^2)/(2d) (1 + O(1/gbar)) >= eta.

MEASURED (`checks.py` block A, `checks.json`; grid step 2.5e-4 on [1, 600]):

| pair | d | eta | eps = sup env abs(D) | abs(c_j) | (eta^2+d^2)/(2d) | int sinc^2 F | tail bound | int sinc^2 abs(F) | sqrt(that/eps) | eta/sqrt(eps) |
|---|---|---|---|---|---|---|---|---|---|---|
| 34, 35 | 0.4226 | 0.02 | 0.6351 | 0.21175 | 0.21175 | -2.4e-9 | 4.9e-9 | 3.899e-3 | 0.0784 | 0.025 |
| 34, 35 | 0.4226 | 0.05 | 0.6440 | 0.21424 | 0.21424 | -2.5e-9 | 4.9e-9 | 3.945e-3 | 0.0783 | 0.062 |
| 34, 35 | 0.4226 | 0.10 | 0.6758 | 0.22311 | 0.22311 | -2.6e-9 | 5.1e-9 | 4.109e-3 | 0.0780 | 0.122 |
| 34, 35 | 0.4226 | 0.20 | 0.8089 | 0.25861 | 0.25861 | -3.0e-9 | 6.0e-9 | 4.762e-3 | 0.0767 | 0.222 |
| 24, 25 | 0.6919 | 0.02 | 1.3426 | 0.34625 | 0.34625 | -1.0e-8 | 2.1e-8 | 9.874e-3 | 0.0858 | 0.017 |
| 24, 25 | 0.6919 | 0.05 | 1.3506 | 0.34777 | 0.34777 | -1.0e-8 | 2.1e-8 | 9.917e-3 | 0.0857 | 0.043 |
| 24, 25 | 0.6919 | 0.10 | 1.3795 | 0.35319 | 0.35319 | -1.1e-8 | 2.1e-8 | 1.007e-2 | 0.0854 | 0.085 |
| 24, 25 | 0.6919 | 0.20 | 1.4987 | 0.37487 | 0.37486 | -1.1e-8 | 2.3e-8 | 1.069e-2 | 0.0845 | 0.163 |

The Mellin transform of the computed F at s = 3 agrees with zeta(3)(m(3) - 1) to relative 6e-5 (grid and
truncation). The balance holds inside the tail bound in all 8 rows.

Functional-equation defect in the same proof (stated, not used below). If the theta relation of Step 4 holds
with an error, y^(1/2)(Theta(y) + r/2) - (Theta(1/y) + r/2) = E(y), then Step 5 gives muhat - mu = e with e the
even distribution whose pairing with the Gaussian exp(-pi y x^2) is -y^(-1/2) E(y), and (T) gains the term
<e, f>. With N >= 0 this bounds int sinc^2 dN by the size of e against the triangle f: the coefficient side is
again Lipschitz.

## 3. The functional Phi, and where the square root lives

Candidates, each a functional of N alone.

- Phi_1(N) = (int sinc^2 d abs(N_off))^(1/2). Phi_1(r zeta) = 0 (PROVED: N_off = 0). On ZQ:
  int sinc^2 abs(F) >= int_1^2 sinc^2 abs(M) (only n = 1 contributes below 2), and
  M = D/log x (1 + O(eta^2 + d^2)) = -2 (eta^2 + d^2) log x x^(-1/2) cos(gbar log x)(1 + ...), so
  Phi_1^2 >= c_1 (eta^2 + d^2) with c_1 -> (4/pi) int_1^2 sinc^2(x) log x x^(-1/2) dx > 0 as gbar grows, while
  eps <= 8 e^-2 (eta^2 + d^2)/(1/2 - eta)^2. Hence Phi_1 >= c (1/2 - eta) sqrt(eps) on the family (ARGUED: the
  second-order term of M and the average of abs(cos) are not bounded here with constants). MEASURED: the
  column sqrt(that/eps) above, 0.077 to 0.086.
- Phi_2(N) = sup over zeros of abs(Re rho - 1/2) (a functional of N through continuation). Phi_2(zeta) = 0 is
  the target. On ZQ, Phi_2 = eta, and eta/sqrt(eps) is small when d is much larger than eta (last column). The
  reach 0.48 sqrt(eps) of Proposition M is attained only along d -> 0.
- Phi_3(N) = sup_j abs(c_j), the amplitude of the oscillating part of the density of N_off:
  (eta^2 + d^2)/(2d) >= eta. Phi_3(r zeta) = 0.

**Proposition O (PROVED).** Let Phi be any functional that vanishes on measures carried by the positive
integers (Phi_1, Phi_3 and every functional of N_off). Then Phi = 0 on the whole class "N on the integers",
whether or not the weights are multiplicative. A displayed inequality Phi <= 0 on that class has one step, and
that step is integrality. It fails for ZQ through integrality (N_off = F dx). It fails for NR-q through
integrality as well (atoms at n q, n/q, q irrational), not through multiplicativity.

**Lemma R (reality; PROVED, elementary).** Let xi_G(s) = s(s-1) gam(s) G(s) with zeta's functional equation and
real coefficient measure. Then xi_G is real on Re s = 1/2 and its zeros are symmetric in the line. If a
one-parameter real family has a quartet at distance eta(u) from the line for u > u_0 and a pair on the line
for u < u_0, then at u_0 there is a double zero on the line and eta(u) = O((u - u_0)^(1/2)) generically.
Proof: conj(xi_G(s)) = xi_G(conj s) = xi_G(1 - conj s); the zero set of a real analytic function of t changes
its number of real zeros only through a multiple zero; a double zero z^2 = (u - u_0) w has roots +- sqrt.

Reading. The square root in "reach at least 0.48 sqrt(eps)" is the discriminant of a real function on the
line. It is present in every member of the family {zeta m} and in every model with a real functional equation
(the test of section 6 shows it again inside integer support). The coefficient side (Lemma S6) is Lipschitz.
A step that is "discontinuous in the coefficient measure at zeta with reach 0.48 sqrt(eps)" is therefore
asked to undo a square root that the functional equation itself produces; integrality and multiplicativity
do not enter that square root.

## 4. The three relaxation directions

**Proposition TL (target level; PROVED, one line).** Let C_delta be an increasing family of classes of
functions with zeta in C_0, and suppose "every G in C_delta has all zeros within f(delta) of the critical
line" holds with f(0) = 0. Then zeta has all zeros on the line. So any such statement is at least as strong as
the target; a proof must contain a proof of the target at delta = 0.

All three relaxations named in the assignment contain zeta at delta = 0.

**(i) Frequencies within delta of log n. Proposition W (PROVED).** Let delta > 0, q = 1 + delta, 0 < b < 1/2,
c = q^b + q^(-b), m(s) = (q^(s-1/2) + c + q^(1/2-s))/(2 + c), G = zeta m. Then
(a) m(s) = m(1-s), m is entire, m(1) = (q^(1/2) + q^(-1/2) + c)/(2 + c) > 0: zeta's functional equation exactly,
    the simple pole at 1 only, order 1;
(b) G(s) = int x^(-s) dN, N = (2 + c)^(-1) sum_n [q^(-1/2) delta_(n/q) + c delta_n + q^(1/2) delta_(nq)] >= 0;
    every atom lies within log q <= delta of log n; the three weights are the same for every n, so the cluster
    weights are completely multiplicative (constant); G = zeta times one local factor at the generalised prime
    q, so it has an Euler product over the primes and q;
(c) m(s) = 0 iff q^(s-1/2) = -q^(+-b): the zeros of m are 1/2 +- b + i (2k+1) pi/log q;
(d) abs(m(s) - 1) <= (cosh(R log q) - 1)/2 for abs(s - 1/2) <= R: m -> 1 on compact sets at rate delta^2, and
    N -> sum_n delta_n weakly.
Proof: (a) by inspection; (b) zeta(s) q^(+-(s-1/2)) = sum_n q^(-+1/2) (n q^(-+1))^(-s); (c) w + 1/w = -c with
w = q^(s-1/2) has the roots w = -q^b, -q^(-b); (d) m - 1 = (q^w + q^(-w) - 2)/(2 + c) with w = s - 1/2, q^w + q^(-w) - 2 = 2(cosh(w log q) - 1), c >= 2. QED

MEASURED (`checks.py` block B): for delta = 1e-1, 1e-2, 1e-3 and b = 0.05, 0.45 the zero is at height 32.96,
315.73, 3143.16 with abs(m) < 2e-19 there; sup of abs(m - 1) on the line for abs(t) <= 10 is 0.21, 2.5e-3,
2.5e-5.

Consequences. (1) With frequencies allowed within delta of log n the zero-distance functional is not
one-sided for any delta > 0, even with N >= 0, exact functional equation and the pole clause. (2) The member
violates Theorem P only in the support clause, by delta (mass at 1/q). With the support clause kept exactly
and N >= 0, Theorem P returns r zeta for arbitrary frequencies, so that sub-direction is empty. (3) The
off-line zeros leave every fixed window as delta -> 0: on abs(t) <= T the member needs delta >= pi/T. The
failure is one of uniformity in height (R2), the same shape as ZQ, whose defect is small only where the gap
d is small. (4) Lemma D of the ZQ lane (off-integer l1 mass at least the integer one) holds for this member
(ratio (q^(1/2) + q^(-1/2))/c, which is 1 up to delta^2): "far from zeta" in total variation, at distance delta
in the weak topology.

**(ii) Weights multiplicative up to delta, integer frequencies, exact functional equation.** Hamburger's
theorem (RELATIVE to Statement O, where the text is recorded as opened) gives G = r zeta from integer
frequencies, the functional equation, finite order and the pole clause, with no hypothesis on the weights. The
class does not depend on delta. The inequality is the target.

**(iii) Functional equation up to delta, integer frequencies.** The class depends on how the defect is
measured; section 6 fixes one measure and computes. Result there: stability with the law eta^2 + d^2, in both
the multiplicative and the unconstrained class.

## 5. Second lemma: local roots, NR-q at every lift value, T-NR in symmetric form

**Lemma LR (PROVED).** Let q > 1, c real with abs(c) > 2, z unimodular, m_z(s) = conj(z) q^(s-1/2) + c +
z q^(1/2-s) (z = 1 and q a rational prime: T-NR in symmetric form; q = 1 + sqrt 2: NR-q with lift value z).
Put w = q^(s-1/2)/z. Then m_z = w + c + 1/w = (1/w)(w - y_+)(w - y_-), y_+ y_- = 1, y_+ + y_- = -c, y real,
abs(y_+) = e^(arccosh(abs(c)/2)) = q^b. Equivalently m_z(s) = conj(z) q^(s-1/2) (1 - alpha q^(-s))(1 - alpha' q^(-s))
with alpha = z y_+ q^(1/2), alpha' = z y_- q^(1/2), abs(alpha) = q^(1/2 + b), abs(alpha') = q^(1/2 - b). The zeros of
m_z are the points with abs(q^(s-1/2)) = q^(+-b): Re s = 1/2 +- b, for every z; z moves the ordinates only.
Hence:
(a) abs(alpha) <= q^(1/2 + delta) holds iff b <= delta, iff the zeros of the factor lie within delta of the line.
    f(delta) = delta, attained.
(b) The statement is the location of the zeros of the one local factor. The other zeros of zeta(s) m_z(s), or of
    L(s, chi) m_z(s), are those of zeta or L(s, chi); the bound says nothing about them.
(c) The bound must be in exponent form. Proposition W has abs(alpha)/q^(1/2) = q^b <= 1 + delta for every
    b <= 1: an absolute bound abs(alpha)/q^(1/2) <= 1 + delta' allows b up to log(1 + delta')/log q, which is
    unbounded as q -> 1.
MEASURED (`checks.py` block C): q = 1 + sqrt 2, c = 2.1, arg z = 0, 1, 2.5: zeros at Re s = 0.857311316 in the
three cases (predicted 0.857311316), ordinates 3.5644, 4.6990, 6.4009.

Why NR-q cannot fail "through multiplicativity". On the semigroup generated by the rational primes and q the
coefficients of zeta m_z are a(n q^j) = a_j, j in {-1, 0, 1}, independent of n: after division by a_0 = c the
function is multiplicative for coprime pairs of that semigroup (n against a power of q), and the factor at q
is a polynomial local factor. NR-q violates two things only: its frequencies leave log N, and its local root
at q is not on the Ramanujan circle. So a displayed inequality whose step fails for NR-q through
multiplicativity cannot be written; the score condition of the assignment is not met by any functional.

For Euler products in the usual sense (local factors (1 - alpha_p p^(-s))^(-1)) a relaxed bound on alpha_p
moves poles of the local factors, not zeros, and no statement "zeros within f(delta)" is on file or follows
here: OPEN, and target-level at delta = 0 by Proposition TL.

## 6. Decisive test on the server

### 6.1 Model

Unknowns: real a_n for n <= X (a_1 = 1) and r. Theta(y) = sum a_n exp(-pi n^2 y) for Re y > 0.

Defect: E(y) = y^(1/2)(Theta(y) + r/2) - (Theta(1/y) + r/2); E = 0 on Re y > 0 iff the theta relation of Step 4
holds. delta(a, r) = max over a grid of max(abs Re E, abs Im E), grid: y = rho e^(i phi), rho in [rho_min, 1],
phi in {0, phi*/2, 0.8 phi*, phi*}, phi* = pi/2 - theta_0, theta_0 = 0.1, with 60, 100, 500, 800 points per
e-fold of rho; rho_min = 27.6/(pi X^2 cos phi*) so that the truncation at X is below 1e-12 (5.5e-6 at
X = 4000; 17,684 complex rows). For a_n = 1, r = 1 the grid defect is 1.6e-14. The relation E(1/y) = -y^(-1/2) E(y)
covers rho > 1, the reflection y -> conj y covers phi < 0. The complex rays are needed: on the positive real
ray alone the relation controls G only for abs(t) <= (4/pi) log(1/delta), which is 12 at delta = 1e-4 and is
below the first zero.

Zero functional: Lambda_phi(s; a, r) = sum_n a_n [(pi n^2)^(-s/2) Gamma(s/2, pi n^2 e^(i phi))
+ (pi n^2)^(-(1-s)/2) Gamma((1-s)/2, pi n^2 e^(-i phi))] + r [e^(-i phi (1-s)/2)/(s-1) - e^(i phi s/2)/s],
the Mellin transform of Theta along the ray of angle phi, split at abs(y) = 1 and folded with the theta
relation (incomplete gamma functions by mpmath at 60 digits; 14 terms). PROVED by the classical computation:
if E = 0 then Lambda_phi = gam(s) G(s) for every phi; in general, for Re s > 1,
gam(s) G_a(s) = Lambda_phi(s) - integral over the ray of angle -phi, abs(u) >= 1, of E(u) u^(-s/2 - 1) du.
MEASURED: with a_n = 1, r = 1 the formula returns gam(s) zeta(s) to all 16 digits at every s used.
By the argument of Lemma R, Lambda_phi(.; a, r) is real on the critical line for every real (a, r), also
defective ones. An off-line zero at s_0 is therefore two real linear equations in (a, r), it comes with its
mirror, and it needs a near-double zero.

Program: minimise delta(a, r) subject to Lambda_phi*(1/2 + eta + i gbar; a, r) = 0, gbar the midpoint of a pair
of consecutive zeros of zeta.
- Unconstrained relaxation: LP in (a_2..a_X, r), box abs(a_n - 1) <= 31, 0 <= r <= 4. HiGHS, cutting planes over
  the grid rows until no row exceeds the LP value by more than 1e-3 relative. Reported: the full-grid defect of
  the LP point (an upper bound for the minimum) and the LP value on the active rows (a lower bound).
- Multiplicative class: a_n = product of v_q over the exact prime powers q of n, variables v_q in [0, 2] for
  the 589 prime powers up to 4000 (multiplicativity on all coprime pairs holds exactly at every iterate).
  Sequential LP on the exact Jacobian with a trust region, Newton correction of the two zero equations to
  1e-13, full-grid defect recomputed from the exact a(v). The result is a local minimum: an upper bound for
  the minimum over the class. The box 31 of the relaxation contains every a(v) that occurs (2^5 = 32 > max).
- Float64 throughout: a screen.

### 6.2 Results

Columns: delta_min for the multiplicative class (sequential LP; an upper bound for the class minimum) at
X = 300, 1000, 4000; the unconstrained relaxation at X = 300 (interior-point LP with cutting planes: the LP
value on the active rows is a lower bound, the full-grid defect of the LP point an upper bound). "-" = not
run or not finished. Full file: `tables.md`, built by `mktab.py` from `logs/`.

| pair | d | eta | mult X=300 | mult X=1000 | mult X=4000 | unc X=300: LP lower bound | unc X=300: LP point | mult(300)/unc lower(300) | largest mult/unc lower(300) | mult(300)/(eta^2+d^2) |
|---|---|---|---|---|---|---|---|---|---|---|
| 13,14 | 0.7424 | 0.01 | 0.25959 | 0.25955 | 0.25962 | 0.22729 | 0.22751 | 1.142 | 1.142 | 0.471 |
| 13,14 | 0.7424 | 0.05 | 0.26082 | 0.26088 | 0.26085 | 0.22834 | 0.22856 | 1.142 | 1.143 | 0.471 |
| 13,14 | 0.7424 | 0.1 | 0.26463 | 0.26460 | 0.26469 | 0.23164 | 0.23186 | 1.142 | 1.143 | 0.472 |
| 13,14 | 0.7424 | 0.2 | 0.28009 | 0.28005 | 0.28001 | 0.24489 | 0.24513 | 1.144 | 1.144 | 0.474 |
| 13,14 | 0.7424 | 0.3 | 0.32158 | 0.32155 | 0.32155 | 0.26717 | 0.26743 | 1.204 | 1.204 | 0.502 |
| 13,14 | 0.7424 | 0.45 | 0.44477 | 0.44468 | 0.44470 | 0.31824 | 0.31854 | 1.398 | 1.398 | 0.590 |
| 19,20 | 0.7201 | 0.01 | 0.24225 | 0.24228 | 0.24226 | 0.24147 | 0.24161 | 1.003 | 1.003 | 0.467 |
| 19,20 | 0.7201 | 0.05 | 0.24344 | 0.24347 | 0.24345 | 0.24266 | 0.24280 | 1.003 | 1.003 | 0.467 |
| 19,20 | 0.7201 | 0.1 | 0.24731 | 0.24721 | 0.24718 | 0.24639 | 0.24647 | 1.004 | 1.004 | 0.468 |
| 19,20 | 0.7201 | 0.2 | 0.26223 | 0.26222 | 0.26219 | 0.26134 | 0.26156 | 1.003 | 1.003 | 0.469 |
| 19,20 | 0.7201 | 0.3 | 0.28748 | 0.28749 | 0.28747 | 0.28651 | 0.28674 | 1.003 | 1.003 | 0.472 |
| 19,20 | 0.7201 | 0.45 | 0.34540 | 0.34532 | 0.34533 | 0.34427 | 0.34447 | 1.003 | 1.003 | 0.479 |
| 24,25 | 0.6919 | 0.01 | 0.17377 | 0.17537 | - | 0.14590 | 0.14598 | 1.191 | 1.202 | 0.363 |
| 24,25 | 0.6919 | 0.05 | 0.17476 | 0.17634 | 0.17641 | 0.14667 | 0.15398 | 1.192 | 1.203 | 0.363 |
| 24,25 | 0.6919 | 0.1 | 0.17776 | 0.17939 | 0.17946 | 0.14908 | 0.15165 | 1.192 | 1.204 | 0.364 |
| 24,25 | 0.6919 | 0.2 | 0.18983 | 0.19169 | 0.19209 | 0.15876 | 0.16414 | 1.196 | 1.210 | 0.366 |
| 24,25 | 0.6919 | 0.3 | 0.21058 | 0.21257 | - | 0.17504 | 0.18088 | 1.203 | 1.214 | 0.370 |
| 24,25 | 0.6919 | 0.45 | 0.25875 | 0.26107 | - | 0.21232 | 0.21720 | 1.219 | 1.230 | 0.380 |
| 27,28 | 0.6096 | 0.01 | 0.08670 | 0.08669 | - | 0.08632 | 0.08640 | 1.004 | 1.004 | 0.233 |
| 27,28 | 0.6096 | 0.05 | 0.08728 | 0.08727 | - | 0.08689 | 0.08692 | 1.004 | 1.004 | 0.233 |
| 27,28 | 0.6096 | 0.1 | 0.08906 | 0.08906 | 0.08907 | 0.08867 | 0.08873 | 1.004 | 1.004 | 0.233 |
| 27,28 | 0.6096 | 0.2 | 0.09623 | 0.09624 | - | 0.09583 | 0.09588 | 1.004 | 1.004 | 0.234 |
| 27,28 | 0.6096 | 0.3 | 0.10834 | 0.10830 | 0.10829 | 0.10783 | 0.10790 | 1.005 | 1.005 | 0.235 |
| 27,28 | 0.6096 | 0.45 | 0.13574 | 0.13568 | 0.13571 | 0.13510 | 0.13519 | 1.005 | 1.005 | 0.236 |
| 34,35 | 0.4226 | 0.01 | 0.05346 | 0.05371 | - | 0.04719 | 0.04722 | 1.133 | 1.138 | 0.299 |
| 34,35 | 0.4226 | 0.05 | 0.05419 | 0.05444 | - | 0.04784 | 0.04787 | 1.133 | 1.138 | 0.299 |
| 34,35 | 0.4226 | 0.1 | 0.05650 | 0.05678 | - | 0.04987 | 0.04991 | 1.133 | 1.139 | 0.300 |
| 34,35 | 0.4226 | 0.2 | 0.06581 | 0.06613 | - | 0.05804 | 0.05807 | 1.134 | 1.139 | 0.301 |
| 34,35 | 0.4226 | 0.3 | 0.08153 | 0.08194 | - | 0.07177 | 0.07183 | 1.136 | 1.142 | 0.304 |
| 34,35 | 0.4226 | 0.45 | 0.11784 | 0.11851 | - | 0.10336 | 0.10345 | 1.140 | 1.147 | 0.309 |
| 40,41 | 0.655 | 0.01 | 0.10529 | 0.10580 | - | 0.09054 | 0.09058 | 1.163 | 1.169 | 0.245 |
| 40,41 | 0.655 | 0.05 | 0.10592 | 0.10644 | - | 0.09108 | 0.09115 | 1.163 | 1.169 | 0.245 |
| 40,41 | 0.655 | 0.1 | 0.10789 | 0.10842 | - | 0.09277 | 0.09285 | 1.163 | 1.169 | 0.246 |
| 40,41 | 0.655 | 0.2 | 0.11578 | 0.11639 | - | 0.09955 | 0.09961 | 1.163 | 1.169 | 0.247 |
| 40,41 | 0.655 | 0.3 | 0.12921 | 0.12985 | - | - | - | - | - | 0.249 |
| 40,41 | 0.655 | 0.45 | 0.16008 | 0.16093 | - | 0.13734 | 0.14341 | 1.166 | 1.172 | 0.253 |

Infeasible inside the boxes in every run (zero equations not met): [1] (pair index), all eta.
Ratio multiplicative / unconstrained lower bound: min 1.003, max 1.398.
Unconstrained at X = 1000, pair 24, eta 0.01: LP lower bound 0.14590, LP point 0.15069.

**The unconstrained LP at X = 4000 did not finish** (4000 dense columns; the simplex runs hit the time limits
and returned no point; the interior-point method was used at X = 300 only). What is on file for X = 4000 in
the relaxation is a bracket, ARGUED: (lower) on the rows with rho >= rho_min(300) = 9.8e-4 the columns n > 300
are below 1e-12, so the X = 4000 program restricted to those rows is the X = 300 program up to 1e-9 with the
box 31, and dropping rows lowers the minimum; hence min(X = 4000) >= min(X = 300) up to the grid
discretisation; (upper) every multiplicative point lies in the box, so min(X = 4000) <= the multiplicative
value at X = 4000. The column "largest mult / unc lower(300)" is the ratio of these two ends.

Reading (MEASURED).
- Law. For fixed pair, delta_min(eta) - delta_min(0.01) = kappa eta^2 for eta <= 0.2, with kappa = 0.31 (pair
  34, 35: increments 0.0030, 0.0124, 0.0281, 0.0644 at eta = 0.1, 0.2, 0.3, 0.45), 0.24 (pair 27, 28), 0.51
  (pairs 13, 14 and 19, 20; pair 13, 14 leaves the quadratic law at eta = 0.45). The threshold delta_0(pair) is
  between 0.23 d^2 and 0.47 d^2. The unconstrained column has the same shape. This is the ZQ law (defect
  proportional to eta^2 + d^2), reproduced by integer-supported coefficient vectors at the price of a
  functional-equation defect.
- X. The multiplicative values at X = 300, 1000 and 4000 agree to 3 or 4 digits for pairs 13, 19, 27 and
  within 1.2 per cent for pair 24 (different local optima). For pairs 34 and 40 the multiplicative program
  finished at X = 300 and 1000 only (agreement within 0.6 per cent); at X = 4000 there are 18 feasible
  multiplicative cells in all. The minimum is decided by the small n; the
  model reads the zero through a_1..a_8 and r (the weight of a_n in the zero functional is below 1e-8 for
  n >= 8).
- Statistic of the assignment. At delta = 1e-2, 1e-3, 1e-4 the largest achievable distance of a zero from the
  line is 0 in both columns for the seven pairs tested (heights 17 to 124): every feasible quartet needs
  delta >= 0.0472 (the LP lower bound of the relaxation at pair 34, 35, eta = 0.01). The first pair (d = 3.44) is
  infeasible inside the boxes in both classes (in the relaxation r sits at its bound 4).
  Extrapolation with the measured law (not tested): a quartet becomes reachable at delta when
  d < sqrt(delta/0.3) about, that is d < 0.18, 0.058, 0.018; pairs with such gaps exist at larger heights
  (6709, 6710 has d = 0.0188), which the model cannot reach in float64 (cancellation e^(-theta_0 gbar/2) in the
  zero functional).
- Multiplicativity. The ratio of the multiplicative minimum to the unconstrained one is in the table; it is
  between 1.003 and 1.40: 1.003 to 1.005 for pairs 19, 27; 1.13 to 1.23 for pairs 13 (eta <= 0.3), 24, 34, 40;
  1.40 in one cell (pair 13, 14 at eta = 0.45). The multiplicative column is a local optimum, so the true
  ratio is at most the one shown. The local optimum uses the freedom of the large primes (at X = 4000 between
  330 and 510 of the 589 variables v_q sit at a box bound). No change of exponent, no change of threshold
  order.
- Shift benchmark: a_n = n^alpha (completely multiplicative, G(s) = zeta(s - alpha)) has grid defect
  1.14 alpha to 1.42 alpha for alpha from 1e-4 to 1e-1 at X = 4000 (0.69 to 0.75 at X = 300, 0.89 to 1.02 at
  X = 1000: it grows with log X because the shift violates the relation at every scale). Its true zeros are
  at distance alpha from the line, but they are not zeros of the model functional: Lambda_phi* stays real on
  the line. For the true continuation the shift gives f(delta) >= delta/1.2 at X = 4000 in the multiplicative
  class: a linear lower bound that the model does not see.

Outcome of the test. It kills the idea in the form asked: in the functional-equation direction the reach as
a function of delta is the same law in the multiplicative class and in the relaxation, with constants within a
factor 1.4 (1.23 in all cells but one). Multiplicativity is not what makes the functional one-sided; nothing measured here is one-sided
except through the height restriction (large d below height 125).

### 6.3 Runs

Server, rhrun only; no unit of this lane is running. `rh-c17u3-main-1120010925` (X = 4000, 8 cores, 12 GB;
stopped by this lane after 21 multiplicative results because the remaining jobs were slow; log kept);
`rh-c17u3-x1000-1120011256` (X = 1000, 4 cores, 6 GB; all 42 multiplicative cells, 5 unconstrained cells by
simplex, then stopped by this lane); `rh-c17u3-main4k-1120012522` (X = 4000, 8 cores, 12 GB, LP time limit
120 s: 3 multiplicative cells finished (pair 27, 28), 5 hit the LP time limit in the first step and gave no
point (pair 34, 35 and one cell of pair 27, 28); the 5 unconstrained LPs started all hit the time limit in the
first round; stopped by this lane); `rh-c17u3-x300-1120014953` (X = 300, 8 cores, 12 GB, interior point: 42 multiplicative
and 41 of 42 unconstrained cells; ended by itself). Two earlier units did no work
(`rh-c17u3-main-1120010528` failed at start, file not yet copied; `rh-c17u3-x1000-1120011232` started with the
wrong environment and was stopped by this lane within a minute). Peak planned allocation 1.13 GB (printed). Local: `checks.py` under
`scripts/memcap.sh 8`. Files: `fe_lp.py`, `checks.py`, `checks.json`, `mktab.py`, `tables.md`, `logs/`.

## 7. Controls

| control | section 2 to 4 statements | test of section 6 |
|---|---|---|
| ZQ | not in the class "N on integers": fails Proposition O's hypothesis through integrality (N_off = F dx). Lemma S6 holds for it (balance measured). Phi_1 >= 0.077 sqrt(eps) on the measured members | not a member (density); its law eta^2 + d^2 is reproduced inside the class at defect delta_0 + 0.31 eta^2 |
| SG | same as ZQ, with F of one sign in the logarithm (D <= 0); N_off is signed by Lemma S6 | not run |
| NR-q, every lift z | fails through integrality (frequencies log n + j log q); passes multiplicativity on its own semigroup; Lemma LR: zeros at 1/2 +- b for every z | not a member |
| T-NR symmetric, q -> 1 (Proposition W) | passes: functional equation, pole clause, N >= 0, frequencies within delta, cluster weights constant. Fails: support clause by delta, exponent Ramanujan bound by b | not a member (frequencies off the integers) |
| Davenport-Heilbronn, DH5e | other gamma factor or frequencies log(n/sqrt 5): outside the class; nothing here is tested on it | not a member |
| backward heat, zeta(s+a)zeta(s-a) renormalised | no coefficient measure on [1, inf) (c15 table F5, F7): outside | not a member |
| sign-twisted primes, unimodular twist | integer frequencies, multiplicative, without zeta's functional equation: in direction (iii) they are members whose defect is not small; nothing here excludes them at small defect other than the measured law | not run; the shift n^alpha (completely multiplicative) is the benchmark: defect 1.14 alpha at X = 4000 |
| Beurling | Proposition W is a Beurling-type member (one generalised prime at 1 + delta) | not a member |
| phase-rotated transfer operator, theta^w | not formulable in this cell (no coefficient measure with zeta's functional equation on file) | not run |

No statement in this file holds for zeta and fails for a control through multiplicativity. The statements
that separate zeta from the controls do so through integrality (ZQ, SG, NR-q, T-NR) or through the support
clause (Proposition W).

## 8. Verdict and requirement flags

Verdict: **precise obstruction.** The U3 cell read as an inequality factors into (1) stability of the
identification (zeros of a nearby member lie near zeros of zeta or are born at near-double zeros; reads the
functional equation and integrality; Lipschitz on the coefficient side, square root on the zero side by
Lemma R) and (2) the location of the zeros of zeta (the target; Proposition TL). Multiplicativity enters
neither part: Hamburger and Theorem P do not use it, the server test shows the same law with and without it,
and the only control that the score rule wants excluded "through multiplicativity" (NR-q) is multiplicative.
Statements proved here are about classes of functions and about a finite model; none is about zeros of zeta.
The quantitative statement "zeros within f(delta) of the line" is target-level in all three directions.

- **R1 (multiplicativity essential): not established; evidence against in this cell.** Table of 6.2: ratio
  multiplicative/unconstrained between 1.003 and 1.40, same law; Proposition O; section 5.
- **R2 (height-uniform, every window): no.** Proposition W and ZQ both show the opposite shape: the relaxed
  classes agree with zeta on every fixed window and differ at height pi/delta or where d is small.
- **R3 (controls fail for a structural reason): no** in the sense of the rule. Each control fails a hypothesis
  of the identification class at a named step (table of section 7), but through integrality or the support
  clause, and one referee has not seen this file.
- **R4 (reaches the critical line): no.** Proposition TL: the inequality at delta = 0 is the target. The model
  of section 6 cannot define a zero of a defective finite vector other than through a symmetrised functional
  (6.1), which is the finite-stage wall in numerical form.

## 9. Three weakest steps

1. **The model of the test (6.1).** "A zero of G" for a finite integer-supported vector with a defective
   functional equation is not defined by the data; the test uses the zero of Lambda_phi*, which is real on the
   line for every real vector. This choice builds the square-root law in and excludes the linear mechanism
   (the shift n^alpha, zeros at distance alpha with defect 1.2 alpha). With the true continuation the reach in
   the multiplicative class is at least delta/1.2, which is larger than the model's 0 at the tested heights.
   The comparison of the two classes is valid for the model only; theta_0 = 0.1, the grid, the sup norm on
   real and imaginary parts and the boxes (31; [0, 2] for v_q; r <= 4) are choices, and the first pair is
   infeasible because of the boxes. Seven pairs at heights 17 to 124 only; delta = 1e-2 to 1e-4 would need
   pairs with d below 0.18, which were not tested.
2. **The scale of the assignment was not reached for the relaxation.** The unconstrained LP was solved at
   X = 300; at X = 4000 it did not finish and is replaced by an argued bracket. The multiplicative column is a
   local optimum of a non-convex program (sequential LP from the point a = 1); the true minimum over the class
   can be lower, never below the LP lower bound of the relaxation. Several unconstrained cells stopped at a
   time limit and are reported with both bounds; one cell (pair 40, eta = 0.3) has no result. Float64 only.
   The ratio is an upper estimate of the gap between the classes, which is the direction that supports the
   verdict, but no certificate was produced. No MILP was run; the multiplicativity constraints were imposed
   exactly through the prime-power parametrisation instead.
3. **Phi_1 >= c sqrt(eps) on the whole ZQ family is ARGUED**, measured on 8 members at heights 88 and 111.
   Uniformity in gbar uses the first-order form of M and the mean of abs(cos); no constant was proved. The
   error term in abs(c_j) = (eta^2 + d^2)/(2d)(1 + O(1/gbar)) is read off the closed form and checked on the
   same 8 members only. Proposition W and Lemmas S6, R, LR, O, TL are elementary and are the parts a referee
   should check first; none of them is a statement about zeta.
