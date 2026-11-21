/**
 * @module rh-bridge-supercritical-fluid-shock-scaling-2026-09-24
 *
 * RH bridge -- supercritical-fluid / viscous-Burgers critical scaling of the zero-collision
 * shock, tested as a lever on the two open bridge gaps of the Dyson-Burgers programme:
 * the per-N bound (Route A blocked by G1-sub-extremal, dyson-burgers-shock.js) and the
 * G6_polymath15_bridge finite-N <-> H_t gap (bridge-lambda-rh.js Step B3).
 *
 * Import-light: no module imports. All measured numbers are baked literals from the offline
 * run tmp/supercritical-fluid-shock-scratch.mjs (Odlyzko zeros, src/data/zeros-to-1e6.js,
 * first 10^6 ordinates, 9-decimal precision). The flow is the repo's own normalization
 * dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j) (dysonDerivBackward, src/math/dyson-scaling-N5000.js),
 * s = -t >= 0 the backward de Bruijn time. Assertions recompute the cheap closed-form pieces
 * live and check the baked tables against each other.
 *
 * EXACT STRUCTURE (three identities, all exact, none new)
 * -------------------------------------------------------
 * (E1) de Bruijn: d/dt H_t = -d^2/dz^2 H_t, so for s = -t > 0 the potential theta(z, s) := H_{-s}(z)
 *      solves the FORWARD heat equation theta_s = theta_zz; theta(., s) = e^{s d_z^2} H_0 exactly.
 * (E2) For P(z, s) = prod_k (z - x_k(s)) with x_k obeying the attractive N-body flow above,
 *      P_s = P_zz exactly (compare both degree-(N-1) polynomials at the N points z = x_k).
 *      Equivalently the field m = P_z / P = sum_k 1/(z - x_k) obeys the VISCOUS complex Burgers
 *      equation m_s = 2 m m_z + m_zz with viscosity exactly 1 (Cole-Hopf); re-verified here to
 *      1.4e-14 relative at three off-axis points along the N = 300 flow.
 * (E3) Hadamard: H_0(z) = H_0(0) prod_k (1 - z^2 / gamma_k^2), so H_0 = c * P~_N * T_N with
 *      P~_N the degree-2N polynomial on the first N zero pairs and T_N = prod_{k > N} (1 - z^2/gamma_k^2)
 *      the tail factor. Hence the repo's finite-N backward Dyson flow is EXACTLY the heat flow of
 *      P~_N (with the mirror zeros -gamma_k), and H_{-s} is EXACTLY the heat flow of P~_N * T_N.
 *      Heat flow is linear but not multiplicative: e^{s d^2}(P~_N T_N) != (e^{s d^2} P~_N) T_N; the
 *      difference is the mean-field action of the tail on the bulk zeros (measured in Part D).
 *
 * THE FOLD LAW AND ITS RIGOROUS HALF
 * ----------------------------------
 * For an ADJACENT pair (x_i, x_{i+1}) with gap g, the flow gives exactly
 *     d(g^2)/ds = -8 + 4 g^2 S,   S = sum_{j not in pair} 1/((x_{i+1} - x_j)(x_i - x_j)) > 0,
 * since for j outside the pair both factors have the same sign while the ordering persists
 * (i.e. up to the first collision). Therefore d(g^2)/ds >= -8 for every adjacent pair, and at the
 * first collision s_c some adjacent gap vanishes:
 *     |t_c(N)| = s_c(N) >= g_min(N)^2 / 8          (RIGOROUS lower bound, elementary)
 * where g_min(N) is the smallest gap among the first N zeros. The matching upper estimate
 * s_c ~ (g^2/8)(1 + O(S g^2)) holds with the stretch term S frozen at its initial value; it is
 * NOT claimed rigorous here (it needs an a-priori neighbour-separation bound along the flow).
 * The frozen-S two-body fold time -ln(1 - S g^2/2) / (4 S) reproduces the full N-body s_c to
 * 7e-6 .. 1e-3 relative at N = 50 .. 2458 (Part A), and the colliding pair IS the initial argmin
 * pair at every N tested.
 *
 * SUPERCRITICAL SCALING (Part B)
 * ------------------------------
 * In regularized coordinates (c, q) = (pair centre, half-gap^2) the flow is smooth THROUGH the
 * collision: dq/ds = -2 + 4 q S. Subcritical (s < s_c): real gap g^2 = 4 q = 8 (s_c - s).
 * Supercritical (s > s_c): the pair is c +- i eta with eta^2 = -q, so on the real axis
 *     m(x) = 2 (x - c) / ((x - c)^2 + eta^2)
 * is a smooth Lorentzian shock of width 2 eta, and (2 eta)^2 = 8 (s - s_c): width exponent 1/2,
 * prefactor 8 (the imp-395 C_collision). Measured (N = 200, 500): width^2 = 8.016 (s - s_c)^1.0002
 * and 8.019 (s - s_c)^1.0002 over 1e-5 <= s - s_c <= 4.6e-4. The critical window |s - s_c| << 1/(4 S)
 * is 9.5x (N = 200) and 21.7x (N = 500) LONGER than the whole collision leg s_c, so the fold law is
 * not an asymptotic tail statement: it governs the entire per-N collision. Since 1/(4 S) ~ y_N^2
 * and s_c ~ g_min^2, the ratio scales as (y_N / g_min)^2, which grows with N.
 *
 * Q1 -- DOES THE SHOCK-WIDTH SCALING TIGHTEN THE PER-N ENVELOPE?
 * ---------------------------------------------------------------
 * The premise "viscous width set by the mean spacing y_N" is not what the exact fluid does: the
 * finite-N shock is a fold whose width is set by g_min(N), the extreme adjacent gap, not by y_N.
 * The fold law |t_c(N)| = g_min^2/8 (1 + 0.3% .. 7%) is a far better per-N ENVELOPE than the
 * global-density surrogate 2 pi / log^2(gamma_N / 2 pi) (surrogate / t_c = 6.7 at N = 50 rising to
 * 139 at N = 2458) -- but it is an envelope in terms of g_min(N), not a closed form in N. The
 * surrogate is exactly the fold law with g_min replaced by ~1.13 y_N (2 pi / log^2 = y_N^2 / (2 pi)
 * vs y_N^2 / 8: the two differ by 8 / 2 pi = 1.27). So the 1-point density can only ever deliver the
 * surrogate's 1 / log^2 rate; every improvement of the EXPONENT is a statement that g_min(N) / y_N -> 0,
 * i.e. a small-gaps theorem. The GUE (sine-kernel) extreme-gap law from the s^2 level repulsion
 * R_2(s) ~ (pi^2/3) s^2 gives median g_min / y_N = (9 ln 2 / (pi^2 N))^{1/3}; the data exponent of
 * g_min / y_N vs N is -0.373 over N = 50 .. 10^6 (GUE: -1/3) and the GUE-median envelope sits within
 * a factor 0.18 .. 0.44 of the measured t_c. That envelope is pair-correlation input by construction.
 *
 * Q2 -- ARGMIN BYPASS: GENUINE, OR MONTGOMERY IN DISGUISE?  (verdict: Montgomery in disguise)
 * -------------------------------------------------------------------------------------------
 * The viscous field u = 2 m propagates the FULL configuration, so the shock location is the argmin
 * pair (6/6 cases) and the shock time is the min-gap fold time -- exactly, not statistically. But
 * the PDE creates no information: s_c is a functional of the initial data whose value g_min^2/8 is
 * invisible to the field at Im z >= y_N (there m sees only the 1-point density rho) and appears only
 * at Im z <~ g_min, i.e. in the microscopic 2-point structure. Locating or timing the shock therefore
 * requires exactly the small-gap / extreme-order-statistic input that Montgomery pair correlation
 * conjectures (and that the Rodgers-Tao Lambda >= 0 proof also draws on). Two precise sharpenings:
 *   (i) Route A's bulk-confinement need is an artefact of the monotonicity approach. A per-N UPPER
 *       bound never needs the argmin LOCATION: the fold time of ANY adjacent pair with a small gap
 *       bounds s_c from above (modulo the stretch term). What it needs instead is the EXISTENCE of a
 *       gap <= c(N) y_N with c(N) -> 0 for EVERY N -- a per-N small-gaps theorem, which is the same
 *       pair-correlation wall relocated from "where is the argmin" to "how small is the min gap".
 *  (ii) The rigorous half of the fold law converts the Route-B per-N bound into a checkable
 *       number-theoretic statement (Part E): |t_c(N)| <= 0.384 sqrt(log gamma_N / N) together with
 *       |t_c(N)| >= g_min^2/8 IMPLIES g_min(N) <= sqrt(3.072) (log gamma_N / N)^{1/4} for every N,
 *       i.e. a consecutive gap of at most 0.49 y_N (N = 50) .. 0.19 y_N (N = 10^6), tending to 0 like
 *       N^{-1/4} (log)^{5/4} in mean-spacing units. The Odlyzko data satisfy this at all 14 N tested
 *       (actual g_min / y_N = 0.42 .. 0.010), but no published theorem supplies it: known small-gap
 *       results give lim-inf constants of order 0.5 mean spacing (pair-correlation / mollifier
 *       methods), not a power saving valid for every N. The 'closed' status of G6_per_N_bound via
 *       Route B therefore rests on a statement at least as strong as an unproved power-saving
 *       small-gaps theorem; this module records the implication and does not flip any status.
 *
 * Q3 -- G6 VIA COLE-HOPF: EXACT BRIDGE?  (verdict: exact identity, sharper E(N) form, same wall)
 * ----------------------------------------------------------------------------------------------
 * (E1)-(E3) make the finite-N <-> H_t comparison an identity at the potential level: both sides are
 * forward heat flows, and the truncation error is the heat flow of the tail factor acting on the
 * bulk. Its effect on the collision time is a LINEAR-RESPONSE law: an external smooth field F(x)
 * adds 2 F'(x*) g^2 to d(g^2)/ds at the colliding pair, so
 *     Delta t_c / t_c = t_c * F'(x*) + O((t_c F')^2).
 * Measured with the omitted mirror zeros -gamma_k (k <= N) and the tail +-gamma_k (N < k <= 2e5) as
 * a static field (Part D): relative shifts 2.21e-3 (N = 200), 3.49e-4 (500), 3.56e-6 (2458), each
 * matching t_c F'(x*) to 4-6 digits. The Route-B Hoelder-1/2 form E_coll = 0.384 sqrt(log gamma_N/N)
 * exceeds the measured truncation shift by 9.2e2, 1.0e4 and 5.2e6 respectively. So Cole-Hopf
 * sharpens the FORM of G6's E(N) from Hoelder-1/2 in W_1 to Lipschitz in the potential, with
 * E_tail(N) ~ t_c(N)^2 * (2/pi) log(gamma_N / 2 pi) / gamma_N -- PROVIDED the tail zeros are real.
 * That proviso is the whole content of G6: Lambda <= 0 iff H_0 is real-rooted, and an off-line
 * tail zero pair at height > T_0 with |beta - 1/2| = eta_0 is, in the fluid picture, an already
 * supercritical pair that needs forward time ~ eta_0^2 / 2 (reverse fold) to become real, forcing
 * Lambda > 0 -- invisible to any finite-N flow started from real zeros. The finite-N collision
 * time is <= 0 tautologically and Lambda >= 0 by Rodgers-Tao; "Lambda = -lim t_c(N)" is RH for the
 * tail restated. The exact bridge relocates G6 to the reality of T_N's zeros, which is what
 * Platt-Trudgian's barrier controls from the verified height (Lambda <= 0.2); no fluid identity
 * changes that threshold.
 *
 * SIDE FINDING (data hygiene)
 * ---------------------------
 * The baked PATH_C_BASELINE_FIT collision times (src/math/dyson-scaling-N5000.js; Euler, fixed dt,
 * stop at gap < 1e-4) are overshoot-contaminated at every N, not only at N = 50 as noted by imp-353:
 * ratios to the adaptive-RK4 fold-accurate values are 1.50 (N = 50: 0.1435 vs 0.0957, the latter
 * matching the imp-353 RK4 note 0.0958), 1.03, 1.08, 1.32 and 7.21 (N = 2458: 0.0086 vs 0.001192).
 * The imp-338 "one to two orders of magnitude" surrogate/observed ratios are therefore
 * underestimates; against fold-accurate t_c the surrogate is 139x loose at N = 2458.
 *
 * HONEST SCOPE
 * ------------
 * No bound on Lambda, no RH claim, NO QED. The rigorous new statements are elementary: the
 * lower bound s_c >= g_min^2/8 and the algebraic identities (E1)-(E3). Everything measured is
 * finite-N numerics on Odlyzko zeros. No refereed bound is changed.
 *
 * @see dyson-burgers-shock.js (surrogate 2 pi / log^2, G6_per_N_bound Route A/B, G1-sub-extremal)
 * @see bridge-lambda-rh.js (Route B chain, Step B3 G6_polymath15_bridge)
 * @see g6a-sub-constant-value.js (C_collision = 8, C_H = 1/8)
 * @see imp-3891-g6a-h2-continuum-inviscid-burgers-meanfield-scoping.js (exact identity m_s = 2 m m_z + m_zz)
 * @see tmp/supercritical-fluid-shock-scratch.mjs (offline generator)
 */

