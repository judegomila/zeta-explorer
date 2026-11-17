# REFEREE report on r3-lemma181-a/RESULT.md

Adversarial referee, 2026-11-16. Claimed verdict: precise obstruction. Referee verdict: **holds, with one proof
repair and two narrowings of the headline**. No abscissa below 0.874886647 is claimed and none follows. All
statements remain relative to the unrefereed manuscript, Xu-Sang 2610.15291 and Liu 2610.26835.

## Checked against the sources (line by line)

* Manuscript Lemma 18.1 (paper.txt l.9354-9390): statement, (18.2), (18.3) n1 + n2 + 6 kappa z <= M, hypothesis
  beta_* <= (1+kappa)/2. Matches RESULT section 1.
* Manuscript Lemma 8.2 (8.2) |S_m|^2 << U^{delta min(m,1-m)+eps}; Prop 8.3 (8.3)-(8.4): witnesses share one
  presentation psi in X_u selected by a label in Theta x {+-1}; both have twist height gamma - nu, |gamma| up to
  (3i+1)T_1; profiles smooth annular. Matches.
* Xu-Sang section 2.2 (normalisation S_psi(m;W) = U^{-m/2} Sum psi(n) W(Nn/U^m)), (6)-(7), (9), Prop 4.1 with
  A_I, A_P, r*(t), R_sh, R_long, t*; Prop 5.1 with (23), (25), (26). Matches. The Hoelder step (3/4, 1/4) between
  #B = U^R and the full-family fourth moment U^{1-2 q z_p} is exactly what the source does.
* Liu II (14.3), (14.5), (14.7), (14.16). Matches. The H row of the certificate (constant a + hk, gradient
  (-hk, -(1/2+theta), hk + g - 1/2) in (lx, ly, l)) is (14.7) at d = h with h = 1 - lx + l. Re-derived.

## Re-derived by hand

* Corollary R1 identity: with R = A_P(m), c = 1/(3 kappa), q = delta x, theta = qc/2:
  (1-R)/4 = delta m/2 + qc/4 - qcm/2, hence (3R+1)/4 - theta/2 = R + m(delta/2 - theta). Holds for every class.
* R = R_sh(t*) = A_P(t* - r*(t*)) by construction of Prop 4.1, so m_p = t* - r*.
* K - theta/2 = 2/3 at the critical class is not a coincidence: the lx and ly stationarity equations of the
  certificate give hk = 1/2 + theta, i.e. K + theta/2 - 1/6 = 1/2 + theta.
* Lemma S, Lemma T (second moment, sixth-moment threshold omega < (1-R)/2), Lemma C: algebra confirmed.

## Rerun (independent script, double precision, own Newton solver)

R_c = 0.5903323535, m_p = t* - r* = 0.4182536338, A_P(m_p) = A_I(r*) = R_long(t*) = R_c, K - cap/2 = 0.6666666667,
R - m_p delta/2 = 0.4921797572, 1 - delta = 0.5306551413; table rows 0.743001, 0.665845, 0.914258 reproduced.
Certificate: B(0) = 0.87488665, B(1e-4) = 0.87486836, B(1e-3) = 0.87470361, B(1e-2) = 0.8730362,
B(3e-2) = 0.86919801, B(0.0426768) = 0.86666667; slope -0.183. All agree with RESULT 6.1.
The LP columns (6.1 LP, 6.2, 6.3) were not rerun; they are MODEL.

## Errors and gaps

1. **Theorem R, proof step "group the O((log U)^2) dyadic twist heights omega_u, and apply (*)" is wrong as
   written.** (*) is a bound at one common t. The witness height omega_u = gamma_u - nu_u varies with the row over
   a range of length about T_1 (Prop 8.3); a dyadic grouping does not make it common. Repair: bin omega_u into unit
   intervals j + [0,1), replace |W~(theta + iv)| by sup over a unit shift (still rapidly decaying, uniformly in
   the smooth family), apply (*) at t = j + v' per bin, sum over the O(T_1) bins. Result:
   #B_P(m) << T_1 U^{N - m(delta/2 - theta) + eps} (1+H)^A. The extra factor T_1 is of the same kind as the
   (1+T_1)^A factors in every source statement (tau chosen late), so the exponent conclusion is unchanged; the
   stated loss "A eta" should read "(A+1) eta". Also H must cover (3I+1)T_1 plus the frequency allowance, not
   2 T_1. Repairable; conclusion stands.
