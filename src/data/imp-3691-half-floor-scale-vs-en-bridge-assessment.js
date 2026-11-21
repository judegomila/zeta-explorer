/**
 * @module imp-3691-half-floor-scale-vs-en-bridge-assessment
 *
 * imp-3691 (proof, frontier-direction): ASSESS whether the imp-3671 scale-separation half-floor crossing
 * at k ~ 8.76 -- the strip height (~0.457 d, below the mean spacing d) at which the mesoscopic Gronwall
 * contraction floor exp(-k^2 E_meso) is HALF lost -- bears QUANTITATIVELY on the E(N) bridge constants
 * via the imp-3661 density-corrected flow factor 1.0000917, or whether it lives ENTIRELY in the
 * microscopic G6a shock-front (nearest-pair) regime that never reaches E(N). Assessment/derivation only;
 * no bridge closure, no RH claim, NO QED.
 *
 * THE TWO SCALES, AND WHERE EACH IS READ
 * --------------------------------------
 * (A) THE E(N) BRIDGE CONSTANT is fed (imp-2564) by the collision-TIME scale t_c ~ 1/(2 V0), where V0 is
 *     the mesoscopic density floor read at the SINGLE strip height y_star = 4 d (the imp-3642 anchor,
 *     k = 1), at which the Gronwall floor exp(-2 s / y_star^2) ~ 0.991. imp-3661 propagated exactly this
 *     scale into the closed form t_c(N) = 2.37e-4 * log(gamma_{N*}/2pi)/log(gamma_N/2pi), pinning the
 *     crossover-scale flow factor to exp(t_c(N_x)) = 1.0000917 (C_G = 1), at ~19.3% of the imp-3604
 *     bracket [1, 1.000474]. Crucially the flow factor is a SCALAR read at the k = 1 anchor; it carries
 *     no strip-height descent -- there is no k in it.
 * (B) THE imp-3671 HALF-FLOOR CROSSING is a property of the Gronwall CONTRACTION floor as a function of
 *     strip HEIGHT: writing y = y_star / k, floor(k) = floor_meso^{k^2} = exp(-k^2 E_meso), which crosses
 *     1/2 at k_half = sqrt(ln 2 / E_meso) ~ 8.76, i.e. at y_half = y_star / k_half ~ 0.457 d. This sits
 *     8.76x DEEPER in strip height than the bridge anchor (k = 1), and BELOW even the mean spacing
 *     d (k = 4, floor 0.865) -- squarely inside the sub-spacing microscopic front.
 *
 * WHY THE HALF-FLOOR SCALE DOES NOT REACH E(N)
 * --------------------------------------------
 * (R1) DISJOINT READING HEIGHT. The E(N) bridge constant reads V0 (hence t_c) ONLY at the mesoscopic
 *      anchor k = 1. The half-floor is a k = 8.76 phenomenon; the mesoscopic V0 reading -- and therefore
 *      the imp-3661 flow factor -- never samples the strip-height descent that produces the half-floor.
 *      The two are read at heights a factor k_half ~ 8.76 apart (the half-floor at ~11.4% of the bridge
 *      anchor height), so there is no strip height shared between them.
 * (R2) DISJOINT INPUTS -- NO SHARED PARAMETER. The imp-3661 bracket occupancy (~19.3%) is fixed by the
 *      density log ratio (9.1981 - log 2pi)/(20.8576 - log 2pi) = 0.3870 at N_x, a mesoscopic-density
 *      quantity with NO k. The half-floor crossing k_half is fixed by E_meso = -ln(0.991) = 0.009041 and
 *      the k^2 collapse, with NO density log ratio. There is no parameter through which k_half could shift
 *      the 19.3% share -- change k_half and the flow factor is untouched; change the density ratio and
 *      k_half is untouched.
 * (R3) GROSS INCOMMENSURABILITY (the smell test). If the half-floor scale DID set the E(N) contraction,
 *      the relevant floor would be 1/2 (50% of the contraction lost), whereas the bridge actually operates
 *      at floor 0.991 (0.9% lost). The lost-contraction ratio (1 - 0.5)/(1 - 0.991) ~ 55x means a
 *      half-floor-driven bridge factor would swamp the measured 19.3% bracket occupancy by orders of
 *      magnitude. imp-3661 measured the share ENTIRELY from the k = 1 anchor and it lands at 19.3%, so the
 *      half-floor scale is demonstrably NOT the bridge operating point.
 *
 * This is exactly imp-2520 negative-finding 1 and the imp-3671 (S2) obstruction: the nearest-pair / front
 * regime (deep k, y -> 0) is a DIFFERENT, Gronwall-vacuous scale from the mesoscopic reading that feeds
 * the E(N) constants. The half-floor at k ~ 8.76 is the first landmark of that descent, already past the
 * mean spacing -- it belongs to the G6a shock-front regime, not to E(N).
 *
 * VERDICT: CONFINED TO THE G6a SHOCK-FRONT REGIME. The imp-3671 k ~ 8.76 half-floor crossing has NO
 * quantitative bearing on the E(N) bridge share. The bridge constant is anchored at the mesoscopic k = 1
 * reading (floor 0.991, flow factor 1.0000917, ~19.3% bracket); the half-floor is an 8.76x-deeper
 * strip-height phenomenon, below the mean spacing, sharing no reading height and no input parameter with
 * the bridge factor. It lives entirely in the microscopic front regime that never reaches E(N).
 *
 * ASSESSMENT / DERIVATION ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. No refereed bound is changed.
 *
 * @see imp-3671-mesoscopic-v0-vs-g6a-shock-lipschitz-assessment (the k~8.76 half-floor scale table this assesses)
 * @see imp-3661-sigma-crossover-tc-density-corrected-pin (the density-corrected E(N) bridge flow factor)
 * @see imp-3604-sigma-crossover-flow-factor-invariance (the flat flow-factor bracket [1, 1.000474])
 * @see imp-2564-lambda-chain-direction-audit (per-N collision scale feeds the E(N) bridge constants)
 * @see imp-2520 (shock time t_c ~ 1/(2 V0); negative-finding 1: nearest-pair regime is a different, Gronwall-vacuous scale)
 */

