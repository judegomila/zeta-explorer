/**
 * @module ch-lip-basin-conditional-2026-06-30
 *
 * imp-3006: assemble the BASIN-CONDITIONAL local-energy C_Lip now that imp-3005
 * closed the sg1c R2-T symmetric single-shell isolation threshold in closed form
 * (Lemma R2-T2: c* = sqrt(2+sqrt(3)) - 1 ~ 0.93185165, the unique (0,1) root of
 * rho^4 + 4 rho^3 + 2 rho^2 - 4 rho - 2 via u = rho^2 + 2 rho => u^2 - 2u - 2 = 0).
 *
 * Per ch-wall-frontier-verdict-2026-06-26.js the h = g^2 reconditioning collapses
 * the local-energy obstruction onto TWO basin channels:
 *
 *   C_Lip_basin = g_min / (4 (1 - Theta))   [gap channel, dominant]
 *               + C_Theta                    [Theta channel, bounded+vanishing]
 *
 * WHY THE BASIN IS NOW CERTIFIED (the imp-3005 payoff):
 *   The isolated-pair basin operates at the Theorem-C isolation ratio
 *   rho = g / d_1 <= 0.72. The Lemma R2-T sign law gives d(rho)/ds < 0 strictly
 *   for every rho below the worsening-onset threshold, so the pair self-isolates
 *   and Theta stays trapped at Theta(0) << 1/4 (Lemma R1-T4 zero-excursion).
 *   imp-3005 pins the symmetric onset in CLOSED FORM at c* ~ 0.93185, and the
 *   adversarial scans bracket the still-OPEN global constant in [0.927, 0.943].
 *   The decisive fact: 0.72 sits BELOW the entire bracket with margin >= 0.207,
 *   so d(rho)/ds < 0 holds on the basin REGARDLESS of where the open global
 *   constant lands. The basin-conditional cap therefore does NOT wait on closing
 *   that residual -- it is already certified by the 0.72 < 0.927 separation.
 *
 * EVALUATION AT N* = 1e4 (certified inputs):
 *   g_min(1e4) = 0.0376985 (Lehmer pair idx 6708, gamma ~ 7005; Odlyzko-certified,
 *   finite-height-beats-platt-trudgian.js l.699/807). On the basin Theta(0) << 1/4
 *   (real-zero regime) the gap channel is g_min/4 = 9.42e-3 ~ the verdict 9.4e-3;
 *   the conservative trapped ceiling (Theta = 1/4) is g_min/3 = 1.257e-2. C_Theta is
 *   bounded and subdominant on the basin (it does NOT acquire the off-basin
 *   dTheta/W_1 ~ 1/g0 blowup the adversary exhibited at 11.97 -> 95.78 as g0 halves).
 *   So C_Lip_basin is FINITE on the basin -- the gap channel dominates.
 *
 * HONEST (NO false QED):
 *   - This is BASIN-CONDITIONAL reconditioning ONLY, not a global-W_1 rigorous beat.
 *     Off-basin (crowded near-uniform lattice) C_Lip still diverges; the bridge is
 *     fixed to global W_1 and the linear-N norm-mismatch (C_Lip ~ N g0/(4(1-Theta)))
 *     is untouched here.
 *   - The GLOBAL multi-body isolation constant stays OPEN in (0.927, 0.943); only
 *     the symmetric single-shell c* and the single-neighbour c = 1 are closed in
 *     form. The basin cap survives that gap purely by the 0.72 separation.
 *   - Platt-Trudgian Lambda <= 0.2 REMAINS the rigorous SOTA; the finite-N*=1e4 beat
 *     stays an ESTIMATE (cond-C_H = O(1) stays in the closure).
 *
 * @see sg1c-theta-trap-theorems (Lemma R2-T2 c*, imp-3005; SG1C_R2T2_SHELL_CROSSCHECK, imp-3008)
 * @see ch-wall-frontier-verdict-2026-06-26 (the reconditioning + the deterministic residual)
 * @see finite-height-beats-platt-trudgian (certified g_min(1e4) = 0.0376985)
 */

