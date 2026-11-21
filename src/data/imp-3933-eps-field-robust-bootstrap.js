/**
 * @module imp-3933-eps-field-robust-bootstrap
 *
 * imp-3933 (proof, RH-FREE, deterministic): eps'-FIELD-ROBUST plateau-domination
 * bootstrap — a finite, N-uniform, deterministic collision-time TRANSFER MODULUS
 * in the VECTOR-FIELD-ERROR channel, certified on every H_raw plateau of
 * N in [1e4, 1e6]. This is the C_Lip breach-point push (ch-wall-frontier /
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
 *  - NO new Lambda bound is claimed. No refereed bound is changed
 *    . NO QED.
 *
 * @see imp-3725-fmb-plateau-domination-lemma (the eps' = 0 parent; rows cross-pinned)
 * @see ch-wall-frontier-verdict-2026-06-26 / econn-metric-rearchitecture-verdict-2026-06-30
 * @see imp-2662-clip-theta-endpoint-route (the C_Theta residual this channel dissolves)
 * @see sg1c-cglo-lower-bound-2026-07-02 (the isolation sign-law asset; not needed here)
 * @see scripts/imp-3933-eps-field-robust-bootstrap-compute.mjs (generator)
 */

// Baked from scripts/imp-3933-eps-field-robust-bootstrap-compute.mjs
// (esbuild bundle + node, 2026-07-03). DO NOT hand-edit; regenerate via the script.
//
// imp-95517 (2026-09-21, re-anchor): the rows are RE-ANCHORED at the corrected
// per-plateau window sizes N' = anchorN (imp-33228 newAnchors: argmax boundary
// gap) instead of the invalid N = endN, where the next plateau's record pair
// collides before the horizon (survival ratio < 1). Only the Psi UPPER-window
// sum truncates at anchorN (the lower sum runs to 0, H and a are intrinsic and
// unchanged, so tLo is identical); Psi/theta/tHi/width/epsMax/cFieldSlope shift
// by <~1e-4 rel. Certification is UNAFFECTED (all 10 plateaus certify at
// thetaBar = 0.99, minEpsMax 22.92). Anchor-choice correction only; NO Lambda
// consequence; no refereed bound is changed; NO QED.
const THETA_BAR = 0.99;
const EPS_GRID = Object.freeze([0, 0.25, 1, 4, 10, 20]);

