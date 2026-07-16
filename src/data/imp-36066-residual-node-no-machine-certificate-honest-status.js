/**
 * @module imp-36066-residual-node-no-machine-certificate-honest-status
 * @fileoverview imp-36066 -- standalone HONEST-STATUS note recording plainly, for a
 *   reader who lands on this ticket without having read imp-35969/imp-36017 in full,
 *   that BOTH width figures for the Krawczyk residual node [F(m)] = [m] - [K log
 *   T0(m)] are a-priori MODELS, not a machine certificate:
 *     - imp-35969 measured a bit-level nextafter (nextUp/nextDown) OUTWARD-ROUNDING
 *       SURROGATE width, and its own verdict already flags it as "surrogate, NOT a
 *       machine certificate".
 *     - imp-36017 measured a SECOND, a-priori correctly-rounded directed-rounding
 *       LAYER-model width, found the imp-35969 surrogate over-estimates it by a
 *       clean, a-independent 2x factor, and stressed that this LAYER model is
 *       ITSELF an a-priori formula, NOT the imp-34687a directed-rounding layer.
 *   Neither module instantiates a certified interval or ports the imp-34687a layer:
 *   the imp-34687a directed-rounding layer that would make the residual-node
 *   enclosure an actual machine certificate REMAINS UNIMPLEMENTED, and the imp-34714a
 *   Krawczyk existence/uniqueness sub-gap STAYS OPEN. Read-only note: imports both
 *   source objects verbatim (no re-derivation, no new numerics).
 *
 *   Ticket: imp-36066 (content, low). Note only; ports nothing; changes no bound;
 *   Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.
 *
 * @see imp-35969-krawczyk-residual-directed-rounding-width (source: the nextafter SURROGATE width; "NOT a machine certificate")
 * @see imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy (source: the a-priori LAYER-model width; surrogate over-estimates it 2x)
 * @see imp-34687-crossover-interval-arithmetic-scope (the directed-rounding layer both models stand in for; sub-gap imp-34687a unimplemented)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (Krawczyk lemma; sub-gap imp-34714a open)
 */

import { IMP35969_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_WIDTH } from './imp-35969-krawczyk-residual-directed-rounding-width.js';
import { IMP36017_KRAWCZYK_RESIDUAL_SURROGATE_VS_LAYER_DISCREPANCY } from './imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy.js';

const SURROGATE = IMP35969_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_WIDTH;
const LAYER_DISCREPANCY = IMP36017_KRAWCZYK_RESIDUAL_SURROGATE_VS_LAYER_DISCREPANCY;

export const IMP36066_RESIDUAL_NODE_NO_MACHINE_CERTIFICATE_HONEST_STATUS = Object.freeze({
  id: 'imp-36066',
  title:
    'Honest-status note: BOTH the imp-35969 nextafter surrogate and the imp-36017 a-priori LAYER width model ' +
    'of the Krawczyk residual node are correctly-rounded MODELS, not a machine certificate',
  sourceModules: [
    'imp-35969-krawczyk-residual-directed-rounding-width.js',
    'imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy.js',
  ],

  modelSummary: Object.freeze({
    surrogate_width_at_N_cross: SURROGATE.measurement.width_at_N_cross,
    surrogate_is_rigorous: SURROGATE.isRigorous,
    layer_width_at_N_cross: LAYER_DISCREPANCY.measurement.layer_width_at_N_cross,
    layer_is_rigorous: LAYER_DISCREPANCY.isRigorous,
    surrogate_over_layer_ratio_at_N_cross: LAYER_DISCREPANCY.measurement.ratio_at_N_cross,
    surrogate_over_layer_ratio_at_top: LAYER_DISCREPANCY.measurement.ratio_at_top,
  }),

  conclusion:
    'Two double-precision MODELS exist for the width of the Krawczyk residual node [F(m)] = [m] - [K log ' +
    'T0(m)] at the certificate centre m = N_cross, and NEITHER is a machine certificate. imp-35969 built a ' +
    'bit-level nextafter (nextUp/nextDown) OUTWARD-ROUNDING surrogate and reported a width ~ ' +
    SURROGATE.measurement.width_at_N_cross.toExponential(3) +
    ' at N_cross, already flagged as "MEASUREMENT / surrogate, NOT a machine certificate". imp-36017 then ' +
    'built a SECOND model -- an a-priori correctly-rounded directed-rounding LAYER formula -- and measured ' +
    'that the imp-35969 surrogate over-estimates that layer width by a ratio ~ ' +
    LAYER_DISCREPANCY.measurement.ratio_at_N_cross.toFixed(3) +
    ' at N_cross, converging to exactly ' +
    LAYER_DISCREPANCY.measurement.ratio_at_top.toFixed(4) +
    ' up the height axis (a-independent). But imp-36017 itself stresses that the LAYER model is an a-priori ' +
    'correctly-rounded FORMULA, NOT the imp-34687a directed-rounding layer -- which JavaScript lacks and ' +
    'which remains UNIMPLEMENTED. So the "surrogate is conservative by ~2x" finding compares two MODELS of ' +
    'the same node, not a model against a certificate: no run of either module instantiates a certified ' +
    'interval, ports the imp-34687a layer, or discharges the F(m) = 0 residual-at-root artifact. The ' +
    'imp-34714a Krawczyk existence/uniqueness sub-gap STAYS OPEN.',

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    changesAnyBound: false,
    portsAnyRoute: false,
    subGap: 'imp-34687a (directed-rounding layer) UNIMPLEMENTED; imp-34714a (Krawczyk existence/uniqueness) REMAINS OPEN',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),

  verdict:
    'NO MACHINE CERTIFICATE EXISTS FOR THE RESIDUAL NODE (restated from imp-35969/imp-36017): both the ' +
    'nextafter surrogate width (~' +
    SURROGATE.measurement.width_at_N_cross.toExponential(3) +
    ' at N_cross) and the a-priori correctly-rounded layer-model width (~' +
    LAYER_DISCREPANCY.measurement.layer_width_at_N_cross.toExponential(3) +
    ' at N_cross, ~' +
    LAYER_DISCREPANCY.measurement.ratio_at_N_cross.toFixed(2) +
    'x tighter) are MODELS of what the imp-34687a directed-rounding layer would emit, not that layer itself. ' +
    'The imp-34687a layer remains UNIMPLEMENTED and imp-34714a stays OPEN. Measurement/diagnostic ' +
    'restatement only; changes no bound; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.',
});

