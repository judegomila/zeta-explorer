/**
 * rh-supercritical-fluid-bridge (2026-09-24) — the de Bruijn / twin-ladder bridge written EXACTLY as a viscous Burgers
 * fluid whose critical point is the de Bruijn-Newman constant Lambda. RESULT: (i) COLE-HOPF (exact): the heat potential is
 * H_t itself; with the Cole-Hopf field w = -2 nu d_x log H (ordinate units x, zeros of H(.,0) at gamma_n) the BACKWARD
 * de Bruijn flow tau = -t is the viscous Burgers equation w_tau + w w_x = nu w_xx with nu = 1/4 EXACTLY (nu = 1 in the
 * Polymath15 variable z = 2x; nu = 1 in the repo's Path-C time tau_repo = -t/4; nu = 1/N in Dyson's normalised time for
 * m_N = (1/N) sum 1/(gamma_k - x)) — the inviscid Dyson-Burgers of dyson-burgers-shock.js is the nu = 1/N -> 0 limit and
 * the heat flow is the regularizer. Verified on the exact H_t to relative residual < 2e-18 (mpmath, dps 50).
 * (ii) SHOCK = COMPLEX PAIR (exact): a conjugate pair a +- i b is a smooth Lorentzian-derivative front of the Burgers field
 * with strength Delta = max w - min w and core half-width b obeying Delta * b = 4 nu EXACTLY as b -> 0 (measured 0.990 at
 * b = 0.16 on the exact flow); real-zero collision = shock formation (the inviscid singularity), complex pair = the
 * viscous shock, b^2 grows linearly d(b^2)/dtau = 2 nu = 1/2 (measured 1.010 x at b = 0.16). (iii) CRITICAL POINT:
 * Lambda = shock-dissolution time = inf{t : no complex zero}; ORDER PARAMETER phi(t) = fraction of non-real zeros; phi = 0
 * for t >= Lambda (supercritical / single phase, de Bruijn 1950 forward preservation), phi > 0 for t < Lambda (two-phase
 * coexistence of real and complex zeros); RH <=> phi(0) = 0 <=> Lambda <= 0; Rodgers-Tao 2020 (Lambda >= 0) = every t < 0
 * is two-phase. (iv) EQUATION OF STATE at finite height T (scaling form): phi(t;T) = Psi_beta(theta), theta = |t| / tau_*(T),
 * tau_*(T) = delta(T)^2/(8 nu) = 2 pi^2 / log^2(T/2pi) (same log^-2 law as the repo's finite-N Burgers surrogate), with
 * Psi_beta(theta) ~ C_beta theta^{(beta+1)/2} as theta -> 0: the coexistence-curve exponent is (beta+1)/2 with beta the
 * level-repulsion exponent — 1/2 Poisson, 1 GOE, 3/2 GUE, 5/2 GSE — because the two-body law g^2 = g_0^2 - 8 nu tau
 * converts the gap CDF F(s) ~ s^{beta+1} into phi ~ tau^{(beta+1)/2}. Measured by exact polynomial heat flow on
 * beta-Hermite samples (see MODEL_EOS) and on the first 400 zeta zeros (ZETA_WINDOW_EOS). The exact H_t on [0,100]
 * (29 zeros, mpmath, argument principle) gives the staircase phi(-0.8) = 0, phi(-0.95) = 2/29, phi(-1.5) = 8/29,
 * phi(-3) = 14/28; first collision (gamma_27, gamma_28) = (94.651, 95.871) at t = -0.881077 vs two-body -0.743334: the
 * many-body delay ratio is 1.17-1.40 on the six closest low pairs, tau_c ~ (g^2/2)(1 + kappa (g/delta)^2), kappa ~ 0.6-0.7.
 * (v) HONEST NOTE: exact = Cole-Hopf, viscosity dictionary, zero ODE, pair law, shock identity, definitions/dictionary,
 * Lambda in [0, 0.2]; heuristic = the exponent (needs GUE gap statistics = Montgomery PCC, unproved) and the amplitude;
 * the thermodynamic (T -> oo) order parameter is the step 1_{t<Lambda} (every fixed t < 0 becomes fully two-phase at
 * large height), so the finite-height pseudo-critical points t_c(T) -> 0^- (the repo's a = 0 / the Lehmer-pair ladder)
 * carry NO information on whether phi(0) = 0 at all heights: the fluid model is an exact dictionary and a reframing,
 * not a lever on Lambda. Changes no bound; no refereed bound is changed; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------------------------------------------
 * 1. COLE-HOPF DERIVATION (exact). Official normalisation (Newman / Polymath15 / Rodgers-Tao):
 *        H_t(z) = int_0^oo e^{t u^2} Phi(u) cos(z u) du,  Phi(u) = sum_n (2 pi^2 n^4 e^{9u} - 3 pi n^2 e^{5u}) exp(-pi n^2 e^{4u}),
 *        H_0(z) = xi(1/2 + i z/2)/8, zeros of H_0 at z = 2 gamma_n.   Differentiating under the integral,
 *        d_t H = int u^2 e^{tu^2} Phi cos(zu) du = -d_z^2 H            (backward heat equation in z, nu_z = 1).
 *    In ORDINATE units x = z/2 (zeros at gamma_n): H(x,t) := H_t(2x) satisfies d_t H = -(1/4) d_x^2 H, nu_x = 1/4.
 *    Let theta(x,tau) := H(x,-tau) (backward time). Then theta_tau = nu theta_xx (forward heat equation, nu = 1/4) and the
 *    textbook Cole-Hopf substitution w := -2 nu d_x log theta gives
 *        w_tau + w w_x = nu w_xx                                        (viscous Burgers, nu = 1/4).
 *    Proof: with v = theta_x/theta, v_tau = (theta_xx/theta)_x + ... = nu (v_xx + 2 v v_x) (direct differentiation of
 *    theta_tau = nu theta_xx), and w = -2 nu v gives w_tau = -2 nu^2 (v_xx + 2 v v_x) = nu w_xx - w w_x.  Forward in t the same
 *    identity reads v_t + 2 nu v v_x + nu v_xx = 0 (ANTI-viscous: fronts sharpen, complex pairs land on the axis).
 *    Since H is even of order 1, H(x,t) = H(0,t) prod_j (1 - x^2/z_j(t)^2) (Hadamard, no exponential factor), so
 *        v = H_x/H = sum_{all zeros +-z_j} 1/(x - z_j),   w = -2 nu v = 2 nu sum_j 1/(z_j - x) = (1/2) N m_N(x)   with
 *    m_N = (1/N) sum_k 1/(gamma_k - x) Dyson's empirical Stieltjes transform: the Cole-Hopf field IS the Stieltjes /
 *    log-derivative field. Zero dynamics (differentiate H(z_k(t),t) = 0):  dz_k/dt = 2 nu sum_{j != k} 1/(z_k - z_j)
 *    (paired sum; Polymath15's ODE with nu = 1, here nu = 1/4 in ordinate units). Two-body law: a real pair of gap g
 *    has d(g^2)/dt = 8 nu = 2 (repulsion forward), a conjugate pair a +- ib has d(b^2)/dt = -2 nu = -1/2 (lands at
 *    t = 2 b^2). The Burgers profile of a conjugate pair on the real line is w(x) = -2 nu * 2(x-a)/((x-a)^2 + b^2) + smooth,
 *    strength Delta = max w - min w = 4 nu / b at x = a -+ b: Delta * b = 4 nu (the Taylor shock relation strength x
 *    thickness = 4 nu, here EXACT for the pole pair). Collision of two real zeros = the inviscid shock (v develops a
 *    double pole); the complex pair = its viscous regularisation with thickness b = sqrt(2 nu (tau - tau_c)).
 *
 * 2. VISCOSITY DICTIONARY (all exact; "nu(t)" is CONSTANT in de Bruijn's parametrisation, kernel variance 2 nu tau):
 *        variable / time                       field                          equation                          nu
 *        z = 2x, official t (backward)         -2 d_z log H                   w_tau + w w_z = w_zz               1
 *        x (ordinates), official t (backward)  -(1/2) d_x log H               w_tau + w w_x = (1/4) w_xx         1/4
 *        x, repo Path-C time tau_repo = -t/4   -2 d_x log H = 2 M, M = sum 1/(gamma_k - x)   M_tau + 2 M M_x = M_xx   1
 *        x, Dyson time s = N tau_repo, m_N = M/N                                m_s + 2 m m_x = (1/N) m_xx        1/N
 *    Row 4 is the exact viscous completion of dyson-burgers-shock.js's "d_t m + 2 m d_z m = 0": inviscid = N -> oo at fixed
 *    Dyson time s, i.e. tau_repo = s/N -> 0 — the same limit in which the continuum shock time is 0 (a = 0, imp-341/344).
 *    Row 3 is imp-34813's identity "Gaussian convolution of width sqrt(2 tau_repo) = H at t = -4 tau_repo".
 *    Parametrising by the heat-kernel standard deviation sigma = sqrt(2 nu tau) instead of tau gives the equivalent
 *    d_sigma w + (sigma/nu)(w w_x - nu w_xx) = 0, i.e. an effective sigma-dependent viscosity nu_sigma = sigma.
 *
 * 3. THE FLUID DICTIONARY. Two-phase region: t < Lambda (real "liquid" zeros coexisting with complex "vapour" pairs);
 *    single phase (supercritical): t >= Lambda, all zeros real. Order parameter phi(t) := lim of the non-real fraction
 *    (window-resolved: phi(t;T) = non-real zeros with |Re| <= T / all zeros with |Re| <= T). Critical point = Lambda =
 *    the time the LAST shock dissolves. RH <=> phi(0) = 0 (de Bruijn 1950, RH <=> Lambda <= 0); Rodgers-Tao 2020
 *    Lambda >= 0 <=> phi(t) > 0 for every t < 0; RH <=> Lambda = 0 exactly: the critical point sits at the boundary
 *    of the proved two-phase region. Rodgers-Tao's proof in this language: if the single phase persisted on an interval
 *    [Lambda, 0) with Lambda < 0, the zero fluid would have to be a rigid crystal (the equally spaced picket fence is
 *    the only stationary real-rooted configuration: e^{tau d^2} cos(pi x/delta) = e^{-tau pi^2/delta^2} cos(pi x/delta)
 *    moves no zero), contradicting the unconditional pair-correlation lower bounds — the zeta phase is not crystalline.
 *
 * 4. EQUATION OF STATE. Rare close pairs collide first: a pair of gap g collides at tau_c = g^2/(8 nu) (1 + O((g/delta)^2))
 *    (delta = local mean spacing 2 pi/log(T/2pi)). With gap CDF F_beta(s) ~ c_beta s^{beta+1} (level repulsion exponent
 *    beta), phi(t;T) ~ 2 F_beta(g_c/delta), g_c = sqrt(8 nu |t|) = sqrt(2|t|), so with theta = |t|/tau_*(T),
 *    tau_*(T) = delta^2/(8 nu) = 2 pi^2/log^2(T/2 pi):  phi = Psi_beta(theta) ~ 2 c_beta theta^{(beta+1)/2}.
 *    GUE (sine kernel): F_2(s) = (pi^2/9) s^3 - (2 pi^4/225) s^5 + ..., so Psi_2(theta) ~ (2 pi^2/9) theta^{3/2}: exponent 3/2.
 *    Poisson 1/2, GOE 1, GSE 5/2. The transition is CONTINUOUS at finite height (finite-size scaling with tau_*(T) ~
 *    log^-2 T -> 0 as the finite-size shift), and the finite-height pseudo-critical point t_c(T) = -min_{pairs below T}
 *    tau_c -> 0^- (the repo's a = lim sup |t_c(N)| = 0; the Lehmer-pair Lambda lower-bound ladder -50, -5, -0.385,
 *    -0.0991, -4.4e-6, -2.7e-9, -1.15e-11 is the same sequence read off ever-closer pairs at ever-greater heights). In the
 *    T -> oo limit at FIXED t < 0 every height above delta(T)^2 < 2|t| has collided, so phi(t) -> 1: the thermodynamic
 *    order parameter is the step 1_{t < Lambda} — the analogue of a first-order boiling point, not a critical isotherm.
 *
 * 5. NUMERICS (mpmath dps 50, 384-node Gauss-Legendre on u in [0,1]; numpy polynomial heat flow P_tau = e^{nu tau d^2} P_0
 *    = E[P_0(x + sqrt(2 nu tau) G)] by trapezoid, zero positions converged to <= 3e-4; scripts in tmp/supercritical-bridge/):
 *    normalisation H(x,0) = xi(1/2+ix)/8 to relErr <= 9.2e-22 at x = 100; heat/Burgers residuals <= 1.6e-18 (FD-limited);
 *    exact pair collisions, shock law, staircase and model exponents baked below.
 */

