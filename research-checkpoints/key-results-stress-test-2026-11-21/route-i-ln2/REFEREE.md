# route-i-ln2: referee pass on the first reviewer's verdict (2026-11-20)

Scripts and logs for this pass: `referee/` (window_test.py, corr_eoq.py, cusp_ref.py, win_*.log, rob_*.log, corr_eoq.log, cusp_ref.log).
All runs under `scripts/memcap.sh 8`, at most 4 processes, about 5 minutes of compute in total.

## 1. Summary
- Part (a) (cusp fraction 1 - 1/rho) holds. Re-derived by hand and checked with a formula the first reviewer did not use.
- Part (b) (linear growth of E_S o Q along 2 pi j/ln 2 for 2a > ln 2): the slope is carried by the closed-form term delta_out and is not affected by what follows. It remains numerical evidence, as the first reviewer said.
- New error, missed by the first reviewer: the spectral numbers in the record (lam_S(0) = 0.9999731, corr, the constant 13.62, every absolute value of E_S o Q) are not those of A = P_1 F_S P_1. The script replaces P_1 = 1_{(0,1]} by 1_{[e^-16,1]}. In the semilocal case F_S xi has a log singularity at 0 and this cutoff is not negligible. Converged values: lam_S(0) = 0.9999974 (1 - lam^2 = 5.18e-6, a factor 10.4 smaller than recorded), corr(ln 2) = 2.776 (recorded 1.458), corr/u at 0+ = 22.85 (recorded 13.62). Every E_S o Q/||k||^2 value in the record and in the first verdict shifts by about -18 to -22.
- The first reviewer's "replay 3" re-ran the original script with the same window; its agreement with the record is not an independent confirmation, and the robustness statement "top eigenvalues unchanged to 5e-7" varied only the grid step. The log of that run already shows the inconsistency: mode 0 has ||psi||^2 = 2.95e-5 against 1 - lam^2 = 5.38e-5.

## 2. What I ran
### 2.1 Part (a), independent formula (cusp_ref.py)
B(r) = int_0^1 ln(1/t) K_N(t) K_N(r t) dt (density of t = xy on the unit square), Gauss-Legendre on graded panels, against the si double sum truncated at the same N:
N = 10: r = 1.3: 1.5334730841 / 1.5334730841; r = 2(1+2^-5): 2.1077666048 / 2.1077666048; r = 1/(2(1+2^-5)): 3.1764388546 / 3.1764388546; r = 3: 0.2148551797 / 0.2148551797.
Increments per halving of eps (N = 60), eps = 2^-30: rho = 2: delta_S 0.707106777, delta_in 0.353553393, delta_out 0.353553384, fraction 0.499999994; rho = 4: 0.999999994, 0.250000002, fraction 0.749999997.
By hand: the resonant pairs at r = 2(1+eps) give (1/2) sum_{n>=0} si(2^{n+1} eps) and S(eps/2) - S(eps) = si(eps) -> 1 (telescoping); same count at r = 1/(2(1+eps)). So the log coefficient of B is 1/2 per log_2 on both sides and the ratio delta_in/delta_S of the cusp coefficients is rho^{-1/2}/rho^{1/2} = 1/rho.
Remark: delta_in is the part of the trace integral over z in (0, 1/rho) and delta_S the part over z in (0, 1); the log divergence is uniformly distributed in z. The fraction 1 - 1/rho is the Lebesgue measure of {z in [0,1] : rho z > 1}. "Exactly half" is this at rho = 2. It is a two-line fact.

### 2.2 Window-cutoff test of the spectral path (window_test.py)
Same FFT-Mellin method (rewritten, period 88 instead of 64), inside window [e^VIN, 1], 70 Lanczos steps, 20 modes, grid 5e-5:

| VIN | lam_0 | 1 - lam_0^2 | ||psi_0||^2 | ||F_S xi_0||^2 on x < e^VIN | corr(ln 2), K=20 |
|---|---|---|---|---|---|
| -10 | 0.99599959 | 7.98e-3 | 4.00e-3 | 3.98e-3 | 0.864 |
| -16 (record) | 0.99997308 | 5.383e-5 | 2.951e-5 | 2.433e-5 | 1.440 |
| -22 | 0.99999730 | 5.403e-6 | 5.291e-6 | 1.12e-7 | 2.698 |
| -30 | 0.99999741 | 5.180e-6 | 5.180e-6 | 6.9e-11 | 2.758 |
| -40 (period 128) | 0.99999741 | 5.180e-6 | 5.179e-6 | 5.5e-15 | 2.758 |

