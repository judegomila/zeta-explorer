# c9-tro6-interstratum-cancellation: cancellation between squarefull strata of the signed c-sum of TRO6

2026-11-18/19. Internal working note. Nothing committed or pushed. Not refereed.

**Verdict: precise obstruction (second obstruction of the same kind for lead 17). The decisive test finds no
inter-stratum saving at X = 1e6 or X = 1e7: fitted exponents of the ratio are -0.005 and +0.001 against a
pre-registered threshold of -0.02, and equal the random-sign and random-phase controls within their scatter.
Lemma I (exact, checked) shows why: the strata are signed sums of sublattice sums of the same form, so cancellation
between strata is not a mechanism separate from a saving on the total. TRO6-natural(eta) is not proved or measured
for any eta > 0. 7/8 and 0.874886647 are unchanged; both rest on unrefereed manuscripts. No statement about zeros.
Frontier-number lane (metric part B): the headline is not affected. NO QED.**

Labels: PROVED / EXACT (finite identity checked) / MEASURED / ARGUED / OPEN.

## 1. Plan; what is new against the map and against e2

Read: BRIEF (to the end), OBSTRUCTION_MAP rows Z1 to Z8, T1, open direction 4, controls section (THIN row),
STRATEGY sections 3 and 3.1 (lead 17: "tried, not closed; one more lane, and it must attack the stated
obstruction"), `e2-tro6-signed-csum-stratified/RESULT.md` in full with its code.

The obstruction left by e2 is one sentence at the end of its section 2: "Strata could in principle cancel against
each other; no tool addresses that and it is not claimed either way." e2 measured the l2 share of each stratum
(squarefree 94%) and compared each stratum with random rows; it never formed the signed sum over strata against
the sum of their sizes. This lane does only that:

1. Lemma I: the exact signed form of each stratum and the bilinear form of the inter-stratum sum (section 2).
2. Decisive test at two table sizes with pre-registered criterion and controls (sections 3, 4).
3. One pivot (allowed once): the same test for the stratification by number of prime factors (section 5).

Not repeated: per-stratum comparison with random rows, the nu-optimiser, the dual-term regression (all e2); per
modulus bounds (Z7); arbitrary-coefficient bilinear forms (Z6); large sieves (Z5).

Pre-registration (written before the first run; the second clause was added before the first run because the
assigned form of the criterion has a control that is not at exponent 0, see 2.3):

* Primary ratio r2 = sqrt(sum_f |B^f|^2 / sum_f sum_kappa |B_kappa^f|^2). Random signs on strata give expectation 1
  for the square, so the control exponent is 0. Saving present iff the fitted exponent of r2 in Q is below -0.02 at
  both table sizes.
* Assigned ratio r1 = sum_f |B^f| / sum_f sum_kappa |B_kappa^f| (inter-stratum sum against the sum of within-stratum
  absolute values). Its random-sign control decays because the number of strata grows like Q^(1/2); the criterion
  is applied to (exponent of r1) - (exponent of its control), threshold -0.02 at both sizes.

## 2. First lemma: signed strata and the inter-stratum bilinear form

Notation of e2 section 2. Rows m in O = Z[omega], primary, prime to 6, N(m) <= Q; c squarefree, primary, prime to 6;
B = sum_m r(m), r(m) = W(N(m)/Q) rho(m) B_m, B_m = sum_c beta_c chi_c(m). Each m is uniquely m = m1 kappa with m1
squarefree, kappa squarefull, (m1, kappa) = 1; the stratum of kappa is the set of such m, and B_kappa is the sum of
r(m) over it (e2 Lemma S: B_kappa = sum_c beta_c xi_kappa(c) T_kappa(c)). For any j put

  Phi(j) = sum_{m : j | m} r(m)      (sublattice sum; Phi(1) = B).

**Lemma I [PROVED; EXACT check `lemma_check.py`].** For every squarefull kappa, with d running over squarefree
primary elements prime to 6 and e over divisors of rad(kappa),

  B_kappa = sum_d sum_{e | rad kappa} mu(d) mu(e) Phi(kappa · lcm(d^2, e)).

In particular B_1 = sum_d mu(d) Phi(d^2), and for a prime p: B_{p^2} = sum_{(d,p)=1} mu(d) [Phi(p^2 d^2) - Phi(p^3 d^2)].
Every index j = kappa lcm(d^2, e) is squarefull. In sum_kappa B_kappa the net coefficient of Phi(j) is 1 for j = 1
and 0 otherwise.

*Proof.* m lies in the stratum of kappa iff kappa | m and x = m/kappa is squarefree and prime to kappa.
1[x squarefree] = sum_{d^2 | x} mu(d) and 1[(x, kappa) = 1] = sum_{e | (x, rad kappa)} mu(e); d^2 | x and e | x iff
lcm(d^2, e) | x. Sum r(m) over m. The last sentence is sum_kappa B_kappa = B = Phi(1) and uniqueness of the
expansion (the Phi(j) are free linear forms in the r(m)). ∎

EXACT (`lemma_check.log`): 2,166 rows (N(m) <= 7172), random integer r(m), all 31 strata, 109 terms: 0 mismatches;
net coefficient of Phi(j) in the sum over strata is 1 at j = 1 and 0 at every other j that divides a row.

**Sign of the leading term of each stratum.** The leading term of B_kappa is +Phi(kappa). The same form Phi(kappa)
enters other strata with these signs:

| form | in B_1 | in B_{p^2} | in B_{p^3} | in B_{p^2 q^2} |
|---|---|---|---|---|
| Phi(p^2) | -1 (d = p) | +1 (leading) | 0 | 0 |
| Phi(p^3) | 0 | -1 (e = p) | +1 (leading) | 0 |
| Phi(p^2 q^2) | +1 (d = pq) | -1 (d = q) | 0 | +1 (leading) |

So the leading term of every stratum with kappa = d^2, d squarefree, appears in the squarefree stratum with sign
mu(d), and the leading term of B_{p^(k+1)} appears in B_{p^k} with sign -1. This is the only exact sign structure
between strata: it is inclusion-exclusion over divisibility, valid for any row values r(m). It contains no
information about rho, beta or the symbol.

**Inter-stratum bilinear form [PROVED, algebra].** With e2 Lemma S,

  |B|^2 = D + I,   D = sum_kappa |B_kappa|^2,
  I = sum_{kappa != kappa'} sum_{c, c'} beta_c conj(beta_c') xi_kappa(c) conj(xi_kappa'(c')) T_kappa(c) conj(T_kappa'(c')).

Pairs of strata that share the sixth-power-free kernel (kappa' = kappa t^6) are the only pairs for which
chi_c(m) conj chi_c(m') is the trivial symbol for rows m, m' of the two strata with the same m1; with the
periodicity rho(m t^6) = N(t)^(-1/2)-type scaling of theta coefficients their diagonal contribution to I is
non-negative. They need N(t)^6 <= Q, so t = 1 only for Q < 117,649: not present in any run below.
[ARGUED; the periodicity is CITED (Kazhdan-Patterson), not checked here.]

**Proposition E (no cancellation between strata without an anomaly of the sublattice sums) [PROVED].**
Let c(j) = #{(kappa, d, e) with kappa lcm(d^2, e) = j} (c(j) <= 4^omega(j), c(j) = 0 unless j is squarefull). Then

  sum_kappa |B_kappa| <= sum_{j squarefull} c(j) |Phi(j)|.

Hence if |Phi(j)| <= M N(j)^(-a) for all squarefull j with some a > 1/2, then sum_kappa |B_kappa| <= C(a) M with
C(a) = sum_j c(j) N(j)^(-a) < infinity; with a = 1/2 the bound is M (log Q)^A. Contrapositive: if
|B| <= Q^(-delta) sum_kappa |B_kappa| (an inter-stratum saving), then for every eps > 0 there is a squarefull
j != 1 with

  N(j)^(1/2 + eps) |Phi(j)| >= c(eps) Q^delta |Phi(1)|,

i.e. the sum over the rows divisible by j, normalised by the square root of its share N(j)^(-1) of the rows,
exceeds the full sum by a power of Q.

*Proof.* Triangle inequality in Lemma I; the squarefull zeta sum converges for a > 1/2; pigeonhole with weights
N(j)^(-1/2-eps). ∎

Reading. Phi(j) is the same signed c-sum for the row vector m -> rho(j m) with conductor weights beta_c chi_c(j)
and length Q/N(j); by linearity of the residue, rho(j ·) is the coefficient sequence of the residue of the Kubota
series twisted by conj chi_n(j) (a Hecke character of n of conductor dividing 4 rad(j) by reciprocity). An
inter-stratum saving therefore exists iff the total at level 1 is smaller by a power than its own bounded-level
copies. A proof of that would be a proof of the saving for Phi(1) that fails at level j; none of the forms listed
in lead 17 (dual sum, Type I on average over the level, trilinear Gauss-sum form) separates level 1 from level j
[ARGUED]. Stratification by squarefull part is a unipotent change of variables on the family {Phi(j)} and carries
no saving of its own. This is the same kind of obstruction as e2 leg (b) ("bounded twist of beta"), now for the
signed sum rather than per stratum.

### 2.3 Why the control of r1 is not at exponent 0

With independent row phases, |B_kappa| is about N(kappa)^(-1/2) |B_1| and there are about K^(1/2) squarefull kappa
of norm at most K, so sum_kappa |B_kappa| grows like log Q times |B_1| while |B| stays at |B_1|. The random-sign
control of r1 then falls like 1/log Q, which over Q = 600 ... 37,000 is a fitted exponent near -0.1. This is the
a = 1/2 case of Proposition E. It was computed before the first run and is the reason for the second clause of
the pre-registration.

## 3. Decisive test: construction

Stand-alone tools copied from `tmp/sextic` (`alib.py`, `zomega.py`, `gauss6.c`, `sextic_theta.py`,
`build_table.py`); tables `sf_1e6.npz` (282,269 squarefree nodes) and `sf_1e7.npz` (2,822,619 nodes) built by those
tools on 2026-11-03. No repo data module is imported.

* Roles are disjoint, so there is no self term and no leave-one-out step: conductors c are the nodes with
  N(c) <= Xc = X/4; the moduli n of the theta estimator are the nodes with X/4 < N(n) <= X.
* Rows: all primary m prime to 6 with N(m) <= Qmax = Xc^(1/1.4) (2,166 rows at 1e6, 11,230 at 1e7). Sharp cutoff.
* Estimator (unnormalised): rho_sigma(m) = sum_{n in class sigma mod 4} conj chi_n(y0 m) gamma_1(n), y0 = -e0 =
  2 lambda^5, n prime to m; two halves (N(n) below and above 0.625 X) kept separately.
* Conductor side: A_m[g] = sum_{c in g} alpha(c) gamma_2(c) chi_c(m) (shorthand row a of rounds 2, 3 and e2);
  g = (octave of N(c), class of c mod 4, class of c mod 9).
* Path points: Q_j = (Xc/2^j)^(1/1.4) with the conductor octave (R_j/2, R_j], R_j = Q_j^1.4 (the toy geometry
  R = Q^1.4). 7 points at 1e6 (Q = 368 ... 7,172), 10 at 1e7 (Q = 431 ... 37,150). Rows are nested along the path,
  conductor sets are disjoint.
* Cells f = (sigma, c mod 4, c mod 9): 12 x 108 = 1,296. B_kappa^f = sum_{m in kappa, N(m) <= Q_j} rho_sigma(m) A_m[f].
  Sums of squares over the 108 class indicators equal sums over the 108 characters of the class group
  (Parseval), so r2 is also the statistic for the family of class-character twists of beta.
* Strata: one per squarefull kappa (31 at 1e6, 70 at 1e7; 9 to 70 along the path).
* r2, r1 as pre-registered; r1 control = 20 draws of random signs on strata. x2 = the same quotient as r2^2 with
  |.|^2 replaced by the cross product of the two estimator halves (removes the part of rho-hat that is not common
  to the halves). Exponents: least squares of log ratio on log Q over path points with Q >= 600; bracketed numbers
  are bootstrap standard errors over cells (200 resamples, same cells at every path point); "null scatter" is the
  standard deviation of the fitted exponent over the six random row controls.

Runs: `istrat_acc.py` X = 1e6: local, `scripts/memcap.sh 8`, 4 workers, 7 s. X = 1e7: local under the same cap
(planned and printed: 4 workers x 0.77 GB = 3.09 GB, results 0.2 GB; 363 s) and again on the server through
rhrun (4 cores, 8 GB, 738 s) with an identical digest; see section 9. `istrat_ana.py`: seconds.

## 4. Results

### 4.1 Fitted exponents in Q (row type a; controls)

X = 1e6 (6 path points, Q = 603 ... 7,172):

| rows | exponent r2 | exponent r1 | r1 control | r1 - control | exponent x2 |
|---|---|---|---|---|---|
| **theta estimator (a)** | **-0.0047 (0.0021)** | -0.1039 (0.0040) | -0.0998 | **-0.0040** | -0.045 (0.034) |
| Liouville-twisted rows | -0.0039 (0.0021) | -0.0972 | -0.0916 | -0.0055 | -0.039 (0.022) |
| THIN-twisted rows (b = 0.9) | +0.0005 (0.0022) | -0.0912 | -0.0930 | +0.0019 | +0.018 (0.019) |
| random multiplicative signs (3 draws) | +0.0014, +0.0049, -0.0022 | | | +0.0016, +0.0040, -0.0002 | +0.023, +0.029, -0.010 |
| random-phase rows (3 draws) | -0.0011, -0.0012, -0.0003 | | | -0.0018, -0.0011, +0.0003 | -0.020, +0.027, -0.012 |
| cubic theta rows (stand-in for theta^w) | -0.0088 (0.0022) | -0.1204 | -0.1105 | -0.0098 | -0.019 (0.005) |
| polar-aligned conductor weights (positive control) | +0.0150 (0.0011) | +0.0323 | +0.0178 | +0.0145 | +0.031 (0.004) |
| null scatter (6 random row controls) | 0.0026 | | | 0.0021 | 0.022 |

X = 1e7 (9 path points, Q = 708 ... 37,150):

| rows | exponent r2 | exponent r1 | r1 control | r1 - control | exponent x2 |
|---|---|---|---|---|---|
| **theta estimator (a)** | **+0.0009 (0.0011)** | -0.0979 (0.0020) | -0.0984 | **+0.0005** | -0.005 (0.007) |
| Liouville-twisted rows | -0.0004 (0.0011) | -0.0972 | -0.0973 | +0.0000 | +0.003 (0.006) |
| THIN-twisted rows (b = 0.9) | -0.0023 (0.0011) | -0.0982 | -0.0968 | -0.0014 | -0.016 (0.006) |
| random multiplicative signs (3 draws) | -0.0046, +0.0019, -0.0024 | | | -0.0057, +0.0030, -0.0032 | -0.020, +0.008, -0.011 |
| random-phase rows (3 draws) | -0.0037, -0.0012, +0.0007 | | | -0.0032, -0.0012, +0.0018 | -0.018, -0.003, +0.002 |
| cubic theta rows (stand-in for theta^w) | -0.0018 (0.0009) | -0.0829 | -0.0819 | -0.0010 | -0.004 (0.002) |
| polar-aligned conductor weights (positive control) | +0.0121 (0.0006) | +0.0506 | +0.0380 | +0.0126 | +0.022 (0.002) |
| null scatter (6 random row controls) | 0.0025 | | | 0.0033 | 0.011 |

**Decision by the pre-registered criterion: no saving.** r2: -0.0047 and +0.0009 against the threshold -0.02; r1
minus control: -0.0040 and +0.0005 against -0.02; both inside twice the null scatter at 1e7 and at 1e6. The raw
exponent of r1 (-0.10) is the control's exponent (-0.10), as computed in 2.3. The x2 exponent at 1e6 (-0.045) is
below -0.02 with standard error 0.034 and null scatter 0.022; at 1e7 it is -0.005 (0.007). It does not meet
"both sizes".

### 4.2 Values along the path (row type a, X = 1e7)

| Q | rows | strata | conductors | r2 (se) | r1 | r1 control | x2 (se) | share of D in squarefree stratum | rest / squarefree (l2) | corr(rest, squarefree) | same, random-phase rows |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 37,150 | 11,230 | 70 | 352,888 | 0.994 (0.004) | 0.455 | 0.458 | 0.92 (0.03) | 0.945 | 0.241 | -0.029 | -0.055 |
| 22,643 | 6,842 | 55 | 176,394 | 0.991 (0.005) | 0.473 | 0.477 | 0.96 (0.03) | 0.945 | 0.242 | -0.040 | +0.006 |
| 13,801 | 4,169 | 41 | 88,206 | 1.001 (0.005) | 0.492 | 0.492 | 1.01 (0.03) | 0.940 | 0.253 | +0.003 | -0.006 |
| 8,412 | 2,545 | 35 | 44,097 | 0.989 (0.005) | 0.519 | 0.527 | 0.92 (0.03) | 0.946 | 0.235 | -0.043 | -0.031 |
| 5,127 | 1,546 | 25 | 22,055 | 0.994 (0.004) | 0.563 | 0.565 | 0.97 (0.02) | 0.956 | 0.216 | -0.032 | +0.042 |
| 3,125 | 943 | 21 | 11,041 | 0.988 (0.005) | 0.547 | 0.555 | 0.94 (0.02) | 0.950 | 0.230 | -0.055 | -0.053 |
| 1,905 | 579 | 16 | 5,499 | 0.988 (0.004) | 0.589 | 0.595 | 0.97 (0.02) | 0.953 | 0.233 | -0.065 | +0.069 |
| 1,161 | 355 | 12 | 2,758 | 0.983 (0.004) | 0.658 | 0.666 | 0.94 (0.02) | 0.966 | 0.193 | -0.097 | +0.018 |
| 708 | 213 | 10 | 1,384 | 1.000 (0.004) | 0.663 | 0.664 | 0.99 (0.02) | 0.958 | 0.208 | +0.003 | +0.025 |
| 431 | 131 | 9 | 690 | 0.999 (0.004) | 0.676 | 0.679 | 1.00 (0.02) | 0.960 | 0.191 | +0.007 | +0.001 |

(The X = 1e6 path is in `ana_1e6.log` / `ana_1e6.json`; same picture, r2 between 0.989 and 1.008.)

* The squarefree stratum holds 94 to 97% of D at every point (e2: 93.9 / 94.5%). The other strata together have l2
  size 0.19 to 0.25 of the squarefree stratum. By the triangle inequality in l2 over the family,
  sqrt(sum_f |B^f|^2) >= (1 - 0.25) sqrt(D_1) and D_1 >= 0.94 D, so r2 >= 0.75 sqrt(0.94) = 0.73 at every point: with these shares a power saving in the family mean
  square is impossible, whatever the signs. [PROVED from the measured shares.]
* Constant offset [MEASURED, not explained]: mean r2 over the path is 0.9919 at 1e7 and 0.9963 at 1e6 for the
  theta estimator, against 0.9994, 1.0036, 0.9999 (1e7) for random-phase rows, 0.9991 for Liouville-twisted rows,
  1.0037 for THIN, 1.0035 for cubic rows; mean x2 is 0.957 (1e7), 0.947 (1e6) against 0.99 to 1.02 (1e7) and 0.99
  to 1.04 (1e6) for random-phase rows. So the strata are anticorrelated at the level of 1 to 2% of D (4 to 5% of
  the part common to the two estimator halves), without trend in Q (exponents above), and the Liouville twist
  removes it. Significance against the control scatter is about 2 to 3 standard deviations for x2. A constant is
  what Proposition E allows; it is not a saving.
* Size against Cauchy-Schwarz: sum_f |B^f|^2 / sum_f (||rho_sigma||^2 ||A^f||^2) falls from 0.0084 (Q = 431) to
  0.00009 (Q = 37,150), i.e. the forms are at the random level 1/(number of rows) at every point, as in Z8.

### 4.3 Sign of the leading (polar) term of each stratum [MEASURED]

With conductor weights aligned to the polar term (beta_c = conj gamma_1(c) chi_c(y0); Theorem P phase), every
stratum carries a coherent term and the strata add: at X = 1e7, Q = 37,150 the correlation of B_kappa with the
squarefree stratum is +0.66 (kappa = p^2, N p = 7, both primes), +0.59 (N p = 13), +0.33 (N p = 19), +0.27
(kappa = p^3, N p = 7); correlation of the sum of all non-squarefree strata with the squarefree one +0.87, rising
from +0.12 at Q = 1,161; r2 = 1.058, exponent +0.012 (0.0006). The polar terms of the strata have the same sign as
that of the squarefree stratum: no cancellation in the leading term, and no alternation of the type mu(d). For the
manuscript row a the same correlations are -0.04 ... +0.02 (random-phase rows: -0.05 ... +0.03).

### 4.4 Sublattice sums (hypothesis of Proposition E) [MEASURED]

N(j) sum_f |Phi(j)^f|^2 / sum_f |Phi(1)^f|^2 at X = 1e7, Q = 37,150: j = p with N p = 7, 13, 19, 25, 31: 0.76, 0.87,
0.87, 0.88, 1.02; j = p^2: 0.75, 0.90, 0.85, 0.84, 1.02. At 1e6, Q = 7,172: 0.86 to 1.05. So |Phi(j)| is
N(j)^(-1/2) |Phi(1)| times a constant near 1 for every tested j: the a = 1/2 case, no sublattice anomaly. The
hypothesis whose failure Proposition E requires for an inter-stratum saving is not seen.

## 5. Pivot (one): stratification by the number of prime factors

Strongest adjacent idea found: the signs in Lemma I are Moebius signs, so the natural second splitting of the rows
is by Omega(m) (parity classes are what a sieve weight or a Type I/II decomposition separates). Same statistic with
strata Omega(m) = 0, 1, 2, ... (4 to 6 classes).

| X | rows | exponent r2 | r1 - control | exponent x2 |
|---|---|---|---|---|
| 1e6 | theta estimator | -0.0155 (0.0051) | -0.0173 | -0.16 (0.08) |
| 1e6 | random-phase rows | -0.0122 (0.0054) | -0.0117 | -0.07 (0.05) |
| 1e7 | theta estimator | -0.0017 (0.0027) | -0.0017 | -0.029 (0.017) |
| 1e7 | random-phase rows | +0.0012 (0.0027) | +0.0033 | +0.008 (0.014) |
| 1e7 | polar-aligned weights (positive control) | +0.0872 (0.0012) | +0.134 | +0.154 (0.003) |

Also sum_f |B^f|^2 for Liouville-twisted rows divided by the same for untwisted rows (equal to 1 iff even and odd
Omega classes are orthogonal in the family mean square): between 0.83 and 1.19 along the 1e7 path, no trend, mean
1.01. No saving: r2 above -0.02 at both sizes and equal to the random-phase control within 0.003 to 0.004; the x2
value at 1e7 (-0.029, se 0.017) is inside twice its standard error of 0 and of the control. The pivot is closed;
no further pivot is taken.

## 6. Controls

| control | where it enters | outcome | structural reason |
|---|---|---|---|
| random signs on strata | r1, r2 | r1 of the data equals it (difference of exponents +0.0005 at 1e7); r2 control mean 1 | strata are disjoint row sets; with independent signs the cross terms vanish in mean |
| random-phase rows | rows | r2 exponent -0.004 ... +0.001; equal to the data | same |
| Liouville-twisted rows | rows, sign (-1)^Omega(m) | exponents -0.004, -0.0004; removes the constant offset of 4.2 | the twist multiplies stratum kappa by (-1)^Omega(kappa) and scrambles the squarefree stratum by (-1)^omega(m1) |
| THIN (b = 0.9, floor rule on primes of O by norm; 217 of 911 and 782 of 3,932 primes flipped) | rows | exponents +0.0005, -0.0023 | completely multiplicative sign; Lemma I and Proposition E hold verbatim for it (they hold for any r(m)); at these sizes the set is not thin (20 to 24% of the primes) |
| random multiplicative signs | rows | exponents within +-0.005 | same |
| cubic theta rows (gamma_2 Kubota residues; split-half correlation of the estimator 0.82, 0.92) | rows | -0.0088 (0.0022) at 1e6, -0.0018 (0.0009) at 1e7 | stand-in for theta^w: the literal theta^w control (a power of the Jacobi theta in the bridge family) has no meaning for Kubota rows; the cubic theta is the available theta of another cover, with known Hecke structure (Patterson), and it shows no inter-stratum saving either |
| polar-aligned conductor weights | conductors | positive control: strata add, exponent +0.012 to +0.015 | the polar term (Theorem P) has one phase for all strata |
| Davenport-Heilbronn, backward heat, zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer operator | not applicable | — | the lane makes no statement about a target or its zeros; Lemma I and Proposition E are identities for arbitrary row values, so they hold for every control (control-blind by construction) |

The test statistic does not separate the theta estimator from any row control in exponent. R3 is not met and is
not claimed.

## 7. Verdict

* PROVED + EXACT: Lemma I (signed strata), the sign table, the bilinear form. PROVED: Proposition E.
* MEASURED: no inter-stratum saving at X = 1e6 and 1e7 (exponents -0.0047 / +0.0009 for r2; -0.0040 / +0.0005 for r1
  minus control; threshold -0.02; null scatter 0.003). Squarefree share 94 to 97% of D, so r2 >= 0.73 at every
  point. Polar leading terms of the strata have the same sign. Sublattice sums obey N(j)^(-1/2) scaling with
  constants 0.75 to 1.05. A constant anticorrelation of 1 to 2% of D, removed by the Liouville twist, unexplained.
* Pivot (Omega strata): no saving.
* Outcome branch of the assignment: "no saving -> second same-kind obstruction". **Proposal: close lead 17** (TRO6
  through the signed c-sum by squarefull stratification) under the stopping rule of STRATEGY section 3, with this
  record and e2 as the two obstructions: (i) e2 Lemma S, each stratum is the squarefree problem with a bounded
  twist; (ii) Lemma I + Proposition E, the signed sum over strata is a unipotent recombination of bounded-level
  copies of the total, and the measured ratio has exponent 0. Reopen only with an input that separates level 1
  from level j in Phi(j). Not closed by this record: the dual form (a) of e2 section 4 on squarefree n, and the
  sub-items "Type I on average over the level" and "trilinear Gauss-sum form" of lead 17 as stand-alone routes
  (this lane used the trilinear form only as the estimator). The conditional asked for in the saving branch (Type I
  average and abscissa) is not stated because no saving was measured.
* No eta > 0. No abscissa. Nothing about zeros of zeta.

### Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 (all primes together, multiplicativity essential) | false | Lemma I and Proposition E hold for arbitrary row values r(m); the measurement gives the same exponent for theta rows and for non-multiplicative random-phase rows |
| R2 (height-uniform, every window) | false | no statement about a target; the measurement is a family mean square at Q <= 37,150 |
| R3 (fails for every control for a structural reason) | false | control-blind by construction (section 6) |
| R4 (reaches the critical line) | false | TRO6 concerns the abscissa 7/8; nothing here moves it |

## 8. Three weakest steps

1. **The estimator is mostly not theta.** The two estimator halves correlate at 0.14 (1e6) and 0.23 (1e7), so
   most of rho-hat is the non-polar remainder of the Kubota sums over X/4 < N(n) <= X, not the residue. r2 and r1
   are statements about the finite trilinear form sum beta_c gamma_1(n) chi_c(m) conj chi_n(y0 m); only x2 isolates
   the common part, and its errors are 3 to 10 times larger (0.007 at 1e7, 0.034 at 1e6). The x2 exponent at 1e6 is
   below the threshold within its error. Rows are primary only (no unit, lambda or 2 shifts), cutoff sharp, toy
   geometry R = Q^1.4, shorthand row a only.
2. **Family mean square, not the conjecture's targets.** The statistic sums over 1,296 class cells; TRO6 is a
   supremum over targets and the zero-carrying targets are not sampled (as in Z8). The bound r2 >= 0.73 and the
   exponent 0 exclude an inter-stratum saving in the mean square only. For one exceptional target, cancellation
   between strata remains possible exactly in the form Proposition E states (a sublattice anomaly); the lane gives
   no reason against it beyond the argument that no listed tool separates level 1 from level j, which is ARGUED.
3. **Statistics along a nested path.** Path points share rows; bootstrap errors resample cells and understate the
   scatter by a factor of about 2 (null scatter 0.0025 against bootstrap 0.0011 at 1e7). Six random controls give
   a coarse null. The constant offset of 4.2 is 2 to 3 standard deviations and unexplained; it may belong to the
   estimator (moduli prime to m only). The periodicity statement for pairs kappa, kappa t^6 is cited, not checked,
   and such pairs do not occur below Q = 117,649.

## 9. Reproduction and files

All under `tmp/research-2026-11-16/push/c9-tro6-interstratum-cancellation/`.

| file | content | run |
|---|---|---|
| `alib.py`, `zomega.py`, `gauss6.c`, `sextic_theta.py`, `build_table.py` | copies of the stand-alone tools of `tmp/sextic` | — |
| `istrat_acc.py` | per-row conductor sums and estimators | `scripts/memcap.sh 8 python istrat_acc.py data/sf_1e6.npz data/acc_1e6.npz 7 4` (7 s); same with `sf_1e7.npz ... 10 4` (363 s, log `acc_1e7_local.log`) |
| `istrat_ana.py`, `ana_1e6.json/.log`, `ana_1e7.json/.log` | strata, ratios, controls, fits (seed 20261118) | `python istrat_ana.py data/acc_1e7.npz data/sf_1e6.npz ana_1e7.json` |
| `lemma_check.py`, `.log` | exact check of Lemma I | local, seconds |
| `data/` (ignored) | tables and `acc_*.npz` (0.5 GB) | — |

| `digest.py`, `digest_local_1e7.log`, `logs/` | digest of the accumulation output; server logs | local and server |

Server (rhrun only; rhstatus checked before each launch: rh.slice 11 GB and 18 GB of 150 in use): unit
`rh-c9-istrat-acc-1119021538` (8 GB, 4 cores; planned memory printed, 3.09 GB; 738 s) repeated the X = 1e7
accumulation; unit `rh-c9-istrat-digest-1119022904` (2 GB, 1 core) printed its digest. The digest equals the local
one in every printed digit (`logs/rh-c9-istrat-digest-1119022904.log` against `digest_local_1e7.log`), so the 1e7
numbers of section 4 are reproduced on a second machine. Both units exited by themselves; no unit of this lane is
left. Left in place on the server: `~/rh-push/c9-tro6-interstratum-cancellation/` (477 MB: table and output; can be
deleted). The table transfer took 21 minutes on the link, which is why the local run finished first.