const PI = Math.PI;

// ---------------------------------------------------------------------------------------------------------------------
// Viscosity dictionary (exact).
// ---------------------------------------------------------------------------------------------------------------------
export const VISCOSITY_DICTIONARY = Object.freeze({
  officialZ: Object.freeze({ variable: 'z = 2x (Polymath15)', time: 'official t, backward tau = -t', field: 'w = -2 d_z log H_t', nu: 1 }),
  ordinates: Object.freeze({ variable: 'x (zeta ordinates, zeros at gamma_n)', time: 'official t, backward tau = -t', field: 'w = -(1/2) d_x log H', nu: 0.25 }),
  repoPathC: Object.freeze({ variable: 'x', time: 'tau_repo = -t/4 (imp-34813: Gaussian conv width sqrt(2 tau_repo) = H_{-4 tau_repo})', field: 'M = sum 1/(gamma_k - x), M_tau + 2 M M_x = M_xx', nu: 1 }),
  dysonNormalised: Object.freeze({ variable: 'x', time: 's = N tau_repo', field: 'm_N = M/N, m_s + 2 m m_x = (1/N) m_xx', nu: '1/N', inviscidLimit: 'N -> oo at fixed s (dyson-burgers-shock.js PDE d_t m + 2 m d_z m = 0)' }),
  heatKernelVariance: '2 nu tau (constant nu in de Bruijn parametrisation; nu_sigma = sigma if parametrised by kernel s.d. sigma)',
  timeConversion_t_official_over_tau_repo: -4,
  pairLaws: Object.freeze({ realPair_dg2_dt: '8 nu = 2 (ordinate units)', conjugatePair_db2_dt: '-2 nu = -1/2', shockIdentity: 'Delta * b = 4 nu = 1' }),
});

