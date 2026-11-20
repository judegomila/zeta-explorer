# REFEREE: c17-window-information-law-ctheta-u5 (lens: general)

Date: 2026-11-19/20. Target: `RESULT.md` in this directory. Claimed verdict: precise-obstruction; no statement about zeros of zeta; flags R1 = R2 = R3 = R4 = false.

## Verdict of the referee

**Holds, with corrections.** Every step labelled PROVED was re-derived and is correct as stated (Theorems 1 to 6, Lemma P, Lemma E, Corollary T' relative to Turan's theorem). Independent numerics on new cases agree with the closed forms and with `wil.py` to all digits printed. Nothing assumes RH, nothing restates verified height, no statement about a zero of zeta is made. The corrections concern (i) one wrong row and one unsupported row of the controls table, (ii) three summary sentences that say more than the theorems give, (iii) attribution: Theorem 1 is the classical Weil form on tests of bounded support, not a new frame. None of them changes the verdict or a flag. Flags set by the referee: R1 false, R2 false, R3 false, R4 false.

## 1. Re-derivation of the PROVED steps

- **Theorem 1.** g(z) = <v_(conj z), h>, g^#(z) = <h, v_z>, so f(z) = <h, v_z><v_(conj z), h>; int f = 2 pi norm(h)^2; (D) becomes <h, T_Z h> >= -2M norm(h)^2. Confirmed. (b): abs(int_0^u e^(-isz) ds)^2 = 2(1 - cos uz)/z^2, int = 2 pi u, F = abs(g)^2/(2u) has int pi and norm(h)^2 = 1/2. Confirmed. (c): support [-xi - delta, xi + delta], int B_delta = 1, bhat(xi) = 0 for abs(xi) >= delta so int w = 1. Confirmed. Gap (minor): the "only if" of (a) needs Lemma 0 (recalled, not opened; the statement is the Akhiezer-Krein factorisation and is correct) and a density step, because abs(g)^2 for general h in L^2 need not have the decay required in K_u, and T_Z for an infinite Z is only a form on a dense domain. Not written; not doubtful.
- **Theorem 2.** G_kl = u sinc(u (z_l - conj z_k)/2); non-zero spectrum of V J V* = spectrum of J G, similar to G^(1/2) J G^(1/2); inertia (n, n) by Sylvester. One pair: J G = [[u, N],[N, u]], N = u sinh(A)/A; extremal h = v_z - v_(conj z) = -2 e^(isx) sinh(bs), norm^2 = (sinh(ub)/b - u)/2. (d) follows. Confirmed.
- **Lattice background.** Poisson summation gives T_Gamma = (2 pi/d) sum_m e^(2 pi i m x_0/d) (shift by 2 pi m/d); only m = 0 survives on an interval of length u <= 2 pi/d. Confirmed.
- **Theorem 3.** T = (Lg + 2M) Id + V K V*; non-zero spectrum of V K V* is that of K V*V; congruence by R^(1/2). Confirmed (needs the columns of V independent, i.e. distinct points: stated for the cluster, should be stated for added on-line points too).
- **Theorem 4.** s(z) = sin(pi (z - x_0)/d) has type Lg/2, abs(s) <= 1 on R, s real on R, zeros only on R. (a): the values g(z_k) are arbitrary (interpolation in PW at finitely many points), take g(z_j) = 1, g(conj z_j) = -1. Confirmed. (b): the 2 x 2 matrix of c|a><a'| + conj(c)|a'><a| in the basis (a, a') is [[c u_1, c N],[conj(c) N, conj(c) u_1]]; eigenvalues u_1 Re c +- sqrt(abs(c)^2 N^2 - u_1^2 (Im c)^2); the inequality "lowest <= -abs(c)(N - u_1)" reduces to N >= u_1. norm(h) <= norm(h_1). Confirmed.
- **Theorem 5.** Trace identities and the bound confirmed; n = 1 gives (sinh A/A)^2 <= (1 + c)^2.
- **Theorem 6.** Transform of f(. + ib) is supported in [-u, u] and vanishes at the ends; Poisson. Confirmed.
- **Lemma P.** Confirmed (pairing z with conj z gives Re[e^(i phi) S]; choose phi).
- **Corollary T'.** Reconstructed without c16: Turan applied to the n growing points x_j - i b_j only (the conjugates and on-line points have modulus <= 1 and go into D'); Re sinc^2(w) >= 0.913 for abs(w) <= 1/2 gives min of partial sums >= 0.913 delta/(2 pi), and with Turan's factor 2 the constant 0.29 delta; nu >= lambda n + 1 gives the stated prefactor; 1.2 log(48 e) = 5.845. Confirmed relative to the theorem. The statement of Turan's second main theorem used (range nu in [m+1, m+n], constant 2 (n/(8e(m+n)))^n, minimum of partial sums in the order of decreasing modulus) agrees with the referee's recollection of Montgomery, Ten Lectures, chapter 5; not opened by the referee either. "Relative to" stays.
- **Lemma E.** C_a C_b = C_(a+b), C_a = 0 for a >= u; the product and the logarithmic derivative follow. Confirmed. It is the statement that Dirichlet series truncated at e^u form a quotient of the Dirichlet ring; elementary, and labelled as such would be more accurate than a lemma presented as a finding.

