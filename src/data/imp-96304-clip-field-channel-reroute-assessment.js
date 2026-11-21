/**
 * @module data/imp-96304-clip-field-channel-reroute-assessment
 * @fileoverview imp-96304 -- assessment of whether the imp-3933 field-channel
 *   reroute removes the single C_Lip factor that imp-96290 localizes as the
 *   sole unquantified N-dependence in the Step-4 error decomposition
 *   E(N) = E_trunc(N) + E_flow(N) + E_coll(N).
 *
 *   CONTEXT. imp-96290 (step4-bridge-subconstant-inventory) measures that every
 *   input to E(N) is either quantified (C_F pinned, C_KH discharged, C_shock
 *   N-uniform < 1/3) or rate-positive (kappa_T = 0.182) EXCEPT the single
 *   sub-factor C_Lip inside C_H = C_shock * C_Lip / 4. C_Lip is the N-uniform
 *   Gronwall Lipschitz constant of the gap functional under the backward Dyson
 *   flow, |g_min(mu_1) - g_min(mu_2)| <= C_Lip * W_1, i.e. a modulus in the
 *   W_1 measure metric. Its discharge is NEGATIVE (imp-2640; ch-wall-frontier
 *   verdict RH-HARD-CONFIRMED). imp-3933 records a field-channel reroute that
 *   BYPASSES the C_Lip wall. This module ASSESSES exactly what that reroute does
 *   to the E_coll leg and MEASURES what remains gated.
 *
 *   FINDING (assessment; no bound claim, no closure).
 *   -------------------------------------------------
 *   The field-channel reroute does NOT remove C_Lip from the W_1 channel: the
 *   three W_1-measure impossibility proofs (Holder-1/2 cusp lower bound;
 *   linear-N W_1 dilution; refuted surrogates) stand untouched, so no N-uniform
 *   W_1-metric C_Lip constant exists. What the reroute does is REPLACE the
 *   E_coll leg C_H * W_1^(1/2) with a DIFFERENT object living in the
 *   vector-field-error channel: a model-to-true collision-time transfer modulus
 *   W(eps) = tHi(eps) - tLo(eps) between any two flows dx/dt = F_Dyson + e that
 *   share the SAME zero-table initial data and whose field error obeys the
 *   local-difference bound |e_{l+1} - e_l| <= eps * g_l. That modulus is
 *   table-certified, N-uniform, slope ~ 3 H^4/64 (max 9.503e-8 over the 10
 *   plateaus of [1e4, 1e6]), and needs NO Gronwall, NO W_1, NO GUE/PCC.
 *
 *   So the C_Lip gate is RE-CHANNELED, not eliminated. It moves off the E_coll
 *   leg only IF the reroute is a valid substitution, which is gated on the OPEN
 *   sub-gap imp-3933-sub-eps-certificate: a deterministic field-Lipschitz
 *   constant eps_true (ideally the per-gap profile eps_l) for the true xi
 *   backward-heat-flow field vs the window-Dyson field on [0, T]. imp-33224
 *   REDUCES that sub-gap to a convergent deterministic initial-data functional
 *   of the SAME 1/((x-y1)(x-y2)) kernel as Psi, with a binding channel (top-edge
 *   far zeros, eps ~ O(10) at k = 1, decaying 2/(delta^2 k) into the interior)
 *   and a recommended per-gap closure -- but full closure STAYS OPEN, and the
 *   E_trunc/E_flow constants stay ansatz (C_T = C_F = 1), so E(N) < 0.2 remains
 *   an ESTIMATE even with the transfer certified.
 *
 *   NET: the reroute removes C_Lip from the E_coll leg's REQUIREMENT (E_coll no
 *   longer needs the RH-hard W_1-metric C_Lip; it needs the field-transfer
 *   modulus instead), but the gate survives as the reduced-but-open eps_true
 *   certificate. The tractability improves qualitatively -- imp-2640 Gronwall
 *   was NEGATIVE (impossibility-flavoured), whereas the field reroute reduces to
 *   discrete-sum bookkeeping plus per-gap certification with NO impossibility
 *   proof against it -- but no closure is achieved here.
 *
 *   ASSESSMENT / MEASUREMENT ONLY. Closes no gap, changes no bound, proves no
 *   constant. No refereed bound is changed. RH open. NO QED.
 *
 * Provenance of every baked literal (cited, not recomputed):
 *   - imp-96290-step4-bridge-subconstant-inventory.js: C_H = C_shock * C_Lip/4,
 *     C_Lip isNDependenceQuantified = false, residual gap localizes to C_Lip.
 *   - imp-3933-eps-field-robust-bootstrap.js: field-channel transfer modulus
 *     W(eps), maxCFieldSlope 9.503e-8, minEpsMax 22.9163, cHRouteEcollN1e4
 *     0.0913, transferAdvantageFactor ~1.77e5, open sub-gaps.
 *   - imp-33224 (EPS_TRUE_DECOMPOSITION): eps_true reduction to a convergent
 *     functional; binding channel top-edge far zeros; STAYS OPEN.
 *
 * Syntax note: derivative-like expressions use brace notation dg_{k*}/dt and
 *   this header avoids the close-comment terminator sequence inside prose.
 */

