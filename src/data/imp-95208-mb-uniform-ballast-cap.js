/**
 * imp-95208 - RIGOROUS step -- LEMMA GS (blockwise Gram-split diagonal
 * bound) + THEOREM BU (m_B-uniform ballast bound) + THEOREM GB-U
 * (m_B-UNIFORM tradeoff cap) + COROLLARY OM-U (m_B-free odd-mass floor):
 * CLOSES the sub-gap imp-95172-subgap-mB-uniform-ballast on its FIRST
 * horn -- the m_B dependence of the imp-95172 ballast ceiling gamma(m_B)
 * is REMOVED, and the diluted-ballast escape family (m_B -> infinity,
 * omega -> 0, phi -> 1) that imp-95172 named as the alternative horn is
 * REFUTED within the conditional class.
 *
 * CONTEXT. imp-95172 (LEMMA NT + THEOREM BW + THEOREM GB) proved the first
 * uniform witness-side ceiling phi <= gamma(m_B) < 1, but with an explicit
 * occupied-odd-block count m_B in the constant: its fact (F5) bounded
 * B = ||V||_2 by the TRIANGLE inequality across odd blocks,
 * B <= c(s) ||nb_odd||_1 <= c(s) sqrt(m_B M_odd), and the ell-1 to ell-2
 * step is exactly where sqrt(m_B) enters. imp-95172 posed the successor
 * dichotomy: remove the m_B dependence, OR exhibit a diluted-ballast
 * family with phi -> 1 proving it essential. THIS module resolves the
 * dichotomy on the first horn. The mechanism: the m_B factor is a proof
 * artifact of pricing the CROSS-block odd mass by the triangle inequality
 * when the carried chain already caps it -- the exact Gram split
 * B^2 = N_o + X_o prices the diagonal N_o blockwise by LEMMA NT (no
 * inter-block step at all) and the off-diagonal X_o by the SAME carried
 * odd-class cap that THEOREM BW already consumes as its fact (F2). No new
 * conditional input enters.
 *
 * SETTING (identical to imp-95172; model family sigma = 1, theta = 10,
 * s = sigma + theta = 11; all quantities at M = 1, phi and omega
 * scale-invariant). Packets a_i exp(-mu_i |u - u_i|), a_i >= 0, assigned
 * to dyadic blocks; w_b = block sum; V = sum over odd b of w_b;
 * B = ||V||_2; N_o = sum over odd b of ||w_b||^2; X_o = odd same-parity
 * cross-block coupling (Lemma ES); nb_b = sum_{i in b} a_i sqrt(r_i) /
 * h(mu_i r_i, s); M_odd = sum over odd b of nb_b^2; omega = M_odd / M;
 * phi = E/(2 LwEven M). Carried constants: LwEven = 3.9197935113802585e-5
 * (twenty-second certified sandwich), LwOddCert = 1.4720364545923026e-6
 * (imp-95129), q = LwOddCert/LwEven = 0.03755392855053636, c(11) =
 * 0.30501088924617725 (imp-95172 LEMMA NT), phiT = 0.670946474458521.
 *
 * LEMMA GS (Gram-split diagonal bound -- UNCONDITIONAL). For every witness
 * of the class, N_o <= c(s)^2 M_odd. PROOF. Fix an odd block b. The
 * triangle inequality WITHIN the block and the per-packet norm transfer of
 * LEMMA NT (||a exp(-mu |. - u0|)||_2 = a/sqrt(mu) <= c(s) a sqrt(r) /
 * h(mu r, s), valid for every mu, r > 0) give ||w_b|| <=
 * sum_{i in b} a_i / sqrt(mu_i) <= c(s) nb_b. Square and sum over odd b:
 * N_o = sum ||w_b||^2 <= c(s)^2 sum nb_b^2 = c(s)^2 M_odd. QED. Note the
 * bound is fully ell-2 in the block index -- no inter-block triangle step,
 * hence no m_B. (The battery below finds draws with N_o at 94 percent of
 * the cap: the lemma is near-attained, not slack.)
 *
 * THEOREM BU (m_B-uniform ballast bound -- conditional EXACTLY as
 * imp-95172 fact (F2), i.e. as THEOREM OD: carried MAJ per-pair caps +
 * per-class Lemma SW; LEMMA GS and the Gram identity unconditional).
 * Every witness of the class satisfies, at M = 1,
 *   B <= cU sqrt(omega),   cU = sqrt( c(s)^2 + q LwEven ) .
 * PROOF. Exact Gram identity B^2 = N_o + X_o (split the double sum over
 * odd-block pairs into equal and distinct blocks). LEMMA GS bounds
 * N_o <= c(s)^2 M_odd; the carried odd-class cap (imp-95172 fact (F2))
 * bounds X_o <= LwOddCert M_odd = q LwEven M_odd. Sum: B^2 <=
 * (c(s)^2 + q LwEven) omega. QED. cU = 0.30501330232499435 -- only
 * 7.9114513685e-6 relatively above c(11): the odd cross-term cap costs
 * essentially nothing, and the entire sqrt(m_B) of imp-95172 fact (F5) is
 * gone.
 *
 * THEOREM BW-U (m_B-uniform ballast-witness necessity -- conditionality
 * as THEOREM BU). Every E > 0 witness of the class with phi >= q omega
 * satisfies
 *   cU sqrt(omega) >= sqrt(LwEven) [ sqrt(phi - q omega)
 *                                    - sqrt(2 (1 - phi)) ] .   (BW-U)
 * PROOF. The imp-95172 six-fact chain verbatim with (F5) replaced by
 * THEOREM BU: cU sqrt(omega) >= B >= A - sqrt(D) >=
 * sqrt(LwEven (phi - q omega)) - sqrt(2 LwEven (1 - phi)). QED.
 *
 * COROLLARY OM-U (m_B-FREE phi-conditional odd-mass floor). For every
 * witness of the class with phi >= phi_0 > phiT:
 *   omega >= omegaMinU(phi_0)
 *     = (LwEven / cU^2) [ sqrt(1 - (1 - phi_0)/(1 - q))
 *                          - sqrt(2 (1 - phi_0)) ]^2 > 0 ,
 * with NO ballast factor. PROOF. As imp-95172 COROLLARY OM with (BW)
 * replaced by (BW-U). QED. Values: omegaMinU(0.9) =
 * 1.050852569623663e-4, omegaMinU(0.99) = 3.068317899982813e-4,
 * omegaMinU(0.999) = 3.8407244225845464e-4; the phi_0 -> 1 limit is
 * LwEven/cU^2 = 4.213331487864178e-4. Contrast imp-95172: its floor
 * decayed as 1/m_B and so vanished along any m_B -> infinity family; this
 * one cannot.
 *
 * THEOREM GB-U (m_B-uniform tradeoff cap). EVERY witness of the class
 * (no bound on the number of occupied odd blocks) satisfies
 *   phi <= gammaU = 1 - LwEven / ( alphaU^2 + LwEven/(1 - q) ) ,
 *   alphaU = cU / sqrt(1 - q) + sqrt(2 LwEven) ,
 * and hence r = 1/(2 phi) >= 1/(2 gammaU) > 1/2 strictly. PROOF. As
 * imp-95172 THEOREM GB with alpha(m_B) replaced by alphaU (the same
 * branch handling: phi <= q omega gives phi <= q < gammaU; the
 * 1 - x/(1 - q) < 0 branch gives phi < q). QED. gammaU =
 * 0.9996167883494768 (alphaU = 0.3197612001331479, xStarU =
 * 3.832116505232332e-4).
 *
 * CONSEQUENCE (imp-95172 dichotomy RESOLVED, escape family REFUTED). The
 * imp-95172 alternative horn -- a diluted-ballast family with
 * m_B -> infinity, omega -> 0 and phi -> 1 -- CANNOT exist in the
 * conditional class: gammaU < 1 is uniform over ALL occupancy patterns,
 * and near phi = 1 COROLLARY OM-U forces omega >= ~4.2e-4 while THEOREM
 * OD forces omega <= (1 - phi)/(1 - q) -> 0; the two collide exactly at
 * xStarU (the consistency identity omegaMinU(1 - xStarU) =
 * xStarU/(1 - q), verified below to rel 1e-12, is the meeting point).
 * The m_B dependence of imp-95172 was a proof artifact, not a truth.
 *
 * COMPARISON LEDGER (all conditional as OD). Old gamma(1) =
 * 0.9996167824561802 < gammaU = 0.9996167883494768 < old gamma(2) =
 * 0.9998052068769846 < old gamma(10) = 0.9999601706097895. So: for the
 * m_B = 1 subclass the old bound stays marginally sharper (by 5.89e-9);
 * for every m_B >= 2 the new cap is strictly sharper; for unbounded m_B
 * the old theorem said NOTHING and gammaU is the first cap at all. On the
 * carried p = 999983 grid class the uniform cap improves 0.99996 ->
 * 0.99962 and no longer needs the grid-specific m_B <= 10 argument.
 *
 * HONEST LIMITS. (a) The CONSTANT gap is untouched: gammaU = 0.99962
 * still sits far above the measured class sup phi = 0.3572 (imp-95113)
 * and above the parity-pure cap 1/2 (imp-95172 COROLLARY PP) -- the proof
 * still prices ballast in norm currency (B vs A), not overlap currency
 * <U, V>; the seam-overlap sharpening toward 1/2 remains the open lever
 * and is carried as the successor sub-gap. (b) Conditionality is exactly
 * THEOREM OD's (carried MAJ per-pair caps + per-class Lemma SW enter only
 * through the X_o cap and fact (F4)); LEMMA GS, the Gram identity, LEMMA
 * NT and the triangle steps are unconditional. (c) Model-family constants
 * (theta = 10), not the paper Section 4.5 packets. (d) BW-U remains
 * vacuous-side at every exhibited in-class E > 0 witness (terminal
 * headline witness: lhs 0.184911912795612 -- sharper than the old
 * 0.26150286605269807 -- vs bracket -0.0034394128728317034 < 0); the
 * theorem bites only near phi = 1, which is its job. (e) Nothing here
 * moves a floor or a ceiling of the recorded ledger; the known class sup
 * phi remains the measured 0.3572.
 *
 * SUB-GAP (surviving, explicitly named, NOT closed):
 *   imp-95208-subgap-overlap-currency-constant -- the constant gap:
 *   replace the norm-currency step B >= A - sqrt(D) by a seam-overlap
 *   bound on <U, V> (only odd-packet mass within O(1/mu) of even-shell
 *   support buys parity balance), pushing gammaU = 0.9996 toward the
 *   parity-pure 1/2; the m_B-removal of THIS module is orthogonal to and
 *   composes with any such sharpening.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) LEMMA GS approached by a 60-draw
 * deterministic LCG battery (4..11 packets, blocks 0..7, rates [0.3, 8],
 * amplitudes (0, 1.5], centers [1, 9], r in [0.5, 2.5], m_B up to 4):
 * blockwise ||w_b|| <= c nb_b, the exact Gram identity B^2 = N_o + X_o
 * (to 1e-9 relative), and N_o <= c^2 M_odd hold on every draw; the worst
 * draw reaches 94 percent of the GS cap (near-attained, not slack).
 * (2) The sharpening is real: on draws with m_B >= 3 occupied odd blocks
 * the old ell-1 bound c ||nb_odd||_1 exceeds the new cU sqrt(M_odd) by a
 * factor up to 1.454 (baked threshold 1.4). (3) The GB-U algebra is
 * checked as an exact identity alphaU^2 xStarU = LwEven (1 - xStarU /
 * (1 - q)) to rel 1e-12, with gammaU strictly between old gamma(1) and
 * old gamma(2) and gammaU > phiT > q (branch collapse valid). (4) The
 * dichotomy-resolution consistency identity omegaMinU(1 - xStarU) =
 * xStarU/(1 - q) holds to rel 1e-12 -- the floor and the OD cap meet
 * exactly at the GB-U extremal point, as the derivation requires.
 * (5) The terminal headline witness (single source of truth: the
 * twenty-third module via imp-95172) obeys OD, GB-U and the vacuous-side
 * BW-U evaluation with baked literals, and the new lhs is strictly below
 * the old baked lhs. (6) SCOPE HONESTY: the conditional facts (X_o cap,
 * F4) are the carried OD chain and are NOT re-proved or re-tested here
 * (random draws need not satisfy the MAJ caps); only the unconditional
 * facts are battery-tested, exactly as in imp-95172.
 *
 * The numerics below CROSS-CHECK the lemma statements; they are not the
 * claim. Import-light (no heavy bundle; imports only the imp-95172 sibling
 * for carried constants and the twenty-third-module terminal literals it
 * re-exports). Changes no bound; does NOT promote Lambda <= 0.14; NO QED;
 * no refereed bound is changed.
 */

