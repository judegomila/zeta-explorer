# REFEREE (adversarial, lens: general) for c3-twinladder-prime-built-chain/RESULT.md

Referee verdict: **the obstruction holds; four statements in the note need correction (E1-E4), none of them a PROVED step.** No statement about zeros of zeta is made in the note and none is established. Requirement flags set by the referee: R1 false, R2 false, R3 false, R4 false.

Checks were run locally through `scripts/memcap.sh 8` with mpmath 1.4.1 (dps 30-120), independent code, not the lane's `stage.py`. Nothing is interval-certified. The compute server was not used.

## 1. PROVED steps, re-derived

| Step | Re-derivation | Status |
|---|---|---|
| Lemma 1 (identity for abs(theta_p)^2 - 1) | Expanded both moduli; difference = (p^(-sigma) - p^(sigma-1))(p^(-sigma) + p^(sigma-1) - 2 cos(t log p)); matches. Twisted form with cos(t log p - arg u) checked at 300 random points (sigma in [-1,3], abs(t) <= 500, all primes <= 499, random unimodular u): max relative error 2.2e-38. | confirmed |
| Lemma 2 (a) simple poles at 1 + 2 pi i k/log p | Other theta_q finite and nonzero there (irrationality of log q/log p); Gamma((1-s)/2) finite nonzero for t != 0. New case p = 3, k = 2: eps*Theta stable between eps = 1e-12 and 1e-11, modulus 0.353 (X = 3), 0.666 (X = 5), 0.303 (X = 47). | confirmed |
| Lemma 2 (b) order pi(X)+1 at s = 1 | eps^(pi(X)+1) Theta_X(1+eps) converges: 1.44270 (X = 2), 0.43517 (X = 5). | confirmed |
| Lemma 2 (c) simple poles at 3, 5, 7, ... | Closed-form residue -2 (-1)^k pi^k /(k! L(2k+1)) prod theta_p(2k+1) compared with eps*Theta: s0 = 5, X = 3: -0.1044185815 both; s0 = 7, X = 5: -2.365386518e-7 both; s0 = 3, X = 2: -11.51453847 both (the note's -11.5). | confirmed |
| Pole count T theta(X)/pi + O(pi(X)) | sum over p of 2 floor(T log p/2 pi), counting both signs of Im s. | confirmed |
| Lemma 3 (no open set of Pick positivity) | Extension theorem for positive Pick kernels on arbitrary sets + identity theorem on the connected domain of holomorphy; valid. Uses a recalled classical theorem. | confirmed modulo the classical input |
| Infinite negative index | Krein-Langer: finite kappa implies Theta = B^(-1) S with B a Blaschke product of degree kappa, so finitely many poles. Infinitely many poles exclude every finite kappa. | confirmed modulo the classical input |
| Limit in Re s > 1 | abs(theta_p) <= (1+p^(-sigma))/(p^(sigma-1)-1) -> 0; all theta_p bounded on compacta of Re s > 1; so Theta_X -> 0, E_X^# -> 0. Theta_inf = -s/(s-1) checked to 2e-41. New point s = 2.5 + 20i: K_499 = 4.0232236e-12, Hardy value 4.0232252e-12. Rank-one algebra for both normalisations re-derived. | confirmed |
| Smoothed stage | Theta = Theta_arch exp(sum Lambda(n)/log n (n^(s-1) - n^(-s))); unbounded as real s -> +infinity. | confirmed |
| Lemma 4 (axis lemma) | theta^(c) = y(y-a)/(1-ay) with y = p^(c-s), a = p^c: checked algebraically and numerically (c = -0.7, 0, 0.5; error < 3e-41). Gamma poles at 2c+2k: some are cancelled by zeros of 1/L when c is a negative integer, but infinitely many remain for every c. | confirmed |

## 2. Errors and overstatements

**E1 (MEASURED claim wrong as stated).** "xi_X has off-line zeros in the strip from X = 5" is an artefact of the window t < 60 and of the normalisation.
- Symmetric normalisation (zeros of 1 + Theta_X): X = 2 has a zero at 0.788462363074 + 72.783980891649i (residual 3e-40, winding number 1 on a circle of radius 0.002).
- Assigned normalisation: xi_X = E_X + E_X^# with E_X = (s-1) L P_X has zeros where 1 - (s/(s-1)) Theta_X = 0, not where 1 + Theta_X = 0. The sentence "Zeros of xi_X are zeros of 1 + Theta_X" is false for the object assigned in section 1; the table is for the symmetric normalisation only. For the assigned one, off-line zeros in the strip with t < 60: X = 2: 3 (first 0.7600409739 + 26.74138337i), X = 3: 5, X = 5: 11.
- Correct statement: off-line zeros in 1/2 < sigma < 1 occur already at X = 2 in both normalisations (measured, winding-checked, not certified). This strengthens the obstruction; the threshold "X = 5" should be removed.

**E2 (imprecise threshold).** "theta_p is contractive for all t only when p^(sigma-1) + p^(-sigma) >= 2, about sigma >= 1 + log 2/log p", then "not a contraction ... on any half-plane Re s > c with c < 1 + log 2/log p". The exact threshold sigma*(p) solves p^(sigma-1) + p^(-sigma) = 2; for p = 2 it is 1.771553, not 2. For sigma*(p) < c < 1 + log 2/log p the factor is a contraction on Re s > c. The second sentence should use sigma*(p). No effect on the strip.

**E3 (summary overstates Lemma 4).** "The Euler factor is lossless about exactly one vertical axis, Re s = 0" (summary item 4 and the claim). Lemma 4 itself shows theta_p^(c) is inner on Re s > c for every c <= 0 (y times a Blaschke factor). What is unique to c = 0 is the conjunction "ratio inner and factor analytic in the half-plane". The conclusion needed for the lane (not inner about c = 1/2) is unaffected.

**E4 (control row).** Section 4, row TW: "Lemma 2 poles move to Re s = 1 + log abs(u)/log p" is right, but for abs(u) < p^(-1/2) they leave Re s > 1/2 altogether; then the Euler poles (a) are absent and only (b)/(c)-type gamma poles remain. "Same failure" is correct only through the archimedean poles in that range. Minor.

**Not errors, but limits of what is shown.**
- "No limit in the strip" is measured at 12 points, X <= 499; it is not proved (the note says so in weakest step 2).
- The height threshold for on-line zeros in sigma <= 3/4 is ARGUED; the referee re-derived the per-prime bound (sigma - 1/2) * 2 log p/(p^(1/4) - 1) from the sigma-derivative, which supports it, with Stirling constants unchecked. For X = 2 the threshold is t > about 9.6e3, consistent with the X = 2 zero at t = 72.8 having sigma = 0.788 > 3/4.
- Gonek's theorem is recalled, not opened; nothing depends on it.
- Novelty: the pole list of P_X(1-s) on Re s = 1 and the non-inner ratio are elementary; the note says the pivot restates rows G10/Q10. The de Branges phrasing (infinite negative index per stage, density theta(X)/2 pi per unit length equal to the Nyquist density of the axis-0 Paley-Wiener chain) is a restatement in new terms, not a new wall. It is not presented as a theorem about zeta.
- The route atlas of PR 27 was not re-read by the lane (stated).

## 3. Numeric reruns with different cases

- JSON audit of `stage_T123.json`: zeta negative at 14 of 20 points, 88/90/93 negative stages at t = 40, no monotone sequence in any of the 60 (point, normalisation) cases for zeta, Liouville or random U; strip up-counts 47..64 for zeta. All as stated. (Random U: strip up-counts range 40..66, slightly outside the range quoted for zeta; the note quotes the range for zeta only.)
- Pick matrices, new boxes, N = 20, dps 120: X = 3 on [0.6,0.9] x [30,32]: max abs Theta 0.769, lowest eigenvalue -8.1e-4, 5 negative; X = 3 on [0.6,0.9] x [100,101]: max abs Theta 0.885, lowest -0.915, 3 negative. Consistent with Lemma 3.
- Reported zeros X = 5, 7, 23 reproduced to 12 digits, residual < 1e-39, winding number 1 each.
- New window 60 < t < 100, 1/2 < sigma < 1 (grid 0.005 x 0.01), symmetric normalisation: X = 2: 1 zero, X = 5: 0, X = 7: 2; assigned normalisation: 3, 11, 12. Counts are lower bounds.

## 4. Controls run by the referee

No zeta-only mechanism is claimed, so the controls test the claim "no separation".
- Liouville (u = -1), window 60 < t < 100: off-line strip zeros X = 2: 1 (sym) / 2 (assigned); X = 5: 7 / 10; X = 7: 8 / 14. Same phenomenon as zeta.
- Liouville Pick matrix, X = 2, [0.6,0.9] x [13,15]: max abs Theta = 3.68 (diagonal already negative), 7 negative eigenvalues of 20.
- Twisted Lemma 1 verified (section 1). Random-U and Liouville kernel diagonals in the lane's JSON show the same non-monotonicity and sign changes.
- DH, backward heat, theta^w: no Euler stage exists; "not formulable" is accurate. This means the lane gives no information on those controls, not that they fail.
Conclusion: the note's statement that nothing separates zeta from U, Liouville, E_a, RZ_b, Beurling is supported.

## 5. RH, verified height, known theorems

- RH is not assumed anywhere; the limit-space statements are explicitly independent of the zeros.
- Verified height is not used.
- Krein-Langer and Pick-Nevanlinna are labelled CLASSICAL and recalled; not presented as new.

## 6. Requirement flags (referee)

- R1 false: no positive conclusion; every lemma holds for unimodular twists and Beurling systems, so multiplicativity of the integers is not used essentially.
- R2 false: no statement about zeros in any window.
- R3 false: twisted controls behave identically; DH, heat, theta^w not formulable.
- R4 false: the limit exists only in Re s > 1.

## 7. Required corrections to RESULT.md

1. Replace "off-line zeros in the strip from X = 5" by "already at X = 2 (t = 72.78 symmetric normalisation; t = 26.74 assigned normalisation), measured"; state that the table is for 1 + Theta_X and that the assigned xi_X corresponds to 1 - (s/(s-1)) Theta_X.
2. Replace 1 + log 2/log p by the root sigma*(p) of p^(sigma-1) + p^(-sigma) = 2 (1.7716 for p = 2).
3. Summary item 4: "inner for every axis c <= 0; inner with the factor analytic only at c = 0".
4. TW row: note the range abs(u) < p^(-1/2).

Files of the referee run (not kept in the lane): /tmp/ref_c3/chk.py, chk2.py, chk3.py.