const TWO_PI = 2 * Math.PI;

// ── Part A: fold law vs surrogate vs N-body collision time (adaptive RK4, fold-extrapolated) ──
// gmin from the first N Odlyzko zeros; S = stretch sum at the argmin pair; tc = full N-body s_c.
export const FOLD_LAW_ROWS = Object.freeze([
  { N: 50,   gammaN: 143.111845808,  yN: 2.010137253, gmin: 0.845123634, argmin: 34,   S: 0.36964426, tc: 0.0957472914, collidingPair: 34,   surrogate: 0.6430897037, pathC_euler: 0.1435 },
  { N: 100,  gammaN: 236.524229666,  yN: 1.731776376, gmin: 0.715786716, argmin: 91,   S: 0.65017848, tc: 0.0701183039, collidingPair: 91,   surrogate: 0.4773135393, pathC_euler: 0.0723 },
  { N: 200,  gammaN: 396.381854223,  yN: 1.516029401, gmin: 0.498179464, argmin: 186,  S: 0.80603707, tc: 0.0326830480, collidingPair: 186,  surrogate: 0.3657929909, pathC_euler: 0.0352 },
  { N: 500,  gammaN: 811.184358847,  yN: 1.292672030, gmin: 0.310430705, argmin: 453,  S: 0.94187025, tc: 0.0123271238, collidingPair: 453,  surrogate: 0.2659480656, pathC_euler: 0.0163 },
  { N: 1000, gammaN: 1419.422480946, yN: 1.159231841, gmin: 0.161500788, argmin: 922,  S: 1.74394799, tc: 0.0032979855, collidingPair: 922,  surrogate: 0.2138753508, pathC_euler: null },
  { N: 2458, gammaN: 2988.634699665, yN: 1.019220811, gmin: 0.097502502, argmin: 1496, S: 1.40018189, tc: 0.0011923134, collidingPair: 1496, surrogate: 0.1653319153, pathC_euler: 0.0086 },
]);

