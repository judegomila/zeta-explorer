# c18-exact-relation-rigidity-klein-spinor: RESULT

Date 2026-11-19. Round 18, kind: combine (combinable 1 of round 17). Scope: this directory and one line in
`campaign/lanes.jsonl`. No server run (the decisive test is a paper test; the numeric checks are 40-digit
mpmath, local, through `scripts/memcap.sh 8`). Nothing committed or pushed. No independent referee has read
this file (referees = 0). **No statement about zeros of zeta is made.** Requirement flags: R1 = R2 = R3 = R4 = false.

Labels: PROVED (complete argument in this file, elementary) / CLASSICAL (standard, cited as recalled, not
opened) / RELATIVE (to a lane on file) / CHECKED (`checks.py`, `checks.json`, mpmath 40 digits, not ball
arithmetic) / OPEN.

Sources read: `c17-u6e-bost-connes-non-invariant-state-twin-ladder/RESULT.md` (Lemmas G, E),
`c17-u3-inequality-discontinuity-functional/RESULT.md` (Proposition W, Lemma S6, items 4 to 7),
`c16-pos-fe-u2-positivity-rigidity/RESULT.md` (Theorem P), `c15-control-with-zeta-fe-classes-u1-u2/RESULT.md`
(Lemma A, ZQ, SG, NR-q, Lemmas L, D), `g-klein-bottle-seam`, `g-spinor-square-root`, `h-klein-fricke` (verdict
sections), map section 2 (controls) and rows NR, NR-q, ZQ, P56, G16, G34, D8, O1.

## 0. Verdict

**Precise obstruction. The decisive test kills the idea: multiplicativity is independent of every clause of
the two identification theorems on file, and no control with zeta's functional equation fails it.** The
exact-relation branch closes. Six statements:

1. (Decisive test.) R = multiplicativity on C = {frequencies log n, N >= 0, pole at 1 only, finite order} does
   not force G = r zeta: TN1 = zeta(s)(1 + q^(3/4 - s)), q prime, is in C, is multiplicative, and vanishes at
   3/4 + i pi (2k+1)/log q (PROVED, CHECKED). ZQ and the Proposition W twin do **not** fail multiplicativity:
   the atoms of ZQ are zeta's (multiplicative), and the Proposition W twin and NR-q are multiplicative on
   their own frequency semigroups. Their named failing step is support/integrality (class membership), not R.
2. (Proposition I, independence.) Add MULT to the hypothesis list of Hamburger {FE, INT, POLE+ORDER} or of
   Theorem P {FE, N >= 0, SUPP >= 1, POLE+ORDER} and delete any one of FE, INT/SUPP, POLE: a twin with
   off-line zeros remains, and it keeps MULT (and N >= 0). FE deleted: TN1. INT/SUPP deleted: NR-q,
   Proposition W (RELATIVE). POLE deleted: **HQ, new here** (statement 3). So "R plus the functional equation"
   gives nothing beyond Hamburger/Theorem P, and R cannot replace any clause.
3. (New control HQ, PROVED, CHECKED.) For q prime, u = q^(1/2 - s), eps > 0:
   HQ2 = zeta(s)(1 + eps u^2/(1 - u)^4). It has zeta's functional equation exactly, ordinary Dirichlet series
   with frequencies log n, multiplicative coefficients a(n) = 1 + eps sum_{2 <= j <= v_q(n)} C(j+1, 3) q^(j/2) >= 1
   (so N >= 0 and a(n) = 1 unless q^2 divides n), an Euler product, finite order, and zeros at
   1/2 + z + 2 pi i k/log q with sinh(z log q/2) = +-(eps^(1/4)/2) e^(+-i pi/4): distance from the line
   eps^(1/4)/(sqrt 2 log q)(1 + O(sqrt eps)) for **every** eps > 0. The only clause of Theorem P or Hamburger that
   fails is the pole clause: quadruple poles at 1/2 + 2 pi i k/log q, on the critical line.
4. (Lemma Q, one-prime rigidity, PROVED.) A meromorphic symmetric multiplier m (m(s) = m(1 - s)) that is a
   Dirichlet series in powers of one integer q is a rational function R(u) with R(u) = R(1/u), R(0) = 1; if it
   has no pole it is 1. The proof is Liouville on the u-sphere. It uses the functional equation and
   integrality at q and no multiplicativity. The number of zeros of R equals the number of poles: poles on
   the line pay for zeros off it.
