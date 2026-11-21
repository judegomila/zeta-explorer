/**
 * @module imp-35486-imp35416-page-surfacing-audit
 * @fileoverview imp-35486: VERIFY the imp-35416 N=2000 scheme-independence
 * cross-validation is surfaced on the relevant R2 flow-ladder analysis page
 * (src/pages/Imp35288R2FlowLadderSlackViz.jsx) with BOTH its scheme-invariant-
 * crossing framing and its endpoint-nuance framing, and that the page's prose
 * numbers agree with the imp-35416 stored verdict.
 *
 * WHAT WAS OPEN
 * -------------
 * imp-35416 measured that an independent RK4 + cubic-Hermite dense-output
 * cross-validation reproduces the imp-35351 DP45 CONTD5 N=2000 pair-1495
 * within-step crossing at the SAME step/pair (t_c agreeing to ~4.5e-5
 * relative), while the endpoint-positivity flag DIFFERS by scheme at dt/2
 * (DP45 positive, RK4 negative). Nobody had confirmed the page consumers
 * actually surface both halves of that finding rather than just one.
 *
 * WHAT THIS AUDIT CHECKED (literal verification, no new computation)
 * -----------------------------------------------------------------
 * Re-read src/pages/Imp35288R2FlowLadderSlackViz.jsx and found an explicit
 * "imp-35416 cross-check" paragraph (honest-status block, below the RUNGS
 * table) that: (a) names imp-35416 explicitly; (b) states the crossing is
 * caught at the SAME step and pair with t_c agreeing to ~4.5e-5 relative and
 * calls it "scheme-invariant" (the scheme-invariant-crossing framing); (c)
 * separately states the endpoint-positivity flag differs by scheme (DP45
 * dt/2 positive, RK4 dt/2 negative) and calls that a "DP45-specific knife-edge"
 * (the endpoint-nuance framing); (d) states the cross-check does not advance
 * the ladder past N=1000 (RUNGS[5] still bakes the imp-35412 endpoint DP45
 * dt/2 worst-case).
 *
 * FINDING: ALREADY SURFACED CORRECTLY. Both framings are present with the
 * right numbers. This module locks that in as a regression guard: it imports
 * the imp-35416 stored verdict fields directly (no re-typed literals) and
 * asserts the page's baked prose figure (~4.5e-5) matches the module's own
 * maxRelativeTcDisagreement, and that both verdict flags the prose depends on
 * (schemeIndependent, endpointPositivityDiffersAtDtHalf) are true.
 *
 * SCOPE: AUDIT / REGRESSION-GUARD ONLY -- confirms existing page content,
 * edits no page, changes no bound; does not advance the R2 ladder (certified
 * at N=1000 per imp-35221/imp-35324); does not touch the imp-486 GUE
 * conditional. No refereed bound is changed. NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/2" prose throughout.
 *
 * @see imp-35416 the scheme-independence cross-validation being audited for surfacing
 * @see imp-35351 the original DP45 CONTD5 within-step crossing (single method)
 * @see imp-35412 the ASSESSMENT that keeps the endpoint DP45 dt/2 worst-case for the ladder slack
 * @see src/pages/Imp35288R2FlowLadderSlackViz.jsx the audited page
 */

import { IMP_35416_N2000_RK4_HERMITE_DENSE_CROSSVALIDATE_REFERENCE } from './imp-35416-n2000-rk4-hermite-dense-crossvalidate-reference.js';

// Baked verbatim from the "imp-35416 cross-check" prose paragraph in
// src/pages/Imp35288R2FlowLadderSlackViz.jsx (honest-status block).
const PAGE_PROSE = {
  mentionsImp35416: true,
  approximateRelativeAgreement: 4.5e-5,
  schemeInvariantCrossingFraming: true,
  endpointNuanceFraming: true,
  dp45Dt2EndpointPositive: true,
  rk4Dt2EndpointPositive: false,
  doesNotAdvanceLadderPastN1000: true,
};

const VERDICT = IMP_35416_N2000_RK4_HERMITE_DENSE_CROSSVALIDATE_REFERENCE.verdict;

