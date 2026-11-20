# e2-theta-dual-mseries-fe: a second reflection in the row variable m of the theta-dual

Internal working note, 2026-11-18. Slug `e2-theta-dual-mseries-fe`. Nothing committed, pushed or posted. Not refereed.
All runs local, single process, through `scripts/memcap.sh 8`, python `.venv-arb/bin/python`; the compute server was
not used. The large data modules were not imported; the only data read are the exact tables `tmp/sextic/data/sf_1e7.npz`.

No statement about zeros of zeta is proved here. 7/8 (unrefereed sources) stands; RH open. NO QED.

Labels: PROVED / PROVED-rel MS (relative to the 7/8 manuscript `~/lean-deps/qrh-verify/paper.txt`) / PROVED-model
(exact statement about the affine model, checked in the logs) / CLASSICAL / CITED / MEASURED / ARGUED / OPEN.

**Verdict: precise obstruction. The combination is closed.**

1. The m-series of the theta-dual (MS (5.3)) is identified: on squarefree m it is an alpha^(-2)-twisted sextic
   Kubota series in the modulus m at index 4^5 s mu^3 (Lemma 1, PROVED-rel MS, identity checked exactly on 2.3 to
   2.6 million moduli). So a reflection in m exists in CLASSICAL form (Kubota), and it is the missing generator of
   row N14.
2. The decisive numerical test does not decide the sextic case. The calibration passes (cubic series: smoothed
   sums fall to 2-9% of the random level beyond the conductor, at four indices), the random-phase control fails
   as required, and every sextic series, including the base Kubota series whose functional equation is a theorem,
   is indistinguishable from random at norm <= 1e7. The test has no power at order 6 on these tables. Nothing is
   refuted and nothing is confirmed numerically.
3. With the reflection granted, the model hull is computed. The new reflection does move x (the theta reflection
   does not): x' = x + (2t + v - 1/2) = 3x + z - 3/2. The group becomes infinite (hyperbolic rank-3 Weyl group).
   Every chamber it adds lies in x >= 3/2 (Lemma 3, PROVED-model for all group elements). The hull abscissa is
   1 with no input and theta with input ZF(theta): output = input, as in `n1-tube-hull`.
4. Reason in two lines. (a) The m-reflection lowers x only from points with 2x + z < 3/2, and no holomorphy is
   known there for x near 7/8. (b) The reflected chamber is separated from the unreflected one by the poles of the
   normalising Hecke L-factor of the Kubota series (zeros of an L-function of F in the variable 6v - 2), so across
   it only meromorphy is available; a hull of a meromorphy tube says nothing about the polar set, and the zeros of
   the target are polar.

The reflection is blind to the target: the same m-series occurs for every eta (section 6).

---

## 0. Plan

Combination under test: Theorem D (probe = aggregated theta-row form) x cubic R2 reflection (Poisson dual of the
cubic Moebius family = stripped alpha-twisted 6-fold Kubota series, conductor exponent 4) x row N14 (the Bochner
hull returns its input unless the functional equation of the theta-dual m-series is derived) x the polar law.

Lanes read and not repeated: `n1-tube-hull` (Theorem T, 48-element group, 8 pieces, hull = input),
`r2-tro6-polar-theorem` (Theorem P, pole at 5/6), `tro6-period` (Lemma L, the form as Moebius-weighted periods,
involution), `tro6-spectral` (polar law measured, no single-cover Rankin-Selberg integral).

What is new here: the identification of the m-series left open in `n1-tube-hull` section 5; a matrix-free
dual-length test with calibration and control; the K-type test; the reflection matrix, the infinite group and
the hull with the new generator.

Order of work: first decisive test (section 2), then the first lemma in full (section 1 is stated first because
the test needs its objects), then the model hull (sections 3-4), controls (section 6).

---

## 1. First lemma: the m-series, its gamma factor candidates, the group

