# REFEREE (adversarial, lens: general) for c18-tz-one-sided-bound-fe-reserve-bridge/RESULT.md

Date 2026-11-19. Claimed verdict: precise-obstruction. No statement about zeros of zeta is made in the result, and none is made here.

**Referee verdict: holds, with corrections E1 to E7. One formula in the body (the term log abs(a_P) in display (A)) is wrong; the identity as worded in the verdict, in the claim and in the proposed map row (constant -u only) is correct and was confirmed on new cases, including series with a_P != 1. Flags set by the referee: R1 false, R2 false, R3 false, R4 false.**

Referee code (float64, local, through scripts/memcap.sh 8): `referee_general/ref_theorem_a.py`, `ref_prop_z.py`, `ref_prop_z_true_margin.py`. No server unit was started.

## 1. Steps re-derived

| Step | Result of re-derivation |
|---|---|
| Theorem A (a): truncation is exact on logarithmic coefficients | Confirmed. Lambda_a(n) depends only on a_m with m dividing n, so -D_P'/D_P and -F'/F agree at n <= P. C_a C_b = C_(a+b) on L^2[0, u] and C_a = 0 for a >= u hold. No multiplicativity. This step is elementary |
| Theorem A (b): D_P'/D_P = -u/2 + lim sum 1/(s - beta) | Confirmed with constant exactly -u/2 for every a_P != 0: the symmetric sum over zeros of density u/2 pi in a vertical strip tends to +u/2 at Re s = +inf and -u/2 at -inf, and D_P'/D_P tends to 0 and -u. **There is no c_0 and no log abs(a_P): see E1** |
| Theorem A (c): kernel e^((beta-1/2) abs(xi)) and point mass -u delta | Confirmed. Checked by hand on 1 + a 2^(-s) (below) and numerically |
| Decomposition e^(b abs(xi)) = -e^(-b abs(xi)) + 2 cosh(b xi), pair form 2 Re[g(z) conj g(conj z)] | Confirmed: kernel of the pair form for z = x - ib and its conjugate partner is 2 cosh(b xi) 2 cos(x xi) |
| sigma_P formula | Confirmed (2 Re 1/(1/2 + ix - beta) = 2 (1/2 - Re beta)/abs(.)^2, constant -u) |
| Pole term bound 2 u P^(1/2) abs(1/2 + it)^(-2k) norm(h_0^(k))^2 | Confirmed (k integrations by parts, Cauchy-Schwarz with sqrt u on each factor). The verdict item 1 writes "u P^(1/2) ..." without the factor 2: E5 |
| Tail law u/(pi T) | Confirmed; general form (u - 2 log abs(a_P))/(pi T) (mean of Re beta is log abs(a_P)/u) |
| Lemma R | The frequency computation is correct at x = t. The label PROVED is correct only for the last sentence (the band form contains no reflected-half term), and that sentence is the classical fact that the explicit formula with a test of support u sees only n < e^u: E3 |
| Proposition Z | Confirmed in the lattice model: tight frame bound Lg on length u <= Lg; norm of two rank-one forms u (1 + abs sinc(pi theta')) = u + Lg sin(pi theta')/pi; pair form = abs(p)(q) + abs(q)(p) with p, q = e^(+-eta s) e^(i gbar s), lowest eigenvalue u - sinh(u eta)/eta = -mu. Cubic expansion pi^2 eps^3/6 confirmed. It is a sufficient bound and far from the true model threshold: E4 |

Hand check of E1. D = 1 + a 2^(-s), a > 0, P = 2: A_P is empty, left side 0. Zeros (log a + i pi (2k+1))/log 2; sum_k e^(w_k abs(xi)) = e^(b abs(xi)) log 2 sum_m (-1)^m delta(abs(xi) - m log 2), which on abs(xi) < u is u delta. So the zero sum is u norm(h)^2 and the right side of (A) as printed is log(a) norm(h)^2, not 0.

## 2. Numerical rerun (different cases, different test vector)

h = (s(u - s))^3 e^(-s) e^(i tau s); zero lists verified complete by the argument principle on the rectangle [-40, 40] x [-T, T] (winding number equals the number of zeros found in all 14 runs).

| series a | tau | T | zeros = winding | right of 1/2 | residual with constant -u | residual with (-u + log abs a_P) | predicted tail (u - 2 log abs a_P)/(pi T) |
|---|---|---|---|---|---|---|---|
| 1,1,1,1 (P = 4) | 3 | 150 | 66 | 18 | 0.002859 | same | 0.002942 |
| 1,1,1,1 | 3 | 300 | 132 | 42 | 0.001444 | same | 0.001471 |
| P = 6, a = 1 | 5.5 | 150 | 84 | 26 | 0.004070 | same | 0.003802 |
| P = 6, a = 1 | 5.5 | 300 | 170 | 46 | 0.001879 | same | 0.001901 |
| P = 7, a = 1 | 2 | 150 | 92 | 26 | 0.004027 | same | 0.004129 |
| P = 7, a = 1 | 2 | 300 | 186 | 60 | 0.002062 | same | 0.002065 |
| 1,1,3 | 2 | 300 | 104 | 104 | -0.001162 | -1.099774 | -0.001166 |
| 1,0.5,1,0.25 | 4 | 300 | 132 | 0 | 0.004334 | 1.390629 | 0.004413 |
| 1,1,-1,2,0.5 (the lane's series) | 6 | 300 | 154 | 78 | 0.003050 | 0.696197 | 0.003179 |
| 1,1,0,-1,2 | 1 | 300 | 154 | 58 | 0.000241 | -0.692907 | 0.000237 |

Reading. (i) For a_P = 1 the identity is confirmed at P = 4, 6, 7 with the residual halving from T = 150 to 300 and matching the tail within 1 to 7 percent. (ii) For a_P != 1 the identity holds with constant -u and fails by exactly log abs(a_P) (1.0986, 1.3863, 0.6931, 0.6931) with the printed constant. (iii) The lane's non-multiplicative series, whose row "did not check the identity" there because of an incomplete zero list, checks here with a complete list. Float64, not ball arithmetic.

Lattice model (Lg = 12): at mu = margin the lowest eigenvalue of T is 7.55, 6.18, 2.36, 0.48 at theta' = 0.55, 0.7, 0.9, 0.98 (bound: 0). Proposition Z holds in every case run. The true lowest eigenvalue at eta = 0 is close to 2 Lg (1 - theta') near theta' = 1 (2.38 at 0.9, 0.48 at 0.98, 0.000 at 1.0) and at theta' = 1 it is negative for every eta > 0 tried (-0.028 at eta = 0.01). So "zero at theta' = 1" is confirmed for the model itself, not only for the bound.

## 3. Errors and restrictions

- **E1 (error in display (A) and in step (b)).** The term log abs(a_P) is spurious. Correct statement: -2 Re <h, A_P h> = -u norm(h)^2 + sum over zeros of <h, kappa_beta h> for every a_P != 0, and D_P'/D_P = -u/2 + lim sum 1/(s - beta) with no further constant. The sentence "c_0 is absorbed in the term log abs(a_P)" is to be deleted. Zeta (a_P = 1) is unaffected; the verdict item 1, the claim and the proposed map row already have the correct constant. The control statement "holds verbatim for Davenport-Heilbronn" is true only with the corrected constant, and needs a_P != 0: for the DH series a_n = 0 at multiples of 5, so P must not be a multiple of 5 (otherwise the point mass is -log(P - 1), not -log P).
- **E2 (novelty).** Theorem A is the explicit formula of the exponential polynomial D_P (Hadamard product plus the two limits of D_P'/D_P) composed with the elementary fact of step (a). It is a correct identity and may be new to the campaign record; it is not a new theorem. Label: PROVED, CLASSICAL in content. The check supports it at P = 3, 4, 5, 6, 7, 8 and four series with general coefficients, float64.
- **E3 (Lemma R label).** "PROVED" covers only the consequence drawn from (EF) and Theorem A, which is classical (compact support of the test). The frequency sentence is a heuristic about values of zeta, while the form pairs with the logarithmic derivative; log(1 + F_2/E_P) has no convergent expansion in the frequencies of F_2 where D_P has zeros right of the line, which is the case. The bound "at least u" holds at x = t and up to O(abs(x - t)/t) in a window. Reword as CLASSICAL plus ARGUED.
- **E4 (Proposition Z: bound against threshold).** "The margin is Lg (pi^2/6)(1 - theta')^3: it closes cubically" describes the sufficient bound. In the same model the lowest eigenvalue of the exchange at eta = 0 closes about linearly (about 2 Lg (1 - theta')), and ZQ passes for eta about ten times the root of the bound at theta' = 0.9 (pass up to eta near 0.1; bound root 0.0097). The conclusion (pass for theta' < 1, no margin at theta' = 1) stands and is stronger than stated. The rate statement should be attached to the bound.
- **E5 (factor 2).** Verdict item 1 gives the pole bound as u P^(1/2) t^(-2k) norm^2; section 2.2 and the map row give 2 u P^(1/2) abs(1/2 + it)^(-2k) norm^2. The second is the proved one.
- **E6 (measured fraction).** "34 to 41 percent of the zeros of D_P have Re beta > 1/2 at P <= 30" uses the rows whose zero lists the lane itself reports as incomplete. With complete lists: 18/52, 24/76, 30/98 (lane) and 18/66, 26/84, 26/92 at T = 150, 42/132, 46/170, 60/186 at T = 300 (referee): 27 to 35 percent at P <= 8. The qualitative use (completion C1 does not reproduce the band data) is unaffected. The proposed map row says "about 35 to 40 percent" and should say "about 27 to 35 percent at P <= 8, height <= 300".
- **E7 (scope of the R3 sentence).** Verdict item 5 ends "R3 is not attainable for this conclusion" without the qualifier that section 7 and weakest step 1 carry: the pass of ZQ is PROVED in the lattice model only. On zeta's ordinates the lower frame bound of the on-line zeros on a band u < Lg is not known to be positive in every window (under the target it is >= 0), so the transfer "holds for zeta implies holds for ZQ" is not established outside the model. The sentence should read "in the lattice model".

## 4. Other checks

- RH is not assumed in any PROVED step. The E_a row and the sentence "for zeta the same ceiling is never crossed if its zeros are real" are conditional and are marked so (weakest step 1). Completion C0 is stated as an equivalence with the target in the window, not used.
- No verified-height input is used anywhere.
- (EF) is taken from c15 Lemma 1 and not re-derived by the lane; sign and shape (zero sum = Arch - primes + pole pair, Arch symbol 2 theta') agree with the Weil formula. The numerical checks of this file and of the lane test Theorem A only, which does not depend on (EF). Lemma 1 (L1) is therefore PROVED relative to the c15 normalisation.
- Window term: ARGUED, constant not computed; the first-order term norm(h_0')/t is correct.
- Lemma C: the argument is a sketch; with F_1 = E_P = e^(i theta) D_P the function is not a finite sum of exponentials, so the reading "F_1 = E_P gives (L1)" is by Theorem A and (EF), not by Lemma C. The readings for xi + alpha xi' are ARGUED/CLASSICAL as labelled.
- Controls. The mechanism claimed is not zeta-only (the lane says no step separates zeta), so there is no zeta-only step to break. Run by the referee: the identity on non-multiplicative and general-coefficient series (holds, section 2); ZQ in the lattice model (passes, section 2). DH data recalled in the table (first off-line zero 0.8085 + 85.70 i, u b <= 1.30 with conductor 5 at theta' <= 1) are consistent. Rows DH, E_a, T-NR for P > q, NR-q, chains, backward heat remain ARGUED and not run, as the lane states.

## 5. Requirement flags (referee)

- R1 false. The only proved identity holds for every Dirichlet series with a_1 = 1 and a_P != 0 (confirmed numerically on non-multiplicative series). Multiplicativity enters nowhere.
- R2 false. No inequality is established for zeta at any height or band.
- R3 false. ZQ passes in the model; no structural failure of any control is established.
- R4 false. Nothing passes to the critical line; for theta' < 1 the conclusion, if it were proved, would leave pairs below the one-pair threshold.

## 6. Surviving claim

Exact identity (PROVED; classical in content; float64 checks at P = 3 to 8 and four general series): for a_1 = 1, a_P != 0, u = log P, h in H^1_0[0, u], -2 Re <h, A_P h> = -u norm(h)^2 + sum over zeros beta of D_P of the forms with kernel e^((beta - 1/2) abs(xi)), with no log abs(a_P) term, truncation tail (u - 2 log abs a_P)/(pi T); no multiplicativity is used; pole term at most 2 u P^(1/2) abs(1/2 + it)^(-2k) norm(h_0^(k))^2. In the lattice model ZQ passes the band-u device for theta' < 1 at M = 0 whenever mu(eta, u) <= Lg (1 - theta' - sin(pi theta')/pi) (a sufficient bound, not the threshold), and the model has no margin at theta' = 1. Outcome for the map: precise obstruction; N(theta) below the Nyquist band is an open condition in the model; the other control rows are ARGUED.
