# REFEREE2 (second, independent) for c18-tz-one-sided-bound-fe-reserve-bridge/RESULT.md

Date 2026-11-20 (round 19, lane c19-referee-r18-independent-sources). Written from RESULT.md and `check_theorem_a.py`; the first referee
file was opened after sections 1 to 3 were fixed. No statement about zeros of zeta is made by the lane or here.

**Verdict: holds with corrections.** The exact truncation identity holds with the constant -u and without the term log abs(a_P)
printed in display (A). Flags set by this referee: R1 false, R2 false, R3 false, R4 false.

## 1. The decisive step, re-derived: the constant in Theorem A (b)

Claim tested: D_P'/D_P(s) = -u/2 + c_0 + lim sum over abs(Im beta) < T of 1/(s - beta), with "c_0 absorbed in log abs(a_P)".

Derivation. All zeros of D_P lie in a strip -A < Re s < B. For s inside the rectangle R = [-A, B] x [-T, T],
(1/2 pi i) times the integral over the boundary of R of D_P'/D_P(w)/(s - w) dw = sum over zeros in R of 1/(s - beta) - D_P'/D_P(s).
On the left side D_P'/D_P -> -u (the term a_P P^-w dominates, whatever a_P != 0 is), and the integral of -u/(s - w) over that side
tends to u/2 as T -> infinity. On the right side D_P'/D_P is a Dirichlet series without constant term and contributes 0 in the limit
B -> infinity. The horizontal sides contribute O(1/T). Hence

    D_P'/D_P(s) = -u/2 + lim sum over abs(Im beta) < T of 1/(s - beta)        for every a_P != 0,   c_0 = 0.

Check on D = 1 + a P^-s: sum over zeros = (u/2) coth(u (s - beta_0)/2) with e^(-u(s - beta_0)) = -a P^-s, so
(u/2)(1 - a P^-s)/(1 + a P^-s) - u/2 = -u a P^-s/(1 + a P^-s) = D'/D, for every a.

Consequence. The exact truncation identity is

    -2 Re <h, A_P h> = -u norm(h)^2 + lim sum over abs(Im beta) < T of <h, kappa_beta h>     (a_1 = 1, a_P != 0, h in H^1_0[0, u]),

with no term log abs(a_P). Tail of the truncated zero sum: (u - 2 log abs(a_P))/(pi T) norm(h)^2 (1 + o(1)), because the mean of
Re beta is log abs(a_P)/u. Step (a) (truncation is exact on logarithmic coefficients; no multiplicativity) and step (c) (kernel
e^((beta - 1/2) abs(xi)) and the point mass -u delta) were re-derived and hold.

## 2. Required recomputation at P = 12 and P = 20 in ball arithmetic

`local/tz_bridge_balls.py`, python-flint acb at 160 bits, local, through `scripts/memcap.sh 8` (resident memory below 1 GB).
Test vector h = sin^4(pi s/u) e^(i tau s) written as five exponentials; both sides in closed form (no quadrature, no interpolation).
Zero lists: float Newton from a grid, then ball Newton; every zero certified by an interval Newton inclusion; the count certified
equal to the argument-principle count on [-A, B] x [-T, T] (two horizontal ball integrals; the vertical sides in closed form).
All 15 counts agree. Radius of every residual below 1e-44.

| series | P | tau | T | zeros certified = argument-principle count | right of 1/2 | (left - right)/norm^2 with constant -u | times T | (u - 2 log abs a_P)/pi | residual minus predicted tail | residual if log abs(a_P) is kept |
|---|---|---|---|---|---|---|---|---|---|---|
| a_n = 1 | 12 | 9 | 150 | 118 | 38 (32.2%) | 5.311446e-03 | 0.7967 | 0.7910 | 3.8e-05 | same |
| a_n = 1 | 12 | 9 | 600 | 474 | 154 (32.5%) | 1.356653e-03 | 0.8140 | 0.7910 | 3.8e-05 | same |
| a_n = 1 | 12 | 9 | 2400 | 1900 | 588 (30.9%) | 3.298836e-04 | 0.7917 | 0.7910 | 3.1e-07 | same |
| a_n = 1 | 20 | 15 | 150 | 142 | 58 (40.8%) | 6.914782e-03 | 1.0372 | 0.9536 | 5.6e-04 | same |
| a_n = 1 | 20 | 15 | 600 | 572 | 222 (38.8%) | 1.585099e-03 | 0.9511 | 0.9536 | -4.2e-06 | same |
| a_n = 1 | 20 | 15 | 2400 | 2288 | 848 (37.1%) | 3.979096e-04 | 0.9550 | 0.9536 | 5.9e-07 | same |
| a_n = 1 except a_12 = 3 | 12 | 9 | 150 | 118 | 60 (50.8%) | 5.955571e-04 | 0.0893 | 0.0916 | -1.5e-05 | -1.0980 |
| a_n = 1 except a_12 = 3 | 12 | 9 | 600 | 474 | 248 (52.3%) | 1.653241e-04 | 0.0992 | 0.0916 | 1.3e-05 | -1.0984 |
| a_n = 1 except a_12 = 3 | 12 | 9 | 2400 | 1898 | 978 (51.5%) | 3.828639e-05 | 0.0919 | 0.0916 | 1.3e-07 | -1.0986 |
| a_5 = -3/2, a_6 = 2, a_12 = 1/4, else 1 (not multiplicative) | 12 | 9 | 150 | 120 | 50 (41.7%) | 1.117526e-02 | 1.6763 | 1.6735 | 1.9e-05 | 1.3975 |
| same | 12 | 9 | 600 | 474 | 206 (43.5%) | 2.864720e-03 | 1.7188 | 1.6735 | 7.6e-05 | 1.3892 |
| same | 12 | 9 | 2400 | 1898 | 870 (45.8%) | 6.986067e-04 | 1.6767 | 1.6735 | 1.3e-06 | 1.3870 |
| Liouville lambda(n) | 20 | 15 | 150 | 143 | 63 (44.1%) | 6.825727e-03 | 1.0239 | 0.9536 | 4.7e-04 | same (a_20 = 1) |
| Liouville lambda(n) | 20 | 15 | 600 | 573 | 217 (37.9%) | 1.572965e-03 | 0.9438 | 0.9536 | -1.6e-05 | same |
| Liouville lambda(n) | 20 | 15 | 2400 | 2287 | 829 (36.2%) | 3.977563e-04 | 0.9546 | 0.9536 | 4.4e-07 | same |