Notation of `sextic-theta-proof.md` section 1 and of the tables: chi_n sextic symbol, gamma_j(n) normalised Gauss
sum of chi_n^j, gt_1(y, n) = conj(chi_n(y)) gamma_1(n), alpha(n) = n/|n|, G(n) = conj(chi_n(4)) gamma_3(n).

### 1.1 Lemma 1 [PROVED-rel MS Prop. 5.1, (5.3); EXACT checks in `lemma1.log`]

In the theta-row form the row at m is T(t + 1/2, nu chi_.(m)), so in MS Prop. 5.1 the moving primes are the primes
of m with exponents j_p = v_p(m) mod 6. For squarefree m prime to 6, to L, to the Gauss modulus s and to the dual
index mu, all p | m are active with j_p = 1, c = c_F m, and:

* column factor: prod_p B_p(lambda^4 mu) = chi_m(lambda^4 mu)^(-3), a quadratic symbol of mu;
* scalar (5.3): zeta = (fixed) * conj(alpha(m))^2 * prod_p chi_p(sigma_p)^(-2) omega_{p,1},
  omega_{p,1} = tau^-_{p,1} tau^+_{p,3} chi_p(eps_p)^(-3), sigma_p = lambda^2 c/p, eps_p = -lambda.

(a) Local to global. prod_{p|m} gamma_1(p) gamma_3(p) chi_p(m/p)^(-2) = gamma_1(m) gamma_3(m).
    Checked on 4500 table moduli with 2 to 4 prime factors: max error 2.2e-15.
(b) With the low-side Gauss sum gt(-m, s) = conj(chi_s(-m)) gamma_1(s) and sextic reciprocity,

      gamma_1(m) gamma_3(m) conj(chi_m(s)) chi_m(mu)^3 = G(m) gt_1(4^5 s mu^3, m),

    G a function of m mod 4 (12 classes, values 12th roots of unity). Checked for five pairs (s, mu) on all
    coprime moduli of the table (2.29 to 2.62 million each): max error 1.7e-15.

**Statement.** In each sector (class of m modulo the fixed modulus M^2, class of h_0), the m-dependence of the
theta-dual of the row form is

    C(s, mu; class of m) * conj(alpha(m))^2 * gt_1(y, m),    y = 4^5 s mu^3 (up to S-units),

with C of modulus bounded by a constant and depending on m only through finitely many classes. The m-series

    M_{s,mu}(v) = sum_{m squarefree} S(m) conj(alpha(m))^2 gt_1(4^5 s mu^3, m) N(m)^(-v)

is a stripped sextic Kubota series in the modulus m, at index class 4^5 s mu^3, twisted by the infinity type
alpha^(-2) and finite S-data. The quadratic and sextic Gauss sums of MS (5.3) combine into one sextic Gauss sum;
the dual index mu enters through its cube, the Gauss modulus s to the first power.

Not covered: m with square factors, primes shared between m and s mu, and the finitely many terms and sectors of
Prop. 5.1 (weakest step 1).

### 1.2 Functional equation and gamma factor candidates [CITED form; not derived]

Kubota's functional equation for the 6-fold series (form recorded in `cubic-r2-conductor-verdict.md` section 2.3,
which also records that the published explicit version assumes mu_12 in the field, false for Q(omega)):

    Lambda(r, u) = G_6(u) L_norm(6u - 2) Z(r; u),   Lambda(r, u) = N(r)^(1/2 - u) * (finite S-data matrix) * Lambda~(r, 1 - u).

* Candidate A (K-type 2, the reading of (5.3)): G(1/2 + w) proportional to prod_{j=1..5} Gamma(w + j/6 + 1),
  normalising factor L(6u - 2, psi) with psi the Hecke character alpha^(-12) times S-data, no pole. The shift by
  |l|/2 is the one visible at order 3 in MS Prop. 5.1 (Gamma(1 + t +- 1/6) for the alpha^(-1)-twisted cubic series).
