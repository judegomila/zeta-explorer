# REFEREE: c4-stage-collision-law (adversarial, lens: general)

Date 2026-11-18. Reviewed: `RESULT.md`, `TABLES.md`, `stage.py`, `longscan.py`, the six `out_*.json` files and `out_dh.json` (read as data). Referee code (independent of the lane's code; mpmath, numpy, python-flint for the DH L-values only) was run on the Mac through `scripts/memcap.sh 8`, single process, in `/tmp/ref_c4scl/` (not kept in the repo). Nothing was run on the compute server.

## Verdict

**The verdict precise-obstruction holds, with five corrections to the wording (section 4). No error was found in L1 to L7. No statement about zeros of zeta is made, and none follows.** The lemmas are elementary and largely known (section 3); the content of the lane is the measured law, which I reproduced at heights the lane did not use.

Requirement flags set by the referee: **R1 false, R2 false, R3 false, R4 false** (section 5). These agree with the lane.

## 1. PROVED steps, re-derived

All seven confirmed by hand; L1, L3, L4, L7 also checked numerically at t = 30000.37, X = 173 (39 primes), 30 digits.

- **L1.** On s = 1/2 + it, 1 - s = conj s, so P_X(1-s) = conj P_X(s) and zeta_X = e^(-i theta)(e^(i theta) P_X + conj) = e^(-i theta) 2 |P_X| cos Phi. d/dt log P_X(1/2+it) = i P_X'/P_X = -i D_X, so (arg P_X)' = -Re D_X. Numerics: stage minus the closed form 4.9e-27; Phi' by differentiation against theta' - Re D_X agree to 5e-29; Phi'' against theta'' + Im D_X' agree to 30 digits; theta' - (1/2) log(t/2 pi) = -2.3e-11 (t^-2 = 1.1e-9). Correct.
- **L2.** In 0 < Re s < 1, t > 0: chi has its zeros at 0, -2, ... and poles at 1, 3, ...; P_X(s) and P_X(1-s) are holomorphic and zero-free for 0 < Re s < 1. So H is holomorphic, zero-free, and has a logarithm on the simply connected region. zeta_X = P_X (1 + H), so zeros are H = -1. Correct.
- **L3.** Real-analyticity gives the conjugate symmetry and the implicit-function statement. The Jacobian of (t, lambda) -> (Phi - L, Phi_t) is Phi_t Phi_{t lambda} - Phi_lambda Phi_tt = -Phi_lambda Phi_tt at Phi_t = 0, so the degree is -sign(Phi_lambda Phi_tt); the side on which the pair is real is Phi_lambda Phi_tt (lambda - lambda0) < 0. Both as stated. Phi_lambda = -arg(1 - p^(-1/2-it)) and Phi_tt = theta'' + Im D_X' are correct. Numerics: at the stationary point t0 = 30003.10089, Phi_tt = -15.94, levels offset by +-1e-3, +-1e-2, +-5e-2: predicted |z - t0| = 0.01120, 0.03542, 0.07920; found 0.01120 / 0.01126, 0.03535 / 0.03611, 0.07843 / 0.08330 (conjugate pair on one side, real pair on the other), and the stage vanishes there to 1e-27. Correct.
- **L4.** log|P_X(1-sigma+it)| - log|P_X(sigma+it)| = integral of Re D_X(u+it) over [1-sigma, sigma] since d/du log|P_X(u+it)| = -Re D_X. Numerics: identity to 1e-29 at sigma = 0.6, 0.8; -log|chi|/(2 sigma - 1) - (1/2) log(t/2 pi) = -2.2e-11, -1.5e-11. Correct.
- **L5.** |p^-s/(1 - p^-s)| <= 1/(p^u - 1), decreasing in u, so the mean over [1-sigma, sigma] is bounded by the value at 1 - sigma0. Correct. Table check: T^0.1 at the six heights gives 1.67, 3.17, 3.17, 4.48, 4.48, 5.66 against theta' = 3.57, 4.84, 5.99, 7.14, 8.29, 9.44: the "0 (PROVED by L5)" row is right at every height. "About X < (log T)^2/16" is a leading-order statement; at T = 1e8 the actual threshold is X < 17, not 21.
- **L6.** Intermediate value theorem plus |arg(1 - w)| <= arcsin|w|. Correct.
- **L7.** zeta = e^(-i theta) Z gives zeta'/zeta(1/2+it) = -theta' - i Z'/Z. Numerics: Re zeta'/zeta + theta' = 0 to 30 digits. Correct. It is the classical identity.

## 2. Numeric checks rerun with different cases

**(i) Rouche ratio for zeta, heights not used by the lane** (T = 3e4 and 3e5, 500 mean spacings, 16 points per spacing, 8000 points per line; zeta by mpmath at 25 digits, chi from its defining product, stage in float64; no point within 1e-6 of r = 1):

| T | a | c = 1 | c = 2 | c = 4 | lane range (8e3 to 1e9) |
|---|---|---|---|---|---|
| 3e4 | 0.5 | 0.9904 | 0.9982 | not finished | 0.9915-0.9941, 0.9975-0.9991 |
| 3e5 | 0.5 | 0.9942 | 1.0000 (all 8000) | 0.9443 | ..., ..., 0.927-0.959 |
| 3e4 | 0.25 | 0.8894 | 0.9896 | not finished | 0.852-0.880, 0.976-0.988 |
| 3e5 | 0.25 | 0.8774 | 0.9771 | 0.9985 | ..., ..., 0.9932-1 |

Reproduced. The one clean line (T = 3e5, a = 0.5, c = 2) is 500 spacings; at the lane's rate 1e-3 to 2e-3 with clustered failures this is one to three expected clusters and is not evidence of an empty set. Fraction of the line with Phi' < 0: 0.0536 (T = 3e4, a = 0.5, 400 units of t), 0.0477 (3e5, a = 0.5), 0 at a = 0.25 in 500 spacings at 3e5; consistent with Table A.

**(ii) Prime-only event rate at cases outside Table E** (1e6 samples each): T = 1e9, a = 0.3: zeta 1.09e-3, torus 1.12e-3, Gaussian 8.8e-4 (the lane's neighbours are 1.36e-3 at 1e8 and 1.0e-3 at 1e10). T = 3e7, a = 0.5: zeta 0.0379, torus 0.0347, Gaussian 0.0342. Reproduced, including the excess of zeta over the torus model at a = 0.5 (9%, 17 standard errors). I repeated both with the sampling interval lengthened from 1e6 to 1e8 and to T: 1.12e-3 against 1.18e-3, and 0.0374 against 0.0347. The excess at a = 0.5 does not depend on the interval length.

**(iii) Consistency of the text with the stored outputs.** Totals 2762 certified negative minima and 2302 certified off-line stage zeros match the JSON files. Tables A, B, C, D, E as quoted in `RESULT.md` match `TABLES.md` and the JSON, except for the items in section 4.

## 3. Controls run by the referee

**DH on the Rouche lines at a different height** (T = 3e4 to 3.07e4, 500 spacings; the lane used 8.3e3 to 9.9e3). True function from arb Dirichlet L-values (functional equation of the combination checked to 4.5e-11), stage in float64, X = (5T)^a:

| a | c = 0.5 | c = 1 | c = 2 |
|---|---|---|---|
| 0.5 | 0.9534 | 0.9874 | 0.9936 |
| 0.25 | 0.8087 | 0.8885 | 0.9738 |

The lane's DH numbers (0.953, 0.987, 0.994 at a = 0.5) are reproduced at a second height. So the DH pass fractions are also height-independent over the range tested.

**DH on the phase-locking statistic** (the one place where the lane reports a property that separates zeta's stage from the torus model; the lane tested it against random twists only). T = 3e4, a = 0.5, 2000 spacings, float64:

| family | intervals Phi' < 0 | median abs cos Phi at the minimum | fraction above 0.9 |
|---|---|---|---|
| zeta | 227 | 0.996 | 0.947 |
| random twist, seed 1 | 213 | 0.699 | 0.244 |
| random twist, seed 2 | 216 | 0.751 | 0.338 |
| Davenport-Heilbronn | 371 | 0.989 | 0.768 |

(uniform phase gives 0.287). **The phase-locking is shared by Davenport-Heilbronn.** It is therefore a property of a stage that tracks a function satisfying the functional equation, not of the Euler product and not of zeros being on the line. The lane already says the property "gives no constraint on the zeros"; this control shows it directly. The zeta rows reproduce Table F (0.992 to 0.996; 93% to 100%).

## 4. Errors and overstatements found

None changes the verdict or a flag.

1. **"Empty only at (a = 0.25, c = 4), T >= 1e8" is incomplete.** `out_1e8.json` and `out_1e9.json` also have the whole 2000-zero window passing at (a = 0.1, c = 8): Re s = 0.934 and 0.886, inside the strip, max r = 0.967 and 0.805 (Table C shows the W). The sentence in Results (c) "The whole 2000-zero window holds only for (T^0.25, c = 4) at 1e8 and 1e9, and for c = 8 at T <= 1e6" omits these two rows. They are far from the line (delta = 0.43, 0.39) and do not help R4.
2. **"Davenport-Heilbronn shares the pass rates" is true to the order of magnitude only.** Failing fractions at a = 0.5: c = 1: DH 1.3% (both heights) against zeta 0.6% to 1.0%; c = 2: DH 0.59% and 0.64% against zeta 0.09% to 0.25% in the six windows of the lane (0.18% and 0 of 8000 points in my two shorter windows), a factor of about 3 or more at both DH heights. 16-spacing sub-windows: 0.42 against 0.58 to 0.68 at c = 1, 0.48 to 0.58 against 0.82 to 0.94 at c = 2. The correct statement: DH passes at 98.7% to 99.4% of points at c = 1, 2 and fails at a height-independent rate that is larger than zeta's by a factor up to about 4. The inequality fails for both families, so this does not give a usable separation.
3. **"Failures are not predicted by the prime-only event except at c = 4, a = 0.5."** Table D shows the same prediction at c = 4 for X = log^2 T ([99, 78, 11, 311] at 1e5: 90% of event blocks fail against 35% of all blocks; [12, 12, 13, 462] at 1e7: 48% against 5%) and for a = 0.25 at 1e5 ([4, 7, 2, 486]). The exception is "c = 4 at every X that has the event", which is what L3 predicts (the contour passes the off-line stage zeros attached to the stationary points).
4. **Verdict item 4, "fails at 0.05% to 0.9% of anti-points for a <= 0.5".** That range is for a = 0.25, a = 0.5 and X = log^2 T. For a = 0.1 the rate is 3% to 6% and for a = 0.05 it is 9% to 14% (Table B). Read "0.25 <= a <= 0.5".
5. **Wording of the exit event.** By L6 the on-line count of an Euler stage is never below the monotone count (theta(t2) - theta(t1))/pi - 2 A_X/pi - 1. A wiggle of Phi across a level pi/2 + k pi adds two on-line zeros (a triple crossing); the conjugate pair of L3 is the same two zeros before they arrive. So in this family the stationary event governs extra stage zeros and where the off-line ones sit, not a loss of zeros from the line relative to the count of zeta. The sentence "a stage zero pair can leave the line only if Phi reverses by about pi/2 around an anti-point" should say that a wiggle centred on an anti-point needs a total drop of pi to reach the two neighbouring zero levels (pi/2 on each side); the observed maximum total drop 0.50 pi is half of that, not at it.

Smaller points.
- The lattice-translate control is the map's control WT in stage form: with alpha log(tA/2 pi) = 100 pi, chi(1/2 + i(t - alpha)) differs from chi(1/2 + it) by a phase alpha (t - tA)/(2t) + alpha^2/(4t), about 1e-3 rad at 1e7. The identical digits in Tables B and C at T >= 1e7 are a consequence of the WT lemma, not an independent measurement. The text says so in its "step" column; the abstract's "share the pass rates" should not be read as two independent confirmations.
- "L7 explains why" (phase-locking): L7 is an identity on the line; the explanation (the smoothed sum over zeros is small in the middle of a large gap) is a heuristic and is not proved in the lane. The DH row in section 3 above is consistent with it.
- The attribution of the 7% to 9% excess at a = 0.5 to prime pair correlations at X^2 = T is not tested. It is reproduced and is independent of the sampling-interval length (section 2 (ii)); its cause is open.
- "The event is empty only in the trivial regime" is measured on the sampled heights. For a fixed prime set the supremum of Re D_X over the torus equals the L5 sum, so at fixed X the event recurs at arbitrarily large t as long as that sum exceeds theta'(t); the statement in the scaled regime X = X(T) is not proved between (log T)^2/16 and the smallest X where events were seen.
- Table E samples t in [T, T + 1e6] only; "follows the torus model to T = 1e20" is a statement about that interval at each height.
- The DH row "min Phi'/theta' = -139 to -188" is height-dependent (I get -70 at T = 3e4 on a 64-point grid); the grid minimum near zeros of Q_X is not a converged quantity.

## 5. Checks required by the assignment

- **Assumes RH?** No. Zeros come from `acb.zeta_zeros` with exact index; all are below 1e9 + 1e3, inside the verified range, and are used only as data. L1 to L7 are unconditional. The count error e = N(t) - (k+1) uses the certified list.
- **Restates verified height?** The window statistics are finite computations below height 1e9 and are presented as such. No statement beyond the sampled points is made.
- **Known theorem presented as new?** No. The lane attributes the stage and the small-X statement to Gonek (2012) and Gonek-Hughes-Keating, from memory. L1, L5, L6 are in substance Gonek's line representation and his count and simplicity statements; L7 is classical; L3 is the fold (saddle-node) normal form; L4 is one line. They are labelled elementary, not new. The reference was not checked against the source by the lane or by me; any write-up outside the campaign must do that first.
- **Zeta-only mechanism claimed?** None is claimed. The one zeta-against-twist difference (phase-locking) is shared by DH (section 3).

Requirement flags, strict:

- **R1 = false.** Multiplicativity enters only L5 and L6, which hold for every unimodular twist; the measured laws are shared by the two-character DH stage to within a factor 4 in failure rate.
- **R2 = false.** Positive failure rates at every fixed (c, a) near the line, reproduced at two further heights; the empty cases are single windows at c = 4 and c = 8, far from the line on the scale 1/log T.
- **R3 = false.** DH and the window translate pass at the same order; seven controls not run.
- **R4 = false.** No inequality between zeta and zeta_X near the line is proved; sampled points only; Rouche would give counts in a box, not location.

## 6. What survives

PROVED (elementary, confirmed): L1 to L7. MEASURED (reproduced at T = 3e4, 3e5 for zeta and T = 3e4 for DH): at fixed a = log X/log T the stationary event has a positive rate close to the torus model; the Rouche inequality on Re s = 1/2 + c/log T fails at a height-independent positive fraction of points for a = 0.5, c = 1, 2 (zeta about 0.6% to 1.0% and 0.1% to 0.25%; DH about 1.3% and 0.6%); whole-window passes occur only at (a = 0.25, c = 4) and (a = 0.1, c = 8) for T >= 1e8 and to the right of 1. The phase-locking of the stationary intervals to stage anti-points holds for zeta and for DH and not for random twists. Obstruction as stated by the lane: the stage family gives no height-uniform inequality near the line and no step that fails for DH or the window translate. Nothing about zeros of zeta.
