# REFEREE: c1-leeyang-krein-limit (lens: general)

Date: 2026-11-17. Target: `RESULT.md` in this directory. Claimed verdict: precise-obstruction.

## Outcome

**Holds as a precise obstruction.** Every step labelled PROVED was re-derived and confirmed. Four defects were found; none changes the verdict. No statement about zeros of zeta is made, RH is not assumed anywhere, verified height is not used, and Theorem D is not presented as new (section 8 item 2 disclaims novelty).

Flags set by this referee: R1 = true (stage ingredient only, see below), R2 = false, R3 = false, R4 = false. Same as claimed.

## Re-derivation of the PROVED steps

**Theorem A (semicontinuity).** Confirmed. (Pf) conj(Qg) is in L^1, so weak-* convergence of bounded symbols gives weak-operator convergence of Gamma_-; a nonzero (k+1)x(k+1) minor of the limit stays nonzero for large N. The bound sup norm(S_N) < inf is not even needed for this step beyond weak-* convergence itself. Remark (b) is correct: spans of Poisson kernels are dense in L^1 of the axis.

**Theorem B.** Confirmed.
- Self-duality checked directly: w(n) n^(-1/2) = exp(((log n - L/2)^2 - L^2/4)/(2L)) is symmetric under n -> M/n, the frequencies (L/2 - log n) are symmetric, and chi(M/n) = chi(M) conj chi(n). So conj G_M(-conj z) = c G_M(z) with abs(c) = 1.
- Re b = 0: Re L_M(z) = Re b + sum x/abs(z - i gamma)^2; self-duality gives Re L_M(-conj z) = -Re L_M(z) and the sum is odd in x, so Re b = -Re b. A zero at z = 0 adds 1/z with real part x/abs(z)^2; no change.
- (ii): abs(D_M - 1) <= zeta(5/2) - 1 = 0.3415 on Re s >= 3 uses w(n) <= n^(1/2); abs(S_M + 1) = 2/abs(1 + alpha L_M) is an identity; Vitali applies since abs(S_M) <= 1 on Re z > 0.
- The reformulation Re D_M'/D_M > -L/2 and the formula a(s) = 1/s + 1/(s-1) - (1/2) log pi + (1/2) psi(s/2) for xi'/xi - zeta'/zeta are correct.

**Theorem C and Corollary C1.** Confirmed (Vitali, then Hurwitz). C1 needs L_chi to be analytic near s0 with a zero there; that is the content of `ap-global-bridge` Thm. C (refereed there), consistent with L_chi(s) = h(s)/zeta(1 + s - s0) near s0.

**Theorem D.** Confirmed in both directions.
- exp(-E_1(w)) = e^gamma w exp(-Ein(w)) follows from E_1(w) = -gamma - log w + Ein(w); entire, single zero at w = 0.
- abs(E_1(w)) <= e^(-Re w)/abs(w) for Re w > 0 follows from E_1(w) = e^(-w) int_0^inf e^(-t)/(t + w) dt.
- int_P^inf x^(-s)/log x dx = E_1((s-1) log P) by u = log x.
- (a) implies (b): log zeta - E_1((s-1) log P) is analytic across s = 1 (the logarithms cancel), so the identity log zeta - log R_P = remainder extends from Re s > 1 to Re s > theta; the remainder bounds are correct.
- Omega_theta is connected, so Theorem C applies for (b) implies (c) implies (a).

**Section 5 comparison.** The integration of Re D_M'/D_M > -L/2 and the orders of the exponents (L ~ P against P^(1-sigma)/log P) are correct. One step is not justified: see defect 1.

## Independent numerics (different cases)

Script and log: `/tmp/ref-c1-lyk/ref.py`, `/tmp/ref-c1-lyk/ref.log` (local, through `scripts/memcap.sh 8`, float64 + mpmath; MEASURED). The compute server was not used.

