# REFEREE: c9-szego-sum-rule-prime-cascade (lens: general)

Date 2026-11-18. Claimed verdict: precise-obstruction. Referee verdict: **holds, with corrections E1-E8 below** (scope and wording; no PROVED step failed). No statement about zeros of zeta is made in the result and none is made here. Flags set by the referee: R1 false, R2 false, R3 false, R4 false.

Referee runs: scratch scripts outside the repository (float64 numpy and mpmath at 20 digits, through `scripts/memcap.sh 8`, about 1 min each, local); they are not kept in the lane directory, and their output is quoted in section 2. The server was not used.

## 1. Re-derivation of the PROVED steps

| Step | Referee derivation | Outcome |
|---|---|---|
| Lemma 1, stage case | z = u p^(-sigma-iT), dz/dT = -i log p z, d/dT Li_2(z) = i log p log(1 - z), so d/dT [Im Li_2(z)/log p] = log abs(1 - z) = -log abs(F_p). arg F_p = Im sum z^k/k, integrated in x from sigma: Im Li_2(z)/log p. Hence int_W log abs(F_P) = Phi_P(T) - Phi_P(T+H) for sigma > 0 and every u. Sign convention agrees with Titchmarsh 9.9 | confirmed |
| Lemma 2, stage | mean of abs(1 - r e^(i theta))^(-2) is 1/(1 - r^2); mean of log abs(1 - r e^(i theta)) is 0; independence of the circles gives the product | confirmed |
| Lemma 2, (KS) | E = log M_2 - M_log, M_log = lim (2/T) int log abs(G) = 4 pi delta by Lemma 1 once Phi(T) = o(T); M_2 = zeta(2 sigma) for sigma > 1/2 (classical for zeta) | confirmed as an identity; it is the statement M_log = 4 pi delta (Littlewood) rewritten |
| Lemma 3 | B_W additive on products with no zero or pole on the three sides; stubs have none in Re s > 0; so B_W(G) = B_W(G times finite product of inverse stubs) | confirmed |
| window form of (KS) | E_W = log m_2 - (2/H) int log abs(G), substitute Lemma 1 | confirmed |
| Lemma 4 | flow T -> (-T log p)_p is equidistributed on the torus (log p independent over Q); arg u_p is a translation and Haar measure is translation invariant | confirmed; classical (row Q21), not new, stated as such |
| Lemma 5 (a) | abs(p_{n+1}^(-s) - p_n^(-s)) = abs(s int x^(-s-1) dx) <= abs(s) g_n p_n^(-sigma-1); g_n <= p_n (Bertrand); sum g_n p_n^(-2 sigma-1) < infinity for sigma > 0 | confirmed |
| Lemma 5 (b) | E abs(u' a' - u a)^2 = abs(a)^2 + abs(a')^2 | confirmed as a statement about the expectation; see E2 |
| Lemma 5 (c) | (x + y)^2 <= 2x^2 + 2y^2; abs(eps' - eps)^2 = 4 only when exactly one of p_n, p_{n+1} is in S; each p in S enters at most twice, with p_n >= p/2 | confirmed; convergence of sum_S p^(-2 sigma) for 2 sigma > b follows from the counting function of S |
| Lemma 6 | K(z,z) = prod (1 - abs(z_p)^2)^(-1) on H^2 of the infinite torus; at z_p = p^(-delta-it) this is zeta(2 delta) | confirmed given the kernel; see E6 |

## 2. Numeric checks rerun with different cases

- Lemma 1 at stage level, new cases: sigma = 0.6, H = 7, P = 3000; sigma = 0.3, H = 4, P = 500; sigma = 0.05, H = 3, P = 100; windows at T = 0, -2, 53.7, 1234.5, 98765.4; objects ZETA, LIOU, a new random U (seed 424242), THIN, WT with alpha = 5.1. max abs(LHS - RHS) between 3.8e-13 and 5.5e-11 (largest at sigma = 0.05). The identity holds for every object, including sigma below 1/2.
- Lemma 1 for zeta (mpmath, 20 digits): sigma = 0.6, window [40, 52]: B_W = 0 to 10 digits; sigma = 0.3, window [10, 20]: LHS 2.6142939925, phase difference 1.3576569311, B_W = 0.2000000000 = 1/2 - 0.3 for the zero at 14.13. The functional reads a zero to the right of the line of integration with the stated sign and weight.
- DH (mpmath): kappa = 0.28407904384; abs(f) at 0.8085171825 + 85.6993484854i is 6e-11; second zero located at 0.6508300806 + 114.1633427308i. Different case: sigma = 0.7, window [82, 89]: LHS 0.8436935473, phase difference 0.1618599809, B_W = 0.1085171825 = 0.8085171825 - 0.7. The value 0.0585171825 of the result (sigma = 0.75) is consistent.
- Difference functional, new height T = 37 (fixed, not averaged), P = 10^2 ... 10^7:
  - sigma = 0.5: ZETA 3.2001, 3.5163, 3.5238, 3.5239, 3.5239, 3.5239 (converged); LIOU identical; WT (alpha 5.1) converges to 4.0356; two new random U: increments 0.77, 0.56, 0.45, 0.36, 0.31 and 0.74, 0.57, 0.45, 0.37, 0.31 (against 0.81, 0.58, 0.45, 0.36, 0.31 for 2 log log); THIN increments 0.77, 0.51, 0.32, 0.21, 0.14.
  - sigma = 0.3, T = 3.3: ZETA converges to 3.3381; random U and THIN grow like a power of P.
  - sigma = 0.47 (above b/2 = 0.45): THIN increments 1.08, 0.82, 0.59, 0.44, 0.34, decreasing slowly; float data at P <= 10^7 do not decide convergence at this sigma; the statement rests on Lemma 5 (c), which was re-derived.
  - Bounds of Lemma 5 (a) and (c) evaluated: SZ_zeta = 3.52 against 509 (sigma 0.5, T 37); SZ_THIN = 5.60 against 25.3 (sigma 0.5, T 10). Both hold.
- THIN: counts 280 (below 10^4) and 74363 (below 10^7) reproduced. sum over p in S, p <= X of p^(-b) minus (1/2) log(log X/log 2): -0.31410, -0.31770, -0.31799, -0.31787, -0.31787, -0.31787 for X = 10^2 ... 10^7. The logarithmic singularity at s = b with coefficient 1/2 is present, consistent with the simple zero at b (refereed in `c4-thin-twist-control-78`).
- Lemma 4, different stage: P = 30 (10 primes), sigma = 0.6, 4000 heights in [10^6, 10^8], functionals SZ, log abs(F), arg F. KS against the new random U: ZETA p = 0.99, 0.22, 0.33; second random U p = 0.097, 0.39, 0.57; THIN 0.22, 0.93, 0.67; LIOU 0.47, 0.55, 0.99; WT 0.63, 0.17, 0.70. Ranges agree (SZ from 0.23-0.34 to 3.33-3.47 for all six objects; the T = 0 value for zeta, 0.0517, lies outside every sampled range, as expected for a single torus point). No separation.

Not rerun: N2, N5, N6b. `stage.log`, `tail.log`, `limit.log` were compared line by line with the tables of the result; the table entries match the logs.

## 3. Errors and corrections

**E1 (Lemma 3, semicontinuity remark; conditional, not established).** The remark uses weak convergence of abs(F_n)^2 dt to abs(G)^2 dt on a window of the line Re s = sigma. For 1/2 < sigma <= 1 this convergence is not established for the stages (N6b of the result shows that the phase side of the stages does not converge at sigma = 0.75 without the pole correction). The remark stands as "if the stage weights converge weakly, upper semicontinuity gives the same direction as B_W >= 0". The tail-invariance statement itself is unaffected.

**E2 (Lemma 5 (b) and the claim line "diverges for random U at 1/2").** The lemma proves that the expectation is infinite for sigma <= 1/2. Almost sure divergence needs one more step, which holds: the terms X_n = abs(u_{n+1} a_{n+1} - u_n a_n)^2 are nonnegative, bounded by 4 times 2^(-2 sigma), and the subsequence X_{2n} is independent with sum of expectations infinite, so sum X_{2n} = infinity almost surely (Kolmogorov three-series theorem). The claim is true; the label of the almost-sure statement should be "PROVED with this step added". Two new random sequences confirmed the 2 log log P growth.

**E3 (N3: "sigma < b/2: divergent, as Lemma 5 (c) predicts").** Lemma 5 (c) is an upper bound and predicts nothing below b/2. Divergence for sigma <= b/2 at fixed t needs a lower bound: at a sign change the term is abs(a_{n+1} + a_n)^2 = p_n^(-2 sigma) abs(1 + (p_{n+1}/p_n)^(-s))^2 >= c p_n^(-2 sigma) once abs(s) g_n/p_n is small, so the sum dominates c sum over p in S of p^(-2 sigma) (for members of S with a neighbour outside S, which is all but a thin subset). This is short but is not in the result. Status of "THIN diverges for sigma <= b/2": ARGUED plus MEASURED, not PROVED. It is not used in the verdict.

**E4 (scope of "the Simon-Zlatos rule for the prime chain").** The Simon-Zlatos theorem concerns one measure on the circle with Verblunsky coefficients alpha_n. The measure with Verblunsky coefficients alpha_n(t) = u_n p_n^(-sigma-it) in delay order is not abs(F)^2 on a vertical line, and no theorem of this family is stated for a product over incommensurable delays. Lemma 5 is therefore a statement about a coefficient condition only: the condition holds for zeta on Re s > 0 and for THIN on Re s > b/2. The sentence "the condition does not imply the absence of zeros to the right of the line" is correct in the sense "the condition is compatible with a zero at b"; there is no theorem whose conclusion THIN refutes. The result says this in weakest step 2; consequence 1 ("a crossing of the kind the assignment looks for") and the device row should carry the same qualifier.

**E5 (verdict scope).** "Szego-type sum rules do not give a crossing device" is established for: the Littlewood window functional (Lemmas 1, 3), the mean form (KS), any stage functional continuous in the phases (Lemma 4), the difference condition (Lemma 5 with THIN), and the H^2 point-evaluation step (Lemma 6). It is not a theorem about every sum rule; the result states this (section 7 item 2, `not_covered` in DEVICE_NODE.json). The device node should be recorded as closed for these five forms, not for the family.

**E6 (Lemma 6 is a known theorem).** That Dirichlet series with square-summable coefficients converge and are analytic exactly on Re s > 1/2, with point evaluation bounded there by zeta(2 Re s)^(1/2) and unbounded on the boundary, is Hedenmalm-Lindqvist-Seip (1997) and Cole-Gamelin. Lemma 6 is this theorem shifted by sigma_0. The result labels the kernel CLASSICAL and calls the lemma a second derivation of row Q10; item (iii) of "New against the map" should read "restated", not new. "Loses depth exactly 1/2" is exact for the norm of point evaluation; it does not exclude other uses of H^2 convergence.

**E7 (wording that leans on unproved location of zeros).** Control row EA: "sigma > 1/2 + a, which is the line of its zeros". Unconditionally: the line that carries the translates of the critical-line zeros of zeta. The row is labelled ARGUED and is not used in the verdict. No other step assumes RH. N6a (B_W = 0 for zeta in three windows at sigma = 0.75) restates verified height and is presented as a check of the identity, not as a result.

**E8 (minor numeric wording).**
- N3 (a): "small exactly when Q is larger than about 10 T". The measured ratio at Q = 10 T rises with T (0.048, 0.089, 0.147, 0.211, 0.336 for T = 10 ... 10^5). The bound of Lemma 5 (a) with mean square gap of order log^2 Q gives a crossover near Q of order T log T, not a fixed multiple of T.
- N3 (b): the sigma = 0.4 values quoted (ZETA 0.0414 to 0.0415, U1 4.6 to 18.1, THIN 6.8 to 17.3) are all at T = 0 (checked in `stage.json`); T = 0 is a degenerate point for zeta. The T = 10 rows of `stage.log` for zeta at sigma = 0.4 (4.72, 4.66, 4.70, 4.65, 4.83) are means over 40 random heights and do not show convergence by themselves. The referee run at fixed T = 37 does: 5.0657, 5.9679, 6.0011, 6.0019, 6.0019, 6.0019.
- N4: SZ and C1 are affinely related at a fixed stage (SZ = constant - 2 C1), so their KS statistics coincide; the 40 p-values are 30 distinct tests. The count "3 below 0.05, none below the Bonferroni level" is correct.
- N2: "largest sampled values (2.0 to 2.8)": the logs give 1.90 to 2.82.
- N7: "f is a sum of two chains (u_p = chi(p) and its conjugate)": chi(5) = 0, so the local parameter at 5 is not unimodular. Does not affect the statement that log f is not a sum over primes (a(6) - a(2)a(3) = 1.0807 confirmed).

## 4. Controls

The result claims no zeta-only mechanism, so there is no separation to test; the referee instead checked that the controls do pass. U (new seed), LIOU, THIN and WT (new alpha) satisfy the stage identity to rounding at three values of sigma; LIOU has identical difference sums to zeta; WT converges like zeta; THIN keeps a convergent bound at sigma = 0.5 and 0.75 with its logarithmic singularity at b = 0.9; random U separates from zeta only in the limit P -> infinity at fixed t. DH: the limit identity holds and reports the off-line zero at two values of sigma. HEAT, EA, Beurling, the phase-rotated transfer operator, theta^w and T-NR as a function were not run by the result or by the referee; the control table of the result labels them ARGUED or NOT-RUN, which is accurate.

## 5. Requirement flags (referee)

| Flag | Value | Reason |
|---|---|---|
| R1 | false | additivity over stubs is used, but U, THIN, LIOU, WT satisfy every identity and condition; nothing in the result is specific to the multiplicative structure of zeta |
| R2 | false | window values fluctuate at every stage; the bound of Lemma 5 (a) carries abs(s)^2; the uniform bound is the l^1 quantity |
| R3 | false | U, THIN, LIOU, WT, FM pass every step; DH and HEAT fail only at chain formation; five controls not run |
| R4 | false | the convergence step reaches Re s > sigma_0 + 1/2 > 1; the difference condition has no implication for zeros |

## 6. Verdict

Holds as a precise obstruction for the five forms listed in E5, with corrections E1-E8. The surviving content: (i) the Littlewood window functional has coefficient side 0 at every stage for every unimodular chain and is a tail invariant; (ii) the mean form is the classical density identity; (iii) at fixed stage zeta and U are not separated by any continuous functional of the phases (Kronecker-Weyl, known); (iv) the difference condition holds for zeta on Re s > 0 and for THIN on Re s > b/2, so it is compatible with a zero to the right of the line; (v) the H^2 point-evaluation step reaches only Re s > 1 (known theorem). Nothing is new as a theorem apart from the elementary Lemma 5 and the tail invariance of Lemma 3; none of it is a statement about zeros of zeta.