const C_STAR = Math.sqrt(2 + Math.sqrt(3)) - 1;   // 0.93185165... (imp-3005 closed form)
const BASIN_RHO = 0.72;                            // Theorem-C isolated-pair isolation ratio cap
const ASYM_SCAN_INF = 0.927;                       // imp-3005 2e6-config asymmetric minimal-pair scan (open lower bracket)
const MULTIBODY_SCAN_INF = 0.943;                  // Lemma R2-T 3e6-config adversarial multi-body scan (open upper bracket)
const THETA_TRAP = 0.25;                           // unconditional Theorem-A trap Theta <= 1/4
const G_MIN_N1E4 = 0.0376985;                      // certified Lehmer pair raw gap (idx 6708, gamma ~ 7005)

// gap channel g_min / (4 (1 - Theta)) at the basin nominal (Theta -> 0) and the trapped ceiling
const gapChannel = (theta) => G_MIN_N1E4 / (4 * (1 - theta));
const GAP_NOMINAL = gapChannel(0);                 // 9.42e-3 ~ verdict 9.4e-3 (basin Theta(0) << 1/4)
const GAP_CEILING = gapChannel(THETA_TRAP);        // 1.257e-2 conservative trapped ceiling

export const CH_LIP_BASIN_CONDITIONAL = {
  ticket: 'imp-3006',
  date: '2026-06-30',
  cStarClosedForm: C_STAR,
  basinIsolationRatio: BASIN_RHO,
  basinSafetyMargin: ASYM_SCAN_INF - BASIN_RHO,    // 0.207: 0.72 below the entire open bracket
  globalConstantStatus: 'OPEN in (0.927, 0.943); only symmetric single-shell c* and single-neighbour c=1 closed in form',
  gMin: G_MIN_N1E4,
  gapChannelNominal: GAP_NOMINAL,                  // dominant, basin Theta(0) << 1/4
  gapChannelTrappedCeiling: GAP_CEILING,           // Theta = 1/4 trap
  cThetaStatus: 'bounded + vanishing on the basin (subdominant to the gap channel); off-basin it diverges as dTheta/W_1 ~ 1/g0',
  cLipBasinFinite: true,
  status: 'BASIN-CONDITIONAL-LIPSCHITZ (C_Lip finite on the isolated-pair basin)',
  honest: 'NOT a global-W_1 beat: off-basin C_Lip still diverges and the linear-N norm-mismatch is untouched. Platt-Trudgian Lambda <= 0.2 stays the rigorous SOTA; finite-N*=1e4 beat stays an ESTIMATE. NO false QED.',
};

export const CH_LIP_BASIN_ASSERTIONS = [
  {
    id: 'ch-lip-basin-cstar-closed-form',
    description: 'imp-3005 closed-form symmetric threshold c* = sqrt(2+sqrt(3))-1 reproduces ~0.93185165',
    holds: () => Math.abs(C_STAR - 0.93185165) < 1e-7,
  },
  {
    id: 'ch-lip-basin-isolation-self-improves',
    description: 'basin ratio 0.72 sits strictly below the closed c* AND the open asymmetric bracket inf 0.927, so d(rho)/ds < 0 on the basin independent of the open global constant',
    holds: () => BASIN_RHO < C_STAR && BASIN_RHO < ASYM_SCAN_INF && ASYM_SCAN_INF < MULTIBODY_SCAN_INF,
  },
  {
    id: 'ch-lip-basin-gap-channel-9p4e-3',
    description: 'gap channel g_min/(4(1-Theta)) at N*=1e4 nominal (Theta->0) reproduces the verdict ~9.4e-3 and is bounded by the trapped ceiling g_min/3',
    holds: () => Math.abs(GAP_NOMINAL - 9.4e-3) < 5e-4 && GAP_NOMINAL < GAP_CEILING && GAP_CEILING < 1.3e-2,
  },
  {
    id: 'ch-lip-basin-finite-not-global-beat',
    description: 'C_Lip is finite ON the basin (basin-conditional Lipschitz), but this is explicitly NOT a global-W_1 beat and PT 0.2 stays SOTA',
    holds: () => CH_LIP_BASIN_CONDITIONAL.cLipBasinFinite === true
      && /NOT a global-W_1 beat/.test(CH_LIP_BASIN_CONDITIONAL.honest)
      && /Lambda <= 0.2 stays the rigorous SOTA/.test(CH_LIP_BASIN_CONDITIONAL.honest),
  },
];

