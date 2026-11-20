# c18-u4-group-law-left-of-one-torus-orbit: RESULT

Lane type: attack, kind explore. Cell U4 residual (iv): a group-law inequality at several points that holds left of
Re s = 1. Unrefereed.

Verdict: **precise obstruction**. No statement about zeros of zeta is claimed. The cell is closed for this read:
every inequality of the 3-4-1 type that is obtained from positivity and the group law is, left of 1, one of two
things. Either it is an absolutely convergent test of the sign of Lambda (then it is true, it reads exactly the
set {POS, the singular data used to rewrite it}, it is passed by named controls as soon as one clause of the
identification class of row P56 is dropped, and its pole term dominates every zero term at distance more than
log 2 / (mean log-length of the test) from the line Re s = 1), or it is a pointwise bound, and then its truth on
an open set is the same statement as the absence of zeros there. Stage A leaves passing controls (E_a with its own
poles; the lift of G_+; DEL, THIN and U when the functional equation is not read), so by the assignment the lane
ends with a map row. T-NR at a split prime is not a passer of this read: it fails at the first step (sign of the
coefficient at p0^2).

Labels: PROVED (argument in this file), CLASSICAL (recalled, source not opened), MEASURED (numerics; float64
unless a line says otherwise), ARGUED, OPEN.

## 0. Answers stated before work

| | expected before work | after work |
|---|---|---|
| R1 multiplicativity essential | no: the 3-4-1 step is a sum of terms that are non-negative atom by atom; it uses abs(chi(n) n^-it) = 1 at each n, no relation between primes | false (Lemma GL, PROVED) |
| R2 height-uniform, every window | the inequality itself holds at every t; any conclusion drawn from it carries a log t term | false for every conclusion (section 4); the inequality (C-F) holds at every t |
| R3 every control fails at a named step | no: E_a satisfies it with its own pole (on file) | false: E_a, G_+ lift pass every step; DEL, THIN, U pass up to the functional-equation step (section 3) |
| R4 reaches the critical line | no continuation step known | false (Theorem T and Lemmas S, V) |

Entry test (STRATEGY section 1). Q-P: the step is of type X1 (log level, Lambda_F >= 0), outside S1 to S3, so
Lemma P does not make T-NR pass; checked directly in section 3. Q-B, Q-S: not a scattering-coefficient or
symmetric-multiplier device. Q-A: yes, clause (b): the step reads the sign of Lambda against every density, with
zero margin on the gaps between prime powers; ZQ fails it at every size of the defect (section 3).

## 1. Plan; what is new against the map

