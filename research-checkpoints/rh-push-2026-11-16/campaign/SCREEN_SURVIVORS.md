# Screening arm: survivors

Maintained by the screening record step. Source records: `campaign/screened.jsonl` (one line per screened combination) and `engine/outcomes/s<round>-*.json`.

SURVIVOR = zeta passes at every size reached; every control fails at a size much smaller than the height of its off-line zeros would explain, or for a reason that does not depend on resolving zeros; the statistic uses all primes together.

Status after round 4: 160 combinations screened (40 batches; 40 combinations in each of rounds 1, 2, 3, 4), 0 survivors claimed, 0 demoted. No screener in any round claimed a survivor, so no RESULT.md claim needed checking against the definition; the ten round-4 RESULT.md files each state "no survivor" (checked by reading the verdict lines of all ten). Observations closest to the definition are recorded per round below as partial separations, not survivors.

## Current survivors

| name | exact statement | evidence | slug | why not verified height | first thing an attack lane should try |
|---|---|---|---|---|---|
| (none) | | | | | |

## Demoted

None (no screener claimed a survivor in rounds 1, 2, 3 or 4).

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