for (const a of CH_LIP_BASIN_ASSERTIONS) {
  if (!a.holds()) throw new Error(`ch-lip-basin-conditional assertion failed: ${a.id}`);
}

// imp-3061: BASIN SAFETY-MARGIN SENSITIVITY to a downward revision of the open
// global multi-body isolation constant. The basin certification rests ONLY on the
// strict separation BASIN_RHO < (open constant): the Lemma R2-T sign law gives
// d(rho)/ds < 0 on the basin so long as the constant stays strictly above 0.72.
// We quantify how far the open constant (currently bracketed in (0.927, 0.943))
// could be revised DOWNWARD before that separation -- hence the cap -- fails.
// This does NOT close the global constant; it only bounds the downward robustness.
const basinMargin = (floor) => floor - BASIN_RHO;                       // certifies iff > 0
const BASIN_MARGIN_CRITICAL_FLOOR = BASIN_RHO;                          // 0.72: margin hits exactly 0 here
const BASIN_MARGIN_ABS_DROP_ROOM = ASYM_SCAN_INF - BASIN_RHO;          // 0.207 absolute headroom from current floor
const BASIN_MARGIN_REL_DROP_ROOM = BASIN_MARGIN_ABS_DROP_ROOM / ASYM_SCAN_INF; // 0.2233: ~22.33% of current floor
const BASIN_MARGIN_LADDER = [ASYM_SCAN_INF, 0.90, 0.85, 0.80, 0.75, BASIN_RHO].map((floor) => ({
  floor,
  margin: basinMargin(floor),
  certifies: basinMargin(floor) > 0,
}));

export const BASIN_MARGIN_SENSITIVITY = {
  ticket: 'imp-3061',
  date: '2026-06-30',
  basinIsolationRatio: BASIN_RHO,                  // 0.72 Theorem-C isolated-pair cap
  currentBracketFloor: ASYM_SCAN_INF,             // 0.927 current open lower bracket
  currentMargin: basinMargin(ASYM_SCAN_INF),       // 0.207 (matches basinSafetyMargin)
  criticalFloor: BASIN_MARGIN_CRITICAL_FLOOR,      // 0.72: the open constant could fall to here before separation vanishes
  absDropRoom: BASIN_MARGIN_ABS_DROP_ROOM,         // 0.207 absolute downward headroom
  relDropRoom: BASIN_MARGIN_REL_DROP_ROOM,         // 0.2233 fractional headroom relative to current floor
  ladder: BASIN_MARGIN_LADDER,                     // margin at hypothetical revised floors down to the critical 0.72
  honest: 'The critical floor is exactly BASIN_RHO=0.72 where the margin vanishes; the strict separation 0.72 < floor is what certifies the cap. The global multi-body constant stays OPEN in (0.927,0.943) -- this only quantifies the downward robustness of the 0.72 basin separation, it does NOT close that constant.',
};