Nearest rows: G38 (pair functionals; Lemma C), G41 (dictionaries DJ, DN), P56 (Theorem P, identification class
{zeta's functional equation, pole at 1 only, finite order, N >= 0}), the section 2 note on ZQ with Lemma L and the
referee's G_+, rows of `c16-qa-filter-silent-cells-geometric-nodes` (U4 (i) to (iv)), `s1-prime-torus-orbit`
(Lemma R: a twist is a rotation of the torus), `c3-twinladder-prime-built-chain` (no stage is Hermite-Biehler;
the prime chain is lossless about Re s = 0 only).

New here: (1) the displayed form (C-F) of the 3-4-1 inequality with every term finite for 1/2 < sigma < 1 and
the sign of each term; (2) Lemma GL: the group law at shifts, or at powers of a character, is the statement
"k -> Lambda_k is a positive-definite sequence of measures", atom by atom; (3) Theorem T: pointwise forms are
the target; (4) Lemma S and Lemma V: the two constraints that confine the convergent forms to the classical
region; (5) the control table for this read, with the first failing step for each control.

## 2. Work

### 2.1 First lemma: the displayed inequality in sigma < 1

Weights: a_0 = 3, a_1 = 4, a_2 = 1, so that sum a_k cos(k theta) = 2 (1 + cos theta)^2 >= 0. Points
s_k = sigma + i k t, k = 0, 1, 2. Test weight v_U(u) = (1 - u/U)_+ on u >= 0, X = e^U, with transform
M_U(z) = integral of v_U(u) e^(zu) du = (X^z - 1 - zU)/(z^2 U) (entire; M_U(0) = U/2).

**Identity E (CLASSICAL, Riesz mean of order one; re-derived; MEASURED defect below).** For every s that is not
a zero or the pole,

    S_U(s) := sum_n Lambda(n) n^-s (1 - log n / U)_+
            = - zeta'/zeta(s) - (1/U)(zeta'/zeta)'(s)                  [double pole of the kernel at z = 0]
              + X^(1-s) / ((1-s)^2 U)                                  [pole of zeta at 1]
              - sum over rho of X^(rho-s) / ((rho-s)^2 U)              [non-trivial zeros; reflected members included]
              - sum over j >= 1 of X^(-2j-s) / ((2j+s)^2 U)            [trivial zeros = gamma factor].

Every series converges absolutely. Derivation: S_U(s) = (1/2 pi i) integral over Re z = c > max(0, 1 - sigma) of
M_U(z)(-zeta'/zeta)(s+z) dz; the part X^z/(z^2 U) is moved to the left over all singularities, the part
-1/(z^2 U) - 1/z is moved to the right, where it contributes nothing. With L*(s) = -zeta'/zeta(s) - 1/(s-1) the
first three terms are M_U(1-s) + L*(s) + L*'(s)/U.

Where the two inputs enter. **[MULT]** the left side: -zeta'/zeta(s) = sum Lambda(n) n^-s with Lambda >= 0
supported on prime powers is the logarithmic derivative of the Euler product over all primes. **[FE]** the
list of singularities to the left of Re z = -sigma (the trivial zeros, that is, the gamma factor) and the
symmetry rho <-> 1 - conj(rho) of the zero sum; without the functional equation the contour stops at the edge of
the region of continuation and a remainder integral replaces the last sum and part of the zero sum.

**Candidate inequality (C-F) (PROVED: it is sum over n of Lambda(n) n^-sigma v_U(log n) 2 (1 + cos(t log n))^2).**
For every sigma (in particular 1/2 < sigma < 1), every real t and every U > 0,

    0 <= T(sigma, t; U) := 3 S_U(sigma) + 4 Re S_U(sigma + it) + Re S_U(sigma + 2it)
       =   3 M_U(1 - sigma)                                              (+)  pole, k = 0; equals 3 X^(1-sigma)/((1-sigma)^2 U) (1 + o(1))
         + 4 Re M_U(1 - sigma - it) + Re M_U(1 - sigma - 2it)            (+-) pole seen from k = 1, 2; modulus <= 5 ((X^(1-sigma) + 1)/(t^2 U) + 1/t)
         + 3 L*(sigma) + 4 Re L*(sigma + it) + Re L*(sigma + 2it)        (+-) regular part of -zeta'/zeta at the three points
         + (1/U)(3 L*'(sigma) + 4 Re L*'(sigma + it) + Re L*'(sigma + 2it))   (+-)
         - sum over rho, k of a_k Re [X^(rho - s_k) / ((rho - s_k)^2 U)]  (+-) zeros; a zero rho = beta + i k t contributes
                                                                              - a_k X^(beta - sigma)/((beta - sigma)^2 U) < 0 at member k
         - sum over j, k of a_k Re [X^(-2j - s_k) / ((2j + s_k)^2 U)]     (-) at k = 0; gamma term, at most 8 X^(-2-sigma)/(4U) in modulus.

Reduction to 3-4-1: for sigma > 1 let U -> infinity; the X-terms and the 1/U terms tend to 0 and (C-F) becomes
-3 zeta'/zeta(sigma) - 4 Re zeta'/zeta(sigma + it) - Re zeta'/zeta(sigma + 2it) >= 0.

Check of Identity E and of the term list (`local_checks.py`, mpmath 30 digits, 800 zeros, X = 30; MEASURED):

| sigma | t | prime side T | pole terms | log-derivative terms | derivative terms | zero terms | gamma terms | defect |
|---|---|---|---|---|---|---|---|---|
| 0.75 | 14.1347 (first zero) | 2.03539 | 33.0365 | -27.6755 | 4.7027 | -8.0283 | -1.1e-5 | -8.7e-7 |
| 0.75 | 5.0 | 5.01620 | 33.0535 | -14.1160 | -13.9249 | 0.0036 | -1.3e-5 | -2.7e-6 |
| 0.60 | 25.0109 (third zero) | 2.59464 | 21.4957 | -47.1986 | 109.0038 | -80.7063 | -1.9e-5 | -2.3e-9 |
| 0.90 | 40.0 | 4.32359 | 123.9378 | -29.8423 | -89.6015 | -0.1704 | -5.5e-6 | -5.0e-7 |

(The pole terms here are the X^(1-s)/((1-s)^2 U) terms; the defect is the truncation of the zero sum.)

### 2.2 Lemma GL: what the group law contributes

**Lemma GL (PROVED; Herglotz and Fejer-Riesz are CLASSICAL).**
(a) Shifts of one object. The set of tests g(n) = n^-sigma v(log n) sum_k a_k cos(k t log n), over all v >= 0,
all sigma, t and all non-negative trigonometric polynomials, generates the cone of all non-negative test
functions (it contains every v, taking the polynomial 1). Hence the family of all inequalities of the type (C)
is equivalent to "Lambda is a non-negative measure" and to nothing more.
(b) Powers of a character, or any family F_k with coefficient measures Lambda_k. The inequalities
sum_n g(n) sum_k a_k Re Lambda_k(n) >= 0 for all g >= 0 and all non-negative polynomials hold iff for every atom
n the sequence k -> Lambda_k(n) is positive definite on Z, that is, Lambda_k(n) = integral of e^(ik theta) d mu_n
with mu_n >= 0 a measure on the circle. For (zeta, L(chi), L(chi^2), ...) at the points s + ikt,
mu_n = Lambda(n) times the unit mass at arg(chi(n) n^-it).
(c) The only arithmetic fact used is abs(chi(n) n^-it) = 1 with chi^k(n) = chi(n)^k at each n separately. No
relation between different primes enters: each atom contributes a non-negative term on its own. In the language
of `s1-prime-torus-orbit`: the inequality is a statement about each coordinate of the torus point (p^-it)_p
separately, and by Lemma R of that lane a unimodular twist (a rotation of the torus) satisfies it as a family.

Consequence for R1: the group-law step is passed by every family whose coefficient measures are positive
definite in k, whatever the relations between primes. Multiplicativity enters only through [MULT] of 2.1, as
the sign and support of Lambda.

### 2.3 Theorem T: pointwise forms are the target

**Theorem T (PROVED, elementary).** Let Omega be an open set in Re s > 1/2, tau_1 < ... < tau_m real, such that
no set Omega + i tau_j contains the point 1, and a_1, ..., a_m > 0. The following are equivalent: (i) sum_j a_j Re(-zeta'/zeta)(s + i tau_j) is
bounded below on every compact subset of Omega (away from the points where a term is infinite); (ii) the same
for sum_j a_j log abs(zeta(s + i tau_j)); (iii) zeta has no zero in any of the sets Omega + i tau_j.
Proof. (iii) => (i), (ii): the functions are continuous. Not (iii) => not (i): if rho_0 = s_0 + i tau_j is a
zero of order m_j >= 1, then at s = s_0 + eps (eps > 0 real) the sum equals -(sum over the members with a zero
at s_0 + i tau_k of a_k m_k)/eps + O(1), and the coefficient is positive since no member has a pole in Omega +
i tau_k. Not (iii) => not (ii): the sum is (sum a_k m_k) log eps + O(1). For signed weights the same computation
gives the balance law sum_k a_k ord(s_0 + i tau_k) = 0 at every point as the condition for boundedness.

So a candidate "3 A(sigma) + 4 Re A(sigma + it) + Re A(sigma + 2it) >= -B(sigma, t)" with A = -zeta'/zeta or
log abs(zeta), B finite, valid for all t on a strip sigma_0 < sigma < 1, is true iff the strip is zero-free. It
cannot be an intermediate lemma: its proof would be the continuation step itself. The size of B that the
target allows is not at issue (under RH, B of order (log t)^(2-2 sigma) is the classical size).

### 2.4 Lemma S and Lemma V: the convergent forms are confined to the classical region

General test: v >= 0 on [0, inf), bounded, right-continuous at 0, M(z) = integral of v(u) e^(zu) du finite for
Re z <= 1 - sigma. Then T_v(sigma, t) = sum_n Lambda(n) n^-sigma v(log n) 2 (1 + cos(t log n))^2 >= 0, and its
analytic side has the pole term a_0 M(1 - sigma) and the zero terms - a_k Re M(rho - s_k).

To conclude anything about one zero rho_0 = beta_0 + i gamma_0 from T_v >= 0 at t = gamma_0 one needs (1) a
bound for the terms of all other zeros, in the classical argument their sign: Re M(rho - s_k) >= 0, and (2) the
term of rho_0 to exceed the pole term.

**Lemma S (sign control; PROVED, Bochner's theorem CLASSICAL).** If Re M(a + iy) >= 0 for all real y, then
(i) the same holds for every a' < a, and (ii) v(u) <= v(0+) e^(-au) for almost every u. Proof: Re M(a + iy) is
half the Fourier transform of the even function f_a(u) = v(abs u) e^(a abs u); a bounded integrable function with
non-negative transform is positive definite, so abs f_a <= f_a(0); (i) because f_a' = f_a e^(-(a - a') abs u) and
e^(-c abs u) is positive definite.
Consequence. If the zero terms are to be non-negative for every possible position of a zero in the strip seen
from sigma (a >= 1 - sigma), then v(u) e^(-sigma u) <= v(0+) e^(-u): the test is dominated term by term by the
test at abscissa 1, and T_v is a 3-4-1 inequality at abscissa sigma + a >= 1 with a damped weight. With a
zero-free input "no zeros in Re s > theta" the same holds with theta in place of 1. A test whose zero terms are
sign-controlled lives at or to the right of the abscissa up to which zeros are allowed. For the Fejer weight
v_U the sign region is exactly Re z <= 0 (MEASURED: min over y of Re M_U((c/U) + iy) U^-1 = 2.8e-10 at c = 0,
-0.032 at c = 0.5, -0.081 at c = 1, -0.27 at c = 2).

**Lemma V (pole dominance; PROVED, Jensen).** M is positive and log-convex on the real axis, and
M(1 - sigma)/M(beta_0 - sigma) >= exp((1 - beta_0) ubar), ubar = M'(beta_0 - sigma)/M(beta_0 - sigma), the mean
of u = log n under the weight v(u) e^((beta_0 - sigma) u). The term of a zero of order m at rho_0, seen from
member k = 1, exceeds the pole term only if m a_1 M(beta_0 - sigma) > a_0 M(1 - sigma); for a non-negative
trigonometric polynomial a_1 < 2 a_0 (Fejer; here a_1/a_0 = 4/3). Hence a simple zero can be reached only if

    (1 - beta_0) ubar < log(a_1/a_0) < log 2,

even when every other term is dropped with the favourable sign. To reach a zero at distance delta from Re s = 1
the test must have mean log-length below log 2 / delta (for 4/3: 0.288/delta; delta = 0.1 gives ubar < 2.88,
geometric-mean n below 18; delta = 0.4 gives n below 2.1).

Height. For a sign-controlled test (Lemma S with a = 1 - sigma) M(beta_0 - sigma) <= v(0+)/delta, delta =
1 - beta_0, while the other terms are of size v(0+) log t: for a weight with v(0+) > 0 the analytic side contains v(0+) times
(-zeta'/zeta) at the three points (in (C-F) these are the terms L*), whose total over the zeros within bounded
distance is of order log t; for the on-line zeros the mean of Re M(1/2 - sigma + iy) over y against the
density (1/2 pi) log t is (v(0+)/2) log t (PROVED as a computation: integral of M(a + iy) dy = pi v(0+)). With
v(0+) = 0 the same mean is 0 and the terms of the on-line zeros have both signs. Worked case (Fejer weight,
sigma = beta_0, all other terms dropped with the favourable sign, MEASURED from the closed form): the signal
U (2 - 3 g(delta U)), g(x) = (e^x - 1 - x)/x^2, has supremum 0.1117/delta (5.59 at
delta = 0.02, 2.23 at 0.05, 1.12 at 0.1, 0.56 at 0.2, 0.28 at 0.4), against 2.5 log t: reachable heights
t < 9.3, 2.4, 1.6, 1.3, 1.1. The general statement "the region reached by any test v is 1 - beta << 1/log t"
is ARGUED from Lemmas S and V; it is PROVED only for the weights e^(-cu) (the classical argument).

Together: left of 1 the convergent forms either lose the sign of the other zeros (Lemma S) or are dominated by
the pole (Lemma V), and the trade is the classical zero-free region. Neither lemma is new mathematics; they are
recorded as the two named steps at which a "3-4-1 left of 1" stops.

## 3. Controls (stage A table)

Steps of the device: (1) POS: Lambda_F >= 0 as a measure, or positive definiteness in k for a family
(Lemma GL); (2) GL: the square 2 (1 + cos)^2; (3) EF: the analytic side, with [FE] for the reflected members and
the gamma term; (3') INT/pole clause: the only pole term is the one at s = 1; (4) the deduction about a zero.
Step (4) is not available for any object (Theorem T, Lemmas S, V). A control "passes" when (1) to (3) hold for
it with its own singular data and it has zeros off the line.

| control | first step that fails | detail | status |
|---|---|---|---|
| E_a, lift L(s+a, chi^k) L(s-a, chi^k) | none of (1) to (3); (3') only | Lambda_k(n) = chi^k(n) Lambda(n)(n^a + n^-a): positive definite in k; own poles at 1 +- a; zeros at rho +- a (on Re s = 1/2 +- a for the zeros of zeta on the line) | PROVED |
| G_+ of the c15 referee, lift F_k = L(s, chi^k) m_+(s) | none of (1) to (3); (3') only | zeta's functional equation, every atom, added density D_+ >= 0 (the same for every k: a constant sequence is positive definite), off-line quartet in every member, double real poles at 1/2 +- b. Minimum of D_+ on a grid: 0.0 (attained at x = 1) | PROVED given the map note on G_+; MEASURED minimum |
| DEL | (3) EF at [FE] | Lambda_F >= 0, Euler product, integers, one simple pole at 1, real zero at b in (1/2, 1); (C) holds with a contour stopped at Re s > max(b - eta, b/2). Passes (1), (2), (3') | PROVED-rel the map row for DEL |
| THIN | (1) as a single object (sign of Lambda at primes of S); as the family (zeta, F, zeta) it passes (1), (2) and fails (3) at [FE] | eps^2 = 1, so k -> eps(n)^k Lambda(n) is positive definite; zero at b, pole at 1 | PROVED-rel the map row for THIN |
| U (unimodular twist), sign twist TW- | as a family (zeta, L_u, L_(u^2), ...): (3) at [FE]; as a single object: (1) | rotation of the torus (Lemma R of s1); positive definite in k | PROVED |
| TW+ | (3) at [FE] | Lambda_F >= 0 | PROVED |
| T-NR (q = 3, c = 2.2), also at a prime split for every character | (1) at the atom p0^2 | Lambda_m(p0^k) = -log p0 (w1^-k + w2^-k) with w1, w2 < 0: Lambda_F(3^k) = 5.28, -8.26, 24.2, -58.9, 160.3, -425.6 for k = 1..6. At a split prime the added sequence is constant in k, and a constant sequence is positive definite iff it is >= 0. A test supported on (log 8.1, log 10.9) gives T < 0 at t = 0. Lemma C of row G38 (common factors cancel in ratios) does not apply: no ratio is taken | PROVED; values MEASURED |
| NR-q (q = 1 + sqrt 2, c = 2.1) | (1) at the atom q^2 (off log N) | Lambda at q^k: 2.88, -5.13, 9.79, -19.56 | PROVED; values MEASURED |
| ZQ | (1) on the gaps between prime powers | D is signed with sign -cos(gbar log x); T_zeta = 0 for a test supported in a gap, so T_ZQ < 0 for a test on a sub-interval where D < 0, at every size of the defect (example: zeros 1, 2, eta = 0.1: D ranges over [-0.065, 0.483] on (5, 7)). This is the entry condition of c16 item 2 (a step that fails for ZQ with defect tending to 0); it is met because the family (C) is the hypothesis N >= 0 of Theorem P | PROVED |
| SG | (1) on the gaps (D <= 0) | | PROVED |
| BLS (symmetric zero set, f = xi P) | (1) on the gaps | -P'/P adds a signed absolutely continuous density | PROVED |
| DH | (1) | no Euler product; Lambda_DH signed; no pole | PROVED; MEASURED table below |
| backward heat, coefficient form sum e^(tau log^2 n / 4) n^-s | (1) at n = 6 | Lambda_F(6) = a(2) a(3) log 6 (e^(tau log 2 log 3 / 2) - 1) < 0 for tau < 0: -0.2515, -0.0642, -0.0034 at tau = -0.5, -0.1, -0.005; zeta has no mass at 6, so a test supported on (log 5.1, log 6.9) fails at every tau < 0. The kernel form H_tau is not an ordinary Dirichlet series: not formulable there | PROVED (coefficient form) |
| EIS-w, WT (window translate) | (1) as single objects (complex coefficients Lambda(n) n^(-i alpha)); each zeta factor separately passes at its own base point | the inequality needs the pole at the base point of the triple: the orbit must start at theta = 0 | PROVED |
| interpolation twin | (1) | no Euler product, no sign | PROVED |
| Beurling-rational member (new, auxiliary) F(s) = (s - rho)(s - conj rho)/((s - 1)(s - (2 beta - 1))) | (3) at [FE]; (3') | coefficient density abs(1 - x^(rho - 1))^2 dx >= 0 on x > 1, simple pole at 1, zeros at beta +- i gamma for any beta < 1, second pole at 2 beta - 1 < beta. The density is itself a group-law square. Mellin identity checked to 8.8e-14 | PROVED |

Reading of the table. Passers of {POS, GL}: TW+, DEL, THIN and U as families, E_a, G_+, the Beurling-rational
member. Of these, with the functional equation: E_a and G_+; both fail only the pole clause. With POS, the
functional equation, the pole clause and finite order together the class is the identification class of
Theorem P (row P56): no control can lie in it, and the conclusion there is G = r zeta, with no statement about
zeros. So the read set of this cell is inside U3 (cell U2-POS), as c16 section 0 item 6 anticipated for the
case of an unbounded parameter set. T-NR and E_a, named in the assignment as the known passers: E_a passes;
T-NR does not, because this device is of type X1 of Lemma P (log level).

### 3.1 Decisive first test of the assignment: condition not met; reduced measured table

The assignment makes the server test conditional on stage A leaving no passing control. It leaves several, so
the registered test (ball arithmetic, 1e5 points, heights to 1e9) was not run as a decision. A reduced float64
table of the prime side of (C-F) was run on the server as a record of the control table (unit
`rh-c18u4-1120044113`, 4 cores, 4 GB cap; `prime_side_test.py`; all n <= 1e6, 1e5 points with sigma uniform in
[0.55, 0.95] and t log-uniform in [1, 1e9]; MEASURED, float64, phase error below 1e-5 rad). Ratio =
T_F / (3 sum abs(Lambda_F(n)) n^-sigma v_U(log n)); "neg" = fraction of points with ratio < -1e-3.

Random points (N = 1000000, 100000 points, 2566 s):

| family | X = 20: neg; min ratio; median | X = 1000: neg; min ratio; median | X = 1e+05: neg; min ratio; median | X = 1e+06: neg; min ratio; median |
|---|---|---|---|---|
| ZETA | 0.0000; 0.1794; 0.9389 | 0.0000; 0.4575; 0.9850 | 0.0000; 0.6654; 0.9975 | 0.0000; 0.7256; 0.9993 |
| E_a(0.1) | 0.0000; 0.1798; 0.9393 | 0.0000; 0.4713; 0.9871 | 0.0000; 0.6970; 0.9987 | 0.0000; 0.7663; 1.0000 |
| T-NR(3,2.2) | 0.0879; -0.3693; 0.6729 | 0.0209; -0.2069; 0.6868 | 0.0003; -0.0561; 0.6849 | 0.0000; 0.0011; 0.7037 |
| DH | 0.6373; -1.4316; -0.1026 | 0.5613; -0.8522; -0.0140 | 0.5163; -0.4913; -0.0018 | 0.4857; -0.3762; -0.0006 |
| LIOUVILLE | 0.9777; -1.8466; -0.7003 | 1.0000; -1.4078; -0.8041 | 1.0000; -1.2169; -0.9132 | 1.0000; -1.1733; -0.9452 |
| HEAT(-0.5),coef | 0.0000; 0.0154; 0.8348 | 0.0156; -0.2469; 0.4367 | 0.0233; -0.2797; 0.2650 | 0.0247; -0.2877; 0.2205 |

Heights of the first 2000 zeros of T-NR, t = (2k+1) pi/log 3, at sigma = 0.9038 (their abscissa):

| family | X = 20: neg; min ratio; median | X = 1000: neg; min ratio; median | X = 1e+05: neg; min ratio; median | X = 1e+06: neg; min ratio; median |
|---|---|---|---|---|
| ZETA | 0.0000; 0.2346; 0.7635 | 0.0000; 0.4776; 0.9337 | 0.0000; 0.6742; 0.9679 | 0.0000; 0.7384; 0.9757 |
| E_a(0.1) | 0.0000; 0.2362; 0.7650 | 0.0000; 0.4895; 0.9373 | 0.0000; 0.7049; 0.9724 | 0.0000; 0.7778; 0.9803 |
| T-NR(3,2.2) | 0.5560; -0.2744; -0.0234 | 0.5105; -0.2483; -0.0030 | 0.0645; -0.0948; 0.0785 | 0.0010; -0.0194; 0.1263 |
| DH | 0.8265; -0.7640; -0.1635 | 0.8045; -0.4399; -0.0801 | 0.7680; -0.2115; -0.0302 | 0.7575; -0.1463; -0.0195 |
| LIOUVILLE | 0.9110; -1.2481; -0.4541 | 1.0000; -1.1025; -0.6424 | 1.0000; -1.0461; -0.7865 | 1.0000; -1.0327; -0.8309 |
| HEAT(-0.5),coef | 0.0000; 0.0526; 0.5891 | 0.0140; -0.2295; 0.4253 | 0.0275; -0.3070; 0.3308 | 0.0300; -0.3184; 0.3074 |

Reading (MEASURED). zeta and E_a: no negative value at any of the 100,000 random and 6,014 targeted points, at
any test length (forced by POS). DH and the Liouville twist (as single objects): negative at about half and at
all points. Backward heat in coefficient form: negative at 1.6 to 2.5 percent of random points for X >= 1e3 and at none for
X = 20. T-NR: negative at 8.8 percent of random points for X = 20, 2.1 percent for X = 1e3, 0.03 percent
for X = 1e5 and at none for X = 1e6 (minimum ratio +0.0011); at its own zero heights 55.6, 51.1, 6.5 and 0.1
percent. So the control with zeros on Re s = 0.9038 fails the hypothesis POS (step (1), short tests containing
the atom 9) and almost satisfies the long-test inequality: the long tests are dominated by the pole term, as in
Lemma V. No dependence on the decade of t from 1 to 1e9 is visible for any family (table by decade in
`server_table.md`, with the other targeted sets: T-NR heights at sigma = 0.85 and 0.95, the two off-line zero
heights of DH, the first ten zero heights of zeta at sigma = 0.6). A local run at N = 1e5, 2e4 points gives the
same picture (`prime_side_test_100000_20000.json`).

## 4. Verdict and requirement flags

Precise obstruction; the cell U4 (iv) is closed for the read "a positivity-derived inequality on shifts s + ikt
or on powers of a character, with pole and gamma terms explicit".

- **R1: false.** Evidence: Lemma GL (c). The group-law step holds atom by atom; U, THIN, TW+ and DEL pass it.
  The step [MULT] uses the sign and support of Lambda only. The T-NR and NR-q failing step is the sign of one
  local coefficient (step (1)), not the group law over all primes.
- **R2: false** for any conclusion. The inequality (C-F) holds for every t and every window (PROVED), but it
  is not a statement about zeros; every use of it against a zero carries the term of size v(0+) log t
  (section 2.4), and the pointwise forms are the target (Theorem T).
- **R3: false.** E_a and the lift of G_+ pass steps (1) to (3) with their own poles; DEL, THIN, U pass (1), (2).
  With the pole clause added the read set is an identification class, where "no control passes" holds by
  construction and yields no inequality.
- **R4: false.** No continuation step. Left of 1 the convergent forms are confined by Lemmas S and V; the
  pointwise forms are equivalent to the conclusion.

Proposed map row (not applied; this lane does not edit the map). **G42 (or the next free label)**: "3-4-1
left of Re s = 1 (cell U4 (iv); shifts s + ikt and powers of a character; carrier: prime torus orbit). The
Fejer-weighted form (C-F) holds for every sigma, t with every term finite in 1/2 < sigma < 1 (identity E).
Lemma GL: the family of all such inequalities is the positivity of Lambda (shifts) or positive definiteness in
k atom by atom (characters); no relation between primes is read. Theorem T: a pointwise lower bound with
positive weights holds on an open set iff the set is zero-free. Lemma S: sign control of the zero terms up to
abscissa theta forces v(u) e^(-sigma u) <= v(0+) e^(-theta u). Lemma V: a zero at distance delta from Re s = 1
needs mean log-length < log 2/delta. Controls: E_a and the G_+ lift pass every step with their own poles; DEL,
THIN, U, TW+ pass without the functional equation; T-NR fails at the sign of the coefficient at p0^2 (also at a
split prime), NR-q at q^2, ZQ, SG, BLS on the gaps, HEAT (coefficient form) at n = 6, DH at the sign. With the
pole clause the read set is the identification class of row P56. Status: PROVED (elementary) / CLASSICAL;
MEASURED tables; unrefereed."

No pivot was taken: the adjacent ideas (a quantitative form of POS with the functional equation; a relation
between primes read on the torus) are the cells U3-as-an-inequality and the lanes on Proposition M, which
other lanes of this round hold.

## 5. Three weakest steps

1. **The general ceiling is ARGUED, not proved.** Lemmas S and V are proved, and the Fejer and exponential
   weights are worked out, but the statement "no test v reaches beyond 1 - beta << 1/log t" is assembled from
   them without a written proof for weights with v(0+) = 0 whose zero terms are bounded by other means (for
   example by a density estimate). Such uses exist in the literature (zero-density and zero-repulsion
   arguments); they give statements about counts, not an empty set, and are outside what this file proves.
2. **The control rows for DEL, THIN and G_+ rest on map rows, not on a new derivation.** The claim "passes (C)
   with a truncated contour" for DEL and THIN uses their continuation as recalled in the map (PROVED-rel
   short-interval prime theorems); the lift of G_+ to L(s, chi^k) m_+(s) is new here and only the density sign
   was checked (analytically and on a grid); the functional equation of the lifted members is by symmetry of
   m_+ and was not checked numerically.
3. **Scope of "group-law inequality".** The closure is for inequalities derived from positivity of a measure
   through non-negative trigonometric polynomials (the 3-4-1 mechanism) and for pointwise bounds. A relation
   among values at several points that is not of either kind (for example an inequality that reads phases at
   different primes jointly, or one that is quadratic in the log-derivative) is not covered; none is on file,
   and the dictionaries DJ, DN (row G41) searched kernel-side forms only. The server table is a float64 screen
   with prime powers and integers up to 1e6; it records the control table and decides nothing.

## 6. Files

- `local_checks.py`, `local_checks.json`: identity E, the sign region of the Fejer transform, the worked
  ceiling, control constants (mpmath, 30 digits; run through `scripts/memcap.sh 8`).
- `prime_side_test.py`, `prime_side_test_1000000_100000.json`, `make_table.py`, `server_table.md`: server table
  (rhrun unit above, 2566 s, finished and inactive; a first unit `rh-c18u4-1120043912` failed at start because
  the script had not been copied, and was cleared with reset-failed). `prime_side_test_100000_20000.json` and
  `prime_side_test_20000_2000.json`: local runs of the same script.
- `lanes.jsonl`: one line for this lane.

Incident note: two copy commands of this lane expanded `$S:rh-push` in zsh as a history modifier and wrote into
a local directory `[compute-server]h-push/` at the repository root. That directory already held a stray
copy `c17-u3-inequality-discontinuity-functional/fe_lp.py` from an earlier lane with the same expansion. The
directory was removed by this lane; the original `fe_lp.py` is present in its lane directory and on the server
(12375 bytes in both places). Nothing else outside this lane's directory was written.
