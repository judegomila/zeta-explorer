/**
 * @module imp-3933-eps-field-robust-bootstrap
 *
 * imp-3933 (proof, RH-FREE, deterministic): eps'-FIELD-ROBUST plateau-domination
 * bootstrap — a finite, N-uniform, deterministic collision-time TRANSFER MODULUS
 * in the VECTOR-FIELD-ERROR channel, certified on every H_raw plateau of
 * N in [1e4, 1e6]. This is the C_Lip breach-point assault (ch-wall-frontier /
 * econn-metric verdicts) rerouted: the W_1-channel C_Lip stays PROVABLY divergent
 * (all three impossibility proofs untouched), but the model-to-true-flow transfer
 * that the finite-N chain actually needs NEVER required a measure-space modulus.
 *
 * THE LEMMA (real analysis; no RH, no GUE, no pair correlation, no Gronwall)
 * --------------------------------------------------------------------------
 * Setting: x_1(0) < ... < x_N(0) the first N zero ordinates (Odlyzko table),
 * evolving on the ordered domain under ANY perturbed backward-Dyson flow
 *     dx_k/dt = F_k(x) + e_k(t),   F_k(x) = -2 sum_{j != k} 1/(x_k - x_j),
 * where e is measurable in t, bounded on compacts of the ordered domain, and
 * satisfies the LOCAL-DIFFERENCE (field-Lipschitz) bound along the solution
 *     (*)   |e_{l+1}(t) - e_l(t)|  <=  eps' * g_l(t)     for every adjacent gap l.
 * (This is the shape of a smooth omitted-field error e_k = E(x_k, t) with
 * |dE/dx| <= eps' — e.g. the window-truncation + mirror-zero tail of the true
 * xi heat-flow zero dynamics.) t_c = first window-gap collapse; H = min gap at
 * t = 0, attained at gap a; gaps g_l = x_{l+1} - x_l.
 *
 * Exact gap identity (as imp-3725, every term of the sum positive):
 *   d(g_l^2)/dt = -8 + 4 g_l^2 sum_{j not in {l,l+1}} 1/((x_j-x_l)(x_j-x_{l+1}))
 *                    + 2 g_l (e_{l+1} - e_l),
 * and by (*) the perturbation term lies in [-2 eps' g_l^2, +2 eps' g_l^2].
 *
 * (LOWER) d(g_l^2)/dt >= -8 - 2 eps' g_l^2. The comparison ODE
 * u' = -8 - 2 eps' u, u(0) = g_l(0)^2 has the EXACT solution
 *     u(t) = g_l(0)^2 e^{-2 eps' t} - (4/eps')(1 - e^{-2 eps' t}),
 * and the standard differential inequality gives g_l(t)^2 >= u(t) while u > 0
 * (at any touch point the rates satisfy d(g^2)/dt >= -8 - 2 eps' g^2 = u').
 * u hits zero at t0(g0) = ln(1 + eps' g0^2/4) / (2 eps'), STRICTLY INCREASING
 * in g0, so no gap can collapse before the record gap's time:
 *     t_c >= tLo(eps') = ln(1 + eps' H^2/4) / (2 eps')    [-> H^2/8 as eps'->0].
 *
 * (UPPER, retardation bootstrap) Fix thetaBar = 0.99, horizon T = H^2/(8 thetaBar).
 * The same comparison solution frozen at T gives per-gap floors
 *     s_l(T,eps')^2 = max( g_l(0)^2 e^{-2 eps' T} - (4/eps')(1 - e^{-2 eps' T}), 0 ),
 * valid for all t <= min(t_c, T); the pair-to-particle distances then obey
 * x_j - pair >= D_j(T,eps') = path-sum of s_l, and both distance factors of the
 * j-term are >= D_j. Define Psi(T,eps') = 4 H^2 sum_j 1/D_j(T,eps')^2. While
 * t < min(t_c, T) and g_a <= H (maintained by strict negativity below):
 *     d(g_a^2)/dt <= -8 + Psi(T,eps') + 2 eps' H^2 = -8 theta(eps'),
 *     theta(eps') = 1 - (Psi(T,eps') + 2 eps' H^2)/8.
 * If theta(eps') >= thetaBar (self-consistency H^2/(8 theta) <= T), the record
 * gap reaches zero no later than
 *     t_c <= tHi(eps') = H^2 / (8 theta(eps')).
 *
 * CONSEQUENCE (the transfer modulus). Every quantity above is an INITIAL-DATA
 * functional of the zero table. ANY TWO flows in the class (*) — e.g. the pure
 * finite-N Dyson model (eps' = 0) and the true xi-zero backward heat flow with
 * a certified field-error Lipschitz constant eps'_true <= eps' — start from the
 * SAME initial data and therefore have first-collision times inside the SAME
 * interval [tLo(eps'), tHi(eps')]. Hence
 *     |t_c^{true} - t_c^{model}|  <=  W(eps') = tHi(eps') - tLo(eps'),
 * with dW/deps' ~ 3 H^4 / 64 — the deterministic, N-uniform field-channel
 * "C_Lip". No Gronwall flow-Jacobian, no W_1 modulus, no basin DYNAMICS lemma,
 * and no GUE/PCC input anywhere: the multi-body isolation content enters ONLY
 * through Psi(T, eps'), a finite computation on the actual table.
 *
 * CERTIFIED NUMBERS (scripts/imp-3933-eps-field-robust-bootstrap-compute.mjs)
 * ---------------------------------------------------------------------------
 * All 10 H_raw plateaus of [1e4, 1e6] certify at thetaBar = 0.99 for every
 * eps' in the grid {0, 0.25, 1, 4, 10, 20}:
 *   - eps' = 0 reproduces the imp-3725 enclosures exactly (cross-pinned below);
 *   - max certifiable eps'Max ranges 22.9 (plateau 1) .. 1216.6 (plateau 9);
 *   - the field-channel modulus slope C_field = W(1) - W(0) is
 *     9.50e-8 (plateau 0) monotonically DOWN to 4.96e-11 (plateau 9), matching
 *     the analytic 3 H^4/64 to < 0.5% — N-uniform and vanishing with height;
 *   - at eps' = 1 the full transfer width W(1) <= 5.17e-7 on every plateau —
 *     ~1.8e5x tighter than the C_H-route E_coll placeholder 0.0913 at N*=1e4.
 *
 * WHY THIS DOES NOT CONTRADICT THE THREE C_Lip IMPOSSIBILITY PROOFS
 * ------------------------------------------------------------------
 * All three (Holder-1/2 cusp lower bound; linear-N W_1 dilution; refuted
 * surrogates — ch-lip-three-proofs-table-2026-06-30) concern the map
 * INITIAL MEASURE -> t_c in a measure metric: they perturb the configuration.
 * Here the configuration is FIXED (both flows share the exact table) and the
 * perturbation lives in the vector field. The cusp family cannot be smuggled
 * in (initial data cannot move); W_1 never appears (no dilution); and the
 * W_1-ball pathology is real but irrelevant: a W_1-ball of the Koksma-Hlawka
 * radius log(gamma)/N carries a displacement budget N*W_1 ~ 83 at N* = 1e4,
 * so sup over that ball of |Delta t_c| is genuinely O(0.03-0.1) — the Holder
 * bound was near-sharp THERE. The model-to-true transfer never lived in that
 * ball: it is a field discrepancy at shared initial data, where the modulus
 * is ~3H^4/64 ~ 1e-7. The metric-invariant multi-body isolation wall (D_rest,
 * econn verdict) survives only as the finite computation Psi(table) — a
 * MEASUREMENT at the actual data, not an open theorem, on [1e4, 1e6].
 *
 * ANSWERS TO THE BASIN-CONDITIONAL QUESTIONS (the imp-3006 / C_Theta program)
 * ---------------------------------------------------------------------------
 * (1) "Can the basin-conditional C_Theta be made rigorous ON the basin?" —
 *     MOOT in this channel: C_Theta (the W_1-sensitivity of the trapped
 *     environment level Theta_eff, imp-2662's residual sub-gap) was only
 *     needed because the endpoint route perturbed the MEASURE. The bootstrap
 *     replaces trajectory-Theta sensitivity by the initial-data functional
 *     Psi(T, eps') plus the exact record-pair term 2 eps' H^2. In the
 *     W_1-channel C_Theta stays exactly as the verdicts left it (bounded and
 *     vanishing on-basin, divergent off-basin, dTheta/dW_1 ~ 1/g0).
 * (2) "Is basin-membership / isolation-persistence for the ACTUAL zero
 *     configuration finite-deterministic, or irreducibly GUE/PCC?" —
 *     FINITE-DETERMINISTIC at every N in [1e4, 1e6]: membership is the
 *     bootstrap self-consistency theta(eps') >= thetaBar, a certified table
 *     computation (all 10 plateaus, done); persistence needs NO separate
 *     dynamical sign-law closure (no R2-T multi-body constant, no c_glob) —
 *     it is INTERNAL to the frozen-gap comparison argument. GUE/PCC is
 *     irreducible ONLY for the all-N asymptotic (N -> infinity) uniformity
 *     that an abstract N-uniform C_Lip constant would demand — which the
 *     finite-N* chain never needed. That is precisely where the RH-hard
 *     verdicts and this deterministic certificate coexist without conflict.
 *
 * HONEST SCOPE — WHAT REMAINS OPEN (named; NO false QED)
 * -------------------------------------------------------
 *  - sub-gap imp-3933-sub-eps-certificate: a rigorous DETERMINISTIC bound
 *    eps'_true for the true xi backward-heat-flow zero dynamics vs the
 *    window-Dyson field along the horizon [0, T]: mirror-zero pairing, RvM
 *    tail of above-window zeros, far-zero displacement control over the tiny
 *    horizon (T <= 1.8e-4), and spectator realness/conjugate-pair handling.
 *    Estimated eps'_true = O(1e-3) near the record pair (vs eps'Max >= 22.9,
 *    ~1e4x headroom) but rising to O(10) for gaps at the window top edge from
 *    just-outside zeros — covered by the uniform eps' = 20 certificate only
 *    marginally there. The per-gap refinement (eps'_l in (*), verbatim same
 *    proof, only the record-pair term needs eps'_a) removes the edge
 *    sensitivity entirely and is the recommended closure route. ESTIMATES,
 *    not theorems, until that module lands.
 *  - sub-gap imp-3933-sub-bracket-rearchitecture: restate the E(N) chain so
 *    the model-to-true transfer routes through this field channel, replacing
 *    the C_H * W_1^{1/2} leg of E_coll. The remaining legs E_trunc, E_flow
 *    keep their ansatz constants (C_T = C_F = 1, undischarged), so E(N) < 0.2
 *    remains an ESTIMATE even with this transfer certified.
 *  - The W_1-channel C_Lip verdicts (RH-HARD-CONFIRMED) are NOT overturned,
 *    weakened, or bypassed IN THAT CHANNEL; this module claims nothing about
 *    an N-uniform C_Lip constant over all configurations.
 *  - NO new Lambda bound is claimed. Platt-Trudgian Lambda <= 0.2 REMAINS the
 *    rigorous SOTA. NO QED.
 *
 * @see imp-3725-fmb-plateau-domination-lemma (the eps' = 0 parent; rows cross-pinned)
 * @see ch-wall-frontier-verdict-2026-06-26 / econn-metric-rearchitecture-verdict-2026-06-30
 * @see imp-2662-clip-theta-endpoint-route (the C_Theta residual this channel dissolves)
 * @see sg1c-cglo-lower-bound-2026-07-02 (the isolation sign-law asset; not needed here)
 * @see scripts/imp-3933-eps-field-robust-bootstrap-compute.mjs (generator)
 */

