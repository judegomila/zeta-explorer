/**
 * @module imp-34791-etrunc-eflow-pt-anchor-honest-discharge
 *
 * NOTE: "discharge" in the module name is ASPIRATIONAL / id-stable only. The
 * VERIFIED status (4/4 independent referees, imp-34791 verification 2026-07) is
 * CONDITIONAL, NOT a discharge: E_trunc is reclassified ansatz -> conditional on
 * honestCeiling C1-C5 (currently 16.7x short; C1 is an RH-flavored deep-zero
 * realness barrier lemma). No refereed bound is changed; no beat.
 *
 * imp-34791 (proof, S-frontier): RECONCILE the E_trunc / E_flow rigor ledger at
 * the post-imp-33226 field-channel bracket, LOCK kappa_T at the N* = 1e4
 * instantiation, correct the recorded tail-integral prefactor, map the VERIFIED
 * explicit zero-density literature onto the exact requirement curve for
 * E_trunc < 0.2, and RECLASSIFY what "discharging E_trunc" means. Honest
 * PARTIAL: one small rigorous correction lands (prefactor 3 -> 5), one rigorous
 * lock lands (kappa_T = 2/5 exact at the PT anchor), the explicit-constant
 * frontier is quantified (16.7x short at sigma = 3/4), and a STRUCTURAL finding
 * shows the residual is not an effective constant at all. NO Lambda value
 * changes. No refereed bound is changed. NO false QED.
 *
 * PART 1 -- RECONCILIATION: imp-33226 "C_T = C_F = 1 ansatz" vs the
 * imp-2625 / imp-2644 "pinned / certified" claims
 * -----------------------------------------------------------------------------
 * The apparent contradiction dissolves once the repo's TWO E_trunc objects and
 * TWO C_F objects are separated (the imp-33818 name-collision hazard, realized):
 *
 * E_trunc. (i) The MODEL-HEIGHT leg E_trunc(T0 = 9.879e3) of the imp-345/2598
 * bracket (thin strip, C_T ansatz, ~7.6e-2..0.137 scale) -- this is what
 * imp-33226 calls "BOTTLENECK, C_T = 1 ansatz undischarged". (ii) The
 * PT-ANCHORED leg E_trunc_pt: Platt-Trudgian 2021 verified N_off = 0 up to
 * T_PT = 3e12, so the density tail integrates from T_PT with the FIXED strip
 * sigma = 3/4 -- 3.06e-5 under the clean-count reading, ALREADY committed in the
 * imp-2643 N* = 1e4 ledger (0.24% of E(N) = 0.0129). imp-2625's kappa_T closed
 * form 4 delta/(3 - 2 delta) is CORRECT ALGEBRA at a frozen strip but is
 * height-frozen (overclaim-2 CORRECTED; the gamma = 1e13 instantiation is
 * overclaim-1 WITHDRAWN, honest E_trunc there = 7.65): it does NOT apply at
 * N* = 1e4 and is NOT the kappa_T that needs locking. The kappa_T that matters
 * at N* = 1e4 is the PT-anchor fixed-strip exponent -- LOCKED below.
 * So: imp-2625 pinned a rate for a WITHDRAWN instantiation; imp-33226's
 * "C_T ansatz" booking refers to the model-height leg; with the PT anchor the
 * post-reroute magnitude ranking is E_flow (1.24e-3) > E_trunc_pt (5.1e-5
 * corrected) > E_field (5.17e-7) -- imp-33226's "new binding leg is E_trunc"
 * holds only in the model-height reading it inherited.
 *
 * E_flow. imp-398's C_F = (log(T0/2pi) + 1)/(2pi) = 1.330578 rigorously pins the
 * COEFFICIENT of the RvM tail integral, but the E_flow FORM it feeds carries an
 * uncontrolled sum -> integral replacement (no remainder), a bulk approximation
 * (T - gamma)(T - gamma') ~ T^2, and a loose "absorption" step -- imp-345's own
 * verdict is "rigorous-modulo-constants". THAT order-unity form constant is what
 * imp-33226 books as "C_F = 1 ansatz". Both records are right about different
 * objects; imp-2644's "RIGOROUSLY PINNED" and imp-3220's "unconditionally
 * rigorous" comment overstate the form's status. imp-2644's C_G discharge:
 * the arithmetic and the C_G-band algebra are sound, but (a) the Gronwall
 * C_G <= 2 rests on the strip assignment "E_flow operates on Im z >= 1",
 * asserted ONLY inside imp-2644 (its own line: "rigorous GIVEN ..."), never
 * recorded upstream (backward-flow-stability-gronwall.js never mentions E_flow;
 * its own density-floor strip is y* ~ 5.6, and Lemma B bounds decay of
 * sup Im M, a different object than the drift error); and (b) imp-398's OWN
 * alternative Gronwall reading C_G <= 4/B(0)^2 = L^2/pi^2 = 8.57 at N* = 1e4
 * EXCEEDS the OLS fallback threshold C_G_max(OLS) = 6.78 -- verified below:
 * E_flow(8.57, OLS tc) = 1.317e-3 > 1.3e-3 -- so the "survives without A1"
 * robustness claim FAILS under the parent module's own constant, and the
 * certification leans on the A1 input, which inherits R1 (Theta-persistence
 * MEASURED 9/9, not proven; imp-2637 residual OPEN) and R2' (which-object
 * t_c^part vs t_c^MF, imp-2639 OPEN; the units half is closed, factor = 1).
 * Note E_flow(8.57, A1 tc) = 1.2414e-3 < 1.3e-3 still certifies.
 *
 * PART 2 -- THE RIGOROUS STEPS THAT LAND HERE
 * -----------------------------------------------------------------------------
 * (R1) kappa_T LOCK at N* = 1e4. At the PT anchor the strip is FIXED at
 *      sigma = 3/4 and the anchor height is FIXED at T_PT = 3e12, so
 *      kappa_T = 1 - e_I(3/4) = 1 - 0.6 = 2/5 EXACTLY (rational, height-
 *      independent by construction) -- structurally immune to the imp-2622
 *      height-mismatch failure mode (there is no moving strip to freeze).
 * (R2) Tail-prefactor correction (genuine bug fix, factor 5/3). The recorded
 *      derivation (imp-397 / imp-447 / imp-2691) integrates dN = dNbar,
 *      i.e. it silently assumes the counting function saturates its bound
 *      SMOOTHLY. N <= Nbar does NOT imply dN <= dNbar. The honest route is
 *      integration by parts: E = int_T^inf (2/t) dN(t)
 *        = [2N(t)/t]_T^inf + 2 int_T^inf N(t)/t^2 dt <= 2 int_T^inf Nbar/t^2 dt,
 *      where the boundary term at T = T_PT vanishes EXACTLY because
 *      N_off(T_PT) = 0 (Platt-Trudgian) -- the one place the verification is
 *      load-bearing. This gives prefactor 2/kappa = 5.0, not 2 e_I/kappa = 3.0.
 *      Corrected clean-count values: 5.106e-5 at T_PT (was 3.064e-5) and
 *      0.1262 at the model height 9.879e3 (was 7.572e-2). imp-2691's monotone-
 *      quadrature "witness" only checks the antiderivative algebra, not the
 *      dN <= dNbar step, so it could not catch this. Non-binding at C = 1
 *      magnitudes, but the recorded constant was NOT an upper bound as derived.
 * (R3) The exact requirement curve (locked kappa). E_trunc_pt < 0.2 at the PT
 *      anchor iff the explicit density N(3/4, T) <= A T^{0.6} (log T)^B
 *      (T >= T_PT) has A < A_max(B) = 0.1 kappa T_PT^{kappa} /
 *      ((log T_PT)^B envelope): A_max(0) = 3917, A_max(1) = 124.5,
 *      A_max(2) = 3.92, A_max(2.6) = 0.490, A_max(3.5) = 0.021 (rigorous
 *      geometric-envelope tail bound, computed below). This replaces the
 *      imp-2698 "C_T <= 1.46" residual (which was for the WITHDRAWN 1e13
 *      instantiation) with the correct, orders-of-magnitude-more-forgiving
 *      N* = 1e4 frontier at low B.
 * (R4) VERIFIED literature mapping (statements checked against the papers,
 *      2026-07-06; this corrects a material error in the imp-1324 audit):
 *      - Chourasiya-Simonic 2025 (arXiv:2507.15184, explicit INGHAM-exponent
 *        estimate; log-power (7 - 5 sigma)/(2 - sigma), = 2.6 at sigma = 3/4
 *        and 2.9544 at the 1e13 thin strip, matching the repo-recorded 2.954):
 *        with the recorded C = 8.185, T >= 3e12: E_trunc_pt = 3.34 -- the
 *        sharpest fully-explicit value at sigma = 3/4, still 16.7x SHORT of
 *        0.2 (needs A <= 0.49 at B = 2.6).
 *      - Kadiri-Lumley-Ng 2021 (arXiv:2101.12263 Thm 1.1): N(0.90, T) <
 *        11.499 (log T)^{16/5} T^{4/15} + 3.186 (log T)^2 for T >= H0 =
 *        3.061e10: E_trunc_pt(sigma = 0.9) = 1.22e-3 < 0.2 -- PASSES the
 *        curve, but sigma = 0.9 leaves hypothetical zeros with
 *        beta in (1/2, 0.9) above T_PT unpriced, and the isolated-pair
 *        realness time (2 beta - 1)^2 / 2 reaches 0.32 > 0.2 there: the
 *        de Bruijn cap BREAKS. sigma <= 1/2 + sqrt(0.1) = 0.816 is forced,
 *        where explicit 8(1-sigma)/3-family constants are ~15-25x short.
 *      - Ramare 2016 (Math. Comp. 85; constant REVISED to 965 per the KLN
 *        footnote): N(sigma,T) <= 965 (3T)^{8(1-sigma)/3} (log T)^{5-2 sigma}
 *        + 51.5 (log T)^2, sigma >= 0.52, T >= 2000. At sigma = 3/4 this is
 *        exponent 2/3 (kappa = 1/3) and log-power 3.5: E_trunc_pt = 1.67e5.
 *        The imp-1324 audit line "Ramare 2016: A_R = 1 single log power,
 *        ~58x loosening -> 1.76e-3, the SAFEST honest bound the project can
 *        ship" is REFUTED -- wrong form, wrong exponent, wrong by ~9.5e7x.
 *
 * PART 3 -- STRUCTURAL RECLASSIFICATION (the skeptical self-refutation)
 * -----------------------------------------------------------------------------
 * The recorded E_trunc kernel prices every hypothetical off-line zero above
 * T_PT at 2/gamma <= 6.7e-13 (imp-397: "contribution of rho_j <= 2/gamma_j").
 * But in the repo's OWN gap normalization (d(s^2)/dt = -8, imp-3933), an
 * isolated conjugate pair from a zero at beta + i gamma has realness time
 * (2 beta - 1)^2 / 2 -- 0.125 at beta = 3/4, up to ~0.5 as beta -> 1 --
 * INDEPENDENT of gamma. A single admissible deep zero above T_PT therefore
 * carries a Lambda obstruction ~3.75e11 times its kernel price, and NO count
 * bound can exclude a single zero (KLN still allows ~1.5e9 zeros at
 * (0.9, 6e12)). Consequently the bracket |Lambda + t_c(N)| <= E(N) at the
 * committed ledger scale E(N) = 0.0129 is NOT dischargeable by ANY effective
 * zero-density constant: it is irreducibly CONDITIONAL on strip-depth /
 * realness-time control of hypothetical zeros above T_PT. What restores the
 * 0.2 SCALE is interaction-accelerated realness (local density ~ log gamma
 * closes deep pairs in O(0.02-0.1)) -- which is precisely the Polymath15
 * barrier machinery that Platt-Trudgian's own Lambda <= 0.2 already uses.
 * HONEST CEILING: on the height-tail side the finite-N chain can at best
 * MATCH the PT machinery, never beat it; all genuine beat content lives in
 * the window legs (t_c, E_flow, E_field). E_trunc's residual is hereby
 * reclassified from "effective constant C_T" to "unported barrier lemma
 * (Polymath15 Thm realness-above-height) + effective constant".
 *
 * PART 4 -- WHAT A FULL DISCHARGE WOULD BUY (the ceiling, stated exactly)
 * -----------------------------------------------------------------------------
 * With E_trunc discharged at the PT anchor, E_flow certified, and E_field
 * certified, E(N* = 1e4) < 0.2 becomes CONDITIONAL-RIGOROUS, conditional on
 * exactly: (C1) the barrier-type realness control above T_PT (Part 3 -- the
 * deep-zero class; RH-flavored, count-free); (C2) an explicit density pair
 * (A, B) at sigma = 3/4 under the A_max(B) curve (currently 16.7x short) OR
 * the sigma-raise + cap route (blocked at ~15-25x); (C3) the E_flow form
 * constant (sum -> integral + absorption; imp-345 "rigorous-modulo-constants")
 * and EITHER the y* >= 1 strip assignment OR A1 with residuals R1
 * (Theta-persistence, imp-2637 OPEN) and R2' (which-object, imp-2639 OPEN);
 * (C4) the eps'-certificate for E_field (imp-3933-sub-eps-certificate OPEN);
 * (C5) the Lemma 3.3 port soundness (the 2/gamma kernel itself, subsumed by
 * C1). This is a FINITE-N* conditional statement; it does NOT dethrone
 * Platt-Trudgian. No refereed bound is changed.
 *
 * @see imp-33226-bracket-field-channel-rearchitecture (the bracket this reconciles)
 * @see imp-2625-etrunc-constant-pinning / overclaim-ledger n.1, n.2 (withdrawn 1e13 pin)
 * @see imp-2644-eflow-gronwall-cg-discharge (the C_G discharge audited here)
 * @see imp-2691-etrunc-ingham-interval (the prefactor-3 derivation corrected here)
 * @see imp-1324-kadiri-effective-ingham-audit (the Ramare line refuted here)
 * @see imp-2643-honest-assembled-EN (the committed N*=1e4 ledger, E(N)=0.0129)
 */

