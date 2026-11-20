# REFEREE (adversarial, lens: general) for c3-fixedt-growingp-onesided/RESULT.md

Date: 2026-11-18. Referee wrote only this file. Checks run locally through `scripts/memcap.sh 8` (peak well below 1 GB); the compute server was not used. Scratch script outside the repo (`/tmp/ref_c3/chk.py`), float64 + mpmath 25 digits.

## Verdict

**The claimed verdict (precise obstruction) holds, with one error to correct (E1), one unverified recalled number (E2) and three statements to tighten (E3-E5).** Lemma 1, Theorem 1 and Prop. 2(i),(iii) were re-derived and confirmed. Nothing in the result assumes RH. Nothing is presented as new that is classical: the note says itself that it is Landau's argument on a twisted prime sum. No statement about zeros of zeta is established, and none is claimed.

Requirement flags set by the referee: R1 = false, R2 = false, R3 = false, R4 = false (agree with the author).

## 1. Re-derivation of the PROVED steps

**Lemma 1 (Laplace transform in log P). Confirmed.**
- Prime part: int_0^inf e^(-wu) sum_{log p <= u} p^-s du = (1/w) sum_p p^(-s-w) for Re w > 1 - sigma. Correct.
- Renormaliser: for a > 0, w > 0, int_0^inf E_1(au) e^(-wu) du = int_1^inf dy/(y(w + ay)) = (1/w) log((a + w)/a). Correct. Continuation in a to Re a < 0, Im a != 0: the domain {a not in (-inf,0], Re(a+w) > 0} is connected for Re w > 0; log(a+w) is principal because Re(a+w) > 0; so the value is (log(a+w) - log a)/w with both logarithms principal. Correct.
- Numerical check by the referee (mpmath quadrature against the formula, three cases with Re a < 0): a = -0.4+7.3i, w = 0.55; a = -0.25-2.1i, w = 0.4+1.7i; a = -0.35+0.6i, w = 0.5-3i. Agreement to all 12 printed digits in each case.
- Cancellation of the pole: P(z) = log zeta(z) - H(z), and log zeta(z) + log(z-1) = log((z-1)zeta(z)) on Re z > 1. Correct. Singular set in Re w > 1/2 - sigma is {0} and {rho - s}. Correct.

**Theorem 1 (single-point criterion). Confirmed, with a cleaner closing step than the one written.**
- Landau's theorem (Laplace integral of a function of one sign for u >= u_0; the abscissa of convergence is a singular point) applies: h is locally integrable and the part on [0, u_0] has an entire transform.
- Continuation along the real axis: for real w > m the point s + w lies on Im z = t to the right of every zero of ordinate t, so log((z-1)zeta(z)) continues along that segment; likewise for sbar. H is analytic for Re w > 1/2 - sigma and m >= 0. So the abscissa is <= m and the transform is analytic in Re w > m.
- Closing step. The note argues by non-cancellation of logarithmic branch points. A shorter argument that the referee checked: F(w) = 2w Phi_R(w) + const + H(s+w) + H(sbar+w) is analytic in Re w > m and exp F(w) = (s+w-1)zeta(s+w)(sbar+w-1)zeta(sbar+w) up to a nonzero constant; the right side is analytic in Re w > 1/2 - sigma and equals the exponential of an analytic function in Re w > m, so it has no zero there. This gives beta - sigma <= m without discussing the type of singularity. The note's non-cancellation claim is also correct (the coefficients at a coinciding point are m_rho/w and m_rho'/w with the same w), but the exp F argument removes weakest-step item 1.
- Converse (b): standard partial summation from pi(x) - li(x) = O(x^(Theta+eps)); the eps is needed (for Theta = sigma + alpha, boundedness does not follow). Stated correctly as "up to eps".

**Prop. 2(i) (sign of the single-zero term). Confirmed.** From d/ds E_1((s-rho)L) = P^(rho-s)/(rho-s) and the explicit formula for sum Lambda(n) n^-s, a zero enters the raw sum as + m E_1((s-rho) log P) and the pole as - E_1((s-1) log P); this matches the renormaliser sign in G. At t = gamma, sigma < beta: E_1(-x) = -Ei(x) -+ i pi, real part -> -infinity monotonically.