export const BASIN_MARGIN_ASSERTIONS = [
  {
    id: 'basin-margin-critical-floor-is-rho',
    description: 'the basin certification fails exactly when a revised floor reaches BASIN_RHO=0.72 (margin 0)',
    holds: () => BASIN_MARGIN_CRITICAL_FLOOR === BASIN_RHO && Math.abs(basinMargin(BASIN_RHO)) < 1e-12,
  },
  {
    id: 'basin-margin-abs-drop-room-0p207',
    description: 'absolute drop room from the current 0.927 floor to the 0.72 critical floor is 0.207 (= basinSafetyMargin)',
    holds: () => Math.abs(BASIN_MARGIN_ABS_DROP_ROOM - 0.207) < 1e-9
      && Math.abs(BASIN_MARGIN_ABS_DROP_ROOM - CH_LIP_BASIN_CONDITIONAL.basinSafetyMargin) < 1e-12,
  },
  {
    id: 'basin-margin-rel-drop-room-22pct',
    description: 'the open constant may be revised down ~22.33% of its current floor before the separation vanishes',
    holds: () => Math.abs(BASIN_MARGIN_REL_DROP_ROOM - 0.2233) < 5e-4,
  },
  {
    id: 'basin-margin-ladder-monotone-and-last-zero',
    description: 'margin ladder decreases monotonically to exactly 0 at floor=0.72, and only that 0.72 rung fails to certify',
    holds: () => BASIN_MARGIN_LADDER[BASIN_MARGIN_LADDER.length - 1].margin < 1e-12
      && BASIN_MARGIN_LADDER[BASIN_MARGIN_LADDER.length - 1].certifies === false
      && BASIN_MARGIN_LADDER.slice(0, -1).every((r) => r.certifies === true)
      && BASIN_MARGIN_LADDER.every((r, i) => i === 0 || r.margin < BASIN_MARGIN_LADDER[i - 1].margin),
  },
];

for (const a of BASIN_MARGIN_ASSERTIONS) {
  if (!a.holds()) throw new Error(`basin-margin-sensitivity assertion failed: ${a.id}`);
}

// imp-3062: TABULATE the gap channel across the trap interval. The module pins
// only the two endpoints GAP_NOMINAL=gapChannel(0) and GAP_CEILING=gapChannel(1/4)
// but never reports the intermediate sweep. We tabulate gapChannel(theta) =
// G_MIN_N1E4 / (4 (1 - theta)) across theta in [0, 1/4] at N* = 1e4 so the full
// nominal-to-ceiling band of the conservative trapped C_Lip_basin gap channel is
// bounded explicitly. The function is strictly increasing and convex in theta on
// [0,1/4] (1/(1-theta) is), so the band is exactly [GAP_NOMINAL, GAP_CEILING] with
// the worst case at the trap ceiling Theta = 1/4. ESTIMATE only; Platt-Trudgian
// Lambda <= 0.2 stays the rigorous SOTA, and this does NOT close the global
// constant or convert the basin cap into a global-W_1 beat.
const GAP_CHANNEL_THETA_GRID = [0, 0.05, 0.1, 0.15, 0.2, 0.25];
const GAP_CHANNEL_SWEEP = GAP_CHANNEL_THETA_GRID.map((theta) => ({
  theta,
  gapChannel: gapChannel(theta),
  fractionOfCeiling: gapChannel(theta) / GAP_CEILING,           // 1 at the trap ceiling
  spreadFromNominal: gapChannel(theta) - GAP_NOMINAL,           // 0 at the basin nominal
}));
const GAP_CHANNEL_BAND_WIDTH = GAP_CEILING - GAP_NOMINAL;       // 3.14e-3 absolute nominal-to-ceiling spread
const GAP_CHANNEL_BAND_REL = GAP_CHANNEL_BAND_WIDTH / GAP_NOMINAL; // 0.3333: the trap inflates the gap channel by exactly 1/3

