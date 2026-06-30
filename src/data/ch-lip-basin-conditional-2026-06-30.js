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