// ---------------------------------------------------------------------------------------------------------------------
// Exact polynomial heat flow in JS (self-contained checks of the identities on a small model).
// P_t = e^{-nu t d^2} P_0 = sum_m (-nu t)^m/m! P_0^{(2m)}   (coefficients c[k] of x^k, ascending)
// ---------------------------------------------------------------------------------------------------------------------
export function polyFromRoots(roots) {
  let c = [1];
  for (const r of roots) {
    const n = [];
    for (let k = 0; k <= c.length; k++) n[k] = (k > 0 ? c[k - 1] : 0) - r * (k < c.length ? c[k] : 0);
    c = n;
  }
  return c;
}
export function polyDeriv(c) { return c.slice(1).map((a, k) => a * (k + 1)); }
export function polyEval(c, x) { let s = 0; for (let k = c.length - 1; k >= 0; k--) s = s * x + c[k]; return s; }
export function heatFlowPoly(c, t, nu) {
  const out = c.slice();
  let d = c.slice(); let fac = 1;
  for (let m = 1; 2 * m < c.length; m++) {
    d = polyDeriv(polyDeriv(d)); fac *= (-nu * t) / m;
    for (let k = 0; k < d.length; k++) out[k] += fac * d[k];
  }
  return out;
}
// real roots of a polynomial on [a,b] by sign scan + bisection
export function realRootsOnInterval(c, a, b, n = 4000) {
  const roots = []; let xp = a; let fp = polyEval(c, a);
  for (let i = 1; i <= n; i++) {
    const x = a + ((b - a) * i) / n; const f = polyEval(c, x);
    if ((f > 0) !== (fp > 0)) {
      let lo = xp, hi = x, flo = fp;
      for (let k = 0; k < 60; k++) { const mid = 0.5 * (lo + hi); const fm = polyEval(c, mid); if ((fm > 0) === (flo > 0)) { lo = mid; flo = fm; } else hi = mid; }
      roots.push(0.5 * (lo + hi));
    }
    xp = x; fp = f;
  }
  return roots;
}

// ---------------------------------------------------------------------------------------------------------------------
// Baked literals from tmp/supercritical-bridge/exact_ht.py (exact H_t, ordinate units, official time; tau = -t).
// ---------------------------------------------------------------------------------------------------------------------
export const EXACT_FLOW = Object.freeze({
  normalisationRelErr: Object.freeze([[5, 2.67e-50], [20, 1.74e-47], [40, 2.66e-41], [60.5, 2.19e-34], [100, 9.19e-22]]),
  // (x, t, heat residual |H_t + H_xx/4| / (|H_t| + |H_xx|/4), Burgers residual |w_tau + w w_x - w_xx/4| / sum of |terms|)
  coleHopfResiduals: Object.freeze([
    [10.0, -0.5, 3.98e-21, 1.75e-20], [20.3, 0.3, 1.78e-19, 5.73e-20], [33.1, -1.0, 7.80e-19, 1.62e-20],
    [50.7, -2.0, 1.56e-18, 6.62e-19], [7.2, 1.5, 1.84e-20, 4.27e-22],
  ]),
  nZerosBelow100: 29,
  // six closest pairs below 100: [index k (gamma_k, gamma_{k+1}), gap, tau_c exact, tau_c two-body g^2/2, ratio]
  pairCollisions: Object.freeze([
    Object.freeze({ k: 27, gammaL: 94.651344041, gammaR: 95.870634228, gap: 1.219290187, tauExact: 0.8810771225, tauTwoBody: 0.7433342801, ratio: 1.1853040364 }),
    Object.freeze({ k: 24, gammaL: 87.425274613, gammaR: 88.809111208, gap: 1.383836595, tauExact: 1.1438662126, tauTwoBody: 0.9575018608, ratio: 1.1946360204 }),
    Object.freeze({ k: 19, gammaL: 75.704690699, gammaR: 77.144840069, gap: 1.44014937, tauExact: 1.2755439557, tauTwoBody: 1.037015104, ratio: 1.230014829 }),
    Object.freeze({ k: 13, gammaL: 59.347044003, gammaR: 60.831778525, gap: 1.484734522, tauExact: 1.2852699172, tauTwoBody: 1.1022183004, ratio: 1.1660756465 }),
    Object.freeze({ k: 9, gammaL: 48.005150881, gammaR: 49.773832478, gap: 1.768681597, tauExact: 1.8779090808, tauTwoBody: 1.5641172958, ratio: 1.2006190877 }),
    Object.freeze({ k: 22, gammaL: 82.910380854, gammaR: 84.735492981, gap: 1.825112127, tauExact: 2.3241421206, tauTwoBody: 1.6655171381, ratio: 1.3954477366 }),
  ]),
  // complex pair born at tau_c1 = 0.8810771225 from (gamma_27, gamma_28): [tau - tau_c, Re z, b = Im z, b^2/((tau-tau_c)/2), Delta*b]
  // Delta*b rows with b >= 0.69 are polluted by neighbouring real poles inside the +-3b scan and are not shock measurements.
  complexPairShockLaw: Object.freeze([
    [0.05, 95.5552017, 0.1589182624, 1.0102005653, 0.9897173051],
    [0.1, 95.5705174, 0.22589430, 1.0205646951, 0.9793042791],
    [0.2, 95.6009989, 0.3227689761, 1.0417981192, 0.9576596803],
    [0.4, 95.6613695, 0.4661309134, 1.0863901421, 0.9114699125],
    [0.8, 95.7798762, 0.6884647962, 1.184959439, null],
    [1.6, 96.0106021, 1.0683680736, 1.4267629258, null],
  ]),
  // order parameter on the window [0,100] x [-3,3]: [tau, nReal (sign scan dx=0.05), nTotal (argument principle winding), phi]
  orderParameterWindow100: Object.freeze([
    [0.25, 29, 29, 0], [0.5, 29, 29, 0], [0.7, 29, 29, 0], [0.8, 29, 29, 0],
    [0.95, 27, 29, 2 / 29], [1.05, 27, 29, 2 / 29], [1.2, 25, 29, 4 / 29], [1.5, 21, 29, 8 / 29],
    [2.0, 19, 29, 10 / 29], [3.0, 14, 28, 14 / 28],
  ]),
  windowLowerBoundOnLambda: -0.8810771225,
  manyBodyDelayLaw: 'tau_c = (g^2/2)(1 + kappa (g/delta)^2), kappa in [0.58, 0.70] on the six pairs (delta = 2 pi / log(gamma/2pi) local mean spacing)',
});