// Cited from imp-3933-eps-field-robust-bootstrap.js (single source of truth).
const FIELD_CHANNEL = {
  maxCFieldSlope: 9.502858e-8, // W(1)-W(0), the field-channel modulus slope ~3H^4/64
  minEpsMax: 22.9163, // certifiable field-error headroom floor (plateau 1)
  cHRouteEcollN1e4: 0.0913, // the C_H * W_1^(1/2) E_coll leg this replaces (C_H=1 ansatz)
  maxTransferWidthAtEps1: 5.17e-7, // model<->true transfer bound at unit field-Lipschitz error
  transferAdvantageFactor: 1.77e5, // 0.0913 / 5.17e-7
};

// The three questions the ticket poses, answered against the two modules.
const ASSESSMENT = [
  {
    question:
      'Does the field-channel reroute remove C_Lip from the W_1 (measure) channel?',
    answer: 'NO',
    detail:
      'The three W_1-metric impossibility proofs (Holder-1/2 cusp lower bound, ' +
      'linear-N W_1 dilution, refuted surrogates; ch-wall RH-HARD-CONFIRMED) are ' +
      'explicitly untouched. No N-uniform W_1-metric C_Lip constant exists; imp-3933 ' +
      'claims none. The imp-96290 localization of the gap to C_Lip in that channel stands.',
  },
  {
    question:
      'Does the reroute remove C_Lip from the E_coll leg of E(N)=E_trunc+E_flow+E_coll?',
    answer: 'CONDITIONALLY -- it re-channels the leg, gated on an OPEN sub-gap',
    detail:
      'The reroute REPLACES the E_coll leg C_H * W_1^(1/2) (~0.0913 at N*=1e4) with a ' +
      'field-error transfer modulus W(eps) between two flows sharing the SAME zero-table ' +
      'initial data with |e_{l+1}-e_l| <= eps * g_l. W(eps) is table-certified, N-uniform, ' +
      'slope ~3H^4/64 (max 9.503e-8), no Gronwall/W_1/GUE. So E_coll no longer REQUIRES ' +
      'the RH-hard W_1-metric C_Lip. But this substitution is valid only once the true-vs- ' +
      'window field-Lipschitz certificate eps_true is proven (imp-3933-sub-eps-certificate, OPEN).',
  },
  {
    question: 'What remains gated after the reroute?',
    answer: 'The reduced-but-open eps_true certificate, the bracket re-architecture, and the ansatz E_trunc/E_flow constants',
    detail:
      '(1) imp-3933-sub-eps-certificate: a deterministic eps_true (per-gap eps_l) for the ' +
      'true xi backward-heat-flow field vs the window-Dyson field on [0,T]. imp-33224 REDUCES ' +
      'it to a convergent initial-data functional of the same 1/((x-y1)(x-y2)) kernel as Psi; ' +
      'binding channel = top-edge far zeros (eps ~ O(10) at k=1, decaying 2/(delta^2 k)); ' +
      'per-gap closure recommended -- but STAYS OPEN. (2) imp-3933-sub-bracket-rearchitecture: ' +
      'restate the E(N) chain to route through the field channel -- OPEN. (3) E_trunc/E_flow ' +
      'constants stay ansatz (C_T=C_F=1), so E(N) < 0.2 stays an ESTIMATE even with W(eps_true) certified.',
  },
];

