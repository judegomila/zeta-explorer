# REFEREE: e2-tro6-signed-csum-stratified

2026-11-18. Adversarial referee of `RESULT.md`. Scratch scripts in `/tmp/ref_e2/` (not in the repo). Local runs only,
through `scripts/memcap.sh 8`. Nothing on the compute server was started.

**Outcome: the verdict "partial result, no eta, 7/8 unchanged" holds. Both PROVED steps are confirmed. Five statements
need correction; one of them (item 3 of the summary, "the polar term lives in the squarefree stratum") is a
normalisation effect, not a structure, and should be withdrawn.**

## 1. PROVED steps, re-derived

**Lemma S: confirmed.**
* Derivation: complete multiplicativity of chi_c in the upper argument gives
  chi_c(m) = chi_c(u m1) chi_c(m2)^2 chi_c(m3)^3 chi_c(m4)^4 chi_c(m5)^5 chi_c(t)^6; chi^4 = conj(chi^2), chi^5 = conj chi,
  chi^6 = 1 on (c, t) = 1; chi_c(x) = R(x, c) chi_x(c) with R^2 = 1 turns each factor into a function of c. The
  displayed xi_k follows. Both sides vanish when (c, m) != 1, so B = sum_k B_k is exact.
* Independent exact check (`/tmp/ref_e2/lemS.py`, own Z[omega] arithmetic and Euler-criterion symbol, no table, no
  code shared with `lemma_check.py`): 4000 random cases with composite m1..m5 (0 to 2 primes each, split primes of
  norm < 1500 and inert 5..29), optional t^6, random unit times lambda^a 2^b, c a product of 1 to 3 primes:
  0 mismatches. R = +-1 in every case, constant on each of 144 cells (class of x mod 4, class of c mod 4), -1 on 54
  cells. The author's check used prime x and one composite m; this one uses composite m3, m5 and so also tests that
  R is determined by the classes mod 4 of the composite argument.
* Correction (minor): the conductor is misstated. xi_k is periodic in the element c modulo 4 rad(m2 m3 m4 m5 t)
  (the summary omits t; section 2 has it). As a Hecke character of the ideal (c), evaluated on the generator that
  is 1 mod 3, its modulus also contains 3: the cubic symbol chi_p(unit)^2 is not 1 for 164 of 300 (prime, unit)
  pairs tested (N(p) not 1 mod 9). "Conductor dividing 4 rad(...)" should read "dividing 12 rad(k*)" or be stated
  as periodicity on primary elements. Nothing downstream depends on it.
* The lemma is multiplicativity plus sextic reciprocity. It is a routine reduction (labelled "elementary" by the
  author); it should not be counted as a new result.

**Proposition S2: confirmed from its hypotheses.** Number of kernels with N(k*) <= K0 is << K0^{1/2}; head
<< K0^{A+1/2} Q^{-eta1} C; tail by Cauchy-Schwarz and (T_tau) << K0^{-tau} C; balance gives
eta_Q = tau eta1/(A + 1/2 + tau), 1/3 of eta1 at tau = 1/4, A = 0, K0 = Q^{4 eta1/3}. Checked. (T_tau) is measured
only (the author says so) and should carry the weight W. The conversion eta = 80 eta_Q comes from other lanes and
was not re-derived here.

## 2. Leg (b): shares

* Arithmetic confirmed: count share 0.9337 = 1/(zeta_F(2) (15/16)(8/9)); sqrt(0.0612 x 0.055) = 0.058; row counts
  and shares sum correctly.
* The 54,261-row file is on the server; the local copy `r2in/` holds 2,403 rows (N(m) <= 1326). Rerun on this
  different, smaller case (`/tmp/ref_e2/norms2.py`), all 13 row types and all 11 windows: squarefree share of
  sum |rho-hat|^2 0.945-0.948; of sum |B_m|^2 0.927-0.968; Cauchy-Schwarz share of the non-squarefree rows
  0.041-0.062. Same size as claimed. "At most 5.8%" is not a uniform bound: row types `mob`, `res*a6` reach
  6.0-6.2% at some windows. The conclusion (a constant, not an exponent) is unaffected.
