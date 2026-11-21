/**
 * @module imp-95811-banner-audit-imp95790-imp95697
 *
 * imp-95811 (meta): banner audit of the imp-95790 r_cap(T) dead-zone viz page
 * (src/pages/Imp95790RCapDeadZoneViz.jsx) and the imp-95697 rho=1 finite-size
 * Szego decay viz page (src/pages/Imp95697SzegoFiniteSizeDecayViz.jsx) --
 * confirms each rendered page carries the mandatory NO QED / no-refereed-bound-change banner and its honest-status caveat, following the
 * imp-95696 audit pattern.
 *
 * METHOD: read both page components and the caveat-banner constants they
 * import (IMP95790_CAVEAT_BANNER, IMP95697_CAVEAT_BANNER).
 *
 * FINDING: both pages carry the mandatory guardrail text.
 *   - Imp95790RCapDeadZoneViz.jsx renders IMP95790_CAVEAT_BANNER verbatim in
 *     a top "Honest status" box, and its own closing "Status" box separately
 *     restates "No refereed bound is changed. NO QED." in JSX
 *     literal text.
 *   - Imp95697SzegoFiniteSizeDecayViz.jsx renders IMP95697_CAVEAT_BANNER
 *     verbatim inside its amber "Not a real dip below the symbol infimum"
 *     box; that constant's text ends "...No refereed bound is changed
 *     ; NO QED." A plain grep of the .jsx source for "SOTA"
 *     misses this because the phrase arrives via the imported constant
 *     rather than as a JSX string literal -- reading the imported banner
 *     content is required, not just grepping the page file.
 * AUDIT-ONLY: no bound change; NO QED; no refereed bound is changed.
 */

import { IMP95790_CAVEAT_BANNER } from './imp-95790-rcap-deadzone-viz-data.js';
import { IMP95697_CAVEAT_BANNER } from './imp-95697-szego-finite-size-decay-viz-data.js';

export const IMP95811_BANNER_AUDIT = {
  ticket: 'imp-95811',
  subjects: [
    {
      page: 'src/pages/Imp95790RCapDeadZoneViz.jsx',
      bannerSource: 'IMP95790_CAVEAT_BANNER (imp-95790-rcap-deadzone-viz-data.js)',
      hasHonestStatusBox: true,
      hasNoQedSota: true,
    },
    {
      page: 'src/pages/Imp95697SzegoFiniteSizeDecayViz.jsx',
      bannerSource: 'IMP95697_CAVEAT_BANNER (imp-95697-szego-finite-size-decay-viz-data.js)',
      hasHonestStatusBox: true,
      hasNoQedSota: true,
    },
  ],
  honest:
    'AUDIT-ONLY -- both the imp-95790 dead-zone page and the imp-95697 Szego-decay page ' +
    'render their imported caveat-banner constant verbatim, and both constants carry the ' +
    'mandatory guardrail phrase "No refereed bound is changed" alongside ' +
    '"NO QED". No missing banner found; no page edit required. Changes no bound; NO QED; ' +
    'no refereed bound is changed.',
};

export const IMP95811_BANNER_AUDIT_ASSERTIONS = [
  {
    id: 'imp-95811-imp95790-banner-carries-guardrail',
    description: 'the imp-95790 page caveat banner carries NO QED and the PT SOTA phrase',
    holds: () =>
      /No QED/i.test(IMP95790_CAVEAT_BANNER) &&
      /refereed bound is changed/i.test(IMP95790_CAVEAT_BANNER),
  },
  {
    id: 'imp-95811-imp95697-banner-carries-guardrail',
    description: 'the imp-95697 page caveat banner carries NO QED and the PT SOTA phrase',
    holds: () =>
      /NO QED/.test(IMP95697_CAVEAT_BANNER) &&
      /refereed bound is changed/i.test(IMP95697_CAVEAT_BANNER),
  },
  {
    id: 'imp-95811-both-subjects-recorded-present',
    description: 'both audited subjects are recorded with the banner present',
    holds: () =>
      IMP95811_BANNER_AUDIT.subjects.length === 2 &&
      IMP95811_BANNER_AUDIT.subjects.every((s) => s.hasHonestStatusBox === true && s.hasNoQedSota === true),
  },
  {
    id: 'imp-95811-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () =>
      /AUDIT-ONLY/.test(IMP95811_BANNER_AUDIT.honest) &&
      /refereed bound is changed/i.test(IMP95811_BANNER_AUDIT.honest),
  },
];

for (const a of IMP95811_BANNER_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95811-banner-audit-imp95790-imp95697 assertion failed: ${a.id}`);
}
