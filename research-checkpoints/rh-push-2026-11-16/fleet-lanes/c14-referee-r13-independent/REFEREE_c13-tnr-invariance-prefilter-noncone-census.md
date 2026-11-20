# Independent referee: c13-tnr-invariance-prefilter-noncone-census (Lemmas P, L, E)

Referee lane `c14-referee-r13-independent`, 2026-11-19. Written from the lane's RESULT.md and PREFILTER.md; the lane's
REFEREE.md was not read. Own code: `items124.py` (block lane 1), `item1b.py`; outputs `items124.json`, `item1b.json`.
Nothing here is a statement about zeros of zeta.

## Verdicts

| statement | verdict | exact line / form |
|---|---|---|
| Lemma P (section 2.2) | **HOLDS** | The lemma is the implication "every H_i W-stable, each holds for zeta, some m_w has a zero in R => the device's implication is false". The witness m_w zeta is exhibited. Nothing to restrict in the lemma itself. |
| Proposition S, items S1, S2 (a)-(f), S3 | **HOLDS IN NARROWER FORM** | Each item holds in one of two normalisations and the list mixes them. S1 "functional equation with zeta's gamma factor" is the Laurent form X = xi* m_w (exact symmetry s <-> 1-s, frequencies log(n/p0^N), not integers). S1 "multiplicative coefficients" and S2(a) "a(n) >= 0", S2(c) are the D form F = zeta D (integer frequencies, functional equation of conductor p0^(2N)). A hypothesis list is passed by Lemma P only if all its hypotheses are typed in ONE normalisation. The lane says this under X4; it has to be read as part of the lemma's use rule, not as an exclusion among others. |
| Lemma L (section 2.3) | **HOLDS** | Proof checked line by line: K_w(x_i y_j) = (W H)_ij, W_(i,m) = omega_(m-a_i); Cauchy-Binet; W is a row/column submatrix of the Toeplitz matrix of (omega_-1, omega_0, omega_1); total positivity iff omega_-1 + omega_0 z + omega_1 z^2 has only real non-positive zeros iff c >= 2 (for c > 0). The conclusion is conditional on a constant sign of K's own lattice-row minors. |
| Verdict item 3, "totally positive exactly when c >= 2, i.e. exactly when the twin's extra zeros leave the line" | **HOLDS IN NARROWER FORM** | For c > 0: totally positive iff c >= 2; zeros off the line iff c > 2. At c = 2 the weight sequence is totally positive and the zeros of m are double zeros ON the line. For c <= -2 the zeros are off the line (c < -2) and the sequence is not totally positive. The sentence should read "for c > 0, exactly when c >= 2; the zeros are off the line for c > 2". |
| Census entry N2, "T-NR cannot fail aligned-node minors" | **HOLDS IN NARROWER FORM** | Holds for every order and node range in which zeta's lattice-row minors have a constant sign. That hypothesis is MEASURED (lane: orders 3 to 5, one box; this referee: same box and a wider one, 100 node sets per order, constant sign -, -, +). It is not proved. |
| Lemma E (section 2.3) | **HOLDS** | xi(1/2 + a + it) = int Phi(u) e^(au) e^(itu) du; the product corresponds to the convolution; det[Phi(u_i - v_j) e^(+-a(u_i - v_j))] differs from det[Phi(u_i - v_j)] by positive row and column factors; the basic composition formula holds order by order. The kernel is that of the product of two Riemann xi functions (with the factors s(s-1)/2), i.e. of the completed E_a times a real polynomial of degree 4 in s. |

No statement is BROKEN.

## What was checked numerically (first decisive check: control object not identically zero, sign reproduced)