import { IMP3671_MESOSCOPIC_V0_VS_G6A_SHOCK_LIPSCHITZ_ASSESSMENT } from './imp-3671-mesoscopic-v0-vs-g6a-shock-lipschitz-assessment.js';
import { IMP3661_SIGMA_CROSSOVER_TC_DENSITY_CORRECTED_PIN } from './imp-3661-sigma-crossover-tc-density-corrected-pin.js';

// Grounded reference values pulled from the two sibling modules (authoritative; no re-transcription).
const SEP = IMP3671_MESOSCOPIC_V0_VS_G6A_SHOCK_LIPSCHITZ_ASSESSMENT.scaleSeparation;
const E_MESO = SEP.E_meso; // 0.009041 = -ln(0.991), the imp-3642 mesoscopic Gronwall exponent
const K_HALF = SEP.k_half; // ~8.76: strip height (in units 1/k) at which the floor is 1/2
const Y_HALF_OVER_D = SEP.y_half_over_d; // ~0.457 d
const BRIDGE = IMP3661_SIGMA_CROSSOVER_TC_DENSITY_CORRECTED_PIN.crossoverScaleFactor;
const FLOW_FACTOR = BRIDGE.flowFactor_density_cg1; // 1.0000917 (density-corrected, C_G=1)
const BRACKET_FRACTION = BRIDGE.bracketFraction_density_cg1; // ~0.1935 of the imp-3604 bracket

// Gronwall floor at strip height y = y_star / k (same law as imp-3671).
function floorAt(k) {
  return Math.exp(-(k * k) * E_MESO);
}