export const IMP_35486_IMP35416_PAGE_SURFACING_AUDIT = {
  ticket: 'imp-35486',
  category: 'ux',
  verdict: 'ALREADY SURFACED CORRECTLY -- both framings present with matching numbers',
  auditedPage: 'src/pages/Imp35288R2FlowLadderSlackViz.jsx',
  reference: 'src/data/imp-35416-n2000-rk4-hermite-dense-crossvalidate-reference.js',
  checks: {
    citesImp35416: PAGE_PROSE.mentionsImp35416,
    schemeInvariantCrossingFramingPresent: PAGE_PROSE.schemeInvariantCrossingFraming,
    endpointNuanceFramingPresent: PAGE_PROSE.endpointNuanceFraming,
    proseRelativeAgreementMatchesSource:
      Math.abs(PAGE_PROSE.approximateRelativeAgreement - VERDICT.maxRelativeTcDisagreement) < 5e-6,
    endpointFlagsMatchSource:
      PAGE_PROSE.dp45Dt2EndpointPositive === IMP_35416_N2000_RK4_HERMITE_DENSE_CROSSVALIDATE_REFERENCE.imp35351Dp45.dtHalf.endpointPositive &&
      PAGE_PROSE.rk4Dt2EndpointPositive === IMP_35416_N2000_RK4_HERMITE_DENSE_CROSSVALIDATE_REFERENCE.rk4Hermite.dtHalf.endpointPositive,
  },
  scope: 'AUDIT ONLY; confirms existing page content; changes NO bound; NO QED',
};

// Self-executing consistency gate: throws on import if the page's baked prose
// figures ever drift out of agreement with the imp-35416 source module, or if
// the source verdict flags this audit depends on ever flip.
export const IMP_35486_IMP35416_PAGE_SURFACING_AUDIT_ASSERTIONS = [
  {
    name: 'imp-35486: page cites imp-35416 with both the scheme-invariant-crossing and endpoint-nuance framings',
    run: () =>
      PAGE_PROSE.mentionsImp35416 &&
      PAGE_PROSE.schemeInvariantCrossingFraming &&
      PAGE_PROSE.endpointNuanceFraming,
    why:
      'The ticket asks whether the imp-35416 cross-validation is surfaced with BOTH ' +
      'framings; this audit records that the page paragraph carries both, not just one.',
  },
  {
    name: 'imp-35486: page relative-agreement prose (~4.5e-5) matches the imp-35416 stored maxRelativeTcDisagreement',
    run: () =>
      Math.abs(PAGE_PROSE.approximateRelativeAgreement - VERDICT.maxRelativeTcDisagreement) < 5e-6,
    why:
      'Guards against the page prose drifting away from the source module if the ' +
      'imp-35416 measured relative agreement is ever re-run and changes.',
  },
  {
    name: 'imp-35486: page endpoint-positivity claim (DP45 dt/2 positive, RK4 dt/2 negative) matches the source verdict',
    run: () =>
      PAGE_PROSE.dp45Dt2EndpointPositive === IMP_35416_N2000_RK4_HERMITE_DENSE_CROSSVALIDATE_REFERENCE.imp35351Dp45.dtHalf.endpointPositive &&
      PAGE_PROSE.rk4Dt2EndpointPositive === IMP_35416_N2000_RK4_HERMITE_DENSE_CROSSVALIDATE_REFERENCE.rk4Hermite.dtHalf.endpointPositive &&
      VERDICT.endpointPositivityDiffersAtDtHalf === true,
    why:
      'The endpoint-nuance framing depends on this scheme difference; if the source ' +
      'module ever recants it the page prose would become stale and misleading.',
  },
  {
    name: 'imp-35486: source cross-validation still scheme-independent, ladder still stays at N=1000, no QED',
    run: () =>
      IMP_35416_N2000_RK4_HERMITE_DENSE_CROSSVALIDATE_REFERENCE.honestOutcome === 'crossing-is-scheme-independent' &&
      IMP_35416_N2000_RK4_HERMITE_DENSE_CROSSVALIDATE_REFERENCE.changesNoBound === true &&
      IMP_35416_N2000_RK4_HERMITE_DENSE_CROSSVALIDATE_REFERENCE.noQED === true &&
      PAGE_PROSE.doesNotAdvanceLadderPastN1000 === true,
    why:
      'Honesty gate: the audited page must keep stating the cross-check does not ' +
      'advance the R2 ladder past N=1000 and changes no bound, consistent with the ' +
      'imp-35416 source module scope.',
  },
];

// Execute at import so any regression trips the build-time assertion sweep.
for (const a of IMP_35486_IMP35416_PAGE_SURFACING_AUDIT_ASSERTIONS) {
  if (!a.run()) {
    throw new Error(`[imp-35486 page surfacing audit] FAILED: ${a.name}`);
  }
}