Stability at VIN = -30: grid 1e-4 / 5e-5 / 2.5e-5 give 1 - lam_0^2 = 5.177e-6 / 5.180e-6 / 5.181e-6; period 88 / 128 identical. Second-order perturbation theory predicts the shift: delta(1 - lam^2) = 2 x 2.433e-5 = 4.87e-5, i.e. 5.38e-5 -> 5.1e-6. Measured 5.18e-6.
160 modes, 300 Lanczos steps: VIN = -16: corr(ln2 - 1e-3, ln2, ln2 + 1e-3) = 1.45355, 1.45783, 1.46045 (first reviewer: 1.4535, 1.4578, 1.4604: my rewrite reproduces theirs). VIN = -30: 2.77333, 2.77560, 2.77619. Continuity at ln 2 holds in both.
Other modes: lam_1 = -0.9927326 (record -0.9927022), lam_2 = 0.6202438, lam_3 = -0.5609493: these are stable; only the top mode is strongly affected, through the weight 1/(1 - lam_0^2).
Archimedean control: VIN = -16: 0.99997109; VIN = -30: 0.99997139 (CC: 0.999971). The control is insensitive to the window because the archimedean F xi has no log singularity at 0; it does not validate the semilocal window.

### 2.3 Effect on E_S o Q (corr_eoq.py; own code for g = -f'' + f/4 by autocorrelation of k and k')
corr part of E_S o Q/||k||^2, plateau test function, 160 modes, window e^-16 -> e^-30:
- a = 0.30: j = 8: -28.22 -> -46.38 (res), -26.40 -> -46.53 (anti); j = 32: -27.34 -> -45.72, -26.55 -> -45.79; j = 128: -27.22 -> -45.71, -27.01 -> -45.73.
- a = 0.50: j = 8: -25.20 -> -42.98, -28.14 -> -50.14; j = 32: -24.88 -> -43.07, -28.41 -> -48.42; j = 128: -26.64 -> -45.35, -27.36 -> -46.11.
My e^-16 column agrees with the first reviewer's corr column (-25.20, -24.91, -26.49 at j = 8, 32, 128), which checks my g.
Corrected totals (first reviewer's delta_out part + my corr part): a = 0.5, j = 32: resonance about +154.7 (was +172.89), anti-resonance about -264.9 (was -244.92), half-split about 209.8 (was 208.90). For 2a < ln 2 the plateau level is about -52 to -55, not -33 to -36. With the record's numbers the semilocal level sat above the archimedean -45.99; with converged numbers it sits below it. "E_S o Q positive from j = 6" in the record moves to about j = 8.
The growth law (slope 2 pi c_2 R_phi(ln 2)/||phi||^2 per unit t) is unchanged: the shift is a constant, almost entirely the smooth mode-0 term.

## 3. Is "partly-confirmed" deserved?
Yes, but for (b) the first verdict over-reports what was verified:
- delta_out part: independent code by the first reviewer; I accept it (my corr-side g code agrees with theirs to 0.03 to 0.15).
- corr part: same script, same window; reproduced the artifact. Not independent.
- Mode coverage: 160 modes reach the clusters of size 2^{-5/2}/2, with Mellin frequency up to roughly 200. The tests at t = 580, 1160, 2321 contain no corr modes at the test frequency. The first reviewer's table shows the corr contribution arriving when modes near t are included (j = 16: -27.33 -> -24.70 between K = 20 and 80; j = 64 and 128 still moving at K = 160). The contribution seen is +0.4 to +2.6 at resonance, the sign that does not threaten growth, but the statement "verified to t = 2321 with corr" should read "with corr truncated below the test frequency".
- Continuity of corr at rho = 2 can be proved, contrary to "measured only": A = sum_n A_n with ||A_n|| <= 2^{-n/2}/2 and ||A_n||_HS <= 1, so ||A_n||_3^3 <= ||A_n|| ||A_n||_HS^2 and sum_n ||A_n||_3 < oo; hence A^3 is trace class and rho -> Tr(theta(rho^-1) T) is continuous for trace-class T. Continuity does not bound the Q-composite: for that one needs Mellin-frequency localisation of the high modes, which is the type of statement listed as open in arXiv:2611.13129 (their (66) and (H2')). So (b) cannot presently be upgraded to a proof.

## 4. Literature (5 web queries, 1 abstract fetched, 1 paper text-extracted and read in the relevant pages)
- arXiv:2611.13129 (Andrews, Connes, La Gatta, Nov 2026), Section 8: Lemma 8.5 is the semilocal uncertainty principle Range P_t ∩ Range P^_t = {0} (the record's "Theorem 1, no eigenvalue of modulus 1"). Lemma 8.6 and the text after (H2'): "p^k singular values of size p^{-k/2} give kappa_n ≍ n^{-1/2}", sum kappa_n = sum kappa_n^2 = oo, pair operator not trace class, tail "must be controlled against the scaling action, not as an operator"; (H2') open semilocally. This is the record's "dyadic ladder" and the reason the archimedean compact-error argument does not transfer. They also note that S = {oo, 2} with 2 < lambda^2 < 2.25 is still in the regime of the Connes-Consani archimedean paper as far as conditioning counts go.
- Connes-Consani arXiv:2006.13771 (support in (1/2, 2), "rational primes are not involved"); arXiv:2008.10974 (semilocal product quasi-inner, order 1/2); Connes-Consani-Moscovici arXiv:2310.18423 and arXiv:2403.01247 (S = {p, oo} moment problem; abstracts only).
- arXiv:2608.24827 (Zhu, Aug 2026; abstract only): claims computer-assisted positivity for supports in [-0.8, 0.8], i.e. 2a = 1.6 > ln 3. Unrefereed. If correct it shows directly that positivity past ln 2 is reachable by other means.
- Yoshida 1992, Bombieri 2000; Burnol's Sonine-space papers (math/0208121, math/0203120): nothing on the semilocal excess.
- Not found: the cusp fraction 1 - 1/p of the excess; unboundedness of E_S o Q along 2 pi j/ln 2; a published value of the top eigenvalue of P_1 F_S P_1 for S = {oo, 2} to compare with 0.9999974.
I agree with the first reviewer's assessment: the structural fact is in the literature in another form; the specific computation was not found. The search remains modest.

## 5. Scores
- Verification: partly-confirmed (unchanged), with the additional error of section 2.2.
- Arbitrariness 3 (unchanged). Canonical: the fraction 1 - 1/rho and the point ln 2. Framing-dependent: which sufficient condition is declared "the" route, the cutoff 1, the composition with Q, the choice to discard the Sonine trace. Downward pressure: none of the constants is tuned. Upward pressure: the title "Route I stops at ln 2" is a statement about the project's own transcription.
- Importance 2 (unchanged). An expert would not be surprised: Connes-Consani restrict to (1/2, 2) for this reason and the 2026 preprint replaces the argument by a different control. It constrains only the verbatim port. It is not a restatement of RH or of a classical equivalence.

## 6. One-line statement
The first reviewer's wording is within what is established. I keep it with "numerically" attached to everything except the cusp fraction.

## 7. Corrections the record needs
1. lam_S(0) = 0.9999974, 1 - lam^2 = 5.18e-6; lam_S(1) = -0.9927326. Remove 0.9999731 / 5.383e-5.
2. corr values (1.4285 / 1.4550 / 1.4628 near rho = 2 become about 2.77), the constant 13.62 (becomes 22.85), all absolute E_S o Q values (shift about -18 to -22), the comparison with the archimedean -45.99, and anything downstream that uses z = delta_S - eps_S or the weight 1/(1 - lam_0^2) (parent trace-identity record included; not re-checked here).
3. The first reviewer's items stand: log-periodic remainder of delta_out, the constant in lam_k ~ 1/(2 sqrt k), incompleteness of deep clusters, the Q-normalisation of "unbounded".
4. Public title and statement: "the required condition is false" should be "the sufficient condition used in the archimedean argument fails (numerically)"; "Route I stops at ln 2" overstates.
5. The sign-twisted (chi = -1) spectral run of the first reviewer used the same window and was not re-run here.