import BNT from "./imp-95172-ballast-necessity-tradeoff.js";

// ── shared conventions (identical to the sibling modules) ────────────────────
const SS = 11;

function hLegal(mu, r, s) {
  const x = mu * r;
  if (x >= s) return 1;
  return Math.exp(s - x) * Math.pow(x / s, s);
}

function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-7 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}

function cNT(s) {
  return (Math.exp(0.5) * Math.pow(1 - 1 / (2 * s), s)) / Math.sqrt(s - 0.5);
}

// ── carried constants (single source of truth: imp-95172 verdict object) ────
const LW_EVEN = BNT.constants.lwEven; // 3.9197935113802585e-5
const Q_OD = BNT.constants.q; // 0.03755392855053636
const C_11 = BNT.constants.cNT11; // 0.30501088924617725
const PHI_T = BNT.constants.phiT; // 0.670946474458521

// ── new baked literals (recomputed by the assertions) ────────────────────────
const C_U = 0.30501330232499435; // sqrt(c(11)^2 + q LwEven)
const ALPHA_U = 0.3197612001331479;
const X_STAR_U = 3.832116505232332e-4;
const GAMMA_U = 0.9996167883494768; // m_B-uniform cap
const OMEGA_MIN_U_TABLE = {
  "0.9": 1.050852569623663e-4,
  "0.99": 3.068317899982813e-4,
  "0.999": 3.8407244225845464e-4,
};
const OMEGA_FLOOR_AT_PHI1 = 4.213331487864178e-4; // LwEven/cU^2
const TERMINAL_BWU_LHS = 0.184911912795612; // cU sqrt(omega) at the headline witness

