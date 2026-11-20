# c21-br0-br3-hamburger-finite-poles-regime3: RESULT

Date 2026-11-20. Round 21, kind: deepen. Scope: this directory only. Server: not used (the decisive first
test is a paper test and it decided the question; the numerics are sanity checks and ran locally through
`scripts/memcap.sh 8`, python3.14, mpmath at 40 to 50 digits: `checks.py`, `check_newman.py`, `ref_check.py`).
Nothing committed or pushed. No independent referee has read this file (referees = 0; `REFEREE.md` is the
author's adversarial pass and says so). **No statement about zeros of zeta is made. BR-3 as stated is an
identification (class U3): it names a function and locates no zero.**
Requirement flags: R1 = R2 = R3 = R4 = false.

Labels: PROVED (complete argument in this file; author only) / CLASSICAL (recalled; source not opened) /
MEASURED (mpmath, point values) / RELATIVE (to a row on file) / ARGUED / OPEN.

Sources read: `BRIEF.md` to the end; `campaign/STRATEGY.md` section 4.0; `c20-euler-shape-rigidity-infinite-
modified-primes` RESULT.md and REFEREE.md (both passes); `c19-hq2-screen-fe-int-mult-pos-devices` section 4.5
(Q-inf); `OBSTRUCTION_MAP.md` section 2 rows HQ2, HQ3, HQ4, THIN, DEL and rows P56, P57, X1.

## 0. Verdict

**BR-0 decides BR-3. BR-3 as stated is true and is Hamburger's theorem: G = zeta. Identification, class U3,
score 0. The registered expectation of the first test (HQ2, HQ3, HQ4 lie in a finite-dimensional
Hamburger space and are removed only by the geometric local shape) is false: the space is the line C zeta,
and HQ1 to HQ4 are outside it because each has infinitely many poles in Re s >= 1/2.**

1. (Theorem H, CLASSICAL = Hamburger's theorem in the form with finitely many poles, Titchmarsh, The Theory
   of the Riemann Zeta-function, section 2.13, recalled, not opened; a complete proof is written in section 2,
   so the statement is PROVED here and does not rest on the citation.) Let G(s) = sum a_n n^-s converge
   absolutely for Re s > 1, let G be meromorphic on C of finite order with finitely many poles, and let G
   have zeta's functional equation. Then G = a_1 zeta. The space asked for by BR-0 is one-dimensional. Its
   only member with an Euler product (a_1 = 1) is zeta.
2. (BR-3, PROVED.) Under the hypotheses of BR-3 the poles of G in Re s < 1/2 are reflections of the poles in
   Re s > 1/2 (Lemma 1), so G has finitely many poles in C and Theorem H applies: G = zeta. The hypotheses
   abs(alpha_p) <= 1, the Euler product and the divergence of sum abs(1 - alpha_p) p^-sigma are not used
   (the first only for absolute convergence in Re s > 1). **The proof uses no multiplicativity.** In the
   strip 1/2 < Re s <= sigma_rel it reads two clauses of the hypothesis, the growth bound and the finite
   pole count, and nothing of the local shape. The wall R4 in relative form is not crossed: the passage
   from Re s > 1 to the line is assumed in the hypothesis (continuation with a growth bound), not derived.
3. (First test.) HQ1, HQ2, HQ3, HQ4 have zeta's functional equation, integer frequencies, an Euler product
   and finite order, and are not in the space of statement 1. The failing clause is the pole count: the
   one-prime factor is periodic under s -> s + 2 pi i/log q, so its poles form lattices (on Re s = 1/2 for
   HQ1, HQ2; on Re s = 1/2 +- b for HQ3, HQ4), infinitely many of them poles of G (section 3). MEASURED at
   50 digits: with the residues at s = 0, 1 only, the theta relation of each member misses by 0.0087 to 4.2;
   adding the lattice residues with abs(k) <= K the miss falls geometrically to 1e-35 at K = 10 and is
   non-zero for each K <= 9; each lattice pole k = 0..6 has a non-zero residue. Their local factor at q
   departs from geometric at the exponent 2 (a(q^2) != a(q)^2) in every member. The departure is real but
   it is not what Theorem H reads.
4. (Consequences for the regimes of c20, PROVED from Theorem H; the second relative to c20 Theorem C (c).)
   (a) Regime 3 and Q-inf: a twin G != zeta with an absolutely convergent ordinary Dirichlet series in
   Re s > 1, zeta's functional equation and finite order has infinitely many poles in 1/2 <= Re s <= 1.
   Q-inf remains OPEN only for such G (poles unrestricted is the form in which c19 posed it).
   (b) Regime 2 (BR-2, abs(alpha_p) <= p^(1/2)): a twin of finite order has infinitely many poles of G, and by
   Theorem C (c) of c20 they are all on the critical line.
5. (BR-3 without the finite-order clause.) (a) Theorem H' (PROVED): finite order can be replaced by the
   bound log log abs(G(sigma + it)) <= k abs(t) + C in the strip -delta <= sigma <= 1 + delta for some k < pi/(1 + 2 delta);
   so a twin with finitely many poles has growth exponent at least pi in the critical strip.
   (b) Control NWM (PROVED construction; values MEASURED): for general (non-integer) frequencies the growth
   clause cannot be dropped and the constant is sharp. R(s) = 2 int_0^inf sin(r log r) e^(pi r/2) e^(-kappa (s - 1/2) r) dr
   is a Dirichlet integral with real density, absolutely convergent for Re s > 1/2 + pi/(2 kappa); it
   continues to an entire function with R(s) = R(1 - s), bounded by 2/(kappa abs(sigma - 1/2) - pi/2) outside the
   strip abs(sigma - 1/2) <= pi/(2 kappa), of growth exp(exp(kappa abs(t))/e) on the line. zeta(s)(1 + R(s)) has
   zeta's functional equation, the single pole at 1, no other pole, a coefficient measure on frequencies
   >= 0, and zeros off the line (kappa = 4: 0.947669 -+ 0.784676 i and its reflection, MEASURED, residual
   1e-47). It fails integrality and the growth clause, and is not multiplicative. At kappa = pi the
   threshold k < pi of (a) is met with equality.
   (c) For ordinary Dirichlet series (integer frequencies) BR-3 without a growth clause is OPEN. No twin is
   known; no proof is on file that the continuation has finite order. This is the exact residue of BR-3.
6. Nothing here raises a requirement score. The step in 1/2 < Re s <= sigma_rel does not read the functional
   equation and the local shape jointly; it reads the functional equation, the growth bound and the pole
   count. The identification holds verbatim at conductor 5 with the Davenport-Heilbronn function as the
   member (ARGUED, section 4), so it is base-blind.

Registered outcome: 'identification (class U3)'. Lead BR-3 is closed as a lead in the form stated in
STRATEGY.md 4.0. What is left of BR: BR-2 (natural boundary or a twin with infinitely many poles on the
line), Q-inf with infinitely many poles, and statement 5 (c).

## 1. Plan; what is new against the record

Plan as assigned: BR-0 first (Hamburger-type theorem with finitely many poles; list the space; test each
member for a degree-one Euler product), with the decisive test that HQ2, HQ3, HQ4 appear in the space; then,
if BR-0 decides BR-3, BR-3 without the finite-order clause.

Not new: Hamburger's theorem (1921; the map already uses it at conductor 1 in the pole-at-1 form: section 2
note 'FE + INT is Hamburger', row P57 (c), Statement O). New against the campaign record: (i) the form with
finitely many poles anywhere applied to BR-3, with the proof written out and the place of each clause
marked; (ii) the correction that HQ1 to HQ4 are outside the finite-pole class, so the pole clause that
separates them is 'finitely many poles', not 'no pole on the line'; (iii) statements 4 (a), (b); (iv) Theorem
H' and the control NWM (sharpness of the growth clause for general frequencies; rows P56 referee item E3 and
c20 Theorem C (b) left necessity of the growth clause unaddressed). None of these is new against the
literature in technique: (i) is a textbook theorem, H' is Phragmen-Lindelof, NWM is D. J. Newman's function
int_0^inf e^(zt) t^-t dt (Amer. Math. Monthly 1976, recalled, not opened) symmetrised.