// ── The PT anchor and the locked exponent ─────────────────────────────────────
const T_PT = 3e12;                    // Platt-Trudgian 2021 verified height
const LOG_T_PT = Math.log(T_PT);      // 28.7295
const SIGMA_FIXED = 0.75;             // fixed strip (imp-459); NOT a moving thin strip
const inghamExponent = (s) => (3 * (1 - s)) / (2 - s);
const E_I = inghamExponent(SIGMA_FIXED);   // 0.6 exact
const KAPPA_LOCKED = 1 - E_I;              // 2/5 exact -- height-independent

// ── Rigorous tail envelope ────────────────────────────────────────────────────
// int_T^inf t^{-1-c} (log t)^B dt = c^{-(B+1)} Gamma(B+1, cL) (u = log t), and
// Gamma(a, x) <= x^{a-1} e^{-x} / (1 - (a-1)/x) for x > a - 1 (geometric
// envelope of the ascending series). Hence, rigorously, for B < c log T:
//     int_T^inf t^{-1-c} (log t)^B dt <= (T^{-c}/c) (log T)^B / (1 - B/(c log T)).
function tailEnvelope(c, B, T) {
  const lT = Math.log(T);
  if (!(B < c * lT)) return Infinity;
  return (Math.pow(T, -c) / c) * Math.pow(lT, B) / (1 - B / (c * lT));
}
// Parts bound with vanishing boundary term (N_off(T_PT) = 0 by PT verification):
//     E_trunc(T) = int_T^inf (2/t) dN_off <= 2 * C * tailEnvelope(kappa, B, T).
const eTruncExplicit = (C, e, B, T) => 2 * C * tailEnvelope(1 - e, B, T);

