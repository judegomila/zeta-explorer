# REFEREE: r2-zf-paired-rows/RESULT.md (2026-11-16)

Verdict of referee: **holds = false on the strict rule** (one inequality under a "PROVED-rel, exact arithmetic" label is
false as written; one equality is stated outside its range of validity). Every headline claim survives. The fix is a
one-coefficient correction and changes no conclusion. The obstruction is real inside the two architectures examined; it
is not a lower bound on the true abscissa, as the note itself says.

## Confirmed (re-derived by hand and re-run on different cases)

* **Theorem A (i)-(iv).** Complete multiplicativity in the numerator gives (i). (iii): two trivial rows in one fibre have
  e_i (v - v') = 0 mod r at every prime, hence v = v' mod r_i; one class modulo r_i-th powers. (iv): mediant inequality,
  with the minimum taken over fibres with J_f > 0. Correct. Over a general K the count in (iii) is "<<" with a field
  constant, not "<=" (cosmetic).
* **Lemma B (i)-(iii).** Powerful-product argument correct; Rankin + LP duality correct (needs s_i > 0, covered by eps).
  d = 2 iff conjugate pair or quadratic component: correct. Table values re-derived: conjugate pair
  min(l1,l2) + |l1-l2|/r; (4,12) vectors (4,0),(1,3),(0,12),(2,6),(3,9), objective increasing in y at rate 1/2, maximum
  density 1/4; same-orientation (l1+l2)/4. For "quadratic x order r" with r even the table omits the mixed vector
  (1, r/2); its LP weight is 1/2 + 1/2 = 1, so the value l1/2 + l2/r is unchanged.
* **Independent counts (valuation model over Z, own code, boxes the author did not use).**
  conjugate (8,8): J = 3022, 12096 at H = 3000, 12000 (exponent 0.500, LP 0.500), max fibre 2, 3 against H^(1/8) = 2.7, 3.2.
  conjugate (4,4) skew (300, 30000), (1200, 120000): exponent 0.444, 0.453 against LP 0.428, 0.439 (log corrections),
  max fibre 4, 5 against 4.2, 5.9. (4,12) at l2 = 3 l1, boxes (30, 27000), (50, 125000): exponent 0.255, 0.257 (LP 1/4);
  square box 20000^2: 0.260, max fibre 11 against 11.9. Fibre bound never violated.
* **Theorem D (i), (ii), (iii identity), index rule, and Lemma F.** Re-run on residue fields F_{p^2}, p = 5, 7, 11, 13,
  character of order 12, indices h not in F_p (the author used F_p, p = 1 mod 12 only): all five identities hold to
  <= 1.8e-13. Extension to squarefree moduli by twisted multiplicativity is correct (for the conjugate pair it is just
  |g|^2 = N for a primitive character).
* **Framework A abscissae in the headline.** theta = (1 + l1 + l2 - j)/2 checked against an independent LP solver:
  conjugate (4,4), l1 >= 1: theta >= 7/8 + l2/8 (0.875, 0.925, 1.000 at l2 = 0, 0.4, 1); (4,12) Poisson in the order-4
  variable: theta >= 7/8 + 3 l2/8 (0.875, 1.025, 1.25); two Poissoned variables: exponent >= 2. Correct.
* **Proposition E arithmetic** (MODEL): E = 3/2 + (max(q,1) - q)/2 - j, kappa_1 + kappa_2 <= 2 - q/2, E >= 3/2 - 3/(2d),
  E >= 9/8 for (4,12): correct. Single-probe calibration 1 - 1/(2r): correct.
* **Thresholds:** 11/12 - 1/(6a) < 0.87488665 iff a < 3.989: correct.
* **Logs versus text (section 6):** G_3 in [0.90, 1.13] for the bin [500, 2001) and [0.86, 1.17] for [120, 500): matches
  `bins_16e5.log`. Summary table matches `analysis_16e5.log`. Squarefree primary count 556014 agrees with the density
  estimate (pi X / 8)(1/zeta_K(2))/(3/4) = 5.56e5.
* **DH control:** adequate. No zero-free statement is made; the Euler product enters at mu(pi) = -1 and Hecke
  multiplicativity. **No RH assumption** and **no verified-height restatement** found.

## Errors and gaps

1. **False inequality [labelled PROVED-rel, "exact arithmetic"], section 3.** "(4,12), Poisson in the order-12 variable:
   theta >= 23/24 + 3 l1/8." With y <= min(l1, l2/3) the exponent is 1 + 3 l1/4 + 11 l2/12 - y/2 >= 23/12 + l1/4, so the
   correct bound is **theta >= 23/24 + l1/8**. Counterexample to the stated bound: (l1, l2) = (0.3, 1): j = 0.3083,
   theta = 0.99583 = 23/24 + 0.3/8, against the claimed 1.0708. (Also (0.1, 1): 0.97083 against 0.99583.) The conclusion
   theta >= 23/24 > 7/8 is unaffected.
2. **Equality stated outside its range, section 3.** "conjugate pair (4,4): theta = 1/2 + 3 l1/8 + l2/8" holds only for
   l2 <= l1. For l2 > l1 it is 1/2 + l1/8 + 3 l2/8 (e.g. (1, 2): 1.375, not 1.125). The lower bound 7/8 + l2/8 holds in
   both ranges.
3. **Bilinear architecture: mixed Poisson not treated.** Theorem D and Proposition E consider Poisson in both row
   variables. Poisson in one variable of a conjugate pair gives chi_a(k_1 m_2)^(-e) g(chi_a^e): a same-orientation pair
   in (k_1, m_2) with the Gauss sum kept, signal rows k_1 m_2 = r-th power, d = r, density 1/r. This closes the case at
   the level of the count (referee's derivation, MODEL), but it is absent from the note, so "tautology" for the
   conjugate pair in Framework B is proved only for the two-variable Poisson.
4. **Headline "1/L appears only if the input is already a Moebius sum" is PROVED-rel, not PROVED.** What is proved at
   primes is g(psi) g(psi-bar) = psi(-1) N(a). The "only if" is the ledger class statement ([t] = [mu]), which the body
   labels PROVED-rel the ledgers; the summary drops the qualifier.
5. **Proposition C is an architecture statement.** (C1) is the condition for the dual diagonal, taken with absolute
   values, not to exceed the primal diagonal. Statement 3 of "Does the dense diagonal help?" ("a Gram bound that sees
   the Moebius coefficients needs a Poisson step") is asserted, not proved. The note's weakest step 1 says this; the
   verdict line "precise obstruction" should carry "inside Framework A / the bilinear probe" each time.
6. **"Two to three sigma" is not derived from a stated statistic.** Per-block values of F for classes that have
   decayed still reach 0.7 to 1.4 (class 2 at N(h) = 5: 1.04, 1.36 at D = 2.5e3 to 5.7e3; class 0 at N(h) = 5: 0.73 at
   2.8e4), and class 3 at N(h) = 49 dips to 0.11 to 0.20 at D = 1.1e3 to 2.5e3 and returns to 1.70. At N(h) = 13 the
   class-3 mean 0.87 is carried by the last block (0.68, 0.52, 1.42; the block before is 0.21), and the smaller run
   `analysis_4e5.log` gives 0.47 there. The evidence against a = 2 rests mainly on the single inert row h = 3
   (N(h) = 9: 2.47, 1.03, 0.30; 1.61 in the smaller, non-independent run) plus the [5, 30) bin (0.93, 1.03 with s.e.
   0.31, 0.23 against class 2 at 0.46, 0.36). With about 6 effective samples that is roughly 2 sigma, conditional on the
   class-3 scale constant equalling the class-2 constant. "Favours a = 3; a = 2 disfavoured at about 2 sigma under the
   calibration assumption" is the supportable wording. Class 0 is a single non-monotone realisation (0.20 at D = 1e4,
   0.50 at 2e4), so "base scale of order 10^3" is loose.
7. **"Optimal mean-square size" is measured on 209 rows with #rows << D.** It shows no anomalous average size in that
   range; it does not test the regime #rows ~ D in which the large sieve is needed.
8. Section 6 was not re-run by the referee at a different size (11 minutes on 8 cores exceeds the brief's local
   limits for a referee pass); checked against both existing runs (4e5 and 16e5) only.

## Is the obstruction real? One way around

Inside the two architectures: yes. The three blocking inequalities are correct, and the conjugate-pair family is
Sum_{n,n'} mu mu |Sum_u chi_n chi-bar_{n'}(u)|^2, whose n = n' diagonal is D H^2; the count J ~ H is the number of fibres.

Not closed:
* **Small-box conjugate pair.** At l1 = l2 = 1/2 (HH = D, J = D^(1/2)) the conjectural truth Sum_u |A_u|^2 << D^(1+eps) HH
  would give |A_1|^2 <= D^(3/2), theta = 3/4. Nothing in the note excludes this except (C1), which is a property of
  Poisson with absolute values on the dual side. A bound that keeps the cancellation between the dual diagonal and the
  dual off-diagonal (the self-dual identity M(H_1,H_2) - diag = (H_1 H_2/D^2)[M(D^2/H_1, D^2/H_2) - diag], MODEL in the
  note) is the open route; it is of zero-free-region strength, so it is a restatement of the target unless a new input
  is supplied.
* Intermediate dual exponent 2 < a < 3 for r = 4 in mean square over h, and r = 5 over Q(zeta_5): untested, as stated.

## Surviving claim

PROVED: Theorem A; Lemma B (J <= HH^(1/2+eps), per-fibre <= H_i^(1/r_i), density 1/2 only for conjugate pairs or
quadratic components); Theorem D(i), (ii), (iv) at primes and squarefree moduli; Lemma F.
PROVED-rel the open optimal quartic input, inside Framework A: 7/8 + l2/8 for (4,4); 7/8 + 3 l2/8 for (4,12) with the
order-4 variable Poissoned; 23/24 + l1/8 (corrected from 3 l1/8) with the order-12 variable Poissoned; >= 1 with two
Poissoned variables.
PROVED-rel the ledgers: a conjugate pair leaves the coefficient class unchanged, so 1/L requires [t] = [mu].
MODEL: Proposition E (E >= 9/8 for (4,12)); mixed-Poisson conjugate pair has density 1/r; a(10) = 4.
MEASURED: counts; identities to 1.3e-12 (F_p) and 1.8e-13 (F_{p^2}); over Q(i) the Moebius-twisted quartic dual has
mean-square size about 1 on 209 rows, and the conductor pattern favours a = 3 over a = 2 at about 2 sigma under a
calibration assumption.
OPEN: r = 5; exponent between 2 and 3; small-box mean square; the true abscissa. No zero-free region; RH open.