Notation: gam(s) = pi^(-s/2) Gamma(s/2), Lam(s) = gam(s) G(s); 'zeta's functional equation' is Lam(s) = Lam(1 - s).

## 2. BR-0: the theorem and its proof

**Lemma 1 (PROVED).** Let G be meromorphic on C with Lam(s) = Lam(1 - s), analytic in Re s > 1, with finitely
many poles in Re s >= 1/2. Then G has finitely many poles in C, all in 0 <= Re s <= 1, and G(-2j) = 0 for
j >= 1. Proof: G(s) = chi(s) G(1 - s), chi(s) = pi^(s - 1/2) Gamma((1 - s)/2)/Gamma(s/2). For Re s < 1/2 the factor
Gamma((1 - s)/2) is analytic and 1/Gamma(s/2) is entire, so every pole of G there is the reflection of a pole
in Re s > 1/2. G(1 - s) is analytic for Re s < 0, so G is. 1/Gamma(s/2) vanishes at s = -2j. QED

**Theorem H (Hamburger; CLASSICAL; proof below).** Let G(s) = sum over n >= 1 of a_n n^-s converge
absolutely for Re s > 1. Let G be meromorphic on C with finitely many poles and of finite order (P(s) G(s)
entire of finite order for a polynomial P), and Lam(s) = Lam(1 - s). Then a_n = a_1 for every n: G = a_1 zeta.