2. **Headline item 2 and item 3 overstate the scope.** "Any numerator saving d implies a count saving d on the
   plain-witness rows" is proved only for rows whose witness presentation induces the numerator character up to
   conjugation (nu = 1). Prop 8.3 lets the label in Theta vary with the row and no source bounds the nu = 1 share.
   Correct statement: a saving d in (25)/(14.16) forces #{u in B_P(m_p): nu_u = 1} << U^{R-d}. RESULT says this in
   Scope (i) and weakest step 1, but not in the verdict block. Likewise "cannot be had without a count saving on
   the plain branch" should carry "on its nu = 1 part".
3. **"Obstruction" is a reduction, not an impossibility.** Theorem R shows a numerator saving is at least as
   strong as a count saving on a sub-branch. It does not show the saving is false, and RESULT does not show a
   class with #B_P = U^R exists (Scope (iii) says so). The phrase "contains no Hoelder loss that can be removed"
   is correct only in the form "cannot be removed without also improving A_P(m_p) on the nu = 1 rows".
4. **Section 6.2 coupling.** The statement that a numerator saving d is worth about -(0.183 + 0.0225) d assumes
   the entailed count saving covers the whole plain branch. Theorem R entails it only on the nu = 1 part, so the
   extra -0.0225 d is not implied. MODEL only; no proved statement depends on it.
5. Lemma C chord on (1/10, delta/2]: the sources restrict theta <= min(a - 1/2, 1/10) ((14.6), section 14.5).
   Immaterial because the chord gives no gain.
6. Section 5 rows "Halasz-Montgomery" and the Burgess remark are heuristic and unlabelled as proofs; they are not
   used by any PROVED statement. The list of tools is not exhaustive and is not claimed to be.

## Ways around the obstruction (not closed by RESULT)

* A numerator estimate sensitive to the fixed twist: rows whose detected zero belongs to nu chi(u)^{+-1}, nu != 1,
  have no forced numerator size.
* Rows of the second kind (long inverse witness r = t* = 1.164, no plain witness): they can carry the full count
  and Theorem R does not constrain their numerator. A restricted fourth moment on those rows is not excluded.
* Lowering the prime cost 6 kappa in (18.3) changes A_P(m_p) and the numerator together; this is the only lever
  that passes Theorem R directly (RESULT section 9, priced 0.8736974 for cost 3 kappa, MODEL).
* Localisation in t does not help: the forced mass sits within O(U^eps) of the row's zero ordinate inside a range
  of length T_1 = Z^tau, and the method needs (1+T_1)^A <= U^eps.

## Dependence on unrefereed inputs

Lemma R: none (classical). Theorem R: Prop 8.3 form of the witness only. Corollaries R1-R3 and everything in
sections 1, 2, 5, 6: manuscript Lemma 18.1, Lemma 8.2, Prop 8.3, Lemma 17.1/17.6; Xu-Sang Prop 4.1, 5.1 and
Lemma 2.1 (kappa down to 13/18); Liu II (14.3)-(14.9). Lemma 18.1's own proof was not re-verified here either.

## Verdict

holds = true after repair 1 and narrowing 2-3. Surviving claim: on the rows of a class that carry a plain
witness of length U^{m_p} for the numerator's own character, the averaged numerator exponent
(3R+1)/4 - theta/2 at theta = q/(6 kappa) equals count exponent plus forced size, so any saving d in
(25)/(14.16) implies #B_P^{nu=1}(m_p) << U^{R-d} (up to (1+T_1)^{A+1}). No abscissa change. Prices are MODEL.