* Candidate B (K-type 0, if another factor of alpha(m) on the low side cancels the twist; not traced):
  G(1/2 + w) proportional to prod_{j=1..5} Gamma(w + j/6), normalising factor zeta_F(6u - 2), one pole at
  u = 2/3 with residue proportional to a complete sextic theta coefficient at index 4^5 s mu^3.
* Index factor in both: N(s) N(mu)^3 to the power 1/2 - u for the main term. For the stripped series the local
  reflection table of the verdict note applies: at a prime of mu (class e = 3) main exponent 3 and a secondary
  piece of exponent 5 with weight N(p)^(-1/2); at a prime of s (class 1) main exponent 1, secondary exponent 5.
* Degree: five Gamma factors over F. The dual window decays like exp(-5 x^(1/5)).

### 1.3 Compatibility with the pole at 5/6 and with the exponent 0.683

* The pole at 5/6 (Theorem P) belongs to the low-chart m-series sum_m rho(-e_0 m) chi_c(m) N(m)^(-w), where m is an
  index. In centred low coordinates (T, S, V) it is the intersection of the Kubota divisor S = 1/6 with the
  divisor S + V = 1/2 (the image of the numerator pole w = 1): V = 1/3, v = 5/6. Its reflection is Poisson (Pm).
* The exponent 0.683 [0.669, 0.697] is the first moment of gamma_1 over moduli: it is the pole u = 2/3 of the
  series of Lemma 1 at (s, mu) = (1, 1) in K-type 0. It belongs to the theta-dual chart, where m is a modulus.
* The two poles are poles of different series in different charts. The new reflection g (section 3) sends the
  divisors S = 1/6 and S + V = 1/2 to S + 2T + V = 1/6 and S + 10T + 6V = 1/2; neither meets the low, high or
  theta-dual absolute region [PROVED-model, by hand: the two forms exceed 1 and 4 there]. There is no incompatibility.
* K-type test [MEASURED, `lemma1.log` (c)]. WLS constant of sum_{N(n) <= X} alpha(n)^(-l) gamma_1(n) at exponent
  2/3, summed as z^2 over the 12 classes mod 4 (random-phase null: mean 12.4, max 21.8 over 20 draws):
  l = 0: 251.3; l = +-1 ... +-6: between 2.2 and 20.3. The pole at 2/3 is present only in K-type 0. With the
  twist conj(alpha)^2 of (5.3) the m-series has no X^(2/3) term in the table. Same test at order 3
  (exponent 5/6): l = 0: 10752; l != 0: 0.3 to 2.4, below the null, which is the cancellation a functional
  equation of small conductor produces.

So a second reflection in m is compatible with both facts. In candidate A it has no polar term at all.

---

## 2. First decisive test: dual lengths on the exact tables [MEASURED]

Tables: all 2,822,619 squarefree primary moduli prime to 6 with norm <= 1e7, exact gamma_1, gamma_2, gamma_3.

### 2.1 What can be tested

A two-sided comparison (smoothed sum at length X against the dual sum at length Q/X) needs the S-data matrix of
the functional equation, which is not written out in any source read (section 1.2). The test used is the
matrix-free consequence: with a functional equation of conductor Q, a smoothed sum of length X is a dual sum of
length Q/X, so it falls far below the random level once X >> Q. Without one it stays at the random level.

Statistic: F(X) = sum_n a(n) N(n)^(-1/2) V(N(n)/X), z(X) = |F(X)| / sig(X), sig(X)^2 = sum |a|^2 N^(-1) V^2
(the exact variance under random phases). Windows:

* `drop.py`, `drop2.py`: V = (x d/dx + w_0) exp(-(ln x)^2/(2 s^2)), s = 0.5, zero of the Mellin transform at the
  Kubota pole w_0 = 1/n; `drop2.py` adds the completion by zeta_F(n u - n/2 + 1) (sum over ideals d of
  N(d)^(-1) F(X/N(d)^n)), which removes the poles of the series at the zeros of zeta_F.
* `drop3.py`: gamma-matched window, V = inverse Mellin transform of prod_{j=1..n-1} Gamma(w + j/n + |l|/2)
  (times (w_0 - w) for l = 0). With the candidate equation the dual window has the same decay.

