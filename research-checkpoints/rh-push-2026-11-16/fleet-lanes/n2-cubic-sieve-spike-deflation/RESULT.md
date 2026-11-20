# n2-cubic-sieve-spike-deflation: is the (KD)^{2/3} term of the cubic large sieve a bounded-rank spike?

Internal working note, 2026-11-17. Slug `n2-cubic-sieve-spike-deflation`. Not refereed. Nothing committed, pushed or posted.
No ssh. Every run went through `scripts/memcap.sh 8`, single process; longest run 59 s. One run (K = D = 24000) was
killed by the cap during the SVD and was reduced to K = D = 18000, not rerun with a higher cap.

Scope: an estimate inside the zero-free machinery (low side of the 7/8 architecture; model ceiling 31/36). No statement
about zeros is made. RH open. NO QED.

Labels: PROVED / CLASSICAL (read in the source for this note) / MEASURED / ARGUED / MODEL / OPEN.

**Verdict: precise obstruction. The bounded-rank deflation lemma is false at the scales reached and, conditionally on
GRH, false by a formula already in the literature.**

1. The top singular pair is the Gauss-sum spike, as proposed: v_1 = conj g(d) N(d)^{-1/6} with overlap 0.90 to 0.97,
   s_1^2 = 0.19 to 0.23 (KD)^{2/3} (MEASURED, K = D from 500 to 18000).
2. It is not alone and the family is not bounded. The singular values below it decay like j^{-0.23}; s_J^2 for every
   fixed J in {2, 5, 10, 20, 40} grows like K^{1.21 to 1.23} against K^{1.00} for the bulk edge; the number of
   singular values above a fixed multiple of the bulk edge grows like K^{0.94 to 1.24} (MEASURED). The spikes are the
   Gauss vector twisted by cubic characters of small conductor r, with strength proportional to N(r)^{-1/3}.
3. Dunn-Radziwill (arXiv:2109.07463, re-read; section 2 below) state this themselves: beta_b = g(b) "is far from the
   only obstruction", and their formula (1.13) gives the remainder after the rank-one correction as a sum over
   non-cube h up to B^2/A of cubic character sums. Grouped by cube classes this is a family of about B^2/A spikes of
   strength (AB)^{2/3} N(h_0)^{-1/3} (ARGUED from (1.13); matches item 2).
4. Rows carrying the pole-killing quadratic twist are orthogonal to the spikes at the level of random vectors: energy
   in the top-40 singular space 0.97 to 1.03 times the random baseline and Rayleigh quotient 1.03 to 1.05 times the
   bulk level at K = D (0.81 to 1.02 and 0.81 to 1.06 over all 15 shapes; MEASURED). This repeats the n1 finding with a different observable and proves nothing.
5. Critical class of Z12: a deflation that removes the spikes of conductor up to U^{rho} gives the model exponent
   1 - delta (1 + rho)/2. Bounded rank (rho = 0): 0.765328, no change. Below 0.590332 needs rho >= 0.7457, i.e. a
   removed rank of about U^{0.75}; rho = 1 gives 0.530655 (MODEL). Removing that many spikes for specific coefficients
   is a mean-value statement for correlations of the coefficients with twisted cubic Gauss sums: the Type II problem
   of rows Z5/Z6.

---

## 1. Plan

Read: BRIEF (all notices); OBSTRUCTION_MAP rows Z1, Z5, Z6, Z11, Z12, Z15; n1-maass-selberg-norm/RESULT.md;
r2-zf-critical-density/RESULT.md sections 2.1 to 2.3 (source of 0.7653 and 0.5903); Dunn-Radziwill section 1.4,
Theorem 1.4, (1.13), proof of Theorem 1.4 in section 9 (text extracted from the arXiv PDF for this note).

Object: C[c, d] = (c/d)_3 for squarefree primary c, d in Z[omega], N(c) <= K, N(d) <= D, zero when gcd(c, d) != 1.
Heath-Brown: ||C||^2 << (KD)^eps (K + D + (KD)^{2/3}).

Lemma under test (assignment): C = sum_{j <= J} s_j u_j v_j^* + R with J bounded independently of K, D, the u_j, v_j
normalised cubic Gauss sums times smooth weights, and ||R||^2 << (K + D)^{1 + eps}.

