# REFEREE: n3-twin-ladder-endpoint-bridging

Referee pass of 2026-11-17 (internal, adversarial). Scope: RESULT.md in this directory.

Outcome: the verdict "precise-obstruction" holds. Both PROVED steps were re-derived by hand and confirmed. The kill criterion "a zero pair leaves the line for 0 < w < 1" was confirmed with an independent evaluator. One labelling error: the family and the generator identity are in the literature (Lagarias-Rains 2003) and are presented here as new. Several counts are stated as exact but are lower bounds. No step assumes RH; no statement about zeta zeros is claimed.

All referee runs: local, single process, through `scripts/memcap.sh 8`, each under 4 minutes, no ssh. Referee scripts were kept outside the repo (/tmp/ref_n3tw: `poly.py`, `dh.py`, `chk.py`); they used the lane's venv (mpmath 1.4.1) but not the lane's evaluator `zf.py`.

## 1. PROVED steps, re-derived

### 1.1 Generator identity (section 2): CONFIRMED

By hand:
- Triple product: log theta = sum_n log(1 - q^(2n)) + 2 sum_n log(1 + q^(2n-1)), so c(m) = sum_{dk=m} e(d,k) with e = -1/k (d even), 2(-1)^(k+1)/k (d odd). Correct.
- Dirichlet series: the even part gives -2^(-u) zeta(u) zeta(u+1); the odd part gives 2 (1-2^(-u)) zeta(u) * (1-2^(-u)) zeta(u+1). With x = 2^(-u): -x + 2(1-x)^2 = 2 - 5x + 2x^2 = (2-x)(1-2x). Correct.
- Mellin: int_0^inf exp(-pi m t^2) t^(s-1) dt = (1/2) (pi m)^(-s/2) Gamma(s/2). Termwise integration is justified for Re u > 1 (absolute convergence), then continuation. Correct.
- Duplication: zeta*(u) zeta*(u+1) = 2^(1-u) pi^(-u) Gamma(u) zeta(u) zeta(u+1). Correct.
- Collecting: (1/2) 2^(u-1) (2 - 2^(-u)) = 2^(u-1) - 1/4 = -(1/4)(1 - 2^(1+u)); the factor (1 - 2^(1-u)) is carried along (the last line of the lane's proof omits it from the displayed product but the final formula is right). c = -1/4.
- Independent consistency check not in the lane: F(w,s) has principal part (1/w)(1/(s-w) - 1/s) -> 1/s^2, and the formula gives G(s) ~ -(1/4) * (-1/u^2) = 1/s^2 at s = 0. Agrees.
- Zeros, the sign of G(it), the double pole and the count (T/2pi) log(T/2 pi e): re-derived, correct. The statement about Re s = +-1 is restricted to zeros known to be on the line; no RH assumption.

Numerical rerun, different cases and different method (mpmath, real axis, integral split at t = 1 with the inversion law, G(s) = int_1^inf log theta(t^2) (t^(s-1) + t^(-s-1)) dt + 1/s^2, 60 digits):

| s | relative difference of the two sides |
|---|---|
| 1.3 + 17.7i | 4.5e-60 |
| -0.7 + 3.1i | 1.2e-61 |
| 2.6 + 41.9i | 7.2e-52 |
| 0.05 + 0.4i | 1.4e-61 |
| 23i | 4.3e-58 (value real and negative, as stated) |

Limit check: |Z(w,s)/w - G(s)|/|G(s)| at s = 1.3 + 17.7i is 6.5e-3, 6.5e-6, 6.5e-9 for w = 1e-3, 1e-6, 1e-9 (linear in w).

### 1.2 Multiplicativity defect (section 5): CONFIRMED

By hand, with x = theta - 1 = 2q + 2q^4 + ... and theta^w = sum_k C(w,k) x^k:
r_w(1) = 2w, r_w(2) = 4 C(w,2), r_w(3) = 8 C(w,3), r_w(6) = 64 C(w,6) + 24 C(w,3). Then
2w r_w(6) - r_w(2) r_w(3) = w^2 (w-1)(w-2) [ (8/45)(w-3)(w-4)(w-5) + 8 - (8/3)(w-1) ] = (8/45) w^3 (w-1)(w-2)(w-4)(w-8).
Exact rerun by a different method (binomial series in exact rationals, not the lane's recurrence): identity holds at 15 rational points (degree 7, so this is a proof). Different cases: the defects at (2,5), (3,5), (2,7), (3,4) vanish at w = 1, 2, 4, 8 and are nonzero at w = 1/2 (0.1289, 0.6294, -0.4478, -0.3057). The (2,3) defect is positive on (0,1). The conclusion "normalised coefficients are not multiplicative for 0 < w < 1" follows.

## 2. Errors and required changes

E1 (novelty; label error). The object is the two-variable zeta function of van der Geer and Schoof for Q, studied in J. C. Lagarias and E. Rains, "On a two-variable zeta function for number fields", Ann. Inst. Fourier 53 (2003) 1-68, arXiv math/0104176. That paper has: the functional equation s -> w - s and the line Re s = w/2; entire continuation of xi_Q(w,s) = s(s-w) Z_Q(w,s)/(2w); the closed form at w = 0 in terms of the completed zeta function at s/2 and -s/2 (the formula as the referee recalls it from the version-1 abstract is xi_Q(0,s) = -(s^2/8)(1 - 2^(1+s/2))(1 - 2^(1-s/2)) zeta*(s/2) zeta*(-s/2), which is exactly section 2 with c = -1/4; a web search in this pass confirmed the existence and shape of the closed form but the exact formula was not re-read in the PDF); zeros for fixed w >= 0 confined to a vertical strip with the zeta-type counting asymptotics; for w < 0 positivity on the critical line, tied to an infinitely divisible convolution semigroup (this is the "Levy" structure of section 6). Required: relabel section 2 from "PROVED, constant resolved" to CLASSICAL with this citation (the lane's derivation is a correct independent proof); remove "new relative to the obstruction map" as a novelty statement; cite the paper in sections 1 and 6. Not checked by the referee: whether that paper's numerical section already reports off-line zeros for 0 < w < 1; it must be read before the departure data are described as new.

E2 (novelty, minor). For integer w, "r_w(n)/(2w) is multiplicative only for w = 1, 2, 4, 8" is a known theorem (the referee recalls Bateman-Datskovsky-Knopp, 2001; reference from memory, not re-read). The real-w polynomial identity is an elementary computation; keep the PROVED label, add the remark.

E3 (counts stated as exact). The header and section 3(b) give "29 departures and 29 returns", "105 events", "all 44 pairs". The event list comes from sign changes on a grid (w step 0.0025, t step 0.04) with uncertified Newton refinement; section 8 item 1 says so. These are counts of events found, hence lower bounds: "at least 29 departures". The balance 82 = N(205) (referee: N(200) = 79, N(205) = 82, N(102.5) = 30, N(107.5) = 33, N(1000) = 649, all confirmed with mpmath) checks only arrivals minus departures.

E4 ("no birth map exists"). Measured on 28 traced departures by uncertified continuation. The supported statement is: on the measured range, continuation in w does not preserve the pairing of zeros by arrival. Write it as MEASURED, not as a non-existence statement.

E5 (window law). "Faster than 1/log T" rests on four to five steps per side with bracket widths 0.005-0.01, and the lower margin is the same bracket (0.025, 0.03] at T = 631-678 and at T = 1000. The claim is acceptable only with the qualifier "on T in [112, 678]", which the body has and the summary line drops. Kill criterion 1 alone carries the verdict; criterion 2 should be reported as "consistent with", not "met".

E6 (backward-heat control). Not run, and not the campaign's HEAT control in a strict sense (that control acts on the xi-kernel, this lane's family is built on theta). The referee's reading: with kernel K = exp(tau u^2/16) t^(1/2) theta(t^2) (u = log t, even in u), K^w has Gaussian decay at both ends, so the w-family exists for every w > 0 as an entire function with the same reflection, and only the endpoint w -> 0 is lost (log K contains tau u^2/16, which has no Mellin transform). So the lane's sentence "step one fails" is right, but "not formulable" would be wrong: the path exists, the product endpoint does not. Label stays ARGUED.

E7 (DH count). The referee confirmed the interior zero but not the count 10 (see 3.2). Keep MEASURED, uncertified.

No error found in: the continuation and reflection of Z(w,s) (poles 1/(s-w) - 1/s re-derived), the reality of H on the line, Z(2,s) = 2 pi^(-s/2) Gamma(s/2) zeta(s/2) L(s/2, chi_4), the pair counts (33 ladder pairs with 2 gamma <= 215; 11 progression pairs; 30 + 11 = 41 pairs below 205), and the Stirling exponent in section 6 (|G(x+iy)| carries exp(-pi |y|/4): correct, so the convolution weight is flat on [0, T]).

## 3. Independent numerical reruns

### 3.1 Departure and excursion (the kill criterion), different evaluator

Evaluator: Z(w,s) = int_1^inf (theta(t^2)^w - 1)(t^(s-1) + t^(w-s-1)) dt + 1/(s-w) - 1/s on the real axis, mpmath, 60 digits (the lane uses a rotated ray with python-flint). Sanity: Z(1,s) against zeta*(s) at 0.5 + 30i and 0.2 + 47.3i: 2.9e-54, 1.5e-47.

- Lowest departure, at the lane's (w, t) = (0.352173358368..., 38.970861730763...): H = 0 to working precision and H_t = -1.6e-30 (central difference, step 1e-8), against |H| = 1.6e-15 at t + 0.3. A double zero, as reported.
- Cases not listed in the lane (inside the excursion): simple zeros off the line found by Newton in complex s:

| w | zero s | Re s - w/2 | abs(Z) | abs(Z') |
|---|---|---|---|---|
| 0.40 | 0.5917525557464940 + 39.0017394159470374 i | 0.3918 | 4e-65 | 7.3e-15 |
| 0.45 | 0.6743242707273128 + 39.0287933527989040 i | 0.4493 | 4e-65 | 9.7e-15 |
| 0.55 | 0.4945324922864338 + 39.0739239458406102 i | 0.2195 | 0 | 5.9e-15 |

  The mirror point w - conj(s) is a zero in each case (abs(Z) <= 2e-63). The distance 0.4493 at w = 0.45 agrees with the lane's maximal excursion 0.449 for this event.
- Sign changes of H(w,t) on 36 <= t <= 42 (step 0.04): two at w = 0.30 (near 38.34, 39.50), none at w = 0.45, two at w = 0.60 (near 38.74, 39.46). Consistent with departure at 0.352 and return at 0.566.

So zeros of Z(w,.) are off the line Re s = w/2 for w in an interval inside (0,1) at height 39. Confirmed (MEASURED, 60 digits, not interval-certified). The other 28 excursions, the first-collision table, the 66-digit values and the T = 1000 scans were not rerun.

### 3.2 Davenport-Heilbronn control

Referee run (mpmath, 30 digits): the kernel phi(tau) = sum a(n) n exp(i pi n^2 tau/5) satisfies phi(i/y) = y^(3/2) phi(iy) (ratio 1.0 at y = 0.3, 0.7, 2.2); phi(iy) exp(pi y/5) >= 3.2187e-4 on [0.05, 25] (minimum at the lower end); interior zero tau = 8.65471092307307543773 + 0.23112765264765411237 i with abs(phi) = 5e-30, and its mirror at Re = 1.3452890769. A coarse Newton search found 7 distinct interior zeros in one period (Im from 0.124 to 0.231); the lane's argument-principle count of 10 was not reproduced or contradicted. The same search on theta_3 found none. Consequence as stated in the lane: log(phi) has a singularity at nome modulus exp(-0.2311 pi/5) = 0.865 < 1, its coefficients grow exponentially, and the generator is not a Dirichlet series. Confirmed. The lane's own remark stands: DH is not what kills the lane; the zeta family itself does.

### 3.3 Sign twist

Not formulable (no reflection law, hence no line Re s = w/2). Agreed. The lane claims no zeta-only mechanism, so there is nothing for this control to refute.

## 4. Checks on scope

- RH is not assumed anywhere. Zeros on the line at w = 1 up to height 1000 are used only as a quadrature check (649 = N(1000)).
- Nothing restates verified height as a result.
- The multiplicativity statement is correct in the standard sense (normalised coefficients not multiplicative); it does not exclude other structure on the path, and the lane does not claim it does.
- Section 7's added control ("theta^w near w = 1 keeps the functional equation, positive kernel and gamma factor, loses the Euler product, has off-line zeros at heights 631-678 for |w - 1| = 0.02-0.03") rests on the T = 1000 scans, which were not rerun here. The referee confirmed off-line zeros only for w = 0.40-0.55 at height 39. Use the control with w in that range until the near-1 data are rechecked.

## 5. Verdict

holds: yes, as a precise obstruction, after relabelling.

Surviving claim: (CLASSICAL, Lagarias-Rains 2003; re-proved here) G(s) = -(1/4)(1 - 2^(1+s/2))(1 - 2^(1-s/2)) zeta*(s/2) zeta*(-s/2). (PROVED, elementary) 2w r_w(6) - r_w(2) r_w(3) = (8/45) w^3 (w-1)(w-2)(w-4)(w-8), so the coefficients of theta^w are not multiplicative for 0 < w < 1. (MEASURED, confirmed by an independent evaluator at height 39; other events not rerun, counts are lower bounds, nothing interval-certified) zeros of Z(w,.) leave the line Re s = w/2 and return for 0 < w < 1, so continuation in w from the product endpoint w = 0 to w = 1 gives no on-line statement and no pairing of zeta zeros with w = 0 pairs. The window law near w = 1 is a measurement on T in [112, 678] only. No information about zeta zeros.
