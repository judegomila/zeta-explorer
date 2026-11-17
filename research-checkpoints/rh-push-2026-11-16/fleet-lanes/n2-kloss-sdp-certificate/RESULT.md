# n2-kloss-sdp-certificate: SDP value and dual certificate of the mark Gram matrix

Internal working note, 2026-11-17. Slug `n2-kloss-sdp-certificate`. Not refereed. Nothing committed, pushed or posted.
No ssh. Every run went through `scripts/memcap.sh 8`, single process; the whole batch (35 Gram builds and SDP solves)
took 6 min; largest planned allocation 2.1 GB (printed before allocation; the Z = 32000, l = 1 case was planned at
4.17 GB and was not run).

Scope: an ESTIMATE SYSTEM inside the 7/8 architecture (openai/math manuscript, Liu arXiv:2610.12234; both
unrefereed). No statement about zeros is made. Ceiling if the conjecture of section 6 were proved: model floor
31/36 = 0.8611, not 1/2. RH open. NO QED.

Labels: PROVED / CLASSICAL / MEASURED / ARGUED / OPEN.

**Verdict: partial result.** The first test does not kill the idea and does not prove anything about exponents.
1. MEASURED (35 configurations, Z = 1000 to 32000, 4 to 1575 marks): SDP(G)/tr G is flat in Z. Fitted exponent
   -0.02 to -0.04 (standard error 0.006 to 0.018) for every tested (M, l) with marks <= rows, where the K-loss
   exponent M + l - 1 is 0.33 to 1.0. The value equals that of the random-coefficient control and is at most
   1.05 times the independent-vector value (1 + sqrt(n/R))^2. The pole control (Kubota row without the
   quadratic twist) grows with exponent 0.17 to 0.94 in the same runs.
2. The dual solution is a weighted large-sieve inequality for each tested matrix, verified by the smallest
   eigenvalue of D - G (floating point, relative gap <= 7e-9). D_p is proportional to G_pp to within 3% to 26%,
   decays like N(p)^-0.8 to N(p)^-1.0, and shows no dependence on the residue class of p.
3. The inequality suggested by D is stated as Conjecture WLS (section 6). Its proof was attempted and not
   obtained; the obstruction is stated (section 7). 13/15 remains the proved-relative model value for this low
   side; 31/36 is conditional on WLS at the single point (M, l) = (1, 1/3) of the model.
4. PROVED, small: conjugation symmetry G[pbar, qbar] = conj G[p, q] (section 5.4); the Gershgorin reduction of
   K-loss removal to pair bounds for l <= M/2 (section 6.2).

---

## 1. Plan

Read: BRIEF (all notices), OBSTRUCTION_MAP rows Z9, Z10, Z15 and section 6 items 3 and 6,
`n1-maass-selberg-norm/RESULT.md` and `REFEREE.md` (E1), `rownorm.py`, `lp31.py`.

Question (referee E1 of n1): K-loss removal is sup_{|a_p| <= 1} a*Ga << Z^eps tr G for the mark Gram G, not a
flat spectrum. The supremum is NP-hard in general, but for PSD G it is within the factor 4/pi of a semidefinite
program whose dual is a diagonal majorant D >= G, that is, a weighted large-sieve inequality valid for all a.
So the exponent of SDP(G)/tr G is the K-loss exponent of the norm, and it can be measured with a certificate.