5. (Proposition F, R4 in rigidity form, PROVED, CHECKED.) For every X and every delta > 0 there is G with
   zeta's exact functional equation, integer frequencies, multiplicative non-negative coefficients equal to
   zeta's for all n <= X, sup over Re s >= 2 of abs(G/zeta - 1) < delta, and zeros on Re s = 3/4 (member
   HQ1(q, c_q), q > X prime). So an exact relation verified at a finite stage, together with the exact
   functional equation and global multiplicativity and positivity, implies nothing about zeros. The clause
   that completes the identification (POLE) is the only one stated inside the strip.
6. (Proposition D, the topology question.) Every exact relation on file is a closed condition in one of two
   topologies and in neither of them do both things hold: in T_coef (uniform on Re s >= 2) the failure sets
   of INT and MULT are open, and zeros in the strip do not move continuously (statement 5); in T_strip
   (locally uniform in the strip, zeros continuous by Hurwitz) the failure set of FE is open, and the hold
   sets of INT and MULT are not closed on the right half-strip (Voronin, CLASSICAL). The relations whose
   hold set is closed in T_strip and which exclude every control are E8 (the definition of zeta's
   coefficients) and E13 (J = 1, which is the target).

Outcome for the record: classification table (section 2), control table (section 6), proposed map row X1
(section 8). Score 0 by the registered rule (DH is the only named control that fails a multiplicative
relation, it fails it by definition, and seven other controls pass it).

## 1. Plan; what is new against the record

Plan as assigned: decisive test first (R = multiplicativity on C); then the list of exact relations with the
three classifying questions; then the rigidity lemma and its finite-stage form; controls.

New here: TN1 as the named member of C for the decisive test; the control HQ (integer frequencies,
multiplicative, non-negative, exact functional equation, off-line zeros at every eps > 0, poles on the
critical line), not found on file (grep of the map and of all RESULT.md for poles on the critical line
returns only ZQ twists); Lemma Q; Proposition I as a complete clause-deletion table with MULT kept;
Proposition F; Proposition D. Not new: Hamburger, Theorem P, Lemma A (family = zeta m, m symmetric), NR-q,
Proposition W, ZQ, Lemma G, Lemma E. Literature pointer (CLASSICAL, as recalled, not opened): Knopp, Invent.
Math. 117 (1994), shows that Riemann's functional equation with infinitely many poles allowed has infinitely
many linearly independent Dirichlet-series solutions; HQ is an elementary explicit instance that is in
addition multiplicative and non-negative.

Notation. gam(s) = pi^(-s/2) Gamma(s/2). FE: G gam is invariant under s -> 1 - s. INT: G is an ordinary
Dirichlet series sum a(n) n^-s. SUPP >= 1: the coefficient measure N has no mass below 1. POLE+ORDER:
(s - 1) G is entire of finite order. MULT: a(mn) = a(m) a(n) for (m, n) = 1, a(1) = 1; on a general
frequency semigroup: log G has its coefficient measure nu on the powers of the generators. CMULT: complete
multiplicativity.

## 2. The exact relations on file, classified

Two coordinate systems. Type A: the relation is linear and homogeneous in G (equivalently in N). Type B: it
is affine-linear in log G (in nu). (i) = is the failure set open in a topology in which zeros in the strip
move continuously (T_strip); (ii) = which twins it excludes and how; (iii) = is multiplicativity read.