Series: cubic a(n) = conj(chi_n(y))^2 gamma_2(n) (Patterson calibration), sextic a(n) = conj(chi_n(y)) gamma_1(n),
each with K-type l in {0, +-1} and the sextic also with l = +-2 (l = +2 is the m-series of Lemma 1); random unit
phases on the same support. Indices ("conductors"): y = 1 and primes of norm 7, 13, 31.

Summary number: R = rms of z over the 7 grid points with 3e4 <= X <= 3e5 (`post3.py`). Null: 60 random-phase
series per window; R quantiles 2% / 50% / 90% about 0.23-0.41 / 0.83-0.92 / 1.3-1.6; smallest of 60: 0.156 to 0.349.

### 2.2 Results (`drop3.log`, `post3.log`)

| series | y = 1 | N(y) = 7 | 13 | 31 | null draws below |
|---|---|---|---|---|---|
| cubic, l = +1 | R = 0.022 | 0.046 | 0.076 | 0.042 | 0 of 60 in all four |
| cubic, l = -1 | 0.031 | 0.072 | 0.087 | 0.054 | 0 of 60 in all four |
| cubic, l = 0 (pole removed) | 0.065 | 0.369 | 0.254 | 0.260 | 0, 1, 0, 0 of 60 |
| sextic, l = 0 (pole removed) | 0.407 | 0.686 | 0.550 | 0.916 | 1, 13, 6, 33 of 60 |
| sextic, l = +1 | 0.418 | 0.383 | 0.993 | 0.596 | 10, 8, 41, 15 |
| sextic, l = -1 | 0.820 | 0.542 | 0.176 | 0.800 | 30, 15, 1, 29 |
| sextic, l = +2 (m-series) | 0.153 | 0.965 | 0.642 | 0.657 | 0, 34, 21, 22 |
| sextic, l = -2 | 0.803 | 1.921 | 0.592 | 0.808 | 26, 58, 19, 27 |

* **Calibration passes.** Cubic series with l = +-1: z falls from about 1 to 0.02-0.09 and stays there. Onset
  (first X after which z < 0.2): 15 to 144 at y = 1; 972 to 3058 at N(y) = 7; 3058 to 4481 at 13; 4481 to 14104
  at 31. The onset moves out with N(y), as a conductor does; the exponent is not determined (the stripped series
  has a main piece of exponent 1 and a secondary piece of exponent 2).
* Cubic l = 0 at y != 1: a plateau of size 0.37, 0.25, 0.26, close to N(y)^(-1/2) = 0.378, 0.277, 0.180 at the
  first two indices. Not explained here.
* **Control fails the test, as required.** Random-phase rows: R is at the null level; no draw of 60 goes below
  0.156 in any window. (Single draws can sit at z about 0.05-0.1 over a decade of X: the windows are wide and
  the values at neighbouring X are strongly correlated.)
* **Sextic: no drop.** 19 of 20 sextic series are inside the null range. One (l = +2, y = 1) is just below the
  smallest of 60 null draws (0.153 against 0.157); with 20 series examined this is not significant, and its
  three companions at y = 7, 13, 31 are at the null median. The log-Gaussian windows (`drop_s05.log`,
  `drop2_s05.log`, X up to 1.35e6, with and without the zeta completion) give z of order 1 with isolated dips and no
  sustained drop, for all sextic series and all 12 class-restricted base series.

### 2.3 Reading

* The base series (y = 1, l = 0) is the Kubota series itself, whose functional equation is CLASSICAL. It shows no
  drop either. So the test has no power at order 6 at norm 1e7: absence of a drop is what the candidate equation
  predicts when the conductor in window units exceeds the usable X. This agrees with
  `cubic-r2-conductor-derivation-2.md` (no drop to 6e5 for the 6-fold base series).
* Why: five Gamma factors. The gamma-matched window decays like exp(-5 x^(1/5)); a relative truncation of 1e-5 at
  the table edge limits X to about 3e5, and narrower windows raise the effective conductor by the tenth power
  of the frequency they contain.
