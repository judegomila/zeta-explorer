/**
 * @fileoverview imp-97412 -- import-light honest-status note recording the E(N)-bridge frontier: the
 * imp-3406/imp-34734 conditional share sigma(N) = E_coll/E(N) has an interior MAXIMUM at N_max ~ 9.219e5
 * (log10 N ~ 5.9647) with sigma_max ~ 0.94943, then DECAYS away from that peak -- but the GUE-conditional
 * many-body constant C_mb that the collision term E_coll carries is only known to satisfy C_mb <= 1 via
 * GUE universality (imp-486), and imp-486's own search for an UNCONDITIONAL C_mb bound is COMPLETE and
 * FAILED (all three approaches -- Selberg, Huxley, GGM -- fail; GUE universality is an IRREDUCIBLE
 * conditional premise). So the sigma(N) peak-then-decay shape is a measurement under an unproven
 * hypothesis, and NO unconditional Lambda movement follows from it.
 *
 * WHAT THIS CLOSES. Before this note, the peak-then-decay shape of sigma(N) (imp-3406) and the leverage
 * of a hypothetically tighter C_mb (imp-34734) were recorded separately from the imp-486 conditional-bound
 * search verdict. This module ties the two together explicitly at the frontier index: even at the GUE
 * saturation C_mb = 1 (the best case the conditional premise allows), sigma_max ~ 0.94943 < 1, and imp-34734
 * already shows a tighter C_mb only LOWERS the peak (never raises it toward 1) with zero leverage on the
 * peak location N_max. Since C_mb <= 1 itself is GUE-conditional and imp-486 shows no unconditional route
 * to that bound exists, the entire sigma(N) peak-then-decay measurement inherits the GUE conditional and
 * moves no unconditional bound on Lambda.
 *
 * WHY A NOTE (not a re-derivation). imp-3406 (peak location/height), imp-34734 (C_mb leverage measurement),
 * and imp-486 (unconditional-bound search, COMPLETE, FAILED) each already carry their own measurements and
 * self-executing assertions. This module only records the honest composite status: the frontier shape is
 * real but conditional, and quantifying its sensitivity to C_mb (imp-34734) does not discharge imp-486.
 *
 * WHAT REMAINS OPEN (unaffected by this closure): an unconditional proof that C_mb = O(1) (imp-486 shows
 * this requires GUE universality, itself unproved); no bound on Lambda moves; interval-rigorous reach
 * stays 2a <= 0.96 (Route I); no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-3406-sigma-highN-extrapolation.js (F1: interior max N_max ~ 9.22e5, sigma_max ~ 0.94943)
 * @see imp-34734-sigma-peak-cmb-elasticity.js (C_mb leverage measurement: peak location C_mb-invariant,
 *   height moves ~0.048/unit C_mb, even C_mb=1 gives sigma_max < 1)
 * @see c-mb-unconditional-bound.js (imp-486: search for an unconditional C_mb bound is COMPLETE and FAILED;
 *   GUE universality is an IRREDUCIBLE conditional premise for C_mb = O(1))
 *
 * Ticket: imp-97412 (content, low, sonnet-4-6). Documentation only; establishes nothing new; NO QED;
 * no refereed bound is changed.
 */

import { IMP34734_SIGMA_PEAK_CMB_ELASTICITY } from './imp-34734-sigma-peak-cmb-elasticity.js';
import { C_MB_UNCONDITIONAL_SEARCH } from '../math/c-mb-unconditional-bound.js';

export const IMP97412_STATUS = Object.freeze({
  ticket: 'imp-97412',
  sourceTickets: ['imp-3406', 'imp-34734', 'imp-486'],
  N_max: IMP34734_SIGMA_PEAK_CMB_ELASTICITY.baseline.N_max,
  log10_N_max: IMP34734_SIGMA_PEAK_CMB_ELASTICITY.baseline.log10_N_max,
  sigma_max: IMP34734_SIGMA_PEAK_CMB_ELASTICITY.baseline.sigma_max,
  sigmaPeaksThenDecays: true,
  cMbBoundedAboveByOneViaGue: true,
  cMbUnconditionalSearchComplete: C_MB_UNCONDITIONAL_SEARCH.searchComplete === true,
  cMbUnconditionalSearchFailed: /irreducible/i.test(C_MB_UNCONDITIONAL_SEARCH.impossibilityConclusion),
  anyBoundMoved: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});

export const IMP97412_HONEST_BANNER =
  'E(N)-bridge frontier recorded: the sigma(N) conditional share peaks at sigma_max ~ 0.94943 near ' +
  'N ~ 9.22e5 then decays (imp-3406/imp-34734), but the GUE-conditional constant C_mb it depends on is ' +
  'only bounded C_mb <= 1 via GUE universality, and imp-486 shows the search for an UNCONDITIONAL C_mb ' +
  'bound is COMPLETE and FAILED (GUE universality is an IRREDUCIBLE conditional premise). So NO ' +
  'unconditional Lambda movement follows from the sigma(N) peak. No refereed bound is changed' +
  '; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97412_ASSERTIONS = [
  {
    id: 'imp97412-status-matches-committed-imp34734-verdict',
    holds: () =>
      IMP97412_STATUS.sigma_max === IMP34734_SIGMA_PEAK_CMB_ELASTICITY.baseline.sigma_max &&
      IMP97412_STATUS.N_max === IMP34734_SIGMA_PEAK_CMB_ELASTICITY.baseline.N_max &&
      IMP97412_STATUS.sigma_max < 1 &&
      IMP97412_STATUS.sigma_max > 0.9,
    why: 'this honest-status note must reproduce the exact peak values already established by imp-34734/imp-3406.',
  },
  {
    id: 'imp97412-status-matches-committed-imp486-verdict',
    holds: () =>
      IMP97412_STATUS.cMbUnconditionalSearchComplete === true &&
      IMP97412_STATUS.cMbUnconditionalSearchFailed === true &&
      IMP97412_STATUS.cMbBoundedAboveByOneViaGue === true,
    why: 'the composite verdict depends on imp-486 recording its unconditional-bound search as complete and failed.',
  },
  {
    id: 'imp97412-honesty-gate-no-qed',
    holds: () =>
      IMP97412_STATUS.anyBoundMoved === false &&
      IMP97412_STATUS.operatorPositivityProved === false &&
      IMP97412_STATUS.rhResolved === false &&
      IMP97412_STATUS.qed === false &&
      /NO QED/.test(IMP97412_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97412_HONEST_BANNER) &&
      /RH open/.test(IMP97412_HONEST_BANNER) &&
      /IRREDUCIBLE/.test(IMP97412_HONEST_BANNER),
    why: 'documentation only: no bound claimed moved, no operator positivity, no QED, no-refereed-bound-change line present, RH stated open.',
  },
];

for (const assertion of IMP97412_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97412-en-bridge-frontier-cmb-conditional-honest-status assertion failed: ${assertion.id}`);
  }
}

export default { status: IMP97412_STATUS, banner: IMP97412_HONEST_BANNER };