| Code | Relation (source) | Type | Hold set | (i) | (ii) excluded / not excluded | (iii) |
|---|---|---|---|---|---|---|
| E1 | FE with zeta's gamma factor, conductor 1 | A | {zeta m : m symmetric meromorphic} (Lemma A, c15) | yes: closed under locally uniform limits on symmetric domains | excluded: DH, E_a, DEL, T-NR (ordinary form), TN1, THIN, U, WT. Not excluded: ZQ, SG, NR-q, Proposition W, HQ, backward heat (completed field is even) | no |
| E2 | INT / SUPP: N carried by the integers / by [1, inf) | A | linear space | closed in T_coef; not closed in T_strip on the right half-strip (Prop. D) | excluded: ZQ, SG (density off the integers), NR-q (frequencies log n + j log q), Proposition W (mass at 1/q < 1: support), heat. Not excluded: DH, E_a, DEL, T-NR, TN1, HQ | no |
| E3 | POLE+ORDER | A | linear space | closed in T_strip for uniformly bounded order | excluded: HQ, E_a (poles 1 +- a), G_+ (c15 referee E1); DEL continues to a half-plane only. Not excluded: ZQ, NR-q, Proposition W, TN1, T-NR, DH | no |
| E4 | Hamburger = E1 + E2(INT) + E3 (CLASSICAL) | A | the line {r zeta} | closed (a line) | everything but zeta; each control at the clause named in E1 to E3 | no |
| E5 | Theorem P = E1 + E3 + SUPP >= 1 + N >= 0; trace identity (T); theta relation; self-dual measure (P56, three referees) | A plus a cone | the ray {r zeta, r >= 0} | closed | as E4; ZQ, SG by sign of the density (Lemma S6), Proposition W by support | no (c16 item 2) |
| E6 | MULT (nu on prime powers) | B | Euler products with arbitrary local series | closed in T_coef; not closed in T_strip (Prop. D) | excluded: DH (a(6) != a(2) a(3)), heat. **Not excluded: ZQ (atoms), NR-q, Proposition W (own semigroup), T-NR, TN1, HQ, DEL, E_a, THIN, U, WT** | yes, and nothing else |
| E7 | CMULT; state form: mu_m*-eigenstates omega(x mu_m*) = lambda(m) omega(x) (Lemma E, c17-u6e) | quadratic cone | {r sum lambda(n) n^-s} | as E6 | excluded in addition: T-NR, TN1, HQ, E_a. Not excluded: DEL, THIN, U, WT, L(s, chi) | yes |
| E8 | a(pn) = a(n) for all p, n (E7 with eigenvalue 1; mu_p* a = a) | A | the line {r zeta} | closed | every control, by the relation itself: T-NR and HQ at p = q, DEL at p in S, gauge twins THIN, U, WT at the first p with chi(p) != 1 | yes; it is the definition of the coefficients of zeta |
| E9 | Lattice Hecke relations: sum over index-p sublattices = (p^s + p^(1-s)) x itself (G16; h-klein-fricke item 2); T_p E(z, s) = (p^s + p^(1-s)) E(z, s) (G42) | A | every torus / every s | holds identically | nothing (holds at tori with off-line zeros) | Hecke operators are read; no Euler product in s is implied |
| E10 | Heegner orbit of the torus is one point (class number one), or sum over the class group (h-klein-fricke items 2, 3) | A | Epstein function = constant x zeta_K | closed | identifies zeta(s) L(s, chi_D): an Euler product is given, zeros are not located | yes (as identification) |
| E11 | Seam identity N_K = N_on + 2 N_right = (1/pi) x outer winding; seam flux = pi N_on (g-klein-bottle-seam Theorem 1) | integer identity | every field with E1 and reality (poles counted negatively) | holds identically | nothing: DH, heat, ZQ, HQ all satisfy it | no |
| E12 | Krein factorisation H_c = D^dagger J D; block identity with D = -Gamma_-* Gamma_- (g-spinor-square-root) | A-bilinear | every even F | holds identically | nothing | no |
| E13 | J = 1 / Gamma_- = 0 / S causal / definite square root | closed condition on the zero set | {even F with all zeros on the line} | **yes** (off-line zeros persist under T_strip, Hurwitz) | every control with off-line zeros, by the relation itself | no; for zeta it is the target |
| E14 | Fourier interpolation with nodes at the zeros (G34) | A | orbit under symmetric multipliers (Lemma M, c13) | holds on the orbit | nothing in the FE class | no |

Reading of the table.
- Proposition W twins are excluded by support (E2), NR-q by integrality (E2), T-NR and gauge twins by E1 or
  by E8 itself. This confirms the three guesses of the assignment, with one correction: none of them is
  excluded by multiplicativity (E6), and ZQ is not either.
- The relations that exclude every control are E4, E5, E8 (hold set a line: identifications, which locate no
  zero) and E13 (the target). The relations that read multiplicativity and are not identifications (E6, E7,
  E9) exclude no control that has zeta's functional equation.
- Type A relations cut out linear spaces. Hamburger's theorem is the statement that E1, E2, E3 intersect in a
  line; a line carries the zeros of its generator and nothing else. Rigidity on file is linear algebra in N;
  multiplicativity is linear in a different coordinate (nu) and the two never have to be combined to get the
  line.

## 3. Decisive test: R = multiplicativity on C