* By the stated criterion (a mismatch above table noise refutes): there is no mismatch to report, because the
  one-sided test makes no prediction below the conductor. The candidate equation is **not refuted and not
  confirmed** by the tables. What the tables do confirm is Lemma 1 (exact) and the K-type pattern of the pole
  (section 1.3).
* The functional equation of the m-series therefore rests on Lemma 1 plus Kubota's theorem (CITED form), not on
  this test. A decisive numerical test needs either the S-data matrix (two-sided test, feasible at norm 1e7:
  both lengths can be placed inside the table) or tables several orders of magnitude longer.

The test did not kill the combination. The model hull was therefore computed with the reflection granted.

---

## 3. The reflection matrix and the group [PROVED-model, `group.log`, `group2.log`]

Centred low coordinates P = (T, S, V) (exponents of q_A, q_s, q_m minus centres, as in `n1-tube-hull` 2.2);
x - 1/2 = X = T + V, w - 1/2 = S + V, z - 1/2 = -V.

| name | map | source |
|---|---|---|
| K6 | S -> -S, V -> V + S | Kubota series in s at index m |
| Th3 | T -> -T, V -> V + 2T | MS Prop. 5.1 |
| Pm | V -> -V, T -> T + V, S -> S + V | Poisson in m |
| **K6m** | V -> -V, S -> S + V, T -> T + 3V (in the theta-dual chart) | Lemma 1 + Kubota: index 4^5 s mu^3 |

As a map of P: g = Th3 K6m Th3 = (T, S, V) -> (-5T - 3V, S + 2T + V, 8T + 5V), g^2 = 1.

* **X o g = 3T + 2V = X + (2T + V).** In high coordinates x' = 3x + z - 3/2. Unlike Th3 (Fact A of
  `n1-tube-hull`: X o Th3 = X), the m-reflection moves x. It lowers x exactly when 2x + z < 3/2.
* K6m is not in the 48-element group <K6, Th3, Pm>. Orders: K6m K6 = 3, K6 Th3 = 2, Th3 K6m infinite (the T-V
  block has trace 4). <K6, Th3, Pm, K6m> exceeds 23,000 elements at the enumeration cap.
* W_D = <K6, Th3, g> (the reflections available in the low and theta-dual charts) is the Weyl group of the
  generalised Cartan matrix on (S, V, T)

      [  2  -1   0 ]
      [ -1   2  -3 ]
      [  0  -2   2 ]

  (determinant -6: indefinite type). New elements by word length 0..12: 1, 3, 5, 7, 9, 12, 16, 21, 28, 37, 49,
  65, 86. The product of the conductor exponents 3 (mu^3 in the index of the m-series) and 2 (q_m^2 in the dual
  length of the theta row) is 6 > 4; that is the reason the group is infinite.

**Lemma 3 [PROVED-model; CLASSICAL Kac-Moody fact + exact check on 339 elements].** For every w in W_D the
functional X o w - X is a nonnegative integer combination of T, S, V. Hence every chamber w(R_+),
R_+ = {T, S, V > 1/2}, lies in x >= 3/2.
Proof. T, S, V are the simple roots as functionals. In the coordinates of the theta-dual chart, where the three
reflections are simple, X = T + V and X o K6 = X + S, X o K6m = X + V, X o Th3 = X: X is antidominant. For antidominant lambda, w lambda - lambda lies in the positive root cone. QED
Check: 0 of 339 elements (word length <= 12) have a negative coefficient; smallest inf x over the pieces is 3/2
(2 pieces), then 2 (4 pieces), 3 (6 pieces).

---

## 4. Hull and abscissa (model value) [PROVED-model; the piece rule is ARGUED]

Pieces: all chambers w(R_+), w in W_D (infinitely many, replacing the 2 theta pieces of `n1-tube-hull`), and the
six pieces <K6, Pm>(R_+), with the high chart started at x > theta when ZF(theta) is put in.