// Baked from scripts/imp-3933-eps-field-robust-bootstrap-compute.mjs
// (esbuild bundle + node, 2026-07-03). DO NOT hand-edit; regenerate via the script.
const THETA_BAR = 0.99;
const EPS_GRID = Object.freeze([0, 0.25, 1, 4, 10, 20]);

export const EPS_FIELD_ROWS = Object.freeze([
  { plateauIndex: 0, startN: 10000, endN: 18859, H: 0.0376985, a: 6708, epsMax: 23.114, saturatedScanCap: false, cFieldSlope: 9.502858e-8, grid: [{ eps: 0, psi: 0.0141836457, theta: 0.9982270443, tLo: 0.000177647103, tHi: 0.000177962623, width: 3.1551985e-7 }, { eps: 0.25, psi: 0.0141849193, theta: 0.9981380615, tLo: 0.000177639214, tHi: 0.000177978488, width: 3.39274149e-7 }, { eps: 1, psi: 0.0141887406, theta: 0.9978711132, tLo: 0.000177615552, tHi: 0.000178026101, width: 4.10548433e-7 }, { eps: 4, psi: 0.0142040362, theta: 0.9968033187, tLo: 0.000177520989, tHi: 0.000178216806, width: 6.95816839e-7 }, { eps: 10, psi: 0.0142346769, theta: 0.9946677233, tLo: 0.000177332264, tHi: 0.000178599445, width: 0.00000126718107 }, { eps: 20, psi: 0.0142858917, theta: 0.9911083794, tLo: 0.000177018908, tHi: 0.000179240845, width: 0.00000222193729 }] },
  { plateauIndex: 1, startN: 18860, endN: 44555, H: 0.03530732, a: 18858, epsMax: 22.9066, saturatedScanCap: false, cFieldSlope: 7.327278e-8, grid: [{ eps: 0, psi: 0.0227243894, theta: 0.9971594513, tLo: 0.000155825865, tHi: 0.000156269756, width: 4.43891849e-7 }, { eps: 0.25, psi: 0.0227261796, theta: 0.9970813146, tLo: 0.000155819794, tHi: 0.000156282003, width: 4.62208105e-7 }, { eps: 1, psi: 0.022731551, theta: 0.9968469044, tLo: 0.000155801588, tHi: 0.000156318752, width: 5.17164627e-7 }, { eps: 4, psi: 0.0227530493, theta: 0.9959092619, tLo: 0.000155728818, tHi: 0.000156465926, width: 7.37107277e-7 }, { eps: 10, psi: 0.0227961071, theta: 0.9940339693, tLo: 0.000155583551, tHi: 0.000156761106, width: 0.00000117755525 }, { eps: 20, psi: 0.0228680513, theta: 0.990908459, tLo: 0.000155342239, tHi: 0.00015725556, width: 0.00000191332077 }] },
  { plateauIndex: 2, startN: 44556, endN: 73997, H: 0.02953763, a: 44554, epsMax: 39.0467, saturatedScanCap: false, cFieldSlope: 3.579063e-8, grid: [{ eps: 0, psi: 0.0117640232, theta: 0.9985294971, tLo: 0.000109058933, tHi: 0.000109219541, width: 1.60607652e-7 }, { eps: 0.25, psi: 0.0117646716, theta: 0.9984748866, tLo: 0.00010905596, tHi: 0.000109225515, width: 1.69554652e-7 }, { eps: 1, psi: 0.011766617, theta: 0.998311055, tLo: 0.000109047041, tHi: 0.00010924344, width: 1.96398282e-7 }, { eps: 4, psi: 0.0117744019, theta: 0.9976557283, tLo: 0.000109011386, tHi: 0.000109315198, width: 3.03812275e-7 }, { eps: 10, psi: 0.0117899871, theta: 0.9963450729, tLo: 0.000108940168, tHi: 0.000109458998, width: 5.18830496e-7 }, { eps: 20, psi: 0.0118160084, theta: 0.9941606416, tLo: 0.000108821746, tHi: 0.000109699508, width: 8.77762215e-7 }] },
  { plateauIndex: 3, startN: 73998, endN: 82552, H: 0.02583928, a: 73996, epsMax: 50.7067, saturatedScanCap: false, cFieldSlope: 2.09616e-8, grid: [{ eps: 0, psi: 0.0121847457, theta: 0.9984769068, tLo: 0.0000834585489, tHi: 0.0000835858579, width: 1.27309053e-7 }, { eps: 0.25, psi: 0.0121852596, theta: 0.9984351133, tLo: 0.0000834568076, tHi: 0.0000835893568, width: 1.32549159e-7 }, { eps: 1, psi: 0.0121868016, theta: 0.9983097327, tLo: 0.0000834515843, tHi: 0.000083599855, width: 1.48270656e-7 }, { eps: 4, psi: 0.0121929715, theta: 0.9978082102, tLo: 0.0000834307, tHi: 0.0000836418743, width: 2.11174332e-7 }, { eps: 10, psi: 0.0122053207, theta: 0.9968051639, tLo: 0.000083388973, tHi: 0.0000837260399, width: 3.37066854e-7 }, { eps: 20, psi: 0.0122259305, theta: 0.9951334167, tLo: 0.0000833195516, tHi: 0.0000838666931, width: 5.47141572e-7 }] },
  { plateauIndex: 4, startN: 82553, endN: 87761, H: 0.0208495, a: 82551, epsMax: 81.2253, saturatedScanCap: false, cFieldSlope: 8.878897e-9, grid: [{ eps: 0, psi: 0.00929912307, theta: 0.9988376096, tLo: 0.0000543377115, tHi: 0.0000544009466, width: 6.32351372e-8 }, { eps: 0.25, psi: 0.00929937838, theta: 0.9988104088, tLo: 0.0000543369734, tHi: 0.0000544024281, width: 6.54547806e-8 }, { eps: 1, psi: 0.00930014433, theta: 0.9987288065, tLo: 0.0000543347591, tHi: 0.0000544068732, width: 7.21140346e-8 }, { eps: 4, psi: 0.00930320878, theta: 0.9984023972, tLo: 0.0000543259046, tHi: 0.0000544246605, width: 9.87559154e-8 }, { eps: 10, psi: 0.0093093407, theta: 0.9977495782, tLo: 0.000054308207, tHi: 0.0000544602701, width: 1.52063075e-7 }, { eps: 20, psi: 0.00931956956, theta: 0.9966615453, tLo: 0.0000542787452, tHi: 0.0000545197231, width: 2.40977934e-7 }] },
  { plateauIndex: 5, startN: 87762, endN: 95248, H: 0.01948463, a: 87760, epsMax: 95.2084, saturatedScanCap: false, cFieldSlope: 6.769568e-9, grid: [{ eps: 0, psi: 0.00763804635, theta: 0.9990452442, tLo: 0.0000474563411, tHi: 0.0000475016936, width: 4.53525171e-8 }, { eps: 0.25, psi: 0.0076382295, theta: 0.9990214931, tLo: 0.0000474557781, tHi: 0.0000475028229, width: 4.70448552e-8 }, { eps: 1, psi: 0.007638779, theta: 0.9989502399, tLo: 0.0000474540891, tHi: 0.0000475062112, width: 5.21220848e-8 }, { eps: 4, psi: 0.00764097739, theta: 0.9986652271, tLo: 0.0000474473349, tHi: 0.0000475197692, width: 7.24342381e-8 }, { eps: 10, psi: 0.00764537606, theta: 0.9980952012, tLo: 0.0000474338343, tHi: 0.0000475469084, width: 1.13074098e-7 }, { eps: 20, psi: 0.00765271282, theta: 0.9971451573, tLo: 0.0000474113559, tHi: 0.0000475922093, width: 1.8085344e-7 }] },
  { plateauIndex: 6, startN: 95249, endN: 354769, H: 0.01470148, a: 95247, epsMax: 175.5817, saturatedScanCap: false, cFieldSlope: 2.191989e-9, grid: [{ eps: 0, psi: 0.00406271708, theta: 0.9994921604, tLo: 0.0000270166746, tHi: 0.0000270304017, width: 1.37271093e-8 }, { eps: 0.25, psi: 0.00406277253, theta: 0.9994786451, tLo: 0.0000270164921, tHi: 0.0000270307672, width: 1.42750966e-8 }, { eps: 1, psi: 0.00406293888, theta: 0.9994380993, tLo: 0.0000270159447, tHi: 0.0000270318638, width: 1.59190978e-8 }, { eps: 4, psi: 0.00406360434, theta: 0.9992759161, tLo: 0.0000270137554, tHi: 0.0000270362511, width: 2.24956974e-8 }, { eps: 10, psi: 0.00406493558, theta: 0.9989515496, tLo: 0.0000270093782, tHi: 0.0000270450299, width: 3.56517524e-8 }, { eps: 20, psi: 0.0040671553, theta: 0.9984109386, tLo: 0.0000270020871, tHi: 0.0000270596741, width: 5.7586989e-8 }] },
  { plateauIndex: 7, startN: 354770, endN: 415587, H: 0.01305322, a: 354768, epsMax: 218.7361, saturatedScanCap: false, cFieldSlope: 1.362729e-9, grid: [{ eps: 0, psi: 0.00540949011, theta: 0.9993238137, tLo: 0.0000212983093, tHi: 0.0000213127206, width: 1.44113689e-8 }, { eps: 0.25, psi: 0.00540954831, theta: 0.9993131573, tLo: 0.0000212981959, tHi: 0.0000213129479, width: 1.47520462e-8 }, { eps: 1, psi: 0.00540972292, theta: 0.999281188, tLo: 0.0000212978557, tHi: 0.0000213136298, width: 1.57740976e-8 }, { eps: 4, psi: 0.00541042142, theta: 0.9991533108, tLo: 0.000021296495, tHi: 0.0000213163576, width: 1.98625945e-8 }, { eps: 10, psi: 0.00541181868, theta: 0.9988975565, tLo: 0.0000212937744, tHi: 0.0000213218154, width: 2.80409892e-8 }, { eps: 20, psi: 0.00541414825, theta: 0.9984712991, tLo: 0.000021289242, tHi: 0.0000213309179, width: 4.16758035e-8 }] },
  { plateauIndex: 8, startN: 415588, endN: 420891, H: 0.00863639, a: 415586, epsMax: 522.9774, saturatedScanCap: false, cFieldSlope: 2.609083e-10, grid: [{ eps: 0, psi: 0.00196568241, theta: 0.9997542897, tLo: 0.00000932340184, tHi: 0.00000932569326, width: 2.2914189e-9 }, { eps: 0.25, psi: 0.00196569167, theta: 0.9997496268, tLo: 0.00000932338011, tHi: 0.00000932573675, width: 2.35664556e-9 }, { eps: 1, psi: 0.00196571944, theta: 0.9997356383, tLo: 0.00000932331491, tHi: 0.00000932586724, width: 2.55232717e-9 }, { eps: 4, psi: 0.00196583053, theta: 0.999679684, tLo: 0.00000932305415, tHi: 0.00000932638923, width: 3.33507798e-9 }, { eps: 10, psi: 0.00196605272, theta: 0.9995677754, tLo: 0.00000932253269, tHi: 0.00000932743339, width: 4.90069659e-9 }, { eps: 20, psi: 0.0019664231, theta: 0.999381261, tLo: 0.00000932166376, tHi: 0.00000932917416, width: 7.51040785e-9 }] },
  { plateauIndex: 9, startN: 420892, endN: 1000000, H: 0.00570371, a: 420890, epsMax: 1216.6091, saturatedScanCap: false, cFieldSlope: 4.962059e-11, grid: [{ eps: 0, psi: 0.000833562277, theta: 0.9998958047, tLo: 0.00000406653136, tHi: 0.00000406695512, width: 4.23757546e-10 }, { eps: 0.25, psi: 0.000833563989, theta: 0.9998937712, tLo: 0.00000406652723, tHi: 0.00000406696339, width: 4.36162659e-10 }, { eps: 1, psi: 0.000833569125, theta: 0.9998876708, tLo: 0.00000406651482, tHi: 0.0000040669882, width: 4.73378132e-10 }, { eps: 4, psi: 0.00083358967, theta: 0.999863269, tLo: 0.00000406646522, tHi: 0.00000406708746, width: 6.22242045e-10 }, { eps: 10, psi: 0.000833630761, theta: 0.9998144655, tLo: 0.000004066366, tHi: 0.00000406728598, width: 9.19979566e-10 }, { eps: 20, psi: 0.000833699251, theta: 0.9997331263, tLo: 0.00000406620066, tHi: 0.0000040676169, width: 1.4162375e-9 }] },
]);