- T-NR object, Laurent form, (p0, c) = (2, 2.0506): xi*(2) m(2) = 2.7398 (not zero); functional-equation defect at 0.3 + 2i: 4.5e-17; zero of m at 0.823846 + 4.532360i with abs(m) = 3.4e-59 and abs(zeta) = 0.7105 there. (3, 2.0785): value 3.9098; zero at 0.754203 + 2.859601i, abs(zeta) = 0.5868. The lane quotes 0.823877 and 0.754140: those are for c sqrt(p0) = 29/10 and 18/5 exactly (c = 2.0506097, 2.0784610), consistent to the shift in c. The lane's F(2) = 3.0431, 2.3638 are the D form zeta(2) D(2); reproduced by hand.
- X1 numbers at (3, 2.2): Lambda_F(3^k)/log 3 = 4.81, -7.52, 22.03, -53.59 (recurrence for alpha^k + beta^k): reproduced.
- Lemma L with a kernel whose hypothesis is provable, K(x) = exp(-x) (lattice minors have sign (-1)^(k(k-1)/2)): c = 2, 2.0506, 3: 100 of 100 node sets with the hypothesis sign at k = 3 and at k = 4; every minor of W non-negative; Cauchy-Binet sum equals the direct determinant to 1e-165 relative. c = 1.4142: W has a negative minor in 10 (k = 3) and 32 (k = 4) of 100 trials and 1 determinant of the wrong sign at k = 4. c = 0.5: 7 and 19 wrong signs. So the threshold c >= 2 has power in the test.
- Lemma L with theta (full series; Jacobi's identity used for arguments below 1 and checked against the direct sum, 3e-118): lane range (rows a in -2..2, abs(log y) <= 1.2, abs(log x0) <= 0.5), 100 node sets per order: zeta -, -, + at orders 3, 4, 5 (100 of 100 each); twins (2, 2.0506), (2, 2), (3, 2.0785): 100 of 100 agree at each order. Tempered twins: (2, 0.5): 5 and 58 of 100 opposite at orders 3 and 4; (2, 1.4142): 93 of 100 opposite at order 5. Wider range (a in -3..3, abs(log y) <= 2.5): same pattern for zeta and for c >= 2; tempered twins fail at orders 3, 4, 5 (2, 19, 37 of 100 for c = 0.5; 12 of 100 at order 5 for c = 1.4142). Ball arithmetic, precision raised until every determinant ball excludes 0 (2000 to 128000 bits); no undecided case.
  Referee's own error, recorded: the first pass (`items124.json`, rows "theta ...") truncated the theta series at 40 terms and showed mixed signs at order 4; that kernel is not theta at small arguments. The rows are kept in the file and are superseded by `item1b.json`.
- S2(d): order-2 dilation minors on 200 random node sets (abs(log) <= 1.6): theta 200 of 200 positive; theta_w of T-NR (3, 2.0785) 200 of 200 positive.
- Lemma E: int K3(u) e^((a + it)u) du = 2 xi(1/2 + a + it) at a = 0.3, t = 3.7 (defect 1.1e-20; K3 = (D^2 - 1/4)[e^(u/2) theta(e^(2u))]); product of the two transforms divided by 4 equals abs(xi(0.8 + 3.7i))^2 = 0.13091264136 (lane: 0.13091264136). Convolution kernel Phi_a on the grid 0, 0.05, ..., 1.6 for a = 0.3 and 0.45: positive, decreasing, largest second difference of the logarithm -10.23 and -10.24 (lane: -10.2).
  Referee's own error, recorded: the first pass of this check used a 30-term series at negative arguments and gave a wrong transform (0.288 + 0.769i); redone with the term count tied to the argument.
- X5 for T-NR: (log Phi_NR)'' = +29.36 at u = 0.405 (p0 = 2) and +157.19 at u = 0.575 (p0 = 3); for zeta at u = 0.405: -29.62. Reproduces the lane's +29.4 and +157.

## Remarks on use as a filter (question Q-P of round 14)

1. Lemma P is a sufficient condition for "T-NR passes". It never shows that T-NR fails. The lane says so; round-14 lanes should quote the X-type step, not the lemma, when they claim a failure.
2. The typing must be done in one normalisation (row 2 of the table). A device that uses the exact symmetry s <-> 1-s and integer frequencies in the same step is of type X4 and is not passed by the lemma.
3. c < 0 is outside the lemma (stated by the lane). The X_0(4) twin of round 12 has c < -2.
4. Not refereed here: the typing of the 37 device types (section 3) and the census table (section 4). The assignment covers Lemmas P, L, E.

## Labels to restrict

- Verdict item 3 and section 2.3 closing sentence ("exactly in the range where its zeros are off the line"): restrict to c > 0 and separate c = 2 (row 4 above).
- Census N2 and PREFILTER.md table row "T-NR, c >= 2, row nodes on one p0^2-lattice": "PROVED from the zeta row" should read "PROVED relative to the measured zeta row".