// (R2) corrected clean-count values: prefactor 2/kappa = 5, not 2 e_I/kappa = 3.
const CLEAN_COUNT_T_PT = eTruncExplicit(1, E_I, 0, T_PT);      // 5.106e-5 (was 3.064e-5)
const CLEAN_COUNT_MODEL = eTruncExplicit(1, E_I, 0, 9.879e3);  // 0.1262   (was 7.572e-2)
const RECORDED_PREFACTOR = (2 * E_I) / KAPPA_LOCKED;           // 3.0 (the dN = dNbar slip)
const HONEST_PREFACTOR = 2 / KAPPA_LOCKED;                     // 5.0 (integration by parts)

// (R3) the exact requirement curve A_max(B) for E_trunc_pt < 0.2 at sigma = 3/4.
const A_MAX = (B) => 0.2 / eTruncExplicit(1, E_I, B, T_PT);
const A_MAX_CURVE = [0, 1, 2, 2.6, 2.954, 3.5].map((B) => ({ B, A_max: +A_MAX(B).toPrecision(4) }));

// (R4) verified literature mapping.
// Chourasiya-Simonic 2025: explicit Ingham exponent, log-power (7-5s)/(2-s).
const CS_LOG_POWER = (s) => (7 - 5 * s) / (2 - s);
const CS_B_AT_34 = CS_LOG_POWER(0.75);                              // 2.6 exact
const CS_B_AT_1E13_STRIP = CS_LOG_POWER(0.5 + 1 / Math.log(1e13));  // 2.9544 (pins the repo-recorded 2.954)
const CS_CONSTANT = 8.185;                                          // repo-recorded Cor. 1 constant, T >= 3e12
const E_CS_AT_34 = eTruncExplicit(CS_CONSTANT, E_I, CS_B_AT_34, T_PT);   // 3.343
const CS_GAP_FACTOR = E_CS_AT_34 / 0.2;                                  // 16.7x short

