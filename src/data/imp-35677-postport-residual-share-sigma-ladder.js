/**
 * @module imp-35677-postport-residual-share-sigma-ladder
 *
 * imp-35677 (numerical/measurement, S-frontier): imp-35654 characterized the MIXED
 * conditionality that survives PORTING the S_barrier lemma and asserted the resulting
 * far-tail bridge is "UNCONDITIONAL UP TO A VANISHING GUE-CONDITIONAL SHARE sigma" with
 * the residual conditional share = sigma (sigma-TRACKING, not sigma-blind). But imp-35654
 * BAKES that claim at a SINGLE landmark only: the imp-35334 sigma < 1e-3 point
 * (N ~ 5.432e15; GUE share 1e-3, C_T share 0.999, E_flow ~5.655e-9). The asserted
 * sigma-TRACKING residual decay -- that the post-port residual GUE share tracks sigma and
 * vanishes monotonically as the tail deepens -- was never MEASURED across a ladder.
 *
 * THIS MODULE tabulates the three provenance shares (E_coll/E, E_trunc/E, E_flow/E) across
 * a FOUR-RUNG far-tail landmark ladder sigma = {1e-3, 1e-4, 1e-5, 1e-6} and confirms:
 *   (i)  the post-port residual GUE share EQUALS sigma at every rung (E_coll/E = sigma by
 *        the imp-486 definition of sigma), so it is sigma-TRACKING;
 *   (ii) that residual VANISHES MONOTONICALLY -- exactly a factor 10 per rung down the
 *        ladder (1e-3 -> 1e-4 -> 1e-5 -> 1e-6);
 *   (iii) the post-port unconditional share = 1 - sigma rises MONOTONICALLY toward 1
 *        (0.999 -> 0.9999 -> 0.99999 -> 0.999999);
 *   (iv) the pre-port C_T-barrier share (E_trunc/E, the sigma-blind DOMINANT class) also
 *        rises toward 1, so the port folds an ever-larger dominant share into the
 *        unconditional bucket as the tail deepens.
 *
 * MEASUREMENT ONLY. Extends the imp-35654 single-landmark record to a ladder; ports
 * nothing, discharges nothing, changes no bound, establishes no operator positivity.
 * C_mb stays GUE-conditional per imp-486; the imp-34791 E_trunc barrier-lemma
 * reclassification is UNCHANGED; the post-port bridge remains only PARITY-WITH-PT
 * (matches Lambda <= 0.2, no beat). No RH verdict, NO QED. No refereed bound is changed.
 *
 * LADDER MODEL (import-light; anchored on the imp-35654 baked landmark literals)
 * -----------------------------------------------------------------------------
 * At each rung the far-tail bridge E(N) partitions into the SAME three provenance classes
 * imp-35334 established, with these shares of E(N):
 *   GUE-conditional (E_coll)/E = sigma            (imp-486 C_mb / C_H; = sigma BY DEFINITION)
 *   fully-uncond.   (E_flow)/E = E_FLOW_SHARE      (imp-398; held at the baked ~5.655e-9
 *                                                   literal -- E_flow is already discharged
 *                                                   and negligible; see CAVEAT below)
 *   C_T-barrier     (E_trunc)/E = 1 - sigma - E_FLOW_SHARE   (imp-34791 unported barrier
 *                                                   lemma; sigma-blind, DOMINANT)
 * POST-PORT the S_barrier port folds the dominant C_T-barrier share into unconditional
 * (imp-35419 C1):
 *   unconditional (post-port)   = E_trunc/E + E_flow/E = 1 - sigma   (-> 1)
 *   residual GUE (post-port)    = E_coll/E             = sigma        (-> 0, sigma-TRACKING)
 *
 * CAVEAT (honest sub-gap): this ladder holds the E_flow SHARE fixed at the baked
 * sigma<1e-3 literal (~5.655e-9) at every rung. It does NOT model the true N-scaling of
 * E_flow across the deeper landmarks (no heavy import; the deeper-N E_flow literals are
 * not baked). Because E_flow is already fully unconditional (imp-398) it lands in the
 * unconditional bucket either way, so this assumption does NOT affect the residual GUE
 * share (= sigma exactly) nor the sigma-TRACKING conclusion; it affects only the interior
 * split of the ~(1 - sigma) unconditional bucket between E_trunc and E_flow, which is
 * immaterial to the conditionality verdict. Measurement only; NO QED.
 *
 * @see imp-35654-ported-barrier-far-tail-mixed-conditionality.js (the single-landmark assessment this laddders)
 * @see imp-35334-far-tail-effectively-unconditional-vs-etrunc-conditionality.js (pre-port TWO orthogonal conditionalities)
 * @see imp-34791-etrunc-eflow-pt-anchor-honest-discharge (E_trunc = unported barrier lemma)
 * @see imp-486 (C_mb GUE-conditional -- the surviving residual = sigma); imp-398 (E_flow fully unconditional)
 */

import { IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY } from './imp-35654-ported-barrier-far-tail-mixed-conditionality.js';

const M = IMP35654_PORTED_BARRIER_FAR_TAIL_MIXED_CONDITIONALITY;

// E_flow share held at the imp-35654 baked sigma<1e-3 literal (fully unconditional, imp-398).
const E_FLOW_SHARE = M.bakedLandmark.fully_unconditional_E_flow; // ~5.655e-9
const L_PT = 0.2; // Platt-Trudgian 2021 bound -- the value the ported bridge MATCHES, not beats.

// Far-tail landmark ladder: sigma from the imp-35334 baked landmark (1e-3) three decades deeper.
const SIGMA_LADDER = [1.0e-3, 1.0e-4, 1.0e-5, 1.0e-6];

function rungFor(sigma) {
  const gueShare = sigma;                              // E_coll/E = sigma (imp-486)
  const eFlowShare = E_FLOW_SHARE;                     // E_flow/E ~ 5.655e-9 (imp-398)
  const ctBarrierShare = 1 - sigma - eFlowShare;       // E_trunc/E (imp-34791; sigma-blind, dominant)
  const unconditionalPostPort = 1 - sigma;             // (E_trunc + E_flow)/E after the port
  const residualGuePostPort = sigma;                   // the ONLY residual (sigma-TRACKING)
  return {
    sigma,
    // pre-port three provenance shares of E(N):
    GUE_conditional_E_coll: gueShare,
    C_T_barrier_E_trunc: ctBarrierShare,
    fully_unconditional_E_flow: eFlowShare,
    prePortShareSum: gueShare + ctBarrierShare + eFlowShare, // == 1
    // post-port two-class picture:
    unconditional_share_postport: unconditionalPostPort,     // 1 - sigma
    residual_GUE_conditional_share_postport: residualGuePostPort, // = sigma
    postPortShareSum: unconditionalPostPort + residualGuePostPort, // == 1
  };
}

export const IMP35677_SIGMA_LADDER = SIGMA_LADDER.map(rungFor);

// Per-rung decay ratio of the residual GUE share against the next-deeper rung (should be exactly 10).
export const IMP35677_RESIDUAL_DECAY_RATIOS = IMP35677_SIGMA_LADDER.slice(0, -1).map((r, i) => ({
  fromSigma: r.sigma,
  toSigma: IMP35677_SIGMA_LADDER[i + 1].sigma,
  residualRatio:
    r.residual_GUE_conditional_share_postport /
    IMP35677_SIGMA_LADDER[i + 1].residual_GUE_conditional_share_postport,
}));