**Prop. 2(ii), identity part. Confirmed** (chi(p) = -1 gives -G identically; the function is zeta(2s)/zeta(s)).

**3-4-1 for U. Confirmed:** 3 + 4 cos phi + cos 2 phi = 2(1 + cos phi)^2 = 2(1 - p^(sigma0-1))^2.

## 2. Errors and corrections

**E1 (error in Prop. 2(ii), scope of the mirror).** The list of "hypotheses shared by both members" includes "a functional equation of the same type". zeta(2s)/zeta(s) does not have one: s -> 1-s maps it to zeta(2-2s)/zeta(1-s), which is related to zeta(2s-1)/zeta(s), a different function. BRIEF.md states this explicitly (the sign twist keeps the Euler product and loses the functional equation). Correct statement: any derivation of a one-sided bound in P from complete multiplicativity, real unimodular local parameters, integer frequencies and meromorphic continuation proves the two-sided bound; a derivation that uses the functional equation of zeta is NOT covered by the Liouville mirror. The identity G_lambda = -G_zeta and item 4 of the verdict are unaffected; the consequence drawn from it is narrower than written.

**E2 (unverified recalled number).** "DH's zeros to the right of Re s = 1 (sup about 1.12)" and the control-table entry "false at every non-exceptional height for sigma < 1.12" rest on a recalled figure that is not opened, not computed, and not exhibited in the data (the note says so in 7.3). The existence of DH zeros in Re s > 1 is classical; the value 1.12 should be marked "recalled, unverified". What is established for DH by Thm. 1 and the zeros actually located: the inequality at sigma = 0.6 is false at every non-exceptional height because of the zeros at 0.8085 + 85.699i and 0.8316 + 119377.631i (float-verified).

**E3 (Thm. 1 is not sharp for the lower-bound sign; the summary overstates the exception).** For the lower bound r(u) >= -C e^(alpha u) there are no exceptional ordinates. If b_t > alpha, then h = r + C e^(alpha u) >= 0 has abscissa exactly b_t (singular point there), and its transform for real w -> b_t+ equals C/(w - alpha) + Phi_R(w), whose singular part (m/w) log(w - b_t) tends to -infinity; a transform of a function that is >= 0 beyond u_0 is bounded below near its abscissa. Contradiction. So: lower bound at ANY single s (t != 0) gives Theta <= sigma + alpha; the exception t = gamma applies only to the upper bound. This is consistent with Prop. 2(i) and with the claim text ("the upper bound is not contradicted"), but verdict item 2 and "Differences 2" state the exception for both signs. Referee's argument, not independently checked by a second party.

**E4 (labels in section 0).** The bold sentence "no input that holds at Re s >= 1 or at finite stages produces the bound" is a survey of four input types (section 3, ARGUED + CLASSICAL, sources recalled and not opened), not a theorem. It should carry the label ARGUED in the verdict line. The Borel-Caratheodory step in section 3 is standard; the implication from a bound at the single scale P = T^theta to a zero-free region is not proved (the note says so).

**E5 (identification with T2/P10).** "The same Landau target" is correct at the level of mechanism (one-sided bound + Landau gives the half-plane; equivalence, no unconditional hypothesis). T2's R_x(l) and P10's Q_L are different functionals; no map between the objects is written down. The row to add to the map should say "same mechanism and same status (target)", not "the case t = 0 of the same object".

Minor: "for every |t| below the verified height" uses verified height only to say that such t is non-exceptional; this is a legitimate use and adds no zero information. The measured zeta table is correctly described by the note as restating verified height.

## 3. Numerical checks rerun with different cases (MEASURED, float64)

Primes to 4e6 (not 1e7), sup/inf over primes P in [1e3, 4e6].

zeta, new points:

