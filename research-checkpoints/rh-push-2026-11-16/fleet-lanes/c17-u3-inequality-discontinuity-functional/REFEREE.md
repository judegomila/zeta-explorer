# REFEREE (adversarial, lens: general): c17-u3-inequality-discontinuity-functional

Date 2026-11-19. Referee scripts and outputs: `/tmp/c17ref/ref_a.py`, `ref_a.json`, `ref_lp.py`, `ref_lp.log`,
`ref_lp.json` (local, `scripts/memcap.sh 8`, python of `.venv-arb`; nothing run on the server; no file of the
lane was changed). The lane's `fe_lp.py` was imported unchanged for the LP reruns; everything in `ref_a.py` is
an independent implementation.

Verdict of this referee: **holds, with five corrections of wording and scope (E1 to E5)**. The verdict
"precise obstruction" stands. Every PROVED step was re-derived and confirmed. No statement about zeros of
zeta is made. Nothing assumes RH; the zeros of zeta enter only as numerical ordinates below height 131.
No classical theorem is presented as new (Lemma R, Proposition TL, Hamburger and the T-NR construction are
labelled elementary or classical in the file). Flags: R1 = R2 = R3 = R4 = false.

## 1. PROVED steps, re-derived

| step | result of the re-derivation |
|---|---|
| Lemma S6 (sinc^2 balance) | Confirmed. From Proposition T of c16 (refereed there): pairing mu = (r/2) delta_0 + (N + N reflected)/2 with f = phi * phi(-.) gives (T); phi_k -> indicator, abs(phihat_k(x)) <= min(1, 1/(pi abs x)), and x^(-2) is integrable against abs(N) because the transform of abs(N) converges at s = 2; sinc vanishes at the positive integers, so int sinc^2 dN = int sinc^2 dN_off = 0. The hypothesis "abs(N) has a convergent transform for Re s > 1" is not an extra assumption in the Lipschitz statement: if N >= -eps' dx then N + eps' dx >= 0 has transform G + eps'/(s-1), whose only real singularity is s = 1, and Landau gives convergence for Re s > 1. |
| kappa_0 | Confirmed: 1/2 - Si(2 pi)/pi = 0.0485883332 (two ways). |
| F(x) = sum over n <= x of M(x/n)/n; M = sum c_j y^(rho_j - 1) | Confirmed (m - 1 = sum c_j/(s - rho_j) since m -> 1; int_1^inf y^(-s) y^(rho-1) dy = 1/(s - rho)). |
| residue formula and abs(c_j) = (eta^2+d^2)/(2d)(1 + O(1/gbar)) >= eta | Confirmed by hand: numerator at w^2 = -g_1^2 is (g_1^2 - gbar^2)^2 + 2 eta^2 (g_1^2 + gbar^2) + eta^4 = (eta^2 + d^2)(2 g_1^2 + 2 gbar^2 + eta^2 - d^2); denominator derivative (-2 i g_1)(g_1^2 - g_2^2). Checked against partial fractions of the product form (difference below 4e-16 in three new cases). |
| Lemma R (reality) | Confirmed as stated in section 3 (the quartet/pair transition is a hypothesis of the lemma). See E1 for the summary wording. |
| Proposition O | Confirmed (a tautology: a functional of N_off vanishes when N_off = 0). |
| Proposition TL | Confirmed (one line). |
| Proposition W (a) to (d) | Confirmed. (a) m(1-s) = m(s) by inspection; (b) zeta(s) q^(+-(s-1/2)) = q^(-+1/2) sum (n q^(-+1))^(-s); (c) w + 1/w = -c has roots -q^(+-b); (d) abs(cosh z - 1) <= cosh abs(z) - 1 and 2 + c >= 4. |
| Lemma LR (a) to (c) | Confirmed. m_z = w + c + 1/w with w = conj(z) q^(s-1/2); roots real with product 1; abs(alpha) = q^(1/2+b). (c): (1+delta)^b <= 1 + delta iff b <= 1. See E4 for the lift. |
| 6.1 zero functional | Confirmed by hand: rotation of the Mellin integral to the ray, split at abs(y) = 1, fold with the theta relation; the r-term and the E-term have the signs written; on Re s = 1/2 the two incomplete-gamma terms and the two r-terms are complex conjugates, so Lambda_phi is real there for every real (a, r). |
| X = 4000 bracket (ARGUED in the file) | The lower end is sound: at rho >= rho_min(300) the columns n > 300 contribute at most about 31 x 3e-12 in total. It gives a lower bound only; the upper end exists only in the 18 cells with a feasible multiplicative point at X = 4000 (counted from the logs: 15 + 3). |