**TN1 (PROVED, CHECKED C).** q prime, G = zeta(s)(1 + q^(3/4 - s)). Coefficients: a(n) = 1 if q does not divide
n, 1 + q^(3/4) if it does (local series (1 + alpha y)/(1 - y) = 1 + (1 + alpha)(y + y^2 + ...), alpha = q^(3/4),
y = q^-s). So INT, N >= 0, MULT hold; (s - 1) G is entire of order 1 with residue 1 + q^(-1/4) at 1. Zeros:
q^(3/4 - s) = -1, s = 3/4 + i pi (2k + 1)/log q (zeta does not vanish on Re s = 3/4 at all of them; CHECKED at
k = 0, q = 2, 3, 101: abs G <= 6e-41 with abs zeta of order 1). Hence MULT does not force r zeta on C. TN1 is
the one-root member of the T-NR family; it fails E1 only. Any real part log(alpha)/log q is available.

**ZQ at MULT.** G = zeta m, N = (sum over n of delta_n) * (delta_1 + M(x) dx) (c17-u3 section 2). The atomic part
of N is sum delta_n: multiplicative with weights 1. The part off the integers has no atoms, so a(mn) = a(m) a(n)
has no instance there. In nu: atoms Lambda on prime powers, exact. ZQ passes E6 and fails E2 (and E5 by sign).
Named step: class membership (INT), before R is posed.

**Proposition W twin and NR-q at MULT.** G = zeta(s) q^(s - 1/2)(1 - alpha q^-s)(1 - beta q^-s)/(2 + c),
alpha beta = q, alpha + beta = -c sqrt q. For q multiplicatively independent of the rationals the frequency
semigroup generated by the primes and q is free, and the coefficient function is multiplicative on it up to
the unit q^(s - 1/2), which translates the support by 1/q. They pass E6 in the only sense available on their
frequency set (this is c17-u3 section 5), and fail E2: the Proposition W twin has mass at 1/q < 1 (SUPP),
NR-q has non-integer frequencies (INT).

Result of the test: the two FE-twins named in the assignment do not fail R at any step; R on C has the
multiplicative twin TN1. The idea as posed (a control failing for a multiplicative reason inside an exact
relation with an open failure set) does not occur.

## 4. Rigidity: Lemma Q, the control HQ, Proposition I

**Lemma Q (PROVED).** Let q >= 2 be an integer and m a meromorphic function on C with m(s) = m(1 - s) and
m(s) = sum_{k >= 0} b_k q^(-ks), b_0 = 1, convergent in some half-plane. Then m(s) = R(q^(1/2 - s)) with R a
rational function, R(u) = R(1/u), R(0) = R(inf) = 1. If m has no poles then m = 1.
Proof. m has period 2 pi i/log q in the half-plane, hence everywhere, so m = f(u), u = q^(1/2 - s), f
meromorphic on C minus 0. The series gives f analytic at u = 0 with f(0) = 1; symmetry is f(u) = f(1/u), so f
is analytic at infinity with value 1. The poles of f are isolated in C minus 0 and cannot accumulate at 0 or
infinity, so they are finitely many and f is rational. Without poles f is holomorphic on the sphere, so
constant. QED

Consequences. (a) With E1 and INT at one prime, the pole clause alone gives rigidity; no positivity and no
multiplicativity enter. (b) deg(zeros of R) = deg(poles of R): off-line zeros (roots off abs u = 1) exist as
soon as the numerator has a root off the unit circle, whatever the poles. (c) For products over finitely
many primes the poles cannot cancel between factors: two progressions with periods 2 pi i/log q and
2 pi i/log q' meet in at most one point. Cancellation against zeros of zeta would need zeta to vanish on a full
vertical arithmetic progression, which does not happen (Lapidus-van Frankenhuijsen, CLASSICAL, as recalled).

**HQ1 (PROVED, CHECKED A3, B).** m = 1 + eps u/(1 - u)^2 = (1 + c u + u^2)/(1 - u)^2, c = eps - 2, u = q^(1/2 - s).
Coefficients b_k = eps k q^(k/2); a(n) = 1 + eps sum_{1 <= j <= v_q(n)} j q^(j/2). Zeros: (1 - u)^2 + eps u = 0.
On abs u = 1, u/(1 - u)^2 = 1/(2 cos phi - 2) ranges over (-inf, -1/4]. So:
- 0 < eps <= 4: all zeros of m on the line; N >= 0.
- eps > 4: roots u = -e^(+-theta), cosh theta = eps/2 - 1; zeros at Re s = 1/2 +- theta/log q, heights
  (2k + 1) pi/log q; N >= 0. Inside the open strip iff theta < (log q)/2.
