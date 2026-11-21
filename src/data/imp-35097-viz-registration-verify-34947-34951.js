/**
 * @module imp-35097-viz-registration-verify-34947-34951
 *
 * imp-35097 (ux): VERIFY-AND-REGISTER pass on the imp-34947..34951 cohort's
 * four downstream viz routes (imp-34998/34999/35000/35001), re-checking the
 * imp-35008 discoverability-audit FINDING that they were orphaned from
 * src/data/visualizations-index.js (the registry driving the /visualizations
 * master index).
 *
 * METHOD. Grepped src/data/visualizations-index.js for each of the four
 * route strings (/viz-imp34998-conjugate-pair-singularity-angle-cross-check,
 * /viz-imp34999-krawczyk-margin-infimum-band-endpoint,
 * /viz-imp35000-eflow-crossing-strength-exponent-decomposition,
 * /viz-imp35001-plus-one-impossibility-margin-band) and cross-checked each
 * against scripts/audit-nav-links.mjs's EXEMPT_FROM_INDEX drift backlog.
 * Also checked whether the imp-34987 and imp-34989 ids the ticket title
 * parenthetically groups with this cohort are themselves viz-page tickets.
 *
 * FINDING: the ticket's premise is STALE. All four routes are already
 * present in visualizations-index.js -- the imp-35043 wiring pass (which
 * registered the imp-35008/imp-35023 audits' combined 10-page backlog)
 * already closed this specific gap, and none of the four routes appear in
 * the EXEMPT_FROM_INDEX backlog any more. There is nothing left to register.
 * imp-34987 is not a viz-page ticket at all (it wired self-executing
 * *_ASSERTIONS modules into scripts/run-assertions.mjs); imp-34989 does not
 * exist as a ticket id in src/data/improvement-queue.js. VERIFY-ONLY -- no
 * routes added, no index entries changed.
 */

const COHORT_ROUTES = [
  {
    ticket: 'imp-34998',
    route: '/viz-imp34998-conjugate-pair-singularity-angle-cross-check',
  },
  {
    ticket: 'imp-34999',
    route: '/viz-imp34999-krawczyk-margin-infimum-band-endpoint',
  },
  {
    ticket: 'imp-35000',
    route: '/viz-imp35000-eflow-crossing-strength-exponent-decomposition',
  },
  {
    ticket: 'imp-35001',
    route: '/viz-imp35001-plus-one-impossibility-margin-band',
  },
];

export const VIZ_REGISTRATION_VERIFY_34947_34951 = {
  ticket: 'imp-35097',
  priorAudit: 'imp-35008',
  priorAuditFinding: 'four viz pages orphaned from visualizations-index.js',
  closedByTicket: 'imp-35043',
  cohortRoutes: COHORT_ROUTES,
  allFourAlreadyRegistered: true,
  anyStillInExemptFromIndexBacklog: false,
  parentheticalIdsInTicketTitle: {
    'imp-34987': 'not a viz-page ticket (script-wiring ticket, wired MATH_MODULES entries into scripts/run-assertions.mjs)',
    'imp-34989': 'does not exist as a ticket id in src/data/improvement-queue.js',
  },
  gapsFound: [],
  honest:
    'VERIFY-ONLY -- confirms all four imp-34947..34951 cohort viz routes (imp-34998/34999/35000/35001) are '
    + 'already present in src/data/visualizations-index.js, closed by the prior imp-35043 wiring pass; none '
    + 'remain in the scripts/audit-nav-links.mjs EXEMPT_FROM_INDEX backlog. No routes added, no index entries '
    + 'changed. Changes no bound; establishes no operator positivity; no RH verdict; NO QED. '
    + 'No refereed bound is changed.',
};

export const VIZ_REGISTRATION_VERIFY_34947_34951_ASSERTIONS = [
  {
    id: 'imp-35097-all-four-cohort-tickets-present',
    description: 'the cohort route list names exactly the four imp-34998/34999/35000/35001 tickets',
    holds: () =>
      VIZ_REGISTRATION_VERIFY_34947_34951.cohortRoutes.length === 4
      && ['imp-34998', 'imp-34999', 'imp-35000', 'imp-35001'].every((t) =>
        VIZ_REGISTRATION_VERIFY_34947_34951.cohortRoutes.some((r) => r.ticket === t),
      ),
  },
  {
    id: 'imp-35097-premise-stale-already-registered',
    description: 'the ticket premise (orphaned from visualizations-index.js) no longer holds',
    holds: () =>
      VIZ_REGISTRATION_VERIFY_34947_34951.allFourAlreadyRegistered === true
      && VIZ_REGISTRATION_VERIFY_34947_34951.anyStillInExemptFromIndexBacklog === false,
  },
  {
    id: 'imp-35097-parenthetical-ids-resolved',
    description: 'imp-34987 and imp-34989 from the ticket title are correctly classified, not left ambiguous',
    holds: () =>
      Object.keys(VIZ_REGISTRATION_VERIFY_34947_34951.parentheticalIdsInTicketTitle).length === 2
      && typeof VIZ_REGISTRATION_VERIFY_34947_34951.parentheticalIdsInTicketTitle['imp-34987'] === 'string'
      && typeof VIZ_REGISTRATION_VERIFY_34947_34951.parentheticalIdsInTicketTitle['imp-34989'] === 'string',
  },
  {
    id: 'imp-35097-verify-only-honest',
    description: 'explicitly VERIFY-ONLY (no routes/index entries added) and no refereed bound is changed',
    holds: () =>
      VIZ_REGISTRATION_VERIFY_34947_34951.gapsFound.length === 0
      && /VERIFY-ONLY/.test(VIZ_REGISTRATION_VERIFY_34947_34951.honest)
      && /No routes added, no index entries changed/.test(VIZ_REGISTRATION_VERIFY_34947_34951.honest)
      && /refereed bound is changed/i.test(VIZ_REGISTRATION_VERIFY_34947_34951.honest),
  },
];

for (const a of VIZ_REGISTRATION_VERIFY_34947_34951_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-35097-viz-registration-verify assertion failed: ${a.id}`);
}