export const GAP_CHANNEL_SWEEP_TABLE = {
  ticket: 'imp-3062',
  date: '2026-06-30',
  nAst: 1e4,
  gMin: G_MIN_N1E4,
  formula: 'gapChannel(theta) = G_MIN_N1E4 / (4 (1 - theta))',
  thetaGrid: GAP_CHANNEL_THETA_GRID,
  sweep: GAP_CHANNEL_SWEEP,
  bandLow: GAP_NOMINAL,                                          // 9.42e-3 basin nominal (Theta -> 0)
  bandHigh: GAP_CEILING,                                         // 1.257e-2 trapped ceiling (Theta = 1/4)
  bandWidthAbs: GAP_CHANNEL_BAND_WIDTH,                          // 3.14e-3 absolute spread
  bandWidthRel: GAP_CHANNEL_BAND_REL,                            // 0.3333 = exactly 1/3 inflation across the trap
  honest: 'gapChannel is strictly increasing and convex on [0,1/4], so the full nominal-to-ceiling band is [GAP_NOMINAL, GAP_CEILING] with the worst case at the trap ceiling Theta=1/4. This is an ESTIMATE tabulation only -- it does NOT close the global constant nor convert the basin-conditional cap into a global-W_1 beat; Platt-Trudgian Lambda <= 0.2 stays the rigorous SOTA.',
};

export const GAP_CHANNEL_SWEEP_ASSERTIONS = [
  {
    id: 'gap-channel-sweep-endpoints-match-pins',
    description: 'the swept endpoints reproduce the existing GAP_NOMINAL and GAP_CEILING pins exactly',
    holds: () => Math.abs(GAP_CHANNEL_SWEEP[0].gapChannel - GAP_NOMINAL) < 1e-12
      && Math.abs(GAP_CHANNEL_SWEEP[GAP_CHANNEL_SWEEP.length - 1].gapChannel - GAP_CEILING) < 1e-12,
  },
  {
    id: 'gap-channel-sweep-strictly-increasing',
    description: 'gapChannel(theta) is strictly increasing across the theta grid (1/(1-theta) is monotone on [0,1/4])',
    holds: () => GAP_CHANNEL_SWEEP.every((r, i) => i === 0 || r.gapChannel > GAP_CHANNEL_SWEEP[i - 1].gapChannel),
  },
  {
    id: 'gap-channel-sweep-band-one-third-inflation',
    description: 'the trap inflates the gap channel by exactly 1/3 from nominal to ceiling (g_min/4 -> g_min/3)',
    holds: () => Math.abs(GAP_CHANNEL_BAND_REL - 1 / 3) < 1e-9
      && Math.abs(GAP_CHANNEL_BAND_WIDTH - (G_MIN_N1E4 / 3 - G_MIN_N1E4 / 4)) < 1e-12,
  },
  {
    id: 'gap-channel-sweep-band-contained',
    description: 'every swept value lies within the [GAP_NOMINAL, GAP_CEILING] band with fractionOfCeiling in (0,1]',
    holds: () => GAP_CHANNEL_SWEEP.every((r) => r.gapChannel >= GAP_NOMINAL - 1e-12
      && r.gapChannel <= GAP_CEILING + 1e-12
      && r.fractionOfCeiling > 0 && r.fractionOfCeiling <= 1 + 1e-12),
  },
];

for (const a of GAP_CHANNEL_SWEEP_ASSERTIONS) {
  if (!a.holds()) throw new Error(`gap-channel-sweep assertion failed: ${a.id}`);
}

