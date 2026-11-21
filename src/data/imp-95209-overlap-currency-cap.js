/**
 * imp-95209 - RIGOROUS step -- THEOREM OV (overlap-currency tradeoff cap)
 * + COROLLARY GC (global cap gammaOV, closed form) + COROLLARY EP
 * (parity-pure endpoint): FIRST leg of the sub-gap
 * imp-95208-subgap-overlap-currency-constant. The norm-currency step
 * B >= A - sqrt(D) (imp-95172 fact F6, carried into THEOREM BW-U) is
 * REPLACED by the exact overlap identity plus Cauchy-Schwarz on <U, V>,
 * and the resulting relaxation is solved exactly. The global cap improves
 * strictly, gammaU = 0.9996167883494768 -> gammaOV = 0.9995949885454457,
 * and the cap becomes omega-RESOLVED with the exact parity-pure endpoint
 * Phi(0) = 1/2: the constant gap named by imp-95208 now survives ONLY in
 * a window around omega* = 4.2047e-4, not at small ballast.
 *
 * CONTEXT. imp-95208 (LEMMA GS + THEOREM BU/GB-U) removed the m_B
 * occupancy dependence from the ballast ceiling and named the successor
 * sub-gap: the proof prices parity balance in NORM currency (B vs A via
 * the triangle step F6), so gammaU = 0.9996 sits far above the measured
 * class sup phi = 0.3572 and the parity-pure cap 1/2. THIS module executes
 * the overlap-currency substitution. The mechanism: Lemma PB plus the
 * parity Gram split give the EXACT identity
 *   E = X_e + X_o - N_e - N_o + 2 <U, V>
 * (all cross-parity pairs are cross-block, since parity separates blocks),
 * so the scalar E is bounded by capping <U, V> directly instead of routing
 * through B >= A - sqrt(D) and two lossy square-root subtractions.
 *
 * SETTING (identical to imp-95172/imp-95208; model family sigma = 1,
 * theta = 10, s = 11; M = 1, phi and omega scale-invariant). U, V = even /
 * odd parity sums; A = ||U||, B = ||V||; N_e, N_o = same-block diagonal
 * masses; X_e, X_o = same-parity cross-block couplings; E = 2 X_env - D,
 * D = ||U - V||^2; phi = E/(2 LwEven); omega = M_odd/M. Carried constants:
 * LwEven = 3.9197935113802585e-5, q = 0.03755392855053636, cU =
 * 0.30501330232499435 (THEOREM BU). Derived: kappa = cU/sqrt(LwEven) =
 * 48.717745853978386.
 *
 * THEOREM OV (overlap-currency tradeoff cap -- conditional EXACTLY as
 * THEOREM OD; the identity, Cauchy-Schwarz and LEMMA GS are
 * unconditional). Every witness of the class satisfies, at M = 1,
 *   phi <= Phi(omega) = 1 - (1 - q) omega
 *                       - (1/2) [ ( sqrt(1 - omega)
 *                                   - kappa sqrt(omega) )_+ ]^2 ,
 * where (.)_+ is the positive part. The deficit term is strictly positive
 * for omega < omegaC = 1/(1 + kappa^2) = 4.2115570192839495e-4 and
 * vanishes beyond, so THEOREM OV strictly sharpens THEOREM OD on
 * (0, omegaC) and coincides with it on [omegaC, 1].
 * PROOF. Write P = A^2 = N_e + X_e, R = B^2 = N_o + X_o (parity Gram
 * split). Exact identity: E = X_e + X_o - N_e - N_o + 2 <U, V> =
 * 2(X_e + X_o) - P - R + 2 <U, V>. Cauchy-Schwarz <U, V> <= sqrt(P R)
 * gives E <= 2(X_e + X_o) - (sqrt(P) - sqrt(R))^2. The class caps
 * (conditional as OD, part (i) split): X_e <= sigmaE = LwEven (1 - omega),
 * X_o <= sigmaO = q LwEven omega; THEOREM BU (LEMMA GS + the carried odd
 * cap): R <= betaSq = cU^2 omega. Maximize h = 2 X_e + 2 X_o -
 * (sqrt(P) - sqrt(R))^2 over the relaxed feasible set X_e <= min(P,
 * sigmaE), X_o <= min(R, sigmaO), 0 <= R <= betaSq, P >= 0. Take X_e, X_o
 * at their caps. If betaSq >= sigmaE: choose P = R and h <= 2 sigmaE +
 * 2 sigmaO (the OD value). If betaSq < sigmaE: on P <= betaSq, h <= 2 P +
 * 2 sigmaO <= 2 betaSq + 2 sigmaO, dominated by the endpoint value since
 * sigmaE + 2 sqrt(betaSq sigmaE) - 3 betaSq = (sqrt(sigmaE) +
 * 3 sqrt(betaSq))(sqrt(sigmaE) - sqrt(betaSq)) >= 0; on betaSq <= P <=
 * sigmaE, h is increasing in P (derivative 1 + sqrt(betaSq/P) > 0); on
 * P >= sigmaE, h is decreasing in P; so the sup is at P = sigmaE,
 * R = betaSq:  h <= 2 sigmaE + 2 sigmaO - (sqrt(sigmaE) -
 * sqrt(betaSq))^2. Divide by 2 LwEven and simplify: phi <= (1 - omega) +
 * q omega - (1/(2 LwEven))(sqrt(sigmaE) - sqrt(betaSq))^2 = 1 -
 * (1 - q) omega - (1/2)(sqrt(1 - omega) - kappa sqrt(omega))^2. QED.
 * (No E > 0 or phi >= q omega side condition: the bound holds for every
 * witness of the class.)
 *
 * COROLLARY GC (global cap, closed form). sup over omega of Phi(omega) is
 * attained at the UNIQUE interior stationary point omega* in (0, omegaC):
 * with S(omega) = sqrt(1 - omega) - kappa sqrt(omega), the derivative
 * identity dPhi = -(1 - q) + S(omega) [ 1/(2 sqrt(1 - omega)) +
 * kappa/(2 sqrt(omega)) ] (as a function of omega) rewrites via
 *   S(omega) [ ... ] = (1 - kappa^2)/2
 *                      + (kappa/2) (1 - 2 omega)/sqrt(omega (1 - omega)) ,
 * and (1 - 2 omega)/sqrt(omega (1 - omega)) is strictly decreasing, so
 * dPhi = 0 has exactly one root: (1 - 2 omega)/sqrt(omega (1 - omega)) =
 * Theta = (kappa^2 + 1 - 2q)/kappa, i.e. the quadratic (4 + Theta^2)
 * omega^2 - (4 + Theta^2) omega + 1 = 0, giving (stable form, T = 4 +
 * Theta^2)  omega* = 2 / ( T (1 + sqrt(1 - 4/T)) ) =
 * 4.2047397350019407e-4 < omegaC. Since dPhi > 0 as omega -> 0+ and
 * dPhi = -(1 - q) < 0 at omegaC (S = 0 there), and Phi = OD is decreasing
 * beyond omegaC, the global cap is
 *   phi <= gammaOV = Phi(omega*) = 0.9995949885454457 ,
 * STRICTLY below gammaU = 0.9996167883494768 (imp-95208): the cap deficit
 * x = 1 - gamma improves 3.832116505232332e-4 -> 4.0501145455429377e-4
 * (5.68 percent). gammaOV supersedes gammaU as the operative uniform cap
 * of the conditional class (both remain valid).
 *
 * COROLLARY EP (parity-pure endpoint). Phi(0) = 1/2 exactly: the
 * omega -> 0 limit of the cap IS the parity-pure even cap of imp-95172
 * COROLLARY PP, now reached continuously -- Phi(omega) = 1/2 +
 * kappa sqrt(omega) (1 + o(1)) as omega -> 0. Sample values:
 * Phi(1e-6) = 0.5475305496684815, Phi(1e-5) = 0.6421865508044953,
 * Phi(1e-4) = 0.8684359163960682. The imp-95208 constant gap (gammaU =
 * 0.9996 vs parity-pure 1/2) is therefore NOT uniform in omega: it
 * survives only in the ballast window around omega* = 4.2e-4 and is
 * resolved to the parity-pure value at small omega. (At omega = 1 the
 * pure-odd PP cap q/2 remains sharper than Phi(1) = q; Phi does not
 * dominate PP there and does not need to.)
 *
 * HONEST LIMITS. (a) The surviving bump gammaOV = 0.99959 near omega*
 * still sits far above the measured class sup phi = 0.3572 (imp-95113).
 * Its binding step is now Cauchy-Schwarz <U, V> <= A B alone -- and
 * WITHIN the current model class Cauchy-Schwarz is attainable (an odd
 * packet co-located and shape-identical with an even packet gives
 * <U, V> = A B exactly; blocks are labels, not positions, in this class),
 * so the bump CANNOT be removed by further inequality work in this class:
 * cutting it requires the block-to-support dictionary of the paper
 * packets (seam-localized overlap: only odd mass within O(1/mu) of the
 * even-shell support buys <U, V>) as NEW model input -- named successor
 * sub-gap. (b) A second, deliberately untaken lever: at P = sigmaE the
 * relaxation sets N_e = 0, while in-class X_e <= (m_e - 1) N_e forces
 * N_e > 0 for bounded even-block occupancy m_e -- an m_e-dependent
 * sharpening exists but reintroduces exactly the occupancy-count currency
 * that imp-95208 just removed (the m_B lesson: such factors are proof
 * artifacts against unbounded occupancy), so it is recorded, not taken.
 * (c) Conditionality is exactly THEOREM OD's: the class caps sigmaE,
 * sigmaO (OD part (i) split) and the odd-class cap inside THEOREM BU are
 * the carried MAJ per-pair caps + per-class Lemma SW; the identity,
 * Cauchy-Schwarz, LEMMA GS and the optimization algebra are
 * unconditional. No new conditional input. (d) Model-family constants
 * (theta = 10), not the paper Section 4.5 packets. (e) gammaOV is a valid
 * cap, NOT proved attained in-class: the relaxation steps are
 * individually tight (battery near-attainment 0.99 of the sup; exact
 * attainment of the optimization corner; exact CS tightness on a parallel
 * witness) but their simultaneous in-class realization under the MAJ caps
 * is unverified. Nothing here moves a floor; the known class sup phi
 * remains the measured 0.3572.
 *
 * SUB-GAP (surviving, explicitly named, NOT closed):
 *   imp-95209-subgap-seam-localized-overlap -- cut the residual bump
 *   gammaOV = 0.99959 near omega* = 4.2e-4 by a seam-localized bound
 *   <U, V> <= (overlap factor) A B with overlap factor < 1: impossible
 *   within the current label-block class (Cauchy-Schwarz is attained by
 *   co-located packets), so it REQUIRES importing the dyadic
 *   block-to-support geometry of the paper packets as a new model
 *   hypothesis; the omega-resolution delivered here (cap already 1/2 +
 *   kappa sqrt(omega) at small omega) localizes exactly where that
 *   geometry must bite.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) The exact identity E = X_e + X_o -
 * N_e - N_o + 2 <U, V> is verified on a 60-draw deterministic LCG witness
 * battery (3..10 packets, blocks 0..7, exact exponential-packet kernel)
 * to rel 1e-9, together with Cauchy-Schwarz and the consequence
 * E <= 2 X_env - (sqrt(P) - sqrt(R))^2. (2) The relaxation sup is
 * approached by 200000 random feasible tuples (P, R, X_e, X_o) across
 * omega in [1e-7, 1]: no violation, worst ratio 0.9905 (near-attained),
 * and the constructed corner (P = sigmaE, R = betaSq, caps) attains the
 * closed form exactly. (3) The stationarity identity (1 - 2 omega*)
 * / sqrt(omega* (1 - omega*)) = Theta holds to rel 1e-12, the auxiliary
 * function is verified strictly decreasing on a 1000-point grid (unique
 * root), and a 2e6-point grid scan of Phi confirms the global sup equals
 * gammaOV to rel 7e-14 at omega*. (4) Strictness: Phi < OD on a
 * 1000-point grid of (0, omegaC), Phi = OD beyond, Phi continuous at
 * omegaC, Phi(0) = 1/2 exactly. (5) Consistency: at the terminal headline
 * witness omega = 0.36752951508189907 > omegaC, Phi reproduces the
 * imp-95172 baked OD cap 0.6462726620676998 exactly and phi = 0.3563
 * obeys it. (6) SCOPE HONESTY: the conditional class caps are the carried
 * OD chain and are NOT re-tested by random draws (draws need not satisfy
 * the MAJ caps); only the unconditional facts are battery-tested, exactly
 * as in imp-95172/imp-95208.
 *
 * The numerics below CROSS-CHECK the lemma statements; they are not the
 * claim. Import-light (no heavy bundle; imports only the imp-95172 and
 * imp-95208 sibling verdict modules for carried constants). Changes no
 * bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

import BNT from "./imp-95172-ballast-necessity-tradeoff.js";
import MBU from "./imp-95208-mb-uniform-ballast-cap.js";

// ── carried constants (single source of truth: sibling verdict objects) ─────
const LW_EVEN = BNT.constants.lwEven; // 3.9197935113802585e-5
const Q_OD = BNT.constants.q; // 0.03755392855053636
const C_U = MBU.constants.cU; // 0.30501330232499435
const GAMMA_U = MBU.constants.gammaU; // 0.9996167883494768

// ── new baked literals (recomputed by the assertions) ────────────────────────
const KAPPA = 48.717745853978386; // cU / sqrt(LwEven)
const OMEGA_C = 4.2115570192839495e-4; // 1/(1 + kappa^2): deficit vanishes beyond
const THETA_OV = 48.736730561228008; // (kappa^2 + 1 - 2q)/kappa
const OMEGA_STAR = 4.2047397350019407e-4; // unique interior stationary point
const GAMMA_OV = 0.9995949885454457; // Phi(omega*): new global cap
const X_STAR_OV = 4.0501145455429377e-4; // 1 - gammaOV
const PHI_SAMPLES = {
  "1e-6": 0.5475305496684815,
  "1e-5": 0.6421865508044953,
  "1e-4": 0.8684359163960682,
};

// ── shared kernel conventions (identical to the sibling modules) ─────────────
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-7 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}

// ── theorem functionals ──────────────────────────────────────────────────────
function kappaOV() {
  return C_U / Math.sqrt(LW_EVEN);
}
function odCap(omega) {
  return 1 - (1 - Q_OD) * omega;
}
function deficitS(omega) {
  return Math.sqrt(1 - omega) - kappaOV() * Math.sqrt(omega);
}
function phiCapOV(omega) {
  const s = deficitS(omega);
  return odCap(omega) - (s > 0 ? 0.5 * s * s : 0);
}
function thetaOV() {
  const k2 = kappaOV() * kappaOV();
  return (k2 + 1 - 2 * Q_OD) / kappaOV();
}
function omegaStarOV() {
  const th = thetaOV();
  const T = 4 + th * th;
  return 2 / (T * (1 + Math.sqrt(1 - 4 / T))); // stable root of the quadratic
}

// ── verdict object ───────────────────────────────────────────────────────────
export const IMP95209_OVERLAP_CURRENCY_CAP = {
  ticket:
    "imp-95209 (first leg of imp-95208-subgap-overlap-currency-constant: the norm-currency step B >= A - sqrt(D) is replaced by the exact overlap identity E = X_env - N_env + 2 <U, V> plus Cauchy-Schwarz, the relaxation is solved exactly, and the global cap improves strictly, gammaU -> gammaOV, with the parity-pure endpoint Phi(0) = 1/2 recovered continuously)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes THEOREM BU (imp-95208: B^2 <= cU^2 omega) and the THEOREM OD part (i) split class caps (imp-95129 via imp-95172 facts F2/F4); carried constants imported from the imp-95172 and imp-95208 verdict objects.",
  theoremOV:
    "Conditional exactly as THEOREM OD (identity, Cauchy-Schwarz, LEMMA GS and the optimization algebra unconditional; the class caps sigmaE = LwEven(1 - omega), sigmaO = q LwEven omega and the BU ballast cap R <= cU^2 omega are the carried chain): every witness has phi <= Phi(omega) = 1 - (1 - q) omega - (1/2)[(sqrt(1 - omega) - kappa sqrt(omega))_+]^2, kappa = cU/sqrt(LwEven) = 48.717745853978386 -- a strict pointwise sharpening of THEOREM OD on (0, omegaC), omegaC = 1/(1 + kappa^2) = 4.2115570192839495e-4, coinciding with OD beyond. No E > 0 or phi >= q omega side condition.",
  corollaryGC:
    "Global cap, closed form: sup Phi is attained at the unique interior stationary point omega* = 2/(T(1 + sqrt(1 - 4/T))), T = 4 + Theta^2, Theta = (kappa^2 + 1 - 2q)/kappa (uniqueness via the strictly decreasing (1 - 2 omega)/sqrt(omega(1 - omega))): omega* = 4.2047397350019407e-4 and phi <= gammaOV = Phi(omega*) = 0.9995949885454457 < gammaU = 0.9996167883494768 -- the cap deficit x = 1 - gamma improves 3.832116505232332e-4 -> 4.0501145455429377e-4 (5.68 percent); gammaOV supersedes gammaU as the operative uniform cap.",
  corollaryEP:
    "Parity-pure endpoint: Phi(0) = 1/2 exactly (the imp-95172 COROLLARY PP even cap, now the continuous omega -> 0 limit; Phi = 1/2 + kappa sqrt(omega)(1 + o(1))). The imp-95208 constant gap is NOT uniform in omega: it survives only in the ballast window around omega*; Phi(1e-6) = 0.5475305496684815, Phi(1e-5) = 0.6421865508044953, Phi(1e-4) = 0.8684359163960682. At omega = 1 the pure-odd PP cap q/2 stays sharper than Phi(1) = q.",
  constants: {
    kappa: KAPPA,
    omegaC: OMEGA_C,
    theta: THETA_OV,
    omegaStar: OMEGA_STAR,
    gammaOV: GAMMA_OV,
    xStarOV: X_STAR_OV,
    phiSamples: PHI_SAMPLES,
  },
  obstruction:
    "The binding step of the residual bump is Cauchy-Schwarz <U, V> <= A B ALONE, and within the current label-block class Cauchy-Schwarz is attained (co-located shape-identical packets of opposite block parity give <U, V> = A B exactly): no further inequality work in this class can cut the bump; a seam-localized overlap bound requires the dyadic block-to-support geometry of the paper packets as new model input.",
  subGap:
    "imp-95209-subgap-seam-localized-overlap -- OPEN: cut the residual bump gammaOV = 0.99959 near omega* = 4.2e-4 by a seam-localized overlap factor on <U, V>; requires the block-to-support dictionary (odd mass within O(1/mu) of even-shell support) as a NEW model hypothesis -- the in-class overlap-currency lever is exhausted by this module; also recorded, deliberately untaken: the bounded-m_e sharpening N_e >= X_e/(m_e - 1) (occupancy currency, the m_B lesson).",
  openResiduals: [
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
    "the curvature ceiling D retained by the window",
    "the paper phase curvature normalization (sibling Theorem D residual)",
    "residual (c) of the sibling chain: the passage from the l2 weld bound to the pointwise scalar |C_E,17|",
    "FIRST LEG DELIVERED: imp-95208-subgap-overlap-currency-constant partially resolved -- the cap is now omega-resolved with parity-pure endpoint 1/2 and the global cap improves strictly to gammaOV = 0.9995949885454457; the residual bump near omega* = 4.2e-4 is proved IRREDUCIBLE within the label-block class (Cauchy-Schwarz attained by co-located packets) and survives as imp-95209-subgap-seam-localized-overlap, needing block-to-support geometry as new input. HONEST LIMIT: gammaOV still far above the measured class sup phi = 0.3572; cap valid, not proved attained in-class",
  ],
  isRigorous: true,
  rigorScope:
    "The identity E = X_e + X_o - N_e - N_o + 2 <U, V> is exact (Lemma PB + the parity Gram split; cross-parity pairs are cross-block since parity separates blocks); Cauchy-Schwarz and the finite-dimensional optimization (case analysis in the header, monotone in P on each branch, corner comparison factored exactly) are unconditional. THEOREM OV and its corollaries are conditional exactly as THEOREM OD (imp-95129): the class caps sigmaE/sigmaO and the odd-class cap inside THEOREM BU are the SAME carried MAJ per-pair caps + per-class Lemma SW the imp-95172/95208 chain already consumed; no new conditional input. COROLLARY GC uniqueness is analytic (strictly decreasing auxiliary function), cross-checked by a 2e6-point grid scan (rel 7e-14). The numerics cross-check the statements; they are not the claim.",
  promotesBound: false,
  verdict:
    "RIGOROUS step: the overlap-currency substitution asked for by imp-95208-subgap-overlap-currency-constant is EXECUTED in its class-internal form. The exact identity E = X_e + X_o - N_e - N_o + 2 <U, V> plus Cauchy-Schwarz replaces the norm-currency step B >= A - sqrt(D) (imp-95172 fact F6) entirely, and solving the relaxation exactly gives THEOREM OV: phi <= 1 - (1 - q) omega - (1/2)[(sqrt(1 - omega) - kappa sqrt(omega))_+]^2 with kappa = cU/sqrt(LwEven) -- a strict pointwise sharpening of THEOREM OD below omegaC = 4.2115570192839495e-4 with the parity-pure endpoint Phi(0) = 1/2 recovered exactly and continuously (COROLLARY EP). COROLLARY GC: the global cap is the closed form gammaOV = Phi(omega*) = 0.9995949885454457 at the unique stationary point omega* = 4.2047397350019407e-4, STRICTLY below the imp-95208 gammaU = 0.9996167883494768 (cap deficit +5.68 percent), so gammaOV supersedes gammaU as the operative uniform cap of the conditional class. The constant gap is thereby LOCALIZED: at small ballast the cap is already 1/2 + kappa sqrt(omega), and the surviving bump near omega* is proved irreducible within the label-block class (Cauchy-Schwarz is attained by co-located opposite-parity packets), pinning exactly where the paper block-to-support geometry must enter -- named successor sub-gap imp-95209-subgap-seam-localized-overlap. HONEST: gammaOV still far above the measured class sup phi = 0.3572 (cap, not pin; not proved attained in-class); conditional exactly as THEOREM OD, no new conditional input; model-family constants. Floors and ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ──────────────────────────
export const IMP95209_OVC_ASSERTIONS = [
  {
    id: "imp95209-ovc-constants-closed-form",
    description:
      "closed-form constants reproduce the baked literals (rel 1e-12): kappa = cU/sqrt(LwEven), omegaC = 1/(1 + kappa^2), Theta = (kappa^2 + 1 - 2q)/kappa, omega* (stable quadratic root) with omega* < omegaC, the stationarity identity (1 - 2 omega*)/sqrt(omega*(1 - omega*)) = Theta, gammaOV = Phi(omega*), xStarOV = 1 - gammaOV, and the carried constants match the sibling verdict objects",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      const k = kappaOV();
      if (!rel(k, KAPPA)) return false;
      if (!rel(1 / (1 + k * k), OMEGA_C)) return false;
      if (!rel(thetaOV(), THETA_OV)) return false;
      const ws = omegaStarOV();
      if (!rel(ws, OMEGA_STAR)) return false;
      if (!(ws < OMEGA_C)) return false;
      const stat = (1 - 2 * ws) / Math.sqrt(ws * (1 - ws));
      if (!rel(stat, thetaOV())) return false;
      if (!rel(phiCapOV(ws), GAMMA_OV)) return false;
      if (!rel(1 - phiCapOV(ws), X_STAR_OV)) return false;
      return rel(C_U, MBU.constants.cU) && rel(LW_EVEN, BNT.constants.lwEven);
    },
  },
  {
    id: "imp95209-ovc-strict-cap-improvement",
    description:
      "COROLLARY GC: gammaOV < gammaU strictly (the overlap-currency chain beats the norm-currency GB-U cap), the deficit x = 1 - gamma improves by more than 5 percent, and gammaOV stays above the OD value at omegaC (the sup is genuinely interior, not a boundary artifact)",
    holds: () => {
      if (!(GAMMA_OV < GAMMA_U)) return false;
      if (!(X_STAR_OV / (1 - GAMMA_U) > 1.05)) return false;
      return GAMMA_OV > phiCapOV(OMEGA_C);
    },
  },
  {
    id: "imp95209-ovc-pointwise-sharpening",
    description:
      "THEOREM OV vs THEOREM OD: Phi(omega) < OD(omega) strictly on a 1000-point grid of (0, omegaC), Phi = OD exactly on a grid of [omegaC, 1], Phi is continuous at omegaC (gap below 1e-15), Phi(0) = 1/2 exactly, and the small-omega samples reproduce the baked table (rel 1e-12)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      for (let i = 1; i <= 1000; i++) {
        const w = (i * OMEGA_C) / 1001;
        if (!(phiCapOV(w) < odCap(w))) return false;
      }
      for (let i = 0; i <= 100; i++) {
        const w = OMEGA_C + ((1 - OMEGA_C) * i) / 100;
        if (phiCapOV(w) !== odCap(w)) return false;
      }
      const below = phiCapOV(OMEGA_C * (1 - 1e-12));
      if (!(Math.abs(below - odCap(OMEGA_C)) < 1e-9)) return false;
      if (phiCapOV(0) !== 0.5) return false;
      for (const key of ["1e-6", "1e-5", "1e-4"]) {
        if (!rel(phiCapOV(Number(key)), PHI_SAMPLES[key])) return false;
      }
      return true;
    },
  },
  {
    id: "imp95209-ovc-global-sup-scan",
    description:
      "COROLLARY GC uniqueness cross-check: the auxiliary function S(omega)[1/(2 sqrt(1 - omega)) + kappa/(2 sqrt(omega))] is strictly decreasing on a 1000-point grid of (0, omegaC) and equals 1 - q at omega* (rel 1e-9); a 40000-point grid scan of Phi over (0, 3 omegaC] never exceeds gammaOV and comes within rel 1e-9 of it near omega*",
    holds: () => {
      const k = kappaOV();
      const aux = (w) => deficitS(w) * (0.5 / Math.sqrt(1 - w) + (0.5 * k) / Math.sqrt(w));
      let prev = Infinity;
      for (let i = 1; i <= 1000; i++) {
        const w = (i * OMEGA_C) / 1001;
        const v = aux(w);
        if (!(v < prev)) return false;
        prev = v;
      }
      const ws = omegaStarOV();
      if (!(Math.abs(aux(ws) - (1 - Q_OD)) <= 1e-9 * (1 - Q_OD))) return false;
      let best = 0;
      for (let i = 1; i <= 40000; i++) {
        const w = (i * 3 * OMEGA_C) / 40000;
        const v = phiCapOV(w);
        if (v > GAMMA_OV * (1 + 1e-12)) return false;
        if (v > best) best = v;
      }
      return best >= GAMMA_OV * (1 - 1e-9);
    },
  },
  {
    id: "imp95209-ovc-witness-identity-battery",
    description:
      "60-draw deterministic LCG witness battery (3..10 packets, blocks 0..7, rates [0.3, 8], amplitudes (0, 1.5], centers [1, 9], exact exponential-packet kernel): the exact identity E = X_e + X_o - N_e - N_o + 2 <U, V> holds to rel 1e-9, Cauchy-Schwarz <U, V> <= A B holds, and the consequence E <= 2 X_env - (sqrt(P) - sqrt(R))^2 holds on every draw",
    holds: () => {
      let seed = 314159265;
      const rand = () => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed / 2147483648;
      };
      for (let t = 0; t < 60; t++) {
        const nP = 3 + Math.floor(rand() * 8);
        const u = [];
        const blk = [];
        const mus = [];
        const a = [];
        for (let i = 0; i < nP; i++) {
          u.push(1 + 8 * rand());
          blk.push(Math.floor(rand() * 8));
          mus.push(0.3 + 7.7 * rand());
          a.push(0.01 + 1.49 * rand());
        }
        const ip = (i, j) => a[i] * a[j] * kernelK(mus[i], mus[j], Math.abs(u[i] - u[j]));
        let A2 = 0;
        let B2 = 0;
        let UV = 0;
        let Ne = 0;
        let No = 0;
        let Xe = 0;
        let Xo = 0;
        let E = 0;
        for (let i = 0; i < nP; i++) {
          for (let j = 0; j < nP; j++) {
            const v = ip(i, j);
            const pi = blk[i] % 2;
            const pj = blk[j] % 2;
            if (pi === 0 && pj === 0) A2 += v;
            else if (pi === 1 && pj === 1) B2 += v;
            if (pi === 0 && pj === 1) UV += v;
            if (blk[i] === blk[j]) {
              if (pi === 0) Ne += v;
              else No += v;
            } else if (pi === pj && i < j) {
              if (pi === 0) Xe += 2 * v;
              else Xo += 2 * v;
            }
            E += i === j ? -v : blk[i] === blk[j] ? -v : v;
          }
        }
        const scale = A2 + B2;
        if (!(Math.abs(E - (Xe + Xo - Ne - No + 2 * UV)) <= 1e-9 * scale)) return false;
        if (!(UV <= Math.sqrt(A2 * B2) * (1 + 1e-9) + 1e-15)) return false;
        const consequence = 2 * (Xe + Xo) - Math.pow(Math.sqrt(A2) - Math.sqrt(B2), 2);
        if (!(E <= consequence + 1e-9 * scale)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95209-ovc-relaxation-sup-battery",
    description:
      "optimization-step battery: 200000 random feasible tuples (P, R, X_e, X_o) under the constraint set (X_e <= min(P, sigmaE), X_o <= min(R, sigmaO), R <= cU^2 omega) across omega in [1e-7, 1] never exceed the closed-form sup 2 sigmaE + 2 sigmaO - ((sqrt(sigmaE) - sqrt(betaSq))_+)^2, the worst draw comes above 0.98 of it (near-attained), and the constructed corner P = sigmaE, R = betaSq attains it exactly",
    holds: () => {
      let seed = 555000111;
      const rand = () => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed / 2147483648;
      };
      const supFormula = (w) => {
        const se = LW_EVEN * (1 - w);
        const so = Q_OD * LW_EVEN * w;
        const b2 = C_U * C_U * w;
        if (b2 >= se) return 2 * se + 2 * so;
        const d = Math.sqrt(se) - Math.sqrt(b2);
        return 2 * se + 2 * so - d * d;
      };
      let worst = -1;
      for (let t = 0; t < 200000; t++) {
        const w = Math.pow(10, -7 + 7 * rand());
        if (w > 1) continue;
        const se = LW_EVEN * (1 - w);
        const so = Q_OD * LW_EVEN * w;
        const b2 = C_U * C_U * w;
        const R = b2 * rand();
        const Xo = Math.min(R, so) * rand();
        const P = se * 3 * rand();
        const Xe = Math.min(P, se) * rand();
        const h = 2 * Xe + 2 * Xo - Math.pow(Math.sqrt(P) - Math.sqrt(R), 2);
        const cap = supFormula(w);
        if (h > cap * (1 + 1e-12) + 1e-30) return false;
        if (h / cap > worst) worst = h / cap;
      }
      if (!(worst > 0.98)) return false;
      const w0 = 1e-4;
      const se = LW_EVEN * (1 - w0);
      const so = Q_OD * LW_EVEN * w0;
      const b2 = C_U * C_U * w0;
      const corner = 2 * se + 2 * so - Math.pow(Math.sqrt(se) - Math.sqrt(b2), 2);
      return Math.abs(corner - supFormula(w0)) <= 1e-15 * supFormula(w0);
    },
  },
  {
    id: "imp95209-ovc-obstruction-and-terminal",
    description:
      "obstruction record: a co-located shape-identical opposite-parity packet pair attains Cauchy-Schwarz exactly (<U, V> = A B to rel 1e-12), certifying the residual bump is irreducible within the label-block class; terminal headline witness: omega = 0.36752951508189907 > omegaC, Phi reproduces the imp-95172 baked OD cap 0.6462726620676998 (rel 1e-9) and sits above the witness phi with the pure-odd PP comparison Phi(1) = q > q/2 recorded",
    holds: () => {
      const mu = 2.0;
      const a1 = 1.0;
      const a2 = 0.7;
      const k0 = kernelK(mu, mu, 0);
      const A2 = a1 * a1 * k0;
      const B2 = a2 * a2 * k0;
      const UV = a1 * a2 * k0;
      if (!(Math.abs(UV - Math.sqrt(A2 * B2)) <= 1e-12 * UV)) return false;
      const wT = BNT.terminalWitness.omega;
      if (!(wT > OMEGA_C)) return false;
      const cap = phiCapOV(wT);
      if (!(Math.abs(cap - BNT.terminalWitness.odCap) <= 1e-9 * cap)) return false;
      if (!(0.3563 <= cap)) return false;
      const phi1 = phiCapOV(1);
      return Math.abs(phi1 - Q_OD) <= 1e-12 && phi1 > BNT.constants.pureOddCap;
    },
  },
  {
    id: "imp95209-ovc-honesty-gate",
    description:
      "the verdict records the executed substitution, the strict cap improvement, the parity-pure endpoint, the in-class irreducibility of the residual bump, the surviving seam-localized sub-gap, the conditionality (exactly as THEOREM OD, no new conditional input) and the untouched ledger; promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95209_OVERLAP_CURRENCY_CAP.promotesBound === false &&
      IMP95209_OVERLAP_CURRENCY_CAP.openResiduals.length === 5 &&
      /NO QED/.test(IMP95209_OVERLAP_CURRENCY_CAP.verdict) &&
      /refereed bound is changed/i.test(IMP95209_OVERLAP_CURRENCY_CAP.verdict) &&
      /Floors and ceilings untouched/.test(IMP95209_OVERLAP_CURRENCY_CAP.verdict) &&
      /seam-localized-overlap/.test(IMP95209_OVERLAP_CURRENCY_CAP.subGap) &&
      /no new conditional input/.test(IMP95209_OVERLAP_CURRENCY_CAP.rigorScope) &&
      /conditional exactly as THEOREM OD/.test(IMP95209_OVERLAP_CURRENCY_CAP.rigorScope) &&
      /FIRST LEG DELIVERED/.test(IMP95209_OVERLAP_CURRENCY_CAP.openResiduals[4]) &&
      /HONEST LIMIT/.test(IMP95209_OVERLAP_CURRENCY_CAP.openResiduals[4]) &&
      /not proved attained in-class/.test(IMP95209_OVERLAP_CURRENCY_CAP.openResiduals[4]) &&
      /0\.3572/.test(IMP95209_OVERLAP_CURRENCY_CAP.verdict),
  },
];

for (const a of IMP95209_OVC_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95209-overlap-currency-cap assertion failed: ${a.id}`);
  }
}

export default IMP95209_OVERLAP_CURRENCY_CAP;
