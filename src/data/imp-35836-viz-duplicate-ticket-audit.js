/**
 * @module imp-35836-viz-duplicate-ticket-audit
 *
 * imp-35836 (ux, S-frontier ticket audit): imp-35836 asked to "Seed an import-light viz-data
 * module + routed page for the imp-35763 merged REQ-4 required-height ladder (peak / sigma<0.9 /
 * crossover / sigma<0.5 / sigma<0.1 / PT anchor interleaved, with log T0 and the 200/log T0
 * required-height multiple per rung), if none already exists". Its own description said to
 * "First confirm no imp-35763-*-viz-data.js exists" before seeding.
 *
 * Auditing src/data/ BEFORE writing found this exact module already exists: the earlier
 * imp-35823 ticket seeded src/data/imp-35823-required-height-ladder-viz-data.js (baking the same
 * six rungs: peak, sigma<0.9, crossover~sigma<0.5, sigma<0.1, PT anchor, with logT0 and the
 * 200/logT0 required-height multiple) plus a routed page (src/pages/Imp35823RequiredHeightLadderViz.jsx,
 * route /viz-imp35823-required-height-ladder, registered in visualizations-index.js and App.jsx).
 * imp-35836 is a DUPLICATE ticket the frontier scout re-seeded after imp-35823 had already closed
 * this gap under a different id -- imp-35836's own module-name search pattern
 * ("imp-35763-*-viz-data.js") simply missed the imp-35823-named file.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new viz-data module and no new page -- imp-35823 already supplies both in full. No new
 * claim; changes no bound; NO QED.
 *
 * @see imp-35823-required-height-ladder-viz-data.js (the already-completed viz-data module)
 * @see imp-35823 (visualizations-index.js entry, route /viz-imp35823-required-height-ladder)
 * @see imp-35763-req4-required-height-sigma-landmark-fill.js (the source six-rung ladder both tickets describe)
 */

import { IMP35823_REQUIRED_HEIGHT_LADDER, IMP35823_LADDER_GRID } from './imp-35823-required-height-ladder-viz-data.js';

export const IMP35836_VIZ_DUPLICATE_TICKET_AUDIT = {
  id: 'imp-35836',
  proofSection: 'S-frontier',
  question:
    'imp-35836 asked to seed an import-light viz-data module + routed page for the imp-35763 ' +
    'merged six-rung REQ-4 required-height ladder, conditional on none already existing; audit ' +
    'whether one already exists before seeding a duplicate.',
  finding:
    'DUPLICATE TICKET. A viz-data module and routed page for exactly this six-rung ladder already ' +
    'exist -- imp-35823-required-height-ladder-viz-data.js (six rungs: peak, sigma<0.9, ' +
    'crossover~sigma<0.5, sigma<0.1, PT anchor, each with logT0 and the 200/logT0 required-height ' +
    'multiple) plus Imp35823RequiredHeightLadderViz.jsx routed at /viz-imp35823-required-height-ladder ' +
    'and registered in visualizations-index.js. imp-35836 asked for the identical content under a ' +
    'different ticket id.',
  duplicateOf: 'imp-35823',
  routePath: '/viz-imp35823-required-height-ladder',
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new viz-data module or page added -- imp-35823 already supplies both in full. ' +
    'This module records the duplicate-ticket finding and pins a permanent regression guard ' +
    'confirming the imp-35823 six-rung ladder stays present and complete. Changes no bound; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
};

const IMP35836_ASSERTIONS = [
  {
    id: 'imp35836-existing-module-has-six-rungs',
    description: 'the pre-existing imp-35823 ladder still has exactly the six named rungs imp-35836 asked for',
    holds: () =>
      IMP35823_REQUIRED_HEIGHT_LADDER.length === 6 &&
      ['peak', 'sigma0_9', 'sigma0_5', 'cross', 'sigma0_1', 'pt'].every((key) =>
        IMP35823_REQUIRED_HEIGHT_LADDER.some((r) => r.key === key),
      ),
  },
  {
    id: 'imp35836-existing-module-carries-logt0-and-multiple',
    description: 'every rung carries both logT0 and the 200/logT0 required-height multiple imp-35836 requested',
    holds: () =>
      IMP35823_LADDER_GRID.every(
        (r) => Number.isFinite(r.logT0) && Number.isFinite(r.requiredMultiple) && Number.isFinite(r.logHeightGap),
      ),
  },
  {
    id: 'imp35836-honesty-gate-no-qed',
    description: 'audit finding is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35836_VIZ_DUPLICATE_TICKET_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35836_VIZ_DUPLICATE_TICKET_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35836_VIZ_DUPLICATE_TICKET_AUDIT.verdict),
  },
];

for (const a of IMP35836_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35836-viz-duplicate-ticket-audit assertion failed: ${a.id}`);
  }
}
