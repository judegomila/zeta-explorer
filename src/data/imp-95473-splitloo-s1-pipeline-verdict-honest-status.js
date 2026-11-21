/**
 * @module imp-95473-splitloo-s1-pipeline-verdict-honest-status
 *
 * imp-95473 (content): standalone honest-status note recording the imp-95451
 * SPLIT-LOO SECONDARY CHECK S1 link-by-link direction verdict for a reader
 * who has not read imp-95451 in full.
 *
 * DOCUMENTATION ONLY. Ports nothing; measures nothing new; changes no
 * bound; NO QED. No refereed bound is changed.
 *
 * THE NOTE
 * -----------------------------------------------------------------------------
 *   imp-95451 traced the transcription pipeline
 *     imp-95220 (rate map) -> imp-95249 ANG-DET (fence) -> imp-95250 SPLIT-LOO
 *                                                             (collar)
 *   link-by-link, checking at each link whether the transcribed sigma_k is
 *   ported as an UPPER bound so the collar 1/(1 - sigma_k^2) is OVER- (never
 *   UNDER-) estimated:
 *     LINK 1 (LEMMA LOO, the collar itself)   -- SAFE: the collar is the
 *       exact operator norm of the skew block projection, monotone
 *       increasing in sigma_k, so any upper bound on sigma_k over-estimates
 *       it.
 *     LINK 2 (LEMMA ANG-DET, the fence substitution) -- SAFE: the proven
 *       inequality Phi_k <= 1 - sigma_k^2 makes the transcribed collar
 *       1/Phi_k over-estimate the true 1/(1 - sigma_k^2); imp-95425 tabulated
 *       this on 87/87 well-conditioned blocks (worst ratio 0.3754).
 *     LINK 3 (THEOREM AW, the rate map) -- SAFE within-family: ANG-DET is
 *       proven for any distinct positive rates, so the map cannot break
 *       LINK 2 as long as the same rate set forms Phi_k, sigma_k and
 *       Lambda_k.
 *
 *   Two boundaries were recorded as UNVERIFIED by S1 (not violations, just
 *   out of scope or numerically open at the time):
 *     U1 -- the CROSS-FAMILY rate identity (fence on model rates vs the true
 *       angle on the actual Fresnel-Airy paper window). This is out of S1
 *       scope entirely -- it IS the still-open imp-95376 LEG B
 *       envelope-domination inequality.
 *     U2 -- numeric ground truth at 3 near-coalescent large-m corners where
 *       the direct principal-angle solve was ill-conditioned (an imp-95425
 *       measurement sub-gap).
 *
 *   U2 has SINCE BEEN CLOSED: imp-95479 re-solved the same 3 corners with a
 *   stable whitening/SVD route (Bjorck-Golub) and confirmed the fence
 *   direction holds on all of them, resolving the imp-95425 cos^2 > 1
 *   artifact. U1 remains open -- it is not an imp-95451 gap at all, but the
 *   pre-existing imp-95376 LEG B obligation.
 *
 *   Net: the within-family SPLIT-LOO S1 direction check is fully closed
 *   (LINK1/2/3 safe, U2 safe); the only surviving open item is the
 *   cross-family LEG B step, unchanged in scope by this audit.
 *
 * @see imp-95451-splitloo-sigma-direction-pipeline-audit (source audit and verdict)
 * @see imp-95479-u2-corner-highprec-angle-crosscheck (closes U2)
 */

import { IMP95451_SPLITLOO_SIGMA_DIRECTION_PIPELINE_AUDIT } from './imp-95451-splitloo-sigma-direction-pipeline-audit.js';
import { IMP95479_U2_CORNER_HIGHPREC_ANGLE_CROSSCHECK } from './imp-95479-u2-corner-highprec-angle-crosscheck.js';