// ---------------------------------------------------------------------------------------------------------------------
// Baked literals from tmp/supercritical-bridge/model_eos.py (numpy polynomial heat flow; unit mean spacing, nu = 1).
// ---------------------------------------------------------------------------------------------------------------------
export const MODEL_EOS = Object.freeze({
  method: 'beta-Hermite (Dumitriu-Edelman) tridiagonal samples unfolded by the semicircle to unit spacing (central 200 of 300) and iid uniform (Poisson); exact polynomial heat flow P_tau = e^{tau d^2} P_0 evaluated by Gaussian-average trapezoid; real zeros by sign scan (dx = 0.01); phi = (N - nReal)/N pooled over 4 samples (800 zeros); phiTwoBody = 2 #{gaps: g^2 < 8 tau}/N',
  taus: Object.freeze([0.0005, 0.001, 0.002, 0.004, 0.007, 0.012, 0.02, 0.03, 0.045, 0.065, 0.09, 0.125]),
  // flow-measured phi and two-body phi per ensemble; effective exponent = log-log slope over phi in (0.008, 0.25)
  ensembles: Object.freeze({
    poisson: Object.freeze({ beta: 0, predicted: 0.5, phi: [0.0925, 0.13, 0.21, 0.275, 0.3525, 0.4175, 0.475, 0.5175, 0.5725, 0.6325, 0.6725, 0.69], phiTwoBody: [0.1, 0.1525, 0.25, 0.3275, 0.4375, 0.5225, 0.6375, 0.7375, 0.875, 1.0275, 1.1225, 1.26], effectiveExponentFlow: 0.5914, effectiveExponentTwoBody: null }),
    GOE: Object.freeze({ beta: 1, predicted: 1, phi: [0, 0.01, 0.0175, 0.0475, 0.08, 0.14, 0.2075, 0.2875, 0.37, 0.445, 0.5175, 0.58], phiTwoBody: [0, 0.01, 0.0175, 0.0475, 0.0825, 0.1525, 0.245, 0.36, 0.495, 0.6725, 0.8375, 1.06], effectiveExponentFlow: 1.0516, effectiveExponentTwoBody: 1.103 }),
    GUE: Object.freeze({ beta: 2, predicted: 1.5, phi: [0.0025, 0.0025, 0.005, 0.005, 0.025, 0.045, 0.0875, 0.15, 0.225, 0.3225, 0.4275, 0.535], phiTwoBody: [0.0025, 0.0025, 0.005, 0.005, 0.025, 0.0475, 0.0975, 0.19, 0.3025, 0.525, 0.75, 1.0625], effectiveExponentFlow: 1.2073, effectiveExponentTwoBody: 1.3893 }),
    GSE: Object.freeze({ beta: 4, predicted: 2.5, phi: [0, 0, 0, 0, 0, 0.005, 0.0225, 0.07, 0.1375, 0.265, 0.365, 0.4875], phiTwoBody: [0, 0, 0, 0, 0, 0.005, 0.0325, 0.085, 0.2175, 0.3975, 0.6925, 1.02], effectiveExponentFlow: 2.2321, effectiveExponentTwoBody: 2.3442 }),
  }),
  // high-statistics pooled gaps (120 samples x 299 gaps = 35880 per ensemble): two-body phi exponent fitted over phi in (0.002, 0.05)
  // and the direct gap-CDF exponent F(s) ~ s^{beta+1} on s in [0.08, 0.35] (GSE CDF vanishes on part of that range: omitted)
  pooledGaps: Object.freeze({
    poisson: Object.freeze({ predicted: 0.5, phiExponentSmallPhi: 0.4950, gapCdfExponent: 0.9266, predictedGapCdf: 1 }),
    GOE: Object.freeze({ predicted: 1, phiExponentSmallPhi: 1.1138, gapCdfExponent: 2.0189, predictedGapCdf: 2 }),
    GUE: Object.freeze({ predicted: 1.5, phiExponentSmallPhi: 1.5155, gapCdfExponent: 3.0377, predictedGapCdf: 3 }),
    GSE: Object.freeze({ predicted: 2.5, phiExponentSmallPhi: 2.3509, gapCdfExponent: null, predictedGapCdf: 5 }),
  }),
  reading: 'the flow-measured effective exponents over phi in (0.008, 0.25) order as (beta+1)/2 but sit below the asymptotic value for beta = 2, 4 (1.21 vs 1.5, 2.23 vs 2.5) because the fit window already reaches s ~ 0.6 where the gap CDF bends and many-body delay flattens phi; the small-phi pooled-gap exponents (0.495, 1.11, 1.52, 2.35) and the gap-CDF exponents (0.93, 2.02, 3.04) confirm (beta+1)/2 as the tau -> 0 law. Flow phi <= two-body phi at every tau (many-body delay), equality only in the first collisions.',
});

