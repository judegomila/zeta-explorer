/**
 * @module imp-95145-w1cert-envelope-pivot-honest-status-note
 *
 * imp-95145 (content, S-frontier): standalone honest-status note for the
 * W1-CERT envelope pivot decided in imp-95210. That module's verdict is
 * buried inside a long JSDoc derivation; this note states the outcome and
 * the resulting live path on their own, for a reader who has not read
 * imp-95210 in full.
 *
 * DOCUMENTATION ONLY. Ports nothing; measures nothing new; changes no
 * bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE NOTE
 * -----------------------------------------------------------------------------
 *   imp-95210 asked whether the window-1 pilot certification could move
 *   from phase-resolving cells to ENVELOPE-SCALE cells (1e4-1e6x fewer).
 *   The answer is REFUTED, on two independent grounds: (1) every
 *   modulus-triangle envelope that separates the broadband pieces exceeds
 *   the target Rex at sampled points (sup 0.34417 > Rex = 0.27969,
 *   73/24576 witnesses per chart), so any sub-Rex target must keep the
 *   broadband pieces joint; (2) that joint (sub-Rex) target varies at
 *   phase scale, not envelope scale (1% of Rex within 9.5e-4 q-units,
 *   78x finer than one fastest phase turn). No pilotcert run was
 *   launched: the measurements prove it could not pass at any cell count.
 *
 *   Consequently the only live path to a window-1 certificate is
 *   tier-P/B/S batching (imp-95213): keep the phase-resolving ~1.1e10
 *   cells but amortize the per-cell cost with Taylor panel models to
 *   ~1e3 ball-ops/cell (~1.1e13 total, inside the 1-4e13 design budget).
 *   imp-95213 built, validated, and priced exactly that path and slice-
 *   certified the hardest stretch of window 1; it also adopted the
 *   imp-95210 byproduct (the alias-decomposed Lipschitz ledger 44.476/x,
 *   1.906x below the direct 84.769/x).
 *
 * @see imp-95210-window1-pilot-certificate (source: pivotRefuted verdict, RESIDUAL_OPTIONS)
 * @see imp-95213-tier-certifier-build (the tier-P/B/S path this note points to)
 */

import {
  IMP95210_W1_PILOT_CERTIFICATE,
  RESIDUAL_OPTIONS,
  REX_EXACT,
  SLACK_OBSTRUCTION,
} from './imp-95210-window1-pilot-certificate.js';
import { IMP95213_TIER_CERTIFIER } from './imp-95213-tier-certifier-build.js';

export const IMP95145_W1CERT_ENVELOPE_PIVOT_HONEST_STATUS_NOTE = {
  id: 'imp-95145',
  proofSection: 'S-frontier',
  headline: 'W1-CERT ENVELOPE PIVOT (IMP-95210) IS REFUTED -- TIER-P/B/S BATCHING (IMP-95213) IS THE ONLY LIVE PATH',
  statements: {
    S1_pivot_refuted: {
      claim:
        'imp-95210 measured that no envelope-scale cell subdivision can certify the window-1 pilot: every ' +
        'envelope that separates the broadband pieces exceeds Rex at sampled points, and the one sub-Rex ' +
        'target varies at phase scale, not envelope scale.',
      supSumU3Sampled: SLACK_OBSTRUCTION.supSumU3Sampled,
      rex: REX_EXACT,
    },
    S2_only_live_path: {
      claim:
        'The only live path to a window-1 certificate is tier-P/B/S phase-resolving batching, which ' +
        'amortizes per-cell cost instead of reducing cell count; imp-95213 built, validated, and priced it.',
      residualOptionsHead: RESIDUAL_OPTIONS[0],
    },
    S3_no_certificate_from_the_pivot: {
      claim:
        'imp-95210 itself certifies nothing and changed no bound: no pilotcert run was launched because ' +
        'the measurements proved it could not pass regardless of cell count.',
    },
  },
  pivotRefuted: IMP95210_W1_PILOT_CERTIFICATE.pivotRefuted,
  onlyLivePathBuilt: IMP95213_TIER_CERTIFIER.buildComplete === true,
  isRigorous: false,
  verdict:
    'HONEST-STATUS NOTE (documentation, not a new claim). The imp-95210 envelope pivot is REFUTED at both ' +
    'the slack and the scale/rigor level; the only live path to a window-1 certificate is the imp-95213 ' +
    'tier-P/B/S batching, already built and slice-certified. Ports nothing; measures nothing new; changes ' +
    'no bound; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-95210-window1-pilot-certificate (envelope pivot refutation, RESIDUAL_OPTIONS); ' +
    'imp-95213-tier-certifier-build (the tier-P/B/S live path, built + validated + priced).',
};