- eps < 0: roots u = e^(+-theta), cosh theta = 1 + abs(eps)/2, theta about sqrt(abs eps): real zeros at
  1/2 +- theta/log q and translates; N is signed (a(q^k) -> -inf).
CHECKED B at q = 3: eps = 3.99 roots of modulus 1; eps = 4.01 zero at Re s = 0.59099; eps = -0.01 zero at
Re s = 0.40901; abs G at the zero <= 2e-39; functional-equation residual <= 1.1e-40 at five points.

**HQ2 (PROVED, CHECKED A, A3).** m = 1 + eps (u/(1 - u)^2)^2, eps > 0. Coefficients of u^2/(1 - u)^4 are
C(k + 1, 3) >= 0, k >= 2. Zeros: u/(1 - u)^2 = +-i/sqrt(eps). Since u/(1 - u)^2 is real on abs u = 1, **no zero of
m lies on the line, for any eps > 0**. With u = e^(-z log q): 4 sinh^2(z log q/2) = +-i sqrt(eps), so
z = (2/log q) asinh((eps^(1/4)/2) e^(+-i pi/4)) and its negatives, plus periods; Re z = eps^(1/4)/(sqrt 2 log q)
to leading order. Poles: u = 1, order 4, at s = 1/2 + 2 pi i k/log q.

CHECKED A (abs G at the predicted zero <= 7e-39 in every row; functional-equation residual <= 5e-41):

| q | eps | zero | offset from the line | eps^(1/4)/(sqrt 2 log q) | sup over Re s >= 2 of abs(m - 1) (bound) |
|---|---|---|---|---|---|
| 2 | 1e-2 | 0.823925 + 0.321237 i | 0.32393 | 0.32260 | 7.2e-3 |
| 3 | 1e-4 | 0.564390 + 0.064337 i | 0.064390 | 0.064364 | 8.7e-6 |
| 101 | 1e-6 | 0.504845 + 0.004845 i | 0.0048453 | 0.0048451 | 9.7e-13 |
| 10007 | 1e-8 | 0.500768 + 0.000768 i | 0.00076768 | 0.00076767 | 1.0e-20 |

(At q = 2, eps = 1 the quartet is at Re s = 1.557, outside the strip; that row is in `checks.json`.)
CHECKED A3: for HQ2 (q = 2, eps = 0.01) and HQ1 (q = 3, eps = 5) the coefficients for n <= 6000 have minimum 1,
13,977 coprime pairs with 0 failures of a(mn) = a(m) a(n), and the Dirichlet series at s = 8 agrees with the
closed form to 1e-26.

**Proposition I (independence of multiplicativity).** Hypothesis lists: Hamburger H = {E1, INT, POLE+ORDER};
Theorem P = {E1, N >= 0, SUPP >= 1, POLE+ORDER}. Add MULT. For each single deletion:

| Deleted | Twin keeping MULT | Keeps also | Off-line zeros | Status |
|---|---|---|---|---|
| E1 (FE) | TN1 = zeta(s)(1 + q^(3/4 - s)) | INT, N >= 0, POLE+ORDER | Re s = 3/4 | PROVED here |
| INT (from H) | NR-q | E1, POLE+ORDER | Re s = 1/2 +- arccosh(abs(c)/2)/log q | RELATIVE (c15, map row NR-q) |
| SUPP >= 1 (from P) | Proposition W twin | E1, N >= 0, POLE+ORDER | Re s = 1/2 +- b | RELATIVE (c17-u3) |
| N >= 0 (from P) | ZQ (MULT on atoms) | E1, SUPP >= 1, POLE+ORDER | 1/2 +- eta +- i gbar | RELATIVE (c15) |
| POLE (from H and from P) | HQ2 | E1, INT, N >= 0, SUPP >= 1, finite order | distance eps^(1/4)/(sqrt 2 log q) | PROVED here |
| ORDER | not examined | | | OPEN, not needed |