New relative to the closed lanes: the first full singular value decomposition of the cubic-symbol matrix (n1 measured
Rayleigh-type ratios of marked rows, not the spectrum); the identification of the spike family; the reading of
Dunn-Radziwill (1.13) as a spike decomposition with rank B^2/A; the pricing of partial deflation at the critical class.

Decision rule fixed before the run: one or boundedly many spikes with a flat remainder -> state and price the deflated
sieve; slowly decaying tail -> the bounded-rank form is false, record the rank growth.

---

## 2. Literature statement [CLASSICAL, read for this note]

Dunn and Radziwill, "Bias in cubic Gauss sums: Patterson's conjecture", arXiv:2109.07463.

- (1.11), Heath-Brown [HB00, Theorem 2]: for beta supported on squarefree b,
  sum_{N(a) <= A, a = 1 mod 3} mu^2(a) | sum_{N(b) <= B, b = 1 mod 3} beta_b (b/a)_3 |^2
  << (AB)^eps (A + B + (AB)^{2/3}) sum |beta_b|^2.
- Theorem 1.4. Assume GRH for Hecke L-functions over Q(omega). With B(A, B) the operator norm of the dyadic form
  (A < N(a) <= 2A, B < N(b) <= 2B): (AB)^{2/3} << B(A, B) << (AB)^{2/3 + eps} for A in [sqrt B, B^2] outside
  [B^{1 - eps}, B^{1 + 2 eps}], and (AB)^{2/3 - 3 eps} << B(A, B) << (AB)^{2/3 + eps} inside. Remark 1.1: only the
  lower bounds use GRH.
- Extremal vector (proof of Theorem 1.4, (9.3)): beta_b = g~(b) W(N(b)/B), g~ the normalised cubic Gauss sum, W smooth
  with support in (1, 2). Then sum_b g~(b) W (b/a)_3 = sum_b W g~(ab) up to a unimodular factor, and Voronoi
  summation plus GRH give the lower bound A (B^{5/6} / A^{1/6})^2 = A^{2/3} B^{5/3} for A << (AB)^{1/2 - xi}.
- Text after Remark 1.1: "This is far from the only obstruction. Any sequence of the form beta_b g~(b) with beta_b
  non-negative and not correlated with cubic symbols would provide a counterexample."
- (1.13) (precise versions: Propositions 9.1, 9.2; beta bounded, supported on squarefree w-rough b, N(b) of size B;
  GRH; a small fixed delta > 0): with the rank-one correction
  P(a) = ((2 pi)^{2/3} / (3 Gamma(2/3))) g~(a) N(a)^{-1/6} sum_{(b,a)=1} beta_b N(b)^{-1/6},

      sum_a mu^2(a) V(N(a)/A) | sum_b beta_b g~(b) (b/a)_3 - P(a) |^2
        ~ (A/B) sum_{0 < |h| <= B^2/A, h not a cube} | sum_b beta_b (b/h)_3 |^2 + O((AB)^{2/3} B / w + (AB)^{2/3 - delta} B).

  The authors add: "in order to beat the cubic large sieve, the correction term alone is not enough; we really need to
  know additional information about the sequence beta_b."

