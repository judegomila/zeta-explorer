# Referee (lens: controls and numerics) on c16-pos-fe-u2-positivity-rigidity

Independent pass. Verdict: **Theorem P, the corollary POS-FE and Proposition T hold. No statement about zeros of
zeta is made or follows.** Four corrections are owed (E1 to E4); none touches the proof of Theorem P. The label
"new result" is not established beyond the campaign record. Own code was run locally under `scripts/memcap.sh 8`
(scratch scripts in /tmp/c16ref, not kept in the lane; numbers below).

## 1. Proof steps re-derived

| step | what was re-derived | verdict |
|---|---|---|
| 1 | log G(s) - log G(s1) = -c w - int (1 - e^(-wu)) dPi, dPi = e^(-s1 u) d nu~/u; int min(1,u) dPi finite because nu~ is locally finite and the transform converges at s1 (nu >= 0, so absolutely). exp(-Bernstein) is completely monotone, so G(s1 + w)/G(s1) is the Laplace transform of a probability measure on [0, inf); N = x^(s1) P >= 0 on [1, inf). | holds |
| 2 | Landau for N >= 0: the abscissa is a real singularity, so it is 1 (r > 0) or -inf (G entire, r = 0). N([1,X]) <= X^2 G(2): tempered. | holds |
| 3 | On Re s = -1 the ratio gam(1-s)/gam(s) has modulus of order abs(t)^(3/2) (Stirling: abs Gamma(1 - it/2) / abs Gamma(-1/2 + it/2)); finite order gives Phragmen-Lindelof in the strip. | holds |
| 4 | Mellin: int Theta(y) y^(s/2-1) dy = gam(s) G(s). Residue of gam G at 1 is gam(1) r = r; at 0 it is -r by symmetry; at s = -2n none (gam G(-2n) = gam G(1+2n) finite). Shift and s -> 1 - s give Theta(y) + r/2 = y^(-1/2)(Theta(1/y) + r/2). | holds |
| 5 | mu(g_y) = r/2 + Theta(y); the transform of g_y is y^(-1/2) g_(1/y); so mu and muhat agree on Gaussians. y-derivatives converge in the Schwartz topology and give x^(2k) e^(-pi x^2); these span the even Hermite functions. | holds (standard facts used, not re-proved) |
| 6 | f = phi * phi~ is smooth with support in (-1,1); mu(f) = (r/2) norm^2; mu(fhat) = (r/2)(int phi)^2 + int abs(phihat)^2 dN. Fatou with phi_k -> 1 gives int sinc^2 dN <= 0. Evenness of phi is not needed (checked with a non-even phi below). | holds |
| 7 | mu = sum c_n delta_n has a 1-periodic transform; muhat = mu forces c_n = c_0 = r/2, so N({n}) = 2 c_n = r. | holds |
| Prop. T | For G = zeta m, abs M(x) <= C x^(-1/2), so abs A(x) <= C x^(-1/2) sum_{n<=x} n^(-1/2) = O(1); abs N has a convergent transform for Re s > 1; dominated convergence with abs(phihat_k) <= min(1, 1/(pi x)). | holds |
| scaled form | f = (1 - abs(x)/a)_+, fhat = a sinc^2(a x): (r/2)(1 - a) = a int sinc^2(a x) dN >= 0, so r = 0 for a > 1, then N = 0. | holds |
| QF implies RH | zeta meets the hypotheses with nu = Lambda >= -eps mu for every eps. | holds; one line |

No step assumes RH, uses verified height, or uses the Euler product. nu >= 0 enters only through Step 1.

## 2. Numerical re-run, different cases (float64, residues by mpmath)

Test function phi = 1/2 + sin(2 pi x) on [-1/2, 1/2] (not even; the lane used cos^2 and 1 - 4x^2, the earlier
pass cos): abs(phihat)^2 = sinc^2/4 + (sinc(t-1) - sinc(t+1))^2/4, norm^2 - (int phi)^2 = 1/2.