export const IMP96304_CLIP_FIELD_CHANNEL_REROUTE_ASSESSMENT = {
  id: 'imp-96304',
  title:
    'Assessment: the imp-3933 field-channel reroute re-channels (does not ' +
    'eliminate) the C_Lip factor imp-96290 localizes as the sole unquantified ' +
    'E_coll N-dependence',
  kind: 'assessment / measurement (no closure, no bound change)',
  errorDecomposition: 'E(N) = E_trunc(N) + E_flow(N) + E_coll(N)',
  cLipGate: {
    fromModule: 'imp-96290',
    formula: 'C_H = C_shock * C_Lip / 4',
    unquantifiedFactor: 'C_Lip',
    w1MetricModulus: '|g_min(mu_1) - g_min(mu_2)| <= C_Lip * W_1 (Gronwall, imp-2640 NEGATIVE)',
    isNDependenceQuantifiedInW1Channel: false,
  },
  fieldChannel: FIELD_CHANNEL,
  assessment: ASSESSMENT,
  verdict:
    'RE-CHANNELED, NOT ELIMINATED. The field-channel reroute leaves the W_1-metric ' +
    'C_Lip verdicts untouched (no N-uniform W_1 C_Lip exists) and instead REPLACES the ' +
    'E_coll leg C_H * W_1^(1/2) with a table-certified, N-uniform field-error transfer ' +
    'modulus W(eps) ~ 3H^4/64 (max slope 9.503e-8, ~1.77e5x tighter than the 0.0913 ' +
    'W_1-Holder leg). E_coll therefore no longer REQUIRES the RH-hard W_1-metric C_Lip, ' +
    'but the substitution is gated on the OPEN eps_true certificate (imp-3933-sub-eps- ' +
    'certificate; imp-33224 reduces it to a convergent functional, full closure open), ' +
    'the OPEN bracket re-architecture, and the ansatz C_T = C_F = 1. The gate is moved ' +
    'from an impossibility-flavoured Gronwall factor (imp-2640 NEGATIVE) to a reduced-but- ' +
    'open discrete-sum certificate with no impossibility proof against it -- a qualitative ' +
    'tractability gain, not a closure. No refereed bound is changed. RH open. NO QED.',
  provenance:
    'imp-96290-step4-bridge-subconstant-inventory.js; ' +
    'imp-3933-eps-field-robust-bootstrap.js (EPS_FIELD_ROBUST_BOOTSTRAP, EPS_TRUE_DECOMPOSITION)',
};

export const IMP96304_CLIP_FIELD_CHANNEL_REROUTE_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp96304-w1-channel-clip-not-removed',
    holds: () =>
      IMP96304_CLIP_FIELD_CHANNEL_REROUTE_ASSESSMENT.cLipGate
        .isNDependenceQuantifiedInW1Channel === false &&
      ASSESSMENT[0].answer === 'NO',
    why:
      'The reroute must NOT be recorded as removing C_Lip from the W_1 channel: the ' +
      'three W_1-metric impossibility proofs (ch-wall RH-HARD-CONFIRMED) stand untouched. ' +
      'If a future edit flips this, the same commit must overturn those verdicts and cite the proof.',
  },
  {
    id: 'imp96304-ecoll-leg-only-conditionally-rerouted',
    holds: () =>
      /CONDITIONALLY/.test(ASSESSMENT[1].answer) &&
      /OPEN/.test(ASSESSMENT[1].answer),
    why:
      'The E_coll leg is re-channeled only conditionally on the OPEN eps_true certificate ' +
      '(imp-3933-sub-eps-certificate). The assessment must never present the reroute as an ' +
      'unconditional removal of the E_coll C_Lip requirement.',
  },
  {
    id: 'imp96304-field-modulus-beats-w1-holder-leg',
    holds: () =>
      FIELD_CHANNEL.maxCFieldSlope < 1e-7 &&
      FIELD_CHANNEL.cHRouteEcollN1e4 > FIELD_CHANNEL.maxTransferWidthAtEps1 &&
      FIELD_CHANNEL.transferAdvantageFactor > 1e5,
    why:
      'The cited field-channel numbers (slope < 1e-7, transfer width 5.17e-7 vs the 0.0913 ' +
      'W_1-Holder leg, >1e5x tighter) are the quantitative content of the substitution; they ' +
      'match imp-3933 EPS_FIELD_ROBUST_BOOTSTRAP.',
  },
  {
    id: 'imp96304-no-closure-claimed',
    holds: () =>
      /RE-CHANNELED, NOT ELIMINATED/.test(
        IMP96304_CLIP_FIELD_CHANNEL_REROUTE_ASSESSMENT.verdict,
      ) &&
      /NO QED/.test(IMP96304_CLIP_FIELD_CHANNEL_REROUTE_ASSESSMENT.verdict) &&
      IMP96304_CLIP_FIELD_CHANNEL_REROUTE_ASSESSMENT.kind.includes('no closure'),
    why:
      'This ticket is assessment/measurement only. It must not claim closure of C_Lip, of ' +
      'the E_coll reroute, or of any bound; no refereed bound is changed.',
  },
];