## 2. Numerical checks rerun with different cases

Block A (independent code, residues from the product form, grid 5e-4 on [1, 400]):

| pair | d | eta | abs(c_j) | (eta^2+d^2)/(2d) | int sinc^2 F | tail bound | int sinc^2 F^+ | int sinc^2 F^- |
|---|---|---|---|---|---|---|---|---|
| 27, 28 | 0.6096 | 0.15 | 0.323279 | 0.323276 | -1.1e-8 | 2.2e-8 | 3.65118e-3 | 3.65119e-3 |
| 31, 32 | 0.8605 | 0.40 | 0.523247 | 0.523236 | -2.1e-8 | 4.2e-8 | 8.02870e-3 | 8.02872e-3 |
| 1, 2 | 3.4437 | 0.30 | 1.7558, 1.7489 | 1.7349 | -1.0e-5 | 2.1e-5 | 4.46791e-2 | 4.46895e-2 |

The balance holds inside the tail bound in all three, including the pair (1, 2) where gbar is small and the
O(1/gbar) term of abs(c_j) is 1.2 per cent. Mellin check at s = 3: relative 1.6e-4, 1.9e-4, 2.8e-6.

Block B (Proposition W): delta = 0.03, b = 0.3: zero height 106.283, abs(m) = 7e-21 at 1/2 + b + 3 i pi/log q
and 5e-32 at 1/2 - b + i pi/log q; delta = 0.5, b = 0.49: height 7.748; delta = 1e-4, b = 0.2: height 31417.5.
Sum over the atoms n/q, n, nq against zeta(s) m(s) at s = 4 + 2.3i: difference 2e-13 (the nsum tolerance).
sup of abs(m - 1) on abs(s - 1/2) = 3 against the bound of (d): 1.96713e-3 vs 1.96716e-3; 0.41373 vs 0.41782;
2.24977504e-8 vs 2.24977504e-8. Smallest atom at 1/q < 1 in every case (the support clause fails, as stated).

Block C (Lemma LR): q = 3, c = -2.5, arg z = 1.3: b = 0.630930, zeros at Re s = 1.130930 and -0.130930
(closed form and root finder agree); q = 1 + sqrt 2, c = 2.19, arg z = 4: b = 0.490724; q = 1.01, c = 2.0001:
b = 1.00499 (a local root exceeding q^(1/2) by the factor 1.01005 puts zeros a full unit off the line: item
(c) of the lemma). Factorisation with alpha, alpha' exact to 4e-31.

Tables: `mktab.py` rerun on a copy of `logs/` reproduces `tables.md` byte for byte. Cell counts from the logs
match the text (X = 300: 36 feasible multiplicative, 35 feasible unconstrained of 42; X = 4000: 18 feasible
multiplicative; 331 to 507 of 589 variables at a bound).

LP reruns at X = 300 (local, HiGHS interior point with crossover, same code):