New relative to n1: (a) the correct functional (infinity-to-one norm through its SDP), with two-sided
certified values instead of sampled a; (b) mark counts up to 1575 instead of 5 to 31 (the Gram is built from
the marked columns only, c = p c'); (c) the dual weights; (d) a positive control inside the same functional;
(e) the regime marks > rows.

## 2. First lemma: duality [CLASSICAL], and the definition of G

**Lemma 1.** Let G be Hermitian PSD, n x n. Put mu(G) = max{a*Ga : |a_p| <= 1},
P(G) = max{tr(GX) : X >= 0, X_pp <= 1}, Dl(G) = min{tr D : D real diagonal, D - G >= 0}. Then

    tr G  <=  mu(G)  <=  P(G) = Dl(G)  <=  (4/pi) mu(G),          mu(G) <= n lambda_max(G) <= n tr G,

and for every feasible D and every a in C^n:  a*Ga <= sum_p D_p |a_p|^2.

Proof. tr G <= mu: average a*Ga over independent uniform phases. mu <= P: X = aa*. P <= Dl: for feasible X, D,
tr(GX) <= tr(DX) = sum D_p X_pp <= tr D, using D_p >= G_pp >= 0. P = Dl: both problems are strictly feasible
(X = I/2; D = (lambda_max + 1) I), so strong duality holds with attainment (Slater). Dl <= (4/pi) mu: complex
Gaussian rounding, a = phase(Vg) with X = VV*: E[a_p conj a_q] = F(X_pq), F(z) = (pi/4) z + sum_{k>=1} c_k z|z|^{2k},
c_k > 0, so E[aa*] - (pi/4) X >= 0 by the Schur product theorem and E a*Ga >= (pi/4) tr(GX). (Ben-Tal, Nemirovski,
Roos, SIAM J. Optim. 13 (2003); So, Zhang, Ye, Math. Program. 110 (2007); real case pi/2: Nesterov 1998. RECALLED,
not re-read.) Last claim: a*(D - G)a >= 0. QED

Consequence. The exponents of mu(G)/tr G and of SDP(G)/tr G = P(G)/tr G are equal. The allowed range is
1 <= SDP(G)/tr G <= min(n, C Z^{M+l-1+eps}) (Lemma 14.3 of the manuscript for the upper bound, relative).

**Definition of G (identical to n1, `rownorm.py`, variant A').** Z[omega]; rows: primary m coprime to 2 with
Z^M/4 < q_m <= Z^M (R rows); columns: squarefree primary c coprime to 2 (cube completion omitted, n = b = 1);
b_c = gamma_2(c) conj-alpha(c) q_c^{-1/2} W(q_c/X), X = Z^{1+l}, W the lane's bump on [0.2, 1]; marks: primes p
with Z^l <= N(p) <= 2 Z^l;

    x_p(m) = sum_{c : p | c} b_c chi_c(m)   (chi_c the sextic symbol; 0 if (m, c) != 1),     G = (x_p . conj x_p').

sum_m |sum_p a_p x_p(m)|^2 = a*Ga. `gram.py` builds x_p from c = p c' with twisted multiplicativity
(gamma_2(pc') = gamma_2(p) gamma_2(c') chi_p(c')^2 chi_c'(p)^2), which is the lane's own column rule.
Check [MEASURED]: at Z = 1000, M = 1, l = 1/2 the lane-normalised Gram reproduces the stored n1 values to all
printed digits (diag_mean 0.965366, off_rms 0.078724, eig [0.750793, 1.241320]).
Controls: K = gamma_2(c) chi_c(m)^4 (Kubota row, theta pole present); R = independent random unimodular
coefficient per column.

## 3. Method [CLASSICAL algorithm; floating point]

`sdp.py`. Primal: X = VV*, rows of V unit vectors in C^k, k = ceil(sqrt n) + 3; monotone generalised power
iteration V <- rownormalise(GV - diag(G)V/2). Dual candidate D_p = Re (GVV*)_pp. delta = max(0, -lambda_min(D - G))
from a dense Hermitian eigensolver; D + delta I is feasible, so

    tr(GVV*)  <=  SDP(G)  <=  tr D + n delta.

Relative gap between the two sides: at most 7e-9 in all 105 solves. This is a float64 computation, not interval
arithmetic; the matrices have condition and size for which the eigenvalue error (about 1e-13 relative) is far
below the stated gap, but no rigorous enclosure was made. Lower bound for mu(G): rank-one rounding of V and
phase iteration (40 starts). SDP/mu_lower is between 1.000 and 1.125 (allowed: 4/pi = 1.273).

## 4. First test: results [MEASURED]

Full tables: `analysis.txt` (Tables 1 to 4), `extras.txt`. Variant A' (manuscript row); R and K in the last columns.
MP = (1 + sqrt(n/R))^2, the value n lambda_max / tr of n independent vectors in R dimensions.

| M | l | Z | marks n | rows R | SDP/tr A' | mu lower/tr | MP | Kfac Z^(M+l-1) | SDP/tr random | SDP/tr K |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 1/3 | 1000 | 4 | 226 | 1.147 | 1.147 | 1.284 | 10 | 1.134 | 1.95 |
| 1 | 1/3 | 8000 | 5 | 1813 | 1.146 | 1.146 | 1.108 | 20 | 1.062 | 2.74 |
| 1 | 1/3 | 32000 | 6 | 7249 | 1.075 | 1.075 | 1.058 | 32 | 1.036 | 3.55 |
| 1 | 1/2 | 1000 | 6 | 226 | 1.266 | 1.266 | 1.352 | 32 | 1.201 | 2.24 |
| 1 | 1/2 | 8000 | 17 | 1813 | 1.210 | 1.210 | 1.203 | 89 | 1.153 | 6.87 |
| 1 | 1/2 | 32000 | 31 | 7249 | 1.141 | 1.141 | 1.135 | 179 | 1.117 | 13.26 |
| 1 | 3/4 | 1000 | 31 | 226 | 1.664 | 1.650 | 1.878 | 178 | 1.688 | 6.57 |
| 1 | 3/4 | 8000 | 115 | 1813 | 1.504 | 1.476 | 1.567 | 846 | 1.495 | 24.66 |
| 1 | 3/4 | 32000 | 284 | 7249 | 1.399 | 1.367 | 1.435 | 2393 | 1.404 | 62.10 |
| 1 | 1 | 1000 | 137 | 226 | 2.812 | 2.704 | 3.163 | 1000 | 2.840 | 17.41 |
| 1 | 1 | 4000 | 451 | 904 | 2.746 | 2.597 | 2.912 | 4000 | 2.724 | 54.10 |
| 1 | 1 | 16000 | 1575 | 3625 | 2.664 | 2.481 | 2.753 | 16000 | 2.661 | 188.6 |
| 3/4 | 3/4 | 1000 | 31 | 41 | 2.925 | 2.925 | 3.495 | 32 | 2.823 | 9.41 |
| 3/4 | 3/4 | 32000 | 284 | 544 | 2.803 | 2.675 | 2.967 | 179 | 2.722 | 114.3 |
| 0.6 | 0.9 | 1000 | 72 | 14 | 7.918 | 7.425 | 10.68 | 32 | 8.387 | 17.77 |
| 0.6 | 0.9 | 32000 | 1165 | 117 | 16.03 | 14.25 | 17.27 | 179 | 15.81 | 490.4 |

Fitted exponent e in SDP/tr ~ Z^e (least squares on log-log over the 5 or 6 values of Z, +- one standard error):

| M | l | K-loss exponent | A' | random control | pole control K | exponent of MP | exponent of n |
|---|---|---|---|---|---|---|---|
| 1 | 1/3 | 0.333 | -0.028 +- 0.018 | -0.025 +- 0.004 | +0.166 +- 0.020 | -0.056 | 0.11 |
| 1 | 1/2 | 0.500 | -0.023 +- 0.006 | -0.025 +- 0.007 | +0.539 +- 0.033 | -0.049 | 0.49 |
| 1 | 3/4 | 0.750 | -0.043 +- 0.006 | -0.047 +- 0.006 | +0.666 +- 0.016 | -0.074 | 0.66 |
| 1 | 1 | 1.000 | -0.022 +- 0.009 | -0.022 +- 0.003 | +0.870 +- 0.018 | -0.049 | 0.88 |
| 3/4 | 3/4 | 0.500 | -0.018 +- 0.010 | -0.007 +- 0.011 | +0.736 +- 0.014 | -0.043 | 0.66 |
| 0.6 | 0.9 | 0.500 | +0.197 +- 0.016 | +0.179 +- 0.012 | +0.940 +- 0.020 | +0.140 | 0.80 |

Readings.
- For marks <= rows (l <= M) the ratio is bounded and slowly decreasing, as (1 + sqrt(n/R))^2 does. The K-loss
  exponent is excluded at these scales by 20 to 110 standard errors. The lemma's allowed range (up to 10 to 16000)
  is not used; the measured range is 1.07 to 3.07, against n1's sampled 0.6 to 1.9 for single vectors a.
- A' is not distinguishable from the random control in the SDP value (ratio A'/MP in [0.74, 1.05], random/MP in
  [0.79, 0.99]), nor in the moments tr(Gn^k)/n, k = 2, 3, 4, 6, of the unit-diagonal Gram, which agree with the
  Marchenko-Pastur moments to about 1% (`extras.txt`; for example Z = 16000, l = 1: m6 = 21.85 against 21.61).
- For marks > rows (M = 0.6, l = 0.9) the ratio grows, at the rate of n/R (rank of G is at most R), exponent
  0.20 against the K-loss exponent 0.50. The true size has the shape rows + marks, not rows alone.
- The pole control K grows in every configuration, with SDP/tr close to n lambda_max/tr and to the value at
  a = (1, ..., 1): one coherent direction. The functional detects K-loss-type growth when it is present.
- Off-diagonal entries of the normalised Gram: root mean square 1.00 R^-1/2 (n >= 31), maximum 2.2 to 4.2 R^-1/2,
  equal to the Gaussian extreme sqrt(log #pairs) to within 30%. No exceptional pair was found, with one exact
  exception class: conjugate pairs (p, pbar), root mean square 1.28 to 1.65 where there are at least 15 such pairs, about 1.4 on average (Lemma 2).

## 5. The dual weights [MEASURED, except 5.4]

5.1 D_p against G_pp. u_p = D_p / G_pp has mean equal to SDP/tr within 2% and coefficient of variation 0.03
(l = 1/2), 0.04 to 0.11 (l = 3/4), 0.09 to 0.26 (l = M), 0.18 to 0.26 (marks > rows). Correlation of D_p with
G_pp: 0.98 to 0.99 at l = 1/2, 0.72 to 0.90 at l = M.

5.2 Dependence on N(p). log D_p = c - s log N(p): s = 0.89 to 1.08 at l = 1/2, 0.78 to 0.92 at l = 3/4,
0.70 to 0.81 at l = M = 1 (standard error 0.01 to 0.05 for n >= 191), while G_pp has s = 1.00 +- 0.01 (it equals
0.94 R sum_{c: p|c} |b_c|^2, a smooth function of N(p)). The optimal dual puts relatively more weight on the
larger primes of the slot when n/R is not small.

5.3 Residue class. Fraction of the variance of log u_p explained by the class of p modulo 2, modulo 9, and of
N(p) modulo 4 and modulo 7, compared with the chance expectation (classes - 1)/(n - 1): within a factor 3 of it
for n >= 191 (largest F-ratio 2.9, at n = 1165 modulo 9, among about 80 tests; 0.006 against 0.005 at n = 1575);
larger fractions occur only for n <= 45 and are not stable across Z. No residue-class term is supported.

5.4 Closed form. The fit is D_p = kappa G_pp, equivalently

    D_p = t R sum_{c : p | c} |b_c|^2 = t R C_W(p) / N(p),      C_W(p) = sum_{c' coprime to p} W(N(p) q_c'/X)^2 / q_c',

with t the largest eigenvalue of the lane-normalised Gram. This closed-form D is feasible by construction and its
trace exceeds the optimal dual by 0.1% to 11% for marks <= rows and up to 16% for marks > rows (`extras.txt`,
column cfdual/tr against SDP/tr). The largest eigenvalue of the unit-diagonal Gram (column diagdual/tr) is at most
1.06 (1 + sqrt(n/R))^2 for A' in all configurations with n >= 13.

**Lemma 2 [PROVED]. G[pbar, qbar] = conj G[p, q]** for variants A' and K.
Proof. gamma_2(cbar) = conj gamma_2(c): chi_cbar(x) = conj chi_c(xbar) and Tr(x/cbar) = Tr(xbar/c), so
g(cbar) = conj(chi3_c(-1) g(c)) = conj g(c). alpha(cbar) = conj alpha(c), q and W are conjugation invariant, hence
b_cbar = conj b_c and x_pbar(mbar) = conj x_p(m). The row set is closed under conjugation. QED
Check: max |G[pbar,qbar] - conj G[p,q]| / max |G| = 2e-16 to 9e-15 for A' and K in all runs; 0.02 to 0.55 for the
random control (which has no such symmetry).
Consequence [ARGUED]: G[p, pbar] = sum_m x_p(m) x_p(mbar) is a symmetric pairing in which the rows m and mbar give
the same term, so its variance is twice that of a generic entry: predicted ratio sqrt 2 = 1.414, measured about 1.4
(1.42 at n = 1575, 785 pairs). A bounded factor on n/2 of the n^2 entries; no effect on exponents.

## 6. Decision: flat ratio. The inequality suggested by D

### 6.1 Conjecture WLS (weighted large sieve for the marked theta vectors) [OPEN; supported by section 4]
For the rows and columns of the manuscript (variant A'), every eps > 0, every slot of primes of norm about Z^l
and all complex a_p:

    sum_{q_m <= Z^M} | sum_p a_p x_p(m) |^2  <=  C_eps Z^eps (Z^M + Z^l) sum_p |a_p|^2 sum_{c : p | c} |b_c|^2.

For l <= M this is the flat-spectrum statement (L*) of n1 with the explicit weights; it implies K-loss removal
(sum over |a_p| <= 1) and is stronger than what the manuscript needs. Measured in place of C_eps Z^eps (Z^M + Z^l):
at most 1.06 R (1 + sqrt(n/R))^2 <= 2.12 (R + n), for n >= 13 (section 5.4). WLS is false for variant K
(section 4), so it is a statement about the quadratic twist, not about bounded coefficients.

Multiplicative inputs that enter, in order:
1. Twisted multiplicativity of gamma_2: without it the mark 1_{p | c} does not factor and x_p is not a single
   twisted theta sum. With it, x_p(m) = gamma_2(p) conj-alpha(p) N(p)^-1/2 chi_p(m) S(m p^4; X/N(p)),
   S(u; Y) = sum_{c'} b'_c' chi_c'(u) W(q_c'/Y)  [PROVED-rel n1 5.4 and REFEREE E1; used by `gram.py`, which
   reproduces the lane's G].
2. Cubic reciprocity for the pair (p, c'): it turns chi_p(c')^2 chi_c'(p)^2 into chi_c'(p)^4, so that the mark
   enters S only through the index u = m p^4. Then
       G[p, p'] = unit(p, p') (N(p) N(p'))^-1/2 sum_m chi_p(m) conj chi_p'(m) S(m p^4) conj S(m p'^4).
3. The quadratic twist chi_c'(u)^3 that separates A' from K: it removes the theta residue of S. For K the residue
   term is a common direction of all x_p and gives the growth in section 4.
4. Conjugation symmetry (Lemma 2), which fixes the only exceptional pair class found.

### 6.2 Reduction for l <= M/2 [PROVED]
D_p = sum_p' |G[p, p']| is feasible (diagonal dominance), so SDP(G) <= sum_{p,p'} |G[p,p']|. Hence the pair bound

    PAIR(l):   |G[p, p']| <= C_eps Z^{eps - l} sqrt(G[p,p] G[p',p'])     for p != p'

implies sup_{|a_p| <= 1} a*Ga <= (1 + C_eps Z^eps) tr G, since there are at most Z^l marks. Measured pair size is
R^-1/2 = Z^{-M/2} (with maximum over pairs larger by sqrt(log)), so PAIR(l) holds numerically with room exactly
when l < M/2, and fails as a route for l > M/2: there sum |G[p,p']| / tr G grows (exponents +0.12, +0.36, +0.25,
+0.49 in Table 2 of `analysis.txt` for (M, l) = (1, 3/4), (1, 1), (3/4, 3/4), (0.6, 0.9)) while SDP/tr does not, so
the signs of the entries must be used. At the model optimum (M, l) = (1, 1/3) of the 31/36 system, PAIR(1/3) asks
for a saving Z^-1/3 per pair where square-root cancellation would give Z^-1/2. A lower term of exactly this size is
present and harmless: columns divisible by both p and p' contribute relative size Z^-l to G[p, p'] (it is part of
the diagonal sum_c |b_c|^2 |d(c)|^2 of the lemma).

### 6.3 Moment route and its price [EXACT for the model, using REFEREE n1; inputs OPEN]
lambda_max(G) <= (tr G^k)^{1/k}. If the k-th moment were proved flat (tr G^k << Z^eps n g^k, the Marchenko-Pastur
size measured in section 4 for k <= 6), the residual loss would be n^{1/k} = Z^{l/k}, a fraction th = 1/k of the
K-loss exponent at (M, l) = (1, 1/3). By the threshold th* = 1/18 of n1 (confirmed by its referee), moments of
order k < 18 do not move the model infimum from 13/15, and order k >= 18 gives about 31/36 + 1/(10k). The second
moment (k = 2, a fourth moment of the theta sums over rows) has no price in the model.

## 7. Proof attempt for WLS: not obtained. Obstruction [ARGUED]

Open the square: a*Ga = sum_m |sum_c beta_c chi_c(m)|^2, beta_c = b_c d_a(c), d_a(c) = sum_{p | c} a_p; about
X = Z^{1+l} columns against Z^M rows, with M < 1 + l always.
- Zero frequency after Poisson summation in m (modulus cc'): the principal pairs c = c' give R sum_c |beta_c|^2,
  the diagonal of the lemma. [as in Lemma C of n1]
- Nonzero frequencies: dual length N(k) <= X^2 / Z^M = Z^{2+2l-M}. The complete sums factor by sextic reciprocity
  into u_c(k) conj u_c'(k), so the off-diagonal part is
      (Z^M / X) [ sum_k Phi^(k) |sum_c beta_c u_c(k)|^2  -  (terms c = c') ],
  a difference of two quantities each of size X^2/Z^M times sum |beta_c|^2. Flatness is the statement that this
  difference is smaller than either term by the factor Z^M/X = Z^{-(1+l-M)}: an asymptotic formula for the dual
  mean square with a power-saving error, not an upper bound.
- Any bound that takes absolute values in k gives at best Z^{1+l} sum |beta|^2. This includes pointwise bounds for
  the inner sums (by gamma_2 conj-alpha gamma_1 = mu G of the manuscript (4.7) they are smoothed values of
  1/L(1 + w, psi_k) for sextic Hecke characters; n1 section 5.3), so GRH for that family used pointwise does not
  give WLS for M < 1 + l. The reflection step of Lemma 14.3 shortens the columns before the large sieve and its
  loss Z^{M+l-1} is of the same kind (reflected columns against rows).
- The random-coefficient control satisfies WLS because its columns are independent, and K violates it through one
  coherent direction. A proof has to show that the theta coefficients gamma_2(c) conj-alpha(c) with the quadratic
  twist have no coherent direction of size Z^delta in the n-dimensional marked subspace, for every delta > 0.
  The available information about gamma_2 beyond its modulus is twisted multiplicativity and the automorphy of the
  generating series (functional equation, pole or no pole). The first is used in 6.1; the second gives the residue
  (first-order term) and the reflected length, and no statement about n^2 pair correlations at saving Z^-l.
- For l <= M/2 the missing statement is PAIR(l): a bound with saving Z^-l for
  sum_m chi_p conj-chi_p'(m) S(m p^4) conj S(m p'^4), a twisted second moment of theta sums at the two indices
  m p^4 and m p'^4 over Z^M rows. For p = p' it is the diagonal. No method known to this note gives a power
  saving for p != p' when the row sum (length Z^M) is shorter than the modulus of the pair (at least Z^{2l} from
  p p' alone, Z^{2+2l} with the columns).

Status: WLS and PAIR(l) OPEN. Nothing in this note changes a proved or proved-relative exponent.

## 8. Controls

- Type of statement. WLS is a mean-value (norm) statement consumed on the low side of the 7/8 estimate system
  (stack-combinator/TABLE.md row 53 type). By the MV-CAP wall it cannot certify an every-window statement, and it
  is not asked to. Model value if proved: 31/36 > 5/6 (Z15); it does not approach 1/2.
- Davenport-Heilbronn, backward heat, sign twist: no zero statement and no positivity statement is made, so there
  is nothing to run them against (as in n1 and its referee). The Euler-product step of the 7/8 method is on the
  signal side (Moebius coefficients), untouched here.
- Random-coefficient control: passes exactly as A' does. The measurement therefore does not show that the theta
  coefficients are special; it shows they are not coherent at these scales. Pole control K: fails, in every
  configuration, with growth exponent 0.17 to 0.94. So the functional is sensitive and WLS is coefficient-specific.
- Solver control: primal-dual gap <= 7e-9 relative in all 105 solves; SDP <= n lambda_max in all cases;
  SDP/mu_lower <= 1.125 < 4/pi; G rebuilt independently of `rownorm.py` agrees with it at the test point.
- No RH or GRH in any PROVED line. Verified height is not used.

## 9. Three weakest steps

1. **Scale and model.** Z <= 32000 (rows of norm <= 32000, columns of norm <= 2.6e8 at l = 1), one slot, sharp
   squarefree columns, no cube completion, no cusp sectors or ray characters, slot [Z^l, 2Z^l]. A loss with a small
   constant, or one carried by the completion, by several slots, or by the compensation step of the manuscript,
   would not be seen. At the model point l = 1/3 the mark count is 4 to 6, so that row of the fit has almost no
   lever arm; the evidence for flatness comes from l >= 1/2. The exponent statement is asymptotic; the data are
   fixed-scale ratios over a factor 32 in Z.
2. **The certificate is floating point and finite.** "Certified" means lambda_min(D - G) from a float64
   eigensolver with gap 1e-9, for the stored matrices. It is not an interval enclosure and it certifies nothing
   about any Z not computed. The fitted closed form for D_p is a fit; only its feasibility with the measured t is
   checked.
3. **Section 7 is not a theorem.** The Poisson step is written for a smooth majorant and coprime c, c', drops the
   non-coprime pairs, and uses the manuscript's (4.7) through n1 without re-derivation. The claim that absolute
   values in the dual lose Z^{1+l-M} is a size count, not a proved lower bound for all methods. The moment-route
   price in 6.3 is exact only for the reduced model system of r3-method-limit.

## 10. Verdict

Partial result. The functional that equals K-loss removal (the infinity-to-one norm of the mark Gram, through its
SDP) was computed with primal-dual certificates for 35 configurations: flat for marks <= rows, equal to the
independent-vector value, with the pole control growing. The K-loss is therefore not the size of the norm at
these scales [MEASURED]; the size has the shape rows + marks. The dual gives the weights of Conjecture WLS, which
is OPEN; its proof was attempted and stops at a signed dual sum that needs a power-saving asymptotic, or, for
l <= M/2, at the pair bound PAIR(l). 13/15 stays the low-side model value; 31/36 is conditional on WLS at
(M, l) = (1, 1/3). No abscissa below 0.874886647 is proved. 7/8 (unrefereed) stands. RH open.

Files: `gram.py`, `sdp.py`, `analyse.py`, `extras.py`, `run_batch.sh`, `batch.log`, `analysis.txt`, `extras.txt`,
`log_gram_*.txt`, `log_sdp_*.txt`, `sdp_Z*.json` (values, D_p, G_pp, primes), `gram_Z*.npz` (Gram matrices under
5 MB; the larger ones were deleted and are rebuilt by `gram.py Z M l` in under 2 minutes each).