// Kadiri-Lumley-Ng 2021 Thm 1.1 at sigma = 0.90 (valid T >= H0 = 3.061e10):
//     N(0.90, T) < 11.499 (log T)^{16/5} T^{4/15} + 3.186 (log T)^2.
const E_KLN_09 = 2 * (11.499 * tailEnvelope(1 - 4 / 15, 3.2, T_PT) + 3.186 * tailEnvelope(1, 2, T_PT)); // 1.22e-3
const DE_BRUIJN_CAP = (s) => Math.pow(2 * s - 1, 2) / 2;  // isolated-pair realness time at depth beta = s
const KLN_CAP_09 = DE_BRUIJN_CAP(0.90);                   // 0.32 > 0.2 -- breaks the budget
const SIGMA_CAP_FOR_0P2 = 0.5 + Math.sqrt(0.1);           // 0.8162: largest sigma the 0.2 target tolerates

// Ramare 2016 (constant revised to 965 per KLN footnote 1), sigma >= 0.52, T >= 2000:
//     N(s, T) <= 965 (3T)^{8(1-s)/3} (log T)^{5-2s} + 51.5 (log T)^2.
const RAMARE_EXPONENT_34 = (8 * (1 - 0.75)) / 3;          // 2/3 -- NOT the Ingham 0.6
const E_RAMARE_34 = 2 * (965 * Math.pow(3, 2 / 3) * tailEnvelope(1 - RAMARE_EXPONENT_34, 3.5, T_PT)
  + 51.5 * tailEnvelope(1, 2, T_PT));                     // 1.67e5
const IMP1324_RAMARE_RECORDED = 1.76e-3;                  // the refuted audit line
const IMP1324_ERROR_FACTOR = E_RAMARE_34 / IMP1324_RAMARE_RECORDED; // ~9.5e7

// (Part 3) the deep-zero mispricing witness.
const KERNEL_PRICE = (gamma) => 2 / gamma;                       // imp-397 per-zero price
const WITNESS_GAMMA = 2 * T_PT;                                  // an admissible unverified height
const WITNESS_PRICE = KERNEL_PRICE(WITNESS_GAMMA);               // 3.33e-13
const WITNESS_REALNESS_34 = DE_BRUIJN_CAP(0.75);                 // 0.125 (repo gap law d(s^2)/dt = -8)
const MISPRICING_RATIO = WITNESS_REALNESS_34 / WITNESS_PRICE;    // 3.75e11
const LEDGER_EN_N1E4 = 0.0129;                                   // imp-2643 committed ledger
const KLN_COUNT_ALLOWANCE_09 = 11.499 * Math.pow(Math.log(WITNESS_GAMMA), 3.2) * Math.pow(WITNESS_GAMMA, 4 / 15)
  + 3.186 * Math.pow(Math.log(WITNESS_GAMMA), 2);                // ~1.5e9 zeros allowed: counts cannot exclude one