| cell | class / box | LP lower bound | full-grid defect |
|---|---|---|---|
| 13,14 eta 0.45 (repeat) | unconstrained, box 31 | 0.318237 | 0.318539 |
| same | box 3 / 310 / 3000 | 0.318238 / 0.318236 / 0.318236 | 0.31854 / 0.31855 / 0.31854 |
| same | no multiplicativity, bounds of the multiplicative class: 0 <= a_n <= 2^omega(n) | 0.420031 | 0.420345 |
| 24,25 eta 0.01 (repeat) | box 31 / 3 / 310 / 3000 | 0.145897 in all four | 0.14600 |
| same | bounds 0 <= a_n <= 2^omega(n) | 0.145897 | 0.14602 |
| 27,28 eta 0.15 (new eta) | unconstrained / matched bounds / multiplicative | 0.091653 / 0.091653 / - | 0.09172 / 0.09171 / 0.09205 |
| 31,32 eta 0.10 (new pair, d = 0.8605) | unconstrained / matched bounds / multiplicative | 0.230319 / 0.230321 / - | 0.23051 / 0.23038 / 0.23187 |
| 43,44 eta 0.05 (new pair, d = 0.7545, height 130.3) | unconstrained / matched bounds / multiplicative | 0.054831 / 0.054831 / - | 0.05488 / 0.05487 / 0.05485 |

Read: (i) the two repeated cells reproduce the table to 5 digits; (ii) the relaxation does not depend on the
box between 3 and 3000, although about 190 of 300 coefficients sit at the box (they are the columns the grid
does not see); (iii) new cells: ratio multiplicative / unconstrained lower bound 1.004, 1.007, 1.0004; all
defects above 0.047, so the statement "no quartet at delta <= 1e-2 in the model at the tested heights" holds
in the new cells too; (iv) kappa for pair 27, 28 from the new eta: (0.09205 - 0.08670)/0.15^2 = 0.24, as
claimed.

Controls inside the model (the file claims no zeta-only mechanism, so there is nothing to separate; these
check the control table of section 7): Liouville sign twist a_n = lambda(n), best r: grid defect 1.14 at
X = 300 (not small, as the table says); a_n = n^(+-0.01): 0.0080, 0.0079 with r on a grid of step 0.01
(file: 0.0069 with r optimised). Proposition W and Lemma LR are themselves the T-NR / NR-q / Beurling control
runs and were recomputed above.

## 3. Errors and corrections

**E1 (wording; summary item 2 and the one-line claim "the square root comes from reality on the critical
line (double zeros)").** As an unqualified statement, "for real coefficients an off-line zero is born at a
double zero" is contradicted by Proposition W of the same file: that member has real coefficients, the exact
functional equation, and off-line zeros at fixed distance b that arrive from infinite height as delta
decreases to 0 (height pi/log(1+delta)); no double zero on the line is involved and there is no square-root
law (abs(m - 1) is of order delta^2 on compact sets while the distance b is arbitrary). Lemma R as stated in
section 3 is correct because the transition "pair on the line -> quartet" is its hypothesis. Corrected
reading: the square root is the law of the birth-on-the-line mechanism (ZQ, and the model of section 6,
where it is built in); the second mechanism (arrival from large height) has no such law.

**E2 (attribution; "ratio 1.003 to 1.40", "multiplicativity on coprime pairs changes a constant").** The
multiplicative class of the test carries the bounds 0 <= v_q <= 2, the relaxation the bounds abs(a_n - 1) <= 31.
In the cell with the largest ratio (13, 14 at eta = 0.45; 1.398) the relaxation with the multiplicative
class's own bounds and no multiplicativity has minimum 0.4200: the factor 1.32 comes from the bounds (the
unconstrained optimum has a_3 = 2.355 > 2), and multiplicativity accounts for at most 0.4448/0.4200 = 1.059.
In the cell 24, 25 at eta = 0.01 the matched bounds change nothing (0.14590), so the 1.19 there is
multiplicativity or the local optimum of the sequential LP; which of the two is not decided. The direction
of the correction supports the verdict (the classes are closer than the table shows), but the ratio column
measures "multiplicativity plus bounds", not multiplicativity.

**E3 (scope; "delta_0 between 0.23 d^2 and 0.47 d^2", "the ZQ law eta^2 + d^2 again").** Only the eta^2
increment is measured as a law. The threshold delta_0 is not a function of d: pair 43, 44 (d = 0.7545) has
delta_0 = 0.0548 = 0.096 d^2, below the stated range and below pairs with smaller d (27, 28: d = 0.61,
0.087; 40, 41: d = 0.655, 0.105). The d-part of the ZQ law is not reproduced by the test; the extrapolation
"reachable when d < sqrt(delta/0.3)" has no support in the data and should be dropped or marked as a guess.

