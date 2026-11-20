# REFEREE: e1-rs-torus-laguerre-orbit

Claimed verdict: precise-obstruction. Referee outcome: **the obstruction verdict survives; one step labelled PROVED is false as written** (the error term of the section 2(b) identity in its frozen-speed form). By the default rule (a PROVED step that cannot be confirmed) the result is marked holds = false until that line is corrected. The correction is one line and changes no measured number.

Referee runs: `/tmp/ref_e1/ref1.py`, `/tmp/ref_e1/ref2.py` (kept outside this directory; only REFEREE.md was written here), run from the repo root with `scripts/memcap.sh 8 .venv-arb/bin/python`, float64 + mpmath, about 3 minutes total. Compute server not used.

## 1. PROVED steps re-derived

| Step | Result |
|---|---|
| B_1 empty | Confirmed. V = 0 on the single term, Lag = 0, and B is defined with strict inequality. |
| B_2 empty | Confirmed. V f = -log2 sin(theta), V^2 f = -(log 2)^2 cos(theta), Lag_2 = (log 2)^2 (1 + 2^{-1/2} cos(theta) cos(theta - phi_2)) >= (log 2)^2 (1 - 2^{-1/2}) = 0.140721. Grid minimum (721 x 721): 0.1407214. |
| Exact algebra Lag[2f+R] = 4 Lag[f] + 2(2f'R' - fR'' - Rf'') + Lag[R] | Confirmed by expansion. |
| Asymptotic line "Lag[Z] = 4 Lag_N(orbit(t)) - 2 R f'' + O(N^{-3/2} log^2 N)" | **Not confirmed; false as written.** See 2. |
| 2(a) partial fractions, -2/beta^2 + S | Confirmed (classical). Lattice value log^2(t/2pi)/12 = 2 zeta(2)/d^2 with d = 2pi/log(t/2pi) is correct for the lattice; the threshold log(t/2pi) > sqrt(96) = 9.80 is arithmetic-correct. Labelled ARGUED in the result; that label is right. |

## 2. Error: the frozen-speed identity

The result itself states that Lag_N (speed frozen at log N) differs from the true-time Lag[f] by relative O(log N / N), then writes the total error as O(N^{-3/2} log^2 N) absolute. These are inconsistent: Lag[f] is of size 10 to 100, so the frozen-speed difference is of size polylog(N)/N in absolute terms, larger than N^{-3/2} log^2 N.

Measured (25 random t per segment, true Z from mpmath `siegelz`, R = Z - 2f):

| N | claimed bound N^{-3/2} log^2 N | residual with true-time Lag[f] (max / median) | residual with frozen Lag_N (max / median) | median abs Lag[Z] |
|---|---|---|---|---|
| 10 | 0.168 | 0.069 / 0.0096 | 9.69 / 0.75 | 22.7 |
| 30 | 0.070 | 0.044 / 0.0028 | 8.05 / 0.29 | 31.5 |
| 100 | 0.021 | 0.0042 / 0.00049 | 1.51 / 0.106 | 50.3 |
| 300 | 0.0063 | 0.0013 / 0.00021 | 2.75 / 0.048 | 114.5 |

