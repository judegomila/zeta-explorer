# n1-maass-selberg-norm: is the K-loss the true size of the marked row norm?

Internal working note, 2026-11-17. Slug `n1-maass-selberg-norm`. Not refereed. Nothing committed, pushed or posted.
No ssh. Every run went through `scripts/memcap.sh 8`, single process, longest run 80 s.

Everything here concerns an ESTIMATE SYSTEM inside the 7/8 architecture (openai/math manuscript,
`~/lean-deps/qrh-verify/paper.txt`; Liu arXiv:2610.12234; both unrefereed). No statement about zeros is made.
The best possible outcome of this lane is a model abscissa 31/36 = 0.8611 > 5/6. It does not address the critical line.
RH open. NO QED.

Labels: PROVED (complete argument here) / PROVED-rel X / CLASSICAL / EXACT (rational LP) / MEASURED / ARGUED / OPEN.

**Verdict: precise obstruction for the proposed tool; partial result on the question.**
1. The Maass-Selberg / Parseval identity does not apply to the rows of the manuscript. The marking is not a witness
   condition, but the lane fails one step earlier: the rows are not the Fourier coefficients of one Eisenstein series
   (section 2). The n = 2 sanity test was therefore not run (section 3).
2. Pivot (one, as allowed): direct determination of the size of the norm. MEASURED on Z[omega] for Z up to 8000: the
   marked row norm equals its diagonal (ratio 0.76 to 1.05) where Lemma 14.3 allows a factor 10 to 178; the Gram
   matrix of the mark vectors has the spectrum of independent vectors. At these scales the K-loss is not the size of
   the norm (section 5). No proof of this is given, and section 5.4 states the lemma that would be needed.
3. EXACT: 31/36 confirmed. New: the price is not gradual. If a fraction th of the K-loss exponent remains, the model
   infimum stays at 13/15 for th >= about 1/18; only removal of at least about 94% of the exponent moves it (section 4).

---

## 1. Plan

Read: BRIEF (all notices), OBSTRUCTION_MAP rows Z10-Z15 and section 6 item 3, SYNTHESIS_R3 section 2.3,
r3-method-limit/RESULT.md (all), stack-combinator/TABLE.md row 53, manuscript sections 4.2, 5.1, 5.5, 14.1-14.4, 15.1.

Question (r3-method-limit section 5 item 2): the K-loss k_K = M + l - 1 in the reflected energy of the marked completed
row. True size of the norm, or artifact of the large sieve? Model price 13/15 -> 31/36.

Proposed tool: exact Parseval / Maass-Selberg identity for a truncated metaplectic Eisenstein series.
Decision step (no numerics): read how the rows and the marks are defined.

New relative to closed lanes: (a) identification of what the rows are as automorphic objects and why no single
Eisenstein series carries them; (b) elementary Lemma C; (c) the Gram formulation of K-loss removal; (d) the first
direct numerical measurement of the marked norm; (e) the threshold in the LP price.

---

## 2. Decision step: definition of rows and marks

### 2.1 What the marking is [PROVED-rel manuscript (14.1), (14.2), section 15.1]

The mark is not a witness condition. It sits on the column index, not on the row:

    d(A) = sum over tuples (p_i) in prod_i P_i of prod_i a_i(p_i) 1_{p_i | A},     A = n b^3 (whole completed index),

