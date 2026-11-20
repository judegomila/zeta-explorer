# c10-tro6-dual-squarefree-type1-level: the two forms of the signed c-sum of TRO6 that had not been run stand-alone

2026-11-18/19. Internal working note. Nothing committed or pushed. Not refereed.

**Verdict: precise obstruction (third of the same kind for lead 17). For the dual sum on squarefree n (form (a)) and
for Type I by level (form (b)) the signed outer sum has the exponent of its random-sign and seeded row controls at
X = 1e6 and at X = 1e7 (|difference| <= 0.01 in three of four decision cases at 1e7; threshold -0.02). The
pre-registered rule did fire once, for the level statistic L of form (b); a per-conductor rerun shows that this is
the decay of the known polar term (Theorem P), and after its removal the exponent is inside the seed spread at both
sizes. Lemmas A and B (exact, checked) show that the dual form, the Type I level average and the trilinear
Gauss-sum form are re-bracketings of one finite trilinear sum, and that averaging over the level produces
incomplete sums of normalised cubic Gauss sums, not Kloosterman sums. TRO6-natural(eta) is not proved or measured
for any eta > 0. 7/8 and 0.874886647 are unchanged; both rest on unrefereed manuscripts. No statement about zeros.
Frontier-number lane (metric part B): the headline is not affected. NO QED.**

Labels: PROVED / EXACT (finite identity checked numerically; symbols in integer arithmetic, Gauss sums in float64) /
MEASURED / ARGUED / OPEN.

## 1. Plan; what is new against the map, e2 and c9

Read: BRIEF (to the end), OBSTRUCTION_MAP rows Z1-Z8, T1, open direction 4 and the controls section, node
map-open-4, `e2-tro6-signed-csum-stratified` (RESULT, REFEREE), `c9-tro6-interstratum-cancellation` (RESULT,
REFEREE), `r2-tro6-type12-split` (sections 2-7 and referee item 8.1), `r3-nonpolar-proof` section 4.3.

Left open by e2 and c9: form (a) (dual sum on squarefree n; e2 4.5) and "Type I on average over the level" (Z6;
referee of r2-tro6-type12-split, 8.1) as stand-alone routes. Not repeated: squarefull stratification (Lemma S,
Lemma I, Proposition E), per-modulus bounds (Z7), arbitrary-coefficient bilinear forms (Z6), large sieves (Z5).

Order of work: (1) the two exact identities (section 2); (2) the structural question for form (b), answered from
the identity before any run (section 3); (3) pre-registration (`PREREG.md`, written before the first run, one
amendment before the first run); (4) the decisive test at 1e6 and 1e7 (sections 4, 5); (5) diagnosis of the one case
where the rule fired (section 6). No pivot was taken.

## 2. First lemma: the exact identities

Notation of e2/c9. O = Z[omega]; nodes = squarefree primary elements prime to 6; chi_c the sextic symbol;
gamma_j(c) the normalised Gauss sum of chi_c^j; gt_j(y, c) = conj chi_c(y)^j gamma_j(c) for (y, c) = 1 and 0 for
squarefree c with (y, c) != 1; alpha(c) = c/|c|; G(c) = conj chi_c(4) gamma_3(c) (a function of c mod 4);
R(a, b) = +-1 the reciprocity sign, chi_b(a) = R(a, b) chi_a(b). Cubic row beta_c = alpha(c) gamma_2(c).
Finite theta estimator over a set K of moduli: rho-hat(u; r) = sum_{k in K, (k, r) = 1} gamma_1(k) conj chi_k(u r).
Primal twisted sum T(c) = sum_m W(m) rho(m) chi_c(m); the TRO6 form is B = sum_c beta_c T(c).

**Lemma L (round 2; rechecked) [EXACT].** beta_c gamma_1(c) = mu(c) alpha(c)^2 G(c), |gamma_1(c)| = 1. So
mu(c) beta_c = alpha(c)^2 G(c) conj gamma_1(c): multiplying the cubic row by mu removes the Moebius sign relative to
the sextic Gauss sum.

**Lemma A (form (a): dual sum on squarefree n) [PROVED; EXACT].** Let C be a finite set of nodes, v(c) weights,
S(c) >= 1 cut-offs, u an S-unit, and

  D_a = sum_{c in C} mu(c) alpha(c)^2 G(c) v(c) sum_{s node, (s, c) = 1, N(s) <= S(c)} rho-hat(u; c s).

Then
* (A1) D_a = sum_c beta_c gamma_1(c) v(c) sum_s rho-hat(u; c s): the cubic row times gamma_1(c), against theta
  coefficients at the multiples c s of the conductor.
* (A2) D_a = sum_{n node} rho-hat(u; n) Lambda(n), Lambda(n) = sum_{c | n, c in C, N(n/c) <= S(c)} mu(c) alpha(c)^2 G(c) v(c):
  a first moment of theta coefficients over squarefree n with a truncated Moebius-divisor weight.
* (A3) D_a = sum_{k in K} gamma_1(k) conj chi_k(u) sum_{c in C, (c, k) = 1} mu(c) alpha(c)^2 G(c) R(c, k) conj chi_c(k) v(c) S_k(c),
  S_k(c) = sum_{s, (s, c k) = 1, N(s) <= S(c)} conj chi_k(s).