**E4 (statement of scope; Lemma LR and the control row "NR-q, every lift z").** m_z(1 - s) = m_(conj z)(s).
For z not equal to +-1 the product zeta m_z has neither zeta's functional equation nor real coefficients, so
it is outside the classes of sections 2 to 4; the lemma (location of the zeros of m_z) is true for every z,
but only z = +-1 is a member with the exact functional equation. Also: the coefficient set of zeta m_z
contains n/q, so "multiplicative on the semigroup generated by the rational primes and q" needs q^(-1) as a
generator (or the factor q^(1/2 - s), which shifts the functional equation); and the factor at q is a
polynomial in q^(-s), not an inverse polynomial, so "Euler product over the primes and q" is in the
generalised sense only. The conclusion (NR-q fails through integrality and the size of the local root, not
through multiplicativity) is unaffected.

**E5 (one-line claim; "reach is 0 at delta <= 1e-2 in both classes").** This is a statement about the model
functional Lambda_phi*, which is real on the line by construction. For the true continuation the file's own
shift benchmark gives zeros at distance alpha at grid defect 1.14 alpha to 1.42 alpha (X = 4000), in both
classes (n^alpha is completely multiplicative and inside the box). The claim line should read "in the
symmetrised model"; section 9 item 1 already says so.

Minor. The header date is 2026-11-20 (server clock); "at least 0.047 below height 125" holds for the seven
pairs of the file and for 31, 32 and 43, 44 (height 130) here, nine pairs in all, not for all pairs below
that height. Phi_1 >= c sqrt(eps) is ARGUED and stays ARGUED (measured here on no further member).

## 4. Requirement flags (set by this referee)

- R1 false. No step uses multiplicativity; the measured evidence is against it in this cell (ratio 1.0004 to
  1.007 in three new cells; the 1.40 of the file is a bound effect, E2).
- R2 false. Proposition W and ZQ agree with zeta on every fixed window.
- R3 false. No statement holds for zeta and fails for a control for a structural reason tied to the Euler
  product; the separations are by integrality or the support clause.
- R4 false. Proposition TL: at delta = 0 the inequality is the target.

## 5. Surviving claim

No statement about zeros of zeta. PROVED (elementary, confirmed by this referee): (1) for a signed member with
the exact functional equation, int over [1, inf) of sinc^2 dN_off = 0, and N_off >= -eps' dx gives
int sinc^2 dN_off^+ <= 0.0485883 eps'; (2) zeta(s)(q^(s-1/2) + c + q^(1/2-s))/(2 + c), q = 1 + delta,
c = q^b + q^(-b), has the exact functional equation, the pole at 1 only, a non-negative coefficient measure
with atoms within delta of log n, and zeros on Re s = 1/2 +- b at heights (2k+1) pi/log(1 + delta), for every
b > 0; it violates the support clause of Theorem P (atom at 1/q); (3) the zeros of the factor
conj(z) q^(s-1/2) + c + z q^(1/2-s) lie on Re s = 1/2 +- arccosh(abs(c)/2)/log q for every unimodular z, so a
bound abs(alpha) <= q^(1/2+delta) on its local root is the statement that those zeros lie within delta of the
line; (4) any inequality "zeros within f(defect), f(0) = 0" on a class containing zeta at defect 0 is the
target. MEASURED (float64, symmetrised model, X = 300 to 4000, nine pairs below height 131): the smallest
functional-equation defect that admits a model quartet is at least 0.047, grows by kappa eta^2 (kappa 0.24
to 0.51) for eta <= 0.2, and is the same in the multiplicative class and in the relaxation up to a factor
1.0004 to 1.23, the larger factors being partly a bound effect; the relaxation is independent of the box
between 3 and 3000. The square-root law belongs to the birth-on-the-line mechanism only (E1); the dependence
of the threshold on the gap d is not established (E3).