| case | left of (T) | right of (T) | defect | reading |
|---|---|---|---|---|
| zeta | 0.25 | 0.25 | 0 | exact (only n = 1 contributes) |
| ZQ, zeros 5, 6, eta = 0.25, r = 1.0088528290635108 | 0.25221306711 | 0.25221320727 | -1.4015e-7 | equals the neglected tail (r-1)/(8 pi^2 800) = 1.4016e-7 of the integral cut at x = 800 |
| ZQ, zeros 5, 6, eta = 0.49, r = 1.0091408792358922 | 0.25228507510 | 0.25228521981 | -1.4471e-7 | tail estimate 1.4472e-7 |
| G_+, zeros 5, 6, eta = 0.12, b = 0.3, r = 6.04e7 | 7653.1 | 1.5102e7 | fails | as it must (poles at 1/2 +- b); density A in [0.089, 1.53e7] at all nodes on [1, 800): N >= 0 |
| T-NR symmetric, q = sqrt 2, c = 0.3 | 0.5468096607 | 0.5825258826 | -0.0357162 | equals the mass term of f at x = 1/q (-0.0357160); closes to 2.6e-7 (sums cut at 2e5) |
| same with c = -0.3 (N signed and mass below 1) | 0.3968096607 | 0.4325258826 | -0.0357162 | same mass term; the c-part obeys (T) by itself |
| T-NR symmetric, q = 1.05, c = 1 | 0.7610793500 | 0.7501487874 | +0.0109306 | mass term +0.0109306; closes to 5e-8. The defect does not vanish as the lowest frequency 1/q approaches 1 from below at fixed test function |

Limit form of Proposition T (ZQ, zeros 5, 6): int over [1, 800] of sinc^2 A = -5.6060e-7 (eta = 0.25),
-5.7884e-7 (eta = 0.49); with the tail (r-1)/(2 pi^2 800) the sums are 9.2e-12 and 9.5e-12. A takes both signs
(min -3.43, max +3.47). All consistent with section 4 of RESULT.md.

The ZQ fine-grid values of table 3.1 were recomputed with own code at grid step 0.001 in L: 1.340404
(pair 24, 25, eta 0), 1.379159 (eta 0.1), 1.711107 (eta 0.3), 0.675680 (pair 34, 35, eta 0.1), 0.520429
(pair 91, 92, eta 0.1). They agree with the table to the printed digits.

## 3. Controls

- No zeta-only mechanism about zeros is claimed, so there is no conclusion to test against the battery. The
  controls that are members of the class minus one hypothesis were run (table above): ZQ (sign), T-NR (mass
  below 1), G_+ (poles). Each fails the named clause and the named step; confirmed.
- Davenport-Heilbronn at zeta's gamma factor, backward heat, sign and unimodular twists, Beurling, theta^w,
  zeta(s+a) zeta(s-a), phase-rotated transfer operator: outside the hypotheses (different functional equation,
  or no representation on [1, inf) with N >= 0). This is exclusion by hypothesis. It is not a structural
  failure of an argument about zeros, so R3 is not established.
- Necessity of "finite order" is not tested by any member on file (the claim text lists sign, mass below 1 and
  poles only; that list is accurate as far as it goes).

## 4. Errors and corrections

- **E1 (measured; affects the reading of the screen, section 0 item 6, section 3.1 first bullet, section 5 third
  bullet).** "The best integer member is ZQ" is a property of the column set, not of the family G = zeta m.
  The columns allow removing a zero or adding one at eighth points of a gap; they do not allow moving a zero
  along the line by a small step, which is a genuine member with integer multiplicities (pole of m at g_k,
  zero of m at 1/2 +- i(g_k + eps_k)). Own run: ZQ plus shifts of the 20 neighbouring zeros (10 on each side),
  successive linear programs on the exact non-linear D, sup of D^- on [1, 1e6] at grid step 0.001:

  | pair | eta | ZQ | ZQ + shifted neighbours | ratio | largest shift |
  |---|---|---|---|---|---|
  | 24, 25 | 0.0 | 1.340404 | 1.293589 | 0.9651 | 0.131 |
  | 24, 25 | 0.1 | 1.379159 | 1.332442 | 0.9661 | 0.128 |
  | 24, 25 | 0.3 | 1.711107 | 1.665865 | 0.9736 | 0.107 |
  | 34, 35 | 0.1 | 0.675680 | 0.658507 | 0.9746 | 0.038 |
  | 91, 92 | 0.1 | 0.520429 | 0.503962 | 0.9684 | 0.046 |

  So members with one forced quartet and delta 2.5 to 3.5 percent below ZQ exist in all five cells tried
  (float64, local search, not an optimum). ZQ is not a local minimum of delta in the family. Consequences:
  the sentence "no added on-line zero, further removal or further quartet lowers delta" is correct only for
  the listed columns; the fractional bound "0.79 of ZQ" is a bound for those columns only and is not a lower
  bound for the family; "eps of order eta^2 + d^2 is the true order" (section 5) is supported as an upper bound
  by ZQ and is not contradicted by these runs (the gain is a few percent), but the lower side is not
  established outside the column set. Section 3.2 already notes that small moves are not among the columns;
  the outcome lines should carry that restriction.