// Re-anchored at the corrected per-plateau window sizes N' = anchorN (imp-95517;
// imp-33228 newAnchors). endN/startN retained as the plateau range; anchorN is the
// window at which Psi is evaluated. (The old N=endN anchors are invalid: boundary collision.)
export const EPS_FIELD_ROWS = Object.freeze([
  { plateauIndex: 0, startN: 10000, endN: 18859, anchorN: 15323, H: 0.0376985, a: 6708, epsMax: 23.1141, saturatedScanCap: false, cFieldSlope: 9.502858e-8, grid: [{ eps: 0, psi: 0.0141833738, theta: 0.9982270783, tLo: 0.000177647103, tHi: 0.000177962617, width: 3.15513789e-7 }, { eps: 0.25, psi: 0.0141846473, theta: 0.9981380955, tLo: 0.000177639214, tHi: 0.000177978482, width: 3.39268086e-7 }, { eps: 1, psi: 0.0141884685, theta: 0.9978711472, tLo: 0.000177615552, tHi: 0.000178026095, width: 4.10542366e-7 }, { eps: 4, psi: 0.0142037638, theta: 0.9968033527, tLo: 0.000177520989, tHi: 0.0001782168, width: 6.95810752e-7 }, { eps: 10, psi: 0.0142344039, theta: 0.9946677574, tLo: 0.000177332264, tHi: 0.000178599439, width: 0.00000126717495 }, { eps: 20, psi: 0.0142856178, theta: 0.9911084136, tLo: 0.000177018908, tHi: 0.000179240839, width: 0.0000022219311 }] },
  { plateauIndex: 1, startN: 18860, endN: 44555, anchorN: 19187, H: 0.03530732, a: 18858, epsMax: 22.9163, saturatedScanCap: false, cFieldSlope: 7.327233e-8, grid: [{ eps: 0, psi: 0.0227003394, theta: 0.9971624576, tLo: 0.000155825865, tHi: 0.000156269285, width: 4.43420726e-7 }, { eps: 0.25, psi: 0.0227021277, theta: 0.9970843211, tLo: 0.000155819794, tHi: 0.000156281531, width: 4.61736872e-7 }, { eps: 1, psi: 0.0227074934, theta: 0.9968499116, tLo: 0.000155801588, tHi: 0.000156318281, width: 5.1669306e-7 }, { eps: 4, psi: 0.022728969, theta: 0.995912272, tLo: 0.000155728818, tHi: 0.000156465453, width: 7.36634375e-7 }, { eps: 10, psi: 0.0227719812, theta: 0.9940369851, tLo: 0.000155583551, tHi: 0.00015676063, width: 0.00000117707966 }, { eps: 20, psi: 0.0228438492, theta: 0.9909114843, tLo: 0.000155342239, tHi: 0.00015725508, width: 0.00000191284067 }] },
  { plateauIndex: 2, startN: 44556, endN: 73997, anchorN: 46589, H: 0.02953763, a: 44554, epsMax: 39.0485, saturatedScanCap: false, cFieldSlope: 3.57906e-8, grid: [{ eps: 0, psi: 0.0117609394, theta: 0.9985298826, tLo: 0.000109058933, tHi: 0.000109219499, width: 1.60565489e-7 }, { eps: 0.25, psi: 0.0117615877, theta: 0.9984752721, tLo: 0.00010905596, tHi: 0.000109225473, width: 1.69512483e-7 }, { eps: 1, psi: 0.0117635326, theta: 0.9983114406, tLo: 0.000109047041, tHi: 0.000109243397, width: 1.96356092e-7 }, { eps: 4, psi: 0.0117713154, theta: 0.9976561141, tLo: 0.000109011386, tHi: 0.000109315156, width: 3.03770001e-7 }, { eps: 10, psi: 0.0117868966, theta: 0.9963454593, tLo: 0.000108940168, tHi: 0.000109458956, width: 5.18788054e-7 }, { eps: 20, psi: 0.011812911, theta: 0.9941610288, tLo: 0.000108821746, tHi: 0.000109699465, width: 8.77719493e-7 }] },
  { plateauIndex: 3, startN: 73998, endN: 82552, anchorN: 77672, H: 0.02583928, a: 73996, epsMax: 50.7074, saturatedScanCap: false, cFieldSlope: 2.09616e-8, grid: [{ eps: 0, psi: 0.0121838651, theta: 0.9984770169, tLo: 0.0000834585489, tHi: 0.0000835858487, width: 1.27299838e-7 }, { eps: 0.25, psi: 0.012184379, theta: 0.9984352234, tLo: 0.0000834568076, tHi: 0.0000835893475, width: 1.32539943e-7 }, { eps: 1, psi: 0.0121859209, theta: 0.9983098428, tLo: 0.0000834515843, tHi: 0.0000835998458, width: 1.48261436e-7 }, { eps: 4, psi: 0.0121920903, theta: 0.9978083203, tLo: 0.0000834307, tHi: 0.0000836418651, width: 2.11165098e-7 }, { eps: 10, psi: 0.0122044386, theta: 0.9968052742, tLo: 0.000083388973, tHi: 0.0000837260306, width: 3.37057592e-7 }, { eps: 20, psi: 0.0122250469, theta: 0.9951335272, tLo: 0.0000833195516, tHi: 0.0000838666838, width: 5.47132263e-7 }] },
  { plateauIndex: 4, startN: 82553, endN: 87761, anchorN: 83454, H: 0.0208495, a: 82551, epsMax: 81.2293, saturatedScanCap: false, cFieldSlope: 8.87889e-9, grid: [{ eps: 0, psi: 0.0092956827, theta: 0.9988380397, tLo: 0.0000543377115, tHi: 0.0000544009232, width: 6.32117151e-8 }, { eps: 0.25, psi: 0.00929593791, theta: 0.9988108389, tLo: 0.0000543369734, tHi: 0.0000544024047, width: 6.54313565e-8 }, { eps: 1, psi: 0.00929670358, theta: 0.9987292366, tLo: 0.0000543347591, tHi: 0.0000544068497, width: 7.20906048e-8 }, { eps: 4, psi: 0.0092997669, theta: 0.9984028274, tLo: 0.0000543259046, tHi: 0.000054424637, width: 9.87324626e-8 }, { eps: 10, psi: 0.00930589655, theta: 0.9977500087, tLo: 0.000054308207, tHi: 0.0000544602466, width: 1.52039576e-7 }, { eps: 20, psi: 0.00931612163, theta: 0.9966619763, tLo: 0.0000542787452, tHi: 0.0000545196995, width: 2.40954358e-7 }] },
  { plateauIndex: 5, startN: 87762, endN: 95248, anchorN: 87831, H: 0.01948463, a: 87760, epsMax: 95.2703, saturatedScanCap: false, cFieldSlope: 6.769488e-9, grid: [{ eps: 0, psi: 0.00759139957, theta: 0.9990510751, tLo: 0.0000474563411, tHi: 0.0000475014163, width: 4.5075279e-8 }, { eps: 0.25, psi: 0.00759158161, theta: 0.9990273241, tLo: 0.0000474557781, tHi: 0.0000475025456, width: 4.67675972e-8 }, { eps: 1, psi: 0.00759212775, theta: 0.9989560713, tLo: 0.0000474540891, tHi: 0.0000475059339, width: 5.18447673e-8 }, { eps: 4, psi: 0.00759431271, theta: 0.9986710602, tLo: 0.0000474473349, tHi: 0.0000475194916, width: 7.21566824e-8 }, { eps: 10, psi: 0.00759868452, theta: 0.9981010376, tLo: 0.0000474338343, tHi: 0.0000475466303, width: 1.12796066e-7 }, { eps: 20, psi: 0.00760597647, theta: 0.9971509993, tLo: 0.0000474113559, tHi: 0.0000475919305, width: 1.8057461e-7 }] },
  { plateauIndex: 6, startN: 95249, endN: 354769, anchorN: 185013, H: 0.01470148, a: 95247, epsMax: 175.5818, saturatedScanCap: false, cFieldSlope: 2.191989e-9, grid: [{ eps: 0, psi: 0.00406270172, theta: 0.9994921623, tLo: 0.0000270166746, tHi: 0.0000270304016, width: 1.37270574e-8 }, { eps: 0.25, psi: 0.00406275716, theta: 0.999478647, tLo: 0.0000270164921, tHi: 0.0000270307671, width: 1.42750446e-8 }, { eps: 1, psi: 0.00406292351, theta: 0.9994381012, tLo: 0.0000270159447, tHi: 0.0000270318637, width: 1.59190459e-8 }, { eps: 4, psi: 0.00406358897, theta: 0.999275918, tLo: 0.0000270137554, tHi: 0.000027036251, width: 2.24956454e-8 }, { eps: 10, psi: 0.00406492021, theta: 0.9989515515, tLo: 0.0000270093782, tHi: 0.0000270450299, width: 3.56517004e-8 }, { eps: 20, psi: 0.00406713991, theta: 0.9984109405, tLo: 0.0000270020871, tHi: 0.000027059674, width: 5.75869368e-8 }] },
  { plateauIndex: 7, startN: 354770, endN: 415587, anchorN: 393295, H: 0.01305322, a: 354768, epsMax: 218.7362, saturatedScanCap: false, cFieldSlope: 1.362729e-9, grid: [{ eps: 0, psi: 0.0054094717, theta: 0.999323816, tLo: 0.0000212983093, tHi: 0.0000213127206, width: 1.44113199e-8 }, { eps: 0.25, psi: 0.0054095299, theta: 0.9993131596, tLo: 0.0000212981959, tHi: 0.0000213129479, width: 1.47519972e-8 }, { eps: 1, psi: 0.00540970451, theta: 0.9992811903, tLo: 0.0000212978557, tHi: 0.0000213136297, width: 1.57740485e-8 }, { eps: 4, psi: 0.005410403, theta: 0.9991533132, tLo: 0.000021296495, tHi: 0.0000213163575, width: 1.98625454e-8 }, { eps: 10, psi: 0.00541180026, theta: 0.9988975588, tLo: 0.0000212937744, tHi: 0.0000213218153, width: 2.804094e-8 }, { eps: 20, psi: 0.00541412983, theta: 0.9984713014, tLo: 0.000021289242, tHi: 0.0000213309178, width: 4.16757543e-8 }] },
  { plateauIndex: 8, startN: 415588, endN: 420891, anchorN: 420290, H: 0.00863639, a: 415586, epsMax: 522.9776, saturatedScanCap: false, cFieldSlope: 2.609083e-10, grid: [{ eps: 0, psi: 0.00196566166, theta: 0.9997542923, tLo: 0.00000932340184, tHi: 0.00000932569323, width: 2.29139471e-9 }, { eps: 0.25, psi: 0.00196567092, theta: 0.9997496294, tLo: 0.00000932338011, tHi: 0.00000932573673, width: 2.35662137e-9 }, { eps: 1, psi: 0.00196569869, theta: 0.9997356409, tLo: 0.00000932331491, tHi: 0.00000932586722, width: 2.55230298e-9 }, { eps: 4, psi: 0.00196580978, theta: 0.9996796866, tLo: 0.00000932305415, tHi: 0.00000932638921, width: 3.33505378e-9 }, { eps: 10, psi: 0.00196603197, theta: 0.999567778, tLo: 0.00000932253269, tHi: 0.00000932743336, width: 4.90067238e-9 }, { eps: 20, psi: 0.00196640235, theta: 0.9993812636, tLo: 0.00000932166376, tHi: 0.00000932917414, width: 7.51038363e-9 }] },
  { plateauIndex: 9, startN: 420892, endN: 1000000, anchorN: 516200, H: 0.00570371, a: 420890, epsMax: 1216.6091, saturatedScanCap: false, cFieldSlope: 4.962059e-11, grid: [{ eps: 0, psi: 0.000833558865, theta: 0.9998958051, tLo: 0.00000406653136, tHi: 0.00000406695512, width: 4.23755811e-10 }, { eps: 0.25, psi: 0.000833560577, theta: 0.9998937717, tLo: 0.00000406652723, tHi: 0.00000406696339, width: 4.36160924e-10 }, { eps: 1, psi: 0.000833565713, theta: 0.9998876712, tLo: 0.00000406651482, tHi: 0.0000040669882, width: 4.73376397e-10 }, { eps: 4, psi: 0.000833586257, theta: 0.9998632695, tLo: 0.00000406646522, tHi: 0.00000406708746, width: 6.2224031e-10 }, { eps: 10, psi: 0.000833627349, theta: 0.999814466, tLo: 0.000004066366, tHi: 0.00000406728598, width: 9.19977831e-10 }, { eps: 20, psi: 0.000833695838, theta: 0.9997331268, tLo: 0.00000406620066, tHi: 0.0000040676169, width: 1.41623576e-9 }] },
]);