// imp-3725 eps'=0 reference triples (theta, tcLo, tcHi) per plateau — quoted
// verbatim from imp-3725-fmb-plateau-domination-lemma.js ROWS for the cross-pin.
const REF_3725 = Object.freeze([
  { theta: 0.9982270443, tcLo: 1.77647103e-4, tcHi: 1.77962623e-4 },
  { theta: 0.9971594513, tcLo: 1.55825865e-4, tcHi: 1.56269756e-4 },
  { theta: 0.9985294971, tcLo: 1.09058933e-4, tcHi: 1.09219541e-4 },
  { theta: 0.9984769068, tcLo: 8.34585489e-5, tcHi: 8.35858579e-5 },
  { theta: 0.9988376096, tcLo: 5.43377115e-5, tcHi: 5.44009466e-5 },
  { theta: 0.9990452442, tcLo: 4.74563411e-5, tcHi: 4.75016936e-5 },
  { theta: 0.9994921604, tcLo: 2.70166746e-5, tcHi: 2.70304017e-5 },
  { theta: 0.9993238137, tcLo: 2.12983093e-5, tcHi: 2.13127206e-5 },
  { theta: 0.9997542897, tcLo: 9.32340184e-6, tcHi: 9.32569326e-6 },
  { theta: 0.9998958047, tcLo: 4.06653136e-6, tcHi: 4.06695512e-6 },
]);

