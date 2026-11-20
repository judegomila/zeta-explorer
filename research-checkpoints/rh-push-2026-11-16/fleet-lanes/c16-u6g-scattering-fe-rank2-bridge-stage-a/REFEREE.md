# REFEREE.md for c16-u6g-scattering-fe-rank2-bridge-stage-a

Status of this file: second pass by the lane's author in the same session, written after RESULT.md, with checks
coded from the statements of RESULT.md (`ref_checks.py`), not from the lane's run scripts. It shares `gram.py`
(the 36-term formula) with the lane. It is NOT an independent referee. An independent referee is owed; the control
table has not been read by a second referee, which STRATEGY section 1 requires before stage B counts.

## Checks run (`ref_checks.log`, mpmath 40 digits, under `scripts/memcap.sh 8`)

| # | Statement | Result |
|---|---|---|
| C1 | Lemma R limit, with residue r Theta(1), four zeros (Re a = 0.2, 0.35, 0.8, 1.3), two T, eps = 1e-9 (0.6 - 0.8i) | relative defect 1.2e-10 to 7.2e-10 (order eps, as expected) |
| C2 | form (*) against the 36-term formula for BLS-sym with a pair at 1/2 +- eta + i g, three (eta, g), two T | 3e-15 to 3e-13 |
| C3 | Lemma D: Blaschke cocycle = ctilde(w lambda)/ctilde(lambda) on the six orbit points | 8e-42 |
| C4 | Lemma S: P(u)/P(u+1) = Blaschke product for the symmetric quartic | 7e-42 |
| C5 | T -> T + t rho^vee equals M -> e^{-tu} M up to the rank-one factor | 3.5e-40 |

## Points examined

1. Lemma R, first version. HELD AFTER CORRECTION. The first version of the lane predicted a negative limit for every
   Re a > 0 from the diagonal term alone. Run 2 contradicted it for Re a = 0.8 and 1.3 (positive values). Two
   omissions: the cross term with the s1 exponent, of the same order |eps|^(-2) and of sign 1/(2A - p), and the
   factor Theta(1) in the residue. The corrected statement is the one in RESULT.md and agrees with C1 in both regimes.
   Consequence for the verdict: the first version would have excluded BLS-right; the corrected one does not.
2. Lemma R, hypotheses. The limit is taken with z_2 = a exactly, so the s1s2 and w0 coefficients vanish
   identically along the path; M must be regular and the pole simple. For zeta's own zeros the lemma returns the
   functional equation and nothing else. HOLDS as stated. Not covered: multiple zeros, a real, a zero at p - a
   of M of higher order.
3. Form (*). The removable singularity (the two exponents have opposite second coordinates) was resolved by a
   limit in the conjugate variable; C2 confirms the derivative term -M' + (1 + t_2) M including the term M/(2A + x)
   with 2A + x = 1. HOLDS. The statement "Q > 0 for t_2 >= 0" is a grid statement (9 values of eta, 5 of t_2), MEASURED.
   The comparison with the rank-one Maass-Selberg value at height t_2 + 1 is approximate and labelled so.
4. "BLS-sym and BLS-right pass". MEASURED only. The search is small: order at most 5, heights of zeros at most 40,
   points with |Im| <= 6, T on four values in run 3. Normalised eigenvalues of zeta at T = 0 are 1e-10 to 1e-12 at
   30 to 50 digits; these are far above the working precision, and the controls' values are 1e-7 or larger, so the
   sign statements are not at the noise floor. A proof of closure, or a violation, would change weakest step 1.
   The verdict "control passes" is the reading required by the rule "a control passing every step ends the lane";
   it should be entered as "closed as measured", not as proved.
5. Formula and conventions. Not opened in a source. Two independent consistency checks support the conventions
   (kite integral for M = 1; sign pattern in T for zeta). The claim that zeta's threshold is the closed chamber is
   MEASURED on one direction grid with step 0.05; the lane does not claim the exact value.
6. Table rows not run: ZQ in the rational form, NR-q, DH, backward heat, T-NR as an infinite product, and the six
   "not formulable" rows. The DH and heat rows rest on the record (zeros right of 1; zeros leaving every strip).
   T-NR rests on the map note that it is a convergent symmetric Blaschke product; the infinite product was not evaluated.