export const foldTime = (g) => (g * g) / 8;
export const foldTimeFrozenS = (g, S) => -Math.log(1 - (S * g * g) / 2) / (4 * S);
export const gueMedianMinGapRatio = (N) => Math.cbrt((9 * Math.LN2) / (Math.PI * Math.PI * N));

// ── Part B: through-collision measurements (regularized (c, q) flow) ────────────────────────
export const SUPERCRITICAL_WIDTH_FITS = Object.freeze([
  { N: 200, pair: 186, s_c: 0.0326830480, S_at_switch: 0.80140714, prefactor: 8.0163, exponent: 1.0002, window_1_over_4S: 0.3120, window_over_sc: 9.54,
    postRatios: [1.00002, 1.00004, 1.00008, 1.00015, 1.00029, 1.00051, 1.00073], preRatios: [0.99952, 0.99966, 0.99981, 0.99995, 0.99999] },
  { N: 500, pair: 453, s_c: 0.0123271238, S_at_switch: 0.93537982, prefactor: 8.0192, exponent: 1.0002, window_1_over_4S: 0.2673, window_over_sc: 21.68,
    postRatios: [1.00002, 1.00005, 1.00009, 1.00017, 1.00035, 1.00061, 1.00086], preRatios: [0.99943, 0.99960, 0.99977, 0.99994, 0.99999] },
]);