// imp-3725 eps'=0 reference triples (theta, tcLo, tcHi) per plateau — the pure
// backward-Dyson lemma re-evaluated at the SAME corrected N' anchors (imp-95517).
// The eps'=0 column of EPS_FIELD_ROWS degenerates to this exactly (cross-pin).
const REF_3725 = Object.freeze([
  { theta: 0.9982270783, tcLo: 1.77647103e-4, tcHi: 1.77962617e-4 },
  { theta: 0.9971624576, tcLo: 1.55825865e-4, tcHi: 1.56269285e-4 },
  { theta: 0.9985298826, tcLo: 1.09058933e-4, tcHi: 1.09219499e-4 },
  { theta: 0.9984770169, tcLo: 8.34585489e-5, tcHi: 8.35858487e-5 },
  { theta: 0.9988380397, tcLo: 5.43377115e-5, tcHi: 5.44009232e-5 },
  { theta: 0.9990510751, tcLo: 4.74563411e-5, tcHi: 4.75014163e-5 },
  { theta: 0.9994921623, tcLo: 2.70166746e-5, tcHi: 2.70304016e-5 },
  { theta: 0.999323816, tcLo: 2.12983093e-5, tcHi: 2.13127206e-5 },
  { theta: 0.9997542923, tcLo: 9.32340184e-6, tcHi: 9.32569323e-6 },
  { theta: 0.9998958051, tcLo: 4.06653136e-6, tcHi: 4.06695512e-6 },
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
  minEpsMax: MIN_EPS_MAX,                 // 22.9163 (plateau 1): certifiable field-error headroom floor
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
        + 'the record pair (~1e4x headroom vs epsMax >= 22.9); O(10) at the window top edge — use the per-gap variant there. '
        + '[UPDATE imp-34427: the realness/spectator channel is CLOSED RH-FREE and the mirror SIGN is moot; remaining: '
        + 'displacement control, discrete-table sums, edge no-collision check.]',
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
    + 'stay ansatz. No refereed bound is changed. NO false QED.',
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
// record pair), which is exactly why the per-gap eps_l variant eliminates the edge
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
    { id: 'mirror-pairing', form: 'functional-equation mirror zeros at -gamma; contribution 2/((x_l+y)(x_{l+1}+y)) far from window; SIGN moot (imp-34427: the lemma is two-sided), magnitude in the discrete-sum residual', status: 'sign-moot-magnitude-open' },
    { id: 'spectator conjugate-pair / realness', form: 'off-critical-line spectators enter as conjugate pairs; e_k realness + projection domination + straddle exclusion certified RH-FREE by imp-34427 (off-line tail above T_ver < 6e-12)', status: 'closed-rh-free-imp-34427' },
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
    + 'per plateau; (ii) the mirror / functional-equation pairing sign [MOOT per imp-34427 — the lemma is two-sided; '
    + 'magnitude folds into (i)]; (iii) spectator conjugate-pair realness handling [CLOSED RH-FREE by imp-34427: '
    + 'conjugate closure + projection domination + straddle exclusion, off-line tail < 6e-12]; '
    + '(iv) the per-gap eps_l certification feeding the imp-3933 bootstrap in place of the uniform eps; '
    + '(v) far-zero displacement control on [0,T] incl. the imp-34427-sub-edge-no-collision table check. STAYS OPEN.',
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
      && Math.abs(MIN_EPS_MAX - 22.9163) < 1e-3
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
      && /refereed bound is changed/i.test(EPS_FIELD_ROBUST_BOOTSTRAP.honest)
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