## 2. Numerics rerun (new cases; server, through rhrun; units rh-c17wil-ref-1120034410 (stopped by the referee after its first four parts; the fifth part was badly written by the referee and too slow) and rh-c17wil-ref2-1120041432 (finished); 2 cores, limit 6 GB; none left running)

Script: `~/rh-push/c17wil-referee/refcheck.py`, `refcheck2.py` on the server (independent code: mpmath eigenvalues of [sinc(u (z_k - z_l)/2)] at 90 to 140 digits; a float64 discretisation of T on a midpoint grid; then `wil.py` on the same cases).

| Check | Referee (independent) | Result's law or `wil.py` |
|---|---|---|
| Inertia, random clusters n = 4, 7, 9 | 4, 7, 9 negative; 4, 7, 9 positive; imaginary parts below 1e-89 | n negative (Theorem 2 (a)) |
| One pair, c = 0.37 (new) | 1.4171797649 | closed form 1.4171797649 |
| Row n = 20, c = 1, kappa = 2, cos^2 (in the tables) | 10.9836 | 10.98 |
| Row n = 14, c = 0.5, kappa = 2, cos^2 (new) | 8.2673 | `wil.py`: 8.2673 |
| Row n = 28, c = 0.5, kappa = 2, cos^2 (new) | 14.4352 | `wil.py`: 14.4352 |
| Same family, kappa = 1 and equal offsets, n = 14 | 1.78; 2.58 | no growth (as stated) |
| Below Nyquist, Lg = 10, u = 7, M = 0.3 (new) | 0.365976 | exact law 0.365976 |
| Theorem 4 (b), Lg = 10, u = 13, M = 0.1, x = 0.3 d | 0.099199 | `wil.py` 0.099199; proved interval [0.023317, 0.168390] |
| same, x = 0.5 d | 0.109968 | 0.109968; [0.023317, 0.157860] |
| Lg = 10, u = 17, M = 0.02, x = 0.2 d | 0.028134 | 0.028134; [0.006987, 0.042225] |
| Lg = 10, u = 26, M = 0.5, x = 0.35 d | 0.024700 | 0.024700; [0.018371, 0.041371] |
| Theorem 4 (a) trend, u = 13: M = 1e-3, 1e-5 | 0.01809, 0.001842 (ratio 9.8) | sqrt(M) scaling, to 0 |
| Theorem 6, extremal one-pair test summed over a row, spacing 2 pi/u, b = 0.9 and b = 6; spacing 2 pi/(1.25 u), b = 2.5 | 0.3064452 (J = 80000), 0.3062155, 0.3830581; convergence O(1/J) | (2/d) int f = 0.3064480, 0.3064480, 0.3830600 |
| Theorem 6 outside its range: spacing 2 pi/(0.8 u), 2 pi/(0.6 u) | 0.0196 and -0.1182 against 0.2452 and 0.1839 | identity fails, as it should |

