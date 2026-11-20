# c11-ff-genus2-probe-jk: the squared signal of the Prop. 2.1 probe for genus 2 and 3 targets in F_q[T]

Internal working note, 2026-11-19. Slug `c11-ff-genus2-probe-jk`. Kind: deepen (attack slot, bounded model item).
Nothing committed, pushed or posted. All runs local through `scripts/memcap.sh 8` (longest 113 s). The compute
server was not used; no unit was started there.

This note makes **no statement about zeta** and none about zeros of any number-field L-function. It is a
function-field model computation in which the Riemann hypothesis of the targets is Weil's theorem. No requirement
flag is claimed and no R4 answer is attempted (STRATEGY 4.0, bounded item (b)). 7/8 (unrefereed) stands; RH open.

Labels: PROVED (argument given here; inputs named) / CLASSICAL / EXACT (equality or inequality of exact integers
or rationals on the stated cases) / MEASURED / ARGUED / NOT-RUN / OPEN.

## 0. Verdict

**Precise obstruction. Registered outcome (b) at N = 1 (upper bound only, no lower bound, no equality); for
N >= 2 the signal is not a class on C x C at all. The upper bound holds for every fake with real off-line
reciprocal-root pairs (96 of 96), so by the reading rule fixed in PREREG.md it carries no positivity input of
Hodge-index strength. Item 26's remainder is closed; this is not an RS-2 lead.**

1. **First lemma, polynomial form (PROVED as in c10 Lemma 1; EXACT check).** For F squarefree of degree 5 or 7 and
   every (N, lam, k) of the grid, S_cop(k) = Pol(L_1, .., L_N) with a polynomial of weighted degree <= N whose
   coefficients depend only on (q, N, lam, k) and on r(F) = number of roots of F in F_q. 1240 non-zero
   vector-strata, 0 points off the fit. The polynomial is the same for genus 2 and genus 3 (460 of 460 after
   L_3 = q L_1) and differs between r = 0 and r = 1 for 34 of 60 vectors.
2. **First lemma, linear form (EXACT).** S_cop(k) = sum_j c_j t_j with curve-independent c holds for N = 1
   (S = c_1 t_1; 380 of 380 vector-strata) and fails for N = 2 and N = 3 in every stratum with at least five
   free points (640 of 640 vector-strata; e.g. q = 7, genus 3, r = 0, N = 2: 2317 of 2576 points off the fitted
   plane).
3. **Decisive test (EXACT).** N = 1: 0 <= S^2 <= H := (g/2)(-D.D)/q on every curve; the ratio rho = S^2/H takes
   values from 0 to 1; rho = 1 exactly on the curves with all s_m equal (s_m = alpha_m + q/alpha_m); rho = 0 on
   curves with t_1 = 0. S^2 is not the value of any curve-independent quadratic form on P_0..P_2N (S^2 is not in
   the span of t_0..t_2N: 0 of 340 vector-strata with at least three free points at N = 1; 0 of 640 at N >= 2).
   Outcomes (a), (a'), (b2) do not occur. At N = 1 the test is one inequality per L-polynomial (it does not
   depend on lam, k or r): 5394 distinct L-polynomials, not the 15.7 million curve-cases the script counts.
4. **Control (EXACT).** Fakes prod_m (1 - s_m u + q u^2), integer coefficients, 24 seeds per class per (q, g):
   class R (all s_m real, some |s_m| > 2 sqrt q): inequality holds 96 of 96. Class C (a non-real pair s, sbar):
   fails 48 of 48 in genus 2, fails 17 of 48 in genus 3. Class W (on the line): holds 96 of 96.
5. **Why (PROVED, elementary; section 4).** The span of the Frobenius-graph classes splits orthogonally into a
   symmetric part (classes z^N f(z), f(z) = f(q/z)) and an antisymmetric part. On the symmetric part the form is
   2 q^N sum_m f(s_m)^2: semidefinite iff all s_m are real. On the antisymmetric part it is
   2 q^N sum_m (4q - s_m^2) G(s_m)^2: semidefinite iff |s_m| <= 2 sqrt q (given real). The diagonal class and
   every D_k lie in the symmetric part, so any Cauchy-Schwarz or sign statement about the signal reads only the
   reality of the s_m. The content of the index theorem beyond reality (the Weil bound) sits in the antisymmetric
   part, which the signal does not meet. Checked exactly: symmetric block semidefinite for curves 5394 of 5394,
   W 96 of 96, R 96 of 96, C 0 of 96; antisymmetric block semidefinite for curves 5394 of 5394, W 96 of 96,
   R 0 of 96, C 0 of 96; cross block zero in all 5682.