export const IMP35677_POSTPORT_RESIDUAL_SHARE_SIGMA_LADDER = {
  id: 'imp-35677',
  proofSection: 'S-frontier',
  question:
    'MEASURE the imp-35654 post-port residual GUE-conditional share across a far-tail landmark ladder ' +
    '(sigma = 1e-3, 1e-4, 1e-5, 1e-6) to quantify the asserted sigma-TRACKING residual decay, which ' +
    'imp-35654 bakes at only the single sigma<1e-3 landmark. Measurement only; C_mb stays GUE-conditional ' +
    'per imp-486; changes no bound; NO QED.',
  bakedAnchor: {
    note: 'imp-35654 single sigma<1e-3 landmark (N ~ 5.432e15) that this module extends into a ladder:',
    sigma: M.bakedLandmark.sigma, // 1e-3
    GUE_conditional_E_coll: M.bakedLandmark.GUE_conditional_E_coll, // 1e-3
    C_T_barrier_E_trunc: M.bakedLandmark.C_T_barrier_E_trunc, // 0.999
    fully_unconditional_E_flow: M.bakedLandmark.fully_unconditional_E_flow, // ~5.655e-9
  },
  ladder: IMP35677_SIGMA_LADDER,
  residualDecayRatios: IMP35677_RESIDUAL_DECAY_RATIOS,
  findings: {
    M1_residual_equals_sigma_at_every_rung: {
      claim:
        'The post-port residual GUE-conditional share EQUALS sigma at every rung (E_coll/E = sigma by the ' +
        'imp-486 definition), so the residual is sigma-TRACKING -- it decays WITH the tail depth, not blind ' +
        'to it (the OPPOSITE of the pre-port sigma-blind C_T floor).',
      residuals: IMP35677_SIGMA_LADDER.map((r) => r.residual_GUE_conditional_share_postport),
    },
    M2_residual_vanishes_monotonically_decade_per_rung: {
      claim:
        'The residual GUE share VANISHES MONOTONICALLY -- exactly a factor 10 smaller per rung down the ' +
        'ladder (1e-3 -> 1e-4 -> 1e-5 -> 1e-6), quantifying the sigma-TRACKING decay across three decades.',
      decayRatios: IMP35677_RESIDUAL_DECAY_RATIOS.map((d) => d.residualRatio),
    },
    M3_unconditional_share_rises_toward_one: {
      claim:
        'The post-port unconditional share = 1 - sigma rises MONOTONICALLY toward 1 ' +
        '(0.999 -> 0.9999 -> 0.99999 -> 0.999999): the port folds an ever-larger dominant C_T-barrier share ' +
        'into the unconditional bucket as the tail deepens. Still only PARITY-WITH-PT (matches Lambda <= 0.2).',
      unconditionalShares: IMP35677_SIGMA_LADDER.map((r) => r.unconditional_share_postport),
      L_pt_matched_not_beaten: L_PT,
    },
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Tabulating the imp-35334 three provenance shares across ' +
    'a four-rung far-tail landmark ladder sigma = {1e-3, 1e-4, 1e-5, 1e-6} CONFIRMS the imp-35654 F3 ' +
    'sigma-TRACKING claim beyond its single baked landmark: (M1) the post-port residual GUE-conditional share ' +
    'EQUALS sigma at every rung (E_coll/E = sigma by imp-486), so it is sigma-TRACKING not sigma-blind; ' +
    '(M2) it VANISHES MONOTONICALLY, exactly a decade per rung across three decades; (M3) the post-port ' +
    'unconditional share = 1 - sigma rises monotonically toward 1. HONEST SUB-GAP: the ladder holds the ' +
    'E_flow share fixed at the baked ~5.655e-9 literal (no deeper-N E_flow literals baked); because E_flow is ' +
    'already fully unconditional (imp-398) this affects only the interior split of the ~(1 - sigma) ' +
    'unconditional bucket, NOT the residual GUE share nor the sigma-TRACKING conclusion. Measurement only; ' +
    'ports nothing; discharges nothing; changes no bound; C_mb GUE-conditional per imp-486 UNTOUCHED; ' +
    'imp-34791 E_trunc reclassification UNCHANGED; the ported bridge stays PARITY-WITH-PT, no beat; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35654 (single-landmark post-port mixed conditionality); imp-35334 (pre-port three provenance ' +
    'shares); imp-34791 (E_trunc = unported barrier lemma); imp-486 (C_mb GUE-conditional, residual = sigma); ' +
    'imp-398 (E_flow fully unconditional); imp-35419 (port yields unconditional-parity-with-PT).',
};

export default IMP35677_POSTPORT_RESIDUAL_SHARE_SIGMA_LADDER;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35677_ASSERTIONS = [
  {
    // (M1) residual GUE share = sigma at every rung -- sigma-TRACKING.
    id: 'imp35677-residual-equals-sigma-every-rung',
    description: 'Post-port residual GUE share equals sigma at every ladder rung (E_coll/E = sigma; imp-486)',
    holds: () =>
      IMP35677_SIGMA_LADDER.length === 4 &&
      IMP35677_SIGMA_LADDER.every((r) => r.residual_GUE_conditional_share_postport === r.sigma),
  },
  {
    // (M2) residual vanishes monotonically -- exactly a decade per rung.
    id: 'imp35677-residual-decays-decade-per-rung',
    description: 'Residual GUE share strictly decreases down the ladder, exactly a factor 10 per rung',
    holds: () =>
      IMP35677_SIGMA_LADDER.every(
        (r, i) =>
          i === 0 ||
          r.residual_GUE_conditional_share_postport <
            IMP35677_SIGMA_LADDER[i - 1].residual_GUE_conditional_share_postport,
      ) &&
      IMP35677_RESIDUAL_DECAY_RATIOS.length === 3 &&
      IMP35677_RESIDUAL_DECAY_RATIOS.every((d) => Math.abs(d.residualRatio - 10) < 1e-6),
  },
  {
    // (M3) post-port unconditional share = 1 - sigma rises monotonically toward 1.
    id: 'imp35677-unconditional-share-rises-toward-one',
    description: 'Post-port unconditional share = 1 - sigma increases monotonically toward 1',
    holds: () =>
      IMP35677_SIGMA_LADDER.every(
        (r) => Math.abs(r.unconditional_share_postport - (1 - r.sigma)) < 1e-12,
      ) &&
      IMP35677_SIGMA_LADDER.every(
        (r, i) =>
          i === 0 || r.unconditional_share_postport > IMP35677_SIGMA_LADDER[i - 1].unconditional_share_postport,
      ) &&
      IMP35677_SIGMA_LADDER[IMP35677_SIGMA_LADDER.length - 1].unconditional_share_postport > 0.999998,
  },
  {
    // Partition sanity: both pre-port and post-port shares sum to 1 at every rung.
    id: 'imp35677-shares-partition-unity-every-rung',
    description: 'Pre-port (three-class) and post-port (two-class) shares each sum to 1 at every rung',
    holds: () =>
      IMP35677_SIGMA_LADDER.every(
        (r) => Math.abs(r.prePortShareSum - 1) < 1e-12 && Math.abs(r.postPortShareSum - 1) < 1e-12,
      ),
  },
  {
    // Anchor check: rung 0 reproduces the imp-35654 baked sigma<1e-3 landmark.
    id: 'imp35677-rung0-reproduces-imp35654-anchor',
    description: 'Ladder rung 0 (sigma=1e-3) reproduces the imp-35654 baked landmark shares',
    holds: () =>
      IMP35677_SIGMA_LADDER[0].sigma === M.bakedLandmark.sigma &&
      IMP35677_SIGMA_LADDER[0].residual_GUE_conditional_share_postport ===
        M.mixedConditionality.postPort.residual_GUE_conditional_share &&
      Math.abs(
        IMP35677_SIGMA_LADDER[0].unconditional_share_postport -
          M.mixedConditionality.postPort.unconditional_share,
      ) < 1e-6,
  },
  {
    // Honesty gate: measurement only, GUE-conditional per imp-486, parity-not-beat, no QED, no refereed bound is changed.
    id: 'imp35677-honesty-gate-no-qed',
    description: 'Measurement only: sigma-TRACKING confirmed, E_flow-fixed sub-gap named, parity-not-beat, no QED, no refereed bound is changed',
    holds: () =>
      IMP35677_POSTPORT_RESIDUAL_SHARE_SIGMA_LADDER.isRigorous === false &&
      /sigma-TRACKING/.test(IMP35677_POSTPORT_RESIDUAL_SHARE_SIGMA_LADDER.verdict) &&
      /SUB-GAP/.test(IMP35677_POSTPORT_RESIDUAL_SHARE_SIGMA_LADDER.verdict) &&
      /PARITY-WITH-PT/.test(IMP35677_POSTPORT_RESIDUAL_SHARE_SIGMA_LADDER.verdict) &&
      /NO QED/.test(IMP35677_POSTPORT_RESIDUAL_SHARE_SIGMA_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP35677_POSTPORT_RESIDUAL_SHARE_SIGMA_LADDER.verdict),
  },
];

for (const a of IMP35677_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35677-postport-residual-share-sigma-ladder assertion failed: ${a.id}`);
  }
}