export const IMP95473_SPLITLOO_S1_PIPELINE_VERDICT_HONEST_STATUS = {
  id: 'imp-95473',
  proofSection: 'S1',
  headline:
    'SPLIT-LOO S1 PIPELINE DIRECTION IS SAFE ON ALL THREE LINKS -- ' +
    'THE ONLY SURVIVING UNVERIFIED BOUNDARY IS THE PRE-EXISTING imp-95376 LEG B CROSS-FAMILY STEP',
  statements: {
    links_safe: {
      claim:
        'LINK 1 (LEMMA LOO collar), LINK 2 (LEMMA ANG-DET fence), and LINK 3 ' +
        '(THEOREM AW rate map) all port sigma_k in the SAFE direction, so the ' +
        'transcribed collar 1/Phi_k over-estimates the true collar ' +
        '1/(1 - sigma_k^2) within the model family.',
      link2WorstRatio: IMP95451_SPLITLOO_SIGMA_DIRECTION_PIPELINE_AUDIT.link2WorstRatio,
      link2AllSafe: IMP95451_SPLITLOO_SIGMA_DIRECTION_PIPELINE_AUDIT.link2AllSafe,
    },
    u2_now_closed: {
      claim:
        'U2 (numeric ground truth at 3 near-coalescent large-m corners) was ' +
        'left unverified by imp-95451 but has SINCE been closed by imp-95479, ' +
        'which confirms the fence direction on all 3 corners via a stable ' +
        'whitening/SVD route.',
      u2Verdict: IMP95479_U2_CORNER_HIGHPREC_ANGLE_CROSSCHECK.verdict,
    },
    u1_still_open: {
      claim:
        'U1 (cross-family rate identity) remains unverified, but it is not an ' +
        'imp-95451 gap -- it IS the still-open imp-95376 LEG B ' +
        'envelope-domination inequality, unchanged in scope by this audit.',
    },
  },
  isRigorous: false,
  verdict:
    'HONEST-STATUS NOTE (documentation, not a new claim). ' +
    'The imp-95451 SPLIT-LOO S1 pipeline direction check is SAFE on LINK1/2/3 ' +
    'within the model family, and its U2 numeric sub-gap has since been ' +
    'CLOSED by imp-95479; the only surviving open boundary is U1, which IS ' +
    'the pre-existing imp-95376 LEG B cross-family obligation, not a new gap. ' +
    'Ports nothing; measures nothing new; changes no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-95451-splitloo-sigma-direction-pipeline-audit (source audit); ' +
    'imp-95479-u2-corner-highprec-angle-crosscheck (closes U2).',
};

export const IMP95473_HONEST_STATUS_NOTE_ASSERTIONS = [
  {
    id: 'imp95473-headline-names-safe-links-and-open-boundary',
    description:
      'Headline names the safe pipeline direction and the surviving LEG B boundary',
    holds: () =>
      /PIPELINE DIRECTION IS SAFE ON ALL THREE LINKS/.test(
        IMP95473_SPLITLOO_S1_PIPELINE_VERDICT_HONEST_STATUS.headline,
      ) &&
      /imp-95376 LEG B/.test(
        IMP95473_SPLITLOO_S1_PIPELINE_VERDICT_HONEST_STATUS.headline,
      ),
  },
  {
    id: 'imp95473-link2-ratio-matches-source-and-safe',
    description:
      'The recorded LINK 2 worst ratio matches the imp-95451 source audit exactly and is < 1',
    holds: () =>
      IMP95473_SPLITLOO_S1_PIPELINE_VERDICT_HONEST_STATUS.statements.links_safe
        .link2WorstRatio ===
        IMP95451_SPLITLOO_SIGMA_DIRECTION_PIPELINE_AUDIT.link2WorstRatio &&
      IMP95473_SPLITLOO_S1_PIPELINE_VERDICT_HONEST_STATUS.statements.links_safe
        .link2WorstRatio < 1 &&
      IMP95473_SPLITLOO_S1_PIPELINE_VERDICT_HONEST_STATUS.statements.links_safe
        .link2AllSafe === true,
  },
  {
    id: 'imp95473-u2-closed-matches-source-verdict',
    description:
      'The recorded U2-closure verdict matches the imp-95479 source verdict exactly and is CONFIRMED',
    holds: () =>
      IMP95473_SPLITLOO_S1_PIPELINE_VERDICT_HONEST_STATUS.statements.u2_now_closed
        .u2Verdict === IMP95479_U2_CORNER_HIGHPREC_ANGLE_CROSSCHECK.verdict &&
      /CONFIRMED/.test(
        IMP95473_SPLITLOO_S1_PIPELINE_VERDICT_HONEST_STATUS.statements
          .u2_now_closed.u2Verdict,
      ),
  },
  {
    id: 'imp95473-honesty-gate-no-qed',
    description: 'Documentation only: not rigorous, no new claim, no QED, no refereed bound is changed',
    holds: () =>
      IMP95473_SPLITLOO_S1_PIPELINE_VERDICT_HONEST_STATUS.isRigorous === false &&
      /HONEST-STATUS NOTE/.test(
        IMP95473_SPLITLOO_S1_PIPELINE_VERDICT_HONEST_STATUS.verdict,
      ) &&
      /not a new claim/.test(
        IMP95473_SPLITLOO_S1_PIPELINE_VERDICT_HONEST_STATUS.verdict,
      ) &&
      /NO QED/.test(IMP95473_SPLITLOO_S1_PIPELINE_VERDICT_HONEST_STATUS.verdict) &&
      /refereed bound is changed/i.test(
        IMP95473_SPLITLOO_S1_PIPELINE_VERDICT_HONEST_STATUS.verdict,
      ),
  },
];

for (const a of IMP95473_HONEST_STATUS_NOTE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95473-splitloo-s1-pipeline-verdict-honest-status assertion failed: ${a.id}`,
    );
  }
}

export default IMP95473_SPLITLOO_S1_PIPELINE_VERDICT_HONEST_STATUS;