const FLOOR_ANCHOR = floorAt(1); // 0.991 -- the height the E(N) bridge constant is actually read at (k=1)
const FLOOR_MEAN_SPACING = floorAt(4); // 0.865 -- floor already noticeably below 1 at the mean spacing d
const FLOOR_HALF = floorAt(K_HALF); // 0.5 by construction, at k~8.76 (below the mean spacing)

// (R1) Strip-height separation: the half-floor sits at 1/k_half of the bridge-anchor height.
const HEIGHT_SEPARATION_RATIO = 1 / K_HALF; // ~0.114: half-floor at ~11.4% of the k=1 bridge-anchor height
// (R3) Lost-contraction incommensurability: (1 - floor_half) / (1 - floor_anchor).
const LOST_CONTRACTION_RATIO = (1 - FLOOR_HALF) / (1 - FLOOR_ANCHOR); // ~55x

export const IMP3691_HALF_FLOOR_SCALE_VS_EN_BRIDGE_ASSESSMENT = {
  id: 'imp-3691',
  proofSection: 'S-frontier',
  question:
    'Does the imp-3671 scale-separation half-floor crossing at k ~ 8.76 -- the strip height (~0.457 d, ' +
    'below the mean spacing) at which the mesoscopic Gronwall contraction is half lost -- bear ' +
    'quantitatively on the E(N) bridge constants via the imp-3661 density-corrected flow factor ' +
    '1.0000917, or is it confined to the microscopic G6a shock-front regime that never reaches E(N)? ' +
    'Assessment/derivation only, no bridge closure, no QED.',
  bridgeReading:
    'The E(N) bridge constant is fed (imp-2564) by the collision-TIME scale t_c ~ 1/(2 V0), with V0 read ' +
    'at the SINGLE mesoscopic anchor y_star = 4 d (k = 1, Gronwall floor ~0.991). imp-3661 pins the ' +
    'crossover-scale flow factor to exp(t_c(N_x)) = 1.0000917 (C_G = 1), ~19.3% of the imp-3604 bracket. ' +
    'The flow factor is a scalar read at k = 1; it carries no strip-height descent (no k).',
  halfFloorReading:
    'The imp-3671 half-floor crossing is a property of the Gronwall CONTRACTION floor(k)=exp(-k^2 E_meso) ' +
    'as strip height y = y_star/k shrinks; it crosses 1/2 at k_half = sqrt(ln 2 / E_meso) ~ 8.76, i.e. ' +
    'at y_half ~ 0.457 d -- 8.76x deeper than the bridge anchor and below the mean spacing d (k=4).',
  scales: {
    E_meso: +E_MESO.toFixed(6), // 0.009041
    k_half: +K_HALF.toFixed(2), // ~8.76
    y_half_over_d: +Y_HALF_OVER_D.toFixed(4), // ~0.457 d (below the mean spacing)
    floor_at_bridge_anchor_k1: +FLOOR_ANCHOR.toFixed(6), // 0.991: where the E(N) constant is read
    floor_at_mean_spacing_k4: +FLOOR_MEAN_SPACING.toFixed(6), // 0.865
    floor_at_half_scale: +FLOOR_HALF.toFixed(6), // 0.5 by construction
    bridge_flowFactor_density_cg1: FLOW_FACTOR, // 1.0000917
    bridge_bracketFraction_density_cg1: BRACKET_FRACTION, // ~0.1935
  },
  reasons: {
    R1_disjoint_reading_height:
      'The E(N) bridge constant reads V0 (hence t_c) ONLY at the mesoscopic anchor k = 1; the half-floor ' +
      'is a k ~ 8.76 phenomenon. The two are read at strip heights a factor k_half ~ 8.76 apart (the ' +
      'half-floor at ~11.4% of the bridge-anchor height), so they share no strip height and the ' +
      'mesoscopic reading never samples the descent that produces the half-floor.',
    R2_disjoint_inputs_no_shared_parameter:
      'The 19.3% bracket occupancy is fixed by the density log ratio 0.3870 at N_x (no k); the half-floor ' +
      'k_half is fixed by E_meso = 0.009041 and the k^2 collapse (no density ratio). No parameter is ' +
      'shared -- vary k_half and the flow factor is untouched; vary the density ratio and k_half is ' +
      'untouched -- so the half-floor cannot shift the E(N) bridge share.',
    R3_gross_incommensurability:
      'If the half-floor scale set the E(N) contraction the relevant floor would be 1/2 (50% lost); the ' +
      'bridge actually operates at 0.991 (0.9% lost). The lost-contraction ratio ~55x means a ' +
      'half-floor-driven factor would swamp the measured 19.3% occupancy by orders of magnitude, yet ' +
      'imp-3661 measured the share entirely from the k = 1 anchor -- so the half-floor is not the ' +
      'bridge operating point.',
  },
  heightSeparationRatio: +HEIGHT_SEPARATION_RATIO.toFixed(4), // ~0.114
  lostContractionRatio: +LOST_CONTRACTION_RATIO.toFixed(1), // ~55x
  halfFloorBelowMeanSpacing: K_HALF > 4, // true: the half-floor sits deeper than the mean spacing d (k=4)
  bearsOnEnBridgeShare: false,
  confinedToG6aShockFront: true,
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier-direction, NOT rigorous): CONFINED TO THE G6a SHOCK-FRONT REGIME. The imp-3671 ' +
    'k ~ 8.76 half-floor crossing has NO quantitative bearing on the E(N) bridge share. The E(N) bridge ' +
    'constant is fed (imp-2564) by the collision-TIME scale t_c ~ 1/(2 V0), with V0 read at the SINGLE ' +
    'mesoscopic anchor y_star = 4 d (k = 1, floor 0.991); imp-3661 pins the density-corrected flow factor ' +
    'to 1.0000917, ~19.3% of the imp-3604 bracket, as a scalar carrying no strip-height descent (no k). ' +
    'The half-floor is a property of the Gronwall CONTRACTION floor(k) = exp(-k^2 E_meso) as strip height ' +
    'shrinks, crossing 1/2 at k_half ~ 8.76 (y ~ 0.457 d), 8.76x DEEPER than the bridge anchor and below ' +
    'the mean spacing d (k = 4, floor 0.865). Three independent reasons: (R1) the bridge reads V0 only at ' +
    'k = 1 while the half-floor is a k ~ 8.76 phenomenon, so they share no reading height (the half-floor ' +
    'at ~11.4% of the anchor height); (R2) the 19.3% occupancy is fixed by the density log ratio 0.3870 ' +
    '(no k) and k_half is fixed by E_meso = 0.009041 and the k^2 collapse (no density ratio), so no ' +
    'parameter is shared; (R3) a half-floor-driven E(N) contraction would sit at floor 1/2 (50% lost) vs ' +
    'the bridge 0.991 (0.9% lost), a ~55x lost-contraction ratio that would swamp the measured 19.3% ' +
    'occupancy by orders of magnitude, which imp-3661 measured entirely from the k = 1 anchor. This is ' +
    'exactly imp-2520 negative-finding 1 and the imp-3671 (S2) obstruction: the nearest-pair / front ' +
    'regime (deep k, y -> 0) is a DIFFERENT, Gronwall-vacuous scale from the mesoscopic reading that ' +
    'feeds E(N), and the k ~ 8.76 half-floor is the first landmark of that descent, past the mean ' +
    'spacing. Assessment/derivation only; no positivity, no bridge closure, no RH claim, NO QED. ' +
    'imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. No refereed bound is changed' +
    '.',
  citation:
    'imp-3671 (scale-separation table: floor(k) = exp(-k^2 E_meso), E_meso = 0.009041, half-floor at ' +
    'k ~ 8.76, y ~ 0.457 d); imp-3661 (density-corrected E(N) bridge flow factor 1.0000917, ~19.3% of ' +
    'the imp-3604 bracket [1, 1.000474], from the density log ratio 0.3870 at N_x); imp-3604 (flat ' +
    'flow-factor bracket); imp-2564 (per-N collision scale feeds the E(N) bridge constants, not the ' +
    'headline inequality); imp-2520 (t_c ~ 1/(2 V0); negative-finding 1: nearest-pair regime is a ' +
    'different, Gronwall-vacuous scale); imp-3642 (mesoscopic floor 0.991 at y_star = 4 d).',
};