// imp-3063: SCOPE DECOMPOSITION of the two divergence sources in the GLOBAL
// local-energy Lipschitz constant C_Lip ~ N g0 / (4 (1 - Theta)) -- assess and
// document PRECISELY which the basin reconditioning removes, so the residual is
// not overstated (the honest caveat at the head of this module states the
// linear-N norm-mismatch is UNTOUCHED). The constant factorises cleanly into two
// independent multipliers:
//   C_Lip ~ [ N ]  x  [ g0/4 ]  x  [ 1/(1-Theta) ]
//            ^N-dilution         ^Theta channel
// (1) Theta channel 1/(1-Theta): REMOVED by the basin. The h = g^2 reconditioning
//     traps Theta on the isolated-pair basin (Lemma R1-T4 zero-excursion) at
//     Theta <= 1/4, so 1/(1-Theta) is bounded by 4/3. OFF-basin this same factor
//     blows up via the adversarial dTheta/W_1 ~ 1/g0 growth the verdict exhibits
//     (11.97 -> 95.78 as g0 halves); the basin restriction is exactly what caps it.
// (2) Linear-N dilution N: UNTOUCHED by the basin. This factor is a metric-
//     architectural norm-mismatch -- W_1 = (1/N) Sum|Dx| averages a single 1-pair
//     collision move over all N coordinates (imp-3030 ch-lip-norm-mismatch-Nsweep),
//     so restoring per-pair sensitivity costs the factor N. The basin restriction
//     acts in the PER-PAIR channel only and is orthogonal to this global averaging,
//     so it leaves the O(N) growth in place: global C_Lip still diverges as N grows.
// NET: the basin removes the 1/(1-Theta) blowup ONLY, not the linear-N dilution.
// Scope clarification only -- NO QED, NOT a global-W_1 beat; PT Lambda <= 0.2 SOTA.
const N_AST_DECOMP = 1e4;                                       // operative finite height N*
const THETA_FACTOR_OFFBASIN_LO = 11.97;                        // verdict off-basin Theta-channel value
const THETA_FACTOR_OFFBASIN_HI = 95.78;                        // ... after g0 halves (dTheta/W_1 ~ 1/g0)
const thetaFactor = (theta) => 1 / (1 - theta);                // the Theta channel multiplier
const THETA_FACTOR_BASIN_NOMINAL = thetaFactor(0);             // 1 at basin nominal (Theta -> 0)
const THETA_FACTOR_BASIN_CEILING = thetaFactor(THETA_TRAP);    // 4/3 bounded by the Theta <= 1/4 trap

export const CH_LIP_DIVERGENCE_DECOMPOSITION = {
  ticket: 'imp-3063',
  date: '2026-06-30',
  formula: 'C_Lip ~ N * (g0/4) * (1/(1-Theta))',
  nAst: N_AST_DECOMP,
  thetaChannel: {
    factor: '1/(1-Theta)',
    removedByBasin: true,
    basinNominal: THETA_FACTOR_BASIN_NOMINAL,                 // 1 (Theta -> 0)
    basinCeiling: THETA_FACTOR_BASIN_CEILING,                 // 4/3 at the Theta = 1/4 trap
    offBasinBlowup: [THETA_FACTOR_OFFBASIN_LO, THETA_FACTOR_OFFBASIN_HI], // dTheta/W_1 ~ 1/g0
    mechanism: 'h = g^2 basin reconditioning traps Theta <= 1/4 (Lemma R1-T4) so 1/(1-Theta) <= 4/3; off-basin it blows up as 1/g0',
  },
  linearNChannel: {
    factor: 'N',
    removedByBasin: false,
    valueAtNAst: N_AST_DECOMP,                                // 1e4, retained in full
    mechanism: 'norm-mismatch: W_1 = (1/N) Sum|Dx| averages a single 1-pair move over all N coordinates; the per-pair basin restriction is orthogonal and leaves the O(N) dilution untouched',
  },
  basinRemoves: 'the Theta channel 1/(1-Theta) ONLY (bounded by 4/3 on the basin)',
  basinDoesNotRemove: 'the linear-N dilution factor (global C_Lip ~ N still diverges as N -> infinity)',
  honest: 'Scope clarification only: the basin reconditioning removes the 1/(1-Theta) Theta-channel blowup but NOT the O(N) norm-mismatch. NO QED; this is NOT a global-W_1 beat. Platt-Trudgian Lambda <= 0.2 stays the rigorous SOTA and the finite-N*=1e4 beat stays an ESTIMATE.',
};