Source: Titchmarsh, section 2.13 ('Hamburger's theorem'): f = G/P with G entire of finite order and P a
polynomial, f = sum a_n n^-s absolutely convergent for sigma > 1, f(s) Gamma(s/2) pi^(-s/2) =
g(1 - s) Gamma((1 - s)/2) pi^(-(1 - s)/2) with g(1 - s) = sum b_n n^(s - 1) absolutely convergent for sigma < -alpha < 0;
then f = C zeta. Recalled from memory, not opened; the statement above is the case g = f. Because the source
was not opened the proof is given in full.

Proof. Step 1 (growth in the strip). P G is entire of finite order, bounded by C abs(s)^A on Re s = 2
(absolute convergence) and on Re s = -1 (functional equation and Stirling). By Phragmen-Lindelof it is
bounded by C abs(s)^A' in -1 <= Re s <= 2. This is the only use of the order clause.

Step 2 (theta relation). phi(x) = sum a_n e^(-pi n^2 x), x > 0. For c = 2:
phi(x) = (1/(4 pi i)) int over Re s = c of Lam(s) x^(-s/2) ds (Mellin inversion in s/2). Move the line to
Re s = -1; the horizontal segments vanish by step 1 and the decay of Gamma. On Re s = -1 substitute
s -> 1 - s and use the functional equation: the integral is x^(-1/2) phi(1/x). Hence

(T)  phi(x) = x^(-1/2) phi(1/x) + Q(x),  Q(x) = (1/2) sum over poles s_v of Lam of Res (Lam(s) x^(-s/2)).

The poles of Lam are the poles of G and s = 0 (Lemma 1: the other poles of Gamma(s/2) are cancelled), all in
0 <= Re s <= 1. **This is the step that reads the pole count:** Q is a finite sum of terms
x^(-s_v/2) (log x)^j. (For zeta: Q = (x^(-1/2) - 1)/2; checked to 1e-51.)

Step 3 (resolvent). Multiply (T) by e^(-pi t^2 x), t > 0, and integrate over x in (0, inf):

(R)  A(t) = B(t) + H(t),  A(t) = sum a_n/(pi (t^2 + n^2)),  B(t) = (1/t) sum a_n e^(-2 pi n t),
     H(t) = int_0^inf Q(x) e^(-pi t^2 x) dx,

by int_0^inf x^(-1/2) e^(-a/x - b x) dx = (pi/b)^(1/2) e^(-2 (ab)^(1/2)). The integral for H converges because
Re s_v <= 1 < 2, and H is a finite sum of terms t^(s_v - 2) (log t)^j: analytic on C minus (-inf, 0]. (For zeta:
A = coth(pi t)/(2t) - 1/(2 pi t^2), B = 1/(t (e^(2 pi t) - 1)), H = 1/(2t) - 1/(2 pi t^2).) (R) extends to Re t > 0.

Step 4 (period). U(t) = t (A(t) - H(t)) is meromorphic on C minus (-inf, 0], with simple poles at t = +- i n of
residue a_n/(2 pi) (from t a_n/(pi (t^2 + n^2)); H has none). By (R), U(t) = sum a_n e^(-2 pi n t) for Re t > 0,
so U(t + i) = U(t) there, and by continuation on the connected set where both sides are defined, which
contains a neighbourhood of t = i n for every n >= 1. The residue of U(t + i) at t = i n is a_(n+1)/(2 pi).
Hence a_n = a_(n+1), n >= 1. QED

Where each clause is read. Integer frequencies of G: the poles of A are at i n. Integer frequencies of the
dual series (here G itself): the period i of t B(t). Finite order: step 1. Finitely many poles: H is
analytic across the imaginary axis. The functional equation: step 2. Absolute convergence in Re s > 1: steps
2, 3. Nothing else is read; in particular not the Euler product, not abs(alpha_p) <= 1 beyond convergence,
not positivity, not the position of the finitely many poles.

**BR-0, answer.** The space {G : ordinary Dirichlet series absolutely convergent in Re s > 1, meromorphic of
finite order, finitely many poles, zeta's functional equation} is C zeta. Members: c zeta. Test for a
degree-one Euler product with abs(alpha_p) <= 1: c = 1 only (a_1 = 1), alpha_p = 1 for every p.

**BR-3, answer.** Hypotheses of BR-3 => Lemma 1 => Theorem H => G = zeta. Then sum abs(1 - alpha_p) p^-sigma = 0:
the divergence clause of BR-3 is never met, so regime 3 contains no member with finite order and finitely
many poles. The same holds in regime 2 with abs(alpha_p) = p^(1/2) on S (sum over S of p^(1/2 - sigma) is finite
for sigma > 1, so the product converges absolutely there and Theorem H applies).

**Corollary H1 (statement 4, PROVED; (b) RELATIVE to c20 Theorem C (c), one referee).** (a) If
G = sum a_n n^-s (absolutely convergent in Re s > 1) is meromorphic of finite order with zeta's functional
equation and G != a_1 zeta, then G has infinitely many poles, all in 0 <= Re s <= 1, symmetric under
s -> 1 - s; so infinitely many in 1/2 <= Re s <= 1. (b) In regime 2 with abs(alpha_p) <= p^(1/2): G/zeta has no
pole off the line (c20), zeta has the pole at 1 only, so the infinitely many poles of G are on Re s = 1/2.

**Theorem H' (PROVED).** In Theorem H replace 'finite order' by: for some delta > 0 and k < pi/(1 + 2 delta),
abs(P(s) G(s)) <= exp(C e^(k abs(t))) in -delta <= Re s <= 1 + delta. The conclusion holds. Proof: abs(G) <= sum
abs(a_n) n^(-1 - delta) on Re s = 1 + delta and abs(G) <= C abs(t)^(1/2 + delta) on Re s = -delta; the strip has
width 1 + 2 delta and Phragmen-Lindelof holds for growth exp(C e^(k abs(t))), k < pi/width (CLASSICAL). This
gives step 1 on the narrower strip; steps 2 to 4 are run with c = 1 + delta. QED
So a twin with finitely many poles satisfies: for every k < pi, log log max over the strip
0 <= sigma <= 1, abs(t) <= T of abs(G) exceeds k T for arbitrarily large T.

## 3. The decisive first test: HQ1 to HQ4 against the space

Members (map section 2): u = q^(1/2 - s), G = zeta(s) m(u), m = 1 + eps u/(1 - u)^2 (HQ1), 1 + eps u^2/(1 - u)^4
(HQ2), (1 - alpha u + u^2)/(1 - beta u + u^2) (HQ3), (1 + alpha u + u^2)/(1 - beta u + u^2) (HQ4), alpha = q^a + q^-a,
beta = q^b + q^-b.

Each m is a rational function of u, so periodic in s with period 2 pi i/log q. Poles of m: u = 1, that is
s = 1/2 + 2 pi i k/log q (HQ1 order 2, HQ2 order 4); u = q^(+-b), that is s = 1/2 -+ b + 2 pi i k/log q (HQ3, HQ4,
simple). G has a pole at each such point unless zeta vanishes there to at least that order. That cannot
happen for all but finitely many k: for HQ3, HQ4 the points 1/2 + b + 2 pi i k/log q number T log q/(2 pi) up to
height T while N(1/2 + b, T) = o(T) (zero-density estimate, Carlson; CLASSICAL, recalled); for HQ1, HQ2 the
zeros of zeta on the line contain no infinite arithmetic progression (Putnam 1954; CLASSICAL, recalled).
So each HQ member has infinitely many poles in Re s >= 1/2 and fails the pole clause of BR-3 and of Theorem H.
In the proof: Q in (T) is an infinite sum over the lattice, H(t) = sum over k of terms of size
e^(-(pi/2 - abs(arg t)) abs(t_k)) converges only for Re t > 0, and H has singularities on the imaginary axis
(it must: the residues a_n/(2 pi) of U are not constant, a_n jumping at multiples of q or q^2).

MEASURED (`checks.py` -> `checks.json`, `checks.log`; mpmath 50 digits; q = 2, x = 1.3; residues by a 128-point
circle rule of radius 0.1; phi from 12 terms). D_K = phi(x) - x^(-1/2) phi(1/x) - (1/2)(residues at s = 0, 1 and at
the lattice poles with abs(k) <= K).

| Member | not zero: G(2 + 3i) | abs(m(s) - m(1 - s)) at 0.83 + 3.7i | a(q), a(q^2) | first k with a(q^k) != a(q)^k; a(q^2) - a(q)^2 | miss with residues at 0, 1 only | abs(D_0), abs(D_3), abs(D_6), abs(D_9), abs(D_10) | abs(residue/2) at k = 0, 3, 6 |
|---|---|---|---|---|---|---|---|
| zeta | 0.79802 - 0.11374i | 0 | 1, 1 | none | 1.3e-51 | - | - |
| HQ1 (eps = 1) | 0.61978 - 0.19024i | 1.4e-51 | 2.41421, 6.41421 | 2; 0.58579 | 0.50660 | 1.9e-3, 2.4e-12, 1.4e-21, 4.2e-31, 5.9e-36 | 0.508, 8.1e-10, 3.3e-19 |
| HQ2 (eps = 1e-2) | 0.79829 - 0.11336i | 0 | 1, 1.02 | 2; 0.02 | 0.041764 | 4.6e-6, 3.1e-15, 1.5e-24, 2.5e-33, 1.3e-36 | 0.0418, 1.9e-12, 3.4e-21 |
| HQ2 (eps = 1) | 0.82508 - 0.07572i | 2.1e-53 | 1, 3 | 2; 2 | 4.1764 | 4.6e-4, 3.1e-13, 1.5e-22, 2.5e-31, 1.3e-34 | 4.18, 1.9e-10, 3.4e-19 |
| HQ3 (0.1, 0.2) | 0.79546 - 0.11484i | 1.3e-51 | 1.02042, 1.07875 | 2; 0.037484 | 0.0086966 | 2.7e-5, 3.5e-14, 2.0e-23, 6.1e-33, 4.9e-38 | 0.162, 4.8e-11, 2.2e-20 |
| HQ4 (0.1, 0.2) | 0.08288 - 0.41864i | 8.5e-52 | 6.69087, 22.9420 | 2; -21.826 | 2.4231 | 7.4e-3, 9.7e-12, 5.7e-21, 1.7e-30, 1.4e-35 | 45.1, 1.3e-8, 6.3e-18 |

Dirichlet coefficients against the closed form at s = 6 (4000 terms): differences 2e-19 to 1.4e-17 (the tail).
Reading: each member is not identically zero, satisfies the functional equation, and satisfies (T) only with
the full lattice of residues; every lattice pole tested carries a non-zero residue; no finite set of poles
closes the relation (the miss at K is the size of the residues at K + 1, ratio about e^(-7.1) per step, which
is e^(-(pi/4)(2 pi/log 2))). The values at K = 10 are at the accuracy of the 50-digit residue sums. The local
factor at q is non-geometric from the exponent 2 on. **The expectation 'HQ2, HQ3, HQ4 appear in the space
and are excluded only by the geometric local shape' fails at its first half: they do not appear.** In the
class of BR-3 the geometric shape excludes nothing, because the class is already {zeta} before the shape
is read.

## 4. Controls

The statement tested is Theorem H (and BR-3 through it). 'Fails at' names the step of section 2.

| Control | FE of zeta | integer frequencies | finite order | finitely many poles | Fails at | Status |
|---|---|---|---|---|---|---|
| DEL (b in (1/2, 1)) | no | yes | not known left of max(b - eta, b/2) | - | step 2: no functional equation, no relation (T); continuation is known only to Re s > max(b - eta, b/2) | RELATIVE (map row DEL) |
| THIN | no | yes | as DEL | - | step 2, as DEL | RELATIVE (map row THIN) |
| HQ1 | yes | yes | yes | no (lattice on Re s = 1/2, order 2) | step 3/4: Q infinite; H not analytic across the imaginary axis | PROVED; MEASURED |
| HQ2 | yes | yes | yes | no (lattice on Re s = 1/2, order 4) | same | PROVED; MEASURED |
| HQ3, HQ4 | yes | yes | yes | no (lattices on Re s = 1/2 +- b, simple) | same | PROVED; MEASURED |
| DH | no (conductor 5, odd gamma factor) | yes | yes | yes (entire) | not in the class; with its own functional equation the same four steps run with theta weight n e^(-pi n^2 x/5), poles of the resolvent at i n/5^(1/2), period i 5^(1/2): a_n = a_(n+5), odd; the two-dimensional space of odd 5-periodic sequences is cut to dimension one by the sign of the functional equation; the member is DH. The theorem holds at this base and its conclusion is a function with no Euler product and zeros off the line | ARGUED (same proof; not written out); CLASSICAL in content |
| Beurling member: ZQ (map), Proposition W (row P57), NWM (section 5) | yes | no | ZQ, W: yes; NWM: no | yes (pole at 1 only) | step 4: poles of A at i lambda_n, t B(t) almost periodic, no period; these members have zeros off the line | PROVED (ZQ, W on file; NWM here) |
| Theorem C product (regime 2, abs(alpha_p) = p^(1/2) on S) | assumed | yes | assumed | must fail | Corollary H1 (b): a twin of finite order has infinitely many poles, all on the line; existence OPEN (BR-2) | PROVED relative to c20 |
| backward heat, theta^w, phase-rotated transfer operator, T-NR, zeta(s + a) zeta(s - a), unimodular twist, sign-twisted primes | no (other gamma factor, shifted centre, or none) | - | - | - | not Dirichlet series with zeta's functional equation; step 2 | CLASSICAL / map |

No control satisfies the hypotheses. The multiplicative controls with zeta's functional equation (HQ1 to
HQ4) and the non-multiplicative ones (ZQ, W, NWM) are all rejected by clauses that do not mention
multiplicativity; DH-type bases are accepted. **The score condition of the assignment (fails for a named
non-multiplicative control and for no multiplicative one, through a step that reads the functional equation
and the local shape jointly) is not met: R1 and R3 are false.** No defect bound in the manner of Corollary A2
is obtained in regime 3: the proof gives the exact identity a_n = a_(n+1) from exact hypotheses, and a
quantitative form would need a quantitative continuation of H across the imaginary axis.

## 5. BR-3 without the finite-order clause

### 5.1 What survives (Theorem H')

Section 2. The clause is needed only as a Phragmen-Lindelof admissibility bound on a strip slightly wider
than the critical strip; the threshold is growth exponent pi.

### 5.2 Control NWM: the clause is necessary and the threshold sharp for general frequencies

g(z) = int_0^inf e^(zt) t^-t dt is entire. For y = Im z > pi/2 turn the path to t = i r:
abs(e^(zt) t^-t) = e^(-r (y - pi/2)), so abs(g(z)) <= 1/(abs(y) - pi/2) for abs(y) > pi/2 (the arc at radius r contributes
at most (pi r/2) e^(-r min) with exponent -r ((y - pi/2) sin(theta) + cos(theta)(log r - x)) -> -inf; same for y < -pi/2
with t = -i r). PROVED. On the real axis g(x) ~ (2 pi)^(1/2) e^((x - 1)/2) exp(e^(x - 1)) as x -> +inf (saddle at
log t = x - 1; ARGUED, and MEASURED below).

Fix kappa > 0, z = -i kappa (s - 1/2), R(s) = g(z) + g(-z). Then R is entire, R(s) = R(1 - s), real on the real
axis, abs(R(s)) <= 2/(kappa abs(sigma - 1/2) - pi/2) for abs(sigma - 1/2) > pi/(2 kappa), and for
sigma > 1/2 + pi/(2 kappa) the two turned paths give

R(s) = 2 int_0^inf sin(r log r) e^(pi r/2) e^(-kappa (s - 1/2) r) dr = int_0^inf d(v) e^(-s v) dv,
d(v) = (2/kappa) sin((v/kappa) log(v/kappa)) e^((1/2 + pi/(2 kappa)) v):

a Dirichlet integral with real density on frequencies v >= 0, absolutely convergent exactly for
Re s > 1/2 + pi/(2 kappa). PROVED (two lines from the turned paths).

G_NWM(s) = zeta(s)(1 + R(s)): zeta's functional equation exactly; the pole at 1 only; coefficient measure
sum over n of delta_(log n) * (delta_0 + d(v) dv) supported on frequencies >= 0, absolutely convergent for
Re s > max(1, 1/2 + pi/(2 kappa)); infinite order (growth exponent kappa on the line); not an ordinary
Dirichlet series; not multiplicative; coefficient measure signed. For kappa >= pi the abscissa is 1 and
the growth exponent is kappa >= pi: Theorem H' fails for it only through k < pi (and through integrality),
so k < pi is sharp in the class of general frequencies. For c20: 1 + R is a symmetric entire Dirichlet
integral, bounded on Re s >= sigma_1 for every sigma_1 > 1/2 + pi/(2 kappa) and not constant; so in Lemma A0
'bounded on Re s > 1/2' cannot be weakened to 'entire and bounded on Re s >= 1/2 + d' for any d > 0, and the
growth bound k < pi/(2d) of Theorem C (b) is met with equality by kappa = pi/(2d) (general frequencies).

MEASURED (`checks.py`, `check_newman.py`; kappa = 4; abscissa 0.892699):
- entire form against Laplace form at s = 2 + 0.7i: both -0.07463040216492850 + 0.06238347786348243i, difference 3e-49;
- abs(R(s) - R(1 - s)) = 0 at 0.8 + 0.9i (by construction);
- growth on the line: abs(R(1/2 + it)) = 7.38, 61.9, 1.10e4, 5.92e9 at t = 0.25, 0.5, 0.75, 1.0 (log of the last:
  22.50; e^(kappa t - 1) + (kappa t - 1)/2 + log(2 pi)/2 = 22.50);
- zeros of 1 + R (Newton on the entire form, residual at s and at 1 - s below 3e-44; zeta(s) != 0 there):
  s = 0.0523313279723755 + 0.7846755606466836i (so 0.9476686720276245 - 0.7846755606466836i, and conjugates),
  s = 0.0709394503552517 + 0.9239595353230960i, and s = -0.0376302052783997 + 0.3980765877980074i (outside the strip).
  The second and third are zeros of G_NWM inside the open critical strip off the line. Not ball-certified.
- second pass by the Laplace form alone (`check_newman.py` -> `checks_newman.json`, 40 digits): on Re s = 1.25,
  abs(R) = 0.130, 0.366, 0.172, 0.0647, 0.0215, 0.00665 at t = 0, 0.5, 1, 2, 4, 8; maximum over t in [0, 20], step
  0.25: 0.366, against the proved bound 1.399; minimum of abs(1 + R) there: 0.731. At the reflected zeros
  1 - s (Re 0.9477 and 0.9291, right of the abscissa 0.8927) the Laplace form truncated at r = 40 gives
  abs(1 + R) = 1.1e-4 and 3.3e-3, which is the size of the truncated tail (e^(-0.22 * 40) and e^(-0.145 * 40)), so
  this second form confirms the two zeros to about 3e-6 and 1e-4 in position only (R' = 37.8 - 3.2i at the
  first); zeta = 0.49 + 1.21i there. The 1e-44 residuals are from the entire form alone.

Note: the first run evaluated R on Re s = 1 at t = 2, 4 by the real-line integral for g and returned 1e166,
1e583; that integral has its peak at t = e^(Re z - 1) and is not computable there in floating point. Those two
numbers are artefacts and are superseded by the Laplace-form values of the second pass. Also the first run
hit the 8 GB cap in this block (mpmath quadrature cache over a moving grid); the block was rewritten on a
fixed Gauss-Legendre rule (48 nodes, 239 panels, under 50 MB), not rerun with a larger cap.

### 5.3 What is open

**BR-3' (OPEN).** Let G = sum a_n n^-s be an ordinary Dirichlet series, absolutely convergent for Re s > 1,
meromorphic on C with finitely many poles, with zeta's functional equation (with or without an Euler product
with abs(alpha_p) <= 1). Is G = a_1 zeta? By H' a counterexample has growth exponent >= pi in the critical
strip. NWM shows that integer frequencies must be used a second time (to bound growth), since for real
frequencies the answer is no. No method for this is on file. It is again an identification question; either
answer scores 0.