| input theta | 1 | 7/8 | 0.874886647 | 13/15 | 5/6 | 1/2 |
|---|---|---|---|---|---|---|
| inf x, W_D chambers | 3/2 | 3/2 | 3/2 | 3/2 | 3/2 | 3/2 |
| inf x, <K6, Pm> absolute pieces | 1 | 1 | 1 | 1 | 1 | 1 |
| inf x, high chart with input | 1 | 7/8 | 0.874886647 | 13/15 | 5/6 | 1/2 |
| hull x_min | 1 | 7/8 | 0.874886647 | 13/15 | 5/6 | 1/2 |

Every piece lies in the half-space x >= min(theta, 1), so the convex hull does too. Output = input in every
column. With no input the value is 1. No value below 0.874886647 is produced.

Why the new generator does not help, although it moves x:

1. **Direction.** g lowers x only from a point with 2x + z < 3/2 (V_D = 2T + V < 0 in the dual chart). On the low
   region 2T + V > 3/2; on the high region 2x + z - 3/2 > 3/2 (and > 2 theta - 1/2 with input); on the theta-dual
   region > 1/2. The working point of the 7/8 method (x near 7/8, residue at z = 1/6) has 2x + z = 1.92: there g
   raises x to about 1.29. To reach a target x' < 7/8 with z' = 1/6 one needs holomorphy at
   x = 3x' + z' - 3/2 near 1.28 and z near -1.46; that point is in no known region (the K6 image of the high region has
   z < 0 only together with x > 2; other composites were not examined).
2. **Polar wall.** The Kubota series of Lemma 1 has poles at the zeros of its normalising factor
   L_norm(6v - 2) (1/3 < Re v < 1/2), infinitely many hyperplanes V_D = const [CITED form of the normalisation;
   the residues are not shown to be nonzero]. So the chamber K6m(R_+) is joined to R_+ only by meromorphic
   continuation. By Levi's theorem the hull of a meromorphy tube is a meromorphy tube [CLASSICAL], with no
   control of the polar set. Theorem T of `n1-tube-hull` then gives nothing: it needs holomorphy.
   The same holds for K6 (normalising factor zeta_F(6 sigma_s - 2)); see weakest step 3.
3. **Estimate-supplied regions** (the part of row N14 left open). A power bound gives a convex base; its images
   under g have x' = x + (2x + z - 3/2). For the bases of the 7/8 method (x >= theta, z >= 1/6 on the residue
   side) this is an increase. A base with 2x + z < 3/2 and x near theta would have to be supplied first.
   Not computed with the manuscript's actual low-estimate region [OPEN, same gap as `n1-tube-hull` step 3].

Row N14 can be updated: the functional equation of the theta-dual m-series is identified (Lemma 1, CLASSICAL
form), and in the model it enlarges the tube only at x >= 3/2.

---

## 5. Pivot

None taken. The strongest adjacent item is a calibration task, not an attack: derive the S-data of the 6-fold
Kubota functional equation over Q(omega) (the mu_12 gap), after which the two-sided dual-length test of
section 2.1 is feasible on the existing tables.

---

## 6. Controls

| control | outcome | step |
|---|---|---|
| random-phase rows | Fail the dual-length test: R at the null level, 0 of 60 draws below 0.156 (section 2.2). | required failure observed |
| cubic series (Patterson) | Pass: R = 0.02-0.09 at four indices for l = +-1; onset moves out with N(y). | calibration |
| Davenport-Heilbronn | Lemma 1 and K6m contain no target. The scalar (5.3) comes from the cubic row gamma_2(n) conj(alpha(n)) Psi(n); eta enters only through the finite-ray character Psi_0 (S-data). The same m-series and the same reflection occur for every eta and for a DH combination of two eta. The target enters at Poisson in m and the absorption gamma_2 gamma_1 -> mu (high chart), which g does not touch. So the reflection does not separate zeta from DH; consistent with output = input. | none: the new step is target-blind |
| sign twist (Euler product, no FE) | Same as `n1-tube-hull`: no reflection of the reciprocal variable is used; identical to zeta. | none |
| zeta(s+a) zeta(s-a) | Input abscissa shifts by a; the hull follows the input (table of section 4 is linear in theta). | LP |
| unimodular twist, T-NR, Beurling, theta^w, phase-rotated transfer operator, backward heat | Not run. No family Dirichlet series in these variables was set up for them; the statement tested here contains no zeros, so there is nothing for them to break. | not formulable |