export const IMP95145_HONEST_STATUS_NOTE_ASSERTIONS = [
  {
    id: 'imp95145-headline-names-both-tickets-and-verdicts',
    description: 'Headline names both imp-95210 REFUTED and imp-95213 as the only live path',
    holds: () =>
      /IMP-95210/.test(IMP95145_W1CERT_ENVELOPE_PIVOT_HONEST_STATUS_NOTE.headline) &&
      /REFUTED/.test(IMP95145_W1CERT_ENVELOPE_PIVOT_HONEST_STATUS_NOTE.headline) &&
      /IMP-95213/.test(IMP95145_W1CERT_ENVELOPE_PIVOT_HONEST_STATUS_NOTE.headline) &&
      /ONLY LIVE PATH/.test(IMP95145_W1CERT_ENVELOPE_PIVOT_HONEST_STATUS_NOTE.headline),
  },
  {
    id: 'imp95145-pivot-refuted-matches-source',
    description: 'pivotRefuted mirrors the frozen imp-95210 verdict and the sampled slack witness exceeds Rex',
    holds: () =>
      IMP95145_W1CERT_ENVELOPE_PIVOT_HONEST_STATUS_NOTE.pivotRefuted === true &&
      IMP95210_W1_PILOT_CERTIFICATE.pivotRefuted === true &&
      IMP95145_W1CERT_ENVELOPE_PIVOT_HONEST_STATUS_NOTE.statements.S1_pivot_refuted.supSumU3Sampled >
        IMP95145_W1CERT_ENVELOPE_PIVOT_HONEST_STATUS_NOTE.statements.S1_pivot_refuted.rex,
  },
  {
    id: 'imp95145-only-live-path-is-built',
    description: 'The named residual option is the tier-P/B/S path, and imp-95213 (that path) is actually built',
    holds: () =>
      /only live path/.test(
        IMP95145_W1CERT_ENVELOPE_PIVOT_HONEST_STATUS_NOTE.statements.S2_only_live_path.residualOptionsHead,
      ) &&
      /tier-P\/B\/S/.test(
        IMP95145_W1CERT_ENVELOPE_PIVOT_HONEST_STATUS_NOTE.statements.S2_only_live_path.residualOptionsHead,
      ) &&
      IMP95145_W1CERT_ENVELOPE_PIVOT_HONEST_STATUS_NOTE.onlyLivePathBuilt === true,
  },
  {
    id: 'imp95145-honesty-gate-no-qed',
    description: 'Documentation only: not rigorous, no new claim, no QED, no refereed bound is changed',
    holds: () =>
      IMP95145_W1CERT_ENVELOPE_PIVOT_HONEST_STATUS_NOTE.isRigorous === false &&
      /HONEST-STATUS NOTE/.test(IMP95145_W1CERT_ENVELOPE_PIVOT_HONEST_STATUS_NOTE.verdict) &&
      /not a new claim/.test(IMP95145_W1CERT_ENVELOPE_PIVOT_HONEST_STATUS_NOTE.verdict) &&
      /NO QED/.test(IMP95145_W1CERT_ENVELOPE_PIVOT_HONEST_STATUS_NOTE.verdict) &&
      /refereed bound is changed/i.test(IMP95145_W1CERT_ENVELOPE_PIVOT_HONEST_STATUS_NOTE.verdict),
  },
];

for (const a of IMP95145_HONEST_STATUS_NOTE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95145-w1cert-envelope-pivot-honest-status-note assertion failed: ${a.id}`);
  }
}

export default IMP95145_W1CERT_ENVELOPE_PIVOT_HONEST_STATUS_NOTE;
