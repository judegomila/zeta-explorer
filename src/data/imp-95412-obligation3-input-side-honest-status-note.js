/**
 * @module imp-95412-obligation3-input-side-honest-status-note
 *
 * imp-95412 (content, honest-status): standalone note recording that
 * imp-95276's gate-side dissolution of seam-chain obligation (3) does NOT by
 * itself close obligation (3) -- the obligation also depends on its INPUT
 * side, which is only half closed.
 *
 * DOCUMENTATION ONLY. Ports nothing; measures nothing new; changes no
 * bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE NOTE
 * -----------------------------------------------------------------------------
 *   imp-95276 shows the GATE-SIDE half of obligation (3) is DISSOLVED: the
 *   pipeline R -> g_R = gFromLam(R^2) -> gammaSL(g_R) is the identity
 *   gFromLam -> gammaSL composition the program already runs, and it is
 *   well-posed and monotone (facts M1, M2, both assertion-verified in
 *   imp-95276). There is nothing left to derive on the map itself.
 *
 *   That leaves the INPUT side: for the gate to receive an admissible R, two
 *   things must land -- (i) the per-window Q extraction, which is obligation
 *   (1), and (ii) the imp-95212 Fresnel-Airy envelope port. Per the imp-95388
 *   ledger, obligation (1) is already CLOSED (y_min rides the same
 *   isolation-group Q that carries x_min, x_min <= y_min <= 2 x_min exact,
 *   imp-95222/imp-95255). The imp-95212 port is NOT closed: it is a
 *   still-open sub-gap (imp-95212-subgap-fresnel-airy-envelope-port) with no
 *   delivered transcription of the paper window into the imp-95226
 *   exponential model.
 *
 *   Net effect: because one of the two required inputs (the port) is still
 *   open, obligation (3) as a whole stays REDUCED, not CLOSED. Dissolving
 *   the gate-side pipeline moved the entire remaining burden onto the input
 *   side, but did not remove it -- the open half of the input side (the
 *   port) is exactly as open after imp-95276 as it was before.
 *
 * @see imp-95276-seam-to-chain-gate-map (source: gate-side dissolution, "reduction" field)
 * @see imp-95388-seam-chain-obligation-ledger (source: three-obligation CLOSED/OPEN/REDUCED ledger)
 */

import { IMP95276_SEAM_TO_CHAIN_GATE_MAP } from './imp-95276-seam-to-chain-gate-map.js';
import {
  SEAM_CHAIN_OBLIGATION_LEDGER,
  SEAM_CHAIN_OBLIGATION_SUMMARY,
} from './imp-95388-seam-chain-obligation-ledger.js';

export const IMP95412_OBLIGATION3_INPUT_SIDE_HONEST_STATUS_NOTE = {
  id: 'imp-95412',
  proofSection: 'seam-chain obligation (3)',
  headline:
    'OBLIGATION (3) GATE-SIDE IS DISSOLVED (IMP-95276) BUT THE INPUT SIDE -- ' +
    'OBLIGATION (1) + THE IMP-95212 PORT -- STAYS OPEN',
  statements: {
    S1_gate_side_dissolved: {
      claim:
        'imp-95276 dissolves the gate-side half of obligation (3): the seam-to-chain-gate map is the ' +
        'identity gFromLam -> gammaSL pipeline the program already runs, well-posed and monotone (M1/M2, ' +
        'assertion-verified). No independent map remains to build there.',
      reduction: IMP95276_SEAM_TO_CHAIN_GATE_MAP.reduction,
    },
    S2_obligation1_closed: {
      claim:
        'Obligation (1), per-window Q extraction, is CLOSED per the imp-95388 ledger: y_min rides the same ' +
        'isolation-group Q that already carries x_min (x_min <= y_min <= 2 x_min exact, imp-95222).',
      status: SEAM_CHAIN_OBLIGATION_LEDGER[0].status,
    },
    S3_port_open: {
      claim:
        'The imp-95212 Fresnel-Airy envelope port remains an open sub-gap: without it there is no ' +
        'transcribed, admissible R to feed the (now-dissolved) gate.',
      subGap: SEAM_CHAIN_OBLIGATION_LEDGER[2].subGap,
    },
    S4_net_status_reduced_not_closed: {
      claim:
        'Because one of the two required inputs (the port) is still open, obligation (3) as a whole stays ' +
        'REDUCED, not CLOSED. Dissolving the gate-side pipeline moved the whole remaining burden onto the ' +
        'input side without removing it.',
      status: SEAM_CHAIN_OBLIGATION_LEDGER[2].status,
    },
  },
  obligation1Closed: SEAM_CHAIN_OBLIGATION_LEDGER[0].status === 'CLOSED',
  obligation3Reduced: SEAM_CHAIN_OBLIGATION_LEDGER[2].status === 'REDUCED',
  isRigorous: false,
  verdict:
    'HONEST-STATUS NOTE (documentation, not a new claim). The imp-95276 gate-side dissolution narrows ' +
    'obligation (3) but does not close it: obligation (1) is closed, the imp-95212 port is not, and ' +
    'obligation (3) inherits that open port as its sole remaining residual. Ports nothing; measures nothing ' +
    'new; changes no bound; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-95276-seam-to-chain-gate-map (gate-side dissolution, M1/M2 monotonicity); ' +
    'imp-95388-seam-chain-obligation-ledger (three-obligation CLOSED/OPEN/REDUCED ledger); ' +
    'imp-95212-subgap-fresnel-airy-envelope-port (the still-open input-side sub-gap).',
};