export const ZETA_WINDOW_EOS = Object.freeze({
  method: 'first 400 zeros (+ mirrors) as an even polynomial, exact heat flow with nu = 1/4 (official time), window [0, 560] holding 312 zeros, sign scan dx = 0.01; phi = (312 - nReal)/312 assuming no net zero flux through x = 560 (NOT verified by an argument-principle count for this window; the count-conserving check was run only on the exact [0,100] window); phiTwoBody = 2 #{gaps < sqrt(2 tau)}/312; phiGUEcontinuum = 2 sum_pairs F_2(sqrt(2 tau)/delta(gamma)) / 312 with the Wigner-surmise CDF',
  // [tau, nReal, phi, phiTwoBody, phiGUEcontinuum]
  rows: Object.freeze([
    [0.01, 312, 0, 0, 0.00141], [0.02, 312, 0, 0, 0.00396], [0.035, 312, 0, 0, 0.00908], [0.06, 312, 0, 0, 0.02006],
    [0.1, 308, 4 / 312, 4 / 312, 0.04209], [0.15, 304, 8 / 312, 8 / 312, 0.07496], [0.22, 297, 15 / 312, 20 / 312, 0.12754],
    [0.32, 281, 31 / 312, 38 / 312, 0.21054], [0.45, 261, 51 / 312, 78 / 312, 0.32490], [0.65, 223, 89 / 312, 146 / 312, 0.50214],
    [0.9, 181, 131 / 312, 202 / 312, 0.71121], [1.3, 147, 165 / 312, 1.00641, 0.99860], [1.8, 131, 181 / 312, 1.30769, 1.27292],
    [2.5, 101, 211 / 312, 1.56410, 1.52955],
  ]),
  effectiveExponentFlow: 1.7123,
  effectiveExponentTwoBody: 1.9801,
  reading: 'first collision in the window between tau = 0.06 and 0.1 (t_c(560) in (-0.1, -0.06)); effective exponent 1.71 (two-body 1.98) over phi in (0.01, 0.25) is a small-count fit (4 to 78 complex zeros) and is consistent with a steep GUE-like onset; the GUE-continuum prediction with the smooth 1-point density overestimates phi by ~3x at tau <= 0.15 (the low zeros have fewer small gaps than the sine-kernel law predicts at these heights); flow phi < two-body phi from tau = 0.22 on (many-body delay), and the two-body count exceeds 1 beyond tau = 1.3 (double counting of shared zeros) while the flow saturates towards phi -> 1 (0.68 at tau = 2.5).',
});

export const G6_FIRST_PAIR = Object.freeze({
  pair: Object.freeze([94.651344041, 95.870634228]),
  exactHt: 0.8810771225,
  twoBody: 0.7433342801,
  // truncated polynomial flows P_0 = prod_{k<=N}(1 - x^2/gamma_k^2), nu = 1/4; frozen tail = extra factor exp(-S_N x^2), S_N = sum_{k>N} gamma_k^-2
  truncated: Object.freeze([
    Object.freeze({ N: 29, tau: 0.8442661629, tauFrozenTail: 0.84856219, S_N: 5.99548e-3 }),
    Object.freeze({ N: 100, tau: 0.8782741462, tauFrozenTail: 0.8806805347, S_N: 3.11086e-3 }),
    Object.freeze({ N: 400, tau: 0.8800240389, tauFrozenTail: 0.8810583648, S_N: 1.32953e-3 }),
    Object.freeze({ N: 1200, tau: 0.8805835626, tauFrozenTail: 0.8810730918, S_N: 6.34213e-4 }),
  ]),
  sumInverseGammaSquared: 0.023104993115418,
  reading: 'the N-zero truncated flow converges to the exact H_t collision time from below (-4.2%, -0.32%, -0.12%, -0.056% at N = 29, 100, 400, 1200); adding the first-order frozen tail exp(-S_N x^2) removes most of the residual (-3.7%, -4.5e-4, -2.1e-5, -4.6e-6). This is a per-event quantitative instance of the G6 finite-N <-> H_t bridge of bridge-lambda-rh.js: for the LOW zeros the truncated Dyson/Calogero flow plus the Gaussian tail factor reproduces the exact de Bruijn collision to 5e-6 relative at N = 1200. It says nothing about collisions at heights near the truncation edge or about the N -> oo uniformity that Route B requires.',
});

// ---------------------------------------------------------------------------------------------------------------------
// Local mean spacing and the finite-height scaling time tau_*(T) = delta^2/(8 nu) = 2 pi^2 / log^2(T/2pi) (official units)
// ---------------------------------------------------------------------------------------------------------------------
export const meanSpacing = (T) => (2 * PI) / Math.log(T / (2 * PI));
export const tauStar = (T) => (2 * PI * PI) / Math.log(T / (2 * PI)) ** 2;
// GUE (Wigner surmise, beta = 2) spacing CDF and the small-theta scaling function Psi_2(theta) ~ (2 pi^2/9) theta^{3/2}
export const wignerGueCdf = (s) => erf((2 * s) / Math.sqrt(PI)) - ((4 * s) / PI) * Math.exp((-4 * s * s) / PI);
export const psiGueLeading = (theta) => ((2 * PI * PI) / 9) * theta ** 1.5;
function erf(x) { // Abramowitz-Stegun 7.1.26 (|err| < 1.5e-7), adequate for the model CDF
  const s = Math.sign(x); const a = Math.abs(x); const t = 1 / (1 + 0.3275911 * a);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
  return s * y;
}