export const IMP3691_HALF_FLOOR_SCALE_VS_EN_BRIDGE_ASSESSMENT_ASSERTIONS = [
  {
    // (R1) The bridge is read at k=1 (floor ~0.991) while the half-floor sits far deeper, below the mean spacing.
    id: 'imp3691-bridge-anchor-vs-half-floor-heights',
    description: 'E(N) bridge read at k=1 (floor ~0.991); half-floor at k~8.76 (~0.457 d), below the mean spacing d',
    holds: () =>
      Math.abs(FLOOR_ANCHOR - 0.991) < 1e-3 &&
      K_HALF > 4 &&
      Y_HALF_OVER_D < 0.5 &&
      FLOOR_HALF < FLOOR_MEAN_SPACING &&
      Math.abs(FLOOR_HALF - 0.5) < 1e-3, // k_half is the imp-3671 2-dp value 8.76, so floor is 0.5 to ~3e-4
  },
  {
    // (R1) The strip-height separation is a factor k_half ~ 8.76 (half-floor at ~11.4% of the anchor height).
    id: 'imp3691-height-separation-factor',
    description: 'half-floor sits at ~11.4% of the k=1 bridge-anchor height (separation factor k_half ~ 8.76)',
    holds: () =>
      HEIGHT_SEPARATION_RATIO > 0.1 &&
      HEIGHT_SEPARATION_RATIO < 0.13 &&
      Math.abs(HEIGHT_SEPARATION_RATIO - 1 / K_HALF) < 1e-12,
  },
  {
    // (R3) Gross incommensurability: the half-floor loses ~55x the contraction the bridge actually operates at.
    id: 'imp3691-lost-contraction-incommensurability',
    description: 'lost-contraction ratio (1-0.5)/(1-0.991) ~ 55x: half-floor scale would swamp the 19.3% bridge share',
    holds: () =>
      LOST_CONTRACTION_RATIO > 40 &&
      LOST_CONTRACTION_RATIO < 70 &&
      FLOW_FACTOR > 1 &&
      Math.abs(BRACKET_FRACTION - 0.1935) < 5e-3,
  },
  {
    // Verdict flags: confined to the G6a shock-front, no bearing on the E(N) bridge share.
    id: 'imp3691-verdict-confined-to-shock-front',
    description: 'Assessment concludes confined to the G6a shock-front: no bearing on the E(N) bridge share',
    holds: () =>
      IMP3691_HALF_FLOOR_SCALE_VS_EN_BRIDGE_ASSESSMENT.bearsOnEnBridgeShare === false &&
      IMP3691_HALF_FLOOR_SCALE_VS_EN_BRIDGE_ASSESSMENT.confinedToG6aShockFront === true &&
      IMP3691_HALF_FLOOR_SCALE_VS_EN_BRIDGE_ASSESSMENT.halfFloorBelowMeanSpacing === true,
  },
  {
    // Honesty gate: assessment/derivation only, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp3691-honesty-gate-no-qed',
    description: 'Assessment/derivation only: no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP3691_HALF_FLOOR_SCALE_VS_EN_BRIDGE_ASSESSMENT.isRigorous === false &&
      /NO QED/.test(IMP3691_HALF_FLOOR_SCALE_VS_EN_BRIDGE_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP3691_HALF_FLOOR_SCALE_VS_EN_BRIDGE_ASSESSMENT.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3691_HALF_FLOOR_SCALE_VS_EN_BRIDGE_ASSESSMENT.verdict),
  },
];

for (const a of IMP3691_HALF_FLOOR_SCALE_VS_EN_BRIDGE_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3691-half-floor-scale-vs-en-bridge-assessment assertion failed: ${a.id}`);
  }
}