State for the scoreboard: model item closed, no flag, no named new input.

## 1. Plan, what is new, relation to closed rows

Read: BRIEF to the end; STRATEGY 3.1 items 23 and 26, 4.0 (RS-2; bounded item (b));
`c10-ff-signal-intersection-square/RESULT.md` and `REFEREE.md` (corrections 3 and 5 are used below); map rows
T3, Z15, Z15b, Z15c, Z24, Z30, Z31 and the controls section.

Known before (c10): in genus 1 the equality S^2 = -D.D/(2 q^N) is algebraic and holds for fakes; in genus 2, for
80 prime quintics and the pure signals M_1, M_2 only, the equality fails, 4(c) gives an upper bound, M_2 is not
linear in the traces. The c10 referee (correction 5) noted that the first inequality of 4(c) needs only real
phi_m. Not covered there: S_cop with marks (lam > 0, k > 0) on conductor degree >= 5; composite conductors;
genus 3; a fake control in genus >= 2; the question whether some other form on the same classes gives a two-sided
statement.

New here: the polynomial law with its r(F)-dependence on all squarefree conductors of degree 5 and 7; the exact
exclusion of every curve-independent quadratic form on P_0..P_2N (outcome (a')); the symmetric/antisymmetric
splitting with the two signatures; the three-class fake control in genus 2 and 3.

This is a bounded model item: no requirement flag is claimed and R4 is not addressed. Requirement flags expected
before the run: all false.

Decisive first test, run first and pre-registered (`PREREG.md`, written 01:24 local time; first run 01:26):
q = 5 and 7, conductor degree 5 and 7. One deviation from the registration, an extension: at q = 7, degree 7,
the registered seeded sample of 6000 was run (`curves_q7_d7_sample6000.json`, `sample.log`) and then all 705894
squarefree F (113 s); the tables use the full set; the sample gives the same outcomes.

## 2. First lemma

Conventions of `sq.py` (copied to `sq_q.py`; the only edits are q read from the environment and the size assert
written in q). nu_F(A) = Legendre symbol of Res(F, A); L(u, nu_F) = sum_n L_n u^n of degree 2g, g = 2 (deg F = 5),
g = 3 (deg F = 7); functional equation L_(2g-n) = q^(g-n) L_n checked by direct summation on 415 seeded F
(`fe_check.log`), then used. t_j = power sums of the reciprocal roots. S_cop as in `sq.py: scop`
(= `ffx.c cmd_sc`); the lane's values equal `ffx sc` (unchanged copy of `c10-ff-slot-cross-decomposition/ffx.c`,
target mode 0 with p3 = 3) on 450 vectors, 30 seeded F of degree 5 and 7 (`check_ffx.log`).

Grid: N in {1, 2, 3}, lam in {0, 1, 2, 3, 7}, k in {0, 1, 2, 3}: 60 vectors.

| family | curves | distinct (r, L_1, L_2, L_3) | distinct L-polynomials | S_cop a function of (r, L) |
|---|---|---|---|---|
| q = 5, deg 5 (all squarefree) | 2500 | 95 | 81 | yes, 0 mismatches |
| q = 7, deg 5 (all) | 14406 | 165 | 138 | yes |
| q = 5, deg 7 (all) | 62500 | 1481 | 1283 | yes |
| q = 7, deg 7 (all) | 705894 | 4600 | 3892 | yes |

**Lemma 1 [PROVED; EXACT check].** Within a stratum (q, r), S_cop(k) = Pol_(r,N,lam,k)(L_1, .., L_N), weighted
degree <= N, coefficients independent of F and of the genus. Proof: as c10 Lemma 1. The summand depends on A'
through its factorisation type; the sum of nu_F over squarefree A' of a type is a polynomial in the prime power
sums sum_{deg P = e} nu_F(P)^m, e m <= N. For odd m these are coefficients of log L(u, nu_F), polynomials of
weighted degree e in L_1..L_e. For even m they equal pi(e) minus the number of prime factors of F of degree e;
for N <= 3 only e = 1, m = 2 occurs, which gives the dependence on r(F). The reduction to prime power sums is the
Euler product of the generating function; this is where multiplicativity enters. QED.

| check | cases | outcome |
|---|---|---|
| S against the monomials of weighted degree <= N (exact rank test over all points of the stratum) | 1240 non-zero vector-strata (260, 260, 340, 380); 140 vector-strata are identically zero (all at odd N in the top strata r = 5 or r = 7, where L_1 = 0 on every curve) | 0 points off in all |
| polynomial of genus 3 equal to that of genus 2 after L_3 = q L_1 (same q, r, N, lam, k; full-rank strata) | 460 | equal in all |
| polynomial at r = 0 against r = 1 | 60 vectors (each q) | differs for 34 |
| closed form at k = 0, lam = 7 > N: S = -pi(7) h_N | N = 1, 2, 3 | S = 117648 L_1; -117648 (L_1^2 - L_2); 117648 (L_1^3 - 2 L_1 L_2 + L_3) |
| example with marks, (N, lam, k) = (2, 2, 1), q = 7, r = 0 | genus 2 and 3 | S = -245/2 - (245/2) L_1^2 + 140 L_2 |

**Linear form [EXACT].** In terms of traces, L_1 = -t_1, L_2 = (t_1^2 - t_2)/2: every N >= 2 polynomial with a
non-zero L_1^2 coefficient contains t_1^2 and is not a linear form in the t_j.

| statement | cases | outcome |
|---|---|---|
| N = 1: S = c_0 t_0 + c_1 t_1 with curve-independent c | 380 vector-strata | holds in all; c_0 = 0 |
| N = 2, 3: S in the span of t_0..t_N over the stratum | 640 vector-strata with at least 5 free points (r <= 2 at q = 5 genus 2; r <= 3 at q = 7 genus 2 and q = 5 genus 3; r <= 4 at q = 7 genus 3) | holds in 0. Points off the fitted plane, r = 0: 39 of 50, 79 of 88, 657 of 840 (N = 2) and 794 of 840 (N = 3), 2317 of 2576 (N = 2) and 2516 of 2576 (N = 3) |
| N = 2, 3: S in the longer span t_0..t_2N | same 640 | holds in 20: one stratum (q = 7, genus 2, r = 3, N = 3; 10 points, 7 columns, 3 free points). All others 0 |
| the remaining strata (fewer than 5 free points) | - | a linear fit exists in some of them (L_1 takes one or two values up to sign, so L_1^2 is constant or nearly so); not informative |

So the first lemma of the assignment holds in the polynomial form and fails in the linear form for N >= 2, at
genus 2 and 3, on all squarefree conductors.

## 3. Decisive test

G_jk = -P_j.P_k = q^j + q^k - Gamma_j.Gamma_k from point counts (`sq.py: gram`). Where the linear form exists
(N = 1): D_k = c_1 (P_2 + q P_0), H = (g/2)(-D_k.D_k)/q, E = -D_k.D_k/(2q) (genus-1 normalisation).

| registered outcome | test | result |
|---|---|---|
| (a) equality with one constant | distinct values of S^2/E per vector-stratum | never constant (0 of 380) |
| (a') S^2 = some curve-independent quadratic form on P_0..P_2N | S^2 in the span of t_0..t_2N | N = 1: 0 of 340 vector-strata with at least 3 free points. N >= 2: 0 of 640 |
| (b) 0 <= S^2 <= H on every curve | per curve | holds on all: 81, 138, 1283, 3892 distinct L-polynomials (2500, 14406, 62500, 705894 curves); -D.D < 0 never |
| (b2) lower bound S^2 >= c H, c > 0 | min rho | min rho = 0 in all four families (curves with t_1 = 0) |
| (c) no relation | - | not the outcome at N = 1 |
| prediction: rho = 1 iff all s_m equal | exact | q = 5 g = 2: 2 L-polynomials with rho = 1, both with s_1 = s_2; a third with s_1 = s_2 = 0 has S = H = 0. q = 7 g = 2: the same counts. q = 7 g = 3: 2 and 1. q = 5 g = 3: none with all s_m equal, max rho = 0.641 |

Outcome: **(b)** at N = 1; for N >= 2 there is no class D_k with curve-independent coefficients, and no
curve-independent quadratic form on the graph classes equals S or S^2.

Size of the evidence, stated plainly: at N = 1, S = c_1 t_1 and rho = t_1^2/(g sum_m s_m^2) does not depend on
c_1; the inequality is sum_{m<n} (s_m - s_n)^2 >= 0. The 20 vectors and the strata add nothing; the test is one
inequality per L-polynomial. The script's "curve-cases" (49980, 287700, 1249800, 14117860) count the same
inequality repeatedly.

## 4. Why: symmetric and antisymmetric classes

**Proposition A [PROVED, elementary; input: G_jk = q^min(j,k) t_|j-k| = sum over the 2g reciprocal roots of
alpha^k (q/alpha)^j, c10 referee re-derivation 2].** For x in the span of P_0..P_2N write x(z) = sum_i x_i z^i;
then -x.y = sum over roots of x(alpha) y(q/alpha). Call x symmetric if x(z) = z^N f(z), f(z) = f(q/z), and
antisymmetric if x(z) = z^N a(z), a(q/z) = -a(z). Then, with s_m = alpha_m + q/alpha_m and
a(z) = (z - q/z) G(z + q/z):

    symmetric:      -x.x = 2 q^N sum_m f(alpha_m)^2,
    antisymmetric:  -x.x = 2 q^N sum_m (4q - s_m^2) G(s_m)^2,
    mixed:          -x.y = 0.

Proof: x(alpha) x(q/alpha) = q^N f(alpha)^2 resp. -q^N a(alpha)^2 = q^N (4q - s^2) G(s)^2, summed over the 2g
roots in pairs; for the mixed term f(alpha) a(q/alpha) + f(q/alpha) a(alpha) = 0. QED.

Consequences.
- (i) For a real polynomial with the functional equation the symmetric block is positive semidefinite iff every
  s_m is real (roots real or on the circle); given that, the antisymmetric block is positive semidefinite iff
  every |s_m| <= 2 sqrt q. The Riemann hypothesis of the target is the pair of statements; the second is the
  one that fails for a real off-line pair.
- (ii) The diagonal class P_N (f = 1) and every D_k are symmetric. S = sum_m f(s_m) is the pairing of D_k with
  the symmetric class of f = 1, and S^2 <= g sum_m f(s_m)^2 is Cauchy-Schwarz inside the symmetric block. It uses
  reality of the s_m and nothing else (c10 referee correction 5, now with the block statement and the control).
- (iii) Rank. Modulo its kernel the symmetric block is R^g with the standard form (evaluation f -> (f(s_m))_m,
  distinct s_m). A square of a pairing with a fixed vector equals a norm for all f only in rank 1: g = 1 gives
  the equality of c10; g >= 2 gives rho = cos^2 of the angle between (f(s_m))_m and (1, .., 1), any value in
  [0, 1]. A lower bound for S^2 from the form is not available in rank >= 2 [PROVED: rho = 0 for f with
  sum_m f(s_m) = 0, attained on the curves with t_1 = 0].
- (iv) N >= 2 [ARGUED, not run]: S is a polynomial of degree up to min(N, g) in the pairings p(f) = sum_m f(s_m)
  (for example h_2 = (t_1^2 + t_2)/2 = (p(s)^2 + p(s^2) - 2q p(1))/2), that is a pairing of a fixed tensor in
  the symmetric powers of the symmetric block with the tensor powers of the diagonal class. Tensor powers of a
  semidefinite form are semidefinite, so the same Cauchy-Schwarz gives again an upper bound that reads reality of
  the s_m only. No two-sided statement arises this way.

Exact checks of Proposition A (`run_fakes.py`, `fakes.log`; blocks on B_j = P_(g+j) + q^j P_(g-j), j = 0..g, and
A_j = P_(g+j) - q^j P_(g-j), j = 1..g; semidefiniteness by all principal minors in exact rationals):

| set | n | symmetric block semidefinite | antisymmetric block semidefinite | cross block zero |
|---|---|---|---|---|
| curves, distinct L-polynomials (q = 5 g = 2; q = 7 g = 2; q = 5 g = 3; q = 7 g = 3) | 81; 138; 1283; 3892 | all | all (this is the Weil bound for the 5394 L-polynomials) | all |
| fakes W | 96 | 96 | 96 | 96 |
| fakes R | 96 | 96 | 0 | 96 |
| fakes C | 96 | 0 | 0 | 96 |

## 5. Controls

Required control: fakes with the functional equation and off-line reciprocal roots. Seed 20261119 + 100 q + g;
e_1 != 0 required at sampling so that S != 0 (stated here; PREREG asked for a non-degeneracy check).
S for a fake is the curve-independent law of strata r = 0 and r = 1 evaluated at the fake's L_1..L_N
(120 polynomials per (q, g)); on the fakes the law equals c.t for all 11520 N = 1 evaluations, and all N = 1
vectors give the same verdict as c = (0, 1) on every fake.

| (q, g) | class | n | equal to a curve L-polynomial | 0 <= S^2 <= H | -D.D < 0 | rho range | degenerate (S = 0 / D.D = 0 / gap = 0) |
|---|---|---|---|---|---|---|---|
| (5, 2) | W | 24 | 14 | 24 | 0 | 0.017 .. 1 | 0 / 0 / 4 |
| (5, 2) | R | 24 | 0 | **24** | 0 | 0.010 .. 1 | 0 / 0 / 1 |
| (5, 2) | C | 24 | 0 | 0 | 13 | -2.23 .. 40.5 | 0 / 1 / 0 |
| (7, 2) | W | 24 | 20 | 24 | 0 | 0.012 .. 0.988 | 0 / 0 / 0 |
| (7, 2) | R | 24 | 0 | **24** | 0 | 0.033 .. 0.942 | 0 / 0 / 0 |
| (7, 2) | C | 24 | 0 | 0 | 12 | -4.00 .. 8.17 | 0 / 0 / 0 |
| (5, 3) | W | 24 | 9 | 24 | 0 | 0.013 .. 0.821 | 0 / 0 / 0 |
| (5, 3) | R | 24 | 0 | **24** | 0 | 0.003 .. 0.884 | 0 / 0 / 0 |
| (5, 3) | C | 24 | 0 | 15 | 7 | -0.38 .. 16.3 | 0 / 0 / 0 |
| (7, 3) | W | 24 | 9 | 24 | 0 | 0.056 .. 0.931 | 0 / 0 / 0 |
| (7, 3) | R | 24 | 0 | **24** | 0 | 0.016 .. 0.692 | 0 / 0 / 0 |
| (7, 3) | C | 24 | 0 | 16 | 5 | -1.52 .. 2.67 | 0 / 0 / 0 |

Non-degeneracy: the fakes of class R and C are indefinite on the graph classes (antisymmetric block not
semidefinite 96 of 96 and 96 of 96, exact minors), S != 0 in all 288, gap != 0 in 282.

Reading (rule fixed in PREREG.md): the inequality holds for all 96 fakes of class R, whose reciprocal roots are
off the line. It also holds for 31 of 48 genus-3 fakes of class C (one real s_m and a complex pair with
2 (s_1 - Re s)^2 >= 6 (Im s)^2). **An inequality that holds for these fakes carries no positivity input of
Hodge-index strength.** It reads reality of the s_m in genus 2 and less than that in genus 3.

Post hoc, not registered: the pure N = 2 signal satisfies h_2 = L_1^2 - L_2 >= -g q on all W and R fakes
(96 of 96 each) and fails on 24 of 96 C fakes; the same reading (t_1^2 >= 0, t_2 >= -2 g q for real s_m).

Other controls of the brief:

| control | status | structural step |
|---|---|---|
| fakes with off-line zeros, class R | **pass** the inequality (96 of 96) | Proposition A (ii): only reality of s_m is read |
| fakes, class C | fail in genus 2 (48 of 48); pass in 31 of 48 in genus 3 | symmetric block indefinite (96 of 96); the single inequality at N = 1 is one direction of it |
| genus-1 identity of item 26 | recovered as the rank-1 case of 4(iii) | - |
| Davenport-Heilbronn | not run | the function field has no member with zeros off the line (c8); the fakes are the substitute |
| backward heat, sign-twisted primes, unimodular twist, zeta(s+a) zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w | not run | no positivity or zero statement is made; c10 ran the sign-twist and Liouville analogues at genus 1 for Lemma 1 |

## 6. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 multiplicativity essential | false | multiplicativity enters Lemma 1 (reduction to prime power sums). That is a property of a model identity; no attack step uses it, and the inequality holds for class-R fakes, which are not L-functions of anything |
| R2 height-uniform, every window | false | q in {5, 7}, N <= 3; no statement about zeros |
| R3 every control fails at a named step | false | class-R fakes pass every step; genus-3 class-C fakes pass in 31 of 48 |
| R4 reaches the critical line | false | not attempted (bounded item). The inequality is an upper bound for the signal that reads reality of s_m; the Weil bound sits in the antisymmetric block, which the signal does not meet |

## 7. Answer to the assignment's question and proposed map row

Question: for genus >= 2 targets, is the squared signal of the probe J_k a form on NS(C x C)_prim on which the
Hodge index theorem gives a two-sided statement, or only the upper bound found at genus 2 in round 10?

Answer (model, within the round-8 law that identifies the coherent part of J_k with wt_k q^d S_cop(k)): neither
a form nor two-sided. N = 1: the signal is the pairing of a symmetric class with the diagonal class; the squared
signal is not a value of any curve-independent quadratic form on the graph classes; the form gives the upper
bound S^2 <= (g/2)(-D.D)/q^N with ratio anywhere in [0, 1], and this bound holds for fakes with real off-line
root pairs. N >= 2: the signal is not linear in the Frobenius traces, so there is no class D_k on C x C.
Outcome (b) does not fail for the fakes; by the assignment's rule this closes item 26's remainder and gives no
RS-2 lead.

Proposed row (next free Z number; not entered by this lane):

| Squared signal of the Prop. 2.1 probe for genus 2, 3 targets (model) | S_cop(k) = Pol(L_1..L_N), coefficients depending on (q, N, lam, k, number of F_q-roots of F), genus-independent; linear in Frobenius traces only for N = 1. The graph-class span splits orthogonally: symmetric block 2 q^N sum f(s_m)^2 (semidefinite iff s_m real), antisymmetric block 2 q^N sum (4q - s_m^2) G(s_m)^2 (semidefinite iff abs(s_m) <= 2 sqrt q). Signal and diagonal are symmetric: S^2 <= (g/2)(-D.D)/q^N is Cauchy-Schwarz in the symmetric block, ratio in [0, 1], equality iff all s_m equal; S^2 is not a curve-independent quadratic form on the graph classes. | EXACT (q = 5, 7; all squarefree F of degree 5 and 7; 5394 L-polynomials); PROVED (Lemma 1, Proposition A); unrefereed | fakes with real off-line pairs pass (96 of 96); complex-quadruple fakes fail in genus 2 (48 of 48), pass 31 of 48 in genus 3 | `c11-ff-genus2-probe-jk` |

## 8. Three weakest steps

1. **The probe J_k itself was not computed.** The lane computes S_cop(k) (equal to `ffx sc` on 450 vectors) and
   uses the round-8 law |J_k| = wt_k q^d |S_cop(k)| to speak about "the squared signal of J_k". That law is exact
   at dual length 0, tested for r <= 5 on cubic conductors and extrapolated for r >= 6; it was never tested on
   conductor degree >= 5. STRATEGY item 26's "not covered: the probe J_k itself for r >= 6 on conductor
   degree >= 5" is therefore closed only for the target-dependent factor S_cop, not for wt_k or for the
   non-coherent part of the row energy.
2. **The decisive test has little content at N = 1 and none at N >= 2.** At N = 1 it is the inequality
   sum_{m<n} (s_m - s_n)^2 >= 0 once per L-polynomial; outcome (b) was predictable from c10 4(c) and its
   referee's correction 5. For N >= 2 no class D_k exists, and the statement that the tensor-power
   Cauchy-Schwarz again reads only reality (4(iv)) is ARGUED, not run. A different surface (C^N x C^N, the
   Jacobian, Sym^N C) could carry a form in which h_N is a one-body pairing; this was not examined.
3. **Scope of Lemma 1 and of the fakes.** N <= 3 (so the only even prime power sum is e = 1, m = 2; for N >= 4
   the strata need the number of prime factors of F of degree 2), q in {5, 7}, odd conductor degree only (even
   degree changes the L-polynomial by the factor 1 - u, c10 weakest step 1). The fakes are integer-coefficient
   products with the functional equation; class assignment (W / R) uses floating point with an asserted margin
   of 1e-7, the block tests themselves are exact. The classical inputs (intersection numbers of Frobenius graphs
   from point counts) are taken from c10 and its referee, not re-opened in a source.

Files: `PREREG.md`, `sq_q.py` (copy of c10 `sq.py`, q from the environment), `ffx.c` (unchanged copy),
`run_curves.py`, `curves.log`, `curves_q*_d*.json`, `analyze.py`, `analyze.log`, `analysis_q*_d*.json`,
`sample.log`, `genus_indep.log`, `run_fakes.py`, `fakes.log`, `fakes_q*_d*.json`, `fe_check.py`, `fe_check.log`,
`check_ffx.py`, `check_ffx.log`, `ref.py`, `ref.log`, `REFEREE.md`.