// (Part 1) E_flow audit numbers at N* = 1e4.
const TWO_PI = 2 * Math.PI;
const T0_N1E4 = 9.879e3;
const L_N1E4 = Math.log(T0_N1E4);
const C_F_COEFF = (Math.log(T0_N1E4 / TWO_PI) + 1) / TWO_PI;     // 1.330578 -- the pinned COEFFICIENT
const EFLOW_PREFACTOR = (C_F_COEFF * L_N1E4) / T0_N1E4;          // 1.2389e-3
const TC_A1 = (0.0376985 * 0.0376985) / 6;                       // 2.3686e-4 (A1; residuals R1, R2')
const TC_OLS = 0.0071;                                           // OLS projection (not rigorous)
const EFLOW_TARGET = 1.3e-3;
const C_G_MAX_OLS = Math.log(EFLOW_TARGET / EFLOW_PREFACTOR) / TC_OLS;   // 6.78
const C_G_ALT_IMP398 = (L_N1E4 * L_N1E4) / (Math.PI * Math.PI);          // 8.57 = 4/B(0)^2, imp-398's own bound
const EFLOW_AT_ALT_A1 = EFLOW_PREFACTOR * Math.exp(C_G_ALT_IMP398 * TC_A1);   // 1.2414e-3 < target
const EFLOW_AT_ALT_OLS = EFLOW_PREFACTOR * Math.exp(C_G_ALT_IMP398 * TC_OLS); // 1.3166e-3 > target