Correction to the wording of the assignment and of OBSTRUCTION_MAP Z12 / r2-zf-critical-density 2.3 ("reported
sharp"): the sharpness is conditional on GRH (Theorem 1.4), and the rank-one correction with its constant is in the
source.

### 2.1 Reading of (1.13) as a spike decomposition [ARGUED]

In the coordinates beta (coefficient vector c_b = g~(b) beta_b) the right side of (1.13) is the quadratic form
(A/B) sum_h chi_h chi_h^*, chi_h(b) = conj (b/h)_3. Characters with h in one cube class h_0 k^3 (h_0 cube-free) agree
on b coprime to k, and the class has about (B^2 / (A N(h_0)))^{1/3} members below B^2/A. With ||chi_h||^2 about B:

    remainder ~ sum over cube-free h_0 != 1, N(h_0) <= B^2/A of  theta(h_0) * (projection on g~ chi_{h_0}),
    theta(h_0) ~ (A/B) * B * (B^2/(A N(h_0)))^{1/3} = (AB)^{2/3} N(h_0)^{-1/3}.

So, on GRH and for rough coefficients: one spike of strength (AB)^{2/3} (the correction), then a family indexed by
cubic characters of conductor h_0 with strengths (AB)^{2/3} N(h_0)^{-1/3}, about B^2/A of them, and
#{spikes of strength > T} ~ (AB)^2 / T^3 for T >= A + B. At T of size A + B that is (AB)^2/(A + B)^3, equal to a
constant times K for K = D. The bounded-rank lemma contradicts this. This step is a reading of an asymptotic
formula whose error term O((AB)^{2/3} B / w) is of the size of the spikes when w is bounded; it is used here only
as a prediction to compare with section 3.

---

## 3. First test [MEASURED]

`cubsvd.py K D` (numpy complex128, full `numpy.linalg.svd`). Rows and columns: all squarefree primary elements
(a = 1, b = 0 mod 3; the prime 2 included) of norm <= K, <= D, sharp cutoff. Cubic symbols from x^{(N-1)/3} modulo each
prime; (c/d)_3 by multiplicativity in d. Checks inside every run: C = C^T exactly on the common block (cubic
reciprocity for primary elements; maximum deviation 0.0); prime Gauss sums have modulus 1 to 7e-15; composite Gauss
sums by g(ab) = (a/b)_3 (b/a)_3 g(a) g(b). The matrix size is printed before allocation.

"edge" = (sqrt(rows) + sqrt(cols))^2 x density of nonzero entries: the top squared singular value of a matrix of
independent unimodular entries of the same shape. Frobenius/cols = mean squared singular value per column direction
("bulk level").

### 3.1 Sizes and top of the spectrum

| K | D | rows | cols | s_1^2 | s_1^2/(KD)^{2/3} | s_2^2 | s_2^2/(K+D) | s_2^2/edge | edge | #(s^2 > edge) | > 1.1 edge | > 1.25 edge | > 1.5 edge |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 500 | 500 | 177 | 177 | 911 | 0.230 | 637 | 0.637 | 0.99 | 644 | 1 | 1 | 1 | 0 |
| 1000 | 1000 | 355 | 355 | 2161 | 0.216 | 1398 | 0.699 | 1.09 | 1282 | 4 | 1 | 1 | 1 |
| 2000 | 2000 | 711 | 711 | 5270 | 0.209 | 3249 | 0.812 | 1.26 | 2576 | 9 | 5 | 2 | 1 |
| 3000 | 3000 | 1058 | 1058 | 8906 | 0.206 | 5118 | 0.853 | 1.33 | 3838 | 12 | 8 | 4 | 1 |
| 6000 | 6000 | 2118 | 2118 | 21631 | 0.198 | 12210 | 1.018 | 1.59 | 7691 | 23 | 15 | 10 | 4 |
| 12000 | 12000 | 4239 | 4239 | 52664 | 0.192 | 28860 | 1.202 | 1.88 | 15384 | 47 | 28 | 16 | 8 |
| 18000 | 18000 | 6340 | 6340 | 88508 | 0.188 | 47891 | 1.330 | 2.08 | 23018 | 69 | 44 | 23 | 12 |
| 55 | 3000 | 20 | 1058 | 1115 | 0.371 | 1089 | 0.356 | 0.90 | 1215 | 0 | 0 | 0 | 0 |
| 141 | 20000 | 52 | 7062 | 7663 | 0.384 | 7281 | 0.361 | 0.97 | 7520 | 1 | 0 | 0 | 0 |
| 200 | 40000 | 72 | 14110 | 15128 | 0.378 | 14615 | 0.364 | 1.00 | 14659 | 1 | 0 | 0 | 0 |
| 300 | 30000 | 105 | 10570 | 13594 | 0.314 | 11298 | 0.373 | 0.98 | 11585 | 1 | 1 | 0 | 0 |
| 1000 | 30000 | 355 | 10570 | 22873 | 0.237 | 15539 | 0.501 | 1.16 | 13395 | 7 | 3 | 1 | 1 |
| 3000 | 12000 | 1058 | 4239 | 21802 | 0.200 | 13075 | 0.872 | 1.51 | 8647 | 19 | 12 | 7 | 2 |
| 6000 | 24000 | 2118 | 8463 | 53004 | 0.193 | 30941 | 1.031 | 1.79 | 17288 | 37 | 21 | 13 | 7 |

K = D^2 is the transpose of K = D^{1/2} (C is symmetric); (3000, 55) was run and has the singular values of (55, 3000).

### 3.2 (a) Exponents

Balanced K = D, least squares over all seven sizes / over K >= 2000 (finite-size exponents; evidence only):

| quantity | exponent in K | reference |
|---|---|---|
| s_1^2 | 1.280 / 1.283 | 4/3 for (KD)^{2/3} |
| Rayleigh excess of the explicit vector w_1 = conj g N^{-1/6} over the bulk level | 1.349 / 1.339 | 4/3 |
| s_2^2 | 1.209 / 1.231 | 1 for K + D |
| s_5^2, s_10^2, s_20^2, s_40^2 | 1.223, 1.228, 1.224, 1.272 / 1.231, 1.226, 1.208, 1.213 | 1 for K + D |
| edge | 0.999 | 1 |

- s_1^2 against (KD)^{2/3}: ratio 0.230 falling to 0.188. The fall is the additive bulk contribution: with the
  outlier map for a rank-one perturbation, s^2 = (theta + a)(theta + b)/theta (a, b = Frobenius/cols, /rows; MODEL
  step), the recovered strength theta_1/(KD)^{2/3} is 0.136, 0.145, 0.154, 0.158, 0.161, 0.163, 0.162 (`bbp.txt`).
- Over the 14 shapes with K <= D: Rayleigh excess of w_1 = 0.150 K^{0.669} D^{0.674}; the ratio excess/(KD)^{2/3} lies
  in [0.157, 0.166] for all 14, including K = D^{1/2}, where the spike is below the edge and invisible in s_1.
- Constant predicted from the correction term of (1.13): ((2 pi)^{2/3}/(3 Gamma(2/3)))^2 (3 rho/2)^2 = 0.196 with
  rho = 0.352 the density of squarefree primary elements. Measured 0.162 to 0.166. The 16% gap is not resolved
  (coprimality condition, sharp cutoff and the additive-character normalisation were not matched to the source).
- s_2^2 against K + D: the ratio rises from 0.64 to 1.33 and the fitted exponent is 1.21 to 1.23, not 1. The second
  singular value is not at the flat level.

### 3.3 (b) Overlaps of the top singular pair

| K = D | abs<v_1, conj g> | abs<v_1, conj g N^{-1/6}> | abs<v_1, conj g N^{-1/3}> | abs<v_1, g N^{-1/6}> | log-log slope of abs(v_1)^2 in N |
|---|---|---|---|---|---|
| 500 | 0.9007 | 0.8996 | 0.8302 | 0.011 | -0.280 |
| 3000 | 0.9395 | 0.9468 | 0.8793 | 0.013 | -0.286 |
| 12000 | 0.9514 | 0.9649 | 0.9020 | 0.001 | -0.317 |
| 18000 | 0.9547 | 0.9692 | 0.9072 | 0.003 | -0.318 |

u_1 = conj v_1 up to a phase (symmetry), so u_1 has the same overlaps with g. The amplitude profile abs(v_1(d))^2
proportional to N(d)^{-0.32} is the theta-coefficient weight N^{-1/6} (for squarefree c the cubic theta coefficient is
a normalised conjugate Gauss sum of modulus N(c)^{-1/6}; this is the weight in the correction term of (1.13)). So the
"Gauss-sum vector" and the "theta-coefficient vector" of the assignment are the same vector on squarefree indices,
overlap 0.97 at the largest size and rising. Unbalanced shapes: 0.92 to 0.94 for D = 4K, 0.78 for (1000, 30000),
0.14 to 0.49 for K <= D^{0.55}, where s_1 is not separated from the bulk.

### 3.4 (c) Number of large singular values and the tail

- Threshold of the assignment, singular value 2 sqrt(K + D): none at any size, including s_1 (s_1^2 = 0.19 K^{4/3}
  passes 8K only for K above about 7e4). The thresholds used instead are multiples of the edge (table 3.1).
- Counts above theta x edge, balanced sizes 500 to 18000: theta = 1.0: 1, 4, 9, 12, 23, 47, 69; 1.1: 1, 1, 5, 8, 15,
  28, 44; 1.25: 1, 1, 2, 4, 10, 16, 23; 1.5: 0, 1, 1, 1, 4, 8, 12. Fitted growth over K >= 2000: K^{0.94}, K^{0.97},
  K^{1.08}, K^{1.24}. Prediction of 2.1: K^1.
- Decay at fixed size: s_j^2 proportional to j^{-0.22} to j^{-0.24} over j in [2, 40] and [5, 100] for K = D >= 2000;
  s_2^2/s_1^2 = 0.54, s_10^2/s_1^2 = 0.42, s_40^2/s_1^2 = 0.29 at K = D = 18000. No gap after the first value other
  than the factor 0.54.
- Strengths recovered by the outlier map (MODEL step) decay like j^{-0.50} over the outliers; j theta_j^3/(KD)^2 at
  j = 5, 10 is 0.00137, 0.00129 at K = D = 12000 and 0.00134, 0.00141 at 18000: independent of the size, as the
  counting law #{theta > T} = c (KD)^2/T^3 of 2.1 requires. At j = 20, 40 the inversion is close to the edge and
  the values are not stable (0.00070, 0.00032 against 0.00085, 0.00057).
- Unbalanced shapes at equal KD: (6000, 24000) has 37, 21, 13, 7 against 47, 28, 16, 8 for (12000, 12000); the law
  (KD)^2/T^3 with T proportional to the edge predicts the factor 0.70.

### 3.5 Identification of the further spikes

Candidates w_{r,a,b,+-}(d) = conj g(d) N(d)^{-1/6} ((omega^a lambda^b r / d)_3)^{+-1}, r among the first 60 rows.
- Top right singular vectors (K = D = 3000): v_1 = w_1 (0.947); v_2, v_3, v_4 are mixtures of the lambda- and
  omega-twists of w_1 (best single overlaps 0.57 to 0.62); v_5 = twist by r = -2 (0.853); v_6 to v_13 have best
  overlaps 0.39 to 0.52 with twists by the primes of norm 7, 13, 19, 25, 31, 37. Singular values of nearby strength
  mix the candidates, so single overlaps are below 1.
- Rayleigh excess of w_r over the bulk level, relative to r = 1, K = D = 18000 (N(r)^{-1/3} in brackets): N = 4:
  0.416 [0.630]; 7: 0.393 [0.523]; 13: 0.345 [0.425]; 19: 0.314 [0.375]; 31: 0.272 [0.318]; 61: 0.220 [0.254];
  79: 0.199 [0.233]; composite 28: 0.156 [0.329]; 49: 0.142 [0.273]; 52: 0.135 [0.268]. Prime r: N(r)^{-1/3} times a
  local factor 0.66 (N = 4) rising to 0.86; composite r: the product of the local factors of its primes within 8%.
  The local factor is not derived.
- Only one sign of the twist carries the excess (frequency r c squarefree; the other sign is frequency r^2 c, where
  the theta coefficient vanishes).
- Explicit deflation, K = D = 18000: removing the nine unit twists of w_1 (dimension 9) leaves top s^2 = 43288
  (optimal rank 9: 37408); removing all twists with N(r) <= 13 (dimension 54): 37561 (optimal 24289); N(r) <= 61
  (dimension 198): 30039 (optimal 18305); edge 23018. At K = D = 3000 removing the twists with N(r) <= 250
  (dimension 810 of 1058) leaves 1888. The norm decreases slowly with the removed conductor and no bounded
  dimension reaches the edge.

### 3.6 Outcome of the first test

One spike with the proposed vectors: yes. Bounded rank with flat remainder: no. The tail is a slowly decaying
family of twisted Gauss-sum spikes whose number above the flat level grows like a power of K with measured exponent
0.94 to 1.24 at K = D (model value 1; in general (KD)^2/(K + D)^3). By the decision rule the lemma is recorded as
false and the bounded-rank deflated sieve is not stated.

---

## 4. Pivot (one): deflation of growing rank, and the quadratic-twist rows

### 4.1 Exact form [PROVED, trivial]
For every vector a: ||C a||^2 = sum_j s_j^2 abs<a, v_j>^2. Hence ||C a||^2 <= T ||a||^2 + sum_{j: s_j^2 > T} s_j^2 abs<a, v_j>^2
for every T. A deflated sieve at level T = (K + D)^{1 + eps} holds for exactly those a whose weighted energy in the
spike space is below T ||a||^2.

### 4.2 What the condition is for specific coefficients [ARGUED from 2.1 and section 3]
With spikes g~ chi_{h_0}, strengths (KD)^{2/3} N(h_0)^{-1/3}, the condition is, for every R up to the spike range,

    sum_{N(h_0) <= R} abs( sum_d a_d g~(d) chi_{h_0}(d) )^2  <<  (R/K)^{1/3} D ||a||^2      (K = D),

a saving R^{1/3} K^{-1/3} over Bessel in the mean square of the correlations of a with twisted cubic Gauss sums.
At R = 1: abs(sum_d a_d g~(d)) << D^{1/2 - 1/6} ||a||. For a = indicator of primes this is the size X^{5/6}/log X of
the Patterson bias itself (Dunn-Radziwill, GRH): the prime indicator sits at the threshold of the first spike, with
no room. For general R the left side is a Type II sum of the coefficients against g~(h_0 d): the object of rows
Z5/Z6 (bilinear sums of Gauss sums with arbitrary coefficients; allowed ranges only N(a), N(b) in [Q^{0.4}, Q]).
Nothing in this lane bounds it.

### 4.3 Rows with the pole-killing quadratic twist [MEASURED]
x_m(d) = w_m(d) (m/d)_2 on d coprime to 2, m = rows 2 to 200 (N(m) <= 556): the vector of n1 (R1), row m of the
manuscript family in this model. "cubic only" is w_m restricted to odd d.

| K = D | bulk level | Rayleigh, cubic only | Rayleigh, quadratic twist (mean; max) | energy in top-40 singular space: twisted / random baseline | top s^2 of C on the span of the 199 twisted rows / edge of that shape | same, cubic only |
|---|---|---|---|---|---|---|
| 3000 | 959 | 1.57x | 1.043x; 1.125x | 0.0384 / 0.0378 | 1.25 | 2.14 |
| 6000 | 1923 | 1.83x | 1.039x; 1.092x | 0.0191 / 0.0189 | 1.16 | 3.06 |
| 12000 | 3846 | 2.16x | 1.038x; 1.088x | 0.0094 / 0.0094 | 1.11 | 4.24 |
| 18000 | 5755 | 2.39x | 1.038x; 1.079x | 0.0061 / 0.0063 | 1.11 | 4.98 |

Unbalanced shapes: Rayleigh of twisted rows 0.81x to 1.03x of the bulk level against 3.1x to 19.4x for cubic only;
span ratio 0.68 to 1.05 against 4.8 to 21.4 (`summary.txt`).
- Overlap exponent: the squared overlap of a twisted row with each of the 40 top singular vectors is 1/cols within
  3% at every balanced size, i.e. D^{-1.00}: the value for a random vector. No excess and no deficit.
- The operator C restricted to the span of 199 twisted rows has top s^2 within 5 to 11% of the independent-entry
  edge at K = D >= 12000 (1.42 at K = D = 500, where 199 vectors exceed the 177 dimensions), while the span of the
  same rows without the quadratic twist exceeds it by a factor that grows (2.1, 3.1, 4.2, 5.0).
- Reason in the formula [ARGUED]: for beta = a combination of characters with a non-trivial quadratic part the
  correction term of (1.13) vanishes, and the right side becomes sums over b of sextic characters of conductor
  about N(m h), h up to B^2/A. Bounding those on average over m and h is a large-sieve statement for sextic symbols
  again (after Poisson: sextic Gauss sums; the TRO6 family). The measured flatness is the same statement as n1 (L*)
  and has the same status: OPEN.

### 4.4 Price at the critical class of Z12 [MODEL]
Lane formula (r2-zf-critical-density 2.3): family U, detecting polynomial of length U^Y, delta = 0.469345,
count >= max(1, Y, 2(1 + Y)/3) - delta Y, minimum 1 - delta/2 = 0.765328 at Y = 1/2; needed: below R_c = 0.590332.
If the spikes of conductor up to U^{rho} are removed for the coefficients in question, the third entry becomes
2(1 + Y)/3 - rho/3, the minimum moves to Y = (1 + rho)/2 and equals

    1 - delta (1 + rho)/2:   rho = 0: 0.765328;  1/4: 0.706660;  1/2: 0.647991;  0.7457: 0.590332;  1: 0.530655.

- Bounded rank (any fixed J): rho = 0, exponent 0.7653 unchanged. The lemma of the assignment, even if it were
  true in the form "J spikes removed", would not move the critical class unless the remainder were flat.
- Break-even rho = 2(1 - R_c)/delta - 1 = 0.74570. This equals the saddle abscissa r* = 0.7457 of row Z11 to the
  four digits given there; whether that is an identity of the two formulas was not checked.
- rho = 1 (all spikes; perfect sieve): 0.530655, the MODEL row of r2-zf-critical-density 2.2, "input false for
  general coefficients".
- The family at the critical class is sextic (twists chi_u, u sixth-power-free), not cubic. The transfer of the
  spike law to the sextic sieve is assumed, not measured. The source's own count already avoids the 2/3 term by
  structure (M1, M2), so the deflated sieve is not an input the source lacks; what it lacks is listed in Z11.

---

## 5. Controls

- Type of statement: an operator-norm (mean-value) bound, Euler-blind, admissible only on the low side of the 7/8
  architecture (stack-combinator/TABLE.md row 53; MV-CAP). No zero statement, so Davenport-Heilbronn, backward heat
  and the sign twist are not engaged. Best outcome of the whole line: model abscissa 31/36 (n1 section 4), above 5/6.
- Random control: the edge of an independent-entry matrix of the same shape is the reference in every table. The
  quadratic-twisted rows match it; the cubic-twisted Gauss vectors exceed it by factors that grow with the size.
- Sensitivity: the experiment detects the spike where the literature puts it (vector, weight N^{-1/6}, exponent
  4/3 +- 0.01 for the Rayleigh excess, constant within 16%).
- Symmetry control: C = C^T exactly; (3000, 55) reproduces the singular values of (55, 3000).
- Memory: planned sizes printed; the 4x estimate of the SVD peak was too low (K = D = 24000, 1.15 GB matrix, killed
  at 8 GB); the estimate in the script is now 7x and the size was reduced.

## 6. Three weakest steps

1. **Scale.** K, D <= 24000 with sharp cutoffs; the bulk edge is taken from the independent-entry model, and the
   counts just above the edge depend on that reference (the exponent ranges 0.94 to 1.24 reflect this). The
   statement "s_J^2 grows faster than K + D for fixed J" rests on exponents 1.21 to 1.23 over a factor 36 in K.
2. **Section 2.1 is a reading, not a theorem.** (1.13) is quoted from the introduction of the source; it holds on
   GRH for bounded w-rough coefficients with an error term that is as large as the spikes when w is bounded. The
   matrix measured here has no roughness condition. The local factors 0.66 to 0.86 per prime of the twist and the
   16% gap in the leading constant are unexplained. The outlier inversion in 3.2 and 3.4 uses a formula for
   independent noise.
3. **Section 4.4 transfers a cubic measurement to a sextic count** and inserts a hypothetical partial deflation
   into a lane formula built for arbitrary coefficients. The numbers are prices of hypotheses. The flatness in 4.3
   is measured on 199 rows of small norm and one smooth weight, without the cube completion or the marks of the
   manuscript; it adds no proof to n1 (L*).

## 7. Verdict

Precise obstruction. C = (c/d)_3 has the proposed top spike (Gauss-sum vector with theta weight, strength
0.16 (KD)^{2/3}), but the remainder after removing it, or any bounded number of spikes, is not flat: the spectrum has
a power-law family of spikes indexed by cubic twists, about (KD)^2/(K + D)^3 of them above the flat level
(MEASURED exponents 0.94 to 1.24 at K = D; on GRH this is the content of Dunn-Radziwill (1.13), whose authors state
that the correction term alone is not enough). A deflated sieve therefore holds only for coefficients with a
mean-square saving in their correlations with twisted cubic Gauss sums over conductors up to a power of the family
size; at the critical class of Z12 the break-even is conductor U^{0.7457}. That condition is the Type II Gauss-sum
problem of Z5/Z6. Rows with the quadratic twist are measured orthogonal to the spikes at the random level, which
restates n1 (L*) and is OPEN. Nothing proved beyond the trivial identity 4.1. No abscissa moves. 7/8 (unrefereed)
stands. RH open.

Files: `cubsvd.py`, `run.sh`, `summary.py`, `summary.txt`, `bbp.py`, `bbp.txt`, `log_K*_D*.txt`, `svd_K*_D*.json`,
`svd_K*_D*.npz` (singular values, top 40 singular vectors, Gauss sums).
