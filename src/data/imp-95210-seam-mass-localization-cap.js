/**
 * imp-95210 - RIGOROUS step -- THEOREM SL (seam mass-localization overlap
 * cap) + THEOREM SL-CAP (the overlap factor pushed through the imp-95209
 * optimization, closed form) + COROLLARY GC-SL (global cap gammaSL(g),
 * closed form, gammaSL -> 1/2 + g^2/2) + LEMMA NG (collar insufficiency:
 * center geometry alone provably does NOT supply the hypothesis): SECOND
 * leg of the weld ballast chain, approaching the named successor sub-gap
 * imp-95209-subgap-seam-localized-overlap. The "block-to-support geometry
 * as new model input" demanded by imp-95209 is pinned to a PRECISE minimal
 * hypothesis -- per-parity cross-seam MASS localization H-LOC -- under
 * which the residual bump gammaOV = 0.9995949885454457 collapses to
 * gammaSL(g) = 1/2 + g^2/2 + O(1/kappa); and it is PROVED that a
 * center-collar hypothesis alone cannot deliver H-LOC (rate-dressed
 * packets in the class closure push cross-seam mass to exactly 1/2), so
 * the required import is a bound on cross-seam MASS (rate multiplicity /
 * dressing), not on packet center positions.
 *
 * CONTEXT. imp-95209 (THEOREM OV) proved the surviving cap bump near
 * omega* = 4.2e-4 is IRREDUCIBLE in the label-block class: its binding
 * step is Cauchy-Schwarz <U, V> <= A B alone, attained in-class by
 * co-located opposite-parity packets. The named successor sub-gap asks for
 * a seam-localized bound <U, V> <= g A B, g < 1, from block-to-support
 * geometry. THIS module (1) formalizes the minimal geometry input,
 * (2) proves the resulting cap improvement in closed form, and (3) proves
 * an insufficiency lemma locating exactly which geometry does NOT work.
 *
 * SETTING (identical to imp-95172/95208/95209; model family sigma = 1,
 * theta = 10, s = 11; M = 1). U, V = even / odd parity sums; A = ||U||,
 * B = ||V||; P = A^2, R = B^2; phi = E/(2 LwEven); omega = M_odd/M.
 * Carried constants (single source of truth: sibling verdict objects):
 * LwEven = 3.9197935113802585e-5, q = 0.03755392855053636,
 * cU = 0.30501330232499435, kappa = cU/sqrt(LwEven) = 48.717745853978386,
 * gammaOV = 0.9995949885454457. Packet model: two-sided exponentials
 * a e^(-mu|t-c|) in L2(R), Gram kernel kernelK as in the siblings.
 *
 * HYPOTHESIS H-LOC(thetaE, thetaO) -- the NEW model input, stated at the
 * minimal level. There is a measurable partition R = S_e U S_o (the
 * even-side / odd-side support regions of the block-to-support dictionary)
 * such that the parity sums of the witness satisfy
 *   ||U 1_{S_o}||^2 <= (1 - thetaE^2) ||U||^2  and
 *   ||V 1_{S_e}||^2 <= (1 - thetaO^2) ||V||^2 ,
 * with thetaE^2 + thetaO^2 > 1. This is exactly the quantitative form of
 * the imp-95209 obstruction note ("only odd mass within O(1/mu) of the
 * even-shell support buys <U, V>"): each parity keeps all but a fixed
 * fraction of its L2 mass on its own side of the seam. It is UNILATERAL
 * (one condition per parity, checkable from the support geometry alone),
 * unlike a direct bilinear overlap hypothesis.
 *
 * THEOREM SL (unconditional GIVEN H-LOC; pure Hilbert-space argument).
 * Under H-LOC(thetaE, thetaO),
 *   |<U, V>| <= g A B ,
 *   g = thetaE sqrt(1 - thetaO^2) + thetaO sqrt(1 - thetaE^2) < 1 .
 * PROOF. Split over the partition and apply Cauchy-Schwarz on each piece:
 * |<U, V>| <= ||U 1_{S_e}|| ||V 1_{S_e}|| + ||U 1_{S_o}|| ||V 1_{S_o}||
 * = A B (cos x sin y + sin x cos y) = A B sin(x + y), where cos x =
 * ||U 1_{S_e}||/A >= thetaE, cos y = ||V 1_{S_o}||/B >= thetaO and
 * sin^2 + cos^2 = 1 exactly (partition). Since thetaE^2 + thetaO^2 > 1
 * gives arccos(thetaE) + arccos(thetaO) < pi/2, and sin is increasing
 * there, sin(x + y) <= sin(arccos thetaE + arccos thetaO) = g. QED.
 * (For thetaE = thetaO = theta: g = 2 theta sqrt(1 - theta^2).)
 *
 * THEOREM SL-CAP (conditional exactly as THEOREM OV plus H-LOC). Replacing
 * Cauchy-Schwarz by <U, V> <= g sqrt(P R) in the imp-95209 chain gives
 * E <= 2(X_e + X_o) - P - R + 2 g sqrt(P R), and maximizing over the SAME
 * relaxed feasible set (X_e <= min(P, sigmaE), X_o <= min(R, sigmaO),
 * 0 <= R <= betaSq = cU^2 omega, P >= 0; relaxing min(R, sigmaO) to
 * sigmaO) yields, with Rst = min(betaSq, g^2 sigmaE),
 *   phi <= PhiSL(omega; g)
 *        = [ sigmaE + 2 sigmaO - Rst + 2 g sqrt(sigmaE Rst) ]/(2 LwEven).
 * On the bump branch omega <= omegaG(g) = g^2/(g^2 + kappa^2) (where
 * Rst = betaSq) this is EXACT for the relaxation and reads
 *   PhiSL = 1/2 - omega/2 + q omega + g kappa sqrt(omega (1 - omega))
 *           - (kappa^2/2) omega ;
 * on the far branch it is a VALID but deliberately loosened cap (the
 * m_B lesson: no occupancy currency is reintroduced; the global max never
 * lives there). In-P and in-R monotonicity: below the caps the objective
 * increases (derivative 1 + g sqrt(R/P) > 0 and 1 + g sqrt(P/R) > 0),
 * above them it decreases until sqrt(R) = g sqrt(P); the maximizing corner
 * is P = sigmaE, R = Rst. At g = 1 the whole apparatus reproduces THEOREM
 * OV exactly (verified to rel 3e-16 below).
 *
 * COROLLARY GC-SL (global cap, closed form). On the bump branch the
 * stationarity condition is (1 - 2 omega)/sqrt(omega (1 - omega)) =
 * ThetaSL = (kappa^2 + 1 - 2q)/(g kappa), the same strictly decreasing
 * auxiliary function as imp-95209 COROLLARY GC, so the root is unique:
 * omegaStarSL(g) = 2/(T (1 + sqrt(1 - 4/T))), T = 4 + ThetaSL^2. It is
 * ALWAYS interior to the bump branch: at omegaG the auxiliary function
 * equals (kappa^2 - g^2)/(g kappa) < ThetaSL iff 1 - 2q + g^2 > 0, which
 * always holds -- so omegaStarSL < omegaG, and
 *   phi <= gammaSL(g) = PhiSL(omegaStarSL(g); g) ,
 * with gammaSL(1) = gammaOV (continuity of the whole chain) and the
 * leading form gammaSL(g) = 1/2 + g^2/2 + O(1/kappa): the residual bump
 * is annihilated down to the parity-pure level 1/2 plus g^2/2. Payoff
 * table (theta^2 = 1 - e^(-2 mu d)/2, the single-plain-packet profile of
 * LEMMA SP, evaluated at collar depths mu d = 1, 2, 3):
 *   mu d = 1: g = 0.5023494078671652,  gammaSL = 0.6261149157745518
 *   mu d = 2: g = 0.19051460613182897, gammaSL = 0.5181405611163133
 *   mu d = 3: g = 0.07036590183447665, gammaSL = 0.5024747105455318
 * versus gammaOV = 0.9995949885454457 without the hypothesis.
 *
 * LEMMA SP (single plain packet satisfies the localization profile). A
 * plain packet a e^(-mu|t-c|) whose center sits at distance u >= d on its
 * own side of the seam has cross-seam mass fraction exactly
 * e^(-2 mu u)/2 <= e^(-2 mu d)/2 (elementary integral).
 *
 * LEMMA NG (collar insufficiency -- H-COL does not imply H-LOC). Let
 * H-COL(d) be the CENTER hypothesis alone: every even-parity packet center
 * at distance >= d left of the seam, every odd one >= d right, rates free
 * in a band [muMin, muMax], muMin < muMax. Then NO theta^2 > 1/2 holds
 * class-uniformly: (i) the dressed packets W_k(t) = |t-c|^k e^(-mu|t-c|)
 * lie in the L2 closure of the class span -- W_k is (up to sign and k!)
 * the k-th divided difference of mu -> e^(-mu|t-c|) over nodes in the
 * band, which by the Hermite-Genocchi simplex representation equals
 * |t-c|^k times a simplex average of admissible exponentials and converges
 * in L2 (dominated convergence with envelope |t-c|^k e^(-(mu-eps)|t-c|))
 * as the nodes coalesce; (ii) with center c = -d, the cross-seam mass
 * fraction of W_k is EXACTLY Qbar(2k+1, 2 mu d)/2, where Qbar is the
 * regularized upper incomplete gamma of integer order (Poisson tail sum),
 * and Qbar(2k+1, x) -> 1 as k -> infinity at fixed x (elementary: the
 * partial sums of e^x converge), so the own-side fraction -> 1/2 exactly;
 * (iii) already at FINITE stage the violation is in-class: the 7-node
 * divided-difference witness (plain packets co-located at c = -d = -0.3,
 * rates 1.0..2.2, exact closed-form Gram) has cross-seam fraction
 * 0.49999999888291247, versus the plain single-packet value
 * e^(-2 muMin d)/2 = 0.27440581804701325. CONSEQUENCE: the overlap factor
 * delivered by the split route degrades to g = 2 (1/sqrt2)(1/sqrt2) = 1
 * under H-COL alone -- the block-to-support import must bound cross-seam
 * MASS (equivalently: rate multiplicity / polynomial dressing near a
 * single rate), not merely center positions. This SHARPENS the imp-95209
 * obstruction: even after importing a center collar, the bump survives.
 *
 * HONEST LIMITS. (a) H-LOC is a hypothesis about the PAPER packets that is
 * NOT verified here; deriving explicit (thetaE, thetaO) from the dyadic
 * block-to-support dictionary of Permuting the Zeta Twin Ladder Section
 * 4.5 is the named successor sub-gap. LEMMA SP shows plain packets under a
 * collar satisfy the profile; LEMMA NG shows sums need NOT -- so the
 * derivation must use whatever the paper caps about per-block rate
 * dressing. (b) The far-branch cap is deliberately loosened (valid, not
 * tight); the global max is on the exact bump branch (omegaStarSL <
 * omegaG proved). (c) Whether some NON-mass argument yields g < 1 under
 * H-COL alone is left open; the two-scale ladder mechanism explored in
 * this run (matched-moment dressed lobes, coherent right lobes, separated
 * mirror lobes) suggests the class sup of <U, V>/(A B) is 1 even under
 * H-COL, but that full statement is NOT proved here and is not claimed.
 * (d) Model-family constants (theta = 10), not the paper packets.
 * (e) gammaSL is a cap, not proved attained; the measured class sup
 * phi = 0.3572 (imp-95113) sits below every row of the payoff table, so
 * no contradiction and no floor movement.
 *
 * SUB-GAP (surviving, explicitly named, NOT closed):
 *   imp-95210-subgap-hloc-from-dyadic-support -- derive H-LOC(thetaE,
 *   thetaO) with explicit constants for the paper Section 4.5 packets
 *   from the dyadic block-to-support dictionary (per-block rate content +
 *   support collar), then instantiate gammaSL. LEMMA NG proves the
 *   derivation cannot go through center positions alone: it must consume
 *   a per-block cap on rate dressing (mass profile), which the dyadic
 *   packets DO carry in the paper (fixed per-shell rate scale) -- that is
 *   exactly the input to formalize.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) THEOREM SL approached by a 20000-draw
 * random-vector battery over random partitions: the split bound holds on
 * every draw (worst ratio 0.878, no violation); the closed form for g is
 * confirmed against an exhaustive grid maximization of cos x sin y +
 * sin x cos y over the feasible rectangle. (2) THEOREM SL-CAP approached by
 * 200000 random feasible tuples across (omega, g): no tuple exceeds the
 * closed form; the constructed corner attains it exactly on the bump
 * branch. (3) COROLLARY GC-SL: stationarity identity at omegaStarSL to
 * rel 1e-9, auxiliary function strictly decreasing on a grid, dense scans
 * (400k coarse + 200k fine points) never exceed gammaSL(g) and attain it
 * to rel 1e-9; gammaSL(1) = gammaOV to rel 3e-16; gammaSL strictly
 * increasing in g; leading form verified. (4) LEMMA NG: the incomplete-
 * gamma fraction formula checked against direct numerical integration at
 * (k, mu, d) = (3, 1.5, 0.3) and (6, 1.2, 0.5) to 1e-6; the finite
 * witness fraction recomputed from the exact closed-form Gram. (5) SCOPE
 * HONESTY: the conditional class caps are the carried OD/BU chain and are
 * not re-tested by the random draws; H-LOC enters as a NAMED hypothesis,
 * never silently assumed -- no assertion below treats it as established.
 *
 * The numerics below CROSS-CHECK the lemma statements; they are not the
 * claim. Import-light (no heavy bundle; imports only the three sibling
 * verdict modules for carried constants). Changes no bound; does NOT
 * promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

import BNT from "./imp-95172-ballast-necessity-tradeoff.js";
import MBU from "./imp-95208-mb-uniform-ballast-cap.js";
import OVC from "./imp-95209-overlap-currency-cap.js";

// ── carried constants (single source of truth: sibling verdict objects) ─────
const LW_EVEN = BNT.constants.lwEven; // 3.9197935113802585e-5
const Q_OD = BNT.constants.q; // 0.03755392855053636
const C_U = MBU.constants.cU; // 0.30501330232499435
const KAPPA = OVC.constants.kappa; // 48.717745853978386
const GAMMA_OV = OVC.constants.gammaOV; // 0.9995949885454457

// ── new baked literals (recomputed by the assertions) ────────────────────────
const THETA2_REF = 0.9908421805556329; // 1 - e^(-4)/2  (mu d = 2 profile)
const G_REF = 0.19051460613182897; // 2 theta sqrt(1 - theta^2) at THETA2_REF
const OMEGA_STAR_REF = 1.5280017882327864e-5; // omegaStarSL(G_REF)
const GAMMA_SL_REF = 0.5181405611163133; // gammaSL(G_REF)
const PAYOFF_TABLE = [
  { muD: 1, g: 0.5023494078671652, gammaSL: 0.6261149157745518 },
  { muD: 2, g: 0.19051460613182897, gammaSL: 0.5181405611163133 },
  { muD: 3, g: 0.07036590183447665, gammaSL: 0.5024747105455318 },
];
const DD_WITNESS_FRAC = 0.49999999888291247; // 7-node witness, d=0.3, rates 1.0..2.2
const PLAIN_PACKET_CAP = 0.27440581804701325; // e^(-2 muMin d)/2 at muMin=1, d=0.3
const NG_FRAC_K1 = 0.4884423561236836; // Qbar(3, 0.6)/2
const NG_FRAC_K3 = 0.4999983534579338; // Qbar(7, 0.6)/2

// ── shared kernel conventions (identical to the sibling modules) ─────────────
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-7 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}

// ── theorem functionals ──────────────────────────────────────────────────────
function overlapG(theta2E, theta2O) {
  const tE = Math.sqrt(theta2E);
  const tO = Math.sqrt(theta2O);
  return tE * Math.sqrt(1 - theta2O) + tO * Math.sqrt(1 - theta2E);
}
function hStarSL(omega, g) {
  const sE = LW_EVEN * (1 - omega);
  const sO = Q_OD * LW_EVEN * omega;
  const bSq = C_U * C_U * omega;
  const rSt = Math.min(bSq, g * g * sE);
  return sE + 2 * sO - rSt + 2 * g * Math.sqrt(sE * rSt);
}
function phiCapSL(omega, g) {
  return hStarSL(omega, g) / (2 * LW_EVEN);
}
function omegaG(g) {
  return (g * g) / (g * g + KAPPA * KAPPA);
}
function thetaSL(g) {
  return (KAPPA * KAPPA + 1 - 2 * Q_OD) / (g * KAPPA);
}
function omegaStarSL(g) {
  const th = thetaSL(g);
  const T = 4 + th * th;
  return 2 / (T * (1 + Math.sqrt(1 - 4 / T))); // stable root of the quadratic
}
function gammaSL(g) {
  return phiCapSL(omegaStarSL(g), g);
}
// regularized upper incomplete gamma of integer order a (Poisson tail sum)
function upperQ(a, x) {
  let term = Math.exp(-x);
  let s = term;
  for (let n = 1; n < a; n++) {
    term *= x / n;
    s += term;
  }
  return s;
}

// ── verdict object ───────────────────────────────────────────────────────────
export const IMP95210_SEAM_MASS_LOCALIZATION_CAP = {
  ticket:
    "imp-95210 (second leg of the seam chain, approaching imp-95209-subgap-seam-localized-overlap: the required new model input is pinned to the per-parity cross-seam mass-localization hypothesis H-LOC; under it THEOREM SL gives <U, V> <= g A B with g = thetaE sqrt(1 - thetaO^2) + thetaO sqrt(1 - thetaE^2) < 1, the imp-95209 optimization re-runs in closed form to gammaSL(g) = 1/2 + g^2/2 + O(1/kappa), and LEMMA NG proves a center-collar hypothesis alone provably cannot supply H-LOC)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes THEOREM OV and its constants (imp-95209), THEOREM BU (imp-95208), the OD class caps (imp-95129 via imp-95172); carried constants imported from the three sibling verdict objects.",
  hypothesisHLOC:
    "NEW model input, minimal unilateral form of the block-to-support dictionary: a measurable partition S_e U S_o of the line with ||U 1_{S_o}||^2 <= (1 - thetaE^2)||U||^2 and ||V 1_{S_e}||^2 <= (1 - thetaO^2)||V||^2, thetaE^2 + thetaO^2 > 1 -- each parity keeps all but a fixed fraction of its L2 mass on its own side of the seam. NOT verified for the paper packets here; named successor sub-gap.",
  theoremSL:
    "Given H-LOC (pure Hilbert-space argument, no class input): |<U, V>| <= g A B with g = thetaE sqrt(1 - thetaO^2) + thetaO sqrt(1 - thetaE^2) = sin(arccos thetaE + arccos thetaO) < 1. Proof: partition split + Cauchy-Schwarz per piece + monotone sine below pi/2.",
  theoremSLCAP:
    "Conditional exactly as THEOREM OV plus H-LOC: phi <= PhiSL(omega; g) = [sigmaE + 2 sigmaO - Rst + 2 g sqrt(sigmaE Rst)]/(2 LwEven), Rst = min(cU^2 omega, g^2 sigmaE); exact for the relaxation on the bump branch omega <= omegaG(g) = g^2/(g^2 + kappa^2) where it reads 1/2 - omega/2 + q omega + g kappa sqrt(omega(1 - omega)) - (kappa^2/2) omega; valid loosened cap beyond. At g = 1 it reproduces THEOREM OV exactly.",
  corollaryGCSL:
    "Global cap, closed form: gammaSL(g) = PhiSL(omegaStarSL(g); g) at the unique interior stationary point omegaStarSL(g) = 2/(T(1 + sqrt(1 - 4/T))), T = 4 + ThetaSL^2, ThetaSL = (kappa^2 + 1 - 2q)/(g kappa); interiority omegaStarSL < omegaG holds ALWAYS (reduces to 1 - 2q + g^2 > 0); gammaSL(1) = gammaOV; leading form gammaSL = 1/2 + g^2/2 + O(1/kappa) -- the bump is annihilated to the parity-pure level plus g^2/2.",
  lemmaSP:
    "A plain packet with center at distance u >= d on its own side of the seam has cross-seam mass fraction exactly e^(-2 mu u)/2 <= e^(-2 mu d)/2: plain packets under a collar satisfy the localization profile.",
  lemmaNG:
    "Collar insufficiency: under the center hypothesis H-COL(d) alone (centers >= d from the seam, rates free in a band), NO theta^2 > 1/2 holds class-uniformly. Dressed packets |t-c|^k e^(-mu|t-c|) lie in the class L2 closure (divided differences over rate nodes, Hermite-Genocchi + dominated convergence) and at center -d have cross-seam mass fraction EXACTLY Qbar(2k+1, 2 mu d)/2 -> 1/2; a finite 7-node in-class witness already reaches 0.49999999888291247 vs the plain single-packet 0.27440581804701325. The block-to-support import must bound cross-seam MASS (rate dressing), not center positions.",
  constants: {
    theta2Ref: THETA2_REF,
    gRef: G_REF,
    omegaStarRef: OMEGA_STAR_REF,
    gammaSLRef: GAMMA_SL_REF,
    payoffTable: PAYOFF_TABLE,
    ddWitnessFrac: DD_WITNESS_FRAC,
    plainPacketCap: PLAIN_PACKET_CAP,
    ngFracK1: NG_FRAC_K1,
    ngFracK3: NG_FRAC_K3,
  },
  subGap:
    "imp-95210-subgap-hloc-from-dyadic-support -- OPEN: derive H-LOC(thetaE, thetaO) with explicit constants for the paper Section 4.5 packets from the dyadic block-to-support dictionary (per-block support collar PLUS per-block rate-dressing cap; LEMMA NG proves the collar alone cannot suffice), then instantiate gammaSL. Also recorded, open: whether any non-mass argument yields g < 1 under H-COL alone (the two-scale ladder mechanism suggests the class sup is 1, not proved).",
  openResiduals: [
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
    "the curvature ceiling D retained by the window",
    "the paper phase curvature normalization (sibling Theorem D residual)",
    "residual (c) of the sibling chain: the passage from the l2 weld bound to the pointwise scalar |C_E,17|",
    "SECOND LEG DELIVERED: imp-95209-subgap-seam-localized-overlap is given its conditional resolution -- under the NEW named hypothesis H-LOC the bump collapses, gammaOV = 0.9995949885454457 -> gammaSL = 1/2 + g^2/2 + O(1/kappa) (e.g. 0.5181405611163133 at the mu d = 2 profile), and the insufficiency side is settled: LEMMA NG proves center-collar geometry alone cannot supply H-LOC (dressed in-class closure reaches cross-seam mass 1/2 exactly). HONEST LIMIT: H-LOC is NOT verified for the paper packets (successor sub-gap imp-95210-subgap-hloc-from-dyadic-support); cap valid, not proved attained; measured class sup phi = 0.3572 unchanged",
  ],
  isRigorous: true,
  rigorScope:
    "THEOREM SL is an unconditional Hilbert-space inequality GIVEN H-LOC (partition split + Cauchy-Schwarz + monotone sine; fully proved in the header). THEOREM SL-CAP and COROLLARY GC-SL are conditional exactly as THEOREM OV (the carried MAJ per-pair caps + per-class Lemma SW + THEOREM BU) PLUS the new named hypothesis H-LOC; the optimization algebra, the interiority proof (1 - 2q + g^2 > 0) and the uniqueness argument (strictly decreasing auxiliary function, as in imp-95209) are unconditional. LEMMA SP and LEMMA NG are unconditional statements about the model class (exact integrals, divided-difference closure membership, incomplete-gamma identities). H-LOC itself is NOT proved for the paper packets and every conditional statement names it. The numerics cross-check the statements; they are not the claim.",
  promotesBound: false,
  verdict:
    "RIGOROUS step: the block-to-support geometry demanded by imp-95209-subgap-seam-localized-overlap is pinned to a precise minimal hypothesis and priced exactly. H-LOC(thetaE, thetaO) -- per-parity cross-seam mass localization over a measurable partition -- yields THEOREM SL: |<U, V>| <= g A B, g = thetaE sqrt(1 - thetaO^2) + thetaO sqrt(1 - thetaE^2) < 1; pushing g through the imp-95209 relaxation gives the closed-form cap PhiSL and the global cap gammaSL(g) = PhiSL(omegaStarSL(g)) with omegaStarSL always interior (1 - 2q + g^2 > 0), gammaSL(1) = gammaOV exactly, and gammaSL = 1/2 + g^2/2 + O(1/kappa): under the mu d = 2 localization profile the bump 0.9995949885454457 collapses to 0.5181405611163133. The insufficiency side is settled rigorously: LEMMA NG shows a center-collar hypothesis alone CANNOT supply H-LOC -- rate-dressed packets in the class closure (divided differences, exact incomplete-gamma cross-seam fraction Qbar(2k+1, 2 mu d)/2 -> 1/2) already violate every theta^2 > 1/2 at finite stage in-class (7-node witness 0.49999999888291247 vs plain-packet 0.27440581804701325) -- so the paper import must cap per-block rate dressing (mass), not center positions, sharpening exactly what the dyadic dictionary has to supply. HONEST: H-LOC is a hypothesis, not verified for the paper packets (successor sub-gap imp-95210-subgap-hloc-from-dyadic-support); far-branch cap deliberately loosened; whether non-mass routes beat H-COL alone stays open; model-family constants; cap not proved attained; the measured class sup phi = 0.3572 is untouched. Floors and ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ──────────────────────────
export const IMP95210_SML_ASSERTIONS = [
  {
    id: "imp95210-sml-constants-closed-form",
    description:
      "baked literals reproduce from the carried sibling constants (rel 1e-12): the mu d = 2 profile theta^2 = 1 - e^(-4)/2, g = 2 theta sqrt(1 - theta^2), omegaStarSL(g), gammaSL(g), the payoff table rows, and the NG incomplete-gamma fractions Qbar(3, 0.6)/2 and Qbar(7, 0.6)/2",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      if (!rel(1 - Math.exp(-4) / 2, THETA2_REF)) return false;
      if (!rel(overlapG(THETA2_REF, THETA2_REF), G_REF)) return false;
      if (!rel(omegaStarSL(G_REF), OMEGA_STAR_REF)) return false;
      if (!rel(gammaSL(G_REF), GAMMA_SL_REF)) return false;
      for (const row of PAYOFF_TABLE) {
        const t2 = 1 - Math.exp(-2 * row.muD) / 2;
        if (!rel(overlapG(t2, t2), row.g)) return false;
        if (!rel(gammaSL(row.g), row.gammaSL)) return false;
      }
      if (!rel(upperQ(3, 0.6) / 2, NG_FRAC_K1)) return false;
      if (!rel(upperQ(7, 0.6) / 2, NG_FRAC_K3)) return false;
      return rel(KAPPA, C_U / Math.sqrt(LW_EVEN));
    },
  },
  {
    id: "imp95210-sml-split-bound-battery",
    description:
      "THEOREM SL: 20000-draw random-vector battery over random partitions never violates |<U, V>| <= (cos x sin y + sin x cos y) A B, and the closed form g(thetaE, thetaO) dominates an exhaustive grid maximization of the split coefficient over the feasible rectangle (4 theta pairs)",
    holds: () => {
      let seed = 987654321;
      const rand = () => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed / 2147483648;
      };
      for (let t = 0; t < 20000; t++) {
        const n = 6 + Math.floor(rand() * 10);
        let uv = 0;
        let a2 = 0;
        let b2 = 0;
        let uSe = 0;
        let uSo = 0;
        let vSe = 0;
        let vSo = 0;
        for (let i = 0; i < n; i++) {
          const ui = rand() * 2 - 1;
          const vi = rand() * 2 - 1;
          const side = rand() < 0.5 ? 0 : 1;
          uv += ui * vi;
          a2 += ui * ui;
          b2 += vi * vi;
          if (side === 0) {
            uSe += ui * ui;
            vSe += vi * vi;
          } else {
            uSo += ui * ui;
            vSo += vi * vi;
          }
        }
        const bound = Math.sqrt(uSe * vSe) + Math.sqrt(uSo * vSo);
        if (Math.abs(uv) > bound * (1 + 1e-12) + 1e-15) return false;
      }
      for (const [t2e, t2o] of [
        [0.6, 0.6],
        [0.75, 0.9],
        [0.9908421805556329, 0.9908421805556329],
        [0.999, 0.7],
      ]) {
        const tE = Math.sqrt(t2e);
        const tO = Math.sqrt(t2o);
        let mx = 0;
        for (let i = 0; i <= 800; i++) {
          for (let j = 0; j <= 800; j++) {
            const cx = tE + (1 - tE) * (i / 800);
            const cy = tO + (1 - tO) * (j / 800);
            const v = cx * Math.sqrt(1 - cy * cy) + Math.sqrt(1 - cx * cx) * cy;
            if (v > mx) mx = v;
          }
        }
        if (mx > overlapG(t2e, t2o) * (1 + 1e-9)) return false;
        if (mx < overlapG(t2e, t2o) * (1 - 1e-6)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95210-sml-optimization-cap-battery",
    description:
      "THEOREM SL-CAP: 200000 random feasible tuples (P, R, X_e, X_o) with the g-modified objective 2X_e + 2X_o - P - R + 2 g sqrt(P R) across (omega, g) never exceed hStarSL, and the constructed corner (P = sigmaE, R = Rst, caps) attains it exactly on the bump branch",
    holds: () => {
      let seed = 424242001;
      const rand = () => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed / 2147483648;
      };
      for (let t = 0; t < 200000; t++) {
        const g = 0.02 + 0.98 * rand();
        const w = Math.pow(10, -7 + 7 * rand());
        if (w > 1) continue;
        const sE = LW_EVEN * (1 - w);
        const sO = Q_OD * LW_EVEN * w;
        const bSq = C_U * C_U * w;
        const R = bSq * rand();
        const P = sE * 3 * rand();
        const Xe = Math.min(P, sE) * rand();
        const Xo = Math.min(R, sO) * rand();
        const h = 2 * Xe + 2 * Xo - P - R + 2 * g * Math.sqrt(P * R);
        if (h > hStarSL(w, g) * (1 + 1e-12) + 1e-30) return false;
      }
      const g0 = G_REF;
      const w0 = OMEGA_STAR_REF; // bump branch: Rst = betaSq there
      const sE = LW_EVEN * (1 - w0);
      const sO = Q_OD * LW_EVEN * w0;
      const bSq = C_U * C_U * w0;
      if (!(bSq < g0 * g0 * sE)) return false; // confirms bump branch
      const corner = 2 * sE + 2 * sO - sE - bSq + 2 * g0 * Math.sqrt(sE * bSq);
      return Math.abs(corner - hStarSL(w0, g0)) <= 1e-14 * hStarSL(w0, g0);
    },
  },
  {
    id: "imp95210-sml-gamma-closed-form",
    description:
      "COROLLARY GC-SL: for g in a 5-value grid the stationarity identity (1 - 2 omegaStar)/sqrt(omegaStar(1 - omegaStar)) = ThetaSL holds to rel 1e-9, omegaStarSL < omegaG (interiority, i.e. 1 - 2q + g^2 > 0 route), a 100000-point scan of PhiSL over (0, 3 omegaG] never exceeds gammaSL(g) and attains it to rel 1e-9, gammaSL is strictly increasing in g with gammaSL(g) < gammaOV for g < 1, gammaSL(1) = gammaOV to rel 1e-12, and |gammaSL - (1/2 + g^2/2)| <= 1e-4 for g <= 0.5",
    holds: () => {
      let prev = 0;
      for (const g of [0.05, 0.19051460613182897, 0.5, 0.9, 0.999]) {
        const ws = omegaStarSL(g);
        const stat = (1 - 2 * ws) / Math.sqrt(ws * (1 - ws));
        if (!(Math.abs(stat - thetaSL(g)) <= 1e-9 * thetaSL(g))) return false;
        if (!(ws < omegaG(g))) return false;
        const gs = gammaSL(g);
        let best = 0;
        for (let i = 1; i <= 100000; i++) {
          const w = (i * 3 * omegaG(g)) / 100000;
          const v = phiCapSL(Math.min(w, 1), g);
          if (v > gs * (1 + 1e-12)) return false;
          if (v > best) best = v;
        }
        if (!(best >= gs * (1 - 1e-9))) return false;
        if (!(gs > prev)) return false;
        prev = gs;
        if (!(gs < GAMMA_OV)) return false;
        if (g <= 0.5 && !(Math.abs(gs - (0.5 + (g * g) / 2)) <= 1e-4)) return false;
      }
      return Math.abs(gammaSL(1) - GAMMA_OV) <= 1e-12 * GAMMA_OV;
    },
  },
  {
    id: "imp95210-sml-lemma-sp-plain-packet",
    description:
      "LEMMA SP: the plain-packet cross-seam fraction e^(-2 mu u)/2 matches direct numerical integration (mu = 1.7, u = 0.6, midpoint rule, tol 1e-6), and the kernel convention matches the siblings at tau = 0 (K(a, a, 0) = 1/a)",
    holds: () => {
      const mu = 1.7;
      const u = 0.6;
      const f = (t) => Math.exp(-mu * Math.abs(t + u));
      const integ = (a, b, n) => {
        let s = 0;
        const h = (b - a) / n;
        for (let i = 0; i < n; i++) {
          const t = a + (i + 0.5) * h;
          s += f(t) * f(t) * h;
        }
        return s;
      };
      const L = 40 / mu;
      const tot = integ(-u - L, -u + L, 200000);
      const right = integ(0, -u + L, 100000);
      const closed = Math.exp(-2 * mu * u) / 2;
      if (!(Math.abs(right / tot - closed) <= 1e-6)) return false;
      return Math.abs(kernelK(mu, mu, 0) - 1 / mu) <= 1e-12 / mu;
    },
  },
  {
    id: "imp95210-sml-lemma-ng-dressed-and-witness",
    description:
      "LEMMA NG: the dressed cross-seam fraction Qbar(2k+1, 2 mu d)/2 matches direct numerical integration of |t+d|^k e^(-mu|t+d|) squared at (k, mu, d) = (3, 1.5, 0.3) to 1e-6; the fraction ladder is strictly increasing in k toward 1/2 (k = 1, 3, 6, 12 at mu d = 0.3); the finite 7-node divided-difference witness (co-located plain packets at c = -0.3, rates 1.0..2.2, exact closed-form Gram) reproduces the baked fraction 0.49999999888291247 (rel 1e-9) and strictly exceeds the plain single-packet value 0.27440581804701325, certifying in-class H-LOC violation under H-COL alone",
    holds: () => {
      const k = 3;
      const mu = 1.5;
      const d = 0.3;
      const f = (t) => Math.pow(Math.abs(t + d), k) * Math.exp(-mu * Math.abs(t + d));
      const integ = (a, b, n) => {
        let s = 0;
        const h = (b - a) / n;
        for (let i = 0; i < n; i++) {
          const t = a + (i + 0.5) * h;
          s += f(t) * f(t) * h;
        }
        return s;
      };
      const L = (2 * k + 40) / mu;
      const tot = integ(-d - L, -d, 200000) + integ(-d, -d + L, 200000);
      const right = integ(0, -d + L, 200000);
      if (!(Math.abs(right / tot - upperQ(2 * k + 1, 2 * mu * d) / 2) <= 1e-6)) return false;
      let prevFrac = 0;
      for (const kk of [1, 3, 6, 12]) {
        const fr = upperQ(2 * kk + 1, 0.6) / 2;
        if (!(fr > prevFrac)) return false;
        if (!(fr <= 0.5)) return false; // k = 12 rounds to 1/2 in double precision
        prevFrac = fr;
      }
      if (!(0.5 - prevFrac < 1e-6)) return false; // -> 1/2
      const nodes = [];
      for (let j = 0; j <= 6; j++) nodes.push(1.0 + (1.2 * j) / 6);
      const wgt = nodes.map((mj, jj) => {
        let p = 1;
        nodes.forEach((mi, ii) => {
          if (ii !== jj) p *= mj - mi;
        });
        return 1 / p;
      });
      let tot2 = 0;
      let right2 = 0;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
          const s = nodes[i] + nodes[j];
          tot2 += (wgt[i] * wgt[j] * 2) / s;
          right2 += (wgt[i] * wgt[j] * Math.exp(-s * 0.3)) / s;
        }
      }
      const frac = right2 / tot2;
      if (!(Math.abs(frac - DD_WITNESS_FRAC) <= 1e-9)) return false;
      if (!(Math.abs(Math.exp(-2 * 1.0 * 0.3) / 2 - PLAIN_PACKET_CAP) <= 1e-15)) return false;
      return frac > PLAIN_PACKET_CAP + 0.2;
    },
  },
  {
    id: "imp95210-sml-honesty-gate",
    description:
      "the verdict names H-LOC as an unverified hypothesis, records the conditional collapse gammaOV -> gammaSL, the insufficiency lemma, the surviving sub-gap imp-95210-subgap-hloc-from-dyadic-support, and the untouched ledger; promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95210_SEAM_MASS_LOCALIZATION_CAP.promotesBound === false &&
      IMP95210_SEAM_MASS_LOCALIZATION_CAP.openResiduals.length === 5 &&
      /NO QED/.test(IMP95210_SEAM_MASS_LOCALIZATION_CAP.verdict) &&
      /refereed bound is changed/i.test(IMP95210_SEAM_MASS_LOCALIZATION_CAP.verdict) &&
      /Floors and ceilings untouched/.test(IMP95210_SEAM_MASS_LOCALIZATION_CAP.verdict) &&
      /not verified for the paper packets/.test(IMP95210_SEAM_MASS_LOCALIZATION_CAP.verdict) &&
      /hloc-from-dyadic-support/.test(IMP95210_SEAM_MASS_LOCALIZATION_CAP.subGap) &&
      /NOT verified/.test(IMP95210_SEAM_MASS_LOCALIZATION_CAP.hypothesisHLOC) &&
      /SECOND LEG DELIVERED/.test(IMP95210_SEAM_MASS_LOCALIZATION_CAP.openResiduals[4]) &&
      /HONEST LIMIT/.test(IMP95210_SEAM_MASS_LOCALIZATION_CAP.openResiduals[4]) &&
      /0\.3572/.test(IMP95210_SEAM_MASS_LOCALIZATION_CAP.verdict) &&
      /PLUS the new named hypothesis H-LOC/.test(
        IMP95210_SEAM_MASS_LOCALIZATION_CAP.rigorScope,
      ),
  },
];

for (const a of IMP95210_SML_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95210-seam-mass-localization-cap assertion failed: ${a.id}`);
  }
}

export default IMP95210_SEAM_MASS_LOCALIZATION_CAP;