A. Theorem B at P = 23, 41, 53 (not in the lane's list), alpha = 0.5 and 2 (lane used 1), grid Re z in {0.01, 0.05, 0.5, 1, 2.5}, Im z in [0, 80], phases: zeta, U with a different zero s0 = 0.6 + 33i, a new random twist, and chi(p) = -1 (Liouville; not in the lane). All 12 cases: min Re L_M > 0 (0.21 to 2.09), max abs(S_M) < 1 (0.9908 to 0.9939). sup abs(S_M + 1) at Re z = 1 against 2/(1 + alpha L/2): P = 23: 0.375 / 0.345 (alpha 0.5), 0.109 / 0.099 (alpha 2); P = 53: 0.170 / 0.164, 0.0455 / 0.0435. All four phase choices agree within 3 percent.

B. Theorem D at new points, Euler stages, P = 1e3, 1e4, 1e5, 1e6, 4e6, relative error of the pole-renormalised stage against zeta: s = 0.65 + 25.2i: 0.135, 0.097, 0.048, 0.033, 0.023; s = 0.8 + 48i: 0.044, 0.019, 0.0057, 0.0042, 0.0011; s = 0.55 + 14.3i: 0.41, 0.26, 0.21, 0.15, 0.14; s = 0.52 + 21.1i: 0.88, 0.68, 0.52, 0.42, 0.40. Raw stages do not converge (0.52 + 21.1i: 0.98, 0.32, 0.88, 4.8, 4.4). Consistent with the lane's Test 2.

C. Control U with zero at 0.6 + 33i (lane used 0.75 + 20i). Raw stage at s0: 0.094, 0.069, 0.055, 0.045, 0.041 (tends to 0); zero-renormalised stage at s0 + 0.1: 0.1121 - 0.0124i (stable to 4 digits); at s0 + 0.2i: 0.0618 + 0.2661i (3 digits); with zeta's pole factor the values do not settle (at s0 + 0.2i: 0.049 + 0.238i, 0.110 + 0.194i, -0.050 + 0.103i). Left of s0 (s0 - 0.08) the zero-renormalised values drift: -0.0874, -0.0791, -0.0737, -0.0698, -0.0680. This is slow convergence, not divergence: chi(p)^2 p^(-2s) tends to -p^(-2 sigma) for this construction, and 2 sigma = 1.04 here. The lane's statement for U is confirmed to the right of and beside the zero; to the left it is confirmed only as "drift decreasing".

D. Test 3 with a different method and window: argument-principle count of zeros of 1 + L~ (poles of S~) in 0.002 < Re z < 4, Im z in (30, 50) (U: (36, 56)), alpha = 1, 24000 contour points, largest phase step 1.43 rad.

| P | L | L dT / 2 pi | zeta | U | random |
|---|---|---|---|---|---|
| 17 | 13.1 | 41.8 | 42 | 42 | 42 |
| 23 | 19.2 | 61.2 | 62 | 61 | 62 |
| 31 | 26.0 | 82.8 | 84 | 83 | 83 |

The count equals the number of stage zeros in the window, for all three phase choices. The lane's Newton counts (27 of 32, 118 of 130) are undercounts, as section 8 item 1 says; the true count is one pole per stage zero.

## Defects

1. **Section 5, unjustified constant.** abs(D_M(1 + delta + it)) <= zeta(1 + delta) is asserted, but w(n) >= 1 with w(n) up to n^(1/2), so the termwise bound is sum n^(-1/2 - delta), which diverges. The bound is true numerically (sup over t in [0, 80] of abs(D_M(1.1 + it)) = 3.76, 3.91, 4.00 for P = 23, 41, 53 against zeta(1.1) = 10.58) but not proved in the note. A proved version: integrate to sigma' = 3/2 + delta, giving exponent L (3/2 + delta - sigma)/2. The conclusion of section 5 (exponent of order P, weaker than the trivial bound) is unaffected.

2. **"liminf rank = infinity" is measured and argued, not proved.** Verdict item 2 and the claim summary state it as a consequence. It rests on five values of P (plus three here). A short proof appears available (near each stage zero L~ = 1/(z - i gamma) + c with Re(1 + c) about 1 + Re a - L/2 < 0 for large L, so 1 + L~ has a zero at Re z > 0), but it is not written in the result. Label stays MEASURED/ARGUED.

3. **Test 3: the object is not the Krein index.** The gamma-normalised, pole-renormalised stage is not self-dual, S~ is not unitary on the axis (sup abs(S~) on the axis 1.1 to 1.8 in the log), and the inertia theorem "negative index = rank Gamma_-" (stated for even F, from the unrefereed `sq-krein-index`) does not apply to it. "Rank" in item 2 means the number of right-half-plane poles of S~. The text says "no longer inner" but the verdict sentence should not be read as a Krein-index statement. Also the Curie-Weiss stage targets zeta(s)/zeta(2s) while the archimedean and pole factors used are those of zeta; this does not affect the pole count.

4. **Theorem D is a known-type statement.** It is Hurwitz plus the von Koch equivalence; the result says so and claims no novelty. The Lee-Yang version of "(b) implies (a)" does not name its normaliser (the same pole factor works since zeta(s)/zeta(2s) has the same pole and no further zeros or poles in Re s > 1/2). The inertia input in section 1 is unrefereed; it is used only for the phrase "Krein negative index of the stage is 0" in Theorem B(i), not for any later step.

## Controls

- Zeta-only mechanism claimed: none. Theorem B and Test 3 are stated as identical for zeta and all unimodular twists; confirmed here for U (different zero), a new random twist and chi(p) = -1.
- The only separation claimed is the divisor of the normaliser (zero at s = 1 for zeta, pole at s0 for U); confirmed in part C. The step where U fails (local boundedness with a zero-free normaliser) is the step that is open for zeta. The result states this.
- DH is by citation, E_a is argued, six controls were not run. Not re-run here either: no mechanism is claimed for them.

## Requirement flags (strict)

- R1 = true, in the limited sense stated in the result: the proved implication "(b) implies (a)" of Theorem D needs zero-free stages, which come from the Euler product (or Lee-Yang on prime spins); non-product stages (Dirichlet sums, DH) do not have them. Multiplicativity does not separate zeta from U at any proved step.
- R2 = false. No unconditional conclusion in any window; Theorem B is height-uniform with the constant limit -1.
- R3 = false. U and zeta pass or fail the same proved steps; most controls not run.
- R4 = false. Bridge normalisation: limit -1. Strip topology: hypothesis equivalent to RH.

## Surviving claim

Rank Gamma_- is lower semicontinuous under bounded weak-* convergence (proved). In the self-dual conductor normalisation every Lee-Yang stage symbol is inner and tends to -1 on Re z > 0 for zeta phases and every unimodular twist (proved relative to the refereed stage theorem; measured in 42 cases across both runs), so the semicontinuity chain gives no information. With the gamma factor and pole renormalisation the stage symbol has one right-half-plane pole per stage zero, the same for zeta, U and random twists (measured, argument-principle counts for P = 17, 23, 31; not proved for all P). In the strip topology, zeta has no zero in Re s > theta if and only if the pole-renormalised Euler stages are locally bounded on {Re s > theta, s != 1} (proved; Hurwitz plus von Koch; no novelty claimed). The Lee-Yang inequality gives a stage bound with exponent of order P, weaker than the trivial bound (proved up to the constant in defect 1). No statement about zeros of zeta is established.