Reading. (i) With the constant -u the residual equals the predicted tail (u - 2 log abs a_P)/(pi T) up to a term that falls to
1e-7 to 1e-6 at T = 2400, at P = 12 and P = 20, for zeta's partial sums, a completely multiplicative chain, a series with a_P = 3
and a non-multiplicative series with a_P = 1/4. (ii) With the term log abs(a_P) kept the residual tends to -log 3 = -1.0986 and to
+log 4 = 1.3863: the printed display (A) is false for a_P != 1. (iii) The left side for "a_12 = 3" equals the left side for a_n = 1
to all digits (-0.3033696328354461): Lambda_a(n) for n < P does not depend on a_P, as step (a) says. (iv) Mean of Re beta over the
certified lists: 0.0009, 0.0006 (a_P = 1), 0.4423 against log 3/u = 0.4421, -0.5561 against -0.5579. (v) The rows P = 12, 20 that the
lane's own check could not use (incomplete zero lists) are now checked with complete lists.

Status of the check: ball arithmetic for both sides and for the completeness of the zero lists; the limit T -> infinity is not
taken rigorously (the tail law is observed, with the 1/T^2 remainder visible at three values of T).

## 3. Corrections (sentence to use)

| # | Where | Status | Sentence to use |
|---|---|---|---|
| C1 | Display (A) and Theorem A step (b) | ERROR for a_P != 1 (zeta unaffected) | "-2 Re <h, A_P h> = -u norm(h)^2 + sum over zeros beta of D_P of <h, kappa_beta h>, for a_1 = 1 and a_P != 0. D_P'/D_P(s) = -(log P)/2 + lim sum over abs(Im beta) < T of 1/(s - beta), with no further constant." Delete "c_0 is absorbed in the term log abs(a_P)". |
| C2 | Convergence paragraph | completion | "The tail beyond T is (u - 2 log abs(a_P))/(pi T) norm(h)^2 (1 + o(1)); the mean of Re beta is log abs(a_P)/u." |
| C3 | Verdict item 4, section 3 row C1, proposed map row ("34 to 41 percent", "about 35 to 40 percent") | numbers came from incomplete lists | "With certified complete zero lists the share of zeros of D_P right of the line is 31 to 33 percent at P = 12 and 37 to 41 percent at P = 20 (heights to 2400); the first referee found 27 to 35 percent at P <= 8 (heights to 300)." |
| C4 | Control row Davenport-Heilbronn, "holds verbatim" | condition | "Holds for every Dirichlet series with a_1 = 1 and a_P != 0, with the constant -u; if a_P = 0 the point mass is -log of the largest n <= P with a_n != 0." |
| C5 | Numerical check paragraph | status | "Checked in ball arithmetic at P = 12 and P = 20 with complete certified zero lists (second referee); float64 at P = 3 to 8 (lane and first referee)." |

Not re-derived in this pass: Lemma R, Lemma C, Proposition Z, the window term, the control table (the first referee re-derived
Proposition Z in the lattice model and restricted Lemma R; see its E3, E4, E7, which this referee read and has no ground to dispute).
The explicit formula (EF) is used in the c15 normalisation; this pass tested Theorem A only, which does not depend on it.

## 4. Comparison with the first referee (opened after sections 1 to 3)

Same verdict and the same main correction (its E1 = C1 here, found independently; its tail law = C2). New here: ball arithmetic
with certified zero lists at P = 12 and 20 (the first referee ran float64 at P <= 7); the right-of-line shares at P = 12, 20 (C3:
the share grows with P, so the lane's "34 to 41 percent" is close for P = 12 to 20 and its first-referee replacement
"27 to 35 percent" is a statement about P <= 8 only). Its E5 (factor 2 in the pole bound of verdict item 1) is agreed by inspection.

## 5. Flags

R1 false: the identity holds for a non-multiplicative series and for a_P != 1 (table). R2 false: no inequality is established.
R3 false: the lane's ZQ pass is a lattice-model statement (not rerun here); no control fails at a structural step.
R4 false. Referees on this lane after this file: 2, both hold with corrections. PROVED labels broken: 1 (display (A), the term
log abs(a_P); already counted by the first referee).