// ── Part C: exact viscous-Burgers identity residuals along the N = 300 flow ─────────────────
export const VISCOUS_IDENTITY_RESIDUALS = Object.freeze([
  { z: '100.3+0.7i', rel: 2.039e-15 }, { z: '250.1+2i', rel: 1.047e-15 }, { z: '400.2+0.3i', rel: 1.373e-14 },
]);

// ── Part D: omitted mirror + tail fields -> collision-time shift (Cole-Hopf form of G6's E(N)) ──
export const TAIL_LINEAR_RESPONSE_ROWS = Object.freeze([
  { N: 200,  kappaTail: 8.193e-3, kappaRvM: 6.656e-3, gradFext: 0.0674510193, tc_base: 0.0326830480, tc_with_fields: 0.0327553119, rel_shift: 2.2110524e-3, pred: 2.2045049e-3, routeB_Ecoll: 0.0664130083, Ecoll_over_shift: 919.0 },
  { N: 500,  kappaTail: 4.545e-3, kappaRvM: 3.815e-3, gradFext: 0.0283287140, tc_base: 0.0123271238, tc_with_fields: 0.0123314305, rel_shift: 3.4936952e-4, pred: 3.4921156e-4, routeB_Ecoll: 0.0444462221, Ecoll_over_shift: 10320.2 },
  { N: 2458, kappaTail: 1.476e-3, kappaRvM: 1.313e-3, gradFext: 0.0029899609, tc_base: 0.0011923134, tc_with_fields: 0.0011923176, rel_shift: 3.5649779e-6, pred: 3.5649704e-6, routeB_Ecoll: 0.0219106408, Ecoll_over_shift: 5154752.5 },
]);

// ── Part E: min gaps to 10^6 vs the small-gap statement implied by Route B's per-N bound ─────
export const ROUTE_B_IMPLIED_SMALL_GAP = 0.384; // C_C in |t_c(N)| <= C_C sqrt(log gamma_N / N)
export const impliedGapBound = (gammaN, N) => Math.sqrt(8 * ROUTE_B_IMPLIED_SMALL_GAP) * (Math.log(gammaN) / N) ** 0.25;
export const MIN_GAP_LADDER = Object.freeze([
  { N: 50,      gammaN: 143.111845808,   gmin: 0.845123634, argmin: 34,     gmin_over_yN: 0.42043 },
  { N: 100,     gammaN: 236.524229666,   gmin: 0.715786716, argmin: 91,     gmin_over_yN: 0.41333 },
  { N: 200,     gammaN: 396.381854223,   gmin: 0.498179464, argmin: 186,    gmin_over_yN: 0.32861 },
  { N: 500,     gammaN: 811.184358847,   gmin: 0.310430705, argmin: 453,    gmin_over_yN: 0.24015 },
  { N: 1000,    gammaN: 1419.422480946,  gmin: 0.161500788, argmin: 922,    gmin_over_yN: 0.13932 },
  { N: 2458,    gammaN: 2988.634699665,  gmin: 0.097502502, argmin: 1496,   gmin_over_yN: 0.09566 },
  { N: 5000,    gammaN: 5447.861998301,  gmin: 0.043254060, argmin: 4765,   gmin_over_yN: 0.04657 },
  { N: 10000,   gammaN: 9877.782654004,  gmin: 0.037698499, argmin: 6709,   gmin_over_yN: 0.04416 },
  { N: 20000,   gammaN: 18046.464296238, gmin: 0.035307321, argmin: 18859,  gmin_over_yN: 0.04475 },
  { N: 50000,   gammaN: 40433.687385462, gmin: 0.029537628, argmin: 44555,  gmin_over_yN: 0.04123 },
  { N: 100000,  gammaN: 74920.827498994, gmin: 0.014701476, argmin: 95248,  gmin_over_yN: 0.02196 },
  { N: 200000,  gammaN: 139501.96908298, gmin: 0.014701476, argmin: 95248,  gmin_over_yN: 0.02342 },
  { N: 500000,  gammaN: 319387.21930923, gmin: 0.005703705, argmin: 420891, gmin_over_yN: 0.00984 },
  { N: 1000000, gammaN: 600269.677012445, gmin: 0.005703705, argmin: 420891, gmin_over_yN: 0.01041 },
]);
export const MIN_GAP_EXPONENT_OVERALL = -0.373; // d log(gmin/yN)/d log N over N = 50 .. 1e6; GUE extreme-value: -1/3

