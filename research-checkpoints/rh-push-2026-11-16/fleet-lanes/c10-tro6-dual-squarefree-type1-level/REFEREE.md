# REFEREE (adversarial, lens: general) for c10-tro6-dual-squarefree-type1-level/RESULT.md

2026-11-18. Referee scratch files: `/tmp/c10ref/` (outside the repo; nothing in the lane directory was changed except
this file). All runs local through `scripts/memcap.sh 8`; the server was not used.

**Outcome: the claimed verdict holds in a narrowed form.** Lemmas A and B are confirmed (re-derived by hand and
rechecked numerically on a different case). The measured statements about the signed outer sum (r2) are confirmed
against the logs and reproduced at 1e6 with a different seed. The attribution of the fired rule to the polar term
is supported by a placebo control run here, but the phrase "inside the seed spread" is not robust: the post-removal
exponents have standard errors of 0.02 (1e7) and 0.06 (1e6) and move by 0.014 to 0.02 with the normalisation. No
error was found in a PROVED step. Nothing assumes RH, restates verified height, or makes a statement about zeros.

## 1. PROVED steps, re-derived

| step | check | result |
|---|---|---|
| Lemma L | gamma_1 gamma_2 = mu alpha G is Hasse-Davenport (m = 2) plus gamma_2^3 = mu alpha; CLASSICAL, cited as such | confirmed numerically (below) |
| A1 | Lemma L, abs(gamma_1) = 1 | ok |
| A2 | for squarefree n the coprime pairs (c, s), c s = n, are the divisors of n; rho-hat depends on c s only | ok |
| A3 | open rho-hat; conj chi_k(u c s) factors because (k, c s) = 1 and u is a unit away from 3; conj chi_k(c) = R(c, k) conj chi_c(k), R real | ok |
| B1 | gamma_2(ab) = chi_a(b)^2 chi_b(a)^2 gamma_2(a) gamma_2(b); cubic reciprocity for primary a, b; alpha multiplicative | ok |
| B2 | c = ab, mu(c) = mu(a) mu(b), B1, then mu(b) beta_b chi_b(r) = alpha(b)^2 G(b) conj gt_1(r, b) | ok |
| B3 | exchange of two finite sums | ok |
| B4 | mu(a) mu(ab) = mu(b); gamma_2(a) chi_b(a)^4 = gamma_2(a) conj chi_a(b)^2 = gt_2(m b, a) chi_a(m)^2 for (m, a) = 1; both sides vanish otherwise because of the factor chi_a(m) | ok |

Numerical recheck on a different case (`/tmp/c10ref/ref_check.py`: the lane's script with primes of norm
7, 13, 19, 37, 43, 67, 73, 79 and inert 5 (17 primes, 117 nodes, N <= 1700), shift u = y0 instead of lambda,
different windows for k, c, s, levels and conductors, seed 777):

| identity | case | max error |
|---|---|---|
| Lemma L; abs(gamma_1) = 1 | 117 nodes | 4.6e-14; 2.4e-14 |
| reciprocity | 10,166 coprime pairs (4,044 with R = -1) | 0 mismatches |
| A1, A2, A3 | 72 moduli, 26 conductors, 142 pairs, 124 distinct n, abs(D) = 23.45 | 2.7e-14, 7.1e-15, 8.9e-15 |
| B1 | 2,028 triples | 3.9e-14 |
| B2 | 18 levels | 4.0e-9 |
| B3; B4 | abs(value) = 158.0; M_A(c) in {-3, -2} | 5.1e-14; 2.9e-11 |
| added: gamma_2(ab) = chi_b(a)^4 gamma_2(a) gamma_2(b) | 226 pairs | 3.8e-14 |
| added: G(c) is a function of c mod 4 | 12 classes | 0 violations |

`zomega.py` was read: `PrimeO.chi` is the residue symbol y^((N-1)/6) mod pi and `gauss_brute` is the literal sum of
its docstring; the checks do not rest on the tables.

## 2. Errors and corrections (ranked)