Q-inf (c19) after this lane: open for G of finite order with infinitely many poles in 1/2 <= Re s <= 1
(Corollary H1), and for G of infinite order.

## 6. Requirement flags, with evidence

| Flag | Value | Evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | Theorem H holds for every ordinary Dirichlet series; section 2 lists every clause read; the Euler product is not among them |
| R2 (height-uniform, every window) | false | no window statement; an identification |
| R3 (every control fails structurally) | false | HQ1 to HQ4, ZQ, W, NWM fail at pole count, integrality or growth, none at multiplicativity; the theorem holds at the DH base (ARGUED) |
| R4 (reaches the line from finite stages or from Re s > 1) | false | the continuation across 1/2 < Re s <= 1 with a growth bound and a finite pole count is a hypothesis of BR-3; the proof derives nothing in the strip from data right of 1 |

About zeros of zeta: no.

## 7. Three weakest steps

1. Source of Theorem H. Titchmarsh section 2.13 is recalled, not opened. The proof in section 2 is the
   author's write-up of the classical argument; the two points to attack are the continuation of
   U(t + i) = U(t) to neighbourhoods of t = i n (needs H analytic on C minus (-inf, 0], which is where finitely
   many poles is read) and the vanishing of the horizontal segments in step 2. No independent referee.
2. Section 3 uses two recalled classical facts to say that infinitely many lattice points are poles of G
   (Carlson's N(sigma, T) = o(T); Putnam's theorem on arithmetic progressions of zeros). The measured
   residues cover k = 0..6 (and the defect sequence k <= 10) at q = 2 and q = 3 only.
3. NWM: the bound outside the strip and the Laplace form are proved; the growth law on the line is a saddle
   estimate checked at four points; the zeros are Newton roots with residual 1e-44 to 1e-50, not enclosed;
   'sharp' refers to the class with real frequencies and says nothing for integer frequencies (BR-3'). The
   DH row of section 4 is argued by the same four steps and was not written out or computed.

## 8. Files

`RESULT.md`, `REFEREE.md` (author's adversarial pass), `MAP_ROW.md`, `lanes.jsonl`, `checks.py`, `checks.json`,
`checks.log`, `check_newman.py`, `checks_newman.json`, `ref_check.py`, `ref_check.json`.