So:
- The identity holds within the stated order **only with the true-time Lag[f]** (derivatives with theta'(t), theta''(t)).
- With the torus quantity Lag_N the residual is 1.5 to 10 in absolute value, 70 to 440 times the stated bound at N = 100 and 300. It is not negligible against the term -2 R f'' that the result says decides the sign.
- Even the true-time form is not a uniform bound: sup abs f and sup abs f' on the torus are of order N^{1/2} and N^{1/2} log N, so 4 f'R' is O(log N / N) in the worst case. The stated order uses typical sizes of f, f'. It should be labelled MEASURED/ARGUED, not PROVED.

Consequence for the result: the set B_N^R of section 2(b) needs the extra tolerance delta(t) (abs f' abs h + abs f abs V h-type terms) with delta = theta'(t) - log N in [0, 1/N]. This widens the tolerance and strengthens the conclusion "no margin"; it does not rescue the route. The orbit scans in `lag.py` use true-time derivatives, so tables 4.1, 4.2, 4.4 are unaffected; stored frozen and true-time fractions agree to about 1e-4 (e.g. N = 5: 0.00405 against 0.00304; N = 100: 0.00021 both).

## 3. Numeric reruns with different cases

Stored counts: recount from `lag_results.json` gives entries for 18 of 21 scanned N >= 5, none at N = 6, 20, 22, none at N = 2, 3, 4; first bad point 221.07. Confirmed. (N = 7, 9 and others were not scanned; their segments start above 221, so "first at 221.07" stands on the 0.01 grid.)

New N (not in the result):

| N | meas B_N | theta + 0 | theta + 0.1 | theta - 0.1 | theta + 0.3 | theta - 0.3 | phi_2 + 0.1 | phi_2 + 0.3 | phi_2 + pi |
|---|---|---|---|---|---|---|---|---|---|
| 75 (1306 crit) | 0.052 | 8 | 20 | 22 | 66 | 64 | 22 | 72 | 165 |
| 130 (2543 crit) | 0.055 | 7 | 33 | 39 | 136 | 139 | 50 | 150 | 326 |

- The loss under translation is confirmed, and is symmetric in the sign of the shift.
- **Overstatement in the summary:** "0.1 rad raises the count 4 to 7 times, 0.3 rad 18 to 34 times" holds for N >= 100 only (N = 130: 4.7 to 7.1 and 19 to 21). At N = 50 the result's own table gives 1.6 to 1.9 and 4.9 to 5.4; at N = 75: 2.5 to 2.75 and 8 to 9. The body text says "at N >= 100"; the claim line does not. Base counts are 3 to 13, so each ratio has relative error about 30 to 60 percent.

True Z at new bad points (N = 75, all 8 bad points, t = 35422 to 36262): 2f = -0.017 to -0.065 at the bad point, remainder scale 0.115, true Z has 2 sign changes within +-0.3 and Lag[Z] > 0 at every sample (minimum 0.45 to 1.16). Consistent with section 4.2.

Explicit point for N = 3 (referee): theta = pi, phi_2 = pi, phi_3 = pi gives Lag_3 = -0.3103. So "B_3 non-empty" is provable, not only measured. "B_N non-empty for all N >= 3" is established only at the 24 scanned N plus N = 75, 130; the general statement is MEASURED.

## 4. Controls run by the referee

- DH, exact function: Z_DH real to 2e-14 at t = 137.3. Two further off-line zeros (not in the result), located by root search: 0.574356 + 166.479306 i (Lag/Z^2 = -360.6 against -2/beta^2 = -361.7) and 0.724258 + 176.702461 i (-38.5 against -39.8). Formula 2(a) confirmed.
- DH main sum, segment N = 11 ([152.05, 180.96], not in the result): 2 bad critical points, at 166.479 and 176.709; main-sum Lag < 0 on [166.29, 166.67] and [176.44, 176.95]; the true Z_DH has Lag < 0 at both midpoints. Every excursion of the DH main sum into B in this segment sits on an off-line zero. Confirms 4.3.
- DH at N = 75, 130: bad 11/259 and 22/503, time fraction 0.018 in both; torus measure 0.035, 0.036. Confirms the 0.015 to 0.02 level.
- theta_5' = (1/2) log(5t/2pi) + O(1/t^2): confirmed from Stirling for Gamma(3/4 + it/2). The coupling is shared; "holds identically" should read "holds up to O(t^-2), as for zeta".
- Sign twist (phi_2 + pi): 165/1306 and 326/2541 bad, fraction 0.056 and 0.058 against torus measure 0.052 and 0.055. Confirmed.
- Amplitude tilt: c = -0.05 gives 4 and 6 bad (N = 75, 130), the zeta level; c = +0.05 gives 241 and 584. Confirmed, including the admission that the c < 0 side passes.
- Not run by the result and not run here: theta^w, T-NR, Beurling, E_a, phase-rotated transfer operator, and the de Bruijn-Newman family itself. The closure does not depend on them (the route is closed by DH sharing the coupling and by the zeta segment entering B_N), but the control table is incomplete and the heat row is not the heat flow.

## 5. Other checks

- RH is not assumed anywhere. 2(a) is unconditional.
- Verified height: the statement "rescued by R at all 15 points" (23 with the referee's 8) is a restatement that the zeros at those heights are real. The result says this and draws no further conclusion. The "discriminator" by-product is correctly described as a diagnostic.
- No known theorem is presented as new: the Laguerre criterion and the conductor-q main-sum length are labelled CLASSICAL.
- "Smallest true normalised Lag 0.0004" is normalised by the main-sum variance scale, not by Z^2; as a statement about Lehmer-type near-degeneracy it is fine, but it is one sample on a 0.01 grid, not a minimum over the segment.
- At N = 5, t = 221.07 the true Z has no sign change within +-0.3 (stored value 0); the result's "14 of 15" covers this.
- The closure sentence "an invariant or translation-robust torus statement cannot exclude B_N" is not a theorem (the result says so in weak step 2). The obstruction is: (i) shared coupling, PROVED/CLASSICAL; (ii) zeta main sum enters B_N, MEASURED at 18 + 2 segments; (iii) no margin, MEASURED.

## 6. Verdict

- holds: false under the default rule, because of section 2.
- Surviving claim: B_1, B_2 empty (proved); B_3 non-empty (explicit point); exact algebraic identity for Lag[2f + R]; with the **true-time** Lag[f] the residual beyond -2 R f'' is within N^{-3/2} log^2 N at N = 10 to 300 (measured, not uniform); the zeta main-sum segment enters B_N and the true Z has Lag > 0 at all 23 points checked; DH main sum enters B at 85.707, 114.160, 166.479, 176.709, each on an off-line zero; theta' = log(length) is shared by DH; translation loss confirmed, with multipliers 4 to 7 and 18 to 34 only for N >= 100. Route closed as a one-point, no-margin statement (rows S4, Q13).
- Required correction: replace Lag_N(orbit(t)) by the true-time Lag[f](t) in the displayed identity, or add the term O(polylog(N)/N) for the frozen speed; relabel the asymptotic line MEASURED/ARGUED; restrict the translation multipliers to N >= 100.