- **E2 (count).** The 40 cells are 35 distinct programs. K = 2000 selects the same pair (1496, 1497) as K = 1600
  and the columns are the zeros within 40 indices of the pair, so the five K = 2000 rows are the K = 1600
  programs run again (identical LP values; MILP bounds differ only through the time limit). Nothing above
  index 1537 enters any program. "K 25..2000" should read "pairs up to index 1497; 35 distinct cells, ZQ in
  all". Also "within 0.6 percent in 23 of 24 cells": the cell K = 50, eta = 0 is at 0.601 percent.
- **E3 (side remark, wrong; not used in Theorem P).** Hecke G(lambda), weight 1/2: the expansion
  sum a_n e^(2 pi i n tau/lambda) at tau = iy is e^(-pi x^2 y) with x^2 = 2n/lambda. The frequencies are
  sqrt(2n/lambda), not sqrt(lambda n/2). For lambda > 2 the first frequency is below 1, the support clause
  fails and nothing follows. The stated corollary is false as written: the lane's own control T-NR with
  q^2 an integer is such a series for lambda = 2 q^2 > 2 (frequencies n/q, n, nq; squares times q^2 are
  integers), starts at n = 1, has the pole at 1 only and non-negative coefficients. The scaled form applies to
  lambda < 2 instead. The same-lane REFEREE.md repeats the wrong formula in its candidate table.
- **E4 (label and wording).** (i) "proved-new-result": the content is the uniqueness of the Dirac comb among
  non-negative even self-dual tempered measures with no mass in 0 < abs x < 1 (equality case of the
  one-dimensional linear-programming bound) combined with Bochner's modular relation and a Bernstein-function
  step. RESULT.md says the literature was not looked up. Novelty is not established; the verdict should read
  "proved; identification; classical in content; new to the campaign record". (ii) Section 0 item 2 states (T)
  "for every phi in L^2 supported in [-1/2, 1/2]"; the proof gives it for smooth phi supported in the open
  interval, and that is all that is used.

## 5. Requirement flags (set by this referee)

| flag | value | reason |
|---|---|---|
| R1 | false | no multiplicative hypothesis is used anywhere; nu enters through N >= 0 only |
| R2 | false | no statement about zeros in any window |
| R3 | false | identification; controls are excluded by hypothesis, no mechanism about zeros fails on them |
| R4 | false | nothing passes to the critical line; the quantitative form that would is at least as strong as RH |

## 6. What survives

Theorem P; corollary POS-FE; Proposition T; the scaled form (support in [a, inf), a > 1, gives G = 0);
sharpness of the constant 1 by T-NR; necessity of sign, support and pole clauses by ZQ, T-NR, G_+ (numerics
reproduced on other cases); "QF implies RH". The screen survives as: on 35 distinct column sets (zeros within
40 indices of the pair, added zeros at eighth points, quartets at midpoints, binary weights, float64, window
x <= 1e6) the MILP incumbent is ZQ and the fractional bound is 0.796 to 0.875 of it. Not surviving: ZQ as the
optimum of the family (E1), the count 40 (E2), the Hecke lambda > 2 corollary (E3), "new" beyond the campaign
record (E4). Score 0; no statement about zeros of zeta.