And with nothing deleted, MULT is implied (G = r zeta). Hence: (a) MULT is not needed for either
identification; (b) MULT replaces none of FE, INT/SUPP, N >= 0, POLE; (c) "R plus the functional equation gives
more than Theorem P" is false in each direction in which "more" can be posed as a weaker hypothesis list.

Answer to the first lemma. An exact relation not implied by FE that forces G = r zeta on C exists only in the
form E8 (and its restatements: G(s)(1 - p^-s) has no frequency divisible by p, for every p), which is the
definition of zeta. The structural relations on file do not: E6 (TN1), E9 (holds for every torus), E11 and
E12 (hold for every symmetric field), E7 on C (finite deletions zeta(s) prod_{p in S}(1 - p^-s), zeros on
Re s = 0; whether these are the only CMULT members of C is OPEN and has no bearing on zeros of zeta, since
zeta is in the hold set).

## 5. R4 in rigidity form, and the quantitative question

**Proposition F (PROVED, CHECKED D).** Let q be prime, c_q = q^(1/4) + q^(-1/4), G_q = zeta(s)(1 + (c_q + 2) u/(1 - u)^2).
Then G_q has E1, INT, MULT, N >= 0, finite order; a(n) = 1 for all n not divisible by q, in particular for all
n < q; its zeros off the line are on Re s = 3/4 and Re s = 1/4 at heights (2k + 1) pi/log q; and
sup over Re s >= sigma of abs(G_q/zeta - 1) <= (c_q + 2) q^(1/2 - sigma)/(1 - q^(1/2 - sigma))^2, which tends to 0 as
q -> inf for every sigma > 3/4.
Proof: HQ1 with eps = c_q + 2 > 4, cosh theta = c_q/2 gives theta = (log q)/4. QED

| q | first height pi/log q | abs G at 3/4 + i pi/log q | bound at sigma = 2 | at sigma = 1.01 | at sigma = 0.8 |
|---|---|---|---|---|---|
| 11 | 1.3101 | 5e-42 | 1.3e-1 | 2.6 | 8.1 |
| 101 | 0.6807 | 4e-41 | 5.4e-3 | 0.64 | 2.4 |
| 10007 | 0.3411 | 7e-41 | 1.2e-5 | 0.11 | 0.87 |
| 1000003 | 0.2274 | 6e-41 | 3.4e-8 | 0.029 | 0.55 |

Consequences.
- Finite stage. "The first X coefficients are zeta's, the coefficients are multiplicative and non-negative
  at every n, the functional equation holds exactly" is satisfied by G_q, q > X. Nothing about zeros follows
  from an exact relation at a finite stage, even with the functional equation exact and the other relations
  global. What completes the identification is E3, analyticity of (s - 1) G at the points 1/2 + 2 pi i k/log q
  of the critical line: the one clause not stated right of 1.
- Topology. G_q -> zeta uniformly on Re s >= sigma for each sigma > 3/4, and each G_q vanishes on Re s = 3/4. The
  zeros do not move continuously in T_coef, inside the class {E1, INT, MULT, N >= 0}.
- Quantitative versions. (a) Defect measured right of 1 (sup of abs(G/zeta - 1) on Re s >= 2, or any weighted
  coefficient norm): no bound "zeros within f(defect) of the line" with f(0+) < 1/4 holds on
  {E1, INT, MULT, N >= 0}; the same construction with theta = lambda log q gives any lambda < 1/2. (b) Defect
  measured by the polar part at fixed q (the coefficient eps): HQ2 gives f(eps) >= eps^(1/4)/(sqrt 2 log q), HQ1
  with eps < 0 gives a square-root law with N signed, and with N >= 0 and double poles the zeros stay on the
  line up to eps = 4 (a threshold tied to the order of the pole, not to multiplicativity: the same
  computation holds for q a non-prime integer, where the coefficients are not multiplicative). (c) In every
  version the class contains zeta at defect 0, so an upper bound f with f(0) = 0 is the target at defect 0
  (c17-u3 item 7; unchanged).