7. E_a. Fails by Lemma R with the poles at 1 +- a; the run shows broad negativity. One caveat: E_a is not expected
   to be a rank-2 Borel object with one function M (its natural carrier is a larger group), so "fails" means only
   that it is not in the class defined by (I2).
8. Lemma S and the correction to the BLS row ("lacks f(z) = f(1 - z)"). HOLDS; elementary. It should go to the
   repair lane as a wording correction of the control row.
9. K-type remark in Lemma D (the factor (u - 1)/(u + 1) on the 7-dimensional K-type). ARGUED; the sign and the
   identification of the M-invariant vector were not computed. Not used in the verdict.

## Outcome

Verdict of RESULT.md (precise obstruction; device row; no statement about zeros; four flags false) holds on this
pass, with the label restrictions of items 4 to 7. Referees: 1 (same session, not independent).

---

# Independent referee pass (lens: general), 2026-11-19

Separate session from the lane. The kernel was re-implemented from the definition (Weyl orbit generated from the
two simple reflections, cocycle built by length-increasing products) and does not import `gram.py`. All runs local,
`scripts/memcap.sh 8 .venv-arb/bin/python`, mpmath 25 to 40 digits, single process, matrices of order at most 7.
The server was not used. Scripts were kept outside the lane directory (`/tmp/refgen_c16/`, v1 to v9); nothing in
the lane other than this file was edited. Every number below is MEASURED unless marked DERIVED.

**Outcome: the verdict (precise obstruction, device row, no statement about zeros of zeta, four flags false) HOLDS.
All four PROVED / PROVED-rel steps were re-derived and confirmed. One claim is too wide as worded and must be
restricted (item E1). Two table rows are weaker than their label suggests (E2, E3).**

## A. Re-derivation of the PROVED steps (DERIVED by hand, then checked)

1. Orbit and cocycle table of 2.1. Re-derived from s1 (z1, z2) = (-z1, z1 + z2), s2 (z1, z2) = (z1 + z2, -z2) and
   c(s w, lambda) = c(s, w lambda) c(w, lambda). All six rows agree (defect 1e-40). The pairing <nu, T> is the
   inverse Cartan matrix of A2: correct. r = 1/xi(2) = 6/pi: correct (residue of xi at 1 is 1, xi(2) = pi/6).
2. Lemma R. Re-derived. With z_2 = a the coefficients of s2, s1s2, w0 vanish; the s2s1 diagonal term gives
   -r^2 |M(p-a)|^2 / (4 A p |eps|^2); the two s1 x s2s1 cross terms sum to r |M(p-a)|^2 / ((2A - p) |eps|^2),
   independent of arg eps; every other term is O(1/|eps|). Exponents differ by -p t_2. The stated limit is correct.
   Consequences (a), (b), (c) follow; in (b) the residue of a control is r Theta(1) with 0 < Theta(1) < 1 for a
   conjugation-closed set of non-real zeros, so the bound with r is sufficient.
   Numerical check on cases the lane did not use: a = 0.4 + 5i, 0.65 + 2i, 0.07 + 0.9i, 2.2 + i; T = (1.3, 0.4) and
   (0, 3); two directions of eps at |eps| = 1e-8: relative defect 3e-11 to 3e-8 (order eps). Generic pole: with
   M(u) = Theta(u) (u + p)/(u - p), p = 0.7 and 2.5 (residue 2p Theta(p)), defect 6e-9 to 2e-8. The lemma holds
   for general p as stated, not only for p = 1.
3. Lemma S. Re-derived: P(u + 1) = P(-u), the zero set is closed under conjugation and under a -> 1 - a, the
   order at 1/2 is even, so P(u)/P(u+1) = product of (u - a)/(u + conj a). Correct. Elementary, not new mathematics;
   the lane labels it so.
4. Lemma D. Re-derived: ctilde(w lambda)/ctilde(lambda) = product over beta > 0, w beta < 0 of
   g(-lambda_beta)/g(lambda_beta) = (-1)^(n l(w)) c_Theta(w, lambda). The sign is +1 when the number n of zeros is
   even. For odd n (a single real zero) the sign (-1)^(l(w)) is present; the lane writes "up to sign". Correct.