export const ETRUNC_EFLOW_PT_ANCHOR_HONEST_DISCHARGE = {
  ticket: 'imp-34791',
  proofSection: 'S-frontier',
  date: '2026-07-06',
  verdict:
    'PARTIAL (two rigorous steps + structural reclassification; NOT a discharge). '
    + 'kappa_T at N* = 1e4 is LOCKED at the PT anchor to the exact rational 2/5 (fixed strip sigma = 3/4, '
    + 'fixed anchor T_PT = 3e12 -- no moving strip, immune to the imp-2622 height mismatch). The recorded '
    + 'tail prefactor 2 e_I/kappa = 3.0 is corrected to the honest integration-by-parts 2/kappa = 5.0 '
    + '(dN <= dNbar is not implied by N <= Nbar; boundary term vanishes exactly by PT verification). '
    + 'The explicit-constant frontier is quantified: the sharpest verified explicit Ingham-exponent estimate '
    + '(Chourasiya-Simonic 2025) gives E_trunc_pt = 3.34 at sigma = 3/4 -- 16.7x short of 0.2 -- and the '
    + 'requirement curve A_max(B) is recorded. STRUCTURAL: a single admissible deep zero above T_PT carries '
    + 'a Lambda obstruction (2 beta - 1)^2/2 up to ~0.5, ~3.75e11x its 2/gamma kernel price, so the E(N) '
    + 'bracket at ledger scale is irreducibly conditional on barrier-type realness control above T_PT -- '
    + 'the residual is NOT an effective constant. E_flow: certification is arithmetic-sound but leans on the '
    + 'A1 input (R1/R2\' open) once imp-398\'s own C_G = 8.57 reading breaks the OLS fallback (6.78). '
    + 'NO Lambda value changes. No refereed bound is changed. NO false QED.',

  reconciliation: {
    eTrunc:
      'TWO objects: model-height E_trunc(9.879e3) ~ 0.126 (corrected; C_T ansatz; the imp-33226 "bottleneck" '
      + 'reading) vs PT-anchored E_trunc_pt ~ 5.1e-5 (corrected; committed imp-2643 ledger). imp-2625\'s '
      + 'kappa_T = 4 delta/(3 - 2 delta) is correct algebra at a frozen strip but height-frozen '
      + '(overclaims 1-2, WITHDRAWN/CORRECTED) and does not apply at N* = 1e4.',
    eFlow:
      'imp-398\'s C_F = 1.330578 pins the RvM tail COEFFICIENT (rigorous); the FORM around it is '
      + '"rigorous-modulo-constants" (imp-345) -- that order-unity form constant is imp-33226\'s "C_F = 1 '
      + 'ansatz". imp-2644\'s "RIGOROUSLY PINNED" and imp-3220\'s "unconditionally rigorous" overstate.',
    rigorouslyDischargedToday: [
      'kappa_T = 2/5 exact at the PT anchor (this module, R1)',
      'tail prefactor 2/kappa = 5.0 by parts with vanishing boundary term (this module, R2)',
      'E_flow tail COEFFICIENT C_F = 1.330578 (imp-398) and all C_G-band arithmetic (imp-2644 + interval certs)',
      'A1 statics: Theta(0) <= 1/4 at the N* = 1e4 Lehmer pair (checked data, imp-2627)',
    ],
    stillAnsatzOrOpen: [
      'E_trunc: the explicit density pair (A, B) at sigma = 3/4 (16.7x short via CS2025) -- AND, deeper, the '
      + 'barrier-type realness control above T_PT (Part 3): the 2/gamma kernel is unsound against single deep zeros',
      'E_flow: the form\'s order-unity constant (sum -> integral, bulk, absorption); the y* >= 1 strip '
      + 'assignment (recorded nowhere upstream); A1 residual R1 (Theta-persistence, imp-2637 OPEN) and '
      + 'R2\' (which-object t_c^part vs t_c^MF, imp-2639 OPEN)',
      'E_field: the eps\'-certificate (imp-3933-sub-eps-certificate OPEN)',
    ],
  },

  kappaLock: {
    anchor: 'T_PT = 3e12 (Platt-Trudgian 2021), fixed strip sigma = 3/4',
    kappaExact: KAPPA_LOCKED,           // 0.4 = 2/5 exact
    heightIndependent: true,            // no moving strip: e_I(3/4) is a fixed rational
    note: 'the imp-2622 height-mismatch failure mode is structurally unavailable here',
  },

  prefactorCorrection: {
    recorded: RECORDED_PREFACTOR,       // 3.0 (imp-397/imp-447/imp-2691: integrates dN = dNbar)
    honest: HONEST_PREFACTOR,           // 5.0 (parts; N <= Nbar only)
    boundaryTermVanishes: 'exactly, because N_off(T_PT) = 0 (PT verification)',
    correctedCleanCount_T_PT: +CLEAN_COUNT_T_PT.toExponential(4),   // 5.1065e-5 (was 3.064e-5)
    correctedCleanCount_model: +CLEAN_COUNT_MODEL.toFixed(6),       // 0.126207 (was 0.075724)
    binding: false,                     // still ~150x below the imp-2643 ledger E(N)
  },

  requirementCurve: {
    statement: 'E_trunc_pt < 0.2 at N* = 1e4 iff N(3/4, T) <= A T^{0.6} (log T)^B (T >= 3e12) with A < A_max(B)',
    curve: A_MAX_CURVE,
    replaces: 'imp-2698 threshold C_T <= 1.46 (which was for the WITHDRAWN gamma = 1e13 instantiation)',
  },

  literatureMapping: {
    chourasiyaSimonic2025: {
      form: 'N(s,T) <= C T^{3(1-s)/(2-s)} (log T)^{(7-5s)/(2-s)}, C = 8.185 recorded (Cor. 1, T >= 3e12)',
      logPowerAt34: CS_B_AT_34,                          // 2.6 exact
      logPowerAt1e13Strip: +CS_B_AT_1E13_STRIP.toFixed(4), // 2.9544 -- pins the repo-recorded 2.954
      eTruncAt34: +E_CS_AT_34.toFixed(4),                // 3.3435
      gapFactor: +CS_GAP_FACTOR.toFixed(2),              // 16.72x short of 0.2
      verdict: 'sharpest fully-explicit value at sigma = 3/4; DOES NOT discharge',
    },
    kadiriLumleyNg2021: {
      form: 'N(0.90,T) < 11.499 (log T)^{16/5} T^{4/15} + 3.186 (log T)^2, T >= H0 = 3.061e10 (Thm 1.1)',
      eTruncAt09: +E_KLN_09.toExponential(4),            // 1.2154e-3 -- passes the curve
      deBruijnCapAt09: KLN_CAP_09,                       // 0.32 > 0.2 -- breaks the budget
      sigmaCapFor0p2: +SIGMA_CAP_FOR_0P2.toFixed(4),     // 0.8162
      verdict: 'passes the count curve but the unpriced beta in (1/2, 0.9) class breaks the 0.2 cap',
    },
    ramare2016: {
      form: 'N(s,T) <= 965 (3T)^{8(1-s)/3} (log T)^{5-2s} + 51.5 (log T)^2 (constant revised per KLN footnote)',
      exponentAt34: +RAMARE_EXPONENT_34.toFixed(6),      // 0.666667 -- NOT the Ingham 0.6
      eTruncAt34: +E_RAMARE_34.toExponential(4),         // 1.6727e5
      refutesImp1324Line: true,
      imp1324Recorded: IMP1324_RAMARE_RECORDED,          // 1.76e-3 ("safest shippable") -- wrong by ~9.5e7x
      errorFactor: +IMP1324_ERROR_FACTOR.toExponential(3),
    },
  },

  structuralReclassification: {
    witness: 'single admissible zero at beta = 3/4, gamma = 6e12 (> T_PT, unverified region)',
    kernelPrice: +WITNESS_PRICE.toExponential(4),        // 3.3333e-13 (imp-397 2/gamma)
    isolatedPairRealnessTime: WITNESS_REALNESS_34,       // 0.125 (repo gap law d(s^2)/dt = -8)
    mispricingRatio: +MISPRICING_RATIO.toExponential(3), // 3.75e11
    ledgerEN: LEDGER_EN_N1E4,                            // 0.0129 (imp-2643) -- exceeded ~10x by the witness
    countsCannotExclude: +KLN_COUNT_ALLOWANCE_09.toExponential(3), // ~1.5e9 zeros allowed at (0.9, 6e12)
    conclusion:
      'The E(N) bracket at ledger scale is NOT dischargeable by any effective zero-density constant; it is '
      + 'conditional on barrier-type realness control above T_PT (interaction-accelerated closure ~ log gamma '
      + '-- the Polymath15 machinery PT\'s own Lambda <= 0.2 already uses). On the height-tail side the '
      + 'finite-N chain can at best MATCH PT, never beat it; beat content lives in the window legs.',
  },

  eFlowAudit: {
    coefficientPinned: +C_F_COEFF.toFixed(6),            // 1.330578 (rigorous closed form)
    prefactor: +EFLOW_PREFACTOR.toExponential(4),        // 1.2389e-3
    cGmaxOLS: +C_G_MAX_OLS.toFixed(2),                   // 6.78
    cGAltImp398: +C_G_ALT_IMP398.toFixed(2),             // 8.57 = 4/B(0)^2 = L^2/pi^2 (imp-398 openWork)
    eflowAtAlt_A1: +EFLOW_AT_ALT_A1.toExponential(4),    // 1.2414e-3 < 1.3e-3 (still certifies)
    eflowAtAlt_OLS: +EFLOW_AT_ALT_OLS.toExponential(4),  // 1.3166e-3 > 1.3e-3 (fallback BREAKS)
    consequence:
      'Under imp-398\'s own C_G reading the OLS fallback fails, so E_flow <= 1.3e-3 leans on the A1 input '
      + 'and inherits R1 (Theta-persistence, MEASURED not proven) and R2\' (which-object, imp-2639 OPEN), '
      + 'unless the y* >= 1 strip assignment is proven (recorded nowhere upstream of imp-2644).',
  },

  honestCeiling: {
    statement:
      'A discharged E_trunc + E_flow + certified E_field makes E(N* = 1e4) < 0.2 CONDITIONAL-RIGOROUS, '
      + 'conditional on exactly: (C1) barrier-type realness control above T_PT (deep-zero class; count-free); '
      + '(C2) an explicit density pair (A, B) under the A_max(B) curve at sigma = 3/4, currently 16.7x short; '
      + '(C3) the E_flow form constant + (strip assignment OR A1 with R1/R2\'); (C4) the eps\'-certificate; '
      + '(C5) Lemma 3.3 port soundness (subsumed by C1). NOT a dethroning of Platt-Trudgian.',
    finiteNStarConditionalBeat: true,
    dethronesPT: false,
  },

  deterministic: true,   // no GUE, no PCC anywhere in this module
  changesLambdaValue: false,
  rigorousBeat: false,
  honest:
    'Two genuine rigorous steps (kappa_T lock, prefactor 5/3 correction), one verified literature mapping '
    + '(refuting the imp-1324 Ramare line by ~9.5e7x), and one structural reclassification. E_trunc < 0.2 at '
    + 'N* = 1e4 is NOT discharged: 16.7x short on explicit constants at sigma = 3/4, and the deeper residual '
    + 'is the unported barrier lemma, not a constant. No refereed bound is changed. '
    + 'NO false QED.',
};

