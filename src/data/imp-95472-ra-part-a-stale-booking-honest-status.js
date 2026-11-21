/**
 * @module imp-95472-ra-part-a-stale-booking-honest-status
 *
 * imp-95472 (meta, S-frontier): standalone honest-status note recording the
 * imp-95448 verdict that the imp-95372 R_A three-part residual booking of
 * part (a) as simply "open" is STALE relative to the imp-2563 ZETA_ZEROS
 * repair. imp-95372's THREE_PART_RESIDUAL table still lists part (a) with
 * status "open"; imp-95448 audited the actual repo state and found the
 * ZETA_ZEROS/Odlyzko data audit was already DELIVERED (detection + repair)
 * by the imp-2563 line. This note states that reconciliation on its own,
 * for a reader who has not read both modules in full.
 *
 * DOCUMENTATION ONLY. Ports nothing; measures nothing new; changes no
 * bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE NOTE
 * -----------------------------------------------------------------------------
 *   imp-95372 books the R_A identification residual R_A(N) :=
 *   |t_c(N) - 1/(2 M_infty(N))| as a three-part VERIFICATION obligation,
 *   listing part (a) -- the ZETA_ZEROS / Odlyzko data audit of the ladder
 *   inputs -- with status "open". imp-95448 audited that claim against the
 *   actual repo state and found part (a) was ALREADY delivered: ZETA_ZEROS
 *   was corrupt from index 650 onward and REPAIRED 2026-06-11
 *   (imp-2563-sub-data-audit-fix, closed, build-time tripwire-pinned); the
 *   four low-N Path C rungs (N <= 500) never touched the corrupt block, and
 *   the single high-N rung N = 2458 that did cross it now reads the repaired
 *   data. So the imp-95372 booking of part (a) as bare "open" is STALE.
 *
 *   The genuinely-remaining data-side item is narrower than a full audit:
 *   only the single high-N exact recompute
 *   (imp-2563-sub-pathc-ladder-replace-highN) is unexecuted, and M_infty's
 *   audit-relevant bound sqrt(N/(2 pi)) has no data-table exposure at all.
 *   R_A stays open overall via parts (b) and (c) (the PATH_C_BASELINE_FIT
 *   ladder replacement and the imp-1149 Theorem-3 re-grade), and even a
 *   fully audited/closed R_A remains INERT for Lambda while imp-2621
 *   (refuted amplified rate) and imp-35164 (E(N) does not vanish) stand.
 *
 * @see imp-95372-ra-proxy-true-gap-assessment (parent booking; THREE_PART_RESIDUAL part a = "open")
 * @see imp-95448-ra-ladder-input-data-audit (the audit; partAWasAlreadyDelivered / imp95372PartABookingStale)
 */

import {
  IMP95372_RA_PROXY_TRUE_GAP_ASSESSMENT,
} from './imp-95372-ra-proxy-true-gap-assessment.js';
import {
  IMP95448_RA_LADDER_INPUT_DATA_AUDIT,
} from './imp-95448-ra-ladder-input-data-audit.js';

export const IMP95472_RA_PART_A_STALE_BOOKING_HONEST_STATUS = {
  id: 'imp-95472',
  proofSection: 'S-frontier',
  headline: 'IMP-95372 PART (A) "OPEN" BOOKING IS STALE -- ALREADY DELIVERED BY IMP-2563, NARROWED TO A HIGH-N RECOMPUTE',
  statements: {
    S1_booking_is_stale: {
      claim:
        'imp-95372 booked R_A part (a) -- the ZETA_ZEROS/Odlyzko data audit of the ladder inputs -- with ' +
        'bare status "open", but imp-95448 found it was already DELIVERED (detection + repair) by imp-2563; ' +
        'the parent booking has since been reconciled to record status "delivered-except-high-n".',
      parentPartAStatus: IMP95372_RA_PROXY_TRUE_GAP_ASSESSMENT.threePartResidual.find(
        (p) => p.key === 'ra-a-zeta-zeros-data-audit',
      )?.status,
      auditFoundStale: IMP95448_RA_LADDER_INPUT_DATA_AUDIT.imp95372PartABookingStale,
    },
    S2_narrowed_residual: {
      claim:
        'The genuinely-remaining data-side item is narrower than a full audit: only the single high-N ' +
        'exact recompute is unexecuted, and the M_infty audit-relevant bound has no data-table exposure.',
      narrowedDataResidual: IMP95448_RA_LADDER_INPUT_DATA_AUDIT.narrowedDataResidual,
    },
    S3_ra_stays_open_and_inert: {
      claim:
        'R_A stays open overall via parts (b) and (c); closing part (a) (or even all of R_A) produces no ' +
        'Lambda bound while imp-2621 and imp-35164 stand as the fatal walls.',
      closingPartAProducesLambdaBound: IMP95448_RA_LADDER_INPUT_DATA_AUDIT.closingPartAProducesLambdaBound,
      legStillOpen: IMP95448_RA_LADDER_INPUT_DATA_AUDIT.legStillOpen,
    },
  },
  bookingReconciled: true,
  isRigorous: false,
  verdict:
    'HONEST-STATUS NOTE (documentation, not a new claim). The imp-95372 booking of R_A part (a) as bare ' +
    '"open" is STALE: imp-95448 found it already delivered (detection + repair) by imp-2563, narrowing the ' +
    'remaining data-side item to the single high-N exact recompute. R_A stays open overall via parts (b)/(c) ' +
    'and remains INERT for Lambda regardless. Ports nothing; measures nothing new; changes no bound; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-95372-ra-proxy-true-gap-assessment (parent booking, THREE_PART_RESIDUAL); ' +
    'imp-95448-ra-ladder-input-data-audit (audit verdict, partAWasAlreadyDelivered / narrowedDataResidual).',
};

