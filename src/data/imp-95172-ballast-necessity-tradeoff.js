/**
 * imp-95172 - RIGOROUS step -- LEMMA NT (norm-transfer closed form) +
 * THEOREM BW (ballast-witness necessity) + THEOREM GB (bounded-ballast
 * tradeoff cap): the FIRST quantitative leg of
 * imp-95130-subgap-phi-conditional-odd-mass, the sub-gap carried OPEN by
 * every module from imp-95130 through imp-95171.
 *
 * CONTEXT. The twenty-third imp-95008 continuation (THEOREM ER) factored
 * the surviving headline residual r = 1/(2 phi), phi = E/(2 LwEven M),
 * into attainment x occupancy x parity-balance and named the tradeoff
 * sub-gap; imp-95113 measured sup phi = 0.3572 over 15000 draws but proved
 * nothing uniform; imp-95129 (THEOREM OD) proved the dilution half
 * phi <= 1 - (1 - q) omega with omega = M_odd/M and q = LwOddCert/LwEven =
 * 0.03755392855053636; imp-95130 refuted a uniform omega_min > 0 over all
 * E > 0 witnesses (parity-pure E > 0 family with omega = 0, sup phi
 * 3.37e-29) and posed the surviving form: omega >= omega_min(phi_0) over
 * witnesses with phi >= phi_0. The long imp-95131..95171 series then worked
 * the parity-pure rate-threshold branch; the phi-conditional leg itself
 * stayed OPEN. THIS module proves it (with an explicit occupied-odd-block
 * count m_B in the constant) and combines it with THEOREM OD into the first
 * uniform witness-side ceiling gamma(m_B) < 1 on phi -- the parent
 * imp-95113-subgap-tradeoff-proof-vs-scan asked exactly for a witness-side
 * ceiling on phi = E/(2 Lw M) sharper than the trivial 1, or a phi -> 1
 * family; the phi -> 1 escape is CLOSED for every bounded-ballast family.
 *
 * SETTING (identical to the sibling chain; model family sigma = 1,
 * theta = 10, beta = 1/3, c = v = D = 1, s = sigma + theta = 11). A witness
 * is a finite family of packets a_i exp(-mu_i |u - u_i|), a_i >= 0,
 * assigned to dyadic blocks; w_b = sum of the packets of block b (an L2
 * function on the line); U = sum over even b of w_b, V = sum over odd b;
 * A = ||U||_2, B = ||V||_2; N_e = sum over even b of ||w_b||^2;
 * X_e / X_o = same-parity cross-block couplings (Lemma ES); X_env =
 * X_e + X_o; E = 2 X_env - ||U - V||^2 (Lemma PB equality form); the
 * legality-weighted block masses are nb_b = sum_{i in b} a_i sqrt(r_i) /
 * h(mu_i r_i, s) with h(x, s) = 1 for x >= s and exp(s - x)(x/s)^s for
 * x < s; M = sum nb_b^2, M_odd = sum over odd b, omega = M_odd / M;
 * m_B = number of odd blocks with nb_b > 0. Carried constants: LwEven =
 * 3.9197935113802585e-5 (twenty-second lambda_max sandwich), LwOddCert =
 * 1.4720364545923026e-6 (imp-95129, all odd blocks), q = LwOddCert/LwEven.
 * Everything below is stated at M = 1 (phi, omega are scale-invariant).
 *
 * LEMMA NT (norm transfer -- UNCONDITIONAL, new closed form). For s >= 1,
 *   sup over x > 0 of h(x, s) / sqrt(x) = c(s)
 *     = exp(1/2) (1 - 1/(2s))^s / sqrt(s - 1/2) ,
 * attained at x = s - 1/2. PROOF. On x >= s: h = 1, so the branch value is
 * x^(-1/2), decreasing, sup s^(-1/2) at x = s. On 0 < x <= s: ln f(x) =
 * (s - x) + (s - 1/2) ln x - s ln s has derivative -1 + (s - 1/2)/x, a
 * unique interior critical point x = s - 1/2 (in (0, s) for s >= 1), and
 * the second derivative -(s - 1/2)/x^2 < 0 makes it the branch maximum,
 * with value c(s). Branch comparison: ln( c(s) sqrt(s) ) = 1/2 +
 * (s - 1/2) ln(1 - 1/(2s)); with y = 1/(2s) this equals
 * 1/2 + (1 - y) ln(1 - y)/(2y) = sum over k >= 2 of y^(k-1)/(2 k (k-1)),
 * a positive series (from the expansion (1 - y) ln(1 - y) = -y +
 * sum_{k>=2} y^k/(k(k-1))), so c(s) > s^(-1/2) strictly and the interior
 * branch wins. QED.
 *   CONSEQUENCE (per-packet norm transfer): ||a exp(-mu |. - u0|)||_2 =
 * a / sqrt(mu) <= c(s) a sqrt(r) / h(mu r, s) for EVERY mu, r > 0 (divide:
 * the ratio is h(x, s)/sqrt(x) at x = mu r). By the triangle inequality
 * and a_i >= 0,
 *   B = ||V||_2 <= c(s) ||nb_odd||_1 <= c(s) sqrt(m_B M_odd)
 *     = c(s) sqrt(m_B omega)   (at M = 1),
 * the last step by Cauchy-Schwarz over the m_B occupied odd blocks.
 * c(11) = 0.30501088924617725.
 *
 * THEOREM BW (ballast-witness necessity -- conditional exactly as THEOREM
 * OD: carried MAJ per-pair caps + per-class Lemma SW; Lemmas NT/PB/ES
 * unconditional). Every witness of the class with E > 0, M = 1 and
 * phi >= q omega satisfies
 *   c(s) sqrt(m_B omega) >= sqrt(LwEven) [ sqrt(phi - q omega)
 *                                          - sqrt(2 (1 - phi)) ] .   (BW)
 * PROOF. Write D = ||U - V||^2 and x = 1 - phi. Six facts:
 *   (F1) D = 2 (X_env - phi LwEven)  [Lemma PB equality form E =
 *        2 X_env - D and phi = E/(2 LwEven)];
 *   (F2) X_o <= capOdd <= LwOddCert omega = q LwEven omega  [carried
 *        per-pair MAJ caps + imp-95129 per-class Lemma SW];
 *   (F3) A^2 = N_e + X_e >= X_e = X_env - X_o >= phi LwEven + D/2
 *        - q LwEven omega >= LwEven (phi - q omega)  [F1, F2, D >= 0];
 *   (F4) D <= 2 LwEven (x - (1 - q) omega) <= 2 LwEven x  [F1 and
 *        X_env <= capSum <= LwEven (1 - omega) + q LwEven omega, the
 *        THEOREM OD part (i) split];
 *   (F5) B <= c(s) sqrt(m_B omega)  [Lemma NT];
 *   (F6) B >= A - sqrt(D)  [triangle: sqrt(D) = ||U - V|| >= A - B].
 * Chain: c(s) sqrt(m_B omega) >= B >= A - sqrt(D) >=
 * sqrt(LwEven (phi - q omega)) - sqrt(2 LwEven x). QED. (If the bracket is
 * negative the statement is vacuous but true; no further branch needed.)
 *
 * COROLLARY OM (the requested phi-conditional odd-mass floor). For every
 * witness of the class with phi >= phi_0 > phiT = 1 - (1-q)/(3 - 2q) =
 * 0.670946474458521:
 *   omega >= omegaMin(phi_0, m_B)
 *     = (LwEven / (c(s)^2 m_B)) [ sqrt(1 - (1 - phi_0)/(1 - q))
 *                                 - sqrt(2 (1 - phi_0)) ]^2 > 0 .
 * PROOF. THEOREM OD gives omega <= (1 - phi)/(1 - q), so phi - q omega >=
 * 1 - (1 - phi)/(1 - q); both bracket terms are monotone in phi, so the
 * right side of (BW) is bounded below by its value at phi_0, positive
 * exactly for phi_0 > phiT; solve (BW) for omega. QED. Values at m_B = 1:
 * omegaMin(0.9) = 1.0508691972274367e-4, omegaMin(0.99) =
 * 3.068366449870559e-4, omegaMin(0.999) = 3.840785194233919e-4 -- this is
 * the imp-95130 surviving leg, delivered with a 1/m_B ballast factor.
 *
 * THEOREM GB (bounded-ballast tradeoff cap). Every witness of the class
 * with at most m_B >= 1 occupied odd blocks satisfies
 *   phi <= gamma(m_B) = 1 - LwEven / ( alpha(m_B)^2 + LwEven/(1 - q) ) ,
 *   alpha(m_B) = c(s) sqrt(m_B / (1 - q)) + sqrt(2 LwEven) ,
 * and hence r = 1/(2 phi) >= 1/(2 gamma(m_B)) > 1/2 strictly.
 * PROOF. If phi <= q omega then phi <= q < gamma. Otherwise insert
 * omega <= x/(1 - q) (THEOREM OD) on BOTH sides of (BW): the left side is
 * at most c(s) sqrt(m_B x/(1 - q)) and the bracket is at least
 * sqrt(1 - x/(1 - q)) - sqrt(2 x) (if 1 - x/(1 - q) < 0 then
 * x > 1 - q, phi < q < gamma, done). Rearranged: alpha(m_B) sqrt(x) >=
 * sqrt(LwEven) sqrt(1 - x/(1 - q)); both sides nonnegative, square:
 * alpha^2 x >= LwEven (1 - x/(1 - q)), i.e. x >= xStar(m_B) =
 * LwEven/(alpha^2 + LwEven/(1 - q)). QED. Values: gamma(1) =
 * 0.9996167824561802, gamma(2) = 0.9998052068769846, gamma(10) =
 * 0.9999601706097895. On the carried grid p = 999983 every witness has
 * m_B <= 10 (odd blocks 1..19), so gamma(10) is uniform over the whole
 * fixed-grid class. A family with phi -> 1 must have m_B -> infinity
 * while omega -> 0 (THEOREM OD) and ||nb_odd||_1 >= sqrt(LwEven)/c(s)
 * (1 - o(1)) ~ 0.0205 -- unboundedly many occupied odd blocks carrying a
 * fixed ell-1 mass that vanishes in ell-2: increasingly DILUTED ballast.
 *
 * COROLLARY PP (parity-pure caps). A pure-even witness (no odd packets)
 * has D = A^2 exactly, so E = X_e - N_e <= X_e <= capEven <= LwEven and
 * phi <= 1/2; a pure-odd witness has phi <= q/2 = 0.01877696427526818.
 * Consistency: the imp-95130 parity-pure E > 0 family measured sup phi =
 * 3.37e-29 <= 1/2; the imp-95113 battery sup phi = 0.3572 < 1/2.
 *
 * WHAT THIS BUYS. (1) imp-95130-subgap-phi-conditional-odd-mass is
 * DELIVERED in its quantitative form (COROLLARY OM), with an explicit
 * occupied-odd-block count in the constant -- the first proved omega floor
 * conditioned on phi. (2) The parent tradeoff sub-gap gets its first
 * uniform ceiling gamma(m_B) < 1: no bounded-ballast MAJ family reaches
 * phi = 1, and on the carried fixed grid the cap is unconditional-in-m_B.
 * (3) The currency bridge imp-95129 named as the missing tool (K-mass vs
 * nb-mass) is supplied by LEMMA NT: one closed-form constant c(s)
 * converts legality-weighted block mass into L2 mass.
 *
 * HONEST LIMITS. (a) The constants are NOT optimized: the proof compares
 * NORMS (B vs A) where parity balance actually needs the overlap <U, V> --
 * packets buy balance only through mass within O(1/mu) of the even-shell
 * support, so gamma(m_B) = 0.9996.. sits far above the measured class sup
 * phi = 0.3572 (imp-95113) and even above the parity-pure cap 1/2. (b) The
 * 1/m_B in omegaMin and the m_B in gamma are real proof artifacts (the
 * ell-1/ell-2 gap in LEMMA NT); removing them needs a seam-localized
 * overlap bound -- named successor sub-gap. (c) Conditionality is exactly
 * THEOREM OD's: carried MAJ per-pair caps and the certified LwEven
 * sandwich; LwOddCert is the imp-95129 self-contained certificate; Lemmas
 * NT, PB, ES and the triangle steps are unconditional. (d) Model-family
 * constants (theta = 10), not the paper Section 4.5 packets. (e) At the
 * only exhibited E > 0 in-class witnesses, (BW) is VACUOUS-side (the
 * terminal headline witness has bracket -0.0034 < 0 <= lhs 0.2615): the
 * theorem bites only near phi = 1, which is exactly its job.
 *
 * SUB-GAP (explicitly named, NOT closed):
 *   imp-95172-subgap-mB-uniform-ballast -- remove the m_B dependence:
 *   replace LEMMA NT + Cauchy-Schwarz by a seam-overlap bound (only the
 *   odd-packet mass within O(1/mu) of even-shell support contributes to
 *   <U, V>, so the balance-buying ballast should be priced in overlap
 *   currency, not norm currency), pushing gamma toward the parity-pure
 *   1/2; OR exhibit a diluted-ballast family (m_B -> infinity, omega -> 0,
 *   ||nb_odd||_1 ~ 0.0205) with phi -> 1, which would prove the m_B
 *   dependence essential.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) LEMMA NT approached by a 400000-point
 * grid scan of h(x, s)/sqrt(x) on (0, 5s]: closed form dominates every
 * sample and matches the grid sup to 1.2e-10 with argmax at s - 1/2; the
 * per-packet transfer is verified on a 400-point (mu, r) log grid spanning
 * six decades. (2) The branch-comparison series positivity is verified as
 * ln(c(s) sqrt(s)) > 0 for every s in 2..40. (3) The (BW) chain facts
 * (F1)-(F6) that are unconditional (norm identities, triangle, NT) are
 * stress-tested by a deterministic 40-draw LCG battery including pure-even
 * draws (D = A^2, E = X_e - N_e reproduced); the conditional facts
 * (F2)/(F4) are the carried OD chain, not re-proved here. (4) The GB
 * algebra is checked as an exact identity: alpha^2 xStar =
 * LwEven (1 - xStar/(1 - q)) to rel 1e-12 for every tabulated m_B, and
 * gamma(m_B) > phiT > q so the branch collapse phi <= max(q, 1 - xStar) =
 * gamma is valid. (5) The terminal headline witness (imported from the
 * twenty-third module, single source of truth) obeys OD, GB and the
 * vacuous-side (BW) evaluation with baked literals. (6) SCOPE HONESTY:
 * nothing here moves a floor or a ceiling; the known class sup phi
 * remains the measured 0.3572; gamma is a cap near 1, not a pin.
 *
 * The numerics below CROSS-CHECK the lemma statements; they are not the
 * claim. Import-light (no heavy bundle; the only import is the sibling
 * twenty-third verdict module for the terminal-witness literals). Changes
 * no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

import ERS from "./imp-95008-witness-erealization-split.js";

// ── shared conventions (identical to the sibling modules) ────────────────────
const SIGMA = 1;
const THETA = 10;
const SS = SIGMA + THETA;

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

// ── LEMMA NT closed form ─────────────────────────────────────────────────────
function cNT(s) {
  return (Math.exp(0.5) * Math.pow(1 - 1 / (2 * s), s)) / Math.sqrt(s - 0.5);
}

// ── carried constants ────────────────────────────────────────────────────────
const LW_EVEN = 3.9197935113802585e-5; // twenty-second certified sandwich
const LW_ODD_CERT = 1.4720364545923026e-6; // imp-95129 all-odd-blocks certificate
const Q_OD = 0.03755392855053636; // imp-95129 baked q = LwOddCert/LwEven

// ── new baked literals (recomputed by the assertions) ────────────────────────
const C_NT_11 = 0.30501088924617725; // c(11), attained at x = 10.5
const PHI_T = 0.670946474458521; // bracket-positivity threshold of COROLLARY OM
const GAMMA_TABLE = {
  1: 0.9996167824561802,
  2: 0.9998052068769846,
  3: 0.999869183273583,
  4: 0.999901457505294,
  10: 0.9999601706097895,
};
const OMEGA_MIN_TABLE_MB1 = {
  "0.9": 1.0508691972274367e-4,
  "0.99": 3.068366449870559e-4,
  "0.999": 3.840785194233919e-4,
};
const PURE_ODD_CAP = 0.01877696427526818; // q/2
const TERMINAL_OMEGA = 0.36752951508189907; // M_odd/M of the headline witness
const TERMINAL_OD_CAP = 0.6462726620676998; // 1 - (1-q) omega (imp-95129 literal)
const TERMINAL_BW_LHS = 0.26150286605269807; // c sqrt(2 omega)
const TERMINAL_BW_RHS = -0.0034394128728317034; // vacuous-side bracket

// ── theorem functionals ──────────────────────────────────────────────────────
function alphaGB(mB) {
  return cNT(SS) * Math.sqrt(mB / (1 - Q_OD)) + Math.sqrt(2 * LW_EVEN);
}
function xStarGB(mB) {
  const a = alphaGB(mB);
  return LW_EVEN / (a * a + LW_EVEN / (1 - Q_OD));
}
function gammaGB(mB) {
  return 1 - xStarGB(mB);
}
function omegaMin(phi0, mB) {
  const t = Math.sqrt(Math.max(0, 1 - (1 - phi0) / (1 - Q_OD))) - Math.sqrt(2 * (1 - phi0));
  if (t <= 0) return 0;
  return (LW_EVEN / (cNT(SS) * cNT(SS) * mB)) * t * t;
}

// ── verdict object ───────────────────────────────────────────────────────────
export const IMP95172_BALLAST_NECESSITY_TRADEOFF = {
  ticket:
    "imp-95172 (delivers the quantitative form of imp-95130-subgap-phi-conditional-odd-mass, OPEN since imp-95130 and carried by every module through imp-95171, and the first uniform witness-side ceiling gamma(m_B) < 1 on phi for the parent imp-95113-subgap-tradeoff-proof-vs-scan)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes THEOREM OD (imp-95129: phi <= 1 - (1-q) omega, LwOddCert all-odd-blocks certificate) and Lemmas ES/PB (imp-95008 twenty-third continuation); terminal-witness literals imported from imp-95008-witness-erealization-split.js.",
  lemmaNT:
    "UNCONDITIONAL new closed form: sup over x > 0 of h(x, s)/sqrt(x) = c(s) = exp(1/2)(1 - 1/(2s))^s / sqrt(s - 1/2), attained at x = s - 1/2 (interior calculus + positive-series branch comparison ln(c(s) sqrt(s)) = sum_{k>=2} y^(k-1)/(2k(k-1)) > 0, y = 1/(2s)). Consequence: every packet has L2 norm at most c(s) times its legality-weighted nb contribution, so B = ||V|| <= c(s) ||nb_odd||_1 <= c(s) sqrt(m_B M_odd). c(11) = 0.30501088924617725 -- the K-mass vs nb-mass currency bridge imp-95129 named as the missing tool.",
  theoremBW:
    "Conditional exactly as THEOREM OD (carried MAJ per-pair caps + per-class Lemma SW; NT/PB/ES and triangle steps unconditional): every E > 0 witness with phi >= q omega satisfies c(s) sqrt(m_B omega) >= sqrt(LwEven)[sqrt(phi - q omega) - sqrt(2(1 - phi))] -- the six-fact chain F1-F6 in the header (Lemma PB equality form, odd-class cap, A^2 >= X_e, capSum split, Lemma NT, triangle).",
  corollaryOM:
    "For phi >= phi_0 > phiT = 0.670946474458521: omega >= (LwEven/(c(s)^2 m_B))[sqrt(1 - (1 - phi_0)/(1 - q)) - sqrt(2(1 - phi_0))]^2 > 0 -- the imp-95130 surviving leg omega_min(phi_0), delivered with a 1/m_B ballast factor. omegaMin(0.999, 1) = 3.840785194233919e-4.",
  theoremGB:
    "Every witness with at most m_B >= 1 occupied odd blocks has phi <= gamma(m_B) = 1 - LwEven/(alpha(m_B)^2 + LwEven/(1 - q)), alpha(m_B) = c(s) sqrt(m_B/(1 - q)) + sqrt(2 LwEven): gamma(1) = 0.9996167824561802, gamma(10) = 0.9999601706097895 (uniform over the whole carried p = 999983 grid class, odd blocks <= 10). The phi -> 1 escape requires m_B -> infinity with omega -> 0 and fixed odd ell-1 mass ~ sqrt(LwEven)/c(s) = 0.0205: unboundedly diluted ballast.",
  corollaryPP:
    "Parity-pure caps: pure-even phi <= 1/2 (D = A^2 exactly, E = X_e - N_e <= capEven <= LwEven M); pure-odd phi <= q/2 = 0.01877696427526818. Consistent with the imp-95130 family (sup phi 3.37e-29) and the imp-95113 battery (sup phi 0.3572).",
  constants: {
    s: SS,
    cNT11: C_NT_11,
    lwEven: LW_EVEN,
    lwOddCert: LW_ODD_CERT,
    q: Q_OD,
    phiT: PHI_T,
    gammaTable: GAMMA_TABLE,
    omegaMinTableMB1: OMEGA_MIN_TABLE_MB1,
    pureOddCap: PURE_ODD_CAP,
    oddL1FloorAtPhi1: "sqrt(LwEven)/c(s) = 0.020527 (ell-1 nb mass any phi -> 1 family must carry in odd blocks)",
  },
  terminalWitness: {
    omega: TERMINAL_OMEGA,
    odCap: TERMINAL_OD_CAP,
    bwLhs: TERMINAL_BW_LHS,
    bwRhs: TERMINAL_BW_RHS,
    note: "BW is VACUOUS-side at the terminal headline witness (bracket negative): the theorem bites only near phi = 1, which is its job; phi = 0.3563 obeys OD (0.6463) and GB (0.99981) with wide margin",
  },
  subGap:
    "imp-95172-subgap-mB-uniform-ballast -- OPEN: remove the m_B dependence via a seam-overlap bound (price the balance-buying ballast in overlap currency <U, V> instead of norm currency, pushing gamma toward the parity-pure 1/2), OR exhibit a diluted-ballast family (m_B -> infinity, omega -> 0, ||nb_odd||_1 ~ 0.0205) with phi -> 1, proving the m_B dependence essential; plus the constant gap gamma(m_B) = 0.9996 vs measured class sup 0.3572.",
  openResiduals: [
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
    "the curvature ceiling D retained by the window",
    "the paper phase curvature normalization (sibling Theorem D residual)",
    "residual (c) of the sibling chain: the passage from the l2 weld bound to the pointwise scalar |C_E,17|",
    "DELIVERED: imp-95130-subgap-phi-conditional-odd-mass in quantitative form (COROLLARY OM, with a 1/m_B ballast factor) and the first uniform tradeoff ceiling gamma(m_B) < 1 (THEOREM GB). NEW sub-gap imp-95172-subgap-mB-uniform-ballast. HONEST LIMIT: constants unoptimized (norm-currency proof; gamma = 0.9996 vs measured sup phi 0.3572 and parity-pure cap 1/2); BW is vacuous-side at every exhibited in-class E > 0 witness; conditionality exactly as THEOREM OD",
  ],
  isRigorous: true,
  rigorScope:
    "LEMMA NT is unconditional single-variable calculus with a positive-series branch comparison (proof in the header). THEOREM BW and its corollaries are conditional exactly as THEOREM OD (imp-95129): the carried MAJ per-pair envelope caps and per-class Lemma SW aggregation enter through facts F2 and F4; facts F1 (Lemma PB equality form), F3 (norm identity), F5 (Lemma NT + Cauchy-Schwarz) and F6 (triangle) are unconditional. THEOREM GB and COROLLARY OM are elementary algebra on BW + OD (identity alpha^2 xStar = LwEven(1 - xStar/(1 - q)) asserted to rel 1e-12). The m_B-boundedness hypothesis is essential to the PROOF (ell-1/ell-2 gap) and named as the successor sub-gap; whether it is essential to the TRUTH is open. The numerics cross-check the statements; they are not the claim.",
  promotesBound: false,
  verdict:
    "RIGOROUS step: LEMMA NT (new unconditional closed form c(s) = exp(1/2)(1 - 1/(2s))^s / sqrt(s - 1/2) for the norm-transfer sup h(x, s)/sqrt(x), attained at x = s - 1/2; c(11) = 0.30501088924617725) supplies the K-mass vs legality-mass currency bridge that imp-95129 named as the missing tool, and THEOREM BW (six-fact chain: PB equality form + odd-class cap + norm identity + capSum split + NT + triangle) converts it into the phi-conditional odd-mass floor imp-95130 asked for: COROLLARY OM gives omega >= (LwEven/(c(s)^2 m_B))[sqrt(1 - (1 - phi_0)/(1 - q)) - sqrt(2(1 - phi_0))]^2 > 0 for phi_0 > 0.670946474458521 -- the sub-gap imp-95130-subgap-phi-conditional-odd-mass, carried OPEN by every module from imp-95130 through imp-95171, is DELIVERED in quantitative form (with an explicit 1/m_B ballast factor). Combined with THEOREM OD this closes to THEOREM GB, the FIRST uniform witness-side tradeoff ceiling: phi <= gamma(m_B) = 1 - LwEven/(alpha^2 + LwEven/(1 - q)) < 1 for every bounded-ballast witness (gamma(1) = 0.9996167824561802; gamma(10) = 0.9999601706097895 uniform over the whole carried p = 999983 grid class), so no bounded-ballast MAJ family reaches phi = 1 and any phi -> 1 family must carry unboundedly many occupied odd blocks with vanishing ell-2 but fixed ell-1 (~0.0205) ballast. COROLLARY PP adds the parity-pure caps phi <= 1/2 (even) and q/2 (odd). HONEST: constants unoptimized (gamma sits far above the measured class sup phi = 0.3572); BW is vacuous-side at every exhibited in-class witness; conditional exactly as THEOREM OD; new sub-gap imp-95172-subgap-mB-uniform-ballast named. Floors and ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ──────────────────────────
export const IMP95172_BNT_ASSERTIONS = [
  {
    id: "imp95172-bnt-lemma-nt-closed-form",
    description:
      "LEMMA NT: the closed form c(s) = exp(1/2)(1 - 1/(2s))^s / sqrt(s - 1/2) dominates a 400000-point grid scan of h(x, s)/sqrt(x) on (0, 5s], matches the grid sup to rel 1e-9 with argmax within grid resolution of s - 1/2, reproduces the baked c(11), and exceeds the x >= s branch value s^(-1/2); the branch-comparison series positivity ln(c(s) sqrt(s)) > 0 holds for every s in 2..40",
    holds: () => {
      const s = SS;
      const c = cNT(s);
      if (Math.abs(c - C_NT_11) > 1e-12 * C_NT_11) return false;
      let best = 0;
      let bx = 0;
      const n = 400000;
      for (let i = 1; i <= n; i++) {
        const x = (i * 5 * s) / n;
        const f = hLegal(1, x, s) / Math.sqrt(x);
        if (f > c * (1 + 1e-12)) return false;
        if (f > best) {
          best = f;
          bx = x;
        }
      }
      if (!(best >= c * (1 - 1e-9))) return false;
      if (!(Math.abs(bx - (s - 0.5)) < (2 * 5 * s) / n)) return false;
      if (!(1 / Math.sqrt(s) < c)) return false;
      for (let t = 2; t <= 40; t++) {
        if (!(Math.log(cNT(t) * Math.sqrt(t)) > 0)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95172-bnt-per-packet-transfer",
    description:
      "the per-packet norm transfer 1/sqrt(mu) <= c(s) sqrt(r)/h(mu r, s) holds on a 400-point (mu, r) log grid spanning mu in [1e-3, 1e3], r in [1e-2, 1e2]",
    holds: () => {
      const c = cNT(SS);
      for (let i = 0; i < 20; i++) {
        const mu = Math.pow(10, -3 + (6 * i) / 19);
        for (let j = 0; j < 20; j++) {
          const r = Math.pow(10, -2 + (4 * j) / 19);
          const lhs = 1 / Math.sqrt(mu);
          const rhs = (c * Math.sqrt(r)) / hLegal(mu, r, SS);
          if (!(lhs <= rhs * (1 + 1e-12))) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95172-bnt-carried-constants",
    description:
      "the carried constants reproduce: q = LwOddCert/LwEven equals the imp-95129 baked 0.03755392855053636 (rel 1e-12), LwOddCert < LwEven, and the pure-odd cap q/2 reproduces",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      return (
        rel(LW_ODD_CERT / LW_EVEN, Q_OD) &&
        LW_ODD_CERT < LW_EVEN &&
        rel(Q_OD / 2, PURE_ODD_CAP)
      );
    },
  },
  {
    id: "imp95172-bnt-gamma-table",
    description:
      "THEOREM GB literals: gamma(m_B) reproduces the baked table (rel 1e-12) for m_B in {1, 2, 3, 4, 10}, the defining identity alpha^2 xStar = LwEven(1 - xStar/(1 - q)) holds to rel 1e-12, gamma is strictly increasing in m_B, and every gamma lies in (phiT, 1) with gamma(1) > phiT > q (validating the branch collapse phi <= max(q, 1 - xStar) = gamma)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      let prev = 0;
      for (const mB of [1, 2, 3, 4, 10]) {
        const a = alphaGB(mB);
        const x = xStarGB(mB);
        const g = gammaGB(mB);
        if (!rel(g, GAMMA_TABLE[mB])) return false;
        if (!rel(a * a * x, LW_EVEN * (1 - x / (1 - Q_OD)))) return false;
        if (!(g > prev && g < 1 && g > PHI_T)) return false;
        prev = g;
      }
      return PHI_T > Q_OD;
    },
  },
  {
    id: "imp95172-bnt-omega-min",
    description:
      "COROLLARY OM literals: omegaMin(phi_0, 1) reproduces the baked values at phi_0 in {0.9, 0.99, 0.999} (rel 1e-12), is zero at phiT - 1e-6 and positive at phiT + 1e-6 (bracket threshold phiT = 1 - (1-q)/(3-2q) reproduces to rel 1e-12), is strictly increasing in phi_0, and scales exactly as 1/m_B",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      const phiTcheck = 1 - (1 - Q_OD) / (3 - 2 * Q_OD);
      if (!rel(phiTcheck, PHI_T)) return false;
      for (const k of ["0.9", "0.99", "0.999"]) {
        if (!rel(omegaMin(Number(k), 1), OMEGA_MIN_TABLE_MB1[k])) return false;
      }
      if (!(omegaMin(PHI_T - 1e-6, 1) === 0 && omegaMin(PHI_T + 1e-6, 1) > 0)) return false;
      if (!(omegaMin(0.99, 1) > omegaMin(0.9, 1) && omegaMin(0.999, 1) > omegaMin(0.99, 1))) return false;
      return rel(omegaMin(0.99, 4), omegaMin(0.99, 1) / 4);
    },
  },
  {
    id: "imp95172-bnt-terminal-witness",
    description:
      "the terminal headline witness (literals imported from the twenty-third module) obeys the chain: omega = M_odd/M = 0.36752951508189907 (rel 1e-12), the THEOREM OD cap 1 - (1-q) omega = 0.6462726620676998 >= phi = 0.3563.., phi <= gamma(2) (its occupied odd blocks are {1, 3}), and the (BW) evaluation reproduces the baked vacuous-side literals (lhs 0.2615.. >= 0 > rhs -0.0034..)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= (t || 1e-12) * Math.abs(lit);
      const M = ERS.measuredSplit.internals.M;
      const mOdd = ERS.measuredSplit.occupancySubSplit.mOdd;
      const phi = ERS.measuredSplit.factors.phi;
      const omega = mOdd / M;
      if (!rel(omega, TERMINAL_OMEGA)) return false;
      const odCap = 1 - (1 - Q_OD) * omega;
      if (!rel(odCap, TERMINAL_OD_CAP, 1e-9)) return false;
      if (!(phi <= odCap && phi <= gammaGB(2))) return false;
      const lhs = cNT(SS) * Math.sqrt(2 * omega);
      const rhs =
        Math.sqrt(LW_EVEN) * (Math.sqrt(phi - Q_OD * omega) - Math.sqrt(2 * (1 - phi)));
      return rel(lhs, TERMINAL_BW_LHS, 1e-9) && rel(rhs, TERMINAL_BW_RHS, 1e-9) && lhs >= rhs && rhs < 0;
    },
  },
  {
    id: "imp95172-bnt-unconditional-battery",
    description:
      "40-draw deterministic LCG battery (blocks 0..5, rates [0.3, 8], amplitudes (0, 1.5], centers [1, 9], r in [0.5, 2.5]) of the UNCONDITIONAL chain facts: per-packet norm transfer, B <= c(s) ||nb_odd||_1, |A - B| <= sqrt(D), E = 2 X_env - D (exact identity, checked to the measured cancellation depth), plus 5 forced pure-even draws with D = A^2 and E = X_e - N_e reproduced",
    holds: () => {
      let seed = 424242421;
      const rand = () => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed / 2147483648;
      };
      const c = cNT(SS);
      for (let t = 0; t < 45; t++) {
        const pureEven = t >= 40;
        const nP = 3 + Math.floor(rand() * 6);
        const u = [];
        const rr = [];
        const blk = [];
        const mus = [];
        const a = [];
        for (let i = 0; i < nP; i++) {
          u.push(1 + 8 * rand());
          rr.push(0.5 + 2 * rand());
          const b = Math.floor(rand() * 6);
          blk.push(pureEven ? 2 * Math.floor(b / 2) : b);
          mus.push(0.3 + 7.7 * rand());
          a.push(0.01 + 1.49 * rand());
        }
        // per-packet transfer
        for (let i = 0; i < nP; i++) {
          if (!(1 / Math.sqrt(mus[i]) <= ((c * Math.sqrt(rr[i])) / hLegal(mus[i], rr[i], SS)) * (1 + 1e-12)))
            return false;
        }
        // parity-split norms and couplings via the exact kernel
        const ip = (i, j) => a[i] * a[j] * kernelK(mus[i], mus[j], Math.abs(u[i] - u[j]));
        let A2 = 0;
        let B2 = 0;
        let AB = 0;
        let Ne = 0;
        let No = 0;
        let Xe = 0;
        let Xo = 0;
        let E = 0;
        for (let i = 0; i < nP; i++) E -= (a[i] * a[i]) / mus[i];
        for (let i = 0; i < nP; i++) {
          for (let j = 0; j < nP; j++) {
            const v = ip(i, j);
            const pi = blk[i] % 2;
            const pj = blk[j] % 2;
            if (pi === 0 && pj === 0) A2 += v;
            else if (pi === 1 && pj === 1) B2 += v;
            else AB += v;
            if (blk[i] === blk[j]) {
              if (pi === 0) Ne += v;
              else No += v;
            } else if (pi === pj && i < j) {
              if (pi === 0) Xe += 2 * v;
              else Xo += 2 * v;
            }
            if (i < j) E += 2 * (blk[i] === blk[j] ? -1 : 1) * v;
          }
        }
        const A = Math.sqrt(A2);
        const B = Math.sqrt(B2);
        const D = A2 + B2 - AB;
        const scale = A2 + B2;
        // Lemma NT aggregate: B <= c ||nb_odd||_1
        let l1odd = 0;
        for (let i = 0; i < nP; i++) {
          if (blk[i] % 2 === 1) l1odd += (a[i] * Math.sqrt(rr[i])) / hLegal(mus[i], rr[i], SS);
        }
        if (!(B <= c * l1odd * (1 + 1e-9) + 1e-15)) return false;
        // triangle
        if (!(Math.abs(A - B) <= Math.sqrt(Math.max(D, 0)) * (1 + 1e-9) + 1e-12)) return false;
        // Lemma PB equality form E = 2 X_env - D (cancellation-aware tolerance)
        if (!(Math.abs(E - (2 * (Xe + Xo) - D)) <= 1e-9 * scale)) return false;
        // norm identities A^2 = N_e + X_e (and odd twin)
        if (!(Math.abs(A2 - (Ne + Xe)) <= 1e-9 * scale)) return false;
        if (!(Math.abs(B2 - (No + Xo)) <= 1e-9 * scale)) return false;
        if (pureEven) {
          if (!(B === 0 && Math.abs(D - A2) <= 1e-12 * scale)) return false;
          if (!(Math.abs(E - (Xe - Ne)) <= 1e-9 * scale)) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95172-bnt-honesty-gate",
    description:
      "the verdict scopes the conditionality (exactly as THEOREM OD), names the delivered sub-gap and the new m_B-uniform successor, records the vacuous-side status at exhibited witnesses and the unoptimized-constant gap, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95172_BALLAST_NECESSITY_TRADEOFF.promotesBound === false &&
      IMP95172_BALLAST_NECESSITY_TRADEOFF.openResiduals.length === 5 &&
      /NO QED/.test(IMP95172_BALLAST_NECESSITY_TRADEOFF.verdict) &&
      /refereed bound is changed/i.test(IMP95172_BALLAST_NECESSITY_TRADEOFF.verdict) &&
      /Floors and ceilings untouched/.test(IMP95172_BALLAST_NECESSITY_TRADEOFF.verdict) &&
      /mB-uniform-ballast/.test(IMP95172_BALLAST_NECESSITY_TRADEOFF.subGap) &&
      /conditional exactly as THEOREM OD/.test(IMP95172_BALLAST_NECESSITY_TRADEOFF.rigorScope) &&
      /HONEST LIMIT/.test(IMP95172_BALLAST_NECESSITY_TRADEOFF.openResiduals[4]) &&
      /DELIVERED/.test(IMP95172_BALLAST_NECESSITY_TRADEOFF.openResiduals[4]) &&
      /vacuous-side/.test(IMP95172_BALLAST_NECESSITY_TRADEOFF.openResiduals[4]) &&
      /0\.3572/.test(IMP95172_BALLAST_NECESSITY_TRADEOFF.verdict),
  },
];

for (const a of IMP95172_BNT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95172-ballast-necessity-tradeoff assertion failed: ${a.id}`);
  }
}

export default IMP95172_BALLAST_NECESSITY_TRADEOFF;