// ── Build-time assertions (self-executing, THROW on failure) ──────────────────
export const ETRUNC_EFLOW_PT_ANCHOR_ASSERTIONS = [
  {
    id: 'imp34791-kappa-locked-exact-rational',
    why:
      'The N* = 1e4 kappa_T lock is the fixed-strip exponent at the PT anchor: e_I(3/4) = 3/5 and '
      + 'kappa = 2/5 EXACTLY, with no height dependence (the imp-2622 mismatch is structurally unavailable). '
      + 'Any drift means the strip moved and the lock is void.',
    holds: () =>
      Math.abs(E_I - 0.6) < 1e-15
      && Math.abs(KAPPA_LOCKED - 0.4) < 1e-15
      && inghamExponent(0.75) === E_I, // fixed rational, not a function of any height
  },
  {
    id: 'imp34791-prefactor-parts-correction',
    why:
      'N <= Nbar does not imply dN <= dNbar; integration by parts (boundary term = 0 exactly by '
      + 'N_off(T_PT) = 0) gives prefactor 2/kappa = 5.0, a strict 5/3 enlargement of the recorded '
      + '2 e_I/kappa = 3.0. The corrected clean-count values must reproduce 5.106e-5 (T_PT) and 0.1262 (model).',
    holds: () =>
      Math.abs(HONEST_PREFACTOR - 5.0) < 1e-12
      && Math.abs(RECORDED_PREFACTOR - 3.0) < 1e-12
      && Math.abs(CLEAN_COUNT_T_PT - 5.1065e-5) < 1e-8
      && Math.abs(CLEAN_COUNT_MODEL - 0.126207) < 1e-5
      && Math.abs(CLEAN_COUNT_T_PT / (3.0 * Math.pow(T_PT, -0.4)) - 5 / 3) < 1e-12,
  },
  {
    id: 'imp34791-requirement-curve-monotone-and-values',
    why:
      'The A_max(B) frontier must be strictly decreasing in B and reproduce the computed values '
      + '(3917 at B=0, 124.5 at B=1, 3.92 at B=2, 0.490 at B=2.6). It replaces the withdrawn-instantiation '
      + 'imp-2698 threshold; if it drifts, the PT-anchor arithmetic moved.',
    holds: () => {
      const vals = A_MAX_CURVE.map((r) => r.A_max);
      const decreasing = vals.every((v, i) => i === 0 || v < vals[i - 1]);
      return decreasing
        && Math.abs(A_MAX(0) - 3917) / 3917 < 0.01
        && Math.abs(A_MAX(1) - 124.5) / 124.5 < 0.01
        && Math.abs(A_MAX(2) - 3.919) / 3.919 < 0.01
        && Math.abs(A_MAX(2.6) - 0.4896) / 0.4896 < 0.01;
    },
  },
  {
    id: 'imp34791-cs2025-pins-repo-log-power-and-fails-by-16x',
    why:
      'The CS2025 log-power (7-5s)/(2-s) must equal 2.6 exactly at sigma = 3/4 and reproduce the '
      + 'repo-recorded 2.954 at the 1e13 thin strip (independent cross-validation of the citation), and the '
      + 'resulting explicit E_trunc_pt = 3.34 must exceed 0.2 by 15-18x -- the honest explicit frontier.',
    holds: () =>
      Math.abs(CS_B_AT_34 - 2.6) < 1e-12
      && Math.abs(CS_B_AT_1E13_STRIP - 2.954) < 1e-3
      && E_CS_AT_34 > 0.2
      && CS_GAP_FACTOR > 15 && CS_GAP_FACTOR < 18,
  },
  {
    id: 'imp34791-kln-passes-curve-but-breaks-cap',
    why:
      'KLN 2021 at sigma = 0.9 gives an explicit tail ~1.2e-3 < 0.2 (the curve is passable at high sigma) '
      + 'BUT the unpriced beta in (1/2, 0.9) class carries isolated-pair realness time 0.32 > 0.2, and the '
      + 'largest cap-compatible sigma is 1/2 + sqrt(0.1) = 0.816. Both facts must hold or the sigma-raise '
      + 'route assessment is wrong.',
    holds: () =>
      E_KLN_09 < 0.2 && E_KLN_09 > 1e-4 && Math.abs(E_KLN_09 - 1.2154e-3) / 1.2154e-3 < 0.01
      && Math.abs(KLN_CAP_09 - 0.32) < 1e-12
      && KLN_CAP_09 > 0.2
      && Math.abs(SIGMA_CAP_FOR_0P2 - 0.81623) < 1e-4
      && Math.abs(DE_BRUIJN_CAP(SIGMA_CAP_FOR_0P2) - 0.2) < 1e-12,
  },
  {
    id: 'imp34791-ramare-line-refuted',
    why:
      'Ramare 2016 (revised constant 965, exponent 8(1-s)/3, log-power 5-2s) gives ~1.7e5 at sigma = 3/4, '
      + 'not the 1.76e-3 the imp-1324 audit recorded as "safest shippable" -- an error factor ~9.5e7. The '
      + 'exponent at 3/4 must be 2/3 (not the Ingham 0.6) and the refutation ratio must exceed 1e7.',
    holds: () =>
      Math.abs(RAMARE_EXPONENT_34 - 2 / 3) < 1e-12
      && E_RAMARE_34 > 1e4
      && IMP1324_ERROR_FACTOR > 1e7,
  },
  {
    id: 'imp34791-deep-zero-mispricing-structural',
    why:
      'The structural finding: a single admissible zero at (beta = 3/4, gamma = 6e12) is priced 2/gamma = '
      + '3.33e-13 by the recorded kernel but carries isolated-pair realness time 0.125 (repo gap law '
      + 'd(s^2)/dt = -8) -- a ~3.75e11x mispricing, ~9.7x the committed E(N) ledger -- while KLN still '
      + 'allows ~1.5e9 zeros there, so no count bound excludes the witness. If any leg of this fails, the '
      + 'reclassification (residual = barrier lemma, not a constant) must be re-derived.',
    holds: () =>
      Math.abs(WITNESS_PRICE - 3.3333e-13) < 1e-16
      && Math.abs(WITNESS_REALNESS_34 - 0.125) < 1e-15
      && MISPRICING_RATIO > 1e11
      && WITNESS_REALNESS_34 / LEDGER_EN_N1E4 > 9
      && KLN_COUNT_ALLOWANCE_09 > 1e6,
  },
  {
    id: 'imp34791-eflow-ols-fallback-breaks-under-imp398-cg',
    why:
      'Under imp-398\'s own C_G <= 4/B(0)^2 = L^2/pi^2 = 8.57 at N* = 1e4 (> the 6.78 OLS threshold), '
      + 'E_flow(OLS tc) = 1.317e-3 exceeds the 1.3e-3 target while E_flow(A1 tc) = 1.2414e-3 still '
      + 'certifies -- so the certification leans on A1 (R1/R2\') unless the y* >= 1 strip assignment is '
      + 'proven. The three numbers must reproduce or the audit conclusion is stale.',
    holds: () =>
      Math.abs(C_F_COEFF - 1.330578) < 1e-5
      && C_G_ALT_IMP398 > C_G_MAX_OLS
      && Math.abs(C_G_ALT_IMP398 - 8.57) < 0.01
      && EFLOW_AT_ALT_OLS > EFLOW_TARGET
      && EFLOW_AT_ALT_A1 < EFLOW_TARGET,
  },
  {
    id: 'imp34791-honesty-gates',
    why:
      'No false QED: PARTIAL verdict, no Lambda value change, no rigorous beat, deterministic (no GUE/PCC), '
      + 'PT cited as SOTA, the ceiling names its five conditionals, and the still-open list keeps E_trunc, '
      + 'E_flow, and E_field residuals named.',
    holds: () => {
      const m = ETRUNC_EFLOW_PT_ANCHOR_HONEST_DISCHARGE;
      return m.verdict.startsWith('PARTIAL')
        && m.changesLambdaValue === false
        && m.rigorousBeat === false
        && m.deterministic === true
        && m.honestCeiling.dethronesPT === false
        && /refereed bound is changed/i.test(m.honest)
        && /NO false QED/.test(m.honest)
        && /C1/.test(m.honestCeiling.statement) && /C5/.test(m.honestCeiling.statement)
        && m.reconciliation.stillAnsatzOrOpen.length === 3;
    },
  },
];

for (const a of ETRUNC_EFLOW_PT_ANCHOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-34791 assertion failed: ' + a.id + ' -- ' + a.why);
  }
}