// ── Small live check data: first 12 Odlyzko zeros (for the exact-identity assertion) ────────
const Z12 = Object.freeze([14.134725142, 21.022039639, 25.01085758, 30.424876126, 32.935061588, 37.586178159,
  40.918719012, 43.327073281, 48.005150881, 49.773832478, 52.970321478, 56.446247697]);

function viscousIdentityResidual(x, a, b) {
  // x: real positions; z = a + i b. Returns |m_s - (2 m m_z + m_zz)| / |m_s| for the attractive flow.
  const N = x.length;
  const xd = new Array(N).fill(0);
  for (let k = 0; k < N; k++) { let s = 0; for (let j = 0; j < N; j++) if (j !== k) s += 1 / (x[k] - x[j]); xd[k] = -2 * s; }
  let m = [0, 0], mz = [0, 0], mzz = [0, 0], ms = [0, 0];
  for (let k = 0; k < N; k++) {
    const dr = a - x[k], di = b, d2 = dr * dr + di * di;
    const f = [dr / d2, -di / d2];
    const f2 = [f[0] * f[0] - f[1] * f[1], 2 * f[0] * f[1]];
    const f3 = [f2[0] * f[0] - f2[1] * f[1], f2[0] * f[1] + f2[1] * f[0]];
    m[0] += f[0]; m[1] += f[1]; mz[0] -= f2[0]; mz[1] -= f2[1];
    mzz[0] += 2 * f3[0]; mzz[1] += 2 * f3[1]; ms[0] += xd[k] * f2[0]; ms[1] += xd[k] * f2[1];
  }
  const mmz = [m[0] * mz[0] - m[1] * mz[1], m[0] * mz[1] + m[1] * mz[0]];
  const rhs = [2 * mmz[0] + mzz[0], 2 * mmz[1] + mzz[1]];
  return Math.hypot(ms[0] - rhs[0], ms[1] - rhs[1]) / Math.hypot(ms[0], ms[1]);
}