1. **"Inside the seed spread" after polar removal is not robust (section 6.1, verdict, claim text).**
   Recomputed from `tcond_ana_*.json` with the standard error of the least-squares slope:

   | case | raw L | after removal | after removal, divided by the remaining energy (tau_coprime - (share - null)) |
   |---|---|---|---|
   | kappa = 0.4, 1e7 (9 points) | -0.067 +- 0.022 | -0.0074 +- 0.021 | -0.021 +- 0.021 |
   | kappa = 0.6, 1e7 (9 points) | -0.030 +- 0.011 | +0.005 +- 0.013 | -0.009 +- 0.012 |
   | kappa = 0.4, 1e6 (5 points) | -0.087 +- 0.071 | -0.047 +- 0.064 | -0.068 +- 0.067 |
   | kappa = 0.6, 1e6 (6 points) | -0.008 +- 0.036 | +0.029 +- 0.036 | +0.012 +- 0.038 |

   (a) L' is the level energy of the non-polar remainder divided by the baseline for rows of the full energy. The
   removed share falls along the path (0.087 to 0.028 above null), so this baseline tilts the exponent upward by
   about 0.014 to 0.02. With the remainder normalised by its own energy the 1e7 value at kappa = 0.4 is -0.021,
   at the pre-registered threshold. (b) The seed spread quoted is that of rows that did not pass through the
   removal step. (c) At 1e6 the value -0.047 is 0.026 below the seed mean, so the first prong of the rule is still
   met; only the second is not. Correct statement: after removal the exponents are compatible with zero and
   equally with -0.02 to -0.04; the measurement does not resolve the difference.
2. **The fired rule rests on the two (1e7) or one (1e6) smallest path points.** 1e7, kappa = 0.4, raw L restricted to
   Q >= 1,905: -0.019 +- 0.023; to Q >= 3,125: +0.013 +- 0.020. 1e6 without Q = 990: +0.032 +- 0.025. These are the
   points with 4 to 6 levels and null shares of 4 to 8%. This supports "no deficit that grows" and should be stated
   next to the fired rule; it also means the "decay" is observed on a range of one factor of 3 in Q.
3. **L exponents depend on the three-draw Monte-Carlo baseline at the level of the threshold.** Rerun of
   `ana10.py` at 1e6 with seed 4242 (theta-row statistics are deterministic; only the controls change):
   (b) kappa = 0.4, L: -0.0885 (lane: -0.1074), rule still fires; r2 rows unchanged, no saving in any decision case.
   (a) theta = 1/3, u = lambda, L: +0.0043 (lane: +0.0330, reported as "excess"): the 1e6 excess does not survive
   a change of seed, so "excess at both sizes" holds only at 1e7 (+0.071). The random-phase seeds are also part of
   their own denominator, which narrows their spread.
4. **A second non-decision case is not reported.** (a) theta = 1/3, u = y0, statistic L: -0.059 at 1e6 (rule fires at
   this size; -0.054 with seed 4242) and -0.020 at 1e7 (difference from seed mean -0.045; fails the second prong by
   0.002). RESULT 5.1 reports only the r2 value of this case and 6.2 says "one item is not explained". With u = 1
   there are two shifts at theta = 1/3 whose L exponent is negative at both sizes; in both L is above 1 (1.04 to
   1.33), so both are excesses that shrink. The claim "one non-decision case unexplained" should read two.
5. **Wording of section 3, item 1 ("returns the same form").** By (B3) the level average is
   sum_c f(c) M_A(c) T(c) with f = mu beta = alpha^2 G conj gamma_1 (Moebius-free by Lemma L). This is the
   Moebius-free form weighted by a truncated Moebius divisor sum; with all levels 1 < N(a) it equals minus the
   Moebius-free full sum, not B = sum_c beta_c T(c). The identity is correct; "the original form" is accurate only
   in the sense "a c-sum against T(c) with another weight". The lane uses lambda_a = mu(a) as a proxy for the
   Vaughan Type I coefficients; this is not stated as a proxy.
6. **Scope of "one finite trilinear sum".** Lemma A is exact for the finite estimator rho-hat over k in K. For the
   theta coefficients themselves (a residue, not a finite sum over k) the passage from (A2) to (A3) is not an
   identity; with split-half correlations of 0.28 to 0.69 a large part of rho-hat is not theta_6 (the lane says this
   in 9.1). "Not Kloosterman" is proved for the bracketing (B4) only; the statement that no later transformation
   (Poisson or Voronoi in m, Kuznetsov on the cover) produces one is ARGUED, as labelled.
7. **Partly explainable items listed as unexplained.** The constant deficit after removal (L' = 0.83 to 0.99) and
   the value 0.82 +- 0.04 for the Moebius-free full sum (6.3, the level a = 1) are in the direction expected from the
   lane's own mechanism: total energy 1.01, minus a polar share of 3 to 9% above null that cancels against
   alpha^2. This accounts for 0.92 to 0.98, not for all of 0.82. The level a = 1 was excluded from the decision by
   the pre-registration (1 < N(a)); the result reports it as an observation, which is the correct status.
8. **Circularity check, form (a).** "A power saving in the Moebius sum of length below N(k)^(1/2) is a zero-free
   strip for L(s, psi_k)" is a one-directional heuristic (a uniform saving at all lengths gives a strip; one length
   range does not). ARGUED, not an equivalence.