**Proposition D (the topology question (i)).**
(a) PROVED: in T_coef (uniform convergence on Re s >= 2) the hold sets of INT, MULT, CMULT, E8 are closed
(coefficients are continuous), and zeros in the strip are not continuous (Proposition F).
(b) PROVED given Hurwitz: in T_strip (locally uniform convergence on the open strip off poles) off-line
zeros persist, and the hold sets of E1 and E13 are closed.
(c) CLASSICAL (Voronin universality, as recalled): for every analytic non-vanishing f on 1/2 < Re s < 1 there
are tau_j with zeta(s + i tau_j) -> f locally uniformly there (exhaustion by closed rectangles and a diagonal
choice). Each zeta(s + i tau_j) satisfies CMULT. Taking f = 2 zeta on a rectangle free of zeros shows a(1) is
not continuous; taking f the Davenport-Heilbronn function on a rectangle where it does not vanish shows the
MULT hold set is not closed; f with a natural boundary shows the same for INT. So on the right half-strip
the failure sets of INT and MULT are not open in the topology in which zeros move continuously.

[Correction entered 2026-11-20 by lane c19-repair-owed-record-r18-checkpoint-prep, from REFEREE.md E1: part (c) has a gap as written. The three witnesses are taken 'on a rectangle'; convergence on one rectangle is not convergence in T_strip, and the exhaustion argument needs f non-vanishing on all of 1/2 < Re s < 1, which for f = 2 zeta is RH and for the Davenport-Heilbronn function is false. Repair: use targets non-vanishing on the whole half-strip and outside the hold set, for example f(s) = 1 + 2^-s/4 + 3^-s/4 (abs(f - 1) < 1/2; a(6) = 0 != a(2) a(3)) for MULT and f = 2 for a(1). Statement 6 of the verdict then reads: (a), (b) PROVED; non-closedness of the hold sets of INT and MULT in T_strip is CLASSICAL on the right half-strip after the repair, and OPEN inside the functional-equation class (part (d)). The verdict uses (a), (b) and Proposition F only and is unchanged. Map row X1.]
(d) Not proved: non-closedness of INT or MULT inside the E1 class in T_strip on the full strip (a witness
would be a sequence of products of HQ factors converging to a ZQ multiplier). OPEN; not needed for the verdict.

## 6. Controls

Columns: relations of section 2. P = passes (satisfies the relation), F = fails, with the step.

| Control | E1 FE | E2 INT/SUPP | E3 POLE | E6 MULT | E7 CMULT | E8 | E11, E12 | E13 | Where it leaves Hamburger / Theorem P |
|---|---|---|---|---|---|---|---|---|---|
| ZQ | P | F (density off the integers) | P | P on atoms | P on atoms | F (off-integer mass) | P | F | E2; sign of density (Lemma S6) |
| NR-q | P | F (frequencies log n + j log q) | P | P on its semigroup | F at q | F | P | F | E2 |
| Proposition W twin | P | F (mass at 1/q < 1) | P | P on its semigroup | F at q | F | P | F | SUPP |
| T-NR (ordinary form, q prime), TN1 | F (conductor at q) | P | P | P | F at q | F at q | P in its own symmetric variable | F | E1 |
| HQ (new) | P | P | F (poles at 1/2 + 2 pi i k/log q) | P | F at q | F at q^2 (HQ2), q (HQ1) | P with poles counted negatively | F | E3 |
| DEL | F | P | P in a half-plane only | P | P | F at p in S | not defined (no symmetry) | n/a | E1 |
| E_a | F (degree 2 gamma factor) | P | F (poles 1 +- a) | P | F | F | P (even completed field) | F | E1, E3 |
| DH | F (conductor 5) | P | P (entire) | **F: a(6) != a(2) a(3)** | F | F | P | F | E1; N signed |
| backward heat | P as evenness of the field | F (no fixed Dirichlet series) | n/a | F (coefficient cocycle) | F | F | P | F | E2 |

DH and backward heat are the two controls that fail a multiplicative relation. Both fail it by definition,
in T_coef, and E6 has no conclusion attached that they could contradict. Every control that has zeta's
functional equation and a Dirichlet-type expansion (ZQ, NR-q, Proposition W, HQ) passes E6. So R3 is not met:
"fails for every control at a named structural step" holds only for E8 and E13, which are the definition and
the target.

Check of this lane against the walls. Hamburger and Theorem P apply to none of the new twins: TN1 lacks E1;
HQ has infinitely many poles (Hamburger allows finitely many). Lemma G (c17-u6e) is consistent: HQ and TN1
are b xi_s with b = local polynomial or rational element at q, rejected only by an exact relation (E8 at q).

## 7. Requirement flags and evidence

- R1 (multiplicativity essential): **false.** Multiplicativity is read in E6, E7, E8, E10 only; E6 and E7
  exclude no FE-twin (section 3); E8 and E10 are identifications. Proposition I shows it is redundant in both
  identification theorems.