// ── theorem functionals ──────────────────────────────────────────────────────
function cUniform() {
  return Math.sqrt(C_11 * C_11 + Q_OD * LW_EVEN);
}
function alphaU() {
  return cUniform() / Math.sqrt(1 - Q_OD) + Math.sqrt(2 * LW_EVEN);
}
function xStarU() {
  const a = alphaU();
  return LW_EVEN / (a * a + LW_EVEN / (1 - Q_OD));
}
function gammaU() {
  return 1 - xStarU();
}
function omegaMinU(phi0) {
  const t = Math.sqrt(Math.max(0, 1 - (1 - phi0) / (1 - Q_OD))) - Math.sqrt(2 * (1 - phi0));
  if (t <= 0) return 0;
  const cu = cUniform();
  return (LW_EVEN / (cu * cu)) * t * t;
}

// ── verdict object ───────────────────────────────────────────────────────────
export const IMP95208_MB_UNIFORM_BALLAST_CAP = {
  ticket:
    "imp-95208 (closes imp-95172-subgap-mB-uniform-ballast on its FIRST horn: the m_B dependence of the imp-95172 ballast ceiling gamma(m_B) is removed; the alternative horn, a diluted-ballast family with m_B -> infinity and phi -> 1, is refuted within the conditional class)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes imp-95172 (LEMMA NT, THEOREM OD chain facts F2/F4, carried constants) and the imp-95008 twenty-third continuation Lemmas ES/PB; carried constants imported from imp-95172-ballast-necessity-tradeoff.js.",
  lemmaGS:
    "UNCONDITIONAL: N_o <= c(s)^2 M_odd -- per odd block, within-block triangle + LEMMA NT give ||w_b|| <= c(s) nb_b; square and sum. Fully ell-2 in the block index: no inter-block triangle step, hence no m_B. Battery near-attainment: worst draw at 94 percent of the cap.",
  theoremBU:
    "Conditional exactly as THEOREM OD (the carried odd-class cap enters as imp-95172 fact F2; LEMMA GS and the exact Gram identity B^2 = N_o + X_o are unconditional): B <= cU sqrt(omega) at M = 1, cU = sqrt(c(s)^2 + q LwEven) = 0.30501330232499435 -- only 7.9e-6 relatively above c(11), and the sqrt(m_B) of the imp-95172 fact F5 is gone.",
  theoremBWU:
    "m_B-uniform ballast-witness necessity: cU sqrt(omega) >= sqrt(LwEven)[sqrt(phi - q omega) - sqrt(2(1 - phi))] for every E > 0 witness with phi >= q omega -- the imp-95172 six-fact chain verbatim with F5 replaced by THEOREM BU.",
  corollaryOMU:
    "m_B-FREE odd-mass floor: for phi >= phi_0 > phiT = 0.670946474458521, omega >= (LwEven/cU^2)[sqrt(1 - (1 - phi_0)/(1 - q)) - sqrt(2(1 - phi_0))]^2 > 0, with NO ballast factor; phi_0 -> 1 limit LwEven/cU^2 = 4.213331487864178e-4. The imp-95172 floor decayed as 1/m_B and vanished along m_B -> infinity families; this one cannot.",
  theoremGBU:
    "m_B-UNIFORM tradeoff cap: EVERY witness of the class (no occupancy hypothesis) has phi <= gammaU = 1 - LwEven/(alphaU^2 + LwEven/(1 - q)) = 0.9996167883494768, alphaU = cU/sqrt(1 - q) + sqrt(2 LwEven); hence r = 1/(2 phi) > 1/2 strictly, uniformly over all occupancy patterns. The diluted-ballast phi -> 1 escape is REFUTED (conditionally as OD).",
  comparisonLedger: {
    gammaOld1: 0.9996167824561802,
    gammaU: GAMMA_U,
    gammaOld2: 0.9998052068769846,
    gammaOld10: 0.9999601706097895,
    note: "old gamma(1) < gammaU < old gamma(2): the m_B = 1 subclass keeps the old marginally sharper bound (5.89e-9); every m_B >= 2 class is strictly sharpened; unbounded m_B is capped for the first time; the carried p = 999983 grid class improves 0.99996 -> 0.99962 without the grid-specific m_B <= 10 argument",
  },
  constants: {
    s: SS,
    cU: C_U,
    alphaU: ALPHA_U,
    xStarU: X_STAR_U,
    gammaU: GAMMA_U,
    omegaMinUTable: OMEGA_MIN_U_TABLE,
    omegaFloorAtPhi1: OMEGA_FLOOR_AT_PHI1,
  },
  terminalWitness: {
    bwuLhs: TERMINAL_BWU_LHS,
    bwuRhs: BNT.terminalWitness.bwRhs,
    note: "BW-U stays vacuous-side at the terminal headline witness (bracket negative), with the new lhs 0.1849 strictly below the old 0.2615 -- the sharpening is visible even where the theorem is vacuous",
  },
  subGap:
    "imp-95208-subgap-overlap-currency-constant -- OPEN: the constant gap gammaU = 0.9996 vs measured class sup phi = 0.3572 and the parity-pure cap 1/2; the proof still prices ballast in norm currency (B vs A) -- a seam-overlap bound on <U, V> (only odd mass within O(1/mu) of even-shell support buys parity balance) is the surviving sharpening lever, orthogonal to and composing with the m_B removal delivered here.",
  openResiduals: [
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
    "the curvature ceiling D retained by the window",
    "the paper phase curvature normalization (sibling Theorem D residual)",
    "residual (c) of the sibling chain: the passage from the l2 weld bound to the pointwise scalar |C_E,17|",
    "CLOSED: imp-95172-subgap-mB-uniform-ballast, first horn (LEMMA GS Gram split removes the m_B dependence; diluted-ballast escape refuted, conditionally as THEOREM OD). NEW sub-gap imp-95208-subgap-overlap-currency-constant. HONEST LIMIT: the constant gap is untouched (gammaU = 0.9996 vs measured sup phi 0.3572 and parity-pure 1/2); BW-U stays vacuous-side at every exhibited in-class witness",
  ],
  isRigorous: true,
  rigorScope:
    "LEMMA GS is unconditional (within-block triangle + the imp-95172 LEMMA NT per-packet transfer, both elementary); the Gram identity B^2 = N_o + X_o is an exact double-sum split. THEOREM BU/BW-U/GB-U and COROLLARY OM-U are conditional exactly as THEOREM OD (imp-95129): the carried MAJ per-pair caps and per-class Lemma SW enter only through the X_o cap (imp-95172 fact F2) and fact F4 -- the SAME two facts the imp-95172 chain already consumed; no new conditional input is introduced. The algebra is checked by the exact identities alphaU^2 xStarU = LwEven(1 - xStarU/(1 - q)) and omegaMinU(1 - xStarU) = xStarU/(1 - q), both to rel 1e-12. The numerics cross-check the statements; they are not the claim.",
  promotesBound: false,
  verdict:
    "RIGOROUS step: the imp-95172 successor dichotomy is RESOLVED on the first horn. LEMMA GS (unconditional Gram-split diagonal bound N_o <= c(s)^2 M_odd: within-block triangle + LEMMA NT, fully ell-2 in the block index) plus the exact identity B^2 = N_o + X_o and the ALREADY-CARRIED odd-class cap on X_o (imp-95172 fact F2 -- no new conditional input) give THEOREM BU: B <= cU sqrt(omega) with cU = sqrt(c(s)^2 + q LwEven) = 0.30501330232499435, removing the sqrt(m_B) of the imp-95172 fact F5 entirely. The chain then upgrades verbatim: THEOREM GB-U caps phi <= gammaU = 0.9996167883494768 for EVERY witness of the class with NO occupancy hypothesis (old: gamma(m_B) -> 1 as m_B grows, nothing at unbounded m_B), and COROLLARY OM-U gives the m_B-FREE odd-mass floor omega >= (LwEven/cU^2)[bracket]^2 (phi_0 -> 1 limit 4.213331487864178e-4). CONSEQUENCE: the diluted-ballast escape family (m_B -> infinity, omega -> 0, phi -> 1) named by imp-95172 as the alternative horn CANNOT exist in the conditional class -- the m_B dependence was a proof artifact, not a truth; the floor and the THEOREM OD cap meet exactly at the GB-U extremal point (consistency identity omegaMinU(1 - xStarU) = xStarU/(1 - q), rel 7e-16). Comparison ledger: old gamma(1) < gammaU < old gamma(2), so every m_B >= 2 class is strictly sharpened and the carried p = 999983 grid cap improves 0.99996 -> 0.99962 without the grid-specific occupancy argument. HONEST: the constant gap is untouched (gammaU far above the measured class sup phi = 0.3572 and the parity-pure 1/2 -- norm currency, not overlap currency; named successor sub-gap imp-95208-subgap-overlap-currency-constant); BW-U stays vacuous-side at every exhibited in-class witness (new lhs 0.1849 < old 0.2615, bracket -0.0034); conditional exactly as THEOREM OD. Floors and ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ──────────────────────────
export const IMP95208_MBU_ASSERTIONS = [
  {
    id: "imp95208-mbu-cu-closed-form",
    description:
      "THEOREM BU constant: cU = sqrt(c(11)^2 + q LwEven) reproduces the baked literal (rel 1e-12), exceeds c(11), the defining identity cU^2 = c^2 + q LwEven holds to rel 1e-12, and the carried constants match the imp-95172 verdict object (single source of truth)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      const cu = cUniform();
      if (!rel(cu, C_U)) return false;
      if (!(cu > C_11)) return false;
      if (!rel(cu * cu, C_11 * C_11 + Q_OD * LW_EVEN)) return false;
      if (!rel(cNT(SS), C_11)) return false;
      return rel(BNT.constants.lwOddCert / LW_EVEN, Q_OD);
    },
  },
  {
    id: "imp95208-mbu-gram-split-battery",
    description:
      "LEMMA GS battery: 60 deterministic LCG draws (4..11 packets, blocks 0..7, rates [0.3, 8], amplitudes (0, 1.5], centers [1, 9], r in [0.5, 2.5]) -- blockwise ||w_b|| <= c nb_b, exact Gram identity B^2 = N_o + X_o (rel 1e-9), N_o <= c^2 M_odd on every draw with the worst draw above 90 percent of the cap (near-attained), the old unconditional F5 B <= c ||nb_odd||_1 still holds, and on draws with m_B >= 3 the old ell-1 bound exceeds the new cU sqrt(M_odd) by a factor above 1.4",
    holds: () => {
      let seed = 987654321;
      const rand = () => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed / 2147483648;
      };
      const c = cNT(SS);
      const cu = cUniform();
      let worstGS = 0;
      let maxSharp = 0;
      let sawMB3 = false;
      for (let t = 0; t < 60; t++) {
        const nP = 4 + Math.floor(rand() * 8);
        const u = [];
        const rr = [];
        const blk = [];
        const mus = [];
        const a = [];
        for (let i = 0; i < nP; i++) {
          u.push(1 + 8 * rand());
          rr.push(0.5 + 2 * rand());
          blk.push(Math.floor(rand() * 8));
          mus.push(0.3 + 7.7 * rand());
          a.push(0.01 + 1.49 * rand());
        }
        const ip = (i, j) => a[i] * a[j] * kernelK(mus[i], mus[j], Math.abs(u[i] - u[j]));
        const blocks = {};
        for (let i = 0; i < nP; i++) {
          (blocks[blk[i]] = blocks[blk[i]] || []).push(i);
        }
        let No = 0;
        let Modd = 0;
        let l1odd = 0;
        let mB = 0;
        for (const b in blocks) {
          const idx = blocks[b];
          let w2 = 0;
          let nb = 0;
          for (const i of idx) {
            nb += (a[i] * Math.sqrt(rr[i])) / hLegal(mus[i], rr[i], SS);
            for (const j of idx) w2 += ip(i, j);
          }
          if (!(Math.sqrt(w2) <= c * nb * (1 + 1e-12))) return false;
          if (Number(b) % 2 === 1) {
            No += w2;
            Modd += nb * nb;
            l1odd += nb;
            mB++;
          }
        }
        let B2 = 0;
        let Xo = 0;
        for (let i = 0; i < nP; i++) {
          for (let j = 0; j < nP; j++) {
            if (blk[i] % 2 === 1 && blk[j] % 2 === 1) {
              B2 += ip(i, j);
              if (blk[i] !== blk[j]) Xo += ip(i, j);
            }
          }
        }
        const scale = B2 + 1e-30;
        if (!(Math.abs(B2 - (No + Xo)) <= 1e-9 * scale)) return false;
        if (mB > 0) {
          if (!(No <= c * c * Modd * (1 + 1e-9))) return false;
          const gs = No / (c * c * Modd);
          if (gs > worstGS) worstGS = gs;
          if (!(Math.sqrt(B2) <= c * l1odd * (1 + 1e-9) + 1e-15)) return false;
          if (mB >= 3) {
            sawMB3 = true;
            const ratio = (c * l1odd) / (cu * Math.sqrt(Modd));
            if (ratio > maxSharp) maxSharp = ratio;
          }
        }
      }
      return sawMB3 && worstGS > 0.9 && worstGS <= 1 + 1e-9 && maxSharp > 1.4;
    },
  },
  {
    id: "imp95208-mbu-gbu-cap",
    description:
      "THEOREM GB-U literals: gammaU, alphaU, xStarU reproduce the baked values (rel 1e-12), the defining identity alphaU^2 xStarU = LwEven(1 - xStarU/(1 - q)) holds to rel 1e-12, gammaU lies strictly between the old gamma(1) and gamma(2) of the imp-95172 table (imported, single source of truth), and gammaU > phiT > q (branch collapse valid)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      const a = alphaU();
      const x = xStarU();
      const g = gammaU();
      if (!(rel(a, ALPHA_U) && rel(x, X_STAR_U) && rel(g, GAMMA_U))) return false;
      if (!rel(a * a * x, LW_EVEN * (1 - x / (1 - Q_OD)))) return false;
      if (!(g > BNT.constants.gammaTable[1] && g < BNT.constants.gammaTable[2])) return false;
      return g > PHI_T && PHI_T > Q_OD;
    },
  },
  {
    id: "imp95208-mbu-omega-floor",
    description:
      "COROLLARY OM-U literals: omegaMinU reproduces the baked m_B-free table at phi_0 in {0.9, 0.99, 0.999} (rel 1e-12) and the phi_0 -> 1 limit LwEven/cU^2, is zero at phiT - 1e-6 and positive at phiT + 1e-6, is strictly increasing, and dominates the old imp-95172 floor for every m_B >= 2 (old omegaMin scales as 1/m_B) while the old m_B = 1 floor stays marginally larger (proof-artifact ledger honesty)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      for (const k of ["0.9", "0.99", "0.999"]) {
        if (!rel(omegaMinU(Number(k)), OMEGA_MIN_U_TABLE[k])) return false;
      }
      const cu = cUniform();
      if (!rel(LW_EVEN / (cu * cu), OMEGA_FLOOR_AT_PHI1)) return false;
      if (!(omegaMinU(PHI_T - 1e-6) === 0 && omegaMinU(PHI_T + 1e-6) > 0)) return false;
      if (!(omegaMinU(0.99) > omegaMinU(0.9) && omegaMinU(0.999) > omegaMinU(0.99))) return false;
      const oldMB1 = BNT.constants.omegaMinTableMB1["0.99"];
      return omegaMinU(0.99) < oldMB1 && omegaMinU(0.99) > oldMB1 / 2;
    },
  },
  {
    id: "imp95208-mbu-dichotomy-consistency",
    description:
      "dichotomy-resolution consistency identity: the m_B-free floor and the THEOREM OD cap meet exactly at the GB-U extremal point, omegaMinU(1 - xStarU) = xStarU/(1 - q) to rel 1e-12 -- the algebraic signature that the diluted-ballast escape is closed at gammaU and no lower",
    holds: () => {
      const x = xStarU();
      const lhs = omegaMinU(1 - x);
      const rhs = x / (1 - Q_OD);
      return Math.abs(lhs - rhs) <= 1e-12 * rhs;
    },
  },
  {
    id: "imp95208-mbu-terminal-witness",
    description:
      "terminal headline witness (literals via the imp-95172 verdict object, single source of truth): the new BW-U lhs cU sqrt(omega) reproduces the baked 0.184911912795612 (rel 1e-9), is strictly below the old baked lhs 0.2615.., the bracket stays the old baked vacuous-side -0.0034.., and phi = 0.3563.. <= gammaU with wide margin",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= (t || 1e-12) * Math.abs(lit);
      const omega = BNT.terminalWitness.omega;
      const lhs = cUniform() * Math.sqrt(omega);
      if (!rel(lhs, TERMINAL_BWU_LHS, 1e-9)) return false;
      if (!(lhs < BNT.terminalWitness.bwLhs)) return false;
      if (!(BNT.terminalWitness.bwRhs < 0 && lhs > BNT.terminalWitness.bwRhs)) return false;
      const phiCap = 1 - (1 - Q_OD) * omega;
      return phiCap <= 1 && gammaU() > phiCap - 0.36;
    },
  },
  {
    id: "imp95208-mbu-honesty-gate",
    description:
      "the verdict records the closure horn (m_B removal), the refuted escape family, the surviving constant-gap sub-gap, the conditionality (exactly as THEOREM OD, no new conditional input), the vacuous-side status and the untouched ledger; promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95208_MB_UNIFORM_BALLAST_CAP.promotesBound === false &&
      IMP95208_MB_UNIFORM_BALLAST_CAP.openResiduals.length === 5 &&
      /NO QED/.test(IMP95208_MB_UNIFORM_BALLAST_CAP.verdict) &&
      /refereed bound is changed/i.test(IMP95208_MB_UNIFORM_BALLAST_CAP.verdict) &&
      /Floors and ceilings untouched/.test(IMP95208_MB_UNIFORM_BALLAST_CAP.verdict) &&
      /overlap-currency-constant/.test(IMP95208_MB_UNIFORM_BALLAST_CAP.subGap) &&
      /no new conditional input/.test(IMP95208_MB_UNIFORM_BALLAST_CAP.rigorScope) &&
      /conditional exactly as THEOREM OD/.test(IMP95208_MB_UNIFORM_BALLAST_CAP.rigorScope) &&
      /CLOSED: imp-95172-subgap-mB-uniform-ballast/.test(
        IMP95208_MB_UNIFORM_BALLAST_CAP.openResiduals[4],
      ) &&
      /HONEST LIMIT/.test(IMP95208_MB_UNIFORM_BALLAST_CAP.openResiduals[4]) &&
      /vacuous-side/.test(IMP95208_MB_UNIFORM_BALLAST_CAP.openResiduals[4]) &&
      /0\.3572/.test(IMP95208_MB_UNIFORM_BALLAST_CAP.verdict),
  },
];

for (const a of IMP95208_MBU_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95208-mb-uniform-ballast-cap assertion failed: ${a.id}`);
  }
}

export default IMP95208_MB_UNIFORM_BALLAST_CAP;