| s | log abs zeta | sup_P D | inf_P D | D at 4e6 | max abs(D) P^(sigma-1/2) log P |
|---|---|---|---|---|---|
| 0.65 + 5000.5i | -0.7793 | 0.028 | -0.311 | 2.0e-2 | 6.08 |
| 0.65 + 77777.7i | -0.5504 | 0.026 | -0.148 | -1.5e-2 | 5.40 |
| 0.55 + 31415.9i | -0.0675 | 0.059 | -0.616 | -7.3e-2 | 6.57 |

Same behaviour as the note's table (scaled deviation below 10). Liouville: sup/inf are the exact negatives (checked).

U with a different zero (sigma0 = 0.7) and a different sign pattern (random eps_p, seed 5), sigma = 0.55:

| t - t0 | sup_P Re G | inf_P Re G | predicted amplitude at 4e6 |
|---|---|---|---|
| 0 | -3.36 | -7.42 (monotone descent) | 4.29 |
| 0.5 | 0.51 | -2.03 | 1.23 |
| -1 | 0.04 | -1.64 | 0.64 |
| 10 | 0.69 | -0.14 | 0.064 |
| 2000 | -0.50 | -0.96 | 3e-4 |

RZ_b with b = 0.85 (not 0.93), sigma = 0.6: t = 0: inf -17.7 (predicted 11.8 plus constant); t = 0.7: sup 3.78 (predicted 3.96); t = 500: range [-0.238, -0.176], zero term 0.006.

Controls reproduce the note's reading: growth of the predicted size and sign within distance about 1 of the zero, descent at offset 0, no separation from zeta at distance >= 500 in this range of P.

DH zeros, independent evaluation (mpmath Hurwitz zeta, 25 digits, not the author's Euler-Maclaurin sum): abs f = 6.1e-11 at 0.8085171825 + 85.6993484854i; abs f = 1.1e-11 at the claimed 0.83164593048392 + 119377.63134320745i and 0.0245 at distance 0.01; mpmath root-finder from there returns 0.8316459304879 + 119377.6313432074i. The outlier height is explained by this zero. Not interval-certified.

Table audit: the summary numbers in section 4 (0.445 / -0.396 / 9.90; 0.141; 0.046; U near rows; DH outlier count 1 of 40 with the other 39 in [-2.14, 1.49]; U far ranges, 0.199, 0.0016) were recomputed from `onesided_test.json` and agree.

## 4. Controls

No zeta-only mechanism is claimed, so there is no step for a control to fail. The criterion is function-agnostic (it holds verbatim for U, RZ_b, DH, Liouville), which the note states. The referee's U and RZ_b runs with changed parameters agree. HEAT, TW+-, EA, NR, B were not run by the author or the referee; nothing depends on them.

## 5. Requirement flags (strict)

- R1 = false. No step uses multiplicativity; the criterion holds for DH's log-coefficients.
- R2 = false. The object is a fixed-height, all-P statement whose constant depends on zeros at all heights; no window-uniform conclusion is established.
- R3 = false. The inequality is false for the controls because they have zeros; there is no derivation for zeta that the controls could fail structurally. With E1, the Liouville mirror also does not cover arguments that use the functional equation.
- R4 = false. No one-sided inequality in P is derived from the region Re s >= 1 or from finite stages; the result is an equivalence.

## 6. What survives

For fixed s = sigma + it, 1/2 < sigma < 1, t != 0: (a) the Laplace transform in log P of G(P; s) is (1/w)[log((s+w-1)zeta(s+w)) - log(s-1) - H(s+w)]; (b) an upper bound Re G <= C P^alpha for all large P at that one point gives beta <= max(sigma + alpha, beta_t) for every zero; a lower bound Re G >= -C P^alpha gives Theta <= sigma + alpha with no exception (E3, referee's argument); conversely Theta <= sigma + alpha gives the two-sided bound O(P^(alpha+eps)); (c) G_lambda = -G_zeta, which rules out one-sided derivations that use only multiplicativity, real unimodular parameters and meromorphy, but not those using the functional equation; (d) measured localisation: the zero term has size P^(beta-sigma)/(abs(s-rho) log P), observed on U, RZ_b and DH near their zeros and invisible at distance >= 500 for P <= 1e7. This is the Landau target in twisted form: an equivalence with no unconditional hypothesis. Status of the lane: closed, target.