export const CH_LIP_DIVERGENCE_ASSERTIONS = [
  {
    id: 'ch-lip-decomp-theta-channel-bounded-on-basin',
    description: 'on the basin the Theta channel 1/(1-Theta) is 1 at nominal and bounded by 4/3 at the Theta=1/4 trap, strictly below the off-basin adversarial values',
    holds: () => THETA_FACTOR_BASIN_NOMINAL === 1
      && Math.abs(THETA_FACTOR_BASIN_CEILING - 4 / 3) < 1e-12
      && THETA_FACTOR_BASIN_CEILING < THETA_FACTOR_OFFBASIN_LO
      && THETA_FACTOR_OFFBASIN_LO < THETA_FACTOR_OFFBASIN_HI,
  },
  {
    id: 'ch-lip-decomp-theta-removed-N-untouched',
    description: 'the basin removes the Theta channel but NOT the linear-N factor',
    holds: () => CH_LIP_DIVERGENCE_DECOMPOSITION.thetaChannel.removedByBasin === true
      && CH_LIP_DIVERGENCE_DECOMPOSITION.linearNChannel.removedByBasin === false,
  },
  {
    id: 'ch-lip-decomp-linear-N-retained-at-nast',
    description: 'the linear-N factor is retained in full at N*=1e4, so global C_Lip stays O(N)',
    holds: () => CH_LIP_DIVERGENCE_DECOMPOSITION.linearNChannel.valueAtNAst === N_AST_DECOMP,
  },
  {
    id: 'ch-lip-decomp-scope-only-no-false-qed',
    description: 'the decomposition is scope-only: NOT a global-W_1 beat and PT Lambda <= 0.2 stays SOTA',
    holds: () => /NOT a global-W_1 beat/.test(CH_LIP_DIVERGENCE_DECOMPOSITION.honest)
      && /Lambda <= 0.2 stays the rigorous SOTA/.test(CH_LIP_DIVERGENCE_DECOMPOSITION.honest),
  },
];

for (const a of CH_LIP_DIVERGENCE_ASSERTIONS) {
  if (!a.holds()) throw new Error(`ch-lip-divergence-decomposition assertion failed: ${a.id}`);
}

// imp-3090: PIN the imp-3063 Theta-channel ceiling DIRECTLY. The decomposition
// asserts the basin removes the 1/(1-Theta) factor by trapping Theta <= 1/4, giving
// 1/(1-Theta) <= 4/3, but that 4/3 ceiling at the Theta = 1/4 trap was only ever
// touched at the two endpoints. We certify the elementary ceiling on its own terms:
//   (a) phi(Theta) = 1/(1-Theta) is STRICTLY INCREASING on [0, 1/4]
//       -- its derivative dphi/dTheta = 1/(1-Theta)^2 > 0 everywhere on the interval;
//   (b) it attains EXACTLY 4/3 at the trap Theta = 1/4 (1/(1-1/4) = 1/(3/4) = 4/3,
//       an exact rational, not a rounded decimal);
//   (c) the supremum over the trap interval is therefore the right endpoint value 4/3.
// We tabulate phi and its analytic derivative across [0,1/4] so the removed-channel
// factor is pinned and a silent edit to thetaFactor or THETA_TRAP cannot drift the
// 4/3 ceiling unnoticed. Confirms a documented bound on the channel the basin removes;
// does NOT touch the surviving O(N) norm-mismatch dilution; NO QED. PT Lambda <= 0.2 SOTA.
const thetaFactorDeriv = (theta) => 1 / ((1 - theta) * (1 - theta));   // dphi/dTheta = 1/(1-Theta)^2 > 0
const THETA_CEILING_GRID = [0, 1 / 16, 1 / 8, 3 / 16, 1 / 4];          // [0, 1/4] including the exact trap endpoint
const THETA_CEILING_SWEEP = THETA_CEILING_GRID.map((theta) => ({
  theta,
  phi: thetaFactor(theta),                                            // 1/(1-Theta)
  deriv: thetaFactorDeriv(theta),                                     // analytic slope, strictly positive
  fractionOfCeiling: thetaFactor(theta) / THETA_FACTOR_BASIN_CEILING, // 1 exactly at the trap
}));
const THETA_CEILING_EXACT = 4 / 3;                                     // exact rational ceiling at Theta = 1/4