Three requirements. All primes together: the series contain all primes, but the reflection uses only Gauss-sum
algebra. Uniform in height: tube statements are. Fails for the controls for a structural reason: no, the new
step is the same for every target. It is therefore not an attack on its own.

---

## 7. Three weakest steps

1. **Lemma 1 is a reading of (5.3) on squarefree m prime to 6 L s mu.** The K-type bookkeeping (that
   conj(alpha(c))^2 is the only factor of alpha(m) in the theta-dual) was not traced through the manuscript's low
   side; candidates A and B differ by it. Square factors of m, primes shared with s mu, the finitely many terms
   of Prop. 5.1 and the sector constants were not treated. The functional equation is used in CITED form with
   the mu_12 gap; its S-data, and the nonvanishing of the residues at the zeros of the normalising factor, were
   not derived.
2. **The numerical test is one-sided and has no power at order 6.** It confirms the method on the cubic series
   and the failure of random rows; it says nothing about the sextic equation. The two-sided comparison at dual
   lengths X and Q/X asked for in the assignment was not performed (no S-data matrix). The null has 60 draws, the
   statistic is strongly correlated in X, one sextic series lies marginally below the null minimum, and the
   cubic l = 0 plateau near N(y)^(-1/2) is unexplained.
3. **The hull is a model, and its piece rule is not closed under transport.** If the reflections are treated as
   symmetries of one function on a connected domain, the map K6 composed with the numerator reflection sends the
   theta-dual piece of `n1-tube-hull` to x - 1/2 = T < -1/2 (`group2.log`, last line), which Theorem T forbids for
   a holomorphy tube. So at least one identification used in the 8-piece set of `n1-tube-hull` (most likely K6
   across the poles of 1/zeta_F(6 sigma_s - 2)) holds only as meromorphic continuation. This does not change
   any hull value here or there (removing pieces cannot lower the minimum), but the statement "legitimate
   pieces" is ARGUED, not PROVED, and the estimate-supplied base was not put through the computation.

---

## 8. Files

| file | content |
|---|---|
| `lemma1.py`, `lemma1.log`, `lemma1.json` | exact checks (a), (b) of Lemma 1; K-type first moments (c) |
| `drop.py`, `drop_s05.log` | log-Gaussian window, plain statistic, class-restricted series |
| `drop2.py`, `drop2_s05.log` | zeta-completed statistic |
| `drop3.py`, `drop3.log`, `post3.py`, `post3.log` | gamma-matched window; summary R and null (60 draws) |
| `group.py`, `group.log`, `group2.py`, `group2.log` | reflection matrices, group orders, Lemma 3 check, hull table |

Run: `scripts/memcap.sh 8 .venv-arb/bin/python tmp/research-2026-11-16/push/e2-theta-dual-mseries-fe/<script>.py`
(each under 2 minutes, under 1 GB).

## 9. Verdict

Precise obstruction. PROVED-rel MS: Lemma 1 (the theta-dual m-series is an alpha^(-2)-twisted stripped sextic
Kubota series at index 4^5 s mu^3). PROVED-model: the m-reflection changes x by 2t + v - 1/2; the group is
infinite; every chamber lies in x >= 3/2; hull abscissa = input (1 with no input). MEASURED: cubic calibration
passes, random rows fail, sextic undecidable at norm 1e7; the pole at 2/3 occurs only in K-type 0. No abscissa
below 0.874886647 is produced. 7/8 (unrefereed) stands; RH open.