The slope between the two new rows is (14.4352 - 8.2673)/14 = 0.441 per pair, consistent with the 0.445 n + 2.1 reported. No discrepancy found in any rerun number. The zeta-ordinate tables (test B) were not rerun; four of their reference values were recomputed by hand from the laws (0.3901 at 1e6, theta = 1/2; 0.0236 at u = 27.63, M = 1; u b = 9.09, 9.08 at n = 16) and agree.

## 3. Errors and overstatements

**E1 (wrong control row). zeta(s+a) zeta(s-a).** The table says this control "fails in a window", on the evidence of finite clusters on zeta's ordinates (count-preserving, or added with the on-line zeros kept). Neither is the control. The control moves every zero off the line and keeps none on it: pairs gamma +- ia at every ordinate. In the lattice model that is a row of spacing 2 pi/Lg, and by the result's own Theorem 6 it passes the complete device with any offset a for every u <= Lg (theta' <= 1), not only for theta' <= 1/2. Operator form: T_Z = E_- T_Gamma E_+ + E_+ T_Gamma E_- with E_+- multiplication by e^(+-as); with T_Gamma = Lg Id this is 2 Lg Id >= 0. The referee's Theorem 6 check at spacing exactly 2 pi/u and b = 6 confirms the identity numerically. So in the only model where the result has theorems, this control is invisible up to P = t/2 pi. On zeta's actual ordinates the full shifted configuration was not tested by anyone. The measured decay to 0 of the count-preserving finite clusters at theta' = 0.54 to 0.58 is an effect of a finite block inside an on-line exterior (and of theta' > 1/2 for half-density rows), and says nothing about the control. Correct entry: "passes for theta' <= 1 in the lattice model (Theorem 6); zeta's ordinates: not run". This makes R3 fail more strongly; the flag is unchanged.

**E2 (unsupported control row). Davenport-Heilbronn.** "Fails at large height; its off-line pairs are isolated (bounded number per window)" is asserted, not shown, and not run. The off-line zeros of DH are of positive density T in fixed strips to the right, and nothing bounds their number per unit window close to the line; many of them lie outside the strip abs(Im z) <= 1/2 assumed for a configuration. The entry should read "not run; outcome depends on zero location only".

**E3 (summary sentence stronger than the theorem). "With tolerance the one-pair reach is about sqrt(12M) u^(-3/2)."** Proved: the reach is at least the root of mu(b, u) = 2M (slightly below sqrt(12M) u^(-3/2)) and at most sqrt(12M)/abs(sin) (u - Lg)^(-3/2); the ratio of the two is (u/u_1)^(3/2)/abs(sin), unbounded as theta' -> 1+ and at lattice points (there the proved upper bound comes from the sinh^2 term and scales like M^(1/4) u_1^(-3/4) Lg^(-1/2), a different power). Referee's cases: threshold 4.3, 4.7, 4.0 times the lower value at theta' = 1.3, 1.3, 1.7 and 1.34 times at theta' = 2.6; the result's own table has 3.1 at theta' = 1.07 and 2.6 at 1.5 (midpoints, M = 1). "About" is accurate only for theta' >= 2 or at lattice points. The order sqrt(M) u^(-3/2) for fixed theta' > 1 away from lattice points is correct.

**E4 (W4 and item 0: "only when off-line pairs have local density of order u/2 pi over a length of order b_max").** Not proved. Corollary T' gives a count: n >= (u b_max - logarithms)/5.85 pairs in the cluster, with the cluster diameter r entering only through log(r + 1/2). It gives no bound on the length over which those pairs sit, so "density over a length of order b_max" does not follow; the measured examples have that shape, which is evidence, not the converse. W4 must carry ARGUED. The one-pair regime (b below the one-pair reach, n = 1, no density needed) is also an exception to the sentence as written.