export const IMP36066_RESIDUAL_NODE_NO_MACHINE_CERTIFICATE_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36066-both-sources-flag-non-rigorous',
    why: 'Both source modules must self-report as non-rigorous measurements, matching the "no certificate" claim.',
    holds: () => SURROGATE.isRigorous === false && LAYER_DISCREPANCY.isRigorous === false,
  },
  {
    id: 'imp36066-ratio-matches-source',
    why: 'The restated surrogate-over-layer ratios must equal the imp-36017 source measurement exactly (read-only restatement).',
    holds: () =>
      IMP36066_RESIDUAL_NODE_NO_MACHINE_CERTIFICATE_HONEST_STATUS.modelSummary.surrogate_over_layer_ratio_at_N_cross ===
        LAYER_DISCREPANCY.measurement.ratio_at_N_cross &&
      IMP36066_RESIDUAL_NODE_NO_MACHINE_CERTIFICATE_HONEST_STATUS.modelSummary.surrogate_over_layer_ratio_at_top ===
        LAYER_DISCREPANCY.measurement.ratio_at_top,
  },
  {
    id: 'imp36066-honesty-gate',
    why: 'This is a read-only restatement note: it must not claim proof, RH reduction, or any changed bound.',
    holds: () =>
      IMP36066_RESIDUAL_NODE_NO_MACHINE_CERTIFICATE_HONEST_STATUS.honestCaveat.isProof === false &&
      IMP36066_RESIDUAL_NODE_NO_MACHINE_CERTIFICATE_HONEST_STATUS.honestCaveat.isReductionBelowRH === false &&
      IMP36066_RESIDUAL_NODE_NO_MACHINE_CERTIFICATE_HONEST_STATUS.honestCaveat.changesAnyBound === false &&
      /imp-34687a/.test(IMP36066_RESIDUAL_NODE_NO_MACHINE_CERTIFICATE_HONEST_STATUS.honestCaveat.subGap) &&
      /imp-34714a/.test(IMP36066_RESIDUAL_NODE_NO_MACHINE_CERTIFICATE_HONEST_STATUS.honestCaveat.subGap) &&
      /Platt-Trudgian/.test(IMP36066_RESIDUAL_NODE_NO_MACHINE_CERTIFICATE_HONEST_STATUS.honestCaveat.sota),
  },
  {
    id: 'imp36066-verdict-no-certificate-no-qed',
    why: 'The verdict must record that no machine certificate exists and NO QED, matching the source findings.',
    holds: () =>
      /NO MACHINE CERTIFICATE/.test(IMP36066_RESIDUAL_NODE_NO_MACHINE_CERTIFICATE_HONEST_STATUS.verdict) &&
      /NO QED/.test(IMP36066_RESIDUAL_NODE_NO_MACHINE_CERTIFICATE_HONEST_STATUS.verdict),
  },
];

for (const assertion of IMP36066_RESIDUAL_NODE_NO_MACHINE_CERTIFICATE_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36066-residual-node-no-machine-certificate-honest-status assertion failed: ${assertion.id}`);
  }
}

export default IMP36066_RESIDUAL_NODE_NO_MACHINE_CERTIFICATE_HONEST_STATUS;