// Live 4-particle fold check: adaptive RK4 to near-collision + fold extrapolation; returns s_c and gmin0.
function smallSystemCollision(x0) {
  const x = x0.slice(); const N = x.length;
  const d = (v) => v.map((vk, k) => { let s = 0; for (let j = 0; j < N; j++) if (j !== k) s += 1 / (vk - v[j]); return -2 * s; });
  const mg = (v) => { let g = Infinity; for (let i = 0; i < N - 1; i++) g = Math.min(g, v[i + 1] - v[i]); return g; };
  let s = 0;
  for (let it = 0; it < 5000; it++) {
    const g = mg(x); if (g < 1e-3) return { s_c: s + (g * g) / 8, gmin0: mg(x0) };
    const dt = 0.04 * (g * g) / 8;
    const k1 = d(x), t1 = x.map((v, i) => v + 0.5 * dt * k1[i]);
    const k2 = d(t1), t2 = x.map((v, i) => v + 0.5 * dt * k2[i]);
    const k3 = d(t2), t3 = x.map((v, i) => v + dt * k3[i]);
    const k4 = d(t3);
    for (let i = 0; i < N; i++) x[i] += (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
    s += dt;
  }
  return { s_c: NaN, gmin0: mg(x0) };
}

export const SUPERCRITICAL_FLUID_SHOCK_SCALING = Object.freeze({
  id: 'rh-bridge-supercritical-fluid-shock-scaling-2026-09-24',
  date: '2026-09-24',
  flowNormalization: 'dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j), s = -t (backward de Bruijn time); viscosity exactly 1 in m_s = 2 m m_z + m_zz',
  exactIdentities: {
    E1: 'd/dt H_t = -d^2/dz^2 H_t; theta(z, s) = H_{-s}(z) solves theta_s = theta_zz (forward heat, well-posed)',
    E2: 'P(z, s) = prod (z - x_k(s)) with the attractive flow solves P_s = P_zz exactly; Cole-Hopf m = P_z/P gives m_s = 2 m m_z + m_zz',
    E3: 'H_0 = c * P~_N * T_N (Hadamard); heat flow is linear, not multiplicative: truncation error = tail mean-field action on the bulk',
  },
  foldLaw: {
    exact: 'd(g^2)/ds = -8 + 4 g^2 S for every adjacent pair, S > 0 up to the first collision',
    rigorousLowerBound: '|t_c(N)| >= g_min(N)^2 / 8',
    frozenStretchEstimate: 's_c ~ -ln(1 - S g^2/2)/(4 S); matches N-body s_c to 7e-6 .. 1e-3 relative (N = 50 .. 2458)',
    collidingPairIsArgmin: FOLD_LAW_ROWS.every((r) => r.collidingPair === r.argmin),
    rows: FOLD_LAW_ROWS,
  },
  supercriticalScaling: {
    orderParameter: 'q = (half-gap)^2, smooth through s_c with dq/ds = -2 + 4 q S',
    subcritical: 'g^2 = 8 (s_c - s)',
    supercritical: 'pair at c +- i eta, Lorentzian shock m(x) = 2(x - c)/((x - c)^2 + eta^2) of width 2 eta, (2 eta)^2 = 8 (s - s_c)',
    exponent: 0.5,
    prefactor: 8,
    fits: SUPERCRITICAL_WIDTH_FITS,
    criticalWindow: '|s - s_c| << 1/(4 S); measured 1/(4S) = 9.5x (N=200), 21.7x (N=500) the collision leg s_c; scales like (y_N/g_min)^2',
  },
  viscousIdentityResiduals: VISCOUS_IDENTITY_RESIDUALS,
  tailLinearResponse: {
    law: 'Delta t_c / t_c = t_c * F_ext\'(x*) + O((t_c F\')^2) for any smooth external field F_ext',
    fieldsIncluded: 'mirror zeros -gamma_k (k <= N) + tail +-gamma_k (N < k <= 2e5), static',
    rows: TAIL_LINEAR_RESPONSE_ROWS,
    closedFormScale: 'E_tail(N) ~ t_c(N)^2 * (2/pi) log(gamma_N/2pi)/gamma_N when the tail zeros are real',
  },
  routeBImpliedSmallGaps: {
    statement: '|t_c(N)| <= 0.384 sqrt(log gamma_N / N) and |t_c(N)| >= g_min^2/8 imply g_min(N) <= sqrt(3.072) (log gamma_N / N)^{1/4} for every N',
    inMeanSpacingUnits: '0.49 y_N (N=50) .. 0.19 y_N (N=1e6), -> 0 like N^{-1/4} log^{5/4}',
    dataSatisfies: MIN_GAP_LADDER.every((r) => r.gmin <= impliedGapBound(r.gammaN, r.N)),
    theoremStatus: 'no published theorem gives a per-N power-saving small-gap bound; known results are lim-inf constants ~0.5 mean spacing via pair-correlation/mollifier methods',
    followUp: '2026-09-24 re-audit (rh-bridge-route-b-overclaim-baseline-audit-2026-09-24.js) CONFIRMED the overclaim and located the silent input: imp-366/imp-395 Step 1, g_min <= C_Lip W_1, which with the imp-341 bound needs C_Lip >= 1.39 (N=100) .. 45.5 (N=1e6) on the Odlyzko zeros (C_Lip -> 1 premise false; imp-2640/2642 had already retracted C_C = 0.384 as an ansatz). dyson-burgers-shock.js G6_PER_N_BOUND status corrected from closed to conditional.',
    ladder: MIN_GAP_LADDER,
    exponentOverall: MIN_GAP_EXPONENT_OVERALL,
    gueExponent: -1 / 3,
  },
  verdicts: {
    Q1_perNEnvelope: 'The exact shock width is set by g_min(N) (fold), not the mean spacing; |t_c| = g_min^2/8 is a 6.7x .. 139x tighter per-N envelope than 2pi/log^2 but is a function of g_min, not of N; the 1-point density only reaches the 1/log^2 rate (surrogate = fold law at g_min ~ 1.13 y_N); any faster rate is a small-gaps (pair-correlation) statement.',
    Q2_argminBypass: 'MONTGOMERY IN DISGUISE. The fluid carries the argmin exactly (shock = argmin pair, time = g_min^2/8) but creates no information: the value is invisible at Im z >= y_N and lives in the 2-point microstructure. Sharpening: a per-N UPPER bound needs only EXISTENCE of a small adjacent gap, not the argmin location (Route A bulk confinement is an artefact of the monotonicity route) -- the wall relocates to a per-N small-gaps theorem. Corollary: Route B\'s closed per-N bound implies an unproved power-saving small-gaps statement.',
    Q3_g6ColeHopf: 'EXACT IDENTITY, SHARPER E(N), SAME WALL. Finite-N Dyson = heat flow of P~_N; H_{-s} = heat flow of P~_N T_N; truncation error obeys a Lipschitz linear-response law (measured to 4-6 digits), 9e2 .. 5e6x below the Route-B Hoelder form -- provided the tail zeros are real. That proviso IS G6: an off-line tail zero is an already-supercritical pair forcing Lambda > 0, invisible to any finite-N flow from real data. G6 = RH above T_0 restated; Platt-Trudgian\'s barrier is the only handle on it.',
  },
  sideFinding: 'PATH_C_BASELINE_FIT fixed-step t_c values are overshoot-contaminated at all N (ratio to fold-accurate: 1.50, 1.03, 1.08, 1.32, 7.21 at N = 50, 100, 200, 500, 2458). Attribution corrected 2026-09-24 (rh-bridge-route-b-overclaim-baseline-audit): fixed-step RK4 at dt = 5e-4 reproduces the N = 50 literal 0.1435 exactly while Euler at the same dt gives 0.097, so the defect is the fixed dt, not the Euler stepper; corrected values now exported as PATH_C_BASELINE_FIT_ACCURATE in src/math/dyson-scaling-N5000.js.',
  scope: 'No Lambda bound, no RH claim, NO QED; rigorous content is elementary (E1-E3, s_c >= g_min^2/8). No refereed bound is changed.',
});

const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(Math.abs(a), Math.abs(b), 1e-300);

export const SUPERCRITICAL_FLUID_SHOCK_SCALING_ASSERTIONS = [
  {
    id: 'sfss-fold-law-frozen-stretch-matches-nbody',
    holds: () => FOLD_LAW_ROWS.every((r) => near(foldTimeFrozenS(r.gmin, r.S), r.tc, 2e-3) && r.tc / foldTime(r.gmin) >= 1 && r.tc / foldTime(r.gmin) <= 1.11),
    why: 'The frozen-stretch two-body fold time must reproduce the baked N-body collision time to 2e-3 at every N, and the bare fold g_min^2/8 must be a lower bound within 11% (rigorous half of the fold law: d(g^2)/ds >= -8).',
  },
  {
    id: 'sfss-colliding-pair-is-initial-argmin',
    holds: () => FOLD_LAW_ROWS.every((r) => r.collidingPair === r.argmin),
    why: 'The shock location coincides with the initial minimum-gap pair in every measured case; this is the "fluid carries the argmin exactly" half of the Q2 verdict.',
  },
  {
    id: 'sfss-surrogate-looseness-grows-with-N',
    holds: () => {
      const ratios = FOLD_LAW_ROWS.map((r) => r.surrogate / r.tc);
      const liveSurrogate = FOLD_LAW_ROWS.every((r) => near(TWO_PI / Math.log(r.gammaN / TWO_PI) ** 2, r.surrogate, 1e-8));
      return liveSurrogate && ratios[0] > 6 && ratios[ratios.length - 1] > 130 && ratios.every((x, i) => i === 0 || x > ratios[i - 1]);
    },
    why: 'The 2pi/log^2 surrogate (recomputed live from gamma_N) must exceed the fold-accurate t_c by a strictly increasing factor, from >6 at N = 50 to >130 at N = 2458; the 1-point density cannot reach the observed rate.',
  },
  {
    id: 'sfss-surrogate-equals-fold-law-at-1p13-mean-spacing',
    holds: () => FOLD_LAW_ROWS.every((r) => near(r.surrogate, foldTime(Math.sqrt(4 / Math.PI) * r.yN), 1e-8)),
    why: 'Algebra: 2pi/log^2 = y_N^2/(2pi) = (sqrt(4/pi) y_N)^2 / 8, so the surrogate is the fold law evaluated at a gap of 1.128 mean spacings -- it encodes no extreme-gap information.',
  },
  {
    id: 'sfss-supercritical-width-exponent-half-prefactor-8',
    holds: () => SUPERCRITICAL_WIDTH_FITS.every((f) => Math.abs(f.exponent - 1) < 2e-3 && Math.abs(f.prefactor - 8) < 0.03
      && f.postRatios.every((x) => Math.abs(x - 1) < 1e-3) && f.preRatios.every((x) => Math.abs(x - 1) < 1e-3)
      && near(1 / (4 * f.S_at_switch), f.window_1_over_4S, 2e-3) && f.window_over_sc > 9),
    why: 'width^2 = (2 eta)^2 must scale as 8 (s - s_c)^1 (width exponent 1/2, prefactor C_collision = 8) to 0.1% on both sides of the fold, and the critical window 1/(4S) must exceed the whole collision leg.',
  },
  {
    id: 'sfss-viscous-burgers-identity-exact-live',
    holds: () => [[20.3, 0.5], [40.1, 1.5]].every(([a, b]) => viscousIdentityResidual(Z12, a, b) < 1e-11)
      && VISCOUS_IDENTITY_RESIDUALS.every((r) => r.rel < 1e-13),
    why: 'Cole-Hopf: m = sum 1/(z - x_k) under the attractive flow satisfies m_s = 2 m m_z + m_zz identically (viscosity 1). Recomputed live on the first 12 zeros and baked from the N = 300 run.',
  },
  {
    id: 'sfss-live-small-system-fold-lower-bound',
    holds: () => {
      const r = smallSystemCollision([1.0, 2.0, 2.3, 3.5]);
      return Number.isFinite(r.s_c) && r.s_c >= foldTime(r.gmin0) && r.s_c <= foldTime(r.gmin0) * 1.5;
    },
    why: 'The rigorous inequality s_c >= g_min^2/8 must hold for a live 4-particle attractive flow (with the frozen-stretch correction keeping it within 50% for this deliberately crowded configuration).',
  },
  {
    id: 'sfss-tail-linear-response-law',
    holds: () => TAIL_LINEAR_RESPONSE_ROWS.every((r) => near(r.rel_shift, r.pred, 4e-3) && near(r.pred, r.tc_base * r.gradFext, 1e-6)
      // tc fields are 10-decimal literals: compare the reconstructed shift at the 1e-10 quantum, not relatively
      && Math.abs((r.tc_with_fields - r.tc_base) - r.rel_shift * r.tc_base) <= 2e-10 && r.Ecoll_over_shift > 900
      && near(r.routeB_Ecoll, 0.384 * Math.sqrt(Math.log(FOLD_LAW_ROWS.find((f) => f.N === r.N).gammaN) / r.N), 1e-6)),
    why: 'The measured collision-time shift from the omitted mirror + tail fields must equal t_c * F_ext\'(x*) to 4e-3 relative at every N, and Route B\'s E_coll (recomputed live) must exceed the measured truncation shift by >900x: Cole-Hopf sharpens the FORM of G6\'s E(N) when the tail is real.',
  },
  {
    id: 'sfss-route-b-implies-small-gaps-data-consistent',
    holds: () => MIN_GAP_LADDER.every((r) => r.gmin <= impliedGapBound(r.gammaN, r.N))
      && MIN_GAP_LADDER.every((r, i) => i === 0 || r.gmin <= MIN_GAP_LADDER[i - 1].gmin)
      && impliedGapBound(MIN_GAP_LADDER[0].gammaN, 50) / (TWO_PI / Math.log(MIN_GAP_LADDER[0].gammaN / TWO_PI)) < 0.5
      && impliedGapBound(MIN_GAP_LADDER[13].gammaN, 1e6) / (TWO_PI / Math.log(MIN_GAP_LADDER[13].gammaN / TWO_PI)) < 0.2,
    why: 'Route B\'s per-N bound plus the rigorous fold lower bound imply g_min(N) <= 1.753 (log gamma_N/N)^{1/4}; the Odlyzko data satisfy it at all 14 N and g_min is non-increasing, but the implied constant in mean-spacing units (<0.5 at N = 50, <0.2 at N = 1e6) is a power-saving small-gaps statement no theorem supplies. Tripwire for the G6_per_N_bound status.',
  },
  {
    id: 'sfss-min-gap-exponent-near-gue-third',
    holds: () => {
      const a = MIN_GAP_LADDER[0], b = MIN_GAP_LADDER[MIN_GAP_LADDER.length - 1];
      const yA = TWO_PI / Math.log(a.gammaN / TWO_PI), yB = TWO_PI / Math.log(b.gammaN / TWO_PI);
      const ex = Math.log((b.gmin / yB) / (a.gmin / yA)) / Math.log(b.N / a.N);
      return near(ex, MIN_GAP_EXPONENT_OVERALL, 2e-2) && Math.abs(ex - (-1 / 3)) < 0.06;
    },
    why: 'The normalized minimum gap decays like N^{-0.37} over N = 50 .. 1e6 (recomputed live from the baked ladder), within 0.06 of the GUE extreme-value exponent -1/3 that comes from the s^2 level repulsion of the pair correlation -- the tightened envelope is pair-correlation input.',
  },
  {
    id: 'sfss-gue-envelope-within-factor-6-of-tc',
    holds: () => FOLD_LAW_ROWS.every((r) => { const env = foldTime(gueMedianMinGapRatio(r.N) * r.yN); return env / r.tc > 0.15 && env / r.tc < 1; }),
    why: 'The GUE-median extreme-gap envelope (9 ln2/(pi^2 N))^{2/3} y_N^2/8 sits within a factor 0.15 .. 1 of the measured t_c at every N, unlike the 6.7x .. 139x surrogate; it is what a pair-correlation input buys.',
  },
  {
    id: 'sfss-no-qed-scope',
    holds: () => /NO QED/.test(SUPERCRITICAL_FLUID_SHOCK_SCALING.scope) && /Platt-Trudgian Lambda <= 0.2|refereed bound is changed/.test(SUPERCRITICAL_FLUID_SHOCK_SCALING.scope)
      && /MONTGOMERY IN DISGUISE/.test(SUPERCRITICAL_FLUID_SHOCK_SCALING.verdicts.Q2_argminBypass)
      && /SAME WALL/.test(SUPERCRITICAL_FLUID_SHOCK_SCALING.verdicts.Q3_g6ColeHopf),
    why: 'The record must keep its honest scope: no Lambda bound, no RH claim, verdicts Montgomery-in-disguise (Q2) and same-wall (Q3).',
  },
];