// C_H-route E_coll placeholder at N* = 1e4 (polymath15-lemma52-shock-holder,
// C_H = 1 ansatz: sqrt(C_KH log gamma / N) ~ 0.0913) — the leg this transfer
// modulus replaces in the field channel.
const E_COLL_CH_ROUTE_N1E4 = 0.0913;

const MAX_SLOPE = Math.max(...EPS_FIELD_ROWS.map((r) => r.cFieldSlope));
const MIN_EPS_MAX = Math.min(...EPS_FIELD_ROWS.map((r) => r.epsMax));
const MAX_WIDTH_AT_EPS1 = Math.max(
  ...EPS_FIELD_ROWS.map((r) => r.grid.find((g) => g.eps === 1).width),
);

export const EPS_FIELD_ROBUST_BOOTSTRAP = {
  ticket: 'imp-3933',
  date: '2026-07-03',
  verdict:
    'PARTIAL-POSITIVE (rigorous lemma + certified table; named residuals). The C_Lip wall is BYPASSED in the '
    + 'vector-field-error channel: for any two flows dx/dt = F_Dyson + e with |e_{l+1}-e_l| <= eps\' g_l sharing '
    + 'the zero-table initial data, |Delta t_c| <= W(eps\') = tHi(eps\') - tLo(eps\') with dW/deps\' ~ 3H^4/64 — '
    + 'deterministic, N-uniform, RH-free, no Gronwall, no W_1, no GUE/PCC. The W_1-channel impossibility proofs '
    + 'stand untouched; they concern a different perturbation channel (initial measure, not field).',
  lemma: {
    perturbationClass: '|e_{l+1}(t) - e_l(t)| <= eps\' * g_l(t) along the solution (field-Lipschitz local differences)',
    lower: 't_c >= tLo(eps\') = ln(1 + eps\' H^2/4)/(2 eps\')  [exact comparison ODE u\' = -8 - 2 eps\' u]',
    upper: 't_c <= tHi(eps\') = H^2/(8 theta(eps\')),  theta(eps\') = 1 - (Psi(T,eps\') + 2 eps\' H^2)/8, T = H^2/(8 thetaBar)',
    frozenGaps: 's_l(T,eps\')^2 = max(g_l(0)^2 e^{-2 eps\' T} - (4/eps\')(1 - e^{-2 eps\' T}), 0)',
    allInitialData: true,
    noGronwall: true,
    noW1: true,
    noGuePcc: true,
  },
  thetaBar: THETA_BAR,
  epsGrid: EPS_GRID,
  minEpsMax: MIN_EPS_MAX,                 // 22.9066 (plateau 1): certifiable field-error headroom floor
  maxCFieldSlope: MAX_SLOPE,              // 9.503e-8 (plateau 0): the field-channel "C_Lip", ~3H^4/64
  maxTransferWidthAtEps1: MAX_WIDTH_AT_EPS1, // 5.17e-7: model<->true transfer bound at unit field-Lipschitz error
  cHRouteEcollN1e4: E_COLL_CH_ROUTE_N1E4, // 0.0913: the W_1-Holder leg this replaces (C_H = 1 ansatz)
  transferAdvantageFactor: E_COLL_CH_ROUTE_N1E4 / MAX_WIDTH_AT_EPS1, // ~1.77e5
  basinAnswers: {
    cThetaOnBasin:
      'MOOT in the field channel: C_Theta (imp-2662 residual) was the W_1-sensitivity of Theta_eff; the bootstrap '
      + 'replaces it by the initial-data functional Psi(T,eps\') + the exact record-pair term 2 eps\' H^2. '
      + 'In the W_1 channel C_Theta remains exactly as the verdicts left it.',
    isolationPersistence:
      'FINITE-DETERMINISTIC at every N in [1e4,1e6]: membership = bootstrap self-consistency theta(eps\') >= thetaBar '
      + '(certified, 10 plateaus); persistence is INTERNAL to the frozen-gap comparison (no R2-T multi-body closure, '
      + 'no c_glob, no GUE). PCC is irreducible only for all-N (N -> infinity) uniformity, which the finite-N* chain never needed.',
  },
  openSubGaps: [
    {
      id: 'imp-3933-sub-eps-certificate',
      statement:
        'Certify a deterministic eps\'_true (ideally the per-gap profile eps\'_l) for the true xi backward-heat-flow '
        + 'zero dynamics vs the window-Dyson field on [0, T]: mirror-zero pairing, RvM tail of above-window zeros, '
        + 'far-zero displacement control over T <= 1.8e-4, spectator conjugate-pair handling. Estimated O(1e-3) near '
        + 'the record pair (~1e4x headroom vs epsMax >= 22.9); O(10) at the window top edge — use the per-gap variant there.',
      status: 'open',
    },
    {
      id: 'imp-3933-sub-bracket-rearchitecture',
      statement:
        'Restate the E(N) bracket so the model-to-true collision-time transfer routes through the field channel '
        + '(W(eps\'_true) <= ~5e-7), replacing the C_H * W_1^{1/2} leg of E_coll. E_trunc/E_flow constants stay '
        + 'ansatz (C_T = C_F = 1), so the finite-N estimate remains an ESTIMATE until those are discharged.',
      status: 'open',
    },
  ],
  honest:
    'Rigorous lemma + certified per-plateau table; NOT a Lambda bound. The W_1-channel C_Lip verdicts '
    + '(RH-HARD-CONFIRMED) are untouched — this module claims no N-uniform C_Lip constant over configurations. '
    + 'The true-flow eps\'-certificate and the bracket re-architecture are OPEN named sub-gaps; E_trunc/E_flow '
    + 'stay ansatz. Platt-Trudgian Lambda <= 0.2 REMAINS the rigorous SOTA. NO false QED.',
  rigorousBeat: false,
};