*Proof.* (A1) is Lemma L. (A2): for squarefree n every divisor c is coprime to n/c, so the pairs (c, s) with
c s = n are the divisors c of n. (A3): open rho-hat, use complete multiplicativity of conj chi_k and
conj chi_k(c) = R(c, k) conj chi_c(k). ∎

Reading of (A3). For fixed k the c-sum is a partial sum of mu(c) psi_k(c) with
psi_k(c) = alpha(c)^2 G(c) R(c, k) conj chi_c(k): by reciprocity a sextic Hecke character of c of conductor dividing
12 k, times the class function G (a sum of 4 characters mod 4, r2-tro6-type12-split Lemma 2.3). So (A3) is the
trilinear Gauss-sum form of lead 17: the dual form is not a different object from it. The three variables are
(k: Kubota modulus of the theta function, weight gamma_1(k)), (c: conductor, weight mu psi_k), (s: smooth).

**Lemma B (form (b): Type I by level) [PROVED; EXACT].** Let a, b be coprime nodes.
* (B1) beta_{ab} chi_{ab}(m) = beta_a chi_a(m) · beta_b chi_b(m a^4) (r2-tro6-type12-split Cor. 2.2, j = 0).
* (B2) For a conductor set C and a level a put t_a = sum_{c in C, a | c} mu(c) beta_c T(c). Then
  t_a = mu(a) beta_a sum_m W(m) rho(m) chi_a(m) sum_{b : ab in C} alpha(b)^2 G(b) conj gt_1(m a^4, b):
  the inner sum over b carries no Moebius factor; it is a partial sum of sextic Gauss sums at the shifted index
  m a^4 with the weight alpha^2 G.
* (B3) For a set of levels A: sum_{a in A} mu(a) t_a = sum_{c in C} mu(c) beta_c T(c) M_A(c),
  M_A(c) = sum_{a | c, a in A} mu(a). The level average with the Vaughan sign is the same form with the weight
  mu(c) beta_c multiplied by a truncated Moebius divisor sum.
* (B4) sum_{a in A} mu(a) t_a = sum_m W(m) rho(m) sum_b mu(b) beta_b chi_b(m) sum_{a in A, (a, b) = 1, ab in C} alpha(a) chi_a(m)^3 gt_2(m b, a):
  after the split the level variable enters only through the normalised cubic Gauss sum of modulus a at index m b,
  the quadratic symbol chi_a(m)^3 and alpha(a).

*Proof.* (B1): gamma_2(ab) = chi_a(b)^2 chi_b(a)^2 gamma_2(a) gamma_2(b) (CRT) and cubic reciprocity
chi_a(b)^2 = chi_b(a)^2 give gamma_2(ab) = chi_b(a)^4 gamma_2(a) gamma_2(b); alpha is multiplicative. (B2): (B1), then
Lemma L in the form mu(b) beta_b chi_b(r) = alpha(b)^2 G(b) conj gt_1(r, b) with r = m a^4 (both sides vanish when
(m, b) != 1). (B3): exchange the sums. (B4): mu(a) mu(ab) beta_{ab} chi_{ab}(m) = mu(b) beta_b chi_b(m) · alpha(a) gamma_2(a) chi_a(m) chi_b(a)^4,
and gamma_2(a) chi_b(a)^4 = gamma_2(a) conj chi_a(b)^2 = gt_2(m b, a) chi_a(m)^2. ∎

**Checks (`lemma_check.py`, `lemma_check.log`).** Own node set (15 primes of norm <= 61, 108 nodes of norm <= 1400),
Gauss sums by direct summation over residues, symbols in integer arithmetic; nothing read from the tables except
in the last line.

| identity | case | max error |
|---|---|---|
| Lemma L; abs(gamma_1) = 1 | 108 nodes | 4.6e-14; 1.2e-14 |
| reciprocity chi_b(a) = R chi_a(b) | 8,504 coprime pairs (3,496 with R = -1) | 0 mismatches (integers) |
| A1, A2, A3 | 68 moduli, 14 conductors, 12 s, 80 pairs, 74 distinct n; abs(D_a) = 7.80 | 2.3e-14, 1.8e-15, 5.8e-15 |
| B1 | 1,020 triples (a, b, m) | 3.9e-14 |
| B2 (Gauss sums at index m a^4 by direct summation) | 11 levels, 71 rows with random complex values | 6.8e-10 |
| B3; B4 (cubic Gauss sums at index m b by direct summation) | abs(value) = 73.2; M_A(c) in {-3, ..., -1} | 4.6e-14; 5.1e-12 |
| Lemma L on the X = 1e6 table | 282,269 nodes | 4.7e-9 (accuracy of the table) |

## 3. Structural question for form (b), answered before computing

Question: does averaging over the level give a Kloosterman-type sum to which a Weil or Deligne bound applies with
the sign kept, or does it reduce to the target's own bound?

Answer: neither a Kloosterman sum nor a new bound; it returns the same form.

1. **With the sign kept the level average is the original form [PROVED, (B3)].** The weight changes from beta_c to
   mu(c) beta_c M_A(c). M_A is a truncated Moebius divisor sum (not multiplicative; abs(M_A(c)) <= d_A(c)); no
   variable is completed and no sum is shortened.
