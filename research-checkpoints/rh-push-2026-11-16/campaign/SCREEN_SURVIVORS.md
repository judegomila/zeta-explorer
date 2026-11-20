# Screening arm: survivors

Maintained by the screening record step. Source records: `campaign/screened.jsonl` (one line per screened combination) and `engine/outcomes/s<round>-*.json`.

SURVIVOR = zeta passes at every size reached; every control fails at a size much smaller than the height of its off-line zeros would explain, or for a reason that does not depend on resolving zeros; the statistic uses all primes together.

Status after round 6: 240 combinations screened (60 batches; 40 combinations in each of rounds 1 to 6), 0 survivors claimed, 0 demoted. No screener in any round claimed a survivor, so no RESULT.md claim needed checking against the definition; the ten round-6 RESULT.md files each state "Survivors: 0" / "no survivor" (checked by reading the verdict lines of all ten). Observations closest to the definition are recorded per round below as partial separations, not survivors.

## Current survivors

| name | exact statement | evidence | slug | why not verified height | first thing an attack lane should try |
|---|---|---|---|---|---|
| (none) | | | | | |

## Demoted

None (no screener claimed a survivor in rounds 1 to 6).

## Partial separations recorded in round 1 (not survivors; each fails one clause of the definition)

| observation | slug | clause it fails |
|---|---|---|
| DH has an excess Jensen gap of 0.08 to 0.09 at equal mollifier length 300 that does not come from zeros (no Euler product) | s1-scattering-one-line (4) | mean value (MV-CAP); E_a shows no excess; T-NR passes with its own Euler factor |
| Thin Hankel norm: DH exceeds 1 from 45 coefficients (L* about 6.7) against q*gamma/2pi = 68; sign and unimodular twists fail at L <= 2.72 through a non-unimodular symbol | s1-kernel-shear-norms (2) | DH onset is at the resolution of its first off-line zero; twist failure uses the functional equation only; T-NR c=2.05, E_a b=0.2 and heat tau=-0.05 pass |
| Small-gap exponent (no counting function): zeta 2.95 to 2.98, L(chi) 2.97, DH 2.07, heat 1.98 to 2.16 | s1-zero-statistics-gram (1), s1-zero-flow-dynamics (2,3) | proportion statement; DH separates only from 3,000 to 10,000 zeros; T-NR has zeta's on-line zeros exactly; blind to small heat steps |
| sup/rms and 1-line statistics: DH and T-NR differ at Haar level through coefficient growth N^0.26 to 0.31 | s1-prime-torus-orbit (2), s1-scattering-one-line (1) | zeros right of 1 / coefficients only; sign and unimodular twists not separated |
| CMV first |alpha| >= 1: DH order 149 to 152, T-NR 7 to 15, E_a 7 to 12, zeta none to 400 | s1-zero-statistics-gram (3) | same order as the first negative Pick pivot (verified height) |

## Patterns at which separation stopped in round 1 (for the allocator)

1. Pointwise sign tests in the strip (W < 0, E_+ - E_-, Laguerre form, interlacing of R_a) are local zero detectors: every control onset lies 0.02 to 0.4 below its first off-line ordinate.
2. Statistics of the list of on-line ordinates cannot fail every control: T-NR (c > 2) has zeta's on-line zeros exactly, the unimodular twist translates the list, E_a has none.
3. Torus / orbit / 1-line statistics are functions of the coefficients and are invariant under rotation: sign and unimodular twists have the same law as zeta.
4. One-sided inequalities with a non-negative kernel on the prime side cannot be violated by twisted weights (sign twist, THIN, DEL, unimodular); DH and T-NR fail them only when N^(beta-1/2) resolves gamma^2.
5. Kernel-side shape statistics (Volterra norm, moment ratios, Hankel order) are kernel-blind or flow-stable, and several are not class properties (Dirichlet L-functions fail them).
6. Toeplitz, Li-type and Hankel certificates turn negative at order about gamma^2/x0 or at resolution pi/delta of the first off-line ordinate.
7. Truncated prime-side exponents read the pole at s = 1; with the pole removed zeta, twists and T-NR agree.
8. Two source premises were false for zeta itself (R_eff <= 1 for close pairs; bounded-real truncated bridge ratio), and one landmark set replays only for a miscoded kernel (imp-3849).

## Compute notes from round 1

GPU 1 was full at launch in three lanes (86 to 96 GB held by other jobs); most runs were numpy on CPU. Largest sizes reached: zeta heights 1e10 to 1e12, 1.0e8 zeros, primes to 1e13.

## Partial separations recorded in round 2 (not survivors; each fails one clause of the definition)