5. Form (*). Re-derived: the e and s2 diagonal terms and exponents are as stated (2A + x = 1); the e x s2 cross
   terms have nu = (1, 0) and the removable singularity resolves to -M'(2 eta) + (1 + t_2) M(2 eta). Correct.
   Check on new cases (eta, g, T) = (0.13, 11.5, (0.9, 0.2)), (0.33, 2.5, (0, 2.5)), (0.02, 30, (1.7, 0.6)),
   (0.47, 0.4, (0.2, 0)), symmetric average of z_2 = 2 eta +- 1e-10 i: 1e-20 to 6e-18.
   Q with zeta's M on a finer grid (99 values of eta, 34 values of t_2 in [0, 20]): no non-positive value;
   Q/eta^2 = 4.198 at eta = 1e-3, t_2 = 0 (lane: "about 4.18") and 6.786 at t_2 = 1. Q changes sign at
   t_2 = -0.745 to -0.740, nearly independent of eta. The conclusion "no contradiction for any eta" stands: Q is
   computed from zeta's M on (0, 1) and is positive whether or not the pair exists.
6. Formula 2.1 against the direct integral for M = 1, with a different parametrisation of the kite (coordinates
   x_i = alpha_i(H), measure dx/3) and different lambda, mu, T = (0.8, 0.3), (2, 0.1): 6e-27, 5e-26.

## B. Rerun of the "pass" measurement with different cases

- Order-7 normalised Gram matrices, 18 sets per case (random, clustered, and near Re z_i = 0 / near the special
  values 1, the control zeros and the first two zeta zeros), T = (0,0), (0.2,0.7), (1.5,0), (0,1.5), (3,3).
  zeta; BLS-sym at 0.15 + 6.5i, 0.42 + 0.7i, 0.3 + 25i; BLS-right at 0.62 + 4i, 1.1 + 0.8i, 0.9 + 18i:
  0 negative sets in 35 cells of 18. Smallest normalised eigenvalue 4e-20 (BLS-sym 0.3 + 25i, T = 0, 40 digits:
  eight digits above the noise floor at worst; a sign statement at 4e-20 on 40 digits is thin and is the weakest
  number of this pass). BLS-left at 0.3 + 6.5i: 17 of 18 sets negative at T = 0, as Lemma R (a) requires.
- New targeted search the lane did not run: the residue forms lim |eps|^2 K_T(lambda, lambda) along the three
  polar divisors z_1 = 1, z_2 = 1, z_1 + z_2 = 1 (for true Eisenstein series these are truncated norms of residual
  Eisenstein series; Lemma R is one point of this family). 165 base points, 4 placements, 6 values of T including
  (0,2) and (2,0). zeta, seven BLS-sym cases (down to a = 0.02 + 0.2i, and a two-pair case), six non-real
  BLS-right cases (0.51 + 0.2i to 3 + 0.5i, 0.7 + 20i): 0 negative values of 3,960 per case. BLS-left: negative.
  So the non-real controls also pass on the loci where a violation was most likely.

## C. Errors and restrictions

- **E1 (claim too wide; must be corrected in the device row).** "BLS-right: unpaired zeros with Re a > 1/2
  (including Re a > 1) pass" is false for a single real zero. With Theta(u) = (u - a)/(u + a), a real:
  a = 0.55: 335 of 700 random chamber diagonals negative at T = 0, 13 at (1,1), 1 at (2,2);
  a = 0.75: 233 at T = 0, 3 at (1,1); a = 2: 365 at T = 0, 266 at (1,1), 120 at (2,2), 19 at (4,4)
  (for a > 1 the residue r Theta(1) is negative, which breaks S3 directly).
  These are values at regular points of the open chamber Re z_i > 0, 40 digits, normalised size 1 to 1e4, not
  noise. The following pass on the same 700 points at all six T: a = 1 single (the K-type case of Lemma D; the
  pole is cancelled), real double zeros (0.75 twice, 2 twice), conjugate pairs arbitrarily close to the real axis
  (0.75 +- 0.01i, 0.9 +- 0.05i, 2 +- 0.1i), real symmetric pairs {0.3, 0.7}, {0.1, 0.9}, a double zero at 1/2.
  Reading (ARGUED, not proved): an odd number of real zeros gives Theta(0) = -1, so M(0) = +1 in place of -1 while
  the pole at 1 remains; (I2) reads the sign M(0) = -1 together with the pole. This is a second necessary
  condition next to Lemma R; like Lemma R it is a property zeta has by the functional equation and the pole, and
  it does not touch non-real zeros. The lane tested only non-real zeros, and Lemma R (b) was read as "no condition
  on zeros with Re a > 1/2"; that sentence is correct only as a statement about Lemma R. Corrected wording:
  "BLS-right with non-real zeros in conjugate pairs (or real zeros of even total multiplicity) passes (MEASURED);
  an odd number of real zeros other than a single zero at 1 fails (MEASURED)". The same-session pass noted "not
  covered: a real" under Lemma R but did not carry it to the table. The verdict is unaffected: the passing
  controls that end the lane (BLS-sym and BLS-right with non-real zeros) still pass.