2. **The only complete sums in the level variable are Gauss sums, already evaluated [PROVED, (B4)].** The level a
   enters through gt_2(m b, a), abs(gt_2) = 1. Weil's bound for a one-variable character sum modulo a prime is this
   equality and is contained in the normalisation. What remains is an incomplete sum over N(a) <= A of unimodular
   Gauss-sum phases at the fixed index m b, twisted by the quadratic symbol of conductor m and by alpha: a cubic
   Kubota-type sum of length A <= Q^0.4 at an index of norm >= Q. No sum over a residue field with two free
   frequencies (Kloosterman) appears, so Deligne has nothing to act on. [PROVED identity; the classification of
   what bounds exist for such short cubic sums is ARGUED: the available tool is the cubic large sieve, which is
   the input of MS Lemma 15.1 and drops the sign of mu(b) beta_b.]
3. **Second moment over the level (the referee's suggestion in r2-tro6-type12-split 8.1) [ARGUED].** By (B1) the
   a-dependence of t_a is chi_a(m b^4) with the m-sum inside, so sum_a abs(t_a)^2 is a sextic large-sieve form in
   the level with arguments y = m b^4. Opening the square and applying Poisson in a gives complete sums of a sextic
   character of conductor about N(m m' b b') over a, i.e. Gauss sums again, with a dual length N(m m' b b')/A far
   above 1. The off-diagonal is then a sum of Gauss-sum phases over moduli, whose main terms are theta
   coefficients (this is why the cubic and sextic large sieves have a (MN)^(2/3) term). The second moment over the
   level therefore reproduces a correlation of the type under study with the roles of the variables permuted.
4. **Function-field warning (node map-open-4, row T1).** Over F_q[T] the levels of one degree form a complete
   family and the sum over them is a sum over points; Weil applies and the model saving is Weil's bound for the
   coefficients of 1/L of the target (r2-ff-tro6-complete, Theorem C). Over O the level sum is an initial segment
   N(a) <= A, not a complete family. The step that gives the model its saving has no counterpart here; what would
   replace it is cancellation in sum mu(a)(...) over an initial segment, i.e. the target's own statement.

**Circularity check (stated as required).** A proved saving eta in either form would move the claimed abscissa
below 0.874886647 relative to the unrefereed manuscripts, and equals a zero-free statement in (7/8 - eta/96, 7/8]
for the target. Check of the two forms as routes:
* (a) through (A3), pointwise in k: a power saving in sum_{N(c) <= C} mu(c) psi_k(c) with C below N(k)^(1/2) is a
  zero-free strip of fixed width for L(s, psi_k) (with the target's nu included: for L(s, nu psi_k)), uniform in
  the sextic twist k. That is a statement of the type to be proved and stronger than it. A proof along this line
  assumes more than it delivers.
* (a) with the average over k kept: the phases gamma_1(k) must be used, which is (A1)/(A2), the sum of theta
  coefficients. No third object appears between (A2) and (A3).
* (b): by (B3) it is the original form; by (B4) and item 4 it contains no input independent of the statement.
No eta is claimed here, so no circular claim is made; the check says that neither form supplies an input from
outside the statement.

## 4. Decisive test: construction

Stand-alone tools copied from `tmp/sextic` (`alib.py`, `zomega.py`, `build_table.py`, `sextic_theta.py`,
`gauss6.c`); tables `sf_1e6.npz` (282,269 nodes) and `sf_1e7.npz` (2,822,619 nodes) of 2026-11-03. No repo data
module is imported. Estimator moduli k: nodes with X/4 < N(k) <= X, two halves split at 0.625 X, classes
sigma = k mod 4 (12).

**Form (a)** (`acc10.py a`, `ana10.py a`). Indices: all nodes n with N(n) <= M (M = 240,000 at 1e6: 67,739 rows;
M = 250,000 at 1e7: 70,567 rows). rho-hat_sigma(u; n) at three shifts u = lambda (decision; the shift found by e2),
y0 = 2 lambda^5, 1; cubic rows as a control. Path M_j = M/2^j; conductors c in (C_j/2, C_j], C_j = M_j^(1-theta);
s with N(s) <= M_j^theta N(c)/C_j; theta = 2/9 (toy geometry) and 1/3 (upper end of the open range of
r2-tro6-type12-split 3.3). t_c = mu(c) alpha(c)^2 G(c) N(c)^(-1/2) sum_s rho-hat_sigma(u; c s). Cells
(sigma, c mod 4, c mod 9). theta = 1/2 was dropped: fewer than 100 conductors at every reachable point.
In the toy geometry the s-sum is short: N(s) <= 15.8 at M = 250,000 (s = 1 and the primes of norm 7, 13).

**Form (b)** (`acc10.py b`, `ana10.py b`). As c9: conductors N(c) <= X/4 in octaves (R_j/2, R_j], R_j = X/2^(j+2),
rows m primary prime to 6 with N(m) <= Q_j = R_j^(1/1.4) (2,166 rows at 1e6; 11,230 at 1e7), u = y0.
t_a[sigma, f] = sum_{c = 0 mod a, c in octave j, c mod 4 = f} mu(c) beta_c T_sigma(c) for levels 1 < N(a) <= Q_j^kappa,
kappa = 0.4 (the range Type I must cover, Z6), 0.5, 0.6 (57 levels at 1e6, 154 at 1e7; 1,586,977 pairs (c, a)).
Signed level average sum_a mu(a) t_a (the Vaughan sign of (B3)).

**Statistics.** r2 = sqrt(sum_cells abs(sum_x t_x)^2 / sum_cells sum_x abs(t_x)^2), x = c in (a), x = a in (b); L =
sum_cells sum_x abs(t_x)^2 for the theta rows divided by the mean over seeded random-phase rows (the inner sums: the
s-sum in (a), the level-a conductor sum in (b)). Controls: random signs on x (20 draws); seeded rows: random phase
(3), completely multiplicative random signs on primes (3; sign-twisted primes), Liouville twist, THIN twist
(b = 0.9 floor rule; 3,471 of 21,219 and 3,587 of 22,040 primes flipped in (a)), cubic theta rows (stand-in for
theta^w, as in c9). Positive controls: in (a) the weight N(c)^(-1/2) alone (first moment of theta coefficients); in
(b) rows with 10% (in l2) of the direction aligned with the signed level sum added.

**Decision rule (PREREG.md).** Exponent = slope of log statistic on log size along the path. Saving iff at both
table sizes the exponent of the theta rows minus the mean over the six seeded rows is below -0.02 and the exponent
is below the minimum of the six seeds; for r2 or for L; decision cases: (a) theta = 2/9 and 1/3 at u = lambda; (b)
kappa = 0.4 and 0.6.

**Validation.** Mode-b estimator equals c9's `acc_1e6.npz` exactly (difference 0.0); mode-a estimator at u = y0 equals
mode b on the 2,020 common rows; direct recomputation of three rows at three shifts: 3e-13; level sums against
direct sums with divisibility by complex division: 2e-7 to 2e-6 (single-precision storage); per-conductor sums
(`tcond.py`) against the row-side accumulation: relative 3e-8 to 8e-8 at every path point.

**Runs.** 1e6: local, `scripts/memcap.sh 8`, 4 workers (mode a 276 s, mode b 6 s). 1e7 mode a: local under the same
cap, planned memory printed (2.44 GB), 2,175 s. 1e7 mode b, its analysis, the per-conductor accumulation and its
analysis: server through rhrun only, each 8 GB or less and 4 cores or less (517 s, 1 min, 712 s, 2 min); rhstatus
checked before each launch. Planned memory printed in every log.

## 5. Results

### 5.1 Signed outer sum (r2): exponents

| form, decision case | X | points | theta rows | six seeds: mean, [min, max] | difference | Liouville | THIN | cubic rows | positive control |
|---|---|---|---|---|---|---|---|---|---|
| (a) theta = 2/9, u = lambda | 1e6 | 6 | -0.0060 | -0.0006, [-0.0084, +0.0137] | -0.0054 | -0.0212 | -0.0061 | +0.0031 | +0.190 |
| (a) theta = 2/9, u = lambda | 1e7 | 6 | -0.0051 | -0.0012, [-0.0091, +0.0067] | -0.0038 | -0.0257 | -0.0095 | -0.0025 | +0.203 |
| (a) theta = 1/3, u = lambda | 1e6 | 4 | +0.0044 | -0.0004, [-0.0136, +0.0140] | +0.0048 | -0.0305 | +0.0093 | +0.0508 | +0.151 |
| (a) theta = 1/3, u = lambda | 1e7 | 4 | -0.0073 | +0.0021, [-0.0061, +0.0107] | -0.0093 | -0.0536 | +0.0046 | +0.0526 | +0.196 |
| (b) kappa = 0.4 | 1e6 | 5 | +0.0740 | +0.0354, [+0.0008, +0.0860] | +0.0386 | +0.0452 | +0.0089 | -0.0778 | +0.248 |
| (b) kappa = 0.4 | 1e7 | 9 | +0.0173 | +0.0169, [+0.0096, +0.0261] | +0.0004 | +0.0410 | +0.0105 | +0.0534 | +0.239 |
| (b) kappa = 0.6 | 1e6 | 6 | +0.0015 | -0.0266, [-0.0615, +0.0157] | +0.0281 | +0.0040 | -0.0015 | -0.0411 | +0.228 |
| (b) kappa = 0.6 | 1e7 | 9 | -0.0159 | -0.0327, [-0.0430, -0.0254] | +0.0168 | -0.0246 | -0.0362 | +0.0452 | +0.260 |

* **No saving in any decision case.** Every difference is above -0.02. In (a), theta = 1/3 at 1e7 the exponent
  (-0.0073) is below the seed minimum (-0.0061) by 0.001 with a difference of -0.009.
* Values of r2: in (a) between 0.975 and 1.045 at every point (random signs on c: mean 0.995 to 1.004). In (b)
  between 0.95 and 1.34, the same as for random-phase rows (0.98 to 1.33), and not 1: with the Vaughan sign the
  levels share conductors, so the baseline is the combinatorial factor of M_A against d_A ((B3)); random signs on
  the levels give 0.96 to 1.05.
* Liouville-twisted rows in (a) have exponents -0.02 to -0.05, at or below the threshold, at both sizes. For
  squarefree n the twist is mu(c) mu(s): it removes the Moebius sign from c, so the outer sum becomes the
  Moebius-free sum sum_c alpha(c)^2 G(c)(...). The same holds for the variant without mu ("nomu": -0.025, -0.043
  at theta = 2/9; -0.023, -0.028 at theta = 1/3). For these two control forms r2 falls from about 1.00 at the smallest M to 0.84 to 0.89
  at the largest (both sizes): the Moebius-free outer sum is below the random level. Cause (6.2, `nomu_dem.py`): the
  class mean of the theta rows enters every t_c, and without mu the outer weight alpha(c)^2 G(c) cancels it by
  angular equidistribution; after mean removal r2 of the Moebius-free form is 0.96 to 1.04 at the three largest
  points of every case. With mu kept (the form under test) no such effect exists before or after removal.
* Non-decision shifts in (a): u = y0, theta = 1/3 at 1e6 has -0.0271 against seeds [-0.0047, +0.0163] (the rule
  would fire at this size) and +0.0007 at 1e7 (it does not); every other case differs from its seed mean by less than 0.01.
* Positive controls are detected in every case (exponents +0.15 to +0.26; (a) r2 up to 2.27, (b) up to 3.39).

### 5.2 Inner sums (L): exponents

| form, decision case | X | theta rows | six seeds: mean, [min, max] | difference | rule |
|---|---|---|---|---|---|
| (a) theta = 2/9, u = lambda | 1e6 | +0.0033 | -0.0009, [-0.0053, +0.0048] | +0.0042 | none |
| (a) theta = 2/9, u = lambda | 1e7 | +0.0134 | -0.0041, [-0.0086, +0.0043] | +0.0175 | none |
| (a) theta = 1/3, u = lambda | 1e6 | +0.0330 | +0.0089, [-0.0073, +0.0263] | +0.0241 | excess |
| (a) theta = 1/3, u = lambda | 1e7 | +0.0714 | +0.0038, [-0.0155, +0.0218] | +0.0676 | excess |
| (b) kappa = 0.4 | 1e6 | -0.1074 | -0.0215, [-0.0768, +0.0315] | -0.0860 | **saving** |
| (b) kappa = 0.4 | 1e7 | -0.0605 | +0.0060, [-0.0099, +0.0250] | -0.0665 | **saving** |
| (b) kappa = 0.6 | 1e6 | -0.0191 | -0.0106, [-0.0426, +0.0259] | -0.0085 | none |
| (b) kappa = 0.6 | 1e7 | -0.0278 | +0.0034, [-0.0025, +0.0162] | -0.0312 | saving at this size |

**By the letter of the pre-registered rule, form (b) at kappa = 0.4 shows a "saving" in L at both sizes, and form
(a) at theta = 1/3 shows an "excess" in L at both sizes.** Both were examined (section 6). Both are the known
polar (first-moment) terms of theta_6, and neither is a saving of the form:

* (b): L runs from 1.26 (Q = 708) through 1.07 (Q = 1,905) to 0.90 to 0.98 (Q >= 3,125) at 1e7: an excess at small
  Q that disappears, then a level 2 to 10% below the random rows without trend. It is not a deficit that grows.
* (a): L is above 1 at theta = 1/3 (1.07 to 1.15 at 1e6, 1.13 to 1.29 at 1e7) and grows with M: the s-sums of the
  theta rows are larger than those of random-phase rows.

## 6. Diagnosis of the two flagged cases

### 6.1 Form (b): the trend of L is the decay of the polar term

`tcond.py` recomputes the twisted sums per conductor, T_sigma(c) for all 705,012 conductors at 1e7 (35,284 per top
octave at 1e6). `tcond_ana.py` removes, in each cell (octave, estimator half, sigma, c mod 4, c mod 9), the
component along e(c) = gamma_1(c) conj chi_c(y0) (N(c)/R_j)^(-1/3), the phase and amplitude law of Theorem P (one
complex coefficient per cell), and recomputes the level sums. Baseline: the exact expectation for random-phase rows,
sum_m abs(rho(m))^2 abs(A[m, a, f])^2; the bias of the removal step is measured on Gaussian surrogates (0.91 to 1.00)
and divided out.

X = 1e7:

| Q | conductors | energy of T(c) / random rows (coprime rows) | polar share (null) | L, kappa = 0.4 | after removal | L, kappa = 0.6 | after removal |
|---|---|---|---|---|---|---|---|
| 37,150 | 352,888 | 1.010 | 0.028 (0.0003) | 0.985 | 0.985 | 0.990 | 0.981 |
| 22,643 | 176,394 | 1.011 | 0.034 (0.0006) | 0.938 | 0.937 | 0.961 | 0.951 |
| 13,801 | 88,206 | 1.010 | 0.038 (0.001) | 0.887 | 0.879 | 0.920 | 0.901 |
| 8,412 | 44,097 | 1.014 | 0.047 (0.002) | 0.913 | 0.878 | 0.963 | 0.920 |
| 5,127 | 22,055 | 1.018 | 0.058 (0.005) | 0.966 | 0.924 | 0.996 | 0.954 |
| 3,125 | 11,041 | 1.009 | 0.070 (0.010) | 0.921 | 0.834 | 0.945 | 0.865 |
| 1,905 | 5,499 | 1.018 | 0.087 (0.020) | 1.058 | 0.886 | 1.044 | 0.899 |
| 1,161 | 2,758 | 1.019 | 0.109 (0.039) | 1.154 | 1.080 | 1.042 | 1.003 |
| 708 | 1,384 | 1.009 | 0.165 (0.078) | 1.268 | 0.944 | 1.096 | 0.925 |

| exponent in Q | L | L after removal of the polar component | seed spread of L (5.2) |
|---|---|---|---|
| kappa = 0.4, 1e7 | -0.067 | **-0.0074** | [-0.0099, +0.0250] |
| kappa = 0.6, 1e7 | -0.030 | **+0.0047** | [-0.0025, +0.0162] |
| kappa = 0.4, 1e6 | -0.087 | **-0.047** | [-0.0768, +0.0315] |
| kappa = 0.6, 1e6 | -0.008 | +0.029 | [-0.0426, +0.0259] |

(The L column here uses the exact baseline; 5.2 uses three Monte-Carlo draws, hence -0.067 against -0.0605.)

* The polar-aligned component holds 16.5% of the energy of T(c) at Q = 708 and 2.8% at Q = 37,150 (exponent of the
  share above its null: -0.28 at 1e7, -0.43 at 1e6). In a level sum the weight is mu(c) beta_c, and by Lemma L
  mu(c) beta_c e(c) = alpha(c)^2 G(c) conj chi_c(y0) N^(-1/3): Moebius-free, with the angular factor alpha^2. With few
  conductors per (level, class) cell the polar energy adds to the level sum; with many it cancels by angular
  equidistribution of alpha^2. This moves L from above 1 to below 1 along the path.
* After removal the exponent of L is inside the seed spread in all four cases. **The "saving" of 5.2 is the decay
  of the polar term, which is Theorem P and is not a saving of the non-polar remainder.** The pre-registered rule
  did not anticipate a coherent term that decays; its outcome for (b) is reported as fired and explained, not as a
  saving.
* The total energy of T(c) is 1.007 to 1.019 of the random-row expectation at every path point: the conductor sums
  are at the random level (Z8), now measured per conductor at 1e7.
* What remains after removal: L between 0.83 and 0.99 for Q >= 1,905 (mean 0.90 at kappa = 0.4), i.e. a constant
  deficit of about 5 to 10% against random rows, no trend. Not explained; see weakest step 2.

### 6.2 Form (a): the excess of L is the first moment of the theta coefficients

`dem_a.py` subtracts from rho-hat_sigma(u; n) its mean over the cell (octave of N(n), n mod 4, n mod 9), per half.
The class mean holds 15.8% (u = lambda), 14.2% (u = 1), 6.4% (u = y0) of sum abs(rho-hat)^2 at 1e7 (null 1.5%).

| case | L raw along the path (large M first) | L after mean removal | exponent after removal | seeds |
|---|---|---|---|---|
| theta = 1/3, u = lambda, 1e7 | 1.293 1.280 1.160 1.158 | 0.915 0.958 0.948 0.909 | +0.0041 | [-0.0055, +0.0076] |
| theta = 1/3, u = lambda, 1e6 | 1.135 1.114 1.115 1.102 | 0.962 0.964 0.981 0.952 | +0.0018 | [-0.0263, +0.0098] |
| theta = 2/9, u = lambda, 1e7 | 1.052 1.056 1.056 1.019 1.041 0.998 | 0.991 0.996 0.994 0.948 1.011 0.979 | +0.0026 | [-0.0097, +0.0086] |
| theta = 2/9, u = lambda, 1e6 | 1.008 1.009 1.014 1.015 1.018 0.997 | 0.987 0.986 0.990 0.975 0.999 1.001 | -0.0038 | [-0.0057, +0.0093] |

* The excess is removed by the mean removal, and the first-moment positive control falls from r2 = 1.1 to 2.3 to
  0.66 to 0.97. The inner s-sum of the dual form is larger than random because the theta coefficients have a
  non-zero class mean (Theorem A of sextic-theta-proof; in hypothesis (V) this is the constant-term contribution).
  It is the opposite of a cancellation in the s-sum.
* r2 after mean removal: exponents -0.0006, -0.0045 (1e7), +0.0032, -0.0109 (1e6), inside the seeds except the
  last, which is below the seed minimum (-0.0101) by 0.001.
* Moebius-free variant (`nomu_dem_*.log`), r2 along the path, large M first, theta = 2/9, 1e7: raw 0.844 0.855 0.934
  0.978 1.001 0.937; after mean removal 0.959 0.975 1.035 1.052 1.068 1.222. The last points (smallest M, cells of
  a few rows) are distorted by the removal, so the exponent after removal (-0.06) is not a measurement of a trend.
* After removal L is 0.91 to 0.98 at theta = 1/3: a deficit of 2 to 9% without trend. The mean removal itself
  induces negative correlations inside a cell (the positive control falls below 1), so this deficit is not
  separated from an artefact of the removal.
* **One item is not explained.** At the non-decision shift u = 1, theta = 1/3, the exponent of L is -0.051 (1e6)
  and -0.043 (1e7) before, -0.035 and -0.033 after mean removal, against seed spreads [-0.009, +0.008] and
  [-0.018, +0.013]. It is outside the seeds at both sizes and below -0.02. It rests on four path points (139 to
  559 conductors), L stays between 0.92 and 1.16, and the raw values are above 1 at every point at 1e7 (1.04 to
  1.16), so it is an excess that shrinks, not a level below random that falls. The two table sizes use the same
  index pairs (c, s) and disjoint estimator moduli. It is not a decision case and is not counted as a saving.

### 6.3 Energy of the full signed sum (`full_energy.py`) [MEASURED]

sum_cells abs(sum_c w_c T(c))^2 over the whole octave against the exact random-phase expectation, mean over path
points with its standard error:

| rows | w = beta (TRO6 row; 1,296 cells), 1e7 | w = mu beta (Moebius-free; 144 cells), 1e7 | same, 1e6 |
|---|---|---|---|
| theta estimator | 0.980 +- 0.019 | 0.818 +- 0.038 | 0.976 +- 0.022; 0.925 +- 0.039 |
| Liouville, THIN | 0.996, 0.994 | 0.943, 0.938 | 0.993, 0.993; 1.048, 0.975 |
| random multiplicative (4), random phase (4) | 0.987 to 1.012 | 0.971 to 1.082 | 0.981 to 1.023; 0.931 to 1.075 |

The TRO6 row is at the random level at both sizes. For the Moebius-free weight the theta rows are at 0.82 at 1e7,
about 4 standard errors below 1 and below all eleven control rows; at 1e6 the value 0.925 is inside the controls.
One size, 144 cells; no trend in Q (exponent -0.007). Recorded as an observation, not a result.

## 7. Controls

| control | where it enters | outcome | structural reason |
|---|---|---|---|
| random signs on the outer variable | r2 | 0.96 to 1.05 in every case; the theta rows have the same exponent | disjoint (a) or sign-randomised (b) outer terms: cross terms vanish in mean |
| random-phase rows, sign-twisted primes (seeded) | rows | define the seed spread of 5.1, 5.2 | Lemmas A and B hold for any row values |
| Liouville twist | rows | (b): r2 exponents -0.02 to +0.05, above the seed maximum at kappa = 0.4, 1e7 (+0.041 against +0.026). (a): r2 exponents -0.02 to -0.05 (5.1) | on squarefree n the twist is mu(c) mu(s): it deletes the sign that form (a) is meant to keep, so in (a) it is a change of the form, not only of the rows |
| THIN (b = 0.9) | rows | inside the seed spread or within 0.001 of it in every decision case | completely multiplicative sign; at these sizes 16% of the primes are flipped, so the set is not thin |
| theta^w | not available for Kubota rows; cubic theta rows as stand-in | r2 exponents -0.08 to +0.05; L exponents -0.03 to +0.05 against one random-phase draw of the cubic rows | cubic theta has Hecke structure (Patterson); no saving in either form |
| positive controls | (a) plain weight; (b) planted aligned direction | detected, exponents +0.15 to +0.26 | coherent first moment; planted component |
| Davenport-Heilbronn, backward heat, unimodular twist, zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer operator | not engaged | — | no statement about a target or its zeros is made; Lemmas A and B are identities for arbitrary rows and weights (control-blind by construction) |

The decision statistics do not separate the theta rows from the seeded controls. R3 is not met and not claimed.

## 8. Verdict

* PROVED + EXACT: Lemma A (A1 to A3) and Lemma B (B1 to B4). Consequence: the dual form on squarefree n, the
  Type I level average with its sign, and the trilinear Gauss-sum form are one finite trilinear sum in
  (Kubota modulus k, conductor c, smooth variable), bracketed in three ways. With c9 Lemma I and e2 Lemma S this
  covers all four sub-items of lead 17.
* Structural answer for (b): no Kloosterman sum; the complete sums in the level are Gauss sums already evaluated;
  the sign-kept average is the original form with weight mu beta M_A (PROVED), and the function-field saving has
  no counterpart (ARGUED).
* MEASURED: no saving in the signed outer sum of either form at 1e6 or 1e7 (5.1). The level statistic L fired the
  rule for (b), kappa = 0.4; the cause is the polar term (6.1): after its removal the exponents are -0.047 (1e6)
  and -0.0074 (1e7), inside the seed spread. The excess of L in (a) is the first moment of theta_6 (6.2).
  Conductor sums are at the random level per conductor (energy ratio 1.007 to 1.019).
* Not explained: the L exponent at u = 1, theta = 1/3 (6.2); the constant deficits of 2 to 10% after removal of the
  polar or mean component; the value 0.82 for the Moebius-free full sum at 1e7 (6.3).
* **Proposal: close lead 17** (TRO6 through the signed c-sum) under the stopping rule of STRATEGY section 3, with
  three records: e2 (Lemma S), c9 (Lemma I, Proposition E), this lane (Lemmas A, B: all listed forms are the same
  trilinear sum; no saving measured in the two remaining forms). Reopen only with an input that acts on the
  trilinear sum with the phases gamma_1(k) kept and that is not a zero-free statement for the twist family
  L(s, nu psi_k).
* No eta > 0. No abscissa. Nothing about zeros of zeta.

### Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 (all primes together, multiplicativity essential) | false | Lemmas A and B hold for arbitrary rows; the multiplicative input they use is that of the sextic symbol and Lemma L, not of the target; the measurement gives the theta rows the exponent of non-multiplicative random-phase rows |
| R2 (height-uniform, every window) | false | no statement about a target; family mean squares at Q <= 37,150, M <= 250,000 |
| R3 (fails for every control for a structural reason) | false | control-blind by construction (section 7) |
| R4 (reaches the critical line) | false | TRO6 concerns the abscissa 7/8; nothing here moves it |

## 9. Three weakest steps

1. **The estimator and the sizes.** rho-hat is a finite Kubota sum over moduli in (X/4, X]; its two halves
   correlate at 0.28 to 0.49 (1e6) and 0.49 to 0.69 (1e7) on squarefree indices, so a large part of it is not
   theta_6. In the toy geometry the dual s-sum has at most 5 terms at M = 250,000 and the Type I range
   N(a) <= Q^0.4 has 4 to 18 levels; theta = 1/3 has 4 path points. Exponent differences are resolved to about 0.01
   in (a) and 0.01 to 0.03 in (b) (seed standard deviations 0.005 to 0.028). A saving of the size TRO6 needs
   (Q^(-eta/80)) is below this resolution: the test can show a coherent term or a large saving, and it cannot
   exclude eta > 0. Toy geometry R = Q^1.4, shorthand row without the second G, sharp cut-offs, primary rows only.
2. **The diagnosis of 6.1 was made after the rule fired.** The polar removal (cells, amplitude law N^(-1/3), one
   coefficient per cell) was chosen after seeing the result; only the baseline and the surrogate bias correction
   are independent of the data. At 1e6 the exponent after removal (-0.047) is inside a wide seed spread and is
   itself below -0.02. The constant deficits after removal (L = 0.83 to 0.99) are unexplained, and the mechanism
   "polar energy adds in small cells and cancels in large ones" was not confirmed by the per-level table
   (`level_diag_1e7.log`: no monotone dependence on the cell size within the noise of 5%).
3. **Family mean squares and a six-seed null.** All statistics sum over class cells; TRO6 is a supremum over
   targets, and zero-carrying targets are not sampled (as in Z8). The rule compares with six seeded rows; "outside
   the seed spread" has a chance level of roughly 1/7 per case and about twenty cases were looked at, so the
   unexplained item at u = 1 (6.2) is within what multiplicity allows, and equally cannot be dismissed. Path
   points share rows or indices; the two table sizes share the index pairs. The structural items 3 and 4 of
   section 3 and the reading of the circularity check are ARGUED, not proved.

## 10. Reproduction and files

All under `tmp/research-2026-11-16/push/c10-tro6-dual-squarefree-type1-level/`. Python:
`.venv-arb/bin/python` (repo root); local runs through `scripts/memcap.sh 8`.

| file | content | run |
|---|---|---|
| `PREREG.md` | pre-registration and its amendment | written before the first run |
| `lemma_check.py`, `.log` | finite checks of Lemmas L, A, B | local, 1 min |
| `acc10.py` | accumulations, modes a and b | `acc10.py a data/sf_1e7.npz data/a_1e7.npz 250000 4` (local, 2,175 s; log `acc_a_1e7_local.log`); `acc10.py b data/sf_1e7.npz data/b_1e7.npz 10 4` (server, 517 s); 1e6: `a ... 240000 4`, `b ... 7 4` |
| `ana10.py`, `ana_a_*.json/.log`, `ana_b_*.json/.log` | statistics, controls, fits, decision (seed 20261118) | local; `ana_b_1e7` on the server |
| `tcond.py`, `tcond_ana.py`, `tcond_ana_*.json/.log` | per-conductor sums, polar share, polar removal | 1e6 local; 1e7 server (712 s + 2 min) |
| `dem_a.py`, `dem_a_*.json/.log` | form (a) after mean removal | local |
| `nomu_dem.py` and logs | Moebius-free variant of form (a) before and after mean removal | local |
| `level_diag.py`, `full_energy.py` and logs | per-level energies; energy of the full signed sum (uses c9's `acc_*.npz` for the beta weights) | local |
| `*_firstpass.*`, `data/a_1e6_M6e4.npz` | first 1e6 pass with M = 60,000 (too short for theta = 1/3; superseded, kept) | local |
| `logs/` | server logs of the four units | — |
| `data/` (ignored) | accumulations (0.7 GB); tables are links to `tmp/sextic/data` | — |

Server units (rhrun only): `rh-c10-accb-1e7-1119062201` (8 GB, 4 cores), `rh-c10-anab-1e7-1119063103` (6 GB, 1 core),
`rh-c10-tcond-1e7-1119063607` (8 GB, 4 cores), `rh-c10-tana-1e7-1119064849` (6 GB, 1 core). All four exited by
themselves and are inactive; no unit of this lane is left. The table was copied on the server from
`~/rh-push/c5-thin-propd-dichotomy/data/sf_1e7.npz` (read only; md5 equal to the local file) and removed again
together with this lane's outputs; `~/rh-push/c10-tro6-dual-squarefree-type1-level/` now holds code and two JSON
files (316 KB).
