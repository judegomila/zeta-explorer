/**
 * @module imp-95245-tier-certifier-honest-status-banner
 *
 * imp-95245 (ux, S-frontier): standalone honest-status banner for the
 * imp-95213 W1-CERT tier-P/B/S certifier. imp-95213 has sliceCertified=true
 * (the hardest stretch of window 1, 6.7e6 Taylor cells, 0 failures) but
 * promotesBound=false and fullWindowRunLaunched=false, covering only
 * 800 of 1,381,977 q-units = 0.058% of window 1. That scope note is
 * buried inside a long JSDoc derivation; this banner states it on its
 * own, for a reader who has not read imp-95213 in full.
 *
 * DOCUMENTATION ONLY. Ports nothing; measures nothing new; changes no
 * bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-95213-tier-certifier-build (source: sliceCertified/promotesBound/fullWindowRunLaunched)
 * @see imp-95238-fullwindow-run-decision (the separate full-window launch decision: DO NOT launch)
 */

import { IMP95213_TIER_CERTIFIER, W1_N, WINDOW_WIDTH_U } from './imp-95213-tier-certifier-build.js';

const CERTIFIED_Q_UNITS = 800;

export const IMP95245_TIER_CERTIFIER_HONEST_STATUS_BANNER = {
  id: 'imp-95245',
  proofSection: 'S-frontier',
  headline: 'W1-CERT TIER CERTIFIER: SUB-RANGE ONLY (0.058% of window 1) -- NO BOUND PROMOTED, FULL-WINDOW RUN NOT LAUNCHED',
  statements: {
    S1_sub_range_only: {
      claim:
        'imp-95213 certified a continuum sub-range of window 1, not the full window: 800 of ' +
        '1,381,977 q-units, the hardest stretch (containing the |E97| sup witness).',
      certifiedQUnits: CERTIFIED_Q_UNITS,
      windowWidthQUnits: WINDOW_WIDTH_U,
      fractionCertifiedPct: (100 * CERTIFIED_Q_UNITS) / WINDOW_WIDTH_U,
    },
    S2_full_window_run_deferred: {
      claim:
        'The full-window run is a separate, deferred decision. It was NOT launched here; imp-95238 ' +
        'separately recommends against launching it (dominated by the already-priced tier-2 lever).',
    },
    S3_no_bound_promoted: {
      claim:
        'No bound is promoted by this certificate. A sub-range run can never set the window ' +
        'promotion flag (G5); no refereed bound is changed.',
    },
  },
  sliceCertified: IMP95213_TIER_CERTIFIER.sliceCertified,
  promotesBound: IMP95213_TIER_CERTIFIER.promotesBound,
  fullWindowRunLaunched: IMP95213_TIER_CERTIFIER.fullWindowRunLaunched,
  isRigorous: false,
  verdict:
    'HONEST-STATUS BANNER (documentation, not a new claim). The imp-95213 tier certifier is ' +
    'SLICE-CERTIFIED ONLY (0.058% of window 1, hardest stretch); the full-window run is a deferred ' +
    'separate decision and was NOT launched; no bound is promoted. Ports nothing; measures nothing ' +
    'new; changes no bound; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-95213-tier-certifier-build (sliceCertified/promotesBound/fullWindowRunLaunched fields); ' +
    'imp-95238-fullwindow-run-decision (the separate full-window launch decision).',
};

export const IMP95245_HONEST_STATUS_BANNER_ASSERTIONS = [
  {
    id: 'imp95245-headline-states-scope-and-no-promotion',
    description: 'Headline names the sub-range percentage, no bound promoted, and full-window run not launched',
    holds: () =>
      /0\.058%/.test(IMP95245_TIER_CERTIFIER_HONEST_STATUS_BANNER.headline) &&
      /NO BOUND PROMOTED/.test(IMP95245_TIER_CERTIFIER_HONEST_STATUS_BANNER.headline) &&
      /NOT LAUNCHED/.test(IMP95245_TIER_CERTIFIER_HONEST_STATUS_BANNER.headline),
  },
  {
    id: 'imp95245-fraction-matches-source-and-is-small',
    description: 'The computed certified fraction matches the frozen 0.058% figure and mirrors the imp-95213 flags',
    holds: () => {
      const frac = IMP95245_TIER_CERTIFIER_HONEST_STATUS_BANNER.statements.S1_sub_range_only.fractionCertifiedPct;
      return (
        Math.abs(frac - 0.058) < 0.001 &&
        IMP95245_TIER_CERTIFIER_HONEST_STATUS_BANNER.statements.S1_sub_range_only.windowWidthQUnits ===
          2 * W1_N + 1
      );
    },
  },
  {
    id: 'imp95245-flags-mirror-frozen-source',
    description: 'sliceCertified/promotesBound/fullWindowRunLaunched mirror the frozen imp-95213 record exactly',
    holds: () =>
      IMP95245_TIER_CERTIFIER_HONEST_STATUS_BANNER.sliceCertified === true &&
      IMP95245_TIER_CERTIFIER_HONEST_STATUS_BANNER.promotesBound === false &&
      IMP95245_TIER_CERTIFIER_HONEST_STATUS_BANNER.fullWindowRunLaunched === false &&
      IMP95213_TIER_CERTIFIER.sliceCertified === true &&
      IMP95213_TIER_CERTIFIER.promotesBound === false &&
      IMP95213_TIER_CERTIFIER.fullWindowRunLaunched === false,
  },
  {
    id: 'imp95245-honesty-gate-no-qed',
    description: 'Documentation only: not rigorous, no new claim, no QED, no refereed bound is changed',
    holds: () =>
      IMP95245_TIER_CERTIFIER_HONEST_STATUS_BANNER.isRigorous === false &&
      /HONEST-STATUS BANNER/.test(IMP95245_TIER_CERTIFIER_HONEST_STATUS_BANNER.verdict) &&
      /not a new claim/.test(IMP95245_TIER_CERTIFIER_HONEST_STATUS_BANNER.verdict) &&
      /NO QED/.test(IMP95245_TIER_CERTIFIER_HONEST_STATUS_BANNER.verdict) &&
      /refereed bound is changed/i.test(IMP95245_TIER_CERTIFIER_HONEST_STATUS_BANNER.verdict),
  },
];

for (const a of IMP95245_HONEST_STATUS_BANNER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95245-tier-certifier-honest-status-banner assertion failed: ${a.id}`);
  }
}

export default IMP95245_TIER_CERTIFIER_HONEST_STATUS_BANNER;