**E5 (W5, second bullet, labelled PROVED).** "Isolated pairs with b_gamma (log gamma)^(3/2) -> 0 pass": Theorem 2 (d) and 4 (b) treat one pair in the whole configuration. For a sequence of pairs the negative parts add; the Gram entries between two pairs at distance D decay only like 1/(uD), which is not summable over a sequence of bounded gaps, so the passing statement for infinitely many "isolated" pairs is not proved by the cited theorems (it is plausible with the on-line background Lg as reserve; that needs a frame-bound argument that is not in the note). Also, by Theorem 1 (a) the unwindowed complete device has no height, so "u = theta log gamma" has a meaning only for the windowed device of section 3, for which no theorem is proved. Label: ARGUED.

**E6 (attribution; known theorem presented as the lane's frame).** Theorem 1 is Weil's quadratic functional restricted to tests g * g~ with g supported on an interval of length u (Weil 1952; Yoshida's Hermitian forms on functions supported in [-a, a]; Bombieri's remarks on Weil's functional; Connes-Consani), with a tolerance added; T_Z + 0 >= 0 for all u is Weil's criterion. The repository already carries the same form (Route I, pole-free Weil positivity as a Toeplitz form). The indefinite rank-two contribution of an off-line pair, Theorem 6 (Poisson) and the lattice identity are standard. The result says "new against c15/c16", which is true, but item 1 of the verdict and the proposed map row should say "classical frame (Weil, Yoshida)". What is specific to the note: the explicit one-pair constant with tolerance, Theorem 4 (b), Lemma P with Corollary T', and the measurements.

**E7 (scope of a measured sentence).** "Clusters on the ordinates do not grow with n" is measured for two offset profiles (equal, cos^2) at fixed positions. The result says so in section 8; the one-line claim should carry "in the two profiles tested". Bisection assumes the passing set is an interval; the equal-offset rows at 1e9 are visibly non-monotone in n (0.210, 0.229, 0.189, 0.164, 0.184), which does not contradict anything but shows the thresholds are mode-specific.

**E8 (minor).** Section 5.4 has a sentence cut off ("The machine load was"). The lane held 9 cores for about a minute against its allowance of 8 (reported by the author). Theorem 3 needs distinct points for all columns of V.

## 4. Checks asked for

- RH assumed anywhere: no. The one place a consequence of RH appears (local count with error o(log t), W5 last bullet) is labelled as such and ARGUED.
- Verified height restated: no.
- Known theorem as new: see E6 (frame) and the remark on Lemma E. Turan's theorem is cited as classical and "relative to".
- Zeta-only mechanism claimed: none. Sections 3 and 6 state that no step uses multiplicativity and that controls pass or fail through zero location only; so there was no zeta-only step to run the controls against. The referee's control finding is E1: zeta(s+a) zeta(s-a) passes in the lattice model for theta' <= 1.
- Statement about zeros of zeta: none. The zeta-ordinate numbers are about synthetic sets (ordinates in a window, lattice outside).

## 5. Requirement flags (referee)

- R1 false. No inequality is obtained from multiplicativity; Lemma E is an identity valid for every completely multiplicative chain.
- R2 false. The theorems are uniform in the lattice model only; nothing is established for zeta at any band.
- R3 false. T-NR passes for P <= q; zeta(s+a) zeta(s-a) passes for theta' <= 1 in the lattice model (E1); ZQ rows pass; sign chains are not separated by any step.
- R4 false. The result is a limit on what the device class can exclude; the exact device above the Nyquist band is the target restricted to a window.

## 6. What survives

The complete band-u device is the form of T_Z on L^2 of an interval of length u (classical frame). Proved: a cluster of n pairs contributes exactly n negative directions; one pair against a tight background alpha is invisible exactly up to sinh(ub)/(ub) = 1 + (alpha + 2M)/u; in the lattice model above u = Lg an exact device excludes every finite cluster, and with tolerance M one pair passes below the root of mu(b, u) = 2M and is excluded above the root of (sin^2 + sinh^2) mu(b, u - Lg) = 2M; infinite rows of spacing <= 2 pi/u pass with any offset; u b_max <= 5.85 n + logarithms for one cluster, relative to Turan. Measured and reproduced on new cases: tapered half-Nyquist rows pass with slope 0.44 per pair. Not established: the density form of W4, the sequence form of W5, the DH and zeta(s+a) zeta(s-a) rows of the controls table as written. Verdict precise-obstruction stands; headline unchanged.