// ── imp-33224: eps_true certificate — exact field-difference reduction ────────
// Sub-gap imp-3933-sub-eps-certificate asks for a DETERMINISTIC field-Lipschitz
// constant eps_true for the true xi backward-heat-flow field vs the window-Dyson
// field. The crux (proved below, verified in-build) is that every out-of-window,
// mirror, or smooth-background zero y contributes to the omitted field on
// particle k the term e_k = -2/(x_k - y), whose local difference telescopes:
//     e_{l+1} - e_l = -2/(x_{l+1}-y) + 2/(x_l-y)
//                   = 2 (x_{l+1}-x_l) / ((x_l-y)(x_{l+1}-y))
//                   = 2 g_l / ((x_l-y)(x_{l+1}-y)),        g_l = x_{l+1}-x_l.
// Hence the field-Lipschitz contribution of the full omitted set is the
// CONVERGENT deterministic initial-data functional
//     eps_true(l) <= 2 * sum_{y not in window} 1/|(x_l-y)(x_{l+1}-y)|,
// the SAME 1/((x-y1)(x-y2)) kernel as Psi(T,eps) (which sums in-window j). This
// turns the module estimate into a reduction; per-channel closure stays OPEN.
//
// Far-zero tail decay: if gap l sits k mean-spacings delta below the window top,
// the m-th omitted zero above is at distance ~(k+m-1)delta from x_{l+1}, so by
// the telescoping sum_{m>=1} 1/((k+m-1)(k+m)) = 1/k,
//     eps_far(l) <= (2/delta^2) * (1/k) = 2/(delta^2 k),   delta = 2pi/log(gamma/2pi).
// At the top edge (k=1, delta~0.65) this is ~4.7 (matching the module O(10)
// window-edge estimate); it decays like 1/k into the interior (~O(1e-3) near the
// record pair), which is exactly why the per-gap eps_l variant kills the edge
// sensitivity: only O(1/delta) top gaps carry a large eps.
export const EPS_TRUE_DECOMPOSITION = Object.freeze({
  ticket: 'imp-33224',
  parent: 'imp-3933',
  subGap: 'imp-3933-sub-eps-certificate',
  date: '2026-07-03',
  verdict:
    'PARTIAL — structural reduction, NOT the full theorem: the true-vs-window field-Lipschitz constant is REDUCED '
    + 'to a convergent deterministic initial-data functional of the SAME 1/((x-y1)(x-y2)) kernel as Psi; the binding '
    + 'channel (top-edge far zeros) is identified and bounded; per-channel closure and the per-gap eps_l profile stay OPEN.',
  fieldDifferenceIdentity:
    'e_{l+1} - e_l = 2 g_l / ((x_l-y)(x_{l+1}-y)) for any omitted/mirror/background zero y with e_k = -2/(x_k-y); '
    + 'field-Lipschitz contribution = 2/|(x_l-y)(x_{l+1}-y)| (exact, verified in-build)',
  reduction:
    'eps_true(l) <= 2 * sum_{y not in window} 1/|(x_l-y)(x_{l+1}-y)| + (mirror + smooth-background + spectator terms) — '
    + 'a CONVERGENT deterministic initial-data functional, same kernel as Psi(T,eps); a reduction, not an estimate.',
  channels: [
    { id: 'far-above (RvM tail)', form: '2 sum_{y > window top} 1/((x_l-y)(x_{l+1}-y)); dominated by nearest omitted zero, decays 1/k into interior', status: 'bounded' },
    { id: 'far-below', form: '2 sum_{y < window bottom} 1/((x_l-y)(x_{l+1}-y)); symmetric telescoping tail', status: 'bounded' },
    { id: 'mirror-pairing', form: 'functional-equation mirror zeros at -gamma; contribution 2/((x_l+y)(x_{l+1}+y)) far from window, sign to be resolved', status: 'open' },
    { id: 'spectator conjugate-pair / realness', form: 'off-critical-line spectators enter as conjugate pairs; realness handling of e_k not yet certified', status: 'open' },
  ],
  bindingChannel:
    'far-above top-edge zeros: the nearest omitted zero sits ~one mean spacing delta = 2pi/log(gamma/2pi) above the '
    + 'window top, giving the O(10) spike; interior gaps see only the smoothly-varying tail (O(1e-3) near the record pair). '
    + 'This is precisely why the per-gap eps_l variant (record pair sees eps_a = O(1e-3)) removes the edge sensitivity.',
  tailBound:
    'gap l at depth k mean-spacings below the top: eps_far(l) <= (2/delta^2)(1/k) = 2/(delta^2 k), by the telescoping '
    + 'sum_{m>=1} 1/((k+m-1)(k+m)) = 1/k; ~4.7 at k=1 (delta~0.65), decaying 1/k so only O(1/delta) top gaps carry large eps.',
  openResidual:
    'FULL closure STILL needs: (i) the two-sided (above + below) tail constants summed on the ACTUAL Odlyzko ordinates '
    + 'per plateau; (ii) the mirror / functional-equation pairing sign; (iii) spectator conjugate-pair realness handling; '
    + '(iv) the per-gap eps_l certification feeding the imp-3933 bootstrap in place of the uniform eps. STAYS OPEN.',
  rigorousBeat: false,
});