- R2 (height-uniform, every window): **false.** No conclusion about zeros is drawn. The twins HQ have their
  off-line zeros at every height 2 pi k/log q and (2k + 1) pi/log q, so they are controls at all heights.
- R3 (every control fails at a named structural step): **false**, section 6.
- R4 (finite stage or right of 1 to the line): **false**; Proposition F is the negative statement in
  rigidity form.

## 8. Proposed map row (for the record lane; the map is not edited here)

| X1 | Exact-relation rigidity: every exact relation on file (functional equation, integrality, pole clause, multiplicativity, mu_p*-eigen relation, lattice Hecke relations, seam identity, Krein square-root identity, J = 1) classified by openness of the failure set, twin exclusion and use of multiplicativity (campaign round 18; combine) | Multiplicativity excludes no twin with zeta's functional equation (ZQ passes on atoms; NR-q and Proposition W on their semigroups) and replaces no clause of Hamburger or Theorem P: FE deleted -> TN1 = zeta(s)(1 + q^(3/4 - s)); pole clause deleted -> HQ2 = zeta(s)(1 + eps u^2/(1 - u)^4), u = q^(1/2 - s), which has exact FE, integer frequencies, multiplicative coefficients >= 1, and zeros at distance eps^(1/4)/(sqrt 2 log q) from the line for every eps > 0, with quadruple poles on the critical line. Lemma Q: a symmetric one-prime Dirichlet multiplier is rational in u and is 1 if pole-free (Liouville; no multiplicativity). Proposition F: members with zeta's coefficients for all n < q, uniformly within delta of zeta on Re s >= 2, vanish on Re s = 3/4. The relations that exclude every control are the definition a(pn) = a(n) and the target J = 1. | PROVED (elementary, author only; 40-digit mpmath checks), unrefereed | `c18-exact-relation-rigidity-klein-spinor` | Closed: do not look for a control failing through multiplicativity inside an exact relation. New control HQ for any device that reads FE + INT + MULT + N >= 0 without analyticity on the critical line. |

Proposed control line for section 2: **HQ** | zeta(s)(1 + eps u^2/(1 - u)^4), u = q^(1/2 - s), q prime, eps > 0 |
has: zeta's functional equation exactly; ordinary Dirichlet series; multiplicative coefficients >= 1 equal to
1 unless q^2 divides n; Euler product; finite order | lacks: pole clause (order-4 poles at 1/2 + 2 pi i k/log q);
GEOM and SIZE at q (a(q^k) of size k^3 q^(k/2)) | kills steps that read FE, INT, MULT and coefficient positivity
together without reading analyticity on the critical line or the size of the local factor at every prime.

## 9. Three weakest steps

1. **Completeness of the list.** "Every exact relation on file" means the relations in the six input lanes
   and map rows G16, G34, G42, P56, D8, NR, NR-q, ZQ, found by reading and grep. The engine graph was not
   enumerated. A relation of a different algebraic type (neither linear in N nor in nu, and not the target)
   would fall outside Propositions I and D.
2. **Proposition D (c) and (d).** Part (c) rests on Voronin universality as recalled, and it is a statement on
   the right half-strip without the functional equation. Inside the E1 class on the full strip the
   non-closedness of INT and MULT is not proved. The verdict uses (a), (b) and Proposition F only.
3. **HQ as a control, and unrefereed status.** The poles of HQ lie on the critical line, and its local factor
   at q is not tempered (a(q^k) grows like k^3 q^(k/2)); a device that reads SIZE or GEOM at every prime, or
   that reads analyticity on the line (every explicit-formula device does, through the polar terms), sees
   it. HQ is a control for the exact-relation question, not a new universal control. Lemma Q, HQ, Propositions
   I and F are elementary but have been read by the author only; the numeric checks are mpmath evaluations at
   predicted points (not ball arithmetic, no zero counts), and Hamburger's hypothesis "finitely many poles",
   Knopp 1994 and Lapidus-van Frankenhuijsen are cited as recalled.

## 10. Files

- `RESULT.md` (this file); `checks.py`, `checks.json`, `checks.log` (run:
  `scripts/memcap.sh 8 /opt/homebrew/opt/python@3.14/bin/python3.14 checks.py`, a few seconds);
  `lanes_line.json` (copy of the line appended to `campaign/lanes.jsonl`).