export const RH_SUPERCRITICAL_FLUID_BRIDGE = Object.freeze({
  id: 'rh-supercritical-fluid-bridge-2026-09-24',
  date: '2026-09-24',
  title: 'The de Bruijn / twin-ladder bridge as a viscous Burgers fluid with critical point Lambda',
  status: 'exact reframe (Cole-Hopf + viscosity dictionary + shock identity) with GUE-conditional equation of state; changes no bound',
  rhStatus: 'open',
  newBound: false,
  lambdaBracket: Object.freeze({ lower: 0, lowerBy: 'Rodgers-Tao 2020', upper: 0.2, upperBy: 'Platt-Trudgian 2021' }),
  coleHopf: Object.freeze({
    heatPotential: 'theta(x,tau) = H(x,-tau) (the de Bruijn function itself), theta_tau = nu theta_xx, nu = 1/4 in ordinate units',
    field: 'w = -2 nu d_x log H = (1/2) sum_j 1/(z_j - x) = (N/2) m_N  (Stieltjes / log-derivative field)',
    equationBackward: 'w_tau + w w_x = nu w_xx  (viscous Burgers)',
    equationForward: 'v_t + 2 nu v v_x + nu v_xx = 0, v = H_x/H  (anti-viscous; fronts sharpen, complex pairs land)',
    zeroODE: 'dz_k/dt = 2 nu sum_{j != k} 1/(z_k - z_j) (paired sum over all zeros +-z_j; Hadamard product has no exponential factor since H is even of order 1)',
    inviscidLimit: 'Dyson-normalised m_N in Dyson time s = N tau_repo has nu = 1/N; dyson-burgers-shock.js PDE is nu -> 0',
    verified: 'exact H_t (mpmath dps 50): heat residual <= 1.6e-18, Burgers residual <= 6.7e-19 at five (x,t) points incl. t = -2 and t = +1.5',
  }),
  criticalPoint: Object.freeze({
    definition: 'Lambda = inf{t : H_t has only real zeros} = the time the last shock (complex pair) dissolves onto the real axis',
    orderParameter: 'phi(t) = fraction of non-real zeros (window-resolved phi(t;T) over |Re z| <= T); phi = 0 for t >= Lambda (single phase), phi > 0 for t < Lambda (two-phase)',
    dictionary: Object.freeze({
      'RH': 'phi(0) = 0  (Lambda <= 0; de Bruijn 1950)',
      'Rodgers-Tao 2020': 'phi(t) > 0 for every t < 0  (Lambda >= 0)',
      'RH <=> Lambda = 0': 'the critical point sits exactly at the boundary of the proved two-phase region',
      'single phase on [Lambda,0) with Lambda<0': 'would force a rigid picket-fence crystal (the only stationary real-rooted configuration); excluded by pair correlation (Rodgers-Tao)',
    }),
    shockStructure: 'real-zero collision = inviscid shock (double pole of v); conjugate pair a +- ib = viscous shock of thickness b, strength Delta = 4 nu / b, Delta * b = 4 nu exactly as b -> 0 (Taylor shock relation), b^2 = 2 nu (tau - tau_c) to leading order',
  }),
  equationOfState: Object.freeze({
    scalingForm: 'phi(t;T) = Psi_beta(theta), theta = |t| / tau_*(T), tau_*(T) = delta(T)^2/(8 nu) = 2 pi^2 / log^2(T/2 pi)',
    leadingLaw: 'Psi_beta(theta) ~ 2 c_beta theta^{(beta+1)/2} from gap CDF F_beta(s) ~ c_beta s^{beta+1} and the two-body law g_c = sqrt(8 nu |t|)',
    criticalExponent: Object.freeze({ poisson: 0.5, GOE: 1, GUE: 1.5, GSE: 2.5, formula: '(beta + 1)/2' }),
    gueAmplitude: 'Psi_2(theta) ~ (2 pi^2/9) theta^{3/2} - (4 pi^4/225) theta^{5/2} (sine-kernel small-s expansion)',
    manyBodyCorrection: 'tau_c = (g^2/(8 nu))(1 + kappa (g/delta)^2 + ...), kappa ~ 0.6-0.7 measured on the exact flow; vanishes in the critical (g -> 0) limit so the exponent is unaffected',
    finiteSizeScaling: 'tau_*(T) ~ log^-2 T is the finite-size shift; pseudo-critical points t_c(T) = -min tau_c -> 0^- (repo a = 0; Lehmer-pair ladder -50, -5, -0.385, -0.0991, -4.4e-6, -2.7e-9, -1.15e-11 by CNV 1988, te Riele 1991, NRV 1992, CRV 1991, COSV 1993, Odlyzko 2000, SGD 2011)',
    thermodynamicLimit: 'at fixed t < 0, phi(t;T) -> 1 as T -> oo: the infinite-height order parameter is the step 1_{t<Lambda} (boiling-point type), the continuous coexistence curve is a finite-height object',
    relationToRepoSurrogate: 'tau_*(T) in official units = (pi/4) x the finite-N Burgers surrogate 2 pi / log^2(gamma_N/2pi) of dyson-burgers-shock.js after the tau_repo -> t = -4 tau_repo conversion (same log^-2 law)',
  }),
  exactFlow: EXACT_FLOW,
  modelEos: MODEL_EOS,
  zetaWindowEos: ZETA_WINDOW_EOS,
  g6FirstPair: G6_FIRST_PAIR,
  honestNote: Object.freeze({
    rigorous: [
      'Cole-Hopf: the backward de Bruijn flow is the viscous Burgers equation for w = -2 nu d_x log H with nu = 1/4 (ordinates) / 1 (P15 z) / 1/N (Dyson-normalised); the heat flow is the regularizer of the inviscid Dyson-Burgers PDE',
      'zero ODE, two-body pair laws d(g^2)/dt = 8 nu, d(b^2)/dt = -2 nu, and the shock identity Delta * b = 4 nu for a pole pair',
      'critical-point / order-parameter dictionary: RH <=> phi(0) = 0; Rodgers-Tao <=> two-phase for all t < 0; Lambda in [0, 0.2]',
      'exact H_t numerics on [0,100]: first collision t = -0.881077 (so H_t has non-real zeros for t < -0.881077, a trivially weak but exact Lambda lower bound), staircase phi, many-body delay ratios 1.17-1.40',
    ],
    heuristic: [
      'the coexistence exponent (beta+1)/2 = 3/2 for zeta zeros needs GUE nearest-neighbour statistics at small s (Montgomery pair correlation, unproved); measured exponents on beta-Hermite samples and on the first 400 zeros are finite-sample fits',
      'the amplitude and the many-body kappa are measured, not derived',
    ],
    noLever: 'the two-phase side (t < 0) is fully known (Rodgers-Tao) and its finite-height pseudo-critical points converge to 0^- whether or not RH holds; RH is the statement about t = 0 at ALL heights, which no finite-height order-parameter measurement reaches. The Cole-Hopf linearisation returns the same heat equation; no new bound. No refereed bound is changed; RH open; NO QED.',
  }),
  sources: [
    'src/data/dyson-burgers-shock.js (inviscid Dyson-Burgers, finite-N surrogate 2 pi / log^2)',
    'src/data/bridge-lambda-rh.js (Lambda dictionary, Route B chain, G6 bridge gap)',
    'src/data/imp-34813-winding-monotonicity-rigor.js (Gaussian convolution = exact H at t = -4 tau_repo)',
    'src/math/rodgers-tao-de-bruijn-newman.js (H_t definition), src/math/dyson-scaling-N5000.js (Path-C backward ODE, nu_repo = 1)',
    'tmp/supercritical-bridge/exact_ht.py, tmp/supercritical-bridge/model_eos.py (offline solvers; outputs *_out.json)',
  ],
});