* Error: "Shares at Q = 3750, 7500, 15000 agree to 0.002" is true for the rho-hat column (0.9395, 0.9396, 0.9410,
  0.9388) and false for the B column in the author's own `norms_strata.json`: 0.9546, 0.9491, 0.9472, 0.9450
  (monotone, range 0.010; stratum 2: 0.0427 -> 0.0499). In addition `norms_strata.py` always uses window k = 10
  (the Q = 30000 window) for B_m at every Q, so the lower-Q B shares are not shares at those path points.
* Logic of "closed as a route": sound in the stated form (the degenerate strata cannot supply an exponent because
  their Cauchy-Schwarz mass is a few per cent, stable in Q on the rho side and equal to a proved density on the
  count side). It rests on measured l2 shares in the toy geometry, not on a proved bound for sum |rho|^2 on
  squarefull strata. Cancellation between strata is not excluded (the author says so).

## 3. Row-sensitive statistic

* Numbers reproduced from `opt_00..10.json` with my own fit: all primes free, after polar removal, exponent
  difference +0.0003, -0.0000, +0.0023 (bootstrap sd 0.0015-0.0024); positive control +0.533 (small) and +0.069
  (all primes).
* Overstated precision. The quoted "0.000 +- 0.001" is at the level "all primes free", where t_opt is 2.6% of the
  window size for every row vector (386,856 free phases per parity at Q = 30000): the statistic is dominated by
  counting, as the author states in reading 4. At that level the positive control itself (10-15% of the energy
  polar) gives only +0.069. At the levels where the control has power (+0.53 at `small`, +0.37 at P = 1000) the
  residual after polar removal is +0.028, +0.036 (small) and +0.025, +0.037 (P = 1000) with bootstrap sd 0.008-0.011
  (jackknife 0.016), i.e. 2 to 4 sd on errors that treat path points as independent, which they are not. Fitting
  the last 8 points only gives +0.013, +0.008, +0.010, +0.011: the excess comes from the first three points
  (ratio 0.87 at Q = 938). Correct statement: no excess resolved; sensitivity about 0.01-0.04 in the exponent at
  the informative levels, not 0.001.
* "Detects the polar term and nothing else" also has the F2 exception in the stratum max exponent >= 3 (33.9
  against 15.1 at Q = 30000, z = +6), reported by the author and unexplained.
* **Error (summary item 3, "the polar term lives in the squarefree stratum").** The per-stratum polar share is the
  fraction of that stratum's own energy. The polar part adds coherently over rows (energy proportional to n_s^2),
  the remainder incoherently (proportional to n_s), so the share scales with the number of rows n_s whatever the
  arithmetic. Check with the author's numbers at Q = 30000: shares 0.1016 : 0.0059 : 0.0006 = 1 : 0.058 : 0.006; row
  counts 50664 : 3204 : 393 = 1 : 0.063 : 0.008. Aligned-direction t: 16790 : 1023 : 103 = 1 : 0.061 : 0.006. Polar
  amplitudes sqrt(share x mass): 0.309, 0.018, 0.0017, sum 0.329, square 0.108 = the measured share for all rows
  (0.1077). So the polar amplitude per row is the same in all three strata to within the accuracy of this
  comparison (about 10-25%). The squarefree stratum carries 94% of the polar amplitude because it carries 93% of
  the rows. No stratum dependence of the polar term has been measured. The same remark explains why the optimiser
  does not find the polar term in the stratum max exponent 2 (+0.002): its share there is 0.6%.
* Fifth-power rows: 6 rows; "consistent with 0" is correct and has no power. The vanishing is a cited theorem.

## 4. Dual term (pivot)

* Reproduced and rerun with different cases (`/tmp/ref_e2/dual_ref.py`, Q = 7500, `dual_coef_06s.npz`, new seed):
  R^2 = 0.4942 for index lambda c; permutation null from 20 draws 0.2230 +- 0.0036 (max 0.2295); a null that permutes
  only inside blocks of 6 conductors adjacent in norm: 0.2311 +- 0.0030 (so the signal is not a smooth function of
  the norm); index c 0.410; index -e0 c 0.273. Lower and upper half of the conductors by norm and two random halves
  all show the same excess over their nulls. The detection is confirmed (excess 0.27 over a null of sd 0.004).