export const IMP95472_HONEST_STATUS_NOTE_ASSERTIONS = [
  {
    id: 'imp95472-headline-names-both-tickets-and-verdict',
    description: 'Headline names imp-95372 as stale and points to the narrowed high-N recompute',
    holds: () =>
      /IMP-95372/.test(IMP95472_RA_PART_A_STALE_BOOKING_HONEST_STATUS.headline) &&
      /STALE/.test(IMP95472_RA_PART_A_STALE_BOOKING_HONEST_STATUS.headline) &&
      /IMP-2563/.test(IMP95472_RA_PART_A_STALE_BOOKING_HONEST_STATUS.headline) &&
      /HIGH-N/.test(IMP95472_RA_PART_A_STALE_BOOKING_HONEST_STATUS.headline),
  },
  {
    id: 'imp95472-parent-booking-reconciled-audit-says-stale',
    description:
      'The parent module now records the reconciled "delivered-except-high-n" status while the audit ' +
      'that motivated the reconciliation still records the original booking as having been stale',
    holds: () =>
      IMP95472_RA_PART_A_STALE_BOOKING_HONEST_STATUS.statements.S1_booking_is_stale.parentPartAStatus ===
        'delivered-except-high-n' &&
      IMP95472_RA_PART_A_STALE_BOOKING_HONEST_STATUS.statements.S1_booking_is_stale.auditFoundStale === true,
  },
  {
    id: 'imp95472-narrowed-residual-matches-audit',
    description: 'The narrowed residual names the single high-N exact recompute',
    holds: () =>
      /imp-2563-sub-pathc-ladder-replace-highN/.test(
        IMP95472_RA_PART_A_STALE_BOOKING_HONEST_STATUS.statements.S2_narrowed_residual.narrowedDataResidual,
      ),
  },
  {
    id: 'imp95472-ra-stays-inert-and-open',
    description: 'Closing part (a) still yields no Lambda bound and R_A stays open',
    holds: () =>
      IMP95472_RA_PART_A_STALE_BOOKING_HONEST_STATUS.statements.S3_ra_stays_open_and_inert
        .closingPartAProducesLambdaBound === false &&
      /R_A/.test(IMP95472_RA_PART_A_STALE_BOOKING_HONEST_STATUS.statements.S3_ra_stays_open_and_inert.legStillOpen),
  },
  {
    id: 'imp95472-honesty-gate-no-qed',
    description: 'Documentation only: not rigorous, no new claim, no QED, no refereed bound is changed',
    holds: () =>
      IMP95472_RA_PART_A_STALE_BOOKING_HONEST_STATUS.isRigorous === false &&
      /HONEST-STATUS NOTE/.test(IMP95472_RA_PART_A_STALE_BOOKING_HONEST_STATUS.verdict) &&
      /not a new claim/.test(IMP95472_RA_PART_A_STALE_BOOKING_HONEST_STATUS.verdict) &&
      /NO QED/.test(IMP95472_RA_PART_A_STALE_BOOKING_HONEST_STATUS.verdict) &&
      /refereed bound is changed/i.test(IMP95472_RA_PART_A_STALE_BOOKING_HONEST_STATUS.verdict),
  },
];

for (const a of IMP95472_HONEST_STATUS_NOTE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95472-ra-part-a-stale-booking-honest-status assertion failed: ${a.id}`);
  }
}

export default IMP95472_RA_PART_A_STALE_BOOKING_HONEST_STATUS;