| observation | slug | clause it fails |
|---|---|---|
| Per-window Jensen gap with tempered multiplicative mollifiers: DH above every zeta/L(chi) gap in 5000/5000 windows at T = 1e6..1e10 (excess 0.41 to 0.55), no zeros resolved | s2-mollifier-jensen-tempered (1) | not about zeros: T-NR with c = 0 and 1.5 (all zeros on the line, proved) fails, the Liouville quotient passes, E_a has the smallest excess; window mean (MV-CAP) |
| Joint statistic J = E1 + E2 + Weil negativity: 0 for zeta and Dirichlet L to support 6.8, positive for every formulable control | s2-control-census-onsets (2) | onset = first prime where coefficients differ from zeta's; no fixed support covers T-NR(q) or a flip at P; flags T-NR(c = +-1), which has no off-line zero; heat not formulable |
| Quadratic-twist family: DH x chi_d has off-line zeros in a bounded box for 12.4% of d = +-1 mod 5 and no functional equation for d = +-2 mod 5, without resolving DH's own zeros | s2-control-census-onsets (3) | for zeta it is low-height GRH of each L(s, chi_d) (verified height in the conductor aspect); constrains no zero of zeta; not formulable for heat and sign twists |
| Coefficient pinning in the Weil form: admissible c(2) - log 2 in [-5.3e-13, 5.7e-15] at 2a = ln 6; controls without a functional equation negative by 0.08 to 1.7 at 2a <= ln 6 for a reason that is not zeros | s2-weil-coefficient-rigidity (1,2), s2-semilocal-local-factor-swap (4) | DH in its own form shows the same two-sided pinning around non-multiplicative coefficients and is positive to its zero-resolution onset 2a = 3.4 to 3.5; box width = smallest eigenvalue of zeta's form (low zeros) |
| Mixed pairs (control coefficients on zeta's zeros) in the prime-phase form factor fail from the first prime | s2-prime-force-pencil (4) | Landau's formula fixes each prime's coefficient separately; own-list failure of DH and HEAT is a weighted count of missing on-line zeros |
| Leak outside the sieve algebra decays like c/N for zeta and stays at 0.90 to 1.00 for DH and random twists (N to 1e10) | s2-alias-sieve-sign-image (4) | detects the pole at s = 1; comparison L-functions fail and zeta(s+a)zeta(s-a) passes |
| Function-field census (9.28e9 polynomials): every fake is rejected at delay (2g-1) log q | s2-function-field-selberg-sandbox (1) | the rejecting statistic is the full Toeplitz matrix T_2g = location of all 2g zeros; delay-g statistics are passed by 8.29e6 fakes |

## Patterns at which separation stopped in round 2 (for the allocator)

9. Weil / Suzuki / Gram forms with a control's own coefficients: the onset of negativity is at support about (1/2) log(N gamma_1 / 2 pi) of the lowest off-line zero or pole (factor 0.81 to 1.18), or at dimension about 2 N_on(gamma_off) + O(1), or at order 3.7 N_below + 4. DH is positive below 2a = 3.4 to 3.5 in every variant (moment subfamilies, cell matrices, pole-free, full). Support, dimension and precision exchange for height.
10. Coefficient-rigidity statistics (pinning, cancellation depth, first-difference detectors) identify the coefficient vector prime by prime given the gamma factor; they hold for DH around its own coefficients and cannot see T-NR(q) or a flip at P below log q, log P.
11. Statistics that depend on |F(1/2+it)| only (Vasyunin / Nyman-Beurling Gram entries, cotangent sums, kappa, lam_1) are invariant under a Blaschke swap that moves a zero off the line; proved, size-independent.
12. Semilocal operators with swapped local factors: the swapped multiplier is unimodular, so norm, trace-side sign and absence of modulus-1 eigenvalues hold for every control; the cusp law is |alpha_p| = 1 per prime.
13. Positivity/pole statistics (sign image, alias leak, budget contracts) separate "non-negative coefficients with a pole at 1" from the rest: Dirichlet L-functions fail and zeta(s+a)zeta(s-a) passes. Dirichlet L and E_a are the two controls that decide this class at once.
14. Derivative-zero, transport, Poisson and Littlewood statistics are zero detectors with lead 0 (within one offset delta or one Poisson width of the off-line ordinate).
15. Mollified window statistics read whether the coefficients admit a tempered multiplicative inverse; RH-true T-NR (c <= 2) fails them and the Liouville quotient passes.
16. Function field and Selberg sandboxes: in the settings where the answer is known, the only finite statistic that rejects every fake is the one that locates all zeros; Weil-form onset for exceptional Selberg characters is 4.64 + 1.80 log(1/kappa).
17. Four more source premises were false for zeta itself at scale: mean-field pencil interval (-0.56, 1.22); positive floor of the signed-force margin (rho = 0 from T = 1.9e4..3.7e6 for N = 2..32); sign of d rho_A / d sigma on the line; pole-subtracted damped Gram positivity. Check the premise on zeta at the second size before running controls.

## By-products of round 2 (unrefereed)

- s2-semilocal-local-factor-swap (3): proof that no modulus-1 eigenfunction exists for any finite S and any local factor used (gives C = 0 on {inf, 2, 3}; engine node `no-modulus-1-rigid-profile` is listed open). No referee pass.
- s2-vasyunin-cotangent-controls: Blaschke-swap invariance of every Gram-only statistic (pattern 11).
- s2-mollifier-jensen-tempered (3): source value 0.915230 at N = 850000, t = 0.13 carries a float64 phase error of 1.5e-4 (0.915083 with 80-bit phases).
- s2-prime-force-pencil (2): certified T_0(N) at which the on-line signed-force LP becomes infeasible for zeta, N = 2..32.

## Compute notes from round 2

Server load average was 150 to 200 in several lanes (0.7 to 1.6 cores delivered to 8-core units); three lanes moved part of the plan to local runs under memcap. GPU 1 had no free memory in one lane and was not used in the others. Largest sizes reached: zeta heights to 1.89e16 (packets), 1e12 (strip grids), 1e8 zeros, primes to 1e10, 9.28e9 function-field polynomials, length spectrum to 4.0e10. Not reached: signed-force N = 512, 1024 beyond T = 4.99e6; Weil support T = 6; DH above 1e7 in packet tests.

## Partial separations recorded in round 3 (not survivors; each fails one clause of the definition)

| observation | slug | clause it fails |
|---|---|---|
| Prime-side Loewner (boundary Pick) matrix W, closed form with no truncation error: zeta n_-(W) = 0 certified in Arb in 11 window/cutoff pairs; DH certified n_- >= 1 on [12, 25.1] at X = 1e5, a lead of up to 60 in height before its first off-line zero at 85.70 | s3-prime-side-zero-statistics (3) | the lead is the reach of analytic continuation from the window: a pair planted in zeta is detected at the same reach; needs X > T/2pi and 50 to 180 digits (costlier than verifying the height); DH is positive at X <= 1e4; no step uses the Euler product; twists fail by the functional equation only |
| Ghost index from a distant box: DH off-line zero at 85.70 seen from abs(Im w) <= 10 | s3-lacunary-pick-ghost-index (3) | only at n = 149 nodes with pivot 2^-1164: n equals the number of zeros within 1.5 to 1.8 times the distance (zero count) |
| Bridge pencil at 400 digits: DH shows exactly 2 negative eigenvalues for window tops 1.7 to 15.7 below its zero | s3-shear-bridge-gram-forms (4) | about 3.9 digits per unit of height; none on [1, 60]; the Euler-product control E_b fails the same way |
| Zero-sampled mean square of the divisor-cosine sum: zeta 6.7e-16 at X = 1e10, DH constant 0.021, with no zero resolved | s3-truncated-euler-strip (3) | tests a(mn) = a(m)a(n) only: T-NR (zeros at Re 0.904) passes exactly as zeta |
| Projective macrocell budget: DH and T-NR exceed it in 100 % of samples at every height | s3-dbn-barrier-mollified-triangle (3) | coefficient property (a(4) != a(2)^2); sign and unimodular twists equal zeta; zeta itself exceeds the budget below x = 1.13e12 |
| Weil direction e^{-iHu} sinh(delta u) at N = 1e8, 4e9 heights in [3e12, 1e14]: zeta and L(chi) 0 exceedances, sign and unimodular twists 411 to 825 | s3-torus-short-prime-sum-extremes (1) | N = 1e8 is the support that resolves an off-line pair at that height; at N <= 1.18e6 no twist exceeds; DEL and heat do not fail |
| Forced-flow response equals the Landau sum: zeta matches -Lambda(n)/sqrt(n) for n <= 1e4 to rms 8.7e-6 over 1.0e8 zeros | s3-dyson-burgers-zero-flow (3) | DH below its first off-line zero is not separated (rms 0.077 against 0.060 for L(chi)); separation from T = 300 is the missing off-line pairs |

## Patterns at which separation stopped in round 3 (for the allocator)

18. Zero-flow statistics on a zero list (trap ratio Theta, C_ren, Stieltjes discrepancy at the reading strip, Poisson floor kappa) are closest-pair or counting statistics with no primes: failing window size follows sample size; controls fail only by Turing's count or by a pole at an off-line zero. kappa = 2 and kappa(x) > 0 are identities for every real list.
19. Zero-channel statistics (heat velocity, exit/collision ratio, transverse exponent, vortex boxes, walled cells) are local Hadamard sums: one event per off-line pair within 0.15 mean spacings to 10 spacings, lead 0; T-NR satisfies every certificate that takes a real zero list as premise.
20. De Bruijn-Newman barrier margins (mollified triangle, tail contraction, derivative caps) are functions of abs a(n), N, t, y: exactly twist-invariant (proved); DH and L(chi) pass at smaller t and N than zeta; zeta has negative margin where H_t has no zeros (N < 637,495).
21. Kernel-shape conditions on Phi (concavity, reduced kernels, sign ladders, overflow shares, skew-Toeplitz ladders, Hankel covers) are flow-stable and order kernels by conductor; DH and heat pass, Dirichlet L-functions with signed kernels fail. Three more are kernel-blind as coded (no Phi in the object).
22. Pick / Loewner / Gram / lacunary certificates, on any node geometry and from either side (zeros or primes): the first negative pivot needs node count proportional to the number of zeros out to the off-line height and 4 to 22 times pi gamma/(4 ln 2) bits. Sparse (lacunary, near-Muntz) nodes reduce the reach. A lead before the off-line height exists (up to 60 for DH) and is the same for a planted pair in zeta.
23. Truncated Euler products, radix layers and Fejer prime resultants to primes 1e11 to 1e13 are the explicit formula with a named kernel: THIN, DEL, E_a and T-NR(q = 1000003) pass RH-equivalent statements at every size; detection at distance D needs P >= (D^2 log P)^(1/d).
24. Torus and extreme-value statistics at 1e9 to 1e10 heights: tails and finite-window gaps equal the Haar flow for true primes, sign twists and perturbed primes below the detection support.
25. Six more source premises were false or empty for zeta: Theta <= 1/4 on every window; C_ren band; J_1 window form; rho < 1 bound; reduction factor 185/1114 (stopping artefact); heat stability radius (10^-3400 at height 1e4). Two sources replay only for a miscoded kernel (imp-3347; kernel as typed in the bridge-mass sources).

## By-products of round 3 (unrefereed)

- s3-theta-kernel-shape-conditions: heat control tau = -0.05 has D < 0 on the real axis at x = 1501.66, 2109.8, 2658.3, 2691.2, 2831.4; the s1-kernel-shear-norms table lists no deficit below height 5000. That entry should be re-examined before the control is used as "passing" below 5000.
- s3-prime-side-zero-statistics (2): K(T) = 1 + (1.35 +- 0.05)/L^2 at seven heights (node value about 1.06 not reproduced; 1.0022 at 1e12).
- s3-dbn-barrier-mollified-triangle (1): proof that the mollified triangle margin is invariant under completely multiplicative unimodular twists; t*(N) follows log N = 1.77/t + 2.45.
- s3-torus-short-prime-sum-extremes (3): Lemma T (sup abs S bound for any non-decreasing counting function) and Lemma S (line count drifts by -2 at each off-line height).
- s3-shear-bridge-gram-forms (2): pairing of the skew-Toeplitz spectrum from real skew-symmetry alone; ladder constant C = pi^2 abs g''(theta0) / (M (N+1)^2).

## Compute notes from round 3

Server load was 110 to 190 on 48 cores (about 0.75 to 1 core delivered per unit); GPU 1 held 94 of 98 GB in one lane and refused a dense N = 12800 solve in another. Four lanes moved stages to the Mac under the 8 GB cap; one lane reports six local runs of 20 to 31 minutes (over the 20-minute rule) and one reports about one minute with two sets of units running after a lost stop command. All lanes report their units stopped. Largest sizes reached: primes to 1e13 (346,065,536,839 primes), 1.0e8 zeros, heights to 1e14, 1e10 sampled heights, Gram order 16,384 at 8,719 bits, 21,200-bit Pick sections. Not reached: 1e9 zeros (generation stopped at 34 to 37 %), zero lists at 1e13, DH and heat full sets above height 2000, Loewner test for DH at X = 1e6, T = 1e8 boundary FFT, 2e4 near-Muntz nodes.

## Partial separations recorded in round 4 (not survivors; each fails one clause of the definition)

| observation | slug | clause it fails |
|---|---|---|
| Truncated Route I pencil: with S = {primes up to p} the crossing sits at log(next prime) + offset (ln 3 + 0.033, ln 5 + 0.0068, ln 7 + 0.0032); DH restricted to prime powers crosses at ln 6 + 0.081, with no zero resolved | s4-route-i-toeplitz-symbol-family (1) | reads one coefficient (c_DH(6) != 0); DH's full own form is positive to 2a = 2.6; T-NR restricted to S = {2} passes; not an all-primes statistic |
| Lacunary box on {4^k}: every control lies outside zeta's box from n = 12, with no zero resolved | s4-native-span-pick-weil-real-nodes (2) | L(chi_-4) and L(chi_5) lie outside as well (gamma-factor/pole mismatch); heat tau = -0.5 lies inside; non-Euler vectors pass |
| Inverse-spectral line spectrum of the on-line zero list: zeta and L(chi) show lines at prime powers only, DH shows lines at 6, 14, 21, 26 | s4-cmv-li-krein-string-reach (4) | detects the support of Lambda (no Euler product), not zero positions; T-NR output is identical to zeta's; heat keeps the prime-power pattern |
| Fejer prime-delay form to P = 1e9 at 36,864 heights: zeta and L(chi_-4) positive everywhere; sign twist, unimodular twist and Liouville fail in 30 % of points | s4-bridge-shift-ratio-prime-echo (1) | twists fail only for P >= t^0.6; T-NR(q = 1000003), with off-line zeros at every height, passes at every size; the form is one Weil test function |
| Sextic row count: an added non-multiplicative weight gives the independent-class exponent 0.41 at every U against 0.38 falling to 0.24 for the true columns | s4-floor-exponent-moebius-cubic-rows (3) | reads multiplicativity of the columns; hash sign, Liouville and THIN columns give the same exponent; DH, heat, E_a, T-NR not formulable; no stable positive omega |
| Mertens sum to 1e12: zeta exponent 0.483 +- 0.019, DH 0.84 | s4-floor-exponent-moebius-cubic-rows (2) | unimodular and random sign twists pass; DH stays at 38 to 70 % of the envelope of its 84 tabulated off-line pairs |
| Gabor-Weil inertia at bandwidth 1.25: DH negative index 584 = its number of off-line pairs in the window | s4-gabor-weil-inertia-proportion (1) | a count of resolved pairs; DH windows 3 away from any off-line zero pass in 40 of 40; zeta(s+a)zeta(s-a) with a = 0.02 passes at every bandwidth |

## Patterns at which separation stopped in round 4 (for the allocator)

26. Any compression, sector, Schur complement, gain ratio or weakened comparison of the Weil / Suzuki form is bounded by the form itself (Rayleigh-Ritz, inertia additivity, orthogonal sector sum; all proved): its onset is never earlier than the full-form onset. DH: 3.42 to 3.65 in every variant against 3.43 to 3.56 for the full form; single directions are later (log 19.57 for the screw response Psi).
27. Order-indexed certificates from Taylor or moment data (CMV / Levinson, Li-Herglotz, S-fraction of the Krein string, Schur defects, jets at one point, positive-real ladder) fail at index 3.4 to 3.7 times the number of on-line zeros below the first off-line zero (DH 148 to 152, heat tau = -0.5 at 123 to 125), on every node geometry; planted pairs give exponent 1 + 1/log(gamma/2pi) > 1. Euler-truncated input turns indefinite at index about 0.25 a log P, before the DH index.
28. Family averages (twists by all characters of a modulus) are averages of the member forms: a negative family form forces a negative member at the same support, and the family turns negative later than its first member in 36 of 36 pairs.
29. Truncated or semilocal Route I statistics read the first omitted coefficient of -F'/F, the modulus of one Satake parameter, or the zero-counting function (floor slope proportional to e^{2a}/q); the comparison L-functions follow the same rule with different constants, so criteria calibrated on zeta's constants fail them.
30. Route M (cotangent / Vasyunin) statistics at all b <= 1e6 are Gram-only or live on Re s = 1: DH and Dirichlet L-functions give positive limits of the same form with different constants (pattern 11 confirmed at scale).
31. Zero-list statistics (GUE moments through order 4, CGDL pair sums, number variance, inverse-spectral potential) depend on abs(c(p))^2 or on the on-line list: twists and T-NR are not separated; DH and heat depart through missing zeros or a list-wide mean.
32. Sign statistics of packet, shell, alias and envelope sums follow the pole at s = 1 with non-negative coefficients: Dirichlet L-functions fail with the controls and zeta(s+a)zeta(s-a) passes with zeta (pattern 13 confirmed to 2.95e10 primes); two of the statistics do not depend on the object.
33. Mertens-type sums: unimodular and random sign twists pass the square-root bound; DH fails only within the explicit-formula envelope of its known pairs; the Riesz weight exp(-pi gamma/4) hides the DH zero up to x near 1e178.
34. Further source premises false, empty or not reproduced for zeta: drift of the one-prime crossing to ln 3 (cut-off artefact; value ln 3 + 0.033); the repository Li-Weil matrix M_N (PSD by construction); natural-A five-shell sign; Airy envelope sign condition (neither necessary nor sufficient); sharp-cutoff prime-delay domination (negative at up to 44 % of heights); crude concentration margin (zeta negative from 2a = 1.1, before DH); the T-NR criterion of the flat-window test (impossible, proved).

## By-products of round 4 (unrefereed)

- s4-weil-sector-split-pole-schur: the odd-sector pole term is -2 (int g sinh(x/2))^2; run_weil.py of s2-weil-coefficient-rigidity adds it with a plus sign on odd blocks, so its full odd-sector values for objects with a pole should not be quoted. arb_mat.solve/inv on the dense pole-free block loses about three times the digits of the condition number.
- s4-native-span-pick-weil-real-nodes: sign-normalisation defect in the copied s3 lib.schur_real (wrong sign when c_k < 0) fixed in the s4 copy; s3 tables use c > 0 and were not re-run.
- s4-route-m-cotangent-first-moment: kappa(b) > 0.69 for every b >= 47 and S(b) < 0 for every b >= 4 (Theorem 1(ii) of b-route-m-first-moment plus direct float64 sums; not ball arithmetic).
- s4-bridge-shift-ratio-prime-echo: Re k(u) >= 0 for Re u <= 0, k(u) = (e^u - 1 - u)/u^2 (proof in RESULT.md); disk lemma for B_a < 0.
- s4-suzuki-screw-reserve-credits: proof that sign and unimodular twists raise Psi; Rayleigh-Ritz statement for H_{h,m}.
- s4-route-i-toeplitz-symbol-family: closed si-sum evaluation of the semilocal remainder replacing the 2^26 FFT grid; averaging lemma for family forms.
- s4-floor-exponent-moebius-cubic-rows (4): polar term c_m X^(5/6)/log X in the cubic Gauss prime sums (saving X^-0.525 after removal, norm 1e7, one permutation seed).

## Compute notes from round 4

Server load was 120 to 165 on 48 threads; one lane measured about one tenth of the Mac's throughput. GPU 1 was at 100 % from another job in one lane and unused there. Largest sizes reached: 37,607,992,088 prime-power events to 1e12, prime powers to 1e16 (reserve sum), 2.95e10 primes in window tests, 1.06e8 zeros to 1e12, M(x) to 1e12, all b <= 1e6 (3.04e11 coprime pairs), Pick n = 2000 at 44,000 bits, Weil cell matrices m = 16,384, exact shell sums to N = 1e15. Not reached: kappa to b = 2e6; Gabor matrix at T = 2e5 in one piece (320 GB dense); 1e5-zero moment windows; M(x) at 1e13; 2000 modes at 300 digits; CMV N = 3200 and primes to 1e7; inverse-spectral 1e4 ordinates; heat ghost at 2000 bits; cubic prime sums to 1e10. Most signs outside the Arb-labelled items are float64 or midpoint multiprecision.

Rule deviations reported by lanes: (a) s4-suzuki-screw-reserve-credits ran one 1-second test directly over ssh instead of through rhrun; (b) s4-route-m-cotangent-first-moment sent SIGTERM on the Mac to four PIDs (1104, 43195, 58052, 74770) selected by a ps/grep pattern "s4-route", which also matches s4-route-i-toeplitz-symbol-family; local commands of that lane may have been interrupted (its RESULT.md reports complete tables; not re-verified here); nothing on the server was affected. All lanes report their server units stopped.

## Partial separations recorded in round 5 (not survivors; each fails one clause of the definition)

| observation | slug | clause it fails |
|---|---|---|
| Detection constant c = 2a*/log(gamma/2pi) below 0.45 for planted quadruples (0.27 to 0.41 at gamma = 1e9, 1e12, depth b >= 0.3) | s5-route-i-dual-certificate-detection-law (4) | holds only for deep zeros (crossover sinh(2ab)/b - 2a = log(gamma/2pi)); b = 0.01 gives c = 1.05 to 1.17, DH 0.81, E_b 1.00 to 1.57; zeta's own positivity at that support has margin about 10^(-6100) and needs about 22000 zeros resolved |
| T3 ratio r > 1 for controls with a < b below 0.5 gamma_off (DH order 113, heat order 94, E_a order 7, T-NR order 4 to 6) | s5-klein-torus-shift-bridge-charts (3) | analytic continuation: relative pivot 1e-167 (DH), digits grow linearly with distance to the off-line zero (3.9 per unit height); no primes enter |
| Sign of the prime-side mass at Y = 0.165: 0 negative of 1.34e8 samples for zeta, L(chi_-4), L(chi_5) at 1e9, 1e12, 1e15; sign, unimodular, Liouville twists negative at 3.6e-4 to 3.9e-4 | s5-burgers-shock-cusp-stieltjes-strip (4) | classical Re xi'/xi > 0 criterion; T-NR and E_a pass right of their zeros; DH and heat fail only near pairs with b > delta; twists fail through a gamma term they do not have; the 1e15 fractions have no zero list behind them |
| Sign law T(b) < 0 for squarefree b: controls separate at b <= 7 | s5-route-m-divisor-sign-second-moment (1) | coefficient statement at s = 1: L(chi_-4), L(chi_5) fail with DH, while T-NR, zeta(s+a)zeta(s-a) and Liouville pass |
| Prime-tuple (Hardy-Littlewood) correlations: zeta error exponent -0.44 to X = 1e11; DH shows no power saving to 1e8, twists have no main term | s5-pair-correlation-positivity-prime-side (3) | coefficient size, not zeros: Liouville twist and T-NR pass by proof |
| Fejer floor inequality: DH fails at n = 3 and t = 0.1 without reference to zeros | s5-growth-class-fejer-sympow-right-edge (4) | evaluated right of 1; T-NR q = 1000003, E_a, Liouville and the unimodular twist pass |
| Hankel sign ladder of the autocorrelation moments: sign-flipped kernel fails at order 7, unimodular twist at order 19 | s5-volterra-shear-phi-kernel-norms (4) | DH, heat tau = -0.5 and -2, E_b and T-NR pass to order 320 with zeta |

## Patterns at which separation stopped in round 5 (for the allocator)

35. Kernel-norm and shear statistics of Phi (Volterra-Hankel block, shear angle, Perron locus, moment Hankel ladder) are functions of the measure Phi^2 dt or of the leading theta term: they order objects by conductor and parity, are linear through tau = 0 under heat, and no control with a functional equation fails (pattern 5 confirmed at Nystrom n = 16384, DEG 60, Hankel order 320).
36. Signed-certificate / seam-pencil / every-octave statistics on node sets (COAL, DEFL, TILT, EV-OCT, sech Gram lambda_min) are theorems for any rate set or functions of node density: an arithmetic-free smooth node set reproduces zeta's values within 0.02; the object enters through the support or through coefficient positivity (pole at 1).
37. The Route I dual / Krein / positive-extension certificates are all bounded by lambda_min of the Weil form on L^2(-a, a) (weak duality): DH is positive and within a factor 85 of L(chi_5) up to 2a = 3.42, negative at 3.43, once T* = 2 pi e e^{2a}/5 has passed 85.70. The detection constant is the crossover sinh(2ab)/b - 2a = log(gamma/2pi), a statement about depth, not a universal c.
38. Local windowed forms (local Nyman-Beurling distance, Gaussian Weil functionals, strip Pick kernel, pointwise Nyman-Beurling profile) separate a control only in windows that contain its off-line zero, at width x depth about 0.4 to 0.7; away from those windows DH equals L(chi_5).
39. Heat-flow and gap statistics of the on-line list (landing counts, collision constants, gap reserves, discriminant ladder, min-gap exponents, cusp and fold quantities) are theorems for real lists or count missing zeros; T-NR has zeta's list; small displacements (Lambda = 0.002) are not seen at t >= 0.01.
40. Route M divisor and second-moment statistics to b = 1e6 (3.04e11 pairs) and b = 1e9 squarefree are coefficient statements at s = 1 or Gram-only: comparison L-functions fail them and T-NR, zeta(s+a)zeta(s-a), Liouville pass (pattern 30 confirmed).
41. Further source premises false for zeta: Volterra norm <= 1 on [1e-3, 60] (positive only for a <= 31.6214); quarter ceiling abs(E1(b)) <= b/4 (ball-arithmetic counterexample, log10 b = 17.8 million); min-gap law N^(-1/2) (zeta has N^(-1/3)); shock window (2.2214, 3.3322), rho -> 2/3 and R_A <= C/(L N^(3/2)) (model-density facts); p_req = 4.37426 inside the strip; log-convexity and seam vanishing of E_k; 'sup above 1' criterion of the Nyman-Beurling profile (met by zeta).
42. The symmetric-power shift test at s = 1 is passed by random Sato-Tate angles and failed by an automorphic CM form: it reads low moments of the angle distribution, not automorphy.

## By-products of round 5 (unrefereed)

- s5-route-m-divisor-sign-second-moment (1): proof of T(b) < 0 for every squarefree b; exact formula E1(b) = mu(b) b [P(ln A - L/12) + rho]; ball-arithmetic certificate that abs(E1(b)) > b/4 at b = product of the 2,493,025 primes in [1429, 41043647], hence sup abs(E1)/b is infinite and the uniform O(b) of imp-97224 is false; true for omega(b) <= 121. Minimality of the counterexample not proved.
- s5-route-m-divisor-sign-second-moment (2): Q(b) < s0 phi(b) for every b <= 1e6, s0 = 2.9193030; envelope sup = log 2pi - gamma.
- s5-volterra-shear-phi-kernel-norms (1): zeta's Volterra block is positive only for a <= a* = 31.621366469 (bracket 31.6213483..31.6213840); unitary equivalence to an operator built from Phi^2 dt.
- s5-seam-pencil-exponential-span-depth (1): TILT-DET majorant is below 1 only for d > sum Re 1/(nu_i + conj nu_j) (proved).
- s5-sech-gram-local-nyman-distance (2, 3): closed-form inverse G^{-1} = PGP of the sech Gram (scaled Cauchy matrix); the sech-averaged Weil functional is positive for every zero configuration in the open strip.
- s5-route-i-dual-certificate-detection-law (4): lambda_min(T-NR_q, 2a) = lambda_min(zeta, 2a) + 2 log q for every 2a <= log q (proved); crossover law for 2a*.
- s5-heat-landing-collision-scaling (1): measured lower bounds Lambda(DH) >= 0.230607 (pairs below 5e4 only), T-NR q = 3: 0.313491, E_0.1: 0.019973, E_0.3: 0.177843.
- s5-pair-correlation-positivity-prime-side (4): the node value -0.3953 for the minimum-gap slope is ladder-estimator scatter; block estimate -0.318..-0.339.

## Compute notes from round 5

Largest sizes reached: all primes to 1e12 (37,607,912,018) and to 1e13 on one prime side; 1.06e8 zeta zeros; all b <= 1e6 (303,962,552,392 pairs) and squarefree b <= 1e9; 30,396,383 discriminants to 1e8; Nystrom n = 16384 and Weil space dimension 32769 on GPU 1; Hankel order 320 at 12000 bits; Pick n = 300 at 4000 bits; ball arithmetic at log10 b = 17.8 million. Not reached: Hankel order 640 (projected four hours); Route I zeta pole-free at L = 2..3 (about 7000 bits, 13000 modes) and its Lehmann-Goerisch lower bracket; b to 2e6; sieve to 1e13 for the Gaussian functionals (stopped at 26%); Klein torus L = 1e5; Pick n = 2000 at 40,000 bits; every-octave certificate to height 16384. GPU 1 was shared at 99% load in one lane and had 17 GB free in another; T-NR q = 1000003 failed twice with device out-of-memory in the Burgers lane (closed form used). DH and heat off-line zero tables exist only below height 2000; DH prime side reaches 1e8. No lane reported a rule deviation; all lanes report their server units stopped. 14 GB of prime data remains on the server in ~/rh-push/s5-burgers-shock-cusp-stieltjes-strip/prim.

## Partial separations recorded in round 6 (not survivors; each fails one clause of the definition)

| observation | slug | clause it fails |
|---|---|---|
| DH on-line list: close-triple floor 0.062 at N = 1e5 (below zeta's 0.115 at 1e8) at a triple 30 and 46 mean spacings from its nearest off-line zeros | s6-field-channel-omitted-zero-kernel (3) | no primes in the statistic; onset only from 8.2e4 on-line zeros, about 1900 times the index of DH's first off-line zero; T-NR has zeta's list and passes; zeta's floor falls with sample size |
| DH on-line Palm density: small-gap exponent 1.97 (deficit 1.62) in windows farther than 10 spacings from every off-line pair | s6-bridge-error-ladder-known-lambda (4) | holds for DH only; heat lists pass, T-NR's on-line list is zeta's; zeros only |
| DH mollified mean square grows with mollifier length (3.3 to 30 in windows without missing zeros) through unbounded inverse coefficients; same cause keeps DH's large-value exponent at 0.96-0.97 | s6-moebius-lp-first-moment-reciprocity (4), s6-line-polynomials-local-law-density-detector (1) | mean value (MV-CAP) and a coefficient statement; T-NR, Liouville, random-sign and random-phase twists equal zeta |
| First input of the 7/8 chain false for DH at n = 4 ((mu a)*a = delta, defect -1.0807) and for the hash sign twist from x = 10 (duality in the target variable), both below DH's first off-line zero | s6-sextic-rows-zero-free-input-audit (3) | single-index coefficient relations that restate what the control is; unimodular twist passes every input; heat not formulable |
| Regular-representation matrix: DH and E_a differ from zeta from N = 1250 through coefficient correlations | s6-euler-shape-identification-pole-lattice (3) | DH's lambda_min is larger than zeta's; sign and unimodular twists have zeta's spectrum exactly; T-NR has zeta's matrix for N < q |
| Semilocal prolate gap grows 2.69e-5 -> 4.80e-2 over k = 1..8 places for zeta | s6-semilocal-prolate-weil-symbol-windows (1) | T-NR is identical to zeta to 1.1e-15; chi_5 and chi_-4 do not grow (the growth reads conductor 1), so the positive comparisons fail |
| Translation / Hankel minor sign patterns of the kernel: zeta one-signed in bulk, far and near-confluent cells (10,152,000 minors, 0 undecided) | s6-orbit-kernel-commutator-kyp-frozen-rungs (1b) | chi_-4 breaks every such cell at order 3 except one, where E_a and heat pass and T-NR fails equally with zeros on and off the line |
| T-NR q = 101 turns negative at t = 0.04 where zeta and the twists are positive, with its off-line zeros below the test line | s6-line-polynomials-local-law-density-detector (3) | size of one coefficient a(101) = 23.1; T-NR q = 1000003 and twists beyond 13 are identical to zeta |

## Patterns at which separation stopped in round 6 (for the allocator)

43. Field-channel / omitted-zero-kernel / displacement statistics (K_max, eps' quarantine bracket, close-triple floor, isolation ratio rho) are theorems for any real configuration or 1/r^2-weighted counts of zeros missing from the table: DH and heat fail at the first table whose top passes an off-line pair (lead 0: N = 45 against 43 for DH). Source premises false for zeta: bound 2.85 outside its ten anchors (maximum 74), rho <= 0.72 at N < 3000.
44. Winding, Rouche-chart and barrier certificates with a reference function (finite Euler product or ladder) hold from the height where the effective abscissa (1+y)/2 + (t/4) log(x/4 pi) reaches about 1, and then hold equally for T-NR (1.10 off-line zeros per box at t = 0), DH with its two Euler products, and the sign and unimodular twists. At t = 0 the certificate is never complete for zeta. x0_F(t) is the landing of the control's own pairs.
45. Flow-grade, landing-time, bridge-error and Jensen/heat-operator statistics are functions of the zero list: Lambda/kappa falls like 1/(Y log T) for every object including zeta with a planted pair; abs(Lambda - T_N) is 0 once the list holds the Lambda-setting pair and is heat-flow invariant; Jensen polynomials with shift n >= 1 pass for every control, DH at n = 0 fails at degree 20786 (cone bound 19291). The Lean heat/Burgers identities quantify over arbitrary polynomials (target-blind).
46. Semilocal prolate and Sonine statistics read the local factors at the primes of S and the conductor: T-NR is identical to zeta, every unitary local parameter |alpha| < sqrt 2 passes the corrected Sonine test (the source's negative controls paired inconsistent terms), and L(chi) does not behave like zeta. The Weil-symbol sigma_2 premise is false for zeta from P = 2 (floor -3066). Integer-node Hodge-index inertia: DH fails at node 120..296, after its Weil onset e^3.43 = 31; T-NR passes for M < q.
47. Euler-shape identification residuals and their Jacobians cancel the base exactly (m(s) - m(1-s), g_p(s) - g_p(1-s)): every object with a functional equation gives the same number. Lax-Phillips / scattering positivity is a statement on Re(2s) > 1 and the pole at 1: DH, T-NR and the unimodular twist pass to order 400.
48. Legendre-Riesz LP, Route M first-moment and Cauchy-Schwarz constants, and Gram reciprocity are coefficient-prefix or abs(F)-on-the-line statements: the LP is pinned to psi_k^F for every object once signs are supplied, T-NR is identical below q, nothing grows faster than log (patterns 30, 40 confirmed).
49. Sextic/cubic row correlations at N(c) <= 1e7 do not distinguish zeta from DH, twists or random rows (slopes 0.50..1.06, saving 0.30..0.44 for all); the theta-dual identity carries no target factor; the conditional-Lambda budget statistic is zero-resolved in its sign (DH at 85.45..85.95) and reads coefficient size in its budget (sign twist passes).
50. Kernel-condition statistics (orbit-pair kernel inertia, commutator diagonal split, KYP realisation, frozen rungs) are theorems for every object, functions of Phi^2 du or node density (arithmetic-free twin node sets reproduce them), or need realisation order about 1.2 x the zero count of the window / one node per zero (counting form of Platt-Trudgian).
51. Line-polynomial large-value counts, number variance and two-channel lower bounds read |a(n)| (or |c(n)|^2) only, or are lemmas for arbitrary real coefficients (Polymath15 Lemma 5.1): sign, Liouville and random-phase twists equal zeta within 0.002; zero-side departures count missing zeros.
52. Further source premises false for zeta: R(1/2, T) exponent 0 (measured 0.88, 0.81); E_N floor/turnover landmarks at 9.22e5 and 3.28e9 (properties of the surrogate formula; zeta's 4 t_c has local exponents -0.41..-1.85); cubic tail 1.769529 at {inf,2,3} (measured 4.2-4.3); (ZR) as written in the Lean source (false at 36,000 nodes to height 4.27e7); KYP realisation with the stated sampling (17-24 of 50 poles on the wrong side).

## By-products of round 6 (unrefereed)

- s6-orbit-kernel-commutator-kyp-frozen-rungs (1a): proof that the orbit-pair matrix has inertia (N-1, 0, 1) for every N >= 2 and every object; (2) proof that the diagonal channel is a positive-definite function built from Phi^2 du alone; the source figure -4.8e-6 is not reproducible (unrecorded scale factor).
- s6-semilocal-prolate-weil-symbol-windows (3): the source's negative Sonine controls (-1.0136, -1.2635) pair a flipped Euler term with zeta's remainder or use a non-unitary kernel; with the consistent remainder every real alpha in [-1, 1.05] is positive.
- s6-flow-grade-kappa-landing-heatop (1): measured Lambda(DH) >= 0.230607362 from the flow of all 8138 pairs below 1e5 (pair at height 240.40); (2) DH's first Jensen failure at d = 20786, n = 0.
- s6-heat-winding-rouche-reference-charts (4): x0_F(t) brackets 4 pi exp(c/t), c in 1.4..2.05, shared by DH and T-NR q = 3.
- s6-moebius-lp-first-moment-reciprocity (3): E0(b) = Lambda(b)/2 + O(1/b) in closed form; Cauchy-Schwarz loss limit s0_F/(3 kappa_F^2) = 2.0117 for zeta.
- s6-sextic-rows-zero-free-input-audit (3): model values B(delta) from 0.8750000 at delta = 0 to 0.8640936 at 1 (slope -0.0116; no certificate).
- s6-field-channel-omitted-zero-kernel (4): rate of rho > 0.72 windows falls as N^-1.75 (CUE prediction N^-5/3).

## Compute notes from round 6

Largest sizes reached: 455,062,595 prime powers below 1e10; primes to 1e9 in nine windows to 1e12; 1.06e8 zeta zeros to 1e12; 262,142 winding boxes per X for X = 1e4..1e13; 9.8e7 unit cells at T = 1e9; prolate grids to 2.56e7 points; integer-node inertia to M = 16384 in float64 and 401 certified; 10,152,000 minors at 1,536-bit balls; N(c) <= 1e7 (2,822,619 moduli). Not reached: N(c) <= 3e8 (about 43 core-days), T >= 1e15 for most objects, M = 2e4, P = 1e5 Jacobian, dense matrices beyond N = 1e4.

Server availability: three lanes report that the rhrun wrapper refused units for periods of up to 35 minutes (machine memory 39 GB available) and one that GPU 1 had no free memory; those lanes ran the affected tests on the Mac under memcap. One server extension ran at 1.7 to 4 of 7 cores under load above 100 and was stopped. Two jobs were killed by their own 6 GB caps and not relaunched. No rule deviations reported; all lanes report their units stopped.