* "Explains 49% of the energy" is an in-sample figure of an over-parameterised fit: 12 x 6 complex coefficients per
  group, 108 groups (7,776 coefficients for 35,520 data points), of which 22% is fitted noise. Out-of-sample
  (fit on half of each group, predict the other half): -0.20 against -0.85 for permuted data (signal present, but
  the fit does not predict held-out conductors with 13 parameters on 27 points). With coefficients tied across
  c mod 9 (12 groups by c mod 4): in-sample 0.115 against null 0.025, out-of-sample 0.045 against -0.052. The
  honest size is the author's own adjusted figure (0.35, "a quarter to a third") under class-dependent
  coefficients, and 5-10% when the coefficients are not allowed to depend on c mod 9. The headline should quote
  the excess over the null, not 49%.
* The rise 42% -> 49% -> 55% with Q follows the null (18%, 22%, 27% = 12/n_g). The excess is flat: 0.24, 0.27, 0.27.
  It should not be read as growth with Q.
* Missing control. Both sides are linear in the same table of gamma_1(n). The test that separates "property of
  theta coefficients" from "identity between truncated sums" is to replace gamma_1(n) by eps_n gamma_1(n) with
  random unimodular eps_n on both sides and recompute a and b. Not run by the author; not run here (it needs the
  full twisted-sum accumulation, 53 minutes on 4 cores for the original). Splitting the b-side by modulus range
  does not replace it, since the a-side uses all moduli. Until it is run, "the leading dual term is detected"
  should read "a correlation of the expected shape is detected between two estimators built from one table".
  The author's wording in 4.2 ("not a Voronoi formula and gives no bound") already limits the claim.
* Index: the best family is lambda c, the sketch's index -e0 c is at the null, and the share of the unit term does
  not fall with N(c)/Q. Both disagree with the sketch as written; the author records both. "Supports the
  orientation of the dual sketch" holds for conjugation and angular factor, not for the index or the kernel.
* Replication numbers (0.424 / 0.186 at Q = 3750, 0.546 / 0.271 at 10607) match the logs. The Moebius-slice table
  matches `dual_mob_06.log`. The j = 1 excess (4.1 against control maximum 2.8) is one column among 2592 at nested
  conductor sets; not established.

## 5. Controls and scope

* No zeta-only mechanism is claimed, so there is no mechanism to run the nine controls against. Lemma S and
  Proposition S2 hold for arbitrary beta_c: they pass every control trivially and for that reason give no saving.
  The author states this.
* Function-field control: argued, not run. Unverified here.
* Nothing assumes RH. Nothing restates verified height. No abscissa or eta is claimed. Lemma S is elementary and
  is not presented as a theorem of the literature under a new name, but it is not new mathematics either.
* Requirements (all primes together; uniform in height; fails for controls): not met and not claimed to be met.

## 6. Corrections required in RESULT.md

1. Summary item 3 and section 3.2 heading "polar share": remove "the polar term lives in the squarefree stratum";
   replace by "polar amplitude per row is the same in all strata within about 20%; within-stratum shares scale
   with the number of rows".
2. Section 3 headline: quote sensitivity at the informative levels (0.01-0.04), not 0.001.
3. Section 2: "agree to 0.002" holds for the rho-hat column only; B shares drift 0.955 -> 0.945 and use a fixed
   window.
4. Lemma S: conductor includes the prime above 3 (and rad(t)).
5. Section 4 headline: excess over null 0.24-0.27 (flat in Q); in-sample 49% includes 22% fitted noise; the
   eps_n control is not run.

## 7. Verdict

holds = true for the claimed verdict (partial result; leg (b) closed as a route in the stated sense; form (a) open;
no eta; 7/8 unchanged). Surviving content: Lemma S (routine), Proposition S2 (conditional), measured l2 shares of
about 94% on the squarefree stratum, no resolved excess of rho-hat over random-phase rows after polar removal at
sensitivity 0.01-0.04, and a reproducible correlation (excess R^2 about 0.25 over the permutation null) between
the non-polar remainder and theta estimators at index lambda c whose origin (theta coefficients or shared table)
is not yet separated.