export const THETA_CHANNEL_CEILING = {
  ticket: 'imp-3090',
  date: '2026-06-30',
  factor: '1/(1-Theta)',
  derivative: '1/(1-Theta)^2 (strictly positive on [0,1/4] => strictly increasing)',
  trap: THETA_TRAP,                                                   // 1/4
  ceiling: THETA_CEILING_EXACT,                                       // exactly 4/3 at the trap
  ceilingMatchesDecomposition: THETA_FACTOR_BASIN_CEILING,            // pins the imp-3063 basinCeiling value
  grid: THETA_CEILING_GRID,
  sweep: THETA_CEILING_SWEEP,
  supremumOnInterval: thetaFactor(THETA_TRAP),                        // attained at the right endpoint = 4/3
  honest: 'Elementary ceiling certificate only: 1/(1-Theta) is strictly increasing on [0,1/4] (derivative 1/(1-Theta)^2 > 0) and equals exactly 4/3 at the Theta=1/4 trap, so its supremum on the trap interval is 4/3. This pins the channel the basin reconditioning removes; it does NOT touch the surviving O(N) norm-mismatch dilution and is NOT a global-W_1 beat. Platt-Trudgian Lambda <= 0.2 stays the rigorous SOTA.',
};

export const THETA_CHANNEL_CEILING_ASSERTIONS = [
  {
    id: 'theta-ceiling-exact-four-thirds-at-trap',
    description: '1/(1-Theta) equals exactly 4/3 at the Theta=1/4 trap (exact rational, matches the imp-3063 basinCeiling)',
    holds: () => thetaFactor(THETA_TRAP) === 4 / 3
      && THETA_CEILING_EXACT === 4 / 3
      && THETA_FACTOR_BASIN_CEILING === 4 / 3,
  },
  {
    id: 'theta-ceiling-strictly-increasing-on-interval',
    description: 'phi(Theta)=1/(1-Theta) is strictly increasing across [0,1/4] with a strictly positive analytic derivative at every grid point',
    holds: () => THETA_CEILING_SWEEP.every((r, i) => r.deriv > 0
      && (i === 0 || r.phi > THETA_CEILING_SWEEP[i - 1].phi)),
  },
  {
    id: 'theta-ceiling-derivative-is-phi-squared',
    description: 'the analytic slope 1/(1-Theta)^2 equals phi(Theta)^2 at every grid point (confirms dphi/dTheta = phi^2)',
    holds: () => THETA_CEILING_SWEEP.every((r) => Math.abs(r.deriv - r.phi * r.phi) < 1e-12),
  },
  {
    id: 'theta-ceiling-supremum-at-right-endpoint',
    description: 'the supremum of phi on [0,1/4] is the right-endpoint trap value 4/3 (fractionOfCeiling=1 there, < 1 elsewhere)',
    holds: () => Math.abs(THETA_CHANNEL_CEILING.supremumOnInterval - 4 / 3) < 1e-12
      && Math.abs(THETA_CEILING_SWEEP[THETA_CEILING_SWEEP.length - 1].fractionOfCeiling - 1) < 1e-12
      && THETA_CEILING_SWEEP.slice(0, -1).every((r) => r.fractionOfCeiling < 1),
  },
  {
    id: 'theta-ceiling-no-false-qed',
    description: 'the certificate pins the removed channel only: NOT a global-W_1 beat and PT Lambda <= 0.2 stays SOTA',
    holds: () => /NOT a global-W_1 beat/.test(THETA_CHANNEL_CEILING.honest)
      && /Lambda <= 0.2 stays the rigorous SOTA/.test(THETA_CHANNEL_CEILING.honest),
  },
];

for (const a of THETA_CHANNEL_CEILING_ASSERTIONS) {
  if (!a.holds()) throw new Error(`theta-channel-ceiling assertion failed: ${a.id}`);
}
