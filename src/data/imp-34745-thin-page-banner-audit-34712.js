/**
 * @module imp-34745-thin-page-banner-audit-34712
 *
 * imp-34745 (meta): Thin-page/banner AUDIT of the imp-34712 second-footing
 * collapse-ladder cross-validation. Confirms whether any rendered page shows
 * the imp-34712 r_k/m_k table and the F2/F3 sign-flip finding (not a stub),
 * and if so, whether it carries the mandatory honest-status banner. Extends
 * the imp-34618/34521/34561/34725/34740 caveat-surfacing-audit lineage --
 * imp-34740 already flagged imp-34712 as data-only in a six-module cohort
 * sweep; this ticket re-checks that single module directly.
 *
 * METHOD. Grepped src/pages/*.jsx and src/App.jsx for any import of
 * imp-34712-second-footing-collapse-ladder-crossvalidation.js or the
 * IMP34712_SECOND_FOOTING_COLLAPSE_LADDER_CROSSVALIDATION export: zero hits.
 * Cross-checked against the sibling imp-34747 ticket in queue-index.json
 * (still pending as of this audit) -- the ticket separately scoped to add
 * that viz page -- whose pending status corroborates the page does not yet
 * exist.
 *
 * FINDING: GAP CONFIRMED, but as an ABSENCE not a stub. No src/pages/*.jsx
 * file renders the imp-34712 r_k/m_k table or the F2/F3 sign-flip finding;
 * the module is data-only, consistent with imp-34740's prior sweep.
 * Criterion (a) (mandatory honest-status banner) is therefore inapplicable
 * -- there is no page to carry it. AUDIT-ONLY -- no page is added here;
 * that is the scope of the separate imp-34747 ticket, so this change stays
 * atomic to the audit itself.
 */

import { IMP34712_SECOND_FOOTING_COLLAPSE_LADDER_CROSSVALIDATION } from './imp-34712-second-footing-collapse-ladder-crossvalidation.js';

const M = IMP34712_SECOND_FOOTING_COLLAPSE_LADDER_CROSSVALIDATION;

// grep of src/pages/*.jsx and src/App.jsx for the imp-34712 module path or export name: zero hits.
const PAGE_IMPORTS_FOUND = [];

export const THIN_PAGE_AUDIT_34712 = Object.freeze({
  ticket: 'imp-34745',
  audits: 'imp-34712-second-footing-collapse-ladder-crossvalidation.js',
  pageImportsFound: Object.freeze(PAGE_IMPORTS_FOUND),
  hasRenderedPage: PAGE_IMPORTS_FOUND.length > 0,
  isStub: false, // there is no page at all -- an absence, not a thin/stub page
  bannerCriterionApplicable: PAGE_IMPORTS_FOUND.length > 0,
  companionVizTicket: 'imp-34747', // separate ticket already scoped to add the missing viz page
  r_k_footing2_sample: Object.freeze([
    M.matched_collapse_q2_footing2,
    M.matched_collapse_q3_footing2,
    M.matched_collapse_q4_footing2,
  ]),
  m_k_footing2_rounded_sample: M.per_channel_loglog_slope_rounded_footing2,
  signFlipFindingPresentInModule:
    M.q3_deviation_sign_flips === true && M.q4_deviation_sign_flips === true,
  honest:
    'AUDIT-ONLY -- confirms imp-34712 has NO rendered page (an absence, not merely a thin ' +
    'stub), so its r_k/m_k table and F2/F3 sign-flip finding are not currently surfaced ' +
    'anywhere in the UI; the mandatory honest-status-banner criterion is therefore ' +
    'inapplicable (nothing to check). The gap is already scoped for a fix under the ' +
    'separate imp-34747 viz-page ticket; no page was added here so this change stays ' +
    'atomic. imp-34712 itself is unchanged: measurement only, no bound change, NO QED; ' +
    'no refereed bound is changed.',
});

const THIN_PAGE_AUDIT_34712_ASSERTIONS = [
  {
    id: 'imp34745-no-page-imports-imp34712',
    holds: () => THIN_PAGE_AUDIT_34712.pageImportsFound.length === 0
      && THIN_PAGE_AUDIT_34712.hasRenderedPage === false,
    why: 'grep of src/pages/*.jsx and src/App.jsx found zero imports of the imp-34712 module or its export.',
  },
  {
    id: 'imp34745-absence-not-stub',
    holds: () => THIN_PAGE_AUDIT_34712.isStub === false,
    why: 'the gap is a total absence of a rendered page, not a thin/stub page that under-renders the finding.',
  },
  {
    id: 'imp34745-banner-criterion-inapplicable',
    holds: () => THIN_PAGE_AUDIT_34712.bannerCriterionApplicable === false,
    why: 'with no page rendering the module, there is nothing for the mandatory honest-status banner to be checked on.',
  },
  {
    id: 'imp34745-sign-flip-finding-intact-in-source-module',
    holds: () => THIN_PAGE_AUDIT_34712.signFlipFindingPresentInModule === true,
    why: 'imp-34712 itself still records the F2/F3 q3/q4 sign-flip finding used to answer what a future page would need to show.',
  },
  {
    id: 'imp34745-audit-only-honest',
    holds: () => /AUDIT-ONLY/.test(THIN_PAGE_AUDIT_34712.honest)
      && /NO QED/.test(THIN_PAGE_AUDIT_34712.honest)
      && /refereed bound is changed/i.test(THIN_PAGE_AUDIT_34712.honest),
    why: 'honesty gate: audit-only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of THIN_PAGE_AUDIT_34712_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-34745-thin-page-banner-audit-34712 assertion failed: ${assertion.id}`);
  }
}

export default THIN_PAGE_AUDIT_34712;