## 3. Control run by the referee

Placebo removal (`/tmp/c10ref/tcond_placebo.py`: the lane's `tcond_ana.py` with the polar direction e(c) multiplied
by an independent random phase per conductor; same cells, same amplitude law, same surrogate bias correction).
The raw L column reproduces the lane's values to all printed digits at both sizes.

| case | raw L exponent | after polar removal (lane) | after placebo removal (referee) | share of placebo direction (null) |
|---|---|---|---|---|
| kappa = 0.4, 1e7 | -0.067 | -0.0074 | -0.065 | 0.0003 to 0.078 (0.0003 to 0.078) |
| kappa = 0.6, 1e7 | -0.030 | +0.0047 | -0.029 | same |
| kappa = 0.4, 1e6 | -0.087 | -0.047 | -0.091 | 0.003 to 0.097 (0.003 to 0.098) |
| kappa = 0.6, 1e6 | -0.008 | +0.029 | -0.016 | same |

The change of exponent is specific to the direction gamma_1(c) conj chi_c(y0) N^(-1/3) and is not produced by
removing one coefficient per cell in an unaligned direction. This supports the attribution to the Theorem P polar
term (at 1e7; at 1e6 the standard errors of 0.06 allow no conclusion).

No zeta-only mechanism is claimed, so the nine structural controls have nothing to act on; the lane's seeded row
controls (random phase, sign-twisted primes, Liouville, THIN, cubic rows) are the relevant ones and their values
in 5.1 agree with the logs. The decision statistics do not separate theta rows from the controls.

## 4. Other checks

* Table 5.1 against `ana_a_*.log`, `ana_b_*.log`: all eight r2 differences match; minimum -0.0093. Confirmed.
* Table 6.1 against `tcond_ana_*.log`: matches.
* Pre-registration: the amendment (kappa = 0.6 as decision range, 4-level minimum) is dated before the first run;
  the fired rule is reported as fired. The diagnosis is post hoc and is labelled so (weakest step 2).
* No RH assumption; no verified-height statement; no known theorem presented as new (Lemma L, B1, reciprocity and
  CRT are cited as classical or earlier-round).
* Resolution: the lane states that a saving of the size TRO6 needs is below the resolution (9.1). The measurement
  therefore excludes a saving larger than about 0.03 to 0.05 in the exponent in these toy geometries and nothing
  smaller. "Precise obstruction" is justified by Lemmas A and B (the forms are re-bracketings, exact for the finite
  estimator), not by the measurement.

## 5. Requirement flags (set by the referee)

| flag | value | reason |
|---|---|---|
| R1 | false | identities hold for arbitrary rows; theta rows are not separated from non-multiplicative random-phase rows |
| R2 | false | family mean squares at Q <= 37,150, M <= 250,000; no statement about a target |
| R3 | false | control-blind by construction |
| R4 | false | nothing reaches or moves any abscissa |

## 6. Surviving claim

Lemmas A and B are correct finite identities (rechecked to 4e-9 or better on an independent case): for the finite
Kubota estimator, the dual sum on squarefree n, the level average with sign mu(a), and the trilinear Gauss-sum
form are re-bracketings of one finite sum; the level variable enters (B4) only through normalised cubic Gauss
sums. Measured at 1e6 and 1e7: no saving in the signed outer sum of either form at a resolution of 0.01 to 0.03 in
the exponent. The pre-registered rule fired for L of form (b), kappa = 0.4; the trend sits in the one or two
smallest path points and is removed specifically by projecting out the Theorem P direction (placebo control:
unchanged), leaving -0.007 +- 0.021 (or -0.021 +- 0.021 with own-energy normalisation) at 1e7 and -0.047 +- 0.064
at 1e6: compatible with zero, not shown to be zero. Two non-decision cases (theta = 1/3, u = 1 and u = y0) have
negative L exponents at both sizes and are unexplained; the 1e6 "excess" at u = lambda is seed-dependent. No
eta > 0; 7/8 and 0.874886647 unchanged; nothing about zeros. Closing lead 17 is a scheduling decision supported by
the identities, not by an exclusion of a small saving.