// ── Build-time assertions ─────────────────────────────────────────────────────

const REL = (x, y) => Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y), 1e-300);

export const EPS_FIELD_ROBUST_BOOTSTRAP_ASSERTIONS = [
  {
    id: 'imp3933-eps0-reproduces-imp3725',
    description:
      'the eps\'=0 column reproduces the imp-3725 baked (theta, tcLo, tcHi) on every plateau to 1e-6 relative — '
      + 'the field-robust lemma degenerates exactly to the parent at zero field error',
    holds: () => EPS_FIELD_ROWS.every((r, i) => {
      const g0 = r.grid.find((g) => g.eps === 0);
      return REL(g0.theta, REF_3725[i].theta) < 1e-6
        && REL(g0.tLo, REF_3725[i].tcLo) < 1e-6
        && REL(g0.tHi, REF_3725[i].tcHi) < 1e-6;
    }),
  },
  {
    id: 'imp3933-tlo-closed-form-recomputed',
    description:
      'tLo(eps\') equals the closed form ln(1 + eps\' H^2/4)/(2 eps\') (H^2/8 at eps\'=0) recomputed live to 1e-6 rel, '
      + 'is strictly decreasing in eps\', and respects the second-order floor H^2/8 - eps\' H^4/63 '
      + '(H^2 recovered as 8*tLo(0) — exact by construction — to dodge the 8-decimal H rounding)',
    holds: () => EPS_FIELD_ROWS.every((r) => {
      const h2 = 8 * r.grid[0].tLo;
      let prev = Infinity;
      return r.grid.every((g) => {
        const expect = g.eps === 0 ? h2 / 8 : Math.log1p((g.eps * h2) / 4) / (2 * g.eps);
        const ok = REL(g.tLo, expect) < 1e-6
          && (g.eps === 0 || g.tLo < prev)
          && g.tLo >= h2 / 8 - (g.eps * h2 * h2) / 63 - 1e-12;
        prev = g.tLo;
        return ok;
      });
    }),
  },
  {
    id: 'imp3933-theta-identity-monotone-certified',
    description:
      'theta = 1 - (Psi + 2 eps\' H^2)/8 recomputed from baked Psi to 1e-6, strictly decreasing in eps\', '
      + 'every grid row certified (theta >= thetaBar = 0.99), tHi = H^2/(8 theta) to 1e-6, width strictly increasing',
    holds: () => EPS_FIELD_ROWS.every((r) => {
      const h2 = 8 * r.grid[0].tLo;
      let prevTheta = Infinity;
      let prevWidth = -Infinity;
      return r.grid.every((g) => {
        const thetaExpect = 1 - (g.psi + 2 * g.eps * h2) / 8;
        const ok = REL(g.theta, thetaExpect) < 1e-6
          && g.theta >= THETA_BAR
          && g.theta < prevTheta
          && REL(g.tHi, h2 / (8 * g.theta)) < 1e-6
          && REL(g.width, g.tHi - g.tLo) < 1e-4
          && g.width > prevWidth;
        prevTheta = g.theta;
        prevWidth = g.width;
        return ok;
      });
    }),
  },
  {
    id: 'imp3933-epsmax-floor-20',
    description:
      'the certifiable field-error headroom epsMax(thetaBar=0.99) is >= 20 on EVERY plateau (floor 22.9 at plateau 1, '
      + 'rising to 1216.6 at plateau 9) — the whole eps\' grid sits inside the certified region',
    holds: () => EPS_FIELD_ROWS.every((r) => r.epsMax >= 20 && !r.saturatedScanCap)
      && Math.abs(MIN_EPS_MAX - 22.9066) < 1e-3
      && EPS_FIELD_ROWS[9].epsMax > 1000,
  },
  {
    id: 'imp3933-field-modulus-3H4-over-64-n-uniform',
    description:
      'the field-channel modulus slope C_field = W(1) - W(0) matches the analytic 3H^4/64 within 5% on every plateau, '
      + 'is monotone decreasing along the plateau ladder (vanishes with height), and its max is < 1e-7 — the '
      + 'deterministic N-uniform field-channel replacement for the divergent W_1-channel C_Lip',
    holds: () => EPS_FIELD_ROWS.every((r, i) => {
      const analytic = (3 * Math.pow(r.H, 4)) / 64;
      const slopeOk = REL(r.cFieldSlope, analytic) < 0.05
        && REL(r.cFieldSlope, r.grid.find((g) => g.eps === 1).width - r.grid.find((g) => g.eps === 0).width) < 1e-4;
      const monotone = i === 0 || r.cFieldSlope < EPS_FIELD_ROWS[i - 1].cFieldSlope;
      return slopeOk && monotone;
    }) && MAX_SLOPE < 1e-7,
  },
  {
    id: 'imp3933-transfer-beats-w1-holder-leg',
    description:
      'the certified model<->true transfer width at unit field-Lipschitz error (max 5.17e-7 over plateaus) is '
      + '>= 1e5x tighter than the C_H-route W_1-Holder E_coll placeholder 0.0913 at N*=1e4 that it replaces',
    holds: () => MAX_WIDTH_AT_EPS1 < 1e-6
      && EPS_FIELD_ROBUST_BOOTSTRAP.transferAdvantageFactor > 1e5,
  },
  {
    id: 'imp3933-honest-no-false-qed',
    description:
      'honesty gate: PARTIAL verdict, W_1-channel verdicts explicitly untouched, both residual sub-gaps OPEN, '
      + 'no rigorous beat claimed, PT Lambda <= 0.2 cited as SOTA',
    holds: () => /PARTIAL-POSITIVE/.test(EPS_FIELD_ROBUST_BOOTSTRAP.verdict)
      && /impossibility proofs\s+stand untouched/.test(EPS_FIELD_ROBUST_BOOTSTRAP.verdict.replace(/\s+/g, ' '))
      && EPS_FIELD_ROBUST_BOOTSTRAP.openSubGaps.every((s) => s.status === 'open')
      && EPS_FIELD_ROBUST_BOOTSTRAP.rigorousBeat === false
      && /Lambda <= 0.2 REMAINS the rigorous SOTA/.test(EPS_FIELD_ROBUST_BOOTSTRAP.honest)
      && /NO false QED/.test(EPS_FIELD_ROBUST_BOOTSTRAP.honest),
  },
  {
    id: 'imp33224-field-difference-identity-exact',
    description:
      'imp-33224: the omitted-zero field-difference identity e_{l+1}-e_l = 2 g_l/((x_l-y)(x_{l+1}-y)) reproduces the '
      + 'direct field difference -2/(x_{l+1}-y)+2/(x_l-y) to machine precision across a grid of (x_l, g_l, y) spanning '
      + 'near/far and interior/edge configurations — the exact reduction underlying the eps_true certificate',
    holds: () => {
      const cases = [[0, 1, 5], [10, 0.03, 10.9], [100, 0.5, -3], [0, 0.0377, 0.09], [54600, 0.02, 54601.3]];
      return cases.every(([xl, gl, y]) => {
        const xr = xl + gl;
        const direct = -2 / (xr - y) + 2 / (xl - y);
        const identity = 2 * gl / ((xl - y) * (xr - y));
        return Math.abs(direct - identity) < 1e-9 * (1 + Math.abs(direct));
      });
    },
  },
  {
    id: 'imp33224-tail-bound-decays-subgap-open',
    description:
      'imp-33224: the far-zero tail bound eps_far(k) <= 2/(delta^2 k) is finite/positive, strictly decreasing in the '
      + 'interior depth k (only O(1/delta) top gaps carry a large eps), ~O(few) at the top edge; and the honesty gate '
      + 'holds — reduction not theorem, sub-gap imp-3933-sub-eps-certificate STILL OPEN, no rigorous beat claimed',
    holds: () => {
      const delta = (2 * Math.PI) / Math.log(1e5 / (2 * Math.PI));
      const b = (k) => 2 / (delta * delta * k);
      const subGap = EPS_FIELD_ROBUST_BOOTSTRAP.openSubGaps.find((s) => s.id === 'imp-3933-sub-eps-certificate');
      return b(1) > b(2) && b(2) > b(10) && b(10) > 0 && b(1) < 100
        && EPS_TRUE_DECOMPOSITION.rigorousBeat === false
        && /STAYS OPEN/.test(EPS_TRUE_DECOMPOSITION.openResidual)
        && /reduction, NOT the full theorem/.test(EPS_TRUE_DECOMPOSITION.verdict)
        && subGap && subGap.status === 'open';
    },
  },
];

for (const a of EPS_FIELD_ROBUST_BOOTSTRAP_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3933 eps-field-robust-bootstrap assertion failed: ${a.id}`);
}