with P_i disjoint lists of primes of norm about Z^{z_i} and bounded coefficients (in section 15.1: a_i(p) = eta(p) W_i).
The marked row is T_d(X; k) = sum_{n sf, b} conj-alpha(n) gamma_2(n) Psi_k(n) (...) d(n b^3) V_*(q_n q_b^3 / X) / sqrt(q_n q_b),
X = Z^{1 + l'}. The row variable k enters only through the character Psi_k(n) = nu(n) rho(n) chi_n(k) chi_n(f)^4.
So the first branch of the assignment ("witness condition, stop") does not occur.

### 2.2 What the rows are [PROVED-rel manuscript Lemma 4.2, (4.7); identities checked numerically]

gamma_j(c) is the normalised Gauss sum of chi_c^j, chi_c the sextic residue symbol. gamma_2 is the cubic Gauss sum
(g^3 = -alpha(p) with alpha(c) = c/|c| verified to 2e-14 on all primes of norm <= 2.5e5; twisted multiplicativity
verified against brute force to 6e-15). With gt3(m, c) = gamma_2(c) chi_c(m)^{-2} the normalised cubic Gauss sum of
additive frequency m (Kubota's coefficient):

    gamma_2(c) chi_c(m) = gt3(m, c) * chi_c(m)^3,        chi_c(m)^3 = quadratic symbol.                     (R1)
    gamma_2(c) chi_c(m) = mu(c) alpha(c) G(c) * conj( gamma_1(c) conj-chi_c(m) ),   from (4.7).              (R2)

(R1): row m is the m-th Fourier coefficient series of the cubic metaplectic Eisenstein series, twisted in the
summation variable c by the quadratic character attached to the row m itself. (R2): row m is the Moebius-weighted
conjugate of the m-th coefficient series of the sextic Eisenstein series. Equivalent description used by the
manuscript: the Mellin transform of Patterson's cubic theta function twisted by the sextic Dirichlet character of
modulus m (Proposition 5.1).

### 2.3 Obstructions

**O1 [PROVED-rel 2.2]. The rows are not the Fourier coefficients of one automorphic function.** Parseval on a
horocycle, and Maass-Selberg, evaluate sum_mu |a_mu(s)|^2 W(mu y) for the coefficients a_mu of a single function. In
(R1) the function changes with the row (the quadratic twist has modulus m). In (R2) the row is a Moebius twist of a
coefficient, which is not a coefficient. The two coincide only where the quadratic symbol is trivial: rows m = a^2,
which are Z^{M/2} of the Z^M rows. On that subfamily Parseval controls all Z^M frequencies mu, of which Z^{M/2} are
rows; dropping the others by positivity gives Z^{M + eps} for Z^{M/2} rows, which is the trivial bound for them.
This is the design of the manuscript, not an accident: the quadratic twist is what removes the theta pole of the
Kubota series (control K in section 5.5 shows the pole when the twist is absent).

**O2 [PROVED-rel 2.1]. The marks are not a finite combination of congruence projections.** One mark 1_{p | c} is a
level-p condition (by twisted multiplicativity it is a twist by the cubic character of conductor p, the label
chi_n(f)^4 of section 14.1 with f = p). The marked row sums about Z^l / log Z such conditions with distinct levels;
their common level is the product of all slot primes. An identity at fixed level gives each x_p separately, i.e. the
diagonal of the Gram matrix of section 5.4, and nothing about the cross terms, which are the whole question.

**O3 [PROVED]. The identity is at the wrong object even where it applies.** It gives the complete series at Re s = 1/2.
That is not a defect: by Lemma B below a second moment of central values would imply the truncated bounds at every
length. It is recorded only because the converse fails: Lemma 5.8 through the approximate functional equation gives
central values only with exponent 4M/3 (worst dyadic length N' = 2M/3).

Conclusion of the decision step: the identity yields neither the marked nor the unmarked norm of the manuscript's row
family. The first lemma of the assignment, sum_m |D(s,m)|^2 W_Y(m,s) = scattering expression, is a true statement
about a different family (Kubota coefficients of fixed order with no row-dependent twist).

---

## 3. First test (n = 2): not run

The weight-1/2 test compares Parseval for the Gamma_0(4) Eisenstein series with sum_d |L(1/2+it, chi_d)|^2. It tests
the identity in the family where O1 does not arise (order 2: the row character and the Gauss-sum character are the
same quadratic character). A pass would not bear on O1 or O2. Not run; reported as not run.

---

## 4. LP: 31/36 confirmed, and the price is a threshold [EXACT; MODEL inputs]

`lp31.py` imports the refereed vertex-enumeration LP of `r3-method-limit/tiers.py` unchanged (Fractions).

| low side | infimum | point (lx, ly, l) |
|---|---|---|
| source (K, J, P) | 13/15 CONFIRMED | (2/5, 2/5, 1/5) |
| K-loss removed (marked row exponent M) | 31/36 CONFIRMED | (1/2, 1/2, 1/3) |
| K and J removed | 23/27 CONFIRMED | (4/9, 4/9, 1/3) |
| K and P removed | 5/6 CONFIRMED | (1, 1, 1) |

New. Scaled loss k_K = th (M + l - 1):

| th | 1 | 1/2 | 1/10 | 1/20 | 1/30 | 1/40 | 1/60 | 1/100 | 1/300 | 0 |
|---|---|---|---|---|---|---|---|---|---|---|
| infimum | 0.866667 | 0.866667 | 0.866667 | 0.866120 | 0.864469 | 0.863636 | 0.862799 | 0.862126 | 0.861450 | 0.861111 |

The infimum is 13/15 for th >= about 0.055 (linear extrapolation of the 1/30 and 1/20 rows: 1/18) and about
31/36 + 0.10 th below. Reason: the optimum for th = 0 sits at M + l - 1 = 1/3, where a residual loss th/6 is added
directly, and 13/15 - 31/36 = 1/180. A partial improvement of the reflected large sieve (for example replacing
(NL)^{2/3} in Lemma 14.2 by a smaller power) has no price in this model unless it removes about 94% of the exponent.

---

## 5. Pivot: direct determination of the size of the norm

Notation: rows m of norm <= Z^M (all nonzero elements, as in Lemma 5.8), b_A = gamma_2(c) alpha(A)^{+-1} nu(A) /
sqrt(q_A) times the smooth weight, C(X; m) = sum_A b_A chi_A(m) (unmarked, X = Z^N), B_m = sum_A d(A) b_A chi_A(m)
(marked, X = Z^{1+l}). Diagonal D = sum_A |b_A|^2 (times |d(A)|^2), of size Z^{eps}. "No K-loss" means
sum_m |B_m|^2 << Z^{M + eps}.

### 5.1 Lemma B [PROVED-rel Proposition 5.1 (T entire, polynomial growth)]
C_V(Z^N; m) = (1/2 pi) int V^(it) Z^{iNt} T(1/2 + it, chi(m)) dt for every N. Hence by Minkowski
sum_m |T(1/2 + it, m)|^2 << Z^{M + eps} (1 + |t|)^A implies sum_m |C_V(Z^N; m)|^2 << Z^{M + eps} for every N.
The unmarked K-type loss max(0, M - N) of Lemma 5.8 is the true size only if the second moment of central values of
the twisted theta family exceeds the number of rows.

### 5.2 Lemma C [PROVED; unrefereed]
For M >= 2N + eps: sum_{0 < q_m <= C Z^M} |C_V(Z^N; m, nu)|^2 << Z^M (log Z)^4. Lemma 5.8 gives Z^{2M - N} there.

Proof. Majorise the row ball by Phi(m / Z^{M/2}), Phi >= 1 on the ball, Fourier transform supported in a disc of
radius rho. m -> chi_A(m) conj chi_A'(m) is periodic modulo f = c n c' n', q_f <= X^{2 + eps} after discarding the
tail of V. Poisson summation over the lattice O: frequencies k with |k| > rho |f| Z^{-M/2} vanish, so for
q_f < Z^M / rho^2 only k = 0 remains, and it equals Z^M times the mean of the product over O/f, which is zero unless
the product is principal, and at most one otherwise. Principal means equal local exponents [p | c] + 3 v_p(n) modulo 6
at every prime: c = c' and v_p(n) = v_p(n') modulo 2 for every p, i.e. n = s a^2, n' = s b^2 with s squarefree. The
weights 1/sqrt(q_c q_n) of (5.30) give
sum_c sum_{s,a,b} 1/(q_c q_s q_a q_b) << (log Z)^4. QED

[CLASSICAL, sketch] In general the same computation gives Z^{max(M, 2N) + eps} (multiplicative large sieve), so the
unmarked exponent is min{max(M, 2M - N), max(M, 2N)}; the proved loss is at most M/3, at N = 2M/3.

### 5.3 Poisson dual of the unmarked norm [ARGUED; not used for any PROVED line]
For N < M < 2N the nonzero frequencies give, by (R2) and gamma_2 conj-alpha gamma_1 = mu G,
Z^M sum_{0 < q_k <= Z^{2N - M + eps}} |I_k|^2 with I_k = sum_A mu(A) G(A) conj-chi_A(k) V(q_A / Z^N) / q_A, a smoothed
value of 1/L(1 + w, psi_k) for a sextic Hecke character psi_k of modulus k (G is a fixed ray-class function), up to
the diagonal-in-A terms which are of lower order. If L(s, psi_k) has no zeros in Re s > sigma_0, |I_k| << Z^{-N(1 -
sigma_0) + eps}, and the unmarked norm is Z^{max(M, 2 N sigma_0) + eps}: no loss for N <= M / (2 sigma_0). With
sigma_0 = 7/8 (the manuscript's own theorem for this family) that is N <= 4M/7; with GRH for the family, every
N <= M. This is the same Moebius mechanism as the manuscript's signal side. For the marked norm the frequency range
is Z^{2 + 2l - M}; even GRH gives Z^{1 + l} there, no better than reflection for M <= 1. So this route does not reach
the K-loss window 1 - l < M <= 1.

### 5.4 What K-loss removal is [PROVED reformulation; the statement itself OPEN]
Twisted multiplicativity gamma_2(p c') = gamma_2(p) gamma_2(c') chi_p(c')^2 chi_{c'}(p)^2 gives B_m = sum_p a_p x_p(m),

    x_p(m) = gamma_2(p) chi_p(m) q_p^{-1/2} * C(X / q_p; m, label f = p),

a unimodular factor times a twisted theta sum of length about Z whose character has modulus m p (the label
chi_n(f)^4 of section 14.1). With G_{pp'} = sum_m x_p(m) conj x_{p'}(m): sum_m |B_m|^2 = a* G a. Hence

    no K-loss for all bounded a   <=>   lambda_max(G) << Z^{eps} max_p G_pp   (flat spectrum),          (L*)

an optimal large-sieve inequality for the vectors x_p. Lemma 14.3 proves lambda_max << Z^{M + l - 1} times that.
At M = 1 the proved bound Z^{1 + l} equals the Lindelof-on-average size Z of each sum_m |q_p^{1/2} x_p(m)|^2 with no
cancellation at all between different marks. (L*) is decorrelation of the central values of theta twisted by m p and by
m p' on average over m.

(L*) is not a statement for arbitrary coefficients. With gamma_2(c) chi_c(m)^4 in place of gamma_2(c) chi_c(m) (the
Kubota series without the quadratic twist, control K) the unmarked norm already exceeds the diagonal by the theta
pole: this is the Dunn-Radziwill sharpness of Heath-Brown's cubic sieve (RECALLED, as in r3-method-limit). A proof
of (L*) must use the quadratic twist, i.e. the absence of the pole, uniformly in the label.

### 5.5 Measurement [MEASURED]
`rownorm.py` (numpy, complex128). Z[omega]; rows: all primary m coprime to 2 with Z^M/4 < q_m <= Z^M; columns:
squarefree primary c coprime to 2 (cube completion omitted, n = b = 1); weight a fixed smooth bump on
[0.2 X, X]; one slot, primes of norm in [Z^l, 2 Z^l], a_p = 1 ("ones"), random signs, and the top eigenvector of
the Gram matrix ("worst"). R = mean_m |B_m|^2 / diagonal. Variants: A = gamma_2 chi, A' = gamma_2 conj-alpha chi
(the manuscript's D(s, Psi)), A+ = gamma_2 alpha chi, R = random unimodular coefficient in place of gamma_2.
Kfac = Z^{M + l - 1} is the factor Lemma 14.3 allows (it cannot exceed the number of marks).

| Z | M | l | rows | columns | marks | Kfac | A' R_ones | A' R_signs | A' R_worst | A R_worst | A+ R_worst | random R_worst | MP edge |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2000 | 1 | 1/3 | 454 | 6228 | 5 | 12.6 | 0.90 | 0.87 | 0.96 | 0.91 | 0.96 | 0.90 | 1.22 |
| 4000 | 1 | 1/3 | 904 | 15351 | 5 | 15.9 | 0.85 | 0.85 | 0.95 | 0.89 | 0.95 | 0.92 | 1.15 |
| 8000 | 1 | 1/3 | 1813 | 38108 | 5 | 20.0 | 0.92 | 0.90 | 0.92 | 0.88 | 0.91 | 0.92 | 1.11 |
| 2000 | 1.2 | 1/3 | 2076 | 6822 | 5 | 57.6 | 0.85 | 0.90 | 0.89 | 0.88 | 0.85 | 0.87 | 1.10 |
| 2000 | 0.8 | 1/2 | 98 | 20296 | 8 | 9.8 | 0.98 | 1.03 | 1.32 | 1.24 | 1.24 | 1.36 | 1.65 |
| 4000 | 0.8 | 1/2 | 172 | 57301 | 13 | 12.0 | 1.03 | 1.03 | 1.45 | 1.32 | 1.40 | 1.21 | 1.63 |
| 500 | 1 | 1/2 | 117 | 2676 | 7 | 22.4 | 0.85 | 0.84 | 1.37 | 1.12 | 1.06 | 1.21 | 1.55 |
| 1000 | 1 | 1/2 | 226 | 7405 | 6 | 31.6 | 1.00 | 0.99 | 1.10 | 0.97 | 1.00 | 1.07 | 1.35 |
| 2000 | 1 | 1/2 | 454 | 20713 | 8 | 44.7 | 0.95 | 0.94 | 1.01 | 1.07 | 1.16 | 1.06 | 1.28 |
| 4000 | 1 | 1/2 | 904 | 58119 | 13 | 63.2 | 0.88 | 0.94 | 1.01 | 1.13 | 1.08 | 1.02 | 1.25 |
| 1000 | 1 | 3/4 | 226 | 40393 | 31 | 177.8 | 0.96 | 0.93 | 1.48 | 1.37 | 1.44 | 1.54 | 1.88 |

MP edge = (1 + sqrt(marks/rows))^2, the top eigenvalue for independent vectors. (Full table with all variants:
`summary.txt`; raw: `rownorm_Z*.json`, `log_*.txt`; first-pass logs before the row filter: `v1/`.)

Readings.
- Marked norm = diagonal within sampling error in all 11 configurations and all three theta variants: R_ones and
  R_signs in [0.76, 1.04]; R_worst is below the independent-vector edge in every case (the largest normalised
  eigenvalue exceeds the edge once, 1.66 against 1.63); root-mean-square off-diagonal Gram entry 0.026 to 0.10,
  equal to 1/sqrt(rows) within a factor 1.6. The theta rows are
  indistinguishable from the random-coefficient control. The factor allowed by Lemma 14.3 (10 to 178, or the mark
  count 5 to 31) is absent.
- Unmarked short sums: at N = 3M/4 the ratio is 0.92 to 1.29 where Lemma 5.8 allows 4.6 to 9.8; at N = M/2 it is
  0.86 to 1.17 where Lemma 5.8 allows 21 to 96 (this case is Lemma C).
- Sensitivity control K (cubic character, no quadratic twist): excess 2.7 to 4.9 at N = M and 7 to 75 at N = 1 + l,
  growing with Z (9.9, 16, 25, 42 for Z = 500, 1000, 2000, 4000 at l = 1/2). The experiment detects a coherent
  term of the pole type at these scales.
- Variant B (conjugate character) at N = 1 + l shows an excess 1.1 to 5 on all rows and none on squarefree rows
  (0.80 to 1.10): it sits on non-squarefree rows, consistent with rows m = a^2, where the quadratic twist is trivial
  and the row is a Kubota coefficient with a theta residue (ARGUED, rows not inspected individually). Variant A has
  isolated large non-squarefree rows (all-row ratio up to 1.47, squarefree-row ratio 0.87 to 1.15); A' and A+ have
  none. These belong to the frozen powerful row parts of Lemma 5.8 (the Z^{O/2} factor), not to the K-loss.

Conclusion of the pivot: at the scales reached, the K-loss is a property of the proof (reflection followed by the
quadratic and cubic large sieves applied to an operator norm), not of the norm. Asymptotic status: OPEN.

---

## 6. Controls

- Type of statement. A norm bound is a mean-value input (stack-combinator/TABLE.md row 53: holds for arbitrary
  coefficients, Euler-blind). It is admissible only inside the 7/8 architecture, on its low side. With the K-loss
  removed the model abscissa is 31/36, a half-plane above 5/6; with every listed loss removed, 5/6 (Z15).
- Davenport-Heilbronn. Nothing here must fail for DH, because no statement about zeros is made. DH rows are not
  coefficients of a metaplectic Eisenstein series and are not twisted theta sums; the low side of the 7/8 method
  has no DH analogue to test. The step of the base method that uses the Euler product is on the signal side
  (Moebius coefficients of the row u = 1), untouched here.
- Backward heat, sign twist: not applicable (no positivity or zero statement).
- Random-coefficient control (variant R) passes exactly as the theta rows do: the measured statement is of the
  generic type. Control K fails it: (L*) is false for Gauss-sum coefficients without the quadratic twist, so (L*)
  is a statement about the specific coefficients, although it is consumed as a mean value.
- No step assumes RH or GRH in a PROVED line; section 5.3 states its conditional hypotheses and is ARGUED.

## 7. Three weakest steps

1. **Scale and model of the measurement.** Z <= 8000, 5 to 31 marks, one slot, sharp squarefree columns with the
   cube completion omitted, and the manuscript's cusp sectors, finite-ray characters and compensation (rescaled
   subset J) not modelled. A loss with a small constant, or one carried by the completion or by several slots,
   would not be seen. The exponent claim is asymptotic; the data are a fixed-scale ratio that does not grow.
2. **O1 excludes one identification, not all.** It is shown that the rows are not coefficients of the cubic or the
   sextic Eisenstein series of Kubota type. An automorphic function on a higher-rank cover whose Whittaker
   coefficients are the twisted theta values L(s, theta x psi_m) (a double Dirichlet series in (m, c) in the sense
   of Friedberg-Hoffstein-Lieman; RECALLED, not read) is not excluded; its Parseval identity would give the
   unmarked central second moment, which by Lemma B and section 4 is still not the marked statement (L*).
3. **Section 5.3 is not a proof.** The Poisson dual drops the diagonal-in-A terms, treats the weight as separable and
   uses the bound for 1/L uniformly in the conductor. Lemma C is the only new PROVED estimate, and it lies outside
   the K-loss window of the marked row. The LP threshold (section 4) is exact for the reduced model system of
   r3-method-limit, whose inputs are MODEL.

## 8. Verdict

Precise obstruction for the Maass-Selberg route: the row index enters the manuscript's rows both as the additive
frequency of the cubic Gauss sum and as the modulus of a quadratic twist, so no single Eisenstein series has these
rows as Fourier coefficients, and the marks have unbounded common level. Partial result on the question: Lemma C
(PROVED) shows the Lemma 5.8 exponent is not the size of the unmarked norm for M >= 2N; the marked norm is MEASURED
equal to its diagonal up to Z = 8000; K-loss removal is equivalent to the flat-spectrum statement (L*), which is
OPEN and must use the quadratic twist. Price if (L*) were proved: 13/15 -> 31/36 in the model, and only if at least
about 94% of the exponent is removed. No abscissa below 0.874886647 is proved. 7/8 (unrefereed) stands. RH open.

Files: `rownorm.py`, `run_batch.sh`, `batch.log`, `log_*.txt`, `rownorm_Z*.json`, `summary.txt`, `lp31.py`, `lp31.log`, `v1/`.