// ---------------------------------------------------------------------------------------------------------------------
// Assertions (self-executing; harness accepts holds())
// ---------------------------------------------------------------------------------------------------------------------
const NU = 0.25;
const TEST_ROOTS = [-3.1, -1.2, 0.4, 2.5, 3.3, 5.0];
const P0 = polyFromRoots(TEST_ROOTS);

export const RH_SUPERCRITICAL_FLUID_BRIDGE_ASSERTIONS = Object.freeze([
  {
    id: 'sfb-cole-hopf-burgers-identity-on-polynomial-flow',
    description: 'v = P_x/P of the exact polynomial heat flow P_t = e^{-nu t d^2} P_0 satisfies v_t + 2 nu v v_x + nu v_xx = 0 (equivalently w = -2 nu v solves w_tau + w w_x = nu w_xx) to FD precision',
    holds: () => {
      const x = 1.1, t = 0.3, h = 1e-6;
      const D = (c, tt) => { const P = heatFlowPoly(c, tt, NU); const P1 = polyDeriv(P), P2 = polyDeriv(P1), P3 = polyDeriv(P2);
        const p = polyEval(P, x), p1 = polyEval(P1, x), p2 = polyEval(P2, x), p3 = polyEval(P3, x);
        const v = p1 / p; return { v, vx: p2 / p - v * v, vxx: p3 / p - 3 * v * p2 / p + 2 * v ** 3 }; };
      const c = D(P0, t), vt = (D(P0, t + h).v - D(P0, t - h).v) / (2 * h);
      const res = Math.abs(vt + 2 * NU * c.v * c.vx + NU * c.vxx) / (Math.abs(vt) + Math.abs(2 * NU * c.v * c.vx) + Math.abs(NU * c.vxx));
      return res < 1e-6;
    },
  },
  {
    id: 'sfb-two-body-law-exact-for-a-pair',
    description: 'e^{-nu t d^2}(x^2 - a^2) = x^2 - a^2 - 2 nu t: gap^2 = 4a^2 + 8 nu t exactly, collision at t = -a^2/(2 nu) = -g^2/(8 nu)',
    holds: () => {
      const a = 0.61; const c = polyFromRoots([-a, a]);
      const P = heatFlowPoly(c, 0.37, NU);
      const g2 = -4 * P[0] / P[2];
      return Math.abs(g2 - (4 * a * a + 8 * NU * 0.37)) < 1e-12 && Math.abs(P[1]) < 1e-12;
    },
  },
  {
    id: 'sfb-zero-ode-matches-2nu-sum',
    description: 'dz_k/dt of the polynomial flow equals 2 nu sum_{j != k} 1/(z_k - z_j) (finite-difference root tracking, 6 roots)',
    holds: () => {
      const h = 1e-6;
      const rp = realRootsOnInterval(heatFlowPoly(P0, h, NU), -4, 6), rm = realRootsOnInterval(heatFlowPoly(P0, -h, NU), -4, 6);
      if (rp.length !== 6 || rm.length !== 6) return false;
      for (let k = 0; k < 6; k++) {
        const vel = (rp[k] - rm[k]) / (2 * h);
        let s = 0; for (let j = 0; j < 6; j++) if (j !== k) s += 1 / (TEST_ROOTS[k] - TEST_ROOTS[j]);
        if (Math.abs(vel - 2 * NU * s) > 1e-4 * (1 + Math.abs(vel))) return false;
      }
      return true;
    },
  },
  {
    id: 'sfb-viscosity-dictionary-consistent',
    description: 'nu_x = 1/4 <=> nu_z = 1 under z = 2x; tau_repo = -t/4 <=> nu_repo = 1 (imp-34813 literal -4); Dyson time s = N tau_repo gives nu = 1/N',
    holds: () => VISCOSITY_DICTIONARY.ordinates.nu === VISCOSITY_DICTIONARY.officialZ.nu / 4
      && VISCOSITY_DICTIONARY.timeConversion_t_official_over_tau_repo === -1 / VISCOSITY_DICTIONARY.ordinates.nu
      && VISCOSITY_DICTIONARY.repoPathC.nu === 1 && VISCOSITY_DICTIONARY.dysonNormalised.nu === '1/N',
  },
  {
    id: 'sfb-exact-flow-normalisation-and-residuals',
    description: 'exact H(x,0) = xi(1/2+ix)/8 to <= 1e-20 up to x = 100; heat and Burgers residuals <= 2e-18 at all five probe points',
    holds: () => EXACT_FLOW.normalisationRelErr.every(([, e]) => e < 1e-20)
      && EXACT_FLOW.coleHopfResiduals.every(([, , hr, br]) => hr < 2e-18 && br < 2e-18),
  },
  {
    id: 'sfb-first-collision-consistent-with-staircase',
    description: 'exact first collision tau_c1 = 0.881077 lies between the last phi = 0 row (tau = 0.8) and the first phi = 2/29 row (tau = 0.95); staircase phi is non-decreasing while nTotal = 29 and matches (nTotal - nReal)/nTotal',
    holds: () => {
      const rows = EXACT_FLOW.orderParameterWindow100; const tc = EXACT_FLOW.pairCollisions[0].tauExact;
      const lastZero = rows.filter((r) => r[3] === 0).at(-1)[0], firstPos = rows.find((r) => r[3] > 0)[0];
      if (!(lastZero < tc && tc < firstPos)) return false;
      for (let i = 0; i < rows.length; i++) {
        const [, nReal, nTot, phi] = rows[i];
        if (Math.abs(phi - (nTot - nReal) / nTot) > 1e-12) return false;
        if (i > 0 && nTot === 29 && rows[i - 1][2] === 29 && phi < rows[i - 1][3]) return false;
      }
      return EXACT_FLOW.windowLowerBoundOnLambda === -tc;
    },
  },
  {
    id: 'sfb-many-body-delay-ratios',
    description: 'exact/two-body collision-time ratio > 1 (many-body DELAY) and < 1.5 for all six closest low pairs; ratio is the baked quotient; kappa = (ratio-1)/(g/delta)^2 in [0.55, 0.72]',
    holds: () => EXACT_FLOW.pairCollisions.every((p) => {
      const g = p.gammaR - p.gammaL; const d = meanSpacing(0.5 * (p.gammaL + p.gammaR));
      const kappa = (p.ratio - 1) / (g / d) ** 2;
      return p.ratio > 1 && p.ratio < 1.5 && Math.abs(p.ratio - p.tauExact / p.tauTwoBody) < 1e-9
        && Math.abs(p.tauTwoBody - (g * g) / 2) < 1e-6 && kappa > 0.55 && kappa < 0.72;
    }),
  },
  {
    id: 'sfb-shock-identity-and-pair-law-at-birth',
    description: 'complex pair born at tau_c1: b^2/(2 nu (tau - tau_c)) -> 1 (1.010 at dtau = 0.05) and Delta * b -> 4 nu = 1 (0.990 at dtau = 0.05); both deviations grow monotonically with b',
    holds: () => {
      const rows = EXACT_FLOW.complexPairShockLaw;
      if (Math.abs(rows[0][3] - 1) > 0.011 || Math.abs(rows[0][4] - 1) > 0.011) return false;
      for (let i = 1; i < rows.length; i++) if (!(rows[i][3] > rows[i - 1][3] && rows[i][2] > rows[i - 1][2])) return false;
      return rows.filter((r) => r[4] !== null).every((r, i, a) => i === 0 || r[4] < a[i - 1][4]);
    },
  },
  {
    id: 'sfb-scaling-time-and-repo-surrogate-relation',
    description: 'tau_*(T) = delta^2/(8 nu) = 2 pi^2/log^2(T/2pi); relation to the repo surrogate 2 pi/log^2 is exactly pi/4 after the t = -4 tau_repo conversion',
    holds: () => {
      const T = 1e6; const d = meanSpacing(T);
      const surrogateOfficial = 4 * (2 * PI) / Math.log(T / (2 * PI)) ** 2;
      return Math.abs(tauStar(T) - d * d / (8 * NU)) < 1e-15 && Math.abs(tauStar(T) / surrogateOfficial - PI / 4) < 1e-12;
    },
  },
  {
    id: 'sfb-honesty-tripwires',
    description: 'no bound claimed; RH open; Lambda bracket [0, 0.2]; exponent flagged heuristic',
    holds: () => RH_SUPERCRITICAL_FLUID_BRIDGE.newBound === false && RH_SUPERCRITICAL_FLUID_BRIDGE.rhStatus === 'open'
      && RH_SUPERCRITICAL_FLUID_BRIDGE.lambdaBracket.lower === 0 && RH_SUPERCRITICAL_FLUID_BRIDGE.lambdaBracket.upper === 0.2
      && RH_SUPERCRITICAL_FLUID_BRIDGE.honestNote.heuristic.some((s) => s.includes('unproved')),
  },
  {
    id: 'sfb-model-exponents-order-as-beta-plus-one-over-two',
    description: 'pooled-gap small-phi exponents within 0.16 of (beta+1)/2 for Poisson/GOE/GUE/GSE, gap-CDF exponents within 0.08 of beta+1 where measured; flow-measured effective exponents strictly increase with beta and flow phi <= two-body phi at every tau',
    holds: () => {
      const P = MODEL_EOS.pooledGaps, E = MODEL_EOS.ensembles;
      const names = ['poisson', 'GOE', 'GUE', 'GSE'];
      if (!names.every((n) => Math.abs(P[n].phiExponentSmallPhi - P[n].predicted) < 0.16)) return false;
      if (!names.every((n) => P[n].gapCdfExponent === null || Math.abs(P[n].gapCdfExponent - P[n].predictedGapCdf) < 0.08)) return false;
      for (let i = 1; i < names.length; i++) if (!(E[names[i]].effectiveExponentFlow > E[names[i - 1]].effectiveExponentFlow)) return false;
      return names.every((n) => E[n].phi.every((p, i) => p <= E[n].phiTwoBody[i] + 1e-12));
    },
  },
  {
    id: 'sfb-zeta-window-eos-consistency',
    description: 'zeta window: phi rows equal (312 - nReal)/312; phi = 0 through tau = 0.06 and first collision by tau = 0.1; flow phi <= two-body phi everywhere and strictly below from tau = 0.22; effective exponent in (1.5, 2.0)',
    holds: () => {
      const R = ZETA_WINDOW_EOS.rows;
      if (!R.every(([, nReal, phi]) => Math.abs(phi - (312 - nReal) / 312) < 1e-12)) return false;
      if (!(R.filter((r) => r[0] <= 0.06).every((r) => r[2] === 0) && R.find((r) => r[0] === 0.1)[2] > 0)) return false;
      if (!R.every((r) => r[2] <= r[3] + 1e-12) || !R.filter((r) => r[0] >= 0.22).every((r) => r[2] < r[3])) return false;
      return ZETA_WINDOW_EOS.effectiveExponentFlow > 1.5 && ZETA_WINDOW_EOS.effectiveExponentFlow < 2.0;
    },
  },
  {
    id: 'sfb-g6-truncated-flow-converges-to-exact-collision',
    description: 'truncated N-zero flow collision times increase monotonically in N towards the exact H_t value from below; the frozen-tail variant is closer at every N and within 5e-6 relative at N = 1200; two-body < all truncated values',
    holds: () => {
      const G = G6_FIRST_PAIR, T = G.truncated, ex = G.exactHt;
      for (let i = 0; i < T.length; i++) {
        const { N, tau, tauFrozenTail, S_N } = T[i];
        if (!(tau < ex && tauFrozenTail <= ex + 1e-9 && Math.abs(tauFrozenTail - ex) < Math.abs(tau - ex))) return false;
        if (i > 0 && !(tau > T[i - 1].tau && N > T[i - 1].N && S_N < T[i - 1].S_N)) return false;
        if (!(G.twoBody < tau)) return false;
      }
      return Math.abs(T.at(-1).tauFrozenTail - ex) / ex < 5e-6 && Math.abs(G.exactHt - EXACT_FLOW.pairCollisions[0].tauExact) < 1e-9;
    },
  },
]);