export const IMP95412_HONEST_STATUS_NOTE_ASSERTIONS = [
  {
    id: 'imp95412-headline-names-dissolved-and-open',
    description: 'Headline names both the imp-95276 gate-side DISSOLVED result and the open input side',
    holds: () =>
      /GATE-SIDE IS DISSOLVED/.test(IMP95412_OBLIGATION3_INPUT_SIDE_HONEST_STATUS_NOTE.headline) &&
      /IMP-95276/.test(IMP95412_OBLIGATION3_INPUT_SIDE_HONEST_STATUS_NOTE.headline) &&
      /STAYS OPEN/.test(IMP95412_OBLIGATION3_INPUT_SIDE_HONEST_STATUS_NOTE.headline),
  },
  {
    id: 'imp95412-obligation1-closed-matches-ledger',
    description: 'obligation1Closed mirrors the imp-95388 ledger entry (1) status exactly',
    holds: () =>
      IMP95412_OBLIGATION3_INPUT_SIDE_HONEST_STATUS_NOTE.obligation1Closed === true &&
      SEAM_CHAIN_OBLIGATION_SUMMARY.closed.includes('(1) PER-WINDOW Q EXTRACTION'),
  },
  {
    id: 'imp95412-obligation3-reduced-not-closed',
    description: 'obligation3Reduced mirrors the imp-95388 ledger entry (3) status exactly, and it is not CLOSED',
    holds: () =>
      IMP95412_OBLIGATION3_INPUT_SIDE_HONEST_STATUS_NOTE.obligation3Reduced === true &&
      SEAM_CHAIN_OBLIGATION_LEDGER[2].status !== 'CLOSED' &&
      SEAM_CHAIN_OBLIGATION_SUMMARY.reduced.includes('(3) ENVELOPE-SHAPE / GAMMASL SEAM-TO-CHAIN-GATE MAP'),
  },
  {
    id: 'imp95412-port-subgap-cited',
    description: 'the same open sub-gap id is cited for both the ledger entry and this note',
    holds: () =>
      IMP95412_OBLIGATION3_INPUT_SIDE_HONEST_STATUS_NOTE.statements.S3_port_open.subGap ===
        'imp-95212-subgap-fresnel-airy-envelope-port' &&
      SEAM_CHAIN_OBLIGATION_LEDGER[2].subGap === 'imp-95212-subgap-fresnel-airy-envelope-port',
  },
  {
    id: 'imp95412-honesty-gate-no-qed',
    description: 'Documentation only: not rigorous, no new claim, no QED, no refereed bound is changed',
    holds: () =>
      IMP95412_OBLIGATION3_INPUT_SIDE_HONEST_STATUS_NOTE.isRigorous === false &&
      /HONEST-STATUS NOTE/.test(IMP95412_OBLIGATION3_INPUT_SIDE_HONEST_STATUS_NOTE.verdict) &&
      /not a new claim/.test(IMP95412_OBLIGATION3_INPUT_SIDE_HONEST_STATUS_NOTE.verdict) &&
      /NO QED/.test(IMP95412_OBLIGATION3_INPUT_SIDE_HONEST_STATUS_NOTE.verdict) &&
      /refereed bound is changed/i.test(IMP95412_OBLIGATION3_INPUT_SIDE_HONEST_STATUS_NOTE.verdict),
  },
];

for (const a of IMP95412_HONEST_STATUS_NOTE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95412-obligation3-input-side-honest-status-note assertion failed: ${a.id}`);
  }
}

export default IMP95412_OBLIGATION3_INPUT_SIDE_HONEST_STATUS_NOTE;