- **E2 (DH row is weaker than "first failing step S3/S4").** The lane marks DH "ARGUED, not run". Run here:
  completed DH function (functional equation checked to 6e-31, M(u) M(-u) = 1 to 4e-31), 400 random chamber
  diagonals with heights up to about 30, six values of T: 0 negative. DH's M has no pole at 1 (the function is
  entire) and M(0) = +1. So at accessible height DH passes (I2) on the sample; the claimed failure through zeros
  right of 1 (non-real poles of M) was not reached: a scan of |L_DH| on 1.02 <= sigma <= 2.4, t <= 120 found no
  zero with Re > 1, and a finer scan to t = 300 was stopped unfinished. The row should read "ARGUED from zeros
  right of 1; at low height DH passes on 400 diagonals (MEASURED)". The rank-one argument "the diagonal tends to
  minus infinity at a pole of M" is not automatic in rank 2: the coefficient of |M(z_1)|^2 is a three-term form
  whose w0 diagonal entry is positive. Not decided here. Consequence for R3: none in the lane's favour; it adds
  DH at low height to the list of controls not separated.
- **E3 (threshold description incomplete).** The lane's own `run2.log` shows that zeta's Gram form along (t, t)
  is positive again at t = -0.5, -0.75, -1 (smallest normalised eigenvalue 1.9e-8, 7.6e-6, 3.1e-4), and that the
  diagonal values change sign all together: 200 of 200 negative at (-0.05, -0.05), 0 of 200 negative at -0.1,
  -0.2, -0.35 with an indefinite Gram matrix. Reproduced here on a different sample (60 and 700 points): all
  positive at t = 0, -0.01, -0.02, -0.03; all negative at -0.05; all positive at -0.1, -0.2, -0.35; along (t, 0):
  all positive to -0.05, all negative at -0.1 and -0.2, all positive at -0.35. So "negative below the chamber" is
  not a monotone threshold, and the sentence "the threshold of T is the normalisation" in 2.2 and item 4 of the
  header describes the first sign change only. The statement that T >= 0 is the range in which K_T is a Gram
  form remains MEASURED (the lane says so in weakest step 2). Not an error in a proved step.
- E4 (minor). Header item 3 and section 4 give Q/eta^2 -> 4.18; the value at eta = 1e-3 is 4.198 and at 5e-3 is
  4.264. Consistent with "about". The count "about 4,700 Gram matrices" was not audited.
- E5 (scope, already stated by the lane). Everything is relative to the recalled inner product formula; the
  rank-one closure (row D9, Theorem C) was not re-derived here; T-NR as an infinite product, ZQ in rational form,
  NR-q, backward heat and the "not formulable" rows were not run by the lane or by this pass.

## D. Checks required by the brief

- RH assumed anywhere: no. Form (*) is evaluated under the hypothesis of an off-line pair and uses only M on (0, 1).
- Restates verified height: no. No finite-height certificate is used.
- Known theorem presented as new: no. Positivity of the truncated inner product is classical and labelled so;
  Lemma R (c) is stated to be the functional equation for zeta; Lemmas S and D are labelled elementary.
- Zeta-only mechanism: none is claimed. The controls were rerun here (section B, E1, E2).

## E. Requirement flags (set by this referee)

- R1 false. Multiplicativity enters only through the identity S1; every passing control keeps all local factors or
  ignores them (DH at low height passes on the sample).
- R2 false. No conclusion about zeros at any height.
- R3 false. BLS-sym and non-real BLS-right pass every step (MEASURED twice, on different samples); DH is not
  shown to fail.
- R4 false. No limit step exists.

Referees: 2 (one same-session, one independent). Result holds with the corrections E1 to E3 to be applied to the
device row and the control table before they are entered.
